import { describe, expect, it } from "vitest";
import surnames from "../../data/names/surnames.json";
import givenNames from "../../data/names/given_names.json";
import exclusion from "../../data/names/exclude_real_politicians.json";
import type { NameData } from "../data/nameData.js";
import { createWorld } from "./roster.js";
import { formInitialGovernment } from "./cabinet.js";
import { startCareer, startOptions } from "./career.js";
import type { RouteId } from "./career.js";
import { adviseMonth, recommendedActivity } from "./advice.js";

const data = { surnames, givenNames, exclusion } as unknown as NameData;

async function begin(route: RouteId = "smd") {
  const { roster, factory } = await createWorld(data, 6);
  const opt = startOptions(roster, "minsei", "newcomer").find((o) => o.route === route)!;
  return startCareer({ roster, government: formInitialGovernment(roster), factory }, { origin: "newcomer", party: "minsei", pref: opt.pref, route, archetype: "local" }, 6);
}

describe("毎月の助言", () => {
  it("始めたばかりなら、何かしらの活動をすすめ、3個までに収まる", async () => {
    const { state, world } = await begin();
    const a = adviseMonth(state, world);
    expect(a.length).toBeGreaterThan(0);
    expect(a.length).toBeLessThanOrEqual(3);
    expect(recommendedActivity(a)).toBeDefined();
  });

  it("体力が少なければ、休養を真っ先にすすめる", async () => {
    const { state, world } = await begin();
    state.stamina = 20;
    expect(recommendedActivity(adviseMonth(state, world))).toBe("rest");
  });

  it("資金が尽きそうなら資金集め、地盤が下がりそうなら地元回りをすすめる", async () => {
    const { state, world } = await begin();
    state.money = 50;
    expect(recommendedActivity(adviseMonth(state, world))).toBe("fund");
    state.money = 1000;
    world.player.jiban = 2;
    state.jibanNeglect = 5;
    expect(recommendedActivity(adviseMonth(state, world))).toBe("local");
  });

  it("経験点がたまっていれば「自分」の画面を、党の幹部と疎遠なら党務をすすめる", async () => {
    const { state, world } = await begin();
    state.exp = { election: 500, policy: 500, network: 500, media: 500, money: 500 };
    state.relations.party = 20;
    const a = adviseMonth(state, world, 5);
    expect(a.some((x) => x.tab === "self")).toBe(true);
    expect(a.some((x) => x.act === "party")).toBe(true);
  });

  it("比例名簿の道で総選挙が近ければ、党務で名簿の順位を上げるようすすめる", async () => {
    const { state, world } = await begin("pr");
    state.gov.termEnd = { year: state.year, month: state.month + 6 };
    expect(adviseMonth(state, world, 5).some((x) => x.act === "party" && x.text.includes("比例名簿"))).toBe(true);
  });
});
