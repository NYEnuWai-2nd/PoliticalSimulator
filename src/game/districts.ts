// 選挙区と開始時点の議席（設計は docs/design.md の4節と6節）
// 小選挙区は2024年と同じく289区。県ごとの区の数も2024年と同じにする。区の境界は持たず、県と番号だけを持つ。
import seats2024 from "../../data/stats/shugiin_2024_seats.json";
import rulesRaw from "../../data/game/rules.json";
import { PARTIES } from "./parties.js";
import { PREFECTURES } from "../map/japanMap.js";

/** 都道府県コード（1〜47） */
export type PrefCode = number;
/** 小選挙区の番号（1〜289。県の順、県の中では区の番号の順） */
export type DistrictId = number;

interface Seats2024 {
  smd_total: Record<string, number>;
  pr_total: Record<string, number>;
  smd_by_prefecture: Record<string, Record<string, number>>;
}
const SEATS_2024 = seats2024 as Seats2024;

const PARTY_ORDER = new Map(PARTIES.map((p, i) => [p.id, i]));
const orderOf = (id: string) => PARTY_ORDER.get(id) ?? Number.MAX_SAFE_INTEGER;

export const PREF_CODES: PrefCode[] = Array.from({ length: 47 }, (_, i) => i + 1);

/** その県の2024年の小選挙区の数（人口の目安。区の数そのもの） */
export function prefWeight(pref: PrefCode): number {
  return Object.values(SEATS_2024.smd_by_prefecture[String(pref)] ?? {}).reduce((a, b) => a + b, 0);
}

export interface District {
  id: DistrictId;
  pref: PrefCode;
  /** 県の中の区の番号（1から） */
  no: number;
  /** 2024年にこの区を取った政党（区の地力。開始時点の当選者の党でもある） */
  base: string;
}

/**
 * 県の中で、2024年の各党の議席数を区の番号に割り振る。番号の若い順に、
 * 「議席数 ÷（すでに割り振った数 + 0.5）」が最も大きい党を選ぶ（サンラグ式）ので、党が交互に並ぶ。
 */
function baseParties(pref: PrefCode): string[] {
  const counts = SEATS_2024.smd_by_prefecture[String(pref)] ?? {};
  const given: Record<string, number> = {};
  const out: string[] = [];
  const n = prefWeight(pref);
  for (let i = 0; i < n; i++) {
    let best = "";
    let bestQ = -1;
    for (const [id, c] of Object.entries(counts)) {
      if ((given[id] ?? 0) >= c) continue;
      const q = c / ((given[id] ?? 0) + 0.5);
      if (q > bestQ || (q === bestQ && orderOf(id) < orderOf(best))) {
        best = id;
        bestQ = q;
      }
    }
    given[best] = (given[best] ?? 0) + 1;
    out.push(best);
  }
  return out;
}

export const DISTRICTS: District[] = (() => {
  const out: District[] = [];
  for (const pref of PREF_CODES) baseParties(pref).forEach((base, i) => out.push({ id: out.length + 1, pref, no: i + 1, base }));
  return out;
})();

/** 小選挙区（2024年と同じ289区） */
export const SMD_SEATS = DISTRICTS.length;
/** 全国一つの比例区 */
export const PR_SEATS = 176;
export const HOUSE_SEATS = SMD_SEATS + PR_SEATS;
export const MAJORITY = Math.floor(HOUSE_SEATS / 2) + 1;

export const districtById = (id: DistrictId): District => {
  const d = DISTRICTS[id - 1];
  if (!d) throw new Error(`未知の小選挙区です：${id}`);
  return d;
};
export const prefOfDistrict = (id: DistrictId): PrefCode => districtById(id).pref;
export const districtsOf = (pref: PrefCode): District[] => DISTRICTS.filter((d) => d.pref === pref);
/** 「東京7区」の形（北海道は「北海道1区」） */
export const districtName = (id: DistrictId): string => {
  const d = districtById(id);
  const p = PREFECTURES[d.pref - 1];
  return `${p.name === "北海道" ? p.name : p.name.replace(/[都府県]$/, "")}${d.no}区`;
};
/** 県と番号から区を引く。なければ undefined */
export const findDistrict = (pref: PrefCode, no: number): District | undefined => DISTRICTS.find((d) => d.pref === pref && d.no === no);

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
export function prefStrength(pref: PrefCode, party: string): number {
  const c = SEATS_2024.smd_by_prefecture[String(pref)] ?? {};
  const total = Object.values(c).reduce((a, b) => a + b, 0);
  return total ? (c[party] ?? 0) / total : 0;
}

/**
 * 区の中での党の強さ。県の中の強さに、2024年にその区を取った党への上乗せを混ぜる
 * （同じ県の区がみな同じ情勢にならないように。混ぜる割合は rules.json の election.district_lean）。
 */
export function districtStrength(id: DistrictId, party: string): number {
  const d = districtById(id);
  const lean = rulesRaw.election.district_lean;
  return (1 - lean) * prefStrength(d.pref, party) + lean * (d.base === party ? 1 : 0);
}

export interface SeatPlan {
  /** 区 → 小選挙区で当選している政党 */
  smd: Map<DistrictId, string>;
  /** 政党 → 比例の議席数 */
  pr: Map<string, number>;
}

/**
 * 開始時点の議席。小選挙区は区ごとに2024年にその区を取った党（県ごとの議席数は2024年と同じ）。
 * 比例は2024年の比例の獲得議席の比で配る。
 */
export function initialSeatPlan(): SeatPlan {
  return { smd: new Map(DISTRICTS.map((d) => [d.id, d.base])), pr: largestRemainder(SEATS_2024.pr_total, PR_SEATS) };
}

/** ドント式。票（得票率など）の比で total 議席を配る。同じ商なら政党の定義順を優先する */
export function dhondt(votes: Record<string, number>, total: number): Map<string, number> {
  const out = new Map<string, number>();
  const ids = Object.keys(votes).filter((id) => votes[id] > 0);
  for (let i = 0; i < total; i++) {
    let best: string | undefined;
    let bestQ = -1;
    for (const id of ids) {
      const q = votes[id] / ((out.get(id) ?? 0) + 1);
      if (q > bestQ || (q === bestQ && best !== undefined && orderOf(id) < orderOf(best))) {
        best = id;
        bestQ = q;
      }
    }
    if (!best) break;
    out.set(best, (out.get(best) ?? 0) + 1);
  }
  return out;
}

/** 2024年の比例の当選者数の比（全国の政党支持の基準に使う） */
export function prTotals2024(): Record<string, number> {
  return { ...SEATS_2024.pr_total };
}

/** その県の小選挙区の議員（区の番号の順） */
export function smdMembersOf<T extends { seat: string; district: DistrictId | null }>(roster: T[], pref: PrefCode): T[] {
  return roster.filter((m) => m.seat === "小選挙区" && m.district !== null && prefOfDistrict(m.district) === pref).sort((a, b) => a.district! - b.district!);
}

/** その県で小選挙区の議席が最も多い党（地図の県の色に使う）。同じ数なら政党の定義順。議員がいなければ undefined */
export function prefLeadingParty(roster: { seat: string; district: DistrictId | null; party: string }[], pref: PrefCode): string | undefined {
  const count: Record<string, number> = {};
  for (const m of smdMembersOf(roster, pref)) count[m.party] = (count[m.party] ?? 0) + 1;
  return Object.keys(count).sort((a, b) => count[b] - count[a] || orderOf(a) - orderOf(b))[0];
}

/**
 * データや画面の文の「県議」「県議団」「県議会」「県庁」「県政」「県連」を、地元に合わせて
 * 都（東京）・道（北海道）・府（大阪、京都）に置き換える。データの文は「県」で書いておき、画面に出す直前に通す
 */
export function localizeAssembly(text: string, pref: PrefCode | undefined): string {
  if (!pref) return text;
  const s = pref === 13 ? "都" : pref === 1 ? "道" : pref === 26 || pref === 27 ? "府" : "県";
  if (s === "県") return text;
  return text.replace(/県(議会議員|議団|議会|議|庁|政|連)/g, `${s}$1`);
}
