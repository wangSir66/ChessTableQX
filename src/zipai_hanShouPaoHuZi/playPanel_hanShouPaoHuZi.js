// 宁乡跑胡子
var playLayer_hanShouPaoHuZi;
(function() {
    playLayer_hanShouPaoHuZi = playLayer_ziPai.extend({
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
                            MjClient.Scene.addChild(new setting_hanShouPaoHuZi(), 6000);
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
            this._super("Play_ZiPaiHanShou.json");
            if(MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ || MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP){
                MjClient.playui.jsBind._node.addChild(new roundRule_ziPai(roundRule_ziPai.getRoundRules()));
            }
            return true;
        },
    });
}());

playLayer_hanShouPaoHuZi.prototype.initSettingData = function() {
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

//Override
playLayer_hanShouPaoHuZi.prototype.createGameOverLayer = function(type) {
    return new GameOverLayer_hanShouPaoHuZi();
};

//Override
playLayer_hanShouPaoHuZi.prototype.createEndOneLayer = function(type) {
    return new EndOneView_hanShouPaoHuZi();
};

//Override
playLayer_hanShouPaoHuZi.prototype.getGameBgList = function() {
    return ["playing/paohuziTable/bg_changDe/beijing_1.jpg", "playing/paohuziTable/bg_changDe/beijing_2.jpg", "playing/paohuziTable/bg_changDe/beijing_3.jpg"];
};

//Override
playLayer_hanShouPaoHuZi.prototype.isShowLongCard = function(){
    return true;
}

playLayer_hanShouPaoHuZi.prototype.isLeftTop = function() {
    return true;
};

//Override 字牌字体列表
playLayer_hanShouPaoHuZi.prototype.getCardFontList = function() {
    return ["type3", "type2", "type1"];
};

playLayer_hanShouPaoHuZi.prototype.getLayoutType = function() {
    return util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_PLAY_UI_LAYOUT, 0);
};

playLayer_hanShouPaoHuZi.prototype.getCardFontIdx = function() {
    return util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_ZI_PAI_TYPE, 0);
};


playLayer_hanShouPaoHuZi.prototype.isAniParallel = function() {
    return false;
};

//Override
// 获取提、偎牌的显示类型
playLayer_hanShouPaoHuZi.prototype.getCardShowType = function(card, off) {
    var indexInUids = this.getIndexInUids(off);
    var pl = MjClient.data.sData.players[MjClient.data.sData.tData.uids[indexInUids]];
    // 展示
    if (!(pl.mjHide && pl.mjHide.indexOf(card) >= 0)) {
        return 2;
    }
    // 隐藏牌 提偎牌玩家自己展示
    if (pl.info.uid == SelfUid()) {
        return 2;
    }

    return 0;
};

playLayer_hanShouPaoHuZi.prototype.getEatCardShowType = function(eatType, card, cardIndex, off) {
    var showType = 2;
    if (eatType == "mjchi") {
        showType = cardIndex < 2 ? 2 : 3;
    } else if (eatType == "mjwei") {
        showType = this.getCardShowType(card, off);
        if (showType == 2) {
            showType = this.getShowCardIndex(eatType, off) == cardIndex ? 2 : 0;
        }
    }else if (eatType == "mjgang1") {
        showType = this.getShowCardIndex(eatType, off) == cardIndex ? 2 : 0;
    }
    return showType;
};

playLayer_hanShouPaoHuZi.prototype.isCheckTingStats = function() {
    return true;
};

playLayer_hanShouPaoHuZi.prototype.isPutCardLayout = function() {
    return true;
};

playLayer_hanShouPaoHuZi.prototype.getTingStats = function(putCard) {
    var sData = MjClient.data.sData;
    var pl = sData.players[SelfUid()];
    // 调用自己的听牌算法
    return MjClient.majiang.getTingStats(sData, pl, putCard);
} 
