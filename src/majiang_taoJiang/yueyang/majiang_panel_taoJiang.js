//新版桃江麻将
var majiang_panel_taoJiang = majiang_panel_yueyang.extend({
    jsonFile: "Play_MaJiangTaoJiang.json",
    useBtnGuoReplcaeNoTing : false, //“过”按钮具有noTing的功能
    ctor: function(){
        this._super(majiang_panel_taoJiang,this.jsonFile);
    },

    getJsBind:function(){
        var jsBind = {
            _event:{
                loadOther:function(msg){
                    
                },
            },
            img_kaiGang:{
                _visible:false,
                _layout: [[0.20, 0.29], [0.5, 0.35], [0, 0.4]],
                _event:{
                    MJZhiTouZi: function(eD){
                        postEvent("showCardsOfKaiGang", eD.addnewcard);
                    },
                    showCardsOfKaiGang: function(addnewcard){
                        var tData = MjClient.data.sData.tData;
                        if (addnewcard && addnewcard.length != 0){
                            MjClient.playui.showKaiGangBigCards(this, addnewcard);
                        }
                    },
                    putCardAfterGang: function(eD){
                        MjClient.playui.handlePutCardAfterGang(this, eD);
                    },
                    clearCardUI: function() {
                        this.visible = false;
                    },
                    initSceneData: function(eD){
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;
                        var pl = MjClient.playui.getPlayerInfoByName("node_down");
                        var isShowKaiGang = false;

                        for (var uid in sData.players) {
                            if(sData.players[uid].eatFlag !== 0){
                                isShowKaiGang = true;
                            }
                        }

                        if(tData.tState === TableState.roundFinish && pl.mjState === TableState.isReady){
                            isShowKaiGang = false;
                        }

                        function delayExe(){
                            if(isShowKaiGang && tData.gangAddCard && tData.gangAddCard.length != 0)
                                postEvent("showCardsOfKaiGang", tData.gangAddCard);
                        }
                        this.runAction(cc.sequence(cc.delayTime(0.1),cc.callFunc(delayExe)));
                    }
                }
            },
            text_baoTingWait:{
                _visible:false,
                _layout: [[0.3, 0.3], [0.5, 0.37], [0, 0]],
                _run:function(){
                    this.ignoreContentAdaptWithSize(true);
                },
                _event:{
                    MJCanBaoTing: function(){
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;
                        if(MjClient.playui.getSelfUid() != tData.uids[tData.zhuang])
                            return;
                        for (var uid in sData.players) {
                            if(MjClient.playui.getSelfUid() == uid) continue;
                            var pl = sData.players[uid];
                            if (pl.tingStatus == 2) {
                                this.visible = true;
                                break ;
                            }
                        }
                    },
                    MJBaoTing:function(){
                        var tData = MjClient.data.sData.tData;
                        if(MjClient.playui.getSelfUid() != tData.uids[tData.zhuang])
                            return;
                        if(tData.canBaotingNum == 0){
                            this.visible = false;
                        }
                    },
                    initSceneData:function(){
                        this.visible = false;
                        var tData = MjClient.data.sData.tData;
                        if(MjClient.playui.getSelfUid() != tData.uids[tData.zhuang])
                            return ;
                        if(tData.tState == TableState.waitPut && tData.canBaotingNum != 0)
                            this.visible = true;
                    },
                    clearCardUI: function(eD) {
                        this.visible = false;
                    },
                    MJHu: function(eD) {
                        this.visible = false;
                    },
                    MJGang: function(eD) {
                        var tData = MjClient.data.sData.tData;
                        if(tData.canBaotingNum == 0){
                            this.visible = false;
                        }
                    },
                    roundEnd: function(){
                        this.visible = false;
                    }
                }

            },
            node_down:{
                img_tingCardsWithNum:{
                    _event:{
                        MJBaoTing:function(eD){
                            if(eD.uid == SelfUid()){
                                this.visible = false;
                            }
                        }
                    }
                },
                node_animation:{
                    _event:{
                        MJBaoTing:function(data){
                            MjClient.playui.handleBaoTingAnim("node_down", this, data);
                        }
                    }
                },
                layout_head:{
                    node_gangScore:{
                        _visible:false,
                        _event:{
                            MJGangScore:function(ed){
                                MjClient.playui.updateGangScore(this, d);
                            },
                            initSceneData:function(){
                                this._visible = false;
                            }
                        }
                    },
                    img_tingIcon:{
                        _run:function(){
                            this.visible = false;
                            this.runAction(cc.sequence(cc.spawn(cc.tintTo(0.6, 255,0,0),cc.scaleTo(0.6,this.getScale() + 0.3)),
                                cc.spawn(cc.tintTo(0.6, 255,255,255),cc.scaleTo(0.6,this.getScale()))).repeatForever());
                        },
                        _event:{
                            MJBaoTing:function(eD){
                                MjClient.playui.updateTingIcon("node_down", this, eD);
                            }
                        }
                    }
                },
                _event:{
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
                        MjClient.playui.updatePlayerTingBtn();
                        //听牌
                        MjClient.playui.searchAllTingCards();
                        postEvent(MjClient.playui.PlayEventType.SHOW_TING_CARDS);
                        MjClient.playui.updateTingTips();
            
                        MjClient.playui.cutDownCardsBeforEndOneWhen23D(this);
                    },
                    MJBaoTing:function(eD){
                        if(eD.uid == MjClient.playui.getSelfUid()){
                            MjClient.playui.resetCardLayout(MjClient.playui.getNodeByName("node_down"));
                            MjClient.playui.updateCardColorAfterTing();
                        }
                    }
                }
            },
            node_right:{
                node_animation:{
                    _event:{
                        MJBaoTing:function(data){
                            MjClient.playui.handleBaoTingAnim("node_right", this, data);
                        }
                    }
                },
                layout_head:{
                    node_gangScore:{
                        _visible:false,
                        _event:{
                            MJGangScore:function(ed){
                                MjClient.playui.updateGangScore(this, d);
                            },
                            initSceneData:function(){
                                this._visible = false;
                            }
                        }
                    },
                    img_tingIcon:{
                        _run:function(){
                            this.visible = false;
                            this.runAction(cc.sequence(cc.spawn(cc.tintTo(0.6, 255,0,0),cc.scaleTo(0.6,this.getScale() + 0.3)),
                                cc.spawn(cc.tintTo(0.6, 255,255,255),cc.scaleTo(0.6,this.getScale()))).repeatForever());
                        },
                        _event:{
                            MJBaoTing:function(eD){
                                MjClient.playui.updateTingIcon("node_right", this, eD);
                            }
                        }
                    }
                }
            },
            node_top:{
                node_animation:{
                    _event:{
                        MJBaoTing:function(data){
                            MjClient.playui.handleBaoTingAnim("node_top", this, data);
                        }
                    }
                },
                layout_head:{
                    node_gangScore:{
                        _visible:false,
                        _event:{
                            MJGangScore:function(ed){
                                MjClient.playui.updateGangScore(this, d);
                            },
                            initSceneData:function(){
                                this._visible = false;
                            }
                        }
                    },
                    img_tingIcon:{
                        _run:function(){
                            this.visible = false;
                            this.runAction(cc.sequence(cc.spawn(cc.tintTo(0.6, 255,0,0),cc.scaleTo(0.6,this.getScale() + 0.3)),
                                cc.spawn(cc.tintTo(0.6, 255,255,255),cc.scaleTo(0.6,this.getScale()))).repeatForever());
                        },
                        _event:{
                            MJBaoTing:function(eD){
                                MjClient.playui.updateTingIcon("node_top", this, eD);
                            }
                        }
                    }
                }
            },
            node_left:{
                node_animation:{
                    _event:{
                        MJBaoTing:function(data){
                            MjClient.playui.handleBaoTingAnim("node_left", this, data);
                        }
                    }
                },
                layout_head:{
                    node_gangScore:{
                        _visible:false,
                        _event:{
                            MJGangScore:function(ed){
                                MjClient.playui.updateGangScore(this, d);
                            },
                            initSceneData:function(){
                                this._visible = false;
                            }
                        }
                    },
                    img_tingIcon:{
                        _run:function(){
                            this.visible = false;
                            this.runAction(cc.sequence(cc.spawn(cc.tintTo(0.6, 255,0,0),cc.scaleTo(0.6,this.getScale() + 0.3)),
                                cc.spawn(cc.tintTo(0.6, 255,255,255),cc.scaleTo(0.6,this.getScale()))).repeatForever());
                        },
                        _event:{
                            MJBaoTing:function(eD){
                                MjClient.playui.updateTingIcon("node_left", this, eD);
                            }
                        }
                    }
                }
            },
            node_eat:{
                _event:{
                    MJCanBaoTing:function(){
                        MjClient.playui.updatePlayerTingBtn();
                    },
                    switch2Dor3D: function(){
                        if(!MjClient.playui.isInGame()){
                            return;
                        }
                        MjClient.playui.updatePlayerEatBtn();
                        MjClient.playui.updatePlayerTingBtn();
                    },
                    setEatBtnTeXiao: function(){
                        MjClient.playui.updatePlayerEatBtn();
                        MjClient.playui.updatePlayerTingBtn();
                    }
                },
                btn_chi:{
                    _touch:function(sender, eventType){
                        if(sender.checkChi()){
                            return;
                        }
        
                        if(MjClient.playui.eatCardArray.length > 1){
                            var showCardsNode = MjClient.playui.jsBind.node_eat.node_showCards._node;
                            showCardsNode.getChildByName("img_showCardsBg").showEatCards();
                            return;
                        }
                        MjClient.playui.handleChi(MjClient.playui.eatCardArray[0]);
                    },
                    checkChi: function(){
                        if(MjClient.playui.eatCardArray.length == 0) return true;
                        var pl = MjClient.playui.getPlayerInfoByName("node_down");
                        if(pl.mustHu){
                            MjClient.showToast("有胡必胡");
                            return true;
                        }
                        return false;
                    }
                },
                btn_peng:{
                    _touch: function(sender, eventType) {
                        if(eventType == ccui.Widget.TOUCH_ENDED){
                            if(sender.checkPeng()){
                                return;
                            }
                            MjClient.playui.handlePeng();
                        }
                    },
                    checkPeng: function(){
                        var pl = MjClient.playui.getPlayerInfoByName("node_down");

                        if(pl.mustHu){
                            MjClient.showToast("有胡必胡");
                            return true;
                        }
                        return false;
                    }
                },
                btn_ting: {
                    _visible: false,
                    _touch: function(sender, eventType){
                        if(eventType == ccui.Widget.TOUCH_ENDED){
                            MjClient.playui.clickTingBtn(true);
                        }
                    }
                },
                btn_guo: {
                    _visible: false,
                    _touch: function(sender, eventType) {
                        if(eventType != ccui.Widget.TOUCH_ENDED){
                            return;
                        }
                        if(MjClient.playui.useBtnGuoReplcaeNoTing)
                            MjClient.playui.clickTingBtn(false);
                        else
                            MjClient.playui.clickPass();
                    }
                },
                btn_gang:{
                    _touch: function(sender, eventType) {
                        if(eventType == ccui.Widget.TOUCH_BEGAN){
                            MjClient.playui.hasClickBtn = true;
                        }
                        if(eventType == ccui.Widget.TOUCH_CANCELED){
                            MjClient.playui.hasClickBtn = false;
                        }
                        if(eventType == ccui.Widget.TOUCH_ENDED){
                            if(sender.checkGang()){
                                return;
                            }
            
                            if(MjClient.playui.gangCardArray.length > 1){
                                var showCardsNode = MjClient.playui.jsBind.node_eat.node_showCards._node;
                                showCardsNode.getChildByName("img_showCardsBg").showGangCards();
                                return;
                            }
                            MjClient.playui.handleGang(MjClient.playui.gangCardArray[0]);
                        }
                    },
                    checkGang: function(){
                        if(MjClient.playui.gangCardArray.length == 0) return true;
                        var pl = MjClient.playui.getPlayerInfoByName("node_down");
                        if(pl.mustHu && !pl.isCanGang){
                            MjClient.showToast("有胡必胡");
                            return true;
                        }
                        return false; 
                    }  
                },
                node_showCards:{
                    img_showCardsBg:{
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
                                            MjClient.playui.handleChi(sender.tag, sender);
                                        }
                                    }, card);
                                }
                            }
                        },
                        showGangCards: function(){
                            this.showCards();
                            this.visible = true;
                            var cardArr = MjClient.playui.gangCardArray;
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
                                            MjClient.playui.handleGang(sender.tag, self.getParent());
                                        }
                                    }, card);
                                }
                            }
                        }
                    }
                }
            },
            node_hunPai:{
                _visible: false,
                _run:function(){
                    this.setVisible(false);
                    if(MjClient.playui.isIPad()){
                        this.setPosition(cc.winSize.width * 0.044, cc.winSize.height * 0.55);
                    }else if(MjClient.playui.isIPhoneX()){
                        this.setPosition(cc.winSize.width * 0.04, cc.winSize.height * 0.55);
                    }else{
                        this.setPosition(cc.winSize.width * 0.044, cc.winSize.height * 0.55);
                    }
                    this.setScale((0.61 / 640) * cc.winSize.width);
                },
                _event:{
                    clearCardUI: function(eD) {
                        this.visible = false;
                    },
                    mjhand:function(){
                        this.visible = true;
                    },
                    initSceneData:function(){
                        this.visible = MjClient.playui.isArrowVisible();
                    },
                },
                img_baidaBg:{
                    _visible:false
                },
                img_baida:{
                    _visible:false,
                    _event:{
                        mjhand:function(){
                            var originPos = this.getPosition();
                            var originScale = this.getScale();
                            var screenCenter = this.getParent().convertToNodeSpace(cc.p(cc.winSize.width / 2 + this.width / 2, cc.winSize.height / 2));
                            var HuncardMsg = MjClient.data.sData.tData.showCard;
                            if(HuncardMsg){
                                this.tag = HuncardMsg;
                                MjClient.playui.setCardSprite(this, HuncardMsg, true);
                            }

                            this.setScale(0.8);
                            this.visible = true;
                            this.setPosition(screenCenter);
                            var self = this;
                            this.runAction(cc.sequence(cc.delayTime(2),
                                cc.spawn(cc.scaleTo(0.6,originScale),cc.moveTo(0.6,originPos)).easing(cc.easeQuinticActionOut())
                                ,cc.callFunc(function(){
                                    var text = ccui.helper.seekWidgetByName(self.getParent(), "text_baidaTipNum");
                                    if(text && cc.sys.isObjectValid(text))
                                        text.visible = true;
                                })));
                        },
                        initSceneData:function(){
                            this.visible = true;
                            var HuncardMsg = MjClient.data.sData.tData.showCard;
                            if(HuncardMsg){
                                this.tag = HuncardMsg;
                                MjClient.playui.setCardSprite(this, HuncardMsg, true);
                            }   
                        },
                        clearCardUI: function(eD) {
                            this.visible = false;
                        },
                        changeMJBgEvent:function(){
                            var HuncardMsg = MjClient.data.sData.tData.showCard;
                            if(HuncardMsg){
                                this.tag = HuncardMsg;
                                MjClient.playui.setCardSprite(this, HuncardMsg, true);
                            }
                               
                        }
                    }
                },
                img_baida_diwang:{
                    _visible:false,
                    _event:{
                        mjhand:function(){
                            var position = this.getParent().convertToNodeSpace(cc.p(cc.winSize.width / 2 - this.width / 2, cc.winSize.height / 2));
                            var HuncardMsg = MjClient.data.sData.tData.hunCard;
                            if(HuncardMsg){
                                this.tag = HuncardMsg;
                                MjClient.playui.setCardSprite(this, parseInt(HuncardMsg), true);
                            }

                            this.setScale(0.8);
                            this.visible = false;
                            this.setPosition(position);
                            this.runAction(cc.sequence(cc.delayTime(1),
                                cc.callFunc(function(){
                                    this.visible = true;
                                }.bind(this)),
                                cc.delayTime(1),
                                cc.callFunc(function(){
                                    this.visible = false;
                                }.bind(this))
                            ));
                        },
                        initSceneData:function(){
                            this.visible = false;
                        },
                        changeMJBgEvent:function(){
                            var HuncardMsg = MjClient.data.sData.tData.hunCard;
                            if(HuncardMsg)
                                MjClient.playui.setCardSprite(this, parseInt(HuncardMsg), true);
                        }
                    }
                },
                text_baidaTipNum:{
                    _visible:false,
                    _event:{
                        mjhand:function(){
                            var sData = MjClient.data.sData;
                            var tData = sData.tData;
                            if (tData) this.setString(tData.showCardIndex);
                        },
                        initSceneData:function(){
                            this.visible = true;
                            var sData = MjClient.data.sData;
                            var tData = sData.tData;
                            if (tData) this.setString(tData.showCardDis);
                        },
                        waitPut:function (eD) {
                            var sData = MjClient.data.sData;
                            var tData = sData.tData;
                            if (tData) this.setString(tData.showCardIndex);
                        }
                    }
                }
            }
        };
        return jsBind;
    }


});



//Override
majiang_panel_taoJiang.prototype.clickPass = function(){
    if(this.checkWhenPass())
        return;

    var self = this;
    var tData =  MjClient.data.sData.tData;
    var pl = MjClient.playui.getPlayerInfoByName("node_down");
    var roomMsgValue = tData.tableid +":"+tData.roundNum;
    var saveRoomMsgValueG = util.localStorageEncrypt.getStringItem("IGNORE_G_TIP","");
    var saveRoomMsgValueH = util.localStorageEncrypt.getStringItem("IGNORE_H_TIP","")
    if(this.isTurnMe() && tData.tState == TableState.waitPut){
        var canGang = self.checkGangBtn(pl);
        var passCallback = function(isRemerber){
            if(canGang) self.clickGangPass = true;
            if(canGang && isRemerber)
                util.localStorageEncrypt.setStringItem("IGNORE_G_TIP",roomMsgValue);

            if(pl.eatFlag & 8 && isRemerber)//选择过胡
                util.localStorageEncrypt.setStringItem("IGNORE_H_TIP",roomMsgValue);

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

        if(pl.eatFlag & 8 && saveRoomMsgValueH != roomMsgValue)
            msg += " 胡 ";

        msg = msg + "吗?";
        MjClient.showMsg(msg, function(result){
            passCallback(result && result.isSelect);
        }, function() {}, "3");
    }else {
        if(pl.eatFlag & 8){
            var roomMsgValue = tData.tableid +":"+tData.roundNum;
            var saveRoomMsgValueH = util.localStorageEncrypt.getStringItem("IGNORE_H_TIP","");
            if(saveRoomMsgValueH.length > 0 && saveRoomMsgValueH == roomMsgValue){
                MjClient.playui.sendPassToServer();
                self.hideEatNodeChildren();
                return;
            }

            MjClient.showMsg("确认不胡吗?", function(result) {
                if(result && result.isSelect){
                    //选择了不在提示,
                    util.localStorageEncrypt.setStringItem("IGNORE_H_TIP",roomMsgValue);
                }
                MjClient.playui.sendPassToServer();
                self.hideEatNodeChildren();
            }, function() {}, "3");
        }else{
            MjClient.playui.sendPassToServer();
            self.hideEatNodeChildren();
        }
    }
};

//Override
majiang_panel_taoJiang.prototype.checkWhenPass = function(){   
    return false;
};

//Override 2d视角下，混牌提示是否展示(左上角定混的牌)
majiang_panel_taoJiang.prototype.isHunCardShow = function(){
    return false;
};

/**
 * Override
 *  检查杠的按钮
 **/
majiang_panel_taoJiang.prototype.checkGangBtn = function(player){
    var tData = MjClient.data.sData.tData;
    this.gangCardArray = [];
    var gangCardArray = MjClient.majiang.canGang1(player.mjpeng, player.mjhand, player.putCount);
    //开杠
    var isKaiGang = (tData.gangAddCard && tData.gangAddCard.length != 0);
    if(gangCardArray.length > 0 && !isKaiGang && !player.isPass){
        this.gangCardArray = gangCardArray;
        return true;
    }
    return false;
};

/**
 * Override
 *  获得玩家可操作按钮
 **/
majiang_panel_taoJiang.prototype.getPlayerEatNode = function(){
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var player = sData.players[this.getSelfUid()];
    var isOnlyHu = tData.areaSelectMode.bihuType && player.eatFlag & 8;
    var eat = MjClient.playui.jsBind.node_eat;
    var nodeArr = [];
    this.gangCardArray = [];
    this.useBtnGuoReplcaeNoTing = false;
    //开杠
    var isKaiGang = (tData.gangAddCard && tData.gangAddCard.length != 0);

    //自摸
    if(tData.tState == TableState.waitPut && player.mjState == TableState.waitPut && this.isTurnMe()){
        //胡
        if (player.isNew && player.eatFlag & 8) {
            nodeArr.push(eat.btn_hu._node);
        }

        //杠
        if(this.checkGangBtn(player)){
            nodeArr.push(eat.btn_gang._node);
        }

        if(nodeArr.length > 0 && !isKaiGang)
            nodeArr.push(eat.btn_guo._node);
        
        if (player.eatFlag & 8 && player.isNew) {
            player.isZiMoHu = true;
        } else {
            player.isZiMoHu = false;
        }

    }else if((tData.tState == TableState.waitEat || isKaiGang) && !this.isTurnMe()){
        if (player.eatFlag & 8) {
            nodeArr.push(eat.btn_hu._node);
            if(isOnlyHu)
                player.mustHu = true;
        }

        if (player.eatFlag & 4 && !player.mustHu) {
            nodeArr.push(eat.btn_gang._node);
            this.gangCardArray.push(tData.lastPutCard);
        }

        if (player.eatFlag & 2 && !player.mustHu) {
            nodeArr.push(eat.btn_peng._node);
        }

        if(player.eatFlag & 1){
            this.eatCardArray = MjClient.majiang.canChi(player.mjhand, tData.lastPutCard, tData.hunCard);
            if(this.eatCardArray && this.eatCardArray.length > 0)
                nodeArr.push(eat.btn_chi._node);
        }

        //如果，有杠，碰，吃。 这出现过的UI. 否则玩家状态为等待
        if(nodeArr.length > 0){
            if(!player.mustHu)
                nodeArr.push(eat.btn_guo._node);
        }else{
            player.mjState = TableState.waitCard;
        }
    }
    this.reloadBtnTexture(nodeArr);
    return nodeArr;
};

/**
 * 刷新杠分
 */
majiang_panel_taoJiang.prototype.updateGangScore = function(node, data){
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

//Override
majiang_panel_taoJiang.prototype.isShowTextPiao = function(){
    return false;
};

majiang_panel_taoJiang.prototype.isArrowVisible = function(){
    var bRtn = false;

    var pl = MjClient.playui.getPlayerInfoByName("node_down");
    if (!pl) return bRtn;
    bRtn = (TableState.waitPut == pl.mjState || TableState.waitEat == pl.mjState 
        || TableState.waitCard == pl.mjState || TableState.roundFinish == pl.mjState 
        || TableState.waitSelect == pl.mjState);

    return bRtn;
};

/**
 * Override
 *  添加癞子标识
 **/
majiang_panel_taoJiang.prototype.addLaiZiIcon2D = function(cardNode){
    if(!this.isCanAddLaiZiIcon(cardNode)) return;

    var playerNodeName = cardNode.getParent().getName();
    var offIndex = this.getNodeIndexDefaultByName(playerNodeName);
    offIndex = offIndex == -1 ? 0 : offIndex;
    var laiZiPosArr = this.getHunIconPosition2D();
    var laiZiNode = this.getLaiZiIcon2D(cardNode);
    laiZiNode.setPosition(cc.pAdd(cc.p(laiZiPosArr[offIndex][0], laiZiPosArr[offIndex][1]),  this.getLaiZiIcon2DPosOffset(offIndex, cardNode)));
    laiZiNode.setRotation(-90 * offIndex);
    cardNode.addChild(laiZiNode);
};

//获取手牌王标签的偏移量
majiang_panel_taoJiang.prototype.getLaiZiIcon2DPosOffset = function(offIndex,cardNode){
    var mjBgType = this.getMaJiangBgType();
    var cardTypeName = cardNode.getName();
    if(cardTypeName == this.HandleCardType.Hand){
        if(mjBgType == 0)
            return cc.p(2, -33);
        else if(mjBgType == 1)
            return cc.p(3, -33);
        else if(mjBgType == 2)
            return cc.p(0, -27);
        else if(mjBgType == 3)
            return cc.p(5, -23);
    }
   
    return cc.p(0, 0);
}

/**
 * Override
 *  添加癞子标识
 **/
majiang_panel_taoJiang.prototype.addLaiZiIcon3D = function(cardNode){
    if(!this.isCanAddLaiZiIcon(cardNode)) return;

    var offIndex = this.getNodeIndexDefaultByName(cardNode.getParent().getName());
    offIndex = offIndex == -1 ? 0 : offIndex;
    var laiZiPosArr = this.getCardFacePositon3D();
    var laiZiNode = this.getLaiZiIcon2D(cardNode);
    var pos_x = laiZiPosArr[offIndex][0] * cardNode.width;
    var pos_y = laiZiPosArr[offIndex][1] * cardNode.height;
    laiZiNode.setPosition(pos_x, pos_y);
    laiZiNode.setRotation(-90 * offIndex);
    cardNode.addChild(laiZiNode);
};

//Override 是否能添加癞子标识
majiang_panel_taoJiang.prototype.isCanAddLaiZiIcon = function(cardNode){
    var tData = MjClient.data.sData.tData;
    var parentNodeName = cardNode.getParent().getName();
    if(parentNodeName == "node_hunPai" || parentNodeName == "img_kaiGang")//混牌中“地”和“王”需要添加相应标签
        return true;
    else if(!MjClient.majiang.isHunCard || !MjClient.majiang.isHunCard(cardNode.tag, tData.hunCard))
        return false;
    return true;
};

//Override
majiang_panel_taoJiang.prototype.getLaiZiIcon2D = function(cardNode){
    var laiZiNode = new ccui.ImageView();
    laiZiNode.setName("laiZi");
    var tData = MjClient.data.sData.tData;
    var parentNodeName;
    if(cardNode.getParent() && cc.sys.isObjectValid(cardNode.getParent()))
        parentNodeName = cardNode.getParent().getName();
    if(parentNodeName == "node_hunPai" && cardNode.tag == tData.showCard){//"地"
        laiZiNode.loadTexture("playing/MJ/dingWang.png");
    }else if(MjClient.majiang.isHunCard && MjClient.majiang.isHunCard(cardNode.tag, MjClient.data.sData.tData.hunCard))
        laiZiNode.loadTexture("playing/MJ/wangzi.png");
    return laiZiNode;
};

//处理吃牌
majiang_panel_taoJiang.prototype.handleChi = function(pos, extendNode){
    var tData = MjClient.data.sData.tData;
    var haveWangOfChi = function(){
        var hunCard = tData.hunCard;
        var pos1 = 0, pos2 = 0;
        if(pos == 0){
            pos1 = 2;
            pos2 = 1;
        }else if(pos == 1){
            pos1 = 1;
            pos2 = -1;
        }else{
            pos1 = -1;
            pos2 = -2;
        } 
        return MjClient.majiang.isHunCard(tData.lastPutCard + pos1, hunCard) || MjClient.majiang.isHunCard(tData.lastPutCard + pos2, hunCard);
    };

    var sendChiOp = function(){
        MjClient.playui.sendChiToServer(pos);
        MjClient.playui.hideEatNodeChildren();
        if(extendNode && cc.sys.isObjectValid(extendNode)) extendNode.visible = false;
    }

    if(haveWangOfChi())
        MjClient.showMsg("你确认要用王牌吃?", sendChiOp, function(){}, "1");
    else
        sendChiOp();
};

//处理碰牌
majiang_panel_taoJiang.prototype.handlePeng = function(pos){
    var tData = MjClient.data.sData.tData;
    
    var sendPengOp = function(){
        MjClient.playui.sendPengToServer();
        MjClient.playui.hideEatNodeChildren();
    }

    if(MjClient.majiang.isHunCard(tData.lastPutCard, MjClient.data.sData.tData.hunCard))
        MjClient.showMsg("你确认要碰王牌?", sendPengOp, function(){}, "1");
    else
        sendPengOp();
};


//处理刚牌
majiang_panel_taoJiang.prototype.handleGang = function(card, extendNode){
    var tData = MjClient.data.sData.tData;
    
    var sendGangOp = function(){
        MjClient.playui.sendGangToServer(MjClient.playui.gangCardArray[0]);
        MjClient.playui.hideEatNodeChildren();
        if(extendNode && cc.sys.isObjectValid(extendNode)) extendNode.visible = false;
    }

    if(MjClient.majiang.isHunCard(card, tData.hunCard))
        MjClient.showMsg("你确认要杠王牌?", sendGangOp, function(){}, "1");
    else
        sendGangOp();
};

/**
 *  began事件时的验证
 **/
majiang_panel_taoJiang.prototype.checkWhenTouchBegan = function(cardNode){
    if(MjClient.movingCard !== null && MjClient.movingCard != cardNode){
        return true;
    } 
    var handCount = this.getCardNodeCountByName(cardNode.getParent(), this.HandleCardType.Hand);
    if(!(handCount % 3 == 2 && this.isTurnMe() || handCount % 3 == 1 && !this.isTurnMe())){
        return true;
    }
    // 自动摸打
    var player = MjClient.playui.getPlayerInfoByName("node_down");
    var tData = MjClient.data.sData.tData;

    //听牌
    if(player.isTing && tData.gangAddCard && tData.gangAddCard.length != 0)
        return;
    
    if(tData.canBaotingNum != 0) return true;

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

    if (MjClient.playui.clickTing && !MjClient.canTingCards[cardNode.tag] && this.isTurnMe())
        return true;

    return false;
};

/**
 *  end事件的处理
 **/
majiang_panel_taoJiang.prototype.handlerWhenCardTouchEnded = function(cardNode, cardTag){
    var self = this;
    var player = this.getPlayerInfoByName("node_down");
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    if(player.eatFlag & 8){
        var roomMsgValue = tData.tableid +":"+tData.roundNum;
        var saveRoomMsgValueH = util.localStorageEncrypt.getStringItem("IGNORE_H_TIP","");
        if(saveRoomMsgValueH.length > 0 && saveRoomMsgValueH == roomMsgValue){
            MjClient.playui.sendPassToServer();
            this.putOutCard(cardNode, cardTag);
            return;
        }

        var guoHuHasBeenShow = util.localStorageEncrypt.getBoolItem(MjClient.guoHuHasBeenShown, false);
        if(guoHuHasBeenShow){
            MjClient.playui.sendPassToServer();
            this.putOutCard(cardNode, cardTag);
            util.localStorageEncrypt.setBoolItem(MjClient.guoHuHasBeenShown, false);
        }else{
            MjClient.showMsg("确认不胡吗?", function(result) {
                if(result && result.isSelect){
                    //选择了不在提示,
                    if(MjClient.playui.isCanGang())
                        util.localStorageEncrypt.setStringItem("IGNORE_G_TIP",roomMsgValue);

                    if(player.eatFlag & 8)
                        util.localStorageEncrypt.setStringItem("IGNORE_H_TIP",roomMsgValue);
                };
                self.sendPassToServer();
                self.putOutCard(cardNode, cardTag);
                util.localStorageEncrypt.setBoolItem(MjClient.guoHuHasBeenShown, false);
            }, function() {
                MjClient.movingCard = null;
                self.resetCardLayout(self.getNodeByName("node_down"));
            }, "3");
        }
    }else if(MjClient.majiang.isHunCard(cardTag, MjClient.data.sData.tData.hunCard)){
        MjClient.showMsg("你确认要出王牌?", function() {
            self.putOutCard(cardNode, cardTag);
        }, function() {
            MjClient.movingCard = null;
            self.resetCardLayout(self.getNodeByName("node_down"));
        }, "1");
    }else
        this.putOutCard(cardNode, cardTag);
};

/**
 *  获得牌面的坐标(提出来方便重写)
 *  mjBgType: 麻将牌背类型
 *  return {Array}
 **/
majiang_panel_taoJiang.prototype.getCardFacePositon2D = function(mjBgType, cardNode){
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
        case "img_baida":
        case "img_baida_diwang":
        case "img_kaiGangCard1":
        case "img_kaiGangCard2":
        case "img_kaiGangCard3":
            offSets = this.getPutCardFacePosition2D(mjBgType);
            break;
    }
    return offSets;
};


//Override 更新听牌
majiang_panel_taoJiang.prototype.setTingCardSprite = function(cardNode, cardTag){
    var cardImg = this.getCardFaceImg2D(cardTag);
    cardImg.setContentSize(cardNode.getContentSize());
    var imgScale = cardNode.width / cardImg.width;
    cardImg.setScale(imgScale - 0.1);
    cardImg.setPosition(cardNode.width / 2, cardNode.height / 2);
    cardImg.tag = cardTag;
    cardNode.removeChildByName("cardImg");
    cardNode.addChild(cardImg);
    var tData = MjClient.data.sData.tData;
    if(MjClient.majiang.isHunCard && MjClient.majiang.isHunCard(cardTag, tData.hunCard)){
        var laiZiNode = this.getLaiZiIcon2D(cardImg);
        var laiZiScale = cardNode.width / laiZiNode.width;
        laiZiNode.setScale(laiZiScale);
        laiZiNode.setAnchorPoint(1, 1);
        laiZiNode.setPosition(cardNode.width, cardNode.height);
        cardNode.addChild(laiZiNode);
    }
};

//Override
majiang_panel_taoJiang.prototype.createGameOverPanel = function(){
    return new majiang_gameOver_taoJiang();
};

//获取听牌按钮
majiang_panel_taoJiang.prototype.getTingBtns = function(){
    this.useBtnGuoReplcaeNoTing = false;
    var eatNodes = this.getPlayerEatNode();
    var eat = MjClient.playui.jsBind.node_eat;
    if(eatNodes.length == 0){
        if (!this.isArrowVisible()) return eatNodes;
        var pl = this.getPlayerInfoByName("node_down");
        if(pl.tingStatus == 2){
            this.useBtnGuoReplcaeNoTing = true;
            eatNodes.push(eat.btn_ting._node);
            eatNodes.push(eat.btn_guo._node);
        }
        
    }else
        eatNodes.length = 0;
    return eatNodes;
};

//设置麻将听牌按钮
majiang_panel_taoJiang.prototype.updatePlayerTingBtn = function(){
    var eatNodeArr = this.getTingBtns();
    if(eatNodeArr.length == 0) return;
    this.hideEatNodeChildren();
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

/**
 * 点击听按钮的时候调用
 */
majiang_panel_taoJiang.prototype.clickTingBtn = function(isTing){
    this.clickTing = cc.isUndefined(isTing) ? false : isTing;
    MjClient.playui.hideEatNodeChildren();
    this.sendTingToServer(this.clickTing);
    MjClient.playui.updateCardColorAfterTing();
};

/**
 *	发送听的命令
 **/
majiang_panel_taoJiang.prototype.sendTingToServer = function (isTing){
    if (MjClient.rePlayVideo != -1) return;
    var uid = this.getSelfUid();
    var sendMsg = {
    	cmd: "MJBaoTing",
    	pl: uid,
    	isting: isTing
    };
    MjClient.gamenet.request("pkroom.handler.tableMsg", sendMsg);
};

//更新玩家听牌标志
majiang_panel_taoJiang.prototype.updateTingIcon = function (nodeName, node, eD){
    var player = this.getPlayerInfoByName(nodeName);
    if(player){
        if(player.info.uid != eD.uid || eD.tingStatus!=1) return;
        node.visible = true;
    }
};

//展示杠开的牌
majiang_panel_taoJiang.prototype.showKaiGangBigCards = function(kaiGangKuang, addnewcard) {
    var tData = MjClient.data.sData.tData;

    var cardNode1 = kaiGangKuang.getChildByName("img_kaiGangCard1");
    var cardNode2 = kaiGangKuang.getChildByName("img_kaiGangCard2");
    var cardNode3 = kaiGangKuang.getChildByName("img_kaiGangCard3");
    kaiGangKuang.setVisible(true);
    cardNode1.setVisible(true);
    cardNode2.setVisible(true);
    cardNode3.setVisible(true);

    if (addnewcard[0]){
        cardNode1.tag = addnewcard[0];
        this.setCardSprite(cardNode1,  addnewcard[0], true);
    }
       
    if (addnewcard[1]){
        cardNode2.tag = addnewcard[1];
        this.setCardSprite(cardNode2,  addnewcard[1], true);
    }
        
    if (addnewcard[2]){
        cardNode3.tag = addnewcard[2];
        this.setCardSprite(cardNode3,  addnewcard[2], true);
    }
       

    //杠开的牌可能是一张可能是两张也可能是三张
    if(addnewcard.length == 1){
        cardNode1.x = cardNode3.x - cardNode3.width;
        cardNode2.setVisible(false);
        cardNode3.setVisible(false);
    }

    if(addnewcard.length == 2){
        cardNode1.x = cardNode3.x - cardNode3.width * 1.5;
        cardNode2.x = cardNode3.x - cardNode3.width * 0.5;
        cardNode3.setVisible(false);
    }

    if(addnewcard.length == 3){
        cardNode1.x = cardNode3.x - cardNode3.width * 2;
        cardNode2.x = cardNode3.x - cardNode3.width;
    }
    this.updatePlayerEatBtn();
};

//处理开杠
majiang_panel_taoJiang.prototype.handlePutCardAfterGang = function(kaiGangKuang, eD) {
    var cardNode1 = kaiGangKuang.getChildByName("img_kaiGangCard1");
    var cardNode2 = kaiGangKuang.getChildByName("img_kaiGangCard2");
    var cardNode3 = kaiGangKuang.getChildByName("img_kaiGangCard3");
    var pl = this.getPlayerInfoByName("node_down");
    var off = this.getOffIndexWithSelf(eD.uid);
    var node = this.getUIBind(off);
    var msg = {
            card: eD.card,
            uid: eD.uid,
            isAfterGang: eD.afterGang,
        };

    if(eD.cardIndex == 0){
        cardNode1.visible = false;
    }else if(eD.cardIndex == 1){
        cardNode2.visible = false;
    }else if(eD.cardIndex == 2){
        cardNode3.visible = false;
    }

    this.dealPut(node, msg);
    if (eD.uid == this.getSelfUid())
        MjClient.playui.updateTingTips();

    if(cardNode1.visible == cardNode2.visible && cardNode2.visible == cardNode3.visible && cardNode3.visible == false){
        kaiGangKuang.visible = false;
        MjClient.playui.updatePlayerEatBtn();
    }
};

//Override 是否显示听牌灯泡标识
majiang_panel_taoJiang.prototype.isShowTingLight = function(){
    return false;
};

//处理报听动画
majiang_panel_taoJiang.prototype.handleBaoTingAnim = function(nodeName, node, data){
    var player = MjClient.playui.getPlayerInfoByName(nodeName);
    if(!player || player.info.uid !== data.uid || data.tingStatus != 1)
        return;
    this.showEatActionAnim(node.getParent(), this.AnimationType.TING);
};

// Override创建翻鸟view
majiang_panel_taoJiang.prototype.getShowBirdView = function(niaoCards){
    var self = this;
    return new majiang_showBird(niaoCards,function(){
        self.showBalanceLayer();
    }, niaoCards.length > 1 ? majiang_showBird.prototype.SHOW_BIRD_TYPE.MOVE_FROM_RIGHT 
        : majiang_showBird.prototype.SHOW_BIRD_TYPE.FLIP, niaoCards.length > 1 ? {itemSpace: 85} : undefined);
}