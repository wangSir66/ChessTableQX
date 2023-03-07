// 新版安化跑胡子
var playPanel_ahPaoHuZi = playLayer_ziPai.extend({
    ctor: function() {
        this._super("Play_ahPaoHuZi.json");
        if(MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ || MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP){
            MjClient.playui.jsBind._node.addChild(new roundRule_ziPai(roundRule_ziPai.getRoundRules()));
        }
    },
    getJsBind: function() {
        var jsBind = {
            text_roundInfo: {
                _run: function () {
                    if (MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ || MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP) {
                        this.visible = false;
                    }
                },
            },
            img_banner: {
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
        }

        return jsBind;
    },
});

//字牌字体列表
playPanel_ahPaoHuZi.prototype.getCardFontList = function() {
    return ["type1", "type5", "type3"];
};

//Override 
playPanel_ahPaoHuZi.prototype.initSettingData = function() {
    MjClient.KEY_ZI_PAI_PLAY_UI_LAYOUT  = "KEY_ZI_PAI_PLAY_UI_LAYOUT_AN_HUA_PAO_HU_ZI";   //字牌布局
    MjClient.KEY_ZI_PAI_GAME_BG_TYPE  = "KEY_ZI_PAI_GAME_BG_TYPE_AN_HUA_PAO_HU_ZI";   //字牌游戏背景类型
    MjClient.KEY_ZI_PAI_ZI_PAI_TYPE  = "KEY_ZI_PAI_ZI_PAI_TYPE_AN_HUA_PAO_HU_ZI";   //字牌类型
    MjClient.KEY_ZI_PAI_SU_DU_TYPE  = "KEY_ZI_PAI_SU_DU_TYPE_AN_HUA_PAO_HU_ZI";   //字牌游戏 动画速度
    MjClient.KEY_ZI_PAI_PLAY_TING_PAI  = "KEY_ZI_PAI_PLAY_TING_PAI_AN_HUA_PAO_HU_ZI";   //听牌提示
    MjClient.KEY_ZI_PAI_VOICE_TYPE = "KEY_ZI_PAI_VOICE_TYPE_AN_HUA_PAO_HU_ZI"; // 字牌游戏语音
    MjClient.KEY_ZI_PAI_CARD_SIZE = "KEY_ZI_PAI_CARD_SIZE_AN_HUA_PAO_HU_ZI"; // 字牌大小
};

//Override
playPanel_ahPaoHuZi.prototype.isShowLongCard = function() {
    return false;
};

//Override
playPanel_ahPaoHuZi.prototype.createGameOverLayer = function(type) {
    return new GameOverLayer_ahPaoHuZi();
};

//Override
playPanel_ahPaoHuZi.prototype.createEndOneLayer = function(type) {
    if (this.isCoinField()) {
        return new EndOneView_ahPaoHuZiGold();
    }
    return new EndOneView_ahPaoHuZi();
};

//字牌字体idx
playPanel_ahPaoHuZi.prototype.getCardFontIdx = function() {
    return util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_ZI_PAI_TYPE, 1);
};

//布局类型
playPanel_ahPaoHuZi.prototype.getLayoutType = function() {
    return util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_PLAY_UI_LAYOUT, 1);
};

//Override
playPanel_ahPaoHuZi.prototype.getGameBgList = function() {
    return ["playing/anhuapaohuzi/bg/beijing_1.jpg", "playing/anhuapaohuzi/bg/beijing_2.jpg", "playing/anhuapaohuzi/bg/beijing_3.jpg"];
};

//Override
playPanel_ahPaoHuZi.prototype.getGameBgIdx = function() {
    return util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_GAME_BG_TYPE, 0);
};

//Override
playPanel_ahPaoHuZi.prototype.getHuXiType = function() {
    return util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_HU_XI_TYPE, 1);
};

//Override
playPanel_ahPaoHuZi.prototype.getXuXianType = function() {
    return util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_XU_XIAN_TYPE, 0);
};

//Override
playPanel_ahPaoHuZi.prototype.getSuDuType = function() {
    return util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_SU_DU_TYPE, 0);
};

//Override
playPanel_ahPaoHuZi.prototype.getTingPaiType = function() {
    return util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_PLAY_TING_PAI, 0);
};

//Override
playPanel_ahPaoHuZi.prototype.getVoiceType = function() {
    return util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_VOICE_TYPE, 1);
};

//Override
playPanel_ahPaoHuZi.prototype.getFastEatType = function() {
    return util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_FAST_EAT_TYPE, 0);
};

playPanel_ahPaoHuZi.prototype.isAniParallel = function() {
    return true;
};

//Override
playPanel_ahPaoHuZi.prototype.isLeftTop = function() {
    return false;
};

playPanel_ahPaoHuZi.prototype.getEatCardShowType = function(eatType, card, cardIndex, off) {
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

playPanel_ahPaoHuZi.prototype.getResType = function () {
  return 1;
};

playPanel_ahPaoHuZi.prototype.isCheckTingStats = function() {
    return true;
}

playPanel_ahPaoHuZi.prototype.getTingStats = function(putCard) {
    var sData = MjClient.data.sData;
    var pl = sData.players[SelfUid()];
    return MjClient.majiang.getTingStats(sData, pl, putCard);
}

playPanel_ahPaoHuZi.prototype.isPutCardLayout = function() {
    return true;
}

playPanel_ahPaoHuZi.prototype.getMjhandDelay = function() {
    return 2;
};