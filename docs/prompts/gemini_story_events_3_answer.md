{
  "stories": [
    {
      "id": "coalition_offer",
      "title": "連立への誘い",
      "summary": "総選挙のあと、第一党から連立政権への参加を求められる。加わる、閣外から協力する、断る、のどれかを選ぶ（判断の場面）。",
      "cast": ["secretary", "other"],
      "once": false,
      "start": { "trigger": "decision" },
      "chapters": [
        {
          "id": "c1",
          "bg": "party_hq",
          "after_months": [0, 0],
          "lines": [
            { "speaker": "narrator", "text": "総選挙の結果を受け、第一党の{lead_party}から連立政権への参加を求める使者が訪れた。" },
            { "speaker": "other", "name": "{lead_party}幹事長", "text": "国民は安定した政権を望んでいます。ぜひ我が党と連立を組んでいただきたい。" },
            { "speaker": "self", "face": "serious", "text": "政権に入れば政策を実現できる。だが、{lead_party}と意見が違う分野をどうするか。" },
            { "speaker": "other", "name": "{lead_party}幹事長", "text": "閣僚の席を複数用意します。ただし、重要法案では足並みを揃えてもらわねばなりません。" },
            { "speaker": "secretary", "face": "serious", "text": "先生、連立に加われば力は得られますが、政権の失敗や批判も一緒に背負うことになります。" },
            { "speaker": "secretary", "face": "normal", "text": "閣外協力なら閣僚は出さず、法案ごとに賛否を決められます。党の独自色は守りやすくなります。" },
            { "speaker": "secretary", "face": "normal", "text": "申し入れを断って野党に留まる道もあります。筋を通した姿勢は支持者の信頼につながるでしょう。" },
            { "speaker": "self", "face": "serious", "text": "政権の責任を担うか、距離を置いて監視するか。党の未来を左右する決断だ。" }
          ],
          "choices": [
            {
              "label": "連立に加わる",
              "result": "政策の合意文書に署名し、{lead_party}政権へ閣僚を送り出した。",
              "effects": { "coalition": "join", "relations": { "party": 5 }, "exp": { "policy": 5 } },
              "next": "end_join"
            },
            {
              "label": "閣外から協力する",
              "result": "閣僚は出さず、予算などの重要法案に限って賛成すると約束した。",
              "effects": { "coalition": "outside", "relations": { "press": 3, "supporters": 2 }, "exp": { "policy": 5 } },
              "next": "end_outside"
            },
            {
              "label": "申し入れを断る",
              "result": "党の基本理念は曲げられないと伝え、連立の誘いを丁重に断った。",
              "effects": { "coalition": "decline", "relations": { "supporters": 5, "party": -3 }, "exp": { "election": 5 } },
              "next": "end_decline"
            }
          ]
        }
      ],
      "endings": [
        {
          "id": "end_join",
          "title": "連立政権の一員に",
          "text": "大臣として政策を動かす力を得た。だが、政権への厳しい批判も一手に引き受けることになる。"
        },
        {
          "id": "end_outside",
          "title": "閣外協力",
          "text": "閣僚の椅子を断り、政権の外から是々非々で向き合う道を選んだ。影響力と独自性の両立が問われる。"
        },
        {
          "id": "end_decline",
          "title": "野党の道",
          "text": "連立への誘いを退け、対決の道を選んだ。政権は別の枠組みで発足し、次の選挙へ向けた戦いが始まる。"
        }
      ]
    },
    {
      "id": "coalition_pm",
      "title": "首相の座",
      "summary": "第一党を除いた連合で、自分の党が思想の真ん中にいるため、首相に推される。引き受けるか、ほかの党に譲るかを選ぶ（判断の場面）。",
      "cast": ["secretary", "other"],
      "once": false,
      "start": { "trigger": "decision" },
      "chapters": [
        {
          "id": "c1",
          "bg": "party_hq",
          "after_months": [0, 0],
          "lines": [
            { "speaker": "narrator", "text": "第一党を除く各党の協議が難航する中、連合の首相候補に{self}を推す声が急浮上した。" },
            { "speaker": "other", "name": "他党の党首", "text": "どの党とも話ができるのは、真ん中に立つ{party}のあなただ。どうか首相を引き受けてくれ。" },
            { "speaker": "self", "face": "surprised", "text": "議席数の少ない我が党が政権の頂点に立つことになる。重責だが、本当にまとめ切れるのか。" },
            { "speaker": "other", "name": "他党の党首", "text": "もちろん、議席の多い我が党の政策も十分に尊重してもらう。それが連合を保つ条件だ。" },
            { "speaker": "secretary", "face": "serious", "text": "先生、小さな党から総理が出れば歴史的ですが、大所帯の他党に振り回される恐れもあります。" },
            { "speaker": "secretary", "face": "normal", "text": "大きな党に首相の座を譲り、調整役に徹すれば、党の主張を地道に実現しやすくなります。" },
            { "speaker": "self", "face": "serious", "text": "政権の顔として荒波に立つか、一歩引いて連合の土台を支えるか。今ここで決めねばならない。" }
          ],
          "choices": [
            {
              "label": "首相を引き受ける",
              "result": "各党の党首と固く握手を交わし、新政権の首相になる覚悟を決めた。",
              "effects": { "coalition": "pm_accept", "relations": { "press": 5 }, "exp": { "media": 10 } },
              "next": "end_accept"
            },
            {
              "label": "首相は別の党に譲る",
              "result": "数で勝る党に首相を譲り、自分は連合の調整役を担う道を選んだ。",
              "effects": { "coalition": "pm_yield", "relations": { "party": 5, "supporters": 3 }, "exp": { "network": 12 } },
              "next": "end_yield"
            }
          ]
        }
      ],
      "endings": [
        {
          "id": "end_accept",
          "title": "連合の首相",
          "text": "小党の党首から首相へと駆け上がった。立場の異なる各党を束ね、厳しい政権運営が始まる。"
        },
        {
          "id": "end_yield",
          "title": "連合の要",
          "text": "首相の座をあえて譲り、各党の橋渡し役を引き受けた。実務の要として政権に欠かせない存在となる。"
        }
      ]
    },
    {
      "id": "coalition_call",
      "title": "連合の呼びかけ",
      "summary": "与党が少数与党になり、第一党を除いた各党で過半数に届く。野党の党首として各党に呼びかけるかを選ぶ（判断の場面。調整の判定がやや易しい）。",
      "cast": ["secretary", "other"],
      "once": false,
      "start": { "trigger": "decision" },
      "chapters": [
        {
          "id": "c1",
          "bg": "party_hq",
          "after_months": [0, 0],
          "lines": [
            { "speaker": "narrator", "text": "総選挙の結果、第一党の{lead_party}を中心とする枠組みは、過半数に届かないか僅差となった。" },
            { "speaker": "secretary", "face": "surprised", "text": "先生、第一党以外の議席を足せば過半数です。{alt}で連合が組めます。" },
            { "speaker": "other", "name": "党の幹部", "text": "だが、各党は経済や安全保障の考え方が大きく違う。そう簡単に首を縦に振るとは思えんぞ。" },
            { "speaker": "self", "face": "serious", "text": "政権交代の好機だ。しかし、理念を棚上げした数合わせでは国民の信頼を失う。" },
            { "speaker": "secretary", "face": "serious", "text": "呼びかけるなら今夜しかありません。他党の党首と直接話し合い、譲歩できる線を探るべきです。" },
            { "speaker": "other", "name": "党の幹部", "text": "今回は見送って与党の乱れを突き、次の総選挙で自党の議席を伸ばす道もある。どう決断する。" },
            { "speaker": "self", "face": "serious", "text": "一か八かで連合を呼びかけるか、今は野党として力を蓄えるか。答えはすぐに出さねばならない。" }
          ],
          "choices": [
            {
              "label": "各党に連合を呼びかける",
              "result": "夜を徹した協議の末、各党の党首が政権樹立へ向けた合意に頷いた。",
              "effects": { "coalition": "call", "relations": { "party": 5 }, "exp": { "network": 15 } },
              "risk": {
                "ability": "調整",
                "threshold": 50,
                "fail_result": "重要政策で折り合いがつかず、各党の党首から連合への協力を断られた。",
                "fail_effects": { "relations": { "party": -5 }, "exp": { "network": 8 } },
                "fail_next": "end_fail"
              },
              "next": "end_call"
            },
            {
              "label": "今回は見送る",
              "result": "無理な連合は長続きしないと判断し、野党として体制を立て直すことにした。",
              "effects": { "relations": { "supporters": 3 }, "exp": { "policy": 10 } },
              "next": "end_pass"
            }
          ]
        }
      ],
      "endings": [
        {
          "id": "end_call",
          "title": "非第一党の連合",
          "text": "第一党を除いた歴史的な連合政権が動き出した。異なる主張をどう調和させ続けるかが試される。"
        },
        {
          "id": "end_fail",
          "title": "幻の連合",
          "text": "水面下の調整は実らず、連合の構想は白紙に戻った。各党との間には、交渉決裂のしこりが残った。"
        },
        {
          "id": "end_pass",
          "title": "力を蓄える",
          "text": "性急な政権獲得は見送り、野党第一線での論戦を選んだ。次の選挙での躍進へ向け地道に歩みを進める。"
        }
      ]
    },
    {
      "id": "coalition_call_hard",
      "title": "連合の呼びかけ",
      "summary": "与党は過半数を保っているが、第一党を除いた各党で過半数に届く。野党の党首として各党に呼びかけるかを選ぶ（判断の場面。調整の判定が難しい）。",
      "cast": ["secretary", "other"],
      "once": false,
      "start": { "trigger": "decision" },
      "chapters": [
        {
          "id": "c1",
          "bg": "party_hq",
          "after_months": [0, 0],
          "lines": [
            { "speaker": "narrator", "text": "総選挙の結果、第一党の{lead_party}を中心とする枠組みは、過半数に届かないか僅差となった。" },
            { "speaker": "secretary", "face": "surprised", "text": "先生、第一党以外の議席を足せば過半数です。{alt}で連合が組めます。" },
            { "speaker": "other", "name": "党の幹部", "text": "だが、各党は経済や安全保障の考え方が大きく違う。そう簡単に首を縦に振るとは思えんぞ。" },
            { "speaker": "self", "face": "serious", "text": "政権交代の好機だ。しかし、理念を棚上げした数合わせでは国民の信頼を失う。" },
            { "speaker": "secretary", "face": "serious", "text": "呼びかけるなら今夜しかありません。他党の党首と直接話し合い、譲歩できる線を探るべきです。" },
            { "speaker": "other", "name": "党の幹部", "text": "今回は見送って与党の乱れを突き、次の総選挙で自党の議席を伸ばす道もある。どう決断する。" },
            { "speaker": "self", "face": "serious", "text": "一か八かで連合を呼びかけるか、今は野党として力を蓄えるか。答えはすぐに出さねばならない。" }
          ],
          "choices": [
            {
              "label": "各党に連合を呼びかける",
              "result": "夜を徹した協議の末、各党の党首が政権樹立へ向けた合意に頷いた。",
              "effects": { "coalition": "call", "relations": { "party": 5 }, "exp": { "network": 15 } },
              "risk": {
                "ability": "調整",
                "threshold": 65,
                "fail_result": "重要政策で折り合いがつかず、各党の党首から連合への協力を断られた。",
                "fail_effects": { "relations": { "party": -5 }, "exp": { "network": 8 } },
                "fail_next": "end_fail"
              },
              "next": "end_call"
            },
            {
              "label": "今回は見送る",
              "result": "無理な連合は長続きしないと判断し、野党として体制を立て直すことにした。",
              "effects": { "relations": { "supporters": 3 }, "exp": { "policy": 10 } },
              "next": "end_pass"
            }
          ]
        }
      ],
      "endings": [
        {
          "id": "end_call",
          "title": "非第一党の連合",
          "text": "第一党を除いた歴史的な連合政権が動き出した。異なる主張をどう調和させ続けるかが試される。"
        },
        {
          "id": "end_fail",
          "title": "幻の連合",
          "text": "水面下の調整は実らず、連合の構想は白紙に戻った。各党との間には、交渉決裂のしこりが残った。"
        },
        {
          "id": "end_pass",
          "title": "力を蓄える",
          "text": "性急な政権獲得は見送り、野党第一線での論戦を選んだ。次の選挙での躍進へ向け地道に歩みを進める。"
        }
      ]
    },
    {
      "id": "doki_vs_senpai_policy",
      "title": "改革か秩序か",
      "summary": "党内の政策論争で、改革を急ぐ同期と慎重派の先輩が激しく対立。仲介を求められた主人公はどちらに付くかの選択を迫られる。",
      "cast": ["doki", "senpai", "secretary"],
      "start": { "trigger": "monthly", "status": ["議員"], "terms_min": 2, "terms_max": 5 },
      "chapters": [
        {
          "id": "c1",
          "bg": "diet",
          "after_months": [3, 7],
          "lines": [
            { "speaker": "narrator", "text": "党の政策勉強会を終えた廊下で、同期の{doki}と先輩の{senpai}が厳しい表情で言い争っていた。" },
            { "speaker": "doki", "face": "serious", "text": "{self}、ちょうどいい所に。古い補助金を削って、新しい産業に予算を回すべきだと思わないか。" },
            { "speaker": "senpai", "face": "angry", "text": "何を軽々しく言うか。支援を削れば、長年わが党を支えた地元の商店街や業者が立ち行かなくなる。" },
            { "speaker": "doki", "face": "angry", "text": "既得権を守ってばかりでは党が衰えるだけだ。{self}、俺の改革案に賛同してくれよ。" },
            { "speaker": "senpai", "face": "serious", "text": "お前まで耳障りのいい言葉に踊らされるな。現場の痛みが分からん輩には、党の舵取りは任せられん。" },
            { "speaker": "self", "face": "serious", "text": "二人の主張は真っ向から食い違っている。今の段階で、自分の立ち位置をはっきり示すべきだろうか。" }
          ],
          "choices": [
            {
              "label": "同期の改革案に賛同する",
              "result": "{doki}は力強く頷いたが、{senpai}は苦い顔で背を向けた。",
              "effects": { "bonds": { "doki": 10, "senpai": -10 }, "exp": { "policy": 6 } },
              "flags": ["policy_lean_doki"],
              "next": "c2"
            },
            {
              "label": "先輩の慎重論を支持する",
              "result": "{senpai}は満足そうに頷き、{doki}は失望の色を隠さなかった。",
              "effects": { "bonds": { "senpai": 10, "doki": -10 }, "exp": { "network": 6 } },
              "flags": ["policy_lean_senpai"],
              "next": "c2"
            },
            {
              "label": "双方の言い分を持ち帰る",
              "result": "どちらにも与せず距離を置いたが、二人とも釈然としない様子だった。",
              "effects": { "bonds": { "doki": -4, "senpai": -4 }, "exp": { "policy": 4 } },
              "flags": ["policy_neutral"],
              "next": "c2"
            }
          ]
        },
        {
          "id": "c2",
          "bg": "party_hq",
          "after_months": [2, 5],
          "conditions": { "status": ["議員"] },
          "fallback": "end_fade",
          "lines": [
            { "speaker": "narrator", "text": "数か月後、党本部で最終会議が開かれた。{doki}側と{senpai}側が真っ向から割れている。" },
            { "speaker": "secretary", "face": "serious", "text": "先生、お二人は互いに譲らず、党の幹部も困り果てています。先生の態度が勝負を分ける見込みです。" },
            { "speaker": "doki", "face": "serious", "text": "{self}、ここで押し切らなければ改革は立ち消えになる。一緒に未来へ向かって踏み出そう。" },
            { "speaker": "senpai", "face": "serious", "text": "お前がどちらに手を貸すか、地元も重鎮も見ているぞ。義理を忘れたとは言わせるな。" },
            { "speaker": "self", "face": "serious", "text": "誰かを立てれば、もう一方が離れていく。それでも、自分の答えを出さなければならない。" }
          ],
          "choices": [
            {
              "label": "同期の陣営に票を投じる",
              "result": "{doki}の改革案が勢いを増した。{senpai}は冷たい視線を残し席を立った。",
              "effects": { "bonds": { "doki": 15, "senpai": -15 }, "relations": { "party": -3 }, "exp": { "policy": 10 } },
              "flags": ["backed_doki"],
              "next": "c3_doki"
            },
            {
              "label": "先輩の陣営に票を投じる",
              "result": "{senpai}の顔を立てたことで慎重派が勝った。{doki}は口元を固く結んだ。",
              "effects": { "bonds": { "senpai": 15, "doki": -15 }, "relations": { "party": 4 }, "exp": { "network": 10 } },
              "flags": ["backed_senpai"],
              "next": "c3_senpai"
            },
            {
              "label": "修正案を示し仲裁に挑む",
              "result": "段階的な移行案を示し、激しい議論の末にようやく二人を同じ席に着かせた。",
              "effects": { "bonds": { "doki": 6, "senpai": 6 }, "exp": { "network": 8, "policy": 8 } },
              "risk": {
                "ability": "調整",
                "threshold": 62,
                "fail_result": "八方美人の案だと双方から一蹴され、誰からも信頼を得られずに終わった。",
                "fail_effects": { "bonds": { "doki": -12, "senpai": -12 }, "relations": { "party": -4 } },
                "fail_next": "c3_isolated"
              },
              "next": "c3_mediator"
            }
          ]
        },
        {
          "id": "c3_doki",
          "bg": "ryotei",
          "after_months": [2, 4],
          "conditions": { "status": ["議員"] },
          "fallback": "end_fade",
          "lines": [
            { "speaker": "narrator", "text": "会議の後、祝勝を兼ねた席に{doki}と二人で向かい合った。だが、胸の奥に重いものが残る。" },
            { "speaker": "doki", "face": "smile", "text": "ありがとう、{self}。お前が踏み切ってくれたおかげで、党内に新しい風を吹かせられた。" },
            { "speaker": "self", "face": "sad", "text": "その代わり、{senpai}とはすっかり口も利けない関係になってしまったよ。" },
            { "speaker": "doki", "face": "serious", "text": "政治の世界では、何かを得るために誰かと袂を分かつ時もある。俺たちが先陣を切っていくんだ。" }
          ],
          "choices": [
            {
              "label": "同期と共に改革を推し進める",
              "result": "迷いを振り切り、{doki}と肩を並べて新たな政策の実現へ動き出した。",
              "effects": { "bonds": { "doki": 5 }, "exp": { "policy": 8 } },
              "next": "end_doki"
            },
            {
              "label": "先輩への配慮も忘れないと誓う",
              "result": "勝敗とは別に礼節を尽くそうと決めたが、修復の道は険しそうだ。", "effects": { "bonds": { "senpai": 3 }, "exp": {
"network": 6 } }, "next": "end_doki" } ] }, { "id": "c3_senpai", "bg": "office",
"after_months": [2, 4], "conditions": { "status": ["議員"] }, "fallback":
"end_fade", "lines": [ { "speaker": "narrator", "text":
"地元の後援者との会合を終えた事務所へ、{senpai}が労いの言葉をかけに立ち寄った。" }, { "speaker": "senpai", "face":
"smile", "text": "よく踏ん張ってくれた。お前が筋を通してくれたおかげで、現場の暮らしが守られたぞ。" }, { "speaker":
"self", "face": "sad", "text": "しかし、{doki}は今回の決定に深く傷つき、私たちのやり方に反発を強めています。" }, {
"speaker": "senpai", "face": "normal", "text":
"若いうちは理想に走るものだ。いずれお前の苦労も分かる日が来る。まずは足元を固めることだな。" } ], "choices": [ { "label":
"先輩の教えを胸に地盤を固める", "result": "{senpai}の温かい言葉に励まされ、地元の支持団体との絆をさらに深めた。", "effects":
{ "bonds": { "senpai": 5 }, "jiban_progress": 15, "relations": { "supporters": 4
} }, "next": "end_senpai" }, { "label": "同期にも理解を求め続けたい", "result":
"時間をかけてでも{doki}と語り合おうと、静かに決意を固めた。", "effects": { "bonds": { "doki": 3 }, "exp":
{ "network": 6 } }, "next": "end_senpai" } ] }, { "id": "c3_mediator", "bg":
"diet", "after_months": [2, 4], "conditions": { "status": ["議員"] }, "fallback":
"end_fade", "lines": [ { "speaker": "narrator", "text":
"妥協案がまとまった党内の会議室。{doki}と{senpai}が、ぎこちなくも顔を合わせていた。" }, { "speaker": "doki",
"face": "normal", "text": "正直、まだ納得しきれてはいない。だが、お前が必死に間を取り持った熱意には折れるよ。" }, {
"speaker": "senpai", "face": "normal", "text":
"お前がここまで汗をかくなら、わしも一歩譲ろう。党が割れては元も子もないからな。" }, { "speaker": "self", "face":
"smile", "text": "誰もが少しずつ痛みを分け合った。この均衡を保つのが、これからの私の役目だ。" } ], "choices": [ {
"label": "二人と共に政策を詰める", "result": "対立を乗り越えた調整力が評価され、党内での信頼が一気に高まった。", "effects":
{ "relations": { "party": 6 }, "exp": { "network": 12 } }, "next":
"end_mediator" }, { "label": "気疲れを癒やし次へ備える", "result":
"激務の疲れを感じながらも、党の団結を守り切った充実感を噛み締めた。", "effects": { "stamina": 5, "exp": {
"policy": 10 } }, "next": "end_mediator" } ] }, { "id": "c3_isolated", "bg":
"home", "after_months": [2, 4], "conditions": { "status": ["議員"] }, "fallback":
"end_fade", "lines": [ { "speaker": "narrator", "text":
"党内の対立が決着した夜。誰からも声のかからない自宅で、一日の会議を振り返る。" }, { "speaker": "secretary", "face":
"sad", "text": "先生、{doki}先生からも{senpai}先生からも、会合の案内が途絶えてしまいました。" }, { "speaker":
"self", "face": "sad", "text": "どちらの顔も立てようとして、結局は一番大事な決断から逃げてしまったのかもしれない。" }, {
"speaker": "secretary", "face": "serious", "text":
"ですが、先生なりの良心で動かれたのです。今は地道に足元の活動からやり直しましょう。" } ], "choices": [ { "label":
"一人で地元回りを徹底する", "result": "党内の冷ややかな空気を背に、黙々と地元での対話活動に打ち込んだ。", "effects": {
"jiban_progress": 15, "exp": { "election": 10 } }, "next": "end_isolated" }, {
"label": "自分の政策を独自に磨き直す", "result": "群れに頼らずとも勝負できるよう、政策の勉強に時間を費やす決意をした。",
"effects": { "exp": { "policy": 12 } }, "next": "end_isolated" } ] } ],
"endings": [ { "id": "end_doki", "title": "同期との歩み", "text":
"同期と改革の道を歩むと決めた。先輩との間には、容易に埋まらない深い溝が残った。" }, { "id": "end_senpai", "title":
"先輩への義理", "text": "先輩の背中を押し、伝統と地元の信頼を守った。同期の視線は、以前より冷たくなった。" }, { "id":
"end_mediator", "title": "絶妙な均衡", "text":
"困難な仲裁をやり遂げ、対立する二人をつなぎ止めた。調整役としての存在感が際立った。" }, { "id": "end_isolated", "title":
"どちらにも付かず", "text": "中立を保とうとして双方の信頼を失った。党内で孤立する苦しさを味わうことになった。" }, { "id":
"end_fade", "title": "戦場の移り変わり", "text": "議員としての立場を離れたことで、党内の論争もいつの間にか遠ざかっていった。"
} ] }, { "id": "doki_vs_senpai_post", "title": "人事の季節", "summary":
"党の重要な役職や委員会の枠を巡り、先輩からの根回しと同期からの協力を同時に求められ、板挟みになる物語。", "cast": ["senpai",
"doki", "secretary"], "start": { "trigger": "monthly", "status": ["議員"],
"terms_min": 3 }, "chapters": [ { "id": "c1", "bg": "ryotei", "after_months":
[2, 6], "lines": [ { "speaker": "narrator", "text":
"党の人事異動が噂される季節、{senpai}から個室の料亭へ呼び出された。" }, { "speaker": "senpai", "face":
"serious", "text": "次の重要部会の座長枠にな、お前の力も借りて俺の息のかかった中堅を据えたいんだ。" }, { "speaker":
"self", "face": "surprised", "text": "しかし、その椅子は{doki}も強く希望していると聞いていますが。" }, {
"speaker": "senpai", "face": "serious", "text":
"あいつにはまだ早い。お前が俺の側で汗をかいてくれれば、いずれお前自身の道も開けるぞ。" }, { "speaker": "self", "face":
"serious", "text": "長年世話になった先輩からの直々の頼みだ。ここでどう答えるかで今後の関係が変わる。" } ], "choices": [
{ "label": "先輩の意向に沿うと約束する", "result": "{senpai}は満足そうに盃を傾け、固い握手を求めてきた。",
"effects": { "bonds": { "senpai": 10 }, "exp": { "network": 5 } }, "flags":
["post_promised_senpai"], "next": "c2_promised" }, { "label": "公正な選考に委ねると返す",
"result": "{senpai}は不満げに眉をひそめたが、それ以上は追及しなかった。", "effects": { "bonds": {
"senpai": -8 }, "exp": { "policy": 5 } }, "flags": ["post_open"], "next":
"c2_open" } ] }, { "id": "c2_promised", "bg": "diet", "after_months": [1, 3],
"conditions": { "status": ["議員"] }, "fallback": "end_fade", "lines": [ {
"speaker": "narrator", "text": "数週間後、党の控え室で{doki}が真剣な眼差しを向けてきた。" }, { "speaker":
"doki", "face": "serious", "text": "{self}、今度の部会長ポスト、俺が名乗りを上げる。お前が推薦人になってくれないか。"
}, { "speaker": "self", "face": "sad", "text":
"（{senpai}との約束が脳裏をよぎる。今ここで断れば、同期との間に深い亀裂が走るだろう。）" }, { "speaker": "doki",
"face": "serious", "text": "お前が後押ししてくれたら、若手の票が動くんだ。頼む、力を貸してくれ。" } ], "choices":
[ { "label": "先輩との義理を理由に断る", "result": "{doki}は表情を凍らせ、「お前もそっち側か」と吐き捨てて去った。",
"effects": { "bonds": { "senpai": 12, "doki": -16 }, "relations": { "party": 4 }
}, "next": "c3_senpai" }, { "label": "約束を反故にして同期を推す", "result":
"{doki}は喜んだが、裏切りを知った{senpai}は激怒したという。", "effects": { "bonds": { "doki": 16,
"senpai": -22 }, "relations": { "party": -5 } }, "next": "c3_doki" }, { "label":
"今回は譲り次期を待つよう説く", "result": "粘り強い説得が功を奏し、{doki}も渋々ながら今回は引くことに納得した。", "effects":
{ "bonds": { "senpai": 6, "doki": -4 }, "exp": { "network": 10 } }, "risk": {
"ability": "調整", "threshold": 65, "fail_result":
"説得が裏目に出て、先輩からも同期からも不信の目で見られる結果となった。", "fail_effects": { "bonds": { "senpai":
-12, "doki": -12 } }, "fail_next": "c3_broken" }, "next": "c3_senpai" } ] }, {
"id": "c2_open", "bg": "diet", "after_months": [1, 3], "conditions": { "status":
["議員"] }, "fallback": "end_fade", "lines": [ { "speaker": "narrator", "text":
"人事の決定が目前に迫り、控え室で{doki}から直談判を受けた。" }, { "speaker": "doki", "face": "serious",
"text": "{senpai}が別の候補を押し込もうとしている。実力本位で選ぶなら、俺に力を貸してくれよ。" }, { "speaker":
"secretary", "face": "serious", "text":
"先生、{senpai}先生の方も先生の一票を気にされています。どちらを立てるか決断の時です。" }, { "speaker": "self", "face":
"serious", "text": "誰かに味方すれば、もう一方の面目は丸潰れになる。どちらの肩を持つべきか。" } ], "choices": [ {
"label": "同期の推薦人として名を連ねる", "result": "{doki}の推薦人となり、党内での世代交代を強く印象づけた。",
"effects": { "bonds": { "doki": 14, "senpai": -14 }, "exp": { "media": 8 } },
"next": "c3_doki" }, { "label": "先輩の推す候補に同調する", "result":
"組織の秩序を重んじ{senpai}に歩調を合わせた。{doki}は黙って目を伏せた。", "effects": { "bonds": {
"senpai": 14, "doki": -14 }, "relations": { "party": 4 } }, "next": "c3_senpai"
} ] }, { "id": "c3_senpai", "bg": "party_hq", "after_months": [2, 4],
"conditions": { "status": ["議員"] }, "fallback": "end_fade", "lines": [ {
"speaker": "narrator", "text": "人事は{senpai}の思惑通りに決着した。{senpai}は上機嫌で肩を叩いてきた。" },
{ "speaker": "senpai", "face": "smile", "text":
"おかげで党内の落ち着きが保たれた。お前の働きは忘れない。次の改選でも後ろ盾になろう。" }, { "speaker": "self", "face":
"sad", "text": "ありがとうございます。ただ、{doki}と顔を合わせにくくなったのが気掛かりです。" }, { "speaker":
"senpai", "face": "normal", "text": "人の上に立つ者はな、すべての人間に好かれようと思ってはいかんのだよ。" } ],
"choices": [ { "label": "先輩の言葉を胸に刻む", "result": "厳しい政治の現実を受け入れ、組織を動かす側の意識を強めた。",
"effects": { "exp": { "network": 10 }, "relations": { "party": 3 } }, "next":
"end_senpai" }, { "label": "地方回りで気を取り直す", "result":
"党内のしこりを忘れようと、地元の後援者との対話に精を出した。", "effects": { "jiban_progress": 12,
"relations": { "supporters": 4 } }, "next": "end_senpai" } ] }, { "id":
"c3_doki", "bg": "office", "after_months": [2, 4], "conditions": { "status":
["議員"] }, "fallback": "end_fade", "lines": [ { "speaker": "narrator", "text":
"熾烈な駆け引きの末、{doki}が役職を射止めた。事務所へお礼の電話が入る。" }, { "speaker": "doki", "face":
"smile", "text": "やったぞ、{self}！お前が腹を括って推してくれたおかげだ。この恩は必ず返すよ。" }, { "speaker":
"self", "face": "serious", "text": "おめでとう。だが、{senpai}の怒りは相当なものらしい。風当たりが強くなりそうだ。"
}, { "speaker": "doki", "face": "serious", "text":
"古い連中に遠慮していては何も変わらない。俺たちで新しい空気を作っていこう。" } ], "choices": [ { "label":
"同期と新たな連携を固める", "result": "若手議員たちの輪の中で存在感を高め、党内の新しい力となった。", "effects": { "exp":
{ "policy": 10 }, "relations": { "press": 3 } }, "next": "end_doki" }, {
"label": "先輩への釈明の手紙を書く", "result": "丁寧な釈明を送ったものの、返事はついに届かなかった。", "effects": {
"exp": { "network": 6 } }, "next": "end_doki" } ] }, { "id": "c3_broken", "bg":
"home", "after_months": [2, 4], "conditions": { "status": ["議員"] }, "fallback":
"end_fade", "lines": [ { "speaker": "narrator", "text":
"人事の騒動は収まったが、自分の元には誰からの連絡も来なくなった。" }, { "speaker": "secretary", "face": "sad",
"text": "先生、{senpai}先生も{doki}先生も、こちらの話には取り合ってくれません。" }, { "speaker": "self",
"face": "sad", "text": "両方にいい顔をして、結局は両方からの信義を失ってしまったか。" }, { "speaker":
"secretary", "face": "serious", "text": "苦い経験ですが、これも糧です。次の機会へ向け、一から実績を積み上げましょう。"
} ], "choices": [ { "label": "地元で支持者の声を聞く", "result":
"党内の人脈が冷え込む中、地元の支援者に救われる思いがした。", "effects": { "relations": { "supporters": 5 },
"jiban_progress": 12 }, "next": "end_broken" }, { "label": "政策の勉強会に没頭する",
"result": "人事に左右されない実力をつけようと、夜遅くまで資料を読み込んだ。", "effects": { "exp": { "policy": 12
} }, "next": "end_broken" } ] } ], "endings": [ { "id": "end_senpai", "title":
"組織の論理", "text": "先輩との義理を守り抜いた。党内の信頼を得る一方で、同期とは修復しがたい溝ができた。" }, { "id":
"end_doki", "title": "世代の旗手", "text":
"同期を押し上げ新たな絆を築いた。その代償として、先輩からの冷たい視線を浴びることになった。" }, { "id": "end_broken",
"title": "二兎を追った末", "text": "板挟みの中で決断を誤り、先輩と同期の双方から距離を置かれる苦い結果を招いた。" }, { "id":
"end_fade", "title": "役職争いの外", "text": "議席を離れたことで、党内の人事劇とは無縁の立場へ移ることになった。" } ]
}, { "id": "leader_race_groundwork", "title": "頂への根回し", "summary":
"党首選への挑戦を意識し始めた頃、誰に頭を下げて助力を請うかを選ばされる。選んだ相手が味方になり、選ばなかった相手は離れていく。", "cast":
["secretary", "senpai", "doki"], "start": { "trigger": "monthly", "status":
["議員"], "terms_min": 3, "terms_max": 5 }, "chapters": [ { "id": "c1", "bg":
"office", "after_months": [2, 6], "lines": [ { "speaker": "narrator", "text":
"数か月後に迫った党首選に向け、党内では{self}の出馬を期待する声が出始めた。" }, { "speaker": "secretary", "face":
"serious", "text": "先生、本気で頂を目指すなら、今のうちに有力者の元へ頭を下げて回る必要があります。" }, { "speaker":
"self", "face": "serious", "text":
"古いグループをまとめる{senpai}を頼るか、若手や中堅の顔である{doki}に頼むか。" }, { "speaker": "secretary",
"face": "serious", "text": "両方と組めれば理想ですが、お二人は考え方が違います。片方を立てれば、片方は臍を曲げます。" }, {
"speaker": "self", "face": "serious", "text":
"誰の傘の下に入るかを決めねばならんか。最初の一歩がすべてを左右する。" } ], "choices": [ { "label":
"先輩の元へ頭を下げに行く", "result": "{senpai}の部屋を訪ね、深々と頭を下げて後ろ盾になってほしいと頼んだ。", "effects": {
"bonds": { "senpai": 12, "doki": -8 }, "exp": { "network": 8 } }, "next":
"c2_senpai" }, { "label": "同期の元へ頭を下げに行く", "result":
"{doki}の前で頭を下げ、同世代の仲間を取りまとめてほしいと頼み込んだ。", "effects": { "bonds": { "doki": 12,
"senpai": -8 }, "exp": { "media": 8 } }, "next": "c2_doki" } ] }, { "id":
"c2_senpai", "bg": "ryotei", "after_months": [2, 4], "conditions": { "status":
["議員"] }, "fallback": "end_fade", "lines": [ { "speaker": "narrator", "text":
"深夜の料亭で、{senpai}が静かに茶を啜りながらこちらの覚悟を試していた。" }, { "speaker": "senpai", "face":
"serious", "text": "お前がそこまで頭を下げて来るなら、わしも一肌脱いでやろう。だが条件がある。" }, { "speaker":
"self", "face": "normal", "text": "どのような条件でしょうか。" }, { "speaker": "senpai",
"face": "serious", "text": "{doki}の進める若手優遇の人事案を潰し、わしの推薦する古参を優遇すると約束しろ。" }, {
"speaker": "secretary", "face": "serious", "text":
"（先生、この条件を飲めば{doki}先生との関係は決定的に壊れます。どうなさいますか。）" } ], "choices": [ { "label":
"先輩の条件を丸ごと飲む", "result": "{senpai}に固く誓った。知らせを聞いた{doki}は怒りの声を上げた。", "effects": {
"bonds": { "senpai": 18, "doki": -22 }, "relations": { "party": 5 }, "exp": {
"network": 10 } }, "next": "c3_senpai" }, { "label": "同期を切る条件だけは断る", "result":
"{senpai}は「覚悟が足りん」と席を立った。仕方なく{doki}の元へ走った。", "effects": { "bonds": { "senpai":
-20, "doki": 12 }, "exp": { "policy": 8 } }, "next": "c3_doki" } ] }, { "id":
"c2_doki", "bg": "party_hq", "after_months": [2, 4], "conditions": { "status":
["議員"] }, "fallback": "end_fade", "lines": [ { "speaker": "narrator", "text":
"党本部の狭い会議室で、{doki}が若手議員の名簿を机に広げた。" }, { "speaker": "doki", "face": "serious",
"text": "お前が頭を下げて来てくれたんだ、俺も腹を括る。ただ、一つだけ約束してくれ。" }, { "speaker": "self", "face":
"normal", "text": "なんだ、話してくれ。" }, { "speaker": "doki", "face": "serious",
"text": "{senpai}のような古い実力者とは完全に手を切るんだ。あの人に遠慮してたら勝てない。" }, { "speaker": "self",
"face": "sad", "text": "これまで世話になった{senpai}を公然と外すのか。大きな賭けになる。" } ], "choices": [
{ "label": "同期と組み先輩と決別する", "result": "{doki}と固く手を握った。非礼を知った{senpai}は激しく憤った。",
"effects": { "bonds": { "doki": 18, "senpai": -22 }, "relations": { "press": 4
}, "exp": { "media": 10 } }, "next": "c3_doki" }, { "label": "先輩との縁は切れないと断る",
"result": "{doki}は「中途半端だ」と離れ、結局{senpai}の前に再び頭を下げる羽目になった。", "effects": { "bonds":
{ "doki": -20, "senpai": 10 }, "relations": { "party": 3 } }, "next":
"c3_senpai" } ] }, { "id": "c3_senpai", "bg": "party_hq", "after_months":
[2, 4], "conditions": { "status": ["議員"] }, "fallback": "end_fade", "lines": [ {
"speaker": "narrator", "text": "党首選の足音が近づく中、{senpai}が有力議員たちへ{self}の推薦を説いて回った。"
}, { "speaker": "senpai", "face": "smile", "text":
"これで党の重鎮は抑えた。お前はわしの大事な弟子だ。堂々と表舞台へ出ろ。" }, { "speaker": "secretary", "face":
"serious", "text": "先生、心強い後ろ盾ができました。一方、{doki}先生は対立候補の陣営に入ったようです。" }, {
"speaker": "self", "face": "serious", "text":
"誰かの手を取るということは、別の誰かを敵に回すこと。それでも頂へ進むしかない。" } ], "choices": [ { "label":
"先輩の期待に応え前を向く", "result": "{senpai}との師弟の絆を確かめ合い、党首選への準備を本格化させた。", "effects": {
"bonds": { "senpai": 5 }, "exp": { "network": 8 } }, "next": "end_senpai" }, {
"label": "資金を厚くして勝負に備える", "result": "{senpai}の紹介で新たな支援者の輪が広がり、活動資金にも余裕が出た。",
"effects": { "money": 40, "exp": { "money": 8 } }, "next": "end_senpai" } ] }, {
"id": "c3_doki", "bg": "station", "after_months": [2, 4], "conditions": {
"status": ["議員"] }, "fallback": "end_fade", "lines": [ { "speaker": "narrator",
"text": "世論への発信を強化する街頭演説の後、{doki}と並んで駅前の人波を見つめた。" }, { "speaker": "doki",
"face": "smile", "text": "若手はまとまったぞ、{self}。お前を担ぐためなら、俺たちはどんな泥でも被る。" }, {
"speaker": "secretary", "face": "serious", "text":
"先生、若手からの支持は盤石です。ただ、{senpai}先生は公然と対立陣営へ回りました。" }, { "speaker": "self", "face":
"serious", "text": "先輩とは対立することになったが、今は同じ時代を駆ける盟友を信じるだけだ。" } ], "choices": [ {
"label": "同期と肩を組み勢いを高める", "result": "{doki}と強い盟友関係を結び、党内に刷新のうねりを作り出した。",
"effects": { "bonds": { "doki": 5 }, "exp": { "media": 8 } }, "next": "end_doki"
}, { "label": "政策の練り上げを急ぐ", "result": "{doki}と共に党首選へ向けた大胆な公約をまとめ上げた。",
"effects": { "exp": { "policy": 10 }, "relations": { "press": 3 } }, "next":
"end_doki" } ] } ], "endings": [ { "id": "end_senpai", "title": "師弟の後ろ盾",
"text": "先輩に頭を下げて師弟の契りを交わし、党首選への足場を固めた。同期とは不和の仲となった。", "effects": {
"bond_state": { "senpai": "師弟", "doki": "不和" } } }, { "id": "end_doki", "title":
"盟友との挑戦", "text": "同期に頭を下げて盟友となり、若手票を固めた。面目を潰された先輩とは不和に陥った。", "effects": {
"bond_state": { "doki": "盟友", "senpai": "不和" } } }, { "id": "end_fade", "title":
"出馬の断念", "text": "議席を離れたことで、党首選へ向けた水面下の根回しも立ち消えとなった。" } ] }, { "id":
"leader_race_backroom", "title": "推薦人の約束", "summary":
"ベテランとして党首選の推薦人集めが大詰めを迎える中、誰に最後の借りを頼むかで、盟友か恩人か、あるいは不和かの明暗が分かれる。", "cast":
["senpai", "doki", "secretary", "other"], "start": { "trigger": "monthly",
"status": ["議員"], "terms_min": 4 }, "chapters": [ { "id": "c1", "bg":
"party_hq", "after_months": [3, 7], "lines": [ { "speaker": "narrator", "text":
"党首選の告示まで数か月。推薦人の名簿を前に、{secretary}が厳しい数字を突きつけた。" }, { "speaker": "secretary",
"face": "serious", "text": "先生、あと数人の推薦人が足りません。このままでは党首選への立候補自体が危ういです。" }, {
"speaker": "other", "name": "選対の幹部", "text":
"残る票を握っているのは、古参を率いる{senpai}か、中堅を束ねる{doki}のどちらかだ。" }, { "speaker": "self",
"face": "serious", "text": "どちらのグループも相容れない要求を抱えている。両方に良い顔は通用しない局面だ。" }, {
"speaker": "secretary", "face": "serious", "text":
"今夜、どちらの門を叩いて頭を下げるか。その選択で、先生を助ける人と敵に回る人が決まります。" } ], "choices": [ { "label":
"先輩の力を借りて大恩を受ける", "result": "{senpai}の部屋を訪れ、過去の経緯を問わずに推薦人の融通を頼み込んだ。", "effects":
{ "bonds": { "senpai": 14, "doki": -10 }, "exp": { "network": 8 } }, "next":
"c2_senpai" }, { "label": "同期の仲間に頭を下げて頼る", "result":
"{doki}の事務所へ足を運び、推薦人の確保に力を貸してほしいと頭を下げた。", "effects": { "bonds": { "doki": 14,
"senpai": -10 }, "exp": { "election": 8 } }, "next": "c2_doki" }, { "label":
"自力で無所属系の一本釣りを狙う", "result": "二人に頼らず無派閥議員を回り始めたが、双方から冷ややかな目で見られた。", "effects": {
"bonds": { "senpai": -10, "doki": -10 }, "exp": { "network": 12 } }, "next":
"c2_solo" } ] }, { "id": "c2_senpai", "bg": "ryotei", "after_months": [1, 3],
"conditions": { "status": ["議員"] }, "fallback": "end_fade", "lines": [ {
"speaker": "narrator", "text": "奥座敷で、{senpai}が推薦人の名簿に署名しながら条件を切り出してきた。" }, {
"speaker": "senpai", "face": "serious", "text":
"この名簿を渡せばお前の出馬は決まる。だが、党首になったら{doki}一派は干してもらうぞ。" }, { "speaker": "self", "face":
"surprised", "text": "党を挙げての戦いの後に、同じ仲間の{doki}を外すのですか。" }, { "speaker": "senpai",
"face": "serious", "text": "わしの顔を立てる気があるなら当然のけじめだ。この大恩にどう報いるつもりだ。" } ],
"choices": [ { "label": "大恩に応え同期の処遇を飲む", "result":
"頭を下げて名簿を受け取った。裏を知った{doki}は怒りの言葉を叩きつけた。", "effects": { "bonds": { "senpai": 16,
"doki": -20 }, "relations": { "party": 4 } }, "next": "c3_senpai" }, { "label":
"人事に口を挟むならと断る", "result": "{senpai}は名簿を引っ込め、一転して対立陣営への支援を打ち出した。", "effects": {
"bonds": { "senpai": -20, "doki": 4 }, "exp": { "policy": 8 } }, "next":
"c3_senpai_fail" } ] }, { "id": "c2_doki", "bg": "office", "after_months":
[1, 3], "conditions": { "status": ["議員"] }, "fallback": "end_fade", "lines": [ {
"speaker": "narrator", "text": "夜更けの事務所で、{doki}が同志たちの署名を集めた束を机に置いた。" }, {
"speaker": "doki", "face": "serious", "text":
"俺の仲間から推薦人を回す。その代わり、{senpai}が握る古い予算には斬り込んでくれ。" }, { "speaker": "self", "face":
"serious", "text": "そこまでやれば、{senpai}や古参議員たちが激しく反発するぞ。" }, { "speaker": "doki",
"face": "serious", "text": "当たり前だ。俺たちは過去のしがらみを断ち切るために、お前に頭を下げられたんだからな。" } ],
"choices": [ { "label": "同期と手を握り改革を約束する", "result":
"{doki}と固く誓い合った。噂を聞いた{senpai}は「恩知らずめ」と吐き捨てた。", "effects": { "bonds": {
"doki": 16, "senpai": -20 }, "relations": { "supporters": 4 } }, "next":
"c3_doki" }, { "label": "先輩の利権には手を触れぬと返す", "result":
"{doki}は呆れて名簿をしまい、「臆病者とは組めない」と去っていった。", "effects": { "bonds": { "doki": -20,
"senpai": 4 }, "exp": { "network": 6 } }, "next": "c3_doki_fail" } ] }, { "id":
"c2_solo", "bg": "diet", "after_months": [1, 3], "conditions": { "status":
["議員"] }, "fallback": "end_fade", "lines": [ { "speaker": "narrator", "text":
"一匹狼で無派閥の議員を回り続けたが、あと二人の壁がどうしても越えられない。" }, { "speaker": "secretary", "face":
"serious", "text": "先生、{senpai}先生側も{doki}先生側も、先生を孤立させようと圧力をかけています。" }, {
"speaker": "self", "face": "serious", "text":
"ここで諦めるわけにはいかない。最後に自分の弁舌で一人を落とすか、頭を下げに行くかだ。" }, { "speaker": "other", "name":
"選対の幹部", "text": "無派閥のベテランが一人、迷っているぞ。説得できるか、それとも頭を下げに行くかだ。" } ], "choices": [ {
"label": "無派閥議員の説得に賭ける", "result": "粘り強い対話の末、無派閥の重鎮が推薦人に名を連ねてくれた。", "effects": {
"relations": { "press": 5 }, "exp": { "media": 12 } }, "risk": { "ability":
"調整", "threshold": 65, "fail_result": "説得は実らず推薦人が揃わなかった。党内での立場は厳しくなった。",
"fail_effects": { "relations": { "party": -6 }, "mood": -1 }, "fail_next":
"end_both_cold" }, "next": "end_solo" }, { "label": "やはり先輩に頭を下げに行く", "result":
"{senpai}から推薦人を借りた。その代わり{doki}との関係は壊れた。", "effects": { "bonds": { "senpai": 14,
"doki": -16 } }, "next": "end_senpai" } ] }, { "id": "c3_senpai", "bg":
"party_hq", "after_months": [1, 3], "conditions": { "status": ["議員"] },
"fallback": "end_fade", "lines": [ { "speaker": "narrator", "text":
"告示前夜、必要数を超える推薦人名簿が完成した。{senpai}が満足そうに頷く。" }, { "speaker": "senpai", "face":
"smile", "text": "これで大手を振って戦えるな。この借りは、お前が頂に立った時に返してもらうぞ。" }, { "speaker":
"self", "face": "serious", "text": "はい、この御恩は一生忘れません。" }, { "speaker":
"secretary", "face": "serious", "text":
"（一方で、{doki}先生は完全に敵陣営へつきました。厳しい党首選になりそうです。）" } ], "choices": [ { "label":
"先輩の恩を胸に戦いへ臨む", "result": "{senpai}を生涯の恩人と定め、党首選の出陣準備を終えた。", "effects": {
"bonds": { "senpai": 5 }, "exp": { "network": 10 } }, "next": "end_senpai" }, {
"label": "支援者への挨拶回りを急ぐ", "result": "名簿を提出する直前まで、各地の支援者へ決意の電話をかけ続けた。", "effects":
{ "relations": { "supporters": 4 }, "exp": { "election": 8 } }, "next":
"end_senpai" } ] }, { "id": "c3_doki", "bg": "campaign", "after_months": [1, 3],
"conditions": { "status": ["議員"] }, "fallback": "end_fade", "lines": [ {
"speaker": "narrator", "text": "仲間たちの熱気に包まれた事務所で、{doki}が推薦人名簿を手渡してくれた。" }, {
"speaker": "doki", "face": "smile", "text":
"やっと揃ったぞ。{senpai}たちの妨害もあったが、俺たちの結束は崩れなかった。" }, { "speaker": "self", "face":
"serious", "text": "お前が泥を被って集めてくれたんだ。この恩義には、必ず勝利で報いる。" }, { "speaker": "doki",
"face": "smile", "text": "当たり前だ。お前が党の顔になるんだ、最後まで一緒に走り切るぞ。" } ], "choices": [ {
"label": "同期と固い握手を交わす", "result": "{doki}との盟友関係が確固たるものとなり、党首選への勢いがついた。",
"effects": { "bonds": { "doki": 5 }, "exp": { "media": 10 } }, "next":
"end_doki" }, { "label": "若手議員の熱意を力に変える", "result":
"集まった仲間を前に演説の練習を重ね、本番へ向けた士気を高めた。", "effects": { "abilities": { "弁舌": 1 }, "exp":
{ "election": 8 } }, "next": "end_doki" } ] }, { "id": "c3_senpai_fail", "bg":
"home", "after_months": [1, 3], "conditions": { "status": ["議員"] }, "fallback":
"end_fade", "lines": [ { "speaker": "narrator", "text":
"条件を断った夜、{senpai}から「推薦人は出せない」と冷たい連絡が入った。" }, { "speaker": "secretary", "face":
"serious", "text": "先生、{senpai}先生とこじれた今、{doki}先生と組み直すしかありません。" }, { "speaker":
"self", "face": "sad", "text": "プライドを捨てて、もう一度{doki}に頭を下げてみるしかないか。" }, {
"speaker": "secretary", "face": "normal", "text":
"はい。仲間を見捨てなかった姿勢は、{doki}先生も評価してくれるはずです。" } ], "choices": [ { "label":
"同期の元へ行き頭を下げる", "result": "事情を聞いた{doki}は苦笑いしつつも協力を受け入れ、名簿を埋めてくれた。", "effects": {
"bonds": { "doki": 10 } }, "next": "end_doki" }, { "label": "今回は見送り体制を立て直す",
"result": "党内での根回しに失敗し、{senpai}との対立だけが残る結果となった。", "effects": { "relations": {
"party": -4 }, "exp": { "policy": 8 } }, "next": "end_senpai_cold" } ] }, {
"id": "c3_doki_fail", "bg": "home", "after_months": [1, 3], "conditions": {
"status": ["議員"] }, "fallback": "end_fade", "lines": [ { "speaker": "narrator",
"text": "{doki}に断られた後、推薦人集めは暗礁に乗り上げてしまった。" }, { "speaker": "secretary", "face":
"serious", "text": "先生、{doki}先生は他候補の応援へ回ったようです。残る道は{senpai}先生だけです。" }, {
"speaker": "self", "face": "sad", "text":
"恥を忍んででも、{senpai}の軍門に下るべきか、それとも潔く身を引くか。" }, { "speaker": "secretary", "face":
"serious", "text": "今ここで引けば、次の機会がいつ巡ってくるか分かりません。" } ], "choices": [ { "label":
"先輩の元へ頭を下げに行く", "result": "{senpai}は「最初からそうしろ」と笑い、大恩を売る形で助力を約束した。", "effects": {
"bonds": { "senpai": 10 } }, "next": "end_senpai" }, { "label": "意地を貫き戦線から降りる",
"result": "誰の言いなりにもならぬと出馬を断念したが、{doki}との溝は埋まらなかった。", "effects": { "relations": {
"supporters": 4 }, "exp": { "policy": 8 } }, "next": "end_doki_cold" } ] } ],
"endings": [ { "id": "end_senpai", "title": "恩人との誓い", "text":
"先輩に頭を下げて推薦人を得た。先輩を恩人とする一方、同期とは不和の対立へと向かった。", "effects": { "bond_state": {
"senpai": "恩人", "doki": "不和" } } }, { "id": "end_doki", "title": "盟友の結束",
"text": "同期に頭を下げて盟友となり、出馬への道を開いた。先輩は離反し、不和の関係となった。", "effects": { "bond_state":
{ "doki": "盟友", "senpai": "不和" } } }, { "id": "end_solo", "title": "孤高の挑戦",
"text": "誰にも頭を下げず自力で推薦人を揃えた。二人の先輩と同期からは距離を置かれることになった。", "effects": {
"bond_state": { "senpai": "不和", "doki": "不和" } } }, { "id": "end_both_cold",
"title": "潰えた布石", "text": "自力での根回しに敗れ、双方からの信用も失った。党首選への道は険しさを増した。", "effects": {
"bond_state": { "senpai": "不和", "doki": "不和" } } }, { "id": "end_senpai_cold",
"title": "折れた交渉", "text": "先輩の条件を蹴った末に交渉が破談。先輩との間には、拭いがたい不和の札が残った。", "effects":
{ "bond_state": { "senpai": "不和" } } }, { "id": "end_doki_cold", "title":
"噛み合わぬ理想", "text": "同期との約束を飲みきれず決裂。同期の心は離れ、不和の間柄となってしまった。", "effects": {
"bond_state": { "doki": "不和" } } }, { "id": "end_fade", "title": "戦場の変更",
"text": "議席を失ったため、党首選への根回しも中断を余儀なくされた。" } ] }, { "id":
"doki_reconciliation_or_break", "title": "こじれた友情", "summary":
"不和となった同期と、共通の課題を通じて向き合う機会が訪れる。難しい関係修復に賭けるか、完全に決裂して別の道を進むかを問われる。", "cast":
["doki", "secretary", "other"], "start": { "trigger": "monthly", "status":
["議員"], "bond_state": { "doki": "不和" } }, "chapters": [ { "id": "c1", "bg":
"diet", "after_months": [3, 7], "lines": [ { "speaker": "narrator", "text":
"委員会室の廊下で、かつての同期{doki}とすれ違った。互いに目も合わせず通り過ぎようとする。" }, { "speaker": "other",
"name": "同僚議員", "text": "いつまで意地を張り合ってる。次の地域振興法案は、お前たちが組まないと通らんぞ。" }, {
"speaker": "doki", "face": "angry", "text": "俺は俺のやり方で通す。今さら馴れ合う気はないさ。" }, {
"speaker": "secretary", "face": "serious", "text":
"先生、党内でも二人の不和を心配する声が増えています。このままでは動きにくくなりますよ。" }, { "speaker": "self", "face":
"serious", "text": "かつて同じ日にバッジを付けた仲間だ。ここで声をかけるか、それとも完全に割り切るか。" } ], "choices": [
{ "label": "休憩時間に同期を呼び止める", "result": "ぎこちない空気の中、{doki}は渋々ながら立ち止まってこちらを見た。",
"effects": { "bonds": { "doki": 5 } }, "next": "c2_talk" }, { "label":
"冷ややかに背中を見送る", "result": "言葉は交わさず自分の仕事に戻った。後援会の幹部は「それでいい」と頷いた。", "effects": {
"bonds": { "doki": -5 }, "relations": { "supporters": 4 }, "exp": {
"election": 8 } }, "next": "c2_clash" } ] }, { "id": "c2_talk", "bg": "ryotei",
"after_months": [2, 4], "conditions": { "status": ["議員"] }, "fallback":
"end_fade", "lines": [ { "speaker": "narrator", "text":
"同僚の取り成しで、夜の店に{doki}と二人きりになった。テーブルの上には重い沈黙が流れる。" }, { "speaker": "doki", "face":
"angry", "text": "今さら何の用だ。あの時の仕打ちを俺が忘れたとでも思っているのか。" }, { "speaker": "self",
"face": "serious", "text": "お互い、譲れない立場があったんだ。だが、このまま対立を続けても得をするのは他陣営だけだ。" }, {
"speaker": "doki", "face": "serious", "text":
"……お前が本気でそう思っているなら、言葉じゃなく態度で示してみろよ。" }, { "speaker": "self", "face": "serious",
"text": "根深いわだかまりを解くには、相当な誠意と調整力が要る。それとも、ここで決別を告げるか。" } ], "choices": [ {
"label": "非を認めて手を差し伸べる", "result": "本音を尽くした説得の末、{doki}はため息をついて握手を返してきた。",
"effects": { "bonds": { "doki": 25 }, "exp": { "network": 12 } }, "risk": {
"ability": "調整", "threshold": 65, "fail_result":
"「白々しい」と手を払いのけられ、修復の試みは完全に失敗に終わった。", "fail_effects": { "bonds": { "doki": -18 },
"exp": { "election": 8 } }, "fail_next": "c3_break" }, "next": "c3_mend" }, {
"label": "やはり相容れないと席を立つ", "result": "互いの道は交わらないと悟り、代金を置いて先に店を出た。", "effects": {
"bonds": { "doki": -15 }, "exp": { "election": 12 }, "relations": {
"supporters": 6 } }, "next": "c3_break" } ] }, { "id": "c2_clash", "bg":
"party_hq", "after_months": [2, 4], "conditions": { "status": ["議員"] },
"fallback": "end_fade", "lines": [ { "speaker": "narrator", "text":
"党本部の部会で、{doki}の推す案と自分の案が真っ向からぶつかった。周囲が息を呑む。" }, { "speaker": "doki", "face":
"angry", "text": "お前のやり方は地元エゴそのものだ。いつまで古い政治にしがみつくつもりだ。" }, { "speaker":
"secretary", "face": "serious", "text":
"先生、今ならまだ一歩引いて対話へ持ち込めます。それとも、論戦で徹底的に叩き潰しますか。" }, { "speaker": "self", "face":
"serious", "text": "相手の言い分も一理はあるが、ここで引けば支持者たちの顔が立たない。" } ], "choices": [ {
"label": "頭を下げ共同案の作成を提案する", "result": "意外な歩み寄りに会議室の空気が変わり、{doki}も渋々ながら応じた。",
"effects": { "bonds": { "doki": 22 }, "exp": { "policy": 10 } }, "risk": {
"ability": "弁舌", "threshold": 65, "fail_result":
"{doki}は「今さら茶番だ」と退席し、二人の亀裂は決定的なものとなった。", "fail_effects": { "bonds": { "doki":
-18 }, "relations": { "supporters": 5 } }, "fail_next": "c3_break" }, "next":
"c3_mend" }, { "label": "正論で相手の矛盾を突き放す", "result":
"鋭い追及に{doki}は沈黙した。地元支持者からは喝采が送られた。", "effects": { "bonds": { "doki": -18 },
"exp": { "media": 12, "election": 8 }, "relations": { "supporters": 6 } },
"next": "c3_break" } ] }, { "id": "c3_mend", "bg": "diet", "after_months":
[1, 3], "conditions": { "status": ["議員"] }, "fallback": "end_fade", "lines": [ {
"speaker": "narrator", "text": "数週間後、法案が満場一致で委員会を通過した。廊下で{doki}が苦笑しながら歩み寄ってきた。"
}, { "speaker": "doki", "face": "smile", "text":
"助かったよ、{self}。やっぱりお前と背中を預け合うと、仕事がやりやすいな。" }, { "speaker": "self", "face":
"smile", "text": "遠回りしたが、お互いの強さも弱さもよく見えた。これからはもう迷わない。" }, { "speaker": "doki",
"face": "normal", "text": "ああ、もう二度とつまらない意地でぶつかるのはなしにしよう。" } ], "choices": [ {
"label": "再び盟友として笑い合う", "result": "固い握手を交わし、かつて以上の信頼で結ばれた盟友となった。", "effects": {
"bonds": { "doki": 8 }, "exp": { "network": 10 } }, "next": "end_mend" }, {
"label": "法案の仕上げにすぐ取りかかる", "result": "無駄な言葉はいらない。二人は並んで次の会議室へ向かった。", "effects":
{ "exp": { "policy": 10 }, "relations": { "party": 4 } }, "next": "end_mend" } ]
}, { "id": "c3_break", "bg": "office", "after_months": [1, 3], "conditions": {
"status": ["議員"] }, "fallback": "end_fade", "lines": [ { "speaker": "narrator",
"text": "対立が公然のものとなった夜、事務所には逆に多くの地元の支持者が激励に集まった。" }, { "speaker": "other",
"name": "後援会長", "text": "見事です先生！誰に気兼ねすることなく、これからも地元のために戦ってください。" }, { "speaker":
"secretary", "face": "normal", "text":
"先生、{doki}先生とは別れましたが、後援会の結束はかつてないほど強まっています。" }, { "speaker": "self", "face":
"serious", "text": "友情は失ったが、背負うべき覚悟はよりはっきりした。この因縁を力に変えて進むしかない。" } ], "choices":
[ { "label": "地元の期待を力に変えて戦う", "result": "対立を恐れぬ姿勢が支持を広げ、次の選挙への手応えを掴んだ。",
"effects": { "vote_bonus": 2, "jiban_progress": 20, "exp": { "election": 10 } },
"next": "end_break" }, { "label": "独自の政策を掲げて突き進む", "result":
"誰の顔色も窺わぬ一匹狼の覚悟で、政界での存在感を高めた。", "effects": { "abilities": { "弁舌": 1 }, "exp": {
"media": 12 } }, "next": "end_break" } ] } ], "endings": [ { "id": "end_mend",
"title": "雪解けの盟友", "text": "深い亀裂を乗り越えて和解を果たした。再び信頼を取り戻し、揺るがぬ盟友となった。", "effects":
{ "bond_state": { "doki": "盟友" } } }, { "id": "end_break", "title": "決別の因縁",
"text": "和解の道は閉ざされ、同期とは明確な因縁となった。しかし、迷いを捨てたことで独自の支持が固まった。", "effects": {
"bond_state": { "doki": "因縁" } } }, { "id": "end_fade", "title": "遠のく影", "text":
"議席を失い国会を離れたことで、同期との確執も一度幕を下ろすこととなった。" } ] }, { "id":
"senpai_reconciliation_or_break", "title": "師弟の分岐点", "summary":
"不和になった党の先輩と、党内の重要局面で顔を合わせる。頭を下げて修復を願うか、完全に袂を分かって自立するかを選ぶ物語。", "cast":
["senpai", "secretary", "other"], "start": { "trigger": "monthly", "status":
["議員"], "bond_state": { "senpai": "不和" } }, "chapters": [ { "id": "c1", "bg":
"party_hq", "after_months": [3, 8], "lines": [ { "speaker": "narrator", "text":
"党本部の重鎮たちが集まる会合で、{senpai}が自分の姿を見るなり露骨に顔を背けた。" }, { "speaker": "secretary",
"face": "serious", "text": "先生、{senpai}先生周辺の県連や業界団体からも、こちらの要請が敬遠され始めています。" }, {
"speaker": "other", "name": "先輩の側近", "text":
"あの人が機嫌を直さない限り、君の地元予算も党のポストもずっと後回しだぞ。" }, { "speaker": "self", "face":
"serious", "text": "頭を下げて昔の師弟関係を取り戻しに行くか、それとも先輩の影響力から完全に独立するか。" } ], "choices":
[ { "label": "先輩の事務所へ挨拶に出向く", "result":
"門前払いを覚悟で訪ねると、{senpai}は冷たい目つきで部屋へ招き入れた。", "effects": { "bonds": { "senpai": 5 }
}, "next": "c2_visit" }, { "label": "古い派閥の圧力を突っぱねる", "result":
"圧力には屈しないと宣言したことで、若手支持者から拍手が湧いた。", "effects": { "bonds": { "senpai": -5 },
"relations": { "press": 4, "supporters": 4 }, "exp": { "media": 8 } }, "next":
"c2_defy" } ] }, { "id": "c2_visit", "bg": "office", "after_months": [2, 4],
"conditions": { "status": ["議員"] }, "fallback": "end_fade", "lines": [ {
"speaker": "narrator", "text": "{senpai}の事務所の重い扉を開けると、机の向こうから鋭い視線が飛んできた。" }, {
"speaker": "senpai", "face": "angry", "text":
"何のつもりだ。今さら俺に頭を下げても、消えた信頼は簡単には戻らんぞ。" }, { "speaker": "self", "face": "serious",
"text": "これまでの無礼をお詫びします。もう一度、一からご指導をいただきたいのです。" }, { "speaker": "senpai",
"face": "serious", "text": "ほう……口先だけではないというなら、お前の本気を見せてみろ。" } ], "choices": [ {
"label": "粘り強く誠意を尽くして説く", "result": "深々と頭を下げ続けた誠意に、{senpai}も「そこまで言うなら」と表情を緩めた。",
"effects": { "bonds": { "senpai": 25 }, "exp": { "network": 12 } }, "risk": {
"ability": "調整", "threshold": 65, "fail_result":
"「遅すぎる」と冷たく突き放され、事務所を後にするほかなかった。", "fail_effects": { "bonds": { "senpai": -18 },
"relations": { "party": -4 } }, "fail_next": "c3_break" }, "next": "c3_mend" },
{ "label": "理不尽な要求には引くと告げる", "result": "誇りまで捨てることはできぬと席を立ち、決別を覚悟した。", "effects":
{ "bonds": { "senpai": -15 }, "exp": { "election": 12 }, "relations": {
"supporters": 6 } }, "next": "c3_break" } ] }, { "id": "c2_defy", "bg": "hall",
"after_months": [2, 4], "conditions": { "status": ["議員"] }, "fallback":
"end_fade", "lines": [ { "speaker": "narrator", "text":
"地元の市民会館で開いた国政報告会。最前列で支援者たちが固唾を呑んで見守っている。" }, { "speaker": "secretary", "face":
"serious", "text": "先生、会場の外に{senpai}先生からの使いが来ています。演説の前に話し合いたいそうです。" }, {
"speaker": "other", "name": "先輩の側近", "text":
"今なら大先輩も水に流すと言っている。ここで穏便に収めるのが大人の知恵だぞ。" }, { "speaker": "self", "face":
"serious", "text": "舞台袖から会場を見渡す。支援者は古いしがらみに縛られない自分の姿に期待している。" } ], "choices": [
{ "label": "控え室で先輩側と和解を模索する", "result": "演説直前の短い交渉で歩み寄り、関係修復の糸口を掴んだ。",
"effects": { "bonds": { "senpai": 22 }, "exp": { "network": 10 } }, "risk": {
"ability": "調整", "threshold": 65, "fail_result":
"条件の折り合いがつかず交渉決裂。先輩側は怒って引き上げた。", "fail_effects": { "bonds": { "senpai": -18 },
"relations": { "supporters": 5 } }, "fail_next": "c3_break" }, "next": "c3_mend"
}, { "label": "演壇に立ち世代交代を訴える", "result": "長老支配との決別を高らかに宣言し、会場は割れんばかりの歓声に包まれた。",
"effects": { "bonds": { "senpai": -20 }, "exp": { "media": 12, "election": 10 },
"relations": { "supporters": 8 } }, "next": "c3_break" } ] }, { "id": "c3_mend",
"bg": "party_hq", "after_months": [1, 3], "conditions": { "status": ["議員"] },
"fallback": "end_fade", "lines": [ { "speaker": "narrator", "text":
"数日後、{senpai}から「一度食事に行こう」と連絡が入った。長い冬の終わりを感じた。" }, { "speaker": "senpai", "face":
"smile", "text": "お前も図太くなったな。まあ、ぶつかることも勉強のうちだ。これからはまた力を合わせよう。" }, { "speaker":
"self", "face": "smile", "text": "ありがとうございます。先輩の経験に学びながら、精一杯やっていきます。" }, {
"speaker": "secretary", "face": "smile", "text":
"（先生、これで党内の風向きも一変します。本当に良かったです。）" } ], "choices": [ { "label": "再び師弟として教えを乞う",
"result": "かつての師弟関係を取り戻し、党内での足場が一気に安定した。", "effects": { "bonds": { "senpai": 8
}, "relations": { "party": 6 } }, "next": "end_mend" }, { "label":
"党内の人脈づくりを再開する", "result": "{senpai}の計らいで多くの有力議員と顔を繋ぎ、人脈を広げた。", "effects": {
"exp": { "network": 12 } }, "next": "end_mend" } ] }, { "id": "c3_break", "bg":
"street", "after_months": [1, 3], "conditions": { "status": ["議員"] },
"fallback": "end_fade", "lines": [ { "speaker": "narrator", "text":
"先輩の傘下から完全に離れた朝、{district}の駅前に一人で立ち、マイクを握った。" }, { "speaker": "secretary",
"face": "normal", "text": "先生、{senpai}先生の支援はもう望めません。ですが、自力の支援者が増えています。" }, {
"speaker": "self", "face": "serious", "text":
"後ろ盾を失ったのは痛いが、誰の顔色も見ずに自分の信念を語れる自由を手に入れた。" }, { "speaker": "other", "name":
"通りの有権者", "text": "誰の言いなりにもならないあんたを応援してるよ。負けるな！" } ], "choices": [ { "label":
"自前の地盤を徹底して鍛える", "result": "後ろ盾に頼らぬ草の根の運動が実を結び、選挙区での支持が深まった。", "effects": {
"vote_bonus": 2, "jiban_progress": 20, "exp": { "election": 12 } }, "next":
"end_break" }, { "label": "弁舌を武器に世論へ訴え続ける", "result":
"独立独歩の姿勢が注目され、メディアや有権者からの評価が高まった。", "effects": { "abilities": { "弁舌": 1 },
"relations": { "press": 5 }, "exp": { "media": 12 } }, "next": "end_break" } ] }
], "endings": [ { "id": "end_mend", "title": "再生した師弟", "text":
"長い冷戦を経て先輩と和解した。不和は解け、再び揺るがぬ師弟の絆を取り戻した。", "effects": { "bond_state": { "senpai":
"師弟" } } }, { "id": "end_break", "title": "独り立ちの因縁", "text":
"先輩と完全に決別し因縁の相手となった。だが、自力で戦う覚悟が支持者を熱く動かした。", "effects": { "bond_state": {
"senpai": "因縁" } } }, { "id": "end_fade", "title": "過ぎ去った日々", "text":
"議席を離れたことで、先輩との長年の確執も遠い過去の出来事となった。" } ] }, { "id": "pm_secretary_kantei",
"title": "官邸の灯り", "summary":
"首相就任後、苦楽を共にした秘書を官邸へ連れていくか地元に置くかを選び、激務の中で秘書との信頼と健康に向き合う物語。", "cast":
["secretary", "other"], "start": { "trigger": "post_change", "status": ["議員"],
"post": ["pm"] }, "chapters": [ { "id": "c1", "bg": "office", "after_months":
[1, 2], "conditions": { "post": ["pm"] }, "fallback": "end_stepdown", "lines": [
{ "speaker": "narrator", "text": "首相就任からまもなく、官邸の執務室には各省庁から派遣された精鋭の秘書官が並んだ。" }, {
"speaker": "other", "name": "首席秘書官", "text":
"総理、政務の秘書官を一人お選びください。地元の秘書の{secretary}氏を呼ばれますか。" }, { "speaker": "secretary",
"face": "surprised", "text": "先生、私のような者が官邸の中枢に入ってよいものでしょうか。地元の守りも大事です。" }, {
"speaker": "self", "face": "serious", "text":
"慣れない官邸で{secretary}に寄り添ってもらうか、それとも愛着ある地元を託すか。" } ], "choices": [ { "label":
"秘書を官邸へ呼び寄せる", "result": "{secretary}を政務秘書官に据え、二人三脚で官邸の業務を始めた。", "effects": {
"bonds": { "secretary": 15 }, "relations": { "secretary": 5, "party": -2 },
"exp": { "network": 8 } }, "next": "c2_kantei" }, { "label": "地元事務所の守りを託す",
"result": "地元の要として{district}に残るよう頼み、官邸へは一人で向かった。", "effects": { "bonds": {
"secretary": -4 }, "relations": { "supporters": 5 }, "exp": { "election": 8 } },
"next": "c2_local" } ] }, { "id": "c2_kantei", "bg": "diet", "after_months":
[2, 4], "conditions": { "post": ["pm"] }, "fallback": "end_stepdown", "lines": [
{ "speaker": "narrator", "text":
"官邸の夜は短い。未明の新聞読みから深夜の国会対策まで、{secretary}は休む暇もない。" }, { "speaker": "other",
"name": "首席秘書官", "text": "総理、{secretary}氏は官僚との調整に無理を重ね、ここ数日眠れていません。" }, {
"speaker": "secretary", "face": "sad", "text":
"大丈夫です、先生。私が倒れたら、先生の本当の声を聞いてくれる人がいなくなりますから。" }, { "speaker": "self", "face":
"serious", "text": "顔色は紙のように白い。ここで休ませれば業務が滞るが、無理をさせれば取り返しがつかない。" } ], "choices":
[ { "label": "強制的に数日の休養を命じる", "result": "業務の遅れを覚悟で休ませると、{secretary}は涙ぐんで感謝した。",
"effects": { "bonds": { "secretary": 14 }, "relations": { "secretary": 6 },
"stamina": -6, "approval": -1 }, "next": "c3" }, { "label": "踏ん張りどころだと励ます",
"result": "叱咤に応え{secretary}は懸命に働き抜き、官邸の歯車が見事に噛み合った。", "effects": { "bonds": {
"secretary": 6 }, "approval": 1, "exp": { "policy": 12 } }, "risk": { "ability":
"組織", "threshold": 62, "fail_result": "{secretary}が過労で倒れて入院し、官邸の無理な勤務実態が批判された。",
"fail_effects": { "bonds": { "secretary": -16 }, "relations": { "secretary": -8,
"press": -4 }, "approval": -2 }, "fail_next": "c3" }, "next": "c3" } ] }, {
"id": "c2_local", "bg": "home", "after_months": [2, 4], "conditions": { "post":
["pm"] }, "fallback": "end_stepdown", "lines": [ { "speaker": "narrator",
"text": "官邸と{district}は遠い。電話越しの{secretary}の声が日ごとに掠れていく。" }, { "speaker":
"secretary", "face": "sad", "text": "先生、地元では総理が遠くなったという声が出ています。対応に追われていて……。" },
{ "speaker": "other", "name": "首席秘書官", "text":
"総理、週末の地方遊説を削ってでも地元へ戻られますか。それとも秘書に抑えさせますか。" }, { "speaker": "self", "face":
"serious", "text": "一国の首相として全国を回るべきか、原点である地元と秘書を労わるべきか。" } ], "choices": [ {
"label": "週末に地元へ帰り秘書を労う", "result": "疲れを押して地元へ戻り、{secretary}と膝を突き合わせて支持者を回った。",
"effects": { "bonds": { "secretary": 14 }, "stamina": -10, "relations": {
"supporters": 5 } }, "next": "c3" }, { "label": "政務優先を伝え地元を任せる", "result":
"厳しい電話のあと、{secretary}が必死に走り回り地元の不満を鎮めた。", "effects": { "approval": 1, "exp": {
"election": 10 }, "bonds": { "secretary": 4 } }, "risk": { "ability": "調整",
"threshold": 62, "fail_result": "地元との意思疎通が崩れ、{secretary}との信頼にも深い傷がついた。",
"fail_effects": { "bonds": { "secretary": -16 }, "relations": { "secretary": -8,
"supporters": -5 }, "approval": -1 }, "fail_next": "c3" }, "next": "c3" } ] }, {
"id": "c3", "bg": "office", "after_months": [2, 4], "conditions": { "post":
["pm"] }, "fallback": "end_stepdown", "lines": [ { "speaker": "narrator",
"text": "大きな国会山場を越えた深夜、誰もいなくなった執務室で{secretary}とお茶を飲んだ。" }, { "speaker":
"secretary", "face": "smile", "text":
"先生、初めて街頭に立った日を覚えていますか。あの頃からは想像もできない場所に来ましたね。" }, { "speaker": "self", "face":
"normal", "text": "お前がいなければ、ここまで辿り着くことはできなかった。本当にすまないと思っている。" }, { "speaker":
"secretary", "face": "smile", "text": "何をおっしゃいますか。総理になっても、先生はいつまでも私の先生です。" } ],
"choices": [ { "label": "これからも二人三脚で歩むと誓う", "result":
"変わらぬ絆を確かめ合い、翌日からの厳しい政務への活力を得た。", "effects": { "bonds": { "secretary": 10 },
"mood": 1, "approval": 1 }, "next": "end_trust" }, { "label": "首相としての孤独な責任を背負う",
"result": "一番近い人の思いさえも胸にしまい、国の舵取りに集中する覚悟を決めた。", "effects": { "abilities": {
"政策": 1 }, "exp": { "policy": 12 }, "approval": 1 }, "next": "end_solitude" } ]
} ], "endings": [ { "id": "end_trust", "title": "変わらぬ背中", "text":
"頂に立っても秘書との絆は揺るがなかった。一番近い理解者に支えられ、政権は安定感を増した。" }, { "id": "end_solitude",
"title": "孤独な頂", "text": "秘書の献身を胸に刻みつつ、首相として誰にも頼れぬ最終責任を引き受ける覚悟を固めた。" }, { "id":
"end_stepdown", "title": "官邸を去る日", "text": "首相の座を降りたことで、官邸での慌ただしい日々にも一区切りがついた。"
} ] }, { "id": "pm_doki_cabinet", "title": "閣僚の椅子と友情", "summary":
"内閣の重要人事を前に、共に歩んできた同期を閣僚に抜擢するか、党内の均衡を保つために見送るかで悩む首相の物語。", "cast": ["doki",
"senpai", "secretary"], "start": { "trigger": "monthly", "status": ["議員"],
"post": ["pm"] }, "chapters": [ { "id": "c1", "bg": "party_hq", "after_months":
[2, 5], "conditions": { "post": ["pm"] }, "fallback": "end_stepdown", "lines": [
{ "speaker": "narrator", "text": "内閣の看板となる重要閣僚の席が空いた。党内では次の起用を巡って憶測が飛び交っている。" },
{ "speaker": "doki", "face": "serious", "text":
"総理、俺にそのポストを任せてくれないか。お前が描く改革を、現場のトップとして形にしたいんだ。" }, { "speaker": "senpai",
"face": "serious", "text": "総理、同期を重用すれば身内びいきと叩かれます。ここは他から起用すべきです。" }, {
"speaker": "secretary", "face": "serious", "text":
"先生、{doki}先生への友情と、総理としての公平な人事。どちらを優先されますか。" }, { "speaker": "self", "face":
"serious", "text": "政権の推進力を取るか、党内の融和と世論の納得を取るか。人事は総理の専権事項だが、重い。" } ], "choices":
[ { "label": "同期を重要閣僚に抜擢する", "result":
"{doki}を閣僚に起用した。{senpai}は眉をひそめ、野党は一斉に批判を始めた。", "effects": { "bonds": {
"doki": 15, "senpai": -10 }, "relations": { "press": -3 }, "approval": -1 },
"next": "c2_appointed" }, { "label": "同期を見送り他派から起用する", "result":
"党内の均衡を優先し他から選んだ。{doki}は黙って目を伏せ、部屋を出て行った。", "effects": { "bonds": { "doki": -15,
"senpai": 10 }, "relations": { "party": 5 }, "approval": 1 }, "next":
"c2_skipped" } ] }, { "id": "c2_appointed", "bg": "diet", "after_months":
[2, 4], "conditions": { "post": ["pm"] }, "fallback": "end_stepdown", "lines": [
{ "speaker": "narrator", "text": "新閣僚の就任早々、国会の委員会では身内びいきの人事ではないかと激しい追及が続いた。" },
{ "speaker": "doki", "face": "sad", "text":
"すまない、{self}……いや、総理。俺が答弁でもたついたせいで、政権に迷惑をかけている。" }, { "speaker": "senpai",
"face": "serious", "text": "だから言ったのです。世論の風当たりは強い。今からでも距離を置いた姿勢を見せねば。" }, {
"speaker": "self", "face": "serious", "text":
"自分が選んだ大臣だ。ここで盾になって守り抜くか、それとも厳しく突き放すか。" } ], "choices": [ { "label":
"総理として同期を全力で庇う", "result": "「結果で証明する」と堂々と答弁し、{doki}も次第に実力を認められた。", "effects": {
"bonds": { "doki": 10 }, "approval": 2, "exp": { "media": 15 } }, "risk": {
"ability": "弁舌", "threshold": 65, "fail_result":
"庇うほど「身内に甘い」と批判が広がり、内閣支持率が大きく落ち込んだ。", "fail_effects": { "approval": -3,
"relations": { "press": -6 }, "bonds": { "doki": 4 } }, "fail_next":
"c3_distance" }, "next": "c3_comrade" }, { "label": "同期に厳しく自律を求める", "result":
"公私のけじめを厳しく言い渡したことで批判は収まったが、二人の距離は広がった。", "effects": { "bonds": { "doki": -10 },
"relations": { "party": 4 }, "approval": 1 }, "next": "c3_distance" } ] }, {
"id": "c2_skipped", "bg": "ryotei", "after_months": [2, 4], "conditions": {
"post": ["pm"] }, "fallback": "end_stepdown", "lines": [ { "speaker":
"narrator", "text": "人事から数か月、閣僚を外れた{doki}が党内で官邸に批判的な勉強会を始めたと知らされた。" }, {
"speaker": "secretary", "face": "serious", "text":
"先生、{doki}先生は総理が志を忘れたとこぼしているそうです。党が割れかねません。" }, { "speaker": "doki", "face":
"angry", "text": "呼んだのはお前か、総理。どうせ古い連中の顔色を見て、俺を切り捨てたんだろう。" }, { "speaker":
"self", "face": "serious", "text": "誤解だと言いたい。だが、首相の座にいる自分がどう語れば同期の心に届くだろうか。" }
], "choices": [ { "label": "二人きりで本音を明かし詫びる", "result":
"首相としての苦悩を包み隠さず語り、{doki}もようやく理解を示してくれた。", "effects": { "bonds": { "doki": 18 },
"exp": { "network": 12 } }, "risk": { "ability": "調整", "threshold": 65,
"fail_result": "「総理の理屈だ」と受け入れられず、二人の溝は決定的になってしまった。", "fail_effects": { "bonds":
{ "doki": -16 }, "relations": { "party": -5 } }, "fail_next": "c3_distance" },
"next": "c3_comrade" }, { "label": "党の規律を優先し距離を置く", "result":
"総理として私情は挟めないと突き放し、党内の引き締めを図った。", "effects": { "bonds": { "doki": -12 },
"relations": { "party": 5 }, "approval": 1 }, "next": "c3_distance" } ] }, {
"id": "c3_comrade", "bg": "diet", "after_months": [2, 4], "conditions": {
"post": ["pm"] }, "fallback": "end_stepdown", "lines": [ { "speaker":
"narrator", "text": "激しい国会を乗り越えた夕方、{doki}が控え室へ書類を抱えて顔を覗かせた。" }, { "speaker":
"doki", "face": "smile", "text": "お前が総理になって、正直俺たちの関係は終わるかと思った。でも、立場が変わっても仲間だな。"
}, { "speaker": "self", "face": "smile", "text":
"国を動かす立場になって分かった。お前のように本音でぶつかってくれる存在が、どれほど貴重か。" }, { "speaker": "doki", "face":
"smile", "text": "よし、次の法案も俺に任せろ。総理の背中はしっかり支えてやるよ。" } ], "choices": [ { "label":
"同志として新たな連携を誓う", "result": "首相と同期の新たな信頼関係が築かれ、政権に力強い推進力が生まれた。", "effects": {
"bonds": { "doki": 6 }, "approval": 1, "exp": { "policy": 10 } }, "next":
"end_comrade" }, { "label": "公の立場を忘れぬよう釘を刺す", "result":
"親しき中にも規律を保つことで、周囲からも認められる強い関係となった。", "effects": { "relations": { "party": 5 },
"exp": { "network": 8 } }, "next": "end_comrade" } ] }, { "id": "c3_distance",
"bg": "party_hq", "after_months": [2, 4], "conditions": { "post": ["pm"] },
"fallback": "end_stepdown", "lines": [ { "speaker": "narrator", "text":
"官邸の会議を終えて党本部へ戻ると、{doki}が別の議員たちと談笑しながら通り過ぎた。" }, { "speaker": "secretary",
"face": "sad", "text": "先生、昔から総理に友人はいないと申します。寂しいですが、これが頂の景色なのでしょう。" }, {
"speaker": "self", "face": "sad", "text":
"同じ夢を追った同期さえ、政権の論理の前では一人の議員として扱うしかないのか。" }, { "speaker": "senpai", "face":
"normal", "text": "それでいいのです、総理。すべての責任を一人で負うのが、この椅子の重みですからな。" } ], "choices": [ {
"label": "孤独を受け入れ職務に徹する", "result": "私情を完全に切り離し、冷静な判断力で政権を運営していく決意を固めた。",
"effects": { "abilities": { "調整": 1 }, "approval": 1, "exp": { "policy": 8 } },
"next": "end_lonely" }, { "label": "政権の安定を何より優先する", "result":
"党内のバランスを保ち続け、大きな波風を立てずに政局を乗り切った。", "effects": { "relations": { "party": 5 },
"exp": { "network": 8 } }, "next": "end_lonely" } ] } ], "endings": [ { "id":
"end_comrade", "title": "頂で繋ぐ友情", "text":
"首相という重い立場を超えて同期との信頼を守り抜いた。最強の理解者が政権を支え続ける。" }, { "id": "end_lonely", "title":
"総理に友なし", "text": "権力の頂点で同期と距離を置く道を選んだ。孤独と引き換えに、冷徹な政権運営を貫く。" }, { "id":
"end_stepdown", "title": "人事の余韻", "text":
"首相の任期を終えたことで、閣僚人事を巡る緊迫したやり取りにも区切りがついた。" } ] }, { "id": "pm_coalition_bargain",
"title": "政権維持の代償", "summary":
"重要予算の成立を前に、連立を組む他党の党首から強硬な政策要求を突きつけられる。政権維持か自党の理念かを問われる首相の物語。", "cast":
["secretary", "senpai", "other"], "start": { "trigger": "monthly", "status":
["議員"], "post": ["pm"] }, "chapters": [ { "id": "c1", "bg": "ryotei",
"after_months": [3, 6], "conditions": { "post": ["pm"] }, "fallback":
"end_stepdown", "lines": [ { "speaker": "narrator", "text":
"予算案の採決を控え、政権を支える他党の党首と深夜の料亭で向き合った。" }, { "speaker": "other", "name": "他党の党首",
"text": "総理、我が党が掲げる大規模給付策を今すぐ予算に組み込んでくれ。さもなくば政権協力は白紙だ。" }, { "speaker": "self",
"face": "serious", "text": "そんな巨額の財源を急ごしらえすれば、国の財政計画が根底から崩れてしまう。" }, {
"speaker": "other", "name": "他党の党首", "text":
"我々にも支持者への約束がある。政権を保ちたいなら、痛み分けで飲んでもらうしかないな。" }, { "speaker": "secretary",
"face": "serious", "text": "（先生、要求を飲めば自党の反発は必至です。かといって断れば、予算が通らず政権が揺らぎます。）" } ],
"choices": [ { "label": "要求を飲み予算成立を優先する", "result":
"苦渋の末に条件を受け入れた。連立相手の顔色は和らいだが、胸には重荷が残った。", "effects": { "approval": -1,
"relations": { "party": -5 }, "exp": { "network": 10 } }, "next": "c2_concede"
}, { "label": "財源の筋が通らないと拒絶する", "result":
"「国の将来に責任を持てない案は飲めない」と断り、相手は席を蹴って去った。", "effects": { "relations": { "party": 4,
"press": 3 }, "approval": 1 }, "next": "c2_refuse" } ] }, { "id": "c2_concede",
"bg": "party_hq", "after_months": [1, 3], "conditions": { "post": ["pm"] },
"fallback": "end_stepdown", "lines": [ { "speaker": "narrator", "text":
"合意内容が伝わるやいなや、党本部には自党の幹部や{senpai}が血相を変えて詰めかけた。" }, { "speaker": "senpai",
"face": "angry", "text": "総理、他党の言いなりになるとは何事ですか！我が党の看板政策が丸潰れではありませんか。" }, {
"speaker": "secretary", "face": "serious", "text":
"先生、党内の反発が収まりません。このままでは予算案に造反者が出かねない状況です。" }, { "speaker": "self", "face":
"serious", "text": "政権を保つための苦渋の譲歩だった。だが、この怒りをどう鎮めるかが問われている。" } ], "choices": [ {
"label": "党の幹部を直接説得して回る", "result": "一人ひとりに政権維持の意義を説き、党内の不満をぎりぎりで抑え込んだ。",
"effects": { "relations": { "party": 7 }, "bonds": { "senpai": 8 }, "exp": {
"network": 12 } }, "risk": { "ability": "調整", "threshold": 65, "fail_result":
"「総理の独断だ」と反発が拡大し、党内不和と支持率低下を招いてしまった。", "fail_effects": { "relations": { "party":
-8 }, "bonds": { "senpai": -10 }, "approval": -2 }, "fail_next": "c3" }, "next":
"c3" }, { "label": "首相の権限を盾に押し切る", "result":
"「責任はすべて私が取る」と強硬に押し切り、党内には冷ややかな空気が残った。", "effects": { "relations": { "party": -5
}, "bonds": { "senpai": -8 }, "exp": { "policy": 10 }, "approval": -1 }, "next":
"c3" } ] }, { "id": "c2_refuse", "bg": "diet", "after_months": [1, 3],
"conditions": { "post": ["pm"] }, "fallback": "end_stepdown", "lines": [ {
"speaker": "narrator", "text": "決裂を受けて、相手の党は委員会の審議を欠席し始めた。政局は一気に緊迫の度を深める。" }, {
"speaker": "secretary", "face": "serious", "text":
"先生、各社が連立崩壊の危機と一斉に報じています。予算が通らねば政権の命取りです。" }, { "speaker": "senpai", "face":
"serious", "text": "総理、相手の顔を立てる妥協案を探るか、いっそ解散をちらつかせて強気で押すか、決断の時です。" }, {
"speaker": "self", "face": "serious", "text":
"相手にどこまで歩み寄れるか。国会の時計の針が、一分一秒と迫ってくる。" } ], "choices": [ { "label":
"財源を絞った代替案を再提示する", "result": "期限を区切った現実的な修正案を示し、ようやく他党の党首を交渉の席へ戻した。", "effects":
{ "approval": 2, "exp": { "policy": 15 } }, "risk": { "ability": "政策",
"threshold": 65, "fail_result": "付け焼き刃の案だと突っぱねられ、審議停滞で内閣支持率が落ち込んだ。",
"fail_effects": { "approval": -3, "relations": { "press": -5 } }, "fail_next":
"c3" }, "next": "c3" }, { "label": "解散総選挙をちらつかせ牽制する", "result":
"解散風を吹かせたことで相手も選挙を恐れて折れ、審議は何とか動き出した。", "effects": { "approval": -2, "relations":
{ "press": 2 }, "exp": { "election": 12 } }, "risk": { "ability": "調整",
"threshold": 65, "fail_result": "強気の脅しが裏目に出て相手を硬化させ、内閣支持率も低下した。",
"fail_effects": { "approval": -3, "relations": { "party": -4 } }, "fail_next":
"c3" }, "next": "c3" } ] }, { "id": "c3", "bg": "tv", "after_months": [1, 3],
"conditions": { "post": ["pm"] }, "fallback": "end_stepdown", "lines": [ {
"speaker": "narrator", "text": "激しい駆け引きを経て、首相官邸での記者会見を迎えた。無数のフラッシュが焚かれる。" }, {
"speaker": "other", "name": "記者", "text":
"総理、今回の決着は他党への屈服か、それとも強権的な政権運営か、どう説明されますか。" }, { "speaker": "self", "face":
"serious", "text": "連立や他党との協調は常に綱渡りだ。国民に向けて、自分が守ろうとしたものを語らねば。" }, { "speaker":
"secretary", "face": "serious", "text": "（先生、最後の一言で世論の受け止め方が決まります。）" } ],
"choices": [ { "label": "政権の安定と実績の重要性を訴える", "result":
"予算を成立させ暮らしを守り抜いた現実的な成果を強調し、一定の納得を得た。", "effects": { "approval": 1, "exp": {
"media": 10 } }, "next": "end_stability" }, { "label": "筋を通した政権運営の姿勢を語る",
"result": "国の将来から逃げない姿勢を力強く訴え、支持者の熱い共感を呼んだ。", "effects": { "approval": 1,
"relations": { "supporters": 5 } }, "next": "end_principle" } ] } ], "endings":
[ { "id": "end_stability", "title": "綱渡りの舵取り", "text":
"困難な交渉の末に政権の枠組みを守り抜いた。妥協を恐れぬ調整力が政権に安定をもたらした。" }, { "id": "end_principle",
"title": "譲れぬ一線", "text": "政権の危機に直面しても国の筋を通す姿勢を貫いた。厳しい批判を浴びつつも首相の信念を示した。" }, {
"id": "end_stepdown", "title": "連立交渉の果て", "text":
"首相の職を離れたことで、政権維持を巡る張り詰めた交渉も終わりを告げた。" } ] }, { "id": "pm_historic_decision",
"title": "未来への決断", "summary":
"歴代政権が先送りしてきた痛みを伴う抜本改革に挑むか、国民負担を抑え安定した運営を貫くか、首相として歴史的選択を迫られる。", "cast":
["secretary", "senpai", "other"], "start": { "trigger": "monthly", "status":
["議員"], "post": ["pm"] }, "chapters": [ { "id": "c1", "bg": "diet",
"after_months": [3, 7], "conditions": { "post": ["pm"] }, "fallback":
"end_stepdown", "lines": [ { "speaker": "narrator", "text":
"官邸の有識者会議から、少子化と社会保障の危機に関する厳しい報告書が提出された。" }, { "speaker": "other", "name":
"会議の座長", "text": "総理、痛みを伴う抜本改革を今行わねば、十年後に国の制度が立ち行かなくなります。" }, { "speaker":
"senpai", "face": "serious", "text": "しかし総理、そんな案を出せば国民の猛反発を招き、内閣支持率は一気に急落しますぞ。"
}, { "speaker": "secretary", "face": "serious", "text":
"歴代の首相も選挙を恐れて先送りしてきた難題です。先生はどう判断なさいますか。" }, { "speaker": "self", "face":
"serious", "text": "支持率を下げてでも未来のために手を着けるか、今の暮らしの安定を優先するか。" } ], "choices": [ {
"label": "批判を覚悟で抜本改革に踏み切る", "result": "「誰かがやらねばならない」と改革案の策定を指示した。官邸に緊張が走った。",
"effects": { "approval": -2, "relations": { "party": -3 }, "exp": { "policy": 12
} }, "next": "c2_bold" }, { "label": "国民負担を抑えた緩やかな案にする", "result":
"急激な痛みは避けるべきと判断し、段階的で穏健な見直し案を選んだ。", "effects": { "approval": 1, "relations": {
"supporters": 4 }, "exp": { "network": 8 } }, "next": "c2_gradual" } ] }, {
"id": "c2_bold", "bg": "street", "after_months": [2, 4], "conditions": { "post":
["pm"] }, "fallback": "end_stepdown", "lines": [ { "speaker": "narrator",
"text": "改革案が報道された途端、街頭やメディアで国民への負担押し付けだと激しい逆風が吹き荒れた。" }, { "speaker": "senpai",
"face": "angry", "text": "総理、支持団体からも抗議が殺到しています。このままでは次の選挙で党が全滅しますぞ！" }, {
"speaker": "secretary", "face": "serious", "text":
"先生、批判は想像以上です。ご自身で世論に説明するか、黙って法案を仕上げるかです。" }, { "speaker": "self", "face":
"serious", "text": "正しいと信じた道でも、理解されなければ政権が潰れる。嵐の真っ只中へ踏み出すべきか。" } ], "choices": [
{ "label": "テレビ討論に自ら出て正面から語る", "result":
"危機感を率直に語りかけた言葉が胸を打ち、世論の空気がわずかに変わり始めた。", "effects": { "approval": 2,
"relations": { "press": 5 }, "exp": { "media": 16 } }, "risk": { "ability":
"弁舌", "threshold": 70, "fail_result": "厳しい追及に言葉を詰まらせ、かえって国民の反発と支持率急落を招いた。",
"fail_effects": { "approval": -3, "relations": { "press": -6, "supporters": -5 }
}, "fail_next": "c3" }, "next": "c3" }, { "label": "批判に耐え静かに法案を仕上げる", "result":
"雑音には答えず実務に没頭し、睡眠時間を削って精緻な法案を完成させた。", "effects": { "stamina": -10, "approval":
-2, "exp": { "policy": 15 } }, "next": "c3" } ] }, { "id": "c2_gradual", "bg":
"party_hq", "after_months": [2, 4], "conditions": { "post": ["pm"] },
"fallback": "end_stepdown", "lines": [ { "speaker": "narrator", "text":
"穏健な改革案に対し、党内や関係団体からは「さすが総理、現実的だ」と安堵の声が上がった。" }, { "speaker": "other", "name":
"記者", "text": "しかし世間では、結局は痛みを先送りしただけではないかという批判的な記事も目立っています。" }, { "speaker":
"secretary", "face": "serious", "text":
"先生、今からでも踏み込んだ項目を一つ加えますか。それとも、社会の安心を優先し続けますか。" }, { "speaker": "self", "face":
"serious", "text": "国民の生活を守ることと、未来への責任を果たすこと。その境界線はどこにあるのだろう。" } ], "choices": [
{ "label": "重点分野だけでも抜本策を追加する", "result": "丁寧な調整で一部の重点改革を追加することに成功し、評価が上向いた。",
"effects": { "approval": 2, "exp": { "policy": 14 } }, "risk": { "ability":
"政策", "threshold": 65, "fail_result": "方針がぶれていると党内外から批判を受け、支持率も下がってしまった。",
"fail_effects": { "approval": -2, "relations": { "party": -5 } }, "fail_next":
"c3" }, "next": "c3" }, { "label": "社会の安心感を守る意義を貫く", "result":
"急激な変化を避け暮らしを守る方針を貫き、党と支援者の信頼を固めた。", "effects": { "approval": 1, "relations": {
"party": 5, "supporters": 5 } }, "next": "c3" } ] }, { "id": "c3", "bg": "diet",
"after_months": [2, 4], "conditions": { "post": ["pm"] }, "fallback":
"end_stepdown", "lines": [ { "speaker": "narrator", "text":
"ついに本会議での採決の日が来た。議場の緊張感が最高潮に達し、野党席から怒号が飛ぶ。" }, { "speaker": "senpai", "face":
"serious", "text": "総理、採決の瞬間に向け、我々与党は一致結束しています。堂々と演壇へお立ちください。" }, { "speaker":
"secretary", "face": "serious", "text": "先生、どのような評価を下されようとも、この決断は日本の歴史にずっと残ります。"
}, { "speaker": "self", "face": "serious", "text":
"壇上のライトを浴びながら、一人の政治家として自分が何を大切にしたのかを胸に問う。" } ], "choices": [ { "label":
"百年後の国を見据えて採決に臨む", "result": "将来の世代へ責任を果たす覚悟を胸に、一票を投じる議場を見つめた。", "effects": {
"abilities": { "政策": 2 }, "exp": { "policy": 12 } }, "next": "c4" }, { "label":
"今を生きる人々の暮らしを想う", "result": "目の前の一人ひとりの生活を守り抜く信念を噛み締め、採決を見届けた。", "effects": {
"abilities": { "組織": 1, "知名度": 1 }, "exp": { "election": 12 } }, "next": "c4" }
] }, { "id": "c4", "bg": "home", "after_months": [2, 4], "conditions": { "post":
["pm"] }, "fallback": "end_stepdown", "lines": [ { "speaker": "narrator",
"text": "法案が成立した静かな夜、公邸の机には最新の世論調査の数字が置かれていた。" }, { "speaker": "secretary",
"face": "normal", "text": "先生、これで一つの大きな仕事が終わりました。支持率の数字がすべてを物語るわけではありません。" }, {
"speaker": "self", "face": "normal", "text":
"今日の決断が正しかったのか、それとも過ちだったのか。答えが出るのはずっと先のことだ。" }, { "speaker": "secretary",
"face": "smile", "text": "それでも、先生は逃げずに向き合われました。どうか今夜はゆっくりお休みください。" } ],
"choices": [ { "label": "歴史の評価は未来に委ねる", "result":
"目先の人気にとらわれず己の良心に従った誇りを胸に、深く息を吐いた。", "effects": { "mood": 1, "approval": -1,
"abilities": { "政策": 1 } }, "next": "end_historian" }, { "label":
"国民の納得を得て前へ進める", "result": "これからも国民と丁寧に対話を続け、支持と成果を積み上げようと誓った。", "effects": {
"approval": 2, "relations": { "supporters": 5 } }, "next": "end_pragmatic" } ] }
], "endings": [ { "id": "end_historian", "title": "時代を動かした決断", "text":
"支持率の低下を恐れず将来のための決断を下した。同時代の批判を超え、歴史に名を刻む政治家となった。" }, { "id": "end_pragmatic",
"title": "暮らしを守る舵取り", "text": "急激な混乱を避け、国民の納得と安心を大切にして難局を乗り切った。現実的な指導者として評価された。"
}, { "id": "end_stepdown", "title": "未完の議論", "text":
"首相の座を降りたことで、歴史的課題への取り組みは次の政権へと引き継がれることになった。" } ] } ] }

