"""現職国会議員データを統合し、経歴から特徴タグを抽出する。

入力:
  - replit-politician-directory の統合JSON（第221特別国会召集日 2026-02-18 時点の名簿、自民党派閥名簿、giindb の紹介文）
  - smartnews-smri/house-of-councillors の giin.csv（参議院、2026-08-31 時点の経歴つき）
出力:
  - /home/claude/out/members.csv
"""
import csv
import json
import re
import sys
from collections import Counter
from pathlib import Path

DATA = Path("/home/claude/data")
OUT = Path("/home/claude/out")
OUT.mkdir(exist_ok=True)

uni = json.load(open(DATA / "replit-politician-directory/attached_assets/latest_giin_network_unified_1774182103107.json"))


def norm(name: str) -> str:
    name = re.sub(r"[\s　]", "", name or "")
    # 旧字体などの揺れを最低限吸収
    table = str.maketrans({"髙": "高", "﨑": "崎", "濵": "浜", "邊": "辺", "邉": "辺", "齋": "斎", "齊": "斉", "德": "徳", "瀨": "瀬", "櫻": "桜", "澤": "沢", "國": "国", "壯": "壮", "來": "来", "眞": "真", "廣": "広", "嶋": "島", "龍": "竜", "惠": "恵", "條": "条"})
    return name.translate(table)


# 自民党派閥名簿（衆参の自民党議員、年齢・閣僚経験・選出区分つき）
ldp = {norm(r["name"]): r for r in uni["ldp_habatsu_csv"]["records"]}
# giindb 紹介文（総選挙前の名簿なので新人は含まれない）
giindb = {}
giindb_kana = {}
kana = lambda s: re.sub(r"[\s\u3000]", "", s or "")
for r in uni["giindb"]["records"]:
    giindb.setdefault(norm(r["name"]), r)
    giindb_kana.setdefault((r["chamber_code"], kana(r["reading"])), r)

rows = []

# ---- 衆議院（2026-02-18 時点） ----
for m in uni["tokubetu_kokkai"]["members"]:
    if m["chamber"] != "衆院":
        continue
    n = norm(m["name"])
    l = ldp.get(n, {})
    g = giindb.get(n) or giindb_kana.get(("衆", kana(m["reading"])))
    rows.append({
        "院": "衆議院",
        "氏名": m["name"],
        "読み": m["reading"],
        "会派": m["parliamentary_group"],
        "出身政党コード": m["party"],
        "選挙区": m["constituency"],
        "当選回数_本院": m["terms_shugiin"],
        "当選回数_他院": l.get("election_rounds_other_house") or "",
        "年齢_2026年3月1日": l.get("age_as_of_2026_03_01") or "",
        "自民党派閥": l.get("ldp_faction") or "",
        "選出区分": l.get("election_category_ja") or "",
        "閣僚経験": {True: "あり", False: "なし"}.get(l.get("minister_experience"), ""),
        "閣僚就任回数": l.get("minister_appointments_count") if l else "",
        "経歴テキスト": (g or {}).get("profile_text_ja") or "",
        "経歴の出典": "giindb" if g else "",
        "データ時点": "2026-02-18",
    })

# ---- 参議院（2026-08-31 時点） ----
kaiha_full = {r["略称"]: r["会派名"] for r in csv.DictReader(open(DATA / "house-of-councillors/data/kaiha.csv", encoding="utf-8"))}
for r in csv.DictReader(open(DATA / "house-of-councillors/data/giin.csv", encoding="utf-8")):
    n = norm(r["議員氏名"])
    l = ldp.get(n, {})
    terms = r["当選回数"]
    rows.append({
        "院": "参議院",
        "氏名": r["議員氏名"].replace("　", ""),
        "読み": r["読み方"],
        "会派": kaiha_full.get(r["会派"], r["会派"]),
        "出身政党コード": "",
        "選挙区": r["選挙区"],
        "当選回数_本院": terms,
        "当選回数_他院": l.get("election_rounds_other_house") or "",
        "年齢_2026年3月1日": l.get("age_as_of_2026_03_01") or "",
        "自民党派閥": l.get("ldp_faction") or "",
        "選出区分": l.get("election_category_ja") or ("比例" if r["選挙区"] == "比例" else "選挙区"),
        "閣僚経験": {True: "あり", False: "なし"}.get(l.get("minister_experience"), ""),
        "閣僚就任回数": l.get("minister_appointments_count") if l else "",
        "経歴テキスト": r["経歴"],
        "経歴の出典": "参議院公式",
        "データ時点": r["役職等の時点"] or "2026-08-31",
        "_任期満了": r["任期満了"],
    })

# ---- 経歴タグの抽出（キーワード規則） ----
TAGS = {
    "官僚出身": r"(入省|入庁|(省|庁)に入(り|る|った)|(省|庁)(に)?入所|大蔵省|通商産業省|自治省|検事)",
    "地方議員出身": r"(都議会議員|道議会議員|府議会議員|県議会議員|[市区町村]議会議員|[都道府県]議|[市区町村]議(?!員会)|議員（[^）]*期）)",
    "首長出身": r"(?<!副)(知事|市長|区長|町長|村長)(に初当選|に当選|に就任|就任|を[0-9０-９一二三四五]期|（[0-9０-９一二三四五]期)",
    "秘書出身": r"(秘書(?!官)|議員秘書|公設第|私設秘書)",
    "大臣秘書官": r"秘書官",
    "弁護士": r"弁護士",
    "医療職": r"(医師|歯科医|看護師|薬剤師|医学部.*卒.*病院|勤務医|開業医)",
    "士業": r"(公認会計士|税理士|司法書士|行政書士|社会保険労務士|弁理士)",
    "メディア出身": r"(記者|アナウンサー|キャスター|新聞社|放送局|ＮＨＫ|NHK|テレビ|ジャーナリスト)",
    "芸能・スポーツ": r"(タレント|俳優|女優|歌手|モデル|プロ野球|五輪|オリンピック|選手|プロレス|力士|競技者|金メダル|サッカー|芸人)",
    "労組出身": r"(労働組合|労組|ＵＡゼンセン|UAゼンセン|自治労|日教組|電力総連|基幹労連|自動車総連|電機連合|ＪＡＭ|情報労連|ＪＰ労組|JP労組|日本労働組合総連合会|連合(本部|東京|大阪|北海道|福岡|愛知|神奈川|埼玉|千葉|兵庫|静岡)|連合[^会]{0,2}(副会長|事務局長))",
    "松下政経塾": r"松下政経塾",
    "自衛隊・警察": r"(自衛官|自衛隊|陸将|海将|空将|警察官|警視)",
    "研究者・教員": r"(大学教授|准教授|助教|講師|研究員|教諭|教員)",
    "経営者・起業": r"(代表取締役|(?<!副)社長|創業|起業|経営者|CEO|ＣＥＯ|代表理事)",
    "金融・商社・コンサル": r"(銀行|証券|商事|物産|商社|コンサル|マッキンゼー|ゴールドマン|投資)",
    "外交・国際": r"(外交官|大使|国連|国際機関|世界銀行|留学|大学院.*(米国|アメリカ|英国|イギリス|ハーバード|スタンフォード))",
    "世襲の可能性": r"(父[・は]?[^。、]{0,12}(議員|大臣|首相|総理|知事)|祖父[・は]?[^。、]{0,12}(議員|大臣|首相|総理|知事)|曽祖父)",
    "農林水産業": r"(農業|農家|農協|ＪＡ|漁業|漁協|林業|酪農)",
    "福祉・教育現場": r"(保育士|介護|社会福祉|NPO|ＮＰＯ|児童|支援団体|ボランティア)",
        "IT・エンジニア": r"(エンジニア|ソフトウェア|プログラマ|IT企業|ＩＴ企業|AI系|ＡＩ系|IT系|ＩＴ系|データサイエンティスト)",
}
TAG_RE = {k: re.compile(v) for k, v in TAGS.items()}

for r in rows:
    t = r["経歴テキスト"]
    r["経歴タグ"] = "|".join(k for k, rx in TAG_RE.items() if t and rx.search(t))

# 出力（経歴テキストは集計用で、外部配布用ファイルには含めない）
cols_public = ["院", "氏名", "読み", "会派", "出身政党コード", "選挙区", "当選回数_本院", "当選回数_他院",
               "年齢_2026年3月1日", "自民党派閥", "選出区分", "閣僚経験", "閣僚就任回数", "経歴タグ", "経歴の出典", "データ時点"]
with open(OUT / "members.csv", "w", encoding="utf-8-sig", newline="") as f:
    w = csv.DictWriter(f, fieldnames=cols_public, extrasaction="ignore")
    w.writeheader()
    w.writerows(rows)
# 分析用（経歴テキストつき）は作業ディレクトリ内にのみ置く
with open(OUT / "_members_with_bio.json", "w", encoding="utf-8") as f:
    json.dump(rows, f, ensure_ascii=False)

print("rows", len(rows), Counter(r["院"] for r in rows))
for ch in ["衆議院", "参議院"]:
    sub = [r for r in rows if r["院"] == ch]
    print(ch, "経歴あり", sum(1 for r in sub if r["経歴テキスト"]), "/", len(sub),
          "年齢あり", sum(1 for r in sub if r["年齢_2026年3月1日"] != ""))
