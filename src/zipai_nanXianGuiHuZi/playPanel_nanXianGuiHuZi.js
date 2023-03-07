var playPanel_nanXianGuiHuZi = playLayer_ziPai.extend({
    getJsBind: function(){
        var jsBind = { 
            text_roundInfo: {
                _run: function () {
                    this.visible = false;
                },
            },
            node_left:{
                layout_head: {
                    img_siShou:{
                        _visible:false,
                        _event:{
                            initSceneData:function () {
                                MjClient.playui.checkSiShouVisible(this);
                            },
                            MJPeng: function(eD) {
                                MjClient.playui.checkSiShouVisible(this);
                            },
                            HZChiCard: function(eD) {
                                MjClient.playui.checkSiShouVisible(this);
                            },
                            HZLiuCard: function(eD) {
                                MjClient.playui.checkSiShouVisible(this);
                            },
                            HZWeiCard: function(eD) {
                                MjClient.playui.checkSiShouVisible(this);
                            },
                            MJPut: function(eD){
                                MjClient.playui.checkSiShouVisible(this);
                            },
                            roundEnd: function(eD){
                                this.visible = false;
                            }
                        }
                    },
                },
                img_putCard:{
                    _event:{ 
                        MJPassWei:function(ed){
                            MjClient.playui.updatePutCard(this, ed);
                        }
                    }
                }
            },
            node_right:{
                layout_head: {
                    img_siShou:{
                        _visible:false,
                        _event:{
                            initSceneData:function () {
                                MjClient.playui.checkSiShouVisible(this);
                            },
                            MJPeng: function(eD) {
                                MjClient.playui.checkSiShouVisible(this);
                            },
                            HZChiCard: function(eD) {
                                MjClient.playui.checkSiShouVisible(this);
                            },
                            HZLiuCard: function(eD) {
                                MjClient.playui.checkSiShouVisible(this);
                            },
                            HZWeiCard: function(eD) {
                                MjClient.playui.checkSiShouVisible(this);
                            },
                            MJPut: function(eD){
                                MjClient.playui.checkSiShouVisible(this);
                            },
                            roundEnd: function(eD){
                                this.visible = false;
                            }
                        }
                    },
                },
                img_putCard:{
                    _event:{
                        MJPassWei:function(ed){
                            MjClient.playui.updatePutCard(this, ed);
                        }
                    }
                }
            },
            node_xing:{
                layout_head: {
                    img_siShou:{
                        _visible:false,
                        _event:{
                            initSceneData:function () {
                                MjClient.playui.checkSiShouVisible(this);
                            },
                            MJPeng: function(eD) {
                                MjClient.playui.checkSiShouVisible(this);
                            },
                            HZChiCard: function(eD) {
                                MjClient.playui.checkSiShouVisible(this);
                            },
                            HZLiuCard: function(eD) {
                                MjClient.playui.checkSiShouVisible(this);
                            },
                            HZWeiCard: function(eD) {
                                MjClient.playui.checkSiShouVisible(this);
                            },
                            MJPut: function(eD){
                                MjClient.playui.checkSiShouVisible(this);
                            },
                            roundEnd: function(eD){
                                this.visible = false;
                            }
                        }
                    },
                },
                img_putCard:{
                    _event:{
                        MJPassWei:function(ed){
                            MjClient.playui.updatePutCard(this, ed);
                        }
                    }
                }
            },
            node_down:{
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
                layout_head: {
                    img_siShou:{
                        _visible:false,
                        _event:{
                            initSceneData:function () {
                                MjClient.playui.checkSiShouVisible(this);
                            },
                            MJPeng: function(eD) {
                                MjClient.playui.checkSiShouVisible(this);
                            },
                            HZChiCard: function(eD) {
                                MjClient.playui.checkSiShouVisible(this);
                            },
                            HZLiuCard: function(eD) {
                                MjClient.playui.checkSiShouVisible(this);
                            },
                            HZWeiCard: function(eD) {
                                MjClient.playui.checkSiShouVisible(this);
                            },
                            MJPut: function(eD){
                                MjClient.playui.checkSiShouVisible(this);
                            },
                            roundEnd: function(eD){
                                this.visible = false;
                            }
                        }
                    },
                },
                img_putCard:{
                    _layout: [[0.35, 0.35], [0.65, 0.6], [0, 0]],
                    _event:{
                        MJPassWei:function(ed){
                            MjClient.playui.updatePutCard(this, ed);
                        }
                    }
                }
            },
            img_banner:{
                btn_setting: {
                    _click: function() {
                        cc.log("btn_setting");
                        MjClient.Scene.addChild(new settingPanel_nanXianGuiHuZi(), 6000);
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
                btn_wai:{
                    _visible: false,
                    _layout: [[0, 0.1],[0.5, 0],[0, 2.5]],
                    bg_img:{
                        _run: function() {
                            MjClient.playui.doBtnLightAction(this);
                        }
                    },
                    _touch: function(btn, eT) {
                        console.log(">>>> lf，点击歪按钮");
                        if (eT == 2){
                            if ((MjClient.data.sData.players[SelfUid()].eatFlag & 32) > 0) {
                                MjClient.showMsg("选择歪后视为过胡，确定歪吗？", function() {
                                    MjClient.playui.hideEatBtns();
                                    MjClient.gamenet.request("pkroom.handler.tableMsg", {
                                        cmd: "HZWeiCard"
                                    });
                                }, function() {}, "1");
                            } else {
                                MjClient.playui.hideEatBtns();
                                MjClient.gamenet.request("pkroom.handler.tableMsg", {
                                    cmd: "HZWeiCard"
                                });
                            }
                        }
                    }
                },
                btn_liu:{
                    _visible: false,
                    _layout: [[0, 0.1],[0.5, 0],[0, 2.5]],
                    bg_img:{
                        _run: function() {
                            MjClient.playui.doBtnLightAction(this);
                        }
                    },
                    _touch: function(btn, eT) {
                        console.log(">>>> lf，点击溜按钮");
                        if (eT == 2){
                            MjClient.playui.showSelectCards("liu");
                        }
                    }
                },
                btn_piao:{
                    _visible: false,
                    _layout: [[0, 0.1],[0.5, 0],[0, 2.5]],
                    bg_img:{
                        _run: function() {
                            MjClient.playui.doBtnLightAction(this);
                        }
                    },
                    _touch: function(btn, eT) {
                        console.log(">>>> lf，点击飘按钮");
                        if (eT == 2){
                            MjClient.playui.showSelectCards("piao");
                        }
                    }
                },
                img_liuSelect: {
                    _visible: false,
                    _run: function() {
                        setWgtLayout(this, [0, 0.38], [0.5, 0.76], [0, 0]);
                        this.initLiuBgSize = this.getContentSize();
                        this.initLiuBgScale = this.scale;
                    }
                },
                _event:{
                    HZNewCardDelay: function(eD) {
                        if(eD.isCommon && eD.newCard){
                            MjClient.playui.updateEatBtns(eD);
                        } 
                    },
                    MJPassWei:function(){
                        MjClient.playui.updateEatBtns();
                    }
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
        this._super("Play_ZiPaiNanXianGuiHuZi.json");
        MjClient.MaxPlayerNum_NanXianGuiHuZi = MjClient.data.sData.tData.maxPlayer;

        if (MjClient.data.sData.tData.areaSelectMode["convertible"] && MjClient.rePlayVideo == -1){
            addFreeNumberBtn([0.5, 0.4]);
        }

        if(MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ || MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP){
            MjClient.playui.jsBind._node.addChild(new roundRule_ziPai(roundRule_ziPai.getRoundRules()));
        }
        return true;
    },
});

playPanel_nanXianGuiHuZi.prototype.initSettingData = function() {
    MjClient.KEY_ZI_PAI_PLAY_UI_LAYOUT = MjClient.gameType + "_KEY_ZI_PAI_PLAY_UI_LAYOUT";   //字牌布局
    MjClient.KEY_ZI_PAI_GAME_BG_TYPE = MjClient.gameType + "_KEY_ZI_PAI_GAME_BG_TYPE";   //字牌游戏背景类型
    MjClient.KEY_ZI_PAI_ZI_PAI_TYPE = MjClient.gameType + "_KEY_ZI_PAI_ZI_PAI_TYPE";   //字牌游戏字体类型
    MjClient.KEY_ZI_PAI_VOICE_TYPE = MjClient.gameType + "_KEY_ZI_PAI_VOICE_TYPE"; // 字牌游戏语音

    MjClient.KEY_ZI_PAI_FAST_EAT_TYPE = MjClient.gameType + "_KEY_ZI_PAI_FAST_EAT_TYPE";   //字牌游戏快速吃牌类型
    MjClient.KEY_ZI_PAI_XU_XIAN_TYPE = MjClient.gameType + "_KEY_ZI_PAI_XU_XIAN_TYPE";   //字牌游戏 虚线位置
    MjClient.KEY_ZI_PAI_SU_DU_TYPE = MjClient.gameType + "_KEY_ZI_PAI_SU_DU_TYPE";   //字牌游戏 动画速度
    MjClient.KEY_ZI_PAI_CARD_SIZE = MjClient.gameType + "_KEY_ZI_PAI_CARD_SIZE"; // 字牌大小
    MjClient.KEY_ZI_PAI_PLAY_TING_PAI = MjClient.gameType + "_KEY_ZI_PAI_PLAY_TING_PAI";   //听牌提示
    MjClient.KEY_ZI_PAI_HU_XI_TYPE = MjClient.gameType + "_KEY_ZI_PAI_HU_XI_TYPE";   //胡息显示
    MjClient.KEY_ZI_PAI_CHU_PAI_TYPE = MjClient.gameType + "_KEY_ZI_PAI_CHU_PAI_TYPE";   //字牌出牌按钮
    MjClient.KEY_ZI_PAI_CHU_PAI_GUIDE = MjClient.gameType + "_KEY_ZI_PAI_CHU_PAI_GUIDE";   //字牌出牌提示
};

//出牌按钮
playPanel_nanXianGuiHuZi.prototype.checkPutCardBtnVisible = function(node) {
    node = node || MjClient.playui.jsBind.btn_putCrad._node;
    node.visible = !MjClient.hasPut && this.getChuPaiType() == 0 && (IsTurnToMe() && MjClient.data.sData.tData.tState == TableState.waitPut);
}

//字牌字体列表 
playPanel_nanXianGuiHuZi.prototype.getCardFontList = function() {  
    return ["type1", "type5", "type3", "type6"];
};

playPanel_nanXianGuiHuZi.prototype.changeHandCardSize = function(handCard) {
    var src = this.getCardSrc("hand", 1)
    //handCard.loadTexture(src, this.getResType());
    this.loadCardTexture(handCard, src, this.getResType());
    var idx = this.getCardSizeIdx();
    var type4Size = 103;
    var cardSize = [[87,87,87,type4Size],[75,75,75,type4Size],[95,95,95,type4Size]]; 
    setWgtLayout(handCard, [cardSize[idx][ziPai.getZiPaiType()] / 1280, 0], [0.27, 0.75], [0, 0]);
 
};

//Override
playPanel_nanXianGuiHuZi.prototype.createGameOverLayer = function(type) {
    return new GameOverLayer_NanXianGuiHuZi();
};

//Override
playPanel_nanXianGuiHuZi.prototype.createEndOneLayer = function(type) {
    return new EndOneView_NanXianGuiHuZi();
};

// return ["playing/paohuziTable/beijing_1.jpg", "playing/paohuziTable/beijing_2.jpg", "playing/paohuziTable/beijing_3.jpg", "playing/paohuziTable/beijing_4.jpg"];

//Override
playPanel_nanXianGuiHuZi.prototype.getGameBgList = function() {
    return ["playing/paohuziTable/beijing_2.jpg", "playing/paohuziTable/beijing_4.jpg", "playing/paohuziTable/beijing_1.jpg", "playing/paohuziTable/beijing_3.jpg"];
};

 
 
playPanel_nanXianGuiHuZi.prototype.getInitDiPaiCount = function() {
    var tData = MjClient.data.sData.tData;
    return MjClient.majiang.getAllCardsTotal() -  tData.maxPlayer * 20;
};
    

playPanel_nanXianGuiHuZi.prototype.getDefaultSetting = function() {
    return {
        layout: 0,
        bg: 1,
        pai: 1,
        fastEat: 0,
        huXi: 1,
        xuXian: 0,
        suDu: 0,
        size: 0,
        voice: 0,
        ting: 0,
        chuBtn: 0,
        dblClick: 1,
        chuGuide:0,
    };
};

playPanel_nanXianGuiHuZi.prototype.getMaxColumnCount = function(card){
    return 11;
};

playPanel_nanXianGuiHuZi.prototype.getPutCardBg = function (putType) {
    return putType == 0 ? "playing/paohuzi/mopai_bj.png" : "playing/paohuzi/mopai_bj_no_effect.png";
};
 

playPanel_nanXianGuiHuZi.prototype.getOffYByCard = function(card){
    if (this.getCardFontIdx() == 2) {
        return card.height * card.scaleY - card.height / 7 * card.scaleY;
    }
    return card.height * card.scaleY - card.height / 4 * card.scaleY;
}


playPanel_nanXianGuiHuZi.prototype.updateEatBtns = function(msg) {
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var pl = sData.players[SelfUid() + ""];
    if (!pl) {
        MjClient.gamenet.request("pkroom.handler.tableMsg", {
            cmd: "checkBtnWithFlag",
            mjState: pl.mjState,
            eatFlag: pl.eatFlag,
            tableid: sData.tData.tableid,
            pl: "pl not find:" +　SelfUid()
        });
        return;
    }


    if (MjClient.rePlayVideo == -1){
        if (msg && SelfUid() != msg.uid){
            if (msg.mjHide && msg.mjHide.indexOf(msg.newCard) >= 0){
                return;
            }
        }
        if(tData.mjHideCard)
        {
            if(tData.uids[tData.curPlayer] != SelfUid() && tData.mjHideCard[tData.uids[tData.curPlayer]].indexOf(tData.currCard) >= 0)
            {
                return;
            }
        }
    }

    //重置吃碰隐藏
    this.hideEatBtns();
    //吃碰杠胡
    var showEatNodes = this.getShowEatNodes();

    //吃碰杠胡过处理
    if (showEatNodes && showEatNodes.length > 0) {
        this.showEatSpecialDeal();
        for (var i = 0; i < showEatNodes.length; i++) {
            var btnNode = showEatNodes[i];
            btnNode.visible = true;
            this.changeEatBtnLayout(btnNode, showEatNodes.length, i);
        }
    }
    this.checkBtnWithPlayerFlag();
};

 // 摸牌是否显示牌背
// playPanel_nanXianGuiHuZi.prototype.isShowCardBack = function(msg) {
//     var tData = MjClient.data.sData.tData;  
//     return getOffByIndex(tData.curPlayer) != 0 && tData.putType==1 && tData.isLastDraw;
// };


// 获取操作按钮数组
playPanel_nanXianGuiHuZi.prototype.getShowEatNodes = function() {
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var eat = MjClient.playui.jsBind.node_eatChoice;
    var pl = sData.players[SelfUid() + ""];

    if (!pl) {

        return;
    }
  
    if (tData.tState == TableState.roundFinish) {
        return [];
    }

    var vnode = [];

    if (pl.eatFlag & 1) { // 吃
        vnode.push(eat.btn_chi._node);
    }

    //飘
    if(pl.eatFlag & 4){
        vnode.push(eat.btn_piao._node);
    }

    //溜
    if(pl.eatFlag & 16){
        vnode.push(eat.btn_liu._node);
    }

    //歪
    if(pl.eatFlag & 8){
        vnode.push(eat.btn_wai._node);
    }

    if (pl.eatFlag & 32) { // 胡
        vnode.push(eat.btn_hu._node);
    }

    if (pl.eatFlag & 2) { // 碰
        vnode.push(eat.btn_peng._node);
    }

    if(vnode.length > 0 && !((pl.eatFlag & 8) && (pl.eatFlag & 32) && tData.areaSelectMode.isKaWai)
        && !((pl.eatFlag & 16) && pl.mjhand.length % 3 == 2 && MjClient.majiang.getCanPutCardNum(pl) == 0)){
        vnode.push(eat.btn_guo._node); 
    }


 
    return vnode;
};

playPanel_nanXianGuiHuZi.prototype.getChiCards = function () {
    var sData = MjClient.data.sData;
    var pl = sData.players[SelfUid()];
    var putCard = sData.tData.lastPutCard;
    return MjClient.majiang.getChiList(pl, putCard);
};

playPanel_nanXianGuiHuZi.prototype.addOutFrame = function (outCard, pl, index) {
    if(pl.mjputType[index] == 0){
        var frame = new ccui.ImageView("playing/paohuziTable/putCardFrame.png");
        frame.x = outCard.width / 2;
        frame.y = outCard.height / 2;
        outCard.addChild(frame);
    }
}

playPanel_nanXianGuiHuZi.prototype.showSelectEatCards = function () {
   this.showSelectCards("chi");
}

playPanel_nanXianGuiHuZi.prototype.addSelectEatBtns = function(type, selectBg, selectCards) {
    var selectBtns = [];
    var children = selectBg.children;
    for (var i = 0; i < children.length; i++) {
        if (children[i].getName() == "cloneBtn") {
            children[i].removeFromParent(true);
        }
    }

    var off_x = 5;
    var selectBtn = selectBg.getChildByName("btn_select");
    var startPos = selectBtn.getPosition();

    var initChiBgSize = type == "chi" ? MjClient.playui.jsBind.node_eatChoice.img_chiSelect._node.initChiBgSize : MjClient.playui.jsBind.node_eatChoice.img_liuSelect._node.initLiuBgSize;
    var off_width = (initChiBgSize.width - selectBtn.width) / 2;
    selectBg.width = selectBtn.width * selectCards.length + (selectCards.length - 1) * off_x + off_width * 2;

    for (var i = 0; i < selectCards.length; i++) {
        var cardList = this.sortSelectEatCards(selectCards[i]);
        var cloneBtn = selectBtn.clone();
        cloneBtn.visible = true;
        cloneBtn.setName("cloneBtn");
        for (var k = 0; k < cardList.length; k++) {
            var card = cardList[k];
            var cardNode = cloneBtn.getChildByName("img_card" + k);
            cardNode.visible = true;
            var src = this.getCardSrc("hand", card)
            //cardNode.loadTexture(src, this.getResType());
            this.loadCardTexture(cardNode, src, this.getResType());
            cardNode.zIndex = cardList.length - k;
            if(k == cardList.length - 1 && type == "chi") {
                cardNode.setColor(cc.color(170, 170, 170));
            }
        }

        cloneBtn.setPosition(cc.p(startPos.x + (cloneBtn.width + off_x) * i, startPos.y));
        selectBg.addChild(cloneBtn);
        selectBtns.push(cloneBtn);
    }
    return selectBtns;
};

playPanel_nanXianGuiHuZi.prototype.showSelectCards = function (type) {
    var self = this;
    var sData = MjClient.data.sData;
    var pl = sData.players[SelfUid()];

    this.hideEatBtns();
    MjClient.playui.jsBind.node_eatChoice.btn_cancel._node.visible = true;

    var selectBgArr = {
        "chi": MjClient.playui.jsBind.node_eatChoice.img_chiSelect._node,
        "liu": MjClient.playui.jsBind.node_eatChoice.img_liuSelect._node,
        "piao": MjClient.playui.jsBind.node_eatChoice.img_liuSelect._node,
    };

    var bShowEatCardsScaleAction = false; //是否执行缩放动画

    //添加一组可以吃或比的牌
    var addSelectEatCardsRow = function() {
        var selectBg = selectBgArr[type];
        selectBg.visible = true;
        selectBg.x = cc.winSize.width * 0.5;

        if (type == "chi") {
            var optionCards = self.getChiCards();
        } else if (type == "liu"){
            var optionCards = [];
            if(pl.liuCards.length <= 0 && tData.lastPutCard != -1){
                pl.liuCards.push(tData.lastPutCard);
            }
            for(var i = 0; i < pl.liuCards.length; i++){
                optionCards.push(Array.apply(null, Array(4)).map(() => pl.liuCards[i]));
            }
        }else{
            var optionCards = [];
            if(pl.piaoCards.length <= 0 && tData.lastPutCard != -1){
                pl.piaoCards.push(tData.lastPutCard);
            }
            for(var i = 0; i < pl.piaoCards.length; i++){
                optionCards.push(Array.apply(null, Array(4)).map(() => pl.piaoCards[i]));
            }
        }
        if (!optionCards || optionCards.length == 0) {
            return;
        }

        var optionBtns = self.addSelectEatBtns(type, selectBg, optionCards);
        for (var i = 0; i < optionBtns.length; ++i) {
            var btn = optionBtns[i];
            (function(cards) {
                btn.addClickEventListener(function(btn) {
                    if(type == "chi"){
                        self.commitEatCard(cards);
                    }else{
                        if ((MjClient.data.sData.players[SelfUid()].eatFlag & 32) > 0) {
                            MjClient.showMsg({liu : "溜", piao : "飘"}[type] + "牌后视为过胡，确定吃吗？", function() {
                                MjClient.playui.hideEatBtns();
                                MjClient.gamenet.request("pkroom.handler.tableMsg", {
                                    cmd: "HZLiuCard",
                                    card: cards[0],
                                    optFlag:(type == "liu" ? 16 : 4)
                                });
                            }, function() {}, "1");
                        } else {
                            MjClient.playui.hideEatBtns();
                            MjClient.gamenet.request("pkroom.handler.tableMsg", {
                                cmd: "HZLiuCard",
                                card: cards[0],
                                optFlag:(type == "liu" ? 16 : 4)
                            });
                        }
                    }
                });
            })(optionCards[i]);
        }
        var bgArr = [];
        bgArr.push(selectBgArr[type])
        self.doSelectEatAction(bgArr, bShowEatCardsScaleAction);
    };
    addSelectEatCardsRow();
}
  
   
playPanel_nanXianGuiHuZi.prototype.initCardType = function(huaMian){
    var ziPaiList = [];
    ziPaiList.push(huaMian.getChildByName("ziPai").getChildByName("ziPai1"));
    ziPaiList.push(huaMian.getChildByName("ziPai").getChildByName("ziPai2"));
    ziPaiList.push(huaMian.getChildByName("ziPai").getChildByName("ziPai3"));
    ziPaiList.push(huaMian.getChildByName("ziPai").getChildByName("ziPai4")); 
    ziPaiList[0].getChildByName("Image").loadTexture("setting/ziPai_1.png");
    ziPaiList[1].getChildByName("Image").loadTexture("setting/ziPai_5.png");
    ziPaiList[2].getChildByName("Image").loadTexture("setting/ziPai_3.png");
    ziPaiList[3].getChildByName("Image").loadTexture("setting/zipai4.png");
    ziPaiList[0].visible = false;
    var type = MjClient.playui.getCardFontIdx();
    this.ziPaiRadio = createRadioBoxForCheckBoxs(ziPaiList, null, type);
    for(var i = 0; i < ziPaiList.length; i++){
        ziPaiList[i].x -= 50
        cc.eventManager.addListener(this.setTextClick(ziPaiList,i,this.ziPaiRadio),ziPaiList[i].getChildByName("Image"));
    }
    this.ziPaiRadio.setSelectCallBack(function(index, sender, nodeList){ 
        util.localStorageEncrypt.setNumberItem(MjClient.KEY_ZI_PAI_ZI_PAI_TYPE, index);
        util.localStorageEncrypt.setNumberItem(MjClient.KEY_MJBgType, index);
        postEvent("EZP_cardType", {idx:index, type:"font"}); 
        postEvent("EZP_cardType", {idx:index, type:"size"}); 
    }.bind(this));
};

// 摸牌是否显示牌背
playPanel_nanXianGuiHuZi.prototype.isShowCardBack = function(msg) { 
    var tData  = MjClient.data.sData.tData;
    var uids = tData.uids; 
 
    if(getOffByIndex(tData.curPlayer) != 0 && tData.putType==1 && tData.isLastDraw){
        return true;
    }
   
    if(uids[tData.curPlayer] != SelfUid() && tData.mjHideCard[uids[tData.curPlayer]].indexOf(tData.currCard) >= 0){
        return true;
    }
    return false;
    //msg && SelfUid() != msg.uid && (msg.isDrawCard || (msg.mjHide && msg.mjHide.indexOf(msg.newCard) >= 0));
};

playPanel_nanXianGuiHuZi.prototype.getEatCardShowType = function(eatType, card, cardIndex, off) {
    var showType = 2;
    if (eatType == "mjchi") {
        showType = cardIndex < 2 ? 2 : 3;
    } else if (eatType == "mjwei") {
        showType = this.getCardShowType(card, off);
        if (showType == 2) {
            var pl = this.getUIPlayer(off);
            showType = (pl.info.uid == SelfUid() && this.getShowCardIndex(eatType, off) == cardIndex) ? 2 : 0;
        }
    }else if (eatType == "mjgang1") {
        var pl = this.getUIPlayer(off);
        showType = (pl.info.uid == SelfUid() && this.getShowCardIndex(eatType, off) == cardIndex) ? 2 : 0;
    }else if (eatType == "mjgang2") {
        var pl = this.getUIPlayer(off);
        showType = (pl.info.uid == SelfUid() && this.getShowCardIndex(eatType, off) == cardIndex) ? 2 : 0;
    }
    return showType;
};
playPanel_nanXianGuiHuZi.prototype.is34Mask = function() {
    return false;
};

playPanel_nanXianGuiHuZi.prototype.checkCardCanPut = function(pl, card) {
    var tData  = MjClient.data.sData.tData;
    cc.log("!pl.canNotPutCard = ",!pl.canNotPutCard);
    cc.log(" pl.canNotPutCard.indexOf(card) = ", pl.canNotPutCard.indexOf(card));
    cc.log("MjClient.majiang.getCanPutCardNum(pl) = ",MjClient.majiang.getCanPutCardNum(pl));

    return (!pl.canNotPutCard || pl.canNotPutCard.indexOf(card) == -1 || MjClient.majiang.getCanPutCardNum(pl) == 0)
}; 


playPanel_nanXianGuiHuZi.prototype.getShowCardIndex = function(eatType, off) {
    var uiNode = this.getUINode(off);
    var index = 0;
    if (uiNode.getName() == "node_down" || uiNode.getName() == "node_xing") {
        if (eatType == "mjwei") {
            index = 2;
        } else if (eatType == "mjgang1" || eatType == "mjgang2") {
            index = 3;
        }
    }
    return index;
};

playPanel_nanXianGuiHuZi.prototype.getEatLabel = function(eatType) {
    return {mjwei : "playing/paohuzi/t_wai.png", mjgang0 : "playing/paohuzi/t_piao.png", mjgang1 : "playing/paohuzi/t_liu.png", mjgang2 : "playing/paohuzi/t_liu.png"}[eatType];
};

playPanel_nanXianGuiHuZi.prototype.hasTingByPut = function() {
    return true;
};

playPanel_nanXianGuiHuZi.prototype.apartGangType = function(eatType, msg) {
    var eatType = eatType;
    if (eatType == "mjgang") {
        if (msg.type == 1) {
            if(msg.liuType == 2){
                eatType = "mjgang2";
            }else{
                eatType = "mjgang1";
            }
        } else {
            eatType = "mjgang0";
        }
    }
    return eatType;
};

//Override
playPanel_nanXianGuiHuZi.prototype.setCardTouchHandler = function(card,off){
    var self = this;
    var pl = this.getUIPlayer(off);
    var dict = {};
    for (var i = 0; i < pl.mjhand.length; i++) {
        var cd = pl.mjhand[i];
        dict[cd] = dict[cd] ? dict[cd] + 1 : 1;
    }

    card.setColor(cc.color(255, 255, 255));
    card.banPut = false;

    if(pl.canNotPutCard.indexOf(card.tag) >= 0) {
        card.setColor(cc.color(170, 170, 170));
        card.banPut = true; //禁止出牌
    } 

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
                if(!MjClient.hasPut && IsTurnToMe() && tData.tState == TableState.waitPut && !btn.banPut)
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
                if (!MjClient.hasPut && IsTurnToMe() && tData.tState == TableState.waitPut && !btn.banPut){
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


playPanel_nanXianGuiHuZi.prototype.isCheckTingStats = function() {
    return true;
}

playPanel_nanXianGuiHuZi.prototype.getTingStats = function(putCard) {
    var sData = MjClient.data.sData;
    var pl = sData.players[SelfUid()];
    return MjClient.majiang.getTingStats(sData, pl, putCard);
}

 

playPanel_nanXianGuiHuZi.prototype.isOtherWei = function(card){
    return false;
}

playPanel_nanXianGuiHuZi.prototype.calculateHuXi = function(off) {
    return UpdateHuXi_NanXianGuiHuZi(off)
};

playPanel_nanXianGuiHuZi.prototype.checkShenTypeVisible = function(node){
    var tData = MjClient.data.sData.tData;
    if(!this.isInPlay()){
        return;
    }
    node.visible = true;
    if(tData.shenType == 0){
        node.loadTexture("playing/waihuzi/shuangshen.png");
    }else{
        node.loadTexture("playing/waihuzi/danshen.png");
    }
}

playPanel_nanXianGuiHuZi.prototype.checkSiShouVisible = function(node){
    var off = this.getUIOffByNode(node);
    var pl = this.getUIPlayer(off);
    node.visible = false;
    if(!this.isInPlay()){
        return;
    }
    if(pl && pl.isDead){
        node.visible = true;
    }
}

playPanel_nanXianGuiHuZi.prototype.checkCanNotPutCardMask = function(){
    return !MjClient.data.sData.tData.areaSelectMode.isSiShou;
}

playPanel_nanXianGuiHuZi.prototype.isShowLongCard = function(){
    return true
};

// 出牌线&出牌手指动画
playPanel_nanXianGuiHuZi.prototype.checkCutLineVisible = function(node) {
    var cutLine = node || this.jsBind.img_cutLine._node;
    var finger = this.jsBind.img_finger._node
    var putSureBtn = this.jsBind.btn_putCrad._node;

    cutLine.visible = false;
    finger.visible = false;
    if (MjClient.hasPut) {
        return;
    }

    var tData = MjClient.data.sData.tData;
    if (IsTurnToMe()) {
        var status = (tData.tState == TableState.waitPut || this.checkPutSpecil());
        cutLine.visible = status;

        finger.visible = status && this.getChuPaiGuide() == 0;
        finger.setLocalZOrder(putSureBtn.getLocalZOrder()+1);

        if(!finger.getChildByName("animSprite")){
            var animSprite = new cc.Sprite("playing/fingerEffer/finger0.png");
            animSprite.x = 120;
            animSprite.y = 120;
            finger.addChild(animSprite);
            animSprite.setName("animSprite");
            var action = createAnimation("playing/fingerEffer/finger",13,cc.rect(0, 0,166,195),0.07);
            animSprite.runAction(cc.sequence([action]).repeatForever());
        }
    }
};
