// ターンの流れ（1ターン＝1か月）。設計は docs/design.md の「ターンの流れ」。
// 状態（GameState）は JSON にそのまま保存できる形にし、名簿と内閣は別に渡す（GameContext）。
import rulesRaw from "../../data/game/rules.json";
import billsRaw from "../../data/game/bills.json";
import eventsRaw from "../../data/game/events.json";
import { mulberry32 } from "../lib/nameGenerator.js";
import { PARTIES, partyById } from "./parties.js";
import type { Member } from "./roster.js";
import type { Appointment } from "./cabinet.js";
import { COALITION_PARTNERS, RULING_PARTY } from "./cabinet.js";
import { castVote, distance, expectedYes, noConfidenceVote, partyDistance } from "./vote.js";
import type { BillLike, Position, VoteContext, VoteResult } from "./vote.js";
import { buildScene, resolveLines } from "./scenes.js";
import type { LineTemplate, Scene, SceneVars } from "./scenes.js";

const R = rulesRaw;

export interface BillDef {
  id: string;
  name: string;
  field: string;
  ideology: Position;
  work: number;
  on_pass: number;
  required?: boolean;
  description: string;
}

export const BILLS = (billsRaw as unknown as { bills: BillDef[] }).bills;

export type BillStatus = "未着手" | "準備中" | "準備完了" | "提出中" | "成立" | "否決";

export interface BillState {
  status: BillStatus;
  /** 準備の進み具合（work に達すると準備完了） */
  progress: number;
}

export interface LogEntry {
  turn: number;
  date: string;
  kind: "行動" | "採決" | "出来事" | "通知";
  text: string;
  vote?: VoteResult;
}

export interface GameState {
  seed: number;
  turn: number;
  year: number;
  month: number;
  /** この月に残っている行動の回数 */
  actionPoints: number;
  /** 内閣支持率（%） */
  approval: number;
  /** 各月の終わりの支持率 */
  approvalHistory: number[];
  /** 与党の結束（0〜1） */
  cohesion: number;
  /** 野党ごとの与党への協力度（0〜100） */
  cooperation: Record<string, number>;
  bills: Record<string, BillState>;
  /** 予算の対象年度 */
  budgetYear: number;
  log: LogEntry[];
  /** まだ見せていない場面（ポップアップ）。画面が見せたら取り除く */
  scenes: Scene[];
  /** この月に記者会見をした回数（同じ月に重ねると効果が薄れる） */
  pressThisMonth: number;
  /** 乱数を使った回数（保存しても同じ続きになるように状態に持つ） */
  rngCounter: number;
  /** 衆議院の任期が満了する年月 */
  termEnd: { year: number; month: number };
  /** ゲームが終わったときの理由 */
  over?: string;
}

export interface GameContext {
  roster: Member[];
  government: Appointment[];
}

export const dateLabel = (s: Pick<GameState, "year" | "month">) => `${s.year}年${s.month}月`;
export const inSession = (s: Pick<GameState, "month">) => R.session_months.includes(s.month);
export const billName = (s: GameState, b: BillDef) => (b.id === R.budget.bill ? `${s.budgetYear}年度予算` : b.name);

function rand(state: GameState): number {
  return mulberry32((state.seed * 1_000_003 + state.turn * 7_919 + state.rngCounter++ * 104_729) >>> 0)();
}

function log(state: GameState, kind: LogEntry["kind"], text: string, vote?: VoteResult): void {
  state.log.push({ turn: state.turn, date: dateLabel(state), kind, text, vote });
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const round1 = (v: number) => Math.round(v * 10) / 10;

function changeApproval(state: GameState, delta: number): void {
  state.approval = round1(clamp(state.approval + delta, 1, 90));
}

/** 場面を作って見せる順番に積む */
function pushScene(state: GameState, ctx: GameContext, key: string, vars: SceneVars = {}): void {
  state.scenes.push(buildScene(key, ctx, { year: state.year, approval: state.approval, ...vars }, rand(state)));
}

export interface GameStartOptions {
  /** 始まる年月（既定は rules.json の start） */
  year?: number;
  month?: number;
  /** 任期満了の年月（既定は rules.json の term_end） */
  termEnd?: { year: number; month: number };
  /** 内閣発足の記録を残さない（総選挙後に政権を組み直すときなど） */
  quiet?: boolean;
}

/** ctx を渡すと、内閣発足の場面を積んだ状態で始まる */
export function createGame(seed: number, ctx?: GameContext, opts: GameStartOptions = {}): GameState {
  const startYear = opts.year ?? R.start.year;
  const startMonth = opts.month ?? R.start.month;
  const bills: Record<string, BillState> = {};
  for (const b of BILLS) bills[b.id] = { status: "未着手", progress: 0 };
  const cooperation: Record<string, number> = {};
  for (const p of PARTIES) {
    // 連立相手も協議の相手にする（連立の中の調整）
    if (p.id === RULING_PARTY || p.is_independent || p.appears_later) continue;
    cooperation[p.id] = (R.cooperation.initial as Record<string, number>)[p.id] ?? 0;
  }
  const state: GameState = {
    seed,
    turn: 1,
    year: startYear,
    month: startMonth,
    actionPoints: R.action_points_per_turn,
    approval: R.approval.initial,
    approvalHistory: [R.approval.initial],
    cohesion: R.cohesion.initial,
    cooperation,
    bills,
    budgetYear: startYear,
    termEnd: opts.termEnd ?? { ...R.term_end },
    log: [],
    scenes: [],
    pressThisMonth: 0,
    rngCounter: 0,
  };
  // 予算の期限（3月）を過ぎてから始まる年は、その年度の予算は成立済みとして扱う
  if (startMonth > R.budget.deadline_month) state.bills[R.budget.bill] = { status: "成立", progress: 0 };
  if (!opts.quiet) {
    log(state, "通知", `石橋内閣が発足した。少数与党のため、法案を通すには野党の協力が必要になる。${state.budgetYear}年度予算は3月末までに成立させなければならない。`);
    if (ctx) pushScene(state, ctx, "start");
  }
  return state;
}

// ---- 役職者を引く ----

const holder = (ctx: GameContext, postId: string) => ctx.government.find((a) => a.post.id === postId)?.member;
export const primeMinister = (ctx: GameContext) => holder(ctx, "pm")!;
/** 法案の担当大臣（得意分野の大臣） */
export const ministerFor = (ctx: GameContext, bill: BillDef) => ctx.government.find((a) => a.post.field === bill.field)?.member ?? primeMinister(ctx);

export function voteContext(state: GameState): VoteContext {
  return { rulingParty: RULING_PARTY, coalitionPartners: COALITION_PARTNERS, cooperation: state.cooperation, cohesion: state.cohesion };
}

export const billLike = (b: BillDef): BillLike => ({ position: b.ideology, popularity: b.on_pass });

/** 法案を出したときの賛成の見込み */
export function billForecast(state: GameState, ctx: GameContext, b: BillDef): number {
  return expectedYes(ctx.roster, billLike(b), voteContext(state));
}

// ---- 行動 ----

export interface ActionResult {
  ok: boolean;
  message: string;
}

function spend(state: GameState): ActionResult | null {
  if (state.over) return { ok: false, message: "ゲームは終わっています。" };
  if (state.actionPoints <= 0) return { ok: false, message: "今月の行動はもう残っていません。" };
  return null;
}

/** 法案の準備を始める */
export function startDrafting(state: GameState, ctx: GameContext, billId: string): ActionResult {
  const err = spend(state);
  if (err) return err;
  const b = BILLS.find((x) => x.id === billId);
  const bs = state.bills[billId];
  if (!b || !bs || bs.status !== "未着手") return { ok: false, message: "この法案は準備を始められません。" };
  state.actionPoints--;
  bs.status = "準備中";
  const minister = ministerFor(ctx, b);
  const msg = `${billName(state, b)}の準備を${minister.name.displayName}に指示した。`;
  log(state, "行動", msg);
  return { ok: true, message: msg };
}

/** 準備ができた法案を国会に出す。採決はその月の終わり */
export function submitBill(state: GameState, ctx: GameContext, billId: string): ActionResult {
  const err = spend(state);
  if (err) return err;
  const b = BILLS.find((x) => x.id === billId);
  const bs = state.bills[billId];
  if (!b || !bs || (bs.status !== "準備完了" && bs.status !== "否決")) return { ok: false, message: "この法案はまだ出せません。" };
  if (!inSession(state)) return { ok: false, message: "国会の会期外なので法案を出せません。" };
  state.actionPoints--;
  bs.status = "提出中";
  const forecast = Math.round(billForecast(state, ctx, b));
  const msg = `${billName(state, b)}を国会に提出した（賛成の見込み約${forecast}票）。月末に採決する。`;
  log(state, "行動", msg);
  return { ok: true, message: msg };
}

/** 野党と政策協議をして協力度を上げる。官房長官の調整が高いほど、思想が近い党ほど上がる */
export function talkWithParty(state: GameState, ctx: GameContext, partyId: string): ActionResult {
  const err = spend(state);
  if (err) return err;
  if (!(partyId in state.cooperation)) return { ok: false, message: "この政党とは協議できません。" };
  state.actionPoints--;
  const negotiator = holder(ctx, "chief_cabinet_secretary") ?? primeMinister(ctx);
  const gain = Math.max(
    2,
    R.cooperation.talk_base + negotiator.abilities.調整 * R.cooperation.talk_per_ability - partyDistance(RULING_PARTY, partyId) * R.cooperation.talk_distance_penalty -
      ((R.cooperation.rival_penalty as Record<string, number>)[partyId] ?? 0) +
      (rand(state) - 0.5) * 6,
  );
  state.cooperation[partyId] = Math.round(clamp(state.cooperation[partyId] + gain, 0, 100));
  const msg = `${negotiator.name.displayName}官房長官が${partyById(partyId).name}と政策協議をした（協力度 ${state.cooperation[partyId]}）。`;
  log(state, "行動", msg);
  return { ok: true, message: msg };
}

/** 党内の根回しで結束を上げる。幹事長の調整が高いほど上がる */
export function nemawashi(state: GameState, ctx: GameContext): ActionResult {
  const err = spend(state);
  if (err) return err;
  state.actionPoints--;
  const sg = holder(ctx, "secretary_general") ?? primeMinister(ctx);
  state.cohesion = Math.round(clamp(state.cohesion + R.cohesion.nemawashi_base + sg.abilities.調整 * R.cohesion.nemawashi_per_ability, 0, 1) * 100) / 100;
  const msg = `${sg.name.displayName}幹事長が党内の根回しをした（結束 ${Math.round(state.cohesion * 100)}%）。`;
  log(state, "行動", msg);
  return { ok: true, message: msg };
}

/** 記者会見。首相の弁舌が高いほど支持率が上がるが、失言することもある */
export function pressConference(state: GameState, ctx: GameContext): ActionResult {
  const err = spend(state);
  if (err) return err;
  state.actionPoints--;
  state.pressThisMonth++;
  const pm = primeMinister(ctx);
  const gaffeChance = Math.max(0.05, R.press.gaffe_base - pm.abilities.弁舌 * R.press.gaffe_per_ability);
  let msg: string;
  if (rand(state) < gaffeChance) {
    changeApproval(state, R.press.gaffe_effect);
    msg = `記者会見で${pm.name.displayName}首相の発言が失言と受け取られた（支持率 ${state.approval}%）。`;
  } else {
    // 支持率が高いほど伸びにくく、同じ月に重ねるほど効果が薄れる
    const room = Math.max(0, (R.press.ceiling - state.approval) / (R.press.ceiling - R.approval.baseline));
    const fatigue = Math.pow(R.press.repeat_factor, state.pressThisMonth);
    changeApproval(state, ((pm.abilities.弁舌 - 50) * R.press.per_ability * room + (rand(state) - 0.5) * 2 * R.press.noise) * fatigue);
    msg = `${pm.name.displayName}首相が記者会見で政策を訴えた（支持率 ${state.approval}%）。`;
  }
  log(state, "行動", msg);
  return { ok: true, message: msg };
}

// ---- 月の終わり ----

function runEvent(state: GameState, ctx: GameContext): void {
  if (rand(state) >= eventsRaw.chance) return;
  const total = eventsRaw.events.reduce((s, e) => s + e.weight, 0);
  let r = rand(state) * total;
  const ev = eventsRaw.events.find((e) => (r -= e.weight) <= 0) ?? eventsRaw.events[0];
  let who: Member | undefined;
  if (ev.target === "cabinet_low_speech") {
    const ministers = ctx.government.filter((a) => a.post.kind === "内閣" && a.post.id !== "pm").map((a) => a.member);
    const weights = ministers.map((m) => Math.max(1, 100 - m.abilities.弁舌));
    let x = rand(state) * weights.reduce((a, b) => a + b, 0);
    who = ministers.find((_, i) => (x -= weights[i]) <= 0) ?? ministers[0];
  } else if (ev.target === "ruling_member") {
    const ruling = ctx.roster.filter((m) => m.party === RULING_PARTY && !m.fixedRole);
    who = ruling[Math.floor(rand(state) * ruling.length)];
  }
  changeApproval(state, ev.approval);
  if ("cohesion" in ev && typeof ev.cohesion === "number") state.cohesion = Math.round(clamp(state.cohesion + ev.cohesion, 0, 1) * 100) / 100;
  const text = ev.text.replace("{member}", who ? who.name.displayName : "");
  log(state, "出来事", `${text}（支持率 ${ev.approval > 0 ? "+" : ""}${ev.approval}）`);
  state.scenes.push({
    title: `${ev.title}（支持率 ${ev.approval > 0 ? "+" : ""}${ev.approval}）`,
    lines: resolveLines(ev.lines as LineTemplate[], ctx, { member: who }),
  });
}

/** 月を終える。法案の準備、採決、予算の期限、出来事、支持率の変化、不信任案、次の月への移動を順に行う */
export function endTurn(state: GameState, ctx: GameContext): void {
  if (state.over) return;
  // 法案の準備
  for (const b of BILLS) {
    const bs = state.bills[b.id];
    if (bs.status !== "準備中") continue;
    bs.progress = round1(bs.progress + ministerFor(ctx, b).abilities.政策 * R.drafting.progress_per_ability);
    if (bs.progress >= b.work) {
      bs.status = "準備完了";
      log(state, "通知", `${billName(state, b)}の準備ができた。会期中なら国会に出せる。`);
    }
  }
  // 採決
  for (const b of BILLS) {
    const bs = state.bills[b.id];
    if (bs.status !== "提出中") continue;
    const result = castVote(ctx.roster, billLike(b), voteContext(state), () => rand(state));
    if (result.passed) {
      bs.status = "成立";
      changeApproval(state, b.on_pass);
      log(state, "採決", `${billName(state, b)}が賛成${result.yes}・反対${result.no}で成立した（支持率 ${b.on_pass >= 0 ? "+" : ""}${b.on_pass}）。`, result);
      pushScene(state, ctx, "vote_pass", { bill: billName(state, b), yes: result.yes, no: result.no, minister: ministerFor(ctx, b) });
    } else {
      bs.status = "否決";
      changeApproval(state, -2);
      log(state, "採決", `${billName(state, b)}は賛成${result.yes}・反対${result.no}で否決された（支持率 −2）。`, result);
      pushScene(state, ctx, "vote_fail", { bill: billName(state, b), yes: result.yes, no: result.no, minister: ministerFor(ctx, b) });
    }
    const rulingRebels = result.rebels.filter((id) => ctx.roster.find((m) => m.id === id)?.party === RULING_PARTY).length;
    if (rulingRebels >= 3) pushScene(state, ctx, "rebels", { rebels: rulingRebels });
  }
  // 予算の期限
  const budget = state.bills[R.budget.bill];
  if (state.month === R.budget.deadline_month && budget.status !== "成立") {
    changeApproval(state, R.budget.failure_approval);
    log(state, "通知", `${state.budgetYear}年度予算が年度内に成立せず、暫定予算でしのぐことになった（支持率 ${R.budget.failure_approval}）。`);
    pushScene(state, ctx, "budget_fail", { year: state.budgetYear });
  }
  runEvent(state, ctx);
  // 支持率は基準の値に少しずつ戻り、毎月少し揺れる
  changeApproval(state, (R.approval.baseline - state.approval) * R.approval.drift + (rand(state) - 0.5) * 2 * R.approval.noise);
  // 協力度と結束は放っておくと下がる
  for (const p of Object.keys(state.cooperation)) state.cooperation[p] = Math.max(0, state.cooperation[p] - R.cooperation.decay);
  state.cohesion = Math.round(clamp(state.cohesion - R.cohesion.decay, 0, 1) * 100) / 100;
  state.approvalHistory.push(state.approval);
  // 内閣不信任案
  if (state.approval < R.approval.no_confidence_threshold) {
    const result = noConfidenceVote(ctx.roster, voteContext(state), state.approval, () => rand(state));
    if (result.passed) {
      log(state, "採決", `内閣不信任案が賛成${result.yes}・反対${result.no}で可決された。石橋内閣は総辞職した。`, result);
      pushScene(state, ctx, "no_confidence_pass", { yes: result.yes, no: result.no });
      state.over = "内閣不信任案が可決され、内閣は総辞職した。";
      return;
    }
    pushScene(state, ctx, "no_confidence_fail", { yes: result.yes, no: result.no });
    log(state, "採決", `野党が出した内閣不信任案は賛成${result.yes}・反対${result.no}で否決された。`, result);
  }
  // 次の月へ
  state.turn++;
  state.month++;
  if (state.month > 12) {
    state.month = 1;
    state.year++;
  }
  state.actionPoints = R.action_points_per_turn;
  state.pressThisMonth = 0;
  // 新しい年の予算
  if (state.month === 1) {
    state.budgetYear = state.year;
    state.bills[R.budget.bill] = { status: "未着手", progress: 0 };
    log(state, "通知", `通常国会が始まった。${state.budgetYear}年度予算を3月末までに成立させる必要がある。`);
  }
  if (state.month === R.session_months.find((m) => m > 6)) log(state, "通知", "臨時国会が始まった。");
  if (state.month === 7) log(state, "通知", "通常国会が閉会した。秋の臨時国会まで法案は出せない。");
  if (state.year > state.termEnd.year || (state.year === state.termEnd.year && state.month > state.termEnd.month)) {
    state.over = "任期満了。総選挙は次の段階で実装します。";
    log(state, "通知", "衆議院議員の任期が満了した。");
    pushScene(state, ctx, "term_end");
  }
}

/** 法案の思想と、ある政党の中心との距離（画面の説明用） */
export const billPartyDistance = (b: BillDef, partyId: string) => distance(partyById(partyId).ideology_center, b.ideology);
