import { describe, expect, it } from "vitest";
import surnames from "../../data/names/surnames.json";
import givenNames from "../../data/names/given_names.json";
import exclusion from "../../data/names/exclude_real_politicians.json";
import type { NameData } from "../data/nameData.js";
import { generateRoster } from "./roster.js";
import { POSTS, formInitialGovernment } from "./cabinet.js";
import { TABLES } from "./tables.js";

const data = { surnames, givenNames, exclusion } as unknown as NameData;

describe("首相（固定キャラクター）", () => {
  it("石橋茂樹が民政党の鳥取の小選挙区の議員として名簿にいる", async () => {
    const roster = await generateRoster(data, 2026);
    const pm = roster.filter((m) => m.fixedRole === "首相");
    expect(pm).toHaveLength(1);
    expect(pm[0].name.displayName).toBe("石橋 茂樹");
    expect(pm[0].party).toBe("minsei");
    expect(pm[0].district).toBe(31);
    expect(roster.filter((m) => m.district === 31)).toHaveLength(1);
  });

  it("どのシードでも、生成した議員に石橋茂樹と同姓同名はいない", async () => {
    for (let seed = 1; seed <= 20; seed++) {
      const roster = await generateRoster(data, seed);
      expect(roster.filter((m) => m.name.surname + m.name.givenName === "石橋茂樹")).toHaveLength(1);
    }
  });

  it("手作りの値は表の範囲と食い違わない", async () => {
    const pm = (await generateRoster(data, 1)).find((m) => m.fixedRole === "首相")!;
    expect(TABLES.archetypes.map((a) => a.name)).toContain(pm.archetype);
    expect(TABLES.lineages.map((l) => l.name)).toContain(pm.lineage);
    for (const s of pm.specialties) expect(TABLES.specialties).toContain(s);
    const traits = TABLES.personality_pairs.flat();
    for (const t of pm.traits) expect(traits).toContain(t);
  });
});

describe("開始時点の内閣と党役員", () => {
  it("全ポストが埋まり、1人1ポストで、首相は石橋茂樹", async () => {
    for (let seed = 1; seed <= 20; seed++) {
      const gov = formInitialGovernment(await generateRoster(data, seed));
      expect(gov).toHaveLength(POSTS.length);
      expect(new Set(gov.map((a) => a.member.id)).size).toBe(POSTS.length);
      expect(gov.find((a) => a.post.id === "pm")!.member.name.displayName).toBe("石橋 茂樹");
    }
  });

  it("国土交通大臣は公正党、ほかは民政党から選ぶ", async () => {
    const gov = formInitialGovernment(await generateRoster(data, 2026));
    for (const a of gov) expect(a.member.party, a.post.name).toBe(a.post.id === "land" ? "kosei" : "minsei");
  });

  it("閣僚12、党三役3の構成", () => {
    expect(POSTS.filter((p) => p.kind === "内閣")).toHaveLength(12);
    expect(POSTS.filter((p) => p.kind === "党")).toHaveLength(3);
    const fields = POSTS.filter((p) => p.field).map((p) => p.field);
    expect(new Set(fields).size).toBe(10);
    for (const f of fields) expect(TABLES.specialties).toContain(f);
  });

  it("同じ名簿からは同じ顔ぶれになる", async () => {
    const roster = await generateRoster(data, 2026);
    const ids = (r: typeof roster) => formInitialGovernment(r).map((a) => a.member.id);
    expect(ids(roster)).toEqual(ids(roster));
  });
});
