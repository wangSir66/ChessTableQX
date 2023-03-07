var actionZindex = 1000;
//可叫主的状态
var jiaoZhuState =
{
    none_jiao:0,           //不可叫主
    normal_jiao:1,         //普通叫主
    mingpai_jiao:2,        //明牌叫主
    fanzhu_jiao:3,         //只能反主
};
// 25:方块  26:梅花  27:红心  28:黑桃


// off 是四个位置，根据off 显示四个位置的信息 by sking
function SetUserVisible_daQi(node, off) {
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
    var fen=head.getChildByName('fen');
    var zhuafen=head.getChildByName('zhuafen');
    // name.setScale(1.5);
    // coin.setScale(1.2);
    if (pl) {
        name.visible = true;
        if(off == 0 )
        {
         if(tData.tState == TableState.waitReady || tData.tState == TableState.waitJoin)
         {
             coin.visible = true;
         }
         else
         {
             coin.visible = false;
         }
        }
        else {
            coin.visible = true;
        }
        offline.visible = true;
        coin.visible = true;
        name_bg.visible = true;
        score_bg.visible = false;
        if(fen)
        {
            if(off != 0)
            {
                fen.visible=false;
            }
            else
            {
                fen.visible=true;
            }
        }
        if(zhuafen)
        {
            if(tData.tState == TableState.waitReady || tData.tState == TableState.waitJoin)
            {
                zhuafen.visible=false;
            }
            else {
                zhuafen.visible=true;
            }
        }
        MjClient.loadWxHead(pl.info.uid, pl.info.headimgurl);
        setUserOffline(node, off);
        InitUserHandUI_daQi(node, off, false);
        if(off===0)
        {
            MjClient.playui._coin_myself.setString(tData.initCoin + pl.winall);
        }
    } else {
        name.visible = false;
        coin.visible = false;
        offline.visible = false;
        coin.visible = false;
        name_bg.visible = false;
        if (fen) {
            fen.visible = false;
        }
        if (zhuafen) {
            zhuafen.visible = false;
        }
        // var clippingNode = nobody.getChildByName("clippingNode");
        // if (clippingNode) {
        //     var WxHead = clippingNode.getChildByName('WxHead');
        // }
        var WxHead = nobody.getChildByName("WxHead");
        if (WxHead) {
            WxHead.removeFromParent(true);
        }
    }
}

// isDeal 是否是发牌
function InitUserHandUI_daQi(node, off, isDeal) {
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
        //MjClient.playui.refreshScoreBanner();

    if (
        tData.tState != TableState.waitPut &&
        tData.tState != TableState.waitCard &&
        tData.tState != TableState.waitJiaoFen &&
        tData.tState != TableState.waitJiaoZhu &&
        tData.tState != TableState.waitMaiPai
    ) {
        return;
    }
    node.stopAllActions();
    //添加手牌
    if (MjClient.rePlayVideo == -1) // 表示正常游戏
    {
        if (pl.mjhand && off == 0) { //只初始化自己的手牌
            if(isDeal == true){//发牌流程

                MjClient.vnum7 = {25:0, 26:0, 27:0, 28:0};
                MjClient.playui.currentCardNum = 0;     //当前发牌的数量
                MjClient.playui.isDicardDelay = false;  //延时添加底牌
                MjClient.playui.isDeal = true;   //是否在发牌
                var vcard = [];
                var addNewCard = function(index){//发一张牌
                    var card = getNewCard_card(node, "stand", "mjhand", pl.mjhand[index], off);
                    MjClient.playui.setCardSprite_ZhuTag(card);
                    var vcardIndex = vcard.indexOf(pl.mjhand[index]); //区分2张一样的牌
                    if (vcardIndex >= 0) {
                        card.setUserData(1);
                    } else {
                        card.setUserData(0);
                    }
                    var value = pl.mjhand[index];
                    if(value == tData.mcTransValue && tData.areaSelectMode.fanpai == true){
                        value = tData.mingCard;
                    }
                    if(Math.ceil(value / 4) == 7 && value in MjClient.vnum7){
                        MjClient.vnum7[value]++;
                    }
                    vcard.push(pl.mjhand[index]);
                }
                //添加第一张首牌添加
                addNewCard(0);
                MjClient.playui.currentCardNum = 1;
                MjClient.playui.updateJiaoZhuState();
                MjClient.playui.CardLayoutRestore(node, off);
                
                var startDealCard = function(){//开始发牌
                    if(tData.mingCardHandIdx + 1 == MjClient.playui.currentCardNum){
                        MjClient.playui.dealMingTag_daqi();
                    }

                    MjClient.playui.currentCardNum = MjClient.playui.currentCardNum + 1;
                    addNewCard(MjClient.playui.currentCardNum - 1);
                    MjClient.playui.updateJiaoZhuState();
                    MjClient.playui.CardLayoutRestore(node, off);
                    if(MjClient.playui.currentCardNum == pl.mjhand.length){
                        MjClient.playui.isDeal = false;
                    }
                    if(MjClient.playui.currentCardNum < pl.mjhand.length){
                        node.runAction(cc.sequence(cc.delayTime(0.5), cc.callFunc(startDealCard, node)));
                    }else if(MjClient.playui.currentCardNum == pl.mjhand.length && MjClient.playui.isDicardDelay){
                        MjClient.playui.isDicardDelay = false;
                        MjClient.playui.isDeal = false;
                        dealDicard_daqi();
                    }
                }

                node.runAction(cc.sequence(cc.delayTime(3.0), cc.callFunc(startDealCard, node)));
            }
            else
            {
                var children = node.children;
                for(var i = 0; i < children.length; i++){//先清除所有手牌,修复发牌多一张的问题
                    var ni = children[i];
                    if(ni.name == "mjhand"){
                        ni.removeFromParent(true);
                    }
                }

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

                    var value = pl.mjhand[i];
                    if(value == tData.mcTransValue && tData.areaSelectMode.fanpai == true){
                        value = tData.mingCard;
                    }
                    if(Math.ceil(value / 4) == 7 && value in MjClient.vnum7){
                        MjClient.vnum7[value]++
                    }
                    vcard.push(pl.mjhand[i]);
                }
                MjClient.playui.currentCardNum = pl.mjhand.length;
                MjClient.playui.dealMingTag_daqi();
                MjClient.playui.updateJiaoZhuState();
                MjClient.playui.CardLayoutRestore(node, off);
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
                    var value = pl.mjhand[i];
                    if(value == tData.mcTransValue && tData.areaSelectMode.fanpai == true){
                        value = tData.mingCard;
                    }
                    if(Math.ceil(value / 4) == 7 && value in MjClient.vnum7){
                        MjClient.vnum7[value]++
                    }
                }

            } else {
                for (var i = 0; i < pl.mjhand.length; i++) {
                    var card = getNewCard_card(node, "stand", "mjhand_replay", pl.mjhand[i], off);
                    MjClient.playui.setCardSprite_ZhuTag(card);
                }
            }

            MjClient.playui.currentCardNum = pl.mjhand.length;
        }
        MjClient.playui.CardLayoutRestore(node, off);
    }

    if (tData.tState == TableState.waitJiaoZhu || tData.tState == TableState.waitCard) {// 叫主
        if (off == 0) {
            MjClient.playui.showWaitTip();
        }
    } else if (tData.tState == TableState.waitMaiPai) {	// 埋牌
        if (off == 0) {
            dealDicard_daqi();
        }
    } else if(tData.tState == TableState.waitPut && tData.isTouXiang == true 
        && 0 == getOffByIndex(tData.curPlayer)){
        MjClient.playui.showTouXiangBtn();
    }

}

function cardsSort_daQi(cards) {
    var pointCounts = {};
    for (var i = 0; i < cards.length; i++) {
        var p = MjClient.majiang.calPoint(cards[i]);
        if (pointCounts[p])
            pointCounts[p]++;
        else
            pointCounts[p] = 1;
    }

    var commonCmp = function(a, b) {
        var c1 = pointCounts[MjClient.majiang.calPoint(a)];
        var c2 = pointCounts[MjClient.majiang.calPoint(b)];
        if (c1 == c2)
            return MjClient.majiang.cardRealPointCmp(a, b);
        else
            return c1 - c2;
    }

    cards.sort(function(a, b) {
        return -commonCmp(a, b);
    });
}


var PlayLayer_daQi = cc.Layer.extend({
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
                    //if (sData.tData.roundNum <= 0) self.addChild(new GameOverLayer(), 500);
                    self.addChild(new EndOneView_daQi(), 500);
                }
                this.runAction(cc.sequence(cc.DelayTime(1.2), cc.callFunc(delayExe)));
                if(MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP|| MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ) reConectHeadLayout_card(this);
            },
            moveHead: function() {
                postEvent("returnPlayerLayer");
                tableStartHeadMoveAction_card(this);
                MjClient.playui.showWaitTip();
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
            onlinePlayer: function(msg) {
                if(msg.uid == SelfUid()){
                    reConectHeadLayout_card(this);
                }
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
            },
            waitPut: function(eD) {
                var tData = MjClient.data.sData.tData;
                if(tData.tState == TableState.waitPut && tData.isTouXiang == true
                    && 0 == getOffByIndex(tData.curPlayer)){
                    MjClient.playui.showTouXiangBtn();
                }
                // setSelectCardToNormalPos_daqi();
                MjClient.playui.updateJiaoZhuState();
                MjClient.playui.showWaitTip();
            },
            PKPut: function() {
                MjClient.playui.jsBind.panel.BtnTouXiang._node.setVisible(false);
            },
            s2c_dqJiaoZhu: function(eD){//有人叫主
                if(eD.zhuType == 1 || eD.zhuType == 2 || eD.zhuType == 4){
                    playEffectInPlay("liangzhu");
                }else if(eD.zhuType == 3){
                    playEffectInPlay("fanzhu");
                }
                if(MjClient.rePlayVideo != -1)
                {
                    MjClient.playui.updateRePlayVideoJiaoZhu(eD)
                }
                MjClient.playui.showWaitTip();
            },
            clearCardUI: function() {
                MjClient.vnum7 = {25:0, 26:0, 27:0, 28:0};
                MjClient.playui.currentCardNum = 0;     //当前发牌的数量
                MjClient.playui.isDicardDelay = false;  //延时添加底牌
            },
            waitReady: function(){
                reConectHeadLayout_card(this);
                MjClient.playui.showWaitTip();
            }
        },
        back: {
            roundInfo: {
                _layout: [
                    [0.12, 0.12],
                    [0.5, 0.5],
                    [0, 0]
                ],
                _run: function() {
                    var tData = MjClient.data.sData.tData;
                    this.ignoreContentAdaptWithSize(true);
                    this.setString(MjClient.playui.getGameInfoString("roundInfo"));
                },
            },
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
            dikuang:{
                _layout: [
                    [1, 0],
                    [0.5, 0.0],
                    [0, 0]
                ],
            },
            gameNameForSys:{
                _layout: [
                    [0.25, 0.25],
                    [0.5, 0.53],
                    [0.02, 0.4]
                ]
            },
            image_di: {
                _layout: [
                    [1, 0],
                    [0.5, 0.0],
                    [0, 0]
                ],
                _visible: false,
                _event: {
                    mjhand: function() {
                        // this.setVisible(true);
                    },
                    roundEnd: function() {
                        this.setVisible(false);
                    }
                }
            }
        },
        gameName: {
            _layout: [
                [0.2, 0.2],
                [0.5, 0.58],
                [0, 0]
            ],
            _visible: false,
        },
        banner: {
            _layout: [
                [0.18, 0.07],
                [0.08, 0.98],
                [0, 0]
            ],
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
            wifi: {
                _run: function() {
                    MjClient.playui.updateWifiState(this);
                }
            },
            powerBar: {
                _event: {
                    nativePower: function(d) {
                        this.setPercent(Number(d));
                    }
                },
                _run: function() {
                    updateBattery(this);
                },
            },
            tableid: {
                _run: function() {
                    this.ignoreContentAdaptWithSize(true);
                },
                _event: {
                    initSceneData: function() {
                        this.ignoreContentAdaptWithSize(true);
                        this.setString(MjClient.data.sData.tData.tableid);
                    }
                }
            },
        },

        zhuafen:{
            _layout: [
                [0.4, 0.4],
                [0.5, 0.65],
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
                        MjClient.playui.moveFen( MjClient.playui.zhuafen,off);
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
        clock: {
            _layout: [
                [0.073, 0.18],
                [0.5, 0.58],
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
                        var tData = MjClient.data.sData.tData;
                        if(TableState.waitMaiPai == tData.tState || tData.tState == TableState.waitPut ||
                            (TableState.waitJiaoZhu == tData.tState && tData.zhuType == 0)){
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
                        if (MjClient.rePlayVideo != -1){
                            MjClient.clockNode.visible = false;
                        }

                        if (msg.uid == SelfUid()) {
                            this.stopAllActions();
                            stopEffect(playTimeUpEff);
                            playTimeUpEff = null;
                            //MjClient.playui.clockNumberUpdate(this);
                            this.setString("00");
                        }
                    },
                    s2c_dqWaitJiaoZhu: function(eD) {//等待叫主
                        this.stopAllActions();
                        stopEffect(playTimeUpEff);
                        MjClient.clockNode.visible = true;
                        this.stopActionByTag(1);
                        if(eD.zhuType == 0){//明牌必叫
                            MjClient.playui.clockNumberUpdate(this, 10);
                            MjClient.playui.updateClockPosition(MjClient.clockNode);
                        }else if((eD.zhuType == 1 || eD.zhuType == 2) && eD.isFirstWait == false){//反主10秒
                            MjClient.playui.clockNumberUpdate(this, 10);
                            MjClient.playui.updateClockPosition(MjClient.clockNode, true);
                        }else{
                            MjClient.playui.clockNumberUpdate(this, 5);
                            MjClient.playui.updateClockPosition(MjClient.clockNode, true);
                        }
                    },
                    s2c_dqDiCard: function(){
                        this.stopAllActions();
                        stopEffect(playTimeUpEff);
                        MjClient.clockNode.visible = true;
                        this.stopActionByTag(1);
                        MjClient.playui.clockNumberUpdate(this, 10);
                        MjClient.playui.updateClockPosition(MjClient.clockNode);
                    },
                    s2c_dqJiaoZhu: function(){
                        this.stopAllActions();
                        stopEffect(playTimeUpEff);
                        MjClient.clockNode.visible = false;
                        this.stopActionByTag(1);
                    },
                    roundEnd: function() {
                        this.stopAllActions()
                        stopEffect(playTimeUpEff);
                        playTimeUpEff = null;
                        MjClient.clockNode.visible = false;

                        var pl = getUIPlayer(0);
                        if (pl.winone > 0) {
                            playEffectInPlay("win");
                            playEffectInPlay("win_1");
                        } else if (pl.winone < 0){
                            playEffectInPlay("lose");
                        }
                    },
                    onlinePlayer: function() {
                        //MjClient.clockNode.visible = false;//(MjClient.data.sData.tData.tState == TableState.waitPut || TableState.waitJiaoZhu == tData.tState);
                    },
                    LeaveGame: function() {
                        this.stopAllActions();
                        stopEffect(playTimeUpEff);
                        playTimeUpEff = null;
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

        BtnPutCard: {
            _run: function() {
                this.visible = false;
                setWgtLayout(this, [0.135, 0.128], [0.5, 0.35], [0, 0.4]);
                this.srcX = this.x;
                //MjClient.playui._btnPutCard = this;
            },
            _click: function(btn) {
                //cc.log("BtnPutCard");
                if(!IsTurnToMe()) { return; } // 防止过快点击造成多次出牌
                if(MjClient.selectCards_card.length == 0) {
                    return;
                }
                cardsSort_daQi(MjClient.selectCards_card);
                PutOutCard_card(); //可以出牌
                // MjClient.playui.recoverCannotOutCard();
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
					MjClient.playui.jsBind.BtnShuaiPai._node.visible = false;
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
                    this.stopAllActions();
                    var waitPutFunc = function()
                    {
                        var tData = MjClient.data.sData.tData;
                        if (IsTurnToMe() && tData.tState == TableState.waitPut) {
                            //that.visible = true;
                            MjClient.playui._btnPutCard.visible = true;
                            UpdataCurrentPutCard();

                            if (MjClient.majiang.getRoundFirstCards(tData.putCardsRecord, tData.firstPutCardUid, tData.maxPlayer))
                                MjClient.playui.jsBind.BtnHimt._node.visible = true;

                            // if (tData.isCanShuaiPai && tData.firstPutCardUid == SelfUid())
                            //     MjClient.playui.jsBind.BtnShuaiPai._node.visible = true;

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
                        MjClient.playui.jsBind.BtnShuaiPai._node.visible = false;
                        MjClient.playui.jsBind.BtnHimt._node.visible = false;
                    } else {
                        this.visible = true;

                        if (MjClient.majiang.getRoundFirstCards(tData.putCardsRecord, tData.firstPutCardUid, tData.maxPlayer))
                                MjClient.playui.jsBind.BtnHimt._node.visible = true;

                        if (tData.isCanShuaiPai && tData.firstPutCardUid == SelfUid())
                            MjClient.playui.jsBind.BtnShuaiPai._node.visible = true;

                        MjClient.playui.updateOperateBtnPosition();
                    }
                },
                roundEnd: function(){
                    this.visible = false;
                }

            }
        },
        BtnJiaoZhu: {
            _run: function() {
                this.visible = false;
                setWgtLayout(this, [0.135, 0.128], [0.8, 0.40], [0, 0.5]);
                this.srcX = this.x;
            },
            _click: function(btn) {
                btn.visible = false;
                MjClient.playui._jiaoZhuPanel.visible = true;
            },
            _event: { 
                s2c_dqWaitJiaoZhu: function(eD) {//等待叫主
                    this.visible = false;
                    MjClient.playui.updateJiaoZhuState();
                    MjClient.playui.showWaitTip();
                },

                s2c_dqJiaoZhu: function(eD){//有人叫主
                    cc.log("----------s2c_dqJiaoZhu--------------"+JSON.stringify(eD));
                    this.visible = false;
                    MjClient.playui.updateJiaoZhuState();
                },

                initSceneData: function() {
                    this.visible = false;
                    MjClient.playui.updateJiaoZhuState();
                },

                waitReady: function(){
                    this.visible = false;
                },

                moveHead: function(){
                    this.visible = false;
                },
            }
        },
        BtnHimt: {
            _run: function() {
                this.visible = false;
                setWgtLayout(this, [0.135, 0.128], [0.5, 0.35], [-0.8, 0.4]);

            },
            _click: function(btn) {
                putOutCardTips();
                playEffect("guandan/tishi");
            },
        },
        BtnShuaiPai: {
            _run: function() {
                this.visible = false;
                setWgtLayout(this, [0.135, 0.128], [0.5, 0.40], [-0.8, 0.5]);
            },
            _click: function(btn) {
                var pl = getUIPlayer(0);
                cardsSort_daQi(MjClient.selectCards_card);
                PutOutCard_card();
                btn.visible = false;
            },
        },
        BtnReady: {
            _visible: false,
            _run: function() {
                setWgtLayout(this, [0.18, 0.18], [0.5, 0.23], [0, 0]);
            },
            _click: function(_this) {
                PKPassConfirmToServer_card();
                MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Zhunbei", {uid: SelfUid(), gameType:MjClient.gameType});
            },
            _event: {
                waitReady: function() {
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
                        waitPut: function(msg) {
                            showUserZhuangLogo_daqi(this, 0, msg,true);
                        },
                        s2c_dqJiaoZhu: function(msg) {
                            showUserZhuangLogo_daqi(this, 0, msg,false);
                        },
                        initSceneData: function() {
                            var tData=MjClient.data.sData.tData;
                            showUserZhuangLogo_daqi(this, 0, tData,false);
                        },
                        PKPut: function(eD) {
                            var tData = MjClient.data.sData.tData;
                            if((eD.zhuangFriend && eD.zhuangFriend != -1)||eD.zhuangFriend == 0){
                                tData.zhuangFriend = eD.zhuangFriend;
                                showUserZhuangLogo_daqi(this, 0,eD,false);
                            }
                        },
                        clearCardUI:function() {
                            this.visible = false;
                        },
                        onlinePlayer: function(msg) {
                            if(msg.uid == SelfUid()){
                                this.setVisible(false);
                            }
                        },
                    }
                },
                shouqi: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        s2c_dqJiaoZhu: function() {
                            showUserShouqiLogo_daqi(this, 0);
                        },
                        initSceneData: function() {
                            showUserShouqiLogo_daqi(this, 0);
                        },
                        clearCardUI:function() {
                            this.visible = false;
                        },
                        onlinePlayer: function(msg) {
                            if(msg.uid == SelfUid()){
                                this.setVisible(false);
                            }
                        },
                    }
                },
                mingTag: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        clearCardUI:function() {
                            this.visible = false;
                        },
                        onlinePlayer: function(msg) {
                            if(msg.uid == SelfUid()){
                                this.setVisible(false);
                            }
                        },
                        waitReady: function(){
                            this.visible = false;
                        },
                        moveHead: function(){
                            this.visible = false;
                        },
                    }
                },
                chatbg: {
                    _run: function() {
                        this.getParent().zIndex = 600;
                        this.zIndex = 600;
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
                    },
                },
                _run: function() {
                    //this.zIndex = 600;
                    showFangzhuTagIcon(this, 0);
                },
                score_bg: {
                    _visible: false
                },
                name_bg: {
                    _visible: false
                },
                coin:{
                    _event:{
                        moveHead:function () {
                            this.visible=false;
                        }
                    }
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
                        setWgtLayout(this, [0.070, 0], [0.5, 0.1], [0, 0.62]);
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
                        setWgtLayout(this, [0.047, 0], [0.5, 0.14], [0, 2.7]);
                    else
                        setWgtLayout(this, [0.052, 0], [0.5, 0.14], [0, 1.7]);
                },
                _visible: false
            },
            tishi: {
                _run: function() {
                    this.setLocalZOrder(10);
                    if (MjClient.rePlayVideo == -1)
                        setWgtLayout(this, [0.084, 0.094], [0.4, 0.06], [0, 6]);
                    else
                        setWgtLayout(this, [0.084, 0.094], [0.5, 0.06], [0, 4]);
                },
                _visible: false,
                _event: {
                    s2c_dqZhuaFen: function(){
                        this.stopAllActions();
                        var action = cc.sequence(cc.delayTime(1), cc.callFunc(function() {
                                this.setVisible(false);
                            }, this));
                        this.runAction(action);
                    },
                    PKPut: function(msg){
                        DealCardPromp_daqi(this, msg.uid, 0, true);
                    },
                    s2c_dqJiaoZhu: function(msg){
                        DealJiaoZhuPromp_daqi(this, 0);
                    },
                    waitPut: function(eD) {
                        var tData = MjClient.data.sData.tData;
                        if(tData.putCardsRecord.length == 0){
                            this.visible = false;
                        }
                    },
                    waitReady:function(){
                        this.visible = false;
                    },
                    initSceneData: function(){
                        var pl = getUIPlayer(0);
                        var tData = MjClient.data.sData.tData;
                        if(!tData.putCardsRecord){
                            return;
                        }
                        var roundPutCards = tData.putCardsRecord[tData.putCardsRecord.length - 1];
                        if(pl && roundPutCards && Object.keys(roundPutCards).length > 0 && Object.keys(roundPutCards).length < 5){
                            DealCardPromp_daqi(this, pl.info.uid, 0, false);
                        }

                        if (pl && roundPutCards != null && Object.keys(roundPutCards).length == MjClient.MaxPlayerNum)
                        {
                            this.visible = false;
                        }
                        if(pl && (pl.mjState == TableState.isReady || pl.mjState == TableState.roundFinish))
                        {
                            this.visible = false;
                        }
                    },
                    onlinePlayer: function(msg) {
                        if(msg.uid == SelfUid()){
                            this.setVisible(false);
                        }
                    },
                }
            },
            jiaoFenTag: {
                _run: function() {
                    this.setScale(MjClient.size.width / 1280);
                    this.setPosition(MjClient.playui.jsBind.down.deskCard._node.getPosition());
                },
                _visible: false,
                _event: {
                    // s2c_sdhJiaoFen: function(d) {
                    //     MjClient.playui.showJiaoFenTag(0);
                    // }
                }
            },

            _event: {
                clearCardUI: function() {
                    clearCardUI_card(this, 0);
                },
                initSceneData: function(eD) {
                    SetUserVisible_daQi(this, 0);
                    MjClient.playui.reConnectShowDeskCard();
                },
                addPlayer: function(eD) {
                    SetUserVisible_daQi(this, 0);
                },
                removePlayer: function(eD) {
                    SetUserVisible_daQi(this, 0);
                },
                mjhand: function(eD) {
                    InitUserHandUI_daQi(this, 0, true);
                },
                roundEnd: function() {
                    InitUserCoinAndName(this, 0);
                    //setTaiInfo("");
                },
                PKPut: function(eD) {
                    //cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>PKPut---------------");
                    if(eD.uid != SelfUid() || eD.autoSend || MjClient.rePlayVideo != -1) {
                        DealMJPut_card(this,eD, 0);
                    }
                    var putCards = MjClient.data.sData.tData.lastPutCard;
                    MjClient.playui.CardLayoutDesk(this, putCards, 0);
                    setUserOffline(this, 0);
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
                },
                waitReady: function(){
                    clearCardUI_card(this, 0);
                },
                moveHead: function(){
                    clearCardUI_card(this, 0);
                }, 
            }
        },
        right: {
            head: {
                zhuang: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        waitPut: function(msg) {
                            showUserZhuangLogo_daqi(this, 1,msg,true);
                        },
                        s2c_dqJiaoZhu: function(msg) {
                            showUserZhuangLogo_daqi(this, 1,msg,false);
                        },
                        initSceneData: function() {
                            var tData=MjClient.data.sData.tData;
                            showUserZhuangLogo_daqi(this, 1,tData,false);
                        },
                        PKPut: function(eD) {
                            var tData = MjClient.data.sData.tData;
                            if((eD.zhuangFriend && eD.zhuangFriend != -1)||eD.zhuangFriend == 0){
                                tData.zhuangFriend = eD.zhuangFriend;
                                showUserZhuangLogo_daqi(this, 1,eD,false);
                            }
                        },
                        clearCardUI:function() {
                            this.visible = false;
                        },
                        onlinePlayer: function(msg) {
                            if(msg.uid == SelfUid()){
                                this.setVisible(false);
                            }
                        },
                    }
                },
                shouqi: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        s2c_dqJiaoZhu: function() {
                            showUserShouqiLogo_daqi(this, 1);
                        },
                        initSceneData: function() {
                            showUserShouqiLogo_daqi(this, 1);
                        },
                        clearCardUI:function() {
                            this.visible = false;
                        },
                        onlinePlayer: function(msg) {
                            if(msg.uid == SelfUid()){
                                this.setVisible(false);
                            }
                        },
                    }
                },
                mingTag: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        clearCardUI:function() {
                            this.visible = false;
                        },
                        onlinePlayer: function(msg) {
                            if(msg.uid == SelfUid()){
                                this.setVisible(false);
                            }
                        },
                        waitReady: function(){
                            this.setVisible(false);
                        },
                        moveHead: function(){
                            this.visible = false;
                        },
                    }
                },
                num_zhuafen: {
                    _run: function() {
                        this.setString("");
                        this.ignoreContentAdaptWithSize(true);
                    },
                    _event: {
                        mjhand: function(){
                            showUserZhuaFen_daqi(this, 1);
                        },
                        initSceneData: function() {
                            var tData = MjClient.data.sData.tData;
                            if(tData.tState == TableState.waitReady){
                                this.setString("");
                            }else{
                                showUserZhuaFen_daqi(this, 1);
                            }
                        },
                        s2c_dqZhuaFen: function(msg){
                            showUserZhuaFen_daqi(this, 1);
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
                    }
                },
                chatbg: {
                    _run: function() {
                        this.getParent().zIndex = 500;
                        this.zIndex = 500;
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
                score_bg: {
                    _visible: false,
                    _run: function() {
                        if (MjClient.rePlayVideo != -1)
                            this.setOpacity(255);
                    }
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
                _run: function() {
                    if (MjClient.rePlayVideo == -1) // 表示正常游戏
                        setWgtLayout(this, [0.047, 0], [1, 0.55], [-3.7, 0.55]);
                    else
                        setWgtLayout(this, [0.052, 0], [1, 0.55], [-4.7, 0.10]);
                },
                _visible: false
            },
            tishi: {
                _run: function() {
                    this.setLocalZOrder(10);
                    setWgtLayout(this, [0.084, 0.094], [0.97, 0.06], [-2.8, 7]);
                },
                _visible: false,
                _event: {
                    s2c_dqZhuaFen: function(){
                        this.stopAllActions();
                        var action = cc.sequence(cc.delayTime(1), cc.callFunc(function() {
                                this.setVisible(false);
                            }, this));
                        this.runAction(action);
                    },
                    PKPut: function(msg){
                        DealCardPromp_daqi(this, msg.uid, 1, true);
                    },
                    s2c_dqJiaoZhu: function(msg){
                        DealJiaoZhuPromp_daqi(this, 1);
                    },
                    waitPut: function(eD) {
                        var tData = MjClient.data.sData.tData;
                        if(tData.putCardsRecord.length == 0){
                            this.visible = false;
                        }
                    },
                    initSceneData: function(){
                        var pl = getUIPlayer(1);
                        var tData = MjClient.data.sData.tData;
                        var roundPutCards = null;
                        var uids = null;
                        if(tData.putCardsRecord){
                            roundPutCards = tData.putCardsRecord[tData.putCardsRecord.length - 1];
                        }
                        if(pl && roundPutCards != null && Object.keys(roundPutCards).length > 0 && Object.keys(roundPutCards).length < 5){
                            DealCardPromp_daqi(this, pl.info.uid, 1, false);
                        }

                        if (pl && roundPutCards != null && Object.keys(roundPutCards).length == MjClient.MaxPlayerNum)
                        {
                            this.visible = false;
                        }
                        if(pl && (pl.mjState == TableState.isReady || pl.mjState == TableState.roundFinish))
                        {
                            this.visible = false;
                        }
                    },
                    waitReady:function(){
                        this.visible = false;
                    },
                    onlinePlayer: function(msg) {
                        if(msg.uid == SelfUid()){
                            this.setVisible(false);
                        }
                    },
                }
            },
            jiaoFenTag: {
                _run: function() {
                    this.setScale(MjClient.size.width / 1280);
                    this.setPosition(MjClient.playui.jsBind.right.deskCard._node.getPosition());
                },
                _visible: false,
                _event: {
                    // s2c_sdhJiaoFen: function(msg) {
                    //     MjClient.playui.showJiaoFenTag(1);
                    // }
                }
            },
            _event: {
                clearCardUI: function() {
                    clearCardUI_card(this, 1);
                },
                initSceneData: function(eD) {
                    SetUserVisible_daQi(this, 1);
                },
                addPlayer: function(eD) {
                    SetUserVisible_daQi(this, 1);
                },
                removePlayer: function(eD) {
                    SetUserVisible_daQi(this, 1);
                },
                mjhand: function(eD) {
                    InitUserHandUI_daQi(this, 1, true);
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
                        waitPut: function(msg) {
                            showUserZhuangLogo_daqi(this, 2,msg,true);
                        },
                        s2c_dqJiaoZhu: function(msg) {
                            showUserZhuangLogo_daqi(this, 2,msg,false);
                        },
                        initSceneData: function() {
                            var tData=MjClient.data.sData.tData;
                            showUserZhuangLogo_daqi(this, 2,tData,false);
                        },
                        PKPut: function(eD) {
                            var tData = MjClient.data.sData.tData;
                            if((eD.zhuangFriend && eD.zhuangFriend != -1)||eD.zhuangFriend == 0){
                                tData.zhuangFriend = eD.zhuangFriend;
                                showUserZhuangLogo_daqi(this, 2,eD,false);
                            }
                        },
                        clearCardUI:function() {
                            this.visible = false;
                        },
                        onlinePlayer: function(msg) {
                            if(msg.uid == SelfUid()){
                                this.setVisible(false);
                            }
                        },
                    }
                },
                shouqi: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        s2c_dqJiaoZhu: function() {
                            showUserShouqiLogo_daqi(this, 2);
                        },
                        initSceneData: function() {
                            showUserShouqiLogo_daqi(this, 2);
                        },
                        clearCardUI:function() {
                            this.visible = false;
                        },
                        onlinePlayer: function(msg) {
                            if(msg.uid == SelfUid()){
                                this.setVisible(false);
                            }
                        },
                    }
                },
                mingTag: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        clearCardUI:function() {
                            this.visible = false;
                        },
                        onlinePlayer: function(msg) {
                            if(msg.uid == SelfUid()){
                                this.setVisible(false);
                            }
                        },
                        waitReady: function(){
                            this.setVisible(false);
                        },
                        moveHead: function(){
                            this.visible = false;
                        },
                    }
                },
                num_zhuafen: {
                    _run: function() {
                        this.setString("");
                        this.ignoreContentAdaptWithSize(true);
                    },
                    _event: {
                        mjhand: function(){
                            showUserZhuaFen_daqi(this, 2);
                        },
                        initSceneData: function() {
                            var tData = MjClient.data.sData.tData;
                            if(tData.tState == TableState.waitReady){
                                this.setString("");
                            }else{
                                showUserZhuaFen_daqi(this, 2);
                            }
                        },
                        s2c_dqZhuaFen: function(){
                            showUserZhuaFen_daqi(this, 2);
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
                    }
                },
                chatbg: {
                    _run: function() {
                        this.getParent().zIndex = 500;
                        this.zIndex = 500;
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
                score_bg: {
                    _visible: false,
                    _run: function() {
                        if (MjClient.rePlayVideo != -1)
                            this.setOpacity(255);
                    }
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
                    [1, 4]
                ],
                _run: function() {
                    //setWgtLayout(this, [0.084, 0.094], [0.5, 0.5], [2, 3]);
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
                        cc.log("----------------onlinePlayer1111-----------------");
                        GetReadyVisible(this, 2);
                    }
                }
            },
            stand: {
                _run: function() {
                    // setWgtLayout(this, [0, 0.13 * 0.6], [0.66, 0.8], [0, -0.32]);
                    // //cc.log('this===============this:'+JSON.stringify(this.getPosition()))
                    // this.setVisible(false);
                    if(MjClient.MaxPlayerNum == 5)
                    {
                        setWgtLayout(this, [0, 0.13 * 0.6], [0.66, 0.8], [0, -0.32]);
                    }
                    else
                    {

                        setWgtLayout(this, [0, 0.13 * 0.6], [0.5, 0.8], [0, -0.32]);
                    }
                    this.setVisible(false);
                },
            },
            deskCard: {
                _run: function() {
                    if (MjClient.rePlayVideo == -1)
                    {
                        if(MjClient.MaxPlayerNum == 5)
                        {
                            setWgtLayout(this, [0.047, 0], [0.78, 0.7], [0, 0.6]);
                        }
                        else
                        {
                            setWgtLayout(this, [0.047, 0], [0.5, 0.7], [0, 0.6]);
                        }
                    }
                    else
                    {
                        if(MjClient.MaxPlayerNum == 5)
                        {
                            setWgtLayout(this, [0.052, 0], [0.68, 0.65], [0, 0.2]);
                        }
                        else
                        {
                            setWgtLayout(this, [0.052, 0], [0.6, 0.65], [0, 0.2]);
                        }
                    }
                    this.setVisible(false);
                },
            },
            tishi: {
                _run: function() {
                    this.setLocalZOrder(10);
                    if (MjClient.rePlayVideo == -1)
                    {
                        if(MjClient.MaxPlayerNum == 4)
                        {
                            setWgtLayout(this, [0.084, 0.094], [0.59, 0.72], [0, 0.6]);
                        }
                        else {
                            setWgtLayout(this, [0.084, 0.094], [0.67, 0.72], [0, 0.6]);
                        }
                    }
                    else
                        setWgtLayout(this, [0.084, 0.094], [0.67, 0.67], [0, 0]);
                },
                _visible: false,
                _event: {
                    s2c_dqZhuaFen: function(){
                        this.stopAllActions();
                        var action = cc.sequence(cc.delayTime(1), cc.callFunc(function() {
                                this.setVisible(false);
                            }, this));
                        this.runAction(action);
                    },
                    PKPut: function(msg){
                        DealCardPromp_daqi(this, msg.uid, 2, true);
                    },
                    s2c_dqJiaoZhu: function(msg){
                        DealJiaoZhuPromp_daqi(this, 2);
                    },
                    waitPut: function(eD) {
                        var tData = MjClient.data.sData.tData;
                        if(tData.putCardsRecord.length == 0){
                            this.visible = false;
                        }
                    },
                    waitReady:function(){
                        this.visible = false;
                    },
                    initSceneData: function(){
                        var pl = getUIPlayer(2);
                        var tData = MjClient.data.sData.tData;
                        if(!tData.putCardsRecord){
                            return;
                        }
                        var roundPutCards = tData.putCardsRecord[tData.putCardsRecord.length - 1];
                        if(pl && roundPutCards && Object.keys(roundPutCards).length > 0 && Object.keys(roundPutCards).length < 5){
                            DealCardPromp_daqi(this, pl.info.uid, 2, false);
                        }
                        if (pl && roundPutCards != null && Object.keys(roundPutCards).length == MjClient.MaxPlayerNum)
                        {
                            this.visible = false;
                        }
                        if(pl && (pl.mjState == TableState.isReady || pl.mjState == TableState.roundFinish))
                        {
                            this.visible = false;
                        }
                    },
                    onlinePlayer: function(msg) {
                        if(msg.uid == SelfUid()){
                            this.setVisible(false);
                        }
                    },
                }
            },
            jiaoFenTag: {
                _run: function() {
                    this.setScale(MjClient.size.width / 1280);
                    this.setPosition(MjClient.playui.jsBind.top.deskCard._node.getPosition());
                    this.setVisible(false);
                },
                _event: {
                    // s2c_sdhJiaoFen: function(msg) {
                    //     MjClient.playui.showJiaoFenTag(2);
                    // }
                }
            },
            _event: {
                clearCardUI: function() {
                    clearCardUI_card(this, 2);
                },
                initSceneData: function(eD) {
                    SetUserVisible_daQi(this, 2);
                },
                addPlayer: function(eD) {
                    SetUserVisible_daQi(this, 2);
                },
                removePlayer: function(eD) {
                    SetUserVisible_daQi(this, 2);
                },
                mjhand: function(eD) {
                    InitUserHandUI_daQi(this, 2, true);
                    cc.log('this======top1111111111=========this:'+JSON.stringify(this.getChildByName('stand').getPosition()));
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
                },
                onlinePlayer: function(eD) {
                    setUserOffline(this, 2);
                },
                playerStatusChange: function(eD) {
                    setUserOffline(this, 2);
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
                        waitPut: function(msg) {
                            showUserZhuangLogo_daqi(this, 3,msg,true);
                        },
                        s2c_dqJiaoZhu: function(msg) {
                            showUserZhuangLogo_daqi(this, 3,msg,false);
                        },
                        initSceneData: function() {
                            var tData=MjClient.data.sData.tData;
                            showUserZhuangLogo_daqi(this, 3,tData,false);
                        },
                        PKPut: function(eD) {
                            var tData = MjClient.data.sData.tData;
                            if((eD.zhuangFriend && eD.zhuangFriend != -1)||eD.zhuangFriend == 0){
                                tData.zhuangFriend = eD.zhuangFriend;
                                showUserZhuangLogo_daqi(this, 3,eD,false);
                            }
                        },
                        clearCardUI:function() {
                            this.visible = false;
                        },
                        onlinePlayer: function(msg) {
                            if(msg.uid == SelfUid()){
                                this.setVisible(false);
                            }
                        },
                    }
                },
                shouqi: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        s2c_dqJiaoZhu: function() {
                            showUserShouqiLogo_daqi(this, 3);
                        },
                        initSceneData: function() {
                            showUserShouqiLogo_daqi(this, 3);
                        },
                        clearCardUI:function() {
                            this.visible = false;
                        },
                        onlinePlayer: function(msg) {
                            if(msg.uid == SelfUid()){
                                this.setVisible(false);
                            }
                        },
                    }
                },
                mingTag: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        clearCardUI:function() {
                            this.visible = false;
                        },
                        onlinePlayer: function(msg) {
                            if(msg.uid == SelfUid()){
                                this.setVisible(false);
                            }
                        },
                        waitReady: function(){
                            this.setVisible(false);
                        },
                        moveHead: function(){
                            this.visible = false;
                        },
                    }
                },
                num_zhuafen: {
                    _run: function() {
                        this.setString("");
                        this.ignoreContentAdaptWithSize(true);
                    },
                    _event: {
                        mjhand: function(){
                            showUserZhuaFen_daqi(this, 3);
                        },
                        initSceneData: function() {
                            var tData = MjClient.data.sData.tData;
                            if(tData.tState == TableState.waitReady){
                                this.setString("");
                            }else{
                                showUserZhuaFen_daqi(this, 3);
                            }
                        },
                        s2c_dqZhuaFen: function(msg){
                            showUserZhuaFen_daqi(this, 3);
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
                    }
                },
                chatbg: {
                    _run: function() {
                        this.getParent().zIndex = 500;
                        this.zIndex = 500;
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
                score_bg: {
                    _visible: false,
                    _run: function() {
                        if (MjClient.rePlayVideo != -1)
                            this.setOpacity(255);
                    }
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
                _run: function() {
                    setWgtLayout(this, [0, 0.13 * 0.6], [0.34, 0.8], [0, -0.32]);
                    this.setVisible(false);
                }
            },
            deskCard: {
                _run: function() {
                    if (MjClient.rePlayVideo == -1)
                        setWgtLayout(this, [0.047, 0], [0.22, 0.7], [0, 0.6]);
                    else
                        setWgtLayout(this, [0.052, 0], [0.3, 0.65], [0, 0.2]);
                },
                _visible: false,
            },
            tishi: {
                _run: function() {
                    this.setLocalZOrder(10);
                    if (MjClient.rePlayVideo == -1)
                        setWgtLayout(this, [0.084, 0.094], [0.33, 0.72], [0, 0.6]);
                    else
                        setWgtLayout(this, [0.084, 0.094], [0.33, 0.67], [0, 0]);
                },
                _visible: false,
                _event: {
                    s2c_dqZhuaFen: function(){
                        this.stopAllActions();
                        var action = cc.sequence(cc.delayTime(1), cc.callFunc(function() {
                                this.setVisible(false);
                            }, this));
                        this.runAction(action);
                    },
                    PKPut: function(msg){
                        DealCardPromp_daqi(this, msg.uid, 3, true);
                    },
                    s2c_dqJiaoZhu: function(msg){
                        DealJiaoZhuPromp_daqi(this, 3);
                    },
                    waitPut: function(eD) {
                        var tData = MjClient.data.sData.tData;
                        if(tData.putCardsRecord.length == 0){
                            this.visible = false;
                        }
                    },
                    waitReady:function(){
                        this.visible = false;
                    },
                    initSceneData: function(){
                        var pl = getUIPlayer(3);
                        var tData = MjClient.data.sData.tData;
                        if(!tData.putCardsRecord){
                            return;
                        }
                        var roundPutCards = tData.putCardsRecord[tData.putCardsRecord.length - 1];
                        if(pl && roundPutCards && Object.keys(roundPutCards).length > 0 && Object.keys(roundPutCards).length < 5){
                            DealCardPromp_daqi(this, pl.info.uid, 3, false);
                        }
                        if (pl && roundPutCards != null && Object.keys(roundPutCards).length == MjClient.MaxPlayerNum)
                        {
                            this.visible = false;
                        }
                        if(pl && (pl.mjState == TableState.isReady || pl.mjState == TableState.roundFinish))
                        {
                            this.visible = false;
                        }
                    },
                    onlinePlayer: function(msg) {
                        if(msg.uid == SelfUid()){
                            this.setVisible(false);
                        }
                    },
                }
            },
            jiaoFenTag: {
                _run: function() {
                    this.setScale(MjClient.size.width / 1280);
                    this.setPosition(MjClient.playui.jsBind.left.deskCard._node.getPosition());
                },
                _visible: false,
                _event: {
                    // s2c_sdhJiaoFen: function(msg) {
                    //     MjClient.playui.showJiaoFenTag(3);
                    // }
                }
            },
            _event: {
                clearCardUI: function() {
                    clearCardUI_card(this, 3);
                },
                initSceneData: function(eD) {
                    SetUserVisible_daQi(this, 3);
                },
                addPlayer: function(eD) {
                    SetUserVisible_daQi(this, 3);
                },
                removePlayer: function(eD) {
                    SetUserVisible_daQi(this, 3);
                },
                mjhand: function(eD) {
                    InitUserHandUI_daQi(this, 3, true);
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
                },
                onlinePlayer: function(eD) {
                    setUserOffline(this, 3);
                },
                playerStatusChange: function(eD) {
                    setUserOffline(this, 3);
                }
            },
        },
        fifth: {
            head: {
                zhuang: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        waitPut: function(msg) {
                            showUserZhuangLogo_daqi(this, 4,msg,true);
                        },
                        s2c_dqJiaoZhu: function(msg) {
                            showUserZhuangLogo_daqi(this, 4,msg,false);
                        },
                        initSceneData: function() {
                            var tData=MjClient.data.sData.tData;
                            showUserZhuangLogo_daqi(this, 4,tData,false);
                        },
                        PKPut: function(eD) {
                            var tData = MjClient.data.sData.tData;
                            if((eD.zhuangFriend && eD.zhuangFriend != -1)||eD.zhuangFriend == 0){
                                tData.zhuangFriend = eD.zhuangFriend;
                                showUserZhuangLogo_daqi(this, 4,eD,false);
                            }
                        },
                        clearCardUI:function() {
                            this.visible = false;
                        },
                        onlinePlayer: function(msg) {
                            if(msg.uid == SelfUid()){
                                this.setVisible(false);
                            }
                        },
                    }
                },
                shouqi: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        s2c_dqJiaoZhu: function() {
                            showUserShouqiLogo_daqi(this, 4);
                        },
                        initSceneData: function() {
                            showUserShouqiLogo_daqi(this, 4);
                        },
                        clearCardUI:function() {
                            this.visible = false;
                        },
                        onlinePlayer: function(msg) {
                            if(msg.uid == SelfUid()){
                                this.setVisible(false);
                            }
                        },
                    }
                },
                mingTag: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        clearCardUI:function() {
                            this.visible = false;
                        },
                        onlinePlayer: function(msg) {
                            if(msg.uid == SelfUid()){
                                this.setVisible(false);
                            }
                        },
                        waitReady: function(){
                            this.setVisible(false);
                        },
                        moveHead: function(){
                            this.visible = false;
                        },
                    }
                },
                num_zhuafen: {
                    _run: function() {
                        this.setString("");
                        this.ignoreContentAdaptWithSize(true);
                    },
                    _event: {
                        mjhand: function(){
                            showUserZhuaFen_daqi(this, 4);
                        },
                        initSceneData: function() {
                            var tData = MjClient.data.sData.tData;
                            if(tData.tState == TableState.waitReady){
                                this.setString("");
                            }else{
                                showUserZhuaFen_daqi(this, 4);
                            }
                        },
                        s2c_dqZhuaFen: function(msg){
                            showUserZhuaFen_daqi(this, 4);
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
                    }
                },
                chatbg: {
                    _run: function() {
                        this.getParent().zIndex = 500;
                        this.zIndex = 500;
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
                score_bg: {
                    _visible: false,
                    _run: function() {
                        if (MjClient.rePlayVideo != -1)
                            this.setOpacity(255);
                    }
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
                    [-1, 0.7]
                ],
                _run: function() {
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
                _layout: [
                    [0, 0.13*0.9],
                    [0, 1],
                    [2.9, -0.7]
                ],
                _visible: false,
            },
            deskCard: {
                _run: function() {
                    if (MjClient.rePlayVideo == -1)
                        setWgtLayout(this, [0.047, 0], [0, 0.55], [3.2, 0.55]);
                    else
                        setWgtLayout(this, [0.052, 0], [0, 0.55], [5.0, 0.10]);
                },
                _visible: false,
            },
            tishi: {
                _run: function() {
                    this.setLocalZOrder(10);
                    setWgtLayout(this, [0.084, 0.094], [0, 0.06], [2.8, 7]);
                },
                _visible: false,
                _event: {
                    s2c_dqZhuaFen: function(){
                        this.stopAllActions();
                        var action = cc.sequence(cc.delayTime(1), cc.callFunc(function() {
                                this.setVisible(false);
                            }, this));
                        this.runAction(action);
                    },
                    PKPut: function(msg){
                        DealCardPromp_daqi(this, msg.uid, 4, true);
                    },
                    s2c_dqJiaoZhu: function(msg){
                        DealJiaoZhuPromp_daqi(this, 4);
                    },
                    waitPut: function(eD) {
                        var tData = MjClient.data.sData.tData;
                        if(tData.putCardsRecord.length == 0){
                            this.visible = false;
                        }
                    },
                    waitReady:function(){
                        this.visible = false;
                    },
                    initSceneData: function(){
                        var pl = getUIPlayer(4);
                        var tData = MjClient.data.sData.tData;
                        if(!tData.putCardsRecord){
                            return;
                        }
                        var roundPutCards = tData.putCardsRecord[tData.putCardsRecord.length - 1];
                        if(pl && roundPutCards && Object.keys(roundPutCards).length > 0 && Object.keys(roundPutCards).length < 5){
                            DealCardPromp_daqi(this, pl.info.uid, 4, false);
                        }
                        if (pl && roundPutCards != null && Object.keys(roundPutCards).length == MjClient.MaxPlayerNum)
                        {
                            this.visible = false;
                        }
                        if(pl && (pl.mjState == TableState.isReady || pl.mjState == TableState.roundFinish))
                        {
                            this.visible = false;
                        }
                    },
                    onlinePlayer: function(msg) {
                        if(msg.uid == SelfUid()){
                            this.setVisible(false);
                        }
                    },

                }
            },
            jiaoFenTag: {
                _run: function() {
                    this.setScale(MjClient.size.width / 1280);
                    this.setPosition(MjClient.playui.jsBind.left.deskCard._node.getPosition());
                },
                _visible: false,
                _event: {
                    // s2c_sdhJiaoFen: function(msg) {
                    //     MjClient.playui.showJiaoFenTag(4);
                    // }
                }
            },
            _event: {
                clearCardUI: function() {
                    clearCardUI_card(this, 4);
                },
                initSceneData: function(eD) {
                    SetUserVisible_daQi(this, 4);
                },
                addPlayer: function(eD) {
                    SetUserVisible_daQi(this, 4);
                },
                removePlayer: function(eD) {
                    SetUserVisible_daQi(this, 4);
                },
                mjhand: function(eD) {
                    InitUserHandUI_daQi(this, 4, true);
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
                },
                onlinePlayer: function(eD) {
                    setUserOffline(this, 4);
                },
                playerStatusChange: function(eD) {
                    setUserOffline(this, 4);
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
            fanZhuWaitTip: {
                _visible: false,
            },
            touXiangWaitTip: {
                _visible: false,
            },
            touXiangContinueTip: {
                _visible: false,
            },
            BtnMaiPai: {
                _visible: false,
            },
            BtnTouXiang: {
                _visible: false,
            },
            BtnShangYiLun: {
                _visible: false,
                _run: function() {
                    this.srcX = this.x;
                },
                _click: function() {
                    MjClient.playui.showShangYiLunPanel(MjClient.playui.shangYiLunPanel);
                    MjClient.playui.jsBind.panel.touchLayer._node.setTouchEnabled(true);
                }
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
                    // cc.log("--------------touchLayer--------------");
                    // if (panel.getChildByName("jiaoZhuPanel").isVisible())
                    // {
                    //     panel.getChildByName("jiaoZhuPanel").setVisible(false);
                    // }
                    panel.getChildByName("diPaiPanel").visible = false;
                    btn.setTouchEnabled(false);
                },
            },
            jiaoFenPanel: {
                _visible: false,
            },
            jiaoZhuPanel: {
                _visible: false,
                _run: function() {
                    var tData = MjClient.data.sData.tData;
                    this.btnMing = this.getChildByName("btnMing");
                    this.btnHeiT = this.getChildByName("btnHeiT");
                    this.btnHongT = this.getChildByName("btnHongT");
                    this.btnMh = this.getChildByName("btnMh");
                    this.btnFk = this.getChildByName("btnFk");
                    this.btnJiao1 = this.getChildByName("btnJiao1");
                    this.btnJiao2 = this.getChildByName("btnJiao2");
                    if(tData.areaSelectMode.fanpai == false){
                        this.btnMing.visible = false;
                        this.btnHeiT.x = this.btnHeiT.x - 70;
                        this.btnHongT.x = this.btnHongT.x - 70;
                        this.btnMh.x = this.btnMh.x - 70;
                        this.btnFk.x = this.btnFk.x - 70;
                        MjClient.playui._jiaoZhuBack.setScaleX(0.85);
                    }
                    MjClient.playui.initJiaoZhuPanel_DaQi();
                },
                btnMing: {
                    _run: function() {
                    },
                    _click: function(btn) {
                        var tData = MjClient.data.sData.tData;
                        MjClient.playui.DealJiaoZhuBtn_DaQi(btn, tData.mcTransValue);
                    },
                    _event: {

                    },
                },
                btnHeiT: {
                    _run: function() {
                    },
                    _click: function(btn) {
                        MjClient.playui.DealJiaoZhuBtn_DaQi(btn, 28);
                    },
                    _event: {
                    },
                },
                btnHongT: {
                    _run: function() {
                    },
                    _click: function(btn) {
                        MjClient.playui.DealJiaoZhuBtn_DaQi(btn, 27);
                    },
                    _event: {
                    },
                },
                btnMh: {
                    _run: function() {
                    },
                    _click: function(btn) {
                        MjClient.playui.DealJiaoZhuBtn_DaQi(btn, 26);
                    },
                    _event: {
                    },
                },
                btnFk: {
                    _run: function() {
                    },
                    _click: function(btn) {
                        MjClient.playui.DealJiaoZhuBtn_DaQi(btn, 25);
                    },
                    _event: {
                    },
                },
                btnJiao1: {
                    _run: function() {
                    },
                    _click: function(btn){
                        if(MjClient.playui.currentSelectHuaBtn == null || MjClient.playui.currentSelectHuaValue == -1){
                            return;
                        }
                        var _value = MjClient.playui.currentSelectHuaValue;
                        MjClient.gamenet.request("pkroom.handler.tableMsg", {
                            cmd: "c2s_dqJiaoZhu",
                            card: _value,
                            isfrist: false,
                            isfanzhu: false
                        });
                    },
                    _event: {
                    },
                },
                btnJiao2: {
                    _run: function() {
                    },
                    _click: function(btn){
                        if(MjClient.playui.currentSelectHuaBtn == null || MjClient.playui.currentSelectHuaValue == -1){
                            return;
                        }
                        var _value = MjClient.playui.currentSelectHuaValue;
                        MjClient.gamenet.request("pkroom.handler.tableMsg", {
                            cmd: "c2s_dqJiaoZhu",
                            card: _value,
                            isfrist: false,
                            isfanzhu: true
                        });
                    },
                    _event: {
                    },
                },
                jiaoZhuBack:{
                    _event: {
                        mjhand: function () {
                            this.setScaleY(0.85);
                        }
                    }
                },
                titleImg:{
                    _event: {
                        mjhand: function () {
                            this.setPosition(428.82, 381.91);
                        }
                    }
                },
                _event: {
                    waitReady: function(){
                        if(this.isVisible()){
                            this.visible = false;
                            MjClient.playui.initJiaoZhuPanel_DaQi();
                        }
                    },
                    s2c_dqWaitJiaoZhu: function(eD) {//等待叫主
                        MjClient.playui.updateJiaoZhuState();
                        MjClient.playui.showWaitTip()
                    },
                    s2c_dqJiaoZhu: function(){
                        if(this.isVisible()){
                            this.visible = false;
                            MjClient.playui.initJiaoZhuPanel_DaQi();
                        }
                    },
                    s2c_dqDiCard: function(){
                        if(this.isVisible()){
                            this.visible = false;
                            MjClient.playui.initJiaoZhuPanel_DaQi();
                        }
                    },
                    moveHead: function(){
                        this.visible = false;
                        MjClient.playui.initJiaoZhuPanel_DaQi();
                    },
                    initSceneData: function() {
                        MjClient.playui.updateJiaoZhuState();
                    },
                },
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
                        MjClient.playui.jsBind.panel.BtnTouXiang._node.y -= 100;
                        MjClient.playui.jsBind.panel.BtnMaiPai._node.y -= 100;
                        MjClient.playui.jsBind.panel.jiaoFenWaitTip._node.y -= 100;
                        MjClient.playui.jsBind.panel.maiPaiWaitTip._node.y -= 100;
                        MjClient.playui.jsBind.panel.jiaoZhuWaitTip._node.y -= 100;
                        MjClient.playui.jsBind.panel.touXiangWaitTip._node.y -= 100;
                        MjClient.playui.jsBind.panel.touXiangContinueTip._node.y -= 100;
                        MjClient.playui.jsBind.BtnPutCard._node.y -= 50;
                        MjClient.playui.jsBind.BtnShuaiPai._node.y -= 50;
                        MjClient.playui.jsBind.BtnHimt._node.y -= 50;
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

                    MjClient.playui._btnChaPai.x = MjClient.playui._btnChaPai.srcX;
                    MjClient.playui._btnShangYiLun.x = MjClient.playui._btnShangYiLun.srcX;
                },
                s2c_dqDiCard:function(msg) {//发8张底牌
                    cc.log("---------------s2c_dqDiCard--------------");
                    var pl = getUIPlayer(0);
                    if(pl && MjClient.playui.currentCardNum != pl.mjhand.length){//发底牌，客户端还未发完牌,则需延时发底牌
                        MjClient.playui.isDicardDelay = true;
                    }else{
                        MjClient.playui.isDicardDelay = false;
                        MjClient.playui.isDeal = false;
                        dealDicard_daqi();
                    }
                    if(MjClient.rePlayVideo!=-1)
                    {
                        this.visible = true;
                        MjClient.playui.jsBind.panel.BtnMaiPai._node.setVisible(false);
                        // MjClient.playui.updateRePlayVideoJiaoZhu(msg);
                    }
                },
                s2c_dqJiaoZhu: function(d) {
                    var tData = MjClient.data.sData.tData;
                    if (tData.zhuPaiType != null && tData.zhuPaiType != -1) {

                        for (var i = 0; i < 5; i ++)    // 回放时四个玩家都有手牌
                        {
                            var node = getNode_cards(i);
                            var children = node.children;
                            for (var j = 0; j < children.length; j++) {
                                var ci = children[j];
                                if (ci.name == "mjhand" || ci.name == "mjhand_replay") {
                                    MjClient.playui.setCardSprite_ZhuTag(ci);
                                }
                            }
                        }

                        // if (tData.zhuPaiType != -1 && getCurrentVoiceType() != 0)
                        //     playEffectInPlay(["fangkuai", "meihua", "hongtao", "heitao", "wu"][tData.zhuPaiType]);
                    }
                    var playerNode = getNode_cards(0);
                    MjClient.playui.CardLayoutRestore(playerNode, 0);
                },
                s2c_dqMaiPai: function(d) {
                    if (MjClient.rePlayVideo != -1)
                    {
                        MjClient.selectCards_card = [];
                        MjClient.colloctionCurrentSelcetUIArray = [];
                        MjClient.playui.jsBind.panel.BtnMaiPai._node.setVisible(false);
                        //MjClient.playui.jsBind.panel.BtnTouXiang._node.setVisible(false);
                    }
                    MjClient.playui.showMaiPaiBtn(true);
                    MjClient.playui.showWaitTip();
                    MjClient.playui.removeMaiPaiFromHand();
                },
                s2c_sdhTouXiang: function(d) {
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    var pl = sData.players[d.uid];
                    pl.isAgreeTouXiang = d.isAgreeTouXiang;

                    MjClient.playui.showWaitTip();
                    if (d.uid == tData.uids[tData.zhuang]) {
                        MjClient.playui.showTouXuangDialog();
                    } else if (pl.isAgreeTouXiang == 0 && MjClient.playui.touXuangDialog && sys.isObjectValid(MjClient.playui.touXuangDialog)) {
                        MjClient.playui.touXuangDialog.removeFromParent(true);
                        MjClient.playui.touXuangDialog = null;
                    }
                },
            }
        },
        home_info:{
            _layout: [
                [1, 1],
                [0.5, 0.0435],
                [0.01, 0.0]
            ],
            cardBanner: {
                // _layout: [
                //     [0.312 * 1.2, 0.128 * 1],
                //     [0.65, 0.1],
                //     [0, 0]
                // ],

                bg: {
                    _run: function() {
                        this.ignoreContentAdaptWithSize(true);
                        var tData = MjClient.data.sData.tData;
                        this.visible = tData.areaSelectMode.fanpai;
                    },
                },
                bg_wufp: {
                    _run: function() {
                        this.ignoreContentAdaptWithSize(true);
                        var tData = MjClient.data.sData.tData;
                        this.visible = !tData.areaSelectMode.fanpai;
                    },
                    _event: {

                    }
                },
                num_jiao: {
                    _run: function() {
                        this.setString("x0");
                        this.ignoreContentAdaptWithSize(true);
                    },
                    _event: {
                        s2c_dqJiaoZhu: function(d) {
                            var tData = MjClient.data.sData.tData;
                            if(tData.zhuType == 1 || tData.zhuType == 2){
                                this.setString("x1");
                            }else if(tData.zhuType == 3 || tData.zhuType == 4){
                                this.setString("x2");
                            }else{
                                this.setString("x0");
                            }
                        },
                        initSceneData: function() {
                            var tData = MjClient.data.sData.tData;
                            if(tData.zhuType == 1 || tData.zhuType == 2){
                                this.setString("x1");
                            }else if(tData.zhuType == 3 || tData.zhuType == 4){
                                this.setString("x2");
                            }else{
                                this.setString("x0");
                            }
                        },
                        clearCardUI:function() {
                            this.setString("x0");
                        },
                        onlinePlayer: function(msg) {
                            if(msg.uid == SelfUid()){
                                this.setString("x0");
                            }
                        },
                    }
                },
                text_ming: {
                    _run: function() {
                        this.ignoreContentAdaptWithSize(true);
                        var tData = MjClient.data.sData.tData;
                        this.visible = tData.areaSelectMode.fanpai;
                    }
                },
                card_di: {
                    _run: function() {
                        this.ignoreContentAdaptWithSize(true);
                        var tData = MjClient.data.sData.tData;
                        if (tData.zhuang > -1 && 0 == getOffByIndex(tData.zhuang)){
                            this.visible=true;
                        }else{
                            this.visible=false;
                        }
                    },
                    _click: function() {
                        var tData = MjClient.data.sData.tData;
                        if (tData.zhuang > -1 && 0 == getOffByIndex(tData.zhuang) && tData.diPaiArr && tData.diPaiArr.length > 0){
                            MjClient.playui.showDiPaiPanel(MjClient.playui.diPaiPanel);
                        }else{
                            return;
                        }
                    },
                    _event: {
                        mjhand: function(){
                            this.setTouchEnabled(true);
                            var tData = MjClient.data.sData.tData;
                            if (tData.zhuang > -1 && 0 == getOffByIndex(tData.zhuang)){
                                this.visible=true;
                            }else{
                                this.visible=false;
                            }
                        },
                        initSceneData: function() {
                            this.setTouchEnabled(true);
                            var tData = MjClient.data.sData.tData;
                            if (tData.zhuang > -1 && 0 == getOffByIndex(tData.zhuang)){
                                this.visible=true;
                            }else{
                                this.visible=false;
                            }
                        },
                        waitPut:function(){
                            var tData = MjClient.data.sData.tData;
                            if (tData.zhuang > -1 && 0 == getOffByIndex(tData.zhuang)){
                                this.visible=true;
                            }else{
                                this.visible=false;
                            }
                        },
                        clearCardUI:function() {
                            this.visible=false;
                            this.setTouchEnabled(false);
                        },
                    }
                },
                card_jiao: {
                    _run: function() {
                        this.ignoreContentAdaptWithSize(true);
                    },
                    _event: {
                        s2c_dqJiaoZhu: function(d) {
                            var tData = MjClient.data.sData.tData;
                            var startPoint = cc.p(-8.88, 47.72);
                            var delay = 1;
                            if(MjClient.rePlayVideo != -1)
                            {
                                delay = 2;
                            }
                            if (tData.zhuValue){
                                this.setScale(1);
                                //this.setPosition(MjClient.playui.width/1.4, -135);
                                this.stopAllActions();
                                this.setPosition(-246, 525);
                                this.removeAllChildren();
                                setCardSprite_card(this,tData.zhuValue,false);
                                this.runAction(cc.sequence(cc.delayTime(delay),
                                    cc.spawn(cc.scaleTo(0.4,0.2),cc.moveTo(0.4,startPoint)).easing(cc.easeQuinticActionOut())));
                            }
                        },
                        initSceneData: function() {
                            var tData = MjClient.data.sData.tData;
                            if(tData.zhuValue && tData.zhuValue != -1){
                                setCardSprite_card(this,tData.zhuValue,false);
                            }
                        },
                        clearCardUI:function() {
                            this.removeAllChildren();
                            this.loadTexture("playing/cardPic2/beimian_puke.png");
                        },
                        onlinePlayer: function(msg) {
                            if(msg.uid == SelfUid()){
                                this.removeAllChildren();
                                this.loadTexture("playing/cardPic2/beimian_puke.png");
                            }
                        },
                    }
                },
                card_ming: {
                    _run: function() {
                        this.ignoreContentAdaptWithSize(true);
                        var tData = MjClient.data.sData.tData;
                        this.visible = tData.areaSelectMode.fanpai;
                        MjClient.playui.card_ming=this;
                    },
                    _event: {
                        mjhand: function() {
                            var tData = MjClient.data.sData.tData;
                            var startPoint = cc.p(this.getPosition().x, this.getPosition().y);

                            if (tData.mingCard && tData.mingCard != -1){
                                this.setScale(1);
                                this.stopAllActions();
                                this.setPosition(-246, 525);
                                setCardSprite_card(this,tData.mingCard,false);
                                this.runAction(cc.sequence(cc.delayTime(1),
                                    cc.callFunc(function() {
                                        MjClient.playui.card_ming.removeFromParent(true);
                                    })
                                ));
                            }
                        },
                        initSceneData: function() {
                            // var tData = MjClient.data.sData.tData;
                            // if (tData.mingCard && tData.mingCard != -1){
                            //     setCardSprite_card(this,tData.mingCard,false);
                            // }
                        },
                        clearCardUI:function() {
                            this.removeAllChildren();
                            // this.loadTexture("playing/cardPic2/beimian_puke.png");
                        },
                        onlinePlayer: function(msg) {
                            if(msg.uid == SelfUid()){
                                this.removeAllChildren();
                                // this.loadTexture("playing/cardPic2/beimian_puke.png");
                            }
                        },
                    }
                },
                num_zhuafen: {
                    _run: function() {
                        MjClient.zhuafen=this;
                        this.setString("抓分 0");
                        this.ignoreContentAdaptWithSize(true);
                    },
                    _event: {
                        mjhand: function(){
                            showUserZhuaFen_daqi(this, 0);
                        },
                        initSceneData: function() {
                            var tData = MjClient.data.sData.tData;
                            if(tData.tState == TableState.waitReady){
                                this.setString("抓分 0");
                            }else{
                                showUserZhuaFen_daqi(this, 0);
                            }
                        },
                        s2c_dqZhuaFen: function(msg){
                            var zhuaFenPositon=this.getPosition();
                            // var realPosition=converToWorldSpace(convertToWorldSpace)
                            var ScoreIdx=msg.collectScoreIdx;
                            showUserZhuaFen_daqi(this, 0);
                        },
                        clearCardUI:function() {
                            this.setString("抓分 0");
                        },
                        onlinePlayer: function(msg) {
                            if(msg.uid == SelfUid()){
                                this.setString("抓分 0");
                            }
                        },
                        waitReady: function(){
                            this.setString("抓分 0");
                        }
                    }
                },
                gps_btn: {
                    _click: function() {
                        if (MjClient.MaxPlayerNum == 3) {
                            MjClient.Scene.addChild(new showDistance3PlayerLayer());
                        } else if (MjClient.MaxPlayerNum == 4) {
                            MjClient.Scene.addChild(new showDistanceLayer());
                        } else if (MjClient.MaxPlayerNum == 5) {
                            MjClient.Scene.addChild(new showDistance3PlayerLayer(5));
                        }
                        MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Dingwei", {uid: SelfUid(),gameType:MjClient.gameType});
                    }
                },

            },
            tableid:{
                _run:function(){
                    this.ignoreContentAdaptWithSize(true);
                    this.setString(MjClient.data.sData.tData.tableid);
                },
                initSceneData: function() {
                    this.ignoreContentAdaptWithSize(true);
                    this.setString(MjClient.data.sData.tData.tableid);
                }
            },
            coin_myself:{
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
                    },
                    waitPut:function () {
                        var tData = MjClient.data.sData.tData;
                        var pl = getUIPlayer(0);
                        var coin = tData.initCoin;
                        this.setString(coin + pl.winall);
                    }
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

        },
        chat_btn: {
            _layout: [
                [0.09, 0.09],
                [0.95, 0.12],
                [0.3, 2.95]
            ],
            _click: function() {
                var chatlayer = new ChatLayer();
                MjClient.Scene.addChild(chatlayer);
            }
        },
        setting: {
            _layout: [
                [0.09, 0.09],
                [0.95, 0.93],
                [0.4, 0]
            ],
            _click: function() {
                var settringLayer = new SettingViewCard();
                settringLayer.setName("PlayLayerClick");
                MjClient.Scene.addChild(settringLayer);
                MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Shezhi", {uid:SelfUid(),gameType:MjClient.gameType});
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
        gongTou:{
            _layout: [
                [0.08, 0.14],
                [0.5, 0.5],
                [0, 0]
            ],
            _visible:false
            // run:function()
            // {
            //     MjClient.playui.gongTou=this;
            // },
        },
        gongYou:{
            _layout: [
                [0.08, 0.14],
                [0.5, 0.5],
                [0, 0]
            ],
            _visible:false
            // run:function()
            // {
            //     MjClient.playui.gongYou=this;
            // },
        }
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
        var playui = ccs.load("Play_daQi.json");

        this.srcMaxPlayerNum = MjClient.MaxPlayerNum;
        MjClient.MaxPlayerNum = parseInt(MjClient.data.sData.tData.maxPlayer);
        playMusic("daqi/effect/bgFight");
        this._downNode = playui.node.getChildByName("down");
        this._rightNode = playui.node.getChildByName("right");
        this._topNode = playui.node.getChildByName("top");
        this._leftNode = playui.node.getChildByName("left");
        this._fifthNode = playui.node.getChildByName("fifth");
        this._tingCardsNode = this._downNode.getChildByName("tingCardsNode");
        this._tingCardNumNode = this._downNode.getChildByName("tingCardNumNode");
        this._point=playui.node.getChildByName('point');
        this._btnPutCard = playui.node.getChildByName("BtnPutCard");
        this._btnJiaoZhu = playui.node.getChildByName("BtnJiaoZhu");

        var panel = playui.node.getChildByName("panel");
        this.panel=playui.node.getChildByName("panel")
        //this._btnDiPai = panel.getChildByName("BtnDiPai");
        this._btnShangYiLun = panel.getChildByName("BtnShangYiLun");
        this._btnChaPai = panel.getChildByName("BtnChaPai");
        this._jiaoZhuBack=panel.getChildByName("jiaoZhuPanel").getChildByName("jiaoZhuBack");
        this._titleImg=panel.getChildByName("jiaoZhuPanel").getChildByName("titleImg");
        this._noPutTips = playui.node.getChildByName("noPutTips");
        this._btn_rank = playui.node.getChildByName("btn_rank");
        this._bg_sort = playui.node.getChildByName("bg_sort");
        this._jiaoZhuPanel = panel.getChildByName("jiaoZhuPanel");
        this._coin_myself=playui.node.getChildByName('home_info').getChildByName('coin_myself')
        this.gongTou=playui.node.getChildByName('gongTou');
        this.gongYou=playui.node.getChildByName('gongYou');

        MjClient.playui = this;
        MjClient.playui._AniNode = playui.node.getChildByName("eat");
        MjClient.sortClassType = 0;
        //叫主的状态
        MjClient._jiaoZhuState = jiaoZhuState.none_jiao;
        BindUiAndLogic(playui.node, this.jsBind);
        this.addChild(playui.node);

        // c
        MjClient.vnum7 = {25:0, 26:0, 27:0, 28:0};
        MjClient.playui.currentCardNum = 0; //当前发牌的数量
        MjClient.playui.isDicardDelay = false;  //延时添加底牌

        //this._back  = playui.node.getChildByName("back");

        //触摸事件监听注册
        cc.eventManager.addListener(cc.EventListener.create(getTouchListener_card()), this._rightNode);

        MjClient.playui._jiazhuWait = playui.node.getChildByName("jiazhuWait");

        MjClient.lastMJTick = Date.now();
        this.runAction(cc.repeatForever(cc.sequence(cc.callFunc(function() {
            if (MjClient.game_on_show) MjClient.tickGame(0);
        }), cc.delayTime(7))));


        //初始化其他功能
        initSceneFunc();
        // 在亲友圈房间中添加邀请亲友圈牌有一起对局
        addClubYaoqingBtn();
        
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

// //判断牌型是否可以叫主
// function isCardsCanJiaoZhu_daqi(cards)
// {
//     if(cards.length <= 0 || cards.length > 2){
//         return false;
//     }
//     var tData = MjClient.data.sData.tData;
//     if(MjClient._jiaoZhuState == jiaoZhuState.normal_jiao){
//         if(cards.length == 1 && Math.ceil(cards[0] / 4) == 7){
//             return true;
//         }else if(cards.length == 2 && Math.ceil(cards[0] / 4) == 7 && cards[0] == cards[1]){
//             return true;
//         }
//     }else if(MjClient._jiaoZhuState == jiaoZhuState.mingpai_jiao){
//         if(cards.length == 1 && (cards[0] == tData.mcTransValue || cards[0] == tData.mingCard || Math.ceil(cards[0] / 4) == 7)){
//             return true;
//         }else if(cards.length == 2 && Math.ceil(cards[0] / 4) == 7 && cards[0] == cards[1]){
//             return true;
//         }
//     }else if(MjClient._jiaoZhuState == jiaoZhuState.fanzhu_jiao){
//         if(cards.length == 2 && Math.ceil(cards[0] / 4) == 7 && cards[0] == cards[1] && cards[0] != tData.zhuValue){
//             return true;
//         }
//     }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      0
//     return false;
// }

//倒计时音效的Handle
var playTimeUpEff = null;
//显示计时器(需要移植)
function arrowbkNumberUpdate_daqi(node, time)
{
    if(!time){
        time = 10;
    }
    node.ignoreContentAdaptWithSize(true);
    node.setString(time.toString());
    var number = function()
    {
        if(node.getString() == 0)
        {
            node.stopAllActions();
        }
        else
        {
            var number = node.getString() - 1;
            if(number > time - 1)
            {
                node.setString(number);
            }
            else
            {
                node.setString("0" + number);
                var sData = MjClient.data.sData;
                var tData = sData.tData;
                var uids = tData.uids;

                if(uids[tData.curPlayer] == SelfUid())
                {
                    if(number == 0)
                    {
                        //记录音效的handle
                        //playTimeUpEff = playEffect("loop_alarm", true);
                        MjClient.native.NativeVibrato();
                    }
                }
            }
        }
    };

    node.runAction(cc.repeatForever(cc.sequence(cc.delayTime(1.0), cc.callFunc(number, node))));
}

//清除选中的牌
function setSelectCardToNormalPos_daqi()
{
    MjClient.selectCards_card = [];
    MjClient.colloctionCurrentSelcetUIArray = [];
    setCardToNormalPos();
}

//处理底牌
function dealDicard_daqi()
{
    setSelectCardToNormalPos_daqi();
    MjClient.playui.addDiPaiToHand();
    MjClient.playui.showMaiPaiBtn();
    MjClient.playui.showWaitTip();
    MjClient.playui.updateJiaoZhuState();
    MjClient.playui.runAction(cc.sequence(cc.delayTime(0.2), cc.callFunc(function() {
            setSelectCardToNormalPos_daqi();
    })));
}

function showUserShouqiLogo_daqi(node, off)
{
    var tData = MjClient.data.sData.tData;
    var pl = getUIPlayer(off);
    node.zIndex = 100;
    if(tData && pl)
    {
        if(tData.uids[tData.zhuang] == pl.info.uid && tData.zhuType == 1)
        {
            node.visible = true;
        }else{
            node.visible = false;
        }
    }
}

//显示玩家庄的ui
function showUserZhuangLogo_daqi(node, off,msg,waitPut)
{
    var tData = MjClient.data.sData.tData;
    var pl = getUIPlayer(off);
    node.zIndex = 100;
    var zhuStatus=msg.showZhuStat;
    var friendStatus=msg.showFriendStat;
    var zhuafen=node.getParent().getChildByName('zhuafen')
    var num_zhuafen=node.getParent().getChildByName('num_zhuafen')
    if(tData && pl)
    {
        if(tData.uids[tData.zhuang] == pl.info.uid)
        {
            if(zhuStatus == 1|| zhuStatus == 2)
            {
                node.visible = true;
                node.loadTexture("playing/gameTable/gongtou.png");
                var linkZhuang = node.getChildByName("linkZhuang");
                var path = "playing/gameTable/shuzi/shuzi_" + pl.linkZhuang + ".png";
                linkZhuang.loadTexture(path);
                //linkZhuang.setVisible(pl.linkZhuang > 0);
                linkZhuang.setVisible(false);
                if(zhuStatus == 1)
                {
                    node.visible = false;
                    MjClient.playui.gongTouFly(MjClient.playui.gongTou,off);
                    node.runAction(cc.sequence(cc.delayTime(1.4),cc.callFunc(function() {
                        node.visible=true;
                    })))
                }
            }

            if(off!=0)
            {
                zhuafen.setVisible(false);
                num_zhuafen.setVisible(false);
            }
        }
        else if(tData.uids[tData.zhuangFriend] == pl.info.uid){
            if(friendStatus == 1 || friendStatus == 2)
            {
                if(waitPut == true)
                {

                }
                else
                {
                    node.visible = true;
                    node.loadTexture("playing/gameTable/gongyou.png");
                    cc.log('friendStatusfriendStatus:'+friendStatus)
                    if(friendStatus == 1)
                    {
                        node.visible = false;
                        MjClient.playui.gongTouFly(MjClient.playui.gongYou,off);
                        node.runAction(cc.sequence(cc.delayTime(1.4),cc.callFunc(function() {
                            node.visible=true;
                        })))
                    }
                }
            }
            if(off!=0)
            {
                zhuafen.setVisible(false);
                num_zhuafen.setVisible(false);
            }
            else {
                MjClient.zhuafen.setString("抓分 0")
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
//处理玩家叫主提示
function DealJiaoZhuPromp_daqi(img, off){
    var tData = MjClient.data.sData.tData;
    var pl = getUIPlayer(off);
    if(off != getOffByIndex(tData.zhuang) || getOffByIndex(tData.zhuang) == 0){
        return;
    }
    if(tData.zhuType == 1 || tData.zhuType == 2 || tData.zhuType == 4){
        img.loadTexture("playing/daqi/tip_jiaozhu.png");
        img.setVisible(true);
    }else if(tData.zhuType == 3){
        img.loadTexture("playing/daqi/tip_fanzhu.png");
        img.setVisible(true);
    }
}
//处理打出的牌类型提示
function DealCardPromp_daqi(img, uid, off, isPlayEffect)
{
    var tData = MjClient.data.sData.tData;
    if(!tData.putCardsRecord){
        return;
    }
    var pl = getUIPlayer(off);
    var roundPutCards = tData.putCardsRecord[tData.putCardsRecord.length - 1];
    if(!pl || pl.info.uid != uid || !roundPutCards || typeof roundPutCards == 'undefined' || !roundPutCards[pl.info.uid]) {
        return;
    }
    //是否是调主
    var isdiaozhu = MjClient.majiang.isAllZhuCard(roundPutCards[tData.firstPutCardUid], tData.zhuPaiType);

    //首出
    if(pl.info.uid == tData.firstPutCardUid){
        if(isdiaozhu){//调主
            img.loadTexture("playing/daqi/diaozhu.png");
            img.setVisible(true);
        }
    }
    else{//接牌
        var maxCardUid = MjClient.majiang.getMaxCardPlayerUid(roundPutCards, tData.firstPutCardUid, tData.uids, tData.zhuPaiType, uid);
        if(pl.info.uid == maxCardUid){
            if(!isdiaozhu && MjClient.majiang.isAllZhuCard(roundPutCards[pl.info.uid], tData.zhuPaiType)){//打出主牌
                img.loadTexture("playing/daqi/shapai.png");
                img.setVisible(true);
                if(isPlayEffect == true){
                    playEffectInPlay("shapai");
                }
            }else{
                img.loadTexture("playing/daqi/dazhu.png");
                img.setVisible(true);
                if(isPlayEffect == true){
                    playEffectInPlay("dazhu");
                }
            }
        }else{//垫牌
            img.loadTexture("playing/daqi/dianpai.png");
            img.setVisible(true);
            if(isPlayEffect == true){
                playEffectInPlay("dianpai");
            }
        }
    }
}
//处理抓分
function showUserZhuaFen_daqi(node, off)
{
    var tData = MjClient.data.sData.tData;
    var pl = getUIPlayer(off);
    if(!pl) return;
    var zhuafen=node.getParent().getChildByName('zhuafen');

    if(off == 0)//梁总又临时提需求，为了方便先临时在这处理
    {
        var pl_self = getNode_cards(0);
        var coin = pl_self.getChildByName('head').getChildByName('coin');
    }

    if(tData.playerScore && tData.playerScore[pl.info.uid] >= 0){
        if(off == 0)
        {
            node.setString("抓分 " + tData.playerScore[pl.info.uid]);
            coin.visible=false;
        }
        else
        {
            node.setString("抓分:" + tData.playerScore[pl.info.uid]);
            zhuafen.visible=true;
        }
    }else{
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

PlayLayer_daQi.prototype.dealMingTag_daqi = function(){
    var sData = MjClient.data.sData;
    var tData = MjClient.data.sData.tData;
    for (var i = 0; i < MjClient.MaxPlayerNum; i++) {
        var otherNode = getNode_cards(i);
        if (!otherNode)
            continue;
        var mingTag = otherNode.getChildByName("head").getChildByName("mingTag");
        var pl = getUIPlayer(i);
        if(MjClient.MaxPlayerNum == 4)
        {
            var uids = tData.uids;
            var index = (tData.uids.indexOf(SelfUid()) + i) % MjClient.MaxPlayerNum;
            if(index < uids.length)
            {
                pl = sData.players[uids[index]];
            }
            if(i == 3)
            {
                otherNode = MjClient.playui._fifthNode;
                mingTag = otherNode.getChildByName("head").getChildByName("mingTag");
            }

        }
        if(!pl) return;
        if(tData.uids[tData.mingCardPlayer] == pl.info.uid){
            mingTag.setVisible(true);
        }else{
            mingTag.setVisible(false);
        }
    }
}

PlayLayer_daQi.prototype.canJiaoZhu = function(){
    for (var key in MjClient.vnum7) {
        if(MjClient.vnum7[key] > 0){
            return true;
        }
    }
    return false;
}

PlayLayer_daQi.prototype.canFanZhu = function(){
    var tData = MjClient.data.sData.tData;
    var _zhuValue = tData.zhuValue;
    if(_zhuValue == tData.mcTransValue){
        _zhuValue = tData.mingCard;
    }
    for (var key in MjClient.vnum7) {
        if(MjClient.vnum7[key] == 2 && Number(key) != _zhuValue){
            return true;
        }
    }
    return false;
}

//刷新叫主的状态
PlayLayer_daQi.prototype.updateJiaoZhuState = function(){

    var tData = MjClient.data.sData.tData;
    if(tData.tState != TableState.waitJiaoZhu && tData.tState != TableState.waitCard || MjClient.rePlayVideo!=-1 ){
        MjClient.playui._btnJiaoZhu.visible = false;
        MjClient.playui._jiaoZhuPanel.visible = false;
        return;
    }
    var zhutype = tData.zhuType;
    if(zhutype == 1 || zhutype == 2){//只能反主
        MjClient._jiaoZhuState = jiaoZhuState.fanzhu_jiao;
    }else if(zhutype == 0){//明牌者必须叫主
        MjClient._jiaoZhuState = jiaoZhuState.mingpai_jiao;
    }else if(zhutype == -1){
        MjClient._jiaoZhuState = jiaoZhuState.normal_jiao;
    }else{
        MjClient._jiaoZhuState = jiaoZhuState.none_jiao;
    }
    //按钮状态
    MjClient.playui._btnJiaoZhu.loadTextureNormal("playing/daqi/jiaozhu.png");
    if(MjClient._jiaoZhuState == jiaoZhuState.none_jiao){
        MjClient.playui._btnJiaoZhu.visible = false;
    }else if(MjClient._jiaoZhuState == jiaoZhuState.mingpai_jiao){
        var pl = getUIPlayer(0);
        if(tData.uids[tData.mingCardPlayer] == pl.info.uid){//自己是明牌者
            MjClient.playui._jiaoZhuPanel.visible = true;
        }else{
            MjClient.playui._jiaoZhuPanel.visible = false;
            MjClient.playui._jiaoZhuPanel.btnJiao1.visible = false;
            MjClient.playui._jiaoZhuPanel.btnJiao2.visible = false;
        }
    }else if(MjClient._jiaoZhuState == jiaoZhuState.normal_jiao){
        if(MjClient.playui.canJiaoZhu()){
            MjClient.playui._jiaoZhuPanel.visible = true;
        }else{
            MjClient.playui._jiaoZhuPanel.visible = false;
        }
    }else if(MjClient._jiaoZhuState == jiaoZhuState.fanzhu_jiao){
        if(MjClient.playui.canFanZhu()){
            MjClient.playui._btnJiaoZhu.loadTextureNormal("playing/daqi/fanzhu.png");
            MjClient.playui._btnJiaoZhu.visible = true;
        }else{
            MjClient.playui._btnJiaoZhu.visible = false;
        }
    }
    //刷新叫主面板
    MjClient.playui.updateJiaoZhuPanel();
}
PlayLayer_daQi.prototype.updateRePlayVideoJiaoZhu=function (msg) {

    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var pl = getUIPlayer(0);
    var off = getOffByIndex(tData.zhuang);
    // var zhuang=msg.zhuang;
    // if(zhuang == 0) return;
    if(off != 0) return;
    var beforeShouPai=pl.mjhand.slice();
    // var diCard=msg.diPaiArr.slice();
    // var index = pl.mjhand.indexOf(diCard[0]);
    MjClient.vnum7 = {25:0, 26:0, 27:0, 28:0};
    // beforeShouPai.splice(index,8);
    if (pl.mjhand) {
        for (var i = 0; i < beforeShouPai.length; i++) {
            var value = beforeShouPai[i];
            if(value == tData.mcTransValue && tData.areaSelectMode.fanpai == true){
                value = tData.mingCard;
            }
            if(Math.ceil(value / 4) == 7 && value in MjClient.vnum7){
                MjClient.vnum7[value]++
            }
        }
    }
    var zhutype = tData.zhuPaiType;
    MjClient.playui._jiaoZhuPanel.visible = true;

    var titleImg = MjClient.playui._jiaoZhuPanel.getChildByName("titleImg");
    if(tData.zhuType<3){
        titleImg.loadTexture("playing/daqi/titleJiao.png");
    }else{
        titleImg.loadTexture("playing/daqi/titleFan.png");
    }

    var initBtnState = function(btn, num, value){//设置按钮状态
        btn.setTouchEnabled(zhutype==value? true:false);
        btn.setBright(zhutype==value? true:false);
        btn.getChildByName("num").setString(num.toString());
    }
    //25: btnFk 26: btnMh 27:btnHongT 28: btnHeiT
    for(key in MjClient.vnum7){
        switch(key){
            case "25":
                initBtnState(MjClient.playui._jiaoZhuPanel.btnFk, MjClient.vnum7[25], 0);
                break;
            case "26":
                initBtnState(MjClient.playui._jiaoZhuPanel.btnMh, MjClient.vnum7[26], 1);
                break;
            case "27":
                initBtnState(MjClient.playui._jiaoZhuPanel.btnHongT, MjClient.vnum7[27],2);
                break;
            case "28":
                initBtnState(MjClient.playui._jiaoZhuPanel.btnHeiT, MjClient.vnum7[28], 3);
                break;
            default:
                break;
        }
    }
    if(zhutype == 1 || zhutype == 2){//只能反主
        MjClient._jiaoZhuState = jiaoZhuState.fanzhu_jiao;
    }else if(zhutype == 0){//明牌者必须叫主
        MjClient._jiaoZhuState = jiaoZhuState.mingpai_jiao;
    }else if(zhutype == -1){
        MjClient._jiaoZhuState = jiaoZhuState.normal_jiao;
    }else{
        MjClient._jiaoZhuState = jiaoZhuState.none_jiao;
    }
    if(tData.mingCard && tData.mingCard != -1
        && tData.uids[tData.mingCardPlayer] == pl.info.uid && tData.zhuValue == tData.mcTransValue)
    {
        MjClient.playui._jiaoZhuPanel.btnMing.setTouchEnabled(true);
        MjClient.playui._jiaoZhuPanel.btnMing.setBright(true);

        MjClient.playui._jiaoZhuPanel.btnFk.setTouchEnabled(false);
        MjClient.playui._jiaoZhuPanel.btnMh.setTouchEnabled(false);
        MjClient.playui._jiaoZhuPanel.btnHongT.setTouchEnabled(false);
        MjClient.playui._jiaoZhuPanel.btnHeiT.setTouchEnabled(false);
        MjClient.playui._jiaoZhuPanel.btnFk.setBright(false);
        MjClient.playui._jiaoZhuPanel.btnMh.setBright(false);
        MjClient.playui._jiaoZhuPanel.btnHongT.setBright(false);
        MjClient.playui._jiaoZhuPanel.btnHeiT.setBright(false);
    }else{
        MjClient.playui._jiaoZhuPanel.btnMing.setTouchEnabled(false);
        MjClient.playui._jiaoZhuPanel.btnMing.setBright(false);
    }
    var _btnJiao1 = MjClient.playui._jiaoZhuPanel.btnJiao1;
    var _btnJiao2 = MjClient.playui._jiaoZhuPanel.btnJiao2;
    _btnJiao1.visible=(true)
    _btnJiao2.visible=(true)
}
//初始化叫主面板
PlayLayer_daQi.prototype.initJiaoZhuPanel_DaQi = function()
{
    var initBtn = function(_btn){//重置按钮
        _btn.getChildByName("select").visible = false;
    }

    var _btnHeiT = MjClient.playui._jiaoZhuPanel.btnHeiT;
    initBtn(_btnHeiT);
    var _btnFk = MjClient.playui._jiaoZhuPanel.btnFk;
    initBtn(_btnFk);
    var _btnHongT = MjClient.playui._jiaoZhuPanel.btnHongT;
    initBtn(_btnHongT);
    var _btnMh = MjClient.playui._jiaoZhuPanel.btnMh;
    initBtn(_btnMh);

    MjClient.playui._jiaoZhuPanel.btnJiao1.visible = false;
    MjClient.playui._jiaoZhuPanel.btnJiao2.visible = false;
    if(MjClient.playui.currentSelectHuaBtn != null){
        MjClient.playui.currentSelectHuaBtn.getChildByName("select").visible = false;
        MjClient.playui.currentSelectHuaBtn = null;
    }
    MjClient.playui.currentSelectHuaValue = -1;
}

//处理叫主
PlayLayer_daQi.prototype.DealJiaoZhuBtn_DaQi = function(btn, value)
{

    if(MjClient._jiaoZhuState == jiaoZhuState.none_jiao){
        return;
    }
    if(MjClient.playui.currentSelectHuaBtn != null){
        MjClient.playui.currentSelectHuaBtn.getChildByName("select").visible = false;
        MjClient.playui.currentSelectHuaBtn = null;
    }
    MjClient.playui.currentSelectHuaValue = -1;

    var _btnJiao1 = MjClient.playui._jiaoZhuPanel.btnJiao1;
    var _btnJiao2 = MjClient.playui._jiaoZhuPanel.btnJiao2;

    _btnJiao1.visible = false;
    _btnJiao2.visible = false;

    var num = MjClient.vnum7[value];
    var _isfrist = false;
    var _isfanzhu = false;
    if(num == 2)
    {
        if(MjClient._jiaoZhuState == jiaoZhuState.fanzhu_jiao){
            MjClient.gamenet.request("pkroom.handler.tableMsg", {
                cmd: "c2s_dqJiaoZhu",
                card: value,
                isfrist: false,
                isfanzhu: true
            });
        }else{
            _btnJiao1.visible = true;
            _btnJiao2.visible = true;
            // MjClient.playui._jiaoZhuBack.setScaleY(1);
            // MjClient.playui._titleImg.setPosition(428.82,400);
            MjClient.playui.currentSelectHuaBtn = btn;
            MjClient.playui.currentSelectHuaBtn.getChildByName("select").visible = true;
            MjClient.playui.currentSelectHuaValue = value;
            MjClient.playui.panel.getChildByName("jiaoZhuWaitTip").setVisible(false);
        }
    }
    else
    {
        if(MjClient.playui.currentCardNum == 1){
            _isfrist = true;
        }
        cc.log("---------c2s_dqJiaoZhu------------"+value + "currentCardNum" + MjClient.playui.currentCardNum);
        MjClient.gamenet.request("pkroom.handler.tableMsg", {
            cmd: "c2s_dqJiaoZhu",
            card: value,
            isfrist: _isfrist,
            isfanzhu: false
        });
    }
}

//刷新叫主面板
PlayLayer_daQi.prototype.updateJiaoZhuPanel = function(){
    var tData = MjClient.data.sData.tData;
    var pl = getUIPlayer(0);
    var titleImg = MjClient.playui._jiaoZhuPanel.getChildByName("titleImg");
    if(MjClient._jiaoZhuState == jiaoZhuState.fanzhu_jiao){
        titleImg.loadTexture("playing/daqi/titleFan.png");
    }else{
        titleImg.loadTexture("playing/daqi/titleJiao.png");
    }

    var initBtnState = function(btn, num, value){//设置按钮状态
        btn.setTouchEnabled(false);
        btn.setBright(false);
        if(MjClient._jiaoZhuState == jiaoZhuState.mingpai_jiao)
        {
            if(num > 0 && tData.uids[tData.mingCardPlayer] == pl.info.uid){
                btn.setTouchEnabled(true);
                btn.setBright(true);
            }
        }
        else if(MjClient._jiaoZhuState == jiaoZhuState.normal_jiao)
        {
            if(num > 0){
                btn.setTouchEnabled(true);
                btn.setBright(true);
            }
        }
        else if(MjClient._jiaoZhuState == jiaoZhuState.fanzhu_jiao){
            var _zhuValue = tData.zhuValue;
            if(_zhuValue == tData.mcTransValue){
                _zhuValue = tData.mingCard;
            }
            if(num == 2 && value != _zhuValue){
                btn.setTouchEnabled(true);
                btn.setBright(true);
            }
        }
        btn.getChildByName("num").setString(num.toString());
    }
    //25: btnFk 26: btnMh 27:btnHongT 28: btnHeiT
    for(key in MjClient.vnum7){
        switch(key){
            case "25":
                initBtnState(MjClient.playui._jiaoZhuPanel.btnFk, MjClient.vnum7[25], Number(key));
            break;
            case "26":
                initBtnState(MjClient.playui._jiaoZhuPanel.btnMh, MjClient.vnum7[26], Number(key));
            break;
            case "27":
                initBtnState(MjClient.playui._jiaoZhuPanel.btnHongT, MjClient.vnum7[27], Number(key));
            break;
            case "28":
                initBtnState(MjClient.playui._jiaoZhuPanel.btnHeiT, MjClient.vnum7[28], Number(key));
            break;
            default:
            break;
        }
    }
    //明牌叫主
    if(MjClient._jiaoZhuState == jiaoZhuState.mingpai_jiao 
        && tData.uids[tData.mingCardPlayer] == pl.info.uid)
    {
        MjClient.playui._jiaoZhuPanel.btnMing.setTouchEnabled(true);
        MjClient.playui._jiaoZhuPanel.btnMing.setBright(true);

        MjClient.playui._jiaoZhuPanel.btnFk.setTouchEnabled(false);
        MjClient.playui._jiaoZhuPanel.btnMh.setTouchEnabled(false);
        MjClient.playui._jiaoZhuPanel.btnHongT.setTouchEnabled(false);
        MjClient.playui._jiaoZhuPanel.btnHeiT.setTouchEnabled(false);
        MjClient.playui._jiaoZhuPanel.btnFk.setBright(false);
        MjClient.playui._jiaoZhuPanel.btnMh.setBright(false);
        MjClient.playui._jiaoZhuPanel.btnHongT.setBright(false);
        MjClient.playui._jiaoZhuPanel.btnHeiT.setBright(false);

        MjClient.playui._jiaoZhuPanel.btnJiao1.visible = false;
        MjClient.playui._jiaoZhuPanel.btnJiao2.visible = false;
        MjClient.playui._jiaoZhuPanel.btnFk.getChildByName("select").visible = false;
        MjClient.playui._jiaoZhuPanel.btnMh.getChildByName("select").visible = false;
        MjClient.playui._jiaoZhuPanel.btnHongT.getChildByName("select").visible = false;
        MjClient.playui._jiaoZhuPanel.btnHeiT.getChildByName("select").visible = false;
    }else{
        MjClient.playui._jiaoZhuPanel.btnMing.setTouchEnabled(false);
        MjClient.playui._jiaoZhuPanel.btnMing.setBright(false);
    }
}

//显示牌桌上最后打出的牌UI,断线重连走这里
PlayLayer_daQi.prototype.reConnectShowDeskCard = function() {
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

PlayLayer_daQi.prototype.cannotOutCardGrey = function() {
    if (MjClient.data.sData.tData.lastPutPlayer == -1 || MjClient.data.sData.tData.lastPutPlayer == MjClient.data.sData.tData.curPlayer)
        return;

    var children = this._downNode.children;
    var standUI = this._downNode.getChildByName("stand");
    for (var i = 0; i < children.length; i++) {
        if (children[i].name != "mjhand")
            continue;

        var atTipArray = false;
        for (var j = 0, len = MjClient.tipCardsArray.length; j < len; j++) {
            if(!MjClient.tipCardsArray[j]) continue;
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

        if (!atTipArray) {
            for (var a=0; a<MjClient.colloctionCurrentSelcetUIArray.length; a++) {
                var node = MjClient.colloctionCurrentSelcetUIArray[a];
                if (node.tag == children[i].tag) {
                    cc.log("node.tag=====:" + node.tag);

                    MjClient.colloctionCurrentSelcetUIArray.splice(a, 1);
                    var idx = MjClient.selectCards_card.indexOf(node.tag);
                    if (idx > -1) {
                        cc.log("MjClient.selectCards_card[a]=====:" + MjClient.selectCards_card[idx]);
                        MjClient.selectCards_card.splice(idx, 1);
                    }
                    if(node.y != standUI.y)
                    {
                        node.y = standUI.y;
                    }
                    break
                }
            }
        }
    }
    UpdataCurrentPutCard();
}

PlayLayer_daQi.prototype.recoverCannotOutCard = function() {
    var children = this._downNode.children;
    for (var i = 0; i < children.length; i++) {
        if (children[i].name != "mjhand")
            continue;

        children[i].cannotOut = false;
        children[i].setColor(MjClient.whiteColor);
    }
}

PlayLayer_daQi.prototype.clockNumberUpdate = function(node, time) {
    return arrowbkNumberUpdate_daqi(node, time);
}

PlayLayer_daQi.prototype.updateClockPosition = function(arrowNode, isSelf) {
    var tData = MjClient.data.sData.tData;
    var uids = tData.uids;
    var off = getOffByIndex(tData.curPlayer);
    if(isSelf){
        off = 0;
    }
    cc.log("updateClockPosition: tData.curPlayer=" + tData.curPlayer);
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
    {
        arrowNode.setPosition(curPlayerNode.getChildByName("deskCard").getPosition());
    }
    else
    {

        if(tData.tState ==TableState.waitJiaoZhu || tData.tState ==TableState.waitMaiPai)
        {
            arrowNode.setPosition(arrowNode.srcPosition.x,arrowNode.srcPosition.y + arrowNode.srcPosition.y / 5);
        }
        else {
            arrowNode.setPosition(arrowNode.srcPosition.x,arrowNode.srcPosition.y-arrowNode.srcPosition.y/12);
        }
    }
}

/**
 * 拼接游戏玩法及付费信息
 * @function
 * @return {String}
 */
PlayLayer_daQi.prototype.getGameInfoString = function(param) {
    var tData = MjClient.data.sData.tData;
    var str = "";

    str += tData.areaSelectMode.fanpai ? "翻牌," : "";
    str += tData.areaSelectMode.koudi ? "抠底加级," : "";
    str += tData.areaSelectMode.zhuangdanjiabei ? "庄家单打赢双倍," : "";
    str += tData.areaSelectMode.fanZhuBuKouDi ? "反主不抠底," : "";
    switch(tData.areaSelectMode.jifengding){
        case 3:
            str += "3级封顶,";
            break;
        case 5:
            str += "5级封顶,";
            break;
        case 0:
            str += "不封顶,";
            break;
    }
    str += tData.areaSelectMode.difen ? "底分X"+ tData.areaSelectMode.difen + "," : "";

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

PlayLayer_daQi.prototype.updateOperateBtnPosition = function() {
    var putCardBtn = this.jsBind.BtnPutCard._node;
    var himtBtn = this.jsBind.BtnHimt._node;
    var shuaiPaiBtn = this.jsBind.BtnShuaiPai._node;

    if (!putCardBtn.isVisible())
        return;

    var width = 0;
    var btns = [shuaiPaiBtn, himtBtn, putCardBtn];
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
PlayLayer_daQi.prototype.playCardAni_liandui = function() {
    var panel = this.jsBind.panel._node;
    var sprite = new cc.Sprite("playing/daqi/liandui_1.png");
    var i = 1;
    sprite.schedule(function() {
        i ++;
        if (i <= 5)
            this.setTexture("playing/daqi/liandui_" + i + ".png");
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
PlayLayer_daQi.prototype.playWinAni = function(winType) {
    cc.log("winType=" + winType + " this.winType=" + this.winType);
    
    var file = "";
    switch (winType) {
        //case -1: // 过庄
        //    file = "gameOver_sanDaHa/guozhuang.png";
        //    break;
        case 1: // 跨庄
            file = "gameOver_daQi/kuazhuang.png";
            break;
        case 2: // 小倒
            file = "gameOver_daQi/xiaodao.png";
            break;
        case 3: // 大倒
            file = "gameOver_daQi/dadao.png";
            break;
        case 4:	// 投降
            file = "gameOver_daQi/touxiang.png";
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

// 判断是否有不同意投降的玩家
PlayLayer_daQi.prototype.haveNotAgreeTouXiang = function()
{
    var sData = MjClient.data.sData;
    var tData = MjClient.data.sData.tData;
    for (var i = 0; i < tData.uids.length; i ++)
    {
        var tempPl = sData.players[tData.uids[i] + ""];
        if (tempPl.isAgreeTouXiang == 0)
        {
           return true;
        }
    }

    return false;
}

// 显示各种提示：等待叫分、等待叫主、等待埋牌、等待投降同意、不同意思投降继续游戏
PlayLayer_daQi.prototype.showWaitTip = function() {
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    cc.log("showWaitTip: tData.tState=" + tData.tState + " tData.curPlayer=" + tData.curPlayer);
    var curOff = getOffByIndex(tData.zhuang);
    var zhuangPl = tData.zhuang != -1 ? sData.players[tData.uids[tData.zhuang] + ""] : null;

    MjClient.playui.panel.getChildByName("jiaoZhuWaitTip").setVisible((tData.tState == TableState.waitJiaoZhu || tData.tState == TableState.waitCard) &&
        (tData.zhuType == 0 || tData.zhuType == -1) &&
        (MjClient.playui._jiaoZhuPanel.btnJiao1.visible == false && MjClient.playui._jiaoZhuPanel.btnJiao2.visible == false));

    MjClient.playui.panel.getChildByName("fanZhuWaitTip").setVisible((tData.tState == TableState.waitJiaoZhu || tData.tState == TableState.waitCard) &&
        (tData.zhuType == 1 || tData.zhuType == 2));
    MjClient.playui.panel.getChildByName("maiPaiWaitTip").setVisible(tData.tState == TableState.waitMaiPai && 0 != curOff);
}

// 显示各玩家叫分
PlayLayer_daQi.prototype.showJiaoFenTag = function(off) {
    var tData = MjClient.data.sData.tData;
    cc.log("showJiaoFenTag: tData.jiaoFen=" + tData.jiaoFen + " tData.jiaoFenPlayer=" + tData.jiaoFenPlayer);

    var playerNode = getNode_cards(off);
    var pl = getUIPlayer(off);
    if (!playerNode || !pl)
        return;

    var jiaoFenTagNode = playerNode.getChildByName("jiaoFenTag");
    if (typeof(pl.jiaoFen) != "undefined" && pl.jiaoFen != -1) {
        jiaoFenTagNode.setVisible(true);
        if (pl.jiaoFen == 0)
            jiaoFenTagNode.loadTexture("playing/daqi/jiaoFen_action/bujiao.png");
        else if (pl.isPaiFen)
            jiaoFenTagNode.loadTexture("playing/daqi/jiaoFen_action/pai" + pl.jiaoFen + ".png");
        else
            jiaoFenTagNode.loadTexture("playing/daqi/jiaoFen_action/" + pl.jiaoFen + "fen.png");
    }

    if (off == getOffByIndex(tData.curPlayer) && tData.tState == TableState.waitJiaoFen)
        jiaoFenTagNode.setVisible(false);
}

// 把底牌添加到手牌中
PlayLayer_daQi.prototype.addDiPaiToHand = function() {
    var tData = MjClient.data.sData.tData;
    if (tData.tState != TableState.waitJiaoZhu && tData.tState != TableState.waitMaiPai)
        return;

    var off = getOffByIndex(tData.zhuang);
    if (tData.diPaiArr.length == 0 || (0 != off && MjClient.rePlayVideo == -1))
        return;

    var playerNode = getNode_cards(off);
    var pl = getUIPlayer(off);
    var vcard = pl.mjhand.slice();
    cc.log("--------------addDiPaiToHand--------------pl.mjhand:"+pl.mjhand.length);
    for (var i = 0; i < tData.diPaiArr.length; i++) {
        var card = getNewCard_card(playerNode, "stand", off == 0 ? "mjhand" : "mjhand_replay", tData.diPaiArr[i], off);
        MjClient.playui.setCardSprite_ZhuTag(card);
        var index = vcard.indexOf(tData.diPaiArr[i]); //区分2张一样的牌
        if (index >= 0) {
            card.setUserData(1);
        } else {
            card.setUserData(0);
        }
        vcard.push(tData.diPaiArr[i]);
        if(Math.ceil(tData.diPaiArr[i] / 4) == 7 && tData.diPaiArr[i] in MjClient.vnum7){
            MjClient.vnum7[tData.diPaiArr[i]]++;
        }
    }

    pl.mjhand = pl.mjhand.concat(tData.diPaiArr);
    MjClient.playui.CardLayoutRestore(playerNode, off);
    selectUICards(tData.diPaiArr);
    MjClient.selectCards_card = tData.diPaiArr;
    MjClient.playui.updateJiaoZhuState();
}

// 从手牌中移除埋的牌
PlayLayer_daQi.prototype.removeMaiPaiFromHand = function() {
    var tData = MjClient.data.sData.tData;
    var off = getOffByIndex(tData.zhuang);
    if (tData.diPaiArr.length == 0 || (0 != off && MjClient.rePlayVideo == -1))
        return;

    var playerNode = getNode_cards(off);
    var pl = getUIPlayer(off);
    for (var i = 0; i < tData.diPaiArr.length; i++) {
        var index = pl.mjhand.indexOf(tData.diPaiArr[i]);
        if (index != -1)
            pl.mjhand.splice(index, 1);

        if(Math.ceil(tData.diPaiArr[i] / 4) == 7 && tData.diPaiArr[i] in MjClient.vnum7){
            MjClient.vnum7[tData.diPaiArr[i]]--;
        }

        RemoveNodeBack(playerNode, off == 0 ? "mjhand" : "mjhand_replay", 1, tData.diPaiArr[i]);
    }
    MjClient.playui.CardLayoutRestore(playerNode, off);
}

// 显示投降同意选择框
PlayLayer_daQi.prototype.showTouXuangDialog = function() {
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

// 显示埋牌按扭
PlayLayer_daQi.prototype.showMaiPaiBtn = function(ishide) {
    var tData = MjClient.data.sData.tData;
    var zhuangPl = MjClient.data.sData.players[tData.uids[tData.zhuang] + ""];
    var panel = MjClient.playui.jsBind.panel;
    var maiPaiBtn = panel.BtnMaiPai._node;
    if (tData.tState != TableState.waitMaiPai || 0 != getOffByIndex(tData.zhuang) || ishide == true){
        maiPaiBtn.setVisible(false);
        return;
    }
    maiPaiBtn.setVisible(true);

    var func = function(cards) {
        if (cards.length != 8) {
            return;
        }
        MjClient.gamenet.request("pkroom.handler.tableMsg", {
            cmd: "c2s_dqMaiPai",
            diPaiArr: cards
        });
        setSelectCardToNormalPos_daqi();
        maiPaiBtn.setVisible(false);
    }

    maiPaiBtn.addTouchEventListener(function(sender, type) {
        if (type != 2)
            return;
        cardsSort_daQi(MjClient.selectCards_card);
        func(MjClient.selectCards_card);
    });

    maiPaiBtn.setEnabled(false);
    maiPaiBtn.runAction(cc.repeatForever(cc.callFunc(function() {
        maiPaiBtn.setEnabled(MjClient.selectCards_card.length == 8);
    })));
}

// 显示投降按扭
PlayLayer_daQi.prototype.showTouXiangBtn = function() {
    var tData = MjClient.data.sData.tData;
    if (tData.tState != TableState.waitPut || 0 != getOffByIndex(tData.curPlayer))
        return;

    var panel = MjClient.playui.jsBind.panel;
    var touXiangBtn = panel.BtnTouXiang._node;
    touXiangBtn.setVisible(true);
    setSelectCardToNormalPos_daqi();
    var func = function(uid) {
        MjClient.gamenet.request("pkroom.handler.tableMsg", {
            cmd: "c2s_sdhTouXiang",
            uid:uid
        });
        touXiangBtn.setVisible(false);
    }

    touXiangBtn.addTouchEventListener(function(sender, type) {
        if (type != 2)
            return;
        var that = this;
        var uid = tData.uids[tData.curPlayer];
        MjClient.showMsg("你确定要投降吗？", function() {
            func(uid);
        }, function() {}, "1");
    });
}

// 显示上一轮面板
PlayLayer_daQi.prototype.showShangYiLunPanel = function(shangYiLunPanel) {
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

    for (var i = 0; i < 4; i++) {
        var strs = ["downCard", "rightCard", "topCard", "leftCard"];
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
PlayLayer_daQi.prototype.showDiPaiPanel = function(diPaiPanel) {
    var tData = MjClient.data.sData.tData;
    var cards = tData.diPaiArr;
    if (0 != getOffByIndex(tData.zhuang) || cards.length == 0)
        return;

    diPaiPanel.setVisible(true);
    for (var i = 0; i < cards.length; i++) {
        var cardNode = diPaiPanel.getChildByName("card_" + i)
        cardNode.removeAllChildren();
        setCardSprite_card(cardNode, cards[i], true);
    }
    MjClient.playui.jsBind.panel.touchLayer._node.setTouchEnabled(true);
}

// 显示查牌面板
PlayLayer_daQi.prototype.showChaPaiPanel = function(chaPaiPanel) {
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
        player.getChildByName("name").setFontName("Arial");
        player.getChildByName("name").setFontSize(25);

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
PlayLayer_daQi.prototype.showScoreCards = function(panel, cards) {
    var childrens = panel.getChildren().slice();
    for (var i = 0; i < childrens.length; i++) {
        if (childrens[i].name == "trueScoreCard")
            childrens[i].removeFromParent();
    }

    var tempCard = panel.getChildByName("scoreCard");
    tempCard.setVisible(false);
    var w = tempCard.width * tempCard.scaleX + 1;
    var x = tempCard.x;

    for (var i = 0; i < cards.length; i++) {
        var cardNode = tempCard.clone();
        setPKMiniImg(cardNode, cards[i]);
        cardNode.x = x;
        x += w;
        cardNode.name = "trueScoreCard";
        cardNode.setVisible(true);
        panel.addChild(cardNode);
    }
}

// 给手牌中的主牌设置角标
PlayLayer_daQi.prototype.setCardSprite_ZhuTag = function(node) {
    var tData = MjClient.data.sData.tData;
    var num = node.getTag();
    if(num == tData.mcTransValue){
        num = tData.mingCard;
    }
    var isZhu = this.getCardNumByColor([num], 4) == 1;
    var isAddTag = true;
    if (!isZhu && (tData.zhuPaiType == null || tData.zhuPaiType == -1)){
        isAddTag = false;
    }

    if (!isZhu && this.getCardNumByColor([num], tData.zhuPaiType) != 1){
        isAddTag = false;
    }

    if(isAddTag){
        if(!node.getChildByName("daQi_zhuTag")){
            var sprite = new cc.Sprite("playing/daqi/zhu.png");
            sprite.setName("daQi_zhuTag");
            sprite.setAnchorPoint(0, 0);
            sprite.setPosition(0, 0);
            sprite.setScale(1.2);
            node.addChild(sprite);
        }
    }else{
        if(node.getChildByName("daQi_zhuTag")){
            node.removeChildByName("daQi_zhuTag");
        }
    }
}

// 计算各牌色数量
PlayLayer_daQi.prototype.getCardNumByColor = function(cards, colorIndex) {
    var num = 0;
    var types = [1, 2, 3, 0, 4]
    for (var i = 0; i < cards.length; i++) {
        var value = Math.ceil(cards[i] / 4);
        var type = cards[i] % 4;
        if (cards[i] == 54 || cards[i] == 53 || value == 7 || value == 2) // 常主
        {
            if (colorIndex == 4)
                num++;
        } else if (type == types[colorIndex]) {
            num++;
        }
    }

    return num;
}

// 清空桌面
PlayLayer_daQi.prototype.clearDesk = function() {
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

PlayLayer_daQi.prototype.CardLayoutRestore = function(node, off) {
    cc.log("横向排序 off=" + off);
    MjClient.playui.horSort(node, off);
};

PlayLayer_daQi.prototype.CardLayoutDesk = function(node, cards, off) {
    //if(off != 0) return;
    var children = node.children;
    var initDesk_y = node.getChildByName("deskCard").y;
    for (var i = 0; i < children.length; i++) {
        var ci = children[i];
        if (ci.name == "out"){
            ci.y = initDesk_y;
            ci.setColor(MjClient.grayColor);
        }
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

        // if (MjClient.majiang.getCardFen(ci.getTag()))
        //     ci.setColor(MjClient.grayColor);
    }

    if (uiHun.length + uiOut.length == 0)
        return;

    var sort = function(node) {
        var pointCounts = {};
        for (var i = 0; i < node.length; i++) {
            var p = MjClient.majiang.calPoint(node[i].tag);
            if (pointCounts[p])
                pointCounts[p]++;
            else
                pointCounts[p] = 1;
        }

        var commonCmp = function(a, b) {
            var c1 = pointCounts[MjClient.majiang.calPoint(a.tag)];
            var c2 = pointCounts[MjClient.majiang.calPoint(b.tag)];
            if (c1 == c2)
                return MjClient.majiang.cardRealPointCmp(a.tag, b.tag);
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
            x = outStand.x;
            if (MjClient.rePlayVideo == -1) // 表示正常游戏
            {
                if (uiOut.length >= 6)
                    x -= width * 3;
            }
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
    var maxUid = MjClient.majiang.getMaxCardPlayerUid(roundCards, tData.firstPutCardUid, tData.uids, tData.zhuPaiType);
    cc.log("getMaxCardPlayerUid:roundCards=" + JSON.stringify(roundCards) + " tData.firstPutCardUid=" + tData.firstPutCardUid + " tData.uids=" + tData.uids + " ret=" + maxUid);

    var pl=getUIPlayer(off);
    if(!pl) return;
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

                ci.setColor(MjClient.grayColor);
                ci.removeChildByName("bigTag");
            }
        }

        var sprite = new cc.Sprite("playing/daqi/da.png");
        sprite.setPosition(uiOut[uiOut.length - 1].width - sprite.width / 2, uiOut[uiOut.length - 1].height - sprite.height / 2);
        sprite.setName("bigTag");
        uiOut[uiOut.length - 1].addChild(sprite);
        for (var i = 0; i < uiOut.length; i++) {
            uiOut[i].setColor(MjClient.whiteColor);
        }
    }
};

//横向摆放《正常》
PlayLayer_daQi.prototype.horSort = function(node, off) {
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
    var mjhandPai = tempMaJiang.sortHandCards(mjhandCopy, MjClient.data.sData.tData.zhuPaiType);


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

//飘分动画
PlayLayer_daQi.prototype.moveFen= function(node,off){
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
             zhuafen=MjClient.zhuafen;
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

PlayLayer_daQi.prototype.updateWifiState=function(node)
{
    var callback = function()
    {
        var ms = MjClient.reqPingPong / 1000.0;
        if(ms < 0.3)
        {
            node.loadTexture("playing/daqi/new/WIFI1-fs8.png");
        } else if(ms < 0.6)
        {
            node.loadTexture("playing/daqi/new/WIFI2-fs8.png");
        }
        else
        {
            node.loadTexture("playing/daqi/new/WIFI3-fs8.png");
        }
    };

    node.runAction(cc.repeatForever(cc.sequence(cc.callFunc(callback), cc.delayTime(5))));
}
// 原本改成圆头像，后来又改回方的，再改圆的就调用这
PlayLayer_daQi.prototype.setWxHead=function(node, d, off)
{
    if(d.uid == getUIHeadByOff(off).uid)
    {
        var nobody = node.getChildByName("nobody");

        cc.log(off + "----------setWxHead---------------"+d.uid);
        var clippingNode =nobody.getChildByName('clippingNode');
        if(!clippingNode)
        {
            var clippingNode = new cc.ClippingNode();
            var mask = new cc.Sprite("playing/daqi/new/headmeng.png");
            clippingNode.setAlphaThreshold(0);
            clippingNode.setStencil(mask);
            clippingNode.setName('clippingNode')
            clippingNode.setPosition(nobody.getContentSize().width/2,nobody.getContentSize().height/2);
            //遮罩框
            nobody.addChild(clippingNode);
        }
        var WxHead = clippingNode.getChildByName("WxHead");
        if(WxHead)
        {
            WxHead.removeFromParent();
        }
        var sp = new cc.Sprite(d.img);
        sp.setName("WxHead");
        clippingNode.addChild(sp);
        // setWgtLayout(sp, [0.91, 0.91], [0.5, 0.5], [0, 0], false, true);

    }
}
PlayLayer_daQi.prototype.gongTouFly=function(node,off) {
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