# 2024年衆院選の小選挙区の当選者数を、都道府県別・政党別に集計する。
# 個人は含まない。政党は架空政党のid（data/game/parties.json）に置き換えて書き出す。
# 使い方: python -I build_smd_by_pref.py <shugiin_2024_winners.csv> <出力.json>
import csv
import collections
import json
import re
import sys

# 実在の政党名 → 架空政党のid
PARTY_ID = {
    "自由民主党": "minsei",
    "立憲民主党": "minken",
    "日本維新の会": "sasshin",
    "国民民主党": "kyowa",
    "公明党": "kosei",
    "れいわ新選組": "reimei",
    "日本共産党": "shusan",
    "日本保守党": "hoshu",
    "参政党": "sankaku",
    "社会民主党": "shahei",
    "無所属": "independent",
}

PREFS = [
    "北海道", "青森", "岩手", "宮城", "秋田", "山形", "福島", "茨城", "栃木", "群馬",
    "埼玉", "千葉", "東京", "神奈川", "新潟", "富山", "石川", "福井", "山梨", "長野",
    "岐阜", "静岡", "愛知", "三重", "滋賀", "京都", "大阪", "兵庫", "奈良", "和歌山",
    "鳥取", "島根", "岡山", "広島", "山口", "徳島", "香川", "愛媛", "高知", "福岡",
    "佐賀", "長崎", "熊本", "大分", "宮崎", "鹿児島", "沖縄",
]

src, out = sys.argv[1], sys.argv[2]
rows = list(csv.DictReader(open(src, encoding="utf-8-sig")))
smd = collections.defaultdict(collections.Counter)
pr = collections.Counter()
for r in rows:
    district = r["選挙区_2024"]
    party = PARTY_ID[r["政党_2024"]]
    if "ブロック" in district:
        pr[party] += 1
    else:
        smd[re.sub(r"\d+区$", "", district)][party] += 1

assert set(smd) == set(PREFS), set(smd) ^ set(PREFS)
result = {
    "note": "2024年衆院選の当選者数の集計（個人は含まない）。政党は架空政党のid。smd_by_prefecture は都道府県コード（JIS）ごとの小選挙区の当選者数。",
    "smd_total": {k: v for k, v in collections.Counter(p for c in smd.values() for p in c.elements()).most_common()},
    "pr_total": dict(pr.most_common()),
    "smd_by_prefecture": {str(i + 1): dict(smd[name].most_common()) for i, name in enumerate(PREFS)},
}
with open(out, "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False, indent=1)
print("小選挙区", sum(result["smd_total"].values()), "比例", sum(result["pr_total"].values()))
