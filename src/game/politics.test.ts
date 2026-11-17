import { describe, expect, it } from "vitest";
import surnames from "../../data/names/surnames.json";
import givenNames from "../../data/names/given_names.json";
import exclusion from "../../data/names/exclude_real_politicians.json";
import type { NameData } from "../data/nameData.js";
import { createWorld } from "./roster.js";
import type { Member } from "./roster.js";
import { formGovernment, formInitialGovernment, INITIAL_RULING, rulingOf } from "./cabinet.js";
import { formCoalition, leaderElection, pickLeader, seatsOf } from "./politics.js";
import { HOUSE_SEATS, MAJORITY } from "./districts.js";
import { chooseEvent, govAction, isPrimeMinister, startCareer, startOptions, takeTurn } from "./career.js";

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
});

describe("首相への道", () => {
  it("当選を重ね、党の幹部との関係が高く、党首選に立候補すると首相になり、政権の行動と公務ができる", async () => {
    const { roster, factory } = await createWorld(data, 4);
    const opt = startOptions(roster, "minsei", "dynasty")[0];
    const { state, world } = await startCareer({ roster, government: formInitialGovernment(roster), factory }, { origin: "dynasty", party: "minsei", pref: opt.pref, route: "smd", archetype: "local" }, 4);
    // 最初の総選挙まで進める
    for (let t = 0; t < 60 && state.elections.length === 0; t++) {
      if (state.pendingEvent) chooseEvent(state, world, 0);
      await takeTurn(state, world, t % 3 === 2 ? "rest" : "local");
    }
    expect(state.status).toBe("議員");
    if (state.gov.ruling.party !== "minsei") return; // 政権を失った場合はこの確認はしない
    // 当選を重ねたことにして、関係を高め、党首選を今月にする
    world.player = { ...world.player, terms: 6 };
    world.roster = world.roster.map((m) => (m.id === world.player.id ? world.player : m));
    state.relations.party = 100;
    state.runForLeader = true;
    state.leaderTermEnd = { year: state.year, month: state.month };
    state.pendingEvent = undefined;
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
