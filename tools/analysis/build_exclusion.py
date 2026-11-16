"""実在の国会議員（現職・戦後の衆議院議員・歴代参議院議員）と完全一致する氏名の除外リストを作る。
氏名そのものは配布せず、正規化した文字列の SHA-256 だけを保存する。似た名前は除外しない。"""
import csv, hashlib, json, re
from pathlib import Path
DATA = Path('/home/claude/data'); OUT = Path('/home/claude/out/names')
VAR = str.maketrans({'髙':'高','﨑':'崎','濵':'浜','邊':'辺','邉':'辺','齋':'斎','齊':'斉','德':'徳','瀨':'瀬','櫻':'桜','澤':'沢','國':'国','壯':'壮','來':'来','眞':'真','廣':'広','嶋':'島','龍':'竜','惠':'恵','條':'条'})
def nk(s):  # 漢字表記の正規化
    return re.sub(r'[\s　・]', '', s or '').translate(VAR)
def nr(s):  # 読みの正規化（カタカナをひらがなに）
    s = re.sub(r'[\s　・]', '', s or '')
    return ''.join(chr(ord(c) - 0x60) if 'ァ' <= c <= 'ヶ' else c for c in s)
h = lambda s: hashlib.sha256(s.encode('utf-8')).hexdigest()
kanji, reading = set(), set()
uni = json.load(open(DATA/'replit-politician-directory/attached_assets/latest_giin_network_unified_1774182103107.json'))
for m in uni['tokubetu_kokkai']['members']: kanji.add(nk(m['name'])); reading.add(nr(m['reading']))
for r in csv.DictReader(open(DATA/'house-of-councillors/data/giin.csv', encoding='utf-8')):
    kanji.add(nk(r['議員氏名'])); reading.add(nr(r['読み方']))
    if r['通称名使用議員の本名']: kanji.add(nk(r['通称名使用議員の本名']))
for r in csv.DictReader(open(DATA/'giin_-biography/Shugiin_data_ALL.csv', encoding='utf-8-sig')):
    kanji.add(nk(r['kanji'])); reading.add(nr(r['kana']))
for r in uni['rekidai_sangiin']['records']:
    kanji.add(nk(r['name'])); reading.add(nr(r['reading']))
    if r.get('real_name'): kanji.add(nk(r['real_name']))
kanji.discard(''); reading.discard('')
json.dump({'note': '実在の国会議員（現職、1947〜2024年の衆議院議員、歴代参議院議員）と完全一致する氏名のSHA-256。漢字は空白を除き異体字を統一、読みはひらがなに統一してからハッシュ化。',
           'normalize_kanji_variants': {chr(k): v for k, v in VAR.items()},
           'kanji_sha256': sorted(h(x) for x in kanji), 'reading_sha256': sorted(h(x) for x in reading)},
          open(OUT/'exclude_real_politicians.json', 'w', encoding='utf-8'), ensure_ascii=False)
print('漢字', len(kanji), '読み', len(reading))
print('確認', h(nk('麻生 太郎')) in {h(x) for x in kanji}, h(nr('あそう たろう')) in {h(x) for x in reading})
