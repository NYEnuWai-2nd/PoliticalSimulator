import { describe, expect, it } from "vitest";
import surnames from "../../data/names/surnames.json";
import givenNames from "../../data/names/given_names.json";
import exclusion from "../../data/names/exclude_real_politicians.json";
import skillsRaw from "../../data/game/skills.json";
import lifeRaw from "../../data/game/life_events.json";
import type { NameData } from "../data/nameData.js";
import { createWorld } from "./roster.js";
import { formInitialGovernment } from "./cabinet.js";
import { chooseEvent, chooseStory, currentStoryScene, startCareer, startOptions, takeTurn } from "./career.js";
import type { CareerState, CareerWorld } from "./career.js";
import { BG_NAMES, STORIES, leaderVoteBias, newBondState } from "./story.js";
import { leaderElection } from "./politics.js";
import { deserializeCareer, parseSave, serializeCareer } from "./save.js";

const data = { surnames, givenNames, exclusion } as unknown as NameData;

const SPEAKERS = ["self", "secretary", "rival", "doki", "senpai", "narrator", "other"];
const EFFECTS = ["stamina", "mood", "money", "exp", "relations", "bonds", "bond_state", "jiban_progress", "abilities", "approval", "vote_bonus", "skills_add", "skills_remove"];
const CONDITIONS = ["trigger", "status", "post", "ruling", "terms_min", "terms_max", "age_min", "age_max", "abilities", "relations", "bonds_min", "bonds_max", "bond_state", "jiban_min", "skills", "no_skills", "flags", "no_flags", "months", "won_last", "margin_max", "rival_in_district"];
const SKILL_IDS = new Set((skillsRaw as { skills: { id: string }[] }).skills.map((s) => s.id));
const len = (s: string) => [...s].length;

describe("物語のデータ", () => {
  it("背景、話し手、条件、効果の種類が決めた範囲にあり、次の章と結末の行き先がある", () => {
    const set = new Set<string>();
    const used = new Set<string>();
    for (const s of STORIES) {
      const ids = new Set([...s.chapters.map((c) => c.id), ...s.endings.map((e) => e.id)]);
      expect(s.endings.length, s.id).toBeGreaterThanOrEqual(2);
      for (const k of Object.keys(s.start)) expect(CONDITIONS, `${s.id}.start`).toContain(k);
      for (const c of s.chapters) {
        const w = `${s.id}.${c.id}`;
        expect(Object.keys(BG_NAMES), w).toContain(c.bg);
        for (const k of Object.keys(c.conditions ?? {})) expect(CONDITIONS, w).toContain(k);
        for (const f of [...(c.conditions?.flags ?? []), ...(c.conditions?.no_flags ?? [])]) used.add(f);
        if (c.fallback) expect(ids.has(c.fallback), w).toBe(true);
        for (const l of c.lines) {
          expect(SPEAKERS, w).toContain(l.speaker);
          if (l.speaker === "other") expect(l.name, w).toBeTruthy();
          expect(len(l.text), `${w}：${l.text}`).toBeLessThanOrEqual(64);
        }
        // if_flags のない選択肢が必ず1つはある（どれも出ずに詰まらないように）
        expect(c.choices.some((ch) => !ch.if_flags?.length), w).toBe(true);
        for (const ch of c.choices) {
          expect(ids.has(ch.next), `${w}：${ch.label}`).toBe(true);
          if (ch.risk?.fail_next) expect(ids.has(ch.risk.fail_next), w).toBe(true);
          for (const e of [ch.effects, ch.risk?.fail_effects ?? {}]) {
            for (const k of Object.keys(e)) expect(EFFECTS, w).toContain(k);
            for (const id of [...(e.skills_add ?? []), ...(e.skills_remove ?? [])]) expect(SKILL_IDS.has(id), `${w}：${id}`).toBe(true);
          }
          for (const f of ch.flags ?? []) set.add(f);
          for (const f of ch.if_flags ?? []) used.add(f);
        }
      }
      for (const e of s.endings) for (const k of Object.keys(e.effects ?? {})) expect(EFFECTS, `${s.id}.${e.id}`).toContain(k);
    }
    // 使う旗はどこかで立てる
    for (const f of used) expect(set.has(f), f).toBe(true);
  });
});

/** 新人で始め、当選5回の議員にして、自分の区の相手をライバルにする */
async function asMember(seed = 4) {
  const { roster, factory } = await createWorld(data, seed);
  const opt = startOptions(roster, "minsei", "newcomer").find((o) => o.route === "smd")!;
  const r = await startCareer({ roster, government: formInitialGovernment(roster), factory }, { origin: "newcomer", party: "minsei", pref: opt.pref, district: opt.district, route: "smd", archetype: "local" }, seed);
  const rival = r.world.roster.find((m) => m.seat === "小選挙区" && m.district === opt.district)!;
  r.state.status = "議員";
  r.world.player = { ...r.world.player, terms: 5 };
  r.state.bonds = newBondState();
  r.state.bonds.roles.rival = rival.id;
  r.state.bonds.people[String(rival.id)] = { value: 0 };
  return { ...r, rival };
}

async function nextMonth(state: CareerState, world: CareerWorld) {
  if (state.pendingEvent) chooseEvent(state, world, 0);
  await takeTurn(state, world, "rest");
}

describe("物語の進み方", () => {
  it("章が来ると月を進められず、場面の名前は置き換わり、選ぶと次の章が決まって関係が動く", async () => {
    const { state, world, rival } = await asMember();
    state.story!.active = [{ id: "rival_crossroad", chapter: "c1", due: state.turn, deadline: state.turn + 6 }];
    await nextMonth(state, world);
    expect(state.pendingStory?.id).toBe("rival_crossroad");
    expect((await takeTurn(state, world, "rest")).ok).toBe(false);
    const scene = currentStoryScene(state, world)!;
    expect(scene.title).toBe("同じ空の下で");
    expect(scene.chapterNo).toBe(1);
    expect(scene.place).toBe("駅前");
    expect(scene.lines.every((l) => !l.text.includes("{"))).toBe(true);
    expect(scene.lines.some((l) => l.role === "rival" && l.memberId === rival.id)).toBe(true);
    // 最初の選択肢（笑顔で挨拶）はライバルとの関係が上がる
    const r = chooseStory(state, world, 0);
    expect(r.ok).toBe(true);
    expect(state.bonds!.people[String(rival.id)].value).toBe(10);
    expect(state.story!.flags).toContain("rival_greet");
    expect(state.story!.active[0]).toMatchObject({ id: "rival_crossroad", chapter: "c2" });
    expect(state.pendingStory).toBeUndefined();
  });

  it("最後の章を選ぶと結末になり、間柄の札が付いて記録に残る", async () => {
    const { state, world, rival } = await asMember();
    for (let i = 0; i < 80 && !state.story!.done.rival_crossroad; i++) {
      if (!state.story!.active.length && !state.pendingStory) state.story!.active = [{ id: "rival_crossroad", chapter: "c1", due: state.turn, deadline: state.turn + 6 }];
      if (state.pendingStory) chooseStory(state, world, 0);
      else await nextMonth(state, world);
    }
    expect(state.story!.done.rival_crossroad).toBe("end_worthy");
    expect(state.bonds!.people[String(rival.id)].tag).toBe("好敵手");
    expect(state.log.some((l) => l.level === "major" && l.text.includes("結末「誇り高き好敵手」"))).toBe(true);
  }, 60_000);

  it("物語の途中で保存して読み込んでも、同じ章と同じ選択肢が出る", async () => {
    const { state, world } = await asMember();
    state.story!.active = [{ id: "rival_crossroad", chapter: "c1", due: state.turn, deadline: state.turn + 6 }];
    await nextMonth(state, world);
    const before = currentStoryScene(state, world)!;
    const loaded = await deserializeCareer(parseSave(JSON.stringify(serializeCareer(state, world, 4))), data);
    expect(currentStoryScene(loaded.state, loaded.world)).toEqual(before);
  });

  it("毎月の物語は、条件を満たしていれば何年かのうちに始まる", async () => {
    const { state, world } = await asMember(5);
    state.relations.secretary = 80;
    for (let i = 0; i < 120 && !state.story!.active.length && !state.pendingStory; i++) await nextMonth(state, world);
    expect(state.story!.active.length + (state.pendingStory ? 1 : 0)).toBeGreaterThan(0);
  }, 60_000);
});

describe("人物との関係", () => {
  it("初当選すると同期と先輩が決まり、総選挙で戦った相手がライバルになる", async () => {
    const { roster, factory } = await createWorld(data, 3);
    const opt = startOptions(roster, "minsei", "hereditary").find((o) => o.route === "smd")!;
    const { state, world } = await startCareer({ roster, government: formInitialGovernment(roster), factory }, { origin: "hereditary", party: "minsei", pref: opt.pref, district: opt.district, route: "smd", archetype: "local" }, 3);
    for (let i = 0; i < 60 && !state.elections.length; i++) {
      if (state.pendingStory) chooseStory(state, world, 0);
      await nextMonth(state, world);
    }
    expect(state.elections[0].won).toBe(true);
    const b = state.bonds!;
    expect(b.roles.rival).toBeDefined();
    expect(state.elections[0].district.some((x) => !x.isPlayer)).toBe(true);
    expect(b.roles.doki).toBeDefined();
    const doki = world.roster.find((m) => m.id === b.roles.doki)!;
    expect(doki.party).toBe("minsei");
    expect(doki.terms).toBe(1);
    const senpai = world.roster.find((m) => m.id === b.roles.senpai)!;
    expect(senpai.terms).toBeGreaterThanOrEqual(5);
  }, 120_000);

  it("盟友や師弟の札がある同期・先輩は、党首選で自分に入れ、不和の札なら相手に入れる", async () => {
    const { roster } = await createWorld(data, 3);
    const mates = roster.filter((m) => m.party === "minsei");
    const me = mates.sort((a, b) => a.terms - b.terms)[0];
    const [doki, senpai] = mates.filter((m) => m.id !== me.id).slice(0, 2);
    const bonds = newBondState();
    bonds.roles = { doki: doki.id, senpai: senpai.id };
    bonds.people[String(doki.id)] = { value: 50, tag: "盟友" };
    bonds.people[String(senpai.id)] = { value: -50, tag: "不和" };
    const bias = leaderVoteBias(bonds);
    expect(bias).toEqual({ for: [doki.id], against: [senpai.id] });
    const r = leaderElection(roster, "minsei", { extra: { member: me, bonus: 0 }, bias, rand: () => 0.5 })!;
    expect(r.candidates.find((c) => c.member.id === me.id)!.votes).toBeGreaterThanOrEqual(1);
  });
});

describe("人物の出来事と、総選挙などで動く関係", () => {
  it("needs の人物がいないと、その日常の出来事は起きない（同期のいない候補には同期の出来事が来ない）", async () => {
    const { roster, factory } = await createWorld(data, 6);
    const opt = startOptions(roster, "minsei", "newcomer").find((o) => o.route === "smd")!;
    const { state, world } = await startCareer({ roster, government: formInitialGovernment(roster), factory }, { origin: "newcomer", party: "minsei", pref: opt.pref, district: opt.district, route: "smd", archetype: "local" }, 6);
    const seen = new Set<string>();
    for (let i = 0; i < 20 && !state.elections.length; i++) {
      if (state.pendingEvent) {
        seen.add(state.pendingEvent.id);
        expect(state.pendingEvent.text.includes("{")).toBe(false);
      }
      if (state.pendingStory) chooseStory(state, world, 0);
      await nextMonth(state, world);
    }
    const needs = new Map((lifeRaw as { events: { id: string; needs?: string }[] }).events.map((e) => [e.id, e.needs]));
    for (const id of seen) expect(needs.get(id), id).not.toBe("doki");
    expect(state.bonds!.roles.doki).toBeUndefined();
  }, 60_000);

  it("ライバルとの接戦を制すると関係が上がり、記録に残る", async () => {
    const { roster, factory } = await createWorld(data, 3);
    const opt = startOptions(roster, "minsei", "hereditary").find((o) => o.route === "smd")!;
    const { state, world } = await startCareer({ roster, government: formInitialGovernment(roster), factory }, { origin: "hereditary", party: "minsei", pref: opt.pref, district: opt.district, route: "smd", archetype: "local" }, 3);
    for (let i = 0; i < 60 && !state.elections.length; i++) {
      if (state.pendingStory) chooseStory(state, world, 0);
      await nextMonth(state, world);
    }
    const e = state.elections[0];
    const me = e.district.find((x) => x.isPlayer)!;
    const other = e.district.filter((x) => !x.isPlayer).sort((a, b) => b.share - a.share)[0];
    const margin = Math.abs(me.share - other.share) * 100;
    const rival = state.bonds!.people[String(state.bonds!.roles.rival)];
    // 大差なら-5、僅差なら+8、その間なら0（ライバルになった直後の値は0）
    expect(rival.value).toBe(margin >= 10 ? -5 : margin < 5 ? 8 : 0);
    if (margin >= 10 || margin < 5) expect(state.log.some((l) => l.text.startsWith("ライバル"))).toBe(true);
  }, 120_000);
});
