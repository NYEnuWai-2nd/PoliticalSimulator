// 画面で共通に使う表示の部品
import { PREFECTURES } from "../map/japanMap.js";
import { partyById } from "../game/parties.js";
import { rankOf } from "../game/tables.js";
import type { Member } from "../game/roster.js";

export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

export const prefLabel = (code: number) => PREFECTURES[code - 1]?.label ?? String(code);

export function signed(v: number): string {
  return v > 0 ? `+${v}` : v < 0 ? `−${-v}` : "0";
}

export function partyChip(partyId: string, withName = true): string {
  const p = partyById(partyId);
  return `<span class="chip" style="background:${p.color}"></span>${withName ? escapeHtml(p.short) : ""}`;
}

/** ランクの小さな札（表の中で使う） */
export function rankBadge(value: number, withValue = true): string {
  const rank = rankOf(value);
  return `<span class="rank-badge rank-${rank}"><span class="rank">${rank}</span>${withValue ? `<span class="val">${value}</span>` : ""}</span>`;
}

/** 議員の名前。押すと個人の画面に移る */
export function memberLink(m: Member): string {
  return `<a class="member-link" href="#member/${m.id}" data-member="${m.id}">${escapeHtml(m.name.displayName)}</a>`;
}

export function seatLabel(m: Member): string {
  if (m.seat === "なし") return `浪人・候補（${prefLabel(m.home)}）`;
  return m.seat === "小選挙区" ? prefLabel(m.district!) : `比例（${prefLabel(m.home)}）`;
}
