/***
 * 湘阴推倒胡，新框架牌桌逻辑
 * @type {void | Class | *}
 */

var majiang_panel_xiangyintuidaohu;
(function () {
    majiang_panel_xiangyintuidaohu = majiang_panel_yueyang.extend({

        jsonFile: "Play_xiangyintuidaohu_new.json",
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
                                if (MjClient.playui.kaiGangCardArry.length > 1) {
                                    var showCardsNode = MjClient.playui.jsBind.node_eat.node_showCards._node;
                                    showCardsNode.getChildByName("img_showCardsBg").showGangCards();
                                    return;
                                }

                                var player = MjClient.playui.getPlayerInfoByName("node_down");
                                if (player.eatFlag & 8) {
                                    MjClient.showMsg("确认不胡吗?", function () {
                                        MjClient.playui.sendGangToServer(MjClient.playui.kaiGangCardArry[0],MjClient.playui.isKaiGang);
                                        MjClient.playui.hideEatNodeChildren();
                                    }, function () {MjClient.playui.hasClickBtn = false;}, "1");
                                } else {
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
                                this.updateSize(cardArr.length, 3);
                                var startPos = this.getStartPos(cardArr.length, 3);
                                var templatCard = this.getChildByName("img_card");
                                var self = this;
                                for(var i = 0;i < cardArr.length;i++){
                                    for (var j = 0; j < 3; j ++){
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
                                    MjClient.playui.showKaiGangAnimation(this.getParent());
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
                            MjClient.playui.addChild(layer, 99);
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
                            //听牌
                            MjClient.playui.searchAllTingCards();
                            postEvent(MjClient.playui.PlayEventType.SHOW_TING_CARDS);
                            MjClient.playui.updateTingTips();

                            if (player.haiDiLaoState == 2 && SelfUid() == player.info.uid)
                            {

                                //弹窗选择是否捞一把
                                var layer = new laZhangLayer(function(select) {
                                    var player = getUIPlayer(0);
                                    player.haiDiLaoState = select ? 1 : 0;
                                    MjClient.gamenet.request("pkroom.handler.tableMsg", {
                                        cmd: "MJSelectHaiDiLao",
                                        haiDiLaoState: player.haiDiLaoState,
                                    });
                                });
                                layer.setName("laZhangLayer");
                                MjClient.playui.addChild(layer, 99);
                            }

                            MjClient.playui.cutDownCardsBeforEndOneWhen23D(this);
                        }
                    }
                },
                node_right:{
                    layout_head:{
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
                                    MjClient.playui.showKaiGangAnimation(this.getParent());
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
                                    MjClient.playui.showKaiGangAnimation(this.getParent());
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
                                    MjClient.playui.showKaiGangAnimation(this.getParent());
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
                            MjClient.playui.showKaiGangBox(this);
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
            this._super(majiang_panel_xiangyintuidaohu, jsonFile);
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
        },
        // override 是否显示红中癞子牌
        isHunCardShow: function(){
            return false;
        },

        // override 是否显示红中癞子牌
        isHunCardShow3D: function(){
            return true;
        },

        // override 是否开启显示最多听牌标识
        isShowMaxTingCards: function(){
            return true;
        },
        // 音效播放
        playEffectInPlay: function(cardTag, isLoop){
            if (cardTag == "fangpao" || cardTag == "ting") return;
            var voiceType = this.getVoiceType() == 0 ? MjClient.gameType : MjClient.gameType;
            var origSounds = GameSound4Play[voiceType][cardTag.toString()];
            var sounds = origSounds.concat();
            var sData = MjClient.data.sData;
            var tData = sData.tData;
            var player = sData.players[tData.uids[tData.curPlayer]];
            if (!player){
                player = sData.players[this.getSelfUid()];
            }

            if (player && player.info.sex == 1){
                for (var i = 0; i < sounds.length; i++){
                    var resetPath = sounds[i].replace("/nv/", "/nan/").replace("/nv_local/", "/nan_local/");
                    var fullFilePath = "sound/" + resetPath + ".mp3";
                    if (jsb.fileUtils.isFileExist(fullFilePath)){
                        sounds[i] = resetPath;
                    }
                }
            }
            var randomIndex = Math.floor(Math.random() * sounds.length);
            var soundFile = sounds[randomIndex];
            if(!jsb.fileUtils.isFileExist("sound/" + soundFile + "" + ".mp3")){
                soundFile = sounds[0];
            }
            var str = "sound/"+soundFile+".mp3";
            cc.log("声效  ",str);
            return this.reallyPlayEffect(str, isLoop);
        },
        //牌型
        getCardBgNameList: function(is3D) {
            if(is3D){
                return ["经典", "流行"];
            }
            return ["经典绿","土豪金","精致","大气"];
        },
        getGameBgList: function(is3D) {
            if(is3D){ // 3dBG资源
                return ["playing/gameTable/beijing3D_1.jpg", "playing/gameTable/beijing3D_2.jpg",
                "playing/gameTable/beijing3D_3.jpg", "playing/gameTable/beijing3D_4.jpg"];
            }
            return ["playing/gameTable/beijing_1.png", "playing/gameTable/beijing_2.jpg",
            "playing/gameTable/beijing_4.jpg", "playing/gameTable/beijing_3.jpg"];
        },

        // 背景名称
        getGameBgNameList: function(is3D) {
            if(is3D){
                return ["蓝绿","淡绿","湖蓝","靛蓝"];
            }
            return ["经典","海蓝","典雅","翡翠"];
        },

        // 牌背
        getCardBgList: function(is3D) {
            if(is3D){
                return ["playing/MJ/MJBg3D1", "playing/MJ/MJBg3D2"];
            }
            return ["playing/MJ", "playing/MJ/MJBg1", "playing/MJ/MJBg3", "playing/MJ/MJBg2"];
        },
        // 牌面
        getCardFrontList: function(is3D) {
            if(is3D){
                return ["playing/MJ/MJCard3D1", "playing/MJ/MJCard3D2"];
            }
            return ["playing/MJ", "playing/MJ/MJCard1", "playing/MJ/MJCard3", "playing/MJ/MJCard2"];
        },
        getDownAndTopPutOutCardScale: function(mjBgType){
            var scale_x = 0.95, scale_y = 0.95;
            if(mjBgType == 1){
                scale_x = 0.95;
                scale_y = 0.97;
            }else if(mjBgType == 2){
                scale_x = 0.945;
                scale_y = 0.95;
            }else if(mjBgType == 3){
                scale_x = 1;
                scale_y = 1;
            }
            return {scale_x : scale_x, scale_y : scale_y};
        },

        getRightAndLeftPutOutCardScale: function(mjBgType){
            var scale_x = 0.95, scale_y = 0.95;
            if(mjBgType == 1){
                scale_x = 0.93;
                scale_y = 1;
            }else if(mjBgType == 2){
                scale_x = 0.90;
                scale_y = 0.95;
            }else if(mjBgType == 3){
                scale_x = 0.96;
                scale_y = 0.96;
            }
            return {scale_x : scale_x, scale_y : scale_y};
        },
         /*
         * 每组吃牌，牌与牌之间的缩放比
         **/
        getDownAndTopNodeEatCardScale: function(mjBgType){
            var scale = 0.95;
            if(mjBgType == 0){
                scale = 0.965;
            }else if(mjBgType == 1){
                
            }else if(mjBgType == 2){
                scale = 0.94;
            }else if(mjBgType == 3){
                scale = 0.95;
            }
            return scale;
        },

        /**
         * 每组吃牌，牌与牌之间的缩放比
         **/
        getRightAndLeftNodeEatCardScale: function(mjBgType){
            var scale = 0.65;
            if(mjBgType == 0){
                scale = 0.725;
            }else if(mjBgType == 1){
                scale = 0.75;
            }else if(mjBgType == 2){
                scale = 0.725;
            }else if(mjBgType == 3){
                scale = 0.725;
            }
            return scale;
        },

        /**
         *  获得手牌之间的缩放比
         **/
        getHandCardSpaceScale: function(){
            var mjBgType = this.getMaJiangBgType();
            var scale = 0.95;
            if(mjBgType == 0){

            }else if(mjBgType == 1){

            }else if(mjBgType == 2){
                scale = 0.94;
            }else if(mjBgType == 3){
                scale = 0.94;
            }
            return scale;
        },
        //牌面缩放
        getScaleByMjType2D: function(mjBgType){
            mjBgType = mjBgType === undefined ? this.getMaJiangBgType() : mjBgType;
            var scale = 1.2;
            if (mjBgType == 1){
                scale = 1.2;
            }else if(mjBgType == 2){
                scale = 1.2;
            }else if(mjBgType == 3){
                scale = 0.95;
            }
            return scale;
        },
        //
        updateCardNodeScale: function(cardNode){
            var mjBgType = this.getMaJiangBgType();
            if(mjBgType == 3 && !cardNode.isScale){
                var scale = cardNode.getScale();
                cardNode.setScale(0.975 * scale);
                cardNode.isScale = true;
            }

            if (mjBgType != 3 && cardNode.isScale) {
                var scale = cardNode.getScale();
                cardNode.setScale(scale / 0.975);
                cardNode.isScale = true;
            }
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
            player.isZiMoHu = false;
            this.initKaiGangData();

            var kaiGangNode = MjClient.playui.jsBind.node_kaiGangKuang._node;
            kaiGangNode.setVisible(false);
            if ((tData.tState == TableState.waitEat || tData.tState == TableState.waitCard) && tData.lastPutCard2){
                this.showKaiGangBox(kaiGangNode);
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

                //胡
                if (player.eatFlag & 8) {
                    nodeArr.push(eat.btn_hu._node);
                    if(bihuType && player.isNew) player.isZiMoHu = true;
                }
            }else{
                if (player.eatFlag & 8) {
                    nodeArr.push(eat.btn_hu._node);
                }

                if (player.eatFlag & 4 ) {
                    if (!player.isTing) {                           
                        nodeArr.push(eat.btn_gang._node);
                        this.gangCardArray.push(tData.lastPutCard);
                    }

                    if (MjClient.majiang.canKaiGang(player.mjhand, tData.lastPutCard, false, null, false, tData)) {
                        nodeArr.push(eat.btn_gang1._node);
                        this.kaiGangCardArry.push(tData.lastPutCard);
                    }
                }

                if (player.eatFlag & 2) {
                    nodeArr.push(eat.btn_peng._node);
                }

                if (player.eatFlag & 1) {
                    var eatpos = MjClient.majiang.canChi(player.mjhand, tData.lastPutCard, tData.hunCard);
                    if (eatpos.length > 0) {
                        nodeArr.push(eat.btn_chi._node);
                        if (this.chiCards.indexOf(tData.lastPutCard) == -1) {
                            this.eatCardArray = eatpos;
                            this.chiCards.push(tData.lastPutCard);
                        }
                    }
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
            for (var i = 0; i < 2; i++) {
                var eatFlag = i == 0 ? player.eatFlag : player.eatFlag2;
                var lastPutCard = i == 0 ? tData.lastPutCard : tData.lastPutCard2;

                cc.log("eatFlag  ",eatFlag);

                if (eatFlag & 8) {
                    nodeArr.push(eat.btn_hu._node);
                    if (this.huCards.indexOf(lastPutCard) == -1)
                        this.huCards.push(lastPutCard);

                    //杠上炮必胡
                    mustHu = true;
                }

                if ((eatFlag & 4) && MjClient.majiang.canKaiGang(player.mjhand, lastPutCard, false, player.mjpeng, isKaiGangAfterSelfAnGang, tData)) {
                    nodeArr.push(eat.btn_gang1._node);
                    if (this.kaiGangCardArry.indexOf(lastPutCard) == -1)
                        this.kaiGangCardArry.push(lastPutCard);
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
                    var eatpos = MjClient.majiang.canChi(player.mjhand, lastPutCard, tData.hunCard);
                    if (eatpos.length > 0) {
                        nodeArr.push(eat.btn_chi._node);
                        if (this.chiCards.indexOf(lastPutCard) == -1) {
                            this.eatCardArray.push(eatpos);
                            this.chiCards.push(lastPutCard);
                        }
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
            if(MjClient.movingCard !== null && MjClient.movingCard != cardNode){
                return true;
            } 
            var handCount = this.getCardNodeCountByName(cardNode.getParent(), this.HandleCardType.Hand);
            if(!(handCount % 3 == 2 && this.isTurnMe() || handCount % 3 == 1 && !this.isTurnMe())){
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
                    that.showPassHuTips();
                    that.hideEatNodeChildren();
                    that.sendPassToServer();
                    if(that.checkGangBtn(player) || that.checkKaiGangBtn(player)){
                        that.clickGangPass = true;
                    }
                }, function() {}, "1");
            }else{
                if(player.eatFlag & 8){
                    MjClient.showMsg("确认不胡吗?", function(){
                        that.showPassHuTips();
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
            this.gangCardArray = [];
            var tempGangCardArray = MjClient.majiang.canGang1(player.mjpeng, player.mjhand, player.isTing);
            for (var i = tempGangCardArray.length - 1; i >= 0; i--) {
                if (player.mjchi && player.mjchi.length > 0 
                    && Math.floor(player.mjchi[0] / 10) != Math.floor(tempGangCardArray[i] / 10)) {
                    tempGangCardArray.splice(i, 1); // 吃牌之后不能杠
                }
            }
            if(tempGangCardArray.length > 0 && !player.isPass)
            {
                for (var i = 0; i < tempGangCardArray.length; i ++)
                {
                    if (player.justPeng != tempGangCardArray[i] && player.mjpeng.indexOf(tempGangCardArray[i]) == -1) { // 暗杠
                        if (!player.isTing) { // 开杠之后不能补
                            cc.log("player.justPeng",player.justPeng,"   ",tempGangCardArray,tempGangCardArray[i]);
                            this.gangCardArray.push(tempGangCardArray[i]);
                        }
                    }
                    else if (player.isNew && !player.isTing) { // 补杠
                        if (player.mjhand[player.mjhand.length - 1] == tempGangCardArray[i] ||
                         !tData.areaSelectMode["minggangguogangbunengbu"]) {
                            this.gangCardArray.push(tempGangCardArray[i]);
                        }
                    }
                }
                if (this.gangCardArray.length > 0) {
                    return true;
                }
            } 
            return false;
        },
        //@ 检测开杠数据
        checkKaiGangBtn: function(player) {
            this.kaiGangCardArry = [];
            var tData = MjClient.data.sData.tData;
            var tempGangCardArray = MjClient.majiang.canGang1(player.mjpeng, player.mjhand, player.isTing);
            for (var i = tempGangCardArray.length - 1; i >= 0; i--) {
                if (player.mjchi && player.mjchi.length > 0 
                    && Math.floor(player.mjchi[0] / 10) != Math.floor(tempGangCardArray[i] / 10)) {
                    tempGangCardArray.splice(i, 1); // 吃牌之后不能杠
                }
            }

            for (var i = 0; i < tempGangCardArray.length; i ++){                
                if (player.justPeng != tempGangCardArray[i] && 
                    MjClient.majiang.canKaiGang(player.mjhand, tempGangCardArray[i], true, player.mjpeng, false, tData)){
                    this.kaiGangCardArry.push(tempGangCardArray[i]);
                }   
            }
            if (this.kaiGangCardArry.length > 0) {
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
            this.sendAutoPutToServer(false)
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

            var kaiGangCardsValue = [msg.card1,msg.card2];
            for (var i = 0; i < 2 ; i++) {
                var cardNode = this.createCard(playerNode, this.CsdDefaultCardType.PutCardOne, this.HandleCardType.Put, kaiGangCardsValue[i]);
                var self = this;
                this.addPutCard(cardNode, function(){
                    self.addPutCardTip(cardNode, msg);
                }, true);
            }
            this.resetCardLayout(playerNode);
        },
        //播放开杠动画
        showKaiGangAnimation:function(playerNode){

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

                eatActionChild = playerNode.getChildByName("node_animation");
                eatActionChild.removeAllChildren();
                eatActionChild.visible = true;
                eatActionChild.setScale(0.5);
                eatActionChild.runAction(cc.sequence(cc.delayTime(delayTime), cc.callFunc(callback)));

                var kaigang = new ccs.Armature("chipenggang");
                kaigang.animation.play("kaigang", -1, 0);
                kaigang.setPosition(cc.p(eatActionChild.width/2, eatActionChild.height/2));
                eatActionChild.addChild(kaigang, 999999);
            }else{               
                eatActionChild = playerNode.getChildByName("node_animation");
                eatActionChild.removeAllChildren();
                eatActionChild.visible = true;
                eatActionChild.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(callback)));
                var projNode = new cc.Sprite("spine/kaigang/kaigang.png");
                projNode.setScale(0.0);
                projNode.runAction(cc.sequence(cc.scaleTo(0.2, 0.6), cc.scaleTo(0.3, 0.5)) );
                eatActionChild.addChild(projNode,999999);
            }
        },
        //显示开杠框
        showKaiGangBox:function(playerNode) {
            playerNode.setVisible(true);
            var tData = MjClient.data.sData.tData;
            if (tData.lastPutCard == -1 && tData.lastPutCard2 == -1)
                return;

            cc.log("刷新开杠显示",tData.lastPutCard,tData.lastPutCard2);
            var cardNode1 = playerNode.getChildByName("card1");
            var cardNode2 = playerNode.getChildByName("card2");
            cardNode1.setVisible(tData.lastPutCard != -1);
            cardNode2.setVisible(tData.lastPutCard2 != -1);
            if (tData.lastPutCard != -1){
                cardNode1.name = this.HandleCardType.MingGang;//利用明杠牌绘制牌面
                MjClient.playui.setCardSprite(cardNode1,tData.lastPutCard,true);
                cardNode1.name = "card1";//绘制完成后还原
                cardNode1.setScale(1);
            }
            if (tData.lastPutCard2 != -1){
                cardNode2.name = this.HandleCardType.MingGang;
                MjClient.playui.setCardSprite(cardNode2,tData.lastPutCard2,true);
                cardNode2.name = "card2";
                cardNode2.setScale(1);
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
        //@Override 处理麻将吃、碰、杠
        handleCommand:function(playerNode, msg, type){
            var tData = MjClient.data.sData.tData;
            var player = this.getPlayerInfoByName(playerNode.getName());
            if(msg && msg.uid && msg.uid != player.info.uid){
                return;
            }
            if(msg && msg.cpginfo && msg.cpginfo.id != player.info.uid){
                return;
            }
            this.handleOtherPlayerCards(msg);

            switch(type){
                case this.AnimationType.CHI:
                    this.dealChi(playerNode, msg);
                    break;
                case this.AnimationType.PENG:
                    this.dealPeng(playerNode, msg);
                    break;
                case this.AnimationType.GANG:
                    this.dealGang(playerNode, msg);
                    break;
                case this.AnimationType.TING:
                    break;
            }
            MjClient.movingCard = null;
            this.checkPutCards(playerNode);
        },
        //杠改为补动画
        initAnimationType: function(){
            var AnimationType = {
                "CHI"     : "chi",              //吃牌
                "PENG"    : "peng",             //碰牌
                "GANG"    : "bu",             //杠牌
                "HU"      : "hu",               //胡牌
                "TING"    : "",             //听牌
                "ZIMO"    : "zimo",             //自摸胡牌
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
        // @Override 小结算处理
        handleRoundEnd: function(){
            var tData = MjClient.data.sData.tData;
            var niaoCards = tData.mopai;
            var self = this;
            if(MjClient.playui.isInGame()) return;
            var showEndCards = function(){
                self.showBalanceLayer();
            };
            MjClient.playui.playEffectWhenHu(self);
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
                self.showzhuaniao();
            }),cc.delayTime(1),
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
            return new EndOneView_xiangyintuidaohu_new();
        },
        //大结算页面
        createGameOverPanel: function(){
            return new GameOverLayer_maJiang_xiangyintuidaohu();
        },
        //显示抓鸟
        showzhuaniao: function()  
        {
            var tData = MjClient.data.sData.tData;
            var showCards = tData.mopai;
            if (showCards.length < 1) return;
            var niaoPai = MjClient.playui.jsBind.node_NiaoPai._node;
            if (!niaoPai) return;
            niaoPai.setVisible(true);
            niaoPai.name = this.HandleCardType.MingGang;
            this.setCardSprite(niaoPai,showCards[0],true);
            niaoPai.name = "node_NiaoPai";
            //判断哪个玩家中鸟
            var indexoff = -1;
            for (var i = 0; i < 4; i++) {
                var player = this.getPlayerInfoByOff(i);
                if (player && player.niaoNum > 0) 
                {
                    indexoff = i;
                    break;
                }
            }

            var head_node = null;
            var moveAction = null;

            head_node = this.getNodeByOff(indexoff).getChildByName("layout_head");
            moveAction = cc.moveTo(0.5,cc.p(head_node.x + niaoPai.getContentSize().width/2,head_node.y));
            niaoPai.runAction(cc.sequence(cc.DelayTime(0.2),moveAction,cc.DelayTime(0.3)));
        },
        //获取胡牌音效
        getEffectWhenHu:function(offIndex){
            var player = this.getPlayerInfoByOff(offIndex);
            if (!player || player.winType<= 0) {
                return [];
            }

            var SoundMap = {"碰碰胡":"pengpenghu","抢补胡":"qiangganghu","清一色":"qingyise",
                            "将将胡":"jiangjianghu","杠上炮":"gangshangpao","杠上花":"gangshanghua",
                            "全求人":"quanqiuren","豪华七对":"haohuaqidui","双豪华七对":"haohuaqidui",
                            "七对":"qidui","海底炮":"haidilao","海底捞月":"haidilao"};
            var SoundList = [];
            for (var i in SoundMap) {
                if ((""+player.mjdesc).indexOf(i) >= 0) 
                {
                    var SoundFile = "tuidaohu/nv/" + SoundMap[i];
                    var SoundName = MjClient.playui.changeSoundBySex(SoundFile,player);
                    SoundList.push(SoundName);
                }
            }
            
            return SoundList;
        },
        //切换男女声
        changeSoundBySex:function(SoundFile,player){
            //男女声切换
            if (player && player.info.sex == 1)
            {
                var newPath = SoundFile.replace("/nv/", "/nan/");
                var fullFilePath = "sound/" + newPath + ".mp3";
                if (jsb.fileUtils.isFileExist(fullFilePath))
                {
                    SoundFile = newPath;
                }
            }
            var str = "sound/" + SoundFile + ".mp3";
            return str;
        },
        //播放胡牌音效
        playEffectWhenHu:function(node){
            var SoundList = [];
            for (var i = 0; i < 4 ; i++) {
                var SoundRes = this.getEffectWhenHu(i);
                if (SoundRes) 
                {
                    SoundList = SoundList.length < SoundRes.length ? SoundRes : SoundList;
                }
            }
            
            if (SoundList.length <= 0)        
            {
                return;
            }
            
            var replay = function (nodes, list){
                if( list && list.length == 0){
                    return;
                }
                var SoundItem = list[0];
                reallyPlayEffect(SoundItem,false); 
                node.runAction(
                    cc.sequence(cc.delayTime(1.0),
                    cc.callFunc(
                        function() { 
                            list.shift();
                            replay(nodes,list);
                        })
                    ));
            }
            replay(node,SoundList);
        },
        //开启自动摸打
        isCanAutoPut: function(){
            return true;
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
