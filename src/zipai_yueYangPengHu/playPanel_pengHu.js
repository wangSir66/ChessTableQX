// 郴州字牌
var playLayer_pengHu;
(function() {
    playLayer_pengHu = playLayer_ziPai.extend({
        getJsBind: function(){
            var jsBind = {
                _event:{
                    HZPickScore:function (msg) {
                        MjClient.playui.pickScore(msg);
                    },
                    HZAlarm : function(){
                        MjClient.playui.refreshHandCard(0);
                    },
                    initSceneData:function () {
                        MjClient.playui.checkAlarm();
                    },
                    HZWeiCard:function () {
                        MjClient.playui.checkAlarm();
                    },
                },
                text_roundInfo: {
                    _run: function () {
                        if (MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ || MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP) {
                            this.visible = false;
                        }
                    },
                },
                node_left:{
                    img_putCard: {
                        _event: {
                            HZGangCard: function(eD) {
                                if (!eD.isGangHand) {
                                    MjClient.playui.checkPutCardPengOrPao(this, "mjgang", eD);
                                }
                            },
                            MJPeng: function(eD) {
                                MjClient.playui.checkPutCardPengOrPao(this, "mjpeng", eD);
                            },
                        }
                    },
                    layout_head: {
                        img_alarm : {
                            _visible: false,
                            _run : function(){
                                this.setScale(1.5);
                            },
                            img_guang : {
                                _run : function(){
                                    this.setScale(1.5);
                                    var a1 = cc.fadeIn(0.5);
                                    var a2 = cc.fadeOut(1.0);
                                    this.runAction(cc.RepeatForever.create(cc.Sequence.create(a1,a2)));
                                }
                            },
                            _event : {
                                initSceneData: function() {
                                    MjClient.playui.checkAlarmVisible(this);
                                },
                                HZAlarm : function(){
                                    MjClient.playui.checkAlarmVisible(this);
                                },
                                roundEnd : function(){
                                    this.visible = false;
                                }
                            }
                        },
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
                        text_huXiNum: {
                            _event: {
                                HZPickScore : function(){
                                    MjClient.playui.updateHuXi(this);
                                }
                            }
                        },
                    }
                },
                node_right:{
                    img_putCard: {
                        _event: {
                            HZGangCard: function(eD) {
                                if (!eD.isGangHand) {
                                    MjClient.playui.checkPutCardPengOrPao(this, "mjgang", eD);
                                }
                            },
                            MJPeng: function(eD) {
                                MjClient.playui.checkPutCardPengOrPao(this, "mjpeng", eD);
                            },
                        }
                    },
                    layout_head: {
                        img_alarm : {
                            _visible: false,
                            _run : function(){
                                this.setScale(1.5);
                            },
                            img_guang : {
                                _run : function(){
                                    this.setScale(1.5);
                                    var a1 = cc.fadeIn(0.5);
                                    var a2 = cc.fadeOut(1.0);
                                    this.runAction(cc.RepeatForever.create(cc.Sequence.create(a1,a2)));
                                }
                            },
                            _event : {
                                initSceneData: function() {
                                    MjClient.playui.checkAlarmVisible(this);
                                },
                                HZAlarm : function(){
                                    MjClient.playui.checkAlarmVisible(this);
                                },
                                roundEnd : function(){
                                    this.visible = false;
                                }
                            }
                        },
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
                        text_huXiNum: {
                            _event: {
                                HZPickScore : function(){
                                    MjClient.playui.updateHuXi(this);
                                }
                            }
                        },
                    }
                },
                node_xing:{
                    img_putCard: {
                        _event: {
                            HZGangCard: function(eD) {
                                if (!eD.isGangHand) {
                                    MjClient.playui.checkPutCardPengOrPao(this, "mjgang", eD);
                                }
                            },
                            MJPeng: function(eD) {
                                MjClient.playui.checkPutCardPengOrPao(this, "mjpeng", eD);
                            },
                        }
                    },
                    layout_head: {
                        img_alarm : {
                            _visible: false,
                            _run : function(){
                                this.setScale(1.5);
                            },
                            img_guang : {
                                _run : function(){
                                    this.setScale(1.5);
                                    var a1 = cc.fadeIn(0.5);
                                    var a2 = cc.fadeOut(1.0);
                                    this.runAction(cc.RepeatForever.create(cc.Sequence.create(a1,a2)));
                                }
                            },
                            _event : {
                                initSceneData: function() {
                                    MjClient.playui.checkAlarmVisible(this);
                                },
                                HZAlarm : function(){
                                    MjClient.playui.checkAlarmVisible(this);
                                },
                                roundEnd : function(){
                                    this.visible = false;
                                }
                            }
                        },
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
                        text_huXiNum: {
                            _event: {
                                HZPickScore : function(){
                                    MjClient.playui.updateHuXi(this);
                                }
                            }
                        },
                    }
                },
                node_down:{
                    img_putCard: {
                        _event: {
                            HZGangCard: function(eD) {
                                if (!eD.isGangHand) {
                                    MjClient.playui.checkPutCardPengOrPao(this, "mjgang", eD);
                                }
                            },
                            MJPeng: function(eD) {
                                MjClient.playui.checkPutCardPengOrPao(this, "mjpeng", eD);
                            },
                        }
                    },
                    layout_head: {
                        img_alarm : {
                            _visible: false,
                            _run : function(){
                                this.setScale(1.5);
                            },
                            img_guang : {
                                _run : function(){
                                    this.setScale(1.5);
                                    var a1 = cc.fadeIn(0.5);
                                    var a2 = cc.fadeOut(1.0);
                                    this.runAction(cc.RepeatForever.create(cc.Sequence.create(a1,a2)));
                                }
                            },
                            _event : {
                                initSceneData: function() {
                                    MjClient.playui.checkAlarmVisible(this);
                                },
                                HZAlarm : function(){
                                    MjClient.playui.checkAlarmVisible(this);
                                },
                                roundEnd : function(){
                                    this.visible = false;
                                }
                            }
                        },
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
                        text_huXiNum: {
                            _event: {
                                HZPickScore : function(){
                                    MjClient.playui.updateHuXi(this);
                                }
                            }
                        },
                    }
                },
                img_banner:{
                    btn_setting: {
                        _click: function() {
                            cc.log("btn_setting");
                            MjClient.Scene.addChild(new setting_pengHu(), 6000);
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
                layout_cardNum:{
                    img_card: {
                        _run: function() {
                            this.refreshCardsTotal = function(isRemove) {
                                var tData = MjClient.data.sData.tData;
                                var cardsTotal = MjClient.playui.getInitDiPaiCount();
                                var left = MjClient.majiang.cardsCount( MjClient.data.sData) - tData.cardNext;
                                if (isRemove) {
                                    var children = this.getChildren();
                                    var count = this.getChildrenCount();
                                    var factRemoveCount = (cardsTotal - left) / (cardsTotal / 20);
                                    if (Math.floor(count + factRemoveCount) > 20) {
                                        children[count - 1].removeFromParent(true);
                                    }
                                } else {
                                    this.removeAllChildren();
                                    left = left / (cardsTotal / 20);
                                    for (var i = 1; i <= left; i++) {
                                        var child = ccui.ImageView("playing/ziPaiBanner/paidui.png");
                                        child.setPosition(cc.p(this.width / 2, this.height / 2 + i * 0.8));
                                        this.addChild(child);
                                    }
                                }
                            }
                        },
                    },
                    text_cardNum: {
                        _run: function() {
                            this.ignoreContentAdaptWithSize(true);
                            this.refreshText = function() {
                                var tData = MjClient.data.sData.tData;
                                if (tData) {
                                    this.setString(MjClient.majiang.cardsCount(MjClient.data.sData) - tData.cardNext);
                                }

                                var img_card = this.getParent().getChildByName("img_card");
                                this.y = 40 + img_card.getChildrenCount() * 0.8;
                            };
                            this.refreshText();
                        },
                    },
                },
                node_eatChoice:{
                    btn_peng: {
                        _click: function() {
                            if ((MjClient.data.sData.players[SelfUid()].eatFlag & 32) > 0) {
                                MjClient.showMsg("选择碰后视为过胡，确定碰吗？", function() {
                                    if(MjClient.data.sData.players[SelfUid()].alarmFlag == -1){
                                        MjClient.showMsg("请选择是否报警？报警后只能碰胡， 点击 确定 报警", function() {
                                            MjClient.playui.alarm(1);//报警
                                            MjClient.playui.hideEatBtns();
                                            MjClient.gamenet.request("pkroom.handler.tableMsg", {
                                                cmd: "MJPeng"
                                            });
                                        }, function() {
                                            MjClient.playui.alarm(0);
                                            MjClient.playui.hideEatBtns();
                                            MjClient.gamenet.request("pkroom.handler.tableMsg", {
                                                cmd: "MJPeng"
                                            });
                                        }, "1");
                                    }else{
                                        MjClient.playui.hideEatBtns();
                                        MjClient.gamenet.request("pkroom.handler.tableMsg", {
                                            cmd: "MJPeng"
                                        });
                                    }
                                }, function() {}, "1");
                            } else {
                                if(MjClient.data.sData.players[SelfUid()].alarmFlag == -1){
                                    MjClient.showMsg("请选择是否报警？报警后只能碰胡， 点击 确定 报警", function() {
                                        MjClient.playui.alarm(1);//报警
                                        MjClient.playui.hideEatBtns();
                                        MjClient.gamenet.request("pkroom.handler.tableMsg", {
                                            cmd: "MJPeng"
                                        });
                                    }, function() {
                                        MjClient.playui.alarm(0);
                                        MjClient.playui.hideEatBtns();
                                        MjClient.gamenet.request("pkroom.handler.tableMsg", {
                                            cmd: "MJPeng"
                                        });
                                    }, "1");
                                }else{
                                    MjClient.playui.hideEatBtns();
                                    MjClient.gamenet.request("pkroom.handler.tableMsg", {
                                        cmd: "MJPeng"
                                    });
                                }


                            }
                        }
                    },
                }
            };
            return jsBind;
        },
        isAlarming : false, //是否在报警弹窗中
        ctor: function() {
            this._super("Play_ZiPaiPengHu.json");
            if(MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ || MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP){
                MjClient.playui.jsBind._node.addChild(new roundRule_ziPai(roundRule_ziPai.getRoundRules()));
            }
            return true;
        },
    });
}());

playLayer_pengHu.prototype.initSettingData = function() {
    MjClient.KEY_ZI_PAI_PLAY_UI_LAYOUT  = "KEY_ZI_PAI_PLAY_UI_LAYOUT_YANG_PENG_HU";   //字牌布局
    MjClient.KEY_ZI_PAI_GAME_BG_TYPE  = "KEY_ZI_PAI_GAME_BG_TYPE_YANG_PENG_HU";   //字牌游戏背景类型
    MjClient.KEY_ZI_PAI_ZI_PAI_TYPE  = "KEY_ZI_PAI_ZI_PAI_TYPE_YANG_PENG_HU";   //字牌类型
    MjClient.KEY_ZI_PAI_SU_DU_TYPE  = "KEY_ZI_PAI_SU_DU_TYPE_YANG_PENG_HU";   //字牌游戏 动画速度
    MjClient.KEY_ZI_PAI_PLAY_TING_PAI  = "KEY_ZI_PAI_PLAY_TING_PAI_YANG_PENG_HU";   //听牌提示
    MjClient.KEY_ZI_PAI_CARD_SIZE = "KEY_ZI_PAI_CARD_SIZE_YUE_YANG_PENG_HU"; // 字牌大小
};

//Override
playLayer_pengHu.prototype.createGameOverLayer = function(type) {
    return MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP ? new GameOverLayer_HYZiPai() : new GameOverLayer_yueYangPengHu();
};

//Override
playLayer_pengHu.prototype.createEndOneLayer = function(type) {
    return new EndOneView_yueYangPengHu();
};

//Override
playLayer_pengHu.prototype.getGameBgList = function() {
    return ["playing/anhuapaohuzi/bg/beijing_1.jpg", "playing/anhuapaohuzi/bg/beijing_2.jpg", "playing/anhuapaohuzi/bg/beijing_3.jpg"];
};

//飘分
playLayer_pengHu.prototype.paioFenToServer = function(index) {
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

//飘风操作的提示显示
playLayer_pengHu.prototype.setChuiTips = function(node) {
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
playLayer_pengHu.prototype.showPiaoBtns = function(node) {
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
playLayer_pengHu.prototype.checkChuiFlagVisible = function(node) {
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

playLayer_pengHu.prototype.getInitDiPaiCount = function() {
    var tData = MjClient.data.sData.tData;
    return MjClient.majiang.getAllCardsTotal() - 4 * 14;
}

playLayer_pengHu.prototype.isCheckTingStats = function() {
    return true;
}

playLayer_pengHu.prototype.getTingStats = function(putCard) {
    var sData = MjClient.data.sData;
    var pl = sData.players[SelfUid()];
    return MjClient.majiang.getTingStats(sData, pl, putCard);
}

playLayer_pengHu.prototype.isPutCardLayout = function() {
    return true;
}

playLayer_pengHu.prototype.getDefaultSetting = function() {
    return {
        layout: 1,
        bg: 0,
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

// 房主
playLayer_pengHu.prototype.checkFangZhuVisible = function(node) {
    node.visible = false;
};

playLayer_pengHu.prototype.checkAlarmVisible = function(node) {
    node.visible = false;
    var off = this.getUIOffByNode(node)
    var pl = this.getUIPlayer(off)
    if(pl && pl.alarmFlag == 1){
        node.visible = true;
    }
};

playLayer_pengHu.prototype.checkZhuangVisible = function(node) {
    var tData = MjClient.data.sData.tData;
    node.visible = false;
    if (!this.isInPlay()) {
        return;
    }

    var off = this.getUIOffByNode(node);
    var pl = this.getUIPlayer(off);
    if (!pl) {
        return;
    }

    if (tData.uids[tData.zhuang] == pl.info.uid) {
        node.visible = true;

        var img_linkNum = node.getChildByName("img_linkNum");
        img_linkNum.ignoreContentAdaptWithSize(true);
        img_linkNum.setString(pl.linkZhuang);
    }
};

playLayer_pengHu.prototype.getPlayerScore = function(off) {
    var pl = this.getUIPlayer(off);
    if (!pl)
        return;
    var tData = MjClient.data.sData.tData;
    var score = tData.initCoin + pl.winall;
    if (tData.isFanBei) {
        score = tData.initCoin + pl.winall * 0.5;
    }

    return "积分:" + score;
};

playLayer_pengHu.prototype.pickScore = function (msg) {
    var pickScores = msg.pickScores;
    var scoreUid;
    for (var uid in pickScores) {
        if(pickScores[uid] > 0){
            scoreUid = uid;
            break;
        }
    }
    function startCoinFly(list, targetPos) {
        var index = 0;
        var tID = setInterval(function(){
            var gold = list[index];
            gold.doMoveAction(cc.pAdd(targetPos, cc.p(Math.random()*20, Math.random()*20)));
            index += 1;
            if(index >= list.length){
                clearInterval(tID);
            }
        }, 50);
        setTimeout(function(){
            playEffect("penghu/effect/jetton", false);
        }, 100);
    }
    var _AniNode = MjClient.playui.jsBind.node_down._node;
    for (var uid in pickScores) {
        if(pickScores[uid] < 0){
            var startPos = this.getUINodeByUid(parseInt(uid)).getChildByName("layout_head").getPosition();
            startPos = this.getUINodeByUid(parseInt(uid)).convertToWorldSpace(startPos);
            startPos = _AniNode.convertToNodeSpace(startPos);
            var targetPos = this.getUINodeByUid(parseInt(scoreUid)).getChildByName("layout_head").getPosition();
            targetPos = this.getUINodeByUid(parseInt(scoreUid)).convertToWorldSpace(targetPos);
            targetPos = _AniNode.convertToNodeSpace(targetPos);
            var list = [];
            for(var i = 0; i < 10; i++){
                var gold = new yueYangPengHu.Gold();
                gold.setPosition(startPos);
                gold.setScale(MjClient.size.height/720);
                _AniNode.addChild(gold,10000);
                list.push(gold);
            }
            startCoinFly(list, targetPos);
        }
    }
}

playLayer_pengHu.prototype.updateHuXi = function(node) {
    node.setString("");
    if (!this.isInPlay()) {
        return;
    }

    var off = this.getUIOffByNode(node);
    var pl = this.getUIPlayer(off);
    if (!pl) {
        return;
    }

    node.setVisible(true);
    node.setString("本局:"+pl.winone);
};

// 是否需要切牌动画
playLayer_pengHu.prototype.isNeedShuffle = function() {
    return MjClient.data.sData.tData.areaSelectMode.isManualCutCard;
};

playLayer_pengHu.prototype.getEatCardShowType = function(eatType, card, cardIndex, off) {
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

playLayer_pengHu.prototype.getOtherEatCardArr = function(eatType, off, pos) {
    var card = this.getEatCard(eatType, off, pos);

    var countArr = {
        mjpeng: 3,
        mjgang0: 4,
        mjwei: 3,
        mjgang1: 4,
        mjgang2: 4,
    };

    var pl = this.getUIPlayer(off);
    if((eatType == "mjpeng" || eatType == "mjgang0") && MjClient.majiang.isPengOrPaoCardByPutFromOther(pl, card)){
        countArr[eatType] = countArr[eatType] - 1;
    }

    var cardArr = [];
    var tempArr = [];
    for (var i = 0; i < countArr[eatType]; i++) {
        tempArr.push(card);
    }
    cardArr.push(tempArr);
    return cardArr;
};

playLayer_pengHu.prototype.checkPutCardPengOrPao = function (node, eatType, msg) {
    var off = this.getUIOffByNode(node);
    eatType = this.apartGangType(eatType, msg);

    var tData = MjClient.data.sData.tData;
    if((eatType != "mjpeng" && eatType != "mjgang0") || tData.putType != 0){
        node.visible = false;
        return;
    }
    var pl = this.getUIPlayer(off);
    if (this.getIndexInUids(off) != msg.from) { // 不是发牌玩家上家
        node.visible = false;
        return;
    }

    var uiNode = this.getUINode(off);
    if(MjClient.majiang.isPengOrPaoCardByPutForOther(MjClient.data.sData, pl, pl.mjput[pl.mjput.length - 1], pl.mjput.length - 1)){
        var endPos = this.getOutCardPos(off);
        var outLayout = uiNode.getChildByName("layout_outCards");
        var outCard = this.getNewCard("out", pl.mjput[pl.mjput.length - 1], off, false);
        outCard.setPosition(endPos);
        outLayout.addChild(outCard);

        var anmEndPos = outLayout.convertToWorldSpace(cc.p(endPos.x, endPos.y)); // 动画结束坐标
        var actTime = this.getAniTimeByType("land");
        outCard.setOpacity(0);
        outCard.setScale(0.4);
        var spa = cc.spawn(cc.fadeIn(0.05), cc.scaleTo(0.05, 1));
        outCard.runAction(cc.sequence(cc.delayTime(actTime - 0.05), spa, cc.callFunc(function() {
            outCard.visible = true;
            outCard.setColor(cc.color(170, 170, 170));
        }.bind(this))));

        // 播放缩小动画到outcard的所在位置
        var scy = (outCard.height * outCard.scaleY) / node.height;
        var spa = cc.spawn(cc.scaleTo(actTime, scy), cc.fadeTo(actTime, 255 * 0.6), cc.moveTo(actTime, cc.p(anmEndPos)))
        var seq = cc.sequence(spa, cc.callFunc(function() {
            node.setOpacity(255);
            node.visible = false;
        }));

        node.stopAllActions();
        node.runAction(seq);
    }else{
        node.visible = false;
    }
}

playLayer_pengHu.prototype.initOutCard = function(node) {
    if (!this.isInPlay()) return;
    var off = this.getUIOffByNode(node);
    var pl = this.getUIPlayer(off);
    node.removeAllChildren();
    var putLen = pl.mjput.length;
    if (this.isCurPlayer(off) && pl.mjput.length > 0 && MjClient.data.sData.tData.currCard == pl.mjput[pl.mjput.length - 1]) {
        putLen -= 1;
    }
    for (var i = 0; i < putLen; i++) {
        var pos = this.getOutCardPos(off);
        var outCard = this.getNewCard("out", pl.mjput[i], off, false);
        outCard.setPosition(pos);
        outCard.visible = true;
        node.addChild(outCard);
        if(MjClient.majiang.isPengOrPaoCardByPutForOther(MjClient.data.sData, pl, pl.mjput[i], i)){
            outCard.setColor(cc.color(170, 170, 170));
        }
    }
};

playLayer_pengHu.prototype.alarm = function(type) {
    if (MjClient.rePlayVideo != -1) return; // 回放时候不能请求
    MjClient.gamenet.request("pkroom.handler.tableMsg", {
        cmd: "HZAlarm",
        type: type  // 0不报警  1 报警
    });
}

playLayer_pengHu.prototype.displayEatLabel = function(node, eatType, msg) {
    var off = this.getUIOffByNode(node);
    if (!this.isCurEatPlayer(msg, off)) {
        return;
    }
    var eatType = this.apartGangType(eatType, msg);
    var uiNode = this.getUINode(off);
    var layout_eatCards = uiNode.getChildByName("layout_eatDisplay");
    var labels = {
        mjchi: "img_chi",
        mjpeng: "img_peng",
        mjgang0: "img_pao",
        mjwei: "img_wei",
        mjgang1: "img_ti",
        mjgang2: "img_ti",
        hu: "img_hu"
    };
    var eatLabel = layout_eatCards.getChildByName(labels[eatType]);
    eatLabel.visible = true;

    var callback = function (){
        eatLabel.removeAllChildren();
        eatLabel.visible = false;
    };

    if(this.getEatLabel(eatType)){
        eatLabel.loadTexture(this.getEatLabel(eatType));
    }
    var pl = this.getUIPlayer(off);
    var num = pl.mjwei.length + pl.mjpeng.length + pl.mjgang0.length + pl.mjgang1.length;
    if (this.isAniParallel()) {
        if(eatType == "mjpeng" && (num == 3 || num == 4)){
            var aniName = "animation";
            var eTime = 1.5;
            eatLabel.removeAllChildren();
            eatLabel.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(callback)));
            var projNode = createSpine("spine/peng" + num +"/skeleton.json", "spine/peng" + num +"/skeleton.atlas");
            projNode.setAnimation(0, aniName, false);
            projNode.setPosition(50,50);
            projNode.setScale(0.5);
            projNode.setTimeScale(eTime);
            eatLabel.addChild(projNode,999999);
        }else{
            eatLabel.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(() => {
                eatLabel.visible = false;
            })));
        }
    } else {
        if (eatLabel.getUserData()) {
            eatLabel.scale = eatLabel.getUserData().scale;
        } else {
            eatLabel.setUserData({
                scale: eatLabel.scale
            });
        }

        var initScale = eatLabel.scale;
        if(eatType == "mjpeng" && (num == 3 || num == 4)){

        }else{
            eatLabel.runAction(cc.sequence(cc.scaleTo(0.3, initScale * 1.5), cc.delayTime(0.5), cc.scaleTo(0.3, initScale), cc.callFunc(() => {
                eatLabel.visible = false;
            })));
        }
    }
};

playLayer_pengHu.prototype.getShowEatNodes = function() {
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var eat = MjClient.playui.jsBind.node_eatChoice;
    var pl = sData.players[SelfUid() + ""];
    if (!pl || (pl.eatFlag & 16) || (pl.eatFlag & 8)) {
        return;
    }

    if (tData.tState == TableState.roundFinish) {
        return [];
    }

    var vnode = [];

    if (pl.eatFlag & 32) { // 胡
        vnode.push(eat.btn_hu._node);
    }

    if (pl.eatFlag & 1) { // 吃
        vnode.push(eat.btn_chi._node);
    }

    if (pl.eatFlag & 2) { // 碰
        vnode.push(eat.btn_peng._node);
    }

    if (vnode.length > 0 && !(pl.eatFlag & 32 && pl.alarmFlag == 1)) { // 过
        vnode.push(eat.btn_guo._node);
    }

    return vnode;
};

playLayer_pengHu.prototype.updateHandCardByPut = function(node) {
    var off = this.getUIOffByNode(node);
    if (!this.isCurPlayer(off)) {
        return;
    }

    if (off == 0) {
        this.removeTingSign();
    }

    // 牌局中别人出牌
    if (MjClient.rePlayVideo == -1 && off != 0) {
        return;
    }
    var pl = this.getUIPlayer(off);
    if (pl.canNotPutCard) {
        pl.canNotPutCard = [];
    }

    MjClient.hasPut = false; // todo
    // 牌局中自己手动出牌
    if (MjClient.rePlayVideo == -1 && off == 0 && !this.isInTrust(SelfUid())) {
        this.refreshHandCard(off);
        return;
    }

    // 移除手牌
    this.removeHandCard(MjClient.data.sData.tData.currCard, off);
    this.refreshHandCard(off);
};

playLayer_pengHu.prototype.checkSortBtnVisible = function(node) {
    node.visible = false;
};

playLayer_pengHu.prototype.checkAlarm = function(){
    //如果有碰 不弹提示 点碰时会弹
    var pl = MjClient.data.sData.players[SelfUid()];
    if(pl.eatFlag & 2){
        return;
    }

    if(pl && pl.alarmFlag == -1 && !this.isAlarming){
        this.isAlarming = true;
        var self = this;
        MjClient.showMsg("请选择是否报警？报警后只能碰胡， 点击 确定 报警", function() {
            HZAlarmToServer_yueYangPengHu(1);//报警
            self.isAlarming = false;
        }, function() {
            HZAlarmToServer_yueYangPengHu(0);
            self.isAlarming = false;
        }, "1");
    }
};

playLayer_pengHu.prototype.removeWeiFromHand = function(card, msg, off) {
    var count = 2;
    if(msg.isHandWei){
        count = 3;
    }
    for (var i = 0; i < count; i++) {
        this.removeHandCard(card, off);
    }
};

playLayer_pengHu.prototype.getMjhandDelay = function() {
     if(MjClient.data.sData.tData.areaSelectMode.isManualCutCard){
        delay = 2;
    }else{
        delay = 0;
    }
};