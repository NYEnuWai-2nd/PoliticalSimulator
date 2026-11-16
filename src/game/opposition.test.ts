import { describe, expect, it } from "vitest";
import surnames from "../../data/names/surnames.json";
import givenNames from "../../data/names/given_names.json";
import exclusion from "../../data/names/exclude_real_politicians.json";
import type { NameData } from "../data/nameData.js";
import { createWorld } from "./roster.js";
import { formInitialGovernment } from "./cabinet.js";
import { chooseEvent, isOppositionLeader, oppAction, oppositionLineup, raceForecast, startCareer, startOptions, takeTurn } from "./career.js";
import { applyPacts, countNoConfidence, initialCooperation, pactTransfer } from "./opposition.js";

const data = { surnames, givenNames, exclusion } as unknown as NameData;

/** 民権党の議員として始め、党首にする */
async function minkenLeader(seed = 4) {
  const { roster, factory } = await createWorld(data, seed);
  const opt = startOptions(roster, "minken", "newcomer").find((o) => o.route === "smd")!;
  const r = await startCareer({ roster, government: formInitialGovernment(roster), factory }, { origin: "newcomer", party: "minken", pref: opt.pref, route: "smd", archetype: "local" }, seed);
  r.state.status = "議員";
  r.world.player = { ...r.world.player, terms: 5, seat: "小選挙区", district: opt.pref };
  r.state.leaders.minken = r.world.player.id;
  return r;
}

async function nextMonth(state: Awaited<ReturnType<typeof minkenLeader>>["state"], world: Awaited<ReturnType<typeof minkenLeader>>["world"]) {
  if (state.pendingEvent) chooseEvent(state, world, 0);
  await takeTurn(state, world, "rest");
}

describe("野党の計算", () => {
  it("協力度の初期値は思想が近いほど高い", () => {
    expect(initialCooperation("minken", "kosei")).toBeGreaterThan(initialCooperation("minken", "sankaku"));
  });

  it("選挙協力：相手が候補を降ろし、票の一部が移る。思想が遠いほど移る割合が小さい", () => {
    const local: Record<string, number> = { minken: 30, kyowa: 10, minsei: 40 };
    const running = applyPacts(local, ["minken", "kyowa", "minsei"], [{ keep: "minken", partner: "kyowa", transfer: 0.6 }]);
    expect(running).toEqual(["minken", "minsei"]);
    expect(local.minken).toBeCloseTo(36);
    expect(pactTransfer("minken", "kosei")).toBeGreaterThan(pactTransfer("minken", "sankaku"));
  });

  it("不信任案：野党がまとまり与党の結束が弱いと通りやすい", async () => {
    const { roster } = await createWorld(data, 4);
    const ruling = { party: "minsei", partners: ["kosei"] };
    const all = Object.fromEntries(["minken", "sasshin", "kyowa", "reimei", "shusan", "sankaku"].map((p) => [p, 100]));
    let passedStrong = 0;
    let passedWeak = 0;
    for (let i = 0; i < 40; i++) {
      let x = i * 7 + 1;
      const rand = () => ((x = (x * 16807) % 2147483647) / 2147483647);
      if (countNoConfidence(roster, { party: "minken", ruling, cooperation: all, cohesion: 0.3, approval: 18, diet: 30 }, rand).passed) passedStrong++;
      if (countNoConfidence(roster, { party: "minken", ruling, cooperation: {}, cohesion: 0.9, approval: 50, diet: 0 }, rand).passed) passedWeak++;
    }
    expect(passedStrong).toBeGreaterThan(passedWeak);
    // 開始時点は少数与党なので、協力がなくてもまれに通る
    expect(passedWeak).toBeLessThan(15);
    expect(passedStrong).toBeGreaterThan(30);
  });
});

describe("野党の党首の行動", () => {
  it("野党の党首になると毎月行動が使え、会談で協力度が動く", async () => {
    const { state, world } = await minkenLeader();
    expect(isOppositionLeader(state, world)).toBe(true);
    await nextMonth(state, world);
    expect(state.opp?.actionPoints).toBe(3);
    const before = state.opp!.cooperation.kyowa;
    const r = oppAction(state, world, "summit", "kyowa");
    expect(r.ok).toBe(true);
    expect(state.opp!.cooperation.kyowa).not.toBe(before);
    expect(state.opp!.actionPoints).toBe(2);
  }, 60_000);

  it("協力度が足りない党とは選挙協力を結べず、対案は準備がたまってから出せる", async () => {
    const { state, world } = await minkenLeader();
    await nextMonth(state, world);
    state.opp!.cooperation.sankaku = 10;
    expect(oppAction(state, world, "pact", "sankaku").ok).toBe(false);
    state.opp!.proposals = 0;
    expect(oppAction(state, world, "proposal").ok).toBe(false);
    state.opp!.proposals = 40;
    expect(oppAction(state, world, "proposal").ok).toBe(true);
    expect(state.opp!.momentum).toBeGreaterThan(0);
  }, 60_000);

  it("選挙協力を結ぶと、自分の選挙区から相手の候補が消え、見込みが上がる", async () => {
    const { state, world } = await minkenLeader(9);
    await nextMonth(state, world);
    const before = raceForecast(state, world);
    const partner = before.find((x) => !x.isPlayer && x.party !== state.gov.ruling.party && !state.gov.ruling.partners.includes(x.party))?.party;
    if (!partner) return; // その県に野党の対立候補がいない
    state.opp!.pacts = [partner];
    const after = raceForecast(state, world);
    expect(after.some((x) => x.party === partner)).toBe(false);
    expect(after.find((x) => x.isPlayer)!.share).toBeGreaterThan(before.find((x) => x.isPlayer)!.share);
  }, 60_000);
});

describe("野党の役職", () => {
  it("野党の党の役職の顔ぶれを出せる（党首を除く）", async () => {
    const { state, world } = await minkenLeader();
    const lineup = oppositionLineup(state, world);
    expect(lineup.map((x) => x.post)).toEqual(["幹事長", "政調会長", "国対委員長", "選対委員長"]);
    expect(lineup.some((x) => x.member.id === state.leaders.minken)).toBe(false);
  });

  it("当選を重ねた野党の議員は、人事の月に役職に就く", async () => {
    const { state, world } = await minkenLeader();
    state.leaders.minken = world.roster.find((m) => m.party === "minken")!.id;
    state.relations.party = 80;
    world.player = { ...world.player, terms: 6, abilities: { ...world.player.abilities, 調整: 95, 組織: 90 } };
    for (let i = 0; i < 12 && !state.oppPost; i++) await nextMonth(state, world);
    expect(state.oppPost).toBeDefined();
    expect(state.post).toContain("民権党の");
  }, 60_000);
});
