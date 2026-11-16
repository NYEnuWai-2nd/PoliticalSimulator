// 内閣の画面：閣僚と与党の党三役
import { partyById } from "../../game/parties.js";
import { ABILITIES } from "../../game/tables.js";
import type { Appointment } from "../../game/cabinet.js";
import type { AppState } from "../state.js";
import { escapeHtml, memberLink, partyChip, rankBadge } from "../format.js";

function block(gov: Appointment[], kind: "内閣" | "党", title: string): string {
  const rows = gov
    .filter((a) => a.post.kind === kind)
    .map(({ post, member: m, specialtyMatch }) => {
      const field = post.field
        ? `<span class="field${specialtyMatch ? " match" : ""}" title="${specialtyMatch ? "得意分野と一致" : `得意分野：${m.specialties.join("、")}`}">${specialtyMatch ? "◎ 得意分野" : "△ 分野外"}</span>`
        : "";
      return `<li>
        <span class="post">${post.name}</span>
        <span class="who">${partyChip(m.party, false)}${memberLink(m)}<span class="sub">${escapeHtml(partyById(m.party).short)}・${m.terms}回</span>${field}</span>
        <span class="abs">${ABILITIES.map((a) => `<span class="ab-cell" title="${a}">${rankBadge(m.abilities[a], false)}</span>`).join("")}</span>
      </li>`;
    })
    .join("");
  return `<section class="panel"><h2>${title}</h2>
    <div class="posts-head"><span></span><span></span><span class="abs">${ABILITIES.map((a) => `<span class="ab-cell">${a.slice(0, 2)}</span>`).join("")}</span></div>
    <ul class="posts">${rows}</ul></section>`;
}

export function renderCabinetView(root: HTMLElement, state: AppState): void {
  state.memberOrder = state.government.map((a) => a.member.id);
  root.innerHTML = `<div class="government">${block(state.government, "内閣", "内閣")}${block(state.government, "党", "民政党の党三役")}</div>`;
}
