// 思想5軸の目盛り（−3〜+3）。本人の位置と、比べる位置（政党の中心など）を並べて描く
import { IDEOLOGY_AXES } from "../../game/parties.js";
import type { Ideology } from "../../game/parties.js";
import { signed } from "../format.js";

const pos = (v: number) => ((v + 3) / 6) * 100;

export function ideologyScale(value: Ideology, compare?: Ideology): string {
  return `<div class="ideology-scale">${IDEOLOGY_AXES.map((x) => {
    const v = Math.round(value[x.id] * 10) / 10;
    const ref = compare ? `<span class="marker ref" style="left:${pos(compare[x.id])}%" title="政党の中心 ${signed(compare[x.id])}"></span>` : "";
    return `<div class="axis">
        <span class="axis-name">${x.name}</span>
        <span class="pole">${x.minus}</span>
        <span class="track">${ref}<span class="marker" style="left:${pos(v)}%" title="${signed(v)}"></span></span>
        <span class="pole">${x.plus}</span>
      </div>`;
  }).join("")}</div>`;
}
