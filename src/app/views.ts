// 議員人生モードの各画面（始め方、活動、地図、党内、内閣、自分）。HTML を返すだけで、操作は main.ts が受け取る
import { ACTIVITIES, EXP_TYPES, ORIGINS, RELATIONS, ROUTE_NAMES, canRunForLeader, canUpgrade, careerSummary, govBills, isPrimeMinister, postCategory, prRank, raceForecast, startOptions, upgradeCost } from "../game/career.js";
import type { CareerState, CareerWorld, OriginId, RouteId } from "../game/career.js";
import { PARTIES, partyById } from "../game/parties.js";
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

// ---------- 始め方 ----------

export function setupView(roster: Member[], c: SetupChoice): string {
  const seated = PARTIES.filter((p) => !p.is_independent && roster.some((m) => m.party === p.id));
  const origins = ORIGINS.map(
    (o) => `<button class="option${c.origin === o.id ? " is-active" : ""}" data-setup="origin" data-value="${o.id}">
      <b>${o.name}（${o.difficulty}）</b><small>${esc(o.description)}</small></button>`,
  ).join("");
  const parties = seated
    .map(
      (p) => `<button class="option${c.party === p.id ? " is-active" : ""}" data-setup="party" data-value="${p.id}">
      <b>${chip(p.id)} ${esc(p.name)}</b><small>${roster.filter((m) => m.party === p.id).length}議席</small></button>`,
    )
    .join("");
  let prefs = "";
  if (c.origin && c.party) {
    const opts = startOptions(roster, c.party, c.origin);
    const routes = [...new Set(opts.map((o) => o.route))];
    const route = c.route && routes.includes(c.route) ? c.route : routes[0];
    const routeBtns = routes
      .map((r) => `<button class="btn small${r === route ? " is-active" : ""}" data-setup="route" data-value="${r}">${ROUTE_NAMES[r]}</button>`)
      .join(" ");
    const list = opts
      .filter((o) => o.route === route)
      .map(
        (o) => `<button class="option${c.pref === o.pref && c.route === route ? " is-active" : ""}" data-setup="pref" data-value="${o.pref}" data-route="${route}">
        <b>${esc(prefName(o.pref))}</b><small>${esc(o.note)}</small></button>`,
      )
      .join("");
    prefs = `<section class="cut box step"><h2>3. 出馬の道と地元の県</h2><p>${routeBtns}</p><div class="pref-list">${list}</div></section>`;
  }
  const archetypes = TABLES.archetypes
    .map(
      (a) => `<button class="option${c.archetype === a.id ? " is-active" : ""}" data-setup="archetype" data-value="${a.id}">
      <b>${esc(a.name)}</b><small>${ABILITIES.map((ab) => `${ab.slice(0, 1)}${a.base_ranks[ab]}`).join(" ")}</small></button>`,
    )
    .join("");
  const ready = c.origin && c.party && c.route && c.pref && c.archetype;
  return `<div class="setup">
    <h1>議員人生</h1>
    <p class="cut box">党の公募で選ばれた新人候補として、総選挙での当選を目指します。落選しても浪人として続けられ、当選を重ねれば役職に就き、党首選に勝てば首相にもなれます。75歳か30年で引退すると終わります。</p>
    <section class="cut box step"><h2>1. 出自（難易度）</h2><div class="options">${origins}</div></section>
    <section class="cut box step"><h2>2. 政党</h2><div class="options">${parties}</div></section>
    ${prefs}
    <section class="cut box step"><h2>4. 経歴類型</h2><div class="options">${archetypes}</div></section>
    <p style="text-align:center"><button class="btn primary" data-action="start" ${ready ? "" : "disabled"}>この条件で始める</button></p>
  </div>`;
}

// ---------- 状態の帯 ----------

export function statusBar(state: CareerState, world: CareerWorld): string {
  const s = careerSummary(state, world);
  const [cur, max] = s.stamina.split("/").map(Number);
  return `<div class="pill-party">${chip(state.setup.party)}${esc(partyById(state.setup.party).short)}・${esc(s.post || s.status)}${moodIcon(state.mood, 24)}</div>
    <div class="cut date">${icon("st-calendar", 20)}<span>${state.year}年</span><b>${state.month}月</b></div>
    <div class="hp-block">
      <div class="hp-meta"><span>内閣支持率 <b>${s.approval}%</b>　与党 ${esc(s.ruling)}　次の総選挙 ${state.gov.termEnd.year}年${state.gov.termEnd.month}月まで</span><span>${icon("st-stamina", 14)} 体力</span></div>
      <div class="cut gauge"><span class="fill" style="width:${Math.round((cur / max) * 100)}%"></span><span class="val">${cur} / ${max}</span></div>
    </div>
    <div class="cut money">${icon("ab-fund", 20)}${state.money}万円</div>`;
}

// ---------- 活動 ----------

function racePanel(state: CareerState, world: CareerWorld): string {
  if (state.setup.route === "pr") {
    return `<div class="cut race">${icon("exp-election", 24)}<span>比例名簿の道</span><span class="muted">今の見込み：名簿 ${prRank(state) + 1}位（党の幹部との関係 ${state.relations.party}）</span></div>
      <div class="cut race" style="font-size:12px"><span class="muted">党務で党の幹部との関係を上げると、名簿の順位が上がる。</span></div>`;
  }
  const f = raceForecast(state, world);
  const me = f.find((x) => x.isPlayer)!;
  const top = f[0];
  const lead = me === top ? me.share - (f[1]?.share ?? 0) : me.share - top.share;
  const verdict = lead > 0.08 ? ["優勢", "verdict-good"] : lead > 0 ? ["やや優勢", "verdict-good"] : lead > -0.08 ? ["やや劣勢", "verdict-bad"] : ["劣勢", "verdict-bad"];
  const bar = f.map((x) => `<i style="width:${x.share * 100}%;background:${partyColor(x.party)}" title="${esc(x.name)} ${pct(x.share)}"></i>`).join("");
  const rival = f.find((x) => !x.isPlayer && x === top) ?? f.find((x) => !x.isPlayer);
  return `<div class="cut race">${icon("st-daruma", 24)}<span>${esc(prefName(state.setup.pref))}</span><div class="race-bar">${bar}</div><span>情勢 <b class="${verdict[1]}">${verdict[0]}</b></span></div>
    <div class="cut race" style="font-size:12px">${icon("st-jiban", 18)}<span class="muted">自分 ${pct(me.share)}</span>${rival ? `<span class="muted">相手</span><b>${esc(rival.name)}</b><span class="muted">${esc(partyById(rival.party).short)} ${pct(rival.share)}</span>` : ""}<span class="muted" style="margin-left:auto">地盤 ${world.player.jiban}</span></div>`;
}

function relPanel(state: CareerState): string {
  const colors: Record<string, string> = { secretary: "#e0559a", party: partyColor(state.setup.party), supporters: "#8d6e63", press: "#607d8b", kengi: "#3f51b5" };
  const rows = RELATIONS.map(
    (r) => `<div class="cut rel"><span class="face" style="background:${colors[r.id]}">${esc(r.name.slice(0, 1))}</span>
      <div class="rel-info"><div class="rel-top"><span>${esc(r.id === "secretary" ? state.secretaryName : r.name)}</span><small>${state.relations[r.id]}</small></div>
      <div class="mini-gauge"><i style="width:${state.relations[r.id]}%"></i></div></div></div>`,
  ).join("");
  return `<div class="panel-title" style="color:#0d2b57">関係</div>${rows}`;
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
    (e) => `<div class="cut exp-row">${icon(e.icon, 22)}<span class="exp-name">${e.name}</span><span class="exp-val">${state.exp[e.id]}</span><span class="exp-add">${sel?.exp[e.id] ? `+${sel.exp[e.id]}` : ""}</span></div>`,
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
  const name = world.player.name;
  return `<div class="arena">
    <div class="cut dark exp-panel"><div class="panel-title">経験点</div>${exp}</div>
    <div class="race-panel">${racePanel(state, world)}</div>
    <div class="rel-panel">${relPanel(state)}</div>
    <div class="center">
      <div class="fx">${sel ? FX[sel.id] ?? "" : last?.fx ?? ""}</div>
      ${face(name.surname, state.setup.party, "hero")}
      <div class="cut msg">${msg}</div>
    </div>
    <div class="cards" role="list">${cards}</div>
  </div>`;
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
      <span><button class="btn small" data-up="${a}" ${can ? "" : "disabled"}>+1</button> <button class="btn small" data-up="${a}" data-times="5" ${can ? "" : "disabled"}>+5</button></span></div>`;
  }).join("");
  const exp = EXP_TYPES.map((e) => `<div class="cut exp-row">${icon(e.icon, 22)}<span class="exp-name">${e.name}</span><span class="exp-val">${state.exp[e.id]}</span></div>`).join("");
  const rel = RELATIONS.map((r) => `<div class="row cut"><span class="grow">${esc(r.name)}</span><span class="bar" style="width:40%;--rc:#ff7eb3"><i style="width:${state.relations[r.id]}%"></i></span><b>${state.relations[r.id]}</b></div>`).join("");
  const pips = [1, 2, 3, 4].map((i) => `<i class="${i <= p.jiban ? "on" : ""}"></i>`).join("");
  const leader = canRunForLeader(state, world)
    ? `<p><button class="btn ${state.runForLeader ? "is-active" : ""}" data-action="toggle-run">${state.runForLeader ? "党首選に立候補する（取り消す）" : "次の党首選に立候補する"}</button></p>`
    : `<p class="muted">党首選に立候補できるのは、当選3回以上で党の幹部との関係が50以上のとき（党首は生涯3期まで）。</p>`;
  const ach = state.achievements.length ? state.achievements.map((a) => `<li>${esc(a)}</li>`).join("") : "<li class='muted'>まだない</li>";
  return `<div class="page">
    <div class="page-head"><h2 style="margin:0">${face(p.name.surname, p.party)} ${esc(p.name.displayName)}<small class="muted">　${s.age}歳・${esc(p.archetype)}・${esc(s.origin)}・当選${p.terms}回</small></h2></div>
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
  return `<div class="cut row" ${isPlayer ? 'style="--bd:#e61919;--bg:#fff7e0"' : ""}>${face(m.name.surname, m.party)}
    <div class="grow"><span class="nameplate">${esc(m.name.displayName)}${isPlayer ? "（自分）" : ""}</span> <span class="muted">当選${m.terms}回・${m.seat === "小選挙区" ? prefName(m.district!) : m.seat === "比例" ? "比例" : "浪人"}</span> ${extra}</div>
    <span class="ranks">${ABILITIES.map((a) => rankBadge(m.abilities[a])).join("")}</span></div>`;
}

export function partyView(state: CareerState, world: CareerWorld): string {
  const party = state.setup.party;
  const members = world.roster.filter((m) => m.party === party).sort((a, b) => b.terms - a.terms);
  const leaderId = state.leaders[party];
  const postOf = new Map(world.government.map((a) => [a.member.id, a.post.name]));
  const rows = members.map((m) => memberRow(m, `${m.id === leaderId ? '<span class="post">党首</span> ' : ""}${postOf.has(m.id) ? `<span class="post">${esc(postOf.get(m.id)!)}</span>` : ""}`, m.id === world.player.id)).join("");
  const seats = PARTIES.filter((p) => world.roster.some((m) => m.party === p.id)).map((p) => ({ p, n: world.roster.filter((m) => m.party === p.id).length }));
  const bar = seats.map(({ p, n }) => `<i style="width:${(n / world.roster.length) * 100}%;background:${p.color}" title="${esc(p.name)} ${n}"></i>`).join("");
  return `<div class="page">
    <section class="cut box"><h2>議席の構成（定数${world.roster.length}・過半数${MAJORITY}）</h2><div class="race-bar" style="height:20px">${bar}</div>
      <p class="muted" style="margin:6px 0 0">${seats.map(({ p, n }) => `${chip(p.id)} ${esc(p.short)} ${n}`).join("　")}</p></section>
    <section class="cut box"><h2>${chip(party)} ${esc(partyById(party).name)}の議員（${members.length}人）</h2><div class="rows">${rows || "<p class='muted'>議席がない</p>"}</div></section>
  </div>`;
}

// ---------- 内閣（首相なら政権の行動も） ----------

export function cabinetView(state: CareerState, world: CareerWorld): string {
  const g = state.gov;
  const rows = world.government
    .map((a) => memberRow(a.member, `<span class="post">${esc(a.post.name)}</span>`, a.member.id === world.player.id))
    .join("");
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
      <p><button class="btn" data-gov="nemawashi">${icon("gov-nemawashi", 22)}党内の根回し</button> <button class="btn" data-gov="press">${icon("gov-press", 22)}記者会見</button> <button class="btn primary" data-gov="dissolve">${icon("gov-dissolve", 22)}衆議院を解散</button></p>
      <p class="muted">与党の結束 ${Math.round(g.cohesion * 100)}%。行動を選び終えたら、活動の画面で今月の活動を選ぶと月末になります。</p>
      <h2>法案</h2><div class="rows">${bills}</div><h2 style="margin-top:12px">各党の協力度</h2><div class="rows">${talks}</div></section>`;
  }
  return `<div class="page">
    <section class="cut box"><h2>与党 ${esc(careerSummary(state, world).ruling)}　内閣支持率 ${g.approval}%</h2><div class="rows">${rows}</div></section>
    ${gov}
  </div>`;
}
