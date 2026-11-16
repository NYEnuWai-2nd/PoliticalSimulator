// 議員人生モードの画面の入口。状態を持ち、画面を描き直し、操作を計算（src/game/career.ts）に渡す。
// URL に ?seed=7&start=newcomer,minsei,smd,15,local を付けると、その条件ですぐ始まる（確認や共有に使う）。
import "./app.css";
import "./app-ux.css";
import { loadNameData } from "../data/nameData.js";
import { createWorld } from "../game/roster.js";
import type { Member, MemberFactory } from "../game/roster.js";
import { formInitialGovernment } from "../game/cabinet.js";
import type { Appointment } from "../game/cabinet.js";
import { chooseEvent, govAction, learnSkill, oppAction, raceForecast, startCareer, takeTurn, upgradeAbility } from "../game/career.js";
import type { AdviceLevel } from "../game/advice.js";
import type { OppActionId } from "../game/career.js";
import type { CareerState, CareerWorld, OriginId, RouteId } from "../game/career.js";
import type { Ability } from "../game/tables.js";
import { deserializeCareer, parseSave, saveLabel, serializeCareer } from "../game/save.js";
import { skillById } from "../game/skills.js";
import type { NameData } from "../data/nameData.js";
import { partyById } from "../game/parties.js";
import { PREFECTURES, renderJapanMap } from "../map/japanMap.js";
import { FX, activityIds, activityView, cabinetView, electionView, helpView, highlightView, logView, memberDetail, partyView, selfView, setupView, statusBar } from "./views.js";
import type { LogFilter, SetupChoice, UiMode } from "./views.js";
import { chip, esc, icon, pct } from "./ui.js";

type Tab = "act" | "map" | "party" | "cabinet" | "self";
const TABS: { id: Tab; label: string; icon: string; title: string }[] = [
  { id: "act", label: "活動", icon: "tab-activity", title: "今月の活動" },
  { id: "map", label: "地図", icon: "tab-map", title: "全国の情勢" },
  { id: "party", label: "党内", icon: "tab-party", title: "党内" },
  { id: "cabinet", label: "内閣", icon: "tab-cabinet", title: "内閣" },
  { id: "self", label: "自分", icon: "tab-self", title: "能力と経歴" },
];

interface App {
  seed: number;
  base?: { roster: Member[]; government: Appointment[]; factory: MemberFactory };
  setup: SetupChoice;
  state?: CareerState;
  world?: CareerWorld;
  tab: Tab;
  selected?: string;
  last?: { text: string; fx: string; note?: string };
  busy: boolean;
  /** 見せた総選挙の数（新しい総選挙があれば結果を出す） */
  electionsShown: number;
  toast?: string;
  mapPref?: number;
  /** 始め方の何番目の画面か（0から） */
  setupStep: number;
  /** 詳しい情報を出している人物 */
  memberId?: number;
  names?: NameData;
  /** 最後に自動保存した時刻（表示用） */
  savedAt?: string;
  /** 記録か遊び方のポップアップ */
  overlay?: "log" | "help";
  logFilter: LogFilter;
  /** 出来事の結果（閉じるまで出しておく） */
  result?: { title: string; choice: string; text: string };
  /** 画面のモード（このブラウザに覚えておく） */
  mode: UiMode;
  /** 秘書の助言の出し方（このブラウザに覚えておく） */
  adviceLevel: AdviceLevel;
  /** 見せた山場の場面の数 */
  highlightsShown: number;
  /** 画面の中の確認（「はい」で run を実行する）。ブラウザ標準の確認は自動操作で必ず「いいえ」になる環境があるため使わない */
  confirm?: { text: string; ok: string; run: () => void | Promise<void> };
}

/** 確認のポップアップを出す */
function ask(text: string, ok: string, run: () => void | Promise<void>): void {
  app.confirm = { text, ok, run };
  render();
}

function confirmHtml(): string {
  const c = app.confirm;
  if (!c) return "";
  return `<div class="overlay confirm-overlay"><div class="cut dialog light confirm" role="alertdialog" aria-modal="true"><p>${esc(c.text).replaceAll("\n", "<br>")}</p>
    <p class="btn-row" style="justify-content:flex-end;margin:12px 0 0"><button class="btn" data-action="confirm-cancel">やめる</button><button class="btn primary" data-action="confirm-ok">${esc(c.ok)}</button></p></div></div>`;
}

const ADVICE_KEY = "seiji.adviceLevel";
function loadAdviceLevel(): AdviceLevel {
  try {
    const v = localStorage.getItem(ADVICE_KEY);
    return v === "warn" || v === "off" ? v : "all";
  } catch {
    return "all";
  }
}

const MODE_KEY = "seiji.uiMode";
function loadMode(): UiMode {
  const q = new URLSearchParams(location.search).get("mode");
  if (q === "normal" || q === "pro") return q;
  try {
    const v = localStorage.getItem(MODE_KEY);
    return v === "pro" ? "pro" : "normal";
  } catch {
    return "normal";
  }
}
function saveMode(mode: UiMode): void {
  try {
    localStorage.setItem(MODE_KEY, mode);
  } catch {
    /* 保存できない環境では、そのときだけ切り替える */
  }
}

// ---------- セーブ ----------

const SAVE_KEY = "seiji.career.autosave";

function removeAutosave(): void {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    /* 保存できない環境 */
  }
}

function readAutosave(): string | undefined {
  try {
    return localStorage.getItem(SAVE_KEY) ?? undefined;
  } catch {
    return undefined;
  }
}

/** 自動保存の説明（読めないデータなら undefined） */
function autosaveLabel(): string | undefined {
  const text = readAutosave();
  if (!text) return undefined;
  try {
    const save = parseSave(text);
    return save.state.over ? undefined : saveLabel(save);
  } catch {
    return undefined;
  }
}

let saveWarned = false;
/** 状態が変わるたびにこのブラウザへ保存する。引退したら消す */
function autosave(): void {
  const { state, world } = app;
  // 確認用の URL（?start=…）で始めたときは、本来のセーブを上書きしない
  if (!state || !world || params.has("start")) return;
  try {
    if (state.over) {
      localStorage.removeItem(SAVE_KEY);
      app.savedAt = undefined;
      return;
    }
    localStorage.setItem(SAVE_KEY, JSON.stringify(serializeCareer(state, world, app.seed)));
    const now = new Date();
    app.savedAt = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
  } catch {
    app.savedAt = undefined;
    if (!saveWarned) {
      saveWarned = true;
      window.setTimeout(() => showToast("このブラウザに保存できませんでした。「自分」の画面からファイルに書き出してください"), 0);
    }
  }
}

async function loadSave(text: string): Promise<void> {
  app.busy = true;
  try {
    const save = parseSave(text);
    app.names ??= await loadNameData();
    const { state, world } = await deserializeCareer(save, app.names);
    app.seed = save.worldSeed;
    app.state = state;
    app.world = world;
    app.electionsShown = state.elections.length;
    app.highlightsShown = state.highlights?.length ?? 0;
    app.selected = undefined;
    app.memberId = undefined;
    app.tab = "act";
    app.last = { text: `${saveLabel(save)}から再開した。`, fx: "" };
  } catch (e) {
    showToast(e instanceof Error ? e.message : String(e));
  } finally {
    app.busy = false;
  }
  render();
}

function exportSave(): void {
  const { state, world } = app;
  if (!state || !world) return;
  const blob = new Blob([JSON.stringify(serializeCareer(state, world, app.seed))], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `giin-jinsei_${state.year}-${String(state.month).padStart(2, "0")}_${world.player.name.surname}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function importSave(): void {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "application/json,.json";
  input.addEventListener("change", async () => {
    const file = input.files?.[0];
    if (!file) return;
    const text = await file.text();
    if (app.state && !app.state.over) ask("今のゲームを終えて、ファイルのデータを読み込みますか？", "読み込む", () => loadSave(text));
    else await loadSave(text);
  });
  input.click();
}

const params = new URLSearchParams(location.search);
const app: App = {
  seed: Number(params.get("seed")) || Math.floor(Math.random() * 100000),
  setup: {},
  tab: (params.get("tab") as Tab) || "act",
  busy: false,
  electionsShown: 0,
  setupStep: 0,
  logFilter: "major",
  mode: loadMode(),
  adviceLevel: loadAdviceLevel(),
  highlightsShown: 0,
};
const root = document.querySelector<HTMLDivElement>("#app")!;

// ---------- 描画 ----------

function render(): void {
  hideTip();
  const { state, world } = app;
  if (state && world && !app.busy) autosave();
  if (!state || !world) {
    root.innerHTML = `<div class="shell"><header class="topbar"><div class="crumb"><div class="diamond"></div><div><span class="crumb-sub">議員人生</span><span class="crumb-main">はじめる</span></div></div></header>
      <main class="view">${app.base ? setupView(app.base.roster, app.setup, app.setupStep, autosaveLabel(), app.mode, app.adviceLevel) : `<p class="cut box">名前データを読み込んでいます…</p>`}</main></div>${confirmHtml()}`;
    return;
  }
  const tab = TABS.find((t) => t.id === app.tab)!;
  let body = "";
  if (app.tab === "act") body = activityView(state, world, app.selected, app.last, app.mode, app.adviceLevel);
  else if (app.tab === "self") body = selfView(state, world, app.savedAt, app.mode, app.adviceLevel);
  else if (app.tab === "party") body = partyView(state, world);
  else if (app.tab === "cabinet") body = cabinetView(state, world);
  else body = mapViewShell();
  root.innerHTML = `<div class="shell mode-${app.mode}">
    <header class="topbar">
      <div class="crumb"><div class="diamond"></div><div><span class="crumb-sub">議員人生 ― ${esc(world.player.name.displayName)}・当選${world.player.terms}回</span><span class="crumb-main">${tab.title}</span></div></div>
      <nav class="tabs" aria-label="画面の切り替え">${TABS.map((t, i) => `<button class="tab${t.id === app.tab ? " is-active" : ""}" data-tab="${t.id}">${icon(t.icon, 20)}${t.label}<kbd aria-hidden="true">${i + 1}</kbd></button>`).join("")}</nav>
    </header>
    <main class="view${app.tab === "act" ? " is-act" : ""}">${body}</main>
    <footer class="status">${statusBar(state, world)}</footer>
  </div>
  ${modalHtml()}
  ${app.toast ? `<div class="cut toast" role="status">${esc(app.toast)}</div>` : ""}`;
  if (app.tab === "map") mountMap();
  if (app.tab === "act") setupCardScroll();
}

function mapViewShell(): string {
  const w = app.world!;
  const pref = app.mapPref ?? app.state!.setup.pref;
  const holder = w.roster.find((m) => m.seat === "小選挙区" && m.district === pref);
  const pr = w.roster.filter((m) => m.seat === "比例" && m.home === pref);
  const info = holder
    ? `<b>${esc(PREFECTURES[pref - 1].name)}</b>：${chip(holder.party)} <button class="name-btn" data-member="${holder.id}">${esc(holder.name.displayName)}</button>（${esc(partyById(holder.party).short)}・当選${holder.terms}回・地盤${holder.jiban}）${pr.length ? `　比例：${pr.map((m) => `<button class="name-btn" data-member="${m.id}">${esc(m.name.displayName)}</button>`).join("、")}` : ""}`
    : "";
  return `<div class="page"><section class="cut box"><div id="map"></div><p style="margin:8px 0 0">${info}</p><p class="muted" style="margin:4px 0 0">県を押すと、その県の議員を表示します。赤い太枠の県が自分の地元です。</p>${mapLegend(w.roster)}</section></div>`;
}

/** 地図の凡例：県の色は小選挙区の議席を持つ政党 */
function mapLegend(roster: Member[]): string {
  const counts = new Map<string, number>();
  for (const m of roster) if (m.seat === "小選挙区") counts.set(m.party, (counts.get(m.party) ?? 0) + 1);
  const items = [...counts].sort((a, b) => b[1] - a[1]).map(([p, n]) => `<span class="legend-item">${chip(p)}${esc(partyById(p).short)} ${n}</span>`);
  return `<div class="legend"><span class="muted">県の色＝小選挙区の議席を持つ政党</span>${items.join("")}</div>`;
}

function mountMap(): void {
  const w = app.world!;
  const el = document.querySelector("#map");
  if (!el) return;
  renderJapanMap(el, {
    cellSize: 14,
    fill: (code) => {
      const m = w.roster.find((x) => x.seat === "小選挙区" && x.district === code);
      return m ? partyById(m.party).color : "#d4d4d8";
    },
    onClick: (code) => {
      app.mapPref = code;
      render();
    },
  });
  const mine = el.querySelector<SVGPathElement>(`path.pref[data-code="${app.state!.setup.pref}"]`);
  if (mine) {
    mine.setAttribute("stroke", "#e61919");
    mine.setAttribute("stroke-width", "4");
  }
}

function modalHtml(): string {
  const { state, world } = app;
  if (!state || !world) return "";
  if (app.confirm) return confirmHtml();
  if (app.memberId !== undefined) return memberDetail(state, world, app.memberId);
  if (app.overlay === "log") return logView(state, app.logFilter);
  if (app.overlay === "help") return helpView();
  if (app.result) {
    const r = app.result;
    return `<div class="overlay"><div class="cut dialog" role="dialog" aria-modal="true"><h2>${esc(r.title)}</h2><p class="muted" style="margin:0 0 6px">選んだこと：${esc(r.choice)}</p><p>${esc(r.text)}</p>
      <button class="btn primary" data-action="close-result">閉じる</button></div></div>`;
  }
  // 総選挙の結果
  if (state.elections.length > app.electionsShown) return electionView(state, state.elections[state.elections.length - 1]);
  // 山場の場面（政権交代、首相交代、自分の就任）
  const hl = state.highlights ?? [];
  if (hl.length > app.highlightsShown) return highlightView(hl[app.highlightsShown]);
  // 出来事の選択肢
  if (state.pendingEvent) {
    const pe = state.pendingEvent;
    return `<div class="overlay"><div class="cut dialog" role="dialog" aria-modal="true"><h2>${esc(pe.title)}</h2><p>${esc(pe.text)}</p>
      <div class="choices">${pe.choices.map((c, i) => `<button class="choice" data-choose="${i}">${i + 1}. ${esc(c)}</button>`).join("")}</div></div></div>`;
  }
  // 引退
  if (state.over) {
    return `<div class="overlay"><div class="cut dialog" role="dialog" aria-modal="true"><h2>${icon("st-rose", 32)} 政治家人生のおわり</h2><p>${esc(state.over)}</p>
      <ul>${state.achievements.map((a) => `<li>${esc(a)}</li>`).join("")}</ul>
      <p class="btn-row"><button class="btn primary" data-action="restart-same">同じ世界でもう一度</button><button class="btn" data-action="restart">新しい世界で遊ぶ</button></p></div></div>`;
  }
  return "";
}

function showToast(text: string): void {
  app.toast = text;
  render();
  window.setTimeout(() => {
    if (app.toast === text) {
      app.toast = undefined;
      render();
    }
  }, 2600);
}

// ---------- 操作 ----------

async function start(): Promise<void> {
  const c = app.setup;
  if (!app.base || !c.origin || !c.party || !c.route || !c.pref || !c.archetype) return;
  // 続きのデータがあれば、消えることを確かめる（確認用の ?start= では聞かない）
  const saved = params.has("start") ? undefined : autosaveLabel();
  if (saved) {
    ask(`このブラウザに保存している続き（${saved}）は消えます。新しく始めますか？\n残すときは、先に「続きから」で開いて「自分」の画面からファイルに書き出してください。`, "新しく始める", () => beginCareer());
    return;
  }
  await beginCareer();
}

async function beginCareer(): Promise<void> {
  const c = app.setup;
  if (!app.base || !c.origin || !c.party || !c.route || !c.pref || !c.archetype) return;
  app.busy = true;
  try {
    const { state, world } = await startCareer(app.base, { origin: c.origin, party: c.party, route: c.route, pref: c.pref, archetype: c.archetype }, app.seed);
    app.state = state;
    app.world = world;
    app.last = { text: state.log.at(-1)!.text, fx: "" };
  } catch (e) {
    showToast(e instanceof Error ? e.message : String(e));
  } finally {
    app.busy = false;
  }
  render();
}

/** 月の前後で見比べる値 */
function snapshotNumbers() {
  const { state, world } = app;
  // 比例名簿の道では小選挙区の見込みがない
  const me = state!.setup.route === "pr" ? undefined : raceForecast(state!, world!).find((x) => x.isPlayer)?.share;
  return { approval: state!.gov.approval, share: me, maxStamina: state!.maxStamina, ruling: state!.gov.ruling.party, skills: [...world!.player.skills] };
}

/** 月の前後の変化を短い文にする（情勢と内閣支持率が動いた理由の手がかりも添える） */
function describeChanges(before: ReturnType<typeof snapshotNumbers>, after: ReturnType<typeof snapshotNumbers>): string | undefined {
  const state = app.state!;
  const parts: string[] = [];
  const da = Math.round((after.approval - before.approval) * 10) / 10;
  if (Math.abs(da) >= 0.5) parts.push(`内閣支持率 ${before.approval}→${after.approval}%`);
  if (before.share !== undefined && after.share !== undefined) {
    const ds = after.share - before.share;
    if (Math.abs(ds) >= 0.003) {
      // 内閣支持率は与党に追い風（または向かい風）として党の支持を動かす。動いた向きが合えばそれを理由として示す
      const mine = after.ruling === state.setup.party || state.gov.ruling.partners.includes(state.setup.party);
      const windUp = (da > 0) === mine;
      const reason =
        Math.abs(da) >= 0.5 && before.ruling === after.ruling && windUp === ds > 0
          ? `（支持率の変化で${mine ? "与党の自党" : "野党の自党"}に${windUp ? "追い風" : "向かい風"}）`
          : ds < 0
            ? "（相手の陣営の動きや関係の変化）"
            : "";
      parts.push(`情勢の見込み ${pct(before.share)}→${pct(after.share)}${reason}`);
    }
  }
  if (after.maxStamina !== before.maxStamina) parts.push(`体力の上限が${after.maxStamina}になった`);
  for (const id of after.skills.filter((x) => !before.skills.includes(x))) parts.push(`特殊能力「${skillById(id)?.name}」を身につけた！`);
  for (const id of before.skills.filter((x) => !after.skills.includes(x))) parts.push(`「${skillById(id)?.name}」が外れた`);
  return parts.length ? parts.join("　") : undefined;
}

async function doActivity(id: string): Promise<void> {
  const { state, world } = app;
  if (!state || !world || app.busy) return;
  app.busy = true;
  const before = snapshotNumbers();
  const r = await takeTurn(state, world, id);
  app.busy = false;
  if (!r.ok) {
    showToast(r.message);
    return;
  }
  app.last = { text: r.message, fx: FX[id] ?? "", note: describeChanges(before, snapshotNumbers()) };
  app.selected = undefined;
  render();
}

function choose(index: number): void {
  const state = app.state!;
  const pe = state.pendingEvent;
  if (!pe) return;
  const before = state.maxStamina;
  const r = chooseEvent(state, app.world!, index);
  if (!r.ok) {
    showToast(r.message);
    return;
  }
  // 結果の文は「題名：選んだこと → 結果（変化）」の形
  const text = r.message.split(" → ").slice(1).join(" → ") || r.message;
  const extra = state.maxStamina !== before ? `　体力の上限が${state.maxStamina}になった` : "";
  app.result = { title: pe.title, choice: pe.choices[index], text: text + extra };
  render();
}

function selectActivity(id: string): void {
  if (app.selected === id) void doActivity(id);
  else {
    app.selected = id;
    render();
  }
}

root.addEventListener("click", (ev) => {
  // 長押しでツールチップを出した直後のタップは、押したことにしない
  if (suppressClick) {
    suppressClick = false;
    ev.preventDefault();
    return;
  }
  const target = ev.target as HTMLElement;
  // ポップアップの外側を押したら閉じる
  if (target.classList.contains("overlay") && target.dataset.action === "close-overlay") {
    app.overlay = undefined;
    render();
    return;
  }
  if (target.classList.contains("overlay") && target.dataset.action === "close-member") {
    app.memberId = undefined;
    render();
    return;
  }
  const t = target.closest<HTMLElement>("button, [data-tab], [data-member]");
  if (!t || app.busy) return;
  const d = t.dataset;
  if (d.action === "close-member") {
    app.memberId = undefined;
    render();
    return;
  }
  if (d.member !== undefined && !d.act) {
    app.memberId = Number(d.member);
    render();
    return;
  }
  if (d.setup) {
    const key = d.setup as keyof SetupChoice;
    // 1つ選ぶと次の画面に進む（出馬の道の切り替えだけは同じ画面のまま）
    if (key === "pref") {
      app.setup.pref = Number(d.value);
      app.setup.route = d.route as RouteId;
      app.setupStep = 3;
    } else if (key === "route") {
      app.setup.route = d.value as RouteId;
      app.setup.pref = undefined;
    } else {
      (app.setup as Record<string, string>)[key] = d.value!;
      if (key === "origin" || key === "party") {
        app.setup.route = undefined;
        app.setup.pref = undefined;
      }
      app.setupStep = key === "origin" ? 1 : key === "party" ? 2 : 4;
    }
    render();
    window.scrollTo(0, 0);
  } else if (d.action === "setup-back") {
    app.setupStep = Math.max(0, app.setupStep - 1);
    render();
  } else if (d.action === "start") void start();
  else if (d.tab) {
    app.tab = d.tab as Tab;
    render();
  } else if (d.act) selectActivity(d.act);
  else if (d.up) {
    let n = 0;
    for (let i = 0; i < Number(d.times ?? 1); i++) if (upgradeAbility(app.state!, app.world!, d.up as Ability)) n++;
    if (n) showToast(`${d.up}を${n}上げた`);
    else render();
  } else if (d.choose !== undefined) choose(Number(d.choose));
  else if (d.action === "close-result") {
    app.result = undefined;
    render();
  } else if (d.action === "open-log" || d.action === "open-help") {
    app.overlay = d.action === "open-log" ? "log" : "help";
    render();
  } else if (d.action === "close-overlay") {
    app.overlay = undefined;
    render();
  } else if (d.log) {
    app.logFilter = d.log as LogFilter;
    render();
  } else if (d.action === "close-election") {
    app.electionsShown = app.state!.elections.length;
    render();
  } else if (d.action === "toggle-run") {
    app.state!.runForLeader = !app.state!.runForLeader;
    render();
  } else if (d.gov) {
    const go = () => showToast(govAction(app.state!, app.world!, d.gov!, d.arg).message);
    if (d.gov === "dissolve") ask("衆議院を解散して、月末に総選挙を行いますか？", "解散する", go);
    else go();
  } else if (d.opp) {
    const go = () => showToast(oppAction(app.state!, app.world!, d.opp as OppActionId, d.arg).message);
    if (d.opp === "noconfidence") ask("内閣不信任案を提出しますか？\n否決されると、党への追い風が弱まり、反対した党との協力度が下がります。", "提出する", go);
    else go();
  } else if (d.action === "close-highlight") {
    app.highlightsShown++;
    render();
  } else if (d.learn) {
    const r = learnSkill(app.state!, app.world!, d.learn);
    showToast(r.message);
  } else if (d.action === "advice-all" || d.action === "advice-warn" || d.action === "advice-off") {
    app.adviceLevel = d.action.slice(7) as AdviceLevel;
    try {
      localStorage.setItem(ADVICE_KEY, app.adviceLevel);
    } catch {
      /* 保存できない環境では、そのときだけ切り替える */
    }
    render();
  } else if (d.action === "mode-normal" || d.action === "mode-pro") {
    app.mode = d.action === "mode-normal" ? "normal" : "pro";
    saveMode(app.mode);
    render();
  } else if (d.action === "continue") {
    const text = readAutosave();
    if (text) void loadSave(text);
  } else if (d.action === "import") importSave();
  else if (d.action === "export") exportSave();
  else if (d.action === "restart" || d.action === "restart-same") {
    const go = () => {
      removeAutosave();
      location.href = d.action === "restart-same" ? `${location.pathname}?seed=${app.seed}` : location.pathname;
    };
    if (app.state && !app.state.over) ask("今のゲームの続きは消えます。最初から始めますか？\n残すときは、先にファイルに書き出してください。", "最初から始める", go);
    else go();
  } else if (d.action === "delete-save") {
    const label = autosaveLabel();
    ask(`このブラウザに保存している続き（${label ?? "セーブデータ"}）を消しますか？\n消すと元に戻せません。`, "消す", () => {
      removeAutosave();
      showToast("セーブデータを消しました");
    });
  } else if (d.action === "confirm-ok") {
    const c = app.confirm;
    app.confirm = undefined;
    render();
    if (c) void c.run();
  } else if (d.action === "confirm-cancel") {
    app.confirm = undefined;
    render();
  }
});

// 数字キーで画面を切り替え、活動の画面では左右キーで選び Enter で実行する。出来事は数字キーで選ぶ
window.addEventListener("keydown", (e) => {
  if (app.confirm) {
    if (e.key === "Escape") {
      app.confirm = undefined;
      render();
    }
    return;
  }
  if (!app.state || !app.world || app.busy || e.altKey || e.ctrlKey || e.metaKey) return;
  if (app.memberId !== undefined || app.overlay || app.result) {
    if (e.key === "Escape" || e.key === "Enter") {
      if (app.memberId !== undefined) app.memberId = undefined;
      else if (app.overlay) app.overlay = undefined;
      else app.result = undefined;
      render();
    }
    return;
  }
  if (app.state.elections.length > app.electionsShown) {
    if (e.key === "Enter" || e.key === " ") {
      app.electionsShown = app.state.elections.length;
      render();
    }
    return;
  }
  if ((app.state.highlights?.length ?? 0) > app.highlightsShown) {
    if (e.key === "Enter" || e.key === " ") {
      app.highlightsShown++;
      render();
    }
    return;
  }
  if (app.state.pendingEvent) {
    const n = Number(e.key);
    if (n >= 1 && n <= app.state.pendingEvent.choices.length) choose(n - 1);
    return;
  }
  const n = Number(e.key);
  if (n >= 1 && n <= TABS.length) {
    app.tab = TABS[n - 1].id;
    render();
    return;
  }
  if (app.tab !== "act") return;
  const ids = activityIds(app.state, app.world);
  const i = app.selected ? ids.indexOf(app.selected) : -1;
  if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
    e.preventDefault();
    app.selected = ids[(i + (e.key === "ArrowRight" ? 1 : -1) + ids.length) % ids.length];
    render();
  } else if (e.key === "Enter" && app.selected) void doActivity(app.selected);
});

// ---------- ツールチップ（マウスを乗せる／長押し） ----------

const tipEl = document.createElement("div");
tipEl.className = "tooltip";
tipEl.setAttribute("role", "tooltip");
document.body.appendChild(tipEl);
let suppressClick = false;
let pressTimer: number | undefined;

function showTip(el: HTMLElement, x: number, _y: number): void {
  const text = el.dataset.tip;
  if (!text) return;
  tipEl.innerHTML = text
    .split("\n")
    .map((l, i) => (i === 0 ? `<b>${esc(l)}</b>` : `<span>${esc(l)}</span>`))
    .join("");
  tipEl.classList.add("is-open");
  const r = tipEl.getBoundingClientRect();
  // 指している要素の下に出し、入らなければ上に出す（要素そのものと隣の行に重ねない）
  const box = el.getBoundingClientRect();
  const left = Math.min(Math.max(8, x - r.width / 2), window.innerWidth - r.width - 8);
  const below = box.bottom + 6;
  const top = below + r.height <= window.innerHeight - 8 ? below : box.top - r.height - 6;
  tipEl.style.left = `${left}px`;
  tipEl.style.top = `${Math.max(8, top)}px`;
}

function hideTip(): void {
  tipEl.classList.remove("is-open");
}

root.addEventListener("pointermove", (e) => {
  if (e.pointerType !== "mouse") {
    window.clearTimeout(pressTimer);
    return;
  }
  const el = (e.target as HTMLElement).closest<HTMLElement>("[data-tip]");
  if (el) showTip(el, e.clientX, e.clientY);
  else hideTip();
});
root.addEventListener("pointerleave", hideTip);
root.addEventListener("pointerdown", (e) => {
  if (e.pointerType === "mouse") return;
  hideTip();
  const el = (e.target as HTMLElement).closest<HTMLElement>("[data-tip]");
  if (!el) return;
  const { clientX, clientY } = e;
  // 長押し（0.45秒）でツールチップを出す
  pressTimer = window.setTimeout(() => {
    suppressClick = true;
    showTip(el, clientX, clientY);
  }, 450);
});
root.addEventListener("pointerup", () => window.clearTimeout(pressTimer));
root.addEventListener("pointercancel", () => window.clearTimeout(pressTimer));
document.addEventListener("pointerdown", (e) => {
  if (e.pointerType !== "mouse" && !(e.target as HTMLElement).closest("[data-tip]")) hideTip();
});
root.addEventListener("contextmenu", (e) => {
  if ((e.target as HTMLElement).closest("[data-tip]")) e.preventDefault();
});

/** 活動のカードの列が横に続いていることを、左右の矢印と端の影で示す */
let cardScroll = 0;
function setupCardScroll(): void {
  const wrap = document.querySelector<HTMLElement>(".cards-wrap");
  const cards = wrap?.querySelector<HTMLElement>(".cards");
  if (!wrap || !cards) return;
  const update = () => {
    wrap.classList.toggle("can-left", cards.scrollLeft > 4);
    wrap.classList.toggle("can-right", cards.scrollLeft + cards.clientWidth < cards.scrollWidth - 4);
  };
  cards.scrollLeft = cardScroll;
  cards.addEventListener("scroll", () => {
    cardScroll = cards.scrollLeft;
    update();
  });
  wrap.querySelectorAll<HTMLElement>(".scroll-hint").forEach((h) =>
    h.addEventListener("click", () =>
      cards.scrollBy({ left: (h.classList.contains("left") ? -1 : 1) * cards.clientWidth * 0.7, behavior: "smooth" }),
    ),
  );
  // 選んだカード、なければおすすめのカードが見える位置に寄せる
  const sel = cards.querySelector<HTMLElement>(".card.is-active") ?? cards.querySelector<HTMLElement>(".tag.rec")?.closest<HTMLElement>(".card") ?? null;
  if (sel) {
    const l = sel.offsetLeft - cards.offsetLeft;
    if (l < cards.scrollLeft || l + sel.offsetWidth > cards.scrollLeft + cards.clientWidth)
      cards.scrollLeft = l - cards.clientWidth / 2 + sel.offsetWidth / 2;
  }
  update();
}

// ---------- 起動 ----------

async function boot(): Promise<void> {
  render();
  const data = await loadNameData();
  app.names = data;
  const { roster, factory } = await createWorld(data, app.seed);
  app.base = { roster, government: formInitialGovernment(roster), factory };
  const quick = params.get("start");
  if (quick) {
    const [origin, party, route, pref, archetype] = quick.split(",");
    app.setup = { origin: origin as OriginId, party, route: route as RouteId, pref: Number(pref), archetype };
    await start();
    // 確認用：?months=N で、休養と地元回りを交互に N か月進める
    const months = Number(params.get("months") ?? 0);
    for (let i = 0; i < months && app.state && !app.state.over; i++) {
      if (app.state.pendingEvent) chooseEvent(app.state, app.world!, 0);
      await takeTurn(app.state, app.world!, i % 3 === 2 ? "rest" : "local");
    }
    // 確認用：&leader=1 で、当選5回の議員として自分の党の党首にして1か月進める（野党の党首の画面を見る）
    if (params.get("leader") && app.state && app.world) {
      app.state.status = "議員";
      app.world.player = { ...app.world.player, terms: 5 };
      app.state.leaders[app.world.player.party] = app.world.player.id;
      if (app.state.pendingEvent) chooseEvent(app.state, app.world, 0);
      await takeTurn(app.state, app.world, "rest");
      if (app.state.pendingEvent) chooseEvent(app.state, app.world, 0);
    }
    if (params.get("select")) app.selected = params.get("select")!;
    if (months) app.electionsShown = params.get("showElection") ? 0 : app.state?.elections.length ?? 0;
    if (months) app.highlightsShown = params.get("showElection") ? 0 : app.state?.highlights?.length ?? 0;
    // 確認用：?overlay=log または help で記録か遊び方を開く
    const overlay = params.get("overlay");
    if (overlay === "log" || overlay === "help") app.overlay = overlay;
    // 確認用：?member=rival で選挙区の相手、数字でその議員の詳しい情報を開く
    const member = params.get("member");
    if (member && app.state && app.world) {
      const rival = app.world.roster.find((m) => m.seat === "小選挙区" && m.district === app.state!.setup.pref && m.id !== app.world!.player.id);
      app.memberId = member === "rival" ? rival?.id : Number(member);
    }
  } else if (params.get("setup")) {
    // 確認用：?setup=newcomer,minsei&step=2 で始め方の途中を開く
    const [origin, party] = params.get("setup")!.split(",");
    app.setup = { origin: origin as OriginId, party };
    app.setupStep = Number(params.get("step") ?? 0);
  }
  render();
}

void boot();
