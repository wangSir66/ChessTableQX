/***
 * 平江扎鸟，新框架牌桌逻辑
 * @type {void | Class | *}
 */

var majiang_panel_pingjiangzhaniao;
(function () {
    majiang_panel_pingjiangzhaniao = majiang_panel_yueyang.extend({

        jsonFile: "Play_pingjiangzhaniao_new.json",
        getJsBind: function(){
            var jsBind = {
                node_eat:{
                    btn_peng: {
                        _visible: false,
                        _touch: function (sender, eventType) {
                            if(eventType === ccui.Widget.TOUCH_ENDED){
                                if (MjClient.playui.pengCards.length > 1) {
                                    var showCardsNode = MjClient.playui.jsBind.node_eat.node_showCards._node;
                                    showCardsNode.getChildByName("img_showCardsBg").showPengCards();
                                    return;
                                }
                                var tData = MjClient.data.sData.tData;
                                var player = MjClient.playui.getPlayerInfoByOff(0);
                                if (player.eatFlag & 8) {
                                    MjClient.showMsg("确认不胡吗?", function(){
                                        MjClient.playui.sendPengToServer(tData.lastPutCard);
                                        MjClient.playui.hideEatNodeChildren();
                                    }, function() {MjClient.playui.hasClickBtn = false;}, "1");
                                } else {
                                    MjClient.playui.sendPengToServer(tData.lastPutCard);
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
                                MjClient.playui.isKaiGang = false; 
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
                                    }, function () {MjClient.playui.hasClickBtn = false;}, "1");
                                } else {
                                    MjClient.playui.sendGangToServer(MjClient.playui.gangCardArray[0]);
                                    MjClient.playui.hideEatNodeChildren();
                                }
                            }
                        }
                    },
                    btn_gang1: {
                        _visible: false,
                        _touch: function(sender,eventType){
                            if (eventType === ccui.Widget.TOUCH_BEGAN) {
                                MjClient.playui.hasClickBtn = true;
                            }
                            if (eventType === ccui.Widget.TOUCH_CANCELED) {
                                MjClient.playui.hasClickBtn = false;
                            }
                            if (eventType === ccui.Widget.TOUCH_ENDED) {
                                MjClient.playui.isKaiGang = true;
                                if (MjClient.playui.kaiGangCards.length > 1) {
                                    var showCardsNode = MjClient.playui.jsBind.node_eat.node_showCards._node;
                                    showCardsNode.getChildByName("img_showCardsBg").showGangCards();
                                    return;
                                }

                                var player = MjClient.playui.getPlayerInfoByName("node_down");
                                if (player.eatFlag & 8) {
                                    MjClient.showMsg("确认不胡吗?", function () {
                                        MjClient.playui.showShaiziAniForDami(0);
                                        MjClient.playui.sendGangToServer(MjClient.playui.kaiGangCardArry[0],MjClient.playui.isKaiGang);
                                        MjClient.playui.hideEatNodeChildren();
                                    }, function () {MjClient.playui.hasClickBtn = false;}, "1");
                                } else {
                                    MjClient.playui.showShaiziAniForDami(0);
                                    MjClient.playui.sendGangToServer(MjClient.playui.kaiGangCardArry[0],MjClient.playui.isKaiGang);
                                    MjClient.playui.hideEatNodeChildren();
                                }
                            }
                        }
                    },
                    btn_chi:{
                        _visible: false,
                        _touch: function(sender,eventType){
                                if(eventType === ccui.Widget.TOUCH_ENDED){

                                if (MjClient.playui.chiCards.length > 1) {
                                    var showCardsNode = MjClient.playui.jsBind.node_eat.node_showCards._node;
                                    showCardsNode.getChildByName("img_showCardsBg").showKaiGangChiCards();
                                    return;
                                }
                                cc.log("吃牌位置长度",MjClient.playui.eatCardArray);
                                if (MjClient.playui.eatCardArray.length > 1) {
                                    var showCardsNode = MjClient.playui.jsBind.node_eat.node_showCards._node;
                                    showCardsNode.getChildByName("img_showCardsBg").showEatCards();
                                    return;
                                }
                                var tData = MjClient.data.sData.tData;
                                var eatPos = MjClient.playui.eatCardArray;
                                var player = MjClient.playui.getPlayerInfoByOff(0);
                                if (player.eatFlag & 8) {
                                    MjClient.showMsg("确认不胡吗?", function(){
                                        MjClient.playui.sendChiToServer(eatPos[0],tData.lastPutCard);
                                        MjClient.playui.hideEatNodeChildren();
                                    }, function() {MjClient.playui.hasClickBtn = false;}, "1");
                                } else {
                                    MjClient.playui.sendChiToServer(eatPos[0],tData.lastPutCard);
                                    MjClient.playui.hideEatNodeChildren();
                                }
                            }
                        }
                    },
                    btn_hu:{
                        _visible: false,
                        _touch: function(sender,eventType){
                                if(eventType === ccui.Widget.TOUCH_ENDED){
                                var huTag = 0;
                                var tData = MjClient.data.sData.tData;
                                var player = MjClient.playui.getPlayerInfoByOff(0);
                                if (MjClient.playui.huCards.length >= 1) {
                                    huTag = MjClient.playui.huCards[0];
                                }else{
                                    if (MjClient.playui.isTurnMe()) {
                                       huTag = player.mjhand[player.mjhand.length - 1]
                                    }else{
                                        huTag = tData.lastPutCard;
                                    }
                                }
                                MjClient.playui.sendHuToServer(huTag);
                                MjClient.playui.hideEatNodeChildren();
                            }
                        }
                    },
                    btn_dami:{
                        _visible:false,
                        _touch:function(sender,eventType){
                            if (eventType === ccui.Widget.TOUCH_ENDED) {
                                MjClient.gamenet.request("pkroom.handler.tableMsg", {
                                    cmd: "MJBBhu"
                                });
                            }
                        }
                    },
                    node_showCards: {
                        img_showCardsBg: {
                            showGangCards: function(){
                                this.showCards();
                                this.visible = true;
                                var cardArr = MjClient.playui.gangCardArray;
                                if (MjClient.playui.isKaiGang && MjClient.playui.kaiGangCardArry) {
                                    cardArr = MjClient.playui.kaiGangCardArry;
                                }
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
                                                MjClient.playui.sendGangToServer(sender.tag,MjClient.playui.isKaiGang);
                                                MjClient.playui.hideEatNodeChildren();
                                                self.getParent().visible = false;
                                            }
                                        }, card);
                                    }
                                }
                            },
                            showEatCards: function(){
                                this.showCards();
                                this.visible = true;
                                var cardArr = MjClient.playui.eatCardArray;
                                this.updateSize(cardArr.length, 3);
                                var startPos = this.getStartPos(cardArr.length, 3);
                                var templatCard = this.getChildByName("img_card");
                                var lastPutCard = MjClient.data.sData.tData.lastPutCard;
                                var self = this;
                                for(var i = 0;i < cardArr.length;i++){
                                    for (var j = 0; j < 3; j ++){
                                        var card = util.clone(templatCard);
                                        if (cardArr[i] == j){
                                            card.color = cc.color(255, 255, 0);
                                        }
                                        card.visible = true;
                                        card.setName(MjClient.playui.HandleCardType.Put);
                                        card.tag = cardArr[i];
                                        var x = startPos.x + j * templatCard.width * templatCard.scale * 0.97;
                                        var y = startPos.y + i * templatCard.height * templatCard.scale;
                                        card.setPosition(cc.p(x, y));
                                        this.addChild(card);
                                        MjClient.playui.updateChiGangCards(card, lastPutCard - cardArr[i] + j);

                                        card.addTouchEventListener(function(sender, eventType){
                                            if(eventType == ccui.Widget.TOUCH_ENDED){
                                                MjClient.playui.sendChiToServer(sender.tag,MjClient.data.sData.tData.lastPutCard);
                                                MjClient.playui.hideEatNodeChildren();
                                                self.visible = false;
                                            }
                                        }, card);
                                    }
                                }
                            },
                            showKaiGangChiCards:function(){
                                this.showCards();
                                this.visible = true;
                                var cardArr = MjClient.playui.eatCardArray;
                                var length = 0;
                                for (var i = 0; i < cardArr.length; i++) {
                                    length += cardArr[i].length;
                                }
                                this.updateSize(length, 3);
                                var startPos = this.getStartPos(length, 3);
                                var templatCard = this.getChildByName("img_card");
                                var lastPutCard = 0;
                                var self = this;
                                for(var k = 0; k < cardArr.length; k++){
                                    lastPutCard = MjClient.playui.chiCards[k];
                                    if (lastPutCard < 1) continue;
                                    for (var i = 0; i < cardArr[k].length; i++) {
                                        for (var j = 0; j < 3; j ++){
                                            var card = util.clone(templatCard);
                                            if (cardArr[k][i] == j){
                                                card.color = cc.color(255, 255, 0);
                                            }
                                            card.visible = true;
                                            card.setName(MjClient.playui.HandleCardType.Put);
                                            card.tag = cardArr[k][i];
                                            var x = startPos.x + j * templatCard.width * templatCard.scale * 0.97;
                                            var y = startPos.y + i * templatCard.height * templatCard.scale;
                                            card.setPosition(cc.p(x, y));
                                            this.addChild(card);
                                            MjClient.playui.updateChiGangCards(card, lastPutCard - cardArr[k][i] + j);

                                            card.addTouchEventListener(function(sender, eventType){
                                                if(eventType == ccui.Widget.TOUCH_ENDED){
                                                    MjClient.playui.sendChiToServer(sender.tag,MjClient.playui.chiCards[k]);
                                                    MjClient.playui.hideEatNodeChildren();
                                                    self.visible = false;
                                                }
                                            }, card);
                                        }
                                    }
                                }
                            },
                            showPengCards:function(){
                                this.showCards();
                                this.visible = true;
                                var cardArr = MjClient.playui.pengCards;
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
                                                MjClient.playui.sendPengToServer(sender.tag);
                                                MjClient.playui.hideEatNodeChildren();
                                                self.getParent().visible = false;
                                            }
                                        }, card);
                                    }
                                }
                            }
                        }
                    }
                },
                panel_jiaPiao:{
                    _layout: [[1, 1], [0.5, 0.3], [0, 0]],
                    _event:{
                        initSceneData: function () {
                            this.setVisible(MjClient.playui.isShowPiaoFenPanel());
                        },
                        waitJiazhu: function(){
                            this.setVisible(MjClient.playui.isShowPiaoFenPanel());
                        },
                        clearCardUI: function () {
                            this.setVisible(false);
                        },
                    },
                    btn_buPiao:{
                        _click: function (sender) {
                            MjClient.playui.handelPiaoFenAndPiaoNiao(0, sender);
                        }
                    },
                    btn_piao1:{
                        _click: function (sender) {
                            MjClient.playui.handelPiaoFenAndPiaoNiao(1, sender);
                        }
                    },
                    btn_piao2:{
                        _click: function (sender) {
                            MjClient.playui.handelPiaoFenAndPiaoNiao(2, sender);
                        }
                    },
                    btn_piao3:{
                        _click: function (sender) {
                            MjClient.playui.handelPiaoFenAndPiaoNiao(3, sender);
                        }
                    },
                },
                text_waitOtherJiaZhu:{
                    _layout: [[0.32, 0.32], [0.5, 0.65], [0, 0]],
                    _visible: false,
                    _event:{
                        initSceneData: function () {
                            var sData = MjClient.data.sData;
                            var tData = sData.tData;
                            var player = MjClient.playui.getPlayerInfoByName("node_down");
                            if(tData.tState === TableState.waitJiazhu && player.mjState !== TableState.waitJiazhu){
                                this.setVisible(true);
                            }
                        },
                        moveHead:function () {
                            this.setVisible(false);
                        },
                        clearCardUI: function () {
                            this.setVisible(false);
                        },
                        showTextWaitOtherJiaZhu: function () {
                            this.setVisible(true);
                        }
                    }
                },
                node_down:{
                    layout_head:{
                        tingIcon:{
                            _visible:false
                        },
                        haidilaotip:{
                            _visible:false,
                            _event: {
                                initSceneData: function() {
                                    this.visible = false;
                                },
                                roundEnd: function()
                                {
                                    var player = MjClient.playui.getPlayerInfoByName("node_down");
                                    if (player && player.haiDiLaoState == 1) 
                                    {
                                        this.visible = true;
                                    }
                                },
                                clearCardUI: function()
                                {
                                    this.visible = false;
                                }
                            }
                        }
                    },
                    node_animation:{
                        _event:{
                            sendKaiGangCard: function(msg){
                                var player = MjClient.playui.getPlayerInfoByName("node_down");
                                if (msg.uid == player.info.uid) 
                                {
                                    MjClient.playui.showOnlyAnimation(this.getParent(),"dami");
                                }
                            },
                            roundEnd:function(){
                                var self = this;
                                self.runAction(cc.sequence(cc.delayTime(2),cc.callFunc(function(){
                                    self.removeAllChildren();}
                                    )));
                            }
                        }
                    },
                    _event:{
                        sendKaiGangCard: function(ed){
                            MjClient.playui.dealKaiGang(this,ed,0);
                            MjClient.playui.sendAutoPutToServer(false);
                            MjClient.playui.updatePlayerEatBtn();
                            MjClient.playui.searchAllTingCards();
                            this.getChildByName("img_tingCards").setTingCards();
                            MjClient.playui.showKaiGangBox(ed.uid);
                        },
                        sendKaiGangCard2:function(msg){
                            MjClient.playui.dealKaiGang(this,ed,0);
                            MjClient.playui.updatePlayerEatBtn();
                            MjClient.playui.searchAllTingCards();
                            this.getChildByName("img_tingCards").setTingCards();
                            MjClient.playui.showKaiGangBox(ed.uid);
                        },
                        MJBBhu: function(eD) {
                            MjClient.playui.showShaiziAniForDami(0);
                            MjClient.playui.dealDaMi(this,eD);
                            if (eD.uid == SelfUid()) 
                            {
                                MjClient.playui.hideEatNodeChildren();
                            }
                        },
                        waitHaiDiLao: function(msg) {
                            //弹窗选择是否捞一把
                            var layer = new laZhangLayer(function(select) {
                                var player = MjClient.playui.getPlayerInfoByName("node_down");
                                player.haiDiLaoState = select ? 1 : 0;
                                MjClient.gamenet.request("pkroom.handler.tableMsg", { 
                                    cmd: "MJSelectHaiDiLao",
                                    haiDiLaoState: player.haiDiLaoState,
                                });
                            });
                            layer.setName("laZhangLayer");
                            if (MjClient.rePlayVideo == -1) 
                            {
                                MjClient.playui.addChild(layer, 99);
                            }
                        },
                        MJSelectHaiDiLao: function(msg) {
                            // 比赛场托管状态服务器会自动做也选择，此时弹窗还没关闭
                            MjClient.playui.removeChildByName("laZhangLayer");
                            var player = MjClient.playui.getPlayerInfoByName("node_down");
                            player.haiDiLaoState = msg.haiDiLaoState;
                        },
                        MJPut:function(msg){
                            MjClient.playui.searchAllTingCards();
                            this.getChildByName("img_tingCards").setTingCards();
                            MjClient.playui.updateTingTips();

                            MjClient.playui.clickGangPass = false;
                            MjClient.playui.clickTingPass = false;
                            MjClient.playui.clickTing = false;
                            MjClient.playui.dealPut(this, msg);
                            if(msg.uid == MjClient.playui.getSelfUid()){
                                MjClient.playui.checkHandCards(this);
                                MjClient.playui.checkPutCards(this);
                                MjClient.playui.updateTingTips();
                            }
                        },
                        MJPass:function(msg){
                            MjClient.playui.dealAutoPutWhenPass(this,msg);
                            MjClient.playui.hasClickBtn = false;
                            MjClient.playui.updateTingTips();
                        },
                        newCard: function(data) {
                            var tData = MjClient.data.sData.tData;
                            var playerNode = MjClient.playui.getNodeByName("node_down");

                            var cardNode = MjClient.playui.createCard(playerNode, MjClient.playui.CsdDefaultCardType.HandCard, 
                                        MjClient.playui.HandleCardType.Hand, data.newCard);
                            cardNode.visible = false;
                            MjClient.playui.searchAllTingCards();
                            MjClient.playui.showKaiGangBox();
                        },
                        waitPut: function(data){
                            var tData = MjClient.data.sData.tData;
                            var player = MjClient.playui.getPlayerInfoByName("node_down");
                            if(tData.uids[tData.curPlayer] == player.info.uid){
                                MjClient.playui.updateColoeAfterSelectCard();
                                MjClient.playui.resetCardLayout(this);
                                MjClient.playui.updateTingTips();
                                MjClient.playui.autoPutAfterTing();
                            }
                            MjClient.playui.showKaiGangBox();
                        },
                        MJChi: function(data) {
                            MjClient.playui.hasClickBtn = false;
                            MjClient.playui.handleCommand(this, data, MjClient.playui.AnimationType.CHI);
                            MjClient.playui.searchAllTingCards();
                            MjClient.playui.updateTingTips();
                            MjClient.playui.showKaiGangBox();
                        },
                        MJGang: function(data) {
                            MjClient.playui.hasClickBtn = false;
                            MjClient.playui.handleCommand(this, data, MjClient.playui.AnimationType.GANG);
                            MjClient.playui.searchAllTingCards();
                            MjClient.playui.updateTingTips();
                            MjClient.playui.showKaiGangBox();
                        },
                        MJPeng: function(data) {
                            MjClient.playui.hasClickBtn = false;
                            MjClient.playui.handleCommand(this, data, MjClient.playui.AnimationType.PENG);
                            MjClient.playui.searchAllTingCards();
                            MjClient.playui.updateTingTips();
                            MjClient.playui.showKaiGangBox();

                        },
                        initSceneData: function(){
                            //一炮多响的倒牌
                            var player = MjClient.playui.getUIPlayerByUID(MjClient.playui.getSelfUid());
                            if(player.mjState != TableState.roundFinish){
                                player.isZiMo = false;
                            }
                            //初始化所有数据
                            MjClient.playui.initGameData();
                            MjClient.playui.updatePlayerCards(this);
                            MjClient.playui.updataClickCancelTingBtn();
                            MjClient.playui.updateCardColorAfterTing(true);
                            MjClient.playui.updatePlayerEatBtn();
                            MjClient.playui.showKaiGangBox();
                            //听牌
                            MjClient.playui.searchAllTingCards();
                            postEvent(MjClient.playui.PlayEventType.SHOW_TING_CARDS);
                            MjClient.playui.updateTingTips();

                            MjClient.playui.cutDownCardsBeforEndOneWhen23D(this);
                        }
                    }
                },
                node_right:{
                    layout_head:{
                        tingIcon:{
                            _visible:false
                        },
                        haidilaotip:{
                            _visible:false,
                            _event: {
                                initSceneData: function() {
                                    this.visible = false;
                                },
                                roundEnd: function()
                                {
                                    var player = MjClient.playui.getPlayerInfoByName("node_right");
                                    if (player && player.haiDiLaoState == 1) 
                                    {
                                        this.visible = true;
                                    }
                                },
                                clearCardUI: function()
                                {
                                    this.visible = false;
                                }
                            }
                        }
                    },
                    node_animation:{
                        _event:{
                            sendKaiGangCard:function(msg){
                                var player = MjClient.playui.getPlayerInfoByName("node_right");
                                if (msg.uid == player.info.uid) 
                                {
                                    MjClient.playui.showOnlyAnimation(this.getParent(),"dami");
                                }
                            },
                            roundEnd:function(){
                                var self = this;
                                self.runAction(cc.sequence(cc.delayTime(2),cc.callFunc(function(){
                                    self.removeAllChildren();}
                                    )));
                            }
                        }
                    },
                    _event:{
                        sendKaiGangCard:function(ed){
                            MjClient.playui.dealKaiGang(this,ed,1);
                        }
                    }
                },
                node_top:{
                    layout_head:{
                        tingIcon:{
                            _visible:false
                        },
                        haidilaotip:{
                            _visible:false,
                            _event: {
                                initSceneData: function() {
                                    this.visible = false;
                                },
                                roundEnd: function()
                                {
                                    var player = MjClient.playui.getPlayerInfoByName("node_top");
                                    if (player && player.haiDiLaoState == 1) 
                                    {
                                        this.visible = true;
                                    }
                                },
                                clearCardUI: function()
                                {
                                    this.visible = false;
                                }
                            }
                        }
                    },
                    node_animation:{
                        _event:{
                            sendKaiGangCard:function(msg){
                                var player = MjClient.playui.getPlayerInfoByName("node_top");
                                if (msg.uid == player.info.uid) 
                                {
                                    MjClient.playui.showOnlyAnimation(this.getParent(),"dami");
                                }
                            },
                            roundEnd:function(){
                                var self = this;
                                self.runAction(cc.sequence(cc.delayTime(2),cc.callFunc(function(){
                                    self.removeAllChildren();}
                                    )));
                            }
                        }
                    },
                    _event:{
                        sendKaiGangCard:function(ed){
                            MjClient.playui.dealKaiGang(this,ed,2);
                        }
                    }
                },
                node_left:{
                    layout_head:{
                        tingIcon:{
                            _visible:false
                        },
                        haidilaotip:{
                            _visible:false,
                            _event: {
                                initSceneData: function() {
                                    this.visible = false;
                                },
                                roundEnd: function()
                                {
                                    var player = MjClient.playui.getPlayerInfoByName("node_left");
                                    if (player && player.haiDiLaoState == 1) 
                                    {
                                        this.visible = true;
                                    }
                                },
                                clearCardUI: function()
                                {
                                    this.visible = false;
                                }
                            }
                        }
                    },
                    node_animation:{
                        _event:{
                            sendKaiGangCard:function(msg){
                                var player = MjClient.playui.getPlayerInfoByName("node_left");
                                if (msg.uid == player.info.uid) 
                                {
                                    MjClient.playui.showOnlyAnimation(this.getParent(),"dami");
                                }
                            },
                            roundEnd:function(){
                                var self = this;
                                self.runAction(cc.sequence(cc.delayTime(2),cc.callFunc(function(){
                                    self.removeAllChildren();}
                                    )));
                            }
                        }
                    },
                    _event:{
                        sendKaiGangCard:function(ed){
                            MjClient.playui.dealKaiGang(this,ed,3);
                        }
                    }
                },
                node_wait:{
                    checkBox_autoPut:{
                        _event:{
                            MJPass: function(msg) {
                                var selfNode = MjClient.playui.jsBind.node_down._node;
                                MjClient.playui.dealAutoPutWhenPass(selfNode,msg);
                            }
                        }
                    }
                },
                layout_roundInfo2D:{
                    img_cardNum:{
                        text_cardNum:{
                            _event:{
                                sendKaiGangCard:function(){
                                    this.setString(this.getCardNum());
                                }
                            }
                        }
                    }
                },
                layout_roundInfo3D:{
                    image_cardNumBg:{
                        text_cardNum:{
                            _event:{
                                sendKaiGangCard:function(){
                                    this.setString(this.getCardNum());
                                }
                            }
                        }
                    }
                },
                node_kaiGangKuang:{
                    _visible:false,
                    _layout: [[0.3, 0.3], [0.5, 0.5], [0, 0]],
                    _event:{
                        sendKaiGangCard:function(msg){
                            MjClient.playui.showKaiGangBox(msg.uid);
                        },
                        roundEnd:function(){
                            this.visible = false;
                        },
                        clearCardUI:function(){
                            this.visible = false;
                        },
                        waitPut:function(){
                            this.visible = false;
                        }

                    }
                },
                node_NiaoPai:{
                    _visible:false,
                    _layout:[[0.1, 0.1], [0.5, 0.5], [0, 0]],
                    _event:{
                        roundEnd:function()
                        {
                            this.setVisible(false);
                            setWgtLayout(this,[0.1, 0.1], [0.5, 0.5], [0, 0]);
                        }
                    }
                },
                node_haiDikuang:{
                    _visible:false,
                    _layout: [
                        [0.20, 0.29],
                        [0.5, 0.35],
                        [0, 0.4],
                    ],
                    _event: 
                    {
                        clearCardUI: function(eD) {
                            this.visible = false;
                        }
                    }
                }
            };
            return jsBind;
        },

        ctor: function(){
            var jsonFile = this.jsonFile;
            this._super(majiang_panel_pingjiangzhaniao, jsonFile);
            this.bindShowInfo();
            return true;
        },
        //重置开杠数据
        initKaiGangData: function(){
            this.kaiGangCardArry = [];
            this.isKaiGang = false;
            this.pengCards = [];
            this.chiCards = [];
            this.huCards = [];
            this.gangCards = [];
            this.kaiGangCards = [];
        },
        // override 是否显示红中癞子牌
        isHunCardShow: function(){
            return false;
        },

        getGameBgList: function(is3D) {
            if(is3D){ // 3dBG资源
                return ["playing/gameTable/beijing3D_1.jpg", "playing/gameTable/beijing3D_2.jpg",
                "playing/gameTable/beijing3D_3.jpg", "playing/gameTable/beijing3D_4.jpg"];
            }
            return ["playing/gameTable/beijing_1.png", "playing/gameTable/beijing_2.jpg",
            "playing/gameTable/beijing_3.jpg", "playing/gameTable/beijing_6.png"];
        },
        // override 是否显示红中癞子牌
        isHunCardShow3D: function(){
            return true;
        },

        // override 是否开启显示最多听牌标识
        isShowMaxTingCards: function(){
            return true;
        },
        // 返回是否显示飘分层牌【自由下飘, 首局定飘】
        isShowPiaoFenPanel: function () {
            var sData = MjClient.data.sData;
            var tData = sData.tData;
            var player = MjClient.playui.getPlayerInfoByName(this.NodeNameArray[0]);
            var isShow = tData.areaSelectMode.jiapiao;
            return !!(isShow && tData.tState === TableState.waitJiazhu && player && player.mjState === TableState.waitJiazhu);
        },

        // 返回是否显示飘鸟层牌【围一飘鸟】
        isShowPiaoNiaoPanel: function(msg){
            return false;
        },

        // 处理飘鸟层按钮【首局 扎鸟 不扎】【次局 戳哒 不戳】
        processPiaoNiaoPanel: function(piaoNiaoPanel, msg){
            var player = MjClient.playui.getPlayerInfoByName(this.NodeNameArray[0]);
            if(!player) return;
            var selfUid = player.info.uid;
            var btnBuChuo = piaoNiaoPanel.getChildByName("btn_buchuo");
            var btnChuoDa = piaoNiaoPanel.getChildByName("btn_chuoda");
            if((msg && cc.isArray(msg.chuoId) && msg.chuoId.indexOf(selfUid) >= 0 && player.jiazhuNum === 2) || !msg && player.jiazhuNum > 0){
                btnBuChuo.loadTextures("playing/gameTable/buchuo_n.png", "playing/gameTable/buchuo_s.png");
                btnChuoDa.loadTextures("playing/gameTable/chuoda_n.png", "playing/gameTable/chuoda_s.png");
            }else{
                btnBuChuo.loadTextures("playing/gameTable/buzha_n.png", "playing/gameTable/buzha_s.png");
                btnChuoDa.loadTextures("playing/gameTable/zhaniao_n.png", "playing/gameTable/zhaniao_s.png");
            }
        },  

        // 飘分,飘鸟按钮回调【统称为jiazhu】
        handelPiaoFenAndPiaoNiao: function(index, sender){
            MjClient.playui.sendJiaZhuToServer(index, MjClient.playui.getSelfUid());
            sender.parent.setVisible(false);
            postEvent("showTextWaitOtherJiaZhu");
            this.getPlayerInfoByName("node_down").mjState = TableState.isReady;
        },

        // 绑定头像下部飘分
        bindShowInfo: function(){
            for(var i = 0; i < this.NodeNameArray.length; i++){
                var nodeName = this.NodeNameArray[i];
                this.handelTextPiao(nodeName);
            }
        },
        // 处理点飘显示
        handelTextPiao: function (nodeName) {

            var playerNode = MjClient.playui.getNodeByName(nodeName);

            var showTextPiao = function (textNode, needAnim) {
                var tData = MjClient.data.sData.tData;
                var player = MjClient.playui.getPlayerInfoByName(nodeName);
                var string;
                if(!tData || !player || tData.tState === TableState.waitJiazhu || player.jiazhuNum === undefined || player.jiazhuNum <= 0){
                    return textNode.visible = false;
                }

                textNode.visible = true;
                if(tData.areaSelectMode.piaoniao){
                    string = "鸟" + player.jiazhuNum + "分";
                }else{
                    string = "飘" + player.jiazhuNum + "分";
                }
                textNode.ignoreContentAdaptWithSize(true);
                textNode.setString(string);

                var palyerNode = textNode.getParent().getParent();
                if(cc.sys.isObjectValid(palyerNode) && needAnim){
                    var endPos = textNode.getPosition();    
                    var anim = palyerNode.getChildByName("node_animation");
                    var worldPos = anim.convertToWorldSpace(palyerNode.getPosition());
                    var startPos = textNode.convertToNodeSpace(worldPos);
                    textNode.setPosition(startPos);
                    textNode.runAction(cc.sequence(
                        cc.fadeIn(0.01),
                        cc.scaleTo(0.01, 2),
                        cc.delayTime(2),
                        cc.spawn(
                            cc.moveTo(0.3, endPos),
                            cc.scaleTo(0.3, 1)
                        )
                    ));
                }
            };

            var jsBind = {
                layout_head:{
                    text_piao:{
                        _visible: false,
                        _event:{
                            clearCardUI: function() {
                                this.visible = false;
                            },
                            mjhand: function () {
                                showTextPiao(this, true);
                            },
                            initSceneData: function () {
                                showTextPiao(this);
                            }
                        }
                    }
                }
            };
            util.bindUiAndLogicMajiang(playerNode, jsBind);
        },
        // @Override  end事件的处理,【拖出去牌过胡提示, 红中打出去需要提示】
        handlerWhenCardTouchEnded: function (cardNode, cardTag) {
            var that = this;
            var player = MjClient.playui.getPlayerInfoByName("node_down");
            var isShow = util.localStorageEncrypt.getBoolItem(this.guoHuTipPopup, true);
            if(isShow && player && player.eatFlag & 8){
                MjClient.showMsg("确定不胡吗?", function (data) {
                    if(data) util.localStorageEncrypt.setBoolItem(that.guoHuTipPopup, !data.isSelect);
                    that.putOutCard(cardNode, cardTag);
                    that.sendPassToServer();
                }, function (data) {
                    if(data) util.localStorageEncrypt.setBoolItem(that.guoHuTipPopup, !data.isSelect);
                    MjClient.movingCard = null;
                    that.resetCardLayout(that.getNodeByName("node_down"));
                }, "3");

            }else if(this.isHunCard(cardNode.tag)){
                MjClient.showMsg("确定要打出红中吗? ", function () {
                    that.putOutCard(cardNode, cardTag);
                }, function () {
                    MjClient.movingCard = null;
                    that.resetCardLayout(that.getNodeByName("node_down"));
                }, "1");

            }else{
                this.putOutCard(cardNode, cardTag);
            }
        },
        //@Override 获得玩家可操作的按钮
        getPlayerEatNode: function() {
            var sData = MjClient.data.sData;
            var tData = sData.tData;
            var player = sData.players[this.getSelfUid()];
            var eat = MjClient.playui.jsBind.node_eat;
            var bihuType = tData.areaSelectMode.bihuType;
            var nodeArr = [];
            this.gangCardArray = [];
            this.eatCardArray = [];
            this.kaiGangCardArry = [];
            player.isZiMoHu = false;
            this.initKaiGangData();

            if (player.isBBHu && (tData.tState == TableState.waitEat || tData.tState == TableState.waitPut)) 
            {
                return this.getPlayerEatNodeWhenBanBanHu();
            }

            if (tData.kaigangs && tData.kaigangs.length > 0 && tData.isKaigang){
                return this.getPlayerEatNodeWhenKaiGang();
            }

            if(this.isTurnMe()){
                //杠
                if(this.checkGangBtn(player) && !this.clickGangPass){
                    nodeArr.push(eat.btn_gang._node);
                }

                cc.log("开杠");
                //开杠
                if (this.checkKaiGangBtn(player) && !this.clickGangPass) 
                {
                    nodeArr.push(eat.btn_gang1._node);
                }

                if (this.checkTingBtn(player)) {
                    nodeArr.push(eat.btn_dami._node);
                }

                //胡
                if (player.eatFlag & 8 && player.isNew) {
                    nodeArr.push(eat.btn_hu._node);
                    if(bihuType && player.isNew) player.isZiMoHu = true;
                }
            }else{
                if (player.eatFlag & 8) {
                    nodeArr.push(eat.btn_hu._node);
                }

                if (player.eatFlag & 4 ) {
                    nodeArr.push(eat.btn_gang._node);
                    this.gangCardArray.push(tData.lastPutCard);

                    if (player.kaigangList > 0) {
                        nodeArr.push(eat.btn_gang1._node);
                        this.kaiGangCardArry.push(tData.lastPutCard);
                    }
                }

                if (player.eatFlag & 2) {
                    nodeArr.push(eat.btn_peng._node);
                }

                if (player.eatFlag & 1) {
                    this.eatCardArray = player.canEat || [];
                    this.chiCards.push(tData.lastPutCard);
                    nodeArr.push(eat.btn_chi._node);
                }
            }

            if(nodeArr.length > 0){
                nodeArr.push(eat.btn_guo._node);
            }

            if(player.eatFlag & 8 && bihuType){
                nodeArr.splice(-1, 1);
            }
            this.reloadBtnTexture(nodeArr);
            return nodeArr;
        },        
        //@Override 开杠时按钮检测
        getPlayerEatNodeWhenKaiGang: function() {
            var sData = MjClient.data.sData;
            var tData = sData.tData;
            var player = sData.players[this.getSelfUid()];
            var eat = MjClient.playui.jsBind.node_eat;
            var bihuType = tData.areaSelectMode.bihuType;
            var nodeArr = [];
            this.gangCardArray = [];
            this.eatCardArray = [];
            player.isZiMoHu = false;
            this.initKaiGangData();

            var isKaiGangAfterSelfAnGang = tData.uids[tData.curPlayer] == player.info.uid;
            var mustHu = false;

            var eatFlag = player.eatFlag;
            var lastPutCard = tData.lastPutCard;

            cc.log("eatFlag  ",eatFlag);

            if (eatFlag & 8) {
                nodeArr.push(eat.btn_hu._node);
                if (this.huCards.indexOf(lastPutCard) == -1)
                    this.huCards.push(lastPutCard);

                //杠上炮必胡
                mustHu = true;
            }

            if ((eatFlag & 4) && player.kaigangList.length > 0) {
                nodeArr.push(eat.btn_gang1._node);
                if (this.kaiGangCards.indexOf(lastPutCard) == -1)
                    this.kaiGangCards.push(lastPutCard);
            }

            if (!player.isTing) {
                if (eatFlag & 4) {
                    nodeArr.push(eat.btn_gang._node);
                    if (this.gangCards.indexOf(lastPutCard) == -1)
                        this.gangCards.push(lastPutCard);
                }
            }

            if (eatFlag & 2) {
                nodeArr.push(eat.btn_peng._node);
                if (this.pengCards.indexOf(lastPutCard) == -1)
                    this.pengCards.push(lastPutCard);
            }

            if (eatFlag & 1) {
                var eatpos = player.canEat || [];
                if (eatpos.length > 0) {
                    nodeArr.push(eat.btn_chi._node);
                    if (this.chiCards.indexOf(lastPutCard) == -1) {
                        this.eatCardArray.push(eatpos);
                        this.chiCards.push(lastPutCard);
                    }
                }
            }

            if (nodeArr.length > 0) {
                if(mustHu == false){
                    nodeArr.push(eat.btn_guo._node);
                }
            } else {
                player.mjState = TableState.waitCard;
            }
            return nodeArr;
        },
        //板板胡按钮检测
        getPlayerEatNodeWhenBanBanHu: function(){
            var sData = MjClient.data.sData;
            var tData = sData.tData;
            var player = sData.players[this.getSelfUid()];
            var eat = MjClient.playui.jsBind.node_eat;
            var bihuType = tData.areaSelectMode.bihuType;
            var nodeArr = [];
            this.gangCardArray = [];
            this.eatCardArray = [];
            player.isZiMoHu = false;
            this.initKaiGangData();

            nodeArr.push(eat.btn_hu._node);
            nodeArr.push(eat.btn_dami._node);

            if(this.checkGangBtn(player) && !this.clickGangPass){
                nodeArr.push(eat.btn_gang._node);
            }
            if (nodeArr.length > 0) {
                nodeArr.push(eat.btn_guo._node);
            }
            return nodeArr;
        },
        //@Override 刷新玩家操作按钮,父类方法不适用于开杠检测
        updatePlayerEatBtn: function(){
            this.hideEatNodeChildren();
            
            var sData = MjClient.data.sData;
            var tData = sData.tData;
            var player = sData.players[this.getSelfUid()];

            if( player.mjState == TableState.waitEat ||
                player.mjState == TableState.waitPut &&
                sData.tData.uids[sData.tData.curPlayer] == SelfUid())
            {

            }else{
                return;
            }
            cc.log("刷新按钮");
            var eatNodeArr = this.getPlayerEatNode();
            var btnScale = this.isIPad() ? 0.1 : 0.14;
            // var spaceScale = this.isIPad() ? 1.4 : 1.5;
            var off_y = this.isIPad() ? 1.7 : 1.8;

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
                setWgtLayout(btn, [0, btnScale], [pct, 0.025], [0, off_y], false, false);
            }

            if (player.haiDiLaoState == 1 || MjClient.majiang.getAllCardsTotal() - tData.cardNext <= 0)
            {
                var eat = MjClient.playui.jsBind.node_eat;
                if (eatNodeArr.indexOf(eat.btn_hu._node) != -1)
                {
                    eatNodeArr = [eat.btn_hu._node];
                    var huTag = player.mjhand[player.mjhand.length - 1]
                    eat.btn_hu._node.stopActionByTag(1);
                    eat.btn_hu._node.runAction(cc.sequence(cc.delayTime(0.8), cc.callFunc(function(){
                        MjClient.playui.sendHuToServer(huTag)}))).tag = 1;
                }
                else if (player.haiDiLaoState == 1)
                {
                    eatNodeArr = [];
                    eat._node.stopActionByTag(1);
                    eat._node.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(function(){
                        MjClient.playui.putOutLastCard()
                    }))).tag = 1;
                }
            }
            MjClient.playui.addLightAniEatBtns(); // 设置麻将的吃碰杠按钮特效
            this.checkBtnWithPlayerFlag();
        },
        //打出最后一张手牌
        putOutLastCard:function(){
            var node = this.getNodeByOff(0);
            var player = this.getPlayerInfoByOff(0);
            var children = node.children;
            for(var i = children.length - 1; i > 0; i--){
                var child = children[i];
                if(child.name == this.HandleCardType.Hand){
                    if (child.tag == player.mjhand[player.mjhand.length - 1]) {
                        this.putOutCard(child,child.tag);
                    }
                }
            }
        },
        /**
         *  began事件时的验证 
         **/
        checkWhenTouchBegan: function(cardNode){
            if(!this.isTurnMe()){
                return true;
            }
            if(MjClient.movingCard !== null && MjClient.movingCard != cardNode){
                return true;
            } 
            var handCount = this.getCardNodeCountByName(cardNode.getParent(), this.HandleCardType.Hand);
            if(handCount % 3 != 2){
                return true;
            }
            // 自动摸打
            var player = MjClient.playui.getPlayerInfoByName("node_down");
            if (player.tPutCard) {
                if (!MjClient.Scene.ToastNodeArray || MjClient.Scene.ToastNodeArray.length == 0) {
                    MjClient.showToast("出牌请先取消自动摸打");
                }
                return true;
            }

            if (player.haiDiLaoState == 1) {
                return true;//海底捞不让出牌；
            }

            return false;
        },
        //过杠检测 加入开杠
        clickPass: function(){
            var that = this;
            if (that.checkWhenPass()){
                return;
            }
            var player = that.getPlayerInfoByOff(0);
            if (that.isTurnMe()){
                var msg = "确认过 ";
                if (that.checkGangBtn(player)){
                    msg += "杠 ";
                }
                if (player.eatFlag & 8){
                    msg += "胡 ";
                }
                msg += "吗?";
                MjClient.showMsg(msg, function(){
                    that.hideEatNodeChildren();
                    that.sendPassToServer();
                    if(that.checkGangBtn(player) || that.checkKaiGangBtn(player)){
                        that.clickGangPass = true;
                    }
                }, function() {}, "1");
            }else{
                if(player.eatFlag & 8){
                    MjClient.showMsg("确认不胡吗?", function(){
                        that.hideEatNodeChildren();
                        that.sendPassToServer();
                    }, function() {}, "1");
                }else{
                    that.hideEatNodeChildren();
                    that.sendPassToServer();
                }
            }
        },
        //@Override 检测杠牌数据
        checkGangBtn: function(player) {
            var tData = MjClient.data.sData.tData;
            this.gangCardArray = player.gangList || [];
            for (var i = this.gangCardArray.length - 1; i >= 0; i--) {
                if (player.mjchi && player.mjchi.length > 0 
                    && Math.floor(player.mjchi[0] / 10) != Math.floor(this.gangCardArray[i] / 10)) {
                    this.gangCardArray.splice(i, 1); // 吃牌之后不能杠
                }
            }
            if(this.gangCardArray.length > 0 && !player.isPass){
                return true;
            } 
            return false;
        },
        //检测听 
        checkTingBtn:function(player) {
            this.canTingCards = {};
            this.JJHcanTingCards = {};
            if (player.tingLists ) {
                for (var i in player.tingLists) {
                    this.canTingCards[i] = 1;
                }
            }

            if (player.jiangjianghuLists && !player.isTing) {
                for (var i in player.jiangjianghuLists) {
                    this.JJHcanTingCards[i] = 1;
                }
            }

            if (Object.keys(this.JJHcanTingCards).length > 0) {
                return true;
            }

            return false;
        },
        //@ 检测开杠数据
        checkKaiGangBtn: function(player) {
            this.kaiGangCardArry = [];
            var tData = MjClient.data.sData.tData;
            this.gangCardArray = player.gangList || [];
            for (var i = this.gangCardArray.length - 1; i >= 0; i--){
                if (player.mjchi && player.mjchi.length > 0 
                    && Math.floor(player.mjchi[0] / 10) != Math.floor(this.gangCardArray[i] / 10)) {
                    this.gangCardArray.splice(i, 1); // 吃牌之后不能杠
                }
            }

            if (player.kaigangList.length > 0 && !player.isPass){
                this.kaiGangCardArry = player.kaigangList;
                return true;
            }

            return false;
        },
        //@Override 开杠自动摸打
        autoPutAfterTing: function(){
            var player = this.getPlayerInfoByOff();
            if(!player.isTing){
                return;
            }
            if(player.trust || player.tPutCard){
                return;// 托管优先
            }
            if(!this.isTurnMe()){
                return;
            }

            var newCardTag = null;
            if(player.mjhand && player.mjhand.length % 3 == 2 && player.isNew){
                newCardTag = player.mjhand[player.mjhand.length - 1];
            }

            var cardNode = null;
            var node = this.getNodeByOff(0);
            var children = node.children;
            for(var i = 0;i < children.length;i++){
                var child = children[i];
                if(child.name == this.HandleCardType.Hand || (child.name == this.HandleCardType.Chi && child.isCut)){
                    if(child.tag == newCardTag){
                        cardNode  = child;
                        break;
                    }
                }
            }

            if(!cardNode){
                return;
            }

            if(this.isTurnMe() && player.isTing && !(player.eatFlag & 8) && !this.checkGangBtn(player) && !this.checkKaiGangBtn(player)){
                this.runAction(cc.sequence(cc.delayTime(0.6),
                    cc.callFunc(function(){
                        if(!cc.sys.isObjectValid(cardNode)) return;
                        MjClient.playui.putOutCard(cardNode, cardNode.tag);
                    })));
            }
        },
        //@Override 发送杠牌数据到服务器
        sendGangToServer: function(cd, isKaiGang) {
            if (MjClient.rePlayVideo != -1) return; // 回放时候不能请求
            this.sendAutoPutToServer(false);
            cc.log("kaigang ",cd,isKaiGang);
            MjClient.gamenet.request("pkroom.handler.tableMsg", {
                cmd: "MJGang",
                card: cd,
                isKaiGang: isKaiGang || false,
                eatFlag: this.getEatFlag()
            });
        },
        //@Override 发送吃牌数据到服务器
        sendChiToServer: function (pos,cd) {
            cc.log("pos  ",pos,"  cd",cd);
            if (MjClient.rePlayVideo != -1) {
                return;
            }
            this.sendAutoPutToServer(false);
            var sendMsg = {
                cmd: "MJChi",
                pos:  pos,
                card: cd,
                eatFlag: this.getEatFlag()
            };
            MjClient.gamenet.request("pkroom.handler.tableMsg", sendMsg);
        },
        //@Override 发送碰牌数据到服务器
        sendPengToServer: function (cd) {
            if (MjClient.rePlayVideo != -1) {
                return;
            }
            this.sendAutoPutToServer(false);
            var sendMsg = {
                cmd: "MJPeng",
                card: cd,
                eatFlag: this.getEatFlag()
            };
            MjClient.gamenet.request("pkroom.handler.tableMsg", sendMsg);
        },
        //@Override 发送胡牌数据到服务器
        sendHuToServer: function (cd) {
            if (MjClient.rePlayVideo != -1) {
                return;
            }
            this.sendAutoPutToServer(false);
            var sendMsg = {
                cmd: "MJHu",
                card: cd,
                eatFlag: this.getEatFlag()
            };    
            MjClient.gamenet.request("pkroom.handler.tableMsg", sendMsg);
        },
        // @override 点过的时候验证
        checkWhenPass: function () {
            var tData = MjClient.data.sData.tData;
            var player = this.getPlayerInfoByName("node_down");
            if(player.isZiMoHu){
                MjClient.showToast("自摸必须胡牌");
                return true;
            }

            if (tData.areaSelectMode.bihuType && player.eatFlag & 8){
                MjClient.showToast("有胡必胡");
                return true;
            }
            return false;
        },
        //@  处理开杠
        dealKaiGang: function(playerNode, msg){
            var tData = MjClient.data.sData.tData;
            var player = this.getPlayerInfoByName(playerNode.getName());
            if(player.info.uid != msg.uid){
                return;
            }

            var kaiGangCardsValue = [tData.lastPutCard];
            var cardNode = this.createCard(playerNode, this.CsdDefaultCardType.PutCardOne, this.HandleCardType.Put, kaiGangCardsValue[0]);
            var self = this;
            this.addPutCard(cardNode, function(){
                self.addPutCardTip(cardNode, msg);
            }, true);
            this.resetCardLayout(playerNode);
        },
        //@  处理开杠
        dealDaMi: function(playerNode, msg){
            var tData = MjClient.data.sData.tData;
            var player = this.getPlayerInfoByName(playerNode.getName());
            if(player.info.uid != msg.uid){
                return;
            }

            var kaiGangCardsValue = msg.showCards;
            for (var i = 0; i < kaiGangCardsValue.length; i++) {
                var cardNode = this.createCard(playerNode, this.CsdDefaultCardType.PutCardOne, this.HandleCardType.Put, kaiGangCardsValue[i]);
                var self = this;
                this.addPutCard(cardNode, function(){
                    self.addPutCardTip(cardNode, msg);
                }, true);
                this.resetCardLayout(playerNode);
            }
        },
        //播放开杠动画
        showOnlyAnimation:function(playerNode,AnimationType){

            var eatActionChild;
            var callback = function (){
                eatActionChild.visible = false;
            };
            delayTime = 0.8;
            if (this.is3DStyle()) {
                cc.spriteFrameCache.addSpriteFrames("spine/new_chipengganghu/chipenggang0.plist", "spine/new_chipengganghu/chipenggang0.png");
                cc.spriteFrameCache.addSpriteFrames("spine/new_chipengganghu/chipenggang1.plist", "spine/new_chipengganghu/chipenggang1.png");
                if (jsb.fileUtils.isFileExist("spine/new_chipengganghu/chipenggang2.plist")){
                    cc.spriteFrameCache.addSpriteFrames("spine/new_chipengganghu/chipenggang2.plist", "spine/new_chipengganghu/chipenggang2.png");
                }
                ccs.armatureDataManager.addArmatureFileInfo("spine/new_chipengganghu/chipenggang.ExportJson");

                switch(AnimationType){
                    case "dami":
                        eatActionChild = playerNode.getChildByName("node_animation");
                        eatActionChild.removeAllChildren();
                        eatActionChild.visible = true;
                        eatActionChild.setScale(0.5);
                        eatActionChild.runAction(cc.sequence(cc.delayTime(delayTime), cc.callFunc(callback)));

                        var dami = new ccs.Armature("chipenggang");
                        dami.animation.play("dami", -1, 0);
                        dami.setPosition(cc.p(eatActionChild.width/2, eatActionChild.height/2));
                        eatActionChild.addChild(dami, 999999);
                        break;
                    case "jiangting": 
                        eatActionChild = playerNode.getChildByName("node_animation");
                        eatActionChild.removeAllChildren();
                        eatActionChild.visible = true;
                        eatActionChild.setScale(0.5);
                        eatActionChild.runAction(cc.sequence(cc.delayTime(delayTime), cc.callFunc(callback)));

                        var dami = new ccs.Armature("chipenggang");
                        dami.animation.play("jiangting", -1, 0);
                        dami.setPosition(cc.p(eatActionChild.width/2, eatActionChild.height/2));
                        eatActionChild.addChild(dami, 999999);
                        break;
                }
            }else{     
                switch(AnimationType){
                    case "dami":
                        eatActionChild = playerNode.getChildByName("node_animation");
                        eatActionChild.removeAllChildren();
                        eatActionChild.visible = true;
                        eatActionChild.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(callback)));
                        var projNode = new cc.Sprite("spine/kaigang/dami.png");
                        projNode.setScale(0.0);
                        projNode.runAction(cc.sequence(cc.scaleTo(0.2, 0.6), cc.scaleTo(0.3, 0.5)) );
                        eatActionChild.addChild(projNode,999999);
                        break;
                    case "jiangting":
                        eatActionChild = playerNode.getChildByName("node_animation");
                        eatActionChild.removeAllChildren();
                        eatActionChild.visible = true;
                        eatActionChild.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(callback)));
                        var projNode = new cc.Sprite("spine/ting/jiangt.png");
                        projNode.setScale(0.0);
                        projNode.runAction(cc.sequence(cc.scaleTo(0.2, 0.6), cc.scaleTo(0.3, 0.5)) );
                        eatActionChild.addChild(projNode,999999);
                        break;
                }          
            }
        },
        //显示开杠框
        showKaiGangBox:function(uid) {
            var tData = MjClient.data.sData.tData;
            var kaigangsArry = tData.kaigangs;
            this.allKaiGangBox = [];
            var curHuCard = 0;
            cc.log("开杠    ------ ",tData.kaigangs);
            
            var kaiGangKuang = MjClient.playui.jsBind.node_kaiGangKuang._node;
            var node = kaiGangKuang.getParent();
            var children = node.children;
            for (var i = 0; i < children.length; i++) {
                if (children[i].name == "KaiGangBox") 
                {
                    children[i].removeFromParent();//清除之前的开杠框
                }
            }

            if (!kaigangsArry || kaigangsArry.length <= 0) return;
            var player = this.getPlayerInfoByOff(0);
            cc.log("开杠框  ",kaigangsArry.length);
            
            for (var i = 0; i < kaigangsArry.length; i++) {
                var newKaiGangbox = util.clone(kaiGangKuang);
                newKaiGangbox.setName("KaiGangBox");
                newKaiGangbox.setVisible(true);
                newKaiGangbox.setPosition(cc.p(kaiGangKuang.getPositionX() + i * 50 , kaiGangKuang.getPositionY() - i * 20));

                var cardNode1 = newKaiGangbox.getChildByName("card1");
                cardNode1.visible = false;
                var cardNode2 = newKaiGangbox.getChildByName("card2");
                cardNode2.visible = false;
                var curcards = kaigangsArry[i].cards;
                for (var j = 0; j < curcards.length; j++) {
                    if (j <= kaigangsArry[i].fanIndex) 
                    {
                        var newCardNode = cardNode1.clone();
                        cc.log("newCardNode",newCardNode);
                        newCardNode.visible = true;
                        var curname = "card0" + j;
                        
                        newCardNode.name = this.HandleCardType.MingGang;
                        this.setCardSprite(newCardNode, curcards[j],true);
                        newCardNode.setName(curname);
                        newKaiGangbox.addChild(newCardNode);
                        curHuCard = curcards[j];
                    }
                    else
                    {
                        var newCardNode = cardNode2.clone();
                        newCardNode.visible = true;
                        var curname = "card0" + j;
                        newCardNode.setName(curname);
                        newKaiGangbox.addChild(newCardNode);
                    }
                }

                var distance = curcards.length % 2 == 0 ;
                for (var m = 0; m < curcards.length; m++) {
                    var _name = "card0" + m;
                    var curcard = newKaiGangbox.getChildByName(_name);
                    if (distance) 
                    {
                        curcard.setPosition(cc.p(
                            (cardNode1.getPositionX() + ( m * 2  - (curcards.length - 1)) * curcard.getContentSize().width/2),
                            cardNode1.getPositionY()));
                    }
                    else
                    {
                        curcard.setPosition(cc.p(
                            (cardNode1.getPositionX() + ( m   - Math.floor(curcards.length / 2)) * curcard.getContentSize().width),
                            cardNode1.getPositionY()));
                        if (curcards.length == 1) 
                        {
                            curcard.setPosition(cc.p(cardNode1.getPositionX(),cardNode1.getPositionY()));
                        }
                    }
                }
                node.addChild(newKaiGangbox);
                this.allKaiGangBox.push(newKaiGangbox);
            }
            if (player.eatFlag == 8 && typeof(uid) != "undefined" && uid == player.info.uid)
            {
                MjClient.majiang.MJHuToServer(curHuCard);
            }
        },
        //显示海底牌
        showHaiDiBox:function(haidiCard)
        {
            var tData = MjClient.data.sData.tData;

            if (!haidiCard) 
            {
                return;
            }

            var haiDikuang = MjClient.playui.jsBind.node_haiDikuang._node;
            haiDikuang.setVisible(true);
            var Card = haiDikuang.getChildByName("card0");
            Card.setVisible(true);
            Card.name = this.HandleCardType.MingGang;
            this.setCardSprite(Card,haidiCard,true);
            Card.name = "card0";

            if (tData.winner == -1)
             {
                var sign = new ccui.ImageView();
                sign.loadTexture("playing/gameTable/huangzhuang.png");
                sign.setName("huangzhuangsign");
                //tingsign.setScale(0);
                sign.setPosition(haiDikuang.getContentSize().width/2,haiDikuang.getContentSize().height + sign.getContentSize().height/2 +7);
                haiDikuang.addChild(sign,20); 
             }

        },
        // @Override 隐藏吃碰杠等按钮
        hideEatNodeChildren:function() {
            var eatArr = MjClient.playui.jsBind.node_eat;
            for(var key in eatArr){
                if(eatArr[key]._node)
                  eatArr[key]._node.setVisible(false);
            }
            MjClient.playui.jsBind.node_NiaoPai._node.setVisible(false);

        },
        //杠改为补动画
        initAnimationType: function(){
            var AnimationType = {
                "CHI"     : "chi",              //吃牌
                "PENG"    : "peng",             //碰牌
                "GANG"    : "bu",             //杠牌
                "HU"      : "hu",               //胡牌
                "TING"    : "ting",             //听牌
            };
            this.AnimationType = AnimationType;
        },
        //特殊处理补
        getEatSpineNode: function(actType) { 
            if (actType == this.AnimationType.GANG) {
                var pngPath = "bu.png";
                var scaleTo = 0.6;
                var scaleTo2 = 0.5;
                var projNode = new cc.Sprite("spine/bu/" + pngPath);
                projNode.setScale(0.0);
                projNode.runAction(cc.sequence(cc.scaleTo(0.2, scaleTo), cc.scaleTo(0.3, scaleTo2)) );
                return projNode;
            }
            var atlasSrc = "spine/" + actType + "/" + actType + ".atlas";
            var jsonSrc = "spine/" + actType + "/" + actType + ".json";

            // 输出的文件类型有两种，下面这种特意处理通用
            if(!jsb.fileUtils.isFileExist(atlasSrc)){
                atlasSrc = "spine/" + actType + "/skeleton.atlas";
                jsonSrc = "spine/" + actType + "/skeleton.json";
            }
            var projNode = createSpine(jsonSrc, atlasSrc);
            projNode.setAnimation(0, "idle", false);
            projNode.setTimeScale(1);
            projNode.setScale(0.5);
            return projNode;
        },
        //@Override 明杠
        dealMingGang: function(playerNode, msg) {
            var gangCard = msg.card;
            
            if (MjClient.rePlayVideo != -1 || playerNode.getName() == "node_down") {
                this.removeCard(playerNode, this.HandleCardType.Hand, gangCard, 3);
            } else {
                this.removeCard(playerNode, this.HandleCardType.Hand, null, 3);
            }

            for (var i = 0; i < 4; i++) {
                this.createCard(playerNode, this.CsdDefaultCardType.EatCardFront, this.HandleCardType.MingGang, gangCard); 
            }

            this.resetCardLayout(playerNode);
            if (msg.isKaiGang) return;
            this.showEatActionAnim(playerNode, this.AnimationType.GANG);
        },
        //@Override 暗杠
        dealAnGang: function(playerNode, msg) {
            var gangCard = msg.card;
            
            if (MjClient.rePlayVideo != -1 || playerNode.getName() == "node_down") {
                this.removeCard(playerNode, this.HandleCardType.Hand, gangCard, 4);
            } else {
                this.removeCard(playerNode, this.HandleCardType.Hand, null, 4);
            }

            for (var i = 0; i < 4; i++) {
                this.createCard(playerNode, this.CsdDefaultCardType.EatCardFront, this.HandleCardType.AnGang, gangCard);
            }

            this.resetCardLayout(playerNode);
            if (msg.isKaiGang) return;
            this.showEatActionAnim(playerNode, this.AnimationType.GANG);
        },
        //@Override 碰杠
        dealPengGang: function(playerNode, msg) {
            var gangCard = msg.card;
            
            if (MjClient.rePlayVideo != -1 || playerNode.getName() == "node_down") {
                this.removeCard(playerNode, this.HandleCardType.Hand, gangCard);
                this.removeCard(playerNode, this.HandleCardType.Peng, gangCard, 3);
            } else {
                this.removeCard(playerNode, this.HandleCardType.Hand);
                this.removeCard(playerNode, this.HandleCardType.Peng, gangCard, 3);
            }

            for (var i = 0; i < 4; i++) {
                this.createCard(playerNode, this.CsdDefaultCardType.EatCardFront, this.HandleCardType.PengGang, gangCard);
            }

            this.resetCardLayout(playerNode);
            if (msg.isKaiGang) return;
            this.showEatActionAnim(playerNode, this.AnimationType.GANG);
        },
        //将听
        dealTing: function(playerNode, msg) {
            var tData = MjClient.data.sData.tData;
            var player = this.getPlayerInfoByName(playerNode.getName());
            if (!player.isKaigang) {
                this.showOnlyAnimation(playerNode,"jiangting");
            }else{
                this.showEatActionAnim(playerNode, this.AnimationType.TING);
            }
            if (msg.isTingJJHu) 
            {
                var _jiangIcon1 = node.getChildByName("layout_head").getChildByName("tingIcon");
                _jiangIcon1.visible = true;
                _jiangIcon1.loadTexture("playing/gameTable/icon_jiang.png");
            }
        },
        // @Override 小结算处理
        handleRoundEnd: function(){
            var tData = MjClient.data.sData.tData;
            var niaoCards = tData.mopai;
            var self = this;
            if(MjClient.playui.isInGame()) return;
            var showEndCards = function(){
                self.showBalanceLayer();
            };
            //海底牌弹窗
            if (!MjClient.isDismiss && (tData.winner == -1 || tData.mHaidiPl >= 0))  
            {   
                MjClient.playui.showHaiDiBox(tData.haidiCard);
                //海底捞
                if(tData.winner != -1 && tData.mHaidiPl >= 0)
                {
                    var sign = MjClient.playui.jsBind.node_haiDikuang._node.getChildByName("huangzhuangsign");
                    if(sign) sign.removeFromParent();
                    this.runAction(cc.sequence(cc.delayTime(0.5),
                        cc.callFunc(function(){
                            self.showMjhandBeforeEndOne();
                        }),cc.callFunc(showEndCards)));
                    return;
                }
            }

            var action = cc.sequence(cc.delayTime(0.5),
                cc.callFunc(function(){
                MjClient.Scene.addChild(new HAHZ_showCardLayer(niaoCards,function(){
                    self.showShaiziAniForEnd();
                }));}),
                cc.callFunc(function(){
                self.showMjhandBeforeEndOne();
            }),cc.delayTime(0.5),cc.callFunc(showEndCards));
            action.setTag(1179)
            self.runAction(action);

            UIEventBind(null, this, "initSceneData", function(){
                self.stopActionByTag(1179);
            });
            UIEventBind(null, this, "LeaveGame", function(){
                self.stopActionByTag(1179); 
            });
        },
        //结算页面
        createEndOnePanel: function(){
            return new EndOneView_pingjiangzhaniao_new();
        },
        //大结算页面
        createGameOverPanel: function(){
            return new GameOverLayer_maJiang_pingjiangzhaniao();
        },
        //开启自动摸打
        isCanAutoPut: function(){
            return false;
        },
        //处理自动摸打时点过自动打出摸的牌
        dealAutoPutWhenPass: function(node,msg)
        {
            var self = this;
            cc.log(msg.touchCard,msg.uid,this.isTurnMe());
            if (msg.touchCard && msg.uid == SelfUid() && this.isTurnMe()) 
            {
                var CardUI = node.children;
                for(var i = CardUI.length - 1; i >= 0; i--)
                {
                    if(CardUI[i].name == this.HandleCardType.Hand && CardUI[i].tag == msg.touchCard)
                    {
                        var callback = function () {
                            self.putOutCard(CardUI[i], CardUI[i].tag);
                        };
                        CardUI[i].runAction(cc.sequence(cc.delayTime(0.3), cc.callFunc(callback)));
                        return;
                    }
                }
            }
        },
        //板板胡 骰子动画
        showShaiziAniForDami:function(off){
            if(off == 0) {
                //摇骰子的时候全部隐藏
                this.hideEatNodeChildren();

                if(MjClient.rePlayVideo != -1)//回放
                {
                    playEffect("shuffle");
                    this.updatePlayerEatBtn();
                    return;
                }

                var _AniNode = this.getNodeByOff(off).getChildByName("node_animation");
                var shaiziArray = [getRandomRange(0, 5), getRandomRange(0, 5)];
                var soundID = null;
                cc.log("shaiziArray = " + shaiziArray);
                cc.spriteFrameCache.addSpriteFrames("playing/other/shaizi.plist","playing/other/shaizi.png");
                var firstFrame = new cc.Sprite("#shaizi_1.png");
                var frames = [];
                var prefix = "shaizi_";
                var fc = cc.spriteFrameCache;
                for (var i = 1; i <= 9; i++) {
                    var name = prefix + i + ".png";
                    cc.log("----------name = " + name);
                    var f = fc.getSpriteFrame(name);
                    if(f)
                    {
                        frames.push(f);
                    }
                }
                var animate = cc.animate(new cc.Animation(frames, 0.1, 2));
                var playSoundFunc = cc.callFunc(function(){
                    //todo...如果需要播骰子声音在这里
                    soundID = playEffect("shaizi",true);
                });
                firstFrame.setPosition(cc.p(MjClient.size.width/2,MjClient.size.height/2));
                firstFrame.setScale(MjClient.size.height/800);

                var showPonitFunc = cc.callFunc(function(){
                    var _shai1 = new ccui.ImageView("playing/other/shaizi/"+ (shaiziArray[0]+ 1) + ".png");
                    var _shai2 = new ccui.ImageView("playing/other/shaizi/"+(shaiziArray[1] + 1) +".png");
                    _shai1.setPosition(cc.p((MjClient.size.width/2)*0.95,MjClient.size.height/2));
                    _shai1.setName("shaizi");
                    _shai2.setName("shaizi");
                    _shai1.setScale(MjClient.size.height/800);
                    _shai2.setScale(MjClient.size.height/800);
                    _AniNode.addChild(_shai1,10000);
                    _shai2.setPosition(cc.p((MjClient.size.width/2)*1.05 + 30,MjClient.size.height/2));
                    _AniNode.addChild(_shai2,10000);
                    firstFrame.visible = false;
                    stopEffect(soundID);
                });



                firstFrame.runAction(cc.sequence(playSoundFunc, animate,showPonitFunc,cc.delayTime(0.8),cc.callFunc(function(){
                    //发牌
                    var _Anichildren = _AniNode.children;
                    for(var i = 0; i < _Anichildren.length; i++) {
                        var _c = _Anichildren[i];
                        if(_c.name == "shaizi")
                        {
                            _c.removeFromParent(true);
                        }
                    }
                    playEffect("shuffle");
                }),cc.removeSelf()));
                _AniNode.addChild(firstFrame,10000);
            }
        },
        //骰子动画补抓鸟
        showShaiziAniForEnd:function(){
            //摇骰子的时候全部隐藏
            if(MjClient.rePlayVideo != -1)//回放
            {
                playEffect("shuffle");
                return;
            }
            var _AniNode = this.getNodeByName("node_down").getChildByName("node_animation");
            var soundID = null;

            var tData = MjClient.data.sData.tData;
            var touziarry = tData.shaizi;

            if (touziarry.length <= 0) 
            {
                cc.log("error:::::  ")
                return;
            }

            cc.spriteFrameCache.addSpriteFrames("spine/touzi/sezi0.plist", "spine/touzi/sezi0.png");
            ccs.armatureDataManager.addArmatureFileInfo("spine/touzi/sezi.ExportJson");

            var touzi_ani = new ccs.Armature("sezi");
            var animationname = "Animation" + touziarry.length;
            var playtouziani = cc.callFunc(function(){
                touzi_ani.animation.play(animationname, -1, 0);
            });

            touzi_ani.setPosition(cc.p(MjClient.size.width/2,MjClient.size.height/2));
            touzi_ani.setName("touzi");
            touzi_ani.setScale(0.2);
            _AniNode.addChild(touzi_ani,9999);

            var playSoundFunc = cc.callFunc(function(){
                //todo...如果需要播骰子声音在这里
                soundID = playEffect("shaizi",true);
            });
            

            var showPonitFunc = cc.callFunc(function(){
                _AniNode.removeChildByName("touzi");
                var distance = touziarry.length % 2 == 0 ? true : false;
                for (var i = 0; i < touziarry.length; i++) {
                    var _shai1 = new ccui.ImageView("playing/other/shaizi/"+ (touziarry[i] + 1) + ".png");
                    if (distance) 
                    {
                        _shai1.setPosition(cc.p(
                            (MjClient.size.width/2 + ( i * 2  - (touziarry.length - 1)) * _shai1.getContentSize().width/4),
                            MjClient.size.height/2));
                    }
                    else
                    {
                        _shai1.setPosition(cc.p(
                            (MjClient.size.width/2 + ( i - Math.floor(touziarry.length / 2)) * _shai1.getContentSize().width/2),
                            MjClient.size.height/2));
                        if (touziarry.length == 1) 
                        {
                            _shai1.setPosition(cc.p(MjClient.size.width/2,MjClient.size.height/2));
                        }
                    }
                    _shai1.setName("shaizi");
                    _shai1.setScale(MjClient.size.height/800);
                    _AniNode.addChild(_shai1,10000);
                    stopEffect(soundID);
                }
            });

            _AniNode.runAction(cc.sequence(playSoundFunc, playtouziani,cc.delayTime(0.5),showPonitFunc,cc.delayTime(1),cc.callFunc(function(){
                var _Anichildren = _AniNode.children;
                for(var i = 0; i < _Anichildren.length; i++) {
                    var _c = _Anichildren[i];
                    if(_c.name == "shaizi")
                    {
                        _c.removeFromParent(true);
                    }
                }
                playEffect("shuffle");
            })));
        },
        // @Override 添加2D癞子标识
        addLaiZiIcon2D: function (cardNode) {
            if(!this.isCanAddLaiZiIcon(cardNode.tag)){
                return;
            }

            var playerNodeName = cardNode.getParent().getName();
            var offIndex = this.getNodeIndexDefaultByName(playerNodeName);
            var cardName = cardNode.getName() || "";
            offIndex = offIndex === -1 ? 0 : offIndex;
            offIndex = cardName === this.HandleCardType.Hand ? 4 : offIndex;
            var laiZiPosArr = this.getHunIconPosition2D();
            var laiZiNode = this.getLaiZiIcon2D();
            laiZiNode.setPosition(laiZiPosArr[offIndex][0], laiZiPosArr[offIndex][1]);
            laiZiNode.setRotation(-90 * offIndex);
            cardNode.addChild(laiZiNode);
        },
        // 可以胡牌时的禁止gang操作
        refuseGangWhenHu: function (cardTag) {
            var player = MjClient.playui.getPlayerInfoByName("node_down");
            var tData = MjClient.data.sData.tData;
            var canHuAfterGang = MjClient.majiang.canHuAfterGang(player.mjhand, cardTag, tData.hunCard);
            if( player && player.isZiMoHu && !canHuAfterGang){
                MjClient.showToast("自摸必须胡牌");
                return true;
            }else if(tData.areaSelectMode.bihuType && player.eatFlag & 8){
                MjClient.showToast("有胡必胡");
                return true;
            }
            return false;
        }
    });
}());
