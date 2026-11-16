import csv, json, re, collections
from pathlib import Path
DATA = Path('/home/claude/data'); OUT = Path('/home/claude/out')
def norm(n):
    n = re.sub(r'[\s　]', '', n or '')
    return n.translate(str.maketrans({'髙':'高','﨑':'崎','濵':'浜','邊':'辺','邉':'辺','齋':'斎','齊':'斉','德':'徳','瀨':'瀬','櫻':'桜','澤':'沢','國':'国','壯':'壮','來':'来','眞':'真','廣':'広','嶋':'島','龍':'竜','惠':'恵','條':'条'}))
H = list(csv.DictReader(open(DATA/'giin_-biography/Shugiin_data_ALL.csv', encoding='utf-8-sig')))
kana = lambda s: re.sub(r'[\s\u3000]', '', s or '')
hist_names = collections.defaultdict(set)
for r in H: hist_names[kana(r['kana'])].add(r['year'])
uni = json.load(open(DATA/'replit-politician-directory/attached_assets/latest_giin_network_unified_1774182103107.json'))
read26 = {re.sub(r'[\s\u3000]', '', x['name']): kana(x['reading']) for x in uni['tokubetu_kokkai']['members']}
y24 = json.load(open(OUT/'_shugiin_2024.json'))
m26 = [r for r in csv.DictReader(open(OUT/'members.csv', encoding='utf-8-sig')) if r['院'] == '衆議院']
# 参院から衆院へ移った人も把握するため参院名簿も使う
san = {kana(r['読み']) for r in csv.DictReader(open(OUT/'members.csv', encoding='utf-8-sig')) if r['院'] == '参議院'}
n24 = {o['kana']: o for o in y24}
def status26(r):
    n = kana(r['読み'])
    if n in n24: return '前職（2024年当選）'
    if hist_names.get(n): return '元職（2021年以前に当選）'
    if str(r['当選回数_他院']).isdigit() and int(r['当選回数_他院']) > 0: return '参院から転身'
    return '新人'
for r in m26: r['_st'] = status26(r)
print('2026年当選者の内訳', collections.Counter(r['_st'] for r in m26).most_common())
def bloc26(g):
    for k, v in [('自由民主', '自民'), ('中道', '中道'), ('維新', '維新'), ('国民', '国民'), ('参政', '参政'), ('みらい', 'みらい'), ('共産', '共産')]:
        if k in g: return v
    return '無所属'
print('会派別', {b: dict(collections.Counter(r['_st'] for r in m26 if bloc26(r['会派']) == b)) for b in ['自民','中道','維新','国民','参政','みらい']})
# 2024年当選者の2026年の結果
n26 = {kana(r['読み']) for r in m26}
fate = collections.defaultdict(collections.Counter)
for o in y24:
    n = o['kana']
    fate[o['政党_2024']]['再選' if n in n26 else ('参院へ' if n in san else '落選・引退')] += 1
print('\n2024年当選者の2026年', {p: dict(c) for p, c in sorted(fate.items(), key=lambda x: -sum(x[1].values()))})
# 経歴類型 2024 vs 2026（衆院、経歴ありのみ）
def dist(rows, key):
    rs = [r for r in rows if r[key] not in ('（経歴データなし）', '')]
    c = collections.Counter(r[key] for r in rs); return {k: round(100*v/len(rs), 1) for k, v in c.items()}, len(rs)
d24, k24 = dist(y24, '経歴類型'); d26, k26 = dist(m26, '経歴類型')
print('\n経歴類型の比率（衆院）2024 n=%d / 2026 n=%d' % (k24, k26))
for k in sorted(d24, key=lambda x: -d24[x]): print(f"  {k:12s} {d24[k]:5.1f} {d26.get(k,0):5.1f}")
# 2024年の政党別（旧野党の標本が大きい）
def p24(p):
    for k, v in [('自由民主','自民'),('立憲','立憲'),('維新','維新'),('国民','国民'),('公明','公明'),('れいわ','れいわ'),('共産','共産')]:
        if k in p: return v
    return 'その他'
parties = ['自民','立憲','維新','国民','公明','れいわ','共産']
types = [k for k in sorted(d24, key=lambda x: -d24[x])]
print('\n2024年 政党別の経歴類型(%)', *parties)
for t in types:
    row = []
    for p in parties:
        sub = [o for o in y24 if p24(o['政党_2024']) == p and o['_bio']]
        row.append(f"{100*sum(1 for o in sub if o['経歴類型']==t)/max(1,len(sub)):3.0f}")
    print(f"  {t:12s}", *row)
print('  n', *[sum(1 for o in y24 if p24(o['政党_2024'])==p and o['_bio']) for p in parties])
# タグ（類型ではなく重複を許す）で旧野党と与党の違い
print('\n2024年 タグ保有率(%)', *parties)
alltags = sorted({t for o in y24 for t in o['経歴タグ'].split('|') if t}, key=lambda t: -sum(t in o['経歴タグ'] for o in y24))
for t in alltags[:14]:
    print(f"  {t:12s}", *[f"{100*sum(1 for o in y24 if p24(o['政党_2024'])==p and t in o['経歴タグ'])/max(1,sum(1 for o in y24 if p24(o['政党_2024'])==p and o['_bio'])):3.0f}" for p in parties])
