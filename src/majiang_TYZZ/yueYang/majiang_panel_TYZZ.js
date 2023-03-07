var majiang_panel_TYZZ = majiang_panel_yueyang.extend({
	jsonFile:"Play_TYZZ_new.json",

	ctor:function(){
		this._super(majiang_panel_TYZZ, this.jsonFile);
	},

	//override
    getJsBind: function(){
        var jsBind = {
            node_down: {
                layout_head:{
                    text_piao:{
                        _event:{
                            clearCardUI: function(){
                                var tData = MjClient.data.sData.tData;
                                if(!tData.areaSelectMode.piaoniao){
                                    this.visible = false;
                                }
                            }
                        },
                        updatePiaoContent:function(data){
                            MjClient.playui.setPlayerJiaZhuScore("node_down", this);
                        }
                    },
                    node_gangScore:{
                        _run:function(){
                            this.visible = false;
                            this.setUserData({pos:this.getPosition()}); 
                        },
                        _event: {
                            MJGangScore: function(d){
                                MjClient.playui.updateGangScore(this, d);
                            },
                            initSceneData: function(){
                                this.visible = false;
                            }
                        }
                    },
                    atlas_score: {
                        _event: {
                            addPlayer: function(){
                                var player = MjClient.playui.getPlayerInfoByName("node_down");
                                if (!player) {
                                    return;
                                }

                                this.visible = true;
                                if (player.gangScore + player.winall) {
                                    changeAtalsForLabel(this, player.gangScore + player.winall);
                                } else {
                                    changeAtalsForLabel(this, 0);
                                }
                            },
                            removePlayer: function(){
                                var player = MjClient.playui.getPlayerInfoByName("node_down");
                                if (!player) {
                                    this.visible = false;
                                    changeAtalsForLabel(this, "");
                                }
                            },
                            mjhand: function(){
                                var player = MjClient.playui.getPlayerInfoByName("node_down");
                                if (!player) {
                                    return;
                                }
                                
                                if (player.winall) {
                                    changeAtalsForLabel(this, player.winall);
                                } else {
                                    changeAtalsForLabel(this, 0);
                                }
                            },
                            roundEnd: function(){
                                var player = MjClient.playui.getPlayerInfoByName("node_down");
                                if (!player) {
                                    return;
                                }

                                if (player.winall) {
                                    changeAtalsForLabel(this, player.winall);
                                } else {
                                    changeAtalsForLabel(this, 0);
                                }
                            },
                            initSceneData: function(){
                                var player = MjClient.playui.getPlayerInfoByName("node_down");
                                if (!player) {
                                    return;
                                }

                                if (!MjClient.playui.isInGame()) {
                                    player.gangScore = 0;
                                }

                                if (player.gangScore + player.winall) {
                                    changeAtalsForLabel(this, player.gangScore + player.winall);
                                } else {
                                    changeAtalsForLabel(this, 0);
                                }
                            }
                        }
                    },
                }
            },

            node_left: {
                layout_head:{
                    text_piao:{
                        _event:{
                            clearCardUI: function(){
                                var tData = MjClient.data.sData.tData;
                                if(!tData.areaSelectMode.piaoniao){
                                    this.visible = false;
                                }
                            }
                        },
                        updatePiaoContent:function(data){
                            MjClient.playui.setPlayerJiaZhuScore("node_left", this);
                        }
                    },
                     node_gangScore:{
                        _run: function(){
                            this.visible = false;
                            this.setUserData({pos:this.getPosition()}); 
                        },
                        _event: {
                            MJGangScore: function(d){
                                MjClient.playui.updateGangScore(this, d);
                            },
                            initSceneData: function(){
                                this.visible = false;
                            }
                        }
                    },
                    atlas_score: {
                        _visible: true,
                        _run: function(){
                            this.setString("");
                        },
                        _event: {
                            addPlayer: function(){
                                var player = MjClient.playui.getPlayerInfoByName("node_left");
                                if (!player) {
                                    return;
                                }

                                this.visible = true;
                                if (player.gangScore + player.winall) {
                                    changeAtalsForLabel(this, player.gangScore + player.winall);
                                } else {
                                    changeAtalsForLabel(this, 0);
                                }
                            },
                            removePlayer: function(){
                                var player = MjClient.playui.getPlayerInfoByName("node_left");
                                if (!player) {
                                    this.visible = false;
                                    changeAtalsForLabel(this, "");
                                }
                            },
                            mjhand: function(){
                                var player = MjClient.playui.getPlayerInfoByName("node_left");
                                if (!player) {
                                    return;
                                }
                                
                                if (player.winall) {
                                    changeAtalsForLabel(this, player.winall);
                                } else {
                                    changeAtalsForLabel(this, 0);
                                }
                            },
                            roundEnd: function(){
                                var player = MjClient.playui.getPlayerInfoByName("node_left");
                                if (!player) {
                                    return;
                                }

                                if (player.winall) {
                                    changeAtalsForLabel(this, player.winall);
                                } else {
                                    changeAtalsForLabel(this, 0);
                                }
                            },
                            initSceneData: function(){
                                var player = MjClient.playui.getPlayerInfoByName("node_left");
                                if (!player) {
                                    return;
                                }

                                if (!MjClient.playui.isInGame()) {
                                    player.gangScore = 0;
                                }
                                
                                if (player.gangScore + player.winall) {
                                    changeAtalsForLabel(this, player.gangScore + player.winall);
                                } else {
                                    changeAtalsForLabel(this, 0);
                                }
                            }
                        }
                    },
                }
            },

            node_right: {
                layout_head:{
                    text_piao:{
                        _event:{
                            clearCardUI: function(){
                                var tData = MjClient.data.sData.tData;
                                if(!tData.areaSelectMode.piaoniao){
                                    this.visible = false;
                                }
                            }
                        },
                        updatePiaoContent:function(data){
                            MjClient.playui.setPlayerJiaZhuScore("node_right", this);
                        }
                    },
                    node_gangScore:{
                        _run: function(){
                            this.visible = false;
                            this.setUserData({pos:this.getPosition()}); 
                        },
                        _event: {
                            MJGangScore: function(d){
                                MjClient.playui.updateGangScore(this, d);
                            },
                            initSceneData: function(){
                                this.visible = false;
                            }
                        }
                    },
                    atlas_score: {
                        _run: function(){
                            this.setString("");
                        },
                        _event: {
                            addPlayer: function(){
                                var player = MjClient.playui.getPlayerInfoByName("node_right");
                                if (!player) {
                                    return;
                                }

                                this.visible = true;
                                if (player.gangScore + player.winall) {
                                    changeAtalsForLabel(this, player.gangScore + player.winall);
                                } else {
                                    changeAtalsForLabel(this, 0);
                                }
                            },
                            removePlayer: function(){
                                var player = MjClient.playui.getPlayerInfoByName("node_right");
                                if (!player) {
                                    this.visible = false;
                                    changeAtalsForLabel(this, "");
                                }
                            },
                            mjhand: function(){
                                var player = MjClient.playui.getPlayerInfoByName("node_right");
                                if (!player) {
                                    return;
                                }
                                
                                if (player.winall) {
                                    changeAtalsForLabel(this, player.winall);
                                } else {
                                    changeAtalsForLabel(this, 0);
                                }
                            },
                            roundEnd: function(){
                                var player = MjClient.playui.getPlayerInfoByName("node_right");

                                if (!player) {
                                    return;
                                }

                                if (player.winall) {
                                    changeAtalsForLabel(this, player.winall);
                                } else {
                                    changeAtalsForLabel(this, 0);
                                }
                            },
                            initSceneData: function(){
                                var player = MjClient.playui.getPlayerInfoByName("node_right");
                                if (!player) {
                                    return;
                                }

                                if (!MjClient.playui.isInGame()) {
                                    player.gangScore = 0;
                                }

                                if (player.gangScore + player.winall) {
                                    changeAtalsForLabel(this, player.gangScore + player.winall);
                                } else {
                                    changeAtalsForLabel(this, 0);
                                }
                            }
                        }
                    },
                }
            },

            node_top: {
                layout_head:{
                    text_piao:{
                        _event:{
                            clearCardUI: function(){
                                var tData = MjClient.data.sData.tData;
                                if(!tData.areaSelectMode.piaoniao){
                                    this.visible = false;
                                }
                            }
                        },
                        updatePiaoContent:function(data){
                            MjClient.playui.setPlayerJiaZhuScore("node_top", this);
                        }
                    },
                    node_gangScore:{
                        _run: function(){
                            this.visible = false;
                            this.setUserData({pos:this.getPosition()}); 
                        },
                        _event: {
                            MJGangScore: function(d){
                                MjClient.playui.updateGangScore(this, d);
                            },
                            initSceneData: function(){
                                this.visible = false;
                            }
                        }
                    },
                    atlas_score: {
                        _visible: true,
                        _run: function(){
                            this.setString("");
                        },
                        _event: {
                            addPlayer: function(){
                                var player = MjClient.playui.getPlayerInfoByName("node_top");
                                if (!player) {
                                    return;
                                }

                                this.visible = true;
                                if (player.gangScore + player.winall) {
                                    changeAtalsForLabel(this, player.gangScore + player.winall);
                                } else {
                                    changeAtalsForLabel(this, 0);
                                }
                            },
                            removePlayer: function(){
                                var player = MjClient.playui.getPlayerInfoByName("node_top");
                                if (!player) {
                                    this.visible = false;
                                    changeAtalsForLabel(this, "");
                                }
                            },
                            mjhand: function(){
                                var player = MjClient.playui.getPlayerInfoByName("node_top");
                                if (!player) {
                                    return;
                                }
                                
                                if (player.winall) {
                                    changeAtalsForLabel(this, player.winall);
                                } else {
                                    changeAtalsForLabel(this, 0);
                                }
                            },
                            roundEnd: function(){
                                var player = MjClient.playui.getPlayerInfoByName("node_top");
                                if (!player) {
                                    return;
                                }

                                if (player.winall) {
                                    changeAtalsForLabel(this, player.winall);
                                } else {
                                    changeAtalsForLabel(this, 0);
                                }
                            },
                            initSceneData: function(){
                                var player = MjClient.playui.getPlayerInfoByName("node_top");
                                if (!player) {
                                    return;
                                }

                                if (!MjClient.playui.isInGame()) {
                                    player.gangScore = 0;
                                }

                                if (player.gangScore + player.winall) {
                                    changeAtalsForLabel(this, player.gangScore + player.winall);
                                } else {
                                    changeAtalsForLabel(this, 0);
                                }
                            }
                        }
                    },
                }
            },

            img_jiaPiao:{
                _run: function(){
                    this.visible = false;
                    setWgtLayout(this,[0.12, 0.12], [0.5, 0.25], [0, 0]);
                },_event: {
                    initSceneData: function(){
                        var tData = MjClient.data.sData.tData;
                        if(tData.areaSelectMode.piaoType < 4){
                            this.visible = false;
                            return;
                        }
                        var pl = MjClient.playui.getPlayerInfoByName("node_down");
                        if(!pl){
                            return;
                        }
                        if(pl.mjState == TableState.waitJiazhu){
                            this.visible = true;
                        }
                    },
                    waitJiazhu: function(){
                        var tData = MjClient.data.sData.tData;
                        if(tData.areaSelectMode.piaoType < 4){
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
                        if(tData.areaSelectMode.piaoType < 4){
                            this.visible = false;
                            return;
                        }
                        var pl = MjClient.playui.getPlayerInfoByName("node_down");
                        if(!pl){
                            return;
                        }
                        if(pl.info.uid == eD.uid){
                            this.visible = false;
                        }
                    }
                },btn_buPiao:{
                    _click:function(btn){  
                        MjClient.playui.sendJiaZhuToServer(0, MjClient.playui.getSelfUid());
                    }
                },btn_piao1: {
                    _click:function(btn){  
                        MjClient.playui.sendJiaZhuToServer(1, MjClient.playui.getSelfUid());
                    }
                },btn_piao2: {
                    _click:function(btn){  
                        MjClient.playui.sendJiaZhuToServer(2, MjClient.playui.getSelfUid());
                    }
                },btn_piao3: {
                    _click:function(btn){  
                        MjClient.playui.sendJiaZhuToServer(3, MjClient.playui.getSelfUid());
                    }
                }
            },
            img_piaoNiao:{
                 _run: function(){
                    this.visible = false;
                    setWgtLayout(this,[0.12, 0.12], [0.5, 0.25], [0, 0]);
                },
                btn_buZha: {
                    _click:function(btn){
                        MjClient.playui.sendJiaZhuToServer(0, MjClient.playui.getSelfUid());
                    }
                },
                btn_zhaNiao: {
                    _click:function(btn){
                        MjClient.playui.sendJiaZhuToServer(2, MjClient.playui.getSelfUid());
                    }
                },
                _event:{
                    initSceneData: function(){
                        var tData = MjClient.data.sData.tData;
                        if(!tData.areaSelectMode.piaoniao){
                            this.visible = false;
                            return;
                        }
                        var pl = MjClient.playui.getPlayerInfoByName("node_down");
                        if(!pl){
                            return;
                        }
                        if(pl.mjState == TableState.waitJiazhu){
                            this.visible = true;
                            if(pl.jiazhuNum > 0){
                                var piao0Btn = this.getChildByName("btn_buZha");
                                piao0Btn.loadTextures("playing/gameTable/buchuo_n.png","playing/gameTable/buchuo_s.png");
                                var piao1Btn = this.getChildByName("btn_zhaNiao");
                                piao1Btn.loadTextures("playing/gameTable/chuoda_n.png","playing/gameTable/chuoda_s.png");                            
                            }else{
                                var piao0Btn = this.getChildByName("btn_buZha");
                                piao0Btn.loadTextures("playing/gameTable/buzha_n.png","playing/gameTable/buzha_s.png");
                                var piao1Btn = this.getChildByName("btn_zhaNiao");
                                piao1Btn.loadTextures("playing/gameTable/zhaniao_n.png","playing/gameTable/zhaniao_s.png");
                            }
                        }
                    },
                    waitJiazhu: function(eD){
                        var tData = MjClient.data.sData.tData;
                        if(!tData.areaSelectMode.piaoniao){
                            this.visible = false;
                            return;
                        }
                        var pl = MjClient.playui.getPlayerInfoByName("node_down");
                        if(!pl){
                            return;
                        }
                        //如果赢家选了扎鸟，则替换为"戳"的按钮
                        if(cc.isArray(eD.chuoId) && eD.chuoId.indexOf(pl.info.uid) >= 0 && pl.jiazhuNum == 2){
                            var piao0Btn = this.getChildByName("btn_buZha");
                            piao0Btn.loadTextures("playing/gameTable/buchuo_n.png","playing/gameTable/buchuo_s.png");
                            var piao1Btn = this.getChildByName("btn_zhaNiao");
                            piao1Btn.loadTextures("playing/gameTable/chuoda_n.png","playing/gameTable/chuoda_s.png");
                        }else{
                            var piao0Btn = this.getChildByName("btn_buZha");
                            piao0Btn.loadTextures("playing/gameTable/buzha_n.png","playing/gameTable/buzha_s.png");
                            var piao1Btn = this.getChildByName("btn_zhaNiao");
                            piao1Btn.loadTextures("playing/gameTable/zhaniao_n.png","playing/gameTable/zhaniao_s.png");
                        }
                        if(cc.isArray(eD.chuoId) && eD.chuoId.indexOf(pl.info.uid) >= 0 && pl.jiazhuNum == 4){
                            this.visible = false;
                        }else{
                            this.visible = true;
                        }
                    },
                    mjhand: function(){
                        this.visible = false;
                    },
                    MJJiazhu: function(eD){
                        var tData = MjClient.data.sData.tData;
                        if(!tData.areaSelectMode.piaoniao){
                            this.visible = false;
                            return;
                        }
                        var pl = MjClient.playui.getPlayerInfoByName("node_down");
                        if(!pl){
                            return;
                        }
                        if(pl.info.uid == eD.uid){
                            this.visible = false;
                        }
                    }
                }
            },
            node_eat:{
                btn_gang:{
                    _touch: function(sender, eventType) {
                        if(eventType == ccui.Widget.TOUCH_BEGAN){
                            MjClient.playui.hasClickBtn = true;
                        }
                        if(eventType == ccui.Widget.TOUCH_CANCELED){
                            MjClient.playui.hasClickBtn = false;
                        }
                        if(eventType == ccui.Widget.TOUCH_ENDED){
                            var callback = function(){
                                 if(sender.checkGang()){
                                    return;
                                }
                                sender.handleGang();
                            };
                            if(!sender.getParent().checkCurrOpPassWithHu(sender,function(){callback()}))
                                return;

                            callback();
                        }
                    },
                    checkGang: function(){
                       var tData = MjClient.data.sData.tData;
                        var pl = MjClient.playui.getPlayerInfoByName("node_down");
                        if(pl.isZiMoHu && !MjClient.majiang.canHuAfterGang(pl.mjhand, MjClient.playui.gangCardArray[0], tData.hunCard)
                            && !pl.isCanGang){
                            MjClient.showToast("有胡必胡");
                            return true;
                        }

                        if(pl.mustHu && !pl.isCanGang){
                            MjClient.showToast("有胡必胡");
                            return true;
                        }

                        if(tData.areaSelectMode.bihuType && pl.eatFlag & 8){
                            if(!MjClient.majiang.canHuAfterGang(pl.mjhand, MjClient.playui.gangCardArray[0], tData.hunCard)){
                                MjClient.showToast("有胡必胡");
                                return true;
                            }
                        }
                        return false;
                    },
                    handleGang:function(){
                        if(MjClient.playui.gangCardArray.length > 1){
                            var showCardsNode = MjClient.playui.jsBind.node_eat.node_showCards._node;
                            showCardsNode.getChildByName("img_showCardsBg").showGangCards();
                            return;
                        }
                        MjClient.playui.sendGangToServer(MjClient.playui.gangCardArray[0]);
                        MjClient.playui.hideEatNodeChildren();
                    }
                },
                btn_peng:{
                    _touch: function(sender, eventType) {
                        if(eventType == ccui.Widget.TOUCH_ENDED){
                            var callback = function(){
                                if(sender.checkPeng()){
                                    return;
                                }
                                sender.handlePeng();
                            };
                            if(!sender.getParent().checkCurrOpPassWithHu(sender,function(){callback()}))
                                return; 
                            callback();
                        }
                    },
                    checkPeng:function(){
                       if (MjClient.rePlayVideo != -1) return; // 回放时候不能请求
                        var tData = MjClient.data.sData.tData;
                        var pl = MjClient.playui.getPlayerInfoByName("node_down");
                        if(pl.mustHu){
                            MjClient.showToast("有胡必胡");
                            return true;
                        }
                        return false;
                    },
                    handlePeng:function(){
                        MjClient.playui.sendPengToServer();
                        MjClient.playui.hideEatNodeChildren();
                    }
                },
                btn_chi:{
                    _touch: function(sender, eventType){
                        if(eventType == ccui.Widget.TOUCH_ENDED){
                            var callback = function(){
                                if(sender.checkChi()){
                                    return;
                                }
                                sender.handleChi();
                            };
                            if(!sender.getParent().checkCurrOpPassWithHu(sender,function(){callback()}))
                                return;

                            callback();
                        }
                    },
                    checkChi:function(){
                        var tData = MjClient.data.sData.tData;
                        var pl = MjClient.playui.getPlayerInfoByName("node_down");
                        if(pl.mustHu){
                            MjClient.showToast("有胡必胡");
                            return true;
                        }
                        return false;
                    },
                    handleChi:function(){
                        if(MjClient.playui.eatCardArray.length > 1){
                            var showCardsNode = MjClient.playui.jsBind.node_eat.node_showCards._node;
                            showCardsNode.getChildByName("img_showCardsBg").showEatCards();
                            return;
                        }
                        MjClient.playui.sendChiToServer(MjClient.playui.eatCardArray[0]);
                        MjClient.playui.hideEatNodeChildren();
                    }
                },
                //检查当前操作与胡是否冲突
                checkCurrOpPassWithHu:function(node, func){
                    var huNode = node.getParent().getChildByName("btn_hu");
                    if(huNode.isVisible() && node.isVisible()){
                        MjClient.showMsg("确定 不胡 吗?", function(){
                            func.call(node);
                        }, function(){}, "1");
                        return false;
                    }
                    return true;
                }
            }
        }
        return jsBind;
    }
});

//Override
majiang_panel_TYZZ.prototype.isCanAutoPut = function( ){
        return true;
};

/**
 * Override
 * [clickPass description]
 * @return {[type]} [description]
 */
majiang_panel_TYZZ.prototype.clickPass = function(){
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
                self.showPassHuTips();
                self.hideEatNodeChildren();
                MjClient.playui.sendPassToServer();
                return;
            }

            MjClient.showMsg("确认不胡吗?", function(result) {
                if(result && result.isSelect){
                    //选择了不在提示,
                    util.localStorageEncrypt.setStringItem("IGNORE_H_TIP",roomMsgValue);
                }
                self.showPassHuTips();
                self.hideEatNodeChildren();
                MjClient.playui.sendPassToServer();
            }, function() {}, "3");
        }else{
            self.showPassHuTips();
            self.hideEatNodeChildren();
            MjClient.playui.sendPassToServer();
            
        }
    }
};

//Override
majiang_panel_TYZZ.prototype.checkWhenPass = function(){
    var sData = MjClient.data.sData;
    var tData = sData.tData;

    var pl = MjClient.playui.getPlayerInfoByOff(0);
    if(pl.isZiMoHu) {
        MjClient.showToast("自摸必须胡牌");
        return true;
    }

    if(tData.areaSelectMode.bihuType && (pl.eatFlag & 8)){
        MjClient.showToast("有胡必胡");
        return true;
    }
    return false;
};

/**
 * Override
 * [checkWhenTouchBegan]
 * @param  {[type]} cardNode [description]
 * @return {[type]}          [description]
 */
majiang_panel_TYZZ.prototype.checkWhenTouchBegan = function(cardNode){
    if(MjClient.movingCard !== null && MjClient.movingCard != cardNode){
        return true;
    } 
    var handCount = this.getCardNodeCountByName(cardNode.getParent(), this.HandleCardType.Hand);
    if(!(handCount % 3 == 2 && this.isTurnMe() || handCount % 3 == 1 && !this.isTurnMe())){
        return true;
    }

    var player = MjClient.playui.getPlayerInfoByName("node_down");
    var sData = MjClient.data.sData;
    var tData = sData.tData;

    // 自动摸打
    if (player.tPutCard && this.isTurnMe()) {
        if (!MjClient.Scene.ToastNodeArray || MjClient.Scene.ToastNodeArray.length == 0) {
            MjClient.showToast("出牌请先取消自动摸打");
        }
        return true;
    }

    if(player.isZiMoHu) {
        MjClient.showToast("必须胡牌");
        return true;
    }

    if(tData.areaSelectMode.bihuType && player.eatFlag & 8){
        MjClient.showToast("有胡必胡");
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

//Override
majiang_panel_TYZZ.prototype.createEndOnePanel = function(){
	return new majiang_winGamePanel_TYZZ();
};

/**
 * 刷新杠分
 */
majiang_panel_TYZZ.prototype.updateGangScore = function(node, data){
    if(!node || !cc.sys.isObjectValid(node)) return;

    var sData = MjClient.data.sData;
    if(!sData){
        return;
    }

     var pl = MjClient.playui.getPlayerInfoByName(node.getParent().getParent().getName());
    if(!pl){
        return;
    }
    var score = data.scoreArr[pl.info.uid + ""];
    if(!score || score == 0){
        return;
    }
    node.visible = true;
    node.setPosition(node.getUserData().pos);

    var iconImg = node.getChildByName("img_icon");
    var scoreText = node.getChildByName("text_score");

    pl.winall = pl.winall || 0;

    var iconFileName = score > 0 ? "playground/gang_addIcon.png":"playground/gang_subIcon.png";
    var scoreFileName = score > 0 ? "playground/gang_addText.png":"playground/gang_subText.png";

    iconImg.loadTexture(iconFileName);
    scoreText.setProperty(score, scoreFileName, 50, 73, ".");
    scoreText.ignoreContentAdaptWithSize(true);

    var moveAction = cc.moveBy(0.5,cc.p(0, 10));
    var callFunc = cc.callFunc(function(){
        var parent = node.parent;
        var scoreText = parent.getChildByName("atlas_score");
        changeAtalsForLabel(scoreText, pl.gangScore + pl.winall);
    });
    var delayAction = cc.delayTime(1.5);
    var endCallFunc = cc.callFunc(function(){
        node.visible = false;
    });
    var seqAction = cc.sequence(moveAction, callFunc, delayAction, endCallFunc);
    node.runAction(seqAction);
};

majiang_panel_TYZZ.prototype.handlerWhenCardTouchEnded = function (cardNode, cardTag) {
    this.showPassHuTips();
    this.putOutCard(cardNode, cardTag);
};

/**
 *  获得玩家可操作按钮
 **/
majiang_panel_TYZZ.prototype.getPlayerEatNode = function(){
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var player = sData.players[this.getSelfUid()];
    var isOnlyHu = tData.areaSelectMode.bihuType && player.eatFlag & 8;
    var eat = MjClient.playui.jsBind.node_eat;
    var nodeArr = [];
    this.gangCardArray = [];
    if(this.isTurnMe()){
        if (player.eatFlag & 8) {
            nodeArr.push(eat.btn_hu._node);
        }

        //杠
        if(this.checkGangBtn(player) && !this.clickGangPass){
            nodeArr.push(eat.btn_gang._node);
        }

        if (player.eatFlag & 8 && player.isNew) {
            player.isZiMoHu = true;
        } else {
            player.isZiMoHu = false;
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

    if(nodeArr.length > 0 && !isOnlyHu){
        nodeArr.push(eat.btn_guo._node);
    }
    this.reloadBtnTexture(nodeArr);
    return nodeArr;
};

//Override 是否出牌放大动画
majiang_panel_TYZZ.prototype.isOpenPutOutCardAnima = function(){
        return true;
}

//Override 2d视角下，混牌提示是否展示(左上角定混的牌)
majiang_panel_TYZZ.prototype.isHunCardShow = function(){
    return false;
};

//Override  玩家操作按钮(吃碰杠胡)位置大小自适应
majiang_panel_TYZZ.prototype.updatePlayerEatBtn = function(){
    this.hideEatNodeChildren();
    MjClient.playui.addLightAniEatBtns(); // 设置麻将的吃碰杠按钮特效

    var sData = MjClient.data.sData;
    var player = sData.players[MjClient.playui.getSelfUid()];

    if(!this.isTurnMe() && player.mjState != TableState.waitEat){
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

//设置玩家加注分
majiang_panel_TYZZ.prototype.setPlayerJiaZhuScore = function(playerNodeName, scoreNode){
    var player = this.getPlayerInfoByName(playerNodeName);
    if(!player || player.jiazhuNum < 0){
        return;
    }

    if(!scoreNode || !cc.sys.isObjectValid(scoreNode)) return;
    var jiazhuNum = player.jiazhuNum;
    
    scoreNode.visible = true;
    var content = jiazhuNum == 0 ? "不飘" : "飘" + jiazhuNum;
    var tData = MjClient.data.sData.tData;
    if(tData.areaSelectMode.piaoniao){
        content = "鸟+" + jiazhuNum;
    }
    scoreNode.setString(content);
};

//中鸟条件
majiang_panel_TYZZ.prototype.getIsZhongBird = function(cd){
    var tData = MjClient.data.sData.tData ;
    var birdArr = tData.mopai;
    var niaoToPl = {1: 0, 2: 1, 3: 2, 4: 3, 5: 0, 6: 1, 7: 2, 8: 3, 9: 0};
   
    //转转麻将上中下鸟不显示光效
    if(tData.areaSelectMode.anzhuang){
        var cardNum = cd % 10;

        if ((tData.zhuang + cardNum + tData.maxPlayer - 1) % tData.maxPlayer == tData.uids.indexOf(this.getSelfUid())){
            return true;
        }
    }else if(tData.areaSelectMode.buLunKong){
        var cardNum = cd % 10;

        if ((cardNum + tData.maxPlayer) % tData.maxPlayer == 1) {
            return true;
        }
    }else if(birdArr.length > 1 && tData.areaSelectMode.zhuaniao != 1){
        if (cd == 31 || cd == 71 ||
            (cd <= 29 && cd % 10 == 1 || cd % 10 == 5 || cd % 10 == 9)){
            return true;
        }
    }
    return false;
};