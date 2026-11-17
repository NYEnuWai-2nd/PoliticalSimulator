// 個人の画面（パワプロの能力画面に当たる）。直前の一覧の並びで、前後の議員に送れる
import { partyById } from "../../game/parties.js";
import { ABILITIES, rankOf } from "../../game/tables.js";
import { ageOf } from "../../game/roster.js";
import type { Member } from "../../game/roster.js";
import type { AppState } from "../state.js";
import { escapeHtml, seatLabel } from "../format.js";
import { ideologyScale } from "./ideology.js";

const JIBAN_TEXT = ["", "比例頼み・落下傘", "接戦区", "比較的安定", "負けない選挙区"];

/** 前後の議員の番号。並びにいない議員なら並びの先頭と末尾に送る */
export function neighbors(state: AppState, id: number): { prev?: number; next?: number; index: number; total: number } {
  const order = state.memberOrder.length ? state.memberOrder : state.roster.map((m) => m.id);
  const i = order.indexOf(id);
  if (i < 0) return { prev: order[order.length - 1], next: order[0], index: 0, total: order.length };
  return { prev: order[(i - 1 + order.length) % order.length], next: order[(i + 1) % order.length], index: i + 1, total: order.length };
}

function abilityRow(label: string, value: number): string {
  const rank = rankOf(value);
  return `<div class="ability-row rank-${rank}">
      <span class="ab-label">${label}</span>
      <span class="ab-rank">${rank}</span>
      <span class="ab-value">${value}</span>
      <span class="ab-bar"><span style="width:${value}%"></span></span>
    </div>`;
}

/** 1〜5の値を5つの点で表す */
function pips(v: number): string {
  return `<span class="pip-row" title="${v} / 5">${[1, 2, 3, 4, 5].map((i) => `<span class="pip${i <= v ? " on" : ""}"></span>`).join("")}</span>`;
}

function chips(items: string[], cls: string): string {
  return items.length ? items.map((t) => `<span class="tag ${cls}">${escapeHtml(t)}</span>`).join("") : `<span class="note">なし</span>`;
}

export function renderMemberView(root: HTMLElement, state: AppState, id: number | undefined): void {
  const pm = state.roster.find((m) => m.fixedRole === "首相");
  const m: Member | undefined = state.roster.find((x) => x.id === id) ?? pm ?? state.roster[0];
  if (!m) {
    root.innerHTML = `<p class="note">議員がいません。</p>`;
    return;
  }
  const party = partyById(m.party);
  const nb = neighbors(state, m.id);
  const post = state.postOf.get(m.id);
  root.innerHTML = `
    <div class="member-nav">
      <a class="nav-btn" href="#member/${nb.prev}" title="前の議員（←キー）">◀ 前</a>
      <span class="note">${nb.index} / ${nb.total}　← → キーでも送れます</span>
      <a class="nav-btn" href="#member/${nb.next}" title="次の議員（→キー）">次 ▶</a>
    </div>
    <article class="member-card" style="--party:${party.color}">
      <header class="card-head">
        <div class="card-title">
          <span class="card-party">${escapeHtml(party.name)}</span>
          <h2>${escapeHtml(m.name.displayName)}<span class="kana">${escapeHtml(`${m.name.surnameKana} ${m.name.givenNameKana}`)}</span></h2>
        </div>
        <dl class="card-facts">
          <div><dt>役職</dt><dd>${escapeHtml(post ?? "—")}</dd></div>
          <div><dt>選挙区</dt><dd>${escapeHtml(seatLabel(m))}</dd></div>
          <div><dt>年齢</dt><dd>${ageOf(m)}歳・${m.gender}</dd></div>
          <div><dt>当選</dt><dd>${m.terms}回（${escapeHtml(m.tier)}）</dd></div>
        </dl>
      </header>
      <div class="card-body">
        <section class="abilities">
          <h3>基礎能力</h3>
          ${ABILITIES.map((a) => abilityRow(a, m.abilities[a])).join("")}
        </section>
        <section class="profile">
          <h3>地盤</h3>
          <div class="jiban-meter" title="地盤 ${m.jiban}">${[1, 2, 3, 4].map((i) => `<span class="${i <= m.jiban ? "on" : ""}"></span>`).join("")}<span class="jiban-text">${m.jiban}　${JIBAN_TEXT[m.jiban]}</span></div>
          <h3>信念の固さ・党への忠誠</h3>
          <p class="pips"><span class="pip-label">信念</span>${pips(m.conviction)}<span class="pip-label">忠誠</span>${pips(m.loyalty)}</p>
          <h3>経歴</h3>
          <p>${escapeHtml(m.archetype)}${m.lineage === "一般" ? "" : `　<span class="tag lineage">${escapeHtml(m.lineage)}</span>`}</p>
          <h3>得意分野</h3>
          <p>${chips(m.specialties, "specialty")}</p>
          <h3>性格</h3>
          <p>${chips(m.traits, "trait")}</p>
          <h3>持ち味</h3>
          <p class="note">（未実装）</p>
        </section>
      </div>
      <section class="card-ideology">
        <h3>思想<span class="note">　● 本人　○ 党の中心</span></h3>
        ${ideologyScale(m.ideology, party.ideology_center)}
      </section>
    </article>`;
}
