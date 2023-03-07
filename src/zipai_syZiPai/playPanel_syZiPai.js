//新版邵阳字牌
var playPanel_syZiPai = playLayer_ziPai.extend({
    ctor: function() {
        this._super("Play_shaoYangZiPai.json");

        if (MjClient.data.sData.tData.areaSelectMode["convertible"] && MjClient.rePlayVideo == -1){
            addFreeNumberBtn([0.5, 0.4]);
        }
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
                        MjClient.Scene.addChild(new settingPanel_syZiPai(), 6000);
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
            node_jiaChui: {
                _event: {
                    initSceneData: function() {
                        this.visible = false;
                        var pl = MjClient.playui.getUIPlayer(0);
                        var tData = MjClient.data.sData.tData;
                        if (tData.tState == TableState.waitJiazhu && pl.jiachuiNum == -1) {
                            this.visible = true;
                        }
                    },
                    waitJiazhu: function() {
                        this.visible = true;
                    },
                    MJJiazhu: function() {
                        var pl = MjClient.playui.getUIPlayer(0);
                        if (pl.jiachuiNum != -1) {
                            this.visible = false;
                        }
                    }
                },
                btn_jiaChui: {
                    _layout: [
                        [0.12, 0.12],
                        [0.4, 0.4],
                        [0, 0]
                    ],
                    _click: function(btn) {
                        MjClient.gamenet.request("pkroom.handler.tableMsg", {
                            cmd: "MJJiazhu",
                            jiachuiNum: 1,
                        });
                    }
                },
                btn_buChui: {
                    _layout: [
                        [0.12, 0.12],
                        [0.6, 0.4],
                        [0, 0]
                    ],
                    _click: function(btn) {
                        MjClient.gamenet.request("pkroom.handler.tableMsg", {
                            cmd: "MJJiazhu",
                            jiachuiNum: 0,
                        });
                    }
                }
            },
            node_left:{
                layout_eatDisplay: {
                    _layout: [[0.12, 0.12], [0.04, 0.93], [0, 0]],
                },
                layout_head: {
                    img_jiachuiText : {
                        _run:function() {
                            MjClient.playui.showOrHideJiachuiText(this, MjClient.playui.getUIOffByNode(this));
                        },
                        _event:{
                            initSceneData: function() {
                                MjClient.playui.showOrHideJiachuiText(this, MjClient.playui.getUIOffByNode(this));
                            },
                            MJJiazhu: function() {
                                MjClient.playui.showOrHideJiachuiText(this, MjClient.playui.getUIOffByNode(this));
                            },
                            mjhand: function() {
                                this.visible = false;
                            }
                        }
                    }
                }
            },
            node_right:{
                layout_eatDisplay: {
                    _layout: [[0.12, 0.12], [0.95, 0.91], [0, 0]],
                },
                layout_head: {
                    img_jiachuiText : {
                        _run:function() {
                            MjClient.playui.showOrHideJiachuiText(this, MjClient.playui.getUIOffByNode(this));
                        },
                        _event:{
                            initSceneData: function() {
                                MjClient.playui.showOrHideJiachuiText(this, MjClient.playui.getUIOffByNode(this));
                            },
                            MJJiazhu: function() {
                                MjClient.playui.showOrHideJiachuiText(this, MjClient.playui.getUIOffByNode(this));
                            },
                            mjhand: function() {
                                this.visible = false;
                            }
                        }
                    }
                }
            },
            node_down:{
                layout_eatDisplay: {
                    _layout: [[0.12, 0.12], [0.5, 0.45], [0, 0]],
                },
                img_putCard: {
                    _layout: [[0.35, 0.35], [0.65, 0.6], [0, 0]]
                },
                layout_head: {
                    img_jiachuiText : {
                        _run:function() {
                            MjClient.playui.showOrHideJiachuiText(this, MjClient.playui.getUIOffByNode(this));
                        },
                        _event:{
                            initSceneData: function() {
                                MjClient.playui.showOrHideJiachuiText(this, MjClient.playui.getUIOffByNode(this));
                            },
                            MJJiazhu: function() {
                                MjClient.playui.showOrHideJiachuiText(this, MjClient.playui.getUIOffByNode(this));
                            },
                            mjhand: function() {
                                this.visible = false;
                            }
                        }
                    }
                }
            },
            node_xing:{
                layout_eatDisplay: {
                    _layout: [[0.12, 0.12], [0.95, 0.10], [0, 0]],
                },
                layout_head: {
                    img_jiachuiText : {
                        _run:function() {
                            MjClient.playui.showOrHideJiachuiText(this, MjClient.playui.getUIOffByNode(this));
                        },
                        _event:{
                            initSceneData: function() {
                                MjClient.playui.showOrHideJiachuiText(this, MjClient.playui.getUIOffByNode(this));
                            },
                            MJJiazhu: function() {
                                MjClient.playui.showOrHideJiachuiText(this, MjClient.playui.getUIOffByNode(this));
                            },
                            mjhand: function() {
                                this.visible = false;
                            }
                        }
                    }
                }
            },
        };

        return jsBind;
    },
});

playPanel_syZiPai.prototype.showOrHideJiachuiText = function(node, off) {
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
playPanel_syZiPai.prototype.checkCanShowDistance = function(layoutData) {
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
playPanel_syZiPai.prototype.getCardFontList = function() {
    return ["type1", "type2", "type3"];
};

//Override
playPanel_syZiPai.prototype.checkChuiFlagVisible = function(node) {
    var off = this.getUIOffByNode(node);
    var pl = this.getUIPlayer(off);
    var tData = MjClient.data.sData.tData;
    if (!pl || !tData.areaSelectMode.isJiaChui) {
        node.visible = false;
        return;
    }

    node.visible = true;
    if (pl.jiachuiNum == 1) {
        node.loadTexture("playing/ziPaiBanner/chui.png");
    } else {
        if (pl.jiachuiNum == -1) {
            node.visible = false;
        }
        node.loadTexture("playing/ziPaiBanner/buchui.png");
    }
};

//Override
playPanel_syZiPai.prototype.initSettingData = function() {
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
playPanel_syZiPai.prototype.isShowLongCard = function() {
    return true;
};

playPanel_syZiPai.prototype.isCheckTingStats = function() {
    return true;
}

//获取听的牌
playPanel_syZiPai.prototype.getTingCards = function(sData, pl, putCard) {
    return MjClient.huzi.getTingCards(sData, pl, putCard);
};

/**
 * 计算听牌提示
 */
playPanel_syZiPai.prototype.calculateHintPutList = function() {
    MjClient.hintPutList_ziPai = MjClient.huzi.hintPutCardsToTing();
};

//Override
playPanel_syZiPai.prototype.createGameOverLayer = function(type) {
    return new GameOverLayer_syZiPai();
};

//Override
playPanel_syZiPai.prototype.createEndOneLayer = function(type) {
    return new EndOneView_syZiPai();
};

//字牌字体idx
playPanel_syZiPai.prototype.getCardFontIdx = function() {
    return util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_ZI_PAI_TYPE, 2);
};

//布局类型
playPanel_syZiPai.prototype.getLayoutType = function() {
    return util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_PLAY_UI_LAYOUT, 0);
};

//Override
playPanel_syZiPai.prototype.getGameBgList = function() {
    return ["playing/gameTable/beijing_1.jpg", "playing/gameTable/beijing_2.jpg", "playing/gameTable/beijing_3.jpg"];
};

//Override
playPanel_syZiPai.prototype.getGameBgIdx = function() {
    return util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_GAME_BG_TYPE, 0);
};

//Override
playPanel_syZiPai.prototype.getHuXiType = function() {
    var idx = util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_HU_XI_TYPE, 0);
    return [1, 0][idx];
};

//Override
playPanel_syZiPai.prototype.getXuXianType = function() {
    return util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_XU_XIAN_TYPE, 1);
};

//Override
playPanel_syZiPai.prototype.getSuDuType = function() {
    var old = util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_SU_DU_TYPE, 2);
    return [2,0,1,3][old];
};

//Override
playPanel_syZiPai.prototype.getTingPaiType = function() {
    var idx = util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_PLAY_TING_PAI, 1);
    return [1, 0][idx];
};

playPanel_syZiPai.prototype.isAniParallel = function() {
    return false;
};

playPanel_syZiPai.prototype.changeEatBtnLayout = function(btnNode, len, idx) {
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