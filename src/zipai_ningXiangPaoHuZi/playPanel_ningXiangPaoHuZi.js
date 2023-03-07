// 宁乡跑胡子
var playLayer_ningXiangPaoHuZi;
(function() {
    playLayer_ningXiangPaoHuZi = playLayer_ziPai.extend({
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
                    
                },
                node_right:{
                   
                },
                node_xing:{
                    
                },
                node_down:{
                    
                },
                btn_putCrad:{
                    _visible: false,
                },
                img_banner:{
                    btn_setting: {
                        _click: function() {
                            cc.log("btn_setting");
                            MjClient.Scene.addChild(new setting_ningXiangPaoHuZi(), 6000);
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
            };
            return jsBind;
        },
        ctor: function() {
            this._super("Play_ZiPaiNingXiang.json");
            if(MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ || MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP){
                MjClient.playui.jsBind._node.addChild(new roundRule_ziPai(roundRule_ziPai.getRoundRules()));
            }
            return true;
        },
    });
}());

playLayer_ningXiangPaoHuZi.prototype.initSettingData = function() {
    MjClient.KEY_ZI_PAI_PLAY_UI_LAYOUT  = "KEY_ZI_PAI_PLAY_UI_LAYOUT_NING_XIANG_ZI_PAI";   //字牌布局
    MjClient.KEY_ZI_PAI_GAME_BG_TYPE  = "KEY_ZI_PAI_GAME_BG_TYPE_NING_XIANG_ZI_PAI";   //字牌游戏背景类型
    MjClient.KEY_ZI_PAI_ZI_PAI_TYPE  = "KEY_ZI_PAI_ZI_PAI_TYPE_NING_XIANG_ZI_PAI";   //字牌类型
    MjClient.KEY_ZI_PAI_SU_DU_TYPE  = "KEY_ZI_PAI_SU_DU_TYPE_NING_XIANG_ZI_PAI";   //字牌游戏 动画速度
    MjClient.KEY_ZI_PAI_PLAY_TING_PAI  = "KEY_ZI_PAI_PLAY_TING_PAI_NING_XIANG_ZI_PAI";   //听牌提示
    MjClient.KEY_ZI_PAI_VOICE_TYPE = "KEY_ZI_PAI_VOICE_TYPE_NING_XIANG_ZI_PAI"; // 字牌游戏语音
    MjClient.KEY_ZI_PAI_CARD_SIZE = "KEY_ZI_PAI_CARD_SIZE_NING_XIANG_ZI_PAI"; // 字牌大小
    MjClient.KEY_ZI_PAI_HU_XI_TYPE = "KEY_ZI_PAI_HU_XI_TYPE_NING_XIANG_ZI_PAI"; // 胡息显示
};

//Override
playLayer_ningXiangPaoHuZi.prototype.createGameOverLayer = function(type) {
    return new GameOverLayer_ningXiangPaoHuZi();
};

//Override
playLayer_ningXiangPaoHuZi.prototype.createEndOneLayer = function(type) {
    return new EndOneView_ningXiangPaoHuZi();
};

//Override
playLayer_ningXiangPaoHuZi.prototype.getGameBgList = function() {
    return ["playing/anhuapaohuzi/bg/beijing_1.jpg", "playing/anhuapaohuzi/bg/beijing_2.jpg", "playing/anhuapaohuzi/bg/beijing_3.jpg"];
};

//Override
playLayer_ningXiangPaoHuZi.prototype.isShowLongCard = function(){
    return true;
}

playLayer_ningXiangPaoHuZi.prototype.isLeftTop = function() {
    return true;
};

//Override 字牌字体列表
playLayer_ningXiangPaoHuZi.prototype.getCardFontList = function() {
    return ["type5", "type4", "type3"];
};

//Override 字牌大小idx
playLayer_ningXiangPaoHuZi.prototype.getCardSizeIdx = function() {
    return util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_CARD_SIZE, 2);
};

//Override
playLayer_ningXiangPaoHuZi.prototype.getCardFontIdx = function() {
    return util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_ZI_PAI_TYPE, 1);
};

//Override 是否胡息显示类型
playLayer_ningXiangPaoHuZi.prototype.getHuXiType = function() {
    return util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_HU_XI_TYPE, 0);
};

playLayer_ningXiangPaoHuZi.prototype.getInitDiPaiCount = function() {
    var tData = MjClient.data.sData.tData;
    if (tData.maxPlayer == 4) {
        return MjClient.majiang.getAllCardsTotal() -  tData.maxPlayer * 14;
    }else{
        return MjClient.majiang.getAllCardsTotal() -  tData.maxPlayer * 20;
    } 
};

playLayer_ningXiangPaoHuZi.prototype.isAniParallel = function() {
    return false;
};

//Override
playLayer_ningXiangPaoHuZi.prototype.getEatCardShowType = function(eatType, card, cardIndex, off) {
    var showType = 2;
    if (eatType == "mjchi") {
        showType = cardIndex < 2 ? 2 : 3;
    } else if (eatType == "mjwei") {
        showType = this.getCardShowType(card, off);
        if (showType == 2) {
            showType = this.getShowCardIndex(eatType, off) == cardIndex ? 2 : 0;
        }
    } else if (eatType == "mjgang1") {
        showType = this.getShowCardIndex(eatType, off) == cardIndex ? 2 : 0;
    }
    return showType;
};

playLayer_ningXiangPaoHuZi.prototype.isCheckTingStats = function() {
    return true;
}

playLayer_ningXiangPaoHuZi.prototype.getTingStats = function(putCard) {
    var sData = MjClient.data.sData;
    var pl = sData.players[SelfUid()];
    return MjClient.majiang.getTingStats(sData, pl, putCard);
}

playLayer_ningXiangPaoHuZi.prototype.isPutCardLayout = function() {
    return true;
}