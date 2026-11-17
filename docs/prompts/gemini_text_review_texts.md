# 議員人生：ゲームの中の文章（Gemini が書いていない分）

抜き出した日：2026-11-17。全部で 1012 件。
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
| career-31 | activities[5].description | 県議会議員と地元の会合を回る。県議団との関係が深まると、地元の票を固めてくれる。 |
| career-32 | activities[6].name | 地域行事 |
| career-33 | activities[6].description | 祭りや運動会、清掃活動に顔を出す。地道だが後援会と地盤に効く。 |
| career-34 | activities[7].name | 体力づくり |
| career-35 | activities[7].description | 走り込みで体を鍛える。体力の上限が少し上がる。 |
| career-36 | activities[8].name | 趣味の時間 |
| career-37 | activities[8].description | 好きなことをして気分を変える。やる気が上がりやすい。 |
| career-38 | activities[9].name | 休養 |
| career-39 | activities[9].description | 体を休める。体力が戻り、やる気が上がることがある。 |

### life_events（日常の出来事（Claude が書いた分だけ））

| 番号 | 場所 | 文 |
|---|---|---|
| life_events-1 | events[0].title | 秋祭りの神輿 |
| life_events-2 | events[0].text | 地元の秋祭りで、町内会長から「今年は神輿を担いでみないか」と声をかけられた。 |
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
| life_events-22 | events[2].choices[1].result | まじめな意見交換になったが、距離は少し縮まった。 |
| life_events-23 | events[3].title | 健康診断の結果 |
| life_events-24 | events[3].text | 健康診断で「少し運動したほうがいい」と言われた。 |
| life_events-25 | events[3].choices[0].label | 朝のジョギングを始める |
| life_events-26 | events[3].choices[0].result | 朝の川沿いで、散歩中の有権者とよく会うようになった。 |
| life_events-27 | events[3].choices[1].label | 食事に気を付ける |
| life_events-28 | events[3].choices[1].result | 少し体が軽くなった。 |
| life_events-29 | events[3].choices[2].label | 忙しいので後回しにする |
| life_events-30 | events[3].choices[2].result | なんとなく体が重い。 |
| life_events-31 | events[4].title | 大雪 |
| life_events-32 | events[4].text | 記録的な大雪で、地元の高齢者の家が雪に埋もれていると連絡が入った。 |
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
| life_events-44 | events[6].text | 地元の名物を紹介した短い動画が、思いがけずネットで広まり始めた。 |
| life_events-45 | events[6].choices[0].label | 続けて動画を出す |
| life_events-46 | events[6].choices[0].result | 顔と名前を覚えてくれる人が増えた。 |
| life_events-47 | events[6].choices[1].label | 浮かれずに本業に戻る |
| life_events-48 | events[6].choices[1].result | 少し話題になって、すぐに落ち着いた。 |
| life_events-49 | events[7].title | 同期の集まり |
| life_events-50 | events[7].text | 同じ年に公認を受けた同期の候補たちから、勉強会を兼ねた集まりに誘われた。 |
| life_events-51 | events[7].choices[0].label | 参加して政策を語り合う |
| life_events-52 | events[7].choices[0].result | 互いの選挙区の苦労話で盛り上がった。 |
| life_events-53 | events[7].choices[1].label | 地元を優先して断る |
| life_events-54 | events[7].choices[1].result | その日も地元を回った。 |
| life_events-55 | events[8].title | 母校の講演 |
| life_events-56 | events[8].text | 母校の高校から、生徒向けに「働くことと社会」について話してほしいと頼まれた。 |
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
| life_events-80 | events[12].text | 所属する委員会で、30分の質問時間が回ってきた。 |
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
| life_events-94 | events[14].text | 地元の商工会の陳情団が、議員会館に上京してきた。 |
| life_events-95 | events[14].choices[0].label | 関係する省庁まで同行する |
| life_events-96 | events[14].choices[0].result | 役所の担当者に要望を直接伝えられた。 |
| life_events-97 | events[14].choices[1].label | 会館で話を聞いて要望書を預かる |
| life_events-98 | events[14].choices[1].result | 丁寧に話を聞いた。 |
| life_events-99 | events[15].title | 応援演説の依頼 |
| life_events-100 | events[15].text | 党から、隣の県の候補者の応援演説に行ってほしいと頼まれた。 |
| life_events-101 | events[15].choices[0].label | 引き受けて駆けつける |
| life_events-102 | events[15].choices[0].result | 党の幹部から感謝された。 |
| life_events-103 | events[15].choices[1].label | 地元の行事と重なるので断る |
| life_events-104 | events[15].choices[1].result | 地元の行事に出た。 |
| life_events-105 | events[16].title | 政治資金パーティー |
| life_events-106 | events[16].text | 事務所が政治資金パーティーを開きたいと言ってきた。 |
| life_events-107 | events[16].choices[0].label | 開く |
| life_events-108 | events[16].choices[0].result | 多くの支援者が集まり、まとまった資金ができた。 |
| life_events-109 | events[16].choices[1].label | 今年は見送る |
| life_events-110 | events[16].choices[1].result | 資金は増えなかったが、批判を受ける心配もない。 |
| life_events-111 | events[17].title | 浪人の暮らし |
| life_events-112 | events[17].text | 議員でない間は収入が細い。知人から、講師や顧問の仕事を紹介された。 |
| life_events-113 | events[17].choices[0].label | 引き受けて生活を立て直す |
| life_events-114 | events[17].choices[0].result | 暮らしは安定したが、地元に出る日は減った。 |
| life_events-115 | events[17].choices[1].label | 断って地元回りを続ける |
| life_events-116 | events[17].choices[1].result | 苦しい台所事情でも、地元の人は見てくれていた。 |
| life_events-117 | events[18].title | 朝の駅頭 |
| life_events-118 | events[18].text | 落選してから、毎朝駅前に立ち続けている。今朝は雨だ。 |
| life_events-119 | events[18].choices[0].label | 傘を差さずに立つ |
| life_events-120 | events[18].choices[0].result | ずぶぬれの姿に、足を止めて声をかけてくれる人がいた。 |
| life_events-121 | events[18].choices[1].label | 今日は休む |
| life_events-122 | events[18].choices[1].result | 体を休めた。 |
| life_events-123 | events[19].title | 国会答弁 |
| life_events-124 | events[19].text | 野党の追及が厳しい委員会で、所管の問題について答弁に立つことになった。 |
| life_events-125 | events[19].choices[0].label | 自分で答弁を練り上げる |
| life_events-126 | events[19].choices[0].result | 具体的な数字を交えて答え、追及をかわした。 |
| life_events-127 | events[19].choices[1].label | 官僚の答弁書を読み上げる |
| life_events-128 | events[19].choices[1].result | 無難に乗り切った。 |
| life_events-129 | events[19].choices[1].risk.fail_result | 答弁書の読み違えを突かれ、委員会が紛糾した。 |
| life_events-130 | events[20].title | 所管の不祥事 |
| life_events-131 | events[20].text | 所管する役所で、統計の不適切な扱いが発覚した。 |
| life_events-132 | events[20].choices[0].label | 自ら記者会見を開いて謝罪する |
| life_events-133 | events[20].choices[0].result | 率直な謝罪が一定の評価を得た。 |
| life_events-134 | events[20].choices[1].label | 事務方に説明を任せる |
| life_events-135 | events[20].choices[1].result | 説明が二転三転し、批判が大臣にも向いた。 |
| life_events-136 | events[21].title | 党内の不穏な動き |
| life_events-137 | events[21].text | 執行部への不満を持つ若手が、会合を重ねているという話が耳に入った。 |
| life_events-138 | events[21].choices[0].label | 若手を食事に誘って話を聞く |
| life_events-139 | events[21].choices[0].result | 不満の中身が分かり、手を打てた。 |
| life_events-140 | events[21].choices[1].label | 放っておく |
| life_events-141 | events[21].choices[1].result | 不満はくすぶり続けている。 |
| life_events-142 | events[22].title | 首相の決断 |
| life_events-143 | events[22].text | 景気の先行きが怪しい。経済対策の規模をどうするか、首相として決めなければならない。 |
| life_events-144 | events[22].choices[0].label | 大型の経済対策を打つ |
| life_events-145 | events[22].choices[0].result | 市場は好感したが、財政規律派から批判も出た。 |
| life_events-146 | events[22].choices[1].label | 慎重に様子を見る |
| life_events-147 | events[22].choices[1].result | 大きな動きはなかった。 |
| life_events-148 | events[22].choices[2].label | 国民に直接語りかける |
| life_events-149 | events[22].choices[2].result | 首相の言葉が評価を集めた。 |
| life_events-150 | events[22].choices[2].risk.fail_result | 言葉が空回りし、かえって批判を浴びた。 |
| life_events-151 | events[23].title | 代表質問 |
| life_events-152 | events[23].text | 野党の党首として、本会議で首相に代表質問をする機会が回ってきた。 |
| life_events-153 | events[23].choices[0].label | 政権の弱点を鋭く突く |
| life_events-154 | events[23].choices[0].result | 首相を答弁に詰まらせ、野党の存在感を示した。 |
| life_events-155 | events[23].choices[0].risk.fail_result | 準備不足を見透かされ、逆に首相に言い返された。 |
| life_events-156 | events[23].choices[1].label | 対案を示して論戦を挑む |
| life_events-157 | events[23].choices[1].result | 政策の中身で勝負する姿勢が評価された。 |

### bills（法案（Claude が書いた分だけ））

| 番号 | 場所 | 文 |
|---|---|---|
| bills-1 | bills[0].name | 2026年度予算 |
| bills-2 | bills[0].description | 3月末までに成立させないと支持率が大きく下がる。思想の偏りがないので野党も反対しにくい。 |
| bills-3 | bills[1].name | 子育て支援拡充法案 |
| bills-4 | bills[1].description | 再分配寄り。野党の多くが賛成しやすいが、財政規律派は渋る。 |
| bills-5 | bills[2].name | 所得税減税法案 |
| bills-6 | bills[2].description | 積極財政寄り。協和党が強く望む。 |
| bills-7 | bills[3].name | 防衛力強化法案 |
| bills-8 | bills[3].description | 抑止重視。保守系の野党は賛成しやすいが、公正党の中にも反対が出やすい。 |
| bills-9 | bills[4].name | 地方創生交付金法案 |
| bills-10 | bills[4].description | 地方への財源移譲。刷新が評価しやすい。 |
| bills-11 | bills[5].name | 選択的夫婦別姓法案 |
| bills-12 | bills[5].description | 多様性重視。野党の多くは賛成だが、民政党の保守派が造反しやすい。 |
| bills-13 | bills[6].name | 政治資金規正法改正案 |
| bills-14 | bills[6].description | 改革寄り。世論の受けはよいが、安定志向の議員は乗り気でない。 |
| bills-15 | bills[7].name | 原発再稼働推進法案 |
| bills-16 | bills[7].description | 市場・安定寄り。左派の野党は強く反対する。 |
| bills-17 | bills[8].name | 農業所得補償法案 |
| bills-18 | bills[8].description | 地方の農業票に効く。市場重視派は渋る。 |

### events（政局の出来事（Claude が書いた分だけ））

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
| events-9 | events[1].lines[0].text | 週刊誌が、{member}の政治資金をめぐる疑惑を報じた。 |
| events-10 | events[1].lines[1].text | 記載に不備があったかもしれませんが、私的に使ったことは一切ありません。 |
| events-11 | events[1].lines[2].text | 与党はいつまで同じことを繰り返すつもりですか。徹底的に追及します。 |
| events-12 | events[1].lines[3].text | 党内も動揺しています。早めに手を打たないと。 |
| events-13 | events[2].title | 景気指標が好調 |
| events-14 | events[2].text | 景気指標が予想を上回り、政権への評価が上向いた。 |
| events-15 | events[2].lines[0].text | 発表された景気指標が、市場の予想を上回った。 |
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
| highlights-11 | scenes.pm_change.variants[0][0].text | 後のことは、新しい総裁に託したい。 |
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
| highlights-26 | scenes.player_post.variants[1][0].text | 先生、官邸から呼び込みの電話です。{post}だそうです！ |
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
| skills-20 | skills[9].description | 地元を歩くのが苦にならない。地元回りの経験点と地盤の固まり方が増える。 |
| skills-21 | skills[10].name | 組織票 |
| skills-22 | skills[10].description | 支援団体の票が固い。選挙で本人の票が上乗せされる。 |
| skills-23 | skills[11].name | 無党派に強い |
| skills-24 | skills[11].description | 顔と名前で無党派の票を取れる。選挙の票と発信の経験点が増える。 |
| skills-25 | skills[12].name | 専門家答弁 |
| skills-26 | skills[12].description | 専門分野の質問に強い。出来事の政策の判定に強く、勉強会の経験点が増える。 |
| skills-27 | skills[13].name | 行政手腕 |
| skills-28 | skills[13].description | 役所を動かすのがうまい。公務の成果と県議団との関係が上がりやすい。 |
| skills-29 | skills[14].name | 後援会継承 |
| skills-30 | skills[14].description | 親の後援会を受け継いだ。後援会との関係が上がりやすく、票も少し上乗せされる。 |
| skills-31 | skills[15].name | 財界人脈 |
| skills-32 | skills[15].description | 経済界に顔が利く。資金集めで得る資金が増える。 |
| skills-33 | skills[16].name | 段取り上手 |
| skills-34 | skills[16].description | 仕事の段取りがよい。どの活動でも経験点が少し増える。 |
| skills-35 | skills[17].name | 国際感覚 |
| skills-36 | skills[17].description | 海外の事情に明るい。勉強会と公務の経験点が増える。 |
| skills-37 | skills[18].name | 安保の実務 |
| skills-38 | skills[18].description | 安全保障の現場を知っている。公務と出来事の政策の判定に強い。 |
| skills-39 | skills[19].name | 現場の声 |
| skills-40 | skills[19].description | 現場の人の話を聞くのがうまい。後援会との関係と地域行事の経験点が増える。 |
| skills-41 | skills[20].name | 辻説法 |
| skills-42 | skills[20].description | 駅前で足を止めさせる話術。街頭演説の経験点が増える。 |
| skills-43 | skills[21].name | 体力自慢 |
| skills-44 | skills[21].description | 疲れ知らず。活動で使う体力が減る。 |
| skills-45 | skills[22].name | 発信力 |
| skills-46 | skills[22].description | 言葉が広まりやすい。街頭演説の経験点と地元紙との関係が上がりやすい。 |
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
| skills-57 | skills[27].description | 根回しが苦手。党の幹部と県議団との関係が上がりにくい。 |
| skills-58 | skills[28].name | 炎上体質 |
| skills-59 | skills[28].description | 発言が燃えやすい。街頭演説のあとに炎上することがある。 |
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
| opposition-6 | texts.debate_win[0] | 党首討論で{pm}首相の答弁の食い違いを突き、会場がどよめいた。 |
| opposition-7 | texts.debate_win[1] | 党首討論で具体的な数字を示して迫り、{pm}首相は答えに詰まった。 |
| opposition-8 | texts.debate_win[2] | 党首討論で暮らしの実感を訴え、{pm}首相を守りに回らせた。 |
| opposition-9 | texts.debate_lose_unprepared[0] | 党首討論で「批判ばかりで対案がない」と切り返された。 |
| opposition-10 | texts.debate_lose_unprepared[1] | 党首討論で「では、あなたの党ならどうするのか」と問われ、答えが続かなかった。 |
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
| dialogue-2 | scenes.start.variants[0][0].text | {year}年1月。少数与党のまま、石橋内閣が船出した。 |
| dialogue-3 | scenes.start.variants[0][1].text | 国民の皆さんに納得していただける政治を、一つずつ積み上げていきたい。 |
| dialogue-4 | scenes.start.variants[0][2].text | 総理、まずは予算です。3月末までに通さなければなりません。 |
| dialogue-5 | scenes.start.variants[0][3].text | うちと公正党だけでは過半数に届きません。どこかの野党と話をつける必要があります。 |
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
| game/career:112 | 112 | 小選挙区 |
| game/career:112 | 112 | 引退する現職の後継 |
| game/career:112 | 112 | 比例名簿 |
| game/career:200 | 200 | 候補 |
| game/career:200 | 200 | 議員 |
| game/career:200 | 200 | 浪人 |
| game/career:260 | 260 | {s.year}年{s.month}月 |
| game/career:300 | 300 | 現職：{h.name.displayName}（{partyById(h.party).short}・{h.terms}回） |
| game/career:300 | 300 | 現職なし |
| game/career:302 | 302 | {h.name.displayName}（{ageOf(h)}歳）の後継 |
| game/career:304 | 304 | 比例名簿（順位は党の幹部との関係で決まる） |
| game/career:309 | 309 | 親：{h.name.displayName}の地盤を継ぐ |
| game/career:311 | 311 | 親の地盤を継ぐ |
| game/career:353 | 353 | 党首 |
| game/career:377 | 377 | {partyById(world.player.party).short}の党首 |
| game/career:378 | 378 | {partyById(world.player.party).short}の{state.oppPost.name} |
| game/career:436 | 436 | 影の大臣（{p.specialties[0]}） |
| game/career:459 | 459 | {title}に就いた。 |
| game/career:483 | 483 | {c.member.name.displayName}{…}{c.votes}票 |
| game/career:483 | 483 | （自分） |
| game/career:485 | 485 | {partyById(party).short}の党首選（{reason}）：{votes}。{result.winner.name.displayName}が{…}。 |
| game/career:485 | 485 | 再選された |
| game/career:485 | 485 | 新しい党首に選ばれた |
| game/career:486 | 486 | 党首選に敗れた。 |
| game/career:492 | 492 | 首相は党首の任期の上限に達し、退いた。 |
| game/career:519 | 519 | ゲームは終わっています。 |
| game/career:520 | 520 | 政権の行動は首相のときだけとれます。 |
| game/career:536 | 536 | 衆議院の解散を決めた。月末に総選挙になる。 |
| game/career:538 | 538 | 政権の行動は draft / submit / talk / nemawashi / press / dissolve です。 |
| game/career:559 | 559 | 準備中 |
| game/career:561 | 561 | {billName(g, b)}の準備が進んだ |
| game/career:569 | 569 | {partyById(top).short}との協力度+{d.cooperation} |
| game/career:574 | 574 | 党の結束{Math.round(g.cohesion * 100)}% |
| game/career:576 | 576 | 公務（{state.post}）：{…} |
| game/career:592 | 592 | {partyById(top).short}との協力度+{d.coop_top} |
| game/career:596 | 596 | 野党各党との協力度+{d.coop_all} |
| game/career:600 | 600 | 対案の準備+{d.proposals} |
| game/career:604 | 604 | 不信任案の根回し+{d.diet} |
| game/career:608 | 608 | 党に追い風 |
| game/career:658 | 658 | 野党党首会談 |
| game/career:658 | 658 | ほかの野党の党首と会い、協力度を上げる。思想が近いほど上がりやすい。 |
| game/career:659 | 659 | 党首討論 |
| game/career:659 | 659 | 国会の会期中、首相と論戦する。弁舌と政策で上回れば、内閣支持率が下がり自党に追い風。 |
| game/career:660 | 660 | 失政の追及 |
| game/career:660 | 660 | 政権の失政や不祥事を追及する。長期政権ほど通りやすいが、失敗すると自分に返ってくる。 |
| game/career:661 | 661 | 対案の発表 |
| game/career:661 | 661 | 準備した対案（政調会長がためる）を発表し、政権を担える党だと示す。 |
| game/career:662 | 662 | 選挙協力の締結 |
| game/career:662 | 662 | 協力度の高い野党と、小選挙区の候補者を一本化する約束をする。総選挙まで有効。 |
| game/career:663 | 663 | 内閣不信任案の提出 |
| game/career:663 | 663 | 野党の票と与党の造反で過半数を取れば可決。支持率が高ければ解散、低ければ総辞職になる。 |
| game/career:699 | 699 | 野党の党首のときだけ使えます。 |
| game/career:701 | 701 | 今月の党首の行動はもう残っていません。 |
| game/career:711 | 711 | 会談の相手を選んでください（{…}）。 |
| game/career:719 | 719 | {partyById(arg).short}の党首と会談し、協力で一致した（協力度{opp.cooperation[arg]}、+{gain}）。 |
| game/career:722 | 722 | {partyById(arg).short}との会談は、政策の違いが表に出て物別れに終わった（協力度{opp.cooperation[arg]}）。 |
| game/career:727 | 727 | 党首討論は国会の会期中だけです。 |
| game/career:728 | 728 | 党首討論は月に1回です。 |
| game/career:730 | 730 | 弁舌 |
| game/career:738 | 738 | {…}（内閣支持率{D.win_approval}、自党に追い風） |
| game/career:742 | 742 | {…}（内閣支持率+{D.lose_approval}） |
| game/career:748 | 748 | 調査の費用（{-P.money}万円）が足りません。 |
| game/career:750 | 750 | 出来事 |
| game/career:757 | 757 | {…}（内閣支持率{P.win_approval}、与党の結束{Math.round(g.cohesion * 100)}%） |
| game/career:767 | 767 | 対案の準備が足りません（{opp.proposals}/{P.cost}）。政調会長が毎月ためてくれます。 |
| game/career:772 | 772 | 独自の対案を発表した。政権を担える党だと訴えた（自党に追い風+{gain}）。 |
| game/career:777 | 777 | 選挙協力の相手を選んでください。 |
| game/career:778 | 778 | {partyById(arg).short}とはもう選挙協力を結んでいます。 |
| game/career:779 | 779 | 協力度が{P.min_cooperation}以上の党とだけ結べます（今は{opp.cooperation[arg] ?? 0}）。 |
| game/career:782 | 782 | 選挙協力は、任期満了まで{P.months_before}か月を切ってから結べます（あと{monthsLeft}か月）。 |
| game/career:785 | 785 | {partyById(arg).short}と選挙協力を結んだ。小選挙区では候補者を一本化する（票の移り方 {…}%）。 |
| game/career:788 | 788 | {partyById(arg).short}との選挙協力の協議は、候補者の調整で折り合わなかった。 |
| game/career:795 | 795 | 不信任案は{N.cooldown_months}か月に1回までです。 |
| game/career:802 | 802 | 内閣不信任案を提出し、賛成{r.yes}・反対{r.no}で可決された！（与党からの造反{r.defectors}人）。月末に内閣の進退が決まる。 |
| game/career:807 | 807 | 内閣不信任案を提出したが、賛成{r.yes}・反対{r.no}で否決された（与党からの造反{r.defectors}人）。 |
| game/career:812 | 812 | その行動はありません。 |
| game/career:834 | 834 | この出自と政党では、その道と区からは出馬できません |
| game/career:836 | 836 | なし |
| game/career:913 | 913 | {party.name}の比例名簿に載る候補に選ばれた。地元の{where}を拠点に、党への貢献で名簿の上位を目指す。 |
| game/career:915 | 915 | {party.name}の公募で、引退を表明した{parent!.name.displayName}の後継に選ばれた。{seatName}の地盤は一から作り直しだ。 |
| game/career:917 | 917 | {party.name}の公認を得た。引退を決めた{holder!.name.displayName}の地盤を継ぎ、{seatName}で次の総選挙に挑む。 |
| game/career:918 | 918 | {party.name}の公募で候補に選ばれた。次の総選挙で、{seatName}の議席を狙う。 |
| game/career:982 | 982 | {partyById(e.party).short}の候補 |
| game/career:1026 | 1026 | 体力の上限{state.maxStamina} |
| game/career:1042 | 1042 | 資金{…}{e.money}万円 |
| game/career:1047 | 1047 | 内閣支持率{…}{e.approval} |
| game/career:1058 | 1058 | 特殊能力「{sk.name}」を身につけた |
| game/career:1065 | 1065 | 特殊能力「{sk.name}」が外れた |
| game/career:1101 | 1101 | 特殊能力「{g.name}」を身につけた！ {g.description} |
| game/career:1102 | 1102 | 欠点「{l.name}」を克服した。 |
| game/career:1102 | 1102 | 特殊能力「{l.name}」は上位の能力に置き換わった。 |
| game/career:1123 | 1123 | 地盤が{world.player.jiban}に上がった |
| game/career:1133 | 1133 | 先に出来事「{state.pendingEvent.title}」の選択肢を選んでください。 |
| game/career:1135 | 1135 | 公務は役職に就いているときだけできます。 |
| game/career:1142 | 1142 | その活動はありません。 |
| game/career:1148 | 1148 | {act.name}の途中で体調を崩し、寝込んでしまった。 |
| game/career:1161 | 1161 | 資金+{m}万円 |
| game/career:1165 | 1165 | やる気が上がった |
| game/career:1168 | 1168 | 体力が戻った |
| game/career:1186 | 1186 | 。【コツ】「{sk.name}」のコツをつかんだ（Lv{state.skillHints[sk.id]}） |
| game/career:1197 | 1197 | コツで覚えられる特殊能力ではありません。 |
| game/career:1198 | 1198 | もう持っています。 |
| game/career:1199 | 1199 | まだコツをつかんでいません。 |
| game/career:1202 | 1202 | 能力、当選回数、地盤の条件を満たしていません。 |
| game/career:1204 | 1204 | 経験点が足りません。 |
| game/career:1217 | 1217 | コツを生かして、特殊能力「{sk.name}」を身につけた！ |
| game/career:1218 | 1218 | 特殊能力「{sk.name}」を身につけた！ |
| game/career:1244 | 1244 | 選ぶ出来事はありません。 |
| game/career:1247 | 1247 | 選択肢は1〜{ev.choices.length}です。 |
| game/career:1251 | 1251 | 体力{…}{eff.stamina} |
| game/career:1252 | 1252 | やる気が下がった |
| game/career:1293 | 1293 | 資金が尽き、事務所の家賃の支払いに困った。 |
| game/career:1311 | 1311 | 地元に顔を出さない日が続き、地盤が{world.player.jiban}に下がった。 |
| game/career:1327 | 1327 | 内閣不信任案が可決された |
| game/career:1329 | 1329 | 任期満了 |
| game/career:1336 | 1336 | 内閣不信任案が可決され、首相は衆議院を解散した。 |
| game/career:1338 | 1338 | 内閣不信任案が可決され、内閣は総辞職した。 |
| game/career:1339 | 1339 | 内閣総辞職 |
| game/career:1347 | 1347 | 支持率の低迷（{g.approval}%）が続き、首相が辞任を表明した。 |
| game/career:1348 | 1348 | 首相の辞任 |
| game/career:1356 | 1356 | 首相として衆議院を解散した（内閣支持率{g.approval}%）。 |
| game/career:1359 | 1359 | 首相が衆議院を解散した（内閣支持率{g.approval}%）。 |
| game/career:1362 | 1362 | 衆議院議員の任期が満了した。 |
| game/career:1389 | 1389 | 、首相在任{Math.floor(state.pmMonths / 12)}年{state.pmMonths % 12}か月 |
| game/career:1390 | 1390 | 政界を引退した（{age}歳、{years}年）。総選挙{state.elections.length}回で当選{wins}回{pmYears}{…}。 |
| game/career:1390 | 1390 | 、最後の役職は{state.post} |
| game/career:1419 | 1419 | 選挙費用に{cost}万円を使った。 |
| game/career:1440 | 1440 | 選挙協力（{…}）で、小選挙区の候補者を一本化して戦った。 |
| game/career:1450 | 1450 | 比例名簿{rank + 1}位（党の比例当選{prSeats}人） |
| game/career:1450 | 1450 | 得票率{…} |
| game/career:1451 | 1451 | {…}！ {how}で{partyById(state.setup.party).name}の衆議院議員になった。 |
| game/career:1451 | 1451 | 初当選 |
| game/career:1451 | 1451 | {me.terms}回目の当選 |
| game/career:1457 | 1457 | 比例名簿{rank + 1}位で、党の比例当選{prSeats}人に届かなかった |
| game/career:1457 | 1457 | 得票率{…}で{d!.winner.name.displayName}（{partyById(d!.winner.party).short}）に敗れた |
| game/career:1458 | 1458 | 落選。{how}。浪人として次の選挙を目指す。 |
| game/career:1462 | 1462 | {dateOf(state)} 初当選 |
| game/career:1474 | 1474 | 政権を失って |
| game/career:1474 | 1474 | 党首の落選 |
| game/career:1483 | 1483 | {describeRuling(coalition.ruling)}の連立政権が発足し、{pmName}が首相に就いた。 |
| game/career:1506 | 1506 | 衆議院議員の任期が満了した |
| game/career:1508 | 1508 | 行動 |
| game/career:1553 | 1553 | 前首相 |
| game/career:1555 | 1555 | 首相 |
| game/career:1559 | 1559 | 秘書 |
| game/career:1624 | 1624 | 最大 |
| game/career:1648 | 1648 | {state.leaderTermEnd.year}年{state.leaderTermEnd.month}月（与党の党首の任期切れ） |
| game/career:1651 | 1651 | {state.gov.termEnd.year}年{state.gov.termEnd.month}月（解散があれば早まる） |

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
| game/advice:87 | 87 | 総選挙まであと{mo.monthsToElection}か月。相手の{top.name}に{gap}ポイント負けています。地元回りで地盤を固めましょう。 |
| game/advice:88 | 88 | 総選挙まであと{mo.monthsToElection}か月、情勢は優勢です（{-gap}ポイントの差）。油断せず地元を固めましょう。 |
| game/advice:98 | 98 | この{months}か月で資金が{-dm}万円減っています（今は{state.money}万円）。早めに資金集めを挟みましょう。 |
| game/advice:103 | 103 | この{months}か月で内閣支持率が{…}います（{past.approval}→{state.gov.approval}%）。{…} |
| game/advice:103 | 103 | 上がって |
| game/advice:103 | 103 | 下がって |
| game/advice:103 | 103 | 与党の自党には追い風です。今のうちに地盤を固めましょう。 |
| game/advice:103 | 103 | 自党には向かい風です。地元の支持を厚くしておきましょう。 |
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
| game/advice:167 | 167 | 今は落ち着いています。地盤{p.jiban}から次の段階まであと{Math.max(0, need - state.jibanProgress)}。地元回りを続けましょう。 |
| game/advice:168 | 168 | 地盤は万全です。政策勉強会や街頭演説で、能力と知名度を伸ばす時期です。 |

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
| game/game:209 | 209 | {billName(state, b)}の準備を{minister.name.displayName}に指示した。 |
| game/game:220 | 220 | この法案はまだ出せません。 |
| game/game:221 | 221 | 国会の会期外なので法案を出せません。 |
| game/game:225 | 225 | {billName(state, b)}を国会に提出した（賛成の見込み約{forecast}票）。月末に採決する。 |
| game/game:234 | 234 | この政党とは協議できません。 |
| game/game:244 | 244 | {negotiator.name.displayName}官房長官が{partyById(partyId).name}と政策協議をした（協力度 {state.cooperation[partyId]}）。 |
| game/game:256 | 256 | {sg.name.displayName}幹事長が党内の根回しをした（結束 {Math.round(state.cohesion * 100)}%）。 |
| game/game:272 | 272 | 記者会見で{pm.name.displayName}首相の発言が失言と受け取られた（支持率 {state.approval}%）。 |
| game/game:278 | 278 | {pm.name.displayName}首相が記者会見で政策を訴えた（支持率 {state.approval}%）。 |
| game/game:295 | 295 | 内閣 |
| game/game:306 | 306 | {text}（支持率 {…}{ev.approval}） |
| game/game:308 | 308 | {ev.title}（支持率 {…}{ev.approval}） |
| game/game:323 | 323 | {billName(state, b)}の準備ができた。会期中なら国会に出せる。 |
| game/game:334 | 334 | {billName(state, b)}が賛成{result.yes}・反対{result.no}で成立した（支持率 {…}{b.on_pass}）。 |
| game/game:339 | 339 | {billName(state, b)}は賛成{result.yes}・反対{result.no}で否決された（支持率 −2）。 |
| game/game:349 | 349 | {state.budgetYear}年度予算が年度内に成立せず、暫定予算でしのぐことになった（支持率 {R.budget.failure_approval}）。 |
| game/game:363 | 363 | 内閣不信任案が賛成{result.yes}・反対{result.no}で可決された。石橋内閣は総辞職した。 |
| game/game:365 | 365 | 内閣不信任案が可決され、内閣は総辞職した。 |
| game/game:369 | 369 | 野党が出した内閣不信任案は賛成{result.yes}・反対{result.no}で否決された。 |
| game/game:384 | 384 | 通常国会が始まった。{state.budgetYear}年度予算を3月末までに成立させる必要がある。 |
| game/game:386 | 386 | 臨時国会が始まった。 |
| game/game:387 | 387 | 通常国会が閉会した。秋の臨時国会まで法案は出せない。 |
| game/game:389 | 389 | 任期満了。総選挙は次の段階で実装します。 |
| game/game:390 | 390 | 衆議院議員の任期が満了した。 |

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
| game/save:57 | 57 | セーブデータの形式ではありません（JSON として読めない） |
| game/save:61 | 61 | 議員人生モードのセーブデータではありません |
| game/save:62 | 62 | このゲームより新しい版のセーブデータです |
| game/save:63 | 63 | 小選挙区が47区だったころの古いセーブデータは読めません（289区に変えたため） |
| game/save:64 | 64 | セーブデータが壊れています |
| game/save:80 | 80 | セーブデータが壊れています（内閣） |
| game/save:91 | 91 | {p.name.displayName}・{st.year}年{st.month}月・{st.post ／／ st.status} |

### app/views（画面の文）

| 番号 | 行 | 文 |
|---|---|---|
| app/views:47 | 47 | {esc(prefName(p))} 出られる区 {os.length}{…} |
| app/views:47 | 47 | （現職：{…}） |
| app/views:47 | 47 | ・ |
| app/views:54 | 54 | 県の一覧に戻る {…} |
| app/views:63 | 63 | 弁舌 |
| app/views:63 | 63 | 知名度 |
| app/views:63 | 63 | 組織 |
| app/views:63 | 63 | 政策 |
| app/views:63 | 63 | 調整 |
| app/views:63 | 63 | 資金 |
| app/views:72 | 72 | ガシッ!! |
| app/views:73 | 73 | ワーッ!! |
| app/views:74 | 74 | ピコーン! |
| app/views:75 | 75 | チャリン! |
| app/views:76 | 76 | ドンッ! |
| app/views:77 | 77 | ガッチリ! |
| app/views:78 | 78 | ワッショイ! |
| app/views:79 | 79 | ダダダッ! |
| app/views:80 | 80 | ルンルン♪ |
| app/views:81 | 81 | スヤァ… |
| app/views:82 | 82 | キリッ! |
| app/views:87 | 87 | 出自 |
| app/views:87 | 87 | 政党 |
| app/views:87 | 87 | 出馬の道と県 |
| app/views:87 | 87 | 経歴類型 |
| app/views:87 | 87 | 確認 |
| app/views:92 | 92 | ◀ 戻る |
| app/views:96 | 96 | 出自（難易度）を選ぶ |
| app/views:97 | 97 | {…} ファイルから読み込む 画面のモード {modeSwitch(mode, adviceLevel)} {…} |
| app/views:97 | 97 | 続きから {esc(saved)} セーブを消す |
| app/views:97 | 97 | はじめから遊ぶ |
| app/views:101 | 101 | 政党を選ぶ |
| app/views:104 | 104 | {chip(p.id)} {esc(p.short)} {…} {esc(p.name)}・{…}議席 {…} |
| app/views:104 | 104 | 与党 |
| app/views:104 | 104 | 野党 |
| app/views:108 | 108 | {prefName(opened)}の区を選ぶ |
| app/views:108 | 108 | 出馬の道と地元の県を選ぶ |
| app/views:113 | 113 | 他党の現職に挑む |
| app/views:113 | 113 | 親の地盤を継ぐ |
| app/views:114 | 114 | 引退する自党の現職の後継。党の票はあるが地盤は1から |
| app/views:115 | 115 | 比例名簿。党務で党の幹部との関係を上げて上位を狙う |
| app/views:122 | 122 | 経歴類型を選ぶ |
| app/views:123 | 123 | 能力の略号：弁＝弁舌、政＝政策、調＝調整、知＝知名度、組＝組織、資＝資金。ランクは S が最も高く、A〜G の順に下がる。 {…} |
| app/views:127 | 127 | この条件で始めますか |
| app/views:130 | 130 | 出自 {esc(o.name)}（{esc(o.difficulty)}） 政党 {chip(c.party!)} {esc(partyById(c.party!).name)} 出馬 {esc(ROUTE_NAMES[c.route!])}・{…} 経歴 {esc(a.name)} 始めの能力 {…} 画面のモード {…}。始めてからも「自分」の画面で変えられる。 この条件で始める |
| app/views:136 | 136 | 通常（秘書の助言つき） |
| app/views:136 | 136 | プロ（数字をすべて出す） |
| app/views:139 | 139 | 議員人生 {esc(VERSION_LABEL)} {…} {progress} {back} {title} {body} |
| app/views:140 | 140 | 一人の新人候補として総選挙での初当選を目指し、地盤を固めて役職を上っていく。党首選に勝って与党の党首になれば首相にもなれる。75歳になるか、30年たつと引退して終わる。 |
| app/views:153 | 153 | 中道 |
| app/views:160 | 160 | {…}{…} {…} 秘書の助言 {…}{…}{…} |
| app/views:160 | 160 | 通常 |
| app/views:160 | 160 | プロ |
| app/views:161 | 161 | 通常：活動の画面では、経験点と関係の欄の代わりに秘書の助言とおすすめの活動を出し、活動の効果も言葉で説明する。 |
| app/views:161 | 161 | プロ：経験点や関係など、すべての数字を活動の画面に出す。 |
| app/views:162 | 162 | 全部 |
| app/views:162 | 162 | 警告だけ |
| app/views:162 | 162 | 出さない |
| app/views:172 | 172 | 手元の資金 {state.money}万円 毎月の経費 {mo.expense}万円。今の資金で約{mo.monthsLeft}か月もつ 任期満了の総選挙まで{mo.monthsToElection}か月。選挙費用は最大{mo.electionCost}万円で、多く使えるほど票が上乗せされる 資金集めの活動で増やせる |
| app/views:174 | 174 | {chip(state.setup.party)}{esc(partyById(state.setup.party).short)}・{esc(s.post ／／ s.status)} {moodIcon(state.mood, 24)} {…} {state.year}年 {state.month}月 {…}{state.money}万円{…} 記録 ？ {…} {…} 体力{…} {cur} / {max} |
| app/views:174 | 174 | やる気 {state.mood} / 5 活動で得る経験点が {…} 倍になる |
| app/views:176 | 176 | あと{mo.monthsLeft}か月 |
| app/views:176 | 176 | 選挙費用が足りない |
| app/views:179 | 179 | 内閣支持率 {s.approval}% 与党 {s.ruling} 首相 {s.primeMinister} 次の総選挙 {s.nextElection} 与党の党首選 {s.leaderElection} |
| app/views:179 | 179 | 次の総選挙 {state.gov.termEnd.year}年{state.gov.termEnd.month}月 まで（あと{mo.monthsToElection}か月） |
| app/views:179 | 179 | 支持率 {s.approval}% 与党 {esc(s.ruling)} 総選挙 {state.gov.termEnd.year}年{state.gov.termEnd.month}月まで |
| app/views:179 | 179 | が少ない（休養を） |
| app/views:180 | 180 | 体力 {cur} / {max} 20未満で無理をすると倒れることがある。休養と趣味の時間で戻る |
| app/views:188 | 188 | {…} 比例名簿 見込み {prRank(state) + 1}位 党の幹部 {state.relations.party} |
| app/views:188 | 188 | 比例名簿の道 党の幹部との関係が80で1位、12下がるごとに1つ下がる。党の比例の当選者数に入れば当選 |
| app/views:194 | 194 | 優勢 |
| app/views:194 | 194 | やや優勢 |
| app/views:194 | 194 | やや劣勢 |
| app/views:194 | 194 | 劣勢 |
| app/views:197 | 197 | {…}{x.name}（{partyById(x.party).short}） 得票の見込み {pct(x.share)}{…} |
| app/views:197 | 197 | 自分： |
| app/views:197 | 197 | {…}当選{m.terms}回・地盤{m.jiban}・知名度{rankOf(m.abilities.知名度)} |
| app/views:197 | 197 | 現職・ |
| app/views:197 | 197 | 候補者はまだ決まっていない |
| app/views:211 | 211 | {…} {esc(place)} {bar} {verdict[0]} {…} 自分 {pct(me.share)} {…} 地盤 {world.player.jiban} |
| app/views:211 | 211 | {place}の情勢（揺らぎを除いた見込み） {all} |
| app/views:212 | 212 | 相手 {rivalHtml} {pct(rival.share)} |
| app/views:212 | 212 | 地盤 {world.player.jiban} / 4 地元回り・地域行事・県議と連携で固まる。半年何もしないと1段下がる |
| app/views:216 | 216 | 秘書との関係 高いほど活動で得る経験点が増える（0.8〜1.15倍） |
| app/views:217 | 217 | 党の幹部との関係 人事で役職に選ばれやすくなる。25未満だと役職に就けない。党首選の票、比例名簿の順位にも効く |
| app/views:218 | 218 | 後援会との関係 選挙で本人の票が上乗せされる |
| app/views:219 | 219 | 地元紙との関係 選挙で本人の票が少し上乗せされる |
| app/views:220 | 220 | 県議団との関係 60以上なら毎月地盤が固まり、選挙の票も上乗せされる |
| app/views:226 | 226 | {REL_TIPS[r.id]} 今 {state.relations[r.id]}（放っておくと40に戻っていく。白い線が40） |
| app/views:227 | 227 | 秘書 {state.secretaryName} |
| app/views:230 | 230 | 関係 {rows} |
| app/views:236 | 236 | 公務 |
| app/views:236 | 236 | {state.post}としての仕事をする。役職ごとに効果が違う。 |
| app/views:260 | 260 | {e.name}の経験点 {state.exp[e.id]} 「自分」の画面で能力を上げるのに使う |
| app/views:260 | 260 | 選んだ活動で増える見込み |
| app/views:264 | 264 | {…} {icon(a.icon, 40)} {esc(a.name)} 体力{…}{a.stamina} |
| app/views:265 | 265 | おすすめ |
| app/views:265 | 265 | 地盤UP |
| app/views:271 | 271 | {esc(sel.name)}：{esc(sel.description)} {…} 下のボタンかカードをもう一度押すと実行 |
| app/views:271 | 271 | {…} 体力{…}{sel.stamina} |
| app/views:273 | 273 | {esc(last.text)}{…} 次の活動を選んでください |
| app/views:274 | 274 | 今月の活動を選んでください カードを押すと説明が出て、もう一度押すと実行します |
| app/views:279 | 279 | 経験点 {exp} {relPanel(state)} |
| app/views:289 | 289 | {esc(sel.name)}を実行する |
| app/views:300 | 300 | なし |
| app/views:301 | 301 | {sk.name}（{COLOR_NAMES[sk.color]}特） {sk.description} |
| app/views:311 | 311 | 克服の条件：{…} |
| app/views:325 | 325 | コツLv{lv} 覚える（{cost}） {…} |
| app/views:327 | 327 | {esc(sk.name)} {esc(sk.description)} 条件：{…} {…} |
| app/views:330 | 330 | 特殊能力 {…} 身につけられる特殊能力 条件の回数をこなすと月末に身につく。活動でコツをつかめば、回数が足りなくても経験点を払って覚えられる。 {next} |
| app/views:330 | 330 | まだない |
| app/views:344 | 344 | 体力が戻る（+{a.stamina}） |
| app/views:344 | 344 | 体力を{-a.stamina}使う |
| app/views:345 | 345 | 伸ばしやすい能力：{grow} |
| app/views:354 | 354 | 自分の画面へ |
| app/views:354 | 354 | 党内の画面へ |
| app/views:354 | 354 | 内閣の画面へ |
| app/views:356 | 356 | {…}を選ぶ |
| app/views:361 | 361 | {secretaryFace(state)} 秘書 {esc(state.secretaryName)} 今月の助言 {items} 数字を全部見る（プロモードにする） |
| app/views:377 | 377 | {partyById(m.party).short}の党首 |
| app/views:378 | 378 | 小選挙区 |
| app/views:378 | 378 | {districtName(m.district!)}（小選挙区） |
| app/views:378 | 378 | 比例 |
| app/views:378 | 378 | 比例（地元 {prefName(m.home)}） |
| app/views:378 | 378 | 浪人・候補（{prefName(m.home)}） |
| app/views:386 | 386 | {x.name}：{…}寄り（{v}） |
| app/views:386 | 386 | 中間 |
| app/views:389 | 389 | {…} {esc(m.name.displayName)}{…} {esc(m.name.surnameKana)} {esc(m.name.givenNameKana)} {chip(m.party)} {esc(partyById(m.party).name)} {age}歳・{m.gender} ✕ {esc(seat)} 当選{m.terms}回 地盤{m.jiban} {…}{…} {esc(m.archetype)} {…} 得意：{…} 性格：{…} {…} {abilities} {ideology} 信念 {m.conviction}/5・党への忠誠 {m.loyalty}/5 |
| app/views:390 | 390 | （自分） |
| app/views:395 | 395 | 特殊能力なし |
| app/views:429 | 429 | 最大 |
| app/views:429 | 429 | 次：{cost} |
| app/views:437 | 437 | {face(p.name.surname, p.party)} {esc(p.name.displayName)} {s.age}歳・{esc(p.archetype)}・{esc(s.origin)}・当選{p.terms}回 基礎能力（経験点を使って上げる） {rows} {skillSection(state, world)} 経験点 {exp} 地盤 {pips} {p.jiban} （次まで {esc(s.jibanProgress)}） 関係 {rel} 党首選 {leader} 経歴 {ach} 画面のモード {modeSwitch(mode, adviceLevel)} セーブ {…} ファイルに書き出す ファイルから読み込む 同じ世界で最初から 新しい世界で最初から |
| app/views:451 | 451 | このブラウザに自動で保存しています（最後の保存 {esc(savedAt)}）。 |
| app/views:451 | 451 | このブラウザには保存できていません。ファイルに書き出してください。 |
| app/views:467 | 467 | 次の党首選： {state.leaderTermEnd.year}年{state.leaderTermEnd.month}月 （党首の任期切れ） |
| app/views:468 | 468 | 次の党首選：総選挙で敗れたときや、党首が落選したときに行う |
| app/views:470 | 470 | 立候補を届け出た（押すと取り消す） |
| app/views:470 | 470 | 次の党首選に立候補する |
| app/views:471 | 471 | 当選3回以上で、党の幹部との関係が50以上なら立候補できる（党首は生涯3期まで）。今は当選{world.player.terms}回・党の幹部 {state.relations.party}。 |
| app/views:472 | 472 | 党首：{…} {when} {run} |
| app/views:472 | 472 | 不在 |
| app/views:479 | 479 | 名前と役職 {…} |
| app/views:482 | 482 | {face(m.name.surname, m.party)} {esc(m.name.displayName)}{…} 当選{m.terms}回・{…} {extra} {…} |
| app/views:483 | 483 | 浪人 |
| app/views:490 | 490 | 今月の党首の行動はもう残っていない |
| app/views:492 | 492 | 国会の会期外（臨時国会は秋から） |
| app/views:493 | 493 | 党首討論は月に1回 |
| app/views:495 | 495 | 対案の準備が足りない（{opp?.proposals ?? 0}/{OPP.actions.proposal.cost}。政調会長が毎月ためる） |
| app/views:498 | 498 | 不信任案は{OPP.actions.noconfidence.cooldown_months}か月に1回（あと{wait}か月） |
| app/views:522 | 522 | 自分は{esc(state.oppPost.name)}。政権を取ったら、この分野の大臣に就きやすい。 |
| app/views:526 | 526 | 影の内閣（分野ごとの影の大臣） {cabinet} |
| app/views:535 | 535 | 会談 選挙協力 |
| app/views:537 | 537 | {chip(p)} {esc(partyById(p).short)} {…}議席 {…} {c} {…} |
| app/views:537 | 537 | {partyById(p).name}との協力度 {c} {OPP.actions.pact.min_cooperation}以上で選挙協力を結べる。不信任案に賛成するかにも効く 選挙協力をしたときに相手の票が移る割合 {Math.round(pactTransfer(party, p) * 100)}% |
| app/views:537 | 537 | 選挙協力 |
| app/views:541 | 541 | 追い風 {…}{momentum.toFixed(1)} 対案の準備 {opp?.proposals ?? 0} 根回し {opp?.diet ?? 0} |
| app/views:541 | 541 | 自党への追い風 総選挙で全国の支持に {momentum.toFixed(1)} ポイント足される。党首討論、追及、対案で増え、毎月少しずつ弱まる |
| app/views:541 | 541 | 対案の準備 {OPP.actions.proposal.cost}たまると「対案の発表」ができる。政調会長が毎月ためる |
| app/views:541 | 541 | 不信任案の根回し 国対委員長の公務でたまり、不信任案で与党から造反が出やすくなる |
| app/views:543 | 543 | 党首の行動（今月あと{points}回） {…} {offReasons(state, points)} 会談と選挙協力は、下の各党の行から選ぶ。行動を選び終えたら、活動の画面で今月の活動を選ぶと月末になる。 |
| app/views:546 | 546 | 今は使えない：{why} |
| app/views:549 | 549 | 党首になると、ほかの野党との会談、党首討論、追及、対案、選挙協力、不信任案を自分で動かせる。 |
| app/views:550 | 550 | 野党として（与党 {…}{…}） {lineup} {shadow}{shadowList}{status}{actions} ほかの野党 （数字は自分の党との協力度。{OPP.actions.pact.min_cooperation}以上で選挙協力を結べる） {…} |
| app/views:552 | 552 | ほかに野党はない |
| app/views:560 | 560 | 党首 |
| app/views:562 | 562 | {p.name} {n}議席（小選挙区{…}・比例{…}） |
| app/views:563 | 563 | 議席の構成（定数{world.roster.length}・過半数{MAJORITY}） {bar} {…} 党首選 {leaderSection(state, world)} {oppositionSection(state, world)} {chip(party)} {esc(partyById(party).name)}の議員（{members.length}人） {…} |
| app/views:568 | 568 | 議席がない |
| app/views:576 | 576 | 内閣 |
| app/views:579 | 579 | 内閣（首相と大臣） {rankHead()}{…} 与党の役員（{…}） {…} |
| app/views:585 | 585 | 未着手 |
| app/views:586 | 586 | 準備を始める |
| app/views:587 | 587 | 準備完了 |
| app/views:587 | 587 | 否決 |
| app/views:588 | 588 | 国会に出す |
| app/views:590 | 590 | {esc(b.name)} {esc(b.field)}・{b.status}{…} {btn} |
| app/views:590 | 590 | 準備中 |
| app/views:595 | 595 | {chip(p)} {esc(partyById(p).short)}{…} {v} 協議 |
| app/views:595 | 595 | （連立） |
| app/views:597 | 597 | 政権の行動（今月あと{g.actionPoints}回） {…}根回し {…}記者会見 {…}解散 与党の結束 {Math.round(g.cohesion * 100)}%。行動を選び終えたら、活動の画面で今月の活動を選ぶと月末になります。 法案 {bills} 各党の協力度 {talks} |
| app/views:602 | 602 | 与党 {esc(careerSummary(state, world).ruling)} 内閣支持率 {g.approval}% {rows} {gov} |
| app/views:625 | 625 | 山場 |
| app/views:625 | 625 | 政局 |
| app/views:625 | 625 | 自分 |
| app/views:630 | 630 | 大事なこと |
| app/views:631 | 631 | すべて |
| app/views:638 | 638 | 記録 {tabs} ✕ {…} |
| app/views:640 | 640 | まだ記録がない |
| app/views:646 | 646 | 目的 |
| app/views:646 | 646 | 一人の候補者として総選挙での当選を目指す。当選を重ねて大臣や党の役職に就き、与党の党首選に勝てば首相になれる。落選しても浪人として続けられる。75歳になるか、30年たつと引退して終わる。 |
| app/views:647 | 647 | 1か月の流れ |
| app/views:647 | 647 | 活動を1つ選ぶと1か月が進む。カードを押すと説明と効果の見込みが出て、「実行する」ボタンかカードをもう一度押すと実行する。月末に経費が引かれ、日常の出来事が起きることがある。出来事は選択肢を選ぶと結果が出る。 |
| app/views:648 | 648 | 総選挙 |
| app/views:648 | 648 | 任期満了か解散で行う。小選挙区では、党への支持（内閣支持率による風を含む）に、本人の地盤、知名度、後援会・地元紙・県議団との関係、選挙資金が上乗せされる。活動の画面の情勢の棒で見込みが分かる。比例名簿の道では、党の幹部との関係で名簿の順位が決まる。 |
| app/views:649 | 649 | 経験点と能力 |
| app/views:649 | 649 | 活動で5種類の経験点が貯まる。「自分」の画面で経験点を使って6つの能力を上げる。能力が高いほど、上げるのに必要な経験点が増える。 |
| app/views:650 | 650 | 地盤と関係 |
| app/views:650 | 650 | 地盤（1〜4）は地元回り、地域行事、県議と連携で固まり、半年何もしないと1段下がる。関係（秘書、党の幹部、後援会、地元紙、県議団）は放っておくと40に戻っていく。数字や棒にマウスを乗せるか長押しすると、何に効くかが出る。 |
| app/views:651 | 651 | 党首選と首相 |
| app/views:651 | 651 | 当選3回以上で党の幹部との関係が50以上なら、党内の画面で党首選への立候補を届け出られる。与党の党首選は党首の任期切れのときに行う。与党の党首になると首相になり、内閣の画面で法案や解散などの政権の行動を選べる。 |
| app/views:652 | 652 | 自分の党が野党のときは、当選を重ねると幹事長、政調会長、国対委員長、選対委員長、影の大臣に就き、公務でほかの野党との協力度や対案の準備をためる。野党の党首になると、党内の画面で、ほかの野党との会談、党首討論、失政の追及、対案の発表、選挙協力（候補者の一本化）、内閣不信任案の提出を毎月使える。選挙協力を結んだ党とは、小選挙区で一方が候補を降ろし、票の一部が移る。 |
| app/views:653 | 653 | 特殊能力とコツ |
| app/views:653 | 653 | 活動の回数などの条件を満たすと、月末に特殊能力が身につく。活動のあとにときどき「コツ」をつかみ、コツがあれば回数が足りなくても「自分」の画面で経験点を払って覚えられる。 |
| app/views:654 | 654 | 記録 |
| app/views:654 | 654 | 状態の帯（日付や資金の並び）の「記録」で、自分に起きたことと政局の動き（政権の行動、採決、政界の出来事）を月ごとに振り返れる。「大事なこと」では、総選挙や就任、政権交代などの山場と、出来事の結果だけを出す。 |
| app/views:655 | 655 | 画面のモード |
| app/views:655 | 655 | 通常モードでは、秘書が毎月の助言とおすすめの活動を教えてくれ、細かい数字は省かれる。プロモードでは、経験点や関係などのすべての数字が出る。始め方の最初の画面と「自分」の画面で切り替えられる。 |
| app/views:656 | 656 | 保存 |
| app/views:656 | 656 | 状態はこのブラウザに自動で保存され、始め方の画面の「続きから」で再開できる。「自分」の画面からファイルへの書き出しと読み込みができる。 |
| app/views:657 | 657 | キー操作 |
| app/views:657 | 657 | 1〜5：画面の切り替え。活動の画面では ← → で選んで Enter で実行。出来事は数字キーで選ぶ。Esc でポップアップを閉じる。 |
| app/views:661 | 661 | 遊び方 ✕ {…} 議員人生 {esc(VERSION_LABEL)} |
| app/views:685 | 685 | 前回比 {…}{swing.toFixed(1)} |
| app/views:686 | 686 | 比例名簿 {e.pr!.rank}位（党の比例当選 {e.pr!.seats}人） |
| app/views:691 | 691 | {partyById(words.rival.party).short}・{…} |
| app/views:691 | 691 | 当選 |
| app/views:691 | 691 | 落選 |
| app/views:693 | 693 | {e.year}年{e.month}月 |
| app/views:696 | 696 | {e.year}年{e.month}月 総選挙 開票結果 {rows} {…} {district} {selfLine}{rivalLine} {…} 続ける |
| app/views:700 | 700 | 当選確実 |
| app/views:714 | 714 | 秘書 |
| app/views:718 | 718 | {esc(h.title)} {esc(h.text)} {lines} 続ける |

### app/main（画面の操作と確認の文）

| 番号 | 行 | 文 |
|---|---|---|
| app/main:27 | 27 | 活動 |
| app/main:27 | 27 | 今月の活動 |
| app/main:28 | 28 | 地図 |
| app/main:28 | 28 | 全国の情勢 |
| app/main:29 | 29 | 党内 |
| app/main:30 | 30 | 内閣 |
| app/main:31 | 31 | 自分 |
| app/main:31 | 31 | 能力と経歴 |
| app/main:79 | 79 | {…} やめる {esc(c.ok)} |
| app/main:163 | 163 | このブラウザに保存できませんでした。「自分」の画面からファイルに書き出してください |
| app/main:182 | 182 | {saveLabel(save)}から再開した。 |
| app/main:212 | 212 | 今のゲームを終えて、ファイルのデータを読み込みますか？ |
| app/main:212 | 212 | 読み込む |
| app/main:240 | 240 | 議員人生 はじめる {…} {confirmHtml()} |
| app/main:241 | 241 | 名前データを読み込んでいます… |
| app/main:251 | 251 | 議員人生 ― {esc(world.player.name.displayName)}・当選{world.player.terms}回 {tab.title} {…} {body} {statusBar(state, world, app.mode)} {modalHtml()} {…} |
| app/main:269 | 269 | 比例 |
| app/main:272 | 272 | {…} {chip(m.party)} {esc(m.name.displayName)} {esc(partyById(m.party).short)}・当選{m.terms}回・地盤{m.jiban} |
| app/main:274 | 274 | {esc(PREFECTURES[pref - 1].name)} （小選挙区{smd.length}） {rows} {…} |
| app/main:274 | 274 | 比例：{…} |
| app/main:275 | 275 | {info} 県を押すと、その県の議員を表示します。県の色はその県で小選挙区の議席が最も多い党、赤い太枠の県が自分の地元です。 {mapLegend(w.roster)} |
| app/main:281 | 281 | 小選挙区 |
| app/main:283 | 283 | 県の色＝小選挙区の議席が最も多い政党（数は全国の小選挙区の議席） {…} |
| app/main:317 | 317 | {esc(r.title)} 選んだこと：{esc(r.choice)} {esc(r.text)} {…} 閉じる |
| app/main:334 | 334 | {…} 政治家人生のおわり {esc(state.over)} {…} 同じ世界でもう一度 新しい世界で遊ぶ |
| app/main:360 | 360 | このブラウザに保存している続き（{saved}）は消えます。新しく始めますか？ 残すときは、先に「続きから」で開いて「自分」の画面からファイルに書き出してください。 |
| app/main:360 | 360 | 新しく始める |
| app/main:396 | 396 | 内閣支持率 {before.approval}→{after.approval}% |
| app/main:405 | 405 | （支持率の変化で{…}に{…}） |
| app/main:405 | 405 | 与党の自党 |
| app/main:405 | 405 | 野党の自党 |
| app/main:405 | 405 | 追い風 |
| app/main:405 | 405 | 向かい風 |
| app/main:407 | 407 | （相手の陣営の動きや関係の変化） |
| app/main:409 | 409 | 情勢の見込み {pct(before.share)}→{pct(after.share)}{reason} |
| app/main:412 | 412 | 体力の上限が{after.maxStamina}になった |
| app/main:413 | 413 | 特殊能力「{skillById(id)?.name}」を身につけた！ |
| app/main:414 | 414 | 「{skillById(id)?.name}」が外れた |
| app/main:532 | 532 | {d.up}を{n}上げた |
| app/main:555 | 555 | 衆議院を解散して、月末に総選挙を行いますか？ |
| app/main:555 | 555 | 解散する |
| app/main:559 | 559 | 内閣不信任案を提出しますか？ 否決されると、党への追い風が弱まり、反対した党との協力度が下がります。 |
| app/main:559 | 559 | 提出する |
| app/main:589 | 589 | 今のゲームの続きは消えます。最初から始めますか？ 残すときは、先にファイルに書き出してください。 |
| app/main:589 | 589 | 最初から始める |
| app/main:593 | 593 | このブラウザに保存している続き（{…}）を消しますか？ 消すと元に戻せません。 |
| app/main:593 | 593 | セーブデータ |
| app/main:593 | 593 | 消す |
| app/main:595 | 595 | セーブデータを消しました |
| app/main:777 | 777 | 議員 |

