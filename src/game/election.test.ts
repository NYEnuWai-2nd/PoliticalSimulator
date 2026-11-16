import { describe, expect, it } from "vitest";
import surnames from "../../data/names/surnames.json";
import givenNames from "../../data/names/given_names.json";
import exclusion from "../../data/names/exclude_real_politicians.json";
import type { NameData } from "../data/nameData.js";
import { createWorld } from "./roster.js";
import { nationalSupport, partiesRunning, runElection, seatSummary } from "./election.js";
import { HOUSE_SEATS, PR_SEATS, SMD_SEATS, dhondt } from "./districts.js";

const data = { surnames, givenNames, exclusion } as unknown as NameData;

async function elect(seed: number, approval: number) {
  const { roster, factory } = await createWorld(data, seed);
  return { before: roster, result: await runElection({ year: 2028, month: 10, roster, ronin: [], approval, factory }) };
}

describe("ドント式と全国の支持", () => {
  it("ドント式は合計を保ち、得票の多い党に多く配る", () => {
    const m = dhondt({ a: 30, b: 20, c: 10 }, 6);
    expect([...m.values()].reduce((x, y) => x + y, 0)).toBe(6);
    expect(Object.fromEntries(m)).toEqual({ a: 3, b: 2, c: 1 });
  });

  it("全国の支持は合計100で、内閣支持率が高いほど与党が伸びる", () => {
    const fixed = () => 0.5;
    const low = nationalSupport(20, fixed);
    const high = nationalSupport(50, fixed);
    expect(Object.values(low).reduce((a, b) => a + b, 0)).toBeCloseTo(100, 0);
    expect(high.minsei).toBeGreaterThan(low.minsei);
    expect(high.minken).toBeLessThan(low.minken);
  });

  it("与党第一党と連立相手は同じ県で候補を立てない", () => {
    for (let pref = 1; pref <= 47; pref++)
      for (const inc of [undefined, "minsei", "kosei", "minken"]) {
        const running = partiesRunning(pref, inc);
        expect(running.includes("minsei") && running.includes("kosei"), `${pref} ${inc}`).toBe(false);
      }
    expect(partiesRunning(28, "kosei")).toContain("kosei");
  });
});

describe("総選挙", () => {
  it("小選挙区47・比例29の議員が選ばれ、同じ人が二重に当選しない", async () => {
    const { result } = await elect(1, 33);
    expect(result.roster).toHaveLength(HOUSE_SEATS);
    expect(new Set(result.roster.map((m) => m.id)).size).toBe(HOUSE_SEATS);
    expect(result.roster.filter((m) => m.seat === "小選挙区")).toHaveLength(SMD_SEATS);
    expect(result.roster.filter((m) => m.seat === "比例")).toHaveLength(PR_SEATS);
    expect(new Set(result.roster.filter((m) => m.seat === "小選挙区").map((m) => m.district)).size).toBe(47);
    for (const m of result.roster) expect(m.terms).toBeGreaterThanOrEqual(1);
  });

  it("浪人と引退した人は新しい名簿に入らない", async () => {
    const { result } = await elect(2, 33);
    const ids = new Set(result.roster.map((m) => m.id));
    for (const m of [...result.ronin, ...result.retired]) expect(ids.has(m.id)).toBe(false);
    for (const m of result.ronin) expect(m.seat).toBe("なし");
  });

  it("再選された議員は当選回数が1増える", async () => {
    const { before, result } = await elect(3, 33);
    for (const m of result.roster) {
      const prev = before.find((x) => x.id === m.id);
      if (prev) expect(m.terms).toBe(prev.terms + 1);
      else expect(m.terms).toBe(1);
    }
  });

  it("首相は高齢でも引退しない", async () => {
    const { result } = await elect(4, 33);
    expect(result.retired.some((m) => m.fixedRole)).toBe(false);
  });

  it("同じシードと支持率からは同じ結果になる", async () => {
    const a = await elect(5, 30);
    const b = await elect(5, 30);
    expect(a.result.roster.map((m) => m.id)).toEqual(b.result.roster.map((m) => m.id));
    expect(a.result.support).toEqual(b.result.support);
  });

  it("内閣支持率が低いと与党は議席を減らし、高いと増やす（全国の風）", async () => {
    let low = 0;
    let high = 0;
    for (let seed = 1; seed <= 4; seed++) {
      low += seatSummary((await elect(seed, 18)).result.roster).find((s) => s.party === "minsei")?.total ?? 0;
      high += seatSummary((await elect(seed, 48)).result.roster).find((s) => s.party === "minsei")?.total ?? 0;
    }
    expect(high / 4 - low / 4).toBeGreaterThan(10);
  });
}, 60000);
