// 政局：総選挙のあとの連立の組み直し（政権交代）と、党首選
// 画面に依存しない。議員人生モード（career.ts）が使う。
import politicsRaw from "../../data/game/politics.json";
import type { Member } from "./roster.js";
import type { Ruling } from "./cabinet.js";
import { partyById } from "./parties.js";
import { IDEOLOGY_AXES } from "./parties.js";
import { MAJORITY } from "./districts.js";
import { partyDistance } from "./vote.js";

const P = politicsRaw;

export function seatsOf(roster: Member[], party: string): number {
  return roster.filter((m) => m.party === party).length;
}

/** 議席のある政党（無所属を除く）を議席の多い順に */
export function partiesBySeats(roster: Member[]): string[] {
  const parties = [...new Set(roster.map((m) => m.party))].filter((p) => !partyById(p).is_independent);
  return parties.sort((a, b) => seatsOf(roster, b) - seatsOf(roster, a));
}

export interface CoalitionResult {
  ruling: Ruling;
  /** 与党第一党が替わったか（政権交代） */
  changed: boolean;
  /** 与党の議席の合計 */
  seats: number;
  text: string;
}

/**
 * 総選挙のあとに政権を組み直す。
 * 1. 今の与党と連立相手で過半数があれば、そのまま続ける。
 * 2. なければ第一党が、思想の近い党（距離が max_partner_distance 以内）を近い順に、過半数に届くまで最大 max_partners 党と連立を組む。
 * 3. それでも届かなければ、今の与党と新しい組み合わせのうち議席の多いほうが少数与党として政権を担う。
 */
export function formCoalition(roster: Member[], prev: Ruling): CoalitionResult {
  const seats = (r: Ruling) => seatsOf(roster, r.party) + r.partners.reduce((a, p) => a + seatsOf(roster, p), 0);
  const kept: Ruling = { party: prev.party, partners: prev.partners.filter((p) => seatsOf(roster, p) > 0) };
  if (seatsOf(roster, kept.party) > 0 && seats(kept) >= MAJORITY) {
    return { ruling: kept, changed: false, seats: seats(kept), text: `${describe(kept)}が過半数（${seats(kept)}議席）を保ち、政権を続ける。` };
  }
  const leader = partiesBySeats(roster)[0];
  const fresh: Ruling = { party: leader, partners: [] };
  const candidates = partiesBySeats(roster)
    .filter((p) => p !== leader && partyDistance(leader, p) <= P.coalition.max_partner_distance)
    .sort((a, b) => partyDistance(leader, a) - partyDistance(leader, b));
  for (const p of candidates) {
    if (seats(fresh) >= MAJORITY || fresh.partners.length >= P.coalition.max_partners) break;
    fresh.partners.push(p);
  }
  let ruling = fresh;
  if (seats(fresh) < MAJORITY && seatsOf(roster, kept.party) > 0 && seats(kept) >= seats(fresh)) ruling = kept;
  const changed = ruling.party !== prev.party;
  const minority = seats(ruling) < MAJORITY ? "少数与党として" : "";
  const text = changed
    ? `政権交代。${describe(ruling)}が${minority}政権を担う（${seats(ruling)}議席）。`
    : `${describe(ruling)}が${minority}政権を続ける（${seats(ruling)}議席）。`;
  return { ruling, changed, seats: seats(ruling), text };
}

export function describe(r: Ruling): string {
  return [r.party, ...r.partners].map((p) => partyById(p).short).join("・");
}

// ---- 党首 ----

/** 党首にふさわしいかの点数。当選回数と、調整・知名度・資金の能力で決まる */
export function leaderScore(m: Member): number {
  const W = P.leader.score;
  return m.terms * W.terms + m.abilities.調整 * W.coord + m.abilities.知名度 * W.fame + m.abilities.資金 * W.fund;
}

/** その党で党首にふさわしい議員（点数の最も高い議員） */
export function pickLeader(roster: Member[], party: string, exclude: number[] = []): Member | undefined {
  return roster.filter((m) => m.party === party && !exclude.includes(m.id)).reduce<Member | undefined>((b, m) => (!b || leaderScore(m) > leaderScore(b) ? m : b), undefined);
}

function ideologyGap(a: Member, b: Member): number {
  return IDEOLOGY_AXES.reduce((s, x) => s + Math.abs(a.ideology[x.id] - b.ideology[x.id]), 0) / IDEOLOGY_AXES.length;
}

export interface LeaderElection {
  party: string;
  candidates: { member: Member; votes: number }[];
  winner: Member;
}

/**
 * 党首選。その党の議員が投票する。候補は点数の高い上位 candidates 人（現職の党首を含む）と、立候補したプレイヤー。
 * 各議員は「候補の点数 − 思想の差 + 揺らぎ」が最も高い候補に入れる。現職とプレイヤーには上乗せがある。
 */
export function leaderElection(
  roster: Member[],
  party: string,
  opts: {
    incumbentId?: number;
    /** 現職の党首が与党の党首（首相）のときの内閣支持率。高ければ現職に有利、低ければ不利 */
    incumbentApproval?: number;
    /** 立候補できない議員（任期の上限に達した党首など） */
    excludeIds?: number[];
    extra?: { member: Member; bonus: number };
    rand: () => number;
  },
): LeaderElection | undefined {
  const L = P.leader;
  const members = roster.filter((m) => m.party === party);
  if (!members.length) return undefined;
  const excluded = new Set(opts.excludeIds ?? []);
  const pool = members.filter((m) => m.id !== opts.extra?.member.id && !excluded.has(m.id)).sort((a, b) => leaderScore(b) - leaderScore(a));
  const cands: Member[] = pool.slice(0, L.candidates);
  const inc = opts.incumbentId !== undefined && !excluded.has(opts.incumbentId) ? members.find((m) => m.id === opts.incumbentId) : undefined;
  if (inc && !cands.some((c) => c.id === inc.id) && inc.id !== opts.extra?.member.id) cands.push(inc);
  if (opts.extra) cands.push(opts.extra.member);
  // 立候補できる人がいない（議員が1人だけで、その人が任期の上限に達した党首など）ときは、
  // 立候補できない条件を外して党の議員から選ぶ。党首がいない党はつくらない
  if (!cands.length) cands.push(...[...members].sort((a, b) => leaderScore(b) - leaderScore(a)).slice(0, L.candidates));
  const votes = new Map<number, number>(cands.map((c) => [c.id, 0]));
  for (const voter of members) {
    let best = cands[0];
    let bestU = -Infinity;
    for (const c of cands) {
      let u = leaderScore(c) / L.score_divisor - ideologyGap(voter, c) * L.ideology_weight + opts.rand() * L.noise;
      if (c.id === inc?.id) u += L.incumbent_bonus + (opts.incumbentApproval !== undefined ? (opts.incumbentApproval - 35) * L.incumbent_approval_weight : 0);
      if (c.id === opts.extra?.member.id) u += opts.extra.bonus;
      if (c.id === voter.id) u += L.self_bonus;
      if (u > bestU) {
        bestU = u;
        best = c;
      }
    }
    votes.set(best.id, votes.get(best.id)! + 1);
  }
  const candidates = cands.map((member) => ({ member, votes: votes.get(member.id)! })).sort((a, b) => b.votes - a.votes || leaderScore(b.member) - leaderScore(a.member));
  return { party, candidates, winner: candidates[0].member };
}
