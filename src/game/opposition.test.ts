import { describe, expect, it } from "vitest";
import { initialSeatPlan } from "./districts.js";
import surnames from "../../data/names/surnames.json";
import givenNames from "../../data/names/given_names.json";
import exclusion from "../../data/names/exclude_real_politicians.json";
import type { NameData } from "../data/nameData.js";
import { createWorld } from "./roster.js";
import { formInitialGovernment } from "./cabinet.js";
import { chooseEvent, chooseStory, isOppositionLeader, oppAction, oppositionLineup, raceForecast, shadowCabinet, startCareer, startOptions, takeTurn } from "./career.js";
import { applyPacts, countNoConfidence, initialCooperation, pactTransfer } from "./opposition.js";

const data = { surnames, givenNames, exclusion } as unknown as NameData;

/** 民権党の議員として始め、党首にする */
async function minkenLeader(seed = 4) {
  const { roster, factory } = await createWorld(data, seed);
  const opt = startOptions(roster, "minken", "newcomer").find((o) => o.route === "smd")!;
  const r = await startCareer({ roster, government: formInitialGovernment(roster), factory }, { origin: "newcomer", party: "minken", pref: opt.pref, district: opt.district, route: "smd", archetype: "local" }, seed);
  r.state.status = "議員";
  r.world.player = { ...r.world.player, terms: 5, seat: "小選挙区", district: opt.district! };
  r.state.leaders.minken = r.world.player.id;
  return r;
}

async function nextMonth(state: Awaited<ReturnType<typeof minkenLeader>>["state"], world: Awaited<ReturnType<typeof minkenLeader>>["world"]) {
  if (state.pendingEvent) chooseEvent(state, world, 0);
  if (state.pendingStory) chooseStory(state, world, 0);
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

describe("開始時点の党首（固定キャラクター）", () => {
  it("議席のある各党の党首が手作りのキャラクターで、比例の党首も名簿にいる", async () => {
    const { state, world } = await minkenLeader(6);
    // minkenLeader は自分を民権党の党首にするので、ほかの党で確かめる
    const names = (p: string) => world.roster.find((m) => m.id === state.leaders[p])?.name.displayName;
    expect(names("minsei")).toBe("石橋 茂樹");
    expect(names("sasshin")).toBe("吉井 洋平");
    expect(names("kyowa")).toBe("玉井 雄二郎");
    expect(names("kosei")).toBe("斉木 鉄夫");
    expect(names("reimei")).toBe("山元 二郎");
    expect(names("shusan")).toBe("田代 雅子");
    expect(names("sankaku")).toBe("神山 宗一");
    const yamana = world.roster.find((m) => m.name.displayName === "山元 二郎")!;
    expect(yamana.seat).toBe("比例");
    expect(world.roster.filter((m) => m.party === "reimei").length).toBe(initialSeatPlan().pr.get("reimei"));
  });

  it("固定キャラクターの名前は、実在の議員と漢字・読みが一致しない", async () => {
    const { createHash } = await import("node:crypto");
    const scenario = (await import("../../data/game/scenario.json")).default as unknown as { fixed_members: { name: { surname: string; givenName: string; surnameKana: string; givenNameKana: string } }[] };
    const ex = exclusion as unknown as { kanji_sha256: string[]; reading_sha256: string[]; normalize_kanji_variants: Record<string, string> };
    const K = new Set(ex.kanji_sha256);
    const R = new Set(ex.reading_sha256);
    const h = (s: string) => createHash("sha256").update(s).digest("hex");
    const norm = (s: string) => [...s].map((c) => ex.normalize_kanji_variants[c] ?? c).join("");
    for (const f of scenario.fixed_members) {
      expect(K.has(h(norm(f.name.surname + f.name.givenName))), f.name.surname + f.name.givenName).toBe(false);
      expect(R.has(h(f.name.surnameKana + f.name.givenNameKana)), f.name.surnameKana).toBe(false);
    }
  });
});

describe("影の内閣", () => {
  it("分野ごとに影の大臣がいて、党首や4役職の人とは重ならない", async () => {
    const { state, world } = await minkenLeader();
    const cab = shadowCabinet(state, world);
    expect(cab.length).toBeGreaterThan(5);
    const lineup = new Set(oppositionLineup(state, world).map((x) => x.member.id));
    for (const x of cab) {
      expect(lineup.has(x.member.id)).toBe(false);
      expect(x.member.id).not.toBe(state.leaders.minken);
    }
    expect(new Set(cab.map((x) => x.member.id)).size).toBe(cab.length);
  });
});
