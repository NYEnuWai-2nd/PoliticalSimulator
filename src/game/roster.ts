// 議員名簿の生成（設計は docs/design.md の3節）
import { createNameGenerator, mulberry32 } from "../lib/nameGenerator.js";
import type { Gender, GeneratedName } from "../lib/nameGenerator.js";
import type { NameData } from "../data/nameData.js";
import { ABILITIES, TABLES, centerOf } from "./tables.js";
import type { Abilities, Archetype, Lineage, TermTier } from "./tables.js";
import { IDEOLOGY_AXES, PARTIES, partyById } from "./parties.js";
import type { Ideology, Party } from "./parties.js";
import { SMD_SEATS, initialSeatPlan, prefWeight } from "./districts.js";
import type { PrefCode } from "./districts.js";
import scenario from "../../data/game/scenario.json";

/** ゲーム開始時の年 */
export const START_YEAR = 2026;

/** 議員の女性の割合（試作用の仮の値） */
const FEMALE_RATE = 0.2;

/** 名簿に入る最高年齢 */
const MAX_AGE = 88;

export interface Member {
  id: number;
  /** 所属政党のid（parties.json） */
  party: string;
  name: GeneratedName;
  gender: Gender;
  birthYear: number;
  archetype: string;
  lineage: string;
  terms: number;
  tier: string;
  abilities: Abilities;
  /** 当選した区分 */
  seat: "小選挙区" | "比例";
  /** 小選挙区の議員はその県。比例の議員は null */
  district: PrefCode | null;
  /** 地元の県。小選挙区の議員は選挙区と同じ。比例の議員は次に小選挙区から出るときの候補地 */
  home: PrefCode;
  /** 地元（home）での地盤（1〜4） */
  jiban: number;
  specialties: string[];
  traits: string[];
  /** 思想5軸（−3〜+3、0.5刻み） */
  ideology: Ideology;
  /** 信念の固さ（1〜5）。高いほど党の方針に逆らってでも自分の思想で投票する */
  conviction: number;
  /** 党への忠誠（1〜5）。高いほど党の方針に従い、政界再編で党を離れにくい */
  loyalty: number;
  /** 手作りの固定キャラクターの役割（首相など）。生成した議員にはない */
  fixedRole?: string;
}

/** data/game/scenario.json の fixed_members の1件 */
interface FixedMember {
  role: string;
  party: string;
  district: PrefCode;
  name: Omit<GeneratedName, "gender" | "birthYear">;
  gender: Gender;
  birthYear: number;
  archetype: string;
  lineage: string;
  terms: number;
  tier: string;
  abilities: Abilities;
  jiban: number;
  specialties: string[];
  traits: string[];
  ideology: Ideology;
  conviction: number;
  loyalty: number;
}

export const FIXED_MEMBERS = (scenario as unknown as { fixed_members: FixedMember[] }).fixed_members;

function fixedToMember(f: FixedMember, id: number): Member {
  return {
    id,
    party: f.party,
    name: { ...f.name, gender: f.gender, birthYear: f.birthYear } as GeneratedName,
    gender: f.gender,
    birthYear: f.birthYear,
    archetype: f.archetype,
    lineage: f.lineage,
    terms: f.terms,
    tier: f.tier,
    abilities: { ...f.abilities },
    seat: "小選挙区",
    district: f.district,
    home: f.district,
    jiban: f.jiban,
    specialties: [...f.specialties],
    traits: [...f.traits],
    ideology: { ...f.ideology },
    conviction: f.conviction,
    loyalty: f.loyalty,
    fixedRole: f.role,
  };
}

export function ageOf(member: Member, year: number = START_YEAR): number {
  return year - member.birthYear;
}

type Rand = () => number;

function pick<T>(items: readonly T[], weightOf: (x: T) => number, rand: Rand): T {
  let total = 0;
  for (const it of items) total += weightOf(it);
  let r = rand() * total;
  for (const it of items) {
    r -= weightOf(it);
    if (r <= 0) return it;
  }
  return items[items.length - 1];
}

function intBetween([lo, hi]: readonly [number, number], rand: Rand): number {
  return lo + Math.floor(rand() * (hi - lo + 1));
}

/** −1〜1の三角分布（中央に寄る個人差） */
function centered(rand: Rand): number {
  return rand() + rand() - 1;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

function rollAbilities(arch: Archetype, tier: TermTier, lineage: Lineage, rand: Rand): Abilities {
  const spread = TABLES.individual_variation * (arch.variation_multiplier ?? 1);
  const out = {} as Abilities;
  for (const a of ABILITIES) {
    const v = centerOf(arch.base_ranks[a]) + tier.bonus[a] + (lineage.bonus[a] ?? 0) + centered(rand) * spread;
    out[a] = clamp(Math.round(v), 1, 100);
  }
  return out;
}

/**
 * 地盤。小選挙区で勝っている議員は2以上、比例単独の議員は2以下にする
 * （比例単独は地元の地盤が弱いから比例に回っている、という扱い）。
 */
function rollJiban(tier: TermTier, lineage: Lineage, seat: Member["seat"], rand: Rand): number {
  const v = Math.round(tier.jiban_base + (lineage.jiban_bonus ?? 0) + centered(rand) * TABLES.jiban_variation);
  return seat === "小選挙区" ? clamp(v, Math.max(2, lineage.jiban_min ?? 1), 4) : clamp(v, 1, 2);
}

function rollSpecialties(arch: Archetype, rand: Rand): string[] {
  const entries = Object.entries(arch.specialty_weights);
  const first = pick(entries, ([, w]) => w, rand)[0];
  if (rand() >= TABLES.second_specialty_rate) return [first];
  const rest = entries.filter(([k]) => k !== first);
  return rest.length ? [first, pick(rest, ([, w]) => w, rand)[0]] : [first];
}

function rollTraits(rand: Rand): string[] {
  // 対になった特性の組を重複なく選び、組の中からどちらか一方を取る
  const pairs = [...TABLES.personality_pairs];
  const out: string[] = [];
  for (let i = 0; i < TABLES.personality_traits_per_member && pairs.length; i++) {
    const [pair] = pairs.splice(Math.floor(rand() * pairs.length), 1);
    out.push(pair[rand() < 0.5 ? 0 : 1]);
  }
  return out;
}

/** 信念の固さ。性格の「誠実」で上がり、「狡猾」で下がる */
function rollConviction(traits: string[], rand: Rand): number {
  const v = 3 + centered(rand) * 2 + (traits.includes("誠実") ? 1 : 0) - (traits.includes("狡猾") ? 1 : 0);
  return clamp(Math.round(v), 1, 5);
}

/** 党への忠誠。「野心家」で下がり、世襲・名門（党の地盤を継いでいる）で上がる */
function rollLoyalty(traits: string[], lineage: Lineage, rand: Rand): number {
  const inherited = lineage.id === "hereditary" || lineage.id === "dynasty";
  const v = 3 + centered(rand) * 2 - (traits.includes("野心家") ? 1 : 0) + (inherited ? 1 : 0);
  return clamp(Math.round(v), 1, 5);
}

function rollIdeology(party: Party, rand: Rand): Ideology {
  const out = {} as Ideology;
  for (const axis of IDEOLOGY_AXES) {
    const v = party.ideology_center[axis.id] + centered(rand) * party.ideology_spread * 1.5;
    out[axis.id] = clamp(Math.round(v * 2) / 2, -3, 3);
  }
  return out;
}

type SeatAssignment = { seat: "小選挙区"; district: PrefCode } | { seat: "比例"; home: PrefCode };

interface Generator {
  rand: Rand;
  names: Awaited<ReturnType<typeof createNameGenerator>>;
  nextId: number;
}

async function generateMember(g: Generator, party: Party, assignment: SeatAssignment): Promise<Member> {
  const { rand } = g;
  const lineageWeights = TABLES.lineage_profiles[party.lineage_profile];
  const archWeight = (a: Archetype) => (party.archetype_weights ? (party.archetype_weights[a.id] ?? 0) : a.weight_shugiin);
  const arch = pick(TABLES.archetypes, archWeight, rand);
  const tier = pick(TABLES.term_tiers, (x) => x.weight_shugiin, rand);
  const lineage = pick(TABLES.lineages, (x) => lineageWeights[x.id], rand);
  const terms = intBetween(tier.terms, rand);
  const firstAge = intBetween(lineage.first_elected_age ?? arch.first_elected_age, rand);
  const age = clamp(Math.round(firstAge + (terms - 1) * TABLES.years_per_term + centered(rand) * 2), TABLES.min_age, MAX_AGE);
  const birthYear = START_YEAR - age;
  const gender: Gender = rand() < FEMALE_RATE ? "女" : "男";
  const name = await g.names.generate({ gender, birthYear });
  const home = assignment.seat === "小選挙区" ? assignment.district : assignment.home;
  const abilities = rollAbilities(arch, tier, lineage, rand);
  const jiban = rollJiban(tier, lineage, assignment.seat, rand);
  const specialties = rollSpecialties(arch, rand);
  const traits = rollTraits(rand);
  return {
    id: ++g.nextId,
    party: party.id,
    name,
    gender,
    birthYear,
    archetype: arch.name,
    lineage: lineage.name,
    terms,
    tier: tier.name,
    abilities,
    seat: assignment.seat,
    district: assignment.seat === "小選挙区" ? assignment.district : null,
    home,
    jiban,
    specialties,
    traits,
    ideology: rollIdeology(party, rand),
    conviction: rollConviction(traits, rand),
    loyalty: rollLoyalty(traits, lineage, rand),
  };
}

const PREF_CODES: PrefCode[] = Array.from({ length: SMD_SEATS }, (_, i) => i + 1);

/**
 * 開始時点の衆議院（定数76）の名簿を作る。小選挙区47の当選者と比例29の当選者を、
 * initialSeatPlan() の割り当てに従って生成する。比例の議員の地元は、県の大きさ（2024年の小選挙区の数）の比で選ぶ。
 */
export async function generateRoster(data: NameData, seed: number): Promise<Member[]> {
  // 名前用と属性用で乱数の系列を分け、片方の仕様を変えてももう片方の並びが変わらないようにする
  const g: Generator = { rand: mulberry32(seed ^ 0x9e3779b9), names: await createNameGenerator({ ...data, seed }), nextId: 0 };
  const plan = initialSeatPlan();
  // 固定キャラクターの名前を先に登録し、生成する議員と同姓同名にならないようにする
  for (const f of FIXED_MEMBERS) g.names.reserve(f.name.surname + f.name.givenName, f.name.surnameKana + f.name.givenNameKana);
  const members: Member[] = [];
  for (const pref of PREF_CODES) {
    const fixed = FIXED_MEMBERS.find((f) => f.district === pref);
    if (fixed) {
      if (plan.smd.get(pref) !== fixed.party) throw new Error(`${fixed.role}の選挙区（${pref}）が${fixed.party}の議席になっていません`);
      members.push(fixedToMember(fixed, ++g.nextId));
      continue;
    }
    members.push(await generateMember(g, partyById(plan.smd.get(pref)!), { seat: "小選挙区", district: pref }));
  }
  for (const party of PARTIES) {
    for (let i = 0; i < (plan.pr.get(party.id) ?? 0); i++) {
      const home = pick(PREF_CODES, prefWeight, g.rand);
      members.push(await generateMember(g, party, { seat: "比例", home }));
    }
  }
  return members;
}
