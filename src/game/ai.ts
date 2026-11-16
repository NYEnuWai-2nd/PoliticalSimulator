// プレイヤーが首相でないときに、政権（首相の行動）を自動で動かす
// 自動で遊ばせて数値を確かめたときの手順をもとにしている。
import careerRaw from "../../data/game/career.json";
import {
  BILLS,
  billForecast,
  inSession,
  nemawashi,
  pressConference,
  startDrafting,
  submitBill,
  talkWithParty,
} from "./game.js";
import type { GameContext, GameState } from "./game.js";
import { MAJORITY } from "./districts.js";
import { partyDistance } from "./vote.js";

/** その月の首相の行動を選んで実行する（月末の処理は呼び出し側で endTurn を呼ぶ） */
export function aiGovernmentActions(g: GameState, ctx: GameContext): void {
  for (let k = 0; k < 3 && g.actionPoints > 0 && !g.over; k++) {
    // 1. 会期中で、過半数に届く見込みの法案があれば出す（予算を優先）
    const ready = BILLS.filter((b) => ["準備完了", "否決"].includes(g.bills[b.id].status))
      .map((b) => ({ b, f: billForecast(g, ctx, b) }))
      .sort((x, y) => Number(!!y.b.required) - Number(!!x.b.required) || y.f - x.f);
    if (inSession(g) && ready.length && ready[0].f >= MAJORITY + 1) {
      submitBill(g, ctx, ready[0].b.id);
      continue;
    }
    // 2. 準備中が2本未満なら、次の法案（予算を優先）の準備を始める
    const drafting = BILLS.filter((b) => g.bills[b.id].status === "準備中").length;
    const todo = BILLS.filter((b) => g.bills[b.id].status === "未着手").sort((x, y) => Number(!!y.required) - Number(!!x.required));
    if (todo.length && drafting < 2) {
      startDrafting(g, ctx, todo[0].id);
      continue;
    }
    // 3. 協力してくれそうな党（連立相手と、議席が多く思想の近い野党）と協議する。
    //    結束が落ちていれば根回し、余れば記者会見
    const target = talkTargets(g, ctx).find(({ id, goal }) => (g.cooperation[id] ?? 0) < goal);
    if (target) talkWithParty(g, ctx, target.id);
    else if (g.cohesion < 0.6) nemawashi(g, ctx);
    else pressConference(g, ctx);
  }
}

/**
 * 協議の相手の候補と、目標の協力度。連立相手は60、野党は議席が多く思想の近い順に上位2党を65・60まで上げる。
 * 政権が替わっても同じ考え方で相手を選ぶ。
 */
export function talkTargets(g: GameState, ctx: GameContext): { id: string; goal: number }[] {
  const seats = (p: string) => ctx.roster.filter((m) => m.party === p).length;
  const partners = g.ruling.partners.filter((p) => p in g.cooperation && seats(p) > 0).map((id) => ({ id, goal: 60 }));
  const opposition = Object.keys(g.cooperation)
    .filter((p) => !g.ruling.partners.includes(p) && seats(p) > 0)
    .sort((a, b) => seats(b) / (1 + partyDistance(g.ruling.party, b)) - seats(a) / (1 + partyDistance(g.ruling.party, a)))
    .slice(0, 2)
    .map((id, i) => ({ id, goal: i === 0 ? 65 : 60 }));
  return [...partners, ...opposition];
}

/** 首相が解散に踏み切るか。支持率が高いうちに解散する。rand は0以上1未満の乱数 */
export function aiWantsDissolution(g: GameState, rand: number): boolean {
  const D = careerRaw.ai_dissolution;
  return g.turn >= D.min_turn && g.approval >= D.approval && rand < D.chance;
}
