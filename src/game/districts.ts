// 選挙区と開始時点の議席（設計は docs/design.md の4節と6節）
import seats2024 from "../../data/stats/shugiin_2024_seats.json";
import scenario from "../../data/game/scenario.json";
import { PARTIES } from "./parties.js";

/** 小選挙区（都道府県ごとに1区） */
export const SMD_SEATS = 47;
/** 全国一つの比例区 */
export const PR_SEATS = 29;
export const HOUSE_SEATS = SMD_SEATS + PR_SEATS;
export const MAJORITY = Math.floor(HOUSE_SEATS / 2) + 1;

/** 都道府県コード（1〜47） */
export type PrefCode = number;

interface Seats2024 {
  smd_total: Record<string, number>;
  pr_total: Record<string, number>;
  smd_by_prefecture: Record<string, Record<string, number>>;
}
const SEATS_2024 = seats2024 as Seats2024;

const PARTY_ORDER = new Map(PARTIES.map((p, i) => [p.id, i]));
const orderOf = (id: string) => PARTY_ORDER.get(id) ?? Number.MAX_SAFE_INTEGER;

/** 票（ここでは実際の当選者数）の比で total 議席を配る（最大剰余法）。同じ剰余なら政党の定義順を優先する */
export function largestRemainder(counts: Record<string, number>, total: number): Map<string, number> {
  const entries = Object.entries(counts).filter(([, n]) => n > 0);
  const sum = entries.reduce((a, [, n]) => a + n, 0);
  const quotas = entries.map(([id, n]) => ({ id, q: (n * total) / sum }));
  const out = new Map(quotas.map(({ id, q }) => [id, Math.floor(q)]));
  let rest = total - [...out.values()].reduce((a, b) => a + b, 0);
  const order = [...quotas].sort((a, b) => b.q - Math.floor(b.q) - (a.q - Math.floor(a.q)) || orderOf(a.id) - orderOf(b.id));
  for (const { id } of order) {
    if (rest-- <= 0) break;
    out.set(id, out.get(id)! + 1);
  }
  // 議席が0になった党は結果に含めない
  for (const [id, n] of out) if (n === 0) out.delete(id);
  return out;
}

/** 2024年にその県の小選挙区で各党が取った議席の割合（県内での強さ） */
function strength(pref: PrefCode, party: string): number {
  const c = SEATS_2024.smd_by_prefecture[String(pref)] ?? {};
  const total = Object.values(c).reduce((a, b) => a + b, 0);
  return total ? (c[party] ?? 0) / total : 0;
}

/** その県の2024年の小選挙区の数（人口の目安） */
export function prefWeight(pref: PrefCode): number {
  return Object.values(SEATS_2024.smd_by_prefecture[String(pref)] ?? {}).reduce((a, b) => a + b, 0);
}

export interface SeatPlan {
  /** 県 → 小選挙区で当選している政党 */
  smd: Map<PrefCode, string>;
  /** 政党 → 比例の議席数 */
  pr: Map<string, number>;
}

/**
 * 開始時点の議席。小選挙区は2024年の小選挙区の獲得議席の比で各党の数を決め、
 * 各党が強かった県から順に割り当てる（県ごとの最多党をそのまま勝たせると民政党が過半数を超えるため）。
 * 比例は2024年の比例の獲得議席の比で配る。
 * 最後に data/game/scenario.json の smd_overrides で手で決めた県を上書きする（元の勝者は小選挙区が1つ減る）。
 */
export function initialSeatPlan(): SeatPlan {
  const quota = largestRemainder(SEATS_2024.smd_total, SMD_SEATS);
  const smd = new Map<PrefCode, string>();
  const candidates: { pref: PrefCode; party: string; s: number }[] = [];
  for (let pref = 1; pref <= SMD_SEATS; pref++)
    for (const party of quota.keys()) {
      const s = strength(pref, party);
      if (s > 0) candidates.push({ pref, party, s });
    }
  // 強さが同じなら、その党が多くの議席を取った大きな県を先にする
  candidates.sort((a, b) => b.s - a.s || prefWeight(b.pref) - prefWeight(a.pref) || a.pref - b.pref || orderOf(a.party) - orderOf(b.party));
  for (const { pref, party } of candidates) {
    if (smd.has(pref) || (quota.get(party) ?? 0) <= 0) continue;
    smd.set(pref, party);
    quota.set(party, quota.get(party)! - 1);
  }
  // 残った県は、枠が余っている党のうち最も強い党に渡す
  for (let pref = 1; pref <= SMD_SEATS; pref++) {
    if (smd.has(pref)) continue;
    const left = [...quota.entries()].filter(([, n]) => n > 0).map(([id]) => id);
    left.sort((a, b) => strength(pref, b) - strength(pref, a) || orderOf(a) - orderOf(b));
    smd.set(pref, left[0]);
    quota.set(left[0], quota.get(left[0])! - 1);
  }
  // 2県の勝者を入れ替えると強さの合計が増えるなら入れ替える（各党の議席数は変わらない）
  for (let improved = true; improved; ) {
    improved = false;
    for (let a = 1; a <= SMD_SEATS; a++)
      for (let b = a + 1; b <= SMD_SEATS; b++) {
        const pa = smd.get(a)!;
        const pb = smd.get(b)!;
        if (pa === pb) continue;
        const gain = strength(a, pb) + strength(b, pa) - strength(a, pa) - strength(b, pb);
        if (gain > 1e-9) {
          smd.set(a, pb);
          smd.set(b, pa);
          improved = true;
        }
      }
  }
  const overrides = (scenario as { smd_overrides: Record<string, { party: string }> }).smd_overrides;
  for (const [pref, { party }] of Object.entries(overrides)) smd.set(Number(pref), party);
  return { smd, pr: largestRemainder(SEATS_2024.pr_total, PR_SEATS) };
}
