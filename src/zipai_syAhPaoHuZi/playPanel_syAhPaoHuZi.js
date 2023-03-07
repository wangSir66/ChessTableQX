//新版安化跑胡子
var playPanel_syAhPaoHuZi = playLayer_ziPai.extend({
    ctor: function() {
        this._super("Play_shaoYangAnHuaPaoHuZi.json");

        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ){
            MjClient.playui.jsBind._node.addChild(new roundRule_ziPai(roundRule_ziPai.getRoundRules()));
        }
    },

    getJsBind: function() {
        var jsBind = {
            _event: {
                startShuffleCards: function(d) {
                    MjClient.playui.checkCanShowDistance();
                },
                mjhand: function() {
                    MjClient.playui.checkCanShowDistance([[0.25, 0.25], [0.5, 0.5], [0, 0]]);
                },
                initSceneData: function() {
                    CheckRoomUiDelete();
                    sendGPS();
                    MjClient.checkChangeLocationApp();
                    MjClient.playui.checkCanShowDistance([[0.25, 0.25], [0.5, 0.5], [0, 0]]);
                },
                MJChat: function(data) {
                    if (data.type == 4) {
                        MjClient.playui.checkCanShowDistance([[0.25, 0.25], [0.5, 0.5], [0, 0]]);
                    }
                },
                removePlayer: function(eD) {
                    MjClient.playui.checkCanShowDistance([[0.25, 0.25], [0.5, 0.5], [0, 0]]);
                },
            },
            text_roundInfo: {
                _run:function () {
                  if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ) {
                      this.visible = false;
                  }
                },
                _event: {
                    mjhand : function() {
                        this.setString(MjClient.playui.getGameCnDesc());
                    }
                }
            },
            img_banner: {
                btn_setting: {
                    _click: function() {
                        MjClient.Scene.addChild(new settingPanel_syAhPaoHuZi(), 6000);
                        MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Shezhi", {
                            uid: SelfUid(),
                            gameType: MjClient.gameType
                        });
                    }
                },
                btn_changeBg:{
                    _run: function() {
                        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ){
                            this.loadTextureNormal("playing/ziPaiBanner/wenhao.png");
                            this.setContentSize(this.getNormalTextureSize());
                        }else {
                            this.visible = !MjClient.playui.isCoinField();
                        }
                    },
                    _click: function() {
                        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ){
                            postEvent("EZP_rule");
                        }else {
                            MjClient.playui.changeGameBgToNext();
                        }
                    }
                },
            },
            btn_sort: {
                _click: function () {
                    if (!MjClient.playui.isInPlay()) {
                        return;
                    }
                    var pl = MjClient.playui.getUIPlayer(0);
                    MjClient.HandCardArr = MjClient.majiang.sortByUser();
                    MjClient.playui.refreshHandCard(0);
                }
            },
            node_left:{
                layout_eatDisplay: {
                    _layout: [[0.12, 0.12], [0.04, 0.93], [0, 0]],
                },
            },
            node_right:{
                layout_eatDisplay: {
                    _layout: [[0.12, 0.12], [0.95, 0.91], [0, 0]],
                },
            },
            node_down:{
                layout_eatDisplay: {
                    _layout: [[0.12, 0.12], [0.5, 0.45], [0, 0]],
                },
                img_putCard: {
                    _layout: [[0.35, 0.35], [0.65, 0.6], [0, 0]]
                },
            },
            node_xing:{
                layout_eatDisplay: {
                    _layout: [[0.12, 0.12], [0.95, 0.10], [0, 0]],
                },
            },
        };

        return jsBind;
    },
});


playPanel_syAhPaoHuZi.prototype.showOrHideJiachuiText = function(node, off) {
    node.visible = false;
    var tData = MjClient.data.sData.tData;
    var pl = this.getUIPlayer(off);
    if (!pl) {
        return;
    }
    if (tData.tState == TableState.waitJiazhu) {
        if (pl.jiachuiNum == 0) {
            node.loadTexture("playing/other/jiachui_text_0.png");
            node.visible = true;
        } 
        else {
            if (pl.jiachuiNum == 1) {
                node.loadTexture("playing/other/jiachui_text_1.png");
                node.visible = true;
            } 
        }    
    }
}

//检测距离信息
playPanel_syAhPaoHuZi.prototype.checkCanShowDistance = function(layoutData) {
    var disLayer = this.disLayer;
    if (disLayer) {
        disLayer.removeFromParent();
        this.disLayer = null;
    }

    var tState = MjClient.data.sData.tData.tState;
    if (!tState || tState > TableState.waitReady) {
        return;
    }
    if (MjClient.data.sData.tData.fieldId) {
        return;
    }
    if (MjClient.timeoutShowDistanceID) {
        clearTimeout(MjClient.timeoutShowDistanceID);
        MjClient.timeoutShowDistanceID = null;
    }

    if (this.getPlayersNum() == 3) {
        disLayer = new Distance3PlayerLayer(layoutData);
    } else if (this.getPlayersNum() == 4) {
        disLayer = new DistanceLayer(layoutData);
    } else {
        return;
    }
    this.disLayer = disLayer;
    this.addChild(disLayer);
};

//字牌字体列表
playPanel_syAhPaoHuZi.prototype.getCardFontList = function() {
    return ["type1", "type2", "type3"];
};

//Override 
playPanel_syAhPaoHuZi.prototype.initSettingData = function() {
    MjClient.KEY_ZI_PAI_CARD_SIZE = "KEY_ZI_PAI_HAND_SIZE_TYPE"; //字牌游戏字体大小类型
    MjClient.KEY_ZI_PAI_PLAY_TING_PAI = "KEY_ZI_PAI_TING_PAI_TYPE"; //字牌游戏 听牌开关
    MjClient.KEY_ZI_PAI_PLAY_UI_LAYOUT = "KEY_ZI_PAI_PLAY_UI_LAYOUT"; //字牌布局
    MjClient.KEY_ZI_PAI_GAME_BG_TYPE = "KEY_ZI_PAI_GAME_BG_TYPE"; //字牌游戏背景类型
    MjClient.KEY_ZI_PAI_ZI_PAI_TYPE = "KEY_ZI_PAI_ZI_PAI_TYPE"; //字牌游戏字体类型
    MjClient.KEY_ZI_PAI_FAST_EAT_TYPE = "KEY_ZI_PAI_FAST_EAT_TYPE"; //字牌游戏快速吃牌类型
    MjClient.KEY_ZI_PAI_HU_XI_TYPE = "KEY_ZI_PAI_HU_XI_TYPE"; //字牌游戏 显示胡息
    MjClient.KEY_ZI_PAI_XU_XIAN_TYPE = "KEY_ZI_PAI_XU_XIAN_TYPE"; //字牌游戏 虚线位置
    MjClient.KEY_ZI_PAI_SU_DU_TYPE = "KEY_ZI_PAI_SU_DU_TYPE"; //字牌游戏 动画速度
    MjClient.KEY_ZI_PAI_DOUBLE_CLICK_TYPE = "KEY_ZI_PAI_DOUBLE_CLICK_TYPE"; //字牌游戏 双击出牌
};

//Override
playPanel_syAhPaoHuZi.prototype.isShowLongCard = function() {
    return true;
};

playPanel_syAhPaoHuZi.prototype.isCheckTingStats = function() {
    return true;
}

//获取听的牌
playPanel_syAhPaoHuZi.prototype.getTingCards = function(sData, pl, putCard) {
    return MjClient.huzi.getTingCards(sData, pl, putCard);
};

/**
 * 计算听牌提示
 */
playPanel_syAhPaoHuZi.prototype.calculateHintPutList = function() {
    MjClient.hintPutList_ziPai = MjClient.huzi.hintPutCardsToTing();
};

//Override
playPanel_syAhPaoHuZi.prototype.createGameOverLayer = function(type) {
    return new GameOverLayer_syZiPai();
};

//Override
playPanel_syAhPaoHuZi.prototype.createEndOneLayer = function(type) {
    if (this.isCoinField()) {
        return new EndOneView_ziPaiGold();
    }
    return new EndOneView_syZiPai();
};

//字牌字体idx
playPanel_syAhPaoHuZi.prototype.getCardFontIdx = function() {
    return util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_ZI_PAI_TYPE, 2);
};

//布局类型
playPanel_syAhPaoHuZi.prototype.getLayoutType = function() {
    return util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_PLAY_UI_LAYOUT, 0);
};

//Override
playPanel_syAhPaoHuZi.prototype.getGameBgList = function() {
    return ["playing/gameTable/beijing_1.jpg", "playing/gameTable/beijing_2.jpg", "playing/gameTable/beijing_3.jpg"];
};

//Override
playPanel_syAhPaoHuZi.prototype.getGameBgIdx = function() {
    return util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_GAME_BG_TYPE, 0);
};

//Override
playPanel_syAhPaoHuZi.prototype.getHuXiType = function() {
    var idx = util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_HU_XI_TYPE, 0);
    return [1, 0][idx];
};

//Override
playPanel_syAhPaoHuZi.prototype.getXuXianType = function() {
    return util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_XU_XIAN_TYPE, 1);
};

//Override
playPanel_syAhPaoHuZi.prototype.getSuDuType = function() {
    var old = util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_SU_DU_TYPE, 2);
    return [2,0,1,3][old];
};

//Override
playPanel_syAhPaoHuZi.prototype.getTingPaiType = function() {
    var idx = util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_PLAY_TING_PAI, 1);
    return [1, 0][idx];
};

playPanel_syAhPaoHuZi.prototype.isAniParallel = function() {
    return false;
};

playPanel_syAhPaoHuZi.prototype.changeEatBtnLayout = function(btnNode, len, idx) {
    var scale = 0.20;
    if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ){
        if(btnNode.name == "btn_guo"){
            scale = 103 / 720;
        }else if(btnNode.name == "btn_hu"){
            scale = 149 / 720;
        }
    }
    var type = this.getLayoutType();
    switch (type) {
        case 1:
            setWgtLayout(btnNode, [0, scale], [0.5, 0.18], [(idx - (len - 1) / 2) * 1.3 * 0.20 / scale, 1.8 * 0.20 / scale], false, false);
            break;
        case 0:
            setWgtLayout(btnNode, [0, scale], [0.88 - (len - 1 - idx) * 0.12 * 0.20 / scale, 0.11], [0, 1.8 * 0.20 / scale], false, false);
            break;
    }
};

playPanel_syAhPaoHuZi.prototype.getEatCardShowType = function(eatType, card, cardIndex, off) {
    var showType = 2;
    if (eatType == "mjchi") {
        showType = cardIndex < 2 ? 2 : 3;
    } else if (eatType == "mjwei") {
        showType = this.getCardShowType(card, off);
        if (showType == 2) {
            showType = this.getShowCardIndex(eatType, off) == cardIndex ? 2 : 0;
        }
    }else if(eatType == "mjgang1"){
        showType = this.getShowCardIndex(eatType, off) == cardIndex ? 2 : 0;
    }
    return showType;
};