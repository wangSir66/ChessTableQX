//益阳麻将
var playPanel_yiYangMaJiang;
(function() {
    playPanel_yiYangMaJiang = majiang_panel.extend({
        getJsBind: function(){
            var jsBind = {
                layout_roundInfo2D:{
                    img_cardNum: {
                        text_cardNum: {
                            _event: {
                                PickHaiDiCard: function(data){
                                    var tData = MjClient.data.sData.tData;
                                    if (tData) {
                                        this.setString(MjClient.majiang.getAllCardsTotal(tData) - data.cardNext);
                                    }
                                }
                            }
                        }
                    }
                },
                layout_roundInfo3D:{
                    image_cardNumBg: {
                        text_cardNum: {
                            _event: {
                                PickHaiDiCard: function(data){
                                    var tData = MjClient.data.sData.tData;
                                    if (tData) {
                                        this.setString(MjClient.majiang.getAllCardsTotal(tData) - data.cardNext);
                                    }
                                }
                            }
                        }
                    }
                },
                node_down:{
                    text_baoTingWait: {  //所有报听相关的处理都在这里
                        _layout: [[0.3, 0.3],[0.5, 0.37],[0, 0]],
                        _visible: false,
                        _run: function() {
                            this.ignoreContentAdaptWithSize(true);
                        },
                        _event: {
                            MJCanBaoTing: function(eD){
                                cc.log("------------HHHHH: MJCanBaoTing-----------");
                                var sData = MjClient.data.sData;
                                var tData = sData.tData;
                                MjClient.playui.updatePlayerEatBtn(); //弹报听按钮

                                if(MjClient.playui.getSelfUid() != tData.uids[tData.zhuang]){
                                    return ;
                                }

                                for (var uid in sData.players) {
                                    if(MjClient.playui.getSelfUid() == uid) continue;
                                    var pl = sData.players[uid];
                                    if (pl.tingStatus == 2) {
                                        this.visible = true;
                                        break ;
                                    }
                                }
                            },
                            MJBaoTing: function(eD){
                                cc.log("------------HHHHH: BaoTing-----------");
                                MjClient.playui.handleMJTing(eD);     //报听处理

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
                    _event: {
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
                        }
                    }
                },
                node_eat:{
                    btn_ting: {
                        _visible: false,
                        _touch: function(sender, eventType){
                            if(eventType == ccui.Widget.TOUCH_ENDED){
                                MjClient.playui.hideEatNodeChildren();
                                var sData = MjClient.data.sData;
                                var tData = sData.tData;
                                var player = MjClient.playui.getPlayerInfoByName("node_down");

                                if (player.tingStatus < 0 && player.putCount == 0 && player.mjhand.length == 14 && tData.areaSelectMode.baoting) {
                                    MjClient.playui.clickTing = true;
                                    this.getParent().getChildByName("btn_cancel").visible = true;
                                    MjClient.playui.updateCardColorAfterTing();
                                } else {
                                    MjClient.playui.MJTingToServer(MjClient.playui.getSelfUid(), true);
                                }
                            }
                        },
                    }
                },
                Img_haidiCard:{
                    _run:function() {
                        this.visible = false;
                        setWgtLayout(this,[0.12, 0.12], [0.5, 0.7], [0, 0]);
                    },
                    _event:{
                        PickHaiDiCard:function(msg){
                            this.visible = true;
                            this.setName(MjClient.playui.HandleCardType.Hand);
                            MjClient.playui.setCardSprite(this, msg.haidiCard, false);

                            //刷胡牌按钮
                            var sData = MjClient.data.sData;
                            var tData = sData.tData;
                            var curpl = sData.players[tData.uids[msg.curPlayer]];
                            curpl.eatFlag = msg.eatFlag;
                            curpl.mjState = msg.mjState;
                            curpl.isNew = true;
                            tData.tState = msg.TableState;
                            tData.curPlayer = msg.curPlayer;
                            tData.cardNext = msg.cardNext;
                            MjClient.playui.updatePlayerEatBtn();
                        },
                        initSceneData:function(){
                            var sData = MjClient.data.sData;
                            var tData = sData.tData;
                            this.visible = false;
                            if (MjClient.majiang.getAllCardsTotal() - sData.tData.cardNext == 0 && MjClient.playui.isInGame()) {
                                this.visible = true;
                                this.setName(MjClient.playui.HandleCardType.Hand);
                                MjClient.playui.setCardSprite(this, tData.haidiCard, false);
                                //刷胡牌按钮
                                MjClient.playui.updatePlayerEatBtn();
                            }
                        },
                        roundEnd:function(){
                            this.visible = false;
                        }
                    }
                },
                node_wait: {
                    checkBox_autoPut: {
                        _event: {
                            MJBaoTing: function(msg){
                                this.showAutoPut(msg);
                                if (msg.tingStatus == 1) {
                                    MjClient.playui.sendAutoPutToServer(false);
                                }
                            }
                        }
                    }
                }
            };
            return jsBind;
        },
        ctor: function() {
            this._super(playPanel_yiYangMaJiang, "Play_MaJiangYiYang.json");
            this.jsBind = playPanel_yiYangMaJiang.jsBind;
            this.initData();
            this.bindPlayUI();
            return true;
        },
    });
    
    //向服务器发送听牌操作
    playPanel_yiYangMaJiang.prototype.MJTingToServer = function(uid, isTing) {
        if (MjClient.rePlayVideo != -1) return; // 回放时候不能请求
        cc.log("====================MJTingToServer=================");
        MjClient.gamenet.request("pkroom.handler.tableMsg", {
            cmd: "MJBaoTing",
            pl: uid,
            isting: isTing
        });
    }

    //处理听牌
    playPanel_yiYangMaJiang.prototype.handleMJTing = function(msg) {
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
    playPanel_yiYangMaJiang.prototype.doEndAddPutOutCard = function(copyNode){
        if(this.newCardNode){
            delete this.newCardNode;
            this.newCardNode = null;
        }
    }

    //Override
    playPanel_yiYangMaJiang.prototype.handleCommand = function(playerNode, msg, type){
        var tData = MjClient.data.sData.tData;
        var player = this.getPlayerInfoByName(playerNode.getName());
        var playerIndex = tData.uids.indexOf(player.info.uid);
        if (tData.curPlayer != playerIndex && type != this.AnimationType.TING) {
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
                this.dealTing(playerNode, msg);
                break;
        }
        MjClient.movingCard = null;
        this.checkPutCards(playerNode);
    };

    //Override
    playPanel_yiYangMaJiang.prototype.initDirctionNode = function(){
        var nodeNameArr = ["node_down", "node_right", "node_top", "node_left"];
        this.DefaultNodeNameArray = nodeNameArr;
        if (this.getMaxPlayer() == 2) {
            nodeNameArr = ["node_down", "node_top"];
        } else if (this.getMaxPlayer() == 3) {
            nodeNameArr = ["node_down",  "node_right", "node_left"];
        }
        this.NodeNameArray = nodeNameArr;
    };

    //Override
    playPanel_yiYangMaJiang.prototype.getPlayerEatNode = function(){
        var sData = MjClient.data.sData;
        var tData = sData.tData;
        var player = sData.players[MjClient.playui.getSelfUid()];
        var eat = MjClient.playui.jsBind.node_eat;
        var nodeArr = [];
        this.gangCardArray = [];

        if (this.canStartTing(player)) {
            nodeArr.push(eat.btn_ting._node);
        }

        if(this.isTurnMe()){
            //杠
            if(this.checkGangBtn(player)){
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

        if(nodeArr.length > 0){
            nodeArr.push(eat.btn_guo._node);
            
        }
        this.reloadBtnTexture(nodeArr);
        return nodeArr;
    };

    //计算可以听牌的玩家
    playPanel_yiYangMaJiang.prototype.canStartTing = function(player) {
        var tData = MjClient.data.sData.tData;
        if (!tData.areaSelectMode.baoting || player.isTing || player.putCount != 0) {
            return false;
        }

        if (player.tingStatus < 0 && player.mjhand.length == 14) {
            for (var i = 0; i < player.mjhand.length; i++) {
                var cardsAfterPut = player.mjhand.slice();
                cardsAfterPut.splice(i,1);
                var tingSetDict = MjClient.majiang.calTingSet(cardsAfterPut, tData.hunCard, true);
                if (Object.keys(tingSetDict).length > 0) {
                    return true;
                }
            }
        } else if(player.info.uid != tData.uids[tData.zhuang] && player.tingStatus == 2) {
            return true;
        }

        return false;
    }

    //Override
    playPanel_yiYangMaJiang.prototype.updatePlayerEatBtn = function(){
        this.hideEatNodeChildren();
        MjClient.playui.addLightAniEatBtns(); // 设置麻将的吃碰杠按钮特效
        
        var sData = MjClient.data.sData;
        var tData = sData.tData;
        var player = sData.players[MjClient.playui.getSelfUid()];

        if(!this.isTurnMe() && player.mjState != TableState.waitEat && player.tingStatus != 2){
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
    };

    //Override
    playPanel_yiYangMaJiang.prototype.clickPass = function(){
        var that = this;
        if (that.checkWhenPass()){
            return;
        }

        var player = that.getPlayerInfoByOff(0);
        var tData = MjClient.data.sData.tData;
        if (that.canStartTing(player)) {
            var msg = "你确定过听";
            if (that.isTurnMe() && that.checkGangBtn(player)){
                msg += " 杠";
            }
            msg += "吗?";
            MjClient.showMsg(msg,
                function(){
                    that.hideEatNodeChildren();
                    that.MJTingToServer(MjClient.playui.getSelfUid(), false);
                },
                function(){}, "1")
            return;
        }

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
    };
    
    //Override
    playPanel_yiYangMaJiang.prototype.checkWhenTouchBegan = function(cardNode){
        var tData = MjClient.data.sData.tData;
        if(tData.tState == TableState.waitPut && tData.canBaotingNum != 0){
            MjClient.showToast('请等待其他玩家选择是否报听！');
            return true;
        }

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
    
        return false;
    };

    //Override
    //托管时出牌要将置灰的牌恢复颜色
    playPanel_yiYangMaJiang.prototype.updataClickCancelTingBtn = function(isTuoGuanPut){
        var player = this.getPlayerInfoByOff();

        if(player.isTing){
            return;
        }

        if(!this.isTurnMe() && !isTuoGuanPut){
            return;
        }

        var playerNode = this.getNodeByOff();
        var copyNode = playerNode.getChildByName(this.CsdDefaultCardType.HandCard);
        var children = playerNode.children;
        for(var i = 0;i < children.length;i++){
            var cardNode = children[i];
            if(cardNode.name === this.HandleCardType.Hand){
                var tingSign = cardNode.getChildByName("tingSign");
                if(!cc.sys.isObjectValid(tingSign) || (tingSign && !tingSign.visible)){
                    cardNode.setColor(cc.color(255,255,255));
                    this.setTouchCardHandler(copyNode, cardNode);
                }
            }
        }
    };

    playPanel_yiYangMaJiang.prototype.isShowTingLight = function(){
        return true;
    };

    playPanel_yiYangMaJiang.prototype.isNeedCardRotateAction = function(){
        return true;
    };

    playPanel_yiYangMaJiang.prototype.isOpenPutOutCardAnima = function(){
        return true;
    };

    //Override
    playPanel_yiYangMaJiang.prototype.isCanAutoPut = function(){
        return true;
    };
 
    /**
     *  是否开启显示最多听牌标识
     **/
    playPanel_yiYangMaJiang.prototype.isShowMaxTingCards = function(){
        return true;
    };

    //Override
    playPanel_yiYangMaJiang.prototype.getVoiceNameList = function(){  
        return ["普通话","本地话"];
    };

    //Override
    playPanel_yiYangMaJiang.prototype.isNeedSkipHuTip = function(){  
        return true;
    };
}());