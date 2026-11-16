import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { createNameGenerator } from "../../src/lib/nameGenerator.js";
const load = (f) => JSON.parse(readFileSync(new URL(`../../data/names/${f}`, import.meta.url), "utf8"));
const surnames = load("surnames.json"), givenNames = load("given_names.json"), exclusion = load("exclude_real_politicians.json");
async function roster(seed, n) {
  const gen = await createNameGenerator({ surnames, givenNames, exclusion, seed });
  const out = [];
  for (let i = 0; i < n; i++) {
    const birthYear = 1940 + Math.floor(((i * 7919) % 1000) / 1000 * 60); // 1940〜1999年生まれ
    const gender = i % 5 === 0 ? "女" : "男"; // 女性約2割
    out.push(await gen.generate({ gender, birthYear }));
  }
  return out;
}
const a = await roster(2026, 1200), b = await roster(2026, 1200), c = await roster(7, 20);
console.log("再現性", JSON.stringify(a) === JSON.stringify(b), "別シードは別の結果", a[0].displayName !== c[0].displayName);
console.log("1200人で漢字の重複", a.length - new Set(a.map((x) => x.surname + x.givenName)).size);
// 除外が効いているか：除外リストの漢字ハッシュと照合
const ex = new Set(exclusion.kanji_sha256);
const hit = a.filter((x) => ex.has(createHash("sha256").update(x.surname + x.givenName).digest("hex")));
console.log("実在議員と完全一致", hit.length);
console.log("ひらがな表記", a.filter((x) => !x.displayName.includes(" ")).length);
const byDec = {};
for (const x of a) { const d = Math.floor(x.birthYear / 10) * 10; (byDec[d] ??= {})[x.nameStyle] = (byDec[d][x.nameStyle] || 0) + 1; }
console.log("生まれ年代別の名の型", byDec);
const sc = {}; for (const x of a) sc[x.surname] = (sc[x.surname] || 0) + 1;
console.log("多い姓", Object.entries(sc).sort((p, q) => q[1] - p[1]).slice(0, 8), "姓の種類", Object.keys(sc).length);
console.log("例");
for (const x of a.slice(0, 16)) console.log(" ", x.birthYear, x.gender, x.displayName.padEnd(8, "　"), x.surnameKana + " " + x.givenNameKana, x.nameStyle);
