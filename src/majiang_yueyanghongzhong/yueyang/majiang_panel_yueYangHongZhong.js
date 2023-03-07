//新版岳阳红中
var majiang_panel_yueYangHongZhong = majiang_panel_yueyang.extend({
	jsonFile:"Play_yueyanghongzhong_new.json",
	ctor:function(){
		this._super(majiang_panel_yueYangHongZhong, this.jsonFile);
    },
    
    getJsBind:function(){
        var jsBind = {
            img_gameName:{
                _layout: [[0.22, 0], [0.5, 0.74], [0, 1.0]]
            },
            node_down:{
                layout_head:{
                    img_scoreBg:{
                        _visible:false,
                        _event:{
                            addPlayer: function(){},
                            removePlayer: function(){},
                            initSceneData: function(){}
                        }
                    },
                    text_piao:{
                        updatePiaoContent:function(data){
                            MjClient.playui.setPlayerJiaZhuScore("node_down", this);
                        }
                    },
                    text_jiaZhuTip:{
                        _visible:false,
                        _event:{
                            mjhand:function(){
                                MjClient.playui.showJiaZhuAnin(this,"node_down");
                            }
                        }
                    }
                }
            },
            node_right:{
                layout_head:{
                    img_scoreBg:{
                        _visible:false,
                        _event:{
                            addPlayer: function(){},
                            removePlayer: function(){},
                            initSceneData: function(){}
                        }
                    },
                    text_piao:{
                        updatePiaoContent:function(data){
                            MjClient.playui.setPlayerJiaZhuScore("node_right", this);
                        }
                    },
                    text_jiaZhuTip:{
                        _visible:false,
                        _event:{
                            mjhand:function(){
                                MjClient.playui.showJiaZhuAnin(this,"node_right");
                            }
                        }
                    }
                }
            },
            node_top:{
                layout_head:{
                    img_scoreBg:{
                        _visible:false,
                        _event:{
                            addPlayer: function(){},
                            removePlayer: function(){},
                            initSceneData: function(){}
                        }
                    },
                    text_piao:{
                        updatePiaoContent:function(data){
                            MjClient.playui.setPlayerJiaZhuScore("node_top", this);
                        }
                    },
                    text_jiaZhuTip:{
                        _visible:false,
                        _event:{
                            mjhand:function(){
                                MjClient.playui.showJiaZhuAnin(this,"node_top");
                            }
                        }
                    }
                }
            },
            node_left:{
                layout_head:{
                    img_scoreBg:{
                        _visible:false,
                        _event:{
                            addPlayer: function(){},
                            removePlayer: function(){},
                            initSceneData: function(){}
                        }
                    },
                    text_piao:{
                        updatePiaoContent:function(data){
                            MjClient.playui.setPlayerJiaZhuScore("node_left", this);
                        }
                    },
                    text_jiaZhuTip:{
                        _visible:false,
                        _event:{
                            mjhand:function(){
                                MjClient.playui.showJiaZhuAnin(this,"node_left");
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
            node_eat:{
                btn_gang:{
                    checkGang: function(){
                        if(MjClient.playui.gangCardArray.length == 0) return true;
                        
                        var pl = MjClient.playui.getPlayerInfoByName("node_down");
                        
                        if(pl.isZiMoHu && !pl.isCanGang)
                            return true;

                        if(pl.mustHu && !pl.isCanGang){
                            MjClient.showToast("有胡必胡");
                            return true;
                        }

                        return false;
                    }     
                },
                btn_peng:{
                    checkPeng: function(){
                        var pl = MjClient.playui.getPlayerInfoByName("node_down");

                        if(pl.mustHu){
                            MjClient.showToast("有胡必胡");
                            return true;
                        }
                        return false;
                    }
                },
                btn_chi:{
                    checkChi: function(){
                        if(MjClient.playui.eatCardArray.length == 0) return true;
                        var pl = MjClient.playui.getPlayerInfoByName("node_down");

                        if(pl.mustHu){
                            MjClient.showToast("有胡必胡");
                            return true;
                        }
                        return false;
                    }
                }
            }
        };
        return jsBind;
    }
});

majiang_panel_yueYangHongZhong.prototype.checkWhenPass = function(){
    var sData = MjClient.data.sData;
    var tData = sData.tData;

    var pl = MjClient.playui.getPlayerInfoByOff(0);
    if(pl.isZiMoHu) {
        MjClient.showToast("自摸必须胡牌");
        return true;
    }
    return false;
};

majiang_panel_yueYangHongZhong.prototype.clickPass = function(){
	if(this.checkWhenPass())
        return;

    var self = this;
    var tData =  MjClient.data.sData.tData;
    var pl = MjClient.playui.getPlayerInfoByOff(0);
    if(this.isTurnMe() && tData.tState == TableState.waitPut){
        var roomMsgValue = tData.tableid +":"+tData.roundNum;
        var saveRoomMsgValueG = util.localStorageEncrypt.getStringItem("IGNORE_G_TIP","");
        var saveRoomMsgValueH = util.localStorageEncrypt.getStringItem("IGNORE_H_TIP","");
        var canGang = self.checkGangBtn(pl);

        var passCallback = function(isRemerber){

            if(canGang) self.clickGangPass = true;
            if(canGang && isRemerber)
                util.localStorageEncrypt.setStringItem("IGNORE_G_TIP",roomMsgValue);

            if(pl.eatFlag & 8 && isRemerber)//选择过胡
                util.localStorageEncrypt.setStringItem("IGNORE_H_TIP",roomMsgValue);

            self.showPassHuTips();
            self.hideEatNodeChildren();
            MjClient.playui.sendPassToServer();
        };

        if((canGang &&  (saveRoomMsgValueG.length > 0 && saveRoomMsgValueG == roomMsgValue))
            || (pl.eatFlag & 8 && (saveRoomMsgValueH.length > 0 && saveRoomMsgValueH == roomMsgValue))){//可过杠或者可过胡
                passCallback();
                return;
        }

        var msg = "确认过";
        if(canGang && saveRoomMsgValueG != roomMsgValue)
            msg += " 杠 ";

        if(pl.eatFlag & 8 && saveRoomMsgValueG != roomMsgValue)
            msg += " 胡 ";

        msg = msg + "吗?"
        MjClient.showMsg(msg, function(result){
            passCallback(result && result.isSelect);
        }, function() {}, "3");
    }else {
        if(pl.eatFlag & 8){
            var roomMsgValue = tData.tableid +":"+tData.roundNum;
            var saveRoomMsgValueH = util.localStorageEncrypt.getStringItem("IGNORE_H_TIP","");
            if(saveRoomMsgValueH.length > 0 && saveRoomMsgValueH == roomMsgValue){
                MjClient.playui.showPassHuTips();
                MjClient.playui.sendPassToServer();
                self.hideEatNodeChildren();
                return;
            }

            MjClient.showMsg("确认不胡吗?", function(result) {
                if(result && result.isSelect){
                    //选择了不在提示,
                    util.localStorageEncrypt.setStringItem("IGNORE_H_TIP",roomMsgValue);
                }
                MjClient.playui.showPassHuTips();
                MjClient.playui.sendPassToServer();
                self.hideEatNodeChildren();
            }, function() {}, "3");
        }else{
            MjClient.playui.sendPassToServer();
            self.hideEatNodeChildren();
        }
    }
};

// 返回是否显示飘分层牌【自由下飘】
majiang_panel_yueYangHongZhong.prototype.isShowPiaoFenPanel = function () {
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var player = MjClient.playui.getPlayerInfoByName(this.NodeNameArray[0]);
    var isShow = (tData.areaSelectMode.piaoFen === 4);
    return isShow && tData.tState === TableState.waitJiazhu && player && player.mjState === TableState.waitJiazhu;
};

// 飘分按钮回调【统称为jiazhu】
majiang_panel_yueYangHongZhong.prototype.handelPiaoFenAndPiaoNiao = function(index, sender){
    MjClient.playui.sendJiaZhuToServer(index, MjClient.playui.getSelfUid());
    sender.parent.setVisible(false);
    this.getPlayerInfoByName("node_down").mjState = TableState.isReady;
};

//设置玩家加注分
majiang_panel_yueYangHongZhong.prototype.setPlayerJiaZhuScore = function(playerNodeName, scoreNode){
    var player = this.getPlayerInfoByName(playerNodeName);

    if(!player) return;
    if(!scoreNode || !cc.sys.isObjectValid(scoreNode)) return;

    scoreNode.ignoreContentAdaptWithSize(true);
    // scoreNode.setAnchorPoint(cc.p(1, 0.5))
    var jiazhuNum = player.jiazhuNum;
    scoreNode.visible = jiazhuNum > 0;
    var content = jiazhuNum > 0 ? "飘" + jiazhuNum + "分" : "";
    scoreNode.setString(content);
};

//Override 2d视角下，混牌提示是否展示(左上角定混的牌)
majiang_panel_yueYangHongZhong.prototype.isHunCardShow = function(){
    return false;
};

//Override
majiang_panel_yueYangHongZhong.prototype.isCanAddLaiZiIcon = function(cardTag){
    return false;
};

/**
 * Override
 *  end事件的处理
 **/
majiang_panel_yueYangHongZhong.prototype.handlerWhenCardTouchEnded = function(cardNode, cardTag){
    var self = this;
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var player = sData.players[this.getSelfUid()];
    //有胡必胡，自摸不能出牌
    if(tData.tState == TableState.waitPut && player.mjState == TableState.waitPut && this.isTurnMe()
        && player.isNew && player.eatFlag & 8){
            MjClient.movingCard = null;
            self.resetCardLayout(self.getNodeByName("node_down"));
        return;
    }

    if(player.eatFlag & 8){//默认过胡，直接出牌
        var roomMsgValue = tData.tableid +":"+tData.roundNum;
        var saveRoomMsgValueH = util.localStorageEncrypt.getStringItem("IGNORE_H_TIP","");
        if(saveRoomMsgValueH.length > 0 && saveRoomMsgValueH == roomMsgValue){
            self.showPassHuTips();
            MjClient.playui.sendPassToServer();
            self.putOutCard(cardNode, cardTag);
            return;
        }

        MjClient.showMsg("确认不胡吗?", function(result) {
            if(result && result.isSelect){
                //选择了不在提示
                if(self.checkGangBtn(player))
                    util.localStorageEncrypt.setStringItem("IGNORE_G_TIP",roomMsgValue);
                if(pl.eatFlag & 8)
                    util.localStorageEncrypt.setStringItem("IGNORE_H_TIP",roomMsgValue);
            }
            self.showPassHuTips();
            MjClient.playui.sendPassToServer();
            self.putOutCard(cardNode, cardTag);
        }, function() {
            MjClient.movingCard = null;
            self.resetCardLayout(self.getNodeByName("node_down"));
        },"3");
        return;
    }

    if(MjClient.majiang.isHunCard && MjClient.majiang.isHunCard(cardTag, MjClient.data.sData.tData.hunCard)){
        MjClient.showMsg("是否将红中打出?", function() {
            self.putOutCard(cardNode, cardTag);
        }, function() {
            MjClient.movingCard = null;
            self.resetCardLayout(self.getNodeByName("node_down"));
        }, "1");
        return;
    }

    this.putOutCard(cardNode, cardTag);
};

//Override
majiang_panel_yueYangHongZhong.prototype.isShowTingLight = function(){
    return false;
}

//Override
majiang_panel_yueYangHongZhong.prototype.isCanAutoPut = function( ){
    return true;
};

/**
 * Override
 *  是否开启显示最多听牌标识
 **/
majiang_panel_yueYangHongZhong.prototype.isShowMaxTingCards = function(){
    return true;
};

majiang_panel_yueYangHongZhong.prototype.checkWhenTouchBegan = function(cardNode){
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

    if(player.mustHu){
        MjClient.showToast("有胡必胡");
        return true;
    }

    if (MjClient.playui.clickTing && !MjClient.canTingCards[cardNode.tag] && this.isTurnMe()){
        return true;
    }
    return false;
};

/**
 *  获得玩家可操作按钮
 **/
majiang_panel_yueYangHongZhong.prototype.getPlayerEatNode = function(){
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var player = sData.players[this.getSelfUid()];
    var eat = MjClient.playui.jsBind.node_eat;
    var nodeArr = [];
    this.gangCardArray = [];

    //自摸
    if(tData.tState == TableState.waitPut && player.mjState == TableState.waitPut && this.isTurnMe()){
        var must_hu = false;
        
        //胡
        if (player.isNew && player.eatFlag & 8) {
            nodeArr.push(eat.btn_hu._node);
            must_hu = true;
        }

        //杠
        if(this.checkGangBtn(player) && player.isNew && !player.isPass){
            nodeArr.push(eat.btn_gang._node);
        }

        if(nodeArr.length > 0 && !must_hu)
            nodeArr.push(eat.btn_guo._node);

    }else if(tData.tState == TableState.waitEat && !this.isTurnMe()){
        if (player.eatFlag & 8) {
            nodeArr.push(eat.btn_hu._node);
        }

        if (player.eatFlag & 4) {
            nodeArr.push(eat.btn_gang._node);
            this.gangCardArray.push(tData.lastPutCard);
        }

        if (player.eatFlag & 2) {
            nodeArr.push(eat.btn_peng._node);
        }

        //如果，有杠，碰，吃。 这出现过的UI. 否则玩家状态为等待
        if(nodeArr.length > 0){
            nodeArr.push(eat.btn_guo._node);
            
        }else{
            player.mjState = TableState.waitCard;
        }
    }
    this.reloadBtnTexture(nodeArr);
    return nodeArr;
};

//展示加飘动画
majiang_panel_yueYangHongZhong.prototype.showJiaZhuAnin = function(node, playerNodeName){
    var tData = MjClient.data.sData.tData;

    if (!tData.areaSelectMode.piaoFen)
        return;

    var pl = this.getPlayerInfoByName(playerNodeName);
    if(!pl) return;

    var playerNode = this.getNodeByName(playerNodeName);
    if(!playerNode || !cc.sys.isObjectValid(playerNode)) return;

    var tipNode = playerNode.getChildByName("node_animation");
    node.setPosition(node.getParent().convertToNodeSpace(tipNode.getPosition()));
    node.visible = true;
    node.opacity = 255;
    node.ignoreContentAdaptWithSize(true);
    node.setString(pl.jiazhuNum > 0 ? "飘分" : "不飘分");
    node.runAction(cc.sequence(cc.delayTime(1), cc.fadeOut(0.5), cc.callFunc(function(){ this.visible = false;}, node)));
};

// @Override 显示大结算
majiang_panel_yueYangHongZhong.prototype.createGameOverPanel = function(){
        return new majiang_gameOverPanel_yueYangHongZhong();
};



//Override
//创建翻鸟view
majiang_panel_yueYangHongZhong.prototype.getShowBirdView = function(niaoCards){
    var self = this;
    return new majiang_showBird(niaoCards,function(){
        self.showBalanceLayer();
    }, majiang_showBird.prototype.SHOW_BIRD_TYPE.MOVE_FROM_RIGHT,{itemSpace: 90});
}