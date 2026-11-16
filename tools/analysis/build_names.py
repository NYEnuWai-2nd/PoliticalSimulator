"""ゲーム用の人名データセットを作る。

出典（どちらもMITライセンス）:
  - willnet/gimei  lib/data/names.yml  姓500、男性名約2500、女性名約10700（漢字・ひらがな・カタカナ・ローマ字）
  - faker-ruby/faker lib/locales/ja/name.yml  頻度順に並んだ上位100の姓（重みづけの順位に使う）

出力（/home/claude/out/names/）:
  - surnames.json     姓と出現の重み
  - given_names.json  名、性別、生まれ年代ごとの重み
  - LICENSE-NOTICE.txt  出典とライセンス表記
"""
import json
import math
import re
from collections import Counter, defaultdict
from pathlib import Path

import yaml

SRC = Path("/home/claude/names_src")
OUT = Path("/home/claude/out/names")
OUT.mkdir(parents=True, exist_ok=True)

gimei = yaml.safe_load(open(SRC / "gimei/lib/data/names.yml", encoding="utf-8"))
faker = yaml.safe_load(open(SRC / "faker/lib/locales/ja/name.yml", encoding="utf-8"))["ja"]["faker"]["name"]

# ---------------- 姓 ----------------
top100 = faker["last_name"]  # 頻度順
rank = {s: i + 1 for i, s in enumerate(top100)}
surnames = []
seen = set()
for kanji, hira, kata, roma in gimei["last_name"]:
    if kanji in seen:
        continue
    seen.add(kanji)
    r = rank.get(kanji)
    # 上位100はジップ則に近い重み、それ以外は101位相当の一定の重み
    w = 1.0 / (r ** 0.8) if r else 1.0 / (130 ** 0.8)
    surnames.append({"kanji": kanji, "kana": hira, "romaji": roma, "weight": round(w * 1000, 3), "rank_top100": r})
# faker にしかない上位100の姓があれば追加（読みが無いので除外して記録）
missing = [s for s in top100 if s not in seen]

# ---------------- 名 ----------------
DECADES = [1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010]
# 名の「型」ごとの年代別の重み（相対値）。実在議員の名前の語尾と一般的な命名の流行をもとに手で決めた値
STYLE_WEIGHTS = {
    "昭和前期型": [10, 8, 5, 2.5, 1, 0.4, 0.2, 0.1],
    "昭和後期型": [3, 5, 8, 9, 7, 4, 2, 1.5],
    "平成型":     [0.1, 0.2, 0.5, 1.5, 4, 8, 10, 10],
    "汎用":       [4, 4, 4, 4, 4, 4, 4, 4],
}
MALE_RULES = [
    ("平成型", r"(翔|斗|蓮|颯|湊|蒼|碧|奏|琉|煌|瑛|凪|律|暖|陽向|大翔|悠真|悠人|陸|叶|絆|空|海斗|結)"),
    ("昭和前期型", r"(夫|雄|男|治|茂|勇|進|清|実|博|勲|稔|昇|豊|忠|武|繁|修|衛|勝|保|孝|昭|悟|守|弘)$"),
    ("昭和後期型", r"(也|哉|樹|輔|介|史|和|浩|彦|之|司|志|行|宏|洋|隆|誠|一|郎|二|三|人|平|明|典|久|裕|健|剛|敏|章)$"),
]
FEMALE_RULES = [
    ("昭和前期型", r"(子|江|枝|代)$"),
    ("平成型", r"(菜|結|愛|陽|凛|莉|心|花|咲|彩|杏|萌|詩|澪|琴|芽|月|羽|乃|音|優|葵|楓|紬|芽|夢|姫)"),
    ("昭和後期型", r"(美|恵|里|紀|絵|奈|佳|香|穂|理|子|子|由|知|真|智|幸|明)$"),
]


def style_of(kanji, rules):
    for name, rx in rules:
        if re.search(rx, kanji):
            return name
    return "汎用"


def build_given(entries, gender, rules, keep_per_reading):
    # 漢字の使われやすさ（全名前での出現数）で珍しい字の組み合わせを減らす
    char_freq = Counter(c for e in entries for c in e[0])
    by_reading = defaultdict(list)
    for kanji, hira, kata, roma in entries:
        if not re.fullmatch(r"[ぁ-ゖァ-ヺ一-鿿々ー]+", kanji):
            continue
        score = sum(math.log(char_freq[c]) for c in kanji) / len(kanji)
        by_reading[hira].append((score, kanji, hira, roma))
    out = []
    for hira, items in by_reading.items():
        items.sort(reverse=True)
        for rank_in_reading, (score, kanji, hira_, roma) in enumerate(items[:keep_per_reading]):
            style = style_of(kanji, rules)
            # 同じ読みの中で一般的な字ほど重くする
            base = math.exp(score - 4) * (1.0 / (1 + rank_in_reading))
            out.append({
                "kanji": kanji, "kana": hira_, "romaji": roma, "gender": gender, "style": style,
                "weight_by_decade": {str(d): round(base * w, 4) for d, w in zip(DECADES, STYLE_WEIGHTS[style])},
            })
    return out


male = build_given(gimei["first_name"]["male"], "男", MALE_RULES, keep_per_reading=4)
female = build_given(gimei["first_name"]["female"], "女", FEMALE_RULES, keep_per_reading=3)
given = male + female

json.dump({"source": "willnet/gimei (MIT), faker-ruby/faker (MIT)", "surnames": surnames},
          open(OUT / "surnames.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
json.dump({"source": "willnet/gimei (MIT)", "decades": DECADES, "style_weights": STYLE_WEIGHTS, "given_names": given},
          open(OUT / "given_names.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)

gimei_lic = open(SRC / "gimei/LICENSE.txt" if (SRC / "gimei/LICENSE.txt").exists() else next(SRC.glob("gimei/LICENSE*")), encoding="utf-8").read()
faker_lic = open(SRC / "faker/License.txt", encoding="utf-8").read()
open(OUT / "LICENSE-NOTICE.txt", "w", encoding="utf-8").write(
    "このフォルダの人名データは以下のデータを加工して作成しています。\n\n"
    "== willnet/gimei (https://github.com/willnet/gimei) ==\n" + gimei_lic +
    "\n\n== faker-ruby/faker (https://github.com/faker-ruby/faker) ==\n" + faker_lic)

print("姓", len(surnames), "上位100で欠けたもの", missing)
print("男性名", len(male), Counter(x["style"] for x in male))
print("女性名", len(female), Counter(x["style"] for x in female))
