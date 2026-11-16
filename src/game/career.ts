// 議員人生モード（設計は docs/design.md の5節）
// プレイヤーは新人候補として始め、毎月1つ活動を選んで経験点をため、能力を上げ、総選挙での当選を目指す。
// 落選しても浪人として続け、何年もかけて地盤を固められる。当選すれば議員として続き、役職に就くこともある。
// 政権は AI が動かす（ai.ts）。状態 CareerState は JSON で保存できる形にし、名簿などは CareerWorld に分ける。
// 画面に依存しないので、ブラウザでも CLI（src/cli/）でも同じように動く。
import careerRaw from "../../data/game/career.json";
import lifeRaw from "../../data/game/life_events.json";
import { mulberry32 } from "../lib/nameGenerator.js";
import type { Member, MemberFactory } from "./roster.js";
import { START_YEAR } from "./roster.js";
import type { Appointment } from "./cabinet.js";
import { formInitialGovernment } from "./cabinet.js";
import { ABILITIES, TABLES, centerOf } from "./tables.js";
import type { Ability } from "./tables.js";
import { partyById } from "./parties.js";
import { SMD_SEATS } from "./districts.js";
import type { PrefCode } from "./districts.js";
import { PREFECTURES } from "../map/japanMap.js";
import { createGame, endTurn } from "./game.js";
import type { GameState } from "./game.js";
import { aiGovernmentActions, aiWantsDissolution } from "./ai.js";
import { estimateDistrict, partiesRunning, runElection } from "./election.js";

const C = careerRaw;

export type OriginId = "newcomer" | "hereditary" | "dynasty";
export type RouteId = "smd" | "successor" | "pr";
export type ExpId = "election" | "policy" | "network" | "media" | "money";
export type RelationId = "secretary" | "party" | "supporters" | "press" | "kengi";
export type Exp = Record<ExpId, number>;

export interface Origin {
  id: OriginId;
  name: string;
  difficulty: string;
  description: string;
  lineage: "none" | "hereditary" | "dynasty";
  jiban: number;
  money: number;
  bonus: Partial<Record<Ability, number>>;
  relations: Record<RelationId, number>;
}

export interface Activity {
  id: string;
  name: string;
  icon: string;
  description: string;
  stamina: number;
  exp: Partial<Exp>;
  jiban_progress?: number;
  money_per_ability?: number;
  mood_up_chance?: number;
  max_stamina?: number;
  relations: Partial<Record<RelationId, number>>;
}

interface Effects {
  stamina?: number;
  max_stamina?: number;
  mood?: number;
  money?: number;
  exp?: Partial<Exp>;
  relations?: Partial<Record<RelationId, number>>;
  jiban_progress?: number;
  abilities?: Partial<Record<Ability, number>>;
}

interface LifeEvent {
  id: string;
  weight: number;
  title: string;
  text: string;
  status?: string[];
  choices: { label: string; result: string; effects: Effects }[];
}

export const ORIGINS = C.origins as Origin[];
export const ACTIVITIES = C.activities as Activity[];
export const EXP_TYPES = C.exp_types as { id: ExpId; name: string; icon: string }[];
export const RELATIONS = C.relations as { id: RelationId; name: string }[];
const LIFE_EVENTS = lifeRaw.events as LifeEvent[];

export const ROUTE_NAMES: Record<RouteId, string> = { smd: "小選挙区", successor: "引退する現職の後継", pr: "比例名簿" };

export interface CareerSetup {
  origin: OriginId;
  party: string;
  /** 地元の県（比例名簿の道でも地元は持つ） */
  pref: PrefCode;
  route: RouteId;
  /** 経歴類型の id（character_tables.json） */
  archetype: string;
}

export interface CareerLog {
  turn: number;
  date: string;
  text: string;
}

/** 総選挙の結果のうち、画面と記録に残すもの */
export interface ElectionSummary {
  year: number;
  month: number;
  won: boolean;
  route: RouteId;
  /** 小選挙区の得票（得票率の高い順）。比例名簿の道なら空 */
  district: { name: string; party: string; share: number; isPlayer: boolean }[];
  /** 比例名簿の道のとき：名簿の順位（1から）と党の比例の当選者数 */
  pr?: { rank: number; seats: number };
  /** 政党ごとの議席 */
  seats: { party: string; total: number }[];
  support: Record<string, number>;
}

export interface PendingEvent {
  id: string;
  title: string;
  text: string;
  choices: string[];
}

export interface CareerState {
  seed: number;
  setup: CareerSetup;
  playerId: number;
  /** 地盤を譲って次の総選挙で引退する現職（世襲・名門の親、後継の道の前任者） */
  parentId?: number;
  secretaryName: string;
  startYear: number;
  turn: number;
  year: number;
  month: number;
  stamina: number;
  maxStamina: number;
  /** やる気（1〜5） */
  mood: number;
  /** 手元の資金（万円） */
  money: number;
  exp: Exp;
  /** 地盤が次の段階に上がるまでの進み具合 */
  jibanProgress: number;
  /** 地盤を固める活動をしなかった月が続いた数（一定以上で地盤が1段下がる） */
  jibanNeglect: number;
  /** この月に地盤を固める活動をしたか */
  jibanTouched: boolean;
  relations: Record<RelationId, number>;
  status: "候補" | "議員" | "浪人";
  /** 今就いている役職（なければ空） */
  post: string;
  /** 政権の状態（AI が動かす） */
  gov: GameState;
  /** 次の月に進む前に選ぶ必要のある出来事 */
  pendingEvent?: PendingEvent;
  log: CareerLog[];
  elections: ElectionSummary[];
  rngCounter: number;
  over?: string;
}

/** 状態と一緒に持つ、名簿などの大きなデータ */
export interface CareerWorld {
  roster: Member[];
  ronin: Member[];
  government: Appointment[];
  factory: MemberFactory;
  /** プレイヤー（議員でないときは名簿の外にいる） */
  player: Member;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const dateOf = (s: Pick<CareerState, "year" | "month">) => `${s.year}年${s.month}月`;
export const prefName = (p: PrefCode) => PREFECTURES[p - 1]?.name ?? String(p);

function rand(s: CareerState): number {
  return mulberry32((s.seed * 2_654_435_761 + s.turn * 40_503 + s.rngCounter++ * 69_069 + 7) >>> 0)();
}

function log(s: CareerState, text: string): void {
  s.log.push({ turn: s.turn, date: dateOf(s), text });
}

export const originById = (id: OriginId) => ORIGINS.find((o) => o.id === id)!;
const smdHolder = (roster: Member[], pref: PrefCode) => roster.find((m) => m.seat === "小選挙区" && m.district === pref);
const ALL_PREFS: PrefCode[] = Array.from({ length: SMD_SEATS }, (_, i) => i + 1);

export interface StartOption {
  route: RouteId;
  pref: PrefCode;
  /** 選択肢の説明（相手の現職、継ぐ地盤など） */
  note: string;
}

/**
 * 出自と政党から、出馬の道と県の組み合わせの一覧を返す。
 * 新人：他党の現職に挑む小選挙区、引退が近い自党の現職の後継、比例名簿（地元はどの県でもよい）。
 * 世襲・名門：自党の現職（首相を除く）の地盤を継ぐ小選挙区。そういう県がない党なら、どの県でも親の地盤があるものとする。
 */
export function startOptions(roster: Member[], party: string, origin: OriginId): StartOption[] {
  const out: StartOption[] = [];
  const ageOf = (m: Member) => START_YEAR - m.birthYear;
  if (origin === "newcomer") {
    for (const p of ALL_PREFS) {
      const h = smdHolder(roster, p);
      if (h?.party !== party) out.push({ route: "smd", pref: p, note: h ? `現職：${h.name.displayName}（${partyById(h.party).short}・${h.terms}回）` : "現職なし" });
      else if (!h.fixedRole && ageOf(h) >= C.routes.successor_min_age)
        out.push({ route: "successor", pref: p, note: `${h.name.displayName}（${ageOf(h)}歳）の後継` });
    }
    for (const p of ALL_PREFS) out.push({ route: "pr", pref: p, note: "比例名簿（順位は党の幹部との関係で決まる）" });
    return out;
  }
  for (const p of ALL_PREFS) {
    const h = smdHolder(roster, p);
    if (h?.party === party && !h.fixedRole) out.push({ route: "smd", pref: p, note: `親：${h.name.displayName}の地盤を継ぐ` });
  }
  if (!out.length) for (const p of ALL_PREFS) out.push({ route: "smd", pref: p, note: "親の地盤を継ぐ" });
  return out;
}

/** 小選挙区の道で選べる県（互換用。新人は他党の現職の県、世襲・名門は親の県） */
export function availablePrefs(roster: Member[], party: string, origin: OriginId): PrefCode[] {
  return startOptions(roster, party, origin).filter((o) => o.route === "smd").map((o) => o.pref);
}

/** 経歴類型と出自から、新人候補の能力の初期値を決める（個人差は小さく足す） */
function startingAbilities(archetypeId: string, origin: Origin, r: () => number): Record<Ability, number> {
  const arch = TABLES.archetypes.find((a) => a.id === archetypeId);
  if (!arch) throw new Error(`未知の経歴類型です：${archetypeId}`);
  const out = {} as Record<Ability, number>;
  for (const a of ABILITIES) out[a] = clamp(Math.round(centerOf(arch.base_ranks[a]) + (origin.bonus[a] ?? 0) + (r() - 0.5) * 6), 1, 100);
  return out;
}

/** 議員人生モードを始める。world.player を作り、政権の状態も用意する */
export async function startCareer(
  base: { roster: Member[]; government: Appointment[]; factory: MemberFactory },
  setup: CareerSetup,
  seed: number,
): Promise<{ state: CareerState; world: CareerWorld }> {
  const origin = originById(setup.origin);
  if (!startOptions(base.roster, setup.party, setup.origin).some((o) => o.route === setup.route && o.pref === setup.pref))
    throw new Error("この出自と政党では、その道と県からは出馬できません");
  const party = partyById(setup.party);
  const generated = await base.factory.create(party, { seat: "なし", home: setup.pref });
  const holder = smdHolder(base.roster, setup.pref);
  const inherits = setup.origin !== "newcomer" && holder?.party === setup.party && !holder.fixedRole;
  const parent = inherits || setup.route === "successor" ? holder : undefined;
  const arch = TABLES.archetypes.find((a) => a.id === setup.archetype)!;
  const lineage = TABLES.lineages.find((l) => l.id === origin.lineage)!;
  const age = setup.origin === "newcomer" ? 38 : 33;
  const relations = { ...origin.relations };
  if (setup.route === "successor") Object.assign(relations, C.routes.successor_relations);
  const player: Member = {
    ...generated,
    // 親の地盤を継ぐときは姓も継ぐ
    name: inherits && holder
      ? {
          ...generated.name,
          surname: holder.name.surname,
          surnameKana: holder.name.surnameKana,
          displayName: generated.name.displayName.replace(generated.name.surname, holder.name.surname),
        }
      : generated.name,
    birthYear: START_YEAR - age,
    archetype: arch.name,
    lineage: lineage.name,
    terms: 0,
    tier: "候補",
    abilities: startingAbilities(setup.archetype, origin, base.factory.rand),
    seat: "なし",
    district: null,
    home: setup.pref,
    jiban: origin.jiban,
  };
  const state: CareerState = {
    seed,
    setup,
    playerId: player.id,
    parentId: parent?.id,
    secretaryName: C.secretary_names[seed % C.secretary_names.length],
    startYear: START_YEAR,
    turn: 1,
    year: START_YEAR,
    month: 1,
    stamina: C.max_stamina.start,
    maxStamina: C.max_stamina.start,
    mood: 3,
    money: origin.money,
    exp: { election: 0, policy: 0, network: 0, media: 0, money: 0 },
    jibanProgress: 0,
    jibanNeglect: 0,
    jibanTouched: false,
    relations,
    status: "候補",
    post: "",
    gov: createGame(seed, { roster: base.roster, government: base.government }),
    log: [],
    elections: [],
    rngCounter: 0,
  };
  state.gov.scenes = [];
  const where = prefName(setup.pref);
  log(
    state,
    setup.route === "pr"
      ? `${party.name}の比例名簿に載る候補に選ばれた。地元の${where}を拠点に、党への貢献で名簿の上位を目指す。`
      : setup.route === "successor"
        ? `${party.name}の公募で、引退を表明した${parent!.name.displayName}の後継に選ばれた。${where}の地盤は一から作り直しだ。`
        : inherits
          ? `${party.name}の公認を得た。引退を決めた${holder!.name.displayName}の地盤を継ぎ、${where}で次の総選挙に挑む。`
          : `${party.name}の公募で候補に選ばれた。次の総選挙で、${where}の議席を狙う。`,
  );
  return { state, world: { ...base, ronin: [], player } };
}

// ---- 経験点と能力 ----

/** 能力を1上げるのに使う経験点。今の能力値が高いほど多くかかる */
export function upgradeCost(member: Member, ability: Ability): Partial<Exp> {
  const v = member.abilities[ability];
  const mult = Math.max(0.6, 1 + (v - 40) / 40);
  const base = (C.upgrade.cost as Record<Ability, Partial<Exp>>)[ability];
  const out: Partial<Exp> = {};
  for (const [k, n] of Object.entries(base)) out[k as ExpId] = Math.ceil((n as number) * mult);
  return out;
}

export function canUpgrade(state: CareerState, member: Member, ability: Ability): boolean {
  if (member.abilities[ability] >= 100) return false;
  return Object.entries(upgradeCost(member, ability)).every(([k, n]) => state.exp[k as ExpId] >= (n as number));
}

function setPlayer(world: CareerWorld, next: Member): void {
  world.player = next;
  // 議員なら名簿の中の本人も同じ値にする
  const i = world.roster.findIndex((m) => m.id === next.id);
  if (i >= 0) world.roster[i] = next;
}

/** 経験点を使って能力を1上げる。上げられなければ false */
export function upgradeAbility(state: CareerState, world: CareerWorld, ability: Ability): boolean {
  if (!canUpgrade(state, world.player, ability)) return false;
  for (const [k, n] of Object.entries(upgradeCost(world.player, ability))) state.exp[k as ExpId] -= n as number;
  setPlayer(world, { ...world.player, abilities: { ...world.player.abilities, [ability]: world.player.abilities[ability] + 1 } });
  return true;
}

// ---- 選挙区の情勢 ----

/** 比例名簿の順位（0から）。党の幹部との関係が高いほど上位になる */
export function prRank(state: CareerState): number {
  return Math.max(0, Math.floor((80 - state.relations.party) / C.routes.pr_rank_step));
}

/** 総選挙が今あったときの、プレイヤーの選挙区の見込み（揺らぎを除いた得票率の高い順）。比例名簿の道なら空 */
export function raceForecast(state: CareerState, world: CareerWorld): { name: string; party: string; share: number; isPlayer: boolean }[] {
  if (state.setup.route === "pr") return [];
  const pref = state.setup.pref;
  const holder = smdHolder(world.roster, pref);
  const isMe = holder?.id === world.player.id;
  const rival = holder && !isMe && holder.id !== state.parentId ? holder : undefined;
  const parties = partiesRunning(pref, rival?.party ?? (isMe ? state.setup.party : undefined));
  if (!parties.includes(state.setup.party)) parties.push(state.setup.party);
  const entries = parties.map((p) => {
    if (p === state.setup.party) return { party: p, member: world.player, incumbent: isMe, bonus: playerBonus(state) };
    if (rival && rival.party === p) return { party: p, member: rival, incumbent: true };
    return { party: p, incumbent: false };
  });
  return estimateDistrict(pref, state.gov.approval, entries)
    .map((e) => ({
      name: e.member ? e.member.name.displayName : `${partyById(e.party).short}の候補`,
      party: e.party,
      share: e.share,
      isPlayer: e.member?.id === world.player.id,
    }))
    .sort((a, b) => b.share - a.share);
}

/** 選挙での本人の票への上乗せ（選挙資金、後援会、県議団）から、世襲批判などを差し引いたもの */
function playerBonus(state: CareerState): number {
  const B = C.election_bonus;
  const funds = clamp(state.money, 0, 2000) / 2000;
  return (
    funds * B.funds +
    ((state.relations.supporters - 50) / 50) * B.supporters +
    ((state.relations.kengi - 50) / 50) * C.kengi.election_weight -
    (B.origin_penalty as Record<OriginId, number>)[state.setup.origin] -
    (state.setup.route === "successor" ? C.routes.successor_penalty : 0)
  );
}

// ---- 1か月の流れ ----

export interface TurnResult {
  ok: boolean;
  message: string;
}

function applyEffects(state: CareerState, world: CareerWorld, e: Effects): string[] {
  const out: string[] = [];
  const mult = C.mood_multiplier[state.mood - 1];
  if (e.max_stamina) {
    state.maxStamina = clamp(state.maxStamina + e.max_stamina, 0, C.max_stamina.limit);
    out.push(`体力の上限${state.maxStamina}`);
  }
  if (e.stamina) state.stamina = clamp(state.stamina + e.stamina, 0, state.maxStamina);
  for (const [k, n] of Object.entries(e.exp ?? {})) {
    const v = (n as number) > 0 ? Math.round((n as number) * mult) : (n as number);
    state.exp[k as ExpId] = Math.max(0, state.exp[k as ExpId] + v);
    out.push(`${EXP_TYPES.find((x) => x.id === k)!.name}${v >= 0 ? "+" : ""}${v}`);
  }
  for (const [k, n] of Object.entries(e.relations ?? {}))
    state.relations[k as RelationId] = clamp(state.relations[k as RelationId] + (n as number), 0, 100);
  if (e.money) {
    state.money = Math.max(0, state.money + e.money);
    out.push(`資金${e.money >= 0 ? "+" : ""}${e.money}万円`);
  }
  if (e.mood) state.mood = clamp(state.mood + e.mood, 1, 5);
  for (const [k, n] of Object.entries(e.abilities ?? {})) {
    setPlayer(world, { ...world.player, abilities: { ...world.player.abilities, [k]: clamp(world.player.abilities[k as Ability] + (n as number), 1, 100) } });
    out.push(`${k}+${n}`);
  }
  if (e.jiban_progress) addJibanProgress(state, world, Math.round(e.jiban_progress * mult), out);
  return out;
}

function addJibanProgress(state: CareerState, world: CareerWorld, amount: number, out: string[]): void {
  state.jibanProgress += amount;
  if (amount > 0) state.jibanTouched = true;
  const need = C.jiban_step[world.player.jiban];
  if (world.player.jiban < 4 && need && state.jibanProgress >= need) {
    state.jibanProgress -= need;
    setPlayer(world, { ...world.player, jiban: world.player.jiban + 1 });
    out.push(`地盤が${world.player.jiban}に上がった`);
  }
}

/**
 * 活動を1つ行い、月を進める。政権は AI が動き、任期満了か解散なら総選挙になる。
 * 出来事が起きて選択待ち（pendingEvent）のあいだは進めない。総選挙は名前の生成を伴うので非同期。
 */
export async function takeTurn(state: CareerState, world: CareerWorld, activityId: string): Promise<TurnResult> {
  if (state.over) return { ok: false, message: "ゲームは終わっています。" };
  if (state.pendingEvent) return { ok: false, message: `先に出来事「${state.pendingEvent.title}」の選択肢を選んでください。` };
  const act = ACTIVITIES.find((a) => a.id === activityId);
  if (!act) return { ok: false, message: "その活動はありません。" };
  let message: string;
  // 体力が少ないまま無理をすると倒れることがある
  if (act.stamina < 0 && state.stamina < C.low_stamina.threshold && rand(state) < C.low_stamina.breakdown_chance) {
    state.stamina = clamp(state.stamina + 10, 0, state.maxStamina);
    state.mood = clamp(state.mood - 1, 1, 5);
    message = `${act.name}の途中で体調を崩し、寝込んでしまった。`;
  } else {
    const gained = applyEffects(state, world, {
      stamina: act.stamina,
      max_stamina: act.max_stamina,
      exp: act.exp,
      relations: act.relations,
      jiban_progress: act.jiban_progress,
    });
    if (act.money_per_ability) {
      const m = Math.round(world.player.abilities.資金 * act.money_per_ability * C.mood_multiplier[state.mood - 1]);
      state.money += m;
      gained.push(`資金+${m}万円`);
    }
    if (act.mood_up_chance && rand(state) < act.mood_up_chance) {
      state.mood = clamp(state.mood + 1, 1, 5);
      gained.push("やる気が上がった");
    }
    message = `${act.name}：${gained.join("、") || "体力が戻った"}`;
  }
  log(state, message);
  await endMonth(state, world);
  return { ok: true, message };
}

/** 出来事の選択肢を選ぶ（index は0から） */
export function chooseEvent(state: CareerState, world: CareerWorld, index: number): TurnResult {
  const pe = state.pendingEvent;
  if (!pe) return { ok: false, message: "選ぶ出来事はありません。" };
  const ev = LIFE_EVENTS.find((e) => e.id === pe.id)!;
  const choice = ev.choices[index];
  if (!choice) return { ok: false, message: `選択肢は1〜${ev.choices.length}です。` };
  const changes = applyEffects(state, world, choice.effects);
  const text = `${pe.title}：${choice.label} → ${choice.result.replaceAll("{secretary}", state.secretaryName)}${changes.length ? `（${changes.join("、")}）` : ""}`;
  log(state, text);
  state.pendingEvent = undefined;
  return { ok: true, message: text };
}

function maybeLifeEvent(state: CareerState): void {
  if (rand(state) >= lifeRaw.chance) return;
  const pool = LIFE_EVENTS.filter((e) => !e.status || e.status.includes(state.status));
  const total = pool.reduce((a, e) => a + e.weight, 0);
  let r = rand(state) * total;
  const ev = pool.find((e) => (r -= e.weight) <= 0) ?? pool[0];
  state.pendingEvent = {
    id: ev.id,
    title: ev.title,
    text: ev.text.replaceAll("{secretary}", state.secretaryName),
    choices: ev.choices.map((c) => c.label),
  };
}

async function endMonth(state: CareerState, world: CareerWorld): Promise<void> {
  // 事務所の経費。資金が尽きるとやる気が下がる
  state.money -= C.monthly_expense;
  if (state.money < 0) {
    state.money = 0;
    state.mood = clamp(state.mood - 1, 1, 5);
    log(state, "資金が尽き、事務所の家賃の支払いに困った。");
  }
  for (const r of RELATIONS) state.relations[r.id] = clamp(state.relations[r.id] - C.relation_decay, 0, 100);
  // 県議団との関係が深いと、県議が地元を固めてくれる
  if (state.relations.kengi >= C.kengi.threshold) addJibanProgress(state, world, C.kengi.passive_jiban, []);
  // 地盤は放っておくと緩む。進み具合は毎月少しずつ減り（0より下にはならない）、
  // 地盤を固める活動をしない月が続くと地盤が1段下がる
  state.jibanProgress = Math.max(0, state.jibanProgress - C.jiban_decay);
  state.jibanNeglect = state.jibanTouched ? 0 : state.jibanNeglect + 1;
  state.jibanTouched = false;
  if (state.jibanNeglect >= C.jiban_neglect_months && world.player.jiban > 1) {
    setPlayer(world, { ...world.player, jiban: world.player.jiban - 1 });
    state.jibanNeglect = 0;
    log(state, `地元に顔を出さない日が続き、地盤が${world.player.jiban}に下がった。`);
  }
  // 政権は AI が動かす
  const ctx = { roster: world.roster, government: world.government };
  aiGovernmentActions(state.gov, ctx);
  endTurn(state.gov, ctx);
  state.gov.scenes = [];
  const termEnded = state.gov.over?.startsWith("任期満了") ?? false;
  if (state.gov.over && !termEnded) {
    // 内閣総辞職。試作では政権が続いたものとして扱い、記録だけ残す
    log(state, `政局：${state.gov.over}（試作では政権の交代はまだ扱わない）`);
    state.gov.over = undefined;
  }
  const dissolve = !termEnded && aiWantsDissolution(state.gov, rand(state));
  if (termEnded || dissolve) {
    log(state, dissolve ? `首相が衆議院を解散した（内閣支持率${state.gov.approval}%）。` : "衆議院議員の任期が満了した。");
    await holdElection(state, world);
  } else {
    maybeLifeEvent(state);
  }
  // 次の月へ
  state.turn++;
  state.month++;
  if (state.month > 12) {
    state.month = 1;
    state.year++;
  }
  checkRetirement(state, world);
}

function checkRetirement(state: CareerState, world: CareerWorld): void {
  if (state.over) return;
  const age = state.year - world.player.birthYear;
  const years = state.year - state.startYear;
  if (age < C.career_end.retire_age && years < C.career_end.max_years) return;
  const wins = state.elections.filter((e) => e.won).length;
  state.over = `政界を引退した（${age}歳、${years}年）。総選挙${state.elections.length}回で当選${wins}回${state.post ? `、最後の役職は${state.post}` : ""}。`;
  state.pendingEvent = undefined;
  log(state, state.over);
}

async function holdElection(state: CareerState, world: CareerWorld): Promise<void> {
  const route = state.setup.route;
  const isPr = route === "pr";
  const rank = isPr ? prRank(state) : 0;
  const result = await runElection({
    year: state.year,
    month: state.month,
    roster: world.roster,
    ronin: world.ronin.filter((m) => m.id !== world.player.id),
    approval: state.gov.approval,
    factory: world.factory,
    forced: isPr ? [] : [{ pref: state.setup.pref, party: state.setup.party, member: world.player, bonus: playerBonus(state) }],
    forcedPr: isPr ? [{ party: state.setup.party, member: world.player, rank }] : [],
    retireIds: state.parentId !== undefined ? [state.parentId] : [],
  });
  const d = result.smd.find((x) => x.pref === state.setup.pref);
  const me = result.roster.find((m) => m.id === world.player.id);
  const prSeats = result.pr[state.setup.party]?.length ?? 0;
  const summary = {
    year: state.year,
    month: state.month,
    won: !!me,
    route,
    district: isPr || !d ? [] : d.candidates.map((c) => ({ name: c.member.name.displayName, party: c.member.party, share: c.share, isPlayer: c.member.id === world.player.id })),
    pr: isPr ? { rank: rank + 1, seats: prSeats } : undefined,
    seats: Object.entries(result.roster.reduce<Record<string, number>>((acc, m) => ((acc[m.party] = (acc[m.party] ?? 0) + 1), acc), {})).map(
      ([party, total]) => ({ party, total }),
    ),
    support: result.support,
  } satisfies ElectionSummary;
  state.elections.push(summary);
  world.roster = result.roster;
  world.ronin = result.ronin.filter((m) => m.id !== world.player.id);
  const first = state.elections.length === 1;
  if (me) {
    world.player = me;
    state.status = "議員";
    const how = isPr ? `比例名簿${rank + 1}位（党の比例当選${prSeats}人）` : `得票率${pct(d!.candidates.find((c) => c.member.id === me.id)!.share)}`;
    log(state, `${me.terms === 1 ? "初当選" : `${me.terms}回目の当選`}！ ${how}で${partyById(state.setup.party).name}の衆議院議員になった。`);
    // 後継の道で当選したら、次からは自分の選挙区の現職として戦う
    if (route === "successor") state.setup = { ...state.setup, route: "smd" };
  } else {
    world.player = { ...world.player, seat: "なし", district: null };
    state.status = "浪人";
    const how = isPr ? `比例名簿${rank + 1}位で、党の比例当選${prSeats}人に届かなかった` : `得票率${pct(d!.candidates.find((c) => c.member.id === world.player.id)!.share)}で${d!.winner.name.displayName}（${partyById(d!.winner.party).short}）に敗れた`;
    log(state, `落選。${how}。浪人として次の選挙を目指す。`);
    if (route === "successor") state.setup = { ...state.setup, route: "smd" };
  }
  if (first) state.parentId = undefined;
  // 政権を組み直す（与党の構成は試作では変えない）。プレイヤーが役職に就くこともある
  world.government = formInitialGovernment(world.roster);
  const post = world.government.find((a) => a.member.id === world.player.id)?.post.name ?? "";
  if (post && post !== state.post) log(state, `${post}に任命された。`);
  state.post = post;
  state.gov = createGame(state.seed + state.elections.length * 7919, { roster: world.roster, government: world.government }, {
    year: state.year,
    month: state.month,
    termEnd: { year: state.year + 4, month: state.month },
    quiet: true,
  });
  state.gov.scenes = [];
}

const pct = (x: number) => `${Math.round(x * 1000) / 10}%`;

// ---- 表示用のまとめ ----

/** 画面や CLI に出す、今の状態の要約 */
export function careerSummary(state: CareerState, world: CareerWorld) {
  const p = world.player;
  return {
    date: dateOf(state),
    name: p.name.displayName,
    age: state.year - p.birthYear,
    party: partyById(state.setup.party).name,
    origin: originById(state.setup.origin).name,
    route: ROUTE_NAMES[state.setup.route],
    pref: prefName(state.setup.pref),
    status: state.status,
    post: state.post,
    terms: p.terms,
    stamina: `${state.stamina}/${state.maxStamina}`,
    mood: state.mood,
    money: state.money,
    jiban: p.jiban,
    jibanProgress: `${state.jibanProgress}/${C.jiban_step[p.jiban] ?? "-"}`,
    abilities: p.abilities,
    exp: state.exp,
    relations: state.relations,
    approval: state.gov.approval,
    nextElection: `${state.gov.termEnd.year}年${state.gov.termEnd.month}月（解散があれば早まる）`,
    prRank: state.setup.route === "pr" ? prRank(state) + 1 : undefined,
    forecast: raceForecast(state, world).map((f) => ({ ...f, share: pct(f.share) })),
    pendingEvent: state.pendingEvent,
    over: state.over,
  };
}
