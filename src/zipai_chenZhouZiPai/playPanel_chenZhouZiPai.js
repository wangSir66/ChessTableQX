// 郴州字牌
var playLayer_chenZhouZiPai;
(function() {
    playLayer_chenZhouZiPai = playLayer_ziPai.extend({
        getJsBind: function(){
            var jsBind = {
                text_roundInfo: {
                    _run: function () {
                        if (MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ || MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP) {
                            this.visible = false;
                        }
                    },
                },
                node_left:{
                    layout_head: {
                         img_chuiTips: {
                             _run: function() {
                                MjClient.playui.setChuiTips(this);
                            },
                            _event:{
                                initSceneData: function() {
                                    MjClient.playui.setChuiTips(this);
                                },
                                MJJiazhu: function(msg) {
                                    var pl = MjClient.playui.getUIPlayer(MjClient.playui.getUIOffByNode(this));
                                    if (pl.info.uid == msg.uid) {
                                        MjClient.playui.setChuiTips(this);
                                    }
                                },
                                mjhand: function() {
                                    this.visible = false;
                                },
                                startShuffleCards:function () {
                                    MjClient.playui.setChuiTips(this);
                                }
                            }
                        },
                    }
                },
                node_right:{
                    layout_head: {
                         img_chuiTips: {
                             _run: function() {
                                MjClient.playui.setChuiTips(this);
                            },
                            _event:{
                                initSceneData: function() {
                                    MjClient.playui.setChuiTips(this);
                                },
                                MJJiazhu: function(msg) {
                                    var pl = MjClient.playui.getUIPlayer(MjClient.playui.getUIOffByNode(this));
                                    if (pl.info.uid == msg.uid) {
                                        MjClient.playui.setChuiTips(this);
                                    }
                                },
                                mjhand: function() {
                                    this.visible = false;
                                },
                                startShuffleCards:function () {
                                    MjClient.playui.setChuiTips(this);
                                }
                            }
                        },
                    }
                },
                node_xing:{
                    layout_head: {
                         img_chuiTips: {
                             _run: function() {
                                MjClient.playui.setChuiTips(this);
                            },
                            _event:{
                                initSceneData: function() {
                                    MjClient.playui.setChuiTips(this);
                                },
                                MJJiazhu: function(msg) {
                                    var pl = MjClient.playui.getUIPlayer(MjClient.playui.getUIOffByNode(this));
                                    if (pl.info.uid == msg.uid) {
                                        MjClient.playui.setChuiTips(this);
                                    }
                                },
                                mjhand: function() {
                                    this.visible = false;
                                },
                                startShuffleCards:function () {
                                    MjClient.playui.setChuiTips(this);
                                }
                            }
                        },
                    }
                },
                node_down:{
                    layout_head: {
                         img_chuiTips: {
                             _run: function() {
                                MjClient.playui.setChuiTips(this);
                            },
                            _event:{
                                initSceneData: function() {
                                    MjClient.playui.setChuiTips(this);
                                },
                                MJJiazhu: function(msg) {
                                    var pl = MjClient.playui.getUIPlayer(MjClient.playui.getUIOffByNode(this));
                                    if (pl.info.uid == msg.uid) {
                                        MjClient.playui.setChuiTips(this);
                                    }
                                },
                                mjhand: function() {
                                    this.visible = false;
                                },
                                startShuffleCards:function () {
                                    MjClient.playui.setChuiTips(this);
                                }
                            }
                        },
                    }
                },
                btn_putCrad:{
                    _visible: false,
                    _layout: [[0.185, 0.143], [0.75, isIPhoneX() ? 0.6 : 0.5], [0, 0], true],
                    _click: function() {
                        if (MjClient.selectCard_paohuzi !== null && cc.sys.isObjectValid(MjClient.selectCard_paohuzi)){
                            if (MjClient.selectCard_paohuzi.putCardCb){
                                MjClient.selectCard_paohuzi.putCardCb();
                            }
                            MjClient.selectCard_paohuzi = null;
                        }
                    },
                    _event: {
                        EZP_chuPai:function () {
                            MjClient.playui.checkPutCardBtnVisible(this);
                            if (MjClient.playui.getChuPaiType() == 0){
                                MjClient.playui.refreshHandCard(0);
                            }
                        },
                        initSceneData: function() {
                            MjClient.playui.checkPutCardBtnVisible(this);
                        },
                        HZCheckRaise: function() {
                            MjClient.playui.checkPutCardBtnVisible(this);
                        },
                        HZChiCard: function() {
                            MjClient.playui.checkPutCardBtnVisible(this);
                        },
                        MJPeng: function() {
                            MjClient.playui.checkPutCardBtnVisible(this);
                        },
                        HZWeiCard: function() {
                            MjClient.playui.checkPutCardBtnVisible(this);
                        },
                        HZGangCard: function() {
                            MjClient.playui.checkPutCardBtnVisible(this);
                        },
                        MJPass: function() {
                            MjClient.playui.checkPutCardBtnVisible(this);
                        },
                        MJPut:function () {
                            MjClient.playui.checkPutCardBtnVisible(this);
                        },
                        EZP_xuXian: function() {
                            MjClient.playui.checkPutCardBtnVisible(this);
                        }
                    },
                },
                img_banner:{
                    btn_setting: {
                        _click: function() {
                            cc.log("btn_setting");
                            MjClient.Scene.addChild(new setting_chenZhouZiPai(), 6000);
                            MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Shezhi", {uid:SelfUid(),gameType:MjClient.gameType});
                        }
                    },
                    btn_changeBg: {
                        _run: function () {
                            if (MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ || MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP) {
                                this.loadTextureNormal("playing/ziPaiBanner/wenhao.png");
                                this.setContentSize(this.getNormalTextureSize());
                            } else {
                                this.visible = !MjClient.playui.isCoinField();
                            }
                        },
                        _click: function () {
                            if (MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ || MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP) {
                                postEvent("EZP_rule");
                            } else {
                                MjClient.playui.changeGameBgToNext();
                            }
                        }
                    },
                },
                node_eatChoice: {
                    btn_cancel: {
                        _run: function(){
							//重载
                            this.changeLayout = function() {
                                if (MjClient.playui.getPlayersNum() == 4) {return;}
                                setWgtLayout(this, [0, 0.16], [0.78, 0.3], [0, 1.12]);
                            }
                        },
                    },
                },
                btns_piao:{
                    _visible:false,
                    _layout: [[0.006, 0.006], [0.5, 0.5], [0, 0]],
                    _run:function() {
                    },
                    _event: {
                        initSceneData: function() {
                           MjClient.playui.showPiaoBtns(this);
                        },
                        waitJiazhu:function (msg) {
                            var pl = MjClient.playui.getUIPlayer(0);
                            pl.piaoFen = -1;
                            MjClient.playui.showPiaoBtns(this);
                        },
                        MJJiazhu: function(msg) {
                            if(!msg.uid || msg.piaoFen == undefined)
                                return;
                            if (msg.piaoFen != -1 && msg.uid == SelfUid()) {
                                this.setVisible(false);
                            }
                        },
                        mjhand: function(eD) {
                            this.visible = false;
                        },
                    },
                    btn_piao0: {
                        _click:function() {
                            var pl = MjClient.playui.getUIPlayer(0);
                            MjClient.playui.paioFenToServer(0);
                        },
                    },
                    btn_piao1: {
                        _click:function() {
                            var pl = MjClient.playui.getUIPlayer(0);
                            MjClient.playui.paioFenToServer(1);
                        },
                    },
                    btn_piao2: {
                        _click:function() {
                            var pl = MjClient.playui.getUIPlayer(0);
                            MjClient.playui.paioFenToServer(2);
                        },
                    },
                    btn_piao3: {
                        _click:function() {
                            var pl = MjClient.playui.getUIPlayer(0);
                            MjClient.playui.paioFenToServer(3);
                        },
                    },
                },
                btn_chat: {
                    _run: function() {
                        //重载
                        this.changeLayout = function() {
                            if (MjClient.playui.getPlayersNum() == 4) {return;}
                            setWgtLayout(this, [55 / 1280, 0], [0.97, 0.187], [0, 0]);
                        }
                        
                    },
                },
                btn_voice: {
                    _run: function() {
                        this.visible = !MjClient.playui.isCoinField();
                        initVoiceData();
                        cc.eventManager.addListener(getTouchListener(), this);
                        if (MjClient.isShenhe) this.visible = false;

                        //重载
                        this.changeLayout = function() {
                            if (MjClient.playui.getPlayersNum() == 4) {return;}
                            setWgtLayout(this, [43 / 1280, 0], [0.91, 0.1875], [0, 0]);
                        }
                    }
                },
            };
            return jsBind;
        },
        ctor: function() {
            this._super("Play_ZiPaiChenZhou.json");
            if(MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ || MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP){
                MjClient.playui.jsBind._node.addChild(new roundRule_ziPai(roundRule_ziPai.getRoundRules()));
            }
            return true;
        },
    });
}());

playLayer_chenZhouZiPai.prototype.initSettingData = function() {
    MjClient.KEY_ZI_PAI_PLAY_UI_LAYOUT  = "KEY_ZI_PAI_PLAY_UI_LAYOUT_CHEN_ZHOU_ZI_PAI";   //字牌布局
    MjClient.KEY_ZI_PAI_GAME_BG_TYPE  = "KEY_ZI_PAI_GAME_BG_TYPE_CHEN_ZHOU_ZI_PAI";   //字牌游戏背景类型
    MjClient.KEY_ZI_PAI_ZI_PAI_TYPE  = "KEY_ZI_PAI_ZI_PAI_TYPE_CHEN_ZHOU_ZI_PAI";   //字牌类型
    MjClient.KEY_ZI_PAI_SU_DU_TYPE  = "KEY_ZI_PAI_SU_DU_TYPE_CHEN_ZHOU_ZI_PAI";   //字牌游戏 动画速度
    MjClient.KEY_ZI_PAI_PLAY_TING_PAI  = "KEY_ZI_PAI_PLAY_TING_PAI_CHEN_ZHOU_ZI_PAI";   //听牌提示
    MjClient.KEY_ZI_PAI_VOICE_TYPE = "KEY_ZI_PAI_VOICE_TYPE_CHEN_ZHOU_ZI_PAI"; // 字牌游戏语音
    MjClient.KEY_ZI_PAI_CHU_PAI_TYPE = "KEY_ZI_PAI_CHU_PAI_CHEN_ZHOU_ZI_PAI"; // 字牌出牌按钮
    MjClient.KEY_ZI_PAI_CARD_SIZE = "KEY_ZI_PAI_CARD_SIZE_CHEN_ZHOU_ZI_PAI"; // 字牌大小
};

//Override
playLayer_chenZhouZiPai.prototype.createGameOverLayer = function(type) {
    return new GameOverLayer_chenZhouZiPai();
};

//Override
playLayer_chenZhouZiPai.prototype.createEndOneLayer = function(type) {
    return new EndOneView_chenZhouZiPai();
};

//Override
playLayer_chenZhouZiPai.prototype.getGameBgList = function() {
    return ["playing/anhuapaohuzi/bg/beijing_1.jpg", "playing/anhuapaohuzi/bg/beijing_2.jpg", "playing/anhuapaohuzi/bg/beijing_3.jpg"];
};

//Override
playLayer_chenZhouZiPai.prototype.getGameBgIdx = function() {
    return util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_GAME_BG_TYPE, 2);
};

//Override
playLayer_chenZhouZiPai.prototype.setCardTouchHandler = function(card,off){
    var self = this;
    var pl = this.getUIPlayer(off);
    var dict = {};
    for (var i = 0; i < pl.mjhand.length; i++) {
        var cd = pl.mjhand[i];
        dict[cd] = dict[cd] ? dict[cd] + 1 : 1;
    }

    if (dict[card.tag] >= 3) {
        card.setColor(cc.color(170, 170, 170));
        card.addTouchEventListener(null);
        card.setTouchEnabled(false);
        if (MjClient.movingCard_paohuzi == card) {
            MjClient.movingCard_paohuzi = null;
        }
        return;
    }

    card.setColor(cc.color(255, 255, 255));

    var cloneCard = null;
    card.addTouchEventListener(function(btn, eventType) {
        if (MjClient.movingCard_paohuzi !== null && cc.sys.isObjectValid(MjClient.movingCard_paohuzi) && MjClient.movingCard_paohuzi !== btn) {
            return;
        }

        if (MjClient.isRefreshNodeing || MjClient.isDealing) {
            return;
        }

        if (eventType == ccui.Widget.TOUCH_BEGAN) {
            MjClient.selectCard_paohuzi = null;
            MjClient.movingCard_paohuzi = btn;
            if (MjClient.playui.isShowCloneCard()) { // 添加残影
                if (cc.sys.isObjectValid(cloneCard)) {
                    cloneCard.removeFromParent(true);
                }

                cloneCard = btn.clone();
                cloneCard.opacity = 100;
                cloneCard.setTouchEnabled(false);
                var src = MjClient.playui.getCardSrc("hand", btn.tag, false);
                //cloneCard.loadTexture(src, MjClient.playui.getResType());
                MjClient.playui.loadCardTexture(cloneCard, src, MjClient.playui.getResType());
                btn.parent.addChild(cloneCard);
            }

            btn.parent.zIndex = 1;
            btn.zIndex = 5;
            btn.setAnchorPoint(0.5, 0.5);
            btn.x += btn.width * btn.scaleX * 0.5;
            btn.y += btn.height * btn.scaleY * 0.5;
            // updateBtnMovedPosition_hengYang(btn, eventType);
            if (Array.isArray(MjClient.hintPutList_ziPai) && MjClient.hintPutList_ziPai.indexOf(btn.tag) >= 0) {
                if (MjClient.playui.hasTingByPut()) {
                    MjClient.playui.checkTingCardsNew(btn.tag);
                }else if(MjClient.playui.isCheckTingStats()){
                    MjClient.playui.checkTingStats(btn.tag);
                } else {
                    MjClient.playui.checkTingCards(btn.tag);
                }
            }

            if (MjClient.playui.isShowLongCard()) { // 显示长牌
                 var alignWidth = btn.scale * btn.width;
                var src = MjClient.playui.getCardSrc("put", btn.tag, false);
                btn.loadTexture(src, 0);
                btn.scale = alignWidth / btn.width;
                var tingSign = btn.getChildByName("tingSign");
                if (cc.sys.isObjectValid(tingSign) && tingSign.isVisible()) {
                    tingSign.y = btn.getContentSize().height;
                }
            }
        }

        if (eventType == ccui.Widget.TOUCH_MOVED) {
            btn.setPosition(cc.pSub(btn.getTouchMovePosition(), btn.parent.getPosition()));
            // updateBtnMovedPosition_hengYang(btn, eventType);
        }

        if (eventType == ccui.Widget.TOUCH_ENDED || eventType == ccui.Widget.TOUCH_CANCELED) {
            MjClient.movingCard_paohuzi = null;
            // updateBtnMovedPosition_hengYang(btn, eventType);
            MjClient.moveCard = {};
            MjClient.moveCard.curPosition = btn.parent.convertToWorldSpace(cc.p(btn.x - btn.anchorX * btn.width * btn.scaleX,  btn.y - btn.anchorY * btn.height * btn.scaleY));
            var col = MjClient.moveCard.curCIndex = MjClient.moveCard.nexCIndex = btn.parent.tag;
            var row = MjClient.moveCard.curRIndex = MjClient.moveCard.nexRIndex = btn.name;
            var pos = btn.getTouchEndPosition();
            var card = btn.tag;

            if (cc.sys.isObjectValid(cloneCard)) {
                cloneCard.removeFromParent(true);
            }

            if (MjClient.playui.isShowLongCard()) {
                var src = MjClient.playui.getCardSrc("hand", btn.tag, false);
                //btn.loadTexture(src, MjClient.playui.getResType());
                MjClient.playui.loadCardTexture(btn, src, MjClient.playui.getResType());
                btn.scale = cc.director.getWinSize().width / 1280;
            }

            if (!Array.isArray(MjClient.HandCardArr[col]) || MjClient.HandCardArr[col][row] != card) {
                if(MjClient.playui.isCheckTingStats()){
                    MjClient.playui.checkTingStats();
                }else{
                    MjClient.playui.checkTingCards();
                }
                MjClient.playui.refreshHandCard(0);
                delete MjClient.moveCard;
                return;
            }

            var tData = MjClient.data.sData.tData;

            var resetPos = function(){
                var dstCol = col + Math.round((pos.x - btn.parent.x) / (btn.parent.width * btn.scaleX) - 0.5); // 目的列
                // cc.log("dstCol@@ ", dstCol);
                if (dstCol == col) { // 列未变
                    MjClient.HandCardArr[col].splice(parseInt(row), 1);
                    MjClient.playui.fixArrIndex(MjClient.HandCardArr[dstCol], card, btn);
                } else if (dstCol >= 0 && dstCol < MjClient.HandCardArr.length) { // 当前有手牌列
                    if (MjClient.HandCardArr[dstCol].length < 4) { // 插牌
                        MjClient.moveCard.nexCIndex = dstCol;
                        MjClient.HandCardArr[col].splice(row, 1);
                        MjClient.playui.fixArrIndex(MjClient.HandCardArr[dstCol], card, btn);
                    }
                } else if (MjClient.HandCardArr.length < 10){ // 最前或最后 新增一列
                    MjClient.HandCardArr[col].splice(parseInt(row), 1);
                    if (dstCol < 0) {
                        MjClient.HandCardArr.unshift([card]);
                        MjClient.addGroupIndex = 0;
                    } else if (dstCol >= MjClient.HandCardArr.length) {
                        MjClient.HandCardArr.push([card]);
                        MjClient.addGroupIndex = MjClient.HandCardArr.length - 1;
                    }

                    MjClient.moveCard.nexCIndex = MjClient.addGroupIndex;
                    MjClient.moveCard.nexRIndex = 0;
                }
                btn.setAnchorPoint(0, 0);
            }

            var putCardCb = function () {
                if(!MjClient.hasPut && IsTurnToMe() && tData.tState == TableState.waitPut)
                {
                    function doPut() {
                        var putNode = MjClient.playui.getUINode(0).getChildByName("img_putCard");
                        putNode.stopAllActions();
                        putNode.visible = true;
                        putNode.opacity = 255;
                        var src = self.getCardSrc("put", card, false);
                        putNode.getChildByName("img_card").loadTexture(src, 0); // todo
                        putNode.loadTexture("playing/paohuzi/chupai_bj.png");

                        var pos = putNode.getUserData().pos;

                        var p = btn.parent.convertToWorldSpace(cc.p(btn.x + (0.5 - btn.anchorX) * btn.width * btn.scaleX, btn.y + (0.5 - btn.anchorY) * btn.height * btn.scaleY));
                        putNode.setPosition(putNode.parent.convertToNodeSpace(p));
                        putNode.setScale(putNode.getUserData().scale);
                        putNode.runAction(cc.moveTo(MjClient.playui.getActionTime(), pos.x, pos.y));
                        btn.removeFromParent(true);

                        if (!Array.isArray(MjClient.HandCardArr[col]) || MjClient.HandCardArr[col][row] != card) {
                            putNode.visible = false;
                            if(MjClient.playui.isCheckTingStats()){
                                MjClient.playui.checkTingStats();
                            }else{
                                MjClient.playui.checkTingCards();
                            }
                            MjClient.playui.refreshHandCard(0);
                            delete MjClient.moveCard;
                            return;
                        }

                        MjClient.hasPut = true;
                        MjClient.HandCardArr[col].splice(row, 1);
                        MjClient.gamenet.request("pkroom.handler.tableMsg", {
                            cmd: "MJPut",
                            card: card
                        });
                        MjClient.playui.checkCutLineVisible();
                        MjClient.playui.checkPutCardBtnVisible();
                    }

                    if (self.isOtherWei(card)) {
                        MjClient.showMsg("放偎之后这局将不能再吃碰，是否确定？", function() {
                            doPut();
                            MjClient.playui.refreshHandCard(0);
                            delete MjClient.moveCard;
                        }, function() {
                            btn.setAnchorPoint(0, 0);
                            if(MjClient.playui.isCheckTingStats()){
                                MjClient.playui.checkTingStats();
                            }else{
                                MjClient.playui.checkTingCards();
                            }
                            MjClient.playui.refreshHandCard(0);
                            delete MjClient.moveCard;
                        }, "1");

                        return;
                    } else {
                        doPut();
                        MjClient.playui.refreshHandCard(0);
                    }
                }
                else {
                    resetPos();
                    MjClient.playui.refreshHandCard(0);
                }
                
            };

            if (pos.y > MjClient.playui.jsBind.img_cutLine._node.y) {
                putCardCb();
            }else{
                resetPos();
                MjClient.playui.refreshHandCard(0);
                if (!MjClient.hasPut && IsTurnToMe() && tData.tState == TableState.waitPut){
                    if (MjClient.playui.getChuPaiType() == 0) {
                        MjClient.selectCard_paohuzi = btn;
                        MjClient.selectCard_paohuzi.setColor(cc.color(170, 170, 170));
                        MjClient.selectCard_paohuzi.putCardCb = putCardCb;

                        col = btn.parent.tag;
                        row = btn.name;
                    }
                }
            }

            if (MjClient.playui.hasTingByPut()) {
                MjClient.playui.checkTingCardsNew();
            } else if(MjClient.playui.isCheckTingStats()){
                MjClient.playui.checkTingStats();
            }else{
                MjClient.playui.checkTingCards();
            }
            MjClient.addGroupIndex = -1;
            delete MjClient.moveCard;
        }
    });   
};

playLayer_chenZhouZiPai.prototype.changeEatBtnLayout = function(btnNode, len, idx) {
    setWgtLayout(btnNode, [0, 0.20], [0.88 - (len - 1 - idx) * 0.12, 0.11], [ 0, 1.8], false, false);
};

//出牌按钮
playLayer_chenZhouZiPai.prototype.checkPutCardBtnVisible = function(node) {
    node = node || MjClient.playui.jsBind.btn_putCrad._node;
    node.visible = !MjClient.hasPut && this.getChuPaiType() == 0 && (IsTurnToMe() && MjClient.data.sData.tData.tState == TableState.waitPut);
}

//飘分
playLayer_chenZhouZiPai.prototype.paioFenToServer = function(index) {
    var tData = MjClient.data.sData.tData;
    if (tData.areaSelectMode.piaoFen == 0){
        return;
    }
    var piaoFen = [[0,1,2,3],[0,2,3,5]][tData.areaSelectMode.piaoFen - 1][index];
    if (piaoFen == undefined){
        piaoFen = 0;
    }
    MjClient.gamenet.request("pkroom.handler.tableMsg", {
        cmd: "MJJiazhu",
        piaoFen: piaoFen,
    });
}

//Override
playLayer_chenZhouZiPai.prototype.isShowLongCard = function(){
    return true;
}

//飘风操作的提示显示
playLayer_chenZhouZiPai.prototype.setChuiTips = function(node) {
    node.visible = false;
    var tData = MjClient.data.sData.tData;
    var off = this.getUIOffByNode(node);
    var pl = this.getUIPlayer(off);
    if (!pl || pl.piaoFen == undefined  || pl.piaoFen < 0 || tData.areaSelectMode.piaoFen == 0) {
        return;
    }

    if (tData.tState == TableState.waitJiazhu) {
        node.visible = true;
        node.loadTexture("playing/chenzhouzipai/xian_piao" + pl.piaoFen + ".png");
    }
};

//显示飘风按钮
playLayer_chenZhouZiPai.prototype.showPiaoBtns = function(node) {
    node.visible = false;
    var tData = MjClient.data.sData.tData;
    var pl = this.getUIPlayer(0);
    if (!pl) {return;}
    
    if (tData.tState == TableState.waitJiazhu && pl.piaoFen == -1 && tData.areaSelectMode.piaoFen > 0) {
        node.visible = true;
        var piaoRes = [[1,2,3],[2,3,5]][tData.areaSelectMode.piaoFen - 1];
        for (var i = 0; i < 3; ++ i){
            var btn = node.getChildByName("btn_piao" + (i + 1));
            if (btn){
                btn.loadTextureNormal("playing/chenzhouzipai/piao" + piaoRes[i] + ".png");
                btn.loadTexturePressed("playing/chenzhouzipai/piao" + piaoRes[i] + "_s.png");
            }
        }
    }
};

//Override
playLayer_chenZhouZiPai.prototype.checkChuiFlagVisible = function(node) {
    node.visible = false;
    var tData = MjClient.data.sData.tData;
    var off = this.getUIOffByNode(node);
    var pl = this.getUIPlayer(off);

    if (!pl || pl.piaoFen == undefined  || pl.piaoFen < 0 || tData.areaSelectMode.piaoFen == 0) {
        return;
    }

    if (tData.tState == TableState.waitCard || tData.tState == TableState.waitEat || tData.tState == TableState.waitPut || tData.tState == TableState.waitShuffle) {
        node.visible = true;
        if(pl.piaoFen > 0) {
            node.loadTexture("playing/ziPaiBanner/piao" + pl.piaoFen + ".png");
        }else{
            node.loadTexture("playing/ziPaiBanner/bupiao.png");
        }
    }
};

playLayer_chenZhouZiPai.prototype.getInitDiPaiCount = function() {
    var tData = MjClient.data.sData.tData;
    if (tData.areaSelectMode.isShiWuZhang || tData.maxPlayer == 4) {
        return MjClient.majiang.getAllCardsTotal() -  tData.maxPlayer * 14;
    }else{
        return MjClient.majiang.getAllCardsTotal() -  tData.maxPlayer * 20;
    } 
};

//Override
playLayer_chenZhouZiPai.prototype.doSelectEatAction = function(arr, isScale) {
    if (!arr || arr.length == 0) {
        return;
    }
    var gap = 5;
    isScale = isScale === undefined ? true : isScale;
    var len = arr.length;
    var w = 0;
    for (var i = 0; i < len; i++) {
        var node = arr[i];
        if (node && node.width) {
            w += node.width * node.scale;
            w += gap;
        }
    }

    //初始的缩放值
    var initChiBgScale = MjClient.playui.jsBind.node_eatChoice.img_chiSelect._node.initChiBgScale;
    var scaleActionNode = arr[len - 1];

    var width = cc.winSize.width * 0.91;
    var beginX = width < w ? 0 : (width - w);
    arr.reverse();

    for (var i = 0; i < len; i++) {
        var node = arr[i];
        if (node) {
            node.stopAllActions();
            beginX += node.width * 0.5 * initChiBgScale + gap;
            //最后一个节点缩放
            if (node == scaleActionNode) {
                node.x = beginX;
                if (isScale) {
                    node.scale = 0.1;
                    var ac = cc.scaleTo(0.1, initChiBgScale).easing(cc.easeExponentialOut(0.1));
                    node.runAction(ac);
                }
                //其他节点位移
            } else {
                node.scale = initChiBgScale;
                var p = cc.p(beginX, node.y);
                var ac = cc.moveTo(0.2, p).easing(cc.easeExponentialOut(0.2));
                node.runAction(ac);
            }
            beginX += node.width * 0.5 * initChiBgScale;
        }
    }
};

playLayer_chenZhouZiPai.prototype.getResType = function () {
    return 1;
};

//Override
playLayer_chenZhouZiPai.prototype.getHandCount = function() {
    var tData = MjClient.data.sData.tData;
    if (tData.maxPlayer == 4 || tData.areaSelectMode.isShiWuZhang) {
        return 14;
    }

    return 20;
}

playLayer_chenZhouZiPai.prototype.isCheckTingStats = function() {
    return true;
}

playLayer_chenZhouZiPai.prototype.getTingStats = function(putCard) {
    var sData = MjClient.data.sData;
    var pl = sData.players[SelfUid()];
    return MjClient.majiang.getTingStats(sData, pl, putCard);
}

playLayer_chenZhouZiPai.prototype.isPutCardLayout = function() {
    return true;
}

playLayer_chenZhouZiPai.prototype.isChargeShuffle = function() {
    return true;
};