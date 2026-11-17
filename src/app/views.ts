// 議員人生モードの各画面（始め方、活動、地図、党内、内閣、自分）と、人物の詳しい情報。
// HTML を返すだけで、操作は main.ts が受け取る。
// data-tip を付けた要素は、マウスを乗せるか長押しするとツールチップが出る（main.ts）。
// data-member を付けた要素は、押すとその人物の詳しい情報が出る。
import { ACTIVITIES, EXP_TYPES, OPP_ACTIONS, electionComments, isOppositionLeader, oppositionLineup, shadowCabinet, ORIGINS, RELATIONS, ROUTE_NAMES, canLearnSkill, canRunForLeader, canUpgrade, careerSummary, govBills, isPrimeMinister, moneyOutlook, postCategory, prRank, raceForecast, startOptions, upgradeCost } from "../game/career.js";
import type { Party } from "../game/parties.js";
import { COLOR_NAMES, SKILLS, conditionProgress, learnCost, sortSkills } from "../game/skills.js";
import { adviseMonth, filterAdvice, recommendedActivity } from "../game/advice.js";
import { OPP, isOppositionParty, newOppositionState, otherOppositionParties, pactTransfer } from "../game/opposition.js";
import { inSession } from "../game/game.js";
import type { AdviceLevel } from "../game/advice.js";

/** 表示モード。通常は秘書の助言とおすすめを出して数字を絞り、プロは全部の数字を出す */
export type UiMode = "normal" | "pro";
import type { CareerState, CareerWorld, ElectionSummary, Highlight, OriginId, RouteId, StartOption } from "../game/career.js";
import { IDEOLOGY_AXES, PARTIES, partyById } from "../game/parties.js";
import { INITIAL_RULING } from "../game/cabinet.js";
import { ABILITIES, TABLES, rankOf } from "../game/tables.js";
import { PREFECTURES } from "../map/japanMap.js";
import type { Member } from "../game/roster.js";
import { MAJORITY, districtName } from "../game/districts.js";
import { chip, esc, face, icon, moodIcon, partyColor, pct, rankBadge } from "./ui.js";
import { VERSION_LABEL } from "../version.js";
import { BOND_ROLE_NAMES, bondWith, bondWord } from "../game/story.js";
import type { StoryScene } from "../game/story.js";

export interface SetupChoice {
  origin?: OriginId;
  party?: string;
  route?: RouteId;
  pref?: number;
  /** 小選挙区と後継で出る区 */
  district?: number;
  archetype?: string;
}

const prefName = (p: number) => PREFECTURES[p - 1]?.name ?? String(p);
/** 始め方：出馬方法の県の一覧。比例名簿は県を押すと決まり、小選挙区は県を押すとその県の区の一覧が開く */
function prefList(opts: StartOption[], c: SetupChoice, route: RouteId): string {
  if (route === "pr")
    return `<div class="pref-list">${opts
      .map((o) => `<button class="option${c.pref === o.pref && c.route === route ? " is-active" : ""}" data-setup="pref" data-value="${o.pref}" data-route="${route}"><b>${esc(prefName(o.pref))}</b><small>${esc(o.note)}</small></button>`)
      .join("")}</div>`;
  const byPref = new Map<number, StartOption[]>();
  for (const o of opts) byPref.set(o.pref, [...(byPref.get(o.pref) ?? []), o]);
  return `<div class="pref-list">${[...byPref]
    .map(([p, os]) => {
      const holders = [...new Set(os.map((o) => o.note.match(/（([^・）]+)・/)?.[1]).filter(Boolean))];
      return `<button class="option${c.pref === p && c.route === route ? " is-active" : ""}" data-setup="pref" data-value="${p}" data-route="${route}"><b>${esc(prefName(p))}</b><small>出られる区 ${os.length}${holders.length ? `（現職：${esc(holders.join("・"))}）` : ""}</small></button>`;
    })
    .join("")}</div>`;
}

/** 始め方：県の中の区の一覧 */
function districtList(opts: StartOption[], c: SetupChoice, route: RouteId): string {
  return `<p class="step-note"><button class="btn small" data-setup="pref-back">県の一覧に戻る</button></p><div class="pref-list">${opts
    .map((o) => `<button class="option${c.district === o.district ? " is-active" : ""}" data-setup="district" data-value="${o.district}" data-route="${route}"><b>${esc(districtName(o.district!))}</b><small>${esc(o.note)}</small></button>`)
    .join("")}</div>`;
}

/** 秘書の顔の札（どの画面でも同じ色と文字にする） */
const SECRETARY_COLOR = "#e0559a";
const secretaryFace = (state: CareerState, cls = "") => `<span class="face ${cls}" style="background:${SECRETARY_COLOR}">${esc(state.secretaryName.slice(0, 1))}</span>`;
/** 経験点の種類ごとに、それを使って伸ばせる能力（data/game/career.json の upgrade.cost から） */
const EXP_TO_ABILITIES: Record<string, string[]> = { media: ["弁舌", "知名度"], election: ["組織", "弁舌"], policy: ["政策", "調整"], network: ["調整", "組織"], money: ["資金力"] };
/** 会話の顔の札（名前の1文字目、政党の色。政党が分からなければ紺） */
const sayFace = (name: string, party?: string) => `<span class="face say-face" style="background:${party ? partyColor(party) : "#2b4a75"}">${esc(name.slice(0, 1))}</span>`;
const expName = (id: string) => EXP_TYPES.find((e) => e.id === id)!.name;
/** ツールチップの文（改行は \n）を属性に入れる */
const tip = (text: string) => `data-tip="${esc(text)}"`;

/** 活動ごとの擬音（パワプロの練習の擬音に当たる） */
export const FX: Record<string, string> = {
  local: "ガシッ!!",
  speech: "ワーッ!!",
  study: "ピコーン!",
  fund: "チャリン!",
  party: "ドンッ!",
  kengi: "ガッチリ!",
  festival: "ワッショイ!",
  training: "ダダダッ!",
  hobby: "ルンルン♪",
  rest: "スヤァ…",
  duty: "キリッ!",
};

// ---------- 始め方（1画面に1つずつ選ぶ） ----------

export const SETUP_STEPS = ["出身", "政党", "出馬方法と県", "経歴", "確認"] as const;

/** saved：自動保存のデータがあればその説明（「続きから」に出す） */
export function setupView(roster: Member[], c: SetupChoice, step: number, saved?: string, mode: UiMode = "normal", adviceLevel: AdviceLevel = "all"): string {
  const progress = SETUP_STEPS.map((s, i) => `<span class="step-dot${i === step ? " is-active" : i < step ? " is-done" : ""}">${i + 1}. ${s}</span>`).join("");
  const back = step > 0 ? `<button class="btn small" data-action="setup-back">◀ 戻る</button>` : `<span></span>`;
  let title = "";
  let body = "";
  if (step === 0) {
    title = "出身（難易度）を選ぶ";
    body = `<div class="cut box resume">${saved ? `<button class="btn primary" data-action="continue">続きから</button><span class="muted">${esc(saved)}</span><button class="btn small" data-action="delete-save">セーブを消す</button>` : `<span class="muted">はじめから遊ぶ</span>`}<button class="btn small push" data-action="import">ファイルから読み込む</button></div><div class="cut box resume mode-box"><b>表示モード</b>${modeSwitch(mode, adviceLevel)}</div><div class="options cols-1">${ORIGINS.map(
      (o) => `<button class="option${c.origin === o.id ? " is-active" : ""}" data-setup="origin" data-value="${o.id}"><b>${o.name}（${o.difficulty}）</b><small>${esc(o.description)}</small></button>`,
    ).join("")}</div>`;
  } else if (step === 1) {
    title = "政党を選ぶ";
    const seated = PARTIES.filter((p) => !p.is_independent && roster.some((m) => m.party === p.id));
    const indep = roster.filter((m) => partyById(m.party).is_independent).length;
    const seatNote = `<p class="muted step-note">定数${roster.length}・過半数${MAJORITY}。開始時点は与党（民政党・公正党）が過半数に届かない少数与党。${indep ? `ほかに無所属${indep}人。` : ""}</p>`;
    body = `${seatNote}<div class="options cols-2">${seated
      .map((p) => `<button class="option${c.party === p.id ? " is-active" : ""}" data-setup="party" data-value="${p.id}"><b>${chip(p.id)} ${esc(p.short)} ${p.id === INITIAL_RULING.party || INITIAL_RULING.partners.includes(p.id) ? '<span class="side-badge ruling">与党</span>' : '<span class="side-badge">野党</span>'}</b><small>${esc(p.name)}・${roster.filter((m) => m.party === p.id).length}議席</small><span class="lean-tags">${partyLean(p).split("・").map((t) => `<span class="lean-tag">${esc(t)}</span>`).join("")}</span></button>`)
      .join("")}</div>`;
  } else if (step === 2) {
    const opened = c.route && c.route !== "pr" && c.pref && !c.district ? c.pref : undefined;
    title = opened ? `${prefName(opened)}の区を選ぶ` : "出馬方法と地元の都道府県を選ぶ";
    const opts = startOptions(roster, c.party!, c.origin!);
    const routes = [...new Set(opts.map((o) => o.route))];
    const route = c.route && routes.includes(c.route) ? c.route : routes[0];
    const routeNote: Record<RouteId, string> = {
      smd: c.origin === "newcomer" ? "他党の現職に挑む" : "親の地盤を継ぐ",
      successor: "引退する自党の現職の後継。党の票はあるが地盤は1から",
      pr: "比例名簿。党務で党の幹部との関係を上げて上位を狙う",
    };
    body = `<div class="route-tabs">${routes
      .map((r) => `<button class="btn small${r === route ? " is-active" : ""}" data-setup="route" data-value="${r}">${ROUTE_NAMES[r]}</button>`)
      .join("")}</div><p class="muted step-note">${esc(routeNote[route])}</p>
      ${opened ? districtList(opts.filter((o) => o.route === route && o.pref === opened), c, route) : prefList(opts.filter((o) => o.route === route), c, route)}`;
  } else if (step === 3) {
    title = "経歴を選ぶ";
    body = `<p class="muted step-note">能力の略号：弁＝弁舌、政＝政策、調＝調整、知＝知名度、組＝組織、資＝資金。ランクは S が最も高く、A〜G の順に下がる。</p><div class="options cols-2">${TABLES.archetypes
      .map((a) => `<button class="option${c.archetype === a.id ? " is-active" : ""}" data-setup="archetype" data-value="${a.id}" ${tip(`${a.name}\n${ABILITIES.map((ab) => `${ab} ${a.base_ranks[ab]}`).join("　")}`)}><b>${esc(a.name)}</b><span class="arch-ranks">${ABILITIES.map((ab) => `<span class="arch-rank"><small>${ab.slice(0, 1)}</small><b style="color:var(--rank-${a.base_ranks[ab]})">${a.base_ranks[ab]}</b></span>`).join("")}</span></button>`)
      .join("")}</div>`;
  } else {
    title = "この条件で始めますか";
    const o = ORIGINS.find((x) => x.id === c.origin)!;
    const a = TABLES.archetypes.find((x) => x.id === c.archetype)!;
    body = `<div class="cut box summary">
      <p><b>出身</b>　${esc(o.name)}（${esc(o.difficulty)}）</p>
      <p><b>政党</b>　${chip(c.party!)} ${esc(partyById(c.party!).name)}</p>
      <p><b>出馬</b>　${esc(ROUTE_NAMES[c.route!])}・${esc(c.district ? districtName(c.district) : prefName(c.pref!))}</p>
      <p><b>経歴</b>　${esc(a.name)}</p>
      <p><b>始めの能力</b>　<span class="arch-ranks">${ABILITIES.map((ab) => `<span class="arch-rank"><small>${esc(ab)}</small><b style="color:var(--rank-${a.base_ranks[ab]})">${a.base_ranks[ab]}</b></span>`).join("")}</span></p>
      <p><b>表示モード</b>　${mode === "normal" ? "通常（秘書の助言つき）" : "プロ（数字をすべて出す）"}。始めてからも「能力」の画面で変えられる。</p></div>
      <p style="text-align:center"><button class="btn primary big" data-action="start">この条件で始める</button></p>`;
  }
  return `<div class="setup">
    <div class="setup-head"><h1>議員人生 <small class="version">${esc(VERSION_LABEL)}</small></h1>${step === 0 ? `<p class="goal">一人の新人候補として総選挙での初当選を目指し、地盤を固めて上の役職を目指す。党首選に勝って与党の党首になれば首相にもなれる。75歳になるか、30年たつと引退して議員人生を終える。</p>` : ""}<div class="steps">${progress}</div></div>
    <section class="cut box step-box"><div class="step-title">${back}<h2>${title}</h2><span></span></div>${body}</section>
  </div>`;
}

/** 政党の思想の傾き（中心からの離れが大きい軸を3つまで） */
export function partyLean(p: Party): string {
  return (
    IDEOLOGY_AXES.map((x) => ({ x, v: p.ideology_center[x.id] }))
      .filter((a) => Math.abs(a.v) >= 1)
      .sort((a, b) => Math.abs(b.v) - Math.abs(a.v))
      .slice(0, 3)
      .map((a) => (a.v < 0 ? a.x.minus : a.x.plus))
      .join("・") || "中道"
  );
}

/** 通常とプロの切り替え（始め方と自分の画面で使う） */
export function modeSwitch(mode: UiMode, advice: AdviceLevel = "all"): string {
  const b = (on: boolean, action: string, label: string) => `<button class="btn small${on ? " is-active" : ""}" data-action="${action}">${label}</button>`;
  return `<div class="mode-switch">${b(mode === "normal", "mode-normal", "標準")}${b(mode === "pro", "mode-pro", "詳細")}</div>
    <p class="muted" style="margin:6px 0 0">${mode === "normal" ? "標準：活動の画面では、経験点と関係の欄の代わりに秘書の助言とおすすめの活動を出し、活動の効果も言葉で説明する。" : "詳細：経験点や関係など、すべての数字を活動の画面に出す。"}</p>
    <div class="mode-switch" style="margin-top:8px"><span class="muted">秘書の助言</span>${b(advice === "all", "advice-all", "全部")}${b(advice === "warn", "advice-warn", "警告だけ")}${b(advice === "off", "advice-off", "出さない")}</div>`;
}

// ---------- 上の帯 ----------

export function statusBar(state: CareerState, world: CareerWorld, mode: UiMode = "pro"): string {
  const s = careerSummary(state, world);
  const [cur, max] = s.stamina.split("/").map(Number);
  const mo = moneyOutlook(state);
  const moneyWarn = mo.monthsLeft < 6 || (mo.monthsToElection <= 12 && state.money < mo.electionCost / 2);
  const moneyTip = `手元の資金 ${state.money}万円\n毎月の経費 ${mo.expense}万円。今の資金で約${mo.monthsLeft}か月もつ\n任期満了の総選挙まで${mo.monthsToElection}か月。選挙費用は最大${mo.electionCost}万円で、多く使えるほど票が上乗せされる\n資金集めの活動で増やせる`;
  const tired = cur < 30;
  return `<div class="pill-party">${chip(state.setup.party)}${esc(partyById(state.setup.party).short)}・${esc(s.post || s.status)}<span ${tip(`やる気 ${state.mood} / 5\n活動で得る経験点が ${[0.7, 0.85, 1, 1.15, 1.3][state.mood - 1]} 倍になる`)}>${moodIcon(state.mood, 24)}</span></div>
    <div class="cut date">${icon("st-calendar", 20)}<span>${state.year}年</span><b>${state.month}月</b></div>
    <div class="cut money${moneyWarn ? " warn" : ""}" ${tip(moneyTip)}>${icon("ab-fund", 20)}${state.money}万円${moneyWarn ? `<small>${mo.monthsLeft < 6 ? `あと${mo.monthsLeft}か月` : "選挙費用が足りない"}</small>` : ""}</div>
    <span class="sys-btns"><button class="sys-btn" data-action="open-log">記録</button><button class="sys-btn" data-action="open-help" aria-label="遊び方">？</button></span>
    <div class="hp-block">
      <div class="hp-meta"><span ${tip(`内閣支持率 ${s.approval}%\n与党 ${s.ruling}　首相 ${s.primeMinister}\n次の総選挙 ${s.nextElection}\n与党の党首選 ${s.leaderElection}`)}>${mode === "normal" ? `次の総選挙 <b>${state.gov.termEnd.year}年${state.gov.termEnd.month}月</b>まで（あと${mo.monthsToElection}か月）` : `支持率 <b>${s.approval}%</b>　与党 ${esc(s.ruling)}　総選挙 ${state.gov.termEnd.year}年${state.gov.termEnd.month}月まで`}</span><span class="${tired ? "tired" : ""}">${icon("st-stamina", 14)} 体力${tired ? "が少ない（休養を）" : ""}</span></div>
      <div class="cut gauge${tired ? " low" : ""}" ${tip(`体力 ${cur} / ${max}\n20未満で無理をすると倒れることがある。休養や趣味の時間で戻る`)}><span class="fill" style="width:${Math.round((cur / max) * 100)}%"></span><span class="val">${cur} / ${max}</span></div>
    </div>`;
}

// ---------- 活動 ----------

function racePanel(state: CareerState, world: CareerWorld): string {
  if (state.setup.route === "pr") {
    return `<div class="cut race" ${tip("比例単独\n党の幹部との関係が80で1位、12下がるごとに1つ下がる。党の比例の当選者数に入れば当選")}>${icon("exp-election", 24)}<span>比例名簿</span><span class="muted">見込み ${prRank(state) + 1}位</span><span class="muted" style="margin-left:auto">党の幹部 ${state.relations.party}</span></div>`;
  }
  const f = raceForecast(state, world);
  const me = f.find((x) => x.isPlayer)!;
  const top = f[0];
  const lead = me === top ? me.share - (f[1]?.share ?? 0) : me.share - top.share;
  const verdict = lead > 0.08 ? ["優勢", "verdict-good"] : lead > 0 ? ["やや優勢", "verdict-good"] : lead > -0.08 ? ["やや劣勢", "verdict-bad"] : ["劣勢", "verdict-bad"];
  const who = (x: (typeof f)[number]) => {
    const m = x.memberId !== undefined ? findMember(world, x.memberId) : undefined;
    return `${x.isPlayer ? "自分：" : ""}${x.name}（${partyById(x.party).short}）\n得票の見込み ${pct(x.share)}${m ? `\n${x.incumbent ? "現職・" : ""}当選${m.terms}回・地盤${m.jiban}・知名度${rankOf(m.abilities.知名度)}` : "\n候補者はまだ決まっていない"}`;
  };
  const ordered = [...f].sort((a, b) => Number(b.isPlayer) - Number(a.isPlayer) || b.share - a.share);
  const bar = ordered
    .map((x) => `<i style="width:${x.share * 100}%;background:${partyColor(x.party)}" ${tip(who(x))}${x.memberId !== undefined && !x.isPlayer ? ` data-member="${x.memberId}"` : ""}></i>`)
    .join("");
  const all = ordered.map((x) => `${x.isPlayer ? "★" : ""}${x.name}（${partyById(x.party).short}）${pct(x.share)}`).join("\n");
  const rival = ordered.find((x) => !x.isPlayer);
  const rivalHtml = rival
    ? rival.memberId !== undefined
      ? `<button class="name-btn" data-member="${rival.memberId}">${esc(rival.name)}</button>`
      : `<b>${esc(rival.name)}</b>`
    : "";
  const place = districtName(state.setup.district!);
  return `<div class="cut race">${icon("st-daruma", 22)}<span>${esc(place)}</span><div class="race-bar" ${tip(`${place}の情勢（今の見込み）\n${all}`)}>${bar}</div><b class="${verdict[1]}">${verdict[0]}</b></div>
    <div class="cut race sub">${icon("st-jiban", 18)}<span class="race-me" style="--pc:${partyColor(me.party)}">自分 ${pct(me.share)}</span>${rival ? `<span class="race-vs">相手</span>${rivalHtml}<span class="race-them" style="--pc:${partyColor(rival.party)}">${pct(rival.share)}</span>` : ""}<span class="muted push" ${tip(`地盤 ${world.player.jiban} / 4\n「地元回り」「地域行事」「県議と連携」で固まる。半年続けて地元の活動をしないと1段下がる`)}>地盤 ${world.player.jiban}</span></div>`;
}

const REL_TIPS: Record<string, string> = {
  secretary: "秘書との関係\n高いほど活動で得る経験点が増える（0.8〜1.15倍）",
  party: "党の幹部との関係\n人事で役職に選ばれやすくなる。25未満だと役職に就けない。党首選の票、比例名簿の順位にも効く",
  supporters: "後援会との関係\n選挙で本人の票が上乗せされる",
  press: "地元紙との関係\n選挙で本人の票が少し上乗せされる",
  kengi: "県議団との関係\n60以上なら毎月地盤が固まり、選挙の票も上乗せされる",
};

function relPanel(state: CareerState): string {
  const colors: Record<string, string> = { secretary: SECRETARY_COLOR, party: partyColor(state.setup.party), supporters: "#8d6e63", press: "#607d8b", kengi: "#3f51b5" };
  const rows = RELATIONS.map(
    (r) => `<div class="cut rel" ${tip(`${REL_TIPS[r.id]}\n今 ${state.relations[r.id]}（放っておくと40に戻っていく。白い線が40）`)}>${r.id === "secretary" ? secretaryFace(state) : `<span class="face" style="background:${colors[r.id]}">${esc(r.id === "kengi" ? "議" : r.name.slice(0, 1))}</span>`}
      <div class="rel-info"><div class="rel-top"><span>${esc(r.id === "secretary" ? `秘書 ${state.secretaryName}` : r.name)}</span><small>${state.relations[r.id]}</small></div>
      <div class="mini-gauge mark-40"><i style="width:${state.relations[r.id]}%"></i></div></div></div>`,
  ).join("");
  return `<div class="panel-title">関係</div>${rows}`;
}

function activityList(state: CareerState, world: CareerWorld) {
  const list = ACTIVITIES.map((a) => ({ id: a.id, name: a.name, icon: a.icon, description: a.description, stamina: a.stamina, exp: a.exp as Record<string, number> }));
  if (postCategory(state, world))
    list.push({ id: "duty", name: "職務", icon: "act-party", description: `${state.post}としての仕事をする。役職ごとに効果が違う。`, stamina: -10, exp: {} });
  return list;
}

export function activityIds(state: CareerState, world: CareerWorld): string[] {
  return activityList(state, world).map((a) => a.id);
}

export function activityView(
  state: CareerState,
  world: CareerWorld,
  selected: string | undefined,
  last: { text: string; fx: string; note?: string } | undefined,
  mode: UiMode = "pro",
  adviceLevel: AdviceLevel = "all",
): string {
  const acts = activityList(state, world);
  const normal = mode === "normal";
  const advice = filterAdvice(adviseMonth(state, world), adviceLevel);
  const rec = normal ? recommendedActivity(advice) : undefined;
  // 詳細モードでは、警告だけを1行で出す
  const proWarn = !normal ? advice.find((a) => a.warn) : undefined;
  const sel = acts.find((a) => a.id === selected);
  const exp = EXP_TYPES.map(
    (e) => `<div class="cut exp-row" ${tip(`${e.name}の経験点 ${state.exp[e.id]}\n「能力」の画面で能力を上げるのに使う`)}>${icon(e.icon, 22)}<span class="exp-name">${e.name}</span><span class="exp-val">${state.exp[e.id]}</span><span class="exp-add" ${tip("選んだ活動で増える見込み")}>${sel?.exp[e.id] ? `+${sel.exp[e.id]}` : ""}</span></div>`,
  ).join("");
  const cards = acts
    .map(
      (a) => `<button class="card${a.id === selected ? " is-active" : ""}" data-act="${a.id}" aria-label="${esc(a.name)}">
      ${normal ? (a.id === rec ? `<span class="tag rec">おすすめ</span>` : "") : a.id === "local" && world.player.jiban < 4 ? `<span class="tag">地盤↑</span>` : ""}
      <span class="card-in">${icon(a.icon, 40)}<span class="lb">${esc(a.name)}</span></span>
      <span class="cost" style="${a.stamina > 0 ? "color:#16a33a" : ""}">体力${a.stamina > 0 ? "+" : ""}${a.stamina}</span></button>`,
    )
    .join("");
  const msg = sel
    ? `${esc(sel.name)}：${esc(sel.description)}<small class="effect">${normal ? effectWords(sel) : `${Object.entries(sel.exp).map(([k, v]) => `${expName(k)}+${v}`).join("　")}　体力${sel.stamina > 0 ? "+" : ""}${sel.stamina}`}</small><small class="tap-hint">下のボタンかカードをもう一度押すと実行</small>`
    : last
      ? `${esc(last.text)}${last.note ? `<span class="note">${esc(last.note)}</span>` : ""}<small>次の活動を選んでください</small>`
      : `今月の活動を選んでください<small>カードを押すと説明が出て、もう一度押すと実行します</small>`;
  const side = normal
    ? advice.length
      ? `<div class="cut advice-panel">${adviceHtml(state, world, advice)}</div>`
      : ""
    : `<div class="cut dark exp-panel"><div class="panel-title">経験点</div>${exp}</div>
    <div class="rel-panel">${relPanel(state)}</div>`;
  return `<div class="arena${normal ? " normal" : ""}">
    <div class="race-panel">${racePanel(state, world)}</div>
    ${side}
    <div class="center">
      <div class="fx">${sel ? FX[sel.id] ?? "" : last?.fx ?? ""}</div>
      <button class="hero-btn" data-member="${world.player.id}" aria-label="自分の詳しい情報">${face(world.player.name.surname, state.setup.party, "hero")}</button>
      <div class="cut msg">${msg}</div>
      ${proWarn ? `<div class="cut pro-warn">${icon("ev-gaffe", 18)}<span>${esc(proWarn.text)}</span></div>` : ""}
      ${sel ? `<button class="btn primary run-btn" data-act="${sel.id}">${esc(sel.name)}を実行する</button>` : ""}
    </div>
    <div class="cards-wrap"><div class="cards" role="list">${cards}</div><span class="scroll-hint left" aria-hidden="true"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M10 3 L5 8 L10 13" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span class="scroll-hint right" aria-hidden="true"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M6 3 L11 8 L6 13" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></span></div>
  </div>`;
}

// ---------- 持ち味 ----------

/** 持ち味の札（色ごとに形を変えず色だけ変える。押せないので角ばった形） */
export function skillChips(ids: readonly string[]): string {
  const list = sortSkills(ids);
  if (!list.length) return `<span class="muted">なし</span>`;
  return list.map((sk) => `<span class="skill skill-${sk.color}" ${tip(`${sk.name}（持ち味・${COLOR_NAMES[sk.color]}）\n${sk.description}`)}>${esc(sk.name)}</span>`).join("");
}

const ACT_NAME: Record<string, string> = Object.fromEntries([...ACTIVITIES.map((a) => [a.id, a.name]), ["duty", "職務"]]);

function skillSection(state: CareerState, world: CareerWorld): string {
  const p = world.player;
  const ctx = { activityCounts: state.activityCounts ?? {}, abilities: p.abilities, terms: p.terms, jiban: p.jiban };
  const have = sortSkills(p.skills)
    .map((sk) => {
      const cure = sk.cure ? `<small class="muted">克服の条件：${esc(conditionProgress(sk.cure, ctx, (id) => ACT_NAME[id] ?? id))}</small>` : "";
      return `<div class="cut row sm skill-row"><span class="skill skill-${sk.color}">${esc(sk.name)}</span><span class="grow">${esc(sk.description)}${cure}</span></div>`;
    })
    .join("");
  // 身につけられる持ち味（上位のものを持っていれば下位は出さない）
  const hints = state.skillHints ?? {};
  const next = SKILLS.filter((sk) => sk.acquire && !p.skills.includes(sk.id) && !SKILLS.some((x) => x.replaces?.includes(sk.id) && p.skills.includes(x.id)))
    // きっかけをつかんだものを先に並べる
    .sort((a, b) => (hints[b.id] ?? 0) - (hints[a.id] ?? 0))
    .map((sk) => {
      const lv = hints[sk.id] ?? 0;
      const can = lv ? canLearnSkill(state, world, sk.id) : undefined;
      const cost = lv ? Object.entries(learnCost(sk, lv)).map(([k, n]) => `${expName(k)}${n}`).join(" ") : "";
      const learn = lv
        ? `<span class="hint-badge">きっかけ段階${lv}</span><button class="btn small" data-learn="${sk.id}" ${can?.ok ? "" : "disabled"}>身につける（${cost}）</button>${can?.ok ? "" : `<small class="muted">${esc(can?.reason ?? "")}</small>`}`
        : "";
      return `<div class="cut row sm skill-row"><span class="skill skill-${sk.color}${lv ? "" : " is-locked"}">${esc(sk.name)}</span><span class="grow">${esc(sk.description)}<small class="muted">条件：${esc(conditionProgress(sk.acquire!, ctx, (id) => ACT_NAME[id] ?? id))}</small>${learn ? `<span class="learn-line">${learn}</span>` : ""}</span></div>`;
    })
    .join("");
  return `<section class="cut box"><h2>持ち味</h2><div class="rows">${have || "<p class='muted' style='margin:0'>まだない</p>"}</div>
    <h3 class="sub-h">身につけられる持ち味</h3><p class="muted" style="margin:0 0 6px;font-size:12px">条件の回数をこなすと月末に身につく。活動できっかけをつかめば、回数が足りなくても経験点を払って身につけられる。</p><div class="rows">${next}</div></section>`;
}

/** 標準モードで、活動の効果を数字ではなく言葉で言う */
function effectWords(a: { exp: Record<string, number>; stamina: number }): string {
  // 経験点の名前ではなく、それで伸ばせる能力の名前で言う（よく伸びるものは★★、少しは★）
  const score: Record<string, number> = {};
  for (const [k, v] of Object.entries(a.exp)) for (const ab of EXP_TO_ABILITIES[k] ?? []) score[ab] = (score[ab] ?? 0) + v;
  const grow = Object.entries(score)
    .sort((x, y) => y[1] - x[1])
    .slice(0, 3)
    .map(([ab, v]) => `${ab}${v >= 15 ? "★★" : "★"}`)
    .join("・");
  const st = a.stamina > 0 ? `体力が戻る（+${a.stamina}）` : a.stamina < 0 ? `体力を${-a.stamina}使う` : "";
  return [grow ? `伸ばしやすい能力：${grow}` : "", st].filter(Boolean).join("　");
}

// ---------- 秘書の助言（標準モード） ----------

function adviceHtml(state: CareerState, world: CareerWorld, advice: ReturnType<typeof adviseMonth>): string {
  const items = advice
    .map((a) => {
      const go = a.tab
        ? `<button class="btn small" data-tab="${a.tab}">${a.tab === "self" ? "能力の画面へ" : a.tab === "party" ? "自党の画面へ" : "内閣の画面へ"}</button>`
        : a.act
          ? `<button class="btn small" data-act="${a.act}">${esc(activityList(state, world).find((x) => x.id === a.act)?.name ?? "")}を選ぶ</button>`
          : "";
      return `<li><span>${esc(a.text)}</span>${go}</li>`;
    })
    .join("");
  return `<div class="advice-head">${secretaryFace(state)}<div><b>秘書 ${esc(state.secretaryName)}</b><small class="muted">今月の助言</small></div></div>
    <ul class="advice-list">${items}</ul>
    <button class="link-btn" data-action="mode-pro">数字を全部見る（詳細モードにする）</button>`;
}

// ---------- 人物の詳しい情報 ----------

export function findMember(world: CareerWorld, id: number): Member | undefined {
  if (world.player.id === id) return world.player;
  return world.roster.find((m) => m.id === id) ?? world.ronin.find((m) => m.id === id);
}

export function memberDetail(state: CareerState, world: CareerWorld, id: number): string {
  const m = findMember(world, id);
  if (!m) return "";
  const post = world.government.find((a) => a.member.id === m.id)?.post.name;
  const leader = state.leaders[m.party] === m.id ? `${partyById(m.party).short}の党首` : "";
  const seat = m.seat === "小選挙区" ? `${districtName(m.district!)}（小選挙区）` : m.seat === "比例" ? `比例（地元 ${prefName(m.home)}）` : `浪人・候補（${prefName(m.home)}）`;
  const abilities = ABILITIES.map((a) => {
    const v = m.abilities[a];
    const r = rankOf(v);
    return `<div class="d-ab" style="--rc:var(--rank-${r})"><span>${a}</span><b class="stat-rank">${r}</b><span class="bar"><i style="width:${v}%"></i></span><span class="num">${v}</span></div>`;
  }).join("");
  const ideology = IDEOLOGY_AXES.map((x) => {
    const v = m.ideology[x.id];
    return `<div class="d-axis" ${tip(`${x.name}：${v < 0 ? x.minus : v > 0 ? x.plus : "中間"}（${v}）`)}><span class="axis-name">${x.name}</span><small class="axis-pole${v < 0 ? " on" : ""}">${x.minus}</small><span class="axis-track"><i style="left:${((v + 3) / 6) * 100}%"></i></span><small class="axis-pole${v > 0 ? " on" : ""}">${x.plus}</small></div>`;
  }).join("");
  const age = state.year - m.birthYear;
  return `<div class="overlay" data-action="close-member"><div class="cut dialog light member-card" role="dialog" aria-modal="true" data-stop>
    <div class="d-head">${face(m.name.surname, m.party, "big")}<div><h2>${esc(m.name.displayName)}${m.id === world.player.id ? "（自分）" : ""}</h2>
      <small class="muted">${esc(m.name.surnameKana)} ${esc(m.name.givenNameKana)}</small><p>${chip(m.party)} ${esc(partyById(m.party).name)}　${age}歳・${m.gender}</p></div>
      <button class="btn small close" data-action="close-member" aria-label="閉じる">✕</button></div>
    <p class="d-facts"><span>${esc(seat)}</span><span>当選${m.terms}回</span><span>地盤${m.jiban}</span>${post ? `<span class="post">${esc(post)}</span>` : ""}${leader ? `<span class="post">${esc(leader)}</span>` : ""}</p>
    <p class="d-facts"><span>${esc(m.archetype)}</span>${m.lineage !== "一般" ? `<span>${esc(m.lineage)}</span>` : ""}<span>得意：${esc(m.specialties.join("・"))}</span><span>性格：${esc(m.traits.join("・"))}</span></p>
    ${bondLine(state, m.id)}
    <div class="d-skills">${sortSkills(m.skills).map((sk) => `<p><span class="skill skill-${sk.color}">${esc(sk.name)}</span><small>${esc(sk.description)}</small></p>`).join("") || `<p class="muted">持ち味なし</p>`}</div>
    <div class="d-grid"><div>${abilities}</div><div>${ideology}<p class="muted" style="margin:6px 0 0">信念 ${m.conviction}/5・党への忠誠 ${m.loyalty}/5</p></div></div>
  </div></div>`;
}

// ---------- 自分（能力アップ） ----------

/** 経験点が n 回分足りるか（上げるほど必要な経験点が増えるのも含めて数える） */
function canUpgradeTimes(state: CareerState, p: Member, a: (typeof ABILITIES)[number], n: number): boolean {
  const exp = { ...state.exp };
  for (let i = 0; i < n; i++) {
    const v = p.abilities[a] + i;
    if (v >= 100) return false;
    const cost = upgradeCost({ ...p, abilities: { ...p.abilities, [a]: v } }, a);
    for (const [k, c] of Object.entries(cost)) {
      exp[k as keyof typeof exp] -= c as number;
      if (exp[k as keyof typeof exp] < 0) return false;
    }
  }
  return true;
}

/** savedAt：最後に自動保存した時刻（保存できなかったら undefined） */
export function selfView(state: CareerState, world: CareerWorld, savedAt?: string, mode: UiMode = "pro", adviceLevel: AdviceLevel = "all"): string {
  const p = world.player;
  const s = careerSummary(state, world);
  const rows = ABILITIES.map((a) => {
    const v = p.abilities[a];
    const r = rankOf(v);
    const cost = Object.entries(upgradeCost(p, a)).map(([k, n]) => `${expName(k)}${n}`).join(" ");
    const can = canUpgrade(state, p, a);
    const can5 = canUpgradeTimes(state, p, a, 5);
    return `<div class="cut stat-row" style="--rc:var(--rank-${r})">
      <span class="stat-label">${a}</span><span class="stat-rank">${r}</span><span class="stat-num">${v}</span>
      <span class="stat-meter"><span class="bar"><i style="width:${v}%"></i></span><span class="cost-line">${v >= 100 ? "最大" : `次：${cost}`}</span></span>
      <span class="ups"><button class="btn small" data-up="${a}" ${can ? "" : "disabled"}>+1</button><button class="btn small" data-up="${a}" data-times="5" ${can5 ? "" : "disabled"}>+5</button></span></div>`;
  }).join("");
  const exp = EXP_TYPES.map((e) => `<div class="cut exp-row">${icon(e.icon, 22)}<span class="exp-name">${e.name}</span><span class="exp-val">${state.exp[e.id]}</span></div>`).join("");
  const rel = RELATIONS.map((r) => `<div class="row cut sm" ${tip(REL_TIPS[r.id])}><span class="grow">${esc(r.name)}</span><span class="bar" style="width:40%;--rc:#ff7eb3"><i style="width:${state.relations[r.id]}%"></i></span><b>${state.relations[r.id]}</b></div>`).join("");
  const pips = [1, 2, 3, 4].map((i) => `<i class="${i <= p.jiban ? "on" : ""}"></i>`).join("");
  const leader = leaderSection(state, world);
  const ach = state.achievements.length ? state.achievements.map((a) => `<li>${esc(a)}</li>`).join("") : "<li class='muted'>まだない</li>";
  return `<div class="page">
    <div class="page-head"><button class="name-btn big" data-member="${p.id}">${face(p.name.surname, p.party)} ${esc(p.name.displayName)}</button><span class="muted">${s.age}歳・${esc(p.archetype)}・${esc(s.origin)}・当選${p.terms}回</span></div>
    <div class="self-grid">
      <div class="page">
        <section class="cut box"><h2>基礎能力（経験点を使って上げる）</h2><div class="rows">${rows}</div></section>
        ${skillSection(state, world)}
      </div>
      <div class="page">
        <section class="cut dark box lg exp-list"><div class="panel-title">経験点</div>${exp}</section>
        <section class="cut box" style="--party:${partyColor(p.party)}"><h2>地盤</h2><span class="pips">${pips}</span> <b>${p.jiban}</b> <span class="muted">（次まで ${esc(s.jibanProgress)}）</span></section>
        <section class="cut box"><h2>関係</h2><div class="rows">${rel}</div></section>
        <section class="cut box"><h2>党首選</h2>${leader}</section>
        <section class="cut box"><h2>経歴</h2><ul style="margin:0;padding-left:1.2em">${ach}</ul></section>
        <section class="cut box"><h2>表示モード</h2>${modeSwitch(mode, adviceLevel)}</section>
        <section class="cut box"><h2>セーブ</h2><p class="muted" style="margin:0 0 8px">${savedAt ? `このブラウザに自動で保存しています（最後の保存 ${esc(savedAt)}）。` : "このブラウザには保存できていません。ファイルに書き出してください。"}</p>
          <p class="btn-row" style="margin:0"><button class="btn small" data-action="export">ファイルに書き出す</button><button class="btn small" data-action="import">ファイルから読み込む</button></p>
          <p class="btn-row" style="margin:8px 0 0"><button class="btn small" data-action="restart-same">同じ顔ぶれで最初から</button><button class="btn small" data-action="restart">新しい顔ぶれで最初から</button></p></section>
      </div>
    </div>
  </div>`;
}

// ---------- 党首選（自分と自党の画面で共通） ----------

function leaderSection(state: CareerState, world: CareerWorld): string {
  const party = state.setup.party;
  const leaderId = state.leaders[party];
  const leader = leaderId !== undefined ? findMember(world, leaderId) : undefined;
  const ruling = state.gov.ruling.party === party;
  const when = ruling
    ? `次の党首選：<b>${state.leaderTermEnd.year}年${state.leaderTermEnd.month}月</b>（党首の任期満了）`
    : "次の党首選：総選挙で敗れたときや、党首が落選したときに行われる";
  const run = canRunForLeader(state, world)
    ? `<button class="btn ${state.runForLeader ? "is-active" : ""}" data-action="toggle-run">${state.runForLeader ? "立候補を届け出た（押すと取り消す）" : "次の党首選に立候補する"}</button>`
    : `<p class="muted" style="margin:0">当選3回以上で、党の幹部との関係が50以上なら立候補できる（党首は通算3期まで）。今は当選${world.player.terms}回・党の幹部 ${state.relations.party}。</p>`;
  return `<p style="margin:0 0 6px">党首：${leader ? `<button class="name-btn" data-member="${leader.id}">${esc(leader.name.displayName)}</button>` : "不在"}　${when}</p>${run}`;
}

// ---------- 党内 ----------

/** 議員の一覧の上に置く、能力のランクの列の見出し */
const rankHead = () =>
  `<div class="rank-head"><span class="face-space"></span><span class="grow"><small class="muted">名前と役職</small></span><span class="ranks">${ABILITIES.map((a) => `<span class="rank-h" ${tip(a)}>${a.slice(0, 1)}</span>`).join("")}</span></div>`;

function memberRow(m: Member, extra: string, isPlayer: boolean): string {
  return `<button class="cut row member-row" data-member="${m.id}" ${isPlayer ? 'style="--bd:#e61919;--bg:#fff7e0"' : ""}>${face(m.name.surname, m.party)}
    <span class="grow"><span class="nameplate">${esc(m.name.displayName)}${isPlayer ? "（自分）" : ""}</span> <span class="muted">当選${m.terms}回・${m.seat === "小選挙区" ? districtName(m.district!) : m.seat === "比例" ? "比例" : "浪人"}</span> ${extra}</span>
    <span class="ranks">${ABILITIES.map((a) => rankBadge(m.abilities[a])).join("")}</span></button>`;
}

/** 野党の党首の行動が今は使えない理由（使えるなら undefined） */
function oppOffReason(state: CareerState, id: string, points: number): string | undefined {
  const opp = state.opp;
  if (!points) return "今月の党首の行動はもう残っていない";
  if (id === "debate") {
    if (!inSession(state)) return "国会の会期外（臨時国会は秋から）";
    if (opp?.debatedTurn === state.turn) return "党首討論は月に1回";
  }
  if (id === "proposal" && (opp?.proposals ?? 0) < OPP.actions.proposal.cost) return `対案の準備が足りない（${opp?.proposals ?? 0}/${OPP.actions.proposal.cost}。政調会長が毎月進める）`;
  if (id === "noconfidence" && opp?.lastNoConfidence !== undefined) {
    const wait = OPP.actions.noconfidence.cooldown_months - (state.turn - opp.lastNoConfidence);
    if (wait > 0) return `不信任案は${OPP.actions.noconfidence.cooldown_months}か月に1回（あと${wait}か月）`;
  }
  return undefined;
}

/** 押せないボタンの理由を、ボタンの下に並べる */
function offReasons(state: CareerState, points: number): string {
  if (!points) return "";
  const list = OPP_ACTIONS.filter((a) => !a.needsParty)
    .map((a) => ({ a, why: oppOffReason(state, a.id, points) }))
    .filter((x) => x.why)
    .map((x) => `<li>${esc(x.a.name)}：${esc(x.why!)}</li>`)
    .join("");
  return list ? `<ul class="off-reasons">${list}</ul>` : "";
}

/** 野党のとき：党の役職、ほかの野党との協力度と選挙協力、追い風、党首の行動 */
function oppositionSection(state: CareerState, world: CareerWorld): string {
  const party = world.player.party;
  if (!isOppositionParty(party, state.gov.ruling)) return "";
  const opp = state.opp ?? newOppositionState(party);
  const lineup = oppositionLineup(state, world)
    .map((x) => `<span class="lineup-item"><small class="muted">${esc(x.post)}</small><button class="name-btn" data-member="${x.member.id}">${esc(x.member.name.displayName)}${x.member.id === world.player.id ? "（自分）" : ""}</button></span>`)
    .join("");
  const shadow = state.oppPost?.id === "opp_shadow" ? `<p class="muted" style="margin:6px 0 0">自分は${esc(state.oppPost.name)}。政権を取ったら、この分野の大臣に就きやすい。</p>` : "";
  const cabinet = shadowCabinet(state, world)
    .map((x) => `<span class="lineup-item"><small class="muted">${esc(x.field)}</small><button class="name-btn" data-member="${x.member.id}">${esc(x.member.name.displayName)}${x.member.id === world.player.id ? "（自分）" : ""}</button></span>`)
    .join("");
  const shadowList = cabinet ? `<details class="shadow-cabinet"${state.oppPost?.id === "opp_shadow" ? " open" : ""}><summary>影の内閣（分野ごとの影の大臣）</summary><div class="lineup">${cabinet}</div></details>` : "";
  const others = otherOppositionParties(world.roster, party, state.gov.ruling);
  const leader = isOppositionLeader(state, world);
  const points = opp?.actionPoints ?? 0;
  const rows = others
    .map((p) => {
      const c = opp?.cooperation[p] ?? 0;
      const pact = opp?.pacts.includes(p);
      const btns = leader
        ? `<button class="btn small" data-opp="summit" data-arg="${p}" ${points ? "" : "disabled"}>会談</button><button class="btn small" data-opp="pact" data-arg="${p}" ${points && !pact && c >= OPP.actions.pact.min_cooperation ? "" : "disabled"}>選挙協力</button>`
        : "";
      return `<div class="cut row sm opp-row" ${tip(`${partyById(p).name}との協力度 ${c}\n${OPP.actions.pact.min_cooperation}以上で選挙協力を結べる。不信任案に賛成するかにも効く\n選挙協力をしたときに相手の票が移る割合 ${Math.round(pactTransfer(party, p) * 100)}%`)}>${chip(p)}<span class="grow">${esc(partyById(p).short)} <span class="muted">${world.roster.filter((m) => m.party === p).length}議席</span>${pact ? ' <span class="post">選挙協力</span>' : ""}</span><span class="bar mark-60" style="width:28%;--rc:${partyColor(p)}"><i style="width:${c}%"></i></span><b>${c}</b>${btns ? `<span class="opp-btns">${btns}</span>` : ""}</div>`;
    })
    .join("");
  const momentum = opp?.momentum ?? 0;
  const status = `<p class="opp-stats"><span ${tip(`自党への追い風\n総選挙で全国の支持に ${momentum.toFixed(1)} ポイント足される。党首討論、追及、対案で増え、毎月少しずつ弱まる`)}>追い風 <b>${momentum >= 0 ? "+" : ""}${momentum.toFixed(1)}</b></span><span ${tip(`対案の準備\n${OPP.actions.proposal.cost}たまると「対案の発表」ができる。政調会長が毎月進める`)}>対案の準備 <b>${opp?.proposals ?? 0}</b></span><span ${tip(`不信任案の根回し\n国対委員長の職務でたまり、不信任案で与党から造反が出やすくなる`)}>根回し <b>${opp?.diet ?? 0}</b></span></p>`;
  const actions = leader
    ? `<h3 class="sub-h">党首の行動（今月あと${points}回）</h3><div class="opp-actions">${OPP_ACTIONS.filter((a) => !a.needsParty)
        .map((a) => {
          const why = oppOffReason(state, a.id, points);
          return `<button class="btn${a.id === "noconfidence" ? " danger-soft" : ""}" data-opp="${a.id}" ${why ? "disabled" : ""} ${tip(`${a.name}\n${a.description}${why ? `\n今は使えない：${why}` : ""}`)}>${esc(a.name)}</button>`;
        })
        .join("")}</div>${offReasons(state, points)}<p class="muted" style="margin:6px 0 0;font-size:12px">会談と選挙協力は、下の各党の行から選ぶ。行動を選び終えたら、活動の画面で今月の活動を選ぶと月末になる。</p>`
    : `<p class="muted" style="margin:6px 0 0;font-size:12px">党首になると、ほかの野党との会談、党首討論、追及、対案、選挙協力、不信任案を自分で動かせる。</p>`;
  return `<section class="cut box"><h2>野党として（与党 ${esc(partyById(state.gov.ruling.party).short)}${state.gov.ruling.partners.length ? "・" + state.gov.ruling.partners.map((x) => esc(partyById(x).short)).join("・") : ""}）</h2>
    <div class="lineup">${lineup}</div>${shadow}${shadowList}${status}${actions}
    <h3 class="sub-h">ほかの野党 <small class="muted">（数字は自分の党との協力度。${OPP.actions.pact.min_cooperation}以上で選挙協力を結べる）</small></h3><div class="rows">${rows || "<p class='muted'>ほかに野党はない</p>"}</div></section>`;
}

export function partyView(state: CareerState, world: CareerWorld): string {
  const party = state.setup.party;
  const members = world.roster.filter((m) => m.party === party).sort((a, b) => b.terms - a.terms);
  const leaderId = state.leaders[party];
  const postOf = new Map(world.government.map((a) => [a.member.id, a.post.name]));
  const rows = members.map((m) => memberRow(m, `${m.id === leaderId ? '<span class="post">党首</span> ' : ""}${postOf.has(m.id) ? `<span class="post">${esc(postOf.get(m.id)!)}</span>` : ""}`, m.id === world.player.id)).join("");
  const seats = PARTIES.filter((p) => world.roster.some((m) => m.party === p.id)).map((p) => ({ p, n: world.roster.filter((m) => m.party === p.id).length }));
  const bar = seats.map(({ p, n }) => `<i style="width:${(n / world.roster.length) * 100}%;background:${p.color}" ${tip(`${p.name}\n${n}議席（小選挙区${world.roster.filter((m) => m.party === p.id && m.seat === "小選挙区").length}・比例${world.roster.filter((m) => m.party === p.id && m.seat === "比例").length}）`)}></i>`).join("");
  return `<div class="page">
    <section class="cut box"><h2>議席の構成（定数${world.roster.length}・過半数${MAJORITY}）</h2><div class="race-bar" style="height:20px">${bar}</div>
      <p class="legend" style="margin:6px 0 0">${seats.map(({ p, n }) => `<span class="legend-item">${chip(p.id)}${esc(p.short)} ${n}</span>`).join("")}</p></section>
    <section class="cut box"><h2>党首選</h2>${leaderSection(state, world)}</section>
    ${oppositionSection(state, world)}
    <section class="cut box"><h2>${chip(party)} ${esc(partyById(party).name)}の議員（${members.length}人）</h2><div class="rows">${rows ? rankHead() + rows : "<p class='muted'>議席がない</p>"}</div></section>
  </div>`;
}

// ---------- 内閣（首相なら政権の行動も） ----------

export function cabinetView(state: CareerState, world: CareerWorld): string {
  const g = state.gov;
  const cab = world.government.filter((a) => a.post.kind === "内閣");
  const exec = world.government.filter((a) => a.post.kind !== "内閣");
  const rowsOf = (list: typeof cab, cls: string) => list.map((a) => memberRow(a.member, `<span class="post ${cls}">${esc(a.post.name)}</span>`, a.member.id === world.player.id)).join("");
  const rows = `<h3 class="sub-h">内閣（首相と大臣）</h3>${rankHead()}${rowsOf(cab, "post-cabinet")}<h3 class="sub-h">与党の役員（${esc(partyById(state.gov.ruling.party).short)}）</h3>${rowsOf(exec, "post-party")}`;
  let gov = "";
  if (isPrimeMinister(state, world)) {
    const bills = govBills(state)
      .map((b) => {
        const btn =
          b.status === "未着手"
            ? `<button class="btn small" data-gov="draft" data-arg="${b.id}">準備を始める</button>`
            : b.status === "準備完了" || b.status === "否決"
              ? `<button class="btn small" data-gov="submit" data-arg="${b.id}">国会に出す</button>`
              : "";
        return `<div class="cut row"><div class="grow"><b>${esc(b.name)}</b> <span class="muted">${esc(b.field)}・${b.status}${b.status === "準備中" ? ` ${b.progress}/${b.work}` : ""}</span></div>${btn}</div>`;
      })
      .join("");
    const talks = Object.entries(g.cooperation)
      .filter(([p]) => world.roster.some((m) => m.party === p))
      .map(([p, v]) => `<div class="cut row">${chip(p)}<span class="grow">${esc(partyById(p).short)}${g.ruling.partners.includes(p) ? "（連立）" : ""}</span><span class="bar" style="width:30%;--rc:${partyColor(p)}"><i style="width:${v}%"></i></span><b>${v}</b><button class="btn small" data-gov="talk" data-arg="${p}">協議</button></div>`)
      .join("");
    gov = `<section class="cut box"><h2>政権の行動（今月あと${g.actionPoints}回）</h2>
      <p class="btn-row"><button class="btn" data-gov="nemawashi">${icon("gov-nemawashi", 22)}根回し</button><button class="btn" data-gov="press">${icon("gov-press", 22)}記者会見</button><button class="btn" data-gov="dissolve">${icon("gov-dissolve", 22)}解散</button></p>
      <p class="muted">与党の結束 ${Math.round(g.cohesion * 100)}%。行動を選び終えたら、活動の画面で今月の活動を選ぶと月末になる。</p>
      <h2>法案</h2><div class="rows">${bills}</div><h2 style="margin-top:12px">各党の協力度</h2><div class="rows">${talks}</div></section>`;
  }
  return `<div class="page">
    <section class="cut box"><h2>与党 ${esc(careerSummary(state, world).ruling)}　内閣支持率 ${g.approval}%</h2><div class="rows">${rows}</div></section>
    ${gov}
  </div>`;
}

// ---------- 記録 ----------

export type LogFilter = "all" | "major" | "self" | "gov";

export function logView(state: CareerState, filter: LogFilter): string {
  const list = state.log
    .filter((l) => (filter === "all" ? true : filter === "major" ? l.level === "major" || (l.kind !== "gov" && l.level !== "minor") : filter === "gov" ? l.kind === "gov" : l.kind !== "gov"))
    .slice(-400)
    .reverse();
  let html = "";
  let date = "";
  for (const l of list) {
    if (l.date !== date) {
      if (date) html += "</ul>";
      date = l.date;
      html += `<h3 class="log-date">${esc(date)}</h3><ul class="log-list">`;
    }
    html += `<li class="${l.kind === "gov" ? "gov" : "self"}${l.level ? ` ${l.level}` : ""}"><span class="log-kind">${l.level === "major" ? "節目" : l.kind === "gov" ? "政局" : "個人"}</span><span>${esc(l.text)}${l.count ? `<b class="log-count">×${l.count}</b>` : ""}</span></li>`;
  }
  if (date) html += "</ul>";
  const tabs = (
    [
      ["major", "主な記録"],
      ["all", "すべて"],
      ["self", "個人"],
      ["gov", "政局"],
    ] as const
  )
    .map(([id, name]) => `<button class="btn small${filter === id ? " is-active" : ""}" data-log="${id}">${name}</button>`)
    .join("");
  return `<div class="overlay" data-action="close-overlay"><div class="cut dialog light sheet" role="dialog" aria-modal="true" aria-label="記録">
    <div class="sheet-head"><h2>記録</h2><span class="route-tabs">${tabs}</span><button class="btn small close" data-action="close-overlay" aria-label="閉じる">✕</button></div>
    <div class="sheet-body">${html || "<p class='muted'>まだ記録がない</p>"}</div></div></div>`;
}

// ---------- 遊び方 ----------

const HELP: [string, string][] = [
  ["目的", "一人の候補者として総選挙での当選を目指す。当選を重ねて大臣や党の役職に就き、与党の党首選に勝てば首相になれる。落選しても浪人として続けられる。75歳になるか、30年たつと引退して議員人生を終える。"],
  ["1か月の流れ", "活動を1つ選ぶと1か月進む。カードを押すと説明と効果の見込みが出て、「実行する」ボタンかカードをもう一度押すと実行する。月末に経費が引かれ、日常の出来事が起きることがある。出来事では、選択肢を選ぶと結果が出る。"],
  ["総選挙", "任期満了か解散で行う。小選挙区では、党への支持（内閣支持率による風を含む）に本人の地盤、知名度、後援会・地元紙・県議団との関係、選挙資金が上乗せされる。活動の画面の情勢の棒で見込みが分かる。比例単独では、党の幹部との関係で名簿の順位が決まる。"],
  ["経験点と能力", "活動で5種類の経験点がたまる。「能力」の画面で経験点を使って6つの能力を上げる。能力が高いほど、上げるのに必要な経験点が増える。"],
  ["地盤と関係", "地盤（1〜4）は「地元回り」「地域行事」「県議と連携」で固まり、半年続けて地元の活動をしないと1段下がる。関係（秘書、党の幹部、後援会、地元紙、県議団）は放っておくと40に戻っていく。数字や棒にマウスを乗せるか長押しすると、何に効くかが出る。"],
  ["党首選と首相", "当選3回以上で党の幹部との関係が50以上なら、自党の画面で党首選への立候補を届け出られる。与党の党首選は党首の任期満了のときに行う。与党の党首になると首相になり、内閣の画面で法案や解散などの政権の行動を選べる。"],
  ["野党", "自分の党が野党のときは、当選を重ねると幹事長、政調会長、国対委員長、選対委員長、影の大臣に就き、職務でほかの野党との協力度を上げたり、対案の準備を進めたりする。野党の党首になると、自党の画面で、ほかの野党との会談、党首討論、失政の追及、対案の発表、選挙協力（候補者の一本化）、内閣不信任案の提出を毎月使える。選挙協力を結んだ党とは、小選挙区で一方が候補を降ろし、その党の票の一部がもう一方に移る。"],
  ["持ち味ときっかけ", "活動の回数などの条件を満たすと、月末に持ち味が身につく。活動のあとにときどき「きっかけ」をつかみ、きっかけがあれば回数が足りなくても「能力」の画面で経験点を払って身につけられる。持ち味には4種類ある。「秀逸」はめったに持てない強力なもの、「強み」は経歴や家柄に結び付いた長所、「弱点」は条件を満たすと克服できる短所、「気質」は良い面と悪い面の両方があるもの。"],
  ["記録", "上の帯（日付や資金の並び）の「記録」で、自分に起きたことと政局の動き（政権の行動、採決、政界の出来事）を月ごとに振り返れる。「主な記録」では、総選挙や就任、政権交代などの節目と、出来事の結果だけを出す。"],
  ["表示モード", "標準モードでは、秘書が毎月の助言とおすすめの活動を教えてくれ、細かい数字は省かれる。詳細モードでは、経験点や関係などのすべての数字が出る。最初の画面と「能力」の画面で切り替えられる。"],
  ["保存", "状態はこのブラウザに自動で保存され、最初の画面の「続きから」で再開できる。「能力」の画面からファイルへの書き出しと読み込みができる。"],
  ["政治の言葉", "浪人：落選して、次の選挙での返り咲きを目指している人。少数与党：与党の議席が過半数に届いていない状態で、法案を通すには野党の協力が要る。党三役：与党の幹事長、総務会長、政調会長。幹事長：党の運営と選挙を取り仕切る。政調会長：党の政策をまとめる。総務会長：党の方針を決める会議をまとめる。国対委員長：国会の日程や、ほかの党との交渉を受け持つ。選対委員長：選挙の戦い方と候補者選びを受け持つ。影の大臣：政権交代に備えて分野ごとに政府を追及する野党の担当者。党議拘束：党が決めた賛否に、所属議員が採決で従う決まり。比例単独：小選挙区には出ず、比例区の名簿だけで立候補すること。県議団：地元の県議会議員の集まり（東京なら都議、北海道なら道議、大阪・京都なら府議）。"],
  ["キー操作", "1〜5：画面の切り替え。活動の画面では ← → で選んで Enter で実行。出来事は数字キーで選ぶ。Esc でポップアップを閉じる。"],
];

export function helpView(): string {
  return `<div class="overlay" data-action="close-overlay"><div class="cut dialog light sheet" role="dialog" aria-modal="true" aria-label="遊び方">
    <div class="sheet-head"><h2>遊び方</h2><button class="btn small close" data-action="close-overlay" aria-label="閉じる">✕</button></div>
    <div class="sheet-body help">${HELP.map(([t, b]) => `<section><h3>${t}</h3><p>${esc(b).replace(/「([^」]+)」/g, "「<b class=\"kw\">$1</b>」")}</p></section>`).join("")}<p class="version" style="margin-top:14px">議員人生 ${esc(VERSION_LABEL)}</p></div></div></div>`;
}

// ---------- 総選挙の結果（議席の前回比、当確、相手の一言） ----------

export function electionView(state: CareerState, e: ElectionSummary): string {
  const prev = new Map((e.prevSeats ?? []).map((x) => [x.party, x.total]));
  const total = e.seats.reduce((a, x) => a + x.total, 0) || 1;
  const rows = [...e.seats]
    .sort((a, b) => b.total - a.total)
    .map((x, i) => {
      const d = x.total - (prev.get(x.party) ?? 0);
      const diff = e.prevSeats ? `<span class="seat-diff ${d > 0 ? "up" : d < 0 ? "down" : ""}">${d > 0 ? "+" : d < 0 ? "−" : "±"}${Math.abs(d)}</span>` : "";
      return `<div class="seat-row" style="--i:${i}">${chip(x.party)}<span class="seat-name">${esc(partyById(x.party).short)}</span><span class="seat-bar"><i style="width:${(x.total / total) * 100}%;background:${partyColor(x.party)}"></i></span><b>${x.total}</b>${diff}</div>`;
    })
    .join("");
  const reveal = e.seats.length; // 自分の結果は、議席の行が出そろってから出す
  const me = e.district.find((x) => x.isPlayer);
  const words = electionComments(e);
  const swing = me && e.prevShare !== undefined ? Math.round((me.share - e.prevShare) * 1000) / 10 : undefined;
  const district = e.district.length
    ? `<div class="race-bar" style="height:22px;margin:8px 0">${e.district.map((d) => `<i style="width:${d.share * 100}%;background:${partyColor(d.party)}"></i>`).join("")}</div>
      <div class="el-cands">${e.district.map((d) => `<div class="el-cand${d.isPlayer ? " me" : ""}">${chip(d.party)}<span class="el-name">${d.isPlayer ? "★" : ""}${esc(d.name)}</span><small>${esc(partyById(d.party).short)}</small><b>${(d.share * 100).toFixed(1)}%</b>${d.isPlayer && swing !== undefined ? `<span class="seat-diff ${swing > 0 ? "up" : swing < 0 ? "down" : ""}">前回比 ${swing > 0 ? "+" : ""}${swing.toFixed(1)}</span>` : ""}</div>`).join("")}</div>`
    : `<p>比例名簿 ${e.pr!.rank}位（党の比例当選 ${e.pr!.seats}人）</p>`;
  const say = (name: string, role: string, text: string, party?: string) =>
    text ? `<div class="say">${sayFace(name, party)}<div class="say-body"><b>${esc(name)}</b>${role ? `<small>${esc(role)}</small>` : ""}<p>${esc(text)}</p></div></div>` : "";
  const myName = e.district.find((x) => x.isPlayer)?.name ?? state.secretaryName;
  const selfLine = say(myName, "自分", words.self, state.setup.party);
  const rivalLine = words.rival ? say(words.rival.name, `${partyById(words.rival.party).short}・${words.rival.won ? "当選" : "落選"}`, words.rival.text, words.rival.party) : "";
  const after = state.log
    .filter((l) => l.date === `${e.year}年${e.month}月` && /政権|党首選|首相|連立|に就いた/.test(l.text) && !l.text.startsWith("【") && l.level !== "minor")
    .map((l) => `<li>${esc(l.text)}</li>`)
    .join("");
  return `<div class="overlay"><div class="cut dialog election" role="dialog" aria-modal="true">
    <h2>${e.year}年${e.month}月 総選挙 開票結果</h2>
    <div class="seat-table">${rows}</div>
    <div class="el-mine" style="--i:${reveal}">
      <div class="stamp ${e.won ? "win" : "lose"}">${e.won ? "当選確実" : "落選"}</div>
      ${district}
      <div class="says">${selfLine}${rivalLine}</div>
      ${after ? `<ul class="el-after">${after}</ul>` : ""}
      <button class="btn primary wide" data-action="close-election">続ける</button>
    </div></div></div>`;
}

// ---------- 節目の場面（政権交代、首相交代、自分の就任） ----------

export function highlightView(h: Highlight): string {
  const lines = h.lines
    .map((l) =>
      l.name
        ? `<div class="say">${l.role === "秘書" ? `<span class="face say-face" style="background:${SECRETARY_COLOR}">${esc(l.name.slice(0, 1))}</span>` : sayFace(l.name, l.party)}<div class="say-body"><b>${esc(l.name)}</b>${l.role ? `<small>${esc(l.role)}</small>` : ""}<p>${esc(l.text)}</p></div></div>`
        : `<p class="narr">${esc(l.text)}</p>`,
    )
    .join("");
  return `<div class="overlay"><div class="cut dialog highlight" role="dialog" aria-modal="true">
    <div class="cut hl-title">${esc(h.title)}</div><p class="hl-text">${esc(h.text)}</p>
    <div class="says">${lines}</div>
    <button class="btn primary wide" data-action="close-highlight">続ける</button></div></div>`;
}

// ---------- 物語の場面（全画面） ----------

export interface StoryViewState {
  /** 今出しているセリフの番号（セリフの数と同じなら選択肢を出す） */
  line: number;
  /** 1回押して選んだ選択肢 */
  selected?: number;
  /** 会話の履歴を開いているか */
  history: boolean;
}

/** 顔の札：議員なら党の色と名字の1文字、秘書は秘書の色。押すと人物の情報（議員のときだけ） */
function storyTile(name: string, opts: { party?: string; memberId?: number; secretary?: boolean; off?: boolean; label: string }): string {
  const bg = opts.secretary ? SECRETARY_COLOR : opts.party ? partyColor(opts.party) : "#7d6b55";
  const tap = opts.memberId !== undefined ? ` data-member="${opts.memberId}"` : " disabled";
  return `<div class="st-who${opts.off ? " off" : ""}"><button class="st-tile" style="background:${bg}"${tap}>${esc(name.slice(0, 1))}${opts.memberId !== undefined ? `<span class="st-i">i</span>` : ""}</button><div class="st-shoulder"></div><span class="cut st-plate">${esc(opts.label)}</span></div>`;
}

function storyBondPanel(state: CareerState, scene: StoryScene): string {
  const p = scene.partner;
  if (!p) return "";
  const b = p.memberId !== undefined ? bondWith(state.bonds, p.memberId) : state.bonds?.people.secretary;
  const last = state.elections.at(-1);
  const race = p.role === "rival" && last?.district.length ? last.district : undefined;
  const me = race?.find((x) => x.isPlayer);
  const them = race?.find((x) => x.name === p.name);
  const value = b
    ? `<p><span>あなたとの関係</span><b>${b.value > 0 ? "+" : ""}${b.value}（${bondWord(b.value)}）</b></p><div class="st-meter"><i style="left:${50 + b.value / 2}%"></i></div><p><span>間柄</span><b>${esc(b.tag ?? "まだ決まっていない")}</b></p>`
    : `<p class="muted">まだ関係がない</p>`;
  const vs =
    me && them
      ? `<p class="st-race-cap">前回の総選挙</p><div class="st-vs"><i style="width:${them.share * 100}%;background:${partyColor(them.party)}"></i><i style="width:${me.share * 100}%;background:${partyColor(me.party)}"></i></div><p><span>${esc(them.name.split(" ")[0])} ${pct(them.share)}</span><span>自分 ${pct(me.share)}</span></p>`
      : "";
  return `<section class="cut st-side-box"><h4>${esc(p.name)}（${esc(BOND_ROLE_NAMES[p.role])}）</h4>${value}${vs}</section>`;
}

export function storyView(state: CareerState, world: CareerWorld, scene: StoryScene, v: StoryViewState, mode: "normal" | "pro"): string {
  const atChoice = v.line >= scene.lines.length;
  const cur = scene.lines[Math.min(v.line, scene.lines.length - 1)];
  // 左の枠：話している人が自分以外ならその人、そうでなければ物語の相手。右の枠：自分
  const leftLine = !atChoice && cur.role !== "self" && cur.role !== "narrator" ? cur : undefined;
  const left = leftLine
    ? { name: leftLine.name || "？", party: leftLine.party, memberId: leftLine.memberId, secretary: leftLine.role === "secretary", label: leftLine.name || leftLine.label }
    : scene.partner
      ? { name: scene.partner.name, party: scene.partner.party, memberId: scene.partner.memberId, secretary: scene.partner.role === "secretary", label: scene.partner.name }
      : undefined;
  const speakingSelf = !atChoice && cur.role === "self";
  const stage = `<div class="st-stage">${left ? storyTile(left.name, { ...left, off: !leftLine }) : "<div></div>"}${storyTile(world.player.name.surname, { party: world.player.party, memberId: world.player.id, off: !speakingSelf && !atChoice, label: "自分" })}</div>`;
  const chapterText = `第${scene.chapterNo}章（${scene.chapterNo} / ${scene.chapterCount}）`;
  const head = `<div class="st-top"><div class="cut st-chapter"><small>物語「${esc(scene.title)}」</small><b>${chapterText}</b></div><button class="btn small" data-action="story-history">会話の履歴</button></div>
    <span class="cut st-place">${esc(scene.place)}</span>${atChoice ? "" : `<button class="st-skip" data-action="story-skip">この章を飛ばす</button>`}`;
  let bottom: string;
  if (!atChoice) {
    const side = cur.role === "self" ? "right" : "left";
    const color = cur.role === "secretary" ? SECRETARY_COLOR : cur.party ? partyColor(cur.party) : "#7d6b55";
    const plate = cur.role === "narrator" ? "" : `<div class="cut st-name ${side}" style="--bg:${color};--bd:${color}">${esc(cur.name)}${cur.label && cur.label !== cur.name ? `<small>${esc(cur.label)}</small>` : ""}</div>`;
    bottom = `${plate}<div class="cut st-talk${cur.role === "narrator" ? " st-narr" : ""}" data-action="story-next"><p>${esc(cur.text)}</p><span class="st-hint">押すと次へ（${v.line + 1} / ${scene.lines.length}）</span><span class="st-next">▼</span></div>`;
  } else {
    const last = scene.lines[scene.lines.length - 1];
    const choices = scene.choices
      .map((c, i) => {
        const tags = mode === "pro" && c.tags.length ? `<span class="st-tags">${c.tags.map((t) => `<span class="cut">${esc(t)}</span>`).join("")}</span>` : "";
        return `<button class="st-choice${v.selected === i ? " sel" : ""}" data-story-choice="${i}"><span class="st-label">${esc(c.label)}</span>${tags}${v.selected === i ? `<span class="st-again">もう一度押すと決定</span>` : ""}</button>`;
      })
      .join("");
    bottom = `<div class="st-choices"><div class="cut st-q">${esc(last.text)}</div>${choices}</div>`;
  }
  const history = v.history
    ? `<div class="st-history" data-action="story-history"><div class="cut st-history-box" data-stop><h3>会話の履歴</h3>${scene.lines
        .slice(0, Math.min(v.line + 1, scene.lines.length))
        .map((l) => `<p>${l.name ? `<b>${esc(l.name)}</b>` : ""}${esc(l.text)}</p>`)
        .join("")}<button class="btn wide" data-action="story-history">閉じる</button></div></div>`
    : "";
  return `<div class="story-screen" role="dialog" aria-modal="true" aria-label="物語">
    <div class="st-scene bg-${esc(scene.bg)}"><div class="st-bg"></div><div class="st-dim${atChoice ? " deep" : ""}"></div>${head}${stage}${bottom}</div>
    <aside class="st-side"><section class="cut st-side-box"><h4>物語</h4><p class="st-big">${esc(scene.title)}</p><p><span>章</span><b>${chapterText}</b></p></section>${storyBondPanel(state, scene)}</aside>
    ${history}</div>`;
}

/** 選んだあとの結果（動いた数値の札と、物語が終わったときは結末） */
export function storyResultView(r: { title: string; label: string; result: string; changes: string[]; ending?: { title: string; text: string } }): string {
  const tag = (c: string) => `<span class="cut change-tag ${/間柄/.test(c) ? "bond" : /[-−]|下がった/.test(c) ? "down" : "up"}">${esc(c)}</span>`;
  return `<div class="story-screen"><div class="st-scene"><div class="st-bg"></div><div class="st-dim deep"></div>
    <div class="cut st-result"><small class="muted">物語「${esc(r.title)}」</small><h3>${esc(r.label)}</h3><p>${esc(r.result)}</p>
      ${r.changes.length ? `<p class="change-tags">${r.changes.map(tag).join("")}</p>` : ""}
      ${r.ending ? `<div class="cut st-ending"><small>結末</small><b>${esc(r.ending.title)}</b><p>${esc(r.ending.text)}</p></div>` : ""}
      <button class="btn primary wide" data-action="story-result-close">${r.ending ? "物語を閉じる" : "次へ"}</button></div></div></div>`;
}

/** 人物の詳しい情報に出す、自分との関係（ライバル、同期、先輩のとき） */
function bondLine(state: CareerState, id: number): string {
  const b = bondWith(state.bonds, id);
  if (!b) return "";
  return `<p class="cut d-bond"><b>${b.role ? esc(BOND_ROLE_NAMES[b.role]) : "知り合い"}</b>あなたとの関係 ${b.value > 0 ? "+" : ""}${b.value}（${bondWord(b.value)}）${b.tag ? `・間柄「${esc(b.tag)}」` : ""}</p>`;
}
