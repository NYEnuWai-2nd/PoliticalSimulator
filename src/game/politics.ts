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

/** 連立の中の思想の幅（2党のあいだの思想の距離の最大） */
function spreadOf(parties: string[]): number {
  let max = 0;
  for (let i = 0; i < parties.length; i++) for (let j = i + 1; j < parties.length; j++) max = Math.max(max, partyDistance(parties[i], parties[j]));
  return max;
}

/** pool から k 個までを選ぶ組み合わせ（空も含む） */
function subsets<T>(pool: T[], k: number): T[][] {
  const out: T[][] = [[]];
  const walk = (start: number, cur: T[]) => {
    for (let i = start; i < pool.length; i++) {
      const next = [...cur, pool[i]];
      out.push(next);
      if (next.length < k) walk(i + 1, next);
    }
  };
  if (k > 0) walk(0, []);
  return out;
}

/**
 * 総選挙のあとに政権を組み直す（設計は docs/design.md の「政局」）。
 * 1. 今の与党と連立相手で過半数があれば、そのまま続ける。
 * 2. なければ、「今の与党に党を足す形」と「第一党を中心にする形」の両方で、中心の党から思想の距離が
 *    max_partner_distance 以内の党を最大 max_partners 党まで足した組み合わせを全部作り、過半数に届くものから選ぶ。
 *    連立相手は中心の党の議席の junior_share 倍より少ない党に限る。選ぶ順は、加わる党が少ない → 第一党が中心 → 思想の幅が狭い → 過半数を超えすぎない（最小勝利連合）。
 *    近い党から順に足す形だと、議席の少ない党ばかりが選ばれて中規模の党に声がかからないため。
 * 3. どれも届かなければ、議席が最も多くなる組み合わせと今の与党のうち、議席の多いほうが少数与党として政権を担う。
 */
export function formCoalition(roster: Member[], prev: Ruling): CoalitionResult {
  const C = P.coalition;
  const seats = (r: Ruling) => seatsOf(roster, r.party) + r.partners.reduce((a, p) => a + seatsOf(roster, p), 0);
  const kept: Ruling = { party: prev.party, partners: prev.partners.filter((p) => seatsOf(roster, p) > 0) };
  const keptAlive = seatsOf(roster, kept.party) > 0;
  if (keptAlive && seats(kept) >= MAJORITY) {
    return { ruling: kept, changed: false, seats: seats(kept), text: `${describe(kept)}が過半数（${seats(kept)}議席）を保ち、政権を続ける。` };
  }
  const order = partiesBySeats(roster);
  const leader = order[0];
  const bases: Ruling[] = [{ party: leader, partners: [] }];
  if (keptAlive && kept.party !== leader) bases.push(kept);
  else if (keptAlive) bases[0] = kept;
  const options: Ruling[] = [];
  for (const base of bases) {
    // 連立相手は、中心の党の議席の junior_share 倍より少ない党に限る（対立する大政党どうしの大連立はつくらない）
    const limit = seatsOf(roster, base.party) * C.junior_share;
    const pool = order.filter((p) => p !== base.party && !base.partners.includes(p) && seatsOf(roster, p) < limit && partyDistance(base.party, p) <= C.max_partner_distance);
    for (const add of subsets(pool, Math.max(0, C.max_partners - base.partners.length))) options.push({ party: base.party, partners: [...base.partners, ...add] });
  }
  let winning = options.filter((r) => seats(r) >= MAJORITY);
  // 第一党を中心にしても、今の与党に足しても届かないときは、第一党を除いた連合を作る（1993年の非自民連立の型）
  let anti = false;
  if (!winning.length) {
    for (const base of order.filter((p) => p !== leader).slice(0, C.anti_bases)) {
      const pool = order.filter((p) => p !== leader && p !== base && seatsOf(roster, p) <= seatsOf(roster, base));
      for (const add of subsets(pool, C.anti_max_partners)) {
        const members = [base, ...add];
        if (spreadOf(members) > C.anti_max_spread) continue;
        const r = { party: base, partners: add };
        if (seats(r) >= MAJORITY) winning.push(r);
      }
    }
    if (winning.length) anti = true;
  }
  let ruling: Ruling;
  if (winning.length) {
    const key = (r: Ruling) => [r.partners.length, r.party === leader ? 0 : 1, spreadOf([r.party, ...r.partners]), seats(r)];
    ruling = winning.sort((x, y) => {
      const kx = key(x);
      const ky = key(y);
      for (let i = 0; i < kx.length; i++) if (kx[i] !== ky[i]) return kx[i] - ky[i];
      return 0;
    })[0];
  } else {
    // 過半数に届かないときは、第一党を中心に議席が最も多くなる組み合わせと、今の与党を比べる
    const fresh = options.filter((r) => r.party === leader).sort((x, y) => seats(y) - seats(x) || spreadOf([x.party, ...x.partners]) - spreadOf([y.party, ...y.partners]))[0] ?? { party: leader, partners: [] };
    ruling = keptAlive && seats(kept) >= seats(fresh) ? kept : fresh;
  }
  // 第一党を除いた連合の首相は、連合の中で思想の真ん中にいる党から出す（議席の多い党とは限らない）
  if (anti) ruling = centerLed(roster, ruling);
  const changed = ruling.party !== prev.party;
  const minority = seats(ruling) < MAJORITY ? "少数与党として" : "";
  const text = changed
    ? `政権交代。${describe(ruling)}が${minority}政権を担う（${seats(ruling)}議席）。`
    : `${describe(ruling)}が${minority}政権を続ける（${seats(ruling)}議席）。`;
  return { ruling, changed, seats: seats(ruling), text };
}

/** 連合の中で、ほかの党との思想の距離の合計（議席で重み付け）が最も小さい党を首相の党にする */
export function centerLed(roster: Member[], r: Ruling): Ruling {
  const members = [r.party, ...r.partners];
  const cost = (p: string) => members.reduce((a, q) => a + partyDistance(p, q) * seatsOf(roster, q), 0);
  const center = [...members].sort((a, b) => cost(a) - cost(b) || seatsOf(roster, b) - seatsOf(roster, a))[0];
  return { party: center, partners: members.filter((p) => p !== center) };
}

/** 連立が第一党を除いた連合か（首相の党も第一党も政権の外） */
export function isAntiCoalition(roster: Member[], r: Ruling): boolean {
  const leader = partiesBySeats(roster)[0];
  return r.party !== leader && !r.partners.includes(leader);
}

export function describe(r: Ruling): string {
  return [r.party, ...r.partners].map((p) => partyById(p).short).join("・");
}

// ---- 党首 ----

/** 党首にふさわしいかの点数。当選回数と、調整・知名度・資金の能力で決まる */
export function leaderScore(m: Member): number {
  const W = P.leader.score;
  return m.terms * W.terms + m.abilities.調整 * W.coord + m.abilities.知名度 * W.fame + m.abilities.資金力 * W.fund;
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
    /** extra の候補に必ず入れる議員と、extra には入れない議員（プレイヤーとの関係の札による） */
    bias?: { for: number[]; against: number[] };
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
      if (c.id === opts.extra?.member.id) {
        u += opts.extra.bonus;
        if (opts.bias?.for.includes(voter.id)) u += 1000;
        if (opts.bias?.against.includes(voter.id)) u -= 1000;
      }
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
