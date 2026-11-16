// 国会の採決（設計は docs/design.md の「ターンの流れ」）
import rulesRaw from "../../data/game/rules.json";
import { IDEOLOGY_AXES, partyById } from "./parties.js";
import type { Ideology, IdeologyAxisId } from "./parties.js";
import type { Member } from "./roster.js";
import { MAJORITY } from "./districts.js";

const V = rulesRaw.vote;

/** 法案などの思想の位置。関係する軸だけを持つ */
export type Position = Partial<Record<IdeologyAxisId, number>>;

/** 思想の距離（法案が持つ軸だけの差の絶対値の平均。0〜6）。軸のない法案は0 */
export function distance(ideology: Ideology, position: Position): number {
  const axes = IDEOLOGY_AXES.map((x) => x.id).filter((id) => position[id] !== undefined);
  if (!axes.length) return 0;
  return axes.reduce((s, id) => s + Math.abs(ideology[id] - position[id]!), 0) / axes.length;
}

/** 政党の中心どうしの距離（5軸の差の絶対値の平均） */
export function partyDistance(a: string, b: string): number {
  return distance(partyById(a).ideology_center, partyById(b).ideology_center as Position);
}

export interface VoteContext {
  rulingParty: string;
  coalitionPartners: string[];
  /** 野党ごとの与党への協力度（0〜100） */
  cooperation: Record<string, number>;
  /** 与党の結束（0〜1） */
  cohesion: number;
}

export interface BillLike {
  position: Position;
  /** 世論の受け（成立したときの支持率の変化）。受けのよい法案ほど野党も反対しにくい */
  popularity: number;
}

/** 党の方針として賛成に傾く度合い（0.5以上なら党として賛成） */
export function partySupport(party: string, bill: BillLike, ctx: VoteContext): number {
  if (party === ctx.rulingParty) return 1;
  const d = distance(partyById(party).ideology_center, bill.position);
  if (ctx.coalitionPartners.includes(party)) {
    const C = rulesRaw.vote_coalition;
    return C.base + (ctx.cooperation[party] ?? 0) * C.cooperation_weight - d * C.distance_weight;
  }
  return V.opposition_base + (ctx.cooperation[party] ?? 0) * V.cooperation_weight - d * V.party_distance_weight + bill.popularity * V.popularity_weight;
}

/** 党が賛成の方針か */
export function partyLine(party: string, bill: BillLike, ctx: VoteContext): boolean {
  if (partyById(party).is_independent) return false;
  return partySupport(party, bill, ctx) >= V.party_line_threshold;
}

/** 議員一人が賛成する確率 */
export function yesProbability(m: Member, bill: BillLike, ctx: VoteContext): number {
  // 首相は政府の法案に必ず賛成する
  if (m.fixedRole === "首相") return 1;
  const d = distance(m.ideology, bill.position);
  if (partyById(m.party).is_independent) return d < V.independent_support_distance ? V.independent_yes_close : V.independent_yes_far;
  const conv = 1 + (m.conviction - 3) * V.defect_conviction_weight;
  if (partyLine(m.party, bill, ctx)) {
    // 党の方針に逆らって反対する（造反）確率。与党は結束が高いほど造反しにくい
    const cohesion = m.party === ctx.rulingParty ? ctx.cohesion : V.opposition_cohesion;
    const loyalty = 1 + (3 - m.loyalty) * V.defect_loyalty_weight;
    const p = Math.max(0, d - V.defect_distance_start) * V.defect_per_distance * conv * loyalty * (1 - cohesion * V.defect_cohesion_weight);
    return 1 - Math.min(V.defect_max, p);
  }
  // 党が反対でも、思想がごく近い議員はまれに賛成に回る
  return Math.min(V.cross_max, Math.max(0, V.cross_distance - d) * V.cross_per_distance * conv);
}

export interface PartyTally {
  party: string;
  line: boolean;
  yes: number;
  no: number;
}

export interface VoteResult {
  yes: number;
  no: number;
  passed: boolean;
  byParty: PartyTally[];
  /** 党の方針に逆らった議員の番号 */
  rebels: number[];
}

function tally(roster: Member[], bill: BillLike, ctx: VoteContext, decide: (m: Member, p: number) => boolean): VoteResult {
  const byParty = new Map<string, PartyTally>();
  const rebels: number[] = [];
  let yes = 0;
  for (const m of roster) {
    const line = partyLine(m.party, bill, ctx) || m.party === ctx.rulingParty;
    const t = byParty.get(m.party) ?? { party: m.party, line, yes: 0, no: 0 };
    const v = decide(m, yesProbability(m, bill, ctx));
    if (v) {
      t.yes++;
      yes++;
    } else t.no++;
    if (!partyById(m.party).is_independent && v !== line) rebels.push(m.id);
    byParty.set(m.party, t);
  }
  return { yes, no: roster.length - yes, passed: yes >= MAJORITY, byParty: [...byParty.values()], rebels };
}

/** 採決する。rand は0以上1未満の乱数 */
export function castVote(roster: Member[], bill: BillLike, ctx: VoteContext, rand: () => number): VoteResult {
  return tally(roster, bill, ctx, (_m, p) => rand() < p);
}

/** 賛成の見込み（各議員の賛成確率の合計）。法案を出す前の判断に使う */
export function expectedYes(roster: Member[], bill: BillLike, ctx: VoteContext): number {
  return roster.reduce((s, m) => s + yesProbability(m, bill, ctx), 0);
}

/**
 * 内閣不信任案の採決。野党は協力度が高くなければ賛成し、与党の議員は忠誠が低いほど賛成に回りやすい。
 * 可決なら内閣は総辞職する。
 */
export function noConfidenceVote(roster: Member[], ctx: VoteContext, approval: number, rand: () => number): VoteResult {
  const ruling = [ctx.rulingParty, ...ctx.coalitionPartners];
  const nc = rulesRaw.no_confidence;
  const byParty = new Map<string, PartyTally>();
  const rebels: number[] = [];
  let yes = 0;
  for (const m of roster) {
    const isRuling = ruling.includes(m.party);
    const line = !isRuling && (ctx.cooperation[m.party] ?? 0) < nc.cooperation_to_oppose;
    let p: number;
    if (m.fixedRole === "首相") p = 0;
    else if (isRuling) p = Math.max(0, 3 - m.loyalty) * nc.ruling_defect_per_loyalty * (1 + Math.max(0, 20 - approval) / 10);
    else p = line ? 0.97 : 0.1;
    const v = rand() < p;
    const t = byParty.get(m.party) ?? { party: m.party, line, yes: 0, no: 0 };
    if (v) {
      t.yes++;
      yes++;
    } else t.no++;
    if (v !== line) rebels.push(m.id);
    byParty.set(m.party, t);
  }
  return { yes, no: roster.length - yes, passed: yes >= MAJORITY, byParty: [...byParty.values()], rebels };
}
