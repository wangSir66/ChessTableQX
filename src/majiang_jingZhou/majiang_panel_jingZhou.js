//靖州麻将
var majiang_panel_jingZhou = majiang_panel_shaoyang.extend({
    jsonFile: "Play_MaJiangJingZhou.json",

    getJsBind: function(){
        var jsBind = {
            node_touziNode: {
                _run:function(){
                    this.visible = false;
                    this.setScale(0.5);
                    this.setPosition(cc.p(MjClient.size.width *0.5, MjClient.size.height *0.4));  
                    cc.spriteFrameCache.addSpriteFrames("playing/other/shaizi.plist","playing/other/shaizi.png");
                },
                _event:{
                    MJZhiTouZi:function(data){
                        var touzi1 = this.getChildByName("img_touzi_1");
                        var touzi2 = this.getChildByName("img_touzi_2");
                        touzi2.setScale(this.getScale());
                        var touzi3 = this.getChildByName("img_touzi_3");
                        touzi3.setScale(this.getScale());
                        this.visible = true;
                        touzi1.visible = false;
                        touzi2.visible = false;
                        touzi3.visible = false;
                        var addnewcard = data.addnewcard;
                        var arry = [];
                        for(var i = 1; i < 10; i++){
                            var frame = cc.spriteFrameCache.getSpriteFrame("shaizi_" + i + ".png");
                            if(frame){
                                arry.push(frame);
                            }
                        }
                        var firstFrame = new cc.Sprite();
                        firstFrame.initWithSpriteFrame(arry[0]);
                        firstFrame.setPosition(touzi1.getPosition());
                        firstFrame.setScale(this.getScale());
                        this.addChild(firstFrame);
                        var animate = cc.animate(new cc.Animation(arry, 0.05, 3));
                        var callFunc = cc.callFunc(function(){
                            var randomArr = data.randomArr;
                            touzi2.loadTexture("playing/other/shaizi/" + randomArr[0] + ".png");
                            touzi3.loadTexture("playing/other/shaizi/" + randomArr[1] + ".png");
                            touzi2.setVisible(true);
                            touzi3.setVisible(true);
                            firstFrame.setVisible(false);
                        });
                        var delayAction = cc.delayTime(0.5);
                        var callFunc1 = cc.callFunc(function(){
                            touzi2.setVisible(false);
                            touzi3.setVisible(false);                       
                        });
                        var self = this;
                        var callFunc2 = cc.callFunc(function(){
                            MjClient.playui.showCardsOfKaiGang(self.getParent().getChildByName("img_kaiGangKuang"), addnewcard);
                        });
                        
                        firstFrame.runAction(cc.sequence(animate,callFunc,delayAction,callFunc1,callFunc2,cc.removeSelf()));
                    }
                }
            },
            img_kaiGangKuang: {
                _visible: false,
                _layout: [[0.20, 0.29],[0.5, 0.35],[0, 0.4]],
                _event: {
                    putCardAfterGang: function(data) {
                        var cardNode2 = this.getChildByName("img_card2");
                        var uidIndex = MjClient.playui.getUidIndex(data.uid);
                        var node = MjClient.playui.getUIBind(uidIndex);
                        var msg = {
                                card: data.card,
                                uid: data.uid,
                                isAfterGang: data.afterGang,
                            };

                        if(data.cardIndex == 0){
                            cardNode2.visible = false;
                            MjClient.playui.dealPut(node, msg, true);
                        }

                        if(cardNode2.visible == false){
                            this.visible = false;
                            MjClient.playui.updatePlayerEatBtn();
                            if(data.uid == MjClient.playui.getSelfUid()){
                                postEvent(MjClient.playui.PlayEventType.SHOW_TING_CARDS);
                                MjClient.playui.updateCardColorAfterTing(true);
                            }
                        }
                    },
                    clearCardUI: function() {
                        this.visible = false;
                    },
                    MJGang: function() {
                        this.visible = false;
                    },
                    changeMJBgEvent: function() {
                        MjClient.playui.updateCardsOfKaiGang(this);
                    },
                    switch2Dor3D: function() {
                        MjClient.playui.updateCardsOfKaiGang(this);
                    },
                    initSceneData: function(eD) {
                        MjClient.playui.updateCardsOfKaiGang(this);
                    }
                }
            },
            node_eat: {
                btn_touzi: {
                    _visible: false,
                    _touch: function(sender, eventType) {
                        if (eventType == ccui.Widget.TOUCH_ENDED) {
                            var sData = MjClient.data.sData;
                            var tData = sData.tData;
                            var player = MjClient.data.sData.players[MjClient.playui.getSelfUid() + ""];
                            if (tData.tState == TableState.waitPut && player.mjState == TableState.waitPut && IsTurnToMe()) {
                                MjClient.playui.gangCardArray = MjClient.majiang.canGang1(player.mjpeng, player.mjhand, player.putCount, true);
                            }

                            if (MjClient.playui.gangCardArray.length > 1) {
                                var showCardsNode = MjClient.playui.jsBind.node_eat.node_showCards._node;
                                showCardsNode.getChildByName("img_showCardsBg").showTouCards();
                                return;
                            }
                            
                            if (MjClient.playui.gangCardArray.length > 0) {
                                MjClient.playui.hideEatNodeChildren();
                                MjClient.playui.MJTouZiToServer(MjClient.playui.gangCardArray[0]);
                            }
                        }
                    }
                },
                btn_deng: {
                    _visible: false,
                    _touch: function(sender, eventType){
                        if (eventType == ccui.Widget.TOUCH_ENDED) {
                            var sData = MjClient.data.sData;
                            var tData = sData.tData;
                            // TODO: 处理等按钮的点击事件
                            MjClient.playui.sendPassToServer(true);
                        }
                    }
                },
                btn_ting: {
                    _visible: false,
                    _touch: function(sender, eventType){
                        if(eventType == ccui.Widget.TOUCH_ENDED){
                            MjClient.playui.hideEatNodeChildren();
                            var sData = MjClient.data.sData;
                            var tData = sData.tData;
                            var player = MjClient.playui.getPlayerInfoByName("node_down");

                            if (player.putCount == 0 && player.mjhand.length == 14 && !player.isTing) {
                                MjClient.playui.clickTing = true;
                                this.getParent().getChildByName("btn_cancel").visible = true;
                                MjClient.playui.updateCardColorAfterTing();
                            }
                        }
                    },
                },
                _event:{
                    //拦胡
                    MJGrabHu: function(d){
                        var player = MjClient.playui.getPlayerInfoByName("node_down");
                        if(player.info.uid != d.uid){
                            MjClient.playui.hideEatNodeChildren();
                            return;
                        }
                        
                        MjClient.playui.updatePlayerEatBtn();
                    },
                }
            },
            node_showCards: {
                img_showCardsBg: {
                    showTouCards: function(){
                        this.showCards();
                        this.visible = true;
                        var cardArr = MjClient.playui.gangCardArray;
                        this.updateSize(cardArr.length, 4);
                        var startPos = this.getStartPos(cardArr.length, 4);
                        var templatCard = this.getChildByName("img_card");
                        var self = this;
                        for(var i = 0;i < cardArr.length;i++){
                            for (var j = 0; j < 4; j ++){
                                var card = util.clone(templatCard);
                                card.visible = true;
                                card.setName(MjClient.playui.HandleCardType.Put);
                                card.tag = cardArr[i];
                                var x = startPos.x + j * templatCard.width * templatCard.scale * 0.97;
                                var y = startPos.y + i * templatCard.height * templatCard.scale;
                                card.setPosition(x, y);
                                this.addChild(card);
                                MjClient.playui.updateChiGangCards(card, cardArr[i]);

                                card.addTouchEventListener(function(sender, eventType){
                                    if(eventType == ccui.Widget.TOUCH_BEGAN){
                                        MjClient.playui.hasClickBtn = true;
                                    }
                                    if(eventType == ccui.Widget.TOUCH_CANCELED){
                                        MjClient.playui.hasClickBtn = false;
                                    }
                                    if(eventType == ccui.Widget.TOUCH_ENDED){
                                        MjClient.playui.hideEatNodeChildren();
                                        MjClient.playui.MJTouZiToServer(self.tag);
                                        self.getParent().visible = false;
                                    }
                                }, card);
                            }
                        }
                    }
                }
            },
            node_down:{
                _event:{
                    MJBaoTing: function(eD){
                        MjClient.playui.handleMJTing(eD);     //报听处理
                    },
                    MJPut: function(data) {
                        MjClient.playui.clickTing = false;
                        MjClient.playui.dealPut(this, data);
                        MjClient.playui.updatePlayerEatBtn();
                        if(data.uid == MjClient.playui.getSelfUid()){
                            MjClient.playui.checkHandCards(this);

                            MjClient.playui.checkPutCards(this);
                            MjClient.playui.updateTingTips();
                        }
                        
                        if (MjClient.playui.getPlayerInfoByOff().putCount == 1) {
                            MjClient.playui.updataClickCancelTingBtn(true);
                        }
                    },
                    MJZhiTouZi: function(data){
                        if(data.uid == MjClient.playui.getSelfUid()){
                            MjClient.playui.updateCardColorAfterTing();
                        }
                    }
                }
            }
        };

        return jsBind;
    },

    ctor:function(){
        this._super(majiang_panel_jingZhou, this.jsonFile);
    }
});


//向服务器发送骰子
majiang_panel_jingZhou.prototype.MJTouZiToServer = function(cd){
    if (MjClient.rePlayVideo != -1) {
        return;
    }
    MjClient.gamenet.request("pkroom.handler.tableMsg", {
        cmd: "MJGang",
        card: cd,
        isTouZi: true,
        eatFlag: this.getEatFlag()
    });
};

// @Override 发送过的命令给服务器
majiang_panel_jingZhou.prototype.clickPass = function() {
    var that = this;
    if (that.checkWhenPass()){
        return;
    }
    // 过杠记录存储
    var tData = MjClient.data.sData.tData;
    var roomMsgValue = tData.tableid +":"+tData.roundNum;
    var saveRoomMsgValueG = util.localStorageEncrypt.getStringItem("IGNORE_G_TIP","");
    var player = that.getPlayerInfoByOff(0);
    var hasHu = false;

    if (that.canStartTing(player)) {
        var msg = "你确定过听";
        if (that.isTurnMe() && that.checkGangBtn(player)){
            msg += " 杠";
        }
        msg += "吗?";
        MjClient.showMsg(msg,
            function(){
            that.hideEatNodeChildren();
                MjClient.majiang.MJTingToServer(MjClient.playui.getSelfUid(), false);
            },
            function(){}, "1")
        return;
    }


    if (that.isTurnMe()){
        var canGang = that.checkGangBtn(player);
        var passCallBack = function(){
            if(canGang){
                util.localStorageEncrypt.setStringItem("IGNORE_G_TIP",roomMsgValue);
                that.clickGangPass = true;
            }
            that.hideEatNodeChildren();
            that.tingOrMJPassToServer(hasHu);
        } 

        var msg = "确认过 ";
        if (canGang){
            msg += "杠 ";
        }
        if (player.eatFlag & 8){
            msg += "胡 ";
            hasHu = true;
        }else if(canGang){
            // 只有杠就不弹出确认框了
            if(roomMsgValue == saveRoomMsgValueG){
                passCallBack();
                return;
            } 
        }
        msg += "吗?";
        MjClient.showMsg(msg, function(){
            passCallBack();
        }, function() {}, "1");
    }else{
        if(player.eatFlag & 8){
            MjClient.showMsg("确认不胡吗?", function(){
                that.hideEatNodeChildren();
                that.tingOrMJPassToServer(true);
            }, function() {}, "1");
        }else{
            that.hideEatNodeChildren();
            that.sendPassToServer();
        }
    }
};

/**
 *  处理麻将暗杠
 **/
majiang_panel_jingZhou.prototype.dealAnGang = function(playerNode, msg) {
    var gangCard = msg.card;
    var delCardNum = 4;
    if (msg.isKaiGangAfterSelfAnGang) {
        delCardNum = 3;
    }
    
    if (MjClient.rePlayVideo != -1 || playerNode.getName() == "node_down") {
        this.removeCard(playerNode, this.HandleCardType.Hand, gangCard, delCardNum);
    } else {
        this.removeCard(playerNode, this.HandleCardType.Hand, null, delCardNum);
    }

    for (var i = 0; i < 4; i++) {
        this.createCard(playerNode, this.CsdDefaultCardType.EatCardFront, this.HandleCardType.AnGang, gangCard);
    }

    this.resetCardLayout(playerNode);
    this.showEatActionAnim(playerNode, this.AnimationType.GANG);
};

/**
 *  处理麻将碰杠
 **/
majiang_panel_jingZhou.prototype.dealPengGang = function(playerNode, msg) {
    var gangCard = msg.card;
    
    if (!msg.isKaiGangAfterSelfAnGang) {
        if (MjClient.rePlayVideo != -1 || playerNode.getName() == "node_down") {
            this.removeCard(playerNode, this.HandleCardType.Hand, gangCard);
            this.removeCard(playerNode, this.HandleCardType.Peng, gangCard, 3);
        } else {
            this.removeCard(playerNode, this.HandleCardType.Hand);
            this.removeCard(playerNode, this.HandleCardType.Peng, gangCard, 3);
        }
    }

    for (var i = 0; i < 4; i++) {
        this.createCard(playerNode, this.CsdDefaultCardType.EatCardFront, this.HandleCardType.PengGang, gangCard);
    }

    this.resetCardLayout(playerNode);
    this.showEatActionAnim(playerNode, this.AnimationType.GANG);
};

// @Override
majiang_panel_jingZhou.prototype.dealPut = function(playerNode, msg, isTouZi){
    var tData = MjClient.data.sData.tData;
    var selfUid = this.getSelfUid();
    var player = this.getPlayerInfoByName(playerNode.getName());
    if(this.isFrontFirst() && tData.uids[tData.curPlayer] == selfUid && MjClient.rePlayVideo == -1 && !player.trust && !player.tPutCard && !isTouZi){
        return;
    }

    if((player.trust || player.tPutCard || isTouZi) && tData.uids[tData.curPlayer] == selfUid){
        //自己打出的牌立即播放声音
        if(!MjClient.majiang.isCardFlower(msg.card)) {
            this.playEffect("give");
            this.playEffectInPlay(msg.card);
        }
    }

    if(player.info.uid != msg.uid){
        return;
    }

    if(MjClient.rePlayVideo == -1 && tData.uids[tData.curPlayer] != selfUid && !isTouZi){ //托管的时候，手牌不删
        this.removeCard(playerNode, this.HandleCardType.Hand);
    }else if(!isTouZi){
        this.removeCard(playerNode, this.HandleCardType.Hand, msg.card);
    }
    var cardNode = this.createCard(playerNode, this.CsdDefaultCardType.PutCardOne, this.HandleCardType.Put, msg.card);
    var self = this;
    this.addPutCard(cardNode, function(){
        self.addPutCardTip(cardNode, msg);
    }, true);
    
    this.resetCardLayout(playerNode);
};

// 怀化过的特殊处理
majiang_panel_jingZhou.prototype.tingOrMJPassToServer = function(hasHu){
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var eat = MjClient.playui.jsBind.eat;
    var isAfterTou = false;

    if(this.getSelfUid() == tData.uids[tData.zhuang] && sData.players[tData.uids[tData.zhuang]].isTing){
        isAfterTou = true;
    }

    if(sData.players[tData.uids[tData.zhuang]].putCount == 0 && hasHu && !isAfterTou){
        MjClient.majiang.MJTingToServer(this.getSelfUid(), false);
        this.hideEatNodeChildren();
    }else{
        this.sendPassToServer();
        if (hasHu) {
            MjClient.data.sData.players[this.getSelfUid()].clickPass = true;
        }
    }
};

//Override
majiang_panel_jingZhou.prototype.getPlayerEatNode = function(){
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var player = sData.players[this.getSelfUid()];
    var isQiShou = tData.isFirstPut;
    var eat = MjClient.playui.jsBind.node_eat;
    var nodeArr = [];
    this.gangCardArray = [];

    if (this.canStartTing(player)) {
        nodeArr.push(eat.btn_ting._node);
    }

    if(this.isTurnMe() || isQiShou){
        //骰
        if (player.eatFlag & 16) {
            nodeArr.push(eat.btn_touzi._node);
        }

        //杠
        if(this.checkGangBtn(player) && !this.clickGangPass){
            if(player.isTing && (player.eatFlag & 16) != 16){

            }else{
                nodeArr.push(eat.btn_gang._node);
            }
        }

        //胡
        if (player.eatFlag & 8) {
            nodeArr.push(eat.btn_hu._node);
        }
    }else{
        //等
        if(tData.dengHuPlayers && tData.dengHuPlayers.indexOf(this.getSelfUid()) >= 0 && (player.eatFlag & 8)){
            nodeArr.push(eat.btn_deng._node);
        }

        //骰
        if (player.eatFlag & 16) {
            nodeArr.push(eat.btn_touzi._node);
        }

        if (player.eatFlag & 4 ) {
            nodeArr.push(eat.btn_gang._node);
            this.gangCardArray.push(tData.lastPutCard);
        }

        if (player.eatFlag & 2) {
            nodeArr.push(eat.btn_peng._node);
        }

        if (player.eatFlag & 8) {
            nodeArr.push(eat.btn_hu._node);
        }

        if(player.eatFlag & 1){
            nodeArr.push(eat.btn_chi._node);
            this.eatCardArray = MjClient.majiang.canChi(player.mjhand, tData.lastPutCard, tData.hunCard);
        }
    }

    if(nodeArr.length > 0 && (!tData.areaSelectMode.youHuBiHu || (tData.areaSelectMode.youHuBiHu && (player.eatFlag & 8) != 8))){
        nodeArr.push(eat.btn_guo._node);
    }
    this.reloadBtnTexture(nodeArr);
    return nodeArr;
};

//计算可以听牌的玩家
majiang_panel_jingZhou.prototype.canStartTing = function(player) {
    var tData = MjClient.data.sData.tData;
    if (player.isTing || player.putCount != 0 || player.mjhand.length < 14) {
        return false;
    }

    for (var i = 0; i < player.mjhand.length; i++) {
        var cardsAfterPut = player.mjhand.slice();
        cardsAfterPut.splice(i,1);
        var tingSetDict = MjClient.majiang.calTingSet(cardsAfterPut, tData.hunCard, true);
        if (Object.keys(tingSetDict).length > 0) {
            return true;
        }
    }
    
    return false;
};

 // @Override
 majiang_panel_jingZhou.prototype.getCardFacePositon2D = function(mjBgType, cardNode){
    var cardTypeName = cardNode.getName();
    cardTypeName = cardTypeName === undefined ? this.HandleCardType.Hand : cardTypeName;
    if(MjClient.rePlayVideo != -1 && cardNode.getParent() && cardNode.getParent().getName() == "node_top" && cardTypeName == this.HandleCardType.Hand){
        cardTypeName = this.HandleCardType.Put;
    }
    var offSets = this.getHandCardFacePosition2D(mjBgType);
    switch(cardTypeName){
        case this.HandleCardType.Hand:
            offSets = this.getHandCardFacePosition2D(mjBgType);
            break;
        case this.HandleCardType.Chi:
        case this.HandleCardType.Peng:
        case this.HandleCardType.AnGang:
        case this.HandleCardType.MingGang:
        case this.HandleCardType.PengGang:
        case this.HandleCardType.Put:
        case "img_card1":
        case "img_card2":
        case "img_card3":
            offSets = this.getPutCardFacePosition2D(mjBgType);
            break;
    }
    return offSets;
};

// @Override
majiang_panel_jingZhou.prototype.getCardFacePositon3D = function(mjBgType, cardTypeName){
    cardTypeName = cardTypeName === undefined ? this.HandleCardType.Hand : cardTypeName;
    var offSets = this.getHandCardFacePosition3D(mjBgType);
    switch(cardTypeName){
        case this.HandleCardType.Hand:
            offSets = this.getHandCardFacePosition3D(mjBgType);
            break;
        case this.HandleCardType.Chi:
        case this.HandleCardType.Peng:
        case this.HandleCardType.AnGang:
        case this.HandleCardType.MingGang:
        case this.HandleCardType.PengGang:
        case this.HandleCardType.Put:
        case "img_card1":
        case "img_card2":
        case "img_card3":
            offSets = this.getPutCardFacePosition3D(mjBgType);
            break;
    }
    return offSets;
};

// 展示杠开牌
majiang_panel_jingZhou.prototype.showCardsOfKaiGang = function(kaiGangNode, addnewcard) {
    if (addnewcard && addnewcard.length != 0) {
        kaiGangNode.setVisible(true);
        for (var i = 1; i <= 3; i++) {
            var cardNode = kaiGangNode.getChildByName("img_card" + i);
            cardNode.setVisible(false);

            if (i == 2) {
                cardNode.setTag(addnewcard[0]);
                cardNode.setVisible(true);
                MjClient.playui.setCardSprite(cardNode, addnewcard[0], true);
            }
        }

        MjClient.playui.updatePlayerEatBtn();
    }
};

// 更新杠开牌
majiang_panel_jingZhou.prototype.updateCardsOfKaiGang = function(kaiGangNode) {
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var player = sData.players[this.getSelfUid()];
    var curPl = sData.players[tData.uids[tData.curPlayer]];
    if(tData.tState === TableState.roundFinish && player.mjState === TableState.isReady || curPl && curPl.eatFlag == 0){
        return ;
    }

    if(tData.gangAddCard && tData.gangAddCard.length != 0){
        this.showCardsOfKaiGang(kaiGangNode, tData.gangAddCard);
    }
};

//Override 中鸟的内容  
majiang_panel_jingZhou.prototype.getIsZhongBird = function(cd){
    var tData = MjClient.data.sData.tData;
    var uidIdx = tData.uids.indexOf(this.getSelfUid())
    if(tData.areaSelectMode.zhongNiao == 0){//不抓鸟
        return false;
    }else if(tData.areaSelectMode.zhongNiao == 1){//庄家159鸟
        if(tData.maxPlayer == 4){
            if(uidIdx == tData.zhuang){
                return cd < 30 && (cd % 10 == 1 || cd % 10 == 5 || cd % 10 == 9);
            }else if(uidIdx == ((tData.zhuang + 1 + tData.maxPlayer) % tData.maxPlayer)){
                return cd < 30 && (cd % 10 == 2 || cd % 10 == 6); 
            }else if(uidIdx == ((tData.zhuang + 2 + tData.maxPlayer) % tData.maxPlayer)){
                return cd < 30 && (cd % 10 == 3 || cd % 10 == 7); 
            }else if(uidIdx == ((tData.zhuang + 3 + tData.maxPlayer) % tData.maxPlayer)){
                return cd < 30 && (cd % 10 == 4 || cd % 10 == 8); 
            }
        }else if(tData.maxPlayer == 3){
            if(uidIdx == tData.zhuang){
                return cd < 30 && (cd % 10 == 1 || cd % 10 == 5 || cd % 10 == 9);
            }else if(uidIdx == ((tData.zhuang + 1 + tData.maxPlayer) % tData.maxPlayer)){
                return cd < 30 && (cd % 10 == 2 || cd % 10 == 6); 
            }else if(uidIdx == ((tData.zhuang + 2 + tData.maxPlayer) % tData.maxPlayer)){
                return cd < 30 && (cd % 10 == 4 || cd % 10 == 8); 
            }
        }else if(tData.maxPlayer == 2){
            if(uidIdx == tData.zhuang){
                return cd < 30 && (cd % 10 == 1 || cd % 10 == 5 || cd % 10 == 9);
            }else if(uidIdx == ((tData.zhuang + 1 + tData.maxPlayer) % tData.maxPlayer)){
                return cd < 30 && (cd % 10 == 3 || cd % 10 == 7); 
            }
        }
    }else if(tData.areaSelectMode.zhongNiao == 2){//159鸟
        return  cd < 30 && (cd % 10 == 1 || cd % 10 == 5 || cd % 10 == 9);
    }
    return false;
};

//Override
majiang_panel_jingZhou.prototype.createEndOnePanel = function(){
    return new majiang_winGamePanel_jingZhou();
};

//Override 是否显示飘分
majiang_panel_jingZhou.prototype.isShowPiao = function(){
	return false;
};

//Override 是否显示飘的文字部分
majiang_panel_jingZhou.prototype.isShowTextPiao = function(){
    return false;
};

//Override
majiang_panel_jingZhou.prototype.sendPassToServer = function(isDengHu){
    if (MjClient.rePlayVideo != -1) {
    	return;
    }

    isDengHu = typeof(isDengHu) == "undefined" ? false : isDengHu;

    var tData = MjClient.data.sData.tData;
    var sendMsg = {
    	cmd: "MJPass",
    	eatFlag: this.getEatFlag(),
        cardNext: tData.cardNext,
        isDengHu: isDengHu
    };

    MjClient.gamenet.request("pkroom.handler.tableMsg", sendMsg);
};

//处理听牌
majiang_panel_jingZhou.prototype.handleMJTing = function(msg) {
    if (msg.tingStatus != 1) {
        return;
    }

    var tData = MjClient.data.sData.tData;
    var off = this.getOffIndexWithSelf(msg.uid);
    var playerNode = this.getNodeByOff(off);
    MjClient.playui.handleCommand(playerNode, msg, MjClient.playui.AnimationType.TING);
    playerNode.getChildByName("layout_head").getChildByName("img_tingIcon").visible = true;

    if(msg.uid == MjClient.playui.getSelfUid()){
        MjClient.playui.updateCardColorAfterTing();
        playerNode.getChildByName("img_tingCards").setTingCards();
    }
}

//Override
majiang_panel_jingZhou.prototype.isCanAutoPut = function(){
    return false;
};

//Override
majiang_panel_jingZhou.prototype.updatePlayerEatBtn = function(){
    this.hideEatNodeChildren();

    var sData = MjClient.data.sData;
    var player = sData.players[MjClient.playui.getSelfUid()];

        if(!this.isTurnMe() && player.mjState !== TableState.waitEat){
        return;
    }

    var eatNodeArr = this.getPlayerEatNode();
    var pct = this.isIPad() ? 0.15 : 0.194;
    var pos = this.isIPad() ? 0.85 : 0.8;
    var space = this.isIPad() ? 0.88 : 1;
    var off_y = this.isIPad() ? 1.4 : 1.62;
    
    for(var i = 0;i < eatNodeArr.length;i++){
        var btn = eatNodeArr[i];
        btn.visible = true;
        setWgtLayout(btn, [0, pct], [pos, 0], [(i - eatNodeArr.length + 1) * space, off_y], false, false);
    }
    MjClient.playui.addLightAniEatBtns(); // 设置麻将的吃碰杠按钮特效
    this.checkBtnWithPlayerFlag();
};