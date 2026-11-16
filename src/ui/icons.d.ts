// icons.js の型定義（アイコンは Gemini が作った SVG。すべて viewBox="0 0 64 64"）

export type IconGroup = "act" | "exp" | "ab" | "field" | "tab" | "st" | "gov" | "ev";

/** id → SVG 文字列 */
export const ICONS: Record<string, string>;
/** 種類ごとの id の一覧 */
export const ICON_GROUPS: Record<IconGroup, string[]>;
/** id のアイコンを、指定した大きさの <svg> 文字列で返す。存在しない id なら灰色の四角 */
export function iconSvg(id: string, size?: number, label?: string): string;
