var actionZindex = 1000;

// off 是四个位置，根据off 显示四个位置的信息 by sking
function SetUserVisible_ganDengYan(node, off)
{
    var pl = getUIPlayer(off);
    var head = node.getChildByName("head");
    var name = head.getChildByName("name");
    var nobody = head.getChildByName("nobody");
    var coin = head.getChildByName("coin");
    var offline = head.getChildByName("offline");
    var name_bg = head.getChildByName("name_bg");
    var score_bg = head.getChildByName("score_bg");

    if(pl)
    {
        name.visible = true;
        coin.visible = true;
        offline.visible = true;
        coin.visible = true;
        name_bg.visible = true;
        score_bg.visible = false;
        MjClient.loadWxHead(pl.info.uid, pl.info.headimgurl);
        setUserOffline(node, off);
        InitUserHandUI_ganDengYan(node, off);

        if (off === 0)
        {
            MjClient.playui.coinMyself.setString(MjClient.data.sData.tData.initCoin + pl.winall);
        }
    }
    else
    {
        name.visible = false;
        coin.visible = false;
        offline.visible = false;
        coin.visible = false;
        name_bg.visible = false;
        score_bg.visible = false;
        var WxHead = nobody.getChildByName("WxHead");
        if(WxHead)
            WxHead.removeFromParent(true);
    }
}


function InitUserHandUI_ganDengYan(node, off)
{
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var pl = getUIPlayer(off);

    if(!pl)
    {
        return;
    }

    //初始化玩家金币和名称
    InitUserCoinAndName(node, off);
    setAreaTypeInfo(true);
    //currentLeftCardCount_paodekuai(off);

    if(
        tData.tState != TableState.waitPut &&
        tData.tState != TableState.waitEat &&
        tData.tState != TableState.waitCard
    )
    {
        return;
    }

    //添加手牌
    if(MjClient.rePlayVideo == -1)// 表示正常游戏
    {
        if (pl.mjhand && off == 0) {//只初始化自己的手牌
            var vcard = [];
            for (var i = 0; i < pl.mjhand.length; i++) {

                var card = getNewCard_card(node, "stand", "mjhand", pl.mjhand[i], off);
                var index = vcard.indexOf(pl.mjhand[i]);//区分2张一样的牌
                if(index >= 0)
                {
                    card.setUserData(1);
                }
                else
                {
                    card.setUserData(0);
                }
                vcard.push(pl.mjhand[i]);
            }
        }
        else if (off > 0) {

        }
    }
    else
    {
        /*
            播放录像
        */
        if (pl.mjhand)
        {
            if(off == 0)
            {
                for (var i = 0; i < pl.mjhand.length; i++) {
                    getNewCard_card(node, "stand", "mjhand", pl.mjhand[i], off);
                }
            }
            else
            {
                for (var i = 0; i < pl.mjhand.length ; i++) {
                    getNewCard_card(node, "stand", "mjhand_replay", pl.mjhand[i], off);
                }
            }
        }
    }

    MjClient.playui.CardLayoutRestore(node, off);
}
   
var PlayLayer_ganDengYan = cc.Layer.extend({
    _btnPutCard:null,
    jsBind: {
        _event: {
            mjhand: function() {
                if(MjClient.endoneui != null)
                {
                    cc.log("=======mjhand====endoneui====" + typeof (MjClient.endoneui) );
                    MjClient.endoneui.removeFromParent(true);
                    MjClient.endoneui = null;
                }

                var sData = MjClient.data.sData;
                var tData = sData.tData;
                // resetFlowerNum(this);
                // resetJiaZhuNum(this);
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
                    if(cc.sys.OS_WINDOWS != cc.sys.os)
                    {
                        //AlertSameIP(ipmsg.join("\n"));
                    }
                }
                mylog("ipmsg " + ipmsg.length);

            },
            LeaveGame: function() {
                MjClient.addHomeView();
                MjClient.playui.removeFromParent(true);
                delete MjClient.playui;
                delete MjClient.endoneui;
                delete MjClient.endallui;
                cc.audioEngine.stopAllEffects();
                playMusic("bgMain");
            },
            endRoom: function(msg) {
                mylog(JSON.stringify(msg));
                if (msg.showEnd) this.addChild(new GameOverLayer_ganDengYan(),500);
                else
                    MjClient.Scene.addChild(new StopRoomView());
            },
            roundEnd: function() {
                MjClient.selectTipCardsArray = null;
                
                var self = this;
                function delayExe()
                {
                    self.addChild(new EndOneView_GanDengYan(),500);
                }
                this.runAction(cc.sequence(cc.DelayTime(1.0),cc.callFunc(delayExe)));
            },
            moveHead: function() {
                postEvent("returnPlayerLayer");
                tableStartHeadMoveAction_card(this);
            },
            initSceneData: function() {
                //初始化桌子的客户端数据
                MjClient.playui.InitC_Data();

                reConectHeadLayout_card(this);
                CheckRoomUiDelete();
                var sData = MjClient.data.sData;
                var tData = sData.tData;
                if (tData.tState == TableState.waitPut) {
                    UpdataCurrentPutCard();
                }

                if(MjClient.data.sData.tData.tState <= TableState.waitReady)
                {
                    sendGPS();
                    MjClient.checkChangeLocationApp();
                }
            },
            onlinePlayer: function(msg) {
                if(msg.uid == SelfUid()){
                    reConectHeadLayout_card(this);
                }
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
            changePKImgEvent: function() {
                changePKImg(this, getCurrentPKImgType());
            },
            PKPut: function(eD) {
                MjClient.clockNode.visible = false;
            },
            PKPass:function(eD)
            {
                MjClient.clockNode.visible = false;
            },
            waitReady: function(){
                reConectHeadLayout_card(this);
            }
        },
        back: {
            roundInfo: {
                _layout: [
                    [0.12, 0.12],
                    [0.5, 0.5],
                    [0, 0]
                ],
                _run: function() {
                    this.ignoreContentAdaptWithSize(true);
                    this.setString(MjClient.playui.getGameInfoString("roundInfo"));
                },
                _event:{
                    mjhand:function()
                    {
                        var str = MjClient.playui.getGameInfoString("roundInfo");
                        this.setString(str);
                    },
                }
            },
            back: {
                 _run: function() {
                    changeGameBg(this);
                 },
                _event: {
                    changeGameBgEvent: function() {
                        changeGameBg(this);
                    }
                },
                _layout: [
                    [1, 1],
                    [0.5, 0.5],
                    [0, 0], true
                ],
            },
            dikuang:{
                _layout: [
                    [1, 0],
                    [0.5, 0.0],
                    [0, 0]
                ],
            },
            image_di: {
                _layout: [
                    [1, 0],
                    [0.5, 0.0],
                    [0, 0]
                ],
                _visible: false,
                _event: {
                    mjhand: function() {
                        // this.setVisible(true);
                    },
                    roundEnd: function() {
                        this.setVisible(false);
                    }
                }
            }
        },
        gameName: {
            _layout: [
                [0.2, 0.2],
                [0.5, 0.58],
                [0, 0]
            ],
        },
        banner: {
            _layout: [
                [0.18, 0.07],
                [0.08, 0.98],
                [0, 0]
            ],
            text_time: {
                _run: function() {
                    this.ignoreContentAdaptWithSize(true);
                    this.schedule(function() {
                        var time = MjClient.getCurrentTime();
                        var str = (time[3] < 10 ? "0" + time[3] : time[3]) + ":" +
                            (time[4] < 10 ? "0" + time[4] : time[4]);
                        this.setString(str);
                    });
                }
            },
            wifi: {
                _run: function() {
                    MjClient.playui.updateWifiState(this);
                }
            },
            powerBar: {
                _event: {
                    nativePower: function(d) {
                        this.setPercent(Number(d));
                    }
                },
                _run: function() {
                    updateBattery(this);
                },
            },
            text_juNum: {
                _run: function() {
                    var tData = MjClient.data.sData.tData;
                    var str = (tData.roundAll - tData.roundNum + 1) + "/" + tData.roundAll + "局";
                    this.setString(str);
                    this.ignoreContentAdaptWithSize(true);
                },
                _event: {
                    mjhand: function() {
                        var tData = MjClient.data.sData.tData;
                        var str = (tData.roundAll - tData.roundNum + 1) + "/" + tData.roundAll + "局";
                        this.setString(str);
                    },
                }
            },
            
            tableid: {
                _run: function() {
                    this.ignoreContentAdaptWithSize(true);
                    this.setString(MjClient.data.sData.tData.tableid);
                },
                _event: {
                    initSceneData: function() {
                        this.ignoreContentAdaptWithSize(true);
                        this.setString(MjClient.data.sData.tData.tableid);
                    }
                }
            },
        },
        clock: {
            _run:function () {
                setWgtLayout(this,[0.073, 0.18],[0.5,0.58],[0,0]);

                MjClient.clockNode = this;
                this.visible = false;
                this.zIndex = 100;
                this.srcPosition = this.getPosition();

                this.srcZIndex = this.zIndex;
            },
            number: {
                _run: function() {
                    this.ignoreContentAdaptWithSize(true);
                },
                _event: {
                    initSceneData: function() {
                        if (MjClient.data.sData.tData.tState == TableState.waitPut)
                        {
                            MjClient.clockNode.visible = true;
                            this.setString("00");
                            MjClient.playui.updateClockPosition(MjClient.clockNode);
                        }
                    },
                    waitPut: function() {
                        this.stopAllActions();
                        MjClient.clockNode.visible = true;
                        stopEffect(playTimeUpEff);
                        MjClient.playui.clockNumberUpdate(this);
                        MjClient.playui.updateClockPosition(MjClient.clockNode);
                    },
                    PKPut: function(msg) {
                        if (msg.uid == SelfUid()) {
                            this.stopAllActions();
                            stopEffect(playTimeUpEff);
                            playTimeUpEff = null;
                            //MjClient.playui.clockNumberUpdate(this);
                            this.setString("00");
                        }
                    },
                    roundEnd: function() {
                        this.stopAllActions();
                        stopEffect(playTimeUpEff);
                        playTimeUpEff = null;
                    },
                    onlinePlayer: function() {
                        MjClient.clockNode.visible = false;
                    },
                    LeaveGame: function() {
                        this.stopAllActions();
                        stopEffect(playTimeUpEff);
                        playTimeUpEff = null;
                        MjClient.clockNode.visible = false;
                    },
                    SetChatTextVisible: function(bVisible) {
                        MjClient.clockNode.zIndex = bVisible ? 0 : MjClient.clockNode.srcZIndex;
                    }
                }
            },
        },
        BtnReady: {
            _visible: false,
            _run: function() {
                setWgtLayout(this, [0.18, 0.18], [0.5, 0.23], [0, 0]);
            },
            _click: function(_this) {
                PKPassConfirmToServer_card();
                MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Zhunbei", {uid: SelfUid(), gameType:MjClient.gameType});
            },
            _event: {
                waitReady: function() {
                    this.visible = true;
                },
                mjhand: function() {
                    this.visible = false;
                },
                initSceneData: function() {
                    this.visible = false;
                    var tData = MjClient.data.sData.tData;
                    var pl = getUIPlayer(0);
                    this.visible = tData.roundNum == tData.roundAll && tData.tState == TableState.waitReady && pl.mjState == TableState.waitReady && !IsInviteVisible();
                },
                PKPass: function() {
                    this.visible = false;
                },
                removePlayer: function(eD) {
                    this.visible = false;
                },
                onlinePlayer: function(msg) {
                    if (msg.uid == SelfUid()) {
                        this.visible = false;
                    }
                },
            }
        },
        BtnHimt:{ //add by  sking for put card button
            _run: function () {
                this.visible = false;

                if(isIPhoneX())
                    setWgtLayout(this,[0.15, 0.14], [0.52, 0.43], [0, 0.26]);
                else
                    setWgtLayout(this,[0.15, 0.14], [0.52, 0.36], [0, 0.26]);
            },
            _click: function(btn) {
                putOutCardTips();
                playEffect("guandan/tishi");
            },
            _event:{
                PKPut: function(eD) {
                    this.visible = false;
                },
                waitPut: function() {
                    var tData = MjClient.data.sData.tData;
                    this.visible = IsTurnToMe() && tData.tState == TableState.waitPut && tData.lastPutPlayer != tData.curPlayer && tData.lastPutPlayer != -1;
                },
                initSceneData: function()
                {
                    var tData = MjClient.data.sData.tData;
                    this.visible = IsTurnToMe() && tData.tState == TableState.waitPut && tData.lastPutPlayer != tData.curPlayer && tData.lastPutPlayer != -1;
                },
            }
        },//end of add by sking
        BtnNoPut:{
            _run: function () {
                this.visible = false;
                if(isIPhoneX())
                    setWgtLayout(this,[0.15, 0.14], [0.525, 0.43], [-1.3, 0.26]);
                else
                    setWgtLayout(this,[0.15, 0.14], [0.525, 0.36], [-1.3, 0.26]);

                this.srcX = this.x;
            },
            _click: function(btn) {
                PKPassConfirmToServer_card({cmd: "PKPass",  Opt : 2/*点不出过*/});
                MjClient.playui.recoverCannotOutCard();
                btn.visible = false;
            },
            _event:{
                PKPut: function(eD) {
                    this.visible = false;
                },
                waitPut: function() {
                    var tData = MjClient.data.sData.tData;
                    this.visible = IsTurnToMe() && tData.tState == TableState.waitPut && tData.lastPutPlayer != tData.curPlayer && tData.lastPutPlayer != -1;
                },
                initSceneData: function()
                {
                    var tData = MjClient.data.sData.tData;
                    this.visible = IsTurnToMe() && tData.tState == TableState.waitPut && tData.lastPutPlayer != tData.curPlayer && tData.lastPutPlayer != -1;
                }
            }
        },
        BtnPutCard:{
            _run: function () {
                this.visible = false;
 
                if(isIPhoneX())
                    setWgtLayout(this,[0.15, 0.14], [0.515, 0.43], [1.3, 0.32]);
                else
                    setWgtLayout(this,[0.15, 0.14], [0.515, 0.36], [1.3, 0.32]); 

                this.srcX = this.x;
            },
            _click: function(btn) {
                //cc.log("BtnPutCard");
                MjClient.playui.btnPutCardClicked(btn);
            },
            _event:{
                PKPut: function(eD) {
                    //cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>PKPut by sking");
                    this.visible = false;
                    MjClient.playui.recoverCannotOutCard();
                },
                waitPut: function() {
                    var tData = MjClient.data.sData.tData;
                    this.visible = IsTurnToMe() && tData.tState == TableState.waitPut;
                },
                initSceneData: function()
                {
                    var tData = MjClient.data.sData.tData;
                    this.visible = IsTurnToMe() && tData.tState == TableState.waitPut;
                }
            }
        },
        noPutTips: {
            _run: function() {
                this.visible = false;
                setWgtLayout(this, [0.39, 0], [0.5, 0.2], [0, 0]);
            },
            _event: {
                clearCardUI: function() {
                    this.visible = false;
                },
                mjhand: function() {
                    this.visible = false;
                },
            }
        }, 
        down: {
            head: {
                zhuang: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        waitPut: function() {
                            //showUserZhuangLogo_card(this, 0);
                        },
                        initSceneData: function() {
                            //if (IsArrowVisible()) showUserZhuangLogo_card(this, 0);
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

                                showUserChat(this, 0, msg);
                            },
                            playVoice: function(voicePath) {
                                MjClient.data._tempMessage.msg = voicePath;
                                showUserChat(this, 0, MjClient.data._tempMessage);
                            }
                        }
                    }
                },
                _click: function(btn) {
                    showPlayerInfo(0, btn);
                },
                _event: {
                    loadWxHead: function(d) {
                        setWxHead(this, d, 0);
                    },
                    addPlayer: function(eD) {
                        showFangzhuTagIcon(this,0);
                    },
                    removePlayer: function(eD) {
                        showFangzhuTagIcon(this,0);
                    }

                },
                _run: function () {
                    //this.zIndex = 600;
                    showFangzhuTagIcon(this,0);
                },
                score_bg:{_visible:false},
                name_bg:{_visible:false},
                coin:{
                    _event:{
                        moveHead:function () {
                            this.visible=false;
                        }
                    }
                }
            },
            ready: {
                _layout: [
                    [0.084, 0.094],
                    [0.5, 0.5],
                    [0, -1.4]
                ],
                _run: function() {
                    GetReadyVisible(this, 0);
                },
                _event: {
                    moveHead: function() {
                        GetReadyVisible(this, -1);
                    },
                    addPlayer: function() {
                        GetReadyVisible(this, 0);//根据状态设置ready 是否可见 add by sking
                    },
                    removePlayer: function() {
                        GetReadyVisible(this, 0);
                    },
                    onlinePlayer: function() {
                        GetReadyVisible(this, 0);
                    }
                }
            },
            stand: {
                _visible: false,
                _run: function() {
                    if (MjClient.rePlayVideo == -1)
                        setWgtLayout(this, [0.070, 0], [0.5, 0.1], [0, 0.62]);
                    else
                        setWgtLayout(this, [0.052, 0], [0.5, 0.1], [0, 0.55]);
                    this.zIndex = 600;
                },
            },
            deskCard: {
                _run: function() {
                    if (MjClient.rePlayVideo == -1)
                        setWgtLayout(this, [0.047, 0], [0.5, 0.14], [0, 2.7]);
                    else
                        setWgtLayout(this, [0.052, 0], [0.5, 0.14], [0, 1.7]);
                },
                _visible: false
            },
            noPutTag: {
                _run:function()
                {
                    this.setScale(MjClient.size.width/1280);
                    this.setPosition(MjClient.playui._downNode.getChildByName("deskCard").getPosition());
                },
                _event:{
                  PKPass:function(eD)
                  {
                      cc.log("=====PKPASS=========" + JSON.stringify(eD));
                      var UIoff = getUiOffByUid(eD.uid);
                      if(UIoff == 0)
                      {
                          DealPKPass_card(UIoff);
                      }
                  }
                },
                _visible: false
            },
            _event: {
                clearCardUI: function() {
                    clearCardUI_card(this, 0);
                },
                initSceneData: function(eD) {
                    SetUserVisible_ganDengYan(this, 0);
                    reConnectShowDeskCard();
                    MjClient.playui.CardLayoutRestore(this, 0);
                },
                addPlayer: function(eD) {
                    SetUserVisible_ganDengYan(this, 0);
                },
                removePlayer: function(eD) {
                    SetUserVisible_ganDengYan(this, 0);
                },
                mjhand: function(eD) {
                    InitUserHandUI_ganDengYan(this, 0);
                    // 先排序 再发牌 上面的这个函数可能不走排序的代码段
                    delete MjClient.playui.isFaPai;
                    MjClient.playui.CardLayoutRestore(this, 0);
                },
                roundEnd: function() {
                    InitUserCoinAndName(this, 0);
                },
                pkNewCard: function(eD) {
                    console.log("客户端发牌组合...... ");

                    MjClient.playui.addNewCards(eD,this,0);
                },
                PKPut: function(eD) {
                    //cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>PKPut---------------");
                    DealMJPut_card(this,eD, 0);
                    setUserOffline(this, 0);
                },
                waitPut:function(eD){
                    DealWaitPut_card(this, eD, 0);
                    UpdataCurrentPutCard();
                },
                onlinePlayer: function(eD) {
                    setUserOffline(this, 0);
                },
                playerStatusChange: function(eD) {
                    setUserOffline(this, 0);
                },
                waitReady: function(){
                    clearCardUI_card(this, 0);
                },
                moveHead: function(){
                    clearCardUI_card(this, 0);
                }
            }
        },
        right: {
            _run:function() {
                this.visible = MjClient.MaxPlayerNum != 2;
            },
            head: {
                zhuang: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        waitPut: function() {
                            //showUserZhuangLogo_card(this, 1);
                        },
                        initSceneData: function() {
                            //if (IsArrowVisible()) showUserZhuangLogo_card(this, 1);
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
                                showUserChat(this, 1, msg);
                            },
                            playVoice: function(voicePath) {
                                MjClient.data._tempMessage.msg = voicePath;
                                showUserChat(this, 1, MjClient.data._tempMessage);
                            }
                        }
                    }
                },
                _click: function(btn) {
                    showPlayerInfo(1, btn);
                },
                _event: {
                    loadWxHead: function(d) {
                        setWxHead(this, d, 1);
                    },
                    addPlayer: function(eD) {
                        showFangzhuTagIcon(this,1);
                    },
                    removePlayer: function(eD) {
                        showFangzhuTagIcon(this,1);
                    }
                },
                _run: function () {
                    // this.zIndex = 600;
                    showFangzhuTagIcon(this,1);
                },
                score_bg:{_visible:false},
                name_bg:{_visible:false}
            },
            ready: {
                _layout: [
                    [0.084, 0.094],
                    [0.5, 0.5],
                    [1, 0.7]
                ],
                _run: function() {
                    GetReadyVisible(this, 1);
                },
                _event: {
                    moveHead: function() {
                        GetReadyVisible(this, -1);
                    },
                    addPlayer: function() {
                        GetReadyVisible(this, 1);
                    },
                    removePlayer: function() {
                        GetReadyVisible(this, 1);
                    },
                    onlinePlayer: function() {
                        GetReadyVisible(this, 1);
                    }
                }
            },
            stand: {
                _layout: [
                    [0, 0.13*0.9],
                    [1, 1],
                    [-2.9, -0.7]
                ],
                _visible: false
            },
            deskCard: {
                _run: function() {
                    if (MjClient.rePlayVideo == -1) // 表示正常游戏
                        setWgtLayout(this, [0.047, 0], [1, 0.55], [-3.7, 0.55]);
                    else
                        setWgtLayout(this, [0.052, 0], [1, 0.55], [-4.7, 0.10]);
                },
                _visible: false
            },
            noPutTag: {
                _run:function()
                {
                    this.setScale(MjClient.size.width/1280);
                    this.setPosition(MjClient.playui._rightNode.getChildByName("deskCard").getPosition());
                },
                _event:{
                    PKPass:function(eD)
                    {
                        var UIoff = getUiOffByUid(eD.uid);
                        if(UIoff == 1)
                        {
                            DealPKPass_card(UIoff);
                        }
                    }
                },
                _visible: false
            },
            _event: {
                clearCardUI: function() {
                    clearCardUI_card(this, 1);
                },
                initSceneData: function(eD) {
                    SetUserVisible_ganDengYan(this, 1);
                },
                addPlayer: function(eD) {
                    SetUserVisible_ganDengYan(this, 1);
                },
                removePlayer: function(eD) {
                    SetUserVisible_ganDengYan(this, 1);
                },
                mjhand: function(eD) {
                    InitUserHandUI_ganDengYan(this, 1);
                },
                roundEnd: function() {
                    InitUserCoinAndName(this, 1);
                },
                waitPut: function(eD) {
                    DealWaitPut_card(this, eD, 1);
                },
                pkNewCard: function(eD) {
                    MjClient.playui.addNewCards(eD,this,1);
                },
                PKPut: function(eD) {
                    DealMJPut_card(this, eD, 1);
                    setUserOffline(this, 1);
                },
                onlinePlayer: function(eD) {
                    setUserOffline(this, 1);
                },
                playerStatusChange: function(eD) {
                    setUserOffline(this, 1);
                }
            }
        },
        top: {
            _run:function() {
                this.visible = MjClient.MaxPlayerNum != 3;
                this.zIndex = 1;
            },
            head: {
                zhuang: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        waitPut: function() {
                            //showUserZhuangLogo_card(this, 2);
                        },
                        initSceneData: function() {
                            //if (IsArrowVisible()) showUserZhuangLogo_card(this, 2);
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
                                showUserChat(this, 2, msg);
                            },
                            playVoice: function(voicePath) {
                                MjClient.data._tempMessage.msg = voicePath;
                                showUserChat(this, 2, MjClient.data._tempMessage);
                            }
                        }
                    }
                },
                _click: function(btn) {
                    showPlayerInfo(2, btn);
                },
                _event: {
                    loadWxHead: function(d) {
                        setWxHead(this, d, 2);
                    },
                    addPlayer: function(eD) {
                        showFangzhuTagIcon(this,2);
                    },
                    removePlayer: function(eD) {
                        showFangzhuTagIcon(this,2);
                    }
                },
                _run: function () {
                    // this.zIndex = 600;
                    showFangzhuTagIcon(this,2);
                },
                score_bg:{_visible:false},
                name_bg:{_visible:false}
            },
            ready: {
                _layout: [
                    [0.084, 0.094],
                    [0.5, 0.5],
                    [1, 4]
                ],
                _run: function() {
                    GetReadyVisible(this, 2);
                },
                _event: {
                    moveHead: function() {
                        GetReadyVisible(this, -1);
                    },
                    addPlayer: function() {
                        GetReadyVisible(this, 2);
                    },
                    removePlayer: function() {
                        GetReadyVisible(this, 2);
                    },
                    onlinePlayer: function() {
                        GetReadyVisible(this, 2);
                    }
                }
            },
            stand: {
                _run: function() {
                    // setWgtLayout(this, [0, 0.13 * 0.6], [0.66, 0.8], [0, -0.32]);
                    // //cc.log('this===============this:'+JSON.stringify(this.getPosition()))
                    // this.setVisible(false);
                    if(MjClient.MaxPlayerNum == 5)
                    {
                        setWgtLayout(this, [0, 0.13 * 0.6], [0.66, 0.8], [0, -0.32]);
                    }
                    else
                    {

                        setWgtLayout(this, [0, 0.13 * 0.6], [0.5, 0.8], [0, -0.32]);
                    }
                    this.setVisible(false);
                },
            },
            deskCard: {
                _run: function() {
                    if (MjClient.rePlayVideo == -1)
                    {
                        if(MjClient.MaxPlayerNum == 5)
                        {
                            setWgtLayout(this, [0.047, 0], [0.78, 0.7], [0, 0.6]);
                        }
                        else
                        {
                            setWgtLayout(this, [0.047, 0], [0.5, 0.7], [0, 0.6]);
                        }
                    }
                    else
                    {
                        if(MjClient.MaxPlayerNum == 5)
                        {
                            setWgtLayout(this, [0.052, 0], [0.68, 0.65], [0, 0.2]);
                        }
                        else
                        {
                            setWgtLayout(this, [0.052, 0], [0.6, 0.65], [0, 0.2]);
                        }
                    }
                    this.setVisible(false);
                },
            },
            noPutTag: {
                _run:function()
                {
                    this.setScale(MjClient.size.width/1280);
                    this.setPosition(MjClient.playui._topNode.getChildByName("deskCard").getPosition());
                },
                _event:{
                    PKPass:function(eD)
                    {
                        var UIoff = getUiOffByUid(eD.uid);

                        if(UIoff == 2)
                        {
                            DealPKPass_card(UIoff);
                        }
                    }
                },
                _visible: false
            },
            _event: {
                clearCardUI: function() {
                    clearCardUI_card(this, 2);
                },
                initSceneData: function(eD) {
                    SetUserVisible_ganDengYan(this, 2);
                },
                addPlayer: function(eD) {
                    SetUserVisible_ganDengYan(this, 2);
                },
                removePlayer: function(eD) {
                    SetUserVisible_ganDengYan(this, 2);
                },
                mjhand: function(eD) {
                    InitUserHandUI_ganDengYan(this, 2);
                },
                roundEnd: function() {
                    InitUserCoinAndName(this, 2);
                },
                waitPut: function(eD) {
                    DealWaitPut_card(this, eD, 2);
                },
                pkNewCard: function(eD) {
                    MjClient.playui.addNewCards(eD,this,2);
                },
                PKPut: function(eD) {
                    DealMJPut_card(this, eD, 2);
                    setUserOffline(this, 2);
                },
                onlinePlayer: function(eD) {
                    setUserOffline(this, 2);
                },
                playerStatusChange: function(eD) {
                    setUserOffline(this, 2);
                }
            }
        },
        left: {
            _run:function() {
                this.visible = MjClient.MaxPlayerNum == 5;
                this.zIndex = 1;
            },
            head: {
                zhuang: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        waitPut: function() {
                            //showUserZhuangLogo_card(this, 3);
                        },
                        initSceneData: function() {
                            //if (IsArrowVisible()) showUserZhuangLogo_card(this, 3);
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
                                showUserChat(this, 3, msg);
                            },
                            playVoice: function(voicePath) {
                                MjClient.data._tempMessage.msg = voicePath;
                                showUserChat(this, 3, MjClient.data._tempMessage);
                            }
                        }
                    }
                },
                _click: function(btn) {
                    showPlayerInfo(3, btn);
                },
                _event: {
                    loadWxHead: function(d) {
                        setWxHead(this, d, 3);
                    },
                    addPlayer: function(eD) {
                        showFangzhuTagIcon(this,3);
                    },
                    removePlayer: function(eD) {
                        showFangzhuTagIcon(this,3);
                    }
                },
                _run: function () {
                    // this.zIndex = 600;
                    showFangzhuTagIcon(this,3);
                },
                score_bg:{_visible:false},
                name_bg:{_visible:false}
            },
            ready: {
                _layout: [
                    [0.084, 0.094],
                    [0.5, 0.5],
                    [-1, 4]
                ],
                _run: function() {
                    GetReadyVisible(this, 3);
                },
                _event: {
                    moveHead: function() {
                        GetReadyVisible(this, -1);
                    },
                    addPlayer: function() {
                        GetReadyVisible(this, 3);
                    },
                    removePlayer: function() {
                        GetReadyVisible(this, 3);
                    },
                    onlinePlayer: function() {
                        GetReadyVisible(this, 3);
                    }
                }
            },
            stand: {
                _run: function() {
                    setWgtLayout(this, [0, 0.13 * 0.6], [0.34, 0.8], [0, -0.32]);
                    this.setVisible(false);
                }
            },
            deskCard: {
                _run: function() {
                    if (MjClient.rePlayVideo == -1)
                        setWgtLayout(this, [0.047, 0], [0.22, 0.7], [0, 0.6]);
                    else
                        setWgtLayout(this, [0.052, 0], [0.3, 0.65], [0, 0.2]);
                },
                _visible: false,
            },
            noPutTag: {
                _run:function()
                {
                    this.setScale(MjClient.size.width/1280);
                    this.setPosition(MjClient.playui._leftNode.getChildByName("deskCard").getPosition());
                },
                _event:{
                    PKPass:function(eD)
                    {
                        var UIoff = getUiOffByUid(eD.uid);
                        if(UIoff == 3)
                        {
                            DealPKPass_card(UIoff);
                        }
                    }
                },
                _visible: false
            },
            _event: {
                clearCardUI: function() {
                    clearCardUI_card(this, 3);
                },
                initSceneData: function(eD) {
                    SetUserVisible_ganDengYan(this, 3);
                },
                addPlayer: function(eD) {
                    SetUserVisible_ganDengYan(this, 3);
                },
                removePlayer: function(eD) {
                    SetUserVisible_ganDengYan(this, 3);
                },
                mjhand: function(eD) {
                    InitUserHandUI_ganDengYan(this, 3);
                },
                roundEnd: function() {
                    InitUserCoinAndName(this, 3);
                },
                waitPut: function(eD) {
                    DealWaitPut_card(this, eD, 3);
                },
                pkNewCard: function(eD) {
                    MjClient.playui.addNewCards(eD,this,3);
                },
                PKPut: function(eD) {
                    DealMJPut_card(this, eD, 3);
                    setUserOffline(this, 3);
                },
                onlinePlayer: function(eD) {
                    setUserOffline(this, 3);
                },
                playerStatusChange: function(eD) {
                    setUserOffline(this, 3);
                }
            },
        },
        fifth: {
            _run:function() {
                this.visible = MjClient.MaxPlayerNum != 2;
            },
            head: {
                zhuang: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        waitPut: function() {
                            //showUserZhuangLogo_card(this, 4);
                        },
                        initSceneData: function() {
                            //if (IsArrowVisible()) showUserZhuangLogo_card(this, 4);
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
                                showUserChat(this, 4, msg);
                            },
                            playVoice: function(voicePath) {
                                MjClient.data._tempMessage.msg = voicePath;
                                showUserChat(this, 4, MjClient.data._tempMessage);
                            }
                        }
                    }
                },
                _click: function(btn) {
                    showPlayerInfo(4, btn);
                },
                _event: {
                    loadWxHead: function(d) {
                        setWxHead(this, d, 4);
                    },
                    addPlayer: function(eD) {
                        showFangzhuTagIcon(this,4);
                    },
                    removePlayer: function(eD) {
                        showFangzhuTagIcon(this,4);
                    }
                },
                _run: function () {
                    // this.zIndex = 600;
                    showFangzhuTagIcon(this,4);
                },
                score_bg:{_visible:false},
                name_bg:{_visible:false}
            },
            ready: {
                _layout: [
                    [0.084, 0.094],
                    [0.5, 0.5],
                    [-1, 0.7]
                ],
                _run: function() {
                    GetReadyVisible(this, 4);
                },
                _event: {
                    moveHead: function() {
                        GetReadyVisible(this, -1);
                    },
                    addPlayer: function() {
                        GetReadyVisible(this, 4);
                    },
                    removePlayer: function() {
                        GetReadyVisible(this, 4);
                    },
                    onlinePlayer: function() {
                        GetReadyVisible(this, 4);
                    }
                }
            },
            stand: {
                _layout: [
                    [0, 0.13*0.9],
                    [0, 1],
                    [2.9, -0.7]
                ],
                _visible: false,
            },
            deskCard: {
                _run: function() {
                    if (MjClient.rePlayVideo == -1)
                        setWgtLayout(this, [0.047, 0], [0, 0.55], [3.2, 0.55]);
                    else
                        setWgtLayout(this, [0.052, 0], [0, 0.55], [5.0, 0.10]);
                },
                _visible: false,
            },
            noPutTag: {
                _run:function()
                {
                    this.setScale(MjClient.size.width/1280);
                    this.setPosition(MjClient.playui._fifthNode.getChildByName("deskCard").getPosition());
                },
                _event:{
                    PKPass:function(eD)
                    {
                        var UIoff = getUiOffByUid(eD.uid);

                        if(UIoff == 4)
                        {
                            DealPKPass_card(UIoff);
                        }
                    }
                },
                _visible: false
            },
            _event: {
                clearCardUI: function() {
                    clearCardUI_card(this, 4);
                },
                initSceneData: function(eD) {
                    SetUserVisible_ganDengYan(this, 4);
                },
                addPlayer: function(eD) {
                    SetUserVisible_ganDengYan(this, 4);
                },
                removePlayer: function(eD) {
                    SetUserVisible_ganDengYan(this, 4);
                },
                mjhand: function(eD) {
                    InitUserHandUI_ganDengYan(this, 4, true);
                },
                roundEnd: function() {
                    InitUserCoinAndName(this, 4);
                },
                waitPut: function(eD) {
                    DealWaitPut_card(this, eD, 4);
                },
                pkNewCard: function(eD) {
                    MjClient.playui.addNewCards(eD,this,4);
                },
                PKPut: function(eD) {
                    DealMJPut_card(this, eD, 4);
                    setUserOffline(this, 4);
                },
                onlinePlayer: function(eD) {
                    setUserOffline(this, 4);
                },
                playerStatusChange: function(eD) {
                    setUserOffline(this, 4);
                }
            },
        },
        home_info:{
            _layout: [
                [1, 1],
                [0.5, 0.0435],
                [0.01, 0.0]
            ],
            gpsBtn: {
                _run: function()
                {
                    this.visible = MjClient.MaxPlayerNum != 2;
                },
                _click: function() {
                    if (MjClient.MaxPlayerNum == 3) {
                        MjClient.Scene.addChild(new showDistance3PlayerLayer());
                    } else if (MjClient.MaxPlayerNum == 4) {
                        MjClient.Scene.addChild(new showDistanceLayer());
                    } else if (MjClient.MaxPlayerNum == 5) {
                        MjClient.Scene.addChild(new showDistance3PlayerLayer(5));
                    }
                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Dingwei", {uid: SelfUid(),gameType:MjClient.gameType});
                },
                _event: {
                    initSceneData:function () {
                        this.visible = MjClient.data.sData.tData.maxPlayer != 2;
                    }
                }
            },
            coinMyself:{
                _visible: true,
                _run: function()
                {
                    this.setString(0);
                    this.ignoreContentAdaptWithSize(true);
                },
                _event: {
                    mjhand: function(eD) {
                        var tData = MjClient.data.sData.tData;
                        var pl = getUIPlayer(0);
                        var coin = tData.initCoin;
                        this.setString(coin + pl.winall);
                    },
                    roundEnd: function() {
                        var tData = MjClient.data.sData.tData;
                        var pl = getUIPlayer(0);
                        var coin = tData.initCoin;
                        this.setString(coin + pl.winall);
                    },
                    initSceneData:function () {
                        var tData = MjClient.data.sData.tData;
                        var pl = getUIPlayer(0);
                        var coin = tData.initCoin;
                        this.setString(coin + pl.winall);
                    },
                    waitPut:function () {
                        var tData = MjClient.data.sData.tData;
                        var pl = getUIPlayer(0);
                        var coin = tData.initCoin;
                        this.setString(coin + pl.winall);
                    }
                }
            },
            beiNum:{
                _run: function()
                {
                    this.ignoreContentAdaptWithSize(true);
                    this.setString(1);
                },
                _event: {
                    mjhand: function(eD) {
                        this.setString(1);
                    },
                    initSceneData:function () {
                        if (MjClient.data.sData.tData.allZhaDanCount)
                            this.setString(Math.pow(2,MjClient.data.sData.tData.allZhaDanCount));
                        else
                            this.setString(1);
                    },
                    waitPut:function () {
                        if (MjClient.data.sData.tData.allZhaDanCount)
                            this.setString(Math.pow(2,MjClient.data.sData.tData.allZhaDanCount));
                        else
                            this.setString(1);
                    },
                    clearCardUI: function() {
                        this.setString(1);
                    }
                }
            },
            difenNum:{
                _run: function()
                {
                    this.setString(MjClient.data.sData.tData.areaSelectMode.difen);
                    this.ignoreContentAdaptWithSize(true);
                }
            },
            cardRemainingNum:{
                _run: function()
                {
                    this.setString(54);
                    this.ignoreContentAdaptWithSize(true);
                },
                _event: {
                    initSceneData:function () {
                        this.setString(Math.max(54 - MjClient.data.sData.tData.cardNext,0));
                    },
                    waitPut:function () {
                        this.setString(Math.max(54 - MjClient.data.sData.tData.cardNext,0));
                    },
                    clearCardUI: function() {
                        this.setString(54);
                    }
                }
            }
        },
        chat_btn: {
            _layout: [
                [0.09, 0.09],
                [0.95, 0.12],
                [0.3, 2.95]
            ],
            _click: function() {
                var chatlayer = new ChatLayer();
                MjClient.Scene.addChild(chatlayer);
            }
        },
        setting: {
            _layout: [
                [0.09, 0.09],
                [0.95, 0.93],
                [0.4, 0]
            ],
            _click: function() {
                var settringLayer = new SettingViewCard();
                settringLayer.setName("PlayLayerClick");
                MjClient.Scene.addChild(settringLayer);
                MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Shezhi", {uid:SelfUid(),gameType:MjClient.gameType});
            }
        },
        voice_btn: {
            _layout: [
                [0.09, 0.09],
                [0.01, 0.12],
                [0.5, 2.95]
            ],
            _run: function() {
                initVoiceData();
                cc.eventManager.addListener(getTouchListener(), this);
                if(MjClient.isShenhe) this.visible=false;
                this.visible = false;
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
                    downAndPlayVoice(msg.uid, msg.msg);
                },
                mjhand:function(){
                    this.visible = true;
                },
                PKPut:function(){
                    this.visible = true;
                },
                waitPut:function(){
                    this.visible = true;
                },
                initSceneData:function(){
                    var tData = MjClient.data.sData.tData;
                    if(tData.tState != TableState.waitJoin && tData.tState != TableState.waitReady){
                        this.visible = true;
                    }
                    else {
                        this.visible = false;
                    }
                }
            }
        }
    },
    _downNode:null,
    _rightNode:null,
    _topNode:null,
    _leftNode:null,
    _fifthNode:null,
    ctor: function() {
        this._super();
        var playui = ccs.load("Play_ganDengYan.json");

        this.srcMaxPlayerNum = MjClient.MaxPlayerNum;
        MjClient.MaxPlayerNum = parseInt(MjClient.data.sData.tData.maxPlayer);
        playMusic("daqi/effect/bgFight");

        this._downNode = playui.node.getChildByName("down");
        this._rightNode = playui.node.getChildByName("right");
        this._topNode = playui.node.getChildByName("top");
        this._leftNode = playui.node.getChildByName("left");
        this._fifthNode = playui.node.getChildByName("fifth");

        this._btnPutCard = playui.node.getChildByName("BtnPutCard");
        this._btnHimt      = playui.node.getChildByName("BtnHimt");
        this._btnNoPut     = playui.node.getChildByName("BtnNoPut");
        this._noPutTips    = playui.node.getChildByName("noPutTips");

        this.panel = playui.node.getChildByName("panel")

        this.coinMyself = playui.node.getChildByName('home_info').getChildByName('coinMyself');
        this._AniNode = playui.node.getChildByName("eat");
        this._AniNode.zIndex = 2;

        MjClient.playui = this;
        MjClient.sortClassType = 0;

        BindUiAndLogic(playui.node, this.jsBind);
        this.addChild(playui.node);

        //触摸事件监听注册
        cc.eventManager.addListener(cc.EventListener.create(getTouchListener_card()), this._rightNode);

        if (MjClient.data.sData.tData.areaSelectMode["convertible"] && MjClient.rePlayVideo == -1)
            addFreeNumberBtn([0.5, 0.4]);

        MjClient.lastMJTick = Date.now();
        this.runAction(cc.repeatForever(cc.sequence(cc.callFunc(function() {
            if (MjClient.game_on_show) MjClient.tickGame(0);
        }), cc.delayTime(7))));

        //初始化其他功能
        initSceneFunc();
        // 在亲友圈房间中添加邀请亲友圈牌有一起对局
        addClubYaoqingBtn();
        
        return true;
    },
    onEnterTransitionDidFinish : function()
    {
        //this.setTouchEnabled(true);
        //cc.log("-----------init touch ---- ")
        this._super();
    },

    onExit:function()
    {
        this._super();
        MjClient.MaxPlayerNum = this.srcMaxPlayerNum;
    },

});

// add...................   Greene
//初始化桌子上的客户端数据c_data..各个游戏的自身数据可以在这里初始，
//尽量不要在外部公共代码判断游戏类型，而是在c_data里初始化数据。
//在PlayLayer的_event 的 initSceneData调用
PlayLayer_ganDengYan.prototype.InitC_Data = function() {
    if (!MjClient.data.c_Data)
        MjClient.data.c_Data = {};
}


PlayLayer_ganDengYan.prototype.cannotOutCardGrey = function()
{
    if (MjClient.data.sData.tData.lastPutPlayer == -1 || MjClient.data.sData.tData.lastPutPlayer == MjClient.data.sData.tData.curPlayer)
        return;

    var children = this._downNode.children;

    for (var i = 0; i < children.length; i++)
    {
        if (children[i].name != "mjhand")
            continue;

        var point = Math.ceil(children[i].tag/4);
        var atTipArray = false;
        for (var j = 0, len = MjClient.tipCardsArray.length; j < len; j ++)
        {
            var curTips = MjClient.tipCardsArray[j];

            for (var k = 0, len2 =curTips.length; k < len2; k ++)
            {
                if (Math.ceil(curTips[k]/4) == point)
                {
                    atTipArray = true;
                    break;
                }

                if (MjClient.majiang.getRealLaizi(curTips[k]) == children[i].tag) {
                    atTipArray = true;
                    break;
                }
            }
            if (atTipArray)
                break;
        }

        children[i].cannotOut = !atTipArray;
        if (atTipArray)
            children[i].setColor(MjClient.whiteColor);
        else
            children[i].setColor(MjClient.grayColor);
    }
}

PlayLayer_ganDengYan.prototype.recoverCannotOutCard = function()
{
    var children = this._downNode.children;
    for (var i = 0; i < children.length; i++)
    {
        if (children[i].name != "mjhand")
            continue;

        children[i].cannotOut = false;
        children[i].setColor(MjClient.whiteColor);
    }
}

PlayLayer_ganDengYan.prototype.clockNumberUpdate = function(node, endFunc)
{
    return arrowbkNumberUpdate(node, endFunc, 20);
}

PlayLayer_ganDengYan.prototype.updateClockPosition = function(arrowNode) {
    var tData = MjClient.data.sData.tData;
    var uids = tData.uids;
    var off = getOffByIndex(tData.curPlayer);

    var curPlayerNode = null;
    if (off == 1)
        curPlayerNode = this._rightNode;
    else if (off == 2)
        curPlayerNode = this._topNode;
    else if (off == 3)
        curPlayerNode = this._leftNode;
    else if (off == 4)
        curPlayerNode = this._fifthNode;

    if (curPlayerNode != null)
    {
        arrowNode.setPosition(curPlayerNode.getChildByName("deskCard").getPosition());
    }
    else
    {
        arrowNode.setPosition(arrowNode.srcPosition.x,arrowNode.srcPosition.y-arrowNode.srcPosition.y/12);
    }

    if (curPlayerNode != null && tData.lastPutPlayer != -1)
    {
        var children = curPlayerNode.children;
        for (var i = 0; i < children.length; i++)
        {
            var ni = children[i];
            if(ni.name == "out")
                ni.removeFromParent(true);
        }
    }
}

/**
 * 拼接游戏玩法及付费信息
 * @function
 * @return {String}
 */
PlayLayer_ganDengYan.prototype.getGameInfoString = function(param)
{
    var tData = MjClient.data.sData.tData;
    var str = "";
    
    if (param != "roundInfo")
    {
        if (tData.areaSelectMode.convertible)
            str += "自由人数,";
        else
            str += tData.areaSelectMode.maxPlayer + "人场,";
    }

    str += 8 * Math.pow(2,tData.areaSelectMode.fengDing) + "倍封顶,";
    str += ["赢家补牌,","全体补牌,"][tData.areaSelectMode.addCard];

    str += tData.areaSelectMode.zhaDanFanBei ? "炸弹翻倍," : "";
    str += tData.areaSelectMode.guanMenFanBei ? "关门翻倍," : "";
    str += tData.areaSelectMode.sanZha ? "三炸," : "";

    str += tData.areaSelectMode.difen ? "底分X"+ tData.areaSelectMode.difen + "," : "";

    if (param != "roundInfo") {
        switch (tData.areaSelectMode.payWay) {
            case 0:
                str += "房主付";
                break;
            case 1:
                str += "AA付";
                break;
            case 2:
                str += "大赢家付";
                break;
        }
    }

    if (str.charAt(str.length - 1) == ",")
        str = str.substring(0, str.length - 1);
    return str;
};


PlayLayer_ganDengYan.prototype.CardLayoutRestore = function(node, off) {
    cc.log("横向排序 off=" + off);
    MjClient.playui.horSort(node, off);
};

PlayLayer_ganDengYan.prototype.CardLayoutDesk = function(node, cards, off) {
    var tData = MjClient.data.sData.tData;

    //if(off != 0) return;
    var children = node.children;
    var initDesk_y = node.getChildByName("deskCard").y;
    for (var i = 0; i < children.length; i++) {
        var ci = children[i];
        if (ci.name == "out"){
            ci.y = initDesk_y;
            ci.setColor(MjClient.grayColor);
        }
    }

    var outStand = node.getChildByName("deskCard");
    outStand.visible = false;

    var uiOut = [];
    var uiHun = []; //癞子牌在最左边

    for (var i = 0; i < children.length; i++) {
        var ci = children[i];
        if (ci.name != "out")
            continue;

        if (tData.hunCard == ci.tag)
            uiHun.push(ci);
        else
            uiOut.push(ci);

        // if (MjClient.majiang.getCardFen(ci.getTag()))
        //     ci.setColor(MjClient.grayColor);
    }

    if (uiHun.length + uiOut.length == 0)
        return;

    var sort = function(node) {
        var pointCounts = {};
        for (var i = 0; i < node.length; i++) {
            var p = MjClient.majiang.calPoint(node[i].tag);
            if (pointCounts[p])
                pointCounts[p]++;
            else
                pointCounts[p] = 1;
        }

        var commonCmp = function(a, b) {
            var c1 = pointCounts[MjClient.majiang.calPoint(a.tag)];
            var c2 = pointCounts[MjClient.majiang.calPoint(b.tag)];
            if (c1 == c2)
                return MjClient.majiang.cardValueCmp(a.tag, b.tag);
            else
                return c1 - c2;
        }

        node.sort(function(a, b) {
            return -commonCmp(a, b);
        });
    }

    sort(uiOut);

    if (uiHun.length > 0) //是否有柰子，有则放在最前面 by sking
    {
        for (var i = 0; i < uiHun.length; i++) {
            uiOut.unshift(uiHun[i]); //向数组开头添加一个元素 unshift
        }
    }

    var outSize = uiOut[0].getSize();
    var outScale = uiOut[0].scale;
    var width = outSize.width * outScale * 0.4;
    var x = 0;
    var areaWidth = (uiOut.length - 1) * width + outSize.width * outScale;

    switch (off) {
        case 0:
            x = outStand.x - areaWidth / 2 + outSize.width * outScale / 2;
            break;
        case 1:
            x = outStand.x - areaWidth + outSize.width * outScale;
            if (MjClient.rePlayVideo == -1) // 表示正常游戏
            {
                if (uiOut.length >= 7)
                    x += width;
            }
            break;
        case 2:
            x = outStand.x;
            x = outStand.x;
            if (MjClient.rePlayVideo == -1) // 表示正常游戏
            {
                if (uiOut.length >= 6)
                    x -= width * 3;
            }
            break;
        case 3:
            x = outStand.x;
            x = outStand.x;
            if (MjClient.rePlayVideo == -1) // 表示正常游戏
            {
                if (uiOut.length >= 6)
                    x -= width * 3;
            }
            break;  
        case 4:
            x = outStand.x;      
            break;
    }

    //设置麻将大小
    for (var i = 0; i < uiOut.length; i++) {
        uiOut[i].x = x;
        uiOut[i].zIndex = i;

        x += width;
    }
    MjClient.initDesk_y = "undefined";


    // 打出牌添加癞子角标
    if (!tData.lastPutCard)
        return;

    var laiziCards = MjClient.majiang.getLaiziCardsFromRet(tData.lastPutCard);
    for (var i = 0; i < children.length; i++) {
        var ci = children[i];

        if (ci.name != "out")
            continue;

        var found = laiziCards.indexOf(MjClient.majiang.addLaiziSign(ci.tag));
        if (found < 0)
            continue;

        laiziCards.splice(found,1);

        var signLaizi = new cc.Sprite("playing/ganDengYan/sign_laizi.png");
        signLaizi.setName("signLaizi");
        signLaizi.setAnchorPoint(0, 0);
        signLaizi.setPosition(0, 0);
        ci.addChild(signLaizi);
    }
    
};

//横向摆放《正常》
PlayLayer_ganDengYan.prototype.horSort = function(node, off) {
    var pl; //player 信息
    pl = getUIPlayer(off); //获取玩家信息.off 为0 ，就是自己得信息，能看到自己摸牌 by sking
    if (!pl) return;

    var mjhandNum = 0;
    var children = node.children;
    for (var i = 0; i < children.length; i++) {
        var ci = children[i];
        if (ci.name == "mjhand") {
            mjhandNum++;
            if ((typeof MjClient.init_y) == 'undefined') {
                MjClient.init_y = ci.y;
            }
        }
    }

    var tempMaJiang = MjClient.majiang; //麻将的各种方法判断，是否可以杠，是否可以吃... by sking

    //up stand 是2种麻将的图。
    var stand = node.getChildByName("stand");
    stand.visible = false;
    var start = stand;


    var upSize = start.getSize();
    var upS = start.scale;
    var uistand = [];
    var uisort = [];
    var uihun = []; //癞子牌在最左边

    for (var i = 0; i < children.length; i++) //children 为 "down" 节点下的字节点
    {
        var ci = children[i];
        if (ci.name == "mjhand") {
            if (!ci.cannotOut)
                ci.setColor(cc.color(255, 255, 255));
            uistand.push(ci);
        } else if (ci.name == "mjhand_replay") {
            uistand.push(ci);
        }
    }

    if (!pl.mjhand || cc.isUndefined(pl.mjhand)) {
        return;
    }


    //排除理牌的牌
    var mjhandCopy = pl.mjhand.concat();
    var copyuistand = uistand.concat();
    for (var i = 0; i < MjClient.colloctionCardsUIArray.length; i++) {
        var colloctionUI = []; //重新排序后
        cc.log("--重新排序后--");
        var _colloctionUICards = MjClient.colloctionCardsUIArray[i].concat();
        for (var j = 0; j < _colloctionUICards.length; j++) {
            for (var k = 0; k < copyuistand.length; k++) {
                if (copyuistand[k].tag == _colloctionUICards[j].tag &&
                    copyuistand[k].getUserData() == _colloctionUICards[j].getUserData()) { //这里保存的有可能是我当前选中的牌，这里应该排除我当前选的牌
                    if (!checkUINodeHave(uisort, copyuistand[k])) {
                        colloctionUI.push(copyuistand[k]); //有可能第二次装的数组还是，前一个值，ui节点是同一个。
                        break;
                    }
                }
            }
        }
        uisort[i] = colloctionUI; //保存理牌数组
        mjhandCopy = getExcludeCards(mjhandCopy, MjClient.colloctionCardsArray[i]);
    }


    //理牌的牌，装进数组 mySortui
    var mySortui = [];
    for (var j = 0; j < uisort.length; j++) {
        var uiss = uisort[j];
        for (var i = 0; i < uiss.length; i++) {
            uiss[i].zIndex = 0;
            cc.log("理牌的牌 = " + uiss[i].tag);
            uiss[i].setColor(cc.color(190, 190, 190));
            mySortui.push(uiss[i]);
        }
    }


    //理牌后剩下其他的牌
    var mjhandPai = tempMaJiang.sortHandCards(mjhandCopy, MjClient.data.sData.tData.zhuPaiType);


    //移除已选牌的UI
    var newuiStand = [];
    for (var j = 0; j < uistand.length; j++) {
        var bExsit = false;
        for (var i = 0; i < mySortui.length; i++) {
            if (mySortui[i].tag == uistand[j].tag && mySortui[i].getUserData() == uistand[j].getUserData()) {
                if (!checkUINodeHave(newuiStand, uistand[j])) {
                    bExsit = true;
                    break;
                }
            }
        }

        if (!bExsit) {
            newuiStand.push(uistand[j]);
        }
    }
    uistand = newuiStand;



    var myUiStand = []; //重新排序后
    for (var j = 0; j < mjhandPai.length; j++) {
        for (var i = 0; i < uistand.length;) {
            if (uistand[i].tag == mjhandPai[j]) //这张牌，有可能是，理牌里面的牌，也有可能是没理牌的牌
            {
                myUiStand.push(uistand[i]);
                uistand.splice(i, 1);
            } else {
                i++;
            }
        }
    }
    uistand = myUiStand;


    var uiOrder = [mySortui, uistand];
    var orders = []; //重新排序后装到数组里 by sking
    //不需要理牌的手牌
    for (var j = 0; j < uiOrder.length; j++) {
        var uis = uiOrder[j];
        for (var i = 0; i < uis.length; i++) {
            uis[i].zIndex = 0;
            orders.push(uis[i]);
        }
    }

    //设置麻将位置

    if (off == 0 || off == 2 || off == 3) //自己或者对家
    {
        var cardWidth = orders[0] ? orders[0].width * orders[0].scale : 0;
        var screenScale = MjClient.size.width / 1280;
        var areaWidth = MjClient.rePlayVideo == -1 ? MjClient.size.width - screenScale * 20 : MjClient.size.width*2/3;
        var width = (areaWidth - cardWidth) / (orders.length - 1);
        if (width > cardWidth / 2)
            width = cardWidth / 2;

        var startX = MjClient.size.width / 2 - width * (orders.length - 1) / 2;

        if(off == 2 || off == 3){
            width = width*0.7;
            startX = start.x - width * (orders.length - 1) / 2;
        }

        for (var i = 0; i < orders.length; i++) {
            var ci = orders[i];
            ci.x = startX;
            startX += width;
            ci.zIndex = i;
            ci.showWidth = i < orders.length - 1 ? width : cardWidth;
        }
    } else if (off == 1) //右侧的
    {
        for (var i = orders.length - 1; i >= 0; i--) {
            var ci = orders[i];
            //if(ci.name == orders[i - 1].name)
            {
                if (ci.name == "mjhand_replay") {
                    if (i != orders.length - 1) {
                        ci.y = orders[i + 1].y - upSize.width * upS * 0.3 - (27 - orders.length) * 0.3; //调牌的距离的，todo...
                    } else {
                        ci.y = start.y - upSize.width * upS * 0.2 - ((27 - orders.length) * upSize.width * upS * 0.3) / 3;
                    }
                }
            }
        }

        for (var i = 0; i < orders.length; i++) {
            orders[i].zIndex = i;
        }
    } else if (off == 4) //左侧的
    {
        for (var i = 0; i < orders.length; i++) {
            var ci = orders[i];
            //if(ci.name == orders[i - 1].name)
            {
                if (ci.name == "mjhand_replay") {
                    if (i != 0) {
                        ci.y = orders[i - 1].y - upSize.width * upS * 0.3 - (27 - orders.length) * 0.3; //调牌的距离的，todo...
                    } else {
                        ci.y = start.y - upSize.width * upS * 0.2 - ((27 - orders.length) * upSize.width * upS * 0.3) / 3;
                    }

                    ci.zIndex = i;
                }
            }
        }
    }
}

PlayLayer_ganDengYan.prototype.updateWifiState=function(node)
{
    var callback = function()
    {
        var ms = MjClient.reqPingPong / 1000.0;
        if(ms < 0.3)
        {
            node.loadTexture("playing/daqi/new/WIFI1-fs8.png");
        } else if(ms < 0.6)
        {
            node.loadTexture("playing/daqi/new/WIFI2-fs8.png");
        }
        else
        {
            node.loadTexture("playing/daqi/new/WIFI3-fs8.png");
        }
    };

    node.runAction(cc.repeatForever(cc.sequence(cc.callFunc(callback), cc.delayTime(5))));
}

//弹出选择的牌
PlayLayer_ganDengYan.prototype.selectUICards = function(_tipsCardArray)
{
    cc.log("tipsCardArray selectUICards= " + JSON.stringify(_tipsCardArray));

    var tipsCardArray = _tipsCardArray.concat();

    if(!tipsCardArray)
    {
        return;
    }

    var downNode = MjClient.playui._downNode;
    var standUI = downNode.getChildByName("stand");
    var children = downNode.getChildren();
    var upSize = standUI.getSize();
    var upS = standUI.scale;
    var cardY = upSize.width * upS*1.5; //一张牌的长度
    var cardOut = parseInt(cardY/4);//点击牌弹起的高度,以前是20像素

    if(MjClient.sortClassType == 0)
    {
        setCardToNormalPos();
    }
    else
    {
        setCardToNormalColor();
    }

    MjClient.colloctionCurrentSelcetUIArray = [];

    //var _children = children.concat();

    var specialType = (MjClient.gameType == MjClient.GAME_TYPE.YUE_YANG_SAN_DA_HA || 
        MjClient.gameType == MjClient.GAME_TYPE.XIANG_XIANG_SAN_DA_HA);

    for(var m = 0; m < children.length; m++)
    {
        for(var n = 0;n < tipsCardArray.length;n++)
        {
            if(children[m].name == "mjhand")
            {
                if(children[m].tag == tipsCardArray[n] || children[m].tag == MjClient.majiang.getRealLaizi(tipsCardArray[n]))
                {
                    if(checkUIHave(MjClient.colloctionCurrentSelcetUIArray,children[m]))
                    {
                        break;
                    }

                    if (children[m].tag != tipsCardArray[n]) {
                        // 癞子转化的牌值，需要标记
                        children[m].replacement = tipsCardArray[n];
                    }
                    
                    tipsCardArray[n] = -1;
                    cc.log("======弹出选择的牌===== colloctionCurrentSelcetUIArray = " + children[m].tag);
                    MjClient.colloctionCurrentSelcetUIArray.push(children[m]);
                    if(MjClient.sortClassType == 0)
                    {
                        var pos = children[m].getPosition();
                        var dy = Math.round(pos.y - standUI.y);
                        if(dy < standUI.y+cardOut && specialType)
                        {
                            if(children[m].isUp) children[m].setPositionY(standUI.y*2 + cardOut);
                            else children[m].setPositionY(standUI.y + cardOut);
                            break;
                        }
                        else{
                            if(dy < cardOut)
                            {
                                children[m].setPositionY(standUI.y + cardOut);
                                break;
                            }
                        }

                    }
                    else
                    {
                        if(!children[m].isGray)
                        {
                            children[m].isGray = true;
                            children[m].setColor(MjClient.grayColor);
                        }
                    }
                }
            }
        }
    }
}

PlayLayer_ganDengYan.prototype.checkPut = function (oHands, oCards, lastPutCard, areaSelectMode) {
    if (oCards && typeof(oCards)!='undefined' && oCards.length == 0) return null;

    var cards = [];
    var laizis = MjClient.majiang.transformAndGetLaizi(oCards, cards);

    if (laizis.length <= 0) {
        // 要出的牌中没有大小王牌值，可以直接调用算法类checkPut
        return MjClient.majiang.checkPut(oHands, oCards, lastPutCard, areaSelectMode);
    } else {
        // 先判断要出的牌组中有无手牌中没有的牌
        var hands = oHands.slice();
        for (var i = 0; i < oCards.length; i++) {
            var p = hands.indexOf(oCards[i]);

            if (p >= 0) {
                hands.splice(p, 1);
            }
            else {
                p = hands.indexOf(MjClient.majiang.getRealLaizi(oCards[i]));

                if (p >= 0) {
                    // 癞子
                    hands.splice(p, 1);
                }
                else
                    return null; // 手里没有这些牌
            }
        }

        // 从要出的牌组中查找炸弹
        var tempRets = MjClient.majiang.findCardByType(cards, laizis, MjClient.majiang.CARDTPYE.zhadan, oCards.length, areaSelectMode);

        if (tempRets.length > 0) {
            if (!lastPutCard || lastPutCard == -1) {
                // 先手，找到可出牌型立即返回
                return true;
            }

            for (var i = 0; i < tempRets.length; i++) {
                if (MjClient.majiang.canPut(tempRets[i], lastPutCard, areaSelectMode)) {
                    // 压牌，找到可压牌立即返回
                    return true;
                }
            }
        }

        if (!lastPutCard || lastPutCard == -1) {
            // 先手，找适当可出牌即可
            var cardsLength = oCards.length;
            var findTypes = [];

            if (cardsLength >= 4) {
                findTypes.push(MjClient.majiang.CARDTPYE.liandui);
                findTypes.push(MjClient.majiang.CARDTPYE.shunzi);
            } else if (cardsLength == 3) {
                findTypes.push(MjClient.majiang.CARDTPYE.shunzi);

                if (!areaSelectMode.sanZha)
                    findTypes.push(MjClient.majiang.CARDTPYE.sanzhang);
            } else if (cardsLength == 2) {
                findTypes.push(MjClient.majiang.CARDTPYE.duizi);
            } else
                findTypes.push(MjClient.majiang.CARDTPYE.danpai);

            for (var i = 0; i < findTypes.length; i++) {
                tempRets = MjClient.majiang.findCardByType(cards, laizis, findTypes[i], cardsLength, areaSelectMode);

                if (tempRets.length > 0) {
                    return true;
                }
            }
        } else {
            // 压牌，从要出的牌组中查找相同牌型的可出牌组
            var lastCardsType = MjClient.majiang.calType(lastPutCard, areaSelectMode);
            tempRets = MjClient.majiang.findCardByType(cards, laizis, lastCardsType, oCards.length, areaSelectMode);

            for (var i = 0; i < tempRets.length; i++) {
                if (MjClient.majiang.canPut(tempRets[i], lastPutCard, areaSelectMode)) {
                    // 压牌，找到可压牌立即返回
                    return true;
                }
            }
        }

        return null;
    }
};

PlayLayer_ganDengYan.prototype.btnPutCardClicked = function(btn) {
    var oCards = MjClient.selectCards_card;
    var cards = [];
    var laizis = MjClient.majiang.transformAndGetLaizi(oCards, cards);
    var laiziCards = MjClient.majiang.getLaiziCardsFromRet(cards);
    var otherLaizis = [];

    for (var i = 0; i < laiziCards.length; i++) {
        otherLaizis.push(MjClient.majiang.getRealLaizi(laiziCards[i]));
    }

    laizis = laizis.concat(otherLaizis);

    if (laizis.length <= 0) {
        // 没有癞子，直接出牌
        this.cardsSort(oCards);
        PutOutCard_card(); //可以出牌
        btn.visible = false;

        return;
    }

    // 有癞子，查找其他出牌的可能

    for (var i = 0; i < laiziCards.length; i++) {
        cards.splice(cards.indexOf(laiziCards[i]),1);
    }

    var tData = MjClient.data.sData.tData;
    var lastPutCard =  tData.lastPutCard;
    var areaSelectMode = tData.areaSelectMode;
    var results = [];
    var tempRets = [];

    var sortZhaDanRets = function(ret_1,ret_2) {
        if (ret_1.length == ret_2.length) {
            return MjClient.majiang.calCardsValue(ret_2, areaSelectMode) - MjClient.majiang.calCardsValue(ret_1, areaSelectMode);
        } else { 
            // 炸弹张数多的较大
            if (ret_1.length == 2) 
                return (ret_2.length > 4 ? 1 : -1);
            else if (ret_2.length == 2)
                return (ret_1.length <= 4 ? 1 : -1);
            else
                return ret_2.length - ret_1.length;
        }
    }

    var sortNormal = function(ret_1,ret_2) {
        return MjClient.majiang.calCardsValue(ret_2, areaSelectMode) - MjClient.majiang.calCardsValue(ret_1, areaSelectMode);
    }

    if (!lastPutCard || lastPutCard == -1) {
        // 先手
        // 炸弹>顺子>三张（非炸弹）>连对>对子
        var findTypes = [
            MjClient.majiang.CARDTPYE.zhadan,
            MjClient.majiang.CARDTPYE.shunzi,
            MjClient.majiang.CARDTPYE.sanzhang,
            MjClient.majiang.CARDTPYE.liandui,
            MjClient.majiang.CARDTPYE.duizi,
            MjClient.majiang.CARDTPYE.danpai
        ];

        if (areaSelectMode.sanZha)
            findTypes.splice(findTypes.indexOf(MjClient.majiang.CARDTPYE.sanzhang),1);

        for (var i = 0; i < findTypes.length; i++) {
            tempRets = MjClient.majiang.findCardByType(cards, laizis, findTypes[i], oCards.length, areaSelectMode);

            if (laizis.length > 0 && tempRets.length >= 2) {
                // 有癞子，结果需要去重
                MjClient.majiang.removeSameResults(tempRets);
            }

            if (tempRets.length > 1) {
                // 对相同牌型牌组排序（大的排前边）
                if (findTypes[i] == MjClient.majiang.CARDTPYE.zhadan)
                    tempRets.sort(sortZhaDanRets);
                else
                    tempRets.sort(sortNormal);
            }

            results = results.concat(tempRets);
        }
    } else {
        // 压牌

        var lastCardsType = MjClient.majiang.calType(lastPutCard, areaSelectMode);
        var findTypes = [MjClient.majiang.CARDTPYE.zhadan];  // 炸弹是必须要找的

        if (lastCardsType != MjClient.majiang.CARDTPYE.zhadan) {
            // 找同牌型牌组
            findTypes.push(lastCardsType);
        }

        for (var i = 0; i < findTypes.length; i++) {
            tempRets = MjClient.majiang.findCardByType(cards, laizis, findTypes[i], oCards.length, areaSelectMode);

            if (laizis.length > 0 && tempRets.length >= 2) {
                // 有癞子，结果需要去重
                MjClient.majiang.removeSameResults(tempRets);
            }

            for (var j = 0; j < tempRets.length;) {
                if (MjClient.majiang.canPut(tempRets[j], lastPutCard, areaSelectMode))
                    j++;
                else
                    tempRets.splice(j,1);
            }

            if (tempRets.length > 1) {
                // 对相同牌型牌组排序（大的排前边）
                if (findTypes[i] == MjClient.majiang.CARDTPYE.zhadan)
                    tempRets.sort(sortZhaDanRets);
                else
                    tempRets.sort(sortNormal);
            }

            results = results.concat(tempRets);
        }
    }

    if (results.length > 1) {
        // 弹出出牌选择面板
        MjClient.playui.addChild(new SelectPutCardsLayer(results), 99);
    } else {
        if(MjClient.selectTipCardsArray) 
            MjClient.selectTipCardsArray = null;

        this.cardsSort(results[0]);
        MjClient.gamenet.request("pkroom.handler.tableMsg", {
            cmd: "PKPut",
            card: results[0],
            tingAfterPut: false
        });

        btn.visible = false;
    }
};

PlayLayer_ganDengYan.prototype.addNewCards = function(msg,node,off) {
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var pl = getUIPlayer(off);

    if (!pl || pl.info.uid != msg.uid)
        return;

    //添加手牌
    if(MjClient.rePlayVideo == -1)// 表示正常游戏
    {
        if (pl.mjhand && msg.newCards && off == 0) {//只初始化自己的手牌
            for (var i = 0; i < msg.newCards.length; i++) {
                var card = getNewCard_card(node, "stand", "mjhand", msg.newCards[i], off);
                card.setUserData(0);
            }
        }
    }
    else
    {
        /*
            播放录像
        */
        if (pl.mjhand && msg.newCards)
        {
            if(off == 0)
            {
                for (var i = 0; i < msg.newCards.length; i++) {
                    getNewCard_card(node, "stand", "mjhand", msg.newCards[i], off);
                }
            }
            else
            {
                for (var i = 0; i < msg.newCards.length ; i++) {
                    getNewCard_card(node, "stand", "mjhand_replay", msg.newCards[i], off);
                }
            }
        }
    }

    this.CardLayoutRestore(node, off);
};

PlayLayer_ganDengYan.prototype.RemoveNodeBack = function(node, name, num, tag) {
    var _delCount = 0; //标记是否有删除的牌 add by sking 2018.9.17
    var children = node.children;
    for(var i = children.length - 1; i >= 0 && num > 0; i--)
    {
        var ci = children[i];
        if(ci.name == name && (!(tag > 0) || ci.tag == tag || MjClient.majiang.getRealLaizi(tag) == ci.tag))
        {
            //删除手牌之前先把手牌存在Pool里 by sking 2018.10.17
            if(ci.name == "putOutCard")
            {
                ci.name = "mjhand";
            }

            _delCount++;
            //CommonPool.putInPool(ci);
            ci.removeFromParent(true);

            num--;
        }
    }

    if (num != 0)
    {
        cc.log(node.name + " RemoveNodeBack fail " + name + " " + tag);
    }
    return _delCount;
};

PlayLayer_ganDengYan.prototype.findNodesBack = function(node, name, tags) {
    tags = tags.slice();

    for (var i = 0; i < tags.length; i++) {
        var realLaizi = MjClient.majiang.getRealLaizi(tags[i]);
        if (realLaizi != -1)
            tags[i] = realLaizi;
    }

    var retNodes = [];
    var children = node.children;
    for(var i = children.length - 1; i >= 0; i--)
    {
        var ci = children[i];
        if(ci.name != name)
            continue;
        var index = tags.indexOf(ci.tag);
        if (index < 0)
            continue;

        tags[index] = -1;
        retNodes[index] = ci;
    }

    for (var i = 0; i < tags.length; i ++) {
        if (!retNodes[i])
            mylog(node.name + " findNodesBack fail " + name + " " + tags[i]);
    }
    return retNodes;
}

PlayLayer_ganDengYan.prototype.cardsSort = function(cards)
{
    var pointCounts = {};
    for (var i = 0; i < cards.length; i++) {
        var p = MjClient.majiang.calPoint(cards[i]);
        if (pointCounts[p])
            pointCounts[p] ++;
        else
            pointCounts[p] = 1;
    }

    var commonCmp = function (a, b) {
        var c1 = pointCounts[MjClient.majiang.calPoint(a)];
        var c2 = pointCounts[MjClient.majiang.calPoint(b)];
        if (c1 == c2)
            return MjClient.majiang.cardValueCmp(a, b);
        else
            return c1 - c2;
    }

    cards.sort(function(a, b) { return -commonCmp(a, b);});
}


