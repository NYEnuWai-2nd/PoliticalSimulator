// 議員人生モード（設計は docs/design.md の5節）
// プレイヤーは新人候補として始め、毎月1つ活動を選んで経験点をため、能力を上げ、総選挙での当選を目指す。
// 落選しても浪人として続け、何年もかけて地盤を固められる。当選すれば議員として続き、役職に就くこともある。
// 政権は AI が動かす（ai.ts）。状態 CareerState は JSON で保存できる形にし、名簿などは CareerWorld に分ける。
// 画面に依存しないので、ブラウザでも CLI（src/cli/）でも同じように動く。
import careerRaw from "../../data/game/career.json";
import lifeRaw from "../../data/game/life_events.json";
import { mulberry32 } from "../lib/nameGenerator.js";
import type { Member, MemberFactory } from "./roster.js";
import { START_YEAR } from "./roster.js";
import type { Appointment, Ruling } from "./cabinet.js";
import { formGovernment } from "./cabinet.js";
import politicsRaw from "../../data/game/politics.json";
import { describe as describeRuling, formCoalition, leaderElection, pickLeader } from "./politics.js";
import type { LeaderElection } from "./politics.js";
import { ABILITIES, TABLES, centerOf } from "./tables.js";
import type { Ability } from "./tables.js";
import { partyById } from "./parties.js";
import { SMD_SEATS } from "./districts.js";
import type { PrefCode } from "./districts.js";
import { PREFECTURES } from "../map/japanMap.js";
import { BILLS, billName, createGame, endTurn, nemawashi, pressConference, startDrafting, submitBill, talkWithParty } from "./game.js";
import type { GameState } from "./game.js";
import { aiGovernmentActions, aiWantsDissolution } from "./ai.js";
import { estimateDistrict, partiesRunning, runElection } from "./election.js";

const C = careerRaw;
const PL = politicsRaw;

export type OriginId = "newcomer" | "hereditary" | "dynasty";
export type RouteId = "smd" | "successor" | "pr";
export type ExpId = "election" | "policy" | "network" | "media" | "money";
export type RelationId = "secretary" | "party" | "supporters" | "press" | "kengi";
export type Exp = Record<ExpId, number>;

export interface Origin {
  id: OriginId;
  name: string;
  difficulty: string;
  description: string;
  lineage: "none" | "hereditary" | "dynasty";
  jiban: number;
  money: number;
  bonus: Partial<Record<Ability, number>>;
  relations: Record<RelationId, number>;
}

export interface Activity {
  id: string;
  name: string;
  icon: string;
  description: string;
  stamina: number;
  exp: Partial<Exp>;
  jiban_progress?: number;
  money_per_ability?: number;
  mood_up_chance?: number;
  max_stamina?: number;
  relations: Partial<Record<RelationId, number>>;
}

interface Effects {
  /** 内閣支持率の増減 */
  approval?: number;
  stamina?: number;
  max_stamina?: number;
  mood?: number;
  money?: number;
  exp?: Partial<Exp>;
  relations?: Partial<Record<RelationId, number>>;
  jiban_progress?: number;
  abilities?: Partial<Record<Ability, number>>;
}

interface LifeEvent {
  id: string;
  weight: number;
  /** 一生に一度だけ起きる */
  once?: boolean;
  title: string;
  text: string;
  status?: string[];
  /** 役職の種類（minister, pm, party_exec, leader）。書いてあればその役職のときだけ起きる */
  post?: string[];
  /** 季節の出来事。書いてあればその月だけ起きる */
  months?: number[];
  choices: {
    label: string;
    result: string;
    effects: Effects;
    /** 能力が threshold 未満なら、effects の代わりに fail_effects と fail_result になる */
    risk?: { ability: Ability; threshold: number; fail_result: string; fail_effects: Effects };
  }[];
}

export const ORIGINS = C.origins as Origin[];
export const ACTIVITIES = C.activities as Activity[];
export const EXP_TYPES = C.exp_types as { id: ExpId; name: string; icon: string }[];
export const RELATIONS = C.relations as { id: RelationId; name: string }[];
const LIFE_EVENTS = lifeRaw.events as LifeEvent[];

export const ROUTE_NAMES: Record<RouteId, string> = { smd: "小選挙区", successor: "引退する現職の後継", pr: "比例名簿" };

export interface CareerSetup {
  origin: OriginId;
  party: string;
  /** 地元の県（比例名簿の道でも地元は持つ） */
  pref: PrefCode;
  route: RouteId;
  /** 経歴類型の id（character_tables.json） */
  archetype: string;
}

export interface CareerLog {
  turn: number;
  date: string;
  text: string;
  /** 政局（政権の行動、採決、政界の出来事）の記録なら "gov"。書いていなければ自分の記録 */
  kind?: "gov";
}

/** 総選挙の結果のうち、画面と記録に残すもの */
export interface ElectionSummary {
  year: number;
  month: number;
  won: boolean;
  route: RouteId;
  /** 小選挙区の得票（得票率の高い順）。比例名簿の道なら空 */
  district: { name: string; party: string; share: number; isPlayer: boolean }[];
  /** 比例名簿の道のとき：名簿の順位（1から）と党の比例の当選者数 */
  pr?: { rank: number; seats: number };
  /** 政党ごとの議席 */
  seats: { party: string; total: number }[];
  support: Record<string, number>;
}

export interface PendingEvent {
  id: string;
  title: string;
  text: string;
  choices: string[];
}

export interface CareerState {
  seed: number;
  setup: CareerSetup;
  playerId: number;
  /** 地盤を譲って次の総選挙で引退する現職（世襲・名門の親、後継の道の前任者） */
  parentId?: number;
  secretaryName: string;
  startYear: number;
  turn: number;
  year: number;
  month: number;
  stamina: number;
  maxStamina: number;
  /** やる気（1〜5） */
  mood: number;
  /** 手元の資金（万円） */
  money: number;
  exp: Exp;
  /** 地盤が次の段階に上がるまでの進み具合 */
  jibanProgress: number;
  /** 地盤を固める活動をしなかった月が続いた数（一定以上で地盤が1段下がる） */
  jibanNeglect: number;
  /** この月に地盤を固める活動をしたか */
  jibanTouched: boolean;
  /** 出来事ごとの、最後に起きたターンと回数（同じ出来事の繰り返しを防ぐ） */
  eventHistory: Record<string, { last: number; count: number }>;
  relations: Record<RelationId, number>;
  status: "候補" | "議員" | "浪人";
  /** 今就いている役職（なければ空） */
  post: string;
  /** 政権の状態（AI が動かす） */
  gov: GameState;
  /** 次の月に進む前に選ぶ必要のある出来事 */
  pendingEvent?: PendingEvent;
  log: CareerLog[];
  elections: ElectionSummary[];
  /** 政党ごとの党首（議員番号）。与党の党首が首相 */
  leaders: Record<string, number>;
  /** 与党の党首の任期が切れる年月（ここで党首選） */
  leaderTermEnd: { year: number; month: number };
  /** 次の党首選に立候補するか（立候補の条件を満たしているときだけ効く） */
  runForLeader: boolean;
  /** AI の首相の支持率が辞任の目安を下回った月が続いた数 */
  lowApprovalMonths: number;
  /** 首相のプレイヤーが解散を決めた（月末に総選挙） */
  dissolveRequested: boolean;
  /** 経歴に残る出来事（初当選、大臣就任、首相就任など） */
  achievements: string[];
  /** 首相を務めた月数 */
  pmMonths: number;
  /** 与党の党首が連続で務めている期数（任期の上限に使う） */
  leaderTermsServed: number;
  /** 今の与党第一党が政権に就いた年（長期政権の疲れに使う） */
  rulingSince: number;
  /** 今の首相が就任した年（首相個人の疲れに使う） */
  pmSince: number;
  /** プレイヤーが与党の党首を務めた期数の通算（生涯の上限に使う） */
  playerLeaderTerms: number;
  rngCounter: number;
  /** 政権の記録（gov.log）のうち、自分の記録に写し終えた数 */
  govLogCopied?: number;
  over?: string;
}

/** 状態と一緒に持つ、名簿などの大きなデータ */
export interface CareerWorld {
  roster: Member[];
  ronin: Member[];
  government: Appointment[];
  factory: MemberFactory;
  /** プレイヤー（議員でないときは名簿の外にいる） */
  player: Member;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const dateOf = (s: Pick<CareerState, "year" | "month">) => `${s.year}年${s.month}月`;
export const prefName = (p: PrefCode) => PREFECTURES[p - 1]?.name ?? String(p);

function rand(s: CareerState): number {
  return mulberry32((s.seed * 2_654_435_761 + s.turn * 40_503 + s.rngCounter++ * 69_069 + 7) >>> 0)();
}

function log(s: CareerState, text: string): void {
  s.log.push({ turn: s.turn, date: dateOf(s), text });
}

export const originById = (id: OriginId) => ORIGINS.find((o) => o.id === id)!;
const smdHolder = (roster: Member[], pref: PrefCode) => roster.find((m) => m.seat === "小選挙区" && m.district === pref);
const ALL_PREFS: PrefCode[] = Array.from({ length: SMD_SEATS }, (_, i) => i + 1);

export interface StartOption {
  route: RouteId;
  pref: PrefCode;
  /** 選択肢の説明（相手の現職、継ぐ地盤など） */
  note: string;
}

/**
 * 出自と政党から、出馬の道と県の組み合わせの一覧を返す。
 * 新人：他党の現職に挑む小選挙区、引退が近い自党の現職の後継、比例名簿（地元はどの県でもよい）。
 * 世襲・名門：自党の現職（首相を除く）の地盤を継ぐ小選挙区。そういう県がない党なら、どの県でも親の地盤があるものとする。
 */
export function startOptions(roster: Member[], party: string, origin: OriginId): StartOption[] {
  const out: StartOption[] = [];
  const ageOf = (m: Member) => START_YEAR - m.birthYear;
  if (origin === "newcomer") {
    for (const p of ALL_PREFS) {
      const h = smdHolder(roster, p);
      if (h?.party !== party) out.push({ route: "smd", pref: p, note: h ? `現職：${h.name.displayName}（${partyById(h.party).short}・${h.terms}回）` : "現職なし" });
      else if (!h.fixedRole && ageOf(h) >= C.routes.successor_min_age)
        out.push({ route: "successor", pref: p, note: `${h.name.displayName}（${ageOf(h)}歳）の後継` });
    }
    for (const p of ALL_PREFS) out.push({ route: "pr", pref: p, note: "比例名簿（順位は党の幹部との関係で決まる）" });
    return out;
  }
  for (const p of ALL_PREFS) {
    const h = smdHolder(roster, p);
    if (h?.party === party && !h.fixedRole) out.push({ route: "smd", pref: p, note: `親：${h.name.displayName}の地盤を継ぐ` });
  }
  if (!out.length) for (const p of ALL_PREFS) out.push({ route: "smd", pref: p, note: "親の地盤を継ぐ" });
  return out;
}

/** 小選挙区の道で選べる県（互換用。新人は他党の現職の県、世襲・名門は親の県） */
export function availablePrefs(roster: Member[], party: string, origin: OriginId): PrefCode[] {
  return startOptions(roster, party, origin).filter((o) => o.route === "smd").map((o) => o.pref);
}

/** 経歴類型と出自から、新人候補の能力の初期値を決める（個人差は小さく足す） */
function startingAbilities(archetypeId: string, origin: Origin, r: () => number): Record<Ability, number> {
  const arch = TABLES.archetypes.find((a) => a.id === archetypeId);
  if (!arch) throw new Error(`未知の経歴類型です：${archetypeId}`);
  const out = {} as Record<Ability, number>;
  for (const a of ABILITIES) out[a] = clamp(Math.round(centerOf(arch.base_ranks[a]) + (origin.bonus[a] ?? 0) + (r() - 0.5) * 6), 1, 100);
  return out;
}

/** 開始時点の党首。与党は首相、ほかの党は党首の点数が最も高い議員 */
function initialLeaders(roster: Member[], government: Appointment[]): Record<string, number> {
  const out: Record<string, number> = {};
  const pm = government.find((a) => a.post.id === "pm")?.member;
  for (const party of new Set(roster.map((m) => m.party))) {
    if (partyById(party).is_independent) continue;
    const l = pm && pm.party === party ? pm : pickLeader(roster, party);
    if (l) out[party] = l.id;
  }
  return out;
}

/** プレイヤーが首相か */
export function isPrimeMinister(_state: CareerState, world: CareerWorld): boolean {
  return world.government.find((a) => a.post.id === "pm")?.member.id === world.player.id;
}

/** プレイヤーの役職の種類（公務と出来事に使う）。なければ空 */
export function postCategory(state: CareerState, world: CareerWorld): string {
  const a = world.government.find((x) => x.member.id === world.player.id);
  if (a) return a.post.id === "pm" ? "pm" : a.post.field ? "minister" : a.post.id;
  if (state.leaders[world.player.party] === world.player.id) return "leader";
  return "";
}

/** 今の役職名（内閣・党の役職、または野党の党首） */
function postTitle(state: CareerState, world: CareerWorld): string {
  const a = world.government.find((x) => x.member.id === world.player.id);
  if (a) return a.post.name;
  if (state.leaders[world.player.party] === world.player.id) return `${partyById(world.player.party).short}の党首`;
  return "";
}

const partyExec = new Set(["secretary_general", "policy_chief", "general_council_chair"]);
const postKind = (c: string) => (partyExec.has(c) ? "party_exec" : c === "chief_cabinet_secretary" ? "minister" : c);

/** 党首選に立候補できるか（与党・野党どちらの党でも） */
export function canRunForLeader(state: CareerState, world: CareerWorld): boolean {
  const L = PL.leader;
  return (
    state.status === "議員" &&
    world.player.terms >= L.min_terms &&
    state.relations.party >= L.min_party_relation &&
    state.leaders[world.player.party] !== world.player.id &&
    state.playerLeaderTerms < L.term_limit
  );
}

/** 党首選で、立候補したプレイヤーに足される票の上乗せ */
function playerLeaderBonus(state: CareerState, world: CareerWorld): number {
  const B = PL.leader.player_bonus;
  return (state.relations.party - 50) / B.party + world.player.terms * B.terms;
}

/** 内閣を組み直す。与党の党首を首相にする。党の幹部との関係が人事に効く */
function rebuildGovernment(state: CareerState, world: CareerWorld, ruling: Ruling): void {
  const R = C.relation_effects;
  world.government = formGovernment(world.roster, {
    ruling,
    pmId: state.leaders[ruling.party],
    adjust: (m) => (m.id !== world.player.id ? 0 : state.relations.party < R.party_exclude ? null : (state.relations.party - 50) * R.party_score),
  });
  updatePost(state, world);
}

function updatePost(state: CareerState, world: CareerWorld): void {
  const title = postTitle(state, world);
  if (title && title !== state.post) {
    log(state, `${title}に就いた。`);
    state.achievements.push(`${dateOf(state)} ${title}`);
  }
  state.post = title;
}

/** 党首選を行う。与党なら首相が替わることがある（keepGov なら政権の状態は保ったまま内閣だけ組み直す） */
function runLeaderElection(state: CareerState, world: CareerWorld, party: string, reason: string, rebuild: boolean): LeaderElection | undefined {
  const playerRuns = state.runForLeader && world.player.party === party && canRunForLeader(state, world);
  const isRulingParty = state.gov.ruling.party === party;
  const incumbentIsPlayer = state.leaders[party] === world.player.id;
  const termLimited = isRulingParty && (state.leaderTermsServed >= PL.leader.term_limit || (incumbentIsPlayer && state.playerLeaderTerms >= PL.leader.term_limit));
  const result = leaderElection(world.roster, party, {
    incumbentId: state.leaders[party],
    incumbentApproval: isRulingParty ? state.gov.approval : undefined,
    // プレイヤーは自分で立候補したときだけ候補になる（ほかの議員と同じように自動では候補にしない）
    excludeIds: [...(termLimited ? [state.leaders[party]] : []), ...(playerRuns ? [] : [world.player.id])],
    extra: playerRuns ? { member: world.player, bonus: playerLeaderBonus(state, world) } : undefined,
    rand: () => rand(state),
  });
  if (!result) return undefined;
  const before = state.leaders[party];
  state.leaders[party] = result.winner.id;
  const isRuling = state.gov.ruling.party === party;
  const votes = result.candidates.map((c) => `${c.member.name.displayName}${c.member.id === world.player.id ? "（自分）" : ""}${c.votes}票`).join("、");
  const showLog = world.player.party === party || isRuling;
  if (showLog) log(state, `${partyById(party).short}の党首選（${reason}）：${votes}。${result.winner.name.displayName}が${before === result.winner.id ? "再選された" : "新しい党首に選ばれた"}。`);
  if (playerRuns && result.winner.id !== world.player.id) log(state, "党首選に敗れた。");
  if (isRuling) {
    state.leaderTermEnd = addMonths(state, PL.leader.term_months);
    state.leaderTermsServed = before === result.winner.id ? state.leaderTermsServed + 1 : 1;
    if (before !== result.winner.id) state.pmSince = state.year;
    if (result.winner.id === world.player.id) state.playerLeaderTerms++;
    if (termLimited) log(state, "首相は党首の任期の上限に達し、退いた。");
    if (rebuild) {
      const changed = before !== result.winner.id;
      rebuildGovernment(state, world, state.gov.ruling);
      if (changed) state.gov.approval = Math.min(90, Math.round((state.gov.approval + PL.pm.honeymoon) * 10) / 10);
    }
  } else if (rebuild) updatePost(state, world);
  return result;
}

/** 長期政権の疲れ（支持率が戻っていく基準の値をどれだけ下げるか） */
function fatigueOf(state: CareerState): number {
  const F = PL.fatigue;
  const party = Math.min(F.cap, Math.max(0, state.year - state.rulingSince) * F.per_year);
  const pm = Math.max(0, state.year - state.pmSince) * F.pm_per_year;
  return Math.min(F.total_cap, party + pm);
}

function addMonths(s: Pick<CareerState, "year" | "month">, n: number): { year: number; month: number } {
  const t = s.year * 12 + (s.month - 1) + n;
  return { year: Math.floor(t / 12), month: (t % 12) + 1 };
}

const reached = (s: Pick<CareerState, "year" | "month">, d: { year: number; month: number }) => s.year > d.year || (s.year === d.year && s.month >= d.month);

/** 首相のプレイヤーが政権の行動をとる（法案の準備・提出、協議、根回し、記者会見、解散） */
export function govAction(state: CareerState, world: CareerWorld, action: string, arg?: string): TurnResult {
  if (state.over) return { ok: false, message: "ゲームは終わっています。" };
  if (!isPrimeMinister(state, world)) return { ok: false, message: "政権の行動は首相のときだけとれます。" };
  const ctx = { roster: world.roster, government: world.government };
  const g = state.gov;
  switch (action) {
    case "draft":
      return startDrafting(g, ctx, arg ?? "");
    case "submit":
      return submitBill(g, ctx, arg ?? "");
    case "talk":
      return talkWithParty(g, ctx, arg ?? "");
    case "nemawashi":
      return nemawashi(g, ctx);
    case "press":
      return pressConference(g, ctx);
    case "dissolve":
      state.dissolveRequested = true;
      return { ok: true, message: "衆議院の解散を決めた。月末に総選挙になる。" };
    default:
      return { ok: false, message: "政権の行動は draft <法案> / submit <法案> / talk <政党> / nemawashi / press / dissolve です。" };
  }
}

/** 首相のときに見る、法案の状況 */
export function govBills(state: CareerState) {
  return BILLS.map((b) => ({ id: b.id, name: billName(state.gov, b), field: b.field, status: state.gov.bills[b.id].status, work: b.work, progress: state.gov.bills[b.id].progress }));
}

/** 公務：役職ごとの仕事をする */
function doDuty(state: CareerState, world: CareerWorld): string {
  const cat = postCategory(state, world);
  const D = PL.duties as unknown as Record<string, { exp?: Partial<Exp>; approval?: number; bill_progress?: number; all_progress?: number; cooperation?: number; cohesion?: number; relations?: Partial<Record<RelationId, number>> }>;
  const d = D[cat];
  if (!d) return "";
  const out = applyEffects(state, world, { stamina: PL.duties.stamina, exp: d.exp, relations: d.relations, approval: d.approval });
  const g = state.gov;
  if (d.bill_progress) {
    const field = world.government.find((a) => a.member.id === world.player.id)?.post.field;
    for (const b of BILLS.filter((x) => x.field === field && g.bills[x.id].status === "準備中")) {
      g.bills[b.id].progress += d.bill_progress;
      out.push(`${billName(g, b)}の準備が進んだ`);
    }
  }
  if (d.all_progress) for (const b of BILLS.filter((x) => g.bills[x.id].status === "準備中")) g.bills[b.id].progress += d.all_progress;
  if (d.cooperation) {
    const top = Object.keys(g.cooperation).filter((p) => !g.ruling.partners.includes(p)).sort((a, b) => world.roster.filter((m) => m.party === b).length - world.roster.filter((m) => m.party === a).length)[0];
    if (top) {
      g.cooperation[top] = Math.min(100, g.cooperation[top] + d.cooperation);
      out.push(`${partyById(top).short}との協力度+${d.cooperation}`);
    }
  }
  if (d.cohesion) {
    g.cohesion = Math.min(1, Math.round((g.cohesion + d.cohesion) * 100) / 100);
    out.push(`党の結束${Math.round(g.cohesion * 100)}%`);
  }
  return `公務（${state.post}）：${out.join("、")}`;
}

/** 議員人生モードを始める。world.player を作り、政権の状態も用意する */
export async function startCareer(
  base: { roster: Member[]; government: Appointment[]; factory: MemberFactory },
  setup: CareerSetup,
  seed: number,
): Promise<{ state: CareerState; world: CareerWorld }> {
  const origin = originById(setup.origin);
  if (!startOptions(base.roster, setup.party, setup.origin).some((o) => o.route === setup.route && o.pref === setup.pref))
    throw new Error("この出自と政党では、その道と県からは出馬できません");
  const party = partyById(setup.party);
  const generated = await base.factory.create(party, { seat: "なし", home: setup.pref });
  const holder = smdHolder(base.roster, setup.pref);
  const inherits = setup.origin !== "newcomer" && holder?.party === setup.party && !holder.fixedRole;
  const parent = inherits || setup.route === "successor" ? holder : undefined;
  const arch = TABLES.archetypes.find((a) => a.id === setup.archetype)!;
  const lineage = TABLES.lineages.find((l) => l.id === origin.lineage)!;
  const age = setup.origin === "newcomer" ? 38 : 33;
  const relations = { ...origin.relations };
  if (setup.route === "successor") Object.assign(relations, C.routes.successor_relations);
  const player: Member = {
    ...generated,
    // 親の地盤を継ぐときは姓も継ぐ
    name: inherits && holder
      ? {
          ...generated.name,
          surname: holder.name.surname,
          surnameKana: holder.name.surnameKana,
          displayName: generated.name.displayName.replace(generated.name.surname, holder.name.surname),
        }
      : generated.name,
    birthYear: START_YEAR - age,
    archetype: arch.name,
    lineage: lineage.name,
    terms: 0,
    tier: "候補",
    abilities: startingAbilities(setup.archetype, origin, base.factory.rand),
    seat: "なし",
    district: null,
    home: setup.pref,
    jiban: origin.jiban,
  };
  const state: CareerState = {
    seed,
    setup,
    playerId: player.id,
    parentId: parent?.id,
    secretaryName: C.secretary_names[seed % C.secretary_names.length],
    startYear: START_YEAR,
    turn: 1,
    year: START_YEAR,
    month: 1,
    stamina: C.max_stamina.start,
    maxStamina: C.max_stamina.start,
    mood: 3,
    money: origin.money,
    exp: { election: 0, policy: 0, network: 0, media: 0, money: 0 },
    jibanProgress: 0,
    jibanNeglect: 0,
    jibanTouched: false,
    eventHistory: {},
    relations,
    status: "候補",
    post: "",
    gov: createGame(seed, { roster: base.roster, government: base.government }),
    log: [],
    elections: [],
    leaders: initialLeaders(base.roster, base.government),
    leaderTermEnd: { ...PL.leader.first_term_end },
    runForLeader: false,
    lowApprovalMonths: 0,
    dissolveRequested: false,
    achievements: [],
    pmMonths: 0,
    leaderTermsServed: 1,
    pmSince: START_YEAR - 1,
    playerLeaderTerms: 0,
    rulingSince: START_YEAR - PL.fatigue.initial_years,
    rngCounter: 0,
  };
  state.gov.scenes = [];
  const where = prefName(setup.pref);
  log(
    state,
    setup.route === "pr"
      ? `${party.name}の比例名簿に載る候補に選ばれた。地元の${where}を拠点に、党への貢献で名簿の上位を目指す。`
      : setup.route === "successor"
        ? `${party.name}の公募で、引退を表明した${parent!.name.displayName}の後継に選ばれた。${where}の地盤は一から作り直しだ。`
        : inherits
          ? `${party.name}の公認を得た。引退を決めた${holder!.name.displayName}の地盤を継ぎ、${where}で次の総選挙に挑む。`
          : `${party.name}の公募で候補に選ばれた。次の総選挙で、${where}の議席を狙う。`,
  );
  return { state, world: { ...base, ronin: [], player } };
}

// ---- 経験点と能力 ----

/** 能力を1上げるのに使う経験点。今の能力値が高いほど多くかかる */
export function upgradeCost(member: Member, ability: Ability): Partial<Exp> {
  const v = member.abilities[ability];
  const U = C.upgrade;
  const mult = Math.max(0.6, 1 + (v - 40) / U.slope) * (v >= U.high ? U.high_mult : 1);
  const base = (C.upgrade.cost as Record<Ability, Partial<Exp>>)[ability];
  const out: Partial<Exp> = {};
  for (const [k, n] of Object.entries(base)) out[k as ExpId] = Math.ceil((n as number) * mult);
  return out;
}

export function canUpgrade(state: CareerState, member: Member, ability: Ability): boolean {
  if (member.abilities[ability] >= 100) return false;
  return Object.entries(upgradeCost(member, ability)).every(([k, n]) => state.exp[k as ExpId] >= (n as number));
}

function setPlayer(world: CareerWorld, next: Member): void {
  world.player = next;
  // 議員なら名簿の中の本人も同じ値にする
  const i = world.roster.findIndex((m) => m.id === next.id);
  if (i >= 0) world.roster[i] = next;
}

/** 経験点を使って能力を1上げる。上げられなければ false */
export function upgradeAbility(state: CareerState, world: CareerWorld, ability: Ability): boolean {
  if (!canUpgrade(state, world.player, ability)) return false;
  for (const [k, n] of Object.entries(upgradeCost(world.player, ability))) state.exp[k as ExpId] -= n as number;
  setPlayer(world, { ...world.player, abilities: { ...world.player.abilities, [ability]: world.player.abilities[ability] + 1 } });
  return true;
}

// ---- 選挙区の情勢 ----

/** 比例名簿の順位（0から）。党の幹部との関係が高いほど上位になる */
export function prRank(state: CareerState): number {
  return Math.max(0, Math.floor((80 - state.relations.party) / C.routes.pr_rank_step));
}

/** 総選挙が今あったときの、プレイヤーの選挙区の見込み（揺らぎを除いた得票率の高い順）。比例名簿の道なら空 */
export function raceForecast(
  state: CareerState,
  world: CareerWorld,
): { name: string; party: string; share: number; isPlayer: boolean; memberId?: number; incumbent: boolean }[] {
  if (state.setup.route === "pr") return [];
  const pref = state.setup.pref;
  const holder = smdHolder(world.roster, pref);
  const isMe = holder?.id === world.player.id;
  const rival = holder && !isMe && holder.id !== state.parentId ? holder : undefined;
  const parties = partiesRunning(pref, rival?.party ?? (isMe ? state.setup.party : undefined));
  if (!parties.includes(state.setup.party)) parties.push(state.setup.party);
  const entries = parties.map((p) => {
    if (p === state.setup.party) return { party: p, member: world.player, incumbent: isMe, bonus: playerBonus(state) };
    if (rival && rival.party === p) return { party: p, member: rival, incumbent: true };
    return { party: p, incumbent: false };
  });
  return estimateDistrict(pref, state.gov.approval, entries)
    .map((e) => ({
      name: e.member ? e.member.name.displayName : `${partyById(e.party).short}の候補`,
      party: e.party,
      share: e.share,
      isPlayer: e.member?.id === world.player.id,
      memberId: e.member?.id,
      incumbent: !!e.member && e.member.seat === "小選挙区" && e.member.district === pref,
    }))
    .sort((a, b) => b.share - a.share);
}

/** 選挙での本人の票への上乗せ（選挙資金、後援会、県議団）から、世襲批判などを差し引いたもの */
function playerBonus(state: CareerState): number {
  const B = C.election_bonus;
  const funds = clamp(state.money, 0, 2000) / 2000;
  return (
    funds * B.funds +
    ((state.relations.supporters - 50) / 50) * B.supporters +
    ((state.relations.kengi - 50) / 50) * C.kengi.election_weight +
    ((state.relations.press - 50) / 50) * C.relation_effects.press_weight -
    (B.origin_penalty as Record<OriginId, number>)[state.setup.origin] -
    (state.setup.route === "successor" ? C.routes.successor_penalty : 0)
  );
}

// ---- 1か月の流れ ----

export interface TurnResult {
  ok: boolean;
  message: string;
}

/** 活動や出来事で得る経験点などの倍率。やる気と、秘書との関係（段取りのよさ）で決まる */
function gainMultiplier(state: CareerState): number {
  const S = C.relation_effects.secretary;
  return C.mood_multiplier[state.mood - 1] * (S.min + ((S.max - S.min) * state.relations.secretary) / 100);
}

function applyEffects(state: CareerState, world: CareerWorld, e: Effects): string[] {
  const out: string[] = [];
  const mult = gainMultiplier(state);
  if (e.max_stamina) {
    state.maxStamina = clamp(state.maxStamina + e.max_stamina, 0, C.max_stamina.limit);
    out.push(`体力の上限${state.maxStamina}`);
  }
  if (e.stamina) state.stamina = clamp(state.stamina + e.stamina, 0, state.maxStamina);
  for (const [k, n] of Object.entries(e.exp ?? {})) {
    const v = (n as number) > 0 ? Math.round((n as number) * mult) : (n as number);
    state.exp[k as ExpId] = Math.max(0, state.exp[k as ExpId] + v);
    out.push(`${EXP_TYPES.find((x) => x.id === k)!.name}${v >= 0 ? "+" : ""}${v}`);
  }
  for (const [k, n] of Object.entries(e.relations ?? {}))
    state.relations[k as RelationId] = clamp(state.relations[k as RelationId] + (n as number), 0, 100);
  if (e.money) {
    state.money = Math.max(0, state.money + e.money);
    out.push(`資金${e.money >= 0 ? "+" : ""}${e.money}万円`);
  }
  if (e.mood) state.mood = clamp(state.mood + e.mood, 1, 5);
  if (e.approval) {
    state.gov.approval = clamp(Math.round((state.gov.approval + e.approval) * 10) / 10, 1, 90);
    out.push(`内閣支持率${e.approval >= 0 ? "+" : ""}${e.approval}`);
  }
  for (const [k, n] of Object.entries(e.abilities ?? {})) {
    setPlayer(world, { ...world.player, abilities: { ...world.player.abilities, [k]: clamp(world.player.abilities[k as Ability] + (n as number), 1, 100) } });
    out.push(`${k}+${n}`);
  }
  if (e.jiban_progress) addJibanProgress(state, world, Math.round(e.jiban_progress * mult), out);
  return out;
}

function addJibanProgress(state: CareerState, world: CareerWorld, amount: number, out: string[]): void {
  if (amount > 0) state.jibanTouched = true;
  // 地盤が最大（4）なら進み具合はためない
  if (world.player.jiban >= 4) {
    state.jibanProgress = 0;
    return;
  }
  state.jibanProgress = Math.max(0, state.jibanProgress + amount);
  const need = C.jiban_step[world.player.jiban];
  if (world.player.jiban < 4 && need && state.jibanProgress >= need) {
    state.jibanProgress -= need;
    setPlayer(world, { ...world.player, jiban: world.player.jiban + 1 });
    out.push(`地盤が${world.player.jiban}に上がった`);
  }
}

/**
 * 活動を1つ行い、月を進める。政権は AI が動き、任期満了か解散なら総選挙になる。
 * 出来事が起きて選択待ち（pendingEvent）のあいだは進めない。総選挙は名前の生成を伴うので非同期。
 */
export async function takeTurn(state: CareerState, world: CareerWorld, activityId: string): Promise<TurnResult> {
  if (state.over) return { ok: false, message: "ゲームは終わっています。" };
  if (state.pendingEvent) return { ok: false, message: `先に出来事「${state.pendingEvent.title}」の選択肢を選んでください。` };
  if (activityId === "duty") {
    if (!postCategory(state, world)) return { ok: false, message: "公務は役職に就いているときだけできます。" };
    const message = doDuty(state, world);
    log(state, message);
    await endMonth(state, world);
    return { ok: true, message };
  }
  const act = ACTIVITIES.find((a) => a.id === activityId);
  if (!act) return { ok: false, message: "その活動はありません。" };
  let message: string;
  // 体力が少ないまま無理をすると倒れることがある
  if (act.stamina < 0 && state.stamina < C.low_stamina.threshold && rand(state) < C.low_stamina.breakdown_chance) {
    state.stamina = clamp(state.stamina + 10, 0, state.maxStamina);
    state.mood = clamp(state.mood - 1, 1, 5);
    message = `${act.name}の途中で体調を崩し、寝込んでしまった。`;
  } else {
    const gained = applyEffects(state, world, {
      stamina: act.stamina,
      max_stamina: act.max_stamina,
      exp: act.exp,
      relations: act.relations,
      jiban_progress: act.jiban_progress,
    });
    if (act.money_per_ability) {
      const m = Math.round(world.player.abilities.資金 * act.money_per_ability * gainMultiplier(state));
      state.money += m;
      gained.push(`資金+${m}万円`);
    }
    if (act.mood_up_chance && rand(state) < act.mood_up_chance) {
      state.mood = clamp(state.mood + 1, 1, 5);
      gained.push("やる気が上がった");
    }
    message = `${act.name}：${gained.join("、") || "体力が戻った"}`;
  }
  log(state, message);
  await endMonth(state, world);
  return { ok: true, message };
}

/** 出来事の選択肢を選ぶ（index は0から） */
export function chooseEvent(state: CareerState, world: CareerWorld, index: number): TurnResult {
  const pe = state.pendingEvent;
  if (!pe) return { ok: false, message: "選ぶ出来事はありません。" };
  const ev = LIFE_EVENTS.find((e) => e.id === pe.id)!;
  const choice = ev.choices[index];
  if (!choice) return { ok: false, message: `選択肢は1〜${ev.choices.length}です。` };
  const failed = choice.risk && world.player.abilities[choice.risk.ability] < choice.risk.threshold;
  const changes = applyEffects(state, world, failed ? choice.risk!.fail_effects : choice.effects);
  const result = failed ? choice.risk!.fail_result : choice.result;
  const text = `${pe.title}：${choice.label} → ${result.replaceAll("{secretary}", state.secretaryName)}${changes.length ? `（${changes.join("、")}）` : ""}`;
  log(state, text);
  state.pendingEvent = undefined;
  return { ok: true, message: text };
}

function maybeLifeEvent(state: CareerState, world: CareerWorld): void {
  if (rand(state) >= lifeRaw.chance) return;
  const kind = postKind(postCategory(state, world));
  const pool = LIFE_EVENTS.filter((e) => {
    if (e.status && !e.status.includes(state.status)) return false;
    if (e.post && !e.post.includes(kind)) return false;
    if (e.months && !e.months.includes(state.month)) return false;
    const h = state.eventHistory[e.id];
    if (!h) return true;
    if (e.once) return false;
    return state.turn - h.last >= C.event_cooldown_months;
  });
  if (!pool.length) return;
  const total = pool.reduce((a, e) => a + e.weight, 0);
  let r = rand(state) * total;
  const ev = pool.find((e) => (r -= e.weight) <= 0) ?? pool[0];
  const h = state.eventHistory[ev.id];
  state.eventHistory[ev.id] = { last: state.turn, count: (h?.count ?? 0) + 1 };
  state.pendingEvent = {
    id: ev.id,
    title: ev.title,
    text: ev.text.replaceAll("{secretary}", state.secretaryName),
    choices: ev.choices.map((c) => c.label),
  };
}

async function endMonth(state: CareerState, world: CareerWorld): Promise<void> {
  // 事務所の経費。資金が尽きるとやる気が下がる
  state.money -= (C.monthly_expense as Record<CareerState["status"], number>)[state.status];
  if (state.money < 0) {
    state.money = 0;
    state.mood = clamp(state.mood - 1, 1, 5);
    log(state, "資金が尽き、事務所の家賃の支払いに困った。");
  }
  // 関係は放っておくと基準の値に少しずつ戻る
  const D = C.relation_drift;
  for (const r of RELATIONS) {
    const v = state.relations[r.id];
    state.relations[r.id] = v > D.base ? Math.max(D.base, v - D.step) : Math.min(D.base, v + D.step);
  }
  // 県議団との関係が深いと、県議が地元を固めてくれる
  if (state.relations.kengi >= C.kengi.threshold) addJibanProgress(state, world, C.kengi.passive_jiban, []);
  // 地盤は放っておくと緩む。進み具合は毎月少しずつ減り（0より下にはならない）、
  // 地盤を固める活動をしない月が続くと地盤が1段下がる
  state.jibanProgress = Math.max(0, state.jibanProgress - C.jiban_decay);
  state.jibanNeglect = state.jibanTouched ? 0 : state.jibanNeglect + 1;
  state.jibanTouched = false;
  if (state.jibanNeglect >= C.jiban_neglect_months && world.player.jiban > 1) {
    setPlayer(world, { ...world.player, jiban: world.player.jiban - 1 });
    state.jibanNeglect = 0;
    log(state, `地元に顔を出さない日が続き、地盤が${world.player.jiban}に下がった。`);
  }
  // 政権：プレイヤーが首相なら自分で行動を選んでいる。そうでなければ AI が動かす
  state.gov.fatigue = fatigueOf(state);
  const pm = isPrimeMinister(state, world);
  if (pm) state.pmMonths++;
  const ctx = { roster: world.roster, government: world.government };
  if (!pm) aiGovernmentActions(state.gov, ctx);
  endTurn(state.gov, ctx);
  state.gov.scenes = [];
  copyGovLog(state);
  const g = state.gov;
  const termEnded = g.over?.startsWith("任期満了") ?? false;
  let dissolve = false;
  if (g.over && !termEnded) {
    // 内閣不信任案の可決。支持率が高ければ解散、低ければ総辞職して党首選で次の首相を選ぶ（プレイヤーの首相は解散する）
    g.over = undefined;
    if (pm || g.approval >= PL.pm.dissolve_approval) {
      dissolve = true;
      log(state, "内閣不信任案が可決され、首相は衆議院を解散した。");
    } else {
      log(state, "内閣不信任案が可決され、内閣は総辞職した。");
      runLeaderElection(state, world, g.ruling.party, "内閣総辞職", true);
    }
  }
  // AI の首相は、支持率の低迷が続くと辞任する
  if (!pm && !dissolve && !termEnded) {
    state.lowApprovalMonths = g.approval < PL.pm.resign_approval ? state.lowApprovalMonths + 1 : 0;
    if (state.lowApprovalMonths >= PL.pm.resign_months) {
      state.lowApprovalMonths = 0;
      log(state, `支持率の低迷（${g.approval}%）が続き、首相が辞任を表明した。`);
      runLeaderElection(state, world, g.ruling.party, "首相の辞任", true);
    }
  }
  // 与党の党首の任期切れ
  if (!dissolve && !termEnded && reached(state, state.leaderTermEnd)) runLeaderElection(state, world, g.ruling.party, "任期満了", true);
  if (state.dissolveRequested) {
    state.dissolveRequested = false;
    dissolve = true;
    log(state, `首相として衆議院を解散した（内閣支持率${g.approval}%）。`);
  } else if (!pm && !dissolve && !termEnded && aiWantsDissolution(g, rand(state))) {
    dissolve = true;
    log(state, `首相が衆議院を解散した（内閣支持率${g.approval}%）。`);
  }
  if (termEnded || dissolve) {
    if (termEnded) log(state, "衆議院議員の任期が満了した。");
    await holdElection(state, world);
  } else {
    maybeLifeEvent(state, world);
  }
  // 次の月へ
  state.turn++;
  state.month++;
  if (state.month > 12) {
    state.month = 1;
    state.year++;
  }
  checkRetirement(state, world);
}

function checkRetirement(state: CareerState, world: CareerWorld): void {
  if (state.over) return;
  const age = state.year - world.player.birthYear;
  const years = state.year - state.startYear;
  if (age < C.career_end.retire_age && years < C.career_end.max_years) return;
  const wins = state.elections.filter((e) => e.won).length;
  const pmYears = state.pmMonths ? `、首相在任${Math.floor(state.pmMonths / 12)}年${state.pmMonths % 12}か月` : "";
  state.over = `政界を引退した（${age}歳、${years}年）。総選挙${state.elections.length}回で当選${wins}回${pmYears}${state.post ? `、最後の役職は${state.post}` : ""}。`;
  state.pendingEvent = undefined;
  log(state, state.over);
}

async function holdElection(state: CareerState, world: CareerWorld): Promise<void> {
  const route = state.setup.route;
  const isPr = route === "pr";
  const rank = isPr ? prRank(state) : 0;
  const result = await runElection({
    year: state.year,
    month: state.month,
    roster: world.roster,
    ronin: world.ronin.filter((m) => m.id !== world.player.id),
    approval: state.gov.approval,
    ruling: state.gov.ruling,
    factory: world.factory,
    forced: isPr ? [] : [{ pref: state.setup.pref, party: state.setup.party, member: world.player, bonus: playerBonus(state) }],
    forcedPr: isPr ? [{ party: state.setup.party, member: world.player, rank }] : [],
    retireIds: state.parentId !== undefined ? [state.parentId] : [],
  });
  // 選挙費用
  const cost = Math.min(state.money, C.election_cost.max);
  state.money -= cost;
  log(state, `選挙費用に${cost}万円を使った。`);
  const d = result.smd.find((x) => x.pref === state.setup.pref);
  const me = result.roster.find((m) => m.id === world.player.id);
  const prSeats = result.pr[state.setup.party]?.length ?? 0;
  const summary = {
    year: state.year,
    month: state.month,
    won: !!me,
    route,
    district: isPr || !d ? [] : d.candidates.map((c) => ({ name: c.member.name.displayName, party: c.member.party, share: c.share, isPlayer: c.member.id === world.player.id })),
    pr: isPr ? { rank: rank + 1, seats: prSeats } : undefined,
    seats: Object.entries(result.roster.reduce<Record<string, number>>((acc, m) => ((acc[m.party] = (acc[m.party] ?? 0) + 1), acc), {})).map(
      ([party, total]) => ({ party, total }),
    ),
    support: result.support,
  } satisfies ElectionSummary;
  state.elections.push(summary);
  world.roster = result.roster;
  world.ronin = result.ronin.filter((m) => m.id !== world.player.id);
  const first = state.elections.length === 1;
  if (me) {
    world.player = me;
    state.status = "議員";
    const how = isPr ? `比例名簿${rank + 1}位（党の比例当選${prSeats}人）` : `得票率${pct(d!.candidates.find((c) => c.member.id === me.id)!.share)}`;
    log(state, `${me.terms === 1 ? "初当選" : `${me.terms}回目の当選`}！ ${how}で${partyById(state.setup.party).name}の衆議院議員になった。`);
    // 後継の道で当選したら、次からは自分の選挙区の現職として戦う
    if (route === "successor") state.setup = { ...state.setup, route: "smd" };
  } else {
    world.player = { ...world.player, seat: "なし", district: null };
    state.status = "浪人";
    const how = isPr ? `比例名簿${rank + 1}位で、党の比例当選${prSeats}人に届かなかった` : `得票率${pct(d!.candidates.find((c) => c.member.id === world.player.id)!.share)}で${d!.winner.name.displayName}（${partyById(d!.winner.party).short}）に敗れた`;
    log(state, `落選。${how}。浪人として次の選挙を目指す。`);
    if (route === "successor") state.setup = { ...state.setup, route: "smd" };
  }
  if (first) state.parentId = undefined;
  if (me && me.terms === 1) state.achievements.push(`${dateOf(state)} 初当選`);
  // 連立を組み直す（政権交代もありうる）
  const prev = state.gov.ruling;
  const coalition = formCoalition(world.roster, prev);
  log(state, coalition.text);
  // 党首の入れ替え：政権を失った党と、党首が議席を失った党は党首選をする
  state.gov.ruling = coalition.ruling;
  for (const party of Object.keys(state.leaders)) if (!world.roster.some((m) => m.party === party)) delete state.leaders[party];
  for (const party of new Set(world.roster.map((m) => m.party))) {
    if (partyById(party).is_independent) continue;
    const lostPower = coalition.changed && party === prev.party;
    const leaderLost = !world.roster.some((m) => m.id === state.leaders[party]);
    if (lostPower || leaderLost) runLeaderElection(state, world, party, lostPower ? "政権を失って" : "党首の落選", false);
  }
  if (coalition.changed) {
    state.leaderTermEnd = addMonths(state, PL.leader.term_months);
    state.leaderTermsServed = 1;
    state.rulingSince = state.year;
    state.pmSince = state.year;
    if (state.leaders[coalition.ruling.party] === world.player.id) state.playerLeaderTerms++;
    const pmName = world.roster.find((m) => m.id === state.leaders[coalition.ruling.party])?.name.displayName ?? "";
    log(state, `${describeRuling(coalition.ruling)}の連立政権が発足し、${pmName}が首相に就いた。`);
  }
  // 内閣を組み直す。プレイヤーが役職に就くこともある
  rebuildGovernment(state, world, coalition.ruling);
  state.gov = createGame(state.seed + state.elections.length * 7919, { roster: world.roster, government: world.government }, {
    year: state.year,
    month: state.month,
    termEnd: { year: state.year + 4, month: state.month },
    quiet: true,
    ruling: coalition.ruling,
    approval: coalition.changed ? 45 : undefined,
  });
  state.gov.scenes = [];
  state.gov.fatigue = fatigueOf(state);
  state.govLogCopied = state.gov.log.length;
}

/** 政権の記録のうち新しいものを、政局の記録として自分の記録に写す（総選挙で政権の状態が作り直されても残るように） */
function copyGovLog(state: CareerState): void {
  const from = state.govLogCopied ?? 0;
  for (const e of state.gov.log.slice(from)) state.log.push({ turn: state.turn, date: e.date, text: e.text, kind: "gov" });
  state.govLogCopied = state.gov.log.length;
}

const pct = (x: number) => `${Math.round(x * 1000) / 10}%`;

// ---- 表示用のまとめ ----

/** 画面や CLI に出す、今の状態の要約 */
/** 資金の見通し：毎月の経費、今の資金で経費を払える月数、任期満了までの月数、選挙費用の上限 */
export function moneyOutlook(state: CareerState): { expense: number; monthsLeft: number; monthsToElection: number; electionCost: number } {
  const expense = (C.monthly_expense as Record<CareerState["status"], number>)[state.status];
  const t = state.gov.termEnd;
  return {
    expense,
    monthsLeft: Math.floor(state.money / expense),
    monthsToElection: Math.max(0, (t.year - state.year) * 12 + (t.month - state.month)),
    electionCost: C.election_cost.max,
  };
}

export function careerSummary(state: CareerState, world: CareerWorld) {
  const p = world.player;
  return {
    date: dateOf(state),
    name: p.name.displayName,
    age: state.year - p.birthYear,
    party: partyById(state.setup.party).name,
    origin: originById(state.setup.origin).name,
    route: ROUTE_NAMES[state.setup.route],
    pref: prefName(state.setup.pref),
    status: state.status,
    post: state.post,
    terms: p.terms,
    stamina: `${state.stamina}/${state.maxStamina}`,
    mood: state.mood,
    money: state.money,
    jiban: p.jiban,
    jibanProgress: p.jiban >= 4 ? "最大" : `${state.jibanProgress}/${C.jiban_step[p.jiban]}`,
    abilities: p.abilities,
    exp: state.exp,
    relations: state.relations,
    approval: state.gov.approval,
    ruling: describeRuling(state.gov.ruling),
    partyLeader: world.roster.find((m) => m.id === state.leaders[state.setup.party])?.name.displayName ?? (state.leaders[state.setup.party] === world.player.id ? p.name.displayName : ""),
    primeMinister: world.government.find((a) => a.post.id === "pm")?.member.name.displayName ?? "",
    isPrimeMinister: isPrimeMinister(state, world),
    canDuty: !!postCategory(state, world),
    canRunForLeader: canRunForLeader(state, world),
    runForLeader: state.runForLeader,
    leaderElection: `${state.leaderTermEnd.year}年${state.leaderTermEnd.month}月（与党の党首の任期切れ）`,
    actionPoints: isPrimeMinister(state, world) ? state.gov.actionPoints : undefined,
    achievements: state.achievements,
    nextElection: `${state.gov.termEnd.year}年${state.gov.termEnd.month}月（解散があれば早まる）`,
    prRank: state.setup.route === "pr" ? prRank(state) + 1 : undefined,
    forecast: raceForecast(state, world).map((f) => ({ ...f, share: pct(f.share) })),
    pendingEvent: state.pendingEvent,
    over: state.over,
  };
}
