/***
 * 安化七王麻将，新框架牌桌逻辑
 * @type {void | Class | *}
 */

var majiang_panel_anHuaQiWang;
(function() {
    majiang_panel_anHuaQiWang = majiang_panel_yueyang.extend({
        getJsBind: function(){
            var jsBind = {
                node_down:{
                    layout_head: {
                        img_tingIcon: {
                            initSceneData: function(){
                                this.visible = false;
                            },
                        }
                    }
                },
                node_right:{
                    layout_head: {
                        img_tingIcon: {
                            initSceneData: function(){
                                this.visible = false;
                            },
                        }
                    }
                },
                node_top:{
                    layout_head: {
                        img_tingIcon: {
                            initSceneData: function(){
                                this.visible = false;
                            },
                        }
                    }
                },
                node_left:{
                    layout_head: {
                        img_tingIcon: {
                            initSceneData: function(){
                                this.visible = false;
                            },
                        }
                    }
                },
                layout_roundInfo2D: {
                    layout_hunPai: {
                        _layout: [[0.12, 0.12], [0.621, 0.55], [0, 0]],
                        _visible: false,
                        img_hunBg: {
                            img_light: {
                                _run: function(){
                                    this.runAction(cc.sequence(cc.fadeOut(1), cc.fadeIn(0.5)).repeatForever());
                                }
                            }
                        },
                        img_hunBg2: {
                            img_light: {
                                _run: function(){
                                    this.runAction(cc.sequence(cc.fadeOut(1), cc.fadeIn(0.5)).repeatForever());
                                }
                            }
                        },
                        img_hunCard: {
                            _run: function(){
                                this.getParent().visible = MjClient.playui.isInGame();
                            },
                            _event: {
                                clearCardUI: function() {
                                    this.cardAction();
                                },
                                mjhand: function(){
                                    this.cardAction();
                                },
                                initSceneData: function(){
                                    this.cardAction();
                                },
                                changeMJBgEvent: function() {
                                    this.cardAction();
                                },
                                switch2Dor3D: function() {
                                    this.cardAction();
                                }
                            },
                            cardAction: function(){
                                this.getParent().visible = false;
                                var showCard = MjClient.data.sData.tData.showCard;
                                if (!showCard || showCard <= 0 || !MjClient.playui.isInGame()){
                                    return;
                                }
                                this.getParent().visible = true;
                                this.tag = parseInt(showCard);
                                MjClient.playui.setCardSprite(this, parseInt(showCard), true);
                                var type = "laizi";
                                if(MjClient.data.sData.tData.areaSelectMode.kingNum == 4){
                                    type = "fan";
                                } 
                                MjClient.playui.addFlagIcon2D(this, type);
                            }
                        },
                        img_hunCard2: {
                            _run: function(){
                                this.getParent().visible = MjClient.playui.isInGame();
                            },
                            _event: {
                                clearCardUI: function() {
                                    this.cardAction();
                                },
                                mjhand: function(){
                                    this.cardAction();
                                },
                                initSceneData: function(){
                                    this.cardAction();
                                },
                                changeMJBgEvent: function() {
                                    this.cardAction();
                                },
                                switch2Dor3D: function() {
                                    this.cardAction();
                                }
                            },
                            cardAction: function(){
                                this.getParent().visible = false;
                                var hunCard = MjClient.playui.getHunCard();
                                if(typeof(hunCard) == "object"){
                                    hunCard = hunCard[1];
                                }

                                if (!hunCard || hunCard <= 0 || !MjClient.playui.isInGame()){
                                    return;
                                }
                                this.getParent().visible = true;
                                this.tag = parseInt(hunCard);
                                MjClient.playui.setCardSprite(this, parseInt(hunCard), true);
                                MjClient.playui.addFlagIcon2D(this, "laizi");
                            }
                        }
                    }
                },
                img_roomInfo3D: {
                    img_hunpaiBg: {
                        _run: function() {
                            this.visible = false;
                        },
                        _event: {
                            clearCardUI: function() {
                                this.visible = false;
                            },
                            initSceneData: function() {
                                this.setBaiDaCard3D();
                            },
                            mjhand: function() {
                                this.setBaiDaCard3D();
                            },
                            changeMJBgEvent: function() {
                                this.setBaiDaCard3D();
                            },
                            switch2Dor3D: function() {
                                this.setBaiDaCard3D();
                            }
                        },
                        setBaiDaCard3D: function() {
                            var isShowHunCard = MjClient.playui.isHunCardShow3D();
                            var showCard = MjClient.data.sData.tData.showCard;
                            if (!showCard || !isShowHunCard || showCard <= 0) {
                                this.visible = false;
                                return;
                            }

                            this.visible = true;
                            var hunCardNode = this.getChildByName("img_hunCard");
                            hunCardNode.tag = parseInt(showCard);
                            MjClient.playui.setCardSprite(hunCardNode, showCard, true);
                            var type = "laizi";
                            if(MjClient.data.sData.tData.areaSelectMode.kingNum == 4){
                                type = "fan";
                            } 
                            MjClient.playui.addFlagIcon3D(hunCardNode, type);
                        }
                    },
                    img_hunpaiBg2: {
                        _run: function() {
                            this.visible = false;
                        },
                        _event: {
                            clearCardUI: function() {
                                this.visible = false;
                            },
                            initSceneData: function() {
                                this.setBaiDaCard3D();
                            },
                            mjhand: function() {
                                this.setBaiDaCard3D();
                            },
                            changeMJBgEvent: function() {
                                this.setBaiDaCard3D();
                            },
                            switch2Dor3D: function() {
                                this.setBaiDaCard3D();
                            }
                        },
                        setBaiDaCard3D: function() {
                            var isShowHunCard = MjClient.playui.isHunCardShow3D();
                            var hunCard = MjClient.playui.getHunCard();
                            if(typeof(hunCard) == "object"){
                                hunCard = hunCard[1];
                            }

                            if (!hunCard || !isShowHunCard || hunCard <= 0) {
                                this.visible = false;
                                return;
                            }

                            this.visible = true;
                            var hunCardNode = this.getChildByName("img_hunCard");
                            hunCardNode.tag = parseInt(hunCard);
                            MjClient.playui.setCardSprite(hunCardNode, hunCard, true); 
                            MjClient.playui.addFlagIcon3D(hunCardNode, "laizi");
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
                            var cardNode1 = this.getChildByName("img_card1");
                            var cardNode2 = this.getChildByName("img_card2");
                            var cardNode3 = this.getChildByName("img_card3");
                            var uidIndex = MjClient.playui.getUidIndex(data.uid);
                            var node = MjClient.playui.getUIBind(uidIndex);
                            var msg = {
                                    card: data.card,
                                    uid: data.uid,
                                    isAfterGang: data.afterGang,
                                };

                            if(data.cardIndex == 0){
                                cardNode1.visible = false;
                                MjClient.playui.dealPut(node, msg, true);
                            }

                            if(data.cardIndex == 1){
                                cardNode2.visible = false;
                                MjClient.playui.dealPut(node, msg, true);

                            }

                            if(data.cardIndex == 2){
                                cardNode3.visible = false;
                                MjClient.playui.dealPut(node, msg, true);
                            }

                            if(cardNode1.visible == cardNode2.visible && cardNode2.visible == cardNode3.visible && cardNode3.visible == false){
                                this.visible = false;
                                MjClient.playui.updatePlayerEatBtn();
                                if(data.uid == MjClient.playui.getSelfUid()){
                                    postEvent(MjClient.playui.PlayEventType.SHOW_TING_CARDS);
                                    MjClient.playui.updateCardColorAfterTing(true, true);
                                }
                            }
                        },
                        clearCardUI: function() {
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
                }
            };
            return jsBind;
        },
        ctor: function() {
            this._super(majiang_panel_anHuaQiWang, "Play_anHuaQiWang_new.json");
            return true;
        },
        // @Override 显示小结算
        createEndOnePanel: function(){
            return new majiang_winGamePanel_anHuaQiWang();
        }
    });
    
    // 大结算信息
    majiang_panel_anHuaQiWang.prototype.getEndallStatisticsName = function(cardTag, isLoop){
        return ["zimoTotal", "dianpaoTotal", "angangTotal", "minggangTotal"];
    }

    // 大结算信息
    majiang_panel_anHuaQiWang.prototype.getEndallStatisticsKey = function(cardTag, isLoop){
        return ["自摸次数", "点炮次数", "暗杠次数", "明杠次数"];
    }

    // 小结算中鸟
    majiang_panel_anHuaQiWang.prototype.getIsZhongBird = function(card){
        var tData = MjClient.data.sData.tData;
        if (tData.areaSelectMode.zhongNiaoType == 1 && (card <= 29 && card % 10 == 1 || card % 10 == 5 || card % 10 == 9)) {
            return true;
        } else if (tData.areaSelectMode.zhongNiaoType == 0 && (card % 10 % tData.maxPlayer == 1)) {
            return true;
        }

        return false;
    }

    /**
     *  播放音效
     **/
    majiang_panel_anHuaQiWang.prototype.playEffectInPlay = function(cardTag, isLoop){
        var origSounds = GameSound4Play["normal"][cardTag.toString()];
        var sounds = origSounds.concat();
        var sData = MjClient.data.sData;
        var tData = sData.tData;
        var player = sData.players[tData.uids[tData.curPlayer]];
        if (!player){
            player = sData.players[this.getSelfUid()];
        }

        
        for (var i = 0; i < sounds.length; i++){
            var resetPath = sounds[i];
            if (this.getVoiceType() == 1) {
                resetPath = resetPath.replace("normal", "local_anhua");
            }

            if (player && player.info.sex == 1){
                resetPath = resetPath.replace("/nv/", "/nan/");
            }

            var fullFilePath = "sound/" + resetPath + ".mp3";
            if (jsb.fileUtils.isFileExist(fullFilePath)){
                sounds[i] = resetPath;
            }
        }

        var randomIndex = Math.floor(Math.random() * sounds.length);
        var soundFile = sounds[randomIndex];
        if(!jsb.fileUtils.isFileExist("sound/" + soundFile + "" + ".mp3")){
            soundFile = sounds[0];
        }
        var str = "sound/"+soundFile+".mp3";
        return this.reallyPlayEffect(str, isLoop);
    };

    // @Override
    majiang_panel_anHuaQiWang.prototype.getCardFacePositon2D = function(mjBgType, cardNode){
        var cardTypeName = cardNode.getName();
        cardTypeName = cardTypeName === undefined ? this.HandleCardType.Hand : cardTypeName;
        if(MjClient.rePlayVideo != -1 && cardNode.getParent().getName() == "node_top" && cardTypeName == this.HandleCardType.Hand){
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
    majiang_panel_anHuaQiWang.prototype.getCardFacePositon3D = function(mjBgType, cardTypeName){
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

    // @Override
    majiang_panel_anHuaQiWang.prototype.getLaiZiIcon2D = function(){
        var laiZiNode = new ccui.ImageView();
        laiZiNode.setName("laiZi");
        laiZiNode.loadTexture("playing/MJ/wangzi.png");
        return laiZiNode;
    };

    // 获得翻或者癞子的标识
    majiang_panel_anHuaQiWang.prototype.getFlagIcon = function(type) {
        var flagNode = new ccui.ImageView();
        flagNode.setName("flag");
        if (type == "fan") {
            flagNode.loadTexture("playing/MJ/fan.png");
        } else {
            flagNode.loadTexture("playing/MJ/wangzi.png");
        }
        return flagNode;
    }

    // 添加翻或者癞子的标识2d
    majiang_panel_anHuaQiWang.prototype.addFlagIcon2D = function(cardNode, type){
        if (cardNode.getChildByName("laiZi")) {
            cardNode.getChildByName("laiZi").removeFromParent();
        }

        var flagNode = this.getFlagIcon(type);
        var mjBgType = this.getMaJiangBgType();
        var posY = (mjBgType < 2 ? 0.47 : 0.52) * cardNode.height;
        flagNode.setPosition(0.6 * cardNode.width, posY);
        cardNode.addChild(flagNode);
    };

    // 添加翻或者癞子的标识3d
    majiang_panel_anHuaQiWang.prototype.addFlagIcon3D = function(cardNode, type){
        if (cardNode.getChildByName("laiZi")) {
            cardNode.getChildByName("laiZi").removeFromParent();
        }

        var flagNode = this.getFlagIcon(type);
        flagNode.setPosition(0.6 * cardNode.width, 0.54 * cardNode.height);
        cardNode.addChild(flagNode);
    };

    // 展示杠开牌
    majiang_panel_anHuaQiWang.prototype.showCardsOfKaiGang = function(kaiGangNode, addnewcard) {
        if (addnewcard && addnewcard.length != 0) {
            kaiGangNode.setVisible(true);
            for (var i = 1; i <= addnewcard.length; i++) {
                var cardNode = kaiGangNode.getChildByName("img_card" + i);
                cardNode.setVisible(true);

                if (addnewcard[i - 1]) {
                    cardNode.setTag(addnewcard[i - 1]);
                    MjClient.playui.setCardSprite(cardNode, addnewcard[i - 1], true);
                }
            }

            MjClient.playui.updatePlayerEatBtn();
        }
    };

    // 更新杠开牌
    majiang_panel_anHuaQiWang.prototype.updateCardsOfKaiGang = function(kaiGangNode) {
        var sData = MjClient.data.sData;
        var tData = sData.tData;
        var player = sData.players[SelfUid()];
        var curPl = sData.players[tData.uids[tData.curPlayer]];
        if(tData.tState === TableState.roundFinish && player.mjState === TableState.isReady || curPl && curPl.eatFlag == 0){
            return ;
        }

        if(tData.gangAddCard && tData.gangAddCard.length != 0){
            this.showCardsOfKaiGang(kaiGangNode, tData.gangAddCard);
        }
    };

    // @Override
    majiang_panel_anHuaQiWang.prototype.dealPut = function(playerNode, msg, isTouZi){
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
    majiang_panel_anHuaQiWang.prototype.updateCardColorAfterTing = function(isInitScene, isKaiGang){
        var player = this.getPlayerInfoByOff();
        var playerNode = this.getNodeByOff();
        var color = cc.color(190, 190, 190);
        var standNode = playerNode.getChildByName(this.CsdDefaultCardType.HandCard);
        var children = playerNode.children;
        if(player.isTing){
            for(let i = 0;i < children.length;i++){
                var cardNode = children[i];
                if(cardNode.name === this.HandleCardType.Hand){
                    if(this.newCardNode && this.newCardNode == cardNode && !isKaiGang){
                       continue;
                    }
                    cardNode.isGray = true;
                    cardNode.setColor(color);
                    cardNode.addTouchEventListener(function () {});
                    cardNode.y = standNode.y;
                }
            }
            return;
        }
    };

    //Override
    majiang_panel_anHuaQiWang.prototype.checkWhenTouchBegan = function(cardNode){
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
            MjClient.showToast("王牌不可出");
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
    majiang_panel_anHuaQiWang.prototype.getPlayerEatNode = function() {
        var sData = MjClient.data.sData;
        var tData = sData.tData;
        var player = sData.players[this.getSelfUid()];
        var eat = MjClient.playui.jsBind.node_eat;
        var nodeArr = [];
        this.gangCardArray = [];
        if(this.isTurnMe()){
            //杠
            if(this.checkGangBtn(player) && !this.clickGangPass){
                nodeArr.push(eat.btn_gang._node);
            }

            //胡
            if (player.eatFlag & 8) {
                nodeArr.push(eat.btn_hu._node);
            }
        }else{
            if (player.eatFlag & 4 ) {
                nodeArr.push(eat.btn_gang._node);
                this.gangCardArray.push(tData.lastPutCard);
            }
            if (player.eatFlag & 8) {
                nodeArr.push(eat.btn_hu._node);
            }
            if (player.eatFlag & 2) {
                nodeArr.push(eat.btn_peng._node);
            }
            if (player.eatFlag & 1){
                nodeArr.push(eat.btn_chi._node);
                this.eatCardArray = MjClient.majiang.canChi(player.mjhand, tData.lastPutCard, tData.hunCard);
            }
        }

        //检测死手
        var isSiShou = this.isTurnMe();
        for(var mjhandIndex in player.mjhand){
            if(!MjClient.majiang.isHunCard(player.mjhand[mjhandIndex], tData.hunCard)){
                isSiShou = false;
                break ;
            }
        }
        if(this.isTurnMe() && MjClient.majiang.isHunCard(player.newCd, tData.hunCard) && player.isTing){
            isSiShou = true;
        }

        if(nodeArr.length > 0 && !isSiShou){
            nodeArr.push(eat.btn_guo._node);
        }
        this.reloadBtnTexture(nodeArr);
        return nodeArr;
    };
}());