// 日常の出来事（data/game/life_events.json）の形を確かめる。Gemini などで出来事を足したときの点検を兼ねる
import { describe, expect, it } from "vitest";
import life from "../../data/game/life_events.json";
import skills from "../../data/game/skills.json";

interface Choice {
  label: string;
  result: string;
  effects: Record<string, unknown>;
  risk?: { ability: string; threshold: number; fail_result: string; fail_effects: Record<string, unknown> };
}
interface Event {
  id: string;
  weight: number;
  title: string;
  text: string;
  status?: string[];
  post?: string[];
  months?: number[];
  once?: boolean;
  choices: Choice[];
}

const EVENTS = (life as unknown as { events: Event[] }).events;
const ABILITIES = ["弁舌", "政策", "調整", "知名度", "組織", "資金力"];
const EFFECTS = ["stamina", "max_stamina", "mood", "money", "exp", "relations", "jiban_progress", "abilities", "approval", "skills_add", "skills_remove", "bonds"];
const EXP = ["election", "policy", "network", "media", "money"];
const RELATIONS = ["secretary", "party", "supporters", "press", "kengi"];
const SKILL_IDS = new Set(skills.skills.map((s) => s.id));

describe("日常の出来事のデータ", () => {
  it("id が重ならない", () => {
    const ids = EVENTS.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("立場、役職、月、重みが決まった値になっている", () => {
    for (const e of EVENTS) {
      expect(e.weight, e.id).toBeGreaterThan(0);
      for (const s of e.status ?? []) expect(["候補", "浪人", "議員"], e.id).toContain(s);
      for (const p of e.post ?? []) expect(["minister", "pm", "party_exec", "leader"], e.id).toContain(p);
      if (e.post) expect(e.status, e.id).toEqual(["議員"]);
      for (const m of e.months ?? []) expect(m >= 1 && m <= 12, e.id).toBe(true);
      expect(e.choices.length, e.id).toBeGreaterThanOrEqual(2);
    }
  });

  it("効果の項目と、経験点・関係・能力・特殊能力の名前が正しい", () => {
    for (const e of EVENTS)
      for (const c of e.choices) {
        if (c.risk) {
          expect(ABILITIES, e.id).toContain(c.risk.ability);
          expect(c.risk.fail_result, e.id).toBeTruthy();
        }
        for (const eff of [c.effects, c.risk?.fail_effects].filter((x): x is Record<string, unknown> => !!x))
          for (const [k, v] of Object.entries(eff)) {
            expect(EFFECTS, `${e.id} の ${k}`).toContain(k);
            if (k === "exp") for (const x of Object.keys(v as object)) expect(EXP, e.id).toContain(x);
            if (k === "relations") for (const x of Object.keys(v as object)) expect(RELATIONS, e.id).toContain(x);
            if (k === "abilities") for (const x of Object.keys(v as object)) expect(ABILITIES, e.id).toContain(x);
            if (k === "skills_add" || k === "skills_remove") for (const x of v as string[]) expect(SKILL_IDS.has(x), `${e.id} の ${x}`).toBe(true);
            // 内閣支持率を動かすのは役職に就いているときの出来事だけ
            if (k === "approval") expect(e.post, e.id).toBeDefined();
          }
      }
  });

  it("季節の出来事が1月から12月のどの月にもある", () => {
    const months = new Set(EVENTS.flatMap((e) => e.months ?? []));
    for (let m = 1; m <= 12; m++) expect(months.has(m), `${m}月`).toBe(true);
  });
});
