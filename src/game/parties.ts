// 架空政党の定義（data/game/parties.json）
import raw from "../../data/game/parties.json";
import type { LineageProfile } from "./tables.js";

export type IdeologyAxisId = "economy" | "fiscal" | "security" | "social" | "governance";
export type Ideology = Record<IdeologyAxisId, number>;

export interface IdeologyAxis {
  id: IdeologyAxisId;
  name: string;
  minus: string;
  plus: string;
}

export interface Party {
  id: string;
  name: string;
  short: string;
  color: string;
  lineage_profile: LineageProfile;
  ideology_center: Ideology;
  ideology_spread: number;
  /** 経歴類型idごとの重み。ない場合は衆議院全体の重みを使う */
  archetype_weights?: Record<string, number>;
  is_independent?: boolean;
  /** 開始時点には存在せず、ゲームの途中で結成される */
  appears_later?: boolean;
}

const data = raw as unknown as { ideology_axes: IdeologyAxis[]; parties: Party[] };

export const IDEOLOGY_AXES = data.ideology_axes;
export const PARTIES = data.parties;

export function partyById(id: string): Party {
  const p = PARTIES.find((x) => x.id === id);
  if (!p) throw new Error(`未知の政党です：${id}`);
  return p;
}
