// 議員人生モードの各画面（始め方、活動、地図、党内、内閣、自分）と、人物の詳しい情報。
// HTML を返すだけで、操作は main.ts が受け取る。
// data-tip を付けた要素は、マウスを乗せるか長押しするとツールチップが出る（main.ts）。
// data-member を付けた要素は、押すとその人物の詳しい情報が出る。
import { ACTIVITIES, EXP_TYPES, ORIGINS, RELATIONS, ROUTE_NAMES, canRunForLeader, canUpgrade, careerSummary, govBills, isPrimeMinister, postCategory, prRank, raceForecast, startOptions, upgradeCost } from "../game/career.js";
import type { CareerState, CareerWorld, OriginId, RouteId } from "../game/career.js";
import { IDEOLOGY_AXES, PARTIES, partyById } from "../game/parties.js";
import { ABILITIES, TABLES, rankOf } from "../game/tables.js";
import { PREFECTURES } from "../map/japanMap.js";
import type { Member } from "../game/roster.js";
import { MAJORITY } from "../game/districts.js";
import { chip, esc, face, icon, moodIcon, partyColor, pct, rankBadge } from "./ui.js";

export interface SetupChoice {
  origin?: OriginId;
  party?: string;
  route?: RouteId;
  pref?: number;
  archetype?: string;
}

const prefName = (p: number) => PREFECTURES[p - 1]?.name ?? String(p);
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

export const SETUP_STEPS = ["出自", "政党", "出馬の道と県", "経歴類型", "確認"] as const;

export function setupView(roster: Member[], c: SetupChoice, step: number): string {
  const progress = SETUP_STEPS.map((s, i) => `<span class="step-dot${i === step ? " is-active" : i < step ? " is-done" : ""}">${i + 1}. ${s}</span>`).join("");
  const back = step > 0 ? `<button class="btn small" data-action="setup-back">◀ 戻る</button>` : `<span></span>`;
  let title = "";
  let body = "";
  if (step === 0) {
    title = "出自（難易度）を選ぶ";
    body = `<div class="options cols-1">${ORIGINS.map(
      (o) => `<button class="option${c.origin === o.id ? " is-active" : ""}" data-setup="origin" data-value="${o.id}"><b>${o.name}（${o.difficulty}）</b><small>${esc(o.description)}</small></button>`,
    ).join("")}</div>`;
  } else if (step === 1) {
    title = "政党を選ぶ";
    const seated = PARTIES.filter((p) => !p.is_independent && roster.some((m) => m.party === p.id));
    body = `<div class="options cols-2">${seated
      .map((p) => `<button class="option${c.party === p.id ? " is-active" : ""}" data-setup="party" data-value="${p.id}"><b>${chip(p.id)} ${esc(p.short)}</b><small>${esc(p.name)}・${roster.filter((m) => m.party === p.id).length}議席</small></button>`)
      .join("")}</div>`;
  } else if (step === 2) {
    title = "出馬の道と地元の県を選ぶ";
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
      <div class="pref-list">${opts
        .filter((o) => o.route === route)
        .map((o) => `<button class="option${c.pref === o.pref && c.route === route ? " is-active" : ""}" data-setup="pref" data-value="${o.pref}" data-route="${route}"><b>${esc(prefName(o.pref))}</b><small>${esc(o.note)}</small></button>`)
        .join("")}</div>`;
  } else if (step === 3) {
    title = "経歴類型を選ぶ";
    body = `<div class="options cols-2">${TABLES.archetypes
      .map((a) => `<button class="option${c.archetype === a.id ? " is-active" : ""}" data-setup="archetype" data-value="${a.id}" ${tip(`${a.name}\n${ABILITIES.map((ab) => `${ab} ${a.base_ranks[ab]}`).join("　")}`)}><b>${esc(a.name)}</b><small>${ABILITIES.map((ab) => `${ab.slice(0, 1)}${a.base_ranks[ab]}`).join(" ")}</small></button>`)
      .join("")}</div>`;
  } else {
    title = "この条件で始めますか";
    const o = ORIGINS.find((x) => x.id === c.origin)!;
    const a = TABLES.archetypes.find((x) => x.id === c.archetype)!;
    body = `<div class="cut box summary">
      <p><b>出自</b>　${esc(o.name)}（${esc(o.difficulty)}）</p>
      <p><b>政党</b>　${chip(c.party!)} ${esc(partyById(c.party!).name)}</p>
      <p><b>出馬</b>　${esc(ROUTE_NAMES[c.route!])}・${esc(prefName(c.pref!))}</p>
      <p><b>経歴</b>　${esc(a.name)}</p></div>
      <p style="text-align:center"><button class="btn primary big" data-action="start">この条件で始める</button></p>`;
  }
  return `<div class="setup">
    <div class="setup-head"><h1>議員人生</h1><div class="steps">${progress}</div></div>
    <section class="cut box step-box"><div class="step-title">${back}<h2>${title}</h2><span></span></div>${body}</section>
  </div>`;
}

// ---------- 状態の帯 ----------

export function statusBar(state: CareerState, world: CareerWorld): string {
  const s = careerSummary(state, world);
  const [cur, max] = s.stamina.split("/").map(Number);
  return `<div class="pill-party">${chip(state.setup.party)}${esc(partyById(state.setup.party).short)}・${esc(s.post || s.status)}<span ${tip(`やる気 ${state.mood} / 5\n活動で得る経験点が ${[0.7, 0.85, 1, 1.15, 1.3][state.mood - 1]} 倍になる`)}>${moodIcon(state.mood, 24)}</span></div>
    <div class="cut date">${icon("st-calendar", 20)}<span>${state.year}年</span><b>${state.month}月</b></div>
    <div class="cut money" ${tip("手元の資金\n毎月の経費と総選挙の費用に使う。選挙資金が多いほど票が上乗せされる")}>${icon("ab-fund", 20)}${state.money}万円</div>
    <div class="hp-block">
      <div class="hp-meta"><span ${tip(`内閣支持率 ${s.approval}%\n与党 ${s.ruling}　首相 ${s.primeMinister}\n次の総選挙 ${s.nextElection}\n与党の党首選 ${s.leaderElection}`)}>支持率 <b>${s.approval}%</b>　与党 ${esc(s.ruling)}　総選挙 ${state.gov.termEnd.year}年${state.gov.termEnd.month}月まで</span><span>${icon("st-stamina", 14)} 体力</span></div>
      <div class="cut gauge" ${tip(`体力 ${cur} / ${max}\n20未満で無理をすると倒れることがある`)}><span class="fill" style="width:${Math.round((cur / max) * 100)}%"></span><span class="val">${cur} / ${max}</span></div>
    </div>`;
}

// ---------- 活動 ----------

function racePanel(state: CareerState, world: CareerWorld): string {
  if (state.setup.route === "pr") {
    return `<div class="cut race" ${tip("比例名簿の道\n党の幹部との関係が80で1位、12下がるごとに1つ下がる。党の比例の当選者数に入れば当選")}>${icon("exp-election", 24)}<span>比例名簿</span><span class="muted">見込み ${prRank(state) + 1}位</span><span class="muted" style="margin-left:auto">党の幹部 ${state.relations.party}</span></div>`;
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
  const bar = f
    .map((x) => `<i style="width:${x.share * 100}%;background:${partyColor(x.party)}" ${tip(who(x))}${x.memberId !== undefined && !x.isPlayer ? ` data-member="${x.memberId}"` : ""}></i>`)
    .join("");
  const all = f.map((x) => `${x.isPlayer ? "★" : ""}${x.name}（${partyById(x.party).short}）${pct(x.share)}`).join("\n");
  const rival = f.find((x) => !x.isPlayer);
  const rivalHtml = rival
    ? rival.memberId !== undefined
      ? `<button class="name-btn" data-member="${rival.memberId}">${esc(rival.name)}</button>`
      : `<b>${esc(rival.name)}</b>`
    : "";
  return `<div class="cut race">${icon("st-daruma", 22)}<span>${esc(prefName(state.setup.pref))}</span><div class="race-bar" ${tip(`${prefName(state.setup.pref)}の情勢（揺らぎを除いた見込み）\n${all}`)}>${bar}</div><b class="${verdict[1]}">${verdict[0]}</b></div>
    <div class="cut race sub">${icon("st-jiban", 18)}<span class="muted">自分 ${pct(me.share)}</span>${rival ? `<span class="muted">相手</span>${rivalHtml}<span class="muted">${pct(rival.share)}</span>` : ""}<span class="muted push" ${tip(`地盤 ${world.player.jiban} / 4\n地元回り・地域行事・県議と連携で固まる。半年何もしないと1段下がる`)}>地盤 ${world.player.jiban}</span></div>`;
}

const REL_TIPS: Record<string, string> = {
  secretary: "秘書との関係\n高いほど活動で得る経験点が増える（0.8〜1.15倍）",
  party: "党の幹部との関係\n人事で役職に選ばれやすくなる。25未満だと役職に就けない。党首選の票、比例名簿の順位にも効く",
  supporters: "後援会との関係\n選挙で本人の票が上乗せされる",
  press: "地元紙との関係\n選挙で本人の票が少し上乗せされる",
  kengi: "県議団との関係\n60以上なら毎月地盤が固まり、選挙の票も上乗せされる",
};

function relPanel(state: CareerState): string {
  const colors: Record<string, string> = { secretary: "#e0559a", party: partyColor(state.setup.party), supporters: "#8d6e63", press: "#607d8b", kengi: "#3f51b5" };
  const rows = RELATIONS.map(
    (r) => `<div class="cut rel" ${tip(`${REL_TIPS[r.id]}\n今 ${state.relations[r.id]}（放っておくと40に戻っていく）`)}><span class="face" style="background:${colors[r.id]}">${esc(r.name.slice(0, 1))}</span>
      <div class="rel-info"><div class="rel-top"><span>${esc(r.id === "secretary" ? `秘書 ${state.secretaryName}` : r.name)}</span><small>${state.relations[r.id]}</small></div>
      <div class="mini-gauge"><i style="width:${state.relations[r.id]}%"></i></div></div></div>`,
  ).join("");
  return `<div class="panel-title">関係</div>${rows}`;
}

function activityList(state: CareerState, world: CareerWorld) {
  const list = ACTIVITIES.map((a) => ({ id: a.id, name: a.name, icon: a.icon, description: a.description, stamina: a.stamina, exp: a.exp as Record<string, number> }));
  if (postCategory(state, world))
    list.push({ id: "duty", name: "公務", icon: "act-party", description: `${state.post}としての仕事をする。役職ごとに効果が違う。`, stamina: -10, exp: {} });
  return list;
}

export function activityIds(state: CareerState, world: CareerWorld): string[] {
  return activityList(state, world).map((a) => a.id);
}

export function activityView(state: CareerState, world: CareerWorld, selected: string | undefined, last: { text: string; fx: string } | undefined): string {
  const acts = activityList(state, world);
  const sel = acts.find((a) => a.id === selected);
  const exp = EXP_TYPES.map(
    (e) => `<div class="cut exp-row" ${tip(`${e.name}の経験点 ${state.exp[e.id]}\n「自分」の画面で能力を上げるのに使う`)}>${icon(e.icon, 22)}<span class="exp-name">${e.name}</span><span class="exp-val">${state.exp[e.id]}</span><span class="exp-add">${sel?.exp[e.id] ? `+${sel.exp[e.id]}` : ""}</span></div>`,
  ).join("");
  const cards = acts
    .map(
      (a) => `<button class="card${a.id === selected ? " is-active" : ""}" data-act="${a.id}" aria-label="${esc(a.name)}">
      ${a.id === "local" && world.player.jiban < 4 ? `<span class="tag">地盤UP</span>` : ""}
      <span class="card-in">${icon(a.icon, 40)}<span class="lb">${esc(a.name)}</span></span>
      <span class="cost" style="${a.stamina > 0 ? "color:#16a33a" : ""}">体力${a.stamina > 0 ? "+" : ""}${a.stamina}</span></button>`,
    )
    .join("");
  const msg = sel
    ? `${esc(sel.name)}：${esc(sel.description)}<small>${Object.entries(sel.exp).map(([k, v]) => `${expName(k)}+${v}`).join("　")}　体力${sel.stamina > 0 ? "+" : ""}${sel.stamina}　もう一度押すと実行</small>`
    : last
      ? `${esc(last.text)}<small>次の活動を選んでください</small>`
      : `今月の活動を選んでください<small>カードを押すと説明が出て、もう一度押すと実行します</small>`;
  return `<div class="arena">
    <div class="race-panel">${racePanel(state, world)}</div>
    <div class="cut dark exp-panel"><div class="panel-title">経験点</div>${exp}</div>
    <div class="rel-panel">${relPanel(state)}</div>
    <div class="center">
      <div class="fx">${sel ? FX[sel.id] ?? "" : last?.fx ?? ""}</div>
      <button class="hero-btn" data-member="${world.player.id}" aria-label="自分の詳しい情報">${face(world.player.name.surname, state.setup.party, "hero")}</button>
      <div class="cut msg">${msg}</div>
    </div>
    <div class="cards-wrap"><div class="cards" role="list">${cards}</div><span class="scroll-hint left" aria-hidden="true">◀</span><span class="scroll-hint right" aria-hidden="true">▶</span></div>
  </div>`;
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
  const seat = m.seat === "小選挙区" ? `${prefName(m.district!)}（小選挙区）` : m.seat === "比例" ? `比例（地元 ${prefName(m.home)}）` : `浪人・候補（${prefName(m.home)}）`;
  const abilities = ABILITIES.map((a) => {
    const v = m.abilities[a];
    const r = rankOf(v);
    return `<div class="d-ab" style="--rc:var(--rank-${r})"><span>${a}</span><b class="stat-rank">${r}</b><span class="bar"><i style="width:${v}%"></i></span><span class="num">${v}</span></div>`;
  }).join("");
  const ideology = IDEOLOGY_AXES.map((x) => {
    const v = m.ideology[x.id];
    return `<div class="d-axis"><span>${x.name}</span><span class="axis-track"><i style="left:${((v + 3) / 6) * 100}%"></i></span><small>${v < 0 ? x.minus : v > 0 ? x.plus : "中間"}</small></div>`;
  }).join("");
  const age = state.year - m.birthYear;
  return `<div class="overlay" data-action="close-member"><div class="cut dialog light member-card" role="dialog" aria-modal="true" data-stop>
    <div class="d-head">${face(m.name.surname, m.party, "big")}<div><h2>${esc(m.name.displayName)}${m.id === world.player.id ? "（自分）" : ""}</h2>
      <small class="muted">${esc(m.name.surnameKana)} ${esc(m.name.givenNameKana)}</small><p>${chip(m.party)} ${esc(partyById(m.party).name)}　${age}歳・${m.gender}</p></div>
      <button class="btn small close" data-action="close-member" aria-label="閉じる">✕</button></div>
    <p class="d-facts"><span>${esc(seat)}</span><span>当選${m.terms}回</span><span>地盤${m.jiban}</span>${post ? `<span class="post">${esc(post)}</span>` : ""}${leader ? `<span class="post">${esc(leader)}</span>` : ""}</p>
    <p class="d-facts"><span>${esc(m.archetype)}</span>${m.lineage !== "なし" ? `<span>${esc(m.lineage)}</span>` : ""}<span>得意：${esc(m.specialties.join("・"))}</span><span>性格：${esc(m.traits.join("・"))}</span></p>
    <div class="d-grid"><div>${abilities}</div><div>${ideology}<p class="muted" style="margin:6px 0 0">信念 ${m.conviction}/5・党への忠誠 ${m.loyalty}/5</p></div></div>
  </div></div>`;
}

// ---------- 自分（能力アップ） ----------

export function selfView(state: CareerState, world: CareerWorld): string {
  const p = world.player;
  const s = careerSummary(state, world);
  const rows = ABILITIES.map((a) => {
    const v = p.abilities[a];
    const r = rankOf(v);
    const cost = Object.entries(upgradeCost(p, a)).map(([k, n]) => `${expName(k)}${n}`).join(" ");
    const can = canUpgrade(state, p, a);
    return `<div class="cut stat-row" style="--rc:var(--rank-${r})">
      <span class="stat-label">${a}</span><span class="stat-rank">${r}</span><span class="stat-num">${v}</span>
      <span><span class="bar"><i style="width:${v}%"></i></span><span class="cost-line">${v >= 100 ? "最大" : `次：${cost}`}</span></span>
      <span class="ups"><button class="btn small" data-up="${a}" ${can ? "" : "disabled"}>+1</button><button class="btn small" data-up="${a}" data-times="5" ${can ? "" : "disabled"}>+5</button></span></div>`;
  }).join("");
  const exp = EXP_TYPES.map((e) => `<div class="cut exp-row">${icon(e.icon, 22)}<span class="exp-name">${e.name}</span><span class="exp-val">${state.exp[e.id]}</span></div>`).join("");
  const rel = RELATIONS.map((r) => `<div class="row cut sm" ${tip(REL_TIPS[r.id])}><span class="grow">${esc(r.name)}</span><span class="bar" style="width:40%;--rc:#ff7eb3"><i style="width:${state.relations[r.id]}%"></i></span><b>${state.relations[r.id]}</b></div>`).join("");
  const pips = [1, 2, 3, 4].map((i) => `<i class="${i <= p.jiban ? "on" : ""}"></i>`).join("");
  const leader = canRunForLeader(state, world)
    ? `<button class="btn ${state.runForLeader ? "is-active" : ""}" data-action="toggle-run">${state.runForLeader ? "党首選に立候補する（取り消す）" : "次の党首選に立候補する"}</button>`
    : `<p class="muted" style="margin:0">当選3回以上で党の幹部との関係が50以上なら立候補できる（党首は生涯3期まで）。</p>`;
  const ach = state.achievements.length ? state.achievements.map((a) => `<li>${esc(a)}</li>`).join("") : "<li class='muted'>まだない</li>";
  return `<div class="page">
    <div class="page-head"><button class="name-btn big" data-member="${p.id}">${face(p.name.surname, p.party)} ${esc(p.name.displayName)}</button><span class="muted">${s.age}歳・${esc(p.archetype)}・${esc(s.origin)}・当選${p.terms}回</span></div>
    <div class="self-grid">
      <section class="cut box"><h2>基礎能力（経験点を使って上げる）</h2><div class="rows">${rows}</div></section>
      <div class="page">
        <section class="cut dark box lg exp-list"><div class="panel-title">経験点</div>${exp}</section>
        <section class="cut box" style="--party:${partyColor(p.party)}"><h2>地盤</h2><span class="pips">${pips}</span> <b>${p.jiban}</b> <span class="muted">（次まで ${esc(s.jibanProgress)}）</span></section>
        <section class="cut box"><h2>関係</h2><div class="rows">${rel}</div></section>
        <section class="cut box"><h2>党首選</h2>${leader}</section>
        <section class="cut box"><h2>経歴</h2><ul style="margin:0;padding-left:1.2em">${ach}</ul></section>
      </div>
    </div>
  </div>`;
}

// ---------- 党内 ----------

function memberRow(m: Member, extra: string, isPlayer: boolean): string {
  return `<button class="cut row member-row" data-member="${m.id}" ${isPlayer ? 'style="--bd:#e61919;--bg:#fff7e0"' : ""}>${face(m.name.surname, m.party)}
    <span class="grow"><span class="nameplate">${esc(m.name.displayName)}${isPlayer ? "（自分）" : ""}</span> <span class="muted">当選${m.terms}回・${m.seat === "小選挙区" ? prefName(m.district!) : m.seat === "比例" ? "比例" : "浪人"}</span> ${extra}</span>
    <span class="ranks">${ABILITIES.map((a) => rankBadge(m.abilities[a])).join("")}</span></button>`;
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
      <p class="muted" style="margin:6px 0 0">${seats.map(({ p, n }) => `${chip(p.id)} ${esc(p.short)} ${n}`).join("　")}</p></section>
    <section class="cut box"><h2>${chip(party)} ${esc(partyById(party).name)}の議員（${members.length}人）</h2><div class="rows">${rows || "<p class='muted'>議席がない</p>"}</div></section>
  </div>`;
}

// ---------- 内閣（首相なら政権の行動も） ----------

export function cabinetView(state: CareerState, world: CareerWorld): string {
  const g = state.gov;
  const rows = world.government.map((a) => memberRow(a.member, `<span class="post">${esc(a.post.name)}</span>`, a.member.id === world.player.id)).join("");
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
      <p class="btn-row"><button class="btn" data-gov="nemawashi">${icon("gov-nemawashi", 22)}根回し</button><button class="btn" data-gov="press">${icon("gov-press", 22)}記者会見</button><button class="btn primary" data-gov="dissolve">${icon("gov-dissolve", 22)}解散</button></p>
      <p class="muted">与党の結束 ${Math.round(g.cohesion * 100)}%。行動を選び終えたら、活動の画面で今月の活動を選ぶと月末になります。</p>
      <h2>法案</h2><div class="rows">${bills}</div><h2 style="margin-top:12px">各党の協力度</h2><div class="rows">${talks}</div></section>`;
  }
  return `<div class="page">
    <section class="cut box"><h2>与党 ${esc(careerSummary(state, world).ruling)}　内閣支持率 ${g.approval}%</h2><div class="rows">${rows}</div></section>
    ${gov}
  </div>`;
}
