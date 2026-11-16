// 地図の画面：小選挙区の勝者で塗った地図、議席の構成、選んだ県の議員
import { renderJapanMap } from "../../map/japanMap.js";
import { PARTIES, partyById } from "../../game/parties.js";
import { HOUSE_SEATS, MAJORITY } from "../../game/districts.js";
import type { Member } from "../../game/roster.js";
import type { AppState } from "../state.js";
import { escapeHtml, memberLink, partyChip, prefLabel, rankBadge } from "../format.js";
import { ABILITIES } from "../../game/tables.js";

function seatsPanel(roster: Member[]): string {
  const rows = PARTIES.map((p) => {
    const ms = roster.filter((m) => m.party === p.id);
    return { p, smd: ms.filter((m) => m.seat === "小選挙区").length, pr: ms.filter((m) => m.seat === "比例").length, n: ms.length };
  }).filter((x) => x.n > 0);
  const bar = rows.map(({ p, n }) => `<span class="seg" style="flex:${n};background:${p.color}" title="${p.name} ${n}"></span>`).join("");
  const table = rows
    .map(
      ({ p, smd, pr, n }) =>
        `<tr><td><a href="#party/${p.id}">${partyChip(p.id)}</a></td><td class="num">${smd}</td><td class="num">${pr}</td><td class="num total">${n}</td></tr>`,
    )
    .join("");
  return `<h2>議席の構成</h2>
    <div class="seatbar">${bar}<span class="majority" style="left:${(MAJORITY / HOUSE_SEATS) * 100}%" title="過半数 ${MAJORITY}"></span></div>
    <table class="seat-table"><thead><tr><th>政党</th><th class="num">小選挙区</th><th class="num">比例</th><th class="num">計</th></tr></thead><tbody>${table}</tbody></table>
    <p class="note">定数${HOUSE_SEATS}・過半数${MAJORITY}</p>`;
}

function memberLine(m: Member, label: string): string {
  return `<li><span class="post">${label}</span><span class="who">${partyChip(m.party, false)}${memberLink(m)}<span class="sub">${escapeHtml(partyById(m.party).short)}・${m.terms}回・地盤${m.jiban}</span></span>
    <span class="abs">${ABILITIES.map((a) => rankBadge(m.abilities[a], false)).join("")}</span></li>`;
}

function prefPanel(state: AppState): string {
  const pref = state.selectedPref;
  if (pref === null) return `<h2>県の議員</h2><p class="note">地図の県を押すと、その県の小選挙区の当選者と、その県が地元の比例議員を表示します。</p>`;
  const smd = state.roster.find((m) => m.district === pref);
  const pr = state.roster.filter((m) => m.seat === "比例" && m.home === pref);
  const lines = [smd ? memberLine(smd, "小選挙区") : "", ...pr.map((m) => memberLine(m, "比例"))].join("");
  return `<h2>${escapeHtml(prefLabel(pref))}の議員</h2><ul class="posts">${lines}</ul>`;
}

export function renderMapView(root: HTMLElement, state: AppState, rerender: () => void): void {
  root.innerHTML = `<div class="overview">
      <div class="map-panel"><div id="map" class="map-frame"></div><p id="map-info" class="map-info">県にマウスを乗せると小選挙区の当選者を表示します。</p></div>
      <div class="side">
        <section class="panel">${seatsPanel(state.roster)}</section>
        <section class="panel" id="pref-panel">${prefPanel(state)}</section>
      </div>
    </div>`;
  const info = root.querySelector<HTMLElement>("#map-info")!;
  const winner = (code: number) => state.roster.find((m) => m.district === code);
  renderJapanMap(root.querySelector("#map"), {
    cellSize: 16,
    fill: (code) => {
      const m = winner(code);
      return m ? partyById(m.party).color : "#d4d4d8";
    },
    onHover(code) {
      const m = code === null ? undefined : winner(code);
      info.textContent = m && code !== null ? `${prefLabel(code)}：${m.name.displayName}（${partyById(m.party).short}・${m.terms}回・地盤${m.jiban}）` : "県にマウスを乗せると小選挙区の当選者を表示します。";
    },
    onClick(code) {
      state.selectedPref = state.selectedPref === code ? null : code;
      // 個人の画面で左右に送る順は、選んだ県の議員の並びにする
      const smd = winner(code);
      state.memberOrder = [smd, ...state.roster.filter((m) => m.seat === "比例" && m.home === code)].filter((m): m is Member => !!m).map((m) => m.id);
      rerender();
    },
  });
  // 選んだ県を強調する
  if (state.selectedPref !== null) root.querySelector(`path.pref[data-code="${state.selectedPref}"]`)?.classList.add("selected");
}
