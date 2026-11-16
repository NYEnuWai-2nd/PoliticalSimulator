// ポップアップで見せる場面（パワプロの会話のようにセリフを順に出す）
// セリフの話し手は役割で書いてあり、その時点の役職者に置き換える。場面は JSON で保存できる形にする。
import dialogueRaw from "../../data/game/dialogue.json";
import { partyById } from "./parties.js";
import type { Member } from "./roster.js";
import type { Appointment } from "./cabinet.js";
import { INITIAL_RULING, rulingOf } from "./cabinet.js";
import type { Ruling } from "./cabinet.js";

export interface SceneLine {
  /** 話し手の名前。地の文なら空 */
  name: string;
  /** 肩書き（首相、官房長官など） */
  role: string;
  /** 話し手の政党（名札の色に使う） */
  party?: string;
  memberId?: number;
  text: string;
}

export interface Scene {
  title: string;
  lines: SceneLine[];
}

export interface LineTemplate {
  speaker: string;
  text: string;
}

export interface SceneVars {
  member?: Member;
  minister?: Member;
  [key: string]: string | number | Member | undefined;
}

interface SceneContext {
  roster: Member[];
  government: Appointment[];
}

const DIALOGUE = dialogueRaw as unknown as { scenes: Record<string, { title: string; variants: LineTemplate[][] }> };

/** 野党第一党（議席が最も多い野党）の党首。当選回数と知名度が最も高い議員とする */
export function oppositionLeader(roster: Member[], ruling: Ruling = INITIAL_RULING): Member | undefined {
  const counts = new Map<string, number>();
  for (const m of roster) {
    if (m.party === ruling.party || ruling.partners.includes(m.party) || partyById(m.party).is_independent) continue;
    counts.set(m.party, (counts.get(m.party) ?? 0) + 1);
  }
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
  if (!top) return undefined;
  const score = (m: Member) => m.terms * 3 + m.abilities.知名度;
  return roster.filter((m) => m.party === top).reduce((a, b) => (score(b) > score(a) ? b : a));
}

function fill(text: string, vars: SceneVars): string {
  return text.replace(/\{(\w+)\}/g, (_, k: string) => {
    const v = vars[k];
    if (v === undefined) return "";
    if (typeof v === "object") return v.name.displayName;
    return String(v);
  });
}

function speak(m: Member | undefined, role: string, text: string): SceneLine {
  if (!m) return { name: role, role: "", text };
  return { name: m.name.displayName, role, party: m.party, memberId: m.id, text };
}

/** 役割で書いたセリフを、実際の話し手に置き換える */
export function resolveLines(templates: LineTemplate[], ctx: SceneContext, vars: SceneVars): SceneLine[] {
  const post = (id: string) => ctx.government.find((a) => a.post.id === id)?.member;
  return templates.map(({ speaker, text }) => {
    const t = fill(text, vars);
    switch (speaker) {
      case "pm":
        return speak(post("pm"), "首相", t);
      case "chief_cabinet_secretary":
        return speak(post("chief_cabinet_secretary"), "官房長官", t);
      case "secretary_general":
        return speak(post("secretary_general"), "幹事長", t);
      case "minister": {
        const m = vars.minister;
        const role = ctx.government.find((a) => a.member.id === m?.id)?.post.name ?? "担当大臣";
        return speak(m, role, t);
      }
      case "member": {
        const m = vars.member;
        const role = ctx.government.find((a) => a.member.id === m?.id)?.post.name ?? (m ? `${partyById(m.party).short}・衆議院議員` : "");
        return speak(m, role, t);
      }
      case "opposition_leader": {
        const m = oppositionLeader(ctx.roster, rulingOf(ctx.government));
        return speak(m, m ? `${partyById(m.party).short}・党首` : "野党党首", t);
      }
      case "chair":
        return { name: "議長", role: "", text: t };
      case "reporter":
        return { name: "記者", role: "", text: t };
      default:
        return { name: "", role: "", text: t };
    }
  });
}

/** dialogue.json の場面を作る。pick は variants から一つ選ぶための0以上1未満の数 */
export function buildScene(key: string, ctx: SceneContext, vars: SceneVars, pick: number): Scene {
  const def = DIALOGUE.scenes[key];
  if (!def) throw new Error(`未知の場面です：${key}`);
  const variant = def.variants[Math.min(def.variants.length - 1, Math.floor(pick * def.variants.length))];
  return { title: fill(def.title, vars), lines: resolveLines(variant, ctx, vars) };
}
