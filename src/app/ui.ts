// 画面で共通に使う小さな部品
import { iconSvg } from "../ui/icons.js";
import { partyById } from "../game/parties.js";
import { rankOf } from "../game/tables.js";

export const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export const icon = (id: string, size = 24, label = "") => iconSvg(id, size, label);

export const partyColor = (id: string) => partyById(id).color;

export function chip(party: string): string {
  return `<span class="chip" style="background:${partyColor(party)}"></span>`;
}

export function rankBadge(v: number): string {
  const r = rankOf(v);
  return `<span class="rank" style="--rc:var(--rank-${r})" title="${v}">${r}</span>`;
}

/** 顔の札（名字の1文字目を党の色の札に出す） */
export function face(name: string, party: string, cls = ""): string {
  return `<span class="face ${cls}" style="background:${partyColor(party)}">${esc(name.slice(0, 1))}</span>`;
}

export const pct = (x: number) => `${Math.round(x * 1000) / 10}%`;

/** やる気（1〜5）の顔のアイコン */
export const moodIcon = (mood: number, size = 26) => icon(`st-mood-${mood}`, size, `やる気${mood}`);
