// nameGenerator.js の型定義

export type Gender = "男" | "女";
export type NameStyle = "昭和前期型" | "昭和後期型" | "平成型" | "汎用";

export interface SurnameData {
  source: string;
  surnames: { kanji: string; kana: string; romaji: string; weight: number }[];
}

export interface GivenNameData {
  source: string;
  decades: number[];
  style_weights: Record<NameStyle, number[]>;
  given_names: {
    kanji: string;
    kana: string;
    romaji: string;
    gender: Gender;
    style: NameStyle;
    weight_by_decade: Record<string, number>;
  }[];
}

export interface ExclusionData {
  note: string;
  normalize_kanji_variants: Record<string, string>;
  kanji_sha256: string[];
  reading_sha256: string[];
}

export interface GeneratedName {
  surname: string;
  givenName: string;
  surnameKana: string;
  givenNameKana: string;
  romaji: string;
  displayName: string;
  gender: Gender;
  birthYear: number;
  nameStyle: NameStyle;
}

export interface NameGenerator {
  /** surname を指定すると、その姓（姓データにある漢字）で名だけを選ぶ */
  generate(options?: { gender?: Gender; birthYear?: number; surname?: string; maxTries?: number }): Promise<GeneratedName>;
  reserve(kanji: string, kana: string): void;
}

export function createNameGenerator(options: {
  surnames: SurnameData;
  givenNames: GivenNameData;
  exclusion: ExclusionData;
  seed?: number;
  hiraganaRate?: number;
}): Promise<NameGenerator>;

/** シード固定の乱数（mulberry32）。0以上1未満の数を返す関数を作る */
export function mulberry32(seed: number): () => number;
