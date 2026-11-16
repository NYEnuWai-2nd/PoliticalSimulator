import "./style.css";
import { loadNameData } from "./data/nameData.js";
import { ageOf, generateRoster, START_YEAR } from "./game/roster.js";
import type { Member } from "./game/roster.js";
import { ABILITIES, rankOf } from "./game/tables.js";
import { IDEOLOGY_AXES, PARTIES, partyById } from "./game/parties.js";
import { HOUSE_SEATS, MAJORITY, PR_SEATS, SMD_SEATS } from "./game/districts.js";
import { PREFECTURES, renderJapanMap, updateFills } from "./map/japanMap.js";

const DEFAULT_SEED = 2026;
const prefLabel = (code: number) => PREFECTURES[code - 1]?.label ?? String(code);

const app = document.querySelector<HTMLDivElement>("#app")!;
app.innerHTML = `
  <header>
    <h1>政治シミュレーション（仮）</h1>
    <p class="lead">${START_YEAR}年・一院制 定数${HOUSE_SEATS}（小選挙区${SMD_SEATS}・比例${PR_SEATS}、試作）。開始時点の議席は2024年衆院選をもとにしています。</p>
  </header>
  <form id="controls">
    <label>シード <input id="seed" type="number" value="${DEFAULT_SEED}" /></label>
    <label>政党 <select id="party"><option value="">すべて</option>${PARTIES.filter((p) => !p.appears_later)
      .map((p) => `<option value="${p.id}">${p.name}</option>`)
      .join("")}</select></label>
    <button type="submit">生成</button>
  </form>
  <div class="overview">
    <div class="map-panel">
      <div id="map" class="map-frame"></div>
      <p id="map-info" class="map-info">県にマウスを乗せると小選挙区の当選者を表示します。クリックするとその県の議員だけを表に出します。</p>
    </div>
    <section id="seats" class="seats-panel" aria-label="議席の構成"></section>
  </div>
  <p id="status" role="status">名前データを読み込んでいます…</p>
  <div class="table-wrap">
    <table>
      <thead>
        <tr><th>番号</th><th>政党</th><th>選挙区</th><th>氏名</th><th>性別</th><th>年齢</th><th>経歴類型</th><th>当選</th><th>家系</th>${ABILITIES.map((a) => `<th class="ab">${a}</th>`).join("")}<th>地盤</th><th>得意分野</th><th>性格</th><th title="${IDEOLOGY_AXES.map((x) => `${x.name}：−${x.minus}／＋${x.plus}`).join("\n")}">思想</th></tr>
      </thead>
      <tbody id="roster"></tbody>
    </table>
  </div>
`;

const form = app.querySelector<HTMLFormElement>("#controls")!;
const seedInput = app.querySelector<HTMLInputElement>("#seed")!;
const partySelect = app.querySelector<HTMLSelectElement>("#party")!;
const seatsEl = app.querySelector<HTMLElement>("#seats")!;
const mapEl = app.querySelector<HTMLDivElement>("#map")!;
const mapInfo = app.querySelector<HTMLParagraphElement>("#map-info")!;
const status = app.querySelector<HTMLParagraphElement>("#status")!;
const tbody = app.querySelector<HTMLTableSectionElement>("#roster")!;

let roster: Member[] = [];
/** クリックで絞り込んでいる県（null なら全県） */
let selectedPref: number | null = null;

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

const smdWinner = (pref: number) => roster.find((m) => m.district === pref);

const svg = renderJapanMap(mapEl, {
  cellSize: 16,
  fill: () => "#d4d4d8",
  onHover(code) {
    if (code === null) {
      mapInfo.textContent = selectedPref === null ? "県にマウスを乗せると小選挙区の当選者を表示します。" : `${prefLabel(selectedPref)}の議員を表示中（もう一度クリックで解除）`;
      return;
    }
    const m = smdWinner(code);
    mapInfo.textContent = m ? `${prefLabel(code)}：${m.name.displayName}（${partyById(m.party).short}・${m.terms}回・地盤${m.jiban}）` : prefLabel(code);
  },
  onClick(code) {
    selectedPref = selectedPref === code ? null : code;
    mapInfo.textContent = selectedPref === null ? "絞り込みを解除しました。" : `${prefLabel(code)}の議員を表示中（もう一度クリックで解除）`;
    renderTable();
  },
});

function renderSeats(members: Member[]): string {
  const rows = PARTIES.map((p) => {
    const ms = members.filter((m) => m.party === p.id);
    return { p, smd: ms.filter((m) => m.seat === "小選挙区").length, pr: ms.filter((m) => m.seat === "比例").length, n: ms.length };
  }).filter((x) => x.n > 0);
  const bar = rows
    .map(({ p, n }) => `<span class="seg" style="flex:${n};background:${p.color}" title="${p.name} ${n}"></span>`)
    .join("");
  const table = rows
    .map(
      ({ p, smd, pr, n }) =>
        `<tr><td><span class="chip" style="background:${p.color}"></span>${p.short}</td><td class="num">${smd}</td><td class="num">${pr}</td><td class="num total">${n}</td></tr>`,
    )
    .join("");
  return `<div class="seatbar">${bar}<span class="majority" style="left:${(MAJORITY / HOUSE_SEATS) * 100}%" title="過半数 ${MAJORITY}"></span></div>
    <table class="seat-table"><thead><tr><th>政党</th><th class="num">小選挙区</th><th class="num">比例</th><th class="num">計</th></tr></thead><tbody>${table}</tbody></table>
    <p class="note">過半数 ${MAJORITY}</p>`;
}

function renderAbility(value: number): string {
  const rank = rankOf(value);
  return `<td class="ab rank-${rank}"><span class="rank">${rank}</span><span class="val">${value}</span></td>`;
}

function signed(v: number): string {
  return v > 0 ? `+${v}` : v < 0 ? `−${-v}` : "0";
}

function renderRow(m: Member): string {
  const n = m.name;
  const party = partyById(m.party);
  const seat = m.seat === "小選挙区" ? prefLabel(m.district!) : `比例（${prefLabel(m.home)}）`;
  return `<tr>
    <td>${m.id}</td>
    <td class="party"><span class="chip" style="background:${party.color}"></span>${escapeHtml(party.short)}</td>
    <td>${escapeHtml(seat)}</td>
    <td class="name">${escapeHtml(n.displayName)}<span class="kana">${escapeHtml(`${n.surnameKana} ${n.givenNameKana}`)}</span></td>
    <td>${m.gender}</td>
    <td>${ageOf(m)}</td>
    <td>${escapeHtml(m.archetype)}</td>
    <td>${m.terms}回</td>
    <td>${m.lineage === "なし" ? "" : escapeHtml(m.lineage)}</td>
    ${ABILITIES.map((a) => renderAbility(m.abilities[a])).join("")}
    <td class="jiban">${m.jiban}</td>
    <td>${m.specialties.map(escapeHtml).join("、")}</td>
    <td>${m.traits.map(escapeHtml).join("、")}</td>
    <td class="ideology">${IDEOLOGY_AXES.map((x) => `${x.name}${signed(m.ideology[x.id])}`).join(" ")}</td>
  </tr>`;
}

function renderTable(): void {
  const party = partySelect.value;
  const rows = roster.filter((m) => (!party || m.party === party) && (selectedPref === null || m.home === selectedPref));
  tbody.innerHTML = rows.map(renderRow).join("");
}

async function regenerate(): Promise<void> {
  const seed = Number.parseInt(seedInput.value, 10) || 0;
  try {
    const data = await loadNameData();
    roster = await generateRoster(data, seed);
    updateFills(svg, (code) => {
      const m = smdWinner(code);
      return m ? partyById(m.party).color : "#d4d4d8";
    });
    seatsEl.innerHTML = renderSeats(roster);
    renderTable();
    status.textContent = `シード ${seed} で ${roster.length} 人を生成しました。`;
  } catch (e) {
    status.textContent = `エラー：${e instanceof Error ? e.message : String(e)}`;
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  void regenerate();
});
partySelect.addEventListener("change", renderTable);

void regenerate();
