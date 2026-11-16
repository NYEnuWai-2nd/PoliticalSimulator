// 議員人生モード（設計は docs/design.md の5節）
// プレイヤーは新人候補として始め、毎月1つ活動を選んで経験点をため、能力を上げ、総選挙での当選を目指す。
// 落選しても浪人として続け、何年もかけて地盤を固められる。当選すれば議員として続き、役職に就くこともある。
// 政権は AI が動かす（ai.ts）。状態 CareerState は JSON で保存できる形にし、名簿などは CareerWorld に分ける。
// 画面に依存しないので、ブラウザでも CLI（src/cli/）でも同じように動く。
import careerRaw from "../../data/game/career.json";
import lifeRaw from "../../data/game/life_events.json";
import flavorRaw from "../../data/game/activity_flavor.json";
import highlightsRaw from "../../data/game/highlights.json";
import { HINTS, expMultiplier, hintCandidates, jibanMultiplier, learnCost, meetsExceptActivity, mishapsFor, moneyMultiplier, neglectShift, relationMultiplier, riskBonus, skillById, staminaMultiplier, startingSkills, superseded, updateSkills } from "./skills.js";
import { mulberry32 } from "../lib/nameGenerator.js";
import type { Member, MemberFactory } from "./roster.js";
import { START_YEAR } from "./roster.js";
import type { Appointment, Ruling } from "./cabinet.js";
import { formGovernment } from "./cabinet.js";
import politicsRaw from "../../data/game/politics.json";
import { describe as describeRuling, formCoalition, leaderElection, pickLeader } from "./politics.js";
import type { LeaderElection } from "./politics.js";
import { ABILITIES, TABLES, centerOf } from "./tables.js";
import type { Ability } from "./tables.js";
import { partyById } from "./parties.js";
import { SMD_SEATS } from "./districts.js";
import type { PrefCode } from "./districts.js";
import { PREFECTURES } from "../map/japanMap.js";
import { BILLS, billName, createGame, endTurn, nemawashi, pressConference, startDrafting, submitBill, talkWithParty } from "./game.js";
import type { GameState } from "./game.js";
import { aiGovernmentActions, aiWantsDissolution } from "./ai.js";
import { estimateDistrict, partiesRunning, runElection } from "./election.js";
import { OPP, OPP_POSTS, assignOppositionPosts, countNoConfidence, initialCooperation, isFirstOpposition, isOppositionParty, newOppositionState, otherOppositionParties, pactTransfer } from "./opposition.js";
import type { OppDuty, OppositionState, Pact } from "./opposition.js";
import { inSession } from "./game.js";
import { partyDistance } from "./vote.js";

const C = careerRaw;
const PL = politicsRaw;

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
  /** 内閣支持率の増減 */
  approval?: number;
  stamina?: number;
  max_stamina?: number;
  mood?: number;
  money?: number;
  exp?: Partial<Exp>;
  relations?: Partial<Record<RelationId, number>>;
  jiban_progress?: number;
  abilities?: Partial<Record<Ability, number>>;
  /** 特殊能力を身につける／外す（id の配列） */
  skills_add?: string[];
  skills_remove?: string[];
}

interface LifeEvent {
  id: string;
  weight: number;
  /** 一生に一度だけ起きる */
  once?: boolean;
  title: string;
  text: string;
  status?: string[];
  /** 役職の種類（minister, pm, party_exec, leader）。書いてあればその役職のときだけ起きる */
  post?: string[];
  /** 季節の出来事。書いてあればその月だけ起きる */
  months?: number[];
  choices: {
    label: string;
    result: string;
    effects: Effects;
    /** 能力が threshold 未満なら、effects の代わりに fail_effects と fail_result になる */
    risk?: { ability: Ability; threshold: number; fail_result: string; fail_effects: Effects };
  }[];
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
  /** 政局（政権の行動、採決、政界の出来事）の記録なら "gov"。書いていなければ自分の記録 */
  kind?: "gov";
  /** 重み。major は山場（総選挙、就任、政権交代など）、minor は細かい動き（記者会見、協議など）。書いていなければふつう */
  level?: "major" | "minor";
  /** 同じ月に同じ種類の動きが重なったときの回数（2以上のときだけ書く） */
  count?: number;
}

/** 山場の場面（政権交代、首相交代、自分の就任）。画面ではポップアップで見せる */
export interface Highlight {
  turn: number;
  kind: string;
  title: string;
  text: string;
  lines: { name: string; role: string; text: string; party?: string }[];
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
  /** 選挙の前の議席（前回比に使う） */
  prevSeats?: { party: string; total: number }[];
  /** 前回の総選挙での自分の得票率（同じ小選挙区で戦ったとき） */
  prevShare?: number;
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
  /** 出来事ごとの、最後に起きたターンと回数（同じ出来事の繰り返しを防ぐ） */
  eventHistory: Record<string, { last: number; count: number }>;
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
  /** 政党ごとの党首（議員番号）。与党の党首が首相 */
  leaders: Record<string, number>;
  /** 与党の党首の任期が切れる年月（ここで党首選） */
  leaderTermEnd: { year: number; month: number };
  /** 次の党首選に立候補するか（立候補の条件を満たしているときだけ効く） */
  runForLeader: boolean;
  /** AI の首相の支持率が辞任の目安を下回った月が続いた数 */
  lowApprovalMonths: number;
  /** 首相のプレイヤーが解散を決めた（月末に総選挙） */
  dissolveRequested: boolean;
  /** 経歴に残る出来事（初当選、大臣就任、首相就任など） */
  achievements: string[];
  /** 首相を務めた月数 */
  pmMonths: number;
  /** 与党の党首が連続で務めている期数（任期の上限に使う） */
  leaderTermsServed: number;
  /** 今の与党第一党が政権に就いた年（長期政権の疲れに使う） */
  rulingSince: number;
  /** 今の首相が就任した年（首相個人の疲れに使う） */
  pmSince: number;
  /** プレイヤーが与党の党首を務めた期数の通算（生涯の上限に使う） */
  playerLeaderTerms: number;
  rngCounter: number;
  /** 活動ごとに行った回数（特殊能力を身につける条件に使う） */
  activityCounts?: Record<string, number>;
  /** 特殊能力のコツ（id → Lv1〜3）。コツがあれば経験点を払って覚えられる */
  skillHints?: Record<string, number>;
  /** 山場の場面（新しいものが後ろ。画面で見せたかどうかは画面の側で数える） */
  highlights?: Highlight[];
  /** 野党でのプレイヤーの状態（協力度、選挙協力、追い風、対案、党首の行動） */
  opp?: OppositionState;
  /** 野党の役職（党首を除く）。人事のときに決まる */
  oppPost?: { id: string; name: string; field?: string };
  /** 月末ごとの数値の推移（助言で「この3か月で下がった」と言うのに使う。最新6か月分） */
  history?: { turn: number; approval: number; money: number; share?: number }[];
  /** 政権の記録（gov.log）のうち、自分の記録に写し終えた数 */
  govLogCopied?: number;
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

function log(s: CareerState, text: string, level?: CareerLog["level"]): void {
  s.log.push({ turn: s.turn, date: dateOf(s), text, ...(level ? { level } : {}) });
}

/** 政局の記録（解散、党首選、連立、不信任案など。自分のことではない政治の動き） */
function logGov(s: CareerState, text: string, level?: CareerLog["level"]): void {
  s.log.push({ turn: s.turn, date: dateOf(s), text, kind: "gov", ...(level ? { level } : {}) });
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

/** 開始時点の党首。与党は首相、ほかの党は党首の点数が最も高い議員 */
function initialLeaders(roster: Member[], government: Appointment[]): Record<string, number> {
  const out: Record<string, number> = {};
  const pm = government.find((a) => a.post.id === "pm")?.member;
  for (const party of new Set(roster.map((m) => m.party))) {
    if (partyById(party).is_independent) continue;
    const l = pm && pm.party === party ? pm : (roster.find((m) => m.party === party && m.fixedRole === "党首") ?? pickLeader(roster, party));
    if (l) out[party] = l.id;
  }
  return out;
}

/** プレイヤーが首相か */
export function isPrimeMinister(_state: CareerState, world: CareerWorld): boolean {
  return world.government.find((a) => a.post.id === "pm")?.member.id === world.player.id;
}

/** プレイヤーの役職の種類（公務と出来事に使う）。なければ空 */
export function postCategory(state: CareerState, world: CareerWorld): string {
  const a = world.government.find((x) => x.member.id === world.player.id);
  if (a) return a.post.id === "pm" ? "pm" : a.post.field ? "minister" : a.post.id;
  if (state.leaders[world.player.party] === world.player.id) return "leader";
  if (state.oppPost) return state.oppPost.id;
  return "";
}

/** 今の役職名（内閣・党の役職、または野党の党首） */
function postTitle(state: CareerState, world: CareerWorld): string {
  const a = world.government.find((x) => x.member.id === world.player.id);
  if (a) return a.post.name;
  if (state.leaders[world.player.party] === world.player.id) return `${partyById(world.player.party).short}の党首`;
  if (state.oppPost) return `${partyById(world.player.party).short}の${state.oppPost.name}`;
  return "";
}

const partyExec = new Set(["secretary_general", "policy_chief", "general_council_chair"]);
const postKind = (c: string) => (partyExec.has(c) ? "party_exec" : c === "chief_cabinet_secretary" ? "minister" : c.startsWith("opp_") ? "opp_exec" : c);

/** 党首選に立候補できるか（与党・野党どちらの党でも） */
export function canRunForLeader(state: CareerState, world: CareerWorld): boolean {
  const L = PL.leader;
  return (
    state.status === "議員" &&
    world.player.terms >= L.min_terms &&
    state.relations.party >= L.min_party_relation &&
    state.leaders[world.player.party] !== world.player.id &&
    state.playerLeaderTerms < L.term_limit
  );
}

/** 党首選で、立候補したプレイヤーに足される票の上乗せ */
function playerLeaderBonus(state: CareerState, world: CareerWorld): number {
  const B = PL.leader.player_bonus;
  return (state.relations.party - 50) / B.party + world.player.terms * B.terms;
}

/** 内閣を組み直す。与党の党首を首相にする。党の幹部との関係が人事に効く */
function rebuildGovernment(state: CareerState, world: CareerWorld, ruling: Ruling): void {
  const R = C.relation_effects;
  world.government = formGovernment(world.roster, {
    ruling,
    pmId: state.leaders[ruling.party],
    adjust: (m, post) =>
      m.id !== world.player.id
        ? 0
        : state.relations.party < R.party_exclude
          ? null
          : (state.relations.party - 50) * R.party_score + (state.oppPost?.field && post.field === state.oppPost.field ? OPP.posts.shadow.cabinet_bonus : 0),
  });
  updatePost(state, world);
}

/** 野党なら党の役職を決め直す（党首は除く）。与党になったら外す */
function assignOppPost(state: CareerState, world: CareerWorld): void {
  const p = world.player;
  const party = p.party;
  if (state.status !== "議員" || !isOppositionParty(party, state.gov.ruling) || state.leaders[party] === p.id) {
    delete state.oppPost;
    return;
  }
  const R = C.relation_effects;
  const members = world.roster.filter((m) => m.party === party);
  const posts = assignOppositionPosts(members, state.leaders[party], (m) =>
    m.id !== p.id ? 0 : state.relations.party < R.party_exclude ? null : (state.relations.party - 50) * R.party_score,
  );
  const mine = [...posts].find(([, m]) => m.id === p.id)?.[0];
  const S = OPP.posts.shadow;
  if (mine) state.oppPost = { id: mine, name: OPP_POSTS.find((x) => x.id === mine)!.name };
  else if (p.terms >= S.min_terms && state.relations.party >= S.min_party_relation && p.specialties[0])
    state.oppPost = { id: "opp_shadow", name: `影の大臣（${p.specialties[0]}）`, field: p.specialties[0] };
  else delete state.oppPost;
}

/** 野党の党の役職に就いている人（自分の党。党首を除く。画面で見せる） */
export function oppositionLineup(state: CareerState, world: CareerWorld): { post: string; member: Member }[] {
  const party = world.player.party;
  if (!isOppositionParty(party, state.gov.ruling)) return [];
  const members = world.roster.filter((m) => m.party === party && m.id !== world.player.id);
  const posts = assignOppositionPosts(members, state.leaders[party], () => 0);
  const out = [...posts].map(([id, m]) => ({ post: OPP_POSTS.find((x) => x.id === id)!.name, member: m }));
  // プレイヤーの役職を、同じ役職のほかの議員に代えて入れる
  if (state.oppPost && state.oppPost.id !== "opp_shadow") {
    const i = out.findIndex((x) => x.post === state.oppPost!.name);
    if (i >= 0) out[i] = { post: state.oppPost.name, member: world.player };
  }
  return out;
}

function updatePost(state: CareerState, world: CareerWorld): void {
  assignOppPost(state, world);
  const title = postTitle(state, world);
  if (title && title !== state.post) {
    log(state, `${title}に就いた。`);
    state.achievements.push(`${dateOf(state)} ${title}`);
  }
  state.post = title;
}

/** 党首選を行う。与党なら首相が替わることがある（keepGov なら政権の状態は保ったまま内閣だけ組み直す） */
function runLeaderElection(state: CareerState, world: CareerWorld, party: string, reason: string, rebuild: boolean): LeaderElection | undefined {
  const playerRuns = state.runForLeader && world.player.party === party && canRunForLeader(state, world);
  const isRulingParty = state.gov.ruling.party === party;
  const incumbentIsPlayer = state.leaders[party] === world.player.id;
  const termLimited = isRulingParty && (state.leaderTermsServed >= PL.leader.term_limit || (incumbentIsPlayer && state.playerLeaderTerms >= PL.leader.term_limit));
  const result = leaderElection(world.roster, party, {
    incumbentId: state.leaders[party],
    incumbentApproval: isRulingParty ? state.gov.approval : undefined,
    // プレイヤーは自分で立候補したときだけ候補になる（ほかの議員と同じように自動では候補にしない）
    excludeIds: [...(termLimited ? [state.leaders[party]] : []), ...(playerRuns ? [] : [world.player.id])],
    extra: playerRuns ? { member: world.player, bonus: playerLeaderBonus(state, world) } : undefined,
    rand: () => rand(state),
  });
  if (!result) return undefined;
  const before = state.leaders[party];
  state.leaders[party] = result.winner.id;
  const isRuling = state.gov.ruling.party === party;
  const votes = result.candidates.map((c) => `${c.member.name.displayName}${c.member.id === world.player.id ? "（自分）" : ""}${c.votes}票`).join("、");
  const showLog = world.player.party === party || isRuling;
  if (showLog) logGov(state, `${partyById(party).short}の党首選（${reason}）：${votes}。${result.winner.name.displayName}が${before === result.winner.id ? "再選された" : "新しい党首に選ばれた"}。`);
  if (playerRuns && result.winner.id !== world.player.id) log(state, "党首選に敗れた。");
  if (isRuling) {
    state.leaderTermEnd = addMonths(state, PL.leader.term_months);
    state.leaderTermsServed = before === result.winner.id ? state.leaderTermsServed + 1 : 1;
    if (before !== result.winner.id) state.pmSince = state.year;
    if (result.winner.id === world.player.id) state.playerLeaderTerms++;
    if (termLimited) logGov(state, "首相は党首の任期の上限に達し、退いた。");
    if (rebuild) {
      const changed = before !== result.winner.id;
      rebuildGovernment(state, world, state.gov.ruling);
      if (changed) state.gov.approval = Math.min(90, Math.round((state.gov.approval + PL.pm.honeymoon) * 10) / 10);
    }
  } else if (rebuild) updatePost(state, world);
  return result;
}

/** 長期政権の疲れ（支持率が戻っていく基準の値をどれだけ下げるか） */
function fatigueOf(state: CareerState): number {
  const F = PL.fatigue;
  const party = Math.min(F.cap, Math.max(0, state.year - state.rulingSince) * F.per_year);
  const pm = Math.max(0, state.year - state.pmSince) * F.pm_per_year;
  return Math.min(F.total_cap, party + pm);
}

function addMonths(s: Pick<CareerState, "year" | "month">, n: number): { year: number; month: number } {
  const t = s.year * 12 + (s.month - 1) + n;
  return { year: Math.floor(t / 12), month: (t % 12) + 1 };
}

const reached = (s: Pick<CareerState, "year" | "month">, d: { year: number; month: number }) => s.year > d.year || (s.year === d.year && s.month >= d.month);

/** 首相のプレイヤーが政権の行動をとる（法案の準備・提出、協議、根回し、記者会見、解散） */
export function govAction(state: CareerState, world: CareerWorld, action: string, arg?: string): TurnResult {
  if (state.over) return { ok: false, message: "ゲームは終わっています。" };
  if (!isPrimeMinister(state, world)) return { ok: false, message: "政権の行動は首相のときだけとれます。" };
  const ctx = { roster: world.roster, government: world.government };
  const g = state.gov;
  switch (action) {
    case "draft":
      return startDrafting(g, ctx, arg ?? "");
    case "submit":
      return submitBill(g, ctx, arg ?? "");
    case "talk":
      return talkWithParty(g, ctx, arg ?? "");
    case "nemawashi":
      return nemawashi(g, ctx);
    case "press":
      return pressConference(g, ctx);
    case "dissolve":
      state.dissolveRequested = true;
      return { ok: true, message: "衆議院の解散を決めた。月末に総選挙になる。" };
    default:
      return { ok: false, message: "政権の行動は draft <法案> / submit <法案> / talk <政党> / nemawashi / press / dissolve です。" };
  }
}

/** 首相のときに見る、法案の状況 */
export function govBills(state: CareerState) {
  return BILLS.map((b) => ({ id: b.id, name: billName(state.gov, b), field: b.field, status: state.gov.bills[b.id].status, work: b.work, progress: state.gov.bills[b.id].progress }));
}

/** 公務：役職ごとの仕事をする */
function doDuty(state: CareerState, world: CareerWorld): string {
  const cat = postCategory(state, world);
  if (cat.startsWith("opp_")) return oppDuty(state, world, cat);
  const D = PL.duties as unknown as Record<string, { exp?: Partial<Exp>; approval?: number; bill_progress?: number; all_progress?: number; cooperation?: number; cohesion?: number; relations?: Partial<Record<RelationId, number>> }>;
  const d = D[cat];
  if (!d) return "";
  const out = applyEffects(state, world, { stamina: PL.duties.stamina, exp: scaleExp(d.exp, expMultiplier(world.player.skills, "duty")), relations: d.relations, approval: d.approval });
  state.activityCounts = { ...state.activityCounts, duty: (state.activityCounts?.duty ?? 0) + 1 };
  const g = state.gov;
  if (d.bill_progress) {
    const field = world.government.find((a) => a.member.id === world.player.id)?.post.field;
    for (const b of BILLS.filter((x) => x.field === field && g.bills[x.id].status === "準備中")) {
      g.bills[b.id].progress += d.bill_progress;
      out.push(`${billName(g, b)}の準備が進んだ`);
    }
  }
  if (d.all_progress) for (const b of BILLS.filter((x) => g.bills[x.id].status === "準備中")) g.bills[b.id].progress += d.all_progress;
  if (d.cooperation) {
    const top = Object.keys(g.cooperation).filter((p) => !g.ruling.partners.includes(p)).sort((a, b) => world.roster.filter((m) => m.party === b).length - world.roster.filter((m) => m.party === a).length)[0];
    if (top) {
      g.cooperation[top] = Math.min(100, g.cooperation[top] + d.cooperation);
      out.push(`${partyById(top).short}との協力度+${d.cooperation}`);
    }
  }
  if (d.cohesion) {
    g.cohesion = Math.min(1, Math.round((g.cohesion + d.cohesion) * 100) / 100);
    out.push(`党の結束${Math.round(g.cohesion * 100)}%`);
  }
  return `公務（${state.post}）：${out.join("、")}`;
}

/** 野党の役職の公務 */
function oppDuty(state: CareerState, world: CareerWorld, cat: string): string {
  const d: OppDuty = cat === "opp_shadow" ? OPP.posts.shadow.duty : (OPP_POSTS.find((p) => p.id === cat)?.duty ?? {});
  const opp = ensureOpp(state, world);
  const out = applyEffects(state, world, {
    stamina: PL.duties.stamina,
    exp: scaleExp(d.exp as Partial<Exp> | undefined, expMultiplier(world.player.skills, "duty")),
    relations: d.relations as Effects["relations"],
  });
  const others = otherOppositionParties(world.roster, world.player.party, state.gov.ruling);
  if (d.coop_top && others.length) {
    const top = [...others].sort((a, b) => world.roster.filter((m) => m.party === b).length - world.roster.filter((m) => m.party === a).length)[0];
    opp.cooperation[top] = Math.min(100, (opp.cooperation[top] ?? 0) + d.coop_top);
    out.push(`${partyById(top).short}との協力度+${d.coop_top}`);
  }
  if (d.coop_all) {
    for (const p of others) opp.cooperation[p] = Math.min(100, (opp.cooperation[p] ?? 0) + d.coop_all);
    out.push(`野党各党との協力度+${d.coop_all}`);
  }
  if (d.proposals) {
    opp.proposals = Math.min(100, opp.proposals + d.proposals);
    out.push(`対案の準備+${d.proposals}`);
  }
  if (d.diet) {
    opp.diet = Math.min(40, opp.diet + d.diet);
    out.push(`不信任案の根回し+${d.diet}`);
  }
  if (d.momentum) {
    opp.momentum = Math.min(OPP.momentum.max, opp.momentum + d.momentum);
    out.push("党に追い風");
  }
  state.activityCounts = { ...state.activityCounts, duty: (state.activityCounts?.duty ?? 0) + 1 };
  return `公務（${state.post}）：${out.join("、")}`;
}

function ensureOpp(state: CareerState, world: CareerWorld): OppositionState {
  state.opp ??= newOppositionState(world.player.party);
  return state.opp;
}

/** プレイヤーが野党の党首か */
export function isOppositionLeader(state: CareerState, world: CareerWorld): boolean {
  const party = world.player.party;
  return state.status === "議員" && state.leaders[party] === world.player.id && isOppositionParty(party, state.gov.ruling);
}

/** 選挙協力を結んだ党を、総選挙の計算に渡す形にする（今も野党どうしのものだけ） */
function currentPacts(state: CareerState, world: CareerWorld): Pact[] {
  const party = world.player.party;
  if (!state.opp || !isOppositionParty(party, state.gov.ruling)) return [];
  return state.opp.pacts.filter((p) => isOppositionParty(p, state.gov.ruling)).map((p) => ({ keep: party, partner: p, transfer: pactTransfer(party, p) }));
}

function partyBonusOf(state: CareerState, world: CareerWorld): Record<string, number> {
  const party = world.player.party;
  return state.opp && isOppositionParty(party, state.gov.ruling) ? { [party]: state.opp.momentum } : {};
}

/** 月末の野党の処理：協力度を基準に戻し、追い風を弱め、党首なら行動の回数を戻して対案を少し準備する */
function oppositionMonth(state: CareerState, world: CareerWorld): void {
  const party = world.player.party;
  if (!isOppositionParty(party, state.gov.ruling)) return;
  const opp = ensureOpp(state, world);
  const D = OPP.cooperation.drift;
  for (const p of Object.keys(opp.cooperation)) {
    const base = initialCooperation(party, p);
    const v = opp.cooperation[p];
    opp.cooperation[p] = v > base ? Math.max(base, v - D) : Math.min(base, v + D);
  }
  opp.momentum = Math.round(opp.momentum * OPP.momentum.decay * 100) / 100;
  if (isOppositionLeader(state, world)) {
    opp.actionPoints = isFirstOpposition(world.roster, party, state.gov.ruling) ? OPP.actions.points_first : OPP.actions.points_other;
    opp.proposals = Math.min(100, opp.proposals + OPP.leader_proposals.per_month);
  } else opp.actionPoints = 0;
}

export type OppActionId = "summit" | "debate" | "pursue" | "proposal" | "pact" | "noconfidence";

export const OPP_ACTIONS: { id: OppActionId; name: string; needsParty?: boolean; description: string }[] = [
  { id: "summit", name: "野党党首会談", needsParty: true, description: "ほかの野党の党首と会い、協力度を上げる。思想が近いほど上がりやすい。" },
  { id: "debate", name: "党首討論", description: "国会の会期中、首相と論戦する。弁舌と政策で上回れば、内閣支持率が下がり自党に追い風。" },
  { id: "pursue", name: "失政の追及", description: "政権の失政や不祥事を追及する。長期政権ほど通りやすいが、失敗すると自分に返ってくる。" },
  { id: "proposal", name: "対案の発表", description: "準備した対案（政調会長がためる）を発表し、政権を担える党だと示す。" },
  { id: "pact", name: "選挙協力の締結", needsParty: true, description: "協力度の高い野党と、小選挙区の候補者を一本化する約束をする。総選挙まで有効。" },
  { id: "noconfidence", name: "内閣不信任案の提出", description: "野党の票と与党の造反で過半数を取れば可決。支持率が高ければ解散、低ければ総辞職になる。" },
];

/** 党首の行動の結果の文（data/game/opposition.json の texts から一つ選ぶ） */
function oppText(state: CareerState, key: string, pm: Member | undefined): string {
  const list = (OPP as unknown as { texts: Record<string, string[]> }).texts[key] ?? [""];
  return list[Math.floor(rand(state) * list.length)].replaceAll("{pm}", pm?.name.displayName ?? "");
}

/** 影の内閣：分野ごとの影の大臣（自分の党が野党のとき。党首と4役職の人を除く） */
export function shadowCabinet(state: CareerState, world: CareerWorld): { field: string; member: Member }[] {
  const party = world.player.party;
  if (!isOppositionParty(party, state.gov.ruling)) return [];
  const taken = new Set<number>([state.leaders[party] ?? -1, ...oppositionLineup(state, world).map((x) => x.member.id)]);
  const out: { field: string; member: Member }[] = [];
  for (const field of TABLES.specialties) {
    // 自分がその分野の影の大臣なら自分
    if (state.oppPost?.field === field) {
      out.push({ field, member: world.player });
      taken.add(world.player.id);
      continue;
    }
    const pool = world.roster.filter((m) => m.party === party && m.id !== world.player.id && !taken.has(m.id) && m.terms >= OPP.posts.shadow.min_terms);
    const pick = pool
      .map((m) => ({ m, s: (m.specialties.includes(field) ? 40 : 0) + m.abilities.政策 + m.terms * 2 }))
      .sort((a, b) => b.s - a.s || a.m.id - b.m.id)[0]?.m;
    if (pick) {
      out.push({ field, member: pick });
      taken.add(pick.id);
    }
  }
  return out;
}

/** 野党の党首の行動を1つ使う */
export function oppAction(state: CareerState, world: CareerWorld, action: OppActionId, arg?: string): TurnResult {
  if (!isOppositionLeader(state, world)) return { ok: false, message: "野党の党首のときだけ使えます。" };
  const opp = ensureOpp(state, world);
  if (opp.actionPoints <= 0) return { ok: false, message: "今月の党首の行動はもう残っていません。" };
  const A = OPP.actions;
  const p = world.player;
  const party = p.party;
  const g = state.gov;
  const others = otherOppositionParties(world.roster, party, g.ruling);
  const pm = world.government.find((a) => a.post.id === "pm")?.member;
  let message = "";
  switch (action) {
    case "summit": {
      if (!arg || !others.includes(arg)) return { ok: false, message: `会談の相手を選んでください（${others.map((x) => partyById(x).short).join("、")}）。` };
      const S = A.summit;
      const dist = partyDistance(party, arg);
      const chance = S.base_chance + (p.abilities.調整 - 50) * S.per_ability - dist * S.per_distance;
      applyEffects(state, world, { stamina: S.stamina });
      if (rand(state) < chance) {
        const gain = Math.round(S.gain + Math.max(0, 3 - dist) * S.gain_per_closeness);
        opp.cooperation[arg] = Math.min(100, (opp.cooperation[arg] ?? 0) + gain);
        message = `${partyById(arg).short}の党首と会談し、協力で一致した（協力度${opp.cooperation[arg]}、+${gain}）。`;
      } else {
        opp.cooperation[arg] = Math.max(0, (opp.cooperation[arg] ?? 0) - S.fail_loss);
        message = `${partyById(arg).short}との会談は、政策の違いが表に出て物別れに終わった（協力度${opp.cooperation[arg]}）。`;
      }
      break;
    }
    case "debate": {
      if (!inSession(state)) return { ok: false, message: "党首討論は国会の会期中だけです。" };
      if (opp.debatedTurn === state.turn) return { ok: false, message: "党首討論は月に1回です。" };
      const D = A.debate;
      const mine = (p.abilities.弁舌 + p.abilities.政策) / 2 + riskBonus(p.skills, "弁舌") / 2;
      const theirs = pm ? (pm.abilities.弁舌 + pm.abilities.政策) / 2 : 50;
      const chance = Math.min(D.max_chance, Math.max(D.min_chance, 0.5 + (mine - theirs) * D.per_diff));
      opp.debatedTurn = state.turn;
      applyEffects(state, world, { stamina: D.stamina });
      if (rand(state) < chance) {
        applyEffects(state, world, { approval: D.win_approval, relations: { press: D.win_press } });
        opp.momentum = Math.min(OPP.momentum.max, opp.momentum + D.win_momentum);
        message = `${oppText(state, "debate_win", pm)}（内閣支持率${D.win_approval}、自党に追い風）`;
      } else {
        applyEffects(state, world, { approval: D.lose_approval });
        opp.momentum = Math.max(-OPP.momentum.max, opp.momentum + D.lose_momentum);
        message = `${oppText(state, opp.proposals < A.proposal.cost ? "debate_lose_unprepared" : "debate_lose", pm)}（内閣支持率+${D.lose_approval}）`;
      }
      break;
    }
    case "pursue": {
      const P = A.pursue;
      if (P.money && state.money < -P.money) return { ok: false, message: `調査の費用（${-P.money}万円）が足りません。` };
      // 直近2か月に政権の不祥事や失言があれば通りやすい
      const recent = g.log.some((l) => l.kind === "出来事" && /疑惑|失言|辞任|便宜/.test(l.text) && g.turn - l.turn <= 2);
      const chance = P.base_chance + (g.fatigue ?? 0) * P.per_fatigue + (p.abilities.政策 - 50) * P.per_ability + (recent ? P.recent_scandal : 0);
      applyEffects(state, world, { stamina: P.stamina, money: P.money });
      if (rand(state) < chance) {
        applyEffects(state, world, { approval: P.win_approval });
        g.cohesion = Math.max(0, Math.round((g.cohesion + P.win_cohesion) * 100) / 100);
        opp.momentum = Math.min(OPP.momentum.max, opp.momentum + P.win_momentum);
        message = `${oppText(state, "pursue_win", pm)}（内閣支持率${P.win_approval}、与党の結束${Math.round(g.cohesion * 100)}%）`;
      } else {
        applyEffects(state, world, { relations: { press: P.lose_press } });
        opp.momentum = Math.max(-OPP.momentum.max, opp.momentum + P.lose_momentum);
        message = oppText(state, "pursue_lose", pm);
      }
      break;
    }
    case "proposal": {
      const P = A.proposal;
      if (opp.proposals < P.cost) return { ok: false, message: `対案の準備が足りません（${opp.proposals}/${P.cost}）。政調会長が毎月ためてくれます。` };
      opp.proposals -= P.cost;
      applyEffects(state, world, { stamina: P.stamina });
      const gain = Math.round(P.momentum * (g.approval >= P.high_approval ? P.high_approval_factor : 1) * 100) / 100;
      opp.momentum = Math.min(OPP.momentum.max, opp.momentum + gain);
      message = `独自の対案を発表した。政権を担える党だと訴えた（自党に追い風+${gain}）。`;
      break;
    }
    case "pact": {
      const P = A.pact;
      if (!arg || !others.includes(arg)) return { ok: false, message: "選挙協力の相手を選んでください。" };
      if (opp.pacts.includes(arg)) return { ok: false, message: `${partyById(arg).short}とはもう選挙協力を結んでいます。` };
      if ((opp.cooperation[arg] ?? 0) < P.min_cooperation) return { ok: false, message: `協力度が${P.min_cooperation}以上の党とだけ結べます（今は${opp.cooperation[arg] ?? 0}）。` };
      const t = g.termEnd;
      const monthsLeft = (t.year - state.year) * 12 + (t.month - state.month);
      if (monthsLeft > P.months_before) return { ok: false, message: `選挙協力は、任期満了まで${P.months_before}か月を切ってから結べます（あと${monthsLeft}か月）。` };
      if (rand(state) < ((opp.cooperation[arg] ?? 0) - 50) * P.chance_per_cooperation) {
        opp.pacts.push(arg);
        message = `${partyById(arg).short}と選挙協力を結んだ。小選挙区では候補者を一本化する（票の移り方 ${Math.round(pactTransfer(party, arg) * 100)}%）。`;
      } else {
        opp.cooperation[arg] = Math.max(0, (opp.cooperation[arg] ?? 0) - P.fail_loss);
        message = `${partyById(arg).short}との選挙協力の協議は、候補者の調整で折り合わなかった。`;
      }
      break;
    }
    case "noconfidence": {
      const N = A.noconfidence;
      if (opp.lastNoConfidence !== undefined && state.turn - opp.lastNoConfidence < N.cooldown_months)
        return { ok: false, message: `不信任案は${N.cooldown_months}か月に1回までです。` };
      opp.lastNoConfidence = state.turn;
      const r = countNoConfidence(world.roster, { party, ruling: g.ruling, cooperation: opp.cooperation, govCooperation: g.cooperation, cohesion: g.cohesion, approval: g.approval, diet: opp.diet }, () => rand(state));
      opp.diet = 0;
      if (r.passed) {
        opp.noConfidencePassed = true;
        opp.momentum = Math.min(OPP.momentum.max, opp.momentum + N.win_momentum);
        message = `内閣不信任案を提出し、賛成${r.yes}・反対${r.no}で可決された！（与党からの造反${r.defectors}人）。月末に内閣の進退が決まる。`;
        log(state, message, "major");
      } else {
        opp.momentum = Math.max(-OPP.momentum.max, opp.momentum + N.lose_momentum);
        for (const o of others) if ((r.byParty[o] ?? 0) * 2 < world.roster.filter((m) => m.party === o).length) opp.cooperation[o] = Math.max(0, (opp.cooperation[o] ?? 0) - N.lose_cooperation);
        message = `内閣不信任案を提出したが、賛成${r.yes}・反対${r.no}で否決された（与党からの造反${r.defectors}人）。`;
      }
      break;
    }
    default:
      return { ok: false, message: "その行動はありません。" };
  }
  opp.actionPoints--;
  if (action !== "noconfidence") log(state, message);
  return { ok: true, message };
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
    skills: startingSkills(setup.archetype, setup.origin),
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
    eventHistory: {},
    relations,
    status: "候補",
    post: "",
    gov: createGame(seed, { roster: base.roster, government: base.government }),
    log: [],
    elections: [],
    leaders: initialLeaders(base.roster, base.government),
    leaderTermEnd: { ...PL.leader.first_term_end },
    runForLeader: false,
    lowApprovalMonths: 0,
    dissolveRequested: false,
    achievements: [],
    pmMonths: 0,
    leaderTermsServed: 1,
    pmSince: START_YEAR - 1,
    playerLeaderTerms: 0,
    rulingSince: START_YEAR - PL.fatigue.initial_years,
    rngCounter: 0,
    activityCounts: {},
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
  const U = C.upgrade;
  const mult = Math.max(0.6, 1 + (v - 40) / U.slope) * (v >= U.high ? U.high_mult : 1);
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
export function raceForecast(
  state: CareerState,
  world: CareerWorld,
): { name: string; party: string; share: number; isPlayer: boolean; memberId?: number; incumbent: boolean }[] {
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
  return estimateDistrict(pref, state.gov.approval, entries, state.gov.ruling, { bonus: partyBonusOf(state, world), pacts: currentPacts(state, world) })
    .map((e) => ({
      name: e.member ? e.member.name.displayName : `${partyById(e.party).short}の候補`,
      party: e.party,
      share: e.share,
      isPlayer: e.member?.id === world.player.id,
      memberId: e.member?.id,
      incumbent: !!e.member && e.member.seat === "小選挙区" && e.member.district === pref,
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
    ((state.relations.kengi - 50) / 50) * C.kengi.election_weight +
    ((state.relations.press - 50) / 50) * C.relation_effects.press_weight -
    (B.origin_penalty as Record<OriginId, number>)[state.setup.origin] -
    (state.setup.route === "successor" ? C.routes.successor_penalty : 0)
  );
}

// ---- 1か月の流れ ----

export interface TurnResult {
  ok: boolean;
  message: string;
  /** 動いた数値の一覧（出来事の結果で、画面に札として出す） */
  changes?: string[];
}

/** 活動や出来事で得る経験点などの倍率。やる気と、秘書との関係（段取りのよさ）で決まる */
function gainMultiplier(state: CareerState): number {
  const S = C.relation_effects.secretary;
  return C.mood_multiplier[state.mood - 1] * (S.min + ((S.max - S.min) * state.relations.secretary) / 100);
}

function applyEffects(state: CareerState, world: CareerWorld, e: Effects): string[] {
  const out: string[] = [];
  const mult = gainMultiplier(state);
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
  for (const [k, n] of Object.entries(e.relations ?? {})) {
    // 関係が上がるときは特殊能力（根回しの鬼、調整下手など）の倍率がかかる
    const v = (n as number) > 0 ? Math.round((n as number) * relationMultiplier(world.player.skills, k)) : (n as number);
    state.relations[k as RelationId] = clamp(state.relations[k as RelationId] + v, 0, 100);
    if (v) out.push(`${RELATIONS.find((r) => r.id === k)?.name ?? k}${v > 0 ? "+" : ""}${v}`);
  }
  if (e.money) {
    state.money = Math.max(0, state.money + e.money);
    out.push(`資金${e.money >= 0 ? "+" : ""}${e.money}万円`);
  }
  if (e.mood) state.mood = clamp(state.mood + e.mood, 1, 5);
  if (e.approval) {
    state.gov.approval = clamp(Math.round((state.gov.approval + e.approval) * 10) / 10, 1, 90);
    out.push(`内閣支持率${e.approval >= 0 ? "+" : ""}${e.approval}`);
  }
  for (const [k, n] of Object.entries(e.abilities ?? {})) {
    setPlayer(world, { ...world.player, abilities: { ...world.player.abilities, [k]: clamp(world.player.abilities[k as Ability] + (n as number), 1, 100) } });
    out.push(`${k}+${n}`);
  }
  if (e.jiban_progress) addJibanProgress(state, world, Math.round(e.jiban_progress * mult * (e.jiban_progress > 0 ? jibanMultiplier(world.player.skills) : 1)), out);
  for (const id of e.skills_add ?? []) {
    const sk = skillById(id);
    if (sk && !world.player.skills.includes(id)) {
      setPlayer(world, { ...world.player, skills: [...world.player.skills.filter((x) => !sk.replaces?.includes(x)), id] });
      out.push(`特殊能力「${sk.name}」を身につけた`);
    }
  }
  for (const id of e.skills_remove ?? []) {
    const sk = skillById(id);
    if (sk && world.player.skills.includes(id)) {
      setPlayer(world, { ...world.player, skills: world.player.skills.filter((x) => x !== id) });
      out.push(`特殊能力「${sk.name}」が外れた`);
    }
  }
  return out;
}

interface FlavorLine {
  text: string;
  months?: number[];
  status?: string[];
  jiban?: "low" | "high";
}

/** 活動のあとに出す短い文（data/game/activity_flavor.json）。今の月、立場、地盤の固さに合うものから選ぶ */
function flavorLine(state: CareerState, world: CareerWorld, activity: string): string | undefined {
  const all = ((flavorRaw as unknown as { lines: Record<string, FlavorLine[]> }).lines[activity] ?? []).filter(
    (l) =>
      (!l.months || l.months.includes(state.month)) &&
      (!l.status || l.status.includes(state.status)) &&
      (!l.jiban || (l.jiban === "high") === world.player.jiban >= 3),
  );
  if (!all.length) return undefined;
  // 条件付きの文（季節、立場、地盤）は、合うときにはやや出やすくする
  const weights = all.map((l) => (l.months || l.status || l.jiban ? 2 : 1));
  let r = rand(state) * weights.reduce((a, b) => a + b, 0);
  const pick = all.find((_, i) => (r -= weights[i]) <= 0) ?? all[0];
  return pick.text.replaceAll("{secretary}", state.secretaryName);
}

/** 条件を満たした特殊能力を身につけ、条件を満たした欠点を外す */
function checkSkills(state: CareerState, world: CareerWorld): void {
  const p = world.player;
  const r = updateSkills(p.skills, { activityCounts: state.activityCounts ?? {}, abilities: p.abilities, terms: p.terms, jiban: p.jiban });
  if (!r.gained.length && !r.lost.length) return;
  setPlayer(world, { ...p, skills: r.skills });
  if (state.skillHints) for (const g of r.gained) delete state.skillHints[g.id];
  for (const g of r.gained) log(state, `特殊能力「${g.name}」を身につけた！ ${g.description}`);
  for (const l of r.lost) log(state, l.color === "red" ? `欠点「${l.name}」を克服した。` : `特殊能力「${l.name}」は上位の能力に置き換わった。`);
}

/** 活動の経験点に特殊能力の倍率をかける */
function scaleExp(exp: Partial<Exp> | undefined, factor: number): Partial<Exp> | undefined {
  if (!exp || factor === 1) return exp;
  return Object.fromEntries(Object.entries(exp).map(([k, v]) => [k, Math.round((v as number) * factor)])) as Partial<Exp>;
}

function addJibanProgress(state: CareerState, world: CareerWorld, amount: number, out: string[]): void {
  if (amount > 0) state.jibanTouched = true;
  // 地盤が最大（4）なら進み具合はためない
  if (world.player.jiban >= 4) {
    state.jibanProgress = 0;
    return;
  }
  state.jibanProgress = Math.max(0, state.jibanProgress + amount);
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
  if (activityId === "duty") {
    if (!postCategory(state, world)) return { ok: false, message: "公務は役職に就いているときだけできます。" };
    const message = doDuty(state, world);
    log(state, message, "minor");
    await endMonth(state, world);
    return { ok: true, message };
  }
  const act = ACTIVITIES.find((a) => a.id === activityId);
  if (!act) return { ok: false, message: "その活動はありません。" };
  let message: string;
  // 体力が少ないまま無理をすると倒れることがある
  if (act.stamina < 0 && state.stamina < C.low_stamina.threshold && rand(state) < breakdownChance(state.stamina)) {
    state.stamina = clamp(state.stamina + 10, 0, state.maxStamina);
    state.mood = clamp(state.mood - 1, 1, 5);
    message = `${act.name}の途中で体調を崩し、寝込んでしまった。`;
  } else {
    const sk = world.player.skills;
    const gained = applyEffects(state, world, {
      stamina: act.stamina < 0 ? Math.round(act.stamina * staminaMultiplier(sk)) : act.stamina,
      max_stamina: act.max_stamina,
      exp: scaleExp(act.exp, expMultiplier(sk, act.id)),
      relations: act.relations,
      jiban_progress: act.jiban_progress,
    });
    if (act.money_per_ability) {
      const m = Math.round(world.player.abilities.資金 * act.money_per_ability * gainMultiplier(state) * moneyMultiplier(sk));
      state.money += m;
      gained.push(`資金+${m}万円`);
    }
    if (act.mood_up_chance && rand(state) < act.mood_up_chance) {
      state.mood = clamp(state.mood + 1, 1, 5);
      gained.push("やる気が上がった");
    }
    const scene = flavorLine(state, world, act.id);
    const nums = gained.join("、") || "体力が戻った";
    message = scene ? `${act.name}：${scene}（${nums}）` : `${act.name}：${nums}`;
    // 欠点の特殊能力による失敗（失言癖など）
    for (const { skill, mishap } of mishapsFor(sk, act.id)) {
      if (rand(state) >= mishap.chance) continue;
      const lost = applyEffects(state, world, mishap.effects as Effects);
      message += `。【${skill.name}】${mishap.text}${lost.length ? `（${lost.join("、")}）` : ""}`;
    }
  }
  state.activityCounts = { ...state.activityCounts, [act.id]: (state.activityCounts?.[act.id] ?? 0) + 1 };
  // その活動で身につく特殊能力のコツを、ときどきつかむ
  const hints = state.skillHints ?? {};
  const pl = world.player;
  const hintCtx = { activityCounts: state.activityCounts ?? {}, abilities: pl.abilities, terms: pl.terms, jiban: pl.jiban };
  const candidates = hintCandidates(world.player.skills, act.id, hints).filter((sk) => meetsExceptActivity(sk.acquire, hintCtx));
  if (candidates.length && rand(state) < HINTS.chance) {
    const sk = candidates[Math.floor(rand(state) * candidates.length)];
    state.skillHints = { ...hints, [sk.id]: (hints[sk.id] ?? 0) + 1 };
    message += `。【コツ】「${sk.name}」のコツをつかんだ（Lv${state.skillHints[sk.id]}）`;
  }
  log(state, message, "minor");
  await endMonth(state, world);
  return { ok: true, message };
}

/** コツのある特殊能力を、経験点を払って覚えられるか（理由つき） */
export function canLearnSkill(state: CareerState, world: CareerWorld, id: string): { ok: boolean; reason?: string; cost?: Record<string, number> } {
  const sk = skillById(id);
  const level = state.skillHints?.[id] ?? 0;
  if (!sk?.learn) return { ok: false, reason: "コツで覚えられる特殊能力ではありません。" };
  if (world.player.skills.includes(id) || superseded(world.player.skills, id)) return { ok: false, reason: "もう持っています。" };
  if (level < 1) return { ok: false, reason: "まだコツをつかんでいません。" };
  const p = world.player;
  if (!meetsExceptActivity(sk.acquire, { activityCounts: state.activityCounts ?? {}, abilities: p.abilities, terms: p.terms, jiban: p.jiban }))
    return { ok: false, reason: "能力、当選回数、地盤の条件を満たしていません。" };
  const cost = learnCost(sk, level);
  if (Object.entries(cost).some(([k, n]) => state.exp[k as ExpId] < n)) return { ok: false, reason: "経験点が足りません。", cost };
  return { ok: true, cost };
}

export function learnSkill(state: CareerState, world: CareerWorld, id: string): TurnResult {
  const r = canLearnSkill(state, world, id);
  if (!r.ok) return { ok: false, message: r.reason ?? "" };
  const sk = skillById(id)!;
  for (const [k, n] of Object.entries(r.cost ?? {})) state.exp[k as ExpId] -= n;
  setPlayer(world, { ...world.player, skills: [...world.player.skills.filter((x) => !sk.replaces?.includes(x)), id] });
  const rest = { ...state.skillHints };
  delete rest[id];
  state.skillHints = rest;
  log(state, `コツを生かして、特殊能力「${sk.name}」を身につけた！`);
  return { ok: true, message: `特殊能力「${sk.name}」を身につけた！` };
}

/** 体力を使う活動で倒れる確率。体力が threshold を切ると breakdown_chance で、0に近づくほど上がり、0なら必ず倒れる */
export function breakdownChance(stamina: number): number {
  const L = C.low_stamina;
  if (stamina >= L.threshold) return 0;
  return L.breakdown_chance + (1 - L.breakdown_chance) * (1 - Math.max(0, stamina) / L.threshold);
}

/** 総選挙の結果に添える、自分と相手の一言（画面と CLI で同じものを出す） */
export function electionComments(e: ElectionSummary): { self: string; rival?: { name: string; party: string; won: boolean; text: string } } {
  const seed = e.year + e.month;
  const pick = (list: string[] | undefined, n: number) => (list?.length ? list[n % list.length] : "");
  const others = e.district.filter((x) => !x.isPlayer);
  // 自分が勝てば2位の相手、負ければ当選した相手
  const rival = e.won ? others[0] : others.reduce<(typeof others)[number] | undefined>((a, x) => (!a || x.share > a.share ? x : a), undefined);
  return {
    self: pick(e.won ? ELECTION_LINES.won_self : ELECTION_LINES.lost_self, seed),
    rival: rival ? { name: rival.name, party: rival.party, won: !e.won, text: pick(e.won ? ELECTION_LINES.won_rival : ELECTION_LINES.lost_rival, seed + 1) } : undefined,
  };
}

/** 出来事の選択肢を選ぶ（index は0から） */
export function chooseEvent(state: CareerState, world: CareerWorld, index: number): TurnResult {
  const pe = state.pendingEvent;
  if (!pe) return { ok: false, message: "選ぶ出来事はありません。" };
  const ev = LIFE_EVENTS.find((e) => e.id === pe.id)!;
  const choice = ev.choices[index];
  if (!choice) return { ok: false, message: `選択肢は1〜${ev.choices.length}です。` };
  const failed = choice.risk && world.player.abilities[choice.risk.ability] + riskBonus(world.player.skills, choice.risk.ability) < choice.risk.threshold;
  const eff = failed ? choice.risk!.fail_effects : choice.effects;
  const changes = applyEffects(state, world, eff);
  if (eff.stamina) changes.unshift(`体力${eff.stamina > 0 ? "+" : ""}${eff.stamina}`);
  if (eff.mood) changes.push(eff.mood > 0 ? "やる気が上がった" : "やる気が下がった");
  const result = failed ? choice.risk!.fail_result : choice.result;
  const text = `${pe.title}：${choice.label} → ${result.replaceAll("{secretary}", state.secretaryName)}${changes.length ? `（${changes.join("、")}）` : ""}`;
  log(state, text);
  state.pendingEvent = undefined;
  return { ok: true, message: text, changes };
}

function maybeLifeEvent(state: CareerState, world: CareerWorld): void {
  if (rand(state) >= lifeRaw.chance) return;
  const kind = postKind(postCategory(state, world));
  const pool = LIFE_EVENTS.filter((e) => {
    if (e.status && !e.status.includes(state.status)) return false;
    if (e.post && !e.post.includes(kind)) return false;
    if (e.months && !e.months.includes(state.month)) return false;
    const h = state.eventHistory[e.id];
    if (!h) return true;
    if (e.once) return false;
    return state.turn - h.last >= C.event_cooldown_months;
  });
  if (!pool.length) return;
  const total = pool.reduce((a, e) => a + e.weight, 0);
  let r = rand(state) * total;
  const ev = pool.find((e) => (r -= e.weight) <= 0) ?? pool[0];
  const h = state.eventHistory[ev.id];
  state.eventHistory[ev.id] = { last: state.turn, count: (h?.count ?? 0) + 1 };
  state.pendingEvent = {
    id: ev.id,
    title: ev.title,
    text: ev.text.replaceAll("{secretary}", state.secretaryName),
    choices: ev.choices.map((c) => c.label.replaceAll("{secretary}", state.secretaryName)),
  };
}

async function endMonth(state: CareerState, world: CareerWorld): Promise<void> {
  const politicsBefore = snapshotPolitics(state, world);
  // 事務所の経費。資金が尽きるとやる気が下がる
  state.money -= (C.monthly_expense as Record<CareerState["status"], number>)[state.status];
  if (state.money < 0) {
    state.money = 0;
    state.mood = clamp(state.mood - 1, 1, 5);
    log(state, "資金が尽き、事務所の家賃の支払いに困った。", "minor");
  }
  // 関係は放っておくと基準の値に少しずつ戻る
  const D = C.relation_drift;
  for (const r of RELATIONS) {
    const v = state.relations[r.id];
    state.relations[r.id] = v > D.base ? Math.max(D.base, v - D.step) : Math.min(D.base, v + D.step);
  }
  // 県議団との関係が深いと、県議が地元を固めてくれる
  if (state.relations.kengi >= C.kengi.threshold) addJibanProgress(state, world, C.kengi.passive_jiban, []);
  // 地盤は放っておくと緩む。進み具合は毎月少しずつ減り（0より下にはならない）、
  // 地盤を固める活動をしない月が続くと地盤が1段下がる
  state.jibanProgress = Math.max(0, state.jibanProgress - C.jiban_decay);
  state.jibanNeglect = state.jibanTouched ? 0 : state.jibanNeglect + 1;
  state.jibanTouched = false;
  if (state.jibanNeglect >= C.jiban_neglect_months + neglectShift(world.player.skills) && world.player.jiban > 1) {
    setPlayer(world, { ...world.player, jiban: world.player.jiban - 1 });
    state.jibanNeglect = 0;
    log(state, `地元に顔を出さない日が続き、地盤が${world.player.jiban}に下がった。`);
  }
  checkSkills(state, world);
  // 政権：プレイヤーが首相なら自分で行動を選んでいる。そうでなければ AI が動かす
  state.gov.fatigue = fatigueOf(state);
  const pm = isPrimeMinister(state, world);
  if (pm) state.pmMonths++;
  const ctx = { roster: world.roster, government: world.government };
  if (!pm) aiGovernmentActions(state.gov, ctx);
  endTurn(state.gov, ctx);
  state.gov.scenes = [];
  copyGovLog(state);
  const g = state.gov;
  // 野党の党首が出した不信任案が可決されていれば、AI の不信任案と同じように内閣の進退を決める
  if (state.opp?.noConfidencePassed) {
    state.opp.noConfidencePassed = false;
    g.over ??= "内閣不信任案が可決された";
  }
  const termEnded = g.over?.startsWith("任期満了") ?? false;
  let dissolve = false;
  if (g.over && !termEnded) {
    // 内閣不信任案の可決。支持率が高ければ解散、低ければ総辞職して党首選で次の首相を選ぶ（プレイヤーの首相は解散する）
    g.over = undefined;
    if (pm || g.approval >= PL.pm.dissolve_approval) {
      dissolve = true;
      logGov(state, "内閣不信任案が可決され、首相は衆議院を解散した。", "major");
    } else {
      logGov(state, "内閣不信任案が可決され、内閣は総辞職した。", "major");
      runLeaderElection(state, world, g.ruling.party, "内閣総辞職", true);
    }
  }
  // AI の首相は、支持率の低迷が続くと辞任する
  if (!pm && !dissolve && !termEnded) {
    state.lowApprovalMonths = g.approval < PL.pm.resign_approval ? state.lowApprovalMonths + 1 : 0;
    if (state.lowApprovalMonths >= PL.pm.resign_months) {
      state.lowApprovalMonths = 0;
      logGov(state, `支持率の低迷（${g.approval}%）が続き、首相が辞任を表明した。`, "major");
      runLeaderElection(state, world, g.ruling.party, "首相の辞任", true);
    }
  }
  // 与党の党首の任期切れ
  if (!dissolve && !termEnded && reached(state, state.leaderTermEnd)) runLeaderElection(state, world, g.ruling.party, "任期満了", true);
  if (state.dissolveRequested) {
    state.dissolveRequested = false;
    dissolve = true;
    log(state, `首相として衆議院を解散した（内閣支持率${g.approval}%）。`);
  } else if (!pm && !dissolve && !termEnded && aiWantsDissolution(g, rand(state))) {
    dissolve = true;
    logGov(state, `首相が衆議院を解散した（内閣支持率${g.approval}%）。`, "major");
  }
  if (termEnded || dissolve) {
    if (termEnded) logGov(state, "衆議院議員の任期が満了した。", "major");
    await holdElection(state, world);
  } else {
    maybeLifeEvent(state, world);
  }
  oppositionMonth(state, world);
  // 野党の人事は年に1回見直す
  if (state.month === OPP.posts.reshuffle_month && isOppositionParty(world.player.party, state.gov.ruling)) updatePost(state, world);
  detectHighlights(state, world, politicsBefore);
  const share = state.setup.route === "pr" || state.over ? undefined : raceForecast(state, world).find((x) => x.isPlayer)?.share;
  state.history = [...(state.history ?? []), { turn: state.turn, approval: state.gov.approval, money: state.money, share }].slice(-6);
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
  const pmYears = state.pmMonths ? `、首相在任${Math.floor(state.pmMonths / 12)}年${state.pmMonths % 12}か月` : "";
  state.over = `政界を引退した（${age}歳、${years}年）。総選挙${state.elections.length}回で当選${wins}回${pmYears}${state.post ? `、最後の役職は${state.post}` : ""}。`;
  state.pendingEvent = undefined;
  log(state, state.over);
}

async function holdElection(state: CareerState, world: CareerWorld): Promise<void> {
  const route = state.setup.route;
  const isPr = route === "pr";
  const rank = isPr ? prRank(state) : 0;
  const prevSeats = Object.entries(world.roster.reduce<Record<string, number>>((acc, m) => ((acc[m.party] = (acc[m.party] ?? 0) + 1), acc), {})).map(([party, total]) => ({ party, total }));
  const last = state.elections.at(-1);
  const prevShare = !isPr && last && last.route !== "pr" ? last.district.find((x) => x.isPlayer)?.share : undefined;
  const result = await runElection({
    year: state.year,
    month: state.month,
    roster: world.roster,
    ronin: world.ronin.filter((m) => m.id !== world.player.id),
    approval: state.gov.approval,
    ruling: state.gov.ruling,
    factory: world.factory,
    forced: isPr ? [] : [{ pref: state.setup.pref, party: state.setup.party, member: world.player, bonus: playerBonus(state) }],
    partyBonus: partyBonusOf(state, world),
    pacts: currentPacts(state, world),
    forcedPr: isPr ? [{ party: state.setup.party, member: world.player, rank }] : [],
    retireIds: state.parentId !== undefined ? [state.parentId] : [],
  });
  // 選挙費用
  const cost = Math.min(state.money, C.election_cost.max);
  state.money -= cost;
  if (cost > 0) log(state, `選挙費用に${cost}万円を使った。`, "minor");
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
    prevSeats,
    prevShare,
  } satisfies ElectionSummary;
  state.elections.push(summary);
  // 選挙協力は選挙ごとに結び直す。追い風は弱まる
  if (state.opp) {
    if (state.opp.pacts.length) log(state, `選挙協力（${state.opp.pacts.map((x) => partyById(x).short).join("、")}）で、小選挙区の候補者を一本化して戦った。`);
    state.opp.pacts = [];
    state.opp.momentum = Math.round(state.opp.momentum * OPP.momentum.after_election * 100) / 100;
  }
  world.roster = result.roster;
  world.ronin = result.ronin.filter((m) => m.id !== world.player.id);
  const first = state.elections.length === 1;
  if (me) {
    world.player = me;
    state.status = "議員";
    const how = isPr ? `比例名簿${rank + 1}位（党の比例当選${prSeats}人）` : `得票率${pct(d!.candidates.find((c) => c.member.id === me.id)!.share)}`;
    log(state, `${me.terms === 1 ? "初当選" : `${me.terms}回目の当選`}！ ${how}で${partyById(state.setup.party).name}の衆議院議員になった。`, "major");
    // 後継の道で当選したら、次からは自分の選挙区の現職として戦う
    if (route === "successor") state.setup = { ...state.setup, route: "smd" };
  } else {
    world.player = { ...world.player, seat: "なし", district: null };
    state.status = "浪人";
    const how = isPr ? `比例名簿${rank + 1}位で、党の比例当選${prSeats}人に届かなかった` : `得票率${pct(d!.candidates.find((c) => c.member.id === world.player.id)!.share)}で${d!.winner.name.displayName}（${partyById(d!.winner.party).short}）に敗れた`;
    log(state, `落選。${how}。浪人として次の選挙を目指す。`, "major");
    if (route === "successor") state.setup = { ...state.setup, route: "smd" };
  }
  if (first) state.parentId = undefined;
  if (me && me.terms === 1) state.achievements.push(`${dateOf(state)} 初当選`);
  // 連立を組み直す（政権交代もありうる）
  const prev = state.gov.ruling;
  const coalition = formCoalition(world.roster, prev);
  logGov(state, coalition.text, "major");
  // 党首の入れ替え：政権を失った党と、党首が議席を失った党は党首選をする
  state.gov.ruling = coalition.ruling;
  for (const party of Object.keys(state.leaders)) if (!world.roster.some((m) => m.party === party)) delete state.leaders[party];
  for (const party of new Set(world.roster.map((m) => m.party))) {
    if (partyById(party).is_independent) continue;
    const lostPower = coalition.changed && party === prev.party;
    const leaderLost = !world.roster.some((m) => m.id === state.leaders[party]);
    if (lostPower || leaderLost) runLeaderElection(state, world, party, lostPower ? "政権を失って" : "党首の落選", false);
  }
  if (coalition.changed) {
    state.leaderTermEnd = addMonths(state, PL.leader.term_months);
    state.leaderTermsServed = 1;
    state.rulingSince = state.year;
    state.pmSince = state.year;
    if (state.leaders[coalition.ruling.party] === world.player.id) state.playerLeaderTerms++;
    const pmName = world.roster.find((m) => m.id === state.leaders[coalition.ruling.party])?.name.displayName ?? "";
    logGov(state, `${describeRuling(coalition.ruling)}の連立政権が発足し、${pmName}が首相に就いた。`);
  }
  // 内閣を組み直す。プレイヤーが役職に就くこともある
  rebuildGovernment(state, world, coalition.ruling);
  state.gov = createGame(state.seed + state.elections.length * 7919, { roster: world.roster, government: world.government }, {
    year: state.year,
    month: state.month,
    termEnd: { year: state.year + 4, month: state.month },
    quiet: true,
    ruling: coalition.ruling,
    approval: coalition.changed ? 45 : undefined,
  });
  state.gov.scenes = [];
  state.gov.fatigue = fatigueOf(state);
  state.govLogCopied = state.gov.log.length;
}

/** 政権の記録のうち新しいものを、政局の記録として自分の記録に写す（総選挙で政権の状態が作り直されても残るように） */
function copyGovLog(state: CareerState): void {
  const from = state.govLogCopied ?? 0;
  const batch = new Map<string, CareerLog>();
  for (const e of state.gov.log.slice(from)) {
    // 任期満了は月末の処理で自分の記録に書くので、政権の記録からは写さない（同じ月に二重に出ないように）
    if (e.text.startsWith("衆議院議員の任期が満了した")) continue;
    // 政権の行動（記者会見、協議、根回し、法案の準備）は細かい動きとして扱う
    const level: CareerLog["level"] = e.kind === "行動" ? "minor" : undefined;
    // 数字と括弧の中を除いた文が同じなら、同じ種類の動きとしてまとめる
    const key = e.text.replace(/（[^）]*）/g, "").replace(/[0-9.]+/g, "#");
    const same = level === "minor" ? batch.get(key) : undefined;
    if (same) {
      same.count = (same.count ?? 1) + 1;
      continue;
    }
    const entry: CareerLog = { turn: state.turn, date: e.date, text: e.text, kind: "gov", ...(level ? { level } : {}) };
    state.log.push(entry);
    batch.set(key, entry);
  }
  state.govLogCopied = state.gov.log.length;
}

// ---- 山場の場面 ----

type HighlightDef = { title: string; text: string; variants: { speaker: string; text: string }[][] };
const HL = highlightsRaw as unknown as { scenes: Record<string, HighlightDef>; election_lines: Record<string, string[]> };

/** 総選挙の結果に添える一言の文 */
export const ELECTION_LINES = HL.election_lines;

interface MonthSnapshot {
  ruling: string;
  pm?: Member;
  post: string;
  leader?: number;
}

function snapshotPolitics(state: CareerState, world: CareerWorld): MonthSnapshot {
  return { ruling: state.gov.ruling.party, pm: world.government.find((a) => a.post.id === "pm")?.member, post: state.post, leader: state.leaders[state.setup.party] };
}

function pushHighlight(state: CareerState, world: CareerWorld, kind: string, vars: Record<string, string>, people: { old_pm?: Member; new_pm?: Member }): void {
  const def = HL.scenes[kind];
  if (!def) return;
  const fill = (t: string) => t.replace(/\{(\w+)\}/g, (_, k: string) => vars[k] ?? (k === "secretary" ? state.secretaryName : ""));
  const variant = def.variants[Math.floor(rand(state) * def.variants.length)] ?? [];
  const pmNow = world.government.find((a) => a.post.id === "pm")?.member;
  const who = (m: Member | undefined, role: string) => ({ name: m?.name.displayName ?? "", role: m ? role : "", party: m?.party });
  const lines = variant.map((l) => {
    const text = fill(l.text);
    switch (l.speaker) {
      case "old_pm":
        return { ...who(people.old_pm, "前首相"), text };
      case "new_pm":
        return { ...who(people.new_pm, "首相"), text };
      case "pm":
        return { ...who(pmNow, "首相"), text };
      case "secretary":
        return { name: state.secretaryName, role: "秘書", text };
      default:
        return { name: "", role: "", text };
    }
  });
  const text = fill(def.text);
  state.highlights = [...(state.highlights ?? []), { turn: state.turn, kind, title: def.title, text, lines }].slice(-20);
  log(state, `【${def.title}】${text}`, "major");
}

/** 月のはじめと終わりを見比べて、政権交代、首相交代、自分の就任があれば場面にする */
function detectHighlights(state: CareerState, world: CareerWorld, before: MonthSnapshot): void {
  const after = snapshotPolitics(state, world);
  const playerId = world.player.id;
  const vars = {
    old: partyById(before.ruling).short,
    new: partyById(after.ruling).short,
    old_pm: before.pm?.name.displayName ?? "",
    new_pm: after.pm?.name.displayName ?? "",
    post: state.post,
    party: partyById(state.setup.party).short,
  };
  const people = { old_pm: before.pm, new_pm: after.pm };
  if (after.ruling !== before.ruling) pushHighlight(state, world, "ruling_change", vars, people);
  else if (after.pm && before.pm && after.pm.id !== before.pm.id && after.pm.id !== playerId) pushHighlight(state, world, "pm_change", vars, people);
  if (after.pm?.id === playerId && before.pm?.id !== playerId) pushHighlight(state, world, "player_pm", vars, people);
  else if (state.post && state.post !== before.post && after.pm?.id !== playerId && after.leader !== playerId) pushHighlight(state, world, "player_post", vars, people);
  if (after.leader === playerId && before.leader !== playerId && after.pm?.id !== playerId) pushHighlight(state, world, "player_leader", vars, people);
}

const pct = (x: number) => `${Math.round(x * 1000) / 10}%`;

// ---- 表示用のまとめ ----

/** 画面や CLI に出す、今の状態の要約 */
/** 資金の見通し：毎月の経費、今の資金で経費を払える月数、任期満了までの月数、選挙費用の上限 */
export function moneyOutlook(state: CareerState): { expense: number; monthsLeft: number; monthsToElection: number; electionCost: number } {
  const expense = (C.monthly_expense as Record<CareerState["status"], number>)[state.status];
  const t = state.gov.termEnd;
  return {
    expense,
    monthsLeft: Math.floor(state.money / expense),
    monthsToElection: Math.max(0, (t.year - state.year) * 12 + (t.month - state.month)),
    electionCost: C.election_cost.max,
  };
}

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
    jibanProgress: p.jiban >= 4 ? "最大" : `${state.jibanProgress}/${C.jiban_step[p.jiban]}`,
    abilities: p.abilities,
    skills: p.skills,
    skillHints: state.skillHints ?? {},
    opposition: isOppositionParty(p.party, state.gov.ruling)
      ? {
          isLeader: isOppositionLeader(state, world),
          actionPoints: state.opp?.actionPoints ?? 0,
          cooperation: (state.opp ?? newOppositionState(p.party)).cooperation,
          pacts: state.opp?.pacts ?? [],
          momentum: state.opp?.momentum ?? 0,
          proposals: state.opp?.proposals ?? 0,
        }
      : undefined,
    exp: state.exp,
    relations: state.relations,
    approval: state.gov.approval,
    ruling: describeRuling(state.gov.ruling),
    partyLeader: world.roster.find((m) => m.id === state.leaders[state.setup.party])?.name.displayName ?? (state.leaders[state.setup.party] === world.player.id ? p.name.displayName : ""),
    primeMinister: world.government.find((a) => a.post.id === "pm")?.member.name.displayName ?? "",
    isPrimeMinister: isPrimeMinister(state, world),
    canDuty: !!postCategory(state, world),
    canRunForLeader: canRunForLeader(state, world),
    runForLeader: state.runForLeader,
    leaderElection: `${state.leaderTermEnd.year}年${state.leaderTermEnd.month}月（与党の党首の任期切れ）`,
    actionPoints: isPrimeMinister(state, world) ? state.gov.actionPoints : undefined,
    achievements: state.achievements,
    nextElection: `${state.gov.termEnd.year}年${state.gov.termEnd.month}月（解散があれば早まる）`,
    prRank: state.setup.route === "pr" ? prRank(state) + 1 : undefined,
    forecast: raceForecast(state, world).map((f) => ({ ...f, share: pct(f.share) })),
    pendingEvent: state.pendingEvent,
    over: state.over,
  };
}
