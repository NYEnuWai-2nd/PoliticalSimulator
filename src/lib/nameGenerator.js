// キャラクター名の生成器（ブラウザとNode.jsの両方で動くESモジュール）
// 使い方:
//   const gen = await createNameGenerator({ surnames, givenNames, exclusion, seed: 2026 });
//   const name = await gen.generate({ gender: "男", birthYear: 1968 });
//
// surnames / givenNames / exclusion はそれぞれ surnames.json / given_names.json /
// exclude_real_politicians.json を読み込んだオブジェクト。

// シード固定の乱数（mulberry32）。同じシードなら毎回同じ名前の並びになる
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

async function sha256Hex(text) {
  const data = new TextEncoder().encode(text);
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) throw new Error("Web Crypto API が使えない環境です");
  const buf = await subtle.digest("SHA-256", data);
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function pickWeighted(items, weightOf, rand) {
  let total = 0;
  for (const it of items) total += weightOf(it);
  let r = rand() * total;
  for (const it of items) {
    r -= weightOf(it);
    if (r <= 0) return it;
  }
  return items[items.length - 1];
}

function decadeKey(birthYear, decades) {
  let key = decades[0];
  for (const d of decades) if (birthYear >= d) key = d;
  return String(key);
}

export async function createNameGenerator({
  surnames,
  givenNames,
  exclusion,
  seed = 1,
  hiraganaRate = 0.09, // 実在の国会議員で名の一部をひらがな表記にしている割合（約9%）
}) {
  const rand = mulberry32(seed);
  const variants = exclusion.normalize_kanji_variants || {};
  const exKanji = new Set(exclusion.kanji_sha256);
  const exReading = new Set(exclusion.reading_sha256);
  const used = new Set(); // 同じ世界の中で同姓同名を出さない
  const sList = surnames.surnames;
  const gList = givenNames.given_names;
  const decades = givenNames.decades;

  const normKanji = (s) => [...s.replace(/[\s　・]/g, "")].map((c) => variants[c] || c).join("");

  async function isRealPolitician(kanji, kana) {
    if (exKanji.has(await sha256Hex(normKanji(kanji)))) return true;
    if (exReading.has(await sha256Hex(kana))) return true;
    return false;
  }

  async function generate({ gender = rand() < 0.5 ? "男" : "女", birthYear = 1970, maxTries = 50 } = {}) {
    const dk = decadeKey(birthYear, decades);
    const pool = gList.filter((g) => g.gender === gender);
    for (let i = 0; i < maxTries; i++) {
      const s = pickWeighted(sList, (x) => x.weight, rand);
      const g = pickWeighted(pool, (x) => x.weight_by_decade[dk], rand);
      const kanji = s.kanji + g.kanji;
      const kana = s.kana + g.kana;
      if (used.has(kanji) || used.has(kana)) continue;
      if (await isRealPolitician(kanji, kana)) continue;
      used.add(kanji);
      used.add(kana);
      // 選挙用の通称として名をひらがなで書く候補者もいる
      const display = rand() < hiraganaRate ? s.kanji + g.kana : s.kanji + " " + g.kanji;
      return {
        surname: s.kanji,
        givenName: g.kanji,
        surnameKana: s.kana,
        givenNameKana: g.kana,
        romaji: `${g.romaji} ${s.romaji}`,
        displayName: display,
        gender,
        birthYear,
        nameStyle: g.style,
      };
    }
    throw new Error("条件に合う名前を生成できませんでした");
  }

  // 一度使った名前を登録する（セーブデータを読み込んだときなど）
  function reserve(kanji, kana) {
    used.add(kanji);
    used.add(kana);
  }

  return { generate, reserve };
}
