// 特殊能力（data/game/skills.json）。受け身の効果だけを持ち、活動や選挙の結果を変える。
// 金特（強力で珍しい）、青特（経歴類型や家系に結び付いた利点）、赤特（欠点）、緑特（利点にも欠点にもなる）の4種類。
import raw from "../../data/game/skills.json";
import { mulberry32 } from "../lib/nameGenerator.js";
import type { Ability } from "./tables.js";

export type SkillColor = "gold" | "blue" | "red" | "green";

/** 身につける（または欠点が外れる）条件。書いてあるものをすべて満たすと成り立つ */
export interface SkillCondition {
  /** 活動の id ごとの、行った回数の下限 */
  activity?: Record<string, number>;
  /** 能力の下限 */
  ability?: Partial<Record<Ability, number>>;
  /** 当選回数の下限 */
  terms?: number;
  /** 地盤の下限 */
  jiban?: number;
}

export interface SkillMishap {
  activities: string[];
  chance: number;
  text: string;
  effects: Record<string, unknown>;
}

export interface SkillEffects {
  /** 活動ごとの経験点の倍率（all は全部、duty は公務） */
  exp?: Record<string, number>;
  /** 地盤の進み具合の倍率 */
  jiban?: number;
  /** 活動で使う体力の倍率 */
  stamina?: number;
  /** 関係が上がるときの倍率 */
  relations?: Record<string, number>;
  /** 選挙で本人の票に足す割合 */
  vote?: number;
  /** 資金集めで得る資金の倍率 */
  money?: number;
  /** 出来事の能力判定で能力に足す値 */
  risk?: Partial<Record<Ability, number>>;
  /** 地盤が下がるまでの月数の増減 */
  neglect?: number;
  mishap?: SkillMishap;
}

export interface Skill {
  id: string;
  name: string;
  color: SkillColor;
  description: string;
  effects: SkillEffects;
  acquire?: SkillCondition;
  cure?: SkillCondition;
  replaces?: string[];
}

interface SkillData {
  skills: Skill[];
  archetype_skills: { rate: number; map: Record<string, string> };
  lineage_skills: Record<string, { id: string; rate: number }[]>;
  npc: { red_rate: number; gold_rate: number; gold_min_terms: number; green_rate: number; red_pool: string[]; gold_pool: string[]; green_pool: string[] };
  player: Record<string, string[]>;
}

const DATA = raw as unknown as SkillData;
export const SKILLS = DATA.skills;
export const COLOR_NAMES: Record<SkillColor, string> = { gold: "金", blue: "青", red: "赤", green: "緑" };
const COLOR_ORDER: SkillColor[] = ["gold", "blue", "green", "red"];

export function skillById(id: string): Skill | undefined {
  return SKILLS.find((s) => s.id === id);
}

/** 表示用に、金・青・緑・赤の順に並べる */
export function sortSkills(ids: readonly string[]): Skill[] {
  return ids
    .map(skillById)
    .filter((s): s is Skill => !!s)
    .sort((a, b) => COLOR_ORDER.indexOf(a.color) - COLOR_ORDER.indexOf(b.color));
}

const effectsOf = (ids: readonly string[] | undefined) => (ids ?? []).map((id) => skillById(id)?.effects).filter((e): e is SkillEffects => !!e);

/** 活動（または公務 "duty"）の経験点の倍率 */
export function expMultiplier(ids: readonly string[] | undefined, activity: string): number {
  return effectsOf(ids).reduce((m, e) => m * (e.exp?.[activity] ?? 1) * (e.exp?.all ?? 1), 1);
}

export function staminaMultiplier(ids: readonly string[] | undefined): number {
  return effectsOf(ids).reduce((m, e) => m * (e.stamina ?? 1), 1);
}

export function relationMultiplier(ids: readonly string[] | undefined, relation: string): number {
  return effectsOf(ids).reduce((m, e) => m * (e.relations?.[relation] ?? 1), 1);
}

export function jibanMultiplier(ids: readonly string[] | undefined): number {
  return effectsOf(ids).reduce((m, e) => m * (e.jiban ?? 1), 1);
}

export function moneyMultiplier(ids: readonly string[] | undefined): number {
  return effectsOf(ids).reduce((m, e) => m * (e.money ?? 1), 1);
}

/** 選挙で本人の票に足す割合（議員みんなに効く） */
export function skillVote(ids: readonly string[] | undefined): number {
  return effectsOf(ids).reduce((v, e) => v + (e.vote ?? 0), 0);
}

export function riskBonus(ids: readonly string[] | undefined, ability: Ability): number {
  return effectsOf(ids).reduce((v, e) => v + (e.risk?.[ability] ?? 0), 0);
}

export function neglectShift(ids: readonly string[] | undefined): number {
  return effectsOf(ids).reduce((v, e) => v + (e.neglect ?? 0), 0);
}

/** その活動のあとに起きうる失敗（失言癖など） */
export function mishapsFor(ids: readonly string[] | undefined, activity: string): { skill: Skill; mishap: SkillMishap }[] {
  return (ids ?? [])
    .map(skillById)
    .filter((s): s is Skill => !!s?.effects.mishap?.activities.includes(activity))
    .map((s) => ({ skill: s, mishap: s.effects.mishap! }));
}

export interface ConditionContext {
  activityCounts: Record<string, number>;
  abilities: Record<Ability, number>;
  terms: number;
  jiban: number;
}

export function meets(c: SkillCondition, ctx: ConditionContext): boolean {
  if (c.terms !== undefined && ctx.terms < c.terms) return false;
  if (c.jiban !== undefined && ctx.jiban < c.jiban) return false;
  for (const [a, n] of Object.entries(c.activity ?? {})) if ((ctx.activityCounts[a] ?? 0) < n) return false;
  for (const [a, n] of Object.entries(c.ability ?? {})) if (ctx.abilities[a as Ability] < (n as number)) return false;
  return true;
}

/** 条件の進み具合を短い文にする（「地元回り 12/24・地盤 2/4」） */
export function conditionProgress(c: SkillCondition, ctx: ConditionContext, activityName: (id: string) => string): string {
  const parts: string[] = [];
  for (const [a, n] of Object.entries(c.activity ?? {})) parts.push(`${activityName(a)} ${Math.min(ctx.activityCounts[a] ?? 0, n)}/${n}回`);
  for (const [a, n] of Object.entries(c.ability ?? {})) parts.push(`${a} ${ctx.abilities[a as Ability]}/${n}`);
  if (c.terms !== undefined) parts.push(`当選 ${Math.min(ctx.terms, c.terms)}/${c.terms}回`);
  if (c.jiban !== undefined) parts.push(`地盤 ${Math.min(ctx.jiban, c.jiban)}/${c.jiban}`);
  return parts.join("・");
}

/**
 * 条件を満たした特殊能力を身につけ、条件を満たした欠点を外す。変わったものを返す。
 * 身につけた特殊能力に replaces があれば、それを外す（論破王を身につけたら辻説法は外れる、など）。
 */
export function updateSkills(ids: readonly string[], ctx: ConditionContext): { skills: string[]; gained: Skill[]; lost: Skill[] } {
  let skills = [...ids];
  const gained: Skill[] = [];
  const lost: Skill[] = [];
  for (const s of SKILLS) {
    if (s.acquire && !skills.includes(s.id) && meets(s.acquire, ctx)) {
      // 上位の特殊能力を持っていれば、下位のものは身につけない
      if (SKILLS.some((x) => x.replaces?.includes(s.id) && skills.includes(x.id))) continue;
      skills.push(s.id);
      gained.push(s);
      for (const r of s.replaces ?? [])
        if (skills.includes(r)) {
          skills = skills.filter((x) => x !== r);
          lost.push(skillById(r)!);
        }
    }
  }
  for (const id of [...skills]) {
    const s = skillById(id);
    if (s?.cure && meets(s.cure, ctx)) {
      skills = skills.filter((x) => x !== id);
      lost.push(s);
    }
  }
  return { skills, gained, lost };
}

/** プレイヤーが始めるときの特殊能力（経歴類型の青特と、出自ごとのもの） */
export function startingSkills(archetypeId: string, origin: string): string[] {
  const out: string[] = [];
  const a = DATA.archetype_skills.map[archetypeId];
  if (a) out.push(a);
  for (const id of DATA.player[origin] ?? []) if (!out.includes(id)) out.push(id);
  return out;
}

/**
 * ほかの議員の特殊能力。名前や能力の乱数の並びを変えないよう、議員の番号と能力から作った別の乱数を使う。
 */
export function rollNpcSkills(opts: { id: number; archetypeId: string; lineageId: string; terms: number; abilitySum: number }): string[] {
  const rand = mulberry32((opts.id * 2_654_435_761) ^ (opts.abilitySum * 40_503) ^ 0x5bd1e995);
  const N = DATA.npc;
  const out: string[] = [];
  const add = (id: string | undefined) => {
    if (id && !out.includes(id)) out.push(id);
  };
  const pickFrom = (pool: string[]) => pool[Math.floor(rand() * pool.length)];
  if (rand() < DATA.archetype_skills.rate) add(DATA.archetype_skills.map[opts.archetypeId]);
  for (const l of DATA.lineage_skills[opts.lineageId] ?? []) if (rand() < l.rate) add(l.id);
  if (opts.terms >= N.gold_min_terms && rand() < N.gold_rate) add(pickFrom(N.gold_pool));
  if (rand() < N.green_rate) add(pickFrom(N.green_pool));
  if (rand() < N.red_rate) add(pickFrom(N.red_pool));
  return out;
}
