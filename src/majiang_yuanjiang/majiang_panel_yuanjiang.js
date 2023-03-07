/***
 * 平江扎鸟，新框架牌桌逻辑
 * @type {void | Class | *}
 */

var majiang_panel_yuanjiang;
(function () {
    majiang_panel_yuanjiang = majiang_panel_yueyang.extend({

        jsonFile: "Play_yuanjiang_new.json",
        getJsBind: function(){
            var jsBind = {
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
                    },
                    btn_ting: {
                        _visible: false,
                        _touch: function(sender, eventType) {
                            if (eventType === ccui.Widget.TOUCH_BEGAN) {
                                MjClient.playui.hasClickBtn = true;
                            }
                            if (eventType === ccui.Widget.TOUCH_CANCELED) {
                                MjClient.playui.hasClickBtn = false;
                            }
                            if (eventType === ccui.Widget.TOUCH_ENDED) {
                                sender.checkTing();
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
                        },
                        checkTing: function () {
                            if(MjClient.playui.isTurnMe()) 
                            {
                                for (var i = 1; i < 4; i++) {
                                    var pl_other = MjClient.playui.getPlayerInfoByOff(i);
                                    if (!pl_other) 
                                    {
                                        continue;
                                    }
                                    if (pl_other.needTing) 
                                    {
                                        return MjClient.showToast("等待其他玩家操作");
                                    }
                                } 
                            }
                        }
                    },
                    btn_noting: {
                        _visible: false,
                        _touch: function(sender, eventType) {
                            if (eventType === ccui.Widget.TOUCH_ENDED) {
                                var player = MjClient.playui.getPlayerInfoByName("node_down");
                                if (player.eatFlag & 8) {
                                    MjClient.showMsg("确认不胡吗?", function () {
                                        MjClient.gamenet.request("pkroom.handler.tableMsg", {
                                            cmd: "MJPassBaoTing",
                                        });
                                        MjClient.playui.hideEatNodeChildren();
                                    }, function () {}, "1");
                                } else {
                                    MjClient.gamenet.request("pkroom.handler.tableMsg", {
                                        cmd: "MJPassBaoTing",
                                    });
                                    MjClient.playui.hideEatNodeChildren();
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
                panel_piaoNiao:{
                    _layout: [[1, 1], [0.5, 0.3], [0, 0]],
                    _event:{
                        initSceneData: function () {
                            this.setVisible(MjClient.playui.isShowPiaoNiaoPanel());
                            MjClient.playui.processPiaoNiaoPanel(this);
                        },
                        waitJiazhu: function(msg){
                            this.setVisible(MjClient.playui.isShowPiaoNiaoPanel(msg));
                            MjClient.playui.processPiaoNiaoPanel(this, msg);
                        },
                        clearCardUI: function () {
                            this.setVisible(false);
                        },
                    },
                    btn_buchuo:{
                        _click: function (sender) {
                            MjClient.playui.handelPiaoFenAndPiaoNiao(0, sender);
                        }
                    },
                    btn_chuoda:{
                        _click: function (sender) {
                            MjClient.playui.handelPiaoFenAndPiaoNiao(2, sender);
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
                            MjClient.playui.updatePlayerEatBtn(true);
                            MjClient.playui.showKaiGangBox();
                            //听牌
                            MjClient.playui.searchAllTingCards();
                            postEvent(MjClient.playui.PlayEventType.SHOW_TING_CARDS);
                            MjClient.playui.updateTingTips();

                            MjClient.playui.cutDownCardsBeforEndOneWhen23D(this);
                        },
                        takecards:function(){
                            MjClient.playui.updatePlayerEatBtn(true);
                        }
                    }
                },
                node_right:{
                    layout_head:{
                        tingIcon:{
                            _visible:false
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
            this._super(majiang_panel_yuanjiang, jsonFile);
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
            player.isZiMoHu = false;
            this.initKaiGangData();

            if(this.isTurnMe()){
                //杠
                if(this.checkGangBtn(player) && !this.clickGangPass){
                    nodeArr.push(eat.btn_gang._node);
                }

                if (this.checkTingBtn(player)) {
                    nodeArr.push(eat.btn_ting._node);
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
                }
                if (player.eatFlag & 2) {
                    nodeArr.push(eat.btn_peng._node);
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
        //@Override 获得玩家可操作的按钮
        getPlayerEatNodeWhenBegan: function() {
            var sData = MjClient.data.sData;
            var tData = sData.tData;
            var player = sData.players[this.getSelfUid()];
            var eat = MjClient.playui.jsBind.node_eat;
            var nodeArr = [];
            this.gangCardArray = [];
            this.eatCardArray = [];
            player.isZiMoHu = false;
            this.initKaiGangData();

            if (!player.needTing || typeof(player.needTing) == "undefined") 
            {
                if (this.isTurnMet() || player.mjState == TableState.waitEat) 
                {
                    return this.getPlayerEatNode();
                }
                else
                {
                    return;
                }
            }
            nodeArr.push(eat.btn_ting._node);
            nodeArr.push(eat.btn_noting._node);

            return nodeArr;
        },        
        //@Override 刷新玩家操作按钮,父类方法不适用于开杠检测
        updatePlayerEatBtn: function(checkBaoTing){
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
            var eatNodeArr;
            checkBaoTing = checkBaoTing === undefined ? false : checkBaoTing;
            if (checkBaoTing) {
                eatNodeArr = this.getPlayerEatNodeWhenBegan();
            }else{
                eatNodeArr = this.getPlayerEatNode();
            }
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

            var tData = MjClient.data.sData.tData;
            if (MjClient.majiang.getAllCardsTotal(tData) - tData.cardNext < MjClient.MaxPlayerNum){
                return false;//最后几张海底牌不能出
            }
            for (var i = 1; i < 4; i++) {
                var pl_other = this.getPlayerInfoByOff(i);
                if (!pl_other){
                    continue;
                }
                if (pl_other.needTing){
                    MjClient.showToast("等待其他玩家操作");
                    return false;
                }
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
            if (player.tingLists ) {
                for (var i in player.tingLists) {
                    this.canTingCards[i] = 1;
                }
            }

            if (Object.keys(this.canTingCards).length > 0) {
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

            if(this.isTurnMe() && player.isTing && !(player.eatFlag & 8) && !this.checkGangBtn(player)){
                this.runAction(cc.sequence(cc.delayTime(0.6),
                    cc.callFunc(function(){
                        if(!cc.sys.isObjectValid(cardNode)) return;
                        MjClient.playui.putOutCard(cardNode, cardNode.tag);
                    })));
            }
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
        },
        // @Override 隐藏吃碰杠等按钮
        hideEatNodeChildren:function() {
            var eatArr = MjClient.playui.jsBind.node_eat;
            for(var key in eatArr){
                if(eatArr[key]._node)
                  eatArr[key]._node.setVisible(false);
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
            return new EndOneView_yuanjiang_new();
        },
        //大结算页面
        createGameOverPanel: function(){
            return new GameOverLayer_maJiang_yuanjiang();
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
