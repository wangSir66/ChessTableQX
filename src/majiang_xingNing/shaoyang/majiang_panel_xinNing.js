//新版新宁麻将
var majiang_panel_xinNing = majiang_panel_shaoyang.extend({
    jsonFile:"Play_MaJiangXinNing.json",
    ctor: function(){
        this._super(majiang_panel_xinNing,this.jsonFile);
    },

    getJsBind: function(){
        var jsBind = {
            layout_roundInfo2D:{
                img_roundNum:{
                    _layout: [[0.1, 0.1], [0.5, 0.5], [-1.4, 1.0]],
                },
                img_cardNum:{
                    _layout: [[0.1, 0.1], [0.5, 0.5], [1.4, 1.0]],
                }
            },
            node_down:{
                layout_head:{
                    img_zhuang:{
                        _event:{
                            waitJiazhu:function(eD){
                                this.visible = MjClient.playui.getZhuangStatus("node_down");
                            }
                        }
                    },
                    img_chuiZi:{
                        _visible:false,
                        _event:{
                            MJJiazhu:function(ed){
                                var pl = MjClient.playui.getPlayerInfoByName("node_down");
                                if(!pl || pl.info.uid != ed.uid) return;
                                this.visible = ed.jiachuiNum === 1; 
                            },
                            // 连锤 检测是否已经加锤
                            checkJiaChui:function(){
                                var pl = MjClient.playui.getPlayerInfoByName("node_down");
                                if(!pl || pl.jiachuiNum == -1) return;   
                                this.visible = pl.jiachuiNum === 1; 
                            },
                            initSceneData:function(){
                                var pl = MjClient.playui.getPlayerInfoByName("node_down");
                                if(!pl) return;
                                var isShow = true;
                                if(TableState.waitJiazhu == pl.mjState || TableState.roundFinish == pl.mjState)
                                    isShow = false;
                                 // 重连检验
                                this.visible = pl.jiachuiNum == 1 && isShow;
                            },
                            mjhand:function(){
                                var pl = MjClient.playui.getPlayerInfoByName("node_down");
                                if(!pl) return; 
                                this.visible = pl.jiachuiNum === 1;                            
                            },
                            clearCardUI:function(){
                                this.visible = false; 
                            }
                        }
                    },
                    img_jiaChuiTip:{
                        _visible:false,
                        _event:{
                            MJJiazhu:function(ed){
                                var pl = MjClient.playui.getPlayerInfoByName("node_down");
                                if(!pl || pl.info.uid != ed.uid) return;
                                this.visible = true;
                                MjClient.playui.loadJiaChuiTip(this,ed);
                               
                            },
                            // 连锤 检测是否已经加锤
                            checkJiaChui:function(){
                                var pl = MjClient.playui.getPlayerInfoByName("node_down");
                                if(!pl || pl.jiachuiNum == -1) return;
                                MjClient.playui.loadJiaChuiTip(this,pl);
                            },
                            initSceneData:function(){
                                var pl = MjClient.playui.getPlayerInfoByName("node_down");
                                if(!pl) return; 
                                this.visible = false
                                var tData = MjClient.data.sData.tData; 
                                if(pl.jiachuiNum != -1 && (pl.mjState == TableState.waitJiazhu || pl.mjState ==TableState.isReady) 
                                    && tData.areaSelectMode.isJiaChui ){
                                    this.visible = true;
                                }
                                MjClient.playui.loadJiaChuiTip(this,pl);
                            },
                            mjhand:function(){  
                                this.visible = false;                            
                            }, 
                            clearCardUI:function(){
                                this.visible = false; 
                            }
                        }
                    },
                    img_skipHuIcon:{
                        _visible:false,
                        _event: {
                            clearCardUI: function(eD) {
                                this.visible = false;
                            },
                            MJHu: function(eD) {
                                this.visible = false;
                            },
                            newCard:function(eD){
                                var pl = MjClient.playui.getPlayerInfoByName("node_down");
                                if(!pl.isQiHu){
                                    this.visible = !!pl.skipHu;
                                }
                            },
                            MJPass:function(eD){
                                var pl = MjClient.playui.getPlayerInfoByName("node_down");
                                if(pl.skipHu)
                                    this.visible = true;
                            }
                        }
                    },
                    img_skipPengIcon:{
                        _visible:false,
                        _event: {
                            clearCardUI: function(eD) {
                                this.visible = false;
                            },
                            MJpeng: function(eD) {
                                this.visible = false;
                            },
                            newCard:function(eD){
                                this.visible = false;
                            },
                            MJPass:function(eD){
                                var pl = MjClient.playui.getPlayerInfoByName("node_down");
                                if(pl.skipPeng)
                                    this.visible = (pl.skipPeng.length > 0);
                            }
                        }
                    },
                    node_gangScore:{
                        _visible:false,
                    }
                }
            },
            node_right:{
                layout_head:{
                    img_zhuang:{
                        _event:{
                            waitJiazhu:function(eD){
                                this.visible = MjClient.playui.getZhuangStatus("node_right");
                            }
                        }
                    },
                    img_chuiZi:{
                        _visible:false,
                        _event:{
                            MJJiazhu:function(ed){
                                var pl = MjClient.playui.getPlayerInfoByName("node_right");
                                if(!pl || pl.info.uid != ed.uid) return;
                                this.visible = ed.jiachuiNum === 1; 
                            },
                            // 连锤 检测是否已经加锤
                            checkJiaChui:function(){
                                var pl = MjClient.playui.getPlayerInfoByName("node_right");
                                if(!pl || pl.jiachuiNum == -1) return;   
                                this.visible = pl.jiachuiNum === 1; 
                            },
                            initSceneData:function(){
                                var pl = MjClient.playui.getPlayerInfoByName("node_right");
                                if(!pl) return;
                                var isShow = true;
                                if(TableState.waitJiazhu == pl.mjState || TableState.roundFinish == pl.mjState)
                                    isShow = false;
                                 // 重连检验
                                this.visible = pl.jiachuiNum == 1 && isShow;
                            },
                            mjhand:function(){
                                var pl = MjClient.playui.getPlayerInfoByName("node_right");
                                if(!pl) return; 
                                this.visible = pl.jiachuiNum === 1;                            
                            },
                            clearCardUI:function(){
                                this.visible = false; 
                            }
                        }
                    },
                    img_jiaChuiTip:{
                        _visible:false,
                        _event:{
                            MJJiazhu:function(ed){
                                var pl = MjClient.playui.getPlayerInfoByName("node_right");
                                if(!pl || pl.info.uid != ed.uid) return;
                                this.visible = true;
                                MjClient.playui.loadJiaChuiTip(this,ed);
                               
                            },
                            // 连锤 检测是否已经加锤
                            checkJiaChui:function(){
                                var pl = MjClient.playui.getPlayerInfoByName("node_right");
                                if(!pl || pl.jiachuiNum == -1) return;
                                MjClient.playui.loadJiaChuiTip(this,pl);
                            },
                            initSceneData:function(){
                                var pl = MjClient.playui.getPlayerInfoByName("node_right");
                                if(!pl) return; 
                                this.visible = false
                                var tData = MjClient.data.sData.tData; 
                                if(pl.jiachuiNum != -1 && (pl.mjState == TableState.waitJiazhu || pl.mjState ==TableState.isReady) 
                                    && tData.areaSelectMode.isJiaChui ){
                                    this.visible = true;
                                }
                                MjClient.playui.loadJiaChuiTip(this,pl);
                            },
                            mjhand:function(){  
                                this.visible = false;                            
                            },  
                            clearCardUI:function(){
                                this.visible = false; 
                            }
                        }
                    },
                    node_gangScore:{
                        _visible:false,
                    }
                }
            },
            node_top:{
                layout_head:{
                    img_zhuang:{
                        _event:{
                            waitJiazhu:function(eD){
                                this.visible = MjClient.playui.getZhuangStatus("node_top");
                            }
                        }
                    },
                    img_chuiZi:{
                        _visible:false,
                        _run:function(){
                            if(MjClient.playui.getMaxPlayer() % 2 == 0){
                                this.setPosition(cc.p(-25,90));
                            }
                        },
                        _event:{
                            MJJiazhu:function(ed){
                                var pl = MjClient.playui.getPlayerInfoByName("node_top");
                                if(!pl || pl.info.uid != ed.uid) return;
                                this.visible = ed.jiachuiNum === 1; 
                            },
                            // 连锤 检测是否已经加锤
                            checkJiaChui:function(){
                                var pl = MjClient.playui.getPlayerInfoByName("node_top");
                                if(!pl || pl.jiachuiNum == -1) return;   
                                this.visible = pl.jiachuiNum === 1; 
                            },
                            initSceneData:function(){
                                var pl = MjClient.playui.getPlayerInfoByName("node_top");
                                if(!pl) return;
                                var isShow = true;
                                if(TableState.waitJiazhu == pl.mjState || TableState.roundFinish == pl.mjState)
                                    isShow = false;
                                 // 重连检验
                                this.visible = pl.jiachuiNum == 1 && isShow;
                            },
                            mjhand:function(){
                                var pl = MjClient.playui.getPlayerInfoByName("node_top");
                                if(!pl) return; 
                                this.visible = pl.jiachuiNum === 1;                            
                            },
                            clearCardUI:function(){
                                this.visible = false; 
                            }
                        }
                    },
                    img_jiaChuiTip:{
                        _visible:false,
                        _event:{
                            MJJiazhu:function(ed){
                                var pl = MjClient.playui.getPlayerInfoByName("node_top");
                                if(!pl || pl.info.uid != ed.uid) return;
                                this.visible = true;
                                MjClient.playui.loadJiaChuiTip(this,ed);
                               
                            },
                            // 连锤 检测是否已经加锤
                            checkJiaChui:function(){
                                var pl = MjClient.playui.getPlayerInfoByName("node_top");
                                if(!pl || pl.jiachuiNum == -1) return;
                                MjClient.playui.loadJiaChuiTip(this,pl);
                            },
                            initSceneData:function(){
                                var pl = MjClient.playui.getPlayerInfoByName("node_top");
                                if(!pl) return; 
                                this.visible = false
                                var tData = MjClient.data.sData.tData; 
                                if(pl.jiachuiNum != -1 && (pl.mjState == TableState.waitJiazhu || pl.mjState ==TableState.isReady) 
                                    && tData.areaSelectMode.isJiaChui ){
                                    this.visible = true;
                                }
                                MjClient.playui.loadJiaChuiTip(this,pl);
                            },
                            mjhand:function(){  
                                this.visible = false;                            
                            },  
                            clearCardUI:function(){
                                this.visible = false; 
                            }
                        }
                    },
                    node_gangScore:{
                        _visible:false,
                    }
                }
            },
            node_left:{
                layout_head:{
                    img_zhuang:{
                        _event:{
                            waitJiazhu:function(eD){
                                this.visible = MjClient.playui.getZhuangStatus("node_left");
                            }
                        }
                    },
                    img_chuiZi:{
                        _visible:false,
                        _event:{
                            MJJiazhu:function(ed){
                                var pl = MjClient.playui.getPlayerInfoByName("node_left");
                                if(!pl || pl.info.uid != ed.uid) return;
                                this.visible = ed.jiachuiNum === 1; 
                            },
                            // 连锤 检测是否已经加锤
                            checkJiaChui:function(){
                                var pl = MjClient.playui.getPlayerInfoByName("node_left");
                                if(!pl || pl.jiachuiNum == -1) return;   
                                this.visible = pl.jiachuiNum === 1; 
                            },
                            initSceneData:function(){
                                var pl = MjClient.playui.getPlayerInfoByName("node_left");
                                if(!pl) return;
                                var isShow = true;
                                if(TableState.waitJiazhu == pl.mjState || TableState.roundFinish == pl.mjState)
                                    isShow = false;
                                 // 重连检验
                                this.visible = pl.jiachuiNum == 1 && isShow;
                            },
                            mjhand:function(){
                                var pl = MjClient.playui.getPlayerInfoByName("node_left");
                                if(!pl) return; 
                                this.visible = pl.jiachuiNum === 1;                            
                            },
                            clearCardUI:function(){
                                this.visible = false; 
                            }
                        }
                    },
                    img_jiaChuiTip:{
                        _visible:false,
                        _event:{
                            MJJiazhu:function(ed){
                                var pl = MjClient.playui.getPlayerInfoByName("node_left");
                                if(!pl || pl.info.uid != ed.uid) return;
                                this.visible = true;
                                MjClient.playui.loadJiaChuiTip(this,ed);
                               
                            },
                            // 连锤 检测是否已经加锤
                            checkJiaChui:function(){
                                var pl = MjClient.playui.getPlayerInfoByName("node_left");
                                if(!pl || pl.jiachuiNum == -1) return;
                                MjClient.playui.loadJiaChuiTip(this,pl);
                            },
                            initSceneData:function(){
                                var pl = MjClient.playui.getPlayerInfoByName("node_left");
                                if(!pl) return; 
                                this.visible = false
                                var tData = MjClient.data.sData.tData; 
                                if(pl.jiachuiNum != -1 && (pl.mjState == TableState.waitJiazhu || pl.mjState ==TableState.isReady) 
                                    && tData.areaSelectMode.isJiaChui ){
                                    this.visible = true;
                                }
                                MjClient.playui.loadJiaChuiTip(this,pl);
                            },
                            mjhand:function(){  
                                this.visible = false;                            
                            },  
                            clearCardUI:function(){
                                this.visible = false; 
                            }
                        }
                    },
                    node_gangScore:{
                        _visible:false,
                    }
                }
            },
            node_jiaChui:{
                _run:function(){
                    this.visible = false;
                    this.setPosition(cc.p(MjClient.size.width *0.55, -MjClient.size.height *0.15));  
                },
                btn_buJia:{
                    _layout: [[0.12, 0.12], [-0.16, 0.5], [0, 0]],
                    _click:function(sender){
                        MjClient.playui.handleJiaChui(sender, 0);
                    }
                },
                btn_jia:{
                    _layout: [[0.12, 0.12], [0.05, 0.5], [0, 0]],
                    _click:function(sender){
                        MjClient.playui.handleJiaChui(sender, 1);
                    }
                },
                closeView: function(){
                    this.visible = false;
                },
                _event:{
                    waitJiazhu:function(ed){     
                        var pl = MjClient.playui.getPlayerInfoByName("node_down");
                        if(!pl) return;
                        var tData = MjClient.data.sData.tData;
                        this.visible = (pl.mjState == TableState.waitJiazhu && tData.tState == TableState.waitJiazhu && pl.jiachuiNum == -1);
                        if(tData.areaSelectMode.isLianChui)
                            postEvent("checkJiaChui");
                    },
                    initSceneData : function(){ 
                        var pl = MjClient.playui.getPlayerInfoByName("node_down");
                        if(!pl) return;
                        var tData = MjClient.data.sData.tData;
                        this.visible = (pl.mjState == TableState.waitJiazhu && tData.tState == TableState.waitJiazhu && pl.jiachuiNum == -1); 
                    },
                    mjhand:function(){
                        this.visible = false;
                    }
                }
            },
            node_touzi:{
                _run:function(){
                    this.visible = false;
                    this.setScale(0.5);
                    this.setPosition(cc.p(MjClient.size.width *0.5, MjClient.size.height *0.4));  
                    cc.spriteFrameCache.addSpriteFrames("playing/other/shaizi.plist","playing/other/shaizi.png");
                },
                _event:{
                    MJZhiTouZi:function(data){
                        var touzi1 = this.getChildByName("img_touZi_1");
                        var touzi2 = this.getChildByName("img_touZi_2");
                        touzi2.setScale(this.getScale());
                        var touzi3 = this.getChildByName("img_touZi_3");
                        touzi3.setScale(this.getScale());
                        this.visible = true;
                        touzi1.visible = false;
                        touzi2.visible = false;
                        touzi3.visible = false;
    
                        var arry = [];
                        for(var i = 1; i < 10; i++){
                            var frame = cc.spriteFrameCache.getSpriteFrame("shaizi_" + i + ".png");
                            if(frame){
                                arry.push(frame);
                            }
                        }
                        var firstFrame = new cc.Sprite();
                        firstFrame.initWithSpriteFrame(arry[0]);
                        firstFrame.setPosition(touzi1.getPosition());
                        firstFrame.setScale(this.getScale());
                        this.addChild(firstFrame);
                        var animate = cc.animate(new cc.Animation(arry, 0.05, 3));
                        var callFunc = cc.callFunc(function(){
                            var randomArr = data.randomArr;
                            touzi2.loadTexture("playing/other/shaizi/" + randomArr[0] + ".png");
                            touzi3.loadTexture("playing/other/shaizi/" + randomArr[1] + ".png");
                            touzi2.setVisible(true);
                            touzi3.setVisible(true);
                            firstFrame.setVisible(false);
                        });
                        var delayAction = cc.delayTime(0.5);
                        var callFunc1 = cc.callFunc(function(){
                            touzi2.setVisible(false);
                            touzi3.setVisible(false);                       
                        });
                        firstFrame.runAction(cc.sequence(animate,callFunc,delayAction,callFunc1,cc.removeSelf()));
                        // MjClient.playui.resetCardLayout();
                        MjClient.playui.updateCardColorAfterTing();
                    }
                }
            },
            node_eat:{
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
                    checkChi: function(){
                        var tData = MjClient.data.sData.tData;
                        var pl = MjClient.playui.getPlayerInfoByName("node_down");
                        if(pl.mustHu){
                            MjClient.showToast("有胡必胡");
                            return true;
                        }
                        return false;
                    },
                    handleChi: function(){
                        if(MjClient.playui.eatCardArray.length > 1){
                            var showCardsNode = MjClient.playui.jsBind.node_eat.node_showCards._node;
                            showCardsNode.getChildByName("img_showCardsBg").showEatCards();
                            return;
                        }
                        MjClient.playui.sendChiToServer(MjClient.playui.eatCardArray[0]);
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
                        if(pl.isZiMoHu && !pl.isCanGang){
                            MjClient.showToast("有胡必胡");
                            return true;
                        }

                        if(pl.mustHu && !pl.isCanGang){
                            MjClient.showToast("有胡必胡");
                            return true;
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
                btn_touzi:{
                    _visible:false,
                    _click:function(sender){
                        MjClient.playui.hideEatNodeChildren();
                        MjClient.playui.sendZhiTouZiToServer();
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
        };
        return jsBind;
    },

    //Override
    putOutCard: function (cardNode, cardTag, autoput){
        this._super(cardNode, cardTag, autoput);
        var player = MjClient.playui.getPlayerInfoByName("node_down");
        if(!player.isQiHu){
            var skipHuIcon = ccui.helper.seekWidgetByName(MjClient.playui.getNodeByName("node_down"), "img_skipHuIcon");
            if(skipHuIcon && cc.sys.isObjectValid(skipHuIcon) && skipHuIcon.isVisible()) 
                skipHuIcon.visible = false;
            var skipPengIcon = ccui.helper.seekWidgetByName(MjClient.playui.getNodeByName("node_down"), "img_skipPengIcon");
            if(skipPengIcon && cc.sys.isObjectValid(skipPengIcon) && skipPengIcon.isVisible()) 
             skipPengIcon.visible = false;
        }
    },

    //Override
    handleRoundEnd:function(){
        var sData = MjClient.data.sData;
        var tData = sData.tData;
        tData.mopai = tData.mopai || [];
        var plUids = tData.uids;

        for(var uid in plUids){
            var player = sData.players[String(plUids[uid])];
            if(player && player.mopai && player.mopai.length > 0){
                tData.mopai = player.mopai;
                break;
            }
        }
        this._super();
    }
});

//Override
majiang_panel_xinNing.prototype.clickPass = function(){
    if(this.checkWhenPass())
        return;

    var self = this;
    var tData =  MjClient.data.sData.tData;
    var pl = MjClient.playui.getPlayerInfoByName("node_down");
    var roomMsgValue = tData.tableid +":"+tData.roundNum;
    var saveRoomMsgValueG = util.localStorageEncrypt.getStringItem("IGNORE_G_TIP","");
    if(this.isTurnMe() && tData.tState == TableState.waitPut){
        var canGang = self.checkGangBtn(pl);
        var passCallback = function(isRemerber){
            if(canGang) self.clickGangPass = true;
            if(canGang && isRemerber)
                util.localStorageEncrypt.setStringItem("IGNORE_G_TIP",roomMsgValue);
            self.showPassHuTips();
            self.hideEatNodeChildren();
            MjClient.playui.sendPassToServer();
        };

        var msg = "确认过";
        if(canGang && saveRoomMsgValueG != roomMsgValue)
            msg += " 杠 ";

        if(pl.eatFlag & 8)
            msg += " 胡 ";
        else if(canGang && saveRoomMsgValueG == roomMsgValue){//只有杠并且记住过杠，不在提示
            passCallback();
            return;
        }

        msg = msg + "吗?"
        MjClient.showMsg(msg, function(result){
            passCallback(result && result.isSelect);
        }, function() {}, "1");
    }else {
        if(pl.eatFlag & 8){
            MjClient.showMsg("确认不胡吗?", function(result) {
                MjClient.playui.sendPassToServer();
                self.showPassHuTips();
                self.hideEatNodeChildren();
            }, function() {}, "1");
        }else{
            MjClient.playui.sendPassToServer();
            self.hideEatNodeChildren();
        }
    }
};

//Override
majiang_panel_xinNing.prototype.isCanAutoPut = function(){
    return false;
};

//Override
majiang_panel_xinNing.prototype.checkWhenPass = function(){   
    return false;
};

//Override 2d视角下，混牌提示是否展示(左上角定混的牌)
majiang_panel_xinNing.prototype.isHunCardShow = function(){
    return false;
};

//Override
majiang_panel_xinNing.prototype.isShowTingLight = function(){
    return false;
};

/**
 * Override
 *  是否开启显示最多听牌标识
 **/
majiang_panel_xinNing.prototype.isShowMaxTingCards = function(){
    return true;
};

/**
 * Override
 *  获得玩家可操作按钮
 **/
majiang_panel_xinNing.prototype.getPlayerEatNode = function(){
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var player = sData.players[this.getSelfUid()];
    var eat = MjClient.playui.jsBind.node_eat;
    var nodeArr = [];
    this.gangCardArray = [];
    //自摸
    if(((tData.tState == TableState.waitPut && player.mjState == TableState.waitPut && this.isTurnMe()) || 
        (player.mjState == TableState.waitEat && player.touzi && this.getSelfUid() == tData.uids[tData.curPlayer]))){
        //胡
        if (player.isNew && player.eatFlag & 8) {
            nodeArr.push(eat.btn_hu._node);
        }

        //杠
        if(this.checkGangBtn(player) && !player.touzi){
            nodeArr.push(eat.btn_gang._node);
        }

        if(player.touzi){
            nodeArr.push(eat.btn_touzi._node);
        }

        if(nodeArr.length > 0)
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

        if(player.eatFlag & 1){
            nodeArr.push(eat.btn_chi._node);
            this.eatCardArray = MjClient.majiang.canChi(player.mjhand, tData.lastPutCard, tData.hunCard);
        }

        // if(player.eatFlag & 16){
        //     nodeArr.push(eat.btn_zhua._node);
        // }

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


/**
 * Override
 *  检查杠的按钮
 **/
majiang_panel_xinNing.prototype.checkGangBtn = function(player){
    var tData = MjClient.data.sData.tData;
    this.gangCardArray = MjClient.majiang.canGang1(player.mjpeng, player.mjhand, player.isTing, tData.hunCard, player.skipGang);
    if(this.gangCardArray.length > 0){
        return true;
    }
    return false;
};

//处理加锤
majiang_panel_xinNing.prototype.handleJiaChui = function(target, chuiNum){
    if(!target || !cc.sys.isObjectValid(target)) return;
    target.getParent().setVisible(false);
    var pl = MjClient.playui.getPlayerInfoByName("node_down");
    if(!pl) return;
    pl.jiachuiNum = chuiNum;
    this.sendJiaZhuToServer(chuiNum, this.getSelfUid());
};

/**
 * Override
 *	发送加注命令
 **/
majiang_panel_xinNing.prototype.sendJiaZhuToServer = function(zhuNum,uid){
    zhuNum = zhuNum || 0;
    var msg = {
        cmd: "MJJiazhu",
        uid: uid,
        jiachuiNum: zhuNum,
    };
    MjClient.gamenet.request("pkroom.handler.tableMsg", msg); 
};

//设置加锤提示的纹理
majiang_panel_xinNing.prototype.loadJiaChuiTip = function(target, eD){
    var texPath = eD.jiachuiNum == 1 ? "playing/other/jiachui_text_1.png" : "playing/other/jiachui_text_0.png";
    target.loadTexture(texPath);
};

//掷骰子消息
majiang_panel_xinNing.prototype.sendZhiTouZiToServer = function(){
    if (MjClient.rePlayVideo != -1) return; // 回放时候不能请求
    var tData = MjClient.data.sData.tData;
    MjClient.gamenet.request("pkroom.handler.tableMsg", {
        cmd: "MJZhiTouZi",
        card:tData.lastPutCard
    });
};

/** 
 * Override
 *  began事件时的验证 
 **/
majiang_panel_xinNing.prototype.checkWhenTouchBegan = function(cardNode){
    if(MjClient.movingCard !== null && MjClient.movingCard != cardNode){
        return true;
    } 
    var handCount = this.getCardNodeCountByName(cardNode.getParent(), this.HandleCardType.Hand);
    if(!(handCount % 3 == 2 && this.isTurnMe() || handCount % 3 == 1 && !this.isTurnMe())){
        return true;
    }

    // 自动摸打
    var player = MjClient.playui.getPlayerInfoByName("node_down");

    //听牌了已经
    if(player.isTing && cardNode != this.newCardNode) return true;

    if(player.mustHu)
        return MjClient.showToast("有胡必胡");

    if (MjClient.playui.clickTing && !MjClient.canTingCards[cardNode.tag])
        return true;

    if (player.tPutCard && this.isTurnMe()) {
        if (!MjClient.Scene.ToastNodeArray || MjClient.Scene.ToastNodeArray.length == 0) {
            MjClient.showToast("出牌请先取消自动摸打");
        }
        return true;
    }

    return false;
};

//Override
majiang_panel_xinNing.prototype.handlerWhenCardTouchEnded = function(cardNode, cardTag){
    var self = this;
    var player = MjClient.playui.getPlayerInfoByName("node_down");
    if(!player) return;
    if(player.eatFlag & 8){
        MjClient.showMsg("确认不胡吗?", function(){
            self.showPassHuTips();
            self.sendPassToServer();
            self.putOutCard(cardNode, cardTag);
        },function() {
            MjClient.movingCard = null;
            self.resetCardLayout(self.getNodeByName("node_down"));
        }, "1");
        return;
    }
    self.putOutCard(cardNode, cardTag);
};


//Override
// 写中鸟条件
majiang_panel_xinNing.prototype.getIsZhongBird = function(card){
    var sData = MjClient.data.sData;
    var tData = sData.tData;

    var result = this.calHuNumAndDianPaoPlayer();
    var huNum = result.huNum, dianPaoPlayer = result.dianPaoPlayer;
    // 多胡
    if(huNum > 1){
        var niaoData = MjClient.majiang.getNiaoIsShow(card,4);
        if(niaoData != -1){
            var index = (dianPaoPlayer + niaoData) % 4; // 可以获得这个鸟的位置  
            var temp_Pl = sData.players[tData.uids[index] ]; // 通过位置来获取玩家信息
            if(!temp_Pl || temp_Pl.winType <= 0)
                return false; 
            return true;
        }
    }else{
        //159+风牌
        var dataNum = card % 10;
        if(dataNum == 1 || dataNum == 5 || dataNum == 9 || card > 30)
           return true;
    }
    return false;
};

//算胡牌玩家数量和点炮玩家
majiang_panel_xinNing.prototype.calHuNumAndDianPaoPlayer = function(){
    var sData = MjClient.data.sData;
    var result = {"huNum": 0, "dianPaoPlayer": null};
    for (var index in sData.players) {
        if(sData.players[index].winType > 0){
            result.huNum++;
            result.dianPaoPlayer = sData.players[index].dianPaoPlayer;
        }
    }
    return result;
};

//Override
//创建翻鸟view
majiang_panel_xinNing.prototype.getShowBirdView = function(niaoCards){
    var self = this;
    return new majiang_showBird(niaoCards,function(){
        self.showBalanceLayer();
    }, majiang_showBird.prototype.SHOW_BIRD_TYPE.MOVE_FROM_RIGHT,{itemSpace: 98});
};

//Override
majiang_panel_xinNing.prototype.createGameOverPanel = function(){
    return new majiang_gameOver_xinNing();
};

/**
 *  Override
 *	获得玩家是否是庄的状态
 **/
majiang_panel_xinNing.prototype.getZhuangStatus = function(playerNodeName){
	if(!this.isBeganGame()){
		return false;
	}
	var tData = MjClient.data.sData.tData;
	var player = this.getPlayerInfoByName(playerNodeName);
	if(!player){
		return false;
	}

	if(player.info.uid == tData.uids[tData.zhuang]){
		return true;
	}
	return false;
};

//Override
majiang_panel_xinNing.prototype.sendPassToServer = function(){
    if (MjClient.rePlayVideo != -1) {
    	return;
    }

     //过胡提示
     var curPlayer = this.getPlayerInfoByName("node_down");
     if(MjClient.data.sData.tData.tState == TableState.waitPut && (curPlayer.eatFlag & 8) > 0){
         MjClient.showToast("你选择了过，暂时放弃胡牌");
     }
    var tData = MjClient.data.sData.tData;
    var sendMsg = {
    	cmd: "MJPass",
    	eatFlag: this.getEatFlag(),
    	cardNext: tData.cardNext
    };
    MjClient.gamenet.request("pkroom.handler.tableMsg", sendMsg);
};
