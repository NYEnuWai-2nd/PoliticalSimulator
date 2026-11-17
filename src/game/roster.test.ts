import { describe, expect, it } from "vitest";
import surnames from "../../data/names/surnames.json";
import givenNames from "../../data/names/given_names.json";
import exclusion from "../../data/names/exclude_real_politicians.json";
import type { NameData } from "../data/nameData.js";
import { createNameGenerator } from "../lib/nameGenerator.js";
import { ageOf, generateRoster } from "./roster.js";
import type { Member } from "./roster.js";
import { ABILITIES, TABLES, centerOf, rankOf } from "./tables.js";
import { IDEOLOGY_AXES, PARTIES } from "./parties.js";
import { DISTRICTS, HOUSE_SEATS, MAJORITY, PR_SEATS, SMD_SEATS, districtName, districtStrength, districtsOf, findDistrict, initialSeatPlan, largestRemainder, prefOfDistrict } from "./districts.js";
import seats2024 from "../../data/stats/shugiin_2024_seats.json";

const data = { surnames, givenNames, exclusion } as unknown as NameData;
const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

/** 統計の検査用に、複数のシードの名簿をまとめる */
async function manyRosters(seeds: number): Promise<Member[]> {
  const out: Member[] = [];
  for (let s = 1; s <= seeds; s++) out.push(...(await generateRoster(data, s)));
  return out;
}

describe("生成の表", () => {
  it("経歴類型の基準値の合計が320〜340に収まる", () => {
    for (const a of TABLES.archetypes) {
      const total = sum(ABILITIES.map((ab) => centerOf(a.base_ranks[ab])));
      expect(total, a.name).toBeGreaterThanOrEqual(320);
      expect(total, a.name).toBeLessThanOrEqual(340);
    }
  });

  it("重みの合計がほぼ1になり、得意分野は一覧にあるものだけを使う", () => {
    expect(sum(TABLES.archetypes.map((a) => a.weight_shugiin))).toBeCloseTo(1, 2);
    expect(sum(TABLES.term_tiers.map((t) => t.weight_shugiin))).toBeCloseTo(1, 2);
    for (const p of Object.values(TABLES.lineage_profiles)) expect(sum(Object.values(p))).toBeCloseTo(1, 5);
    for (const a of TABLES.archetypes)
      for (const k of Object.keys(a.specialty_weights)) expect(TABLES.specialties, a.name).toContain(k);
  });

  it("能力値からランクへの変換", () => {
    expect([1, 19, 20, 49, 50, 69, 70, 89, 90, 100].map(rankOf).join("")).toBe("GGFEDCBASS");
  });
});

describe("選挙区と開始時点の議席", () => {
  it("定数は小選挙区289と比例176の465、過半数は233（2024年と同じ）", () => {
    expect([SMD_SEATS, PR_SEATS, HOUSE_SEATS, MAJORITY]).toEqual([289, 176, 465, 233]);
  });

  it("県ごとの区の数は2024年と同じで、区の名前は「東京7区」の形", () => {
    expect(districtsOf(13)).toHaveLength(30);
    expect(districtsOf(31)).toHaveLength(2);
    expect(districtsOf(1)).toHaveLength(12);
    expect(DISTRICTS.every((d, i) => d.id === i + 1)).toBe(true);
    expect(districtName(findDistrict(13, 7)!.id)).toBe("東京7区");
    expect(districtName(findDistrict(1, 1)!.id)).toBe("北海道1区");
    expect(districtName(findDistrict(26, 2)!.id)).toBe("京都2区");
  });

  it("最大剰余法は合計を保ち、比に沿って配る", () => {
    const m = largestRemainder({ a: 132, b: 104, c: 23, d: 12, e: 11, f: 4, g: 1, h: 1, i: 1 }, 47);
    expect(sum([...m.values()])).toBe(47);
    expect(m.get("a")).toBe(21);
    expect(m.get("b")).toBe(17);
  });

  it("開始時点の議席は、小選挙区は県ごと・政党ごとに、比例は政党ごとに2024年の当選者数と同じ", () => {
    const plan = initialSeatPlan();
    expect(plan.smd.size).toBe(289);
    const count: Record<string, number> = {};
    for (const p of plan.smd.values()) count[p] = (count[p] ?? 0) + 1;
    expect(count).toEqual(seats2024.smd_total);
    for (const [pref, c] of Object.entries(seats2024.smd_by_prefecture)) {
      const got: Record<string, number> = {};
      for (const d of districtsOf(Number(pref))) got[plan.smd.get(d.id)!] = (got[plan.smd.get(d.id)!] ?? 0) + 1;
      expect(got, pref).toEqual(c);
    }
    expect(sum([...plan.pr.values()])).toBe(176);
    expect(Object.fromEntries(plan.pr)).toEqual(seats2024.pr_total);
  });

  it("県の中では党が交互に区を持つ（千葉は民政党と民権党が7ずつ）", () => {
    const plan = initialSeatPlan();
    const chiba = districtsOf(12).map((d) => plan.smd.get(d.id));
    expect(chiba.slice(0, 4)).toEqual(["minsei", "minken", "minsei", "minken"]);
  });

  it("開始時点は少数与党（民政党と公正党で過半数に届かない）", () => {
    const plan = initialSeatPlan();
    const seatsOf = (id: string) => [...plan.smd.values()].filter((p) => p === id).length + (plan.pr.get(id) ?? 0);
    expect(seatsOf("minsei") + seatsOf("kosei")).toBeLessThan(MAJORITY);
  });

  it("区の強さは、2024年にその区を取った党が高い（同じ県でも区で違う）", () => {
    const [a, b] = districtsOf(12);
    expect(districtStrength(a.id, a.base)).toBeGreaterThan(districtStrength(b.id, a.base));
    expect(districtStrength(a.id, "minsei") + districtStrength(a.id, "minken")).toBeCloseTo(1);
  });
});

describe("generateRoster", () => {
  it("同じシードからは同じ名簿ができる", async () => {
    expect(await generateRoster(data, 2026)).toEqual(await generateRoster(data, 2026));
  });

  it("シードが違えば別の名簿になる", async () => {
    const a = await generateRoster(data, 2026);
    const b = await generateRoster(data, 7);
    expect(a.map((m) => m.name.displayName)).not.toEqual(b.map((m) => m.name.displayName));
  });

  it("定数ぶんの議員がいて、同姓同名がなく、値が範囲内に収まる", async () => {
    const roster = await generateRoster(data, 2026);
    expect(roster).toHaveLength(HOUSE_SEATS);
    expect(new Set(roster.map((m) => m.name.surname + m.name.givenName)).size).toBe(HOUSE_SEATS);
    const districts = roster.filter((m) => m.seat === "小選挙区").map((m) => m.district);
    expect(new Set(districts).size).toBe(SMD_SEATS);
    for (const m of roster) {
      expect(ageOf(m)).toBeGreaterThanOrEqual(TABLES.min_age);
      expect(ageOf(m)).toBeLessThanOrEqual(88);
      for (const a of ABILITIES) {
        expect(m.abilities[a]).toBeGreaterThanOrEqual(1);
        expect(m.abilities[a]).toBeLessThanOrEqual(100);
      }
      expect(m.traits).toHaveLength(3);
      for (const [x, y] of TABLES.personality_pairs) expect(m.traits.includes(x) && m.traits.includes(y)).toBe(false);
      expect(m.home).toBeGreaterThanOrEqual(1);
      expect(m.home).toBeLessThanOrEqual(47);
      if (m.seat === "小選挙区") {
        expect(prefOfDistrict(m.district!)).toBe(m.home);
        expect(m.jiban).toBeGreaterThanOrEqual(2);
        if (m.lineage === "世襲" || m.lineage === "名門") expect(m.jiban).toBeGreaterThanOrEqual(3);
      } else {
        expect(m.district).toBeNull();
        expect(m.jiban).toBeLessThanOrEqual(2);
      }
    }
  });

  it("多くの名簿をまとめると、政党ごとの世襲の比率が設定値に近い", async () => {
    const all = await manyRosters(60);
    const rate = (party: string) => {
      const ms = all.filter((m) => m.party === party);
      return ms.filter((m) => m.lineage === "世襲" || m.lineage === "名門").length / ms.length;
    };
    expect(rate("minsei")).toBeGreaterThan(0.24);
    expect(rate("minsei")).toBeLessThan(0.32);
    expect(rate("minken")).toBeLessThan(0.12);
    // 名簿を60個作るので、ほかのテストと並んで動くと既定の5秒を超えることがある
  }, 30_000);

  it("思想は政党の中心の近くに散らばり、範囲内に収まる", async () => {
    const all = await manyRosters(20);
    for (const m of all) for (const x of IDEOLOGY_AXES) expect(Math.abs(m.ideology[x.id])).toBeLessThanOrEqual(3);
    const mean = (party: string) => {
      const ms = all.filter((m) => m.party === party);
      return ms.reduce((a, m) => a + m.ideology.security, 0) / ms.length;
    };
    expect(mean("minsei")).toBeLessThan(-1);
    expect(mean("minken")).toBeGreaterThan(1);
  });
});

describe("政党", () => {
  it("政党の定義が表と食い違わない", () => {
    const archIds = TABLES.archetypes.map((a) => a.id);
    for (const p of PARTIES) {
      expect(Object.keys(TABLES.lineage_profiles), p.name).toContain(p.lineage_profile);
      for (const x of IDEOLOGY_AXES) expect(p.ideology_center[x.id], p.name).toBeTypeOf("number");
      if (p.archetype_weights) {
        for (const k of Object.keys(p.archetype_weights)) expect(archIds, p.name).toContain(k);
        expect(sum(Object.values(p.archetype_weights)), p.name).toBeCloseTo(1, 1);
      }
    }
  });

  it("あとから出てくる政党は開始時点で議席を持たない", () => {
    const plan = initialSeatPlan();
    for (const p of PARTIES.filter((x) => x.appears_later)) {
      expect([...plan.smd.values()]).not.toContain(p.id);
      expect(plan.pr.has(p.id)).toBe(false);
    }
  });
});

describe("名前生成器の姓の指定", () => {
  it("指定した姓で名だけが変わる", async () => {
    const gen = await createNameGenerator({ ...data, seed: 3 });
    const a = await gen.generate({ surname: "鈴木", gender: "男", birthYear: 1990 });
    const b = await gen.generate({ surname: "鈴木", gender: "女", birthYear: 1990 });
    expect(a.surname).toBe("鈴木");
    expect(b.surname).toBe("鈴木");
    expect(a.surnameKana).toBe("すずき");
    expect(a.givenName).not.toBe(b.givenName);
  });

  it("姓データにない姓はエラーにする", async () => {
    const gen = await createNameGenerator({ ...data, seed: 3 });
    await expect(gen.generate({ surname: "存在しない姓" })).rejects.toThrow();
  });
});
