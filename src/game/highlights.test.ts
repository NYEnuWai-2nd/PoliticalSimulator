// 記録の重みとまとめ、山場の場面、総選挙の前回比、コツ、推移への助言
import { describe, expect, it } from "vitest";
import { HOUSE_SEATS } from "./districts.js";
import surnames from "../../data/names/surnames.json";
import givenNames from "../../data/names/given_names.json";
import exclusion from "../../data/names/exclude_real_politicians.json";
import type { NameData } from "../data/nameData.js";
import { createWorld } from "./roster.js";
import { formInitialGovernment } from "./cabinet.js";
import { canLearnSkill, chooseEvent, chooseStory, learnSkill, startCareer, startOptions, takeTurn } from "./career.js";
import type { CareerState, CareerWorld, OriginId } from "./career.js";
import { adviseMonth } from "./advice.js";

const data = { surnames, givenNames, exclusion } as unknown as NameData;

async function begin(seed = 2, origin: OriginId = "newcomer", party = "minsei") {
  const { roster, factory } = await createWorld(data, seed);
  const opt = startOptions(roster, party, origin).find((o) => o.route === "smd")!;
  return startCareer({ roster, government: formInitialGovernment(roster), factory }, { origin, party, pref: opt.pref, route: "smd", archetype: "local" }, seed);
}

async function play(state: CareerState, world: CareerWorld, months: number) {
  const acts = ["local", "kengi", "festival", "speech", "rest"];
  for (let t = 0; t < months && !state.over; t++) {
    if (state.pendingEvent) chooseEvent(state, world, 0);
    if (state.pendingStory) chooseStory(state, world, 0);
    await takeTurn(state, world, state.stamina < 30 ? "rest" : acts[t % acts.length]);
  }
}

describe("記録", () => {
  it("政権の細かい動きは minor になり、同じ月の同じ種類の動きは1行にまとまる", async () => {
    const { state, world } = await begin();
    await play(state, world, 30);
    const minor = state.log.filter((l) => l.kind === "gov" && l.level === "minor");
    expect(minor.length).toBeGreaterThan(0);
    // 同じ月に、数字と括弧を除いて同じ文の minor が2行以上ない
    const keys = minor.map((l) => `${l.turn}|${l.text.replace(/（[^）]*）/g, "").replace(/[0-9.]+/g, "#")}`);
    expect(new Set(keys).size).toBe(keys.length);
  }, 60_000);
});

describe("山場の場面と総選挙の前回比", () => {
  it("30年のあいだに首相交代か政権交代の場面が出て、総選挙には前回の議席が残る", async () => {
    const { state, world } = await begin(3);
    await play(state, world, 360);
    const kinds = (state.highlights ?? []).map((h) => h.kind);
    expect(kinds.some((k) => k === "pm_change" || k === "ruling_change")).toBe(true);
    for (const h of state.highlights ?? []) {
      expect(h.lines.length).toBeGreaterThan(0);
      expect(state.log.some((l) => l.level === "major" && l.text.startsWith(`【${h.title}】`))).toBe(true);
    }
    expect(state.elections.length).toBeGreaterThan(1);
    for (const e of state.elections) expect(e.prevSeats?.reduce((a, x) => a + x.total, 0)).toBe(HOUSE_SEATS);
    // 2回目以降の小選挙区の選挙には、前回の自分の得票率が入る
    expect(state.elections.slice(1).some((e) => e.prevShare !== undefined)).toBe(true);
  }, 120_000);
});

describe("コツ", () => {
  it("コツがあれば、回数が足りなくても経験点を払って覚えられる。Lv が高いほど安い", async () => {
    const { state, world } = await begin();
    expect(canLearnSkill(state, world, "aisatsu").ok).toBe(false);
    state.skillHints = { aisatsu: 1, kikijouzu: 3 };
    state.exp = { election: 100, policy: 0, network: 100, media: 0, money: 0 };
    expect(canLearnSkill(state, world, "aisatsu").cost).toEqual({ election: 25 });
    expect(canLearnSkill(state, world, "kikijouzu").cost).toEqual({ network: 18 });
    expect(learnSkill(state, world, "aisatsu").ok).toBe(true);
    expect(world.player.skills).toContain("aisatsu");
    expect(state.exp.election).toBe(75);
    expect(state.skillHints.aisatsu).toBeUndefined();
  });

  it("活動を続けると、ときどきコツをつかむ", async () => {
    const { state, world } = await begin(5);
    await play(state, world, 40);
    expect(state.log.some((l) => l.text.includes("【きっかけ】"))).toBe(true);
  }, 60_000);

  it("金特は、コツがあっても能力などの条件を満たさないと覚えられない", async () => {
    const { state, world } = await begin();
    state.skillHints = { ronpa_ou: 3 };
    state.exp.media = 999;
    expect(canLearnSkill(state, world, "ronpa_ou").ok).toBe(false);
  });
});

describe("推移への助言", () => {
  it("この数か月で資金が大きく減っていれば、資金集めをすすめる", async () => {
    const { state, world } = await begin();
    state.money = 400;
    state.history = [{ turn: state.turn - 3, approval: state.gov.approval, money: 800 }];
    expect(adviseMonth(state, world, 6).some((a) => a.act === "fund" && a.text.includes("資金が"))).toBe(true);
  });
});

describe("第3版レポートの残り", () => {
  it("体力が少ないほど倒れやすく、0なら必ず倒れる", async () => {
    const { breakdownChance } = await import("./career.js");
    expect(breakdownChance(50)).toBe(0);
    expect(breakdownChance(0)).toBe(1);
    expect(breakdownChance(10)).toBeGreaterThan(breakdownChance(19));
  });

  it("任期満了は同じ月に二重に記録されない", async () => {
    const { state, world } = await begin(7, "dynasty", "minsei");
    await play(state, world, 60);
    const byTurn = new Map<number, number>();
    for (const l of state.log) if (l.text.startsWith("衆議院議員の任期が満了した")) byTurn.set(l.turn, (byTurn.get(l.turn) ?? 0) + 1);
    for (const n of byTurn.values()) expect(n).toBe(1);
  }, 60_000);

  it("序盤は、条件の遠い金特のコツはつかまない", async () => {
    const { state, world } = await begin(5);
    await play(state, world, 40);
    const gold = ["senkyo_kamisama", "nemawashi_oni", "ronpa_ou"];
    expect(Object.keys(state.skillHints ?? {}).some((id) => gold.includes(id))).toBe(false);
  }, 60_000);
});
