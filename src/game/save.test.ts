import { describe, expect, it } from "vitest";
import surnames from "../../data/names/surnames.json";
import givenNames from "../../data/names/given_names.json";
import exclusion from "../../data/names/exclude_real_politicians.json";
import type { NameData } from "../data/nameData.js";
import { createWorld } from "./roster.js";
import { formInitialGovernment } from "./cabinet.js";
import { chooseEvent, chooseStory, startCareer, startOptions, takeTurn } from "./career.js";
import type { CareerState, CareerWorld } from "./career.js";
import { deserializeCareer, parseSave, serializeCareer } from "./save.js";

const data = { surnames, givenNames, exclusion } as unknown as NameData;
const ACTS = ["local", "speech", "kengi", "rest", "fund", "party"];

async function begin(seed: number) {
  const { roster, factory } = await createWorld(data, seed);
  const government = formInitialGovernment(roster);
  const opt = startOptions(roster, "minsei", "newcomer").find((o) => o.route === "smd")!;
  return startCareer({ roster, government, factory }, { origin: "newcomer", party: "minsei", pref: opt.pref, route: "smd", archetype: "local" }, seed);
}

async function play(state: CareerState, world: CareerWorld, from: number, months: number) {
  for (let t = from; t < from + months && !state.over; t++) {
    if (state.pendingEvent) chooseEvent(state, world, t % 2);
    if (state.pendingStory) chooseStory(state, world, 0);
    await takeTurn(state, world, ACTS[t % ACTS.length]);
  }
}

/** キーの順番によらずに比べる（値が undefined のキーは JSON に出ないので、追加の順で並びが変わることがある） */
const stable = (v: unknown): unknown =>
  Array.isArray(v) ? v.map(stable) : v && typeof v === "object" ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, stable((v as Record<string, unknown>)[k])])) : v;
const snapshot = (state: CareerState, world: CareerWorld) =>
  JSON.stringify(stable(JSON.parse(JSON.stringify({ state, roster: world.roster, ronin: world.ronin, player: world.player, gov: world.government.map((a) => [a.post.id, a.member.id]) }))));

describe("セーブデータ", () => {
  it("途中で保存して読み込んでも、そのまま続けた場合と同じ展開になる（総選挙をまたぐ）", async () => {
    const a = await begin(11);
    await play(a.state, a.world, 0, 20);
    const text = JSON.stringify(serializeCareer(a.state, a.world, 11));
    const b = await deserializeCareer(parseSave(text), data);
    expect(snapshot(b.state, b.world)).toBe(snapshot(a.state, a.world));
    // 総選挙（2028年10月）と候補者の生成をまたいで進める
    await play(a.state, a.world, 20, 40);
    await play(b.state, b.world, 20, 40);
    expect(a.state.elections.length).toBeGreaterThan(0);
    expect(snapshot(b.state, b.world)).toBe(snapshot(a.state, a.world));
  }, 60_000);

  it("議員のプレイヤーは名簿の中の本人と同じものに戻る", async () => {
    const a = await begin(5);
    await play(a.state, a.world, 0, 40);
    const b = await deserializeCareer(parseSave(serializeCareer(a.state, a.world, 5)), data);
    const inRoster = b.world.roster.find((m) => m.id === b.world.player.id);
    if (inRoster) expect(inRoster).toBe(b.world.player);
    for (const ap of b.world.government) expect(b.world.roster).toContain(ap.member);
  }, 60_000);

  it("ほかのデータや壊れたデータは理由をつけて断る", () => {
    expect(() => parseSave("not json")).toThrow(/セーブデータの形式ではありません/);
    expect(() => parseSave({ format: "other" })).toThrow(/セーブデータではありません/);
    expect(() => parseSave({ format: "seiji-career-save", version: 999 })).toThrow(/新しい版/);
    expect(() => parseSave({ format: "seiji-career-save", version: 1 })).toThrow(/古い/);
    expect(() => parseSave({ format: "seiji-career-save", version: 2 })).toThrow(/壊れて/);
  });
});

describe("古いセーブデータの読み込み", () => {
  it("能力が「資金」だったころのセーブデータも、「資金力」に付け替えて読める", async () => {
    const { state, world } = await begin(4);
    await play(state, world, 0, 3);
    const save = JSON.parse(JSON.stringify(serializeCareer(state, world, 4)));
    save.version = 3;
    for (const m of [...save.world.roster, ...save.world.ronin, save.world.player]) {
      m.abilities["資金"] = m.abilities["資金力"];
      delete m.abilities["資金力"];
    }
    const loaded = await deserializeCareer(parseSave(save), data);
    expect(loaded.world.player.abilities.資金力).toBe(world.player.abilities.資金力);
    expect("資金" in loaded.world.player.abilities).toBe(false);
  });
});
