//邵阳怀化麻将
var majiang_panel_huaihuaMaJiang;
(function() {
    majiang_panel_huaihuaMaJiang = majiang_panel_shaoyang.extend({
        getJsBind: function(){
            var jsBind = {
                huWait: {
                    _visible: false,
                    _run: function() {
                        this.ignoreContentAdaptWithSize(true);
                    },
                    _layout: [[0.3, 0.3],[0.5, 0.37],[0, 0]],
                    _event: {
                        MJCanBaoTing: function(){
                            cc.log("------------HHHHH: MJCanBaoTing-----------");
                            MjClient.playui.EatVisibleCheck();
                            var sData = MjClient.data.sData;
                            var tData = sData.tData;
                            if(MjClient.playui.getSelfUid() != tData.uids[tData.zhuang]){
                                return ;
                            }

                            for (var uid in sData.players) {
                                if(MjClient.playui.getSelfUid() == uid) continue;
                                var player = sData.players[uid];
                                if (player.tingStatus == 2) {
                                    this.visible = true;
                                    break ;
                                }
                            }
                        },
                        MJBaoTing: function(){
                            var sData = MjClient.data.sData;
                            var tData = sData.tData;
                            if(MjClient.playui.getSelfUid() != tData.uids[tData.zhuang]){
                                return ;
                            }

                            if(tData.canBaotingNum == 0){
                                this.visible = false;
                            }
                        },
                        initSceneData: function(){
                            this.visible = false;
                            var sData = MjClient.data.sData;
                            var tData = sData.tData;
                            if(MjClient.playui.getSelfUid() != tData.uids[tData.zhuang]){
                                return ;
                            }
                            if(tData.tState == TableState.waitPut && tData.canBaotingNum != 0){
                                this.visible = true;
                            }
                        },
                        clearCardUI: function(eD) {
                            this.visible = false;
                        },
                        MJHu: function(eD) {
                            this.visible = false;
                        },
                        MJGang: function(eD) {
                            var sData = MjClient.data.sData;
                            var tData = sData.tData;
                            if(tData.canBaotingNum == 0){
                                this.visible = false;
                            }
                        },
                        roundEnd: function(){
                            this.visible = false;
                        }
                    }
                },
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
                    }
                }
            };
            return jsBind;
        },
        ctor: function() {
            this._super(majiang_panel_huaihuaMaJiang, "Play_MaJiangHuaiHua.json");
            return true;
        },
        
        // @Override 显示大结算
        createGameOverPanel: function(){
            return new majiang_gameOver_huaihuaMaJiang();
        },
    });

    // 是否可以自动摸打
    majiang_panel_huaihuaMaJiang.prototype.isCanAutoPut = function(){
        return false;
    };

    //向服务器发送骰子
    majiang_panel_huaihuaMaJiang.prototype.MJTouZiToServer = function(cd)
    {
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
    majiang_panel_huaihuaMaJiang.prototype.clickPass = function() {
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

    // 怀化过的特殊处理
    majiang_panel_huaihuaMaJiang.prototype.tingOrMJPassToServer = function(hasHu){
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

    /**
     *  刷新玩家操作按钮
     **/
    majiang_panel_huaihuaMaJiang.prototype.updatePlayerEatBtn = function(){
        this.hideEatNodeChildren();
        
        var sData = MjClient.data.sData;
        var tData = sData.tData;
        var player = sData.players[this.getSelfUid()];
        var isQiShou = tData.isFirstPut;

        if(!this.isTurnMe() && player.mjState != TableState.waitEat && !isQiShou){
            return;
        }

        var eatNodeArr = this.getPlayerEatNode();
        var btnScale = this.isIPad() ? 0.12 : 0.18;
        // var spaceScale = this.isIPad() ? 1.4 : 1.5;
        var off_y = this.isIPad() ? 1.7 : 2.0;

        var bigWidth = 0;
        for(var i = 0;i < eatNodeArr.length;i++){ 
            var eatBtn = eatNodeArr[i];
            if(eatBtn.width * btnScale > bigWidth){
                bigWidth = eatBtn.width * btnScale;
            }
        }
        
        var space = MjClient.size.width / 10;
        var totalSpace = (eatNodeArr.length - 1) * space;
        var totaWidth = bigWidth * eatNodeArr.length + totalSpace;
        var firstPos_x = (MjClient.size.width - totaWidth) / 2;
        for(var k = 0;k < eatNodeArr.length;k++){
            var btn = eatNodeArr[k];
            btn.visible = true;
            var pct = (firstPos_x + k * (space + bigWidth)) / MjClient.size.width;
            setWgtLayout(btn, [0, btnScale], [pct, 0], [0, off_y], false, false);
        }
        MjClient.playui.addLightAniEatBtns(); // 设置麻将的吃碰杠按钮特效
        this.checkBtnWithPlayerFlag();
    };

    //Override
    majiang_panel_huaihuaMaJiang.prototype.checkWhenTouchBegan = function(cardNode){
        if(MjClient.movingCard !== null && MjClient.movingCard != cardNode){
            return true;
        } 

        var handCount = this.getCardNodeCountByName(cardNode.getParent(), this.HandleCardType.Hand);
        if(!(handCount % 3 == 2 && this.isTurnMe() || handCount % 3 == 1 && !this.isTurnMe())){
            return true;
        }

        var sData = MjClient.data.sData;
        var tData = sData.tData;

        if(MjClient.majiang.isHunCard(cardNode.tag, tData.hunCard)) {
            MjClient.showToast("癞子牌不可出");
            return true;
        }

        // 自动摸打
        var player = MjClient.playui.getPlayerInfoByName("node_down");
        if (player.tPutCard && this.isTurnMe()) {
            if (!MjClient.Scene.ToastNodeArray || MjClient.Scene.ToastNodeArray.length == 0) {
                MjClient.showToast("出牌请先取消自动摸打");
            }
            return true;
        }

        return false;
    };

    //Override
    majiang_panel_huaihuaMaJiang.prototype.getPlayerEatNode = function() {
        var sData = MjClient.data.sData;
        var tData = sData.tData;
        var player = sData.players[this.getSelfUid()];
        var isQiShou = tData.isFirstPut;
        var eat = MjClient.playui.jsBind.node_eat;
        var nodeArr = [];
        this.gangCardArray = [];
        if (!(tData.tState == TableState.waitPut && player.mjState == TableState.waitPut) && isQiShou) {
            return nodeArr;
        }

        if(this.isTurnMe() || isQiShou){
            //骰
            if (player.eatFlag & 16) {
                nodeArr.push(eat.btn_touzi._node);
            }

            //杠
            if(this.checkGangBtn(player) && !this.clickGangPass){
                if(player.isTing && (player.eatFlag & 16) != 16 && !tData.areaSelectMode.touhougang){

                }else{
                    nodeArr.push(eat.btn_gang._node);
                }
            }

            //胡
            if (player.eatFlag & 8) {
                nodeArr.push(eat.btn_hu._node);
            }
        }else{
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
        }

        //检测死手
        var canPass = true;
        if (this.isTurnMe()) {
            canPass = !(player.newCd == 71 && player.isTing) && !(tData.gangAddCard && tData.gangAddCard.length != 0 && tData.gangAddCard[0] == 71)
        }

        if(nodeArr.length > 0 && canPass){
            nodeArr.push(eat.btn_guo._node);
        }
        this.reloadBtnTexture(nodeArr);
        return nodeArr;
    };

    // @Override
    majiang_panel_huaihuaMaJiang.prototype.dealPut = function(playerNode, msg, isTouZi){
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

    // @Override
    majiang_panel_huaihuaMaJiang.prototype.getCardFacePositon2D = function(mjBgType, cardNode){
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
    majiang_panel_huaihuaMaJiang.prototype.getCardFacePositon3D = function(mjBgType, cardTypeName){
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
    majiang_panel_huaihuaMaJiang.prototype.showCardsOfKaiGang = function(kaiGangNode, addnewcard) {
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
    majiang_panel_huaihuaMaJiang.prototype.updateCardsOfKaiGang = function(kaiGangNode) {
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
}());