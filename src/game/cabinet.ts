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
/** 与党と連立相手。総選挙のあとに入れ替わることがある（政権交代） */
export interface Ruling {
  party: string;
  partners: string[];
}

/** 開始時点の与党（cabinet.json） */
export const INITIAL_RULING: Ruling = { party: DATA.ruling_party, partners: [...DATA.coalition_partners] };
/** 開始時点の与党と連立相手（互換用。動いている与党は Ruling を使う） */
export const RULING_PARTY = INITIAL_RULING.party;
export const COALITION_PARTNERS = INITIAL_RULING.partners;

/** 内閣の顔ぶれから与党を読み取る（首相の党が与党、ほかの閣僚の党が連立相手） */
export function rulingOf(government: Appointment[]): Ruling {
  const pm = government.find((a) => a.post.id === "pm")?.member;
  const party = pm?.party ?? INITIAL_RULING.party;
  const partners = [...new Set(government.filter((a) => a.post.kind === "内閣" && a.member.party !== party).map((a) => a.member.party))];
  return { party, partners };
}

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
/**
 * adjust を渡すと、議員ごとの点数を足し引きできる（null を返した議員は役職に選ばない）。
 * 議員人生モードで、プレイヤーと党の幹部との関係を人事に反映するのに使う。
 */
export function formInitialGovernment(roster: Member[], adjust?: (m: Member) => number | null): Appointment[] {
  return formGovernment(roster, { adjust });
}

export interface GovernmentOptions {
  ruling?: Ruling;
  /** 首相にする議員（与党の党首）。なければ固定キャラクター、それもいなければ与党の有力議員 */
  pmId?: number;
  adjust?: (m: Member, post: Post) => number | null;
}

/** 内閣と与党の党役員を組む。連立相手がいなければ、連立枠の大臣も与党から選ぶ */
/**
 * 連立相手に配る閣僚のポスト（ポストの id → 政党）。分野のある大臣のポストを、連立の議席に占める
 * 連立相手の議席の比で配る（どの連立相手にも少なくとも1つ）。首相の党が連立の中で最も議席が多ければ、
 * 連立相手に配るのは合わせて半分まで。首相の党のほうが小さい連合（第一党を除いた連合で、思想の真ん中の
 * 小さい党が首相を出すとき）では、首相の党も議席の比の分（少なくとも1つ）だけを取り、残りを連立相手に配る。
 * party が ruling_coalition_partner のポスト（国土交通大臣）は、最も議席の多い連立相手に先に配る。
 * ほかのポストは、その党の議員の点数が最も高くなるものから選ぶ
 */
function partnerPosts(roster: Member[], ruling: Ruling): Map<string, string> {
  const out = new Map<string, string>();
  const seats = (p: string) => roster.filter((m) => m.party === p).length;
  const partners = ruling.partners.filter((p) => seats(p) > 0).sort((a, b) => seats(b) - seats(a));
  if (!partners.length) return out;
  const fieldPosts = POSTS.filter((p) => p.kind === "内閣" && p.field);
  const total = seats(ruling.party) + partners.reduce((a, p) => a + seats(p), 0);
  const largest = partners.every((p) => seats(ruling.party) >= seats(p));
  const own = largest ? Math.ceil(fieldPosts.length / 2) : Math.max(1, Math.round((fieldPosts.length * seats(ruling.party)) / total));
  let room = fieldPosts.length - own;
  const quota = new Map(partners.map((p) => [p, Math.max(1, Math.round((fieldPosts.length * seats(p)) / total))]));
  const reserved = fieldPosts.find((p) => p.party === "ruling_coalition_partner");
  if (reserved) {
    out.set(reserved.id, partners[0]);
    quota.set(partners[0], quota.get(partners[0])! - 1);
    room--;
  }
  for (const party of partners) {
    const members = roster.filter((m) => m.party === party && m.fixedRole !== "首相");
    for (let k = quota.get(party)!; k > 0 && room > 0; k--) {
      const free = fieldPosts.filter((p) => !out.has(p.id));
      const best = free
        .map((p) => ({ p, score: Math.max(-Infinity, ...members.map((m) => postScore(p, m))) }))
        .sort((x, y) => y.score - x.score)[0];
      if (!best) break;
      out.set(best.p.id, party);
      room--;
    }
  }
  return out;
}

export function formGovernment(roster: Member[], opts: GovernmentOptions = {}): Appointment[] {
  const ruling = opts.ruling ?? INITIAL_RULING;
  const adjust = opts.adjust;
  const taken = new Set<number>();
  const out: Appointment[] = [];
  const share = partnerPosts(roster, ruling);
  for (const post of POSTS) {
    let member: Member | undefined;
    if (post.fixed_role) {
      member = opts.pmId !== undefined ? roster.find((m) => m.id === opts.pmId && m.party === ruling.party) : undefined;
      member ??= roster.find((m) => m.fixedRole === post.fixed_role && m.party === ruling.party);
      // 固定キャラクターが落選・引退していれば、与党で当選回数と調整・知名度が最も高い議員が首相になる
      if (!member) {
        const score = (m: Member) => m.terms * 4 + m.abilities.調整 + m.abilities.知名度;
        member = roster.filter((m) => m.party === ruling.party && !taken.has(m.id)).reduce<Member | undefined>((b, m) => (!b || score(m) > score(b) ? m : b), undefined);
      }
      if (!member) throw new Error(`${post.name}に就ける議員がいません`);
    } else {
      const assigned = share.get(post.id);
      const parties = assigned ? [assigned] : [ruling.party];
      // 固定キャラクターのうち、首相の役の人はほかの役職に就けない（各党の党首の役の人は大臣にもなれる）
      const open = (m: Member, ps: string[]) => ps.includes(m.party) && !taken.has(m.id) && m.fixedRole !== "首相" && (adjust?.(m, post) ?? 0) !== null;
      let pool = roster.filter((m) => open(m, parties));
      // 連立相手に就ける人がいなければ、与党から選ぶ
      if (!pool.length && parties[0] !== ruling.party) pool = roster.filter((m) => open(m, [ruling.party]));
      // 首相の党の議員が足りなければ（議席の少ない党が首相を出す連合）、閣僚は連立相手から選ぶ
      if (!pool.length && post.kind === "内閣") pool = roster.filter((m) => open(m, ruling.partners));
      const score = (m: Member) => postScore(post, m) + (adjust?.(m, post) ?? 0);
      // 当選回数の条件を満たす人がいなければ、条件を外して選ぶ
      const eligible = pool.filter((m) => m.terms >= (post.min_terms ?? 1));
      const candidates = eligible.length ? eligible : pool;
      member = candidates.reduce<Member | undefined>(
        (best, m) => (!best || score(m) > score(best) ? m : best),
        undefined,
      );
      // 党の役員に就ける議員がいない（首相の党の議員が数人しかいない）ときは、その役職を空席にする
      if (!member) continue;
    }
    taken.add(member.id);
    out.push({ post, member, specialtyMatch: !!post.field && member.specialties.includes(post.field) });
  }
  return out;
}
