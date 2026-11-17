import { describe, expect, it } from "vitest";
import { HOUSE_SEATS, prefOfDistrict } from "./districts.js";
import surnames from "../../data/names/surnames.json";
import givenNames from "../../data/names/given_names.json";
import exclusion from "../../data/names/exclude_real_politicians.json";
import lifeEvents from "../../data/game/life_events.json";
import career from "../../data/game/career.json";
import type { NameData } from "../data/nameData.js";
import { createWorld } from "./roster.js";
import { formInitialGovernment } from "./cabinet.js";
import {
  canUpgrade,
  chooseEvent, chooseStory,
  raceForecast,
  startCareer,
  startOptions,
  takeTurn,
  upgradeAbility,
  upgradeCost,
} from "./career.js";
import type { CareerState, CareerWorld, OriginId, RouteId } from "./career.js";

const data = { surnames, givenNames, exclusion } as unknown as NameData;

async function begin(origin: OriginId = "newcomer", party = "minsei", seed = 3, route: RouteId = "smd") {
  const { roster, factory } = await createWorld(data, seed);
  const government = formInitialGovernment(roster);
  const opt = startOptions(roster, party, origin).find((o) => o.route === route)!;
  return { ...(await startCareer({ roster, government, factory }, { origin, party, pref: opt.pref, route, archetype: "local" }, seed)), roster };
}

/** 出来事が起きたら最初の選択肢を選びながら、活動を続ける */
async function play(state: CareerState, world: CareerWorld, months: number, pick: (t: number) => string) {
  for (let t = 0; t < months && !state.over; t++) {
    if (state.pendingEvent) chooseEvent(state, world, 0);
    if (state.pendingStory) chooseStory(state, world, 0);
    await takeTurn(state, world, pick(t));
  }
}

describe("始め方", () => {
  it("新人の小選挙区は他党の現職の県、後継は引退が近い自党の現職の県、世襲は自党の現職（首相を除く）の県", async () => {
    const { roster } = await createWorld(data, 1);
    const holder = (p: number) => roster.find((m) => m.seat === "小選挙区" && m.district === p);
    const opts = startOptions(roster, "minsei", "newcomer");
    for (const o of opts.filter((x) => x.route === "smd")) expect(holder(o.district!)?.party).not.toBe("minsei");
    for (const o of opts.filter((x) => x.route === "successor")) {
      expect(holder(o.district!)?.party).toBe("minsei");
      expect(2026 - holder(o.district!)!.birthYear).toBeGreaterThanOrEqual(career.routes.successor_min_age);
    }
    expect(opts.filter((x) => x.route === "pr")).toHaveLength(47);
    for (const o of startOptions(roster, "minsei", "hereditary")) {
      expect(holder(o.district!)?.party).toBe("minsei");
      expect(holder(o.district!)?.fixedRole).toBeUndefined();
    }
  });

  it("出自で地盤と資金が違い、世襲は親の姓を継ぐ", async () => {
    const a = await begin("newcomer");
    const b = await begin("hereditary");
    const c = await begin("dynasty");
    expect([a.world.player.jiban, b.world.player.jiban, c.world.player.jiban]).toEqual([1, 3, 4]);
    expect(c.state.money).toBeGreaterThan(b.state.money);
    expect(b.state.money).toBeGreaterThan(a.state.money);
    const parent = b.roster.find((m) => m.id === b.state.parentId)!;
    expect(b.world.player.name.surname).toBe(parent.name.surname);
  });

  it("選べない組み合わせから始めるとエラーになる", async () => {
    const { roster, factory } = await createWorld(data, 1);
    const held = roster.find((m) => m.seat === "小選挙区" && m.party === "minsei" && !m.fixedRole)!.district!;
    await expect(
      startCareer({ roster, government: formInitialGovernment(roster), factory }, { origin: "newcomer", party: "minsei", pref: prefOfDistrict(held), district: held, route: "smd", archetype: "local" }, 1),
    ).rejects.toThrow();
  });
});

describe("毎月の活動と能力", () => {
  it("活動で体力が減って経験点がたまり、月が進む", async () => {
    const { state, world } = await begin();
    await takeTurn(state, world, "local");
    expect(state.stamina).toBe(85);
    expect(state.exp.election).toBeGreaterThan(0);
    expect(state.month).toBe(2);
  });

  it("体力づくりで体力の上限が上がる（上限まで）", async () => {
    const { state, world } = await begin();
    for (let i = 0; i < 30; i++) {
      state.pendingEvent = undefined;
      await takeTurn(state, world, "training");
    }
    expect(state.maxStamina).toBe(career.max_stamina.limit);
  });

  it("経験点で能力を上げると経験点が減り、高い能力ほど費用が大きい", async () => {
    const { state, world } = await begin();
    state.exp = { election: 999, policy: 999, network: 999, media: 999, money: 999 };
    const before = world.player.abilities.知名度;
    expect(canUpgrade(state, world.player, "知名度")).toBe(true);
    upgradeAbility(state, world, "知名度");
    expect(world.player.abilities.知名度).toBe(before + 1);
    expect(state.exp.media).toBeLessThan(999);
    const low = { ...world.player, abilities: { ...world.player.abilities, 政策: 40 } };
    const high = { ...world.player, abilities: { ...world.player.abilities, 政策: 80 } };
    expect(upgradeCost(high, "政策").policy!).toBeGreaterThan(upgradeCost(low, "政策").policy!);
  });

  it("選挙区の情勢の見込みは合計1で、プレイヤーが含まれる。比例名簿の道では空", async () => {
    const a = await begin();
    const f = raceForecast(a.state, a.world);
    expect(f.reduce((x, y) => x + y.share, 0)).toBeCloseTo(1, 5);
    expect(f.filter((x) => x.isPlayer)).toHaveLength(1);
    const b = await begin("newcomer", "kyowa", 3, "pr");
    expect(raceForecast(b.state, b.world)).toEqual([]);
  });
});

describe("日常の出来事", () => {
  it("出来事の選択待ちのあいだは月を進められず、選ぶと効果が出て進められる", async () => {
    const { state, world } = await begin();
    state.pendingEvent = { id: "jogging", title: "健康診断の結果", text: "", choices: ["a", "b", "c"] };
    expect((await takeTurn(state, world, "local")).ok).toBe(false);
    const max = state.maxStamina;
    expect(chooseEvent(state, world, 0).ok).toBe(true);
    expect(state.maxStamina).toBe(max + 4);
    expect((await takeTurn(state, world, "local")).ok).toBe(true);
  });

  it("出来事の効果はすべて決まった項目だけを使い、恋愛の出来事はない", () => {
    const keys = new Set(["approval", "stamina", "max_stamina", "mood", "money", "exp", "relations", "jiban_progress", "abilities", "skills_add", "skills_remove", "bonds"]);
    const rel = new Set(career.relations.map((r) => r.id));
    for (const e of lifeEvents.events) {
      expect(e.choices.length).toBeGreaterThanOrEqual(2);
      expect(e.title + e.text).not.toMatch(/恋|デート|告白|交際/);
      for (const c of e.choices) {
        for (const k of Object.keys(c.effects)) expect(keys, `${e.id}.${k}`).toContain(k);
        for (const r of Object.keys((c.effects as { relations?: object }).relations ?? {})) expect(rel, `${e.id}.${r}`).toContain(r);
      }
    }
  });
});

describe("プレイレポートを受けた直し", () => {
  it("一生に一度の出来事（健康診断）は繰り返さず、同じ出来事は間を空けないと起きない", async () => {
    const { state, world } = await begin("newcomer", "minsei", 9);
    const seen: string[] = [];
    for (let t = 0; t < 240 && !state.over; t++) {
      if (state.pendingEvent) {
        seen.push(`${state.turn}:${state.pendingEvent.id}`);
        chooseEvent(state, world, 0);
      }
      await takeTurn(state, world, t % 3 === 2 ? "rest" : "local");
    }
    expect(seen.filter((x) => x.endsWith(":jogging")).length).toBeLessThanOrEqual(1);
    const last: Record<string, number> = {};
    for (const x of seen) {
      const [turn, id] = x.split(":");
      if (last[id] !== undefined) expect(Number(turn) - last[id]).toBeGreaterThanOrEqual(career.event_cooldown_months);
      last[id] = Number(turn);
    }
  }, 120000);

  it("地盤が最大なら進み具合はたまらず、表示は「最大」", async () => {
    const { state, world } = await begin("dynasty");
    for (let t = 0; t < 5; t++) {
      state.pendingEvent = undefined;
      await takeTurn(state, world, "local");
    }
    expect(world.player.jiban).toBe(4);
    expect(state.jibanProgress).toBe(0);
  });

  it("高い能力ほど費用が急に大きくなる（80以上はさらに倍）", async () => {
    const { world } = await begin();
    const at = (v: number) => upgradeCost({ ...world.player, abilities: { ...world.player.abilities, 知名度: v } }, "知名度").media!;
    expect(at(79) * 1.9).toBeLessThan(at(80));
    expect(at(95)).toBeGreaterThan(at(50) * 4);
  });
});

describe("総選挙とその後", () => {
  it("総選挙のあとも続き、当選すれば議員、落選すれば浪人になり、名簿は定数のまま", async () => {
    const { state, world } = await begin("newcomer", "minsei", 5);
    await play(state, world, 60, (t) => (t % 4 === 3 ? "rest" : "local"));
    expect(state.elections.length).toBeGreaterThanOrEqual(1);
    expect(state.over).toBeUndefined();
    expect(state.status).toBe(state.elections.at(-1)!.won ? "議員" : "浪人");
    expect(world.roster).toHaveLength(HOUSE_SEATS);
    expect(world.roster.some((m) => m.id === world.player.id)).toBe(state.status === "議員");
    expect(state.parentId).toBeUndefined();
  }, 120000);

  it("比例名簿の道では、党の幹部との関係で順位が決まり、結果に順位が残る", async () => {
    const { state, world } = await begin("newcomer", "minsei", 6, "pr");
    state.relations.party = 100;
    await play(state, world, 60, (t) => (t % 3 === 2 ? "rest" : "party"));
    const e = state.elections[0];
    expect(e.route).toBe("pr");
    expect(e.pr!.rank).toBe(1);
    expect(e.won).toBe(e.pr!.rank <= e.pr!.seats);
  }, 120000);

  it("75歳か30年で引退して終わる", async () => {
    const { state, world } = await begin("dynasty", "minsei", 8);
    await play(state, world, 400, (t) => (t % 3 === 2 ? "rest" : "local"));
    expect(state.over).toMatch(/引退/);
    expect(state.year - state.startYear).toBeLessThanOrEqual(career.career_end.max_years);
  }, 300000);

  it("同じシードと同じ選択からは同じ結果になる", async () => {
    const run = async () => {
      const { state, world } = await begin("hereditary", "minken", 7);
      await play(state, world, 40, (t) => (t % 3 === 2 ? "rest" : "local"));
      return { turn: state.turn, log: state.log.map((l) => l.text), elections: state.elections };
    };
    expect(await run()).toEqual(await run());
  }, 120000);
});
