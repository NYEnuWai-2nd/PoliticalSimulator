// デフォルメ日本地図データおよび SVG 描画モジュール（外部ライブラリ不使用）

/**
 * 47都道府県マスタ（JIS X 0401 順）
 */
export const PREFECTURES = [
  { code: 1, name: "北海道", label: "北海道", region: "北海道" },
  { code: 2, name: "青森県", label: "青森", region: "東北" },
  { code: 3, name: "岩手県", label: "岩手", region: "東北" },
  { code: 4, name: "宮城県", label: "宮城", region: "東北" },
  { code: 5, name: "秋田県", label: "秋田", region: "東北" },
  { code: 6, name: "山形県", label: "山形", region: "東北" },
  { code: 7, name: "福島県", label: "福島", region: "東北" },
  { code: 8, name: "茨城県", label: "茨城", region: "関東" },
  { code: 9, name: "栃木県", label: "栃木", region: "関東" },
  { code: 10, name: "群馬県", label: "群馬", region: "関東" },
  { code: 11, name: "埼玉県", label: "埼玉", region: "関東" },
  { code: 12, name: "千葉県", label: "千葉", region: "関東" },
  { code: 13, name: "東京都", label: "東京", region: "関東" },
  { code: 14, name: "神奈川県", label: "神奈川", region: "関東" },
  { code: 15, name: "新潟県", label: "新潟", region: "中部" },
  { code: 16, name: "富山県", label: "富山", region: "中部" },
  { code: 17, name: "石川県", label: "石川", region: "中部" },
  { code: 18, name: "福井県", label: "福井", region: "中部" },
  { code: 19, name: "山梨県", label: "山梨", region: "中部" },
  { code: 20, name: "長野県", label: "長野", region: "中部" },
  { code: 21, name: "岐阜県", label: "岐阜", region: "中部" },
  { code: 22, name: "静岡県", label: "静岡", region: "中部" },
  { code: 23, name: "愛知県", label: "愛知", region: "中部" },
  { code: 24, name: "三重県", label: "三重", region: "近畿" },
  { code: 25, name: "滋賀県", label: "滋賀", region: "近畿" },
  { code: 26, name: "京都府", label: "京都", region: "近畿" },
  { code: 27, name: "大阪府", label: "大阪", region: "近畿" },
  { code: 28, name: "兵庫県", label: "兵庫", region: "近畿" },
  { code: 29, name: "奈良県", label: "奈良", region: "近畿" },
  { code: 30, name: "和歌山県", label: "和歌山", region: "近畿" },
  { code: 31, name: "鳥取県", label: "鳥取", region: "中国" },
  { code: 32, name: "島根県", label: "島根", region: "中国" },
  { code: 33, name: "岡山県", label: "岡山", region: "中国" },
  { code: 34, name: "広島県", label: "広島", region: "中国" },
  { code: 35, name: "山口県", label: "山口", region: "中国" },
  { code: 36, name: "徳島県", label: "徳島", region: "四国" },
  { code: 37, name: "香川県", label: "香川", region: "四国" },
  { code: 38, name: "愛媛県", label: "愛媛", region: "四国" },
  { code: 39, name: "高知県", label: "高知", region: "四国" },
  { code: 40, name: "福岡県", label: "福岡", region: "九州・沖縄" },
  { code: 41, name: "佐賀県", label: "佐賀", region: "九州・沖縄" },
  { code: 42, name: "長崎県", label: "長崎", region: "九州・沖縄" },
  { code: 43, name: "熊本県", label: "熊本", region: "九州・沖縄" },
  { code: 44, name: "大分県", label: "大分", region: "九州・沖縄" },
  { code: 45, name: "宮崎県", label: "宮崎", region: "九州・沖縄" },
  { code: 46, name: "鹿児島県", label: "鹿児島", region: "九州・沖縄" },
  { code: 47, name: "沖縄県", label: "沖縄", region: "九州・沖縄" },
];

/**
 * 陸で接している都道府県の隣接関係（都道府県コード → 隣接コード配列）
 */
export const ADJACENCY = {
  1: [],
  2: [3, 5],
  3: [2, 5, 4],
  4: [3, 5, 6, 7],
  5: [2, 3, 4, 6],
  6: [5, 4, 7, 15],
  7: [4, 6, 15, 10, 9, 8],
  8: [7, 9, 11, 12],
  9: [7, 8, 10, 11],
  10: [7, 9, 11, 20, 15],
  11: [8, 9, 10, 20, 19, 13, 12],
  12: [8, 11, 13],
  13: [11, 12, 14, 19],
  14: [13, 19, 22],
  15: [6, 7, 10, 20, 16],
  16: [15, 20, 21, 17],
  17: [16, 21, 18],
  18: [17, 21, 25, 26],
  19: [11, 13, 14, 22, 20],
  20: [15, 10, 11, 19, 22, 23, 21, 16],
  21: [16, 17, 18, 20, 23, 24, 25],
  22: [14, 19, 20, 23],
  23: [22, 20, 21, 24],
  24: [23, 21, 25, 26, 29, 30],
  25: [18, 21, 24, 26],
  26: [18, 25, 24, 29, 27, 28],
  27: [26, 29, 30, 28],
  28: [26, 27, 33, 31],
  29: [26, 27, 24, 30],
  30: [27, 29, 24],
  31: [28, 33, 32, 34],
  32: [31, 34, 35],
  33: [28, 31, 34],
  34: [33, 31, 32, 35],
  35: [32, 34],
  36: [37, 38, 39],
  37: [36, 38],
  38: [37, 36, 39],
  39: [36, 38],
  40: [41, 43, 44],
  41: [40, 42],
  42: [41],
  43: [40, 44, 45, 46],
  44: [40, 43, 45],
  45: [44, 43, 46],
  46: [43, 45],
  47: [],
};

// 1マス = 2文字の都道府県コード。"00" は海。マスの間は半角空白1つで区切る
// 全体は横47マス × 縦44マス。ブロック地図風の強いデフォルメ（43県が純粋な長方形、4県が単純L字）を優先した配置。
//
// 長方形ブロックの整列を優先したため、以下の隣接7組は意図的に省略している（実在しない余分な隣接は 0 組）。
// 省略した組は OMITTED_ADJACENCY に列挙し、validateMap() の検査ではこれを除いて照合する。
//   - 宮城(04) - 秋田(05) : 岩手・秋田・山形・宮城を2×2の格子状長方形に揃えたため（角接）
//   - 埼玉(11) - 山梨(19) : 東京を横長長方形・山梨をその西側の長方形に揃えたため（角接）
//   - 神奈川(14) - 山梨(19) : 同上（角接）
//   - 長野(20) - 愛知(23) : 岐阜・長野・静岡・愛知の境界を直線で揃えたため（角接）
//   - 三重(24) - 京都(26) : 滋賀・奈良のブロックを挟んで長方形に整理したため
//   - 鳥取(31) - 広島(34) : 島根・鳥取・広島・岡山を2×2の格子状長方形に揃えたため（角接）
//   - 徳島(36) - 愛媛(38) : 四国4県を2×2の格子状長方形に揃えたため（角接）
export const OMITTED_ADJACENCY = [
  [4, 5],
  [11, 19],
  [14, 19],
  [20, 23],
  [24, 26],
  [31, 34],
  [36, 38],
];

export const MAP_ROWS = [
  "00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00",
  "00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00",
  "00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 01 01 01 01 01 01 01 01 01 01 00 00",
  "00 00 00 47 47 47 47 47 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 01 01 01 01 01 01 01 01 01 01 00 00",
  "00 00 00 47 47 47 47 47 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 01 01 01 01 01 01 01 01 01 01 00 00",
  "00 00 00 47 47 47 47 47 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 01 01 01 01 01 01 01 01 01 01 00 00",
  "00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 01 01 01 01 01 01 01 01 01 01 00 00",
  "00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 01 01 01 01 01 01 01 01 01 01 00 00",
  "00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 01 01 01 00 00 00 00 00 00 00 00 00",
  "00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 01 01 01 00 00 00 00 00 00 00 00 00",
  "00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00",
  "00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 02 02 02 02 02 02 02 02 02 00 00 00",
  "00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 02 02 02 02 02 02 02 02 02 00 00 00",
  "00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 02 02 02 02 02 02 02 02 02 00 00 00",
  "00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 05 05 05 05 03 03 03 03 03 00 00 00",
  "00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 05 05 05 05 03 03 03 03 03 00 00 00",
  "00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 05 05 05 05 03 03 03 03 03 00 00 00",
  "00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 06 06 06 06 04 04 04 04 04 00 00 00",
  "00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 17 17 17 00 00 00 00 00 00 00 06 06 06 06 04 04 04 04 04 00 00 00",
  "00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 17 17 17 00 00 00 00 00 00 00 06 06 06 06 04 04 04 04 04 00 00 00",
  "00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 17 17 17 16 16 16 16 15 15 15 15 15 07 07 07 07 07 07 07 00 00 00",
  "00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 17 17 17 16 16 16 16 15 15 15 15 15 07 07 07 07 07 07 07 00 00 00",
  "00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 17 17 17 16 16 16 16 15 15 15 15 15 07 07 07 07 07 07 07 00 00 00",
  "00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 17 17 17 16 16 16 16 15 15 15 15 15 07 07 07 07 07 07 07 00 00 00",
  "00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 18 18 18 18 21 21 21 20 20 20 20 20 10 10 10 09 09 09 08 08 08 00 00 00",
  "00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 28 28 28 26 26 26 26 18 18 21 21 21 20 20 20 20 20 10 10 10 09 09 09 08 08 08 00 00 00",
  "00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 28 28 28 26 26 26 26 18 18 21 21 21 20 20 20 20 20 10 10 10 09 09 09 08 08 08 00 00 00",
  "00 00 00 00 00 00 00 00 00 00 35 35 32 32 32 31 31 31 28 28 28 26 26 26 26 25 25 21 21 21 20 20 20 20 20 11 11 11 11 11 11 08 08 08 00 00 00",
  "00 00 00 00 00 00 00 00 00 00 35 35 32 32 32 31 31 31 28 28 28 26 26 26 26 25 25 21 21 21 20 20 20 20 20 11 11 11 11 11 11 12 12 12 00 00 00",
  "00 42 42 41 41 40 40 40 40 00 35 35 32 32 32 31 31 31 28 28 28 26 26 26 26 25 25 21 21 21 20 20 20 20 20 11 11 11 11 11 11 12 12 12 00 00 00",
  "00 42 42 41 41 40 40 40 40 00 35 35 34 34 34 33 33 33 28 28 28 26 26 26 26 25 25 21 21 21 20 20 19 19 19 13 13 13 13 13 13 12 12 12 00 00 00",
  "00 42 42 41 41 40 40 40 40 00 35 35 34 34 34 33 33 33 28 28 28 27 27 29 29 24 24 21 21 21 20 20 19 19 19 13 13 13 13 13 13 12 12 12 00 00 00",
  "00 42 42 41 41 40 40 44 44 00 35 35 34 34 34 33 33 33 28 28 28 27 27 29 29 24 24 21 21 21 20 20 19 19 19 13 13 13 13 13 13 12 12 12 00 00 00",
  "00 00 00 00 00 40 40 44 44 00 00 00 00 00 00 00 00 00 00 00 00 27 27 29 29 24 24 23 23 23 22 22 22 22 22 14 14 14 14 14 00 12 12 12 00 00 00",
  "00 00 00 00 00 43 43 44 44 00 00 00 38 38 38 38 37 37 37 37 00 30 30 30 30 24 24 23 23 23 22 22 22 22 22 14 14 14 14 14 00 12 12 12 00 00 00",
  "00 00 00 00 00 43 43 44 44 00 00 00 38 38 38 38 37 37 37 37 00 30 30 30 30 24 24 23 23 23 22 22 22 22 22 14 14 14 14 14 00 12 12 12 00 00 00",
  "00 00 00 00 00 43 43 45 45 00 00 00 39 39 39 39 36 36 36 36 00 30 30 30 30 24 24 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00",
  "00 00 00 00 00 43 43 45 45 00 00 00 39 39 39 39 36 36 36 36 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00",
  "00 00 00 00 00 43 43 45 45 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00",
  "00 00 00 00 00 46 46 46 46 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00",
  "00 00 00 00 00 46 46 46 46 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00",
  "00 00 00 00 00 46 46 46 46 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00",
  "00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00",
  "00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00",
];

const SVG_NS = "http://www.w3.org/2000/svg";
const PREF_BY_CODE = new Map(PREFECTURES.map((p) => [p.code, p]));

/**
 * 方眼文字列配列を数値の2次元配列へ変換する
 */
function parseGrid(rows = MAP_ROWS) {
  return rows.map((row) => row.trim().split(/\s+/).map((tok) => Number(tok)));
}

/**
 * 指定都道府県コードの境界線ループを辿り、同一直線上の頂点を結合した SVG path を作る
 */
function tracePrefecturePath(grid, code, cellSize) {
  const height = grid.length;
  const width = grid[0]?.length ?? 0;

  // 内部が進行方向右側になる時計回りの有向辺を収集する
  const edgesByStart = new Map();
  const addEdge = (x1, y1, x2, y2) => {
    const key = `${x1},${y1}`;
    let list = edgesByStart.get(key);
    if (!list) {
      list = [];
      edgesByStart.set(key, list);
    }
    list.push({ x1, y1, x2, y2, used: false });
  };

  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      if (grid[r][c] !== code) continue;
      if (r === 0 || grid[r - 1][c] !== code) addEdge(c, r, c + 1, r);
      if (c === width - 1 || grid[r][c + 1] !== code) addEdge(c + 1, r, c + 1, r + 1);
      if (r === height - 1 || grid[r + 1][c] !== code) addEdge(c + 1, r + 1, c, r + 1);
      if (c === 0 || grid[r][c - 1] !== code) addEdge(c, r + 1, c, r);
    }
  }

  const loops = [];
  for (const list of edgesByStart.values()) {
    for (const startEdge of list) {
      if (startEdge.used) continue;

      const pts = [];
      let current = startEdge;
      while (current && !current.used) {
        current.used = true;
        pts.push([current.x1, current.y1]);

        const nextKey = `${current.x2},${current.y2}`;
        const candidates = (edgesByStart.get(nextKey) || []).filter((e) => !e.used);
        if (candidates.length === 0) break;

        if (candidates.length === 1) {
          current = candidates[0];
        } else {
          // もし角同士が接する頂点がある場合は右折（時計回り）を優先して交差を防ぐ
          const dx = current.x2 - current.x1;
          const dy = current.y2 - current.y1;
          const rightDx = -dy;
          const rightDy = dx;
          current =
            candidates.find((e) => e.x2 - e.x1 === rightDx && e.y2 - e.y1 === rightDy) ||
            candidates[0];
        }
      }

      if (pts.length >= 3) {
        // 同一直線上で連続する中間頂点を除去する
        const simplified = [];
        const n = pts.length;
        for (let i = 0; i < n; i++) {
          const prev = pts[(i - 1 + n) % n];
          const curr = pts[i];
          const next = pts[(i + 1) % n];
          const dx1 = curr[0] - prev[0];
          const dy1 = curr[1] - prev[1];
          const dx2 = next[0] - curr[0];
          const dy2 = next[1] - curr[1];
          if (dx1 * dy2 - dy1 * dx2 !== 0) {
            simplified.push(curr);
          }
        }
        const loopStr =
          "M " +
          simplified.map(([x, y]) => `${x * cellSize} ${y * cellSize}`).join(" L ") +
          " Z";
        loops.push(loopStr);
      }
    }
  }

  return loops.join(" ");
}

/**
 * 県の内部に含まれる最も大きくラベルを置きやすい長方形の中心座標を求める
 */
function findLabelPosition(grid, code, cellSize) {
  const height = grid.length;
  const width = grid[0]?.length ?? 0;

  let best = null;
  for (let r1 = 0; r1 < height; r1++) {
    for (let c1 = 0; c1 < width; c1++) {
      if (grid[r1][c1] !== code) continue;
      let maxC2 = width - 1;
      for (let r2 = r1; r2 < height; r2++) {
        if (grid[r2][c1] !== code) break;
        let c2 = c1;
        while (c2 <= maxC2 && grid[r2][c2] === code) {
          c2++;
        }
        maxC2 = c2 - 1;
        const h = r2 - r1 + 1;
        const w = maxC2 - c1 + 1;
        const area = h * w;
        // 2×2以上を最優先し、横書きラベルが収まりやすい幅・面積を評価する
        const has2x2 = Math.min(h, w) >= 2 ? 1 : 0;
        const thickness = Math.min(h, w, 3);

        if (
          !best ||
          has2x2 > best.has2x2 ||
          (has2x2 === best.has2x2 &&
            (thickness > best.thickness ||
              (thickness === best.thickness &&
                (area > best.area || (area === best.area && w > best.w)))))
        ) {
          best = { has2x2, thickness, area, w, r1, r2, c1, c2: maxC2 };
        }
      }
    }
  }

  if (!best) {
    return { labelX: 0, labelY: 0 };
  }

  return {
    labelX: ((best.c1 + best.c2 + 1) / 2) * cellSize,
    labelY: ((best.r1 + best.r2 + 1) / 2) * cellSize,
  };
}

/**
 * 海岸線（陸と海）と県境（県と県）の連続線分を抽出する
 */
function buildBoundaryPaths(grid, cellSize) {
  const height = grid.length;
  const width = grid[0]?.length ?? 0;
  const coastSegs = [];
  const borderSegs = [];

  // 水平方向の境界線
  for (let r = 0; r <= height; r++) {
    let curType = null;
    let startC = 0;
    for (let c = 0; c <= width; c++) {
      let type = null;
      if (c < width) {
        const top = r > 0 ? grid[r - 1][c] : 0;
        const bot = r < height ? grid[r][c] : 0;
        if (top !== bot) {
          type = top === 0 || bot === 0 ? "coast" : "border";
        }
      }
      if (type !== curType) {
        if (curType === "coast") {
          coastSegs.push(`M ${startC * cellSize} ${r * cellSize} L ${c * cellSize} ${r * cellSize}`);
        } else if (curType === "border") {
          borderSegs.push(`M ${startC * cellSize} ${r * cellSize} L ${c * cellSize} ${r * cellSize}`);
        }
        curType = type;
        startC = c;
      }
    }
  }

  // 垂直方向の境界線
  for (let c = 0; c <= width; c++) {
    let curType = null;
    let startR = 0;
    for (let r = 0; r <= height; r++) {
      let type = null;
      if (r < height) {
        const left = c > 0 ? grid[r][c - 1] : 0;
        const right = c < width ? grid[r][c] : 0;
        if (left !== right) {
          type = left === 0 || right === 0 ? "coast" : "border";
        }
      }
      if (type !== curType) {
        if (curType === "coast") {
          coastSegs.push(`M ${c * cellSize} ${startR * cellSize} L ${c * cellSize} ${r * cellSize}`);
        } else if (curType === "border") {
          borderSegs.push(`M ${c * cellSize} ${startR * cellSize} L ${c * cellSize} ${r * cellSize}`);
        }
        curType = type;
        startR = r;
      }
    }
  }

  return {
    coastPath: coastSegs.join(" "),
    borderPath: borderSegs.join(" "),
  };
}

/**
 * 沖縄県（47）を本土から分ける海上の区切り線座標を計算する
 */
function computeOkinawaSeparator(grid, cellSize) {
  const height = grid.length;
  const width = grid[0]?.length ?? 0;

  let minR = Infinity;
  let maxR = -Infinity;
  let minC = Infinity;
  let maxC = -Infinity;
  let maxDiagTL = -Infinity;
  let minDiagBR = Infinity;

  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      if (grid[r][c] === 47) {
        if (r < minR) minR = r;
        if (r > maxR) maxR = r;
        if (c < minC) minC = c;
        if (c > maxC) maxC = c;
        maxDiagTL = Math.max(maxDiagTL, c + 1 + r + 1);
        minDiagBR = Math.min(minDiagBR, c + r);
      }
    }
  }

  if (maxR === -Infinity) {
    return { x1: 0, y1: 16 * cellSize, x2: 16 * cellSize, y2: 0 };
  }

  // 左上配置の場合は左上角を切り分ける斜め線を返す
  if (minR + minC < (height + width) / 2) {
    const sep = maxDiagTL + 2;
    return {
      x1: 0,
      y1: sep * cellSize,
      x2: sep * cellSize,
      y2: 0,
    };
  }

  // 右下配置に変更された場合は右下角を切り分ける斜め線を返す
  const sep = minDiagBR - 2;
  return {
    x1: (sep - height) * cellSize,
    y1: height * cellSize,
    x2: width * cellSize,
    y2: (sep - width) * cellSize,
  };
}

/**
 * 方眼データ（MAP_ROWS）から各都道府県の SVG ジオメトリを計算して返す
 */
export function buildMapGeometry(options = 16) {
  const cellSize =
    typeof options === "number" ? options : (options?.cellSize ?? 16);
  const grid = parseGrid(MAP_ROWS);
  const gridHeight = grid.length;
  const gridWidth = grid[0]?.length ?? 0;

  const prefectures = PREFECTURES.map(({ code }) => {
    const path = tracePrefecturePath(grid, code, cellSize);
    const { labelX, labelY } = findLabelPosition(grid, code, cellSize);
    return { code, path, labelX, labelY };
  });

  const { coastPath, borderPath } = buildBoundaryPaths(grid, cellSize);
  const okinawaSeparator = computeOkinawaSeparator(grid, cellSize);

  return {
    width: gridWidth * cellSize,
    height: gridHeight * cellSize,
    prefectures,
    coastPath,
    borderPath,
    okinawaSeparator,
  };
}

/**
 * 指定要素の中にデフォルメ日本地図の SVG を生成して挿入し、その SVG 要素を返す
 */
export function renderJapanMap(container, options = {}) {
  const {
    cellSize = 16,
    fill = null,
    showLabels = true,
    onClick = null,
    onHover = null,
  } = options || {};

  const fillFn = typeof fill === "function" ? fill : () => "#e2e8f0";
  const geometry = buildMapGeometry(cellSize);

  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("xmlns", SVG_NS);
  svg.setAttribute("viewBox", `0 0 ${geometry.width} ${geometry.height}`);
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", "デフォルメ日本地図");
  svg.style.width = "100%";
  svg.style.height = "auto";
  svg.style.display = "block";

  // SVG 内蔵スタイル（マウスオーバー強調とラベル・境界線のポインター制御）
  const style = document.createElementNS(SVG_NS, "style");
  style.textContent = `
    .pref {
      cursor: pointer;
      transition: filter 0.12s ease;
    }
    .pref:hover {
      filter: brightness(0.86);
    }
    .pref-border,
    .pref-coast,
    .pref-label,
    .okinawa-separator {
      pointer-events: none;
    }
    .pref-label {
      user-select: none;
      font-family: system-ui, -apple-system, "Hiragino Kaku Gothic ProN", "Yu Gothic UI", "Meiryo", sans-serif;
      font-weight: 600;
      fill: #0f172a;
      paint-order: stroke;
      stroke: rgba(255, 255, 255, 0.85);
      stroke-linejoin: round;
    }
  `;
  svg.appendChild(style);

  // 都道府県ポリゴン群
  const prefGroup = document.createElementNS(SVG_NS, "g");
  prefGroup.setAttribute("class", "prefs-layer");

  for (const geom of geometry.prefectures) {
    const pathEl = document.createElementNS(SVG_NS, "path");
    pathEl.setAttribute("d", geom.path);
    pathEl.setAttribute("class", "pref");
    pathEl.setAttribute("data-code", String(geom.code));
    pathEl.setAttribute("fill", fillFn(geom.code));
    pathEl.setAttribute("fill-rule", "evenodd");

    if (typeof onClick === "function") {
      pathEl.addEventListener("click", (event) => {
        onClick(geom.code, event);
      });
    }
    if (typeof onHover === "function") {
      pathEl.addEventListener("mouseenter", (event) => {
        onHover(geom.code, event);
      });
      pathEl.addEventListener("mouseleave", (event) => {
        onHover(null, event);
      });
    }

    prefGroup.appendChild(pathEl);
  }
  svg.appendChild(prefGroup);

  // 県境線（細め）
  const borderEl = document.createElementNS(SVG_NS, "path");
  borderEl.setAttribute("d", geometry.borderPath);
  borderEl.setAttribute("class", "pref-border");
  borderEl.setAttribute("fill", "none");
  borderEl.setAttribute("stroke", "#475569");
  borderEl.setAttribute("stroke-width", String(Math.max(0.6, cellSize * 0.06)));
  borderEl.setAttribute("stroke-linecap", "round");
  svg.appendChild(borderEl);

  // 海岸線（太め）
  const coastEl = document.createElementNS(SVG_NS, "path");
  coastEl.setAttribute("d", geometry.coastPath);
  coastEl.setAttribute("class", "pref-coast");
  coastEl.setAttribute("fill", "none");
  coastEl.setAttribute("stroke", "#0f172a");
  coastEl.setAttribute("stroke-width", String(Math.max(1.2, cellSize * 0.14)));
  coastEl.setAttribute("stroke-linecap", "square");
  svg.appendChild(coastEl);

  // 沖縄区の区切り線（県の形状とは別の線として海上に描画）
  const sepEl = document.createElementNS(SVG_NS, "line");
  sepEl.setAttribute("class", "okinawa-separator");
  sepEl.setAttribute("x1", String(geometry.okinawaSeparator.x1));
  sepEl.setAttribute("y1", String(geometry.okinawaSeparator.y1));
  sepEl.setAttribute("x2", String(geometry.okinawaSeparator.x2));
  sepEl.setAttribute("y2", String(geometry.okinawaSeparator.y2));
  sepEl.setAttribute("stroke", "#334155");
  sepEl.setAttribute("stroke-width", String(Math.max(1, cellSize * 0.1)));
  svg.appendChild(sepEl);

  // 都道府県名ラベル
  if (showLabels) {
    const labelGroup = document.createElementNS(SVG_NS, "g");
    labelGroup.setAttribute("class", "labels-layer");
    const fontSize = cellSize * 0.54;
    const haloWidth = cellSize * 0.16;

    for (const geom of geometry.prefectures) {
      const pref = PREF_BY_CODE.get(geom.code);
      if (!pref) continue;
      const textEl = document.createElementNS(SVG_NS, "text");
      textEl.setAttribute("class", "pref-label");
      textEl.setAttribute("x", String(geom.labelX));
      textEl.setAttribute("y", String(geom.labelY));
      textEl.setAttribute("text-anchor", "middle");
      textEl.setAttribute("dominant-baseline", "central");
      textEl.setAttribute("font-size", String(fontSize));
      textEl.style.strokeWidth = `${haloWidth}px`;
      textEl.textContent = pref.label;
      labelGroup.appendChild(textEl);
    }
    svg.appendChild(labelGroup);
  }

  if (container) {
    container.replaceChildren(svg);
  }
  return svg;
}

/**
 * 既存の地図 SVG 要素の塗り色だけを更新する
 */
export function updateFills(svg, fill) {
  if (!svg) return;
  const fillFn = typeof fill === "function" ? fill : () => "#e2e8f0";
  const paths = svg.querySelectorAll("path.pref");
  for (const pathEl of paths) {
    const code = Number(pathEl.getAttribute("data-code"));
    pathEl.setAttribute("fill", fillFn(code));
  }
}

/**
 * MAP_ROWS と ADJACENCY の整合性を検証し、問題点の一覧（文字列配列）を返す
 */
export function validateMap(rows = MAP_ROWS, adjacency = ADJACENCY) {
  const issues = [];

  if (!Array.isArray(rows) || rows.length === 0) {
    issues.push("MAP_ROWS が空です");
    return issues;
  }

  const height = rows.length;
  const tokenizedRows = rows.map((row) => String(row).trim().split(/\s+/));
  const expectedWidth = tokenizedRows[0].length;

  if (expectedWidth === 0) {
    issues.push("先頭行のマス数が 0 です");
    return issues;
  }

  // 1. すべての行のマス数が同じか検査
  for (let r = 0; r < height; r++) {
    if (tokenizedRows[r].length !== expectedWidth) {
      issues.push(
        `行 ${r} のマス数が一致しません（${tokenizedRows[r].length}マス、先頭行は${expectedWidth}マス）`
      );
    }
  }

  // 2. コードの妥当性と 1〜47 の網羅検査
  const grid = Array.from({ length: height }, () => []);
  const cellsByCode = new Map();
  for (let c = 1; c <= 47; c++) {
    cellsByCode.set(c, []);
  }

  for (let r = 0; r < height; r++) {
    for (let c = 0; c < tokenizedRows[r].length; c++) {
      const tok = tokenizedRows[r][c];
      if (!/^\d{2}$/.test(tok)) {
        issues.push(`不正なマス表記があります（行 ${r}, 列 ${c}: "${tok}"）`);
        grid[r][c] = 0;
        continue;
      }
      const code = Number(tok);
      if (code < 0 || code > 47) {
        issues.push(`範囲外の都道府県コードがあります（行 ${r}, 列 ${c}: ${tok}）`);
        grid[r][c] = 0;
        continue;
      }
      grid[r][c] = code;
      if (code >= 1 && code <= 47) {
        cellsByCode.get(code).push([r, c]);
      }
    }
  }

  for (let code = 1; code <= 47; code++) {
    const list = cellsByCode.get(code);
    const prefName = PREF_BY_CODE.get(code)?.name ?? `コード${code}`;
    if (list.length === 0) {
      issues.push(`都道府県コード ${code}（${prefName}）が地図上に存在しません`);
      continue;
    }

    // 3. 4近傍連結性および穴の有無を検査
    const cellSet = new Set(list.map(([r, c]) => `${r},${c}`));
    const queue = [list[0]];
    const visited = new Set([`${list[0][0]},${list[0][1]}`]);
    const dirs = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];

    for (let head = 0; head < queue.length; head++) {
      const [cr, cc] = queue[head];
      for (const [dr, dc] of dirs) {
        const nr = cr + dr;
        const nc = cc + dc;
        const key = `${nr},${nc}`;
        if (cellSet.has(key) && !visited.has(key)) {
          visited.add(key);
          queue.push([nr, nc]);
        }
      }
    }

    if (visited.size !== list.length) {
      issues.push(
        `都道府県コード ${code}（${prefName}）が上下左右で1つにつながっていません`
      );
    }

    // 外周に余白を1マス足した範囲から塗りつぶして穴がないか確認する
    const padH = height + 2;
    const padW = expectedWidth + 2;
    const extVisited = new Set(["0,0"]);
    const extQueue = [[0, 0]];
    for (let head = 0; head < extQueue.length; head++) {
      const [pr, pc] = extQueue[head];
      for (const [dr, dc] of dirs) {
        const nr = pr + dr;
        const nc = pc + dc;
        if (nr < 0 || nr >= padH || nc < 0 || nc >= padW) continue;
        const key = `${nr},${nc}`;
        if (extVisited.has(key)) continue;
        if (cellSet.has(`${nr - 1},${nc - 1}`)) continue;
        extVisited.add(key);
        extQueue.push([nr, nc]);
      }
    }
    if (extVisited.size + list.length !== padH * padW) {
      issues.push(`都道府県コード ${code}（${prefName}）の領域内に穴があります`);
    }

    // 4. 最小面積（4マス以上）を検査
    if (list.length < 4) {
      issues.push(
        `都道府県コード ${code}（${prefName}）のマス数が4未満です（${list.length}マス）`
      );
    }
  }

  // 5. 方眼から求めた隣接と ADJACENCY の違いを検査
  const actualAdj = new Map();
  for (let code = 1; code <= 47; code++) {
    actualAdj.set(code, new Set());
  }

  for (let r = 0; r < height; r++) {
    const rowLen = grid[r].length;
    for (let c = 0; c < rowLen; c++) {
      const a = grid[r][c];
      if (a < 1 || a > 47) continue;
      if (r + 1 < height && c < grid[r + 1].length) {
        const b = grid[r + 1][c];
        if (b >= 1 && b <= 47 && b !== a) {
          actualAdj.get(a).add(b);
          actualAdj.get(b).add(a);
        }
      }
      if (c + 1 < rowLen) {
        const b = grid[r][c + 1];
        if (b >= 1 && b <= 47 && b !== a) {
          actualAdj.get(a).add(b);
          actualAdj.get(b).add(a);
        }
      }
    }
  }

  // 地図の形を優先して意図的に省略した隣接は、不足として数えない
  const omitted = new Set(OMITTED_ADJACENCY.map(([x, y]) => `${Math.min(x, y)}-${Math.max(x, y)}`));

  const expectedAdj = new Map();
  for (let code = 1; code <= 47; code++) {
    expectedAdj.set(code, new Set(adjacency[code] || []));
  }

  for (let a = 1; a <= 47; a++) {
    for (let b = a + 1; b <= 47; b++) {
      const shouldTouch = expectedAdj.get(a).has(b) || expectedAdj.get(b).has(a);
      const doesTouch = actualAdj.get(a).has(b);
      const nameA = PREF_BY_CODE.get(a)?.label ?? String(a);
      const nameB = PREF_BY_CODE.get(b)?.label ?? String(b);

      if (shouldTouch && !doesTouch && !omitted.has(`${a}-${b}`)) {
        issues.push(`隣接が不足しています: ${a}(${nameA}) - ${b}(${nameB})`);
      } else if (!shouldTouch && doesTouch) {
        issues.push(`不要な隣接があります: ${a}(${nameA}) - ${b}(${nameB})`);
      }
    }
  }

  return issues;
}