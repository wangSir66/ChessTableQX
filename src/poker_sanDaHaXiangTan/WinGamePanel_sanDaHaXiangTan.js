function SetEndOneUserUI_sanDaHaXiangTan(node, off) {

    var pl = getUIPlayer(off);
    if (!pl) {
        node.setVisible(false);
        return;
    }
    setUserOfflineWinGamePanel(node,pl);
    var tData = MjClient.data.sData.tData;
    var isZhuan = pl.info.uid == tData.uids[tData.zhuang];

    addWxHeadToEndUI(node.getChildByName("image_head"), getPlayerIndex(off));
    // CircularCuttingHeadImg(node.getChildByName("image_head"), pl);

    if (pl.info.uid == SelfUid()) {
        if(Number(pl.winone) > 0)
        {
            node.loadTexture(isZhuan ? "gameOver_sanDaHa/zhuang_zheng_me.png" : "gameOver_sanDaHa/right_zheng2_me.png");
        }else{
            node.loadTexture(isZhuan ? "gameOver_sanDaHa/zhuang_fu_me.png" : "gameOver_sanDaHa/right_fu2_me.png");
        }
    }else{
        if(Number(pl.winone) > 0)
        {
            node.loadTexture(isZhuan ? "gameOver_sanDaHa/zhuang_zheng.png" : "gameOver_sanDaHa/right_zheng2.png");
        }else{
            node.loadTexture(isZhuan ? "gameOver_sanDaHa/zhuang_fu.png" : "gameOver_sanDaHa/right_fu2.png");
        }
    }


    var text_name = node.getChildByName("text_name");
    text_name.ignoreContentAdaptWithSize(true);
    text_name.setString(getNewName(unescape(pl.info.nickname ) + ""));
    // if (!isZhuan && pl.info.uid == SelfUid()) {
    //     text_name.setColor(cc.color(0xA3, 0x3A, 0x13));
    // }
    var image_state = node.getChildByName("image_state");
    if (isZhuan||((tData.winType==0 || tData.winType == -5) && off == 0 && image_state)) {
        switch (tData.winType) {
            case -3: // 大光
                image_state.loadTexture("gameOver_sanDaHa/daguang.png");
                break;
            case -2: // 小光
                image_state.loadTexture("gameOver_sanDaHa/xiaoguang.png");
                break;
            case -1: // 拉庄
                image_state.loadTexture("gameOver_sanDaHa/guozhuang.png");
                break;
            case 1: // 跨庄
                image_state.loadTexture("gameOver_sanDaHa/kuazhuang.png");
                break;
            case 2: // 小倒
                image_state.loadTexture("gameOver_sanDaHa/xiaodao.png");
                break;
            case 3: // 大倒
                image_state.loadTexture("gameOver_sanDaHa/dadao.png");
                break;
            case -4: // 庄家投降
                image_state.loadTexture("gameOver_sanDaHa/touxiang.png");
                break;
            case -5:// 比常主
                image_state.loadTexture("gameOver_sanDaHa/changzhu.png");
                break;
            case 5: // 庄家认输
                image_state.loadTexture("gameOver_sanDaHa/renshu.png");
                break;
            case 0: // 黄庄
                image_state.loadTexture("gameOver_sanDaHa/huangzhuang.png");
                break;
            default:
                image_state.setVisible(false);
        }

        var text_jiaoFen = node.getChildByName("text_jiaoFen");
        text_jiaoFen.ignoreContentAdaptWithSize(true);
        text_jiaoFen.setString((tData.isPaiFen ? "拍分：" : "叫分：") + tData.jiaoFen);

        var text_score = node.getChildByName("text_score");
        text_score.ignoreContentAdaptWithSize(true);
        text_score.setString("得分：" + tData.allDeFen);

        var text_diPai = node.getChildByName("text_diPai");
        var cards = tData.maiPaiArr;
        var shouldKouDi = (tData.koudiPlayer != -1 && tData.koudiPlayer != tData.zhuang);

        if (cards.length == 8 || cards.length == 9) {
            for (var i = 0; i < cards.length; i++) {
                var cardNode = node.getChildByName("card_" + i);

                setCardSprite_card(cardNode, cards[i], true);

                if (shouldKouDi && MjClient.majiang.getCardFen(cards[i]))
                    cardNode.y += 20;
            }
            if(cards.length == 8)
            {
                node.getChildByName("card_8").setVisible(false);
            }
        } else {
            for (var i = 0; i < 9; i++) {
                node.getChildByName("card_" + i).setVisible(false);
            }
        }
    } else {
        var node_card = node.getChildByName("node_card");
        if(node_card) {
            var image_temp = node_card.getChildByName("image_card");
            var image_kouDi = node.getChildByName("image_kouDi");
            if (tData.koudiPlayer != -1 && tData.uids[tData.koudiPlayer] == pl.info.uid) {
                var cards = tData.putCardsRecord[tData.putCardsRecord.length - 1][pl.info.uid];
                for (var i = 0; i < cards.length; i++) {
                    var image_card = image_temp.clone();
                    setCardSprite_card(image_card, cards[i], true);
                    image_card.x += cards.length < 10 ? 20 * i : 15 * i;
                    node_card.addChild(image_card);
                }
                image_temp.setVisible(false);
            } else {
                image_temp.setVisible(false);
                image_kouDi.setVisible(false);
            }
        };
    }

    var image_add = node.getChildByName("image_add");
    var text_addScore = node.getChildByName("text_addScore");
    var image_sub = node.getChildByName("image_sub");
    var text_subScore = node.getChildByName("text_subScore");
    image_add.setVisible(pl.winone >= 0);
    image_sub.setVisible(false);
    text_addScore.setVisible(pl.winone >= 0);
    text_subScore.setVisible(pl.winone < 0);
    text_addScore.ignoreContentAdaptWithSize(true);
    text_subScore.ignoreContentAdaptWithSize(true);
    text_addScore.setString(pl.winone + "");
    text_subScore.setString(pl.winone + "");

    image_add.x = text_addScore.x - text_addScore.width*text_addScore.scaleX - 5;
    image_sub.x = text_subScore.x - text_subScore.width*text_subScore.scaleY - 5;

    if(MjClient.getAppType() === MjClient.APP_TYPE.QXXXGHZ){
        setRoundEndUserOffline_xiangxiang(node.getChildByName("image_head"),pl);
    }
}

var EndOneView_sanDaHaXiangTan = cc.Layer.extend({
    jsBind: {
        block: {
            _layout: [
                [1, 1],
                [0.5, 0.5],
                [0, 0], true
            ]
        },
        back: {
            // _layout: [
            //     [1, 1],
            //     [0.5, 0.5],
            //     [0, 0]
            // ],
            _run:function(){
                if(isIPhoneX())
                    setWgtLayout(this, [0.85,0.85],[0.5,0.5],[0,0], false);
                else
                    setWgtLayout(this, [1,1],[0.5,0.5],[0,0], false);
            },
            huangzhuang: {
                _visible: function() {
                    var pl = getUIPlayer(0);
                    if (pl) {
                        //playEffect("win");
                        return pl.winone == 0;
                    }
                    return false;
                }
            },
            wintitle: {
                _visible: function() {
                    var pl = getUIPlayer(0);
                    if (pl) {
                        //playEffect("win");
                        return pl.winone >= 1;
                    }
                    return false;
                }
            },
            losetitle: {
                _visible: function() {
                    var pl = getUIPlayer(0);
                    if (pl) {
                        //playEffect("lose");
                        return pl.winone < 0;
                    }
                    return false;
                }
            },
            pingju: {
                _visible: function() {

                    var pl = getUIPlayer(0);

                    if (pl) {
                        //playEffect("lose");
                        return pl.winone == 0 && MjClient.isDismiss;
                    }
                    return false;
                },
                _run: function() {
                    if (MjClient.isDismiss) {
                        this.loadTexture("gameOver_sanDaHa/jiesan.png");
                    }
                }
            },
            shareBtn: {
                _click:function(btn,eT){
                    MjClient.shareMultiPlatform(MjClient.systemConfig.sharePlatforms, function()
                    {
                        postEvent("capture_screen");
                        MjClient.endoneui.capture_screen = true;
                        btn.setTouchEnabled(false);
                    });
                }
                ,_event:{
                    captureScreen_OK: function () {
                        if (MjClient.endoneui.capture_screen != true)
                            return;
                        MjClient.endoneui.capture_screen = false;
                        var writePath = jsb.fileUtils.getWritablePath();
                        var textrueName = "wxcapture_screen.png";
                        var savepath = writePath+textrueName;
                        MjClient.shareImageToSelectedPlatform(savepath);
                        this.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(function()
                        {
                            this.setTouchEnabled(true);
                        }.bind(this))));
                    }
                }
            },
            readyBtn: {
                _click: function (btn, eT) {

                    postEvent("clearCardUI");

                    MjClient.endoneui.removeFromParent(true);
                    MjClient.endoneui = null;
                    if (MjClient.rePlayVideo >= 0 && MjClient.replayui) {
                        MjClient.replayui.replayEnd();
                    }
                    else {
                        PKPassConfirmToServer_card();
                    }
                    // if (MjClient.arrowbkNode) {
                    //     MjClient.arrowbkNode.setVisible(false);
                    // }
                }
            },
            text_rule: {
                _run: function() {
                    // this.ignoreContentAdaptWithSize(true);
                    var tData = MjClient.data.sData.tData;
                    var rule = "";
                    // rule += tData.areaSelectMode.SAN_DA_HA_allowCheckCard ? "允许查牌," : "";
                    // rule += tData.areaSelectMode.SAN_DA_HA_touXiangXuXunWen ? "投降需询问," : "";
                    rule += tData.areaSelectMode.buKeZaiJiao ? "60分不可再叫," : "";

                    rule += tData.areaSelectMode.biChangZhu ? "比常主," : "";
                    rule += tData.areaSelectMode.SAN_DA_HA_doubleInSingleOut ? "双进单出," : "";
                    rule += tData.areaSelectMode.baoFuLiuShou ? "报副留守," : "";
                    rule += tData.areaSelectMode.qiJiaoFen60 ? "60分起叫," : "";
                    rule += tData.areaSelectMode.quDiao6 ? "去掉6," : "";
                    if(tData.areaSelectMode.xiaoGuangFen ==25)
                    {
                        rule += "小光25分,";
                    }
                    else {
                        rule += "小光30分,";
                    }
                    if (rule.charAt(rule.length - 1) == ",")
                        rule = rule.substring(0, rule.length - 1);
                    this.setString(rule);
                }
            },
            image_player_zhuang: {
                _run: function() {
                    SetEndOneUserUI_sanDaHaXiangTan(this, MjClient.endoneui.offs[0]);
                }
            },
            image_player_0: {
                _run: function() {
                    if(MjClient.data.sData.tData.maxPlayer == 3) {
                        SetEndOneUserUI_sanDaHaXiangTan(this, MjClient.endoneui.offs[1]);
                    }
                    else {
                        this.visible = false;
                    }
                },
            },
            image_player_1: {
                _run: function() {
                    if(MjClient.data.sData.tData.maxPlayer == 3) {
                        SetEndOneUserUI_sanDaHaXiangTan(this, MjClient.endoneui.offs[2]);
                    }
                    else {
                        this.visible = false;
                    }
                }
            },
            image_player_0_1: {
                _run: function() {
                    if(MjClient.data.sData.tData.maxPlayer == 4) {
                        SetEndOneUserUI_sanDaHaXiangTan(this, MjClient.endoneui.offs[1]);
                    }
                    else {
                        this.visible = false;
                    }
                }
            },
            image_player_1_1: {
                _run: function() {
                    if(MjClient.data.sData.tData.maxPlayer == 4) {
                        SetEndOneUserUI_sanDaHaXiangTan(this, MjClient.endoneui.offs[2]);
                    }
                    else {
                        this.visible = false;
                    }
                }
            },
            image_player_2_1: {
                _run: function() {
                    if(MjClient.data.sData.tData.maxPlayer == 4) {
                        SetEndOneUserUI_sanDaHaXiangTan(this, MjClient.endoneui.offs[3]);
                    }
                    else {
                        this.visible = false;
                    }
                }
            },
        }
    },
    ctor: function() {
        this._super();
        MjClient.endoneui = this;

        var endoneui = ccs.load("endOne_sanDaHaXiangTan.json");

        var offs = [];
        var tData = MjClient.data.sData.tData;
        for (var i = 0; i < 4; i ++)
        {
            var pl = getUIPlayer(i);
            if(!pl)
            {
                continue;
            }
            if (pl.info.uid == tData.uids[tData.zhuang])
                offs.unshift(i);
            else
                offs.push(i);
        }
        MjClient.endoneui.offs = offs;

        BindUiAndLogic(endoneui.node, this.jsBind);
        this.addChild(endoneui.node);

        return true;
    }
});