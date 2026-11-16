import "./style.css";
import { loadNameData } from "./data/nameData.js";
import { generateRoster, START_YEAR } from "./game/roster.js";
import { formInitialGovernment, RULING_PARTY } from "./game/cabinet.js";
import { HOUSE_SEATS, PR_SEATS, SMD_SEATS } from "./game/districts.js";
import { parseRoute, routeHash } from "./ui/state.js";
import type { AppState, Route } from "./ui/state.js";
import { renderMapView } from "./ui/views/mapView.js";
import { renderPartyView } from "./ui/views/partyView.js";
import { renderCabinetView } from "./ui/views/cabinetView.js";
import { neighbors, renderMemberView } from "./ui/views/memberView.js";
import { renderGameView } from "./ui/views/gameView.js";
import { createGame } from "./game/game.js";
import { isSceneOpen, showScenes } from "./ui/sceneModal.js";

const DEFAULT_SEED = 2026;

/** タブ。数字キーで切り替えられる */
const TABS: { view: Route["view"]; label: string; key: string }[] = [
  { view: "game", label: "政局", key: "1" },
  { view: "map", label: "地図", key: "2" },
  { view: "party", label: "党内", key: "3" },
  { view: "cabinet", label: "内閣", key: "4" },
  { view: "member", label: "個人", key: "5" },
];

const app = document.querySelector<HTMLDivElement>("#app")!;
app.innerHTML = `
  <header class="app-head">
    <div>
      <h1>政治シミュレーション（仮）</h1>
      <p class="lead">${START_YEAR}年・一院制 定数${HOUSE_SEATS}（小選挙区${SMD_SEATS}・比例${PR_SEATS}、試作）</p>
    </div>
    <form id="controls">
      <label>シード <input id="seed" type="number" value="${DEFAULT_SEED}" /></label>
      <button type="submit">生成</button>
    </form>
  </header>
  <nav class="tabs" aria-label="画面の切り替え">
    ${TABS.map((t) => `<a class="tab" data-view="${t.view}" href="#${t.view}">${t.label}<kbd>${t.key}</kbd></a>`).join("")}
  </nav>
  <p id="status" role="status">名前データを読み込んでいます…</p>
  <main id="view"></main>
`;

const seedInput = app.querySelector<HTMLInputElement>("#seed")!;
const status = app.querySelector<HTMLParagraphElement>("#status")!;
const viewEl = app.querySelector<HTMLElement>("#view")!;

const state: AppState = {
  seed: DEFAULT_SEED,
  roster: [],
  government: [],
  postOf: new Map(),
  memberOrder: [],
  selectedPref: null,
  selectedParty: RULING_PARTY,
};

/** 個人の画面で最後に見ていた議員（「個人」のタブを押したときに戻る先） */
let lastMemberId: number | undefined;

function render(): void {
  if (!state.roster.length) return;
  const route = parseRoute(location.hash);
  for (const tab of app.querySelectorAll<HTMLElement>(".tab")) tab.classList.toggle("active", tab.dataset.view === route.view);
  const rerender = () => render();
  switch (route.view) {
    case "game":
      renderGameView(viewEl, state, rerender);
      // 月末の出来事や採決の結果をポップアップで見せる
      if (state.game) showScenes(state.game, rerender);
      break;
    case "map":
      renderMapView(viewEl, state, rerender);
      break;
    case "party":
      if (route.party) state.selectedParty = route.party;
      renderPartyView(viewEl, state, rerender);
      break;
    case "cabinet":
      renderCabinetView(viewEl, state);
      break;
    case "member":
      if (route.id) lastMemberId = route.id;
      renderMemberView(viewEl, state, route.id ?? lastMemberId);
      break;
  }
}

function go(route: Route): void {
  const hash = routeHash(route);
  if (location.hash === hash) render();
  else location.hash = hash;
}

async function regenerate(): Promise<void> {
  state.seed = Number.parseInt(seedInput.value, 10) || 0;
  try {
    const data = await loadNameData();
    state.roster = await generateRoster(data, state.seed);
    state.government = formInitialGovernment(state.roster);
    state.postOf = new Map(state.government.map((a) => [a.member.id, a.post.name]));
    state.game = createGame(state.seed, { roster: state.roster, government: state.government });
    state.memberOrder = [];
    state.selectedPref = null;
    lastMemberId = undefined;
    status.textContent = `シード ${state.seed} で ${state.roster.length} 人を生成しました。`;
    render();
  } catch (e) {
    status.textContent = `エラー：${e instanceof Error ? e.message : String(e)}`;
  }
}

app.querySelector<HTMLFormElement>("#controls")!.addEventListener("submit", (e) => {
  e.preventDefault();
  void regenerate();
});

window.addEventListener("hashchange", render);

// 数字キーで画面を切り替え、個人の画面では左右キーで前後の議員に送る
window.addEventListener("keydown", (e) => {
  if (isSceneOpen() || e.altKey || e.ctrlKey || e.metaKey || (e.target as HTMLElement).closest("input, select, textarea")) return;
  const tab = TABS.find((t) => t.key === e.key);
  if (tab) {
    go({ view: tab.view } as Route);
    return;
  }
  const route = parseRoute(location.hash);
  if (route.view === "member" && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
    const id = route.id ?? lastMemberId ?? state.roster.find((m) => m.fixedRole === "首相")?.id;
    if (id === undefined) return;
    const nb = neighbors(state, id);
    const target = e.key === "ArrowLeft" ? nb.prev : nb.next;
    if (target !== undefined) go({ view: "member", id: target });
  }
});

void regenerate();
