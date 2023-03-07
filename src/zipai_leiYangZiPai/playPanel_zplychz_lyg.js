//新版耒阳字牌
var playPanel_zplychz_lyg = playLayer_ziPai.extend({
    ctor: function() {
        this._super("Play_ZiPailychz.json");
        var tData = MjClient.data.sData.tData;
        MjClient.MaxPlayerNum_leiyang = tData.maxPlayer;
        MjClient.playui.jsBind._node.addChild(new roundRule_ziPai(roundRule_ziPai.getRoundRules()));
    },
    getJsBind: function() {
        var jsBind = {
            img_cutLine: {
                _event: {
                    HZPickCard: function() {
                        MjClient.playui.checkCutLineVisible(this);
                    },
                    MJJiazhu: function() {
                        MjClient.playui.checkCutLineVisible(this);
                    },
                }
            },
            img_banner: {
                btn_changeBg: {
                    _run: function() {
                        this.loadTextureNormal("playing/ziPaiBanner/wenhao.png");
                        this.setContentSize(this.getNormalTextureSize());
                    },
                    _click: function() {
                        postEvent("EZP_rule");
                    }
                },
                btn_setting: {
                    _click: function() {
                        MjClient.Scene.addChild(new settingPanel_zplychz_lyg(), 6000);
                        MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Shezhi", {
                            uid: SelfUid(),
                            gameType: MjClient.gameType
                        });
                    }
                },
            },
            text_roundInfo: {
                _run: function() {
                    this.visible = false;
                }
            },
            node_eatChoice: {
                img_chiBg: {
                    _visible: false,
                    _layout: [[1, 0],[0.5, 404 / 720],[0, 0]],
                    _run: function() {
                        var width = 0;
                        var cards_select = [];
                        var cards_option = [];
                        this.reset = function() {
                            width = 0;
                            cards_select = [];
                            cards_option = [];
                        }

                        this.calculateOptionCards = function() {
                            var sData = MjClient.data.sData;
                            var tData = sData.tData;
                            var pl = sData.players[SelfUid()];
                            var putCard = tData.lastPutCard;
                            switch (cards_select.length) {
                                case 0:
                                    cards_option = MjClient.majiang.getChiCards(pl.mjhand, putCard);
                                    break;
                                case 1:
                                case 2:
                                case 3:
                                    var hand = pl.mjhand.concat();
                                    hand.push(putCard);
                                    for (var i = 0; i < cards_select.length; i++) {
                                        var row = cards_select[i];
                                        for (var j = 0; j < row.length; j++) {
                                            hand.splice(hand.indexOf(row[j]), 1);
                                        }
                                    }

                                    if (hand.indexOf(putCard) < 0) {
                                        cards_option = [];
                                    } else {
                                        cards_option = MjClient.majiang.getBiCards(hand, putCard);
                                    }
                                    break;
                            }

                            for (var i = 0; i < cards_option.length; i++) {
                                var row = cards_option[i];
                                row.splice(row.indexOf(putCard), 1);
                                row.sort(function(a, b) {
                                    if (a % 20 == b % 20) {
                                        return b - a;
                                    }

                                    return a - b;
                                });
                                row.push(putCard);
                            }
                        }

                        this.adaptChiLayout = function() {
                            this.calculateOptionCards();
                            if (cards_option.length == 0) { // 吃牌选好了
                                if ((MjClient.data.sData.players[SelfUid()].eatFlag & 32) > 0) {
                                    MjClient.showMsg("选择吃后视为过胡，确定吃吗？", function() {
                                        var biCards = cards_select.length > 1 ? cards_select.slice(1) : null;
                                        // HZChiToServer_leiyang(cards_select[0], biCards);
                                        // MjClient.playui.hideEatBtns();
                                        MjClient.playui.commitEatCard(cards_select[0], biCards);
                                        this.visible = false;
                                    }.bind(this), function() {
                                        cards_select.pop();
                                        this.adaptChiLayout();
                                    }.bind(this), "1");
                                } else {
                                    var biCards = cards_select.length > 1 ? cards_select.slice(1) : null;
                                    // HZChiToServer_leiyang(cards_select[0], biCards);
                                    // MjClient.playui.hideEatBtns();
                                    MjClient.playui.commitEatCard(cards_select[0], biCards);
                                    this.visible = false;
                                }

                                return;
                            }

                            this.visible = true;
                            var chiLayout = this.getChildByName("layout_chi");
                            chiLayout.removeAllChildren();
                            width = (cards_select.length + 1) * 205 + cards_option.length * 75;
                            if (cards_option.length >= 2) {
                                width += 15 * (cards_option.length - 1);
                            }

                            // cc.log("width@@ " + width);
                            // console.log("cards_select@@ " + JSON.stringify(cards_select));
                            // console.log("cards_option@@ " + JSON.stringify(cards_option));
                            var pos_x = 1280 / 2 - width / 2;
                            if (pos_x < 210) {
                                pos_x = 1280 - 210 - width;
                            }

                            // 添加已选择的吃牌
                            for (var i = 0; i < cards_select.length; i++) {
                                var chiTipImg = this.getChildByName("img_chiTip").clone();
                                var src = i == 0 ? "playing/paohuzi/chiTip.png" : "playing/paohuzi/biTip.png";
                                chiTipImg.loadTexture(src);
                                chiTipImg.visible = true;
                                chiTipImg.x = pos_x + 130 / 2;
                                chiLayout.addChild(chiTipImg);
                                pos_x += 130;

                                var row = cards_select[i];
                                var highlightImg = this.getChildByName("img_highLight").clone();
                                highlightImg.visible = true;
                                highlightImg.x = pos_x + 75 / 2;
                                highlightImg.y = 142;
                                chiLayout.addChild(highlightImg);
                                for (var j = 0; j < row.length; j++) {
                                    var chiCardImg = this.getChildByName("img_chiCard").clone();
                                    chiCardImg.loadTexture(MjClient.playui.getCardSrc("out", row[j]));
                                    chiCardImg.visible = true;
                                    chiCardImg.x = pos_x + 75 / 2;
                                    chiCardImg.y = 70 * j + 72;
                                    if (j == 2) {
                                        chiCardImg.setColor(cc.color(170, 170, 170));
                                    }
                                    chiLayout.addChild(chiCardImg);
                                    (function(tag) {
                                        chiCardImg.setTouchEnabled(true);
                                        chiCardImg.addTouchEventListener(function(sender, type) {
                                            if (type == 2) {
                                                // cc.log("回到第 " + (tag + 1) + "步");
                                                cards_select = cards_select.slice(0, tag);
                                                this.adaptChiLayout();
                                            }
                                        }.bind(this));
                                    }.bind(this)(i));
                                }

                                pos_x += 75;
                            }

                            // 添加当前可选吃牌
                            var chiTipImg = this.getChildByName("img_chiTip").clone();
                            var src = cards_select.length == 0 ? "playing/paohuzi/chiTip.png" : "playing/paohuzi/biTip.png";
                            chiTipImg.loadTexture(src);
                            chiTipImg.visible = true;
                            chiTipImg.x = pos_x + 130 / 2;
                            chiLayout.addChild(chiTipImg);
                            pos_x += 130;
                            for (var i = 0; i < cards_option.length; i++) {
                                var row = cards_option[i];
                                for (var j = 0; j < row.length; j++) {
                                    var chiCardImg = this.getChildByName("img_chiCard").clone();
                                    chiCardImg.loadTexture(MjClient.playui.getCardSrc("out", row[j]));
                                    chiCardImg.visible = true;
                                    chiCardImg.x = pos_x + 75 / 2;
                                    chiCardImg.y = 70 * j + 72;
                                    if (j == 2) {
                                        chiCardImg.setColor(cc.color(170, 170, 170));
                                    }
                                    chiLayout.addChild(chiCardImg);
                                    (function(tag) {
                                        chiCardImg.setTouchEnabled(true);
                                        chiCardImg.addTouchEventListener(function(sender, type) {
                                            if (type == 2) {
                                                // console.log("选择吃@@ ");
                                                cards_select.push(cards_option[tag]);
                                                this.adaptChiLayout();
                                            }
                                        }.bind(this));
                                    }.bind(this)(i));
                                }
                                pos_x += 90;
                            }
                        }
                    },
                    _event: {
                        showChiLayout: function() {
                            this.reset();
                            this.adaptChiLayout();
                        },
                        EZP_cardType: function(eD) {
                            MjClient.playui.changeCardFrame(this, eD.type);
                        },
                    },
                    img_chiTip: {
                        _visible: false
                    },
                    img_highLight: {
                        _visible: false
                    },
                    img_chiCard: {
                        _visible: false,
                        _run: function() {
                            this.scale = 70 / this.getContentSize().width;
                        }
                    },
                    btn_cancel: {
                        _run: function() {
                            this.x = 1136;
                        },
                        _click: function(sender, et) {
                            sender.parent.visible = false;
                            MjClient.playui.updateEatBtns();
                        }
                    }
                },
                _event: {
                    MJHu: function(eD) {
                    },
                    MJJiazhu: function(eD) {
                        MjClient.playui.updateEatBtns(eD);
                    },
                },
            },
            _event: {
                HZCheckRaise: function(msg) {
                    MjClient.playui.checkRaise(msg);
                },
                MJJiazhu: function(msg){
                    MjClient.playui.showJiaZhuTip();
                },
            },
            node_down: {
                _event: {
                    EZP_cardType: function(eD) {
                        MjClient.playui.changeHandCardSize(this.getChildByName("img_handCard"));
                        var layoutHand = this.getChildByName("layout_handCards");
                        if (layoutHand) {
                            layoutHand.removeAllChildren();
                        }
                        MjClient.playui.refreshHandCard(0);
                        MjClient.playui.changeCardFrame(this, eD.type);
                    }
                },
                layout_head:{
                    text_jiaZhu: {
                        _run: function() {
                            this.visible = false;
                        },
                        _event: {
                            clearCardUI: function(eD) {
                                this.visible = false;
                            },
                            initSceneData: function(eD) {
                                MjClient.playui.checkRaise();
                            }
                        }
                    },
                    text_jiaZhuTip: {
                        _run: function() {
                            this.visible = false;
                        },
                        _event: {
                            clearCardUI: function(eD) {
                                this.visible = false;
                            }
                        }
                    },
                },
                img_putCard: {
                    _layout: [[0.35, 0.35], [0.65, 0.6], [0, 0]],
                    _event: {
                        roundEnd : function() {
                            var sData = MjClient.data.sData;
                            if(sData && sData.tData.currCard == -1) {
                                //跑胡 偎胡
                                this.visible = false;
                            }
                        }
                    }
                },
            },
            node_left: {
                layout_head:{
                    text_jiaZhu: {
                        _run: function() {
                            this.visible = false;
                        },
                        _event: {
                            clearCardUI: function(eD) {
                                this.visible = false;
                            }
                        }
                    },

                    text_jiaZhuTip: {
                        _run: function() {
                            this.visible = false;
                        },
                        _event: {
                            clearCardUI: function(eD) {
                                this.visible = false;
                            }
                        }
                    },
                },
                layout_replayCards:{
                    _event: {
                        roundEnd : function() {
                            var tData = MjClient.data.sData.tData;
                            if (MjClient.rePlayVideo != -1 && tData.currCard == -1) {
                                MjClient.playui.initHandCards(this);
                            }
                        }
                    }
                },
                img_putCard: {
                    _event: {
                        roundEnd : function() {
                            var sData = MjClient.data.sData;
                            if(sData && sData.tData.currCard == -1) {
                                //跑胡 偎胡
                                this.visible = false;
                            }
                        }
                    }
                },
            },
            node_right: {
                layout_head:{
                    text_jiaZhu: {
                        _run: function() {
                            this.visible = false;
                        },
                        _event: {
                            clearCardUI: function(eD) {
                                this.visible = false;
                            }
                        }
                    },
                    text_jiaZhuTip: {
                        _run: function() {
                            this.visible = false;
                        },
                        _event: {
                            clearCardUI: function(eD) {
                                this.visible = false;
                            }
                        }
                    }, 
                },
                layout_replayCards:{
                    _event: {
                        roundEnd : function() {
                            var tData = MjClient.data.sData.tData;
                            if (MjClient.rePlayVideo != -1 && tData.currCard == -1) {
                                MjClient.playui.initHandCards(this);
                            }
                        }
                    }
                },
                img_putCard: {
                    _event: {
                        roundEnd : function() {
                            var sData = MjClient.data.sData;
                            if(sData && sData.tData.currCard == -1) {
                                //跑胡 偎胡
                                this.visible = false;
                            }
                        }
                    }
                },
            },
            
            text_jiazhuWait:{
                _layout: [[0.45, 0.12], [0.504, 0.508], [0, 0]],
                _run: function() {
                    this.visible = false;
                },
                _event: {
                    MJJiazhu: function(msg){
                        this.visible = false;
                    },
                    mjhand: function(eD) {
                        var selfUid = SelfUid()
                        if (eD.jiazhuNums)
                        {
                            for (var key in eD.jiazhuNums)
                            {
                                if (key != selfUid && eD.jiazhuNums[key] == 2){
                                    MjClient.playui._jiazhuWait.visible = true;
                                    break;
                                }
                            }
                        }
                    },
                },
            },
        };
        return jsBind;
    },
});


/**
 * 坎牌是否可操作
 */
playPanel_zplychz_lyg.prototype.is34Mask = function() {
    return true;
};

//Override
playPanel_zplychz_lyg.prototype.createGameOverLayer = function(type) {
    return new GameOverLayer_zplychz();
};

//Override
playPanel_zplychz_lyg.prototype.createEndOneLayer = function(type) {
    return new EndOneView_zplychz_lyg();
};

playPanel_zplychz_lyg.prototype.initSettingData = function() {
    MjClient.KEY_ZI_PAI_PLAY_UI_LAYOUT  = "KEY_ZI_PAI_PLAY_UI_LAYOUT_ZP_LY_CHZ";   //字牌布局
    MjClient.KEY_ZI_PAI_GAME_BG_TYPE  = "KEY_ZI_PAI_GAME_BG_TYPE_ZP_LY_CHZ";   //字牌游戏背景类型
    MjClient.KEY_ZI_PAI_ZI_PAI_TYPE  = "KEY_ZI_PAI_ZI_PAI_TYPE_ZP_LY_CHZ";   //字牌类型
    MjClient.KEY_ZI_PAI_SU_DU_TYPE  = "KEY_ZI_PAI_SU_DU_TYPE_ZP_LY_CHZ";   //字牌游戏 动画速度
    MjClient.KEY_ZI_PAI_PLAY_TING_PAI  = "KEY_ZI_PAI_PLAY_TING_PAI_ZP_LY_CHZ";   //听牌提示
    MjClient.KEY_ZI_PAI_CARD_SIZE = "KEY_ZI_PAI_CARD_SIZE_ZP_LY_CHZ"; // 字牌大小
};

playPanel_zplychz_lyg.prototype.getGameBgList = function() {
    return ["playing/anhuapaohuzi/bg/beijing_1.jpg", "playing/anhuapaohuzi/bg/beijing_2.jpg", "playing/anhuapaohuzi/bg/beijing_3.jpg"];
};
//Override
playPanel_zplychz_lyg.prototype.getDefaultSetting = function() {
    return {
        layout: 0,
        bg: 2,
        pai: 1,
        fastEat: 0,
        huXi: 1,
        xuXian: 0,
        suDu: 0,
        size: 0,
        voice: 1,
        ting: 0,
        chuBtn: 0,
        dblClick: 1,
        chuGuide:0,
    };
};

/**
 * 是否需要听听牌提示
 * @returns {boolean}
 */
playPanel_zplychz_lyg.prototype.hasTingByPut = function() {
    return true;
};

playPanel_zplychz_lyg.prototype.isCheckTingStats = function() {
    return true;
};

/**
 * 计算听牌提示
 */
playPanel_zplychz_lyg.prototype.calculateHintPutList = function() {
    MjClient.hintPutList_ziPai = MjClient.huzi.hintPutCardsToTing();
};

//获取听的牌
playPanel_zplychz_lyg.prototype.getTingCards = function(sData, pl, putCard) {
    return MjClient.huzi.getTingCards(sData, pl, putCard);
};

playPanel_zplychz_lyg.prototype.showSelectEatCards = function(){
    postEvent("showChiLayout");
};

/**
 * 获取吃碰效果图
 * @param eatType
 */
playPanel_zplychz_lyg.prototype.getEatLabel = function(eatType) {
    if (eatType == "mjchi") {
        var tData = MjClient.data.sData.tData;
        var pl = MjClient.data.sData.players[tData.uids[tData.curPlayer]];
        var mjchi = pl.mjchi;
        var eatAndBiCards = mjchi[mjchi.length - 1];
        var biCards = eatAndBiCards.biCards;

        if (biCards) {
            return "playing/paohuzi/t_xiahuo.png";
        }else{
            return "playing/paohuzi/t_chi.png"; 
        }
    }
    return null;
};

//Override
playPanel_zplychz_lyg.prototype.checkCardCanPut = function(pl, card) {
    return  (!pl.canNotPutCard || pl.canNotPutCard.indexOf(card)==-1 || MjClient.majiang.getCanPutCardNum(pl) == 0);
};

playPanel_zplychz_lyg.prototype.isShowLongCard = function() {
    return true;
};

playPanel_zplychz_lyg.prototype.doPut = function(card, btn, col, row) {
    var pl = MjClient.playui.getUIPlayer(0);
    if(pl.limitHuPutCard && pl.limitHuPutCard.indexOf(card) != -1){
        var tData = MjClient.data.sData.tData;
        MjClient.showMsg("吃边打边，这局将只能胡"+ MjClient.majiang.getLimitHuDesc(card, tData)+"，是否确定？",
            function(){
                pl.canNotPutCard = [];
                playLayer_ziPai.prototype.doPut.apply(MjClient.playui, [card, btn, col, row]);
                MjClient.playui.refreshHandCard(0);
            },
            function(){
                btn.setAnchorPoint(0, 0);
                if(MjClient.playui.isCheckTingStats()){
                    MjClient.playui.checkTingStats();
                }else{
                    MjClient.playui.checkTingCards();
                }
                MjClient.playui.refreshHandCard(0);
                delete MjClient.moveCard;
            }, "1");
    }else{
        pl.canNotPutCard = [];
        playLayer_ziPai.prototype.doPut.apply(MjClient.playui, [card, btn, col, row]);
    }
};

/**
 * 举手
 */
playPanel_zplychz_lyg.prototype.checkRaise = function(msg) {
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    for (var i = 0; i < tData.uids.length; ++i) {
        var uid = tData.uids[i];
        var pl = sData.players[uid];
        if (!pl) {continue;}
        if (pl.jiazhuNum == 2 && MjClient.rePlayVideo == -1)
        {
            if (SelfUid() == uid) {
                var layer = new laZhangLayer();
                MjClient.playui.addChild(layer, 99);
                if (MjClient.webViewLayer != null) {
                    MjClient.webViewLayer.close();
                }
            }
            else
            {
                MjClient.playui.jsBind.text_jiazhuWait._node.visible = true;
            }
        }else if(pl.jiazhuNum == 1){
            MjClient.playui.setJiaZhuNum(pl);
        }
    }
};

playPanel_zplychz_lyg.prototype.getPlayerNodeList = function(){
    var bindList = [];
    var jsBind =  MjClient.playui.jsBind;
    switch (MjClient.playui.getPlayersNum()) {
        case 2:
            if (MjClient.playui.isLeftTop()) {
                bindList = [jsBind.node_down, jsBind.node_left];
            } else {
                bindList = [jsBind.node_down, jsBind.node_right];
            }
            break;
        case 3:
            bindList = [jsBind.node_down, jsBind.node_right, jsBind.node_left];
            break;
    }
    return bindList;
}


playPanel_zplychz_lyg.prototype.setJiaZhuNum = function(pl){
    var tData = MjClient.data.sData.tData;
    var off = MjClient.playui.getUIOffByUid(pl.info.uid);
    var nodeList = MjClient.playui.getPlayerNodeList();
    var node =  nodeList[off].layout_head.text_jiaZhu._node
    if(pl.jiazhuNum == 1) {
        node.visible = true;
        node.ignoreContentAdaptWithSize(true);
        node.setString("举手");  
    }else{
        node.setString("");
    }
};

playPanel_zplychz_lyg.prototype.showJiaZhuTip = function()
{
    var tData = MjClient.data.sData.tData;
    if (!tData.areaSelectMode.jushou)
        return;
    for (var i = 0; i < tData.uids.length; ++i)
    {
        var uid = tData.uids[i];
        var pl = sData.players[uid];
        if (!pl) 
            continue;
        if (pl.jiazhuNum != 1 && pl.jiazhuNum != 0)
            continue;
        MjClient.playui.setJiaZhuNum(pl);
        var off = MjClient.playui.getUIOffByUid(pl.info.uid);
        var uiNode =  MjClient.playui.getPlayerNodeList()[off];
        var eatDisplayNode = uiNode.layout_eatDisplay._node
        var tipNode = uiNode.layout_head.text_jiaZhuTip._node;
        var point = eatDisplayNode.convertToWorldSpace(eatDisplayNode.getChildByName("img_hu").getPosition());
        var nspPoint = tipNode.parent.convertToNodeSpace(point);
        nspPoint.y = nspPoint.y-10;
        tipNode.scale = 0.8
        tipNode.setPosition(nspPoint);
        tipNode.visible = true;
        tipNode.opacity = 255;
        tipNode.ignoreContentAdaptWithSize(true);
        tipNode.setString(pl.jiazhuNum == 1 ? "举手做声" : "");
        tipNode.runAction(cc.sequence(cc.delayTime(1), cc.fadeOut(0.5), cc.callFunc(function(){ this.visible = false;}, tipNode)));
    }
};

// 是否在对战中 (可操作牌)
playPanel_zplychz_lyg.prototype.isInPlay = function() {
    var tData = MjClient.data.sData.tData;
    if (tData.tState == TableState.roundFinish && MjClient.rePlayVideo != -1 && tData.currCard == -1) {
        return true;
    }
    if (tData.tState == TableState.waitCard || tData.tState == TableState.waitPut || tData.tState == TableState.waitEat || tData.tState == TableState.waitJiazhu) {
        return true;
    }

    return false;
};

//吃牌
playPanel_zplychz_lyg.prototype.commitEatCard = function(eatCards, biArr) {
    var self = this;
    var tData = MjClient.data.sData.tData;
    var msg = {
        cmd: "MJChi",
        eatCards: eatCards,
        cardNext: tData.cardNext,
        card: tData.lastPutCard
    };
    if (biArr) {
        msg.biCards = biArr;
    }
    self.hideEatBtns();
    MjClient.gamenet.request("pkroom.handler.tableMsg", msg);
};

// 是否当前吃牌玩家
playPanel_zplychz_lyg.prototype.isCurEatPlayer = function(msg, off) {
    if (msg && msg.cpginfo && msg.cpginfo.uid) {
        return (msg.cpginfo.uid == this.getUIPlayer(off).info.uid);
    } else {
        return this.isCurPlayer(off);
    }
};

/**
 * 坎/龙是否置灰
 * @returns {boolean}
 */
playPanel_zplychz_lyg.prototype.is34ColorGrey = function() {
    return false;
};

//字牌大小列表
playPanel_zplychz_lyg.prototype.getCardSizeList = function() {
    return ["big", "big", "big"];
};

// 2人布局 对家在左上还是右上
playPanel_zplychz_lyg.prototype.isLeftTop = function() {
    return false;
};