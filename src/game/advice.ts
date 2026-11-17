// 毎月の助言（標準モードで秘書が話す。CLI の hint でも使う）。
// 今の数値を条件の表に当てはめ、優先度の高いものから数個を返す。画面には依存しない。
import careerRaw from "../../data/game/career.json";
import { ACTIVITIES, breakdownChance, canLearnSkill, isOppositionLeader, canRunForLeader, canUpgrade, isPrimeMinister, moneyOutlook, postCategory, prRank, raceForecast } from "./career.js";
import type { CareerState, CareerWorld } from "./career.js";
import { ABILITIES } from "./tables.js";
import { SKILLS, neglectShift, skillById } from "./skills.js";

const C = careerRaw;

export interface Advice {
  /** 秘書の台詞（「先生、」で始まる短い文） */
  text: string;
  /** すすめる活動の id（"duty" は職務） */
  act?: string;
  /** 見に行くとよい画面 */
  tab?: "self" | "party" | "cabinet";
  /** 大きいほど先に出す */
  priority: number;
  /** 放っておくと困ること（体力、資金、地盤、情勢の悪化など）。「警告だけ」の設定ではこれだけを出す */
  warn?: boolean;
}

/** 助言の出し方。all は全部、warn は警告だけ、off は出さない */
export type AdviceLevel = "all" | "warn" | "off";

/** 警告とみなす優先度の下限 */
const WARN_PRIORITY = 75;

const actName = (id: string) => (id === "duty" ? "職務" : (ACTIVITIES.find((a) => a.id === id)?.name ?? id));

/** 今月の助言を、優先度の高い順に最大 max 個返す。すすめる活動は最初のものが今月のおすすめ */
export function adviseMonth(state: CareerState, world: CareerWorld, max = 3): Advice[] {
  const p = world.player;
  const out: Advice[] = [];
  const add = (a: Advice) => out.push(a);
  const mo = moneyOutlook(state);
  const nearElection = mo.monthsToElection <= 12;

  // 首相：政権の行動が残っている
  if (isPrimeMinister(state, world) && state.gov.actionPoints > 0)
    add({ text: `総理、今月の政権の行動があと${state.gov.actionPoints}回残っています。内閣の画面で法案や根回しを進めましょう。`, tab: "cabinet", priority: 95 });

  // 野党の党首：党首の行動が残っている。選挙協力を結べる相手がいる
  if (isOppositionLeader(state, world) && state.opp && state.opp.actionPoints > 0) {
    add({ text: `党首の行動があと${state.opp.actionPoints}回残っています。自党の画面で、ほかの野党との会談や党首討論を進めましょう。`, tab: "party", priority: 74 });
    const ready = Object.entries(state.opp.cooperation).filter(([p, c]) => c >= 60 && !state.opp!.pacts.includes(p) && world.roster.some((m) => m.party === p) && p !== state.gov.ruling.party && !state.gov.ruling.partners.includes(p));
    if (ready.length && mo.monthsToElection <= 18)
      add({ text: `総選挙まであと${mo.monthsToElection}か月です。協力度の高い党と選挙協力を結べば、小選挙区で候補者を一本化できます。`, tab: "party", priority: 76 });
  }

  // 体力
  if (state.stamina < 30)
    add({
      text:
        breakdownChance(state.stamina) > 0
          ? `先生、顔色が悪いですよ（体力${state.stamina}）。体力を使う活動をすると${Math.round(breakdownChance(state.stamina) * 100)}%の確率で倒れます。今月は休養にしましょう。`
          : `先生、疲れがたまっています（体力${state.stamina}）。20を切ると、体力を使う活動の途中で倒れることがあります。そろそろ休養を。`,
      act: "rest",
      priority: 100,
    });
  else if (state.stamina < 45) add({ text: `体力が${state.stamina}まで減っています。重い活動の前に、休養か趣味の時間を挟むと安心です。`, act: "rest", priority: 45 });

  // 資金
  if (mo.monthsLeft < 4)
    add({ text: `資金があと${mo.monthsLeft}か月分しかありません（毎月${mo.expense}万円かかります）。資金集めをお願いします。`, act: "fund", priority: 90 });
  else if (nearElection && state.money < mo.electionCost / 2)
    add({ text: `総選挙まであと${mo.monthsToElection}か月です。選挙費用（最大${mo.electionCost}万円）が足りません。資金集めで蓄えましょう。`, act: "fund", priority: 80 });

  // 地盤が下がりそう
  const neglectLimit = C.jiban_neglect_months + neglectShift(p.skills);
  const left = neglectLimit - state.jibanNeglect;
  if (p.jiban > 1 && left <= 2)
    add({ text: `しばらく地元に顔を出していません。あと${Math.max(left, 0)}か月で地盤が下がります。地元回りか地域行事に出ましょう。`, act: "local", priority: 88 });

  // 選挙の情勢
  if (state.setup.route === "pr") {
    if (nearElection)
      add({ text: `比例名簿の順位は党の幹部との関係で決まります（今は${prRank(state) + 1}位の見込み、関係${state.relations.party}）。党務で上を狙いましょう。`, act: "party", priority: 82 });
  } else {
    const f = raceForecast(state, world);
    const me = f.find((x) => x.isPlayer);
    const top = f.find((x) => !x.isPlayer);
    if (me && top && nearElection) {
      const gap = Math.round((top.share - me.share) * 1000) / 10;
      if (gap > 0)
        add({ text: `総選挙まであと${mo.monthsToElection}か月。相手の${top.name}氏に${gap}ポイント負けています。地元回りで地盤を固めましょう。`, act: p.jiban < 4 ? "local" : "speech", priority: 85 });
      else add({ text: `総選挙まであと${mo.monthsToElection}か月、情勢は優勢です（${-gap}ポイントの差）。油断せず地元を固めましょう。`, act: "festival", priority: 40 });
    }
  }

  // この数か月の推移（月末ごとの記録と今を比べる）
  const past = state.history?.find((h) => state.turn - h.turn >= 3) ?? state.history?.[0];
  if (past && state.turn - past.turn >= 2) {
    const months = state.turn - past.turn;
    const dm = state.money - past.money;
    if (dm <= -150 && mo.monthsLeft < 24)
      add({ text: `この${months}か月で資金が${-dm}万円減っています（今は${state.money}万円）。早めに資金集めを挟みましょう。`, act: "fund", priority: 78 });
    const da = Math.round((state.gov.approval - past.approval) * 10) / 10;
    const mine = state.gov.ruling.party === state.setup.party || state.gov.ruling.partners.includes(state.setup.party);
    if (Math.abs(da) >= 4)
      add({
        text: `この${months}か月で内閣支持率が${da > 0 ? "上がって" : "下がって"}います（${past.approval}→${state.gov.approval}%）。${mine === da > 0 ? "うちの党には追い風です。今のうちに地盤を固めましょう。" : "うちの党には向かい風です。地元の支持を厚くしておきましょう。"}`,
        act: mine === da > 0 ? "local" : "festival",
        priority: mine === da > 0 ? 42 : 79,
      });
    const nowShare = state.setup.route === "pr" ? undefined : raceForecast(state, world).find((x) => x.isPlayer)?.share;
    if (past.share !== undefined && nowShare !== undefined) {
      const ds = Math.round((nowShare - past.share) * 1000) / 10;
      if (ds <= -2) add({ text: `この${months}か月で、選挙区の見込みが${-ds}ポイント下がっています。地元回りと地域行事で取り返しましょう。`, act: "local", priority: 81 });
      else if (ds >= 2) add({ text: `この${months}か月で、選挙区の見込みが${ds}ポイント上がっています。この調子です。`, priority: 20 });
    }
  }

  // きっかけで身につけられる持ち味
  for (const [id, lv] of Object.entries(state.skillHints ?? {})) {
    if (!canLearnSkill(state, world, id).ok) continue;
    add({ text: `「${skillById(id)?.name}」のきっかけ（Lv${lv}）をつかんでいます。「能力」の画面で経験点を使って身につけられます。`, tab: "self", priority: 72 });
    break;
  }

  // 能力を上げられる
  const upgradable = ABILITIES.filter((a) => canUpgrade(state, p, a));
  if (upgradable.length) {
    const low = [...upgradable].sort((a, b) => p.abilities[a] - p.abilities[b])[0];
    add({ text: `経験点がたまっています。「能力」の画面で能力を上げられます（たとえば${low}）。`, tab: "self", priority: 70 });
  }

  // 関係
  if (state.relations.party < 30)
    add({ text: `党の幹部との関係が${state.relations.party}です。25を切ると役職に就けません。党務で顔をつないでおきましょう。`, act: "party", priority: 75 });
  if (state.relations.kengi >= 48 && state.relations.kengi < C.kengi.threshold)
    add({ text: `県議団との関係があと${C.kengi.threshold - state.relations.kengi}で${C.kengi.threshold}です。そこまで行けば、県議が毎月地盤を固めてくれます。`, act: "kengi", priority: 60 });
  if (state.relations.supporters < 35)
    add({ text: `後援会との関係が${state.relations.supporters}まで冷えています。選挙の票に響くので、地域行事に顔を出しましょう。`, act: "festival", priority: 55 });

  // やる気
  if (state.mood <= 2) add({ text: "やる気が落ちています。経験点の伸びが鈍るので、趣味の時間で気分転換をしてください。", act: "hobby", priority: 65 });

  // 持ち味まであと少し（条件が活動の回数だけ残っているとき）
  const counts = state.activityCounts ?? {};
  for (const sk of SKILLS) {
    if (!sk.acquire || p.skills.includes(sk.id) || SKILLS.some((x) => x.replaces?.includes(sk.id) && p.skills.includes(x.id))) continue;
    const c = sk.acquire;
    const otherOk =
      (c.terms === undefined || p.terms >= c.terms) &&
      (c.jiban === undefined || p.jiban >= c.jiban) &&
      Object.entries(c.ability ?? {}).every(([a, n]) => p.abilities[a as keyof typeof p.abilities] >= (n as number));
    if (!otherOk) continue;
    const rest = Object.entries(c.activity ?? {}).map(([a, n]) => ({ a, n: (n as number) - (counts[a] ?? 0) })).filter((x) => x.n > 0);
    if (rest.length === 1 && rest[0].n <= 4)
      add({ text: `あと${rest[0].n}回の${actName(rest[0].a)}で、持ち味「${sk.name}」が身につきそうです。`, act: rest[0].a, priority: 58 });
  }

  // 党首選
  if (canRunForLeader(state, world) && !state.runForLeader)
    add({ text: "党首選に立候補できる立場になりました。自党の画面で届け出ておけば、次の党首選に出られます。", tab: "party", priority: 77 });

  // 職務
  if (postCategory(state, world)) add({ text: `${state.post ? `${state.post}としての` : ""}職務をこなすと、党や世論の評価が上がります。`, act: "duty", priority: 50 });

  // 何もなければ地盤づくり
  if (!out.some((a) => a.act)) {
    const need = C.jiban_step[p.jiban];
    add(
      p.jiban < 4
        ? { text: `今は急ぎの用事はありません。地盤が${p.jiban}から上がるまで、進み具合はあと${Math.max(0, need - state.jibanProgress)}です。地元回りを続けましょう。`, act: "local", priority: 10 }
        : { text: "地盤は万全です。政策勉強会や街頭演説で、能力と知名度を伸ばす時期です。", act: "study", priority: 10 },
    );
  }

  const hash = (t: string) => [...t].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
  for (const a of out) {
    a.warn = a.priority >= WARN_PRIORITY;
    if (!a.warn) a.priority -= ((state.turn + hash(a.text.slice(0, 8))) % 3) * 12;
  }
  out.sort((a, b) => b.priority - a.priority);
  // 同じ活動をすすめる助言は1つにまとめる
  const seen = new Set<string>();
  return out
    .filter((a) => {
      const key = a.act ?? a.tab ?? a.text;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, max);
}

/** 今月のおすすめの活動（助言の中で最初に活動をすすめているもの） */
export function recommendedActivity(advice: Advice[]): string | undefined {
  return advice.find((a) => a.act)?.act;
}

/** 設定に合わせて助言を絞る（警告だけ、なし） */
export function filterAdvice(advice: Advice[], level: AdviceLevel): Advice[] {
  if (level === "off") return [];
  if (level === "warn") return advice.filter((a) => a.warn);
  return advice;
}
