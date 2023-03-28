var actionZindex = 1000;
//向服务器发送 过消息
MjClient.MJPass2NetForLianYunGang = function () {
    // console.log(">>>>>>>>>普通  过 <<<<<<<<");
    cc.log("====================send======pass=====");
    var sData = MjClient.data.sData;
    var tData = sData.tData;

    if (IsTurnToMe() && tData.tState == TableState.waitPut) {
        var eat = MjClient.playui.jsBind.eat;
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
        if (MjClient.playui.jsBind.eat.hu._node.visible) {
            MjClient.showMsg("确认不胡吗?", MJPassConfirmToServer, function () { }, "1");
        }
        else {
            MJPassConfirmToServer();
        }
    }
}
var PlayLayer_Red20 = cc.Layer.extend({
    jsBind: {
        _event: {
            mjhand: function () {

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
            endRoom: function (msg) {
                mylog(JSON.stringify(msg));
                if (msg.showEnd) this.addChild(new GameOverLayer(), 500);
                else
                    MjClient.Scene.addChild(new StopRoomView());
            },
            MJPut: function () {


            },
            waitPut: function () {

            },
            roundEnd: function () {

            },
            moveHead: function () {
                postEvent("returnPlayerLayer");
                tableStartHeadMoveAction(this);
                initFlower_LYG();
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
            }
        },
        background: {
            _layout: [
                [1, 0.9],
                [0.5, 0.5],
                [0, 0], true
            ],
        },
        Desk: {
            _visible: true,
            _layout: [
                [1, 1],
                [0.5, 0.5],
                [0, 0], true
            ],
        },
        Mask: {
            _visible: false
        },
        CardManager: {
            _visible: false,
            _layout: [
                [1, 1],
                [0.5, 0.5],
                [0, 0], true
            ],
        },
        InTurnAction: {
            _visible: false,
        },
        Controller: {
            _visible: false,

            _layout: [
                [1, 1],
                [0.5, 0.5],
                [0, 0], true
            ],
        },
        PlayerManager:
        {
            _visible: false,
            _layout: [
                [0.16, 0.16],
                [0.01, 0.935],
                [0, 0]
            ]
        },
        buttonRule: {
            _layout: [
                [0.16, 0.16],
                [0.5, 0.62],
                [0, 1.0]
            ]
        },
        gameReadyState: {
            _visible:false,
            _layout: [
                [0.12, 0.12],
                [0.5, 0.38],
                [0, 1.0]
            ],
        },
        TimeOut: {
            _visible:false,
            _layout: [
                [0.5, 0.5],
                [0.5, 1],
                [0, 0]
            ],
        },
        TuoGuanMask: {
            _visible:false,
            _layout: [
                [1, 1],
                [0.5, 0.5],
                [0, 0], true
            ],
        },
        btnCancel: {
            _visible:false,
            _layout: [
                [1, 1],
                [0.5, 0.5],
                [0, 0], true
            ],
        },
        tip: {
            _visible:false,
            _layout: [
                [1, 1],
                [0.5, 0.5],
                [0, 0], true
            ],
        },
        ReplayControl: {
            _visible:false,
            _layout: [
                [1, 1],
                [0.5, 0.5],
                [0, 0], true
            ],
        }
    },
    _btnPutCard: null,
    _downNode: null,
    _rightNode: null,
    _topNode: null,
    _leftNode: null,
    ctor: function () {
        this._super();
        this.srcMaxPlayerNum = MjClient.MaxPlayerNum;
        MjClient.MaxPlayerNum = parseInt(MjClient.data.sData.tData.maxPlayer);
        cc.log("MjClient.MaxPlayerNum LYG = " + MjClient.MaxPlayerNum);
        playMusic("bgFight");

        var playui = ccs.load('Red20Scene.json').node;
        this._desk = new Desk(playui.getChildByName("Desk"), this);
        this._cardManager = new CardManager(playui.getChildByName("CardManager"), this);
        this._controller = new Controller(playui.getChildByName("Controller"), this);
        this._playerManager = new PlayerManager(playui.getChildByName("PlayerManager"), this);
        MjClient.playui = this;
        BindUiAndLogic(playui, this.jsBind);
        this.addChild(playui);
        MjClient.lastMJTick = Date.now();
        this.runAction(cc.repeatForever(cc.sequence(cc.callFunc(function() {
            if (MjClient.game_on_show) MjClient.tickGame(0);
        }), cc.delayTime(7))));
    },
    onExit: function () {
        this._super();
        MjClient.MaxPlayerNum = this.srcMaxPlayerNum;
    },
});

PlayLayer_Red20.prototype.CardLayoutRestore = function (node, off) {
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

    var uiOrder = [uigang1, uigang0, uipeng, uichi, uistand];
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
    var slotwith = upSize.width * upS * 0.2;//0.05;
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

    // 胡牌箭头
    COMMON_UI.willHuShowArrow();
};

// 判断吃碰杠胡的状态
PlayLayer_Red20.prototype.EatVisibleCheck = function () {
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

    if (
        pl.mjState == TableState.waitEat ||
        pl.mjState == TableState.waitPut &&
        tData.uids[tData.curPlayer] == SelfUid()) {

    }
    else {
        return;
    }

    //自摸
    if (tData.tState == TableState.waitPut && pl.mjState == TableState.waitPut) {
        if (IsTurnToMe()) {
            //检测补花
            var flowerCard = -1;
            if (tData.areaSelectMode && tData.areaSelectMode.withFlowerType == WithFlowerType.commonFlower) {
                flowerCard = RequestFlower8();
            }
            else if (tData.areaSelectMode && tData.areaSelectMode.withFlowerType == WithFlowerType.zfbFlower) {
                flowerCard = RequestFlower20();
            }
            cc.log();

            if (flowerCard > 0) {
                var cduis = MjClient.playui.jsBind.down._node.children;
                var cardIndex = null;
                for (var i = cduis.length - 1; i >= 0; i--) {
                    if (cduis[i].name == "mjhand" && cduis[i].tag == flowerCard) {
                        cardIndex = i;
                        break;
                    }
                }
                if (cardIndex) {
                    var callback = function () {
                        PutOutCard(cduis[cardIndex], flowerCard);
                    };
                    cduis[cardIndex].runAction(cc.sequence(cc.delayTime(0.5), cc.callFunc(callback)));
                    return;
                }
            }
            //检测补花完毕
            if (pl.isNew && pl.eatFlag & 8) {
                vnode.push(eat.hu._node);
            }
            // else
            // {
            //     // //如果不能胡,并且是最后四张牌
            //     // var sData = MjClient.data.sData;
            //     // var tData = sData.tData;
            //     // var cardsLength = getAllCardsTotal();
            //     // var isLastFourCard = tData.cardNext > cardsLength - 4 && tData.cardNext <= cardsLength;
            //     // console.log("=====doomsky say:isLastFourCard======", tData.cardNext, isLastFourCard);
            //     // if (isLastFourCard)
            //     // {
            //     //     MjClient.gamenet.request("pkroom.handler.tableMsg", {
            //     //         cmd: "MJPut",
            //     //         card: -1
            //     //     });
            //     // }
            // }
            //听
            cc.log("￥￥￥￥听牌监测");
            MjClient.canTingCards = {};
            if (tData.areaSelectMode.tingType != TingCardType.noTing && !pl.isTing) {


                for (var i = 0; i < pl.mjhand.length; i++) {
                    var cardsAfterPut = pl.mjhand.slice(0);
                    cardsAfterPut.splice(i, 1); //依次去掉某张牌看能不能听
                    // cc.log(cardsAfterPut);
                    if (MjClient.majiang.canTing(cardsAfterPut)) {
                        // cc.log("去掉可以听"+pl.mjhand[i]);
                        MjClient.canTingCards[pl.mjhand[i]] = 1;
                        if (vnode.indexOf(eat.ting._node) < 0) {
                            vnode.push(eat.ting._node);
                        }
                    }
                }
            }

            //var rtn = leftCard > 4 ? MjClient.majiang.canGang1(pl.mjpeng, pl.mjhand, pl.mjpeng4) : [];
            //碰后不能杠
            var rtn = MjClient.majiang.canGang1(pl.mjpeng, pl.mjhand, pl.isTing);
            if (rtn.length > 0 && pl.isNew)//听牌也可以杠的，my
            {
                MjClient.gangCards = rtn;
                vnode.push(eat.gang0._node);
            }


            if (vnode.length > 0) {
                vnode.push(eat.guo._node);
                eat.ting._node.visible = false;
                eat.noTing._node.visible = false;
                isCheckedTing = false;
            }
        }
    }
    //别人点
    else if (tData.tState == TableState.waitEat) {
        // cc.log("diao pao hu-=================================================");
        if (!IsTurnToMe()) {
            if (pl.eatFlag & 8) {
                vnode.push(eat.hu._node);
            }
            if (pl.eatFlag & 4) {
                vnode.push(eat.gang0._node);
                MjClient.gangCards = [tData.lastPutCard];
                eat.gang0._node.visible = true;
                setCardSprite(eat.gang0.card1._node, MjClient.gangCards[0], 0);
            }
            if (pl.eatFlag & 2) {
                vnode.push(eat.peng._node);
            }
            if (pl.eatFlag & 1) {
                var eatpos = mj.canChi(pl.mjhand, tData.lastPutCard);
                MjClient.eatpos = eatpos;
                if (eatpos.length > 0) {
                    vnode.push(eat.chi0._node);
                }
            }
            //如果，有杠，碰，吃。 这出现过的UI. 否则玩家状态为等待
            if (vnode.length > 0) {
                vnode.push(eat.guo._node);
                eat.ting._node.visible = false;
                eat.noTing._node.visible = false;
                isCheckedTing = false;
            }
            else {
                getUIPlayer(0).mjState = TableState.waitCard;
            }
        }
    }

    //吃碰杠胡过处理
    if (vnode.length > 0) {
        var btnImgs =
        {
            "peng": ["playing/gameTable/youxizhong-2_57.png", "playing/gameTable/youxizhong-2_07.png"],
            "gang0": ["playing/gameTable/youxizhong-2_55.png", "playing/gameTable/youxizhong-2_05.png"],
            "chi0": ["playing/gameTable/youxizhong-2_59.png", "playing/gameTable/youxizhong-2_09.png"],
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
            if (btnName == "peng" || btnName == "chi0" || btnName == "gang0") {
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

    /*吃碰杠按钮，适配iOS*/
    COMMON_UI.vnodeAdaptForiOS(vnode);

    if (eat.hu._node.visible) {
        MjClient.playui._btnPutCard.visible = false;
    }
};

var PlayerPositon = {
    Bottom: 0,
    Right: 1,
    Top: 2,
    Left: 3,
}

function PlayerManager(node, ctr) {
    this.node = node;
    this.ctr = ctr;
    //玩家组件

    this.bottomPlayer = null;

    //玩家组件

    this.topPlayer = null;

    //玩家组件

    this.leftPlayer = null;

    //玩家组件

    this.rightPlayer = null;

    //玩家组件
    this.defaultAva = null;

    this.controllerAtlas = null

    //玩家数组
    this.players = []
    this.IsReplayMode = false;

    onInit = function (maxPlayer, controllerAtlas, isReplayMode) {
        this.node.removeAllChildren();
        this.IsReplayMode = isReplayMode;
        this.controllerAtlas = controllerAtlas;
        //变量声明
        let prefabs;
        //实例化玩家
        switch (maxPlayer) {
            case 2:
                prefabs = [this.bottomPlayer, this.topPlayer]
                break;
            case 3:
                prefabs = [this.bottomPlayer, this.rightPlayer, this.leftPlayer]
                break;

            default:
                prefabs = [this.bottomPlayer, this.rightPlayer, this.topPlayer, this.leftPlayer]
                break;
        }

        //实例化组件
        prefabs.forEach(prefab => {
            this.node.addChild(cc.instantiate(prefab))
        })

        //初始化玩家
        console.log('+++++++++++++++', maxPlayer)
        this.players = this.node.getComponentsInChildren(TablePlayer)
        this.players.forEach((player, index) => {
            player.onInit(index)
            player.node.active = false;
        })
    }

    //重置牌桌信息
    reset = function () {
        //重置庄标记
        this.players.forEach(player => {
            player.reset();
        })
    }

    clear = function () {
        this.players.forEach(player => {
            player.node.stopAllActions();
            player.node.active = false;
        })

    }

    getPlayerAvatar = function (viewPos) {
        return this.players[viewPos].getPlayerAvatar();
    }

    //房间状态改变 取消匿名
    onRoomStatusChanged = function () {
        this.players.forEach(player => {
            player.loadHead();
        })
    }

    //玩家进入事件
    onEventUserEnter = function (player, viewPos, gameBase) {
        if (player.ChairID === null) return;
        console.log('玩家进入事件', player.NickName, viewPos)
        if (this.players[viewPos]) this.players[viewPos].onEventUserEnter(player, this.defaultAva, gameBase)
    }

    //玩家积分改变事件
    onEventUserScoreChanged = function (player, viewPos) {
        if (this.players[viewPos]) this.players[viewPos].Score = player.Score;
    }

    //修改玩家分数
    onEventScoreChanged = function (viewPos, score) {
        if (this.players[viewPos]) this.players[viewPos].Score = score;
    }

    //玩家状态改变事件
    onEventUserStatusChanged = function (status, viewPos) {
        if (this.players[viewPos]) this.players[viewPos].Status = status;
    }

    //玩家离开事件
    onEventUserDeskUp = function (player, viewPos) {
        if (player.ChairID === null) return;
        if (this.players[viewPos]) this.players[viewPos].onEventUserLeave()
    }

    //头像动画
    showPlayerHeadAm = function (viewPos, time = 0) {
        this.players.forEach((user, index) => {
            if (index === viewPos) {
                user.onInTurn(true, time);
            } else {
                user.onInTurn(false);
            }
        })
    }

    /**
     * 控制动画暂停
     * @param stop 是否暂停
     */
    controllerAction = function (stop) {
        this.players.forEach((user, index) => {
            user.controllerAction(stop);
        })
    }

    //操作
    performAction = function (viewPos, type) {
        switch (type) {
            case UserAction.Chi:
                this.players[viewPos].Action = this.controllerAtlas.getSpriteFrame("tip_chi");
                break;
            case UserAction.Gang: {
                this.players[viewPos].Action = this.controllerAtlas.getSpriteFrame('tip_gang');
                break;
            }
            case UserAction.Hu: {
                this.players[viewPos].Action = this.controllerAtlas.getSpriteFrame('tip_hu');
                break;
            }
            case UserAction.Peng: {
                this.players[viewPos].Action = this.controllerAtlas.getSpriteFrame('tip_peng');
                break;
            }
            case UserAction.Ting: {
                // this.players[viewPos].Action = this.controllerAtlas.getSpriteFrame('tip_bting');
                this.players[viewPos].Ting = this.controllerAtlas.getSpriteFrame('tip_bting');
                break;
            }
            case UserAction.Tou: {
                this.players[viewPos].Action = this.controllerAtlas.getSpriteFrame('tip_tou');
                break;
            }
        }
    }

    resumeTing = function (viewPos) {
        this.players[viewPos].Ting = this.controllerAtlas.getSpriteFrame('tip_bting');
    }

    getPlayerTing = function (viewPos) {
        return this.players[viewPos].getTing();
    }

    resetTing = function () {
        this.players.forEach(player => {
            player.resetTing();
        })
    }

    resetTuoGuan = function () {
        this.players.forEach(player => {
            player.tuoGuan = false;
        })
    }

    //设置庄家
    resumeBanker = function (viewPos) {
        this.players[viewPos].Banker = true;
    }

    setTuoGuan = function (viewPos, val) {
        this.players[viewPos].tuoGuan = val;
    }
}

function Controller(node, ctr) {
    this.node = node;
    this.ctr = ctr;
    this.Operation = null;
    this.ActionChu = null;

    this.controllerAtlas = null

    this.cardAtlas = null

    this.CurActions = [];
    this.IsReplayMode = false;
    this.gameBase


    this.isBaoTing = false;

    this.EventActionCard = (type, data) => { };

    onInit = function (cardAtlas, controllerAtlas, gameBase) {
        this.gameBase = gameBase;
        this.IsReplayMode = this.gameBase.isReplayMode;
        this.cardAtlas = cardAtlas;
        this.controllerAtlas = controllerAtlas;
        this.hideOperationPanel();
    }

    //获取资源
    getSpriteFrameByCard = function (card) {
        if (card === -1) {
            return this.cardAtlas.getSpriteFrame('back')
        }
        let cardNum = card % 16;
        let cardColor = Math.floor(card / 16);
        return this.cardAtlas.getSpriteFrame('${cardColor}-${cardNum}')
    }

    hideOperationPanel = function () {
        this.Operation.children.forEach(child => {
            child.active = false;
            child.getComponent(cc.Button).interactable = true;
            child.getChildByName('Background').active = true;
            let desc = child.getChildByName('Desc');
            if (desc) desc.active = false;
        })
        this.ActionChu.active = false;
        this.CurActions = [];
    }

    //点击过
    onClickPass = function () {
        if (this.EventActionCard) this.EventActionCard('guo');
        // GameNetwork.sendData(Message.MainCmd.Game, ClientCmd.UserPass);
        // this.hideOperationPanel();
    }

    canChuCard = function () {
        if (this.IsReplayMode) return;
        this.hideOperationPanel();
        this.ActionChu.active = true;
    }

    canOperate = function (data) {
        if (this.IsReplayMode) return;
        //
        data.sort((a, b) => { return b - a });
        if (data.toString() === this.CurActions.toString()) return;
        this.hideOperationPanel();
        this.CurActions = data;

        console.log("LLL++ActionList+", GameData.getActionList());
        //吃，碰，杠数据
        let actionList = GameData.getActionList();

        let actions = this.Operation.children.filter(child => {
            return child.name === 'Action'
        });

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

        let isShowPass = true;
        let isHu = false;
        cc.log('按钮+actions+++++', actions.length)
        actions[0].active = true;
        let index = 0;
        data.forEach(action => {
            if (action === UserAction.Tou) {
                //有偷就不显示过
                isShowPass = false;
                this.setAction(actions[index], 'tou')
                index += 1;
            }
            if (action === UserAction.Chi) {
                let list = getActionCards('chi');
                if (list.length === 0) {
                    this.setAction(actions[index], 'chi')
                } else {
                    let Cards = [];
                    list.forEach(value => {
                        Cards.push(value.card);
                    })
                    this.setAction(actions[index], 'chi', Cards);
                }
                index += 1;
            }
            if (action === UserAction.Gang) {
                let list = getActionCards('gang');
                if (list.length === 0) {
                    this.setAction(actions[index], 'gang')
                } else {
                    let Cards = [];
                    list.forEach(value => {
                        Cards.push(value.card);
                    })
                    this.setAction(actions[index], 'gang', Cards);
                }
                index += 1;
            }
            if (action === UserAction.Peng) {
                let list = getActionCards('peng');
                if (list.length === 0) {
                    this.setAction(actions[index], 'peng')
                } else {
                    let Cards = [];
                    list.forEach(value => {
                        Cards.push(value.card);
                    })
                    this.setAction(actions[index], 'peng', Cards);
                }
                index += 1;
            }
            if (action === UserAction.Ting) {
                this.setAction(actions[index], 'ting')
                index += 1;
            }
            if (action === UserAction.Hu) {
                cc.log('胡+++', index)
                isHu = true;
                this.setAction(actions[index], 'hu')
                index += 1;
            }

        })

        this.Operation.getChildByName('BtnPass').active = isShowPass;
        //报听后能胡不显示过按钮time:02/13
        if (isHu && this.isBaoTing) {
            this.Operation.getChildByName('BtnPass').active = false;
        }
    }

    //动作设置
    setAction = function (node, action, cards) {
        if (!node) return;
        //设置操作
        node.active = true;
        let attrs = { action: action };
        node.attr(attrs);

        let bg = node.getChildByName('Background').getComponent(cc.Sprite);
        bg.spriteFrame = this.controllerAtlas.getSpriteFrame('btn_${action}');
        let isShowDesc = false;
        if (cards && cards.length === 1) {
            node.getChildByName('Card').active = false//cardShow;暂时???
            node.getComponentInChildren(Card).Data = cards[0];
            node.getComponentInChildren(Card).showFace = this.getSpriteFrameByCard(cards[0])
        } else if (cards && cards.length > 1) {
            isShowDesc = true;
            node.getChildByName('Card').active = false;
            node.getComponentInChildren(Card).Data = -1;

            let desc = node.getChildByName('Desc');
            let CardNode = desc.getChildByName("Card");
            CardNode.children.forEach(child => child.active = false);
            cards.forEach((card, index) => {
                this.setCardAction(CardNode.children[index], action, card);
            })
            //取消按钮
            let cancel = desc.getChildByName('Cancel').getComponent(cc.Button);
            if (cancel) {
                cancel.clickEvents = []
                cancel.interactable = true;

                let clickEventHandler = new cc.Component.EventHandler();
                clickEventHandler.target = this.node;
                clickEventHandler.component = "Controller";
                clickEventHandler.handler = "onClickCancel";
                clickEventHandler.customEventData = action

                cancel.clickEvents.push(clickEventHandler);
            }
            //最后一张牌
            let lastCard = desc.getChildByName('LastCard');
            if (GameData.lastTableOutCard) {
                lastCard.active = true;
                lastCard.getComponent(Card).Data = GameData.lastTableOutCard;
                lastCard.getComponent(Card).showFace = this.getSpriteFrameByCard(GameData.lastTableOutCard);
            } else {
                lastCard.active = false;
            }
        }
        else {
            node.getChildByName('Card').active = false;
            node.getComponentInChildren(Card).Data = -1;
        }

        let button = node.getComponent(cc.Button)
        if (button) {
            button.clickEvents = []
            button.interactable = true;

            let clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = this.node;
            clickEventHandler.component = "Controller";
            //多张牌
            if (isShowDesc) {
                clickEventHandler.handler = "onClickShowDesc";
            } else {
                clickEventHandler.handler = "onClickAction";
            }
            clickEventHandler.customEventData = action

            button.clickEvents.push(clickEventHandler);
        }
    }

    //
    setCardAction = function (node, action, card) {
        node.active = true;
        if (card) {
            node.getChildByName('Card').active = true
            node.getComponentInChildren(Card).Data = card;
            node.getComponentInChildren(Card).showFace = this.getSpriteFrameByCard(card)
        }
        let button = node.getComponent(cc.Button)
        if (button) {
            button.clickEvents = []
            button.interactable = true;

            let clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = this.node;
            clickEventHandler.component = "Controller";
            clickEventHandler.handler = "onClickAction";
            clickEventHandler.customEventData = action

            button.clickEvents.push(clickEventHandler);
        }
    }

    //点击操作
    onClickAction = function (event, action) {
        console.log("LLL++ActionNode", event.target)
        let target = event.target;
        let card = target.getComponentInChildren(Card);
        console.log('LLL++ActionCard', card.Data);
        if (this.EventActionCard) this.EventActionCard(action, { Card: card.Data });

        // this.hideOperationPanel();
    }

    updateDesc = function () {
        this.Operation.children.forEach(child => {
            let desc = child.getChildByName('Desc');
            if (desc) desc.active = false;
        })
    }

    //多个牌操作
    onClickShowDesc = function (event, action) {
        if (this.gameBase.TuoGuanMaskNode.activeInHierarchy) return;
        this.updateDesc();
        let target = event.target;
        let desc = target.getChildByName('Desc');
        if (desc) desc.active = true;
        target.getComponent(cc.Button).interactable = false;
        target.getChildByName('Background').active = false;
    }
    //点击取消
    onClickCancel = function (event) {
        let target = event.target;
        let desc = target.parent;
        desc.parent.getComponent(cc.Button).interactable = true;
        desc.parent.getChildByName('Background').active = true;
        desc.active = false;
    }
}

function Card(node) {
    this.node = node;
    this.cardNum = -1;
    this.cardColor = -1; //0:方块，1：梅花，2：红桃，3：黑桃，4:王
    this.card = -1;
    this.isRemove = false;

    showFace = function (sp) {
        if (sp) this.node.setSpriteFrame(sp);
    }
    //获取牌面
    getData = function () {
        return this.card
    }
    //设置牌面
    setData = function (card) {
        this.isRemove = false;
        this.card = card;
        this.cardNum = card % 16;
        this.cardColor = Math.floor(card / 16);
    }
    Color = function () {
        return this.cardColor;
    }

    Num = function () {
        return this.cardNum;
    }

    faceName = function () {
        return this.cardColor + '' + this.cardNum;
    }
}

function CardManager(node, ctr) {
    this.node = node;
    this.ctr = ctr;
    this.bounds = node.getChildByName("bounds");
    this.backCard = node.getChildByName("backCard");
    this.temporaryCard = node.getChildByName("temporaryCard");
    const n = node.getChildByName("LastOutCard")
    this.TableLastOutCard = new Card(n);
    this.Card = new Card(n.clone());
    let c = n.clone();
    c.setScale(0.6);
    this.OtherCard = new Card(c);
    this.BottomHandCard = ccs.load('Red20_BottomHandCard.json').node;
    this.BRChiCard = ccs.load('Red20_BRChiCards.json').node;
    this.LTChiCard = ccs.load('Red20_LTChiCards.json').node;
    c = n.clone();
    c.setScale(0.6);
    // c.setSpriteFrame(new cc.SpriteFrame('Red20/Game/.Card_PList.Dir/' + "back.png", cc.rect(0, 0, 90, 122)));
    this.OtherHandCard = new Card(c);
    this.Mask = node.parent.getChildByName("Mask");
    this.redPoint = node.parent.getChildByName("redPoint");
    this.redPointBg = node.parent.getChildByName("userBg");

    this.BottomHandCards = node.getChildByName('BottomHandCards');
    this.BottomUserChiCards = node.getChildByName('BottomUserChiCards');
    this.BottomOutCards = node.getChildByName('BottomOutCards');

    this.LeftHandCards = node.getChildByName('LeftHandCards');
    this.LeftUserChiCards = node.getChildByName('LeftUserChiCards');
    this.LeftOutCards = node.getChildByName('LeftOutCards');

    this.RightHandCards = node.getChildByName('RightHandCards');
    this.RightUserChiCards = node.getChildByName('RightUserChiCards');
    this.RightOutCards = node.getChildByName('RightOutCards');

    this.TopHandCards = node.getChildByName('TopHandCards');
    this.TopOutCards = node.getChildByName('TopOutCards');
    this.TopUserChiCards = node.getChildByName('TopUserChiCards');

    this.lastOutCardTimer = null;

    //所有timerID
    this.totalTimerID = [];

    this.Rule = null;

    this.cardAtlas = null
    this.IsReplayMode = false;

    //是否允许出牌
    this.allowOutCard = false;
    this.isBaoTing = false;
    //玩家数组
    this.players = [];
    this.doubleTimeEclipse = 0;
    this.startLocation = null;

    //动画播完后改变
    this.selfHandCards = []

    //及时记录自己手牌数据
    this.bottomHandCards = []

    this.EventOutCard = (data) => { };
    this.maskTimer = null;
    this.startTouResultTimer = null;
    this.startTouResultCard = [];

    //初始化
    onReset = function (maxPlayer, rule, isReplayMode) {
        this.players = [];
        this.IsReplayMode = isReplayMode;
        this.Rule = rule;

        this.node.children.forEach(child => {
            if (child.childrenCount > 0)
                child.removeAllChildren();
        })

        //根据人数绑定数据
        let positions = [];
        switch (maxPlayer) {
            case 2:
                positions = [PlayerPositon.Bottom, PlayerPositon.Top]
                break;

            case 3:
                positions = [PlayerPositon.Bottom, PlayerPositon.Right, PlayerPositon.Left]
                break;

            default:
                positions = [PlayerPositon.Bottom, PlayerPositon.Right, PlayerPositon.Top, PlayerPositon.Left]
                break;
        }

        cc.log('++++++++加载position+++++', positions.length, maxPlayer)

        //实例化玩家
        positions.forEach(viewPos => {
            this.players.push(new PlayerCard(this, viewPos))
        })

        this.node.children.forEach((node, index) => {
            if (index < 9)
                node.visible = true
        })

        this.reset();
    }
    //重置
    reset = function () {
        //操作辅助变量
        if (dlgActionNode) dlgActionNode.destroy();
        dlgActionNode = null;
        lastSelectedNode = null;

        cc.log('动画数量', this.totalTimerID.length);
        this.totalTimerID.forEach(val => {
            if (val) clearTimeout(val);
        })

        this.redPoint.visible = false;
        this.redPointBg.visible = false;

        GameData.isActionByTableCard = false;
        GameData.updateActionCard();
        this.performWidget(true);

        this.bounds.visible = false;

        this.allowOutCard = false;
        this.isBaoTing = false;

        lastOutCardPos = null;
        this.selfHandCards = [];
        this.bottomHandCards = [];

        this.TableLastOutCard.node.stopAllActions();
        this.TableLastOutCard.node.scale = 1;
        this.TableLastOutCard.node.visible = false;
        GameData.lastTableOutCard = null;
        //播动画临时Card
        this.node.stopAllActions();
        this.temporaryCard.stopAllActions();
        this.temporaryCard.removeAllChildren(true);

        this.totalTimerID = [];

        this.players.forEach(player => {
            player.onReset();
        })
    }

    onTouchInit = function () {
        //触碰操作处理
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    offTouchInit = function () {
        if (!this.node.isValid) return;
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    isCanTouch = function () {
        let touch = true;
        this.BottomHandCards.children.forEach(node => {
            if (!touch) return;
            if (node.getOpacity() !== 255) {
                touch = false
                return;
            }
            node.children.forEach(child => {
                if (!touch) return;
                if (child.getOpacity() !== 255) {
                    touch = false
                    return;
                }
            })
        })
        if (this.players[0].reorderTimer !== null) touch = false;
        return touch;
    }

    onTouchStart = function (event) {
        if (!this.isCanTouch()) return;
        if (this.isBaoTing) return;
        // console.log("点击")
        //销毁对象
        if (dlgActionNode) {
            dlgActionNode.destroy();
            dlgActionNode = null;
        }
        //变量声明
        let location = event.getLocation();
        this.startLocation = location;
        let touchInfo = this.findTouchCard(location);
        let target = touchInfo.node;
        if (target !== null) {
            if (target.getOpacity() !== 255) return;

            AudioManager.playSound('effect/other/select_card');

            this.bounds.visible = true;
            lastSelectedNode = target;
            lastSelectedIndex = touchInfo.index;
            //复制一个节点
            dlgActionNode = cc.instantiate(target)
            this.node.addChild(dlgActionNode)
            //?
            dlgActionNode.getComponent(Card).Data = lastSelectedNode.getComponent(Card).Data;

            //坐标转换
            let wpos = target.convertToWorldSpaceAR(target.getPosition())
            let viewPos = dlgActionNode.convertToNodeSpaceAR(wpos)
            dlgActionNode.setPosition(viewPos)

            //置灰原节点
            target.color = cc.Color.GRAY;
        }
    }

    onTouchMove = function (event) {
        // 不可见过滤
        if (dlgActionNode === null) return
        //修改位置
        let delta = event.getDelta()
        dlgActionNode.x += delta.x
        dlgActionNode.y += delta.y
    }

    onTouchEnd = function (event) {
        this.bounds.visible = false;

        if (dlgActionNode === null) return;

        //清理card
        let nodeReset = () => {
            dlgActionNode.destroy();
            dlgActionNode = null;
            if (lastSelectedNode.parent.childrenCount === 1) {
                lastSelectedNode.parent.destroy();
            } else {
                lastSelectedNode.destroy();
            }
            lastSelectedNode.color = cc.Color.WHITE;
            lastSelectedNode = null;
            lastSelectedIndex = null;
        }
        //变量声明
        let location = event.getLocation();
        let wpos = this.bounds.convertToWorldSpaceAR(cc.v2(0, 0));
        let nowTime = Date.now();
        if (nowTime - this.doubleTimeEclipse < 300) { //小于300ms为双击
            console.log('LLL+++双击')
            let card = dlgActionNode.getComponent(Card);
            this.performOutCard(card.Data); //出牌
            dlgActionNode.destroy();
            dlgActionNode = null;
            lastSelectedNode.color = cc.Color.WHITE;
            lastSelectedNode.setOpacity(255);
            lastSelectedNode = null;
            this.doubleTimeEclipse = 0;
            return;
        }
        // console.log('LLL+++双击', nowTime - this.doubleTimeEclipse)
        this.doubleTimeEclipse = Date.now();
        if (location.y > wpos.y) {
            let card = dlgActionNode.getComponent(Card);
            this.performOutCard(card.Data); //出牌
            dlgActionNode.destroy();
            dlgActionNode = null;
            lastSelectedNode.color = cc.Color.WHITE;
            lastSelectedNode.setOpacity(255);
            lastSelectedNode = null;

        } else {
            let endInfo = this.findTouchEndNode(location)//actionNode.getBoundingBoxToWorld());
            if (endInfo === null || Math.abs(location.x - this.startLocation.x) < 20 && Math.abs(location.y - this.startLocation.y) < 20) {
                dlgActionNode.destroy();
                dlgActionNode = null;
                lastSelectedNode.color = cc.Color.WHITE;
                lastSelectedNode.setOpacity(255);
                lastSelectedNode = null;
                lastSelectedIndex = null;
            }
            else if (endInfo.isChange) { //交换
                if (lastSelectedIndex === endInfo.index) { //不变
                    lastSelectedNode.color = cc.Color.WHITE;
                    lastSelectedNode.setOpacity(255);
                    dlgActionNode.destroy();
                    dlgActionNode = null;
                    lastSelectedNode = null;
                    lastSelectedIndex = null;
                } else {
                    let node = cc.instantiate(lastSelectedNode);
                    node.getComponent(Card).Data = lastSelectedNode.getComponent(Card).Data;
                    //单个card的父节点layout
                    let cardLayout = cc.instantiate(this.BottomHandCard);
                    cardLayout.removeAllChildren();
                    cardLayout.addChild(node);
                    node.color = cc.Color.WHITE;
                    node.setOpacity(255);

                    //交换的layout
                    let changeNode = endInfo.node.children[endInfo.index];
                    //copy交换layout 
                    let node1 = cc.instantiate(changeNode);
                    changeNode.children.forEach((child, index) => {
                        node1.children[index].getComponent(Card).Data = child.getComponent(Card).Data;
                    })
                    node1.color = cc.Color.WHITE;
                    //插入新添加的 (先插入位置在前面的)
                    if (endInfo.index < lastSelectedIndex) {
                        endInfo.node.insertChild(node1, lastSelectedIndex)
                        endInfo.node.insertChild(cardLayout, endInfo.index)

                    } else {
                        endInfo.node.insertChild(cardLayout, endInfo.index)
                        endInfo.node.insertChild(node1, lastSelectedIndex)
                    }
                    //移除原来的
                    changeNode.destroy();
                    nodeReset();
                }
            } else {
                //最左侧或最右侧 或者向左挤挤，向右挤挤
                if (endInfo.isNewLayout) {
                    if (endInfo.index < lastSelectedIndex) {
                        let node = cc.instantiate(lastSelectedNode);
                        node.getComponent(Card).Data = lastSelectedNode.getComponent(Card).Data;
                        let cardLayout = cc.instantiate(this.BottomHandCard);
                        cardLayout.removeAllChildren();
                        cardLayout.addChild(node);
                        node.color = cc.Color.WHITE;
                        node.setOpacity(255);
                        endInfo.node.insertChild(cardLayout, endInfo.index);
                        nodeReset();
                    } else {

                        let node = cc.instantiate(lastSelectedNode);
                        node.getComponent(Card).Data = lastSelectedNode.getComponent(Card).Data;
                        let cardLayout = cc.instantiate(this.BottomHandCard);
                        cardLayout.removeAllChildren();
                        cardLayout.addChild(node);
                        node.color = cc.Color.WHITE;
                        node.setOpacity(255);
                        if (endInfo.index === this.node.getChildByName('BottomHandCards').childrenCount - 1) {
                            endInfo.node.insertChild(cardLayout, endInfo.index + 1);
                        } else {
                            endInfo.node.insertChild(cardLayout, endInfo.index);
                        }

                        nodeReset();
                    }
                }
                //插入成对或14
                else {
                    let node = cc.instantiate(lastSelectedNode);
                    node.getComponent(Card).Data = lastSelectedNode.getComponent(Card).Data;
                    node.color = cc.Color.WHITE;
                    node.setOpacity(255);
                    endInfo.node.insertChild(node, endInfo.index);
                    nodeReset();
                }
            }
        }

        this.updateRedPointCount();

    }

    //查找触碰的麻将
    findTouchCard = function (pos) {
        let data = { node: null, index: null }
        let card = this.node.getChildByName('BottomHandCards');
        card.children.forEach((child, index) => {
            if (data.node) return;
            if (child.getBoundingBoxToWorld().contains(pos) && child.visible) {
                let indexInfo = [];
                child.children.forEach((val, id) => {
                    if (val.getBoundingBoxToWorld().contains(pos)) {
                        indexInfo.push(id);
                    }
                })
                data.index = index;
                data.node = child.children[Math.max.apply(Math, indexInfo)];
            }
        })
        return data;
    }

    getCardData = function (node) {
        return node.getComponent(Card);
    }
    //结束时插入的位置
    findTouchEndNode = function (pos) {

        let cardNode = this.node.getChildByName('BottomHandCards');
        //不在手牌范围内
        //向右移动，放在最右侧
        if (pos.x > cardNode.getBoundingBoxToWorld().xMax) {
            return { node: cardNode, index: cardNode.childrenCount - 1, isChange: false, isNewLayout: true };
        }
        //向左移动，放在最左侧
        else if (pos.x < cardNode.getBoundingBoxToWorld().xMin) {
            return { node: cardNode, index: 0, isChange: false, isNewLayout: true };
        }
        //中间
        else {
            //endInfo:{node:移动的牌的父节点，index：插入位置，isChange：是否交换,isNewLayout:添加新的layout牌组}
            let indexInfo = [];
            cardNode.children.forEach((child, index) => {
                if (child.getBoundingBoxToWorld().contains(pos) && child.visible) {
                    indexInfo.push(index);
                }
            })
            if (indexInfo.length === 2) {
                //两张牌中间
                return { node: cardNode, index: Math.max.apply(Math, indexInfo), isChange: true };
            } else if (indexInfo.length === 1) {
                //一张layout
                let endParentNode = cardNode.children[indexInfo[0]];
                if (endParentNode.childrenCount === 1) {
                    let acCard = dlgActionNode.getComponent(Card);
                    let curCard = endParentNode.getComponentInChildren(Card);
                    if (acCard.Num === curCard.Num || (acCard.Num + curCard.Num) === 14) { //满足对子或14
                        return { node: endParentNode, index: 1, isChange: false }
                    } else {
                        //全部查找，自动配对
                        let endInfo = null;
                        cardNode.children.forEach((child, index) => {
                            if (endInfo) return;
                            if (child.childrenCount === 1 && child.visible) {
                                if (this.getCardData(child.children[0]).Num === acCard.Num || (this.getCardData(child.children[0]).Num + acCard.Num) === 14) {
                                    //排除自己跟自己组队
                                    if (index !== lastSelectedIndex)
                                        endInfo = { node: child, index: index, isChange: false };
                                }
                            }
                        })
                        if (endInfo) {
                            return endInfo;
                        } else {
                            //交换
                            return { node: cardNode, index: indexInfo[0], isChange: true };
                        }
                    }
                }
                //已经是对子/三张/4张/14
                else {
                    //对子
                    if (this.getCardData(endParentNode.children[0]).Num === this.getCardData(endParentNode.children[1]).Num) {
                        //可以组成碰杠
                        if (this.getCardData(endParentNode.children[0]).Num === this.getCardData(lastSelectedNode).Num) {
                            return { node: endParentNode, index: 0, isChange: false }
                        } else {
                            //向右移动 放在目标后面
                            if (indexInfo[0] > lastSelectedIndex) {
                                return { node: cardNode, index: indexInfo[0] + 1, isChange: false, isNewLayout: true };
                            }
                            //向左移动号，放在目标前面
                            else if (indexInfo[0] < lastSelectedIndex) {
                                return { node: cardNode, index: indexInfo[0], isChange: false, isNewLayout: true };
                            }
                            //位置不变的情况就是可以组成碰杠
                        }
                    }
                    //14
                    else {
                        //向右移动 放在目标后面
                        if (indexInfo[0] > lastSelectedIndex) {
                            return { node: cardNode, index: indexInfo[0] + 1, isChange: false, isNewLayout: true };
                        }
                        //向左移动号，放在目标前面
                        else if (indexInfo[0] < lastSelectedIndex) {
                            return { node: cardNode, index: (indexInfo[0] - 1) < 0 ? 0 : (indexInfo[0] - 1), isChange: false, isNewLayout: true };
                        }
                        //相等 位置不变，移到顶部
                        else {
                            return { node: endParentNode, index: 0, isChange: false }
                        }
                    }
                    //if对子 if 14  ifpeng
                    // return { node: cardNode, index: indexInfo[0], isChange: true };
                }
            } else {
                let cardNodeRect = cardNode.getBoundingBoxToWorld();
                if (pos.x < cardNodeRect.xMin) {
                    return { node: cardNode, index: 0, isChange: true };
                } else if (pos.x > cardNodeRect.xMax) {
                    return { node: cardNode, index: cardNode.childrenCount - 1, isChange: true };
                }
            }
        }
        return null;
    }

    //出牌
    performOutCard = function (card) {

        //禁止出牌
        if (!this.allowOutCard) return false;
        //出牌
        if (this.EventOutCard) this.EventOutCard({ Card: card });
        // GameNetwork.sendData(Message.MainCmd.Game, ClientCmd.UserOutCard, { Card: card });
        return true;
    }

    //获取资源
    getSpriteFrameByCard = function (card) {
        if (card === -1) {
            return this.cardAtlas.getSpriteFrame('back')
        }
        let cardNum = card % 16;
        let cardColor = Math.floor(card / 16);
        return this.cardAtlas.getSpriteFrame('${cardColor}-${cardNum}')
    }

    //设置玩家手牌 (游戏开始发牌)
    setUserHandCard = function (viewPos, bankerPos, cards) {
        try {
            IsPlayAction(true);
            this.performWidget(true);
            this.updateRedPointCount();

            if (viewPos === 0) this.bottomHandCards = this.bottomHandCards.concat(cards);

            if (!this.IsReplayMode) {
                this.players.forEach((player, index) => {
                    if (index === viewPos) {
                        this.players[index].setUserHandCards(cards, true)
                    } else if (index === bankerPos && index !== viewPos) {
                        this.players[index].setUserHandCards(8, true)
                    } else {
                        this.players[index].setUserHandCards(7, true)
                    }
                })
            } else {
                this.players[viewPos].setUserHandCards(cards, true)
            }
        } catch (error) {
            cc.error('设置玩家手牌++++++++', error)
        }


    }

    //断线
    resumeUserHandCard = function (viewPos, cards) {
        IsPlayAction(true);
        if (viewPos === 0) {
            this.selfHandCards = [];
            this.bottomHandCards = [];
        }
        if (viewPos === 0) {
            this.bottomHandCards = this.bottomHandCards.concat(cards);
        }

        cc.log('手牌恢复', viewPos, cards)
        this.performWidget(true);
        if (this.IsReplayMode) {
            this.players[viewPos].setUserHandCards(cards, false)
        } else this.players[viewPos].setUserHandCards(cards, true);
    }

    //添加桌子上的牌
    setUserTableCard = function (viewPos, cards) {
        //断线恢复时为array
        if (cards instanceof Array) {
            cards.forEach(card => {
                this.players[viewPos].addTableCard(card);
            })
        } else {
            //中央的牌移动到出牌区
            let node = this.players[viewPos].addTableCard(cards, 0);
            setTimeout(() => {
                try {
                    if (!cc.isValid(this.node)) return;

                    // cc.log('游戏消息++++掉', new Date().format('hh:mm:ss:S'))
                    let wpos = node.convertToWorldSpaceAR(cc.v2(0, 0));
                    let npos = this.node.convertToNodeSpaceAR(wpos);
                    let moveLast = cc.moveTo(ActionTime.Fall, npos.x, npos.y);
                    let tableNode = this.TableLastOutCard1;
                    let seq = cc.sequence(cc.spawn(moveLast, cc.scaleTo(ActionTime.Fall, node.scale)), cc.callFunc(() => {
                        tableNode.node.visible = false;
                        node.setOpacity(255);
                        // cc.log('游戏消息++++掉完', new Date().format('hh:mm:ss:S'))
                    }));
                    tableNode.node.runAction(seq);
                    this.TableLastOutCard.node.visible = false;
                } catch (error) {
                    cc.error('添加桌子上的牌', error)
                }
            }, 0.05 * 1000);
        }
    }

    updataLastTableOutData = function (viewPos, card) {
        GameData.lastTableOutCard = card;
        lastOutCardPos = viewPos;
    }

    //自己出牌失败恢复
    onUserResetCard = function (viewPos, card) {
        if (viewPos === 0) {
            this.bottomHandCards = this.bottomHandCards.concat(card);
            this.players[viewPos].onUserResetCard(card);
        }
    }

    //玩家摸牌
    /**
     * 
     * @param viewPos 
     * @param cards 新进牌
     * @param newCardLen 偷牌结果，王的数量
     */
    onUserNewCard = function (viewPos, cards, newCardLen) {
        if (viewPos === PlayerPositon.Bottom) IsPlayAction(true);

        if (!newCardLen && viewPos === 0) {
            if (cards instanceof Array) this.bottomHandCards = this.bottomHandCards.concat(cards);
            else this.bottomHandCards.push(cards);
        }

        this.updataLastTableOutData(null, null);
        //游戏开始偷牌后新进的牌Array  别人[];
        if (cards instanceof Array) {
            if (viewPos === 0) {
                // cards.forEach((card, index) => {
                //     this.players[viewPos].setUserHandCards(card, index === cards.length - 1 ? true : false, false, true);
                // })
                this.players[viewPos].setUserHandCards(cards, false, true);
            } else {
                if (this.IsReplayMode) {
                    // cards.forEach((card, index) => {
                    //     this.players[viewPos].setUserHandCards(card, index === cards.length - 1 ? true : false, false, true);
                    // })
                    this.players[viewPos].setUserHandCards(cards, false, true);
                } else {
                    if (newCardLen) this.players[viewPos].setUserHandCards(newCardLen, false, true);
                }
            }
        }
        //游戏中偷牌后新进的牌number 别人null;
        else {
            //手牌添加
            if (cards === null && viewPos !== 0) {
                this.players[viewPos].setUserHandCards(1, false, true);
            } else {
                this.players[viewPos].setUserHandCards(cards, false, true);
            }
        }
    }

    //从牌桌翻牌/系统发牌 /玩家出牌
    onSystemCard = function (viewPos, card, isOutCard = false) {
        if (viewPos === PlayerPositon.Bottom) IsPlayAction(true);

        this.updataLastTableOutData(viewPos, card);

        this.onTableLastOutCardShow(viewPos, card, isOutCard);
    }

    /**
     * 将已经出的牌显示出来， 避免动画没播完就收到新消息停止了动画
     */
    onShowOutCard = function () {
        // cc.log('游戏消息++++没掉完', new Date().format('hh:mm:ss:S'))
        this.BottomOutCards.children.forEach(card => card.setOpacity(255));
        this.TopOutCards.children.forEach(card => card.setOpacity(255));
        this.LeftOutCards.children.forEach(card => card.setOpacity(255));
        this.LeftOutCards.children.forEach(card => card.setOpacity(255));
        this.removeOtherCard();
        //显示所有吃碰牌
        this.players.forEach(player => {
            player.recoveryWeavesCards();
        })
    }

    //移除未清除的牌
    removeOtherCard = function () {
        let removeCardNode = this.TopHandCards.children.filter(card => {
            return (card.getComponent(Card).isRemove)
        });
        removeCardNode = removeCardNode.concat(this.LeftHandCards.children.filter(card => {
            return (card.getComponent(Card).isRemove)
        }))
        removeCardNode = removeCardNode.concat(this.RightHandCards.children.filter(card => {
            return (card.getComponent(Card).isRemove)
        }));

        removeCardNode = removeCardNode.concat(this.BottomHandCards.children.filter(child => {
            child.children.forEach(card => {
                return (card.getComponent(Card).isRemove)
            });
        }));
        removeCardNode.forEach(node => {
            cc.log("移除+++++++")
            node.destroy();
        })
    }

    //显示新出的牌
    onTableLastOutCardShow = function (viewPos, card, isOutCard = false) {
        this.onShowOutCard();
        cc.log('显示新出的牌', isOutCard)

        //玩家出牌
        if (isOutCard) {
            this.TableLastOutCard.node.setOpacity(255);
            this.TableLastOutCard.node.stopAllActions();
            //播放出牌动画
            if (viewPos !== 0) {
                let node = this.players[viewPos].getLastCard(card);
                cc.log('添加出牌 +++++ out', viewPos)
                node.getComponent(Card).isRemove = true;
                node.visible = false;
                this.players[viewPos].outCardAction(node, card);
            } else {
                this.TableLastOutCard.node.stopAllActions();
                this.TableLastOutCard.node.scale = 1;

                this.TableLastOutCard.Data = card;
                this.TableLastOutCard.showFace = this.getSpriteFrameByCard(card);
                this.TableLastOutCard.node.visible = true;
                let endPos = this.players[viewPos].getTableCardEndPos();
                this.TableLastOutCard.node.setPosition(endPos);
            }
        } else {
            //播放翻牌动画
            this.players[viewPos].systemCardAction(card);
        }
        if (viewPos === PlayerPositon.Bottom) IsPlayAction(true)

    }


    clearLastOutCardTimer = function () {
        this.TableLastOutCard.node.stopAllActions();
        this.TableLastOutCard.node.scale = 1;
        // this.TableLastOutCard.node.visible = false;
        this.onShowOutCard();
        //
        if (lastOutCardPos !== null && GameData.lastTableOutCard !== null) {
            this.setUserTableCard(lastOutCardPos, GameData.lastTableOutCard);
            this.updataLastTableOutData(null, null);
        }

    }

    //碰杠数据恢复
    resumeWeavesCard = function (viewPos, cards, type) {
        if (type === 'gang') {
            if (cards instanceof Array) this.players[viewPos].onUserAddGang(cards, WeaveType.AnGang);
            else {
                //偷牌阶段暗杠 先不显示
                cards = [-1, -1, -1, -1];
                this.players[viewPos].onUserAddGang(cards, WeaveType.AnGang);
            }
        } else {
            this.players[viewPos].onUserAddWeaves(cards, type);
        }
    }

    //吃碰(断线恢复)
    performResumeWeavesCard = function (viewPos, cards, type) {
        this.onRemoveUserOutCard();
        if (type === 'wang') {
            //游戏中偷为number
            if (typeof (cards) === 'number') {
                //7当王
                if (this.getCardNum(cards) === 7) {
                    this.players[viewPos].onUserAddWeaves(cards, '7ToWang');
                } else {
                    this.players[viewPos].onUserAddWeaves(cards, 'wang');
                }
            }
            //游戏开始为array
            else {
                let Wang7 = cards.filter(card => {
                    return this.getCardNum(card) === 7;
                })
                let Wang = cards.filter(card => {
                    return this.getCardColor(card) === 4;
                })
                if (Wang.length > 0) this.players[viewPos].onUserAddWeaves(Wang, 'wang');

                if (Wang7.length > 0) {
                    this.players[viewPos].onUserAddWeaves(Wang7, '7ToWang');
                }
            }
        } else {
            this.players[viewPos].onUserAddWeaves(cards, type);
        }
    }

    removeHandCardData = function (viewPos, cards) {
        if (viewPos !== 0) return;

        let bottomCards = this.bottomHandCards.slice(0);
        bottomCards.forEach(val => {
            let index = this.bottomHandCards.findIndex(card => card === cards);
            if (index !== -1)
                this.bottomHandCards.splice(index, 1);
        })
    }

    //从手牌中移除吃碰杠的牌
    onRemoveUserHandCard = function (viewPos, cards, isDestroy = true) {
        let removeCardNode = [];
        if (cards instanceof Array) {
            let Cards = new Set(cards)
            Cards.forEach(card => {
                this.removeHandCardData(viewPos, card);
                let node = this.players[viewPos].onRemoveUserHandCard(card, isDestroy);
                removeCardNode = removeCardNode.concat(node);
            })
            console.log("LLL+++removeNode", removeCardNode)
        } else {
            if (typeof (cards) == "number") {
                this.removeHandCardData(viewPos, cards);
                let node = this.players[viewPos].onRemoveUserHandCard(cards, isDestroy);
                removeCardNode = removeCardNode.concat(node);
            }
        }
        return removeCardNode;
    }

    //处理断线恢复(其他玩家操作后移除放入table中的card)
    onRemoveUserOutCard = function () {
        let viewPos = lastOutCardPos;
        let card = GameData.lastTableOutCard;
        if (card && viewPos !== null)
            this.players[viewPos].onRemoveUserOutCard(card);
    }

    /**游戏开始偷牌结果
     * @param data 
     *  
    //偷牌后新进牌（不是自己则是空数组）
    Cards: Array<number>;
    //王牌
    Kings: Array<number>;
    //偷牌玩家座位号
    ChairID
     */
    onUserTouResult = function (viewPos, data) {
        if (viewPos === PlayerPositon.Bottom) IsPlayAction(true)

        let Wang7 = data.Kings.filter(card => {
            return this.getCardNum(card) === 7;
        })
        let Wang = data.Kings.filter(card => {
            return this.getCardColor(card) === 4;
        })
        let wangNode = [];
        if (Wang.length > 0) {
            wangNode = this.players[viewPos].onUserAddWeaves(Wang, 'wang', false);
        }
        let wang7Node = [];
        if (Wang7.length > 0) {
            wang7Node = this.players[viewPos].onUserAddWeaves(Wang7, '7ToWang', false);
        }
        let startNodeInfo = [];
        //从手牌中移除王
        if (viewPos === 0) {
            startNodeInfo = this.onRemoveUserHandCard(viewPos, data.Kings, false);
        } else {
            if (this.IsReplayMode) {
                startNodeInfo = this.onRemoveUserHandCard(viewPos, data.Kings, false);
            } else {
                startNodeInfo = this.onRemoveUserHandCard(viewPos, data.Kings.length, false);
            }
        }

        // if (viewPos === 0) {
        let actionInfos = [];
        //王
        wangNode.forEach(wang => {
            let action = {};
            action.endNode = wang;

            let index = startNodeInfo.findIndex(start => {
                return start.getComponent(Card).Data === wang.getComponent(Card).Data;
            })
            if (index < 0) {
                action.startNode = null;
            } else {
                action.startNode = startNodeInfo.splice(index, 1)[0];

            }
            if (!action.startNode) action.startNode = startNodeInfo.shift();
            action.card = wang.getComponent(Card).Data;
            actionInfos.push(action);
        })
        //7当王
        wang7Node.forEach(wang => {
            let action = {};
            action.endNode = wang;
            action.startNode = startNodeInfo.find(start => {
                return start.getComponent(Card).Data === wang.getComponent(Card).Data;
            })
            if (!action.startNode) action.startNode = startNodeInfo.shift();
            action.card = wang.getComponent(Card).Data;
            actionInfos.push(action);
        })
        this.players[viewPos].addweavesAction(actionInfos, viewPos === 0 ? true : false);

        if (viewPos === 0) {
            this.bottomHandCards = this.bottomHandCards.concat(data.Cards);
        }


        if (this.IsReplayMode) {
            if (!cc.isValid(this.node)) return;
            //手牌添加新进牌 
            cc.log('偷startTouResultTimer', data.Cards, viewPos)
            this.onUserNewCard(viewPos, data.Cards, data.Kings.length);
        } else {
            let timerID = setTimeout(() => {
                if (!cc.isValid(this.node)) return;
                //手牌添加新进牌 
                cc.log('偷startTouResultTimer', data.Cards, viewPos)
                this.onUserNewCard(viewPos, data.Cards, data.Kings.length);
            }, 0.9 * 1000)
            this.startTouResultTimer = timerID;
            this.totalTimerID.push(timerID);
        }
        this.startTouResultCard = data.Cards
    }

    /**
     * 游戏中偷牌
     * @param viewPos 
     * @param Card 
     */
    onUserTouKing = function (viewPos, Card) {
        if (viewPos === PlayerPositon.Bottom) IsPlayAction(true);
        let weavesNode = [];
        //7当王
        if (this.getCardNum(Card) === 7) {
            weavesNode = this.players[viewPos].onUserAddWeaves(Card, '7ToWang', false);
        } else {
            weavesNode = this.players[viewPos].onUserAddWeaves(Card, 'wang', false);
        }

        this.players[viewPos].onUserTouKing(Card, weavesNode[0]);
    }

    //玩家吃牌
    onUserChiCards = function (viewPos, cards) {
        if (viewPos === PlayerPositon.Bottom) IsPlayAction(true);
        this.TableLastOutCard.node.stopAllActions();
        this.TableLastOutCard.node.scale = 1;
        this.TableLastOutCard.node.visible = false;

        let actionInfos = [];
        if (cards instanceof Array) {
            let removeCard = cards.find(card => {
                return card !== GameData.lastTableOutCard;
            })

            let startNodeInfo = [];
            if (viewPos === 0) {
                //移除手中吃的牌
                startNodeInfo = this.onRemoveUserHandCard(viewPos, removeCard, false);
            } else {
                //移除手中吃的牌
                if (this.IsReplayMode) {
                    startNodeInfo = this.onRemoveUserHandCard(viewPos, removeCard, false);
                } else {
                    startNodeInfo = this.onRemoveUserHandCard(viewPos, 1, false);
                }
            }

            //weavea添加
            let chiNode = this.players[viewPos].onUserAddWeaves(cards, 'chi', false);
            chiNode.forEach(chi => {
                let action = {};
                action.endNode = chi;
                action.card = chi.getComponent(Card).Data;
                //要移除的那张
                if (removeCard === chi.getComponent(Card).Data) {
                    action.startNode = startNodeInfo[0];
                }
                else {
                    action.startNode = this.TableLastOutCard1.node;
                }
                actionInfos.push(action);
            })
            this.players[viewPos].addweavesAction(actionInfos, false);

            //移除桌上card
            // this.TableLastOutCard.node.visible = false;
        }

        let timerID = setTimeout(() => {
            if (!cc.isValid(this.node)) return;
            IsPlayAction(false);
        }, 0.9 * 1000);
        this.totalTimerID.push(timerID);
    }

    //玩家出牌
    onUserOutCard = function (viewPos, cards) {
        if (viewPos === PlayerPositon.Bottom) IsPlayAction(true)

        if (typeof (cards) === 'number') {
            //手牌中移除出的牌
            if (viewPos === 0) {
                this.onRemoveUserHandCard(viewPos, cards);
                this.performWidget();
            }
            //桌上显示
            this.onSystemCard(viewPos, cards, true);
        }
    }

    //玩家碰牌
    onUserPengCards = function (viewPos, cards, type) {
        if (viewPos === PlayerPositon.Bottom) IsPlayAction(true)
        let actionInfos = [];
        this.TableLastOutCard.node.stopAllActions();
        this.TableLastOutCard.node.scale = 1;
        this.TableLastOutCard.node.visible = false;

        if (cards instanceof Array) {
            //有时候收到null
            cards = cards.filter(card => {
                return card !== null;
            })
            //移除桌上显示的牌
            // this.TableLastOutCard.node.visible = false;
            if (type === WeaveType.Peng) {
                let lastCard = GameData.lastTableOutCard;
                let removeCard = cards
                if (lastCard) {
                    removeCard = cards.filter(card => {
                        return card !== lastCard;
                    })
                }
                let startNodeInfo = [];
                //移除手牌
                if (viewPos === 0) {
                    startNodeInfo = this.onRemoveUserHandCard(viewPos, removeCard, false);
                } else {
                    if (this.IsReplayMode) {
                        startNodeInfo = this.onRemoveUserHandCard(viewPos, removeCard, false);
                    } else {
                        startNodeInfo = this.onRemoveUserHandCard(viewPos, removeCard.length, false);
                    }
                }
                //添加weaves
                let pengNode = this.players[viewPos].onUserAddWeaves(cards, 'peng', false);
                pengNode.forEach(peng => {
                    let action = {};
                    action.endNode = peng;
                    action.card = peng.getComponent(Card).Data;
                    action.startNode = startNodeInfo.find(start => {
                        return start.getComponent(Card).Data === peng.getComponent(Card).Data;
                    })
                    if (!action.startNode) {
                        if (viewPos === 0) {
                            action.startNode = this.TableLastOutCard1.node;
                        } else {
                            action.startNode = startNodeInfo.shift();
                            if (!action.startNode) action.startNode = this.TableLastOutCard.node;
                        }
                    }
                    actionInfos.push(action);
                })
                this.players[viewPos].addweavesAction(actionInfos, false);
            }
            //anpeng,只有自己是数组
            else {
                //添加weaves
                let pengNode = this.players[viewPos].onUserAddWeaves(cards, 'anpeng', false);
                let startNodeInfo = [];
                //移除手牌
                if (viewPos === 0) {
                    startNodeInfo = this.onRemoveUserHandCard(viewPos, cards, false);
                } else {
                    if (this.IsReplayMode) {
                        startNodeInfo = this.onRemoveUserHandCard(viewPos, cards, false);
                    }
                }

                pengNode.forEach(peng => {
                    let action = {};
                    action.endNode = peng;
                    action.card = peng.getComponent(Card).Data;
                    action.startNode = startNodeInfo.find(start => {
                        return start.getComponent(Card).Data === peng.getComponent(Card).Data;
                    })
                    if (!action.startNode) {
                        if (viewPos === 0) {
                            action.startNode = this.TableLastOutCard1.node;
                        } else {
                            action.startNode = startNodeInfo.shift();
                            if (!action.startNode) action.startNode = this.TableLastOutCard.node;
                        }
                    }
                    actionInfos.push(action);
                })
                this.players[viewPos].addweavesAction(actionInfos, false);
            }
        }
        //其他玩家 暗碰 number
        else {
            if (type === WeaveType.AnPeng) {
                let startNodeInfo = this.onRemoveUserHandCard(viewPos, 3, false);
                let pengNode = this.players[viewPos].onUserAddWeaves(3, 'anpeng', false);
                pengNode.forEach(peng => {
                    let action = {};
                    action.endNode = peng;
                    action.card = peng.getComponent(Card).Data;
                    action.startNode = startNodeInfo.shift();
                    actionInfos.push(action);
                })
                this.players[viewPos].addweavesAction(actionInfos, false);
            }
        }
    }
    //玩家杠牌
    onUserGangCards = function (viewPos, cards, type) {
        if (viewPos === PlayerPositon.Bottom) IsPlayAction(true)

        this.onRemoveUserOutCard();
        this.TableLastOutCard.node.stopAllActions();
        this.TableLastOutCard.node.scale = 1;
        this.TableLastOutCard.node.visible = false;

        if (cards instanceof Array) {
            let actionInfos = [];
            //添加Weaves
            let gangNode = this.players[viewPos].onUserAddGang(cards, type, false);
            let startNodeInfo = [];
            //移除手牌
            if (viewPos === 0) {
                startNodeInfo = this.onRemoveUserHandCard(viewPos, cards, false);
            } else {
                if (this.IsReplayMode) {
                    startNodeInfo = this.onRemoveUserHandCard(viewPos, cards, false);
                } else {
                    //手牌进3张
                    if (type === WeaveType.AnGang) {
                        //移除手牌
                        startNodeInfo = this.onRemoveUserHandCard(viewPos, cards.length, false);
                    }
                    //手牌3张+ 别人点
                    else if (type === WeaveType.DianGang) {
                        //移除桌上显示的牌
                        // this.TableLastOutCard.node.visible = false;
                        //移除手牌
                        startNodeInfo = this.onRemoveUserHandCard(viewPos, 3, false);
                    }
                    //已碰 + 自己翻或进的牌
                    else if (type === WeaveType.WanGang) {
                        //新翻的
                        if (this.getCardNum(GameData.lastTableOutCard) === this.getCardNum(cards[0])) {
                            //不移除
                            // this.TableLastOutCard.node.visible = false;
                        }
                        //新进的牌杠
                        else {
                            startNodeInfo = this.onRemoveUserHandCard(viewPos, 1, false);
                        }
                    }
                }
            }

            gangNode.forEach(gang => {
                let action = {};
                action.endNode = gang;
                action.card = gang.getComponent(Card).Data;
                action.startNode = startNodeInfo.find(start => {
                    return start.getComponent(Card).Data === gang.getComponent(Card).Data;
                })
                if (!action.startNode) {
                    if (viewPos === 0) {
                        action.startNode = this.TableLastOutCard1.node;
                    } else {
                        action.startNode = startNodeInfo.shift();
                        if (!action.startNode) action.startNode = this.TableLastOutCard1.node;
                    }
                }
                actionInfos.push(action);
            })
            this.players[viewPos].addweavesAction(actionInfos, false);
        }

    }

    //暗杠显示牌面
    onUserShowAnGang = function (viewPos, cards, type) {
        if (viewPos !== 0) {
            if (cards instanceof Array) this.players[viewPos].onUserShowAnGang(cards);
        }
    }

    //能操作的card
    performActionCards = function (Actions) {
        let getCardMap = () => {
            const cards = this.bottomHandCards;
            let cardMap = new Map();
            cards.forEach(card => {
                let num = this.getCardNum(card);
                let data = cardMap.get(num);
                if (data) {
                    data.push(card);
                    cardMap.set(num, data);
                } else {
                    cardMap.set(num, [card]);
                }
            })
            console.log('LLL++getCardMap', cardMap)
            return cardMap;
        }
        cc.log("玩家手牌+++++++++++++", this.bottomHandCards, this.selfHandCards);
        console.log('LLL++lastTableOutCard', GameData.lastTableOutCard)
        Actions.forEach(action => {
            switch (action) {
                case UserAction.Chi: {
                    let lastCard = GameData.lastTableOutCard;
                    if (lastCard) {
                        let lastNum = this.getCardNum(lastCard);
                        let chiCards = [];
                        this.bottomHandCards.forEach(card => {
                            if ((this.getCardNum(card) + lastNum) === 14) {
                                chiCards.push(card)
                            }
                        })
                        chiCards.forEach(card => {
                            if (this.getCardColor(card) === 4) return;
                            if (this.Rule.Allow7AsKing && this.getCardNum(card) === 7) return;
                            let chi = {
                                type: 'chi',
                                card: card
                            }
                            GameData.updateActionCard(chi);
                            GameData.isActionByTableCard = true;
                        })
                    }
                    break;
                }
                case UserAction.Peng: {
                    let lastCard = GameData.lastTableOutCard;
                    //打出的牌或翻的牌
                    if (lastCard) {
                        let lastNum = this.getCardNum(lastCard);
                        let cards = [];
                        this.bottomHandCards.forEach(card => {
                            if (this.getCardNum(card) === lastNum) {
                                cards.push(card)
                            }
                        })

                        if (cards.length >= 2) {
                            if (this.getCardColor(cards[0]) === 4) return;
                            if (this.Rule.Allow7AsKing && this.getCardNum(cards[0]) === 7) return;
                            let peng = {
                                type: 'peng',
                                card: cards[0]
                            }
                            GameData.updateActionCard(peng);
                            GameData.isActionByTableCard = true;
                        }
                    }
                    //自己进的牌
                    else {
                        let cardMap = getCardMap();
                        let peng = [];
                        cardMap.forEach(value => {
                            if (value.length >= 3) {
                                peng.push(value[0]);
                            }
                        })
                        console.log('LLL+++peng[]', peng)
                        peng.forEach(card => {
                            if (this.getCardColor(card) === 4) return;
                            if (this.Rule.Allow7AsKing && this.getCardNum(card) === 7) return;
                            let peng = {
                                type: 'peng',
                                card: card
                            }
                            GameData.updateActionCard(peng);
                            GameData.isActionByTableCard = false;
                        })
                    }
                    break;
                }
                case UserAction.Gang: {
                    let lastCard = GameData.lastTableOutCard;
                    let lastNum = this.getCardNum(lastCard);
                    //别人打出的牌或翻的牌
                    if (lastCard) {
                        //手牌里找
                        let cards = [];
                        this.bottomHandCards.forEach(card => {
                            if (this.getCardNum(card) === lastNum) {
                                cards.push(card);
                            }
                        })
                        if (cards.length === 3) {
                            if (this.getCardColor(cards[0]) === 4) return;
                            if (this.Rule.Allow7AsKing && this.getCardNum(cards[0]) === 7) return;
                            let gang = {
                                type: 'gang',
                                card: cards[0]
                            }
                            GameData.updateActionCard(gang);
                            GameData.isActionByTableCard = true;
                        }
                        //碰牌里找
                        else {
                            let peng = this.BottomUserChiCards.children.find(child => {
                                return this.getCardNum(child.getComponent(ChiCardLayout).Data) === lastNum && child.getChildByName('weaves').childrenCount === 3;
                            })
                            if (peng) {
                                let gang = {
                                    type: 'gang',
                                    card: peng.getChildByName('weaves').children[0].getComponent(Card).Data
                                }
                                GameData.updateActionCard(gang);
                                GameData.isActionByTableCard = true;
                            }
                        }
                    }
                    //自己进的牌
                    else {
                        let cardMap = getCardMap();
                        let gang = [];
                        cardMap.forEach(value => {
                            if (value.length > 3) {
                                gang.push(value[0]);
                            }
                        })
                        //手牌里能杠的牌
                        if (gang.length > 0) {
                            gang.forEach(card => {
                                if (this.getCardColor(card) === 4) return;
                                if (this.Rule.Allow7AsKing && this.getCardNum(card) === 7) return;
                                let gang = {
                                    type: 'gang',
                                    card: card
                                }
                                GameData.updateActionCard(gang);
                                GameData.isActionByTableCard = false;
                            })
                        }
                        //碰转杠的牌
                        else {
                            let pengToGang = this.BottomUserChiCards.children.filter(child => {
                                return (child.getComponent(ChiCardLayout).Type === 'peng' || child.getComponent(ChiCardLayout).Type === 'anpeng');
                            })
                            let gangData = [];
                            pengToGang.forEach(gang => {
                                let num = this.getCardNum(gang.getComponent(ChiCardLayout).Data);
                                this.bottomHandCards.forEach(card => {
                                    if (this.getCardNum(card) === num) {
                                        gangData.push(card);
                                    }
                                })
                            })
                            gangData.forEach(card => {
                                let gang = {
                                    type: 'gang',
                                    card: card
                                }
                                GameData.updateActionCard(gang);
                                GameData.isActionByTableCard = false;
                            })
                        }
                    }
                    break;
                }
            }
        });
    }

    TableLastOutCard1 = function () {
        let node = this.TableLastOutCard.node.clone();
        this.temporaryCard.addChild(node);
        const ctr = new Card(node);
        ctr.Data = this.TableLastOutCard.Data;
        ctr.showFace = this.getSpriteFrameByCard(this.TableLastOutCard.Data);
        node.visible = true;
        node.setScale(1);
        node.setOpacity(255);
        return ctr;
    }

    actionMaskVisible = function (val) {
        // cc.log('禁止点击', val);
        if (!this.node.isValid) return;
        this.Mask.visible = val;
        if (val) {
            if (this.maskTimer) clearTimeout(this.maskTimer);
            this.maskTimer = setTimeout(() => {
                if (!this.node.isValid) return;
                this.Mask.visible = false;
                this.maskTimer = null;
            }, 1.5 * 1000)
            this.totalTimerID.push(this.maskTimer)
        }
    }
    updateRedPointCount = function () {
        let num = 0;
        //手牌
        this.bottomHandCards.forEach(card => {
            //wang
            if (this.getCardColor(card) === 4) return;
            //红点
            if (this.getCardColor(card) % 2 === 0) {
                let cardNum = this.getCardNum(card);
                //7当王算点
                if (cardNum === 7) {
                    if (this.Rule.Allow7AsKing && this.Rule.IsPoint7AsKing) {
                        num += cardNum > 10 ? 1 : cardNum;
                    } else if (!this.Rule.Allow7AsKing) {
                        num += cardNum > 10 ? 1 : cardNum;
                    }
                } else {
                    num += cardNum > 10 ? 1 : cardNum;
                }
            }
        })
        //碰杠牌
        this.BottomUserChiCards.children.forEach(child => {
            child.getChildByName('weaves').children.forEach(card => {
                if (!card.visible || card.getOpacity() !== 255) return;
                //wang
                if (this.getCardData(card).Color === 4) return;
                //红点
                if (this.getCardData(card).Color % 2 === 0) {
                    let cardNum = this.getCardData(card).Num;
                    //7当王算点
                    if (cardNum === 7) {
                        if (this.Rule.Allow7AsKing && this.Rule.IsPoint7AsKing) {
                            num += cardNum > 10 ? 1 : cardNum;
                        } else if (!this.Rule.Allow7AsKing) {
                            num += cardNum > 10 ? 1 : cardNum;
                        }
                    } else {
                        num += cardNum > 10 ? 1 : cardNum;
                    }
                }
            })
        })
        this.redPoint.visible = true;
        this.redPointBg.visible = true;
        this.redPoint.setString('红点:' + num);
    }
    performWidget = function (first) {
        if (!this.BottomHandCards) return;
        let widget = this.BottomHandCards.getComponent(cc.Widget);
        if (widget === null) widget = this.BottomHandCards.addComponent(cc.Widget);
        widget.target = this.node;

        let num = 0;

        if (first) {
            widget.isAlignLeft = true;
            widget.left = 0.35;
        } else {
            this.BottomHandCards.children.forEach(child => {
                if (child.visible && child.childrenCount >= 1) {
                    let card = child.children.find(node => {
                        return node.visible && node.getOpacity() === 255;
                    })
                    if (card) num += 1;
                }
            })

            if (num > 5) {
                widget.isAlignLeft = true;
                widget.left = 0.35;
            } else {
                widget.isAlignHorizontalCenter = true;
                widget.horizontalCenter = 0;
            }
        }
        cc.log('数量', num)
        widget.updateAlignment();
    }
    maskCards = function () {
        if (this.isBaoTing) {
            this.BottomHandCards.children.forEach(child => {
                if (child.visible && child.childrenCount >= 1) {
                    child.children.forEach(node => {
                        node.setColor(cc.Color.GRAY);
                    })
                }
            })
        }
    }
    onInit = function (cardAtlas) {
        cardMgr = this;
        this.node.children.forEach((node, index) => {
            if (index < 9)
                node.visible = false
        })
        this.cardAtlas = cardAtlas;
    }
    getCardNum = function (card) {
        let cardNum = card % 16;
        return cardNum;
    }
    getCardColor = function (card) {
        let cardColor = Math.floor(card / 16);
        return cardColor;
    }
}
/**桌子 */
function Desk(node, ctr) {
    this.node = node;
    this.ctr = ctr;
    this.cardNumlabel = node.getChildByName("CardNum")
    this.ruleNode = node.getChildByName("ruleNode")
    onInit = function (rule) {
        let num = 52 + rule.MaxKingCount;
        this.cardNumlabel.setString(num);
    }
    CardNum = function (val) {
        let oldNum = Number(this.cardNumlabel.getString())
        this.cardNumlabel.setString(oldNum - val);
    }
    showRule = function (val, ruleInfo) {
        this.ruleNode.visible = val;
        if (ruleInfo) {
            this.ruleNode.getChildByName('rule').setString(ruleInfo);
        }
    }
    showCardNum = function (val) {
        this.node.getChildByName('cocos').visible = val;
        this.node.getChildByName('CardNum').visible = val;
    }
}