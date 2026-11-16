// japanMap.js の型定義（地図本体は Gemini が生成し、方眼 MAP_ROWS を手で直せるようにしてある）

export type Region = "北海道" | "東北" | "関東" | "中部" | "近畿" | "中国" | "四国" | "九州・沖縄";

export interface Prefecture {
  /** JIS X 0401 の都道府県コード（1〜47） */
  code: number;
  name: string;
  /** 地図に表示する短い名前 */
  label: string;
  region: Region;
}

export interface PrefectureGeometry {
  code: number;
  /** SVG の d 属性 */
  path: string;
  labelX: number;
  labelY: number;
}

export interface MapGeometry {
  width: number;
  height: number;
  prefectures: PrefectureGeometry[];
  coastPath: string;
  borderPath: string;
  okinawaSeparator: { x1: number; y1: number; x2: number; y2: number };
}

export interface RenderOptions {
  cellSize?: number;
  fill?: (code: number) => string;
  showLabels?: boolean;
  onClick?: (code: number, event: MouseEvent) => void;
  onHover?: (code: number | null, event: MouseEvent) => void;
}

export const PREFECTURES: Prefecture[];
export const ADJACENCY: Record<number, number[]>;
export const MAP_ROWS: string[];
export function buildMapGeometry(options?: number | { cellSize?: number }): MapGeometry;
export function renderJapanMap(container: Element | null, options?: RenderOptions): SVGSVGElement;
export function updateFills(svg: SVGSVGElement, fill: (code: number) => string): void;
/** 問題の一覧を返す。空なら問題なし */
export function validateMap(rows?: string[], adjacency?: Record<number, number[]>): string[];
/** 地図の形を優先して意図的に省略した隣接の組（実際には陸で接している） */
export const OMITTED_ADJACENCY: [number, number][];
