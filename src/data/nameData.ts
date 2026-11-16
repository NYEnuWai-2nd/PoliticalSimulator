// 名前データの読み込み。データが合計約2.6MBあるため JS に埋め込まず、
// 別ファイルとして配信して実行時に fetch する。
import surnamesUrl from "../../data/names/surnames.json?url";
import givenNamesUrl from "../../data/names/given_names.json?url";
import exclusionUrl from "../../data/names/exclude_real_politicians.json?url";
import type { ExclusionData, GivenNameData, SurnameData } from "../lib/nameGenerator.js";

export interface NameData {
  surnames: SurnameData;
  givenNames: GivenNameData;
  exclusion: ExclusionData;
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} の読み込みに失敗しました（${res.status}）`);
  return (await res.json()) as T;
}

let cache: Promise<NameData> | undefined;

export function loadNameData(): Promise<NameData> {
  cache ??= Promise.all([
    fetchJson<SurnameData>(surnamesUrl),
    fetchJson<GivenNameData>(givenNamesUrl),
    fetchJson<ExclusionData>(exclusionUrl),
  ]).then(([surnames, givenNames, exclusion]) => ({ surnames, givenNames, exclusion }));
  return cache;
}
