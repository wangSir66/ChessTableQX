//邵阳永州麻将
var majiang_panel_yongZhouGMJ;
(function() {
    majiang_panel_yongZhouGMJ = majiang_panel_shaoyang.extend({
        getJsBind: function(){
            var jsBind = {
                img_roomInfo2D: {
                    node_hunPai: {
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
                                // var shanGunCard = MjClient.majiang.getShanGunCard(parseInt(MjClient.data.sData.tData.hunCard));
                                var shanGunCard = parseInt(MjClient.data.sData.tData.hunCard);
                                if (shanGunCard <= 0 || !MjClient.playui.isInGame()){
                                    return;
                                }

                                this.visible = true;
                                this.tag = parseInt(shanGunCard);
                                MjClient.playui.setCardSprite(this, parseInt(shanGunCard), true);
                                if (!isMjhand) {
                                    return;
                                }

                                var screenCenter = cc.p(cc.winSize.width / 2, cc.winSize.height / 2);
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
                        _event: {
                            mjhand: function() {
                                this.setBaiDaCard3D(true);
                            },
                        },
                        setBaiDaCard3D: function(isMjhand) {
                            this.visible = false;
                            // var shanGunCard = MjClient.majiang.getShanGunCard(parseInt(MjClient.data.sData.tData.hunCard));
                            var shanGunCard = parseInt(MjClient.data.sData.tData.hunCard);
                            var isShowHunCard = MjClient.playui.isHunCardShow3D();
                            if (!isShowHunCard || shanGunCard <= 0 || !MjClient.playui.isInGame()){
                                return;
                            }

                            this.visible = true;
                            var hunCardNode = this.getChildByName("img_hunCard");
                            hunCardNode.tag = parseInt(shanGunCard);
                            MjClient.playui.setCardSprite(hunCardNode, parseInt(shanGunCard), true);
                            hunCardNode.setColor(cc.color(255, 255, 255));
                            if (!isMjhand) {
                                return;
                            }

                            var screenCenter = cc.p(cc.winSize.width / 2, cc.winSize.height / 2);
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
                                        }else if(showCard == hunCard){
                                            var mjhand = MjClient.data.sData.players[MjClient.playui.getSelfUid()].mjhand;
                                            if(mjhand.indexOf(71) >= 0){
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
                                        }.bind(cardArr[i]), card);
                                    }
                                }
                            },
                        }
                    }
                }
            };
            return jsBind;
        },
        ctor: function() {
            this._super(majiang_panel_yongZhouGMJ, "Play_MaJiangYongZhou.json");
            return true;
        }
    });
    
    //Override
    majiang_panel_yongZhouGMJ.prototype.isCanAutoPut = function(){
        return false;
    };

    //Override 
    majiang_panel_yongZhouGMJ.prototype.getVoiceType = function(){ 
        return util.localStorageEncrypt.getNumberItem(MjClient.KEY_MJ_VOICE_TYPE, 0);
    };

    //Override
    majiang_panel_yongZhouGMJ.prototype.getCardSizeType = function(){ 
        return util.localStorageEncrypt.getNumberItem(MjClient.KEY_MJ_CARD_SIZE_TYPE, 0);
    };

    //Override
    majiang_panel_yongZhouGMJ.prototype.getEndallStatisticsName = function(cardTag, isLoop){
        return ["zimoTotal", "dianpaoTotal", "angangTotal", "minggangTotal"];
    };

    //Override
    majiang_panel_yongZhouGMJ.prototype.getEndallStatisticsKey = function(cardTag, isLoop){
        return ["自摸次数", "点炮次数", "暗杠次数", "明杠次数"];
    };

    //Override
    majiang_panel_yongZhouGMJ.prototype.getLaiZiIcon2D = function(){
        var laiZiNode = new ccui.ImageView();
        laiZiNode.setName("laiZi");
        laiZiNode.loadTexture("playing/MJ/gui.png");
        return laiZiNode;
    };

    //Override
    majiang_panel_yongZhouGMJ.prototype.getPlayerEatNode = function() {
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
        }

        if(nodeArr.length > 0){
            nodeArr.push(eat.btn_guo._node);
            
        }
        this.reloadBtnTexture(nodeArr);
        return nodeArr;
    };

    //Override
    majiang_panel_yongZhouGMJ.prototype.checkGangBtn = function(player){
        var tData = MjClient.data.sData.tData;
        this.gangCardArray = player.gangList || [];
        if (this.gangCardArray.length > 0) {
            MjClient.majiang.gangWhenZimo(player.mjhand, this.gangCardArray, tData.hunCard);
            player.isCanGang = true;
            return true;
        }else{
            this.gangCardArray = MjClient.majiang.canGang1(player, tData);
            if(this.gangCardArray.length > 0){
                return true;
            }
        }
        return false;
    };

    //Override
    majiang_panel_yongZhouGMJ.prototype.getCardSortArray2D = function(node, newCardTag){
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
    majiang_panel_yongZhouGMJ.prototype.getCardSortArray3D = function(node, newCardTag){
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
    majiang_panel_yongZhouGMJ.prototype.getInsertCardPosIndex = function (handcardUI, index) {
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
}());