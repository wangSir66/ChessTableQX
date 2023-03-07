// 贵州斗地主

var actionZindex = 1000;
var PlayLayer_doudizhuGZ = cc.Layer.extend({
    ctor: function () {
        this._super();
        var playui = ccs.load(res.Play_doudizhuGZ_json);
        MjClient.MaxPlayerNum = parseInt(MjClient.data.sData.tData.maxPlayer);
        playMusic("doudizhu/table_background_music");
        MjClient.playui = this;
        MjClient.sortClassType = 0; //必不可少，会影响到banner上花色的正确显示
        MjClient.playui.node = playui.node;
        MjClient.playui.putCardType = 1;//  出牌方式 1 滑动出牌 2 提示出牌
        MjClient.playui.initUI();
        MjClient.playui.initTagList();
        MjClient.playui.hideAllUI();
        MjClient.playui.initHeadWget();
        var tState = MjClient.data.sData.tData.tState;
        MjClient.playui.initData(tState == TableState.roundFinish ? true : false);
        MjClient.playui.initClockWget();
        MjClient.playui.initClickEvent();
        MjClient.playui.initMsgEvent();
        MjClient.playui.initOnce();
        this.addChild(playui.node);
        //触摸事件监听注册
        cc.eventManager.addListener(cc.EventListener.create(this.handleCardsTouchListener()), this._downNode);
        MjClient.lastMJTick = Date.now();
        this.runAction(cc.repeatForever(cc.sequence(cc.callFunc(function () {
            if (MjClient.game_on_show) {
                MjClient.tickGame(0);
            }
        }), cc.delayTime(7))));
        MjClient.playui.displayJinBiChangNode();
        if(MjClient.playui.isJinBiChang()){//金币场添加 记牌器组件
            MjClient.playui.node.addChild(new JiPaiQiPanel_JZ(), 499);
        }

        //获取超级加倍卡数据
        MjClient.getRechargeLadder(function(data){
            if (!cc.sys.isObjectValid(this)) {
                return;
            }
            if(!data || data.length <= 0){
                return;
            }
            for (var i = 0; i < data.length; i++) {
                if(data[i].os == 'doubleCard'){
                    this.doubleCardData = data[i];
                    break;
                }
            }
        }.bind(this),{type:"prop"})
        return true;
    },
    onEnterTransitionDidFinish: function () {
        this._super();
    },

    onExit: function () {
        this._super();
    },
});

// =========================[[ 判断 ]] =========================

PlayLayer_doudizhuGZ.prototype.isJD = function () {
    return (MjClient.data.sData.tData.areaSelectMode.type == "jingdian");
};

PlayLayer_doudizhuGZ.prototype.isRoundEnd = function () {
    var tState = MjClient.data.sData.tData.tState;
    return tState == TableState.waitReady || tState == TableState.roundFinish || tState == TableState.waitJoin || tState == TableState.isReady;
};

PlayLayer_doudizhuGZ.prototype.isJinBiChang = function () {
    return MjClient.data.sData && MjClient.data.sData.tData && MjClient.data.sData.tData.fieldId ? true : false;
};

// 检查出牌是否合法
PlayLayer_doudizhuGZ.prototype.isCanPutCards = function (putCards) {
    if (!this.isSDataValid()) {
        return false;
    }
    var tData = MjClient.data.sData.tData;
    if (!IsTurnToMe() || tData.tState != TableState.waitPut) {
        return false;
    }
    if (putCards == null) {
        putCards = this.handCardsWgetArr[0].getUpCardArr();
    }
    if (putCards.length == 0) {
        return false;
    }
    var pl = getUIPlayer(0);
    if (!pl) {
        return false;
    }
    var isNotFirst = tData.lastPutPlayer != tData.curPlayer && tData.lastPutPlayer != -1;
    var lastPutCards = isNotFirst ? tData.lastPutCard : null;
    var ret = MjClient.majiang.checkPut(pl.mjhand, putCards, lastPutCards)
    return ret != null;
};

// =========================[[ 出牌 ]] =========================

//出牌提示
PlayLayer_doudizhuGZ.prototype.showTipCards = function () {
    this.handCardsWgetArr[0].clearCardsUpStatus();
    var length = this.cardTipsArr.length;
    if (length <= 0) {
        return;
    }

    if (this.cardTipsArr[this.tipsIdx] == null) {
        this.tipsIdx = 0;
    }
    var tipsCardArray = this.cardTipsArr[this.tipsIdx].slice();
    this.handCardsWgetArr[0].liftCardUp(tipsCardArray);
    this.tipsIdx++;
    MjClient.playui.putCardType = 2;
    var tData = MjClient.data.sData.tData;
    var isFirst = !(tData.lastPutPlayer != tData.curPlayer && tData.lastPutPlayer != -1);
    MjClient.playui.handlePutCardBtn(true, isFirst);
    MjClient.playui.enablePutCardBtn(true);
}

// 处理斗地主智能提牌
PlayLayer_doudizhuGZ.prototype.handleDoudizhuCardsAutoUp = function (bTouchMove) {
    if (!this.isSDataValid()) {
        return ;
    }
    var tData = MjClient.data.sData.tData;
    if (!IsTurnToMe() || tData.tState != TableState.waitPut) {
        return;
    }
    var upSelectCards = this.handCardsWgetArr[0].getUpCardArr();
    if (upSelectCards.length == 0) {
        return;
    }
    if (!this.isValidAutoUpCards) {
        return;
    } // 智能提牌已经失效
    var pl = getUIPlayer(0);
    if (!pl) { return ; }
    var data = {};
    if (tData.lastPutPlayer == tData.curPlayer || tData.lastPutPlayer == -1) {// 首出
        data = MjClient.majiang.calAutoPutCardWithFirstOut(upSelectCards, pl.mjhand);
        this.isValidAutoUpCards = false;
    } else { // 接牌
        var lastPutType = MjClient.majiang.calType(tData.lastPutCard);
        if (lastPutType == MjClient.majiang.CARDTPYE.danpai) {
            return;
        } // 单牌不做自动提示
        data = MjClient.majiang.calAutoPutCards(bTouchMove, this.cardTipsArr, upSelectCards, tData.lastPutCard, pl.mjhand);
    }

    if (!data.hasCardToUp) {
        return;
    }
    this.handCardsWgetArr[0].clearCardsUpStatus();
    this.handCardsWgetArr[0].liftCardUp(data.tSelectCards);
    this.isValidAutoUpCards = false;
};

PlayLayer_doudizhuGZ.prototype.handleCardsTouchListener = function () {
    return {
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        swallowTouches: false,                       // 设置是否吞没事件，在 onTouchBegan 方法返回 true 时吞没
        onTouchBegan: function (touch, event) {
            var pl = getUIPlayer(0);
            if (!pl) return false;
            if (MjClient.playui.isTrusted()) {
                return false;
            }
            if (pl.mjState == TableState.roundFinish) { //已经完成
                return false;
            }
            if (MjClient.playui.isDouDiZhuFaPai) { return false; }
            var flag = MjClient.playui.handleTouchCards(touch, event, true);
            if (!flag) {
                MjClient.playui.handCardsWgetArr[0].clearCardsUpStatus();
                MjClient.playui.isValidAutoUpCards = true;
                MjClient.playui.enablePutCardBtn(false);
            }
            return flag;
        },
        onTouchMoved: function (touch, event) {         // 触摸移动时触发
            MjClient.playui.handleTouchCards(touch, event, false);
            if (!MjClient.playui.isSDataValid()) {
                return ;
            }
            if (MjClient.data.sData.tData.curPlayer == null || !cc.isFunction(MjClient.playui.handCardsWgetArr[0].handleTouchMoveOutOfRange)) {
                return;
            }
            MjClient.playui.handCardsWgetArr[0].handleTouchMoveOutOfRange(MjClient.playui.firstMouseIn, MjClient.playui.lastMouseIn);
        },
        onTouchEnded: function (touch, event) {         // 点击事件结束处理
            playEffectInPlay("clickCards");
            if (Math.abs(MjClient.playui.lastMouseIn - MjClient.playui.firstMouseIn + 1) >= 2) {
                MjClient.playui.bTouchMove = true;
            }
            MjClient.playui.putCardType = 1;
            if (MjClient.data.sData.tData.curPlayer == null || !cc.isFunction(MjClient.playui.handCardsWgetArr[0].handleTouchMoveOutOfRange)) {
                return;
            }
            MjClient.playui.handCardsWgetArr[0].updatePostionInMoveRange(MjClient.playui.firstMouseIn, MjClient.playui.lastMouseIn);
            MjClient.playui.handleDoudizhuCardsAutoUp(MjClient.playui.bTouchMove);
            MjClient.playui.enablePutCardBtn(MjClient.playui.isCanPutCards());
        }
    };
};

// 处理点击
PlayLayer_doudizhuGZ.prototype.handleTouchCards = function (touch, event, isBegan) {
    MjClient.playui.bTouchMove = !isBegan;
    var lastMouseIn = MjClient.playui.handCardsWgetArr[0].getSelectCardsIdx(touch.getLocation());
    if (lastMouseIn > -1) {
        MjClient.playui.lastMouseIn = lastMouseIn;
        MjClient.playui.firstMouseIn = isBegan ? lastMouseIn : MjClient.playui.firstMouseIn;
        return true;
    }
    return false;
};

// 处理玩家提起提起得牌，保留正确的牌
PlayLayer_doudizhuGZ.prototype.handleUpRightCards = function (isFirst, off) {
    if (isFirst) {
        return;
    }
    var upSelectCards = this.handCardsWgetArr[off].getUpCardArr();
    var tCards = MjClient.playui.isCanPutCards(upSelectCards);
    if (tCards == null) {
        this.handCardsWgetArr[off].clearCardsUpStatus();
    }
}

// =========================[[ 流程 ]] =========================
// 断线重连/初始化
PlayLayer_doudizhuGZ.prototype.dealInitSceneData = function () {
    if (!this.isSDataValid()) {
        return ;
    }
    var tData = MjClient.data.sData.tData;
    var tState = tData.tState;
    cc.log("===dealInitSceneData==tData.tState==" + tData.tState);

    MjClient.playui.initData(tState == TableState.roundFinish ? true : false);
    var isRoundEnd = MjClient.playui.isRoundEnd()
    for (var i = 0; i < this.headOffLen; i++) {
        var off = this.headOffArr[i];
        MjClient.playui.handleNoPutTag(off, false);
        MjClient.playui.handleJiabeiTag(off, 0);
        MjClient.playui.dealQiangDizhuText(off, false);
        if (!isRoundEnd) {
            continue;
        }
        this.handCardsWgetArr[off].removeAllCards();
        this.deskCardsWgetArr[off].removeAllCards();
    }

    MjClient.playui.dealTrust();
    MjClient.playui.handleDifen();
    MjClient.playui.setTextMult(tState != TableState.waitJoin && tState != TableState.waitReady);
    // 发牌、叫地主、发底牌、加注、等待出牌
    MjClient.playui.handleMjHand();
    MjClient.playui.dealWaitJiaodizhu({curPlayer: tData.curPlayer, mustJiao: tData.mustJiao}, true);
    MjClient.playui.dealDiCards(tData.zhuang, tData.diCards, {}, false, false);
    MjClient.playui.dealWaitJiazhu({zhuang: tData.zhuang}, true, false);
    for (var i = 0; i < this.headOffLen; i++) {
        var off = this.headOffArr[i];
        var pl = getUIPlayer(off);
        if (pl == null) continue;
        MjClient.playui.dealMJJiazhu(true, off, pl.jiazhuNum, tData.curPlayer);
    }
    if (!isRoundEnd && tData.lastPutCard != null && tData.lastPutCard.length > 0) {
        var off = getOffByIndex(tData.lastPutPlayer);
        this.deskCardsWgetArr[off].addPutCards(tData.lastPutCard);
    }
    MjClient.playui.dealWaitPut({}, true);
};

PlayLayer_doudizhuGZ.prototype.dealChangePKImg = function () {
    MjClient.playui.handleDoudizhuDiCards();
    this.handCardsWgetArr[0].changPkImageBack(getCurrentPKImgType());
    for (var i = 0; i < this.headOffLen; i++) {
        var off = this.headOffArr[i];
        this.deskCardsWgetArr[off].changPkImageBack(getCurrentPKImgType());
    }
};

// 结算
PlayLayer_doudizhuGZ.prototype.dealRoundEnd = function (eD) {
    if (!this.isSDataValid()) {
        return ;
    }
    MjClient.playui.endInfo = {};
    var jiaZhuNums = {};
    for (var i = 0; i < this.headOffLen; i++) {
        var off = this.headOffArr[i];
        var pl = getUIPlayer(off);
        jiaZhuNums[pl.info.uid + ""] = pl.jiazhuNum;
    }
    MjClient.playui.endInfo.jiaZhuNums = jiaZhuNums;
    var tData = MjClient.data.sData.tData;
    MjClient.playui.endInfo.diFen = tData.areaSelectMode.type == "jingdian" ? tData.minJiaofen:tData.qiangRate;
    var zhuang = tData.zhuang;
    MjClient.playui.initData(true);
    MjClient.clockNode.visible = false;
    var self = MjClient.playui.node;
    function delayExe() {
        MjClient.playui.dealInitSceneData();
        var sData = MjClient.data.sData;
        var tData = sData.tData;
        if (sData.tData.roundNum <= 0 && !MjClient.playui.isJinBiChang()) {
            if (!tData.matchId) {
                self.addChild(new GameOverLayer_doudizhu(), 500);
            } else {
                self.runAction(cc.sequence(cc.delayTime(3), cc.callFunc(function () {
                    self.addChild(new GameOverLayer_doudizhu(), 500);
                })))
            }
        }
        if (MjClient.playui.isJinBiChang()) {
            self.addChild(new EndOneView_GoldFiled(zhuang), 500);
        } else {
            self.addChild(new EndOneView_doudizhuGZ(zhuang), 500);
        }
    }

    var time = MjClient.data.sData.tData.roundNum <= 0 ? 0.2 : 1;
    var Anitime = MjClient.playui.AniLayer.getAniTime();
    if (Anitime) {
        time = Anitime + 0.6;
    }
    if (MjClient.playui.isJinBiChang()) {
        //金币场需要延迟2秒到小结算
        if(time < 2) {
            time = 2;
        }
        for (var i = 0; i < this.headOffLen; i++) {
            var off = this.headOffArr[i];
            var pl = getUIPlayer(off);
            if (pl == null) {
                continue;
            }
            MjClient.playui.handleNoPutTag(off, false);
            if (off != 0) {
                if (pl.mjhand.length != 0) {
                    this.deskCardsWgetArr[off].node.runAction(cc.sequence(cc.DelayTime(time - 0.6), cc.callFunc(function(){
                        this.removeAllCards();
                        var tmpOff = this.getOff();
                        var tmpPl = getUIPlayer(tmpOff);
                        this.addPutCards(tmpPl.mjhand, true);
                    }.bind(this.deskCardsWgetArr[off]))));
                } else {
                    this.deskCardsWgetArr[off].node.runAction(cc.sequence(cc.DelayTime(time - 0.6), cc.callFunc(function(){
                        this.removeAllCards();
                    }.bind(this.deskCardsWgetArr[off]))));
                }
            } else {
                this.deskCardsWgetArr[off].node.runAction(cc.sequence(cc.DelayTime(time - 0.6), cc.callFunc(function(){
                    this.removeAllCards();
                }.bind(this.deskCardsWgetArr[off]))));
            }
        }
    }
    this.runAction(cc.sequence(cc.DelayTime(time), cc.callFunc(delayExe)));
    MjClient.playui.killTimeClock();
};

// 过、准备
PlayLayer_doudizhuGZ.prototype.dealPKPass = function (eD) {
    MjClient.playui.killTimeClock();
    MjClient.clockNode.visible = false;
    var off = getUiOffByUid(eD.uid);
    if (eD.activePass == null || eD.activePass == -1) {
        MjClient.playui.handleAboutReady(off); // 准备
    } else { // 过牌
        playEffectInPlay("pass");
        MjClient.playui.handleNoPutTag(off, true);
        MjClient.playui.handleNoPutTips(false);
    }
}
// 出牌
PlayLayer_doudizhuGZ.prototype.dealPKPut = function (msg) {
    var tData = MjClient.data.sData.tData;
    tData.rate = msg.rate;
    MjClient.playui.setTextMult(true);
    //隐藏出牌按钮
    MjClient.playui.handleHimtAndNoPutBtn(false);
    MjClient.playui.handlePutCardBtn(false);
    var index = tData.uids.indexOf(msg.uid);
    var off = getOffByIndex(index);
    if (msg.autoSend || msg.uid != SelfUid() || MjClient.rePlayVideo != -1) {
        MjClient.playui.dealPKPutcard(off, msg);
    }
    if (msg.uid == SelfUid() && MjClient.rePlayVideo == -1) { //正常打牌会出现少牌的情况，这里做验证，回放不用验证
        var pl = getUIPlayer(0);
        if (pl && this.handCardsWgetArr[0].countCards() != pl.handCount) {
            this.handCardsWgetArr[0].initHandCards();
        }
    }
    var pl = getUIPlayer(off);
    if (pl == null) {
        return;
    }
    if (pl.handCount == 1) {
        playEffectInPlay("singer");
    }
}

// 等待出牌
PlayLayer_doudizhuGZ.prototype.dealWaitPut = function (eD, isSceneData) {
    var tData = MjClient.data.sData.tData;
    if (tData.tState != TableState.waitPut) {
        MjClient.playui.handleNoPutTips(false);
        MjClient.playui.handleHimtAndNoPutBtn(false);
        MjClient.playui.handlePutCardBtn(false);
        MjClient.playui.handlePassBtn(false);
        return;
    }
    this.isValidAutoUpCards = true;
    if (eD && eD.trustBeginTime) {
        tData.trustBeginTime = eD.trustBeginTime;
    }
    var off = getOffByIndex(tData.curPlayer);
    this.deskCardsWgetArr[off].removeAllCards();
    var isMe = off == 0;
    var isNotFirst = tData.lastPutPlayer != tData.curPlayer && tData.lastPutPlayer != -1;
    this.cardTipsArr = [];
    if (isMe) {
        var pl = getUIPlayer(0);
        if (pl) {
            if (!isNotFirst) {
                tData.lastPutCard = null;
            }
            this.cardTipsArr = MjClient.majiang.tipCards(pl.mjhand, tData.lastPutCard);
            this.tipsIdx = 0;
        }
    }
    MjClient.playui.handleNoPutTips(isMe && isNotFirst && this.cardTipsArr.length == 0);
    MjClient.playui.handleNoPutTag(off, false);
    MjClient.playui.handleUpRightCards(!isNotFirst, off);
    MjClient.playui.isCardsSend = false;
    var isFirstPut = tData.lastPutPlayer == -1 ? true : false;
    if (isFirstPut) {
        var autofunc = function () {
            for (var i = 0; i < MjClient.playui.headOffLen; i++) {
                var off = MjClient.playui.headOffArr[i];
                MjClient.playui.handleJiabeiTag(off, 0);
            }
        }
        var autofunc2 = function () {
            MjClient.playui.startTimeClock(MjClient.playui.clockNumberUpdate, isSceneData);
            MjClient.playui.handleHimtAndNoPutBtn(isMe, isNotFirst);
            MjClient.playui.handlePutCardBtn(isMe, !isNotFirst);
            MjClient.playui.enablePutCardBtn(MjClient.playui.isCanPutCards());
        }
        MjClient.playui.node.runAction(cc.sequence(cc.DelayTime(1.0), cc.callFunc(autofunc), cc.callFunc(autofunc2)));
        return;
    }
    MjClient.playui.node.stopAllActions();
    MjClient.playui.startTimeClock(MjClient.playui.clockNumberUpdate, isSceneData);
    var isCanPut = !(isMe && isNotFirst && this.cardTipsArr.length == 0);
    if (isCanPut) {
        MjClient.playui.handleHimtAndNoPutBtn(isMe, isNotFirst);
        MjClient.playui.handlePutCardBtn(isMe, !isNotFirst);
        MjClient.playui.enablePutCardBtn(MjClient.playui.isCanPutCards());
        MjClient.playui.handlePassBtn(false);
    } else {
        MjClient.playui.handlePassBtn(true);
    }
};

// 等待叫地主
PlayLayer_doudizhuGZ.prototype.dealWaitJiaodizhu = function (msg, isSceneData) {
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    if ((tData.tState != TableState.waitJiazhu && tData.tState != TableState.waitCard) || tData.zhuang != -1) {
        MjClient.playui.setHuanLeBtnVisible(false);
        MjClient.playui.setJingDianBtnVisible(false);
        return;
    }
    
    tData.curPlayer = msg.curPlayer;
    var off = getOffByIndex(msg.curPlayer);
    var node = getNode_cards(off);
    var diZhuTag = node.getChildByName("jiaodizhuTag");
    diZhuTag.visible = false;

    if (tData.uids[msg.curPlayer] == SelfUid()) {
        if (!MjClient.playui.isJD()) { //欢乐斗地主
            MjClient.playui.setHuanLeBtnVisible(true);
        } else {  //经典斗地主
            MjClient.playui.setJingDianBtnVisible(true, true, tData.minJiaofen, msg.mustJiao);
        }
    } else {
        MjClient.playui.setHuanLeBtnVisible(false);
        MjClient.playui.setJingDianBtnVisible(false);
    }
    tData.rate = msg.rate;
    MjClient.playui.setTextMult(true);
    if (msg && msg.trustBeginTime) {
        tData.trustBeginTime = msg.trustBeginTime;
    }
    MjClient.playui.startTimeClock(MjClient.playui.clockNumberUpdate, isSceneData);
}

// 抢地主
PlayLayer_doudizhuGZ.prototype.dealQiangDizhu = function (msg) {
    var tData = MjClient.data.sData.tData;
    if (typeof (msg.curPlayer) != "undefined") {
        tData.curPlayer = msg.curPlayer;
    }
    if (msg.qiang) {
        tData.rate = msg.rate;
        MjClient.playui.setTextMult(true);
    }
    MjClient.playui.killTimeClock();
    MjClient.clockNode.visible = false;
    var off = getOffByIndex(tData.curPlayer);
    var pl = getUIPlayer(off);

    if (pl != null) {
        pl.qiang = msg.qiang;
    }
    tData.hasJiao = msg.hasJiao;
    MjClient.playui.dealQiangDizhuText(off, true);
    MjClient.playui.setHuanLeBtnVisible(false);
    MjClient.playui.setJingDianBtnVisible(false);
    MjClient.clockNode.visible = false;
    if (MjClient.playui.isJinBiChang()) {
        MjClient.playui.handleDifen();
    }
}

// 等待准备
PlayLayer_doudizhuGZ.prototype.dealAllReady = function (bAllReady) {
    for (var i = 0; i < this.headOffLen; i++) {
        var off = this.headOffArr[i];
        MjClient.playui.handleAboutReady(off, bAllReady);
    }
};

// 加倍
PlayLayer_doudizhuGZ.prototype.dealMJJiazhu = function (isSceneData, off, jiazhuNum, curPlayer) {
    var tData = MjClient.data.sData.tData;
    if (typeof (curPlayer) != "undefined") {
        tData.curPlayer = curPlayer;
    }
    if (MjClient.playui.isJinBiChang()) {
        if (!isSceneData) {
            var pl = getUIPlayer(off);
            if (pl) {
                pl.jiazhuNum = jiazhuNum;
            }
        }
        if (tData.tState == TableState.waitJiazhu) {
            MjClient.playui.handleJiabeiTag(off, jiazhuNum);
        } else {
            this.headNode[off].setJiaBeiIcon(jiazhuNum == 2, jiazhuNum);
        }
        MjClient.playui.ShowWaittingJiabei();
        if (off == 0 && jiazhuNum != 0 && tData.tState == TableState.waitJiazhu) {
            MjClient.playui.killTimeClock();
            MjClient.clockNode.visible = false;
        }
        var bcanMove = true;
        for (var i = 0; i < this.headOffLen; i++) {
            var tmpoff = this.headOffArr[i];
            var pl = getUIPlayer(tmpoff);
            if (pl && pl.jiazhuNum == 0) {
                bcanMove = false;
            }
        }
        if (bcanMove && !isSceneData) {
            for (var i = 0; i < this.headOffLen; i++) {
                var tmpoff = this.headOffArr[i];
                var pl = getUIPlayer(tmpoff);
                if (pl) {
                    MjClient.playui.showJiabeiTagMove(tmpoff, pl.jiazhuNum);
                }
            }
        }
    } else {
        if (!isSceneData) {
            var pl = getUIPlayer(off);
            if (pl) {
                pl.jiazhuNum = jiazhuNum;
            }
        }
        var btmp = (tData.tState == TableState.waitJiazhu) ? jiazhuNum : 0;
        MjClient.playui.handleJiabeiTag(off, btmp);
        this.headNode[off].setJiaBeiIcon(jiazhuNum == 2, jiazhuNum);
    }
    if (!isSceneData) {
        if (tData.zhuang != -1) {
            if(MjClient.playui.isJinBiChang() && jiazhuNum == 4){
                playEffectInPlay('superjiabei');
            }else{
                playEffectInPlay(jiazhuNum == 1 ? "bujiabei" : "jiabei");
            }
        }
        if (off == 0) {
            MjClient.playui.setHLJiabeiVisible(false);
        }
        MjClient.playui.dealQiangDizhuText(off, false);
        MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Dingwei", {
            uid: SelfUid(),
            gameType: MjClient.gameType
        });
    }
};

// 等待加倍
PlayLayer_doudizhuGZ.prototype.dealWaitJiazhu = function (eD, isSceneData, isIconMove) {
    var tData = MjClient.data.sData.tData;
    tData.zhuang = eD.zhuang;
    var pl = getUIPlayer(0);
    if (!pl) { return ; }
    if (tData.tState != TableState.waitJiazhu || tData.zhuang == -1 || pl.jiazhuNum != 0 || pl.trust) {
        MjClient.playui.setHLJiabeiVisible(false);
        return;
    }
    var func1 = function () {
        var zhuangOff = getOffByIndex(eD.zhuang);
        for (var i = 0; i < MjClient.playui.headOffLen; i++) {
            var off = MjClient.playui.headOffArr[i];
            MjClient.playui.dealQiangDizhuText(off, false);
            var pl = getUIPlayer(off);
            var isZhuang = false;
            if (pl) {
                isZhuang = tData.uids[tData.zhuang] == pl.info.uid;
            }
            MjClient.playui.headNode[off].setIconDiZhu(isZhuang);
            if (!isIconMove || zhuangOff != off) {
                continue;
            }
            var node = getNode_cards(off);
            var centerPos = node.convertToNodeSpace(cc.p(MjClient.size.width / 2, MjClient.size.height / 2));
            MjClient.playui.headNode[off].iconMoveToDiZhu(off, centerPos);
        }
    }
    var hideFunc = function () {
        MjClient.playui.setHLJiabeiVisible(false);
    }
    MjClient.playui.node.runAction(cc.sequence(cc.callFunc(hideFunc), cc.DelayTime(0.5),cc.callFunc(func1),cc.DelayTime(0.9), cc.callFunc(function(){
        if (MjClient.rePlayVideo == -1) {
            var plMe = getUIPlayer(0);
            if (plMe && plMe.jiazhuNum == 0) {
                MjClient.playui.setHLJiabeiVisible(true);
            }
        }
    })));
    if (MjClient.playui.isJinBiChang()) { //不确定房卡版是不是也需要这样，暂时先不做,
        if (eD && eD.trustBeginTime) {
            tData.trustBeginTime = eD.trustBeginTime;
        }
        MjClient.playui.startTimeClock(MjClient.playui.clockNumberUpdate, isSceneData, 0);
    }
}

// 处理手牌
PlayLayer_doudizhuGZ.prototype.handleMjHand = function (isSendCard) {
    MjClient.playui.showGps();
    MjClient.playui.handleNoPutTips(false);
    MjClient.playui.dealAllReady();
    MjClient.playui.updateGameRound();
    for (var i = 0; i < this.headOffLen; i++) {
        var off = this.headOffArr[i];
        MjClient.playui.dealQiangDizhuText(off, false, isSendCard);
        MjClient.playui.initUserHandUiDoudizhu(off);
        var pl = getUIPlayer(off);
        if (!pl) { continue; }
        this.headNode[off].updateUserInfo(pl);
    }
    if (isSendCard && this.isJinBiChang()) {
        this.showPostCardAnimation();
    }

    // 发牌后再显示GPS按钮
    var tData = MjClient.data.sData.tData;
    var stateValid = (tData.tState != TableState.waitJoin && 
        tData.tState != TableState.roundFinish && 
        tData.tState != TableState.waitReady);
    var isHaveGPS = stateValid && MjClient.MaxPlayerNum > 2 && !MjClient.playui.isJinBiChang();
    this.node.getChildByName("gps_btn").setVisible(isHaveGPS);
}
PlayLayer_doudizhuGZ.prototype.showPostCardAnimation = function () {
    var  isHaveRes = jsb.fileUtils.isFileExist('playing/shaoyangOptimize/PAIBEI.png');
    if (isHaveRes && MjClient.rePlayVideo == -1) {
        MjClient.playui.isDouDiZhuFaPai = true;
        this.handCardsWgetArr[0].postCardAni();
        // 给其他玩家发牌动画
        for (var i = 0; i < this.headOffLen; i++) {
            var off = this.headOffArr[i];
            if (off ==0) { continue; }
            postCardsToOther(off,17);
        }
        var sendCardEffectFunc = function (times) {
            if(times < 0 ) return;
            MjClient.playui.runAction(cc.sequence(cc.DelayTime(times),cc.callFunc(function(){
                playEffectInPlay("sendcard");
            })));
            times -= 0.4;
            sendCardEffectFunc(times);
        };
        sendCardEffectFunc(0.4);
    }
}
// 处理底牌
PlayLayer_doudizhuGZ.prototype.dealDiCards = function (zhuang, diCards, handCounts, isAddCards, isIconMove) {
    var tData = MjClient.data.sData.tData;
    tData.zhuang = zhuang;
    tData.diCards = diCards == null ? [] : diCards;
    var zhuangOff = getOffByIndex(zhuang);
    if (isAddCards) {
        MjClient.playui.addDiCardsToZhuang(zhuangOff);
    }
    MjClient.playui.handleDoudizhuDiCards();
    MjClient.playui.handleDifen();
    MjClient.clockNode.visible = false;
    for (var i = 0; i < this.headOffLen; i++) {
        var off = this.headOffArr[i];
        var pl = getUIPlayer(off);
        var isZhuang = false;
        if (pl) {
            isZhuang = tData.uids[tData.zhuang] == pl.info.uid;
            pl.handCount = handCounts[pl.info.uid] ? handCounts[pl.info.uid] : pl.handCount;
        }
        if (!isAddCards) {
            this.headNode[off].setIconDiZhu(isZhuang);
        }
        if (!tData.areaSelectMode.jiabei && MjClient.playui.isJD()) {
            MjClient.playui.dealQiangDizhuText(off, false);
        }
        this.headNode[off].showCurrentLeftCardCount(off != 0 ? pl : null, true);

        if (!isIconMove || zhuangOff != off) {
            continue;
        }
        if (!tData.areaSelectMode.jiabei && MjClient.playui.isJD() && !MjClient.playui.isJinBiChang()) {
            var node = getNode_cards(off);
            var centerPos = node.convertToNodeSpace(cc.p(MjClient.size.width / 2, MjClient.size.height / 2));
            this.headNode[off].iconMoveToDiZhu(off, centerPos);
        }
    }
    MjClient.playui.handleMutiple(!isIconMove);
};

//处理托管 1：托管，2：非托管
PlayLayer_doudizhuGZ.prototype.dealTrust = function (msg, cbTrust) {
    if (msg != undefined) {
        var tData = MjClient.data.sData.tData;
        if (!MjClient.playui.isJinBiChang()) {
            return;
        }
        var index = tData.uids.indexOf(msg.uid);
        var off = getOffByIndex(index);
        var pl = getUIPlayer(off);
        if (pl) {
            pl.trust = (cbTrust == 1 ? true : false);
            this.headNode[off].setUserTrust(pl);
        }
        if (off === 0) {
            this._ctTuoGuan.visible = (cbTrust == 1);
            this.btnTrust.visible = (cbTrust == 1);
            this._panelTrust.visible = (cbTrust == 1);
            this.btnTuoGuan.enabled = !(cbTrust == 1);

            if (tData.tState == TableState.waitJiazhu && pl.jiazhuNum == -1 && cbTrust != 1) {
                MjClient.playui.setHLJiabeiVisible(true);
            } else {
                MjClient.playui.setHLJiabeiVisible(false);
            }
        }
    } else {
        for (var i = 0; i < this.headOffLen; i++) {
            var off = this.headOffArr[i];
            var pl = getUIPlayer(off);
            this.headNode[off].setUserTrust(pl);
        }
        var pl = getUIPlayer(0);
        if (pl) {
            this.btnTrust.visible = pl.trust;
            this._ctTuoGuan.visible = pl.trust;
            this._panelTrust.visible = pl.trust;
        }
    }
};

// =========================[[ 小控件 ]] ========================
PlayLayer_doudizhuGZ.prototype.updateUserHeadPosition = function (off, bRoundEnd) {
    var node = this.headParentNode[off];
    if (off == 0) {
        if (bRoundEnd) {
            setWgtLayout(node, [0.43, 0.43], [0.5, 0.24], [0, 0]);
        } else if (isIPhoneX()) {
            setWgtLayout(node, [0.43, 0.43], [0.07, 0.43], [0, 0]);
        } else {
            setWgtLayout(node, [0.43, 0.43], [0.041, 0.40], [0, 0]);
        }
    } else if (off == 1) {
        if (bRoundEnd) {
            setWgtLayout(node, [0.43, 0.43], [0.85, 0.53], [0, 0]);
        } else {
            setWgtLayout(node, [0.43, 0.43], [0.958, 0.75], [0, 0]);
        }
    } else if (off == 2) {
        if (bRoundEnd) {
            setWgtLayout(node, [0.43, 0.43], [0.14, 0.53], [0, 0]);
        } else if (isIPhoneX()) {
            setWgtLayout(node, [0.43, 0.43], [0.07, 0.75], [0, 0]);
        } else {
            setWgtLayout(node, [0.43, 0.43], [0.041, 0.75], [0, 0]);
        }
    } else if (off == 3) {
        setWgtLayout(node, [0.43, 0.43], [0.5, 0.5], [0, 0]);
    }
};

PlayLayer_doudizhuGZ.prototype.updateTimes = function () {
    var times = this._banner.getChildByName("bg_time");
    var text = new ccui.Text();
    text.setFontName("fonts/lanting.ttf");
    text.setFontSize(18);

    text.setAnchorPoint(1, 0.5);
    text.setPosition(60, 10);
    times.addChild(text);
    text.schedule(function () {
        var time = MjClient.getCurrentTime();
        var str = (time[3] < 10 ? "0" + time[3] : time[3]) + ":" +
            (time[4] < 10 ? "0" + time[4] : time[4]);
        this.setString(str);
    });
};

//设置地区信息
PlayLayer_doudizhuGZ.prototype.showGameName = function () {
    var gameName = this.node.getChildByName("gameName");
    setWgtLayout(gameName, [0.25, 0.25], [0.49, 0.58], [0, 0]);
    var text = GameBg[MjClient.gameType];
    if (MjClient.playui.isJinBiChang()) {
        text = "playing/gameTable/game_doudizhuJZ_jb.png";
    }
    gameName.loadTexture(text);
};

//添加还背景的功能
PlayLayer_doudizhuGZ.prototype.addChangeBg = function () {
    var btnChange = ccui.Button("playing/gameTable/DDZ/btn_changeBg_normal.png", "playing/gameTable/DDZ/btn_changeBg_press.png");
    var btnSetting = this._banner.getChildByName("setting");

    btnChange.setPosition(btnSetting.x - 70, btnSetting.y);
    btnChange.setScale(btnSetting.getScale());
    btnChange.setName("btnChange");
    this._banner.addChild(btnChange);
    btnChange.addTouchEventListener(function (sender, type) {
        if (type == 2) {
            setCurrentGameBgTypeToNext();
            postEvent("changeGameBgEvent");
            if (MjClient.playui.isJinBiChang()) {
                MjClient.native.umengEvent4CountWithProperty("Jinbichang_Fangjiannei_Huanfu", {
                    uid: SelfUid(),
                    gameType: MjClient.gameType
                });
            } else {
                MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Pifu", {
                    uid: SelfUid(),
                    gameType: MjClient.gameType
                });
            }
        }
    }, this);
};

PlayLayer_doudizhuGZ.prototype.showVoice = function () {
    var voice_btn = this.node.getChildByName("voice_btn");
    initVoiceData();
    voice_btn.addTouchEventListener(function (sender, type) {
        if (type == 0) {
            if (MjClient.playui.isJinBiChang()) {
                MjClient.native.umengEvent4CountWithProperty("Jinbichang_Fangjiannei_Yuyin", {
                    uid: SelfUid(),
                    gameType: MjClient.gameType
                });
            }
            startRecord();
        } else if (type == 2) {
            endRecord();
        } else if (type == 3) {
            cancelRecord();
        }
    });
    if (MjClient.MaxPlayerNum > 2) {
        setWgtLayout(voice_btn, [0.09, 0.09], [0.97, MjClient.playui.isJinBiChang() ? 0.2 : 0.3], [0, 3.5]);
    } else {
        setWgtLayout(voice_btn, [0.09, 0.09], [0.97, 0.2], [0, 4.2]);
    }
};

PlayLayer_doudizhuGZ.prototype.addWaitNode = function () {
    if (!MjClient.playui.isJinBiChang()) {
        this.waitNode = new PokerWaitNode_Doudizhu();
        this.waitNode.node.setPosition(cc.p(0, 0));
        MjClient.playui.node.addChild(this.waitNode.node);
    }
};

PlayLayer_doudizhuGZ.prototype.setWaitNodeVisible = function (bVisible) {
    if (MjClient.playui.isJinBiChang() || !MjClient.playui.waitNode) {
        return;
    }
    MjClient.playui.waitNode.setVisible(bVisible);
}

PlayLayer_doudizhuGZ.prototype.addAniLayer = function () {
    this.AniLayer = new Animature_doudizhu();
    MjClient.playui.node.addChild(this.AniLayer, 1000);
    setWgtLayout(this.AniLayer, [1, 1], [0, 0], [0, 0]);
};

PlayLayer_doudizhuGZ.prototype.showTableID = function (bShow) {
    var textTableId = this._banner.getChildByName("tableid");
    textTableId.ignoreContentAdaptWithSize(true);
    textTableId.setString("房间号  " + MjClient.data.sData.tData.tableid);
};

PlayLayer_doudizhuGZ.prototype.setHLJiabeiVisible = function (bVisible) {
    var btnJiaBei = this.node.getChildByName("BtnJiabei");
    var btnBuJiaBei = this.node.getChildByName("Btnbujiabei");
    var btnSuperJiaBei = this.node.getChildByName("Btnsuperjiabei");
    btnJiaBei.visible = bVisible;
    btnBuJiaBei.visible = bVisible;
    btnSuperJiaBei.visible = bVisible;
    if (!bVisible) {
        return;
    }
    var d = isIPhoneX() ? 0.02 : 0;
    if(MjClient.playui.isJinBiChang()){
        //超级加倍按钮显示初始化
        var tip_duihuan = btnSuperJiaBei.getChildByName('tip_duihuan');
        tip_duihuan.visible = false;
        var tip_num = btnSuperJiaBei.getChildByName('tip_num');
        tip_num.visible = false;
        var text_num = tip_num.getChildByName('text_num');
        text_num.ignoreContentAdaptWithSize(true);
        var text_cost = tip_duihuan.getChildByName('text');
        text_cost.ignoreContentAdaptWithSize(true);

        if(MjClient.data.pinfo.doubleCard > 0){
            tip_num.visible = true;
            text_num.setString(MjClient.data.pinfo.doubleCard);
        }else{
            tip_duihuan.visible = true;
            text_cost.setString(this.doubleCardData.amount + '金币兑换');
        }

        setWgtLayout(btnSuperJiaBei, [0.14, 0.14], [0.3, 0.42 + d], [0, 0]);
        setWgtLayout(btnJiaBei, [0.14, 0.14], [0.5, 0.42 + d], [0, 0]);
        setWgtLayout(btnBuJiaBei, [0.14, 0.14], [0.7, 0.42 + d], [0, 0]);
    }else{
        btnSuperJiaBei.visible = false;
        setWgtLayout(btnJiaBei, [0.14, 0.14], [0.6, 0.42 + d], [0, 0]);
        setWgtLayout(btnBuJiaBei, [0.14, 0.14], [0.4, 0.42 + d], [0, 0]);
    }
};

// 出牌按钮
PlayLayer_doudizhuGZ.prototype.handlePutCardBtn = function (isVisible, isFirst) {
    var btnPutCard = this.node.getChildByName("BtnPutCard");
    isVisible = MjClient.data.sData.tData.tState == TableState.waitPut && isVisible;
    btnPutCard.visible = isVisible
    if (!isVisible) {
        return;
    }
    var d = isIPhoneX() ? 0.02 : 0;
    if (isFirst) {
        setWgtLayout(btnPutCard, [0.135, 0.128], [0.60, 0.44 + d], [0, 0]);
    } else {
        setWgtLayout(btnPutCard, [0.135, 0.128], [0.65, 0.44 + d], [0, 0]);
    }
    this.enablePutCardBtn(false);
};

PlayLayer_doudizhuGZ.prototype.enablePutCardBtn = function (bAble) {
    var btnPutCard = this.node.getChildByName("BtnPutCard");
    if (!IsTurnToMe()) { return ;}
    if (!btnPutCard.visible) { return ;}
    btnPutCard.setBright(bAble);
    btnPutCard.setTouchEnabled(bAble);
}

//操作按钮(提示和不出)
PlayLayer_doudizhuGZ.prototype.handleHimtAndNoPutBtn = function (isVisible, isAble) {
    var btnHimt = this.node.getChildByName("BtnHimt");
    var btnNoPut = this.node.getChildByName("BtnNoPut");

    btnNoPut.visible = isVisible && isAble;
    btnHimt.visible = isVisible;
    if (!isVisible) {
        return;
    }
    var d = isIPhoneX() ? 0.02 : 0;
    if (!isAble) {
        setWgtLayout(btnHimt, [0.135, 0.128], [0.40, 0.43 + d], [0, 0]);
    } else {
        setWgtLayout(btnHimt, [0.135, 0.128], [0.5, 0.43 + d], [0, 0]);
        setWgtLayout(btnNoPut, [0.135, 0.128], [0.35, 0.43 + d], [0, 0]);
    }
};

//经典斗地主叫分按钮
PlayLayer_doudizhuGZ.prototype.setJingDianBtnVisible = function (bVisible, buJiaoAble, score, bmustjiao) {
    var btnBuJiaoJD = this.node.getChildByName("Btnbujiao_JD")
    btnBuJiaoJD.visible = bVisible;
    btnBuJiaoJD.setBright(bVisible);
    btnBuJiaoJD.setTouchEnabled(bVisible);

    var d = isIPhoneX() ? 0.02 : 0;
    if (bVisible) {
        setWgtLayout(btnBuJiaoJD, [0.135, 0.128], [0.29, 0.42 + d], [0, 0]);
        if (!MjClient.data.sData.tData.hasJiao) {
            btnBuJiaoJD.loadTextureNormal("playing/doudizhu/buqiang.png");
        } else {
            btnBuJiaoJD.loadTextureNormal("playing/doudizhu/buqiangtongyong.png");
        }
    }
    var arr = [0.43, 0.57, 0.71];
    for (var i = 0; i < 3; i++) {
        var tmp = i + 1;
        var btnFen = this.node.getChildByName("Btnfen" + tmp);
        if (btnFen == null) {
            continue;
        }
        btnFen.visible = bVisible;
        if (!bVisible) {
            continue;
        }

        setWgtLayout(btnFen, [0.135, 0.128], [arr[i], 0.42 + d], [0, 0]);
        if ((bmustjiao) && i < 2) {
            btnFen.setBright(false);
            btnFen.setTouchEnabled(false);
            btnBuJiaoJD.setBright(false);
            btnBuJiaoJD.setTouchEnabled(false);
        } else {
            btnFen.setBright(score < tmp);
            btnFen.setTouchEnabled(score < tmp);
        }

    }
};

//欢乐斗地主叫分按钮
PlayLayer_doudizhuGZ.prototype.setHuanLeBtnVisible = function (bVisible) {
    var btnJiaoDiZhu = this.node.getChildByName("BtnJiaodizhu");
    var btnBuJiao = this.node.getChildByName("Btnbujiao");
    btnJiaoDiZhu.visible = bVisible;
    btnBuJiao.visible = bVisible;
    if (!bVisible) {
        return;
    }
    var d = isIPhoneX() ? 0.02 : 0;
    setWgtLayout(btnJiaoDiZhu, [0.135, 0.128], [0.4, 0.42 + d], [0, 0]);
    setWgtLayout(btnBuJiao, [0.135, 0.128], [0.6, 0.42 + d], [0, 0]);
    if (!MjClient.data.sData.tData.hasJiao) {
        btnJiaoDiZhu.loadTextureNormal("playing/doudizhu/qiangdizhu.png");
        btnBuJiao.loadTextureNormal("playing/doudizhu/buqiang.png");
    } else {
        btnJiaoDiZhu.loadTextureNormal("playing/doudizhu/qiangdizhutongyong.png");
        btnBuJiao.loadTextureNormal("playing/doudizhu/buqiangtongyong.png");
    }
};

// 牌局信息
PlayLayer_doudizhuGZ.prototype.showRoundInfo = function () {
    if (!this.isSDataValid()) {
        return ;
    }
    var nodeRoundInfo = this.node.getChildByName("round_info_node");
    var textRoundInfo = nodeRoundInfo.getChildByName("roundInfo");

    var tData = MjClient.data.sData.tData;
    var str = ""
    if (!MjClient.playui.isJinBiChang()) {
        str = getPlaySelectPara(MjClient.gameType, tData.areaSelectMode);
        if (str.charAt(str.length - 1) == ",") {
            str = str.substring(0, str.length - 1);
        }
    } else {
        str += "经典斗地,"
        if (tData.fieldBase) {
            str += tData.fieldBase + "底分,";
        }
        str += "双王必叫,四个二必叫,加倍";
    }
    textRoundInfo.setString(str);
    textRoundInfo.ignoreContentAdaptWithSize(true);
    setWgtLayout(nodeRoundInfo, [0.13, 0.13], [0.5, 0.5], [0, 0]);
};

// 局数
PlayLayer_doudizhuGZ.prototype.updateGameRound = function () {
    var roundNum = this._banner.getChildByName("roundNum");
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var strgametype = MjClient.playui.isJD() ? "经典斗地主  " : "欢乐斗地主  ";
    roundNum.setString(strgametype + (tData.roundAll - tData.roundNum + 1) + "/" + tData.roundAll);
    roundNum.ignoreContentAdaptWithSize(true);
};

// 加倍
PlayLayer_doudizhuGZ.prototype.setTextMult = function (bShow) {
    var textMult = this._banner.getChildByName("Text_mult");
    textMult.ignoreContentAdaptWithSize(true);

    var str = bShow && MjClient.data.sData.tData.rate > 0 ? MjClient.data.sData.tData.rate + "" : "";
    textMult.setString(str);
    textMult.visible = bShow;
};

// 底分
PlayLayer_doudizhuGZ.prototype.handleDifen = function () {
    var textDifen = this._banner.getChildByName("Text_difen");
    var tData = MjClient.data.sData.tData;
    var difen = MjClient.playui.isJD() ? tData.minJiaofen : tData.areaSelectMode.difen;
    var fenStr = difen > 0 ? difen : "";
    textDifen.setString(fenStr);
    textDifen.ignoreContentAdaptWithSize(true);
};

// 不抢/抢地主
PlayLayer_doudizhuGZ.prototype.dealQiangDizhuText = function (off, isPlayEffect, bClear) { // , visible, msg
    if (!this.isSDataValid()) {
        return ;
    }
    var tData = MjClient.data.sData.tData;
    var visible = !bClear && (tData.tState == TableState.waitJiazhu || tData.tState == TableState.waitCard) && tData.zhuang == -1;
    var pl = getUIPlayer(off);
    if (visible) {
        visible = pl != null && pl.qiang != null && pl.qiang != 0;
    }
    var node = getNode_cards(off);
    var diZhuTag = node.getChildByName("jiaodizhuTag");
    diZhuTag.visible = visible;

    if (!visible) {
        return;
    }

    if (off == 0) {
        setWgtLayout(diZhuTag, [0.08, 0.08], [0.5, 0.38], [0, 0]);
    } else if (off == 1) {
        var px = MjClient.rePlayVideo == -1 ? 0.85 : 0.75;
        setWgtLayout(diZhuTag, [0.08, 0.08], [px, 0.75], [0, 0]);
    } else if (off == 2) {
        var tmpX = isIPhoneX() ? 0.20 : 0.16;
        var px = MjClient.rePlayVideo == -1 ? tmpX : 0.25;
        setWgtLayout(diZhuTag, [0.08, 0.08], [px, 0.75], [0, 0]);
    } else {
        cc.log("============增加 off=" + off + " 的逻辑======");
    }
    //todo 0.08为缩放比例，74为节点的原来宽度
    var scaleData = MjClient.size.width / 74 * 0.08;
    diZhuTag.setScale(scaleData, scaleData);
    diZhuTag.ignoreContentAdaptWithSize(true);
    if (pl.qiang > 0) {
        if (MjClient.playui.isJD()) {
            diZhuTag.loadTexture("playing/doudizhu/fen_" + pl.qiang + ".png");
        } else {
            var res = tData.hasJiao ? "playing/doudizhu/qiangdizhu2.png" : "playing/doudizhu/jiaodizhu.png";
            diZhuTag.loadTexture(res);
        }
    } else if (pl.qiang < 0){
        var res = tData.hasJiao ? "playing/doudizhu/buqiang2.png" : "playing/doudizhu/bujiao.png";
        diZhuTag.loadTexture(res);
    }

    if (!isPlayEffect) { return; }
    if (pl.qiang > 0) {
        if (MjClient.playui.isJD()) {
            playEffectInPlay("robDZScore" + pl.qiang.toString())
        } else {
            tData.hasJiao ? playEffectInPlay("robDZ") : playEffectInPlay("jiaodizhu");
        }
    } else {
        tData.hasJiao ? playEffectInPlay("notRobDZ") : playEffectInPlay("bujiao");
    }
};

// 要不起
PlayLayer_doudizhuGZ.prototype.handleNoPutTag = function (off, visible) {
    var node = getNode_cards(off);
    var noPut = node.getChildByName("noPutTag");
    noPut.visible = visible;
    if (off == 0) {
        setWgtLayout(noPut, [0.117, 0], [0.5, 0.32], [0, 1]);
    } else if (off == 1) {
        var ox = MjClient.rePlayVideo == -1 ? -2.5 : -4.8;
        setWgtLayout(noPut, [0.117, 0], [1.12, 0.715], [ox, 0.5]);
    } else if (off == 2) {
        var ox = MjClient.rePlayVideo == -1 ? 0.05 : 1.6;
        var addx = isIPhoneX() ? 0.05 : 0;
        setWgtLayout(noPut, [0.117, 0], [0.17 + addx, 0.715], [ox, 0.5]);
    } else {
        cc.log("============增加 off=" + off + " 的逻辑======");
    }
};

// 没有大过上家
PlayLayer_doudizhuGZ.prototype.handleNoPutTips = function (isVisible) {
    var noPutTips = this.node.getChildByName("noPutTips");
    noPutTips.visible = isVisible;
    if (!isVisible) {
        return;
    }
    setWgtLayout(noPutTips, [0.39, 0], [0.5, 0.1], [0, 0]);
};
// 没有大过上家
PlayLayer_doudizhuGZ.prototype.handlePassBtn = function (isVisible) {
    var BtnPass = this.node.getChildByName("BtnPass");
    BtnPass.visible = isVisible;
    if (!isVisible) {
        return;
    }
    var d = isIPhoneX() ? 0.02 : 0;
    setWgtLayout(BtnPass, [0.135, 0.128], [0.5, 0.43 + d], [0, 0]);
};
//加倍
PlayLayer_doudizhuGZ.prototype.handleJiabeiTag = function (off, type) {
    var node = getNode_cards(off);
    var jiabeiTag = node.getChildByName("jiabeiTag");
    jiabeiTag.visible = type == 0 ? false : true;
    if (type == 0) {
        return;
    }
    if (off == 0) {
        setWgtLayout(jiabeiTag, [0.117, 0], [0.5, 0.32], [0, 1]);
    } else if (off == 1) {
        var ox = MjClient.rePlayVideo == -1 ? -2.5 : -4.8;
        setWgtLayout(jiabeiTag, [0.117, 0], [1.12, 0.696], [ox, 0.5]);
    } else if (off == 2) {
        var ox = MjClient.rePlayVideo == -1 ? 0.05 : 1.6;
        var addx = isIPhoneX() ? 0.05 : 0;
        setWgtLayout(jiabeiTag, [0.117, 0], [0.17 + addx, 0.696], [ox, 0.5]);
    }
    var jiabeistr = "playing/doudizhu/tag_nojiabei.png";
    if(type == 2){//加倍  
        jiabeistr = "playing/doudizhu/tag_jiabei.png";
    }else if(type == 4){//超级加倍
        jiabeistr = "playing/doudizhu/tag_superjiabei.png";
    }

    //jiabeistr = (type == 2) ? "playing/doudizhu/tag_jiabei.png" : "playing/doudizhu/tag_nojiabei.png";
    var scaleData = MjClient.size.width / 74 * 0.08;
    jiabeiTag.setScale(scaleData, scaleData);
    jiabeiTag.ignoreContentAdaptWithSize(true);
    jiabeiTag.loadTexture(jiabeistr);
};

PlayLayer_doudizhuGZ.prototype.ShowWaittingJiabei = function () {
    var waittingTag = MjClient.playui.node.getChildByName("waitting_tag");
    var tData = MjClient.data.sData.tData;
    if (tData.tState != TableState.waitJiazhu) {
        waittingTag.visible = false;
        return;
    }
    var bVisible = false;
    for (var i = 0; i < this.headOffLen; i++) {
        var off = this.headOffArr[i];
        if (off == 0) continue;
        var player = getUIPlayer(off);
        if (player) {
            if (player.jiazhuNum == 0) {
                bVisible = true;
            }
        }
    }
    var pl = getUIPlayer(0);
    if (pl) {
        waittingTag.visible = bVisible && pl.jiazhuNum != 0;
    }
    if (waittingTag.visible) {
        setWgtLayout(waittingTag, [0.5, 0.5], [0.5, isIPhoneX() ? 0.685 : 0.665], [0, 0]);
    }
};

// =========================[[ 系统 ]] ==========================
PlayLayer_doudizhuGZ.prototype.dealSendVoice = function (fullFilePath) {
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
};

PlayLayer_doudizhuGZ.prototype.dealDownAndPlayVoice = function (msg) {
    MjClient.native.HelloOC("downloadPlayVoice ok");
    MjClient.data._tempMessage = msg;
    MjClient.native.HelloOC("mas is" + JSON.stringify(msg));
    downAndPlayVoice(msg.uid, msg.msg);
};

PlayLayer_doudizhuGZ.prototype.dealUploadRecord = function (filePath) {
    if (filePath) {
        MjClient.native.HelloOC("upload voice file");
        MjClient.native.UploadFile(filePath, MjClient.remoteCfg.voiceUrl, "sendVoice");
    } else {
        MjClient.native.HelloOC("No voice file update");
    }
};

// =========================[[ 界面 ]] ==========================

// 绘制手牌
PlayLayer_doudizhuGZ.prototype.initUserHandUiDoudizhu = function (off) {
    var pl = getUIPlayer(off);
    if (pl == null) {
        return;
    }
    var tData = MjClient.data.sData.tData;
    if (tData.tState != TableState.waitPut &&
        tData.tState != TableState.waitEat &&
        tData.tState != TableState.waitCard &&
        tData.tState != TableState.waitJiazhu) {
        return;
    }
    this.handCardsWgetArr[off].initHandCards();
};

//处理出牌,打牌动作
PlayLayer_doudizhuGZ.prototype.dealPKPutcard = function (off, msg) {
    if (off == 0 || MjClient.rePlayVideo != -1) { // 自己视角或回放
        this.handCardsWgetArr[off].removeHandCardByValueArr(msg.card);
    }

    this.deskCardsWgetArr[off].addPutCards(msg.card);
    if (!msg || !msg.noPlayEffect) {
        this.playAnimation(msg.card, off);
    }
    var pl = getUIPlayer(off);
    if (pl == null) {
        return;
    }
    if (off != 0) {
        this.headNode[off].showCurrentLeftCardCount(pl, true);
    }
};

PlayLayer_doudizhuGZ.prototype.playAnimation = function (cards, off) {
    var pl = getUIPlayer(off);
    if (!pl) { return ; }
    var pos = this.deskCardsWgetArr[off].getMiddleCardsPos();
    var nodePos = this.deskCardsWgetArr[off].node.convertToWorldSpaceAR(pos);
    var cardType = MjClient.majiang.cardsType(cards);
    this.AniLayer.loadCardTypeAni(cardType, nodePos, off, pl.isChunTian);
};

// 增加底牌
PlayLayer_doudizhuGZ.prototype.addDiCardsToZhuang = function (zhuangOff) {
    var tData = MjClient.data.sData.tData;
    if (tData.diCards.length == 0) {
        return;
    }
    if (zhuangOff == 0 || MjClient.rePlayVideo != -1) {
        this.handCardsWgetArr[zhuangOff].addCardsForHand(tData.diCards)
    }
};

PlayLayer_doudizhuGZ.prototype.hideAllUI = function () {
    for (var off = 0; off < 4; off++) {
        var node = getNode_cards(off);
        if (off == 3) node.visible = false;
        var ready = node.getChildByName("ready");
        var noPutTag = node.getChildByName("noPutTag");
        var jiaodizhuTag = node.getChildByName("jiaodizhuTag");
        var jiabeiTag = node.getChildByName("jiabeiTag");
        ready.visible = false;
        noPutTag.visible = false;
        jiaodizhuTag.visible = false;
        jiabeiTag.visible = false;
    }
    var BtnPutCard = this.node.getChildByName("BtnPutCard");
    var BtnHimt = this.node.getChildByName("BtnHimt");
    var BtnNoPut = this.node.getChildByName("BtnNoPut");
    var BtnJiaodizhu = this.node.getChildByName("BtnJiaodizhu");
    var Btnbujiao = this.node.getChildByName("Btnbujiao");
    var BtnReady = this.node.getChildByName("BtnReady");
    var BtnJiabei = this.node.getChildByName("BtnJiabei");
    var Btnbujiabei = this.node.getChildByName("Btnbujiabei");
    var Btnsuperjiabei = this.node.getChildByName("Btnsuperjiabei");
    var noPutTips = this.node.getChildByName("noPutTips");
    var BtnPass = this.node.getChildByName("BtnPass");
    BtnPutCard.visible = false;
    BtnHimt.visible = false;
    BtnNoPut.visible = false;
    BtnJiaodizhu.visible = false;
    Btnbujiao.visible = false;
    BtnReady.visible = false;
    BtnJiabei.visible = false;
    Btnbujiabei.visible = false;
    Btnsuperjiabei.visible = false;
    BtnPass.visible = false;
    noPutTips.visible = false;
    this.btnTrust.visible = false;
    this._panelTrust.visible = false;
    var imgMutiple = this._banner.getChildByName("imgMutiple");
    imgMutiple.visible = false;
    var waittingTag = this.node.getChildByName("waitting_tag");
    waittingTag.visible = false;
};

// 处理准备字准备相关
PlayLayer_doudizhuGZ.prototype.handleAboutReady = function (off, bAllReady) {
    var isFull = !IsInviteVisible();
    var pl = getUIPlayer(off);
    if (off < 0 || pl == null) {
        if (off >= 0) {
            var imgReady = getNode_cards(off).getChildByName("ready");
            imgReady.visible = false;
        }
        return;
    }
    if (!this.isSDataValid()) {
        return false;
    }
    var tData = MjClient.data.sData.tData;
    var isShowText = isFull && pl.mjState == TableState.isReady && tData.tState != TableState.waitJoin && !bAllReady;

    if (off == 0) {
        MjClient.playui.setWaitNodeVisible(!isFull);
        var btnReady = MjClient.playui.node.getChildByName("BtnReady");
        var isShow = isFull && pl.mjState == TableState.waitReady;
        btnReady.visible = isShow;
        if (isShow) {
            setWgtLayout(btnReady, [0.2, 0.2], [0.5, 0.37], [0, 0]);
        }
    }

    var imgReady = getNode_cards(off).getChildByName("ready");
    imgReady.visible = isShowText;
    if (!isShowText) {
        return;
    }

    var arr = [[0, -1.5], [3.5, 0.5], [-3.5, 0.5]];
    var arr2 = [[0, -1.5], [-2, 0.5], [2, 0.5]];
    var arrPos = [[0.5, 0.46], [0.98, 0.73], [0.02, 0.73]];
    var tData = MjClient.data.sData.tData;
    var roundNum = tData.roundAll - tData.roundNum + 1;
    setWgtLayout(imgReady, [0.07, 0.07], (roundNum == 1 ? [0.5, 0.5] : arrPos[off]), (roundNum == 1 ? arr[off] : arr2[off]));
};

PlayLayer_doudizhuGZ.prototype.startTimeClock = function (func, isSceneData, curOff) {
    var number = MjClient.clockNode.getChildByName("number");
    number.ignoreContentAdaptWithSize(true);
    number.setString("00");
    MjClient.playui.killTimeClock();
    var tData = MjClient.data.sData.tData;
    var off = 0;
    off = curOff != undefined ? curOff : getOffByIndex(tData.curPlayer);
    var cardNode = getNode_cards(off);
    var clockNode = cardNode.getChildByName("clocknode")
    MjClient.clockNode.setPosition(clockNode.getPosition());
    MjClient.clockNode.visible = true;
    if (tData.tState == TableState.waitPut && off == 0) {
        if (isIPhoneX()) {
            setWgtLayout(clockNode, [0.052, 0], [0.50, 0.24], [0, 3.0]);
        } else {
            setWgtLayout(clockNode, [0.052, 0], [0.50, 0.3], [0, 3.0]);
        }

    }
    if (func != undefined && func != null) {
        if (MjClient.playui.isJinBiChang()) {
            if (isSceneData) {
                var time = parseInt((tData.trustBeginTime - MjClient.data.serverTime) / 1000);
                timeClickFunc(number, time);
            } else {
                func(number);
            }
        } else {
            func(number);
        }
    }
}

PlayLayer_doudizhuGZ.prototype.killTimeClock = function () {
    MjClient.clockNode.getChildByName("number").stopAllActions();
    stopEffect(playTimeUpEff);
    playTimeUpEff = null;
};

PlayLayer_doudizhuGZ.prototype.clockNumberUpdate = function (node, endFunc) {
    return arrowbkNumberUpdate(node, endFunc);
}

PlayLayer_doudizhuGZ.prototype.checkRoomUiDelete = function () {
    if (MjClient.rePlayVideo != -1) return; //回放的时候，不弹解散窗口
    if (!this.isSDataValid()) {
        return ;
    }
    var sData = MjClient.data.sData;
    if (sData.tData.delEnd != 0 && !MjClient.delroomui) {
        MjClient.Scene.addChild(new RemoveRoomView());
        if (MjClient.webViewLayer != null) {
            MjClient.webViewLayer.close();
        }
    } else if (sData.tData.delEnd == 0 && MjClient.delroomui) {
        MjClient.delroomui.removeFromParent(true);
        delete MjClient.delroomui;
    }
    if (MjClient.gemewaitingui) {
        MjClient.gemewaitingui.removeFromParent(true);
        delete MjClient.gemewaitingui;
    }
    if (cc.sys.isObjectValid(MjClient.playerChatLayer)) {
        MjClient.playerChatLayer.removeFromParent(true);
        delete MjClient.playerChatLayer;
    }
}

PlayLayer_doudizhuGZ.prototype.showGps = function () {
    if (MjClient.endoneui != null) {
        MjClient.endoneui.removeFromParent(true);
        MjClient.endoneui = null;
    }
    if (!this.isSDataValid()) {
        return ;
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
};

// 地主的三张牌
PlayLayer_doudizhuGZ.prototype.handleDoudizhuDiCards = function () {
    var isShow = false;
    var cards;
    if (this.isSDataValid()) {
        var tData = MjClient.data.sData.tData
        cards = tData.diCards;
        isShow = cards != null && cards.length > 0;
    }
    var diCardsNum = 3;
    for (var i = 0; i < diCardsNum; i++) {
        var cardNode = this._banner.getChildByName("dizhuCards_" + i);
        if (!isShow) {
            cardNode.removeAllChildren();
            cardNode.loadTexture("playing/cardPic2/beimian_puke.png");
        } else {
            setCardSprite_card(cardNode, cards[i], false);
        }
    }
};
// =========================[[ 事件 ]] ==========================

PlayLayer_doudizhuGZ.prototype.dealMJTick = function (eD) {
    for (var i = 0; i < this.headOffLen; i++) {
        var off = this.headOffArr[i];
        var pl = getUIPlayer(off);
        if (!pl) { continue ; }
        if (!MjClient.playui.isJinBiChang()) {
            this.headNode[off].setUserOffline(pl);
        } else {
            this.headNode[off].setUserTrust(pl);
        }
    }
};

PlayLayer_doudizhuGZ.prototype.dealLogout = function () {
    if (MjClient.playui) {
        MjClient.addHomeView();
        MjClient.playui.removeFromParent(true);
        delete MjClient.playui;
        delete MjClient.endoneui;
        delete MjClient.endallui;
    }
};

PlayLayer_doudizhuGZ.prototype.dealEndRoom = function (msg) {
    mylog(JSON.stringify(msg));
    if (msg.showEnd) {
        this.addChild(new GameOverLayer_doudizhu(), 500);
    } else {
        MjClient.Scene.addChild(new StopRoomView());
    }
};

PlayLayer_doudizhuGZ.prototype.dealLeaveGame = function () {
    MjClient.playui.killTimeClock();
    MjClient.addHomeView();
    MjClient.playui.removeFromParent(true);
    delete MjClient.playui;
    delete MjClient.endoneui;
    delete MjClient.endallui;
    cc.audioEngine.stopAllEffects();
    playMusic("bgMain");
}

PlayLayer_doudizhuGZ.prototype.dealLoadWxHead = function (eD) {
    for (var i = 0; i < this.headOffLen; i++) {
        var off = this.headOffArr[i];
        if (eD.uid == getUIHeadByOff(off).uid) {
            this.headNode[off].setWxHead(true, eD.img);
        }
    }
}

PlayLayer_doudizhuGZ.prototype.dealPlayVoice = function (msg) {
    for (var i = 0; i < this.headOffLen; i++) {
        var off = this.headOffArr[i];
        this.headNode[off].showUserChat(off, msg);
    }
}

PlayLayer_doudizhuGZ.prototype.dealChangeGameBgEvent = function () {
    var back = MjClient.playui.node.getChildByName("back");
    var back2 = back.getChildByName("back");
    setWgtLayout(back2, [1, 1], [0.5, 0.5], [0, 0], true);
    changeGameBg(back2);
};

// 1 add 2 remove 3 online
PlayLayer_doudizhuGZ.prototype.handlePlayerChange = function (action, uid) {
    if (!this.isSDataValid()) {
        return ;
    }
    var targetOff = -1;
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var uids = tData.uids;
    if (action == 2 && uid != null) {
        var targetIndex = uids.indexOf(uid);
        if (targetIndex == -1) {
            targetIndex = uids.indexOf(0);
        }
        targetOff = getOffByIndex(targetIndex);

    }
    var tData = MjClient.data.sData.tData;
    var roundNum = tData.roundAll - tData.roundNum + 1;
    var isRoundEnd = MjClient.playui.isRoundEnd() && (roundNum <= 1);
    for (var i = 0; i < this.headOffLen; i++) {
        var off = this.headOffArr[i];
        MjClient.playui.handleAboutReady(off);
        var pl = null;
        if (targetOff != off) {
            pl = getUIPlayer(off);
        }
        this.headNode[off].updateUserInfo(pl);
        if (action == 3) {
            MjClient.playui.updateUserHeadPosition(off, isRoundEnd);
        }
    }
    this.hideAllPlayerReadyState();
};

PlayLayer_doudizhuGZ.prototype.hideAllPlayerReadyState = function () {
    var isFull = !IsInviteVisible();
    var count = 0;

    for (var i = 0; i < this.headOffLen; i++) {
        var off = this.headOffArr[i];
        var pl = getUIPlayer(off);
        if (!pl) {
            continue;
        }
        var tData = MjClient.data.sData.tData;
        var isShowText = isFull && pl.mjState == TableState.isReady && tData.tState != TableState.waitJoin;
        if (isShowText) {
            count++;
        }
    }
    if (count == this.headOffLen) {
        for (var i = 0; i < this.headOffLen; i++) {
            var off = this.headOffArr[i];
            var imgReady = getNode_cards(off).getChildByName("ready");
            imgReady.visible = false;
        }
    }
};

PlayLayer_doudizhuGZ.prototype.playSuperJiaBeiAni = function () {
    cc.spriteFrameCache.addSpriteFrames("playing/doudizhu/superjiabeiAni/NewAnimation.plist","playing/doudizhu/superjiabeiAni/NewAnimation.png");
    ccs.armatureDataManager.addArmatureFileInfo("playing/doudizhu/superjiabeiAni/NewAnimation.ExportJson");
    var _armature = new ccs.Armature("NewAnimation");
    _armature.animation.play("Animation1");
    _armature.setPosition(cc.winSize.width/2, cc.winSize.height/2 + 70 * MjClient.size.width/1280);
    _armature.setScale(MjClient.size.width/1280 * 0.7);
    MjClient.playui.node.addChild(_armature);
};

PlayLayer_doudizhuGZ.prototype.dealMoveHead = function () {
    var that = this;
    var fun1 = function () {
        MjClient.playui.dealAllReady(true);
    }
    var fun2 = function () {
        for (var i = 0; i < that.headOffLen; i++) {
            var off = that.headOffArr[i];
            var node = that.headParentNode[off];
            var srcPos = cc.p(node.x, node.y);
            MjClient.playui.updateUserHeadPosition(off, false);
            var nodePos = cc.p(node.x, node.y)
            node.setPosition(srcPos);
            node.runAction(cc.moveTo(0.3, nodePos).easing(cc.easeCubicActionOut()));
        }
    }
    MjClient.playui.node.runAction(cc.sequence(cc.callFunc(fun1), cc.callFunc(fun2)));
    sendGPS();
    MjClient.checkChangeLocationApp();
    postEvent("returnPlayerLayer");
}

// =========================[[ 消息 ]] ===========================
// 加倍
PlayLayer_doudizhuGZ.prototype.sendJiaBeiToServer = function (beishu) {
    MjClient.gamenet.request("pkroom.handler.tableMsg", {
        cmd: "MJJiazhu",
        jiazhuNum: beishu,
    });
};

// 叫地主、不叫、叫分
PlayLayer_doudizhuGZ.prototype.sendQiangdizhuToServer = function (bQiang) {
    MjClient.gamenet.request("pkroom.handler.tableMsg", {
        cmd: "Qiangdizhu",
        qiang: bQiang
    });
};

// 出牌
PlayLayer_doudizhuGZ.prototype.sendPutCardsToServer = function () {
    if (MjClient.playui.isCardsSend) {
        return;
    }
    var outCardArr = this.handCardsWgetArr[0].getUpCardArr();
    if (outCardArr.length <= 0) return;
    if (!MjClient.playui.isCanPutCards(outCardArr)) { // 出牌不合法
        return;
    }
    MjClient.playui.isCardsSend = true;
    //隐藏出牌按钮
    MjClient.playui.handleHimtAndNoPutBtn(false);
    MjClient.playui.handlePutCardBtn(false);
    MjClient.clockNode.visible = false;
    MjClient.gamenet.request("pkroom.handler.tableMsg", {
        cmd: "PKPut",
        card: outCardArr,
        putCardType: MjClient.playui.putCardType,
        tingAfterPut: false
    });
    MjClient.playui.dealPKPutcard(0, {card: outCardArr}); // 提前出牌
};

// 准备-1， 提示过牌0， 不出 1
PlayLayer_doudizhuGZ.prototype.sendPassToServer = function (isActivePass) {
    this.handCardsWgetArr[0].clearCardsUpStatus();
    MjClient.gamenet.request("pkroom.handler.tableMsg", {cmd: "PKPass", activePass: isActivePass});
    if (isActivePass != -1) {
        MjClient.clockNode.visible = false;
        //隐藏出牌按钮
        MjClient.playui.handleHimtAndNoPutBtn(false);
        MjClient.playui.handlePutCardBtn(false);
        MjClient.playui.handleNoPutTag(0, true);
        MjClient.playui.handleNoPutTips(false);
        MjClient.playui.handlePassBtn(false);
    }
};

PlayLayer_doudizhuGZ.prototype.sendCancelTuoGuanToServer = function () {
    MjClient.gamenet.request("pkroom.handler.tableMsg", {cmd: "cancelTrust"});
};

PlayLayer_doudizhuGZ.prototype.sendTuoGuanToServer = function () {
    MjClient.gamenet.request("pkroom.handler.tableMsg", {cmd: "beTrust"});
};

// =========================[[ 初始化 ]] ==========================
PlayLayer_doudizhuGZ.prototype.initData = function (isRoundEnd) {
    this.cardTipsArr = [];
    this.tipsIdx = 0;
    MjClient.playui.isCardsSend = false; // 判断是否已经出牌
    this.isValidAutoUpCards = true; // 斗地主提牌
    MjClient.playui.isDouDiZhuFaPai = false;
    this.lastMouseIn = 0; //触碰中当前最后的一张牌
    this.firstMouseIn = 0;
    this.bTouchMove = false; //是否滑动出牌
    this.isDealInitScene = true; // 防止重启，会刷两遍 dealInitSceneData()
    if (!isRoundEnd || !this.isSDataValid()) {
        return;
    }
    var tData = MjClient.data.sData.tData;
    tData.diCards = [];

    tData.zhuang = -1;
    if (!tData._preMinJiaofen) {
        tData._preMinJiaofen = tData.minJiaofen;
    }
    tData.minJiaofen = -1;
    if (!tData._preRate) {
        tData._preRate = tData.rate;
    }
    tData.rate = 0;

    for (var i = 0; i < this.headOffLen; i++) {
        var off = this.headOffArr[i];
        var pl = getUIPlayer(off);
        if (pl == null) continue;
        pl.handCount = 0;
        if (!pl._preJiaZhuNum) {
            pl._preJiaZhuNum = pl.jiazhuNum;
        }
        pl.jiazhuNum = 0;
        pl.qiang = 0;
    }
};

PlayLayer_doudizhuGZ.prototype.initTagList = function () {
    this.btnTagList = {
        BtnPutCard: 1,
        BtnHimt: 2,
        BtnNoPut: 3,
        BtnJiaodizhu: 4,
        Btnbujiao: 5,
        BtnReady: 6,
        BtnJiabei: 7,
        Btnbujiabei: 8,
        Btnbujiao_JD: 9,
        Btnfen1: 10,
        Btnfen2: 11,
        Btnfen3: 12,
        setting: 13,
        back_btn: 14,
        Button_1: 15,
        gps_btn: 16,
        chat_btn: 17,
        btnCancelTrust: 18,
        btnReturn: 19,
        tuoguan_btn: 20,
        duty_btn: 21,
        btnGetGold:22,
        BtnPass:23,
        Btnsuperjiabei:24,
    };
};

PlayLayer_doudizhuGZ.prototype.initOnce = function () {
    MjClient.playui.showRoundInfo();
    MjClient.playui.showVoice();
    MjClient.playui.dealChangeGameBgEvent();
    MjClient.playui.addChangeBg();
    MjClient.playui.addWaitNode();
    MjClient.playui.addAniLayer();
    MjClient.playui.showTableID();
    MjClient.playui.showGameName();
    MjClient.playui.updateTimes();
    if (!this.isDealInitScene) {
        MjClient.playui.dealInitSceneData();
        return;
    } else {
        this.isDealInitScene = false;
    }
};

PlayLayer_doudizhuGZ.prototype.initUI = function () {
    this._downNode = this.node.getChildByName("down");
    this._rightNode = this.node.getChildByName("right");
    this._topNode = this.node.getChildByName("top");
    this._leftNode = this.node.getChildByName("left");
    this._AniNode = this.node.getChildByName("eat");
    this._banner = this.node.getChildByName("banner");
    this._jiazhuWait = this.node.getChildByName("jiazhuWait");
    this._panelTrust = this.node.getChildByName("Panel_Trust");
    var wifi = this._banner.getChildByName("wifi");
    updateWifiState(wifi);
    var powerBar = this._banner.getChildByName("powerBar");
    updateBattery(powerBar);
    var Button_1 = this._banner.getChildByName("Button_1");
    Button_1.visible = true;
    var btnReturn = this._banner.getChildByName("btnReturn");
    btnReturn.visible = false;
    var imageDiFen = this._banner.getChildByName("Image_difen");
    var strtmp = MjClient.playui.isJD() ? "difen_jinbi.png" : "difen.png";
    var strImageDiFen = "playing/doudizhu/" + strtmp;
    imageDiFen.loadTexture(strImageDiFen);
    this._banner.getChildByName("item_bg").visible = false;
    var btnGetGold = this._banner.getChildByName("btnGetGold");
    btnGetGold.setVisible(this.isJinBiChang() && MjClient._GOLD_RECHARGE )
    MjClient.clockNode = this.node.getChildByName("clock");
    setWgtLayout(MjClient.clockNode, [0.135, 0.128], [0.41, 0.40], [0, 0]);
    MjClient.clockNode.visible = false;
    this.clockNodePosX = MjClient.clockNode.getPositionX();
    this.clockNodePosY = MjClient.clockNode.getPositionY();

    var isHaveGPS = MjClient.MaxPlayerNum > 2 && !MjClient.playui.isJinBiChang();
    var gps_btn = this.node.getChildByName("gps_btn");
    gps_btn.setVisible(false);
    var positionCard = this.node.getChildByName("positionCard");
    positionCard.visible = false;
    var btnChat = this.node.getChildByName("chat_btn");
    this._banner.getChildByName("titlebg").visible = true;
    this._banner.getChildByName("titlebgcoin").visible = false;
    if (isHaveGPS) {
        setWgtLayout(btnChat, [0.09, 0.09], [0.97, MjClient.playui.isJinBiChang() ? 0.1 : 0.2], [0, 3.5]);
    } else {
        setWgtLayout(btnChat, [0.09, 0.09], [0.97, 0.1], [0, 3.8]);
    }

    this.btnTuoGuan = this.node.getChildByName("tuoguan_btn");
    this.btnTuoGuan.visible = MjClient.playui.isJinBiChang();
    setWgtLayout(this.btnTuoGuan, [0.09, 0.09], [0.97, 0.2], [0, 3.5]);
    var btnDuty = this.node.getChildByName("duty_btn");
    btnDuty.visible = MjClient.playui.isJinBiChang();
    setWgtLayout(btnDuty, [0.09, 0.09], [0.97, 0.3], [0, 3.5]);
    //显示每日任务tips
    ShowDayTaskTips(btnDuty,"left")

    this.imgDutyHongdian = btnDuty.getChildByName("Image_hongdian");
    this.imgDutyHongdian.visible = MjClient._GoldFuli;
    setWgtLayout(gps_btn, [0.09, 0.09], [0.97, 0.1], [0, 3.5]);
    setWgtLayout(this._banner, [0.27, 0.3], [0.5, 0.98], [0, 0]);
    //托管
    this.btnTrust = this._panelTrust.getChildByName("btnCancelTrust");
    setWgtLayout(this.btnTrust, [0.18, 0.18], [0.5, 0.145], [0, 0]);
};
//设置金币场节点
PlayLayer_doudizhuGZ.prototype.displayJinBiChangNode = function () {
    var isJinBiChang = MjClient.playui.isJinBiChang();

    if (!isJinBiChang) {
        return;
    }

    //gps按钮
    var gps_btn = this.node.getChildByName("gps_btn");
    gps_btn.setVisible(!isJinBiChang);

    var voice_btn = this.node.getChildByName("voice_btn");
    voice_btn.setVisible(!isJinBiChang);
    //返回大厅
    var btnReturn = this._banner.getChildByName("btnReturn");

    btnReturn.visible = true;

    //房间局数,房间号
    this._banner.getChildByName("titlebg").visible = false;
    this._banner.getChildByName("titlebgcoin").visible = true;
    this._banner.getChildByName("tableid").visible = false;
    this._banner.getChildByName("roundNum").visible = false;
    this._banner.getChildByName("titlebg").loadTexture("playing/doudizhu/titlebgcoin.png");
    this._banner.getChildByName("titlebgcoin").loadTexture("playing/doudizhu/titlebg_1.png");

    //wifi，时间，电量，底分
    var Image_difen = this._banner.getChildByName("Image_difen");
    Image_difen.loadTexture("playing/doudizhu/difen_jinbi.png");
}

// 初始化节点
PlayLayer_doudizhuGZ.prototype.initHeadWget = function () {
    this.headOffArr = [];
    this.headNode = {};
    this.AniMotion = [];
    this.handCardsWgetArr = {}
    this.deskCardsWgetArr = {}
    this.headParentNode = {}
    this.headOffLen = MjClient.MaxPlayerNum;
    for (var off = 0; off < 4; off++) {
        var _node = getNode(off);
        if (off == 3) {
            _node.visible = false;
            return;
        }
        var nodeStand = _node.getChildByName("stand_node");
        var nodeDeskCard = _node.getChildByName("deskCard");
        var head_node = _node.getChildByName("head");
        this.headParentNode[off] = head_node;
        this.headOffArr.push(off);
        this.headNode[off] = new PokerHeadNode_Doudizhu(off);
        head_node.addChild(this.headNode[off].node);
        this.headNode[off].node.setPosition(cc.p(64, 41.5));
        this.headNode[off].node.setScale(0.3);
        var cardScale = isIPhoneX() ? 0.12 : 0.13;
        this.handCardsWgetArr[off] = new PokerCardNode_Doudizhu(off,cardScale);
        nodeStand.addChild(this.handCardsWgetArr[off].node);
        this.deskCardsWgetArr[off] = new PokerCardNode_Doudizhu(off,cardScale);
        nodeDeskCard.addChild(this.deskCardsWgetArr[off].node);
        var play_tips = _node.getChildByName("play_tips");// 无用UI
        play_tips.visible = false;
        nodeStand.setAnchorPoint(0,0.5);
        if (off == 0) {
            if (isIPhoneX()) {
                setWgtLayout(nodeStand, [cardScale, 0], [0.0, 0.32], [0, 0]);
            } else {
                setWgtLayout(nodeStand, [cardScale, 0], [0.0, 0.30], [0, 0]);
            }
            this._ctTuoGuan = nodeStand.getChildByName("ct_tuoguan");
            this._ctTuoGuan.setLocalZOrder(1000);
            this._ctTuoGuan.visible = false;
            setWgtLayout(nodeDeskCard, [0.075, 0.0], [0.0, 0.55], [0, 0]);
        } else if (off == 1) {
            setWgtLayout(nodeStand, [0, 0.09], [0.85, 1.03], [0, 0]);
            setWgtLayout(nodeDeskCard, [0.075, 0], [0.88, 0.82], [0, 0]);
        } else if (off == 2) {
            setWgtLayout(nodeStand, [0, 0.09], [0.18, 0.88], [0, 0]);
            setWgtLayout(nodeDeskCard, [0.075, 0], [0.21, 0.82], [0, 0]);
        }
        if (!this.isSDataValid()) { continue ; }

        var tData = MjClient.data.sData.tData;
        var roundNum = tData.roundAll - tData.roundNum + 1;
        var isRoundEnd = MjClient.playui.isRoundEnd() && (roundNum <= 1);
        MjClient.playui.updateUserHeadPosition(off, isRoundEnd);

    }
}

//初始化玩家信息
PlayLayer_doudizhuGZ.prototype.initMsgEvent = function () {
    // ================ 重连 =========================
    UIEventBind(null, this.node, "initSceneData", function (eD) {
        MjClient.playui.handlePlayerChange(3);
        MjClient.playui.checkRoomUiDelete();
        MjClient.playui.dealInitSceneData();
    });
    // ================ 游戏流程 =========================
    UIEventBind(null, this.node, "waitReady", function (eD) {
        MjClient.playui.dealAllReady();
    });
    UIEventBind(null, this.node, "beTrust", function (eD) {
        MjClient.playui.dealTrust(eD, 1);
    });
    UIEventBind(null, this.node, "cancelTrust", function (eD) {
        MjClient.playui.dealTrust(eD, 2);
    });
    UIEventBind(null, this.node, "mjhand", function (eD) {
        MjClient.playui.handleMjHand(true);
    });
    UIEventBind(null, this.node, "waitJiaodizhu", function (eD) {
        MjClient.playui.dealWaitJiaodizhu(eD, false);
    });
    UIEventBind(null, this.node, "Qiangdizhu", function (eD) {
        MjClient.playui.dealQiangDizhu(eD);
    });
    UIEventBind(null, this.node, "diCards", function (eD) {
        var tData = MjClient.data.sData.tData;
        tData.diCardRateDesc = eD.diCardRateDesc;
        tData.diCardsRate = eD.diCardsRate;
        MjClient.playui.dealDiCards(eD.zhuang, eD.diCards, eD.handCounts, true, true);
    });
    UIEventBind(null, this.node, "waitJiazhu", function (eD) {
        MjClient.playui.dealWaitJiazhu(eD, false, true);
    });
    UIEventBind(null, this.node, "MJJiazhu", function (eD) {
        var off = getUiOffByUid(eD.uid);
        MjClient.playui.dealMJJiazhu(false, off, eD.jiazhuNum, eD.curPlayer);
    });
    UIEventBind(null, this.node, "waitPut", function (eD) {
        MjClient.playui.dealWaitPut(eD, false);
    });
    UIEventBind(null, this.node, "PKPut", function (eD) {
        playCardEffect(eD.card, eD.handCount);
        MjClient.playui.dealPKPut(eD);
    });
    UIEventBind(null, this.node, "PKPass", function (eD) {
        MjClient.playui.dealPKPass(eD);
    });
    UIEventBind(null, this.node, "roundEnd", function (eD) {
        MjClient.playui.dealRoundEnd(eD);
    });
    // ================ 房间事件 =========================
    UIEventBind(null, this.node, "LeaveGame", function (eD) {
        MjClient.playui.dealLeaveGame();
    });
    UIEventBind(null, this.node, "DelRoom", function (eD) {
        MjClient.playui.checkRoomUiDelete();
    });
    UIEventBind(null, this.node, "endRoom", function (eD) {
        MjClient.playui.dealEndRoom(eD);
    });
    UIEventBind(null, this.node, "logout", function (eD) {
        MjClient.playui.dealLogout();
    });
    UIEventBind(null, this.node, "addPlayer", function (eD) {
        MjClient.playui.handlePlayerChange(1);
    });
    UIEventBind(null, this.node, "removePlayer", function (eD) {
        MjClient.playui.handlePlayerChange(2, eD.uid);
    });
    UIEventBind(null, this.node, "onlinePlayer", function (eD) {
        MjClient.playui.handlePlayerChange(3);
    });
    // ================ 界面 =============================
    UIEventBind(null, this.node, "returnPlayerLayer", function (eD) {
        MjClient.playui.visible = true;
    });
    UIEventBind(null, this.node, "changeGameBgEvent", function (eD) {
        MjClient.playui.dealChangeGameBgEvent();
    });
    UIEventBind(null, this.node, "loadWxHead", function (eD) {
        MjClient.playui.dealLoadWxHead(eD);
    });
    UIEventBind(null, this.node, "changePKImgEvent", function (eD) {
        MjClient.playui.dealChangePKImg();
    });
    // UIEventBind(null,this.node,"clearCardUI",function (eD) {
    //     MjClient.playui.dealClearCardUI();
    // });
    UIEventBind(null, this.node, "moveHead", function (eD) {
        MjClient.playui.dealMoveHead();
    });
    // ================ 系统 =============================
    UIEventBind(null, this.node, "cancelRecord", function (eD) {
        MjClient.native.HelloOC("cancelRecord !!!");
    });
    UIEventBind(null, this.node, "uploadRecord", function (eD) {
        MjClient.playui.dealUploadRecord(eD);
    });
    UIEventBind(null, this.node, "sendVoice", function (eD) {
        MjClient.playui.dealSendVoice(eD);
    });
    UIEventBind(null, this.node, "downAndPlayVoice", function (eD) {
        MjClient.playui.dealDownAndPlayVoice(eD);
    });
    UIEventBind(null, this._banner, "nativePower", function (eD) {
        MjClient.playui._banner.getChildByName("powerBar").setPercent(Number(eD));
    });
    UIEventBind(null, this.node, "playVoice", function (eD) {
        MjClient.data._tempMessage.msg = eD;
        MjClient.playui.dealPlayVoice(MjClient.data._tempMessage);
    });
    UIEventBind(null, this.node, "MJChat", function (eD) {
        MjClient.playui.dealPlayVoice(eD);
    });
    UIEventBind(null, this.node, "playerStatusChange", function (eD) {
        MjClient.playui.dealMJTick(eD);
    });

    UIEventBind(null, this.node, "updateInfo", function (eD) {
        if (MjClient.playui.isJinBiChang() && eD && eD.gold) {
            var pl = getUIPlayer(0);
            if (pl) {
                MjClient.playui.headNode[0].updateCoin(pl);
            }
        }
    });
    UIEventBind(null, this.node, "refresh_mission", function (eD) {
        MjClient.playui.imgDutyHongdian.visible = MjClient._GoldFuli;
    });
    UIEventBind(null,this.node,"PostCardsEnded",function (eD) {
        MjClient.playui.isDouDiZhuFaPai = false;
    });
};

PlayLayer_doudizhuGZ.prototype.initClickEvent = function () {
    var btnCallback = function (sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED) {
            MjClient.playui.btnEventListener(sender, type);
        }
    }

    var btnList1 = ["BtnPutCard", "BtnHimt", "BtnNoPut", "BtnJiaodizhu", "Btnbujiao",
        "BtnReady", "BtnJiabei", "Btnbujiabei", "Btnbujiao_JD", "Btnfen1", "Btnfen2", "Btnfen3", "gps_btn", "chat_btn", "tuoguan_btn", "duty_btn", "BtnPass", 'Btnsuperjiabei'];
    for (var i = 0; i < btnList1.length; i++) {
        MjClient.playui.btnBindCallBack(MjClient.playui.node, btnList1[i], this.btnTagList[btnList1[i]], btnCallback);
    }

    var btnList2 = ["setting", "Button_1", "btnReturn","btnGetGold"];
    for (var i = 0; i < btnList2.length; i++) {
        MjClient.playui.btnBindCallBack(MjClient.playui._banner, btnList2[i], this.btnTagList[btnList2[i]], btnCallback);
    }
    //托管按钮
    MjClient.playui.btnBindCallBack(MjClient.playui._panelTrust, "btnCancelTrust", this.btnTagList["btnCancelTrust"], btnCallback);
};

PlayLayer_doudizhuGZ.prototype.btnBindCallBack = function (parent, str, tag, callback) {
    var tmpNode = parent.getChildByName(str);
    tmpNode.tag = tag;
    tmpNode.addTouchEventListener(callback);
};

PlayLayer_doudizhuGZ.prototype.btnEventListener = function (sender, type) {
    var tag = sender.getTag();
    if (tag == this.btnTagList.BtnPutCard) { // 出牌
        playEffectInPlay("playingCards");
        MjClient.playui.sendPutCardsToServer();
    } else if (tag == this.btnTagList.BtnHimt) { // 提示
        playEffect("guandan/tishi");
        MjClient.playui.showTipCards();
    } else if (tag == this.btnTagList.BtnNoPut) { // 不出
        playEffectInPlay("clickCards");
        MjClient.playui.sendPassToServer(1);
    } else if (tag == this.btnTagList.BtnPass) {
        playEffectInPlay("clickCards");
        MjClient.playui.sendPassToServer(1);
    } else if (tag == this.btnTagList.BtnReady) {
        MjClient.playui.sendPassToServer(-1);
        MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Zhunbei", {
            uid: SelfUid(),
            gameType: MjClient.gameType
        });
    } else if (tag == this.btnTagList.BtnJiaodizhu || tag == this.btnTagList.Btnbujiao) { // 欢乐叫地主/不叫
        MjClient.clockNode.visible = false;
        MjClient.playui.sendQiangdizhuToServer(tag == this.btnTagList.BtnJiaodizhu ? 1 : -1);
    } else if (tag == this.btnTagList.Btnbujiao_JD || tag == this.btnTagList.Btnfen1 || tag == this.btnTagList.Btnfen2 || tag == this.btnTagList.Btnfen3) { // 经典
        MjClient.clockNode.visible = false;
        var score = {};
        score[this.btnTagList.Btnfen1] = 1;
        score[this.btnTagList.Btnfen2] = 2;
        score[this.btnTagList.Btnfen3] = 3;
        MjClient.playui.sendQiangdizhuToServer(score[tag] || -1);
    } else if (tag == this.btnTagList.BtnJiabei || tag == this.btnTagList.Btnbujiabei) { // 加倍 不加倍
        var rate = tag == this.btnTagList.Btnbujiabei ? 1 : 2;
        MjClient.playui.sendJiaBeiToServer(rate);
    } else if (tag == this.btnTagList.Btnsuperjiabei) {//超级加倍
        var rate = 4;
        var _lowerLimit = 1000;
        var _amount = 1000;
        if(this.doubleCardData){
            _lowerLimit = this.doubleCardData.lowerLimit;
            _amount = this.doubleCardData.amount;
        }
        var _allCost = _lowerLimit + _amount;
        if(MjClient.data.pinfo.doubleCard > 0 && MjClient.data.pinfo.gold - MjClient.data.sData.tData.fieldFee < _lowerLimit){
            MjClient.showToast("金币大于" + _lowerLimit + "才可使用");
        }else if((cc.isUndefined(MjClient.data.pinfo.doubleCard) || MjClient.data.pinfo.doubleCard <= 0) && MjClient.data.pinfo.gold - MjClient.data.sData.tData.fieldFee < _allCost){
            MjClient.showToast("金币大于" + _allCost + "才可兑换");
        }else{
            MjClient.gamenet.request("pkroom.handler.tableMsg", {cmd: "useDoubleCard", id: this.doubleCardData.id}, 
                function(rtn) {
                    if (rtn.code == 0) {
                        MjClient.playui.playSuperJiaBeiAni();
                        MjClient.playui.sendJiaBeiToServer(rate);
                    } else if (rtn.message) {
                        MjClient.showToast(rtn.message);
                    }
                }
            );
        }
    } else if (tag == this.btnTagList.setting) {
        var settringLayer = new SettingViewCard();
        settringLayer.setName("PlayLayerClick");
        MjClient.Scene.addChild(settringLayer);
        if (MjClient.playui.isJinBiChang()) {
            MjClient.native.umengEvent4CountWithProperty("Jinbichang_Fangjiannei_Shezhi", {
                uid: SelfUid(),
                gameType: MjClient.gameType
            });
        } else {
            MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Shezhi", {
                uid: SelfUid(),
                gameType: MjClient.gameType
            });
        }
    } else if (tag == this.btnTagList.back_btn) {
        MjClient.showMsg("是否解散房间？", function () {
            MjClient.delRoom(true);
        }, function () {
        }, 1);
    } else if (tag == this.btnTagList.Button_1) {
        MjClient.openWeb({url: MjClient.GAME_TYPE.PAO_DE_KUAI, help: true});
    } else if (tag == this.btnTagList.btnReturn) {
        if (MjClient.playui.isJinBiChang()) {
            MjClient.native.umengEvent4CountWithProperty("Jinbichang_Fangjiannei_Fanhui", {uid: SelfUid()});
        }
        MjClient.showMsg("强制退出，只能进入托管模式哦", function () {
            if (MjClient.playui) {
                MjClient.playui.sendTuoGuanToServer()
                MjClient.playui.visible = false;
                playMusic("bgMain");
                MjClient.addHomeView();
            }

        }, function () {

        });

    } else if (tag == this.btnTagList.gps_btn) {
        MjClient.Scene.addChild(new showDistance3PlayerLayer());
    } else if (tag == this.btnTagList.chat_btn) {
        if (MjClient.playui.isJinBiChang()) {
            MjClient.native.umengEvent4CountWithProperty("Jinbichang_Fangjiannei_Duihua", {uid: SelfUid()});
        }
        var chatlayer = new ChatLayer();
        MjClient.Scene.addChild(chatlayer);
    } else if (tag == this.btnTagList.btnCancelTrust) {
        MjClient.playui.sendCancelTuoGuanToServer();
    } else if (tag == this.btnTagList.tuoguan_btn) {
        MjClient.playui.sendTuoGuanToServer();
        if (MjClient.playui.isJinBiChang()) {
            MjClient.native.umengEvent4CountWithProperty("Jinbichang_Fangjiannei_Tuoguan", {uid: SelfUid()});
        }
    } else if (tag == this.btnTagList.duty_btn) {
        MjClient.Scene.addChild(new GoldTaskLayer());
        if (MjClient.playui.isJinBiChang()) {
            MjClient.native.umengEvent4CountWithProperty("Jinbichang_Fangjiannei_Renwu", {uid: SelfUid()});
        }
    }
    else if (tag == this.btnTagList.btnGetGold) {
        MjClient.Scene.addChild(new goldStoreLayer() );
    }
};

// 初始化时钟节点
PlayLayer_doudizhuGZ.prototype.initClockWget = function () {
    for (var off = 0; off < 4; off++) {
        var _node = getNode(off);
        var nodeClock = _node.getChildByName("clocknode");
        if (off == 0) {
            if (isIPhoneX()) {
                setWgtLayout(nodeClock, [0.052, 0], [0.50, 0.24], [0, 3.3]);
            } else {
                setWgtLayout(nodeClock, [0.052, 0], [0.50, 0.32], [0, 3.3]);
            }
        } else if (off == 1) {
            setWgtLayout(nodeClock, [0.052, 0], [0.82, 0.78], [0, 0]);
        } else if (off == 2) {
            setWgtLayout(nodeClock, [0.052, 0], [0.18, 0.78], [0, 0]);
        }
    }
}

//判断自己是不是托管状态
PlayLayer_doudizhuGZ.prototype.isTrusted = function () {
    if (!MjClient.playui.isJinBiChang()) {
        return false;
    }
    var pl = getUIPlayer(0);
    return pl && pl.trust;
}

PlayLayer_doudizhuGZ.prototype.handleMutiple = function (isSceneData) {
    var tData = MjClient.data.sData.tData;
    var imgMutiple = this._banner.getChildByName("imgMutiple");
    imgMutiple.visible = false;
    if (tData.diCardsRate == undefined || tData.diCardsRate == 1) {
        return;
    }
    imgMutiple.visible = true;
    imgMutiple.loadTexture("playing/doudizhu/imgtime_" + tData.diCardsRate + ".png");
    var describeBG = imgMutiple.getChildByName("describeBG");
    describeBG.visible = (tData.diCardRateDesc != "" && tData.diCardRateDesc != undefined);
    var text_describe = describeBG.getChildByName("Text_describe");
    text_describe.setString(tData.diCardRateDesc);
    text_describe.visible = true;
    if (isSceneData) {
        describeBG.visible = false;
        return;
    }
    describeBG.width = text_describe.getString().length * text_describe.getFontSize() + 15;
    describeBG.runAction(
        cc.sequence(
            cc.DelayTime(10),
            cc.hide()
        )
    );
}

PlayLayer_doudizhuGZ.prototype.showJiabeiTagMove = function (off, jizhuNum) {
    var node = getNode_cards(off);
    var jiabeiTag = node.getChildByName("jiabeiTag");
    var head_node = node.getChildByName("head");
    var toPosition = head_node.getPosition();
    toPosition.x += 12;
    toPosition.y += 18;
    if (jiabeiTag.visible) {
        jiabeiTag.runAction(
            cc.sequence(
                cc.delayTime(1.5),
                cc.hide(),
                cc.callFunc(function () {
                    MjClient.playui.headNode[off].setJiaBeiIcon(jizhuNum == 2, jizhuNum);
                })
            )
        );
    }
}
PlayLayer_doudizhuGZ.prototype.isSDataValid = function() {
    var sData = MjClient.data.sData;
    var strSData = JSON.stringify(sData);
    var pattern=new RegExp("tData");
    var res = pattern.exec(strSData);
    if (res == null) {
        return false;
    }
    return true;
}

function timeClickFunc(node, tikNum) {
    tikNum = tikNum + 1;
    node.setString("" + tikNum);
    clickFunc(node);
}

function clickFunc(node) {
    var num = node.getString();
    num -= 1;
    node.setString(num <= 9 ? "0" + num : num);
    if (num == 0) {
        var sData = MjClient.data.sData;
        var tData = sData.tData;
        var uids = tData.uids;
        if (uids[tData.curPlayer] == SelfUid()) {
            playTimeUpEff = playEffect("loop_alarm", true);
            MjClient.native.NativeVibrato();
        } else {
            postEvent("startOperWait");
        }
        node.stopAllActions();
        return;
    }
    node.runAction(cc.sequence(
        cc.DelayTime(1.0),
        cc.callFunc(function () {
            clickFunc(this);
        }.bind(node))
    ));
}
