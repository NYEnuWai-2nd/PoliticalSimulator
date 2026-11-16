# 議員人生モード CLI 版

政治シミュレーションゲームの議員人生モードを、文字の入出力だけで遊べるようにしたもの。`seiji.mjs` 1つのファイルに、ゲームの計算と名前データがすべて入っている。Node.js（18以上）があれば、ほかのファイルなしで動く。

## 作り方

```
npm run build:cli
```

`cli/seiji.mjs` ができる（約2.8MB）。このファイルだけを別の場所に置いても動く。

## 遊び方

```
node seiji.mjs                     # 人が遊ぶ（説明が出るので options から）
node seiji.mjs --seed 7            # 世界の乱数の種を変える
node seiji.mjs --json              # 1行1つの JSON で応答する（AI などのプログラム向け）
node seiji.mjs --start "newcomer minken successor 20 local"   # 起動と同時に始める
```

標準入力から1行に1つコマンドを読む。パイプでまとめて流し込んでもよい。

| コマンド | 内容 |
|---|---|
| `options` | 出自・政党・経歴類型・出馬の道の一覧 |
| `prefs <出自> <政党>` | 出馬できる道と県の一覧 |
| `start <出自> <政党> <道> <県> <経歴類型>` | 始める。県はコード（1〜47）か県名 |
| `status` | 今の状態 |
| `acts` | 活動の一覧 |
| `do <活動>` | 活動を1つ行って月を進める |
| `costs` | 能力を1上げるのに使う経験点の一覧 |
| `up <能力> [回数]` | 経験点で能力を上げる（月は進まない） |
| `choose <番号>` | 出来事の選択肢を選ぶ（1から）。選ぶまで月を進められない |
| `log [件数]` | 記録 |
| `help` / `quit` | 説明 / 終わる |

- 出自：`newcomer`（新人・難しい）、`hereditary`（世襲・ふつう）、`dynasty`（名門・やさしい）
- 出馬の道：`smd`（小選挙区で他党の現職に挑む。世襲・名門は親の地盤を継ぐ）、`successor`（引退する自党の現職の後継。新人のみ）、`pr`（比例名簿。順位は党の幹部との関係で決まる）
- 活動：`local`（地元回り）、`speech`（街頭演説）、`study`（政策勉強会）、`fund`（資金集め）、`party`（党務）、`kengi`（県議と連携）、`festival`（地域行事）、`training`（体力づくり）、`hobby`（趣味の時間）、`rest`（休養）
- 能力：弁舌、政策、調整、知名度、組織、資金

## JSON モードの応答

1つのコマンドに1行の JSON を返す。

```json
{
  "ok": true,
  "message": "地元回り：選挙+22、人脈+8 …",
  "data": { "election": { … } },
  "state": { "date": "2026年2月", "status": "候補", "stamina": "85/100", "jiban": 1, "abilities": { … }, "exp": { … }, "forecast": [ … ], "pendingEvent": null, "over": null, … },
  "available": ["do local", "do speech", …]
}
```

- `ok`：コマンドが受け付けられたか。
- `state`：始めたあとの状態の要約（始める前は省略）。`pendingEvent` があるときは `choose` で選ぶまで月を進められない。`over` に文字が入ったら終わり。
- `available`：今使えるコマンドの一覧。
- `data`：一覧系のコマンドの中身や、総選挙があった月の結果。

同じ `--seed` と同じコマンドの並びからは、毎回同じ結果になる。
