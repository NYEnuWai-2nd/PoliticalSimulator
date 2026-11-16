import { describe, expect, it } from "vitest";
import { ICONS, ICON_GROUPS, iconSvg } from "./icons.js";

/** docs/prompts/gemini_icons.md で頼んだ id（61個） */
const REQUESTED: Record<string, string[]> = {
  act: ["act-local", "act-speech", "act-study", "act-fund", "act-party", "act-rest", "act-petition", "act-sns"],
  exp: ["exp-election", "exp-policy", "exp-network", "exp-media", "exp-money"],
  ab: ["ab-speech", "ab-policy", "ab-coord", "ab-fame", "ab-org", "ab-fund"],
  field: ["field-finance", "field-economy", "field-agri", "field-welfare", "field-education", "field-transport", "field-diplomacy", "field-security", "field-justice", "field-local"],
  tab: ["tab-activity", "tab-map", "tab-party", "tab-cabinet", "tab-self"],
  st: ["st-stamina", "st-mood-1", "st-mood-2", "st-mood-3", "st-mood-4", "st-mood-5", "st-approval", "st-jiban", "st-calendar", "st-session", "st-daruma", "st-rose"],
  gov: ["gov-draft", "gov-submit", "gov-talk", "gov-nemawashi", "gov-press", "gov-dissolve"],
  ev: ["ev-gaffe", "ev-scandal", "ev-economy-up", "ev-economy-down", "ev-disaster", "ev-summit", "ev-pass", "ev-reject", "ev-noconfidence"],
};

describe("アイコン", () => {
  it("頼んだ id がすべてそろい、余分なものがない", () => {
    expect(ICON_GROUPS).toEqual(REQUESTED);
    expect(Object.keys(ICONS).sort()).toEqual(Object.values(REQUESTED).flat().sort());
  });

  it("すべて 64×64 の SVG で、スクリプトや外部の読み込みを含まない", () => {
    for (const [id, svg] of Object.entries(ICONS)) {
      expect(svg, id).toMatch(/^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="0 0 64 64">/);
      expect(svg, id).toMatch(/<\/svg>$/);
      expect(svg, id).not.toMatch(/<script|<image|<foreignObject|<use|href=|url\(|\son[a-z]+=/i);
      // 文字（<text>）は描かない決まり
      expect(svg, id).not.toMatch(/<text/i);
      expect(svg.length, id).toBeLessThan(2500);
    }
  });

  it("タブのアイコンは色を持たず currentColor だけで描く", () => {
    for (const id of REQUESTED.tab) expect(ICONS[id].match(/#[0-9a-f]{3,6}/gi), id).toBeNull();
  });

  it("iconSvg は大きさと読み上げ用の名前を付け、知らない id には灰色の四角を返す", () => {
    const s = iconSvg("act-local", 24, "地元回り");
    expect(s).toContain('width="24"');
    expect(s).toContain('aria-label="地元回り"');
    expect(iconSvg("no-such-icon", 32)).toContain("#7d8694");
    expect(iconSvg("act-local", 24, '"><script>')).not.toContain("<script>");
  });
});
