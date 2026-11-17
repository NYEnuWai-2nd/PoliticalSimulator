import { describe, expect, it } from "vitest";
import politicsRaw from "../../data/game/politics.json";
import rulesRaw from "../../data/game/rules.json";
import surnames from "../../data/names/surnames.json";
import givenNames from "../../data/names/given_names.json";
import exclusion from "../../data/names/exclude_real_politicians.json";
import type { NameData } from "../data/nameData.js";
import { createWorld } from "./roster.js";
import { formInitialGovernment } from "./cabinet.js";
import { chooseEvent, chooseStory, currentStoryScene, startCareer, startOptions, takeTurn } from "./career.js";
import type { CareerState, CareerWorld } from "./career.js";
import { DISTRICTS, HOUSE_SEATS, districtStrength } from "./districts.js";
import { nationalSupport, partiesRunning } from "./election.js";
import { applyMerge, applySplit, dynDistrictStrength, existingParties, newRealign, partyExists, resolveParty, supportBaseOf } from "./realign.js";
import { deserializeCareer, parseSave, serializeCareer } from "./save.js";

const data = { surnames, givenNames, exclusion } as unknown as NameData;
const BASE = rulesRaw.election.support_base as unknown as Record<string, number>;

describe("政界再編のあとの党の勢力", () => {
  it("何も起きていなければ、もとの数字のまま", () => {
    const dyn = newRealign();
    expect(existingParties(dyn)).toEqual(existingParties());
    expect(partyExists(dyn, "chudo")).toBe(false);
    for (const d of DISTRICTS.slice(0, 30)) expect(dynDistrictStrength(dyn, d.id, "minsei")).toBeCloseTo(districtStrength(d.id, "minsei"));
    expect(nationalSupport(40, () => 0.5, undefined, {}, dyn)).toEqual(nationalSupport(40, () => 0.5));
  });

  it("合流：なくなった党の支持と地盤を新しい党が引き継ぐ", () => {
    const dyn = newRealign();
    applyMerge(dyn, ["minken", "kosei"], "chudo", 0.9, 10);
    expect(partyExists(dyn, "minken")).toBe(false);
    expect(partyExists(dyn, "kosei")).toBe(false);
    expect(partyExists(dyn, "chudo")).toBe(true);
    expect(resolveParty(dyn, "kosei")).toBe("chudo");
    expect(supportBaseOf(dyn, "chudo")).toBeCloseTo((BASE.minken + BASE.kosei) * 0.9, 1);
    const support = nationalSupport(40, () => 0.5, { party: "minsei", partners: [] }, {}, dyn);
    expect(support.minken).toBeUndefined();
    expect(support.chudo).toBeGreaterThan(20);
    // 民権党が2024年に取った区は、同盟の地盤になる
    const d = DISTRICTS.find((x) => x.base === "minken")!;
    expect(dynDistrictStrength(dyn, d.id, "chudo")).toBeGreaterThanOrEqual(districtStrength(d.id, "minken"));
    expect(partiesRunning(d.id, "chudo", { party: "minsei", partners: [] }, dyn)).toContain("chudo");
    expect(partiesRunning(d.id, "chudo", { party: "minsei", partners: [] }, dyn)).not.toContain("minken");
  });

  it("分裂：出ていった分だけもとの党の支持が減り、移った現職の区は新しい党の地盤になる", () => {
    const dyn = newRealign();
    const d = DISTRICTS.find((x) => x.base === "minsei")!;
    applySplit(dyn, "minsei", "ashita", 0.25, 0.8, [d.id], 5);
    expect(partyExists(dyn, "ashita")).toBe(true);
    expect(supportBaseOf(dyn, "minsei")).toBeCloseTo(BASE.minsei * 0.75, 1);
    expect(supportBaseOf(dyn, "ashita")).toBeCloseTo(BASE.minsei * 0.25 * 0.8, 1);
    expect(dynDistrictStrength(dyn, d.id, "ashita")).toBeGreaterThan(dynDistrictStrength(dyn, d.id, "minsei"));
    const other = DISTRICTS.find((x) => x.base === "minsei" && x.id !== d.id)!;
    expect(dynDistrictStrength(dyn, other.id, "minsei")).toBeGreaterThan(dynDistrictStrength(dyn, other.id, "ashita"));
    expect(dynDistrictStrength(dyn, other.id, "minsei")).toBeLessThan(districtStrength(other.id, "minsei"));
  });
});

async function begin(party: string, seed: number) {
  const { roster, factory } = await createWorld(data, seed);
  const opt = startOptions(roster, party, "hereditary").find((o) => o.route === "smd")!;
  return startCareer({ roster, government: formInitialGovernment(roster), factory }, { origin: "hereditary", party, pref: opt.pref, district: opt.district, route: "smd", archetype: "local" }, seed);
}

/** 場面は pick 番目を選びながら月を進める。stop が真になったら止める */
async function play(state: CareerState, world: CareerWorld, months: number, opts: { each?: () => void; stop?: () => boolean; pick?: (id: string) => number } = {}) {
  for (let t = 0; t < months && !state.over; t++) {
    if (opts.stop?.()) return;
    if (state.pendingEvent) chooseEvent(state, world, 0);
    for (let k = 0; state.pendingStory && k < 10; k++) chooseStory(state, world, opts.pick?.(state.pendingStory.id) ?? 0);
    opts.each?.();
    await takeTurn(state, world, t % 3 === 2 ? "rest" : "local");
  }
}

describe("党の分裂と合流（議員人生モード）", () => {
  it("与党第一党の結束と内閣支持率が低いと党が割れ、プレイヤーは残るか移るかを選べる。移った党で総選挙に出られ、セーブしても続きが同じ", async () => {
    const { state, world } = await begin("minsei", 11);
    state.coalitionSince = -100;
    await play(state, world, 80, {
      each: () => {
        if (state.gov.ruling.party === "minsei") {
          state.gov.cohesion = 0.05;
          state.gov.approval = 15;
        }
      },
      stop: () => state.pendingStory?.id === "party_split",
    });
    expect(state.pendingStory?.id).toBe("party_split");
    const ev = state.realign!.events.at(-1)!;
    expect(ev).toMatchObject({ kind: "split", from: ["minsei"], into: "ashita" });
    expect(world.roster).toHaveLength(HOUSE_SEATS);
    const moved = world.roster.filter((m) => m.party === "ashita");
    expect(moved.length).toBeGreaterThanOrEqual(politicsRaw.realign.split.min_movers);
    expect(moved.some((m) => m.id === state.leaders.ashita)).toBe(true);
    expect(world.player.party).toBe("minsei");
    const scene = currentStoryScene(state, world)!;
    expect(scene.lines[0].text).toContain("あした");
    expect(scene.choices).toHaveLength(2);
    // 離党して加わる
    chooseStory(state, world, 1);
    expect(world.player.party).toBe("ashita");
    expect(state.setup.party).toBe("ashita");
    expect(state.realign!.base[state.setup.district!]).toBe("ashita");
    // セーブして読み込み、同じ展開で次の総選挙を越える
    const save = parseSave(JSON.stringify(serializeCareer(state, world, 11)));
    const loaded = await deserializeCareer(save, data);
    expect(loaded.state.realign).toEqual(state.realign);
    const n = state.elections.length;
    await play(state, world, 60, { stop: () => state.elections.length > n });
    await play(loaded.state, loaded.world, 60, { stop: () => loaded.state.elections.length > n });
    expect(state.elections.length).toBe(n + 1);
    expect(loaded.state.elections.at(-1)).toEqual(state.elections.at(-1));
    expect(world.roster).toHaveLength(HOUSE_SEATS);
    expect(world.player.party).toBe("ashita");
    for (const m of world.roster) expect(partyExists(state.realign, m.party) || m.party === "independent").toBe(true);
  }, 120_000);

  it("野党の党首として合流を決めると、相手の党の議員が自分の党に加わり、相手の党はなくなる", async () => {
    const { state, world } = await begin("minken", 12);
    state.status = "議員";
    world.player = { ...world.player, terms: 5, seat: "小選挙区", district: state.setup.district! };
    world.roster = [...world.roster.filter((m) => m.district !== state.setup.district), world.player];
    state.leaders.minken = world.player.id;
    const before = world.roster.filter((m) => m.party === "minken" || m.party === "shahei").length;
    state.pendingStory = { id: "merge_offer", chapter: "c1", vars: { other_party: "社平党", merged_party: "立憲民権党", a_id: "minken", b_id: "shahei" } };
    expect(currentStoryScene(state, world)!.lines[0].text).toContain("社平党");
    chooseStory(state, world, 0);
    expect(world.roster.filter((m) => m.party === "minken")).toHaveLength(before);
    expect(world.roster.some((m) => m.party === "shahei")).toBe(false);
    expect(partyExists(state.realign, "shahei")).toBe(false);
    expect(state.leaders.minken).toBe(world.player.id);
    expect(state.leaders.shahei).toBeUndefined();
    expect(state.gov.cooperation.shahei).toBeUndefined();
    // そのまま総選挙を越えられる
    await play(state, world, 60, { stop: () => state.elections.length > 0 });
    expect(state.elections.length).toBe(1);
    expect(world.roster.some((m) => m.party === "shahei")).toBe(false);
  }, 120_000);
});
