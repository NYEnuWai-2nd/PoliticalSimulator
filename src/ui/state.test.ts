import { describe, expect, it } from "vitest";
import { parseRoute, routeHash } from "./state.js";
import type { AppState, Route } from "./state.js";
import { neighbors } from "./views/memberView.js";
import type { Member } from "../game/roster.js";

describe("画面の URL", () => {
  it("URL の # 以降と画面の対応が往復で一致する", () => {
    const routes: Route[] = [{ view: "game" }, { view: "map" }, { view: "party", party: "minsei" }, { view: "party" }, { view: "cabinet" }, { view: "member", id: 12 }, { view: "member" }];
    for (const r of routes) expect(parseRoute(routeHash(r))).toEqual(r);
  });

  it("空や未知の URL は政局の画面にする", () => {
    expect(parseRoute("")).toEqual({ view: "game" });
    expect(parseRoute("#unknown")).toEqual({ view: "game" });
  });
});

describe("個人の画面の前後送り", () => {
  const state = (order: number[]) =>
    ({ roster: [1, 2, 3, 4].map((id) => ({ id }) as Member), memberOrder: order }) as unknown as AppState;

  it("直前の一覧の並びで前後に送り、端では反対の端に回る", () => {
    const s = state([3, 1, 4]);
    expect(neighbors(s, 1)).toEqual({ prev: 3, next: 4, index: 2, total: 3 });
    expect(neighbors(s, 3)).toMatchObject({ prev: 4, next: 1 });
  });

  it("並びがなければ名簿の順に送る", () => {
    expect(neighbors(state([]), 2)).toEqual({ prev: 1, next: 3, index: 2, total: 4 });
  });

  it("並びにいない議員からは並びの先頭と末尾に送る", () => {
    expect(neighbors(state([3, 1]), 2)).toMatchObject({ prev: 1, next: 3 });
  });
});
