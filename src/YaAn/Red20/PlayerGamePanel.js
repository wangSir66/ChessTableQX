var actionZindex = 1000;
//向服务器发送 过消息
MjClient.MJPass2NetForRed20 = function () {
    cc.log("====================send======pass=====");
    var eat = MjClient.playui.jsBind.eat;
    eat.gang0._node.visible = false;
    eat.hu._node.visible = false;
    eat.guo._node.visible = false;
    eat.ting._node.visible = false;
    eat.cancel._node.visible = false;
    eat.chi0._node.visible = false;
    eat.peng._node.visible = false;
    MJPassConfirmToServer();
}

// 这个没看懂干嘛的
// off 是四个位置，根据off 显示四个位置的信息 by sking
function SetUserVisible_Red20(node, off) {
    var pl = getUIPlayer(off);
    var head = node.getChildByName("head");
    var name = head.getChildByName("name");
    var nobody = head.getChildByName("nobody");
    var coin = head.getChildByName("coin");
    var offline = head.getChildByName("offline");
    var name_bg = head.getChildByName("name_bg");
    var score_bg = head.getChildByName("score_bg");
    var toubg = head.getChildByName("tou");
    if (pl) {
        name.visible = true;
        toubg.visible = false;
        coin.visible = true;
        offline.visible = true;
        coin.visible = true;
        name_bg.visible = true;
        score_bg.visible = true;
        MjClient.loadWxHead(pl.info.uid, pl.info.headimgurl);
        setUserOffline(node, off);
        InitUserHandUI_Red20(node, off, false);
    }
    else {
        name.visible = false;
        coin.visible = false;
        offline.visible = false;
        toubg.visible = false;
        coin.visible = false;
        var WxHead = nobody.getChildByName("WxHead");
        if (WxHead) {
            WxHead.removeFromParent(true);
        }
    }
}

function InitUserHandUI_Red20(node, off, action = false) {
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var pl = getUIPlayer(off);
    if (!pl) {
        return;
    }

    //初始化玩家金币和名称
    InitUserCoinAndName(node, off);
    // setAreaTypeInfo(true);
    if (
        tData.tState != TableState.waitPut &&
        tData.tState != TableState.waitEat &&
        tData.tState != TableState.waitCard
    ) {
        return;
    }

    //添加碰
    for (var i = 0; i < pl.mjpeng.length; i++) {
        MjClient.playui.onUserAddWeaves(node, pl.mjpeng[i], 'peng', true, off);
    }


    //添加暗碰
    if (pl.mjanpeng) {
        for (var i = 0; i < pl.mjanpeng.length; i++) {
            MjClient.playui.onUserAddWeaves(node, pl.mjanpeng[i], 'anpeng', true, off);
        }
    }


    //添加明杠
    for (var i = 0; i < pl.mjgang0.length; i++) {
        MjClient.playui.onUserAddGang(node, pl.mjgang0[i], 1, true, off);
    }


    //添加暗杠
    for (var i = 0; i < pl.mjgang1.length; i++) {
        MjClient.playui.onUserAddGang(node, pl.mjgang1[i], 2, true, off);
    }

    //添加偷
    if (pl.touCardList)
        for (var i = 0; i < pl.touCardList.length; i++) {
            let tou = pl.touCardList[i];
            MjClient.playui.TouAndMoveCard(node, { Kings: tou, uid: pl.info.uid }, off);
        }

    //添加吃
    for (var i = 0; i < pl.mjchi.length; i++) {
        MjClient.playui.onUserAddWeaves(node, pl.mjchi[i], 'chi', true, off);
    }

    //添加打出的牌
    for (var i = 0; i < pl.mjput.length; i++) {
        var msg =
        {
            card: pl.mjput[i],
            uid: pl.info.uid
        };


        DealMJPut(node, msg, off, i);
    }

    if (action && MjClient.rePlayVideo == -1) {
        MjClient.playui.onUserNewCard(node, off, off === 0 ? pl.mjhand : (tData.uids[tData.curPlayer] == pl.info.uid ? 8 : 7),
            () => {
                cc.log('---动画完成---');
                MjClient.playui.CardLayoutRestore(node, off, true);
            }, action);
    } else {
        //添加手牌
        if (MjClient.rePlayVideo == -1)// 表示正常游戏
        {
            if (pl.mjhand && off === 0) {
                for (var i = 0; i < pl.mjhand.length; i++) {
                    getNewCard(node, "stand", "mjhand", pl.mjhand[i], off);
                }
            }
            else if (pl.mjhand && pl.mjState === TableState.roundFinish) {
                COMMON_UI.showMjhandBeforeEndOnePlayer(off);
            }
            else if (off > 0) {
                var CardCount = 0;
                if (action) {
                    if (tData.uids[tData.curPlayer] == pl.info.uid) {
                        CardCount = 8;
                    }
                    else {
                        CardCount = 7;
                    }
                } else CardCount = pl.handCount

                for (var i = 0; i < CardCount; i++) {
                    getNewCard(node, "stand", "standPri");
                }
            }
        }
        else {
            /*
                播放录像
             */
            cc.log("_________________mjhand_replay_______________" + JSON.stringify(pl.mjhand));
            if (pl.mjhand) {
                if (off == 0) {
                    for (var i = 0; i < pl.mjhand.length; i++) {
                        getNewCard(node, "stand", "mjhand", pl.mjhand[i], off);
                    }
                }
                else {

                    for (var i = 0; i < pl.mjhand.length; i++) {
                        getNewCard(node, "stand", "mjhand_replay", pl.mjhand[i], off);
                    }
                }
            }

        }
        MjClient.playui.CardLayoutRestore(node, off, true);
    }
}

const initRuleLabel = (rule) => {
    let str = [];
    str.push(rule.MaxPlayerCount + '人' + rule.MaxGameCount + '局');
    str.push(rule.MaxKingCount + '张王');
    str.push('底分' + (rule.BaseScore || 1) + '分');
    if (rule.EnableTTF) str.push("TT番");
    else {
        str.push('跟斗番');
        str.push(rule.MaxFan + '番');
    }
    if (rule.EnableChi) str.push('吃上家牌');
    if (rule.EnableZiMo) str.push('自摸加番');
    if (rule.Enable4Pairs) str.push('4对');
    if (rule.EnableDragon4Pairs) str.push('龙4对');
    if (rule.EnableDoubleDragon4Pairs) str.push('双龙4对');
    if (rule.EnableJinGouDiao) str.push('金钩钓');
    if (rule.EnableGolden20) str.push('金20' + rule.Golden20Fan + '番');
    if (rule.IsCheckTing) str.push('流局査叫');
    else str.push('流局不査叫');
    if (rule.IsCheckFan) str.push('1番起胡');
    else str.push('平胡可胡');
    if (rule.Allow7AsKing) {
        str.push('允许7当王');
        if (rule.IsPoint7AsKing)
            str.push('允许7当王算点');
    }
    else str.push('7不当王');
    if (rule.AllowBaoTing) str.push('报听');
    if (rule.EnableRed20Ting) str.push('满足红点>=20听牌');
    if (rule.Red50) str.push('红50、黑50、红黑50');
    if (rule.AllowSameIP) str.push('同IP可进');
    else str.push('同IP不可进');

    str.push(!rule.gps ? 'GPS(无限制)' : 'Gps不可进');

    if (rule.trustTime) {
        str.push('托管时间' + rule.trustTime + 's');
    } else str.push('不托管');

    return str.join('、');
}

//动画时长
let Red20ActionTime = {
    //从中央落下到牌桌
    Fall: 0.1,
    //玩家出牌 从手牌移动到中央
    HandMoveCenter: 0.2,
    //从中央移动到手牌
    MoveHand: 0.2,
    //自己偷牌，上移200px,上移时间
    MoveUp: 0.2,
    //上移后停顿时间
    UpStop: 0.2,
    //移动到吃碰杠牌堆
    MoveWeaves: 0.2,
    //新进牌，移动到中间 /系统翻牌 /游戏中偷牌(先移动到中间，在移到碰牌堆) /
    MoveCenter: 0.3,
    //其他玩家吃碰杠后在手牌展示停顿时间
    WaitTime: 0.2,
    CenterToHand: 0.3,
}
//间隔
const Red20Space = {
    weavs: [{ x: 5, y: 30 }, { x: 5, y: 20 }, { x: 5, y: 20 }, { x: 5, y: 20 }],
    hand: [{ x: 5, y: 40 }],
}

var PlayerGamePanel_Red20 = cc.Layer.extend({
    _btnPutCard: null,
    jsBind: {
        _event: {
            mjhand: function () {
                if (MjClient.endoneui != null) {
                    cc.log("=======mjhand====endoneui====" + typeof (MjClient.endoneui));
                    MjClient.endoneui.removeFromParent(true);
                    MjClient.endoneui = null;
                }

                var sData = MjClient.data.sData;
                var tData = sData.tData;
                if ((tData.roundNum != tData.roundAll && MjClient.tableid == tData.tableid) || tData.maxPlayer <= 2) return;
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
                if (ipmsg.length > 0 && !tData.matchId) {
                    //if(cc.sys.OS_WINDOWS != cc.sys.os)
                    {
                        //AlertSameIP(ipmsg.join("\n"));
                    }
                }
                mylog("ipmsg " + ipmsg.length);

            },
            LeaveGame: function () {
                MjClient.addHomeView();
                MjClient.playui.removeFromParent(true);
                delete MjClient.playui;
                delete MjClient.endoneui;
                delete MjClient.endallui;
                cc.audioEngine.stopAllEffects();
                playMusic("bgFight_xinsiyang");
            },
            showEndRoom: function (msg) {
                // mylog(JSON.stringify(msg));
                // if (msg.showEnd) this.addChild(new GameOverLayer(), 500);
                // else
                //     MjClient.Scene.addChild(new StopRoomView());
                this.addChild(new GameOverLayer(), 500);
            },
            MJPut: function () {
                var sData = MjClient.data.sData;
                var tData = sData.tData;
                if (tData) {
                    if (tData.fieldId) {//金币场显示场次名称
                        showAndHideHeadEffect();
                    }
                }

            },
            waitPut: function () {
                var sData = MjClient.data.sData;
                var tData = sData.tData;
                if (tData) {
                    if (tData.fieldId) {//金币场显示场次名称
                        showAndHideHeadEffect();
                    }
                }
            },
            roundEnd: function () {
                var jsbs = MjClient.playui.jsBind, arr = [jsbs.down, jsbs.right, jsbs.top, jsbs.left];
                for (let _i = 0; _i < arr.length; _i++) {
                    showMJOutBig(arr[_i]._node, {}, _i);
                }
                MjClient.playui.TableOutData = { pos: -1, Card: 0 };
                MjClient.playui.EatVisibleCheck();
                postEvent('onUserAction', { uid: 0 });
                var self = this;
                function delayExe() {
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    resetEatActionAnim();
                    reConectHeadLayout(self);

                    if (MjClient.isInGoldFieldNormal()) {//金币场普通场
                        self.addChild(new GoldEndOneLayer_MJ(), 500);
                        // if(cc.sys.isObjectValid(MjClient.ActiveGoldPlayingLayer)
                        //     && MjClient.ActiveGoldPlayingLayer.btn_hongbao.truePosition){
                        //     MjClient.playui.setHongBaoPos(MjClient.ActiveGoldPlayingLayer.btn_hongbao)
                        // }
                    } else {
                        // if (sData.tData.roundNum <= 0 && !MjClient.isInGoldFieldNormal()) {
                        //     if (!tData.matchId) {
                        //         self.addChild(new GameOverLayer(), 500);
                        //     } else {
                        //         self.runAction(cc.sequence(cc.delayTime(3), cc.callFunc(function () {
                        //             self.addChild(new GameOverLayer(), 500);
                        //         })))
                        //     }
                        // }
                        self.addChild(new EndOneView_Red20(), 500);
                    }
                }
                if (MjClient.rePlayVideo === -1)    // 正常游戏
                {
                    this.runAction(cc.sequence(cc.delayTime(0.1), cc.callFunc(COMMON_UI.showMjhandBeforeEndOne), cc.delayTime(1.7), cc.callFunc(delayExe)));
                }
                else {
                    this.runAction(cc.sequence(cc.DelayTime(0.2), cc.callFunc(delayExe)));
                }
                var sData = MjClient.data.sData;
                var tData = sData.tData;
                if (tData) {
                    if (tData.fieldId) {//金币场显示场次名称
                        showAndHideHeadEffect();
                    }
                }
            },
            moveHead: function () {
                postEvent("returnPlayerLayer");
                tableStartHeadMoveAction(this);
            },
            initSceneData: function () {
                reConectHeadLayout(this);
                CheckRoomUiDelete();
                var sData = MjClient.data.sData;
                var tData = sData.tData;
                if (tData) {
                    if (tData.fieldId) {//金币场显示场次名称
                        showAndHideHeadEffect();
                    }
                    if (tData._currentCard) {
                        MjClient.rePlayVideo == -1 && postEvent('SystemCard', { Card: tData._currentCard, uid: tData.uids[tData.curPlayer] });
                    }
                    if (tData.curPlayer >= 0 && tData.roomStatus == 102) {
                        MjClient.rePlayVideo == -1 && postEvent('onUserAction', { uid: tData.uids[tData.curPlayer] });
                    }
                }
                let pl = getUIPlayer(0)
                if (pl && pl.mjhand && pl.mjhand.length > 0) {
                    cc.log('---------initSceneData---------场景恢复--', tData._currentCard)
                    MjClient.cardNumImgNode.visible = true;
                    if (pl.eatFlag > 0) {
                        //清空
                        MjClient.majiang.updateActionCard();
                        //查找操作的牌
                        MjClient.majiang.performActionCards(pl);
                    }
                }
            },
            onlinePlayer: function () {
                reConectHeadLayout(this);
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
            changePosition: function (msg) {
                /*
                 换位置
               */
                //var currentSelectCard = msg.selectedCard;
                var change_uids = msg.uids;
                var sData = MjClient.data.sData;
                var tData = sData.tData;
                var current_uids = tData.uids;

                cc.log("LYG changePosition change_uids = " + JSON.stringify(change_uids));
                cc.log("LYG changePosition current_uids = " + JSON.stringify(current_uids));


                //回放的时候
                if (MjClient.rePlayVideo != -1) {
                    tData.uids = msg.uids;//要更新uid位置
                    resetPlayerHead_mj();
                }
                else {
                    MjClient.playui._waitChangePos.visible = true;
                    //牌的翻的效果,正常打牌
                    var _toNodePos = [];
                    var _playerCount = change_uids.length;
                    for (var i = 0; i < 4; i++) {
                        if (_playerCount == 3 && i == 2) {
                            _toNodePos.push(cc.p(0, 0));
                        }
                        else if (_playerCount == 2 && (i == 1 || i == 3)) {
                            _toNodePos.push(cc.p(0, 0));
                        }
                        else {
                            var _toNode = getNode(i).getChildByName("head");
                            _toNodePos.push(_toNode.getPosition());
                        }

                    }

                    for (var i = 0; i < _playerCount; i++) {
                        var change_UIoff = mj_getUiOffByUid(change_uids[i], change_uids);

                        var current_UIoff = mj_getUiOffByUid(change_uids[i], current_uids);

                        if (change_UIoff != current_UIoff) {
                            changePositionByUIoff_mj(current_UIoff, _toNodePos[change_UIoff]);
                        }
                    }

                    MjClient.playui.runAction(cc.sequence(cc.delayTime(0.3), cc.callFunc(function () {
                        tData.uids = msg.uids;//要更新uid位置
                        MjClient.playui._waitChangePos.visible = false;
                        resetPlayerHead_mj();
                    })));
                }
            },
        },
        waitChangePos: {
            _visible: false,
            _layout: [
                [0.4, 0.4],
                [0.5, 0.5],
                [0, 0]
            ],
        },
        cardNumImg: {
            _run: function () {
                MjClient.cardNumImgNode = this;
                setWgtLayout(this, [0.15, 0.15], [0.5, 0.5], [0, 0.25]);
            },
            _event: {
                initSceneData: function (eD) {
                    this.visible = false;
                },
                mjhand: function (eD) {
                    this.visible = true;
                },
                onlinePlayer: function (eD) {
                    // this.visible = IsArrowVisible();
                }
            },
            cardnumAtlas: {
                _run: function () {
                    this.ignoreContentAdaptWithSize(true);
                },
                _text: function () {
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    if (tData) return MjClient.majiang.getAllCardsTotal() - tData.cardNext;
                },
                _event: {
                    changeCardNum: function () {
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;
                        if (tData) {
                            this.setString(MjClient.majiang.getAllCardsTotal() - tData.cardNext);
                            MjClient.cardNumImgNode.visible = true;
                        }
                    }
                }
            }
        },
        back: {
            back: {
                _run: function () {
                    // changeGameBg(this);
                },
                _event: {
                    changeGameBgEvent: function () {
                        changeGameBg(this);
                    }
                },
                _layout: [
                    [1, 1],
                    [0.5, 0.5],
                    [0, 0], true
                ],
            },
            LeftBottom: {
                _layout: [
                    [0.1, 0.1],
                    [0.03, 0.045],
                    [0, 0]
                ],
            },
            RightBottom: {
                _layout: [
                    [0.1, 0.1],
                    [0.97, 0.05],
                    [0, 0]
                ],
            },
            RightTop: {
                _layout: [
                    [0.1, 0.1],
                    [0.97, 0.95],
                    [0, 0]
                ],
            },
            leftTop: {
                _layout: [
                    [0.1, 0.1],
                    [0.03, 0.95],
                    [0, 0]
                ],
            }
        },
        info:
        {
            _visible: false,
            _layout: [
                [0.4, 0.4],
                [0.5, 0.6],
                [0, 0]
            ],
            _event: {
                initSceneData: function () {
                    let tData = MjClient.data.sData.tData, rule = tData.Rule;
                    if (tData.roomStatus != 102 && tData.roundNum == rule.MaxGameCount && tData.cardNext <= 0) {
                        this.setString(initRuleLabel(rule));
                        this.visible = true;
                    } else this.visible = false;
                },
                mjhand: function () {
                    this.visible = false;
                }
            }
        },
        gameName: {
            _visible: false,
            _layout: [
                [0.16, 0.16],
                [0.5, 0.62],
                [0, 1.0]
            ]
        },
        roundInfo: {
            _visible: false,
            _layout: [
                [0.12, 0.12],
                [0.5, 0.38],
                [0, 1.0]
            ],
            _run: function () {
                this.ignoreContentAdaptWithSize(true);

                var sData = MjClient.data.sData;
                var tData = sData.tData;

                if (tData.fieldId) {
                    var payWay = tData.areaSelectMode.payWay;
                    delete tData.areaSelectMode.payWay;
                }
                this.setString(getPlayingRoomInfo(0));
                if (payWay) {
                    tData.areaSelectMode.payWay = payWay;
                }
                if (tData.matchId && tData.matchInfo) {
                    if (MjClient.matchRank) {
                        showPlayUI_matchInfo("排名：" + MjClient.matchRank + "/" + tData.matchInfo.userCount + "\n前" + tData.matchInfo.jingjiCount + "名晋级");
                    } else {
                        showPlayUI_matchInfo("排名：" + tData.matchInfo.userCount + "/" + tData.matchInfo.userCount + "\n前" + tData.matchInfo.jingjiCount + "名晋级");
                    }
                } else {
                    // if (MjClient.rePlayVideo == -1)  // 回放时候不能显示
                    // showPlayUI_roundInfo(this.getString(), tData.fieldId ? (getJinbiStr(MjClient.data.sData.tData.fieldBase) + "金币") : tData.tableid, tData.fieldId ? "底分 " : "");
                }
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
                    _visible: false,
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
                    // updateWifiState(this);
                }
            },
            powerBar: {
                _run: function () {
                    cc.log("powerBar_run");
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
                    if (MjClient.data.sData && MjClient.data.sData.tData && MjClient.data.sData.tData.fieldId) {//金币场显示场次名称
                        this.setString("底分 " + getJinbiStr(MjClient.data.sData.tData.fieldBase) + "金币");
                    }
                },
                _event: {
                    initSceneData: function () {
                        this.ignoreContentAdaptWithSize(true);
                        if (MjClient.data.sData.tData.fieldId) {//金币场显示场次名称
                            this.setString("底分 " + getJinbiStr(MjClient.data.sData.tData.fieldBase) + "金币");
                        } else {
                            this.setString('房间号：' + MjClient.data.sData.tData.tableid);

                        }
                    }
                }
            },
            roundnumAtlas: {
                _visible: function () {
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    if (tData) {
                        if (tData.fieldId) {//金币场显示场次名称
                            return false;
                        }
                    }
                    return true;
                },
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
                    }
                }
            },
            Button_1: {
                _visible: true,
                // _click: function () {
                //     MjClient.openWeb({ url: MjClient.GAME_TYPE.RED_20_POKER, help: true });
                // }
            },
            hunPai: {
                baidaBg: {
                    _run: function () {
                        //baidaBg = this;
                        this.setVisible(false);
                    },
                    _event: {
                        roundEnd: function (eD) {
                            this.visible = false;
                        }
                    },
                },
                baidaText: {
                    _run: function () {
                        //baidaOject = this;
                        this.setVisible(false);
                    },
                    _event: {
                        roundEnd: function (eD) {
                            this.visible = false;
                        }
                    },
                },

            },
        },
        rule_btn: {
            _layout: [
                [0.08, 0.08],
                [0.9, 0.94],
                [0, 0]
            ],
            _run: function () {
                cc.eventManager.addListener(getTouchListener(), this);
                setTimeout(() => {
                    var banner = this.parent,sc = this.getScale();
                    var waitNode = banner.getChildByName("wait");
                    var delroom = waitNode.getChildByName("delroom");
                    var backHomebtn = waitNode.getChildByName("backHomebtn");
                    var distanceX = banner.getChildByName("setting").getPositionX() - banner.getChildByName("rule_btn").getPositionX();
                    delroom.setPosition(waitNode.convertToNodeSpace(banner.convertToWorldSpace(cc.p(this.getPositionX() - distanceX, this.getPositionY()))));
                    backHomebtn.setPosition(waitNode.convertToNodeSpace(banner.convertToWorldSpace(cc.p(this.getPositionX() - 2 * distanceX, this.getPositionY()))));
                    delroom.setScale(sc);
                    backHomebtn.setScale(sc);
                }, 500);
            },
            _touch: function (btn, eT) {
                if (eT == 2) {
                    MjClient.showRuleView = new GameRule_YARed20();
                    MjClient.Scene.addChild(MjClient.showRuleView)
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
            }
        },
        BtnPutCard: { //add by  sking for put card button
            _run: function () {

                var tData = MjClient.data.sData.tData;
                cc.log("BtnPutCard _run set put card btn state = " + tData.tState);

                if (!IsTurnToMe() || tData.tState != TableState.waitPut) {
                    // cc.log(" it's not my turn------------------sking");
                    this.visible = false;
                }
                else {
                    // cc.log(" it's my turn------------------sking");
                    this.visible = true;
                }
                setWgtLayout(this, [0.18, 0.18], [0.82, 0.3], [0.7, -0.1]);
            },
            _click: function (btn) {
                cc.log("点击出牌");
                //var sData = MjClient.data.sData;
                //cc.log("sData.tState == " + sData.tState);
                var downNode = MjClient.playui._downNode;
                var standUI = downNode.getChildByName("stand");
                var children = downNode.children;
                for (var i = 0; i < children.length; i++) {
                    if (children[i].name == "mjhand") {
                        if (children[i].y > standUI.y + 10) {
                            PutOutCard(children[i], children[i].tag); //可以出牌
                            break;
                        }
                    }
                }
                this.visible = false;
            },
            _event: {
                //拿到一张牌的时候，出牌按钮亮起，其他状态隐藏，by sking
                mjhand: function () {
                    this.visible = false;
                    cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>initSceneData");
                },
                MJHu: function () {
                    this.visible = false;
                    cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>mjhand");
                },
                newCard: function (eD) {
                    this.visible = true;
                },
                MJPut: function (eD) {
                    cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>MJPut by sking");
                    this.visible = false;
                },
                MJChi: function (eD) {
                    cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>MJChi by sking");
                    if (IsTurnToMe()) {
                        cc.log(" >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>MJPeng  btn show----");
                        this.visible = true;
                    }
                },
                MJGang: function (eD) {
                    cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>MJGang by sking");
                    if (IsTurnToMe()) {
                        cc.log(" >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>MJPeng  btn show----");
                        this.visible = true;
                    }
                },
                MJPeng: function (eD) {
                    cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>MJPeng by sking");
                    if (IsTurnToMe()) {
                        cc.log(" >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>MJPeng  btn show----");
                        this.visible = true;
                    }
                },
                MJTing: function (eD) {
                    if (MjClient.playui.isCanPutCard()) {
                        this.visible = true;
                        cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>MJTing by sking - hide");
                    } else {
                        this.visible = false;
                    }
                },
                MJPass: function () {
                    var tData = MjClient.data.sData.tData;
                    var pl = getUIPlayer(0);
                    if (tData.tState == TableState.waitPut && pl.mjState == TableState.waitPut) {
                        this.visible = true;
                    }
                },
                initSceneData: function (eD) {

                },
                waitPut: function () {
                    var pl = getUIPlayer(0);
                    var eat = MjClient.playui.jsBind.eat;
                    if (IsTurnToMe() && pl.isTing && !eat.hu._node.visible && !eat.gang0._node.visible && !eat.gang1._node.visible && !eat.gang2._node.visible) {
                        cc.log("*********自动出牌*********");
                        this.runAction(cc.sequence(cc.delayTime(0.8),
                            cc.callFunc(MjClient.playui.jsBind.BtnPutCard._click)));
                    } else {
                        if (MjClient.playui.isCanPutCard()) {
                            cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>isCanPutCard");
                            if (eat.hu._node.visible) {
                                this.visible = false;
                                cc.log("--------------------有胡按钮拉--------------");
                            }
                            else {
                                this.visible = true;
                            }
                        }
                    }
                }
            }
        },//end of add by sking
        down: {
            head: {
                redPoint: {
                    _visible: false
                },
                TG_CountDown: {//托管倒计时
                    _run: function () {
                        this.visible = false;
                        this.ignoreContentAdaptWithSize(true);
                    },
                    _event: {
                        trustTip: function (msg) {
                            if (getUIPlayer(0) && getUIPlayer(0).info.uid == msg.uid) {
                                this.visible = true;
                                this.setString(msg.tipCountDown);
                                var tipCountDown = msg.tipCountDown;
                                var self = this;
                                self.unscheduleAllCallbacks();
                                this.schedule(function () {
                                    self.setString(tipCountDown);
                                    if (tipCountDown > 0) {
                                        tipCountDown--;
                                    } else {
                                        self.setVisible(false);
                                        self.unscheduleAllCallbacks();
                                    }
                                }, 1, cc.REPEAT_FOREVER, 0);
                            }
                        },
                        MJPut: function (msg) {
                            this.visible = false;
                        },
                        roundEnd: function () {
                            this.visible = false;
                        }
                    }
                },
                tuoguan: {
                    _run: function () {
                        this.visible = false;
                    },
                    _event: {
                        beTrust: function (msg) {
                            if (getUIPlayer(0) && getUIPlayer(0) && getUIPlayer(0).info.uid == msg.uid) {
                                this.visible = true;
                            }
                        },
                        cancelTrust: function (msg) {
                            if (getUIPlayer(0) && getUIPlayer(0) && getUIPlayer(0).info.uid == msg.uid) {
                                this.visible = false;
                            }
                        },
                        roundEnd: function () {
                            this.visible = false;
                        },
                        initSceneData: function (msg) {
                            var pl = getUIPlayer(0);
                            if (pl && pl.trust) {
                                this.visible = true;
                            } else {
                                this.visible = false;
                            }
                        }
                    }
                },
                zhuang: {
                    _run: function () {
                        this.visible = false;
                    },
                    _event: {
                        waitPut: function () {
                            showUserZhuangLogo(this, 0);
                        },
                        mjhand: function () {
                            showUserZhuangLogo(this, 0);
                        },
                        initSceneData: function () {
                            if (IsArrowVisible()) showUserZhuangLogo(this, 0);
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
                        setWxHead(this, d, 0);
                    },
                    addPlayer: function (eD) {
                        showFangzhuTagIcon(this, 0);
                    },
                    removePlayer: function (eD) {
                        showFangzhuTagIcon(this, 0);
                    }

                },
                _run: function () {
                    // this.zIndex = 600;
                    showFangzhuTagIcon(this, 0);
                },
                score_bg: { _visible: false },
                name_bg: { _visible: false },
                flower_layout: { _visible: false },
                flower_zfb_layout: { _visible: false },
                tingIcon: {
                    _visible: false,
                    _run: function () {
                        this.visible = false;
                        this.runAction(cc.sequence(cc.spawn(cc.tintTo(0.6, 255, 0, 0), cc.scaleTo(0.6, this.getScale() + 0.3)),
                            cc.spawn(cc.tintTo(0.6, 255, 255, 255), cc.scaleTo(0.6, this.getScale()))).repeatForever());
                    },
                    _event: {
                        clearCardUI: function (eD) {
                            this.visible = false;
                        },
                        MJHu: function (eD) {
                            this.visible = false;
                        },
                        moveHead: function () {
                            MjClient.playui.tingIconVisible(this, 0);
                        },
                        onlinePlayer: function (eD) {
                            //MjClient.playui.tingIconVisible(this,0);
                        },
                        initSceneData: function (eD) {
                            MjClient.playui.tingIconVisible(this, 0);
                        },
                        roundEnd: function () {
                            // cc.log("end rounde------------------------");
                            this.visible = false;
                        }
                    }
                },
                skipHuIconTag: {
                    _visible: false,
                    _event: {
                        clearCardUI: function (eD) {
                            this.visible = false;
                        },
                        MJHu: function (eD) {
                            this.visible = false;
                        },
                        initSceneData: function (eD) {
                            var pl = getUIPlayer(0);
                            cc.log("====================initSceneData=============== pl.skipHu = " + pl.skipHu);
                            if (pl.skipHu) {
                                //var _skipHuIconNode =  MjClient.playui._downNode.getChildByName("head").getChildByName("skipHuIconTag");
                                this.visible = true;
                            }
                        }
                    }
                },
                skipPengIconTag: {
                    _visible: false,
                    _event: {
                        clearCardUI: function (eD) {
                            this.visible = false;
                        },
                        MJpeng: function (eD) {
                            this.visible = false;
                        },
                        initSceneData: function (eD) {
                            var pl = getUIPlayer(0);
                            if (pl.skipPeng && pl.skipPeng.length > 0) {
                                //var _skipHuIconNode =  MjClient.playui._downNode.getChildByName("head").getChildByName("skipHuIconTag");
                                this.visible = true;
                            } else {
                                this.visible = false;
                            }
                        }
                    }

                },
                tou: {
                    _run: function () {
                        this.visible = false;
                    },
                    _event: {
                        MJTou: function (sD) {
                            MjClient.playui.showUserHeadAction(this, 0, sD, 'tou');
                        },
                        KingCard: function (sD) {
                            MjClient.playui.showUserHeadAction(this, 0, sD, 'tou');
                        },
                        MJChi: function (sD) {
                            MjClient.playui.showUserHeadAction(this, 0, sD, 'chi');
                        },
                        MJPeng: function (sD) {
                            MjClient.playui.showUserHeadAction(this, 0, sD, 'peng');
                        },
                        MJGang: function (sD) {
                            sD.ShowAnGang || MjClient.playui.showUserHeadAction(this, 0, sD, 'gang');
                        },
                        MJHu: function (sD) {
                            MjClient.playui.showUserHeadAction(this, 0, sD, 'hu');
                        },
                    }
                }
            },
            play_tips: {
                _layout: [[0.08, 0.14], [0.5, 0.25], [0, 0.5]],
                _run: function () {
                    this.zIndex = actionZindex;
                },
                _visible: false,
            },
            tai_layout: {
                _layout: [
                    [0.018, 0.018],
                    [0, 0],
                    [0, 0.2]
                ],
                tai_info: {
                    _visible: true,
                    _run: function () {
                        this.setString("");
                    }
                },
            },
            ready: {
                _layout: [
                    [0.07, 0.07],
                    [0.5, 0.5],
                    [0, -1.5]
                ],
                _run: function () {
                    GetReadyVisible(this, 0);
                },
                _event: {
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
                        GetReadyVisible(this, 0);
                    }
                }
            },
            stand: {
                _layout: [
                    [0, 0.15],
                    [0, 0],
                    [0.55, 0.5]
                ],
                _visible: false,
                _run: function () {
                    this.width = 90 / 122 * this.height
                },
            },
            up: {
                _layout: [
                    [0.13, 0.13],
                    [0.35, 0],
                    [0.5, 0.8]
                ],
                _visible: false
            },
            down: {
                _layout: [
                    [0.1, 0.1],
                    [0, 0],
                    [0.6, 0.8]
                ],
                _visible: false
            },
            out0: {
                _layout: [[0.0, 0.0763], [0.5, 0.5], [-4, -1.2]],
                _visible: false,
            },
            out1: {
                _layout: [[0.0, 0.0763], [0.5, 0.5], [-4, -2.2]],
                _visible: false,
            },
            out2: {
                _layout: [[0.0, 0.0763], [0.5, 0.5], [-4, -3.2]],
                _visible: false,
            },
            outBig: {
                _layout: [
                    [0.1, 0],
                    [0.5, 0.5],
                    [0, 0]
                ],
                _visible: false
            },
            tingCardsNode: {
                _layout: [[0.25, 0.12], [0.2, 0.25], [0, -0.3]],
                _visible: false,
            },
            tingCardNumNode: {
                _layout: [[0.25, 0.12], [0.12, 0.25], [0, -0.2]],
                _visible: false,
                _event: {
                    clearCardUI: function (eD) {
                        this.visible = false;
                    },
                    MJHu: function (eD) {
                        this.visible = false;
                    },
                    MJPut: function (eD) {
                        this.visible = false;
                    }
                }
            },
            _event: {
                clearCardUI: function () {
                    clearCardUI(this, 0);
                },
                initSceneData: function (eD) {
                    SetUserVisible_Red20(this, 0);
                },
                addPlayer: function (eD) {
                    SetUserVisible_Red20(this, 0);
                },
                removePlayer: function (eD) {
                    SetUserVisible_Red20(this, 0);
                },
                mjhand: function (eD) {
                    InitUserHandUI_Red20(this, 0, true);
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
                    getNewCard(this, "stand", "mjhand", eD.newCard, 0);
                    MjClient.playui.CardLayoutRestore(this, 0);
                },
                MJPut: function (eD) {
                    if (eD.uid === SelfUid()) {
                        showMJOutBig(this, { Card: eD.card, uid: eD.uid }, 0);
                        MjClient.playui.CardLayoutRestore(this, 0);
                        MjClient.playui.jsBind.eat.ting._node.visible = false;//托管清除听牌按钮
                        MjClient.playui.removeHandCard(this, eD.card, 0);
                    }
                    setUserOffline(this, 0);
                },
                MJChi: function (eD) {
                    DealMJChi(this, eD, 0);
                    setUserOffline(this, 0);
                },
                MJGang: function (eD) {
                    eD.ShowAnGang || DealMJGang(this, eD, 0);
                    hideTingBtn();
                    setUserOffline(this, 0);
                },
                MJPeng: function (eD) {
                    DealMJPeng(this, eD, 0);
                    setUserOffline(this, 0);
                },
                MJHu: function (eD) {
                    HandleMJHu(this, eD, 0);
                    setUserOffline(this, 0);
                },
                onlinePlayer: function (eD) {
                    setUserOffline(this, 0);
                },
                playerStatusChange: function (eD) {
                    setUserOffline(this, 0);
                },
                MJFlower: function (eD) {
                    HandleMJFlower(this, eD, 0);
                },
                MJTing: function (eD) {
                    HandleMJTing(this, eD, 0);
                },
                MJTou: function (sD) {
                    MjClient.playui.EatVisibleCheck();
                    MjClient.playui.TouAndMoveCard(this, sD, 0, true);
                },
                //系统发牌
                SystemCard: function (sD) {
                    showMJOutBig(this, sD, 0);
                },
                //游戏中偷牌
                KingCard: function (sD) {
                    MjClient.playui.KingCard(this, sD, 0);
                },
                //游戏中偷牌
                GetNewCard: function (sD) {
                    let cp = getUIPlayer(0);
                    if (cp && cp.info.uid == sD.uid) {
                        cp.mjhand.push(sD.Card);
                        MjClient.playui.onUserNewCard(this, 0, [sD.Card], () => { MjClient.playui.CardLayoutRestore(this, 0); }, true);
                    }
                },

            }
        },
        right: {
            _run: function () {
                this.visible = MjClient.MaxPlayerNum != 2;
            },
            head: {
                tou: {
                    _run: function () {
                        this.visible = false;
                    },
                    _event: {
                        MJTou: function (sD) {
                            MjClient.playui.showUserHeadAction(this, 1, sD, 'tou');
                        },
                        KingCard: function (sD) {
                            MjClient.playui.showUserHeadAction(this, 1, sD, 'tou');
                        },
                        MJChi: function (sD) {
                            MjClient.playui.showUserHeadAction(this, 1, sD, 'chi');
                        },
                        MJPeng: function (sD) {
                            MjClient.playui.showUserHeadAction(this, 1, sD, 'peng');
                        },
                        MJGang: function (sD) {
                            sD.ShowAnGang || MjClient.playui.showUserHeadAction(this, 1, sD, 'gang');
                        },
                        MJHu: function (sD) {
                            MjClient.playui.showUserHeadAction(this, 1, sD, 'hu');
                        },
                    }
                },
                TG_CountDown: {//托管倒计时
                    _run: function () {
                        this.visible = false;
                        this.ignoreContentAdaptWithSize(true);
                    },
                    _event: {
                        trustTip: function (msg) {
                            if (getUIPlayer(1) && getUIPlayer(1).info.uid == msg.uid) {
                                this.visible = true;
                                this.setString(msg.tipCountDown);
                                var tipCountDown = msg.tipCountDown;
                                var self = this;
                                self.unscheduleAllCallbacks();
                                this.schedule(function () {
                                    self.setString(tipCountDown);
                                    if (tipCountDown > 0) {
                                        tipCountDown--;
                                    } else {
                                        self.setVisible(false);
                                        self.unscheduleAllCallbacks();
                                    }
                                }, 1, cc.REPEAT_FOREVER, 0);
                            }
                        },
                        MJPut: function (msg) {
                            this.visible = false;
                        },
                        roundEnd: function () {
                            this.visible = false;
                        }
                    }
                },
                tuoguan: {
                    _run: function () {
                        this.visible = false;
                    },
                    _event: {
                        beTrust: function (msg) {
                            if (getUIPlayer(1) && getUIPlayer(1) && getUIPlayer(1).info.uid == msg.uid) {
                                this.visible = true;
                            }
                        },
                        cancelTrust: function (msg) {
                            if (getUIPlayer(1) && getUIPlayer(1) && getUIPlayer(1).info.uid == msg.uid) {
                                this.visible = false;
                            }
                        },
                        roundEnd: function () {
                            this.visible = false;
                        },
                        initSceneData: function (msg) {
                            var pl = getUIPlayer(1);
                            if (pl && pl.trust) {
                                this.visible = true;
                            } else {
                                this.visible = false;
                            }
                        }
                    }
                },
                zhuang: {
                    _run: function () {
                        this.visible = false;
                    },
                    _event: {
                        waitPut: function () {
                            showUserZhuangLogo(this, 1);
                        },
                        mjhand: function () {
                            showUserZhuangLogo(this, 1);
                        },
                        initSceneData: function () {
                            if (IsArrowVisible()) showUserZhuangLogo(this, 1);
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
                        setWxHead(this, d, 1);
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
                flower_layout: { _visible: false },
                flower_zfb_layout: { _visible: false },
                tingIcon: {
                    _visible: false,
                    _run: function () {
                        this.visible = false;

                        this.runAction(cc.sequence(cc.spawn(cc.tintTo(0.6, 255, 0, 0), cc.scaleTo(0.6, this.getScale() + 0.3)),
                            cc.spawn(cc.tintTo(0.6, 255, 255, 255), cc.scaleTo(0.6, this.getScale()))).repeatForever());
                    },
                    _event: {
                        clearCardUI: function (eD) {
                            this.visible = false;
                        },
                        MJHu: function (eD) {
                            this.visible = false;
                        },
                        moveHead: function () {
                            MjClient.playui.tingIconVisible(this, 1);
                        },
                        onlinePlayer: function (eD) {
                            //MjClient.playui.tingIconVisible(this,1);
                        },
                        initSceneData: function (eD) {
                            MjClient.playui.tingIconVisible(this, 1);
                        },
                        roundEnd: function () {
                            // cc.log("end rounde------------------------");
                            this.visible = false;
                        }
                    }
                }

            },
            play_tips: {
                _layout: [[0.08, 0.14], [0.75, 0.5], [0, 0.5]],
                _run: function () {
                    this.zIndex = actionZindex;
                },
                _visible: false,
            },
            ready: {
                _layout: [
                    [0.07, 0.07],
                    [0.5, 0.5],
                    [2, 0]
                ],
                _run: function () {
                    GetReadyVisible(this, 1);
                },
                _event: {
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
                _layout: [
                    [0, 0.08],
                    [0.87, 0.75],
                    [0, 0]
                ],
                _visible: false
            },
            up: {
                _layout: [
                    [0, 0.07],
                    [1, 0],
                    [-2.0, 3.5]
                ],
                _visible: false
            },
            down: {
                _layout: [
                    [0.08, 0.08],
                    [0.89, 0.55],
                    [0, 0]
                ],
                _visible: false
            },
            out0: {
                _layout: [[0.0, 0.0763], [0.5, 0.5], [2.5, 0.5]],
                _visible: false
            },
            out1: {
                _layout: [[0.0, 0.0763], [0.5, 0.5], [2.5, -0.5]],
                _visible: false
            },
            out2: {
                _layout: [[0.0, 0.0763], [0.5, 0.5], [2.5, -1.5]],
                _visible: false
            },
            outBig: {
                _layout: [
                    [0.1, 0],
                    [0.5, 0.5],
                    [0, 0]
                ],
                _visible: false
            },
            _event: {
                clearCardUI: function () {
                    clearCardUI(this, 1);
                },
                initSceneData: function (eD) {
                    SetUserVisible_Red20(this, 1);
                },
                addPlayer: function (eD) {
                    SetUserVisible_Red20(this, 1);
                },
                removePlayer: function (eD) {
                    SetUserVisible_Red20(this, 1);
                },
                mjhand: function (eD) {
                    InitUserHandUI_Red20(this, 1, true);
                },
                roundEnd: function () {
                    InitUserCoinAndName(this, 1);
                },
                waitPut: function () {
                    DealWaitPut(this, MjClient.data.sData.tData, 1);
                },
                MJPut: function (eD) {
                    let pl = getUIPlayer(1);
                    if (pl && pl.info.uid == eD.uid) {
                        MjClient.rePlayVideo == -1 && RemoveNodeBack(this, "standPri", 1);
                        showMJOutBig(this, { Card: eD.card, uid: eD.uid }, 1);
                        MjClient.playui.removeHandCard(this, eD.card, 1);
                    }
                    if (eD.uid != SelfUid()) {
                        hideTingBtn();
                    }
                    setUserOffline(this, 1);
                },
                MJChi: function (eD) {
                    DealMJChi(this, eD, 1);
                    setUserOffline(this, 1);
                },
                MJGang: function (eD) {
                    DealMJGang(this, eD, 1);
                    setUserOffline(this, 1);
                },
                MJPeng: function (eD) {
                    DealMJPeng(this, eD, 1);
                    setUserOffline(this, 1);
                },
                MJHu: function (eD) {
                    HandleMJHu(this, eD, 1);
                    setUserOffline(this, 1);
                },
                onlinePlayer: function (eD) {
                    setUserOffline(this, 1);
                },
                playerStatusChange: function (eD) {
                    setUserOffline(this, 1);
                },
                MJFlower: function (eD) {
                    HandleMJFlower(this, eD, 1);
                },
                MJTing: function (eD) {
                    HandleMJTing(this, eD, 1);
                },
                MJTou: function (sD) {
                    MjClient.playui.TouAndMoveCard(this, sD, 1, true);
                },
                //系统发牌
                SystemCard: function (sD) {
                    showMJOutBig(this, sD, 1);
                },
                //游戏中偷牌
                KingCard: function (sD) {
                    MjClient.playui.KingCard(this, sD, 1);
                },
                //游戏中偷牌
                GetNewCard: function (sD) {
                    let cp = getUIPlayer(1);
                    if (cp && cp.info.uid == sD.uid)
                        MjClient.playui.onUserNewCard(this, 1, 1, () => { MjClient.playui.CardLayoutRestore(this, 1); }, true);
                },
            }
        },
        top: {
            _run: function () {
                this.visible = MjClient.MaxPlayerNum != 3;
            },
            head: {
                tou: {
                    _run: function () {
                        this.visible = false;
                    },
                    _event: {
                        MJTou: function (sD) {
                            MjClient.playui.showUserHeadAction(this, 2, sD, 'tou');
                        },
                        KingCard: function (sD) {
                            MjClient.playui.showUserHeadAction(this, 2, sD, 'tou');
                        },
                        MJChi: function (sD) {
                            MjClient.playui.showUserHeadAction(this, 2, sD, 'chi');
                        },
                        MJPeng: function (sD) {
                            MjClient.playui.showUserHeadAction(this, 2, sD, 'peng');
                        },
                        MJGang: function (sD) {
                            sD.ShowAnGang || MjClient.playui.showUserHeadAction(this, 2, sD, 'gang');
                        },
                        MJHu: function (sD) {
                            MjClient.playui.showUserHeadAction(this, 2, sD, 'hu');
                        },
                    }
                },
                TG_CountDown: {//托管倒计时
                    _run: function () {
                        this.visible = false;
                        this.ignoreContentAdaptWithSize(true);
                    },
                    _event: {
                        trustTip: function (msg) {
                            if (getUIPlayer(2) && getUIPlayer(2).info.uid == msg.uid) {
                                this.visible = true;
                                this.setString(msg.tipCountDown);
                                var tipCountDown = msg.tipCountDown;
                                var self = this;
                                self.unscheduleAllCallbacks();
                                this.schedule(function () {
                                    self.setString(tipCountDown);
                                    if (tipCountDown > 0) {
                                        tipCountDown--;
                                    } else {
                                        self.setVisible(false);
                                        self.unscheduleAllCallbacks();
                                    }
                                }, 1, cc.REPEAT_FOREVER, 0);
                            }
                        },
                        MJPut: function (msg) {
                            this.visible = false;
                        },
                        roundEnd: function () {
                            this.visible = false;
                        }
                    }
                },
                tuoguan: {
                    _run: function () {
                        this.visible = false;
                    },
                    _event: {
                        beTrust: function (msg) {
                            if (getUIPlayer(2) && getUIPlayer(2) && getUIPlayer(2).info.uid == msg.uid) {
                                this.visible = true;
                            }
                        },
                        cancelTrust: function (msg) {
                            if (getUIPlayer(2) && getUIPlayer(2) && getUIPlayer(2).info.uid == msg.uid) {
                                this.visible = false;
                            }
                        },
                        roundEnd: function () {
                            this.visible = false;
                        },
                        initSceneData: function (msg) {
                            var pl = getUIPlayer(2);
                            if (pl && pl.trust) {
                                this.visible = true;
                            } else {
                                this.visible = false;
                            }
                        }
                    }
                },
                zhuang: {
                    _run: function () {
                        this.visible = false;
                    },
                    _event: {
                        waitPut: function () {
                            showUserZhuangLogo(this, 2);
                        },
                        mjhand: function () {
                            showUserZhuangLogo(this, 2);
                        },
                        initSceneData: function () {
                            if (IsArrowVisible()) showUserZhuangLogo(this, 2);
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
                        setWxHead(this, d, 2);
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
                flower_layout: { _visible: false },
                flower_zfb_layout: { _visible: false },
                tingIcon: {
                    _visible: false,
                    _run: function () {
                        this.visible = false;

                        this.runAction(cc.sequence(cc.spawn(cc.tintTo(0.6, 255, 0, 0), cc.scaleTo(0.6, this.getScale() + 0.3)),
                            cc.spawn(cc.tintTo(0.6, 255, 255, 255), cc.scaleTo(0.6, this.getScale()))).repeatForever());
                    },
                    _event: {
                        clearCardUI: function (eD) {
                            this.visible = false;
                        },
                        MJHu: function (eD) {
                            this.visible = false;
                        },
                        moveHead: function () {
                            MjClient.playui.tingIconVisible(this, 2);
                        },
                        onlinePlayer: function (eD) {
                            //MjClient.playui.tingIconVisible(this,1);
                        },
                        initSceneData: function (eD) {
                            MjClient.playui.tingIconVisible(this, 2);
                        },
                        roundEnd: function () {
                            // cc.log("end rounde------------------------");
                            this.visible = false;
                        }
                    }
                },
            },
            play_tips: {
                _layout: [[0.08, 0.14], [0.5, 0.75], [0, 0]],
                _run: function () {
                    this.zIndex = actionZindex;
                },
                _visible: false,
            },
            ready: {
                _layout: [
                    [0.07, 0.07],
                    [0.5, 0.5],
                    [0, 1.5]
                ],
                _run: function () {
                    GetReadyVisible(this, 2);
                },
                _event: {
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
                _layout: [
                    [0, 0.07],
                    [0.5, 0.95],
                    [-6, -1.0]
                ],
                _visible: false
            },

            up: {
                _layout: [
                    [0, 0.07],
                    [0.5, 1],
                    [6, -1.0]
                ],
                _visible: false,
                _run: function () {
                    this.width = 90 / 122 * this.height
                }
            },
            down: {
                _layout: [
                    [0.08, 0.08],
                    [0.56, 0.8],
                    [0, 0]
                ],
                _visible: false
            },
            out0: {
                _layout: [[0.0, 0.0763], [0.5, 0.5], [-4, 2.2]],
                _visible: false,
            },
            out1: {
                _layout: [[0.0, 0.0763], [0.5, 0.5], [-4, 2.5]],
                _visible: false,
            },
            out2: {
                _layout: [[0.0, 0.0763], [0.5, 0.5], [-4, 2.8]],
                _visible: false,
            },
            outBig: {
                _layout: [
                    [0.1, 0],
                    [0.5, 0.5],
                    [0, 0]
                ],
                _visible: false
            },
            _event: {
                clearCardUI: function () {
                    clearCardUI(this, 2);
                },
                initSceneData: function (eD) {
                    SetUserVisible_Red20(this, 2);
                },
                addPlayer: function (eD) {
                    SetUserVisible_Red20(this, 2);
                },
                removePlayer: function (eD) {
                    SetUserVisible_Red20(this, 2);
                },
                mjhand: function (eD) {
                    InitUserHandUI_Red20(this, 2, true);
                },
                roundEnd: function () {
                    InitUserCoinAndName(this, 2);

                },
                waitPut: function () {
                    DealWaitPut(this, MjClient.data.sData.tData, 2);
                },
                MJPut: function (eD) {
                    let pl = getUIPlayer(2);
                    if (pl && pl.info.uid == eD.uid) {
                        MjClient.rePlayVideo == -1 && RemoveNodeBack(this, "standPri", 1);
                        showMJOutBig(this, { Card: eD.card, uid: eD.uid }, 2);
                        MjClient.playui.removeHandCard(this, eD.card, 2);
                    }
                    if (eD.uid != SelfUid()) {
                        hideTingBtn();
                    }
                    setUserOffline(this, 2);
                },
                MJChi: function (eD) {
                    DealMJChi(this, eD, 2);
                    setUserOffline(this, 2);
                },
                MJGang: function (eD) {
                    DealMJGang(this, eD, 2);
                    setUserOffline(this, 2);
                },
                MJPeng: function (eD) {
                    DealMJPeng(this, eD, 2);
                    setUserOffline(this, 2);
                },
                MJHu: function (eD) {
                    HandleMJHu(this, eD, 2);
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
                },
                MJTou: function (sD) {
                    MjClient.playui.TouAndMoveCard(this, sD, 2, true);
                },
                //系统发牌
                SystemCard: function (sD) {
                    showMJOutBig(this, sD, 2);
                },
                //游戏中偷牌
                KingCard: function (sD) {
                    MjClient.playui.KingCard(this, sD, 2);
                },
                //游戏中偷牌
                GetNewCard: function (sD) {
                    let cp = getUIPlayer(2);
                    if (cp && cp.info.uid == sD.uid)
                        MjClient.playui.onUserNewCard(this, 2, 1, () => { MjClient.playui.CardLayoutRestore(this, 2); }, true);
                },
            }
        },
        left: {
            _run: function () {
                this.visible = MjClient.MaxPlayerNum != 2;
            },
            head: {
                tou: {
                    _run: function () {
                        this.visible = false;
                    },
                    _event: {
                        MJTou: function (sD) {
                            MjClient.playui.showUserHeadAction(this, 3, sD, 'tou');
                        },
                        KingCard: function (sD) {
                            MjClient.playui.showUserHeadAction(this, 3, sD, 'tou');
                        },
                        MJChi: function (sD) {
                            MjClient.playui.showUserHeadAction(this, 3, sD, 'chi');
                        },
                        MJPeng: function (sD) {
                            MjClient.playui.showUserHeadAction(this, 3, sD, 'peng');
                        },
                        MJGang: function (sD) {
                            sD.ShowAnGang || MjClient.playui.showUserHeadAction(this, 3, sD, 'gang');
                        },
                        MJHu: function (sD) {
                            MjClient.playui.showUserHeadAction(this, 3, sD, 'hu');
                        },
                    }
                },
                TG_CountDown: {//托管倒计时
                    _run: function () {
                        this.visible = false;
                        this.ignoreContentAdaptWithSize(true);
                    },
                    _event: {
                        trustTip: function (msg) {
                            if (getUIPlayer(3) && getUIPlayer(3).info.uid == msg.uid) {
                                this.visible = true;
                                this.setString(msg.tipCountDown);
                                var tipCountDown = msg.tipCountDown;
                                var self = this;
                                self.unscheduleAllCallbacks();
                                this.schedule(function () {
                                    self.setString(tipCountDown);
                                    if (tipCountDown > 0) {
                                        tipCountDown--;
                                    } else {
                                        self.setVisible(false);
                                        self.unscheduleAllCallbacks();
                                    }
                                }, 1, cc.REPEAT_FOREVER, 0);
                            }
                        },
                        MJPut: function (msg) {
                            this.visible = false;
                        },
                        roundEnd: function () {
                            this.visible = false;
                        }
                    }
                },
                tuoguan: {
                    _run: function () {
                        this.visible = false;
                    },
                    _event: {
                        beTrust: function (msg) {
                            if (getUIPlayer(3) && getUIPlayer(3) && getUIPlayer(3).info.uid == msg.uid) {
                                this.visible = true;
                            }
                        },
                        cancelTrust: function (msg) {
                            if (getUIPlayer(3) && getUIPlayer(3) && getUIPlayer(3).info.uid == msg.uid) {
                                this.visible = false;
                            }
                        },
                        roundEnd: function () {
                            this.visible = false;
                        },
                        initSceneData: function (msg) {
                            var pl = getUIPlayer(3);
                            if (pl && pl.trust) {
                                this.visible = true;
                            } else {
                                this.visible = false;
                            }
                        }
                    }
                },
                zhuang: {
                    _run: function () {
                        this.visible = false;
                    },
                    _event: {
                        waitPut: function () {
                            showUserZhuangLogo(this, 3);
                        },
                        mjhand: function () {
                            showUserZhuangLogo(this, 3);
                        },
                        initSceneData: function () {
                            if (IsArrowVisible()) showUserZhuangLogo(this, 3);
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
                        setWxHead(this, d, 3);
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
                flower_layout: { _visible: false },
                flower_zfb_layout: { _visible: false },
                tingIcon: {
                    _visible: false,
                    _run: function () {
                        this.visible = false;

                        this.runAction(cc.sequence(cc.spawn(cc.tintTo(0.6, 255, 0, 0), cc.scaleTo(0.6, this.getScale() + 0.3)),
                            cc.spawn(cc.tintTo(0.6, 255, 255, 255), cc.scaleTo(0.6, this.getScale()))).repeatForever());
                    },
                    _event: {
                        clearCardUI: function (eD) {
                            this.visible = false;
                        },
                        MJHu: function (eD) {
                            this.visible = false;
                        },
                        moveHead: function () {
                            MjClient.playui.tingIconVisible(this, 3);
                        },
                        onlinePlayer: function (eD) {
                            //MjClient.playui.tingIconVisible(this,1);
                        },
                        initSceneData: function (eD) {
                            MjClient.playui.tingIconVisible(this, 3);
                        },
                        roundEnd: function () {
                            // cc.log("end rounde------------------------");
                            this.visible = false;
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
                _layout: [
                    [0.07, 0.07],
                    [0.5, 0.5],
                    [-2, 0]
                ],
                _run: function () {
                    GetReadyVisible(this, 3);
                },
                _event: {
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

            up: {
                _layout: [
                    [0, 0.07],
                    [0, 1],
                    [3.0, -3.5]
                ],
                _visible: false
            },
            down: {
                _layout: [
                    [0.08, 0.08],
                    [0.11, 0.55],
                    [0, 0]
                ],
                _visible: false
            },
            stand: {
                _layout: [
                    [0, 0.08],
                    [0, 0.75],
                    [0, 0]
                ],
                _visible: false
            },
            out0: {
                _layout: [[0.0, 0.0763], [0.5, 0.5], [-2.5, 0.5]],
                _visible: false
            },
            out1: {
                _layout: [[0.0, 0.0763], [0.5, 0.5], [-2.5, -0.5]],
                _visible: false
            },
            out2: {
                _layout: [[0.0, 0.0763], [0.5, 0.5], [-2.5, -1.5]],
                _visible: false
            },
            outBig: {
                _layout: [
                    [0.1, 0],
                    [0.5, 0.5],
                    [0, 0]
                ],
                _visible: false
            },
            _event: {
                clearCardUI: function () {
                    clearCardUI(this, 3);
                },
                initSceneData: function (eD) {
                    SetUserVisible_Red20(this, 3);
                },
                addPlayer: function (eD) {
                    SetUserVisible_Red20(this, 3);
                },
                removePlayer: function (eD) {
                    SetUserVisible_Red20(this, 3);
                },
                mjhand: function (eD) {
                    InitUserHandUI_Red20(this, 3, true);
                },
                roundEnd: function () {
                    InitUserCoinAndName(this, 3);
                },
                waitPut: function () {
                    DealWaitPut(this, MjClient.data.sData.tData, 3);
                },
                MJPut: function (eD) {
                    let pl = getUIPlayer(3);
                    if (pl && pl.info.uid == eD.uid) {
                        RemoveNodeBack(this, "standPri", 1);
                        showMJOutBig(this, { Card: eD.card, uid: eD.uid }, 3);
                        MjClient.playui.removeHandCard(this, eD.card, 3);
                    }
                    if (eD.uid != SelfUid()) {
                        hideTingBtn();
                    }
                    setUserOffline(this, 3);
                },
                MJChi: function (eD) {
                    DealMJChi(this, eD, 3);
                    setUserOffline(this, 3);
                },
                MJGang: function (eD) {
                    DealMJGang(this, eD, 3);
                    setUserOffline(this, 3);
                },
                MJPeng: function (eD) {
                    DealMJPeng(this, eD, 3);
                    setUserOffline(this, 3);
                },
                MJHu: function (eD) {
                    HandleMJHu(this, eD, 3);
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
                },
                MJTou: function (sD) {
                    MjClient.playui.TouAndMoveCard(this, sD, 3, true);
                },
                //系统发牌
                SystemCard: function (sD) {
                    showMJOutBig(this, sD, 3);
                },
                //游戏中偷牌
                KingCard: function (sD) {
                    MjClient.playui.KingCard(this, sD, 3);
                },
                //游戏中偷牌
                GetNewCard: function (sD) {
                    let cp = getUIPlayer(3);
                    if (cp && cp.info.uid == sD.uid)
                        MjClient.playui.onUserNewCard(this, 3, 1, () => { MjClient.playui.CardLayoutRestore(this, 3); }, true);
                },
            }
        },
        eat: {
            chi0: {
                _visible: false,
                _layout: [
                    [0, 0.1],
                    [0.5, 0],
                    [1.3, 2.5]
                ],
                _touch: function (btn, eT) {
                    cc.log(">>>> lf，点击吃按钮", btn.name, eT);
                    if (eT == 2) MjClient.playui.OnSendOption(0);
                },
                bg_img: {
                    _run: function () {
                        var _Image_light_scale = this.getScale();

                        var a = cc.scaleTo(0.5, _Image_light_scale * 1.0);
                        var aa = cc.fadeIn(0.5);
                        var a1 = cc.scaleTo(1, _Image_light_scale * 1.3);
                        var a2 = cc.fadeOut(1);
                        var a3 = cc.callFunc(function () {
                            //this.setOpacity(255);
                            this.setScale(_Image_light_scale * 0.95);
                        }.bind(this));

                        this.runAction(cc.sequence(cc.spawn(a, aa), cc.spawn(a1, a2).easing(cc.easeCubicActionOut()), a3, cc.delayTime(0.2)).repeatForever());

                    }

                },
                bgimg: {
                    _run: function () {
                        this.zIndex = -1;
                    }
                },
                bgground: {
                    _run: function () {
                        this.zIndex = -1;
                    }
                },
                card1: {},
                card2: {},
                card3: {}
            },
            chi1: {
                _visible: false,
                _layout: [
                    [0, 0.1],
                    [0.5, 0],
                    [1.3, 3.8]
                ],
                _touch: function (btn, eT) {
                    if (eT == 2) MJChiCardchange(btn.tag);
                }
            },
            chi2: {
                _visible: false,
                _layout: [
                    [0, 0.1],
                    [0.5, 0],
                    [1.3, 5.1]
                ],
                _touch: function (btn, eT) {
                    if (eT == 2) MJChiCardchange(btn.tag);
                }
            },
            ting: {
                _visible: false,
                _layout: [
                    [0, 0.1],
                    [0.5, 0],
                    [1.3, 2.5]
                ],
                bg_img: {
                    _run: function () {
                        var _Image_light_scale = this.getScale();

                        var a = cc.scaleTo(0.5, _Image_light_scale * 1.0);
                        var aa = cc.fadeIn(0.5);
                        var a1 = cc.scaleTo(1, _Image_light_scale * 1.3);
                        var a2 = cc.fadeOut(1);
                        var a3 = cc.callFunc(function () {
                            //this.setOpacity(255);
                            this.setScale(_Image_light_scale * 0.95);
                        }.bind(this));

                        this.runAction(cc.sequence(cc.spawn(a, aa), cc.spawn(a1, a2).easing(cc.easeCubicActionOut()), a3, cc.delayTime(0.2)).repeatForever());

                    }

                },
                _touch: function (btn, eT) {
                    if (eT == 2) {
                        MJTingToServer()
                    }
                }
            },
            noTing: {
                _visible: false,
                _layout: [
                    [0, 0.1],
                    [0.5, 0],
                    [4.6, 2.5]
                ],
                _touch: function (btn, eT) {
                    if (eT == 2) {
                        cc.log("_____noting______");
                        hideTingBtn();
                    }
                }
            },
            peng: {
                _visible: false,
                _layout: [
                    [0, 0.1],
                    [0.5, 0],
                    [0, 2.5]
                ],
                _touch: function (btn, eT) {
                    cc.log(">>>> lf，点击碰按钮", btn.name);
                    if (eT == 2) MjClient.playui.OnSendOption(1);
                },
                bg_img: {
                    _run: function () {
                        var _Image_light_scale = this.getScale();

                        var a = cc.scaleTo(0.5, _Image_light_scale * 1.0);
                        var aa = cc.fadeIn(0.5);
                        var a1 = cc.scaleTo(1, _Image_light_scale * 1.3);
                        var a2 = cc.fadeOut(1);
                        var a3 = cc.callFunc(function () {
                            //this.setOpacity(255);
                            this.setScale(_Image_light_scale * 0.95);
                        }.bind(this));

                        this.runAction(cc.sequence(cc.spawn(a, aa), cc.spawn(a1, a2).easing(cc.easeCubicActionOut()), a3, cc.delayTime(0.2)).repeatForever());

                    }

                },
                bgimg: {
                    _run: function () {
                        this.zIndex = -1;
                    }
                }
            },
            gang0: {
                _visible: false,
                _layout: [
                    [0, 0.1],
                    [0.5, 0],
                    [-1.7, 2.5]
                ],
                bg_img: {
                    _run: function () {
                        var _Image_light_scale = this.getScale();

                        var a = cc.scaleTo(0.5, _Image_light_scale * 1.0);
                        var aa = cc.fadeIn(0.5);
                        var a1 = cc.scaleTo(1, _Image_light_scale * 1.3);
                        var a2 = cc.fadeOut(1);
                        var a3 = cc.callFunc(function () {
                            //this.setOpacity(255);
                            this.setScale(_Image_light_scale * 0.95);
                        }.bind(this));

                        this.runAction(cc.sequence(cc.spawn(a, aa), cc.spawn(a1, a2).easing(cc.easeCubicActionOut()), a3, cc.delayTime(0.2)).repeatForever());

                    }

                },
                card1: {},
                _touch: function (btn, eT) {
                    cc.log(">>>> lf，点击杠按钮", btn.name);
                    if (eT == 2) MjClient.playui.OnSendOption(2);
                },
                bgimg: {
                    _run: function () {
                        this.zIndex = -1;
                    }
                },
                bgground: {
                    _run: function () {
                        this.zIndex = -1;
                    }
                }
            },
            gang1: {
                _visible: false,
                _layout: [
                    [0, 0.1],
                    [0.5, 0],
                    [-1.7, 3.8]
                ],
                card: {},
                _touch: function (btn, eT) {
                    if (eT == 2) MJGangCardchange(btn.tag);
                }
            },
            gang2: {
                _visible: false,
                _layout: [
                    [0, 0.1],
                    [0.5, 0],
                    [-1.7, 5.1]
                ],
                card: {},
                _touch: function (btn, eT) {
                    if (eT == 2) MJGangCardchange(btn.tag);
                }
            },
            guo: {
                _visible: false,
                _layout: [
                    [0, 0.1],
                    [0.5, 0],
                    [4.6, 2.5]
                ],
                _touch: function (btn, eT) {
                    if (eT == 2) {
                        MjClient.MJPass2NetForRed20();
                    }
                },
                bgimg: {
                    _run: function () {
                        this.zIndex = -1;
                    }
                }
            },
            hu: {
                _visible: false,
                _layout: [
                    [0, 0.1],
                    [0.5, 0],
                    [-3, 2.5]
                ],
                bg_img: {
                    _run: function () {
                        var _Image_light_scale = this.getScale();

                        var a = cc.scaleTo(0.5, _Image_light_scale * 1.0);
                        var aa = cc.fadeIn(0.5);
                        var a1 = cc.scaleTo(1, _Image_light_scale * 1.3);
                        var a2 = cc.fadeOut(1);
                        var a3 = cc.callFunc(function () {
                            //this.setOpacity(255);
                            this.setScale(_Image_light_scale * 0.95);
                        }.bind(this));

                        this.runAction(cc.sequence(cc.spawn(a, aa), cc.spawn(a1, a2).easing(cc.easeCubicActionOut()), a3, cc.delayTime(0.2)).repeatForever());

                    }

                },
                _touch: function (btn, eT) {
                    if (eT == 2) MJHuToServer();
                },
                bgimg: {
                    _run: function () {
                        this.zIndex = -1;
                    }
                }
            },
            tou: {
                _visible: false,
                _layout: [
                    [0, 0.1],
                    [0.5, 0],
                    [-3, 2.5]
                ],
                _touch: function (btn, eT) {
                    if (eT == 2) {
                        MJTouToServer();
                        this.visible = false;
                    }
                }
            },
            cancel: {
                _visible: false,
                _layout: [
                    [0, 0.16],
                    [0.78, 0.1],
                    [0, 1.12]
                ],
                _touch: function (btn, eT) {
                    if (eT == 2) {
                        btn.visible = false;
                        MjClient.clickTing = false;
                        hideCurrentTingNum();
                        MjClient.playui.EatVisibleCheck();
                        MjClient.playui.CardLayoutRestore(MjClient.playui._downNode, 0);
                    }
                }
            },
            changeui: {
                _visible: true,
                changeuibg: {
                    _layout: [
                        [0.36, 0.36],
                        [0.5, 0.15],
                        [0, 0]
                    ],
                    _run: function () {
                        this.visible = false;
                        this.getChildByName("card").visible = false;
                        this.chiTouch = function (btn, et) {
                            if (et == 2) {
                                MjClient.playui.OptionToServer(0, btn.tag);
                            }
                        };
                        this.pengTouch = function (btn, et) {
                            if (et == 2) {
                                MjClient.playui.OptionToServer(1, btn.tag);
                            }
                        };
                        this.gangTouch = function (btn, et) {
                            if (et == 2)
                                MjClient.playui.OptionToServer(2, btn.tag);
                        };
                    },
                    guobg: {
                        guo: {
                            _touch: function (btn, eT) {
                                if (eT == 2) MjClient.MJPass2NetForRed20();
                            }
                        },
                        fanhui: {
                            _touch: function (btn, et) {
                                if (et == 2) {
                                    btn.getParent().getParent().visible = false;
                                    MjClient.playui.EatVisibleCheck();
                                }
                            }
                        }
                    }

                }
            },
            playercardtip: {
                _visible: false,
                _layout: [
                    [0.1, 0.1],
                    [0.5, 0],
                    [4.6, 2.5]
                ],
                _event: {
                    TurnMeOutCard: function (sD) {
                        var pl = getUIPlayer(0);
                        cc.log('------TurnMeOutCard--------', pl.info.uid, sD.uid)
                        this.setVisible(pl.info.uid == sD.uid);
                    }
                }
            },
            _event: {
                clearCardUI: function () {
                    MjClient.playui.EatVisibleCheck();
                    hideTingBtn();
                },
                MJPass: function (eD) {
                    cc.log("HHH :，MJPass------");
                    setSkipHuState();
                    setSkipPengState(); // 开启 过碰 机制
                    MjClient.playui.EatVisibleCheck();
                },
                mjhand: function (eD) {
                    cc.log("HHH :，mjhand------");
                    MjClient.playui.EatVisibleCheck();
                },
                waitPut: function () {
                    cc.log("HHH :，waitPut------");
                    MjClient.playui.EatVisibleCheck();
                },
                MJPut: function (eD) {
                    cc.log("HHH :，MJPut------");
                    MjClient.playui.EatVisibleCheck();
                    MjClient.playui.jsBind.eat.playercardtip._node.visible = false;
                },
                MJPeng: function (eD) {
                    cc.log("HHH :，MJPeng------");
                    MjClient.playui.EatVisibleCheck();
                },
                MJChi: function (eD) {
                    cc.log("HHH :，MJChi------");
                    MjClient.playui.EatVisibleCheck();
                },
                MJGang: function (eD) {
                    cc.log("HHH :，MJGang------");
                    MjClient.playui.EatVisibleCheck();
                },
                MJTing: function (eD) {
                    cc.log("HHH :，MJTing------");
                    hideTingBtn();
                    MjClient.playui.jsBind.eat.guo._node.visible = false;
                    isCheckedTing = false;
                },

                OptBtnShow: function (eD) {
                    cc.log("HHH :，OptBtnShow------", eD);
                    MjClient.playui.EatVisibleCheck();
                },
                roundEnd: function (eD) {
                    cc.log("HHH :，roundEnd------");
                    MjClient.playui.EatVisibleCheck();
                },
                initSceneData: function (eD) {
                    function delayExe() {
                        cc.log("MjClient.playui == >");
                        MjClient.playui.EatVisibleCheck();

                    }
                    this.runAction(cc.sequence(cc.DelayTime(0.3), cc.callFunc(delayExe)));
                },
                CancelAction: function (msg) {
                    msg.uid == SelfUid() && MjClient.playui.EatVisibleCheck();
                }
            }
        },
        chat_btn: {
            _layout: [
                [0.08, 0.08], [0.97, 0.05], [0, 3.2]
            ],
            _run: function () {
                if (MjClient.getAppType() == MjClient.APP_TYPE.QXJSMJ && MjClient.data.sData.tData.fieldId) {
                    setWgtLayout(this, [0.09, 0.09], [0.95, 0], [0, 3.7])
                }
            },

            _click: function () {
                var chatlayer = new ChatLayer();
                MjClient.Scene.addChild(chatlayer);
            }
        },
        voice_btn: {
            _layout: [
                [0.08, 0.08], [0.97, 0.15], [0, 3.2]
            ],
            _run: function () {
                initVoiceData();
                if (MjClient.getAppType() == MjClient.APP_TYPE.QXJSMJ && MjClient.data.sData.tData.fieldId) {
                    setWgtLayout(this, [0.09, 0.09], [0.95, 0.1], [0, 3.7])
                }
                cc.eventManager.addListener(getTouchListener(), this);
                if (MjClient.isShenhe) this.visible = false;
                if (MjClient.data.sData.tData.fieldId) {
                    this.setVisible(false);
                }
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
        tuoguan_btn: {
            _layout: [
                [0.09, 0.09],
                [0.95, 0.3],
                [0, 3.7]
            ],
            _run: function () {
                this.setVisible(MjClient.data.sData.tData.fieldId ? true : false);
                if (MjClient.getAppType() == MjClient.APP_TYPE.QXJSMJ && MjClient.data.sData.tData.fieldId) {
                    this.setVisible(false)
                }

            },
            _click: function () {
                MjClient.gamenet.request("pkroom.handler.tableMsg", { cmd: "beTrust" });
            },
            _event: {
                beTrust: function (msg) {
                    if (msg.uid == SelfUid()) {
                        this.enabled = false;
                    }
                },
                cancelTrust: function (msg) {
                    if (msg.uid == SelfUid()) {
                        this.enabled = true;
                    }
                },
                initSceneData: function (msg) {
                    var pl = getUIPlayer(0);
                    if (pl.trust) {
                        this.enabled = false;
                    } else {
                        this.enabled = true;
                    }
                },
            },
        },
        duty_btn: {
            _layout: [
                [0.09, 0.09],
                [0.95, 0.4],
                [0, 3.7]
            ],
            _run: function () {
                if (MjClient.getAppType() == MjClient.APP_TYPE.QXJSMJ && MjClient.data.sData.tData.fieldId) {
                    setWgtLayout(this, [0.09, 0.09], [0.95, 0.2], [0, 3.7])
                }
                this.setVisible(MjClient.data.sData.tData.fieldId ? true : false);
                ShowDayTaskTips(this, "left")
            },
            _click: function () {
                MjClient.Scene.addChild(new GoldTaskLayer());
            },
            Image_hongdian: {
                _run: function () {
                    this.visible = MjClient._GoldFuli;
                },
                _event: {
                    refresh_mission: function () {
                        this.visible = MjClient._GoldFuli;
                    }
                }
            }
        },
        get_gold_btn: {
            _layout: [
                [0.09, 0.09],
                [0.95, 0],
                [0, 3.7]
            ],
            _run: function () {
                if (MjClient.getAppType() == MjClient.APP_TYPE.QXJSMJ) {
                    setWgtLayout(this, [0.09, 0.09], [0.86, 0.94], [0, 0], false, false);
                }
                if (MjClient._GOLD_RECHARGE && MjClient.data.sData.tData.fieldId) {
                    this.setVisible(true);
                } else {
                    this.setVisible(false);
                }

                // 隐藏按钮，暂不开放
                this.setVisible(false);
            },
            _click: function () {
                MjClient.Scene.addChild(new goldStoreLayer());
            }
        },
        block_tuoguan: {
            _layout: [
                [1, 0],
                [0.5, 0],
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
                initSceneData: function (msg) {
                    var pl = getUIPlayer(0);
                    if (pl.trust) {
                        this.visible = true;
                    } else {
                        this.visible = false;
                    }
                },
                roundEnd: function () {
                    this.visible = false;
                }
            }
        },
        myTurnBgd: {
            _visible: false,
            _layout: [
                [1.2, 1.2],
                [0.5, 0.5],
                [0, 0]
            ],
            _event: {
                onUserAction: function (sD) {
                    var pl = getUIPlayer(0);
                    if (!pl) return;
                    this.setVisible(pl.info.uid == sD.uid);
                },
            }
        },
        myTurnBgr: {
            _visible: false,
            _layout: [
                [1.2, 1.2],
                [0.5, 0.5],
                [0, 0]
            ],
            _event: {
                onUserAction: function (sD) {
                    var pl = getUIPlayer(1);
                    if (!pl) return;
                    this.setVisible(pl.info.uid == sD.uid);
                },
            }
        },
        myTurnBgt: {
            _visible: false,
            _layout: [
                [1.2, 1.2],
                [0.5, 0.5],
                [0, 0]
            ],
            _event: {
                onUserAction: function (sD) {
                    var pl = getUIPlayer(2);
                    if (!pl) return;
                    this.setVisible(pl.info.uid == sD.uid);
                },
            }
        },
        myTurnBgl: {
            _visible: false,
            _layout: [
                [1.2, 1.2],
                [0.5, 0.5],
                [0, 0]
            ],
            _event: {
                onUserAction: function (sD) {
                    var pl = getUIPlayer(3);
                    if (!pl) return;
                    this.setVisible(pl.info.uid == sD.uid);
                },
            }
        },
        bounds: {
            _layout: [
                [1, 0.01],
                [0.5, 0.33],
                [0, 0]
            ],
            _visible: false
        }
    },
    _downNode: null,
    _rightNode: null,
    _topNode: null,
    _leftNode: null,
    TableOutData: { pos: -1, Card: 0 },
    clickTime: {
        num: 0,
        time: 0
    },
    ctor: function () {
        this._super();
        this.TableOutData.pos = -1;
        this.TableOutData.Card = 0;
        var playui = ccs.load('Play_Red20.json');
        this.srcMaxPlayerNum = MjClient.MaxPlayerNum;
        MjClient.MaxPlayerNum = parseInt(MjClient.data.sData.tData.maxPlayer);
        cc.log("MjClient.MaxPlayerNum LYG = " + MjClient.MaxPlayerNum);
        playMusic("Red20BGM");
        this._downNode = playui.node.getChildByName("down");
        this._rightNode = playui.node.getChildByName("right");
        this._topNode = playui.node.getChildByName("top");
        this._leftNode = playui.node.getChildByName("left");
        // this._tingCardsNode = this._downNode.getChildByName("tingCardsNode");
        this._tingCardNumNode = this._downNode.getChildByName("tingCardNumNode");
        this._waitChangePos = playui.node.getChildByName("waitChangePos");
        MjClient.playui = this;
        this._btnPutCard = playui.node.getChildByName("BtnPutCard");
        MjClient.playui._AniNode = playui.node.getChildByName("eat");

        BindUiAndLogic(playui.node, this.jsBind);

        // 添加光晕动画
        COMMON_UI.addAniEatCardsBtn();

        this.addChild(playui.node);

        MjClient.lastMJTick = Date.now();
        this.runAction(cc.repeatForever(cc.sequence(cc.callFunc(function () {
            if (MjClient.game_on_show) MjClient.tickGame(0);
        }), cc.delayTime(7))));

        //初始化其他功能
        initSceneFunc(true);
        // 在亲友圈房间中添加邀请亲友圈牌有一起对局
        addClubYaoqingBtn(1);
        Red20ActionTime = {
            //从中央落下到牌桌
            Fall: 0.1,
            //玩家出牌 从手牌移动到中央
            HandMoveCenter: 0.2,
            //从中央移动到手牌
            MoveHand: 0.2,
            //自己偷牌，上移200px,上移时间
            MoveUp: MjClient.rePlayVideo == -1 ? 0.2 : 0,
            //上移后停顿时间
            UpStop: MjClient.rePlayVideo == -1 ? 0.2 : 0,
            //移动到吃碰杠牌堆
            MoveWeaves: MjClient.rePlayVideo == -1 ? 0.2 : 0,
            //新进牌，移动到中间 /系统翻牌 /游戏中偷牌(先移动到中间，在移到碰牌堆) /
            MoveCenter: MjClient.rePlayVideo == -1 ? 0.3 : 0,
            //其他玩家吃碰杠后在手牌展示停顿时间
            WaitTime: MjClient.rePlayVideo == -1 ? 0.2 : 0,
            CenterToHand: MjClient.rePlayVideo == -1 ? 0.3 : 0,
        }
        return true;
    },
    onExit: function () {
        this._super();
        MjClient.MaxPlayerNum = this.srcMaxPlayerNum;
    },
    /*
        判断当前是否可以出牌，add by sking
     */
    isCanPutCard: function () {
        var bPut = false;
        var downNode = MjClient.playui._downNode;
        var standUI = downNode.getChildByName("stand");
        var children = downNode.children;
        for (var i = 0; i < children.length; i++) {
            if (children[i].name == "mjhand") {
                if (children[i].y > standUI.y + 10) {
                    bPut = true;
                    break;
                }
            }
        }
        return bPut;
    },
    /*
     设置听的icon 是否可见 add by sking
     */
    tingIconVisible: function (node, off) {
        var pl = getUIPlayer(off)
        if (pl == null) return;
        var tData = MjClient.data.sData.tData;


        if (pl && (pl.mjState == TableState.isReady || pl.mjState == TableState.roundFinish)) {
            //准备状态时，所有的听Icon不可见
            //var node = node.getParent().getParent().getParent().getChildByName("")
            var _tingIcon1 = this._downNode.getChildByName("head").getChildByName("tingIcon");
            _tingIcon1.visible = false;

            var _tingIcon2 = this._rightNode.getChildByName("head").getChildByName("tingIcon");
            _tingIcon2.visible = false;

            var _tingIcon3 = this._topNode.getChildByName("head").getChildByName("tingIcon");
            _tingIcon3.visible = false;

            var _tingIcon4 = this._leftNode.getChildByName("head").getChildByName("tingIcon");
            _tingIcon4.visible = false;
            // cc.log("(((((((((((( TableState.isReady))))))))))))))))) == TableState.isReady  " + TableState.isReady);
            node.visible = false;
        } else {
            if (pl != null) {
                if (pl.isTing) {
                    node.visible = true;
                } else {
                    node.visible = false;
                }

                if (off === 0) {
                    var tingSet = calTingSet(pl.mjhand);
                    setTingCards(this._tingCardsNode, tingSet);
                }
            }
        }
        return node.visible;
    }
});

PlayerGamePanel_Red20.prototype.getNewCard = function (node, copy, name, tag, off, specialTAG) {
    var cpnode = node.getChildByName(copy);
    var cp = cpnode.clone(); //克隆一个白板，上面没有任何条纹的麻将 ，by sking
    if (copy == "stand") {
        if (!cpnode.standScale) cpnode.standScale = cpnode.getScale();
    }

    var scale = cp.getScale() * 1.15;
    if (name == "mjhand") {
        scale = cp.getScale() * 1.30;
    }
    cp.setScale(scale);
    cp.visible = true;
    if (tag == 999) {
        cp.visible = false;
    }
    cp.name = name;
    cp.currentScale = scale;

    if (specialTAG == "isgang4") {
        cp.isgang4 = true;
    }
    else if (specialTAG == "heng") {
        cp.heng = true;
    }
    node.addChild(cp);

    if (tag > 0) {
        //创建一个带有麻将信息的麻将 cp为创建后的麻将
        setCardSprite(cp, tag, name == "mjhand" ? 4 : off);
        if (name == "mjhand" || name == "mjting") {
            SetTouchCardHandler(cpnode, cp);
        }
    }
    else {
        cp.loadTexture(this.getSpriteFrameByCard(-1));
    }
    return cp;
}
//设置回调，并处理回调
PlayerGamePanel_Red20.prototype.SetTouchCardHandler = function (standUI, cardui) {
    cardui.addTouchEventListener(function (btn, tp) {
        // var tData = MjClient.data.sData.tData;
        var pl = getUIPlayer(0),
            flg = MjClient.playui.isCanTouch ? MjClient.playui.isCanTouch(cardui, btn, tp) : COMMON_UI.isCanTouch(cardui, btn, tp);
        cc.log('--------SetTouchCardHandler-----', flg)
        //返回false 表示不能出牌,增强可读性  by sking 2018.12.6
        if (!flg) return;
        var bounds = MjClient.playui.jsBind.bounds._node;
        if (tp == ccui.Widget.TOUCH_BEGAN) {
            playEffect("cardClick");
            let t = new Date().getTime();
            if (t - MjClient.playui.clickTime.time > 200) {
                MjClient.playui.clickTime.num = 1;
                MjClient.playui.clickTime.time = t + 200;
            } else MjClient.playui.clickTime.num++;
            MjClient.movingCard = btn;
            MjClient.selectedCard = btn;
            cardBeginPos = btn.getPosition();
            cardBeginScale = btn.getScale();
            cardBeginZIndex = btn.zIndex;
            bIsPut = true;
            bStartMoved = false;
            bounds.visible = true;
            btn.zIndex = 999;
        }
        else if (tp == ccui.Widget.TOUCH_MOVED) {

            if (MjClient.movingCard == null) {
                return;
            }
            bStartMoved = true;
            var pos = btn.getTouchMovePosition();
            if (pos.x < 0) pos.x = 0;
            if (pos.x > MjClient.size.width) pos.x = MjClient.size.width;
            if (pos.y < 0) pos.y = 0;
            if (pos.y > MjClient.size.height) pos.y = MjClient.size.height;
            btn.setPosition(pos);
            if (pos.y < bounds.y) {
                bIsPut = false;
                btn.scale = cardBeginScale * 0.85;
            } else {
                bIsPut = true;
            }
        }
        else if (tp === ccui.Widget.TOUCH_ENDED || tp === ccui.Widget.TOUCH_CANCELED) {
            bounds.visible = false;
            if (MjClient.movingCard == null) {
                bStartMoved = false;
                return;
            }
            btn.zIndex = cardBeginZIndex;
            btn.scale = cardBeginScale;
            if (!bIsPut) //撤销这张牌
            {
                bStartMoved = false;
                MjClient.movingCard = null;
                btn.setPosition(cardBeginPos);
                return;
            }
            let t = new Date().getTime();
            if ((t - MjClient.playui.clickTime.time > 200 || MjClient.playui.clickTime.num != 2) && !bStartMoved) {
                MjClient.movingCard = null;
                bStartMoved = false;
                return;
            }
            bStartMoved = false;
            MjClient.playui.clickTime.num = 0;
            MjClient.playui.clickTime.time = 0;
            PutOutCard(cardui, cardui.tag);
        }
    }, cardui);
}
//获取资源
PlayerGamePanel_Red20.prototype.getSpriteFrameByCard = function (card) {
    let str = ''
    if (card == -1) {
        str = 'back'
    } else {
        str = MjClient.majiang.getCardColor(card) + '-' + MjClient.majiang.getCardNum(card)
    }
    return 'Red20/Card/' + str + '.png'
}
//设置牌的渲染
PlayerGamePanel_Red20.prototype.setCardSprite = function (node, cd, off) {
    //麻将的底牌公用图，4张
    node.loadTexture(this.getSpriteFrameByCard(cd));

    if (cc.sys.isObjectValid(node) && cd != null && typeof (cd) != "undefined") {
        node.tag = cd;
    }
    //调牌背和牌面的大小
    // setMJDif(node, off);
}
/**
 * 适配牌位置--无动画
 * @param {节点} node 当前需要适配的父节点
 * @param {0,1,2,3} off 物理座位号位置
 */
PlayerGamePanel_Red20.prototype.CardLayoutRestore = function (node, off, first = false) {
    var pl = getUIPlayer(off);//获取玩家信息.off 为0 ，就是自己得信息，能看到自己摸牌 by sking
    //mjhand standPri out chi peng gang0 gang1
    var uipeng = [];
    var uigang0 = [];
    var uigang1 = [];
    var uichi = [];
    var uistand = [];
    var uiTou = [];
    var children = node.children;
    for (var i = 0; i < children.length; i++) //children 为 "down" 节点下的字节点
    {
        var ci = children[i];
        if (ci.name == "mjhand" || ci.name == "standPri" || ci.name == "mjhand_replay") uistand.push(ci);
        else if (ci.name == "gang0") {
            uigang0.push(ci);
        }
        else if (ci.name == "gang1") {
            uigang1.push(ci);
        }
        else if (ci.name == "chi") {
            uichi.push(ci);
        }
        else if (ci.name == "peng") {
            uipeng.push(ci);
        }
        else if (ci.name == "tou") {
            uiTou.push(ci);
        }
    }
    //手牌
    if (uistand.length > 0) {
        //up--开始位置 stand--大小与距离。
        var up = node.getChildByName("up");
        var stand = node.getChildByName("stand");
        var start, offui;
        switch (off) {
            case 0:
                start = up;
                offui = stand;
                break;
            case 1:
                start = stand;
                offui = up;
                break;
            case 2:
                start = stand;
                offui = up;
                break;
            case 3:
                start = stand;
                offui = up;
                break;
        }
        var upSize = offui.getSize();
        var upS = offui.scale;
        //自己 或者回放
        if (off == 0) {
            const hand = MjClient.majiang.StackCards(pl.mjhand, first);
            let c_of = null;
            for (let _i = 0; _i < hand.length; _i++) {
                const cs = hand[_i];
                cs.sort(function (a, b) {
                    return b - a;
                });
                let ar = [];
                for (let _j = 0; _j < cs.length; _j++) {
                    const c = cs[_j];
                    let ci = null;
                    for (let _k = 0; _k < uistand.length; _k++) {
                        const ui = uistand[_k];
                        if (ui.tag == c) {
                            ci = ui;
                            uistand.splice(_k, 1);
                            break;
                        }
                    }
                    if (ci) {
                        ar.push(ci);
                        if (_i == 0) {
                            ci.x = start.x + upSize.width * upS * (off == 0 ? 0.1 : 1);
                        } else if (_j != 0) {
                            ci.x = c_of;
                        } else {
                            ci.x = c_of + upSize.width * upS * (off == 0 ? 1.3 : 1.8);
                        }
                        if (_j == 0) c_of = ci.x;
                        ci.y = start.y + upSize.height * upS * 0.54 * _j;
                    }
                }
                if (ar.length > 1) {
                    ar.map((a, idx) => {
                        a.zIndex = ar.length - 1 - idx
                    })
                }
            }
        } else {
            for (let _i = 0; _i < uistand.length; _i++) {
                const cui = uistand[_i];
                if (_i == 0) {
                    cui.x = start.x + upSize.width * upS;
                } else {
                    cui.x = uistand[_i - 1].x + upSize.width * upS * 0.42;
                }
            }
        }
    }

    //刷新手牌
    if (COMMON_UI3D.is3DUI()) {
        COMMON_UI3D.set3DCardSprite(off);
    }
    else {
        //刷新手牌大小
        resetCardSize();
    }
    this.updateRedPointCount();
}

// 判断吃碰杠胡的状态
PlayerGamePanel_Red20.prototype.EatVisibleCheck = function () {
    var eat = MjClient.playui.jsBind.eat;
    //sk 为啥要隐藏掉？   //因为一开始是不可见的，隐藏根节点 by sking
    MjClient.playui.jsBind.eat.changeui.changeuibg._node.visible = false;
    var sData = MjClient.data.sData;
    var tData = sData.tData;

    eat.chi0._node.visible = false;
    eat.chi1._node.visible = false;
    eat.chi2._node.visible = false;
    eat.peng._node.visible = false;
    eat.gang0._node.visible = false;
    eat.gang1._node.visible = false;
    eat.gang2._node.visible = false;
    eat.hu._node.visible = false;
    eat.guo._node.visible = false;
    eat.cancel._node.visible = false;
    eat.tou._node.visible = false;
    eat.ting._node.visible = false;


    var pl = sData.players[SelfUid() + ""];
    MjClient.gangCards = [];
    MjClient.eatpos = [];
    MjClient.pengCards = [];
    //吃碰杠胡node
    var vnode = [];
    if (pl && pl.eatFlag > 0) {
        var actionList = MjClient.majiang.actionCardList;
        cc.log('-----当前检测出来的可操作的牌----', JSON.stringify(actionList));
        let getActionCards = (type) => {
            let list = actionList.filter(value => {
                return value.type === type;
            })
            //去重
            let newlist = [];
            list.forEach(value => {
                let aa = newlist.find(val => {
                    return val.type === value.type && val.card === value.card;
                })
                if (!aa) {
                    newlist.push(value);
                }
            })
            return newlist;
        }

        let haveGuo = !pl.isTing;
        if (pl.eatFlag & 16) {
            haveGuo = false;
            vnode.push(eat.tou._node);
        }
        pl.eatFlag & 32 && vnode.push(eat.ting._node);
        if (pl.eatFlag & 1) {
            let list = getActionCards('chi');
            let Cards = [], nd = eat.chi0._node;
            list.forEach(value => {
                Cards.push(value.card);
            })
            MjClient.eatpos = Cards;
            vnode.push(nd);
        }
        if (pl.eatFlag & 4) {
            let list = getActionCards('gang');
            let Cards = [];
            list.forEach(value => {
                Cards.push(value.card);
            })
            vnode.push(eat.gang0._node);
            MjClient.gangCards = Cards;
        }
        if (pl.eatFlag & 2) {
            let list = getActionCards('peng');
            let Cards = [];
            list.forEach(value => {
                Cards.push(value.card);
            })
            MjClient.pengCards = Cards;
            vnode.push(eat.peng._node);
        }
        pl.eatFlag & 8 && vnode.push(eat.hu._node);
        vnode.length > 0 && haveGuo && vnode.push(eat.guo._node);
    }

    //吃碰杠胡过处理
    if (vnode.length > 0) {
        var btnImgs =
        {
            "peng": ["Red20/Controller/btn_peng.png", "Red20/Controller/btn_peng.png"],
            "gang0": ["Red20/Controller/btn_gang.png", "Red20/Controller/btn_gang.png"],
            "ting": ["Red20/Controller/btn_ting.png"],
            "guo": ["Red20/Controller/btn_guo.png"],
            "chi0": ["Red20/Controller/btn_chi.png", "Red20/Controller/btn_chi.png"],
            "hu": ["Red20/Controller/btn_hu.png", "Red20/Controller/btn_hu.png"],
        }

        for (var i = 0; i < vnode.length; i++) {
            vnode[i].visible = true;

            if (vnode[i].getChildByName("card1")) {
                vnode[i].getChildByName("card1").visible = false;
            }

            if (vnode[i].getChildByName("bgground")) {
                vnode[i].getChildByName("bgground").visible = false;
            }

            if (vnode[i].getChildByName("bgimg")) {
                vnode[i].getChildByName("bgimg").visible = true;
            }

            var btnName = vnode[i].name;

            if (btnName == "ting" || btnName == "peng" || btnName == "guo" || btnName == "gang0" || btnName == "chi0" || btnName == "hu") {
                vnode[i].loadTextureNormal(btnImgs[btnName][0]);
                // vnode[i].loadTexturePressed(btnImgs[btnName][1]);
            }

            setWgtLayout(vnode[i], [0, 0.2], [0.5, 0], [(1 - vnode.length) / 1.8 + i * 1.2, 1.8], false, false);
        }
    }
    /*吃碰杠按钮，适配iOS*/
    COMMON_UI.vnodeAdaptForiOS(vnode);

    // if (eat.hu._node.visible) {
    //     MjClient.playui._btnPutCard.visible = false;
    // }
};

/**
 * 偷牌的过程
 * @param {父节点} node 
 * @param {偷数据} msg 
 * @param {方位} off 
 */
PlayerGamePanel_Red20.prototype.TouAndMoveCard = function (node, msg, off, isAction = false, stNode = null, addC = true) {
    let Kings = msg.Kings || [], addCards = msg.Cards || [];
    let cp = getUIPlayer(off);
    if (cp && cp.info.uid == msg.uid) {
        let Wang7 = Kings.filter(card => {
            return MjClient.majiang.getCardNum(card) === 7;
        }), Wang = Kings.filter(card => {
            return MjClient.majiang.getCardColor(card) === 4;
        });
        let endNode = [];
        if (Wang.length > 0) endNode = this.onUserAddWeaves(node, Wang, 'wang', !isAction, off);
        if (Wang7.length > 0) endNode = endNode.concat(this.onUserAddWeaves(node, Wang7, '7ToWang', !isAction, off));
        cc.log('---------lengh', endNode.length)
        if (!isAction) return;
        //从手牌中移除王
        let startNodeInfo = stNode ? [stNode] : this.onRemoveUserHandCard(node, Kings, off);
        //移动的节点
        let actionInfos = [];
        for (let _i = 0; _i < endNode.length; _i++) {
            const action = {}, wang = endNode[_i];
            action.endNode = wang;
            for (let _j = 0; _j < startNodeInfo.length; _j++) {
                const start = startNodeInfo[_j];
                if (start.tag === wang.tag) {
                    action.startNode = start;
                    startNodeInfo.splice(_j, 1);
                    break;
                }
            }
            if (!action.startNode) action.startNode = startNodeInfo.shift();
            action.card = wang.tag;
            actionInfos.push(action);
        }
        //移动动画
        this.addweavesAction(actionInfos, (off === 0 || MjClient.rePlayVideo != -1) && !stNode ? true : false);
        let func = (act) => {
            this.CardLayoutRestore(node, off);
            (off === 0 || MjClient.rePlayVideo != -1) && (cp.mjhand = cp.mjhand.concat(addCards));
            addC && this.onUserNewCard(node, off, (off === 0 || MjClient.rePlayVideo != -1) ? addCards : Kings.length, () => { cc.log('---我觉得回家---'); this.CardLayoutRestore(node, off); }, act);
        }
        if (!addC) {
            func(false);
        } else {
            setTimeout(() => {
                func(true);
            }, 0.9 * 1000);
        }
    }
}
//玩家摸牌
PlayerGamePanel_Red20.prototype.onUserNewCard = function (node, off, cards, call = null, isAction = false) {
    let endCard = this.setUserHandCards(node, off, cards, !isAction);
    if (!isAction) {
        call && call();
        return;
    }
    let n = MjClient.playui.jsBind.cardNumImg._node, endPos = cc.p(n.x, n.y);
    for (let _i = 0; _i < endCard.length; _i++) {
        let end = endCard[_i];
        let cd = getNewCard(node, 'stand', 'movecard');
        cd.setPosition(endPos);
        cd.visible = true;
        cd.setScale(0);
        //移动到最后位置
        let moveLast = cc.moveTo(Red20ActionTime.CenterToHand, end.x, end.y);
        cd.runAction(cc.sequence(cc.delayTime(0.02 * _i), cc.spawn(cc.scaleTo(Red20ActionTime.CenterToHand, end.scale), moveLast), cc.callFunc(() => {
            if (off == 0 || MjClient.rePlayVideo != -1) {
                //翻转
                let sc = end.scale;
                cd.runAction(cc.sequence(cc.delayTime(0.1), cc.scaleTo(0.05, 0.2, sc), cc.callFunc(() => {
                    end.setScale(0.2, sc);
                    end.setOpacity(255);
                    cd.setOpacity(0);
                    cd.removeFromParent(true);
                    end.runAction(cc.sequence(cc.scaleTo(0.05, sc, sc), cc.callFunc(() => {
                        call && call();
                    })))
                })));
            } else {
                end.setOpacity(255);
                cd.setOpacity(0);
                cd.removeFromParent(true);
                call && call();
            }
        })))
    }
}
//更新玩家红点
PlayerGamePanel_Red20.prototype.updateRedPointCount = function () {
    let num = 0, pl = getUIPlayer(0), node = getNode(0);
    if (!pl || !node || !pl.mjhand) return;
    let Rule = MjClient.data.sData.tData.Rule;
    //手牌
    pl.mjhand.forEach(card => {
        //wang
        if (MjClient.majiang.getCardColor(card) === 4) return;
        //红点
        if (MjClient.majiang.getCardColor(card) % 2 === 0) {
            let cardNum = MjClient.majiang.getCardNum(card);
            //7当王算点
            if (cardNum === 7) {
                if (Rule.Allow7AsKing && Rule.IsPoint7AsKing) {
                    num += cardNum > 10 ? 1 : cardNum;
                } else if (!Rule.Allow7AsKing) {
                    num += cardNum > 10 ? 1 : cardNum;
                }
            } else {
                num += cardNum > 10 ? 1 : cardNum;
            }
        }
    })
    //碰杠牌
    const nameAr = ['gang0', 'gang1', 'chi', 'peng', 'anpeng', 'wang', '7ToWang'];
    const BottomUserChiCards = node.children.filter(n => nameAr.indexOf(n.name) > -1)
    BottomUserChiCards.forEach(card => {
        if (!card.visible || card.getOpacity() !== 255) return;
        //wang
        if (MjClient.majiang.getCardColor(card.tag) === 4) return;
        //红点
        if (MjClient.majiang.getCardColor(card.tag) % 2 === 0) {
            let cardNum = MjClient.majiang.getCardNum(card.tag);
            //7当王算点
            if (cardNum === 7) {
                if (Rule.Allow7AsKing && Rule.IsPoint7AsKing) {
                    num += cardNum > 10 ? 1 : cardNum;
                } else if (!Rule.Allow7AsKing) {
                    num += cardNum > 10 ? 1 : cardNum;
                }
            } else {
                num += cardNum > 10 ? 1 : cardNum;
            }
        }
    })
    const redPoint = node.getChildByName("head").getChildByName("redPoint");
    if (redPoint) {
        redPoint.visible = true;
        redPoint.getChildByName('Text').setString('红点: ' + num);
    }
}
//设置玩家手牌
PlayerGamePanel_Red20.prototype.setUserHandCards = function (node, off, cards, ishow = true) {
    let name = off == 0 ? 'mjhand' : (MjClient.rePlayVideo != -1 ? 'mjhand_replay' : 'standPri'),
        hdc = [];
    node.children.forEach(child => {
        if (child.name === name) hdc.push(child);
    });
    var up = node.getChildByName("up");
    var stand = node.getChildByName("stand");
    var start, offui;
    switch (off) {
        case 0:
            start = up;
            offui = stand;
            break;
        case 1:
            start = stand;
            offui = up;
            break;
        case 2:
            start = stand;
            offui = up;
            break;
        case 3:
            start = stand;
            offui = up;
            break;
    }
    let startNode = hdc.length > 0 ? hdc.sort((a, b) => b.x - a.x)[0] : start;
    var upSize = offui.getSize();
    var upS = offui.scale;
    let newH = [];
    if (typeof cards === 'number') {
        for (let _i = 0; _i < cards; _i++) {
            let cd = getNewCard(node, MjClient.rePlayVideo != -1 ? "up" : 'stand', name);
            cd.x = startNode.x + upSize.width * upS * (_i == 0 && hdc.length == 0 ? 1 : 0.42);
            cd.setOpacity(ishow ? 255 : 0);
            startNode = cd;
            newH.push(cd);
        }
    } else {
        for (let _i = 0; _i < cards.length; _i++) {
            const cNum = cards[_i];
            let cd = getNewCard(node, 'stand', name, cNum, off);
            cd.x = startNode.x + upSize.width * upS * (_i == 0 && hdc.length == 0 ? 0.1 : 1.3);
            cd.setOpacity(ishow ? 255 : 0);
            startNode = cd;
            newH.push(cd);
            if (off === 0) cd.y = start.y;
        }
    }
    return newH;
}

/**添加 
 * @param nodesInfo {startNode,endNode,card} 
 * @param isUP 是否先上移（只有自己偷牌是上移的）
 * 
 * node为weaves里的opacity=0的card;
 */
PlayerGamePanel_Red20.prototype.addweavesAction = function (nodesInfo, isUP = false) {
    try {
        nodesInfo.forEach(value => {
            cc.log('-----addweavesAction----', !value.startNode, !value.endNode, !cc.sys.isObjectValid(value.startNode), !cc.sys.isObjectValid(value.endNode))
            //初始化
            if (!value.startNode || !value.endNode || !cc.sys.isObjectValid(value.startNode) || !cc.sys.isObjectValid(value.endNode)) return;
            //展示等待时间
            let wait = cc.delayTime(Red20ActionTime.WaitTime);
            //上移0.33,暂停0.2
            let moveUp = cc.moveTo(Red20ActionTime.MoveUp, cc.p(value.startNode.x, value.startNode.y + 30));
            let stop = cc.delayTime(Red20ActionTime.UpStop);
            //移动
            let moveEnd = cc.moveTo(Red20ActionTime.MoveWeaves, cc.p(value.endNode.x, value.endNode.y));

            let callFunc = cc.callFunc(() => {
                value.startNode.removeFromParent(true);
                value.endNode.setOpacity(255);
            })
            let seq = null;
            if (isUP) {
                seq = cc.sequence(moveUp, stop, moveEnd, callFunc);
            } else {
                //其他玩家需要先展示0.2（当暗碰或偷牌时暗杠不需要展示）
                if (value.card !== -1) {
                    seq = cc.sequence(wait, moveEnd, callFunc);
                } else {
                    seq = cc.sequence(moveEnd, callFunc);
                }
            }
            value.startNode.runAction(seq);
        })
    } catch (error) {
        cc.error('添加吃碰杠动画+++', error)
    }
}
/**
 * 从手牌中移除下水的牌
 * @param {*} node 
 * @param {*} cards 
 */
PlayerGamePanel_Red20.prototype.onRemoveUserHandCard = function (node, cards, off) {
    let removeCardNode = [], allChild = node.children.filter(n => n.name == (MjClient.rePlayVideo == -1 ? (off == 0 ? 'mjhand' : 'standPri') : (off == 0 ? 'mjhand' : 'mjhand_replay')));
    for (let _i = 0; _i < cards.length; _i++) {
        const king = cards[_i];
        for (var i = 0; i < allChild.length; i++) {
            var ci = allChild[i];
            if ((off != 0 && MjClient.rePlayVideo == -1) || ci.tag == king) {
                removeCardNode.push(ci);
                ci.name = 'toumove';
                ci.zIndex = 99;
                allChild.splice(i, 1);
                break;
            }
        }
    }
    return removeCardNode;
}
/**
 * 创建 吃 碰 王（7）
 * @param {数据} cards 
 * @param {类型} type 'chi' | 'wang' | 'peng' | 'anpeng' | '7ToWang'
 * @param {是否显示} isShow 
 */
PlayerGamePanel_Red20.prototype.onUserAddWeaves = function (node, cards, type, isShow, off) {
    let weaveaNode = [], newCards = [], wangCards = [];
    if (cards instanceof Array) newCards = cards; else newCards.push(cards);
    //王
    if (type === "wang" || type === "7ToWang")
        node.children.forEach(child => {
            if (child.name === type) wangCards.push(child);
        });
    //添加王
    if (wangCards.length > 0) {
        let sn = wangCards.sort((a, b) => b.y - a.y)[0];
        newCards.forEach((card, _indx) => {
            let child = getNewCard(node, "down", type, card, off);
            child.opacity = isShow === true ? 255 : 0;
            child.setPosition(sn.x, sn.y + sn.getSize().height * 0.45 * child.scale);
            child.zIndex = 8 - wangCards.length;
            weaveaNode.push(child);
            sn = child;
        })
    } else {//新增
        const nameAr = ['gang0', 'gang1', 'chi', 'peng', 'anpeng', 'wang', '7ToWang']
        node.children.forEach(child => {
            if (nameAr.indexOf(child.name) > -1) wangCards.push(child);
        });
        let d = node.getChildByName('down'),
            sn = wangCards.length > 0 ? wangCards.sort((a, b) => {
                if (off == 1) return a.x - b.x;
                else return b.x - a.x;
            })[0] : d;
        if (type !== 'anpeng' || (type === 'anpeng' && cards instanceof Array)) {
            newCards.forEach((card, _indx) => {
                let child = getNewCard(node, "down", type, card, off),
                    pos = cc.p(sn.x + (Red20Space.weavs[off].x + (wangCards.length > 0 ? child.getSize().width * child.scale : 0)) * (off == 1 ? -1 : 1), d.y + child.scale * child.getSize().height * 0.45 * _indx);
                child.setOpacity(isShow === true ? 255 : 0);
                child.setPosition(pos);
                child.visible = true
                child.zIndex = 200 - _indx;
                weaveaNode.push(child);
                cc.log('child-------', card, JSON.stringify(pos))
            })
        } else { //暗碰 其他玩家 数字 长度
            for (let i = 0; i < cards; i++) {
                let child = getNewCard(node, "down", type, -1, off), pos = cc.p(sn.x + Red20Space.weavs[off].x * (off == 1 ? -1 : 1), d.y + child.scale * child.getSize().height * 0.45 * i);
                child.setOpacity(isShow === true ? 255 : 0);
                child.setPosition(pos);
                child.zIndex = 200 - i;
                weaveaNode.push(child);
            }
        }
    }
    return weaveaNode;
}
//显示玩家头像的偷ui动画
PlayerGamePanel_Red20.prototype.showUserHeadAction = function (node, off, sD, str) {
    var pl = getUIPlayer(off);
    node.zIndex = 99;
    if (sD && pl && str) {
        if (sD.uid == pl.info.uid) {
            node.loadTexture('Red20/Controller/tip_' + str + '.png');
            node.visible = true;
            node.runAction(cc.sequence(cc.delayTime(2), cc.callFunc(() => {
                node.visible = false;
            })));
            this.playEffectInPlay2(pl, str);
        }
        else {
            node.visible = false;
        }
    }
}
/**
 * @function 显示每个玩家放大出牌预览效果
 * @param {node} playerUi "top"|"left"|"down"|"right" node
 * @card {number} card 麻将牌值
 */
PlayerGamePanel_Red20.prototype.showMJOutBig = function (playerUi, card, off) {
    cc.log("---PlayerGamePanel_Red20--showMJOutBig------" + playerUi.getName(), JSON.stringify(card));
    var outBig = playerUi.getChildByName("outBig");
    if (outBig) {
        let pl = getUIPlayer(off);
        outBig.stopAllActions();
        let n = MjClient.playui.jsBind.cardNumImg._node, endPos = cc.p(n.x, n.y);
        if (!pl || pl.info.uid != card.uid) {
            outBig.visible = false;
            outBig.setScale(0);
            outBig.setPosition(endPos);
            return;
        }
        this.setUserTableCard(playerUi, off);
        cc.log('--------showMJOutBig2--------', JSON.stringify(MjClient.playui.TableOutData))
        MjClient.playui.TableOutData.Card = card.Card;
        MjClient.playui.TableOutData.pos = off;
        card = card.Card;
        outBig.setPosition(endPos);
        outBig.setScale(0);
        setCardSprite(outBig, card);
        outBig.visible = true;
        if (off == 0) endPos.y -= 40;
        else if (off == 1) endPos.x += 80;
        else if (off == 2) endPos.y += 40;
        else if (off == 3) endPos.x -= 80;
        outBig.setOpacity(255);
        outBig.zIndex = 500;
        this.playEffectInPlay1(pl, card);
        outBig.runAction(cc.spawn(cc.moveTo(Red20ActionTime.MoveCenter, endPos.x, endPos.y), cc.scaleTo(Red20ActionTime.MoveCenter, 1)));
    }
}
//游戏中偷拍
PlayerGamePanel_Red20.prototype.KingCard = function (playerUi, card, off) {
    this.setUserTableCard(playerUi, off);
    let pl = getUIPlayer(off);
    if (!pl || pl.info.uid != card.uid || !playerUi.getChildByName("outBig")) return;
    var outBig = playerUi.getChildByName("outBig").clone();
    cc.log('-----游戏中偷拍---', !!outBig)
    if (outBig) {
        let n = MjClient.playui.jsBind.cardNumImg._node, endPos = cc.p(n.x, n.y);
        playerUi.addChild(outBig);
        outBig.setPosition(endPos);
        outBig.setScale(0);
        setCardSprite(outBig, card.card);
        outBig.visible = true;
        if (off == 0) endPos.y -= 40;
        else if (off == 1) endPos.x += 80;
        else if (off == 2) endPos.y += 40;
        else if (off == 3) endPos.x -= 80;
        outBig.setOpacity(255);
        outBig.zIndex = 999;
        outBig.tag = card.card;
        outBig.runAction(cc.sequence(cc.spawn(cc.moveTo(Red20ActionTime.MoveCenter, endPos.x, endPos.y), cc.scaleTo(Red20ActionTime.MoveCenter, 1)),
            cc.delayTime(0.1),
            cc.callFunc(() => {
                this.TouAndMoveCard(playerUi, { Kings: [card.card], uid: card.uid }, off, true, outBig, false);
            })));
    }
}
//添加桌子上的牌
PlayerGamePanel_Red20.prototype.setUserTableCard = function () {
    if (MjClient && MjClient.playui && MjClient.playui.TableOutData.pos != -1) {
        let off = MjClient.playui.TableOutData.pos;
        MjClient.playui.TableOutData.pos = -1;
        var jsbs = MjClient.playui.jsBind, arr = [jsbs.down, jsbs.right, jsbs.top, jsbs.left];
        let node = arr[off]._node;
        var outBig = node.getChildByName("outBig");
        if (outBig) outBig.visible = false;
        let pl = getUIPlayer(off);
        if (pl.mjput) pl.mjput.push(MjClient.playui.TableOutData.Card);
        var msg = {
            card: MjClient.playui.TableOutData.Card,
            uid: pl.info.uid
        };

        cc.log('--------创建出牌--------', off, MjClient.playui.TableOutData.Card)
        DealMJPut(node, msg, off);
    }
}
//处理出牌,放一张牌，打牌动作
PlayerGamePanel_Red20.prototype.DealMJPut = function (node, msg, off, outNum) {
    let p0 = getUIPlayer(off);
    if (!p0 || msg.uid != p0.info.uid) return;
    cc.log('----------DealMJPut---------------', off, msg.card, outNum)    //断线重连 起手胡 不消失
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var uids = tData.uids;
    var selfIndex = getPlayerIndex(off);
    if (uids[selfIndex] == msg.uid) {
        var pl = sData.players[msg.uid];
        var putnum = outNum >= 0 ? outNum : (pl.mjput.length - 1);
        var out0 = node.getChildByName("out0");
        var out1 = node.getChildByName("out1");
        var out2 = node.getChildByName("out2");
        var out0_self = getNode(0).getChildByName("out0");
        var out1_self = getNode(0).getChildByName("out1");
        var out2_self = getNode(0).getChildByName("out2");
        var maxNum = 12;
        if (MjClient.MaxPlayerNum === 2) maxNum = 16;
        var out;
        var out_self;
        if (putnum >= maxNum * 2 && out2) {
            out = out2.clone();
            out_self = out2_self.clone();
        }
        else if (putnum >= maxNum) {
            out = out1.clone();
            out_self = out1_self.clone();
        }
        else {
            out = out0.clone();
            out_self = out0_self.clone();
        }
        out.name = "out";
        setCardSprite(out, msg.card, off);
        out.setScale(out.getScale() * 1.3);
        out_self.setScale(out_self.getScale() * 1.3);
        var oSize = out.getSize();
        var oSc = out.getScale();

        if (off == 0 && putnum >= maxNum * 2 && out2) {
            node.addChild(out);
        }
        else if (off == 0 && putnum >= maxNum) {
            node.addChild(out, 1);
        }
        else if (off == 1 || off == 0) {
            node.addChild(out, 200 - putnum);
        }
        else if (off == 2 || off == 3) {
            node.addChild(out, putnum);
        }
        else {
            node.addChild(out);
        }

        for (var i = 0; i < node.children.length; i++) {
            if (node.children[i].name == "newout") {
                node.children[i].name = "out";
            }
        }

        out.visible = true;
        var endPoint = cc.p(0, 0);
        var Midpoint = cc.p(0, 0);
        var ws = cc.director.getWinSize();
        var lineNum = 1; // 记录当前出牌显示的行数，默认第一行
        if (putnum > maxNum * 2 - 1 && out2) {
            out.x = out2.x;
            out.y = out2.y;
            putnum -= maxNum * 2;
            lineNum = 3;
        }
        else if (putnum > maxNum - 1) {
            out.x = out1.x;
            out.y = out1.y;
            putnum -= maxNum;
            lineNum = 2;
        }

        var arg = 1.0

        if (off == 0 || off == 2) {
            endPoint.y = out.y;
            endPoint.x = out.x + oSize.width * oSc * arg * putnum * 0.5;
            out.zIndex = putnum;
            if (isIPad()) {
                var ax = ws.height / 1024;
                var ay = ws.height / 768;
                endPoint.x = endPoint.x + 20 * ax;
                out.zIndex = 100 - putnum;
                endPoint.y = lineNum > 1 ? endPoint.y - 8 * ay : endPoint.y;
            }
            Midpoint.x = ws.width / 2;
            Midpoint.y = ws.height * 0.3;
            if (!(outNum >= 0)) {
                if (msg.isAfterGang) {

                } else {
                    // RemoveNodeBack(node, "putOutCard", 1, msg.card);
                }
            }
        }
        else if (off == 1 || off == 3) {
            endPoint.y = out.y;
            endPoint.x = out.x + oSize.width * oSc * arg * putnum * 0.5 * (off == 3 ? -1 : 1);
            if (isIPad()) {
                var ay = ws.height / 768;
                endPoint.y = endPoint.y + 20 * ay;
            }
            if (off == 3) out.zIndex = 20 - putnum - lineNum;
            else out.zIndex = putnum;
            Midpoint.x = ws.width * 0.78;
            Midpoint.y = ws.height * 0.57;
        }


        if (outNum >= 0) //重连
        {
            //cc.log("==================tData = "+ JSON.stringify(tData));
            //断线重连的时候
            if (tData.lastPutCard == msg.card && tData.lastPutPlayer == tData.uids.indexOf(msg.uid)) {
                out.x = endPoint.x;
                out.y = endPoint.y;
                clearCurrentPutTag();
                addCurrentPutTag(out, off);
            }

            if ((outNum == pl.mjput.length - 1) && tData.curPlayer == selfIndex && tData.tState == TableState.waitEat) {

            }
            else {
                out.x = endPoint.x;
                out.y = endPoint.y;
                return;
            }
        }
        out.visible = true;
        if (COMMON_UI.isPutScale && off != 0 && !noNeedOutBig) {
            out.zIndex = 200;
            out.x = Midpoint.x;
            out.y = Midpoint.y;
            out.scale = 2 * oSc;
        }
        else {
            out.x = endPoint.x;
            out.y = endPoint.y;
            out.scale = oSc;
        }
    }
}
//出牌
PlayerGamePanel_Red20.prototype.PutOutCard = function (cdui, cd) {
    if (MjClient.rePlayVideo != -1 || !IsTurnToMe() || MjClient.data.sData.tData.roomStatus == 101) {
        return false;
    }
    if (cdui.isNew) {
        MjClient.newCard = null; //打出去的是新摸的这张牌
        cdui.isNew = false;
    }

    MjClient.playui.jsBind.BtnPutCard._node.stopAllActions(); //修复抓花后自摸时自动打出bug

    /*
     临时提高层级是为了在DealMJPut中RemoveNodeBack删除打出去的这张牌时，能准确找到选中的这张牌。
     如果不提高层级，mjhand里面如果有相同的两张牌时，就会删掉另一张不是用户操作的牌
     */
    cdui.zIndex = 500;

    var children = cdui.parent.children;
    var mjhandNum = 0;
    for (var i = 0; i < children.length; i++) {
        if (children[i].name == "mjhand") {
            mjhandNum++;
        }
    }
    var pl = getUIPlayer(0);
    cc.log('mjhandNum == pl.mjhand.length', mjhandNum, cd, JSON.stringify(pl.mjhand))
    if (mjhandNum == pl.mjhand.length) {
        var mjputMsg = {
            cmd: "MJPut",
            card: cd,
            tingAfterPut: MjClient.clickTing
        };

        MjClient.gamenet.request("pkroom.handler.tableMsg", mjputMsg);
        cdui.visible = false;
        //标记着这张打出去的牌，在服务器回调 DealMjput (海安，通用，山西，徐州) 会删除这张标记的牌 by sking  2018.9.13
        cdui.name = "putOutCard";
        cdui.removeFromParent(true);
        return true;
    }

    //出牌的时候，听，按钮消失
    var eat = MjClient.playui.jsBind.eat;
    if (eat.guo._node) {
        eat.guo._node.visible = false;
    }
    if (eat.ting._node) {
        eat.ting._node.visible = false;
    }
}
/**
 * 在这些情况下不能出牌，简化addTouchEventListener里面的判断，增强代码可读性 by sking 2018.12.6
 * @param cardui
 * @param btn
 * @returns {boolean} 返回false 表示不能出牌
 */
PlayerGamePanel_Red20.prototype.isCanTouch = function (cardui, btn, touchType) {
    var sData = MjClient.data.sData;
    var tData = sData.tData;

    if (!IsTurnToMe() || tData.tState != TableState.waitPut) {
        return false;
    }
    if (MjClient.clickTing && !MjClient.canTingCards[cardui.tag]) {
        return false;
    }

    if (MjClient.movingCard !== null && MjClient.movingCard !== btn) {
        return false;
    }
    var children = btn.getParent().children;
    for (var i = 0; i < children.length; i++) {
        //手里打出去，要删掉的那张牌没有删除之前不让出第二张牌，也就是没有收到Mjput消息回调前不让出牌  by sking 2018.9.12
        if (children[i].name == "putOutCard") return false;
    }
    if (MjClient.isChaPaiPlaying) return false; //正在播插牌动画时不让点击其他的牌 by sking 2018.9.12
    return true;
}
/** 刷新手牌大小 */
PlayerGamePanel_Red20.prototype.resetCardSize = function () {
    var _downNode = getNode(0);
    var _cpnode = _downNode.getChildByName("stand");
    var children = _downNode.children;
    for (var i = 0; i < children.length; i++) {
        if (children[i].name == "mjhand") {
            var scale = _cpnode.getScale() * 1.30;
            children[i].setScale(scale);
        }
    }
    MjClient.movingCard = null;
}
/**处理吃 */
PlayerGamePanel_Red20.prototype.DealMJChi = function (node, msg, off) {
    let cards = msg.mjchi, pl = getUIPlayer(off);
    if (!pl || pl.info.uid != msg.uid) return;
    let removeCard = cards.find(card => card !== this.TableOutData.Card);
    let startNodeInfo = this.onRemoveUserHandCard(node, [removeCard], off);
    let bigP = getNode(this.TableOutData.pos);
    if (bigP) {
        let big = bigP.getChildByName('outBig');
        let nb = big.clone();
        nb.name = 'otbigMove';
        node.addChild(nb);
        startNodeInfo.push(nb);
        big.visible = false;
        this.TableOutData.pos = -1;
    }
    let endNode = this.onUserAddWeaves(node, cards, 'chi', false, off), actionInfos = [];
    endNode.forEach(chi => {
        let action = {};
        action.endNode = chi;
        action.card = chi.tag;
        if (off == 0 || MjClient.rePlayVideo != -1)
            action.startNode = startNodeInfo.find(s => s.tag == chi.tag);
        else action.startNode = startNodeInfo.splice(0, 1)[0];
        action.startNode && action.startNode.setScale(action.endNode.getScale());
        actionInfos.push(action);
    })//移动动画
    this.addweavesAction(actionInfos, false);
    let func = () => {
        off == 0 && pl.mjhand.splice(pl.mjhand.indexOf(removeCard), 1);
        this.CardLayoutRestore(node, off);
    }
    if (MjClient.rePlayVideo != -1) {
        func();
    } else {
        setTimeout(() => {
            func();
        }, 0.9 * 1000);
    }
}
/**处理碰 */
PlayerGamePanel_Red20.prototype.DealMJPeng = function (node, msg, off) {
    let cards = msg.cards, pl = getUIPlayer(off);
    if (!pl || pl.info.uid != msg.uid) return;
    let actionInfos = [], removeCard = [];
    if (typeof cards == 'number') {// //其他玩家 暗碰 number
        cards = [0, 0, 0];
        let startNodeInfo = this.onRemoveUserHandCard(node, cards, off);
        let endNode = this.onUserAddWeaves(node, cards, 'anpeng', false, off);
        endNode.forEach((chi, _indx) => {
            let action = {};
            action.endNode = chi;
            action.card = -1;
            action.startNode = startNodeInfo[_indx];
            action.startNode && action.startNode.setScale(action.endNode.getScale());
            actionInfos.push(action);
        })
    } else {
        removeCard = msg.type == 2 ? cards.filter(card => card != this.TableOutData.Card) : cards;
        let startNodeInfo = this.onRemoveUserHandCard(node, removeCard, off);
        let bigP = msg.type == 2 ? getNode(this.TableOutData.pos) : null;
        if (bigP) {
            let big = bigP.getChildByName('outBig');
            let nb = big.clone();
            nb.name = 'otbigMove';
            node.addChild(nb);
            startNodeInfo.push(nb);
            big.visible = false;
            this.TableOutData.pos = -1;
        }
        let endNode = this.onUserAddWeaves(node, cards, msg.type == 2 ? 'peng' : 'anpeng', false, off);
        endNode.forEach(chi => {
            let action = {};
            action.endNode = chi;
            action.card = chi.tag;
            if (off == 0 || MjClient.rePlayVideo != -1)
                action.startNode = startNodeInfo.find(s => s.tag == chi.tag);
            else action.startNode = startNodeInfo.splice(0, 1)[0];
            action.startNode && action.startNode.setScale(action.endNode.getScale());
            actionInfos.push(action);
        })
    }
    //移动动画
    this.addweavesAction(actionInfos, false);

    let func = () => {
        if (off === 0) {
            for (let _i = 0; _i < removeCard.length; _i++) {
                const rc = removeCard[_i], _indx = pl.mjhand.indexOf(rc);
                if (_indx >= 0) {
                    pl.mjhand.splice(_indx, 1);
                }
            }
        }
        this.CardLayoutRestore(node, off);
    }
    if (MjClient.rePlayVideo != -1) {
        func();
    } else {
        setTimeout(() => {
            func();
        }, 0.9 * 1000);
    }
}
/**处理杠 */
PlayerGamePanel_Red20.prototype.DealMJGang = function (node, msg, off) {
    let pl = getUIPlayer(off);
    if (!pl || pl.info.uid != msg.uid) return;
    if (msg.ShowAnGang) {//偷牌阶段的暗杠数据
        if (off != 0) {
            let anPengNode = node.children.filter(child => child.name === 'gang1' && child.IsShowBack == true);
            cc.log('偷牌阶段暗杠转杠', anPengNode.length);
            if (anPengNode.length) {
                // anPengNode = node.children.filter(n => n.name === 'anpeng');
                let sn = cc.p(0, 0);
                for (let _i = 0; _i < msg.cards.length; _i++) {
                    let p = null;
                    for (let _j = 0; _j < anPengNode.length; _j++) {
                        const item = anPengNode[_j];
                        if (item.x === anPengNode[0].x) {
                            p = item;
                            if (p.y > sn.y) sn.y = p.y;
                            sn.x = p.x;
                            anPengNode.splice(_j, 1);
                            break;
                        }
                    }
                    if (p) setCardSprite(p, msg.cards[_i], off);
                }
            }
        }
        return;
    } else {
        let cards = [], cd = msg.cards, startNodeInfo = [];
        if (msg.type == 1) {//点杠 
            cards = cd.filter(c => c != this.TableOutData.Card);
            let bigP = getNode(this.TableOutData.pos);
            if (bigP) {
                let big = bigP.getChildByName('outBig');
                let nb = big.clone();
                nb.name = 'otbigMove';
                node.addChild(nb);
                startNodeInfo.push(nb);
                big.visible = false;
                this.TableOutData.pos = -1;
            }
            pl.mjgang0.push(cd);
        } else if (msg.type == 3) {//弯杠
            let lastC = this.TableOutData.Card, flag = false, pos = this.TableOutData.pos;
            if (lastC && pos != -1) {
                let bigP = getNode(this.TableOutData.pos);
                if (bigP) {
                    let big = bigP.getChildByName('outBig');
                    let nb = big.clone();
                    nb.name = 'otbigMove';
                    node.addChild(nb);
                    startNodeInfo.push(nb);
                    big.visible = false;
                    this.TableOutData.pos = -1;
                }
            } else {
                cards = [cd[0]];
            }
            for (let _i = 0; _i < pl.mjpeng.length; _i++) {
                let item = pl.mjpeng[_i];
                if (MjClient.majiang.getCardNum(item[0]) === lastC) {
                    pl.mjpeng.splice(_i, 1);
                    flag = true;
                    break;
                }
            }
            if (!flag) {
                for (let _i = 0; _i < pl.mjanpeng.length; _i++) {
                    let item = pl.mjanpeng[_i];
                    if (MjClient.majiang.getCardNum(item[0]) === lastC) {
                        pl.mjanpeng.splice(_i, 1);
                        flag = true;
                        break;
                    }
                }
            }
            pl.mjgang0.push(cd);
        } else {//暗杠
            cards = cd;
            pl.mjgang1.push(cd);
        }
        cards.length > 0 && (startNodeInfo = startNodeInfo.concat(this.onRemoveUserHandCard(node, cards, off)));
        let endNode = this.onUserAddGang(node, cd, msg.type, false, off), actionInfos = [];
        endNode.forEach(chi => {
            let action = {};
            action.endNode = chi;
            action.card = chi.tag;
            if (off == 0 || MjClient.rePlayVideo != -1)
                action.startNode = startNodeInfo.find(s => s.tag == chi.tag);
            else action.startNode = startNodeInfo.splice(0, 1)[0];
            action.startNode.setScale(action.endNode.getScale());
            actionInfos.push(action);
        })//移动动画
        this.addweavesAction(actionInfos, false);
        let func = () => {
            if (off === 0) {
                for (let _i = 0; _i < cards.length; _i++) {
                    const rc = cards[_i], _indx = pl.mjhand.indexOf(rc);
                    if (_indx >= 0) {
                        pl.mjhand.splice(_indx, 1);
                    }
                }
            }
            this.CardLayoutRestore(node, off);
        }
        if (MjClient.rePlayVideo != -1) {
            func();
        } else {
            setTimeout(() => {
                func();
            }, 0.9 * 1000);
        }
    }
}
//玩家杠牌
PlayerGamePanel_Red20.prototype.onUserAddGang = function (node, card, type, isShow = true, off) {
    let weaveaNode = [];
    //弯杠
    if (type === 3 && !isShow) {
        let pengNode = node.children.filter(child => MjClient.majiang.getCardNum(child.tag) === MjClient.majiang.getCardNum(card[0]) && child.name === 'peng');
        //碰转杠
        cc.log('碰转杠', pengNode.length)
        if (pengNode.length) {
            pengNode.map(p => { p.name = 'gang0' });
            let sn = pengNode.sort((a, b) => b.y - a.y)[0],
                child = getNewCard(node, "down", 'gang0', card[0], off),
                pos = cc.p(sn.x, sn.y + child.getSize().height * child.scale * 0.45);
            child.setOpacity(isShow === true ? 255 : 0);
            child.setPosition(pos);
            child.visible = true
            child.zIndex = 4;
            weaveaNode.push(child);
        }
        //暗碰转杠
        else {
            let anPengNode = node.children.find(child => {
                if (off == 0 || MjClient.rePlayVideo != -1) {
                    return MjClient.majiang.getCardNum(child.tag) === MjClient.majiang.getCardNum(card[0]) && child.name === 'anpeng';
                } else return child.name === 'anpeng'
            });
            cc.log('暗碰转杠', JSON.stringify(anPengNode))
            if (anPengNode) {
                let anpeng = node.children.filter(n => n.name === 'anpeng');
                let sn = cc.p(0, 0);
                for (let _i = 0; _i < 4; _i++) {
                    let p = null;
                    for (let _j = 0; _j < anpeng.length; _j++) {
                        const item = anpeng[_j];
                        if (item.x === anPengNode.x) {
                            p = item;
                            if (p.y > sn.y) sn.y = p.y;
                            sn.x = p.x;
                            anpeng.splice(_j, 1);
                            break;
                        }
                    }
                    if (p) {
                        p.name = 'gang0';
                        if (off == 0 || MjClient.rePlayVideo != -1) {

                        } else {
                            setCardSprite(p, card[_i + 1], off);
                        }
                    } else {
                        let child = getNewCard(node, "down", 'gang0', card[0], off),
                            pos = cc.p(sn.x, sn.y + child.getSize().height * child.scale * 0.45);
                        child.setOpacity(isShow === true ? 255 : 0);
                        child.setPosition(pos);
                        child.visible = true
                        child.zIndex = 4;
                        weaveaNode.push(child);
                    }

                }
            }
        }
    }
    //暗杠/点杠
    else {
        const nameAr = ['gang0', 'gang1', 'chi', 'peng', 'anpeng', 'wang', '7ToWang'], wangCards = [];
        node.children.forEach(child => {
            if (nameAr.indexOf(child.name) > -1) wangCards.push(child);
        });
        let d = node.getChildByName('down'),
            sn = wangCards.length > 0 ? wangCards.sort((a, b) => {
                if (off == 1) return a.x - b.x;
                else return b.x - a.x;
            })[0] : d;
        if (card.length === 0) card = [0, 0, 0, 0]
        for (let _i = 0; _i < card.length; _i++) {
            let child = getNewCard(node, "down", type == 2 ? 'gang1' : 'gang0', card[_i], off),
                pos = cc.p(sn.x + (Red20Space.weavs[off].x + (wangCards.length > 0 ? child.getSize().width * child.scale : 0)) * (off == 1 ? -1 : 1), d.y + child.getSize().height * child.scale * 0.45 * _i);
            child.setOpacity(isShow === true ? 255 : 0);
            child.setPosition(pos);
            child.visible = true
            child.zIndex = 200 - _i;
            weaveaNode.push(child);
            child.IsShowBack = true;
            cc.log('child-------gang', card, JSON.stringify(pos))
        }
    }
    return weaveaNode;
}
/**吃 碰 杠 操作事件 */
PlayerGamePanel_Red20.prototype.OnSendOption = function (type) {
    if (!(type >= 0 && type <= 2)) return;
    var eat = MjClient.playui.jsBind.eat;
    var changeuibg = eat.changeui.changeuibg;
    var cardTemplet = changeuibg._node.getChildByName("card");
    var children = changeuibg._node.getChildren().slice();
    for (var i = 0, len = children.length; i < len; i++) {
        if (children[i] != cardTemplet && children[i].getName().indexOf("card") != -1)
            children[i].removeFromParent();
    }
    let list = [MjClient.eatpos, MjClient.pengCards, MjClient.gangCards][type];
    if (list.length <= 1) {
        this.OptionToServer(type, list.length === 1 ? list[0] : -1);
    } else {
        eat.chi0._node.visible = false;
        eat.chi1._node.visible = false;
        eat.chi2._node.visible = false;
        eat.peng._node.visible = false;
        eat.gang0._node.visible = false;
        eat.gang1._node.visible = false;
        eat.gang2._node.visible = false;
        eat.hu._node.visible = false;
        eat.guo._node.visible = false;
        changeuibg._node.visible = true;

        var card = [];
        var width = (cardTemplet.width - 7) * cardTemplet.scaleX;
        var startX = changeuibg._node.width / 2 - width;
        for (var i = 0; i < list.length; i++) {
            card[i] = cardTemplet.clone();
            setCardSprite(card[i], list[i], 0);
            card[i].visible = true;
            card[i].setName("card" + (list[i] * 3 + i));
            card[i].setPosition(startX + i * width, cardTemplet.y);
            changeuibg._node.addChild(card[i]);

            card[i].addTouchEventListener([changeuibg._node.chiTouch, changeuibg._node.pengTouch, changeuibg._node.gangTouch][type], card[i]);

        }

        if (card[0])
            changeuibg._node.height = card[0].y + card[0].height * card[0].scaleY * card[0].anchorY + 8.0;
    }
}
/**发送 吃 碰 杠 操作 */
PlayerGamePanel_Red20.prototype.OptionToServer = function (type, card) {
    cc.log('发送操作消息----', ['吃', '碰', '杠'][type], card)
    MjClient.gamenet.request("pkroom.handler.tableMsg", {
        cmd: ["MJChi", "MJPeng", "MJGang"][type],
        card,
        eatFlag: [1, 2, 4][type]
    });
}
//播放自己的音效
PlayerGamePanel_Red20.prototype.playEffectInPlay1 = function (pl, card) {
    let num = card % 16;
    let prefix = pl.info.sex === 1 ? 'male' : 'female';
    let str = 'Red20/Audio/card/' + prefix + '/' + num + '.mp3';
    reallyPlayEffect(str, false);
}
//播放自己的音效
PlayerGamePanel_Red20.prototype.playEffectInPlay2 = function (pl, path) {
    let prefix = pl.info.sex === 1 ? 'male' : 'female';
    let str = 'Red20/Audio/effect/' + prefix + '/' + path + '.mp3';
    reallyPlayEffect(str, false);
}
//屏蔽框架音效
PlayerGamePanel_Red20.prototype.playEffectInPlay = function () {

}
//回放去除掉打出去的牌
PlayerGamePanel_Red20.prototype.removeHandCard = function (node, Card, off) {
    if (MjClient.rePlayVideo == -1) return;
    for (let _i = 0; _i < node.children.length; _i++) {
        var c = node.children[_i];
        if (c.tag == Card && cc.sys.isObjectValid(c)) {
            cc.log('----removeHandCard--', c.tag);
            c.removeFromParent(true);
            // break;
        }
    }
    let pl = getUIPlayer(off);
    if (pl && pl.majiang) {
        let _indx = pl.majiang.indexOf(Card);
        _indx > -1 && pl.majiang.splice(_indx, 1);
    }
    MjClient.playui.CardLayoutRestore(node, off);
}