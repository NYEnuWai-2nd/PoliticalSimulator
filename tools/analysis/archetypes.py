import json, collections, csv
rows = json.load(open('/home/claude/out/_members_with_bio.json'))
ORDER = [
    ("首長経験の行政型", ["首長出身"]),
    ("官僚出身の政策通", ["官僚出身", "大臣秘書官"]),
    ("組織内候補", ["労組出身"]),
    ("専門職", ["弁護士", "医療職", "士業"]),
    ("安全保障の実務家", ["自衛隊・警察"]),
    ("知名度型", ["芸能・スポーツ", "メディア出身"]),
    ("経済人", ["経営者・起業", "金融・商社・コンサル", "IT・エンジニア"]),
    ("地方議員からの叩き上げ", ["地方議員出身"]),
    ("地盤継承型", ["世襲の可能性", "秘書出身"]),
    ("学者・国際派", ["研究者・教員", "外交・国際", "松下政経塾"]),
    ("現場の代弁者", ["福祉・教育現場", "農林水産業"]),
]
def arche(tags):
    for name, keys in ORDER:
        if any(k in tags for k in keys):
            return name
    return "分類不能"
withbio = [r for r in rows if r["経歴テキスト"]]
for r in withbio:
    r["類型"] = arche(r["経歴タグ"].split("|"))
c = collections.Counter(r["類型"] for r in withbio)
tot = len(withbio)
for k, v in c.most_common():
    print(f"{k:14s} {v:4d} {100*v/tot:5.1f}%")
# 当選回数との関係
def tier(t):
    t = int(t) if str(t).isdigit() else 0
    return "新人(1回)" if t <= 1 else "中堅(2-4回)" if t <= 4 else "ベテラン(5-9回)" if t <= 9 else "重鎮(10回以上)"
allr = rows
print(collections.Counter(tier(r["当選回数_本院"]) for r in allr))

# members.csv に類型列を追加して書き出す
byname = {(r["院"], r["氏名"]): r for r in rows}
src = list(csv.DictReader(open('/home/claude/out/members.csv', encoding='utf-8-sig')))
for s in src:
    r = byname[(s["院"], s["氏名"])]
    s["経歴類型"] = r.get("類型", "") if r["経歴テキスト"] else "（経歴データなし）"
    tot_terms = sum(int(x) for x in (s["当選回数_本院"], s["当選回数_他院"]) if str(x).isdigit())
    s["当選回数_合計"] = tot_terms
    s["当選回数区分"] = tier(tot_terms)
cols = list(src[0].keys())
cols.insert(cols.index("経歴の出典"), cols.pop(cols.index("経歴類型")))
cols.insert(cols.index("経歴類型"), cols.pop(cols.index("当選回数区分")))
cols.insert(cols.index("当選回数_他院")+1, cols.pop(cols.index("当選回数_合計")))
with open('/home/claude/out/members.csv', 'w', encoding='utf-8-sig', newline='') as f:
    w = csv.DictWriter(f, fieldnames=cols); w.writeheader(); w.writerows(src)
print("written", len(src))
