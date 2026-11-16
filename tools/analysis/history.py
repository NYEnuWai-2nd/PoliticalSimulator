import csv, json, re, collections, statistics as st
from pathlib import Path
DATA = Path('/home/claude/data'); OUT = Path('/home/claude/out')
YEAR = dict(zip([f'rl0{n}' for n in range(23, 51)], [1947,1949,1952,1953,1955,1958,1960,1963,1967,1969,1972,1976,1979,1980,1983,1986,1990,1993,1996,2000,2003,2005,2009,2012,2014,2017,2021,2024]))
H = list(csv.DictReader(open(DATA/'giin_-biography/Shugiin_data_ALL.csv', encoding='utf-8-sig')))
E = sorted(YEAR, key=lambda k: YEAR[k])
by_id = collections.defaultdict(list)
for r in H: by_id[r['giin_id']].append(r)
for v in by_id.values(): v.sort(key=lambda r: YEAR[r['year']])
print('人数', len(by_id), '逢沢', [YEAR[r['year']] for r in by_id['r01920']])

# 選挙ごとの新人・前職・元職
print('\n年 定数 新人% 元職%')
seen = set(); prev = set(); turnover = {}
for e in E:
    ids = {r['giin_id'] for r in H if r['year'] == e}
    new = ids - seen; former = (ids & seen) - prev
    turnover[YEAR[e]] = (len(ids), 100*len(new)/len(ids), 100*len(former)/len(ids))
    if e != 'rl023': print(YEAR[e], len(ids), f"{turnover[YEAR[e]][1]:.0f}", f"{turnover[YEAR[e]][2]:.0f}")
    seen |= ids; prev = ids

# 議員生活の長さ（1963〜1993年に初当選し、2014年までに引退・落選した人）
idx = {e: i for i, e in enumerate(E)}
done = [v for v in by_id.values() if 1963 <= YEAR[v[0]['year']] <= 1993 and YEAR[v[-1]['year']] <= 2014]
wins = [len(v) for v in done]
print('\n完結したキャリア', len(done), '当選回数 中央値', st.median(wins), '平均', round(st.mean(wins),1))
print(sorted(collections.Counter(min(w, 12) for w in wins).items()))
gap = sum(1 for v in done if any(idx[b['year']] - idx[a['year']] > 1 for a, b in zip(v, v[1:])))
print('途中で落選して返り咲いた経験あり', f"{100*gap/len(done):.0f}%")

# 政党ラベルの移動（無所属を除く）
def labels(v): return [r['party'] for r in v if r['party'] != '無所属']
multi = [v for v in by_id.values() if len(set(labels(v))) >= 2]
print('\n2つ以上の政党で当選', len(multi), f"{100*len(multi)/len(by_id):.0f}%")
for since in (1993, 2009):
    grp = [v for v in by_id.values() if YEAR[v[0]['year']] >= since and len(v) >= 2]
    print(f'{since}年以降初当選で2回以上当選した人のうち複数政党', f"{100*sum(1 for v in grp if len(set(labels(v)))>=2)/len(grp):.0f}%", len(grp))
tr = collections.Counter()
for v in by_id.values():
    L = labels(v)
    for a, b in zip(L, L[1:]):
        if a != b: tr[(a, b)] += 1
print('多い移動', tr.most_common(15))
json.dump({'turnover': turnover}, open(OUT/'_history_stats.json', 'w'), ensure_ascii=False)
