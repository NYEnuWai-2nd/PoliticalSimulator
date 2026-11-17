// 自党の画面：政党の切り替え、党の概要、所属議員の一覧（列見出しで並べ替え）
import { IDEOLOGY_AXES, PARTIES, partyById } from "../../game/parties.js";
import { ABILITIES } from "../../game/tables.js";
import type { Ability } from "../../game/tables.js";
import { ageOf } from "../../game/roster.js";
import type { Member } from "../../game/roster.js";
import type { AppState } from "../state.js";
import { escapeHtml, memberLink, partyChip, rankBadge, seatLabel } from "../format.js";
import { ideologyScale } from "./ideology.js";

type SortKey = "id" | "age" | "terms" | "jiban" | Ability;
let sortKey: SortKey = "id";
let sortDesc = false;

const valueOf = (m: Member, key: SortKey): number =>
  key === "id" ? m.id : key === "age" ? ageOf(m) : key === "terms" ? m.terms : key === "jiban" ? m.jiban : m.abilities[key];

function header(key: SortKey, label: string, cls = ""): string {
  const mark = sortKey === key ? (sortDesc ? " ▼" : " ▲") : "";
  return `<th class="sortable ${cls}" data-sort="${key}">${label}${mark}</th>`;
}

function summary(party: string, members: Member[]): string {
  const p = partyById(party);
  const smd = members.filter((m) => m.seat === "小選挙区").length;
  const avg = (a: Ability) => Math.round(members.reduce((s, m) => s + m.abilities[a], 0) / Math.max(1, members.length));
  const hereditary = members.filter((m) => m.lineage === "世襲" || m.lineage === "名門").length;
  const meanIdeology = Object.fromEntries(
    IDEOLOGY_AXES.map((x) => [x.id, members.reduce((s, m) => s + m.ideology[x.id], 0) / Math.max(1, members.length)]),
  );
  return `<section class="panel party-summary" style="--party:${p.color}">
      <h2>${escapeHtml(p.name)}</h2>
      <p class="stats"><span>議席 <b>${members.length}</b>（小選挙区${smd}・比例${members.length - smd}）</span><span>世襲 ${hereditary}人</span></p>
      <div class="avg"><span class="label">平均能力</span>${ABILITIES.map((a) => `<span class="avg-item"><span class="name">${a}</span>${rankBadge(avg(a))}</span>`).join("")}</div>
      <div class="ideology-block"><span class="label">思想（議員の平均）</span>${ideologyScale(meanIdeology as never, p.ideology_center)}</div>
    </section>`;
}

export function renderPartyView(root: HTMLElement, state: AppState, rerender: () => void): void {
  const party = state.selectedParty;
  const members = state.roster.filter((m) => m.party === party);
  const sorted = [...members].sort((a, b) => (valueOf(a, sortKey) - valueOf(b, sortKey)) * (sortDesc ? -1 : 1) || a.id - b.id);
  state.memberOrder = sorted.map((m) => m.id);
  const tabs = PARTIES.filter((p) => state.roster.some((m) => m.party === p.id))
    .map((p) => `<a class="party-tab${p.id === party ? " active" : ""}" href="#party/${p.id}" style="--party:${p.color}">${partyChip(p.id)}</a>`)
    .join("");
  const rows = sorted
    .map(
      (m) => `<tr>
      <td>${m.id}</td>
      <td class="role">${escapeHtml(state.postOf.get(m.id) ?? "")}</td>
      <td class="name">${memberLink(m)}<span class="kana">${escapeHtml(`${m.name.surnameKana} ${m.name.givenNameKana}`)}</span></td>
      <td>${escapeHtml(seatLabel(m))}</td>
      <td>${ageOf(m)}</td>
      <td>${m.terms}回</td>
      <td>${escapeHtml(m.archetype)}</td>
      <td>${m.lineage === "一般" ? "" : escapeHtml(m.lineage)}</td>
      ${ABILITIES.map((a) => `<td class="ab">${rankBadge(m.abilities[a])}</td>`).join("")}
      <td class="jiban">${m.jiban}</td>
      <td>${m.specialties.map(escapeHtml).join("、")}</td>
    </tr>`,
    )
    .join("");
  root.innerHTML = `<nav class="party-tabs">${tabs}</nav>
    ${summary(party, members)}
    <div class="table-wrap"><table class="roster">
      <thead><tr>${header("id", "番号")}<th>役職</th><th>氏名</th><th>選挙区</th>${header("age", "年齢")}${header("terms", "当選")}<th>経歴</th><th>家系</th>${ABILITIES.map((a) => header(a, a, "ab")).join("")}${header("jiban", "地盤")}<th>得意分野</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>`;
  root.querySelectorAll<HTMLElement>("th.sortable").forEach((th) =>
    th.addEventListener("click", () => {
      const key = th.dataset.sort as SortKey;
      // 能力などは高い順から見たいことが多いので、初めて押したときは降順にする
      sortDesc = sortKey === key ? !sortDesc : key !== "id";
      sortKey = key;
      rerender();
    }),
  );
}
