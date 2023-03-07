// 阮江千分
var actionZindex = 1000;
var PlayLayer_ruanjiangqianfen = cc.Layer.extend({
    ctor: function() {
        this._super();
        var playui = ccs.load("Play_ruanjiangqianfen.json");
        MjClient.MaxPlayerNum = parseInt(MjClient.data.sData.tData.maxPlayer);
        playMusic("bgMain");
        MjClient.playui = this;
        MjClient.sortClassType = 0; //必不可少，会影响到banner上花色的正确显示
        MjClient.playui.node = playui.node;
        MjClient.playui.putCardType = 1;//  出牌方式 1 滑动出牌 2 提示出牌

        MjClient.playui.initUI();
        MjClient.playui.initTagList();
        MjClient.playui.hideAllUI();
        MjClient.playui.initHeadWget();
        var tState = MjClient.data.sData.tData.tState;
        MjClient.playui.initData(tState == TableState.roundFinish?true:false);
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

PlayLayer_ruanjiangqianfen.prototype.InitC_Data = function() {
    if (!MjClient.data.c_Data)
        MjClient.data.c_Data = {};
    //出牌是否动画
    MjClient.data.c_Data.bPutCardAnim =  MjClient.data.sData.tData.areaSelectMode.playSpeed != 0;
    //是发采用老的牌型动画
    MjClient.data.c_Data.bPutCardAnimOld = MjClient.data.sData.tData.areaSelectMode.playSpeed == 0;
    //牌型动画是否是文字图片
    MjClient.data.c_Data.bTxtAnim = MjClient.data.sData.tData.areaSelectMode.playSpeed == 0;
}

// =========================[[ 判断 ]] =========================

PlayLayer_ruanjiangqianfen.prototype.isRoundEnd = function() {
    var tState = MjClient.data.sData.tData.tState;
    return tState == TableState.waitReady || tState == TableState.roundFinish || tState == TableState.waitJoin || tState == TableState.isReady;
}

// 检查出牌是否合法
PlayLayer_ruanjiangqianfen.prototype.isCanPutCards = function(putCards) {
    var tData = MjClient.data.sData.tData;
    if(!IsTurnToMe() || tData.tState != TableState.waitPut) { return false; }
    if (putCards == null) {
        putCards = this.handCardsWgetArr[0].getUpCardArr();
    }
    if (putCards.length == 0) { return false; }
    var pl = getUIPlayer(0);
    var isNotFirst = tData.lastPutPlayer != tData.curPlayer && tData.lastPutPlayer != -1;
    var lastPutCards = isNotFirst ? tData.lastPutCard : null;
    return MjClient.majiang.checkPut(pl.mjhand, putCards, lastPutCards, tData) != null;
};

// =========================[[ 出牌 ]] =========================

//出牌提示
PlayLayer_ruanjiangqianfen.prototype.showTipCards = function(){
    this.handCardsWgetArr[0].clearCardsUpStatus();
    var length = this.cardTipsArr.length;
    if(length <= 0) { return; }

    if(this.cardTipsArr[this.tipsIdx] == null) {
        this.tipsIdx = 0;
    }
    var tipsCardArray = this.cardTipsArr[this.tipsIdx].slice();
    this.handCardsWgetArr[0].liftCardUp(tipsCardArray);
    this.tipsIdx++;
    MjClient.playui.putCardType = 2;
    MjClient.playui.handlePutCardBtn(true,true);
}

PlayLayer_ruanjiangqianfen.prototype.handleCardsTouchListener = function() {
    return{
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        swallowTouches: false,                       // 设置是否吞没事件，在 onTouchBegan 方法返回 true 时吞没
        onTouchBegan: function (touch, event) {
            var pl = getUIPlayer(0);
            if (!pl ) return false;
            if(pl.mjState == TableState.roundFinish) { //已经完成
                return false;
            }
            if(MjClient.playui.isCardsSend) {
                return false;
            }
            var flag = MjClient.playui.handleTouchCards(touch, event, true);
            if(!flag) {
                MjClient.playui.handCardsWgetArr[0].clearCardsUpStatus();
                MjClient.playui.handlePutCardBtn(IsTurnToMe(), false);
            }
            return true;
        },
        onTouchMoved: function (touch, event) {
            MjClient.playui.handleTouchCards(touch, event, false);
        },
        onTouchEnded: function (touch, event) {         // 点击事件结束处理
            playEffectInPlay("clickCards");
            MjClient.playui.handCardsWgetArr[0].handleCardsWithinMoveRange();
            MjClient.playui.handlePutCardBtn(IsTurnToMe(), MjClient.playui.isCanPutCards());
        }
    };
};

// 处理点击
PlayLayer_ruanjiangqianfen.prototype.handleTouchCards = function (touch, event, isBegan) {
    return MjClient.playui.handCardsWgetArr[0].dealTouchCards(touch.getLocation(), isBegan);
};
// =========================[[ 流程 ]] =========================
// 断线重连/初始化
PlayLayer_ruanjiangqianfen.prototype.dealInitSceneData = function() {
    var tData = MjClient.data.sData.tData;
    var tState = tData.tState;
    MjClient.playui.isSendCard = 0;
    MjClient.playui.InitC_Data();
    MjClient.playui.initData(tState == TableState.roundFinish?true:false);
    var isRoundEnd = MjClient.playui.isRoundEnd()
    for(var i = 0; i< this.headOffLen; i++){
        var off = this.headOffArr[i];
        MjClient.playui.handleNoPutTag(off, false);
        this.handCardsWgetArr[off].removeAllCards();
        this.deskCardsWgetArr[off].removeAllCards();

        var pl = getUIPlayer(off);
        if(pl) {
            var uid = pl.info.uid;
            if (tData.totalFenData) {
                this.headNode[off].updateScores(tData.totalFenData[uid],tData.zhuaFenData[uid],tData.xiFenData[uid],tData.totalXiFenData[uid]);
            }

            this.headNode[off].tuoguan.visible = pl.trust;
            if (off == 0) this.block_tuoguan.visible = pl.trust;
        }
        MjClient.playui.handleRank(off,false);
    }
    MjClient.playui.dealAfterReady();
    // 发牌、叫地主、发底牌、加注、等待出牌
    MjClient.playui.handleMjHand();
    if (!isRoundEnd && tData.lastPutCard != null && tData.lastPutCard.length > 0) {
        var off = getOffByIndex(tData.lastPutPlayer);
        this.deskCardsWgetArr[off].addPutCards(tData.lastPutCard);
    }
    MjClient.playui.dealWaitPut();
    if(isRoundEnd) {
        MjClient.playui.updateFenPaiData({});
    } else {
        if(tData.fenPaiData) {
            MjClient.playui.updateFenPaiData(tData.fenPaiData);
        }
    }
    MjClient.playui.handleDiCards(tData.isShowDiCards);
};

PlayLayer_ruanjiangqianfen.prototype.dealChangePKImg = function () {
    var tData = MjClient.data.sData.tData;
    MjClient.playui.handleDiCards(tData.isShowDiCards);
    this.handCardsWgetArr[0].changPkImageBack(getCurrentPKImgType());
    for(var i=0; i<this.headOffLen; i++){
        var off = this.headOffArr[i];
        this.deskCardsWgetArr[off].changPkImageBack(getCurrentPKImgType());
    }
};

// 结算
PlayLayer_ruanjiangqianfen.prototype.dealRoundEnd=function (eD) {
    var self = MjClient.playui.node;
    var endInfo = JSON.parse(JSON.stringify(MjClient.data.sData.tData));
    function delayExe(){
        var sData = MjClient.data.sData;
        var tData = sData.tData;
        if(tData.tState && tData.tState !=TableState.roundFinish){
            return;
        }
        MjClient.playui.initData(true);
        MjClient.playui.dealInitSceneData();
        if (sData.tData.roundNum <= 0) {
            if(!tData.matchId){
                self.addChild(new GameOverLayer_ruanjiangqianfen(),500);
            }else{
                self.runAction(cc.sequence(cc.delayTime(3),cc.callFunc(function(){
                    self.addChild(new GameOverLayer_ruanjiangqianfen(),500);
                })))
            }
        }
        self.addChild(new EndOneView_ruanJiangQianFenYueYang(endInfo),500);
    }
    var time = 0.2;//MjClient.data.sData.tData.roundNum <= 0 ? 0.2 : 1;
    this.runAction(cc.sequence(cc.delayTime(time),cc.callFunc(delayExe)));

    for(var i = 0; i< this.headOffLen; i++){
        var tmpoff = this.headOffArr[i];
        this.headNode[tmpoff].countDownBg.visible = false;
    }
};

// 过、准备
PlayLayer_ruanjiangqianfen.prototype.dealPKPass=function (eD) {
    var off = getUiOffByUid(eD.uid);
    MjClient.playui.handleNoPutTag(off, true);
    this.deskCardsWgetArr[off].removeAllCards();
    MjClient.playui.removeHeadEffect();
}
// 出牌
PlayLayer_ruanjiangqianfen.prototype.dealPKPut = function(msg) {
    var tData = MjClient.data.sData.tData;
    tData.rate = msg.rate;
    //隐藏出牌按钮
    MjClient.playui.handleHimtBtn(false);
    MjClient.playui.handlePutCardBtn(false);
    var index = tData.uids.indexOf(msg.uid);
    var off=getOffByIndex(index);
    if (msg.autoSend || msg.uid != SelfUid() || MjClient.rePlayVideo != -1) {
        MjClient.playui.dealPKPutcard(off, msg);
    }
    if(msg.uid == SelfUid() && MjClient.rePlayVideo == -1) { //正常打牌会出现少牌的情况，这里做验证，回放不用验证
        var pl = getUIPlayer(0);
        if(this.handCardsWgetArr[0].countCards() != pl.handCount) {
            this.handCardsWgetArr[0].initHandCards();
        }
    }
    MjClient.playui.removeHeadEffect();
    if(msg&&msg.xiFenData) {
        for(var i = 0; i< this.headOffLen; i++){
            var tmpoff = this.headOffArr[i];
            var pl = getUIPlayer(tmpoff);
            var uid = pl.info.uid;
            this.headNode[tmpoff].updateXiFen(msg.xiFenData[uid]);
        }
    }

    for(var i = 0; i< this.headOffLen; i++){
        var tmpoff = this.headOffArr[i];
        this.headNode[tmpoff].countDownBg.visible = false;
    }
}

// 等待出牌
PlayLayer_ruanjiangqianfen.prototype.dealWaitPut = function (eD) {
    var tData = MjClient.data.sData.tData;
    if (tData.tState != TableState.waitPut) {
        MjClient.playui.handleHimtBtn(false);
        MjClient.playui.handlePutCardBtn(false);
        return;
    }
    MjClient.playui.showHeadEffect();
    var off = getOffByIndex(tData.curPlayer);

    var isMe = off == 0;
    var isNotFirst = tData.lastPutPlayer != tData.curPlayer && tData.lastPutPlayer != -1;
    if(isNotFirst) {
        this.deskCardsWgetArr[off].removeAllCards();
    } else {
        for(var i = 0; i < this.headOffLen; i++) {
            var tmpoff = this.headOffArr[i];
            this.deskCardsWgetArr[tmpoff].removeAllCards();
            MjClient.playui.handleNoPutTag(tmpoff, false);
        }
    }
    this.cardTipsArr = [];
    if(isMe){
        var pl = getUIPlayer(0);
        if(!isNotFirst) {
            this.cardTipsArr = MjClient.majiang.getTipCardsArr(pl.mjhand, null, tData);
        } else {
            this.cardTipsArr = MjClient.majiang.getTipCardsArr(pl.mjhand, tData.lastPutCard, tData);
        }
        this.tipsIdx = 0;
    }
    MjClient.playui.handleHimtBtn(isMe, true);
    MjClient.playui.handleNoPutTag(off, false);

    MjClient.playui.handlePutCardBtn(isMe, MjClient.playui.isCanPutCards());
    this.isCardsSend = false;

    if(eD) {
        for(var i = 0; i< this.headOffLen; i++){
            var tmpoff = this.headOffArr[i];
            var pl = getUIPlayer(tmpoff);
            var uid = pl.info.uid;
            this.headNode[tmpoff].updateTotalFen(eD.totalFenData[uid]);
            this.headNode[tmpoff].updateZhuaFen(eD.zhuaFenData[uid])
        }
        if(eD.isZhuaFen){
            MjClient.playui.updateFenPaiData({});
            var uid = eD.zhuaFenUid;
            off = getUiOffByUid(uid);
            var node = getNode_cards(off);
            var centerPos= node.convertToNodeSpace(cc.p(MjClient.size.width/8 + 40,MjClient.size.height*3/4));
            this.headNode[off].updateZhuaFen(eD.zhuaFenData[uid] - eD.roundScore);
            this.headNode[off].showScoreMoveAni(eD.roundScore, centerPos, eD.totalFenData[uid], eD.zhuaFenData[uid]);
        } else {
            MjClient.playui.updateFenPaiData(eD.fenPaiData);
        }
    }

    var tourList = tData.tourList;
    if(tourList.length != 0) {
        for(var i = 0;i < tourList.length; i++) {
            var off = getUiOffByUid(tourList[i]);
            MjClient.playui.handleRank(off,true,i+1);
        }
    }
};

// 等待准备
PlayLayer_ruanjiangqianfen.prototype.dealAllReady=function () {
    for(var i=0; i<this.headOffLen; i++){
        var off = this.headOffArr[i];
        MjClient.playui.handleAboutReady(off);
    }
};

// 处理手牌
PlayLayer_ruanjiangqianfen.prototype.handleMjHand = function(eD) {
    MjClient.playui.showGps();
    MjClient.playui.updateGameRound();
    if(eD) {
        MjClient.playui.isSendCard = 1;
    }
    for(var i = 0; i < this.headOffLen; i++) {
        var off = this.headOffArr[i];
        MjClient.playui.initUserHandUiQianFen(off);
    }
    if(eD) {
        MjClient.playui.showPostCardAnimation();
    }
}

//处理切牌
PlayLayer_ruanjiangqianfen.prototype.dealAfterReady = function(eD) {
    MjClient.playui.dealAllReady();
    var tData = MjClient.data.sData.tData;
    if(eD&&eD.tState) {
        tData.tState = eD.tState;
    }
    if (tData.tState != TableState.afterReady) {
        return ;
    }
    if(eD&&eD.curPlayer) {
        tData.curPlayer = eD.curPlayer;
    }
    if(eD) {
        tData.showCard = eD.showCard;
    }
}


// =========================[[ 小控件 ]] ========================

PlayLayer_ruanjiangqianfen.prototype.updateUserHeadPosition=function(off, bRoundEnd) {
    var node = this.headParentNode[off];
    if (off == 0) {
        if (bRoundEnd) {
            setWgtLayout(node, [0.43, 0.43], [0.5, 0.26], [0, 0]);
        } else {
            setWgtLayout(node, [0.43, 0.43], [0.04 + (isIPhoneX()?0.04:0), 0.23 ], [0, 0]);
        }
    } else if (off == 1) {
        if (bRoundEnd) {
            setWgtLayout(node, [0.43, 0.43], [0.85, 0.55], [0, 0]);
        } else {
            setWgtLayout(node, [0.43, 0.43], [0.95, 0.65], [0, 0]);
        }
    } else if (off == 2) {
        if (bRoundEnd) {
            setWgtLayout(node, [0.43, 0.43], [0.5, 0.78], [0, 0]);
        } else {
            if(MjClient.MaxPlayerNum == 2) {
                setWgtLayout(node, [0.43, 0.43], [0.95, 0.65], [0, 0]);
            } else {
                setWgtLayout(node, [0.43, 0.43], [0.5, 0.92], [0, 0]);
            }
        }
    } else if (off == 3) {
        if (bRoundEnd) {
            setWgtLayout(node, [0.43, 0.43], [0.14, 0.55], [0, 0]);
        } else{
            setWgtLayout(node, [0.43, 0.43], [0.04 + (isIPhoneX()?0.04:0) , 0.64], [0, 0]);
        }
    }
};

//设置地区信息
PlayLayer_ruanjiangqianfen.prototype.showGameName = function() {
    var gameName = this.node.getChildByName("gameName");
    setWgtLayout(gameName,[0.15, 0.15], [0.5, 0.58], [0, 0]);
    var text = GameBg[MjClient.gameType];
    gameName.loadTexture(text);
}
//添加还背景的功能
PlayLayer_ruanjiangqianfen.prototype.addChangeBg = function(){
    var btnChange = this.node.getChildByName("Btnchange");
    var btnSetting = this.node.getChildByName("setting");
    btnSetting.setPositionY(84.15);
    setWgtLayout(btnSetting, [0.09, 0.09], [0.95, 0.95], [0, 0]);

    btnChange.setPosition(btnSetting.x,30);
    setWgtLayout(btnChange, [0.09, 0.09], [0.89, 0.95], [0, 0]);
    btnChange.setScale(btnSetting.getScale());
    btnChange.addTouchEventListener(function(sender,type){
        if(type == 2){
            setCurrentGameBgTypeToNext();
            postEvent("changeGameBgEvent");
        }
    },this);
};

PlayLayer_ruanjiangqianfen.prototype.showVoice = function() {
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
    setWgtLayout(voice_btn, [0.09, 0.09], [0.95, 0.38], [0, 0]);
};

PlayLayer_ruanjiangqianfen.prototype.addWaitNode = function() {
    this.waitNode = new PokerWaitNode_RuanJiangQianFen();
    this.waitNode.node.setPosition(cc.p(0,0));
    MjClient.playui.node.addChild(this.waitNode.node);
};
PlayLayer_ruanjiangqianfen.prototype.setWaitNodeVisible= function(bVisible) {
    if(!MjClient.playui.waitNode) { return ;}
    MjClient.playui.waitNode.setVisible(bVisible);
}

PlayLayer_ruanjiangqianfen.prototype.addCutCardsLayer = function () { //cena
    // 切牌
    if(MjClient.rePlayVideo == -1){
       var cutCardLayer = new cutcardsLayer();
       cutCardLayer.setPosition(cc.p(cc.winSize.width / 2, cc.winSize.height / 2));
       MjClient.playui.node.addChild(cutCardLayer);
    }
};

PlayLayer_ruanjiangqianfen.prototype.showTableID = function(bShow) {
    var textTableId = this._banner.getChildByName("tableid");
    textTableId.ignoreContentAdaptWithSize(true);
    textTableId.setString(""+MjClient.data.sData.tData.tableid);
}

// 出牌按钮
PlayLayer_ruanjiangqianfen.prototype.handlePutCardBtn = function (isVisible, isAble) {
    var btnPutCard   = this.node.getChildByName("BtnPutCard");
    var tData = MjClient.data.sData.tData;
    isVisible = tData.tState == TableState.waitPut && isVisible;
    if(MjClient.playui.isSendCard) {
        isVisible = false;
    }
    btnPutCard.visible = isVisible
    if (!isVisible) { return; }
    var d= isIPhoneX() ? 0.04 : 0;
    setWgtLayout(btnPutCard,[0.135, 0.128], [0.6, 0.43+d], [0, 0]);
    btnPutCard.setBright(isAble);
    btnPutCard.setTouchEnabled(isAble);
};

//操作按钮(提示和不出)
PlayLayer_ruanjiangqianfen.prototype.handleHimtBtn = function(isVisible, isAble) {
    if(MjClient.playui.isSendCard) {
        isVisible = false;
    }
    var btnHimt      = this.node.getChildByName("BtnHimt");
    btnHimt.visible = isVisible;
    if (!isVisible) { return; }
    var d= isIPhoneX() ? 0.04 : 0;
    setWgtLayout(btnHimt,[0.135, 0.128], [0.4, 0.42+d], [0, 0]);
    btnHimt.setBright(isAble);
    btnHimt.setTouchEnabled(isAble);
};


// 牌局信息
PlayLayer_ruanjiangqianfen.prototype.showRoundInfo = function() {
    var nodeRoundInfo = this.node.getChildByName("round_info_node");
    var textRoundInfo = nodeRoundInfo.getChildByName("roundInfo");
    var tData = MjClient.data.sData.tData;
    var str = getPlaySelectPara(MjClient.gameType,tData.areaSelectMode);
    str = str.replace("房主付,","");

    if (str.charAt(str.length - 1) == ",") {
        str = str.substring(0, str.length - 1);
    }
    textRoundInfo.visible = true;
    textRoundInfo.setString(str);
    textRoundInfo.ignoreContentAdaptWithSize(true);
    setWgtLayout(nodeRoundInfo, [0.13, 0.13], [0.5, 0.5], [0, 0]);
};

// 局数
PlayLayer_ruanjiangqianfen.prototype.updateGameRound= function() {
    var Text_jushu = this._banner.getChildByName("Text_jushu");
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    Text_jushu.setString("第" + (tData.roundAll-tData.roundNum + 1) +"局");
    Text_jushu.ignoreContentAdaptWithSize(true);
}

// 要不起
PlayLayer_ruanjiangqianfen.prototype.handleNoPutTag = function(off, visible) {
    var node = getNode_cards(off);
    var noPut = node.getChildByName("noPutTag");
    noPut.visible = visible;
    noPut.setScale(MjClient.size.width/1280);
    if (off == 0) {
        setWgtLayout(noPut,[0.082, 0],[0.5, 0.40 + (isIPhoneX()?0.08:0)],[0, 0]);
    } else if (off == 1) {
        setWgtLayout(noPut,[0.082, 0],[0.83, 0.60],[0,0]);
    } else if (off == 2) {
        setWgtLayout(noPut,[0.082, 0],[0.50, 0.7],[0,0]);
    } else {
        setWgtLayout(noPut,[0.082, 0],[0.18, 0.60],[0,0]);
    }
}

// =========================[[ 系统 ]] ==========================
PlayLayer_ruanjiangqianfen.prototype.dealSendVoice = function(fullFilePath) {
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

PlayLayer_ruanjiangqianfen.prototype.dealDownAndPlayVoice = function(msg) {
    MjClient.native.HelloOC("downloadPlayVoice ok");
    MjClient.data._tempMessage = msg;
    MjClient.native.HelloOC("mas is" + JSON.stringify(msg));
    downAndPlayVoice(msg.uid, msg.msg);
}

PlayLayer_ruanjiangqianfen.prototype.dealUploadRecord = function(filePath) {
    if (filePath) {
        MjClient.native.HelloOC("upload voice file");
        MjClient.native.UploadFile(filePath, MjClient.remoteCfg.voiceUrl, "sendVoice");
    } else {
        MjClient.native.HelloOC("No voice file update");
    }
};

// =========================[[ 界面 ]] ==========================

// 绘制手牌
PlayLayer_ruanjiangqianfen.prototype.initUserHandUiQianFen = function(off) {
    var pl = getUIPlayer(off);
    if (pl == null) { return; }
    var tData = MjClient.data.sData.tData;
    if( tData.tState != TableState.waitPut &&
        tData.tState != TableState.waitEat &&
        tData.tState != TableState.waitCard &&
        tData.tState != TableState.waitJiazhu){
        return;
    }
    this.handCardsWgetArr[off].initHandCards();
};

//处理出牌,打牌动作
PlayLayer_ruanjiangqianfen.prototype.dealPKPutcard = function(off, msg) {
    if(off == 0 || MjClient.rePlayVideo != -1) { // 自己视角或回放
        this.handCardsWgetArr[off].removeHandCardByValueArr(msg.card);
    }

    this.deskCardsWgetArr[off].addPutCards(msg.card);
    if (!msg || !msg.noPlayEffect) {
        playCardAni(msg.card,off);
    }
};

// 处理准备字准备相关
PlayLayer_ruanjiangqianfen.prototype.handleAboutReady=function(off) {
    var isFull = !IsInviteVisible();
    var imgReady=getNode_cards(off).getChildByName("ready");
    imgReady.visible = false;
    var pl = getUIPlayer(off);
    if(off < 0){ return; }
    if(pl == undefined){return;}
    var tData = MjClient.data.sData.tData;

    var isShowText = isFull && pl.mjState == TableState.isReady && tData.tState != TableState.waitJoin;
    if (off == 0) {
        MjClient.playui.setWaitNodeVisible(!isFull);
        var btnReady= MjClient.playui.node.getChildByName("BtnReady");
        var isShow = isFull && pl.mjState == TableState.waitReady;
        btnReady.visible = isShow;
        if (isShow) {
            if (MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP|| MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ) {
                setWgtLayout(btnReady,[0.16, 0], [0.5, 0.4], [0, 0]);
            }
            else {
                setWgtLayout(btnReady,[0.18, 0.18], [0.5, 0.37], [0, 0]);
            }
        }
    }
    imgReady.visible = isShowText;
    if (!isShowText) { return; }
    var arr = [[0, -1.5],[2, 0],[0,1.5],[-2, 0]];
    var arrPos = [[0.5, 0.44],[0.70,0.64],[0.50, 0.62],[0.32, 0.64]];
    var tData = MjClient.data.sData.tData;
    var roundNum = tData.roundAll-tData.roundNum + 1;
    setWgtLayout(imgReady, [0.07, 0.07],(roundNum == 1?[0.5,0.5]:arrPos[off]),arr[off]);
};
PlayLayer_ruanjiangqianfen.prototype.checkRoomUiDelete = function()
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

PlayLayer_ruanjiangqianfen.prototype.showGps = function() {
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

// 三人场底牌
PlayLayer_ruanjiangqianfen.prototype.handleDiCards = function(bOpen) {
    if(MjClient.MaxPlayerNum != 3) {
        return;
    }
    var tData = MjClient.data.sData.tData;
    var cards = tData.diPaiArr;
    var tData = MjClient.data.sData.tData;

    var diCardsNum = tData.diPaiCount ? tData.diPaiCount : 6;
    var startX = this._banner.getChildByName("dizhuCards_0").x;
    for (var i = 0; i < diCardsNum; i++) {
        var cardNode = this._banner.getChildByName("dizhuCards_" + i);
        cardNode.x = startX + i*43;
        if(bOpen) {
            setCardSprite_card(cardNode, cards[i], false);
        } else {
            cardNode.removeAllChildren();
            cardNode.loadTexture("playing/cardPic2/beimian_puke.png");
            cardNode.visible = !(MjClient.playui.isRoundEnd() || tData.tState == TableState.afterReady);
        }
    }
}
// =========================[[ 事件 ]] ==========================

PlayLayer_ruanjiangqianfen.prototype.dealMJTick = function (eD) {
    for(var i=0; i<this.headOffLen; i++) {
        var off = this.headOffArr[i];
        var pl = getUIPlayer(off);
        this.headNode[off].setUserOffline(pl);
    }
}
PlayLayer_ruanjiangqianfen.prototype.dealLogout= function() {
    if (MjClient.playui) {
        MjClient.addHomeView();
        MjClient.playui.removeFromParent(true);
        delete MjClient.playui;
        delete MjClient.endoneui;
        delete MjClient.endallui;
    }
}

PlayLayer_ruanjiangqianfen.prototype.dealEndRoom= function(msg) {
    mylog(JSON.stringify(msg));
    if (msg.showEnd) {
        this.addChild(new GameOverLayer_ruanjiangqianfen(),500);
    } else {
        MjClient.Scene.addChild(new StopRoomView());
    }
}

PlayLayer_ruanjiangqianfen.prototype.dealLeaveGame = function(){
    MjClient.addHomeView();
    MjClient.playui.removeFromParent(true);
    delete MjClient.playui;
    delete MjClient.endoneui;
    delete MjClient.endallui;
    cc.audioEngine.stopAllEffects();
    playMusic("bgMain");
}

PlayLayer_ruanjiangqianfen.prototype.dealLoadWxHead=function (eD) {
    for(var i=0; i<this.headOffLen; i++) {
        var off = this.headOffArr[i];
        if(eD.uid == getUIHeadByOff(off).uid) {
            this.headNode[off].setWxHead(true, eD.img);
        }
    }
}

PlayLayer_ruanjiangqianfen.prototype.dealPlayVoice=function (msg) {
    for(var i = 0; i < this.headOffLen; i++){
        var off = this.headOffArr[i];
        this.headNode[off].showUserChat(off,msg);
    }
}

PlayLayer_ruanjiangqianfen.prototype.dealChangeGameBgEvent = function() {
    var back = MjClient.playui.node.getChildByName("back");
    var back2 = back.getChildByName("back");
    setWgtLayout(back2,[1, 1], [0.5, 0.5], [0, 0],true);
    changeGameBg(back2);
};

// 1 add 2 remove 3 online
PlayLayer_ruanjiangqianfen.prototype.handlePlayerChange = function (action,uid) {
    var targetOff = -1;
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var uids = tData.uids;
    if (action == 2 && uid != null) {
        var targetIndex = uids.indexOf(uid);

        if (targetIndex == -1) {
            targetIndex = uids.indexOf(0);
        }
        targetOff= getOffByIndex(targetIndex);

    }
    var tData=MjClient.data.sData.tData;
    var roundNum = tData.roundAll-tData.roundNum+1;
    var isRoundEnd = MjClient.playui.isRoundEnd() && (roundNum <= 1);
    for(var i=0; i<this.headOffLen; i++) {
        var off = this.headOffArr[i];
        MjClient.playui.handleAboutReady(off);
        var node = getNode(off);
        var pl = null;
        if (targetOff != off) {
            pl = getUIPlayer(off);
        }
        this.headNode[off].updateUserInfo(pl);
        if(action == 3){
            MjClient.playui.updateUserHeadPosition(off, isRoundEnd);
        }
    }
}

PlayLayer_ruanjiangqianfen.prototype.dealMoveHead=function () {
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
// =========================[[ 消息 ]] ===========================
// 出牌
PlayLayer_ruanjiangqianfen.prototype.sendPutCardsToServer = function(){
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
        putCardType: MjClient.playui.putCardType,
        tingAfterPut: false
    });
    this.isCardsSend = true;
    MjClient.playui.dealPKPutcard(0, {card:outCardArr}); // 提前出牌
    //隐藏出牌按钮
    MjClient.playui.handleHimtBtn(false);
    MjClient.playui.handlePutCardBtn(false);
};
// 准备-1， 提示过牌0， 不出 1
PlayLayer_ruanjiangqianfen.prototype.sendPassToServer = function (isActivePass) {
    this.handCardsWgetArr[0].clearCardsUpStatus();
    MjClient.gamenet.request("pkroom.handler.tableMsg", {cmd: "PKPass", activePass:isActivePass} );
    if(isActivePass != -1) {
        //隐藏出牌按钮
        MjClient.playui.handleHimtBtn(false);
        MjClient.playui.handlePutCardBtn(false);
        MjClient.playui.handleNoPutTag(0, true);
    }
}

// =========================[[ 初始化 ]] ==========================
PlayLayer_ruanjiangqianfen.prototype.initTagList = function(){
    this.btnTagList = {
        BtnPutCard:1,BtnHimt:2,BtnReady:3,
        setting:4,back_btn:5,Button_1:6, gps_btn:7,chat_btn:8,
        btn_tuoguan:9
    };
}
PlayLayer_ruanjiangqianfen.prototype.initData = function(isRoundEnd){
    this.cardTipsArr = [];
    this.tipsIdx = 0;
    this.isCardsSend = false; // 判断是否已经出牌
    this.isDealInitScene = true; // 防止重启，会刷两遍 dealInitSceneData()
    if (!isRoundEnd) { return; }
    var tData = MjClient.data.sData.tData;
    tData.diCards=[];
    tData.rate = 0;
    tData.isShowDiCards = false;
    for(var i=0; i<this.headOffLen; i++) {
        var off = this.headOffArr[i];
        var pl = getUIPlayer(off);
        if(pl == null) continue;
        pl.handCount = 0;
        pl.jiazhuNum = 0;
        var uid = pl.info.uid;
        tData.xiFenData[uid] = 0;
        tData.zhuaFenData[uid] = 0;
    }
    MjClient.playui.isSendCard = 0;
}

PlayLayer_ruanjiangqianfen.prototype.initOnce = function() {
    MjClient.playui.showRoundInfo();
    MjClient.playui.showVoice();
    MjClient.playui.dealChangeGameBgEvent();
    MjClient.playui.addChangeBg();
    MjClient.playui.addWaitNode();
    MjClient.playui.addCutCardsLayer();
    MjClient.playui.showTableID();
    MjClient.playui.showGameName();
    if (!this.isDealInitScene) {
        MjClient.playui.dealInitSceneData();
        return;
    } else {
        this.isDealInitScene = false;
    }
};

PlayLayer_ruanjiangqianfen.prototype.initUI = function () {
    this._downNode  = this.node.getChildByName("down");
    this._rightNode = this.node.getChildByName("right");
    this._rightNode.visible = (MjClient.MaxPlayerNum >= 3);
    this._topNode   = this.node.getChildByName("top");
    this._topNode.visible = (MjClient.MaxPlayerNum != 3);

    this._leftNode  = this.node.getChildByName("left");
    this._leftNode.visible = (MjClient.MaxPlayerNum >= 3);
    this._AniNode =  this.node.getChildByName("eat");
    this._banner= this.node.getChildByName("banner");

    var wifi = this._banner.getChildByName("wifi");
    updateWifiState(wifi);
    var powerBar = this._banner.getChildByName("powerBar");
    updateBattery(powerBar);
    var Button_1 = this._banner.getChildByName("Button_1");
    Button_1.visible = true;
    var isHaveGPS = MjClient.MaxPlayerNum > 2;
    var gps_btn = this.node.getChildByName("gps_btn");
    gps_btn.setVisible(isHaveGPS);
    var positionCard = this.node.getChildByName("positionCard");
    positionCard.visible = false;
    var btnChat = this.node.getChildByName("chat_btn");
    setWgtLayout(btnChat, [0.06, 0.06], [0.95, 0.26], [0, 0]);
    setWgtLayout(gps_btn, [0.09, 0.09], [0.83, 0.95], [0, 0]);
    setWgtLayout(this._banner,[0.5, 0.5], [0, 1.0], [0, 0]);

    for (var i = 0; i < 6; i++) {
        var cardNode = this._banner.getChildByName("dizhuCards_" + i);
        if(MjClient.MaxPlayerNum != 3) {
            cardNode.visible = false;
        }
    }

    //托管相关
    this.block_tuoguan = this.node.getChildByName("block_tuoguan");
    this.block_tuoguan.visible = false;
    setWgtLayout(this.block_tuoguan, [1, 1], [0.5, 0.5], [0, 0], true);
    var Text_1 = this.block_tuoguan.getChildByName("Text_1");
    Text_1.ignoreContentAdaptWithSize(true);

};
PlayLayer_ruanjiangqianfen.prototype.hideAllUI=function(){
    for(var off = 0;off < 4;off++){
        var node = getNode_cards(off);
        var ready = node.getChildByName("ready");
        var noPutTag = node.getChildByName("noPutTag");
        ready.visible = false;
        noPutTag.visible = false;
        node.getChildByName("img_you").visible = false;
    }
    var BtnPutCard = this.node.getChildByName("BtnPutCard");
    var BtnHimt = this.node.getChildByName("BtnHimt");
    var BtnReady = this.node.getChildByName("BtnReady");
    BtnPutCard.visible = false;
    BtnHimt.visible = false;
    BtnReady.visible = false;
    var flyCardBack = this.node.getChildByName("flyCard");
    flyCardBack.visible = false;
}
// 初始化节点
PlayLayer_ruanjiangqianfen.prototype.initHeadWget = function () {
    this.headOffArr = [];
    this.headNode={};
    this.handCardsWgetArr = {}
    this.deskCardsWgetArr = {}
    this.headParentNode = {}
    this.headOffLen = MjClient.MaxPlayerNum;
    for(var off = 0; off < 4; off++){
        if(MjClient.MaxPlayerNum  == 2) {
            if((off == 3|| off ==4)) { continue; }
            if(off == 1){ off = 2; }
        }
        if(MjClient.MaxPlayerNum  == 3){
            if(off == 3){ continue; }
            if(off == 2){ off = 3; }
        }
        var _node=getNode(off);
        var nodeStand=_node.getChildByName("stand_node");
        var nodeDeskCard =_node.getChildByName("deskCard");

        var head_node =_node.getChildByName("head");
        this.headParentNode[off] = head_node;

        this.headOffArr.push(off);
        this.headNode[off] = new PokerHeadNode_ruanJiangQianfen(off);

        head_node.addChild(this.headNode[off].node);
        this.headNode[off].node.setPosition(cc.p(64,41.5));
        this.headNode[off].node.setScale(0.3);
        this.handCardsWgetArr[off] = new PokerCardNode_Rujiangqianfen(off);
        nodeStand.addChild(this.handCardsWgetArr[off].node);
        this.deskCardsWgetArr[off] = new PokerCardNode_Rujiangqianfen(off);
        nodeDeskCard.addChild(this.deskCardsWgetArr[off].node);

        var play_tips=_node.getChildByName("play_tips");// 无用UI
        play_tips.visible = false;

        if (off == 0) {
            setWgtLayout(nodeStand, [0.09,0], [0.0, 0.22 + (isIPhoneX()?0.04:0)], [0, 0]);
            setWgtLayout(nodeDeskCard,[0.052, 0],[0.51, 0.06],[0, 3.3]);
        } else if (off == 1) {
            setWgtLayout(nodeStand, [0, 0.09], [0.85, 0.87], [0, 0]);
            setWgtLayout(nodeDeskCard,[0.052, 0],[0.94, 0.65],[0, 0]);
        } else if (off == 2) {
            if(MjClient.MaxPlayerNum == 2) {
                setWgtLayout(nodeStand, [0, 0.09], [0.85, 0.47], [0, 0]);
                nodeStand.setRotation(-90);
                setWgtLayout(nodeDeskCard,[0.052, 0],[0.92, 0.65],[0, 0]);
            } else {
                setWgtLayout(nodeStand, [0, 0.09], [0.63, 0.94], [0, 0]);
                setWgtLayout(nodeDeskCard,[0.052, 0],[0.53, 0.80],[0, 0]);
            }
        } else if (off == 3) {
            setWgtLayout(nodeStand, [0, 0.09], [0.18, 0.80], [0, 0]);
            setWgtLayout(nodeDeskCard,[0.052, 0],[0.18, 0.65],[0, 0]);
        }
        var tData = MjClient.data.sData.tData;
        var roundNum = tData.roundAll-tData.roundNum+1;
        var isRoundEnd = MjClient.playui.isRoundEnd() && (roundNum <= 1);
        MjClient.playui.updateUserHeadPosition(off, isRoundEnd);
    }
}
//初始化玩家信息
PlayLayer_ruanjiangqianfen.prototype.initMsgEvent=function() {
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
    UIEventBind(null,this.node,"after_ready",function (eD) { //切牌
        MjClient.playui.dealMoveHead();
        MjClient.playui.dealAfterReady(eD);
    });
    UIEventBind(null,this.node,"mjhand",function (eD) {
        MjClient.playui.handleMjHand(eD);
    });
    UIEventBind(null,this.node,"waitPut",function (eD) {
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
        MjClient.playui.handlePlayerChange(2, eD.uid);
    });
    UIEventBind(null,this.node,"onlinePlayer",function (eD) {
        MjClient.playui.handlePlayerChange(3);

        // 全局托管，自动准备移除小结算
        var mySelf = getUIPlayer(0);
        if (!mySelf) return;
        if (!eD.isTrust)return;
        if (mySelf.info.uid != eD.uid) return;

        if(MjClient.endoneui && cc.sys.isObjectValid(MjClient.endoneui)){
            MjClient.endoneui.removeFromParent(true);
            MjClient.endoneui = null;
        }

        if (MjClient.rePlayVideo >= 0 && MjClient.replayui && !MjClient.endallui) {
            MjClient.replayui.replayEnd();
        }
       
        if (MjClient.arrowbkNode && cc.sys.isObjectValid( MjClient.arrowbkNode )) {
            MjClient.arrowbkNode.setVisible(false);
        }
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
    UIEventBind(null,this._banner,"nativePower",function (eD) {
        MjClient.playui._banner.getChildByName("powerBar").setPercent(Number(eD));
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
    UIEventBind(null,this.node,"PostCardsEnded",function (eD) {
        MjClient.playui.dealPostCardsEnded();
    });
    UIEventBind(null,this.node,"s2cYJQianFenDiCards",function (eD) {
        MjClient.playui.dealOpenCards(eD);
    });

    UIEventBind(null,this.node,"trustTip",function (eD) {
        MjClient.playui.dealtrustTip(eD);
    });
    UIEventBind(null,this.node,"beTrust",function (eD) {
        MjClient.playui.dealbeTrust(eD);
    });
    UIEventBind(null,this.node,"cancelTrust",function (eD) {
        MjClient.playui.dealcancelTrust(eD);
    });
    UIEventBind(null,this.node,"clearCardUI",function () {
        MjClient.playui.hideAllUI();
    });
};

PlayLayer_ruanjiangqianfen.prototype.initClickEvent = function() {
    var btnCallback = function(sender,type) {
        if(type == ccui.Widget.TOUCH_ENDED) {
            MjClient.playui.btnEventListener(sender,type);
        }
    }
    var btnList1 = ["BtnPutCard", "BtnHimt", "BtnReady","gps_btn","chat_btn","setting"];
    for (var i = 0; i < btnList1.length; i++) {
        MjClient.playui.btnBindCallBack(this.node, btnList1[i], this.btnTagList[btnList1[i]], btnCallback);
    }

    var btnList2 = ["Button_1"];
    for (var i = 0; i < btnList2.length; i++) {
        MjClient.playui.btnBindCallBack(this._banner, btnList2[i], this.btnTagList[btnList2[i]], btnCallback);
    }

    var btnList3 = ["btn_tuoguan"];
    for (var i = 0; i < btnList3.length; i++) {
        MjClient.playui.btnBindCallBack(this.block_tuoguan, btnList3[i], this.btnTagList[btnList3[i]], btnCallback);
    }    
};

PlayLayer_ruanjiangqianfen.prototype.btnBindCallBack=function(parent, str, tag, callback){
    var tmpNode = parent.getChildByName(str);
    tmpNode.tag = tag;
    tmpNode.addTouchEventListener(callback);
};

PlayLayer_ruanjiangqianfen.prototype.btnEventListener = function(sender,type) {
    var tag = sender.getTag();
    if(tag == this.btnTagList.BtnPutCard) { // 出牌
        if (!MjClient.playui.isPutCardLegitimate()) {
            return;
        }
        MjClient.playui.sendPutCardsToServer();
    } else if(tag == this.btnTagList.BtnHimt) { // 提示
        playEffect("guandan/tishi");
        if(this.cardTipsArr.length == 0) { // 没有提示，过牌
            MjClient.playui.sendPassToServer(0);
            return;
        }
        MjClient.playui.showTipCards();
    } else if(tag == this.btnTagList.BtnReady){
        sender.visible = false;
        MjClient.playui.sendPassToServer(-1);
        MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Zhunbei", {uid: SelfUid(), gameType:MjClient.gameType});
    } else if(tag == this.btnTagList.setting) {
        var settringLayer = new SettingViewCard();
        settringLayer.setName("PlayLayerClick");
        MjClient.Scene.addChild(settringLayer);
        MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Shezhi", {uid:SelfUid(),gameType:MjClient.gameType});
    } else if(tag == this.btnTagList.back_btn) {
        MjClient.showMsg("是否解散房间？", function () {
            MjClient.delRoom(true);
        }, function(){}, 1);
    } else if(tag == this.btnTagList.Button_1) {
        MjClient.openWeb({url:MjClient.GAME_TYPE.PAO_DE_KUAI,help:true});
    } else if(tag == this.btnTagList.gps_btn) {
        if (MjClient.MaxPlayerNum == 3) {
            MjClient.Scene.addChild(new showDistance3PlayerLayer());
        } else if (MjClient.MaxPlayerNum == 4) {
            MjClient.Scene.addChild(new showDistanceLayer());
        }
    } else if(tag == this.btnTagList.chat_btn) {
        var chatlayer = new ChatLayer();
        MjClient.Scene.addChild(chatlayer);
    }else if (tag == this.btnTagList.btn_tuoguan)
    {
        MjClient.gamenet.request("pkroom.handler.tableMsg", {cmd: "cancelTrust"},function (rtn) {
            MjClient.playui.block_tuoguan.setVisible(false);
        });
    }
    
};
PlayLayer_ruanjiangqianfen.prototype.isPutCardLegitimate = function() {
    var pl = getUIPlayer(0);
    var tData = MjClient.data.sData.tData;
    var lastPutCards = tData.lastPutCard;
    if (tData.lastPutPlayer == tData.curPlayer || tData.lastPutPlayer == -1) {
        lastPutCards = null;
    }
    var upSelectCards = this.handCardsWgetArr[0].getUpCardArr();
    var canPut = MjClient.majiang.checkPut(pl.mjhand, upSelectCards, lastPutCards, tData);
    return canPut;
}
PlayLayer_ruanjiangqianfen.prototype.shwoFlyCardAnim = function(showCard)
{
    var flyNode = MjClient.playui.node.getChildByName("flyCard");
    if(showCard == -1) {
        flyNode.visible = false;
        return ;
    }
    setWgtLayout(flyNode,[0.1, 0.1], [0.5, 0.75], [0, 0]);
    var tData = MjClient.data.sData.tData;
    var off = getOffByIndex(tData.curPlayer);
    var playerNode = getNode_cards(off);
    if (!playerNode)
        return;

    var headNode = playerNode.getChildByName("head");
    var point = headNode.convertToWorldSpace(cc.p(headNode.width/2, headNode.height/2));
    point = flyNode.getParent().convertToNodeSpace(point);
    setCardSprite_card(flyNode, showCard, false);
    flyNode.setVisible(true);
    flyNode.runAction(cc.sequence(cc.delayTime(0.2),cc.moveTo(1.0, point), cc.callFunc(function() {
        flyNode.setVisible(false);
    })));
}
PlayLayer_ruanjiangqianfen.prototype.updateFenPaiData = function(fenPaiData) {
    var Image_510kBG = this._banner.getChildByName("Image_510kBG");
    if(isIPhoneX()) {
        setWgtLayout(Image_510kBG, [1.5, 1.5], [0.22, 0.2], [0, -0.5],false,true);
    }
    var cnt_5 = Image_510kBG.getChildByName("cnt_5");
    var cnt_10 = Image_510kBG.getChildByName("cnt_10");
    var cnt_k = Image_510kBG.getChildByName("cnt_k");

    var point_5 = 5;
    var point_10 = 10;
    var point_k = 13;

    cnt_5.setString(fenPaiData[point_5]?fenPaiData[point_5]:0);
    cnt_10.setString(fenPaiData[point_10]?fenPaiData[point_10]:0);
    cnt_k.setString(fenPaiData[point_k]?fenPaiData[point_k]:0);
}

PlayLayer_ruanjiangqianfen.prototype.showPostCardAnimation = function() {

    if (MjClient.rePlayVideo == -1) {
        // 先设置自己发牌的动画
        this.handCardsWgetArr[0].sendCardToMe();
        MjClient.playui.showSendCardAni();
        var tData = MjClient.data.sData.tData;
        MjClient.playui.shwoFlyCardAnim(tData.showCard);
    }
}
PlayLayer_ruanjiangqianfen.prototype.dealPostCardsEnded = function() {
    var tData = MjClient.data.sData.tData;
    MjClient.playui.isSendCard = 0;
    this.handCardsWgetArr[0].dealSendEnd();
    MjClient.playui.handleDiCards(tData.isShowDiCards);
    if(IsTurnToMe() && tData.tState == TableState.waitPut)
    {
        MjClient.playui.handleHimtBtn(true, true);
        MjClient.playui.handlePutCardBtn(true,false);
    }
}
PlayLayer_ruanjiangqianfen.prototype.showSendCardAni = function() {
    var flyNode = MjClient.playui.node.getChildByName("flyCard");
    setWgtLayout(flyNode,[0.14, 0.14], [0.5, 0.60], [0, 0]);
    flyNode.removeAllChildren();
    var pl = getUIPlayer(0);
    var nodeBackArr = [];
    for(var i = 0;i < MjClient.MaxPlayerNum * pl.handCount; i++) {
        var nodeBack = flyNode.clone();
        nodeBack.visible = true;
        nodeBack.loadTexture("playing/cardPic/beimian_puke.png");
        MjClient.playui.node.addChild(nodeBack);
        nodeBackArr.push(nodeBack);
    }
    for(var i =0;i <nodeBackArr.length;i++) {
        var nodeBack = nodeBackArr[i];
        var off = this.headOffArr[i%MjClient.MaxPlayerNum];
        var toPos;
        if(off == 0 ) {
            toPos = cc.p(0,-cc.winSize.height/8);
        } else if(off == 2) {
            if(MjClient.MaxPlayerNum == 2) {
                toPos = cc.p(cc.winSize.width/8,0);
            } else {
                toPos = cc.p(0,cc.winSize.height/8);
            }
        } else if(off == 1) {
            toPos = cc.p(cc.winSize.width/8,0);
        } else if(off == 3) {
            toPos = cc.p(-cc.winSize.width/8,0);
        }
        if(i < nodeBackArr.length -1) {
            nodeBack.runAction(cc.sequence(
                cc.delayTime(i * 0.02),
                cc.moveBy(0.01,toPos),
                cc.callFunc(function()
                {
                    this.removeFromParent(true)
                }.bind(nodeBack))
                )
            );
        } else {
            nodeBack.runAction(cc.sequence(
                cc.delayTime(i * 0.02),
                cc.moveBy(0.01,toPos),
                cc.callFunc(function()
                {
                    this.removeFromParent(true)
                    postEvent("PostCardsEnded");
                }.bind(nodeBack))
                )
            );
        }
    }
}
PlayLayer_ruanjiangqianfen.prototype.removeHeadEffect = function() {
    var tag = 2018155;
    for(var i = 0; i< this.headOffLen; i++) {
        var tmpoff = this.headOffArr[i];
        var cardNode = getNode_cards(tmpoff);
        cardNode.getChildByName("head").removeChildByTag(tag, true);
    }
}
PlayLayer_ruanjiangqianfen.prototype.showHeadEffect = function(){
    var tag = 2018155;
    var tData = MjClient.data.sData.tData;
    if(tData.tState != TableState.waitPut) {
        return ;
    }
    var off = getOffByIndex(tData.curPlayer);
    var curNode = getNode_cards(off);
    if (curNode)
    {
        var curNodeHead = curNode.getChildByName("head")
        cc.spriteFrameCache.addSpriteFrames("daZhaDan/effect/head/head.plist");

        var sp = curNodeHead.getChildByTag(tag);
        if(sp && cc.sys.isObjectValid(sp)){
            sp.stopAllActions();
            sp.removeFromParent(true);
            sp = null;
        }
        var sp = new cc.Sprite("#0.png");
        sp.setAnchorPoint(0.5,0.5);
        sp.scale = 0.31;
        sp.x = curNodeHead.width * 0.5 + 1;
        sp.y = curNodeHead.height * 0.5 + 5.6;
        sp.setTag(tag);
        curNodeHead.addChild(sp);
        var ac = MjClient.playui.getAnimate("",28,0.06);
        sp.runAction(cc.RepeatForever(ac));
    }
};

PlayLayer_ruanjiangqianfen.prototype.getAnimate = function(preName, len, delaytime, playCount, startIndex){
    playCount = playCount === undefined ? 1 : playCount;
    delaytime = delaytime === undefined ? 0.1 : delaytime;
    startIndex = startIndex === undefined ? 0 : startIndex;

    var arry = [];
    for(var i = startIndex; i <= len; i++)
    {
        var frame = cc.spriteFrameCache.getSpriteFrame(preName + i + ".png");
        if(frame)
        {
            arry.push(frame);
        }
    }
    return cc.animate(new cc.Animation(arry, delaytime, playCount));
}
PlayLayer_ruanjiangqianfen.prototype.handleRank = function(off,bvisible,rank) {
    var curNode = getNode_cards(off);
    var img_you = curNode.getChildByName("img_you");
    img_you.visible = bvisible;
    if(!bvisible) { return ; }
    if(rank) {
        img_you.loadTexture("playing/ruanjiangqianfen/Ui_you"+rank+".png");
    }
    if (off == 0) {
        setWgtLayout(img_you,[0.1, 0.1],[0.5, 0.16],[0, 0]);
    } else if (off == 1) {
        setWgtLayout(img_you,[0.1, 0.1],[0.85, 0.60],[0, 0]);
    } else if (off == 2) {
        if(MjClient.MaxPlayerNum == 2) {
            setWgtLayout(img_you,[0.1, 0.1],[0.85, 0.60],[0, 0]);
        } else {
            setWgtLayout(img_you,[0.1, 0.1],[0.5, 0.8],[0, 0]);
        }
    } else if (off == 3) {
        setWgtLayout(img_you,[0.1, 0.1],[0.18, 0.60],[0, 0]);
    }
}
PlayLayer_ruanjiangqianfen.prototype.dealOpenCards = function(msg) {
    MjClient.playui.handleDiCards(true);
    if(msg.score == 0) { return ; }
    var textScore = new ccui.Text();
    textScore.setFontName("fonts/lanting.TTF");
    textScore.setString("+" + msg.score);
    textScore.setColor(cc.color.WHITE);
    textScore.setFontSize(24);
    MjClient.playui.node.addChild(textScore);

    setWgtLayout(textScore,[0.06, 0.06],[0.60, 0.80],[0, 0]);
    var off = getUiOffByUid(msg.zhuaFenUid);
    var node = getNode_cards(off);
    var nodeHead = node.getChildByName("head");
    var toPos = nodeHead.getPosition();
    toPos.y -= 40;
    this.headNode[off].updateZhuaFen(msg.zhuaFen - msg.score);
    textScore.runAction(cc.sequence(
        cc.fadeIn(0.5),
        cc.MoveTo(1, toPos),
        cc.fadeOut(1),
        cc.callFunc(function(){
           this.removeFromParent(true);
            MjClient.playui.headNode[off].updateZhuaFen(msg.zhuaFen);
        }.bind(textScore))
    ));
}

PlayLayer_ruanjiangqianfen.prototype.dealtrustTip = function(msg)
{
    var off = getUiOffByUid(msg.uid);
    var headNode = this.headNode[off];
    if (!headNode)return;
    setTuoGuanCountDown(msg,headNode.countDownBg,off);

}
PlayLayer_ruanjiangqianfen.prototype.dealbeTrust = function(msg)
{
    var off = getUiOffByUid(msg.uid);
    var headNode = this.headNode[off];
    if (!headNode)return;

    if (headNode.tuoguan)
        headNode.tuoguan.visible = true;

    if(off == 0)this.block_tuoguan.visible = true;
}
PlayLayer_ruanjiangqianfen.prototype.dealcancelTrust = function(msg)
{
    var off = getUiOffByUid(msg.uid);
    var headNode = this.headNode[off];
    if (!headNode)return;

    if (headNode.tuoguan)
        headNode.tuoguan.visible = false;

    if(off == 0)this.block_tuoguan.visible = false;
}


PlayLayer_ruanjiangqianfen.prototype.playCardAni_liandui_new = function(UIoff) {
    var speed = 0.9;
    var node = this.deskCardsWgetArr[UIoff].node;
    var nodeAni = node.getChildByName("stand");

    var lianPic1 = cc.Sprite("playing/paodekuaiTable_new/ani/liandui/lian.png");
    var lianPic2 = cc.Sprite("playing/paodekuaiTable_new/ani/liandui/lian1.png");
    var duiPic1 = cc.Sprite("playing/paodekuaiTable_new/ani/liandui/dui.png");
    var duiPic2 = cc.Sprite("playing/paodekuaiTable_new/ani/liandui/dui1.png");

    var scale = 2.0;
    var x1 = x2 = 0;
    var children = node.children;
    for (var i = 0; i < children.length; i++) {
        if (children[i].name != "out")
            continue;
        if (children[i].x < x1 || x1 == 0)
            x1 = children[i].x;
        if (children[i].x > x2 || x2 == 0)
            x2 = children[i].x;
    }
    var p = cc.p((x1 + x2)/2, nodeAni.y);
    var lvguang = cc.Sprite("playing/paodekuaiTable_new/ani/lvguang.png");
    lvguang.setPosition(p);
    lvguang.setScale(0.45 * scale);
    node.addChild(lvguang, 9999);
    lvguang.setOpacity(0);
    lvguang.runAction(cc.sequence(
        cc.fadeTo(0.2 * speed, 255),
        cc.delayTime(1.0 * speed),
        cc.fadeOut(0.2 * speed),
        cc.removeSelf()
    ));

    lianPic1.setScale(scale);
    lianPic1.setPosition(p.x - 150 * scale, p.y);
    node.addChild(lianPic1, 9999);
    lianPic1.setOpacity(40);
    lianPic1.runAction(cc.sequence(
        cc.spawn(
            cc.moveTo(0.2 * speed, p.x - 35 * scale, p.y),
            cc.fadeTo(0.2 * speed, 255)
        ),
        cc.scaleTo(0.15 * speed, lianPic1.getScale() * 1.25),
        cc.scaleTo(0.15 * speed, lianPic1.getScale()),
        cc.delayTime(0.4 * speed),
        cc.scaleTo(0.15 * speed, lianPic1.getScale() * 1.25),
        cc.spawn(
            cc.scaleTo(0.15 * speed, lianPic1.getScale()),
            cc.fadeOut(0.15 * speed)
        ),
        cc.removeSelf()
    ));

    duiPic1.setScale(scale);
    duiPic1.setPosition(p.x + 100 * scale, p.y);
    node.addChild(duiPic1, 9999);
    duiPic1.setOpacity(40);
    duiPic1.runAction(cc.sequence(
        cc.spawn(
            cc.moveTo(0.2 * speed, p.x + 35 * scale, p.y),
            cc.fadeTo(0.2 * speed, 255)
        ),
        cc.scaleTo(0.15 * speed, duiPic1.getScale() * 1.3),
        cc.scaleTo(0.15 * speed, duiPic1.getScale()),
        cc.delayTime(0.4 * speed),
        cc.scaleTo(0.15 * speed, duiPic1.getScale() * 1.3),
        cc.spawn(
            cc.scaleTo(0.15 * speed, duiPic1.getScale()),
            cc.fadeOut(0.15 * speed)
        ),
        cc.removeSelf()
    ));

    lianPic2.setAnchorPoint(cc.p(1.0, 0.5));
    lianPic2.setPosition(lianPic1.width, lianPic1.height / 2);
    lianPic1.addChild(lianPic2, -1);
    lianPic2.setOpacity(0);
    lianPic2.setScale(lianPic1.width / lianPic2.width);
    lianPic2.runAction(cc.sequence(
        cc.delayTime(0.2 * speed),
        cc.spawn(
            cc.scaleTo(0.2 * speed, 0.9),
            cc.sequence(cc.fadeTo(0.2, 200), cc.fadeTo(0.2 *speed, 0))
        )
    ));

    duiPic2.setAnchorPoint(cc.p(0.0, 0.5));
    duiPic2.setPosition(0, duiPic1.height / 2);
    duiPic1.addChild(duiPic2, -1);
    duiPic2.setOpacity(0);
    duiPic2.setScale(duiPic1.width / duiPic2.width);
    duiPic2.runAction(cc.sequence(
        cc.delayTime(0.2 * speed),
        cc.spawn(
            cc.scaleTo(0.2 * speed, 0.9),
            cc.sequence(cc.fadeTo(0.2 * speed, 200), cc.fadeTo(0.2 * speed, 0))
        )
    ));
}
PlayLayer_ruanjiangqianfen.prototype.playCardAni_shunzi_new = function(UIoff) {

    var speed = 0.7;
    var node = this.deskCardsWgetArr[UIoff].node;
    var nodeAni = node.getChildByName("stand");

    var scale = 2.0;
    var x1 = x2 = 0;
    var children = node.children;
    for (var i = 0; i < children.length; i++) {
        if (children[i].name != "out")
            continue;
        if (children[i].x < x1 || x1 == 0)
            x1 = children[i].x;
        if (children[i].x > x2 || x2 == 0)
            x2 = children[i].x;
    }
    var anmPic = cc.Sprite("playing/paodekuaiTable_new/ani/shunzi/shunzi.png");
    anmPic.setScale(scale);
    anmPic.setPosition((x1 + x2)/2 - 60 * scale, nodeAni.y);
    node.addChild(anmPic, 9999);
    anmPic.setOpacity(0);
    anmPic.setCascadeOpacityEnabled(true);
    anmPic.runAction(cc.sequence(
        cc.delayTime(0.2 * speed),
        cc.spawn(
            cc.moveBy(0.5 * speed, 60 * scale, 0),
            cc.fadeTo(0.2 * speed, 255)
        ),
        cc.delayTime(0.4 * speed),
        cc.spawn(
            cc.moveBy(0.8 * speed, 60 * scale, 0),
            cc.sequence(cc.delayTime(0.4 * speed), cc.fadeTo(0.4 * speed, 0))
        ),
        cc.removeSelf()
    ));

    var anmPic2 = cc.Sprite("playing/paodekuaiTable_new/ani/shunzi/shunzimoh.png");
    anmPic2.setPosition(anmPic.width / 2 - 120, anmPic.height / 2);
    anmPic.addChild(anmPic2, -1);
    anmPic2.runAction(cc.sequence(
        cc.delayTime(0.2 * speed),
        cc.moveBy(0.5 * speed, 120, 0),
        cc.removeSelf()
    ));

    var lvguang = cc.Sprite("playing/paodekuaiTable_new/ani/lvguang.png");
    lvguang.setPosition(anmPic.width / 2, anmPic.height / 2);
    lvguang.setScale(anmPic.width / lvguang.width * 1.5);
    anmPic.addChild(lvguang, -2);

    var star = cc.Sprite("playing/paodekuaiTable_new/ani/shunzi/star/0.png");
    var ac = createAnimation("playing/paodekuaiTable_new/ani/shunzi/star/", 29, cc.rect(0, 0, 254, 107), 0.05 * speed);
    star.runAction(cc.sequence(ac, cc.delayTime(0.05 * speed), cc.removeSelf()));
    star.setPosition(anmPic.width / 2, anmPic.height / 2);
    star.setScale(anmPic.width / star.width * 1.5);
    anmPic.addChild(star, 1);
}

PlayLayer_ruanjiangqianfen.prototype.getAniPos = function (off) {
    var pl = getUIPlayer(off);
    if (!pl) {
        return;
    }
    var pos = this.deskCardsWgetArr[off].getMiddleCardsPos();
    var nodePos = this.deskCardsWgetArr[off].node.convertToWorldSpaceAR(pos);
    return nodePos;
}