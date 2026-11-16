// 野党での遊び（data/game/opposition.json）。野党の役職、ほかの野党との協力度、党首の行動に使う計算、
// 内閣不信任案の票読み、選挙協力（候補者の一本化）。画面にも career.ts の内部にも依存しない。
import raw from "../../data/game/opposition.json";
import { PARTIES } from "./parties.js";
import type { Member } from "./roster.js";
import type { Ruling } from "./cabinet.js";
import type { Ability } from "./tables.js";
import { partyDistance } from "./vote.js";

export const OPP = raw;

export interface OppPost {
  id: string;
  name: string;
  min_terms: number;
  weights: Partial<Record<Ability, number>>;
  duty: OppDuty;
}

export interface OppDuty {
  exp?: Record<string, number>;
  relations?: Record<string, number>;
  coop_top?: number;
  coop_all?: number;
  proposals?: number;
  diet?: number;
  momentum?: number;
}

export const OPP_POSTS = OPP.posts.list as unknown as OppPost[];

/** 野党でのプレイヤーの状態（CareerState.opp） */
export interface OppositionState {
  /** ほかの野党との協力度（0〜100） */
  cooperation: Record<string, number>;
  /** 選挙協力（候補者の一本化）を結んだ党 */
  pacts: string[];
  /** 自党への追い風（総選挙の全国の支持に足すポイント） */
  momentum: number;
  /** 対案の準備（0〜100） */
  proposals: number;
  /** 不信任案の根回し（国対委員長の公務でたまる） */
  diet: number;
  /** 党首の行動の残り回数（今月） */
  actionPoints: number;
  /** 前に不信任案を出したターン */
  lastNoConfidence?: number;
  /** 今月、不信任案が可決された（月末の処理で内閣の進退を決める） */
  noConfidencePassed?: boolean;
  /** 今月すでに党首討論をしたか */
  debatedTurn?: number;
}

/** 与党でも連立相手でもないか */
export function isOppositionParty(party: string, ruling: Ruling): boolean {
  return party !== ruling.party && !ruling.partners.includes(party);
}

/** 議席のある野党（自党を除く） */
export function otherOppositionParties(roster: Member[], party: string, ruling: Ruling): string[] {
  return PARTIES.filter((p) => !p.is_independent && p.id !== party && isOppositionParty(p.id, ruling) && roster.some((m) => m.party === p.id)).map((p) => p.id);
}

export function initialCooperation(a: string, b: string): number {
  const C = OPP.cooperation;
  return Math.round(Math.max(0, Math.min(100, C.base + (3 - partyDistance(a, b)) * C.per_closeness)));
}

export function newOppositionState(party: string): OppositionState {
  const cooperation: Record<string, number> = {};
  for (const p of PARTIES) if (!p.is_independent && p.id !== party) cooperation[p.id] = initialCooperation(party, p.id);
  return { cooperation, pacts: [], momentum: 0, proposals: 0, diet: 0, actionPoints: 0 };
}

/** 野党第一党か（議席が野党の中で最も多い） */
export function isFirstOpposition(roster: Member[], party: string, ruling: Ruling): boolean {
  const seats = (p: string) => roster.filter((m) => m.party === p).length;
  return otherOppositionParties(roster, party, ruling).every((p) => seats(p) <= seats(party));
}

// ---- 役職 ----

const score = (post: { weights: Partial<Record<Ability, number>> }, m: Member) =>
  Object.entries(post.weights).reduce((s, [a, w]) => s + m.abilities[a as Ability] * (w ?? 0), 0) + Math.min(m.terms, 12) * 4;

/**
 * 野党の党の役職を、党首を除く党の議員から順に選ぶ。adjust はプレイヤーの点数の足し引き（null なら選ばない）。
 * 返すのは役職の id → 議員。
 */
export function assignOppositionPosts(members: Member[], leaderId: number | undefined, adjust: (m: Member) => number | null): Map<string, Member> {
  const out = new Map<string, Member>();
  const taken = new Set<number>(leaderId !== undefined ? [leaderId] : []);
  for (const post of OPP_POSTS) {
    const pool = members.filter((m) => !taken.has(m.id) && m.terms >= post.min_terms && adjust(m) !== null);
    const best = pool.reduce<Member | undefined>((b, m) => (!b || score(post, m) + (adjust(m) ?? 0) > score(post, b) + (adjust(b) ?? 0) ? m : b), undefined);
    if (best) {
      out.set(post.id, best);
      taken.add(best.id);
    }
  }
  return out;
}

// ---- 選挙協力 ----

export interface Pact {
  /** 降ろさずに残す党の候補（プレイヤーの党） */
  keep: string;
  /** 候補を降ろす党 */
  partner: string;
  /** 降ろした党の票のうち、残った党に移る割合 */
  transfer: number;
}

export function pactTransfer(a: string, b: string): number {
  const P = OPP.pact;
  return Math.max(P.transfer_min, P.transfer_base - P.transfer_per_distance * partyDistance(a, b));
}

/**
 * 県ごとの党の票（local）と立てる党（running）に選挙協力を当てはめる。
 * 自党（keep）が立てる県では相手が降り、その票の一部が自党に移る。自党が立てず相手が立てる県では、自党の票の一部が相手に移る。
 */
export function applyPacts(local: Record<string, number>, running: string[], pacts: Pact[]): string[] {
  let out = [...running];
  for (const p of pacts) {
    if (out.includes(p.keep) && out.includes(p.partner)) {
      local[p.keep] = (local[p.keep] ?? 0) + (local[p.partner] ?? 0) * p.transfer;
      delete local[p.partner];
      out = out.filter((x) => x !== p.partner);
    }
  }
  return out;
}

// ---- 内閣不信任案の票読み ----

export function countNoConfidence(
  roster: Member[],
  ctx: { party: string; ruling: Ruling; cooperation: Record<string, number>; govCooperation?: Record<string, number>; cohesion: number; approval: number; diet: number },
  rand: () => number,
): { yes: number; no: number; passed: boolean; defectors: number; byParty: Record<string, number> } {
  const N = OPP.actions.noconfidence;
  const ruling = [ctx.ruling.party, ...ctx.ruling.partners];
  let yes = 0;
  let defectors = 0;
  const byParty: Record<string, number> = {};
  // ほかの野党は党としてまとまって賛否を決める。自分の党との協力度が高く、政権との協力度が低いほど賛成する
  const partyYes = new Map<string, boolean>();
  const blocYes = (party: string) => {
    if (!partyYes.has(party)) {
      const c = N.cooperation_center;
      const p = N.party_yes_base + ((ctx.cooperation[party] ?? 0) - c) * N.per_cooperation - ((ctx.govCooperation?.[party] ?? c) - c) * N.per_cooperation;
      partyYes.set(party, rand() < Math.max(0.05, Math.min(0.97, p)));
    }
    return partyYes.get(party)!;
  };
  for (const m of roster) {
    let p: number;
    if (m.party === ctx.party) p = 1;
    else if (ruling.includes(m.party)) {
      // 与党の議員は、忠誠が低く、結束が弱く、支持率が低いほど造反しやすい。国対の根回しでも増える
      p = Math.max(0, 3 - m.loyalty) * N.ruling_defect_per_loyalty * (1 + Math.max(0, 0.7 - ctx.cohesion) * 3) * (1 + Math.max(0, 30 - ctx.approval) / 15) + ctx.diet * N.diet_per_point;
    } else p = blocYes(m.party) ? 0.97 : 0.03;
    if (rand() < p) {
      yes++;
      byParty[m.party] = (byParty[m.party] ?? 0) + 1;
      if (ruling.includes(m.party)) defectors++;
    }
  }
  return { yes, no: roster.length - yes, passed: yes >= Math.floor(roster.length / 2) + 1, defectors, byParty };
}
