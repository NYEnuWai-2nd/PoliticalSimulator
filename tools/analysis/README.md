# 分析スクリプト（参考用）

`data/` の各ファイルを作ったときのスクリプトです。パスは作成環境（/home/claude/...）のままなので、そのままでは動きません。

使った元データ：

- smartnews-smri/house-of-councillors（MIT）：参議院の議員・会派
- skbnw/replit-politician-directory（ライセンス記載なし）：第221特別国会時点の衆参の名簿、自民党派閥名簿、giindb.com の紹介文、歴代参議院議員
- skbnw/giin_-biography（ライセンス記載なし）：1947〜2024年の衆議院議員の当選履歴
- willnet/gimei、faker-ruby/faker（MIT）：人名

| スクリプト | 内容 |
|---|---|
| build_members.py | 現職議員の統合と経歴タグの抽出 |
| archetypes.py | 経歴類型と当選回数区分の付与 |
| build_2024.py / compare.py | 2024年衆院選当選者の整理と2026年との比較 |
| history.py | 戦後の入れ替わり、議員生活の長さ、政党移動の集計 |
| build_names.py | 名前データの作成 |
| build_exclusion.py | 実在議員の完全一致除外リスト（ハッシュ）の作成 |
| test_names.mjs | 名前生成器のテスト |
