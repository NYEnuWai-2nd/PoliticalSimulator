// 法案、政局の出来事、活動の文のデータの形を確かめる（Gemini などで足したときの点検を兼ねる）
import { describe, expect, it } from "vitest";
import bills from "../../data/game/bills.json";
import events from "../../data/game/events.json";
import flavor from "../../data/game/activity_flavor.json";
import tables from "../../data/game/character_tables.json";
import career from "../../data/game/career.json";

const AXES = ["economy", "fiscal", "security", "social", "governance"];
const SPEAKERS = ["pm", "chief_cabinet_secretary", "secretary_general", "opposition_leader", "member", "reporter", "chair", "narrator"];

describe("法案", () => {
  it("id が重ならず、分野と思想の軸が決まった値で、準備の量が範囲内", () => {
    const ids = bills.bills.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const b of bills.bills) {
      expect(tables.specialties, b.id).toContain(b.field);
      for (const [k, v] of Object.entries(b.ideology)) {
        expect(AXES, b.id).toContain(k);
        expect(Math.abs(v as number), b.id).toBeLessThanOrEqual(3);
      }
      expect(b.work >= 1 && b.work <= 6, b.id).toBe(true);
    }
  });

  it("10の分野のどれにも法案がある（どの大臣にも担当の法案がある）", () => {
    for (const f of tables.specialties) expect(bills.bills.some((b) => b.field === f), f).toBe(true);
  });
});

describe("政局の出来事", () => {
  it("話し手の役割が決まった値で、当事者（member）は target があるときだけ使う", () => {
    const ids = events.events.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const e of events.events) {
      const target = "target" in e ? e.target : undefined;
      if (target) expect(["cabinet_low_speech", "ruling_member"], e.id).toContain(target);
      for (const l of e.lines) {
        expect(SPEAKERS, e.id).toContain(l.speaker);
        if (l.speaker === "member") expect(target, e.id).toBeDefined();
      }
      if (e.text.includes("{member}")) expect(target, e.id).toBeDefined();
      if ("months" in e) for (const m of e.months as number[]) expect(m >= 1 && m <= 12, e.id).toBe(true);
    }
  });
});

describe("活動の結果の文", () => {
  it("どの活動にも文があり、条件の値が決まったものになっている", () => {
    const lines = (flavor as unknown as { lines: Record<string, { text: string; months?: number[]; status?: string[]; jiban?: string }[]> }).lines;
    for (const a of career.activities) expect(lines[a.id]?.length, a.id).toBeGreaterThan(0);
    for (const [act, list] of Object.entries(lines)) {
      expect(career.activities.map((a) => a.id), act).toContain(act);
      for (const l of list) {
        expect(l.text.length, l.text).toBeLessThanOrEqual(40);
        for (const s of l.status ?? []) expect(["候補", "浪人", "議員"], l.text).toContain(s);
        if (l.jiban) expect(["low", "high"], l.text).toContain(l.jiban);
      }
    }
  });
});
