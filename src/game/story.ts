// 物語の連作と人物との関係（設計は docs/design.md の5.6節、中身は data/game/stories.json）
// 画面には依存しない。career.ts から、月末・総選挙のあと・役職が変わったときに呼ぶ。
// 状態（StoryState と BondState）は CareerState の中に持ち、JSON にそのまま保存できる形にする。
import storiesRaw from "../../data/game/stories.json";
import { partyById } from "./parties.js";
import type { Member } from "./roster.js";
import type { Ability } from "./tables.js";
import { districtName } from "./districts.js";
import { PREFECTURES } from "../map/japanMap.js";

// ---- データの型 ----

export type BondRole = "rival" | "doki" | "senpai" | "secretary";
export type BondTag = "好敵手" | "因縁" | "盟友" | "師弟" | "恩人" | "不和";
export const BOND_ROLE_NAMES: Record<BondRole, string> = { rival: "ライバル", doki: "同期", senpai: "党の先輩", secretary: "秘書" };

export interface StoryCondition {
  trigger?: "monthly" | "after_election" | "first_win" | "post_change";
  status?: string[];
  post?: string[];
  ruling?: boolean;
  terms_min?: number;
  terms_max?: number;
  age_min?: number;
  age_max?: number;
  abilities?: Partial<Record<Ability, number>>;
  relations?: Record<string, number>;
  bonds_min?: Partial<Record<BondRole, number>>;
  bonds_max?: Partial<Record<BondRole, number>>;
  bond_state?: Partial<Record<BondRole, BondTag>>;
  jiban_min?: number;
  skills?: string[];
  no_skills?: string[];
  flags?: string[];
  no_flags?: string[];
  months?: number[];
  won_last?: boolean;
  margin_max?: number;
  rival_in_district?: boolean;
}

/** 物語の効果。日常の出来事の効果（career.ts の Effects）に、人物との関係と次の総選挙の票を足したもの */
export interface StoryEffects {
  stamina?: number;
  mood?: number;
  money?: number;
  exp?: Record<string, number>;
  relations?: Record<string, number>;
  jiban_progress?: number;
  abilities?: Partial<Record<Ability, number>>;
  approval?: number;
  skills_add?: string[];
  skills_remove?: string[];
  bonds?: Partial<Record<BondRole, number>>;
  bond_state?: Partial<Record<BondRole, BondTag>>;
  vote_bonus?: number;
}

export interface StoryLine {
  speaker: "self" | "secretary" | "rival" | "doki" | "senpai" | "narrator" | "other";
  name?: string;
  text: string;
  face?: string;
}

export interface StoryChoice {
  label: string;
  result: string;
  effects: StoryEffects;
  flags?: string[];
  next: string;
  if_flags?: string[];
  risk?: { ability: Ability; threshold: number; fail_result: string; fail_effects: StoryEffects; fail_next?: string };
}

export interface StoryChapter {
  id: string;
  bg: string;
  after_months: [number, number];
  conditions?: StoryCondition;
  fallback?: string;
  lines: StoryLine[];
  choices: StoryChoice[];
}

export interface StoryEnding {
  id: string;
  title: string;
  text: string;
  effects?: StoryEffects;
}

export interface Story {
  id: string;
  title: string;
  summary: string;
  cast: string[];
  start: StoryCondition;
  chapters: StoryChapter[];
  endings: StoryEnding[];
  once?: boolean;
  /** 始まる確率。毎月の物語は条件を満たした月ごと（書かなければ start_chance）、何度でも起きる物語は2回目から（書かなければ必ず） */
  chance?: number;
}

interface RivalType {
  id: string;
  name: string;
  description: string;
  fits: string;
  catchphrase: string;
  lines: Record<string, string>;
}

interface BondEffect {
  monthly_exp?: Record<string, number>;
  vote_bonus?: number;
  risk?: Partial<Record<Ability, number>>;
  leader_vote?: "for" | "against";
}

const DATA = storiesRaw as unknown as {
  start_chance: number;
  max_active: number;
  grace_months: number;
  bond_tags: BondTag[];
  bond_effects: Record<BondTag, BondEffect>;
  rival_types: RivalType[];
  stories: Story[];
};
export const STORIES = DATA.stories;
/** 総選挙の結果などで人物との関係が自動で動く量 */
export const BOND_RULES = (storiesRaw as unknown as { election_bond_rules: Record<string, number> }).election_bond_rules;
export const RIVAL_TYPES = DATA.rival_types;
export const BOND_EFFECTS = DATA.bond_effects;
export const storyById = (id: string) => STORIES.find((s) => s.id === id);

/** 場所の名前（画面の左上に出す） */
export const BG_NAMES: Record<string, string> = {
  office: "地元の事務所",
  campaign: "選挙事務所",
  station: "駅前",
  street: "商店街",
  hall: "公民館",
  diet: "国会",
  party_hq: "党本部",
  ryotei: "料亭",
  home: "自宅",
  hospital: "病院",
  disaster: "被災地",
  tv: "テレビ局",
};

// ---- 状態 ----

export interface StoryProgress {
  id: string;
  chapter: string;
  /** この章が起きるターン（これ以降に条件を満たした最初の月末に起きる） */
  due: number;
  /** ここまでに条件を満たさなければ、fallback の結末で終わる */
  deadline: number;
}

export interface StoryState {
  active: StoryProgress[];
  flags: string[];
  /** 終わった物語と、その結末の id */
  done: Record<string, string>;
  /** 物語ごとの、始まった回数（何度でも起きる物語の2回目からの確率に使う） */
  count?: Record<string, number>;
}

/** 人物との関係。people のキーは議員の番号（文字列）か "secretary" */
export interface BondState {
  people: Record<string, { value: number; tag?: BondTag }>;
  roles: { rival?: number; doki?: number; senpai?: number };
}

/** 今、画面で選ぶ必要のある章 */
export interface PendingStory {
  id: string;
  chapter: string;
}

export const newStoryState = (): StoryState => ({ active: [], flags: [], done: {} });
export const newBondState = (): BondState => ({ people: { secretary: { value: 0 } }, roles: {} });

// ---- career.ts とのつなぎ ----

/** 物語の計算に要る、career.ts の状態と道具 */
export interface StoryContext {
  turn: number;
  month: number;
  status: string;
  /** 役職の種類（minister, pm, party_exec, leader, opp_exec, none） */
  postKind: string;
  /** 自分の党が与党（連立相手を含む）か */
  ruling: boolean;
  player: Member;
  age: number;
  relations: Record<string, number>;
  /** 出馬している区（比例単独ならない）と地元の都道府県 */
  district?: number;
  pref: number;
  secretaryName: string;
  /** 直前の総選挙の結果 */
  lastElection?: { won: boolean; margin?: number };
  story: StoryState;
  bonds: BondState;
  /** 議員番号から議員か浪人を探す（引退した人は見つからない） */
  findMember: (id: number) => Member | undefined;
  rand: () => number;
}

// ---- 人物との関係 ----

const roleKey = (bonds: BondState, role: BondRole): string | undefined => (role === "secretary" ? "secretary" : bonds.roles[role]?.toString());

/** その役の人物（議員）。秘書や、いない役は undefined */
export function roleMember(ctx: Pick<StoryContext, "bonds" | "findMember">, role: BondRole): Member | undefined {
  if (role === "secretary") return undefined;
  const id = ctx.bonds.roles[role];
  return id === undefined ? undefined : ctx.findMember(id);
}

/** その役の人物がいるか（秘書はいつもいる） */
export function roleAvailable(ctx: Pick<StoryContext, "bonds" | "findMember">, role: BondRole): boolean {
  return role === "secretary" || !!roleMember(ctx, role);
}

/** その役との関係（いなければ undefined） */
export function bondOf(bonds: BondState, role: BondRole): { value: number; tag?: BondTag } | undefined {
  const k = roleKey(bonds, role);
  return k ? bonds.people[k] : undefined;
}

/** 議員番号から、その人との関係と役（画面の人物の詳しい情報に出す） */
export function bondWith(bonds: BondState | undefined, memberId: number): { value: number; tag?: BondTag; role?: BondRole } | undefined {
  if (!bonds) return undefined;
  const b = bonds.people[String(memberId)];
  if (!b) return undefined;
  const role = (Object.keys(bonds.roles) as (keyof BondState["roles"])[]).find((r) => bonds.roles[r] === memberId);
  return { ...b, role };
}

/** 関係の値を言葉にする（-100〜100） */
export function bondWord(v: number): string {
  if (v >= 60) return "親密";
  if (v >= 20) return "良好";
  if (v > -20) return "普通";
  if (v > -60) return "冷淡";
  return "険悪";
}

/** 役ごとの関係の札の効果をまとめる */
function tagEffects(bonds: BondState | undefined): BondEffect[] {
  if (!bonds) return [];
  return Object.values(bonds.people)
    .map((b) => (b.tag ? BOND_EFFECTS[b.tag] : undefined))
    .filter((x): x is BondEffect => !!x);
}

/** 毎月の経験点（関係の札による） */
export function monthlyBondExp(bonds: BondState | undefined): Record<string, number> {
  const out: Record<string, number> = {};
  for (const e of tagEffects(bonds)) for (const [k, n] of Object.entries(e.monthly_exp ?? {})) out[k] = (out[k] ?? 0) + n;
  return out;
}

/** 総選挙の得票率に足すポイント（関係の札による） */
export function bondVoteBonus(bonds: BondState | undefined): number {
  return tagEffects(bonds).reduce((a, e) => a + (e.vote_bonus ?? 0), 0);
}

/** 能力の判定のしきい値の増減（関係の札による。負なら通りやすい） */
export function bondRiskShift(bonds: BondState | undefined, ability: Ability): number {
  return tagEffects(bonds).reduce((a, e) => a + (e.risk?.[ability] ?? 0), 0);
}

/** 党首選で、プレイヤーに入れる人と相手に入れる人（同期と先輩の関係の札による） */
export function leaderVoteBias(bonds: BondState | undefined): { for: number[]; against: number[] } {
  const out = { for: [] as number[], against: [] as number[] };
  if (!bonds) return out;
  for (const role of ["doki", "senpai", "rival"] as const) {
    const id = bonds.roles[role];
    const tag = id === undefined ? undefined : bonds.people[String(id)]?.tag;
    const v = tag ? BOND_EFFECTS[tag].leader_vote : undefined;
    if (id !== undefined && v) out[v].push(id);
  }
  return out;
}

/**
 * 初当選のとき、同期と先輩を決める。同期は同じ党で同じ総選挙で初当選した人（同じ県を優先）、
 * 先輩は同じ党の当選5回以上の人（同じ県を優先し、いなければ当選回数の多い人）。首相の役の固定キャラクターは除く
 */
export function assignColleagues(bonds: BondState, player: Member, roster: Member[], rand: () => number): void {
  const mates = roster.filter((m) => m.party === player.party && m.id !== player.id && m.fixedRole !== "首相");
  const pickNear = (list: Member[]) => {
    const near = list.filter((m) => m.home === player.home);
    const pool = near.length ? near : list;
    return pool.length ? pool[Math.floor(rand() * pool.length)] : undefined;
  };
  if (bonds.roles.doki === undefined) {
    const d = pickNear(mates.filter((m) => m.terms === 1));
    if (d) {
      bonds.roles.doki = d.id;
      bonds.people[String(d.id)] ??= { value: 10 };
    }
  }
  if (bonds.roles.senpai === undefined) {
    const seniors = mates.filter((m) => m.terms >= 5);
    const near = seniors.filter((m) => m.home === player.home);
    const s = near.length ? pickNear(near) : [...seniors].sort((a, b) => b.terms - a.terms || a.id - b.id)[0];
    if (s) {
      bonds.roles.senpai = s.id;
      bonds.people[String(s.id)] ??= { value: 10 };
    }
  }
}

/** 総選挙のあと、ライバル（自分の区で次点か当選者）を決める。相手が替われば、新しい相手との関係は0から */
export function assignRival(bonds: BondState, rivalId: number | undefined): void {
  if (rivalId === undefined) return;
  bonds.roles.rival = rivalId;
  bonds.people[String(rivalId)] ??= { value: 0 };
}

/** ライバルの人物像の型（能力と経歴から選ぶ） */
export function rivalTypeOf(m: Member, year: number): RivalType {
  const a = m.abilities;
  const age = year - m.birthYear;
  const id =
    m.archetype.includes("官僚") ? "former_bureaucrat"
    : m.archetype.includes("首長") || m.archetype.includes("地方議員") ? "former_mayor"
    : m.archetype.includes("経済") || m.archetype.includes("企業") ? "business_leader"
    : m.lineage.includes("世襲") && age < 50 ? "second_generation"
    : m.terms >= 5 && m.jiban >= 3 ? "local_veteran"
    : a.弁舌 + a.知名度 >= 140 ? "media_orator"
    : m.terms <= 1 && age < 45 ? "grassroots_activist"
    : "quiet_artisan";
  return RIVAL_TYPES.find((t) => t.id === id) ?? RIVAL_TYPES[RIVAL_TYPES.length - 1];
}

// ---- 条件 ----

/** その物語の登場人物がそろっているか（ライバル、同期、先輩が引退していないか） */
function castReady(ctx: StoryContext, story: Story): boolean {
  for (const c of story.cast) if ((c === "rival" || c === "doki" || c === "senpai") && !roleMember(ctx, c)) return false;
  return true;
}

/** ライバルがまだ自分の区で戦っているか（現職なら同じ区、浪人なら同じ県が地元） */
function rivalInDistrict(ctx: StoryContext): boolean {
  const r = roleMember(ctx, "rival");
  if (!r || ctx.district === undefined) return false;
  return r.seat === "小選挙区" ? r.district === ctx.district : r.seat === "なし" && r.home === ctx.pref;
}

export function meets(ctx: StoryContext, c: StoryCondition | undefined): boolean {
  if (!c) return true;
  const p = ctx.player;
  if (c.status && !c.status.includes(ctx.status)) return false;
  if (c.post && !c.post.includes(ctx.postKind || "none")) return false;
  if (c.ruling !== undefined && c.ruling !== ctx.ruling) return false;
  if (c.terms_min !== undefined && p.terms < c.terms_min) return false;
  if (c.terms_max !== undefined && p.terms > c.terms_max) return false;
  if (c.age_min !== undefined && ctx.age < c.age_min) return false;
  if (c.age_max !== undefined && ctx.age > c.age_max) return false;
  for (const [k, n] of Object.entries(c.abilities ?? {})) if (p.abilities[k as Ability] < (n as number)) return false;
  for (const [k, n] of Object.entries(c.relations ?? {})) if ((ctx.relations[k] ?? 0) < n) return false;
  for (const [k, n] of Object.entries(c.bonds_min ?? {})) if ((bondOf(ctx.bonds, k as BondRole)?.value ?? -Infinity) < (n as number)) return false;
  for (const [k, n] of Object.entries(c.bonds_max ?? {})) if ((bondOf(ctx.bonds, k as BondRole)?.value ?? Infinity) > (n as number)) return false;
  for (const [k, t] of Object.entries(c.bond_state ?? {})) if (bondOf(ctx.bonds, k as BondRole)?.tag !== t) return false;
  if (c.jiban_min !== undefined && p.jiban < c.jiban_min) return false;
  if (c.skills && !c.skills.every((s) => p.skills.includes(s))) return false;
  if (c.no_skills && c.no_skills.some((s) => p.skills.includes(s))) return false;
  if (c.flags && !c.flags.every((f) => ctx.story.flags.includes(f))) return false;
  if (c.no_flags && c.no_flags.some((f) => ctx.story.flags.includes(f))) return false;
  if (c.months && !c.months.includes(ctx.month)) return false;
  if (c.won_last !== undefined && ctx.lastElection?.won !== c.won_last) return false;
  if (c.margin_max !== undefined && (ctx.lastElection?.margin === undefined || ctx.lastElection.margin > c.margin_max)) return false;
  if (c.rival_in_district !== undefined && rivalInDistrict(ctx) !== c.rival_in_district) return false;
  return true;
}

// ---- 進み方 ----

const between = (ctx: StoryContext, [lo, hi]: [number, number]) => lo + Math.floor(ctx.rand() * (hi - lo + 1));

function schedule(ctx: StoryContext, story: Story, chapterId: string): StoryProgress {
  const ch = story.chapters.find((c) => c.id === chapterId)!;
  const due = ctx.turn + Math.max(1, between(ctx, ch.after_months));
  return { id: story.id, chapter: chapterId, due, deadline: due + DATA.grace_months };
}

/**
 * 物語を始める。trigger が monthly のものは start_chance の確率で、それ以外は条件を満たせば始まる（1回に1本）。
 * 始めた物語の題名を返す
 */
export function startStories(ctx: StoryContext, trigger: NonNullable<StoryCondition["trigger"]>): string[] {
  const s = ctx.story;
  if (s.active.length >= DATA.max_active) return [];
  const eligible = STORIES.filter(
    (st) =>
      (st.start.trigger ?? "monthly") === trigger &&
      !s.active.some((a) => a.id === st.id) &&
      (st.once === false || !(st.id in s.done)) &&
      castReady(ctx, st) &&
      meets(ctx, st.start),
  );
  if (!eligible.length) return [];
  // 並べる順：まだ起きていない物語を先に（同じ組の中は乱数で混ぜる）。出来事で始まる物語は1回に1本なので、
  // 何度でも起きる物語が毎回枠を取って、一生に一度の物語が起きなくならないようにする
  const count = (s.count ??= {});
  const order = eligible
    .map((st) => ({ st, key: (count[st.id] ? 1 : 0) + ctx.rand() }))
    .sort((a, b) => a.key - b.key)
    .map((x) => x.st);
  for (const st of order) {
    const chance = trigger === "monthly" ? (st.chance ?? DATA.start_chance) : count[st.id] ? (st.chance ?? 1) : 1;
    if (ctx.rand() >= chance) continue;
    // 一生に何度も起きる物語は、始めるときに前の結末を消す
    delete s.done[st.id];
    count[st.id] = (count[st.id] ?? 0) + 1;
    s.active.push(schedule(ctx, st, st.chapters[0].id));
    return [st.title];
  }
  return [];
}

/**
 * 月末に、起きる時期になった章を探す。条件を満たせばその章を返し（画面で選ぶ）、
 * 期限を過ぎた物語は fallback の結末（なければ何も起こさず）で終える。終わった物語は ended に入れて返す
 */
export function dueChapter(ctx: StoryContext): { pending?: PendingStory; ended: { story: Story; ending?: StoryEnding }[] } {
  const ended: { story: Story; ending?: StoryEnding }[] = [];
  let pending: PendingStory | undefined;
  for (const a of [...ctx.story.active].sort((x, y) => x.due - y.due)) {
    const st = storyById(a.id);
    if (!st) {
      ctx.story.active = ctx.story.active.filter((x) => x !== a);
      continue;
    }
    if (ctx.turn < a.due) continue;
    const ch = st.chapters.find((c) => c.id === a.chapter)!;
    if (!pending && castReady(ctx, st) && meets(ctx, ch.conditions) && availableChoices(ctx, ch).length) {
      pending = { id: a.id, chapter: a.chapter };
      continue;
    }
    if (ctx.turn >= a.deadline || !castReady(ctx, st)) {
      const ending = ch.fallback ? st.endings.find((e) => e.id === ch.fallback) : undefined;
      ctx.story.active = ctx.story.active.filter((x) => x !== a);
      ctx.story.done[st.id] = ending?.id ?? "";
      ended.push({ story: st, ending });
    }
  }
  return { pending, ended };
}

/** 章の選択肢のうち、出せるもの（if_flags の旗がすべて立っているもの） */
export function availableChoices(ctx: Pick<StoryContext, "story">, ch: StoryChapter): StoryChoice[] {
  return ch.choices.filter((c) => !c.if_flags || c.if_flags.every((f) => ctx.story.flags.includes(f)));
}

export interface StoryOutcome {
  label: string;
  result: string;
  /** 次の章か結末の id */
  next: string;
  effects: StoryEffects;
  failed: boolean;
}

/** 選択肢の結果を決める（能力の判定を含む）。状態は変えない */
export function resolveChoice(ctx: StoryContext, choice: StoryChoice, riskBonus: (a: Ability) => number): StoryOutcome {
  const r = choice.risk;
  const failed = !!r && ctx.player.abilities[r.ability] + riskBonus(r.ability) - bondRiskShift(ctx.bonds, r.ability) < r.threshold;
  return {
    label: choice.label,
    result: failed ? r!.fail_result : choice.result,
    next: failed ? (r!.fail_next ?? choice.next) : choice.next,
    effects: failed ? r!.fail_effects : choice.effects,
    failed,
  };
}

/** 人物との関係の効果（bonds、bond_state）を当て、変化の言葉を返す */
export function applyBondEffects(ctx: StoryContext, e: StoryEffects): string[] {
  const out: string[] = [];
  for (const [role, n] of Object.entries(e.bonds ?? {})) {
    const k = roleKey(ctx.bonds, role as BondRole);
    if (!k || !n) continue;
    const b = (ctx.bonds.people[k] ??= { value: 0 });
    b.value = Math.max(-100, Math.min(100, b.value + (n as number)));
    out.push(`${who(ctx, role as BondRole)}との関係${(n as number) > 0 ? "+" : ""}${n}`);
  }
  for (const [role, tag] of Object.entries(e.bond_state ?? {})) {
    const k = roleKey(ctx.bonds, role as BondRole);
    if (!k || !tag) continue;
    (ctx.bonds.people[k] ??= { value: 0 }).tag = tag as BondTag;
    out.push(`${who(ctx, role as BondRole)}との間柄：${tag}`);
  }
  return out;
}

/** 選んだ結果を物語の状態に反映する（旗、次の章、結末）。結末なら返す */
export function advance(ctx: StoryContext, pending: PendingStory, choice: StoryChoice, outcome: StoryOutcome): StoryEnding | undefined {
  const st = storyById(pending.id)!;
  for (const f of choice.flags ?? []) if (!ctx.story.flags.includes(f)) ctx.story.flags.push(f);
  ctx.story.active = ctx.story.active.filter((a) => a.id !== pending.id);
  const ending = st.endings.find((e) => e.id === outcome.next);
  if (ending) {
    ctx.story.done[st.id] = ending.id;
    return ending;
  }
  if (st.chapters.some((c) => c.id === outcome.next)) ctx.story.active.push(schedule(ctx, st, outcome.next));
  else ctx.story.done[st.id] = "";
  return undefined;
}

// ---- 文の置き換えと画面用のまとめ ----

const fullName = (m: Member) => m.name.surname + m.name.givenName;

function who(ctx: Pick<StoryContext, "bonds" | "findMember" | "secretaryName">, role: BondRole): string {
  if (role === "secretary") return ctx.secretaryName;
  const m = roleMember(ctx, role);
  return m ? m.name.surname : BOND_ROLE_NAMES[role];
}

/** {self} などを名前に置き換える */
export function fillText(ctx: StoryContext, text: string): string {
  const r = roleMember(ctx, "rival");
  const d = roleMember(ctx, "doki");
  const s = roleMember(ctx, "senpai");
  return text
    .replaceAll("{self}", ctx.player.name.surname)
    .replaceAll("{secretary}", ctx.secretaryName)
    .replaceAll("{rival_party}", r ? partyById(r.party).short : "相手の党")
    .replaceAll("{rival}", r ? fullName(r) : "ライバル")
    .replaceAll("{doki}", d ? fullName(d) : "同期")
    .replaceAll("{senpai}", s ? fullName(s) : "先輩")
    .replaceAll("{district}", ctx.district !== undefined ? districtName(ctx.district) : (PREFECTURES[ctx.pref - 1]?.name ?? ""))
    .replaceAll("{pref}", PREFECTURES[ctx.pref - 1]?.name ?? "")
    .replaceAll("{party}", partyById(ctx.player.party).short);
}

export interface SceneLine {
  role: StoryLine["speaker"];
  /** 話し手の名前（地の文は空） */
  name: string;
  /** 話し手の役（「ライバル」「秘書」など） */
  label: string;
  memberId?: number;
  party?: string;
  text: string;
  face?: string;
}

export interface StoryScene {
  storyId: string;
  title: string;
  chapter: string;
  chapterNo: number;
  chapterCount: number;
  bg: string;
  place: string;
  lines: SceneLine[];
  choices: { label: string; tags: string[] }[];
  /** 左の枠に立つ相手（ライバル、同期、先輩のうち最初に出る人。いなければ秘書） */
  partner?: { role: BondRole; name: string; memberId?: number; party?: string };
}

const EXP_NAMES: Record<string, string> = { election: "選挙", policy: "政策", network: "人脈", media: "発信", money: "調達" };

/** 詳細モードで選択肢に添える、関わる分野の札（増えるか減るかは出さない） */
export function choiceTags(c: StoryChoice): string[] {
  const e = c.effects;
  const tags = new Set<string>();
  for (const k of Object.keys(e.exp ?? {})) tags.add(EXP_NAMES[k] ?? k);
  if (e.relations && Object.keys(e.relations).length) tags.add("関係");
  if (e.bonds || e.bond_state) tags.add("人物");
  if (e.jiban_progress) tags.add("地盤");
  if (e.money) tags.add("資金");
  if (e.abilities) tags.add("能力");
  if (e.vote_bonus) tags.add("票");
  if (c.risk) tags.add(`判定：${c.risk.ability}`);
  return [...tags];
}

/** 画面と CLI に出す、章の場面 */
export function storyScene(ctx: StoryContext, pending: PendingStory): StoryScene {
  const st = storyById(pending.id)!;
  const idx = st.chapters.findIndex((c) => c.id === pending.chapter);
  const ch = st.chapters[idx];
  const roleInfo = (role: StoryLine["speaker"], other?: string) => {
    if (role === "narrator") return { name: "", label: "" };
    if (role === "self") return { name: ctx.player.name.displayName, label: "自分", memberId: ctx.player.id, party: ctx.player.party };
    if (role === "other") return { name: other ?? "", label: "" };
    if (role === "secretary") return { name: ctx.secretaryName, label: "秘書" };
    const m = roleMember(ctx, role);
    return { name: m?.name.displayName ?? BOND_ROLE_NAMES[role], label: BOND_ROLE_NAMES[role], memberId: m?.id, party: m?.party };
  };
  const lines = ch.lines.map((l) => ({ role: l.speaker, ...roleInfo(l.speaker, l.name), text: fillText(ctx, l.text), face: l.face }));
  const partnerRole = (st.cast.find((c) => c === "rival" || c === "doki" || c === "senpai") ?? "secretary") as BondRole;
  const pm = roleMember(ctx, partnerRole);
  return {
    storyId: st.id,
    title: st.title,
    chapter: ch.id,
    chapterNo: idx + 1,
    chapterCount: st.chapters.length,
    bg: ch.bg,
    place: BG_NAMES[ch.bg] ?? "",
    lines,
    choices: availableChoices(ctx, ch).map((c) => ({ label: fillText(ctx, c.label), tags: choiceTags(c) })),
    partner: { role: partnerRole, name: partnerRole === "secretary" ? ctx.secretaryName : (pm?.name.displayName ?? BOND_ROLE_NAMES[partnerRole]), memberId: pm?.id, party: pm?.party },
  };
}
