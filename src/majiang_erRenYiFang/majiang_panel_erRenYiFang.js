/***
 * 二人两房，新框架牌桌逻辑
 * @type {void | Class | *}
 */

var majiang_panel_erRenYiFang, father;
(function () {

    if(MjClient.getAppType() === MjClient.APP_TYPE.QXYYQP){
        father = majiang_panel_yueyang;
    }else if(MjClient.getAppType() === MjClient.APP_TYPE.QXSYDTZ){
        father = majiang_panel_shaoyang;
    }else if(MjClient.getAppType() === MjClient.APP_TYPE.QXYZQP){
        father = majiang_panel_yongzhou;
    }

    majiang_panel_erRenYiFang = father.extend({
        jsonFile: "Play_MaJiangErRenYiFang.json",
        getJsBind: function(){
            var jsBind = {
                _event:{
                    mjhand: function() {
                        if(MjClient.endoneui && cc.sys.isObjectValid(MjClient.endoneui)){
                            MjClient.endoneui.removeFromParent(true);
                            MjClient.endoneui = null;
                        }
                        MjClient.playui.lastPutCardNode = null;
                    },
                    MJTing:function (msg) {
                        MjClient.playui.handleMJTing(msg);
                    },
                    MJPass:function () {
                        MjClient.playui.handleMJPass();
                    }
                },
                node_down:{
                    _event:{
                        MJPut: function(data) {
                            MjClient.playui.clickGangPass = false;
                            MjClient.playui.clickTingPass = false;
                            MjClient.playui.clickTing = false;
                            MjClient.playui.dealPut(this, data);
                            MjClient.playui.updatePlayerEatBtn();
                            if(data.uid === MjClient.playui.getSelfUid()){
                                MjClient.playui.checkHandCards(this);
                                MjClient.playui.checkPutCards(this);
                                MjClient.playui.updateTingTips();
                            }
                        }
                    },
                    layout_head: {
                        atlas_score: {
                            _event: {
                                roundEnd: function(){
                                    // this.updateScore();
                                },
                                updateEndScore: function(){
                                    this.updateScore();
                                },
                            },
                            updateScore: function(){
                                var player = MjClient.playui.getPlayerInfoByName("node_down");
                                if (!player) {
                                    return false;
                                }
                                changeAtalsForLabel(this, player.winall);
                                return true;              
                            },
                        },
                    }
                },
                node_right:{
                    layout_head: {
                        atlas_score: {
                            _event: {
                                roundEnd: function(){
                                    // this.updateScore();
                                },
                                updateEndScore: function(){
                                    this.updateScore();
                                },
                            },
                            updateScore: function(){
                                var player = MjClient.playui.getPlayerInfoByName("node_right");
                                if (!player) {
                                    return false;
                                }
                                changeAtalsForLabel(this, player.winall);
                                return true;              
                            },
                        },
                    }
                },
                node_top:{
                    layout_head: {
                        atlas_score: {
                            _event: {
                                roundEnd: function(){
                                    // this.updateScore();
                                },
                                updateEndScore: function(){
                                    this.updateScore();
                                },
                            },
                            updateScore: function(){
                                var player = MjClient.playui.getPlayerInfoByName("node_top");
                                if (!player) {
                                    return false;
                                }
                                changeAtalsForLabel(this, player.winall);
                                return true;              
                            },
                        },
                    }
                },
                node_left:{
                    layout_head: {
                        atlas_score: {
                            _event: {
                                roundEnd: function(){
                                    // this.updateScore();
                                },
                                updateEndScore: function(){
                                    this.updateScore();
                                },
                            },
                            updateScore: function(){
                                var player = MjClient.playui.getPlayerInfoByName("node_left");
                                if (!player) {
                                    return false;
                                }
                                changeAtalsForLabel(this, player.winall);
                                return true;              
                            },
                        },
                    }
                },
                node_eat:{
                    btn_peng: {
                        _visible: false,
                        _touch: function (sender, eventType) {
                            if(eventType === ccui.Widget.TOUCH_ENDED){
                                var player = MjClient.playui.getPlayerInfoByOff(0);
                                if (player.eatFlag & 8) {
                                    MjClient.showMsg("确认不胡吗?", function(){
                                        MjClient.playui.sendPengToServer();
                                        MjClient.playui.hideEatNodeChildren();
                                    }, function() {}, "1");
                                } else {
                                    MjClient.playui.sendPengToServer();
                                    MjClient.playui.hideEatNodeChildren();
                                }
                            }
                        }
                    },
                    btn_gang: {
                        _visible: false,
                        _touch: function(sender, eventType) {
                            if (eventType === ccui.Widget.TOUCH_BEGAN) {
                                MjClient.playui.hasClickBtn = true;
                            }
                            if (eventType === ccui.Widget.TOUCH_CANCELED) {
                                MjClient.playui.hasClickBtn = false;
                            }
                            if (eventType === ccui.Widget.TOUCH_ENDED) {
                                if (MjClient.playui.gangCardArray.length > 1) {
                                    var showCardsNode = MjClient.playui.jsBind.node_eat.node_showCards._node;
                                    showCardsNode.getChildByName("img_showCardsBg").showGangCards();
                                    return;
                                }

                                var player = MjClient.playui.getPlayerInfoByName("node_down");
                                if (player.eatFlag & 8) {
                                    MjClient.showMsg("确认不胡吗?", function () {
                                        MjClient.playui.sendGangToServer(MjClient.playui.gangCardArray[0]);
                                        MjClient.playui.hideEatNodeChildren();
                                    }, function () {}, "1");
                                } else {
                                    MjClient.playui.sendGangToServer(MjClient.playui.gangCardArray[0]);
                                    MjClient.playui.hideEatNodeChildren();
                                }
                            }
                        }
                    }
                }
            };
            return jsBind;
        },

        ctor: function(){
            var jsonFile = this.jsonFile;
            this._super(majiang_panel_erRenYiFang, jsonFile);
            return true;
        },

        // override 是否显示红中癞子牌
        isHunCardShow: function(){
            return false;
        },

        // override 是否显示红中癞子牌
        isHunCardShow3D: function(){
            return false;
        },

        // override 是否开启显示最多听牌标识
        isShowMaxTingCards: function(){
            return true;
        },

        createEndOnePanel: function(){
            return new majiang_winGamePanel_erRenYiFang();
        },

        //@Override
        isTurnMe : function(){
            var sData = MjClient.data.sData;
            var tData = sData.tData;
            var pl = sData.players[this.getSelfUid()];

            if(this.checkTingBtn(pl) && (pl.mjState === TableState.waitPut || pl.mjState === TableState.waitCard)) {
                return true;
            }

            if (this.getSelfUid() === tData.uids[tData.curPlayer] && pl.mjState === TableState.waitPut && tData.tState === TableState.waitPut){
                return true;
            }
            return false;
        },

        //@Override 刷新玩家操作按钮
        updatePlayerEatBtn: function(){
            this.hideEatNodeChildren();
            var sData = MjClient.data.sData;
            var tData = sData.tData;
            var player = sData.players[MjClient.playui.getSelfUid()];

            if(!this.isTurnMe() && (player.mjState !== TableState.waitEat || tData.haveTianTing)){
                return;
            }

            var eatNodeArr = this.getPlayerEatNode();
            var pct = this.isIPad() ? 0.12 : 0.16;
            var pos = this.isIPad() ? 0.75 : 0.70;
            var space = this.isIPad() ? 1.4 : 1.5;
            var off_y = this.isIPad() ? 1.7 : 2.0;
            for(var i = 0;i < eatNodeArr.length;i++){
                var btn = eatNodeArr[i];
                btn.visible = true;
                setWgtLayout(btn, [0, pct], [pos, 0], [(i - eatNodeArr.length + 1) * space, off_y], false, false);
            }
            MjClient.playui.addLightAniEatBtns(); // 设置麻将的吃碰杠按钮特效
            this.checkBtnWithPlayerFlag();
        },


        //@Override 获得玩家可操作的按钮
        getPlayerEatNode: function() {
            var sData = MjClient.data.sData;
            var tData = sData.tData;
            var player = sData.players[this.getSelfUid()];
            var eat = MjClient.playui.jsBind.node_eat;
            var nodeArr = [];
            this.gangCardArray = [];

            if(this.isTurnMe()){
                //杠
                if(!player.isTing && this.checkGangBtn(player) && !this.clickGangPass){
                    nodeArr.push(eat.btn_gang._node);
                }
                //胡
                if (player.eatFlag & 8) {
                    nodeArr.push(eat.btn_hu._node);
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
            }

            if(nodeArr.length > 0){
                nodeArr.push(eat.btn_guo._node);
            }
            this.reloadBtnTexture(nodeArr);
            return nodeArr;
        },

        handleMJTing: function(msg) {
            var sData = MjClient.data.sData;
            if (!sData) return;
            var tData = sData.tData;
            tData.haveTianTing = false;
            if (msg.eatFlags) {
                for(var uid in msg.eatFlags) {
                    sData.players[uid].eatFlag = msg.eatFlags[uid];
                }
            }
            MjClient.playui.updateTingTips();
            MjClient.playui.updatePlayerEatBtn();
        },

        handleMJPass:function() {
            var tData = MjClient.data.sData.tData;
            tData.haveTianTing = false;
            MjClient.playui.updateTingTips();
            MjClient.playui.updatePlayerEatBtn();
        },

        clickTingBtn: function(){
            this.clickTing = true;
            var downNode = MjClient.playui.getNodeByOff(0);
            MjClient.playui.hideEatNodeChildren();
            var btn_cancel = MjClient.playui.jsBind.node_eat.btn_cancel._node;
            btn_cancel.visible = false; //点了听按钮后，要显示取消按钮
            downNode.getChildByName("img_tingCardsWithNum").visible = false;
            downNode.getChildByName("img_tingCards").visible = false;
            MjClient.playui.updateCardColorAfterTing();
            this.sendTingToServer(MjClient.data.sData.tData.lastPutCard);
        },

        // @override 听牌检测
        checkTingBtn: function(player){
            if(this.clickTingPass) return false;
            if(!player || !player.mjhand || player.isDoTianTing) return false;
            var handCards = player.mjhand.slice();
            if(player.mjgang0.length === 0 && player.mjgang1.length === 0 && player.mjpeng.length === 0 && player.mjput.length === 1 && player.putCount === 1){
                if(MjClient.majiang.canTing(handCards)){
                    return true;
                }
            }
            return false;
        },

        updateOtherCardSize: function (node){
            var is3D = MjClient.playui.is3DStyle();
            var playNode = node.getParent();
            var _ds = 0;
            if(playNode.getName() === "node_down"){
                if(node.getName() === "img_eatFrontCard"){
                    if(!is3D){
                        setWgtLayout(node, [0.05, 0], [0.25, 0], [0, 0.55]);
                    }else{
                        setWgtLayout(node, [0.05, 0], [0, 0], [0.8, 0.5]);
                    }
                }
                if(node.getName() === "img_putCardOne"){
                    if(!is3D){
                        if(MjClient.size.width / MjClient.size.height >= 1.5){
                            setWgtLayout(node, [0, 0.088], [0.506, 0], [-5, 3.3]);
                        }else if(this.isIPad()){
                            setWgtLayout(node, [0, 0.075], [0.506, 0], [-6, 2.7]);
                        }else{
                            setWgtLayout(node, [0, 0.08], [0.506, 0], [-1, 3.3]);
                        }
                    }else{
                        _ds = this.isIPad() ? -0.01 : -0.005;
                        setWgtLayout(node, [0.0, 0.076 + _ds], [0.506, -0.03], [-7, 6.1]);
                    }
                }
            }
            if(playNode.getName() === "node_top"){
                if(node.getName() === "img_eatFrontCard"){
                    if(!is3D){
                        setWgtLayout(node, [0, 0.08], [0.5, 1], [6, -1.5]);
                    }else{
                        setWgtLayout(node, [0, 0.07], [0.5, 1.033], [6, -1.4]);
                    }
                }
                if(node.getName() === "img_putCardOne"){
                    if(!is3D){
                        if(MjClient.size.width / MjClient.size.height >= 1.5){
                            setWgtLayout(node, [0, 0.088], [0.5, 1], [6, -2.6]);
                        }else if(MjClient.playui.isIPad()){
                            setWgtLayout(node, [0, 0.075], [0.55, 1], [4.8, -2.3]);
                        }else{
                            setWgtLayout(node, [0, 0.08], [0.5, 1], [4.8, -2.6]);
                        }
                    }else{
                        _ds = MjClient.playui.isIPad() ? -0.01 : 0;
                        setWgtLayout(node, [0, 0.07 + _ds], [0.57, 0.98 ], [4.1, -4.1]);
                    }
                }
            }
        },

        updateHandCardSize: function (node) {
            var playNode = node.getParent();
            var is3D = this.is3DStyle();
            var sizeType = this.getCardSizeType();
            if(playNode.getName() === "node_down"){
                if (sizeType === 0) {
                    if (!is3D) {
                        setWgtLayout(node, [0.069, 0], [0.3, 0], [0, 0.55]);
                    } else {
                        setWgtLayout(node, [0.053, 0], [0.5, 0], [0, 0.72]);
                    }
                } else {
                    if (!is3D) {
                        setWgtLayout(node, [0.070, 0], [0.3, 0], [0, 0.55]);
                    } else {
                        setWgtLayout(node, [0.054, 0], [0.5, 0], [0, 0.72]);
                    }
                }
            }else if(playNode.getName() === "node_top"){
                if(!is3D){
                    if(this.isIPad())
                        setWgtLayout(node, [0, 0.07], [0.5, 1], [8, -1.3]);
                    else
                        setWgtLayout(node, [0, 0.09], [0.5, 1], [4, -1.3]);
                }else{
                    setWgtLayout(node, [0, 0.07], [0.5, 1.04], [6, -1.4]);
                }
            }
        },

        updatePlayerCards: function (node) {
            var player = this.getPlayerInfoByName(node.getName());
            if(!player){
                return;
            }

            this.removeAllCards(node);
            this.removePutCardTip();
            if (!this.isInGame()){
                return;
            }

            var i,j;
            //添加暗杠
            for(i = 0; i < player.mjgang1.length; i++){
                for(j = 0; j < 4; j++){
                    this.createCard(node, this.CsdDefaultCardType.EatCardFront, this.HandleCardType.AnGang, player.mjgang1[i]);
                }
            }
            //添加明杠
            for(i = 0; i < player.mjgang0.length; i++){
                for(j = 0; j < 4; j++){
                    this.createCard(node, this.CsdDefaultCardType.EatCardFront, this.HandleCardType.MingGang, player.mjgang0[i]);
                }
            }

            //添加碰杠
            if(player.mjgang2)
            {
                for(i = 0; i < player.mjgang2.length; i++){
                    for(j = 0; j < 4; j++){
                        this.createCard(node, this.CsdDefaultCardType.EatCardFront, this.HandleCardType.PengGang, player.mjgang2[i]);
                    }
                }
            }

            //添加碰
            for(i = 0; i < player.mjpeng.length; i++){
                for(j = 0; j < 3; j++)        {
                    this.createCard(node, this.CsdDefaultCardType.EatCardFront, this.HandleCardType.Peng, player.mjpeng[i]);
                }
            }
            //吃
            for(i = 0; i < player.mjchi.length; i++){
                this.createCard(node, this.CsdDefaultCardType.EatCardFront, this.HandleCardType.Chi, player.mjchi[i]);
            }
            //添加打出的牌
            for(i = 0; i < player.mjput.length; i++){
                this.createCard(node, this.CsdDefaultCardType.PutCardOne, this.HandleCardType.Put, player.mjput[i]);
            }
            //添加手牌
            if(MjClient.rePlayVideo === -1){
                if(player.mjhand && this.NodeNameArray.indexOf(node.getName()) === 0){
                    for(i = 0; i < player.mjhand.length; i++){
                        this.createCard(node, this.CsdDefaultCardType.HandCard, this.HandleCardType.Hand, player.mjhand[i]);
                    }
                }else{
                    var CardCount = 0;
                    var tData = MjClient.data.sData.tData;
                    if(tData.tState === TableState.waitPut && tData.uids[tData.curPlayer] === player.info.uid){
                        CardCount = 8;
                    }else {
                        CardCount = 7;
                    }

                    CardCount = CardCount - ((player.mjpeng.length + player.mjgang0.length + player.mjgang1.length) * 3 + player.mjchi.length);
                    for(i = 0; i < CardCount; i++){
                        this.createCard(node, this.CsdDefaultCardType.HandCard, this.HandleCardType.Hand);
                    }
                }
            }else if(player.mjhand){
                for (i = 0; i < player.mjhand.length; i++) {
                    this.createCard(node, this.CsdDefaultCardType.HandCard, this.HandleCardType.Hand, player.mjhand[i]);
                }
            }

            this.switchUpdate2DAnd3D(node);
        },


        updateDownEatAndHandCards3D: function (cardArray) {
            var tData = MjClient.data.sData.tData;
            var playerNode = cardArray[0].getParent();
            var templetEatCard = playerNode.getChildByName(this.CsdDefaultCardType.EatCardFront);
            var templetHandCard = playerNode.getChildByName(this.CsdDefaultCardType.HandCard);
            var player = this.getPlayerInfoByName(playerNode.getName());

            var cardIndex = 0, pengIndex = 0, gangIndex = 0, chiIndex = 0, children, i, k, child, add_x;
            var start_x = cardArray[0].getName() === this.HandleCardType.Hand ? cc.winSize.width * 0.3 : cc.winSize.width * 0.3;

            var handCount = this.getCardNodeCountByName(playerNode, this.HandleCardType.Hand);
            var isPlayAct = false;
            for(i = 0;i < cardArray.length;i++){
                var offSet_x = 0, offSet_y = 0;
                var cardNode = cardArray[i];
                cardNode.visible = true;
                if(cardNode.getName() == this.HandleCardType.Hand){
                    cardNode.stopAllActions();
                    cardNode.ignoreContentAdaptWithSize(true);
                    cardNode.setScale(templetHandCard.scale * 1.2 * 1.3);

                    children = cardNode.children;
                    for(k = 0; k < children.length; k++){
                        child = children[k];
                        if(child.ignoreContentAdaptWithSize) {
                            child.ignoreContentAdaptWithSize(true);
                        }
                        if(child.getName() != "tingSign"){
                            child.setPosition(cardNode.width * 0.5, cardNode.height * 0.43);
                        }
                        if(child.getName() == "laiZi"){
                            child.setPosition(child.x * 1.1, child.y * 1.1);
                        }
                    }

                    if(cardArray[i - 1] && cardArray[i - 1].name != this.HandleCardType.Hand){
                        var lastCardNode = cardArray[i - 1];
                        if(cardArray[i - 1].name == this.HandleCardType.MingGang || cardArray[i - 1].name == this.HandleCardType.AnGang || cardArray[i - 1].name == this.HandleCardType.PengGang){
                            lastCardNode = cardArray[i - 2];
                        }
                        cardNode.x = lastCardNode.x + templetHandCard.getScale() * templetHandCard.width * 1.20;
                    }else  if(i != 0){
                        if(handCount % 3 == 2  && i == cardArray.length - 1 && player.mjState == TableState.waitPut){
                            var cardNodeX = cardArray[i - 1].x + templetHandCard.getScale() * templetHandCard.width * 1.80;
                            isPlayAct = this.playNewCardAction("node_down", cardNode, cc.p(cardNodeX, templetHandCard.y));
                            if (!isPlayAct) {
                                cardNode.x = cardNodeX;
                            }
                        }else {
                            cardNode.x = cardArray[i - 1].x + templetHandCard.getScale() * templetHandCard.width * 1.26;
                        }
                    }else if(i == 0){
                        cardNode.x = start_x;
                    }
                    cardNode.zIndex = 200 + i;
                    if (!isPlayAct) {
                        cardNode.y = templetHandCard.y;
                    }

                    //吃碰杠之后，设置this.newCardNode
                    if(handCount % 3 == 2 && player.info.uid == tData.uids[tData.curPlayer] && player.mjState == TableState.waitPut && !player.isNew){
                        this.newCardNode = cardNode;
                    }
                    continue;
                }
                if (cardNode.name == this.HandleCardType.Chi && cardNode.isCut){
                    //倒牌
                    cardIndex ++;
                    cardNode.loadTexture("playing/MJ3D/downCard/eat" + (cardIndex + 4) + ".png");
                    if(i == 0){
                        cardNode.x = cc.winSize.width * 0.4;
                    }else if(cardArray[i - 1].name != this.HandleCardType.Chi ||
                        (cardArray[i - 1].name == this.HandleCardType.Chi && !cardArray[i - 1].isCut))
                    {
                        cardNode.x = cardArray[i - 1].x + templetEatCard.getScale() * templetEatCard.width * 2.3;
                    }else if(player.mjhand && player.mjhand.length % 3 == 2 && i == cardArray.length - 1 &&player.isZiMo == true){
                        cardNode.x = cardArray[i - 1].x + templetEatCard.getScale() * templetEatCard.width * 1.4;
                    }else {
                        cardNode.x = cardArray[i - 1].x + templetEatCard.getScale() * templetEatCard.width * 0.9;
                    }
                    cardNode.zIndex = 100 + i;
                }else if(cardNode.getName() == this.HandleCardType.MingGang || cardNode.getName() == this.HandleCardType.PengGang){
                    gangIndex++;
                    gangIndex = gangIndex == 4 ? 0 : gangIndex;
                    if(gangIndex == 0){
                        cardNode.loadTexture("playing/MJ3D/downCard/eat" + (cardIndex - 1) + ".png");
                        this.setCardArrow3D(cardNode, player, 0);
                    }else{
                        cardIndex++;
                        cardNode.loadTexture("playing/MJ3D/downCard/eat" + cardIndex + ".png");
                    }

                    if(i == 0){
                        cardNode.x = start_x;
                    }else if(gangIndex == 0){
                        if(cardIndex <= 6){
                            cardNode.x = cardArray[i - 2].x * 0.99;
                        }else{
                            cardNode.x = cardArray[i - 2].x;
                        }
                        offSet_y = 0.5;
                    }else if(cardArray[i - 1] && cardArray[i - 1].getName() != this.HandleCardType.MingGang && cardArray[i - 1].getName() != this.HandleCardType.PengGang){
                        cardNode.x = cardArray[i - 2].x + cardArray[i - 2].getScale() * cardArray[i - 1].width;
                    }else if (gangIndex == 1) {
                        cardNode.x = cardArray[i - 2].x + cardArray[i - 2].getScale() * cardArray[i - 1].width * 0.9;
                    }else {
                        add_x = 0;
                        if(cardIndex == 2){
                            add_x -= 0.05;
                        }else if(cardIndex == 3){
                            add_x -= 0.05;
                        }else if(cardIndex == 5){
                            add_x -= 0.01;
                        }else if(cardIndex == 6){
                            add_x -= 0.01;
                        }
                        cardNode.x = cardArray[i - 1].x + cardArray[i - 1].getScale() * cardArray[i - 1].width * (0.75 + add_x);
                    }

                }else if(cardNode.getName() == this.HandleCardType.AnGang){
                    gangIndex++;
                    gangIndex = gangIndex == 4 ? 0 : gangIndex;
                    if(gangIndex == 0){
                        cardNode.removeAllChildren();
                        if(cardIndex == 3){
                            cardNode.loadTexture("playing/MJ3D/downCard/eat21.png");
                            offSet_y = 0.5;
                        }else  if(cardIndex == 6){
                            cardNode.loadTexture("playing/MJ3D/downCard/eat51.png");
                            offSet_y = 0.43;
                            offSet_x = -0.01;
                        }else if(cardIndex == 9){
                            cardNode.loadTexture("playing/MJ3D/downCard/eat81.png");
                            offSet_y = 0.58;
                            offSet_x = -0.01;
                        }else if(cardIndex == 12){
                            cardNode.loadTexture("playing/MJ3D/downCard/eat111.png");
                            offSet_y = 0.5;
                        }
                    }else{
                        cardIndex++;
                        cardNode.loadTexture("playing/MJ3D/downCard/eat" + cardIndex + ".png");
                    }

                    if(i == 0){
                        cardNode.x = start_x;
                    }else if(gangIndex == 0){
                        if(cardIndex < 6){
                            cardNode.x = cardArray[i - 2].x * (0.97 + offSet_x);
                        }else{
                            cardNode.x = cardArray[i - 2].x * (1 + offSet_x);
                        }
                    }else if(gangIndex == 1){
                        cardNode.x = cardArray[i - 2].x + cardArray[i - 2].getScale() * cardArray[i - 1].width*0.9;
                    }else{
                        add_x = 0;
                        if(cardIndex == 2){
                            add_x -= 0.05;
                        }else if(cardIndex == 3){
                            add_x -= 0.05;
                        }else if(cardIndex == 5){
                            add_x -= 0.01;
                        }else if(cardIndex == 6){
                            add_x -= 0.01;
                        }
                        cardNode.x = cardArray[i - 1].x + cardArray[i - 1].getScale() * cardArray[i - 1].width * (0.75 + add_x);
                    }

                }else if(cardNode.getName() == this.HandleCardType.Chi || cardNode.getName() == this.HandleCardType.Peng){
                    cardIndex++;
                    pengIndex++;
                    pengIndex = pengIndex == 3 ? 0 : pengIndex;
                    cardNode.loadTexture("playing/MJ3D/downCard/eat" + cardIndex + ".png");

                    if(i == 0){
                        cardNode.x = start_x;
                    }else if(cardArray[i - 1].name != this.HandleCardType.Chi && cardArray[i - 1].name != this.HandleCardType.Peng){
                        cardNode.x = cardArray[i - 1].x + templetEatCard.getScale() * templetEatCard.width * 2.3;
                    }else if(pengIndex == 1) {
                        cardNode.x = cardArray[i - 1].x + templetEatCard.getScale() * templetEatCard.width * 1.3;
                    }else {
                        cardNode.x = cardArray[i - 1].x + templetEatCard.getScale() * templetEatCard.width * 0.95;
                    }

                    if(cardNode.getName() == this.HandleCardType.Chi){
                        chiIndex++;
                    }
                    if(pengIndex == 2){
                        this.setCardArrow3D(cardNode, player, chiIndex);
                    }
                }

                cardNode.ignoreContentAdaptWithSize(true);
                cardNode.setScale(templetEatCard.scale * 1.2 * 1.5);
                cardNode.setPositionY(templetEatCard.y * (1.3 + offSet_y));

                var skewArray = [17, 16, 14, 10, 9, 8, 4, 2, 0, -3, -5, -6];
                var posOffSetArray =  [0.48, 0.48, 0.48, 0.48, 0.48, 0.48, 0.46, 0.47, 0.49, 0.49, 0.49, 0.49];
                if(cardNode.isCut){
                    skewArray = [5, 4, 3, 2, -2, -3, -5, -7];
                    posOffSetArray = [0.48, 0.48, 0.48, 0.48, 0.48, 0.48, 0.46, 0.47, 0.49, 0.49, 0.49, 0.49, 0.49, 0.49];
                }

                children = cardNode.children;
                for(k = 0; k < children.length; k++){
                    child = children[k];
                    if (child.ignoreContentAdaptWithSize) {
                        child.ignoreContentAdaptWithSize(true);
                    }

                    child.setScale(0.58);
                    child.setPosition(cardNode.width * posOffSetArray[cardIndex - 1], cardNode.height * 0.66);

                    if(cardIndex > 0){
                        child.setSkewX(skewArray[cardIndex - 1]);
                    }

                    if(child.getName() == "laiZi"){
                        child.setPosition(child.x * 1.2,child.y * 1.05);
                    }
                    if(child.getName() == "arrow"){
                        child.setSkewX(0);
                    }
                }
            }
        },


        updateTopEatAndHandCards3D: function (cardArray) {
            var playerNode = cardArray[0].getParent();
            var templetEatCard = playerNode.getChildByName(this.CsdDefaultCardType.EatCardFront);
            var player = this.getPlayerInfoByName(playerNode.getName());

            var cardIndex = 0, pengIndex = 0, gangIndex = 0, handIndex = 0, chiIndex = 0, children, i, k, child, add_x, oneCardWith;
            var start_x = cc.winSize.width * (this.isIPad() ? 0.77 : 0.74);

            var setCardSpirteTop = function (cardNode, index) {
                if(index <= 0) index = 1;
                if(index >= 12) index = 12;
                cardNode.loadTexture("playing/MJ3D/top/top" + (13 - index) + ".png");
            };

            //计算当前的手牌张数
            var currentHandCount = 0;
            for (i = cardArray.length - 1;i >= 0;i--) {
                if(cardArray[i] && cardArray[i].getName() == this.HandleCardType.Hand) {
                    currentHandCount++;
                }
            }

            //如果是轮到自己出牌，排除新摸的这张牌，这张牌另外固定放置位置，防止整个手牌位置移来移去的
            if(currentHandCount % 3 === 2) {
                currentHandCount -= 1;
            }

            for (i = cardArray.length - 1;i >= 0;i--) {
                var cardNode = cardArray[i];
                cardNode.visible = true;
                if (cardNode.getName() == this.HandleCardType.Hand) {
                    if (oneCardWith === undefined) {
                        oneCardWith = cardNode.getScale() * cardNode.width * 0.82;
                    }

                    handIndex++;
                    if(handIndex == 1){
                        var handStartX = cc.winSize.width * (this.isIPad()? 0.4 : 0.45) + oneCardWith * currentHandCount;
                        //优化手牌排列方式，根据当前的牌的张数来显示,从左对齐
                        cardNode.x = handStartX;

                    }else{
                        cardNode.x = cardArray[i + 1].x - oneCardWith * 0.98;
                    }
                    continue;
                } else if (cardNode.name == this.HandleCardType.Chi && cardNode.isCut) {
                    cardIndex++;
                    //最右边的那张牌
                    if(cardIndex == 1){
                        cardNode.x = start_x * 0.83;
                    }

                    setCardSpirteTop(cardNode, (cardIndex + 2));

                    if(cardArray[i + 1] && (cardArray[i + 1].name != this.HandleCardType.Chi ||
                        (cardArray[i + 1].name == this.HandleCardType.Chi && !cardArray[i + 1].isCut)))
                    {
                        cardNode.x = cardArray[i + 1].x -  cardArray[i + 1].getScale() * cardArray[i + 1].width * 1.1;
                    }else if(player.mjhand && player.mjhand.length % 3 == 2 && i == 0 && player.isZiMo == true){
                        cardNode.x = cardArray[i + 1].x - cardArray[i + 1].getScale() * cardArray[i + 1].width * 1.0;
                    }else  if(i < cardArray.length - 1 && cardIndex != 1){
                        cardNode.x = cardArray[i + 1].x - cardArray[i + 1].getScale() * cardArray[i + 1].width * 0.7;
                    }
                } else if (cardNode.getName() == this.HandleCardType.MingGang || cardNode.getName() == this.HandleCardType.PengGang) {
                    gangIndex++;
                    gangIndex = gangIndex == 4 ? 0 : gangIndex;
                    if(gangIndex == 1){

                    }else{
                        cardIndex++;
                    }
                    setCardSpirteTop(cardNode, cardIndex);
                    cardNode.y = templetEatCard.y;
                    //最右边的那张牌
                    if(cardIndex == 1){
                        cardNode.x = start_x;
                    }

                    if(cardArray[i + 1] && cardArray[i + 1].name != this.HandleCardType.MingGang && cardArray[i + 1].name != this.HandleCardType.PengGang){
                        cardNode.x = cardArray[i + 1].x -  cardArray[i + 1].getScale() * cardArray[i + 1].width * 0.2;
                    }else  if(i < cardArray.length - 1 && cardIndex != 1){
                        if(gangIndex == 1){
                            cardNode.x = cardArray[i + 1].x - cardArray[i + 1].getScale() * cardArray[i + 1].width * 0.3;
                        }else{
                            cardNode.x = cardArray[i + 1].x - cardArray[i + 1].getScale() * cardArray[i + 1].width * 0.7;
                        }
                    }

                    if(cardNode.getChildByName("arrow")){
                        cardNode.removeChildByName("arrow");
                    }
                    if(gangIndex == 0){
                        cardArray[i + 3].x = cardArray[i + 1].x;
                        cardArray[i + 3].y +=  cardArray[i + 1].getScale() * cardArray[i + 1].height * 0.25;
                        cardArray[i + 3].zIndex = cardArray[i + 1].zIndex + 10;
                        this.setCardArrow3D(cardArray[i + 3], player, chiIndex);
                        if(cardArray[i + 3].getChildByName("arrow")){
                            cardArray[i + 3].getChildByName("arrow").setScale(0.28);
                        }
                    }
                } else if (cardNode.getName() == this.HandleCardType.AnGang) {
                    gangIndex++;
                    gangIndex = gangIndex == 4 ? 0 : gangIndex;
                    if(gangIndex == 1){
                        if(cardIndex == 0){
                            cardNode.loadTexture("playing/MJ3D/top/top11-1.png");
                        }else  if(cardIndex == 3){
                            cardNode.loadTexture("playing/MJ3D/top/top8-1.png");
                        }else if(cardIndex == 6){
                            cardNode.loadTexture("playing/MJ3D/top/top5-1.png");
                        }else if(cardIndex == 9){
                            cardNode.loadTexture("playing/MJ3D/top/top2-1.png");
                        }
                    }else{
                        cardIndex++;
                        setCardSpirteTop(cardNode, cardIndex);
                    }
                    cardNode.y = templetEatCard.y;
                    //最右边的那张牌
                    if(cardIndex == 1){
                        cardNode.x = start_x;
                    }
                    if(cardArray[i + 1] && cardArray[i + 1].name != this.HandleCardType.AnGang){
                        cardNode.x = cardArray[i + 1].x -  cardArray[i + 1].getScale() * cardArray[i + 1].width * 0.2;
                    }else  if(i < cardArray.length - 1 && cardIndex != 1){
                        if(gangIndex == 1) {
                            cardNode.x = cardArray[i + 1].x - cardArray[i + 1].getScale() * cardArray[i + 1].width * 0.2;
                        }else{
                            cardNode.x = cardArray[i + 1].x - cardArray[i + 1].getScale() * cardArray[i + 1].width * 0.7;
                        }
                    }
                    if(cardNode.getChildByName("cardImg")){
                        cardNode.getChildByName("cardImg").visible = true;
                    }
                    if(gangIndex === 0){
                        cardArray[i + 3].x = cardArray[i + 1].x - cardArray[i + 1].getScale() * cardArray[i + 1].width * 0.01;
                        cardArray[i + 3].y += cardArray[i + 1].getScale() * cardArray[i + 1].height * 0.25;
                        cardArray[i + 3].zIndex = cardArray[i + 1].zIndex + 10;
                        if(cardArray[i + 3].getChildByName("cardImg")){
                            cardArray[i + 3].getChildByName("cardImg").visible = false;
                        }
                    }
                    cardNode.zIndex = 100 + i;
                } else if (cardNode.name == this.HandleCardType.Chi || cardNode.name == this.HandleCardType.Peng) {
                    cardIndex++;
                    pengIndex++;
                    pengIndex = pengIndex == 3 ? 0 : pengIndex;
                    //最右边的那张牌
                    if(cardIndex == 1){
                        cardNode.x = start_x;
                    }

                    setCardSpirteTop(cardNode, cardIndex);

                    if(cardArray[i + 1] && cardArray[i + 1].name != this.HandleCardType.Chi && cardArray[i + 1].name != this.HandleCardType.Peng){
                        cardNode.x = cardArray[i + 1].x -  cardArray[i + 1].getScale() * cardArray[i + 1].width * 1.1;
                    }else  if(i < cardArray.length - 1 && cardIndex != 1){
                        if(pengIndex == 1){
                            cardNode.x = cardArray[i + 1].x - cardArray[i + 1].getScale() * cardArray[i + 1].width * 1.1;
                        }else {
                            cardNode.x = cardArray[i + 1].x - cardArray[i + 1].getScale() * cardArray[i + 1].width * 0.7;
                        }
                    }
                    if(cardNode.getName() == this.HandleCardType.Chi){
                        chiIndex++;
                    }
                    if(pengIndex == 2){
                        this.setCardArrow3D(cardNode, player, chiIndex);
                    }
                }

                cardNode.ignoreContentAdaptWithSize(true);
                cardNode.setScale(templetEatCard.scale * 1.2 * 3.2);

                //平行四边形拉伸度
                var skewArray = [-14, -13, -12,-11, -9, -8, -6, -5, -4, 0, 1, 2];
                if (cardNode.isCut) {
                    skewArray = [-14, -13, -12,-11, -9, -8, -6, -5, -4, 0, 1, 2, 2, 2];
                }
                children = cardNode.children;
                for (k = 0; k < children.length; k++) {
                    child = children[k];
                    if (child.ignoreContentAdaptWithSize) {
                        child.ignoreContentAdaptWithSize(true);
                    }
                    child.setScale(0.26);
                    child.setPosition(cardNode.width * 0.5, cardNode.height * 0.645);

                    var skewValue = skewArray[cardIndex - 1];
                    if (cardIndex == 0) {
                        skewValue = skewArray[1];
                    }
                    child.setSkewX(skewValue);
                    if (child.getName() == "arrow") {
                        child.setSkewX(0);
                    }
                }
            }

            // 新牌隔开
            var isPlayAct = false;
            if(handIndex % 3 === 2){
                var cardWith = cardArray[handIndex - 1].scale * cardArray[handIndex - 1].width;
                var firstCard = cardArray[0];
                var firstCardX = firstCard.x - cardWith * 0.5;
                var firstCardY = firstCard.y;
                isPlayAct = this.playNewCardAction("node_top", firstCard, cc.p(firstCardX, firstCardY));
                if (!isPlayAct) {
                    firstCard.x = firstCardX;
                    firstCard.y = firstCardY;
                }
            }
        },
    });
}());




























