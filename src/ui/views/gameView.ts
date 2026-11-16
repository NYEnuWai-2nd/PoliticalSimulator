// 政局の画面：月ごとの状況、行動、法案、出来事と採決の記録
import rulesRaw from "../../../data/game/rules.json";
import {
  BILLS,
  billForecast,
  billName,
  dateLabel,
  endTurn,
  inSession,
  ministerFor,
  nemawashi,
  pressConference,
  primeMinister,
  startDrafting,
  submitBill,
  talkWithParty,
} from "../../game/game.js";
import type { GameContext, GameState, LogEntry } from "../../game/game.js";
import { partyById } from "../../game/parties.js";
import { MAJORITY } from "../../game/districts.js";
import type { AppState } from "../state.js";
import { escapeHtml, memberLink, partyChip } from "../format.js";

/** 支持率の推移の小さな折れ線 */
function sparkline(values: number[]): string {
  const w = 160;
  const h = 36;
  const max = 60;
  const pts = values
    .slice(-24)
    .map((v, i, arr) => `${(i / Math.max(1, arr.length - 1)) * w},${h - (Math.min(v, max) / max) * h}`)
    .join(" ");
  const line = h - (rulesRaw.approval.no_confidence_threshold / max) * h;
  return `<svg class="spark" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" aria-label="支持率の推移">
    <line x1="0" x2="${w}" y1="${line}" y2="${line}" class="danger" />
    <polyline points="${pts}" fill="none" />
  </svg>`;
}

function statusPanel(g: GameState, ctx: GameContext): string {
  const budget = g.bills[rulesRaw.budget.bill];
  const budgetText =
    budget.status === "成立" ? "成立済み" : g.month <= rulesRaw.budget.deadline_month ? `未成立（${rulesRaw.budget.deadline_month}月末まで）` : "未成立（暫定予算）";
  const dots = Array.from({ length: rulesRaw.action_points_per_turn }, (_, i) => `<span class="ap${i < g.actionPoints ? " on" : ""}"></span>`).join("");
  return `<section class="panel game-status">
      <div class="date"><b>${dateLabel(g)}</b><span class="session${inSession(g) ? " on" : ""}">${inSession(g) ? "国会会期中" : "閉会中"}</span></div>
      <div class="stat"><span class="label">内閣支持率</span><b class="big">${g.approval}%</b>${sparkline(g.approvalHistory)}</div>
      <div class="stat"><span class="label">残りの行動</span><span class="aps">${dots}</span></div>
      <div class="stat"><span class="label">与党の結束</span><b>${Math.round(g.cohesion * 100)}%</b></div>
      <div class="stat"><span class="label">${g.budgetYear}年度予算</span><b>${budgetText}</b></div>
      <div class="stat"><span class="label">首相</span>${memberLink(primeMinister(ctx))}</div>
    </section>`;
}

function partiesPanel(g: GameState, ctx: GameContext): string {
  // 議席のない党とは協議しても採決に影響しないので出さない
  const seated = new Set(ctx.roster.map((m) => m.party));
  const rows = Object.entries(g.cooperation)
    .filter(([id]) => seated.has(id))
    .sort((a, b) => (g.ruling.partners.includes(b[0]) ? 1 : 0) - (g.ruling.partners.includes(a[0]) ? 1 : 0) || b[1] - a[1])
    .map(([id, v]) => {
      const p = partyById(id);
      return `<li>
        <span class="who">${partyChip(id)}${g.ruling.partners.includes(id) ? `<span class="tag">連立</span>` : ""}</span>
        <span class="bar"><span style="width:${v}%;background:${p.color}"></span></span>
        <span class="num">${v}</span>
        <button data-act="talk" data-party="${id}" ${g.actionPoints <= 0 || g.over ? "disabled" : ""}>協議</button>
      </li>`;
    })
    .join("");
  return `<section class="panel">
      <h2>各党の協力度</h2>
      <p class="note">協力度が高いほど、その党は政府の法案に賛成しやすい。協議は官房長官が担当する。毎月少しずつ下がる。</p>
      <ul class="coop">${rows}</ul>
      <div class="actions">
        <button data-act="nemawashi" ${g.actionPoints <= 0 || g.over ? "disabled" : ""}>党内の根回し<span class="note">幹事長・結束↑</span></button>
        <button data-act="press" ${g.actionPoints <= 0 || g.over ? "disabled" : ""}>記者会見<span class="note">首相の弁舌・支持率</span></button>
      </div>
    </section>`;
}

function billsPanel(g: GameState, ctx: GameContext): string {
  const rows = BILLS.map((b) => {
    const bs = g.bills[b.id];
    const minister = ministerFor(ctx, b);
    const forecast = billForecast(g, ctx, b);
    const ok = forecast >= MAJORITY;
    const canAct = g.actionPoints > 0 && !g.over;
    let action = "";
    if (bs.status === "未着手") action = `<button data-act="draft" data-bill="${b.id}" ${canAct ? "" : "disabled"}>準備を始める</button>`;
    else if (bs.status === "準備完了" || bs.status === "否決")
      action = `<button data-act="submit" data-bill="${b.id}" ${canAct && inSession(g) ? "" : "disabled"}>${bs.status === "否決" ? "再提出" : "国会に出す"}</button>`;
    const progress =
      bs.status === "準備中"
        ? `<span class="progress"><span style="width:${Math.min(100, (bs.progress / b.work) * 100)}%"></span></span>`
        : "";
    return `<tr class="status-${bs.status}">
      <td><b>${escapeHtml(billName(g, b))}</b><span class="desc">${escapeHtml(b.description)}</span></td>
      <td>${escapeHtml(b.field)}<span class="desc">${memberLink(minister)}${minister.specialties.includes(b.field) ? " ◎" : ""}</span></td>
      <td class="st">${bs.status}${progress}</td>
      <td class="num forecast ${ok ? "ok" : "ng"}" title="各議員の賛成確率の合計（過半数${MAJORITY}）">${forecast.toFixed(1)}</td>
      <td>${action}</td>
    </tr>`;
  }).join("");
  return `<section class="panel">
      <h2>法案</h2>
      <p class="note">準備は担当大臣の政策の能力で毎月進む。国会に出した法案は月末に採決する。「見込み」は賛成票の見込みで、過半数は${MAJORITY}。</p>
      <div class="table-wrap"><table class="bills">
        <thead><tr><th>法案</th><th>担当</th><th>状況</th><th class="num">見込み</th><th></th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div>
    </section>`;
}

function voteDetail(entry: LogEntry): string {
  if (!entry.vote) return "";
  const parts = entry.vote.byParty
    .filter((t) => t.yes + t.no > 0)
    .map((t) => `<span class="vp">${partyChip(t.party)}<span class="y">${t.yes}</span>/<span class="n">${t.no}</span></span>`)
    .join("");
  return `<div class="vote-detail">${parts}${entry.vote.rebels.length ? `<span class="note">造反 ${entry.vote.rebels.length}人</span>` : ""}</div>`;
}

function logPanel(g: GameState): string {
  const items = [...g.log]
    .reverse()
    .slice(0, 40)
    .map((l) => `<li class="log-${l.kind}"><span class="when">${l.date}</span><span class="kind">${l.kind}</span><span class="text">${escapeHtml(l.text)}${voteDetail(l)}</span></li>`)
    .join("");
  return `<section class="panel"><h2>記録</h2><ul class="log">${items}</ul></section>`;
}

export function renderGameView(root: HTMLElement, state: AppState, rerender: () => void): void {
  const g = state.game;
  const ctx: GameContext = { roster: state.roster, government: state.government };
  if (!g) {
    root.innerHTML = `<p class="note">準備中です。</p>`;
    return;
  }
  const over = g.over ? `<section class="panel game-over"><h2>ゲーム終了</h2><p>${escapeHtml(g.over)}</p><p class="note">シードを変えて「生成」を押すと最初からやり直せます。</p></section>` : "";
  root.innerHTML = `${over}
    <div class="game-grid">
      <div class="game-main">
        ${statusPanel(g, ctx)}
        ${billsPanel(g, ctx)}
      </div>
      <div class="game-side">
        <button class="end-turn" data-act="end" ${g.over ? "disabled" : ""}>月末へ進む ▶<span class="note">${g.actionPoints > 0 ? `行動があと${g.actionPoints}回残っています` : "採決と出来事を処理して次の月へ"}</span></button>
        ${partiesPanel(g, ctx)}
        ${logPanel(g)}
      </div>
    </div>`;
  root.querySelectorAll<HTMLButtonElement>("button[data-act]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const { act, bill, party } = btn.dataset;
      if (act === "end") endTurn(g, ctx);
      else if (act === "draft" && bill) startDrafting(g, ctx, bill);
      else if (act === "submit" && bill) submitBill(g, ctx, bill);
      else if (act === "talk" && party) talkWithParty(g, ctx, party);
      else if (act === "nemawashi") nemawashi(g, ctx);
      else if (act === "press") pressConference(g, ctx);
      rerender();
    }),
  );
}
