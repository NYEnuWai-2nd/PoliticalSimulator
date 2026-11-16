"""2024年衆院選（第50回）の当選者に経歴類型を付け、2026年と比較できる形にする。"""
import csv, json, re, collections
from pathlib import Path
DATA = Path('/home/claude/data'); OUT = Path('/home/claude/out')
src = open('/home/claude/scripts/build_members.py', encoding='utf-8').read()
TAGS = eval(src.split('TAGS = ')[1].split('\nTAG_RE')[0])
TAG_RE = {k: re.compile(v) for k, v in TAGS.items()}
ar = open('/home/claude/scripts/archetypes.py', encoding='utf-8').read()
ORDER = eval(ar.split('ORDER = ')[1].split('\ndef arche')[0])
def arche(tags):
    for name, keys in ORDER:
        if any(k in tags for k in keys): return name
    return '分類不能'
def norm(n):
    n = re.sub(r'[\s　]', '', n or '')
    return n.translate(str.maketrans({'髙':'高','﨑':'崎','濵':'浜','邊':'辺','邉':'辺','齋':'斎','齊':'斉','德':'徳','瀨':'瀬','櫻':'桜','澤':'沢','國':'国','壯':'壮','來':'来','眞':'真','廣':'広','嶋':'島','龍':'竜','惠':'恵','條':'条'}))
uni = json.load(open(DATA/'replit-politician-directory/attached_assets/latest_giin_network_unified_1774182103107.json'))
kana = lambda s: re.sub(r'[\s\u3000]', '', s or '')
giindb = {kana(r['reading']): r for r in uni['giindb']['records'] if r['chamber_code'] == '衆'}
hist = list(csv.DictReader(open(DATA/'giin_-biography/Shugiin_data_ALL.csv', encoding='utf-8-sig')))
r50 = [r for r in hist if r['year'] == 'rl050']
out = []
for r in r50:
    g = giindb.get(kana(r['kana']))
    bio = (g or {}).get('profile_text_ja') or ''
    tags = [k for k, rx in TAG_RE.items() if bio and rx.search(bio)]
    out.append({'kana': kana(r['kana']), 'giin_id': r['giin_id'], '氏名': r['kanji'], '政党_2024': r['party'], '選挙区_2024': r['election_area'],
                '経歴タグ': '|'.join(tags), '経歴類型': arche(tags) if bio else '（経歴データなし）', '_bio': bio})
json.dump(out, open(OUT/'_shugiin_2024.json', 'w', encoding='utf-8'), ensure_ascii=False)
print(len(out), '経歴あり', sum(1 for o in out if o['_bio']))
print(collections.Counter(o['政党_2024'] for o in out if not o['_bio']).most_common())
