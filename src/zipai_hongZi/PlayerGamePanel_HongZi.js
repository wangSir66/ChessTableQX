/**
 * Created by Administrator on 2017/3/9.
 */
// var cdsNums = 0;
// var windPos = [];
// var windObj = [];
// var roundnumImgObj;
var actionZindex = 1000;
//向服务器发送 过消息
// MjClient.MJPass2NetForleiyang = function(){
//     cc.log("====================send======pass=====");
//     var sData = MjClient.data.sData;
//     var tData = sData.tData;
//
//     if(IsTurnToMe() && tData.tState == TableState.waitPut){
//         var eat = MjClient.playui.jsBind.eat;
//         eat.hu._node.visible = false;
//         eat.guo._node.visible = false;
//         eat.cancel._node.visible = false;
//     }else{
//         HZPassConfirmToServer_hongZi();
//     }
// };

// 这个没看懂干嘛的
// off 是四个位置，根据off 显示四个位置的信息 by sking
function SetUserVisible_hongzi(node, off){
    var pl = getUIPlayer_hongZi(off);
    cc.log("====================off======================" + off);
    var head = node.getChildByName("head");
    var name = head.getChildByName("name");
    var nobody = head.getChildByName("nobody");
    var headBox = head.getChildByName("headBox");
    var coin = head.getChildByName("coin");
    var offline = head.getChildByName("offline");
    var name_bg = head.getChildByName("name_bg");
    var score_bg = head.getChildByName("score_bg");
    var huxi = head.getChildByName("huxi");
    if(pl){
        name.visible = true;
        coin.visible = true;
        offline.visible = true;
        nobody.visible = true;
        headBox.visible = true;
        name_bg.visible = false;
        score_bg.visible = false;
        MjClient.loadWxHead(pl.info.uid, pl.info.headimgurl);
        setUserOffline_hongZi(node, off);
        // InitUserHandUI_hongzi(node, off);
        // cc.log("pl.info.uid = "+pl.info.uid);
    }else{
        name.visible = false;
        coin.visible = false;
        offline.visible = false;
        huxi.visible = false;
        nobody.visible = false;
        headBox.visible = false;
        var WxHead = nobody.getChildByName("WxHead");
        if(WxHead){
            WxHead.removeFromParent(true);
        }
    }
}

//设置玩家牌桌上的信息(只有自己才设置手牌，其他玩家不需要设置)
function InitUserHandUI_hongzi(node, off){
    var tData = MjClient.data.sData.tData;
    var pl = getUIPlayer_hongZi(off);

    if(!pl){
        return;
    }

    //初

    setAreaTypeInfo(true);

    if (pl.jiazhuNum == 2 && MjClient.rePlayVideo == -1)
    {
        if (SelfUid() == pl.info.uid) {
            var layer = new laZhangLayer();
            MjClient.playui.addChild(layer, 99);
            if (MjClient.webViewLayer != null) {
                MjClient.webViewLayer.close();
            }
        }
        else
        {
            MjClient.playui._jiazhuWait.visible = true;
        }
    }else if(pl.jiazhuNum == 1){
        MjClient.majiang.setJiaZhuNum(node, getUIPlayer_hongZi(off));
    }

    if (MjClient.rePlayVideo != -1) {
         MjClient.playui._jiazhuWait.visible = false;
    }

    if(tData.tState != TableState.waitPut && tData.tState != TableState.waitEat && tData.tState != TableState.waitCard && tData.tState != TableState.waitJiazhu){
        return;
    }

    //添加手牌
    if(MjClient.rePlayVideo == -1){
        //表示正常游戏
        if(pl.mjhand && off == 0){
            cc.log("pl.mjhand====:" + pl.mjhand);
            MjClient.HandCardArr = MjClient.majiang.sortCard(pl.mjhand);
        }
    }else{
        /*
            播放录像
         */
        cc.log("_________________mjhand_replay_______________"+JSON.stringify(pl.mjhand));
        if (pl.mjhand){
            if(off == 0){
                MjClient.HandCardArr = MjClient.majiang.sortCard(pl.mjhand);
            }else{
                if(!MjClient.OtherHandArr){
                    MjClient.OtherHandArr = {};
                }
                if(!MjClient.OtherHandArr[off]){
                    MjClient.OtherHandArr[off] = MjClient.majiang.sortCard(pl.mjhand);
                }
            }
        }

    }
    MjClient.playui.CardLayoutRestore(node,off);
}

var PlayLayer_HongZi = cc.Layer.extend({
    jsBind: {
        _event: {
            mjhand: function() {
                if(MjClient.endoneui != null)
                {
                    cc.log("=======mjhand====endoneui====" + typeof (MjClient.endoneui) );
                    MjClient.endoneui.removeFromParent(true);
                    MjClient.endoneui = null;
                }
                MjClient.hasPut = false;
                var sData = MjClient.data.sData;
                var tData = sData.tData;
                if (tData.roundNum != tData.roundAll) return;
                var pls = sData.players;
                var ip2pl = {};
                for (var uid in pls) {
                    var pi = pls[uid];
                    var ip = pi.info.remoteIP;
                    if (ip) {
                        if (!ip2pl[ip]) ip2pl[ip] = [];
                        ip2pl[ip].push(unescape(pi.info.nickname ));
                    }
                }
                var ipmsg = [];
                for (var ip in ip2pl) {
                    var ips = ip2pl[ip];
                    if (ips.length > 1) {
                        ipmsg.push("玩家:" + ips.join("，") + "为同一IP地址。")
                    }
                }
                if (ipmsg.length > 0) {
                    // AlertSameIP(ipmsg.join("\n"));
                }
                mylog("ipmsg " + ipmsg.length);

                //距离位置显示
                // checkCanShowDistance(); //todo qq

            },
            LeaveGame: function() {
                if (this._delayExeAction && cc.sys.isObjectValid(this._delayExeAction)){
                    this.stopAction(this._delayExeAction);
                    delete this._delayExeAction;
                }
                MjClient.addHomeView();
                MjClient.playui.removeFromParent(true);
                stopEffect(playTimeUpEff);
                playTimeUpEff = null;
                delete MjClient.playui;
                delete MjClient.endoneui;
                delete MjClient.endallui;
                cc.audioEngine.stopAllEffects();
                playMusic("bgMain");
            },
            endRoom: function(msg) {
                mylog(JSON.stringify(msg));
                if (msg.showEnd){
                    this.addChild(new GameOverLayer_HongZi(),500);
                }else{
                    MjClient.Scene.addChild(new StopRoomView());
                }    
            },
            roundEnd: function() {
                var self = this;

                var sData = MjClient.data.sData;
                var tData = sData.tData;
                var time = 0.2;
                if(!MjClient.isDismiss && tData.hunCard && tData.hunCard != -1 && tData.areaSelectMode.xingType==2){
                    time = 1.8;
                    var hunCard = sData.cards[tData.cardNext];
                    if(!hunCard){
                        hunCard = tData.lastPutCard;
                    }
                    ShowEatActionAnim_hongZi(MjClient.playui._downNode, ActionType_paohuzi.FANXING, 0);
                    DealFanXingNewCard_hongZi(hunCard);
                }

                function delayExe(){
                    var sData = MjClient.data.sData;
                    resetEatActionAnim_hongZi();
                    if (sData.tData.roundNum <= 0){
                        var layer = new GameOverLayer_HongZi();
                        // layer.setVisible(false);
                        self.addChild(layer,500);
                    }
                    if(!MjClient.endoneui){
                        self.addChild(new EndOneView_HongZi(),500);
                    }

                    var putNode = MjClient.playui._downNode.getChildByName("xingPai");
                    putNode.removeAllChildren();
                    putNode.setVisible(false);
                }
                this._delayExeAction = this.runAction(cc.sequence(cc.delayTime(time),cc.callFunc(delayExe)));
                MjClient.playui.showAndHideHeadEffect();
            },
            moveHead: function() {
                postEvent("returnPlayerLayer");
                //tableStartHeadMoveAction_hongZi(this);   //不涉及到头像移动动作
            },
            initSceneData: function() {
                if (this._delayExeAction && cc.sys.isObjectValid(this._delayExeAction)){
                    this.stopAction(this._delayExeAction);
                    delete this._delayExeAction;
                }
                reConectHeadLayout_hongZi(this);        //不涉及到头像移动动作
                CheckRoomUiDelete();
                tableStartHeadMoveAction_hongZi(this);   //不涉及到头像移动动作

                //距离位置显示
                // checkCanShowDistance();
                MjClient.playui.showAndHideHeadEffect();
            },
            MJChat : function(data){
                if(data.type == 4){
                    //距离位置显示
                    // checkCanShowDistance();
                }
            }, 
            addPlayer:function () {
                tableStartHeadMoveAction_hongZi(this);   //不涉及到头像移动动作
            },
            removePlayer: function(eD) {
                //距离位置显示
                // checkCanShowDistance();
            },
            onlinePlayer: function() {
                reConectHeadLayout_hongZi(this);        //不涉及到头像移动动作
            },
            logout: function() {
                if (MjClient.playui) {
                    MjClient.addHomeView();
                    MjClient.playui.removeFromParent(true);
                    delete MjClient.playui;
                    delete MjClient.endoneui;
                    delete MjClient.endallui;
                }
            },
            DelRoom: function() {
                CheckRoomUiDelete();
            },
            changeMJBgEvent: function() {
                changeMJBg_hongZi(this, ziPai.getZiPaiType());
            },
            MJPeng: function() {
                MjClient.playui.showAndHideHeadEffect();
            },
            HZNewCard: function(){
                MjClient.playui.showAndHideHeadEffect();
            },
            HZGangCard: function(){
                MjClient.playui.showAndHideHeadEffect();
            },
            HZChiCard: function() {
                MjClient.playui.showAndHideHeadEffect();
            },
            HZWeiCard: function(){
                MjClient.playui.showAndHideHeadEffect();
            },
            MJPut: function(msg) {
                MjClient.playui.showAndHideHeadEffect();
            },
            waitPut: function(eD) {
                MjClient.playui.showAndHideHeadEffect();
            },
            EZP_layout : function(){
                if(MjClient.data.sData.tData.maxPlayer == 2){
                    ziPai.changePlayUILayout(MjClient.playui.playuiNode);
                    MjClient.playui.ResetPutCard(MjClient.playui._downNode, 0);
                    MjClient.playui.ResetPutCard(MjClient.playui._topNode, 1); 
                    return;
                }
                if(MjClient.data.sData.tData.maxPlayer < 4){
                    ziPai.changePlayUILayout(MjClient.playui.playuiNode);
                    MjClient.playui.ResetPutCard(MjClient.playui._downNode, 0);
                    MjClient.playui.ResetPutCard(MjClient.playui._rightNode, 1);
                    MjClient.playui.ResetPutCard(MjClient.playui._topNode, 2);
                }
                
            }
        },
        cardNumImg: {
            _run:function () {
                MjClient.cardNumImgNode = this;
                setWgtLayout(this,[0.085, 0.085], [0.5, 0.73], [0, 0]);
            },
            _event: {
                initSceneData: function(eD) {
                    this.visible = IsArrowVisible_hongZi();
                },
                mjhand: function(eD) {
                    this.visible = IsArrowVisible_hongZi();
                },
                onlinePlayer: function(eD) {
                    this.visible = IsArrowVisible();
                }
            },
            cardNumImg:{
                _event:{
                    initSceneData:function(){
                        if(!IsArrowVisible_hongZi()){
                            return;
                        }
                        var sData = MjClient.data.sData;
                        var tData = sData.tData; 
                        var next = MjClient.majiang.getAllCardsTotal() - tData.cardNext;
                        if(next <= 0){
                            this.visible = false;
                        }else if(next > 1){
                            this.visible = false; //隐藏
                            return;
                           this.removeAllChildren();
                           for(var i = 1;i <= next;i++){
                                var child = ccui.ImageView("playing/paohuzi/fapai_pai.png");
                                child.setPosition(cc.p(this.width/2,this.height/2 + i * 0.8));
                                this.addChild(child);
                           }
                        } 
                    },
                    mjhand:function(){
                        var sData = MjClient.data.sData;
                        var tData = sData.tData; 
                        var next = MjClient.majiang.getAllCardsTotal() - tData.cardNext;
                        if(next <= 0){
                            this.visible = false;
                        }else if(next > 1){
                            this.visible = false;
                            return;
                           this.removeAllChildren();
                           for(var i = 1;i <= next;i++){
                                var child = ccui.ImageView("playing/paohuzi/fapai_pai.png");
                                child.setPosition(cc.p(this.width/2,this.height/2 + i * 0.8));
                                this.addChild(child);
                           }
                        }                     
                    },
                    HZNewCard:function(){
                        var sData = MjClient.data.sData;
                        var tData = sData.tData; 
                        var next = MjClient.majiang.getAllCardsTotal() - tData.cardNext;
                        if(next <= 0){
                            this.visible = false;
                        }else if(next > 1){
                           //  this.visible = true;
                           // this.removeAllChildren();
                           // for(var i = 1;i <= next;i++){
                           //      var child = ccui.ImageView("playing/paohuzi/fapai_pai.png");
                           //      child.setPosition(cc.p(this.width/2,this.height/2 + i * 0.8));
                           //      this.addChild(child);
                           // }
                            var children = this.getChildren();
                            var childNum = this.getChildrenCount();
                            if(childNum +1 > next){
                                children[childNum - 1].removeFromParent(true);
                            }
                        } 
                    },
                    roundEnd: function(){
                        this.visible = false;
                    }                    
                }
            },
            cardnumAtlas: {
                _run: function() {
                    this.ignoreContentAdaptWithSize(true);
                },
                _text: function() {
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    if (tData) return MjClient.majiang.getAllCardsTotal() - tData.cardNext;
                },
                _event: {
                    mjhand: function() {
                        this.visible = true;
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;
                        if (tData) this.setString(MjClient.majiang.getAllCardsTotal() - tData.cardNext);
                    },
                    HZNewCard: function() {
                        this.visible = true;
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;
                        if (tData) this.setString(MjClient.majiang.getAllCardsTotal() - tData.cardNext);
                    },
                    HZCardNum: function() {
                        this.visible = true;
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;
                        if (tData) this.setString(MjClient.majiang.getAllCardsTotal() - tData.cardNext);
                    },
                    // waitPut: function() {
                    //     var sData = MjClient.data.sData;
                    //     var tData = sData.tData;
                    //     if (tData) this.setString(MjClient.majiang.getAllCardsTotal() - tData.cardNext);
                    //     cc.log(MjClient.majiang.getAllCardsTotal() + "-----------------waitPut------------------" + tData.cardNext);
                    // }
                    roundEnd: function(){
                        this.visible = false;
                    }
                }
            }
        },
        back: {
            back: {
                _run: function() {
                    changeGameBg(this);
                },
                _event: {
                    changeGameBgEvent: function() {
                        changeGameBg(this);
                    }
                },
                _layout: [[1, 1],[0.5, 0.5],[0, 0], true],
            },
            LeftBottom:{
                _layout: [[0.1, 0.1],[0.03, 0.045],[0, 0]],
            },
            RightBottom:{
                _layout: [[0.1, 0.1],[0.97,0.05],[0, 0]],
            },
            RightTop:{
                _layout: [[0.1, 0.1],[0.97,0.95],[0, 0]],
            },
            leftTop:{
                _layout: [[0.1, 0.1],[0.03,0.95],[0,0]],
                // _run:function()
                // {
                //     var text = new ccui.Text();
                //     text.setFontName(MjClient.fzcyfont);
                //     text.setFontSize(20);
                //     text.setRotation(-90);
                //     text.setAnchorPoint(0,0.5);
                //     text.setPosition(23.5, 20.5);
                //     this.addChild(text);
                //     text.schedule(function(){
                //         var time = MjClient.getCurrentTime();
                //         var str = time[0]+"/"+time[1]+"/"+ time[2]+" "+
                //             (time[3]<10?"0"+time[3]:time[3])+":"+
                //             (time[4]<10?"0"+time[4]:time[4])+":"+
                //             (time[5]<10?"0"+time[5]:time[5]);
                //         this.setString(str);
                //     });
                // }
            }
        },
        info:{
            _layout: [[0.16, 0.16],[0.01, 0.935],[0, 0]]
        },
        gameName:{
            _layout: [[0.12, 0],[0.5, 0.8292],[0, 0]]
        },
        roundInfo:{
            _layout: [[0.11, 0.11],[0.5, 0.7],[0, 0]],
            _run:function () {
                if(MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ || MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP) {
                    this.visible = false;
                }
            },
        },
        jiazhuWait:{
            _visible:false,
            _layout: [[0.45, 0.12],[0.5, 0.5],[0, 0]]
        },
        banner: {
            _layout: [[0.35, 0.35],[0.5, 1],[0, 0]],
            _run: function() {
                    //changeGameTitleBg(this);
                },
            _event: {
                changeGameBgEvent: function() {
                    //changeGameTitleBg(this);
                }
            },
            wifi: {
                _run: function() {
                    updateWifiState(this);
                }
            },
            timeTxt:{
                _run:function()
                {
                    this.ignoreContentAdaptWithSize(true);
                    this.schedule(function(){
                        var time = MjClient.getCurrentTime();
                        var str = (time[3]<10?"0"+time[3]:time[3])+":"+
                            (time[4]<10?"0"+time[4]:time[4]);
                        this.setString(str);
                    });
                }

            },
            powerBar: {
                _run: function() {
                    updateBattery(this);
                },
                _event: {
                    nativePower: function(d) {
                        this.setPercent(Number(d));
                    }
                }
            },
            tableid: {
                _run: function() {
                    this.ignoreContentAdaptWithSize(true);
                },
                _event: {
                    initSceneData: function() {
                        this.ignoreContentAdaptWithSize(true);
                        this.setString(MjClient.data.sData.tData.tableid);
                    }
                }
            },
            getRoomNum: {
                // _run:function(){
                //     if (MjClient.remoteCfg.guestLogin){
                //         setWgtLayout(this, [0.18, 0.18],[0.5, 0.3],[0, 0]);
                //     }else{
                //         setWgtLayout(this, [0.18, 0.18],[0.5, 0.2],[0, 0]);
                //     }
                // },
                // _visible:function(){
                //     return !MjClient.remoteCfg.guestLogin;
                // },
                _click: function() {
                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Fuzhifangjianxinxi", {uid:SelfUid(), gameType:MjClient.gameType});

                    /*
                     复制房间号-----------------------
                     */
                    var tData = MjClient.data.sData.tData;

                    var str = "";
                    str += tData.areaSelectMode.convertible ? "自由人数," : tData.areaSelectMode.maxPlayer + "人,";
                    str += tData.areaSelectMode.isMaiPai ? "埋20张," : "";
                    str += tData.areaSelectMode.minRedNum + "红起胡,";
                    str += ["无", "一", "二", "三", "四"][tData.areaSelectMode.kingNum] + "王";
                    str += tData.areaSelectMode.isShuangHe ? ",双合翻倍" : "";


                    str += tData.areaSelectMode.isDaHu ? ",大胡10分" : "";
                    str += tData.areaSelectMode.isPengPengHu ? ",碰碰胡" : "";
                    str += tData.areaSelectMode.isYiGuaBian ? ",一挂匾" : "";
                    str += tData.areaSelectMode.isHuDieFei ? ",蝴蝶飞" : "";
                    str += tData.areaSelectMode.isSiPeng ? ",四碰单吊" : "";
                    str += tData.areaSelectMode.isManTangHong ? ",满堂红" : "";
                    str += tData.areaSelectMode.isBanBanHu ? ",板板胡" : "";
                    str += tData.areaSelectMode.isShiErHong ? ",十二红" : "";
                    str += tData.areaSelectMode.isShiYiiHong ? ",十一红" : "";
                    str += tData.areaSelectMode.isFengDing  ? ",80分封顶" : "";
                    str += tData.areaSelectMode.isJuJuHong ? ",句句红" : "";
                    str += tData.areaSelectMode.isRandomZhuang ? ",随机坐庄" : "";
                    

                    // if(tData.areaSelectMode.isBanBanHu){
                    //     str += [",闲家胡桌面第一张牌",",闲家胡自己摸的第一张牌"][tData.areaSelectMode.banBanHuType];
                    // }

                    var sData = MjClient.data.sData;
                    var str7 = "  二缺一";
                    if(MjClient.MaxPlayerNum_hongZi == 3){
                        if((MjClient.MaxPlayerNum_hongZi - Object.keys(sData.players).length) == 2){
                            str7 = "  一缺二";
                        }
                    }else if(MjClient.MaxPlayerNum_hongZi == 4){
                        if((MjClient.MaxPlayerNum_hongZi - Object.keys(sData.players).length) == 3){
                            str7 = "  一缺三";
                        }else if((MjClient.MaxPlayerNum_hongZi - Object.keys(sData.players).length) == 2){
                            str7 = "二缺二";
                        }else  if((MjClient.MaxPlayerNum_hongZi - Object.keys(sData.players).length) == 1){
                            str7 = "三缺一";
                        }
                    }

                    // var _nameStr = unescape(pl.info.nickname );
                    str7 += "(";
                    var index = 0;
                    for(var uid in sData.players){
                        var pl = sData.players[uid + ""];
                        if (!pl) continue;
                        str7 += unescape(pl.info.nickname );
                        if(index < Object.keys(sData.players).length - 1){
                            str7 += ",";
                        }
                        index ++;
                    }
                    str7 += ")";
                    var str6 = str7+",速度加入【"+AppCnName[MjClient.getAppType()]+"】\n" + "(复制此消息打开游戏可直接进入该房间)";
                    cc.log(str+str6);
                    MjClient.native.doCopyToPasteBoard("房间号:[" + tData.tableid + "]\n" + str+str6);
                    MjClient.showMsg("已复制房间号，请不要返回大厅。打开微信后粘贴房间信息。", function(){
                        MjClient.native.openWeixin();
                    }, function(){});
                },
                // _event: {
                //     initSceneData: function(eD) {
                //         this.visible = IsInviteVisible();
                //     },
                //     addPlayer: function(eD) {
                //         console.log(">>>>>> play add player >>>>");
                //         this.visible = IsInviteVisible();
                //     },
                //     removePlayer: function(eD) {
                //         this.visible = IsInviteVisible();
                //     }
                // }
            },
            setting: {
                _click: function() {
                    var settringLayer = new ZiPaiSettingView();
                    settringLayer.setName("PlayLayerClick");
                    MjClient.Scene.addChild(settringLayer);
                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Shezhi", {uid:SelfUid(),gameType:MjClient.gameType});
                }
            },
            changeBg: {
                _run: function() {
                    if(MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ || MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP){
                        this.loadTextureNormal("playing/ziPaiBanner/wenhao.png");
                        this.setContentSize(this.getNormalTextureSize());
                    }
                },
                _click: function() {
                    if(MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ || MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP){
                        postEvent("EZP_rule");
                    }else {
                        ziPai.setCurrentGameBgTypeToNext();
                        postEvent("changeGameBgEvent", {});
                        MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Pifu", {uid:SelfUid(),gameType:MjClient.gameType});
                    }
                }
            },
            gps_btn: {
                _run:function(){
                    this.setEnabled(MjClient.MaxPlayerNum_hongZi >= 3);
                },
                //_layout: [[0.09, 0.09],[0.38, 0.93],[0, 0]],
                _click: function() {
                    if(MjClient.MaxPlayerNum_hongZi == 3){
                        MjClient.Scene.addChild(new showDistance3PlayerLayer());
                    }else if(MjClient.MaxPlayerNum_hongZi == 4){
                        MjClient.Scene.addChild(new showDistanceLayer());
                    }
                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Dingwei", {uid: SelfUid(),gameType:MjClient.gameType});
                }
            },
            back_btn: {
                //_layout: [[0.09, 0.09],[0.38, 0.93],[0, 0]],
                _click: function() {
                    if (!IsRoomCreator() &&
                        (MjClient.data.sData.tData.tState == TableState.waitJoin || MjClient.data.sData.tData.tState == TableState.waitReady))
                    {
                        MjClient.showMsg("确定要退出房间吗？",
                            function() {
                                MjClient.leaveGame();
                                //if (!MjClient.enterui && !getClubInfoInTable())
                                //    MjClient.Scene.addChild(new EnterRoomLayer());
                            },
                            function() {});
                    }
                    else {
                        MjClient.showMsg("是否解散房间？", function () {
                            MjClient.delRoom(true);
                        }, function(){}, 1);
                    }
                }
            },
            Button_1: {
                _visible : true,
                _click: function() {
                    MjClient.openWeb({url:MjClient.GAME_TYPE.SU_QIAN,help:true});
                }
            },
            roundnumImg: {
                _run:function () {
                    MjClient.roundnumImgNode = this;
                    //setWgtLayout(this,[0.1, 0.1], [0.5, 0.57], [0, 0]);
                },
                _event: {
                    initSceneData: function(eD) {
                        this.visible = IsArrowVisible_hongZi();
                    },
                    mjhand: function(eD) {
                        this.visible = IsArrowVisible_hongZi();
                    },
                    onlinePlayer: function(eD) {
                        this.visible = IsArrowVisible_hongZi();
                    }
                },
                roundnumAtlas: {
                    _run:function () {
                        this.ignoreContentAdaptWithSize(true);
                    },
                    _text: function() {
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;
                        var extraNum = tData.extraNum ? tData.extraNum:0;
                        if (tData) return ((tData.roundAll - tData.roundNum + 1 + extraNum).toString()+"/"+tData.roundAll.toString()+"局");
                    },
                    _event: {
                        mjhand: function() {
                            var sData = MjClient.data.sData;
                            var tData = sData.tData;
                            var extraNum = tData.extraNum ? tData.extraNum:0;
                            if (tData) return this.setString((tData.roundAll - tData.roundNum + 1 + extraNum).toString()+"/"+tData.roundAll.toString()+"局");
                        }
                    }
                }
            },
        },
        wait: {
            // getRoomNum: {
            //     _run:function(){
            //         if (MjClient.remoteCfg.guestLogin){
            //             setWgtLayout(this, [0.18, 0.18],[0.5, 0.3],[0, 0]);
            //         }else{
            //             setWgtLayout(this, [0.18, 0.18],[0.5, 0.2],[0, 0]);
            //         }
            //     },
            //     _visible:function(){
            //         return !MjClient.remoteCfg.guestLogin;
            //     },
            //     _click: function() {
            //         /*
            //          复制房间号-----------------------
            //          */
            //         var tData = MjClient.data.sData.tData;
            //         var str1 = "扯胡子,";
            //         var str2 = (tData.areaSelectMode.kingNum == 2) ? "双王," : "三王,";
            //         var str3 = (tData.areaSelectMode.isFanXing == 1) ? "单醒," : "双醒,";
            //         str3 += (tData.areaSelectMode.fengDing == -1) ? "无上限," : (tData.areaSelectMode.fengDing == 300)?"300分封顶,":"600分封顶,";
            //         var str5 = "三人场,";
            //         var sData = MjClient.data.sData;
            //         var str7 = "  二缺一";
            //         if((MjClient.MaxPlayerNum_hongZi - Object.keys(sData.players).length) == 2){
            //             str7 = "  一缺二";
            //         }
            //         // var _nameStr = unescape(pl.info.nickname );
            //         str7 += "(";
            //         var index = 0;
            //         for(var uid in sData.players){
            //             var pl = sData.players[uid + ""];
            //             str7 += unescape(pl.info.nickname );
            //             if(index < Object.keys(sData.players).length - 1){
            //                 str7 += ",";
            //             }
            //             index ++;
            //         }
            //         str7 += ")";
            //         var str6 = tData.roundNum + "局,"+str7+",速度加入【"+AppCnName[MjClient.getAppType()]+"】\n" + "(复制此消息打开游戏可直接进入该房间)";
            //         MjClient.native.doCopyToPasteBoard("房间号:[" + tData.tableid + "]\n" + str1+str2+str3+str5+str6);
            //         MjClient.showMsg("已复制房间号，请不要返回大厅。打开微信后粘贴房间信息。", function(){
            //             MjClient.native.openWeixin();
            //         });
            //     }
            // },
            wxinvite: {
                _layout: [[219/1280, 0],[0.697, 0.12],[0, 0]],
                _click: function() {
                    getPlayingRoomInfo(2);
                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Yaoqingweixinhaoyou", {uid:SelfUid(), gameType:MjClient.gameType});

                    // var tData = MjClient.data.sData.tData;

                    // var str = "";
                    // str += tData.areaSelectMode.maxPlayer + "人,";
                    // str += tData.areaSelectMode.minRedNum + "红起胡,";
                    // str += ["无", "一", "二", "三", "四"][tData.areaSelectMode.kingNum] + "王";
                    // str += tData.areaSelectMode.isShuangHe ? ",双合翻倍" : "";
                    // str += tData.areaSelectMode.isDaHu ? ",大胡10分" : "";
                    // str += tData.areaSelectMode.isPengPengHu ? ",碰碰胡" : "";
                    // str += tData.areaSelectMode.isYiGuaBian ? ",一挂匾" : "";
                    // str += tData.areaSelectMode.isHuDieFei ? ",蝴蝶飞" : "";
                    // str += tData.areaSelectMode.isSiPeng ? ",四碰单吊" : "";
                    // str += tData.areaSelectMode.isManTangHong ? ",满堂红" : "";
                    // str += tData.areaSelectMode.isBanBanHu ? ",板板胡" : "";
                    // str += tData.areaSelectMode.isShiErHong ? ",十二红" : "";
                    // str += tData.areaSelectMode.isShiYiiHong ? ",十一红" : "";
                    // str += tData.areaSelectMode.isFengDing  ? ",80分封顶" : "";
                    // str += tData.areaSelectMode.isJuJuHong ? ",句句红" : "";

                    // // if(tData.areaSelectMode.isBanBanHu){
                    // //     str += [",闲家胡桌面第一张牌",",闲家胡自己摸的第一张牌"][tData.areaSelectMode.banBanHuType];
                    // // }
                    // str += "点击立即加入牌局>>>";

                    // var sData = MjClient.data.sData;
                    // var str7 = "  二缺一";
                    // if(MjClient.MaxPlayerNum_hongZi == 3){
                    //     if((MjClient.MaxPlayerNum_hongZi - Object.keys(sData.players).length) == 2){
                    //         str7 = "  一缺二";
                    //     }
                    // }else if(MjClient.MaxPlayerNum_hongZi == 4){
                    //     if((MjClient.MaxPlayerNum_hongZi - Object.keys(sData.players).length) == 3){
                    //         str7 = "  一缺三";
                    //     }else if((MjClient.MaxPlayerNum_hongZi - Object.keys(sData.players).length) == 2){
                    //         str7 = "二缺二";
                    //     }else  if((MjClient.MaxPlayerNum_hongZi - Object.keys(sData.players).length) == 1){
                    //         str7 = "三缺一";
                    //     }
                    // }
                    // var txt_club = tData.clubId ? " 亲友圈(" + tData.clubId + ")" : "";
                    // cc.log("str=" + str + " str7=" + str7);
                    // MjClient.native.wxShareUrl(MjClient.remoteCfg.entreRoomUrl+"?vipTable="+tData.tableid, GameCnName[MjClient.gameType] + "  房间号:" + tData.tableid + str7+txt_club, str);
                },
                _visible:function(){
                    return !MjClient.remoteCfg.guestLogin;
                },
                _event: {
                    initSceneData: function(eD) {
                        this.visible = IsInviteVisible();
                    },
                    addPlayer: function(eD) {
                        console.log(">>>>>> play add player >>>>");
                        this.visible = IsInviteVisible();
                    },
                    removePlayer: function(eD) {
                        this.visible = IsInviteVisible();
                    }
                }
            },
            delroom: {
                _run:function(){
                    if (isIPhoneX()) {
                        setWgtLayout(this, [0.11, 0.11],[0.1, 0.5],[0, 0]);
                    }
                    else {
                        setWgtLayout(this, [0.11, 0.11],[0.05, 0.5],[0, 0]);
                    }
                    this.visible = false;
                },
                _click: function() {
                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Jiesanfangjian", {uid:SelfUid(), gameType:MjClient.gameType});

                    MjClient.delRoom(true);
                },
                _event: {
                    initSceneData: function(eD) {
                        //this.visible = isShowBackBtn_HongZi();
                    },
                    removePlayer: function(eD) {
                        //this.visible = isShowBackBtn_HongZi();
                    },
                    mjhand: function(){
                        //this.visible = false;
                    },
                    waitReady:function()
                    {
                        //this.visible = true;
                    },
                }
            },
            backHomebtn: {
                _run:function(){
                    setWgtLayout(this, [219/1280, 0],[0.30, 0.12],[0, 0]);
                },
                _click: function(btn) {
                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Likaifangjian", {uid:SelfUid(), gameType:MjClient.gameType});

                    var sData = MjClient.data.sData;
                    if (sData) {
                        if (IsRoomCreator()) {
                            MjClient.showMsg("返回大厅房间仍然保留\n赶快去邀请好友吧",
                                function() {
                                    MjClient.leaveGame();
                                    //if (!MjClient.enterui && !getClubInfoInTable())
                                    //    MjClient.Scene.addChild(new EnterRoomLayer());
                                },
                                function() {});
                        } else {
                            MjClient.showMsg("确定要退出房间吗？",
                                function() {
                                    MjClient.leaveGame();
                                    //if (!MjClient.enterui && !getClubInfoInTable())
                                    //    MjClient.Scene.addChild(new EnterRoomLayer());
                                },
                                function() {});
                        }
                    }
                },
                _event: {
                    returnPlayerLayer: function() {
                        MjClient.playui.visible = true;
                    },
                    initSceneData: function(eD) {
                        this.visible = isShowBackBtn_HongZi();
                    },
                    removePlayer: function(eD) {
                        this.visible = isShowBackBtn_HongZi();
                    },
                    mjhand: function(){
                        this.visible = false;
                    },
                    waitReady:function()
                    {
                        this.visible = true;
                    },
                    PKPass:function () {
                        this.visible = false;
                    },
                    onlinePlayer: function(msg) {
                        if(msg.uid  == SelfUid())
                        {
                            this.visible = false;
                        }
                    },
                }
            },
            waitFriends:{
                _layout: [[0.06, 0.06],[0.5, 0.5],[0, -4]],
                _run:function () {
                    for(var i=0 ; i<9 ; i++){
                        var imgZi = this.getChildByName("waitFriend_" + i);

                        var hei = 20;
                        if(i>=6){
                            hei = 10;
                        }
                        if(imgZi){
                            imgZi.runAction(cc.repeatForever(cc.sequence(
                                cc.delayTime(i*0.3),
                                cc.moveBy(0.3, 0, hei),
                                cc.moveBy(0.3, 0, -hei),
                                cc.delayTime(3 - i*0.3)
                            )));
                        }
                    }
                },
                _event: {
                    initSceneData: function(eD) {
                        this.visible = IsInviteVisible();
                    },
                    addPlayer: function(eD) {
                        console.log(">>>>>> play add player >>>>");
                        this.visible = IsInviteVisible();
                    },
                    removePlayer: function(eD) {
                        this.visible = IsInviteVisible();
                    }
                }
            },
            // _event: {
            //     initSceneData: function(eD) {
            //         this.visible = IsInviteVisible();
            //     },
            //     addPlayer: function(eD) {
            //         console.log(">>>>>> play add player >>>>");
            //         this.visible = IsInviteVisible();
            //     },
            //     removePlayer: function(eD) {
            //         this.visible = IsInviteVisible();
            //     }
            // }
        },
        BtnReady:{
            _run: function () {
                this.visible = false;
                //setWgtLayout(this,[0.135, 0.128], [0.5, 0.40], [0.0, 0.26]);
                setWgtLayout(this,[219/1280, 0],[0.697, 0.12],[0, 0]);
            },
            _click: function(btn) {
                cc.log("-----------准备-------");
                //sendQiangdizhu(true);
                HZPassConfirmToServer_hongZi();
                MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Zhunbei", {uid: SelfUid(), gameType:MjClient.gameType});
            },
            _event:{
                waitReady:function()
                {
                    this.visible = true;
                },
                mjhand: function() {

                    this.visible = false;
                },
                initSceneData: function() {
                    this.visible = false;
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    if (tData.roundNum != tData.roundAll) {
                        return;
                    }

                    if (Object.keys(sData.players).length < tData.maxPlayer) {
                        return;
                    }

                    var pl = getUIPlayer(0);
                    if(tData.tState == TableState.waitReady && pl.mjState == TableState.waitReady)
                    {
                        this.visible = true;
                    }
                },
                PKPass:function () {
                    this.visible = false;
                },
                onlinePlayer: function(msg) {
                    if(msg.uid  == SelfUid())
                    {
                        this.visible = false;
                    }
                },
                removePlayer: function() {
                    this.visible = false;
                }
            }
        },        
        down: {
            head: {
                zhuang: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        waitPut: function(){
                            showUserZhuangLogo_hongZi(this, 0);
                        },
                        initSceneData: function(){
                            if (IsArrowVisible_hongZi()) showUserZhuangLogo_hongZi(this, 0);
                        },
                        mjhand: function(){
                            if (IsArrowVisible_hongZi()) showUserZhuangLogo_hongZi(this, 0);
                        }
                    }
                },
                chatbg: {
                    _run: function() {
                        this.getParent().zIndex = 600;
                    },
                    chattext: {
                        _event: {

                            MJChat: function(msg) {

                                showUserChat_hongZi(this, 0, msg);
                            },
                            playVoice: function(voicePath) {
                                MjClient.data._tempMessage.msg = voicePath;
                                showUserChat_hongZi(this, 0, MjClient.data._tempMessage);
                            }
                        }
                    }
                },
                _click: function(btn) {
                    showPlayerInfo_hongZi(0, btn);
                },
                _event: {
                    loadWxHead: function(d) {
                        setWxHead_hongZi(this, d, 0);
                    },
                    addPlayer: function(eD) {
                        showFangzhuTagIcon_hongZi(this,0);
                    },
                    removePlayer: function(eD) {
                        showFangzhuTagIcon_hongZi(this,0);
                    }
                },
                _run: function () {
                    showFangzhuTagIcon_hongZi(this,0);
                },
                score_bg:{_visible:false},
                huxi:{
                    _visible: false,
                    _event:{
                        clearCardUI: function(){
                            this.setVisible(false);
                            return this.setString("胡息:0");
                        },
                        addPlayer: function(){
                            return this.setString("胡息:0");
                        },
                        removePlayer: function(){
                            this.visible = false;
                        },
                        initSceneData:function(){
                            // this.visible = true;
                            var huXi = UpdateHuXi_hongZi(0);
                            if(!IsArrowVisible_hongZi()){
                                huXi = 0;
                            }
                            return this.setString("胡息:" + huXi);
                        },
                        mjhand:function(){
                            // this.visible = true;
                        },
                        HZChiCard:function(){
                            var huXi = UpdateHuXi_hongZi(0);
                            return this.setString("胡息:" + huXi);
                        },
                        MJPeng:function(){
                            var huXi = UpdateHuXi_hongZi(0);
                            return this.setString("胡息:" + huXi);
                        },
                        HZGangCard:function(){
                            var huXi = UpdateHuXi_hongZi(0);
                            return this.setString("胡息:" + huXi);
                        },
                        HZWeiCard:function(){
                            var huXi = UpdateHuXi_hongZi(0);
                            return this.setString("胡息:" + huXi);
                        },
                        LY_addHandHuXi:function () {
                            var huXi = UpdateHuXi_hongZi(0);
                            return this.setString("胡息:" + huXi);
                        }
                    }
                },
                jiaZhu: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        clearCardUI: function(eD) {
                            this.visible = false;
                        }
                    }
                },
                jiaZhuTip: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        clearCardUI: function(eD) {
                            this.visible = false;
                        }
                    }
                },
                name_bg:{_visible:false},
                timeImg:{
                    _visible:false,
                    _event:{
                        initSceneData: function(eD) {
                            //this.visible = curPlayerIsMe_hongZi(0);
                        },
                        onlinePlayer: function(eD) {
                            //this.visible = curPlayerIsMe_hongZi(0) && IsArrowVisible_hongZi();
                        },
                        waitPut: function(eD) {
                            //this.visible = curPlayerIsMe_hongZi(0);
                        },
                        HZNewCard: function(ed){
                            //this.visible = curPlayerIsMe_hongZi(0);
                        },
                        MJPeng: function(eD) {
                            //this.visible = curPlayerIsMe_hongZi(0);
                        },
                        HZChiCard: function(eD) {
                            //this.visible = curPlayerIsMe_hongZi(0);
                        },
                        HZGangCard: function(eD) {
                            //this.visible = curPlayerIsMe_hongZi(0);
                        },
                        HZWeiCard: function(eD) {
                            //this.visible = curPlayerIsMe_hongZi(0);
                        },
                        MJPut: function(eD){
                            //this.visible = curPlayerIsMe_hongZi(0);
                        },
                        roundEnd: function(eD){
                            //this.visible = false;
                        }
                    },
                    time:{
                        _run: function() {
                            this.setString("00");
                        },
                        _event: {
                            initSceneData: function(eD) {
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_hongZi(0)){
                                    arrowbkNumberUpdate(this);
                                    this.setString("00");
                                }
                            },
                            mjhand: function(eD) {
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_hongZi(0)){
                                    arrowbkNumberUpdate(this);
                                }
                            },
                            MJPeng: function() {
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_hongZi(0)){
                                    arrowbkNumberUpdate(this);
                                }
                            },
                            HZNewCard: function(){
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_hongZi(0)){
                                    arrowbkNumberUpdate(this);
                                }
                            },
                            HZGangCard: function(){
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_hongZi(0)){
                                    arrowbkNumberUpdate(this);
                                }
                            },
                            HZChiCard: function() {
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_hongZi(0)){
                                    arrowbkNumberUpdate(this);
                                }
                            },
                            HZWeiCard: function(){
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_hongZi(0)){
                                    arrowbkNumberUpdate(this);
                                }
                            },
                            MJPut: function(msg) {
                                if (curPlayerIsMe_hongZi(0)) {
                                    this.stopAllActions();
                                    stopEffect(playTimeUpEff);
                                    playTimeUpEff = null;
                                    this.setString("00");
                                }
                            },
                            onlinePlayer: function(){
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                var pl = getUIPlayer_hongZi(0);
                                if(pl && pl.onLine && curPlayerIsMe_hongZi(0)){
                                    arrowbkNumberUpdate(this);
                                }
                            },
                            roundEnd: function() {
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                            }
                        }
                    }
                },
                skipHuIconTag: {
                    _visible:false,
                    _event: {
                        clearCardUI: function(eD) {
                            this.visible = false;
                        },
                        initSceneData:function(eD)
                        {
                            var pl = getUIPlayer_hongZi(0);
                            //cc.log("====================initSceneData=============== pl.isQiHu = " + pl.isQiHu);
                            if (pl && pl.isQiHu) {
                                this.visible = true;
                            }
                        }
                    }
                },
            },
            play_tips: {
                _layout: [[0.2, 0.2], [0.5, 0.45], [0, 0.5]],
                _run: function () {
                    this.zIndex = actionZindex;
                },
                _visible:false,
            },
            tai_layout:{
                _layout: [[0.018, 0.018],[0, 0],[0, 0.2]],
                tai_info:{
                    _visible:true,
                    _run: function () {
                        this.setString("");
                    }
                },
            },
            ready: {
                _layout: [[0.07, 0.07],[0.5, 0.5],[-2.5, -2.5]],
                _run: function() {
                    GetReadyVisible_hongZi(this, 0);
                },
                _event: {
                    startShuffleCards:function () {
                        GetReadyVisible_hongZi(this, -1);
                    },
                    moveHead: function() {
                        GetReadyVisible_hongZi(this, -1);
                    },
                    addPlayer: function() {
                        GetReadyVisible_hongZi(this, 0);//根据状态设置ready 是否可见 add by sking
                    },
                    removePlayer: function() {
                        GetReadyVisible_hongZi(this, 0);
                    },
                    onlinePlayer: function() {
                        GetReadyVisible_hongZi(this, 0);
                    }
                }
            },
            handNode: {
                _visible: false,
                _event:  {
                    initSceneData: function() {
                        calculateHintPutList_hongZi();
                    },
                    HZPickCard: function() {
                        calculateHintPutList_hongZi();
                    },
                    HZAddCards: function() {
                        calculateHintPutList_hongZi();
                    },
                    HZChiCard: function() {
                        calculateHintPutList_hongZi();
                    },
                    MJPeng: function() {
                        calculateHintPutList_hongZi();
                    },
                    MJPut: function() {
                        calculateHintPutList_hongZi();
                    },
                    HZWeiCard: function() {
                        calculateHintPutList_hongZi();
                    },
                    HZGangCard: function() {
                        calculateHintPutList_hongZi();
                    },
                    MJPass: function() { // 天胡 提 偎 跑后过胡
                        calculateHintPutList_hongZi();
                        addTingSign_hongZi(MjClient.playui._downNode);
                    },
                    HZCheckRaise: function() {
                        calculateHintPutList_hongZi();
                        addTingSign_hongZi(MjClient.playui._downNode);
                    }
                }
            },
            replayNode:{
                _visible:true,
                _layout:[[0.1, 0.1], [0.15, 0.05], [0, 0]]
            },
            eatNode: {
                _visible: true,
                _layout : [[0.14, 0.14], [0.005, 0.23], [0, 0]],
                _run:function(){
                    if(isIPhoneX()){
                        setWgtLayout(this, [0.14, 0.14], [0.045, 0.23], [0, 0]);
                    }
                }
            },
            outNode: {
                _visible: true,
                _layout : [[0.14, 0.14], [0.7, 0.5], [0, 0]]
            },
            handCard: {
                _run:function () {
                    this.ignoreContentAdaptWithSize(true); 
                    ziPai.setWgtLayoutHandCard(this);
                    
                    var changeCardSize = ziPai.getCardSize() == 0 ? 1 : 0.8;// 手牌大小修改
                    if(ziPai.getZiPaiType() == 0){
                        setWgtLayout(this, [98/1280 * changeCardSize, 0],[0.27,0.75],[0,0]);  
                    }else if (ziPai.getZiPaiType() == 1){
                        setWgtLayout(this, [95/1280 * changeCardSize, 0],[0.27,0.75],[0,0]);
                    }else{
                        setWgtLayout(this, [100/1280 * changeCardSize, 0],[0.27,0.75],[0,0]);
                    }   
                },
                _visible: false,
                _event:{
                    changeMJBgEvent: function() {
                       ziPai.setWgtLayoutHandCard(this);
                        var changeCardSize = ziPai.getCardSize() == 0 ? 1 : 0.8;// 手牌大小修改
                        if(ziPai.getZiPaiType() == 0){
                            setWgtLayout(this, [98/1280 * changeCardSize, 0],[0.27,0.75],[0,0]);  
                        }else if (ziPai.getZiPaiType() == 1){
                            setWgtLayout(this, [95/1280 * changeCardSize, 0],[0.27,0.75],[0,0]);

                        }else{
                            setWgtLayout(this, [100/1280 * changeCardSize, 0],[0.27,0.75],[0,0]);
                        }  
                        MjClient.playui.ResetHandCard(MjClient.playui._downNode,0,false,true);
                    }
                }
            },
            put: {
                _visible: false,
                //_layout : [[0.35, 0.35], [0.5, 0.6], [0, 0]],
                _run:function()
                {
                    setWgtLayout(this, [0.35, 0.35], [0.5, 0.6], [0, 0]);
                    var userData = {scale:this.getScale(), pos:this.getPosition()};
                    this.setUserData(userData);
                },

                _event:{
                    MJPut: function(eD) {
                        this.loadTexture("playing/paohuzi/chupai_bj.png");
                    },
                    HZNewCard: function(eD){
                        this.loadTexture("playing/paohuzi/mopai_bj.png");
                    }
                }
            },
            xingPai: {
                _visible: false,
                _run:function()
                {
                    setWgtLayout(this, [0.35, 0.35], [0.5, 0.6], [0, 0]);
                    var userData = {scale:this.getScale(), pos:this.getPosition()};
                    this.setUserData(userData);
                }
            },
            out0: {
                _visible: false
            },
            _event: {
                clearCardUI: function() {
                    clearCardUI_hongZi(this, 0);
                },
                clearCardArr: function(){
                    var handNode = this.getChildByName("handNode");
                    handNode.removeAllChildren();
                    var eatNode = this.getChildByName("eatNode");
                    eatNode.removeAllChildren();
                    var outNode = this.getChildByName("outNode");
                    outNode.removeAllChildren();
                    var putNode = this.getChildByName("xingPai");
                    putNode.removeAllChildren();
                    putNode.setVisible(false);
                    RemovePutCardOut_hongZi(true);
                },
                initSceneData: function(eD) {
                    SetUserVisible_hongzi(this, 0);
                    InitUserHandUI_hongzi(this, 0);
                    InitUserCoinAndName_hongZi(this, 0);
                    MjClient.hasPut = false; // 重连回来重置打掉牌标志（打牌时候断线)
                    ShowPutCardIcon_hongZi();
                    DealOffLineCard_hongZi(this,0);
                },
                addPlayer: function(eD) {
                    SetUserVisible_hongzi(this, 0);
                    InitUserCoinAndName_hongZi(this, 0);
                },
                removePlayer: function(eD) {
                    SetUserVisible_hongzi(this, 0);
                    InitUserCoinAndName_hongZi(this, 0);
                },
                mjhand: function(eD) {
                    InitUserHandUI_hongzi(this, 0);
                    InitUserCoinAndName_hongZi(this, 0);

                    var uid = getUIPlayer_hongZi(0).info.uid;
                    if (eD.jiazhuNums)
                    {
                        for (var key in eD.jiazhuNums)
                        {
                            if (key != uid && eD.jiazhuNums[key] == 2)
                                MjClient.playui._jiazhuWait.visible = true;
                        }
                    }
                    if(MjClient.playui.playuiNode.cutCardView){
                        MjClient.playui.playuiNode.cutCardView.cutCardsEffect(this);
                    }
                },
                roundEnd: function() {
                    InitUserCoinAndName_hongZi(this, 0);
                },
                HZNewCard: function(eD) {
                    if (typeof(eD) == "number") {
                        eD = {newCard: eD};
                    }
                    DealNewCard_hongZi(this,eD,0);
                },
                MJPut: function(eD) {
                    DealPutCard_hongZi(this,eD,0);
                },
                HZChiCard: function(eD) {
                    DealChiCard_hongZi(this, eD, 0);
                    ShowPutCardIcon_hongZi();
                },
                HZWeiCard: function(eD){
                    DealWeiCard_hongZi(this,eD,0);
                },
                HZGangCard: function(eD) {
                    DealGangCard_hongZi(this, eD, 0);
                },
                MJPeng: function(eD) {
                    DealPengCard_hongZi(this, eD, 0);
                    ShowPutCardIcon_hongZi();
                },
                MJHu: function(eD) {
                    DealHu_hongZi(this, eD, 0);
                },
                onlinePlayer: function(eD) {
                    resetHandAfterBegin_hongZi();
                    setUserOffline_hongZi(this, 0);
                },
                playerStatusChange: function(eD) {
                    setUserOffline_hongZi(this, 0);
                },
                MJFlower: function(eD) {
                    HandleMJFlower(this, eD, 0);
                },
                MJTing: function (eD) {
                    HandleMJTing(this, eD, 0);
                },
                MJJiazhu: function(msg) {
                    ShowPutCardIcon_hongZi();
                    MjClient.playui.EatVisibleCheck();
                    MjClient.playui._jiazhuWait.visible = false;
                    MjClient.playui.resetJiaZhuTip();
                    MjClient.majiang.setJiaZhuNum(MjClient.playui._downNode, getUIPlayer_hongZi(0));
                    MjClient.majiang.setJiaZhuNum(MjClient.playui._rightNode, getUIPlayer_hongZi(1));
                    MjClient.majiang.setJiaZhuNum(MjClient.playui._topNode, getUIPlayer_hongZi(2));
                },
                HZPickCard:function (eD) {
                    var pl = getUIPlayer_hongZi(0);
                    if(eD.uid == pl.info.uid) {
                        MjClient.HandCardArr = MjClient.majiang.sortCard(pl.mjhand)
                    }
                    RemovePutCardOut_hongZi(true);
                    MjClient.playui.ResetHandCard(this,0);

                    ShowPutCardIcon_hongZi();
                },
                HZAddCards:function (eD) {
                    DealAddCard_hongZi(this,eD, 0);
                },
                HZCheckRaise:function (msg) {
                    ShowPutCardIcon_hongZi();
                    MjClient.playui.EatVisibleCheck();

                    var tData = MjClient.data.sData.tData;
                    var pl = getUIPlayer_hongZi(0);
                    if(!pl){
                        return;
                    }
                    if (pl.jiazhuNum == 2 && MjClient.rePlayVideo == -1)
                    {
                        if (SelfUid() == pl.info.uid) {
                            var layer = new laZhangLayer();
                            MjClient.playui.addChild(layer, 99);
                            if (MjClient.webViewLayer != null) {
                                MjClient.webViewLayer.close();
                            }
                        }
                        else
                        {
                            MjClient.playui._jiazhuWait.visible = true;
                        }
                    }else if(pl.jiazhuNum == 1){
                        MjClient.majiang.setJiaZhuNum(node, getUIPlayer_hongZi(off));
                    }
                },
            }
        },
        xing: {
            _run:function () {
                if(MjClient.MaxPlayerNum_hongZi == 3 || MjClient.MaxPlayerNum_hongZi == 2){
                    this.setVisible(false);
                }
            },
            head: {
                zhuang: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        waitPut: function() {
                            if(MjClient.MaxPlayerNum_hongZi == 4) {
                                showUserZhuangLogo_hongZi(this, 1);
                            }
                        },
                        initSceneData: function() {
                            if(MjClient.MaxPlayerNum_hongZi == 4) {
                                if (IsArrowVisible_hongZi()) showUserZhuangLogo_hongZi(this, 1);
                            }
                        },
                        mjhand: function(){
                            if(MjClient.MaxPlayerNum_hongZi == 4) {
                                if (IsArrowVisible_hongZi()) showUserZhuangLogo_hongZi(this, 1);
                            }
                        }
                    }
                },
                chatbg: {
                    _run: function() {
                        this.getParent().zIndex = 500;
                    },
                    chattext: {
                        _event: {
                            MJChat: function(msg) {
                                if(MjClient.MaxPlayerNum_hongZi == 4) {
                                    showUserChat_hongZi(this, 1, msg);
                                }
                            },
                            playVoice: function(voicePath) {
                                if(MjClient.MaxPlayerNum_hongZi == 4) {
                                    MjClient.data._tempMessage.msg = voicePath;
                                    showUserChat_hongZi(this, 1, MjClient.data._tempMessage);
                                }
                            }
                        }
                    }
                },
                _click: function(btn) {
                    if(MjClient.MaxPlayerNum_hongZi == 4) {
                        showPlayerInfo_hongZi(1, btn);
                    }
                },
                _event: {
                    loadWxHead: function(d) {
                        if(MjClient.MaxPlayerNum_hongZi == 4) {
                            setWxHead_hongZi(this, d, 1);
                        }
                    },
                    addPlayer: function(eD) {
                        if(MjClient.MaxPlayerNum_hongZi == 4) {
                            showFangzhuTagIcon_hongZi(this, 1);
                        }
                    },
                    removePlayer: function(eD) {
                        if(MjClient.MaxPlayerNum_hongZi == 4) {
                            showFangzhuTagIcon_hongZi(this, 1);
                        }
                    }
                },
                _run: function () {
                    if(MjClient.MaxPlayerNum_hongZi == 4) {
                        showFangzhuTagIcon_hongZi(this, 1);
                    }
                },
                score_bg:{_visible:false},
                huxi:{
                    _visible: false,
                    _event:{
                        clearCardUI: function(){
                            if(MjClient.MaxPlayerNum_hongZi == 4) {
                                this.setVisible(false);
                                return this.setString("胡息:0");
                            }
                        },
                        addPlayer: function(){
                            if(MjClient.MaxPlayerNum_hongZi == 4) {
                                return this.setString("胡息:0");
                            }
                        },
                        removePlayer: function(){
                            if(MjClient.MaxPlayerNum_hongZi == 4) {
                                this.visible = false;
                            }
                        },
                        initSceneData:function(){
                            if(MjClient.MaxPlayerNum_hongZi == 4) {
                                // this.visible = true;
                                var huXi = UpdateHuXi_hongZi(1);
                                if (!IsArrowVisible_hongZi()) {
                                    huXi = 0;
                                }
                                return this.setString("胡息:" + huXi);
                            }
                        },
                        mjhand:function(){
                            if(MjClient.MaxPlayerNum_hongZi == 4) {
                                // this.visible = true;
                            }
                        },
                        HZChiCard:function(){
                            if(MjClient.MaxPlayerNum_hongZi == 4) {
                                var huXi = UpdateHuXi_hongZi(1);
                                return this.setString("胡息:" + huXi);
                            }
                        },
                        MJPeng:function(){
                            if(MjClient.MaxPlayerNum_hongZi == 4) {
                                var huXi = UpdateHuXi_hongZi(1);
                                return this.setString("胡息:" + huXi);
                            }
                        },
                        HZGangCard:function(){
                            if(MjClient.MaxPlayerNum_hongZi == 4) {
                                var huXi = UpdateHuXi_hongZi(1);
                                return this.setString("胡息:" + huXi);
                            }
                        },
                        HZWeiCard:function(){
                            if(MjClient.MaxPlayerNum_hongZi == 4) {
                                var huXi = UpdateHuXi_hongZi(1);
                                return this.setString("胡息:" + huXi);
                            }
                        }
                    }
                },
                name_bg:{_visible:false},
                timeImg:{
                    _visible:false,
                    _event:{
                        initSceneData: function(eD) {
                            if(MjClient.MaxPlayerNum_hongZi == 4) {
                                //this.visible = curPlayerIsMe_hongZi(1);
                            }
                            // MjClient.playui.refreshHeadLight(true);
                        },
                        onlinePlayer: function(eD) {
                            if(MjClient.MaxPlayerNum_hongZi == 4) {
                                //this.visible = curPlayerIsMe_hongZi(1) && IsArrowVisible_hongZi();
                            }
                        },
                        waitPut: function(eD) {
                            if(MjClient.MaxPlayerNum_hongZi == 4) {
                                //this.visible = curPlayerIsMe_hongZi(1);
                            }
                            // MjClient.playui.refreshHeadLight(true);
                        },
                        HZNewCard: function(ed){
                            if(MjClient.MaxPlayerNum_hongZi == 4) {
                                //this.visible = curPlayerIsMe_hongZi(1);
                            }
                            // MjClient.playui.refreshHeadLight(true);
                        },
                        MJPeng: function(eD) {
                            if(MjClient.MaxPlayerNum_hongZi == 4) {
                                //this.visible = curPlayerIsMe_hongZi(1);
                            }
                            // MjClient.playui.refreshHeadLight(true);
                        },
                        HZChiCard: function(eD) {
                            if(MjClient.MaxPlayerNum_hongZi == 4) {
                                //this.visible = curPlayerIsMe_hongZi(1);
                            }
                            // MjClient.playui.refreshHeadLight(true);
                        },
                        HZGangCard: function(eD) {
                            if(MjClient.MaxPlayerNum_hongZi == 4) {
                                //this.visible = curPlayerIsMe_hongZi(1);
                            }
                            // MjClient.playui.refreshHeadLight(true);
                        },
                        HZWeiCard: function(eD) {
                            if(MjClient.MaxPlayerNum_hongZi == 4) {
                                //this.visible = curPlayerIsMe_hongZi(1);
                            }
                            // MjClient.playui.refreshHeadLight(true);
                        },
                        MJPut: function(eD){
                            if(MjClient.MaxPlayerNum_hongZi == 4) {
                                //this.visible = curPlayerIsMe_hongZi(1);
                            }
                            // MjClient.playui.refreshHeadLight(true);
                        },
                        roundEnd: function(eD){
                            if(MjClient.MaxPlayerNum_hongZi == 4) {
                                //this.visible = false;
                            }
                            // MjClient.playui.refreshHeadLight(false);
                        }
                    },
                    time:{
                        _run: function() {
                            this.setString("00");
                        },
                        _event: {
                            initSceneData: function(eD) {
                                if(MjClient.MaxPlayerNum_hongZi == 4) {
                                    this.stopAllActions();
                                    stopEffect(playTimeUpEff);
                                    playTimeUpEff = null;
                                    if (curPlayerIsMe_hongZi(1)) {
                                        arrowbkNumberUpdate(this);
                                        this.setString("00");
                                    }
                                }
                            },
                            mjhand: function(eD) {
                                if(MjClient.MaxPlayerNum_hongZi == 4) {
                                    this.stopAllActions();
                                    stopEffect(playTimeUpEff);
                                    playTimeUpEff = null;
                                    if (curPlayerIsMe_hongZi(1)) {
                                        arrowbkNumberUpdate(this);
                                    }
                                }
                            },
                            MJPeng: function() {
                                if(MjClient.MaxPlayerNum_hongZi == 4) {
                                    this.stopAllActions();
                                    stopEffect(playTimeUpEff);
                                    playTimeUpEff = null;
                                    if (curPlayerIsMe_hongZi(1)) {
                                        arrowbkNumberUpdate(this);
                                    }
                                }
                            },
                            HZNewCard: function(){
                                if(MjClient.MaxPlayerNum_hongZi == 4) {
                                    this.stopAllActions();
                                    stopEffect(playTimeUpEff);
                                    playTimeUpEff = null;
                                    if (curPlayerIsMe_hongZi(1)) {
                                        arrowbkNumberUpdate(this);
                                    }
                                }
                            },
                            HZGangCard: function(){
                                if(MjClient.MaxPlayerNum_hongZi == 4) {
                                    this.stopAllActions();
                                    stopEffect(playTimeUpEff);
                                    playTimeUpEff = null;
                                    if (curPlayerIsMe_hongZi(1)) {
                                        arrowbkNumberUpdate(this);
                                    }
                                }
                            },
                            HZChiCard: function() {
                                if(MjClient.MaxPlayerNum_hongZi == 4) {
                                    this.stopAllActions();
                                    stopEffect(playTimeUpEff);
                                    playTimeUpEff = null;
                                    if (curPlayerIsMe_hongZi(1)) {
                                        arrowbkNumberUpdate(this);
                                    }
                                }
                            },
                            HZWeiCard: function(){
                                if(MjClient.MaxPlayerNum_hongZi == 4) {
                                    this.stopAllActions();
                                    stopEffect(playTimeUpEff);
                                    playTimeUpEff = null;
                                    if (curPlayerIsMe_hongZi(1)) {
                                        arrowbkNumberUpdate(this);
                                    }
                                }
                            },
                            MJPut: function(msg) {
                                if(MjClient.MaxPlayerNum_hongZi == 4) {
                                    if (curPlayerIsMe_hongZi(1)) {
                                        this.stopAllActions();
                                        stopEffect(playTimeUpEff);
                                        playTimeUpEff = null;
                                        this.setString("00");
                                    }
                                }
                            },
                            onlinePlayer: function(){
                                if(MjClient.MaxPlayerNum_hongZi == 4) {
                                    this.stopAllActions();
                                    stopEffect(playTimeUpEff);
                                    playTimeUpEff = null;
                                    var pl = getUIPlayer_hongZi(1);
                                    if (pl && pl.onLine && curPlayerIsMe_hongZi(1)) {
                                        arrowbkNumberUpdate(this);
                                    }
                                }
                            },
                            roundEnd: function() {
                                if(MjClient.MaxPlayerNum_hongZi == 4) {
                                    this.stopAllActions();
                                    stopEffect(playTimeUpEff);
                                    playTimeUpEff = null;
                                }
                            }
                        }
                    }
                }
            },
            play_tips: {
                _layout: [[0.2, 0.2], [0.8, 0.25], [0, 0.5]],
                _run: function () {
                    this.zIndex = actionZindex;
                },
                _visible:false,
            },
            ready: {
                _layout: [[0.07, 0.07],[0.5, 0.5],[2.5, -2.5]],
                _run: function() {
                    if(MjClient.MaxPlayerNum_hongZi == 4) {
                        GetReadyVisible_hongZi(this, 1);
                    }
                },
                _event: {
                    startShuffleCards:function () {
                        if(MjClient.MaxPlayerNum_hongZi == 4) {
                            GetReadyVisible_hongZi(this, -1);
                        }
                    },
                    moveHead: function() {
                        if(MjClient.MaxPlayerNum_hongZi == 4) {
                            GetReadyVisible_hongZi(this, -1);
                        }
                    },
                    addPlayer: function() {
                        if(MjClient.MaxPlayerNum_hongZi == 4) {
                            GetReadyVisible_hongZi(this, 1);
                        }
                    },
                    removePlayer: function() {
                        if(MjClient.MaxPlayerNum_hongZi == 4) {
                            GetReadyVisible_hongZi(this, 1);
                        }
                    },
                    onlinePlayer: function() {
                        if(MjClient.MaxPlayerNum_hongZi == 4) {
                            GetReadyVisible_hongZi(this, 1);
                        }
                    }
                }
            },
            replayNode:{
                _visible: true,
                _layout:[[0.1, 0.1], [0.85, 0.05], [0, 0]]
            },
            eatNode: {
                _visible: true,
                _layout : [[0.14, 0.14], [1-0.005, 0.23], [0, 0]]
            },
            outNode: {
                _visible: true,
                _layout : [[0.14, 0.14], [1-0.005, 0.15], [0, 0]]
            },
            put: {
                _visible: false,
                //_layout : [[0.35, 0.35],[0.73, 0.6],[0, 0]],
                _run:function()
                {
                    setWgtLayout(this, [0.35, 0.35],[0.73, 0.6],[0, 0]);
                    var userData = {scale:this.getScale(), pos:this.getPosition()};
                    this.setUserData(userData);
                },

                _event:{
                    MJPut: function(eD) {
                        this.loadTexture("playing/paohuzi/chupai_bj.png");
                    },
                    HZNewCard: function(eD){
                        this.loadTexture("playing/paohuzi/mopai_bj.png");
                    }
                }
            },
            out0: {
                _visible: false
            },
            _event: {
                clearCardUI: function() {
                    if(MjClient.MaxPlayerNum_hongZi == 4) {
                        clearCardUI_hongZi(this, 1);
                    }
                },
                clearCardArr: function(){
                    if(MjClient.MaxPlayerNum_hongZi == 4) {
                        var eatNode = this.getChildByName("eatNode");
                        eatNode.removeAllChildren();
                        var outNode = this.getChildByName("outNode");
                        outNode.removeAllChildren();
                        RemovePutCardOut_hongZi(true);
                    }
                },
                initSceneData: function(eD) {
                    if(MjClient.MaxPlayerNum_hongZi == 4) {
                        SetUserVisible_hongzi(this, 1);
                        InitUserHandUI_hongzi(this, 1);
                        InitUserCoinAndName_hongZi(this, 1);
                        DealOffLineCard_hongZi(this, 1);
                    }
                },
                addPlayer: function(eD) {
                    if(MjClient.MaxPlayerNum_hongZi == 4) {
                        SetUserVisible_hongzi(this, 1);
                        InitUserCoinAndName_hongZi(this, 1);
                    }
                },
                removePlayer: function(eD) {
                    if(MjClient.MaxPlayerNum_hongZi == 4) {
                        SetUserVisible_hongzi(this, 1);
                        InitUserCoinAndName_hongZi(this, 1);
                    }
                },
                mjhand: function(eD) {
                    if(MjClient.MaxPlayerNum_hongZi == 4) {
                        InitUserHandUI_hongzi(this, 1);
                        InitUserCoinAndName_hongZi(this, 1);
                    }
                },
                HZNewCard: function(eD) {
                    if(MjClient.MaxPlayerNum_hongZi == 4) {
                        if (typeof(eD) == "number") {
                            eD = {newCard: eD};
                        }
                        DealNewCard_hongZi(this, eD, 1);
                    }
                },
                roundEnd: function() {
                    if(MjClient.MaxPlayerNum_hongZi == 4) {
                        InitUserCoinAndName_hongZi(this, 1);
                        MjClient.playui.ResetOtherCard(this, 1);
                    }
                },
                waitPut: function(eD) {
                    if(MjClient.MaxPlayerNum_hongZi == 4) {
                        DealWaitPut(this, eD, 1);
                    }
                },
                MJPut: function(eD) {
                    if(MjClient.MaxPlayerNum_hongZi == 4) {
                        DealPutCard_hongZi(this, eD, 1);
                    }
                },
                HZChiCard: function(eD) {
                    if(MjClient.MaxPlayerNum_hongZi == 4) {
                        DealChiCard_hongZi(this, eD, 1);
                    }
                },
                HZGangCard: function(eD) {
                    if(MjClient.MaxPlayerNum_hongZi == 4) {
                        DealGangCard_hongZi(this, eD, 1);
                    }
                },
                MJPeng: function(eD) {
                    if(MjClient.MaxPlayerNum_hongZi == 4) {
                        DealPengCard_hongZi(this, eD, 1);
                    }
                },
                HZWeiCard: function(eD){
                    if(MjClient.MaxPlayerNum_hongZi == 4) {
                        DealWeiCard_hongZi(this, eD, 1);
                    }
                },
                MJHu: function(eD) {
                    if(MjClient.MaxPlayerNum_hongZi == 4) {
                        DealHu_hongZi(this, eD, 1);
                    }
                },
                onlinePlayer: function(eD) {
                    if(MjClient.MaxPlayerNum_hongZi == 4) {
                        setUserOffline_hongZi(this, 1);
                    }
                },
                playerStatusChange: function(eD) {
                    if(MjClient.MaxPlayerNum_hongZi == 4) {
                        setUserOffline_hongZi(this, 1);
                    }
                },
                MJFlower: function(eD) {
                    if(MjClient.MaxPlayerNum_hongZi == 4) {
                        HandleMJFlower(this, eD, 1);
                    }
                },
                MJTing: function (eD) {
                    if(MjClient.MaxPlayerNum_hongZi == 4) {
                        HandleMJTing(this, eD, 1);
                    }
                },
                waitJiazhu:function (msg) {
                    if(MjClient.MaxPlayerNum_hongZi == 4) {
                        postEvent("returnPlayerLayer");
                        /*
                         弹窗加注
                         */
                        var layer = new jiaZhuXuzhouLayer(function () {
                            //弹窗等待
                            MjClient.playui._jiazhuWait.visible = true;
                        });
                        MjClient.playui.addChild(layer, 99);
                        if (MjClient.webViewLayer != null) {
                            MjClient.webViewLayer.close();
                        }
                    }
                },
                HZPickCard:function (eD) {
                    if(MjClient.MaxPlayerNum_hongZi == 4) {
                        if (MjClient.rePlayVideo != -1) {
                            var pl = getUIPlayer_hongZi(1);
                            if (eD.uid == pl.info.uid) {
                                MjClient.OtherHandArr[1] = MjClient.majiang.sortCard(pl.mjhand)
                            }
                        }

                        RemovePutCardOut_hongZi(true);
                        MjClient.playui.ResetHandCard(this, 1);
                    }
                },
                HZAddCards:function (eD) {
                    if(MjClient.MaxPlayerNum_hongZi == 4) {
                        DealAddCard_hongZi(this, eD, 1);
                    }
                },
                HZCheckRaise:function (msg) {
                    if(MjClient.MaxPlayerNum_hongZi == 4) {
                        ShowPutCardIcon_hongZi();
                        //MjClient.playui.EatVisibleCheck();

                        var tData = MjClient.data.sData.tData;
                        var pl = getUIPlayer_hongZi(1);
                        if (!pl) {
                            return;
                        }
                        if (pl.jiazhuNum == 2 && MjClient.rePlayVideo == -1) {
                            if (SelfUid() == pl.info.uid) {
                                var layer = new laZhangLayer();
                                MjClient.playui.addChild(layer, 99);
                                if (MjClient.webViewLayer != null) {
                                    MjClient.webViewLayer.close();
                                }
                            }
                            else {
                                MjClient.playui._jiazhuWait.visible = true;
                            }
                        } else if (pl.jiazhuNum == 1) {
                            MjClient.majiang.setJiaZhuNum(node, getUIPlayer_hongZi(off));
                        }
                    }
                }
            }
        },
        right: {
            _run:function(){
                if(MjClient.MaxPlayerNum_hongZi == 2)
                    this.setVisible(false);
            },
            head: {
                zhuang: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        waitPut: function() {
                            showUserZhuangLogo_hongZi(this,  MjClient.playui.rightMaxPlayerNum());
                        },
                        initSceneData: function() {
                            if (IsArrowVisible_hongZi()) showUserZhuangLogo_hongZi(this,  MjClient.playui.rightMaxPlayerNum());
                        },
                        mjhand: function(){
                            if (IsArrowVisible_hongZi()) showUserZhuangLogo_hongZi(this,  MjClient.playui.rightMaxPlayerNum());
                        }
                    }
                },
                chatbg: {
                    _run: function() {
                        this.getParent().zIndex = 500;
                    },
                    chattext: {
                        _event: {
                            MJChat: function(msg) {
                                showUserChat_hongZi(this,  MjClient.playui.rightMaxPlayerNum(), msg);
                            },
                            playVoice: function(voicePath) {
                                MjClient.data._tempMessage.msg = voicePath;
                                showUserChat_hongZi(this,  MjClient.playui.rightMaxPlayerNum(), MjClient.data._tempMessage);
                            }
                        }
                    }
                },
                _click: function(btn) {
                    showPlayerInfo_hongZi( MjClient.playui.rightMaxPlayerNum(), btn);
                },
                _event: {
                    loadWxHead: function(d) {
                        setWxHead_hongZi(this, d,  MjClient.playui.rightMaxPlayerNum());
                    },
                    addPlayer: function(eD) {
                        showFangzhuTagIcon_hongZi(this, MjClient.playui.rightMaxPlayerNum());
                    },
                    removePlayer: function(eD) {
                        showFangzhuTagIcon_hongZi(this, MjClient.playui.rightMaxPlayerNum());
                    }
                },
                _run: function () {
                    showFangzhuTagIcon_hongZi(this, MjClient.playui.rightMaxPlayerNum());
                },
                score_bg:{_visible:false},
                huxi:{
                    _visible: false,
                    _event:{
                        clearCardUI: function(){
                            this.setVisible(false);
                            return this.setString("胡息:0");
                        },
                        addPlayer: function(){
                            return this.setString("胡息:0");
                        },
                        removePlayer: function(){
                            this.visible = false;
                        },
                        initSceneData:function(){
                            // this.visible = true;
                            var huXi = UpdateHuXi_hongZi( MjClient.playui.rightMaxPlayerNum());
                            if(!IsArrowVisible_hongZi()){
                                huXi = 0;
                            }
                            return this.setString("胡息:" + huXi);
                        },
                        mjhand:function(){
                            // this.visible = true;
                        },
                        HZChiCard:function(){
                            var huXi = UpdateHuXi_hongZi( MjClient.playui.rightMaxPlayerNum());
                            return this.setString("胡息:" + huXi);
                        },
                        MJPeng:function(){
                            var huXi = UpdateHuXi_hongZi( MjClient.playui.rightMaxPlayerNum());
                            return this.setString("胡息:" + huXi);
                        },
                        HZGangCard:function(){
                            var huXi = UpdateHuXi_hongZi( MjClient.playui.rightMaxPlayerNum());
                            return this.setString("胡息:" + huXi);
                        },
                        HZWeiCard:function(){
                            var huXi = UpdateHuXi_hongZi( MjClient.playui.rightMaxPlayerNum());
                            return this.setString("胡息:" + huXi);
                        }
                    }
                },
                jiaZhu: {
                   _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        clearCardUI: function(eD) {
                            this.visible = false;
                        }
                    }
                },
                jiaZhuTip: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        clearCardUI: function(eD) {
                            this.visible = false;
                        }
                    }
                },
                name_bg:{_visible:false},
                timeImg:{
                    _visible:false,
                    _event:{
                        initSceneData: function(eD) {
                            //this.visible = curPlayerIsMe_hongZi( MjClient.playui.rightMaxPlayerNum());
                        },
                        onlinePlayer: function(eD) {
                            //this.visible = curPlayerIsMe_hongZi( MjClient.playui.rightMaxPlayerNum()) && IsArrowVisible_hongZi();
                        },
                        waitPut: function(eD) {
                            //this.visible = curPlayerIsMe_hongZi( MjClient.playui.rightMaxPlayerNum());
                        },
                        HZNewCard: function(ed){
                            //this.visible = curPlayerIsMe_hongZi( MjClient.playui.rightMaxPlayerNum());
                        },
                        MJPeng: function(eD) {
                            //this.visible = curPlayerIsMe_hongZi( MjClient.playui.rightMaxPlayerNum());
                        },
                        HZChiCard: function(eD) {
                            //this.visible = curPlayerIsMe_hongZi( MjClient.playui.rightMaxPlayerNum());
                        },
                        HZGangCard: function(eD) {
                            //this.visible = curPlayerIsMe_hongZi( MjClient.playui.rightMaxPlayerNum());
                        },
                        HZWeiCard: function(eD) {
                            //this.visible = curPlayerIsMe_hongZi( MjClient.playui.rightMaxPlayerNum());
                        },
                        MJPut: function(eD){
                            //this.visible = curPlayerIsMe_hongZi( MjClient.playui.rightMaxPlayerNum());
                        },
                        roundEnd: function(eD){
                            //this.visible = false;
                        }
                    },
                    time:{
                        _run: function() {
                            this.setString("00");
                        },
                        _event: {
                            initSceneData: function(eD) {
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_hongZi( MjClient.playui.rightMaxPlayerNum())){
                                    arrowbkNumberUpdate(this);
                                    this.setString("00");
                                }
                            },
                            mjhand: function(eD) {
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_hongZi( MjClient.playui.rightMaxPlayerNum())){
                                    arrowbkNumberUpdate(this);
                                }
                            },
                            MJPeng: function() {
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_hongZi( MjClient.playui.rightMaxPlayerNum())){
                                    arrowbkNumberUpdate(this);
                                }
                            },
                            HZNewCard: function(){
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_hongZi( MjClient.playui.rightMaxPlayerNum())){
                                    arrowbkNumberUpdate(this);
                                }
                            },
                            HZGangCard: function(){
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_hongZi( MjClient.playui.rightMaxPlayerNum())){
                                    arrowbkNumberUpdate(this);
                                }
                            },
                            HZChiCard: function() {
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_hongZi( MjClient.playui.rightMaxPlayerNum())){
                                    arrowbkNumberUpdate(this);
                                }
                            },
                            HZWeiCard: function(){
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_hongZi( MjClient.playui.rightMaxPlayerNum())){
                                    arrowbkNumberUpdate(this);
                                }
                            },
                            MJPut: function(msg) {
                                if (curPlayerIsMe_hongZi( MjClient.playui.rightMaxPlayerNum())) {
                                    this.stopAllActions();
                                    stopEffect(playTimeUpEff);
                                    playTimeUpEff = null;
                                    this.setString("00");
                                }
                            },
                            onlinePlayer: function(){
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                var pl = getUIPlayer_hongZi( MjClient.playui.rightMaxPlayerNum());
                                if(pl && pl.onLine && curPlayerIsMe_hongZi( MjClient.playui.rightMaxPlayerNum())){
                                    arrowbkNumberUpdate(this);
                                }
                            },
                            roundEnd: function() {
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                            }
                        }
                    }
                }
            },
            play_tips: {
                _layout: [[0.2, 0.2], [0.8, 0.7], [0, 0.5]],
                _run: function () {
                    this.zIndex = actionZindex;
                },
                _visible:false,
            },
            ready: {
                _layout: [[0.07, 0.07],[0.5, 0.5],[2.5, 2.5]],
                _run: function() {
                    GetReadyVisible_hongZi(this,  MjClient.playui.rightMaxPlayerNum());
                },
                _event: {
                    startShuffleCards:function () {
                        GetReadyVisible_hongZi(this, -1);
                    },
                    moveHead: function() {
                        GetReadyVisible_hongZi(this, -1);
                    },
                    addPlayer: function() {
                        GetReadyVisible_hongZi(this,  MjClient.playui.rightMaxPlayerNum());
                    },
                    removePlayer: function() {
                        GetReadyVisible_hongZi(this,  MjClient.playui.rightMaxPlayerNum());
                    },
                    onlinePlayer: function() {
                        GetReadyVisible_hongZi(this,  MjClient.playui.rightMaxPlayerNum());
                    }
                }
            },
            replayNode:{
                _visible: true,
                _layout : [[0.1, 0.1], [0.85, 0.81], [0, 0]]
            },
            eatNode: {
                _visible: true,
                _layout : [[0.14, 0.14], [1-0.005, 0.76], [0, 0]]
            },
            outNode: {
                _visible: true,
                _layout : [[0.14, 0.14], [1-0.005, 0.835], [0, 0]]
            },
            put: {
                _visible: false,
                //_layout : [[0.35, 0.35],[0.73, 0.75],[0, 0]],
                _run:function()
                {
                    setWgtLayout(this, [0.35, 0.35],[0.73, 0.75],[0, 0]);
                    var userData = {scale:this.getScale(), pos:this.getPosition()};
                    this.setUserData(userData);
                },

                _event:{
                    MJPut: function(eD) {
                        this.loadTexture("playing/paohuzi/chupai_bj.png");
                    },
                    HZNewCard: function(eD){
                        this.loadTexture("playing/paohuzi/mopai_bj.png");
                    }
                }
            },
            out0: {
                _visible: false
            },
            _event: {
                clearCardUI: function() {
                    clearCardUI_hongZi(this,  MjClient.playui.rightMaxPlayerNum());
                },
                clearCardArr: function(){
                    var eatNode = this.getChildByName("eatNode");
                    eatNode.removeAllChildren();
                    var outNode = this.getChildByName("outNode");
                    outNode.removeAllChildren();
                    RemovePutCardOut_hongZi(true);
                },
                initSceneData: function(eD) {
                    SetUserVisible_hongzi(this,  MjClient.playui.rightMaxPlayerNum());
                    InitUserHandUI_hongzi(this,  MjClient.playui.rightMaxPlayerNum());
                    InitUserCoinAndName_hongZi(this,  MjClient.playui.rightMaxPlayerNum());
                    DealOffLineCard_hongZi(this, MjClient.playui.rightMaxPlayerNum());
                },
                addPlayer: function(eD) {
                    SetUserVisible_hongzi(this,  MjClient.playui.rightMaxPlayerNum());
                    InitUserCoinAndName_hongZi(this,  MjClient.playui.rightMaxPlayerNum());
                },
                removePlayer: function(eD) {
                    SetUserVisible_hongzi(this,  MjClient.playui.rightMaxPlayerNum());
                    InitUserCoinAndName_hongZi(this,  MjClient.playui.rightMaxPlayerNum());
                },
                mjhand: function(eD) {
                    InitUserHandUI_hongzi(this,  MjClient.playui.rightMaxPlayerNum());
                    InitUserCoinAndName_hongZi(this,  MjClient.playui.rightMaxPlayerNum());
                },
                HZNewCard: function(eD) {
                    if (typeof(eD) == "number") {
                        eD = {newCard: eD};
                    }
                    DealNewCard_hongZi(this,eD, MjClient.playui.rightMaxPlayerNum());
                },
                roundEnd: function() {
                    InitUserCoinAndName_hongZi(this,  MjClient.playui.rightMaxPlayerNum());
                    MjClient.playui.ResetOtherCard(this,  MjClient.playui.rightMaxPlayerNum());
                },
                waitPut: function(eD) {
                    DealWaitPut(this, eD,  MjClient.playui.rightMaxPlayerNum());
                },
                MJPut: function(eD) {
                    DealPutCard_hongZi(this, eD,  MjClient.playui.rightMaxPlayerNum());
                },
                HZChiCard: function(eD) {
                    DealChiCard_hongZi(this, eD,  MjClient.playui.rightMaxPlayerNum());
                },
                HZGangCard: function(eD) {
                    DealGangCard_hongZi(this, eD,  MjClient.playui.rightMaxPlayerNum());
                },
                MJPeng: function(eD) {
                    DealPengCard_hongZi(this, eD,  MjClient.playui.rightMaxPlayerNum());
                },
                HZWeiCard: function(eD){
                    DealWeiCard_hongZi(this, eD,  MjClient.playui.rightMaxPlayerNum());
                },
                MJHu: function(eD) {
                    DealHu_hongZi(this, eD,  MjClient.playui.rightMaxPlayerNum());
                },
                onlinePlayer: function(eD) {
                    setUserOffline_hongZi(this,  MjClient.playui.rightMaxPlayerNum());
                },
                playerStatusChange: function(eD) {
                    setUserOffline_hongZi(this,  MjClient.playui.rightMaxPlayerNum());
                },
                MJFlower: function(eD) {
                    HandleMJFlower(this, eD,  MjClient.playui.rightMaxPlayerNum());
                },
                MJTing: function (eD) {
                    HandleMJTing(this, eD,  MjClient.playui.rightMaxPlayerNum());
                },
                waitJiazhu:function (msg) {
                    postEvent("returnPlayerLayer");
                    /*
                     弹窗加注
                     */
                    var layer = new jiaZhuXuzhouLayer(function(){
                        //弹窗等待
                        MjClient.playui._jiazhuWait.visible = true;
                    });
                    MjClient.playui.addChild(layer,99);
                    if (MjClient.webViewLayer != null)
                    {
                        MjClient.webViewLayer.close();
                    }
                },
                HZPickCard:function (eD) {
                    if(MjClient.rePlayVideo != -1){
                        var pl = getUIPlayer_hongZi( MjClient.playui.rightMaxPlayerNum());
                        if(eD.uid == pl.info.uid) {
                            MjClient.OtherHandArr[ MjClient.playui.rightMaxPlayerNum()] = MjClient.majiang.sortCard(pl.mjhand)
                        }
                    }

                    RemovePutCardOut_hongZi(true);
                    MjClient.playui.ResetHandCard(this, MjClient.playui.rightMaxPlayerNum());
                },
                HZAddCards:function (eD) {
                    DealAddCard_hongZi(this,eD,  MjClient.playui.rightMaxPlayerNum());
                },
                HZCheckRaise:function (msg) {
                    ShowPutCardIcon_hongZi();
                    //MjClient.playui.EatVisibleCheck();

                    var tData = MjClient.data.sData.tData;
                    var pl = getUIPlayer_hongZi( MjClient.playui.rightMaxPlayerNum());
                    if(!pl){
                        return;
                    }
                    if (pl.jiazhuNum == 2 && MjClient.rePlayVideo == -1)
                    {
                        if (SelfUid() == pl.info.uid) {
                            var layer = new laZhangLayer();
                            MjClient.playui.addChild(layer, 99);
                            if (MjClient.webViewLayer != null) {
                                MjClient.webViewLayer.close();
                            }
                        }
                        else
                        {
                            MjClient.playui._jiazhuWait.visible = true;
                        }
                    }else if(pl.jiazhuNum == 1){
                        MjClient.majiang.setJiaZhuNum(node, getUIPlayer_hongZi(off));
                    }
                }
            }
        },
        left: {
            _run:function(){
                // if(MjClient.MaxPlayerNum_hongZi == 2)
                //     this.setVisible(false);
            },
            head: {
                zhuang: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        waitPut: function() {
                            showUserZhuangLogo_hongZi(this, MjClient.MaxPlayerNum_hongZi - 1);
                        },
                        initSceneData: function() {
                            if (IsArrowVisible_hongZi()) showUserZhuangLogo_hongZi(this, MjClient.MaxPlayerNum_hongZi - 1);
                        },
                        mjhand: function(){
                            if (IsArrowVisible_hongZi()) showUserZhuangLogo_hongZi(this, MjClient.MaxPlayerNum_hongZi - 1);
                        }
                    }
                },
                chatbg: {
                    _run: function() {
                        this.getParent().zIndex = 500;
                    },
                    chattext: {
                        _event: {
                            MJChat: function(msg) {
                                showUserChat_hongZi(this, MjClient.MaxPlayerNum_hongZi - 1, msg);
                            },
                            playVoice: function(voicePath) {
                                MjClient.data._tempMessage.msg = voicePath;
                                showUserChat_hongZi(this, MjClient.MaxPlayerNum_hongZi - 1, MjClient.data._tempMessage);
                            }
                        }
                    }
                },
                _click: function(btn) {
                    showPlayerInfo_hongZi(MjClient.MaxPlayerNum_hongZi - 1, btn);
                },
                _event: {
                    loadWxHead: function(d) {
                        setWxHead_hongZi(this, d, MjClient.MaxPlayerNum_hongZi - 1);
                    },
                    addPlayer: function(eD) {
                        showFangzhuTagIcon_hongZi(this,MjClient.MaxPlayerNum_hongZi - 1);
                    },
                    removePlayer: function(eD) {
                        showFangzhuTagIcon_hongZi(this,MjClient.MaxPlayerNum_hongZi - 1);
                    }
                },
                _run: function () {
                    showFangzhuTagIcon_hongZi(this,MjClient.MaxPlayerNum_hongZi - 1);
                },
                score_bg:{_visible:false},
                huxi:{
                    _visible: false,
                    _event:{
                        clearCardUI: function(){
                            this.setVisible(false);
                            return this.setString("胡息:0");
                        },
                        addPlayer: function(){
                            return this.setString("胡息:0");
                        },
                        removePlayer: function(){
                            this.visible = false;
                        },
                        initSceneData:function(){
                            // this.visible = true;
                            var huXi = UpdateHuXi_hongZi(MjClient.MaxPlayerNum_hongZi - 1);
                            if(!IsArrowVisible_hongZi()){
                                huXi = 0;
                            }
                            return this.setString("胡息:" + huXi);
                        },
                        mjhand:function(){
                            // this.visible = true;
                        },
                        HZChiCard:function(){
                            var huXi = UpdateHuXi_hongZi(MjClient.MaxPlayerNum_hongZi - 1);
                            return this.setString("胡息:" + huXi);
                        },
                        MJPeng:function(){
                            var huXi = UpdateHuXi_hongZi(MjClient.MaxPlayerNum_hongZi - 1);
                            return this.setString("胡息:" + huXi);
                        },
                        HZGangCard:function(){
                            var huXi = UpdateHuXi_hongZi(MjClient.MaxPlayerNum_hongZi - 1);
                            return this.setString("胡息:" + huXi);
                        },
                        HZWeiCard:function(){
                            var huXi = UpdateHuXi_hongZi(MjClient.MaxPlayerNum_hongZi - 1);
                            return this.setString("胡息:" + huXi);
                        },
                    }
                },
                jiaZhu: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        clearCardUI: function(eD) {
                            this.visible = false;
                        }
                    }
                },
                jiaZhuTip: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        clearCardUI: function(eD) {
                            this.visible = false;
                        }
                    }
                },
                name_bg:{_visible:false},
                timeImg:{
                    _visible:false,
                    _event:{
                        initSceneData: function(eD) {
                            //this.visible = curPlayerIsMe_hongZi(MjClient.MaxPlayerNum_hongZi - 1);
                        },
                        onlinePlayer: function(eD) {
                            //this.visible = curPlayerIsMe_hongZi(MjClient.MaxPlayerNum_hongZi - 1) && IsArrowVisible_hongZi();
                        },
                        waitPut: function(eD) {
                            //this.visible = curPlayerIsMe_hongZi(MjClient.MaxPlayerNum_hongZi - 1);
                        },
                        HZNewCard: function(ed){
                            //this.visible = curPlayerIsMe_hongZi(MjClient.MaxPlayerNum_hongZi - 1);
                        },
                        MJPeng: function(eD) {
                            //this.visible = curPlayerIsMe_hongZi(MjClient.MaxPlayerNum_hongZi - 1);
                        },
                        HZChiCard: function(eD) {
                            //this.visible = curPlayerIsMe_hongZi(MjClient.MaxPlayerNum_hongZi - 1);
                        },
                        HZGangCard: function(eD) {
                            //this.visible = curPlayerIsMe_hongZi(MjClient.MaxPlayerNum_hongZi - 1);
                        },
                        HZWeiCard: function(eD) {
                            //this.visible = curPlayerIsMe_hongZi(MjClient.MaxPlayerNum_hongZi - 1);
                        },
                        MJPut: function(eD){
                            //this.visible = curPlayerIsMe_hongZi(MjClient.MaxPlayerNum_hongZi - 1);
                        },
                        roundEnd: function(eD){
                            //this.visible = false;
                        }
                    },
                    time:{
                        _run: function() {
                            this.setString("00");
                        },
                        _event: {
                            initSceneData: function(eD) {
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_hongZi(MjClient.MaxPlayerNum_hongZi - 1)){
                                    arrowbkNumberUpdate(this);
                                    this.setString("00");
                                }
                            },
                            mjhand: function(eD) {
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_hongZi(MjClient.MaxPlayerNum_hongZi - 1)){
                                    arrowbkNumberUpdate(this);
                                }
                            },
                            MJPeng: function() {
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_hongZi(MjClient.MaxPlayerNum_hongZi - 1)){
                                    arrowbkNumberUpdate(this);
                                }
                            },
                            HZNewCard: function(){
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_hongZi(MjClient.MaxPlayerNum_hongZi - 1)){
                                    arrowbkNumberUpdate(this);
                                }
                            },
                            HZGangCard: function(){
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_hongZi(MjClient.MaxPlayerNum_hongZi - 1)){
                                    arrowbkNumberUpdate(this);
                                }
                            },
                            HZChiCard: function() {
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_hongZi(MjClient.MaxPlayerNum_hongZi - 1)){
                                    arrowbkNumberUpdate(this);
                                }
                            },
                            HZWeiCard: function(){
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_hongZi(MjClient.MaxPlayerNum_hongZi - 1)){
                                    arrowbkNumberUpdate(this);
                                }
                            },
                            MJPut: function(msg) {
                                if (curPlayerIsMe_hongZi(MjClient.MaxPlayerNum_hongZi - 1)) {
                                    this.stopAllActions();
                                    stopEffect(playTimeUpEff);
                                    playTimeUpEff = null;
                                    this.setString("00");
                                }
                            },
                            onlinePlayer: function(){
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                var pl = getUIPlayer_hongZi(MjClient.MaxPlayerNum_hongZi - 1);
                                if(pl && pl.onLine && curPlayerIsMe_hongZi(MjClient.MaxPlayerNum_hongZi - 1)){
                                    arrowbkNumberUpdate(this);
                                }
                            },
                            roundEnd: function() {
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                            }
                        }
                    }
                }
            },
            play_tips: {
                _layout: [[0.2, 0.2], [0.2, 0.7], [0, 0.5]],
                _run: function () {
                    this.zIndex = actionZindex;
                },
                _visible:false,
            },
            ready: {
                _layout: [[0.07, 0.07],[0.5, 0.5],[-2.5, 2.5]],
                _run: function() {
                    GetReadyVisible_hongZi(this, MjClient.MaxPlayerNum_hongZi - 1);
                },
                _event: {
                    startShuffleCards:function () {
                        GetReadyVisible_hongZi(this, -1);
                    },
                    moveHead: function() {
                        GetReadyVisible_hongZi(this, -1);
                    },
                    addPlayer: function() {
                        GetReadyVisible_hongZi(this, MjClient.MaxPlayerNum_hongZi - 1);
                    },
                    removePlayer: function() {
                        GetReadyVisible_hongZi(this, MjClient.MaxPlayerNum_hongZi - 1);
                    },
                    onlinePlayer: function() {
                        GetReadyVisible_hongZi(this, MjClient.MaxPlayerNum_hongZi - 1);
                    }
                }
            },
            replayNode:{
                _visible: true,
                _layout : [[0.1, 0.1], [0.15, 0.81], [0, 0]]
            },
            eatNode: {
                _visible: false,
                _layout : [[0.14, 0.14], [0.005, 0.76], [0, 0]],
                _run:function(){
                    if(isIPhoneX()){
                        setWgtLayout(this, [0.14, 0.14], [0.045, 0.76], [0, 0]);
                    }
                }
            },
            outNode: {
                _visible: false,
                _layout : [[0.14, 0.14], [0.005, 0.84], [0, 0]],
                _run:function(){
                    if(isIPhoneX()){
                        setWgtLayout(this, [0.14, 0.14], [0.045, 0.84], [0, 0]);
                    }
                }
            },
            put: {
                _visible: false,
                //_layout: [[0.35, 0.35],[0.27,0.75],[0,0]],
                _run:function()
                {
                    setWgtLayout(this, [0.35, 0.35],[0.27,0.75],[0,0]);
                    var userData = {scale:this.getScale(), pos:this.getPosition()};
                    this.setUserData(userData);
                },

                _event:{
                    MJPut: function(eD) {
                        this.loadTexture("playing/paohuzi/chupai_bj.png");
                    },
                    HZNewCard: function(eD){
                        this.loadTexture("playing/paohuzi/mopai_bj.png");
                    }
                }
            },
            out0: {
                _visible: false
            },
            _event: {
                clearCardUI: function() {
                    clearCardUI_hongZi(this, MjClient.MaxPlayerNum_hongZi - 1);
                },
                clearCardArr: function(){
                    var eatNode = this.getChildByName("eatNode");
                    eatNode.removeAllChildren();
                    var outNode = this.getChildByName("outNode");
                    outNode.removeAllChildren();
                    RemovePutCardOut_hongZi(true);
                },
                initSceneData: function(eD) {
                    SetUserVisible_hongzi(this, MjClient.MaxPlayerNum_hongZi - 1);
                    InitUserHandUI_hongzi(this, MjClient.MaxPlayerNum_hongZi - 1);
                    InitUserCoinAndName_hongZi(this, MjClient.MaxPlayerNum_hongZi - 1);
                    DealOffLineCard_hongZi(this,MjClient.MaxPlayerNum_hongZi - 1);
                },
                addPlayer: function(eD) {
                    SetUserVisible_hongzi(this, MjClient.MaxPlayerNum_hongZi - 1);
                    InitUserCoinAndName_hongZi(this, MjClient.MaxPlayerNum_hongZi - 1);
                },
                removePlayer: function(eD) {
                    SetUserVisible_hongzi(this, MjClient.MaxPlayerNum_hongZi - 1);
                    InitUserCoinAndName_hongZi(this, MjClient.MaxPlayerNum_hongZi - 1);
                },
                mjhand: function(eD) {
                    InitUserHandUI_hongzi(this, MjClient.MaxPlayerNum_hongZi - 1);
                    InitUserCoinAndName_hongZi(this, MjClient.MaxPlayerNum_hongZi - 1);
                },
                HZNewCard: function(eD) {
                    console.log("客户端发牌组合...... ");
                    if (typeof(eD) == "number") {
                        eD = {newCard: eD};
                    }
                    DealNewCard_hongZi(this,eD,MjClient.MaxPlayerNum_hongZi - 1);
                },
                roundEnd: function() {
                    InitUserCoinAndName_hongZi(this, MjClient.MaxPlayerNum_hongZi - 1);
                    MjClient.playui.ResetOtherCard(this, MjClient.MaxPlayerNum_hongZi - 1);
                },
                waitPut: function(eD) {
                    DealWaitPut(this, eD, MjClient.MaxPlayerNum_hongZi - 1);
                },
                MJPut: function(eD) {
                    DealPutCard_hongZi(this, eD, MjClient.MaxPlayerNum_hongZi - 1);
                },
                HZChiCard: function(eD) {
                    DealChiCard_hongZi(this, eD, MjClient.MaxPlayerNum_hongZi - 1);
                },
                HZPaoCard: function(eD) {
                    DealPaoCard_hongZi(this, eD, MjClient.MaxPlayerNum_hongZi - 1);
                },
                HZGangCard: function(eD) {
                    DealGangCard_hongZi(this, eD, MjClient.MaxPlayerNum_hongZi - 1);
                },
                MJPeng: function(eD) {
                    DealPengCard_hongZi(this, eD, MjClient.MaxPlayerNum_hongZi - 1);
                },
                HZWeiCard: function(eD){
                    DealWeiCard_hongZi(this, eD, MjClient.MaxPlayerNum_hongZi - 1);
                },
                MJHu: function(eD) {
                    DealHu_hongZi(this, eD, MjClient.MaxPlayerNum_hongZi - 1);
                },
                onlinePlayer: function(eD) {
                    setUserOffline_hongZi(this, MjClient.MaxPlayerNum_hongZi - 1);
                },
                playerStatusChange: function(eD) {
                    setUserOffline_hongZi(this, MjClient.MaxPlayerNum_hongZi - 1);
                },
                MJFlower: function(eD) {
                    HandleMJFlower(this, eD, MjClient.MaxPlayerNum_hongZi - 1);
                },
                MJTing: function (eD) {
                    HandleMJTing(this, eD, MjClient.MaxPlayerNum_hongZi - 1);
                },
                HZPickCard:function (eD) {
                    if(MjClient.rePlayVideo != -1) {
                        var pl = getUIPlayer_hongZi(MjClient.MaxPlayerNum_hongZi - 1);
                        if(eD.uid == pl.info.uid){
                            MjClient.OtherHandArr[MjClient.MaxPlayerNum_hongZi - 1] = MjClient.majiang.sortCard(pl.mjhand)
                        }
                    }
                    RemovePutCardOut_hongZi(true);
                    MjClient.playui.ResetHandCard(this,MjClient.MaxPlayerNum_hongZi - 1);
                },
                HZAddCards:function (eD) {
                    DealAddCard_hongZi(this,eD, MjClient.MaxPlayerNum_hongZi - 1);
                },
                HZCheckRaise:function (msg) {
                    ShowPutCardIcon_hongZi();
                    //MjClient.playui.EatVisibleCheck();

                    var tData = MjClient.data.sData.tData;
                    var pl = getUIPlayer_hongZi(MjClient.MaxPlayerNum_hongZi - 1);
                    if(!pl){
                        return;
                    }
                    if (pl.jiazhuNum == 2 && MjClient.rePlayVideo == -1)
                    {
                        if (SelfUid() == pl.info.uid) {
                            var layer = new laZhangLayer();
                            MjClient.playui.addChild(layer, 99);
                            if (MjClient.webViewLayer != null) {
                                MjClient.webViewLayer.close();
                            }
                        }
                        else
                        {
                            MjClient.playui._jiazhuWait.visible = true;
                        }
                    }else if(pl.jiazhuNum == 1){
                        MjClient.majiang.setJiaZhuNum(node, getUIPlayer_hongZi(off));
                    }
                }
            }
        },
        eat: {
            chi: {
                _visible: false,
                _layout: [[0, 0.1],[0.5, 0],[1.3, 3.8]],
                bg_img:{
                    _run:function(){
                        var _Image_light_scale = this.getScale();
                        
                        var a = cc.scaleTo(0.5,_Image_light_scale*1.0);
                        var aa = cc.fadeIn(0.5);
                        var a1 = cc.scaleTo(1,_Image_light_scale*1.3);
                        var a2 = cc.fadeOut(1);
                        var a3 = cc.callFunc(function(){
                            //this.setOpacity(255);
                            this.setScale(_Image_light_scale*0.95);
                        }.bind(this));
            
                        this.runAction(cc.sequence(cc.spawn(a,aa), cc.spawn(a1,a2).easing(cc.easeCubicActionOut()),a3,cc.delayTime(0.2)).repeatForever());
                    
                    }

                },
                _touch: function(btn, eT) {
                    if (eT == 2){

                        if(ziPai.getHasFastEat()){
                            // 快速吃牌
                            var sData = MjClient.data.sData;
                            var tData = sData.tData;
                            var putCard = tData.lastPutCard;
                            var pl = sData.players[SelfUid()];
                            var chiList = MjClient.majiang.getChiList(pl, putCard);
                            if (chiList.length == 1) {
                                commitEatCards_hongZi(chiList[0], null);
                                return;
                            }
                        }
                        
                        showSelectEatCards_hongZi(this,btn.tag);

                        // var eat = MjClient.playui.jsBind.eat;
                        // eat.chi._node.visible = false;
                        // eat.guo._node.visible = false;
                        // eat.peng._node.visible = false;
                        // eat.hu._node.visible = false;
                        // eat.cancel._node.visible = false;

                        // eat.chi._node.setTouchEnabled(false);
                        // eat.guo._node.setTouchEnabled(false);
                        // eat.peng._node.setTouchEnabled(false);
                        // eat.hu._node.setTouchEnabled(false);
                        // postEvent("showChiLayout");

                        // MJChiCardchange_hongZi();
                    }
                }
            },
            noTing : {
                _visible : false,
                _layout: [[0, 0.1],[0.5, 0],[4.6, 2.5]],
                _touch: function(btn, eT) {
                    if (eT == 2){
                        // hideTingBtn();
                    }
                }
            },
            peng: {
                _visible: false,
                _layout: [[0, 0.1],[0.5, 0],[0, 2.5]],
                bg_img:{
                    _run:function(){
                        var _Image_light_scale = this.getScale();
                        
                        var a = cc.scaleTo(0.5,_Image_light_scale*1.0);
                        var aa = cc.fadeIn(0.5);
                        var a1 = cc.scaleTo(1,_Image_light_scale*1.3);
                        var a2 = cc.fadeOut(1);
                        var a3 = cc.callFunc(function(){
                            //this.setOpacity(255);
                            this.setScale(_Image_light_scale*0.95);
                        }.bind(this));
            
                        this.runAction(cc.sequence(cc.spawn(a,aa), cc.spawn(a1,a2).easing(cc.easeCubicActionOut()),a3,cc.delayTime(0.2)).repeatForever());
                    
                    }

                },
                _touch: function(btn, eT) {
                        console.log(">>>> lf，点击碰按钮");
                        if (eT == 2){
                            if ((MjClient.data.sData.players[SelfUid()].eatFlag & 32) > 0) {
                                MjClient.showMsg("选择碰后视为过胡，确定碰吗？", function() {
                                    HZPengToServer_hongZi();
                                setChiVisible_hongZi();
                                }, function() {}, "1");
                            } else {
                                HZPengToServer_hongZi();
                                setChiVisible_hongZi(); 
                            }
                        }
                }
            },
            guo: {
                _visible: false,
                _layout: [[0, 0.1],[0.5, 0],[4.6, 2.5]],
                _touch: function(btn, eT) {
                    if (eT == 2){
                        if ((MjClient.data.sData.players[SelfUid()].eatFlag & 32) > 0) {
                            MjClient.showMsg("确定过胡吗？", function() {
                                HZPassConfirmToServer_hongZi(); // todo 
                                setChiVisible_hongZi();//add by maoyu
                            }, function() {}, "1");
                        } else {
                            HZPassConfirmToServer_hongZi(); // todo 
                            setChiVisible_hongZi();//add by maoyu
                        } 
                        
                    }
                }
            },
            hu: {
                _visible: false,
                _layout: [[0, 0.1],[0.5, 0],[-3, 2.5]],
                bg_img:{
                    _run:function(){
                        var _Image_light_scale = this.getScale();
                        
                        var a = cc.scaleTo(0.5,_Image_light_scale*1.0);
                        var aa = cc.fadeIn(0.5);
                        var a1 = cc.scaleTo(1,_Image_light_scale*1.3);
                        var a2 = cc.fadeOut(1);
                        var a3 = cc.callFunc(function(){
                            //this.setOpacity(255);
                            this.setScale(_Image_light_scale*0.95);
                        }.bind(this));
            
                        this.runAction(cc.sequence(cc.spawn(a,aa), cc.spawn(a1,a2).easing(cc.easeCubicActionOut()),a3,cc.delayTime(0.2)).repeatForever());
                    
                    }

                },
                _touch: function(btn, eT) {
                    if (eT == 2) {
                        MJHuToServer_hongZi();
                        setChiVisible_hongZi();//add by maoyu
                    }
                }
            },
            cancel: {
                _visible: false,
                _layout: [
                    [0, 0.16],
                    [0.78, 0.1],
                    [0, 1.12]
                ],
                _touch: function(btn, eT) {
                    if (eT == 2) {
                        btn.visible = false;
                        var parent = btn.getParent();
                        parent.getChildByName("chiSelect").visible = false;
                        parent.getChildByName("biSelect").visible = false;
                        parent.getChildByName("biSelect1").visible = false;
                        resetChiParam_hongZi();
                        MjClient.playui.EatVisibleCheck();
                        // MjClient.playui.CardLayoutRestore(MjClient.playui._downNode, 0);
                    }
                }
            },
            wangDiao:{
                _visible: false,
                _layout: [[0, 0.1],[0.5, 0],[0, 2.5]],
                bg_img:{
                    _run:function(){
                        var _Image_light_scale = this.getScale();
                        
                        var a = cc.scaleTo(0.5,_Image_light_scale*1.0);
                        var aa = cc.fadeIn(0.5);
                        var a1 = cc.scaleTo(1,_Image_light_scale*1.3);
                        var a2 = cc.fadeOut(1);
                        var a3 = cc.callFunc(function(){
                            //this.setOpacity(255);
                            this.setScale(_Image_light_scale*0.95);
                        }.bind(this));
            
                        this.runAction(cc.sequence(cc.spawn(a,aa), cc.spawn(a1,a2).easing(cc.easeCubicActionOut()),a3,cc.delayTime(0.2)).repeatForever());
                    
                    }

                },
                _touch: function(btn, eT) {
                    console.log(">>>> lf，点击碰按钮");
                    if (eT == 2) {
                        HZWangChuangToServer_hongZi(1);
                        setChiVisible_hongZi();//add by maoyu
                    }
                }
            },
            wangChuang:{
                _visible: false,
                _layout: [[0, 0.1],[0.5, 0],[0, 2.5]],
                bg_img:{
                    _run:function(){
                        var _Image_light_scale = this.getScale();
                        
                        var a = cc.scaleTo(0.5,_Image_light_scale*1.0);
                        var aa = cc.fadeIn(0.5);
                        var a1 = cc.scaleTo(1,_Image_light_scale*1.3);
                        var a2 = cc.fadeOut(1);
                        var a3 = cc.callFunc(function(){
                            //this.setOpacity(255);
                            this.setScale(_Image_light_scale*0.95);
                        }.bind(this));
            
                        this.runAction(cc.sequence(cc.spawn(a,aa), cc.spawn(a1,a2).easing(cc.easeCubicActionOut()),a3,cc.delayTime(0.2)).repeatForever());
                    
                    }

                },
                _touch: function(btn, eT) {
                    console.log(">>>> lf，点击碰按钮");
                    if (eT == 2) {
                        HZWangChuangToServer_hongZi(2);
                        setChiVisible_hongZi();//add by maoyu
                    }
                }
            },
            wangZha:{
                _visible: false,
                _layout: [[0, 0.1],[0.5, 0],[0, 2.5]],
                bg_img:{
                    _run:function(){
                        var _Image_light_scale = this.getScale();
                        
                        var a = cc.scaleTo(0.5,_Image_light_scale*1.0);
                        var aa = cc.fadeIn(0.5);
                        var a1 = cc.scaleTo(1,_Image_light_scale*1.3);
                        var a2 = cc.fadeOut(1);
                        var a3 = cc.callFunc(function(){
                            //this.setOpacity(255);
                            this.setScale(_Image_light_scale*0.95);
                        }.bind(this));
            
                        this.runAction(cc.sequence(cc.spawn(a,aa), cc.spawn(a1,a2).easing(cc.easeCubicActionOut()),a3,cc.delayTime(0.2)).repeatForever());
                    
                    }

                },
                _touch: function(btn, eT) {
                    console.log(">>>> lf，点击碰按钮");
                    if (eT == 2) {
                        HZWangChuangToServer_hongZi(4);
                        setChiVisible_hongZi();//add by maoyu
                    }
                }
            },
            chiSelect: {
                _visible: false,
                _layout: [[0,0.38],[0.5,0.76],[0,0]],
            },
            biSelect: {
                _visible: false,
                _layout: [[0,0.38],[0.5,0.76],[0,0]],
            },
            biSelect1: {
                _visible: false,
                _layout: [[0,0.38],[0.5,0.76],[0,0]],
            },
            chiBg: {
                _visible: false,
                _layout: [[1, 0], [0.5, 404 / 720], [0, 0]],
                _run: function() {
                    var width = 0;
                    var cards_select = [];
                    var cards_option = [];
                    this.reset = function() {
                        width = 0;
                        cards_select = [];
                        cards_option = [];
                    }

                    this.calculateOptionCards = function() {
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;
                        var pl = sData.players[SelfUid()];
                        var putCard = tData.lastPutCard;
                        // console.log("cards_select.length@@" + cards_select.length);
                        switch (cards_select.length) {
                            case 0:
                                cards_option = MjClient.majiang.getChiCards(pl.mjhand, putCard);
                                break;
                            case 1:
                            case 2:
                            case 3:
                                var hand = pl.mjhand.concat();
                                hand.push(putCard);
                                for (var i = 0; i < cards_select.length; i++) {
                                    var row = cards_select[i];
                                    for (var j = 0; j < row.length; j++) {
                                        hand.splice(hand.indexOf(row[j]), 1);
                                    }
                                }

                                if (hand.indexOf(putCard) < 0) {
                                    cards_option = [];
                                } else {
                                    cards_option = MjClient.majiang.getBiCards(hand, putCard);
                                }
                                break;
                        }

                        for (var i = 0; i < cards_option.length; i++) {
                            var row = cards_option[i];
                            row.splice(row.indexOf(putCard), 1);
                            row.sort(function(a, b) {
                                if (a % 20 == b % 20) {
                                    return b - a;
                                }

                                return a - b;
                            });
                            row.push(putCard);
                        }
                    }

                    this.adaptChiLayout = function() {
                        this.calculateOptionCards();
                        if (cards_option.length == 0) { // 吃牌选好了
                            if ((MjClient.data.sData.players[SelfUid()].eatFlag & 32) > 0) {
                                MjClient.showMsg("选择吃后视为过胡，确定吃吗？", function() {
                                    var biCards = cards_select.length > 1 ? cards_select.slice(1) : null;
                                    HZChiToServer_hongZi(cards_select[0], biCards);
                                    this.visible = false;
                                }.bind(this), function() {
                                    cards_select.pop();
                                    this.adaptChiLayout();
                                }.bind(this), "1");
                            } else {
                                var biCards = cards_select.length > 1 ? cards_select.slice(1) : null;
                                HZChiToServer_hongZi(cards_select[0], biCards);
                                this.visible = false;
                            }

                            return;
                        } 

                        this.visible = true;
                        var chiLayout = this.getChildByName("chiLayout");
                        chiLayout.removeAllChildren();
                        width = (cards_select.length + 1) * 205 + cards_option.length * 75;
                        if (cards_option.length >= 2) {
                            width += 15 * (cards_option.length - 1);
                        }

                        // cc.log("width@@ " + width);
                        // console.log("cards_select@@ " + JSON.stringify(cards_select));
                        // console.log("cards_option@@ " + JSON.stringify(cards_option));
                        var pos_x = 1280 / 2 - width / 2;
                        if (pos_x < 210) {
                            pos_x = 1280 - 210 - width;
                        }

                        // 添加已选择的吃牌
                        for (var i = 0; i < cards_select.length; i++) {
                            var chiTipImg = this.getChildByName("chiTipImg").clone();
                            var src = i == 0 ? "playing/paohuzi/chiTip.png" : "playing/paohuzi/biTip.png";
                            chiTipImg.loadTexture(src);
                            chiTipImg.visible = true;
                            chiTipImg.x = pos_x + 130 / 2;
                            chiLayout.addChild(chiTipImg);
                            pos_x += 130;

                            var row = cards_select[i];
                            var highlightImg = this.getChildByName("highlightImg").clone();
                            highlightImg.visible = true;
                            highlightImg.x = pos_x + 75 / 2;
                            highlightImg.y = 142;
                            chiLayout.addChild(highlightImg);
                            for (var j = 0; j < row.length; j++) {
                                var chiCardImg = this.getChildByName("chiCardImg").clone();
                                chiCardImg.loadTexture(MjClient.cardPath_hongZi + "out" + row[j] + ".png");
                                chiCardImg.visible = true;
                                chiCardImg.x = pos_x + 75 / 2;
                                chiCardImg.y = 70 * j + 72;
                                if (j == 2) {
                                    chiCardImg.setColor(cc.color(170, 170, 170));
                                }
                                chiLayout.addChild(chiCardImg);
                                (function(tag) {
                                    chiCardImg.setTouchEnabled(true);
                                    chiCardImg.addTouchEventListener(function(sender, type) {
                                        if (type == 2) {
                                            // cc.log("回到第 " + (tag + 1) + "步");
                                            cards_select = cards_select.slice(0, tag);
                                            this.adaptChiLayout();
                                        }
                                    }.bind(this));
                                }.bind(this)(i));
                            }
                                
                            pos_x += 75;
                        }

                        // 添加当前可选吃牌
                        var chiTipImg = this.getChildByName("chiTipImg").clone();
                        var src = cards_select.length == 0 ? "playing/paohuzi/chiTip.png" : "playing/paohuzi/biTip.png";
                        chiTipImg.loadTexture(src);
                        chiTipImg.visible = true;
                        chiTipImg.x = pos_x + 130 / 2;
                        chiLayout.addChild(chiTipImg);
                        pos_x += 130;
                        for (var i = 0; i < cards_option.length; i++) {
                            var row = cards_option[i];
                            for (var j = 0; j < row.length; j++) {
                                var chiCardImg = this.getChildByName("chiCardImg").clone();
                                chiCardImg.loadTexture(MjClient.cardPath_hongZi + "out" + row[j] + ".png");
                                chiCardImg.visible = true;
                                chiCardImg.x = pos_x + 75 / 2;
                                chiCardImg.y = 70 * j + 72;
                                if (j == 2) {
                                    chiCardImg.setColor(cc.color(170, 170, 170));
                                }
                                chiLayout.addChild(chiCardImg);
                                (function(tag) {
                                    chiCardImg.setTouchEnabled(true);
                                    chiCardImg.addTouchEventListener(function(sender, type) {
                                        if (type == 2) {
                                            // console.log("选择吃@@ ");
                                            cards_select.push(cards_option[tag]);
                                            this.adaptChiLayout();
                                        }
                                    }.bind(this));
                                }.bind(this)(i));
                            }

                            pos_x += 90;
                        }
                    }
                },
                _event: {
                    showChiLayout: function() {
                        this.reset();
                        this.adaptChiLayout();
                    }
                },
                chiTipImg: {
                    _visible: false
                },
                highlightImg: {
                    _visible: false
                },
                chiCardImg: {
                    _visible: false,
                    _run: function() {
                        this.scale = 70 / this.getContentSize().width;
                    }
                },
                cancleBtn: {
                    _run: function() {
                        this.x = 1136;
                    },
                    _click: function(sender, et) {
                        sender.parent.visible = false;
                        MjClient.playui.EatVisibleCheck();
                    }
                }

            },
            _event: {
                clearCardUI: function() {
                    //add by sking
                    cc.log("ting yu no ting hide --------by sking");
                    MjClient.playui.EatVisibleCheck();
                },
                MJPass: function(eD) {
                    console.log("HHH :，MJPass------");
                    setQiHuState_hongZi();
                    MjClient.playui.EatVisibleCheck();
                },
                mjhand: function(eD) {
                    console.log("HHH :，mjhand------");
                    MjClient.playui.EatVisibleCheck();
                },
                waitPut: function(eD) {
                    console.log("HHH :，waitPut------");
                    MjClient.playui.EatVisibleCheck();
                },
                HZNewCard: function(eD) {
                    console.log("HHH :HZNewCard------");
                    setQiHuState_hongZi();
                    //放在每个方向节点上去做，因为摸到王霸牌的时候，有个显示动作，动作显示完之后
                    //在显示各种操作按钮
                    if(eD.isCommon && eD.newCard){
                        MjClient.playui.EatVisibleCheck();
                    }
                },
                HZGangCard: function(eD) {
                    console.log("HHH :HZGangCard------");
                    setQiHuState_hongZi();
                    MjClient.playui.EatVisibleCheck();
                },
                MJPut: function(eD) {
                    console.log("HHH :，MJPut------");
                    setQiHuState_hongZi();
                    MjClient.playui.EatVisibleCheck();
                },
                MJPeng: function(eD) {
                    console.log("HHH :，MJPeng------");
                    setQiHuState_hongZi();
                    MjClient.playui.EatVisibleCheck();
                },
                HZChiCard: function(eD) {
                    console.log("HHH :HZChiCard------");
                    setQiHuState_hongZi();
                    MjClient.playui.EatVisibleCheck();
                },
                HZWeiCard: function(eD) {
                    console.log("HHH :HZWeiCard------");
                    setQiHuState_hongZi();
                },
                roundEnd: function(eD) {
                    console.log("HHH :，roundEnd------");
                    MjClient.playui.EatVisibleCheck();
                },
                initSceneData: function(eD) {
                    function delayExe()
                    {
                        cc.log("MjClient.playui == >");
                        cc.log(MjClient.playui);
                        MjClient.playui.EatVisibleCheck();
                    }
                    this.runAction(cc.sequence(cc.delayTime(0.1),cc.callFunc(delayExe)));
                },
                HZWang:function(eD){
                    console.log("HHH :HZWang------");
                    MjClient.playui.EatVisibleCheck();                    
                },
                HZWangChuang:function(eD){
                    console.log("HHH :HZWangChuang------");
                    console.log("HHH :HZWangChuang------");
                    if(MjClient.rePlayVideo != -1){
                        MjClient.playui.EatVisibleCheck();
                    }                   
                },
            }
        },
        finger:{
            _visible: false,
            _run: function () {
                setWgtLayout(this,[0.18, 0.18], [0.68, 0.3], [0.7, -0.1]);
            },
            _event:{
                MJHu:function(){
                    this.visible = false;
                }
            }
        },
        li_btn: {
            _layout: [[0.07, 0.07],[0.04, 0.18],[0, 0]],
            _run: function(){
                this.zIndex = 99;
            },
            _click: function() {
                // MjClient.HandCardArr = MjClient.majiang.sortByUser();
                // MjClient.playui.ResetHandCard(MjClient.playui._downNode,0);  
                var sData = MjClient.data.sData;
                var tData = sData.tData;  
                if(tData.tState != TableState.waitPut && tData.tState != TableState.waitEat && tData.tState != TableState.waitCard){
                    return;
                }
                var pl = sData.players[MjClient.data.pinfo.uid];
                MjClient.HandCardArr = MjClient.majiang.sortCard(pl.mjhand);
                MjClient.playui.ResetHandCard(MjClient.playui._downNode,0); 
            },
            _event: {
                mjhand:function (eD) {
                    var tData = MjClient.data.sData.tData;
                    if(tData.tState != TableState.waitPut && tData.tState != TableState.waitEat && tData.tState != TableState.waitCard){
                        return;
                    }
                    this.setVisible(true)
                     
                    // if(MjClient.MaxPlayerNum_leiyang == 4){
                    //     this.setVisible(false);
                    // }
                },
                initSceneData: function(eD) {

                    var tData = MjClient.data.sData.tData;
                    if(tData.tState != TableState.waitPut && tData.tState != TableState.waitEat && tData.tState != TableState.waitCard){
                        return;
                    }
                    this.setVisible(true);
                    // if(MjClient.MaxPlayerNum_leiyang == 4){
                    //     this.setVisible(false);
                    // }
                },
            } 
             
        },
        chat_btn: {
            _layout: [[55/1280, 0],[0.97, 0.5-0.007],[0, -0.2]],
            _run: function() {
                this.zIndex = 99;
            },
            _click: function() {
                var chatlayer = new ChatLayer();
                MjClient.Scene.addChild(chatlayer);

                // MjClient.Scene.addChild(new EndOneView_HongZi(),500);
                // MjClient.Scene.addChild(new GameOverLayer_HongZi(),500);
            }
        },
        voice_btn: {
            _layout: [[43/1280, 0],[0.91, 0.5],[0, -0.2]],
            _run: function() {
                initVoiceData();
                cc.eventManager.addListener(getTouchListener(), this);
                if(MjClient.isShenhe) this.visible=false;
                this.zIndex = 99;
            },
            _touch: function(btn, eT) {
                // 点击开始录音 松开结束录音,并且上传至服务器, 然后通知其他客户端去接受录音消息, 播放
                if (eT == 0) {
                    startRecord();
                } else if (eT == 2) {
                    endRecord();
                } else if (eT == 3) {
                    cancelRecord();
                }
            },
            _event: {
                cancelRecord: function() {
                    MjClient.native.HelloOC("cancelRecord !!!");
                },
                uploadRecord: function(filePath) {
                    if (filePath) {
                        MjClient.native.HelloOC("upload voice file");
                        MjClient.native.UploadFile(filePath, MjClient.remoteCfg.voiceUrl, "sendVoice");
                    } else {
                        MjClient.native.HelloOC("No voice file update");
                    }
                },
                sendVoice: function(fullFilePath) {
                    if (!fullFilePath) {
                        console.log("sendVoice No fileName");
                        return;
                    }

                    var getFileName = /[^\/]+$/;
                    var extensionName = getFileName.exec(fullFilePath);
                    var fileName = extensionName[extensionName.length - 1];
                    console.log("sfileName is:" + fileName);

                    MjClient.gamenet.request("pkroom.handler.tableMsg", {
                        cmd: "downAndPlayVoice",
                        uid: SelfUid(),
                        type: 3,
                        msg: fileName,
                        num: MjClient.data._JiaheTempTime//录音时长
                    });
                    MjClient.native.HelloOC("download file");
                },
                downAndPlayVoice: function(msg) {
                    MjClient.native.HelloOC("downloadPlayVoice ok");
                    MjClient.data._tempMessage = msg;
                    MjClient.native.HelloOC("mas is" + JSON.stringify(msg));
                    // downAndPlayVoice_hongZi(msg.uid, msg.msg);
                    downAndPlayVoice(msg.uid, msg.msg);
                }
            }
        },
        cutLine:{
            _visible: false,
            _run: function () {
                setWgtLayout(this,[1, 0.3], [0.5, 0.6], [0, -2]);
                ziPai.setWgtLayoutCutLine(this);
            },
            _event: {
                mjhand: function(eD){
                    ShowPutCardIcon_hongZi();
                },
                HZNewCard: function(eD){
                    ShowPutCardIcon_hongZi();
                },                
                // HZChiCard: function(eD) {
                //     ShowPutCardIcon_hongZi();
                // },
                // MJPeng: function(eD) {
                //     ShowPutCardIcon_hongZi();
                // },
                MJPut:function(eD) {
                    ShowPutCardIcon_hongZi();
                },
                MJPass:function(eD) {
                    ShowPutCardIcon_hongZi();
                },
                MJHu:function(eD){
                    this.visible = false;
                },
                EZP_xuXian : function(){
                    ziPai.setWgtLayoutCutLine(this);
                }
                // HZGangCard:function(eD){
                //     ShowPutCardIcon_hongZi();
                // },
                // HZWeiCard:function(eD){
                //     ShowPutCardIcon_hongZi();
                // },
            },
        },
    },
    _downNode:null,
    _rightNode:null,
    _topNode:null,
    ctor: function() {
        this._super();
        ziPai.initZiPaiData(); 

        var playui = ccs.load("Play_HongZi.json");
        playMusic("bgHongZi");
        var tData = MjClient.data.sData.tData;
        MjClient.MaxPlayerNum_hongZi = tData.maxPlayer;
        cc.log(MjClient.MaxPlayerNum_hongZi);

        this._downNode  = playui.node.getChildByName("down");
        this._rightNode = playui.node.getChildByName("right");
        this._topNode  = playui.node.getChildByName("left");
        this._xingNode = playui.node.getChildByName("xing");
        this._finger = playui.node.getChildByName("finger");
        MjClient.HandCardArr = [];
        MjClient.OtherHandArr = {};
        MjClient.playui = this;
        MjClient.playui._AniNode =  playui.node.getChildByName("eat");
        MjClient.playui._jiazhuWait = playui.node.getChildByName("jiazhuWait");
        MjClient.playui._jiazhuWait.visible = false;
        BindUiAndLogic(playui.node, this.jsBind);
        this.addChild(playui.node); 
 
        MjClient.lastMJTick = Date.now();
        this.runAction(cc.repeatForever(cc.sequence(cc.callFunc(function() {
            if (MjClient.game_on_show) MjClient.tickGame(0);
        }), cc.delayTime(7))));

        this.newTingLayer = new NewTingLayer(); 
        playui.node.addChild(this.newTingLayer);

        this.tingLayer = new PhzTingLayer(); 
        playui.node.addChild(this.tingLayer);

        if (MjClient.data.sData.tData.areaSelectMode["convertible"] && MjClient.rePlayVideo == -1)
            addFreeNumberBtn([0.5, 0.4]);

        this.tingLayer.setLocalZOrder(13);
        this.newTingLayer.setLocalZOrder(13);
        this._downNode.setLocalZOrder(11);
        this._xingNode.setLocalZOrder(12);
        this._finger.setLocalZOrder(13);
        MjClient.playui._AniNode.setLocalZOrder(20);
        this.playuiNode = playui.node;

        // 切牌
        if(MjClient.rePlayVideo == -1){
            this.playuiNode.cutCardView = COMMON_UI.createZiPaiCutCardView();
            playui.node.addChild(this.playuiNode.cutCardView, 21);
        }

        // 在亲友圈房间中添加邀请亲友圈牌有一起对局
        addClubYaoqingBtn(5);

        // 俱乐部返回大厅功能：by_jcw
        addClub_BackHallBtn(true, [[0.036, 0], [0.84, 0.95], [0, 0]], [[0.036, 0], [0.84, 0.95], [0, 0]]);

        
        if(MjClient.data.sData.tData.maxPlayer < 4){
            ziPai.changePlayUILayout(playui.node);
        }

        if(MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ || MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP){
            MjClient.playui.jsBind._node.addChild(new roundRule_ziPai(roundRule_ziPai.getRoundRules()));
        }
        
        return true;
    },

    resetJiaZhuTip: function()
    {
        var tData = MjClient.data.sData.tData;
        if (!tData.areaSelectMode.jushou)
            return;
        var nodes = [this._downNode, this._rightNode, this._topNode, this._leftNode];
        for (var i = 0; i < MjClient.MaxPlayerNum_hongZi; i ++)
        {
            var pl = getUIPlayer_hongZi(i);
            if (!pl) 
                continue;

            cc.log("resetJiaZhuTip jiazhuNum = " + pl.jiazhuNum);
            if (pl.jiazhuNum != 1 && pl.jiazhuNum != 0)
                continue;

            var node = nodes[i];
            var tipNode = node.getChildByName("head").getChildByName("jiaZhuTip");
            var playTipNode = node.getChildByName("play_tips");
            var point = playTipNode.convertToWorldSpace(playTipNode.getChildByName("hu").getPosition());
            tipNode.setPosition(tipNode.parent.convertToNodeSpace(point));
            tipNode.visible = true;
            tipNode.opacity = 255;
            tipNode.ignoreContentAdaptWithSize(true);
            tipNode.setString(pl.jiazhuNum == 1 ? "举手做声" : "");
            tipNode.runAction(cc.sequence(cc.delayTime(1), cc.fadeOut(0.5), cc.callFunc(function(){ this.visible = false;}, tipNode)));
        }
    },

    refreshHeadLight:function(visible)
    {
        // 黄色头像框，现在产品又取消了
        // for (var i = 0; i < 4; i ++)
        // {
        //     var node = getNode(i);
        //     if (!node)
        //         continue;

        //     var light = node.getChildByName("head").getChildByName("light");
        //     var index = getPlayerIndex(i);
        //     light.setVisible(visible && MjClient.data.sData.tData.curPlayer == index);
        // }
    },


    /*
        判断当前是否可以出牌，add by sking
     */
    isCanPutCard:function(){
        var bPut = false;
        var downNode = MjClient.playui._downNode;
        var standUI = downNode.getChildByName("stand");
        var children = downNode.children;
        for(var i = 0; i < children.length; i++){
            if(children[i].name == "mjhand"){
                if(children[i].y > standUI.y + 10){
                    bPut = true;
                    break;
                }
            }
        }
        return bPut;
    }
});

//重置手牌的顺序
PlayLayer_HongZi.prototype.ResetHandCard = function(posNode,off, needAction, isDelay){
    if(off == 1 && posNode.getName() == "right" && MjClient.MaxPlayerNum_hongZi == 2){
        return;//2人玩法right节点同为玩家节点
    }
    needAction = needAction === undefined ? false : needAction;
    // needAction = false;
    var changeCardSize = 1;//ziPai.getCardSize() == 0 ? 1 : 0.8;// 手牌大小修改
    if(MjClient.rePlayVideo == -1){
        if(off == 0) {
            checkCard_hongZi(posNode, off);
            if(!needAction && !isDelay && MjClient.addGroupIndex != 0){
                refreshNode_hongZi(posNode,off,needAction);

                this.scheduleOnce(function(){
                    if(!MjClient.playui.isShufffling){
                        this.ResetHandCard(posNode,off,needAction,true);
                    }
                }.bind(this), 0.35);
                return;
            }

            var handNode = posNode.getChildByName("handNode");
            // if(!handNode) return;
            handNode.visible = true;
            handNode.removeAllChildren();
            var cardArr = MjClient.HandCardArr;
            cc.log("wxd.............MjClient.HandCardArr..............." + JSON.stringify(MjClient.HandCardArr));
            //清理空数组
            for (var k = cardArr.length - 1; k >= 0; k--) {
                if (cardArr[k].length == 0) {
                    cardArr.splice(k, 1);
                }
            }
            for (var k = 0; k < cardArr.length; k++) {
                var groupList = cardArr[k];
                for (var j = 0; j < groupList.length; j++) {
                    addHandCard_hongZi(k, j, groupList[j], off);
                }
            }

            addTingSign_hongZi(posNode); // 添加听牌角标

            var handCard = posNode.getChildByName("handCard");
            var type = ziPai.getZiPaiType();
            var sizeArr = [98,95,100];
            var width =sizeArr[type] * changeCardSize;; // handCard.getVirtualRendererSize().width; 
             
            var scale_x = handCard.scaleX;
            var winSize = MjClient.size;
            var totalWidth = width * cardArr.length * scale_x;
            for (var i = 0; i < cardArr.length; i++) {
                var addNode = handNode.getChildByTag(i);
                // addNode.setPosition(cc.p((winSize.width - totalWidth)/2 + i * width * scale_x,0)); 

                if (needAction) {
                    addNode.x = winSize.width * 0.5;
                    addNode.y = 100;
                    this._doMovetoAction(addNode, cc.p((winSize.width - totalWidth) / 2 + i * width * scale_x, 0));
                } else {
                    addNode.setPosition(cc.p((winSize.width - totalWidth) / 2 + i * width * scale_x, 0));
                }
            }
            postEvent("LY_addHandHuXi");
        }
    }else{
        //回放
        var handNode = null;
        var cardArr = null;
        var handCard = null;
        if(off == 0){
            if(MjClient.MaxPlayerNum_hongZi == 3 || MjClient.MaxPlayerNum_hongZi == 2){
                handNode = posNode.getChildByName("handNode");
                handCard = posNode.getChildByName("handCard");
            }else if(MjClient.MaxPlayerNum_hongZi == 4){
                handNode = posNode.getChildByName("replayNode");
                handCard = posNode.getChildByName("out0");
            }
            cardArr = MjClient.HandCardArr;
        }else {
            handNode = posNode.getChildByName("replayNode");
            handCard = posNode.getChildByName("out0");
            cardArr = MjClient.OtherHandArr[off];
        }
        handNode.visible = true;
        handNode.removeAllChildren();

        //if(MjClient.movingCard_hongZi && MjClient.movingCard_hongZi.getParent()){
        //    MjClient.movingCard_hongZi.removeFromParent(true);
        //    MjClient.movingCard_hongZi = null;
        //}
        //if(MjClient.cloneCard && MjClient.cloneCard.getParent()){
        //    MjClient.cloneCard.removeFromParent(true);
        //    MjClient.cloneCard = null;
        //}

        //清理空数组
        if(!cardArr){
            return;
        }
        for(var k = cardArr.length - 1;k >=0;k--){
            if(cardArr[k].length == 0){
                cardArr.splice(k,1);
            }
        }
        for(var k = 0;k < cardArr.length;k++){
            var groupList = cardArr[k];
            for(var j = 0;j < groupList.length;j++){
                if(off == 0){
                    if(MjClient.MaxPlayerNum_hongZi == 3 || MjClient.MaxPlayerNum_hongZi == 2){
                        addHandCard_hongZi(k,j,groupList[j],off);
                    }else if(MjClient.MaxPlayerNum_hongZi == 4){
                        addHandCardReplay_hongZi(k,j,groupList[j],off);
                    }
                }else {
                    addHandCardReplay_hongZi(k,j,groupList[j],off);
                }
            }
        }

        if(off == 0 && (MjClient.MaxPlayerNum_hongZi == 3 || MjClient.MaxPlayerNum_hongZi == 2)) {
            var scale_x = handCard.scaleX;
            var winSize = MjClient.size;
            var totalWidth = handCard.width * cardArr.length * scale_x;
            for(var i = 0;i < cardArr.length;i++){
                var addNode = handNode.getChildByTag(i);
                addNode.setPosition(cc.p((winSize.width - totalWidth)/2 + i * handCard.width * scale_x,0));
            }
        }
        cc.log("================off:" + off +"----------"+JSON.stringify(cardArr));
    }
};

PlayLayer_HongZi.prototype._doMovetoAction = function(node,endP){
    node.stopAllActions();
    var ac = cc.moveTo(0.3,endP);
    node.runAction(ac);
};

PlayLayer_HongZi.prototype.rightMaxPlayerNum = function(){
    return MjClient.MaxPlayerNum_hongZi == 2 ? 1 :  MjClient.MaxPlayerNum_hongZi - 2; 
    // return 1;
};


PlayLayer_HongZi.prototype.ResetOtherCard = function(posNode, off) {
    // 添加吃、碰、跑、偎、提
    var sData = MjClient.data.sData;
    var tData = null;
    if (sData) {
        tData = sData.tData;
    }

    var eatNode = posNode.getChildByName("eatNode");
    eatNode.visible = true;
    eatNode.removeAllChildren();
    var pl = getUIPlayer_hongZi(off);
    if (!pl) return;
    var mjSortArr = pl.mjsort;
    cc.log("=====off=====:" + off + "mjSortArr:" + JSON.stringify(mjSortArr));
    if (mjSortArr) {
        var childArr = null;

        // 提/偎牌的特殊处理
        // var callback = function(childList) {
        //     var cardNum = pl.mjwei[pos];
        //     var skipPeng = pl.skipPeng;
        //     for (var i = 0; i < childList.length; i++) {
        //         var child = childList[i];
        //         // var maxPlayer = MjClient.data.sData.tData.maxPlayer;
        //         // if ((i == 0 && maxPlayer - off <= 2) || (i == childList.length - 1 && maxPlayer - off > 2)) {

        //         // } else {
        //         //     child.loadTexture(MjClient.cardPath_hongZi + "huxiBG.png");
        //         // }
                
        //         var chiTip = childList.length == 3 ? "wei" : "ti";
        //         if (i != getShowCardIdx_hongZi(posNode, chiTip)) {
        //             child.loadTexture(MjClient.cardPath_hongZi + "huxiBG.png");
        //         }

        //     }
        // };

        // var callback1 = function(childList) {
        //     var cardNum = pl.mjwei[pos];
        //     var skipPeng = pl.skipPeng;
        //     for (var i = 0; i < childList.length; i++) {
        //         var child = childList[i];
        //         if (off == 0) {
        //             var shade = new cc.Sprite("playing/paohuzi/huxiBG1.png");
        //             shade.opacity = 100;
        //             shade.x = shade.width / 2;
        //             shade.y = shade.height / 2;
        //             child.addChild(shade);
        //         } else {
        //             child.loadTexture(MjClient.cardPath_hongZi + "huxiBG.png");
        //         }
        //     }
        // };

        for (var k = 0; k < mjSortArr.length; k++) {
            var mjsort = mjSortArr[k];
            var pos = mjsort.pos;
            var name = mjsort.name;
            //提
            // if (name == "mjgang1") {
            //     var cardNum = pl.mjgang1[pos];
            //     for (var i = 0; i < 4; i++) {
            //         addEatCard_hongZi(posNode, "mjgang1" + k, cardNum, off);
            //     }

            //     var tiParentNode = eatNode.getChildByName("mjgang1" + k);
            //     var childArr = tiParentNode.children;
            //     if (MjClient.majiang.getCardShowType(pl.info.uid, cardNum) == 2) {
            //         callback(childArr);
            //     } else {
            //         callback1(childArr);
            //     }
            // }
            //偎
            // if (name == "mjwei") {
            //     var cardNum = pl.mjwei[pos];
            //     for (var i = 0; i < 3; i++) {
            //         addEatCard_hongZi(posNode, "mjwei" + k, cardNum, off);
            //     }

            //     var weiParentNode = eatNode.getChildByName("mjwei" + k);
            //     var childArr = weiParentNode.children;
            //     var skipPeng = pl.skipPeng;
            //     cc.log("MjClient.majiang.getCardShowType(pl.info.uid, cardNum)@@ " + MjClient.majiang.getCardShowType(pl.info.uid, cardNum));
            //     if (MjClient.majiang.getCardShowType(pl.info.uid, cardNum) == 2) {
            //         callback(childArr);
            //         // if(!skipPeng || skipPeng.indexOf(cardNum) < 0){
            //         //     callback(childArr);
            //         // }else{
            //         //     for(var i = 0;i < childArr.length;i++){
            //         //         var child = childArr[i];
            //         //         if(i != childArr.length-1){
            //         //             child.loadTexture(MjClient.cardPath_hongZi+"huxiBG.png");
            //         //         }
            //         //     }
            //         // }
            //     } else {
            //         if (!skipPeng || skipPeng.indexOf(cardNum) < 0) { //不是臭偎
            //             callback1(childArr);
            //         } else {
            //             for (var i = 0; i < childArr.length; i++) {
            //                 var child = childArr[i];
            //                 if (i != childArr.length - 1) {
            //                     child.loadTexture(MjClient.cardPath_hongZi + "huxiBG.png");
            //                 }
            //             }
            //         }
            //     }
            //     // if(!skipPeng || skipPeng.indexOf(cardNum) < 0){
            //     //     callback(childArr);
            //     // }else{
            //     //     for(var i = 0;i < childArr.length;i++){
            //     //         var child = childArr[i];
            //     //         if(i != childArr.length-1){
            //     //             child.loadTexture(MjClient.cardPath_hongZi+"huxiBG.png");
            //     //         }
            //     //     }
            //     // }
            // }
            //跑
            if (name == "mjgang0") {
                var cardNum = pl.mjgang0[pos];
                for (var i = 0; i < 4; i++) {
                    addEatCard_hongZi(posNode, "mjgang0" + k, cardNum, off);
                }
            }
            //碰
            if (name == "mjpeng") {
                var cardNum = pl.mjpeng[pos];
                for (var i = 0; i < 3; i++) {
                    addEatCard_hongZi(posNode, "mjpeng" + k, cardNum, off);
                }
            }
            //吃
            if (name == "mjchi") {
                var cardNum = pl.mjchi[pos];
                var eatCards = pl.mjchi[pos].eatCards;
                for (var i = 0; i < eatCards.length; i++) {
                    addEatCard_hongZi(posNode, "mjchi" + k, eatCards[i], off);
                }
                var biCards = pl.mjchi[pos].biCards;
                if (biCards && biCards.length > 0) {
                    for (var i = 0; i < biCards.length; i++) {
                        var biArr = biCards[i];
                        for (var m = 0; m < biArr.length; m++) {
                            addEatCard_hongZi(posNode, "mjbi" + k + i, biArr[m], off);
                        }
                    }
                }

                var mjchiCardArr = pl.mjchiCard;
                var chiParentNode = eatNode.getChildByName("mjchi" + k);
                if (chiParentNode) {
                    var childArr = chiParentNode.children;
                    // for(var i = 0;i < childArr.length;i++){
                    //     if(childArr[i].tag == mjchiCardArr[pos] && ){
                    //         childArr[i].setColor(cc.color(170, 170, 170));
                    //         break;
                    //     }
                    // }
                    // 耒阳吃牌放在最上面一张
                    if (childArr.length > 0 && childArr[childArr.length - 1].tag == mjchiCardArr[pos]) {
                        childArr[childArr.length - 1].setColor(cc.color(170, 170, 170));
                    }
                }

                if (biCards && biCards.length > 0) {
                    for (var i = 0; i < biCards.length; i++) {
                        var chiParentNode = eatNode.getChildByName("mjbi" + k + i); // "mjbi32"
                        if (chiParentNode) {
                            var childArr = chiParentNode.children;
                            // for(var m = 0;m < childArr.length;m++){
                            //     if(childArr[m].tag == mjchiCardArr[pos]){
                            //         childArr[m].setColor(cc.color(170, 170, 170));
                            //         break;
                            //     }
                            // }

                            // 比牌放在最上面一张
                            if (childArr.length > 0 && childArr[childArr.length - 1].tag == mjchiCardArr[pos]) {
                                childArr[childArr.length - 1].setColor(cc.color(170, 170, 170));
                            }
                        }
                    }
                }
            }
        }
    }

    //添加打出的牌
    //var outNode = posNode.getChildByName("outNode");
    //outNode.visible = true;
    //outNode.removeAllChildren();
    //var sData = MjClient.data.sData;
    //var tData = sData.tData;
    //var curUId = tData.uids[tData.curPlayer];
    //for(var i = 0; i < pl.mjput.length; i++){
    //    if(curUId == pl.info.uid && i == pl.mjput.length - 1 && tData.currCard == pl.mjput[i]){
    //        continue;
    //    }
    //    var childCount = outNode.childrenCount;
    //    var outCard = getNewCard_hongZi(pl.mjput[i], 2, off);
    //    if(off == 0){
    //        outCard.anchorX = 1;
    //        outCard.anchorY = 0;
    //        outCard.x = outNode.width - childCount * outCard.width;
    //        outCard.y = 0;
    //    }else if(off == 1){
    //        outCard.anchorX = 1;
    //        outCard.anchorY = 1;
    //        outCard.x = outNode.width - childCount * outCard.width;
    //        outCard.y = outNode.height;
    //    }else if(off == 2){
    //        outCard.anchorX = 0;
    //        outCard.anchorY = 1;
    //        outCard.x = childCount * outCard.width;
    //        outCard.y = outNode.height;
    //    }
    //    outNode.addChild(outCard);
    //}
};

PlayLayer_HongZi.prototype.ResetPutCard = function(posNode,off){
    if(off == 1 && posNode.getName() == "right" && MjClient.MaxPlayerNum_hongZi == 2){
        return;//2人玩法right节点同为玩家节点
    }
    //添加打出的牌
    var pl = getUIPlayer_hongZi(off);
    if (!pl) return;
    var outNode = posNode.getChildByName("outNode");
    outNode.visible = true;
    outNode.removeAllChildren();
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var curUId = tData.uids[tData.curPlayer];

    var type = ziPai.getUiLayoutType();
    if(type == 0 && MjClient.data.sData.tData.maxPlayer < 4){
        //新布局 偏右
        for(var i = 0; i < pl.mjput.length; i++){
            if(curUId == pl.info.uid && i == pl.mjput.length - 1 && tData.currCard == pl.mjput[i]){
                continue;
            }
            var offestX = Math.floor(i % 6);
            var offestY = Math.floor(i / 6);

            var outCard = getNewCard_hongZi(pl.mjput[i], 2, off);
            if(off == 0){
                outCard.anchorX = 1;
                outCard.anchorY = 0;
                outCard.x = outNode.width - offestX * outCard.width;
                outCard.y = offestY * outCard.height;
            }else if(off == 1){
                if(MjClient.data.sData.tData.maxPlayer == 2){
                    outCard.anchorX = 0;
                    outCard.anchorY = 1;
                    outCard.x = offestX * outCard.width;
                    outCard.y = outNode.height + offestY * outCard.height;
                }else{
                    outCard.anchorX = 1;
                    outCard.anchorY = 1;
                    outCard.x = outNode.width - offestX * outCard.width;
                    outCard.y = outNode.height + offestY * outCard.height;
                }

            }else if(off == 2){
                outCard.anchorX = 0;
                outCard.anchorY = 1;
                outCard.x = offestX * outCard.width;
                outCard.y = outNode.height + offestY * outCard.height;
            }
            outNode.addChild(outCard);
        }
    }else{
        for(var i = 0; i < pl.mjput.length; i++){
            if(curUId == pl.info.uid && i == pl.mjput.length - 1 && tData.currCard == pl.mjput[i]){
                continue;
            }
            var offestX = Math.floor(i % 6);
            var offestY = Math.floor(i / 6);
            var outCard = getNewCard_hongZi(pl.mjput[i], 2, off);
            if(MjClient.data.sData.tData.maxPlayer < 4){
                if(off == 0){
                    outCard.anchorX = 1;
                    outCard.anchorY = 0;
                    outCard.x = outNode.width - offestX * outCard.width;
                    outCard.y = offestY * outCard.height;
                }else if(off == 1){
                    if(MjClient.data.sData.tData.maxPlayer == 2){
                        outCard.anchorX = 0;
                        outCard.anchorY = 1;
                        outCard.x = i * outCard.width;
                        outCard.y = outNode.height;
                    }else{
                        outCard.anchorX = 1;
                        outCard.anchorY = 1;
                        outCard.x = outNode.width - i * outCard.width;
                        outCard.y = outNode.height;
                    }

                }else if(off == 2){
                    outCard.anchorX = 0;
                    outCard.anchorY = 1;
                    outCard.x = i * outCard.width;
                    outCard.y = outNode.height;
                }
            }else{
                if(off == 0){
                    outCard.anchorX = 0;
                    outCard.anchorY = 0;
                    outCard.x = outNode.width - i * outCard.width;
                    outCard.y = 0;
                }else if(off == 1){
                    outCard.anchorX = 1;
                    outCard.anchorY = 0;
                    outCard.x = outNode.width - i * outCard.width;
                    outCard.y = 0;
                }else if(off == 2){
                    outCard.anchorX = 1;
                    outCard.anchorY = 1;
                    outCard.x = outNode.width - offestX * outCard.width;
                    outCard.y = outNode.height;
                }else if(off == 3){
                    outCard.anchorX = 0;
                    outCard.anchorY = 1;
                    outCard.x = i * outCard.width;
                    outCard.y = outNode.height;
                }
            }
            outNode.addChild(outCard);
        }
    }
};

//重置牌的顺序
PlayLayer_HongZi.prototype.CardLayoutRestore = function(posNode,off){
    if(MjClient.rePlayVideo == -1){
        this.ResetHandCard(posNode,off);
    }else{
        //回放时不执行发牌动画
        this.ResetHandCard(posNode,off);
    }
    this.ResetOtherCard(posNode,off);
    this.ResetPutCard(posNode,off);
};

PlayLayer_HongZi.prototype.ShowHuTypeText = function(){
    var pl = getUIPlayer_hongZi(0);
    cc.log("test . log ----------------------");   

    if(pl){
        var sData = MjClient.data.sData;
        var tData = sData.tData;
        var huData = MjClient.majiang.getHuInfo(sData,pl,tData.currCard);

        var nameObj = {heiHu:"黑胡", dianHu: "点胡", shiHong: "十红", manTangHong: "满堂红", xiaoYiSe: "小一色", 
                        daYiSe: "大一色", qiDui: "7对", pengPengHu: "碰碰胡", juJuHong: "句句红", yiGuaBian: "一挂匾",
                        huDieFei: "蝴蝶飞", banBanHu: "板板胡",siPengDanDiao: "四碰单吊", shuangHe:"双合",shiErHong:"十二红",
                        shiYiHong: "十一红", fengDing: "80分封顶", huaHu:"花胡"}; 
        var str = ""; 
        var hzdescNum = 0; // 番型的种类  
        for (var k in huData.hzdesc) {
            str += (nameObj[k] + " " + huData.hzdesc[k] + "分" );
            hzdescNum++;
            var text = huData.hzdesc[k];  
        }

        cc.log(JSON.stringify(huData));
        if(str.length <= 0){ 
            str = "小胡 " + huData.score + "分";
        }else if(hzdescNum > 1){
            str = "大胡 " + huData.score + "分";
        }
        var eat = MjClient.playui.jsBind.eat;
        var huText = eat.hu._node.getChildByName("huTypeText");   
        huText.setString(str);

    }

};


// 判断吃、碰、跑、偎、提、胡的状态
PlayLayer_HongZi.prototype.EatVisibleCheck = function(off){
    var eat = MjClient.playui.jsBind.eat;
    //sk 为啥要隐藏掉？   //因为一开始是不可见的，隐藏根节点 by sking
    // MjClient.playui.jsBind.eat.changeui.changeuibg._node.visible = false;
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var leftCard = MjClient.majiang.getAllCardsTotal() - tData.cardNext;

    eat.chi._node.visible = false;
    eat.peng._node.visible = false;
    eat.hu._node.visible = false;
    eat.guo._node.visible = false;
    eat.cancel._node.visible = false;
    eat.wangDiao._node.visible = false;
    eat.wangChuang._node.visible = false;
    eat.wangZha._node.visible = false;
    eat.chiSelect._node.visible = false;
    eat.biSelect._node.visible = false;
    eat.biSelect1._node.visible = false;
    eat.chiBg._node.visible = false;

    eat.chi._node.setTouchEnabled(false);
    eat.peng._node.setTouchEnabled(false);
    eat.hu._node.setTouchEnabled(false);
    eat.guo._node.setTouchEnabled(false);
    eat.cancel._node.setTouchEnabled(false);
    eat.wangDiao._node.setTouchEnabled(false);
    eat.wangChuang._node.setTouchEnabled(false);
    eat.wangZha._node.setTouchEnabled(false);
    eat.chiSelect._node.setTouchEnabled(false);
    eat.biSelect._node.setTouchEnabled(false);
    eat.biSelect1._node.setTouchEnabled(false);
    
    var pl = sData.players[SelfUid() + ""];
    if (!pl) return;
    MjClient.gangCards = [];
    MjClient.eatpos = [];
    var mj = MjClient.majiang;
    //吃碰杠胡node
    var vnode = [];
    //自摸getUIPlayer_hongZi
    if(tData.tState != TableState.roundFinish && pl.mjState != TableState.roundFinish){
        if(IsTurnToMe()){ 
            //胡
            if(pl.eatFlag & 32) {
                vnode.push(eat.hu._node); 
                MjClient.playui.ShowHuTypeText();
            }

            // 碰
            if (pl.eatFlag & 2) {
                vnode.push(eat.peng._node);
            }

            //吃
            if(pl.eatFlag & 1){
                vnode.push(eat.chi._node);
            } 

            if(vnode.length > 0){
                vnode.push(eat.guo._node);
                isCheckedTing = false;
            }
        }
        if(!IsTurnToMe()){
            //胡
            if(pl.eatFlag & 32){
                vnode.push(eat.hu._node);  
                MjClient.playui.ShowHuTypeText();
            } 
            //碰
            if(pl.eatFlag & 2){
                vnode.push(eat.peng._node);
            }
            //吃
            if(pl.eatFlag & 1){
                    vnode.push(eat.chi._node);
            } 

            if(vnode.length > 0){
                vnode.push(eat.guo._node);
                isCheckedTing = false;
            }
        }
    }

    //吃碰杠胡过处理
    if(vnode.length > 0){
        var btnImgs ={
            "peng": ["playing/paohuzi/youxizhong-27.png", "playing/paohuzi/youxizhong-27.png"],
            "gang": ["playing/gameTable/youxizhong-2_55.png", "playing/gameTable/youxizhong-2_05.png"],
            "chi": ["playing/paohuzi/youxizhong-274.png", "playing/paohuzi/youxizhong-274.png"],
        }

        for(var i = 0; i < vnode.length; i++){
            vnode[i].visible = true;
            vnode[i].setTouchEnabled(true);
            vnode[i].setBright(true);
            if(vnode[i].getChildByName("card1")){
                vnode[i].getChildByName("card1").visible = false;
            }

            if(vnode[i].getChildByName("bgground")){
                vnode[i].getChildByName("bgground").visible = false;
            }

            if(vnode[i].getChildByName("bgimg")){
                vnode[i].getChildByName("bgimg").visible = true;
            }

            var btnName = vnode[i].name;
            if(btnName == "peng" || btnName == "chi0" || btnName == "gang0"){
                vnode[i].loadTextureNormal(btnImgs[btnName][0]);
                vnode[i].loadTexturePressed(btnImgs[btnName][1]);
            }

            if(i == 0){
                var cardVal = 0;
                if (vnode[i].getChildByName("bgimg")) {
                    vnode[i].getChildByName("bgimg").visible = false;
                }

                if (btnName == "peng" || btnName == "chi0" || btnName == "gang0") {
                    vnode[i].loadTextureNormal(btnImgs[btnName][0]);
                    vnode[i].loadTexturePressed(btnImgs[btnName][1]);
                }

                if (btnName == "peng") {
                    cardVal = tData.lastPutCard;
                } else if (btnName == "chi0") {
                    if (MjClient.eatpos.length == 1) {
                        cardVal = tData.lastPutCard;
                    }
                } else if (btnName == "gang0") {
                    if (MjClient.gangCards.length == 1) {
                        cardVal = MjClient.gangCards[0];
                    }
                } else if (btnName == "hu") {
                    if (IsTurnToMe()) {
                        cardVal = pl.mjhand[pl.mjhand.length - 1];
                    } else {
                        cardVal = tData.lastPutCard;
                    }
                }

                if (cardVal && cardVal > 0) {
                    // setCardSprite(vnode[0].getChildByName("card1"), cardVal, 0);
                    // vnode[0].getChildByName("card1").visible = true;
                }

                if (vnode[0].getChildByName("bgground")) {
                    vnode[0].getChildByName("bgground").zIndex = -1;
                    vnode[0].getChildByName("bgground").visible = true;
                }

                //屏蔽到 碰 ，杠 的显示牌 add by sking
                if (vnode[0].getChildByName("bgground")) {
                    vnode[0].getChildByName("bgground").visible = false;
                }
                if (vnode[i].getChildByName("card1")) {
                    vnode[i].getChildByName("card1").visible = false;
                }
            }
            setWgtLayout(vnode[i], [0, 0.20], [0.5, 0.18], [(i - (vnode.length - 1) / 2) * 1.3, 1.8], false, false);
            if(ziPai.getUiLayoutType() == 0){
                setWgtLayout(vnode[i], [0, 0.20], [0.75, 0.11], [ (i - (vnode.length - 1) / 2) * 1, 1.8], false, false);
            }
        }
    }
};
PlayLayer_HongZi.prototype.showAndHideHeadEffect = function(){
    var arr = [this._downNode, this._rightNode, this._topNode];
    if (MjClient.MaxPlayerNum_hongZi == 4)
    {
        arr = [this._downNode, this._xingNode, this._rightNode, this._topNode];
    }else if (MjClient.MaxPlayerNum_hongZi == 2)
    {
        arr = [this._downNode, this._topNode];
    }

    var tData = MjClient.data.sData.tData;
    var uids = tData.uids;

    var curPlayerNode = null;
    if (curPlayerIsMe_hongZi(0)){
        curPlayerNode = arr[0].getChildByName("head");
    }
    else if (curPlayerIsMe_hongZi(1)){
        curPlayerNode = arr[1].getChildByName("head");
    }else if (curPlayerIsMe_hongZi(2)){
        curPlayerNode = arr[2].getChildByName("head");
    }else if (curPlayerIsMe_hongZi(3)){
        curPlayerNode = arr[3].getChildByName("head");
    }

    var tag = 2018322;
    this._downNode.getChildByName("head").removeChildByTag(tag, true);
    this._topNode.getChildByName("head").removeChildByTag(tag, true);
    this._rightNode.getChildByName("head").removeChildByTag(tag, true);
    this._xingNode.getChildByName("head").removeChildByTag(tag, true);
    if (curPlayerNode)
    {
        var _armature = curPlayerNode.getChildByTag(tag);
        if(_armature && cc.sys.isObjectValid(_armature)){
            _armature.stopAllActions();
            _armature.removeFromParent(true);
            _armature = null;
        }

        if (MjClient.data.sData.tData.tState == TableState.waitReady || MjClient.data.sData.tData.tState == TableState.roundFinish){
            return;
        }

        cc.spriteFrameCache.addSpriteFrames("playing/paohuzi/effect/djs/djs0.plist","playing/paohuzi/effect/djs/djs0.png");
        ccs.armatureDataManager.addArmatureFileInfo("playing/paohuzi/effect/djs/djs.ExportJson");
        var _armature = new ccs.Armature("djs");
        _armature.scale = curPlayerNode.getChildByName("headBox").width / _armature.width;
        _armature.animation.play("Animation1");
        _armature.setPosition(curPlayerNode.width/2, curPlayerNode.height/2 + 15);
        _armature.setTag(tag);
        _armature.getAnimation().setSpeedScale(0.5);
        curPlayerNode.addChild(_armature);
    }
};