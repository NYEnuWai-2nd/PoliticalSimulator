import { describe, expect, it } from "vitest";
import surnames from "../../data/names/surnames.json";
import givenNames from "../../data/names/given_names.json";
import exclusion from "../../data/names/exclude_real_politicians.json";
import dialogue from "../../data/game/dialogue.json";
import events from "../../data/game/events.json";
import type { NameData } from "../data/nameData.js";
import { generateRoster } from "./roster.js";
import { formInitialGovernment } from "./cabinet.js";
import { createGame, endTurn, startDrafting, submitBill } from "./game.js";
import { buildScene, oppositionLeader } from "./scenes.js";

const data = { surnames, givenNames, exclusion } as unknown as NameData;
const ROLES = ["pm", "chief_cabinet_secretary", "secretary_general", "minister", "member", "opposition_leader", "chair", "reporter", "narrator"];

async function setup(seed = 2026) {
  const roster = await generateRoster(data, seed);
  return { roster, government: formInitialGovernment(roster) };
}

describe("場面とセリフ", () => {
  it("セリフの話し手はすべて決まった役割のどれか", () => {
    const all = [
      ...Object.values(dialogue.scenes).flatMap((s) => s.variants.flat()),
      ...events.events.flatMap((e) => e.lines),
    ];
    for (const l of all) expect(ROLES, l.text).toContain(l.speaker);
  });

  it("内閣発足の場面で、首相と野党第一党の党首が実際の議員名で話す", async () => {
    const ctx = await setup();
    const g = createGame(2026, ctx);
    expect(g.scenes).toHaveLength(1);
    const names = g.scenes[0].lines.map((l) => l.name);
    expect(names).toContain("石橋 茂樹");
    const leader = oppositionLeader(ctx.roster)!;
    expect(leader.party).toBe("minken");
    expect(names).toContain(leader.name.displayName);
    // 置き換え忘れの {…} が残っていない
    for (const l of g.scenes[0].lines) expect(l.text).not.toMatch(/\{\w+\}/);
  });

  it("採決の場面で法案名と票数がセリフに入る", async () => {
    const ctx = await setup();
    const g = createGame(2026, ctx);
    g.scenes = [];
    startDrafting(g, ctx, "budget");
    for (let i = 0; i < 6 && g.bills.budget.status === "準備中"; i++) endTurn(g, ctx);
    g.scenes = [];
    g.cooperation.kyowa = 70;
    submitBill(g, ctx, "budget");
    endTurn(g, ctx);
    const vote = g.scenes.find((s) => s.title.startsWith("採決"))!;
    expect(vote).toBeDefined();
    const text = vote.lines.map((l) => l.text).join("");
    expect(text).toContain("年度予算");
    expect(text).toMatch(/賛成\d+/);
  });

  it("どの場面も、どの選び方でも組み立てられる", async () => {
    const ctx = await setup(5);
    for (const key of Object.keys(dialogue.scenes))
      for (const pick of [0, 0.5, 0.99]) {
        const s = buildScene(key, ctx, { bill: "テスト法案", yes: 40, no: 36, rebels: 4, approval: 14, year: 2026 }, pick);
        expect(s.lines.length).toBeGreaterThan(0);
        for (const l of s.lines) expect(l.text).not.toMatch(/\{\w+\}/);
      }
  });
});
