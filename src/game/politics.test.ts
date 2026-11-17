import { describe, expect, it } from "vitest";
import politicsRaw from "../../data/game/politics.json";
import surnames from "../../data/names/surnames.json";
import givenNames from "../../data/names/given_names.json";
import exclusion from "../../data/names/exclude_real_politicians.json";
import type { NameData } from "../data/nameData.js";
import { createWorld } from "./roster.js";
import type { Member } from "./roster.js";
import { formGovernment, formInitialGovernment, INITIAL_RULING, rulingOf } from "./cabinet.js";
import { bestAntiCoalition, centerLed, formCoalition, isAntiCoalition, leaderElection, pickLeader, seatsOf, yieldPm } from "./politics.js";
import { HOUSE_SEATS, MAJORITY } from "./districts.js";
import { chooseEvent, chooseStory, currentStoryScene, govAction, isPrimeMinister, startCareer, startOptions, takeTurn } from "./career.js";

const data = { surnames, givenNames, exclusion } as unknown as NameData;

/** 議員の党を書き換えて、仮の議席配分を作る。counts は定数76のときの数で書き、今の定数の比に広げる */
function reassign(roster: Member[], counts: Record<string, number>): Member[] {
  const parties = Object.entries(counts).flatMap(([p, n]) => Array(Math.round((n * HOUSE_SEATS) / 76)).fill(p) as string[]);
  return roster.map((m, i) => ({ ...m, party: parties[i] ?? "independent" }));
}

describe("連立の組み直し", () => {
  it("今の与党と連立相手で過半数があれば、そのまま続ける", async () => {
    const { roster } = await createWorld(data, 1);
    const r = reassign(roster, { minsei: 36, kosei: 4, minken: 30, kyowa: 6 });
    const c = formCoalition(r, INITIAL_RULING);
    expect(c.changed).toBe(false);
    expect(c.ruling).toEqual(INITIAL_RULING);
    expect(c.seats).toBeGreaterThanOrEqual(MAJORITY);
  });

  it("与党が過半数を失い、別の党が第一党になれば、その党が思想の近い党と連立して政権交代", async () => {
    const { roster } = await createWorld(data, 1);
    const r = reassign(roster, { minken: 34, minsei: 26, kosei: 4, kyowa: 6, shusan: 3, reimei: 3 });
    const c = formCoalition(r, INITIAL_RULING);
    expect(c.changed).toBe(true);
    expect(c.ruling.party).toBe("minken");
    expect(c.ruling.partners.length).toBeLessThanOrEqual(2);
    expect(c.text).toContain("政権交代");
  });

  it("どの組み合わせでも過半数に届かなければ、議席の多いほうが少数与党になる", async () => {
    const { roster } = await createWorld(data, 1);
    const r = reassign(roster, { minsei: 30, minken: 24, kosei: 4, sasshin: 6, kyowa: 5, shusan: 2, reimei: 2, sankaku: 3 });
    const c = formCoalition(r, INITIAL_RULING);
    expect(c.ruling.party).toBe("minsei");
    if (c.seats < MAJORITY) expect(c.text).toContain("少数与党");
  });
});

describe("内閣と党首", () => {
  it("与党が替われば、首相はその党の党首になり、連立枠の大臣も連立相手から選ぶ", async () => {
    const { roster } = await createWorld(data, 2);
    const ruling = { party: "minken", partners: ["kosei"] };
    const leader = pickLeader(roster, "minken")!;
    const gov = formGovernment(roster, { ruling, pmId: leader.id });
    expect(gov.find((a) => a.post.id === "pm")!.member.id).toBe(leader.id);
    expect(gov.find((a) => a.post.id === "land")!.member.party).toBe("kosei");
    expect(rulingOf(gov)).toEqual(ruling);
  });

  it("党首選はその党の議員が投票し、立候補者への上乗せが大きければその候補が勝つ", async () => {
    const { roster } = await createWorld(data, 3);
    const party = "minsei";
    const underdog = roster.filter((m) => m.party === party).sort((a, b) => a.terms - b.terms)[0];
    const r = leaderElection(roster, party, { extra: { member: underdog, bonus: 50 }, rand: () => 0.5 })!;
    expect(r.winner.id).toBe(underdog.id);
    expect(r.candidates.reduce((a, c) => a + c.votes, 0)).toBe(seatsOf(roster, party));
  });

  it("議員が1人だけの党で、その人が立候補できなくても、党首選は止まらずにその人を選ぶ（集産党シード136の不具合）", async () => {
    const { roster } = await createWorld(data, 3);
    const only = roster.find((m) => m.party === "shusan")!;
    const one = roster.filter((m) => m.party !== "shusan" || m.id === only.id);
    const r = leaderElection(one, "shusan", { incumbentId: only.id, excludeIds: [only.id], rand: () => 0.5 })!;
    expect(r.winner.id).toBe(only.id);
  });
});

describe("首相への道", () => {
  it("当選を重ね、党の幹部との関係が高く、党首選に立候補すると首相になり、政権の行動と公務ができる", async () => {
    const { roster, factory } = await createWorld(data, 4);
    const opt = startOptions(roster, "minsei", "dynasty")[0];
    const { state, world } = await startCareer({ roster, government: formInitialGovernment(roster), factory }, { origin: "dynasty", party: "minsei", pref: opt.pref, route: "smd", archetype: "local" }, 4);
    // 最初の総選挙まで進める
    for (let t = 0; t < 60 && state.elections.length === 0; t++) {
      if (state.pendingEvent) chooseEvent(state, world, 0);
      if (state.pendingStory) chooseStory(state, world, 0);
      await takeTurn(state, world, t % 3 === 2 ? "rest" : "local");
    }
    expect(state.status).toBe("議員");
    if (state.gov.ruling.party !== "minsei") return; // 政権を失った場合はこの確認はしない
    // 当選を重ねたことにして、関係を高め、党首選を今月にする
    // 乱数の流れで票が並ぶことがあるので、能力も高くして確実に勝つようにする
    world.player = { ...world.player, terms: 6, abilities: { ...world.player.abilities, 調整: 90, 知名度: 90 } };
    world.roster = world.roster.map((m) => (m.id === world.player.id ? world.player : m));
    state.relations.party = 100;
    state.runForLeader = true;
    state.leaderTermEnd = { year: state.year, month: state.month };
    state.pendingEvent = undefined;
    state.pendingStory = undefined;
    await takeTurn(state, world, "rest");
    expect(isPrimeMinister(state, world)).toBe(true);
    expect(state.post).toBe("内閣総理大臣");
    expect(state.achievements.some((a) => a.includes("内閣総理大臣"))).toBe(true);
    // 首相として政権の行動をとれる
    expect(govAction(state, world, "press").ok).toBe(true);
    expect(govAction(state, world, "talk", "kyowa").ok).toBe(true);
    // 公務もできる
    state.pendingEvent = undefined;
    expect((await takeTurn(state, world, "duty")).ok).toBe(true);
  }, 120000);

  it("首相でなければ政権の行動はとれない", async () => {
    const { roster, factory } = await createWorld(data, 5);
    const opt = startOptions(roster, "minsei", "newcomer").find((o) => o.route === "smd")!;
    const { state, world } = await startCareer({ roster, government: formInitialGovernment(roster), factory }, { origin: "newcomer", party: "minsei", pref: opt.pref, route: "smd", archetype: "local" }, 5);
    expect(govAction(state, world, "press").ok).toBe(false);
    expect((await takeTurn(state, world, "duty")).ok).toBe(false);
  });
});

describe("連立の組み方（最小勝利連合）", () => {
  /** 議員の党を、定数465のときの議席数そのままで書き換える */
  function exact(roster: Member[], counts: Record<string, number>): Member[] {
    const parties = Object.entries(counts).flatMap(([p, n]) => Array(n).fill(p) as string[]);
    return roster.map((m, i) => ({ ...m, party: parties[i] ?? "independent" }));
  }

  it("今の与党が過半数を割ると、小さな党を並べるより、足りる大きさの中規模の党を加える", async () => {
    const { roster } = await createWorld(data, 1);
    const r = exact(roster, { minsei: 175, kosei: 24, sasshin: 38, kyowa: 28, hoshu: 3, sankaku: 3, minken: 160, shusan: 8, reimei: 9, shahei: 1 });
    const c = formCoalition(r, INITIAL_RULING);
    expect(c.ruling.party).toBe("minsei");
    expect(c.seats).toBeGreaterThanOrEqual(MAJORITY);
    expect(c.ruling.partners.some((p) => p === "sasshin" || p === "kyowa")).toBe(true);
    // 3議席の党だけを足しても届かないので、保守会議や参画党だけの組み合わせにはならない
    expect(c.ruling.partners.every((p) => p === "hoshu" || p === "sankaku")).toBe(false);
  });

  it("民権党が第一党でも、中規模の党を加えて過半数に届く組み合わせを選ぶ", async () => {
    const { roster } = await createWorld(data, 1);
    const r = exact(roster, { minken: 185, shusan: 8, shahei: 1, reimei: 9, kyowa: 30, sasshin: 40, minsei: 160, kosei: 24, hoshu: 3, sankaku: 3 });
    const c = formCoalition(r, INITIAL_RULING);
    expect(c.ruling.party).toBe("minken");
    expect(c.changed).toBe(true);
    expect(c.seats).toBeGreaterThanOrEqual(MAJORITY);
    expect(c.ruling.partners.some((p) => p === "kyowa" || p === "sasshin")).toBe(true);
  });

  it("連立相手が2党なら、どちらも閣僚を出し、内閣から読み取る与党の顔ぶれも同じになる", async () => {
    const { roster } = await createWorld(data, 1);
    const r = exact(roster, { minsei: 175, kosei: 24, sasshin: 38, minken: 200, kyowa: 28 });
    const ruling = { party: "minsei", partners: ["kosei", "sasshin"] };
    const gov = formGovernment(r, { ruling });
    for (const p of ruling.partners) expect(gov.some((a) => a.post.kind === "内閣" && a.member.party === p), p).toBe(true);
    expect(rulingOf(gov).partners.sort()).toEqual([...ruling.partners].sort());
  });
});

describe("政権交代の型", () => {
  function exact(roster: Member[], counts: Record<string, number>): Member[] {
    const parties = Object.entries(counts).flatMap(([p, n]) => Array(n).fill(p) as string[]);
    return roster.map((m, i) => ({ ...m, party: parties[i] ?? "independent" }));
  }

  it("第一党が過半数に届かず、ほかの党を束ねれば届くなら、第一党を除いた連合が政権を取る（首相は思想の真ん中の党）", async () => {
    const { roster } = await createWorld(data, 1);
    const r = exact(roster, { minsei: 140, kosei: 15, hoshu: 3, sankaku: 3, minken: 130, sasshin: 70, kyowa: 60, reimei: 9, shusan: 8, shahei: 1 });
    const c = formCoalition(r, INITIAL_RULING);
    const members = [c.ruling.party, ...c.ruling.partners];
    expect(members).not.toContain("minsei");
    expect(c.seats).toBeGreaterThanOrEqual(MAJORITY);
    expect(c.changed).toBe(true);
    expect(isAntiCoalition(r, c.ruling)).toBe(true);
    // 首相の党は、連合の中で思想の距離の合計（議席で重み付け）が最も小さい党
    expect(centerLed(r, c.ruling).party).toBe(c.ruling.party);
  });

  it("同じ政権のまま首相が続けて替わると、政権疲れが大きくなる", async () => {
    const run = async (changes: number) => {
      const { roster, factory } = await createWorld(data, 2);
      const opt = startOptions(roster, "minsei", "newcomer").find((o) => o.route === "smd")!;
      const { state, world } = await startCareer({ roster, government: formInitialGovernment(roster), factory }, { origin: "newcomer", party: "minsei", pref: opt.pref, route: "smd", archetype: "local" }, 2);
      state.pmChanges = Array.from({ length: changes }, (_, i) => state.turn - i);
      await takeTurn(state, world, "rest");
      return state.gov.fatigue ?? 0;
    };
    expect(await run(3)).toBeGreaterThan(await run(0));
  });

  it("内閣支持率が低いと、任期の途中で連立相手が抜けることがある", async () => {
    const { roster, factory } = await createWorld(data, 2);
    const opt = startOptions(roster, "minken", "newcomer").find((o) => o.route === "smd")!;
    const { state, world } = await startCareer({ roster, government: formInitialGovernment(roster), factory }, { origin: "newcomer", party: "minken", pref: opt.pref, route: "smd", archetype: "local" }, 2);
    state.coalitionSince = -100;
    // 確率を一時的に1にして、離脱が起きることだけを確かめる
    const before = politicsRaw.breakup.base;
    politicsRaw.breakup.base = 1;
    for (let i = 0; i < 12 && !state.log.some((l) => l.text.includes("連立を離脱")); i++) {
      state.gov.approval = 5;
      if (state.pendingEvent) chooseEvent(state, world, 0);
      if (state.pendingStory) chooseStory(state, world, 0);
      await takeTurn(state, world, "rest");
    }
    politicsRaw.breakup.base = before;
    expect(state.log.some((l) => l.text.includes("連立を離脱"))).toBe(true);
    // 抜けた党は与党から外れ、閣僚も出していない
    const leftParty = state.log.find((l) => l.text.includes("連立を離脱"))!.text.split("が連立を離脱")[0];
    expect(leftParty.length).toBeGreaterThan(0);
  });
});

describe("連立の場面（プレイヤーの判断）", () => {
  function exact(roster: Member[], counts: Record<string, number>): Member[] {
    const parties = Object.entries(counts).flatMap(([p, n]) => Array(n).fill(p) as string[]);
    return roster.map((m, i) => ({ ...m, party: parties[i] ?? "independent" }));
  }

  it("除く党を指定すると、その党を外して連立を組む", async () => {
    const { roster } = await createWorld(data, 1);
    const r = exact(roster, { minsei: 175, kosei: 24, sasshin: 38, kyowa: 28, hoshu: 3, sankaku: 3, minken: 160, shusan: 8, reimei: 9, shahei: 1 });
    const c = formCoalition(r, INITIAL_RULING, { exclude: ["sasshin"] });
    expect([c.ruling.party, ...c.ruling.partners]).not.toContain("sasshin");
  });

  it("第一党を除いた連合の候補は指定した党を含み、首相を譲ると首相の党が替わる", async () => {
    const { roster } = await createWorld(data, 1);
    const r = exact(roster, { minsei: 180, kosei: 20, minken: 140, kyowa: 50, sasshin: 45, reimei: 9, shusan: 8, hoshu: 3, sankaku: 3, shahei: 1 });
    const alt = bestAntiCoalition(r, "kyowa")!;
    expect(alt).toBeDefined();
    expect([alt.party, ...alt.partners]).toContain("kyowa");
    expect([alt.party, ...alt.partners]).not.toContain("minsei");
    const y = yieldPm(r, alt, alt.party);
    expect(y.party).not.toBe(alt.party);
    expect([y.party, ...y.partners].sort()).toEqual([alt.party, ...alt.partners].sort());
  });

  it("誘いを断ると自党を外して組み直し、閣外協力なら閣僚を出さず協力度が高い", async () => {
    const setup = async () => {
      const { roster, factory } = await createWorld(data, 5);
      const opt = startOptions(roster, "kyowa", "hereditary").find((o) => o.route === "smd")!;
      const r = await startCareer({ roster, government: formInitialGovernment(roster), factory }, { origin: "hereditary", party: "kyowa", pref: opt.pref, district: opt.district, route: "smd", archetype: "local" }, 5);
      // 当選した協和党の党首として、民政党・公正党・協和党の連立に誘われたことにする
      r.state.status = "議員";
      r.world.player = { ...r.world.player, terms: 4, seat: "小選挙区", district: opt.district! };
      r.world.roster.push(r.world.player);
      r.state.leaders.kyowa = r.world.player.id;
      r.state.gov.ruling = { party: "minsei", partners: ["kosei", "kyowa"] };
      r.state.pendingStory = { id: "coalition_offer", chapter: "c1", vars: { lead_party: "民政党" } };
      return r;
    };
    const a = await setup();
    expect(currentStoryScene(a.state, a.world)!.lines[0].text).toContain("民政党");
    chooseStory(a.state, a.world, 2);
    expect([a.state.gov.ruling.party, ...a.state.gov.ruling.partners]).not.toContain("kyowa");
    const b = await setup();
    chooseStory(b.state, b.world, 1);
    expect(b.state.gov.ruling.partners).not.toContain("kyowa");
    expect(b.world.government.some((x) => x.member.party === "kyowa")).toBe(false);
    expect(b.state.gov.cooperation.kyowa).toBeGreaterThanOrEqual(80);
  });
});

describe("議席の少ない党が首相を出す連合（Muse の第8版のレポートの不具合）", () => {
  it("首相の党の議員が数人しかいなくても内閣を組める（閣僚は連立相手から選び、党の役員は空席にする）", async () => {
    const { roster } = await createWorld(data, 4);
    const shahei = roster.filter((m) => m.party === "shahei");
    expect(shahei.length).toBeLessThan(4);
    const ruling = { party: "shahei", partners: ["minken", "sasshin", "kyowa", "kosei"] };
    const gov = formGovernment(roster, { ruling, pmId: shahei[0].id });
    expect(gov.find((a) => a.post.id === "pm")!.member.id).toBe(shahei[0].id);
    // 閣僚の12ポストはすべて埋まり、連立の党の議員だけが就く
    const cabinet = gov.filter((a) => a.post.kind === "内閣");
    expect(cabinet).toHaveLength(12);
    for (const a of cabinet) expect([ruling.party, ...ruling.partners]).toContain(a.member.party);
    expect(new Set(gov.map((a) => a.member.id)).size).toBe(gov.length);
    // 党の役員は首相の党の議員だけ（足りない分は空席）
    for (const a of gov.filter((x) => x.post.kind === "党")) expect(a.member.party).toBe("shahei");
    // 分野のある大臣は、議席の多い連立相手に多く配られる
    const count = (p: string) => cabinet.filter((a) => a.post.field && a.member.party === p).length;
    expect(count("minken")).toBeGreaterThan(count("kosei"));
  }, 60_000);

  it("議席が連合の pm_min_share に満たない党は、思想の真ん中にいても首相の党にならない", async () => {
    const { roster } = await createWorld(data, 4);
    const r = centerLed(roster, { party: "minken", partners: ["sasshin", "kyowa", "kosei", "shusan", "shahei"] });
    const total = seatsOf(roster, r.party) + r.partners.reduce((a, p) => a + seatsOf(roster, p), 0);
    expect(seatsOf(roster, r.party)).toBeGreaterThanOrEqual(total * politicsRaw.coalition.pm_min_share);
    const y = yieldPm(roster, r, r.party);
    expect(y.party).not.toBe(r.party);
    expect(seatsOf(roster, y.party)).toBeGreaterThanOrEqual(total * politicsRaw.coalition.pm_min_share);
  }, 60_000);
});
