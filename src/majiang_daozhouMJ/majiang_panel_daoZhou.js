//邵阳道州麻将
var majiang_panel_daoZhou;
(function() {
    majiang_panel_daoZhou = majiang_panel_shaoyang.extend({
        getJsBind: function(){
            var jsBind = {
                node_down: {
                    layout_head:{
                        text_piao: {
                            updatePiaoContent:function(msg) {
                                MjClient.playui.showPiaoText(this, "node_down");
                            }
                        }
                    },
                    _event: {
                        MJWangZhua: function(msg){
                            MjClient.playui.dealWangZhua(this, msg);
                        }
                    }
                },
                node_right: {
                    layout_head:{
                        text_piao: {
                            updatePiaoContent:function(msg) {
                                MjClient.playui.showPiaoText(this, "node_right");
                            }
                        }
                    },
                    _event: {
                        MJWangZhua: function(msg){
                            MjClient.playui.dealWangZhua(this, msg);
                        }
                    }
                },
                node_top: {
                    layout_head:{
                        text_piao: {
                            updatePiaoContent:function(msg) {
                                MjClient.playui.showPiaoText(this, "node_top");
                            }
                        }
                    },
                    _event: {
                        MJWangZhua: function(msg){
                            MjClient.playui.dealWangZhua(this, msg);
                        }
                    }
                },
                node_left: {
                    layout_head:{
                        text_piao: {
                            updatePiaoContent:function(msg) {
                                MjClient.playui.showPiaoText(this, "node_left");
                            }
                        }
                    },
                    _event: {
                        MJWangZhua: function(msg){
                            MjClient.playui.dealWangZhua(this, msg);
                        }
                    }
                },
                img_roomInfo2D: {
                    node_hunPai: {
                        img_showCard: {
                            _event: {
                                mjhand: function(){
                                    this.visible = false;
                                    var shanGunCard = MjClient.majiang.getShanGunCard(parseInt(MjClient.data.sData.tData.hunCard));
                                    if (shanGunCard <= 0 || !MjClient.playui.isInGame()){
                                        return;
                                    }

                                    var screenCenter = cc.p(cc.winSize.width * 4 / 10, cc.winSize.height / 2);
                                    var originScale = this.getScale();
                                    this.setPosition(this.getParent().convertToNodeSpace(screenCenter));
                                    this.setScale(1.2);
                                    this.tag = parseInt(shanGunCard);
                                    MjClient.playui.setCardSprite(this, parseInt(shanGunCard), true);

                                    this.visible = true;
                                    this.runAction(cc.sequence(
                                        cc.delayTime(1),
                                        cc.fadeTo(0.6, 0.01),
                                        cc.callFunc(function(){
                                            this.visible = false;
                                        }.bind(this)),
                                        cc.fadeIn(0.1),
                                        cc.callFunc(function(){
                                            this.setScale(originScale);
                                        }.bind(this))
                                    ));
                                }
                            }
                        },
                        img_hunCard: {
                            _event: {
                                mjhand: function(){
                                    this.cardAction(true);
                                },
                                initSceneData: function(){
                                    this.cardAction();
                                },
                                roundEnd:function (eD) {
                                    this.visible = false;
                                }
                            },
                            cardAction: function(isMjhand){
                                this.visible = false;
                                var hunCard = parseInt(MjClient.data.sData.tData.hunCard);
                                if (hunCard <= 0 || !MjClient.playui.isInGame()){
                                    return;
                                }

                                this.visible = true;
                                this.tag = parseInt(hunCard);
                                MjClient.playui.setCardSprite(this, parseInt(hunCard), true);
                                if (!isMjhand) {
                                    return;
                                }

                                var screenCenter = cc.p(cc.winSize.width * 6 / 10, cc.winSize.height / 2);
                                var originPos = this.getPosition();
                                var originScale = this.getScale();
                                this.setPosition(this.getParent().convertToNodeSpace(screenCenter));
                                this.setScale(1.2);

                                var func = cc.callFunc(function(){
                                    playEffect("hunCardFly");
                                });

                                this.runAction(cc.sequence(cc.delayTime(1),
                                    cc.spawn(cc.scaleTo(0.6, originScale),cc.moveTo(0.6, originPos)).easing(cc.easeQuinticActionOut()),
                                func));
                            }
                        },
                        img_hunBg: {
                            _event: {
                                mjhand: function(){
                                    this.visible = false;
                                    var self = this;
                                    setTimeout(function(){
                                        self.visible = self.lightAction();
                                    }, 2000);
                                },
                                initSceneData: function(){
                                    this.visible = this.lightAction();
                                },
                                roundEnd:function (eD) {
                                    this.visible = false;
                                }
                            },
                        }
                    }
                },
                img_roomInfo3D: {
                    img_hunpaiBg: {
                        img_showCard: {
                            _event: {
                                mjhand: function(){
                                    this.visible = false;
                                    var shanGunCard = MjClient.majiang.getShanGunCard(parseInt(MjClient.data.sData.tData.hunCard));
                                    if (shanGunCard <= 0 || !MjClient.playui.isInGame()){
                                        return;
                                    }

                                    var screenCenter = cc.p(cc.winSize.width * 4 / 10, cc.winSize.height / 2);
                                    var originScale = this.getScale();
                                    this.setPosition(this.getParent().convertToNodeSpace(screenCenter));
                                    this.setScale(1.2);
                                    this.tag = parseInt(shanGunCard);
                                    MjClient.playui.setCardSprite(this, parseInt(shanGunCard), true);

                                    this.visible = true;
                                    this.runAction(cc.sequence(
                                        cc.delayTime(1),
                                        cc.fadeTo(0.6, 0.01),
                                        cc.callFunc(function(){
                                            this.visible = false;
                                        }.bind(this)),
                                        cc.fadeIn(0.1),
                                        cc.callFunc(function(){
                                            this.setScale(originScale);
                                        }.bind(this))
                                    ));
                                }
                            }
                        },
                        _event: {
                            mjhand: function() {
                                this.setBaiDaCard3D(true);
                            },
                        },
                        setBaiDaCard3D: function(isMjhand) {
                            this.visible = false;
                            var hunCard = parseInt(MjClient.data.sData.tData.hunCard);
                            var isShowHunCard = MjClient.playui.isHunCardShow3D();
                            if (!isShowHunCard || hunCard <= 0 || !MjClient.playui.isInGame()){
                                return;
                            }

                            this.visible = true;
                            var hunCardNode = this.getChildByName("img_hunCard");
                            hunCardNode.tag = parseInt(hunCard);
                            MjClient.playui.setCardSprite(hunCardNode, parseInt(hunCard), true);
                            hunCardNode.setColor(cc.color(255, 255, 255));
                            if (!isMjhand) {
                                return;
                            }

                            var screenCenter = cc.p(cc.winSize.width * 6 / 10, cc.winSize.height / 2);
                            var originPos = hunCardNode.getPosition();
                            var originScale = hunCardNode.getScale();
                            hunCardNode.setPosition(hunCardNode.getParent().convertToNodeSpace(screenCenter));
                            hunCardNode.setScale(1.2);

                            var func = cc.callFunc(function(){
                                playEffect("hunCardFly");
                            });

                            hunCardNode.runAction(cc.sequence(cc.delayTime(1),
                                cc.spawn(cc.scaleTo(0.6, originScale),cc.moveTo(0.6, originPos)).easing(cc.easeQuinticActionOut()),
                            func));
                        }
                    }
                },
                node_eat: {
                    btn_zhua: {
                        _visible: false,
                        _touch: function(sender, eventType) {
                            if(eventType == ccui.Widget.TOUCH_ENDED){
                                MjClient.playui.hideEatNodeChildren();
                                MjClient.playui.sendWangZhuaToServer();
                            }
                        }
                    },
                    node_showCards: {
                        img_showCardsBg:{
                            showEatCards: function(){
                                this.showCards();
                                this.visible = true;
                                var cardArr = MjClient.playui.eatCardArray;
                                this.updateSize(cardArr.length, 3);
                                var startPos = this.getStartPos(cardArr.length, 3);
                                var templatCard = this.getChildByName("img_card");
                                var lastPutCard = MjClient.data.sData.tData.lastPutCard;
                                var hunCard = MjClient.data.sData.tData.hunCard;
                                var self = this;
                                for(var i = 0;i < cardArr.length;i++){
                                    for (var j = 0; j < 3; j ++){
                                        var card = util.clone(templatCard);
                                        if (cardArr[i] == j){
                                            card.color = cc.color(255, 255, 0);
                                        }
                                        card.visible = true;
                                        card.setName(MjClient.playui.HandleCardType.Put);

                                        var showCard = lastPutCard - cardArr[i] + j;
                                        if(lastPutCard == 71 && lastPutCard != showCard){
                                            showCard = hunCard - cardArr[i] + j;
                                        }else if(i > 0 && cardArr[i - 1] == cardArr[i] && showCard == hunCard){
                                            showCard = 71;
                                        }else if(showCard == hunCard){
                                            var mjhand = MjClient.data.sData.players[MjClient.playui.getSelfUid()].mjhand;
                                            if(mjhand.indexOf(hunCard) < 0 && mjhand.indexOf(71) >= 0){
                                                showCard = 71;
                                            }
                                        }
                                        card.tag = showCard;

                                        var x = startPos.x + j * templatCard.width * templatCard.scale * 0.97;
                                        var y = startPos.y + i * templatCard.height * templatCard.scale;
                                        card.setPosition(cc.p(x, y));
                                        this.addChild(card);
                                        MjClient.playui.updateChiGangCards(card, card.tag);

                                        card.addTouchEventListener(function(sender, eventType){
                                            if(eventType == ccui.Widget.TOUCH_ENDED){
                                                MjClient.playui.sendChiToServer(this);
                                                MjClient.playui.hideEatNodeChildren();
                                                self.visible = false;
                                            }
                                        }.bind(i), card);
                                    }
                                }
                            },
                        }
                    },
                    btn_chi: {
                        _visible: false,
                        _touch: function(sender, eventType){
                            if(eventType == ccui.Widget.TOUCH_ENDED){
                                if(sender.checkChi()){
                                    return;
                                }

                                if(MjClient.playui.eatCardArray.length > 1){
                                    var showCardsNode = MjClient.playui.jsBind.node_eat.node_showCards._node;
                                    showCardsNode.getChildByName("img_showCardsBg").showEatCards();
                                    return;
                                }
                                MjClient.playui.sendChiToServer(0);
                                MjClient.playui.hideEatNodeChildren();
                            }
                        },
                        checkChi: function(){
                            return false;
                        }
                    },
                },
                node_jiaPiao: {
                    _run: function() {
                        this.visible = false;
                        this.scale = cc.winSize.width / 1422;
                        this.x = cc.winSize.width / 2;
                        this.y = cc.winSize.height / 4;
                    },
                    btn_buPiao: {
                        _click:function(btn) {  
                            MjClient.playui.sendJiaZhuToServer(1, MjClient.playui.getSelfUid());
                        }
                    },
                    btn_piao1: {
                        _click:function(btn) {  
                            MjClient.playui.sendJiaZhuToServer(2, MjClient.playui.getSelfUid());
                        }
                    },
                    btn_piao2: {
                        _click:function(btn) {  
                            MjClient.playui.sendJiaZhuToServer(3, MjClient.playui.getSelfUid());
                        }
                    },
                    btn_piao3: {
                        _click:function(btn) {  
                            MjClient.playui.sendJiaZhuToServer(4, MjClient.playui.getSelfUid());
                        }
                    },
                    _event: {
                        initSceneData: function(){
                            var tData = MjClient.data.sData.tData;
                            if(!tData.areaSelectMode.kepiao){
                                this.visible = false;
                                return;
                            }
                            var player = MjClient.playui.getPlayerInfoByOff(0);
                            if(!player){
                                return;
                            }
                            if(player.mjState == TableState.waitJiazhu){
                                this.visible = true;
                            }
                        },
                        waitJiazhu: function(){
                            var tData = MjClient.data.sData.tData;
                            if(!tData.areaSelectMode.kepiao){
                                this.visible = false;
                                return;
                            }
                            this.visible = true;
                        },
                        mjhand: function(){
                            this.visible = false;
                        },
                        MJJiazhu: function(eD){
                            var tData = MjClient.data.sData.tData;
                            if(!tData.areaSelectMode.kepiao){
                                this.visible = false;
                                return;
                            }
                            var player = MjClient.playui.getPlayerInfoByOff(0);
                            if(!player){
                                return;
                            }
                            if(player.info.uid == eD.uid){
                                this.visible = false;
                            }
                        }
                    }
                },
                img_jiaPiaoTip: {
                    _run: function(){
                        this.visible = false;
                        setWgtLayout(this,[0.5, 0.5], [0.5, 0.5], [0, 0]);
                    },
                    _event: {
                        initSceneData: function(){
                            var tData = MjClient.data.sData.tData;
                            if(!tData.areaSelectMode.kepiao){
                                this.visible = false;
                                return;
                            }
                            var player = MjClient.playui.getPlayerInfoByOff(0);
                            if(!player){
                                return;
                            }

                            if (tData.tState === TableState.waitJiazhu) {
                                this.visible = true;
                            }

                            if (player.mjState == TableState.waitJiazhu){
                                this.loadTexture("playing/gameTable/selectPiao.png");
                            } else {
                                this.loadTexture("playing/gameTable/waitPiao.png");
                            }
                        },
                        waitJiazhu: function(){
                            var tData = MjClient.data.sData.tData;
                            if(!tData.areaSelectMode.kepiao){
                                this.visible = false;
                                return;
                            }
                            this.visible = true;
                            this.loadTexture("playing/gameTable/selectPiao.png");
                        },
                        mjhand: function(){
                            this.visible = false;
                        },
                        moveHead: function(){
                            this.visible = false;
                        },
                        MJJiazhu: function(eD){
                            var tData = MjClient.data.sData.tData;
                            if(!tData.areaSelectMode.kepiao){
                                this.visible = false;
                                return;
                            }
                            var player = MjClient.playui.getPlayerInfoByOff(0);
                            if(!player){
                                return;
                            }
                            if(player.info.uid == eD.uid){
                                this.loadTexture("playing/gameTable/waitPiao.png");
                            }
                        }
                    }
                }
            };
            return jsBind;
        },
        ctor: function() {
            this._super(majiang_panel_daoZhou, "Play_MaJiangDaoZhou.json");
            return true;
        }
    });
    
    //Override
    majiang_panel_daoZhou.prototype.isCanAutoPut = function(){
        return false;
    };

    //Override 
    majiang_panel_daoZhou.prototype.getVoiceType = function(){ 
        return util.localStorageEncrypt.getNumberItem(MjClient.KEY_MJ_VOICE_TYPE, 0);
    };

    //Override
    majiang_panel_daoZhou.prototype.getCardSizeType = function(){ 
        return util.localStorageEncrypt.getNumberItem(MjClient.KEY_MJ_CARD_SIZE_TYPE, 0);
    };

    //Override
    majiang_panel_daoZhou.prototype.getEndallStatisticsName = function(cardTag, isLoop){
        return ["zimoTotal", "dianpaoTotal", "angangTotal", "minggangTotal"];
    };

    //Override
    majiang_panel_daoZhou.prototype.getEndallStatisticsKey = function(cardTag, isLoop){
        return ["自摸次数", "点炮次数", "暗杠次数", "明杠次数"];
    };

    //Override
    majiang_panel_daoZhou.prototype.getLaiZiIcon2D = function(){
        var laiZiNode = new ccui.ImageView();
        laiZiNode.setName("laiZi");
        laiZiNode.loadTexture("playing/MJ/gui.png");
        return laiZiNode;
    };

    //Override
    majiang_panel_daoZhou.prototype.getPlayerEatNode = function() {
        var sData = MjClient.data.sData;
        var tData = sData.tData;
        var player = sData.players[this.getSelfUid()];
        var eat = MjClient.playui.jsBind.node_eat;
        var nodeArr = [];
        this.gangCardArray = [];
        if(this.isTurnMe()){
            //胡
            if (player.eatFlag & 8) {
                nodeArr.push(eat.btn_hu._node);
            }

            //杠
            if(this.checkGangBtn(player) && !this.clickGangPass){
                nodeArr.push(eat.btn_gang._node);
            }
        }else{
            if (player.eatFlag & 8) {
                nodeArr.push(eat.btn_hu._node);
            }

            if (player.eatFlag & 4 ) {
                nodeArr.push(eat.btn_gang._node);
                this.gangCardArray.push(tData.lastPutCard);
            }

            if (player.eatFlag & 2) {
                nodeArr.push(eat.btn_peng._node);
            }

            if (player.eatFlag & 1){
                nodeArr.push(eat.btn_chi._node);
                this.eatCardArray = MjClient.majiang.canChi(player.mjhand, tData.lastPutCard, tData.hunCard);
            }

            if (player.eatFlag & 16){
                nodeArr.push(eat.btn_zhua._node);
            }
        }

        if(nodeArr.length > 0){
            nodeArr.push(eat.btn_guo._node);
        }
        this.reloadBtnTexture(nodeArr);
        return nodeArr;
    };

    //Override
    majiang_panel_daoZhou.prototype.checkGangBtn = function(player){
        var tData = MjClient.data.sData.tData;
        this.gangCardArray = player.gangList || [];
        if (this.gangCardArray.length > 0) {
            MjClient.majiang.gangWhenZimo(player.mjhand, this.gangCardArray, tData.hunCard);
            player.isCanGang = true;
            return true;
        }else{
            this.gangCardArray = MjClient.majiang.canGang1(player.mjpeng, player.mjhand, player.isTing, tData.hunCard);
            if(this.gangCardArray.length > 0){
                return true;
            }
        }
        return false;
    };

    //Override
    majiang_panel_daoZhou.prototype.getCardSortArray2D = function(node, newCardTag){
        var tData = MjClient.data.sData.tData;
        var handArr = [], anGangArr = [], mingGangArr = [], pengGangArr = [],pengArr = [], chiArr = [], laiZiArr = [];
        var children = node.children;
        var i, newCard = null;
        if(newCardTag > 0 ){
            this.newCardNode  = null;
        }

        for(i = 0;i < children.length;i++){
            var child = children[i];
            if(child.name == this.HandleCardType.Hand || (child.name == this.HandleCardType.Chi && child.isCut)){
                if(!newCard && child.tag == newCardTag && !child.isGray){
                    newCard = child;
                    this.newCardNode  = child;
                    this.newCardNode.isNew = true;
                    continue;
                }
                if(MjClient.majiang.isHunCard && MjClient.majiang.isHunCard(child.tag, tData.hunCard)){
                    laiZiArr.push(child);
                    continue;
                }
                handArr.push(child);
            }else if(child.name == this.HandleCardType.AnGang){
                anGangArr.push(child);
            }else if(child.name == this.HandleCardType.MingGang){
                mingGangArr.push(child);
            }else if(child.name == this.HandleCardType.PengGang){
                pengGangArr.push(child);
            }else if(child.name == this.HandleCardType.Peng){
                pengArr.push(child);
            }else if(child.name == this.HandleCardType.Chi){
                chiArr.push(child);
            }
        }

        var sortArray = function(cardArray, handSort){
            cardArray.sort(function(a, b){
                var card1 = a.tag;
                var card2 = b.tag;
                if (handSort) {
                    card1 = card1 == 71 ? MjClient.data.sData.tData.hunCard : card1;
                    card2 = card2 == 71 ? MjClient.data.sData.tData.hunCard : card2;
                }

                return card1 - card2;
            });
            return cardArray;
        };
        handArr = sortArray(handArr, true);
        pengArr = sortArray(pengArr);
        anGangArr = sortArray(anGangArr);
        mingGangArr = sortArray(mingGangArr);
        pengGangArr = sortArray(pengGangArr);
        if(this.getNodeIndexDefaultByName(node.getName()) == 1){
            //右边玩家的zIndex需要做处理
            chiArr.reverse();
        }
        if(newCard){
            handArr.push(newCard);
        }
        laiZiArr.sort(function(a, b){
            return a.tag - b.tag;
        });    
        for(i = 0;i < laiZiArr.length;i++){
            handArr.unshift(laiZiArr[i]);
        }
        return [].concat(anGangArr, mingGangArr, pengGangArr,pengArr, chiArr, handArr);
    };

    //Override
    majiang_panel_daoZhou.prototype.getCardSortArray3D = function(node, newCardTag){
        var tData = MjClient.data.sData.tData;
        var handArr = [], anGangArr = [], mingGangArr = [], pengArr = [], chiArr = [], laiZiArr = [];
        var children = node.children;
        var i, newCard = null;
        if(newCardTag > 0 ){
            this.newCardNode  = null;
        }

        for(i = 0;i < children.length;i++){
            var child = children[i];
            if(child.name == this.HandleCardType.Hand || (child.name == this.HandleCardType.Chi && child.isCut)){
                if(!newCard && child.tag == newCardTag && !child.isGray){
                    newCard = child;
                    this.newCardNode  = child;
                    this.newCardNode.isNew = true;
                    continue;
                }
                if(MjClient.majiang.isHunCard && MjClient.majiang.isHunCard(child.tag, tData.hunCard)){
                    laiZiArr.push(child);
                    continue;
                }
                handArr.push(child);
            }else if(child.name == this.HandleCardType.AnGang){
                anGangArr.push(child);
            }else if(child.name == this.HandleCardType.MingGang){
                mingGangArr.push(child);
            }else if(child.name == this.HandleCardType.PengGang){
                mingGangArr.push(child);
            }else if(child.name == this.HandleCardType.Peng){
                pengArr.push(child);
            }else if(child.name == this.HandleCardType.Chi){
                chiArr.push(child);
            }
        }

        var sortArray = function(cardArray, handSort){
            cardArray.sort(function(a, b){
                var card1 = a.tag;
                var card2 = b.tag;
                if (handSort) {
                    card1 = card1 == 71 ? MjClient.data.sData.tData.hunCard : card1;
                    card2 = card2 == 71 ? MjClient.data.sData.tData.hunCard : card2;
                }

                return card1 - card2;
            });
            return cardArray;
        };
        handArr = sortArray(handArr, true);
        pengArr = sortArray(pengArr);
        anGangArr = sortArray(anGangArr);
        mingGangArr = sortArray(mingGangArr);

        if(newCard){
            handArr.push(newCard);
        }
        laiZiArr.sort(function(a, b){
            return a.tag - b.tag;
        });    
        for(i = 0;i < laiZiArr.length;i++){
            handArr.unshift(laiZiArr[i]);
        }

        var cardArray = [].concat(anGangArr, mingGangArr, pengArr, chiArr, handArr);
        var nodeIndex = this.getNodeIndexDefaultByName(node.getName());
        if(nodeIndex == 1 || nodeIndex == 2){
            cardArray.reverse();
        }    
        return cardArray;
    };

    //Override
    majiang_panel_daoZhou.prototype.getInsertCardPosIndex = function (handcardUI, index) {
        var tagValue = handcardUI[index].tag;
        var hunCardValue = MjClient.data.sData.tData.hunCard;

        if (this.newCardNode && this.isHunCard(this.newCardNode.tag)) {
            return 0;
        }

        if (this.isHunCard(tagValue)) {
            return -1;
        }

        if (tagValue == 71) {
            tagValue =  hunCardValue;
        }

        if(this.newCardNode && this.newCardNode.tag != 71 && tagValue >= this.newCardNode.tag){
            return index;
        }

        if(this.newCardNode && this.newCardNode.tag == 71 && tagValue >= hunCardValue){
            return index;
        }

        return -1;
    };


    //Override
    majiang_panel_daoZhou.prototype.showEatActionAnim = function(playerNode, actType) {
        var delayTime = 2;
        var animateNode = playerNode.getChildByName("node_animation");
        var nodeName = playerNode.getName();
        var callback = function (){
            animateNode.visible = false;
        };

        var isOpenEffect = this.get3DTeXiaoType();
        var projNode = null;
        var _scale = 1;
        if (actType == "wangzhua" || isOpenEffect == 1 || !this.isNeedEatActionEffect3D()) {
            projNode = this.getEatSpineNode(actType);
            _scale = cc.winSize.height / 1280; //根据当前的屏幕的高度动态算缩放大小
        } else {
            projNode = this.getEatSpineNode3D(actType, nodeName);
            _scale = cc.winSize.height / 640;
            delayTime = 0.8;
        }
        projNode.setScale(_scale);

        animateNode.visible = true;
        animateNode.removeAllChildren();
        animateNode.runAction(cc.sequence(cc.delayTime(delayTime), cc.callFunc(callback)));
        animateNode.addChild(projNode);
    };

    // 下飘显示
    majiang_panel_daoZhou.prototype.showPiaoText = function(textNode, nodeName) {
        var tData = MjClient.data.sData.tData;
        var isXiaPiao = tData.areaSelectMode.kepiao;
        var player = this.getPlayerInfoByName(nodeName);
        if (!player || !isXiaPiao || !player.jiazhuNum || player.jiazhuNum <= 0) {
            return;
        }

        var isInGame = this.isInGame() || tData.tState == TableState.roundFinish;
        if (!isInGame && !(tData.tState == TableState.waitJiazhu && player.mjState == TableState.isReady)) {
            return;
        }

        var xiaPiaoStr = "我太南了";
        if (nodeName != "node_down" && !isInGame) {
            xiaPiaoStr = "已下飘";
        }
        else {
            xiaPiaoStr = player.jiazhuNum == 1 ? "不飘" : "飘" + (player.jiazhuNum - 1);
        }

        textNode.ignoreContentAdaptWithSize(true);
        textNode.setString(xiaPiaoStr);
        textNode.visible = true;
    };

    // 向服务器发送王抓命令
    majiang_panel_daoZhou.prototype.sendWangZhuaToServer = function() {
        if (MjClient.rePlayVideo != -1) {
            return;
        }

        var tData = MjClient.data.sData.tData;
        MjClient.gamenet.request("pkroom.handler.tableMsg", {
            cmd: "MJWangZhua",
            card:tData.lastPutCard
        });  
    };

    // 处理王抓
    majiang_panel_daoZhou.prototype.dealWangZhua = function(playerNode, msg) {
        if (msg.uid == this.getPlayerInfoByName(playerNode.getName()).info.uid) {
            this.showEatActionAnim(playerNode, "wangzhua");
        }
    };

    // 中鸟的内容  
    majiang_panel_daoZhou.prototype.getIsZhongBird = function(cd){
        if(cd == 71 || cd == 31){
            return true;
        }
        if(cd <= 29 && (cd % 10 == 1 || cd % 10 == 5 || cd % 10 == 9)){
            return true;
        }
        return false;
    };
}());