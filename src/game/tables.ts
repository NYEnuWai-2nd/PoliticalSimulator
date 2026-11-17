// 生成に使う表（data/game/character_tables.json）の型と、表を引く関数
import raw from "../../data/game/character_tables.json";

export const ABILITIES = ["弁舌", "政策", "調整", "知名度", "組織", "資金力"] as const;
export type Ability = (typeof ABILITIES)[number];
export type Abilities = Record<Ability, number>;

export type Rank = "G" | "F" | "E" | "D" | "C" | "B" | "A" | "S";

export type LineageId = "none" | "local_notable" | "hereditary" | "dynasty";

export interface Archetype {
  id: string;
  name: string;
  weight_shugiin: number;
  base_ranks: Record<Ability, Rank>;
  first_elected_age: [number, number];
  variation_multiplier?: number;
  specialty_weights: Record<string, number>;
}

export interface TermTier {
  id: string;
  name: string;
  terms: [number, number];
  weight_shugiin: number;
  jiban_base: number;
  bonus: Record<Ability, number>;
}

export interface Lineage {
  id: LineageId;
  name: string;
  bonus: Partial<Record<Ability, number>>;
  jiban_bonus?: number;
  jiban_min?: number;
  first_elected_age?: [number, number];
}

export interface CharacterTables {
  abilities: Ability[];
  ranks: { rank: Rank; min: number; center: number }[];
  individual_variation: number;
  specialties: string[];
  second_specialty_rate: number;
  archetypes: Archetype[];
  term_tiers: TermTier[];
  years_per_term: number;
  jiban_variation: number;
  min_age: number;
  lineages: Lineage[];
  lineage_profiles: Record<string, Record<LineageId, number>>;
  personality_pairs: [string, string][];
  personality_traits_per_member: number;
}

export const TABLES = raw as unknown as CharacterTables;

export type LineageProfile = keyof typeof raw.lineage_profiles;

/** 1〜100の能力値を表示用のランクに直す */
export function rankOf(value: number): Rank {
  let rank: Rank = "G";
  for (const r of TABLES.ranks) if (value >= r.min) rank = r.rank;
  return rank;
}

/** ランクの中央の値（類型の基準値に使う） */
export function centerOf(rank: Rank): number {
  const r = TABLES.ranks.find((x) => x.rank === rank);
  if (!r) throw new Error(`未知のランクです：${rank}`);
  return r.center;
}
