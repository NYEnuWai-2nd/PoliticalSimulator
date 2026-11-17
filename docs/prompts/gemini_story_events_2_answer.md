```json
{
  "stories": [
    {
      "id": "veteran_young_revolt",
      "title": "若手の改革要求",
      "summary": "若手議員たちが党内の年功序列の廃止を求めて署名活動を始めた。党の幹部と若手の板挟みになり、対応を迫られる。",
      "cast": ["secretary"],
      "start": { "trigger": "monthly", "status": ["議員"], "terms_min": 5 },
      "chapters": [
        {
          "id": "c1",
          "bg": "diet",
          "after_months": [1, 3],
          "lines": [
            { "speaker": "narrator", "text": "党の幹部から議員会館の会議室に呼ばれ、若手議員の動きを抑えるよう頼まれた。" },
            { "speaker": "other", "name": "党の幹部", "face": "serious", "text": "若手たちが政策決定の仕組みを変えろと署名を集めています。あなたが説得してください。" },
            { "speaker": "self", "face": "normal", "text": "分かりました。まず先方に話を聞いてみます。" },
            { "speaker": "narrator", "text": "廊下に出ると、若手グループの中心にいる議員が真っ直ぐこちらに歩いてきた。" },
            { "speaker": "other", "name": "若手議員", "face": "serious", "text": "先生、今のままでは若い世代の意見が通りません。私たちの提案書を読んでください。" }
          ],
          "choices": [
            {
              "label": "若手の提案を詳しく聞く",
              "result": "若手議員は安堵した表情で、具体的な改革案の冊子を差し出した。",
              "effects": { "exp": { "policy": 10, "network": 8 }, "relations": { "party": -3 } },
              "flags": ["revolt_listen"],
              "next": "c2_listen"
            },
            {
              "label": "党の規則を守るよう諭す",
              "result": "若手議員は不満そうな顔のまま、書類を抱えて引き下がった。",
              "effects": { "relations": { "party": 6 }, "exp": { "network": 6 } },
              "flags": ["revolt_suppress"],
              "next": "c2_suppress"
            },
            {
              "label": "双方の仲介役を買って出る",
              "result": "幹部と若手の双方から、話し合いの場を設ける了解を取り付けた。",
              "effects": { "exp": { "network": 14 }, "abilities": { "調整": 1 } },
              "flags": ["revolt_bridge"],
              "next": "c2_listen",
              "risk": {
                "ability": "調整",
                "threshold": 55,
                "fail_result": "どちらの側からも警戒され、板挟みの状態になってしまった。",
                "fail_effects": { "relations": { "party": -5 }, "stamina": -10 },
                "fail_next": "c2_suppress"
              }
            }
          ]
        },
        {
          "id": "c2_listen",
          "bg": "party_hq",
          "after_months": [2, 4],
          "conditions": { "status": ["議員"] },
          "fallback": "end_quiet",
          "lines": [
            { "speaker": "narrator", "text": "若手の政策勉強会に顔を出し、彼らが抱える不満の背景を聞いた。" },
            { "speaker": "other", "name": "若手議員", "face": "sad", "text": "当選回数が少ないというだけで、法案の議論に参加すらできないのです。" },
            { "speaker": "secretary", "face": "normal", "text": "先生も初当選の頃は、党内の古い慣習に悩んでおられましたね。" },
            { "speaker": "self", "face": "serious", "text": "確かにその通りだ。だが、感情的な対立だけでは何も変わらないぞ。" }
          ],
          "choices": [
            {
              "label": "改革案の提出を全面支援する",
              "result": "若手の改革案に賛同を表明したことで、党の幹部から警戒された。",
              "effects": { "relations": { "party": -8, "press": 6 }, "exp": { "policy": 10 } },
              "flags": ["revolt_back"],
              "next": "c3"
            },
            {
              "label": "現実的な修正案を共に作る",
              "result": "党内でも受け入れられやすい妥協点を盛り込んだ案を練り上げた。",
              "effects": { "exp": { "policy": 14 }, "abilities": { "政策": 1 }, "stamina": -8 },
              "flags": ["revolt_revise"],
              "next": "c3"
            }
          ]
        },
        {
          "id": "c2_suppress",
          "bg": "ryotei",
          "after_months": [2, 4],
          "conditions": { "status": ["議員"] },
          "fallback": "end_quiet",
          "lines": [
            { "speaker": "narrator", "text": "数週間後、党の幹部と食事を共にし、若手への対応を話し合った。" },
            { "speaker": "other", "name": "党の幹部", "face": "angry", "text": "署名活動がまだ続いています。中心人物を委員会の役職から外すつもりです。" },
            { "speaker": "self", "face": "serious", "text": "処分まで行えば、かえって反発が広がるのではないでしょうか。" },
            { "speaker": "other", "name": "党の幹部", "face": "serious", "text": "示しがつきません。あなたも責任ある立場として賛成してください。" }
          ],
          "choices": [
            {
              "label": "幹部の処分方針に賛成する",
              "result": "組織の規律を優先し、厳しい対応をとることで同意した。",
              "effects": { "relations": { "party": 8 }, "mood": -1 },
              "flags": ["revolt_punish"],
              "next": "c3"
            },
            {
              "label": "処分を見送るよう強く進言する",
              "result": "厳しい処分は避けるべきだと主張し、幹部に再考を促した。",
              "effects": { "relations": { "party": -6 }, "exp": { "network": 10 } },
              "flags": ["revolt_mercy"],
              "next": "c3"
            }
          ]
        },
        {
          "id": "c3",
          "bg": "diet",
          "after_months": [2, 5],
          "conditions": { "status": ["議員"] },
          "fallback": "end_quiet",
          "lines": [
            { "speaker": "narrator", "text": "党の全体会議が開かれ、若手の処遇と意思決定の改革案が議題に上がった。" },
            { "speaker": "other", "name": "若手議員", "face": "serious", "text": "世代を問わず議論できる場を作ってください。それが党のためです。" },
            { "speaker": "other", "name": "党の幹部", "face": "serious", "text": "混乱を招くだけの無責任な提案は認められない。議論を打ち切るべきだ。" },
            { "speaker": "secretary", "face": "serious", "text": "先生、会議室中の視線がこちらに集まっています。どう発言されますか。" }
          ],
          "choices": [
            {
              "label": "若手の改革案に賛成票を投じる",
              "result": "堂々と賛成の理由を述べ、世代交代を求める声から大きな拍手を得た。",
              "effects": { "relations": { "press": 8, "party": -10 }, "abilities": { "弁舌": 2 } },
              "if_flags": ["revolt_back"],
              "next": "end_reform_leader"
            },
            {
              "label": "双方の折衷案をその場で提案する",
              "result": "会議に若手代表を加える折衷案が受け入れられ、騒動が収まった。",
              "effects": { "exp": { "network": 20 }, "relations": { "party": 10 }, "abilities": { "調整": 2 } },
              "next": "end_mediator",
              "risk": {
                "ability": "調整",
                "threshold": 65,
                "fail_result": "折衷案はどちらの支持も得られず、議論は物別れに終わった。",
                "fail_effects": { "relations": { "party": -6 }, "stamina": -10 },
                "fail_next": "end_isolated"
              }
            },
            {
              "label": "組織の規律と秩序を優先する",
              "result": "党の方針に従い、若手への配慮を求めつつも現行の仕組みを維持した。",
              "effects": { "relations": { "party": 10, "press": -4 }, "abilities": { "組織": 1 } },
              "next": "end_guardian"
            }
          ]
        }
      ],
      "endings": [
        {
          "id": "end_reform_leader",
          "title": "若手改革の推進役",
          "text": "党内の不満を受け止めて改革を主導し、新しい世代の信頼を集めた。",
          "effects": { "skills_add": ["hasshinryoku"], "exp": { "media": 15 } }
        },
        {
          "id": "end_mediator",
          "title": "世代間の調整役",
          "text": "ベテランと若手の対立を収め、党内のまとめ役としての評価を確立した。",
          "effects": { "relations": { "party": 10 }, "exp": { "network": 15 } }
        },
        {
          "id": "end_guardian",
          "title": "組織の重鎮",
          "text": "党内の秩序を守り抜いたことで、党の幹部からの信頼がいっそう厚くなった。",
          "effects": { "relations": { "party": 12 }, "abilities": { "組織": 1 } }
        },
        {
          "id": "end_isolated",
          "title": "意見の対立",
          "text": "双方が納得する形を作れず、党内に気まずい空気が残った。",
          "effects": { "mood": -1 }
        },
        {
          "id": "end_quiet",
          "title": "議論の終了",
          "text": "議席を離れたことで、党内の改革論議に関わる立場を失った。",
          "effects": {}
        }
      ]
    },
    {
      "id": "veteran_local_succession",
      "title": "地元の世代交代",
      "summary": "ベテランとなり地元の支持組織が高齢化する中、古参の後援者と若手県議の対立を解消して地盤の立て直しを図る。",
      "cast": ["secretary"],
      "start": { "trigger": "monthly", "status": ["議員"], "terms_min": 5, "relations": { "kengi": 30 } },
      "chapters": [
        {
          "id": "c1",
          "bg": "office",
          "after_months": [1, 3],
          "lines": [
            { "speaker": "narrator", "text": "地元の事務所で、秘書の{secretary}が最近の選挙区の状況を報告し始めた。" },
            { "speaker": "secretary", "face": "serious", "text": "先生、最近の後援会役員会ですが、若い人の参加が減っています。" },
            { "speaker": "secretary", "face": "normal", "text": "古参の方々と若手の県議との間で、選挙のやり方にも意見の食い違いがあります。" },
            { "speaker": "self", "face": "serious", "text": "このままでは次の世代に繋がらないな。地元の基盤を見直す時期かもしれない。" }
          ],
          "choices": [
            {
              "label": "古参の後援会長を訪ねて話を聞く",
              "result": "長年の苦労話を聞き、世代交代の必要性を丁寧に説明した。",
              "effects": { "jiban_progress": 12, "relations": { "supporters": 5 } },
              "flags": ["local_elder"],
              "next": "c2"
            },
            {
              "label": "若手県議を集めて対策を話し合う",
              "result": "若手県議から、新しい有権者に届ける広報のアイデアが多く出た。",
              "effects": { "relations": { "kengi": 8 }, "exp": { "election": 10 } },
              "flags": ["local_young"],
              "next": "c2"
            }
          ]
        },
        {
          "id": "c2",
          "bg": "hall",
          "after_months": [2, 5],
          "conditions": { "status": ["議員"] },
          "fallback": "end_unfinished",
          "lines": [
            { "speaker": "narrator", "text": "地元の公民館で後援会の役員人事を話し合う場を設けたが、意見が激しく割れた。" },
            { "speaker": "other", "name": "後援会長", "face": "angry", "text": "長年、地元の組織を守ってきたのは我々だ。新参者に看板は渡せん。" },
            { "speaker": "other", "name": "若手県議", "face": "serious", "text": "古いやり方のままでは、新しい住民の票は取れません。体制を変えるべきです。" },
            { "speaker": "self", "face": "serious", "text": "どちらも{district}を思う気持ちは同じはずだ。私の考えを聞いてほしい。" }
          ],
          "choices": [
            {
              "label": "双方の役割を分けた新体制を提案する",
              "result": "顧問と実務担当に役割を分ける案がまとまり、両者が歩み寄った。",
              "effects": { "jiban_progress": 20, "relations": { "supporters": 5, "kengi": 5 } },
              "flags": ["local_pact"],
              "next": "c3",
              "risk": {
                "ability": "調整",
                "threshold": 60,
                "fail_result": "議論は平行線をたどり、双方の不信感が残ってしまった。",
                "fail_effects": { "relations": { "kengi": -5 }, "stamina": -10 },
                "fail_next": "c3"
              }
            },
            {
              "label": "長年の恩義を重視し会長を立てる",
              "result": "会長は満足したが、若手県議たちは落胆して会場を後にした。",
              "effects": { "relations": { "supporters": 8, "kengi": -8 } },
              "flags": ["local_keep"],
              "next": "c3"
            },
            {
              "label": "思い切って若手に役員を任せる",
              "result": "若手県議は張り切ったが、古参の支援者の一部が反発して離れた。",
              "effects": { "relations": { "kengi": 10, "supporters": -8 } },
              "flags": ["local_shift"],
              "next": "c3"
            }
          ]
        },
        {
          "id": "c3",
          "bg": "street",
          "after_months": [3, 6],
          "conditions": { "status": ["議員"] },
          "fallback": "end_unfinished",
          "lines": [
            { "speaker": "narrator", "text": "商店街の大きな行事に、新旧の後援会メンバーと県議たちが顔を揃えた。" },
            { "speaker": "secretary", "face": "smile", "text": "先生、皆さんの前でご挨拶をお願いします。これからの体制を示す機会です。" },
            { "speaker": "other", "name": "地元の商店主", "face": "normal", "text": "先生、これからも{district}がまとまっていけるよう、よろしくお願いしますよ。" },
            { "speaker": "self", "face": "normal", "text": "分かりました。これからの{district}について、私から直接お話しします。" }
          ],
          "choices": [
            {
              "label": "新旧が協力する体制を宣言する",
              "result": "年齢を超えた協力体制が拍手で迎えられ、地元の結束が強まった。",
              "effects": { "jiban_progress": 25, "vote_bonus": 2 },
              "if_flags": ["local_pact"],
              "next": "end_harmony"
            },
            {
              "label": "自ら先頭に立ち地域を一軒ずつ回る",
              "result": "ベテランになっても変わらぬ姿勢を見せ、支援者の信頼を取り戻した。",
              "effects": { "stamina": -15, "jiban_progress": 25, "exp": { "election": 15 } },
              "next": "end_revival",
              "risk": {
                "ability": "組織",
                "threshold": 55,
                "fail_result": "体力が追いつかず挨拶回りが途中で止まり、疲労だけが残った。",
                "fail_effects": { "stamina": -18, "jiban_progress": 10 },
                "fail_next": "end_revival"
              }
            },
            {
              "label": "広報を強化して新しい層に訴える",
              "result": "新しい広報物を通じて、今まで関わりの薄かった住民にも主張が届いた。",
              "effects": { "exp": { "media": 15 }, "abilities": { "知名度": 2 } },
              "next": "end_modern"
            }
          ]
        }
      ],
      "endings": [
        {
          "id": "end_harmony",
          "title": "安定した新体制",
          "text": "新旧の支持者が役割を分け合って協力し、地元基盤が一段と強固になった。",
          "effects": { "skills_add": ["kengi_pipe"], "jiban_progress": 20 }
        },
        {
          "id": "end_revival",
          "title": "地道な活動の継続",
          "text": "自ら現場を歩き回る姿勢を示したことで、地元の結束を再び固めた。",
          "effects": { "skills_add": ["dobuita"], "jiban_progress": 15 }
        },
        {
          "id": "end_modern",
          "title": "開かれた後援会",
          "text": "広報を刷新したことで新しい住民層の関心を集め、知名度がさらに上がった。",
          "effects": { "abilities": { "知名度": 1, "組織": 1 }, "vote_bonus": 1 }
        },
        {
          "id": "end_unfinished",
          "title": "先送りされた課題",
          "text": "議員を離れたことで、地元後援会の体制見直しは中断された。",
          "effects": {}
        }
      ]
    },
    {
      "id": "minister_scandal_coverup",
      "title": "省内のデータ改ざん",
      "summary": "大臣として所管する省庁で過去の補助金データの書き換えが発覚。隠蔽を勧める官僚に対し、説明責任をどう果たすか問われる。",
      "cast": ["secretary"],
      "start": { "trigger": "monthly", "status": ["議員"], "post": ["minister"] },
      "chapters": [
        {
          "id": "c1",
          "bg": "diet",
          "after_months": [1, 3],
          "conditions": { "post": ["minister"] },
          "fallback": "end_left_post",
          "lines": [
            { "speaker": "narrator", "text": "大臣室に事務次官が訪れ、緊張した面持ちで極秘の報告書を机に置いた。" },
            { "speaker": "other", "name": "事務次官", "face": "serious", "text": "大臣、数年前の補助金事業で、担当部署が数値を書き換えていたことが分かりました。" },
            { "speaker": "other", "name": "事務次官", "face": "normal", "text": "公表すれば大臣の責任問題になります。省内で穏便に修正させてください。" },
            { "speaker": "self", "face": "serious", "text": "事実を隠せば、あとでさらに大きな問題になるのではないか。" }
          ],
          "choices": [
            {
              "label": "全資料を提出させ徹底調査を命じる",
              "result": "省内に衝撃が走ったが、大臣としての強い指示で調査チームが動いた。",
              "effects": { "exp": { "policy": 15 }, "approval": -1 },
              "flags": ["min_investigate"],
              "next": "c2"
            },
            {
              "label": "事実確認を終えるまで公表を待つ",
              "result": "省内での調査を優先し、外部への情報公開は慎重に見合わせた。",
              "effects": { "relations": { "party": 4 }, "stamina": -8 },
              "flags": ["min_wait"],
              "next": "c2"
            },
            {
              "label": "外部の専門家による調査会を作る",
              "result": "公平な立場から検証するため、弁護士らを交えた調査会を立ち上げた。",
              "effects": { "money": -30, "exp": { "policy": 15 } },
              "flags": ["min_investigate", "min_third"],
              "next": "c2"
            }
          ]
        },
        {
          "id": "c2",
          "bg": "tv",
          "after_months": [1, 3],
          "conditions": { "post": ["minister"] },
          "fallback": "end_left_post",
          "lines": [
            { "speaker": "narrator", "text": "省内から情報が漏れ、閣議後の記者会見で改ざん疑惑について鋭い質問が飛んだ。" },
            { "speaker": "other", "name": "記者", "face": "serious", "text": "大臣、データを書き換えたのは事実ですか。隠そうとしていたのですか。" },
            { "speaker": "secretary", "face": "serious", "text": "先生、官僚が用意した想定問答では『調査中』とだけ答えることになっています。" },
            { "speaker": "self", "face": "serious", "text": "世論も厳しい目で見ている。ここでどう答えるかが問われているな。" }
          ],
          "choices": [
            {
              "label": "不適切な処理を認め真摯に謝罪する",
              "result": "正直に事実関係を認めて謝罪したことで、記者たちの追及が落ち着いた。",
              "effects": { "relations": { "press": 10 }, "approval": 1 },
              "flags": ["min_honest"],
              "next": "c3",
              "risk": {
                "ability": "弁舌",
                "threshold": 60,
                "fail_result": "説明が要領を得ず、かえって隠蔽の疑念を深めてしまった。",
                "fail_effects": { "approval": -3, "relations": { "press": -6 } },
                "fail_next": "c3"
              }
            },
            {
              "label": "詳細を確認中だと述べて質問をかわす",
              "result": "当たり障りのない回答に終始し、記者団から厳しい批判記事が出た。",
              "effects": { "relations": { "press": -8 }, "approval": -1 },
              "flags": ["min_evade"],
              "next": "c3"
            }
          ]
        },
        {
          "id": "c3",
          "bg": "diet",
          "after_months": [2, 4],
          "conditions": { "post": ["minister"] },
          "fallback": "end_left_post",
          "lines": [
            { "speaker": "narrator", "text": "調査報告書が完成し、担当部署の組織的な隠蔽が明らかになった。" },
            { "speaker": "other", "name": "事務次官", "face": "sad", "text": "大臣、関係者の処分案をまとめました。省内の士気にも関わるため、慎重にお願いします。" },
            { "speaker": "secretary", "face": "serious", "text": "先生、間もなく国会の委員会が始まります。最終的な方針をご決断ください。" },
            { "speaker": "self", "face": "serious", "text": "国民の信頼を取り戻すためには、中途半端な対応は許されない。" }
          ],
          "choices": [
            {
              "label": "全容を公開し再発防止策を誓う",
              "result": "情報をすべて公表し、チェック体制を強化する方針が国会でも評価された。",
              "effects": { "relations": { "press": 10 }, "approval": 2, "abilities": { "政策": 2 } },
              "if_flags": ["min_investigate"],
              "next": "end_reformer"
            },
            {
              "label": "責任を取り報酬返納と幹部処分を決める",
              "result": "自らの報酬を返納し、厳正な処分を下したことで責任の所在を明確にした。",
              "effects": { "money": -50, "relations": { "party": 8 }, "approval": 1 },
              "next": "end_responsible",
              "risk": {
                "ability": "調整",
                "threshold": 55,
                "fail_result": "処分を巡って官僚や党内の反発を抑えきれず、国会答弁が紛糾した。",
                "fail_effects": { "approval": -2, "relations": { "party": -6 } },
                "fail_next": "end_tarnished"
              }
            },
            {
              "label": "省内を守り形式的な処分にとどめる",
              "result": "身内に甘い処分だと世論から厳しい批判を受け、支持率が落ち込んだ。",
              "effects": { "relations": { "press": -10 }, "approval": -3 },
              "next": "end_tarnished"
            }
          ]
        }
      ],
      "endings": [
        {
          "id": "end_reformer",
          "title": "透明な行政運営",
          "text": "隠蔽を許さず情報を公開したことで、大臣としての高い信頼を得た。",
          "effects": { "approval": 2, "abilities": { "政策": 1 }, "skills_add": ["genba_no_koe"] }
        },
        {
          "id": "end_responsible",
          "title": "責任の明確化",
          "text": "自らの進退や報酬をかけて問題を収束させ、党内外に筋を通した。",
          "effects": { "relations": { "party": 8, "supporters": 5 }, "exp": { "policy": 15 } }
        },
        {
          "id": "end_tarnished",
          "title": "消えない不信感",
          "text": "問題への甘い対応が尾を引き、行政への不信感を拭えなかった。",
          "effects": { "approval": -2, "mood": -1 }
        },
        {
          "id": "end_left_post",
          "title": "後任への引き継ぎ",
          "text": "大臣を退任したため、問題の処理は後任の大臣へと引き継がれた。",
          "effects": {}
        }
      ]
    },
    {
      "id": "minister_budget_battle",
      "title": "予算改革と業界",
      "summary": "大臣として既得権益化した補助金を見直し、新分野へ予算を回そうとする。抵抗する官僚と業界団体をどう説得するか。",
      "cast": ["secretary"],
      "start": { "trigger": "monthly", "status": ["議員"], "post": ["minister"] },
      "chapters": [
        {
          "id": "c1",
          "bg": "diet",
          "after_months": [1, 3],
          "conditions": { "post": ["minister"] },
          "fallback": "end_out_of_office",
          "lines": [
            { "speaker": "narrator", "text": "来年度予算の概算要求を前に、担当局長が改革案に難色を示してきた。" },
            { "speaker": "other", "name": "担当局長", "face": "serious", "text": "大臣、長年の補助金を削れば現場が混乱します。前例を踏襲すべきです。" },
            { "speaker": "secretary", "face": "normal", "text": "先生、役所側もかなり警戒している様子です。どう説得されますか。" },
            { "speaker": "self", "face": "serious", "text": "時代の変化に合わせて予算の配分を変えるのが、大臣の仕事だ。" }
          ],
          "choices": [
            {
              "label": "データで予算見直しの効果を説く",
              "result": "綿密な試算を示して説得し、担当局長も改革案の作成に協力し始めた。",
              "effects": { "exp": { "policy": 15 }, "abilities": { "政策": 1 } },
              "flags": ["bud_convinced"],
              "next": "c2",
              "risk": {
                "ability": "政策",
                "threshold": 55,
                "fail_result": "論拠が弱く、官僚の抵抗を押し切ることができなかった。",
                "fail_effects": { "stamina": -10 },
                "fail_next": "c2"
              }
            },
            {
              "label": "大臣権限で予算案の作り直しを命じる",
              "result": "強い指示を出して作業を進めさせたが、省内に不満の空気が広がった。",
              "effects": { "relations": { "party": -4 }, "exp": { "policy": 10 } },
              "flags": ["bud_order"],
              "next": "c2"
            }
          ]
        },
        {
          "id": "c2",
          "bg": "ryotei",
          "after_months": [2, 4],
          "conditions": { "post": ["minister"] },
          "fallback": "end_out_of_office",
          "lines": [
            { "speaker": "narrator", "text": "数週間後、関係する業界団体の会長から会食に招かれ、予算案への陳情を受けた。" },
            { "speaker": "other", "name": "業界団体会長", "face": "angry", "text": "先生、補助金を切られたら地方の中小企業は持ちません。考え直してください。" },
            { "speaker": "secretary", "face": "serious", "text": "党の部会でも、地元の業界を代弁する議員から反対意見が出ています。" },
            { "speaker": "self", "face": "serious", "text": "現場の事情も分かるが、予算全体を見直さなければならない事情もある。" }
          ],
          "choices": [
            {
              "label": "段階的に見直す移行措置を提案する",
              "result": "急激な削減を避け、数年かけて切り替える現実的な妥協案を示した。",
              "effects": { "exp": { "network": 12 }, "relations": { "party": 6 } },
              "flags": ["bud_compromise"],
              "next": "c3"
            },
            {
              "label": "改革は曲げられないと毅然と断る",
              "result": "業界の反発を受けたが、国民全体の利益を優先する姿勢が報道された。",
              "effects": { "relations": { "supporters": -5, "press": 8 } },
              "flags": ["bud_firm"],
              "next": "c3"
            },
            {
              "label": "業界の意見を聞き削減幅を抑える",
              "result": "業界からは感謝されたが、改革が骨抜きになったと批判を浴びた。",
              "effects": { "relations": { "press": -6, "supporters": 5 }, "money": 60 },
              "flags": ["bud_retreat"],
              "next": "c3"
            }
          ]
        },
        {
          "id": "c3",
          "bg": "diet",
          "after_months": [2, 4],
          "conditions": { "post": ["minister"] },
          "fallback": "end_out_of_office",
          "lines": [
            { "speaker": "narrator", "text": "年末の予算折衝が大詰めを迎えた。最終的な予算案を国会へ提出する。" },
            { "speaker": "other", "name": "担当局長", "face": "normal", "text": "大臣、財務省との調整もあと一歩です。最後のご決断をお願いします。" },
            { "speaker": "secretary", "face": "normal", "text": "先生、記者たちも予算案の最終発表を今かと待っています。" },
            { "speaker": "self", "face": "normal", "text": "長い調整だったな。納得のいく予算を必ずまとめ上げよう。" }
          ],
          "choices": [
            {
              "label": "官僚と一体になり新予算をまとめ上げる",
              "result": "省庁全体が一つになって動き、新しい時代に向けた予算が閣議決定された。",
              "effects": { "exp": { "policy": 20 }, "approval": 2 },
              "if_flags": ["bud_convinced"],
              "next": "end_breakthrough"
            },
            {
              "label": "国民に向けて直接改革の意義を語る",
              "result": "記者会見で分かりやすく説明したことで、世論からの強い後押しを得た。",
              "effects": { "exp": { "media": 15 }, "abilities": { "知名度": 2 } },
              "next": "end_public_support",
              "risk": {
                "ability": "知名度",
                "threshold": 55,
                "fail_result": "報道での注目が集まらず、予算案の狙いが十分に伝わらなかった。",
                "fail_effects": { "exp": { "media": 5 } },
                "fail_next": "end_pragmatic"
              }
            },
            {
              "label": "各所の利害を調整して着地させる",
              "result": "大きな混乱を起こさずに予算を成立させ、調整手腕が評価された。",
              "effects": { "relations": { "party": 8 }, "exp": { "network": 12 } },
              "next": "end_pragmatic"
            }
          ]
        }
      ],
      "endings": [
        {
          "id": "end_breakthrough",
          "title": "官僚を動かした改革",
          "text": "データと熱意で官僚を説得し、前例を破る新しい予算を実現させた。",
          "effects": { "abilities": { "政策": 2 }, "skills_add": ["dandori"] }
        },
        {
          "id": "end_public_support",
          "title": "国民への約束",
          "text": "改革の必要性を分かりやすく訴えたことで、内閣支持率にも貢献した。",
          "effects": { "approval": 2, "relations": { "press": 8 }, "vote_bonus": 2 }
        },
        {
          "id": "end_pragmatic",
          "title": "現実的な前進",
          "text": "業界や党内の反発を最小限に抑えながら、予算の組み替えを果たした。",
          "effects": { "relations": { "party": 8 }, "exp": { "network": 15 } }
        },
        {
          "id": "end_out_of_office",
          "title": "未完の予算案",
          "text": "大臣を離れたため、練っていた予算改革案は棚上げとなった。",
          "effects": {}
        }
      ]
    },
    {
      "id": "ruling_coalition_crisis",
      "title": "連立政権の岐路",
      "summary": "政権中枢にいる中、重要法案を巡って連立相手の政党が離脱を匂わせる。自党内の反発を抑えつつ政権を維持できるか。",
      "cast": ["secretary"],
      "start": { "trigger": "monthly", "status": ["議員"], "post": ["pm", "party_exec"], "ruling": true },
      "chapters": [
        {
          "id": "c1",
          "bg": "party_hq",
          "after_months": [1, 3],
          "conditions": { "post": ["pm", "party_exec"], "ruling": true },
          "fallback": "end_lost_post",
          "lines": [
            { "speaker": "narrator", "text": "重要法案の審議中、連立を組むパートナー政党の幹部が党本部に乗り込んできた。" },
            { "speaker": "other", "name": "連立党幹部", "face": "serious", "text": "我が党の修正要求を呑めないなら、連立から抜けることも辞さない。" },
            { "speaker": "secretary", "face": "serious", "text": "先生、ここで連立が解消されれば、法案の可決も難しくなります。" },
            { "speaker": "self", "face": "serious", "text": "政権の安定と自党の方針、どちらをどう立てるか難しい局面だ。" }
          ],
          "choices": [
            {
              "label": "連立維持のため修正協議に応じる",
              "result": "相手の言い分も聞き入れる姿勢を見せ、まずは決裂を回避した。",
              "effects": { "relations": { "party": -6 }, "exp": { "network": 12 } },
              "flags": ["coal_nego"],
              "next": "c2"
            },
            {
              "label": "党の基本方針は譲れないと断る",
              "result": "毅然と断ったことで自党内の士気は上がったが、政権に亀裂が入った。",
              "effects": { "relations": { "party": 6 }, "approval": -1 },
              "flags": ["coal_hard"],
              "next": "c2"
            }
          ]
        },
        {
          "id": "c2",
          "bg": "diet",
          "after_months": [1, 3],
          "conditions": { "post": ["pm", "party_exec"], "ruling": true },
          "fallback": "end_lost_post",
          "lines": [
            { "speaker": "narrator", "text": "今度は自党のベテラン議員たちが会議室に押しかけ、連立相手への譲歩に反発した。" },
            { "speaker": "other", "name": "自党の議員", "face": "angry", "text": "これ以上、小さな連立党に振り回されるのか。強気に出て突き放すべきだ。" },
            { "speaker": "secretary", "face": "serious", "text": "先生、党内の反発と連立の維持、両方を見極める必要があります。" },
            { "speaker": "self", "face": "serious", "text": "党内が割れてしまえば元も子もない。急いで手を打たなければ。" }
          ],
          "choices": [
            {
              "label": "党内を回り大局的な判断を説得する",
              "result": "政権維持の重要性を一人ひとりに説き、自党内の不満を抑え込んだ。",
              "effects": { "relations": { "party": 10 }, "abilities": { "調整": 2 } },
              "flags": ["coal_united"],
              "next": "c3",
              "risk": {
                "ability": "調整",
                "threshold": 65,
                "fail_result": "党内の反発を収めきれず、足元から批判の声が噴き出した。",
                "fail_effects": { "relations": { "party": -8 }, "mood": -1 },
                "fail_next": "c3"
              }
            },
            {
              "label": "連立相手との極秘会談を設ける",
              "result": "非公式の場で相手の幹部と本音をぶつけ合い、打開策を探った。",
              "effects": { "stamina": -10, "exp": { "network": 15 } },
              "flags": ["coal_secret"],
              "next": "c3"
            }
          ]
        },
        {
          "id": "c3",
          "bg": "ryotei",
          "after_months": [1, 3],
          "conditions": { "post": ["pm", "party_exec"], "ruling": true },
          "fallback": "end_lost_post",
          "lines": [
            { "speaker": "narrator", "text": "採決の前夜。連立党幹部との最終協議の場で、結論を出さなければならない。" },
            { "speaker": "other", "name": "連立党幹部", "face": "normal", "text": "お互いにここが引き際だ。国民が納得する形を今夜中に決めよう。" },
            { "speaker": "secretary", "face": "serious", "text": "先生、明日の本会議の日程も決まっています。今夜の合意がすべてです。" },
            { "speaker": "self", "face": "serious", "text": "政権の責任を果たすため、最善の決断を下します。" }
          ],
          "choices": [
            {
              "label": "両党の顔を立てる共同修正案で合意する",
              "result": "自党の納得も得た上で共同修正案をまとめ、連立政権を安定させた。",
              "effects": { "approval": 2, "relations": { "party": 8 } },
              "if_flags": ["coal_united"],
              "next": "end_stable"
            },
            {
              "label": "妥協せず自党案での強行採決に踏み切る",
              "result": "法案は通したものの連立に深い溝が残り、世論の批判を受けた。",
              "effects": { "approval": -2, "relations": { "press": -6 }, "exp": { "policy": 15 } },
              "next": "end_forced"
            },
            {
              "label": "相手の要求をほぼ呑んで連立を守る",
              "result": "連立は維持できたが、自党内から『弱腰だ』との不満がくすぶった。",
              "effects": { "relations": { "party": -8 }, "approval": 1 },
              "next": "end_concession",
              "risk": {
                "ability": "組織",
                "threshold": 60,
                "fail_result": "自党の支持基盤から激しい抗議が寄せられ、対応に追われた。",
                "fail_effects": { "relations": { "supporters": -8 }, "stamina": -12 },
                "fail_next": "end_concession"
              }
            }
          ]
        }
      ],
      "endings": [
        {
          "id": "end_stable",
          "title": "安定した政権運営",
          "text": "党内と連立相手の双方を巧みにまとめ上げ、政権の求心力を高めた。",
          "effects": { "approval": 2, "relations": { "party": 10 }, "exp": { "network": 20 } }
        },
        {
          "id": "end_forced",
          "title": "強硬な決断",
          "text": "意見の対立を押し切って法案を成立させたが、政権内に亀裂を残した。",
          "effects": { "approval": -2, "abilities": { "組織": 2 } }
        },
        {
          "id": "end_concession",
          "title": "苦渋の妥協",
          "text": "政権維持を最優先して大きく譲歩し、難しい党内運営が続いた。",
          "effects": { "relations": { "party": -5 }, "exp": { "network": 15 } }
        },
        {
          "id": "end_lost_post",
          "title": "政局の交代",
          "text": "役職を離れたことで、連立協議の主導権は別の幹部へと移った。",
          "effects": {}
        }
      ]
    },
    {
      "id": "opp_united_front",
      "title": "野党共闘の難路",
      "summary": "野党の党首や幹部として政権交代を目指す中、他党からの選挙協力の打診に対し、理念と勝利の間で判断を迫られる。",
      "cast": ["secretary"],
      "start": { "trigger": "monthly", "status": ["議員"], "post": ["leader", "opp_exec"], "ruling": false },
      "chapters": [
        {
          "id": "c1",
          "bg": "diet",
          "after_months": [1, 3],
          "conditions": { "post": ["leader", "opp_exec"], "ruling": false },
          "fallback": "end_post_ended",
          "lines": [
            { "speaker": "narrator", "text": "野党の幹部として支持率低迷に悩む中、別の野党の幹部から申し入れがあった。" },
            { "speaker": "other", "name": "他党の幹部", "face": "normal", "text": "次の選挙で与党を倒すため、小選挙区の候補者を一本化しませんか。" },
            { "speaker": "secretary", "face": "normal", "text": "先生、候補者を一本化できれば議席が増える可能性は高まります。" },
            { "speaker": "self", "face": "serious", "text": "勝つためには力が必要だが、政策の違いをどう乗り越えるかだな。" }
          ],
          "choices": [
            {
              "label": "政権交代を優先し前向きに協議する",
              "result": "他党との選挙協力に向けた実務協議を始めることで合意した。",
              "effects": { "exp": { "network": 10 }, "relations": { "supporters": -4 } },
              "flags": ["opp_coop"],
              "next": "c2"
            },
            {
              "label": "党の独自路線を守るため慎重に構える",
              "result": "安易な野合は有権者の信頼を損なうと伝え、協議を見送った。",
              "effects": { "relations": { "party": 6 }, "exp": { "policy": 10 } },
              "flags": ["opp_indep"],
              "next": "c2"
            }
          ]
        },
        {
          "id": "c2",
          "bg": "party_hq",
          "after_months": [2, 4],
          "conditions": { "post": ["leader", "opp_exec"], "ruling": false },
          "fallback": "end_post_ended",
          "lines": [
            { "speaker": "narrator", "text": "他党との協議が報じられると、自党内は賛成派と反対派に真っ二つに割れた。" },
            { "speaker": "other", "name": "自党の議員", "face": "angry", "text": "基本政策が違う政党と組めば、昔からの支持者が離れてしまいます。" },
            { "speaker": "secretary", "face": "serious", "text": "先生、与党側がこの機会に一部の議員を引き抜こうと動いている噂もあります。" },
            { "speaker": "self", "face": "serious", "text": "まず党内の動揺を抑えなければ、他党との話し合いどころではない。" }
          ],
          "choices": [
            {
              "label": "党の会議で政権交代の必要性を訴える",
              "result": "力強い演説で政権交代の意義を説き、党内の反発を落ち着かせた。",
              "effects": { "relations": { "party": 10 }, "abilities": { "弁舌": 2 } },
              "flags": ["opp_rally"],
              "next": "c3",
              "risk": {
                "ability": "弁舌",
                "threshold": 60,
                "fail_result": "反対派のヤジが飛び、党内の結束をまとめることができなかった。",
                "fail_effects": { "relations": { "party": -8 }, "mood": -1 },
                "fail_next": "c3"
              }
            },
            {
              "label": "離党を防ぐため一人ずつ説得して回る",
              "result": "個別に対話を重ねて不安を取り除き、離党者が出るのを食い止めた。",
              "effects": { "stamina": -15, "exp": { "network": 15 } },
              "flags": ["opp_patch"],
              "next": "c3"
            }
          ]
        },
        {
          "id": "c3",
          "bg": "tv",
          "after_months": [2, 4],
          "conditions": { "post": ["leader", "opp_exec"], "ruling": false },
          "fallback": "end_post_ended",
          "lines": [
            { "speaker": "narrator", "text": "野党間の協議が最終局面を迎え、記者会見で共闘の結論を発表する時が来た。" },
            { "speaker": "other", "name": "他党の幹部", "face": "serious", "text": "国民は与党に対抗できる野党の姿を待っています。ご決断を。" },
            { "speaker": "secretary", "face": "serious", "text": "先生、記者会見場の準備が整いました。党としての方針をお示しください。" },
            { "speaker": "self", "face": "serious", "text": "党の将来と日本の政治を見据えて、私たちの答えを伝えます。" }
          ],
          "choices": [
            {
              "label": "選挙での協力体制を正式に発表する",
              "result": "野党共闘の合意が大きな話題となり、政権交代への期待が高まった。",
              "effects": { "vote_bonus": 2, "relations": { "press": 8, "supporters": -4 } },
              "if_flags": ["opp_coop"],
              "next": "end_coalition"
            },
            {
              "label": "政策合意が難しく共闘見送りを発表する",
              "result": "党の理念を守り抜く姿勢を貫き、単独での戦いを選ぶと明言した。",
              "effects": { "relations": { "party": 8, "press": -5 }, "abilities": { "政策": 2 } },
              "next": "end_pure_line",
              "risk": {
                "ability": "知名度",
                "threshold": 55,
                "fail_result": "共闘見送りに対する世論の失望が広がり、厳しい批判に晒された。",
                "fail_effects": { "relations": { "press": -8 }, "vote_bonus": -1 },
                "fail_next": "end_pure_line"
              }
            },
            {
              "label": "国会内の連携にとどめる合意をする",
              "result": "選挙協力は見送り、国会での法案審議に絞って協力する道を選んだ。",
              "effects": { "exp": { "network": 12 }, "abilities": { "調整": 1 } },
              "next": "end_limited"
            }
          ]
        }
      ],
      "endings": [
        {
          "id": "end_coalition",
          "title": "野党共闘の実現",
          "text": "党内の対立を乗り越えて他党と手を組み、次の選挙への態勢を整えた。",
          "effects": { "vote_bonus": 2, "exp": { "election": 15, "network": 15 } }
        },
        {
          "id": "end_pure_line",
          "title": "独自路線の貫徹",
          "text": "党の基本理念を守り抜き、安易な妥協をしない姿勢で支持層を固めた。",
          "effects": { "relations": { "party": 10, "supporters": 8 }, "abilities": { "政策": 1 } }
        },
        {
          "id": "end_limited",
          "title": "現実的な連携",
          "text": "党内の分裂を防ぎつつ、国会内での現実的な協力関係を作り上げた。",
          "effects": { "exp": { "network": 15 }, "relations": { "party": 6 } }
        },
        {
          "id": "end_post_ended",
          "title": "役職の交代",
          "text": "党の役職を離れたことで、他党との共闘協議から身を引くことになった。",
          "effects": {}
        }
      ]
    },
    {
      "id": "sequel_rival_reunion",
      "title": "好敵手と見た景色",
      "summary": "好敵手となったライバルの体調悪化と入院を知り、選挙区の競争を超えた人間同士の関わりと、政治家としての進退に向き合う。",
      "cast": ["rival", "secretary"],
      "start": { "trigger": "monthly", "status": ["議員", "浪人"], "bond_state": { "rival": "好敵手" }, "rival_in_district": true, "terms_min": 3 },
      "chapters": [
        {
          "id": "c1",
          "bg": "office",
          "after_months": [2, 5],
          "conditions": { "rival_in_district": true },
          "fallback": "end_rival_retired",
          "lines": [
            { "speaker": "narrator", "text": "事務所で仕事を終えた夕方、秘書の{secretary}が神妙な顔で入ってきた。" },
            { "speaker": "secretary", "face": "serious", "text": "先生、同じ区の{rival}さんが過労と持病で緊急入院されたそうです。" },
            { "speaker": "secretary", "face": "normal", "text": "次の選挙に間に合うか分からないという噂も流れています。" },
            { "speaker": "self", "face": "serious", "text": "ずっと同じ{district}で競り合ってきた相手だ。大丈夫だろうか。" }
          ],
          "choices": [
            {
              "label": "見舞いの品と手紙を病院へ届ける",
              "result": "礼節を尽くした手紙を贈り、一日も早い回復を願う気持ちを伝えた。",
              "effects": { "money": -10, "bonds": { "rival": 10 } },
              "flags": ["seq_rival_flower"],
              "next": "c2"
            },
            {
              "label": "自ら病院へ足を運び顔を見る",
              "result": "忙しい予定を縫って病院を訪ねると、{rival}の家族が深々と頭を下げた。",
              "effects": { "stamina": -5, "bonds": { "rival": 15 } },
              "flags": ["seq_rival_visit"],
              "next": "c2"
            },
            {
              "label": "相手を思い静かに仕事に集中する",
              "result": "今は治療に専念してほしいと考え、表立った行動は控えることにした。",
              "effects": { "exp": { "policy": 10 } },
              "flags": ["seq_rival_quiet"],
              "next": "c2"
            }
          ]
        },
        {
          "id": "c2",
          "bg": "hospital",
          "after_months": [1, 3],
          "conditions": { "rival_in_district": true },
          "fallback": "end_rival_retired",
          "lines": [
            { "speaker": "narrator", "text": "数週間後、回復に向かっている{rival}と直接言葉を交わす機会を得た。" },
            { "speaker": "rival", "face": "sad", "text": "情けない姿を見せました。医師からは、もう無理はできないと言われています。" },
            { "speaker": "rival", "face": "normal", "text": "あなたと何度も競り合えたことは、私の政治家としての誇りですよ。" },
            { "speaker": "self", "face": "serious", "text": "弱気なことを言わないでください。まだ終わりではないでしょう。" }
          ],
          "choices": [
            {
              "label": "政界での再戦を約束して励ます",
              "result": "{rival}の目に再び闘志が戻り、静かに力強くうなずいた。",
              "effects": { "bonds": { "rival": 15 }, "mood": 1 },
              "flags": ["seq_rival_encourage"],
              "next": "c3"
            },
            {
              "label": "自分の体を一番に考えるよう伝える",
              "result": "{rival}は穏やかな笑みを浮かべ、家族と相談すると答えた。",
              "effects": { "bonds": { "rival": 8 }, "exp": { "network": 10 } },
              "flags": ["seq_rival_care"],
              "next": "c3"
            },
            {
              "label": "地元の課題について意見を交換する",
              "result": "以前協力した地元の話を持ち出すと、{rival}は懐かしそうに笑った。",
              "effects": { "bonds": { "rival": 18 }, "exp": { "policy": 10 } },
              "if_flags": ["rival_coop"],
              "flags": ["seq_rival_coop_mem"],
              "next": "c3",
              "risk": {
                "ability": "政策",
                "threshold": 55,
                "fail_result": "話が噛み合わず、相手の疲れを気遣って早めに切り上げた。",
                "fail_effects": { "bonds": { "rival": 5 } },
                "fail_next": "c3"
              }
            }
          ]
        },
        {
          "id": "c3",
          "bg": "station",
          "after_months": [3, 6],
          "conditions": { "rival_in_district": true },
          "fallback": "end_rival_retired",
          "lines": [
            { "speaker": "narrator", "text": "季節が移り、朝の駅前に再び{rival}の姿があった。" },
            { "speaker": "rival", "face": "smile", "text": "お待たせしました。体力を整えて、またこの場所に戻ってきましたよ。" },
            { "speaker": "secretary", "face": "smile", "text": "先生、{rival}さんもすっかりお元気になられたようですね。" },
            { "speaker": "self", "face": "smile", "text": "おかえりなさい。また正々堂々と、この区で競い合いましょう。" }
          ],
          "choices": [
            {
              "label": "全力の演説で再会に応える",
              "result": "互いの演説に力が入り、駅前を歩く有権者も足を止めて聴き入った。",
              "effects": { "bonds": { "rival": 15 }, "vote_bonus": 2, "abilities": { "弁舌": 1 } },
              "next": "end_eternal_rivals",
              "risk": {
                "ability": "弁舌",
                "threshold": 55,
                "fail_result": "力が入りすぎて声が枯れたが、{rival}は微笑んで見守っていた。",
                "fail_effects": { "bonds": { "rival": 12 }, "stamina": -8 },
                "fail_next": "end_eternal_rivals"
              }
            },
            {
              "label": "歩み寄って固い握手を交わす",
              "result": "所属政党の違いを超えて手を取り合う姿が、地元の人々の心に残った。",
              "effects": { "bonds": { "rival": 20 }, "relations": { "supporters": 8, "press": 5 } },
              "next": "end_mutual_respect"
            }
          ]
        }
      ],
      "endings": [
        {
          "id": "end_eternal_rivals",
          "title": "生涯の好敵手",
          "text": "病を乗り越えて戻ってきた好敵手と、再び地元のために競い合う日々が始まった。",
          "effects": { "bonds": { "rival": 15 }, "exp": { "election": 20 }, "mood": 1 }
        },
        {
          "id": "end_mutual_respect",
          "title": "立場を超えた敬意",
          "text": "長年競い合ったからこそ分かる信頼関係が、二人をより良い政治家へと高めた。",
          "effects": { "bonds": { "rival": 20 }, "relations": { "supporters": 10 }, "skills_add": ["tsuji_seppou"] }
        },
        {
          "id": "end_rival_retired",
          "title": "政敵の引退",
          "text": "体調を理由にライバルは政界を去った。その思いも背負って選挙区を守る。",
          "effects": { "exp": { "election": 15 }, "abilities": { "調整": 1 } }
        }
      ]
    },
    {
      "id": "sequel_doki_summit",
      "title": "盟友と目指す頂",
      "summary": "盟友となった同期と共に党の中枢へと近づく中、次期党首の座や党内の主導権を巡り、友情と政治家としての野心の均衡を試される。",
      "cast": ["doki", "secretary"],
      "start": { "trigger": "monthly", "status": ["議員"], "terms_min": 4, "bond_state": { "doki": "盟友" } },
      "chapters": [
        {
          "id": "c1",
          "bg": "ryotei",
          "after_months": [2, 5],
          "conditions": { "status": ["議員"] },
          "fallback": "end_split",
          "lines": [
            { "speaker": "narrator", "text": "次期党首の交代が囁かれ始めた夜、盟友の{doki}と二人きりで酒を酌み交わした。" },
            { "speaker": "doki", "face": "serious", "text": "俺たちも中堅から中枢に入る時期だ。次の党首選、お前はどう動くつもりだ。" },
            { "speaker": "doki", "face": "normal", "text": "お前が手を挙げるなら俺は支える。だが、俺自身も上を目指したい思いがあるんだ。" },
            { "speaker": "self", "face": "serious", "text": "お前と俺は同じスタートラインから歩いてきたからな。よく考えよう。" }
          ],
          "choices": [
            {
              "label": "君が立つなら全力で支える",
              "result": "{doki}は驚きながらも嬉しそうに頷き、固く杯を傾けた。",
              "effects": { "bonds": { "doki": 15 }, "relations": { "party": 5 } },
              "flags": ["doki_yield"],
              "next": "c2_support"
            },
            {
              "label": "自分が挑戦するので力を貸してほしい",
              "result": "{doki}はしばらく考え込んだあと、『わかった、考えさせてくれ』と答えた。",
              "effects": { "bonds": { "doki": 5 }, "exp": { "network": 10 } },
              "flags": ["doki_run"],
              "next": "c2_run"
            },
            {
              "label": "二人で新しい政策グループを立ち上げる",
              "result": "まずは二人で同志を増やそうと合意し、党内に新しい動きが生まれた。",
              "effects": { "money": -50, "exp": { "policy": 12 } },
              "flags": ["doki_group"],
              "next": "c2_run"
            }
          ]
        },
        {
          "id": "c2_support",
          "bg": "party_hq",
          "after_months": [2, 4],
          "conditions": { "status": ["議員"] },
          "fallback": "end_split",
          "lines": [
            { "speaker": "narrator", "text": "{doki}を推す動きが広がった途端、党内の古参議員たちが妨害を始めた。" },
            { "speaker": "doki", "face": "sad", "text": "推薦人の集まりが悪いんだ。長老たちが俺の支援者に圧力をかけているらしい。" },
            { "speaker": "secretary", "face": "serious", "text": "先生、ここで{doki}様への支援を強めれば、ご自身の立場も厳しくなります。" },
            { "speaker": "self", "face": "serious", "text": "ここで引いたら約束が違うだろう。できる限りの手は尽くしてみたい。" }
          ],
          "choices": [
            {
              "label": "裏方に徹して推薦人集めに奔走する",
              "result": "各所を粘り強く回り、必要な推薦人の数を確保して長老の圧力を跳ね返した。",
              "effects": { "bonds": { "doki": 20 }, "abilities": { "調整": 2 } },
              "flags": ["doki_success"],
              "next": "c3",
              "risk": {
                "ability": "調整",
                "threshold": 60,
                "fail_result": "推薦人集めに苦戦し、体力を消耗したまま時期を逃してしまった。",
                "fail_effects": { "stamina": -15, "bonds": { "doki": 10 } },
                "fail_next": "c3"
              }
            },
            {
              "label": "一度引き次の機会を待つよう説得する",
              "result": "{doki}は悔しそうだったが、現実的な判断を受け入れて一歩引いた。",
              "effects": { "bonds": { "doki": -5 }, "relations": { "party": 8 } },
              "flags": ["doki_wait"],
              "next": "c3"
            }
          ]
        },
        {
          "id": "c2_run",
          "bg": "party_hq",
          "after_months": [2, 4],
          "conditions": { "status": ["議員"] },
          "fallback": "end_split",
          "lines": [
            { "speaker": "narrator", "text": "あなたが準備を進める一方、別のグループが{doki}を担ぎ出そうと動き始めた。" },
            { "speaker": "doki", "face": "serious", "text": "お前と争うつもりはない。だが、周囲から出馬を求められて困っているんだ。" },
            { "speaker": "secretary", "face": "serious", "text": "先生、{party}の内部でもお二人が競うのではないかという噂が広がっています。" },
            { "speaker": "self", "face": "serious", "text": "このままでは党内の対立に巻き込まれ、俺たちの関係まで壊されかねない。" }
          ],
          "choices": [
            {
              "label": "二人で腹を割って話し合い結束を固める",
              "result": "お互いの将来像を語り合い、他人の思惑には乗らないと固く約束した。",
              "effects": { "bonds": { "doki": 15 }, "exp": { "network": 12 } },
              "flags": ["doki_solid"],
              "next": "c3",
              "risk": {
                "ability": "調整",
                "threshold": 55,
                "fail_result": "話の途中で周囲の雑音が入り、ぎこちない空気のまま別れることになった。",
                "fail_effects": { "bonds": { "doki": -5 } },
                "fail_next": "c3"
              }
            },
            {
              "label": "過去の苦難を思い出し信頼を訴える",
              "result": "かつて救い合った記憶が蘇り、{doki}は『お前と競う気はない』と笑った。",
              "effects": { "bonds": { "doki": 20 }, "relations": { "party": 6 } },
              "if_flags": ["doki_saved"],
              "flags": ["doki_solid"],
              "next": "c3"
            },
            {
              "label": "各自の立場で最善を尽くそうと伝える",
              "result": "無理に歩調を合わせることはせず、政治家として互いの判断を尊重した。",
              "effects": { "abilities": { "組織": 1 }, "bonds": { "doki": -4 } },
              "flags": ["doki_separate"],
              "next": "c3"
            }
          ]
        },
        {
          "id": "c3",
          "bg": "diet",
          "after_months": [2, 4],
          "conditions": { "status": ["議員"] },
          "fallback": "end_split",
          "lines": [
            { "speaker": "narrator", "text": "党内の情勢が決まった日の夕方、国会の廊下で{doki}と向かい合った。" },
            { "speaker": "doki", "face": "smile", "text": "いろいろあったが、お前がいてくれて本当によかったと思っているよ。" },
            { "speaker": "secretary", "face": "normal", "text": "先生、次の会議の時間が迫っておりますが、少しお話しされていきますか。" },
            { "speaker": "self", "face": "smile", "text": "ああ。これからもこの党を良くしていくために、それぞれの持ち場で頑張ろう。" }
          ],
          "choices": [
            {
              "label": "これからも参謀として支え続けると誓う",
              "result": "最高の支援者であり続けることを誓い、二人の連携はさらに強固になった。",
              "effects": { "bonds": { "doki": 20 }, "relations": { "party": 10 } },
              "if_flags": ["doki_success"],
              "next": "end_kingmaker"
            },
            {
              "label": "二人で党の未来を作ると握手を交わす",
              "result": "党の世代交代を牽引する存在として、周囲からも注目されるようになった。",
              "effects": { "bonds": { "doki": 15 }, "vote_bonus": 2 },
              "if_flags": ["doki_solid"],
              "next": "end_twin_pillars"
            },
            {
              "label": "政治の厳しさを噛み締めて前を向く",
              "result": "時にすれ違いながらも互いを認め合い、次の仕事へと向かった。",
              "effects": { "exp": { "network": 15 }, "abilities": { "調整": 1 } },
              "next": "end_own_path"
            }
          ]
        }
      ],
      "endings": [
        {
          "id": "end_kingmaker",
          "title": "信頼の参謀役",
          "text": "盟友を押し上げるために奔走したことで、党内での調整力が高く評価された。",
          "effects": { "bonds": { "doki": 20 }, "relations": { "party": 10 }, "skills_add": ["dandori"] }
        },
        {
          "id": "end_twin_pillars",
          "title": "党を支える二人",
          "text": "周囲の揺さぶりを跳ねのけて結束を守り、党の将来を担う中心的存在となった。",
          "effects": { "bonds": { "doki": 15 }, "abilities": { "組織": 2, "調整": 1 } }
        },
        {
          "id": "end_own_path",
          "title": "それぞれの道へ",
          "text": "立場や周囲の思惑が交錯する中でも、政治家としての独立した姿勢を保った。",
          "effects": { "exp": { "network": 15 }, "mood": 1 }
        },
        {
          "id": "end_split",
          "title": "すれ違う時期",
          "text": "議席を離れたことで、党の中枢を巡る同期との計画は途中で途切れてしまった。",
          "effects": {}
        }
      ]
    },
    {
      "id": "retirement_final_chapter",
      "title": "引き際と後継者",
      "summary": "ベテランとして引退が視野に入る年齢になり、長年支えてくれた地元と秘書に感謝しつつ、政治人生の締めくくりと後継者を考える。",
      "cast": ["secretary"],
      "start": { "trigger": "monthly", "status": ["議員"], "age_min": 65 },
      "chapters": [
        {
          "id": "c1",
          "bg": "home",
          "after_months": [1, 4],
          "lines": [
            { "speaker": "narrator", "text": "深夜の書斎で古い選挙ポスターや議事録を整理していると、ふと引き際という言葉が浮かんだ。" },
            { "speaker": "other", "name": "家族", "face": "normal", "text": "お父さん、もう十分に国のために働きました。これからの体も大切にしてください。" },
            { "speaker": "other", "name": "家族", "face": "smile", "text": "地元の人たちからも、長く頑張ってくれてありがとうとよく言われますよ。" },
            { "speaker": "self", "face": "normal", "text": "長い間支えてもらったな。これからの政治人生をどうするか考え時かもしれない。" }
          ],
          "choices": [
            {
              "label": "まだやり残した仕事があると気力を奮う",
              "result": "年齢を理由に引くわけにはいかないと決意を新たにし、予定表を開いた。",
              "effects": { "mood": 1, "stamina": -5 },
              "flags": ["ret_continue"],
              "next": "c2"
            },
            {
              "label": "次世代へ引き継ぐ準備を始める",
              "result": "自分の政治人生をどう締めくくり、誰に後を託すか具体的に考え始めた。",
              "effects": { "exp": { "network": 10 } },
              "flags": ["ret_prepare"],
              "next": "c2"
            }
          ]
        },
        {
          "id": "c2",
          "bg": "office",
          "after_months": [3, 6],
          "conditions": { "status": ["議員"] },
          "fallback": "end_quiet_sunset",
          "lines": [
            { "speaker": "narrator", "text": "地元の事務所で、長年苦楽を共にしてきた{secretary}と、地域の若手地方議員が顔を合わせた。" },
            { "speaker": "other", "name": "若手地方議員", "face": "serious", "text": "先生のご功績を受け継ぎ、いつか自分も国政で地元のために働きたいと考えています。" },
            { "speaker": "secretary", "face": "normal", "text": "先生、後援会の方々の間でも、次の体制について話題が出始めています。" },
            { "speaker": "self", "face": "normal", "text": "二人の気持ちはよく分かった。今後の{district}のために一番良い形を選ぼう。" }
          ],
          "choices": [
            {
              "label": "若手議員を地元に連れ回り引き継ぐ",
              "result": "各地域の後援会に若手を連れて挨拶回りを行い、地盤の引き継ぎを進めた。",
              "effects": { "jiban_progress": 20, "bonds": { "secretary": 10 } },
              "flags": ["ret_handoff"],
              "next": "c3",
              "risk": {
                "ability": "調整",
                "threshold": 65,
                "fail_result": "古参の支援者が若手に難色を示し、引き継ぎの説得は難航した。",
                "fail_effects": { "relations": { "supporters": -5 }, "stamina": -10 },
                "fail_next": "c3"
              }
            },
            {
              "label": "秘書に後を継ぐ気はないかと打診する",
              "result": "{secretary}は驚いた様子で目を見開き、『少し考えさせてください』と答えた。",
              "effects": { "bonds": { "secretary": 15 } },
              "flags": ["ret_ask_sec"],
              "next": "c3"
            },
            {
              "label": "まだまだ現役を続けると宣言する",
              "result": "後継者選びは時期尚早だと伝え、これからも自分が先頭に立つ姿勢を示した。",
              "effects": { "relations": { "supporters": 10 }, "vote_bonus": 2 },
              "flags": ["ret_lifelong"],
              "next": "c3"
            }
          ]
        },
        {
          "id": "c3",
          "bg": "hall",
          "after_months": [3, 6],
          "conditions": { "status": ["議員"] },
          "fallback": "end_quiet_sunset",
          "lines": [
            { "speaker": "narrator", "text": "地元の大きな集会が開かれ、長年の支援者たちが会場を埋め尽くした。" },
            { "speaker": "other", "name": "後援会幹部", "face": "smile", "text": "先生、これまで本当にありがとうございました。今日もたくさんの方が来ています。" },
            { "speaker": "secretary", "face": "smile", "text": "先生、皆さんの前でご挨拶をお願いします。これまでの歩みを語ってください。" },
            { "speaker": "self", "face": "normal", "text": "皆さんの支えがあってこそ、ここまで議員を続けることができました。" }
          ],
          "choices": [
            {
              "label": "次世代への引き継ぎと感謝を語る",
              "result": "これまでの支援への感謝と未来への願いを語り、会場中から温かい拍手が起きた。",
              "effects": { "relations": { "supporters": 12 }, "exp": { "election": 15 } },
              "if_flags": ["ret_handoff"],
              "next": "end_baton"
            },
            {
              "label": "一番近くで支えた秘書への信頼を語る",
              "result": "{secretary}の名を挙げて感謝を述べると、本人も支援者も涙ぐんで頷いた。",
              "effects": { "bonds": { "secretary": 20 }, "relations": { "supporters": 8 } },
              "if_flags": ["ret_ask_sec"],
              "next": "end_trusted_heir"
            },
            {
              "label": "最後の一日まで走り抜くと約束する",
              "result": "力強い演説に会場の熱気が高まり、支援者たちは変わらぬ応援を誓った。",
              "effects": { "vote_bonus": 3, "stamina": -12, "abilities": { "弁舌": 2 } },
              "next": "end_burn_out",
              "risk": {
                "ability": "弁舌",
                "threshold": 60,
                "fail_result": "長時間の演説で声が途切れがちになり、体力の衰えを感じさせた。",
                "fail_effects": { "stamina": -18, "relations": { "supporters": 4 } },
                "fail_next": "end_burn_out"
              }
            }
          ]
        }
      ],
      "endings": [
        {
          "id": "end_baton",
          "title": "円満な世代交代",
          "text": "地元の支持者たちも納得する形で次世代への引き継ぎを進め、長い責任を全うした。",
          "effects": { "relations": { "supporters": 15 }, "jiban_progress": 25, "mood": 1 }
        },
        {
          "id": "end_trusted_heir",
          "title": "信頼の後継者",
          "text": "長年苦楽を共にした秘書へ志を託す道筋をつけ、温かな絆で締めくくった。",
          "effects": { "bonds": { "secretary": 20 }, "exp": { "network": 20 } }
        },
        {
          "id": "end_burn_out",
          "title": "現職続投の決意",
          "text": "年齢を感じさせない気力で最後まで現役を貫く姿勢を見せ、地元の喝采を浴びた。",
          "effects": { "vote_bonus": 3, "abilities": { "弁舌": 1 }, "relations": { "supporters": 10 } }
        },
        {
          "id": "end_quiet_sunset",
          "title": "静かな引退準備",
          "text": "議席を離れたことで、一人の人間として静かにこれまでの政治人生を振り返った。",
          "effects": { "mood": 1, "exp": { "network": 10 } }
        }
      ]
    },
    {
      "id": "repeatable_election_duel",
      "title": "街頭の攻防戦",
      "summary": "総選挙のたびに繰り返される、同じ選挙区のライバルとの駅前や商店街での地道な支持獲得競争。",
      "cast": ["rival", "secretary"],
      "once": false,
      "start": { "trigger": "after_election", "status": ["議員", "浪人"], "rival_in_district": true },
      "chapters": [
        {
          "id": "c1",
          "bg": "station",
          "after_months": [1, 3],
          "conditions": { "rival_in_district": true },
          "fallback": "end_no_contest",
          "lines": [
            { "speaker": "narrator", "text": "総選挙が終わって間もない朝の駅前で、すでに辻立ちを始めている{rival}の姿があった。" },
            { "speaker": "rival", "face": "normal", "text": "選挙が終わったばかりですが、次の戦いはもう始まっていますからね。" },
            { "speaker": "secretary", "face": "serious", "text": "先生、相手陣営の動きが早いです。こちらもすぐに手を打ちましょう。" },
            { "speaker": "self", "face": "normal", "text": "お互い休む暇はありませんね。こちらも負けずに頑張りますよ。" }
          ],
          "choices": [
            {
              "label": "負けないよう翌日から毎日駅に立つ",
              "result": "地道な駅立ちを続けたことで、通勤客からの知名度と親近感が増した。",
              "effects": { "stamina": -10, "jiban_progress": 15 },
              "flags": ["duel_morning"],
              "next": "c2"
            },
            {
              "label": "相手を労い穏やかに挨拶を交わす",
              "result": "礼儀正しい姿勢が周囲の通行人にも好印象を与え、互いに気持ちよく別れた。",
              "effects": { "bonds": { "rival": 6 }, "exp": { "media": 8 } },
              "flags": ["duel_polite"],
              "next": "c2"
            },
            {
              "label": "政策チラシを刷新して配布を始める",
              "result": "地元の課題を整理した新しいチラシを用意し、政策面での違いを示した。",
              "effects": { "money": -20, "exp": { "policy": 10 } },
              "flags": ["duel_policy"],
              "next": "c2"
            }
          ]
        },
        {
          "id": "c2",
          "bg": "street",
          "after_months": [4, 8],
          "conditions": { "rival_in_district": true },
          "fallback": "end_no_contest",
          "lines": [
            { "speaker": "narrator", "text": "数か月後、地元の商店街の行事や意見交換会で、再び{rival}と有権者の前で並んだ。" },
            { "speaker": "rival", "face": "serious", "text": "この街の将来を良くするために、政策の質で勝負しましょう。" },
            { "speaker": "secretary", "face": "normal", "text": "先生、大勢の買い物客が立ち止まって二人のやりとりを見ています。" },
            { "speaker": "self", "face": "serious", "text": "有権者に選ばれるのはどちらか、日々の活動で示していくだけです。" }
          ],
          "choices": [
            {
              "label": "堂々とした演説で地元の課題を訴える",
              "result": "説得力のある演説で聴衆の関心を集め、選挙区での存在感を示した。",
              "effects": { "vote_bonus": 2, "abilities": { "弁舌": 1 }, "bonds": { "rival": 5 } },
              "next": "end_sharp_edge",
              "risk": {
                "ability": "弁舌",
                "threshold": 55,
                "fail_result": "演説が噛み合わず聴衆の反応が鈍く、課題が残る結果となった。",
                "fail_effects": { "vote_bonus": -1, "stamina": -10 },
                "fail_next": "end_tie"
              }
            },
            {
              "label": "地域を一軒一軒回り生活の声を聞く",
              "result": "派手さはないものの着実に支持を広げ、地元の地盤を固めることができた。",
              "effects": { "jiban_progress": 20, "stamina": -10, "exp": { "election": 10 } },
              "next": "end_steady_work",
              "risk": {
                "ability": "組織",
                "threshold": 50,
                "fail_result": "挨拶回りの段取りが噛み合わず、思うように訪問先を増やせなかった。",
                "fail_effects": { "stamina": -12, "jiban_progress": 5 },
                "fail_next": "end_tie"
              }
            },
            {
              "label": "ライバルの主張の問題点を指摘する",
              "result": "具体的な数字を出して違いを強調し、支持者からの拍手を集めた。",
              "effects": { "bonds": { "rival": -6 }, "exp": { "policy": 10 }, "vote_bonus": 1 },
              "next": "end_sharp_edge"
            }
          ]
        }
      ],
      "endings": [
        {
          "id": "end_sharp_edge",
          "title": "選挙戦の手応え",
          "text": "街頭での地道な攻防を通じて発信力を磨き、次の総選挙への足掛かりを作った。",
          "effects": { "exp": { "election": 12, "media": 8 } }
        },
        {
          "id": "end_steady_work",
          "title": "地道な積み上げ",
          "text": "地域の声に耳を傾け続けたことで、着実に地元の信頼を広げることができた。",
          "effects": { "jiban_progress": 15, "relations": { "supporters": 5 } }
        },
        {
          "id": "end_tie",
          "title": "次への課題",
          "text": "思うような手応えは得られなかったが、ライバルとの競争から多くの反省を得た。",
          "effects": { "exp": { "election": 8 }, "mood": 1 }
        },
        {
          "id": "end_no_contest",
          "title": "相手なき戦い",
          "text": "ライバルが選挙区を離れたことで、街頭での一騎打ちは幕を閉じた。",
          "effects": { "exp": { "election": 5 } }
        }
      ]
    }
  ],
  "life_events": [
    {
      "id": "rival_tv_greenroom",
      "weight": 2,
      "status": ["議員", "浪人"],
      "needs": "rival",
      "title": "楽屋での鉢合わせ",
      "text": "地元の特集番組の収録前、控え室で{rival}と二人きりになった。",
      "choices": [
        {
          "label": "番組の進行について談笑する",
          "result": "収録前の緊張がほぐれ、番組内でも落ち着いた討論ができた。",
          "effects": { "bonds": { "rival": 6 }, "exp": { "media": 5 } }
        },
        {
          "label": "本番に備えて黙って資料を読む",
          "result": "互いに視線を合わせず、本番さながらの緊張感の中で時間を過ごした。",
          "effects": { "bonds": { "rival": -4 }, "exp": { "policy": 5 } }
        }
      ]
    },
    {
      "id": "rival_train_delay",
      "weight": 2,
      "status": ["議員"],
      "needs": "rival",
      "title": "新幹線のホームで",
      "text": "地元から東京へ向かう新幹線が遅延し、ホームで{rival}と隣り合わせた。",
      "choices": [
        {
          "label": "温かい飲み物を差し入れる",
          "result": "{rival}は驚いた表情を見せたあと、笑顔で礼を言って受け取った。",
          "effects": { "money": -1, "bonds": { "rival": 8 } }
        },
        {
          "label": "会釈だけして別の車両へ移る",
          "result": "余計な誤解を避けるため、距離を保って別の乗車口へ向かった。",
          "effects": { "bonds": { "rival": -3 }, "stamina": 5 }
        }
      ]
    },
    {
      "id": "rival_rain_speech",
      "weight": 2,
      "status": ["議員", "浪人"],
      "months": [6, 9],
      "needs": "rival",
      "title": "雨の日の駅前",
      "text": "激しい雨の中、先に駅前に立っていた{rival}と演説の場所が重なった。",
      "choices": [
        {
          "label": "場所を譲り合い時間をずらす",
          "result": "紳士的に調整して交互に演説を行い、周囲の通行人にも好印象を残した。",
          "effects": { "bonds": { "rival": 7 }, "relations": { "supporters": 3 } }
        },
        {
          "label": "構わず大声で演説を始める",
          "result": "互いに負けじと声を張り上げ、駅前は騒然とした空気になった。",
          "effects": { "bonds": { "rival": -7 }, "exp": { "election": 6 } }
        }
      ]
    },
    {
      "id": "doki_diet_cafeteria",
      "weight": 2,
      "status": ["議員"],
      "needs": "doki",
      "title": "議事堂の食堂で",
      "text": "昼休み、議員食堂の隅で{doki}が難しい顔をして資料を睨んでいた。",
      "choices": [
        {
          "label": "隣の席に座り相談に乗る",
          "result": "法案の課題を一緒に整理すると、{doki}の表情が明るくなった。",
          "effects": { "bonds": { "doki": 8 }, "exp": { "policy": 6 }, "stamina": -5 }
        },
        {
          "label": "挨拶だけして急ぎの用へ向かう",
          "result": "{doki}は軽く手を挙げただけで、再び書類に目を落とした。",
          "effects": { "bonds": { "doki": -2 }, "exp": { "network": 4 } }
        }
      ]
    },
    {
      "id": "doki_question_prep",
      "weight": 2,
      "status": ["議員"],
      "needs": "doki",
      "title": "質問前の激励",
      "text": "明日重要な委員会質問に立つ{doki}が、緊張した様子で廊下を歩いている。",
      "choices": [
        {
          "label": "遅くまで答弁の練習に付き合う",
          "result": "想定問答の相手を務め、{doki}は自信をつけて帰っていった。",
          "effects": { "stamina": -8, "bonds": { "doki": 10 }, "exp": { "policy": 8 } }
        },
        {
          "label": "頑張ってこいと肩を叩く",
          "result": "{doki}は『ありがとう、やってくるよ』と力強く頷いた。",
          "effects": { "bonds": { "doki": 4 }, "mood": 1 }
        }
      ]
    },
    {
      "id": "doki_media_spotlight",
      "weight": 2,
      "status": ["議員"],
      "needs": "doki",
      "title": "同期への取材攻勢",
      "text": "{doki}がテレビ番組で注目を集め、党内で羨む声が出始めている。",
      "choices": [
        {
          "label": "素直に活躍を喜び助言を送る",
          "result": "{doki}は『お前に言われると安心する』と素直に聞き入れた。",
          "effects": { "bonds": { "doki": 7 }, "relations": { "press": 3 } }
        },
        {
          "label": "目立ちすぎないよう忠告する",
          "result": "{doki}は『嫉妬かよ』と少し不機嫌そうな顔を見せた。",
          "effects": { "bonds": { "doki": -5 }, "relations": { "party": 4 } }
        }
      ]
    },
    {
      "id": "senpai_ryotei_bill",
      "weight": 2,
      "status": ["議員"],
      "needs": "senpai",
      "title": "先輩からの食事誘い",
      "text": "夜、{senpai}から『うまい店を見つけたから顔を出せ』と電話があった。",
      "choices": [
        {
          "label": "駆けつけて政治の話を聞く",
          "result": "長年の経験に基づく助言を聞き、党内の人脈の仕組みを学んだ。",
          "effects": { "stamina": -5, "bonds": { "senpai": 8 }, "exp": { "network": 10 } }
        },
        {
          "label": "地元の予定を理由に断る",
          "result": "地元活動を優先したことで、{senpai}は少し残念そうだった。",
          "effects": { "bonds": { "senpai": -4 }, "jiban_progress": 8 }
        }
      ]
    },
    {
      "id": "senpai_gift_season",
      "weight": 2,
      "status": ["候補", "議員", "浪人"],
      "months": [7, 12],
      "needs": "senpai",
      "title": "季節の挨拶状",
      "text": "{senpai}の事務所から、丁寧な激励の手紙と地元の特産品が届いた。",
      "choices": [
        {
          "label": "すぐにお礼の電話を入れる",
          "result": "近況を報告すると、{senpai}は上機嫌で励ましてくれた。",
          "effects": { "bonds": { "senpai": 7 }, "relations": { "party": 3 } }
        },
        {
          "label": "秘書にお礼状を出させる",
          "result": "形式通りの礼状で済ませ、自分の時間と体力を確保した。",
          "effects": { "bonds": { "senpai": -3 }, "stamina": 5 }
        }
      ]
    },
    {
      "id": "senpai_committee_seat",
      "weight": 2,
      "status": ["議員"],
      "needs": "senpai",
      "title": "先輩の口添え",
      "text": "希望していた委員会のポストについて、{senpai}が『話をつけてやろう』と言った。",
      "choices": [
        {
          "label": "ありがたく先輩の好意を受ける",
          "result": "{senpai}の尽力で話がまとまり、先輩への恩義が深まった。",
          "effects": { "bonds": { "senpai": 8 }, "exp": { "network": 6 } }
        },
        {
          "label": "自力で勝ち取りたいと辞退する",
          "result": "{senpai}は少し寂しそうだったが、こちらの自立心を認めた。",
          "effects": { "bonds": { "senpai": -5 }, "abilities": { "政策": 1 } }
        }
      ]
    },
    {
      "id": "secretary_overwork",
      "weight": 2,
      "status": ["候補", "議員", "浪人"],
      "needs": "secretary",
      "title": "深夜の事務所",
      "text": "深夜に事務所へ戻ると、{secretary}が机に突っ伏して眠っていた。",
      "choices": [
        {
          "label": "帰宅を促し残りを引き受ける",
          "result": "{secretary}は恐縮しながらも、何度も感謝して帰宅した。",
          "effects": { "stamina": -8, "bonds": { "secretary": 10 }, "relations": { "secretary": 6 } }
        },
        {
          "label": "上着をかけて静かに見守る",
          "result": "しばらくして目を覚ました{secretary}と温かい茶を飲んだ。",
          "effects": { "bonds": { "secretary": 6 }, "mood": 1 }
        },
        {
          "label": "起こして明日の予定を確認する",
          "result": "{secretary}は慌てて起き上がり、淡々と予定を読み上げた。",
          "effects": { "bonds": { "secretary": -6 }, "exp": { "election": 6 } }
        }
      ]
    },
    {
      "id": "secretary_mistake_cover",
      "weight": 2,
      "status": ["候補", "議員", "浪人"],
      "needs": "secretary",
      "title": "予定の重複",
      "text": "後援会の会合と視察が重なっていると分かり、{secretary}が焦っている。",
      "choices": [
        {
          "label": "自分の伝え方も悪かったと詫びる",
          "result": "{secretary}は感激し、すぐに先方へお詫びと調整に走った。",
          "effects": { "bonds": { "secretary": 8 }, "relations": { "supporters": -3 } }
        },
        {
          "label": "どうにか調整しろと厳しく叱る",
          "result": "{secretary}は萎縮しながらも、なんとか予定をやりくりした。",
          "effects": { "bonds": { "secretary": -7 }, "relations": { "secretary": -4 }, "exp": { "network": 5 } }
        }
      ]
    },
    {
      "id": "secretary_birthday_tea",
      "weight": 2,
      "status": ["候補", "議員", "浪人"],
      "needs": "secretary",
      "title": "移動中の会話",
      "text": "移動の車中、{secretary}が『先生と走り始めた頃を思い出します』と笑った。",
      "choices": [
        {
          "label": "これからも頼むと菓子折りを渡す",
          "result": "{secretary}は嬉しそうに受け取り、改めて気を引き締めた。",
          "effects": { "money": -2, "bonds": { "secretary": 9 }, "mood": 1 }
        },
        {
          "label": "まだまだこれからだと答える",
          "result": "{secretary}も力強く頷き、二人で次の訪問先へ向かった。",
          "effects": { "bonds": { "secretary": 3 }, "stamina": 5 }
        }
      ]
    }
  ],
  "election_bond_rules": [
    {
      "case": "自分がライバルに大差で勝った",
      "role": "rival",
      "change": -5,
      "reason": "一方的な敗北を喫したライバルは悔しさを募らせ、警戒と対抗心を強めたため。"
    },
    {
      "case": "自分がライバルに僅差で勝った",
      "role": "rival",
      "change": 8,
      "reason": "全力を尽くした接戦を通じて互いの力量を認め合い、好敵手としての敬意が芽生えたため。"
    },
    {
      "case": "自分がライバルに僅差で負けた",
      "role": "rival",
      "change": 6,
      "reason": "惜敗ではあったが真っ向勝負をやり遂げたことで、相手への意識と敬意が高まったため。"
    },
    {
      "case": "自分がライバルに大差で負けた",
      "role": "rival",
      "change": -8,
      "reason": "力の差を見せつけられたことで、焦りと複雑な感情から距離が開いたため。"
    },
    {
      "case": "同期が落選した",
      "role": "doki",
      "change": 5,
      "reason": "議席を失い苦境に陥った同期を気遣い声をかけることで、立場を超えた結びつきが強まったため。"
    },
    {
      "case": "同期が先に大臣になった",
      "role": "doki",
      "change": -5,
      "reason": "同じスタートを切った同期に先を越された焦りと立場による距離感が生まれたため。"
    },
    {
      "case": "先輩が引退した",
      "role": "senpai",
      "change": 10,
      "reason": "政界の第一線を退く先輩が最後にこれまでの感謝と後事を託す言葉をくれたため。"
    },
    {
      "case": "先輩が落選した",
      "role": "senpai",
      "change": 5,
      "reason": "思わぬ逆風で議席を失った先輩を支えようと動く中で、恩義を再確認したため。"
    },
    {
      "case": "自分が党首選で同期と争った",
      "role": "doki",
      "change": -10,
      "reason": "党の頂点という一つの椅子を巡って真っ向から票を奪い合い、激しい緊張が生じたため。"
    },
    {
      "case": "自分が党首選で先輩と争った",
      "role": "senpai",
      "change": -12,
      "reason": "長年お世話になった先輩に挑み世代交代を迫ったことで、師弟や上下の空気に亀裂が入ったため。"
    }
  ]
}
```