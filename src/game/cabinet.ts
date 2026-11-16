// 開始時点の内閣と与党の党役員（設計は docs/design.md の4節）
import raw from "../../data/game/cabinet.json";
import type { Member } from "./roster.js";
import type { Ability } from "./tables.js";

export interface Post {
  id: string;
  name: string;
  kind: "内閣" | "党";
  /** 対応する得意分野（大臣のみ） */
  field?: string;
  /** 固定キャラクターを就ける役職 */
  fixed_role?: string;
  min_terms?: number;
  /** "ruling_coalition_partner" なら連立相手から選ぶ */
  party?: "ruling_coalition_partner";
  weights?: Partial<Record<Ability, number>>;
}

interface CabinetData {
  ruling_party: string;
  coalition_partners: string[];
  specialty_bonus: number;
  terms_weight: number;
  posts: Post[];
}

const DATA = raw as unknown as CabinetData;
export const POSTS = DATA.posts;
export const RULING_PARTY = DATA.ruling_party;
export const COALITION_PARTNERS = DATA.coalition_partners;

export interface Appointment {
  post: Post;
  member: Member;
  /** 得意分野と役職の分野が一致しているか */
  specialtyMatch: boolean;
}

/** その議員をその役職に就けたときの点数 */
export function postScore(post: Post, m: Member): number {
  let s = 0;
  for (const [ab, w] of Object.entries(post.weights ?? {})) s += m.abilities[ab as Ability] * (w ?? 0);
  if (post.field && m.specialties.includes(post.field)) s += DATA.specialty_bonus;
  s += Math.min(m.terms, 12) * DATA.terms_weight;
  return s;
}

/**
 * 開始時点の内閣と党役員を組む。POSTS の順に、まだ役職のない議員から点数が最も高い人を選ぶ。
 * 同点なら議員番号の小さい人を選ぶので、同じ名簿からは毎回同じ顔ぶれになる。
 */
export function formInitialGovernment(roster: Member[]): Appointment[] {
  const taken = new Set<number>();
  const out: Appointment[] = [];
  for (const post of POSTS) {
    let member: Member | undefined;
    if (post.fixed_role) {
      member = roster.find((m) => m.fixedRole === post.fixed_role);
      // 固定キャラクターが落選・引退していれば、与党で当選回数と調整・知名度が最も高い議員が首相になる
      if (!member) {
        const score = (m: Member) => m.terms * 4 + m.abilities.調整 + m.abilities.知名度;
        member = roster.filter((m) => m.party === RULING_PARTY && !taken.has(m.id)).reduce<Member | undefined>((b, m) => (!b || score(m) > score(b) ? m : b), undefined);
      }
      if (!member) throw new Error(`${post.name}に就ける議員がいません`);
    } else {
      const parties = post.party === "ruling_coalition_partner" ? COALITION_PARTNERS : [RULING_PARTY];
      const pool = roster.filter((m) => parties.includes(m.party) && !taken.has(m.id) && !m.fixedRole);
      // 当選回数の条件を満たす人がいなければ、条件を外して選ぶ
      const eligible = pool.filter((m) => m.terms >= (post.min_terms ?? 1));
      const candidates = eligible.length ? eligible : pool;
      member = candidates.reduce<Member | undefined>(
        (best, m) => (!best || postScore(post, m) > postScore(post, best) ? m : best),
        undefined,
      );
      if (!member) throw new Error(`${post.name}に就ける議員がいません`);
    }
    taken.add(member.id);
    out.push({ post, member, specialtyMatch: !!post.field && member.specialties.includes(post.field) });
  }
  return out;
}
