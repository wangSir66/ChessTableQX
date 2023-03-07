// 大同扎股子

var actionZindex = 1000;
var PlayLayer_daTongZhaGuZi = cc.Layer.extend({
    ctor: function() {
        this._super();
        var playui = ccs.load("Play_zhaGuZiDaTong.json");
        MjClient.MaxPlayerNum = parseInt(MjClient.data.sData.tData.maxPlayer);
        playMusic("doudizhu/table_background_music");
        MjClient.playui = this;
        MjClient.sortClassType = 0; //必不可少，会影响到banner上花色的正确显示
        MjClient.playui.node = playui.node;


        MjClient.playui.initUI();
        MjClient.playui.hideAllUI();
        MjClient.playui.initData(false);
        MjClient.playui.initHeadWget();
        MjClient.playui.initClockWget();
        MjClient.playui.initClickEvent();
        MjClient.playui.initMsgEvent();
        MjClient.playui.initOnce();

        this.addChild(playui.node);
        //触摸事件监听注册
        cc.eventManager.addListener(cc.EventListener.create(this.handleCardsTouchListener()),this._downNode);
        MjClient.lastMJTick = Date.now();
        this.runAction(cc.repeatForever(cc.sequence(cc.callFunc(function() {
            if (MjClient.game_on_show){
                MjClient.tickGame(0);
            }
        }), cc.delayTime(7))));
        return true;
    },
    onEnterTransitionDidFinish : function() {
        this._super();
    },

    onExit:function() {
        this._super();
    },
});

// =========================[[ 判断 ]] =========================

PlayLayer_daTongZhaGuZi.prototype.isJD = function() {
    return (MjClient.data.sData.tData.areaSelectMode.type == "jingdian");
};
PlayLayer_daTongZhaGuZi.prototype.hideAllUI=function(){
    for(var off = 0;off < 5;off++){
        var node = getNode_cards(off);
        var ready = node.getChildByName("ready");
        var noPutTag = node.getChildByName("noPutTag");
        var jiaoZhuType = node.getChildByName('jiaZhuType')
        ready.visible = false;
        noPutTag.visible = false;
        jiaoZhuType.visible = false;
    }
    var BtnPutCard = this.node.getChildByName("BtnPutCard");
    var BtnHimt = this.node.getChildByName("BtnHimt");
    var BtnNoPut = this.node.getChildByName("BtnNoPut");
    var BtnReady = this.node.getChildByName("BtnReady");
    var noPutTips = this.node.getChildByName("noPutTips");
    var wait = this.node.getChildByName("wait");
    BtnPutCard.visible = false;
    BtnHimt.visible = false;
    BtnNoPut.visible = false;
    BtnReady.visible = false;
    noPutTips.visible = false;
    wait.visible = false;
}
PlayLayer_daTongZhaGuZi.prototype.isRoundEnd = function() {
    var tState = MjClient.data.sData.tData.tState;
    return tState == TableState.waitReady || tState == TableState.roundFinish || tState == TableState.waitJoin || tState == TableState.isReady;
}

// 检查出牌是否合法
PlayLayer_daTongZhaGuZi.prototype.isCanPutCards = function(putCards) {
    var tData = MjClient.data.sData.tData;
    if(!IsTurnToMe() || tData.tState != TableState.waitPut) { return false; }
    if (putCards == null) {
        putCards = this.handCardsWgetArr[0].getUpCardArr();
    }
    if (putCards.length == 0) { return false; }
    var pl = getUIPlayer(0);
    var isNotFirst = tData.lastPutPlayer != tData.curPlayer && tData.lastPutPlayer != -1;
    tData.lastPutCard = isNotFirst ? tData.lastPutCard : null;
    return MjClient.majiang.checkPut(pl.mjhand, putCards,tData.lastPutCard, tData);
};

// =========================[[ 出牌 ]] =========================

//出牌提示
PlayLayer_daTongZhaGuZi.prototype.showTipCards = function(){
    this.handCardsWgetArr[0].clearCardsUpStatus();
    var length = this.cardTipsArr.length;
    if(length <= 0) { return; }

    if(this.cardTipsArr[this.tipsIdx] == null) {
        this.tipsIdx = 0;
    }
    var tipsCardArray = this.cardTipsArr[this.tipsIdx].slice();
    this.handCardsWgetArr[0].liftCardUp(tipsCardArray);
    this.tipsIdx++;
    MjClient.playui.handlePutCardBtn(true,true);
}

// 处理斗地主智能提牌
PlayLayer_daTongZhaGuZi.prototype.handleDoudizhuCardsAutoUp = function(bTouchMove) {
    var tData = MjClient.data.sData.tData;
    if(!IsTurnToMe() || tData.tState != TableState.waitPut) { return; }
    var upSelectCards = this.handCardsWgetArr[0].getUpCardArr();
    if (upSelectCards.length == 0) { return; }
    if (!this.isValidAutoUpCards) { return; } // 智能提牌已经失效
    var pl = getUIPlayer(0);
    var data = {};
    if(tData.lastPutPlayer != tData.curPlayer && tData.lastPutPlayer != -1) {// 首出
        var lastPutType = MjClient.majiang.calType(tData.lastPutCard);
        if (lastPutType == MjClient.majiang.CARDTPYE.danpai) { return; } // 单牌不做自动提示
        data = MjClient.majiang.calAutoPutCards(bTouchMove, this.cardTipsArr, upSelectCards, tData);
    }
    if (!data.hasCardToUp) { return;}
    this.handCardsWgetArr[0].clearCardsUpStatus();
    this.handCardsWgetArr[0].liftCardUp(data.tSelectCards);
    this.isValidAutoUpCards = false;
};

PlayLayer_daTongZhaGuZi.prototype.handleCardsTouchListener = function() {
    return{
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        swallowTouches: false,                       // 设置是否吞没事件，在 onTouchBegan 方法返回 true 时吞没
        onTouchBegan: function (touch, event) {
            var pl = getUIPlayer(0);
            if (!pl ) return false;
            if(pl.mjState == TableState.roundFinish) { //已经完成
                return false;
            }
            var hands = MjClient.playui.handCardsWgetArr[0];
            if(hands.grayCardCannotOut(touch.getLocation()))
            {
                return false;
            }
            var flag = MjClient.playui.handleTouchCards(touch, event, true);
            if (!flag) {
                MjClient.playui.handCardsWgetArr[0].clearCardsUpStatus();
                MjClient.playui.isValidAutoUpCards = true;
                MjClient.playui.handlePutCardBtn(IsTurnToMe(), false);
            }
            return flag;
        },
        onTouchMoved: function (touch, event) {         // 触摸移动时触发
            var hands = MjClient.playui.handCardsWgetArr[0];
            if(hands.grayCardCannotOut(touch.getLocation()))
            {
                return false;
            }
            MjClient.playui.handleTouchCards(touch, event, false);
            MjClient.playui.handCardsWgetArr[0].handleTouchMoveOutOfRange(MjClient.playui.firstMouseIn, MjClient.playui.lastMouseIn);
        },
        onTouchEnded: function (touch, event) {         // 点击事件结束处理
            playEffectInPlay("clickCards");
            if(Math.abs(MjClient.playui.lastMouseIn - MjClient.playui.firstMouseIn + 1)>=2){
                MjClient.playui.bTouchMove = true;
            }
            MjClient.playui.handCardsWgetArr[0].updatePostionInMoveRange(MjClient.playui.firstMouseIn, MjClient.playui.lastMouseIn);
            MjClient.playui.handleDoudizhuCardsAutoUp(MjClient.playui.bTouchMove);
            MjClient.playui.handlePutCardBtn(IsTurnToMe(), MjClient.playui.isCanPutCards());
        }
    };
};

// 处理点击
PlayLayer_daTongZhaGuZi.prototype.handleTouchCards = function (touch, event, isBegan) {
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
PlayLayer_daTongZhaGuZi.prototype.handleUpRightCards = function(isFirst, off) {
    if (isFirst) { return; }
    var tData = MjClient.data.sData.tData;
    var upSelectCards = this.handCardsWgetArr[off].getUpCardArr();
    var lastPutType = MjClient.majiang.calType(tData.lastPutCard);
    var tCards = MjClient.majiang.findTheRightTouchMoveCards(upSelectCards, lastPutType, tData.lastPutCard);
    if (tCards != null) {
        this.handCardsWgetArr[off].clearCardsUpStatus();
        this.handCardsWgetArr[off].liftCardUp(tCards);
    }
}

// =========================[[ 流程 ]] =========================
// 断线重连/初始化
PlayLayer_daTongZhaGuZi.prototype.dealInitSceneData = function() {
    var tData = MjClient.data.sData.tData;
    var tState = tData.tState;
    cc.log("===dealInitSceneData==tData.tState==" + tData.tState);
    var isRoundEnd = MjClient.playui.isRoundEnd()
    for(var i = 0; i< this.headOffLen; i++){
        var off = this.headOffArr[i];
        MjClient.playui.handleNoPutTag(off, false);
        if (!isRoundEnd) { continue; }
        this.handCardsWgetArr[off].removeAllCards();
        this.deskCardsWgetArr[off].removeAllCards();
    }
    MjClient.playui.setTextMult(tState != TableState.waitJoin && tState != TableState.waitReady && tState != TableState.roundFinish);
    // 发牌、叫地主、发底牌、加注、等待出牌
    MjClient.playui.handleMjHand();
    MjClient.playui.dealJiazhu();
    for(var i = 0; i< this.headOffLen; i++) {
        var off = this.headOffArr[i];
        var pl = getUIPlayer(off);
        if(pl == null) continue;
    }
    if (tState != TableState.waitJiazhu && !isRoundEnd && tData.lastPutCard != null && tData.lastPutCard.length > 0) {
        if(tData.lastPutPlayer != -1)
        {
            var off = getOffByIndex(tData.lastPutPlayer);
            this.deskCardsWgetArr[off].addPutCards(tData.lastPutCard);
        }
    }
    MjClient.playui.dealWaitPut();
};

PlayLayer_daTongZhaGuZi.prototype.dealChangePKImg = function () {
    // MjClient.playui.handleDoudizhuDiCards();
    this.handCardsWgetArr[0].changPkImageBack(getCurrentPKImgType());
    for(var i=0; i<this.headOffLen; i++){
        var off = this.headOffArr[i];
        this.deskCardsWgetArr[off].changPkImageBack(getCurrentPKImgType());
    }
};

// 结算
PlayLayer_daTongZhaGuZi.prototype.dealRoundEnd=function (eD) {
    for(var i=0; i<this.headOffLen; i++){
        var off = this.headOffArr[i];
        this.headNode[off].updateUserInfo(getUIPlayer(off));
    }
    MjClient.clockNode.visible=false;
    var self = MjClient.playui.node;
    function delayExe(){
        var sData = MjClient.data.sData;
        var tData = sData.tData;
        MjClient.playui.initData(true);
        MjClient.playui.dealInitSceneData();
        MjClient.playui.dealHeadIcon();
        MjClient.playui.removePutAllDownRank();
        if (sData.tData.roundNum <= 0) {
            if(!tData.matchId){
                self.addChild(new GameOverLayer_zhaguzi(),500);
            }else{
                self.runAction(cc.sequence(cc.delayTime(3),cc.callFunc(function(){
                    self.addChild(new GameOverLayer_zhaguzi(),500);
                })))
            }
        }
        self.addChild(new EndOneView_zhaGuZiDaTong(),500);
    }
    var time = MjClient.data.sData.tData.roundNum <= 0 ? 0.2 : 1;
    this.runAction(cc.sequence(cc.DelayTime(time),cc.callFunc(delayExe)));
    MjClient.playui.killTimeClock();
};

// 过、准备
PlayLayer_daTongZhaGuZi.prototype.dealPKPass=function (eD) {
    var off = getUiOffByUid(eD.uid);
    if (eD.activePass == null || eD.activePass == -1) {
        MjClient.playui.handleAboutReady(off); // 准备
    } else { // 过牌
        MjClient.playui.handleNoPutTag(off, true);
        MjClient.playui.handleNoPutTips(false);
    }
}
// 出牌
PlayLayer_daTongZhaGuZi.prototype.dealPKPut = function(msg) {
    var tData = MjClient.data.sData.tData;
    tData.rate = msg.rate;
    MjClient.playui.setTextMult(true);
    //时钟停止计时
    if (msg.uid == SelfUid()) {
        MjClient.playui.startTimeClock();
    }
    //隐藏出牌按钮
    MjClient.playui.handleHimtAndNoPutBtn(false);
    MjClient.playui.handlePutCardBtn(false);
    if (msg.autoSend || msg.uid != SelfUid() || MjClient.rePlayVideo != -1) {
        var index = tData.uids.indexOf(msg.uid);
        var off=getOffByIndex(index);
        var node = getNode_cards(off);
        MjClient.playui.dealPKPutcard(off, msg);
    }
    var jiaZhuUid = msg.jiaZhuId;
    var off = getOffByIndex(tData.curPlayer);
    var pl = getUIPlayer(off);
    if(!pl) return;
    this.headNode[off].seticonJiaZhuType(jiaZhuUid,false);
}
PlayLayer_daTongZhaGuZi.prototype.removePutAllDownRank = function () {
    for(var i = 0;i < 5; i++)
    {
        var node = getNode_cards(i);
        var imageRank = node.getChildByName('rank');
        if(imageRank)
        {
            imageRank.visible = false;
        }
    }
}
PlayLayer_daTongZhaGuZi.prototype.showPutAllDown = function (off) {
    var pl = getUIPlayer(off);
    var tData = MjClient.data.sData.tData;
    if(tData.tState != TableState.waitPut)
    {
        PlayLayer_daTongZhaGuZi.prototype.removePutAllDownRank();
        return;
    }
    var tourList = tData.tourList;
    var uid = pl.info.uid;
    var rank = tourList.indexOf(uid);
    var node = getNode_cards(off);
    var image = node.getChildByName('rank');
    if(rank != -1)
    {
        image.visible = true;
        image.ignoreContentAdaptWithSize(true);
        image.loadTexture("gameOver_zhaGuZi/"+rank+".png");
        var arr = [[0.5,0.35],[0.78,0.4],[0.67, 0.6],[0.32, 0.6],[0.18, 0.4]];
        setWgtLayout(image, [0.07, 0.07],arr[off],[0,0]);
    }
    else {
        image.visible = false;
    }
}
// 等待出牌
PlayLayer_daTongZhaGuZi.prototype.dealWaitPut = function (eD) {
    var tData = MjClient.data.sData.tData;
    if (tData.tState != TableState.waitPut) {
        MjClient.playui.handleNoPutTips(false);
        MjClient.playui.handleHimtAndNoPutBtn(false);
        MjClient.playui.handlePutCardBtn(false);
        return;
    }
    var func = function(){
        for(var i = 0; i < MjClient.playui.headOffLen; i++) {
            var off = MjClient.playui.headOffArr[i];
            MjClient.playui.dealJiaZhuTypeText(off, false);
            MjClient.playui.deskCardsWgetArr[off].removeShowCardOf3();
        }
    };
    this.node.runAction(cc.sequence(cc.delayTime(1),cc.callFunc(func)))

    this.isValidAutoUpCards = true;
    MjClient.playui.startTimeClock(MjClient.playui.clockNumberUpdate);
    var off = getOffByIndex(tData.curPlayer);
    this.deskCardsWgetArr[off].removeAllCards();
    var isMe = off == 0;
    var isNotFirst = tData.lastPutPlayer != tData.curPlayer && tData.lastPutPlayer != -1;
    this.cardTipsArr = [];
    if(isMe && isNotFirst){
        var pl = getUIPlayer(0);
        this.cardTipsArr = MjClient.majiang.getTipCardsArr(pl.mjhand, tData.lastPutCard, tData.isShowFuCard);
        this.tipsIdx = 0;
    }
    MjClient.playui.handleNoPutTips(isMe && isNotFirst && this.cardTipsArr.length == 0);
    MjClient.playui.handleHimtAndNoPutBtn(isMe, isNotFirst);
    MjClient.playui.handleNoPutTag(off, false);

    MjClient.playui.handleUpRightCards(!isNotFirst, off);
    MjClient.playui.handlePutCardBtn(isMe, MjClient.playui.isCanPutCards());
    this.isCardsSend = false;

    for(var i = 0; i < MjClient.playui.headOffLen; i++) {
        var off = MjClient.playui.headOffArr[i];
        this.showPutAllDown(off);
    }
};

// 等待准备
PlayLayer_daTongZhaGuZi.prototype.dealAllReady=function () {
    for(var i=0; i<this.headOffLen; i++){
        var off = this.headOffArr[i];
        MjClient.playui.handleAboutReady(off);
    }
};

PlayLayer_daTongZhaGuZi.prototype.dealWaitJiazhu=function (eD) {
    var tData = MjClient.data.sData.tData;
    tData.zhuang = eD.zhuang;
    var pl = getUIPlayer(0);
    if(MjClient.playui.isJD() || tData.tState!=TableState.waitJiazhu || tData.zhuang==-1 || pl.jiazhuNum!= 0) { return; }

    MjClient.playui.setHLJiabeiVisible(true);
}

// 处理手牌
PlayLayer_daTongZhaGuZi.prototype.handleMjHand = function() {
    MjClient.playui.showGps();
    MjClient.playui.handleNoPutTips(false);
    MjClient.playui.dealAllReady();
    MjClient.playui.updateGameRound();
    var isRoundEnd = MjClient.playui.isRoundEnd();
    for(var i = 0; i < this.headOffLen; i++) {
        var off = this.headOffArr[i];
        MjClient.playui.dealJiaZhuTypeText(off,false);
        var pl = getUIPlayer(off);
        MjClient.playui.initUserHandUiDoudizhu(off);
        this.headNode[off].seticonJiaZhuType(-1,isRoundEnd);
    }
    MjClient.playui.dealHeadIcon();
}


// =========================[[ 小控件 ]] ========================

PlayLayer_daTongZhaGuZi.prototype.updateUserHeadPosition=function(off, bRoundEnd) {
    var node = this.headParentNode[off];
    if (off == 0) {
        if (bRoundEnd) {
            setWgtLayout(node, [0.43, 0.43], [0.5, 0.1], [0, 0]);
        } else if (isIPhoneX()) {
            setWgtLayout(node, [0.43, 0.43], [0.05, 0.1], [0, 0]);
        } else {
            setWgtLayout(node, [0.43, 0.43], [0.05, 0.1], [0, 0]);
        }
    } else if (off == 1) {
        if (bRoundEnd) {
            setWgtLayout(node, [0.43, 0.43], [0.75, 0.38], [0, 0]);
        } else {
            setWgtLayout(node, [0.43, 0.43], [0.95, 0.45], [0, 0]);
        }
    } else if (off == 2) {
        if (bRoundEnd) {
            setWgtLayout(node, [0.43, 0.43], [0.65, 0.58], [0, 0]);
        }
        else if (isIPhoneX()) {
            setWgtLayout(node, [0.43, 0.43], [0.77, 0.815], [0, 0]);
        } else {
            setWgtLayout(node, [0.43, 0.43], [0.77, 0.815], [0, 0]);
        }
    } else if (off == 3) {
        if (bRoundEnd) {
            setWgtLayout(node, [0.43, 0.43], [0.35, 0.58], [0, 0]);
        }
        else if (isIPhoneX()) {
            setWgtLayout(node, [0.43, 0.43], [0.23, 0.815], [0, 0]);
        } else {
            setWgtLayout(node, [0.43, 0.43], [0.23, 0.815], [0, 0]);
        }
    }else if (off == 4) {
        if (bRoundEnd) {
            setWgtLayout(node, [0.43, 0.43], [0.25, 0.38], [0, 0]);
        }
        else if (isIPhoneX()) {
            setWgtLayout(node, [0.43, 0.43], [0.05, 0.45], [0, 0]);
        } else {
            setWgtLayout(node, [0.43, 0.43], [0.05, 0.45], [0, 0]);
        }
    }
};

PlayLayer_daTongZhaGuZi.prototype.updateTimes = function(){
    var times = this._banner.getChildByName("bg_time");
    var text = new ccui.Text();
    text.setFontName("fonts/lanting.TTF");
    text.setFontSize(26);

    text.setAnchorPoint(1,0.5);
    text.setPosition(66, 15);
    times.addChild(text);
    text.schedule(function(){

        var time = MjClient.getCurrentTime();
        var str = (time[3]<10?"0"+time[3]:time[3])+":"+
            (time[4]<10?"0"+time[4]:time[4]);
        this.setString(str);
    });
};

//设置地区信息
PlayLayer_daTongZhaGuZi.prototype.showGameName = function() {
    var gameName = this.node.getChildByName("gameName");
    setWgtLayout(gameName,[0.25, 0.25], [0.5, 0.35], [0, 0]);
    var text = GameBg[MjClient.gameType];
    gameName.loadTexture(text);
}
//添加还背景的功能
PlayLayer_daTongZhaGuZi.prototype.addChangeBg = function(){
    var btnChange = ccui.Button("playing/gameTable/btn_changeBg_normal.png","playing/gameTable/btn_changeBg_press.png");
    var btnSetting = this._banner.getChildByName("setting");
    btnSetting.setPositionY(84.15);

    btnChange.setPosition(btnSetting.x-60,84.15);
    btnChange.setScale(btnSetting.getScale());
    this._banner.addChild(btnChange);
    btnChange.addTouchEventListener(function(sender,type){
        if(type == 2){
            setCurrentGameBgTypeToNext();
            postEvent("changeGameBgEvent");
            MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Pifu", {uid:SelfUid(),gameType:MjClient.gameType});
        }
    },this);
};

PlayLayer_daTongZhaGuZi.prototype.showVoice = function() {
    var voice_btn = this.node.getChildByName("voice_btn");
    initVoiceData();
    voice_btn.addTouchEventListener(function(sender, type) {
        if (type == 0) {
            startRecord();
        } else if (type == 2) {
            endRecord();
        } else if (type == 3) {
            cancelRecord();
        }
    });
    if (MjClient.MaxPlayerNum > 2) {
        setWgtLayout(voice_btn, [0.09, 0.09], [0.95, 0.3], [0, 0]);
    } else {
        setWgtLayout(voice_btn, [0.09, 0.09], [0.95, 0.2], [0, 1.2]);
    }
};

PlayLayer_daTongZhaGuZi.prototype.addClubYaoqingBtn = function() {
    var wxinviteBtn = this._wait.getChildByName("wxinvite");
    wxinviteBtn.visible = !MjClient.remoteCfg.guestLogin;
    var getRoomNumBtn = this._wait.getChildByName("getRoomNum");
    getRoomNumBtn.visible = !MjClient.remoteCfg.guestLogin;
    setWgtLayout(getRoomNumBtn, [0.18, 0.18],[0.81, 0.08],[0, 0]);
    setWgtLayout(wxinviteBtn, [0.18, 0.18],[0.81, 0.22],[0, 0]);

    if (!getClubInfoInTable() || MjClient.remoteCfg.guestLogin) {
        return;
    }

    var clubYaoqingBtn = this._wait.getChildByName("clubYaoqingBtn");
    if (clubYaoqingBtn == null) {
        clubYaoqingBtn = new ccui.Button();
        clubYaoqingBtn.setName("clubYaoqingBtn");
        this._wait.addChild(clubYaoqingBtn);
    }
    clubYaoqingBtn.loadTextureNormal("friendCards/yaoqing/btn_yaoqing_n.png");
    clubYaoqingBtn.loadTexturePressed("friendCards/yaoqing/btn_yaoqing_s.png");
    clubYaoqingBtn.setVisible(false);

    clubYaoqingBtn.runAction(cc.repeatForever(cc.callFunc(function() {
        clubYaoqingBtn.setVisible(!MjClient.remoteCfg.guestLogin);
    })));
    clubYaoqingBtn.addTouchEventListener(function(sender, Type) {
        switch (Type) {
            case ccui.Widget.TOUCH_ENDED:
                var tData = MjClient.data.sData.tData;
                var clubInfoTable = getClubInfoInTable();
                MjClient.Scene.addChild(new FriendCard_yaoqingMember(clubInfoTable.clubId, tData.tableid, unescape(clubInfoTable.clubTitle)));
                MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Yaoqingpaiyou", {uid:SelfUid(), gameType:MjClient.gameType});

                break;
            default:
                break;
        }
    }, this);
    // 在微信邀请下方
    clubYaoqingBtn.setScale(wxinviteBtn.width * wxinviteBtn.scaleX / clubYaoqingBtn.width);
    clubYaoqingBtn.x = wxinviteBtn.x;
    clubYaoqingBtn.y = wxinviteBtn.y - wxinviteBtn.height * wxinviteBtn.scaleY * 1.1;
    if (getRoomNumBtn && Math.abs(getRoomNumBtn.x - wxinviteBtn.x) < 20 && getRoomNumBtn.y < wxinviteBtn.y) {
        getRoomNumBtn.y = clubYaoqingBtn.y - getRoomNumBtn.height * getRoomNumBtn.scaleY * 1.1;
        var y = getRoomNumBtn.y - getRoomNumBtn.height * getRoomNumBtn.scaleY / 2;
        if (y < 5) {
            getRoomNumBtn.y += 5 - y;
            clubYaoqingBtn.y += 5 - y;
            wxinviteBtn.y += 5 - y;
        }
    }
};

PlayLayer_daTongZhaGuZi.prototype.showTableID = function(bShow) {
    var textTableId = this._info_banner.getChildByName("tableid");
    textTableId.ignoreContentAdaptWithSize(true);
    textTableId.setString(MjClient.data.sData.tData.tableid);
}

PlayLayer_daTongZhaGuZi.prototype.setHLJiabeiVisible = function(bVisible) {
    var btnJiaBei = this.node.getChildByName("BtnJiabei");
    var btnBuJiaBei = this.node.getChildByName("Btnbujiabei");
    btnJiaBei.visible = bVisible;
    btnBuJiaBei.visible = bVisible;
    if (!bVisible) { return; }
    var d= isIPhoneX() ? 0.02 : 0;
    setWgtLayout(btnJiaBei,[0.14, 0.14], [0.6, 0.42+d], [0, 0]);
    setWgtLayout(btnBuJiaBei,[0.14, 0.14], [0.4, 0.42+d], [0, 0]);
}

// 出牌按钮
PlayLayer_daTongZhaGuZi.prototype.handlePutCardBtn = function (isVisible, isAble) {
    var btnPutCard   = this.node.getChildByName("BtnPutCard");
    if(MjClient.rePlayVideo != -1)
    {
        btnPutCard.visible = false;
        return;
    }
    var tData = MjClient.data.sData.tData;
    isVisible = tData.tState == TableState.waitPut && isVisible;
    btnPutCard.visible = isVisible;
    if (!isVisible) { return; }
    var d= isIPhoneX() ? 0.02 : 0;
    setWgtLayout(btnPutCard,[0.135, 0.128], [0.65, 0.39+d], [0, 0]);
    btnPutCard.setBright(isAble);
    btnPutCard.setTouchEnabled(isAble);
};

//操作按钮(提示和不出) 
PlayLayer_daTongZhaGuZi.prototype.handleHimtAndNoPutBtn = function(isVisible, isAble) {
    var btnHimt      = this.node.getChildByName("BtnHimt");
    var btnNoPut     = this.node.getChildByName("BtnNoPut");
    if(MjClient.rePlayVideo != -1)
    {
        btnNoPut.visible = false;
        btnHimt.visible = false;
        return;
    }

    btnNoPut.visible = isVisible;
    btnHimt.visible = isVisible;
    if (!isVisible) { return; }
    var d= isIPhoneX() ? 0.02 : 0;
    setWgtLayout(btnHimt,[0.135, 0.128], [0.5, 0.38+d], [0, 0]);
    setWgtLayout(btnNoPut,[0.135, 0.128], [0.35, 0.38+d], [0, 0]);
    btnNoPut.setBright(isAble);
    btnNoPut.setTouchEnabled(isAble);
    btnHimt.setBright(isAble);
    btnHimt.setTouchEnabled(isAble);
};


// 牌局信息
PlayLayer_daTongZhaGuZi.prototype.showRoundInfo = function() {
    var nodeRoundInfo = this.node.getChildByName("round_info_node");
    var textRoundInfo = nodeRoundInfo.getChildByName("roundInfo");
    var tData = MjClient.data.sData.tData;
    var str = getPlaySelectPara(MjClient.gameType,tData.areaSelectMode);
    if (str.charAt(str.length - 1) == ",") {
        str = str.substring(0, str.length - 1);
    }
    textRoundInfo.setString(str);
    textRoundInfo.ignoreContentAdaptWithSize(true);
    setWgtLayout(nodeRoundInfo, [0.13, 0.13], [0.5, 0.25], [0, 0]);
};

// 局数
PlayLayer_daTongZhaGuZi.prototype.updateGameRound= function() {
    var roundNum = this._info_banner.getChildByName("roundNum");
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    roundNum.setString((tData.roundAll-tData.roundNum + 1)+"/"+tData.roundAll + "局");
    roundNum.ignoreContentAdaptWithSize(true);
}

// 加倍
PlayLayer_daTongZhaGuZi.prototype.setTextMult = function(bShow) {
    var textMult = this._info_banner.getChildByName("Text_mult");
    textMult.ignoreContentAdaptWithSize(true);
    var str = bShow && MjClient.data.sData.tData.totalJiaZhu > 0? MjClient.data.sData.tData.totalJiaZhu + "" : "";
    textMult.setString(str);
};

// 底分
PlayLayer_daTongZhaGuZi.prototype.handleDifen = function() {
    var textDifen = this._banner.getChildByName("Text_difen");
    var tData = MjClient.data.sData.tData;
    var difen = tData.areaSelectMode.difen;
    textDifen.setString(difen);
    textDifen.ignoreContentAdaptWithSize(true);
}

// 亮三、扎股
PlayLayer_daTongZhaGuZi.prototype.dealJiaZhuTypeText = function(off, visible) {
    var node = getNode_cards(off);
    var jiaZhuTag = node.getChildByName("jiaZhuType");
    jiaZhuTag.visible = visible;
    if (!visible) { return;}
    var pl = getUIPlayer(off);
    var uid = pl.info.uid;
    var jiaZhuData = MjClient.data.sData.tData.jiaZhuData;
    var card = jiaZhuData[uid].liang;
    jiaZhuTag.setScale(MjClient.size.width/1280);
    jiaZhuTag.ignoreContentAdaptWithSize(true);
    if (off == 0) {
        if(isIPhoneX())
        {
            setWgtLayout(jiaZhuTag,[0.08, 0.08],[0.5, 0.4],[0, 0]);
        }
        if(MjClient.rePlayVideo != -1)
        {
            setWgtLayout(jiaZhuTag,[0.08, 0.08],[0.5, 0.35],[0, 0])
        }
        else {
            if(card.length !=0) setWgtLayout(jiaZhuTag,[0.08, 0.08],[0.5, 0.5],[0, 0]);
            else  setWgtLayout(jiaZhuTag,[0.08, 0.08],[0.5, 0.35],[0, 0]);
        }
    } else if (off == 1) {
        if(MjClient.rePlayVideo != -1)
        {
            setWgtLayout(jiaZhuTag,[0.08, 0.08],[0.82, 0.45],[0, 0]);
        }
        else {
            if(card.length !=0) setWgtLayout(jiaZhuTag,[0.08, 0.08],[0.79, 0.55],[0, 0]);
            else setWgtLayout(jiaZhuTag,[0.08, 0.08],[0.82, 0.45],[0, 0]);
        }
    } else if (off == 2) {
        if(MjClient.rePlayVideo != -1)
        {
            setWgtLayout(jiaZhuTag,[0.08, 0.08],[0.7, 0.68],[0, 0]);
        }
        else {
            if(card.length !=0) setWgtLayout(jiaZhuTag,[0.08, 0.08],[0.67, 0.75],[0, 0]);
            else setWgtLayout(jiaZhuTag,[0.08, 0.08],[0.7, 0.68],[0, 0]);
        }
    } else if (off == 3) {
        if(MjClient.rePlayVideo != -1)
        {
            setWgtLayout(jiaZhuTag,[0.08, 0.08],[0.3, 0.68],[0, 0]);
        }
        else {
            if(card.length !=0) setWgtLayout(jiaZhuTag,[0.08, 0.08],[0.33, 0.75],[0, 0]);
            else setWgtLayout(jiaZhuTag,[0.08, 0.08],[0.3, 0.68],[0, 0]);
        }
    } else if (off == 4) {
        if(MjClient.rePlayVideo != -1)
        {
            setWgtLayout(jiaZhuTag,[0.08, 0.08],[0.18, 0.45],[0, 0]);
        }
        else {
            if(card.length !=0) setWgtLayout(jiaZhuTag,[0.08, 0.08],[0.18, 0.55],[0, 0]);
            else setWgtLayout(jiaZhuTag,[0.08, 0.08],[0.18, 0.45],[0, 0]);
        }
    } else {
        cc.log("============增加 off=" + off + " 的逻辑======");
    }

    var tData = MjClient.data.sData.tData;
    var jiaZhuData = tData.jiaZhuData;
    if(!jiaZhuData)
    {
        jiaZhuTag.visible = false;
        return;
    }
    var pl = getUIPlayer(off);
    if(!pl) return;
    var uid = pl.info.uid;
    if(jiaZhuData[uid].jiaZhuId == 1) {
        jiaZhuTag.loadTexture("playing/zhaGuZi/zhagu.png");
    } else if(jiaZhuData[uid].jiaZhuId == 2){
        jiaZhuTag.loadTexture("playing/zhaGuZi/liangsan.png");
    } else {
        jiaZhuTag.visible = false;
    }
}

// 要不起
PlayLayer_daTongZhaGuZi.prototype.handleNoPutTag = function(off, visible) {
    var node = getNode_cards(off);
    var noPut = node.getChildByName("noPutTag");
    noPut.visible = visible;
    noPut.setScale(MjClient.size.width/1280);
    if (off == 0) {
        if(MjClient.rePlayVideo !=-1)
        {
            setWgtLayout(noPut,[0.082, 0],[0.5, 0.3],[0, 1]);
        }
        else {
            setWgtLayout(noPut,[0.082, 0],[0.5, 0.3],[0, 1]);
        }

    } else if (off == 1) {
        if(MjClient.rePlayVideo !=-1)
        {
            setWgtLayout(noPut,[0.082, 0],[0.73, 0.38],[0, 0.5]);
        }
        else {
            setWgtLayout(noPut,[0.082, 0],[0.83, 0.38],[0, 0.5]);
        }
    } else if (off == 2) {
        if(MjClient.rePlayVideo !=-1)
        {
            setWgtLayout(noPut,[0.082, 0],[0.68, 0.5],[0, 0.5]);
        }
        else {
            setWgtLayout(noPut,[0.082, 0],[0.68, 0.65],[0, 0.5]);
        }
    } else if (off == 3) {
        if(MjClient.rePlayVideo !=-1)
        {
            setWgtLayout(noPut,[0.082, 0],[0.29, 0.5],[0, 0.5]);
        }
        else {
            setWgtLayout(noPut,[0.082, 0],[0.29, 0.65],[0, 0.5]);
        }
    } else if (off == 4) {
        if(MjClient.rePlayVideo !=-1)
        {
            setWgtLayout(noPut,[0.082, 0],[0.25, 0.38],[0, 0.5]);
        }
        else {
            setWgtLayout(noPut,[0.082, 0],[0.2, 0.38],[0, 0.5]);
        }
    } else {
        cc.log("============增加 off=" + off + " 的逻辑======");
    }
}

// 没有大过上家
PlayLayer_daTongZhaGuZi.prototype.handleNoPutTips = function(isVisible) {
    var noPutTips    = this.node.getChildByName("noPutTips");
    noPutTips.visible = isVisible;
    if (!isVisible) { return; }

    setWgtLayout(noPutTips,[0.39, 0], [0.5, 0.04], [0, 0]);
};

// =========================[[ 系统 ]] ==========================
PlayLayer_daTongZhaGuZi.prototype.dealSendVoice = function(fullFilePath) {
    if (!fullFilePath) {
        console.log("sendVoice No fileName");
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
}

PlayLayer_daTongZhaGuZi.prototype.dealDownAndPlayVoice = function(msg) {
    MjClient.native.HelloOC("downloadPlayVoice ok");
    MjClient.data._tempMessage = msg;
    MjClient.native.HelloOC("mas is" + JSON.stringify(msg));
    downAndPlayVoice(msg.uid, msg.msg);
}

PlayLayer_daTongZhaGuZi.prototype.dealUploadRecord = function(filePath) {
    if (filePath) {
        MjClient.native.HelloOC("upload voice file");
        MjClient.native.UploadFile(filePath, MjClient.remoteCfg.voiceUrl, "sendVoice");
    } else {
        MjClient.native.HelloOC("No voice file update");
    }
};

// =========================[[ 界面 ]] ==========================

// 绘制手牌
PlayLayer_daTongZhaGuZi.prototype.initUserHandUiDoudizhu = function(off) {
    var pl = getUIPlayer(off);
    if (pl == null) { return; }
    var tData = MjClient.data.sData.tData;
    var node = getNode_cards(off);
    if( tData.tState != TableState.waitPut &&
        tData.tState != TableState.waitEat &&
        tData.tState != TableState.waitCard &&
        tData.tState != TableState.waitJiazhu){
        return;
    }
    this.handCardsWgetArr[off].initHandCards();
};

//处理出牌,打牌动作
PlayLayer_daTongZhaGuZi.prototype.dealPKPutcard = function(off, msg) {
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    if(off == 0 || MjClient.rePlayVideo != -1) { // 自己视角或回放
        this.handCardsWgetArr[off].removeHandCardByValueArr(msg.card);
    }
    this.deskCardsWgetArr[off].addPutCards(msg.card);
    if (!msg || !msg.noPlayEffect) {
        playCardAni(msg.card,off);
    }
    var pl = getUIPlayer(off);
    if (pl == null) { return; }
    if(off !=0)
    {
        this.headNode[off].showCurrentLeftCardCount(pl);
    }
    if(pl.handCount == 1) {
        playEffectInPlay("singer");
    } else if(pl.handCount == 2){
        playEffectInPlay("double");
    }
};

// 处理准备字准备相关
PlayLayer_daTongZhaGuZi.prototype.handleAboutReady=function(off) {
    var isFull = !IsInviteVisible();
    var pl = getUIPlayer(off);
    if(off < 0){ return; }
    var tData = MjClient.data.sData.tData;
    var isShowText = isFull && pl.mjState == TableState.isReady && tData.tState != TableState.waitJoin;

    if (off == 0) {
        this._wait.visible = !isFull;
        var btnReady= MjClient.playui.node.getChildByName("BtnReady");
        var isShow = isFull && pl.mjState == TableState.waitReady;
        btnReady.visible = isShow;
        if (isShow) {
            setWgtLayout(btnReady,[0.2, 0.2], [0.5, 0.37], [0, 0]);
        }
    }

    var imgReady=getNode_cards(off).getChildByName("ready");
    imgReady.visible = isShowText;
    if (!isShowText) { return; }
    var d = -0.4;
    if(isIPhoneX())
    {
        d = 0.4;
    }
    var arr = [[0, -5+d],[4.7, -2],[3.3, 1.5],[-3.3, 1.5],[-4.7, -2]];
    setWgtLayout(imgReady, [0.07, 0.07],[0.5, 0.5],arr[off]);
};

PlayLayer_daTongZhaGuZi.prototype.startTimeClock = function(func) {
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
    if(tData.tState == TableState.waitPut && off ==0) {
        MjClient.clockNode.setPosition(this.clockNodePosX,this.clockNodePosY+10);
    }
    if(func!= undefined && func != null){
        func(number);
    }
}

PlayLayer_daTongZhaGuZi.prototype.killTimeClock = function(){
    MjClient.clockNode.getChildByName("number").stopAllActions();
    stopEffect(playTimeUpEff);
    playTimeUpEff = null;
};

PlayLayer_daTongZhaGuZi.prototype.clockNumberUpdate = function(node, endFunc) {
    return arrowbkNumberUpdate(node, endFunc);
}

PlayLayer_daTongZhaGuZi.prototype.checkRoomUiDelete = function()
{
    if(MjClient.rePlayVideo != -1) return; //回放的时候，不弹解散窗口

    var sData = MjClient.data.sData;
    if(sData.tData.delEnd != 0 && !MjClient.delroomui){
        MjClient.Scene.addChild(new RemoveRoomView());
        if (MjClient.webViewLayer != null){
            MjClient.webViewLayer.close();
        }
    } else if(sData.tData.delEnd == 0 && MjClient.delroomui) {
        MjClient.delroomui.removeFromParent(true);
        delete MjClient.delroomui;
    }
    if(MjClient.gemewaitingui){
        MjClient.gemewaitingui.removeFromParent(true);
        delete MjClient.gemewaitingui;
    }
    if(cc.sys.isObjectValid(MjClient.playerChatLayer)){
        MjClient.playerChatLayer.removeFromParent(true);
        delete MjClient.playerChatLayer;
    }
}

PlayLayer_daTongZhaGuZi.prototype.showGps = function() {
    if(MjClient.endoneui != null){
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
};


PlayLayer_daTongZhaGuZi.prototype.dealMJTick = function (eD) {
    for(var i=0; i<this.headOffLen; i++) {
        var off = this.headOffArr[i];
        var pl = getUIPlayer(off);
        this.headNode[off].setUserOffline(pl);
    }
}

PlayLayer_daTongZhaGuZi.prototype.dealLogout= function() {
    if (MjClient.playui) {
        MjClient.addHomeView();
        MjClient.playui.removeFromParent(true);
        delete MjClient.playui;
        delete MjClient.endoneui;
        delete MjClient.endallui;
    }
}

PlayLayer_daTongZhaGuZi.prototype.dealEndRoom= function(msg) {
    mylog(JSON.stringify(msg));
    if (msg.showEnd) {
        this.addChild(new GameOverLayer_zhaguzi(),500);
    } else {
        MjClient.Scene.addChild(new StopRoomView());
    }
}

PlayLayer_daTongZhaGuZi.prototype.dealLeaveGame = function(){
    MjClient.playui.killTimeClock();
    MjClient.addHomeView();
    MjClient.playui.removeFromParent(true);
    delete MjClient.playui;
    delete MjClient.endoneui;
    delete MjClient.endallui;
    cc.audioEngine.stopAllEffects();
    playMusic("bgMain");
}

PlayLayer_daTongZhaGuZi.prototype.dealLoadWxHead=function (eD) {
    for(var i=0; i<this.headOffLen; i++) {
        var off = this.headOffArr[i];
        if(eD.uid == getUIHeadByOff(off).uid) {
            this.headNode[off].setWxHead(eD.img);
        }
    }
}

PlayLayer_daTongZhaGuZi.prototype.dealPlayVoice=function (msg) {
    for(var i = 0; i < this.headOffLen; i++){
        var off = this.headOffArr[i];
        this.headNode[off].showUserChat(off,msg);
    }
}

PlayLayer_daTongZhaGuZi.prototype.dealChangeGameBgEvent = function() {
    var back = MjClient.playui.node.getChildByName("back");
    var back2 = back.getChildByName("back");
    setWgtLayout(back2,[1, 1], [0.5, 0.5], [0, 0],true);
    changeGameBg(back2);
    // back2.loadTexture("playing/zhaGuZi/bg.png")
};

// 1 add 2 remove 3 online
PlayLayer_daTongZhaGuZi.prototype.handlePlayerChange = function (action) {
    for(var i=0; i<this.headOffLen; i++) {
        var off = this.headOffArr[i];
        MjClient.playui.handleAboutReady(off);
        var isRemove = action==2;
        var node = getNode_cards(off);
        var pl = getUIPlayer(off);
        if(isRemove)
        {
            if(!pl){
                this.headNode[off].showHead(null);
            }
            else {
                {
                    this.headNode[off].showHead(pl);
                }
            }
        }
        if (!isRemove) {
            this.headNode[off].updateUserInfo(pl);
        }
    }
}

PlayLayer_daTongZhaGuZi.prototype.dealMoveHead=function () {
    for(var i=0; i<this.headOffLen; i++) {
        var off = this.headOffArr[i];
        var node = this.headParentNode[off];
        var srcPos = cc.p(node.x,node.y);
        MjClient.playui.updateUserHeadPosition(off,false);
        var nodePos = cc.p(node.x,node.y)
        node.setPosition(srcPos);
        node.runAction(cc.moveTo(0.3, nodePos).easing(cc.easeCubicActionOut()));
    }
    sendGPS();
    MjClient.checkChangeLocationApp();
    postEvent("returnPlayerLayer");
}
PlayLayer_daTongZhaGuZi.prototype.sendPutCardsToServer = function(){
    if (this.isCardsSend) {
        return;
    };
    var outCardArr = this.handCardsWgetArr[0].getUpCardArr();
    if(outCardArr.length <=0) return;
    if (!MjClient.playui.isCanPutCards(outCardArr)) { // 出牌不合法
        return;
    }
    MjClient.gamenet.request("pkroom.handler.tableMsg", {
        cmd: "PKPut",
        card: outCardArr,
        tingAfterPut: false
    });
    this.isCardsSend = true;
    MjClient.playui.dealPKPutcard(0, {card:outCardArr}); // 提前出牌
};
// 准备-1， 提示过牌0， 不出 1
PlayLayer_daTongZhaGuZi.prototype.sendPassToServer = function (isActivePass) {
    this.handCardsWgetArr[0].clearCardsUpStatus();
    MjClient.gamenet.request("pkroom.handler.tableMsg", {cmd: "PKPass", activePass:isActivePass} );
}

// =========================[[ 初始化 ]] ==========================
PlayLayer_daTongZhaGuZi.prototype.initData = function(isRoundEnd){
    this.btnTagList = {
        BtnPutCard:1,BtnHimt:2,BtnNoPut:3,BtnJiaZhu:4,BtnMeiHua:5,BtnReady:6,BtnRenShu:7,
        setting:9,back_btn:10,Button_1:11,wxinvite:12,getRoomNum:13,backHomebtn:14,
        delroom:15,gps_btn:16,chat_btn:17,Btncluinvite:18
    };
    this.cardTipsArr = [];
    this.tipsIdx = 0;
    this.isCardsSend = false; // 判断是否已经出牌
    this.isValidAutoUpCards = true; // 斗地主提牌
    this.lastMouseIn = 0; //触碰中当前最后的一张牌
    this.firstMouseIn = 0;
    this.bTouchMove = false; //是否滑动出牌
    this.isDealInitScene = true; // 防止重启，会刷两遍 dealInitSceneData()
    MjClient.playui.updateGameRound();
    var tData = MjClient.data.sData.tData;
    if(!isRoundEnd) {return;}
    for(var i=0; i<this.headOffLen; i++) {
        var off = this.headOffArr[i];
        var pl = getUIPlayer(off);
        pl.handCount = 0;
        pl.jiazhuNum = 0;
    }
}

PlayLayer_daTongZhaGuZi.prototype.initOnce = function() {
    MjClient.playui.showRoundInfo();
    MjClient.playui.showVoice();
    MjClient.playui.dealChangeGameBgEvent();
    MjClient.playui.addChangeBg();
    MjClient.playui.addClubYaoqingBtn();
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

PlayLayer_daTongZhaGuZi.prototype.initUI = function () {
    this._downNode  = this.node.getChildByName("down");
    this._rightNode = this.node.getChildByName("right");
    this._topNode   = this.node.getChildByName("top");
    this._leftNode  = this.node.getChildByName("left");
    this._fifthNode  = this.node.getChildByName("fifth");
    this._AniNode =  this.node.getChildByName("eat");
    this._banner= this.node.getChildByName("banner");
    this._info_banner=this.node.getChildByName('info_banner')
    this._wait = this.node.getChildByName("wait");
    this._jiazhuWait = this.node.getChildByName("jiazhuWait");

    var wifi = this._banner.getChildByName("wifi");
    updateWifiState(wifi);
    var powerBar = this._banner.getChildByName("powerBar");
    updateBattery(powerBar);
    var Button_1 = this._banner.getChildByName("Button_1");
    Button_1.visible = true;
    MjClient.clockNode = this.node.getChildByName("clock");
    setWgtLayout(MjClient.clockNode,[0.135, 0.128], [0.5, 0.5], [0, 0]);
    MjClient.clockNode.visible = false;
    this.clockNodePosX = MjClient.clockNode.getPositionX();
    this.clockNodePosY = MjClient.clockNode.getPositionY();
    MjClient.clockNode.setScale(0.4);
    var delroom = this._wait.getChildByName("delroom");
    delroom.visible = IsRoomCreator();
    var backHomebtn = this._wait.getChildByName("backHomebtn");
    backHomebtn.visible = true;
    var isHaveGPS = MjClient.MaxPlayerNum > 2;
    var gps_btn = this.node.getChildByName("gps_btn");
    gps_btn.setVisible(isHaveGPS);
    var positionCard = this.node.getChildByName("positionCard");
    positionCard.visible = false;
    var btnChat = this.node.getChildByName("chat_btn");
    if (isHaveGPS) {
        setWgtLayout(btnChat, [0.09, 0.09], [0.95, 0.2], [0, 0]);
    } else {
        setWgtLayout(btnChat, [0.09, 0.09], [0.95, 0.1], [0, 3.8]);
    }

    setWgtLayout(delroom, [0.11, 0.11],[0.05, 0.45],[0, 0]);
    setWgtLayout(backHomebtn, [0.11, 0.11],[0.05, 0.6],[0, 0]);
    setWgtLayout(gps_btn, [0.09, 0.09], [0.95, 0.1], [0, 0]);
    setWgtLayout(this._banner,[0.23, 0.23], [0.87, 0.85], [0, 0]);
    setWgtLayout(this._info_banner,[0.23, 0.23], [0.03, 0.75], [0, 0]);

};

// 初始化节点
PlayLayer_daTongZhaGuZi.prototype.initHeadWget = function () {
    this.headOffArr = [];
    this.headNode={};
    this.AniMotion=[];
    this.handCardsWgetArr = {}
    this.deskCardsWgetArr = {}
    this.headParentNode = {}
    this.headOffLen = MjClient.MaxPlayerNum;
    for(var off = 0; off < 5; off++){
        var _node=getNode_cards(off);
        var nodeStand=_node.getChildByName("stand_node");
        var nodeDeskCard =_node.getChildByName("deskCard");

        var head_node =_node.getChildByName("head");
        this.headParentNode[off] = head_node;

        this.headOffArr.push(off);
        this.headNode[off] = new PokerHeadNode_daTongZhaGuZi(off);

        head_node.addChild(this.headNode[off].node);
        this.headNode[off].node.setPosition(cc.p(64,41.5));
        this.headNode[off].node.setScale(0.3);
        this.handCardsWgetArr[off] = new PokerCardNode_zhaGuZi(off);
        nodeStand.addChild(this.handCardsWgetArr[off].node);
        this.deskCardsWgetArr[off] = new PokerCardNode_zhaGuZi(off);
        nodeDeskCard.addChild(this.deskCardsWgetArr[off].node);

        var play_tips=_node.getChildByName("play_tips");// 无用UI
        play_tips.visible = false;

        if (off == 0) {
            setWgtLayout(nodeStand, [0.065,0], [0.5, 0.19], [0, 0]);
            if(isIPhoneX()){
                setWgtLayout(nodeStand, [0.055,0], [0.5, 0.19], [0, 0]);
            }
            if(MjClient.rePlayVideo != -1)
            {
                setWgtLayout(nodeDeskCard,[0.052, 0],[0.5, 0.06],[0, 2.2]);
            }
            else {
                setWgtLayout(nodeDeskCard,[0.052, 0],[0.5, 0.06],[0, 2.7]);
            }
        } else if (off == 1) {
            setWgtLayout(nodeStand, [0, 0.09], [0.8, 0.55], [0, 0]);
            if(MjClient.rePlayVideo != -1)
            {
                setWgtLayout(nodeDeskCard,[0.052, 0],[0.75, 0.4],[0, 0]);
            }
           else {
                setWgtLayout(nodeDeskCard,[0.052, 0],[0.85, 0.48],[0, 0]);
            }
        } else if (off == 2) {
            setWgtLayout(nodeStand, [0, 0.09], [0.65, 0.7], [0, 0]);
            if(MjClient.rePlayVideo != -1)
            {
                setWgtLayout(nodeDeskCard,[0.052, 0],[0.69, 0.58],[0, 0]);
            }
            else {
                setWgtLayout(nodeDeskCard,[0.052, 0],[0.69, 0.68],[0, 0]);
            }
        }else if (off == 3) {
            setWgtLayout(nodeStand, [0, 0.09], [0.25, 0.7], [0, 0]);
            if(MjClient.rePlayVideo != -1)
            {
                setWgtLayout(nodeDeskCard,[0.052, 0],[0.35, 0.58],[0, 0]);
            }
            else {
                setWgtLayout(nodeDeskCard,[0.052, 0],[0.35, 0.68],[0, 0]);
            }
        }else if (off == 4) {
            setWgtLayout(nodeStand, [0, 0.09], [0.2, 0.5], [0, 0]);
            if(MjClient.rePlayVideo != -1)
            {
                setWgtLayout(nodeDeskCard,[0.052, 0],[0.3, 0.4],[0, 0]);
            }
            else {
                setWgtLayout(nodeDeskCard,[0.052, 0],[0.2, 0.48],[0, 0]);
            }
        }
        var tData = MjClient.data.sData.tData;
        var roundNum = tData.roundAll - tData.roundNum + 1;
        var isRoundEnd = MjClient.playui.isRoundEnd()&&(roundNum <= 1);
        MjClient.playui.updateUserHeadPosition(off, isRoundEnd);
    }
}

//初始化玩家信息
PlayLayer_daTongZhaGuZi.prototype.initMsgEvent=function() {
    // ================ 重连 =========================
    UIEventBind(null, this.node,"initSceneData",function (eD) {
        MjClient.playui.handlePlayerChange(3);
        MjClient.playui.checkRoomUiDelete();
        MjClient.playui.dealInitSceneData();
    });
    // ================ 游戏流程 =========================
    UIEventBind(null,this.node,"waitReady",function (eD) {
        MjClient.playui.dealAllReady();
    });
    UIEventBind(null,this.node,"mjhand",function (eD) {
        MjClient.playui.handleMjHand();
    });
    UIEventBind(null,this.node,"waitJiaodizhu",function (eD) {
        MjClient.playui.dealWaitJiaodizhu(eD);
    });
    UIEventBind(null,this.node,"Qiangdizhu",function (eD) {
        MjClient.playui.dealQiangDizhu(eD);
    });
    UIEventBind(null,this.node,"diCards",function (eD) {
        MjClient.playui.dealDiCards(eD.zhuang, eD.diCards, eD.handCounts, true, true);
    });
    UIEventBind(null,this.node,"waitJiazhu",function (eD) {
        MjClient.playui.dealWaitJiazhu(eD);
    });
    UIEventBind(null,this.node,"MJJiazhu",function (eD) {
        var off = getUiOffByUid(eD.uid);
        MjClient.playui.dealMJJiazhu(false, off, eD.jiazhuNum, eD.curPlayer);
    });
    UIEventBind(null,this.node,"waitPut",function (eD) {
        var tData = MjClient.data.sData.tData;
        tData.lastPutCard = eD.lastPutCard;
        MjClient.playui.dealWaitPut(eD);
    });
    UIEventBind(null,this.node,"PKPut",function (eD) {
        MjClient.playui.dealPKPut(eD);
    });
    UIEventBind(null,this.node,"PKPass",function (eD) {
        MjClient.playui.dealPKPass(eD);
    });
    UIEventBind(null,this.node,"roundEnd",function (eD) {
        MjClient.playui.dealRoundEnd(eD);
    });
    // ================ 房间事件 =========================
    UIEventBind(null,this.node,"LeaveGame",function (eD) {
        MjClient.playui.dealLeaveGame();
    });
    UIEventBind(null,this.node,"DelRoom",function (eD) {
        MjClient.playui.checkRoomUiDelete();
    });
    UIEventBind(null,this.node,"endRoom",function (eD) {
        MjClient.playui.dealEndRoom(eD);
    });
    UIEventBind(null,this.node,"logout",function (eD) {
        MjClient.playui.dealLogout();
    });
    UIEventBind(null,this.node,"addPlayer",function (eD) {
        MjClient.playui.handlePlayerChange(1);
    });
    UIEventBind(null,this.node,"removePlayer",function (eD) {
        MjClient.playui.handlePlayerChange(2);
    });
    UIEventBind(null,this.node,"onlinePlayer",function (eD) {
        MjClient.playui.handlePlayerChange(3);
    });
    // ================ 界面 =============================
    UIEventBind(null,this.node,"returnPlayerLayer",function (eD) {
        MjClient.playui.visible = true;
    });
    UIEventBind(null,this.node,"changeGameBgEvent",function (eD) {
        MjClient.playui.dealChangeGameBgEvent();
    });
    UIEventBind(null, this.node, "loadWxHead", function (eD) {
        MjClient.playui.dealLoadWxHead(eD);
    });
    UIEventBind(null,this.node,"changePKImgEvent",function (eD) {
        MjClient.playui.dealChangePKImg();
    });
    // UIEventBind(null,this.node,"clearCardUI",function (eD) {
    //     MjClient.playui.dealClearCardUI();
    // });
    UIEventBind(null, this.node, "moveHead", function (eD) {
        MjClient.playui.dealMoveHead();
    });
    // ================ 系统 =============================
    UIEventBind(null,this.node,"cancelRecord",function (eD) {
        MjClient.native.HelloOC("cancelRecord !!!");
    });
    UIEventBind(null,this.node,"uploadRecord",function (eD) {
        MjClient.playui.dealUploadRecord(eD);
    });
    UIEventBind(null,this.node,"sendVoice",function (eD) {
        MjClient.playui.dealSendVoice(eD);
    });
    UIEventBind(null,this.node,"downAndPlayVoice",function (eD) {
        MjClient.playui.dealDownAndPlayVoice(eD);
    });
    UIEventBind(null,this.node,"nativePower",function (eD) {
        MjClient.playui._banner.getChildByName("powerBar").setPercent(Number(d));
    });
    UIEventBind(null,this.node,"playVoice",function (eD) {
        MjClient.data._tempMessage.msg = eD;
        MjClient.playui.dealPlayVoice(MjClient.data._tempMessage);
    });
    UIEventBind(null,this.node,"MJChat",function (eD) {
        MjClient.playui.dealPlayVoice(eD);
    });
    UIEventBind(null,this.node,"playerStatusChange",function (eD) {
        MjClient.playui.dealMJTick(eD);
    });
    UIEventBind(null,this.node,"s2cZhaGuZiJiaZhu",function (eD) {
        MjClient.playui.dealEventOfJiaZhu(eD);
    });
};
PlayLayer_daTongZhaGuZi.prototype.dealEventOfJiaZhu = function(eD) {
    MjClient.playui.dealJiazhu(eD);
    MjClient.playui.dealHeadIcon(eD);
    MjClient.playui.startTimeClock(MjClient.playui.clockNumberUpdate);
    MjClient.playui.setTextMult(true);
};
PlayLayer_daTongZhaGuZi.prototype.initClickEvent = function() {
    var btnCallback = function(sender,type) {
        if(type == ccui.Widget.TOUCH_ENDED) {
            MjClient.playui.btnEventListener(sender,type);
        }
    }
    var btnList1 = ["BtnPutCard", "BtnHimt", "BtnNoPut","BtnJiaZhu","BtnMeiHua","BtnRenShu",
        "BtnReady","gps_btn","chat_btn"];
    for (var i = 0; i < btnList1.length; i++) {
        MjClient.playui.btnBindCallBack(this.node, btnList1[i], MjClient.playui.btnTagList[btnList1[i]], btnCallback);
    }

    var btnList2 = ["setting", "Button_1"];
    for (var i = 0; i < btnList2.length; i++) {
        MjClient.playui.btnBindCallBack(this._banner, btnList2[i], MjClient.playui.btnTagList[btnList2[i]], btnCallback);
    }

    var btnList3 = ["wxinvite", "getRoomNum", "backHomebtn", "delroom"];
    for (var i = 0; i < btnList3.length; i++) {
        MjClient.playui.btnBindCallBack(this._wait, btnList3[i], MjClient.playui.btnTagList[btnList3[i]], btnCallback);
    }
};

PlayLayer_daTongZhaGuZi.prototype.btnBindCallBack=function(parent, str, tag, callback){
    var tmpNode = parent.getChildByName(str);
    tmpNode.tag = tag;
    tmpNode.addTouchEventListener(callback);
};

PlayLayer_daTongZhaGuZi.prototype.btnEventListener = function(sender,type) {
    var tag = sender.getTag();
    if(tag == MjClient.playui.btnTagList.BtnPutCard) { // 出牌
        playEffectInPlay("playingCards");
        MjClient.playui.sendPutCardsToServer();
    }
    else if(tag == MjClient.playui.btnTagList.BtnHimt) { // 提示
        playEffect("guandan/tishi");
        cc.log('this.cardTipsArrthis.cardTipsArr:'+JSON.stringify(this.cardTipsArr))
        if(this.cardTipsArr.length == 0) { // 没有提示，过牌
            MjClient.playui.sendPassToServer(0);
            return;
        }
        MjClient.playui.showTipCards();
    }
    else if(tag == MjClient.playui.btnTagList.BtnNoPut) { // 不出
        playEffectInPlay("clickCards");
        MjClient.playui.sendPassToServer(1);
    }
    else if(tag == MjClient.playui.btnTagList.BtnReady){
        MjClient.playui.sendPassToServer(-1);
        MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Zhunbei", {uid: SelfUid(), gameType:MjClient.gameType});
    }
    else if(tag == MjClient.playui.btnTagList.BtnJiaZhu ){ // 亮3或扎股
        playEffectInPlay("playingCards");
        var jiaZhuType = MjClient.data.sData.tData.canJiaZhuType;
        MjClient.playui.sendJiaZhuToServer(jiaZhuType);
    }
    else if(tag == MjClient.playui.btnTagList.BtnMeiHua ){
        playEffectInPlay("playingCards");
        MjClient.playui.sendJiaZhuToServer(-1);
    } else if(tag == MjClient.playui.btnTagList.BtnRenShu ){
        playEffectInPlay("playingCards");
        MjClient.playui.sendRenShuToServer();
    }else if(tag == MjClient.playui.btnTagList.setting) {
        var settringLayer = new SettingViewCard();
        settringLayer.setName("PlayLayerClick");
        MjClient.Scene.addChild(settringLayer);
        MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Shezhi", {uid:SelfUid(),gameType:MjClient.gameType});
    }
    else if(tag == MjClient.playui.btnTagList.back_btn) {
        MjClient.showMsg("是否解散房间？", function () {
            MjClient.delRoom(true);
        }, function(){}, 1);
    } else if(tag == MjClient.playui.btnTagList.Button_1)
    {
        MjClient.openWeb({url:MjClient.GAME_TYPE.PAO_DE_KUAI,help:true});
    } else if(tag == MjClient.playui.btnTagList.wxinvite || tag == MjClient.playui.btnTagList.getRoomNum) {
        var num = tag == MjClient.playui.btnTagList.getRoomNum ? 1 : 2;
        getPlayingRoomInfo(num);
        if(num == 1){
            MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Fuzhifangjianxinxi", {uid:SelfUid(), gameType:MjClient.gameType});
        }else {
            MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Yaoqingweixinhaoyou", {uid:SelfUid(), gameType:MjClient.gameType});
        }
    }
    else if(tag == MjClient.playui.btnTagList.backHomebtn) {
        showTipsAndLeaveGame();
    } else if(MjClient.playui.btnTagList.delroom == tag) {
        MjClient.delRoom(true);
    }
    else if(tag == MjClient.playui.btnTagList.gps_btn) {
        if (MjClient.MaxPlayerNum == 5) {
            MjClient.Scene.addChild(new showDistance3PlayerLayer(5));
        }
    } else if(tag == MjClient.playui.btnTagList.chat_btn) {
        var chatlayer = new ChatLayer();
        MjClient.Scene.addChild(chatlayer);
    }
    else if(tag == MjClient.playui.btnTagList.Btncluinvite) {
        var tData = MjClient.data.sData.tData;
        var clubInfoTable = getClubInfoInTable();
        MjClient.Scene.addChild(new FriendCard_yaoqingMember(clubInfoTable.clubId, tData.tableid, unescape(clubInfoTable.clubTitle)));
        MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Yaoqingpaiyou", {uid:SelfUid(), gameType:MjClient.gameType});
    }
};

// 初始化时钟节点-
PlayLayer_daTongZhaGuZi.prototype.initClockWget = function () {
    for(var off = 0; off < 5; off++){
        var _node=getNode_cards(off);
        var nodeClock=_node.getChildByName("clocknode");
        if (off == 0) {
            if(isIPhoneX()){
                setWgtLayout(nodeClock,[0.052, 0],[0.50, 0.24],[0, 3.3]);
            }else {
                setWgtLayout(nodeClock,[0.052, 0],[0.50, 0.32],[0, 3.3]);
            }
        } else if (off == 1) {
            if(MjClient.rePlayVideo != -1)
            {
                setWgtLayout(nodeClock,[0.052, 0],[0.75, 0.4],[0, 0]);
            }
            else {
                setWgtLayout(nodeClock,[0.052, 0],[0.82, 0.45],[0, 0]);
            }
        } else if (off == 2) {
            if(MjClient.rePlayVideo != -1)
            {
                setWgtLayout(nodeClock,[0.052, 0],[0.7, 0.52],[0, 0]);
            }
            else {
                setWgtLayout(nodeClock,[0.052, 0],[0.75, 0.65],[0, 0]);
            }
        }else if (off == 3) {
            if(MjClient.rePlayVideo != -1)
            {
                setWgtLayout(nodeClock,[0.052, 0],[0.32, 0.52],[0, 0]);
            }
            else {
                setWgtLayout(nodeClock,[0.052, 0],[0.28, 0.65],[0, 0]);
            }
        }else if (off == 4) {
            if(MjClient.rePlayVideo != -1)
            {
                setWgtLayout(nodeClock,[0.052, 0],[0.25, 0.4],[0, 0]);
            }
            else {
                setWgtLayout(nodeClock,[0.052, 0],[0.15, 0.45],[0, 0]);
            }
        }
    }
};

//-------------------------大同扎股子--------------------------
PlayLayer_daTongZhaGuZi.prototype.dealJiazhu = function(msg) {
    var tData = MjClient.data.sData.tData;
    var needShow = tData.tState == TableState.waitJiazhu ? true : false;
    var jiaZhuData = tData.jiaZhuData;
    for(var i = 0; i<this.headOffLen; i++)
    {
        var off = this.headOffArr[i];
        var pl = getUIPlayer(off);
        if(!pl) continue;
        var uid = pl.info.uid;
        MjClient.playui.dealJiaZhuTypeText(off, needShow);
        if(jiaZhuData && needShow)
        {
            var type = jiaZhuData[uid].liang;
            this.deskCardsWgetArr[off].addPutCards(type,true);
        }
    }
    MjClient.playui.dealJiaZhuBtn();
    this.handCardsWgetArr[0].cannotOutLiangSanGray(tData.tState == TableState.waitJiazhu && IsTurnToMe());
};
PlayLayer_daTongZhaGuZi.prototype.dealHeadIcon = function() { //头像icon处理
    var tData = MjClient.data.sData.tData;
    var jiaZhuData = tData.jiaZhuData;
    var isRoundEnd = MjClient.playui.isRoundEnd();
    for(var i = 0; i < this.headOffLen; i++) {
        var off = this.headOffArr[i];
        var pl = getUIPlayer(off);
        if(!pl) continue;
        if(tData.tState == TableState.waitPut ||tData.tState == TableState.waitJiazhu ||tData.tState == TableState.roundFinish)
        {
            if(tData.tState == TableState.waitPut)
            {
                pl.handCount = pl.handCount == null ? 10 : pl.handCount;
            }
            else {
                pl.handCount = 10;
            }
            this.headNode[off].showCurrentLeftCardCount(off != 0 ? pl : null );
        }
        var uid = pl.info.uid;
        if(jiaZhuData)
        {
            var type = jiaZhuData[uid].jiaZhuId;
            this.headNode[off].seticonJiaZhuType(type,isRoundEnd);
        }
        this.headNode[off].showFlowerOf3Panel(pl,isRoundEnd);
    }
};
PlayLayer_daTongZhaGuZi.prototype.dealJiaZhuBtn = function() {
    var tData = MjClient.data.sData.tData;
    var jiaZhuType = tData.canJiaZhuType;
    var jiaZhuBtn    = this.node.getChildByName("BtnJiaZhu");
    var meiHuaBtn    = this.node.getChildByName("BtnMeiHua");
    var renShuBtn    = this.node.getChildByName("BtnRenShu");

    var index = tData.uids.indexOf(SelfUid())
    if(index != tData.curPlayer ||tData.tState != TableState.waitJiazhu || MjClient.rePlayVideo != -1)
    {
        jiaZhuBtn.visible = false;
        meiHuaBtn.visible = false;
        renShuBtn.visible = false;
        return;
    }
    jiaZhuBtn.visible = true;
    meiHuaBtn.visible = true;
    renShuBtn.visible = tData.canTouXiang ? true : false;
    if(jiaZhuType == 1) //扎股按钮
    {
        jiaZhuBtn.loadTextureNormal("playing/zhaGuZi/zhagu_s.png");
    }
    else {//亮3
        jiaZhuBtn.loadTextureNormal("playing/zhaGuZi/liangsan_s.png");
    }
    var d= isIPhoneX() ? 0.02 : 0;
    setWgtLayout(jiaZhuBtn,[0.135, 0.128], [0.5, 0.42+d], [0, 0]);
    setWgtLayout(meiHuaBtn,[0.135, 0.128], [0.33, 0.42+d], [0, 0]);
    setWgtLayout(renShuBtn,[0.135, 0.128], [0.67, 0.43+d], [0, 0]);
};
PlayLayer_daTongZhaGuZi.prototype.sendJiaZhuToServer = function(type) {
    if (type > -1) {
        var outCardArr = this.handCardsWgetArr[0].getUpCardArr();
        var pl = getUIPlayer(0)
        if (type == 2) {
            var status = MjClient.majiang.getLiangSanIegitimateStatus(pl.mjhand, outCardArr);
            if (status <  0) {
                if (status == -1) {
                    MjClient.showToast("需要亮红三");
                }else if (status == -2) {
                    MjClient.showToast("有方块三需要亮方块三");
                } else {
                    MjClient.showToast("请提起要亮的三");
                }
                return;
            }
        }

        if (outCardArr.length > 0) {
            var langColor = MjClient.majiang.getColorForLiang(outCardArr);
            if (langColor == null) {
                MjClient.showToast("包含的不是3");
                return;
            }
        }
    }
    MjClient.gamenet.request("pkroom.handler.tableMsg", {
        cmd: "c2sZhaGuZiJiaZhu",
        isJiaZhu: type > -1,
        cards: outCardArr
    });
    if (type == 2 && MjClient.majiang.isShowFuCardForJiaZhu(outCardArr)) {
        var tData = MjClient.data.sData.tData;
        tData.isShowFuCard = true;
        this.handCardsWgetArr[0].cardLayoutRestoreForPlay();
    }
    this.handCardsWgetArr[0].clearCardsUpStatus();
    this.node.getChildByName("BtnJiaZhu").visible = false;
    this.node.getChildByName("BtnMeiHua").visible = false;
    this.node.getChildByName("BtnRenShu").visible = false;
    this.handCardsWgetArr[0].cannotOutLiangSanGray(false);
};
PlayLayer_daTongZhaGuZi.prototype.sendRenShuToServer = function() {
    var func = function() {
        MjClient.gamenet.request("pkroom.handler.tableMsg", {
            cmd: "c2sZhaGuZiTouXiang",
            isTouXiang: true
        });

        MjClient.playui.node.getChildByName("BtnJiaZhu").visible = false;
        MjClient.playui.node.getChildByName("BtnMeiHua").visible = false;
        MjClient.playui.node.getChildByName("BtnRenShu").visible = false;
        MjClient.playui.handCardsWgetArr[0].cannotOutLiangSanGray(false);
    }
    MjClient.showMsg("你确定要认输吗？", function() {
        func([], true);
    }, function() {}, "1");
};

