
var PlayLayer_PaoDeKuaiHuaian = PlayLayer_PDK.extend({
    getJsBind: function() {
        return {
            _event: {
                mjhand: function() {
                    if (MjClient.endoneui != null && cc.sys.isObjectValid(MjClient.endoneui)) {
                        cc.log("=======mjhand====endoneui====" + typeof (MjClient.endoneui) );
                        MjClient.endoneui.removeFromParent(true);
                        MjClient.endoneui = null;
                    }

                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    // resetFlowerNum(this);
                    // resetJiaZhuNum(this);

                    try{
                        //ScanCheatLayer.showStartOnce();
                    }catch(e){
                        cc.log('please add "src/ScanCheatLayer.js" to project.json');
                    }

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
                roundEnd: function() {
                    MjClient.selectTipCardsArray = null;
                    
                    var self = this;
                    function delayExe()
                    {
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;

                        if(tData.tState && tData.tState !=TableState.roundFinish){
                            return;
                        }

                        //resetEatActionAnim();
                        if (sData.tData.roundNum <= 0)
                        {
                            if(tData.matchId){
                                self.runAction(cc.sequence(cc.delayTime(3),cc.callFunc(function(){
                                    self.addChild(new GameOverLayer(),500);
                                })))
                            }
                        }
                        self.addChild(new EndOneView_PaodekuaiHuaian(),500);
                    }
                    this.runAction(cc.sequence(cc.DelayTime(1.0),cc.callFunc(delayExe)));
                },
                onlinePlayer: function() {
                    // reConectHeadLayout_card(this);
                },
            },
            gameName:{
                _run:function()
                {
                    setWgtLayout(this,[0.2, 0.1],[0.5, 0.6],[0, 0]);
                }
            },
            roundInfo:{
                _run:function()
                {
                    setWgtLayout(this,[0.12, 0.12],[0.5, 0.52],[0, 0]);

                    var tData = MjClient.data.sData.tData;
                    var str = MjClient.playui.getGameInfoString();
                    this.setString(str);
                    this.ignoreContentAdaptWithSize(true);
                },
                _event:{
                    mjhand:function()
                    {
                        var tData = MjClient.data.sData.tData;
                        var str = MjClient.playui.getGameInfoString();
                        this.setString(str);
                    },
                }
            },
            banner: {
                bg_time:{
                     _run:function()
                    {
                        var text = new ccui.Text();
                        text.setFontName(MjClient.fzcyfont);
                        text.setFontSize(18);
                        text.setTextColor(cc.color(222,226,199));
                        text.setAnchorPoint(0.5,0.5);
                        text.setPosition(this.getContentSize().width / 2, this.getContentSize().height / 2);
                        this.addChild(text);
                        text.schedule(function(){

                            var time = MjClient.getCurrentTime();
                            var str = (time[3]<10?"0"+time[3]:time[3])+":"+
                                (time[4]<10?"0"+time[4]:time[4]);
                            this.setString(str);
                        });
                    }

                },
                setting: {
                    _click: function() {
                        var settingLayer = new SettingViewCard();
                        settingLayer.setName("PlayLayerClick");
                        MjClient.Scene.addChild(settingLayer);
                        MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Shezhi", {uid:SelfUid(),gameType:MjClient.gameType});
                    },
                },
            },
            wait: {
                _run:function() {
                    this.visible = true;
                },
                getRoomNum: {
                    _run:function(){
                        setWgtLayout(this, [0.18, 0.18],[0.4, 0.39],[0, 0]);
                    },
                    _visible:function()
                    {
                        return !MjClient.remoteCfg.guestLogin;
                    },
                    _click: function() {
                       getPlayingRoomInfo(1);
                        MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Fuzhifangjianxinxi", {uid:SelfUid(), gameType:MjClient.gameType});

                    }
                },
                wxinvite: {
                    _layout: [
                        [0.18, 0.18],
                        [0.5, 0.4],
                        [0, 0]
                    ],
                    _click: function() {
                       getPlayingRoomInfo(2);
                        MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Yaoqingweixinhaoyou", {uid:SelfUid(), gameType:MjClient.gameType});

                    },
                    _visible:function()
                    {
                        return !MjClient.remoteCfg.guestLogin;
                    }
                },
                delroom: {
                    _run:function(){
                        // if (isIPhoneX()) {
                        //     setWgtLayout(this, [0.11, 0.11],[0.1, 0.45],[0, 0]);
                        // }
                        // else {
                        //     setWgtLayout(this, [0.11, 0.11],[0.05, 0.45],[0, 0]);
                        // }
                    },
                    _click: function() {
                        MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Jiesanfangjian", {uid:SelfUid(), gameType:MjClient.gameType});

                        MjClient.delRoom(true);
                    },
                    _event: {
                        waitReady: function() {
                            this.visible = true;
                        }
                    }
                },
                backHomebtn: {
                    _run:function(){
                        //  if (isIPhoneX()) {
                        //     setWgtLayout(this, [0.11, 0.11],[0.1, 0.6],[0, 0]);
                        // }
                        // else {
                        //     setWgtLayout(this, [0.11, 0.11], [0.05, 0.6], [0, 0]);
                        // }
                    },
                    _click: function(btn) {
                        var sData = MjClient.data.sData;
                        if (sData) {
                            if (IsRoomCreator()) {
                                MjClient.showMsg("确定要退出房间吗？",
                                    function() {
                                        MjClient.leaveGame();
                                    },
                                    function() {});
                            } else {
                                MjClient.showMsg("确定要退出房间吗？",
                                    function() {
                                        MjClient.leaveGame();
                                    },
                                    function() {});
                            }
                        }

                    },
                    _event: {
                        waitReady: function() {
                            this.visible = true;
                        }
                    }
                },
                _event: {
                    onlinePlayer: function() {
                        if( IsAllPlayerReadyState() ) {
                            this.getChildByName('delroom').visible = false;
                            this.getChildByName('backHomebtn').visible = false;
                        }
                    },
                    initSceneData: function(eD) {
                        var isWaitReady = eD.tData.tState == TableState.waitReady;
                        this.getChildByName('getRoomNum').visible = false;//IsInviteVisible();
                        this.getChildByName('wxinvite').visible = IsInviteVisible() && !MjClient.remoteCfg.guestLogin;
                        this.getChildByName('delroom').visible = IsInviteVisible() || isWaitReady;
                        this.getChildByName('backHomebtn').visible = IsInviteVisible() || isWaitReady;
                    },
                    addPlayer: function(eD) {
                        var isWaitReady = eD.tData.tState == TableState.waitReady;
                        console.log(">>>>>> play add player >>>>");
                        this.getChildByName('getRoomNum').visible = false;//IsInviteVisible();
                        this.getChildByName('wxinvite').visible = IsInviteVisible() && !MjClient.remoteCfg.guestLogin;
                        this.getChildByName('delroom').visible = IsInviteVisible() || isWaitReady;
                        this.getChildByName('backHomebtn').visible = IsInviteVisible() || isWaitReady;
                    },
                    removePlayer: function(eD) {
                        var isWaitReady = eD.tData.tState == TableState.waitReady;
                        this.getChildByName('getRoomNum').visible = false;//IsInviteVisible();
                        this.getChildByName('wxinvite').visible = !MjClient.remoteCfg.guestLogin;
                        this.getChildByName('delroom').visible = IsInviteVisible() || isWaitReady;
                        this.getChildByName('backHomebtn').visible = IsInviteVisible() || isWaitReady;
                    }
                }
            },
            BtnReady: {
                _visible: false,
                _run: function() {
                    setWgtLayout(this, [0.18, 0.18], [0.5, 0.4], [0, 0]);
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
            flyCard:{
                _event:{
                    waitPut:function(eD){
                        var tData = MjClient.data.sData.tData;
                        if ((tData.roundNum == tData.roundAll || tData.areaSelectMode.mustPutHongTaoSan) && tData.lastPutPlayer == -1) {
                            setWgtLayout(this,[0.036, 0], [0.5, 0.75], [0, 0]);
                            MjClient.playui.shwoFlyCardAnim(this,11);
                        }
                    }
                }
            },
            down: {
                ready: {
                    _run: function() {
                        setWgtLayout(this, [this.width / 1280, this.height / 720], [0.5, 0.5], [0, -1.5]);
                        GetReadyVisible(this, 0);
                        //this.visible = true;
                    },
                },
                _event: {
                    waitPut:function(eD){
                        cc.log(">>>>>>>>>>>>>>>>down>>>>>>>>>>>>>>>waitPut");

                        var tData = MjClient.data.sData.tData;
                        if (MjClient.playui.isShowHandCardBeiMain && (tData.curPlayer == getPlayerIndex(0) || tData.lastPutPlayer != -1)) {
                            MjClient.playui.isShowHandCardBeiMain = false;
                            MjClient.playui.hideHandCardBeiMian();
                        }

                        // 发牌时暂时不计算牌型提示
                        if (!MjClient.playui.isFaPai)
                        {
                            if (MjClient.playui.isWaitAniEnd)
                                delete MjClient.playui.isWaitAniEnd;

                            DealWaitPut_card(this, eD, 0);
                            UpdataCurrentPutCard();

                            // 跑得快 自动出牌
                            if (IsTurnToMe()) {
                                // 如果提示只有一手牌， 自动提起
                                // 如果提示只有一手牌， 且是我全部的手牌数量， 自动打出
                                AutoPutLastCard_card_ty();
                            }
                        }
                    },
                }
            },
            right: {
                ready: {
                    _run: function() {
                        setWgtLayout(this, [this.width / 1280, this.height / 720], [0.5, 0.5], [2, 0]);
                        GetReadyVisible(this, 1);
                    },
                },
                deskCard: {
                    // _layout: [
                    //     [0.1, 0.15],
                    //     [1, 0.55],
                    //     [-3, 0]
                    // ],
                    _run:function()
                    {
                        if(MjClient.rePlayVideo == -1)// 表示正常游戏
                            setWgtLayout(this,[0.052, 0],[1, 0.65],[-3.5, 0.5]);
                        else if (isIPhoneX() && MjClient.rePlayVideo != -1 && !MjClient.data.sData.tData.fieldId)
                            setWgtLayout(this,[0.052, 0],[1, 0.65],[-4.25, 0.5]);
                        else
                            setWgtLayout(this,[0.052, 0],[1, 0.65],[-4.2, 0.5]);
                    },
                },
            },
            top: {
                ready: {
                    _run: function() {
                        setWgtLayout(this, [this.width / 1280, this.height / 720], [0.5, 0.5], [-2, 0]);
                        GetReadyVisible(this, 2);
                    },
                },
                deskCard: {
                    // _layout: [
                    //     [0.12, 0.15],
                    //     [0.16, 0.55],
                    //     [0, 0.1]
                    // ],
                    _run:function()
                    {
                        if(MjClient.rePlayVideo == -1)// 表示正常游戏
                            setWgtLayout(this,[0.052, 0],[0.16, 0.65],[0.5, 0.5]);
                        else if (isIPhoneX() && MjClient.rePlayVideo != -1 && !MjClient.data.sData.tData.fieldId)
                            setWgtLayout(this,[0.052, 0],[0.16, 0.65],[2.2, 0.5]);
                        else
                            setWgtLayout(this,[0.052, 0],[0.16, 0.65],[1.2, 0.5]);
                    },
                },
            },
        };
    },
    ctor: function() {
        var playui = this._super(res.Play_PaoDeKuaiHuaian_json);

        addClubYaoqingBtn(2);

        // 俱乐部返回大厅功能：by_jcw
        addClub_BackHallBtn(true);

        // 回看
        if(MjClient.rePlayVideo == -1){
            this._viewLookBack = COMMON_UI.createPokerLookbackView()
            playui.node.addChild(this._viewLookBack);
            this._viewLookBack.setPosition(MjClient.size.width / 2,MjClient.size.height / 2);
            this._viewLookBack.setContentSize(MjClient.size.width, MjClient.size.height);
        };

        return true;
    }
});

// add...................   Greene
//初始化桌子上的客户端数据c_data..各个游戏的自身数据可以在这里初始，
//尽量不要在外部公共代码判断游戏类型，而是在c_data里初始化数据。
//在PlayLayer的_event 的 initSceneData调用
PlayLayer_PaoDeKuaiHuaian.prototype.InitC_Data = function() {
    if (!MjClient.data.c_Data)
        MjClient.data.c_Data = {};
    cc.log("InitC_Data===========================")
    //出牌是否动画
    MjClient.data.c_Data.bPutCardAnim = MjClient.data.sData.tData.areaSelectMode.playSpeed != 0;
    //牌型动画是否是文字图片
    MjClient.data.c_Data.bTxtAnim = MjClient.data.sData.tData.areaSelectMode.playSpeed == 0;
}

// off 是四个位置，根据off 显示四个位置的信息 by sking
PlayLayer_PaoDeKuaiHuaian.prototype.setUserVisiblePaoDeKuai = function (node, off)
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
        // name_bg.visible = true;
        // score_bg.visible = true;
        MjClient.loadWxHead(pl.info.uid, pl.info.headimgurl);
        setUserOffline(node, off);
        MjClient.playui.initUserHandUIPaoDeKuai(node, off);
    }
    else
    {
        name.visible = false;
        coin.visible = false;
        offline.visible = false;
        coin.visible = false;
        var WxHead = nobody.getChildByName("WxHead");
        if(WxHead)
            WxHead.removeFromParent(true);
    }
};


PlayLayer_PaoDeKuaiHuaian.prototype.initUserHandUIPaoDeKuai = function (node, off, needSort)
{
    if (cc.isUndefined(needSort))
        needSort = true;

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
    currentLeftCardCount_paodekuai(off);

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

            if (tData.areaSelectMode.fangZuoBi && tData.lastPutPlayer == -1 && tData.curPlayer != getPlayerIndex(0))
            {
                MjClient.playui.isShowHandCardBeiMain = true;
                MjClient.playui.showHandCardBeiMian();
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

    MjClient.playui.CardLayoutRestore(node, off, needSort);
};

PlayLayer_PaoDeKuaiHuaian.prototype.updateClockPosition = function(arrowNode)
{
    var tData = MjClient.data.sData.tData;
    var uids = tData.uids;
    var curPlayerIndex = (tData.curPlayer + MjClient.MaxPlayerNum - tData.uids.indexOf(SelfUid())) % MjClient.MaxPlayerNum;

    var curPlayerNode = null;
    if (curPlayerIndex == 1)
        curPlayerNode = this._rightNode;
    else if (curPlayerIndex == 2)
        curPlayerNode = this._topNode;

    if (curPlayerNode != null)
    {
        var deskCardPos = curPlayerNode.getChildByName("deskCard").getPosition();

        if (isIPhoneX() && MjClient.rePlayVideo != -1 && !MjClient.data.sData.tData.fieldId) {
            deskCardPos.x += 41 * Math.min(MjClient.size.width/1280,MjClient.size.height/720) * (curPlayerIndex == 1 ? 2 : -2);
        }

        arrowNode.setPosition(deskCardPos);
    }
    else if (isIPhoneX() && MjClient.rePlayVideo != -1 && !MjClient.data.sData.tData.fieldId) {
        var deskCardPos = this._topNode.getChildByName("deskCard").getPosition();
        deskCardPos.x -= 41 * Math.min(MjClient.size.width/1280,MjClient.size.height/720) * 2;
        deskCardPos.y = arrowNode.srcPosition.y;
        arrowNode.setPosition(deskCardPos);
    }
    else
        arrowNode.setPosition(arrowNode.srcPosition);

    if (curPlayerNode != null)
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
PlayLayer_PaoDeKuaiHuaian.prototype.getGameInfoString = function()
{
    var tData = MjClient.data.sData.tData;
    var str = "";

    str += tData.areaSelectMode.isXiaoGuan ? "小关X2," : "";
    str += tData.areaSelectMode.isDaGuan ? "大关X3," : "";
    str += tData.areaSelectMode.isDaGuanX2 ? "大关X2," : "";
    str += tData.areaSelectMode.mustPutHongTaoSan ? "红桃3先手," : "赢家先手,";
    str += tData.areaSelectMode.can4dai2 ? "四带二," : "";
    // str += tData.areaSelectMode.can3dai2 ? "三带二," : "";
    str += tData.areaSelectMode.isZhaDanFanBei ? "炸弹翻倍," : "";
    str += tData.areaSelectMode.tongHuaShun ? "同花顺," : "";
    str += tData.areaSelectMode.isPlayerShuffle == 1 ? "手动切牌," : "系统切牌,";
    str += tData.areaSelectMode.bombScore == 0 ? ("炸弹加"+(tData.areaSelectMode.bombScoreCnt==0? 5:10)+"分,") : "炸弹翻倍,";
    if (typeof(tData.areaSelectMode.fengDing) == "number") {
        switch (tData.areaSelectMode.fengDing)
        {
            case 1:
                str += "30/32分封顶,";
                break;
            case 2:
                str += "60/64分封顶,";
                break;
        }
    }

    //str += tData.areaSelectMode.difen ? "底分X" + tData.areaSelectMode.difen + ","  : "";
    if(tData.areaSelectMode.fanBei == 1)
    {
        str += "小于" + tData.areaSelectMode.fanBeiScore + "分翻倍,";
    } 
    if(tData.areaSelectMode.trustTime > 0)
    {
        str += Math.floor(tData.areaSelectMode.trustTime/60) + "分钟,";
    }
    if (str.charAt(str.length - 1) == ",")
        str = str.substring(0, str.length - 1);
    return str;
};
