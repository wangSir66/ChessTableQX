// 临汾斗地主
var actionZindex = 1000;
var PlayLayer_doudizhuLF = cc.Layer.extend({
    ctor: function () {
        this._super();
        var playui = ccs.load("Play_doudizhuLF.json");
        MjClient.MaxPlayerNum = parseInt(MjClient.data.sData.tData.maxPlayer);
        playMusic("doudizhu/table_background_music");
        MjClient.playui = this;
        MjClient.sortClassType = 0; //必不可少，会影响到banner上花色的正确显示
        MjClient.playui.node = playui.node;
        MjClient.playui.putCardType = 1;//  出牌方式 1 滑动出牌 2 提示出牌
        this.upWrongSelectCard = [];

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
        MjClient.playui.showWrongToast(false);

        this.addChild(playui.node);
        //触摸事件监听注册
        cc.eventManager.addListener(cc.EventListener.create(this.handleCardsTouchListener()), this._downNode);
        MjClient.lastMJTick = Date.now();
        this.runAction(cc.repeatForever(cc.sequence(cc.callFunc(function () {
            if (MjClient.game_on_show) {
                MjClient.tickGame(0);
            }
        }), cc.delayTime(7))));
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

PlayLayer_doudizhuLF.prototype.isJD = function () {
    return (MjClient.data.sData.tData.areaSelectMode.type == "jingdian");
};

PlayLayer_doudizhuLF.prototype.isRoundEnd = function () {
    var tState = MjClient.data.sData.tData.tState;
    return tState == TableState.waitReady || tState == TableState.roundFinish || tState == TableState.waitJoin || tState == TableState.isReady;
}

// 检查出牌是否合法
PlayLayer_doudizhuLF.prototype.isCanPutCards = function (putCards) {
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
PlayLayer_doudizhuLF.prototype.showTipCards = function () {
    this.handCardsWgetArr[0].clearCardsUpStatus();
    var length = this.cardTipsArr.length;
    if (length <= 0) {
        return;
    }

    if (this.cardTipsArr[this.tipsIdx] == null) {
        this.tipsIdx = 0;
    }
    var tipsCardArray = this.cardTipsArr[this.tipsIdx].slice();
    cc.log("showtipcards-----------" + tipsCardArray);
    this.handCardsWgetArr[0].liftCardUp(tipsCardArray);
    this.tipsIdx++;
    MjClient.playui.putCardType = 2;
    var tData = MjClient.data.sData.tData;
    var isFirst = !(tData.lastPutPlayer != tData.curPlayer && tData.lastPutPlayer != -1);
    MjClient.playui.handlePutCardBtn(true, isFirst);
    MjClient.playui.enablePutCardBtn(true);
}

// 处理斗地主智能提牌
PlayLayer_doudizhuLF.prototype.handleDoudizhuCardsAutoUp = function (bTouchMove) {
    if (!this.isSDataValid()) {
        return;
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
    if (!pl) {
        return;
    }
    var data = {};
    if (tData.lastPutPlayer == tData.curPlayer || tData.lastPutPlayer == -1) {// 首出
        data = MjClient.majiang.calAutoPutCardWithFirstOut(upSelectCards, pl.mjhand, tData);
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

PlayLayer_doudizhuLF.prototype.handleCardsTouchListener = function () {
    return {
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        swallowTouches: false,                       // 设置是否吞没事件，在 onTouchBegan 方法返回 true 时吞没
        onTouchBegan: function (touch, event) {
            var pl = getUIPlayer(0);
            if (!pl) return false;
            if (pl.mjState == TableState.roundFinish) { //已经完成
                return false;
            }
            MjClient.playui.upWrongSelectCard = []
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
                return;
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
            var upSelectCards = MjClient.playui.handCardsWgetArr[0].getUpCardArr();
            MjClient.playui.enablePutCardBtn(upSelectCards.length > 0 && MjClient.playui.isCanPutCards() );
        }
    };
};

// 处理点击
PlayLayer_doudizhuLF.prototype.handleTouchCards = function (touch, event, isBegan) {
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
PlayLayer_doudizhuLF.prototype.handleUpRightCards = function (isFirst, off) {
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
PlayLayer_doudizhuLF.prototype.dealInitSceneData = function () {
    if (!this.isSDataValid()) {
        return;
    }
    var tData = MjClient.data.sData.tData;
    var tState = tData.tState;
    MjClient.playui.initData(tState == TableState.roundFinish ? true : false);
    var isRoundEnd = MjClient.playui.isRoundEnd()
    for (var i = 0; i < this.headOffLen; i++) {
        var off = this.headOffArr[i];
        MjClient.playui.handleNoPutTag(off, false);
        MjClient.playui.handleTiTag(off, 0);
        MjClient.playui.dealQiangDizhuText(off, false);
        // if (!isRoundEnd) { continue; }
        this.handCardsWgetArr[off].removeAllCards();
        this.deskCardsWgetArr[off].removeAllCards();
    }
    MjClient.playui.handleDifen(tState != TableState.waitJoin && tState != TableState.waitReady);
    MjClient.playui.setTextMult(tState != TableState.waitJoin && tState != TableState.waitReady);
    // 发牌、叫地主、发底牌、加注、等待出牌
    MjClient.playui.handleMjHand();
    var pl = getUIPlayer(0);
    if (pl) {
        var mustjiao = pl.mustJiao;
        MjClient.playui.dealWaitJiaodizhu({mustJiao: mustjiao, curPlayer: tData.curPlayer});
    }
    MjClient.playui.dealDiCards(tData.zhuang, tData.diCards, {}, false, false,tData.isHasTi);
    MjClient.playui.dealWaitJiazhu({zhuang: tData.zhuang}, true);
    for (var i = 0; i < this.headOffLen; i++) {
        var off = this.headOffArr[i];
        var pl = getUIPlayer(off);
        if (pl == null) continue;
        MjClient.playui.dealMJJiazhu(true, off, pl.jiazhuNum, tData.curPlayer,tData.isHasTi);
    }
    if (!isRoundEnd && tData.lastPutCard != null && tData.lastPutCard.length > 0) {
        var off = getOffByIndex(tData.lastPutPlayer);

        this.deskCardsWgetArr[off].addPutCards(tData.lastPutCard);
    }
    MjClient.playui.dealWaitPut();
};

PlayLayer_doudizhuLF.prototype.dealChangePKImg = function () {
    MjClient.playui.handleDoudizhuDiCards();
    this.handCardsWgetArr[0].changPkImageBack(getCurrentPKImgType());
    for (var i = 0; i < this.headOffLen; i++) {
        var off = this.headOffArr[i];
        this.deskCardsWgetArr[off].changPkImageBack(getCurrentPKImgType());
    }
};

// 结算
PlayLayer_doudizhuLF.prototype.dealRoundEnd = function (eD) {
    if (!this.isSDataValid()) {
        return;
    }
    var endInfo = {}
    endInfo.diCards = MjClient.data.sData.tData.diCards.slice();
    endInfo.zhuang = MjClient.data.sData.tData.zhuang;
    endInfo.jiazhuNum = []
    for (var i = 0; i < MjClient.MaxPlayerNum; i++) {
        var pl = MjClient.getPlayerByIndex(i);
        if (pl == null) {
            continue;
        }
        endInfo.jiazhuNum.push(pl.jiazhuNum);
    }
    MjClient.clockNode.visible = false;
    var self = MjClient.playui.node;

    function delayExe() {
        MjClient.playui.initData(true);
        MjClient.playui.dealInitSceneData();
        var sData = MjClient.data.sData;
        var tData = sData.tData;
        if (sData.tData.roundNum <= 0) {
            if (!tData.matchId) {
                self.addChild(new GameOverLayer_doudizhu(), 500);
            } else {
                self.runAction(cc.sequence(cc.delayTime(3), cc.callFunc(function () {
                    self.addChild(new GameOverLayer_doudizhu(), 500);
                })))
            }
        }
        self.addChild(new EndOneView_doudizhuLF(endInfo), 500);
    }

    var time = MjClient.data.sData.tData.roundNum <= 0 ? 0.2 : 1;
    var Anitime = MjClient.playui.AniLayer.getAniTime();
    if (Anitime) {
        time = Anitime;
    }
    this.runAction(cc.sequence(cc.DelayTime(time), cc.callFunc(delayExe)));
    MjClient.playui.killTimeClock();
};

// 过、准备
PlayLayer_doudizhuLF.prototype.dealPKPass = function (eD) {
    MjClient.playui.killTimeClock();
    MjClient.clockNode.visible = false;
    var off = getUiOffByUid(eD.uid);
    if (eD.activePass == null || eD.activePass == -1) {
        MjClient.playui.handleAboutReady(off); // 准备
    } else { // 过牌
        MjClient.playui.handleNoPutTag(off, true);
        MjClient.playui.handleNoPutTips(false);
    }
}
// 出牌
PlayLayer_doudizhuLF.prototype.dealPKPut = function (msg) {
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
    } else if (pl.handCount == 2) {
        playEffectInPlay("double");
    }
}

// 等待出牌
PlayLayer_doudizhuLF.prototype.dealWaitPut = function (eD) {
    var tData = MjClient.data.sData.tData;

    if (tData.tState != TableState.waitPut) {
        MjClient.playui.handleNoPutTips(false);
        MjClient.playui.handleHimtAndNoPutBtn(false);
        MjClient.playui.handlePutCardBtn(false);
        MjClient.playui.handlePassBtn(false);
        return;
    }
    this.isValidAutoUpCards = true;
    MjClient.playui.startTimeClock(MjClient.playui.clockNumberUpdate);
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
    if (isMe) {
        var pl = getUIPlayer(0);
        if (pl) {
            pl.isWrongful = false;
        }
    }
    MjClient.playui.setWaitTingTiVisible(false);
    MjClient.playui.handleNoPutTips(isMe && isNotFirst && this.cardTipsArr.length == 0);
    var isCanPut = !(isMe && isNotFirst && this.cardTipsArr.length == 0);
    if (isCanPut) {
        MjClient.playui.handleHimtAndNoPutBtn(isMe, isNotFirst);
        MjClient.playui.handleNoPutTag(off, false);
        MjClient.playui.handleUpRightCards(!isNotFirst, off);
        MjClient.playui.handlePutCardBtn(isMe, !isNotFirst);
        MjClient.playui.enablePutCardBtn(this.handCardsWgetArr[0].getUpCardArr().length > 0);
        MjClient.playui.handlePassBtn(false);
    } else {
        MjClient.playui.handleNoPutTag(off, false);
        MjClient.playui.handlePassBtn(true);
    }
    for (var i = 0; i < MjClient.playui.headOffLen; i++) {
        var off = MjClient.playui.headOffArr[i];
        MjClient.playui.handleTiTag(off, 0);
    }
    this.isCardsSend = false;
};

// 等待叫地主
PlayLayer_doudizhuLF.prototype.dealWaitJiaodizhu = function (msg) {
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    if ((tData.tState != TableState.waitJiazhu) || tData.zhuang != -1 || msg.curPlayer == undefined) {
        MjClient.playui.setHuanLeBtnVisible(false);
        return;
    }
    tData.curPlayer = msg.curPlayer;
    if (tData.uids[msg.curPlayer] == SelfUid()) {
        MjClient.playui.setHuanLeBtnVisible(true, msg.mustJiao);
    }
    MjClient.playui.startTimeClock(MjClient.playui.clockNumberUpdate);
}

// 抢地主
PlayLayer_doudizhuLF.prototype.dealQiangDizhu = function (msg) {
    var tData = MjClient.data.sData.tData;
    if (typeof (msg.curPlayer) != "undefined") {
        tData.curPlayer = msg.curPlayer;
    }
    if (tData.zhuang == 'undefined') {
        tData.zhuang = msg.curPlayer;
    }
    if (msg.qiang) {
        tData.rate = msg.rate;
        MjClient.playui.setTextMult(true);
    }
    MjClient.playui.killTimeClock();
    MjClient.clockNode.visible = false;
    var off = getOffByIndex(tData.curPlayer);
    MjClient.playui.dealQiangDizhuText(off, true, msg);
    MjClient.playui.setHuanLeBtnVisible(false);
}

// 等待准备
PlayLayer_doudizhuLF.prototype.dealAllReady = function () {
    for (var i = 0; i < this.headOffLen; i++) {
        var off = this.headOffArr[i];
        MjClient.playui.handleAboutReady(off);
    }
};

// 加倍
PlayLayer_doudizhuLF.prototype.dealMJJiazhu = function (isSceneData, off, jiazhuNum, curPlayer,isHasTi) {
    var tData = MjClient.data.sData.tData;
    if (typeof (curPlayer) != "undefined") {
        tData.curPlayer = curPlayer;
    }
    var btmp = (tData.tState == TableState.waitJiazhu) ? jiazhuNum : 0;
    var node =getNode_cards(off);
    node.getChildByName("clocknode").visible= false;
    MjClient.playui.handleTiTag(off, btmp);
    this.headNode[off].setTiIcon(jiazhuNum == 1);
    if (!isSceneData) {
        var pl = getUIPlayer(off);
        if (pl) {
            pl.jiazhuNum = jiazhuNum;
        }
        playEffectInPlay(jiazhuNum == 1 ? "ti" : "buti");
        MjClient.playui.dealQiangDizhuText(off, false);
        MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Dingwei", {
            uid: SelfUid(),
            gameType: MjClient.gameType
        });
    }
    if(tData.tState !=TableState.waitJiazhu) return;
    var bshowTi= false;
    for (var i = 0; i < this.headOffLen; i++) {
        var off = this.headOffArr[i];
        MjClient.playui.dealQiangDizhuText(off, false);
        var pl = getUIPlayer(off);
        if(pl.info.uid==tData.uids[tData.zhuang]) {
            continue;
        }
        var x=String(pl.info.uid);
        if(isHasTi[x]){
            bshowTi=true;
            break;
        }
    }
    MjClient.playui.setWaitTingTiVisible(bshowTi);
}
// 等待加倍
PlayLayer_doudizhuLF.prototype.dealWaitJiazhu = function (eD, bSceneData) {
    MjClient.clockNode.visible = false;
    var tData = MjClient.data.sData.tData;
    tData.zhuang = eD.zhuang;
    
    var bIsTurnMe = true;
    if(tData.areaSelectMode.daiti && tData.areaSelectMode.ti_byOrder &&  
       eD.turnPlayer != null && tData.uids[eD.turnPlayer] != SelfUid()){
      bIsTurnMe = false;
    }

    //断线重连
    if((tData.areaSelectMode.daiti && tData.areaSelectMode.ti_byOrder 
        && bSceneData && bIsTurnMe && eD.turnPlayer == null) && 
        (tData.uids[tData.curPlayer] != SelfUid()) ){

        bIsTurnMe = false;
    }

    var pl = getUIPlayer(0);
    if (!pl) {
        return;
    }
    if (tData.tState != TableState.waitJiazhu || tData.zhuang == -1 || pl.jiazhuNum != 0 
        || !bIsTurnMe ) {
        return;
    }
    if (tData.uids[tData.zhuang] == pl.info.uid) {
        var bfanTi = true;
        if (bSceneData) {
            for (var i = 0; i < this.headOffLen; i++) {
                var off = this.headOffArr[i];
                var player = getUIPlayer(off);
                if (player) {
                    if (pl.info.uid == player.info.uid) {
                        continue;
                    }
                    if (player.jiazhuNum == 0) {
                        bfanTi = false;
                    }
                }
            }
        }
        if (bfanTi) {
            MjClient.playui.setBtnTiVisible(true, bfanTi);
        }
    } else {
        MjClient.playui.setBtnTiVisible(true, false);

    }
}

PlayLayer_doudizhuLF.prototype.showClockNode = function(zhuang){
    var targetIndex = zhuang;
    var off = getOffByIndex(targetIndex);
    var node = getNode_cards(off);
    node.getChildByName("clocknode").visible = true;
    var tmptime = node.getChildByName("clocknode").getChildByName("number");
    MjClient.playui.clockNumberUpdate(tmptime);
}
// 处理手牌
PlayLayer_doudizhuLF.prototype.handleMjHand = function () {
    MjClient.playui.showGps();
    MjClient.playui.handleNoPutTips(false);
    MjClient.playui.dealAllReady();
    MjClient.playui.updateGameRound();
    for (var i = 0; i < this.headOffLen; i++) {
        var off = this.headOffArr[i];
        MjClient.playui.dealQiangDizhuText(off, false);
        var pl = getUIPlayer(off);
        if (!pl) {
            continue;
        }
        MjClient.playui.initUserHandUiDoudizhu(off);
        this.headNode[off].updateUserInfo(pl);
    }
}

// 处理底牌
PlayLayer_doudizhuLF.prototype.dealDiCards = function (zhuang, diCards, handCounts, isAddCards, isIconMove,isHasTi) {
    var tData = MjClient.data.sData.tData;
    tData.zhuang = zhuang;
    tData.diCards = diCards == null ? [] : diCards;
    var zhuangOff = getOffByIndex(zhuang);
    if (isAddCards) {
        MjClient.playui.addDiCardsToZhuang(zhuangOff);
    }
    MjClient.playui.handleDoudizhuDiCards();
    for (var i = 0; i < this.headOffLen; i++) {
        var off = this.headOffArr[i];
        MjClient.playui.dealQiangDizhuText(off, false);
        var pl = getUIPlayer(off);
        var isZhuang = false;
        if (pl) {
            isZhuang = tData.uids[tData.zhuang] == pl.info.uid;
            pl.handCount = handCounts[pl.info.uid] ? handCounts[pl.info.uid] : pl.handCount;
        }
        this.headNode[off].showCurrentLeftCardCount(off != 0 ? pl : null, true);
        this.headNode[off].setIconDiZhu(isZhuang);
        if (!isIconMove || zhuangOff != off) {
            continue;
        }
        var node = getNode_cards(off);
        var centerPos = node.convertToNodeSpace(cc.p(MjClient.size.width / 2, MjClient.size.height / 2));
        this.headNode[off].iconMoveToDiZhu(off, centerPos);
    }
    if(tData.tState !=TableState.waitJiazhu) return;
    var bshowTi= false;
    for (var i = 0; i < this.headOffLen; i++) {
        var off = this.headOffArr[i];
        MjClient.playui.dealQiangDizhuText(off, false);
        var pl = getUIPlayer(off);
        if(pl.info.uid==tData.uids[tData.zhuang]) {
            continue;
        }
        var x=String(pl.info.uid);
        if(isHasTi[x]){
            bshowTi=true;
            break;
        }
    }
    this.setWaitTingTiVisible(bshowTi);
}

PlayLayer_doudizhuLF.prototype.setWaitTingTiVisible = function(bVisible){
    this.node.getChildByName("waittingti").visible = bVisible;
}

// =========================[[ 小控件 ]] ========================

PlayLayer_doudizhuLF.prototype.updateUserHeadPosition = function (off, bRoundEnd) {
    var node = this.headParentNode[off];
    if (off == 0) {
        if (bRoundEnd) {
            setWgtLayout(node, [0.43, 0.43], [0.5, 0.24], [0, 0]);
        } else {
            setWgtLayout(node, [0.43, 0.43], [0.06, 0.42 + (isIPhoneX() ? 0.04 : 0)], [0, 0]);
        }
    } else if (off == 1) {
        if (bRoundEnd) {
            setWgtLayout(node, [0.43, 0.43], [0.85, 0.53], [0, 0]);
        } else {
            setWgtLayout(node, [0.43, 0.43], [0.94, 0.68], [0, 0]);
        }
    } else if (off == 2) {
        if (bRoundEnd) {
            setWgtLayout(node, [0.43, 0.43], [0.5, 0.78], [0, 0]);
        } else {
            setWgtLayout(node, [0.43, 0.43], [0.5, 0.92], [0, 0]);
        }
    } else if (off == 3) {
        if (bRoundEnd) {
            setWgtLayout(node, [0.43, 0.43], [0.14, 0.53], [0, 0]);
        } else {
            setWgtLayout(node, [0.43, 0.43], [0.06, 0.68], [0, 0]);
        }
    }
};

PlayLayer_doudizhuLF.prototype.updateTimes = function () {
    var times = this._banner.getChildByName("bg_time");
    var text = new ccui.Text();
    text.setFontName("fonts/lanting.TTF");
    text.setFontSize(26);

    text.setAnchorPoint(1, 0.5);
    text.setPosition(66, 15);
    times.addChild(text);
    text.schedule(function () {

        var time = MjClient.getCurrentTime();
        var str = (time[3] < 10 ? "0" + time[3] : time[3]) + ":" +
            (time[4] < 10 ? "0" + time[4] : time[4]);
        this.setString(str);
    });
};

//设置地区信息
PlayLayer_doudizhuLF.prototype.showGameName = function () {
    var gameName = this.node.getChildByName("gameName");
    setWgtLayout(gameName, [0.25, 0.25], [0.5, 0.58], [0, 0]);
    var text = GameBg[MjClient.gameType];
    gameName.loadTexture(text);
}
//添加还背景的功能
PlayLayer_doudizhuLF.prototype.addChangeBg = function () {
    var btnChange = this.node.getChildByName("Btnchange");//ccui.Button("playing/gameTable/btn_changeBg_normal.png","playing/gameTable/btn_changeBg_press.png");
    var btnSetting = this.node.getChildByName("setting");
    btnSetting.setPositionY(84.15);
    setWgtLayout(btnSetting, [0.09, 0.09], [0.95, 1], [0, -0.6]);

    btnChange.setPosition(btnSetting.x, 30);
    setWgtLayout(btnChange, [0.09, 0.09], [0.89, 1], [0, -0.6]);
    btnChange.setScale(btnSetting.getScale());
    btnChange.addTouchEventListener(function (sender, type) {
        if (type == 2) {
            setCurrentGameBgTypeToNext();
            postEvent("changeGameBgEvent");
            //MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Pifu", {uid:SelfUid(),gameType:MjClient.gameType});
        }
    }, this);
};

PlayLayer_doudizhuLF.prototype.showVoice = function () {
    var voice_btn = this.node.getChildByName("voice_btn");
    initVoiceData();
    voice_btn.addTouchEventListener(function (sender, type) {
        if (type == 0) {
            startRecord();
        } else if (type == 2) {
            endRecord();
        } else if (type == 3) {
            cancelRecord();
        }
    });
    if (MjClient.MaxPlayerNum > 2) {
        setWgtLayout(voice_btn, [0.09, 0.09], [0.95, 0.12], [0, 4.2]);
    } else {
        setWgtLayout(voice_btn, [0.09, 0.09], [0.95, 0.08], [0, 4.2]);
    }
};

PlayLayer_doudizhuLF.prototype.addWaitNode = function () {
    this.waitNode = new PokerWaitNode_Doudizhu();
    this.waitNode.node.setPosition(cc.p(0, 0));
    MjClient.playui.node.addChild(this.waitNode.node);
};
PlayLayer_doudizhuLF.prototype.setWaitNodeVisible = function (bVisible) {
    if (!MjClient.playui.waitNode) {
        return;
    }
    MjClient.playui.waitNode.setVisible(bVisible);
}

PlayLayer_doudizhuLF.prototype.addAniLayer = function () {
    this.AniLayer = new Animature_doudizhu();
    MjClient.playui.node.addChild(this.AniLayer, 1000);
    setWgtLayout(this.AniLayer, [1, 1], [0, 0], [0, 0]);
};
PlayLayer_doudizhuLF.prototype.showTableID = function (bShow) {
    var textTableId = this._banner.getChildByName("tableid");
    textTableId.ignoreContentAdaptWithSize(true);
    textTableId.setString("" + MjClient.data.sData.tData.tableid);
}

PlayLayer_doudizhuLF.prototype.setBtnTiVisible = function (bVisible, bFanTi) {
    var BtnTi = this.node.getChildByName("BtnTi");
    var BtnBuTi = this.node.getChildByName("BtnBuTi");
    BtnTi.visible = bVisible;
    BtnBuTi.visible = bVisible;
    if (!bVisible) {
        return;
    }
    var d = isIPhoneX() ? 0.04 : 0;
    setWgtLayout(BtnTi, [0.14, 0.14], [0.6, 0.42 + d], [0, 0]);
    setWgtLayout(BtnBuTi, [0.14, 0.14], [0.4, 0.42 + d], [0, 0]);
    if (!bVisible) {
        return;
    }
    if (bFanTi) {
        BtnTi.loadTextureNormal("playing/doudizhu/fanti.png");
    } else {
        BtnTi.loadTextureNormal("playing/doudizhu/ti.png");
    }
}

// 出牌按钮
PlayLayer_doudizhuLF.prototype.handlePutCardBtn = function (isVisible, isFirst) {
    var btnPutCard = this.node.getChildByName("BtnPutCard");
    var tData = MjClient.data.sData.tData;
    isVisible = tData.tState == TableState.waitPut && isVisible;
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
    MjClient.playui.enablePutCardBtn(false);
    MjClient.playui.showWrongToast(false);
};

PlayLayer_doudizhuLF.prototype.enablePutCardBtn = function (bAble) {
    var btnPutCard = this.node.getChildByName("BtnPutCard");
    if (!IsTurnToMe()) { return ;}
    if (!btnPutCard.visible) { return ;}
    btnPutCard.setBright(bAble);
    btnPutCard.setTouchEnabled(bAble);
}
//操作按钮(提示和不出)
PlayLayer_doudizhuLF.prototype.handleHimtAndNoPutBtn = function (isVisible, isAble) {
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

//欢乐斗地主叫分按钮
PlayLayer_doudizhuLF.prototype.setHuanLeBtnVisible = function (bVisible, bMustJiao) {
    var btnJiaoDiZhu = this.node.getChildByName("BtnJiaodizhu");
    var btnBuJiao = this.node.getChildByName("Btnbujiao");
    btnJiaoDiZhu.visible = bVisible;
    btnBuJiao.visible = bVisible;
    if (!bVisible) {
        return;
    }
    var d;
    if (isIPhoneX()) {
        d = 0.04;
    } else {
        d = 0;
    }
    setWgtLayout(btnJiaoDiZhu, [0.135, 0.128], [0.4, 0.42 + d], [0, 0]);
    setWgtLayout(btnBuJiao, [0.135, 0.128], [0.6, 0.42 + d], [0, 0]);
    btnJiaoDiZhu.loadTextureNormal("playing/doudizhu/qiangdizhu.png");
    btnBuJiao.loadTextureNormal("playing/doudizhu/buqiang.png");
    cc.log("11111111111+++++++" + bMustJiao);
    if (bMustJiao) {
        btnBuJiao.setBright(false);
        btnBuJiao.setTouchEnabled(false);
    } else {
        btnBuJiao.setBright(true);
        btnBuJiao.setTouchEnabled(true);
    }
}

// 牌局信息
PlayLayer_doudizhuLF.prototype.showRoundInfo = function () {
    if (!this.isSDataValid()) {
        return;
    }
    var nodeRoundInfo = this.node.getChildByName("round_info_node");
    var textRoundInfo = nodeRoundInfo.getChildByName("roundInfo");

    var tData = MjClient.data.sData.tData;
    var str = getPlaySelectPara(MjClient.gameType, tData.areaSelectMode);
    if (str.charAt(str.length - 1) == ",") {
        str = str.substring(0, str.length - 1);
    }
    textRoundInfo.visible = true;
    textRoundInfo.setString(str);
    textRoundInfo.ignoreContentAdaptWithSize(true);
    setWgtLayout(nodeRoundInfo, [0.13, 0.13], [0.5, 0.5], [0, 0]);
};

// 局数
PlayLayer_doudizhuLF.prototype.updateGameRound = function () {
    var Text_jushu = this._banner.getChildByName("Text_jushu");
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    Text_jushu.setString((tData.roundAll - tData.roundNum + 1) + "/" + tData.roundAll + "局");
    Text_jushu.ignoreContentAdaptWithSize(true);
}

// 加倍
PlayLayer_doudizhuLF.prototype.setTextMult = function (bShow) {
    var textMult = this._banner.getChildByName("Text_mult");
    textMult.ignoreContentAdaptWithSize(true);
    var str = bShow && MjClient.data.sData.tData.rate > 0 ? MjClient.data.sData.tData.rate + "" : "";
    textMult.setString(str);
};

// 底分
PlayLayer_doudizhuLF.prototype.handleDifen = function () {
    var textDifen = this._banner.getChildByName("Text_difen");
    var tData = MjClient.data.sData.tData;
    var difen = tData.areaSelectMode.difen;
    var fenStr = difen > 0 ? difen : "";
    cc.log("handledifen-----------" + difen);
    textDifen.setString(fenStr);

    textDifen.ignoreContentAdaptWithSize(true);
}

// 不抢/抢地主
PlayLayer_doudizhuLF.prototype.dealQiangDizhuText = function (off, visible, msg) {
    var node = getNode_cards(off);
    var diZhuTag = node.getChildByName("jiaodizhuTag");
    diZhuTag.visible = visible;

    if (!visible) {
        return;
    }

    diZhuTag.setScale(MjClient.size.width / 1280);
    diZhuTag.ignoreContentAdaptWithSize(true);
    if (off == 0) {
        setWgtLayout(diZhuTag, [0.08, 0.08], [0.5, 0.4 + (isIPhoneX() ? 0.04 : 0)], [0, 0]);
    } else if (off == 1) {
        setWgtLayout(diZhuTag, [0.08, 0.08], [0.84, 0.68], [0, 0]);
    } else if (off == 2) {
        setWgtLayout(diZhuTag, [0.08, 0.08], [0.5, 0.74], [0, 0]);
    } else {
        setWgtLayout(diZhuTag, [0.08, 0.08], [0.17, 0.68], [0, 0]);
    }
    if (msg.qiang) {
        if (MjClient.playui.isJD()) {
            diZhuTag.loadTexture("playing/doudizhu/fen_" + msg.qiang + ".png");
            playEffectInPlay("robDZScore" + msg.qiang.toString())
        } else {
            msg.hasJiao ? playEffectInPlay("robDZ") : playEffectInPlay("jiaodizhu");
            var res = msg.hasJiao ? "playing/doudizhu/qiangdizhu2.png" : "playing/doudizhu/jiaodizhu.png";
            diZhuTag.loadTexture(res);
        }
    } else {
        msg.hasJiao ? playEffectInPlay("notRobDZ") : playEffectInPlay("bujiao");
        var res = msg.hasJiao ? "playing/doudizhu/buqiang2.png" : "playing/doudizhu/bujiao.png";
        diZhuTag.loadTexture(res);
    }
}

// 要不起
PlayLayer_doudizhuLF.prototype.handleNoPutTag = function (off, visible) {
    var node = getNode_cards(off);
    var noPut = node.getChildByName("noPutTag");
    noPut.visible = visible;
    if (off == 0) {
        setWgtLayout(noPut, [0.117, 0], [0.5, 0.32], [0, 1]);
    } else if (off == 1) {
        setWgtLayout(noPut, [0.117, 0], [0.84, 0.68], [-0.3, 0]);
    } else if (off == 2) {
        setWgtLayout(noPut, [0.117, 0], [0.5, 0.74], [0, 0]);
    } else if (off == 3) {
        var dx = isIPhoneX() ? 0.5 : 0.3;
        setWgtLayout(noPut, [0.117, 0], [0.16, 0.68], [dx, 0]);
    }
}

// 没有大过上家
PlayLayer_doudizhuLF.prototype.handleNoPutTips = function (isVisible) {
    var noPutTips = this.node.getChildByName("noPutTips");
    noPutTips.visible = isVisible;
    if (!isVisible) {
        return;
    }

    setWgtLayout(noPutTips, [0.39, 0], [0.5, 0.1], [0, 0]);
};

// 没有大过上家
PlayLayer_doudizhuLF.prototype.handlePassBtn = function (isVisible) {
    var BtnPass = this.node.getChildByName("BtnPass");
    BtnPass.visible = isVisible;
    if (!isVisible) {
        return;
    }
    var d = isIPhoneX() ? 0.02 : 0;
    setWgtLayout(BtnPass, [0.135, 0.128], [0.5, 0.43 + d], [0, 0]);
};
// =========================[[ 系统 ]] ==========================
PlayLayer_doudizhuLF.prototype.dealSendVoice = function (fullFilePath) {
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
}

PlayLayer_doudizhuLF.prototype.dealDownAndPlayVoice = function (msg) {
    MjClient.native.HelloOC("downloadPlayVoice ok");
    MjClient.data._tempMessage = msg;
    MjClient.native.HelloOC("mas is" + JSON.stringify(msg));
    downAndPlayVoice(msg.uid, msg.msg);
}

PlayLayer_doudizhuLF.prototype.dealUploadRecord = function (filePath) {
    if (filePath) {
        MjClient.native.HelloOC("upload voice file");
        MjClient.native.UploadFile(filePath, MjClient.remoteCfg.voiceUrl, "sendVoice");
    } else {
        MjClient.native.HelloOC("No voice file update");
    }
};

// =========================[[ 界面 ]] ==========================

// 绘制手牌
PlayLayer_doudizhuLF.prototype.initUserHandUiDoudizhu = function (off) {
    var pl = getUIPlayer(off);
    if (pl == null) {
        return;
    }
    var tData = MjClient.data.sData.tData;
    var node = getNode_cards(off);
    if (tData.tState != TableState.waitPut &&
        tData.tState != TableState.waitEat &&
        tData.tState != TableState.waitCard &&
        tData.tState != TableState.waitJiazhu) {
        return;
    }
    this.handCardsWgetArr[off].initHandCards();
};

//处理出牌,打牌动作
PlayLayer_doudizhuLF.prototype.dealPKPutcard = function (off, msg) {
    var sData = MjClient.data.sData;
    var tData = sData.tData;
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

PlayLayer_doudizhuLF.prototype.playAnimation = function (cards, off) {
    var pl = getUIPlayer(off);
    if (!pl) {
        return;
    }
    var pos = this.deskCardsWgetArr[off].getMiddleCardsPos();
    var nodePos = this.deskCardsWgetArr[off].node.convertToWorldSpaceAR(pos);
    var cardType = MjClient.majiang.cardsType(cards);
    this.AniLayer.loadCardTypeAni(cardType, nodePos, off, pl.isChunTian);
}
// 增加底牌
PlayLayer_doudizhuLF.prototype.addDiCardsToZhuang = function (zhuangOff) {
    var tData = MjClient.data.sData.tData;
    if (tData.diCards.length == 0) {
        return;
    }
    if (zhuangOff == 0 || MjClient.rePlayVideo != -1) {
        this.handCardsWgetArr[zhuangOff].addCardsForHand(tData.diCards)
    }
};
//踢
PlayLayer_doudizhuLF.prototype.handleTiTag = function (off, type) {
    var node = getNode_cards(off);
    var jiabeiTag = node.getChildByName("tiTagicon");
    if (type != 0 && type) {
        jiabeiTag.visible = true;
    } else {
        jiabeiTag.visible = false;
        return
    }
    if (off == 0) {
        setWgtLayout(jiabeiTag, [0.117, 0], [0.5, 0.32], [0, 1]);
    } else if (off == 1) {
        setWgtLayout(jiabeiTag, [0.117, 0], [0.88, 0.68], [-0.2, 0]);
    } else if (off == 2) {
        setWgtLayout(jiabeiTag, [0.117, 0], [0.5, 0.74], [0, 0]);
    } else if (off == 3) {
        var dx = isIPhoneX() ? 0.5 : 0.2;
        setWgtLayout(jiabeiTag, [0.117, 0], [0.12, 0.68], [dx, 0]);
    }
    var jiabeistr;
    jiabeistr = (type == 1) ? "playing/doudizhu/tiTag.png" : "playing/doudizhu/butiTag.png";
    var scaleData = MjClient.size.width / 74 * 0.08;
    jiabeiTag.setScale(scaleData, scaleData);
    jiabeiTag.ignoreContentAdaptWithSize(true);
    jiabeiTag.loadTexture(jiabeistr);
};

// 处理准备字准备相关
PlayLayer_doudizhuLF.prototype.handleAboutReady = function (off) {
    var isFull = !IsInviteVisible();
    var imgReady = getNode_cards(off).getChildByName("ready");
    imgReady.visible = false;
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
    if (pl == undefined) {
        return;
    }
    var tData = MjClient.data.sData.tData;
    var isShowText = isFull && pl.mjState == TableState.isReady && tData.tState != TableState.waitJoin;

    if (off == 0) {
        MjClient.playui.setWaitNodeVisible(!isFull);
        var btnReady = MjClient.playui.node.getChildByName("BtnReady");
        var isShow = isFull && pl.mjState == TableState.waitReady;
        btnReady.visible = isShow;
        if (isShow) {
            setWgtLayout(btnReady, [0.2, 0.2], [0.5, 0.37], [0, 0]);
        }
    }
    imgReady.visible = isShowText;
    if (!isShowText) {
        return;
    }
    var tData = MjClient.data.sData.tData;
    var roundNum = tData.roundAll - tData.roundNum + 1;
    var arr = [[0, -1.5], [3.6, 0.4], [0, 1.5], [-3.2, 0.4]];
    setWgtLayout(imgReady, [0.07, 0.07], ([0.5, 0.5]), arr[off]);
};

PlayLayer_doudizhuLF.prototype.startTimeClock = function (func) {
    var number = MjClient.clockNode.getChildByName("number");
    number.ignoreContentAdaptWithSize(true);
    number.setString("00");
    MjClient.playui.killTimeClock();
    MjClient.clockNode.visible = true;
    var tData = MjClient.data.sData.tData;
    var off = getOffByIndex(tData.curPlayer);
    var cardNode = getNode_cards(off);
    var clockNode = cardNode.getChildByName("clocknode")
    MjClient.clockNode.setPosition(clockNode.getPosition());
    if (tData.tState == TableState.waitPut && off == 0) {
        if (isIPhoneX()) {
            setWgtLayout(clockNode, [0.052, 0], [0.50, 0.24], [0, 3.0]);
        } else {
            setWgtLayout(clockNode, [0.052, 0], [0.50, 0.3], [0, 3.0]);
        }
    }
    if (func != undefined && func != null) {
        func(number);
    }
}

PlayLayer_doudizhuLF.prototype.killTimeClock = function () {
    MjClient.clockNode.getChildByName("number").stopAllActions();
    stopEffect(playTimeUpEff);
    playTimeUpEff = null;
};

PlayLayer_doudizhuLF.prototype.clockNumberUpdate = function (node, endFunc) {
    return arrowbkNumberUpdate(node, endFunc);
}

PlayLayer_doudizhuLF.prototype.checkRoomUiDelete = function () {
    if (MjClient.rePlayVideo != -1) return; //回放的时候，不弹解散窗口
    if (!this.isSDataValid()) {
        return;
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

PlayLayer_doudizhuLF.prototype.showGps = function () {
    if (MjClient.endoneui != null) {
        MjClient.endoneui.removeFromParent(true);
        MjClient.endoneui = null;
    }
    if (!this.isSDataValid()) {
        return;
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
PlayLayer_doudizhuLF.prototype.handleDoudizhuDiCards = function () {
    var cards = MjClient.data.sData.tData.diCards;
    var isShow = cards != null && cards.length > 0;
    var pl = getUIPlayer(0);
    var tData = MjClient.data.sData.tData;
    if (pl) {
        isShow = isShow && (tData.uids[tData.zhuang] == pl.info.uid);
    }
    var diCardsNum = 4;
    var startX = this._banner.getChildByName("dizhuCards_0").x;
    for (var i = 0; i < diCardsNum; i++) {
        var cardNode = this._banner.getChildByName("dizhuCards_" + i);
        if (MjClient.MaxPlayerNum == 2) {
            if (i == 3) {
                cardNode.visible = false;
                continue;
            }
            cardNode.x = startX + i * 65;
        } else {
            cardNode.x = startX + i * 43;
        }
        if (!isShow) {
            cardNode.removeAllChildren();
            cardNode.loadTexture("playing/cardPic2/beimian_puke.png");
        } else {
            setCardSprite_card(cardNode, cards[i], false);
        }
    }
}
// =========================[[ 事件 ]] ==========================

PlayLayer_doudizhuLF.prototype.dealMJTick = function (eD) {
    for (var i = 0; i < this.headOffLen; i++) {
        var off = this.headOffArr[i];
        var pl = getUIPlayer(off);
        if (!pl) {
            continue;
        }
        this.headNode[off].setUserOffline(pl);
    }
}
PlayLayer_doudizhuLF.prototype.dealPKWrongful = function (eD) {
    var pl = getUIPlayer(0);
    if (pl && pl.info.uid == eD.uid)
        MjClient.playui.showWrongToast(true);
}
PlayLayer_doudizhuLF.prototype.dealLogout = function () {
    if (MjClient.playui) {
        MjClient.addHomeView();
        MjClient.playui.removeFromParent(true);
        delete MjClient.playui;
        delete MjClient.endoneui;
        delete MjClient.endallui;
    }
}

PlayLayer_doudizhuLF.prototype.dealEndRoom = function (msg) {
    mylog(JSON.stringify(msg));
    if (msg.showEnd) {
        this.addChild(new GameOverLayer_doudizhu(), 500);
    } else {
        MjClient.Scene.addChild(new StopRoomView());
    }
}

PlayLayer_doudizhuLF.prototype.dealLeaveGame = function () {
    MjClient.playui.killTimeClock();
    MjClient.addHomeView();
    MjClient.playui.removeFromParent(true);
    delete MjClient.playui;
    delete MjClient.endoneui;
    delete MjClient.endallui;
    cc.audioEngine.stopAllEffects();
    playMusic("bgMain");
}

PlayLayer_doudizhuLF.prototype.dealLoadWxHead = function (eD) {
    for (var i = 0; i < this.headOffLen; i++) {
        var off = this.headOffArr[i];
        if (eD.uid == getUIHeadByOff(off).uid) {
            this.headNode[off].setWxHead(true, eD.img);
        }
    }
}

PlayLayer_doudizhuLF.prototype.dealPlayVoice = function (msg) {
    for (var i = 0; i < this.headOffLen; i++) {
        var off = this.headOffArr[i];
        this.headNode[off].showUserChat(off, msg);
    }
}

PlayLayer_doudizhuLF.prototype.dealChangeGameBgEvent = function () {
    var back = MjClient.playui.node.getChildByName("back");
    var back2 = back.getChildByName("back");
    setWgtLayout(back2, [1, 1], [0.5, 0.5], [0, 0], true);
    changeGameBg(back2);
};

// 1 add 2 remove 3 online
PlayLayer_doudizhuLF.prototype.handlePlayerChange = function (action, uid) {
    if (!this.isSDataValid()) {
        return;
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
    if (!this.isSDataValid()) {
        return;
    }
    var tData = MjClient.data.sData.tData;
    var roundNum = tData.roundAll - tData.roundNum + 1;
    var isRoundEnd = MjClient.playui.isRoundEnd() && (roundNum <= 1);
    for (var i = 0; i < this.headOffLen; i++) {
        var off = this.headOffArr[i];
        MjClient.playui.handleAboutReady(off);
        var node = getNode(off);
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
}
PlayLayer_doudizhuLF.prototype.hideAllPlayerReadyState = function () {
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

PlayLayer_doudizhuLF.prototype.dealMoveHead = function () {
    for (var i = 0; i < this.headOffLen; i++) {
        var off = this.headOffArr[i];
        var node = this.headParentNode[off];
        var srcPos = cc.p(node.x, node.y);
        MjClient.playui.updateUserHeadPosition(off, false);
        var nodePos = cc.p(node.x, node.y);
        node.setPosition(srcPos);
        node.runAction(cc.moveTo(0.3, nodePos).easing(cc.easeCubicActionOut()));
    }
    sendGPS();
    MjClient.checkChangeLocationApp();
    postEvent("returnPlayerLayer");
}
// =========================[[ 消息 ]] ===========================
// 加倍
PlayLayer_doudizhuLF.prototype.sendTiToServer = function (TiNum) {
    MjClient.playui.setBtnTiVisible(false);
    MjClient.gamenet.request("pkroom.handler.tableMsg", {
        cmd: "MJJiazhu",
        jiazhuNum: TiNum,
    });
}
// 叫地主、不叫、叫分
PlayLayer_doudizhuLF.prototype.sendQiangdizhuToServer = function (bQiang) {
    MjClient.playui.setHuanLeBtnVisible(false);
    MjClient.gamenet.request("pkroom.handler.tableMsg", {
        cmd: "Qiangdizhu",
        qiang: bQiang
    });
};
// 出牌
PlayLayer_doudizhuLF.prototype.sendPutCardsToServer = function () {
    if (this.isCardsSend) {
        return;
    }
    ;
    var outCardArr = this.handCardsWgetArr[0].getUpCardArr();
    if (outCardArr.length <= 0) return;
    if (!MjClient.playui.isCanPutCards(outCardArr)) { // 出牌不合法
        return;
    }
    MjClient.gamenet.request("pkroom.handler.tableMsg", {
        cmd: "PKPut",
        card: outCardArr,
        putCardType: MjClient.playui.putCardType,
        tingAfterPut: false
    });
    this.isCardsSend = true;
    MjClient.playui.dealPKPutcard(0, {card: outCardArr}); // 提前出牌
    //隐藏出牌按钮
    MjClient.playui.handleHimtAndNoPutBtn(false);
    MjClient.playui.handlePutCardBtn(false);
};
// 发送斗地主错误提牌
PlayLayer_doudizhuLF.prototype.sendDoudizhuPutCardWrongful = function (pl) {
    if (pl == null || pl.isWrongful) {
        return; // 已经上报过一次了,一次出牌记录一次
    }
    pl.isWrongful = true;
    var cards = this.handCardsWgetArr[0].getUpCardArr();
    MjClient.gamenet.request("pkroom.handler.tableMsg", {
        cmd: "PKWrongful",
        cards: cards
    });
}
// 准备-1， 提示过牌0， 不出 1
PlayLayer_doudizhuLF.prototype.sendPassToServer = function (isActivePass) {
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
}

// =========================[[ 初始化 ]] ==========================
PlayLayer_doudizhuLF.prototype.initTagList = function () {
    this.btnTagList = {
        BtnPutCard: 1, BtnHimt: 2, BtnNoPut: 3, BtnJiaodizhu: 4, Btnbujiao: 5, BtnReady: 6, BtnTi: 7, BtnBuTi: 8,
        setting: 9, back_btn: 10, Button_1: 11, gps_btn: 12, chat_btn: 13, BtnPass:14
    };
}
PlayLayer_doudizhuLF.prototype.initData = function (isRoundEnd) {
    this.cardTipsArr = [];
    this.tipsIdx = 0;
    this.isCardsSend = false; // 判断是否已经出牌
    this.isValidAutoUpCards = true; // 斗地主提牌
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
    tData.rate = 0;
    tData.minJiaofen = -1;


    for (var i = 0; i < this.headOffLen; i++) {
        var off = this.headOffArr[i];
        var pl = getUIPlayer(off);
        if (pl == null) continue;
        pl.handCount = 0;
        pl.jiazhuNum = 0;
    }

}

PlayLayer_doudizhuLF.prototype.initOnce = function () {
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

PlayLayer_doudizhuLF.prototype.initUI = function () {
    this._downNode = this.node.getChildByName("down");
    this._rightNode = this.node.getChildByName("right");
    this._rightNode.visible = (MjClient.MaxPlayerNum >= 3);
    this._topNode = this.node.getChildByName("top");
    this._topNode.visible = (MjClient.MaxPlayerNum != 3);

    this._leftNode = this.node.getChildByName("left");
    this._leftNode.visible = (MjClient.MaxPlayerNum >= 3);
    this._AniNode = this.node.getChildByName("eat");
    this._banner = this.node.getChildByName("banner");
    this._jiazhuWait = this.node.getChildByName("jiazhuWait");
    this._toastImg = this.node.getChildByName("img_toast");
    var waittingti = this.node.getChildByName("waittingti");
    setWgtLayout(waittingti, [0.39, 0], [0.5, 0.65], [0, 0]);
    var wifi = this._banner.getChildByName("wifi");
    updateWifiState(wifi);
    var powerBar = this._banner.getChildByName("powerBar");
    updateBattery(powerBar);
    var Button_1 = this._banner.getChildByName("Button_1");
    Button_1.visible = true;
    MjClient.clockNode = this.node.getChildByName("clock");
    setWgtLayout(MjClient.clockNode, [0.135, 0.128], [0.41, 0.40 + (isIPhoneX() ? 0.04 : 0)], [0, 0]);
    MjClient.clockNode.visible = false;
    this.clockNodePosX = MjClient.clockNode.getPositionX();
    this.clockNodePosY = MjClient.clockNode.getPositionY();
    var isHaveGPS = MjClient.MaxPlayerNum > 2;
    var gps_btn = this.node.getChildByName("gps_btn");
    gps_btn.setVisible(isHaveGPS);
    var positionCard = this.node.getChildByName("positionCard");
    positionCard.visible = false;
    var btnChat = this.node.getChildByName("chat_btn");
    if (MjClient.MaxPlayerNum != 2)
        setWgtLayout(btnChat, [0.09, 0.09], [0.95, 0.08], [0, 3.6]);
    else
        setWgtLayout(btnChat, [0.09, 0.09], [0.95, 0], [0, 3.8]);

    setWgtLayout(gps_btn, [0.09, 0.09], [0.95, 1], [0, -1.9]);
    setWgtLayout(this._banner, [0.5, 0.5], [0, 1], [0, 0]);
};
PlayLayer_doudizhuLF.prototype.hideAllUI = function () {
    for (var off = 0; off < 4; off++) {
        var node = getNode_cards(off);
        var ready = node.getChildByName("ready");
        var noPutTag = node.getChildByName("noPutTag");
        var jiaodizhuTag = node.getChildByName("jiaodizhuTag");
        var clocknodetmp = node.getChildByName("clocknode");
        ready.visible = false;
        noPutTag.visible = false;
        jiaodizhuTag.visible = false;
        clocknodetmp.visible = false;
    }
    var BtnPutCard = this.node.getChildByName("BtnPutCard");
    var BtnHimt = this.node.getChildByName("BtnHimt");
    var BtnNoPut = this.node.getChildByName("BtnNoPut");
    var BtnJiaodizhu = this.node.getChildByName("BtnJiaodizhu");
    var Btnbujiao = this.node.getChildByName("Btnbujiao");
    var BtnReady = this.node.getChildByName("BtnReady");
    var BtnTi = this.node.getChildByName("BtnTi");
    var BtnBuTi = this.node.getChildByName("BtnBuTi");
    var noPutTips = this.node.getChildByName("noPutTips");
    var BtnPass = this.node.getChildByName("BtnPass");
    var waittingti = this.node.getChildByName("waittingti");
    waittingti.visible = false;
    BtnPutCard.visible = false;
    BtnHimt.visible = false;
    BtnNoPut.visible = false;
    BtnJiaodizhu.visible = false;
    Btnbujiao.visible = false;
    BtnReady.visible = false;
    BtnTi.visible = false;
    BtnBuTi.visible = false;
    BtnPass.visible = false;
    noPutTips.visible = false;
}
// 初始化节点
PlayLayer_doudizhuLF.prototype.initHeadWget = function () {
    this.headOffArr = [];
    this.headNode = {};
    this.handCardsWgetArr = {}
    this.deskCardsWgetArr = {}
    this.headParentNode = {}
    this.headOffLen = MjClient.MaxPlayerNum;
    for (var off = 0; off < 4; off++) {
        if (MjClient.MaxPlayerNum == 2) {
            if ((off == 3 || off == 4)) {
                continue;
            }
            if (off == 1) {
                off = 2;
            }
        }
        if (MjClient.MaxPlayerNum == 3) {
            if (off == 3) {
                continue;
            }
            if (off == 2) {
                off = 3;
            }
        }
        var _node = getNode(off);
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
        this.handCardsWgetArr[off] = new PokerCardNode_Doudizhu(off, cardScale);
        nodeStand.addChild(this.handCardsWgetArr[off].node);
        this.deskCardsWgetArr[off] = new PokerCardNode_Doudizhu(off, cardScale);
        nodeDeskCard.addChild(this.deskCardsWgetArr[off].node);
        var play_tips = _node.getChildByName("play_tips");// 无用UI
        play_tips.visible = false;
        nodeStand.setAnchorPoint(0, 0.5);
        if (off == 0) {
            setWgtLayout(nodeStand, [cardScale, 0], [0.0, (isIPhoneX() ? 0.32 : 0.30)], [0, 0]);
            setWgtLayout(nodeDeskCard, [0.075, 0], [0, 0.55], [0, 0]);
        } else if (off == 1) {
            setWgtLayout(nodeStand, [0, 0.09], [0.85, 0.87], [0, 0]);
            setWgtLayout(nodeDeskCard, [0.075, 0], [0.88, 0.74], [0, 0]);
        } else if (off == 2) {
            setWgtLayout(nodeStand, [0, 0.09], [0.63, 0.94], [0, 0]);
            setWgtLayout(nodeDeskCard, [0.075, 0], [0.53, 0.83], [-0.1, 0]);
        } else if (off == 3) {
            setWgtLayout(nodeStand, [0, 0.09], [0.18, 0.98], [0, 0]);
            setWgtLayout(nodeDeskCard, [0.075, 0], [0.21, 0.74], [0, 0]);
        }
        if (!this.isSDataValid()) {
            continue;
        }
        var tData = MjClient.data.sData.tData;
        var roundNum = tData.roundAll - tData.roundNum + 1;
        var isRoundEnd = MjClient.playui.isRoundEnd() && (roundNum <= 1);
        MjClient.playui.updateUserHeadPosition(off, isRoundEnd);
    }
}
//初始化玩家信息
PlayLayer_doudizhuLF.prototype.initMsgEvent = function () {
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
    UIEventBind(null, this.node, "mjhand", function (eD) {
        MjClient.playui.handleMjHand();
    });
    UIEventBind(null, this.node, "waitJiaodizhu", function (eD) {//这个消息收到两次，第一次没有curplayer字段，第二次有
        var sData = MjClient.data.sData;
        var tData = sData.tData;
        tData.tState = TableState.waitJiazhu;
        MjClient.playui.dealWaitJiaodizhu(eD);
    });
    UIEventBind(null, this.node, "Qiangdizhu", function (eD) {
        MjClient.playui.dealQiangDizhu(eD);
    });
    UIEventBind(null, this.node, "diCards", function (eD) {

        MjClient.playui.dealDiCards(eD.zhuang, eD.diCards, eD.handCounts, true, true,eD.isHasTi);
    });
    UIEventBind(null, this.node, "waitJiazhu", function (eD) {
        MjClient.playui.dealWaitJiazhu(eD, false);
    });
    UIEventBind(null, this.node, "MJJiazhu", function (eD) {
        var off = getUiOffByUid(eD.uid);
        MjClient.playui.dealMJJiazhu(false, off, eD.jiazhuNum, eD.curPlayer,eD.isHasTi);
    });
    UIEventBind(null, this.node, "waitPut", function (eD) {
        MjClient.playui.dealWaitPut(eD);
    });
    UIEventBind(null, this.node, "PKPut", function (eD) {
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
    UIEventBind(null, this.node, "PKWrongful", function (eD) {
        MjClient.playui.dealPKWrongful(eD);
    });
};

PlayLayer_doudizhuLF.prototype.initClickEvent = function () {
    var btnCallback = function (sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED) {
            MjClient.playui.btnEventListener(sender, type);
        }
    }
    var btnList1 = ["BtnPutCard", "BtnHimt", "BtnNoPut", "BtnJiaodizhu", "Btnbujiao", "BtnTi", "BtnBuTi",
        "BtnReady", "gps_btn", "chat_btn", "setting", "BtnPass"];
    for (var i = 0; i < btnList1.length; i++) {
        MjClient.playui.btnBindCallBack(MjClient.playui.node, btnList1[i], this.btnTagList[btnList1[i]], btnCallback);
    }

    var btnList2 = ["Button_1"];
    for (var i = 0; i < btnList2.length; i++) {
        MjClient.playui.btnBindCallBack(MjClient.playui._banner, btnList2[i], this.btnTagList[btnList2[i]], btnCallback);
    }
};

PlayLayer_doudizhuLF.prototype.btnBindCallBack = function (parent, str, tag, callback) {
    var tmpNode = parent.getChildByName(str);
    tmpNode.tag = tag;
    tmpNode.addTouchEventListener(callback);
};

PlayLayer_doudizhuLF.prototype.btnEventListener = function (sender, type) {
    var tag = sender.getTag();
    if (tag == this.btnTagList.BtnPutCard) { // 出牌
        var pl = getUIPlayer(0);
        if (pl && !MjClient.playui.isPutCardLegitimate()) { // 斗地主出牌不合法
            MjClient.playui.sendDoudizhuPutCardWrongful(pl);
            return;
        }
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
        sender.visible = false;
        MjClient.playui.sendPassToServer(-1);
        MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Zhunbei", {
            uid: SelfUid(),
            gameType: MjClient.gameType
        });
    } else if (tag == this.btnTagList.BtnJiaodizhu || tag == this.btnTagList.Btnbujiao) { // 欢乐叫地主/不叫
        MjClient.clockNode.visible = false;
        MjClient.playui.sendQiangdizhuToServer(tag == this.btnTagList.BtnJiaodizhu);
    } else if (tag == this.btnTagList.Btnbujiao_JD || tag == this.btnTagList.Btnfen1 || tag == this.btnTagList.Btnfen2 || tag == this.btnTagList.Btnfen3) { // 经典
        MjClient.clockNode.visible = false;
        var score = {};
        score[this.btnTagList.Btnfen1] = 1;
        score[this.btnTagList.Btnfen2] = 2;
        score[this.btnTagList.Btnfen3] = 3;
        MjClient.playui.sendQiangdizhuToServer(score[tag] || 0);
    } else if (tag == this.btnTagList.BtnTi || tag == this.btnTagList.BtnBuTi) { // 加倍 不加倍
        var rate = tag == this.btnTagList.BtnTi ? 1 : -1;
        MjClient.playui.sendTiToServer(rate);
    } else if (tag == this.btnTagList.setting) {
        var settringLayer = new SettingViewCard();
        settringLayer.setName("PlayLayerClick");
        MjClient.Scene.addChild(settringLayer);
        MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Shezhi", {
            uid: SelfUid(),
            gameType: MjClient.gameType
        });
    } else if (tag == this.btnTagList.back_btn) {
        MjClient.showMsg("是否解散房间？", function () {
            MjClient.delRoom(true);
        }, function () {
        }, 1);
    } else if (tag == this.btnTagList.Button_1) {
        MjClient.openWeb({url: MjClient.GAME_TYPE.PAO_DE_KUAI, help: true});
    } else if (tag == this.btnTagList.gps_btn) {
        if (MjClient.MaxPlayerNum == 3) {
            MjClient.Scene.addChild(new showDistance3PlayerLayer());
        } else if (MjClient.MaxPlayerNum == 4) {
            MjClient.Scene.addChild(new showDistanceLayer());
        }
    } else if (tag == this.btnTagList.chat_btn) {
        var chatlayer = new ChatLayer();
        MjClient.Scene.addChild(chatlayer);
    }
};

// 初始化时钟节点
PlayLayer_doudizhuLF.prototype.initClockWget = function () {
    for (var off = 0; off < 4; off++) {
        var _node = getNode(off);
        var nodeClock = _node.getChildByName("clocknode");
        if (off == 0) {
            setWgtLayout(nodeClock, [0.052, 0], [0.50, 0.32], [0, 2.3]);
        } else if (off == 1) {
            setWgtLayout(nodeClock, [0.052, 0], [0.82, 0.65], [0, 0]);
        } else if (off == 2) {
            setWgtLayout(nodeClock, [0.052, 0], [0.50, 0.75], [0, 0]);
        } else if (off == 3) {
            setWgtLayout(nodeClock, [0.052, 0], [0.18, 0.65], [0, 0]);
        }
    }
}
PlayLayer_doudizhuLF.prototype.isPutCardLegitimate = function () {
    var pl = getUIPlayer(0);
    if (!pl) {
        return false;
    }
    var tData = MjClient.data.sData.tData;
    var lastPutCards = tData.lastPutCard;
    if (tData.lastPutPlayer == tData.curPlayer || tData.lastPutPlayer == -1) {
        lastPutCards = null;
    }
    var upSelectCards = this.handCardsWgetArr[0].getUpCardArr();
    var canPut = MjClient.majiang.checkPut(pl.mjhand, upSelectCards, lastPutCards, tData);
    if (!canPut) {
        if (JSON.stringify(this.upWrongSelectCard) != JSON.stringify(upSelectCards)) {
            this.upWrongSelectCard = upSelectCards;
            MjClient.playui.showWrongToast(true);
        }
    }
    return canPut;
}
PlayLayer_doudizhuLF.prototype.showWrongToast = function (bShow) {
    setWgtLayout(this._toastImg, [0.5, 0.50], [0.5, -0.1], [0, 0]);
    this._toastImg.stopAllActions();
    if (!bShow) {
        return;
    }
    this._toastImg.runAction(
        cc.sequence(
            cc.show(),
            cc.moveBy(0.5, 0, cc.director.getVisibleSize().height * 0.35),
            cc.delayTime(2.5),
            cc.hide(),
            cc.callFunc(function () {
                MjClient.playui.upWrongSelectCard = [];
            })
        )
    );
}

PlayLayer_doudizhuLF.prototype.isSDataValid = function () {
    var sData = MjClient.data.sData;
    var strSData = JSON.stringify(sData);
    var pattern = new RegExp("tData");
    var res = pattern.exec(strSData);
    if (res == null) {
        return false;
    }
    return true;
}
