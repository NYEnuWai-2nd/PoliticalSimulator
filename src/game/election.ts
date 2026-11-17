// 総選挙（設計は docs/design.md の「総選挙」）
// 画面には依存しない。全国の政党支持を決め、小選挙区ごとに候補者を立てて得票を計算し、比例をドント式で配る。
import rulesRaw from "../../data/game/rules.json";
import { PARTIES, partyById } from "./parties.js";
import type { Member, MemberFactory } from "./roster.js";
import { INITIAL_RULING } from "./cabinet.js";
import type { Ruling } from "./cabinet.js";
import { DISTRICTS, PREF_CODES, PR_SEATS, dhondt, prefOfDistrict, prefWeight } from "./districts.js";
import { dynDistrictStrength, dynPrefStrength, existingParties, partyExists, resolveParty, supportBaseOf } from "./realign.js";
import type { Realign } from "./realign.js";
import type { DistrictId, PrefCode } from "./districts.js";
import { TABLES } from "./tables.js";
import { skillVote } from "./skills.js";
import { applyPacts } from "./opposition.js";
import type { Pact } from "./opposition.js";

const E = rulesRaw.election;
/** 選挙協力をする小さい連立相手（全国の支持が小さく、現職の県だけで候補を立てる） */
const SMALL_PARTNERS = new Set(["kosei"]);

/** 区での党の票の基礎（全国の支持 × 区での強さ） */
const localVote = (support: Record<string, number>, d: DistrictId, party: string, dyn?: Realign) =>
  (support[party] ?? 0) * (E.regional_base + E.regional_strength * dynDistrictStrength(dyn, d, party));

/** 選挙協力：与党第一党が立てない区では、その票の一部が連立相手に流れる */
function addPartnerTransfer(local: Record<string, number>, running: string[], support: Record<string, number>, d: DistrictId, ruling: Ruling, dyn?: Realign): void {
  for (const partner of ruling.partners)
    if (running.includes(partner) && !running.includes(ruling.party)) local[partner] += localVote(support, d, ruling.party, dyn) * E.partner_transfer;
}

export interface Candidacy {
  member: Member;
  /** 得票率（0〜1） */
  share: number;
}

export interface DistrictResult {
  district: DistrictId;
  pref: PrefCode;
  /** 得票率の高い順 */
  candidates: Candidacy[];
  winner: Member;
}

export interface ElectionResult {
  year: number;
  month: number;
  /** 全国の政党支持（比例の得票率、%） */
  support: Record<string, number>;
  smd: DistrictResult[];
  /** 政党ごとの比例の当選者 */
  pr: Record<string, Member[]>;
  /** 新しい議員の名簿（小選挙区と比例） */
  roster: Member[];
  /** 落選して浪人になった人（元議員と、落選した新人候補） */
  ronin: Member[];
  /** 高齢で引退した議員 */
  retired: Member[];
}

export interface ElectionInput {
  year: number;
  month: number;
  /** 選挙前の議員 */
  roster: Member[];
  /** 与党と連立相手（全国の風と選挙協力に使う） */
  ruling?: Ruling;
  /** 浪人中の元議員と、前回落選した候補 */
  ronin: Member[];
  /** 内閣支持率（%）。基準からのずれが全国の風になる */
  approval: number;
  factory: MemberFactory;
  /** 決まった候補者（プレイヤーなど）。その区のその党の候補として必ず立てる */
  forced?: { district: DistrictId; party: string; member: Member; bonus?: number }[];
  /** 比例名簿に決まった順位で載せる候補（プレイヤーなど）。rank は0から */
  forcedPr?: { party: string; member: Member; rank: number }[];
  /** 今回の選挙で引退させる議員（プレイヤーに地盤を譲る親など） */
  retireIds?: number[];
  /** 党ごとに全国の支持に足すポイント（野党の追い風） */
  partyBonus?: Record<string, number>;
  /** 野党の選挙協力（候補者の一本化） */
  pacts?: Pact[];
  /** 政界再編のあとの党の勢力（合流、分裂、途中で結成された党） */
  realign?: Realign;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const ageAt = (m: Member, year: number) => year - m.birthYear;

/** 全国の政党支持（%）。合計100 */
/** bonus は党ごとに全国の支持に足すポイント（野党の追い風など） */
export function nationalSupport(approval: number, rand: () => number, ruling: Ruling = INITIAL_RULING, bonus: Record<string, number> = {}, dyn?: Realign): Record<string, number> {
  const out: Record<string, number> = {};
  for (const id of existingParties(dyn)) out[id] = Math.max(E.support_floor, supportBaseOf(dyn, id));
  const total = Object.values(out).reduce((a, b) => a + b, 0);
  for (const id of Object.keys(out)) out[id] = (out[id] / total) * 100;
  // 全国の風：内閣支持率が基準より高ければ与党が伸び、低ければ減る。増減は他党が支持の比で引き受ける
  // 基準は内閣として「ふつう」の支持率（wind_reference）。それより低ければ与党に逆風になる
  const dev = approval - E.wind_reference;
  const shift: Record<string, number> = { [ruling.party]: dev * E.wind_ruling };
  for (const p of ruling.partners) if (p in out) shift[p] = dev * E.wind_partner;
  const moved = Object.values(shift).reduce((a, b) => a + b, 0);
  const others = Object.keys(out).filter((id) => !(id in shift));
  const othersTotal = others.reduce((a, id) => a + out[id], 0);
  for (const id of Object.keys(shift)) out[id] += shift[id];
  for (const id of others) out[id] -= (moved * out[id]) / othersTotal;
  for (const id of Object.keys(out)) out[id] = Math.max(E.support_floor * 0.5, out[id] + (bonus[id] ?? 0) + (rand() - 0.5) * 2 * E.support_noise);
  const t2 = Object.values(out).reduce((a, b) => a + b, 0);
  for (const id of Object.keys(out)) out[id] = Math.round((out[id] / t2) * 1000) / 10;
  return out;
}

/** その区で候補者を立てる政党（県の中で2024年に議席を取った党と、いつも立てる党） */
export function partiesRunning(district: DistrictId, incumbentParty: string | undefined, ruling: Ruling = INITIAL_RULING, dyn?: Realign): string[] {
  const pref = prefOfDistrict(district);
  const set = new Set<string>();
  if (incumbentParty && !partyById(incumbentParty).is_independent) set.add(incumbentParty);
  for (const id of E.always_run) set.add(resolveParty(dyn, id));
  for (const id of existingParties(dyn)) if (dynPrefStrength(dyn, pref, id) > 0) set.add(id);
  // 議席のまとまった新しい党（全国の支持の基準が new_party_run_support 以上）は、どの区にも候補を立てる
  for (const id of dyn?.formed ?? []) if (partyExists(dyn, id) && supportBaseOf(dyn, id) >= E.new_party_run_support) set.add(id);
  // 連立相手が現職の区では、与党第一党は候補を立てない（選挙協力）。連立相手は現職の区でだけ立てる
  for (const partner of ruling.partners.filter((p) => SMALL_PARTNERS.has(p))) {
    if (incumbentParty === partner) set.delete(ruling.party);
    else set.delete(partner);
  }
  return [...set];
}

function personalVote(m: Member, incumbent: boolean, rand: () => number): number {
  return (
    (m.jiban - 2) * E.personal_jiban +
    (m.abilities.知名度 - 50) * E.personal_fame +
    (m.abilities.組織 - 50) * E.personal_org +
    (incumbent ? E.incumbency : 0) +
    skillVote(m.skills) +
    (rand() - 0.5) * 2 * E.personal_noise
  );
}

function tierNameFor(terms: number): string {
  const t = TABLES.term_tiers.find((x) => terms >= x.terms[0] && terms <= x.terms[1]);
  return (t ?? TABLES.term_tiers[TABLES.term_tiers.length - 1]).name;
}

/** 当選した人を議員として更新する */
function elect(m: Member, seat: "小選挙区" | "比例", district: DistrictId | null): Member {
  const terms = m.terms + 1;
  return { ...m, terms, tier: tierNameFor(terms), seat, district: seat === "小選挙区" ? district : null, home: district ? prefOfDistrict(district) : m.home };
}

/** 落選した人を浪人にする。元議員は地盤が少し減る */
function toRonin(m: Member): Member {
  const wasMember = m.seat !== "なし";
  return { ...m, seat: "なし", district: null, jiban: wasMember ? Math.max(1, m.jiban - E.ronin_jiban_loss) : m.jiban };
}

export async function runElection(input: ElectionInput): Promise<ElectionResult> {
  const { factory, year } = input;
  const rand = factory.rand;
  const ruling = input.ruling ?? INITIAL_RULING;
  const dyn = input.realign;
  const support = nationalSupport(input.approval, rand, ruling, input.partyBonus, dyn);

  // 引退：高齢の議員は立候補しない（首相などの固定キャラクターは引退させない）
  const forcedRetire = new Set(input.retireIds ?? []);
  const retired = input.roster.filter((m) => forcedRetire.has(m.id) || ((!m.fixedRole || m.fixedRole === "党首") && ageAt(m, year) >= E.retire_age));
  const retiredIds = new Set(retired.map((m) => m.id));
  const sitting = input.roster.filter((m) => !retiredIds.has(m.id));
  const used = new Set<number>();
  const ronin = [...input.ronin];

  async function candidateFor(party: string, d: DistrictId): Promise<{ member: Member; incumbent: boolean; bonus?: number }> {
    const pref = prefOfDistrict(d);
    const forced = input.forced?.find((f) => f.district === d && f.party === party);
    if (forced) return { member: forced.member, incumbent: forced.member.seat === "小選挙区" && forced.member.district === d, bonus: forced.bonus };
    const inc = sitting.find((m) => m.seat === "小選挙区" && m.district === d && m.party === party);
    if (inc) return { member: inc, incumbent: true };
    // 地元の浪人のうち、当選回数の多い人を優先する
    const r = ronin.filter((m) => m.party === party && m.home === pref && !used.has(m.id)).sort((a, b) => b.terms - a.terms || a.id - b.id)[0];
    if (r) return { member: r, incumbent: false };
    return { member: await factory.create(partyById(party), { seat: "なし", home: pref }), incumbent: false };
  }

  // 小選挙区
  const smd: DistrictResult[] = [];
  for (const { id: district, pref } of DISTRICTS) {
    const incumbent = sitting.find((m) => m.seat === "小選挙区" && m.district === district);
    let running = partiesRunning(district, incumbent?.party, ruling, dyn);
    // 決まった候補者の党は、その区で必ず候補を立てる
    for (const f of input.forced ?? []) if (f.district === district && !running.includes(f.party)) running.push(f.party);
    const local: Record<string, number> = {};
    for (const p of running) local[p] = localVote(support, district, p, dyn);
    // 選挙協力：与党第一党が立てない区では、その票の一部が連立相手に流れる
    addPartnerTransfer(local, running, support, district, ruling, dyn);
    // 野党の選挙協力（候補者の一本化）：相手が候補を降ろし、票の一部が移る
    running = applyPacts(local, running, input.pacts ?? []);
    const localTotal = Object.values(local).reduce((a, b) => a + b, 0) || 1;
    const entries: { member: Member; raw: number }[] = [];
    for (const p of running) {
      const { member, incumbent: isInc, bonus } = await candidateFor(p, district);
      used.add(member.id);
      entries.push({ member, raw: Math.max(0.01, local[p] / localTotal + personalVote(member, isInc, rand) + (bonus ?? 0)) });
    }
    // 無所属の現職は党の票を持たず、本人の票だけで戦う
    if (incumbent && partyById(incumbent.party).is_independent) {
      used.add(incumbent.id);
      entries.push({ member: incumbent, raw: Math.max(0.01, 0.25 + personalVote(incumbent, true, rand) * 2) });
    }
    const sum = entries.reduce((a, e) => a + e.raw, 0);
    const candidates = entries.map((e) => ({ member: e.member, share: e.raw / sum })).sort((a, b) => b.share - a.share || a.member.id - b.member.id);
    smd.push({ district, pref, candidates, winner: candidates[0].member });
  }

  // 比例：ドント式で配り、党の名簿の上から当選させる
  const prSeats = dhondt(support, PR_SEATS);
  const pr: Record<string, Member[]> = {};
  for (const p of PARTIES) {
    const n = prSeats.get(p.id) ?? 0;
    if (!n) continue;
    // 名簿の順：比例の現職（当選回数の多い順）→ 小選挙区に出なかった浪人 → 新人
    const forcedPrIds = new Set((input.forcedPr ?? []).map((f) => f.member.id));
    const list = [
      ...sitting.filter((m) => m.party === p.id && m.seat === "比例" && !forcedPrIds.has(m.id)).sort((a, b) => b.terms - a.terms || b.abilities.知名度 - a.abilities.知名度),
      ...ronin.filter((m) => m.party === p.id && !used.has(m.id) && !forcedPrIds.has(m.id)).sort((a, b) => b.terms - a.terms),
    ];
    for (const f of (input.forcedPr ?? []).filter((x) => x.party === p.id)) list.splice(Math.min(f.rank, list.length), 0, f.member);
    const elected: Member[] = [];
    for (const m of list) {
      if (elected.length >= n) break;
      used.add(m.id);
      elected.push(m);
    }
    while (elected.length < n) {
      // 新人の地元は県の大きさ（2024年の小選挙区の数）の比で選ぶ
      let r = rand() * PREF_CODES.reduce((a, x) => a + prefWeight(x), 0);
      const home = PREF_CODES.find((x) => (r -= prefWeight(x)) <= 0) ?? PREF_CODES[PREF_CODES.length - 1];
      elected.push(await factory.create(p, { seat: "なし", home }));
    }
    pr[p.id] = elected;
  }

  // 新しい名簿
  const roster: Member[] = [];
  for (const d of smd) {
    const w = d.winner;
    let won = elect(w, "小選挙区", d.district);
    // 大きく勝つと地盤が固まる
    if (d.candidates[0].share > 0.5 && rand() < E.jiban_win_gain) won = { ...won, jiban: clamp(won.jiban + 1, 1, 4) };
    if (won.jiban < 2) won = { ...won, jiban: 2 };
    roster.push(won);
  }
  for (const p of PARTIES) for (const m of pr[p.id] ?? []) roster.push(elect(m, "比例", null));

  // 落選した人：選挙区で負けた候補、比例の名簿で届かなかった現職、今回出なかった浪人
  const electedIds = new Set(roster.map((m) => m.id));
  const losers = new Map<number, Member>();
  // 新人候補は惜敗（得票率が ronin_keep_share 以上）のときだけ次を狙って残る。高齢の元議員は引退する
  for (const d of smd)
    for (const c of d.candidates) {
      if (electedIds.has(c.member.id)) continue;
      if (ageAt(c.member, year) >= E.ronin_max_age) continue;
      if (c.member.seat === "なし" && c.member.terms === 0 && c.share < E.ronin_keep_share) continue;
      losers.set(c.member.id, toRonin(c.member));
    }
  for (const m of sitting) if (!electedIds.has(m.id) && !losers.has(m.id)) losers.set(m.id, toRonin(m));
  for (const m of ronin) if (!electedIds.has(m.id) && !losers.has(m.id)) losers.set(m.id, m);

  return { year, month: input.month, support, smd, pr, roster, ronin: [...losers.values()], retired };
}

/** 政党ごとの議席数（小選挙区・比例・計） */
export function seatSummary(roster: Member[]): { party: string; smd: number; pr: number; total: number }[] {
  return PARTIES.map((p) => {
    const ms = roster.filter((m) => m.party === p.id);
    const smd = ms.filter((m) => m.seat === "小選挙区").length;
    return { party: p.id, smd, pr: ms.length - smd, total: ms.length };
  }).filter((x) => x.total > 0);
}

/**
 * 選挙区の情勢の見込み（揺らぎを除いた得票率）。画面の「情勢」に使う。
 * entries は立候補する党と候補者（いなければ平均的な新人として扱う）。
 */
export function estimateDistrict(
  district: DistrictId,
  approval: number,
  entries: { party: string; member?: Member; incumbent: boolean; bonus?: number }[],
  ruling: Ruling = INITIAL_RULING,
  extra: { bonus?: Record<string, number>; pacts?: Pact[]; realign?: Realign } = {},
): { party: string; member?: Member; share: number }[] {
  const dyn = extra.realign;
  const support = nationalSupport(approval, () => 0.5, ruling, extra.bonus, dyn);
  const local: Record<string, number> = {};
  for (const p of entries.map((e) => e.party)) local[p] = localVote(support, district, p, dyn);
  addPartnerTransfer(local, entries.map((e) => e.party), support, district, ruling, dyn);
  // 選挙協力で候補を降ろした党は、見込みの一覧から外す
  const running = applyPacts(local, entries.map((e) => e.party), extra.pacts ?? []);
  entries = entries.filter((e) => running.includes(e.party));
  const localTotal = Object.values(local).reduce((a, b) => a + b, 0) || 1;
  const raw = entries.map((e) => Math.max(0.01, local[e.party] / localTotal + (e.member ? personalVote(e.member, e.incumbent, () => 0.5) : 0) + (e.bonus ?? 0)));
  const sum = raw.reduce((a, b) => a + b, 0);
  return entries.map((e, i) => ({ party: e.party, member: e.member, share: raw[i] / sum }));
}
