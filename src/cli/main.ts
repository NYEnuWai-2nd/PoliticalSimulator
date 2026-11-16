// 議員人生モードの CLI 版。ゲームの計算（src/game/）だけを使い、標準入力から1行ずつコマンドを読む。
// 人が遊ぶときは文字で、AI などのプログラムが遊ぶときは --json で1行1つの JSON を返す。
// ビルド: npm run build:cli → cli/seiji.mjs（Node.js だけで動く1ファイル）
import { createInterface } from "node:readline";
import { COLOR_NAMES, SKILLS, learnCost, skillById, sortSkills } from "../game/skills.js";
import { adviseMonth } from "../game/advice.js";
import surnames from "../../data/names/surnames.json";
import givenNames from "../../data/names/given_names.json";
import exclusion from "../../data/names/exclude_real_politicians.json";
import type { NameData } from "../data/nameData.js";
import { createWorld } from "../game/roster.js";
import { formInitialGovernment } from "../game/cabinet.js";
import { PARTIES, partyById } from "../game/parties.js";
import { ABILITIES, TABLES, rankOf } from "../game/tables.js";
import type { Ability } from "../game/tables.js";
import { PREFECTURES } from "../map/japanMap.js";
import {
  ACTIVITIES,
  EXP_TYPES,
  ORIGINS,
  RELATIONS,
  ROUTE_NAMES,
  canRunForLeader,
  canUpgrade,
  careerSummary,
  chooseEvent,
  startCareer,
  startOptions,
  takeTurn,
  govAction,
  govBills,
  isPrimeMinister,
  learnSkill,
  postCategory,
  upgradeAbility,
  upgradeCost,
} from "../game/career.js";
import type { CareerState, CareerWorld, OriginId, RouteId } from "../game/career.js";

const NAME_DATA = { surnames, givenNames, exclusion } as unknown as NameData;

const HELP = `議員人生モード（CLI 版）
党の公募で選ばれた新人候補として始め、毎月1つ活動を選んで経験点をため、能力を上げ、総選挙での当選を目指します。
落選しても浪人として続けられます。75歳か30年で引退すると終わります。

始める前のコマンド
  options                          出自・政党・経歴類型・出馬の道の一覧
  prefs <出自> <政党>              出馬できる道と県の一覧（例: prefs newcomer minsei）
  start <出自> <政党> <道> <県> <経歴類型>
                                   始める（例: start newcomer minsei smd 15 local）。県はコードか県名

遊ぶときのコマンド
  status                           今の状態
  acts                             活動の一覧
  do <活動>                        活動を1つ行って月を進める（例: do local）
  costs                            能力を1上げるのに使う経験点の一覧
  up <能力> [回数]                 経験点で能力を上げる（例: up 知名度 3）。月は進まない
  choose <番号>                    出来事の選択肢を選ぶ（1から）。選ぶまで月を進められない
  log [件数] [self|gov|all]        記録（既定は自分の記録。gov は政局、all は両方）
  learn <特殊能力>                 コツをつかんだ特殊能力を、経験点を払って覚える（status のコツの行に費用）
  hint                             秘書の助言（今月やるとよいこと。おすすめの活動は do の後ろに書く id）
  do duty                          公務（役職に就いているとき。役職ごとに効果が違う）
  run on|off                       次の党首選に立候補する／しない（当選3回以上・党の幹部との関係50以上）

首相のときのコマンド（毎月3回まで。月を進めるのは do <活動>）
  bills                            法案の一覧と状況
  gov draft <法案>                 法案の準備を始める
  gov submit <法案>                準備ができた法案を国会に出す（月末に採決）
  gov talk <政党>                  政策協議で協力度を上げる
  gov nemawashi                    党内の根回し
  gov press                        記者会見
  gov dissolve                     衆議院を解散する（月末に総選挙）
  help                             この説明
  quit                             終わる

起動時の引数
  --seed <数>     世界の乱数の種（既定 2026）。同じ種と同じコマンドなら毎回同じ結果
  --json          1行1つの JSON で応答する（AI などのプログラム向け）
  --start "<出自> <政党> <道> <県> <経歴類型>"   起動と同時に始める`;

interface Session {
  seed: number;
  json: boolean;
  base: Awaited<ReturnType<typeof createWorld>> & { government: ReturnType<typeof formInitialGovernment> };
  state?: CareerState;
  world?: CareerWorld;
}

interface Reply {
  ok: boolean;
  message: string;
  data?: unknown;
}

function parseArgs(argv: string[]) {
  const out = { seed: 2026, json: false, start: "" };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--seed") out.seed = Number(argv[++i]);
    else if (argv[i] === "--json") out.json = true;
    else if (argv[i] === "--start") out.start = argv[++i] ?? "";
    else if (argv[i] === "--help" || argv[i] === "-h") {
      process.stdout.write(HELP + "\n");
      process.exit(0);
    }
  }
  return out;
}

const prefCode = (s: string): number | undefined => {
  const n = Number(s);
  if (Number.isInteger(n) && n >= 1 && n <= 47) return n;
  const p = PREFECTURES.find((x) => x.name === s || x.label === s);
  return p?.code;
};

function optionsReply(s: Session): Reply {
  const seated = new Set(s.base.roster.map((m) => m.party));
  const data = {
    origins: ORIGINS.map((o) => ({ id: o.id, name: o.name, difficulty: o.difficulty, description: o.description })),
    parties: PARTIES.filter((p) => seated.has(p.id) && !p.is_independent).map((p) => ({
      id: p.id,
      name: p.name,
      seats: s.base.roster.filter((m) => m.party === p.id).length,
    })),
    archetypes: TABLES.archetypes.map((a) => ({ id: a.id, name: a.name, base: a.base_ranks })),
    routes: Object.entries(ROUTE_NAMES).map(([id, name]) => ({ id, name })),
  };
  const text = [
    "出自: " + data.origins.map((o) => `${o.id}（${o.name}・${o.difficulty}）`).join("、"),
    "政党: " + data.parties.map((p) => `${p.id}（${p.name}・${p.seats}議席）`).join("、"),
    "経歴類型: " + data.archetypes.map((a) => `${a.id}（${a.name}）`).join("、"),
    "出馬の道: " + data.routes.map((r) => `${r.id}（${r.name}）`).join("、"),
    "次に prefs <出自> <政党> で出馬できる県を見てください。",
  ].join("\n");
  return { ok: true, message: text, data };
}

function prefsReply(s: Session, origin: string, party: string): Reply {
  if (!ORIGINS.some((o) => o.id === origin)) return { ok: false, message: `出自は ${ORIGINS.map((o) => o.id).join(" / ")} のどれかです。` };
  if (!PARTIES.some((p) => p.id === party)) return { ok: false, message: "その政党はありません。options で一覧を見てください。" };
  const opts = startOptions(s.base.roster, party, origin as OriginId);
  const data = opts.map((o) => ({ route: o.route, pref: o.pref, prefName: PREFECTURES[o.pref - 1].name, note: o.note }));
  const lines = data.filter((d) => d.route !== "pr").map((d) => `  ${d.route} ${d.pref} ${d.prefName}：${d.note}`);
  if (data.some((d) => d.route === "pr")) lines.push("  pr <1〜47の県>：比例名簿（地元の県はどこでもよい。順位は党の幹部との関係で決まる）");
  return { ok: true, message: `出馬できる道と県（${opts.length}件）\n${lines.join("\n")}`, data };
}

async function startReply(s: Session, args: string[]): Promise<Reply> {
  if (s.state) return { ok: false, message: "もう始まっています。" };
  const [origin, party, route, prefArg, archetype] = args;
  const pref = prefCode(prefArg ?? "");
  if (!origin || !party || !route || !pref || !archetype) return { ok: false, message: "使い方: start <出自> <政党> <道> <県> <経歴類型>（例: start newcomer minsei smd 15 local）" };
  if (!TABLES.archetypes.some((a) => a.id === archetype)) return { ok: false, message: "その経歴類型はありません。options で一覧を見てください。" };
  try {
    const { state, world } = await startCareer(s.base, { origin: origin as OriginId, party, route: route as RouteId, pref, archetype }, s.seed);
    s.state = state;
    s.world = world;
    return { ok: true, message: `${state.log.at(-1)!.text}\n${statusText(s)}` };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : String(e) };
  }
}

function statusText(s: Session): string {
  const sum = careerSummary(s.state!, s.world!);
  const ab = ABILITIES.map((a) => `${a}${rankOf(sum.abilities[a])}(${sum.abilities[a]})`).join(" ");
  const exp = EXP_TYPES.map((e) => `${e.name}${sum.exp[e.id]}`).join(" ");
  const rel = RELATIONS.map((r) => `${r.name}${sum.relations[r.id]}`).join(" ");
  const lines = [
    `【${sum.date}】${sum.name}（${sum.age}歳・${sum.party}・${sum.origin}・${sum.status}${sum.post ? "・" + sum.post : ""}・当選${sum.terms}回）`,
    `地元 ${sum.pref}／道 ${sum.route}${sum.prRank ? `（比例名簿 ${sum.prRank}位の見込み）` : ""}`,
    `体力 ${sum.stamina}　やる気 ${sum.mood}/5　資金 ${sum.money}万円　地盤 ${sum.jiban}（次まで ${sum.jibanProgress}）`,
    `能力 ${ab}`,
    `経験点 ${exp}`,
    `関係 ${rel}`,
    `特殊能力 ${sortSkills(s.world!.player.skills).map((k) => `${k.name}(${COLOR_NAMES[k.color]})`).join(" ") || "なし"}`,
    `コツ ${Object.entries(s.state!.skillHints ?? {}).map(([id, lv]) => `${skillById(id)?.name}Lv${lv}（${Object.entries(learnCost(skillById(id)!, lv)).map(([k, n]) => `${EXP_TYPES.find((e) => e.id === k)?.name}${n}`).join(" ")}）`).join(" ") || "なし"}`,
    `内閣支持率 ${sum.approval}%　与党 ${sum.ruling}　首相 ${sum.primeMinister}${sum.isPrimeMinister ? `（自分・政権の行動あと${sum.actionPoints}回）` : ""}　自党の党首 ${sum.partyLeader}`,
    `次の総選挙 ${sum.nextElection}　与党の党首選 ${sum.leaderElection}${sum.canRunForLeader ? `　党首選に${sum.runForLeader ? "立候補する" : "立候補できる（run on）"}` : ""}${sum.canDuty ? "　公務ができる（do duty）" : ""}`,
  ];
  if (sum.forecast.length) lines.push(`情勢 ${sum.forecast.map((f) => `${f.isPlayer ? "★" : ""}${f.name}(${partyById(f.party).short})${f.share}`).join(" ／ ")}`);
  if (sum.pendingEvent)
    lines.push(`出来事「${sum.pendingEvent.title}」${sum.pendingEvent.text}\n${sum.pendingEvent.choices.map((c, i) => `  choose ${i + 1}：${c}`).join("\n")}`);
  if (sum.over) lines.push(`終了：${sum.over}`);
  return lines.join("\n");
}

function actsReply(): Reply {
  const data = ACTIVITIES.map((a) => ({ id: a.id, name: a.name, stamina: a.stamina, exp: a.exp, description: a.description }));
  return {
    ok: true,
    message: data
      .map((a) => `  ${a.id}（${a.name}）体力${a.stamina >= 0 ? "+" : ""}${a.stamina}　${Object.entries(a.exp).map(([k, v]) => `${EXP_TYPES.find((e) => e.id === k)!.name}+${v}`).join(" ")}　${a.description}`)
      .join("\n"),
    data,
  };
}

function costsReply(s: Session): Reply {
  const data = ABILITIES.map((a) => ({ ability: a, value: s.world!.player.abilities[a], cost: upgradeCost(s.world!.player, a), affordable: canUpgrade(s.state!, s.world!.player, a) }));
  return {
    ok: true,
    message: data
      .map((d) => `  ${d.ability}（今${d.value}）：${Object.entries(d.cost).map(([k, v]) => `${EXP_TYPES.find((e) => e.id === k)!.name}${v}`).join(" ")}${d.affordable ? "　上げられる" : ""}`)
      .join("\n"),
    data,
  };
}

function upReply(s: Session, ability: string, times: string | undefined): Reply {
  if (!ABILITIES.includes(ability as Ability)) return { ok: false, message: `能力は ${ABILITIES.join(" / ")} のどれかです。` };
  const n = Math.max(1, Number(times ?? 1) || 1);
  let done = 0;
  while (done < n && upgradeAbility(s.state!, s.world!, ability as Ability)) done++;
  return { ok: done > 0, message: done ? `${ability}を${done}上げた（今${s.world!.player.abilities[ability as Ability]}）。` : `経験点が足りず、${ability}を上げられない。` };
}

async function handle(s: Session, line: string): Promise<Reply | "quit"> {
  const [cmd, ...args] = line.trim().split(/\s+/);
  if (!cmd) return { ok: true, message: "" };
  switch (cmd) {
    case "help":
      return { ok: true, message: HELP };
    case "quit":
    case "exit":
      return "quit";
    case "options":
      return optionsReply(s);
    case "prefs":
      return prefsReply(s, args[0], args[1]);
    case "start":
      return startReply(s, args);
    case "acts":
      return actsReply();
  }
  if (!s.state || !s.world) return { ok: false, message: "まだ始まっていません。options、prefs、start の順に進めてください。" };
  switch (cmd) {
    case "status":
      return { ok: true, message: statusText(s) };
    case "do": {
      const before = s.state.elections.length;
      const r = await takeTurn(s.state, s.world, args[0] ?? "");
      if (!r.ok) return r;
      const extra = s.state.log.slice(-6).map((l) => l.text).filter((t) => t !== r.message);
      const election = s.state.elections.length > before ? s.state.elections.at(-1) : undefined;
      return { ok: true, message: [r.message, ...(election ? extra : []), "", statusText(s)].join("\n"), data: election ? { election } : undefined };
    }
    case "costs":
      return costsReply(s);
    case "up":
      return upReply(s, args[0] ?? "", args[1]);
    case "choose":
      return chooseEvent(s.state, s.world, Number(args[0]) - 1);
    case "run": {
      const on = args[0] !== "off";
      s.state.runForLeader = on;
      const note = on && !canRunForLeader(s.state, s.world) ? "（今は立候補の条件を満たしていない。条件を満たしたら次の党首選から立候補する）" : "";
      return { ok: true, message: on ? `次の党首選に立候補する。${note}` : "次の党首選には立候補しない。" };
    }
    case "bills":
      if (!isPrimeMinister(s.state, s.world)) return { ok: false, message: "法案の一覧は首相のときに見られます。" };
      return { ok: true, message: govBills(s.state).map((b) => `  ${b.id}（${b.name}・${b.field}）${b.status}${b.status === "準備中" ? ` ${b.progress}/${b.work}` : ""}`).join("\n"), data: govBills(s.state) };
    case "gov":
      return govAction(s.state, s.world, args[0] ?? "", args[1]);
    case "learn": {
      const sk = SKILLS.find((x) => x.name === args[0] || x.id === args[0]);
      if (!sk) return { ok: false, message: `「${args[0] ?? ""}」という特殊能力はありません。` };
      return learnSkill(s.state, s.world!, sk.id);
    }
    case "hint": {
      const advice = adviseMonth(s.state, s.world!, 5);
      return {
        ok: true,
        message: advice.map((a, i) => `${i + 1}. ${a.text}${a.act ? `（do ${a.act}）` : a.tab ? `（${a.tab === "self" ? "costs と up" : a.tab === "party" ? "run on" : "bills と gov"}）` : ""}`).join("\n"),
        data: advice,
      };
    }
    case "log": {
      const n = Number(args[0] ?? 15) || 15;
      const which = args[1] ?? "self";
      const list = s.state.log.filter((l) => which === "all" || (which === "gov" ? l.kind === "gov" : l.kind !== "gov"));
      return { ok: true, message: list.slice(-n).map((l) => `${l.date} ${l.kind === "gov" ? "［政局］" : ""}${l.text}`).join("\n") };
    }
    default:
      return { ok: false, message: `「${cmd}」というコマンドはありません。help で一覧を見てください。` };
  }
}

/** JSON 応答に付ける、今使えるコマンドの一覧 */
function available(s: Session): string[] {
  if (!s.state) return ["options", "prefs <出自> <政党>", "start <出自> <政党> <道> <県> <経歴類型>", "help", "quit"];
  if (s.state.over) return ["status", "log", "quit"];
  if (s.state.pendingEvent) return [...s.state.pendingEvent.choices.map((_, i) => `choose ${i + 1}`), "status", "costs", "up <能力> [回数]", "log"];
  const extra: string[] = [];
  if (postCategory(s.state, s.world!)) extra.push("do duty");
  if (canRunForLeader(s.state, s.world!)) extra.push(s.state.runForLeader ? "run off" : "run on");
  if (isPrimeMinister(s.state, s.world!) && s.state.gov.actionPoints > 0) extra.push("bills", "gov draft <法案>", "gov submit <法案>", "gov talk <政党>", "gov nemawashi", "gov press", "gov dissolve");
  return [...ACTIVITIES.map((a) => `do ${a.id}`), ...extra, "status", "costs", "up <能力> [回数]", ...(Object.keys(s.state.skillHints ?? {}).length ? ["learn <特殊能力>"] : []), "log", "hint", "quit"];
}

/** type は "ready"（起動直後の1行。コマンドへの応答ではない）か "response"（コマンド1つへの応答） */
function emit(s: Session, r: Reply, type: "ready" | "response" = "response"): void {
  if (s.json) {
    const state = s.state && s.world ? careerSummary(s.state, s.world) : undefined;
    process.stdout.write(JSON.stringify({ type, ok: r.ok, message: r.message, data: r.data, state, available: available(s) }) + "\n");
  } else if (r.message) process.stdout.write(r.message + "\n");
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const world = await createWorld(NAME_DATA, args.seed);
  const s: Session = { seed: args.seed, json: args.json, base: { ...world, government: formInitialGovernment(world.roster) } };
  if (args.start) emit(s, await startReply(s, args.start.split(/\s+/)), "ready");
  else emit(s, { ok: true, message: args.json ? "準備ができました。options で選べるものの一覧を見られます。" : `${HELP}\n\nまず options と入力してください。` }, "ready");

  const interactive = process.stdin.isTTY && !s.json;
  const rl = createInterface({ input: process.stdin, terminal: false });
  if (interactive) process.stdout.write("> ");
  // コマンドは1つずつ順番に処理する
  let queue = Promise.resolve();
  rl.on("line", (line) => {
    queue = queue.then(async () => {
      const r = await handle(s, line);
      if (r === "quit") {
        rl.close();
        process.exit(0);
      }
      emit(s, r);
      if (interactive) process.stdout.write("> ");
    });
  });
  rl.on("close", () => {
    void queue.then(() => process.exit(0));
  });
}

void main();
