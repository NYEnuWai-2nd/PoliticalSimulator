import { describe, expect, it } from "vitest";
import surnames from "../../data/names/surnames.json";
import givenNames from "../../data/names/given_names.json";
import exclusion from "../../data/names/exclude_real_politicians.json";
import type { NameData } from "../data/nameData.js";
import { generateRoster } from "./roster.js";
import { formInitialGovernment } from "./cabinet.js";
import {
  BILLS,
  billForecast,
  createGame,
  endTurn,
  nemawashi,
  pressConference,
  startDrafting,
  submitBill,
  talkWithParty,
} from "./game.js";
import type { GameContext, GameState } from "./game.js";
import { distance, partyLine } from "./vote.js";
import { MAJORITY } from "./districts.js";

const data = { surnames, givenNames, exclusion } as unknown as NameData;

async function setup(seed = 2026): Promise<{ g: GameState; ctx: GameContext }> {
  const roster = await generateRoster(data, seed);
  return { g: createGame(seed), ctx: { roster, government: formInitialGovernment(roster) } };
}

/** 予算を準備完了まで進める（月をまたぐ） */
function draftUntilReady(g: GameState, ctx: GameContext, billId: string): void {
  startDrafting(g, ctx, billId);
  for (let i = 0; i < 6 && g.bills[billId].status === "準備中"; i++) endTurn(g, ctx);
}

describe("思想の距離", () => {
  it("法案が持つ軸だけで測り、軸のない法案は0", () => {
    const ide = { economy: 1, fiscal: -2, security: 0, social: 3, governance: 0 };
    expect(distance(ide, { economy: -1, social: 1 })).toBe(2);
    expect(distance(ide, {})).toBe(0);
  });
});

describe("行動", () => {
  it("毎月3回まで行動でき、4回目は断られる", async () => {
    const { g, ctx } = await setup();
    expect(pressConference(g, ctx).ok).toBe(true);
    expect(nemawashi(g, ctx).ok).toBe(true);
    expect(talkWithParty(g, ctx, "kyowa").ok).toBe(true);
    expect(pressConference(g, ctx).ok).toBe(false);
    endTurn(g, ctx);
    expect(g.actionPoints).toBe(3);
    expect(g.month).toBe(2);
  });

  it("政策協議で協力度が上がり、根回しで結束が上がる", async () => {
    const { g, ctx } = await setup();
    const before = g.cooperation.kyowa;
    talkWithParty(g, ctx, "kyowa");
    expect(g.cooperation.kyowa).toBeGreaterThan(before);
    const c = g.cohesion;
    nemawashi(g, ctx);
    expect(g.cohesion).toBeGreaterThan(c);
  });

  it("準備のできていない法案や会期外の法案は出せない", async () => {
    const { g, ctx } = await setup();
    expect(submitBill(g, ctx, "budget").ok).toBe(false);
    draftUntilReady(g, ctx, "budget");
    expect(g.bills.budget.status).toBe("準備完了");
    g.month = 7;
    expect(submitBill(g, ctx, "budget").ok).toBe(false);
  });
});

describe("採決と月の進行", () => {
  it("与党は政府の法案に党として賛成し、協力度が高ければ野党も賛成に回る", async () => {
    const { g } = await setup();
    const budget = { position: {}, popularity: 1 };
    const ctx = { rulingParty: "minsei", coalitionPartners: ["kosei"], cooperation: { ...g.cooperation }, cohesion: g.cohesion };
    expect(partyLine("minsei", budget, ctx)).toBe(true);
    expect(partyLine("kyowa", budget, ctx)).toBe(false);
    expect(partyLine("kyowa", budget, { ...ctx, cooperation: { ...ctx.cooperation, kyowa: 60 } })).toBe(true);
  });

  it("協議なしでは予算は過半数に届かず、協和党と協議すれば届く見込みになる", async () => {
    const { g, ctx } = await setup();
    const budget = BILLS.find((b) => b.id === "budget")!;
    expect(billForecast(g, ctx, budget)).toBeLessThan(MAJORITY);
    g.cooperation.kyowa = 55;
    expect(billForecast(g, ctx, budget)).toBeGreaterThan(MAJORITY);
  });

  it("予算を準備し、協和党と協議して出せば成立する", async () => {
    const { g, ctx } = await setup();
    draftUntilReady(g, ctx, "budget");
    g.cooperation.kyowa = 70;
    expect(submitBill(g, ctx, "budget").ok).toBe(true);
    endTurn(g, ctx);
    expect(g.bills.budget.status).toBe("成立");
    expect(g.log.some((l) => l.kind === "採決" && l.vote?.passed)).toBe(true);
  });

  it("3月末までに予算が成立しないと支持率が下がる記録が残る", async () => {
    const { g, ctx } = await setup();
    for (let i = 0; i < 3; i++) endTurn(g, ctx);
    expect(g.log.some((l) => l.text.includes("暫定予算"))).toBe(true);
  });

  it("同じシードと同じ操作からは同じ結果になる", async () => {
    const run = async () => {
      const { g, ctx } = await setup(11);
      for (let i = 0; i < 8; i++) {
        pressConference(g, ctx);
        talkWithParty(g, ctx, "kyowa");
        endTurn(g, ctx);
      }
      return g;
    };
    expect(await run()).toEqual(await run());
  });

  it("何もしなくても最後まで進み、支持率は範囲内に収まる", async () => {
    for (const seed of [1, 2, 3]) {
      const { g, ctx } = await setup(seed);
      for (let i = 0; i < 40 && !g.over; i++) endTurn(g, ctx);
      expect(g.over).toBeTruthy();
      for (const a of g.approvalHistory) {
        expect(a).toBeGreaterThanOrEqual(1);
        expect(a).toBeLessThanOrEqual(90);
      }
    }
  });

  it("年が変わると翌年度の予算が未着手に戻る", async () => {
    const { g, ctx } = await setup();
    for (let i = 0; i < 12 && !g.over; i++) endTurn(g, ctx);
    if (!g.over) {
      expect(g.year).toBe(2027);
      expect(g.budgetYear).toBe(2027);
      expect(g.bills.budget.status).toBe("未着手");
    }
  });
});
