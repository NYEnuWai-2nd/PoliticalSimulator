import { describe, expect, it } from "vitest";
import surnames from "../../data/names/surnames.json";
import givenNames from "../../data/names/given_names.json";
import exclusion from "../../data/names/exclude_real_politicians.json";
import type { NameData } from "../data/nameData.js";
import { createWorld } from "./roster.js";
import { formInitialGovernment } from "./cabinet.js";
import { chooseEvent, chooseStory, startCareer, startOptions, takeTurn } from "./career.js";
import type { OriginId } from "./career.js";
import { SKILLS, expMultiplier, relationMultiplier, skillById, skillVote, startingSkills, updateSkills } from "./skills.js";
import type { ConditionContext } from "./skills.js";

const data = { surnames, givenNames, exclusion } as unknown as NameData;
const ABIL = { 弁舌: 50, 政策: 50, 調整: 50, 知名度: 50, 組織: 50, 資金力: 50 };
const ctx = (over: Partial<ConditionContext> = {}): ConditionContext => ({ activityCounts: {}, abilities: { ...ABIL }, terms: 0, jiban: 1, ...over });

describe("特殊能力のデータ", () => {
  it("id が重ならず、replaces・各表が存在する特殊能力を指している", () => {
    const ids = SKILLS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const s of SKILLS) for (const r of s.replaces ?? []) expect(skillById(r)).toBeDefined();
    for (const id of startingSkills("security", "dynasty")) expect(skillById(id)).toBeDefined();
  });
});

describe("始めるときの特殊能力", () => {
  it("経歴類型の青特が付き、世襲・名門は家系の特殊能力と「苦労知らず」も付く", () => {
    expect(startingSkills("local", "newcomer")).toEqual(["dobuita"]);
    expect(startingSkills("bureaucrat", "hereditary")).toEqual(["kasumigaseki", "koenkai_keishou", "kurou_shirazu"]);
    expect(startingSkills("general", "dynasty")).toEqual(["meimon_kanban", "koenkai_keishou", "kurou_shirazu"]);
  });
});

describe("効果", () => {
  it("経験点、関係、票の補正が重なってかかる", () => {
    expect(expMultiplier(["dobuita"], "local")).toBeCloseTo(1.3);
    expect(expMultiplier(["dobuita", "dandori"], "local")).toBeCloseTo(1.3 * 1.08);
    expect(expMultiplier(["dobuita"], "speech")).toBe(1);
    expect(relationMultiplier(["chousei_heta"], "party")).toBeCloseTo(0.7);
    expect(skillVote(["senkyo_kamisama", "hirei_dayori"])).toBeCloseTo(0.02);
  });
});

describe("身につける・外れる", () => {
  it("街頭演説24回で辻説法、弁舌80と40回で論破王になり辻説法は外れる", () => {
    const a = updateSkills([], ctx({ activityCounts: { speech: 24 } }));
    expect(a.gained.map((s) => s.id)).toContain("tsuji_seppou");
    const b = updateSkills(a.skills, ctx({ activityCounts: { speech: 40 }, abilities: { ...ABIL, 弁舌: 80 } }));
    expect(b.skills).toContain("ronpa_ou");
    expect(b.skills).not.toContain("tsuji_seppou");
    // 上位を持っていれば下位は身につけない
    expect(updateSkills(b.skills, ctx({ activityCounts: { speech: 40 }, abilities: { ...ABIL, 弁舌: 80 } })).gained).toEqual([]);
  });

  it("欠点は条件を満たすと外れる（失言癖は弁舌70）", () => {
    expect(updateSkills(["shitsugen"], ctx()).skills).toEqual(["shitsugen"]);
    const r = updateSkills(["shitsugen"], ctx({ abilities: { ...ABIL, 弁舌: 70 } }));
    expect(r.skills).toEqual([]);
    expect(r.lost[0].id).toBe("shitsugen");
  });
});

describe("ほかの議員", () => {
  it("同じシードなら同じ特殊能力で、持っている議員と持っていない議員がいる", async () => {
    const a = await createWorld(data, 21);
    const b = await createWorld(data, 21);
    expect(a.roster.map((m) => m.skills)).toEqual(b.roster.map((m) => m.skills));
    const withSkill = a.roster.filter((m) => m.skills.length > 0).length / a.roster.length;
    expect(withSkill).toBeGreaterThan(0.3);
    expect(withSkill).toBeLessThan(0.95);
    for (const m of a.roster) for (const id of m.skills) expect(skillById(id)).toBeDefined();
  });
});

describe("議員人生モードでの特殊能力", () => {
  async function begin(origin: OriginId, archetype: string, seed = 8) {
    const { roster, factory } = await createWorld(data, seed);
    const opt = startOptions(roster, "minsei", origin).find((o) => o.route === "smd")!;
    return startCareer({ roster, government: formInitialGovernment(roster), factory }, { origin, party: "minsei", pref: opt.pref, route: "smd", archetype }, seed);
  }

  it("街頭演説を続けると辻説法を身につけ、記録に残る", async () => {
    const { state, world } = await begin("newcomer", "local");
    expect(world.player.skills).toEqual(["dobuita"]);
    for (let t = 0; t < 60 && !world.player.skills.includes("tsuji_seppou"); t++) {
      if (state.pendingEvent) chooseEvent(state, world, 0);
      if (state.pendingStory) chooseStory(state, world, 0);
      await takeTurn(state, world, t % 2 === 0 ? "speech" : "rest");
    }
    expect(world.player.skills).toContain("tsuji_seppou");
    // 24回の前に、出来事（手作りの政策ビラ）で身につくこともある
    expect((state.activityCounts?.speech ?? 0) >= 24 || state.log.some((l) => l.text.includes("手作りの政策ビラ"))).toBe(true);
    expect(state.log.some((l) => l.text.includes("「辻説法」を身につけた"))).toBe(true);
  }, 60_000);

  it("失言癖があると、街頭演説のあとに失言することがある", async () => {
    const { state, world } = await begin("newcomer", "local", 4);
    world.player.skills.push("shitsugen");
    let gaffes = 0;
    for (let t = 0; t < 40; t++) {
      if (state.pendingEvent) chooseEvent(state, world, 0);
      if (state.pendingStory) chooseStory(state, world, 0);
      const r = await takeTurn(state, world, t % 2 === 0 ? "speech" : "rest");
      if (r.message.includes("【失言癖】")) gaffes++;
      if (!world.player.skills.includes("shitsugen")) break;
    }
    expect(gaffes).toBeGreaterThan(0);
  }, 60_000);
});
