// 政界再編（党の合流と分裂、途中で結成される党）で変わる、党の勢力の持ち方。
// 党の全国の支持の基準と、区での強さは、もとは 2024 年の数字で固定している（rules.json の support_base、districts.ts）。
// 合流や分裂のあとは、ここで持つ上書きを通して読む。Realign は JSON で保存できる形（CareerState.realign）。
// 数値は data/game/politics.json の realign。いつ起こすかは career.ts が決める。
import rulesRaw from "../../data/game/rules.json";
import { PARTIES, partyById } from "./parties.js";
import { districtById, prefStrength } from "./districts.js";
import type { DistrictId, PrefCode } from "./districts.js";

export interface RealignEvent {
  turn: number;
  kind: "merge" | "split";
  /** 合流：なくなった党。分裂：もとの党 */
  from: string[];
  /** 合流してできた党、分裂して出た人たちの党 */
  into: string;
}

export interface Realign {
  /** 党ごとの全国の支持の基準（%）。ない党は rules.json の support_base */
  support: Record<string, number>;
  /** 区での強さの引き継ぎ（党 → もとの党ごとの重み）。ない党は自分自身が1 */
  roots: Record<string, Record<string, number>>;
  /** 区ごとの「地盤の党」の上書き（分裂で移った現職の区）。ない区は 2024 年にその区を取った党 */
  base: Record<number, string>;
  /** 途中で結成された党 */
  formed: string[];
  /** 合流でなくなった党 → 引き継いだ党 */
  heirs: Record<string, string>;
  events: RealignEvent[];
}

export const newRealign = (): Realign => ({ support: {}, roots: {}, base: {}, formed: [], heirs: {}, events: [] });

const SUPPORT_BASE = rulesRaw.election.support_base as unknown as Record<string, number>;

/** なくなった党を、引き継いだ党にたどる */
export function resolveParty(dyn: Realign | undefined, id: string): string {
  let cur = id;
  for (let i = 0; i < 10 && dyn?.heirs[cur]; i++) cur = dyn.heirs[cur];
  return cur;
}

/** 今その党があるか（無所属は除く。途中で結成される党は結成されてから。合流でなくなった党は除く） */
export function partyExists(dyn: Realign | undefined, id: string): boolean {
  const p = partyById(id);
  if (p.is_independent) return false;
  if (dyn?.heirs[id]) return false;
  return !p.appears_later || !!dyn?.formed.includes(id);
}

/** 今ある党の一覧（政党の定義の順） */
export function existingParties(dyn?: Realign): string[] {
  return PARTIES.filter((p) => partyExists(dyn, p.id)).map((p) => p.id);
}

/** 全国の支持の基準（%） */
export function supportBaseOf(dyn: Realign | undefined, id: string): number {
  return dyn?.support[id] ?? SUPPORT_BASE[id] ?? 0;
}

const rootsOf = (dyn: Realign | undefined, id: string): Record<string, number> => dyn?.roots[id] ?? { [id]: 1 };

/** 県の中での党の強さ（引き継いだ党の強さを重みで足す） */
export function dynPrefStrength(dyn: Realign | undefined, pref: PrefCode, party: string): number {
  if (!dyn) return prefStrength(pref, party);
  let s = 0;
  for (const [src, w] of Object.entries(rootsOf(dyn, party))) s += w * prefStrength(pref, src);
  return Math.min(1, s);
}

/** 区の中での党の強さ（districts.ts の districtStrength の、再編のあとの形） */
export function dynDistrictStrength(dyn: Realign | undefined, id: DistrictId, party: string): number {
  const d = districtById(id);
  const lean = rulesRaw.election.district_lean;
  const base = dyn ? (dyn.base[id] ?? resolveParty(dyn, d.base)) : d.base;
  return (1 - lean) * dynPrefStrength(dyn, d.pref, party) + lean * (base === party ? 1 : 0);
}

const round1 = (v: number) => Math.round(v * 10) / 10;

/**
 * 合流：from の党がなくなり、into の党（from の一つでも、新しい党でもよい）が支持と地盤を引き継ぐ。
 * 支持は足した値に keep を掛ける（合流の混乱で少し減る）
 */
export function applyMerge(dyn: Realign, from: string[], into: string, keep: number, turn: number): void {
  const all = [...new Set([...from, into])].filter((p) => p === into ? partyExists(dyn, p) : true);
  const support = all.reduce((a, p) => a + supportBaseOf(dyn, p), 0) * keep;
  const roots: Record<string, number> = {};
  for (const p of all) for (const [src, w] of Object.entries(rootsOf(dyn, p))) roots[src] = (roots[src] ?? 0) + w;
  const gone = from.filter((p) => p !== into);
  for (const p of gone) {
    dyn.heirs[p] = into;
    delete dyn.support[p];
    delete dyn.roots[p];
  }
  for (const k of Object.keys(dyn.base)) if (gone.includes(dyn.base[Number(k)])) dyn.base[Number(k)] = into;
  if (partyById(into).appears_later && !dyn.formed.includes(into)) dyn.formed.push(into);
  dyn.support[into] = round1(support);
  dyn.roots[into] = roots;
  dyn.events.push({ turn, kind: "merge", from: gone, into });
}

/**
 * 分裂：parent の党の frac（議員の割合）が into の党に移る。into は新しい党でも、今ある党でもよい。
 * 移る分の支持には keep を掛ける（看板を失うので目減りする）。districts は移った現職の小選挙区
 */
export function applySplit(dyn: Realign, parent: string, into: string, frac: number, keep: number, districts: DistrictId[], turn: number): void {
  const exists = partyExists(dyn, into);
  const parentSupport = supportBaseOf(dyn, parent);
  const parentRoots = rootsOf(dyn, parent);
  const intoRoots: Record<string, number> = exists ? { ...rootsOf(dyn, into) } : {};
  const left: Record<string, number> = {};
  for (const [src, w] of Object.entries(parentRoots)) {
    intoRoots[src] = (intoRoots[src] ?? 0) + w * frac;
    left[src] = w * (1 - frac);
  }
  dyn.support[into] = round1((exists ? supportBaseOf(dyn, into) : 0) + parentSupport * frac * keep);
  dyn.support[parent] = round1(parentSupport * (1 - frac));
  dyn.roots[into] = intoRoots;
  dyn.roots[parent] = left;
  for (const d of districts) dyn.base[d] = into;
  if (partyById(into).appears_later && !dyn.formed.includes(into)) dyn.formed.push(into);
  dyn.events.push({ turn, kind: "split", from: [parent], into });
}
