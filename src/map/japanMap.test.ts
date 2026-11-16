import { describe, expect, it } from "vitest";
import { ADJACENCY, OMITTED_ADJACENCY, PREFECTURES, buildMapGeometry, validateMap } from "./japanMap.js";

describe("デフォルメ日本地図", () => {
  it("方眼の検査に問題がない（47都道府県、連結、4マス以上、隣接が一覧どおり。意図的な省略は除く）", () => {
    expect(validateMap()).toEqual([]);
  });

  it("意図的に省略した隣接は実際の隣接一覧にある組だけで、7組を超えない", () => {
    expect(OMITTED_ADJACENCY.length).toBeLessThanOrEqual(7);
    for (const [a, b] of OMITTED_ADJACENCY) expect(ADJACENCY[a], `${a}-${b}`).toContain(b);
  });

  it("47都道府県の定義と隣接一覧が揃っている", () => {
    expect(PREFECTURES.map((p) => p.code)).toEqual(Array.from({ length: 47 }, (_, i) => i + 1));
    for (const [a, list] of Object.entries(ADJACENCY))
      for (const b of list) expect(ADJACENCY[b], `${a}-${b}`).toContain(Number(a));
  });

  it("県の形に斜めの辺がない", () => {
    const g = buildMapGeometry(16);
    expect(g.prefectures).toHaveLength(47);
    for (const p of g.prefectures) {
      // "M x y L x y ... Z" の各ループで、隣り合う頂点が x か y を共有していること
      for (const loop of p.path.split("M").filter((s) => s.trim())) {
        const pts = loop.replace("Z", "").trim().split("L").map((s) => s.trim().split(/\s+/).map(Number));
        for (let i = 0; i < pts.length; i++) {
          const [x1, y1] = pts[i];
          const [x2, y2] = pts[(i + 1) % pts.length];
          expect(x1 === x2 || y1 === y2, `コード${p.code}`).toBe(true);
        }
      }
    }
  });
});
