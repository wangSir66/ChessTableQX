var actionZindex = 1000;

// off 是四个位置，根据off 显示四个位置的信息 by sking
function SetUserVisible_RunFasterYA(node, off) {
    var pl = getUIPlayer(off);
    var head = node.getChildByName("head");
    var name = head.getChildByName("name");
    var nobody = head.getChildByName("nobody");
    var coin = head.getChildByName("coin");
    var offline = head.getChildByName("offline");
    var name_bg = head.getChildByName("name_bg");
    var score_bg = head.getChildByName("score_bg");

    if (pl) {
        name.visible = true;
        coin.visible = true;
        offline.visible = true;
        coin.visible = true;
        // name_bg.visible = true;
        // score_bg.visible = true;
        MjClient.loadWxHead(pl.info.uid, pl.info.headimgurl);
        setUserOffline(node, off);
        InitUserHandUI_RunFasterYA(node, off);
    }
    else {
        name.visible = false;
        coin.visible = false;
        offline.visible = false;
        coin.visible = false;
        var WxHead = nobody.getChildByName("WxHead");
        if (WxHead)
            WxHead.removeFromParent(true);
    }
}


function InitUserHandUI_RunFasterYA(node, off, needSort) {
    if (cc.isUndefined(needSort))
        needSort = true;

    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var pl = getUIPlayer(off);

    if (!pl) {
        return;
    }

    //初始化玩家金币和名称
    InitUserCoinAndName(node, off);
    currentLeftCardCount_paodekuai(off);

    initSortUI();

    if (
        tData.tState != TableState.waitPut &&
        tData.tState != TableState.waitEat &&
        tData.tState != TableState.waitCard
    ) {
        return;
    }

    //添加手牌
    if (MjClient.rePlayVideo == -1)// 表示正常游戏
    {
        if (pl.mjhand && off == 0) {//只初始化自己的手牌
            var vcard = [];
            for (var i = 0; i < pl.mjhand.length; i++) {
                var card = getNewCard_card(node, "stand", "mjhand", pl.mjhand[i], off);
                var index = vcard.indexOf(pl.mjhand[i]);//区分2张一样的牌
                if (index >= 0) {
                    card.setUserData(1);
                }
                else {
                    card.setUserData(0);
                }
                vcard.push(pl.mjhand[i]);
            }

            if (tData.areaSelectMode.FirstGroundHideCards && tData.lastPutPlayer == -1 && tData.curPlayer != getPlayerIndex(0)) {
                MjClient.playui.isShowHandCardBeiMain = true;
                MjClient.playui.showHandCardBeiMian();
            }
        }
        else if (off > 0) {

        }
    }
    else {
        /*
            播放录像
        */
        if (pl.mjhand) {
            if (off == 0) {
                for (var i = 0; i < pl.mjhand.length; i++) {
                    getNewCard_card(node, "stand", "mjhand", pl.mjhand[i], off);
                }
            }
            else {
                for (var i = 0; i < pl.mjhand.length; i++) {
                    getNewCard_card(node, "stand", "mjhand_replay", pl.mjhand[i], off);
                }
            }
        }
    }

    MjClient.playui.CardLayoutRestore(node, off, needSort);
}

function cardsSort_RunFasterYA(cards) {
    var pointCounts = {};
    for (var i = 0; i < cards.length; i++) {
        var p = MjClient.majiang.calPoint(cards[i]);
        if (pointCounts[p])
            pointCounts[p]++;
        else
            pointCounts[p] = 1;
    }

    var commonCmp = function (a, b) {
        var c1 = pointCounts[MjClient.majiang.calPoint(a)];
        var c2 = pointCounts[MjClient.majiang.calPoint(b)];
        if (c1 == c2)
            return MjClient.majiang.cardValueCmp(a, b);
        else
            return c1 - c2;
    }

    cards.sort(function (a, b) { return -commonCmp(a, b); });
}

var PlayLayer_NewRunFaster = cc.Layer.extend({
    _btnPutCard: null,
    jsBind: {
        _run: function () {
            if (MjClient.playui._spriteSingle) {
                setWgtLayout(MjClient.playui._spriteSingle, [MjClient.playui._spriteSingle.width / 1280, MjClient.playui._spriteSingle.height / 720], [0.4, 0.18], [0, 0]);
            }
        },
        _event: {
            mjhand: function () {
                if (MjClient.endoneui != null) {
                    MjClient.endoneui.unscheduleAllCallbacks();
                    MjClient.endoneui.removeFromParent(true);
                    MjClient.endoneui = null;
                }

                var sData = MjClient.data.sData;
                var tData = sData.tData;
                // resetFlowerNum(this);
                // resetJiaZhuNum(this);
                if (tData.roundNum != tData.roundAll) return;
                var pls = sData.players;
                var ip2pl = {};
                for (var uid in pls) {
                    var pi = pls[uid];
                    var ip = pi.info.remoteIP;
                    if (ip) {
                        if (!ip2pl[ip]) ip2pl[ip] = [];
                        ip2pl[ip].push(unescape(pi.info.nickname));
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
            changePosition: function (msg) {
                /*
                   换位置
              */
                var currentSelectCard = msg.selectedCard;
                var change_uids = msg.uids;
                var sData = MjClient.data.sData;
                var tData = sData.tData;
                var current_uids = tData.uids;

                cc.log("changePosition change_uids = " + JSON.stringify(change_uids));
                cc.log("changePosition current_uids = " + JSON.stringify(current_uids));


                //初始化手牌张数
                if (msg.handCounts) {
                    var sData = MjClient.data.sData;
                    for (var uid in msg.handCounts) {
                        var pl = sData.players[uid];
                        pl.handCount = msg.handCounts[uid];
                        //cc.log("初始化手牌张数 .handCount =" + pl.handCount);
                    }
                }

                for (var i = 0; i < MjClient.MaxPlayerNum; i++) {
                    currentLeftCardCount_paodekuai(i);
                }

                //回放的时候
                if (MjClient.rePlayVideo != -1) {
                    tData.uids = msg.uids;//要更新uid位置
                    resetPlayerHead();
                    MjClient.playui._positionCard.visible = false;
                }
                else {
                    //牌的翻的效果,正常打牌
                    cardRollAction(currentSelectCard, function () {

                        var _toNodePos = [];
                        for (var i = 0; i < change_uids.length; i++) {
                            var _toNode = getNode_cards(i).getChildByName("head");
                            _toNodePos.push(_toNode.getPosition());
                        }

                        for (var i = 0; i < change_uids.length; i++) {

                            var change_UIoff = card_getUiOffByUid(change_uids[i], change_uids);

                            var current_UIoff = card_getUiOffByUid(change_uids[i], current_uids);

                            if (change_UIoff != current_UIoff) {
                                changePositionByUIoff(current_UIoff, _toNodePos[change_UIoff]);
                            }
                        }
                        tData.uids = msg.uids;//要更新uid位置
                        MjClient.playui.runAction(cc.sequence(cc.delayTime(0.3), cc.callFunc(function () {
                            resetPlayerHead();
                        })));
                    });
                }
            },
            LeaveGame: function () {
                MjClient.addHomeView();
                MjClient.playui.removeFromParent(true);
                delete MjClient.playui;
                delete MjClient.endoneui;
                delete MjClient.endallui;
                cc.audioEngine.stopAllEffects();
                playMusic("bgMain");
            },
            showEndRoom: function (msg) {
                this.addChild(new GameOverLayer(), 500);
                if (MjClient.endoneui != null) {
                    MjClient.endoneui.unscheduleAllCallbacks();
                    MjClient.endoneui.removeFromParent(true);
                    MjClient.endoneui = null;
                }
            },
            endRoom: function (msg) {
                mylog(JSON.stringify(msg));
                if (!msg.showEnd) MjClient.Scene.addChild(new StopRoomView());
                else postEvent("showEndRoom");
            },
            roundEnd: function () {
                MjClient.selectTipCardsArray = null;

                var self = this;
                function delayExe() {
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    //resetEatActionAnim();
                    if (sData.tData.roundNum <= 0) {
                        if (tData.matchId) {
                            self.runAction(cc.sequence(cc.delayTime(3), cc.callFunc(function () {
                                self.addChild(new GameOverLayer(), 500);
                            })))
                        }
                    }
                    self.addChild(new EndOneView_RunFasterYA(), 500);
                }
                this.runAction(cc.sequence(cc.DelayTime(0.2), cc.callFunc(delayExe)));
            },
            moveHead: function () {
                postEvent("returnPlayerLayer");
                //tableStartHeadMoveAction_card(this);

                reConectHeadLayout_card(this);
                sendGPS();
                MjClient.checkChangeLocationApp();
            },
            initSceneData: function () {
                //初始化桌子的客户端数据
                MjClient.playui.InitC_Data();

                reConectHeadLayout_card(this);
                CheckRoomUiDelete();
                var sData = MjClient.data.sData;
                var tData = sData.tData;
                if (tData.tState == TableState.waitPut) {
                    UpdataCurrentPutCard();
                }

                for (var i = 0; i < MjClient.MaxPlayerNum; i++) {
                    currentLeftCardCount_paodekuai(i);
                }
                if (IsTurnToMe()) {
                    // 如果提示只有一手牌， 自动提起
                    // 如果提示只有一手牌， 且是我全部的手牌数量， 自动打出
                    AutoPutLastCard_card_ty();
                }
            },
            onlinePlayer: function () {
                // reConectHeadLayout_card(this);
            },
            logout: function () {
                if (MjClient.playui) {
                    MjClient.addHomeView();
                    MjClient.playui.removeFromParent(true);
                    delete MjClient.playui;
                    delete MjClient.endoneui;
                    delete MjClient.endallui;
                }
            },
            DelRoom: function () {
                CheckRoomUiDelete();
            },
            changePKImgEvent: function () {
                changePKImg(this, getCurrentPKImgType());
            },
            beTrust: function (msg) {//{uid: pl.uid};
                var sData = MjClient.data.sData;
                var pl = sData.players[msg.uid];
                if (pl) {
                    pl.trust = true;
                }
            },
            cancelTrust: function (msg) {
                var sData = MjClient.data.sData;
                var pl = sData.players[msg.uid];
                if (pl) {
                    pl.trust = false;
                }
            },
            clearCardUI: function (eD) {
                if (MjClient.playui._spriteSingle) {
                    MjClient.playui._spriteSingle.visible = false;
                }
            },
            PKPut: function (eD) {
                MjClient.clockNode.visible = false;
            },
            PKPass: function (eD) {
                MjClient.clockNode.visible = false;
            },
        },
        back: {
            back: {
                _run: function () {
                    // changeGameBg(this);

                    //     var text = new ccui.Text();
                    //     text.setFontName(MjClient.fzcyfont);
                    //     text.setFontSize(20);
                    //     text.setAnchorPoint(0,0.5);
                    //     text.setPosition(23.5, this.height - 20.5);
                    //     this.addChild(text);
                    //     text.schedule(function(){
                    //         var time = MjClient.getCurrentTime();
                    //         var str = time[0]+"/"+time[1]+"/"+ time[2]+" "+
                    //             (time[3]<10?"0"+time[3]:time[3])+":"+
                    //             (time[4]<10?"0"+time[4]:time[4])+":"+
                    //             (time[5]<10?"0"+time[5]:time[5]);
                    //         this.setString(str);
                    //     });
                },
                _event: {
                    // changeGameBgEvent: function () {
                    //     changeGameBg(this);
                    // }
                },
                _layout: [
                    [1, 1],
                    [0.5, 0.5],
                    [0, 0], true
                ],
            },
        },
        info:
        {
            _layout: [
                [0.16, 0.16],
                [0.01, 0.935],
                [0, 0]
            ]
        },
        gameName: {
            _run: function () {
                setWgtLayout(this, [0.12, 0.06], [0.5, 0.6], [0, 0]);
            }
        },
        roundInfo: {
            _run: function () {
                setWgtLayout(this, [0.3, 0.3], [0.5, 0.52], [0.05, 1.2]);

                var tData = MjClient.data.sData.tData;
                var str = MjClient.playui.getGameInfoString();
                this.setString(str);
                // this.ignoreContentAdaptWithSize(true);

                if (tData.matchId && tData.matchInfo) {
                    if (MjClient.matchRank) {
                        showPlayUI_matchInfo("排名：" + MjClient.matchRank + "/" + tData.matchInfo.userCount + "\n前" + tData.matchInfo.jingjiCount + "名晋级");
                    } else {
                        showPlayUI_matchInfo("排名：" + tData.matchInfo.userCount + "/" + tData.matchInfo.userCount + "\n前" + tData.matchInfo.jingjiCount + "名晋级");
                    }
                }
            },
            _event: {
                mjhand: function () {
                    var tData = MjClient.data.sData.tData;
                    var str = MjClient.playui.getGameInfoString();
                    this.setString(str);
                },
            }
        },
        wait: {
            _layout: [
                [1, 1],
                [0, 0],
                [0, 0]
            ],
            backHomebtn: {
                _layout: [
                    [0.1, 0.1],
                    [0, 0],
                    [0, 0]
                ]
            },
            delroom: {
                _layout: [
                    [0.1, 0.1],
                    [0, 0],
                    [0, 0]
                ]
            },
        },
        banner: {
            _layout: [
                [1, 1],
                [0, 0.95],
                [0, 0]
            ],
            goldBg: {
                _visible: false,
                _run: function () {
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    if (tData && tData.areaSelectMode) {
                        this.visible = !!tData.clubId && MjClient.rePlayVideo == -1;
                    } else this.visible = false;
                },
                tableid: {
                    _event: {
                        initSceneData: function () {
                            if (MjClient.rePlayVideo != -1) return;
                            let pl = getUIPlayer(0);
                            if (pl && pl.info.honorVal) {
                                this.visible = true;
                                this.setString(pl.info.honorVal.honorVal + '');
                            }
                        },
                        roundEnd: function () {
                            if (MjClient.rePlayVideo != -1) return;
                            let pl = getUIPlayer(0);
                            if (pl && pl.info.honorVal) {
                                this.visible = true;
                                this.setString(pl.info.honorVal.honorVal + '');
                            }
                        },
                        changeHonorVal: function () {
                            if (MjClient.rePlayVideo != -1) return;
                            let pl = getUIPlayer(0);
                            if (pl && pl.info.honorVal) {
                                this.visible = true;
                                this.setString(pl.info.honorVal.honorVal + '');
                            }
                        }
                    }
                }
            },
            bg_time: {
                _run: function () {
                    var text = new ccui.Text();
                    text.setFontName("fonts/lanting.TTF");
                    text.setFontSize(24);
                    text.setTextColor(cc.color("#FFF9C8"));
                    text.setAnchorPoint(0.5, 0.5);
                    text.setPosition(this.getContentSize().width / 2, this.getContentSize().height / 2);
                    this.addChild(text);
                    text.schedule(function () {

                        var time = MjClient.getCurrentTime();
                        var str = (time[3] < 10 ? "0" + time[3] : time[3]) + ":" +
                            (time[4] < 10 ? "0" + time[4] : time[4]);
                        this.setString(str);
                    });
                }

            },
            wifi: {
                _run: function () {
                    updateWifiState_new(this);
                }
            },
            roundnumAtlas: {
                _run: function () {
                    this.ignoreContentAdaptWithSize(true);
                },
                _text: function () {
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    if (tData) return "局数：" + (tData.roundAll - tData.roundNum + 1) + "/" + tData.roundAll;
                },
                _event: {
                    mjhand: function () {
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;
                        if (tData) return this.setString("局数：" + (tData.roundAll - tData.roundNum + 1) + "/" + tData.roundAll);
                    },
                    initSceneData: function () {
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;
                        if (tData) return this.setString("局数：" + (tData.roundAll - tData.roundNum + 1) + "/" + tData.roundAll);
                    },
                }
            },
            powerBar: {
                _run: function () {
                    //cc.log("powerBar_run");
                    updateBattery(this);
                },
                _event: {
                    nativePower: function (d) {
                        this.setPercent(Number(d));
                    }
                }
            },
            tableid: {
                _run: function () {
                    this.ignoreContentAdaptWithSize(true);
                },
                _event: {
                    initSceneData: function () {
                        this.ignoreContentAdaptWithSize(true);
                        this.setString("房间号：" + MjClient.data.sData.tData.tableid);
                    }
                }
            },
            gps_btn: {
                _visible: false,
                // _run: function () {
                //     setWgtLayout(this, [0.12, 0.12], [1, 0.05], [1.5, 0]);
                //     this.setVisible((MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP || MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ) && MjClient.MaxPlayerNum != 2);
                //     var banner = this.parent;
                //     var waitNode = MjClient.playui.getChildByName("playUINode").getChildByName("wait");
                //     var delroom = waitNode.getChildByName("delroom");
                //     var backHomebtn = waitNode.getChildByName("backHomebtn");
                //     var distanceX = banner.getChildByName("setting").getPositionX() - banner.getChildByName("changeBg").getPositionX();

                //     delroom.setScale(banner.scaleX, banner.scaleY);
                //     backHomebtn.setScale(banner.scaleX, banner.scaleY);

                //     if (this.isVisible()) {
                //         delroom.setPosition(waitNode.convertToNodeSpace(banner.convertToWorldSpace(cc.p(this.getPositionX() - distanceX, this.getPositionY()))))
                //         backHomebtn.setPosition(waitNode.convertToNodeSpace(banner.convertToWorldSpace(cc.p(this.getPositionX() - 2 * distanceX, this.getPositionY()))))
                //     }
                //     else {
                //         delroom.setPosition(waitNode.convertToNodeSpace(banner.convertToWorldSpace(this.getPosition())))
                //         backHomebtn.setPosition(waitNode.convertToNodeSpace(banner.convertToWorldSpace(cc.p(this.getPositionX() - distanceX, this.getPositionY()))))
                //     }
                // },
                // _click: function () {
                //     if (MjClient.MaxPlayerNum == 3) {
                //         MjClient.Scene.addChild(new showDistance3PlayerLayer());
                //     } else if (MjClient.MaxPlayerNum == 4) {
                //         MjClient.Scene.addChild(new showDistanceLayer());
                //     }
                //     MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Dingwei", { uid: SelfUid(), gameType: MjClient.gameType });
                // }
            },
            changeBg: {
                _visible: false,
                // _click: function () {
                //     setCurrentGameBgTypeToNext();
                //     postEvent("changeGameBgEvent");
                //     MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Pifu", { uid: SelfUid(), gameType: MjClient.gameType });
                // },
                // _run: function () {
                //     setWgtLayout(this, [0.12, 0.12], [0.85, 0.05], [0, 0]);
                // }
            },
            Button_1: {
                _visible: false,
                _click: function () {
                    MjClient.openWeb({ url: MjClient.GAME_TYPE.SI_CHUAN_NEW_RUNFASTER, help: true });
                }
            },
        },
        setting: {
            _layout: [
                [0.08, 0.08],
                [0.97, 0.94],
                [0, 0]
            ],
            _click: function () {
                var settringLayer = new RoomSettingView();
                MjClient.Scene.addChild(settringLayer);
                MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Shezhi", { uid: SelfUid(), gameType: MjClient.gameType });
            },
        },
        rule_btn: {
            _layout: [
                [0.08, 0.08],
                [0.9, 0.94],
                [0, 0]
            ],
            _visible: true,
            _click: function () {
                MjClient.showRuleView = new GameRule_YARunFaster();
                MjClient.Scene.addChild(MjClient.showRuleView);
            },
            _run: function () {
                setTimeout(() => {
                    var banner = this.parent, sc = this.getScale();
                    var waitNode = MjClient.playui.getChildByName("playUINode").getChildByName("wait");
                    var delroom = waitNode.getChildByName("delroom");
                    var backHomebtn = waitNode.getChildByName("backHomebtn");
                    var distanceX = banner.getChildByName("setting").getPositionX() - banner.getChildByName("rule_btn").getPositionX();
                    delroom.setPosition(waitNode.convertToNodeSpace(banner.convertToWorldSpace(cc.p(this.getPositionX() - distanceX, this.getPositionY()))));
                    backHomebtn.setPosition(waitNode.convertToNodeSpace(banner.convertToWorldSpace(cc.p(this.getPositionX() - 2 * distanceX, this.getPositionY()))));
                    delroom.setScale(sc);
                    backHomebtn.setScale(sc);
                }, 500);
            }
        },
        BtnHimt: { //add by  sking for put card button
            _run: function () {
                this.visible = false;
                if (MjClient.data.sData.tData.areaSelectMode.mustPut)// MjClient.data.sData.tData.areaSelectMode.mustPut)
                {
                    if (isIPhoneX())
                        setWgtLayout(this, [0.15, 0.14], [0.52, 0.43], [-0.8, 0.26]);
                    else
                        setWgtLayout(this, [0.15, 0.14], [0.52, 0.36], [-0.8, 0.26]);
                }
                else {
                    if (isIPhoneX())
                        setWgtLayout(this, [0.15, 0.14], [0.52, 0.43], [0, 0.26]);
                    else
                        setWgtLayout(this, [0.15, 0.14], [0.52, 0.36], [0, 0.26]);
                }
                // setWgtLayout(this,[0.135, 0.128], [0.5, 0.36], [-1.3, 0.26]);
            },
            _click: function (btn) {
                //cc.log("BtnHimt");
                if (putOutCardTips() == 0 && cc.sys.isObjectValid(MjClient.playui) && MjClient.playui._btnHimt.visible) {
                    PKPassConfirmToServer_card({ cmd: "PKPass", Opt: 3/*点提示过*/ });
                    MjClient.playui.recoverCannotOutCard();
                }
                playEffect("guandan/tishi");
            },
            _event: {
                //拿到一张牌的时候，出牌按钮亮起，其他状态隐藏，by sking
                mjhand: function () {
                    var tData = MjClient.data.sData.tData;
                    if (!IsTurnToMe() || tData.tState != TableState.waitPut) {
                        this.visible = false;
                    }
                    else {
                        this.visible = true;
                    }
                },
                newCard: function (eD) {
                    //cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>newCard by sking");
                    this.visible = true;
                    //setWgtLayout(this, [0.1, 0.1],[0.7, 0.2],[0, 0]);
                },
                PKPut: function (eD) {
                    //cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>PKPut by sking");
                    this.visible = false;
                },
                waitPut: function () {
                    var tData = MjClient.data.sData.tData;
                    if (!IsTurnToMe() || tData.tState != TableState.waitPut || MjClient.playui.isFaPai) {
                        this.visible = false;
                    }
                    else {
                        this.visible = true;
                    }
                },
                initSceneData: function () {
                    var tData = MjClient.data.sData.tData;
                    if (!IsTurnToMe() || tData.tState != TableState.waitPut || MjClient.playui.isFaPai) {
                        this.visible = false;
                    }
                    else {
                        this.visible = true;
                    }
                },
                PostCardsEnded: function () {
                    var tData = MjClient.data.sData.tData;
                    if (IsTurnToMe() && tData.tState == TableState.waitPut && !MjClient.playui.isFaPai) {
                        this.visible = true;
                    }
                }
            }
        },//end of add by sking
        BtnReady: {
            _visible: false,
            _run: function () {
                setWgtLayout(this, [0.18, 0.18], [0.5, 0.4], [0, 0]);
            },
            _click: function (_this) {
                PKPassConfirmToServer_card();
                MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Zhunbei", { uid: SelfUid(), gameType: MjClient.gameType });
            },
            _event: {
                waitReady: function () {
                    if (currentIsAutoRelay())
                        PKPassConfirmToServer_card();
                    else
                        this.visible = true;
                },
                mjhand: function () {
                    this.visible = false;
                },
                initSceneData: function () {
                    this.visible = false;
                    var tData = MjClient.data.sData.tData;
                    var pl = getUIPlayer(0);
                    this.visible = tData.roundNum == tData.roundAll && tData.tState == TableState.waitReady && pl.mjState == TableState.waitReady && !IsInviteVisible();
                    if (this.visible && currentIsAutoRelay()) {
                        PKPassConfirmToServer_card();
                        this.visible = false;
                    }
                },
                PKPass: function () {
                    this.visible = false;
                },
                removePlayer: function (eD) {
                    this.visible = false;
                },
                onlinePlayer: function (msg) {
                    if (msg.uid == SelfUid()) {
                        this.visible = false;
                    }
                },
            }
        },
        BtnNoPut: {
            _run: function () {
                this.visible = false;
                if (isIPhoneX())
                    setWgtLayout(this, [0.15, 0.14], [0.525, 0.43], [-1.3, 0.26]);
                else
                    setWgtLayout(this, [0.15, 0.14], [0.525, 0.36], [-1.3, 0.26])
            },
            _click: function (btn) {
                PKPassConfirmToServer_card({ cmd: "PKPass", Opt: 2/*点不出过*/ });
                MjClient.playui.recoverCannotOutCard();
                btn.visible = false;
            },
            _event: {
                // 不出按钮 可以过牌的时候亮
                mjhand: function () {
                    var tData = MjClient.data.sData.tData;
                    this.visible = IsTurnToMe() && tData.tState == TableState.waitPut &&
                        !tData.areaSelectMode.mustPut && !MjClient.playui.isFaPai;
                },
                PKPut: function (eD) {
                    this.visible = false;
                },
                waitPut: function () {
                    var tData = MjClient.data.sData.tData;
                    this.visible = IsTurnToMe() && tData.tState == TableState.waitPut &&
                        !tData.areaSelectMode.mustPut && !MjClient.playui.isFaPai;
                },
                initSceneData: function () {
                    var tData = MjClient.data.sData.tData;
                    this.visible = IsTurnToMe() && tData.tState == TableState.waitPut &&
                        !tData.areaSelectMode.mustPut && !MjClient.playui.isFaPai;
                },
                PostCardsEnded: function () {
                    var tData = MjClient.data.sData.tData;
                    this.visible = IsTurnToMe() && tData.tState == TableState.waitPut &&
                        !tData.areaSelectMode.mustPut && !MjClient.playui.isFaPai;
                }
            }
        },
        BtnPutCard: {
            _run: function () {
                this.visible = false;
                if (MjClient.data.sData.tData.areaSelectMode.mustPut) {
                    if (isIPhoneX())
                        setWgtLayout(this, [0.15, 0.14], [0.5, 0.43], [0.8, 0.32]);
                    else
                        setWgtLayout(this, [0.15, 0.14], [0.5, 0.36], [0.8, 0.32]);
                }
                else {
                    if (isIPhoneX())
                        setWgtLayout(this, [0.15, 0.14], [0.515, 0.43], [1.3, 0.32]);
                    else
                        setWgtLayout(this, [0.15, 0.14], [0.515, 0.36], [1.3, 0.32]);
                }
            },
            _click: function (btn) {
                //cc.log("BtnPutCard");
                cardsSort_RunFasterYA(MjClient.selectCards_card);
                PutOutCard_card(); //可以出牌
                // MjClient.playui.recoverCannotOutCard();
                btn.visible = false;
            },
            _event: {
                //拿到一张牌的时候，出牌按钮亮起，其他状态隐藏，by sking
                mjhand: function () {
                    //cc.log("============mjhand=========== btnPutCard");
                    var tData = MjClient.data.sData.tData;
                    if (!IsTurnToMe() || tData.tState != TableState.waitPut) {
                        this.visible = false;
                    }
                    else {
                        this.visible = true;
                    }
                },
                newCard: function (eD) {
                    //cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>newCard by sking");
                    this.visible = true;
                    //setWgtLayout(this, [0.1, 0.1],[0.7, 0.2],[0, 0]);
                },
                PKPut: function (eD) {
                    //cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>PKPut by sking");
                    this.visible = false;
                    MjClient.playui.recoverCannotOutCard();
                },

                waitPut: function () {
                    var tData = MjClient.data.sData.tData;
                    if (!IsTurnToMe() || tData.tState != TableState.waitPut || MjClient.playui.isFaPai) {
                        this.visible = false;
                    }
                    else {
                        this.visible = true;
                    }
                },
                initSceneData: function () {
                    var tData = MjClient.data.sData.tData;
                    if (!IsTurnToMe() || tData.tState != TableState.waitPut || MjClient.playui.isFaPai) {
                        this.visible = false;
                    }
                    else {
                        this.visible = true;
                    }
                },
                PostCardsEnded: function () {
                    var tData = MjClient.data.sData.tData;
                    if (IsTurnToMe() && tData.tState == TableState.waitPut && !MjClient.playui.isFaPai) {
                        this.visible = true;
                    }
                }
            }
        },//end of add by sking
        positionCard: { //add by  sking for put card button
            _run: function () {
                this.visible = false;
                setWgtLayout(this, [0.18, 0.18], [0.5, 0.5], [0, 0]);
            },
            _event: {
                clearCardUI: function () {
                    this.visible = false;
                },
                mjhand: function () {
                    this.visible = false;
                },
                changePosition: function (msg) {
                    this.visible = true;
                }
            }
        },//end of add by sking
        noPutTips: { //add by  sking for put card button
            _run: function () {
                this.visible = false;
                setWgtLayout(this, [0.39, 0], [0.5, 0.1], [0, 0]);
            },
            _event: {
                clearCardUI: function () {
                    this.visible = false;
                },
                mjhand: function () {
                    this.visible = false;
                },
            }
        },//end of add by sking
        flyCard: {
            _run: function () {
                this.visible = false;
            },
            _event: {
                waitPut: function (eD) {
                    // var tData = MjClient.data.sData.tData;
                    // if ((tData.roundNum == tData.roundAll || tData.areaSelectMode.mustPutHongTaoSan) && tData.lastPutPlayer == -1) {
                    //     setWgtLayout(this, [0.036, 0], [0.5, 0.75], [0, 0]);
                    //     MjClient.playui.shwoFlyCardAnim(this);
                    // }
                }
            }
        },
        down: {
            head: {
                tuoguan: {
                    _run: function () {
                        this.visible = false;
                    },
                    _event: {
                        beTrust: function (msg) {
                            if (getUIPlayer(0) && getUIPlayer(0).info.uid == msg.uid) {
                                this.visible = true;
                            }
                        },
                        cancelTrust: function (msg) {
                            if (getUIPlayer(0) && getUIPlayer(0).info.uid == msg.uid) {
                                this.visible = false;
                            }
                        },
                        initSceneData: function (msg) {
                            var pl = getUIPlayer(0);
                            if (pl && pl.trust) {
                                this.visible = true;
                            } else {
                                this.visible = false;
                            }
                        },
                    }
                },
                zhuang: {
                    _run: function () {
                        this.visible = false;
                    },
                    _event: {
                        waitPut: function () {
                            showUserZhuangLogo_card(this, 0);
                        },
                        initSceneData: function () {
                            if (IsArrowVisible()) showUserZhuangLogo_card(this, 0);
                        }
                    }
                },
                chatbg: {
                    _run: function () {
                        this.getParent().zIndex = 600;
                    },
                    chattext: {
                        _event: {

                            MJChat: function (msg) {

                                showUserChat(this, 0, msg);
                            },
                            playVoice: function (voicePath) {
                                MjClient.data._tempMessage.msg = voicePath;
                                showUserChat(this, 0, MjClient.data._tempMessage);
                            }
                        }
                    }
                },
                _click: function (btn) {
                    showPlayerInfo(0, btn);
                },
                _event: {
                    loadWxHead: function (d) {
                        if (MjClient.data.sData.tData.areaSelectMode.IsAnonymous) {
                            cc.loader.loadImg('RunFasterYA/Game/hide_head.png', { isCrossOrigin: true }, function (err, texture) {
                                if (!err && texture) {
                                    d.img = texture;
                                    setWxHead(this, d, 0);
                                }
                            }.bind(this));
                        } else setWxHead(this, d, 0);
                    },
                    addPlayer: function (eD) {
                        showFangzhuTagIcon(this, 0);
                    },
                    removePlayer: function (eD) {
                        showFangzhuTagIcon(this, 0);
                    }

                },
                _run: function () {
                    //this.zIndex = 600;
                    showFangzhuTagIcon(this, 0);
                },
                score_bg: { _visible: false },
                name_bg: { _visible: false },
            },
            play_tips: {
                _layout: [[0.08, 0.14], [0.5, 0.25], [0, 0.5]],
                _run: function () {
                    this.zIndex = actionZindex;
                },
                _visible: false,
            },
            ready: {
                _run: function () {
                    setWgtLayout(this, [this.width / 1280, this.height / 720], [0.5, 0.5], [0, -1.5]);
                    GetReadyVisible(this, 0);
                    //this.visible = true;
                },
                _event: {
                    showPlayerShuffleView: function () {
                        GetReadyVisible(this, -1);
                    },
                    moveHead: function () {
                        GetReadyVisible(this, -1);
                    },
                    addPlayer: function () {
                        GetReadyVisible(this, 0);//根据状态设置ready 是否可见 add by sking
                    },
                    removePlayer: function () {
                        GetReadyVisible(this, 0);
                    },
                    onlinePlayer: function () {

                        cc.log("============online player=======1063======");
                        GetReadyVisible(this, 0);
                    }
                }
            },
            stand: {
                _layout: [
                    [0.090, 0],
                    [0.5, 0.03],
                    [0, 0.55]
                ],
                _visible: false,
                _run: function () {
                    this.zIndex = 600;
                },
            },
            deskCard: {
                _run: function () {
                    setWgtLayout(this, [0.052, 0], [0.5, 0.06], [0, 3.3]);
                },
                _visible: false
            },
            noPutTag: {
                _run: function () {
                    this.setScale(MjClient.size.width / 1280);
                    this.setPosition(MjClient.playui._downNode.getChildByName("deskCard").getPosition());
                },
                _event: {
                    PKPass: function (eD) {
                        cc.log("=====PKPASS=========" + JSON.stringify(eD));
                        var UIoff = getUiOffByUid(eD.uid);
                        if (UIoff == 0) {
                            DealPKPass_card(UIoff);
                        }
                    }
                },
                _visible: false
            },
            _event: {
                clearCardUI: function () {
                    clearCardUI_card(this, 0);
                },
                initSceneData: function (eD) {
                    SetUserVisible_RunFasterYA(this, 0);
                    reConnectShowDeskCard();
                    delete MjClient.playui.isFaPai;
                    MjClient.playui.CardLayoutRestore(this, 0);
                },
                addPlayer: function (eD) {
                    SetUserVisible_RunFasterYA(this, 0);
                },
                removePlayer: function (eD) {
                    SetUserVisible_RunFasterYA(this, 0);
                },
                mjhand: function (eD) {
                    InitUserHandUI_RunFasterYA(this, 0);
                    // 先排序 再发牌 上面的这个函数可能不走排序的代码段
                    delete MjClient.playui.isFaPai;
                    MjClient.playui.CardLayoutRestore(this, 0);
                    var tData = MjClient.data.sData.tData;
                    var pl = getUIPlayer(0);

                    if (tData.matchId || (pl && pl.trust)) {
                        // 托管状态下，不播放发牌动画 
                    }
                    else {
                        // showPostCardAnimation('RunFasterYA/Card/back.png');
                    }

                    MjClient.playui.isWaitAniEnd = false;
                },
                roundEnd: function () {
                    InitUserCoinAndName(this, 0);
                    //setTaiInfo("");
                },
                newCard: function (eD) {
                    cc.log("客户端发牌组合...... ");
                    if (typeof (eD) == "number") {
                        eD = { newCard: eD };
                    }
                },
                PKPut: function (eD) {
                    //cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>PKPut---------------");
                    var pl = getUIPlayer(0);
                    if (pl && pl.trust || eD.uid != SelfUid() || MjClient.rePlayVideo != -1)
                        DealMJPut_card(this, eD, 0);
                    setUserOffline(this, 0);
                },
                waitPut: function (eD) {
                    cc.log(">>>>>>>>>>>>>>>>down>>>>>>>>>>>>>>>waitPut");

                    var tData = MjClient.data.sData.tData;
                    if (MjClient.playui.isShowHandCardBeiMain && (tData.curPlayer == getPlayerIndex(0) || tData.lastPutPlayer != -1)) {
                        MjClient.playui.isShowHandCardBeiMain = false;
                        MjClient.playui.hideHandCardBeiMian();
                    }

                    // 发牌时暂时不计算牌型提示
                    if (!MjClient.playui.isFaPai) {
                        if (MjClient.playui.isWaitAniEnd)
                            delete MjClient.playui.isWaitAniEnd;

                        DealWaitPut_card(this, eD, 0);
                        UpdataCurrentPutCard();
                        // 跑得快 自动出牌
                        if (IsTurnToMe()) {
                            // 如果提示只有一手牌， 自动提起
                            // 如果提示只有一手牌， 且是我全部的手牌数量， 自动打出
                            AutoPutLastCard_card_ty();
                        }
                    }

                },
                PostCardsEnded: function () {
                    // 发牌完毕处理正常牌逻辑
                    if (!MjClient.playui.isFaPai &&
                        MjClient.data.sData.tData.tState == TableState.waitPut &&
                        MjClient.playui.isWaitAniEnd) {
                        delete MjClient.playui.isWaitAniEnd;

                        DealWaitPut_card(this, null, 0);
                        UpdataCurrentPutCard();
                        // 跑得快 自动出牌
                        if (IsTurnToMe()) {
                            // 如果提示只有一手牌， 自动提起
                            // 如果提示只有一手牌， 且是我全部的手牌数量， 自动打出
                            AutoPutLastCard_card_ty();
                        }
                    }
                },
                onlinePlayer: function (eD) {
                    setUserOffline(this, 0);
                },
                playerStatusChange: function (eD) {
                    setUserOffline(this, 0);
                }
            },
            loseScore: {
                _visible: false,
                _run: function () {
                    setWgtLayout(this, [this.width / 1280, this.height / 720], [0.5, 0.5], [-0.3, -0.6]);
                },
                _event: {
                    ShowBoomScore: function (d) {
                        MjClient.playui.updateBoomScore(this, d, false, 0);
                    }
                }
            },
            winScore: {
                _visible: false,
                _run: function () {
                    setWgtLayout(this, [this.width / 1280, this.height / 720], [0.5, 0.5], [-0.3, -0.6]);
                },
                _event: {
                    ShowBoomScore: function (d) {
                        MjClient.playui.updateBoomScore(this, d, true, 0);
                    }
                }
            },
        },
        right: {
            head: {
                tuoguan: {
                    _run: function () {
                        this.visible = false;
                    },
                    _event: {
                        beTrust: function (msg) {
                            if (getUIPlayer(1) && getUIPlayer(1).info.uid == msg.uid) {
                                this.visible = true;
                            }
                        },
                        cancelTrust: function (msg) {
                            if (getUIPlayer(1) && getUIPlayer(1).info.uid == msg.uid) {
                                this.visible = false;
                            }
                        },
                        initSceneData: function (msg) {
                            var pl = getUIPlayer(1);
                            if (pl && pl.trust) {
                                this.visible = true;
                            } else {
                                this.visible = false;
                            }
                        },
                    }
                },
                zhuang: {
                    _run: function () {
                        this.visible = false;
                    },
                    _event: {
                        waitPut: function () {
                            showUserZhuangLogo_card(this, 1);
                        },
                        initSceneData: function () {
                            if (IsArrowVisible()) showUserZhuangLogo_card(this, 1);
                        }
                    }
                },
                chatbg: {
                    _run: function () {
                        this.getParent().zIndex = 500;
                    },
                    chattext: {
                        _event: {

                            MJChat: function (msg) {
                                showUserChat(this, 1, msg);
                            },
                            playVoice: function (voicePath) {
                                MjClient.data._tempMessage.msg = voicePath;
                                showUserChat(this, 1, MjClient.data._tempMessage);
                            }
                        }
                    }
                },
                _click: function (btn) {
                    showPlayerInfo(1, btn);
                },
                _event: {
                    loadWxHead: function (d) {
                        if (MjClient.data.sData.tData.areaSelectMode.IsAnonymous) {
                            cc.loader.loadImg('RunFasterYA/Game/hide_head.png', { isCrossOrigin: true }, function (err, texture) {
                                if (!err && texture) {
                                    d.img = texture;
                                    setWxHead(this, d, 1);
                                }
                            }.bind(this));
                        } else setWxHead(this, d, 1);
                    },
                    addPlayer: function (eD) {
                        showFangzhuTagIcon(this, 1);
                    },
                    removePlayer: function (eD) {
                        showFangzhuTagIcon(this, 1);
                    }
                },
                _run: function () {
                    // this.zIndex = 600;
                    showFangzhuTagIcon(this, 1);
                },
                score_bg: { _visible: false },
                name_bg: { _visible: false },
                tingCard: {
                    _run: function () {
                        if (MjClient.MaxPlayerNum == 2) {
                            this.setPositionX(151);
                        } else {
                            this.setPositionX(-40);
                        }
                    },
                    _visible: false,
                    _event: {
                        initSceneData: function (eD) {
                            var pl = getUIPlayer(1);
                            if (pl && pl.handCount) {
                                this.visible = MjClient.rePlayVideo == -1;
                            }
                            else {
                                this.visible = false;
                            }
                        },
                        clearCardUI: function () {
                            this.visible = false;
                        },
                        changePosition: function () {
                            this.visible = MjClient.rePlayVideo == -1;
                        }
                    }
                },

            },
            play_tips: {
                _run: function () {
                    if (MjClient.MaxPlayerNum == 2)
                        setWgtLayout(this, [this.width / 1280, this.height / 720], [0.5, 0.5], [0, 0.5]);
                    else
                        setWgtLayout(this, [this.width / 1280, this.height / 720], [0.75, 0.5], [0, 0.5]);//[0.08, 0.14]
                    this.zIndex = actionZindex;
                },
                _visible: false,
            },
            ready: {
                _run: function () {
                    if (MjClient.MaxPlayerNum == 2)
                        setWgtLayout(this, [this.width / 1280, this.height / 720], [0.5, 0.5], [0, 2]);
                    else
                        setWgtLayout(this, [this.width / 1280, this.height / 720], [0.5, 0.5], [2, 0]);
                    GetReadyVisible(this, 1);
                },
                _event: {
                    showPlayerShuffleView: function () {
                        GetReadyVisible(this, -1);
                    },
                    moveHead: function () {
                        GetReadyVisible(this, -1);
                    },
                    addPlayer: function () {
                        GetReadyVisible(this, 1);
                    },
                    removePlayer: function () {
                        GetReadyVisible(this, 1);
                    },
                    onlinePlayer: function () {
                        GetReadyVisible(this, 1);
                    }
                }
            },
            stand: {
                _run: function () {
                    if (MjClient.MaxPlayerNum == 2) {
                        this.setRotation(0);
                        if (isIPhoneX() && !MjClient.data.sData.tData.fieldId)
                            setWgtLayout(this, [0, 0.13], [0.5, 1], [-1, -0.8]);
                        else
                            setWgtLayout(this, [0, 0.13], [0.5, 1], [-1, -0.8]);
                    } else {
                        this.setRotation(270);
                        if (isIPhoneX() && !MjClient.data.sData.tData.fieldId)
                            setWgtLayout(this, [0, 0.13], [1, 1], [-2.1, 0]);
                        else
                            setWgtLayout(this, [0, 0.13], [1, 1], [-2.5, 0]);
                    }

                    this.visible = false;
                }
            },
            deskCard: {
                _run: function () {
                    if (MjClient.MaxPlayerNum == 2) {
                        if (MjClient.rePlayVideo == -1)// 表示正常游戏
                            setWgtLayout(this, [0.052, 0], [0.5, 0.65], [0, 0.5]);
                        else if (isIPhoneX() && MjClient.rePlayVideo != -1 && !MjClient.data.sData.tData.fieldId)
                            setWgtLayout(this, [0.052, 0], [0.5, 0.65], [2.2, 0.5]);
                        else
                            setWgtLayout(this, [0.052, 0], [0.5, 0.65], [0, 0.5]);
                    } else {
                        if (MjClient.rePlayVideo == -1)// 表示正常游戏
                            setWgtLayout(this, [0.052, 0], [1, 0.65], [-3.5, 0.5]);
                        else if (isIPhoneX() && MjClient.rePlayVideo != -1 && !MjClient.data.sData.tData.fieldId)
                            setWgtLayout(this, [0.052, 0], [1, 0.65], [-4.25, 0.5]);
                        else
                            setWgtLayout(this, [0.052, 0], [1, 0.65], [-4.2, 0.5]);
                    }
                },
                _visible: false
            },
            noPutTag: {
                _run: function () {
                    this.setScale(MjClient.size.width / 1280);
                    this.setPosition(MjClient.playui._rightNode.getChildByName("deskCard").getPosition());
                },
                _event: {
                    PKPass: function (eD) {
                        var UIoff = getUiOffByUid(eD.uid);
                        if (UIoff == 1) {
                            DealPKPass_card(UIoff);
                        }
                    }
                },
                _visible: false
            },
            _event: {
                clearCardUI: function () {
                    clearCardUI_card(this, 1);
                },
                initSceneData: function (eD) {
                    SetUserVisible_RunFasterYA(this, 1);
                },
                addPlayer: function (eD) {
                    SetUserVisible_RunFasterYA(this, 1);
                },
                removePlayer: function (eD) {
                    SetUserVisible_RunFasterYA(this, 1);
                },
                mjhand: function (eD) {
                    InitUserHandUI_RunFasterYA(this, 1);
                },
                roundEnd: function () {
                    InitUserCoinAndName(this, 1);
                },
                waitPut: function (eD) {
                    DealWaitPut_card(this, eD, 1);
                },
                PKPut: function (eD) {
                    DealMJPut_card(this, eD, 1);
                    if (eD.uid != SelfUid()) {

                    }
                    setUserOffline(this, 1);
                },
                onlinePlayer: function (eD) {
                    setUserOffline(this, 1);
                },
                playerStatusChange: function (eD) {
                    setUserOffline(this, 1);
                }
            },
            loseScore: {
                _visible: false,
                _run: function () {
                    if (MjClient.MaxPlayerNum == 2) {
                        setWgtLayout(this, [this.width / 1280, this.height / 720], [0.5, 0.75], [-0.3, 0]);
                    } else {
                        setWgtLayout(this, [this.width / 1280, this.height / 720], [0.88, 0.75], [-1, 0]);
                    }
                },
                _event: {
                    ShowBoomScore: function (d) {
                        MjClient.playui.updateBoomScore(this, d, false, 1);
                    }
                }
            },
            winScore: {
                _visible: false,
                _run: function () {
                    if (MjClient.MaxPlayerNum == 2) {
                        setWgtLayout(this, [this.width / 1280, this.height / 720], [0.5, 0.75], [-0.3, 0]);
                    } else {
                        setWgtLayout(this, [this.width / 1280, this.height / 720], [0.88, 0.75], [-1, 0]);
                    }
                },
                _event: {
                    ShowBoomScore: function (d) {
                        MjClient.playui.updateBoomScore(this, d, true, 1);
                    }
                }
            },
        },
        top: {
            _run: function () {
                this.visible = MjClient.MaxPlayerNum >= 3;
            },
            head: {
                tuoguan: {
                    _run: function () {
                        this.visible = false;
                    },
                    _event: {
                        beTrust: function (msg) {
                            if (getUIPlayer(2) && getUIPlayer(2).info.uid == msg.uid) {
                                this.visible = true;
                            }
                        },
                        cancelTrust: function (msg) {
                            if (getUIPlayer(2) && getUIPlayer(2).info.uid == msg.uid) {
                                this.visible = false;
                            }
                        },
                        initSceneData: function (msg) {
                            var pl = getUIPlayer(2);
                            if (pl && pl.trust) {
                                this.visible = true;
                            } else {
                                this.visible = false;
                            }
                        },
                    }
                },
                zhuang: {
                    _run: function () {
                        this.visible = false;
                    },
                    _event: {
                        waitPut: function () {
                            showUserZhuangLogo_card(this, 2);
                        },
                        initSceneData: function () {
                            if (IsArrowVisible()) showUserZhuangLogo_card(this, 2);
                        }
                    }
                },
                chatbg: {
                    _run: function () {
                        this.getParent().zIndex = 500;
                    },
                    chattext: {
                        _event: {

                            MJChat: function (msg) {
                                showUserChat(this, 2, msg);
                            },
                            playVoice: function (voicePath) {
                                MjClient.data._tempMessage.msg = voicePath;
                                showUserChat(this, 2, MjClient.data._tempMessage);
                            }
                        }
                    }
                },
                _click: function (btn) {
                    showPlayerInfo(2, btn);
                },
                _event: {
                    loadWxHead: function (d) {
                        if (MjClient.data.sData.tData.areaSelectMode.IsAnonymous) {
                            cc.loader.loadImg('RunFasterYA/Game/hide_head.png', { isCrossOrigin: true }, function (err, texture) {
                                if (!err && texture) {
                                    d.img = texture;
                                    setWxHead(this, d, 2);
                                }
                            }.bind(this));
                        } else setWxHead(this, d, 2);
                    },
                    addPlayer: function (eD) {
                        showFangzhuTagIcon(this, 2);
                    },
                    removePlayer: function (eD) {
                        showFangzhuTagIcon(this, 2);
                    }
                },
                _run: function () {
                    // this.zIndex = 600;
                    showFangzhuTagIcon(this, 2);
                },
                score_bg: { _visible: false },
                name_bg: { _visible: false },
                tingCard: {
                    _run: function () {
                        if (MjClient.MaxPlayerNum == 3) {
                            this.setPositionX(151);
                        } else {
                            this.setPositionX(-40);
                        }
                    },
                    _visible: false,
                    _event: {
                        initSceneData: function (eD) {
                            var pl = getUIPlayer(2);
                            if (pl && pl.handCount) {
                                this.visible = MjClient.rePlayVideo == -1;
                            }
                            else {
                                this.visible = false;
                            }

                        },
                        clearCardUI: function () {
                            this.visible = false;
                        },
                        changePosition: function () {
                            this.visible = MjClient.rePlayVideo == -1;
                        }
                    }
                },
            },
            play_tips: {
                _run: function () {
                    if (MjClient.MaxPlayerNum == 3)
                        setWgtLayout(this, [this.width / 1280, this.height / 720], [0.25, 0.5], [0, 0.5]);
                    else
                        setWgtLayout(this, [this.width / 1280, this.height / 720], [0.5, 0.5], [0, 0.5]);//[0.08, 0.14]
                    this.zIndex = actionZindex;
                },
                _visible: false,
            },
            ready: {
                _run: function () {
                    if (MjClient.MaxPlayerNum == 3)
                        setWgtLayout(this, [this.width / 1280, this.height / 720], [0.5, 0.5], [-2, 0]);
                    else
                        setWgtLayout(this, [this.width / 1280, this.height / 720], [0.5, 0.5], [0, 2]);
                    GetReadyVisible(this, 2);
                },
                _event: {
                    showPlayerShuffleView: function () {
                        GetReadyVisible(this, -1);
                    },
                    moveHead: function () {
                        GetReadyVisible(this, -1);
                    },
                    addPlayer: function () {
                        GetReadyVisible(this, 2);
                    },
                    removePlayer: function () {
                        GetReadyVisible(this, 2);
                    },
                    onlinePlayer: function () {
                        GetReadyVisible(this, 2);
                    }
                }
            },
            stand: {
                _run: function () {
                    if (MjClient.MaxPlayerNum == 3) {
                        this.setRotation(90);
                        if (isIPhoneX() && !MjClient.data.sData.tData.fieldId)
                            setWgtLayout(this, [0, 0.13], [0, 1], [3.15, 0]);
                        else
                            setWgtLayout(this, [0, 0.13], [0, 1], [2.5, 0]);
                    } else {
                        this.setRotation(0);
                        if (isIPhoneX() && !MjClient.data.sData.tData.fieldId)
                            setWgtLayout(this, [0, 0.13], [0.5, 1], [-0.5, -0.8]);
                        else
                            setWgtLayout(this, [0, 0.13], [0.5, 1], [-0.5, -0.8]);
                    }
                    this.visible = false;
                }
            },
            deskCard: {
                _run: function () {
                    if (MjClient.MaxPlayerNum == 3) {
                        if (MjClient.rePlayVideo == -1)// 表示正常游戏
                            setWgtLayout(this, [0.052, 0], [0, 0.65], [3.5, 0.5]);
                        else if (isIPhoneX() && MjClient.rePlayVideo != -1 && !MjClient.data.sData.tData.fieldId)
                            setWgtLayout(this, [0.052, 0], [0, 0.65], [4.25, 0.5]);
                        else
                            setWgtLayout(this, [0.052, 0], [0, 0.65], [4.2, 0.5]);
                    } else {
                        if (MjClient.rePlayVideo == -1)// 表示正常游戏
                            setWgtLayout(this, [0.052, 0], [0.5, 0.65], [0, 0.5]);
                        else if (isIPhoneX() && MjClient.rePlayVideo != -1 && !MjClient.data.sData.tData.fieldId)
                            setWgtLayout(this, [0.052, 0], [0.5, 0.65], [2.2, 0.5]);
                        else
                            setWgtLayout(this, [0.052, 0], [0.5, 0.65], [0, 0.5]);
                    }
                },
                _visible: false,
            },
            noPutTag: {
                _run: function () {
                    this.setScale(MjClient.size.width / 1280);
                    this.setPosition(MjClient.playui._topNode.getChildByName("deskCard").getPosition());
                },
                _event: {
                    PKPass: function (eD) {
                        var UIoff = getUiOffByUid(eD.uid);
                        if (UIoff == 2) {
                            DealPKPass_card(UIoff);
                        }
                    }
                },
                _visible: false
            },
            _event: {
                clearCardUI: function () {
                    clearCardUI_card(this, 2);
                },
                initSceneData: function (eD) {
                    SetUserVisible_RunFasterYA(this, 2);
                },
                addPlayer: function (eD) {
                    SetUserVisible_RunFasterYA(this, 2);
                },
                removePlayer: function (eD) {
                    SetUserVisible_RunFasterYA(this, 2);
                },
                mjhand: function (eD) {
                    InitUserHandUI_RunFasterYA(this, 2);
                },
                roundEnd: function () {
                    InitUserCoinAndName(this, 2);
                },
                waitPut: function (eD) {
                    DealWaitPut_card(this, eD, 2);
                },
                PKPut: function (eD) {
                    DealMJPut_card(this, eD, 2);
                    setUserOffline(this, 2);
                },
                onlinePlayer: function (eD) {
                    setUserOffline(this, 2);
                },
                playerStatusChange: function (eD) {
                    setUserOffline(this, 2);
                },
                MJFlower: function (eD) {
                    HandleMJFlower(this, eD, 2);
                },
                MJTing: function (eD) {
                    HandleMJTing(this, eD, 2);
                }
            },
            loseScore: {
                _visible: false,
                _run: function () {
                    if (MjClient.MaxPlayerNum == 3) {
                        setWgtLayout(this, [this.width / 1280, this.height / 720], [0.12, 0.75], [0.3, 0]);
                    } else {
                        setWgtLayout(this, [this.width / 1280, this.height / 720], [0.5, 0.75], [-0.3, 0]);
                    }
                },
                _event: {
                    ShowBoomScore: function (d) {
                        MjClient.playui.updateBoomScore(this, d, false, 2);
                    }
                }
            },
            winScore: {
                _visible: false,
                _run: function () {
                    if (MjClient.MaxPlayerNum == 3) {
                        setWgtLayout(this, [this.width / 1280, this.height / 720], [0.12, 0.75], [0.3, 0]);
                    } else {
                        setWgtLayout(this, [this.width / 1280, this.height / 720], [0.5, 0.75], [-0.3, 0]);
                    }
                },
                _event: {
                    ShowBoomScore: function (d) {
                        MjClient.playui.updateBoomScore(this, d, true, 2);
                    }
                }
            },
        },
        left: {
            _run: function () {
                this.visible = MjClient.MaxPlayerNum >= 4;
            },
            head: {
                tuoguan: {
                    _run: function () {
                        this.visible = false;
                    },
                    _event: {
                        beTrust: function (msg) {
                            if (getUIPlayer(3) && getUIPlayer(3).info.uid == msg.uid) {
                                this.visible = true;
                            }
                        },
                        cancelTrust: function (msg) {
                            if (getUIPlayer(3) && getUIPlayer(3).info.uid == msg.uid) {
                                this.visible = false;
                            }
                        },
                        initSceneData: function (msg) {
                            var pl = getUIPlayer(3);
                            if (pl && pl.trust) {
                                this.visible = true;
                            } else {
                                this.visible = false;
                            }
                        },
                    }
                },
                zhuang: {
                    _run: function () {
                        this.visible = false;
                    },
                    _event: {
                        waitPut: function () {
                            showUserZhuangLogo_card(this, 3);
                        },
                        initSceneData: function () {
                            if (IsArrowVisible()) showUserZhuangLogo_card(this, 3);
                        }
                    }
                },
                chatbg: {
                    _run: function () {
                        this.getParent().zIndex = 500;
                    },
                    chattext: {
                        _event: {

                            MJChat: function (msg) {
                                showUserChat(this, 3, msg);
                            },
                            playVoice: function (voicePath) {
                                MjClient.data._tempMessage.msg = voicePath;
                                showUserChat(this, 3, MjClient.data._tempMessage);
                            }
                        }
                    }
                },
                _click: function (btn) {
                    showPlayerInfo(3, btn);
                },
                _event: {
                    loadWxHead: function (d) {
                        if (MjClient.data.sData.tData.areaSelectMode.IsAnonymous) {
                            cc.loader.loadImg('RunFasterYA/Game/hide_head.png', { isCrossOrigin: true }, function (err, texture) {
                                if (!err && texture) {
                                    d.img = texture;
                                    setWxHead(this, d, 3);
                                }
                            }.bind(this));
                        } else setWxHead(this, d, 3);
                    },
                    addPlayer: function (eD) {
                        showFangzhuTagIcon(this, 3);
                    },
                    removePlayer: function (eD) {
                        showFangzhuTagIcon(this, 3);
                    }
                },
                _run: function () {
                    // this.zIndex = 600;
                    showFangzhuTagIcon(this, 3);
                },
                score_bg: { _visible: false },
                name_bg: { _visible: false },
                tingCard: {
                    _run: function () {
                        this.setPositionX(151);
                    },
                    _visible: false,
                    _event: {
                        initSceneData: function (eD) {
                            var pl = getUIPlayer(3);
                            if (pl && pl.handCount) {
                                this.visible = MjClient.rePlayVideo == -1;
                            }
                            else {
                                this.visible = false;
                            }

                        },
                        clearCardUI: function () {
                            this.visible = false;
                        },
                        changePosition: function () {
                            this.visible = MjClient.rePlayVideo == -1;
                        }
                    }
                },
            },
            play_tips: {
                _layout: [[0.08, 0.14], [0.25, 0.5], [0, 0.5]],
                _run: function () {
                    this.zIndex = actionZindex;
                },
                _visible: false,
            },
            ready: {
                _run: function () {
                    setWgtLayout(this, [this.width / 1280, this.height / 720], [0.5, 0.5], [-2, 0]);
                    GetReadyVisible(this, 3);
                },
                _event: {
                    showPlayerShuffleView: function () {
                        GetReadyVisible(this, -1);
                    },
                    moveHead: function () {
                        GetReadyVisible(this, -1);
                    },
                    addPlayer: function () {
                        GetReadyVisible(this, 3);
                    },
                    removePlayer: function () {
                        GetReadyVisible(this, 3);
                    },
                    onlinePlayer: function () {
                        GetReadyVisible(this, 3);
                    }
                }
            },
            stand: {
                _run: function () {
                    if (isIPhoneX() && !MjClient.data.sData.tData.fieldId)
                        setWgtLayout(this, [0, 0.13], [0, 1], [3.15, 0]);
                    else
                        setWgtLayout(this, [0, 0.13], [0, 1], [2.5, 0]);

                    this.visible = false;
                }
            },
            deskCard: {
                _run: function () {
                    if (MjClient.rePlayVideo == -1)// 表示正常游戏
                        setWgtLayout(this, [0.052, 0], [0, 0.65], [3.5, 0.5]);
                    else if (isIPhoneX() && MjClient.rePlayVideo != -1 && !MjClient.data.sData.tData.fieldId)
                        setWgtLayout(this, [0.052, 0], [0, 0.65], [4.25, 0.5]);
                    else
                        setWgtLayout(this, [0.052, 0], [0, 0.65], [4.2, 0.5]);
                },
                _visible: false,
            },
            noPutTag: {
                _run: function () {
                    this.setScale(MjClient.size.width / 1280);
                    this.setPosition(MjClient.playui._leftNode.getChildByName("deskCard").getPosition());
                },
                _event: {
                    PKPass: function (eD) {
                        var UIoff = getUiOffByUid(eD.uid);
                        if (UIoff == 3) {
                            DealPKPass_card(UIoff);
                        }
                    }
                },
                _visible: false
            },
            _event: {
                clearCardUI: function () {
                    clearCardUI_card(this, 3);
                },
                initSceneData: function (eD) {
                    SetUserVisible_RunFasterYA(this, 3);
                },
                addPlayer: function (eD) {
                    SetUserVisible_RunFasterYA(this, 3);
                },
                removePlayer: function (eD) {
                    SetUserVisible_RunFasterYA(this, 3);
                },
                mjhand: function (eD) {
                    InitUserHandUI_RunFasterYA(this, 3);
                },
                roundEnd: function () {
                    InitUserCoinAndName(this, 3);
                },
                waitPut: function (eD) {
                    DealWaitPut_card(this, eD, 3);
                },
                PKPut: function (eD) {
                    DealMJPut_card(this, eD, 3);
                    setUserOffline(this, 3);
                },
                onlinePlayer: function (eD) {
                    setUserOffline(this, 3);
                },
                playerStatusChange: function (eD) {
                    setUserOffline(this, 3);
                },
                MJFlower: function (eD) {
                    HandleMJFlower(this, eD, 3);
                },
                MJTing: function (eD) {
                    HandleMJTing(this, eD, 3);
                }
            },
            loseScore: {
                _visible: false,
                _run: function () {
                    setWgtLayout(this, [this.width / 1280, this.height / 720], [0.12, 0.75], [0.3, 0]);
                },
                _event: {
                    ShowBoomScore: function (d) {
                        MjClient.playui.updateBoomScore(this, d, false, 3);
                    }
                }
            },
            winScore: {
                _visible: false,
                _run: function () {
                    setWgtLayout(this, [this.width / 1280, this.height / 720], [0.12, 0.75], [0.3, 0]);
                },
                _event: {
                    ShowBoomScore: function (d) {
                        MjClient.playui.updateBoomScore(this, d, true, 3);
                    }
                }
            },
        },
        clock: {
            _run: function () {
                if (MjClient.data.sData.tData.areaSelectMode.mustPut == true) {
                    if (isIPhoneX())
                        setWgtLayout(this, [0.065, 0.14], [0.25, 0.47], [0, 0]);
                    else
                        setWgtLayout(this, [0.065, 0.14], [0.25, 0.4], [0, 0]);
                }
                else {
                    if (isIPhoneX())
                        setWgtLayout(this, [0.065, 0.14], [0.17, 0.47], [0, 0]);
                    else
                        setWgtLayout(this, [0.065, 0.14], [0.17, 0.4], [0, 0]);
                }

                MjClient.clockNode = this;
                this.visible = false;
                this.srcPosition = this.getPosition();
            },
            number: {
                _run: function () {
                    this.ignoreContentAdaptWithSize(true);
                },
                _event: {
                    initSceneData: function (msg) {
                        if (MjClient.data.sData.tData.tState == TableState.waitPut) {
                            MjClient.playui.clockNumberUpdate(this, null, true);
                            setTimeout(() => {
                                MjClient.playui.updateClockPosition(MjClient.clockNode);
                                MjClient.clockNode.visible = true;
                            }, 0);
                        }
                    },
                    waitPut: function () {
                        this.stopAllActions();
                        var tData = MjClient.data.sData.tData;
                        var haveTip = (tData.hadTipCards !== false);
                        // 必出且不能管
                        var isNewOut = (tData.curPlayer === tData.lastPutPlayer);
                        var isClockVisible = (isNewOut || haveTip) ? true : false;
                        MjClient.clockNode.visible = isClockVisible;
                        stopEffect(playTimeUpEff);
                        MjClient.playui.clockNumberUpdate(this, null, false);
                        MjClient.playui.updateClockPosition(MjClient.clockNode);
                    },
                    PKPut: function (msg) {
                        if (msg.uid == SelfUid()) {
                            this.stopAllActions();
                            stopEffect(playTimeUpEff);
                            playTimeUpEff = null;
                            this.setString("0");
                        }
                    },
                    roundEnd: function () {
                        this.stopAllActions();
                        stopEffect(playTimeUpEff);
                        playTimeUpEff = null;
                    },
                    onlinePlayer: function () {
                        // MjClient.clockNode.visible = false;
                    },
                    LeaveGame: function () {
                        this.stopAllActions();
                        stopEffect(playTimeUpEff);
                        playTimeUpEff = null;
                    }
                }
            },
        },
        chat_btn: {
            _run: function () {
                setWgtLayout(this, [0.08, 0.08], [0.965, 0.20], [0, 2.5]);
            },
            _click: function () {
                var chatlayer = new ChatLayer();
                MjClient.Scene.addChild(chatlayer);
            }
        },
        voice_btn: {
            _run: function () {
                setWgtLayout(this, [0.08, 0.08], [0.965, 0.25], [0, 3.5]);

                initVoiceData();
                cc.eventManager.addListener(getTouchListener(), this);
                if (MjClient.isShenhe) this.visible = false;
            },
            _touch: function (btn, eT) {
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
                cancelRecord: function () {
                    MjClient.native.HelloOC("cancelRecord !!!");
                },
                uploadRecord: function (filePath) {
                    if (filePath) {
                        MjClient.native.HelloOC("upload voice file");
                        MjClient.native.UploadFile(filePath, MjClient.remoteCfg.voiceUrl, "sendVoice");
                    } else {
                        MjClient.native.HelloOC("No voice file update");
                    }
                },
                sendVoice: function (fullFilePath) {
                    if (!fullFilePath) {
                        cc.log("sendVoice No fileName");
                        return;
                    }

                    var getFileName = /[^\/]+$/;
                    var extensionName = getFileName.exec(fullFilePath);
                    var fileName = extensionName[extensionName.length - 1];
                    cc.log("sfileName is:" + fileName);

                    MjClient.gamenet.request("pkroom.handler.tableMsg", {
                        cmd: "downAndPlayVoice",
                        uid: SelfUid(),
                        type: 3,
                        msg: fileName,
                        num: MjClient.data._JiaheTempTime//录音时长
                    });
                    MjClient.native.HelloOC("download file");
                },
                downAndPlayVoice: function (msg) {
                    MjClient.native.HelloOC("downloadPlayVoice ok");
                    MjClient.data._tempMessage = msg;
                    MjClient.native.HelloOC("mas is" + JSON.stringify(msg));
                    downAndPlayVoice(msg.uid, msg.msg);
                }
            }
        },
        btn_rank: {
            _layout: [
                [0.1, 0.1],
                [0.95, 0],
                [0, 3]
            ],
            _run: function () {
                this.opacity = 255;
                this.visible = false;
            },
        },
        bg_sort: {
            _layout: [
                [0.5, 0.5],
                [0.5, 0],
                [0, 0]
            ],
            _run: function () {
                this.visible = false;
            },
        },
        btn_sortClass: {
            _layout: [
                [0.14, 0.14],
                [0.78, 0.92],
                [0, 0]
            ],
            _run: function () {
                this.visible = false;
            },
        },
        block_tuoguan: {
            _layout: [
                [1, 1],
                [0.5, 0.5],
                [0, 0],
                true
            ],
            _run: function () {
                this.visible = false;
            },
            btn_tuoguan: {
                _touch: function (btn, eT) {
                    if (eT == 2) {
                        MjClient.gamenet.request("pkroom.handler.tableMsg", { cmd: "cancelTrust" }, function (rtn) {
                            btn.getParent().setVisible(false);
                        });
                    }
                }
            },
            _event: {
                beTrust: function (msg) {
                    cc.log("wxd........beTrust......." + JSON.stringify(msg));
                    if (getUIPlayer(0) && getUIPlayer(0).info.uid == msg.uid) {
                        if (MjClient.movingCard) {
                            MjClient.movingCard.setTouchEnabled(false);
                            MjClient.movingCard.setScale(cardBeginScale);
                            MjClient.movingCard.setTouchEnabled(true);
                        }
                        this.visible = true;
                    }
                },
                cancelTrust: function (msg) {
                    if (getUIPlayer(0) && getUIPlayer(0).info.uid == msg.uid) {
                        this.visible = false;
                    }
                },
                initSceneData: function (msg) {
                    var pl = getUIPlayer(0);
                    if (pl.trust) {
                        this.visible = true;
                    } else {
                        this.visible = false;
                    }
                },
            }
        },
        TG_CountDown: {//托管倒计时
            _visible: false,
            _layout: [[0.6, 0.6], [0.5, 0.5], [0, 0]],
            time: {
                _visible: true,
                _event: {
                    trustTip: function (msg) {
                        this.setString(msg.tipCountDown);
                        var tipCountDown = msg.tipCountDown;
                        var self = this;
                        self.unscheduleAllCallbacks();
                        this.schedule(function () {
                            tipCountDown--;
                            if (tipCountDown <= 0) {
                                self.getParent().setVisible(false);
                                self.unscheduleAllCallbacks();
                                return;
                            }
                            self.setString(tipCountDown);
                        }, 1, cc.REPEAT_FOREVER, 0);
                    },
                    PKPut: function (msg) {
                        this.unscheduleAllCallbacks();
                    },
                }
            },
            _event: {
                trustTip: function (msg) {
                    this.visible = true;
                },
                PKPut: function (msg) {
                    this.visible = false;
                },
                roundEnd: function () {
                    this.visible = false;
                },
                initSceneData: function (msg) {
                    let tData = MjClient.data.sData.tData, rule = tData.areaSelectMode;
                    if (tData.trustAllTime > rule.trustTime) {
                        cc.log('进入托管倒计时前的倒计时')
                    } else if (tData.trustAllTime > 0) {
                        setTimeout(() => {
                            tData.trustAllTime - 1 > 1 && postEvent('trustTip', { tipCountDown: tData.trustAllTime - 1 });
                        }, 1000);
                    }
                }
            }
        },
    },
    _downNode: null,
    _rightNode: null,
    _topNode: null,
    _leftNode: null,
    _btn_rank: null,
    ctor: function () {
        this._super();
        var playui = ccs.load("Play_RunFasterYN.json");

        this.srcMaxPlayerNum = MjClient.MaxPlayerNum;
        MjClient.MaxPlayerNum = parseInt(MjClient.data.sData.tData.maxPlayer);

        let rNum = Math.floor(Math.random() * 3) + 1;
        playMusic("RunFasterYA/effects/background" + rNum);
        this._downNode = playui.node.getChildByName("down");
        this._rightNode = playui.node.getChildByName("right");
        this._topNode = playui.node.getChildByName("top");
        this._leftNode = playui.node.getChildByName("left");
        this._tingCardsNode = this._downNode.getChildByName("tingCardsNode");
        this._tingCardNumNode = this._downNode.getChildByName("tingCardNumNode");

        this._positionCard = playui.node.getChildByName("positionCard");
        this._btnPutCard = playui.node.getChildByName("BtnPutCard");
        this._btnHimt = playui.node.getChildByName("BtnHimt");
        this._btnNoPut = playui.node.getChildByName("BtnNoPut");
        this._noPutTips = playui.node.getChildByName("noPutTips");
        this._btn_rank = playui.node.getChildByName("btn_rank");
        this._bg_sort = playui.node.getChildByName("bg_sort");
        MjClient.playui = this;
        MjClient.playui._AniNode = playui.node.getChildByName("eat");
        MjClient.playui._clock = playui.node.getChildByName("clock");
        this.sortType = MjClient.sortType.normal;
        this.nextSortType = MjClient.sortType.count;

        this._spriteSingle = playui.node.getChildByName("sprite_single");

        MjClient.sortClassType = 0;//util.localStorageEncrypt.getNumberItem(MjClient.sortClassKey,MjClient.sortClassType);
        MjClient.playui.sortType = MjClient.sortType.normal;

        if (MjClient.rePlayVideo != -1)// 表示回放
        {
            MjClient.sortClassType = 0;
            MjClient.playui.sortType = MjClient.sortType.normal;
        }


        this.addChild(playui.node, 0, "playUINode");
        BindUiAndLogic(playui.node, this.jsBind);


        //this._back  = playui.node.getChildByName("back");

        //触摸事件监听注册
        cc.eventManager.addListener(cc.EventListener.create(getTouchListener_card()), this._rightNode);

        // //添加滚动通知 by sking
        // var _laba_bg =  playui.node.getChildByName("banner").getChildByName("laba_bg");
        // _laba_bg.visible = false;
        // var _scroll =  playui.node.getChildByName("banner").getChildByName("scroll");
        // _scroll.visible = false;

        MjClient.playui._jiazhuWait = playui.node.getChildByName("jiazhuWait");

        MjClient.lastMJTick = Date.now();
        this.runAction(cc.repeatForever(cc.sequence(cc.callFunc(function () {
            if (MjClient.game_on_show) MjClient.tickGame(0);
        }), cc.delayTime(7))));

        MJ_setWaitBtn(true);

        // 在亲友圈房间中添加邀请亲友圈牌有一起对局
        addClubYaoqingBtn();
        // 切牌
        if (MjClient.rePlayVideo == -1) {
            this._viewPlayerShuffle = COMMON_UI.createPokerPlayerShuffleView()
            playui.node.addChild(this._viewPlayerShuffle);
            this._viewPlayerShuffle.setPosition(MjClient.size.width / 2, MjClient.size.height / 2);
            this._viewPlayerShuffle.setContentSize(MjClient.size.width, MjClient.size.height);
        }
        return true;
    },
    onEnterTransitionDidFinish: function () {
        //this.setTouchEnabled(true);
        //cc.log("-----------init touch ---- ")
        this._super();
    },

    onExit: function () {
        this._super();
        MjClient.MaxPlayerNum = this.srcMaxPlayerNum;
    },

});

// add...................   Greene
//初始化桌子上的客户端数据c_data..各个游戏的自身数据可以在这里初始，
//尽量不要在外部公共代码判断游戏类型，而是在c_data里初始化数据。
//在PlayLayer的_event 的 initSceneData调用
PlayLayer_NewRunFaster.prototype.InitC_Data = function () {
    if (!MjClient.data.c_Data)
        MjClient.data.c_Data = {};
    cc.log("InitC_Data===========================")
    //出牌是否动画
    MjClient.data.c_Data.bPutCardAnim = false;
    //牌型动画是否是文字图片
    MjClient.data.c_Data.bTxtAnim = true;
}

PlayLayer_NewRunFaster.prototype.cannotOutCardGrey = function () {
    if (MjClient.data.sData.tData.lastPutPlayer == -1 || MjClient.data.sData.tData.lastPutPlayer == MjClient.data.sData.tData.curPlayer)
        return;
    // 三带一、四带二、飞机 不变灰
    var lastPutCard = MjClient.data.sData.tData.lastPutCard
    if (lastPutCard && lastPutCard != -1) {
        var lastCards = [];
        var lastCardsType = MjClient.majiang.calType(lastCards, MjClient.data.sData.tData.areaSelectMode);
        if (lastCardsType == MjClient.majiang.CARDTPYE.sandaiyi || lastCardsType == MjClient.majiang.CARDTPYE.sidaier || lastCardsType == MjClient.majiang.CARDTPYE.feiji) {
            if (MjClient.tipCardsArray.length > 0)
                return;
        }
    }

    var children = this._downNode.children.filter(n=>n.name == 'mjhand');
    for (var i = 0; i < children.length; i++) {
        if (children[i].name != "mjhand")
            continue;

        var point = Math.ceil(children[i].tag / 4);
        var atTipArray = false;
        for (var j = 0, len = MjClient.tipCardsArray.length; j < len; j++) {
            for (var k = 0, len2 = MjClient.tipCardsArray[j].length; k < len2; k++) {
                if (Math.ceil(MjClient.tipCardsArray[j][k] / 4) == point) {
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

PlayLayer_NewRunFaster.prototype.recoverCannotOutCard = function () {
    var children = this._downNode.children;
    for (var i = 0; i < children.length; i++) {
        if (children[i].name != "mjhand")
            continue;

        children[i].cannotOut = false;
        children[i].setColor(MjClient.whiteColor);
    }
}

PlayLayer_NewRunFaster.prototype.clockNumberUpdate = function (node, endFunc, isInstan = false) {
    let tData = MjClient.data.sData.tData,
        rule = tData.areaSelectMode,
        t = rule.tipCountdown || 30;
    if (isInstan && rule.trustTime > 0 && tData.trustAllTime) {
        t = tData.trustAllTime - rule.trustTime - 1;
    }
    if (t <= 0) t = 0;
    return arrowbkNumberUpdate(node, endFunc, t);
}

PlayLayer_NewRunFaster.prototype.updateClockPosition = function (arrowNode) {
    var tData = MjClient.data.sData.tData;
    var curPlayerIndex = (tData.curPlayer + MjClient.MaxPlayerNum - tData.uids.indexOf(SelfUid())) % MjClient.MaxPlayerNum;
    cc.log('-------------------curPlayerIndex--------------', curPlayerIndex)
    var curPlayerNode = null;
    var deskCardPosOffset = {
        x: 0,
        y: 0
    };
    const scN = arrowNode.getScale();
    if (curPlayerIndex == 1) {
        curPlayerNode = this._rightNode;
        if (MjClient.MaxPlayerNum == 2) {
            deskCardPosOffset.x -= arrowNode.width * 1.1 * scN;
            deskCardPosOffset.y -= arrowNode.height / 2 * scN;
        } else {
            deskCardPosOffset.x -= arrowNode.width * 2 * scN;
            deskCardPosOffset.y = arrowNode.height / 2 * scN;
        }
    }
    else if (curPlayerIndex == 2) {
        curPlayerNode = this._topNode;
        if (MjClient.MaxPlayerNum == 4) {
            deskCardPosOffset.x -= arrowNode.width * 1.1 * scN;
            deskCardPosOffset.y -= arrowNode.height / 2 * scN;
        } else {
            deskCardPosOffset.x += arrowNode.width * 2 * scN;
            deskCardPosOffset.y = arrowNode.height / 2 * scN;
        }
    } else if (curPlayerIndex == 3) {
        curPlayerNode = this._leftNode;
        deskCardPosOffset.x += arrowNode.width * 2 * scN;
        deskCardPosOffset.y = arrowNode.height / 2 * scN;
    }
    if (curPlayerNode != null) {
        var deskCardPos = curPlayerNode.getChildByName("head").getPosition();
        deskCardPos.x += deskCardPosOffset.x;
        deskCardPos.y += deskCardPosOffset.y;
        arrowNode.setPosition(deskCardPos);
    }
    else if (isIPhoneX() && MjClient.rePlayVideo != -1 && !MjClient.data.sData.tData.fieldId) {
        var deskCardPos = this._topNode.getChildByName("deskCard").getPosition();
        deskCardPos.x -= 41 * Math.min(MjClient.size.width / 1280, MjClient.size.height / 720) * 2;
        deskCardPos.y = arrowNode.srcPosition.y;
        arrowNode.setPosition(deskCardPos);
    }
    else
        arrowNode.setPosition(arrowNode.srcPosition);

    if (curPlayerNode != null && (tData.curPlayer !== tData.lastPutPlayer)) {
        var children = curPlayerNode.children;
        for (var i = 0; i < children.length; i++) {
            var ni = children[i];
            if (ni.name == "out")
                ni.removeFromParent(true);
        }
    }
}

/**
 * 拼接游戏玩法及付费信息
 * @function
 * @return {String}
 */
PlayLayer_NewRunFaster.prototype.getGameInfoString = function () {
    // var tData = MjClient.data.sData.tData;
    // var rule = tData.areaSelectMode;
    // var str = [];

    // str.push(['每局黑桃五先出', '每局赢家先出'][rule.mustPutHongTaoSan]);
    // rule.Sisters && str.push("姊妹对");
    // rule.AllBlack && str.push("全黑");
    // rule.AllRed && str.push("全红");
    // rule.AllBig && str.push("全大");
    // rule.AllSmall && str.push("全小");
    // rule.AllSingly && str.push("全单");
    // rule.AllDouble && str.push("全双");
    // rule.Four5OrA && str.push("5555，AAAA");
    // rule.FourOther && str.push("4个6-4个K");
    // rule.can3geZha && str.push("3张算炸");
    // rule.can4geZha && str.push("4张算炸");
    // rule.isZhaDanJiaFen && str.push('带炸弹');

    // str.push("底分X" + rule.difen);
    // if (rule.trustTime > 0) {
    //     str.push(rule.trustTime + "秒");
    // }

    // //比赛场
    // if (tData.matchId) {
    //     str.push('10秒出牌');
    //     str = GameCnName[MjClient.gameType] + "," + str.join(',');
    // }
    return ''//str.join(',');
};

PlayLayer_NewRunFaster.prototype.shwoFlyCardAnim = function (flyNode) {
    var tData = MjClient.data.sData.tData;
    var off = getOffByIndex(tData.curPlayer);
    var playerNode = getNode_cards(off);
    if (!playerNode)
        return;

    var headNode = playerNode.getChildByName("head");
    var point = headNode.convertToWorldSpace(cc.p(headNode.width / 2, headNode.height / 2));
    point = flyNode.getParent().convertToNodeSpace(point);
    setCardSprite_card(flyNode, 11, false);
    flyNode.setVisible(true);
    flyNode.setScale(flyNode.getScale() * 1.5);
    flyNode.runAction(cc.sequence(cc.delayTime(0.2), cc.spawn(cc.moveTo(1.0, point), cc.scaleTo(1.0, flyNode.getScale() / 1.5)), cc.callFunc(function () {
        flyNode.setVisible(false);

        if (!MjClient.playui.isFaPai) {
            postCardsEnded();
        }
    })));
}

PlayLayer_NewRunFaster.prototype.showHandCardBeiMian = function () {
    cc.log("showHandCardBeiMian");
    var playerNode = getNode_cards(0);
    var childrens = playerNode.getChildren();
    for (var i = 0; i < childrens.length; i++) {
        if (childrens[i].name != "mjhand")
            continue;

        var beiMain = new cc.Sprite("RunFasterYA/Card/back.png");
        beiMain.setName("beiMain");
        beiMain.setPosition(childrens[i].width / 2, childrens[i].height / 2);
        beiMain.width = childrens[i].width;
        beiMain.height = childrens[i].height;
        childrens[i].addChild(beiMain, 111);
    }
}

PlayLayer_NewRunFaster.prototype.hideHandCardBeiMian = function () {
    cc.log("hideHandCardBeiMian");
    var playerNode = getNode_cards(0);
    var childrens = playerNode.getChildren();
    for (var i = 0; i < childrens.length; i++) {
        if (childrens[i].name != "mjhand")
            continue;

        childrens[i].removeChildByName("beiMain");
    }
}

PlayLayer_NewRunFaster.prototype.CardLayoutRestore = function (node, off, needSort) {
    // 如果正在发牌 不排序
    if (MjClient.playui.isFaPai) return;

    if (cc.isUndefined(needSort))
        needSort = true;

    //先停止手牌的动作，在重排
    StopHandCardAnim(node);

    if (MjClient.sortClassType == 0) {
        cc.log("横向排序");
        MjClient.playui.horSort(node, off, needSort);
    }
    else {
        cc.log("纵向排序");
        MjClient.playui.verSort(node, off, needSort);
    }
};

PlayLayer_NewRunFaster.prototype.CardLayoutDesk = function (node, cards, off) {
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
    var uiHun = [];//癞子牌在最左边

    for (var i = 0; i < children.length; i++) {
        var ci = children[i];
        if (ci.name != "out")
            continue;

        if (MjClient.data.sData.tData.hunCard == ci.tag)
            uiHun.push(ci);
        else
            uiOut.push(ci);
    }

    if (uiHun.length + uiOut.length == 0)
        return;

    var sort = function (node) {
        var pointCounts = {};
        for (var i = 0; i < node.length; i++) {
            var p = MjClient.majiang.calPoint(node[i].tag);
            if (pointCounts[p])
                pointCounts[p]++;
            else
                pointCounts[p] = 1;
        }

        var commonCmp = function (a, b) {
            var c1 = pointCounts[MjClient.majiang.calPoint(a.tag)];
            var c2 = pointCounts[MjClient.majiang.calPoint(b.tag)];
            if (c1 == c2)
                return MjClient.majiang.cardValueCmp(a.tag, b.tag);
            else
                return c1 - c2;
        }

        node.sort(function (a, b) { return -commonCmp(a, b); });
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

    var cardType = MjClient.majiang.cardsType(cards, MjClient.data.sData.tData.areaSelectMode);
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
            if (MjClient.rePlayVideo == -1)  // 表示正常游戏
            {
                if (uiOut.length >= 7)
                    x += width;
            }
            break;
        case 2:
            x = outStand.x;
            x = outStand.x;
            if (MjClient.rePlayVideo == -1)  // 表示正常游戏
            {
                if (uiOut.length >= 6)
                    x -= width;
            }
            break;
        case 3:
            x = outStand.x;
            break;
    }

    //设置麻将大小
    for (var i = 0; i < uiOut.length; i++) {
        uiOut[i].x = x;
        uiOut[i].zIndex = i * 2;

        if ((cardType == MjClient.majiang.CARDTPYE.sandaiyi && i == 2) || (cardType == MjClient.majiang.CARDTPYE.sidaier && i == 3))
            x += outSize.width * outScale * 1.05;
        else
            x += width;
    }
    MjClient.initDesk_y = "undefined";
};

//横向摆放《正常》
PlayLayer_NewRunFaster.prototype.horSort = function (node, off, needSort) {
    var pl; //player 信息
    pl = getUIPlayer(off);//获取玩家信息.off 为0 ，就是自己得信息，能看到自己摸牌 by sking
    if (!pl) return;

    if (MjClient.rePlayVideo != -1)// 表示回放
    {
        MjClient.sortClassType = 0;
        MjClient.playui.sortType = MjClient.sortType.normal;
    }

    var mjhandNum = 0;
    var children = node.children;
    for (var i = 0; i < children.length; i++) {
        var ci = children[i];
        if (ci.name == "mjhand") {
            mjhandNum++;
            if ((typeof MjClient.init_y) == 'undefined') {
                MjClient.init_y = ci.y;
            }

            var _cardType = ci.getChildByName("cardType");
            var _smallFlower = _cardType && _cardType.getChildByName("smallFlower");
            if (_smallFlower) {
                _smallFlower.setPosition(22, 35)
            }
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
    var uihun = [];//癞子牌在最左边

    for (var i = 0; i < children.length; i++) //children 为 "down" 节点下的字节点
    {
        var ci = children[i];
        if (ci.name == "mjhand") {
            if (!ci.cannotOut)
                ci.setColor(cc.color(255, 255, 255));
            uistand.push(ci);
        }
        else if (ci.name == "mjhand_replay") {
            uistand.push(ci);
        }
    }


    /*
     排序方式
     */
    // var pro_rankType = 1;
    // if(off == 0)
    // {
    //     pro_rankType = MjClient.playui.sortType;
    // }

    var pro_rankType = MjClient.playui.sortType;

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
                    copyuistand[k].getUserData() == _colloctionUICards[j].getUserData()) {//这里保存的有可能是我当前选中的牌，这里应该排除我当前选的牌
                    if (!checkUINodeHave(uisort, copyuistand[k])) {
                        colloctionUI.push(copyuistand[k]);//有可能第二次装的数组还是，前一个值，ui节点是同一个。
                        break;
                    }
                }
            }
        }
        uisort[i] = colloctionUI;//保存理牌数组
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
    var mjhandPai = null;
    if (needSort)
        mjhandPai = tempMaJiang.sortHandCards(mjhandCopy, pro_rankType);
    else
        mjhandPai = mjhandCopy.slice();

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
            if (uistand[i].tag == mjhandPai[j])//这张牌，有可能是，理牌里面的牌，也有可能是没理牌的牌
            {
                myUiStand.push(uistand[i]);
                uistand.splice(i, 1);
            }
            else {
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
    if (off == 0)//自己或者对家
    {
        var cardWidth = orders[0] ? orders[0].width * orders[0].scale : 0;
        var screenScale = MjClient.size.width / 1280;
        var areaWidth = MjClient.size.width - screenScale * 30;
        var width = (areaWidth - cardWidth) / (16 - 1) + (16 - orders.length) * 1 * screenScale;
        var startX = screenScale * 20 + (areaWidth - width * (orders.length - 1)) / 2;

        for (var i = 0; i < orders.length; i++) {
            var ci = orders[i];
            ci.x = startX;
            startX += width;
            ci.zIndex = i;
        }
    } else if ((MjClient.MaxPlayerNum == 2 && off == 1) || (MjClient.MaxPlayerNum == 4 && off == 2)) {
        for (var i = 0; i < uistand.length; i++) {
            var ci = uistand[i];
            if (ci.name == "mjhand_replay") {
                if (i != 0) {
                    ci.x = uistand[i - 1].x + upSize.width * upS * 0.3 + (27 - uistand.length) * 0.3;//调牌的距离的，todo...
                }
                else {
                    ci.x = start.x + ((27 - uistand.length) * upSize.width * upS * 0.3) / 3;
                }
                ci.zIndex = i;
            }
        }
    }
    else if (off == 1 || off == 3 || off == 2)//右侧的
    {
        for (var i = orders.length - 1; i >= 0; i--) {
            var ci = orders[i];
            //if(ci.name == orders[i - 1].name)
            {
                if (ci.name == "mjhand_replay") {
                    if (i != orders.length - 1) {
                        ci.y = orders[i + 1].y - upSize.width * upS * 0.3 - (27 - orders.length) * 0.3;//调牌的距离的，todo...
                    }
                    else {
                        ci.y = start.y - upSize.width * upS * 0.2 - ((27 - orders.length) * upSize.width * upS * 0.3) / 3;
                    }
                }
            }
        }

        for (var i = 0; i < orders.length; i++) {
            orders[i].zIndex = (off == 3 || off == 2) ? 20 - i : i;
        }
    }
}

//纵向摆放
PlayLayer_NewRunFaster.prototype.verSort = function (node, off, needSort) {
    if (off != 0) {
        return;
    }
    var pl = getUIPlayer(off);//获取玩家信息.off 为0 ，就是自己得信息，能看到自己摸牌 by sking

    MjClient.playui.sortType = MjClient.sortType.normal;

    var mjhandNum = 0;
    var children = node.children;
    for (var i = 0; i < children.length; i++) {
        var ci = children[i];
        if (ci.name == "mjhand") {
            mjhandNum++;
            if ((typeof MjClient.init_y) == 'undefined') {
                MjClient.init_y = ci.y;
            }

            ci.y = MjClient.init_y;
            //ci.isGray = false;
            var _smallFlower = ci.getChildByName("cardType").getChildByName("smallFlower");
            if (_smallFlower) {
                _smallFlower.setPosition(65, 80);
            }
        }
    }

    var tempMaJiang = MjClient.majiang; //麻将的各种方法判断，是否可以杠，是否可以吃... by sking

    //up stand 是2种麻将的图。
    var up = node.getChildByName("up");
    var stand = node.getChildByName("stand");
    stand.visible = false;
    var start = stand;

    var upSize = start.getSize();
    var upS = start.scale;
    var uistand = [];
    var uisort = [];
    var uihun = [];//癞子牌在最左边

    for (var i = 0; i < children.length; i++) //children 为 "down" 节点下的字节点
    {
        var ci = children[i];
        if (ci.name == "mjhand") {
            //ci.setColor(cc.color(255,255,255));

            uistand.push(ci);
        }
        else if (ci.name == "mjhand_replay") {
            uistand.push(ci);
        }
    }


    /*
     排序方式
     */
    var pro_rankType = 1;
    if (off == 0) {
        pro_rankType = MjClient.playui.sortType;
    }

    if (!pl.mjhand || cc.isUndefined(pl.mjhand)) {
        return;
    }


    //排除理牌的牌
    var mjhandCopy = pl.mjhand.concat();
    var copyuistand = uistand.concat();
    for (var i = 0; i < MjClient.colloctionCardsUIArray.length; i++) {
        var colloctionUI = []; //重新排序后
        var _colloctionUICards = MjClient.colloctionCardsUIArray[i].concat();
        for (var j = 0; j < _colloctionUICards.length; j++) {
            for (var k = 0; k < copyuistand.length; k++) {
                if (copyuistand[k].tag == _colloctionUICards[j].tag &&
                    copyuistand[k].getUserData() == _colloctionUICards[j].getUserData()) {//这里保存的有可能是我当前选中的牌，这里应该排除我当前选的牌
                    if (!checkUINodeHave(uisort, copyuistand[k])) {
                        colloctionUI.push(copyuistand[k]);//有可能第二次装的数组还是，前一个值，ui节点是同一个。
                        break;
                    }
                    break;
                }
            }
        }
        uisort[i] = colloctionUI;//保存理牌数组
        mjhandCopy = getExcludeCards(mjhandCopy, MjClient.colloctionCardsArray[i]);
    }

    cc.log("MjClient.colloctionCardsArray = " + JSON.stringify(MjClient.colloctionCardsArray));


    //理牌的牌，装进数组 mySortui
    var mySortui = [];
    for (var j = 0; j < uisort.length; j++) {
        var uiss = uisort[j];
        for (var i = 0; i < uiss.length; i++) {
            uiss[i].zIndex = 50;
            cc.log("理牌的牌 = " + uiss[i].tag);
            mySortui.push(uiss[i]);
        }
    }

    //理牌后剩下其他的牌
    var mjhandPai = null;
    if (needSort)
        mjhandPai = tempMaJiang.sortHandCards(mjhandCopy, pro_rankType);
    else
        mjhandPai = mjhandCopy.slice();

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


    //重新排序后的牌
    var myUiStand = [];
    for (var j = 0; j < mjhandPai.length; j++) {
        for (var i = 0; i < uistand.length;) {
            if (uistand[i].tag == mjhandPai[j])//这张牌，有可能是，理牌里面的牌，也有可能是没理牌的牌
            {
                myUiStand.push(uistand[i]);
                uistand.splice(i, 1);
            }
            else {
                i++;
            }
        }
    }
    uistand = myUiStand;


    /*
        纵向排序
    */

    //没有理牌的牌，按照牌分别存贮在各个数组里
    var afterSortUI = [];
    var lashCardValue = -1;
    var icount = 0;
    var _length = 0;
    for (var i = 0; i < uistand.length; i++) {
        var _value = getCardValueByID(uistand[i].tag);

        if (lashCardValue != _value) {
            icount = 0;
            lashCardValue = _value;
            _length = afterSortUI.length;
            afterSortUI[_length] = [];
        }
        uistand[i].zIndex = 100;
        afterSortUI[_length][icount] = uistand[i];
        icount++;
    }


    /*
        清除空牌堆
    */
    var _afterSortUI = [];
    for (var i = 0; i < afterSortUI.length; i++) {
        var _uiArray = afterSortUI[i];
        if (_uiArray.length > 0) {
            _afterSortUI.push(_uiArray);
        }
    }
    afterSortUI = _afterSortUI;

    var _uisort = [];
    for (var i = 0; i < uisort.length; i++) {
        var _uiArray = uisort[i];
        if (_uiArray.length > 0) {
            _uisort.push(_uiArray);
        }
    }
    uisort = _uisort;




    //初始化排序的出数值
    var _cardPileLength = afterSortUI.length;//其他牌堆个数
    var _sortPileLength = uisort.length;//理牌堆的个数
    if (uisort.length > 0)//有理牌堆
    {
        _cardPileLength += _sortPileLength;
    }
    MjClient.currentCardPileCount = _cardPileLength;
    var screenX = MjClient.size.width;//屏幕宽度
    var cardX = upSize.width * upS * 1.28;//一张牌的宽度
    var oneX = upSize.width * upS * 1.28;//牌间距
    var dy = upSize.width * upS * 0.55;//竖着的间隙
    var StartX = screenX / 2 - _cardPileLength * cardX / 2 + cardX / 2;
    var StartY = start.y;

    if (_cardPileLength <= 13) {
        oneX = cardX;
    }
    else {
        oneX = cardX - (cardX / 13) * (_cardPileLength - 13);//满屏13张牌，每多一张牌，减除一张牌的宽度
        StartX = screenX / 2 - _cardPileLength * oneX / 2 + oneX / 2;
    }


    /*
      1 先排序理牌的牌
    */
    for (var i = 0; i < uisort.length; i++) {
        var _sortuiArray = uisort[i];
        var x = StartX + oneX * i;
        var y = StartY;
        for (var j = 0; j < _sortuiArray.length; j++) {
            var ci = _sortuiArray[j];
            cc.log("理牌 tag = " + ci.tag);
            ci.x = x;
            ci.y = y + j * dy;
            ci.zIndex -= j * 3;
            ci.zIndex += i * 2;
        }
    }

    /*
       2 排序其他的牌
    */
    StartX += oneX * _sortPileLength;
    for (var i = 0; i < afterSortUI.length; i++) {
        var x = StartX + oneX * i;
        var y = StartY;
        var _uicard = afterSortUI[i];

        for (var j = 0; j < _uicard.length; j++) {
            var ci = _uicard[j];
            ci.x = x;
            ci.y = y + j * dy;
            ci.zIndex -= j * 2;
            ci.zIndex += i * 2;
        }
    }
}
//设置牌的渲染
PlayLayer_NewRunFaster.prototype.setCardSprite_card = function (node, cd, off) {
    node.tag = cd;
    node.loadTexture(this.getSpriteFrameByCard(cd));
}
//获取资源
PlayLayer_NewRunFaster.prototype.getSpriteFrameByCard = function (card) {
    let str = ''
    if (card == -1) {
        str = 'back'
    } else {
        str = (card + 3) % 4 + '-' + Math.ceil(card / 4)
    }
    return 'RunFasterYA/Card/' + str + '.png'
}
/**炸弹即时分 */
PlayLayer_NewRunFaster.prototype.updateBoomScore = function (node, d, isAdd, off) {
    let pl = getUIPlayer(off),
        tData = MjClient.data.sData.tData;
    if (!pl) return;
    if ((pl.info.uid != d.uid && isAdd) || (pl.info.uid == d.uid && !isAdd)) return;
    let booms = tData.areaSelectMode.BombScore * (isAdd ? tData.maxPlayer - 1 : 1),
        ox = node.x;
    node.x -= 100;
    node.setString(booms + '');
    if (off == 0) {
        pl.info.honorVal.honorVal += (isAdd ? 1 : -1) * booms;
        postEvent('changeHonorVal');
    }
    node.zIndex = 999;
    node.visible = true;
    node.runAction(cc.sequence(cc.moveTo(0.5, cc.p(ox, node.y)), cc.delayTime(1), cc.callFunc(() => {
        node.visible = false;
        let coin = node.getParent().getChildByName('head').getChildByName('coin');
        if (coin) {
            let str = coin.getString().split('');
            if (str.indexOf('/') > -1) str.splice(str.indexOf('/'), 1, '-');
            str = str.join("");
            changeAtalsForLabel(coin, Math.floor(parseInt(str) + booms * (isAdd ? 1 : -1)));
        }
    })));
}