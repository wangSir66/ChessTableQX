var actionZindex = 1000;

// off 是四个位置，根据off 显示四个位置的信息 by sking
function SetUserVisible_sanDaEr(node, off) {
    var pl = getUIPlayer(off);
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var head = node.getChildByName("head");
    var name = head.getChildByName("name");
    var nobody = head.getChildByName("nobody");
    var coin = head.getChildByName("coin");
    var offline = head.getChildByName("offline");
    var name_bg = head.getChildByName("name_bg");
    var score_bg = head.getChildByName("score_bg");
    var zhuafen=head.getChildByName('zhuafen');
    if (pl) {
        name.visible = true;
        coin.visible = true;
        offline.visible = true;
        name_bg.visible = true;
        score_bg.visible = true;
        MjClient.loadWxHead(pl.info.uid, pl.info.headimgurl);
        setUserOffline(node, off);
        if(zhuafen)
        {
            if(tData.tState == TableState.waitReady || tData.tState == TableState.waitJoin)
            {
                zhuafen.visible=false;
            }
            else {
                if(tData.uids[tData.zhuang] != pl.info.uid && tData.uids[tData.zhuangFriend] != pl.info.uid)
                {
                    zhuafen.visible=true;
                }
            }
        }
        InitUserHandUI_sanDaEr(node, off);
    }
    else {
        name.visible = false;
        coin.visible = false;
        offline.visible = false;
        name_bg.visible = false;
        if (zhuafen) {
            zhuafen.visible = false;
        }
        var WxHead = nobody.getChildByName("WxHead");
        if (WxHead)
            WxHead.removeFromParent(true);
    }
}


function InitUserHandUI_sanDaEr(node, off) {
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var pl = getUIPlayer(off);

    if (!pl) {
        return;
    }

    //初始化玩家金币和名称
    InitUserCoinAndName(node, off);
    setAreaTypeInfo(true);
    if (off == 0)
        MjClient.playui.refreshScoreBanner();

    if (
        tData.tState != TableState.waitPut &&
        tData.tState != TableState.waitCard &&
        tData.tState != TableState.waitJiaoFen &&
        tData.tState != TableState.waitJiaoZhu &&
        tData.tState != TableState.waitMaiPai &&
        tData.tState != TableState.waitChooseCard
    ) {
        return;
    }

    //添加手牌
    if (MjClient.rePlayVideo == -1) // 表示正常游戏
    {
        if (pl.mjhand && off == 0) { //只初始化自己的手牌
            var vcard = [];
            for (var i = 0; i < pl.mjhand.length; i++) {

                var card = getNewCard_card(node, "stand", "mjhand", pl.mjhand[i], off);
                MjClient.playui.setCardSprite_ZhuTag(card);
                var index = vcard.indexOf(pl.mjhand[i]); //区分2张一样的牌
                if (index >= 0) {
                    card.setUserData(1);
                } else {
                    card.setUserData(0);
                }
                vcard.push(pl.mjhand[i]);
            }
        }
    } else {
        /*
         播放录像
         */
        if (pl.mjhand) {
            if (off == 0) {
                for (var i = 0; i < pl.mjhand.length; i++) {
                    var card = getNewCard_card(node, "stand", "mjhand", pl.mjhand[i], off);
                    MjClient.playui.setCardSprite_ZhuTag(card);
                }
            } else {
                for (var i = 0; i < pl.mjhand.length; i++) {
                    var card = getNewCard_card(node, "stand", "mjhand_replay", pl.mjhand[i], off);
                    MjClient.playui.setCardSprite_ZhuTag(card);
                }
            }
        }
    }
    MjClient.playui.CardLayoutRestore(node, off);

    if (off == 0) {
        // 底牌
        if (tData.zhuang != -1 && 0 == getOffByIndex(tData.zhuang) && tData.diPaiArr && tData.diPaiArr.length > 0)
        {
            MjClient.playui._btnDiPai.visible = true;
        }
        var uid = SelfUid();
        if(tData.hasTiQianOver == 0)
        {
            MjClient.playui.showWaitTip();
            if(tData.isAgreeOverList[uid] == -1){
                MjClient.playui.showTiQianOverDialog(tData.tiQianOverinfo);
            }
        }
        // 查牌/上一轮
        if (tData.putCardsRecord && tData.putCardsRecord.length > 0 && Object.keys(tData.putCardsRecord[0]).length == MjClient.MaxPlayerNum) {
            // if (tData.areaSelectMode.SAN_DA_HA_allowCheckCard)
            //     MjClient.playui._btnChaPai.setVisible(true);
            // else
                MjClient.playui._btnShangYiLun.setVisible(true);

            // if (0 != getOffByIndex(tData.zhuang)) {
            //     MjClient.playui._btnChaPai.x = MjClient.playui._btnChaPai.getParent().getContentSize().width / 2;
            //     MjClient.playui._btnShangYiLun.x = MjClient.playui._btnChaPai.x;
            // }
        }
    }
    cc.log('tData.tStatetData.tState:'+tData.tState)
    if (tData.tState == TableState.waitJiaoFen) {	// 叫分
        if (off == 0) {
            MjClient.playui.showJiaoFenPanel();
            MjClient.playui.showWaitTip();
        }
        MjClient.playui.showJiaoFenTag(off);
    } else if (tData.tState == TableState.waitJiaoZhu) {	// 叫主
        if (off == 0) {
            // MjClient.playui.addDiPaiToHand();
            MjClient.playui.showJiaoZhuPanel();
            MjClient.playui.showWaitTip();
        }
    } else if (tData.tState == TableState.waitMaiPai) {	// 埋牌
        if (off == 0) {
            MjClient.playui.showMaiPaiBtn();
            // MjClient.playui.addDiPaiToHand();
            MjClient.playui.showWaitTip();

            var zhuangPl = sData.players[tData.uids[tData.zhuang] + ""];
            if (zhuangPl.isAgreeTouXiang == 1)
                MjClient.playui.showTouXuangDialog();
        }
    }
    else if (tData.tState == TableState.waitChooseCard) {	// 找朋友
        if (off == 0) {
            MjClient.playui.showChooseFriendPanel();
            MjClient.playui.showWaitTip();

            var zhuangPl = sData.players[tData.uids[tData.zhuang] + ""];
            if (zhuangPl.isAgreeTouXiang == 1)
                MjClient.playui.showTouXuangDialog();
        }
    }
}

function cardsSort_sanDaEr(cards) {
    var pointCounts = {};
    var zhuPaiType = MjClient.data.sData.tData.zhuPaiType;
    for (var i = 0; i < cards.length; i++) {
        var p = MjClient.majiang.calPoint(cards[i], zhuPaiType);
        if (pointCounts[p])
            pointCounts[p]++;
        else
            pointCounts[p] = 1;
    }

    var commonCmp = function(a, b) {
        var c1 = pointCounts[MjClient.majiang.calPoint(a)];
        var c2 = pointCounts[MjClient.majiang.calPoint(b)];
        if (c1 == c2)
            return MjClient.majiang.cardValueCmp(a, b, zhuPaiType);
        else
            return c1 - c2;
    }

    cards.sort(function(a, b) {
        return -commonCmp(a, b);
    });
}


var PlayLayer_XinZhouSanDaEr = cc.Layer.extend({
    _btnPutCard: null,
    jsBind: {
        _event: {
            mjhand: function() {
                if (MjClient.endoneui != null) {
                    cc.log("=======mjhand====endoneui====" + typeof(MjClient.endoneui));
                    MjClient.endoneui.removeFromParent(true);
                    MjClient.endoneui = null;
                }

                var sData = MjClient.data.sData;
                var tData = sData.tData;
                if (tData.roundNum != tData.roundAll) return;
                var pls = sData.players;
                var ip2pl = {};
                for (var uid in pls) {
                    var pi = pls[uid];
                    var ip = pi.info.remoteIP;
                    if (ip) {
                        if (!ip2pl[ip]) ip2pl[ip] = [];
                        ip2pl[ip].push(unescape(pi.info.nickname ));
                    }
                }
                var ipmsg = [];
                for (var ip in ip2pl) {
                    var ips = ip2pl[ip];
                    if (ips.length > 1) {
                        ipmsg.push("玩家:" + ips.join("，") + "为同一IP地址。")
                    }
                }
                if (ipmsg.length > 0) {
                    if (cc.sys.OS_WINDOWS != cc.sys.os) {
                        //AlertSameIP(ipmsg.join("\n"));
                    }
                }
                mylog("ipmsg " + ipmsg.length);

            },
            LeaveGame: function() {
                MjClient.addHomeView();
                MjClient.playui.removeFromParent(true);
                delete MjClient.playui;
                delete MjClient.endoneui;
                delete MjClient.endallui;
                cc.audioEngine.stopAllEffects();
                playMusic("bgMain");
            },
            endRoom: function(msg) {
                mylog(JSON.stringify(msg));
                if (msg.showEnd) this.addChild(new GameOverLayer_doudizhu(), 500);
                else
                    MjClient.Scene.addChild(new StopRoomView());
            },
            roundEnd: function() {
                var self = this;

                function delayExe() {
                    var sData = MjClient.data.sData;
                    //resetEatActionAnim();
                    // if (sData.tData.roundNum <= 0) self.addChild(new GameOverLayer(), 500);
                    self.addChild(new EndOneView_sanDaEr(), 500);
                }
                this.runAction(cc.sequence(cc.DelayTime(1.2), cc.callFunc(delayExe)));
                if(MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP|| MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ) reConectHeadLayout_card(this);
            },
            moveHead: function() {
                postEvent("returnPlayerLayer");
                tableStartHeadMoveAction_card(this);
            },
            initSceneData: function() {
                reConectHeadLayout_card(this);
                CheckRoomUiDelete();
                var sData = MjClient.data.sData;
                var tData = sData.tData;
                if (tData.tState == TableState.waitPut) {
                    UpdataCurrentPutCard();
                }

                if(MjClient.data.sData.tData.tState <= TableState.waitReady)
                {
                    sendGPS();
                    MjClient.checkChangeLocationApp();
                }
            },
            onlinePlayer: function() {
                //reConectHeadLayout_card(this);
            },
            logout: function() {
                if (MjClient.playui) {
                    MjClient.addHomeView();
                    MjClient.playui.removeFromParent(true);
                    delete MjClient.playui;
                    delete MjClient.endoneui;
                    delete MjClient.endallui;
                }
            },
            DelRoom: function() {
                CheckRoomUiDelete();
            },
            changePKImgEvent: function() {
                changePKImg(this, getCurrentPKImgType());
            }
        },
        back: {
            back: {
                _run: function() {
                    changeGameBg(this);
                },
                _event: {
                    changeGameBgEvent: function() {
                        changeGameBg(this);
                    }
                },
                _layout: [
                    [1, 1],
                    [0.5, 0.5],
                    [0, 0], true
                ],
            },

        },
        image_di:{
            _layout: [
                [1, 0],
                [0.5, 0],
                [0, 0]
            ],
            BtnShangYiLun: {
                _visible: false,
                _run: function() {
                    this.srcX = this.x;
                },
                _click: function() {
                    MjClient.playui.showShangYiLunPanel(MjClient.playui.shangYiLunPanel);
                    MjClient.playui.jsBind.panel.touchLayer._node.setTouchEnabled(true);
                },
                _event: {
                    roundEnd: function(){
                        this.visible = false;
                    },
                    waitReady: function(){
                        this.visible = false;
                    }
                }
            },
            BtnDiPai: {
                _visible: false,
                _click: function() {
                    MjClient.playui.showDiPaiPanel(MjClient.playui.diPaiPanel);
                    MjClient.playui.jsBind.panel.touchLayer._node.setTouchEnabled(true);
                },
                _event: {
                    s2c_sdhMaiPai: function(msg) {
                        var tData = MjClient.data.sData.tData;
                        if (0 == getOffByIndex(tData.curPlayer) && tData.maiPaiArr && tData.maiPaiArr.length > 0)
                            this.visible = true;
                    },
                    roundEnd: function(){
                        this.visible = false;
                    },
                    waitReady: function(){
                        this.visible = false;
                    }
                }
            },
            num_zhuafen: {

                _run: function() {
                    this.setString("");
                    this.ignoreContentAdaptWithSize(true);
                    MjClient.playui.num_zhuafen= this;
                },
                _event: {
                    mjhand: function(){
                        MjClient.playui.showUserZhuaFen_sanDaEr(this, 0);
                    },
                    initSceneData: function() {
                        var tData = MjClient.data.sData.tData;
                        if(tData.tState == TableState.waitReady){
                            this.setString("");
                        }else{
                            MjClient.playui.showUserZhuaFen_sanDaEr(this, 0);
                        }
                    },
                    waitPut:function () {
                        MjClient.playui.showUserZhuaFen_sanDaEr(this, 0);
                    },
                    clearCardUI:function() {
                        this.setString("");
                    },
                    onlinePlayer: function(msg) {
                        if(msg.uid == SelfUid()){
                            this.setString("");
                        }
                    },
                    waitReady: function(){
                        this.setString("");
                    },
                    roundEnd:function () {
                        MjClient.playui.showUserZhuaFen_sanDaEr(this, 0);
                    }
                }
            },
            score:{
                _visible: true,
                _run: function()
                {
                    var tData = MjClient.data.sData.tData;
                    var coin = tData.initCoin;
                    //this.setString("" + coin);
                    var pl = getUIPlayer(0);
                    this.setString(0);
                    this.ignoreContentAdaptWithSize(true);
                },
                _event: {
                    mjhand: function(eD) {
                        var tData = MjClient.data.sData.tData;
                        var pl = getUIPlayer(0);
                        var coin = tData.initCoin;
                        this.setString(coin + pl.winall);
                    },
                    roundEnd: function() {
                        var tData = MjClient.data.sData.tData;
                        var pl = getUIPlayer(0);
                        var coin = tData.initCoin;
                        this.setString(coin + pl.winall);
                    },
                    initSceneData:function () {
                        var tData = MjClient.data.sData.tData;
                        var pl = getUIPlayer(0);
                        var coin = tData.initCoin;
                        this.setString(coin + pl.winall);
                    }
                }},
            gps_btn: {
                _click: function() {
                    if (MjClient.MaxPlayerNum == 5) {
                        MjClient.Scene.addChild(new showDistance3PlayerLayer(5));
                    } else if (MjClient.MaxPlayerNum == 4) {
                        MjClient.Scene.addChild(new showDistanceLayer());
                    }
                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Dingwei", {uid: SelfUid(),gameType:MjClient.gameType});
                }
            },
            text_juNum: {
                _run: function() {
                    var tData = MjClient.data.sData.tData;
                    var str = (tData.roundAll - tData.roundNum + 1) + "/" + tData.roundAll + "局";
                    this.setString(str);
                    this.ignoreContentAdaptWithSize(true);
                },
                _event: {
                    mjhand: function() {
                        var tData = MjClient.data.sData.tData;
                        var str = (tData.roundAll - tData.roundNum + 1) + "/" + tData.roundAll + "局";
                        this.setString(str);
                    },
                }
            },
            text_time: {
                _run: function() {
                    this.ignoreContentAdaptWithSize(true);
                    this.schedule(function() {
                        var time = MjClient.getCurrentTime();
                        var str = (time[3] < 10 ? "0" + time[3] : time[3]) + ":" +
                            (time[4] < 10 ? "0" + time[4] : time[4]);
                        this.setString(str);
                    });
                }
            },
            tableid: {
                _run: function() {
                    this.ignoreContentAdaptWithSize(true);
                },
                _event: {
                    initSceneData: function() {
                        this.ignoreContentAdaptWithSize(true);
                        this.setString("房号:"+ MjClient.data.sData.tData.tableid);
                    }
                }
            }
        },
        gameName: {
            _layout: [
                [0.18, 0.18],
                [0.5, 0.58],
                [0, 0]
            ]
        },
        roundInfo: {
            _layout: [
                [0.12, 0.12],
                [0.5, 0.5],
                [0, 0]
            ],
            _run: function() {
                this.ignoreContentAdaptWithSize(true);
                this.setString(MjClient.playui.getGameInfoString("roundInfo"));
            },
        },
        banner: {
            _layout: [
                [0.338, 0.1],
                [0.935, 0.88],
                [0, 0]
            ],
            text_time: {
                _run: function() {
                    this.ignoreContentAdaptWithSize(true);
                    this.schedule(function() {
                        var time = MjClient.getCurrentTime();
                        var str = (time[3] < 10 ? "0" + time[3] : time[3]) + ":" +
                            (time[4] < 10 ? "0" + time[4] : time[4]);
                        this.setString(str);
                    });
                }
            },
            wifi: {
                _run: function() {
                    MjClient.playui.updateWifiState(this);
                }
            },
            powerBar: {
                _run: function() {
                    updateBattery(this);
                },
                _event: {
                    nativePower: function(d) {
                        this.setPercent(Number(d));
                    }
                }
            },

        },
        banner2: {
            _run: function() {
                this.zIndex += 1;
            },
            _layout: [
                [0.0938, 0.0972],
                [0.905, 0.9823],
                [0, 0]
            ],
            setting: {
                _click: function() {
                    var settringLayer = new SettingView();
                    settringLayer.setName("PlayLayerClick");
                    MjClient.Scene.addChild(settringLayer);
                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Shezhi", {uid:SelfUid(),gameType:MjClient.gameType});
                }
            },
            back_btn: {
                _click: function() {
                    var sData = MjClient.data.sData;
                    if (sData) {
                        if(sData.tData.tState != TableState.waitJoin && sData.tData.tState != TableState.waitReady) {
                            MjClient.showMsg("游戏中不能退出");
                            return;
                        }

                        if (IsRoomCreator()) {
                            MjClient.showMsg("确定要退出房间吗？",
                                function() {
                                    var canotLeave = sData.tData.tState != TableState.waitJoin && sData.tData.tState != TableState.waitReady;
                                    if(!canotLeave) MjClient.leaveGame();
                                },
                                function() {});
                        } else {
                            MjClient.showMsg("确定要退出房间吗？",
                                function() {
                                    var canotLeave = sData.tData.tState != TableState.waitJoin && sData.tData.tState != TableState.waitReady;
                                    if(!canotLeave) MjClient.leaveGame();
                                },
                                function() {});
                        }
                    }
                    // MjClient.showMsg("是否解散房间？", function() {
                    //     MjClient.delRoom(true);
                    // }, function() {}, 1);
                }
            },
        },
        scoreBanner: {
            _layout: [
                [0.312, 0.128],
                [0, 0.9],
                [-0.05, -0.25]
            ],
            _run:function(){
                MjClient.playui.scoreBanner = this;
            },
            image_zhu: {
                _event:{
                    mjhand:function()
                    {
                        this.visible = false;
                    }
                }
            },
            friend_card:{
                _visible: false,
                _event: {
                    s2c_sdhChooseCard:function () {
                        this.visible=true;
                        var tData = MjClient.data.sData.tData;
                        var size = cc.director.getWinSize();
                        var startPoint = this.getParent().convertToNodeSpace(cc.p(size.width/2,size.height/2))
                        var finalPoint = this.getPosition();
                        this.scale = 1;
                        this.setPosition(startPoint);
                        setCardSprite_card(this,tData.friendCard,true);
                        this.stopAllActions();
                        this.runAction(cc.sequence(cc.DelayTime(0.5),cc.spawn(cc.scaleTo(1,0.5),cc.moveTo(1,finalPoint)).easing(cc.easeQuinticActionOut())));
                    },
                    mjhand:function() {
                        this.visible = false;
                    },
                    waitReady:function(){
                        this.visible = false;
                    },
                    clearCardUI: function() {
                        this.visible = false;
                    },
                    initSceneData:function ()
                    {
                        var tData = MjClient.data.sData.tData;
                        if(tData.friendCard && tData.friendCard != -1)
                        {
                            this.visible=true;
                            this.scale = 0.5;
                            setCardSprite_card(this,tData.friendCard,true);
                        }
                        else {
                            this.visible=false;
                        }
                        if(MjClient.data.sData.tData.tState == TableState.isReady || MjClient.data.sData.tData.tState == TableState.roundFinish)
                        {
                            this.visible = false;
                        }
                    }
                }
            },
            text_jiaofen: {
            },
            jiaofenNum: {
                _run: function() {
                    this.ignoreContentAdaptWithSize(true);
                }
            },
            text_score: {
            },
            scoreNum: {
                _visible: false,
                _run: function() {
                    this.ignoreContentAdaptWithSize(true);
                },
                _event: {
                    roundEnd:function () {
                        var tData = MjClient.data.sData.tData;
                        var score = tData.totalScore;
                        this.setString(''+ score)
                    },
                    mjhand:function(){
                        var tData = MjClient.data.sData.tData;
                        var score = tData.totalScore;
                        this.setString(''+ score)
                    },
                    waitReady:function () {
                        this.setString("0");
                    }
                }
            },
            scoreCard: {
                _visible: false,
                _event: {
                    roundEnd:function () {
                        var tData = MjClient.data.sData.tData;
                        MjClient.playui.showScoreCards(MjClient.playui.scoreBanner, tData.fenPaiArr);
                    }
                }
            },
            yufenNum:{
                _visible: false,
                _run: function() {
                    this.ignoreContentAdaptWithSize(true);
                },
                _event:{
                    roundEnd:function()
                    {
                        var tData =MjClient.data.sData.tData;
                        if(tData.remainScore >= 0)
                        {
                            this.setString(tData.remainScore +"");
                        }
                    }
                }
            },
            _event: {
                s2c_sdhWaitJiaoZhu: function(d) {
                    MjClient.playui.refreshScoreBanner();
                },
                s2c_sdhJiaoZhu: function(d) {
                    MjClient.playui.refreshScoreBanner(true);
                    MjClient.playui.zhuPaifly(MjClient.playui.jsBind.scoreBanner.image_zhu._node);
                },
                s2c_sdhZhuaFen: function(d) {
                    MjClient.playui.refreshScoreBanner();
                },
                s2c_sdhMaiPai: function(d) {
                    MjClient.playui.refreshScoreBanner();
                },
                waitPut: function(d) {
                    MjClient.playui.refreshScoreBanner();
                },
                roundEnd: function() {
                    var tData = MjClient.data.sData.tData;
                    if (MjClient.playui.winType != tData.winType) {
                        MjClient.playui.winType = tData.winType;
                        MjClient.playui.playWinAni(tData.winType);
                    }
                },
                initSceneData: function() {
                    var tData = MjClient.data.sData.tData;
                }
            }
        },
        clock: {
            _layout: [
                [0.073, 0.18],
                [0.5, 0.6],
                [0, 0]
            ],
            _run: function() {
                MjClient.clockNode = this;
                this.visible = false;
                this.srcPosition = this.getPosition();
            },
            number: {
                _run:function () {
                    this.ignoreContentAdaptWithSize(true);
                },
                _event: {
                    initSceneData: function() {
                        if (MjClient.data.sData.tData.tState == TableState.waitPut || MjClient.data.sData.tData.tState >= TableState.waitJiaoFen) {
                            MjClient.clockNode.visible = true;
                            this.setString("00");
                            MjClient.playui.updateClockPosition(MjClient.clockNode);
                        }
                    },
                    waitPut: function() {
                        this.stopAllActions();
                        stopEffect(playTimeUpEff);
                        var tData = MjClient.data.sData.tData;
                        var records = tData.putCardsRecord;
                        var keysLen = records.length > 0 ? Object.keys(records[records.length - 1]).length : 0;
                        if (keysLen == MjClient.MaxPlayerNum) {
                            MjClient.clockNode.visible = false;
                            var action = cc.sequence(cc.delayTime(1), cc.callFunc(function() {
                                MjClient.clockNode.visible = true;
                                MjClient.playui.clockNumberUpdate(this);
                                MjClient.playui.updateClockPosition(MjClient.clockNode);
                            }, this));
                            action.setTag(1);
                            this.runAction(action);
                        } else {
                            MjClient.clockNode.visible = true;
                            this.stopActionByTag(1);
                            MjClient.playui.clockNumberUpdate(this);
                            MjClient.playui.updateClockPosition(MjClient.clockNode);
                        }
                    },
                    PKPut: function(msg) {
                        if (msg.uid == SelfUid()) {
                            this.stopAllActions();
                            stopEffect(playTimeUpEff);
                            playTimeUpEff = null;
                            //MjClient.playui.clockNumberUpdate(this);
                            this.setString("00");
                        }
                    },
                    roundEnd: function() {
                        this.stopAllActions()
                        stopEffect(playTimeUpEff);
                        playTimeUpEff = null;

                        var pl = getUIPlayer(0);
                        if (pl.winone > 0) {
                            playEffectInPlay("win");
                            playEffectInPlay("win_1");
                        } else if (pl.winone < 0)
                            playEffectInPlay("lose");
                        else
                            playEffectInPlay("liuju");
                    },
                    onlinePlayer: function() {
                        MjClient.clockNode.visible = MjClient.data.sData.tData.tState == TableState.waitPut || MjClient.data.sData.tData.tState >= TableState.waitJiaoFen;
                    },
                    LeaveGame: function() {
                        this.stopAllActions();
                        stopEffect(playTimeUpEff);
                        playTimeUpEff = null;
                    },
                    s2c_sdhJiaoFen: function(d) {
                        this.stopAllActions();
                        stopEffect(playTimeUpEff);
                        var tData = MjClient.data.sData.tData;
                        MjClient.clockNode.visible = false;
                        var action = cc.sequence(cc.delayTime(0.2), cc.callFunc(function() {
                            MjClient.clockNode.visible = true;
                            MjClient.playui.clockNumberUpdate(this);
                            MjClient.playui.updateClockPosition(MjClient.clockNode);
                        }, this));
                        action.setTag(1);
                        this.runAction(action);
                    },
                    s2c_sdhJiaoZhu: function(d) {
                        this.stopAllActions();
                        stopEffect(playTimeUpEff);
                        var tData = MjClient.data.sData.tData;
                        MjClient.clockNode.visible = false;
                        var action = cc.sequence(cc.delayTime(0.2), cc.callFunc(function() {
                            MjClient.clockNode.visible = true;
                            MjClient.playui.clockNumberUpdate(this);
                            MjClient.playui.updateClockPosition(MjClient.clockNode);
                        }, this));
                        action.setTag(1);
                        this.runAction(action);
                    },
                    s2c_sdhWaitChooseCard: function(d) {
                        this.stopAllActions();
                        stopEffect(playTimeUpEff);
                        var tData = MjClient.data.sData.tData;
                        MjClient.clockNode.visible = false;
                        var action = cc.sequence(cc.delayTime(0.2), cc.callFunc(function() {
                            MjClient.clockNode.visible = true;
                            MjClient.playui.clockNumberUpdate(this);
                            MjClient.playui.updateClockPosition(MjClient.clockNode);
                        }, this));
                        action.setTag(1);
                        this.runAction(action);
                    },
                    mjhand: function(){
                        MjClient.clockNode.visible = false;
                    },
                    waitReady: function(){
                        MjClient.clockNode.visible = false;
                    },
                    moveHead: function(){
                        MjClient.clockNode.visible = false;
                    },
                }
            },
        },
        zhuafen:{
            _layout: [
                [0.4, 0.4],
                [0.5, 0.7],
                [0, 0]
            ],
            _run: function() {
                MjClient.playui.zhuafen = this;
                this.visible=false;
            },
            roundScore:{
                _run: function() {
                    MjClient.playui.roundScore = this;
                    this.ignoreContentAdaptWithSize(true);
                    // cc.log('**************************2222')
                    this.setString("0分")
                    this.visible=false;
                },
                _event: {
                    clearCardUI: function() {
                        this.setString("0分")
                    },
                    s2c_dqZhuaFen:function(msg) {
                        this.visible = true;
                        var off=msg.collectScoreIdx;
                        MjClient.playui.moveFen(MjClient.playui.zhuafen,off);
                        this.setString('0分')
                    },
                    waitPut:function () {
                        this.visible=true;
                        // this.setString('0分')
                    },
                    PKPut: function(msg) {
                        this.visible = true;
                        this.setString(msg.roundScore+"分")
                    },
                    mjhand: function(){
                        this.visible = false;
                    },
                    waitReady: function(){
                        this.visible = false;
                    },
                    moveHead: function(){
                        this.visible = false;
                    },
                    initSceneData: function() {
                        var tData = MjClient.data.sData.tData;
                        if(TableState.waitPut == tData.tState){
                            this.visible = true;
                            if(tData.roundScore)
                            {
                                this.setString(tData.roundScore+"分")
                            }
                            else
                            {
                                this.setString("0")
                            }
                        }
                        else
                        {
                            this.visible = false;
                        }
                    },
                }
            },
            _event: {
                clearCardUI: function() {
                    this.visible=false;
                },
                waitReady: function(){
                    this.visible = false;
                },
                waitPut:function () {
                    this.visible=true;
                },
                moveHead: function(){
                    this.visible = false;
                },
                initSceneData: function() {
                    var tData = MjClient.data.sData.tData;
                    if(TableState.waitPut == tData.tState){
                        this.visible = true;
                    }
                    else
                    {
                        this.visible = false;
                    }
                },
            }
        },
        wait: {
            _run: function() {
                this.visible = true;
            },
            getRoomNum: {
                _run: function() {
                    setWgtLayout(this, [0.18, 0.18], [0.4, 0.39], [0, 0]);
                },
                _visible: function() {
                    return !MjClient.remoteCfg.guestLogin;
                },
                _click: function() {
                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Fuzhifangjianxinxi", {uid:SelfUid(), gameType:MjClient.gameType});

                    /*
                     复制房间号-----------------------
                     */
                    var tData = MjClient.data.sData.tData;
                    var str1 = "忻州三打二,"
                    var str2 = MjClient.playui.getGameInfoString("getRoomNum") + ",";
                    var str3 = MjClient.MaxPlayerNum == 4 ? tData.roundNum + "局,三缺一," : tData.roundNum + "局,二缺一,";
                    var str4 = "速度加入【" + AppCnName[MjClient.getAppType()] + "】\n" + "(复制此消息打开游戏可直接进入该房间)";
                    GLog(str1 + str2 + str3 + str4);
                    MjClient.native.doCopyToPasteBoard("房间号:[" + tData.tableid + "]\n" + str1 + str2 + str3 + str4);
                    MjClient.showMsg("已复制房间号，请不要返回大厅。打开微信后粘贴房间信息。", function() {
                        MjClient.native.openWeixin();
                    }, function() {});
                }
            },
            wxinvite: {
                _layout: [
                    [0.18, 0.18],
                    [0.75, isIPhoneX()?0.33:0.29],
                    [0, 0]
                ],
                _click: function() {
                    getPlayingRoomInfo(2);
                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Yaoqingweixinhaoyou", {uid:SelfUid(), gameType:MjClient.gameType});

                },
                _visible: function() {
                    return !MjClient.remoteCfg.guestLogin;
                }
            },
            delroom: {
                _run: function() {
                    this.visible = IsRoomCreator();
                    setWgtLayout(this, [0.11, 0.11], [0.05, 0.45], [0, 0]);
                },
                _click: function() {
                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Jiesanfangjian", {uid:SelfUid(), gameType:MjClient.gameType});

                    MjClient.delRoom(true);
                },
                _event: {
                    waitReady: function() {
                        // this.visible = true;
                    }
                }
            },
            backHomebtn: {
                _run: function() {
                    this.visible = true;
                    setWgtLayout(this, [0.11, 0.11], [0.05, 0.6], [0, 0]);
                },
                _click: function(btn) {
                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Likaifangjian", {uid:SelfUid(), gameType:MjClient.gameType});

                    var sData = MjClient.data.sData;
                    if (sData) {
                        if (IsRoomCreator()) {
                            MjClient.showMsg("返回大厅房间仍然保留\n赶快去邀请好友吧",
                                function() {
                                    MjClient.leaveGame();
                                },
                                function() {});
                        } else {
                            MjClient.showMsg("确定要退出房间吗？",
                                function() {
                                    MjClient.leaveGame();
                                },
                                function() {});
                        }
                    }

                },
                _event: {
                    waitReady: function() {
                        // this.visible = true;
                    }
                }
            },
            _event: {
                onlinePlayer: function() {
                    if( IsAllPlayerReadyState() ) {
                        this.getChildByName('delroom').visible = false;
                        this.getChildByName('backHomebtn').visible = false;
                    }
                },
                initSceneData: function(eD) {
                    var isWaitReady = eD.tData.tState == TableState.waitReady;
                    this.getChildByName('getRoomNum').visible = false;//IsInviteVisible();
                    this.getChildByName('wxinvite').visible = IsInviteVisible() && !MjClient.remoteCfg.guestLogin;
                    // this.getChildByName('delroom').visible = IsInviteVisible() || isWaitReady;
                    // this.getChildByName('backHomebtn').visible = IsInviteVisible() || isWaitReady;
                },
                addPlayer: function(eD) {
                    var isWaitReady = eD.tData.tState == TableState.waitReady;
                    console.log(">>>>>> play add player >>>>");
                    this.getChildByName('getRoomNum').visible = false;//IsInviteVisible();
                    this.getChildByName('wxinvite').visible = IsInviteVisible() && !MjClient.remoteCfg.guestLogin;
                    // this.getChildByName('delroom').visible = IsInviteVisible() || isWaitReady;
                    // this.getChildByName('backHomebtn').visible = IsInviteVisible() || isWaitReady;
                },
                removePlayer: function(eD) {
                    var isWaitReady = eD.tData.tState == TableState.waitReady;
                    this.getChildByName('getRoomNum').visible = false;
                    this.getChildByName('wxinvite').visible = !MjClient.remoteCfg.guestLogin;
                    // this.getChildByName('delroom').visible = IsInviteVisible() || isWaitReady;
                    // this.getChildByName('backHomebtn').visible = IsInviteVisible() || isWaitReady;
                }
            }
        },
        BtnPutCard: {
            _run: function() {
                this.visible = false;
                setWgtLayout(this, [0.135, 0.128], [0.5, 0.43], [0, 0.5]);
                this.srcX = this.x;
            },
            _click: function(btn) {
                //cc.log("BtnPutCard");
                if(!IsTurnToMe()) { return; } // 防止过快点击造成多次出牌
                if(MjClient.selectCards_card.length != 1) {
                    return;
                }
                cardsSort_sanDaEr(MjClient.selectCards_card);
                PutOutCard_card(); //可以出牌
                // MjClient.playui.recoverCannotOutCard();
                MjClient.playui.jsBind.BtnHimt._node.visible = false;
                MjClient.playui.jsBind.clock._node.visible = false;
                btn.visible = false;
            },
            _event: {
                //拿到一张牌的时候，出牌按钮亮起，其他状态隐藏，by sking
                mjhand: function() {
                },
                PKPut: function(eD) {
                    //cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>PKPut by sking");
                    this.visible = false;
                    // MjClient.playui.jsBind.BtnShuaiPai._node.visible = false;
                    MjClient.playui.jsBind.BtnHimt._node.visible = false;
                    MjClient.playui.recoverCannotOutCard();

                    var cardType = MjClient.majiang.cardsType(eD.card, MjClient.data.sData.tData.zhuPaiType);
                    if (cardType == MjClient.majiang.CARDTPYE.liandui)
                        MjClient.playui.playCardAni_liandui();

                    var tData = MjClient.data.sData.tData;
                    var records = tData.putCardsRecord;
                    var keysLen = records.length > 0 ? Object.keys(records[records.length - 1]).length : 0;
                    if (keysLen == 1) {
                        this.stopActionByTag(1);
                        MjClient.playui.clearDesk();
                    }
                },
                waitPut: function() {
                    var that = this;
                    var waitPutFunc = function()
                    {
                        var tData = MjClient.data.sData.tData;
                        if (IsTurnToMe() && tData.tState == TableState.waitPut) {
                            that.visible = true;
                            UpdataCurrentPutCard();

                            if (MjClient.majiang.getRoundFirstCards(tData.putCardsRecord, tData.firstPutCardUid, tData.maxPlayer))
                                MjClient.playui.jsBind.BtnHimt._node.visible = true;

                            // if (tData.isCanShuaiPai && tData.firstPutCardUid == SelfUid())
                                // MjClient.playui.jsBind.BtnShuaiPai._node.visible = true;

                            MjClient.playui.updateOperateBtnPosition();
                        }
                    }

                    var tData = MjClient.data.sData.tData;
                    var records = tData.putCardsRecord;
                    var keysLen = records.length > 0 ? Object.keys(records[records.length - 1]).length : 0;
                    if (keysLen == MjClient.MaxPlayerNum) {
                        var action = cc.sequence(cc.delayTime(1), cc.callFunc(function() {
                            waitPutFunc();
                            MjClient.playui.clearDesk();
                        }));
                        action.setTag(1);
                        this.runAction(action);
                    }

                    if (keysLen != MjClient.MaxPlayerNum)
                    {
                        waitPutFunc();
                    }
                },
                initSceneData: function() {
                    var tData = MjClient.data.sData.tData;
                    if (!IsTurnToMe() || tData.tState != TableState.waitPut) {
                        this.visible = false;
                        // MjClient.playui.jsBind.BtnShuaiPai._node.visible = false;
                        MjClient.playui.jsBind.BtnHimt._node.visible = false;
                    } else {
                        this.visible = true;

                        if (MjClient.majiang.getRoundFirstCards(tData.putCardsRecord, tData.firstPutCardUid, tData.maxPlayer))
                            MjClient.playui.jsBind.BtnHimt._node.visible = true;

                        // if (tData.isCanShuaiPai && tData.firstPutCardUid == SelfUid())
                        //     MjClient.playui.jsBind.BtnShuaiPai._node.visible = true;

                        MjClient.playui.updateOperateBtnPosition();
                    }
                },
                PostCardsEnded: function()
                {
                    var tData = MjClient.data.sData.tData;
                    if(IsTurnToMe() && tData.tState == TableState.waitPut && !MjClient.playui.isFaPai)
                    {
                        this.visible = true;
                    }
                }
            }
        },
        BtnHimt: {
            _run: function() {
                this.visible = false;
                setWgtLayout(this, [0.135, 0.128], [0.5, 0.43], [-0.8, 0.42]);
            },
            _click: function(btn) {
                putOutCardTips();
                playEffect("guandan/tishi");
            },
            _event:{
                //拿到一张牌的时候，出牌按钮亮起，其他状态隐藏，by sking
                mjhand: function() {
                    var tData = MjClient.data.sData.tData;
                    if(!IsTurnToMe() || tData.tState != TableState.waitPut)
                    {
                        this.visible = false;
                    }
                    else
                    {
                        this.visible = true;
                    }
                },
                newCard: function(eD)
                {
                    //cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>newCard by sking");
                    this.visible = true;
                    //setWgtLayout(this, [0.1, 0.1],[0.7, 0.2],[0, 0]);
                },
                PKPut: function(eD) {
                    //cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>PKPut by sking");
                    this.visible = false;
                },
                initSceneData: function()
                {
                    // var tData = MjClient.data.sData.tData;
                    // if(!IsTurnToMe() || tData.tState != TableState.waitPut || MjClient.playui.isFaPai)
                    // {
                    //     this.visible = false;
                    // }
                    // else
                    // {
                    //     this.visible = true;
                    // }
                },
                PostCardsEnded: function()
                {
                    var tData = MjClient.data.sData.tData;
                    if(IsTurnToMe() && tData.tState == TableState.waitPut && !MjClient.playui.isFaPai)
                    {
                        this.visible = true;
                    }
                }
            }
        },
        // BtnShuaiPai: {
        //     _run: function() {
        //         this.visible = false;
        //         setWgtLayout(this, [0.135, 0.128], [0.5, 0.40], [-0.8, 0.5]);
        //     },
        //     _click: function(btn) {
        //         var pl = getUIPlayer(0);
        //         cardsSort_sanDaEr(MjClient.selectCards_card);
        //         PutOutCard_card();
        //         this.visible = false;
        //     },
        // },
        BtnReady: {
            _visible: false,
            _run: function() {
                setWgtLayout(this, [0.18, 0.18], [0.5, 0.42], [0, 0]);
            },
            _click: function(_this) {
                PKPassConfirmToServer_card();
                MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Zhunbei", {uid: SelfUid(), gameType:MjClient.gameType});
            },
            _event: {
                waitReady: function() {
                    cc.log('wwwwwwwwwwwwwwwwwwwwww')
                    this.visible = true;
                },
                mjhand: function() {
                    this.visible = false;
                },
                initSceneData: function() {
                    this.visible = false;
                    var tData = MjClient.data.sData.tData;
                    var pl = getUIPlayer(0);
                    this.visible = tData.roundNum == tData.roundAll && tData.tState == TableState.waitReady && pl.mjState == TableState.waitReady && !IsInviteVisible();
                },
                PKPass: function() {
                    this.visible = false;
                },
                removePlayer: function() {
                    this.visible = false;
                },
                onlinePlayer: function(msg) {
                    if (msg.uid == SelfUid()) {
                        this.visible = false;
                    }
                },
            }
        },
        noPutTips: { //add by  sking for put card button
            _run: function() {
                this.visible = false;
                setWgtLayout(this, [0.39, 0], [0.5, 0.45], [0, 0]);
            },
            _event: {
                clearCardUI: function() {
                    this.visible = false;
                },
                mjhand: function() {
                    this.visible = false;
                },
            }
        }, //end of add by sking
        down: {
            head: {
                zhuang: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        clearCardUI: function() {
                            this.visible = false;
                        },
                        waitPut: function() {
                            MjClient.playui.showUserZhuangLogo(this, 0 ,false);
                        },
                        s2c_sdhWaitJiaoZhu: function() {
                            MjClient.playui.showUserZhuangLogo(this, 0 ,true);
                        },
                        initSceneData: function() {
                            MjClient.playui.showUserZhuangLogo(this, 0 ,false);
                            if(MjClient.data.sData.tData.tState == TableState.isReady || MjClient.data.sData.tData.tState == TableState.roundFinish)
                            {
                                this.visible = false;
                            }
                        },
                        roundEnd:function(){
                            MjClient.playui.showUserZhuangLogo(this, 0 ,false);
                        }
                    }
                },
                chatbg: {
                    _run: function() {
                        this.getParent().zIndex = 600;
                    },
                    chattext: {
                        _event: {

                            MJChat: function(msg) {

                                showUserChat(this, 0, msg);
                            },
                            playVoice: function(voicePath) {
                                MjClient.data._tempMessage.msg = voicePath;
                                showUserChat(this, 0, MjClient.data._tempMessage);
                            }
                        }
                    }
                },
                _click: function(btn) {
                    showPlayerInfo(0, btn);
                },
                _event: {
                    loadWxHead: function(d) {
                        setWxHead(this, d, 0);
                    },
                    addPlayer: function(eD) {
                        showFangzhuTagIcon(this, 0);
                    },
                    removePlayer: function(eD) {
                        showFangzhuTagIcon(this, 0);
                    }

                },
                _run: function() {
                    //this.zIndex = 600;
                    showFangzhuTagIcon(this, 0);
                },
                score_bg: {
                    _visible: false
                },
                coin:{
                    _event:{
                        moveHead:function(){
                            this.visible = false;
                    }}
                },
                name_bg: {
                    _visible: false
                },
            },
            play_tips: {
                _layout: [
                    [0.08, 0.14],
                    [0.5, 0.25],
                    [0, 0.5]
                ],
                _run: function() {
                    this.zIndex = actionZindex;
                },
                _visible: false,
            },
            ready: {
                _layout: [
                    [0.084, 0.094],
                    [0.5, 0.5],
                    [0, -1.4]
                ],
                _run: function() {
                    GetReadyVisible(this, 0);
                    //this.visible = true;
                },
                _event: {
                    moveHead: function() {
                        GetReadyVisible(this, -1);
                    },
                    addPlayer: function() {
                        GetReadyVisible(this, 0); //根据状态设置ready 是否可见 add by sking
                    },
                    removePlayer: function() {
                        GetReadyVisible(this, 0);
                    },
                    onlinePlayer: function() {

                        cc.log("============online player=======1063======");
                        GetReadyVisible(this, 0);
                    }
                }
            },
            stand: {
                _visible: false,
                _run: function() {
                    if (MjClient.rePlayVideo == -1)
                        setWgtLayout(this, [0.090, 0], [0.5, 0.1], [0, 0.62]);
                    else
                        setWgtLayout(this, [0.052, 0], [0.5, 0.1], [0, 0.55]);
                    this.zIndex = 600;
                },
            },
            deskCard: {
                // _layout: [
                //     [0.1, 0.15],
                //     [0.6, 0],
                //     [-1.8, 2]
                // ],
                _run: function() {
                    if (MjClient.rePlayVideo == -1)
                        setWgtLayout(this, [0.047, 0], [0.5, 0.16], [0, 2.7]);
                    else
                        setWgtLayout(this, [0.052, 0], [0.5, 0.14], [0, 1.7]);
                },
                _visible: false
            },
            jiaoFenTag: {
                _run: function() {
                    this.setScale(MjClient.size.width / 1280);
                    this.setPosition(MjClient.playui.jsBind.down.deskCard._node.getPosition().x,
                        MjClient.playui.jsBind.down.deskCard._node.getPosition().y);
                },
                _visible: false,
                _event: {
                    s2c_sdhJiaoFen: function(d) {
                        MjClient.playui.showJiaoFenTag(0);
                    },
                    mjhand:function () {
                        this.visible =false;
                    }
                }
            },
            _event: {
                clearCardUI: function() {
                    clearCardUI_card(this, 0);
                },
                initSceneData: function(eD) {
                    SetUserVisible_sanDaEr(this, 0);
                    MjClient.playui.reConnectShowDeskCard();
                },
                addPlayer: function(eD) {
                    SetUserVisible_sanDaEr(this, 0);
                },
                removePlayer: function(eD) {
                    SetUserVisible_sanDaEr(this, 0);
                },
                mjhand: function(eD) {
                    InitUserHandUI_sanDaEr(this, 0);
                    delete MjClient.playui.isFaPai;
                    MjClient.playui.showPostCardAnimation();
                },
                roundEnd: function() {
                    InitUserCoinAndName(this, 0);
                    //setTaiInfo("");
                },
                PKPut: function(eD) {
                    //cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>PKPut---------------");
                    DealMJPut_card(this, eD, 0);
                    setUserOffline(this, 0);
                    MjClient.playui.DealCardPromp_sanDaEr(eD.uid,0);

                },
                waitPut: function(eD) {
                    cc.log(">>>>>>>>>>>>>>>>down>>>>>>>>>>>>>>>waitPut");
                    DealWaitPut_card(this, eD, 0);
                },
                onlinePlayer: function(eD) {
                    setUserOffline(this, 0);
                },
                playerStatusChange: function(eD) {
                    setUserOffline(this, 0);
                }
            }
        },
        right: {
            head: {
                zhuang: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        clearCardUI: function() {
                            this.visible = false;
                        },
                        waitPut: function() {
                            MjClient.playui.showUserZhuangLogo(this, 1 ,false);
                        },
                        s2c_sdhWaitJiaoZhu: function() {
                            MjClient.playui.showUserZhuangLogo(this, 1 ,true);
                        },
                        initSceneData: function() {
                            MjClient.playui.showUserZhuangLogo(this, 1 ,false);
                            if(MjClient.data.sData.tData.tState == TableState.isReady || MjClient.data.sData.tData.tState == TableState.roundFinish)
                            {
                                this.visible = false;
                            }
                        },
                        roundEnd:function(){
                            MjClient.playui.showUserZhuangLogo(this, 1 ,false);
                        }
                    }
                },
                chatbg: {
                    _run: function() {
                        this.getParent().zIndex = 500;
                    },
                    chattext: {
                        _event: {

                            MJChat: function(msg) {
                                showUserChat(this, 1, msg);
                            },
                            playVoice: function(voicePath) {
                                MjClient.data._tempMessage.msg = voicePath;
                                showUserChat(this, 1, MjClient.data._tempMessage);
                            }
                        }
                    }
                },
                _click: function(btn) {
                    showPlayerInfo(1, btn);
                },
                _event: {
                    loadWxHead: function(d) {
                        setWxHead(this, d, 1);
                    },
                    addPlayer: function(eD) {
                        showFangzhuTagIcon(this, 1);
                    },
                    removePlayer: function(eD) {
                        showFangzhuTagIcon(this, 1);
                    }
                },
                _run: function() {
                    // this.zIndex = 600;
                    showFangzhuTagIcon(this, 1);
                },
                num_zhuafen: {
                    _run: function() {
                        this.setString("");
                        this.ignoreContentAdaptWithSize(true);
                    },
                    _event: {
                        mjhand: function(){
                            MjClient.playui.showUserZhuaFen_sanDaEr(this, 1);
                        },
                        waitPut:function () {
                            MjClient.playui.showUserZhuaFen_sanDaEr(this, 1);
                        },
                        initSceneData: function() {
                            var tData = MjClient.data.sData.tData;
                            if(tData.tState == TableState.waitReady){
                                this.setString("");
                            }else{
                                MjClient.playui.showUserZhuaFen_sanDaEr(this, 1);
                            }
                        },
                        clearCardUI:function() {
                            this.setString("");
                        },
                        onlinePlayer: function(msg) {
                            if(msg.uid == SelfUid()){
                                this.setString("");
                            }
                        },
                        waitReady: function(){
                            this.setString("");
                        },
                        roundEnd:function () {
                            MjClient.playui.showUserZhuaFen_sanDaEr(this, 1);
                        }
                    }
                },
                score_bg: {
                    _visible: false
                },
                name_bg: {
                    _visible: false,
                    _run: function() {
                        if (MjClient.rePlayVideo != -1)
                            this.setOpacity(255);
                    }
                },
            },
            play_tips: {
                _layout: [
                    [0.08, 0.14],
                    [0.75, 0.5],
                    [0, 0.5]
                ],
                _run: function() {
                    this.zIndex = actionZindex;
                },
                _visible: false,
            },
            ready: {
                _layout: [
                    [0.084, 0.094],
                    [0.5, 0.5],
                    [1, 0.7]
                ],
                _run: function() {
                    GetReadyVisible(this, 1);
                },
                _event: {
                    moveHead: function() {
                        GetReadyVisible(this, -1);
                    },
                    addPlayer: function() {
                        GetReadyVisible(this, 1);
                    },
                    removePlayer: function() {
                        GetReadyVisible(this, 1);
                    },
                    onlinePlayer: function() {
                        GetReadyVisible(this, 1);
                    }
                }
            },
            stand: {
                _layout: [
                    [0, 0.13*0.9],
                    [1, 1],
                    [-2.9, -0.7]
                ],
                _visible: false
            },
            deskCard: {
                // _layout: [
                //     [0.1, 0.15],
                //     [1, 0.55],
                //     [-3, 0]
                // ],
                _run: function() {
                    if (MjClient.rePlayVideo == -1) // 表示正常游戏
                        setWgtLayout(this, [0.047, 0], [1, 0.55], [-3.7, 0.55]);
                    else
                        setWgtLayout(this, [0.052, 0], [1, 0.55], [-4.7, 0.10]);
                },
                _visible: false
            },
            jiaoFenTag: {
                _run: function() {
                    this.setScale(MjClient.size.width / 1280);
                    this.setPosition(MjClient.playui.jsBind.right.deskCard._node.getPosition());
                },
                _visible: false,
                _event: {
                    s2c_sdhJiaoFen: function(msg) {
                        MjClient.playui.showJiaoFenTag(1);
                    },
                    mjhand:function () {
                        this.visible =false;
                    }
                }
            },
            _event: {
                clearCardUI: function() {
                    clearCardUI_card(this, 1);
                },
                initSceneData: function(eD) {
                    SetUserVisible_sanDaEr(this, 1);
                },
                addPlayer: function(eD) {
                    SetUserVisible_sanDaEr(this, 1);
                },
                removePlayer: function(eD) {
                    SetUserVisible_sanDaEr(this, 1);
                },
                mjhand: function(eD) {
                    InitUserHandUI_sanDaEr(this, 1);
                },
                roundEnd: function() {
                    InitUserCoinAndName(this, 1);
                },
                waitPut: function(eD) {
                    DealWaitPut_card(this, eD, 1);
                },
                PKPut: function(eD) {
                    DealMJPut_card(this, eD, 1);
                    setUserOffline(this, 1);
                    MjClient.playui.DealCardPromp_sanDaEr(eD.uid,1);
                },
                onlinePlayer: function(eD) {
                    setUserOffline(this, 1);
                },
                playerStatusChange: function(eD) {
                    setUserOffline(this, 1);
                }
            }
        },
        top: {
            _run: function() {
                this.visible = MjClient.MaxPlayerNum >= 3;
            },
            head: {
                zhuang: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        clearCardUI: function() {
                            this.visible = false;
                        },
                        waitPut: function() {
                            MjClient.playui.showUserZhuangLogo(this, 2 ,false);
                        },
                        s2c_sdhWaitJiaoZhu: function() {
                            MjClient.playui.showUserZhuangLogo(this, 2 ,true);
                        },
                        initSceneData: function() {
                            MjClient.playui.showUserZhuangLogo(this, 2 ,false);
                            if(MjClient.data.sData.tData.tState == TableState.isReady || MjClient.data.sData.tData.tState == TableState.roundFinish)
                            {
                                this.visible = false;
                            }
                        },
                        roundEnd:function(){
                            MjClient.playui.showUserZhuangLogo(this, 2 ,false);
                        }
                    }
                },
                chatbg: {
                    _run: function() {
                        this.getParent().zIndex = 500;
                    },
                    chattext: {
                        _event: {

                            MJChat: function(msg) {
                                showUserChat(this, 2, msg);
                            },
                            playVoice: function(voicePath) {
                                MjClient.data._tempMessage.msg = voicePath;
                                showUserChat(this, 2, MjClient.data._tempMessage);
                            }
                        }
                    }
                },
                _click: function(btn) {
                    showPlayerInfo(2, btn);
                },
                _event: {
                    loadWxHead: function(d) {
                        setWxHead(this, d, 2);
                    },
                    addPlayer: function(eD) {
                        showFangzhuTagIcon(this, 2);
                    },
                    removePlayer: function(eD) {
                        showFangzhuTagIcon(this, 2);
                    }
                },
                _run: function() {
                    // this.zIndex = 600;
                    showFangzhuTagIcon(this, 2);
                },
                num_zhuafen: {
                    _run: function() {
                        this.setString("");
                        this.ignoreContentAdaptWithSize(true);
                    },
                    _event: {
                        mjhand: function(){
                            MjClient.playui.showUserZhuaFen_sanDaEr(this, 2);
                        },
                        waitPut:function () {
                            MjClient.playui.showUserZhuaFen_sanDaEr(this, 2);
                        },
                        initSceneData: function() {
                            var tData = MjClient.data.sData.tData;
                            if(tData.tState == TableState.waitReady){
                                this.setString("");
                            }else{
                                MjClient.playui.showUserZhuaFen_sanDaEr(this, 2);
                            }
                        },
                        clearCardUI:function() {
                            this.setString("");
                        },
                        onlinePlayer: function(msg) {
                            if(msg.uid == SelfUid()){
                                this.setString("");
                            }
                        },
                        waitReady: function(){
                            this.setString("");
                        },
                        roundEnd:function () {
                            MjClient.playui.showUserZhuaFen_sanDaEr(this, 2);
                        }
                    }
                },
                score_bg: {
                    _visible: false
                },
                name_bg: {
                    _visible: false,
                    _run: function() {
                        if (MjClient.rePlayVideo != -1)
                            this.setOpacity(255);
                    }
                },
            },
            play_tips: {
                _layout: [
                    [0.08, 0.14],
                    [0.25, 0.5],
                    [0, 0.5]
                ],
                _run: function() {
                    this.zIndex = actionZindex;
                },
                _visible: false,
            },
            ready: {
                _run: function() {
                    setWgtLayout(this,  [0.084, 0.094], [0.5, 0.5], [1, 4]);
                    GetReadyVisible(this, 2);
                },
                _event: {
                    moveHead: function() {
                        GetReadyVisible(this, -1);
                    },
                    addPlayer: function() {
                        GetReadyVisible(this, 2);
                    },
                    removePlayer: function() {
                        GetReadyVisible(this, 2);
                    },
                    onlinePlayer: function() {
                        GetReadyVisible(this, 2);
                    }
                }
            },
            stand: {
                _run: function() {
                    setWgtLayout(this, [0, 0.13 * 0.6], [0.66, 0.8], [0, -0.32]);
                    this.setVisible(false);
                }
            },
            deskCard: {
                _run: function() {
                    if (MjClient.rePlayVideo == -1)
                        setWgtLayout(this, [0.047, 0], [0.73, 0.7], [0, 0.6]);
                    else
                        setWgtLayout(this, [0.052, 0], [0.68, 0.65], [0, 0.2]);
                    this.setVisible(false);
                },
            },
            jiaoFenTag: {
                _run: function() {
                    this.setScale(MjClient.size.width / 1280);
                    this.setPosition(MjClient.playui.jsBind.top.deskCard._node.getPosition());
                    this.setVisible(false);
                },
                _event: {
                    s2c_sdhJiaoFen: function(msg) {
                        MjClient.playui.showJiaoFenTag(2);
                    },
                    mjhand:function () {
                        this.visible =false;
                    }
                }

            },
            _event: {
                clearCardUI: function() {
                    clearCardUI_card(this, 2);
                },
                initSceneData: function(eD) {
                    SetUserVisible_sanDaEr(this, 2);
                },
                addPlayer: function(eD) {
                    SetUserVisible_sanDaEr(this, 2);
                },
                removePlayer: function(eD) {
                    SetUserVisible_sanDaEr(this, 2);
                },
                mjhand: function(eD) {
                    InitUserHandUI_sanDaEr(this, 2);
                },
                roundEnd: function() {
                    InitUserCoinAndName(this, 2);
                },
                waitPut: function(eD) {
                    DealWaitPut_card(this, eD, 2);
                },
                PKPut: function(eD) {
                    DealMJPut_card(this, eD, 2);
                    setUserOffline(this, 2);
                    MjClient.playui.DealCardPromp_sanDaEr(eD.uid,2);
                },
                onlinePlayer: function(eD) {
                    setUserOffline(this, 2);
                },
                playerStatusChange: function(eD) {
                    setUserOffline(this, 2);
                },
            }
        },
        fifth: {
            _run: function() {
                this.visible = MjClient.MaxPlayerNum >= 5;
            },
            head: {
                zhuang: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        clearCardUI: function() {
                            this.visible = false;
                        },
                        waitPut: function() {
                            MjClient.playui.showUserZhuangLogo(this, 4 ,false);
                        },
                        s2c_sdhWaitJiaoZhu: function() {
                            MjClient.playui.showUserZhuangLogo(this, 4 ,true);
                        },
                        initSceneData: function() {
                            MjClient.playui.showUserZhuangLogo(this, 4 ,false);
                            if(MjClient.data.sData.tData.tState == TableState.isReady || MjClient.data.sData.tData.tState == TableState.roundFinish)
                            {
                                this.visible = false;
                            }
                        },
                        roundEnd:function(){
                            MjClient.playui.showUserZhuangLogo(this, 4 ,false);
                        }
                    }
                },
                chatbg: {
                    _run: function() {
                        this.getParent().zIndex = 500;
                    },
                    chattext: {
                        _event: {

                            MJChat: function(msg) {
                                showUserChat(this, 4, msg);
                            },
                            playVoice: function(voicePath) {
                                MjClient.data._tempMessage.msg = voicePath;
                                showUserChat(this, 4, MjClient.data._tempMessage);
                            }
                        }
                    }
                },
                _click: function(btn) {
                    showPlayerInfo(4, btn);
                },
                _event: {
                    loadWxHead: function(d) {
                        setWxHead(this, d, 4);
                    },
                    addPlayer: function(eD) {
                        showFangzhuTagIcon(this, 4);
                    },
                    removePlayer: function(eD) {
                        showFangzhuTagIcon(this, 4);
                    }
                },
                _run: function() {
                    // this.zIndex = 600;
                    showFangzhuTagIcon(this, 4);
                },
                num_zhuafen: {
                    _run: function() {
                        this.setString("");
                        this.ignoreContentAdaptWithSize(true);
                    },
                    _event: {
                        mjhand: function(){
                            MjClient.playui.showUserZhuaFen_sanDaEr(this, 4);
                        },
                        initSceneData: function() {
                            var tData = MjClient.data.sData.tData;
                            if(tData.tState == TableState.waitReady){
                                this.setString("");
                            }else{
                                MjClient.playui.showUserZhuaFen_sanDaEr(this, 4);
                            }
                        },
                        waitPut:function () {
                            MjClient.playui.showUserZhuaFen_sanDaEr(this, 4);
                        },
                        clearCardUI:function() {
                            this.setString("");
                        },
                        onlinePlayer: function(msg) {
                            if(msg.uid == SelfUid()){
                                this.setString("");
                            }
                        },
                        waitReady: function(){
                            this.setString("");
                        },
                        roundEnd:function () {
                            MjClient.playui.showUserZhuaFen_sanDaEr(this, 4);
                        }
                    }
                },
                score_bg: {
                    _visible: false
                },
                name_bg: {
                    _visible: false,
                    _run: function() {
                        if (MjClient.rePlayVideo != -1)
                            this.setOpacity(255);
                    }
                },
            },
            play_tips: {
                _layout: [
                    [0.08, 0.14],
                    [0.25, 0.5],
                    [0, 0.5]
                ],
                _run: function() {
                    this.zIndex = actionZindex;
                },
                _visible: false,
            },
            ready: {
                _run: function() {
                    setWgtLayout(this, [0.084, 0.094], [0.5, 0.5],  [-1, 0.7]);
                    GetReadyVisible(this, 4);
                },
                _event: {
                    moveHead: function() {
                        GetReadyVisible(this, -1);
                    },
                    addPlayer: function() {
                        GetReadyVisible(this, 4);
                    },
                    removePlayer: function() {
                        GetReadyVisible(this, 4);
                    },
                    onlinePlayer: function() {
                        GetReadyVisible(this, 4);
                    }
                }
            },
            stand: {
                _run: function() {
                    setWgtLayout(this, [0, 0.13*0.9],  [0, 1], [2.9, -0.7]);
                    this.setVisible(false);
                }
            },
            deskCard: {
                _run: function() {
                    if (MjClient.rePlayVideo == -1)
                        setWgtLayout(this, [0.047, 0], [0, 0.55], [3.2, 0.55]);
                    else
                        setWgtLayout(this, [0.052, 0], [0, 0.55], [5.0, 0.10]);
                    this.setVisible(false);
                },
            },
            jiaoFenTag: {
                _run: function() {
                    this.setScale(MjClient.size.width / 1280);
                    this.setPosition(MjClient.playui.jsBind.fifth.deskCard._node.getPosition());
                    this.setVisible(false);
                },
                _event: {
                    s2c_sdhJiaoFen: function(msg) {
                        MjClient.playui.showJiaoFenTag(4);
                    },
                    mjhand:function () {
                        this.visible =false;
                    }
                }
            },
            _event: {
                clearCardUI: function() {
                    clearCardUI_card(this, 4);
                },
                initSceneData: function(eD) {
                    SetUserVisible_sanDaEr(this, 4);
                },
                addPlayer: function(eD) {
                    SetUserVisible_sanDaEr(this, 4);
                },
                removePlayer: function(eD) {
                    SetUserVisible_sanDaEr(this, 4);
                },
                mjhand: function(eD) {
                    InitUserHandUI_sanDaEr(this, 4);
                },
                roundEnd: function() {
                    InitUserCoinAndName(this, 4);
                },
                waitPut: function(eD) {
                    DealWaitPut_card(this, eD, 4);
                },
                PKPut: function(eD) {
                    DealMJPut_card(this, eD, 4);
                    setUserOffline(this, 4);
                    MjClient.playui.DealCardPromp_sanDaEr(eD.uid,4);
                },
                onlinePlayer: function(eD) {
                    setUserOffline(this, 4);
                },
                playerStatusChange: function(eD) {
                    setUserOffline(this, 4);
                },
            }
        },
        left: {
            head: {
                zhuang: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        clearCardUI: function() {
                            this.visible = false;
                        },
                        waitPut: function() {
                            MjClient.playui.showUserZhuangLogo(this, 3 ,false);
                        },
                        s2c_sdhWaitJiaoZhu: function() {
                            MjClient.playui.showUserZhuangLogo(this, 3 ,true);
                        },
                        initSceneData: function() {
                            MjClient.playui.showUserZhuangLogo(this, 3 ,false);
                            if(MjClient.data.sData.tData.tState == TableState.isReady || MjClient.data.sData.tData.tState == TableState.roundFinish)
                            {
                                this.visible = false;
                            }
                        },
                        roundEnd:function(){
                            MjClient.playui.showUserZhuangLogo(this, 3 ,false);
                        }
                    }
                },
                chatbg: {
                    _run: function() {
                        this.getParent().zIndex = 500;
                    },
                    chattext: {
                        _event: {

                            MJChat: function(msg) {

                                showUserChat(this, 3, msg);
                            },
                            playVoice: function(voicePath) {
                                MjClient.data._tempMessage.msg = voicePath;
                                showUserChat(this, 3, MjClient.data._tempMessage);
                            }
                        }
                    }
                },
                _click: function(btn) {
                    showPlayerInfo(3, btn);
                },
                _event: {
                    loadWxHead: function(d) {
                        setWxHead(this, d, 3);
                    },
                    addPlayer: function(eD) {
                        showFangzhuTagIcon(this, 3);
                    },
                    removePlayer: function(eD) {
                        showFangzhuTagIcon(this, 3);
                    }
                },
                _run: function() {
                    // this.zIndex = 600;
                    showFangzhuTagIcon(this, 3);
                },
                num_zhuafen: {
                    _run: function() {
                        this.setString("");
                        this.ignoreContentAdaptWithSize(true);
                    },
                    _event: {
                        mjhand: function(){
                            MjClient.playui.showUserZhuaFen_sanDaEr(this, 3);
                        },
                        initSceneData: function() {
                            var tData = MjClient.data.sData.tData;
                            if(tData.tState == TableState.waitReady){
                                this.setString("");
                            }else{
                                MjClient.playui.showUserZhuaFen_sanDaEr(this, 3);
                            }
                        },
                        waitPut:function () {
                            MjClient.playui.showUserZhuaFen_sanDaEr(this, 3);
                        },
                        clearCardUI:function() {
                            this.setString("");
                        },
                        onlinePlayer: function(msg) {
                            if(msg.uid == SelfUid()){
                                this.setString("");
                            }
                        },
                        waitReady: function(){
                            this.setString("");
                        },
                        roundEnd:function () {
                            MjClient.playui.showUserZhuaFen_sanDaEr(this, 3);
                        }
                    }
                },
                score_bg: {
                    _visible: false
                },
                name_bg: {
                    _visible: false,
                    _run: function() {
                        if (MjClient.rePlayVideo != -1)
                            this.setOpacity(255);
                    }
                },
            },
            play_tips: {
                _layout: [
                    [0.08, 0.14],
                    [0.25, 0.5],
                    [0, 0.5]
                ],
                _run: function() {
                    this.zIndex = actionZindex;
                },
                _visible: false,
            },
            ready: {
                _layout: [
                    [0.084, 0.094],
                    [0.5, 0.5],
                    [-1, 4]
                ],
                _run: function() {
                    GetReadyVisible(this, 3);
                },
                _event: {
                    moveHead: function() {
                        GetReadyVisible(this, -1);
                    },
                    addPlayer: function() {
                        GetReadyVisible(this, 3);
                    },
                    removePlayer: function() {
                        GetReadyVisible(this, 3);
                    },
                    onlinePlayer: function() {
                        GetReadyVisible(this, 3);
                    }
                }
            },
            stand: {
                _layout: [
                    [0, 0.13 * 0.6],
                    [0.34, 0.8],
                    [0, -0.32]
                ],
                _visible: false,
            },
            deskCard: {
                _run: function() {
                    if (MjClient.rePlayVideo == -1)
                        setWgtLayout(this, [0.047, 0], [0.27, 0.7], [0, 0.6]);
                    else
                        setWgtLayout(this, [0.052, 0], [0.3, 0.65], [0, 0.2]);
                },
                _visible: false,
            },
            jiaoFenTag: {
                _run: function() {
                    this.setScale(MjClient.size.width / 1280);
                    this.setPosition(MjClient.playui.jsBind.left.deskCard._node.getPosition());
                },
                _visible: false,
                _event: {
                    s2c_sdhJiaoFen: function(msg) {
                        MjClient.playui.showJiaoFenTag(3);
                    },
                    mjhand:function () {
                        this.visible =false;
                    }
                }
            },
            _event: {
                clearCardUI: function() {
                    clearCardUI_card(this, 3);
                },
                initSceneData: function(eD) {
                    SetUserVisible_sanDaEr(this, 3);
                },
                addPlayer: function(eD) {
                    SetUserVisible_sanDaEr(this, 3);
                },
                removePlayer: function(eD) {
                    SetUserVisible_sanDaEr(this, 3);
                },
                mjhand: function(eD) {
                    InitUserHandUI_sanDaEr(this, 3);
                },
                roundEnd: function() {
                    InitUserCoinAndName(this, 3);
                },
                waitPut: function(eD) {
                    DealWaitPut_card(this, eD, 3);
                },
                PKPut: function(eD) {
                    DealMJPut_card(this, eD, 3);
                    setUserOffline(this, 3);
                    MjClient.playui.DealCardPromp_sanDaEr(eD.uid,3);
                },
                onlinePlayer: function(eD) {
                    setUserOffline(this, 3);
                },
                playerStatusChange: function(eD) {
                    setUserOffline(this, 3);
                }
            },
        },
        panel: {
            _layout: [
                [1, 1],
                [0.5, 0.0],
                [0, 0], true
            ],
            _run: function() {
                MjClient.playui.panel = this;
            },
            jiaoFenWaitTip: {
                _visible: false,
            },
            maiPaiWaitTip: {
                _visible: false,
            },
            jiaoZhuWaitTip: {
                _visible: false,
            },
            chooseFriendTip:{
                _visible: false,
            },

            BtnMaiPai: {
                _visible: false,
            },

            BtnChaPai: {
                _visible: false,
                _run: function() {
                    this.srcX = this.x;
                },
                _click: function() {
                    MjClient.playui.showChaPaiPanel(MjClient.playui.chaPaiPanel);
                    MjClient.playui.jsBind.panel.touchLayer._node.setTouchEnabled(true);
                }
            },

            touchLayer: {
                _layout: [
                    [1, 1],
                    [0.0, 0.0],
                    [0, 0], true, true
                ],
                _click: function(btn) {
                    var panel = btn.getParent();
                    if (panel.getChildByName("jiaoFenPanel").isVisible() || panel.getChildByName("jiaoZhuPanel").isVisible())
                        return;

                    panel.getChildByName("diPaiPanel").visible = false;
                    panel.getChildByName("shangYiLunPanel").visible = false;
                    panel.getChildByName("chaPaiPanel").visible = false;
                    btn.setTouchEnabled(false);
                },
            },
            jiaoFenPanel: {
                _visible: false,
            },
            jiaoZhuPanel: {
                _visible: false,
                _run:function () {
                    var tData = MjClient.data.sData.tData;
                    this.btnHeiT = this.getChildByName("Btn_3");
                    this.btnHongT = this.getChildByName("Btn_2");
                    this.btnMh = this.getChildByName("Btn_1");
                    this.btnFk = this.getChildByName("Btn_0");
                    this.btnDaFu = this.getChildByName("Btn_4");
                    if(tData.areaSelectMode.zhuFuTongDa == false){
                        this.btnDaFu.visible = false;
                        this.btnHeiT.x = this.btnHeiT.x + 60;
                        this.btnHongT.x = this.btnHongT.x + 60;
                        this.btnMh.x = this.btnMh.x + 60;
                        this.btnFk.x = this.btnFk.x + 60;
                    }
              }
            },
            shangYiLunPanel: {
                _visible: false,
                _run: function() {
                    MjClient.playui.shangYiLunPanel = this;
                }
            },
            diPaiPanel: {
                _visible: false,
                _run: function() {
                    MjClient.playui.diPaiPanel = this;
                }
            },
            chaPaiPanel: {
                _visible: false,
                _run: function() {
                    MjClient.playui.chaPaiPanel = this;

                    if (MjClient.rePlayVideo != -1)
                    {
                        MjClient.playui.jsBind.panel.jiaoFenPanel._node.y -= 50;
                        MjClient.playui.jsBind.panel.jiaoZhuPanel._node.y -= 50;
                        // MjClient.playui.jsBind.panel.BtnTouXiang._node.y -= 100;
                        MjClient.playui.jsBind.panel.BtnMaiPai._node.y -= 100;
                        MjClient.playui.jsBind.panel.jiaoFenWaitTip._node.y -= 100;
                        MjClient.playui.jsBind.panel.chooseFriendTip._node.y -= 100;
                        MjClient.playui.jsBind.panel.maiPaiWaitTip._node.y -= 100;
                        MjClient.playui.jsBind.panel.jiaoZhuWaitTip._node.y -= 100;
                        // MjClient.playui.jsBind.panel.touXiangWaitTip._node.y -= 100;
                        // MjClient.playui.jsBind.panel.touXiangContinueTip._node.y -= 100;
                        MjClient.playui.jsBind.BtnPutCard._node.y -= 50;
                        // MjClient.playui.jsBind.BtnShuaiPai._node.y -= 50;
                        MjClient.playui.jsBind.BtnHimt._node.y -= 50;
                    }
                }
            },
            chooseFriendPanel:{
                _visible: false,
                _event: {
                    _run: function() {
                        MjClient.playui.chooseFriendPanel = this;
                    }
                }
            },
            _event: {
                clearCardUI: function() {
                    cc.log("panel:clearCardUI");
                    var childrens = this.getChildren();
                    for (var i = 0; i < childrens.length; i++) {
                        if (childrens[i].getName() != "touchLayer")
                            childrens[i].setVisible(false);
                    }

                    // MjClient.playui._btnChaPai.x = MjClient.playui._btnChaPai.srcX;
                    // MjClient.playui._btnShangYiLun.x = MjClient.playui._btnShangYiLun.srcX;
                },
                s2c_sdhJiaoFen: function(d) {
                    if (MjClient.rePlayVideo != -1)
                    {
                        MjClient.playui.jsBind.panel.jiaoFenPanel._node.setVisible(false);
                        MjClient.playui.jsBind.panel.touchLayer._node.setTouchEnabled(false);
                    }

                    MjClient.playui.showJiaoFenPanel(d);
                    MjClient.playui.showWaitTip();

                    if(d.jiaoFenPlayer != null)
                    {
                        if (d.jiaoFen != -1 && d.isLastJiao == true)
                        {
                            playEffectInPlay("jiao" + d.jiaoFen);
                        }
                        else {
                            playEffectInPlay("jiao0")
                        }
                    }
                },
                s2c_sdhWaitJiaoZhu: function() {
                    if (MjClient.rePlayVideo != -1)
                    {
                        MjClient.playui.jsBind.panel.jiaoZhuPanel._node.setVisible(false);
                        MjClient.playui.jsBind.panel.touchLayer._node.setTouchEnabled(false);
                    }
                    MjClient.playui.jsBind.panel.jiaoFenPanel._node.setVisible(false);
                    MjClient.playui.hideJiaoFenTag();
                    MjClient.playui.showWaitTip();
                    MjClient.playui.addDiPaiToHand();
                    MjClient.playui.runAction((cc.sequence( cc.DelayTime(1.4),cc.callFunc(function() {
                            MjClient.playui.showJiaoZhuPanel();
                        })
                    )))

                },
                s2c_sdhWaitChooseCard: function() {
                    if (MjClient.rePlayVideo != -1)
                    {
                        MjClient.playui.jsBind.panel.chooseFriendPanel._node.setVisible(false);
                        MjClient.playui.jsBind.panel.touchLayer._node.setTouchEnabled(false);
                    }
                    MjClient.playui.showChooseFriendPanel();
                    MjClient.playui.showWaitTip();
                },
                s2c_sdhChooseCard:function () {
                    MjClient.playui.removeWaitTip();
                },
                s2c_sdhJiaoZhu: function(d) {
                    var tData = MjClient.data.sData.tData;
                    if (tData.zhuPaiType != null && tData.zhuPaiType != -1) {
                        for (var i = 0; i < 5; i ++)    // 回放时四个玩家都有手牌
                        {
                            var node = getNode_cards(i);
                            if(!node)
                            {
                                continue;
                            }
                            var children = node.children;
                            for (var j = 0; j < children.length; j++) {
                                var ci = children[j];
                                if (ci.name == "mjhand" || ci.name == "mjhand_replay") {
                                    MjClient.playui.setCardSprite_ZhuTag(ci);
                                }
                            }
                        }

                        if (tData.zhuPaiType != -1 )
                            playEffectInPlay(["fangkuai", "meihua", "hongtao", "heitao", "wu"][tData.zhuPaiType]);
                    }

                    if (tData.tState == TableState.waitMaiPai)
                    {
                        var playerNode = getNode_cards(0);
                        MjClient.playui.CardLayoutRestore(playerNode, 0);
                        MjClient.playui.showMaiPaiBtn();
                        MjClient.playui.showWaitTip();
                    }

                },
                s2c_sdhMaiPai: function(d) {
                    if (MjClient.rePlayVideo != -1)
                    {
                        MjClient.selectCards_card = [];
                        MjClient.colloctionCurrentSelcetUIArray = [];
                        MjClient.playui.jsBind.panel.BtnMaiPai._node.setVisible(false);
                    }
                    MjClient.playui.removeMaiPaiFromHand();
                },
                s2c_TiQianOver: function(d){
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    var pl = null;
                    if(typeof(d.uid) != "undefined")
                    {
                        pl = sData.players[d.uid];
                    }
                    MjClient.playui.showWaitTip();
                    if (pl && tData.isAgreeOverList[d.uid] == 0) {
                        MjClient.showToast("有玩家不同意提前结束，游戏继续！");
                        MjClient.playui.showWaitTip();
                        if(MjClient.playui.tiQianOverDialog && sys.isObjectValid(MjClient.playui.tiQianOverDialog))
                        {
                            MjClient.playui.tiQianOverDialog.removeFromParent(true);
                            MjClient.playui.tiQianOverDialog = null;
                        }
                    }
                    else{
                        MjClient.playui.showTiQianOverDialog(d.info);
                    }
                },
                waitPut: function(d) {
                    var tData = MjClient.data.sData.tData;
                    if (tData.putCardsRecord && tData.putCardsRecord.length > 0 && Object.keys(tData.putCardsRecord[0]).length == MjClient.MaxPlayerNum) {
                        MjClient.playui._btnShangYiLun.setVisible(true);
                    }
                },
            }
        },
        zhuangFlyImg:{
            _layout: [
                [0.15, 0.15],
                [0.5, 0.5],
                [0, 0]
            ],
            _run:function(){
                MjClient.playui.zhuangFlyImg=this;
            },
            _visible: false
        },
        chat_btn: {
            _layout: [
                [0.09, 0.09],
                [0.95, 0.12],
                [0.3, 2.95]
            ],
            _visible: false,
            _click: function() {
                var chatlayer = new ChatLayer();
                MjClient.Scene.addChild(chatlayer);
            },
            _event: {
                mjhand:function(){
                    this.visible = true;
                },
                PKPut:function(){
                    this.visible = true;
                },
                waitPut:function(){
                    this.visible = true;
                },
                initSceneData:function(){
                    var tData = MjClient.data.sData.tData;
                    if(tData.tState != TableState.waitJoin && tData.tState != TableState.waitReady){
                        this.visible = true;
                    }
                    else {
                        this.visible = false;
                    }
                }
            }
        },
        voice_btn: {
            _layout: [
                [0.09, 0.09],
                [0.01, 0.12],
                [0.5, 2.95]
            ],
            _run: function() {
                initVoiceData();
                cc.eventManager.addListener(getTouchListener(), this);
                if (MjClient.isShenhe) this.visible = false;
                this.visible = false;
            },
            _touch: function(btn, eT) {
                // 点击开始录音 松开结束录音,并且上传至服务器, 然后通知其他客户端去接受录音消息, 播放
                if (eT == 0) {
                    startRecord();
                } else if (eT == 2) {
                    endRecord();
                } else if (eT == 3) {
                    cancelRecord();
                }
            },
            _event: {
                cancelRecord: function() {
                    MjClient.native.HelloOC("cancelRecord !!!");
                },
                uploadRecord: function(filePath) {
                    if (filePath) {
                        MjClient.native.HelloOC("upload voice file");
                        MjClient.native.UploadFile(filePath, MjClient.remoteCfg.voiceUrl, "sendVoice");
                    } else {
                        MjClient.native.HelloOC("No voice file update");
                    }
                },
                sendVoice: function(fullFilePath) {
                    if (!fullFilePath) {
                        console.log("sendVoice No fileName");
                        return;
                    }

                    var getFileName = /[^\/]+$/;
                    var extensionName = getFileName.exec(fullFilePath);
                    var fileName = extensionName[extensionName.length - 1];
                    console.log("sfileName is:" + fileName);

                    MjClient.gamenet.request("pkroom.handler.tableMsg", {
                        cmd: "downAndPlayVoice",
                        uid: SelfUid(),
                        type: 3,
                        msg: fileName,
                        num: MjClient.data._JiaheTempTime //录音时长
                    });
                    MjClient.native.HelloOC("download file");
                },
                downAndPlayVoice: function(msg) {
                    MjClient.native.HelloOC("downloadPlayVoice ok");
                    MjClient.data._tempMessage = msg;
                    MjClient.native.HelloOC("mas is" + JSON.stringify(msg));
                    downAndPlayVoice(msg.uid, msg.msg);
                },
                mjhand:function(){
                    this.visible = true;
                },
                PKPut:function(){
                    this.visible = true;
                },
                waitPut:function(){
                    this.visible = true;
                },
                initSceneData:function(){
                    var tData = MjClient.data.sData.tData;
                    if(tData.tState != TableState.waitJoin && tData.tState != TableState.waitReady){
                        this.visible = true;
                    }
                    else {
                        this.visible = false;
                    }
                }
            }
        },
    },
    _downNode: null,
    _rightNode: null,
    _topNode: null,
    _leftNode: null,
    _fifthNode: null,
    _btn_rank: null,
    winType: null,
    ctor: function() {
        this._super();
        var playui = ccs.load("Play_XinZhouSanDaEr.json");

        this.srcMaxPlayerNum = MjClient.MaxPlayerNum;
        MjClient.MaxPlayerNum = parseInt(MjClient.data.sData.tData.maxPlayer);

        playMusic("sanDaEr/effect/bgFight");
        this._downNode = playui.node.getChildByName("down");
        this._rightNode = playui.node.getChildByName("right");
        this._topNode = playui.node.getChildByName("top");
        this._leftNode = playui.node.getChildByName("left");
        this._fifthNode = playui.node.getChildByName("fifth");
        this._tingCardsNode = this._downNode.getChildByName("tingCardsNode");
        this._tingCardNumNode = this._downNode.getChildByName("tingCardNumNode");

        this._btnPutCard = playui.node.getChildByName("BtnPutCard");

        var panel = playui.node.getChildByName("panel");
        this._btnDiPai = playui.node.getChildByName("image_di").getChildByName("BtnDiPai");
        this._btnShangYiLun = playui.node.getChildByName("image_di").getChildByName("BtnShangYiLun");
        this._btnChaPai = panel.getChildByName("BtnChaPai");
        this._noPutTips = playui.node.getChildByName("noPutTips");
        this._btn_rank = playui.node.getChildByName("btn_rank");
        this._bg_sort = playui.node.getChildByName("bg_sort");
        MjClient.playui = this;
        MjClient.playui._AniNode = playui.node.getChildByName("eat");
        MjClient.sortClassType = 0;


        MjClient.nodePlayui = playui;

        BindUiAndLogic(playui.node, this.jsBind);
        this.addChild(playui.node);

        this._back  = playui.node.getChildByName("back");

        //触摸事件监听注册
        cc.eventManager.addListener(cc.EventListener.create(getTouchListener_card()), this._rightNode);

        MjClient.playui._jiazhuWait = playui.node.getChildByName("jiazhuWait");

        MjClient.lastMJTick = Date.now();
        this.runAction(cc.repeatForever(cc.sequence(cc.callFunc(function() {
            if (MjClient.game_on_show) MjClient.tickGame(0);
        }), cc.delayTime(7))));

        // 在亲友圈房间中添加邀请亲友圈牌有一起对局
        addClubYaoqingBtn();
        initSceneFunc();
        // MJ_setWaitBtn();
        return true;
    },
    onEnterTransitionDidFinish: function() {
        //this.setTouchEnabled(true);
        //cc.log("-----------init touch ---- ")
        this._super();
    },
    onExit: function() {
        this._super();
        MjClient.MaxPlayerNum = this.srcMaxPlayerNum;
    },

});
var playTimeUpEff = null;
//显示牌桌上最后打出的牌UI,断线重连走这里
PlayLayer_XinZhouSanDaEr.prototype.reConnectShowDeskCard = function() {
    var tData = MjClient.data.sData.tData;
    if (!tData.putCardsRecord || tData.putCardsRecord.length == 0)
        return;

    cc.log("reConnectShowDeskCard: putCardsRecord=" + JSON.stringify(tData.putCardsRecord));
    var uids = Object.keys(tData.putCardsRecord[tData.putCardsRecord.length - 1]);
    if (uids.length == MjClient.MaxPlayerNum)
        return;

    for (var i = 0; i < uids.length; i++) {
        var putCards = tData.putCardsRecord[tData.putCardsRecord.length - 1][uids[i]];
        var off = getUiOffByUid(Number(uids[i]));
        var node = getNode_cards(off);
        var _deskCard = node.getChildByName("deskCard");
        for (var j = 0; j < putCards.length; j++) {
            //打出去的牌,添加的牌桌上
            var out = _deskCard.clone();
            out.setScale(out.getScale() * 1.3);
            out.visible = true;
            out.name = "out";
            setCardSprite_card(out, putCards[j], 0, true);
            node.addChild(out);
        }
        MjClient.playui.CardLayoutDesk(node, putCards, off);
    }

    //断线重连，且轮到自己出牌
    if (IsTurnToMe() && tData.tState == TableState.waitPut) {
        //更新按钮状态
        UpdataCurrentPutCard();

        //初始化，出牌提示数组
        InitPutOutCardTips(0);
    }
}

PlayLayer_XinZhouSanDaEr.prototype.cannotOutCardGrey = function() {
    if (MjClient.data.sData.tData.lastPutPlayer == -1 || MjClient.data.sData.tData.lastPutPlayer == MjClient.data.sData.tData.curPlayer)
        return;

    var children = this._downNode.children;
    for (var i = 0; i < children.length; i++) {
        if (children[i].name != "mjhand")
            continue;

        var atTipArray = false;
        for (var j = 0, len = MjClient.tipCardsArray.length; j < len; j++) {
            for (var k = 0, len2 = MjClient.tipCardsArray[j].length; k < len2; k++) {
                if (MjClient.tipCardsArray[j][k] == children[i].tag) {
                    atTipArray = true;
                    break;
                }
            }

            if (atTipArray)
                break;
        }

        children[i].cannotOut = !atTipArray;
        if (atTipArray)
            children[i].setColor(MjClient.whiteColor);
        else
            children[i].setColor(MjClient.grayColor);
    }
}

PlayLayer_XinZhouSanDaEr.prototype.recoverCannotOutCard = function() {
    var children = this._downNode.children;
    for (var i = 0; i < children.length; i++) {
        if (children[i].name != "mjhand")
            continue;

        children[i].cannotOut = false;
        children[i].setColor(MjClient.whiteColor);
    }
}

PlayLayer_XinZhouSanDaEr.prototype.clockNumberUpdate = function(node, endFunc) {
    return arrowbkNumberUpdate(node, endFunc);
}

PlayLayer_XinZhouSanDaEr.prototype.updateClockPosition = function(arrowNode) {
    var tData = MjClient.data.sData.tData;
    var uids = tData.uids;
    var off = getOffByIndex(tData.curPlayer);

    cc.log("updateClockPosition: tData.curPlayer=" + tData.curPlayer);
    if(MjClient.data.sData.tData.tState >= TableState.waitJiaoFen  && off == 0)
    {
        arrowNode.visible = false;
        return;
    }
    var curPlayerNode = null;
    if (off == 1)
        curPlayerNode = this._rightNode;
    else if (off == 2)
        curPlayerNode = this._topNode;
    else if (off == 3)
        curPlayerNode = this._leftNode;
    else if (off == 4)
        curPlayerNode = this._fifthNode;

    if (curPlayerNode != null)
        arrowNode.setPosition(curPlayerNode.getChildByName("deskCard").getPosition());
    else
        arrowNode.setPosition(arrowNode.srcPosition);
}

/**
 * 拼接游戏玩法及付费信息
 * @function
 * @return {String}
 */
PlayLayer_XinZhouSanDaEr.prototype.getGameInfoString = function(param) {
    var tData = MjClient.data.sData.tData;
    var str = "";

    str += tData.areaSelectMode.twoIsChangZhu ? "2为常主," : "";
    str += tData.areaSelectMode.difen ? "底分X"+ tData.areaSelectMode.difen + "," : "";
    str += tData.areaSelectMode.zhuFuTongDa ? "主副同打," : "";

    if (param != "roundInfo") {
        switch (tData.areaSelectMode.payWay) {
            case 0:
                str += "房主付";
                break;
            case 1:
                str += "AA付";
                break;
            case 2:
                str += "大赢家付";
                break;
        }
    }

    if (str.charAt(str.length - 1) == ",")
        str = str.substring(0, str.length - 1);
    return str;
};

PlayLayer_XinZhouSanDaEr.prototype.updateOperateBtnPosition = function() {
    var putCardBtn = this.jsBind.BtnPutCard._node;
    var himtBtn = this.jsBind.BtnHimt._node;
    // var shuaiPaiBtn = this.jsBind.BtnShuaiPai._node;

    if (!putCardBtn.isVisible())
        return;

    var width = 0;
    var btns = [himtBtn, putCardBtn];
    for (var i = 0; i < btns.length; i++) {
        if (btns[i].isVisible())
            width += btns[i].width * btns[i].getScaleX() * 1.2;
    }

    var x = putCardBtn.srcX - width / 2;
    for (var i = 0; i < btns.length; i++) {
        if (btns[i].isVisible()) {
            btns[i].x = x + btns[i].width * btns[i].getScaleX() * 0.6;
            x += btns[i].width * btns[i].getScaleX() * 1.2;
        }
    }
}

// 拖拉机动画
PlayLayer_XinZhouSanDaEr.prototype.playCardAni_liandui = function() {
    var panel = this.jsBind.panel._node;
    var sprite = new cc.Sprite("playing/sanDaEr/liandui_1.png");
    var i = 1;
    sprite.schedule(function() {
        i ++;
        if (i <= 5)
            this.setTexture("playing/sanDaEr/liandui_" + i + ".png");
        else
            this.removeFromParent(true);
    }, 0.1);

    var tData = MjClient.data.sData.tData;
    var node = getNode_cards(getOffByIndex(tData.curPlayer));
    var deskCard = node.getChildByName("deskCard");
    sprite.setPosition(deskCard.getPosition());
    node.addChild(sprite, 999);
}

// 闲家得分达到条件时动画、投降
PlayLayer_XinZhouSanDaEr.prototype.playWinAni = function(winType) {
    cc.log("winType=" + winType + " this.winType=" + this.winType);

    var file = "";
    switch (winType) {
        //case -1: // 过庄
        //    file = "gameOver_sanDaHa/guozhuang.png";
        //    break;
        case 1: // 跨庄
            file = "gameOver_sanDaHa/kuazhuang.png";
            break;
        case 2: // 小倒
            file = "gameOver_sanDaHa/xiaodao.png";
            break;
        case 3: // 大倒
            file = "gameOver_sanDaHa/dadao.png";
            break;
        case 4:	// 投降
            file = "gameOver_sanDaHa/touxiang.png";
            break;
        default:
            return;
    }

    var sprite = new cc.Sprite(file);
    sprite.runAction(cc.sequence(cc.scaleTo(0.15, 1.5), cc.delayTime(0.15), cc.scaleTo(0.15, 1.0), cc.callFunc(function() {
        sprite.removeFromParent(true);
    })));
    var panel = this.jsBind.panel._node;
    sprite.setPosition(panel.width/2, panel.height/2);
    panel.addChild(sprite, 1);
}

// 刷新得分栏
PlayLayer_XinZhouSanDaEr.prototype.refreshScoreBanner = function(no) {
    var tData = MjClient.data.sData.tData;
    var scoreBanner = MjClient.playui.jsBind.scoreBanner;

    // debug server
    if (typeof(tData.zhuPaiType) == "undefined")
        tData.zhuPaiType = -1;
    if (typeof(tData.jiaoFen) == "undefined")
        tData.jiaoFen = -1;

    // 叫分
    var jiaofenNum = scoreBanner.jiaofenNum._node;
    var jiaoFenText = scoreBanner.text_jiaofen._node;
    if (tData.jiaoFen >= 0 && tData.tState != TableState.waitJiaoFen) {
        jiaofenNum.setString(tData.jiaoFen + "");
        jiaoFenText.setString("叫分");
    } else {
        jiaofenNum.setString("");
        jiaoFenText.setString("叫分");
    }

    // 叫主
    var strs = ["fangkuai.png", "meihua.png", "hongtao.png", "heitao.png"];
    if(no == true)
    {

    }
    else if(tData.zhuPaiType != -1 && tData.zhuPaiType != 4)
    {
        scoreBanner.image_zhu._node.setVisible(tData.zhuPaiType != -1);
        scoreBanner.image_zhu._node.loadTexture("playing/sanDaEr/flower/" + strs[tData.zhuPaiType]);
    }
    // if(tData.friendCard && tData.friendCard != -1 )
    // {
    //     scoreBanner.friend_card._node.scale = 0.35;
    //     scoreBanner.friend_card._node.setVisible(true);
    //     setCardSprite_card(scoreBanner.friend_card._node,tData.friendCard,true);
    // }

    // 余分
    var remainNum = scoreBanner.yufenNum._node;
    if(tData.remainScore >= 0)
    {
        remainNum.visible = true;
        remainNum.setString(tData.remainScore +"");
    }
    // 得分
    if (tData.tState == TableState.waitPut) {
        MjClient.playui.showScoreCards(scoreBanner._node, tData.fenPaiArr);
        var score = tData.totalScore;
        // for (var i = 0; i < tData.fenPaiArr.length; i++) {
        //     score += MjClient.majiang.getCardFen(tData.fenPaiArr[i]);
        // }
        scoreBanner.scoreNum._node.setString(score + "");
        scoreBanner.scoreNum._node.setVisible(true);
        if(MjClient.playui.defen && MjClient.playui.defen != score)
        {
            playEffectInPlay("getScore")
        }
        MjClient.playui.defen=score;
    }
    else {
        MjClient.playui.showScoreCards(scoreBanner._node, []);
        scoreBanner.scoreNum._node.setString("");
    }
}

// 判断是否有不同意投降的玩家
PlayLayer_XinZhouSanDaEr.prototype.haveNotAgreeOver = function()
{
    var sData = MjClient.data.sData;
    var tData = MjClient.data.sData.tData;
    for (var i = 0; i < tData.isAgreeOverList.length; i ++)
    {
        // var tempPl = sData.players[tData.uids[i] + ""];
        if (tData.isAgreeOverList[i] == 0)
        {
            return true;
        }
    }

    return false;
}

// 重置玩家同意投降状态
PlayLayer_XinZhouSanDaEr.prototype.initAgreeTouXiangStatus = function()
{
    var sData = MjClient.data.sData;
    var tData = MjClient.data.sData.tData;
    for (var i = 0; i < tData.uids.length; i++)
    {
        var tempPl = sData.players[tData.uids[i] + ""];
        tempPl.isAgreeTouXiang = -1;
    }
}

// 显示各种提示：等待叫分、等待叫主、等待埋牌、等待投降同意、不同意思投降继续游戏
PlayLayer_XinZhouSanDaEr.prototype.showWaitTip = function() {
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    cc.log("showWaitTip: tData.tState=" + tData.tState + " tData.curPlayer=" + tData.zhuang);
    var curOff = getOffByIndex(tData.curPlayer);

    MjClient.playui.panel.getChildByName("jiaoFenWaitTip").setVisible(tData.tState == TableState.waitJiaoFen && 0 != curOff);
    MjClient.playui.panel.getChildByName("jiaoZhuWaitTip").setVisible(tData.tState == TableState.waitJiaoZhu && 0 != curOff);
    MjClient.playui.panel.getChildByName("maiPaiWaitTip").setVisible(tData.tState == TableState.waitMaiPai && 0 != curOff );
    MjClient.playui.panel.getChildByName("chooseFriendTip").setVisible(tData.tState == TableState.waitChooseCard && 0 != curOff );
    MjClient.playui.panel.getChildByName("waitCaoZuoTip").setVisible(tData.hasTiQianOver == 0 && tData.tState == TableState.waitPut);
    cc.log("curOff = " + curOff);
}
PlayLayer_XinZhouSanDaEr.prototype.removeWaitTip = function() {
    MjClient.playui.panel.getChildByName("jiaoFenWaitTip").setVisible(false);
    MjClient.playui.panel.getChildByName("jiaoZhuWaitTip").setVisible(false);
    MjClient.playui.panel.getChildByName("maiPaiWaitTip").setVisible(false);
    MjClient.playui.panel.getChildByName("chooseFriendTip").setVisible(false );
}

// 显示各玩家叫分
PlayLayer_XinZhouSanDaEr.prototype.showJiaoFenTag = function(off) {
    var tData = MjClient.data.sData.tData;
    cc.log("showJiaoFenTag: tData.jiaoFen=" + tData.jiaoFen + " tData.jiaoFenPlayer=" + tData.jiaoFenPlayer);
    var playerNode = getNode_cards(off);
    var pl = getUIPlayer(off);
    if (!playerNode || !pl || tData.jiaoFenPlayer == null)
        return;
    var jiaoFenTagNode = playerNode.getChildByName("jiaoFenTag");
    if (typeof(pl.jiaoFen) != "undefined" && pl.jiaoFen != 0) {
        jiaoFenTagNode.setVisible(true);
        cc.log("pl.jiaoFenpl.jiaoFen:"+pl.jiaoFen)
        if (pl.jiaoFen == -1)
            jiaoFenTagNode.loadTexture("playing/sanDaEr/jiaoFen_action/bujiao.png");
        // else if (pl.isPaiFen)
        //     jiaoFenTagNode.loadTexture("playing/sanDaEr/jiaoFen_action/pai" + pl.jiaoFen + ".png");
        else
            jiaoFenTagNode.loadTexture("playing/sanDaEr/jiaoFen_action/" + pl.jiaoFen + "fen.png");
    }

    // if (off == getOffByIndex(tData.curPlayer) && tData.tState == TableState.waitJiaoFen)
    // {
    //     jiaoFenTagNode.setVisible(false);
    // }


}

// 隐藏各玩家叫分
PlayLayer_XinZhouSanDaEr.prototype.hideJiaoFenTag = function() {
    cc.log("hideJiaoFenTag");

    var tData = MjClient.data.sData.tData;
    for (var off = 0; off < 5; off++) {
        var playerNode = getNode_cards(off);
        var pl = getUIPlayer(off);
        var jiaoFenTagNode = playerNode.getChildByName("jiaoFenTag")
        if (!playerNode || !pl || !jiaoFenTagNode.isVisible())
            continue;

        jiaoFenTagNode.runAction(cc.sequence(cc.delayTime(2), cc.callFunc(function() {
            this.setVisible(false);
        }, jiaoFenTagNode)));
    }
}

// 显示叫分面板
PlayLayer_XinZhouSanDaEr.prototype.showJiaoFenPanel = function() {
    if (MjClient.rePlayVideo != -1)
    {
        MjClient.playui.jsBind.panel.jiaoFenPanel._node.setVisible(false);
        return;
    }

    var tData = MjClient.data.sData.tData;
    var nextMustJiao=tData.mustJiao;
    cc.log("showJiaoFenPanel: tData.tState=" + tData.tState + " tData.curPlayer=" + tData.curPlayer);
    if (tData.tState != TableState.waitJiaoFen || 0 != getOffByIndex(tData.curPlayer))
        return;

    var panel = MjClient.playui.jsBind.panel;
    panel.touchLayer._node.setTouchEnabled(true);

    var jiaoFenPanel = panel.jiaoFenPanel._node;
    jiaoFenPanel.setVisible(true);
    var btnBuJiao = jiaoFenPanel.getChildByName("Btn_buJiao");
    btnBuJiao.setEnabled(!nextMustJiao)
    var func = function() {
        var min = tData.jiaoFen > 0 ? tData.jiaoFen : 0;
        for (var i = 80; i <= 100; i += 5) {
            var btn = jiaoFenPanel.getChildByName("Btn_" + i);
            btn.setTag(i);
            btn.addTouchEventListener(function(sender, type) {
                if (type != 2)
                    return;
                MjClient.showMsg("确认叫分"+ sender.getTag() + "?", function() {
                    MjClient.gamenet.request("pkroom.handler.tableMsg", {
                        cmd: "c2s_sdhJiaoFen",
                        jiaoFen: sender.getTag()
                    });


                    jiaoFenPanel.setVisible(false);
                    panel.touchLayer._node.setTouchEnabled(false);
                }, function() {}, "1");
            });

            btn.setEnabled(i > min);
        }
    }
    func();

    btnBuJiao.addTouchEventListener(function(sender, type) {
        if (type != 2)
            return;

        MjClient.gamenet.request("pkroom.handler.tableMsg", {
            cmd: "c2s_sdhJiaoFen",
            jiaoFen: -1
        });
        jiaoFenPanel.setVisible(false);
        panel.touchLayer._node.setTouchEnabled(false);
    });
}

// 把底牌添加到手牌中
PlayLayer_XinZhouSanDaEr.prototype.addDiPaiToHand = function() {
    var tData = MjClient.data.sData.tData;
    if (tData.tState != TableState.waitJiaoZhu && tData.tState != TableState.waitMaiPai)
        return;

    var off = getOffByIndex(tData.curPlayer);
    if (tData.diPaiArr.length == 0 || (0 != off && MjClient.rePlayVideo == -1))
        return;
    var dicardNode = [];
    var playerNode = getNode_cards(off);
    var pl = getUIPlayer(off);
    var vcard = pl.mjhand.slice();
    for (var i = 0; i < tData.diPaiArr.length; i++) {
        var card = getNewCard_card(playerNode, "stand", off == 0 ? "mjhand" : "mjhand_replay", tData.diPaiArr[i], off);
        MjClient.playui.setCardSprite_ZhuTag(card);
        card.visible=false;
        vcard.push(tData.diPaiArr[i]);
        dicardNode.push(card)
    }
    pl.mjhand = pl.mjhand.concat(tData.diPaiArr);
    var dipai=tData.diPaiArr.slice();
    MjClient.playui.runAction((cc.sequence(cc.callFunc(function() {
        MjClient.playui.showDiPai(MjClient.playui.diPaiPanel,dipai)
    }),
        cc.DelayTime(1.4),
        cc.callFunc(function() {
            for(var i = 0; i<dicardNode.length; i++)
            {
                if(cc.sys.isObjectValid(dicardNode[i]))
                {
                    dicardNode[i].visible = true;
                }
            }
            MjClient.playui.CardLayoutRestore(playerNode, off)
        })
    )))



    if (off == 0)
    {
        if (tData.tState == TableState.waitJiaoZhu) {
            selectUICards(tData.diPaiArr);
            MjClient.selectCards_card = tData.diPaiArr;
        }
    }

    tData.diPaiArr = [];
}

// 从手牌中移除埋的牌
PlayLayer_XinZhouSanDaEr.prototype.removeMaiPaiFromHand = function() {
    var tData = MjClient.data.sData.tData;
    var off = getOffByIndex(tData.curPlayer);
    if (tData.maiPaiArr.length == 0 || (0 != off && MjClient.rePlayVideo == -1))
        return;

    var playerNode = getNode_cards(off);
    var pl = getUIPlayer(off);
    for (var i = 0; i < tData.maiPaiArr.length; i++) {
        var index = pl.mjhand.indexOf(tData.maiPaiArr[i]);
        if (index != -1)
            pl.mjhand.splice(index, 1);
        RemoveNodeBack(playerNode, off == 0 ? "mjhand" : "mjhand_replay", 1, tData.maiPaiArr[i]);
    }
    MjClient.playui.CardLayoutRestore(playerNode, off);
}

// 显示投降同意选择框
PlayLayer_XinZhouSanDaEr.prototype.showTouXuangDialog = function() {
    if (MjClient.rePlayVideo != -1)
        return;

    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var pl = getUIPlayer(0);
    var zhuangPl = sData.players[tData.uids[tData.zhuang] + ""];
    if (zhuangPl.isAgreeTouXiang != 1 || pl.isAgreeTouXiang == 1 || MjClient.playui.haveNotAgreeTouXiang())
        return;

    if (MjClient.webViewLayer != null) {
        MjClient.webViewLayer.close();
    }

    var dialog = new NewPopMsgView({
        msg: "庄家投降，请确定是否同意",
        yes: function() {
            this.touXuangDialog = null;
            MjClient.gamenet.request("pkroom.handler.tableMsg", {
                cmd: "c2s_sdhTouXiang",
                isAgreeTouXiang: 1,
            });
        },
        no: function() {
            this.touXuangDialog = null;
            MjClient.gamenet.request("pkroom.handler.tableMsg", {
                cmd: "c2s_sdhTouXiang",
                isAgreeTouXiang: 0,
            });
        },
        style: 2,
        param: ""
    });
    MjClient.Scene.addChild(dialog);
    this.touXuangDialog = dialog;
}

// 显示提前结束选择框

PlayLayer_XinZhouSanDaEr.prototype.showTiQianOverDialog = function(info) {
    if (MjClient.rePlayVideo != -1)
        return;
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var pl = getUIPlayer(0);
    var uid = SelfUid();
    if (tData.isAgreeOverList[uid] == 1 || MjClient.playui.haveNotAgreeOver())
        return;
    if(this.tiQianOverDialog && sys.isObjectValid(this.tiQianOverDialog))
        return;

    if (MjClient.webViewLayer != null) {
        MjClient.webViewLayer.close();
    }
    var msg = info;
    var dialog = new NewPopMsgView({
        msg: msg,
        yes: function() {
            this.tiQianOverDialog = null;
            MjClient.gamenet.request("pkroom.handler.tableMsg", {
                cmd: "c2s_TiQianOver",
                isAgreeOver: 1,
            });
        },
        no: function() {
            this.tiQianOverDialog = null;
            MjClient.gamenet.request("pkroom.handler.tableMsg", {
                cmd: "c2s_TiQianOver",
                isAgreeOver: 0,
            });
        },
        style: 1,
        param: ""
    });
    MjClient.Scene.addChild(dialog);
    this.tiQianOverDialog = dialog;
}

// 显示叫主面板
PlayLayer_XinZhouSanDaEr.prototype.showJiaoZhuPanel = function() {
    if (MjClient.rePlayVideo != -1)
    {
        MjClient.playui.jsBind.panel.jiaoZhuPanel._node.setVisible(false);
        return;
    }

    var tData = MjClient.data.sData.tData;
    if (tData.tState != TableState.waitJiaoZhu || 0 != getOffByIndex(tData.curPlayer) || tData.zhuPaiType != -1)
        return;

    var panel = MjClient.playui.jsBind.panel;
    panel.touchLayer._node.setTouchEnabled(true);

    var jiaoZhuPanel = panel.jiaoZhuPanel._node;
    jiaoZhuPanel.setVisible(true);

    var pl = getUIPlayer(0);
    for (var i = 0; i < 5; i++) {
        var btn = jiaoZhuPanel.getChildByName("Btn_" + i);
        var text = btn.getChildByName("text_num");
        if(text)
        {
            text.setString(MjClient.playui.getCardNumByColor_num(pl.mjhand, i));
        }
        btn.setTag(i);
        btn.addTouchEventListener(function(sender, type) {
            if (type != 2)
                return;

            MjClient.gamenet.request("pkroom.handler.tableMsg", {
                cmd: "c2s_sdhJiaoZhu",
                zhuPaiType: sender.getTag()
            });
            jiaoZhuPanel.setVisible(false);
            panel.touchLayer._node.setTouchEnabled(false);
        });
    }
}

// 显示埋牌、投降按扭
PlayLayer_XinZhouSanDaEr.prototype.showMaiPaiBtn = function() {
    var tData = MjClient.data.sData.tData;
    cc.log("showMaiPaiBtn: tData.tState=" + tData.tState + " tData.curPlayer=" + JSON.stringify(tData));

    // var zhuangPl = MjClient.data.sData.players[tData.uids[tData.zhuang] + ""];
    if (tData.tState != TableState.waitMaiPai || 0 != getOffByIndex(tData.curPlayer))
        return;

    var panel = MjClient.playui.jsBind.panel;
    var maiPaiBtn = panel.BtnMaiPai._node;
    // var touXiangBtn = panel.BtnTouXiang._node;

    maiPaiBtn.setVisible(true);
    // touXiangBtn.setVisible(true);

    MjClient.selectCards_card = [];
    MjClient.colloctionCurrentSelcetUIArray = [];
    setCardToNormalPos();

    var func = function(cards) {
        MjClient.gamenet.request("pkroom.handler.tableMsg", {
            cmd: "c2s_sdhMaiPai",
            maiPaiArr: cards,
        });

        MjClient.selectCards_card = [];
        MjClient.colloctionCurrentSelcetUIArray = [];
        maiPaiBtn.setVisible(false);
        // touXiangBtn.setVisible(false);
    }

    // touXiangBtn.addTouchEventListener(function(sender, type) {
    //     if (type != 2)
    //         return;
    //
    //     var that = this;
    //     MjClient.showMsg("你确定要投降吗？", function() {
    //         func([], true);
    //     }, function() {}, "1");
    // });

    maiPaiBtn.addTouchEventListener(function(sender, type) {
        if (type != 2)
            return;

        if (MjClient.selectCards_card.length != 4) {
            return;
        }
        cardsSort_sanDaEr(MjClient.selectCards_card);
        func(MjClient.selectCards_card);
    });

    maiPaiBtn.setEnabled(false);
    maiPaiBtn.runAction(cc.repeatForever(cc.callFunc(function() {
        maiPaiBtn.setEnabled(MjClient.selectCards_card.length == 4);
    })));
}

// 显示上一轮面板
PlayLayer_XinZhouSanDaEr.prototype.showShangYiLunPanel = function(shangYiLunPanel) {
    var tData = MjClient.data.sData.tData;
    if (!tData.putCardsRecord || tData.putCardsRecord.length < 1 || Object.keys(tData.putCardsRecord[0]).length != MjClient.MaxPlayerNum)
        return;

    var records = {};
    if (Object.keys(tData.putCardsRecord[tData.putCardsRecord.length - 1]).length == MjClient.MaxPlayerNum)
        records = tData.putCardsRecord[tData.putCardsRecord.length - 1];
    else
        records = tData.putCardsRecord[tData.putCardsRecord.length - 2];

    shangYiLunPanel.setVisible(true);
    var childrens = shangYiLunPanel.getChildren().slice();
    for (var i = 0; i < childrens.length; i++) {
        if (childrens[i].getName() == "trueCard")
            childrens[i].removeFromParent();
    }

    for (var i = 0; i < 5; i++) {
        var strs = ["downCard", "rightCard", "topCard", "leftCard", "fifthCard"];
        var tempCard = shangYiLunPanel.getChildByName(strs[i]);
        tempCard.setVisible(false);

        var pl = getUIPlayer(i);
        if (!pl) {
            player.setVisible(false);
            continue;
        }
        var cards = records[pl.info.uid + ""];

        var w = tempCard.width * tempCard.scaleX * 2 / 3;
        var x = i % 2 == 0 ? tempCard.x - w * (cards.length - 1) / 2 : tempCard.x;
        if (i == 1)
            x -= w * (cards.length - 1);
        for (var j = 0; j < cards.length; j++) {
            var cardNode = tempCard.clone();
            setCardSprite_card(cardNode, cards[j], true);
            cardNode.x = x;
            x += w;
            cardNode.setName("trueCard");
            cardNode.setVisible(true);
            shangYiLunPanel.addChild(cardNode);
        }
    }
}

// 显示查看底牌面板
PlayLayer_XinZhouSanDaEr.prototype.showDiPaiPanel = function(diPaiPanel) {
    var tData = MjClient.data.sData.tData;
    var cards = tData.diPaiArr;
    if (0 != getOffByIndex(tData.zhuang) || cards.length == 0)
        return;

    diPaiPanel.setVisible(true);
    for (var i = 0; i < cards.length; i++) {
        setCardSprite_card(diPaiPanel.getChildByName("card_" + i), cards[i], true);
    }
}
// 展示底牌
PlayLayer_XinZhouSanDaEr.prototype.showDiPai = function (diPaiPanel,dipai) {

    var tData = MjClient.data.sData.tData;
    if (0 != getOffByIndex(tData.zhuang) || dipai.length == 0)
        return;
    diPaiPanel.setVisible(true);
    for (var i = 0; i < dipai.length; i++) {
        setCardSprite_card(diPaiPanel.getChildByName("card_" + i), dipai[i], true);
    }
    diPaiPanel.runAction(cc.sequence(cc.DelayTime(1),cc.callFunc(function() {this.setVisible(false)},diPaiPanel)))


}

// 显示查牌面板
PlayLayer_XinZhouSanDaEr.prototype.showChaPaiPanel = function(chaPaiPanel) {
    var tData = MjClient.data.sData.tData;
    var records = tData.putCardsRecord;
    if (!records || records.length == 0)
        return;

    var count = 0;
    for (var i = 0; i < records.length; i++) {
        if (Object.keys(records[i]).length != MjClient.MaxPlayerNum)
            break;

        for (var j in records[i]) {
            count += records[i][j].length;
            break;
        }
    }

    chaPaiPanel.setVisible(true);
    for (var i = 0; i < 4; i++) {
        var player = chaPaiPanel.getChildByName("player_" + (i + 1));
        var childrens = player.getChildren().slice();
        for (var j = 0; j < childrens.length; j++) {
            if (childrens[j].name == "trueCard")
                childrens[j].removeFromParent();
        }

        var pl = getUIPlayer(i);
        if (!pl) {
            player.setVisible(false);
            continue;
        }

        player.setVisible(true);
        player.getChildByName("name").setString(getNewName(unescape(pl.info.nickname ), 10));

        var tempCard = player.getChildByName("card");
        tempCard.setVisible(false);
        var w = tempCard.width * tempCard.scaleX;
        var x = tempCard.x;

        var space = w * 2 / 3;
        if ((space + w) * count > player.width)
            space = player.width / count - w;

        for (var j = 0; j < records.length; j++) {
            if (Object.keys(records[j]).length != MjClient.MaxPlayerNum)
                break;

            var cards = records[j][pl.info.uid + ""];
            if (!cards)
                continue;

            for (var k = 0; k < cards.length; k++) {
                var cardNode = tempCard.clone();
                setPKMiniImg(cardNode, cards[k]);
                cardNode.x = x;
                x += w;
                cardNode.name = "trueCard";
                cardNode.setVisible(true);
                player.addChild(cardNode);
            }
            x += space;
        }
    }
}

// 显示得分栏上的具体分牌
PlayLayer_XinZhouSanDaEr.prototype.showScoreCards = function(panel, cards) {
    var childrens = panel.getChildren().slice();
    for (var i = 0; i < childrens.length; i++) {
        if (childrens[i].name == "trueScoreCard")
            childrens[i].removeFromParent();
    }

    var tempCard = panel.getChildByName("scoreCard");
    tempCard.setVisible(false);
    var w = tempCard.width * tempCard.scaleX ;
    var x = tempCard.x;

    for (var i = 0; i < cards.length; i++) {
        var cardNode = tempCard.clone();
        setCardSprite_card(cardNode, cards[i]);
        cardNode.x = x;
        x += w/2;
        cardNode.name = "trueScoreCard";
        cardNode.setVisible(true);
        panel.addChild(cardNode);
    }
}

// 给手牌中的主牌设置角标
PlayLayer_XinZhouSanDaEr.prototype.setCardSprite_ZhuTag = function(node) {
    var tData = MjClient.data.sData.tData;
    var isZhu = this.getCardNumByColor([node.getTag()], 4) == 1;
    if(MjClient.data.sData.tData.areaSelectMode["zhuFuTongDa"] && tData.zhuPaiType == 4)
    {
        var wuZhuSprite=node.getChildByName("sanDaEr_zhuTag");
        if(wuZhuSprite)
        {
            wuZhuSprite.removeFromParent(true);
        }
        return;
    }

    if (!isZhu && (tData.zhuPaiType == null || tData.zhuPaiType == -1))
        return;

    if (!isZhu && this.getCardNumByColor([node.getTag()], tData.zhuPaiType) != 1)
        return;

    var sprite = new cc.Sprite("playing/sanDaEr/zhu.png");
    sprite.setName("sanDaEr_zhuTag");
    sprite.setAnchorPoint(0, 0);
    sprite.setPosition(0, 0);
    node.addChild(sprite);
}

// 计算各牌色数量
PlayLayer_XinZhouSanDaEr.prototype.getCardNumByColor = function(cards, colorIndex) {
    var num = 0;
    var types = [1, 2, 3, 0]
    for (var i = 0; i < cards.length; i++) {
        var value = Math.ceil(cards[i] / 4);
        var type = cards[i] % 4;
        if (cards[i] == 54 || cards[i] == 53 )
        {
            num++;
        }
        else if(value == 2 && MjClient.data.sData.tData.areaSelectMode["twoIsChangZhu"])
        {
            num++
        }
        else if (type == types[colorIndex]) {
            num++;
        }
    }
    return num;
}
PlayLayer_XinZhouSanDaEr.prototype.getCardNumByColor_num = function(cards, colorIndex) {
    var num = 0;
    var types = [1, 2, 3, 0]
    for (var i = 0; i < cards.length; i++) {
        var value = Math.ceil(cards[i] / 4);
        var type = cards[i] % 4;
        if (type == types[colorIndex] && cards[i] != 53 && cards[i] != 54) {
            num++;
        }
    }
    return num;
}

// 清空桌面
PlayLayer_XinZhouSanDaEr.prototype.clearDesk = function() {
    cc.log("clearDesk")
    var nodes = [MjClient.playui._downNode, MjClient.playui._rightNode, MjClient.playui._topNode, MjClient.playui._leftNode, MjClient.playui._fifthNode];
    var tData = MjClient.data.sData.tData;
    var records = tData.putCardsRecord;
    if (records.length == 0)
        return;

    var keys = Object.keys(records[records.length - 1]);
    for (var i = 0; i < nodes.length; i++) {
        var pl = getUIPlayer(i);
        if (pl == null || (keys.length != MjClient.MaxPlayerNum && keys.indexOf(pl.info.uid + "") != -1))
            continue;

        var children = nodes[i].children;
        for (var j = 0; j < children.length; j++) {
            var ni = children[j];
            if (ni.name == "out") {
                ni.removeFromParent(true);
            }
        }
    }
}

PlayLayer_XinZhouSanDaEr.prototype.CardLayoutRestore = function(node, off) {
    cc.log("横向排序 off=" + off);
    if (MjClient.playui.isFaPai) return;
    StopHandCardAnim(node);
    MjClient.playui.horSort(node, off);
};

PlayLayer_XinZhouSanDaEr.prototype.CardLayoutDesk = function(node, cards, off) {
    //if(off != 0) return;
    var children = node.children;
    var initDesk_y = node.getChildByName("deskCard").y;
    for (var i = 0; i < children.length; i++) {
        var ci = children[i];
        if (ci.name == "out")
            ci.y = initDesk_y;
    }

    var outStand = node.getChildByName("deskCard");
    outStand.visible = false;

    var uiOut = [];
    var uiHun = []; //癞子牌在最左边

    for (var i = 0; i < children.length; i++) {
        var ci = children[i];
        if (ci.name != "out")
            continue;

        if (MjClient.data.sData.tData.hunCard == ci.tag)
            uiHun.push(ci);
        else
            uiOut.push(ci);

        if (MjClient.majiang.getCardFen(ci.getTag()))
            ci.setColor(MjClient.grayColor);
    }

    if (uiHun.length + uiOut.length == 0)
        return;

    var sort = function(node) {
        var pointCounts = {};
        var zhuPaiType = MjClient.data.sData.tData.zhuPaiType;
        for (var i = 0; i < node.length; i++) {
            var p = MjClient.majiang.calPoint(node[i].tag, zhuPaiType);
            if (pointCounts[p])
                pointCounts[p]++;
            else
                pointCounts[p] = 1;
        }

        var commonCmp = function(a, b) {
            var c1 = pointCounts[MjClient.majiang.calPoint(a.tag, zhuPaiType)];
            var c2 = pointCounts[MjClient.majiang.calPoint(b.tag, zhuPaiType)];
            if (c1 == c2)
                return MjClient.majiang.cardValueCmp(a.tag, b.tag, zhuPaiType);
            else
                return c1 - c2;
        }

        node.sort(function(a, b) {
            return -commonCmp(a, b);
        });
    }

    sort(uiOut);

    if (uiHun.length > 0) //是否有柰子，有则放在最前面 by sking
    {
        for (var i = 0; i < uiHun.length; i++) {
            uiOut.unshift(uiHun[i]); //向数组开头添加一个元素 unshift
        }
    }

    var cards = [];
    for (var i = 0; i < uiOut.length; i++) {
        cards[i] = uiOut[i].tag;
    }

    var outSize = uiOut[0].getSize();
    var outScale = uiOut[0].scale;

    var cardType = MjClient.majiang.cardsType(cards);
    var width = outSize.width * outScale * 0.4;

    var x = 0;

    var areaWidth = (uiOut.length - 1) * width + outSize.width * outScale;
    if (cardType == MjClient.majiang.CARDTPYE.sandaiyi || cardType == MjClient.majiang.CARDTPYE.sidaier)
        areaWidth += outSize.width * outScale * 1.05;

    switch (off) {
        case 0:
            x = outStand.x - areaWidth / 2 + outSize.width * outScale / 2;
            break;
        case 1:
            x = outStand.x - areaWidth + outSize.width * outScale;
            if (MjClient.rePlayVideo == -1) // 表示正常游戏
            {
                if (uiOut.length >= 7)
                    x += width;
            }
            break;
        case 2:
            x = outStand.x;
            x = outStand.x;
            if (MjClient.rePlayVideo == -1) // 表示正常游戏
            {
                if (uiOut.length >= 6)
                    x -= width * 3;
            }
            break;
        case 3:
            x = outStand.x;
            break;
        case 4:
            x = outStand.x;
            break;
    }

    //设置麻将大小
    for (var i = 0; i < uiOut.length; i++) {
        uiOut[i].x = x;
        uiOut[i].zIndex = i;

        if ((cardType == MjClient.majiang.CARDTPYE.sandaiyi && i == 2) || (cardType == MjClient.majiang.CARDTPYE.sidaier && i == 3))
            x += outSize.width * outScale * 1.05;
        else
            x += width;
    }
    MjClient.initDesk_y = "undefined";

    // 目前最大出牌带标记
    var tData = MjClient.data.sData.tData;
    var roundCards = tData.putCardsRecord[tData.putCardsRecord.length - 1];
    var maxUid = MjClient.majiang.getMaxCardPlayerUid(roundCards, tData);
    cc.log("getMaxCardPlayerUid:roundCards=" + JSON.stringify(roundCards) + " tData.firstPutCardUid=" + tData.firstPutCardUid + " tData.uids=" + tData.uids + " ret=" + maxUid);
    // cc.log("tData.putCardsRecord=" + JSON.stringify(roundCards) );
    // cc.log("off = " , off,  'tData.firstPutCardUid', tData.firstPutCardUid);
    cc.log(maxUid + "==" + getUIPlayer(off).info.uid);
    if (maxUid == getUIPlayer(off).info.uid)
    {
        for (var i = 0; i < MjClient.MaxPlayerNum; i++) {
            var otherNode = getNode_cards(i);
            if (!otherNode || otherNode == node)
                continue;

            var children = otherNode.getChildren();
            for (var j = 0; j < children.length; j++) {
                var ci = children[j];
                if (ci.name != "out")
                    continue;

                ci.removeChildByName("bigTag");
            }
        }

        var sprite = new cc.Sprite("playing/sanDaEr/da.png");
        sprite.setPosition(uiOut[uiOut.length - 1].width - sprite.width / 2, uiOut[uiOut.length - 1].height - sprite.height / 2);
        sprite.setName("bigTag");
        uiOut[uiOut.length - 1].addChild(sprite);
    }
};

//横向摆放《正常》
PlayLayer_XinZhouSanDaEr.prototype.horSort = function(node, off) {
    var pl; //player 信息
    pl = getUIPlayer(off); //获取玩家信息.off 为0 ，就是自己得信息，能看到自己摸牌 by sking
    if (!pl) return;

    var mjhandNum = 0;
    var children = node.children;
    for (var i = 0; i < children.length; i++) {
        var ci = children[i];
        if (ci.name == "mjhand") {
            mjhandNum++;
            if ((typeof MjClient.init_y) == 'undefined') {
                MjClient.init_y = ci.y;
            }

            // var _cardType = ci.getChildByName("cardType");
            // var _smallFlower = _cardType && _cardType.getChildByName("smallFlower");
            // if(_smallFlower)
            // {
            //     _smallFlower.setPosition(22,35)
            // }
        }
    }

    var tempMaJiang = MjClient.majiang; //麻将的各种方法判断，是否可以杠，是否可以吃... by sking
    //up stand 是2种麻将的图。
    var stand = node.getChildByName("stand");
    stand.visible = false;
    var start = stand;

    var upSize = start.getSize();
    var upS = start.scale;
    var uistand = [];
    var uisort = [];
    var uihun = []; //癞子牌在最左边

    for (var i = 0; i < children.length; i++) //children 为 "down" 节点下的字节点
    {
        var ci = children[i];
        if (ci.name == "mjhand") {
            if (!ci.cannotOut)
                ci.setColor(cc.color(255, 255, 255));
            uistand.push(ci);
        } else if (ci.name == "mjhand_replay") {
            uistand.push(ci);
        }
    }

    if (!pl.mjhand || cc.isUndefined(pl.mjhand)) {
        return;
    }


    //排除理牌的牌
    var mjhandCopy = pl.mjhand.concat();
    var copyuistand = uistand.concat();
    for (var i = 0; i < MjClient.colloctionCardsUIArray.length; i++) {
        var colloctionUI = []; //重新排序后
        cc.log("--重新排序后--");
        var _colloctionUICards = MjClient.colloctionCardsUIArray[i].concat();
        for (var j = 0; j < _colloctionUICards.length; j++) {
            for (var k = 0; k < copyuistand.length; k++) {
                if (copyuistand[k].tag == _colloctionUICards[j].tag &&
                    copyuistand[k].getUserData() == _colloctionUICards[j].getUserData()) { //这里保存的有可能是我当前选中的牌，这里应该排除我当前选的牌
                    if (!checkUINodeHave(uisort, copyuistand[k])) {
                        colloctionUI.push(copyuistand[k]); //有可能第二次装的数组还是，前一个值，ui节点是同一个。
                        break;
                    }
                }
            }
        }
        uisort[i] = colloctionUI; //保存理牌数组
        mjhandCopy = getExcludeCards(mjhandCopy, MjClient.colloctionCardsArray[i]);
    }


    //理牌的牌，装进数组 mySortui
    var mySortui = [];
    for (var j = 0; j < uisort.length; j++) {
        var uiss = uisort[j];
        for (var i = 0; i < uiss.length; i++) {
            uiss[i].zIndex = 0;
            cc.log("理牌的牌 = " + uiss[i].tag);
            uiss[i].setColor(cc.color(190, 190, 190));
            mySortui.push(uiss[i]);
        }
    }


    //理牌后剩下其他的牌
    var mjhandPai = tempMaJiang.sortHandCards(mjhandCopy, MjClient.data.sData.tData.zhuPaiType,MjClient.data.sData.tData);

    //移除已选牌的UI
    var newuiStand = [];
    for (var j = 0; j < uistand.length; j++) {
        var bExsit = false;
        for (var i = 0; i < mySortui.length; i++) {
            if (mySortui[i].tag == uistand[j].tag && mySortui[i].getUserData() == uistand[j].getUserData()) {
                if (!checkUINodeHave(newuiStand, uistand[j])) {
                    bExsit = true;
                    break;
                }
            }
        }

        if (!bExsit) {
            newuiStand.push(uistand[j]);
        }
    }
    uistand = newuiStand;



    var myUiStand = []; //重新排序后
    for (var j = 0; j < mjhandPai.length; j++) {
        for (var i = 0; i < uistand.length;) {
            if (uistand[i].tag == mjhandPai[j]) //这张牌，有可能是，理牌里面的牌，也有可能是没理牌的牌
            {
                myUiStand.push(uistand[i]);
                uistand.splice(i, 1);
            } else {
                i++;
            }
        }
    }
    uistand = myUiStand;


    var uiOrder = [mySortui, uistand];
    var orders = []; //重新排序后装到数组里 by sking
    //不需要理牌的手牌
    for (var j = 0; j < uiOrder.length; j++) {
        var uis = uiOrder[j];
        for (var i = 0; i < uis.length; i++) {
            uis[i].zIndex = 0;
            orders.push(uis[i]);
        }
    }

    //设置麻将位置

    if (off == 0 || off == 2 || off == 3) //自己或者对家
    {
        var cardWidth = orders[0] ? orders[0].width * orders[0].scale : 0;
        var screenScale = MjClient.size.width / 1280;
        var areaWidth = MjClient.rePlayVideo == -1 ? MjClient.size.width - screenScale * 20 : MjClient.size.width*2/3;
        var width = (areaWidth - cardWidth) / (orders.length - 1);
        if (width > cardWidth / 2)
            width = cardWidth / 2;

        var startX = MjClient.size.width / 2 - width * (orders.length - 1) / 2;

        if(off == 2 || off == 3){
            width = width*0.7;
            startX = start.x - width * (orders.length - 1) / 2;
        }

        for (var i = 0; i < orders.length; i++) {
            var ci = orders[i];
            ci.x = startX;
            startX += width;
            ci.zIndex = i;
            ci.showWidth = i < orders.length - 1 ? width : cardWidth;
        }
    } else if (off == 1) //右侧的
    {
        for (var i = orders.length - 1; i >= 0; i--) {
            var ci = orders[i];
            //if(ci.name == orders[i - 1].name)
            {
                if (ci.name == "mjhand_replay") {
                    if (i != orders.length - 1) {
                        ci.y = orders[i + 1].y - upSize.width * upS * 0.3 - (27 - orders.length) * 0.3; //调牌的距离的，todo...
                    } else {
                        ci.y = start.y - upSize.width * upS * 0.2 - ((27 - orders.length) * upSize.width * upS * 0.3) / 3;
                    }
                }
            }
        }

        for (var i = 0; i < orders.length; i++) {
            orders[i].zIndex = i;
        }
    } else if (off == 4) //左侧的
    {
        for (var i = 0; i < orders.length; i++) {
            var ci = orders[i];
            //if(ci.name == orders[i - 1].name)
            {
                if (ci.name == "mjhand_replay") {
                    if (i != 0) {
                        ci.y = orders[i - 1].y - upSize.width * upS * 0.3 - (27 - orders.length) * 0.3; //调牌的距离的，todo...
                    } else {
                        ci.y = start.y - upSize.width * upS * 0.2 - ((27 - orders.length) * upSize.width * upS * 0.3) / 3;
                    }

                    ci.zIndex = i;
                }
            }
        }
    }
}

//选朋友界面
PlayLayer_XinZhouSanDaEr.prototype.showChooseFriendPanel = function(node, off) {
    if (MjClient.rePlayVideo != -1)
    {
        MjClient.playui.jsBind.panel.chooseFriendPanel._node.setVisible(false);
        return;
    }
    var tData = MjClient.data.sData.tData;
    if (tData.tState != TableState.waitChooseCard || 0 != getOffByIndex(tData.curPlayer) )
        return;
    var panel = MjClient.playui.jsBind.panel;
    panel.touchLayer._node.setTouchEnabled(true);

    var chooseFriendPanel = panel.chooseFriendPanel._node;
    chooseFriendPanel.setVisible(true);

    var pl = getUIPlayer(0);
    var cardList = [];
    for (var i = 0; i < 18; i++) {//选朋友界面初始化
        var card = chooseFriendPanel.getChildByName("card_" + i);
        var goldBack = card.getChildByName('gold');
        if(goldBack)
        {
            goldBack.removeFromParent(true);
        }
        card.setColor(cc.color(255, 255, 255))
        MjClient.playui.cardTag = 0;
        cardList.push(card);
    }
    for (var i = 0; i < 18; i++) {//渲染牌，添加触摸方法
        var card = chooseFriendPanel.getChildByName("card_" + i);
        
        if(i == 16 || i == 17)
        {
            setCardSprite_card(card,37+i,true)
            card.setTag(37+i);
        }
        else if(i>11 && i< 16)
        {
            setCardSprite_card(card,-11+i,true)
            card.setTag(-11+i);
        }
        else {
            setCardSprite_card(card,41+i,true)
            card.setTag(41+i);
        }
        card.addTouchEventListener(function(sender, type) {

            if (type == ccui.Widget.TOUCH_ENDED)
            {
                for(var i = 0; i < 18; i++)
                {
                    cardList[i].setEnabled(true);
                    cardList[i].setColor(cc.color(255, 255, 255))
                    var cardColor=MjClient.majiang.calColor(cardList[i].getTag(),tData.zhuPaiType)
                    if((cardColor == tData.zhuPaiType) && cardList[i].getTag() != 53 && cardList[i].getTag() != 54 )
                    {
                        cardList[i].setEnabled(false);
                        cardList[i].setColor(cc.color(180, 180, 180))
                    }
                    if(tData.jiaoFen != 100 && (cardList[i].getTag() == 53 || cardList[i].getTag() == 54))
                    {
                        cardList[i].setEnabled(false);
                        cardList[i].setColor(cc.color(180, 180, 180))
                    }
                    var goldBack = cardList[i].getChildByName('gold');
                    if(goldBack)
                    {
                        goldBack.removeFromParent(true);
                    }
                }
                MjClient.playui.setCardTag(sender.getTag());
                var goldColor = new ccui.ImageView();
                goldColor.setName('gold')
                var path = "playing/cardPic2/"
                goldColor.loadTexture(path + "ming_puke.png");
                goldColor.setPosition(goldColor.getContentSize().width/2, goldColor.getContentSize().height/2);
                sender.addChild(goldColor);
                // sender.setColor(cc.color(180, 180, 180))
                sender.setEnabled(false);
            }
        });
    }
    for (var i = 0; i < 18; i++) {//根据规则置灰
        var cardColor=MjClient.majiang.calColor(cardList[i].getTag(),tData.zhuPaiType)
        if((cardColor == tData.zhuPaiType) && cardList[i].getTag() != 53 && cardList[i].getTag() != 54 )
        {
            cardList[i].setEnabled(false);
            cardList[i].setColor(cc.color(180, 180, 180))

        }
        if(tData.jiaoFen != 100 && (cardList[i].getTag() == 53 || cardList[i].getTag() == 54))
        {
            cardList[i].setEnabled(false);
            cardList[i].setColor(cc.color(180, 180, 180))
        }

    }


    var confirm = chooseFriendPanel.getChildByName("confirm");
    confirm.addTouchEventListener(function(sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED)
        {
            // sender.scale=0.4;
            if(!MjClient.playui.getCardTag())
            {
                return;
            }
            MjClient.gamenet.request("pkroom.handler.tableMsg", {
                cmd: "c2s_sdhChooseCard",
                card: MjClient.playui.getCardTag()
            });
            chooseFriendPanel.setVisible(false);
            panel.touchLayer._node.setTouchEnabled(false);
        }
    })
}


PlayLayer_XinZhouSanDaEr.prototype.showPostCardAnimation = function() {
    var  isHaveRes = jsb.fileUtils.isFileExist('playing/shaoyangOptimize/PAIBEI.png');
    if (isHaveRes && MjClient.rePlayVideo == -1) {
        // 先设置自己发牌的动画
        // 获取所有的牌
        var node = getNode(0);
        var children = node.children;

        // 对牌进行x的位置关系进行排序
        children.sort(function(n1, n2) {
            if (n1.x > n2.x) return -1;
            else return 1;
        });

        // 剔除不是牌的child
        children = children.filter(function(node) {
            return node.isPKImg;
        });

        postCardsToMe(children);

        // 给其他玩家发牌动画
        for (var i = 0; i != 5; i++) {
            if (getNode_cards(i).visible) {
                postCardsToOther(i);
            }
        }
    }
    var faPaiEffectFunc = function (times) {
        if(times < 0 ) return;
        MjClient.playui.runAction(cc.sequence(cc.DelayTime(times),cc.callFunc(function(){
            playEffectInPlay("fapai");
        })));
        times -= 0.4;
        faPaiEffectFunc(times);


    };
    faPaiEffectFunc(0.4);
}

PlayLayer_XinZhouSanDaEr.prototype.setCardTag = function (tag) {
    MjClient.playui.cardTag = tag;
}

PlayLayer_XinZhouSanDaEr.prototype.getCardTag = function () {
    return MjClient.playui.cardTag;
}

//选主牌动画
PlayLayer_XinZhouSanDaEr.prototype.zhuPaifly = function (node) {
    if(!node)
    {
        return;
    }
    var tData = MjClient.data.sData.tData;
    var size = cc.director.getWinSize();
    var startPoint = node.getParent().convertToNodeSpace(cc.p(size.width/2,size.height/2))
    var finalPoint = node.getPosition();
    var strs = ["fangkuai.png", "meihua.png", "hongtao.png", "heitao.png"];
    if(tData.zhuPaiType != -1 && tData.zhuPaiType != 4)
    {
        node.visible = true;
        node.loadTexture("playing/sanDaEr/flower/" + strs[tData.zhuPaiType]);
    }
    node.scale=2;
    node.setPosition(startPoint);
    node.stopAllActions();
    node.runAction(cc.sequence(cc.DelayTime(0.5),cc.spawn(cc.moveTo(1,finalPoint),cc.scaleTo(1,1)).easing(cc.easeQuinticActionOut())))
}
//显示玩家庄的ui
PlayLayer_XinZhouSanDaEr.prototype.showUserZhuangLogo = function(node, off ,needFly)
{
    var tData = MjClient.data.sData.tData;
    var pl = getUIPlayer(off);
    node.zIndex = 100;
    var zhuafen=node.getParent().getChildByName('zhuafen')
    var num_zhuafen=node.getParent().getChildByName('num_zhuafen')
    if(tData && pl)
    {
        if(tData.uids[tData.zhuang] == pl.info.uid)
        {
            // node.visible = true;
            node.loadTexture("playing/sanDaEr/zhuang.png");
            if(needFly == true)
            {
                MjClient.playui.zhuangFly(MjClient.playui.zhuangFlyImg,off);
                node.runAction(cc.sequence(cc.delayTime(1.4),cc.callFunc(function() {
                    node.visible=true;
                })))
            }
            else {
                node.visible=true;
            }
            if(off!=0)
            {
                zhuafen.setVisible(false);
                num_zhuafen.setVisible(false);
            }
            else {
                MjClient.playui.num_zhuafen.setVisible(false)
            }
        }
        else if(tData.uids[tData.zhuangFriend] == pl.info.uid){
            node.visible = true;
            node.loadTexture("playing/sanDaEr/fu.png");
            if(off!=0)
            {
                zhuafen.setVisible(false);
                num_zhuafen.setVisible(false);
            }
            else {
                MjClient.playui.num_zhuafen.setVisible(false);
            }
        }
        else
        {
            if(off!=0)
            {
                zhuafen.setVisible(true);
                num_zhuafen.setVisible(true);
            }
            node.visible = false;

        }
    }
}
PlayLayer_XinZhouSanDaEr.prototype.showUserZhuaFen_sanDaEr = function (node, off)
{
    var tData = MjClient.data.sData.tData;
    var pl = getUIPlayer(off);
    if(!pl) return;
    var zhuafen=node.getParent().getChildByName('zhuafen');

    if(off == 0)
    {
        var pl_self = getNode_cards(0);
        var coin = pl_self.getChildByName('head').getChildByName('coin');
    }

    if(tData.playerScore && tData.playerScore[pl.info.uid] >= 0){
        if(off != 0)
        {
            if(tData.uids[tData.zhuang] != pl.info.uid)
                zhuafen.visible=true;
        }
        if(off == 0)
        {
            coin.visible=false;
        }
        node.setString("抓分 " + tData.playerScore[pl.info.uid]);

    }
    else{
        if(off == 0)
        {
            node.setString("抓分 0" );
            coin.visible=true;
        }
        else
        {
            zhuafen.visible=false;
            node.setString("");
        }
    }
}
PlayLayer_XinZhouSanDaEr.prototype.DealCardPromp_sanDaEr=function(uid, off)
{
    var tData = MjClient.data.sData.tData;
    if(!tData.putCardsRecord){
        return;
    }
    var pl = getUIPlayer(off);
    var roundPutCards = tData.putCardsRecord[tData.putCardsRecord.length - 1];
    cc.log('roundPutCardsroundPutCards:'+roundPutCards)
    if(!pl || pl.info.uid != uid || !roundPutCards || typeof roundPutCards == 'undefined' || !roundPutCards[pl.info.uid]) {
        return;
    }
    //是否是调主
    var isdiaozhu = MjClient.majiang.isAllZhuCard(roundPutCards[tData.firstPutCardUid], tData.zhuPaiType,tData.areaSelectMode["twoIsChangZhu"]);

    //首出
    if(pl.info.uid == tData.firstPutCardUid){
    }
    else{//接牌
        var maxCardUid = MjClient.majiang.getMaxCardPlayerUid(roundPutCards, tData);
        if(pl.info.uid == maxCardUid){
            if(!isdiaozhu && MjClient.majiang.isAllZhuCard(roundPutCards[pl.info.uid], tData.zhuPaiType)){//打出主牌
                playEffectInPlay("shapai");
            }else{
                    playEffectInPlay("dazhu");
            }
        }else{//垫牌
                playEffectInPlay("dianpai");
        }
    }
}
PlayLayer_XinZhouSanDaEr.prototype.updateWifiState=function(node)
{
    var callback = function()
    {
        var ms = MjClient.reqPingPong / 1000.0;
        if(ms < 0.3)
        {
            node.loadTexture("playing/sanDaEr/info/WIFI1-fs8.png");
        } else if(ms < 0.6)
        {
            node.loadTexture("playing/sanDaEr/info/WIFI2-fs8.png");
        }
        else
        {
            node.loadTexture("playing/sanDaEr/info/WIFI3-fs8.png");
        }
    };

    node.runAction(cc.repeatForever(cc.sequence(cc.callFunc(callback), cc.delayTime(5))));
}
PlayLayer_XinZhouSanDaEr.prototype.zhuangFly=function(node,off)
{
    var tData = MjClient.data.sData.tData;
    var pl = getUIPlayer(off);
    if (tData && pl) {
        node.visible = true;
        var pl_head = getNode_cards(off);
        var startPoint = node.getPosition();
        var finalPoint = pl_head.getChildByName('head').getPosition();
        node.runAction(cc.sequence(cc.delayTime(1),
            cc.moveTo(0.4, finalPoint).easing(cc.easeQuinticActionOut()),
            cc.spawn(cc.callFunc(function () {
                    var piaoFenBoom = new cc.ParticleSystem('animate/piaofenBoom.plist');
                    piaoFenBoom.setPosition(finalPoint);
                    piaoFenBoom.setScale(0.5);
                    MjClient.playui.addChild(piaoFenBoom);
                    MjClient.playui.scheduleOnce(function () {
                        piaoFenBoom.removeFromParent(true);
                    }, 0.5)
                }),
                cc.callFunc(function () {
                    node.visible = false;
                    node.setPosition(startPoint);
                })
            )
        ))
    }
}
//飘分动画
PlayLayer_XinZhouSanDaEr.prototype.moveFen= function(node,off){
    if(off == -1) return;
    if(MjClient.rePlayVideo != -1) return;

    var index = getOffByIndex(off);
    var pl = getNode_cards(index);
    if(pl)
    {
        var playerHeadPosition=pl.getChildByName('head').getPosition();
        var zhuafen;
        if(index==0)
        {
            zhuafen=MjClient.playui.num_zhuafen;
        }
        else {
            zhuafen=pl.getChildByName('head').getChildByName('num_zhuafen');
        }
        var piaoFen=node.clone();
        MjClient.playui.addChild(piaoFen);
        piaoFen.runAction(cc.sequence(
            cc.moveTo(0.6,playerHeadPosition).easing(cc.easeQuinticActionOut()),
            cc.spawn( cc.callFunc(function() {
                    var piaoFenBoom=new cc.ParticleSystem('animate/piaofenBoom.plist');
                    piaoFenBoom.setPosition(playerHeadPosition);
                    piaoFenBoom.setScale(0.5);
                    MjClient.playui.addChild(piaoFenBoom);
                    MjClient.playui.scheduleOnce(function () {
                        piaoFenBoom.removeFromParent(true);
                    },1)
                }),
                zhuafen.runAction(cc.sequence(cc.scaleTo(0.4,2),cc.scaleTo(0.4,0.35)))
            ),
            cc.callFunc(function() {
                piaoFen.removeFromParent(true);
            })
        ));
    }
}