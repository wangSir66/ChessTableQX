/**
 * Created by Administrator on 2017/3/9.
 */
// var cdsNums = 0;
// var windPos = [];
// var windObj = [];
// var roundnumImgObj;
var actionZindex = 1000;
//向服务器发送 过消息
MjClient.MJPass2NetForRed20 = function () {
    // console.log(">>>>>>>>>普通  过 <<<<<<<<");
    cc.log("====================send======pass=====");
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var eat = MjClient.playui.jsBind.eat;

    if (IsTurnToMe() && tData.tState == TableState.waitPut) {
        var msg = "确认过";
        if (eat.gang0._node.visible) {
            msg += " 杠 ";
        }

        if (eat.hu._node.visible) {
            msg += " 胡 ";
        }

        msg = msg + "吗?"
        MjClient.showMsg(msg, function () {
            //cc.log("==========1=============");
            eat.gang0._node.visible = false;
            eat.hu._node.visible = false;
            eat.guo._node.visible = false;
            eat.ting._node.visible = false;
            eat.cancel._node.visible = false;
            MJPassConfirmToServer();

            cc.log("==================过胡---yes-----------");
            // var cardsLength = getAllCardsTotal();
            // var isLastFourCard = tData.cardNext > cardsLength - 4 && tData.cardNext <= cardsLength;
            // if(isLastFourCard)
            // {
            //     MJPassConfirmToServer();
            // }
        }, function () { }, "1");
    }
    else {
        if (eat.hu._node.visible) {
            MjClient.showMsg("确认不胡吗?", MJPassConfirmToServer, function () { }, "1");
        }
        else {
            eat.guo._node.visible = eat.ting._node.visible = false;

            MJPassConfirmToServer();
        }
    }
}

// 判断停牌操作
//function TingVisibleCheckForLianYunGang(eat) {
//
//    var sData = MjClient.data.sData;
//    var tData = sData.tData;
//    var pl = sData.players[SelfUid() + ""];
//
//    eat.ting._node.visible = false;
//    eat.noTing._node.visible = false;
//
//    var vnode = [];
//    cc.log("");
//    if(tData.areaSelectMode.tingType != TingCardType.noTing && tData.tState == TableState.waitEat && !pl.isTing)
//    {
//        if(IsTurnToMe())
//        {
//            if (pl.isTing != undefined && !pl.isTing) {
//                var isTing = canTingForLianYn(pl.mjhand);
//                if (isTing)
//                {
//                    vnode.push(eat.ting._node);
//                    vnode.push(eat.noTing._node);
//                }
//            }
//
//            cc.log();
//            cc.log("-----check isting" + JSON.stringify(pl));
//        }
//    }
//
//    for(var i = 0; i < vnode.length; i++)
//    {
//        setWgtLayout(vnode[i], [0, 0.16], [0.5, 0], [(1 - vnode.length) / 1.6 + i * 1.6, 1.8], false, false);
//        vnode[i].visible = true;
//    }
//}


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
        InitUserHandUI_Red20(node, off);
        //GLog("pl.info.uid = "+pl.info.uid);
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




function InitUserHandUI_Red20(node, off) {
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var pl = getUIPlayer(off);
    if (!pl) {
        return;
    }

    //初始化玩家金币和名称
    InitUserCoinAndName(node, off);
    // setAreaTypeInfo(true);
    //setPlayerRoundDir(off);
    // if(vnPos.indexOf(off) == -1)
    // {
    //     vnPos.push(off);
    // }

    if (
        tData.tState != TableState.waitPut &&
        tData.tState != TableState.waitEat &&
        tData.tState != TableState.waitCard
    ) {
        return;
    }

    setHunNodeVisible(false);


    //添加碰
    for (var i = 0; i < pl.mjpeng.length; i++) {
        var idx = tData.uids.indexOf(pl.info.uid);
        var offIdx = (pl.pengchigang.peng[i].pos - idx + 4) % 4 - 1;//表示被碰的人和pl之间隔着几个人，如果是pl碰下家，则offIdx=0，pl碰上家，则offIdex=2
        var cdui = null;
        for (var j = 0; j < 3; j++) {
            if ((j % 3 == 2 - offIdx && off % 3 == 0) || (j % 3 == offIdx && off % 3 != 0)) {
                cdui = getNewCard(node, "up", "peng", pl.mjpeng[i], off, "heng", "heng");
                setCardArrow(cdui, offIdx, off);
            }
            else {
                cdui = getNewCard(node, "up", "peng", pl.mjpeng[i], off);
            }

            if (j == 2) {
                cdui.ispeng3 = true;
            }
        }
    }


    //添加明杠
    for (var i = 0; i < pl.mjgang0.length; i++) {
        var idx = tData.uids.indexOf(pl.info.uid);
        //var offIdx = 0;
        //if(i < pl.pengchigang.gang.length)
        //{
        //    offIdx = (pl.pengchigang.gang[i].pos - idx + 4) % 4 - 1;
        //}
        //else {
        //    offIdx = (pl.pengchigang.pgang[i-pl.pengchigang.gang.length].pos - idx + 4) % 4 - 1;
        //}
        var offIdx = null;
        for (var j = 0; j < pl.pengchigang.gang.length; j++) {
            if (pl.pengchigang.gang[j].card == pl.mjgang0[i]) {
                offIdx = (pl.pengchigang.gang[j].pos - idx + 4) % 4 - 1;
                break;
            }
        }
        if (offIdx == null) {
            for (var j = 0; j < pl.pengchigang.pgang.length; j++) {
                if (pl.pengchigang.pgang[j].card == pl.mjgang0[i]) {
                    offIdx = (pl.pengchigang.pgang[j].pos - idx + 4) % 4 - 1;
                    break;
                }
            }
        }
        if (offIdx == null) {
            cc.log("InitUserHandUI:offIdx == null!!!!");
            offIdx = 0;
        }

        var setCardArrowOnGang4 = false;
        for (var j = 0; j < 4; j++) {
            if (j < 3) {
                if ((j % 3 == 2 - offIdx && off % 3 == 0) || (j % 3 == offIdx && off % 3 != 0)) {
                    var cdui = getNewCard(node, "up", "gang0", pl.mjgang0[i], off, "heng", "heng");
                    setCardArrow(cdui, offIdx, off);
                    if (j == 1) {
                        setCardArrowOnGang4 = true;
                    }
                }
                else {
                    getNewCard(node, "up", "gang0", pl.mjgang0[i], off);
                }
            }
            else {
                var cdui = getNewCard(node, "up", "gang0", pl.mjgang0[i], off, "isgang4");//最后一张牌放上面
                cdui.tag = pl.mjgang0[i];
                if (setCardArrowOnGang4) {
                    setCardArrow(cdui, offIdx, off);
                }
            }
        }
    }


    //添加暗杠
    for (var i = 0; i < pl.mjgang1.length; i++) {
        for (var j = 0; j < 4; j++) {
            if (j == 3) {
                getNewCard(node, "down", "gang1", 0, off, "isgang4").tag = pl.mjgang1[i];
            }
            else {
                getNewCard(node, "up", "gang1", pl.mjgang1[i], off);
            }
        }
    }

    //添加碰
    for (var i = 0; i < pl.touCardList.length; i++) {
        let tou = pl.touCardList[i];
        for (let _i = 0; _i < tou.length; _i++) {
            const tc = tou[_i];
            getNewCard(node, "up", "tou", tc, off);
        }
    }

    //cc.log("pl.mjchi = " + pl.mjchi);
    var chiIdx = 0;
    var cdui = null;
    for (var i = 0; i < pl.mjchi.length; i++) {
        if (i % 3 == 0) {
            chiIdx++;
        }

        if (pl.mjchiCard[chiIdx - 1] == pl.mjchi[i])//吃的横牌表示吃的是哪张牌
        {
            cdui = getNewCard(node, "up", "chi", pl.mjchi[i], off, "heng");
            setCardArrow(cdui, 2, off);
        }
        else {
            cdui = getNewCard(node, "up", "chi", pl.mjchi[i], off);
        }

        if (i % 3 == 2)
            cdui.ischi3 = true;
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
            if (tData.uids[tData.curPlayer] == pl.info.uid) {
                CardCount = 8;
            }
            else {
                CardCount = 7;
            }

            var upCardCount = CardCount - ((pl.mjpeng.length + pl.mjgang0.length + pl.mjgang1.length) * 3 + pl.mjchi.length);
            for (var i = 0; i < upCardCount; i++) {
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

                for (var i = 0; i < pl.mjhand.length && i < 13; i++) {
                    getNewCard(node, "up", "mjhand_replay", pl.mjhand[i], off);
                }
            }
        }

    }

    MjClient.playui.CardLayoutRestore(node, off);
}

function initFlower_Red20() {
    var flowerVisble = false;
    var flowerZfbVisible = false;
    var tData = MjClient.data.sData.tData;
    cc.log("这是我选择的模式" + tData.areaSelectMode + "---------------------------------");
    if (MjClient.gameType == MjClient.GAME_TYPE.LIAN_YUN_GANG) {

        if (!tData.areaSelectMode)
            return;

        switch (tData.areaSelectMode.withFlowerType) {
            case WithFlowerType.commonFlower:
                flowerVisble = true;
                flowerZfbVisible = false;
                break;
            case WithFlowerType.noFlower:
                flowerVisble = false;
                flowerZfbVisible = false;
                break;
            case WithFlowerType.zfbFlower:
                flowerVisble = true;
                flowerZfbVisible = true;
                break;
        }
    }

    // initFlower(flowerVisble, flowerZfbVisible);
}

const ActionTime = {
    //从中央落下到牌桌
    Fall: 0.1,
    //自己偷牌，上移200px,上移时间
    MoveUp: 0.2,
    //上移后停顿时间
    UpStop: 0.2,
    //移动到吃碰杠牌堆
    MoveWeaves: 0.2,
    //新进牌，移动到中间 /系统翻牌 /游戏中偷牌(先移动到中间，在移到碰牌堆) /
    MoveCenter: 0.3,
    //从中央移动到手牌
    MoveHand: 0.2,
    //玩家出牌 从手牌移动到中央
    HandMoveCenter: 0.2,
    //其他玩家吃碰杠后在手牌展示停顿时间
    WaitTime: 0.2,
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

                if (MjClient.rePlayVideo != -1) {
                    resetPlayerHead_mj();
                }

                var sData = MjClient.data.sData;
                var tData = sData.tData;
                resetFlowerNum(this);
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
            endRoom: function (msg) {
                mylog(JSON.stringify(msg));
                if (msg.showEnd) this.addChild(new GameOverLayer(), 500);
                else
                    MjClient.Scene.addChild(new StopRoomView());
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
                    MjClient.playui.showMJOutBig(arr[_i]._node, {}, _i);
                }
                var self = this;
                function delayExe() {
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    resetEatActionAnim();

                    if (MjClient.isInGoldFieldNormal()) {//金币场普通场
                        self.addChild(new GoldEndOneLayer_MJ(), 500);
                        // if(cc.sys.isObjectValid(MjClient.ActiveGoldPlayingLayer)
                        //     && MjClient.ActiveGoldPlayingLayer.btn_hongbao.truePosition){
                        //     MjClient.playui.setHongBaoPos(MjClient.ActiveGoldPlayingLayer.btn_hongbao)
                        // }
                    } else {
                        if (sData.tData.roundNum <= 0 && !MjClient.isInGoldFieldNormal()) {
                            if (!tData.matchId) {
                                self.addChild(new GameOverLayer(), 500);
                            } else {
                                self.runAction(cc.sequence(cc.delayTime(3), cc.callFunc(function () {
                                    self.addChild(new GameOverLayer(), 500);
                                })))
                            }
                        }
                        self.addChild(new EndOneView_LYG(), 500);
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
                }
                //TingVisibleCheckForLianYunGang(MjClient.playui.eat._node);
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
            changeMJBgEvent: function () {
                changeMJBg(this, getCurrentMJBgType());
                MjClient.playui.CardLayoutRestore(getNode(0), 0)
            },
        },
        waitChangePos: {
            _visible: false,
            _layout: [
                [0.4, 0.4],
                [0.5, 0.5],
                [0, 0]
            ],
            //_event:
            //{
            //    mjhand:function()
            //    {
            //        var sData = MjClient.data.sData;
            //        var tData = sData.tData;
            //        cc.log("=====sking mjhand = tData = " + JSON.stringify(tData));
            //        if(tData.roundAll == tData.roundNum && MjClient.rePlayVideo == -1)
            //        {
            //            this.visible = true;
            //        }
            //        else {
            //            this.visible = false;
            //        }
            //    },
            //}
        },
        roundnumImg: {
            _event: {
                initSceneData: function (eD) {
                    // this.visible = IsArrowVisible();
                    this.visible = false
                },
                mjhand: function (eD) {
                    // this.visible = IsArrowVisible();
                    this.visible = false
                },
                onlinePlayer: function (eD) {
                    //this.visible = IsArrowVisible();
                    this.visible = false
                }
            },
            _run: function () {
                //roundnumImgObj = this;
                MjClient.roundnumImgNode = this;
                setWgtLayout(this, [0.085, 0], [0.5, 0.5], [-1.76, 1.0]);
                var sData = MjClient.data.sData;
                var tData = sData.tData;
                if (tData) {
                    if (tData.fieldId) {//金币场显示场次名称
                        this.removeFromParent(true);
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
                    if (tData) return "第" + (tData.roundAll - tData.roundNum + 1) + "/" + tData.roundAll + "局";
                },
                _event: {
                    mjhand: function () {
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;
                        if (tData) return this.setString("第" + (tData.roundAll - tData.roundNum + 1) + "/" + tData.roundAll + "局");
                    }
                }
            }
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
                    //this.visible = IsArrowVisible();
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
                        if (tData) this.setString(MjClient.majiang.getAllCardsTotal() - tData.cardNext);
                        cc.log(MjClient.majiang.getAllCardsTotal() + "-----------------waitPut------------------" + tData.cardNext);
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
                // _run:function()
                // {
                //     var text = new ccui.Text();
                //     text.setFontName(MjClient.fzcyfont);
                //     text.setFontSize(20);
                //     text.setRotation(-90);
                //     text.setAnchorPoint(0,0.5);
                //     text.setPosition(23.5, 20.5);
                //     this.addChild(text);
                //     text.schedule(function(){
                //         var time = MjClient.getCurrentTime();
                //         var str = time[0]+"/"+time[1]+"/"+ time[2]+" "+
                //             (time[3]<10?"0"+time[3]:time[3])+":"+
                //             (time[4]<10?"0"+time[4]:time[4])+":"+
                //             (time[5]<10?"0"+time[5]:time[5]);
                //         this.setString(str);
                //     });
                // }
            }
        },
        info:
        {
            _visible: false,
            _layout: [
                [0.16, 0.16],
                [0.01, 0.935],
                [0, 0]
            ]
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
                    if (MjClient.rePlayVideo == -1)  // 回放时候不能显示
                        showPlayUI_roundInfo(this.getString(), tData.fieldId ? (getJinbiStr(MjClient.data.sData.tData.fieldBase) + "金币") : tData.tableid, tData.fieldId ? "底分 " : "");
                }
            }
        },
        banner: {
            _layout: [
                [0.5, 0.5],
                [0.5, 1],
                [0, 0]
            ],
            bg_time: {
                _run: function () {
                    var text = new ccui.Text();
                    text.setFontName(MjClient.fzcyfont);
                    text.setFontSize(24);
                    text.setFontName("fonts/lanting.TTF");
                    text.setAnchorPoint(1, 0.5);
                    text.setPosition(66, 15);
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
                    updateWifiState(this);
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
                            this.setString(MjClient.data.sData.tData.tableid);

                        }
                    }
                }
            },
            setting: {
                _run: function () {
                    this.setScale(0.6);
                    this.setPositionX(this.getParent().getContentSize().width * 1.43);
                },
                _click: function () {
                    var settringLayer = new SettingView();
                    settringLayer.setName("PlayLayerClick");
                    MjClient.Scene.addChild(settringLayer);
                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Shezhi", { uid: SelfUid(), gameType: MjClient.gameType });
                }
            },
            Button_1: {
                _visible: true,
                _click: function () {
                    MjClient.openWeb({ url: MjClient.GAME_TYPE.LIAN_YUN_GANG, help: true });
                }
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
                    cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>newCard by sking");
                    this.visible = true;
                    //setWgtLayout(this, [0.1, 0.1],[0.7, 0.2],[0, 0]);
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

                    //cc.log("点击出牌");
                    /////*
                    ////    for sking 出牌 测试
                    ////    todo..还需要判断出牌按钮的状态
                    ////*/tData.tState
                    //
                    //var sData = MjClient.data.sData;
                    //cc.log("sData.tState == " + sData.tState);
                    ////if(!IsTurnToMe() || sData.tState != TableState.waitPut)
                    ////{
                    ////    mylog("not my turn");
                    ////    return;
                    ////}
                    //var downNode = MjClient.playui._downNode;
                    //var standUI = downNode.getChildByName("stand");
                    //var children = downNode.children;
                    //for(var i = 0; i < children.length; i++)
                    //{
                    //    if(children[i].name == "mjhand")
                    //    {
                    //        if(children[i].y > standUI.y + 10)
                    //        {
                    //            PutOutCard(children[i], children[i].tag); //可以出牌
                    //            break;
                    //        }
                    //    }
                    //}
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
                        TouResult: function (sD) {
                            MjClient.playui.showUserTouAction(this, 0, sD);
                        },
                        KingCard: function (sD) {
                            MjClient.playui.showUserTouAction(this, 0, sD);
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
                    [0.054, 0],
                    [0.5, 0],
                    [8, 0.68]
                ],
                _visible: false,
                _run: function () {
                    // this.zIndex = 500;
                },
            },
            up: {
                _layout: [
                    [0.05, 0],
                    [0, 0],
                    [0.8, 0.7]
                ],
                _visible: false
            },
            down: {
                _layout: [
                    [0.05, 0],
                    [0, 0],
                    [3.5, 1]
                ],
                _visible: false
            },
            out2: {
                _run: function () {
                    if (MjClient.size.width / MjClient.size.height >= 1.5) {
                        setWgtLayout(this, [0.0, 0.0763], [0.53, 0], [-7, 5.7]);
                    } else {

                        setWgtLayout(this, [0.0, 0.07], [0.53, 0], [-7, 5.7]);
                    }
                    if (MjClient.MaxPlayerNum == 2)
                        this.x -= this.height * this.scale * 5;
                },
                _visible: false
            },
            out1: {
                _run: function () {
                    if (MjClient.size.width / MjClient.size.height >= 1.5) {

                        setWgtLayout(this, [0.0, 0.0763], [0.53, 0], [-7, 4.7]);
                    } else {

                        setWgtLayout(this, [0.0, 0.07], [0.53, 0], [-7, 4.7]);
                    }
                    if (MjClient.MaxPlayerNum == 2)
                        this.x -= this.height * this.scale * 5;
                },
                _visible: false
            },
            out0: {
                _run: function () {
                    if (MjClient.size.width / MjClient.size.height >= 1.5) {
                        setWgtLayout(this, [0.0, 0.0763], [0.53, 0], [-7, 3.7]);
                    } else {
                        setWgtLayout(this, [0.0, 0.07], [0.53, 0], [-7, 3.7]);
                    }
                    if (MjClient.MaxPlayerNum == 2)
                        this.x -= this.height * this.scale * 5;
                },

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
            myTurnBg: {
                _visible: false,
                _layout: [
                    [1, 1],
                    [0.5, 0.5],
                    [0, 0]
                ],
                _event: {
                    TurnMeOutCard: function (sD) {
                        var pl = getUIPlayer(0);
                        cc.log('------TurnMeOutCard--------', pl.info.uid, sD.uid)
                        this.setVisible(pl.info.uid == sD.uid);
                    },
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
                    InitUserHandUI_Red20(this, 0);
                },
                roundEnd: function () {
                    InitUserCoinAndName(this, 0);
                    //setTaiInfo("");
                },
                newCard: function (eD) {
                    // cdsNums++;
                    console.log("客户端发牌组合...... ");
                    //cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>newCard---------------");
                    //var putButtn = this.getChildByName("BtnPutCard");
                    //putButtn.visible = true;
                    //MjClient.playui._btnPutCard.visible = true;
                    if (typeof (eD) == "number") {
                        eD = { newCard: eD };
                    }
                    DealNewCard(this, eD.newCard, 0);// checkCanTing(eD);
                    hideTingBtn();
                },
                MJPut: function (eD) {
                    cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>MJPut---------------");
                    cc.log("重置头像信息位置");
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    var uids = tData.uids;
                    cc.log("======================重置头像信息位置 =  " + uids);

                    DealMJPut(this, eD, 0);
                    var pl = getUIPlayer(0);
                    if (eD.uid === SelfUid()) {
                        // var _tingCards = this.getChildByName("tingCardsNode");
                        // var tingSet = calTingSet(pl.mjhand);
                        // setTingCards(_tingCards, tingSet);
                    }
                    MjClient.playui.jsBind.eat.ting._node.visible = false;//托管清除听牌按钮
                    setUserOffline(this, 0);
                },
                MJChi: function (eD) {
                    DealMJChi(this, eD, 0);
                    setUserOffline(this, 0);
                },
                MJGang: function (eD) {
                    DealMJGang(this, eD, 0);
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
                TouResult: function (sD) {
                    MjClient.playui.DealAndMoveCard(this, sD, 0);
                },
                //系统发牌
                SystemCard: function (sD) {
                    MjClient.playui.showMJOutBig(this, sD, 0);
                },
                //游戏中偷牌
                KingCard: function (sD) {
                    MjClient.playui.KingCard(this, sD, 0);
                },
                //游戏中偷牌
                GetNewCard: function (sD) {
                    MjClient.playui.DealAndMoveCard(this, { Cards: [sD.Card], uid: sD.uid }, 0);
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
                        TouResult: function (sD) {
                            MjClient.playui.showUserTouAction(this, 1, sD);
                        },
                        KingCard: function (sD) {
                            MjClient.playui.showUserTouAction(this, 1, sD);
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
                    [1, 1],
                    [-5.5, -2.3]
                ],
                _visible: false
            },
            up: {
                _layout: [
                    [0, 0.05],
                    [1, 0],
                    [-3.0, 6]
                ],
                _visible: false
            },
            down: {
                _layout: [
                    [0, 0.05],
                    [1, 0],
                    [-3, 6.3]
                ],
                _visible: false
            },
            out0: {
                _run: function () {
                    if (MjClient.size.width / MjClient.size.height >= 1.5) {
                        setWgtLayout(this, [0, 0.0545], [1, 0.5], [-4.6, -4.1]);
                    } else {
                        setWgtLayout(this, [0, 0.05], [1, 0.5], [-4.6, -5.1]);
                    }
                },
                _visible: false
            },
            out1: {
                _run: function () {
                    if (MjClient.size.width / MjClient.size.height >= 1.5) {
                        setWgtLayout(this, [0, 0.0545], [1, 0.5], [-5.8, -4.1]);
                    } else {
                        setWgtLayout(this, [0, 0.05], [1, 0.5], [-5.8, -5.1]);
                    }

                },
                _visible: false
            },
            out2: {
                _run: function () {
                    if (MjClient.size.width / MjClient.size.height >= 1.5) {
                        setWgtLayout(this, [0, 0.0545], [1, 0.5], [-7.0, -4.1]);
                    } else {
                        setWgtLayout(this, [0, 0.05], [1, 0.5], [-7.0, -5.1]);
                    }
                },
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
            myTurnBg: {
                _visible: false,
                _layout: [
                    [1, 1],
                    [0.5, 0.5],
                    [0, 0]
                ],
                _event: {
                    TurnMeOutCard: function (sD) {
                        var pl = getUIPlayer(1);
                        cc.log('------TurnMeOutCard--------', pl.info.uid, sD.uid)
                        this.setVisible(pl.info.uid == sD.uid);
                    },
                }
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
                    InitUserHandUI_Red20(this, 1);
                },
                roundEnd: function () {
                    InitUserCoinAndName(this, 1);
                },
                waitPut: function () {
                    DealWaitPut(this, MjClient.data.sData.tData, 1);
                },
                MJPut: function (eD) {
                    DealMJPut(this, eD, 1);
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
                TouResult: function (sD) {
                    MjClient.playui.DealAndMoveCard(this, sD, 1);
                },
                //系统发牌
                SystemCard: function (sD) {
                    MjClient.playui.showMJOutBig(this, sD, 1);
                },
                //游戏中偷牌
                KingCard: function (sD) {
                    MjClient.playui.KingCard(this, sD, 1);
                },
                //游戏中偷牌
                GetNewCard: function (sD) {
                    MjClient.playui.DealAndMoveCard(this, { Cards: [sD.Card], uid: sD.uid }, 1);
                },
            }
        },
        top: {
            _run: function () {
                this.visible = MjClient.MaxPlayerNum != 3;
            },
            myTurnBg: {
                _visible: false,
                _layout: [
                    [1, 1],
                    [0.5, 0.5],
                    [0, 0]
                ],
                _event: {
                    TurnMeOutCard: function (sD) {
                        var pl = getUIPlayer(2);
                        cc.log('------TurnMeOutCard--------', pl.info.uid, sD.uid)
                        this.setVisible(pl.info.uid == sD.uid);
                    },
                }
            },
            head: {
                tou: {
                    _run: function () {
                        this.visible = false;
                    },
                    _event: {
                        TouResult: function (sD) {
                            MjClient.playui.showUserTouAction(this, 2, sD);
                        },
                        KingCard: function (sD) {
                            MjClient.playui.showUserTouAction(this, 2, sD);
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
                    [0.5, 1],
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
                _visible: false
            },
            down: {
                _layout: [
                    [0, 0.07],
                    [0.5, 1],
                    [6, -0.7]
                ],
                _visible: false
            },

            out0: {
                _run: function () {
                    if (MjClient.size.width / MjClient.size.height >= 1.5) {
                        setWgtLayout(this, [0, 0.0763], [0.5, 1], [6.8, -2.5]);
                    } else {
                        setWgtLayout(this, [0, 0.07], [0.5, 1], [6.8, -2.5]);
                    }
                    if (MjClient.MaxPlayerNum == 2)
                        this.x += this.height * this.scale * 5.5;
                },

                _visible: false
            },
            out1: {
                _run: function () {
                    if (MjClient.size.width / MjClient.size.height >= 1.5) {
                        setWgtLayout(this, [0, 0.0763], [0.5, 1], [6.8, -3.5]);
                    } else {
                        setWgtLayout(this, [0, 0.07], [0.5, 1], [6.8, -3.5]);
                    }
                    if (MjClient.MaxPlayerNum == 2)
                        this.x += this.height * this.scale * 5.5;
                },

                _visible: false
            },
            out2: {
                _run: function () {
                    if (MjClient.size.width / MjClient.size.height >= 1.5) {
                        setWgtLayout(this, [0, 0.0763], [0.5, 1], [6.8, -4.5]);
                    } else {
                        setWgtLayout(this, [0, 0.07], [0.5, 1], [6.8, -4.5]);
                    }
                    if (MjClient.MaxPlayerNum == 2)
                        this.x += this.height * this.scale * 5.5;
                },

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
                    InitUserHandUI_Red20(this, 2);
                },
                roundEnd: function () {
                    InitUserCoinAndName(this, 2);

                },
                waitPut: function () {
                    DealWaitPut(this, MjClient.data.sData.tData, 2);
                },
                MJPut: function (eD) {
                    DealMJPut(this, eD, 2);
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
                TouResult: function (sD) {
                    MjClient.playui.DealAndMoveCard(this, sD, 2);
                },
                //系统发牌
                SystemCard: function (sD) {
                    MjClient.playui.showMJOutBig(this, sD, 2);
                },
                //游戏中偷牌
                KingCard: function (sD) {
                    MjClient.playui.KingCard(this, sD, 2);
                },
                //游戏中偷牌
                GetNewCard: function (sD) {
                    MjClient.playui.DealAndMoveCard(this, { Cards: [sD.Card], uid: sD.uid }, 2);
                },
            }
        },
        left: {
            _run: function () {
                this.visible = MjClient.MaxPlayerNum != 2;
            },
            myTurnBg: {
                _visible: false,
                _layout: [
                    [1, 1],
                    [0.5, 0.5],
                    [0, 0]
                ],
                _event: {
                    TurnMeOutCard: function (sD) {
                        var pl = getUIPlayer(3);
                        cc.log('------TurnMeOutCard--------', pl.info.uid, sD.uid)
                        this.setVisible(pl.info.uid == sD.uid);
                    }
                }
            },
            head: {
                tou: {
                    _run: function () {
                        this.visible = false;
                    },
                    _event: {
                        TouResult: function (sD) {
                            MjClient.playui.showUserTouAction(this, 3, sD);
                        },
                        KingCard: function (sD) {
                            MjClient.playui.showUserTouAction(this, 3, sD);
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
                    [0, 0.05],
                    [0, 1],
                    [3.0, -3.5]
                ],
                _visible: false
            },
            down: {
                _layout: [
                    [0, 0.05],
                    [0, 1],
                    [3, -3]
                ],
                _visible: false
            },
            stand: {
                _layout: [
                    [0, 0.08],
                    [0, 0],
                    [5.2, 3]
                ],
                _visible: false
            },

            out0: {
                _run: function () {
                    if (MjClient.size.width / MjClient.size.height >= 1.5) {
                        setWgtLayout(this, [0, 0.0545], [0, 0.5], [4.5, 4.8]);
                    } else {
                        setWgtLayout(this, [0, 0.05], [0, 0.5], [4.5, 4.8]);
                    }
                    if (MjClient.MaxPlayerNum == 3)
                        this.y += this.height * this.scale * 2;
                },

                _visible: false
            },
            out1: {
                _run: function () {
                    if (MjClient.size.width / MjClient.size.height >= 1.5) {
                        setWgtLayout(this, [0, 0.0545], [0, 0.5], [5.6, 4.8]);
                    } else {
                        setWgtLayout(this, [0, 0.05], [0, 0.5], [5.6, 4.8]);
                    }
                    if (MjClient.MaxPlayerNum == 3)
                        this.y += this.height * this.scale * 2;
                },
                _visible: false
            },
            out2: {
                _run: function () {
                    if (MjClient.size.width / MjClient.size.height >= 1.5) {
                        setWgtLayout(this, [0, 0.0545], [0, 0.5], [6.7, 4.8]);
                    } else {
                        setWgtLayout(this, [0, 0.05], [0, 0.5], [6.7, 4.8]);
                    }
                    if (MjClient.MaxPlayerNum == 3)
                        this.y += this.height * this.scale * 2;
                },
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
                    InitUserHandUI_Red20(this, 3);
                },
                roundEnd: function () {
                    InitUserCoinAndName(this, 3);
                },
                waitPut: function () {
                    DealWaitPut(this, MjClient.data.sData.tData, 3);
                },
                MJPut: function (eD) {
                    DealMJPut(this, eD, 3);
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
                TouResult: function (sD) {
                    MjClient.playui.DealAndMoveCard(this, sD, 3);
                },
                //系统发牌
                SystemCard: function (sD) {
                    MjClient.playui.showMJOutBig(this, sD, 3);
                },
                //游戏中偷牌
                KingCard: function (sD) {
                    MjClient.playui.KingCard(this, sD, 3);
                },
                //游戏中偷牌
                GetNewCard: function (sD) {
                    MjClient.playui.DealAndMoveCard(this, { Cards: [sD.Card], uid: sD.uid }, 3);
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
                    if (eT == 2) MJChiCardchange(btn.tag);
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
                    console.log(">>>> lf，点击碰按钮");
                    if (eT == 2) MJPengToServer();
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
                    if (eT == 2) MJGangCardchange(btn.tag);
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
                        this.visible = false;
                        MJTouToServer();
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
                                if (btn.name.localeCompare("card3") < 0) {
                                    MJChiToServer(0);
                                }
                                else if (btn.name.localeCompare("card6") < 0) {
                                    MJChiToServer(1);
                                }
                                else {
                                    MJChiToServer(2);
                                }
                            }
                        };
                        this.gangTouch = function (btn, et) {
                            if (et == 2)
                                MJGangToServer(btn.tag);
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
                    //add by sking
                    cc.log("ting yu no ting hide --------by sking");
                    MjClient.playui.EatVisibleCheck();
                    hideTingBtn();
                },
                MJPass: function (eD) {
                    console.log("HHH :，MJPass------");
                    setSkipHuState();
                    setSkipPengState(); // 开启 过碰 机制
                    MjClient.playui.EatVisibleCheck();
                },
                mjhand: function (eD) {
                    console.log("HHH :，mjhand------");
                    MjClient.playui.EatVisibleCheck();
                },
                waitPut: function () {
                    console.log("HHH :，waitPut------");
                    MjClient.playui.EatVisibleCheck();
                },
                MJPut: function (eD) {
                    console.log("HHH :，MJPut------");
                    MjClient.playui.EatVisibleCheck();
                    MjClient.playui.jsBind.eat.playercardtip._node.visible = false;
                },
                MJPeng: function (eD) {
                    console.log("HHH :，MJPeng------");
                    MjClient.playui.EatVisibleCheck();
                },
                MJChi: function (eD) {
                    console.log("HHH :，MJChi------");
                    MjClient.playui.EatVisibleCheck();
                },
                MJGang: function (eD) {
                    console.log("HHH :，MJGang------");
                    MjClient.playui.EatVisibleCheck();
                },
                MJTing: function (eD) {
                    console.log("HHH :，MJTing------");
                    hideTingBtn();
                    MjClient.playui.jsBind.eat.guo._node.visible = false;
                    isCheckedTing = false;
                },

                OptBtnShow: function (eD) {
                    console.log("HHH :，OptBtnShow------", eD);
                    MjClient.playui.EatVisibleCheck();
                },
                roundEnd: function (eD) {
                    console.log("HHH :，roundEnd------");
                    MjClient.playui.EatVisibleCheck();
                },
                initSceneData: function (eD) {
                    function delayExe() {
                        cc.log("MjClient.playui == >");
                        cc.log(MjClient.playui);
                        MjClient.playui.EatVisibleCheck();

                    }
                    this.runAction(cc.sequence(cc.DelayTime(0.1), cc.callFunc(delayExe)));
                }
            }
        },
        chat_btn: {
            _layout: [
                [0.08, 0.08], [0.97, 0.1], [0, 3.2]
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
                [0.08, 0.08], [0.97, 0.2], [0, 3.2]
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
        }
    },
    _downNode: null,
    _rightNode: null,
    _topNode: null,
    _leftNode: null,
    TableOutData: { pos: -1, Card: 0 },
    ctor: function () {
        this._super();
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

        // ScanCheatLayer.initButton(playui.node, 0.75, 0.92);

        //MjClient.playui._btnPutCard.visible = false;

        BindUiAndLogic(playui.node, this.jsBind);

        // 添加光晕动画
        COMMON_UI.addAniEatCardsBtn();

        this.addChild(playui.node);

        if (MjClient.data.sData.tData.areaSelectMode["convertible"] && MjClient.rePlayVideo == -1)
            addFreeNumberBtn([0.5, 0.4]);

        //添加滚动通知 by sking
        var _laba_bg = playui.node.getChildByName("banner").getChildByName("laba_bg");
        _laba_bg.visible = false;
        var _scroll = playui.node.getChildByName("banner").getChildByName("scroll");
        _scroll.visible = false;


        //var _msg = _scroll.getChildByName("msg");
        //homePageRunText(_msg);
        //function getMsg()
        //{
        //    var content = (MjClient.updateCfg != null && (typeof MjClient.updateCfg) != 'undefined') ? MjClient.updateCfg.homeScroll : "";
        //    return MjClient.isTest ? "" : content;
        //}
        //_msg.setString(getMsg());

        MjClient.lastMJTick = Date.now();
        this.runAction(cc.repeatForever(cc.sequence(cc.callFunc(function () {
            if (MjClient.game_on_show) MjClient.tickGame(0);
        }), cc.delayTime(7))));

        changeMJBg(this, getCurrentMJBgType());

        var _currentMJType = getCurrentMJBgType();
        postEvent("changeMJBgEvent", _currentMJType);
        //初始化其他功能
        initSceneFunc();
        // 在亲友圈房间中添加邀请亲友圈牌有一起对局
        addClubYaoqingBtn(1);
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
        cp.loadTexture(getSpriteFrameByCard(-1));
    }
    return cp;
}
//获取资源
function getSpriteFrameByCard(card) {
    let str = ''
    if (card == -1) {
        str = 'back'
    } else {
        str = GetCardColor(card) + '-' + GetCardNum(card)
    }
    return 'Red20/Card/' + str + '.png'
}
function GetCardColor(card) {
    return Math.floor(card / 16)
}
function GetCardNum(card) {
    return card % 16
}
//设置牌的渲染
PlayerGamePanel_Red20.prototype.setCardSprite = function (node, cd, off) {
    //东南西北中发白
    var offSets = [[52, 104], [65, 68], [52, 104], [65, 68], [50, 66], [53, 64], [19, 25]];;
    var MJBgType = getCurrentMJBgType();

    if (!COMMON_UI3D.is3DUI()) {
        if (MJBgType == 0)
            offSets = [[50, 95], [60, 66], [50, 95], [60, 66], [52, 68], [53, 64], [19, 25]];
        else if (MJBgType == 1)
            offSets = [[52, 100], [65, 68], [52, 100], [65, 68], [52, 66], [53, 64], [19, 25]];
        else if (MJBgType == 2 && MjClient.gameType != MjClient.GAME_TYPE.XIANG_YIN_TUI_DAO_HU)
            offSets = [[52, 105], [55, 70], [52, 105], [70, 70], [50, 76], [53, 64], [19, 25]];
        else if (MJBgType == 3)
            offSets = [[52, 104], [65, 68], [52, 104], [65, 68], [50, 66], [53, 64], [19, 25]];
    }


    //麻将的底牌公用图，4张
    node.loadTexture(getSpriteFrameByCard(cd));

    if (cc.sys.isObjectValid(node) && cd != null && typeof (cd) != "undefined") {
        node.tag = cd;
    }
    //调牌背和牌面的大小
    // setMJDif(node, off);
}

PlayerGamePanel_Red20.prototype.CardLayoutRestore = function (node, off) {
    // node 是克隆新建的一个麻将节点 by sking
    // cc.log("排布"+off);
    var newC = null; //先创建麻将的UI节点
    var newVal = 0; //新牌的值，是几万，几筒，几条....为数字
    var pl; //player 信息

    pl = getUIPlayer(off);//获取玩家信息.off 为0 ，就是自己得信息，能看到自己摸牌 by sking

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
        }
    }

    var tempMaJiang = MjClient.majiang; //麻将的各种方法判断，是否可以杠，是否可以吃... by sking

    //排序麻将的位置 by sking
    if (off == 0 && pl.mjhand && pl.mjhand.length > 0) {
        var count = tempMaJiang.CardCount(pl);
        if (count == 14 && mjhandNum == pl.mjhand.length) {
            if (pl.isNew) //isNew 每次摸完牌后设为true,打出去一张牌后 设为false by sking
            {
                newVal = pl.mjhand[pl.mjhand.length - 1]; //为什么取最后一个节点 ？
            }
            else {
                pl.mjhand.sort(function (a, b) {
                    if (tempMaJiang.isEqualHunCard(a)) {
                        return -1;
                    }
                    else if (tempMaJiang.isEqualHunCard(b)) {
                        return 1;
                    }
                    else {
                        return a - b;
                    }
                });
                newVal = pl.mjhand[pl.mjhand.length - 1];
            }
        }
    }

    //up stand 是2种麻将的图。
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
            start = up;
            offui = up;
            break;
    }

    var upSize = offui.getSize();
    var upS = offui.scale;
    //mjhand standPri out chi peng gang0 gang1
    var uipeng = [];
    var uigang0 = [];
    var uigang1 = [];
    var uichi = [];
    var uistand = [];
    var uihun = [];//癞子牌在最左边
    var uiTou = [];
    // var sData = MjClient.data.sData;
    // var tData = sData.tData;
    for (var i = 0; i < children.length; i++) //children 为 "down" 节点下的字节点
    {
        var ci = children[i];
        if (ci.name == "mjhand") {
            // cc.log("------------layout card ==== " + ci.tag);
            if (newC == null && newVal == ci.tag) {
                newC = ci; //从down 节点下，复制一个麻将node保存在newC 里 by sking
            }
            else {
                if (tempMaJiang.isEqualHunCard(ci.tag)) {
                    uihun.push(ci);
                }
                else {
                    uistand.push(ci);
                }
            }

            if (tempMaJiang.isEqualHunCard(ci.tag)) {
                ci.setColor(cc.color(255, 255, 63));
            }

        }
        else if (ci.name == "standPri") {
            uistand.push(ci);
        }
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
        else if (ci.name == "mjhand_replay") {
            uistand.push(ci);
        } else if (ci.name == "tou") {
            uiTou.push(ci);
        }
    }

    // //听牌后不应该在洗牌了
    // if(pl.isTing != undefined && !pl.isTing)
    // {
    //  uistand.sort(TagOrder);
    // }
    uistand.sort(TagOrder);

    if (uihun.length > 0) //是否有柰子，有则放在最前面 by sking
    {
        for (var i = 0; i < uihun.length; i++) {
            uistand.unshift(uihun[i]); //向数组开头添加一个元素 unshift
        }
    }

    if (newC) {
        uistand.push(newC); //把这张牌放入手牌的数组里  by sking
    }

    var uiOrder = [uiTou, uigang1, uigang0, uipeng, uichi, uistand];
    if (off == 1 || off == 2) {
        uiOrder.reverse();//颠倒顺序
    }

    var orders = []; //重新排序后装到数组里 by sking
    for (var j = 0; j < uiOrder.length; j++) {
        var uis = uiOrder[j];
        for (var i = 0; i < uis.length; i++) {
            orders.push(uis[i]);
        }
    }

    //设置麻将大小
    var slotwith = upSize.width * upS * 0.5;//0.05;
    var slotheigt = upSize.height * upS * 0.3;
    var hasUp = false;
    for (var i = 0; i < orders.length; i++) {
        var ci = orders[i];


        if (off % 2 == 0)//自己或者对家
        {
            if (i != 0) {
                if (ci.name == orders[i - 1].name) {
                    if (ci.isgang4) {
                        ci.x = orders[i - 2].x;
                        ci.y = orders[i - 2].y + upSize.height * upS * 0.18;
                    }
                    else if (orders[i - 1].isgang4) {
                        ci.x = orders[i - 2].x + upSize.width * upS + slotwith;
                    }
                    else if (orders[i - 1].ispeng3 || orders[i - 1].ischi3) {
                        ci.x = orders[i - 1].x + upSize.width * upS + slotwith;
                    }
                    else {
                        if (ci.name == "mjhand") {
                            if (off == 0) {
                                ci.x = orders[i - 1].x + upSize.width * upS * 1.2//1.08;
                            }
                            else//这个地方不是对家的手牌，下面的代码好像没用
                            {
                                ci.x = orders[i - 1].x + upSize.width * upS * 1.8;
                            }
                        }
                        else {
                            if (off == 0) {
                                ci.x = orders[i - 1].x + upSize.width * upS * 0.91;
                            }
                            else {
                                ci.x = orders[i - 1].x + upSize.width * upS * 1;//对家的手牌
                            }
                        }
                    }
                }
                else if (orders[i - 1].name == "gang0" || orders[i - 1].name == "gang1") {
                    ci.x = orders[i - 2].x + upSize.width * upS + slotwith;
                }
                else {
                    ci.x = orders[i - 1].x + upSize.width * upS * 1.3;
                }
            }
            else {
                if (off == 0) {
                    ci.x = start.x + upSize.width * upS * 0.1;
                }
                else {
                    ci.x = start.x + upSize.width * upS;
                }

                if (off == 0) {
                    cc.log("===== first card y ======== " + ci.y);
                }

                var isGray = pl.isTing && ci.name === "mjhand";
                if (isGray) {
                    ci.setColor(cc.color(190, 190, 190));
                    ci.addTouchEventListener(function () { });
                }

                if (ci.name == "mjhand" && (pl.isTing || MjClient.clickTing && !MjClient.canTingCards[ci.tag]))
                    ci.setColor(cc.color(190, 190, 190));
                else
                    ci.setColor(cc.color(255, 255, 255));
            }

            if (off == 0) {
                /*
                 ting的情况下，将麻将置灰
                 */
                // console.log("--------orders.length--------"+orders.length);
                var isGray = pl.isTing && ci.name == "mjhand";
                if (MjClient.clickTing) {
                    if (ci.name == "mjhand") {
                        cc.log("--------MjClient.canTingCards--------" + JSON.stringify(MjClient.canTingCards));
                        cc.log("--------MjClient.ci.tag--------" + ci.tag);
                        if (MjClient.canTingCards[ci.tag]) {
                            cc.log("--------ci.tag--------" + ci.tag);
                            ci.setColor(cc.color(255, 255, 255));
                            if (!hasUp) {
                                ci.y += 20;
                                hasUp = true;
                            }
                        }
                        else {
                            ci.setColor(cc.color(190, 190, 190));
                        }
                    }
                    else {
                        ci.setColor(cc.color(255, 255, 255));
                    }
                }
                else if (i == orders.length - 1) {
                    console.log(ci.tag + "--------newC--------" + newC);
                    if (newC) {
                        ci.setColor(cc.color(255, 255, 255));
                        SetTouchCardHandler(stand, ci);
                        ci.x = ci.x + slotwith + 10;
                        ci.y += 20;
                    }
                    else if (isGray) {
                        ci.setColor(cc.color(190, 190, 190));
                        ci.addTouchEventListener(function () { });
                    }
                    else {
                        ci.setColor(cc.color(255, 255, 255));
                        SetTouchCardHandler(stand, ci);
                    }
                }
                else if (isGray) {
                    ci.setColor(cc.color(190, 190, 190));
                    ci.addTouchEventListener(function () { });
                }
                else {
                    ci.setColor(cc.color(255, 255, 255));
                    SetTouchCardHandler(stand, ci);
                }
            }
        }
        else {
            if (i != 0) {
                if (ci.name == orders[i - 1].name) {
                    if (ci.isgang4) {
                        ci.y = orders[i - 2].y + slotheigt;
                    }
                    else if (orders[i - 1].isgang4) {
                        ci.y = orders[i - 2].y - upSize.height * upS * 1.1;
                    }
                    else if (orders[i - 1].ispeng3 || orders[i - 1].ischi3) {
                        ci.y = orders[i - 1].y - upSize.height * upS * 1.1;
                    }
                    else {
                        ci.y = orders[i - 1].y - upSize.height * upS * 0.8;
                    }
                }
                else if (orders[i - 1].name == "standPri") {
                    ci.y = orders[i - 1].y - upSize.height * upS * 2;
                }
                else if (orders[i - 1].name == "gang0" || orders[i - 1].name == "gang1") {
                    ci.y = orders[i - 2].y - upSize.height * upS * 1.1;
                }
                else if (orders[i - 1].name == "mjhand_replay") {
                    ci.y = orders[i - 1].y - upSize.height * upS * 2;
                }
                else {
                    ci.y = orders[i - 1].y - upSize.height * upS * 1.1;
                }

                ci.zIndex = orders[i - 1].zIndex + 1;//调整每张牌的层级
            }
            else {
                ci.y = start.y - upSize.height * upS * 0.2;
                ci.y += 10;
                ci.zIndex = start.zIndex;//第一张牌的层级
            }

        }


        //if(ci.heng) {
        //    setCardLayoutTag(ci);
        //}
        //
        //if(ci.isgang4)
        //{
        //    if (orders[i - 2].heng)
        //    {
        //        setCardLayoutTag(ci);
        //    }
        //}
    }

    //刷新手牌
    if (COMMON_UI3D.is3DUI()) {
        COMMON_UI3D.set3DCardSprite(off);
    }
    else {
        //刷新手牌大小
        resetCardSize();
    }
};

// 判断吃碰杠胡的状态
PlayerGamePanel_Red20.prototype.EatVisibleCheck = function () {
    var eat = MjClient.playui.jsBind.eat;
    //sk 为啥要隐藏掉？   //因为一开始是不可见的，隐藏根节点 by sking
    MjClient.playui.jsBind.eat.changeui.changeuibg._node.visible = false;
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var leftCard = MjClient.majiang.getAllCardsTotal() - tData.cardNext;

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


    var pl = sData.players[SelfUid() + ""];
    MjClient.gangCards = [];
    MjClient.eatpos = [];

    var mj = MjClient.majiang;

    //吃碰杠胡node
    var vnode = [];

    if (pl) {
        let haveGuo = !pl.isTing;
        if (pl.eatFlag & 16) {
            haveGuo = false;
            vnode.push(eat.tou._node);
        }
        pl.eatFlag & 32 && vnode.push(eat.ting._node);
        pl.eatFlag & 1 && vnode.push(eat.chi1._node);
        pl.eatFlag & 8 && vnode.push(eat.hu._node);
        pl.eatFlag & 2 && vnode.push(eat.peng._node);
        pl.eatFlag & 4 && vnode.push(eat.gang1._node);
        vnode.length > 0 && haveGuo && vnode.push(eat.guo._node);
    }

    //吃碰杠胡过处理
    if (vnode.length > 0) {
        var btnImgs =
        {
            "peng": ["Red20/Controller/btn_peng.png", "Red20/Controller/btn_peng.png"],
            "gang1": ["Red20/Controller/btn_gang.png", "Red20/Controller/btn_gang.png"],
            "ting": ["Red20/Controller/btn_ting.png"],
            "guo": ["Red20/Controller/btn_guo.png"],
            "chi1": ["Red20/Controller/btn_chi.png", "Red20/Controller/btn_chi.png"],
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

            if (btnName == "ting" || btnName == "guo" || btnName == "chi1" || btnName == "hu") {
                vnode[i].loadTextureNormal(btnImgs[btnName][0]);
                // vnode[i].loadTexturePressed(btnImgs[btnName][1]);
            }

            if (i == 0) {
                var cardVal = 0;
                if (vnode[i].getChildByName("bgimg")) {
                    vnode[i].getChildByName("bgimg").visible = false;
                }

                if (btnName == "peng" || btnName == "chi0" || btnName == "gang0") {
                    vnode[i].loadTextureNormal(btnImgs[btnName][0]);
                    // vnode[i].loadTexturePressed(btnImgs[btnName][1]);
                }

                if (btnName == "peng") {
                    cardVal = tData.lastPutCard;
                }
                else if (btnName == "chi0") {
                    if (MjClient.eatpos.length == 1) {
                        cardVal = tData.lastPutCard;
                    }
                }
                else if (btnName == "gang0") {
                    if (MjClient.gangCards.length == 1) {
                        cardVal = MjClient.gangCards[0];
                    }
                }
                else if (btnName == "hu") {
                    if (IsTurnToMe()) {
                        cardVal = pl.mjhand[pl.mjhand.length - 1];
                    }
                    else {
                        cardVal = tData.lastPutCard;
                    }
                }

                if (cardVal && cardVal > 0) {
                    setCardSprite(vnode[0].getChildByName("card1"), cardVal, 0);
                    vnode[0].getChildByName("card1").visible = true;
                }

                if (vnode[0].getChildByName("bgground"))//只有吃的时候才提示
                {
                    vnode[0].getChildByName("bgground").zIndex = -1;
                    vnode[0].getChildByName("bgground").visible = true;
                }

                //屏蔽到 碰 ，杠 的显示牌 add by sking
                if (vnode[0].getChildByName("bgground")) {
                    vnode[0].getChildByName("bgground").visible = false;
                }
                if (vnode[i].getChildByName("card1")) {
                    vnode[i].getChildByName("card1").visible = false;
                }
                //end of 屏蔽 碰，杠的显示牌
            }

            setWgtLayout(vnode[i], [0, 0.2], [0.5, 0], [(1 - vnode.length) / 1.8 + i * 1.2, 1.8], false, false);
        }
    }
    cc.log('000000000000000000000', pl.eatFlag)
    /*吃碰杠按钮，适配iOS*/
    COMMON_UI.vnodeAdaptForiOS(vnode);

    // if (eat.hu._node.visible) {
    //     MjClient.playui._btnPutCard.visible = false;
    // }
};



PlayerGamePanel_Red20.prototype.DealAndMoveCard = function (node, msg, off) {
    let delCards = msg.Kings || [], addCards = msg.Cards || [], name = off == 0 ? 'mjhand' : (MjClient.rePlayVideo == -1 ? 'standPri' : "mjhand_replay");
    let moveNode = [];
    let cp = getUIPlayer(off);
    if (cp && cp.info.uid == msg.uid) {
        for (let _i = 0; _i < delCards.length; _i++) {
            const king = delCards[_i];
            if (off === 0 || MjClient.rePlayVideo != -1) {
                for (var i = 0; i < node.children.length; i++) {
                    var ci = node.children[i];
                    if ((ci.name == off === 0 ? 'mjhand' : 'mjhand_replay') && ci.tag == king) {
                        ci.removeFromParent(true);
                        let nc = getNewCard(node, "up", "tou", king, off);
                        moveNode.push(nc);
                        break;
                    }
                }
            } else {
                let nc = getNewCard(node, "up", 'tou', king, off)
                moveNode.push(nc)
            }
        }
        if (off === 0 || MjClient.rePlayVideo != -1) {
            for (let _i = 0; _i < addCards.length; _i++) {
                const ac = addCards[_i];
                getNewCard(node, "stand", 'mjhand', ac, 0)
            }
        }
    }
    this.CardLayoutRestore(node, off);
}
//显示玩家头像的偷ui动画
PlayerGamePanel_Red20.prototype.showUserTouAction = function (node, off, sD) {
    var pl = getUIPlayer(off);
    node.zIndex = 99;
    if (sD && pl) {
        if (sD.uid == pl.info.uid) {
            node.visible = true;
            node.runAction(cc.sequence(cc.delayTime(2), cc.callFunc(() => {
                node.visible = false;
            })));
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
    cc.log("-----showMJOutBig------" + playerUi.getName(), JSON.stringify(card));
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
        outBig.runAction(cc.spawn(cc.moveTo(ActionTime.MoveCenter, endPos.x, endPos.y), cc.scaleTo(ActionTime.MoveCenter, 1)));
    }
}
//游戏中偷拍
PlayerGamePanel_Red20.prototype.KingCard = function (playerUi, card, off) {
    this.setUserTableCard(playerUi, off);
    this.DealAndMoveCard(playerUi, { Kings: card.card, uid: card.uid }, off);
    let cp = getUIPlayer(off);
    if (cp && cp.info.uid == card.uid) {
        getNewCard(playerUi, "up", 'tou', card.card, off);
        this.CardLayoutRestore(playerUi, off);
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
        // setTimeout(() => {
        //     try {
        //         if (!cc.isValid(this.node)) return;

        //         // cc.log('游戏消息++++掉', new Date().format('hh:mm:ss:S'))
        //         let wpos = node.convertToWorldSpaceAR(cc.v2(0, 0));
        //         let npos = this.node.convertToNodeSpaceAR(wpos);
        //         let moveLast = cc.moveTo(ActionTime.Fall, npos.x, npos.y);
        //         let tableNode = this.TableLastOutCard1;
        //         let seq = cc.sequence(cc.spawn(moveLast, cc.scaleTo(ActionTime.Fall, node.scale)), cc.callFunc(() => {
        //             tableNode.node.active = false;
        //             node.opacity = 255;
        //             // cc.log('游戏消息++++掉完', new Date().format('hh:mm:ss:S'))
        //         }));
        //         tableNode.node.runAction(seq);
        //         this.TableLastOutCard.node.active = false;
        //     } catch (error) {
        //         cc.error('添加桌子上的牌', error)
        //     }
        // }, 0.05 * 1000);
    }
}
//处理出牌,放一张牌，打牌动作
PlayerGamePanel_Red20.prototype.DealMJPut = function (node, msg, off, outNum) {
    let p0 = getUIPlayer(off);
    if (!p0 || msg.uid != p0.info.uid) return;
    cc.log('----------DealMJPut---------------', off, msg.card)    //断线重连 起手胡 不消失
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var uids = tData.uids;
    var noNeedOutBig = false;

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
        var maxNum = 11;
        if (isCanChangePlayerNum()) {
            if (MjClient.MaxPlayerNum == 2)
                maxNum = 20;
            else if (MjClient.MaxPlayerNum == 3 && off != 0)
                maxNum = 13;
        }
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

        var tingIndex = pl.tingIndex;//沭阳麻将需要


        if (cc.isUndefined(tingIndex) || !pl.isTing) {
            tingIndex = -1;//为了不报错;
        }
        var endPoint = cc.p(0, 0);
        var Midpoint = cc.p(0, 0);
        var ws = cc.director.getWinSize();
        var lineNum = 1; // 记录当前出牌显示的行数，默认第一行
        if (putnum > maxNum * 2 - 1 && out2) {
            out.x = out2.x;
            out.y = out2.y;
            putnum -= maxNum * 2;
            tingIndex -= maxNum * 2;
            lineNum = 3;
        }
        else if (putnum > maxNum - 1) {
            out.x = out1.x;
            out.y = out1.y;
            putnum -= maxNum;
            tingIndex -= maxNum;
            lineNum = 2;
        }


        //是否需要变宽
        var addWide = 0;
        if (tingIndex <= putnum && tingIndex >= 0) {
            if (off == 0 || off == 2) {
                addWide = oSize.width * oSc * 0.91;
            }
            else if (off == 1 || off == 3) {
                addWide = oSize.height * oSc * 0.7;
            }
        }

        var arg = 1.0

        if (off == 0) {
            endPoint.y = out.y;
            endPoint.x = out.x + oSize.width * oSc * arg * putnum * 0.91 + addWide;

            if (isIPad()) {
                var ax = ws.height / 1024;
                var ay = ws.height / 768;
                endPoint.x = endPoint.x + 20 * ax;
                out.zIndex = 100 - putnum;
                endPoint.y = lineNum > 1 ? endPoint.y - 8 * ay : endPoint.y;
            }

            Midpoint.x = ws.width / 2;
            Midpoint.y = ws.height * 0.3;
        }
        else if (off == 1) {
            cc.log("DealMJPut remove card  = " + msg.card);
            endPoint.y = out.y + oSize.height * oSc * arg * putnum * 0.7 + addWide;
            endPoint.x = out.x;

            if (isIPad()) {
                var ay = ws.height / 768;
                endPoint.y = endPoint.y + 20 * ay;
            }

            Midpoint.x = ws.width * 0.78;
            Midpoint.y = ws.height * 0.57;
            out.zIndex = 100 - putnum;
        }
        else if (off == 2) {

            endPoint.y = out.y;
            endPoint.x = out.x - oSize.width * oSc * arg * putnum * 0.91 - addWide;

            if (isIPad()) {
                var ax = ws.height / 1024;
                var ay = ws.height / 768;
                endPoint.x = endPoint.x - 20 * ax;
                out.zIndex = 100 - putnum - lineNum;
                endPoint.y = lineNum > 1 ? endPoint.y + 5 * ay : endPoint.y;
            }

            Midpoint.x = ws.width / 2;
            Midpoint.y = ws.height / 4 * 3;
        }
        else if (off == 3) {

            endPoint.y = out.y - oSize.height * oSc * arg * putnum * 0.7 - addWide;
            endPoint.x = out.x;

            if (isIPad()) {
                var ay = ws.height / 768;
                endPoint.y = MjClient.MaxPlayerNum === 3 ? endPoint.y + 120 * ay : endPoint.y - 25 * ay;
            }

            Midpoint.x = ws.width * (1 - 0.78);
            Midpoint.y = ws.height * 0.57;
            out.zIndex = putnum;
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
        else //打牌
        {
            clearCurrentPutTag();
            addCurrentPutTag(out, off);
        }

        var zoder = out.zIndex;
        out.visible = false;
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

        out.name = "newout";

        var outAction = null;
        if (off != 0 && COMMON_UI.isPutScale && !noNeedOutBig) {
            outAction = out_self.clone();
            setCardSprite(outAction, msg.card, 0);
        }
        else {
            outAction = out.clone();
        }

        outAction.name = "outAction";
        outAction.visible = true;
        node.addChild(outAction);

        if (COMMON_UI.isPutScale && off != 0 && !noNeedOutBig) {
            outAction.zIndex = 200;
            outAction.scale = 2 * oSc;
            outAction.setPosition(Midpoint);
            clearCurrentPutTag();
        }
        else {
            outAction.scale = oSc;
            outAction.zIndex = zoder;
            outAction.setPosition(endPoint);
            setCardSprite(outAction, msg.card, off);
        }
        addCurrentPutTag(outAction, off);

        var putTime = Date.now();
        var RemovePutCardScale = function (onlySelf) {
            if (!cc.sys.isObjectValid(outAction)) {
                return;
            }

            if (!onlySelf) {
                var _delayTime = 0.8;
                // if(off == 0) _delayTime = 0.4;

                var delayNum = _delayTime - (Date.now() - putTime) / 1000;
                if (delayNum < 0) {
                    delayNum = 0;
                }

                cc.log("---------delayNumdelayNumdelayNum------- " + delayNum);
                outAction.runAction(cc.sequence(
                    cc.delayTime(delayNum),
                    cc.callFunc(function () {
                        if (cc.sys.isObjectValid(out)) {
                            out.visible = true;
                            out.runAction(cc.sequence(
                                cc.spawn(cc.moveTo(0.1, endPoint), cc.scaleTo(0.1, oSc)),
                                cc.callFunc(function () {
                                    addCurrentPutTag(out, off);
                                    out.setPosition(endPoint);
                                    out.setScale(oSc);
                                    out.zIndex = zoder;
                                })
                            ));
                        }
                        //CommonPool.putInPool(outAction);
                        //outAction.removeFromParent();
                    }),
                    cc.removeSelf()
                ));
            }
            else {
                clearCurrentPutTag();
                //CommonPool.putInPool(outAction);
                outAction.removeFromParent();
            }
        }

        function RemovePutCard(onlySelf) {
            if (COMMON_UI.isPutScale && off != 0 && !noNeedOutBig) {
                return RemovePutCardScale(onlySelf);
            }
            if (cc.sys.isObjectValid(outAction)) {
                //CommonPool.putInPool(outAction);
                outAction.removeFromParent();
            }
            if (!onlySelf) {
                out.visible = true;
                out.zIndex = zoder;
            }
            else {
                clearCurrentPutTag();
            }
        }

        var outActionBind =
        {
            _event:
            {
                waitPut: function () {
                    RemovePutCard(false)
                },
                MJChi: function () {
                    RemovePutCard(true)
                },
                MJPeng: function () {
                    RemovePutCard(true)
                },
                MJGang: function () {
                    RemovePutCard(true)

                },
                roundEnd: function () {
                    var num = MjClient.CheckPlayerCount(function (p) {
                        if (p.winone == 0) {
                            return true;
                        }
                        return false;
                    });
                    if (num != MjClient.MaxPlayerNum) // 荒庄不移除打出去的牌
                        RemovePutCard(true)
                },
            }
        }

        BindUiAndLogic(outAction, outActionBind);

        var pl = getUIPlayer(0);
        if (off == 0 && !pl.isTing && MjClient.rePlayVideo == -1 && COMMON_UI.isChaPai && !pl.trust) {
            //正常游戏时,在putOutCard函数里面，已经提前处理了，此处不用再处理，by sking 2018.9.25
        }
        else {
            if (!(outNum >= 0)) {
                if (cc.sys.isObjectValid(MjClient.playui)) MjClient.playui.CardLayoutRestore(node, off);
            }
        }

    }
}