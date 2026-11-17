```json
{
  "stories": [
    {
      "id": "rival_crossroad",
      "title": "同じ空の下で",
      "summary": "接戦を演じたライバルと地元の課題を通じて対話し、宿命の好敵手か因縁の相手へと関係が定まる物語。",
      "cast": ["rival", "secretary", "other"],
      "start": {
        "trigger": "after_election",
        "status": ["議員", "浪人"],
        "rival_in_district": true,
        "margin_max": 8
      },
      "chapters": [
        {
          "id": "c1",
          "bg": "station",
          "after_months": [1, 3],
          "lines": [
            { "speaker": "narrator", "text": "選挙の熱気も冷めやらぬ早朝、{district}の駅前に立つと、見覚えのある背中があった。" },
            { "speaker": "rival", "face": "normal", "text": "おはよう、{self}さん。朝からご精が出ますね。この区は私も譲れませんよ。" },
            { "speaker": "secretary", "face": "serious", "text": "すぐ向こうは{rival_party}の{rival}氏ですね。先方は相当気合が入っています。" },
            { "speaker": "self", "face": "normal", "text": "互いに引けない戦いだった。だが、同じ街で朝を迎えるのも縁かもしれない。" },
            { "speaker": "rival", "face": "smile", "text": "先日の得票差は僅かでした。次までに、どちらが住民の声を聞けるか勝負ですね。" }
          ],
          "choices": [
            {
              "label": "笑顔で挨拶し健闘を讃える",
              "result": "{rival}は少し驚いたように目を丸くし、丁寧に頭を下げた。",
              "effects": { "bonds": { "rival": 10 }, "relations": { "press": 3 } },
              "flags": ["rival_greet"],
              "next": "c2"
            },
            {
              "label": "マイクで政策の違いを訴える",
              "result": "双方が熱弁を振るい、通勤客の足が自然と止まった。",
              "effects": { "bonds": { "rival": 5 }, "exp": { "media": 10 } },
              "flags": ["rival_debate"],
              "next": "c2",
              "risk": {
                "ability": "弁舌",
                "threshold": 50,
                "fail_result": "声が空回りし、ただの言い争いに見えてしまった。",
                "fail_effects": { "bonds": { "rival": -5 }, "relations": { "press": -3 } },
                "fail_next": "c2"
              }
            },
            {
              "label": "目を合わさず持ち場に戻る",
              "result": "背中に刺さるような無言の視線を感じた。",
              "effects": { "bonds": { "rival": -10 } },
              "flags": ["rival_cold"],
              "next": "c2"
            }
          ]
        },
        {
          "id": "c2",
          "bg": "hall",
          "after_months": [4, 8],
          "conditions": { "rival_in_district": true },
          "fallback": "end_apart",
          "lines": [
            { "speaker": "narrator", "text": "老朽化した市民ホールの改修を巡り、地元で住民説明会が開かれた。" },
            { "speaker": "other", "name": "町内会長", "face": "serious", "text": "建て替えか修繕か、町内でも意見が割れておる。国や党の立場はどうなのだ。" },
            { "speaker": "rival", "face": "serious", "text": "財源を考えれば段階的な修繕が現実的です。急ぎすぎて負担を増やすべきではない。" },
            { "speaker": "self", "face": "normal", "text": "だが防災拠点として使うなら、耐震基準から見直す抜本策も必要になる。" },
            { "speaker": "rival", "face": "normal", "text": "確かに、避難所機能の強化は外せませんね。そこは{self}さんの言う通りだ。" },
            { "speaker": "narrator", "text": "会場の空気が張り詰める中、{rival}の視線がこちらへ向けられた。" }
          ],
          "choices": [
            {
              "label": "相手案を取り入れ折衷案を出す",
              "result": "{rival}も頷き、住民から安堵の拍手が起きた。",
              "effects": { "bonds": { "rival": 15 }, "exp": { "policy": 12 }, "relations": { "supporters": 5 } },
              "flags": ["rival_coop"],
              "next": "c3",
              "risk": {
                "ability": "調整",
                "threshold": 55,
                "fail_result": "話がまとまらず、議論は平行線のまま終わった。",
                "fail_effects": { "bonds": { "rival": -5 }, "relations": { "supporters": -4 } },
                "fail_next": "c3"
              }
            },
            {
              "label": "自分の理想案の優位性を説く",
              "result": "熱意は伝わったが、{rival}とは平行線に終わった。",
              "effects": { "bonds": { "rival": -10 }, "exp": { "election": 8 }, "relations": { "supporters": 3 } },
              "flags": ["rival_clash"],
              "next": "c3"
            }
          ]
        },
        {
          "id": "c3",
          "bg": "street",
          "after_months": [5, 10],
          "conditions": { "rival_in_district": true },
          "fallback": "end_apart",
          "lines": [
            { "speaker": "narrator", "text": "商店街の夏祭りの夜。提灯の明かりの下で、屋台の列に並ぶ{rival}と鉢合わせた。" },
            { "speaker": "rival", "face": "smile", "text": "選挙の時は見えなかった路地裏の顔が、こういう日には見えますね。" },
            { "speaker": "self", "face": "smile", "text": "ここを守るために、互いに違う党から走っているのは不思議なものだ。" },
            { "speaker": "rival", "face": "serious", "text": "でも、中央の論理を押し付けるだけではこの街は守れない。それは同じ思いでしょう。" },
            { "speaker": "other", "name": "商店会長", "face": "smile", "text": "お二人とも、たまには党の看板を下ろして飲んでいきなさいよ。" },
            { "speaker": "narrator", "text": "祭りばやしが遠ざかる裏通りで、二人の距離が試されていた。" }
          ],
          "choices": [
            {
              "label": "商店街の課題を二人で聞き歩く",
              "result": "店主たちから「いい競争相手だな」と声が上がった。",
              "effects": { "bonds": { "rival": 15 }, "jiban_progress": 20 },
              "flags": ["rival_walk"],
              "if_flags": ["rival_coop"],
              "next": "c4"
            },
            {
              "label": "立場は違うと一線を引いて話す",
              "result": "{rival}は寂しそうに笑い、丁寧に一礼して去った。",
              "effects": { "bonds": { "rival": -12 }, "exp": { "election": 10 } },
              "next": "c4"
            },
            {
              "label": "党を超えた地域課題を議論する",
              "result": "互いの政策の芯に触れ、深い手応えを感じた。",
              "effects": { "bonds": { "rival": 10 }, "abilities": { "調整": 1 } },
              "flags": ["rival_talk"],
              "next": "c4",
              "risk": {
                "ability": "政策",
                "threshold": 60,
                "fail_result": "議論が噛み合わず、気まずい沈黙が流れた。",
                "fail_effects": { "bonds": { "rival": -5 }, "mood": -1 },
                "fail_next": "c4"
              }
            }
          ]
        },
        {
          "id": "c4",
          "bg": "campaign",
          "after_months": [5, 10],
          "conditions": { "rival_in_district": true },
          "fallback": "end_apart",
          "lines": [
            { "speaker": "narrator", "text": "再び解散風が吹き始めた。選挙準備に追われる事務所の前に、{rival}が立っていた。" },
            { "speaker": "rival", "face": "normal", "text": "表敬挨拶というのも変ですが、次に勝つのは私だと伝えに来ました。" },
            { "speaker": "secretary", "face": "surprised", "text": "敵陣営が直々に乗り込んでくるとは、肝が据わっていますね……。" },
            { "speaker": "self", "face": "serious", "text": "わざわざご丁寧に。こちらも一議席を譲るつもりはない。" },
            { "speaker": "rival", "face": "smile", "text": "{district}の有権者が選ぶのはどちらの未来か、いよいよ決着ですね。" }
          ],
          "choices": [
            {
              "label": "正々堂々、最高の勝負を誓う",
              "result": "固い握手のあと、互いの陣営へ背を向けた。",
              "effects": { "bonds": { "rival": 15 }, "mood": 1 },
              "if_flags": ["rival_coop"],
              "next": "end_worthy"
            },
            {
              "label": "今度こそ圧倒的な差をつけると告ぐ",
              "result": "{rival}の目が鋭く光り、火花が散るようだった。",
              "effects": { "bonds": { "rival": -15 }, "exp": { "election": 12 } },
              "next": "end_feud"
            },
            {
              "label": "互いの健闘を静かに祈って見送る",
              "result": "多くを語らずとも、戦友のような空気が残った。",
              "effects": { "bonds": { "rival": 10 }, "relations": { "press": 4 } },
              "next": "end_worthy"
            }
          ]
        }
      ],
      "endings": [
        {
          "id": "end_worthy",
          "title": "誇り高き好敵手",
          "text": "立場は違えど街を想う芯は同じ。二人の切磋琢磨は{district}の政治を熱くした。",
          "effects": {
            "bond_state": { "rival": "好敵手" },
            "abilities": { "弁舌": 1 },
            "skills_add": ["tsuji_seppou"]
          }
        },
        {
          "id": "end_feud",
          "title": "宿命の因縁",
          "text": "一歩も譲らぬ激突の果てに、二人の名は負けられない因縁として地域に刻まれた。",
          "effects": {
            "bond_state": { "rival": "因縁" },
            "vote_bonus": 1,
            "relations": { "supporters": 5 }
          }
        },
        {
          "id": "end_apart",
          "title": "すれ違った背中",
          "text": "状況が変わり、ライバルとの因縁に決着をつける機会は遠のいていった。",
          "effects": { "exp": { "election": 8 } }
        }
      ]
    },
    {
      "id": "rival_shadow",
      "title": "敵陣の灯り",
      "summary": "ライバルの会計処理ミス疑惑と持病による離脱の危機に直面し、政敵としてどう振る舞うかを問われる。",
      "cast": ["rival", "secretary", "other"],
      "start": {
        "trigger": "monthly",
        "status": ["議員", "浪人"],
        "rival_in_district": true,
        "terms_min": 1
      },
      "chapters": [
        {
          "id": "c1",
          "bg": "office",
          "after_months": [2, 5],
          "conditions": { "rival_in_district": true },
          "fallback": "end_fade",
          "lines": [
            { "speaker": "secretary", "face": "serious", "text": "{self}さん、耳寄りですが少し気になる情報が入りました。" },
            { "speaker": "secretary", "face": "normal", "text": "{rival}氏の事務所で事務処理の記載漏れが見つかり、近く報道されるそうです。" },
            { "speaker": "self", "face": "surprised", "text": "あの生真面目な{rival}氏が？　単なるミスか、それとも何か無理があったのか。" },
            { "speaker": "secretary", "face": "normal", "text": "実は、ご本人が数か月前から病院に通っている姿も目撃されています。" },
            { "speaker": "narrator", "text": "ライバルの足元に揺らぎが生じている。この情報をどう扱うべきか。" }
          ],
          "choices": [
            {
              "label": "騒ぎに乗らず公式発表を待つ",
              "result": "下手に動かず、日々の地元活動に腰を据えた。",
              "effects": { "relations": { "secretary": 3 }, "exp": { "policy": 6 } },
              "flags": ["shadow_wait"],
              "next": "c2"
            },
            {
              "label": "独自に陣営の周辺を調べさせる",
              "result": "単なる担当者の記載漏れで、不正ではないと分かった。",
              "effects": { "exp": { "election": 10 }, "bonds": { "rival": -5 } },
              "flags": ["shadow_probe"],
              "next": "c2",
              "risk": {
                "ability": "組織",
                "threshold": 55,
                "fail_result": "調べていることが漏れ、姑息だと噂が立った。",
                "fail_effects": { "bonds": { "rival": -15 }, "relations": { "press": -5 } },
                "fail_next": "c2"
              }
            }
          ]
        },
        {
          "id": "c2",
          "bg": "tv",
          "after_months": [2, 4],
          "conditions": { "rival_in_district": true },
          "fallback": "end_fade",
          "lines": [
            { "speaker": "narrator", "text": "数週間後、{rival}は自ら会見を開き、会計訂正と持病の治療のための休養を公表した。" },
            { "speaker": "other", "name": "ベテラン記者", "face": "serious", "text": "会見では素直に非を認めていましたが、他陣営からは追及の声も上がっています。" },
            { "speaker": "other", "name": "ベテラン記者", "face": "normal", "text": "同じ{district}の対立候補として、{self}さんはこの件をどう見ますか。" },
            { "speaker": "secretary", "face": "serious", "text": "厳しく叩けば支持層には響きますが、病気の相手を責めるリスクもあります。" },
            { "speaker": "narrator", "text": "記者のマイクが向けられる。一言の選び方が今後を左右する。" }
          ],
          "choices": [
            {
              "label": "真摯な説明を認め、快復を願う",
              "result": "誠実な対応だと報じられ、{rival}の陣営も安堵した様子だった。",
              "effects": { "bonds": { "rival": 15 }, "relations": { "press": 5 } },
              "flags": ["shadow_fair"],
              "next": "c3"
            },
            {
              "label": "管理責任の甘さを厳しく追及する",
              "result": "正論として一部で支持されたが、冷淡だとの声も出た。",
              "effects": { "bonds": { "rival": -20 }, "exp": { "media": 10 }, "relations": { "supporters": 3 } },
              "flags": ["shadow_attack"],
              "next": "c3"
            },
            {
              "label": "論評を控え、政策議論に専念する",
              "result": "無難なコメントに留め、自身の活動報告を続けた。",
              "effects": { "exp": { "policy": 8 } },
              "flags": ["shadow_neutral"],
              "next": "c3"
            }
          ]
        },
        {
          "id": "c3",
          "bg": "hospital",
          "after_months": [3, 6],
          "conditions": { "rival_in_district": true },
          "fallback": "end_fade",
          "lines": [
            { "speaker": "narrator", "text": "地元の総合病院へ福祉視察に訪れた帰り、ロビーで杖をついた{rival}と出会った。" },
            { "speaker": "rival", "face": "sad", "text": "{self}さん……。お恥ずかしい姿をお見せしました。もうすぐ退院です。" },
            { "speaker": "self", "face": "normal", "text": "顔色は悪くなさそうだ。無理をしてぶり返さないようにしてください。" },
            { "speaker": "rival", "face": "serious", "text": "病室で何度も考えました。私たちが争っている間も、この町の課題は待ってくれない。" },
            { "speaker": "rival", "face": "normal", "text": "もし私が倒れていたら、あの介護施設の計画はどうなっていたでしょうね。" },
            { "speaker": "narrator", "text": "政敵としてではなく、一人の人間としての言葉が胸に刺さった。" }
          ],
          "choices": [
            {
              "label": "快復後にまた議場で競おうと励ます",
              "result": "{rival}は目を細め、力強く頷き返した。",
              "effects": { "bonds": { "rival": 15 }, "mood": 1 },
              "if_flags": ["shadow_fair"],
              "next": "c4"
            },
            {
              "label": "地域の医療課題について聞き取る",
              "result": "患者目線の切実な改善点を知ることができた。",
              "effects": { "bonds": { "rival": 10 }, "exp": { "policy": 14 } },
              "flags": ["shadow_listen"],
              "next": "c4",
              "risk": {
                "ability": "政策",
                "threshold": 50,
                "fail_result": "話が噛み合わず、疲れさせてしまった。",
                "fail_effects": { "bonds": { "rival": -8 }, "mood": -1 },
                "fail_next": "c4"
              }
            },
            {
              "label": "支援者が待つなら早く戻れと告げる",
              "result": "{rival}は苦笑いし、「厳しいですね」と呟いた。",
              "effects": { "bonds": { "rival": -5 }, "exp": { "election": 8 } },
              "next": "c4"
            }
          ]
        },
        {
          "id": "c4",
          "bg": "hall",
          "after_months": [4, 8],
          "conditions": { "rival_in_district": true },
          "fallback": "end_fade",
          "lines": [
            { "speaker": "narrator", "text": "春、復帰を果たした{rival}と同じ公開討論会の壇上に並んだ。" },
            { "speaker": "rival", "face": "normal", "text": "皆さん、お騒がせしました。今日からは政策の中身で競い合いたいと思います。" },
            { "speaker": "other", "name": "司会者", "face": "normal", "text": "会場からは大きな拍手です。それでは{self}さんからも一言どうぞ。" },
            { "speaker": "self", "face": "serious", "text": "（過去の騒動を乗り越えた相手と、これからどう向かい合うか……）" },
            { "speaker": "narrator", "text": "聴衆の視線が集まる中、マイクを握り直した。" }
          ],
          "choices": [
            {
              "label": "復帰を歓迎し、政策議論を誓う",
              "result": "会場が温かい拍手に包まれ、実りある討論となった。",
              "effects": { "bonds": { "rival": 15 }, "relations": { "press": 5 } },
              "if_flags": ["shadow_fair"],
              "next": "end_ally"
            },
            {
              "label": "過去の管理責任を改めて問う",
              "result": "会場は凍りつき、{rival}の表情から笑顔が消えた。",
              "effects": { "bonds": { "rival": -20 }, "vote_bonus": 1 },
              "next": "end_distrust"
            },
            {
              "label": "敬意は払いつつ政策の甘さを突く",
              "result": "火花を散らす真剣勝負に、聴衆も身を乗り出した。",
              "effects": { "bonds": { "rival": 5 }, "exp": { "policy": 10 } },
              "next": "end_ally",
              "risk": {
                "ability": "弁舌",
                "threshold": 60,
                "fail_result": "言葉が鋭すぎて嫌味に聞こえ、空気を悪くした。",
                "fail_effects": { "bonds": { "rival": -15 } },
                "fail_next": "end_distrust"
              }
            }
          ]
        }
      ],
      "endings": [
        {
          "id": "end_ally",
          "title": "党派を超えた敬意",
          "text": "苦境に手を差し伸べたことで、二人の間に政治家の誇りを通じた深い信頼が芽生えた。",
          "effects": {
            "bond_state": { "rival": "盟友" },
            "relations": { "press": 6 },
            "exp": { "policy": 15 }
          }
        },
        {
          "id": "end_distrust",
          "title": "消えぬ不信の溝",
          "text": "容赦ない追及は勝利への執念を見せたが、両者の間に深いわだかまりを残した。",
          "effects": {
            "bond_state": { "rival": "不信" },
            "vote_bonus": 1,
            "relations": { "party": 4 }
          }
        },
        {
          "id": "end_fade",
          "title": "風の向きが変わる",
          "text": "ライバルの離脱や状況の変化により、騒動は静かに幕を閉じた。",
          "effects": { "exp": { "election": 8 } }
        }
      ]
    },
    {
      "id": "doki_divergence",
      "title": "分かれ道の同期",
      "summary": "同じ選挙で初当選した同期が党内で急台頭し、やがて逆風に晒されて失脚するまでの葛藤と再起の記録。",
      "cast": ["doki", "senpai", "other"],
      "start": {
        "trigger": "monthly",
        "status": ["議員"],
        "terms_min": 2
      },
      "chapters": [
        {
          "id": "c1",
          "bg": "diet",
          "after_months": [2, 6],
          "conditions": { "status": ["議員"] },
          "fallback": "end_distance",
          "lines": [
            { "speaker": "narrator", "text": "国会の赤絨毯を歩いていると、同期の{doki}が晴れやかな顔で駆け寄ってきた。" },
            { "speaker": "doki", "face": "smile", "text": "聞いたぞ、{self}！　今度の重要法案の取りまとめ、俺が責任者に抜擢されたんだ。" },
            { "speaker": "self", "face": "surprised", "text": "本当か。同期の中から抜擢とはすごいな、少し羨ましいくらいだ。" },
            { "speaker": "doki", "face": "serious", "text": "古株の連中が腰が重いからな。俺たちの世代で{party}の空気を変えてやるさ。" },
            { "speaker": "narrator", "text": "先を行く同期の勢いに、少しの焦りと期待が入り混じる。" }
          ],
          "choices": [
            {
              "label": "心から祝い、協力を申し出る",
              "result": "{doki}は「頼りにしてるぞ」と肩を叩いた。",
              "effects": { "bonds": { "doki": 12 }, "relations": { "party": 3 } },
              "flags": ["doki_support"],
              "next": "c2"
            },
            {
              "label": "自分も負けないと対抗心を語る",
              "result": "{doki}はニヤリと笑い、「いい勝負だな」と言った。",
              "effects": { "bonds": { "doki": -5 }, "exp": { "policy": 10 } },
              "flags": ["doki_compete"],
              "next": "c2"
            }
          ]
        },
        {
          "id": "c2",
          "bg": "ryotei",
          "after_months": [4, 8],
          "conditions": { "status": ["議員"] },
          "fallback": "end_distance",
          "lines": [
            { "speaker": "narrator", "text": "数か月後、{doki}から都内の料亭に呼ばれた。そこには数人の若手議員が集まっていた。" },
            { "speaker": "doki", "face": "serious", "text": "実は、執行部へ提出する党改革の意見書を作った。{self}、お前も署名してくれ。" },
            { "speaker": "self", "face": "normal", "text": "中身は立派だが、これは{senpai}たちベテラン勢への宣戦布告に見えかねないぞ。" },
            { "speaker": "doki", "face": "angry", "text": "波風を立てなきゃ何も変わらない。お前も事なかれ主義に染まったのか？" },
            { "speaker": "senpai", "face": "normal", "text": "（以前、{senpai}は「若いうちの暴走は足を掬われる」と言っていたな……）" },
            { "speaker": "narrator", "text": "仲間の熱気に押されるべきか、それとも立ち止まるべきか。" }
          ],
          "choices": [
            {
              "label": "腹を括って意見書に署名する",
              "result": "{doki}は力強く握手し、団結を誓った。",
              "effects": { "bonds": { "doki": 15 }, "relations": { "party": -5 } },
              "flags": ["doki_joined"],
              "next": "c3"
            },
            {
              "label": "表現を和らげるよう説得する",
              "result": "粘り強い調整で、角の取れた前向きな提言になった。",
              "effects": { "bonds": { "doki": 8 }, "abilities": { "調整": 1 } },
              "flags": ["doki_warned"],
              "next": "c3",
              "risk": {
                "ability": "調整",
                "threshold": 60,
                "fail_result": "腰抜けと罵られ、その場の空気が凍りついた。",
                "fail_effects": { "bonds": { "doki": -15 }, "relations": { "party": 3 } },
                "fail_next": "c3"
              }
            },
            {
              "label": "党の結束を重んじて署名を断る",
              "result": "{doki}は寂しそうな目をして、「分かった」とだけ言った。",
              "effects": { "bonds": { "doki": -10 }, "relations": { "party": 5 } },
              "flags": ["doki_refused"],
              "next": "c3"
            }
          ]
        },
        {
          "id": "c3",
          "bg": "party_hq",
          "after_months": [4, 8],
          "conditions": { "status": ["議員"] },
          "fallback": "end_distance",
          "lines": [
            { "speaker": "narrator", "text": "党内対立が表面化する中、週刊誌に{doki}の強引な資金集めや失言の疑惑が載った。" },
            { "speaker": "senpai", "face": "serious", "text": "だから言わんこっちゃない。党を守るため、奴の役職を解く議論が出ている。" },
            { "speaker": "doki", "face": "sad", "text": "{self}、一部の切り取り記事で俺は潰されそうだ。味方になってくれないか。" },
            { "speaker": "self", "face": "serious", "text": "強引な面はあったが、事実と違う部分まで誇張されているようにも見える。" },
            { "speaker": "other", "name": "党職員", "face": "surprised", "text": "会議が始まります！　執行部は今すぐ処分を決めたい構えです。" },
            { "speaker": "narrator", "text": "党本部の廊下で、逆風に晒された同期を前に決断を迫られた。" }
          ],
          "choices": [
            {
              "label": "党内で必死に{doki}を擁護する",
              "result": "擁護に回ったことで、執行部からの風当たりがこちらにも来た。",
              "effects": { "bonds": { "doki": 18 }, "relations": { "party": -6, "press": -4 } },
              "flags": ["doki_defend"],
              "next": "c4"
            },
            {
              "label": "根回しして釈明の機会を作る",
              "result": "重鎮たちを説得し、公開の場で説明させる道を開いた。",
              "effects": { "bonds": { "doki": 15 }, "exp": { "network": 15 }, "relations": { "press": 3 } },
              "flags": ["doki_saved"],
              "next": "c4",
              "risk": {
                "ability": "調整",
                "threshold": 65,
                "fail_result": "奔走虚しく、会議は処分ありきで閉じられた。",
                "fail_effects": { "bonds": { "doki": 5 }, "stamina": -12 },
                "fail_next": "c4"
              }
            },
            {
              "label": "党の規律を優先し距離を置く",
              "result": "{doki}は冷たい目でこちらを一瞥し、会議室へ消えた。",
              "effects": { "bonds": { "doki": -18 }, "relations": { "party": 8 } },
              "flags": ["doki_apart"],
              "next": "c4"
            }
          ]
        },
        {
          "id": "c4",
          "bg": "ryotei",
          "after_months": [3, 6],
          "conditions": { "status": ["議員"] },
          "fallback": "end_distance",
          "lines": [
            { "speaker": "narrator", "text": "結局、{doki}は役職を辞任し、党内の要職から外された。静かな店の隅で二人向き合う。" },
            { "speaker": "doki", "face": "sad", "text": "惨めなものだな。あんなに人が寄ってきたのに、潮が引くように誰もいなくなった。" },
            { "speaker": "self", "face": "normal", "text": "権力に集まる人はそんなものだ。だが、本当に大事なものはまだ残っているはずだ。" },
            { "speaker": "doki", "face": "normal", "text": "……お前は、これからどうするんだ。俺と同じ道は踏むなよ。" },
            { "speaker": "narrator", "text": "失意の底にある同期に、かける言葉を選ぶ。" }
          ],
          "choices": [
            {
              "label": "再起への政策プランを共に練る",
              "result": "{doki}の目に、わずかながら昔の熱が戻ってきた。",
              "effects": { "bonds": { "doki": 12 }, "exp": { "policy": 12 } },
              "flags": ["doki_encourage"],
              "next": "c5",
              "risk": {
                "ability": "政策",
                "threshold": 55,
                "fail_result": "考えがまとまらず、ただ励まし合うだけに終わった。",
                "fail_effects": { "bonds": { "doki": 8 } },
                "fail_next": "c5"
              }
            },
            {
              "label": "政治の厳しさを認め、各自で歩む",
              "result": "静かに杯を空け、二人は言葉少なに店を出た。",
              "effects": { "bonds": { "doki": -5 }, "exp": { "network": 8 } },
              "next": "c5"
            }
          ]
        },
        {
          "id": "c5",
          "bg": "diet",
          "after_months": [6, 12],
          "conditions": { "status": ["議員"] },
          "fallback": "end_distance",
          "lines": [
            { "speaker": "narrator", "text": "半年後。地味な委員会で泥臭く質疑を重ねていた{doki}が、再び評価を取り戻しつつあった。" },
            { "speaker": "doki", "face": "normal", "text": "{self}、この間の騒動から随分と時間が経ったな。互いに色々なものが見えたよ。" },
            { "speaker": "self", "face": "smile", "text": "一回り大きくなったな。また委員会や党の場で一緒に働ける日が楽しみだ。" },
            { "speaker": "doki", "face": "smile", "text": "これからは同じ党の議員として、それぞれの筋を通していくとしよう。" },
            { "speaker": "narrator", "text": "試練をくぐり抜けた同期との関係に、一つの答えが出る。" }
          ],
          "choices": [
            {
              "label": "恩義などいいから共に歩もう",
              "result": "{doki}は深く頭を下げ、「絶対に忘れない」と言った。",
              "effects": { "bonds": { "doki": 15 }, "relations": { "party": 4 } },
              "if_flags": ["doki_defend"],
              "next": "end_benefactor"
            },
            {
              "label": "生涯の盟友として肩を組む",
              "result": "二人の絆は、どんな役職にも代えがたい財産となった。",
              "effects": { "bonds": { "doki": 15 }, "mood": 1 },
              "next": "end_ally"
            },
            {
              "label": "良きライバルとして切磋琢磨を誓う",
              "result": "それぞれの持ち場で競い合う、爽やかな別れとなった。",
              "effects": { "bonds": { "doki": 5 }, "abilities": { "政策": 1 } },
              "next": "end_distance"
            }
          ]
        }
      ],
      "endings": [
        {
          "id": "end_ally",
          "title": "風雪を越えた盟友",
          "text": "栄光も挫折も分かち合った同期は、党内のどんな危機でも背中を預けられる盟友となった。",
          "effects": {
            "bond_state": { "doki": "盟友" },
            "relations": { "party": 6 },
            "skills_add": ["nemawashi_oni"]
          }
        },
        {
          "id": "end_benefactor",
          "title": "忘れられぬ恩義",
          "text": "孤立無援の時期に手を差し伸べたことで、{doki}はあなたに一生の恩義を感じている。",
          "effects": {
            "bond_state": { "doki": "恩人" },
            "exp": { "network": 20 },
            "relations": { "party": 4 }
          }
        },
        {
          "id": "end_distance",
          "title": "それぞれの行く先",
          "text": "同じスタートラインから始まった二人は、やがて違う風景を見つめて歩み始めた。",
          "effects": { "exp": { "policy": 12 } }
        }
      ]
    },
    {
      "id": "senpai_legacy",
      "title": "看板の重み",
      "summary": "引退を意識し始めた党の先輩から、長年の人脈と支持基盤を引き継ぐべきか迷う継承の物語。",
      "cast": ["senpai", "secretary", "other"],
      "start": {
        "trigger": "monthly",
        "status": ["議員"],
        "terms_min": 2
      },
      "chapters": [
        {
          "id": "c1",
          "bg": "ryotei",
          "after_months": [3, 8],
          "conditions": { "status": ["議員"] },
          "fallback": "end_missed",
          "lines": [
            { "speaker": "narrator", "text": "会食の席で、いつも豪快な{senpai}が珍しく小さな文字の資料を遠ざけて目を細めた。" },
            { "speaker": "senpai", "face": "sad", "text": "年には勝てんな。昔の仲間も一人減り、二人減りだ。お前もそろそろ背負う番だぞ。" },
            { "speaker": "self", "face": "normal", "text": "まだまだ先生には現場で引っ張っていただかないと困ります。" },
            { "speaker": "senpai", "face": "normal", "text": "おだてるな。俺が持つ県内の連絡会や業界との窓口、誰かに渡さにゃならんのだ。" },
            { "speaker": "narrator", "text": "{senpai}の視線が、後継者を見定めるように静かに注がれた。" }
          ],
          "choices": [
            {
              "label": "先生の志をぜひ学ばせてほしい",
              "result": "{senpai}は満足そうに頷き、盃を傾けた。",
              "effects": { "bonds": { "senpai": 15 }, "exp": { "network": 10 } },
              "flags": ["senpai_pupil"],
              "next": "c2"
            },
            {
              "label": "自分のやり方で力を示したい",
              "result": "{senpai}は「生意気だが悪くない」と笑った。",
              "effects": { "bonds": { "senpai": 5 }, "abilities": { "弁舌": 1 } },
              "flags": ["senpai_indep"],
              "next": "c2"
            }
          ]
        },
        {
          "id": "c2",
          "bg": "party_hq",
          "after_months": [4, 10],
          "conditions": { "status": ["議員"] },
          "fallback": "end_missed",
          "lines": [
            { "speaker": "narrator", "text": "{senpai}が会長を務める党内の重要部会で、後任に{self}を推す声が上がった。" },
            { "speaker": "other", "name": "古参議員", "face": "angry", "text": "当選回数も浅い若手に任せられるか！　先輩の顔に免じても、順番というものがある。" },
            { "speaker": "senpai", "face": "serious", "text": "順番を待っていたら党が腐る。だが、周囲を黙らせるだけの仕事はお前自身で見せろ。" },
            { "speaker": "secretary", "face": "serious", "text": "古参の方々のメンツを立てつつ、実務で納得させる必要がありますね。" },
            { "speaker": "narrator", "text": "党内の世代交代の壁に、どう向き合うか。" }
          ],
          "choices": [
            {
              "label": "古参議員たちを一人ずつ説得する",
              "result": "丁寧な根回しが効き、反発の声が収まった。",
              "effects": { "bonds": { "senpai": 12 }, "relations": { "party": 8 } },
              "flags": ["senpai_inherit"],
              "next": "c3",
              "risk": {
                "ability": "調整",
                "threshold": 60,
                "fail_result": "話がこじれ、青二才だと反感を買ってしまった。",
                "fail_effects": { "relations": { "party": -6 }, "bonds": { "senpai": -5 } },
                "fail_next": "c3"
              }
            },
            {
              "label": "政策の勉強会を開き実績で示す",
              "result": "緻密な提言書に、反対派からも一目置かれた。",
              "effects": { "exp": { "policy": 12 }, "mood": 1 },
              "flags": ["senpai_merit"],
              "next": "c3",
              "risk": {
                "ability": "政策",
                "threshold": 55,
                "fail_result": "論理が硬すぎると古参から敬遠されてしまった。",
                "fail_effects": { "relations": { "party": -4 }, "exp": { "policy": 6 } },
                "fail_next": "c3"
              }
            },
            {
              "label": "まだ早いと辞退し先輩を支える",
              "result": "{senpai}は「律儀な奴だ」と苦笑した。",
              "effects": { "bonds": { "senpai": 5 }, "relations": { "party": 4 } },
              "next": "c3"
            }
          ]
        },
        {
          "id": "c3",
          "bg": "hall",
          "after_months": [6, 12],
          "conditions": { "status": ["議員"] },
          "fallback": "end_missed",
          "lines": [
            { "speaker": "narrator", "text": "ついに{senpai}が次の総選挙への不出馬を決断し、県内の県議や団体長が集められた。" },
            { "speaker": "senpai", "face": "normal", "text": "長年支えてくれた皆には感謝しかない。今後は{self}を俺だと思って盛り立ててくれ。" },
            { "speaker": "other", "name": "業界団体長", "face": "normal", "text": "承知しました。先生のお顔を立て、予算陳情の窓口もそのまま引き継ぎましょう。" },
            { "speaker": "secretary", "face": "serious", "text": "（小声で）ただ、この団体は古い慣習や強引な要望も多く、丸呑みは危険です……。" },
            { "speaker": "self", "face": "serious", "text": "大きな力には、必ず相応のしがらみがついて回る。" },
            { "speaker": "narrator", "text": "用意された巨大な看板を、どう受け止めるべきか。" }
          ],
          "choices": [
            {
              "label": "透明化を条件にパイプを引き継ぐ",
              "result": "新ルールを提案し、健全な連携体制を築いた。",
              "effects": { "bonds": { "senpai": 10 }, "relations": { "kengi": 10, "supporters": 5 } },
              "flags": ["senpai_reform"],
              "next": "c4",
              "risk": {
                "ability": "調整",
                "threshold": 65,
                "fail_result": "礼儀知らずと怒りを買い、支援が遠のいた。",
                "fail_effects": { "relations": { "kengi": -6 }, "bonds": { "senpai": -10 } },
                "fail_next": "c4"
              }
            },
            {
              "label": "義理を重んじ、看板を丸ごと背負う",
              "result": "「頼もしい後継だ」と地元重鎮たちが沸いた。",
              "effects": { "bonds": { "senpai": 15 }, "relations": { "kengi": 8 }, "money": 50 },
              "flags": ["senpai_all"],
              "next": "c4"
            },
            {
              "label": "志だけ受け継ぎ、団体人脈は断る",
              "result": "清潔な姿勢は評価されたが、{senpai}は少し寂しそうだった。",
              "effects": { "bonds": { "senpai": -10 }, "exp": { "policy": 15 } },
              "flags": ["senpai_clean"],
              "next": "c4"
            }
          ]
        },
        {
          "id": "c4",
          "bg": "diet",
          "after_months": [3, 8],
          "conditions": { "status": ["議員"] },
          "fallback": "end_missed",
          "lines": [
            { "speaker": "narrator", "text": "任期満了の日。荷物をまとめた議員会館の部屋で、{senpai}は胸から議員バッジを外した。" },
            { "speaker": "senpai", "face": "smile", "text": "長かったが、良い幕引きだった。お前がいてくれて助かったよ。" },
            { "speaker": "self", "face": "normal", "text": "先生から教わった政治の奥深さは、一生忘れません。" },
            { "speaker": "senpai", "face": "normal", "text": "あとは時代に合わせてお前が変えろ。それが俺の望みだ。" },
            { "speaker": "narrator", "text": "大きな背中を見送り、自身の肩にかかる重みを確かめた。" }
          ],
          "choices": [
            {
              "label": "新しい時代を切り拓くと誓う",
              "result": "{senpai}は目を細め、力強く頷いて部屋を去った。",
              "effects": { "bonds": { "senpai": 15 }, "mood": 1 },
              "if_flags": ["senpai_reform"],
              "next": "end_master"
            },
            {
              "label": "先生の看板を必ず守り抜くと誓う",
              "result": "{senpai}は安心したように笑い、固く握手した。",
              "effects": { "bonds": { "senpai": 15 }, "relations": { "party": 5 } },
              "if_flags": ["senpai_all"],
              "next": "end_master"
            },
            {
              "label": "自分なりの政治を貫きますと告げる",
              "result": "「それでいい」と笑い、{senpai}は廊下へ消えた。",
              "effects": { "abilities": { "政策": 1 }, "exp": { "policy": 12 } },
              "next": "end_independent"
            }
          ]
        }
      ],
      "endings": [
        {
          "id": "end_master",
          "title": "受け継がれた系譜",
          "text": "党の重鎮から信頼と人脈のバトンを託され、{senpai}との師弟の絆が揺るぎないものになった。",
          "effects": {
            "bond_state": { "senpai": "師弟" },
            "relations": { "kengi": 8, "party": 6 },
            "skills_add": ["kengi_pipe"]
          }
        },
        {
          "id": "end_independent",
          "title": "己の足で立つ",
          "text": "先輩の大きな庇護に頼り切らず、自らの政策と信念で未来を切り拓く道を選んだ。",
          "effects": {
            "abilities": { "政策": 2 },
            "exp": { "policy": 18 }
          }
        },
        {
          "id": "end_missed",
          "title": "届かなかったバトン",
          "text": "議席を失うなどの変化が重なり、先輩の遺産を受け継ぐ機会は失われた。",
          "effects": { "exp": { "network": 8 } }
        }
      ]
    },
    {
      "id": "secretary_crossroad",
      "title": "一番近い背中",
      "summary": "長年支えてくれた秘書が、親の介護と自身の政治家への夢との間で揺れる姿に向き合う物語。",
      "cast": ["secretary", "other"],
      "start": {
        "trigger": "monthly",
        "status": ["候補", "議員", "浪人"],
        "relations": { "secretary": 45 }
      },
      "chapters": [
        {
          "id": "c1",
          "bg": "office",
          "after_months": [3, 8],
          "lines": [
            { "speaker": "narrator", "text": "終電も近い事務所。いつも冷静な{secretary}が、電話口で誰かと声を潜めて話していた。" },
            { "speaker": "secretary", "face": "sad", "text": "すみません、私用で。実は実家の親が体調を崩し、しばらく通う必要がありそうです。" },
            { "speaker": "narrator", "text": "ふと{secretary}の机の端を見ると、地元の地方選挙の立候補説明会の要項が覗いていた。" },
            { "speaker": "self", "face": "surprised", "text": "親御さんのことも心配だが、秘書の胸のうちにも別の迷いがあるのかもしれない。" },
            { "speaker": "secretary", "face": "normal", "text": "申し訳ありません。すぐ仕事に戻りますので、気になさらず。" }
          ],
          "choices": [
            {
              "label": "親御さんの様子を詳しく尋ねる",
              "result": "{secretary}は少し肩の力を抜き、事情を話してくれた。",
              "effects": { "bonds": { "secretary": 12 }, "relations": { "secretary": 5 } },
              "flags": ["sec_care"],
              "next": "c2"
            },
            {
              "label": "無理はしないよう軽く声をかける",
              "result": "{secretary}は丁寧にお辞儀をし、黙々と資料を整理した。",
              "effects": { "bonds": { "secretary": 3 }, "exp": { "election": 5 } },
              "flags": ["sec_work"],
              "next": "c2"
            }
          ]
        },
        {
          "id": "c2",
          "bg": "hospital",
          "after_months": [3, 6],
          "lines": [
            { "speaker": "narrator", "text": "数か月後、病院ロビー。検査を終えた親を送り出した{secretary}と合流し、差し入れを渡す。" },
            { "speaker": "secretary", "face": "smile", "text": "お気遣いありがとうございます。おかげで親の容態も落ち着いて、一安心しました。" },
            { "speaker": "secretary", "face": "serious", "text": "実は……いつかは自分も地方議員として地元の街を変えたい夢が芽生えたのです。" },
            { "speaker": "self", "face": "normal", "text": "この世界を一番近くで見てきたのだ。志を持つのも自然なことだろう。" },
            { "speaker": "secretary", "face": "sad", "text": "でも、あなたを支える役目を放り出す気はありません。ただ、正直に伝えておきたくて。" },
            { "speaker": "narrator", "text": "一番頼りにしてきた相棒の夢を前に、言葉を探す。" }
          ],
          "choices": [
            {
              "label": "いつか挑戦できるよう応援すると言う",
              "result": "{secretary}の目が潤み、「必ず恩返しします」と言った。",
              "effects": { "bonds": { "secretary": 15 }, "mood": 1 },
              "flags": ["sec_dream"],
              "next": "c3"
            },
            {
              "label": "実務や政策を直接教えようと提案",
              "result": "仕事の合間に政策論を交わす時間が増えた。",
              "effects": { "bonds": { "secretary": 12 }, "exp": { "policy": 12 } },
              "flags": ["sec_teach"],
              "next": "c3",
              "risk": {
                "ability": "政策",
                "threshold": 50,
                "fail_result": "議論が空回りし、互いの忙しさだけが募った。",
                "fail_effects": { "bonds": { "secretary": -5 }, "stamina": -10 },
                "fail_next": "c3"
              }
            },
            {
              "label": "今は離れられては困ると引き留める",
              "result": "{secretary}は表情を固くし、「承知しました」と答えた。",
              "effects": { "bonds": { "secretary": -12 }, "relations": { "secretary": -5 } },
              "flags": ["sec_hold"],
              "next": "c3"
            }
          ]
        },
        {
          "id": "c3",
          "bg": "campaign",
          "after_months": [4, 9],
          "lines": [
            { "speaker": "narrator", "text": "大口の支援団体との調整トラブルが重なり、事務所は連日火の車になっていた。" },
            { "speaker": "other", "name": "支援者", "face": "angry", "text": "日程も要望もめちゃくちゃじゃないか！　秘書の管理はどうなっているんだ！" },
            { "speaker": "secretary", "face": "sad", "text": "私の手配ミスです。自分の家のことで気が散っていたのかもしれません……。" },
            { "speaker": "self", "face": "serious", "text": "（ここで秘書一人に責任を押し付けるわけにはいかない）" },
            { "speaker": "narrator", "text": "ピリピリした空気の事務所で、どう動くかが問われている。" }
          ],
          "choices": [
            {
              "label": "自分も頭を下げ、負担を分け合う",
              "result": "誠意が伝わり、支援者も矛を収めてくれた。",
              "effects": { "bonds": { "secretary": 15 }, "relations": { "supporters": 5 } },
              "flags": ["sec_share"],
              "next": "c4",
              "risk": {
                "ability": "調整",
                "threshold": 55,
                "fail_result": "収拾に手間取り、徹夜で対応する羽目になった。",
                "fail_effects": { "stamina": -15, "relations": { "supporters": -3 } },
                "fail_next": "c4"
              }
            },
            {
              "label": "私費を投じて臨時の手伝いを雇う",
              "result": "人手が増えて事務所が落ち着きを取り戻した。",
              "effects": { "money": -40, "bonds": { "secretary": 10 }, "relations": { "secretary": 5 } },
              "next": "c4"
            },
            {
              "label": "プロなら自力で立て直せと突き放す",
              "result": "トラブルは片付いたが、事務所に冷たい空気が残った。",
              "effects": { "bonds": { "secretary": -18 }, "relations": { "secretary": -8 } },
              "flags": ["sec_strict"],
              "next": "c4"
            }
          ]
        },
        {
          "id": "c4",
          "bg": "station",
          "after_months": [3, 6],
          "lines": [
            { "speaker": "narrator", "text": "季節が巡り、朝の駅頭前の少し落ち着いた時間。{secretary}が改まって向き直った。" },
            { "speaker": "secretary", "face": "normal", "text": "親のケアの体制も整い、自分の気持ちにも整理がつきました。" },
            { "speaker": "secretary", "face": "smile", "text": "自分の選挙への挑戦は、あなたを日本の真ん中へ送り出してからにすると決めました。" },
            { "speaker": "self", "face": "normal", "text": "そこまで背負わせるつもりはない。だが、その覚悟はありがたく受け取るよ。" },
            { "speaker": "narrator", "text": "長い旅を共にするパートナーの言葉を胸に、街へ踏み出す。" }
          ],
          "choices": [
            {
              "label": "その日まで、最高の相棒でいよう",
              "result": "{secretary}は力強く笑い、拡声器を差し出した。",
              "effects": { "bonds": { "secretary": 15 }, "mood": 1 },
              "if_flags": ["sec_dream"],
              "next": "end_partner"
            },
            {
              "label": "家族のこともいつでも頼ってくれ",
              "result": "{secretary}は深く一礼し、「ありがとうございます」と微笑んだ。",
              "effects": { "bonds": { "secretary": 15 }, "relations": { "secretary": 8 } },
              "if_flags": ["sec_care"],
              "next": "end_gratitude"
            },
            {
              "label": "これからもプロとして厳しく頼む",
              "result": "{secretary}は表情を引き締め、「承知しました」と答えた。",
              "effects": { "exp": { "election": 10 } },
              "next": "end_business"
            }
          ]
        }
      ],
      "endings": [
        {
          "id": "end_partner",
          "title": "志を共にする片腕",
          "text": "互いの夢を尊重し合い、{secretary}は誰よりも頼もしい生涯の相棒として支え続けた。",
          "effects": {
            "bond_state": { "secretary": "盟友" },
            "relations": { "secretary": 10 },
            "skills_add": ["dandori"]
          }
        },
        {
          "id": "end_gratitude",
          "title": "家族ぐるみの恩義",
          "text": "苦しい時に家庭の事情まで気遣ったことで、{secretary}との間に深い恩義が結ばれた。",
          "effects": {
            "bond_state": { "secretary": "恩人" },
            "relations": { "secretary": 8 },
            "abilities": { "組織": 1 }
          }
        },
        {
          "id": "end_business",
          "title": "割り切った距離",
          "text": "感情を交えない主従の線引きは徹底されたが、心の奥にはわずかな壁が残った。",
          "effects": {
            "bond_state": { "secretary": "不信" },
            "exp": { "election": 12 }
          }
        }
      ]
    },
    {
      "id": "local_rebuilding",
      "title": "濁流のあとに",
      "summary": "大規模水害に襲われた地元で、復興のあり方を巡って割れる住民の意見と国の予算の壁に挑む物語。",
      "cast": ["secretary", "other"],
      "start": {
        "trigger": "monthly",
        "status": ["議員", "浪人"],
        "jiban_min": 1
      },
      "chapters": [
        {
          "id": "c1",
          "bg": "disaster",
          "after_months": [2, 6],
          "lines": [
            { "speaker": "narrator", "text": "記録的な豪雨が{pref}を襲い、{district}の一部でも道路が冠水し避難所が開かれた。" },
            { "speaker": "other", "name": "被災住民", "face": "angry", "text": "政治家は選挙の時だけ頭を下げて、肝心な防災工事を後回しにしてきたんじゃないか！" },
            { "speaker": "secretary", "face": "sad", "text": "泥だらけの現場で、皆さんかなり気が立っています。落ち着いて聞きましょう。" },
            { "speaker": "self", "face": "serious", "text": "今は言い訳はいらない。何が足りていないのか、一つ残らず拾い上げる時だ。" },
            { "speaker": "narrator", "text": "降り続く雨の中、泥水を踏んで公民館へ向かった。" }
          ],
          "choices": [
            {
              "label": "住民の怒りを受け止め要望をメモ",
              "result": "朝まで避難所を回り、切実なリストをまとめた。",
              "effects": { "stamina": -15, "relations": { "supporters": 8 }, "jiban_progress": 15 },
              "flags": ["local_listen"],
              "next": "c2"
            },
            {
              "label": "即座に省庁へ掛け合い物資を呼ぶ",
              "result": "素早い手配が実り、緊急の支援物資が届いた。",
              "effects": { "exp": { "network": 12 }, "jiban_progress": 20 },
              "flags": ["local_fast"],
              "next": "c2",
              "risk": {
                "ability": "調整",
                "threshold": 55,
                "fail_result": "縦割り行政に阻まれ、手続きに手間取った。",
                "fail_effects": { "stamina": -10, "relations": { "supporters": -3 } },
                "fail_next": "c2"
              }
            }
          ]
        },
        {
          "id": "c2",
          "bg": "hall",
          "after_months": [3, 6],
          "lines": [
            { "speaker": "narrator", "text": "応急復旧が終わり、今後の復興計画を巡る住民会議で二つの意見が激しくぶつかった。" },
            { "speaker": "other", "name": "商店会長", "face": "serious", "text": "代々続く商店街を移すわけにはいかん。堤防をかさ上げして、この場所で再建したい。" },
            { "speaker": "other", "name": "子育て世代の親", "face": "sad", "text": "また同じ浸水が起きると思うと怖いです。補助を出して安全な高台へ移転させてください。" },
            { "speaker": "self", "face": "serious", "text": "暮らしの誇りか、未来の安全か。どちらの言い分も間違っていないからこそ難しい。" },
            { "speaker": "narrator", "text": "地域の代表者たちの視線が、国とのパイプ役であるこちらに集まる。" }
          ],
          "choices": [
            {
              "label": "今の街並みを守る現地再建案を推す",
              "result": "商店街から歓迎されたが、若手住民には不安も残った。",
              "effects": { "relations": { "supporters": 5, "kengi": 3 } },
              "flags": ["local_stay"],
              "next": "c3"
            },
            {
              "label": "安全最優先で高台移転を説得する",
              "result": "将来の被害を防ぐ論理が通り、計画がまとまった。",
              "effects": { "exp": { "policy": 15 }, "abilities": { "政策": 1 } },
              "flags": ["local_move"],
              "next": "c3",
              "risk": {
                "ability": "弁舌",
                "threshold": 60,
                "fail_result": "古里を奪う気かと反発を受け、会議が紛糾した。",
                "fail_effects": { "relations": { "supporters": -8 } },
                "fail_next": "c3"
              }
            },
            {
              "label": "居住は高台、商業は防災整備を提案",
              "result": "折衷案に双方が歩み寄り、議論が前進した。",
              "effects": { "exp": { "policy": 10 }, "stamina": -10 },
              "flags": ["local_hybrid"],
              "next": "c3"
            }
          ]
        },
        {
          "id": "c3",
          "bg": "diet",
          "after_months": [4, 8],
          "conditions": { "status": ["議員"] },
          "fallback": "end_lost_seat",
          "lines": [
            { "speaker": "narrator", "text": "国会の委員会。住民合意をもとに{district}への特例復興予算を求めたが、政府の壁は厚い。" },
            { "speaker": "other", "name": "省庁幹部", "face": "normal", "text": "一地域だけ特例を認めれば、全国の被災地との公平性が保てません。通常予算の範囲内で。" },
            { "speaker": "self", "face": "angry", "text": "机上の公平論で、今も仮設住宅で震えている人の明日が救えるというのですか！" },
            { "speaker": "secretary", "face": "serious", "text": "（傍聴席には地元の県議や代表者も見えています。ここが正念場です！）" },
            { "speaker": "narrator", "text": "予算を勝ち取るための最後の攻勢をかける。" }
          ],
          "choices": [
            {
              "label": "現場の写真を示し特例予算を迫る",
              "result": "迫真の質疑がニュースで報じられ、政府が譲歩した。",
              "effects": { "relations": { "press": 8, "supporters": 10 }, "jiban_progress": 25 },
              "flags": ["local_budget"],
              "next": "c4",
              "risk": {
                "ability": "弁舌",
                "threshold": 60,
                "fail_result": "感情論と受け流され、特例枠は見送られた。",
                "fail_effects": { "relations": { "party": -5 }, "mood": -1 },
                "fail_next": "c4"
              }
            },
            {
              "label": "近隣区の議員と組み共同要望を出す",
              "result": "広域連携の枠組みで、粘り強く予算を確保した。",
              "effects": { "exp": { "network": 15 }, "relations": { "kengi": 8 }, "jiban_progress": 15 },
              "flags": ["local_coalition"],
              "next": "c4"
            }
          ]
        },
        {
          "id": "c4",
          "bg": "street",
          "after_months": [6, 12],
          "conditions": { "status": ["議員", "浪人"] },
          "fallback": "end_lost_seat",
          "lines": [
            { "speaker": "narrator", "text": "災害から長い月日が流れ、新しい防災施設と活気を取り戻した商店街で式典が開かれた。" },
            { "speaker": "other", "name": "町内会長", "face": "smile", "text": "あの時、あんたが泥だらけで話を聞いてくれたこと、みんな忘れちゃおらんよ。" },
            { "speaker": "self", "face": "smile", "text": "地域の皆さんの底力があってこそです。まだ課題はありますが、一歩前へ進みましたね。" },
            { "speaker": "secretary", "face": "smile", "text": "この景色が見られて、本当に良かったです。" },
            { "speaker": "narrator", "text": "復興の明かりを前に、改めてこの街と歩む決意を固める。" }
          ],
          "choices": [
            {
              "label": "笑顔の街を胸に、次の防災へ動く",
              "result": "住民たちの万雷の拍手が、広場に響き渡った。",
              "effects": { "jiban_progress": 20, "mood": 1 },
              "if_flags": ["local_budget"],
              "next": "end_rebuilt"
            },
            {
              "label": "支えてくれた全ての人に礼を述べる",
              "result": "県議や住民との絆が、盤石な力へと変わった。",
              "effects": { "relations": { "kengi": 8 }, "jiban_progress": 15 },
              "if_flags": ["local_coalition"],
              "next": "end_rebuilt"
            },
            {
              "label": "まだ道半ばだと気を引き締める",
              "result": "厳しい表情のまま頷き、さらなる防災を誓った。",
              "effects": { "exp": { "policy": 12 } },
              "next": "end_ongoing"
            }
          ]
        }
      ],
      "endings": [
        {
          "id": "end_rebuilt",
          "title": "復興の灯をともす",
          "text": "泥に塗れて奔走した日々が実を結び、地元の深い信頼と現場の声を聴く力を得た。",
          "effects": {
            "jiban_progress": 35,
            "relations": { "supporters": 10, "kengi": 8 },
            "skills_add": ["genba_no_koe"]
          }
        },
        {
          "id": "end_ongoing",
          "title": "道半ばの誓い",
          "text": "完全な復興にはまだ遠いことを胸に刻み、防災政策の専門家として歩みを続けた。",
          "effects": {
            "abilities": { "政策": 1, "組織": 1 },
            "vote_bonus": 2
          }
        },
        {
          "id": "end_lost_seat",
          "title": "議席なき無力",
          "text": "国会の議席を失っていたため、復興予算の正念場で十分な力を発揮できなかった。",
          "effects": { "mood": -1, "exp": { "election": 10 } }
        }
      ]
    },
    {
      "id": "the_crossroad_vote",
      "title": "分水嶺の一票",
      "summary": "党の方針である重要法案が地元の基幹産業に打撃を与える事態となり、党議拘束と地元の板挟みに苦悩する。",
      "cast": ["senpai", "secretary", "other"],
      "start": {
        "trigger": "monthly",
        "status": ["議員"],
        "terms_min": 1,
        "relations": { "party": 40 }
      },
      "chapters": [
        {
          "id": "c1",
          "bg": "party_hq",
          "after_months": [2, 6],
          "conditions": { "status": ["議員"] },
          "fallback": "end_bygone",
          "lines": [
            { "speaker": "narrator", "text": "{party}の重要会議で、国の長期財政や規制を見直す大型法案が了承された。" },
            { "speaker": "senpai", "face": "serious", "text": "異論はあるかもしれんが、執行部一任だ。採決では党議拘束をかける。全員賛成しろ。" },
            { "speaker": "self", "face": "surprised", "text": "しかし、この基準がそのまま通れば{district}の地元産業は立ち行かなくなります！" },
            { "speaker": "senpai", "face": "normal", "text": "お前のところだけ特別扱いはできん。大局を見るのも国会議員の仕事だぞ。" },
            { "speaker": "narrator", "text": "党の方針と地元の痛み。重い資料を抱えて事務所へ戻った。" }
          ],
          "choices": [
            {
              "label": "党の会議で異議を唱え続ける",
              "result": "疎まれながらも、地元の窮状を訴え続けた。",
              "effects": { "relations": { "party": -5, "supporters": 5 } },
              "flags": ["revolt_speak"],
              "next": "c2"
            },
            {
              "label": "執行部と水面下で修正交渉をする",
              "result": "厳しい条件付きながら、経過措置の検討を引き出した。",
              "effects": { "exp": { "policy": 12 }, "relations": { "party": 3 } },
              "flags": ["revolt_nego"],
              "next": "c2",
              "risk": {
                "ability": "調整",
                "threshold": 55,
                "fail_result": "門前払いに終わり、全く相手にされなかった。",
                "fail_effects": { "relations": { "party": -5 }, "stamina": -8 },
                "fail_next": "c2"
              }
            }
          ]
        },
        {
          "id": "c2",
          "bg": "street",
          "after_months": [2, 4],
          "conditions": { "status": ["議員"] },
          "fallback": "end_bygone",
          "lines": [
            { "speaker": "narrator", "text": "週末の地元。商店街の入り口に、地域の商工業者や働き手たちが不安げな顔で集まっていた。" },
            { "speaker": "other", "name": "組合代表", "face": "angry", "text": "あんた、まさか東京の偉いさんに言われるまま賛成ボタンを押すつもりじゃないだろうな！" },
            { "speaker": "other", "name": "商店街の店主", "face": "sad", "text": "ここで工場や店が潰れたら、この町の灯りが消えてしまいます。助けてください。" },
            { "speaker": "secretary", "face": "serious", "text": "ここで曖昧な返事をすれば、後援会の離反が起きかねません……。" },
            { "speaker": "self", "face": "serious", "text": "だが、軽々に造反を約束すれば党内での居場所を失う。" },
            { "speaker": "narrator", "text": "真っ直ぐな地元住民の視線に、答えを迫られた。" }
          ],
          "choices": [
            {
              "label": "地元を守るため反対すると誓う",
              "result": "大きな歓声が上がったが、背中に重い十字架を背負った。",
              "effects": { "relations": { "supporters": 10, "kengi": 5 } },
              "flags": ["revolt_promise"],
              "next": "c3"
            },
            {
              "label": "構造改革の必要性を誠実に説明する",
              "result": "納得は完全でないが、真剣な姿勢は理解された。",
              "effects": { "abilities": { "弁舌": 1 }, "exp": { "policy": 10 } },
              "flags": ["revolt_persuade"],
              "next": "c3",
              "risk": {
                "ability": "弁舌",
                "threshold": 60,
                "fail_result": "「冷たい政治家だ」とヤジが飛び、場が荒れた。",
                "fail_effects": { "relations": { "supporters": -10 } },
                "fail_next": "c3"
              }
            },
            {
              "label": "救済策の確約を取るまで動くと答える",
              "result": "住民たちは期待と不安の入り混じった顔で頷いた。",
              "effects": { "relations": { "supporters": 4 }, "stamina": -10 },
              "flags": ["revolt_middle"],
              "next": "c3"
            }
          ]
        },
        {
          "id": "c3",
          "bg": "ryotei",
          "after_months": [1, 3],
          "conditions": { "status": ["議員"] },
          "fallback": "end_bygone",
          "lines": [
            { "speaker": "narrator", "text": "採決の前夜。料亭の個室に{senpai}から呼び出され、冷え切った茶を前に向き合う。" },
            { "speaker": "senpai", "face": "angry", "text": "地元での動きは耳に入っている。明日の本会議で造反すれば、役職も公認も危うくなるぞ。" },
            { "speaker": "self", "face": "serious", "text": "それでも、私を議場へ送り出してくれたのは{district}の有権者です。" },
            { "speaker": "senpai", "face": "normal", "text": "青いな。だが政治家は自分の責任を取れるなら、好きに選べ。お前の覚悟を見せろ。" },
            { "speaker": "narrator", "text": "運命の一票を投じる朝が、もうそこまで迫っていた。" }
          ],
          "choices": [
            {
              "label": "処分を覚悟で造反の一票を投じる",
              "result": "本会議場がどよめく中、己の信念の一票を投じた。",
              "effects": { "relations": { "party": -10, "supporters": 10 } },
              "flags": ["revolt_voted_no"],
              "next": "c4"
            },
            {
              "label": "付帯決議と地元補助を条件に賛成へ",
              "result": "党幹部とのギリギリの交渉の末、救済予算をもぎ取った。",
              "effects": { "exp": { "network": 18 }, "relations": { "party": 5, "supporters": 5 } },
              "flags": ["revolt_deal"],
              "next": "c4",
              "risk": {
                "ability": "調整",
                "threshold": 65,
                "fail_result": "交渉が決裂し、ただ党に押し切られた形になった。",
                "fail_effects": { "relations": { "party": -3, "supporters": -8 } },
                "fail_next": "c4"
              }
            },
            {
              "label": "苦渋の末、党方針に従い賛成する",
              "result": "党の規律は守ったが、地元への説明という重い宿題が残った。",
              "effects": { "relations": { "party": 10, "supporters": -10 }, "mood": -1 },
              "flags": ["revolt_obeyed"],
              "next": "c4"
            }
          ]
        },
        {
          "id": "c4",
          "bg": "diet",
          "after_months": [2, 4],
          "conditions": { "status": ["議員"] },
          "fallback": "end_bygone",
          "lines": [
            { "speaker": "narrator", "text": "採決の余波も落ち着いた国会。議事堂の廊下で、自分の取った道の結果を見つめ直す。" },
            { "speaker": "secretary", "face": "normal", "text": "党本部からの反応も、地元の空気も、少しずつ新しい段階に移ってきています。" },
            { "speaker": "self", "face": "normal", "text": "国益と地元の声。その二つを繋ぐ答えは、今も探し続けている。" },
            { "speaker": "senpai", "face": "normal", "text": "今回の件で、お前の器が一つ試されたな。さあ、次の仕事はどうする。" },
            { "speaker": "narrator", "text": "下した決断の重みを背負い、議員としての次の一歩を選ぶ。" }
          ],
          "choices": [
            {
              "label": "孤立を恐れず地元の代弁者を貫く",
              "result": "反骨の議員として地元で不動の支持を得た。",
              "effects": { "jiban_progress": 15, "vote_bonus": 1 },
              "if_flags": ["revolt_voted_no"],
              "next": "end_rebel"
            },
            {
              "label": "現実解を掴む調整役として歩む",
              "result": "党内でも一目置かれる実務家として歩み始めた。",
              "effects": { "abilities": { "調整": 1 }, "exp": { "policy": 10 } },
              "if_flags": ["revolt_deal"],
              "next": "end_broker"
            },
            {
              "label": "この経験を糧に、力を蓄え直す",
              "result": "苦い教訓も糧にして、次の勝負を見据えた。",
              "effects": { "relations": { "party": 5 }, "exp": { "network": 12 } },
              "next": "end_bygone"
            }
          ]
        }
      ],
      "endings": [
        {
          "id": "end_rebel",
          "title": "地元の防波堤",
          "text": "党の処分リスクを恐れず地元を守り抜いた姿は語り草となり、強固なドブ板の絆となった。",
          "effects": {
            "jiban_progress": 30,
            "vote_bonus": 2,
            "relations": { "supporters": 10, "party": -6 },
            "skills_add": ["dobuita"]
          }
        },
        {
          "id": "end_broker",
          "title": "現実の調整者",
          "text": "理想と現実の間で泥臭く条件を引き出した手腕により、党と地元の双方から頼られる存在になった。",
          "effects": {
            "abilities": { "調整": 2 },
            "relations": { "party": 6, "supporters": 6 },
            "exp": { "policy": 15 }
          }
        },
        {
          "id": "end_bygone",
          "title": "政治の現実を知りて",
          "text": "党議拘束の重みと地元の悲哀を味わい、政治家として一回り厚みを増して歩み続けた。",
          "effects": { "relations": { "party": 6 }, "exp": { "policy": 10 } }
        }
      ]
    }
  ],
  "rival_types": [
    {
      "id": "local_veteran",
      "name": "地元一筋の古株",
      "description": "地域の冠婚葬祭に必ず顔を出し、長年の義理人情と町内会の絆で票を固める地元の顔役。",
      "fits": "当選回数が多く、組織と地盤が強い議員",
      "catchphrase": "この町のことは、この町の暮らしを知る者が決める。",
      "lines": {
        "election_win": "町内を一軒一軒歩いた汗は裏切らん。それがこの選挙区の答えだ。",
        "election_lose": "見事な戦いだった。若い力がここまで地元を動かすとはな。",
        "close_race": "最後の最後まで読めん勝負だったな。お前の粘りには舌を巻くよ。",
        "好敵手": "お前さんが相手なら、俺も古いやり方に甘えてはいられんな。",
        "因縁": "この土地の看板だけは、誰にも渡すわけにはいかんのだ。",
        "盟友": "党は違えど、この町の未来を託せるのはお前さんだけだ。",
        "不信": "口先ばかりの人間は、いずれこの土地の人に愛想を尽かされるぞ。"
      }
    },
    {
      "id": "former_bureaucrat",
      "name": "元官僚の政策通",
      "description": "中央省庁で制度設計を担った実務エリート。冷静なデータ分析と緻密な法案作成で信頼を集める。",
      "fits": "政策と調整が高く、官僚出身や理論派の議員",
      "catchphrase": "感情論ではなく、持続可能な制度で未来を設計する。",
      "lines": {
        "election_win": "有権者は短期的な人気より、現実的な政策の積み上げを選びました。",
        "election_lose": "正しい処方箋を書くだけでは、人の心は動かないということですか。",
        "close_race": "統計上の誤差に等しい接戦でした。次はさらに数字を詰めてきます。",
        "好敵手": "あなたの現場感覚と私の制度論がぶつかることで、議論が深まりますね。",
        "因縁": "誤った政策で国を傾けるわけにはいかない。絶対に退きませんよ。",
        "盟友": "立場が違っても、あなたの誠実なデータへの向き合い方は尊敬しています。",
        "不信": "根拠のない批判を並べるやり方には、どうしても納得がいきません。"
      }
    },
    {
      "id": "media_orator",
      "name": "街頭の弁論家",
      "description": "鋭い弁舌と発信力で無党派層の心を掴む論客。メディアや駅前演説で圧倒的な熱狂を生む。",
      "fits": "弁舌と知名度が高く、発信力に優れた劇場型の議員",
      "catchphrase": "閉ざされた会議室より、駅前の一人の心に政治を届ける。",
      "lines": {
        "election_win": "聞こえましたか。変化を望む有権者の声が、この街に溢れています！",
        "election_lose": "言葉が足りなかったのか、届き切らなかったのか。悔しいですね。",
        "close_race": "まるで決勝戦のような熱気でしたね。あなたの演説も悪くなかった。",
        "好敵手": "同じマイクを握る者として、あなたとの公開討論が一番燃えますよ。",
        "因縁": "古い体質を象徴するあなたに、この街の未来は任せられません。",
        "盟友": "言葉の重みを分かっているあなただから、政党を超えて話が通じる。",
        "不信": "耳触りのいい言葉で人を欺くような真似だけは、私は認めません。"
      }
    },
    {
      "id": "former_mayor",
      "name": "元首長の実務派",
      "description": "地方自治体の長として予算編成と災害対応を率いた実績派。理想より今できる解決を重んじる。",
      "fits": "中堅からベテランで、組織と調整が高い元首長",
      "catchphrase": "評論家はいらない。必要なのは明日の現場を動かす実務だ。",
      "lines": {
        "election_win": "首長時代に培った現場主義が、国政の舞台でも認められました。",
        "election_lose": "国政の風というものは、自治体の理屈とはまた違うものですね。",
        "close_race": "一票の重さを誰より知っているつもりだが、ここまで競るとは。",
        "好敵手": "机上の空論を語らないあなたとは、良い仕事ができそうだと感じますよ。",
        "因縁": "現場を知らない者に、地域の予算やインフラをいじられては困るのだ。",
        "盟友": "国の制度と地方の現実を繋ぐため、党が違っても知恵を貸し合おう。",
        "不信": "自分の都合で現場を振り回す政治家ほど、厄介なものはありませんね。"
      }
    },
    {
      "id": "grassroots_activist",
      "name": "草の根の挑戦者",
      "description": "福祉や市民活動から飛び出した熱血漢。大きな組織を持たず、自転車とボランティア仲間と走る。",
      "fits": "年齢が若く当選回数が少ない新人や、弁舌が高い議員",
      "catchphrase": "声なき人の小さな叫びを、真っ直ぐ議場へ運びたい。",
      "lines": {
        "election_win": "大きな後ろ盾がなくても、市民の力でここまで来られるんです！",
        "election_lose": "組織の壁は厚かった……でも、私たちの訴えは絶対に無駄にしません。",
        "close_race": "あと一歩まで迫れた！　次は必ずこの街の常識を変えてみせます。",
        "好敵手": "立場は違っても、あなたの街を歩く姿にはいつも刺激を受けています。",
        "因縁": "既得権を守るだけの政治に、私は何度でも立ち向かいますから！",
        "盟友": "違う党からでも、困っている人を救いたい思いは同じだと信じています。",
        "不信": "弱い立場の人の痛みを切り捨てるようなやり方は、決して許しません。"
      }
    },
    {
      "id": "business_leader",
      "name": "経済界のやり手",
      "description": "経営者や経済団体の要職を歴任し、地域経済の再生を掲げて転身。数字とスピード感を武器にする。",
      "fits": "資金と調整が高く、経済界出身の経歴を持つ議員",
      "catchphrase": "雇用と稼ぐ力がなければ、どんな福祉も絵に描いた餅だ。",
      "lines": {
        "election_win": "この国の停滞を破るには、民間の感覚が必要だと認められました。",
        "election_lose": "企業経営と選挙は違うな。合理性だけでは人は動かんということか。",
        "close_race": "実に際どい勝負だった。あなたの粘り強さは経営者としても見事だ。",
        "好敵手": "あなたのような手強い相手と競えるなら、挑み甲斐がある選挙区だ。",
        "因縁": "経済を止めるような無責任なばら撒きには、徹底して反対させてもらう。",
        "盟友": "損得を超えて地域の未来を語れるとは。一度じっくり杯を交わしたいな。",
        "不信": "約束と数字をごまかす相手と、まともな交渉などできるはずがない。"
      }
    },
    {
      "id": "second_generation",
      "name": "新風を模索する二世",
      "description": "親から受け継いだ後援会の重圧を背負いつつ、自分なりの改革の色を出そうと葛藤する若手・中堅。",
      "fits": "知名度と地盤が高く、年齢が若い世襲議員",
      "catchphrase": "親の看板と言われても構わない。結果で自分の名を刻むだけだ。",
      "lines": {
        "election_win": "先代の看板だけでなく、私自身の訴えに託してくれた一票だと信じます。",
        "election_lose": "看板の重みに甘えていたのかもしれない。一から自分の足で歩き直します。",
        "close_race": "あなたの自力の強さには、正直羨ましさすら感じましたよ。",
        "好敵手": "親の背中しか知らなかった私に、対等なライバルとは何かを教えてくれた。",
        "因縁": "二世だからと色眼鏡で見るなら、実力で黙らせてみせるだけです。",
        "盟友": "家の名前ではなく、一人の政治家として向き合ってくれたのはあなただけだ。",
        "不信": "人の出自ばかりを攻撃材料にするのは、正直見損ないました。"
      }
    },
    {
      "id": "quiet_artisan",
      "name": "地道な調整型",
      "description": "派手さはないが委員会質疑や地方議員との連絡を黙々とこなし、着実に実績を積む職人肌。",
      "fits": "調整と組織が高く、知名度は控えめだが堅実な議員",
      "catchphrase": "目立たなくていい。法律の一行を直し、現場の困りごとを一つ減らす。",
      "lines": {
        "election_win": "派手なパフォーマンスはできんが、地道な仕事を見てくれる人がいたな。",
        "election_lose": "やはりもう少し、外へ向けて伝える工夫も必要だったか……。",
        "close_race": "互いの積み上げがそのまま数字に出た。嘘のない接戦だったよ。",
        "好敵手": "お前さんの見えないところでの努力、同じ玄人としてよく分かっているぞ。",
        "因縁": "耳障りのいい言葉ばかりに地元を奪われるわけにはいかんのだ。",
        "盟友": "派閥や党を超えて実務の話ができる。お前さんがいると心強いよ。",
        "不信": "約束の裏で別の顔を見せるやり方は、俺の性には合わんな。"
      }
    }
  ],
  "bond_states": [
    {
      "state": "好敵手",
      "effects": [
        "同じ選挙区にライバルがいる間、毎月の「選挙」「発信」経験点に少量のボーナスが加算される",
        "ライバルと関わる場面での能力判定（弁舌・政策）のしきい値がわずかに下がる",
        "合同討論や地域行事での切磋琢磨を描く前向きな日常出来事が起きやすくなる"
      ],
      "reason": "互いに実力を認め合う良き競争相手がいることで、日々の鍛錬と発信の質が高まるから。"
    },
    {
      "state": "因縁",
      "effects": [
        "ライバルと同じ区で戦う総選挙で、陣営の危機感から基礎得票にわずかなプラス補正がつく",
        "毎月の「選挙」経験点が増える一方、相手陣営や報道との関係が揺らぐ激しい出来事が起きやすくなる"
      ],
      "reason": "絶対に負けられないという強烈な対抗心が後援会を引き締める一方、対立が過熱しやすくなるから。"
    },
    {
      "state": "盟友",
      "effects": [
        "党首選などの党内投票で、同期や盟友関係にある人物が自分へ票や支持を投じてくれる",
        "党や秘書、報道など関連する集団との関係が毎月少しずつ安定・上昇しやすくなる",
        "物語や日常出来事における「調整」の能力判定しきい値が下がり、困難な交渉が通りやすくなる"
      ],
      "reason": "損得を超えた深い信頼が、党内の投票行動やいざという時の強力な協力体制に直結するから。"
    },
    {
      "state": "師弟",
      "effects": [
        "毎月の活動で得られる「人脈」「政策」経験点に継続的なボーナスが加わる",
        "党首選や人事の局面で、先輩およびその人脈からの票や推薦を得やすくなる",
        "党幹部や県議との集団関係が下がりにくくなり、継承や助言に関する出来事が起きやすくなる"
      ],
      "reason": "歴戦の重鎮から直接薫陶と人脈の後ろ盾を受けることで、成長速度と党内での立場が強まるから。"
    },
    {
      "state": "恩人",
      "effects": [
        "党首選や総選挙の勝負どころで、相手が自分のために積極的に票や応援を集めてくれる",
        "資金難や支持低迷などのピンチに陥った際、手を差し伸べてくれる救済出来事が起きやすくなる",
        "毎月の「人脈」経験点や秘書の関係値に好影響が続く"
      ],
      "reason": "苦境を救った記憶が、損得を超えた無条件の支援や恩返しとして返ってくるから。"
    },
    {
      "state": "不信",
      "effects": [
        "党首選で相手やその周囲が対立陣営へ回り、票や協力が得られなくなる",
        "人物との協力が絡む能力判定（調整など）のしきい値が厳しくなる",
        "党・秘書・後援会などの集団関係ややる気が下がるネガティブな出来事が起きやすくなる"
      ],
      "reason": "一度生まれたわだかまりが猜疑心を呼び、ここぞという局面での協力や調整の足かせになるから。"
    }
  ]
}
```