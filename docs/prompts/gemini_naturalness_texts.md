# 議員人生：ゲームの中の文章（全部）

抜き出した日：2026-11-17。全部で 2253 件。
「番号」は修正案を返すときに使う。データの「場所」は JSON の中の位置、コードの「行」はファイルの行番号。

## 第1部　データの文章

### career（活動、出自、関係、秘書の名前など）

| 番号 | 場所 | 文 |
|---|---|---|
| career-1 | origins[0].name | 新人 |
| career-2 | origins[0].difficulty | 難しい |
| career-3 | origins[0].description | 後援会も地盤もない一般家庭の出身。他党の現職に挑む。 |
| career-4 | origins[1].name | 世襲 |
| career-5 | origins[1].difficulty | ふつう |
| career-6 | origins[1].description | 引退する親の選挙区と後援会を継ぐ。地盤は固いが、世襲批判もある。 |
| career-7 | origins[2].name | 名門 |
| career-8 | origins[2].difficulty | やさしい |
| career-9 | origins[2].description | 閣僚を出してきた一族の跡取り。地盤も資金も知名度も申し分ないが、党の期待も大きい。 |
| career-10 | exp_types[0].name | 選挙 |
| career-11 | exp_types[1].name | 政策 |
| career-12 | exp_types[2].name | 人脈 |
| career-13 | exp_types[3].name | 発信 |
| career-14 | exp_types[4].name | 資金 |
| career-15 | relations[0].name | 秘書 |
| career-16 | relations[1].name | 党の幹部 |
| career-17 | relations[2].name | 後援会 |
| career-18 | relations[3].name | 地元紙 |
| career-19 | relations[4].name | 県議団 |
| career-20 | activities[0].name | 地元回り |
| career-21 | activities[0].description | 商店街や町内会を一軒ずつ回る。地盤が上がりやすい。 |
| career-22 | activities[1].name | 街頭演説 |
| career-23 | activities[1].description | 駅前で政策を訴える。知名度と弁舌につながる。 |
| career-24 | activities[2].name | 政策勉強会 |
| career-25 | activities[2].description | 専門家を招いて政策を学ぶ。体力をあまり使わない。 |
| career-26 | activities[3].name | 資金集め |
| career-27 | activities[3].description | 支援者の会合を回って献金を集める。資金の能力が高いほど多く集まる。 |
| career-28 | activities[4].name | 党務 |
| career-29 | activities[4].description | 党本部の仕事を手伝い、幹部に顔を売る。 |
| career-30 | activities[5].name | 県議と連携 |
| career-31 | activities[5].description | 県議会議員と地元の会合を回る。県議団との関係が深まると、県議が地元の票を固めてくれる。 |
| career-32 | activities[6].name | 地域行事 |
| career-33 | activities[6].description | 祭りや運動会、清掃活動に顔を出す。地道だが後援会と地盤に効く。 |
| career-34 | activities[7].name | 体力づくり |
| career-35 | activities[7].description | 走り込みで体を鍛える。体力の上限が少し上がる。 |
| career-36 | activities[8].name | 趣味の時間 |
| career-37 | activities[8].description | 好きなことをして気分を変える。やる気が上がりやすい。 |
| career-38 | activities[9].name | 休養 |
| career-39 | activities[9].description | 体を休める。体力が戻り、やる気が上がることがある。 |

### life_events（日常の出来事）

| 番号 | 場所 | 文 |
|---|---|---|
| life_events-1 | events[0].title | 秋祭りの神輿 |
| life_events-2 | events[0].text | 地元の秋祭りで町内会長から「今年は神輿を担いでみないか」と声をかけられた。 |
| life_events-3 | events[0].choices[0].label | 法被を着て担ぐ |
| life_events-4 | events[0].choices[0].result | 汗だくになって担ぎ切った。担ぎ手の若い衆と打ち解けた。 |
| life_events-5 | events[0].choices[1].label | 沿道で挨拶回りに徹する |
| life_events-6 | events[0].choices[1].result | 見物客一人ひとりに頭を下げた。 |
| life_events-7 | events[0].choices[2].label | 今年は遠慮する |
| life_events-8 | events[0].choices[2].result | 体を休めたが、町内会長は少し残念そうだった。 |
| life_events-9 | events[1].title | 秘書の相談 |
| life_events-10 | events[1].text | {secretary}が「最近、休みが取れなくて……」と疲れた顔で相談してきた。 |
| life_events-11 | events[1].choices[0].label | 休みを取らせる |
| life_events-12 | events[1].choices[0].result | {secretary}は一週間の休みを取り、元気に戻ってきた。 |
| life_events-13 | events[1].choices[1].label | 一緒に食事に行って話を聞く |
| life_events-14 | events[1].choices[1].result | 仕事の段取りを一緒に見直した。 |
| life_events-15 | events[1].choices[2].label | 選挙が終わるまで頑張ってもらう |
| life_events-16 | events[1].choices[2].result | {secretary}は黙ってうなずいた。 |
| life_events-17 | events[2].title | 県議の会食 |
| life_events-18 | events[2].text | 地元の県議会議員から「一度ゆっくり飲みましょう」と誘われた。県議団は地元の票をまとめる力を持っている。 |
| life_events-19 | events[2].choices[0].label | 誘いを受けて地元の話を聞く |
| life_events-20 | events[2].choices[0].result | 県議の後援会の名簿を見せてもらう約束を取り付けた。 |
| life_events-21 | events[2].choices[1].label | 昼の意見交換会にしてもらう |
| life_events-22 | events[2].choices[1].result | まじめな意見交換になり、距離は少し縮まった。 |
| life_events-23 | events[3].title | 健康診断の結果 |
| life_events-24 | events[3].text | 健康診断で「少し運動したほうがいい」と言われた。 |
| life_events-25 | events[3].choices[0].label | 朝のジョギングを始める |
| life_events-26 | events[3].choices[0].result | 朝の川沿いで散歩中の有権者とよく会うようになった。 |
| life_events-27 | events[3].choices[1].label | 食事に気を付ける |
| life_events-28 | events[3].choices[1].result | 少し体が軽くなった。 |
| life_events-29 | events[3].choices[2].label | 忙しいので後回しにする |
| life_events-30 | events[3].choices[2].result | なんとなく体が重い。 |
| life_events-31 | events[4].title | 大雪 |
| life_events-32 | events[4].text | 記録的な大雪で地元の高齢者の家が雪に埋もれていると連絡が入った。 |
| life_events-33 | events[4].choices[0].label | スコップを持って雪かきに行く |
| life_events-34 | events[4].choices[0].result | 黙々と雪をかいた。その姿が地元紙に小さく載った。 |
| life_events-35 | events[4].choices[1].label | 役所に除雪の手配を頼む |
| life_events-36 | events[4].choices[1].result | 除雪車が早めに回ってきた。 |
| life_events-37 | events[5].title | 街宣車の故障 |
| life_events-38 | events[5].text | 街頭演説に使っている車が故障した。修理には思ったより費用がかかりそうだ。 |
| life_events-39 | events[5].choices[0].label | 修理に出す |
| life_events-40 | events[5].choices[0].result | 車は直ったが、懐は寂しくなった。 |
| life_events-41 | events[5].choices[1].label | しばらく自転車で回る |
| life_events-42 | events[5].choices[1].result | 自転車で回る姿が意外に好評だった。 |
| life_events-43 | events[6].title | ネットで話題に |
| life_events-44 | events[6].text | 地元の名物を紹介した短い動画が思いがけずネットで広まり始めた。 |
| life_events-45 | events[6].choices[0].label | 続けて動画を出す |
| life_events-46 | events[6].choices[0].result | 顔と名前を覚えてくれる人が増えた。 |
| life_events-47 | events[6].choices[1].label | 浮かれずに本業に戻る |
| life_events-48 | events[6].choices[1].result | 少し話題になって、すぐに落ち着いた。 |
| life_events-49 | events[7].title | 同期の集まり |
| life_events-50 | events[7].text | 同じ年に公認を受けた同期の候補たちから勉強会を兼ねた集まりに誘われた。 |
| life_events-51 | events[7].choices[0].label | 参加して政策を語り合う |
| life_events-52 | events[7].choices[0].result | 互いの選挙区の苦労話で盛り上がった。 |
| life_events-53 | events[7].choices[1].label | 地元を優先して断る |
| life_events-54 | events[7].choices[1].result | その日も地元を回った。 |
| life_events-55 | events[8].title | 母校の講演 |
| life_events-56 | events[8].text | 母校の高校から生徒向けに「働くことと社会」について話してほしいと頼まれた。 |
| life_events-57 | events[8].choices[0].label | 引き受けて話す |
| life_events-58 | events[8].choices[0].result | 生徒の質問の鋭さに驚いた。保護者の間でも話題になった。 |
| life_events-59 | events[8].choices[1].label | 日程が合わず断る |
| life_events-60 | events[8].choices[1].result | 丁寧にお詫びの手紙を送った。 |
| life_events-61 | events[9].title | 農家の手伝い |
| life_events-62 | events[9].text | 田植えの時期、支援者の農家から「人手が足りない」と電話があった。 |
| life_events-63 | events[9].choices[0].label | 長靴を履いて手伝う |
| life_events-64 | events[9].choices[0].result | 泥だらけになったが、農家の皆さんと一気に打ち解けた。 |
| life_events-65 | events[9].choices[1].label | 差し入れだけ届ける |
| life_events-66 | events[9].choices[1].result | 冷たい麦茶を喜んでもらえた。 |
| life_events-67 | events[10].title | 地元紙の取材 |
| life_events-68 | events[10].text | 地元紙の記者から「地域の課題」について取材を申し込まれた。 |
| life_events-69 | events[10].choices[0].label | 時間を取って丁寧に答える |
| life_events-70 | events[10].choices[0].result | 記事は大きく扱われ、好意的な内容だった。 |
| life_events-71 | events[10].choices[1].label | 手短に済ませる |
| life_events-72 | events[10].choices[1].result | 記事は小さかった。 |
| life_events-73 | events[11].title | 恩師の言葉 |
| life_events-74 | events[11].text | 中学時代の恩師から手紙が届いた。「どんなときも、地元の人の顔を思い浮かべなさい」と書かれていた。 |
| life_events-75 | events[11].choices[0].label | 手紙を事務所に飾る |
| life_events-76 | events[11].choices[0].result | 気持ちが引き締まった。 |
| life_events-77 | events[11].choices[1].label | お礼に会いに行く |
| life_events-78 | events[11].choices[1].result | 恩師は昔と変わらず厳しく、そして温かかった。 |
| life_events-79 | events[12].title | 委員会での質問 |
| life_events-80 | events[12].text | 所属する委員会で30分の質問時間が回ってきた。 |
| life_events-81 | events[12].choices[0].label | 徹夜で資料を読み込んで臨む |
| life_events-82 | events[12].choices[0].result | 大臣から具体的な答弁を引き出した。地元紙にも取り上げられた。 |
| life_events-83 | events[12].choices[1].label | 地元の陳情をそのまま取り上げる |
| life_events-84 | events[12].choices[1].result | 地元の要望が議事録に残った。後援会が喜んだ。 |
| life_events-85 | events[12].choices[2].label | 党の先輩に質問時間を譲る |
| life_events-86 | events[12].choices[2].result | 先輩に貸しを作った。 |
| life_events-87 | events[13].title | 派閥の会合 |
| life_events-88 | events[13].text | 党内の派閥の会合に誘われた。人事の前には、どの派閥に近いかがものを言う。 |
| life_events-89 | events[13].choices[0].label | 毎週顔を出す |
| life_events-90 | events[13].choices[0].result | 幹部に顔と名前を覚えてもらった。 |
| life_events-91 | events[13].choices[1].label | 距離を置いて地元を優先する |
| life_events-92 | events[13].choices[1].result | 自由に動ける身軽さは残った。 |
| life_events-93 | events[14].title | 陳情団 |
| life_events-94 | events[14].text | 地元の商工会の陳情団が上京し、議員会館を訪ねてきた。 |
| life_events-95 | events[14].choices[0].label | 関係する省庁まで同行する |
| life_events-96 | events[14].choices[0].result | 役所の担当者に要望を直接伝えられた。 |
| life_events-97 | events[14].choices[1].label | 会館で話を聞いて要望書を預かる |
| life_events-98 | events[14].choices[1].result | 丁寧に話を聞いた。 |
| life_events-99 | events[15].title | 応援演説の依頼 |
| life_events-100 | events[15].text | 党から隣の県の候補者の応援演説に行ってほしいと頼まれた。 |
| life_events-101 | events[15].choices[0].label | 引き受けて駆けつける |
| life_events-102 | events[15].choices[0].result | 党の幹部から感謝された。 |
| life_events-103 | events[15].choices[1].label | 地元の行事と重なるので断る |
| life_events-104 | events[15].choices[1].result | 地元の行事に出た。 |
| life_events-105 | events[16].title | 政治資金パーティー |
| life_events-106 | events[16].text | 事務所のスタッフから、政治資金パーティーを開きたいと提案があった。 |
| life_events-107 | events[16].choices[0].label | 開く |
| life_events-108 | events[16].choices[0].result | 多くの支援者が集まり、まとまった資金ができた。 |
| life_events-109 | events[16].choices[1].label | 今年は見送る |
| life_events-110 | events[16].choices[1].result | 資金は増えなかったが、批判を受ける心配もない。 |
| life_events-111 | events[17].title | 浪人の暮らし |
| life_events-112 | events[17].text | 議員でない間は収入が少ない。知人から講師や顧問の仕事を紹介された。 |
| life_events-113 | events[17].choices[0].label | 引き受けて生活を立て直す |
| life_events-114 | events[17].choices[0].result | 暮らしは安定したが、地元に出る日は減った。 |
| life_events-115 | events[17].choices[1].label | 断って地元回りを続ける |
| life_events-116 | events[17].choices[1].result | 暮らし向きが苦しくても、その姿を地元の人は見てくれていた。 |
| life_events-117 | events[18].title | 朝の駅頭 |
| life_events-118 | events[18].text | 落選してから、毎朝駅前に立ち続けている。今朝は雨だ。 |
| life_events-119 | events[18].choices[0].label | 傘を差さずに立つ |
| life_events-120 | events[18].choices[0].result | ずぶぬれの姿を見て、足を止めて声をかけてくれる人がいた。 |
| life_events-121 | events[18].choices[1].label | 今日は休む |
| life_events-122 | events[18].choices[1].result | 体を休めた。 |
| life_events-123 | events[19].title | 国会答弁 |
| life_events-124 | events[19].text | 野党の追及が厳しい委員会で所管の問題について答弁に立つことになった。 |
| life_events-125 | events[19].choices[0].label | 自分で答弁を練り上げる |
| life_events-126 | events[19].choices[0].result | 具体的な数字を交えて答え、追及をかわした。 |
| life_events-127 | events[19].choices[1].label | 官僚の答弁書を読み上げる |
| life_events-128 | events[19].choices[1].result | 無難に乗り切った。 |
| life_events-129 | events[19].choices[1].risk.fail_result | 答弁書の読み違えを突かれ、委員会が紛糾した。 |
| life_events-130 | events[20].title | 所管の不祥事 |
| life_events-131 | events[20].text | 所管する役所で統計の不適切な扱いが発覚した。 |
| life_events-132 | events[20].choices[0].label | 自ら記者会見を開いて謝罪する |
| life_events-133 | events[20].choices[0].result | 率直な謝罪が一定の評価を得た。 |
| life_events-134 | events[20].choices[1].label | 事務方に説明を任せる |
| life_events-135 | events[20].choices[1].result | 説明が二転三転し、批判が大臣にも向いた。 |
| life_events-136 | events[21].title | 党内の不穏な動き |
| life_events-137 | events[21].text | 党の幹部への不満を持つ若手が会合を重ねているという話が耳に入った。 |
| life_events-138 | events[21].choices[0].label | 若手を食事に誘って話を聞く |
| life_events-139 | events[21].choices[0].result | 不満の中身が分かり、手を打てた。 |
| life_events-140 | events[21].choices[1].label | 放っておく |
| life_events-141 | events[21].choices[1].result | 不満はくすぶり続けている。 |
| life_events-142 | events[22].title | 首相の決断 |
| life_events-143 | events[22].text | 景気の先行きが不透明だ。経済対策の規模をどうするか、首相として決めなければならない。 |
| life_events-144 | events[22].choices[0].label | 大型の経済対策を打つ |
| life_events-145 | events[22].choices[0].result | 市場は好感したが、財政規律派から批判も出た。 |
| life_events-146 | events[22].choices[1].label | 慎重に様子を見る |
| life_events-147 | events[22].choices[1].result | 大きな動きはなかった。 |
| life_events-148 | events[22].choices[2].label | 国民に直接語りかける |
| life_events-149 | events[22].choices[2].result | 首相の言葉が高い評価を得た。 |
| life_events-150 | events[22].choices[2].risk.fail_result | 言葉が空回りし、かえって批判を浴びた。 |
| life_events-151 | events[23].title | 代表質問 |
| life_events-152 | events[23].text | 野党の党首として、本会議で首相に代表質問をする機会が回ってきた。 |
| life_events-153 | events[23].choices[0].label | 政権の弱点を鋭く突く |
| life_events-154 | events[23].choices[0].result | 首相を答えに詰まらせ、野党の存在感を示した。 |
| life_events-155 | events[23].choices[0].risk.fail_result | 準備不足を見透かされ、逆に首相に言い返された。 |
| life_events-156 | events[23].choices[1].label | 対案を示して論戦を挑む |
| life_events-157 | events[23].choices[1].result | 政策の中身で勝負する姿勢が評価された。 |
| life_events-158 | events[24].title | 家族の誕生日 |
| life_events-159 | events[24].text | 今日は家族の誕生日。忙しい日々の中で、夜の予定をどう調整しようか。 |
| life_events-160 | events[24].choices[0].label | 仕事を切り上げて家で祝う |
| life_events-161 | events[24].choices[0].result | 家族の笑顔に癒やされ、明日への活力が湧いてきた。 |
| life_events-162 | events[24].choices[1].label | {secretary}に花を頼む |
| life_events-163 | events[24].choices[1].result | 花束は喜ばれたが、遅い帰宅に少し寂しそうだった。 |
| life_events-164 | events[24].choices[2].label | 電話でお祝いだけ伝える |
| life_events-165 | events[24].choices[2].result | 声は聞けたが、どこか物足りなさが残った。 |
| life_events-166 | events[25].title | 親の介護の相談 |
| life_events-167 | events[25].text | 実家の親の足腰が弱ってきたと、きょうだいから連絡が入った。 |
| life_events-168 | events[25].choices[0].label | 週末に実家へ帰り話し合う |
| life_events-169 | events[25].choices[0].result | 家族で協力体制を決め、福祉への関心も深まった。 |
| life_events-170 | events[25].choices[1].label | 介護サービスの資料を送る |
| life_events-171 | events[25].choices[1].result | 制度を調べるうちに、現場の課題が見えてきた。 |
| life_events-172 | events[25].choices[2].label | 今は忙しいと返信する |
| life_events-173 | events[25].choices[2].result | 頭では仕方ないと思いつつ、心に引っかかりが残る。 |
| life_events-174 | events[26].title | 子どもの受験 |
| life_events-175 | events[26].text | 子どもが志望校の受験を控えている。家の中も少しピリついた空気だ。 |
| life_events-176 | events[26].choices[0].label | 塾の送り迎えを買って出る |
| life_events-177 | events[26].choices[0].result | 車中での会話が増え、親子の絆が少し深まった。 |
| life_events-178 | events[26].choices[1].label | 夜食を作って応援する |
| life_events-179 | events[26].choices[1].result | 「おいしい」と食べてくれ、ほっと一息ついた。 |
| life_events-180 | events[26].choices[2].label | 静かに部屋で見守る |
| life_events-181 | events[26].choices[2].result | 子どもを信じて待ち、自分も政策の勉強に集中した。 |
| life_events-182 | events[27].title | 迷い犬の保護 |
| life_events-183 | events[27].text | 朝の散歩中、首輪をつけた迷い犬が足元に寄ってきた。どうしようか。 |
| life_events-184 | events[27].choices[0].label | 交番へ連れて行き飼い主を待つ |
| life_events-185 | events[27].choices[0].result | 無事に飼い主が見つかり、近所で評判になった。 |
| life_events-186 | events[27].choices[1].label | ネットで飼い主を探してみる |
| life_events-187 | events[27].choices[1].result | 多くの人が拡散してくれ、その日のうちに無事戻った。 |
| life_events-188 | events[27].choices[1].risk.fail_result | なかなか情報が広がらず、結局保健所へ連絡した。 |
| life_events-189 | events[28].title | 手料理への挑戦 |
| life_events-190 | events[28].text | たまには自分で夕食を作ろうと思い立ち、スーパーで食材を買い込んだ。 |
| life_events-191 | events[28].choices[0].label | 凝った煮込み料理に挑戦する |
| life_events-192 | events[28].choices[0].result | 時間をかけた甲斐があり、家族から大絶賛された。 |
| life_events-193 | events[28].choices[0].risk.fail_result | 焦がしてしまい、結局出前を頼む羽目になった。 |
| life_events-194 | events[28].choices[1].label | 得意のカレーをたっぷり作る |
| life_events-195 | events[28].choices[1].result | 安定の味に身も心も温まり、しっかり英気を養った。 |
| life_events-196 | events[29].title | 事務所兼自宅の引越し |
| life_events-197 | events[29].text | 手狭になったため、少し広い家へ引っ越すことになった。荷造りが大変だ。 |
| life_events-198 | events[29].choices[0].label | 支援者に手伝いを頼む |
| life_events-199 | events[29].choices[0].result | 和気あいあいと作業が進み、仲間との結束が強まった。 |
| life_events-200 | events[29].choices[1].label | 業者にすべて任せて休む |
| life_events-201 | events[29].choices[1].result | 出費は痛かったが、おかげで体力を温存できた。 |
| life_events-202 | events[29].choices[2].label | 自力でコツコツ運ぶ |
| life_events-203 | events[29].choices[2].result | 全身筋肉痛になったが、いい体力づくりになった。 |
| life_events-204 | events[30].title | 懐かしい同窓会 |
| life_events-205 | events[30].text | 学生時代の同窓会の案内が届いた。地元を離れた旧友も集まるらしい。 |
| life_events-206 | events[30].choices[0].label | 顔を出して旧交を温める |
| life_events-207 | events[30].choices[0].result | 気のおけない仲間と語り合い、新たな人脈も広がった。 |
| life_events-208 | events[30].choices[0].risk.fail_result | 選挙の話ばかりしてしまい、場が白けてしまった。 |
| life_events-209 | events[30].choices[1].label | 祝電だけ打って欠席する |
| life_events-210 | events[30].choices[1].result | 少し寂しいが、その分ほかの仕事に時間を使った。 |
| life_events-211 | events[31].title | スポーツクラブの練習会 |
| life_events-212 | events[31].text | 休日に地元のスポーツクラブが練習会を開く。参加を勧められた。 |
| life_events-213 | events[31].choices[0].label | 選手に混じって一緒に走る |
| life_events-214 | events[31].choices[0].result | 息は上がったが、清々しい汗をかき顔も覚えてもらえた。 |
| life_events-215 | events[31].choices[1].label | 給水所で水を配って応援する |
| life_events-216 | events[31].choices[1].result | ランナーたちにお礼を言われ、地域との一体感を得た。 |
| life_events-217 | events[31].choices[2].label | 見学だけして挨拶する |
| life_events-218 | events[31].choices[2].result | 無理せず軽く顔を出し、穏やかな休日を過ごした。 |
| life_events-219 | events[32].title | 突然の歯痛 |
| life_events-220 | events[32].text | 朝から奥歯がズキズキと痛む。演説にも差し支えそうなほどだ。 |
| life_events-221 | events[32].choices[0].label | 予定を空けて歯医者へ走る |
| life_events-222 | events[32].choices[0].result | 早めに治療してもらい、痛みから解放されてすっきり。 |
| life_events-223 | events[32].choices[1].label | 痛み止めを飲んで我慢する |
| life_events-224 | events[32].choices[1].result | 痛みをこらえながらの活動で、どっと疲れが出た。 |
| life_events-225 | events[33].title | 洗濯機の故障 |
| life_events-226 | events[33].text | 自宅の洗濯機が変な音を立てて止まった。洗濯物が山積みになっている。 |
| life_events-227 | events[33].choices[0].label | 地元の家電店で買い替える |
| life_events-228 | events[33].choices[0].result | 店主が「応援してます」と割引してくれ、話も弾んだ。 |
| life_events-229 | events[33].choices[1].label | 自分で修理を試みる |
| life_events-230 | events[33].choices[1].result | 原因を突き止めて見事復活。達成感を味わった。 |
| life_events-231 | events[33].choices[1].risk.fail_result | 床が水浸しになり、結局業者を呼ぶことになった。 |
| life_events-232 | events[34].title | 古書店での発見 |
| life_events-233 | events[34].text | 移動の合間に立ち寄った古書店で、興味深い政治史の本を見つけた。 |
| life_events-234 | events[34].choices[0].label | 買って徹夜で読みふける |
| life_events-235 | events[34].choices[0].result | 睡眠不足だが、先人たちの知恵に大いに刺激を受けた。 |
| life_events-236 | events[34].choices[1].label | 買って移動中に少しずつ読む |
| life_events-237 | events[34].choices[1].result | 良い気分転換になり、政策のヒントも得られた。 |
| life_events-238 | events[34].choices[2].label | 立ち読みだけで済ませる |
| life_events-239 | events[34].choices[2].result | 要点だけ頭に入れ、財布の紐を締めた。 |
| life_events-240 | events[35].title | 話し方教室の案内 |
| life_events-241 | events[35].text | 家族から「早口で聞き取りにくい時がある」と指摘された。直す好機だ。 |
| life_events-242 | events[35].choices[0].label | 専門のボイトレに通ってみる |
| life_events-243 | events[35].choices[0].result | 発声の基礎を学び、悪い癖が抜けて通る声になった。 |
| life_events-244 | events[35].choices[1].label | 家族の前で練習して直してもらう |
| life_events-245 | events[35].choices[1].result | 照れくさかったが、温かい指摘で聞きやすくなった。 |
| life_events-246 | events[35].choices[2].label | 個性だと思って気にしない |
| life_events-247 | events[35].choices[2].result | 勢いだけは誰にも負けないと割り切った。 |
| life_events-248 | events[36].title | ジムへの入会案内 |
| life_events-249 | events[36].text | 駅前に新しいスポーツジムができた。秘書からも体力づくりを勧められた。 |
| life_events-250 | events[36].choices[0].label | 本格的に通い詰めて鍛える |
| life_events-251 | events[36].choices[0].result | 見違えるほど体が引き締まり、タフに動けるようになった。 |
| life_events-252 | events[36].choices[1].label | 週一回のペースで無理なく通う |
| life_events-253 | events[36].choices[1].result | 体調が整い、以前より風邪を引きにくくなった。 |
| life_events-254 | events[36].choices[2].label | チラシだけもらって帰る |
| life_events-255 | events[36].choices[2].result | いつか行こうと思いながら、引き出しにしまった。 |
| life_events-256 | events[37].title | 配偶者のため息 |
| life_events-257 | events[37].text | 「最近、家にいても電話ばかり」と配偶者がぽつりとこぼした。 |
| life_events-258 | events[37].choices[0].label | 電話を切り食事に誘う |
| life_events-259 | events[37].choices[0].result | 久しぶりのゆっくりした食事で、笑顔が戻った。 |
| life_events-260 | events[37].choices[1].label | 次の選挙までと頭を下げる |
| life_events-261 | events[37].choices[1].result | 理解はしてくれたものの、胸が少し痛んだ。 |
| life_events-262 | events[37].choices[2].label | 政治の愚痴を聞いてもらう |
| life_events-263 | events[37].choices[2].result | 話を聞いてもらい、少し心が軽くなった。 |
| life_events-264 | events[37].choices[2].risk.fail_result | 逆に説教されてしまい、余計に気まずくなった。 |
| life_events-265 | events[38].title | ヨレヨレのスーツ |
| life_events-266 | events[38].text | 鏡を見ると、毎日着ているスーツの袖口がすり切れているのに気づいた。 |
| life_events-267 | events[38].choices[0].label | 地元の洋品店で新調する |
| life_events-268 | events[38].choices[0].result | ぴったりの仕立てで、街を歩く姿も引き締まった。 |
| life_events-269 | events[38].choices[1].label | 量販店で安いのをまとめ買い |
| life_events-270 | events[38].choices[1].result | 出費を抑えつつ清潔感を保てて満足だ。 |
| life_events-271 | events[38].choices[2].label | クリーニングに出して粘る |
| life_events-272 | events[38].choices[2].result | 節約の鬼に徹し、資金を温存した。 |
| life_events-273 | events[39].title | 成人のつどい |
| life_events-274 | events[39].text | 今日は地元の成人のつどい。晴れ着姿の若者たちが会場に集まっている。 |
| life_events-275 | events[39].choices[0].label | 会場前で若者たちに声をかける |
| life_events-276 | events[39].choices[0].result | 写真撮影にも応じ、若い世代への良いアピールになった。 |
| life_events-277 | events[39].choices[0].risk.fail_result | 誰だか分かられず、ビラを受け取ってもらえなかった。 |
| life_events-278 | events[39].choices[1].label | 式典に参列して祝辞を聞く |
| life_events-279 | events[39].choices[1].result | 来賓の県議や地元の有力者と挨拶を交わせた。 |
| life_events-280 | events[40].title | 地元の節分祭 |
| life_events-281 | events[40].text | 地元の神社から、節分祭の豆まきに参加してほしいと声がかかった。 |
| life_events-282 | events[40].choices[0].label | 元気に檀上から豆をまく |
| life_events-283 | events[40].choices[0].result | 「福は内！」の掛け声で、子どもも大人も大喜びだった。 |
| life_events-284 | events[40].choices[0].risk.fail_result | 自分の周りだけ人が少なく、少し寂しい思いをした。 |
| life_events-285 | events[40].choices[1].label | 観客に混じって豆を拾う |
| life_events-286 | events[40].choices[1].result | 気さくな人柄が伝わり、隣の人と笑顔で話せた。 |
| life_events-287 | events[41].title | 春の河川敷清掃 |
| life_events-288 | events[41].text | 雪解けの季節になり、町内会総出で河川敷のゴミ拾いが行われる。 |
| life_events-289 | events[41].choices[0].label | 朝から参加して汗を流す |
| life_events-290 | events[41].choices[0].result | 泥だらけになって働き、町内会長から信頼を得た。 |
| life_events-291 | events[41].choices[1].label | 差し入れの飲み物を届ける |
| life_events-292 | events[41].choices[1].result | 冷たいお茶が喜ばれ、感謝の言葉をもらった。 |
| life_events-293 | events[41].choices[2].label | {secretary}だけ行かせる |
| life_events-294 | events[41].choices[2].result | 「本人は忙しいのか」と少し不満そうにされた。 |
| life_events-295 | events[42].title | 桜の名所でお花見 |
| life_events-296 | events[42].text | 満開の桜の下、商店街の人たちが花見の席を開いているのに出くわした。 |
| life_events-297 | events[42].choices[0].label | 輪に加わって一緒に語り合う |
| life_events-298 | events[42].choices[0].result | 美しい桜の下で本音を聞き出し、ぐっと距離が縮まった。 |
| life_events-299 | events[42].choices[0].risk.fail_result | 飲みすぎてしまい、余計な冗談で場を凍らせた。 |
| life_events-300 | events[42].choices[1].label | 挨拶だけしてその場を離れる |
| life_events-301 | events[42].choices[1].result | 礼儀正しく顔を出し、印象を損ねずに済んだ。 |
| life_events-302 | events[43].title | 連休の観光地PR |
| life_events-303 | events[43].text | 大型連休で地元の観光スポットが賑わっている。駅前も人通りが多い。 |
| life_events-304 | events[43].choices[0].label | 駅前で観光案内を手伝う |
| life_events-305 | events[43].choices[0].result | 観光客にも地元の人にも感謝され、好感度が上がった。 |
| life_events-306 | events[43].choices[1].label | 家族サービスにあてる |
| life_events-307 | events[43].choices[1].result | 近場へ出かけてリフレッシュし、英気を養えた。 |
| life_events-308 | events[44].title | 梅雨の長雨と水路 |
| life_events-309 | events[44].text | 梅雨入りしてから強い雨が続く。低地の水路があふれないか心配だ。 |
| life_events-310 | events[44].choices[0].label | 長靴で危険箇所を見回る |
| life_events-311 | events[44].choices[0].result | 傘を差して歩く姿に、住民から安心の声が上がった。 |
| life_events-312 | events[44].choices[1].label | 役所の担当課に状況を確認する |
| life_events-313 | events[44].choices[1].result | 県議とも連携し、素早く対策の手配ができた。 |
| life_events-314 | events[44].choices[1].risk.fail_result | 担当者のたらい回しに遭い、話が進まなかった。 |
| life_events-315 | events[44].choices[2].label | 事務所で様子を見守る |
| life_events-316 | events[44].choices[2].result | 幸い大きな被害は出ず、雨が止むのを待った。 |
| life_events-317 | events[45].title | 夏の花火大会 |
| life_events-318 | events[45].text | 河川敷で恒例の花火大会が開かれる。多くの有権者が集まる大イベントだ。 |
| life_events-319 | events[45].choices[0].label | 浴衣姿で会場を練り歩く |
| life_events-320 | events[45].choices[0].result | 祭りの熱気の中、たくさんの人と握手を交わせた。 |
| life_events-321 | events[45].choices[0].risk.fail_result | 暗闇と人混みで誰にも気づかれず、疲れただけだった。 |
| life_events-322 | events[45].choices[1].label | 協賛金を出して本部席に座る |
| life_events-323 | events[45].choices[1].result | 地域の重鎮たちと肩を並べて花火を見上げた。 |
| life_events-324 | events[45].choices[2].label | 翌朝のゴミ拾いに参加する |
| life_events-325 | events[45].choices[2].result | 地味だが誠実な行動が、支援者の心を打った。 |
| life_events-326 | events[46].title | お盆の挨拶回り |
| life_events-327 | events[46].text | お盆休みで帰省客が地元に戻ってきている。街の空気もどこか穏やかだ。 |
| life_events-328 | events[46].choices[0].label | 支援者の家を一軒ずつ回る |
| life_events-329 | events[46].choices[0].result | 帰省中の若い家族にも会え、票の掘り起こしができた。 |
| life_events-330 | events[46].choices[1].label | 家族とゆっくり墓参りをする |
| life_events-331 | events[46].choices[1].result | ご先祖様に手を合わせ、穏やかな気持ちになった。 |
| life_events-332 | events[47].title | 地域の敬老会 |
| life_events-333 | events[47].text | 公民館で敬老会が開かれる。お年寄りたちの前で一言挨拶を頼まれた。 |
| life_events-334 | events[47].choices[0].label | 福祉への熱い思いを語る |
| life_events-335 | events[47].choices[0].result | 分かりやすい話が好評で、大きな拍手が起きた。 |
| life_events-336 | events[47].choices[0].risk.fail_result | 話が長すぎて、会場から小さなため息が漏れた。 |
| life_events-337 | events[47].choices[1].label | 昔の歌を一緒に歌う |
| life_events-338 | events[47].choices[1].result | 手拍子が広がり、和やかな雰囲気に包まれた。 |
| life_events-339 | events[48].title | 町内対抗の運動会 |
| life_events-340 | events[48].text | 秋晴れの下、小学校のグラウンドで町内会対抗の運動会が開かれている。 |
| life_events-341 | events[48].choices[0].label | リレーや玉入れに本気で出る |
| life_events-342 | events[48].choices[0].result | 転びながらも全力で走り、会場のヒーローになった。 |
| life_events-343 | events[48].choices[0].risk.fail_result | 気合が入りすぎてバトンを落とし、最下位になった。 |
| life_events-344 | events[48].choices[1].label | 応援席で声を張り上げる |
| life_events-345 | events[48].choices[1].result | 町内の人たちと一緒に盛り上がり、親睦が深まった。 |
| life_events-346 | events[49].title | 紅葉まつりの賑わい |
| life_events-347 | events[49].text | 地元の山が紅葉し、観光客で賑わう季節になった。商工会が物産展を開く。 |
| life_events-348 | events[49].choices[0].label | 地元の名産品をSNSでPR |
| life_events-349 | events[49].choices[0].result | 発信を見た人が足を運んでくれ、商工会から感謝された。 |
| life_events-350 | events[49].choices[1].label | 名産品を買い込んで応援する |
| life_events-351 | events[49].choices[1].result | 地元商店が喜び、事務所のみんなにも好評だった。 |
| life_events-352 | events[50].title | 師走の忘年会ラッシュ |
| life_events-353 | events[50].text | 町内会や業界団体の忘年会が毎晩のように重なり、体がいくつあっても足りない。 |
| life_events-354 | events[50].choices[0].label | すべての会場に顔を出して回る |
| life_events-355 | events[50].choices[0].result | 胃腸は悲鳴を上げたが、地元での存在感は抜群になった。 |
| life_events-356 | events[50].choices[1].label | 義理の深い会だけに絞る |
| life_events-357 | events[50].choices[1].result | 無理のない範囲で付き合い、うまく年を越せそうだ。 |
| life_events-358 | events[50].choices[2].label | {secretary}に代理を頼む |
| life_events-359 | events[50].choices[2].result | 代理ばかりではと、一部の会合で苦言を呈された。 |
| life_events-360 | events[51].title | 商店街の御用聞き |
| life_events-361 | events[51].text | シャッターが増えた地元の商店街。店主たちの本音を聞きに出かけよう。 |
| life_events-362 | events[51].choices[0].label | 一軒ずつ店に入り話を聞く |
| life_events-363 | events[51].choices[0].result | 地道な歩き回りが評価され、ドブ板選挙のコツを掴んだ。 |
| life_events-364 | events[51].choices[1].label | 買い物しながら世間話をする |
| life_events-365 | events[51].choices[1].result | 気さくな買い物客として、店先で笑顔を交わせた。 |
| life_events-366 | events[52].title | 消防団の激励 |
| life_events-367 | events[52].text | 地元の消防団が早朝から訓練に励んでいる。週末には大会も控えているそうだ。 |
| life_events-368 | events[52].choices[0].label | 早起きして見学と激励に行く |
| life_events-369 | events[52].choices[0].result | 寒い中での訪問が喜ばれ、団員たちと強い絆ができた。 |
| life_events-370 | events[52].choices[1].label | 団員たちの要望を聞き取る |
| life_events-371 | events[52].choices[1].result | 装備や待遇の課題を把握し、政策の種が見つかった。 |
| life_events-372 | events[52].choices[1].risk.fail_result | 現場の専門用語が分からず、話が噛み合わなかった。 |
| life_events-373 | events[53].title | 小学校のPTA相談 |
| life_events-374 | events[53].text | 通学路の安全対策について、PTAの保護者たちから相談を受けた。 |
| life_events-375 | events[53].choices[0].label | 通学路を一緒に歩いて点検する |
| life_events-376 | events[53].choices[0].result | 危険箇所を一緒に確認し、母親たちの信頼を得た。 |
| life_events-377 | events[53].choices[1].label | 行政への橋渡しを約束する |
| life_events-378 | events[53].choices[1].result | 県議と市役所に掛け合い、ガードレール設置が決まった。 |
| life_events-379 | events[53].choices[1].risk.fail_result | 縦割り行政の壁に阻まれ、話が前に進まなかった。 |
| life_events-380 | events[54].title | 町工場の現場視察 |
| life_events-381 | events[54].text | 地元の部品メーカーの社長から「現場の苦労を見てほしい」と招かれた。 |
| life_events-382 | events[54].choices[0].label | 作業着を借りて現場を体験する |
| life_events-383 | events[54].choices[0].result | 職人たちの技術に感動し、中小企業支援のヒントを得た。 |
| life_events-384 | events[54].choices[1].label | 社長とじっくり経営談義をする |
| life_events-385 | events[54].choices[1].result | 資金繰りの実情を学び、経営者仲間の紹介も受けた。 |
| life_events-386 | events[54].choices[1].risk.fail_result | 数字の感覚が甘いと思われ、話が浅く終わってしまった。 |
| life_events-387 | events[55].title | 台風一過の後片付け |
| life_events-388 | events[55].text | 昨夜の台風で、地元の道路に折れた枝やトタンが散乱している。 |
| life_events-389 | events[55].choices[0].label | 軍手をはめて撤去作業を手伝う |
| life_events-390 | events[55].choices[0].result | 泥にまみれて片付けを手伝い、住民から大いに感謝された。 |
| life_events-391 | events[55].choices[1].label | 災害相談の窓口を案内する |
| life_events-392 | events[55].choices[1].result | 的確な助言が役に立ち、行政との連携もスムーズだった。 |
| life_events-393 | events[55].choices[1].risk.fail_result | 制度を間違えて伝えてしまい、混乱を招いた。 |
| life_events-394 | events[56].title | 支援者の通夜 |
| life_events-395 | events[56].text | 長年応援してくれていた町内会の重鎮が亡くなった。通夜の連絡が入る。 |
| life_events-396 | events[56].choices[0].label | 予定を変更して通夜に参列する |
| life_events-397 | events[56].choices[0].result | 遺族に深く感謝され、生前の支援に報いることができた。 |
| life_events-398 | events[56].choices[1].label | 弔電を送り後日墓参りする |
| life_events-399 | events[56].choices[1].result | 遅れても手を合わせに行き、義理を果たせた。 |
| life_events-400 | events[57].title | 地方紙の投稿欄 |
| life_events-401 | events[57].text | 地元紙の読者欄に、地域の交通不便を訴える切実な投稿が載っていた。 |
| life_events-402 | events[57].choices[0].label | バス会社と町内会に話を聞く |
| life_events-403 | events[57].choices[0].result | 問題の背景を丁寧に取材し、記者からも一目置かれた。 |
| life_events-404 | events[57].choices[1].label | 自分のSNSで問題提起する |
| life_events-405 | events[57].choices[1].result | 地域の声がネット上で広がり、注目を集めることができた。 |
| life_events-406 | events[57].choices[1].risk.fail_result | 的外れなコメントが炎上し、評判を落としてしまった。 |
| life_events-407 | events[58].title | 老人クラブの茶話会 |
| life_events-408 | events[58].text | 公民館の茶話会に顔を出したら、お年寄りたちから歌を一曲せがまれた。 |
| life_events-409 | events[58].choices[0].label | 照れずに十八番を熱唱する |
| life_events-410 | events[58].choices[0].result | 堂々たる歌いっぷりに大喝采。ファンが一気に増えた。 |
| life_events-411 | events[58].choices[0].risk.fail_result | 音程が外れまくり、苦笑いで拍手されてしまった。 |
| life_events-412 | events[58].choices[1].label | 聞き役に徹してお茶を注ぐ |
| life_events-413 | events[58].choices[1].result | 昔話に笑顔で相槌を打ち、穏やかに距離を縮めた。 |
| life_events-414 | events[59].title | 若手経営者との対話 |
| life_events-415 | events[59].text | 地元の若手経営者たちが集まり、町の将来について語り合う場を設けた。 |
| life_events-416 | events[59].choices[0].label | 遅くまで本音で意見を交わす |
| life_events-417 | events[59].choices[0].result | 現場の切実な声を吸収し、住民目線の感覚が磨かれた。 |
| life_events-418 | events[59].choices[1].label | 自分の政策案をプレゼンする |
| life_events-419 | events[59].choices[1].result | 具体案に納得の声が多く、頼もしい仲間が増えた。 |
| life_events-420 | events[59].choices[1].risk.fail_result | 現場感がないと反論され、議論が噛み合わなかった。 |
| life_events-421 | events[60].title | 農村部の獣害対策 |
| life_events-422 | events[60].text | 山間部の集落から「イノシシに畑を荒らされて困っている」と連絡が入った。 |
| life_events-423 | events[60].choices[0].label | 現地を見て防護柵の設置を動く |
| life_events-424 | events[60].choices[0].result | 素早い対応に農家の人々が喜び、強い支持を得た。 |
| life_events-425 | events[60].choices[0].risk.fail_result | 予算の壁に阻まれ、設置が先送りになってしまった。 |
| life_events-426 | events[60].choices[1].label | 猟友会のベテランに相談する |
| life_events-427 | events[60].choices[1].result | 野生動物の生態と現実的な対策を深く学べた。 |
| life_events-428 | events[61].title | 公認をめぐる綱引き |
| life_events-429 | events[61].text | 党の公認枠をめぐり、別の有力候補も名乗りを上げた。党支部の空気は微妙だ。 |
| life_events-430 | events[61].choices[0].label | 県議たちに頭を下げて回る |
| life_events-431 | events[61].choices[0].result | 地道な誠意が伝わり、県議団からの推薦を取り付けた。 |
| life_events-432 | events[61].choices[0].risk.fail_result | 根回し不足を見透かされ、冷たくあしらわれた。 |
| life_events-433 | events[61].choices[1].label | 街頭演説の実績で勝負する |
| life_events-434 | events[61].choices[1].result | 聴衆の熱気を見た党本部が、実力を認めてくれた。 |
| life_events-435 | events[62].title | 二連ポスター貼り |
| life_events-436 | events[62].text | 雨上がり、剥がれかけた政治活動用のポスターを貼り替える作業が残っている。 |
| life_events-437 | events[62].choices[0].label | {secretary}と二人で回る |
| life_events-438 | events[62].choices[0].result | 息の合った作業で一気に片付き、仲も深まった。 |
| life_events-439 | events[62].choices[1].label | 支援者の壁を借りて新規開拓 |
| life_events-440 | events[62].choices[1].result | 交渉が実り、目立つ角地に新しいポスターが増えた。 |
| life_events-441 | events[62].choices[1].risk.fail_result | 断られ続けて心が折れそうになり、疲れだけが残った。 |
| life_events-442 | events[62].choices[2].label | 業者に貼り替えを依頼する |
| life_events-443 | events[62].choices[2].result | 資金は減ったが、美しい状態で維持できた。 |
| life_events-444 | events[63].title | 家計簿と家族の不安 |
| life_events-445 | events[63].text | 政治活動で貯金が減る一方だ。家族が家計簿を見ながら不安そうにしている。 |
| life_events-446 | events[63].choices[0].label | 必ず結果を出そうと誓い合う |
| life_events-447 | events[63].choices[0].result | 家族の覚悟に触れ、迷いが吹き飛んだ。 |
| life_events-448 | events[63].choices[1].label | 身の回りの節約を徹底する |
| life_events-449 | events[63].choices[1].result | 無駄を削り出し、少しでも活動資金を捻出した。 |
| life_events-450 | events[63].choices[2].label | 生活費のため私物を売る |
| life_events-451 | events[63].choices[2].result | 大切にしていた趣味の品を手放し、資金を作った。 |
| life_events-452 | events[64].title | 同じ浪人仲間との酒 |
| life_events-453 | events[64].text | 前回の選挙で惜敗した他県の元議員から「情報交換しよう」と誘われた。 |
| life_events-454 | events[64].choices[0].label | 敗因を語り合い再起を誓う |
| life_events-455 | events[64].choices[0].result | 苦労がわかる者同士で励まし合い、元気が湧いた。 |
| life_events-456 | events[64].choices[1].label | 相手の選挙戦術を聞き出す |
| life_events-457 | events[64].choices[1].result | 他県の事情を知り、次の戦いに活かせる知恵を得た。 |
| life_events-458 | events[65].title | 後援会の動揺 |
| life_events-459 | events[65].text | 落選後、後援会の若手メンバーが「次の選挙まで待てない」と離れかけている。 |
| life_events-460 | events[65].choices[0].label | 直接会って熱意を伝える |
| life_events-461 | events[65].choices[0].result | 本気の覚悟が伝わり、もう一度ついていくと約束してくれた。 |
| life_events-462 | events[65].choices[0].risk.fail_result | 引き留めに失敗し、数名が会を抜けてしまった。 |
| life_events-463 | events[65].choices[1].label | 青年部の運営を任せてみる |
| life_events-464 | events[65].choices[1].result | 責任を持たせたことで、彼らにやる気が戻ってきた。 |
| life_events-465 | events[66].title | 手作りの政策ビラ |
| life_events-466 | events[66].text | 自分の考えを知ってもらうため、政策ビラを自作して駅前で配ることにした。 |
| life_events-467 | events[66].choices[0].label | 熱い演説と共に毎日配り切る |
| life_events-468 | events[66].choices[0].result | 街頭で立ち止まる人が増え、辻説法の感覚を掴んだ。 |
| life_events-469 | events[66].choices[1].label | デザインに凝りSNSにも載せる |
| life_events-470 | events[66].choices[1].result | 見やすい図解が好評で、政策への関心が高まった。 |
| life_events-471 | events[66].choices[1].risk.fail_result | 文字が多すぎて読みづらく、受け取ってもらえなかった。 |
| life_events-472 | events[67].title | カルチャー講座の講師 |
| life_events-473 | events[67].text | 地元のカルチャースクールから、政治の仕組みを解説する講座を頼まれた。 |
| life_events-474 | events[67].choices[0].label | 丁寧な資料を作り全力で話す |
| life_events-475 | events[67].choices[0].result | 分かりやすい解説が評判になり、謝礼ももらえた。 |
| life_events-476 | events[67].choices[0].risk.fail_result | 専門用語を並べすぎて、受講生が眠そうにしていた。 |
| life_events-477 | events[67].choices[1].label | 質疑応答中心で気楽にこなす |
| life_events-478 | events[67].choices[1].result | 市民の素朴な疑問に触れ、いい勉強になった。 |
| life_events-479 | events[68].title | 小さな事務所開き |
| life_events-480 | events[68].text | プレハブを借りて個人事務所を開いた。支援者や記者が数人集まっている。 |
| life_events-481 | events[68].choices[0].label | 決意表明を力強くぶち上げる |
| life_events-482 | events[68].choices[0].result | 気迫のこもった挨拶に、会場が熱気に包まれた。 |
| life_events-483 | events[68].choices[0].risk.fail_result | 緊張で声が裏返り、迫力に欠けてしまった。 |
| life_events-484 | events[68].choices[1].label | 来場者一人ひとりと握手する |
| life_events-485 | events[68].choices[1].result | 感謝の気持ちを直接伝え、支援の輪が広がった。 |
| life_events-486 | events[69].title | 議員宿舎の夜 |
| life_events-487 | events[69].text | 国会会期中、東京の議員宿舎で一人カップ麺をすする。ふと地元を思い出す。 |
| life_events-488 | events[69].choices[0].label | 地元の支援者に近況を電話する |
| life_events-489 | events[69].choices[0].result | 「体には気をつけて」と温かい言葉を掛けられた。 |
| life_events-490 | events[69].choices[1].label | 翌日の法案資料を読み込む |
| life_events-491 | events[69].choices[1].result | 論点が整理でき、国会での議論に自信がついた。 |
| life_events-492 | events[69].choices[2].label | 今夜は早く寝て体力を回復する |
| life_events-493 | events[69].choices[2].result | ぐっすり眠り、翌朝すっきりと目覚めた。 |
| life_events-494 | events[70].title | 委員会の海外視察 |
| life_events-495 | events[70].text | 所属委員会で海外視察の話が持ち上がった。ただし世論の目も厳しい。 |
| life_events-496 | events[70].choices[0].label | 参加して現地の制度を学ぶ |
| life_events-497 | events[70].choices[0].result | 充実した報告書をまとめ、政策に活かすことができた。 |
| life_events-498 | events[70].choices[0].risk.fail_result | 「税金で物見遊山」と地元紙に厳しく叩かれた。 |
| life_events-499 | events[70].choices[1].label | 地元対応を優先して辞退する |
| life_events-500 | events[70].choices[1].result | 堅実な姿勢が地元で評価されたが、党内では少し浮いた。 |
| life_events-501 | events[71].title | 怪しい献金の打診 |
| life_events-502 | events[71].text | 見知らぬ人物が事務所を訪れ「表に出ない形で資金を用意できる」と囁いた。 |
| life_events-503 | events[71].choices[0].label | きっぱりと断り追い返す |
| life_events-504 | events[71].choices[0].result | 甘い誘いを退け、クリーンな政治姿勢を守り抜いた。 |
| life_events-505 | events[71].choices[1].label | 内密に受け取ってしまう |
| life_events-506 | events[71].choices[1].result | 後日違法献金が発覚し、巨額の返金と謝罪に追われた。 |
| life_events-507 | events[71].choices[2].label | {secretary}に記録させ通報 |
| life_events-508 | events[71].choices[2].result | 毅然とした対応が称賛され、関係各所から信頼を得た。 |
| life_events-509 | events[72].title | 党の部会での激論 |
| life_events-510 | events[72].text | 党の部会で、地元の利益と国益がぶつかる法案について激しい議論になった。 |
| life_events-511 | events[72].choices[0].label | 地元の反対意見を堂々と主張 |
| life_events-512 | events[72].choices[0].result | 筋を通す姿勢が評価され、地元の期待に応えられた。 |
| life_events-513 | events[72].choices[0].risk.fail_result | 感情的な反論になり、党の重鎮から冷ややかな目で見られた。 |
| life_events-514 | events[72].choices[1].label | 妥協点を探りながら根回しする |
| life_events-515 | events[72].choices[1].result | 双方の顔を立てる修正案をまとめ、党内で評価された。 |
| life_events-516 | events[72].choices[2].label | 空気を読んで賛成に回る |
| life_events-517 | events[72].choices[2].result | 波風は立たなかったが、後援会からは不満が漏れた。 |
| life_events-518 | events[73].title | 地元校の国会見学 |
| life_events-519 | events[73].text | 地元の中学生たちが修学旅行で国会議事堂に見学に来た。案内を頼まれている。 |
| life_events-520 | events[73].choices[0].label | 合間を縫って直接案内する |
| life_events-521 | events[73].choices[0].result | 生徒たちの目が輝き、保護者たちにも評判が広がった。 |
| life_events-522 | events[73].choices[1].label | 議事堂前で記念撮影だけする |
| life_events-523 | events[73].choices[1].result | 短い時間だったが、先生と生徒に笑顔で挨拶できた。 |
| life_events-524 | events[73].choices[2].label | {secretary}に案内を任せる |
| life_events-525 | events[73].choices[2].result | 「忙しいから仕方ないね」と少し残念そうにされた。 |
| life_events-526 | events[74].title | 討論番組への出演 |
| life_events-527 | events[74].text | 週末のテレビの討論番組に、議員代表の一人として出演してほしいと依頼が来た。 |
| life_events-528 | events[74].choices[0].label | 鋭い論理で相手をやり込める |
| life_events-529 | events[74].choices[0].result | 切れ味のある弁論が評判を呼び、名前が一気に広まった。 |
| life_events-530 | events[74].choices[0].risk.fail_result | 言葉尻を捉えられて炎上し、イメージを損ねてしまった。 |
| life_events-531 | events[74].choices[1].label | 穏健な解説に徹してまとめる |
| life_events-532 | events[74].choices[1].result | 落ち着いた語り口で、幅広い層に安心感を与えた。 |
| life_events-533 | events[75].title | 秘書の引き抜き話 |
| life_events-534 | events[75].text | 他の議員事務所から、優秀な{secretary}を引き抜こうとしている噂を聞いた。 |
| life_events-535 | events[75].choices[0].label | 待遇を上げて労をねぎらう |
| life_events-536 | events[75].choices[0].result | 「先生についていきます」と力強く言ってくれた。 |
| life_events-537 | events[75].choices[1].label | 今後の夢を語り引き留める |
| life_events-538 | events[75].choices[1].result | 熱意が通じ、これからも二人三脚で歩むと誓い合った。 |
| life_events-539 | events[75].choices[1].risk.fail_result | 言葉だけでは響かず、少し距離を置かれてしまった。 |
| life_events-540 | events[76].title | 廊下でのぶら下がり |
| life_events-541 | events[76].text | 本会議を終えて廊下に出ると、記者たちがマイクを向けて一斉に囲んできた。 |
| life_events-542 | events[76].choices[0].label | 記者の目を見て明快に答える |
| life_events-543 | events[76].choices[0].result | 分かりやすい一言が夕方のニュースで取り上げられた。 |
| life_events-544 | events[76].choices[0].risk.fail_result | 誘導尋問に引っかかり、失言扱いされてしまった。 |
| life_events-545 | events[76].choices[1].label | コメントを控え足早に去る |
| life_events-546 | events[76].choices[1].result | 失言は防いだが、記者からは少し渋い顔をされた。 |
| life_events-547 | events[77].title | 議員立法の勉強会 |
| life_events-548 | events[77].text | 志を同じくする議員仲間から、新しい議員立法の共同提案者に誘われた。 |
| life_events-549 | events[77].choices[0].label | 徹夜で条文の検討に加わる |
| life_events-550 | events[77].choices[0].result | 法制局との折衝をやり遂げ、政策通として成長した。 |
| life_events-551 | events[77].choices[0].risk.fail_result | 法案の穴を指摘され、修正作業に追われて疲弊した。 |
| life_events-552 | events[77].choices[1].label | 名前だけ連ねて資金を出す |
| life_events-553 | events[77].choices[1].result | 勉強会への協力に感謝され、議員間の繋がりができた。 |
| life_events-554 | events[77].choices[2].label | 時期尚早と見送る |
| life_events-555 | events[77].choices[2].result | 無理に背伸びせず、自分の担当分野に注力した。 |
| life_events-556 | events[78].title | 官僚たちの抵抗 |
| life_events-557 | events[78].text | 大臣として新しい改革案を示したが、省庁の幹部たちが「前例がない」と渋っている。 |
| life_events-558 | events[78].choices[0].label | データを突きつけ決断を迫る |
| life_events-559 | events[78].choices[0].result | 大臣のリーダーシップに官僚も折れ、改革が前進した。 |
| life_events-560 | events[78].choices[0].risk.fail_result | 官僚の理屈に言い負かされ、案が骨抜きになった。 |
| life_events-561 | events[78].choices[1].label | 現場を交えて折衷案を作る |
| life_events-562 | events[78].choices[1].result | 粘り強い対話が実り、実行可能な現実案にまとまった。 |
| life_events-563 | events[79].title | 閣僚としての現地視察 |
| life_events-564 | events[79].text | 他県で大きな災害が発生し、担当大臣として急遽現地を視察することになった。 |
| life_events-565 | events[79].choices[0].label | 被災者の目線で話を聞き続ける |
| life_events-566 | events[79].choices[0].result | 真摯な姿勢が報道され、国民からの信頼が高まった。 |
| life_events-567 | events[79].choices[1].label | 自治体首長との連携を最優先 |
| life_events-568 | events[79].choices[1].result | 迅速な支援策を約束し、地域の安心感につながった。 |
| life_events-569 | events[79].choices[1].risk.fail_result | 発言の一部が切り取られて報じられ、批判を浴びた。 |
| life_events-570 | events[80].title | 次期選挙の公認調整 |
| life_events-571 | events[80].text | 党三役として全国から届く公認申請をさばく。競合する選挙区の扱いが難しい。 |
| life_events-572 | events[80].choices[0].label | 双方の顔を立てて円満に調整 |
| life_events-573 | events[80].choices[0].result | 見事な差配でしこりを残さず、根回しの神髄を見せた。 |
| life_events-574 | events[80].choices[0].risk.fail_result | 分裂選挙になってしまい、党内の不満が一気に噴出した。 |
| life_events-575 | events[80].choices[1].label | 世論調査の数字で機械的に決める |
| life_events-576 | events[80].choices[1].result | 合理的ではあったが、落選した陣営から恨みを買った。 |
| life_events-577 | events[81].title | 首脳会議の舞台裏 |
| life_events-578 | events[81].text | 国際会議に出席し、各国の首脳と非公式の夕食会に臨む。緊張感が高まる。 |
| life_events-579 | events[81].choices[0].label | ユーモアを交え信頼関係を築く |
| life_events-580 | events[81].choices[0].result | 和やかな笑いが生まれ、首脳間の距離が一気に縮まった。 |
| life_events-581 | events[81].choices[0].risk.fail_result | 通訳を介したやり取りが噛み合わず、場が微妙になった。 |
| life_events-582 | events[81].choices[1].label | 日本の主張を淡々と正確に伝える |
| life_events-583 | events[81].choices[1].result | 実直な外交姿勢を示し、国益をしっかりと守り抜いた。 |
| life_events-584 | events[82].title | 官邸に届いた手紙 |
| life_events-585 | events[82].text | 激務の合間、机の上に置かれた一般市民からの直筆の手紙が目に留まった。 |
| life_events-586 | events[82].choices[0].label | 隅々まで読み返し返事を書く |
| life_events-587 | events[82].choices[0].result | 国民の暮らしの重みを再確認し、政治への情熱が燃えた。 |
| life_events-588 | events[82].choices[1].label | 秘書官に状況の調査を指示する |
| life_events-589 | events[82].choices[1].result | 現場の実態が分かり、次の施策を打つ参考になった。 |
| life_events-590 | events[83].title | 野党共闘の話し合い |
| life_events-591 | events[83].text | 野党の党首として他党との協力関係を築くべきか、独自路線を行くべきか迫られている。 |
| life_events-592 | events[83].choices[0].label | 他党の党首と膝を詰めて話す |
| life_events-593 | events[83].choices[0].result | 共通の政策で一致点を見出し、選挙協力への道を開いた。 |
| life_events-594 | events[83].choices[0].risk.fail_result | 条件面で折り合わず、決裂が報じられてしまった。 |
| life_events-595 | events[83].choices[1].label | 党の独自色を打ち出す演説をする |
| life_events-596 | events[83].choices[1].result | ぶれない姿勢が支持層に刺さり、党内の結束が強まった。 |

### bills（法案）

| 番号 | 場所 | 文 |
|---|---|---|
| bills-1 | bills[0].name | 2026年度予算 |
| bills-2 | bills[0].description | 3月末までに成立させないと支持率が大きく下がる。思想の偏りがないので野党も反対しにくい。 |
| bills-3 | bills[1].name | 子育て支援拡充法案 |
| bills-4 | bills[1].description | 再分配寄り。野党の多くが賛成しやすいが、財政規律派は渋る。 |
| bills-5 | bills[2].name | 所得税減税法案 |
| bills-6 | bills[2].description | 積極財政寄り。協和党が強く望む。 |
| bills-7 | bills[3].name | 防衛力強化法案 |
| bills-8 | bills[3].description | 抑止重視。抑止を重んじる野党は賛成しやすいが、公正党の中にも反対が出やすい。 |
| bills-9 | bills[4].name | 地方創生交付金法案 |
| bills-10 | bills[4].description | 地方への財源移譲。日本刷新の会が評価しやすい。 |
| bills-11 | bills[5].name | 選択的夫婦別姓法案 |
| bills-12 | bills[5].description | 多様性重視。野党の多くは賛成だが、民政党の保守派が造反しやすい。 |
| bills-13 | bills[6].name | 政治資金規正法改正案 |
| bills-14 | bills[6].description | 改革寄り。世論の受けはよいが、安定志向の議員は乗り気でない。 |
| bills-15 | bills[7].name | 原発再稼働推進法案 |
| bills-16 | bills[7].description | 市場・安定寄り。再分配を重んじる野党は強く反対する。 |
| bills-17 | bills[8].name | 農業所得補償法案 |
| bills-18 | bills[8].description | 地方の農業票に効く。市場重視派は渋る。 |
| bills-19 | bills[9].name | 社会保障目的消費税引き上げ法案 |
| bills-20 | bills[9].description | 財政規律派は支持するが、協和党や野党が反発し世論の抵抗も大きい。 |
| bills-21 | bills[10].name | 防災インフラ長期国債発行法案 |
| bills-22 | bills[10].description | 協和党やれいめいが歓迎。刷新や財政規律派は将来負担を懸念し反対。 |
| bills-23 | bills[11].name | 新興産業規制緩和促進法案 |
| bills-24 | bills[11].description | 市場重視派が推すが、労働環境を重視する野党や連立相手も難色を示す。 |
| bills-25 | bills[12].name | 全国一律最低賃金引き上げ法案 |
| bills-26 | bills[12].description | 民権党や公正党が賛成。市場派や一部与党議員は中小企業への打撃を懸念。 |
| bills-27 | bills[13].name | 大規模農業法人参入促進法案 |
| bills-28 | bills[13].description | 刷新が強く推進。伝統的な農村基盤を重視する民政党の一部や集産党は反対。 |
| bills-29 | bills[14].name | 年金支給開始年齢引き上げ法案 |
| bills-30 | bills[14].description | 財政維持を重視する側が推すが、連立相手や野党が反対し不人気も必至。 |
| bills-31 | bills[15].name | 勤務間休息時間義務化法案 |
| bills-32 | bills[15].description | 民権党や公正党など野党も賛成しやすい。経済成長重視の一部議員は渋る。 |
| bills-33 | bills[16].name | 高等教育無償化拡充法案 |
| bills-34 | bills[16].description | 協和党や民権党、世論の支持が厚い一方、財政規律派は財源確保を疑問視。 |
| bills-35 | bills[17].name | 地域公共交通維持支援法案 |
| bills-36 | bills[17].description | 地方選出の与野党議員が賛成しやすい。緊縮派は路線の採算性を問題視。 |
| bills-37 | bills[18].name | 多国間対話・平和協力推進法案 |
| bills-38 | bills[18].description | 対話を重んじる公正党や民権党が賛成。抑止重視の保守派は実効性に懐疑。 |
| bills-39 | bills[19].name | サイバー安全・通信防衛法案 |
| bills-40 | bills[19].description | 安保重視の保守派が推進。通信の秘密を巡り野党や連立相手の一部も難色。 |
| bills-41 | bills[20].name | 防衛装備輸出管理厳格化法案 |
| bills-42 | bills[20].description | 集産党や民権党、公正党が前向き。抑止力や産業維持を重んじる民政党は反対。 |
| bills-43 | bills[21].name | 包括的差別禁止・平等推進法案 |
| bills-44 | bills[21].description | 多様性重視の野党が推すが、伝統重視派の反発が強く与党内の調整が難航。 |
| bills-45 | bills[22].name | 外国人受け入れ基準厳格化法案 |
| bills-46 | bills[22].description | 参画党や民政党の一部が支持。人手不足を憂う経済派や多様性派は反対。 |
| bills-47 | bills[23].name | 地方分権・課税自主権拡大法案 |
| bills-48 | bills[23].description | 刷新が熱心に推進。中央省庁の権限や安定を重んじる民政党内から抵抗が出る。 |
| bills-49 | bills[24].name | 行政システム統一・効率化法案 |
| bills-50 | bills[24].description | 財政規律・安定派が賛成。地方の裁量縮小に改革派や野党が反発しやすい。 |

### events（政局の出来事）

| 番号 | 場所 | 文 |
|---|---|---|
| events-1 | events[0].title | 閣僚の失言 |
| events-2 | events[0].text | {member}が記者会見で失言し、批判を浴びた。 |
| events-3 | events[0].lines[0].text | 先ほどの発言は、被災された方々への配慮に欠けるのではありませんか。 |
| events-4 | events[0].lines[1].text | え、いや、その……そういう意味で申し上げたのではなく……。 |
| events-5 | events[0].lines[2].text | 総理、すぐに釈明させます。これ以上、騒ぎが大きくならないように。 |
| events-6 | events[0].lines[3].text | 言葉一つで政権が揺らぐ。肝に銘じてもらわないと困る。 |
| events-7 | events[1].title | 政治資金の疑惑 |
| events-8 | events[1].text | {member}の政治資金をめぐる疑惑が報じられた。 |
| events-9 | events[1].lines[0].text | 週刊誌が{member}の政治資金をめぐる疑惑を報じた。 |
| events-10 | events[1].lines[1].text | 記載に不備があったかもしれませんが、私的に使ったことは一切ありません。 |
| events-11 | events[1].lines[2].text | 与党はいつまで同じことを繰り返すつもりですか。徹底的に追及します。 |
| events-12 | events[1].lines[3].text | 党内も動揺しています。早めに手を打たないと。 |
| events-13 | events[2].title | 景気指標が好調 |
| events-14 | events[2].text | 景気指標が予想を上回り、政権への評価が上向いた。 |
| events-15 | events[2].lines[0].text | 発表された景気指標が市場の予想を上回った。 |
| events-16 | events[2].lines[1].text | 総理、追い風です。この勢いで政策を前に進めましょう。 |
| events-17 | events[2].lines[2].text | 浮かれずに、実感の伴う景気回復を目指そう。 |
| events-18 | events[3].title | 物価高への不満 |
| events-19 | events[3].text | 物価の上昇が続き、生活への不満が高まった。 |
| events-20 | events[3].lines[0].text | 総理、物価の上昇が止まりません。政府の対策は後手に回っているのではありませんか。 |
| events-21 | events[3].lines[1].text | 国民の皆さんの不安は重く受け止めています。必要な手は打ってまいります。 |
| events-22 | events[3].lines[2].text | 口先だけで、暮らしは一向によくなりません。 |
| events-23 | events[4].title | 大雨への対応 |
| events-24 | events[4].text | 大雨被害への政府の対応が評価された。 |
| events-25 | events[4].lines[0].text | 各地を大雨が襲った。政府は直ちに対策本部を立ち上げた。 |
| events-26 | events[4].lines[1].text | 人命第一だ。自治体と連携して、できることはすべてやってくれ。 |
| events-27 | events[4].lines[2].text | 迅速な初動は、現地でも高く評価されています。 |
| events-28 | events[5].title | 首脳会談 |
| events-29 | events[5].text | 首脳会談が成果を上げ、首相への評価が高まった。 |
| events-30 | events[5].lines[0].text | 首相は首脳会談に臨み、共同声明をまとめ上げた。 |
| events-31 | events[5].lines[1].text | 総理、今回の会談の手応えはいかがでしたか。 |
| events-32 | events[5].lines[2].text | 率直に意見を交わすことができました。信頼関係を築く第一歩になったと思います。 |
| events-33 | events[6].title | 春闘で大幅賃上げ |
| events-34 | events[6].text | 春の労使交渉で大幅な賃上げ回答が相次ぎ、家計改善への期待が広がった。 |
| events-35 | events[6].lines[0].text | 主要企業の労使交渉で、前年を大きく上回る賃上げが妥結した。 |
| events-36 | events[6].lines[1].text | 政府の賃上げ要請が一定の成果を上げたとの見方もあります。 |
| events-37 | events[6].lines[2].text | 物価を上回る所得の伸びを、中小企業や地方にも波及させたい。 |
| events-38 | events[6].lines[3].text | 経済の好循環が動き出した。気を緩めず後押しを続けよう。 |
| events-39 | events[7].title | 国際会議で合意主導 |
| events-40 | events[7].text | 多国間会議で日本提案の協力枠組みが採択され、外交手腕が評価された。 |
| events-41 | events[7].lines[0].text | 総理、今回の国際会議で共同声明の取りまとめに成功しましたね。 |
| events-42 | events[7].lines[1].text | 関係各国の粘り強い対話の成果です。今後も責任ある役割を果たします。 |
| events-43 | events[7].lines[2].text | 合意自体は評価するが、国内への具体的な還元策を示してほしい。 |
| events-44 | events[7].lines[3].text | 各社とも総理の外交姿勢を好意的に報じています。 |
| events-45 | events[8].title | 国際大会で快挙 |
| events-46 | events[8].text | 国際スポーツ大会で日本勢が躍進し、国内に明るい祝賀ムードが広がった。 |
| events-47 | events[8].lines[0].text | 世界の舞台での快挙に、全国各地から喜びの声が上がっている。 |
| events-48 | events[8].lines[1].text | 国民的な盛り上がりが、社会の空気を明るくしています。 |
| events-49 | events[8].lines[2].text | 選手たちの努力に敬意を表したい。政府としても競技環境を整えよう。 |
| events-50 | events[9].title | 先端技術の成果発表 |
| events-51 | events[9].text | 国内研究機関の画期的な成果が発表され、政府の支援策にも注目が集まった。 |
| events-52 | events[9].lines[0].text | 世界初の技術実用化に目処がつき、関連産業の期待が高まっています。 |
| events-53 | events[9].lines[1].text | 地道な基礎研究への投資が、ようやく実を結び始めました。 |
| events-54 | events[9].lines[2].text | 若い研究者が力を発揮できる環境を、これからさらに厚くしていこう。 |
| events-55 | events[10].title | 緊急支援策が迅速化 |
| events-56 | events[10].text | 燃料費や生活支援の給付が速やかに届き始め、政府の対応が評価された。 |
| events-57 | events[10].lines[0].text | 自治体と連携した給付手続きが例年になく円滑に進んでいる。 |
| events-58 | events[10].lines[1].text | 現場からは「今回は手続きが早くて助かった」との声が届いています。 |
| events-59 | events[10].lines[2].text | 困っている人の手元に早く届いてこそ支援だ。引き続き現場を支える。 |
| events-60 | events[10].lines[3].text | 地元の支援者からも好評です。政権への追い風になります。 |
| events-61 | events[11].title | 連立政権の結束確認 |
| events-62 | events[11].text | 与党と連立相手が重要課題の工程表で合意し、政権の安定感が評価された。 |
| events-63 | events[11].lines[0].text | 連立相手との協議がまとまり、共同で政策を前に進める態勢が整いました。 |
| events-64 | events[11].lines[1].text | 異なる意見も丁寧にすり合わせた結果だ。政権の足場が固まったな。 |
| events-65 | events[11].lines[2].text | 安定的な政権運営への安心感が市場にも広がっています。 |
| events-66 | events[12].title | 閣僚に辞任要求 |
| events-67 | events[12].text | 答弁の混乱が続いた{member}に辞任を求める声が強まり、任命責任が追及された。 |
| events-68 | events[12].lines[0].text | 答弁が二転三転している。直ちに辞任すべきだ。 |
| events-69 | events[12].lines[1].text | 職責を果たすことで、信頼の回復に努めてまいります。 |
| events-70 | events[12].lines[2].text | 重く受け止めている。本人には説明を尽くさせる。 |
| events-71 | events[12].lines[3].text | 与党内からも交代論が出ていますが、続投させますか。 |
| events-72 | events[13].title | 与党議員に便宜疑惑 |
| events-73 | events[13].text | {member}の事務所が地元事業者への口利きを行ったとの疑惑が報じられた。 |
| events-74 | events[13].lines[0].text | 事業者の選定に際し、事務所側から省庁へ働きかけがあったのでは。 |
| events-75 | events[13].lines[1].text | 法に触れる行為は一切なく、事実関係を精査した上で説明します。 |
| events-76 | events[13].lines[2].text | 政治の信頼を根底から揺るがす問題だ。参考人招致を求める。 |
| events-77 | events[13].lines[3].text | 当人に事実を確認し、国民に誤解を与えないよう厳正に対処します。 |
| events-78 | events[14].title | 連立内で方針対立 |
| events-79 | events[14].text | 重要法案の扱いをめぐり与党と連立相手の溝が深まり、調整が難航している。 |
| events-80 | events[14].lines[0].text | 連立相手が譲歩案を受け入れず、採決の日程が組めない状況です。 |
| events-81 | events[14].lines[1].text | 連立の枠組みを壊すわけにはいかない。粘り強く対話を続けよう。 |
| events-82 | events[14].lines[2].text | 与党内の足並みさえ揃わないまま、国会に法案を出すべきではない。 |
| events-83 | events[14].lines[3].text | 政権の不協和音が報じられ、支持層にも戸惑いが広がっています。 |
| events-84 | events[15].title | 与党内で造反の動き |
| events-85 | events[15].text | {member}ら党内のグループが執行部の方針に公然と異議を唱え始めた。 |
| events-86 | events[15].lines[0].text | 地域の声を無視した決定には従えない。採決での対応も検討する。 |
| events-87 | events[15].lines[1].text | 党議拘束を外れるような動きは看過できません。直ちに説得に当たります。 |
| events-88 | events[15].lines[2].text | 党内で意見を戦わせるのは構わないが、最後は結束を示さねば。 |
| events-89 | events[16].title | 株価急落と相場混乱 |
| events-90 | events[16].text | 海外市場の動揺を受けて株価が急落し、急激な相場変動に不安が広がった。 |
| events-91 | events[16].lines[0].text | 東京市場の取引開始直後から売りが広がり、大幅安となった。 |
| events-92 | events[16].lines[1].text | 金融市場の不安定さが増していますが、政府の経済対策は十分ですか。 |
| events-93 | events[16].lines[2].text | 市場の動向を高い緊張感を持って注視し、機動的に対応します。 |
| events-94 | events[16].lines[3].text | 実体経済への悪影響を抑えるため、経済官庁と連携を密にしよう。 |
| events-95 | events[17].title | 大手企業の経営破綻 |
| events-96 | events[17].text | 老舗の大手製造業者が経営破綻し、下請けの連鎖や雇用への懸念が強まった。 |
| events-97 | events[17].lines[0].text | 取引先の中小企業や従業員の先行きに深刻な不安が出ています。 |
| events-98 | events[17].lines[1].text | 産業支援策の遅れが招いた事態だ。ただちに救済策を講じるべきだ。 |
| events-99 | events[17].lines[2].text | 地域経済への連鎖倒産を防ぐため、資金繰り支援に全力を挙げる。 |
| events-100 | events[18].title | 周辺海域で緊張高まる |
| events-101 | events[18].text | 周辺海域での外国船の接近が相次ぎ、政府の危機管理体制に厳しい目が向いた。 |
| events-102 | events[18].lines[0].text | 領海周辺での活動が活発化しており、関係機関が警戒監視を続けています。 |
| events-103 | events[18].lines[1].text | 毅然と対応しつつ、不測の事態を招かぬよう外交ルートでも抗議する。 |
| events-104 | events[18].lines[2].text | 危機管理の初動が国民に見えにくい。情報を適時公開すべきだ。 |
| events-105 | events[18].lines[3].text | 安全保障への不安が世論調査の数字にも表れ始めています。 |
| events-106 | events[19].title | 記録的猛暑で電力逼迫 |
| events-107 | events[19].text | 連日の猛暑で電力需給がひっ迫し、エネルギー政策への疑問の声が上がった。 |
| events-108 | events[19].lines[0].text | 各地で記録的な高温が続き、電力の予備率が厳しい水準に落ち込んだ。 |
| events-109 | events[19].lines[1].text | 毎年のように節電要請が出る状況に、産業界からも不満の声があります。 |
| events-110 | events[19].lines[2].text | 発電所の稼働維持と需給調整に全力を挙げ、停電の回避に努めます。 |
| events-111 | events[19].lines[3].text | 中長期的な電源確保の道筋を、改めて国民に丁寧に示さねばならない。 |
| events-112 | events[20].title | 大雪で広範囲の立ち往生 |
| events-113 | events[20].text | 記録的な大雪で幹線道路や鉄道が麻痺し、政府の初動対応に批判が寄せられた。 |
| events-114 | events[20].lines[0].text | 寒波による豪雪で各地の交通網が寸断され、物流にも影響が出ている。 |
| events-115 | events[20].lines[1].text | 通行止めや除雪の連携が遅れ、多くの住民が寒さの中で孤立した。 |
| events-116 | events[20].lines[2].text | 自治体と連携し、物資の輸送と早期の復旧作業を進めています。 |
| events-117 | events[20].lines[3].text | 気象予測を踏まえた事前の警戒態勢を、今一度見直す必要がある。 |
| events-118 | events[21].title | 野党が審議拒否で紛糾 |
| events-119 | events[21].text | 政府の資料提出をめぐり野党が審議に応じず、国会が空転する事態となった。 |
| events-120 | events[21].lines[0].text | 肝心の資料を黒塗りのまま出して、まともな審議ができるはずがない。 |
| events-121 | events[21].lines[1].text | 与野党の理事で協議を整えてください。本日の委員会は散会します。 |
| events-122 | events[21].lines[2].text | 強行採決は避けたいところですが、会期も限られています。 |
| events-123 | events[21].lines[3].text | 出せる情報は丁寧に出し、議論の場に戻ってもらうよう呼びかけよう。 |
| events-124 | events[22].title | 世論調査で賛否が拮抗 |
| events-125 | events[22].text | 報道各社の世論調査で、政権の取り組みに対する評価と批判がほぼ並んだ。 |
| events-126 | events[22].lines[0].text | 内閣支持率は横ばいですが、政策ごとの評価は真っ二つに割れています。 |
| events-127 | events[22].lines[1].text | 厳しいご意見も真摯に受け止め、一つずつ結果を出すほかありません。 |
| events-128 | events[22].lines[2].text | 国民の迷いが数字に表れている。政権はもっと説明責任を果たすべきだ。 |
| events-129 | events[22].lines[3].text | 一喜一憂せず、掲げた公約を愚直に形にしていくだけだ。 |
| events-130 | events[23].title | 内閣改造の観測広がる |
| events-131 | events[23].text | 政権内の立て直しを図る内閣改造の噂が流れ、与党内で思惑が交錯している。 |
| events-132 | events[23].lines[0].text | 総理、近く内閣改造や党役員人事に踏み切るお考えはありますか。 |
| events-133 | events[23].lines[1].text | 今は目の前の課題に全力を挙げる時であり、人事は全くの白紙です。 |
| events-134 | events[23].lines[2].text | 閣僚や党の役職を巡り、水面下で猟官運動のような動きが見られます。 |
| events-135 | events[23].lines[3].text | 憶測が先行すると政府の業務に支障が出ます。引き締めを図ります。 |
| events-136 | events[24].title | 大型台風が列島を通過 |
| events-137 | events[24].text | 大型台風により各地で被害が出たが、事前の避難呼びかけが被害拡大を抑えた。 |
| events-138 | events[24].lines[0].text | 強い勢力を保ったまま台風が上陸し、広い範囲で風水害が発生した。 |
| events-139 | events[24].lines[1].text | 早期の避難指示により人的被害は抑えられましたが、復旧が急がれます。 |
| events-140 | events[24].lines[2].text | 被災地の自治体と緊密に連携し、生活再建の支援を迅速に届けよう。 |
| events-141 | events[24].lines[3].text | 復旧支援のスピードと財源の手当てが、今後の焦点となりそうです。 |
| events-142 | events[25].title | 冬の感染症拡大に警戒 |
| events-143 | events[25].text | 季節性の感染症が急拡大し、医療体制や経済活動への影響が注視されている。 |
| events-144 | events[25].lines[0].text | 全国的に医療機関の受診者が急増し、病床のひっ迫が懸念されている。 |
| events-145 | events[25].lines[1].text | 医療現場への負担軽減と社会活動の維持をどう両立させますか。 |
| events-146 | events[25].lines[2].text | 検査や治療薬の供給体制を強化し、自治体と情報共有を進めています。 |
| events-147 | events[25].lines[3].text | 過度な混乱を避けつつ、重症化リスクの高い方々を守る対策を徹底しよう。 |

### activity_flavor（活動のあとの短い文）

| 番号 | 場所 | 文 |
|---|---|---|
| activity_flavor-1 | lines.local[0].text | {secretary}の名簿を手に、路地裏の商店を一軒ずつ回った。 |
| activity_flavor-2 | lines.local[1].text | 玄関先まで出てくれた住民に、最近の暮らしの困りごとを聞き取った。 |
| activity_flavor-3 | lines.local[2].text | 「お忙しいのにご苦労さま」と声を掛けられ、名刺を丁寧にお渡しした。 |
| activity_flavor-4 | lines.local[3].text | 留守宅の郵便受けに活動報告を入れ、次の集落へと足を延ばした。 |
| activity_flavor-5 | lines.local[4].text | 田んぼのあぜ道で草取りの手を止め、農業の現状を聞かせてもらった。 |
| activity_flavor-6 | lines.local[5].text | 軒先のつるし柿が揺れる集落を歩き、冬支度の話題で打ち解けた。 |
| activity_flavor-7 | lines.local[6].text | 満開の桜並木沿いの商店街で、新生活の忙しさについて話を聞いた。 |
| activity_flavor-8 | lines.local[7].text | 「また来たの」と笑われながら、座敷に上がってお茶をいただいた。 |
| activity_flavor-9 | lines.local[8].text | インターホン越しに名乗っても、すぐに通話が切れてしまった。 |
| activity_flavor-10 | lines.local[9].text | 平日は東京で会議に出て、週末は地元を一軒ずつ歩く日々が続く。 |
| activity_flavor-11 | lines.speech[0].text | 駅前のロータリーに立ち、通勤客の流れに向かって政策を訴えた。 |
| activity_flavor-12 | lines.speech[1].text | 冷たい視線の中、立ち止まって聞いてくれた一人に向けて言葉を強めた。 |
| activity_flavor-13 | lines.speech[2].text | 通りがかりの学生が、配っていた政策ビラを珍しそうに受け取った。 |
| activity_flavor-14 | lines.speech[3].text | 雨に濡れた歩道で傘もささず声を張り上げ、喉がすっかり枯れた。 |
| activity_flavor-15 | lines.speech[4].text | 真夏の日差しでアスファルトが照り返す中、汗を拭いながら訴えた。 |
| activity_flavor-16 | lines.speech[5].text | 白い息を吐きながら、手袋を外した手でマイクを握りしめた。 |
| activity_flavor-17 | lines.speech[6].text | 柔らかな春風に旗が揺れる駅前で、新年度に向けた決意を述べた。 |
| activity_flavor-18 | lines.speech[7].text | 「次の選挙こそ頼むよ」と、昔からの支援者が力強く手を握った。 |
| activity_flavor-19 | lines.speech[8].text | 国会の議論を駅前で報告すると、足を止めて聞き入る人が増えた。 |
| activity_flavor-20 | lines.speech[9].text | 信号待ちの車から視線を向けられるだけで、誰も足を止めない。 |
| activity_flavor-21 | lines.study[0].text | 専門家の鋭い指摘にメモを取る手が止まらず、課題の深さを知った。 |
| activity_flavor-22 | lines.study[1].text | 統計資料の読み違いを講師に正され、思い込みの危うさを痛感した。 |
| activity_flavor-23 | lines.study[2].text | {secretary}と資料を読み込み、夜遅くまで議論を交わした。 |
| activity_flavor-24 | lines.study[3].text | 現場の担当者から聞いた実情と制度の隙間に、思わず唸ってしまった。 |
| activity_flavor-25 | lines.study[4].text | 新年度の予算編成を見据え、秋深まる会議室で数値の根拠を詰めた。 |
| activity_flavor-26 | lines.study[5].text | 年明けの国会論戦に備え、冬の冷え込む早朝から勉強会を開いた。 |
| activity_flavor-27 | lines.study[6].text | 梅雨の湿気がこもる部屋で、防災制度の見直し案を集中して学んだ。 |
| activity_flavor-28 | lines.study[7].text | 委員会の質疑に間に合わせるため、官僚の説明に次々と質問を重ねた。 |
| activity_flavor-29 | lines.study[8].text | 落選中の今こそ基礎から学び直そうと、分厚い白書を何冊も読んだ。 |
| activity_flavor-30 | lines.study[9].text | 初めて聞く行政用語に戸惑いながらも、必死に要点だけを書き留めた。 |
| activity_flavor-31 | lines.fund[0].text | 地元企業の社長室で活動の意義を語り、頭を下げて協力を頼んだ。 |
| activity_flavor-32 | lines.fund[1].text | 景気の厳しさを理由に丁重に断られ、事務所へ戻る足取りが重い。 |
| activity_flavor-33 | lines.fund[2].text | {secretary}と名簿を見直し、一人ひとりに連絡を入れた。 |
| activity_flavor-34 | lines.fund[3].text | 「期待しているよ」と温かい言葉とともに、支援の輪が広がった。 |
| activity_flavor-35 | lines.fund[4].text | 春の人事異動の挨拶に合わせて取引先を回り、後援会への参加を頼んだ。 |
| activity_flavor-36 | lines.fund[5].text | 夏の盛りに会場を借りて開いた報告会に、多くの支援者が集まった。 |
| activity_flavor-37 | lines.fund[6].text | 師走の慌ただしさの中、年末の会合に顔を出して協力をお願いした。 |
| activity_flavor-38 | lines.fund[7].text | 「国会の報告を聞くのが楽しみだ」と常連の支援者が笑顔を見せた。 |
| activity_flavor-39 | lines.fund[8].text | 名前も知られていない新人の訪問に、受付で門前払いされてしまった。 |
| activity_flavor-40 | lines.fund[9].text | 会期の合間を縫って開いた東京での朝食会に、関係者が顔を揃えた。 |
| activity_flavor-41 | lines.kengi[0].text | 県庁近くの喫茶店で県議と向き合い、地域の切実な要望を聞き取った。 |
| activity_flavor-42 | lines.kengi[1].text | 国と県の役割分担をめぐり意見がぶつかり、議論が平行線をたどった。 |
| activity_flavor-43 | lines.kengi[2].text | 県議の案内で地元の課題を視察し、現場ならではの視点を教わった。 |
| activity_flavor-44 | lines.kengi[3].text | {secretary}が組んだ予定で、次の地元行事での連携を確認した。 |
| activity_flavor-45 | lines.kengi[4].text | 春の県議会が終わった直後に集まり、新年度事業の課題を持ち寄った。 |
| activity_flavor-46 | lines.kengi[5].text | 夏の要望活動に向けて、県内各地の県議と優先順位をすり合わせた。 |
| activity_flavor-47 | lines.kengi[6].text | 冬の除雪費や暖房支援について、雪深い地域の県議から相談を受けた。 |
| activity_flavor-48 | lines.kengi[7].text | 地盤の薄い地域をどう開拓するか、地元県議から厳しい助言を受けた。 |
| activity_flavor-49 | lines.kengi[8].text | 「ここは任せておけ」と頼もしい県議が笑顔で肩を叩いてくれた。 |
| activity_flavor-50 | lines.kengi[9].text | 国会で審議中の法案が県政に与える影響を、県議団に詳しく説明した。 |
| activity_flavor-51 | lines.festival[0].text | 早朝の河川敷清掃に長靴で参加し、住民と並んで汗を流した。 |
| activity_flavor-52 | lines.festival[1].text | 町内会の防災訓練でバケツリレーに加わり、役員と打ち解けた。 |
| activity_flavor-53 | lines.festival[2].text | 会場の隅で来賓紹介の順番を待ち続けたが、出番は一言だけだった。 |
| activity_flavor-54 | lines.festival[3].text | 商店街の催しで手伝いに回り、買い物客や店主と気さくに言葉を交わした。 |
| activity_flavor-55 | lines.festival[4].text | 夏祭りの盆踊りの輪に加わり、浴衣姿の家族連れと笑顔で挨拶した。 |
| activity_flavor-56 | lines.festival[5].text | 秋晴れの地域の運動会で綱引きに駆り出され、翌日の筋肉痛に悩んだ。 |
| activity_flavor-57 | lines.festival[6].text | 年末の餅つき大会で杵を振るい、つきたての餅を地域の皆と頬張った。 |
| activity_flavor-58 | lines.festival[7].text | 「国会の先生も大変だな」と町内会長に労われ、地元の温かさを感じた。 |
| activity_flavor-59 | lines.festival[8].text | 輪の中にどう入ればいいか戸惑い、会場の端で立ち尽くしてしまった。 |
| activity_flavor-60 | lines.festival[9].text | 挨拶回りをするたび顔見知りから声がかかり、なかなか前に進めない。 |
| activity_flavor-61 | lines.training[0].text | 早朝の河川敷を走りながら、頭の中で次の演説の構成を組み立てた。 |
| activity_flavor-62 | lines.training[1].text | ジムで汗を流したあと鏡を見ると、少しだけ表情が引き締まっていた。 |
| activity_flavor-63 | lines.training[2].text | 無理をして距離を伸ばした結果、足を痛めて途中から歩いて帰った。 |
| activity_flavor-64 | lines.training[3].text | 雨の日は室内でストレッチを続け、凝り固まった肩をじっくりほぐした。 |
| activity_flavor-65 | lines.training[4].text | 春めいた川沿いの道をジョギングし、爽やかな風に背中を押された。 |
| activity_flavor-66 | lines.training[5].text | 夏の強い日差しを避け、夜明け前の涼しいうちに散歩を済ませた。 |
| activity_flavor-67 | lines.training[6].text | 木枯らしが吹く夕暮れに公園を走り、冷えた体が芯から温まった。 |
| activity_flavor-68 | lines.training[7].text | 議員宿舎の周りを早朝に走り、同じように走る同僚議員とすれ違った。 |
| activity_flavor-69 | lines.training[8].text | 落選中の不安を振り払うように、無心でジムのマシンを漕ぎ続けた。 |
| activity_flavor-70 | lines.training[9].text | これからの選挙戦を戦い抜くため、基礎体力をつけようと靴紐を締めた。 |
| activity_flavor-71 | lines.hobby[0].text | 政争を忘れて没頭した数時間で、ささくれていた心がすっと落ち着いた。 |
| activity_flavor-72 | lines.hobby[1].text | 久しぶりの趣味のつもりが、頭の中では明日の段取りばかり考えていた。 |
| activity_flavor-73 | lines.hobby[2].text | お気に入りの音楽を静かに流し、たまった新聞の切り抜きを整理した。 |
| activity_flavor-74 | lines.hobby[3].text | 休日の午後を自分の好きなことだけに使い、少しだけ視界が開けた。 |
| activity_flavor-75 | lines.hobby[4].text | 新緑を眺めながら近所の公園を散策し、カメラのシャッターを切った。 |
| activity_flavor-76 | lines.hobby[5].text | 秋の夜長に歴史小説を開き、昔の政治家たちの決断に思いを馳せた。 |
| activity_flavor-77 | lines.hobby[6].text | 雪の降る休日に温かい茶を淹れ、久しぶりに時間を気にせず本を読んだ。 |
| activity_flavor-78 | lines.hobby[7].text | 議員会館の机を離れ、東京の古書店街を歩いて思わぬ一冊に出会った。 |
| activity_flavor-79 | lines.hobby[8].text | 「休みすぎでは」と{secretary}に促され、早めに切り上げた。 |
| activity_flavor-80 | lines.hobby[9].text | 地元の小さな喫茶店で顔見知りの店主と話しながら、趣味の将棋を指した。 |
| activity_flavor-81 | lines.rest[0].text | 電話の着信音を切り、昼過ぎまで泥のように眠って疲れを癒やした。 |
| activity_flavor-82 | lines.rest[1].text | 湯船にゆっくり浸かり、連日の気疲れを熱いお湯と一緒に流し落とした。 |
| activity_flavor-83 | lines.rest[2].text | 休むつもりで横になったが、失敗した場面が浮かんでなかなか眠れない。 |
| activity_flavor-84 | lines.rest[3].text | {secretary}に予定を空けてもらい、何もしない贅沢を味わった。 |
| activity_flavor-85 | lines.rest[4].text | 春の陽気に誘われて縁側でうたた寝をし、柔らかな日差しに癒やされた。 |
| activity_flavor-86 | lines.rest[5].text | うだるような暑さの日中に無理をせず、涼しい部屋で体調を整えた。 |
| activity_flavor-87 | lines.rest[6].text | 年の瀬の冷たい雨音を聞きながらこたつに入り、一年を振り返った。 |
| activity_flavor-88 | lines.rest[7].text | 長い会期を終えて議員宿舎で一息つき、張り詰めていた糸を緩めた。 |
| activity_flavor-89 | lines.rest[8].text | 「休むのも仕事のうち」と自分に言い聞かせ、焦る気持ちを落ち着けた。 |
| activity_flavor-90 | lines.rest[9].text | 初めての選挙活動で疲れた体を休め、翌朝からの挨拶回りに備えた。 |

### stories（物語の連作とライバルの人物像）

| 番号 | 場所 | 文 |
|---|---|---|
| stories-1 | rival_types[0].name | 地元一筋の古株 |
| stories-2 | rival_types[0].description | 地域の冠婚葬祭に必ず顔を出し、長年の義理人情と町内会の絆で票を固める地元の顔役。 |
| stories-3 | rival_types[0].catchphrase | この町のことは、この町の暮らしを知る者が決める。 |
| stories-4 | rival_types[0].lines.election_win | 町内を一軒一軒歩いた汗は裏切らん。それがこの選挙区の答えだ。 |
| stories-5 | rival_types[0].lines.election_lose | 見事な戦いだった。若い力がここまで地元を動かすとはな。 |
| stories-6 | rival_types[0].lines.close_race | 最後の最後まで読めん勝負だったな。お前の粘りには舌を巻くよ。 |
| stories-7 | rival_types[0].lines.好敵手 | お前さんが相手なら、俺も古いやり方に甘えてはいられんな。 |
| stories-8 | rival_types[0].lines.因縁 | この土地の看板だけは、誰にも渡すわけにはいかんのだ。 |
| stories-9 | rival_types[0].lines.盟友 | 党は違えど、この町の未来を託せるのはお前さんだけだ。 |
| stories-10 | rival_types[0].lines.不信 | 口先ばかりの人間は、いずれこの土地の人に愛想を尽かされるぞ。 |
| stories-11 | rival_types[1].name | 元官僚の政策通 |
| stories-12 | rival_types[1].description | 中央省庁で制度設計を担った実務エリート。冷静なデータ分析と緻密な法案作成で信頼を集める。 |
| stories-13 | rival_types[1].catchphrase | 感情論ではなく、持続可能な制度で未来を設計する。 |
| stories-14 | rival_types[1].lines.election_win | 有権者は短期的な人気より、現実的な政策の積み上げを選びました。 |
| stories-15 | rival_types[1].lines.election_lose | 正しい処方箋を書くだけでは、人の心は動かないということですか。 |
| stories-16 | rival_types[1].lines.close_race | 統計上の誤差に等しい接戦でした。次はさらに数字を詰めてきます。 |
| stories-17 | rival_types[1].lines.好敵手 | あなたの現場感覚と私の制度論がぶつかることで、議論が深まりますね。 |
| stories-18 | rival_types[1].lines.因縁 | 誤った政策で国を傾けるわけにはいかない。絶対に退きませんよ。 |
| stories-19 | rival_types[1].lines.盟友 | 立場が違っても、あなたの誠実なデータへの向き合い方は尊敬しています。 |
| stories-20 | rival_types[1].lines.不信 | 根拠のない批判を並べるやり方には、どうしても納得がいきません。 |
| stories-21 | rival_types[2].name | 街頭の弁論家 |
| stories-22 | rival_types[2].description | 鋭い弁舌と発信力で無党派層の心を掴む論客。メディアや駅前演説で圧倒的な熱狂を生む。 |
| stories-23 | rival_types[2].catchphrase | 閉ざされた会議室より、駅前の一人の心に政治を届ける。 |
| stories-24 | rival_types[2].lines.election_win | 聞こえましたか。変化を望む有権者の声が、この街に溢れています！ |
| stories-25 | rival_types[2].lines.election_lose | 言葉が足りなかったのか、届き切らなかったのか。悔しいですね。 |
| stories-26 | rival_types[2].lines.close_race | まるで決勝戦のような熱気でしたね。あなたの演説も悪くなかった。 |
| stories-27 | rival_types[2].lines.好敵手 | 同じマイクを握る者として、あなたとの公開討論が一番燃えますよ。 |
| stories-28 | rival_types[2].lines.因縁 | 古い体質を象徴するあなたに、この街の未来は任せられません。 |
| stories-29 | rival_types[2].lines.盟友 | 言葉の重みを分かっているあなただから、政党を超えて話が通じる。 |
| stories-30 | rival_types[2].lines.不信 | 耳触りのいい言葉で人を欺くような真似だけは、私は認めません。 |
| stories-31 | rival_types[3].name | 元首長の実務派 |
| stories-32 | rival_types[3].description | 地方自治体の長として予算編成と災害対応を率いた実績派。理想より今できる解決を重んじる。 |
| stories-33 | rival_types[3].catchphrase | 評論家はいらない。必要なのは明日の現場を動かす実務だ。 |
| stories-34 | rival_types[3].lines.election_win | 首長時代に培った現場主義が、国政の舞台でも認められました。 |
| stories-35 | rival_types[3].lines.election_lose | 国政の風というものは、自治体の理屈とはまた違うものですね。 |
| stories-36 | rival_types[3].lines.close_race | 一票の重さを誰より知っているつもりだが、ここまで競るとは。 |
| stories-37 | rival_types[3].lines.好敵手 | 机上の空論を語らないあなたとは、良い仕事ができそうだと感じますよ。 |
| stories-38 | rival_types[3].lines.因縁 | 現場を知らない者に、地域の予算やインフラをいじられては困るのだ。 |
| stories-39 | rival_types[3].lines.盟友 | 国の制度と地方の現実を繋ぐため、党が違っても知恵を貸し合おう。 |
| stories-40 | rival_types[3].lines.不信 | 自分の都合で現場を振り回す政治家ほど、厄介なものはありませんね。 |
| stories-41 | rival_types[4].name | 草の根の挑戦者 |
| stories-42 | rival_types[4].description | 福祉や市民活動から飛び出した熱血漢。大きな組織を持たず、自転車とボランティア仲間と走る。 |
| stories-43 | rival_types[4].catchphrase | 声なき人の小さな叫びを、真っ直ぐ議場へ運びたい。 |
| stories-44 | rival_types[4].lines.election_win | 大きな後ろ盾がなくても、市民の力でここまで来られるんです！ |
| stories-45 | rival_types[4].lines.election_lose | 組織の壁は厚かった……でも、私たちの訴えは絶対に無駄にしません。 |
| stories-46 | rival_types[4].lines.close_race | あと一歩まで迫れた！　次は必ずこの街の常識を変えてみせます。 |
| stories-47 | rival_types[4].lines.好敵手 | 立場は違っても、あなたの街を歩く姿にはいつも刺激を受けています。 |
| stories-48 | rival_types[4].lines.因縁 | 既得権を守るだけの政治に、私は何度でも立ち向かいますから！ |
| stories-49 | rival_types[4].lines.盟友 | 違う党からでも、困っている人を救いたい思いは同じだと信じています。 |
| stories-50 | rival_types[4].lines.不信 | 弱い立場の人の痛みを切り捨てるようなやり方は、決して許しません。 |
| stories-51 | rival_types[5].name | 経済界のやり手 |
| stories-52 | rival_types[5].description | 経営者や経済団体の要職を歴任し、地域経済の再生を掲げて転身。数字とスピード感を武器にする。 |
| stories-53 | rival_types[5].catchphrase | 雇用と稼ぐ力がなければ、どんな福祉も絵に描いた餅だ。 |
| stories-54 | rival_types[5].lines.election_win | この国の停滞を破るには、民間の感覚が必要だと認められました。 |
| stories-55 | rival_types[5].lines.election_lose | 企業経営と選挙は違うな。合理性だけでは人は動かんということか。 |
| stories-56 | rival_types[5].lines.close_race | 実に際どい勝負だった。あなたの粘り強さは経営者としても見事だ。 |
| stories-57 | rival_types[5].lines.好敵手 | あなたのような手強い相手と競えるなら、挑み甲斐がある選挙区だ。 |
| stories-58 | rival_types[5].lines.因縁 | 経済を止めるような無責任なばら撒きには、徹底して反対させてもらう。 |
| stories-59 | rival_types[5].lines.盟友 | 損得を超えて地域の未来を語れるとは。一度じっくり杯を交わしたいな。 |
| stories-60 | rival_types[5].lines.不信 | 約束と数字をごまかす相手と、まともな交渉などできるはずがない。 |
| stories-61 | rival_types[6].name | 新風を模索する二世 |
| stories-62 | rival_types[6].description | 親から受け継いだ後援会の重圧を背負いつつ、自分なりの改革の色を出そうと葛藤する若手・中堅。 |
| stories-63 | rival_types[6].catchphrase | 親の看板と言われても構わない。結果で自分の名を刻むだけだ。 |
| stories-64 | rival_types[6].lines.election_win | 先代の看板だけでなく、私自身の訴えに託してくれた一票だと信じます。 |
| stories-65 | rival_types[6].lines.election_lose | 看板の重みに甘えていたのかもしれない。一から自分の足で歩き直します。 |
| stories-66 | rival_types[6].lines.close_race | あなたの自力の強さには、正直羨ましさすら感じましたよ。 |
| stories-67 | rival_types[6].lines.好敵手 | 親の背中しか知らなかった私に、対等なライバルとは何かを教えてくれた。 |
| stories-68 | rival_types[6].lines.因縁 | 二世だからと色眼鏡で見るなら、実力で黙らせてみせるだけです。 |
| stories-69 | rival_types[6].lines.盟友 | 家の名前ではなく、一人の政治家として向き合ってくれたのはあなただけだ。 |
| stories-70 | rival_types[6].lines.不信 | 人の出自ばかりを攻撃材料にするのは、正直見損ないました。 |
| stories-71 | rival_types[7].name | 地道な調整型 |
| stories-72 | rival_types[7].description | 派手さはないが委員会質疑や地方議員との連絡を黙々とこなし、着実に実績を積む職人肌。 |
| stories-73 | rival_types[7].catchphrase | 目立たなくていい。法律の一行を直し、現場の困りごとを一つ減らす。 |
| stories-74 | rival_types[7].lines.election_win | 派手なパフォーマンスはできんが、地道な仕事を見てくれる人がいたな。 |
| stories-75 | rival_types[7].lines.election_lose | やはりもう少し、外へ向けて伝える工夫も必要だったか……。 |
| stories-76 | rival_types[7].lines.close_race | 互いの積み上げがそのまま数字に出た。嘘のない接戦だったよ。 |
| stories-77 | rival_types[7].lines.好敵手 | お前さんの見えないところでの努力、同じ玄人としてよく分かっているぞ。 |
| stories-78 | rival_types[7].lines.因縁 | 耳障りのいい言葉ばかりに地元を奪われるわけにはいかんのだ。 |
| stories-79 | rival_types[7].lines.盟友 | 派閥や党を超えて実務の話ができる。お前さんがいると心強いよ。 |
| stories-80 | rival_types[7].lines.不信 | 約束の裏で別の顔を見せるやり方は、俺の性には合わんな。 |
| stories-81 | stories[0].title | 同じ空の下で |
| stories-82 | stories[0].summary | 接戦を演じたライバルと地元の課題を通じて対話し、宿命の好敵手か因縁の相手へと関係が定まる物語。 |
| stories-83 | stories[0].chapters[0].lines[0].text | 選挙の熱気も冷めやらぬ早朝、{district}の駅前に立つと、見覚えのある背中があった。 |
| stories-84 | stories[0].chapters[0].lines[1].text | おはよう、{self}さん。朝からご精が出ますね。この区は私も譲れませんよ。 |
| stories-85 | stories[0].chapters[0].lines[2].text | すぐ向こうは{rival_party}の{rival}氏ですね。先方は相当気合が入っています。 |
| stories-86 | stories[0].chapters[0].lines[3].text | 互いに引けない戦いだった。だが、同じ街で朝を迎えるのも縁かもしれない。 |
| stories-87 | stories[0].chapters[0].lines[4].text | 先日の得票差は僅かでした。次までに、どちらが住民の声を聞けるか勝負ですね。 |
| stories-88 | stories[0].chapters[0].choices[0].label | 笑顔で挨拶し健闘を讃える |
| stories-89 | stories[0].chapters[0].choices[0].result | {rival}は少し驚いたように目を丸くし、丁寧に頭を下げた。 |
| stories-90 | stories[0].chapters[0].choices[1].label | マイクで政策の違いを訴える |
| stories-91 | stories[0].chapters[0].choices[1].result | 双方が熱弁を振るい、通勤客の足が自然と止まった。 |
| stories-92 | stories[0].chapters[0].choices[1].risk.fail_result | 声が空回りし、ただの言い争いに見えてしまった。 |
| stories-93 | stories[0].chapters[0].choices[2].label | 目を合わさず持ち場に戻る |
| stories-94 | stories[0].chapters[0].choices[2].result | 背中に刺さるような無言の視線を感じた。 |
| stories-95 | stories[0].chapters[1].lines[0].text | 老朽化した市民ホールの改修を巡り、地元で住民説明会が開かれた。 |
| stories-96 | stories[0].chapters[1].lines[1].name | 町内会長 |
| stories-97 | stories[0].chapters[1].lines[1].text | 建て替えか修繕か、町内でも意見が割れておる。国や党の立場はどうなのだ。 |
| stories-98 | stories[0].chapters[1].lines[2].text | 財源を考えれば、段階的な修繕が現実的です。急ぎすぎて住民の負担を増やすべきではありません。 |
| stories-99 | stories[0].chapters[1].lines[3].text | だが防災拠点として使うなら、耐震基準から見直す抜本策も必要になる。 |
| stories-100 | stories[0].chapters[1].lines[4].text | 確かに、避難所機能の強化は外せませんね。そこは{self}さんのおっしゃる通りです。 |
| stories-101 | stories[0].chapters[1].lines[5].text | 会場の空気が張り詰める中、{rival}の視線がこちらへ向けられた。 |
| stories-102 | stories[0].chapters[1].choices[0].label | 相手案を取り入れ折衷案を出す |
| stories-103 | stories[0].chapters[1].choices[0].result | {rival}も頷き、住民から安堵の拍手が起きた。 |
| stories-104 | stories[0].chapters[1].choices[0].risk.fail_result | 話がまとまらず、議論は平行線のまま終わった。 |
| stories-105 | stories[0].chapters[1].choices[1].label | 自分の理想案の優位性を説く |
| stories-106 | stories[0].chapters[1].choices[1].result | 熱意は伝わったが、{rival}とは平行線に終わった。 |
| stories-107 | stories[0].chapters[2].lines[0].text | 商店街の夏祭りの夜。提灯の明かりの下で、屋台の列に並ぶ{rival}と鉢合わせた。 |
| stories-108 | stories[0].chapters[2].lines[1].text | 選挙の時は見えなかった路地裏の顔が、こういう日には見えますね。 |
| stories-109 | stories[0].chapters[2].lines[2].text | ここを守るために、互いに違う党から走っているのは不思議なものだ。 |
| stories-110 | stories[0].chapters[2].lines[3].text | でも、中央の論理を押し付けるだけでは、この街は守れません。それは同じ思いでしょう。 |
| stories-111 | stories[0].chapters[2].lines[4].name | 商店会長 |
| stories-112 | stories[0].chapters[2].lines[4].text | お二人とも、たまには党の看板を下ろして飲んでいきなさいよ。 |
| stories-113 | stories[0].chapters[2].lines[5].text | 祭りばやしが遠ざかる裏通りで、二人の距離が試されていた。 |
| stories-114 | stories[0].chapters[2].choices[0].label | 商店街の課題を二人で聞き歩く |
| stories-115 | stories[0].chapters[2].choices[0].result | 店主たちから「いい競争相手だな」と声が上がった。 |
| stories-116 | stories[0].chapters[2].choices[1].label | 立場は違うと一線を引いて話す |
| stories-117 | stories[0].chapters[2].choices[1].result | {rival}は寂しそうに笑い、丁寧に一礼して去った。 |
| stories-118 | stories[0].chapters[2].choices[2].label | 党を超えた地域課題を議論する |
| stories-119 | stories[0].chapters[2].choices[2].result | 互いの政策の芯に触れ、深い手応えを感じた。 |
| stories-120 | stories[0].chapters[2].choices[2].risk.fail_result | 議論が噛み合わず、気まずい沈黙が流れた。 |
| stories-121 | stories[0].chapters[3].lines[0].text | 再び解散風が吹き始めた。選挙準備に追われる事務所の前に、{rival}が立っていた。 |
| stories-122 | stories[0].chapters[3].lines[1].text | 表敬挨拶というのも変ですが、次に勝つのは私だと伝えに来ました。 |
| stories-123 | stories[0].chapters[3].lines[2].text | 敵陣営が直々に乗り込んでくるとは、肝が据わっていますね……。 |
| stories-124 | stories[0].chapters[3].lines[3].text | わざわざご丁寧に。こちらも一議席を譲るつもりはない。 |
| stories-125 | stories[0].chapters[3].lines[4].text | {district}の有権者が選ぶのはどちらの未来か、いよいよ決着ですね。 |
| stories-126 | stories[0].chapters[3].choices[0].label | 正々堂々、最高の勝負を誓う |
| stories-127 | stories[0].chapters[3].choices[0].result | 固い握手のあと、互いの陣営へ背を向けた。 |
| stories-128 | stories[0].chapters[3].choices[1].label | 今度こそ圧倒的な差をつけると告ぐ |
| stories-129 | stories[0].chapters[3].choices[1].result | {rival}の目が鋭く光り、火花が散るようだった。 |
| stories-130 | stories[0].chapters[3].choices[2].label | 互いの健闘を静かに祈って見送る |
| stories-131 | stories[0].chapters[3].choices[2].result | 多くを語らずとも、戦友のような空気が残った。 |
| stories-132 | stories[0].endings[0].title | 誇り高き好敵手 |
| stories-133 | stories[0].endings[0].text | 立場は違えど街を想う芯は同じ。二人の切磋琢磨は{district}の政治を熱くした。 |
| stories-134 | stories[0].endings[1].title | 宿命の因縁 |
| stories-135 | stories[0].endings[1].text | 一歩も譲らぬ激突の果てに、二人の名は負けられない因縁として地域に刻まれた。 |
| stories-136 | stories[0].endings[2].title | すれ違った背中 |
| stories-137 | stories[0].endings[2].text | 状況が変わり、ライバルとの因縁に決着をつける機会は遠のいていった。 |
| stories-138 | stories[1].title | 敵陣の灯り |
| stories-139 | stories[1].summary | ライバルの会計処理ミス疑惑と持病による離脱の危機に直面し、政敵としてどう振る舞うかを問われる。 |
| stories-140 | stories[1].chapters[0].lines[0].text | 先生、耳寄りですが少し気になる情報が入りました。 |
| stories-141 | stories[1].chapters[0].lines[1].text | {rival}氏の事務所で事務処理の記載漏れが見つかり、近く報道されるそうです。 |
| stories-142 | stories[1].chapters[0].lines[2].text | あの生真面目な{rival}氏が？　単なるミスか、それとも何か無理があったのか。 |
| stories-143 | stories[1].chapters[0].lines[3].text | 実は、ご本人が数か月前から病院に通っている姿も目撃されています。 |
| stories-144 | stories[1].chapters[0].lines[4].text | ライバルの足元に揺らぎが生じている。この情報をどう扱うべきか。 |
| stories-145 | stories[1].chapters[0].choices[0].label | 騒ぎに乗らず公式発表を待つ |
| stories-146 | stories[1].chapters[0].choices[0].result | 下手に動かず、日々の地元活動に腰を据えた。 |
| stories-147 | stories[1].chapters[0].choices[1].label | 独自に陣営の周辺を調べさせる |
| stories-148 | stories[1].chapters[0].choices[1].result | 単なる担当者の記載漏れで、不正ではないと分かった。 |
| stories-149 | stories[1].chapters[0].choices[1].risk.fail_result | 調べていることが漏れ、姑息だと噂が立った。 |
| stories-150 | stories[1].chapters[1].lines[0].text | 数週間後、{rival}は自ら会見を開き、会計訂正と持病の治療のための休養を公表した。 |
| stories-151 | stories[1].chapters[1].lines[1].name | ベテラン記者 |
| stories-152 | stories[1].chapters[1].lines[1].text | 会見では素直に非を認めていましたが、他陣営からは追及の声も上がっています。 |
| stories-153 | stories[1].chapters[1].lines[2].name | ベテラン記者 |
| stories-154 | stories[1].chapters[1].lines[2].text | 同じ{district}の対立候補として、{self}さんはこの件をどう見ますか。 |
| stories-155 | stories[1].chapters[1].lines[3].text | 厳しく叩けば支持層には響きますが、病気の相手を責めるリスクもあります。 |
| stories-156 | stories[1].chapters[1].lines[4].text | 記者のマイクが向けられる。一言の選び方が今後を左右する。 |
| stories-157 | stories[1].chapters[1].choices[0].label | 真摯な説明を認め、快復を願う |
| stories-158 | stories[1].chapters[1].choices[0].result | 誠実な対応だと報じられ、{rival}の陣営も安堵した様子だった。 |
| stories-159 | stories[1].chapters[1].choices[1].label | 管理責任の甘さを厳しく追及する |
| stories-160 | stories[1].chapters[1].choices[1].result | 正論として一部で支持されたが、冷淡だとの声も出た。 |
| stories-161 | stories[1].chapters[1].choices[2].label | 論評を控え、政策議論に専念する |
| stories-162 | stories[1].chapters[1].choices[2].result | 無難なコメントに留め、自身の活動報告を続けた。 |
| stories-163 | stories[1].chapters[2].lines[0].text | 地元の総合病院へ福祉視察に訪れた帰り、ロビーで杖をついた{rival}と出会った。 |
| stories-164 | stories[1].chapters[2].lines[1].text | {self}さん……。お恥ずかしい姿をお見せしました。もうすぐ退院です。 |
| stories-165 | stories[1].chapters[2].lines[2].text | 顔色は悪くなさそうですね。無理をしてぶり返さないようにしてください。 |
| stories-166 | stories[1].chapters[2].lines[3].text | 病室で何度も考えました。私たちが争っている間も、この町の課題は待ってくれません。 |
| stories-167 | stories[1].chapters[2].lines[4].text | もし私が倒れていたら、あの介護施設の計画はどうなっていたでしょうね。 |
| stories-168 | stories[1].chapters[2].lines[5].text | 政敵としてではなく、一人の人間としての言葉が胸に刺さった。 |
| stories-169 | stories[1].chapters[2].choices[0].label | 快復後にまた議場で競おうと励ます |
| stories-170 | stories[1].chapters[2].choices[0].result | {rival}は目を細め、力強く頷き返した。 |
| stories-171 | stories[1].chapters[2].choices[1].label | 地域の医療課題について聞き取る |
| stories-172 | stories[1].chapters[2].choices[1].result | 患者目線の切実な改善点を知ることができた。 |
| stories-173 | stories[1].chapters[2].choices[1].risk.fail_result | 話が噛み合わず、疲れさせてしまった。 |
| stories-174 | stories[1].chapters[2].choices[2].label | 支援者が待つなら早く戻れと告げる |
| stories-175 | stories[1].chapters[2].choices[2].result | {rival}は苦笑いし、「厳しいですね」と呟いた。 |
| stories-176 | stories[1].chapters[3].lines[0].text | 春、復帰を果たした{rival}と同じ公開討論会の壇上に並んだ。 |
| stories-177 | stories[1].chapters[3].lines[1].text | 皆さん、お騒がせしました。今日からは政策の中身で競い合いたいと思います。 |
| stories-178 | stories[1].chapters[3].lines[2].name | 司会者 |
| stories-179 | stories[1].chapters[3].lines[2].text | 会場からは大きな拍手です。それでは{self}さんからも一言どうぞ。 |
| stories-180 | stories[1].chapters[3].lines[3].text | （過去の騒動を乗り越えた相手と、これからどう向かい合うか……） |
| stories-181 | stories[1].chapters[3].lines[4].text | 聴衆の視線が集まる中、マイクを握り直した。 |
| stories-182 | stories[1].chapters[3].choices[0].label | 復帰を歓迎し、政策議論を誓う |
| stories-183 | stories[1].chapters[3].choices[0].result | 会場が温かい拍手に包まれ、実りある討論となった。 |
| stories-184 | stories[1].chapters[3].choices[1].label | 過去の管理責任を改めて問う |
| stories-185 | stories[1].chapters[3].choices[1].result | 会場は凍りつき、{rival}の表情から笑顔が消えた。 |
| stories-186 | stories[1].chapters[3].choices[2].label | 敬意は払いつつ政策の甘さを突く |
| stories-187 | stories[1].chapters[3].choices[2].result | 火花を散らす真剣勝負に、聴衆も身を乗り出した。 |
| stories-188 | stories[1].chapters[3].choices[2].risk.fail_result | 言葉が鋭すぎて嫌味に聞こえ、空気を悪くした。 |
| stories-189 | stories[1].endings[0].title | 党派を超えた敬意 |
| stories-190 | stories[1].endings[0].text | 苦境に手を差し伸べたことで、二人の間に政治家の誇りを通じた深い信頼が芽生えた。 |
| stories-191 | stories[1].endings[1].title | 消えぬ不信の溝 |
| stories-192 | stories[1].endings[1].text | 容赦ない追及は勝利への執念を見せたが、両者の間に深いわだかまりを残した。 |
| stories-193 | stories[1].endings[2].title | 風の向きが変わる |
| stories-194 | stories[1].endings[2].text | ライバルの離脱や状況の変化により、騒動は静かに幕を閉じた。 |
| stories-195 | stories[2].title | 分かれ道の同期 |
| stories-196 | stories[2].summary | 同じ選挙で初当選した同期が党内で急台頭し、やがて逆風に晒されて失脚するまでの葛藤と再起の記録。 |
| stories-197 | stories[2].chapters[0].lines[0].text | 国会の赤絨毯を歩いていると、同期の{doki}が晴れやかな顔で駆け寄ってきた。 |
| stories-198 | stories[2].chapters[0].lines[1].text | 聞いたぞ、{self}！　今度の重要法案の取りまとめ、俺が責任者に抜擢されたんだ。 |
| stories-199 | stories[2].chapters[0].lines[2].text | 本当か。同期の中から抜擢とはすごいな、少し羨ましいくらいだ。 |
| stories-200 | stories[2].chapters[0].lines[3].text | 古株の連中が腰が重いからな。俺たちの世代で{party}の空気を変えてやるさ。 |
| stories-201 | stories[2].chapters[0].lines[4].text | 先を行く同期の勢いに、少しの焦りと期待が入り混じる。 |
| stories-202 | stories[2].chapters[0].choices[0].label | 心から祝い、協力を申し出る |
| stories-203 | stories[2].chapters[0].choices[0].result | {doki}は「頼りにしてるぞ」と肩を叩いた。 |
| stories-204 | stories[2].chapters[0].choices[1].label | 自分も負けないと対抗心を語る |
| stories-205 | stories[2].chapters[0].choices[1].result | {doki}はニヤリと笑い、「いい勝負だな」と言った。 |
| stories-206 | stories[2].chapters[1].lines[0].text | 数か月後、{doki}から都内の料亭に呼ばれた。そこには数人の若手議員が集まっていた。 |
| stories-207 | stories[2].chapters[1].lines[1].text | 実は、党の幹部へ提出する党改革の意見書を作った。{self}、お前も署名してくれ。 |
| stories-208 | stories[2].chapters[1].lines[2].text | 中身は立派だが、これは{senpai}たちベテラン勢への宣戦布告に見えかねないぞ。 |
| stories-209 | stories[2].chapters[1].lines[3].text | 波風を立てなきゃ何も変わらない。お前も事なかれ主義に染まったのか？ |
| stories-210 | stories[2].chapters[1].lines[4].text | （以前、{senpai}は「若いうちの暴走は足を掬われる」と言っていたな……） |
| stories-211 | stories[2].chapters[1].lines[5].text | 仲間の熱気に押されるべきか、それとも立ち止まるべきか。 |
| stories-212 | stories[2].chapters[1].choices[0].label | 腹を括って意見書に署名する |
| stories-213 | stories[2].chapters[1].choices[0].result | {doki}は力強く握手し、団結を誓った。 |
| stories-214 | stories[2].chapters[1].choices[1].label | 表現を和らげるよう説得する |
| stories-215 | stories[2].chapters[1].choices[1].result | 粘り強い調整で、角の取れた前向きな提言になった。 |
| stories-216 | stories[2].chapters[1].choices[1].risk.fail_result | 腰抜けと罵られ、その場の空気が凍りついた。 |
| stories-217 | stories[2].chapters[1].choices[2].label | 党の結束を重んじて署名を断る |
| stories-218 | stories[2].chapters[1].choices[2].result | {doki}は寂しそうな目をして、「分かった」とだけ言った。 |
| stories-219 | stories[2].chapters[2].lines[0].text | 党内対立が表面化する中、週刊誌に{doki}の強引な資金集めや失言の疑惑が載った。 |
| stories-220 | stories[2].chapters[2].lines[1].text | だから言わんこっちゃない。党を守るため、奴の役職を解く議論が出ている。 |
| stories-221 | stories[2].chapters[2].lines[2].text | {self}、一部の切り取り記事で俺は潰されそうだ。味方になってくれないか。 |
| stories-222 | stories[2].chapters[2].lines[3].text | 強引な面はあったが、事実と違う部分まで誇張されているようにも見える。 |
| stories-223 | stories[2].chapters[2].lines[4].name | 党職員 |
| stories-224 | stories[2].chapters[2].lines[4].text | 会議が始まります！　党の幹部は今すぐ処分を決めたい構えです。 |
| stories-225 | stories[2].chapters[2].lines[5].text | 党本部の廊下で、逆風に晒された同期を前に決断を迫られた。 |
| stories-226 | stories[2].chapters[2].choices[0].label | 党内で必死に{doki}を擁護する |
| stories-227 | stories[2].chapters[2].choices[0].result | 擁護に回ったことで、党の幹部からの風当たりがこちらにも来た。 |
| stories-228 | stories[2].chapters[2].choices[1].label | 根回しして釈明の機会を作る |
| stories-229 | stories[2].chapters[2].choices[1].result | 重鎮たちを説得し、公開の場で説明させる道を開いた。 |
| stories-230 | stories[2].chapters[2].choices[1].risk.fail_result | 奔走虚しく、会議は処分ありきで閉じられた。 |
| stories-231 | stories[2].chapters[2].choices[2].label | 党の規律を優先し距離を置く |
| stories-232 | stories[2].chapters[2].choices[2].result | {doki}は冷たい目でこちらを一瞥し、会議室へ消えた。 |
| stories-233 | stories[2].chapters[3].lines[0].text | 結局、{doki}は役職を辞任し、党内の要職から外された。静かな店の隅で二人向き合う。 |
| stories-234 | stories[2].chapters[3].lines[1].text | 惨めなものだな。あんなに人が寄ってきたのに、潮が引くように誰もいなくなった。 |
| stories-235 | stories[2].chapters[3].lines[2].text | 権力に集まる人はそんなものだ。だが、本当に大事なものはまだ残っているはずだ。 |
| stories-236 | stories[2].chapters[3].lines[3].text | ……お前は、これからどうするんだ。俺と同じ道は踏むなよ。 |
| stories-237 | stories[2].chapters[3].lines[4].text | 失意の底にある同期に、かける言葉を選ぶ。 |
| stories-238 | stories[2].chapters[3].choices[0].label | 再起への政策プランを共に練る |
| stories-239 | stories[2].chapters[3].choices[0].result | {doki}の目に、わずかながら昔の熱が戻ってきた。 |
| stories-240 | stories[2].chapters[3].choices[0].risk.fail_result | 考えがまとまらず、ただ励まし合うだけに終わった。 |
| stories-241 | stories[2].chapters[3].choices[1].label | 政治の厳しさを認め、各自で歩む |
| stories-242 | stories[2].chapters[3].choices[1].result | 静かに杯を空け、二人は言葉少なに店を出た。 |
| stories-243 | stories[2].chapters[4].lines[0].text | 半年後。地味な委員会で泥臭く質疑を重ねていた{doki}が、再び評価を取り戻しつつあった。 |
| stories-244 | stories[2].chapters[4].lines[1].text | {self}、この間の騒動から随分と時間が経ったな。互いに色々なものが見えたよ。 |
| stories-245 | stories[2].chapters[4].lines[2].text | 一回り大きくなったな。また委員会や党の場で一緒に働ける日が楽しみだ。 |
| stories-246 | stories[2].chapters[4].lines[3].text | これからは同じ党の議員として、それぞれの筋を通していくとしよう。 |
| stories-247 | stories[2].chapters[4].lines[4].text | 試練をくぐり抜けた同期との関係に、一つの答えが出る。 |
| stories-248 | stories[2].chapters[4].choices[0].label | 恩義などいいから共に歩もう |
| stories-249 | stories[2].chapters[4].choices[0].result | {doki}は深く頭を下げ、「絶対に忘れない」と言った。 |
| stories-250 | stories[2].chapters[4].choices[1].label | 生涯の盟友として肩を組む |
| stories-251 | stories[2].chapters[4].choices[1].result | 二人の絆は、どんな役職にも代えがたい財産となった。 |
| stories-252 | stories[2].chapters[4].choices[2].label | 良きライバルとして切磋琢磨を誓う |
| stories-253 | stories[2].chapters[4].choices[2].result | それぞれの持ち場で競い合う、爽やかな別れとなった。 |
| stories-254 | stories[2].endings[0].title | 風雪を越えた盟友 |
| stories-255 | stories[2].endings[0].text | 栄光も挫折も分かち合った同期は、党内のどんな危機でも背中を預けられる盟友となった。 |
| stories-256 | stories[2].endings[1].title | 忘れられぬ恩義 |
| stories-257 | stories[2].endings[1].text | 孤立無援の時期に手を差し伸べたことで、{doki}はあなたに一生の恩義を感じている。 |
| stories-258 | stories[2].endings[2].title | それぞれの行く先 |
| stories-259 | stories[2].endings[2].text | 同じスタートラインから始まった二人は、やがて違う風景を見つめて歩み始めた。 |
| stories-260 | stories[3].title | 看板の重み |
| stories-261 | stories[3].summary | 引退を意識し始めた党の先輩から、長年の人脈と支持基盤を引き継ぐべきか迷う継承の物語。 |
| stories-262 | stories[3].chapters[0].lines[0].text | 会食の席で、いつも豪快な{senpai}が珍しく小さな文字の資料を遠ざけて目を細めた。 |
| stories-263 | stories[3].chapters[0].lines[1].text | 年には勝てんな。昔の仲間も一人減り、二人減りだ。お前もそろそろ背負う番だぞ。 |
| stories-264 | stories[3].chapters[0].lines[2].text | まだまだ先生には現場で引っ張っていただかないと困ります。 |
| stories-265 | stories[3].chapters[0].lines[3].text | おだてるな。俺が持つ県内の連絡会や業界との窓口、誰かに渡さにゃならんのだ。 |
| stories-266 | stories[3].chapters[0].lines[4].text | {senpai}の視線が、後継者を見定めるように静かに注がれた。 |
| stories-267 | stories[3].chapters[0].choices[0].label | 先生の志をぜひ学ばせてほしい |
| stories-268 | stories[3].chapters[0].choices[0].result | {senpai}は満足そうに頷き、盃を傾けた。 |
| stories-269 | stories[3].chapters[0].choices[1].label | 自分のやり方で力を示したい |
| stories-270 | stories[3].chapters[0].choices[1].result | {senpai}は「生意気だが悪くない」と笑った。 |
| stories-271 | stories[3].chapters[1].lines[0].text | {senpai}が会長を務める党内の重要部会で、後任に{self}を推す声が上がった。 |
| stories-272 | stories[3].chapters[1].lines[1].name | 古参議員 |
| stories-273 | stories[3].chapters[1].lines[1].text | 当選回数も浅い若手に任せられるか！　先輩の顔に免じても、順番というものがある。 |
| stories-274 | stories[3].chapters[1].lines[2].text | 順番を待っていたら党が腐る。だが、周囲を黙らせるだけの仕事はお前自身で見せろ。 |
| stories-275 | stories[3].chapters[1].lines[3].text | 古参の方々のメンツを立てつつ、実務で納得させる必要がありますね。 |
| stories-276 | stories[3].chapters[1].lines[4].text | 党内の世代交代の壁に、どう向き合うか。 |
| stories-277 | stories[3].chapters[1].choices[0].label | 古参議員たちを一人ずつ説得する |
| stories-278 | stories[3].chapters[1].choices[0].result | 丁寧な根回しが効き、反発の声が収まった。 |
| stories-279 | stories[3].chapters[1].choices[0].risk.fail_result | 話がこじれ、青二才だと反感を買ってしまった。 |
| stories-280 | stories[3].chapters[1].choices[1].label | 政策の勉強会を開き実績で示す |
| stories-281 | stories[3].chapters[1].choices[1].result | 緻密な提言書に、反対派からも一目置かれた。 |
| stories-282 | stories[3].chapters[1].choices[1].risk.fail_result | 論理が硬すぎると古参から敬遠されてしまった。 |
| stories-283 | stories[3].chapters[1].choices[2].label | まだ早いと辞退し先輩を支える |
| stories-284 | stories[3].chapters[1].choices[2].result | {senpai}は「律儀な奴だ」と苦笑した。 |
| stories-285 | stories[3].chapters[2].lines[0].text | ついに{senpai}が次の総選挙への不出馬を決断し、県内の県議や団体長が集められた。 |
| stories-286 | stories[3].chapters[2].lines[1].text | 長年支えてくれた皆には感謝しかない。今後は{self}を俺だと思って盛り立ててくれ。 |
| stories-287 | stories[3].chapters[2].lines[2].name | 業界団体長 |
| stories-288 | stories[3].chapters[2].lines[2].text | 承知しました。先生のお顔を立て、予算陳情の窓口もそのまま引き継ぎましょう。 |
| stories-289 | stories[3].chapters[2].lines[3].text | （小声で）ただ、この団体は古い慣習や強引な要望も多く、丸呑みは危険です……。 |
| stories-290 | stories[3].chapters[2].lines[4].text | 大きな力には、必ず相応のしがらみがついて回る。 |
| stories-291 | stories[3].chapters[2].lines[5].text | 用意された巨大な看板を、どう受け止めるべきか。 |
| stories-292 | stories[3].chapters[2].choices[0].label | 透明化を条件にパイプを引き継ぐ |
| stories-293 | stories[3].chapters[2].choices[0].result | 新ルールを提案し、健全な連携体制を築いた。 |
| stories-294 | stories[3].chapters[2].choices[0].risk.fail_result | 礼儀知らずと怒りを買い、支援が遠のいた。 |
| stories-295 | stories[3].chapters[2].choices[1].label | 義理を重んじ、看板を丸ごと背負う |
| stories-296 | stories[3].chapters[2].choices[1].result | 「頼もしい後継だ」と地元重鎮たちが沸いた。 |
| stories-297 | stories[3].chapters[2].choices[2].label | 志だけ受け継ぎ、団体人脈は断る |
| stories-298 | stories[3].chapters[2].choices[2].result | 清潔な姿勢は評価されたが、{senpai}は少し寂しそうだった。 |
| stories-299 | stories[3].chapters[3].lines[0].text | 任期満了の日。荷物をまとめた議員会館の部屋で、{senpai}は胸から議員バッジを外した。 |
| stories-300 | stories[3].chapters[3].lines[1].text | 長かったが、良い幕引きだった。お前がいてくれて助かったよ。 |
| stories-301 | stories[3].chapters[3].lines[2].text | 先生から教わった政治の奥深さは、一生忘れません。 |
| stories-302 | stories[3].chapters[3].lines[3].text | あとは時代に合わせてお前が変えろ。それが俺の望みだ。 |
| stories-303 | stories[3].chapters[3].lines[4].text | 大きな背中を見送り、自身の肩にかかる重みを確かめた。 |
| stories-304 | stories[3].chapters[3].choices[0].label | 新しい時代を切り拓くと誓う |
| stories-305 | stories[3].chapters[3].choices[0].result | {senpai}は目を細め、力強く頷いて部屋を去った。 |
| stories-306 | stories[3].chapters[3].choices[1].label | 先生の看板を必ず守り抜くと誓う |
| stories-307 | stories[3].chapters[3].choices[1].result | {senpai}は安心したように笑い、固く握手した。 |
| stories-308 | stories[3].chapters[3].choices[2].label | 自分なりの政治を貫きますと告げる |
| stories-309 | stories[3].chapters[3].choices[2].result | 「それでいい」と笑い、{senpai}は廊下へ消えた。 |
| stories-310 | stories[3].endings[0].title | 受け継がれた系譜 |
| stories-311 | stories[3].endings[0].text | 党の重鎮から信頼と人脈のバトンを託され、{senpai}との師弟の絆が揺るぎないものになった。 |
| stories-312 | stories[3].endings[1].title | 己の足で立つ |
| stories-313 | stories[3].endings[1].text | 先輩の大きな庇護に頼り切らず、自らの政策と信念で未来を切り拓く道を選んだ。 |
| stories-314 | stories[3].endings[2].title | 届かなかったバトン |
| stories-315 | stories[3].endings[2].text | 議席を失うなどの変化が重なり、先輩の遺産を受け継ぐ機会は失われた。 |
| stories-316 | stories[4].title | 一番近い背中 |
| stories-317 | stories[4].summary | 長年支えてくれた秘書が、親の介護と自身の政治家への夢との間で揺れる姿に向き合う物語。 |
| stories-318 | stories[4].chapters[0].lines[0].text | 終電も近い事務所。いつも冷静な{secretary}が、電話口で誰かと声を潜めて話していた。 |
| stories-319 | stories[4].chapters[0].lines[1].text | すみません、私用で。実は実家の親が体調を崩し、しばらく通う必要がありそうです。 |
| stories-320 | stories[4].chapters[0].lines[2].text | ふと{secretary}の机の端を見ると、地元の地方選挙の立候補説明会の要項が覗いていた。 |
| stories-321 | stories[4].chapters[0].lines[3].text | 親御さんのことも心配だが、秘書の胸のうちにも別の迷いがあるのかもしれない。 |
| stories-322 | stories[4].chapters[0].lines[4].text | 申し訳ありません。すぐ仕事に戻りますので、気になさらず。 |
| stories-323 | stories[4].chapters[0].choices[0].label | 親御さんの様子を詳しく尋ねる |
| stories-324 | stories[4].chapters[0].choices[0].result | {secretary}は少し肩の力を抜き、事情を話してくれた。 |
| stories-325 | stories[4].chapters[0].choices[1].label | 無理はしないよう軽く声をかける |
| stories-326 | stories[4].chapters[0].choices[1].result | {secretary}は丁寧にお辞儀をし、黙々と資料を整理した。 |
| stories-327 | stories[4].chapters[1].lines[0].text | 数か月後、病院ロビー。検査を終えた親を送り出した{secretary}と合流し、差し入れを渡す。 |
| stories-328 | stories[4].chapters[1].lines[1].text | お気遣いありがとうございます。おかげで親の容態も落ち着いて、一安心しました。 |
| stories-329 | stories[4].chapters[1].lines[2].text | 実は……いつかは自分も地方議員として地元の街を変えたい夢が芽生えたのです。 |
| stories-330 | stories[4].chapters[1].lines[3].text | この世界を一番近くで見てきたのだ。志を持つのも自然なことだろう。 |
| stories-331 | stories[4].chapters[1].lines[4].text | でも、先生を支える役目を放り出す気はありません。ただ、正直に伝えておきたくて。 |
| stories-332 | stories[4].chapters[1].lines[5].text | 一番頼りにしてきた相棒の夢を前に、言葉を探す。 |
| stories-333 | stories[4].chapters[1].choices[0].label | いつか挑戦できるよう応援すると言う |
| stories-334 | stories[4].chapters[1].choices[0].result | {secretary}の目が潤み、「必ず恩返しします」と言った。 |
| stories-335 | stories[4].chapters[1].choices[1].label | 実務や政策を直接教えようと提案 |
| stories-336 | stories[4].chapters[1].choices[1].result | 仕事の合間に政策論を交わす時間が増えた。 |
| stories-337 | stories[4].chapters[1].choices[1].risk.fail_result | 議論が空回りし、互いの忙しさだけが募った。 |
| stories-338 | stories[4].chapters[1].choices[2].label | 今は離れられては困ると引き留める |
| stories-339 | stories[4].chapters[1].choices[2].result | {secretary}は表情を固くし、「承知しました」と答えた。 |
| stories-340 | stories[4].chapters[2].lines[0].text | 大口の支援団体との調整トラブルが重なり、事務所は連日火の車になっていた。 |
| stories-341 | stories[4].chapters[2].lines[1].name | 支援者 |
| stories-342 | stories[4].chapters[2].lines[1].text | 日程も要望もめちゃくちゃじゃないか！　秘書の管理はどうなっているんだ！ |
| stories-343 | stories[4].chapters[2].lines[2].text | 私の手配ミスです。自分の家のことで気が散っていたのかもしれません……。 |
| stories-344 | stories[4].chapters[2].lines[3].text | （ここで秘書一人に責任を押し付けるわけにはいかない） |
| stories-345 | stories[4].chapters[2].lines[4].text | ピリピリした空気の事務所で、どう動くかが問われている。 |
| stories-346 | stories[4].chapters[2].choices[0].label | 自分も頭を下げ、負担を分け合う |
| stories-347 | stories[4].chapters[2].choices[0].result | 誠意が伝わり、支援者も矛を収めてくれた。 |
| stories-348 | stories[4].chapters[2].choices[0].risk.fail_result | 収拾に手間取り、徹夜で対応する羽目になった。 |
| stories-349 | stories[4].chapters[2].choices[1].label | 私費を投じて臨時の手伝いを雇う |
| stories-350 | stories[4].chapters[2].choices[1].result | 人手が増えて事務所が落ち着きを取り戻した。 |
| stories-351 | stories[4].chapters[2].choices[2].label | プロなら自力で立て直せと突き放す |
| stories-352 | stories[4].chapters[2].choices[2].result | トラブルは片付いたが、事務所に冷たい空気が残った。 |
| stories-353 | stories[4].chapters[3].lines[0].text | 季節が巡り、朝の駅頭前の少し落ち着いた時間。{secretary}が改まって向き直った。 |
| stories-354 | stories[4].chapters[3].lines[1].text | 親のケアの体制も整い、自分の気持ちにも整理がつきました。 |
| stories-355 | stories[4].chapters[3].lines[2].text | 自分の選挙への挑戦は、先生を日本の真ん中へ送り出してからにすると決めました。 |
| stories-356 | stories[4].chapters[3].lines[3].text | そこまで背負わせるつもりはない。だが、その覚悟はありがたく受け取るよ。 |
| stories-357 | stories[4].chapters[3].lines[4].text | 長い旅を共にするパートナーの言葉を胸に、街へ踏み出す。 |
| stories-358 | stories[4].chapters[3].choices[0].label | その日まで、最高の相棒でいよう |
| stories-359 | stories[4].chapters[3].choices[0].result | {secretary}は力強く笑い、拡声器を差し出した。 |
| stories-360 | stories[4].chapters[3].choices[1].label | 家族のこともいつでも頼ってくれ |
| stories-361 | stories[4].chapters[3].choices[1].result | {secretary}は深く一礼し、「ありがとうございます」と微笑んだ。 |
| stories-362 | stories[4].chapters[3].choices[2].label | これからもプロとして厳しく頼む |
| stories-363 | stories[4].chapters[3].choices[2].result | {secretary}は表情を引き締め、「承知しました」と答えた。 |
| stories-364 | stories[4].endings[0].title | 志を共にする片腕 |
| stories-365 | stories[4].endings[0].text | 互いの夢を尊重し合い、{secretary}は誰よりも頼もしい生涯の相棒として支え続けた。 |
| stories-366 | stories[4].endings[1].title | 家族ぐるみの恩義 |
| stories-367 | stories[4].endings[1].text | 苦しい時に家庭の事情まで気遣ったことで、{secretary}との間に深い恩義が結ばれた。 |
| stories-368 | stories[4].endings[2].title | 割り切った距離 |
| stories-369 | stories[4].endings[2].text | 感情を交えない主従の線引きは徹底されたが、心の奥にはわずかな壁が残った。 |
| stories-370 | stories[5].title | 濁流のあとに |
| stories-371 | stories[5].summary | 大規模水害に襲われた地元で、復興のあり方を巡って割れる住民の意見と国の予算の壁に挑む物語。 |
| stories-372 | stories[5].chapters[0].lines[0].text | 記録的な豪雨が{pref}を襲い、{district}の一部でも道路が冠水し避難所が開かれた。 |
| stories-373 | stories[5].chapters[0].lines[1].name | 被災住民 |
| stories-374 | stories[5].chapters[0].lines[1].text | 政治家は選挙の時だけ頭を下げて、肝心な防災工事を後回しにしてきたんじゃないか！ |
| stories-375 | stories[5].chapters[0].lines[2].text | 泥だらけの現場で、皆さんかなり気が立っています。落ち着いて聞きましょう。 |
| stories-376 | stories[5].chapters[0].lines[3].text | 今は言い訳はいらない。何が足りていないのか、一つ残らず拾い上げる時だ。 |
| stories-377 | stories[5].chapters[0].lines[4].text | 降り続く雨の中、泥水を踏んで公民館へ向かった。 |
| stories-378 | stories[5].chapters[0].choices[0].label | 住民の怒りを受け止め要望をメモ |
| stories-379 | stories[5].chapters[0].choices[0].result | 朝まで避難所を回り、切実なリストをまとめた。 |
| stories-380 | stories[5].chapters[0].choices[1].label | 即座に省庁へ掛け合い物資を呼ぶ |
| stories-381 | stories[5].chapters[0].choices[1].result | 素早い手配が実り、緊急の支援物資が届いた。 |
| stories-382 | stories[5].chapters[0].choices[1].risk.fail_result | 縦割り行政に阻まれ、手続きに手間取った。 |
| stories-383 | stories[5].chapters[1].lines[0].text | 応急復旧が終わり、今後の復興計画を巡る住民会議で二つの意見が激しくぶつかった。 |
| stories-384 | stories[5].chapters[1].lines[1].name | 商店会長 |
| stories-385 | stories[5].chapters[1].lines[1].text | 代々続く商店街を移すわけにはいかん。堤防をかさ上げして、この場所で再建したい。 |
| stories-386 | stories[5].chapters[1].lines[2].name | 子育て世代の親 |
| stories-387 | stories[5].chapters[1].lines[2].text | また同じ浸水が起きると思うと怖いです。補助を出して安全な高台へ移転させてください。 |
| stories-388 | stories[5].chapters[1].lines[3].text | 暮らしの誇りか、未来の安全か。どちらの言い分も間違っていないからこそ難しい。 |
| stories-389 | stories[5].chapters[1].lines[4].text | 地域の代表者たちの視線が、国とのパイプ役であるこちらに集まる。 |
| stories-390 | stories[5].chapters[1].choices[0].label | 今の街並みを守る現地再建案を推す |
| stories-391 | stories[5].chapters[1].choices[0].result | 商店街から歓迎されたが、若手住民には不安も残った。 |
| stories-392 | stories[5].chapters[1].choices[1].label | 安全最優先で高台移転を説得する |
| stories-393 | stories[5].chapters[1].choices[1].result | 将来の被害を防ぐ論理が通り、計画がまとまった。 |
| stories-394 | stories[5].chapters[1].choices[1].risk.fail_result | 古里を奪う気かと反発を受け、会議が紛糾した。 |
| stories-395 | stories[5].chapters[1].choices[2].label | 居住は高台、商業は防災整備を提案 |
| stories-396 | stories[5].chapters[1].choices[2].result | 折衷案に双方が歩み寄り、議論が前進した。 |
| stories-397 | stories[5].chapters[2].lines[0].text | 国会の委員会。住民合意をもとに{district}への特例復興予算を求めたが、政府の壁は厚い。 |
| stories-398 | stories[5].chapters[2].lines[1].name | 省庁幹部 |
| stories-399 | stories[5].chapters[2].lines[1].text | 一地域だけ特例を認めれば、全国の被災地との公平性が保てません。通常予算の範囲内で。 |
| stories-400 | stories[5].chapters[2].lines[2].text | 机上の公平論で、今も仮設住宅で震えている人の明日が救えるというのですか！ |
| stories-401 | stories[5].chapters[2].lines[3].text | （傍聴席には地元の県議や代表者も見えています。ここが正念場です！） |
| stories-402 | stories[5].chapters[2].lines[4].text | 予算を勝ち取るための最後の攻勢をかける。 |
| stories-403 | stories[5].chapters[2].choices[0].label | 現場の写真を示し特例予算を迫る |
| stories-404 | stories[5].chapters[2].choices[0].result | 迫真の質疑がニュースで報じられ、政府が譲歩した。 |
| stories-405 | stories[5].chapters[2].choices[0].risk.fail_result | 感情論と受け流され、特例枠は見送られた。 |
| stories-406 | stories[5].chapters[2].choices[1].label | 近隣区の議員と組み共同要望を出す |
| stories-407 | stories[5].chapters[2].choices[1].result | 広域連携の枠組みで、粘り強く予算を確保した。 |
| stories-408 | stories[5].chapters[3].lines[0].text | 災害から長い月日が流れ、新しい防災施設と活気を取り戻した商店街で式典が開かれた。 |
| stories-409 | stories[5].chapters[3].lines[1].name | 町内会長 |
| stories-410 | stories[5].chapters[3].lines[1].text | あの時、あんたが泥だらけで話を聞いてくれたこと、みんな忘れちゃおらんよ。 |
| stories-411 | stories[5].chapters[3].lines[2].text | 地域の皆さんの底力があってこそです。まだ課題はありますが、一歩前へ進みましたね。 |
| stories-412 | stories[5].chapters[3].lines[3].text | この景色が見られて、本当に良かったです。 |
| stories-413 | stories[5].chapters[3].lines[4].text | 復興の明かりを前に、改めてこの街と歩む決意を固める。 |
| stories-414 | stories[5].chapters[3].choices[0].label | 笑顔の街を胸に、次の防災へ動く |
| stories-415 | stories[5].chapters[3].choices[0].result | 住民たちの万雷の拍手が、広場に響き渡った。 |
| stories-416 | stories[5].chapters[3].choices[1].label | 支えてくれた全ての人に礼を述べる |
| stories-417 | stories[5].chapters[3].choices[1].result | 県議や住民との絆が、盤石な力へと変わった。 |
| stories-418 | stories[5].chapters[3].choices[2].label | まだ道半ばだと気を引き締める |
| stories-419 | stories[5].chapters[3].choices[2].result | 厳しい表情のまま頷き、さらなる防災を誓った。 |
| stories-420 | stories[5].endings[0].title | 復興の灯をともす |
| stories-421 | stories[5].endings[0].text | 泥に塗れて奔走した日々が実を結び、地元の深い信頼と現場の声を聴く力を得た。 |
| stories-422 | stories[5].endings[1].title | 道半ばの誓い |
| stories-423 | stories[5].endings[1].text | 完全な復興にはまだ遠いことを胸に刻み、防災政策の専門家として歩みを続けた。 |
| stories-424 | stories[5].endings[2].title | 議席なき無力 |
| stories-425 | stories[5].endings[2].text | 国会の議席を失っていたため、復興予算の正念場で十分な力を発揮できなかった。 |
| stories-426 | stories[6].title | 分水嶺の一票 |
| stories-427 | stories[6].summary | 党の方針である重要法案が地元の基幹産業に打撃を与える事態となり、党議拘束と地元の板挟みに苦悩する。 |
| stories-428 | stories[6].chapters[0].lines[0].text | {party}の重要会議で、国の長期財政や規制を見直す大型法案が了承された。 |
| stories-429 | stories[6].chapters[0].lines[1].text | 異論はあるかもしれんが、党の幹部一任だ。採決では党議拘束をかける。全員賛成しろ。 |
| stories-430 | stories[6].chapters[0].lines[2].text | しかし、この基準がそのまま通れば{district}の地元産業は立ち行かなくなります！ |
| stories-431 | stories[6].chapters[0].lines[3].text | お前のところだけ特別扱いはできん。大局を見るのも国会議員の仕事だぞ。 |
| stories-432 | stories[6].chapters[0].lines[4].text | 党の方針と地元の痛み。重い資料を抱えて事務所へ戻った。 |
| stories-433 | stories[6].chapters[0].choices[0].label | 党の会議で異議を唱え続ける |
| stories-434 | stories[6].chapters[0].choices[0].result | 疎まれながらも、地元の窮状を訴え続けた。 |
| stories-435 | stories[6].chapters[0].choices[1].label | 党の幹部と水面下で修正交渉をする |
| stories-436 | stories[6].chapters[0].choices[1].result | 厳しい条件付きながら、経過措置の検討を引き出した。 |
| stories-437 | stories[6].chapters[0].choices[1].risk.fail_result | 門前払いに終わり、全く相手にされなかった。 |
| stories-438 | stories[6].chapters[1].lines[0].text | 週末の地元。商店街の入り口に、地域の商工業者や働き手たちが不安げな顔で集まっていた。 |
| stories-439 | stories[6].chapters[1].lines[1].name | 組合代表 |
| stories-440 | stories[6].chapters[1].lines[1].text | あんた、まさか東京の偉いさんに言われるまま賛成ボタンを押すつもりじゃないだろうな！ |
| stories-441 | stories[6].chapters[1].lines[2].name | 商店街の店主 |
| stories-442 | stories[6].chapters[1].lines[2].text | ここで工場や店が潰れたら、この町の灯りが消えてしまいます。助けてください。 |
| stories-443 | stories[6].chapters[1].lines[3].text | ここで曖昧な返事をすれば、後援会の離反が起きかねません……。 |
| stories-444 | stories[6].chapters[1].lines[4].text | だが、軽々に造反を約束すれば党内での居場所を失う。 |
| stories-445 | stories[6].chapters[1].lines[5].text | 真っ直ぐな地元住民の視線に、答えを迫られた。 |
| stories-446 | stories[6].chapters[1].choices[0].label | 地元を守るため反対すると誓う |
| stories-447 | stories[6].chapters[1].choices[0].result | 大きな歓声が上がったが、背中に重い十字架を背負った。 |
| stories-448 | stories[6].chapters[1].choices[1].label | 構造改革の必要性を誠実に説明する |
| stories-449 | stories[6].chapters[1].choices[1].result | 納得は完全でないが、真剣な姿勢は理解された。 |
| stories-450 | stories[6].chapters[1].choices[1].risk.fail_result | 「冷たい政治家だ」とヤジが飛び、場が荒れた。 |
| stories-451 | stories[6].chapters[1].choices[2].label | 救済策の確約を取るまで動くと答える |
| stories-452 | stories[6].chapters[1].choices[2].result | 住民たちは期待と不安の入り混じった顔で頷いた。 |
| stories-453 | stories[6].chapters[2].lines[0].text | 採決の前夜。料亭の個室に{senpai}から呼び出され、冷え切った茶を前に向き合う。 |
| stories-454 | stories[6].chapters[2].lines[1].text | 地元での動きは耳に入っている。明日の本会議で造反すれば、役職も公認も危うくなるぞ。 |
| stories-455 | stories[6].chapters[2].lines[2].text | それでも、私を議場へ送り出してくれたのは{district}の有権者です。 |
| stories-456 | stories[6].chapters[2].lines[3].text | 青いな。だが政治家は自分の責任を取れるなら、好きに選べ。お前の覚悟を見せろ。 |
| stories-457 | stories[6].chapters[2].lines[4].text | 運命の一票を投じる朝が、もうそこまで迫っていた。 |
| stories-458 | stories[6].chapters[2].choices[0].label | 処分を覚悟で造反の一票を投じる |
| stories-459 | stories[6].chapters[2].choices[0].result | 本会議場がどよめく中、己の信念の一票を投じた。 |
| stories-460 | stories[6].chapters[2].choices[1].label | 付帯決議と地元補助を条件に賛成へ |
| stories-461 | stories[6].chapters[2].choices[1].result | 党幹部とのギリギリの交渉の末、救済予算をもぎ取った。 |
| stories-462 | stories[6].chapters[2].choices[1].risk.fail_result | 交渉が決裂し、ただ党に押し切られた形になった。 |
| stories-463 | stories[6].chapters[2].choices[2].label | 苦渋の末、党方針に従い賛成する |
| stories-464 | stories[6].chapters[2].choices[2].result | 党の規律は守ったが、地元への説明という重い宿題が残った。 |
| stories-465 | stories[6].chapters[3].lines[0].text | 採決の余波も落ち着いた国会。議事堂の廊下で、自分の取った道の結果を見つめ直す。 |
| stories-466 | stories[6].chapters[3].lines[1].text | 党本部からの反応も、地元の空気も、少しずつ新しい段階に移ってきています。 |
| stories-467 | stories[6].chapters[3].lines[2].text | 国益と地元の声。その二つを繋ぐ答えは、今も探し続けている。 |
| stories-468 | stories[6].chapters[3].lines[3].text | 今回の件で、お前の器が一つ試されたな。さあ、次の仕事はどうする。 |
| stories-469 | stories[6].chapters[3].lines[4].text | 下した決断の重みを背負い、議員としての次の一歩を選ぶ。 |
| stories-470 | stories[6].chapters[3].choices[0].label | 孤立を恐れず地元の代弁者を貫く |
| stories-471 | stories[6].chapters[3].choices[0].result | 反骨の議員として地元で不動の支持を得た。 |
| stories-472 | stories[6].chapters[3].choices[1].label | 現実解を掴む調整役として歩む |
| stories-473 | stories[6].chapters[3].choices[1].result | 党内でも一目置かれる実務家として歩み始めた。 |
| stories-474 | stories[6].chapters[3].choices[2].label | この経験を糧に、力を蓄え直す |
| stories-475 | stories[6].chapters[3].choices[2].result | 苦い教訓も糧にして、次の勝負を見据えた。 |
| stories-476 | stories[6].endings[0].title | 地元の防波堤 |
| stories-477 | stories[6].endings[0].text | 党の処分リスクを恐れず地元を守り抜いた姿は語り草となり、強固なドブ板の絆となった。 |
| stories-478 | stories[6].endings[1].title | 現実の調整者 |
| stories-479 | stories[6].endings[1].text | 理想と現実の間で泥臭く条件を引き出した手腕により、党と地元の双方から頼られる存在になった。 |
| stories-480 | stories[6].endings[2].title | 政治の現実を知りて |
| stories-481 | stories[6].endings[2].text | 党議拘束の重みと地元の悲哀を味わい、政治家として一回り厚みを増して歩み続けた。 |

### highlights（山場の場面と総選挙の一言）

| 番号 | 場所 | 文 |
|---|---|---|
| highlights-1 | scenes.ruling_change.title | 政権交代 |
| highlights-2 | scenes.ruling_change.text | {old}中心の政権が倒れ、{new}中心の政権が生まれた。新しい首相は{new_pm}。 |
| highlights-3 | scenes.ruling_change.variants[0][0].text | 開票から一夜明け、永田町の空気は一変していた。 |
| highlights-4 | scenes.ruling_change.variants[0][1].text | 国民の審判を重く受け止める。政権を明け渡す。 |
| highlights-5 | scenes.ruling_change.variants[0][2].text | 期待に応えられなければ、次は我々が退く番だ。気を引き締めていく。 |
| highlights-6 | scenes.ruling_change.variants[1][0].text | 首相官邸の主が替わる。記者たちが一斉にカメラを構えた。 |
| highlights-7 | scenes.ruling_change.variants[1][1].text | 政権を担う重さを、今日ほど感じたことはない。 |
| highlights-8 | scenes.ruling_change.variants[1][2].text | 野党として、厳しく見させてもらう。 |
| highlights-9 | scenes.pm_change.title | 首相交代 |
| highlights-10 | scenes.pm_change.text | {old_pm}首相が退き、{new_pm}が新しい首相に就いた。 |
| highlights-11 | scenes.pm_change.variants[0][0].text | 後のことは、新しい党首に託したい。 |
| highlights-12 | scenes.pm_change.variants[0][1].text | 前首相の路線を引き継ぎつつ、私の色も出していく。 |
| highlights-13 | scenes.pm_change.variants[0][2].text | 先生、人事が動きますね。党の幹部の顔ぶれも変わりそうです。 |
| highlights-14 | scenes.pm_change.variants[1][0].text | 党首選を終え、新しい首相が官邸に入った。 |
| highlights-15 | scenes.pm_change.variants[1][1].text | まずは国民の信頼を取り戻すことから始めたい。 |
| highlights-16 | scenes.pm_change.variants[1][2].text | 先生、新しい内閣でも出番があるといいですね。 |
| highlights-17 | scenes.player_pm.title | 内閣総理大臣 |
| highlights-18 | scenes.player_pm.text | {party}の党首として、内閣総理大臣に就いた。 |
| highlights-19 | scenes.player_pm.variants[0][0].text | 初めて官邸の執務室に入る。窓の外に、記者たちの列が見えた。 |
| highlights-20 | scenes.player_pm.variants[0][1].text | 先生……いえ、総理。ここまで、長い道のりでした。 |
| highlights-21 | scenes.player_pm.variants[0][2].text | この椅子の重さは、座ってみないと分からない。健闘を祈る。 |
| highlights-22 | scenes.player_post.title | 就任 |
| highlights-23 | scenes.player_post.text | {post}に就いた。 |
| highlights-24 | scenes.player_post.variants[0][0].text | 君の力を借りたい。{post}を頼む。 |
| highlights-25 | scenes.player_post.variants[0][1].text | 先生、おめでとうございます！ 地元の皆さんにもすぐ知らせます。 |
| highlights-26 | scenes.player_post.variants[1][0].text | 先生、官邸から呼び出しの電話です。{post}だそうです！ |
| highlights-27 | scenes.player_post.variants[1][1].text | 期待している。結果で応えてほしい。 |
| highlights-28 | scenes.player_leader.title | 党首 |
| highlights-29 | scenes.player_leader.text | {party}の党首に選ばれた。 |
| highlights-30 | scenes.player_leader.variants[0][0].text | 党首選の結果が読み上げられ、会場から拍手が起きた。 |
| highlights-31 | scenes.player_leader.variants[0][1].text | 先生、ついに党の顔ですね。次は政権を取りに行きましょう。 |
| highlights-32 | election_lines.won_rival[0] | 力及ばずでした。応援してくださった皆さんに申し訳ない。 |
| highlights-33 | election_lines.won_rival[1] | 完敗です。次はこの悔しさを晴らします。 |
| highlights-34 | election_lines.won_rival[2] | 相手の地元の力に押し切られた。出直しです。 |
| highlights-35 | election_lines.lost_rival[0] | 厳しい戦いでした。支えてくださった皆さんのおかげです。 |
| highlights-36 | election_lines.lost_rival[1] | 最後まで分からなかった。気を引き締めて国政に臨みます。 |
| highlights-37 | election_lines.lost_rival[2] | 勝たせていただいた重みを、仕事で返していきます。 |
| highlights-38 | election_lines.won_self[0] | ありがとうございます！ 皆さんの声を国会に届けます。 |
| highlights-39 | election_lines.won_self[1] | この一票一票の重さを忘れずに働きます。 |
| highlights-40 | election_lines.won_self[2] | 支えてくれた家族と後援会の皆さんに感謝します。 |
| highlights-41 | election_lines.lost_self[0] | 私の力不足です。必ず戻ってきます。 |
| highlights-42 | election_lines.lost_self[1] | 地盤をもう一度固め直します。ここからが勝負です。 |
| highlights-43 | election_lines.lost_self[2] | 応援してくださった皆さん、本当にありがとうございました。 |

### skills（特殊能力とコツ）

| 番号 | 場所 | 文 |
|---|---|---|
| skills-1 | skills[0].name | 選挙の神様 |
| skills-2 | skills[0].description | 選挙に滅法強い。本人の票が大きく上乗せされる。 |
| skills-3 | skills[1].name | 根回しの鬼 |
| skills-4 | skills[1].description | 党内と県議団の関係が大きく上がりやすい。 |
| skills-5 | skills[2].name | 論破王 |
| skills-6 | skills[2].description | 討論や答弁で負けない。出来事の弁舌の判定に強く、街頭演説の経験点が増える。 |
| skills-7 | skills[3].name | 名門の看板 |
| skills-8 | skills[3].description | 一族の名前だけで票と献金が集まる。 |
| skills-9 | skills[4].name | 挨拶上手 |
| skills-10 | skills[4].description | 感じのよい挨拶で覚えてもらえる。後援会との関係が上がりやすい。 |
| skills-11 | skills[5].name | 勉強家 |
| skills-12 | skills[5].description | 資料をよく読む。政策勉強会の経験点が増える。 |
| skills-13 | skills[6].name | 聞き上手 |
| skills-14 | skills[6].description | 相手の話を最後まで聞く。県議団との関係が上がりやすい。 |
| skills-15 | skills[7].name | よく通る声 |
| skills-16 | skills[7].description | 駅前でも声が届く。街頭演説の経験点が少し増える。 |
| skills-17 | skills[8].name | 霞が関人脈 |
| skills-18 | skills[8].description | 官僚とのつながりで政策の勉強がはかどり、公務の成果も上がる。 |
| skills-19 | skills[9].name | ドブ板 |
| skills-20 | skills[9].description | 地元を歩くのが苦にならない。地元回りの経験点が増え、地盤が固まりやすくなる。 |
| skills-21 | skills[10].name | 組織票 |
| skills-22 | skills[10].description | 支援団体の票が固い。選挙で本人の票が上乗せされる。 |
| skills-23 | skills[11].name | 無党派に強い |
| skills-24 | skills[11].description | 顔と名前で無党派の票を取れる。選挙の票と発信の経験点が増える。 |
| skills-25 | skills[12].name | 専門家答弁 |
| skills-26 | skills[12].description | 専門分野の質問に強い。出来事の政策の判定に強く、政策勉強会の経験点が増える。 |
| skills-27 | skills[13].name | 行政手腕 |
| skills-28 | skills[13].description | 役所を動かすのがうまい。公務の成果と県議団との関係が上がりやすい。 |
| skills-29 | skills[14].name | 後援会継承 |
| skills-30 | skills[14].description | 親の後援会を受け継いだ。後援会との関係が上がりやすく、票も少し上乗せされる。 |
| skills-31 | skills[15].name | 財界人脈 |
| skills-32 | skills[15].description | 経済界に顔が利く。資金集めで得る資金が増える。 |
| skills-33 | skills[16].name | 段取り上手 |
| skills-34 | skills[16].description | 仕事の段取りがよい。どの活動でも経験点が少し増える。 |
| skills-35 | skills[17].name | 国際感覚 |
| skills-36 | skills[17].description | 海外の事情に明るい。政策勉強会と公務の経験点が増える。 |
| skills-37 | skills[18].name | 安保の実務 |
| skills-38 | skills[18].description | 安全保障の現場を知っている。公務と出来事の政策の判定に強い。 |
| skills-39 | skills[19].name | 現場の声 |
| skills-40 | skills[19].description | 現場の人の話を聞くのがうまい。後援会との関係が上がりやすく、地域行事の経験点が増える。 |
| skills-41 | skills[20].name | 辻説法 |
| skills-42 | skills[20].description | 駅前で足を止めさせる話術。街頭演説の経験点が増える。 |
| skills-43 | skills[21].name | 体力自慢 |
| skills-44 | skills[21].description | 疲れ知らず。活動で使う体力が減る。 |
| skills-45 | skills[22].name | 発信力 |
| skills-46 | skills[22].description | 言葉が広まりやすい。街頭演説の経験点が増え、地元紙との関係が上がりやすい。 |
| skills-47 | skills[23].name | 県議とのパイプ |
| skills-48 | skills[23].description | 県議会に太いつながりがある。県議団との関係が上がりやすい。 |
| skills-49 | skills[24].name | 失言癖 |
| skills-50 | skills[24].description | 口が滑りやすい。街頭演説のあとに失言することがある。 |
| skills-51 | skills[24].effects.mishap.text | 演説で口が滑り、失言として報じられた。 |
| skills-52 | skills[25].name | 比例頼み |
| skills-53 | skills[25].description | 小選挙区で勝ち切れない。選挙で本人の票が減る。 |
| skills-54 | skills[26].name | 地元不在 |
| skills-55 | skills[26].description | 地元に帰らない印象がある。地盤が早く下がり、地元回りの経験点が減る。 |
| skills-56 | skills[27].name | 調整下手 |
| skills-57 | skills[27].description | 根回しが苦手。党の幹部や県議団との関係が上がりにくい。 |
| skills-58 | skills[28].name | 炎上体質 |
| skills-59 | skills[28].description | 発言が問題になりやすい。街頭演説のあとに炎上することがある。 |
| skills-60 | skills[28].effects.mishap.text | 演説の切り抜き動画がネットで炎上した。 |
| skills-61 | skills[29].name | 苦労知らず |
| skills-62 | skills[29].description | 育ちのよさが鼻につく。選挙で本人の票が少し減る。 |
| skills-63 | skills[30].name | 病弱 |
| skills-64 | skills[30].description | 無理がきかない。活動で使う体力が増える。 |
| skills-65 | skills[31].name | 一匹狼 |
| skills-66 | skills[31].description | 群れない。党の幹部との関係は上がりにくいが、後援会には好かれる。 |
| skills-67 | skills[32].name | 劇場型 |
| skills-68 | skills[32].description | 目立つが危うい。街頭演説の経験点が増えるが、出来事の弁舌の判定に弱い。 |

### opposition（野党の役職、党首の行動、文）

| 番号 | 場所 | 文 |
|---|---|---|
| opposition-1 | posts.list[0].name | 幹事長 |
| opposition-2 | posts.list[1].name | 政調会長 |
| opposition-3 | posts.list[2].name | 国対委員長 |
| opposition-4 | posts.list[3].name | 選対委員長 |
| opposition-5 | posts.shadow.name | 影の大臣 |
| opposition-6 | texts.debate_win[0] | 党首討論で{pm}首相の答弁の食い違いを突き、委員会室がどよめいた。 |
| opposition-7 | texts.debate_win[1] | 党首討論で具体的な数字を示して迫り、{pm}首相は答えに詰まった。 |
| opposition-8 | texts.debate_win[2] | 党首討論で暮らしの実感を訴え、{pm}首相を守りに回らせた。 |
| opposition-9 | texts.debate_lose_unprepared[0] | 党首討論で「批判ばかりで対案がない」と切り返された。 |
| opposition-10 | texts.debate_lose_unprepared[1] | 党首討論で「では、あなたの党ならどうするのか」と問われ、言葉に詰まった。 |
| opposition-11 | texts.debate_lose_unprepared[2] | 党首討論で財源を問われ、具体案を示せなかった。 |
| opposition-12 | texts.debate_lose[0] | 党首討論で{pm}首相に実績を並べられ、押し返された。 |
| opposition-13 | texts.debate_lose[1] | 党首討論は時間切れで、決め手を欠いたまま終わった。 |
| opposition-14 | texts.debate_lose[2] | 党首討論で言葉尻を捉えられ、論点をずらされた。 |
| opposition-15 | texts.pursue_win[0] | 政権の失政を追及し、世論が動いた。 |
| opposition-16 | texts.pursue_win[1] | 委員会での追及が実り、政府が答弁を修正した。 |
| opposition-17 | texts.pursue_win[2] | 新しい資料を示して追及し、与党内からも説明を求める声が出た。 |
| opposition-18 | texts.pursue_lose[0] | 追及は空振りに終わり、「根拠が薄い」と逆に批判された。 |
| opposition-19 | texts.pursue_lose[1] | 追及した疑惑に自党の議員も関わっていたと報じられ、矛先が自分に向いた。 |
| opposition-20 | texts.pursue_lose[2] | 追及は報道されたものの、世論の関心は広がらなかった。 |

### parties（政党と思想の軸）

| 番号 | 場所 | 文 |
|---|---|---|
| parties-1 | ideology_axes[0].name | 経済 |
| parties-2 | ideology_axes[0].minus | 市場重視 |
| parties-3 | ideology_axes[0].plus | 再分配重視 |
| parties-4 | ideology_axes[1].name | 財政 |
| parties-5 | ideology_axes[1].minus | 積極財政 |
| parties-6 | ideology_axes[1].plus | 財政規律 |
| parties-7 | ideology_axes[2].name | 安保 |
| parties-8 | ideology_axes[2].minus | 抑止重視 |
| parties-9 | ideology_axes[2].plus | 対話重視 |
| parties-10 | ideology_axes[3].name | 社会 |
| parties-11 | ideology_axes[3].minus | 伝統重視 |
| parties-12 | ideology_axes[3].plus | 多様性重視 |
| parties-13 | ideology_axes[4].name | 統治 |
| parties-14 | ideology_axes[4].minus | 改革・分権 |
| parties-15 | ideology_axes[4].plus | 安定 |

### cabinet（内閣の役職）

| 番号 | 場所 | 文 |
|---|---|---|
| cabinet-1 | posts[0].name | 内閣総理大臣 |
| cabinet-2 | posts[0].fixed_role | 首相 |
| cabinet-3 | posts[1].name | 幹事長 |
| cabinet-4 | posts[2].name | 内閣官房長官 |
| cabinet-5 | posts[3].name | 政調会長 |
| cabinet-6 | posts[4].name | 総務会長 |
| cabinet-7 | posts[5].name | 財務大臣 |
| cabinet-8 | posts[6].name | 外務大臣 |
| cabinet-9 | posts[7].name | 防衛大臣 |
| cabinet-10 | posts[8].name | 経済産業大臣 |
| cabinet-11 | posts[9].name | 厚生労働大臣 |
| cabinet-12 | posts[10].name | 法務大臣 |
| cabinet-13 | posts[11].name | 総務大臣 |
| cabinet-14 | posts[12].name | 文部科学大臣 |
| cabinet-15 | posts[13].name | 農林水産大臣 |
| cabinet-16 | posts[14].name | 国土交通大臣 |

### character_tables（能力、経歴類型、家系、得意分野、性格）

| 番号 | 場所 | 文 |
|---|---|---|
| character_tables-1 | abilities[0] | 弁舌 |
| character_tables-2 | abilities[1] | 政策 |
| character_tables-3 | abilities[2] | 調整 |
| character_tables-4 | abilities[3] | 知名度 |
| character_tables-5 | abilities[4] | 組織 |
| character_tables-6 | abilities[5] | 資金 |
| character_tables-7 | specialties[0] | 財政・税制 |
| character_tables-8 | specialties[1] | 経済・産業 |
| character_tables-9 | specialties[2] | 農林水産 |
| character_tables-10 | specialties[3] | 厚生・労働 |
| character_tables-11 | specialties[4] | 教育 |
| character_tables-12 | specialties[5] | 国土・交通 |
| character_tables-13 | specialties[6] | 外交 |
| character_tables-14 | specialties[7] | 安全保障 |
| character_tables-15 | specialties[8] | 法務・治安 |
| character_tables-16 | specialties[9] | 地方・行政 |
| character_tables-17 | archetypes[0].name | 地方議員からの叩き上げ |
| character_tables-18 | archetypes[1].name | 官僚出身の政策通 |
| character_tables-19 | archetypes[2].name | 経済人 |
| character_tables-20 | archetypes[3].name | 知名度型 |
| character_tables-21 | archetypes[4].name | 専門職 |
| character_tables-22 | archetypes[5].name | 議員秘書出身 |
| character_tables-23 | archetypes[6].name | 学者・国際派 |
| character_tables-24 | archetypes[7].name | 組織内候補 |
| character_tables-25 | archetypes[8].name | 首長経験の行政型 |
| character_tables-26 | archetypes[9].name | 現場の代弁者 |
| character_tables-27 | archetypes[10].name | 安全保障の実務家 |
| character_tables-28 | archetypes[11].name | 汎用 |
| character_tables-29 | term_tiers[0].name | 新人 |
| character_tables-30 | term_tiers[1].name | 中堅 |
| character_tables-31 | term_tiers[2].name | ベテラン |
| character_tables-32 | term_tiers[3].name | 重鎮 |
| character_tables-33 | lineages[0].name | なし |
| character_tables-34 | lineages[1].name | 地方の名士 |
| character_tables-35 | lineages[2].name | 世襲 |
| character_tables-36 | lineages[3].name | 名門 |
| character_tables-37 | personality_pairs[0][0] | 野心家 |
| character_tables-38 | personality_pairs[0][1] | 無欲 |
| character_tables-39 | personality_pairs[1][0] | 大胆 |
| character_tables-40 | personality_pairs[1][1] | 慎重 |
| character_tables-41 | personality_pairs[2][0] | 誠実 |
| character_tables-42 | personality_pairs[2][1] | 狡猾 |
| character_tables-43 | personality_pairs[3][0] | 温厚 |
| character_tables-44 | personality_pairs[3][1] | 短気 |
| character_tables-45 | personality_pairs[4][0] | 社交的 |
| character_tables-46 | personality_pairs[4][1] | 孤高 |
| character_tables-47 | personality_pairs[5][0] | 寛容 |
| character_tables-48 | personality_pairs[5][1] | 執念深い |

### dialogue（場面のセリフ（首相の場面））

| 番号 | 場所 | 文 |
|---|---|---|
| dialogue-1 | scenes.start.title | 石橋内閣、発足 |
| dialogue-2 | scenes.start.variants[0][0].text | {year}年1月。少数与党のまま、石橋内閣が発足した。 |
| dialogue-3 | scenes.start.variants[0][1].text | 国民の皆さんに納得していただける政治を、一つずつ積み上げていきたい。 |
| dialogue-4 | scenes.start.variants[0][2].text | 総理、まずは予算です。3月末までに通さなければなりません。 |
| dialogue-5 | scenes.start.variants[0][3].text | うちと公正党だけでは過半数に届きません。どこかの野党と折り合いをつける必要があります。 |
| dialogue-6 | scenes.start.variants[0][4].text | 数で押し切れない以上、政府には丁寧に説明を尽くしてもらいます。 |
| dialogue-7 | scenes.vote_pass.title | 採決：可決 |
| dialogue-8 | scenes.vote_pass.variants[0][0].text | {bill}の採決の結果、賛成{yes}票、反対{no}票。よって本案は可決されました。 |
| dialogue-9 | scenes.vote_pass.variants[0][1].text | 皆さまのご協力に感謝します。しっかり実行に移してまいります。 |
| dialogue-10 | scenes.vote_pass.variants[0][2].text | まずは一歩前進だ。 |
| dialogue-11 | scenes.vote_pass.variants[1][0].text | 賛成{yes}票、反対{no}票。{bill}は可決されました。 |
| dialogue-12 | scenes.vote_pass.variants[1][1].text | なんとか票が集まりましたね、総理。 |
| dialogue-13 | scenes.vote_pass.variants[1][2].text | 協力してくれた各党には、借りができたな。 |
| dialogue-14 | scenes.vote_fail.title | 採決：否決 |
| dialogue-15 | scenes.vote_fail.variants[0][0].text | {bill}の採決の結果、賛成{yes}票、反対{no}票。よって本案は否決されました。 |
| dialogue-16 | scenes.vote_fail.variants[0][1].text | 数の足りない政権が、準備不足の法案を出すからこうなるのです。 |
| dialogue-17 | scenes.vote_fail.variants[0][2].text | ……出直しだ。どこで読み違えたのか、洗い直してくれ。 |
| dialogue-18 | scenes.vote_fail.variants[1][0].text | 賛成{yes}票、反対{no}票。{bill}は否決されました。 |
| dialogue-19 | scenes.vote_fail.variants[1][1].text | 申し訳ありません、総理。私の説明が足りませんでした。 |
| dialogue-20 | scenes.vote_fail.variants[1][2].text | 協議をやり直しましょう。各党の感触を確かめてから出すべきでした。 |
| dialogue-21 | scenes.rebels.title | 造反 |
| dialogue-22 | scenes.rebels.variants[0][0].text | 総理、うちから造反が{rebels}人出ました。党内をまとめきれませんでした。 |
| dialogue-23 | scenes.rebels.variants[0][1].text | 根回しが足りなかったか……。 |
| dialogue-24 | scenes.budget_fail.title | 予算、年度内に成立せず |
| dialogue-25 | scenes.budget_fail.variants[0][0].text | {year}年度予算は年度内に成立しなかった。政府は暫定予算でしのぐことになった。 |
| dialogue-26 | scenes.budget_fail.variants[0][1].text | 総理、予算が年度内に成立しなかったのは異例です。政権の責任をどうお考えですか。 |
| dialogue-27 | scenes.budget_fail.variants[0][2].text | 国民生活に影響が出ないよう、全力を尽くします。 |
| dialogue-28 | scenes.no_confidence_fail.title | 内閣不信任案、否決 |
| dialogue-29 | scenes.no_confidence_fail.variants[0][0].text | 支持率が{approval}%まで落ちた政権に、この国を任せることはできません。不信任案を提出します。 |
| dialogue-30 | scenes.no_confidence_fail.variants[0][1].text | 賛成{yes}票、反対{no}票。よって本案は否決されました。 |
| dialogue-31 | scenes.no_confidence_fail.variants[0][2].text | 首の皮一枚、つながったか。 |
| dialogue-32 | scenes.no_confidence_pass.title | 内閣不信任案、可決 |
| dialogue-33 | scenes.no_confidence_pass.variants[0][0].text | 支持率が{approval}%まで落ちた政権に、この国を任せることはできません。不信任案を提出します。 |
| dialogue-34 | scenes.no_confidence_pass.variants[0][1].text | 賛成{yes}票、反対{no}票。よって本案は可決されました。 |
| dialogue-35 | scenes.no_confidence_pass.variants[0][2].text | ……国民の皆さんには、大変申し訳なく思います。内閣は総辞職します。 |
| dialogue-36 | scenes.term_end.title | 任期満了 |
| dialogue-37 | scenes.term_end.variants[0][0].text | 衆議院議員の任期が満了した。いよいよ総選挙だ。 |
| dialogue-38 | scenes.term_end.variants[0][1].text | 支持率{approval}%。この数字で、国民の審判を受ける。 |

## 第2部　コードの中の文章

{ } の中は、遊ぶときに数や名前に置き換わる部分（プログラムの式）。HTML のタグは取り除き、空白に置き換えてある。同じ文が何度も出てくるときは最初の1つだけを載せた。

### game/career（議員人生の計算（記録の文、結果の文、選挙の一言など））

| 番号 | 行 | 文 |
|---|---|---|
| game/career:132 | 132 | 小選挙区 |
| game/career:132 | 132 | 引退する現職の後継 |
| game/career:132 | 132 | 比例名簿 |
| game/career:222 | 222 | 候補 |
| game/career:222 | 222 | 議員 |
| game/career:222 | 222 | 浪人 |
| game/career:290 | 290 | {s.year}年{s.month}月 |
| game/career:330 | 330 | 現職：{h.name.displayName}（{partyById(h.party).short}・{h.terms}回） |
| game/career:330 | 330 | 現職なし |
| game/career:332 | 332 | {h.name.displayName}（{ageOf(h)}歳）の後継 |
| game/career:334 | 334 | 比例名簿（順位は党の幹部との関係で決まる） |
| game/career:339 | 339 | 親（{h.name.displayName}）の地盤を継ぐ |
| game/career:341 | 341 | 親の地盤を継ぐ |
| game/career:383 | 383 | 党首 |
| game/career:407 | 407 | {partyById(world.player.party).short}の党首 |
| game/career:408 | 408 | {partyById(world.player.party).short}の{state.oppPost.name} |
| game/career:466 | 466 | 影の大臣（{p.specialties[0]}） |
| game/career:490 | 490 | {title}に就いた。 |
| game/career:516 | 516 | {c.member.name.displayName}{…}{c.votes}票 |
| game/career:516 | 516 | （自分） |
| game/career:518 | 518 | {partyById(party).short}の党首選（{reason}）：{votes}。{result.winner.name.displayName}が{…}。 |
| game/career:518 | 518 | 再選された |
| game/career:518 | 518 | 新しい党首に選ばれた |
| game/career:519 | 519 | 党首選に敗れた。 |
| game/career:525 | 525 | 首相は党首の任期の上限に達し、退いた。 |
| game/career:552 | 552 | ゲームは終わっています。 |
| game/career:553 | 553 | 政権の行動は首相のときだけ使えます。 |
| game/career:569 | 569 | 衆議院の解散を決めた。月末に総選挙を行う。 |
| game/career:571 | 571 | 政権の行動は draft / submit / talk / nemawashi / press / dissolve です。 |
| game/career:592 | 592 | 準備中 |
| game/career:594 | 594 | {billName(g, b)}の準備が進んだ |
| game/career:602 | 602 | {partyById(top).short}との協力度+{d.cooperation} |
| game/career:607 | 607 | 党の結束{Math.round(g.cohesion * 100)}% |
| game/career:609 | 609 | 公務（{state.post}）：{…} |
| game/career:625 | 625 | {partyById(top).short}との協力度+{d.coop_top} |
| game/career:629 | 629 | 野党各党との協力度+{d.coop_all} |
| game/career:633 | 633 | 対案の準備+{d.proposals} |
| game/career:637 | 637 | 不信任案の根回し+{d.diet} |
| game/career:641 | 641 | 党に追い風 |
| game/career:691 | 691 | 野党党首会談 |
| game/career:691 | 691 | ほかの野党の党首と会い、協力度を上げる。思想が近いほど上がりやすい。 |
| game/career:692 | 692 | 党首討論 |
| game/career:692 | 692 | 国会の会期中、首相と論戦する。弁舌と政策で上回れば、内閣支持率が下がり自党に追い風。 |
| game/career:693 | 693 | 失政の追及 |
| game/career:693 | 693 | 政権の失政や不祥事を追及する。長期政権ほど成功しやすいが、失敗すると自分に返ってくる。 |
| game/career:694 | 694 | 対案の発表 |
| game/career:694 | 694 | 準備した対案（政調会長がためる）を発表し、政権を担える党だと示す。 |
| game/career:695 | 695 | 選挙協力の締結 |
| game/career:695 | 695 | 協力度の高い野党と小選挙区の候補者を一本化する約束をする。総選挙まで有効。 |
| game/career:696 | 696 | 内閣不信任案の提出 |
| game/career:696 | 696 | 野党の票と与党の造反で過半数を取れば可決。支持率が高ければ解散、低ければ総辞職になる。 |
| game/career:732 | 732 | 野党の党首のときだけ使えます。 |
| game/career:734 | 734 | 今月の党首の行動はもう残っていません。 |
| game/career:744 | 744 | 会談の相手を選んでください（{…}）。 |
| game/career:752 | 752 | {partyById(arg).short}の党首と会談し、協力で一致した（協力度{opp.cooperation[arg]}、+{gain}）。 |
| game/career:755 | 755 | {partyById(arg).short}との会談は、政策の違いが表に出て物別れに終わった（協力度{opp.cooperation[arg]}）。 |
| game/career:760 | 760 | 党首討論は国会の会期中だけです。 |
| game/career:761 | 761 | 党首討論は月に1回です。 |
| game/career:763 | 763 | 弁舌 |
| game/career:771 | 771 | {…}（内閣支持率{D.win_approval}、自党に追い風） |
| game/career:775 | 775 | {…}（内閣支持率+{D.lose_approval}） |
| game/career:781 | 781 | 追及の調査費用（{-P.money}万円）が足りません。 |
| game/career:783 | 783 | 出来事 |
| game/career:790 | 790 | {…}（内閣支持率{P.win_approval}、与党の結束{Math.round(g.cohesion * 100)}%） |
| game/career:800 | 800 | 対案の準備が足りません（{opp.proposals}/{P.cost}）。政調会長が毎月ためてくれます。 |
| game/career:805 | 805 | 独自の対案を発表した。政権を担える党だと訴えた（自党に追い風+{gain}）。 |
| game/career:810 | 810 | 選挙協力の相手を選んでください。 |
| game/career:811 | 811 | {partyById(arg).short}とはもう選挙協力を結んでいます。 |
| game/career:812 | 812 | 協力度が{P.min_cooperation}以上の党とだけ結べます（今は{opp.cooperation[arg] ?? 0}）。 |
| game/career:815 | 815 | 選挙協力は、任期満了まで{P.months_before}か月を切ってから結べます（任期満了まであと{monthsLeft}か月）。 |
| game/career:818 | 818 | {partyById(arg).short}と選挙協力を結んだ。小選挙区では候補者を一本化する（相手の票が移る割合 {…}%）。 |
| game/career:821 | 821 | {partyById(arg).short}との選挙協力の協議は、候補者の調整で折り合わなかった。 |
| game/career:828 | 828 | 不信任案は{N.cooldown_months}か月に1回までです。 |
| game/career:835 | 835 | 内閣不信任案を提出し、賛成{r.yes}・反対{r.no}で可決された（与党からの造反{r.defectors}人）。月末に内閣の進退が決まる。 |
| game/career:840 | 840 | 内閣不信任案を提出したが、賛成{r.yes}・反対{r.no}で否決された（与党からの造反{r.defectors}人）。 |
| game/career:845 | 845 | その行動はありません。 |
| game/career:867 | 867 | この出自と政党では、その出馬の道と選挙区からは出馬できません。 |
| game/career:869 | 869 | なし |
| game/career:948 | 948 | {party.name}の比例名簿に載る候補に選ばれた。地元の{where}を拠点に、党への貢献で名簿の上位を目指す。 |
| game/career:950 | 950 | {party.name}の公募で引退を表明した{parent!.name.displayName}の後継に選ばれた。{seatName}の地盤は一から作り直しだ。 |
| game/career:952 | 952 | {party.name}の公認を得た。引退を決めた{holder!.name.displayName}の地盤を継ぎ、{seatName}で次の総選挙に挑む。 |
| game/career:953 | 953 | {party.name}の公募で候補に選ばれた。次の総選挙で{seatName}の議席を狙う。 |
| game/career:1017 | 1017 | {partyById(e.party).short}の候補 |
| game/career:1062 | 1062 | 体力の上限{state.maxStamina} |
| game/career:1078 | 1078 | 資金{…}{e.money}万円 |
| game/career:1083 | 1083 | 内閣支持率{…}{e.approval} |
| game/career:1094 | 1094 | 特殊能力「{sk.name}」を身につけた |
| game/career:1101 | 1101 | 特殊能力「{sk.name}」が外れた |
| game/career:1137 | 1137 | 特殊能力「{g.name}」を身につけた！ {g.description} |
| game/career:1138 | 1138 | 欠点「{l.name}」を克服した。 |
| game/career:1138 | 1138 | 特殊能力「{l.name}」は上位の能力に置き換わった。 |
| game/career:1159 | 1159 | 地盤が{world.player.jiban}に上がった |
| game/career:1169 | 1169 | 先に出来事「{state.pendingEvent.title}」の選択肢を選んでください。 |
| game/career:1170 | 1170 | 先に物語「{…}」の選択肢を選んでください。 |
| game/career:1172 | 1172 | 公務は役職に就いているときだけできます。 |
| game/career:1179 | 1179 | その活動はありません。 |
| game/career:1185 | 1185 | {act.name}の途中で体調を崩し、寝込んでしまった。 |
| game/career:1198 | 1198 | 資金+{m}万円 |
| game/career:1202 | 1202 | やる気が上がった |
| game/career:1205 | 1205 | 体力が戻った |
| game/career:1223 | 1223 | 。【コツ】「{sk.name}」のコツをつかんだ（Lv{state.skillHints[sk.id]}） |
| game/career:1234 | 1234 | コツで覚えられる特殊能力ではありません。 |
| game/career:1235 | 1235 | もう持っています。 |
| game/career:1236 | 1236 | まだコツをつかんでいません。 |
| game/career:1239 | 1239 | 能力、当選回数、地盤の条件を満たしていません。 |
| game/career:1241 | 1241 | 経験点が足りません。 |
| game/career:1254 | 1254 | コツを生かして、特殊能力「{sk.name}」を身につけた！ |
| game/career:1255 | 1255 | 特殊能力「{sk.name}」を身につけた！ |
| game/career:1309 | 1309 | 【物語】「{title}」が始まった。 |
| game/career:1313 | 1313 | 【物語】「{title}」の結末「{ending.title}」：{text} |
| game/career:1313 | 1313 | 【物語】「{title}」は、そのまま立ち消えになった。 |
| game/career:1315 | 1315 | {dateOf(state)} 物語「{title}」：{ending.title} |
| game/career:1322 | 1322 | 体力{…}{e.stamina} |
| game/career:1323 | 1323 | やる気が下がった |
| game/career:1327 | 1327 | 次の総選挙の票{…}{e.vote_bonus} |
| game/career:1360 | 1360 | 選ぶ物語はありません。 |
| game/career:1366 | 1366 | 選択肢は1〜{choices.length}です。 |
| game/career:1371 | 1371 | 【物語】{st.title}：{label} → {result}{…} |
| game/career:1388 | 1388 | 選ぶ出来事はありません。 |
| game/career:1391 | 1391 | 選択肢は1〜{ev.choices.length}です。 |
| game/career:1395 | 1395 | 体力{…}{eff.stamina} |
| game/career:1437 | 1437 | 資金が尽き、事務所の家賃が払えなくなった。 |
| game/career:1455 | 1455 | 地元に顔を出さない日が続き、地盤が{world.player.jiban}に下がった。 |
| game/career:1471 | 1471 | 内閣不信任案が可決された |
| game/career:1473 | 1473 | 任期満了 |
| game/career:1480 | 1480 | 内閣不信任案が可決され、首相は衆議院を解散した。 |
| game/career:1482 | 1482 | 内閣不信任案が可決され、内閣は総辞職した。 |
| game/career:1483 | 1483 | 内閣総辞職 |
| game/career:1491 | 1491 | 支持率の低迷（{g.approval}%）が続き、首相が辞任を表明した。 |
| game/career:1492 | 1492 | 首相の辞任 |
| game/career:1500 | 1500 | 首相として衆議院を解散した（内閣支持率{g.approval}%）。 |
| game/career:1503 | 1503 | 首相が衆議院を解散した（内閣支持率{g.approval}%）。 |
| game/career:1506 | 1506 | 衆議院議員の任期が満了した。 |
| game/career:1535 | 1535 | 、首相在任{Math.floor(state.pmMonths / 12)}年{state.pmMonths % 12}か月 |
| game/career:1536 | 1536 | 政界を引退した（{age}歳、政治家として{years}年）。総選挙{state.elections.length}回で当選{wins}回{pmYears}{…}。 |
| game/career:1536 | 1536 | 、最後の役職は{state.post} |
| game/career:1566 | 1566 | 選挙費用に{cost}万円を使った。 |
| game/career:1587 | 1587 | 選挙協力（{…}）で、小選挙区の候補者を一本化して戦った。 |
| game/career:1597 | 1597 | 比例名簿{rank + 1}位（党の比例当選{prSeats}人） |
| game/career:1597 | 1597 | 得票率{…} |
| game/career:1598 | 1598 | {…}！ {how}で{partyById(state.setup.party).name}の衆議院議員に選ばれた。 |
| game/career:1598 | 1598 | 初当選 |
| game/career:1598 | 1598 | {me.terms}回目の当選 |
| game/career:1604 | 1604 | 比例名簿{rank + 1}位で、党の比例当選{prSeats}人に届かなかった |
| game/career:1604 | 1604 | 得票率{…}で{d!.winner.name.displayName}（{partyById(d!.winner.party).short}）に敗れた |
| game/career:1605 | 1605 | 落選。{how}。浪人として次の選挙を目指す。 |
| game/career:1609 | 1609 | {dateOf(state)} 初当選 |
| game/career:1636 | 1636 | 政権を失って |
| game/career:1636 | 1636 | 党首の落選 |
| game/career:1645 | 1645 | {describeRuling(coalition.ruling)}の{…}が発足し、{pmName}が首相に就いた。 |
| game/career:1645 | 1645 | 連立政権 |
| game/career:1645 | 1645 | 単独政権 |
| game/career:1670 | 1670 | 衆議院議員の任期が満了した |
| game/career:1672 | 1672 | 行動 |
| game/career:1717 | 1717 | 前首相 |
| game/career:1719 | 1719 | 首相 |
| game/career:1723 | 1723 | 秘書 |
| game/career:1788 | 1788 | 最大 |
| game/career:1812 | 1812 | {state.leaderTermEnd.year}年{state.leaderTermEnd.month}月（与党の党首の任期切れ） |
| game/career:1815 | 1815 | {state.gov.termEnd.year}年{state.gov.termEnd.month}月（解散があれば早まる） |

### game/advice（秘書の助言）

| 番号 | 行 | 文 |
|---|---|---|
| game/advice:30 | 30 | 公務 |
| game/advice:42 | 42 | 総理、今月の政権の行動があと{state.gov.actionPoints}回残っています。内閣の画面で法案や根回しを進めましょう。 |
| game/advice:46 | 46 | 党首の行動があと{state.opp.actionPoints}回残っています。党内の画面で、ほかの野党との会談や党首討論を進めましょう。 |
| game/advice:49 | 49 | 総選挙まであと{mo.monthsToElection}か月です。協力度の高い党と選挙協力を結べば、小選挙区で候補者を一本化できます。 |
| game/advice:57 | 57 | 先生、顔色が悪いですよ（体力{state.stamina}）。体力を使う活動をすると{…}%の確率で倒れます。今月は休養にしましょう。 |
| game/advice:58 | 58 | 先生、疲れがたまっています（体力{state.stamina}）。20を切ると、体力を使う活動の途中で倒れることがあります。そろそろ休養を。 |
| game/advice:62 | 62 | 体力が{state.stamina}まで減っています。重い活動の前に、休養か趣味の時間を挟むと安心です。 |
| game/advice:66 | 66 | 資金があと{mo.monthsLeft}か月分しかありません（毎月{mo.expense}万円かかります）。資金集めをお願いします。 |
| game/advice:68 | 68 | 総選挙まであと{mo.monthsToElection}か月です。選挙費用（最大{mo.electionCost}万円）が足りません。資金集めで蓄えましょう。 |
| game/advice:74 | 74 | しばらく地元に顔を出していません。あと{Math.max(left, 0)}か月で地盤が下がります。地元回りか地域行事に出ましょう。 |
| game/advice:79 | 79 | 比例名簿の順位は党の幹部との関係で決まります（今は{prRank(state) + 1}位の見込み、関係{state.relations.party}）。党務で上を狙いましょう。 |
| game/advice:87 | 87 | 総選挙まであと{mo.monthsToElection}か月。相手の{top.name}氏に{gap}ポイント負けています。地元回りで地盤を固めましょう。 |
| game/advice:88 | 88 | 総選挙まであと{mo.monthsToElection}か月、情勢は優勢です（{-gap}ポイントの差）。油断せず地元を固めましょう。 |
| game/advice:98 | 98 | この{months}か月で資金が{-dm}万円減っています（今は{state.money}万円）。早めに資金集めを挟みましょう。 |
| game/advice:103 | 103 | この{months}か月で内閣支持率が{…}います（{past.approval}→{state.gov.approval}%）。{…} |
| game/advice:103 | 103 | 上がって |
| game/advice:103 | 103 | 下がって |
| game/advice:103 | 103 | うちの党には追い風です。今のうちに地盤を固めましょう。 |
| game/advice:103 | 103 | うちの党には向かい風です。地元の支持を厚くしておきましょう。 |
| game/advice:110 | 110 | この{months}か月で、選挙区の見込みが{-ds}ポイント下がっています。地元回りと地域行事で取り返しましょう。 |
| game/advice:111 | 111 | この{months}か月で、選挙区の見込みが{ds}ポイント上がっています。この調子です。 |
| game/advice:118 | 118 | 「{skillById(id)?.name}」のコツ（Lv{lv}）をつかんでいます。「自分」の画面で経験点を使って覚えられます。 |
| game/advice:126 | 126 | 経験点がたまっています。「自分」の画面で能力を上げられます（たとえば{low}）。 |
| game/advice:131 | 131 | 党の幹部との関係が{state.relations.party}です。25を切ると役職に就けません。党務で顔をつないでおきましょう。 |
| game/advice:133 | 133 | 県議団との関係があと{…}で{C.kengi.threshold}です。そこまで行けば、県議が毎月地盤を固めてくれます。 |
| game/advice:135 | 135 | 後援会との関係が{state.relations.supporters}と冷えています。選挙の票に響くので、地域行事に顔を出しましょう。 |
| game/advice:138 | 138 | やる気が落ちています。経験点の伸びが鈍るので、趣味の時間で気分転換をしてください。 |
| game/advice:152 | 152 | あと{rest[0].n}回の{actName(rest[0].a)}で、特殊能力「{sk.name}」が身につきそうです。 |
| game/advice:157 | 157 | 党首選に立候補できる立場になりました。党内の画面で届け出ておけば、次の党首選に出られます。 |
| game/advice:160 | 160 | {…}公務をこなすと、党や世論の評価が上がります。 |
| game/advice:160 | 160 | {state.post}としての |
| game/advice:167 | 167 | 今は急ぎの用事はありません。地盤が{p.jiban}から上がるまで、進み具合はあと{Math.max(0, need - state.jibanProgress)}です。地元回りを続けましょう。 |
| game/advice:168 | 168 | 地盤は万全です。政策勉強会や街頭演説で、能力と知名度を伸ばす時期です。 |

### game/story（物語と人物との関係（場所の名前、役の名前、関係の言葉））

| 番号 | 行 | 文 |
|---|---|---|
| game/story:14 | 14 | 好敵手 |
| game/story:14 | 14 | 因縁 |
| game/story:14 | 14 | 盟友 |
| game/story:14 | 14 | 師弟 |
| game/story:14 | 14 | 恩人 |
| game/story:14 | 14 | 不信 |
| game/story:15 | 15 | ライバル |
| game/story:15 | 15 | 同期 |
| game/story:15 | 15 | 党の先輩 |
| game/story:15 | 15 | 秘書 |
| game/story:136 | 136 | 地元の事務所 |
| game/story:137 | 137 | 選挙事務所 |
| game/story:138 | 138 | 駅前 |
| game/story:139 | 139 | 商店街 |
| game/story:140 | 140 | 公民館 |
| game/story:141 | 141 | 国会 |
| game/story:142 | 142 | 党本部 |
| game/story:143 | 143 | 料亭 |
| game/story:144 | 144 | 自宅 |
| game/story:145 | 145 | 病院 |
| game/story:146 | 146 | 被災地 |
| game/story:147 | 147 | テレビ局 |
| game/story:238 | 238 | とても良い |
| game/story:239 | 239 | 良い |
| game/story:240 | 240 | ふつう |
| game/story:241 | 241 | 悪い |
| game/story:242 | 242 | とても悪い |
| game/story:288 | 288 | 首相 |
| game/story:324 | 324 | 官僚 |
| game/story:325 | 325 | 首長 |
| game/story:325 | 325 | 地方議員 |
| game/story:326 | 326 | 経済 |
| game/story:326 | 326 | 企業 |
| game/story:327 | 327 | 世襲 |
| game/story:347 | 347 | 小選挙区 |
| game/story:347 | 347 | なし |
| game/story:475 | 475 | {who(ctx, role as BondRole)}との関係{…}{n} |
| game/story:481 | 481 | {who(ctx, role as BondRole)}との間柄：{tag} |
| game/story:519 | 519 | 相手の党 |
| game/story:522 | 522 | 先輩 |
| game/story:554 | 554 | 選挙 |
| game/story:554 | 554 | 政策 |
| game/story:554 | 554 | 人脈 |
| game/story:554 | 554 | 発信 |
| game/story:554 | 554 | 資金 |
| game/story:561 | 561 | 関係 |
| game/story:562 | 562 | 人物 |
| game/story:563 | 563 | 地盤 |
| game/story:565 | 565 | 能力 |
| game/story:566 | 566 | 票 |
| game/story:567 | 567 | 判定：{c.risk.ability} |
| game/story:578 | 578 | 自分 |

### game/politics（政局）

| 番号 | 行 | 文 |
|---|---|---|
| game/politics:42 | 42 | {describe(kept)}が過半数（{seats(kept)}議席）を保ち、政権を続ける。 |
| game/politics:56 | 56 | 少数与党として |
| game/politics:58 | 58 | 政権交代。{describe(ruling)}が{minority}政権を担う（{seats(ruling)}議席）。 |
| game/politics:59 | 59 | {describe(ruling)}が{minority}政権を続ける（{seats(ruling)}議席）。 |
| game/politics:64 | 64 | ・ |

### game/game（政権の月の動き（政局の記録に写る））

| 番号 | 行 | 文 |
|---|---|---|
| game/game:32 | 32 | 未着手 |
| game/game:32 | 32 | 準備中 |
| game/game:32 | 32 | 準備完了 |
| game/game:32 | 32 | 提出中 |
| game/game:32 | 32 | 成立 |
| game/game:32 | 32 | 否決 |
| game/game:43 | 43 | 行動 |
| game/game:43 | 43 | 採決 |
| game/game:43 | 43 | 出来事 |
| game/game:43 | 43 | 通知 |
| game/game:88 | 88 | {s.year}年{s.month}月 |
| game/game:90 | 90 | {s.budgetYear}年度予算 |
| game/game:162 | 162 | 石橋内閣が発足した。少数与党のため、法案を通すには野党の協力が必要になる。{state.budgetYear}年度予算は3月末までに成立させなければならない。 |
| game/game:194 | 194 | ゲームは終わっています。 |
| game/game:195 | 195 | 今月の行動はもう残っていません。 |
| game/game:205 | 205 | この法案は準備を始められません。 |
| game/game:210 | 210 | {billName(state, b)}の準備を{…}{minister.name.displayName}に指示した。 |
| game/game:210 | 210 | {post}の |
| game/game:221 | 221 | この法案はまだ出せません。 |
| game/game:222 | 222 | 国会の会期外なので法案を出せません。 |
| game/game:226 | 226 | {billName(state, b)}を国会に提出した（賛成の見込み約{forecast}票）。月末に採決する。 |
| game/game:235 | 235 | この政党とは協議できません。 |
| game/game:245 | 245 | {negotiator.name.displayName}官房長官が{partyById(partyId).name}と政策協議をした（協力度 {state.cooperation[partyId]}）。 |
| game/game:257 | 257 | {sg.name.displayName}幹事長が党内の根回しをした（結束 {Math.round(state.cohesion * 100)}%）。 |
| game/game:273 | 273 | 記者会見で{pm.name.displayName}首相の発言が失言と受け取られた（支持率 {state.approval}%）。 |
| game/game:279 | 279 | {pm.name.displayName}首相が記者会見で政策を訴えた（支持率 {state.approval}%）。 |
| game/game:296 | 296 | 内閣 |
| game/game:307 | 307 | {text}（支持率 {…}{ev.approval}） |
| game/game:309 | 309 | {ev.title}（支持率 {…}{ev.approval}） |
| game/game:324 | 324 | {billName(state, b)}の準備ができた。会期中なら国会に出せる。 |
| game/game:335 | 335 | {billName(state, b)}が賛成{result.yes}・反対{result.no}で成立した（支持率 {…}{b.on_pass}）。 |
| game/game:340 | 340 | {billName(state, b)}は賛成{result.yes}・反対{result.no}で否決された（支持率 −2）。 |
| game/game:350 | 350 | {state.budgetYear}年度予算が年度内に成立せず、暫定予算でしのぐことになった（支持率 {R.budget.failure_approval}）。 |
| game/game:364 | 364 | 内閣不信任案が賛成{result.yes}・反対{result.no}で可決された。内閣は総辞職した。 |
| game/game:366 | 366 | 内閣不信任案が可決され、内閣は総辞職した。 |
| game/game:370 | 370 | 野党が出した内閣不信任案は賛成{result.yes}・反対{result.no}で否決された。 |
| game/game:385 | 385 | 通常国会が始まった。{state.budgetYear}年度予算を3月末までに成立させる必要がある。 |
| game/game:387 | 387 | 臨時国会が始まった。 |
| game/game:388 | 388 | 通常国会が閉会した。秋の臨時国会まで法案は出せない。 |
| game/game:390 | 390 | 任期満了。総選挙は次の段階で実装します。 |
| game/game:391 | 391 | 衆議院議員の任期が満了した。 |

### game/ai（AI の政権の動き）

| 番号 | 行 | 文 |
|---|---|---|
| game/ai:22 | 22 | 準備完了 |
| game/ai:22 | 22 | 否決 |
| game/ai:30 | 30 | 準備中 |
| game/ai:31 | 31 | 未着手 |

### game/skills（特殊能力）

| 番号 | 行 | 文 |
|---|---|---|
| game/skills:73 | 73 | 金 |
| game/skills:73 | 73 | 青 |
| game/skills:73 | 73 | 赤 |
| game/skills:73 | 73 | 緑 |
| game/skills:150 | 150 | {activityName(a)} {Math.min(ctx.activityCounts[a] ?? 0, n)}/{n}回 |
| game/skills:152 | 152 | 当選 {Math.min(ctx.terms, c.terms)}/{c.terms}回 |
| game/skills:153 | 153 | 地盤 {Math.min(ctx.jiban, c.jiban)}/{c.jiban} |
| game/skills:154 | 154 | ・ |

### game/save（セーブ）

| 番号 | 行 | 文 |
|---|---|---|
| game/save:58 | 58 | セーブデータの形式ではありません（ファイルの中身を読み取れません） |
| game/save:62 | 62 | 議員人生モードのセーブデータではありません |
| game/save:63 | 63 | このゲームより新しい版のセーブデータです |
| game/save:64 | 64 | 小選挙区が47区だったころの古いセーブデータは読めません（289区に変えたため） |
| game/save:65 | 65 | セーブデータが壊れています |
| game/save:81 | 81 | セーブデータが壊れています（内閣） |
| game/save:92 | 92 | {p.name.displayName}・{st.year}年{st.month}月・{st.post ／／ st.status} |

### app/views（画面の文）

| 番号 | 行 | 文 |
|---|---|---|
| app/views:49 | 49 | {esc(prefName(p))} 出られる区 {os.length}{…} |
| app/views:49 | 49 | （現職：{…}） |
| app/views:49 | 49 | ・ |
| app/views:56 | 56 | 県の一覧に戻る {…} |
| app/views:65 | 65 | 弁舌 |
| app/views:65 | 65 | 知名度 |
| app/views:65 | 65 | 組織 |
| app/views:65 | 65 | 政策 |
| app/views:65 | 65 | 調整 |
| app/views:65 | 65 | 資金 |
| app/views:74 | 74 | ガシッ!! |
| app/views:75 | 75 | ワーッ!! |
| app/views:76 | 76 | ピコーン! |
| app/views:77 | 77 | チャリン! |
| app/views:78 | 78 | ドンッ! |
| app/views:79 | 79 | ガッチリ! |
| app/views:80 | 80 | ワッショイ! |
| app/views:81 | 81 | ダダダッ! |
| app/views:82 | 82 | ルンルン♪ |
| app/views:83 | 83 | スヤァ… |
| app/views:84 | 84 | キリッ! |
| app/views:89 | 89 | 出自 |
| app/views:89 | 89 | 政党 |
| app/views:89 | 89 | 出馬の道と県 |
| app/views:89 | 89 | 経歴類型 |
| app/views:89 | 89 | 確認 |
| app/views:94 | 94 | ◀ 戻る |
| app/views:98 | 98 | 出自（難易度）を選ぶ |
| app/views:99 | 99 | {…} ファイルから読み込む 画面のモード {modeSwitch(mode, adviceLevel)} {…} |
| app/views:99 | 99 | 続きから {esc(saved)} セーブを消す |
| app/views:99 | 99 | はじめから遊ぶ |
| app/views:103 | 103 | 政党を選ぶ |
| app/views:106 | 106 | {chip(p.id)} {esc(p.short)} {…} {esc(p.name)}・{…}議席 {…} |
| app/views:106 | 106 | 与党 |
| app/views:106 | 106 | 野党 |
| app/views:110 | 110 | {prefName(opened)}の区を選ぶ |
| app/views:110 | 110 | 出馬の道と地元の県を選ぶ |
| app/views:115 | 115 | 他党の現職に挑む |
| app/views:115 | 115 | 親の地盤を継ぐ |
| app/views:116 | 116 | 引退する自党の現職の後継。党の票はあるが地盤は1から |
| app/views:117 | 117 | 比例名簿。党務で党の幹部との関係を上げて上位を狙う |
| app/views:124 | 124 | 経歴類型を選ぶ |
| app/views:125 | 125 | 能力の略号：弁＝弁舌、政＝政策、調＝調整、知＝知名度、組＝組織、資＝資金。ランクは S が最も高く、A〜G の順に下がる。 {…} |
| app/views:129 | 129 | この条件で始めますか |
| app/views:132 | 132 | 出自 {esc(o.name)}（{esc(o.difficulty)}） 政党 {chip(c.party!)} {esc(partyById(c.party!).name)} 出馬 {esc(ROUTE_NAMES[c.route!])}・{…} 経歴 {esc(a.name)} 始めの能力 {…} 画面のモード {…}。始めてからも「自分」の画面で変えられる。 この条件で始める |
| app/views:138 | 138 | 通常（秘書の助言つき） |
| app/views:138 | 138 | プロ（数字をすべて出す） |
| app/views:141 | 141 | 議員人生 {esc(VERSION_LABEL)} {…} {progress} {back} {title} {body} |
| app/views:142 | 142 | 一人の新人候補として総選挙での初当選を目指し、地盤を固めて上の役職を目指す。党首選に勝って与党の党首になれば首相にもなれる。75歳になるか、30年たつと引退して議員人生を終える。 |
| app/views:155 | 155 | 中道 |
| app/views:162 | 162 | {…}{…} {…} 秘書の助言 {…}{…}{…} |
| app/views:162 | 162 | 通常 |
| app/views:162 | 162 | プロ |
| app/views:163 | 163 | 通常：活動の画面では、経験点と関係の欄の代わりに秘書の助言とおすすめの活動を出し、活動の効果も言葉で説明する。 |
| app/views:163 | 163 | プロ：経験点や関係など、すべての数字を活動の画面に出す。 |
| app/views:164 | 164 | 全部 |
| app/views:164 | 164 | 警告だけ |
| app/views:164 | 164 | 出さない |
| app/views:174 | 174 | 手元の資金 {state.money}万円 毎月の経費 {mo.expense}万円。今の資金で約{mo.monthsLeft}か月もつ 任期満了の総選挙まで{mo.monthsToElection}か月。選挙費用は最大{mo.electionCost}万円で、多く使えるほど票が上乗せされる 資金集めの活動で増やせる |
| app/views:176 | 176 | {chip(state.setup.party)}{esc(partyById(state.setup.party).short)}・{esc(s.post ／／ s.status)} {moodIcon(state.mood, 24)} {…} {state.year}年 {state.month}月 {…}{state.money}万円{…} 記録 ？ {…} {…} 体力{…} {cur} / {max} |
| app/views:176 | 176 | やる気 {state.mood} / 5 活動で得る経験点が {…} 倍になる |
| app/views:178 | 178 | あと{mo.monthsLeft}か月 |
| app/views:178 | 178 | 選挙費用が足りない |
| app/views:181 | 181 | 内閣支持率 {s.approval}% 与党 {s.ruling} 首相 {s.primeMinister} 次の総選挙 {s.nextElection} 与党の党首選 {s.leaderElection} |
| app/views:181 | 181 | 次の総選挙 {state.gov.termEnd.year}年{state.gov.termEnd.month}月 まで（あと{mo.monthsToElection}か月） |
| app/views:181 | 181 | 支持率 {s.approval}% 与党 {esc(s.ruling)} 総選挙 {state.gov.termEnd.year}年{state.gov.termEnd.month}月まで |
| app/views:181 | 181 | が少ない（休養を） |
| app/views:182 | 182 | 体力 {cur} / {max} 20未満で無理をすると倒れることがある。休養や趣味の時間で戻る |
| app/views:190 | 190 | {…} 比例名簿 見込み {prRank(state) + 1}位 党の幹部 {state.relations.party} |
| app/views:190 | 190 | 比例名簿の道 党の幹部との関係が80で1位、12下がるごとに1つ下がる。党の比例の当選者数に入れば当選 |
| app/views:196 | 196 | 優勢 |
| app/views:196 | 196 | やや優勢 |
| app/views:196 | 196 | やや劣勢 |
| app/views:196 | 196 | 劣勢 |
| app/views:199 | 199 | {…}{x.name}（{partyById(x.party).short}） 得票の見込み {pct(x.share)}{…} |
| app/views:199 | 199 | 自分： |
| app/views:199 | 199 | {…}当選{m.terms}回・地盤{m.jiban}・知名度{rankOf(m.abilities.知名度)} |
| app/views:199 | 199 | 現職・ |
| app/views:199 | 199 | 候補者はまだ決まっていない |
| app/views:213 | 213 | {…} {esc(place)} {bar} {verdict[0]} {…} 自分 {pct(me.share)} {…} 地盤 {world.player.jiban} |
| app/views:213 | 213 | {place}の情勢（揺らぎを除いた見込み） {all} |
| app/views:214 | 214 | 相手 {rivalHtml} {pct(rival.share)} |
| app/views:214 | 214 | 地盤 {world.player.jiban} / 4 「地元回り」「地域行事」「県議と連携」で固まる。半年続けて地元の活動をしないと1段下がる |
| app/views:218 | 218 | 秘書との関係 高いほど活動で得る経験点が増える（0.8〜1.15倍） |
| app/views:219 | 219 | 党の幹部との関係 人事で役職に選ばれやすくなる。25未満だと役職に就けない。党首選の票、比例名簿の順位にも効く |
| app/views:220 | 220 | 後援会との関係 選挙で本人の票が上乗せされる |
| app/views:221 | 221 | 地元紙との関係 選挙で本人の票が少し上乗せされる |
| app/views:222 | 222 | 県議団との関係 60以上なら毎月地盤が固まり、選挙の票も上乗せされる |
| app/views:228 | 228 | {REL_TIPS[r.id]} 今 {state.relations[r.id]}（放っておくと40に戻っていく。白い線が40） |
| app/views:229 | 229 | 秘書 {state.secretaryName} |
| app/views:232 | 232 | 関係 {rows} |
| app/views:238 | 238 | 公務 |
| app/views:238 | 238 | {state.post}としての仕事をする。役職ごとに効果が違う。 |
| app/views:262 | 262 | {e.name}の経験点 {state.exp[e.id]} 「自分」の画面で能力を上げるのに使う |
| app/views:262 | 262 | 選んだ活動で増える見込み |
| app/views:266 | 266 | {…} {icon(a.icon, 40)} {esc(a.name)} 体力{…}{a.stamina} |
| app/views:267 | 267 | おすすめ |
| app/views:267 | 267 | 地盤UP |
| app/views:273 | 273 | {esc(sel.name)}：{esc(sel.description)} {…} 下のボタンかカードをもう一度押すと実行 |
| app/views:273 | 273 | {…} 体力{…}{sel.stamina} |
| app/views:275 | 275 | {esc(last.text)}{…} 次の活動を選んでください |
| app/views:276 | 276 | 今月の活動を選んでください カードを押すと説明が出て、もう一度押すと実行します |
| app/views:281 | 281 | 経験点 {exp} {relPanel(state)} |
| app/views:291 | 291 | {esc(sel.name)}を実行する |
| app/views:302 | 302 | なし |
| app/views:303 | 303 | {sk.name}（{COLOR_NAMES[sk.color]}の特殊能力） {sk.description} |
| app/views:313 | 313 | 克服の条件：{…} |
| app/views:327 | 327 | コツLv{lv} 覚える（{cost}） {…} |
| app/views:329 | 329 | {esc(sk.name)} {esc(sk.description)} 条件：{…} {…} |
| app/views:332 | 332 | 特殊能力 {…} 身につけられる特殊能力 条件の回数をこなすと月末に身につく。活動でコツをつかめば、回数が足りなくても経験点を払って覚えられる。 {next} |
| app/views:332 | 332 | まだない |
| app/views:346 | 346 | 体力が戻る（+{a.stamina}） |
| app/views:346 | 346 | 体力を{-a.stamina}使う |
| app/views:347 | 347 | 伸ばしやすい能力：{grow} |
| app/views:356 | 356 | 自分の画面へ |
| app/views:356 | 356 | 党内の画面へ |
| app/views:356 | 356 | 内閣の画面へ |
| app/views:358 | 358 | {…}を選ぶ |
| app/views:363 | 363 | {secretaryFace(state)} 秘書 {esc(state.secretaryName)} 今月の助言 {items} 数字を全部見る（プロモードにする） |
| app/views:379 | 379 | {partyById(m.party).short}の党首 |
| app/views:380 | 380 | 小選挙区 |
| app/views:380 | 380 | {districtName(m.district!)}（小選挙区） |
| app/views:380 | 380 | 比例 |
| app/views:380 | 380 | 比例（地元 {prefName(m.home)}） |
| app/views:380 | 380 | 浪人・候補（{prefName(m.home)}） |
| app/views:388 | 388 | 中間 |
| app/views:391 | 391 | {…} {esc(m.name.displayName)}{…} {esc(m.name.surnameKana)} {esc(m.name.givenNameKana)} {chip(m.party)} {esc(partyById(m.party).name)} {age}歳・{m.gender} ✕ {esc(seat)} 当選{m.terms}回 地盤{m.jiban} {…}{…} {esc(m.archetype)} {…} 得意：{…} 性格：{…} {bondLine(state, m.id)} {…} {abilities} {ideology} 信念 {m.conviction}/5・党への忠誠 {m.loyalty}/5 |
| app/views:392 | 392 | （自分） |
| app/views:398 | 398 | 特殊能力なし |
| app/views:432 | 432 | 最大 |
| app/views:432 | 432 | 次：{cost} |
| app/views:440 | 440 | {face(p.name.surname, p.party)} {esc(p.name.displayName)} {s.age}歳・{esc(p.archetype)}・{esc(s.origin)}・当選{p.terms}回 基礎能力（経験点を使って上げる） {rows} {skillSection(state, world)} 経験点 {exp} 地盤 {pips} {p.jiban} （次まで {esc(s.jibanProgress)}） 関係 {rel} 党首選 {leader} 経歴 {ach} 画面のモード {modeSwitch(mode, adviceLevel)} セーブ {…} ファイルに書き出す ファイルから読み込む 同じ世界で最初から 新しい世界で最初から |
| app/views:454 | 454 | このブラウザに自動で保存しています（最後の保存 {esc(savedAt)}）。 |
| app/views:454 | 454 | このブラウザには保存できていません。ファイルに書き出してください。 |
| app/views:470 | 470 | 次の党首選： {state.leaderTermEnd.year}年{state.leaderTermEnd.month}月 （党首の任期切れ） |
| app/views:471 | 471 | 次の党首選：総選挙で敗れたときや、党首が落選したときに行われる |
| app/views:473 | 473 | 立候補を届け出た（押すと取り消す） |
| app/views:473 | 473 | 次の党首選に立候補する |
| app/views:474 | 474 | 当選3回以上で、党の幹部との関係が50以上なら立候補できる（党首は生涯3期まで）。今は当選{world.player.terms}回・党の幹部 {state.relations.party}。 |
| app/views:475 | 475 | 党首：{…} {when} {run} |
| app/views:475 | 475 | 不在 |
| app/views:482 | 482 | 名前と役職 {…} |
| app/views:485 | 485 | {face(m.name.surname, m.party)} {esc(m.name.displayName)}{…} 当選{m.terms}回・{…} {extra} {…} |
| app/views:486 | 486 | 浪人 |
| app/views:493 | 493 | 今月の党首の行動はもう残っていない |
| app/views:495 | 495 | 国会の会期外（臨時国会は秋から） |
| app/views:496 | 496 | 党首討論は月に1回 |
| app/views:498 | 498 | 対案の準備が足りない（{opp?.proposals ?? 0}/{OPP.actions.proposal.cost}。政調会長が毎月ためる） |
| app/views:501 | 501 | 不信任案は{OPP.actions.noconfidence.cooldown_months}か月に1回（あと{wait}か月） |
| app/views:525 | 525 | 自分は{esc(state.oppPost.name)}。政権を取ったら、この分野の大臣に就きやすい。 |
| app/views:529 | 529 | 影の内閣（分野ごとの影の大臣） {cabinet} |
| app/views:538 | 538 | 会談 選挙協力 |
| app/views:540 | 540 | {chip(p)} {esc(partyById(p).short)} {…}議席 {…} {c} {…} |
| app/views:540 | 540 | {partyById(p).name}との協力度 {c} {OPP.actions.pact.min_cooperation}以上で選挙協力を結べる。不信任案に賛成するかにも効く 選挙協力をしたときに相手の票が移る割合 {Math.round(pactTransfer(party, p) * 100)}% |
| app/views:540 | 540 | 選挙協力 |
| app/views:544 | 544 | 追い風 {…}{momentum.toFixed(1)} 対案の準備 {opp?.proposals ?? 0} 根回し {opp?.diet ?? 0} |
| app/views:544 | 544 | 自党への追い風 総選挙で全国の支持に {momentum.toFixed(1)} ポイント足される。党首討論、追及、対案で増え、毎月少しずつ弱まる |
| app/views:544 | 544 | 対案の準備 {OPP.actions.proposal.cost}たまると「対案の発表」ができる。政調会長が毎月ためる |
| app/views:544 | 544 | 不信任案の根回し 国対委員長の公務でたまり、不信任案で与党から造反が出やすくなる |
| app/views:546 | 546 | 党首の行動（今月あと{points}回） {…} {offReasons(state, points)} 会談と選挙協力は、下の各党の行から選ぶ。行動を選び終えたら、活動の画面で今月の活動を選ぶと月末になる。 |
| app/views:549 | 549 | 今は使えない：{why} |
| app/views:552 | 552 | 党首になると、ほかの野党との会談、党首討論、追及、対案、選挙協力、不信任案を自分で動かせる。 |
| app/views:553 | 553 | 野党として（与党 {…}{…}） {lineup} {shadow}{shadowList}{status}{actions} ほかの野党 （数字は自分の党との協力度。{OPP.actions.pact.min_cooperation}以上で選挙協力を結べる） {…} |
| app/views:555 | 555 | ほかに野党はない |
| app/views:563 | 563 | 党首 |
| app/views:565 | 565 | {p.name} {n}議席（小選挙区{…}・比例{…}） |
| app/views:566 | 566 | 議席の構成（定数{world.roster.length}・過半数{MAJORITY}） {bar} {…} 党首選 {leaderSection(state, world)} {oppositionSection(state, world)} {chip(party)} {esc(partyById(party).name)}の議員（{members.length}人） {…} |
| app/views:571 | 571 | 議席がない |
| app/views:579 | 579 | 内閣 |
| app/views:582 | 582 | 内閣（首相と大臣） {rankHead()}{…} 与党の役員（{…}） {…} |
| app/views:588 | 588 | 未着手 |
| app/views:589 | 589 | 準備を始める |
| app/views:590 | 590 | 準備完了 |
| app/views:590 | 590 | 否決 |
| app/views:591 | 591 | 国会に出す |
| app/views:593 | 593 | {esc(b.name)} {esc(b.field)}・{b.status}{…} {btn} |
| app/views:593 | 593 | 準備中 |
| app/views:598 | 598 | {chip(p)} {esc(partyById(p).short)}{…} {v} 協議 |
| app/views:598 | 598 | （連立） |
| app/views:600 | 600 | 政権の行動（今月あと{g.actionPoints}回） {…}根回し {…}記者会見 {…}解散 与党の結束 {Math.round(g.cohesion * 100)}%。行動を選び終えたら、活動の画面で今月の活動を選ぶと月末になる。 法案 {bills} 各党の協力度 {talks} |
| app/views:605 | 605 | 与党 {esc(careerSummary(state, world).ruling)} 内閣支持率 {g.approval}% {rows} {gov} |
| app/views:628 | 628 | 山場 |
| app/views:628 | 628 | 政局 |
| app/views:628 | 628 | 自分 |
| app/views:633 | 633 | 大事なこと |
| app/views:634 | 634 | すべて |
| app/views:641 | 641 | 記録 {tabs} ✕ {…} |
| app/views:643 | 643 | まだ記録がない |
| app/views:649 | 649 | 目的 |
| app/views:649 | 649 | 一人の候補者として総選挙での当選を目指す。当選を重ねて大臣や党の役職に就き、与党の党首選に勝てば首相になれる。落選しても浪人として続けられる。75歳になるか、30年たつと引退して議員人生を終える。 |
| app/views:650 | 650 | 1か月の流れ |
| app/views:650 | 650 | 活動を1つ選ぶと1か月進む。カードを押すと説明と効果の見込みが出て、「実行する」ボタンかカードをもう一度押すと実行する。月末に経費が引かれ、日常の出来事が起きることがある。出来事では、選択肢を選ぶと結果が出る。 |
| app/views:651 | 651 | 総選挙 |
| app/views:651 | 651 | 任期満了か解散で行う。小選挙区では、党への支持（内閣支持率による風を含む）に本人の地盤、知名度、後援会・地元紙・県議団との関係、選挙資金が上乗せされる。活動の画面の情勢の棒で見込みが分かる。比例名簿の道では、党の幹部との関係で名簿の順位が決まる。 |
| app/views:652 | 652 | 経験点と能力 |
| app/views:652 | 652 | 活動で5種類の経験点がたまる。「自分」の画面で経験点を使って6つの能力を上げる。能力が高いほど、上げるのに必要な経験点が増える。 |
| app/views:653 | 653 | 地盤と関係 |
| app/views:653 | 653 | 地盤（1〜4）は「地元回り」「地域行事」「県議と連携」で固まり、半年続けて地元の活動をしないと1段下がる。関係（秘書、党の幹部、後援会、地元紙、県議団）は放っておくと40に戻っていく。数字や棒にマウスを乗せるか長押しすると、何に効くかが出る。 |
| app/views:654 | 654 | 党首選と首相 |
| app/views:654 | 654 | 当選3回以上で党の幹部との関係が50以上なら、党内の画面で党首選への立候補を届け出られる。与党の党首選は党首の任期切れのときに行う。与党の党首になると首相になり、内閣の画面で法案や解散などの政権の行動を選べる。 |
| app/views:655 | 655 | 自分の党が野党のときは、当選を重ねると幹事長、政調会長、国対委員長、選対委員長、影の大臣に就き、公務でほかの野党との協力度を上げたり、対案の準備をためたりする。野党の党首になると、党内の画面で、ほかの野党との会談、党首討論、失政の追及、対案の発表、選挙協力（候補者の一本化）、内閣不信任案の提出を毎月使える。選挙協力を結んだ党とは、小選挙区で一方が候補を降ろし、その党の票の一部がもう一方に移る。 |
| app/views:656 | 656 | 特殊能力とコツ |
| app/views:656 | 656 | 活動の回数などの条件を満たすと、月末に特殊能力が身につく。活動のあとにときどき「コツ」をつかみ、コツがあれば回数が足りなくても「自分」の画面で経験点を払って覚えられる。 |
| app/views:657 | 657 | 記録 |
| app/views:657 | 657 | 状態の帯（日付や資金の並び）の「記録」で、自分に起きたことと政局の動き（政権の行動、採決、政界の出来事）を月ごとに振り返れる。「大事なこと」では、総選挙や就任、政権交代などの山場と、出来事の結果だけを出す。 |
| app/views:658 | 658 | 画面のモード |
| app/views:658 | 658 | 通常モードでは、秘書が毎月の助言とおすすめの活動を教えてくれ、細かい数字は省かれる。プロモードでは、経験点や関係などのすべての数字が出る。最初の画面と「自分」の画面で切り替えられる。 |
| app/views:659 | 659 | 保存 |
| app/views:659 | 659 | 状態はこのブラウザに自動で保存され、最初の画面の「続きから」で再開できる。「自分」の画面からファイルへの書き出しと読み込みができる。 |
| app/views:660 | 660 | キー操作 |
| app/views:660 | 660 | 1〜5：画面の切り替え。活動の画面では ← → で選んで Enter で実行。出来事は数字キーで選ぶ。Esc でポップアップを閉じる。 |
| app/views:664 | 664 | 遊び方 ✕ {…} 議員人生 {esc(VERSION_LABEL)} |
| app/views:688 | 688 | 前回比 {…}{swing.toFixed(1)} |
| app/views:689 | 689 | 比例名簿 {e.pr!.rank}位（党の比例当選 {e.pr!.seats}人） |
| app/views:694 | 694 | {partyById(words.rival.party).short}・{…} |
| app/views:694 | 694 | 当選 |
| app/views:694 | 694 | 落選 |
| app/views:696 | 696 | {e.year}年{e.month}月 |
| app/views:699 | 699 | {e.year}年{e.month}月 総選挙 開票結果 {rows} {…} {district} {selfLine}{rivalLine} {…} 続ける |
| app/views:703 | 703 | 当選確実 |
| app/views:717 | 717 | 秘書 |
| app/views:721 | 721 | {esc(h.title)} {esc(h.text)} {lines} 続ける |
| app/views:754 | 754 | あなたとの関係 {…}{b.value}（{bondWord(b.value)}） 間柄 {…} |
| app/views:754 | 754 | まだ決まっていない |
| app/views:755 | 755 | まだ関係がない |
| app/views:758 | 758 | 前回の総選挙 {…} {pct(them.share)} 自分 {pct(me.share)} |
| app/views:775 | 775 | 第{scene.chapterNo}章（{scene.chapterNo} / {scene.chapterCount}） |
| app/views:776 | 776 | 物語「{esc(scene.title)}」 {chapterText} 会話の履歴 {esc(scene.place)} {…} |
| app/views:777 | 777 | この章を飛ばす |
| app/views:783 | 783 | {plate} {esc(cur.text)} 押すと次へ（{v.line + 1} / {scene.lines.length}） ▼ |
| app/views:789 | 789 | もう1回で決定 |
| app/views:795 | 795 | 会話の履歴 {…} 閉じる |
| app/views:800 | 800 | {head}{stage}{bottom} 物語 {esc(scene.title)} 章 {chapterText} {storyBondPanel(state, scene)} {history} |
| app/views:809 | 809 | 物語「{esc(r.title)}」 {esc(r.label)} {esc(r.result)} {…} {…} {…} |
| app/views:812 | 812 | 結末 {esc(r.ending.title)} {esc(r.ending.text)} |
| app/views:813 | 813 | 物語を閉じる |
| app/views:813 | 813 | 次へ |
| app/views:820 | 820 | {…} あなたとの関係 {…}{b.value}（{bondWord(b.value)}）{…} |
| app/views:820 | 820 | 知り合い |
| app/views:820 | 820 | ・間柄「{esc(b.tag)}」 |

### app/main（画面の操作と確認の文）

| 番号 | 行 | 文 |
|---|---|---|
| app/main:28 | 28 | 活動 |
| app/main:28 | 28 | 今月の活動 |
| app/main:29 | 29 | 地図 |
| app/main:29 | 29 | 全国の情勢 |
| app/main:30 | 30 | 党内 |
| app/main:31 | 31 | 内閣 |
| app/main:32 | 32 | 自分 |
| app/main:32 | 32 | 能力と経歴 |
| app/main:84 | 84 | {…} やめる {esc(c.ok)} |
| app/main:168 | 168 | このブラウザに保存できませんでした。「自分」の画面からファイルに書き出してください。 |
| app/main:187 | 187 | {saveLabel(save)}から再開した。 |
| app/main:217 | 217 | 今のゲームを終えて、ファイルのデータを読み込みますか？ |
| app/main:217 | 217 | 読み込む |
| app/main:246 | 246 | 議員人生 はじめる {…} {confirmHtml()} |
| app/main:247 | 247 | 名前データを読み込んでいます… |
| app/main:257 | 257 | 議員人生 ― {esc(world.player.name.displayName)}・当選{world.player.terms}回 {tab.title} {…} {body} {statusBar(state, world, app.mode)} {modalHtml()} {…} |
| app/main:275 | 275 | 比例 |
| app/main:278 | 278 | {…} {chip(m.party)} {esc(m.name.displayName)} {esc(partyById(m.party).short)}・当選{m.terms}回・地盤{m.jiban} |
| app/main:280 | 280 | {esc(PREFECTURES[pref - 1].name)} （小選挙区{smd.length}） {rows} {…} |
| app/main:280 | 280 | 比例：{…} |
| app/main:281 | 281 | {info} 県を押すと、その県の議員を表示します。県の色はその県で小選挙区の議席が最も多い党、赤い太枠の県が自分の地元です。 {mapLegend(w.roster)} |
| app/main:287 | 287 | 小選挙区 |
| app/main:289 | 289 | 県の色＝小選挙区の議席が最も多い政党（数は全国の小選挙区の議席） {…} |
| app/main:323 | 323 | {esc(r.title)} 選んだこと：{esc(r.choice)} {esc(r.text)} {…} 閉じる |
| app/main:348 | 348 | {…} 議員人生の終わり {esc(state.over)} {…} 同じ世界でもう一度 新しい世界で遊ぶ |
| app/main:374 | 374 | このブラウザに保存している続き（{saved}）は消えます。新しく始めますか？ 残すときは、先に「続きから」で開いて「自分」の画面からファイルに書き出してください。 |
| app/main:374 | 374 | 新しく始める |
| app/main:410 | 410 | 内閣支持率 {before.approval}→{after.approval}% |
| app/main:419 | 419 | （支持率の変化で{…}に{…}） |
| app/main:419 | 419 | 与党である自党 |
| app/main:419 | 419 | 野党である自党 |
| app/main:419 | 419 | 追い風 |
| app/main:419 | 419 | 向かい風 |
| app/main:421 | 421 | （相手の陣営の動きや関係の変化） |
| app/main:423 | 423 | 情勢の見込み {pct(before.share)}→{pct(after.share)}{reason} |
| app/main:426 | 426 | 体力の上限が{after.maxStamina}になった |
| app/main:427 | 427 | 特殊能力「{skillById(id)?.name}」を身につけた！ |
| app/main:428 | 428 | 特殊能力「{skillById(id)?.name}」が外れた |
| app/main:575 | 575 | {d.up}を{n}上げた |
| app/main:584 | 584 | この章のセリフを飛ばして、選択肢に進みますか？ |
| app/main:584 | 584 | 飛ばす |
| app/main:613 | 613 | 衆議院を解散して、月末に総選挙を行いますか？ |
| app/main:613 | 613 | 解散する |
| app/main:617 | 617 | 内閣不信任案を提出しますか？ 否決されると、党への追い風が弱まり、反対した党との協力度が下がります。 |
| app/main:617 | 617 | 提出する |
| app/main:647 | 647 | 今のゲームの続きは消えます。最初から始めますか？ 残すときは、先にファイルに書き出してください。 |
| app/main:647 | 647 | 最初から始める |
| app/main:651 | 651 | このブラウザに保存している続き（{…}）を消しますか？ 消すと元に戻せません。 |
| app/main:651 | 651 | セーブデータ |
| app/main:651 | 651 | 消す |
| app/main:653 | 653 | セーブデータを消しました |
| app/main:864 | 864 | 議員 |

