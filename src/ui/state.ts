// 画面どうしで共有する状態
import type { Member } from "../game/roster.js";
import type { Appointment } from "../game/cabinet.js";
import type { GameState } from "../game/game.js";

export interface AppState {
  seed: number;
  /** ターンの流れの状態 */
  game?: GameState;
  roster: Member[];
  government: Appointment[];
  /** 議員番号 → 役職名 */
  postOf: Map<number, string>;
  /**
   * 個人の画面で左右に送るときの並び（議員番号）。直前に見ていた一覧の並びを入れる。
   * パワプロの能力画面で、一覧の順に前後の選手へ送れるのと同じ考え方。
   */
  memberOrder: number[];
  /** 地図の画面で選んでいる県 */
  selectedPref: number | null;
  /** 党内の画面で選んでいる政党 */
  selectedParty: string;
}

export type Route =
  | { view: "game" }
  | { view: "map" }
  | { view: "party"; party?: string }
  | { view: "cabinet" }
  | { view: "member"; id?: number };

export function parseRoute(hash: string): Route {
  const [view, arg] = hash.replace(/^#/, "").split("/");
  switch (view) {
    case "map":
      return { view: "map" };
    case "party":
      return { view: "party", party: arg || undefined };
    case "cabinet":
      return { view: "cabinet" };
    case "member":
      return { view: "member", id: arg ? Number(arg) : undefined };
    default:
      return { view: "game" };
  }
}

export function routeHash(r: Route): string {
  switch (r.view) {
    case "party":
      return r.party ? `#party/${r.party}` : "#party";
    case "cabinet":
      return "#cabinet";
    case "map":
      return "#map";
    case "member":
      return r.id ? `#member/${r.id}` : "#member";
    default:
      return "#game";
  }
}
