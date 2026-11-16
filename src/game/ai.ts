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
    // 3. 協力してくれそうな野党と協議する。結束が落ちていれば根回し、余れば記者会見
    if ((g.cooperation.kyowa ?? 0) < 65) talkWithParty(g, ctx, "kyowa");
    else if ((g.cooperation.sasshin ?? 0) < 60) talkWithParty(g, ctx, "sasshin");
    else if (g.cohesion < 0.6) nemawashi(g, ctx);
    else pressConference(g, ctx);
  }
}

/** 首相が解散に踏み切るか。支持率が高いうちに解散する。rand は0以上1未満の乱数 */
export function aiWantsDissolution(g: GameState, rand: number): boolean {
  const D = careerRaw.ai_dissolution;
  return g.turn >= D.min_turn && g.approval >= D.approval && rand < D.chance;
}
