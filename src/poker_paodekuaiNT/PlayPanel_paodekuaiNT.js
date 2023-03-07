/**
 * Created by Administrator on 2017/3/9.
 */

var PlayLayer_paoDeKuaiNT = PlayLayer_PDK.extend({
    getJsBind: function() {
        return {
            _event: {
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
                        if (sData.tData.roundNum <= 0) {
                            if(!tData.matchId){
                                self.addChild(new GameOverLayer(),500);
                            }else{
                                self.runAction(cc.sequence(cc.delayTime(3),cc.callFunc(function(){
                                    self.addChild(new GameOverLayer(),500);
                                })))
                            }
                        }
                        self.addChild(new EndOneView_paodekuaiNT(),500);
                    }
                    this.runAction(cc.sequence(cc.DelayTime(1.0),cc.callFunc(delayExe)));
                },
                initSceneData: function() {
                    //初始化桌子的客户端数据
                    MjClient.playui.InitC_Data();

                    reConectHeadLayout_card(this);
                    CheckRoomUiDelete();
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    if(tData.tState == TableState.waitPut )
                    {
                        UpdataCurrentPutCard();
                    }

                    for(var i = 0;i < MjClient.MaxPlayerNum;i++)
                    {
                        currentLeftCardCount_paodekuai(i);
                    }
                    // 跑得快 自动出牌
                    if (IsTurnToMe()) {
                        // 如果提示只有一手牌， 自动提起
                        // 如果提示只有一手牌， 且是我全部的手牌数量， 自动打出
                        AutoPutLastCard_card();
                    }
                },
            },
            gameName:{
                _run:function()
                {
                    setWgtLayout(this,[0.16, 0.075],[0.5, 0.6],[0, 0]);
                }
            },
            roundInfo:{
                _run:function()
                {
                    setWgtLayout(this,[0.12, 0.12],[0.5, 0.52],[0, 0]);

                    var tData = MjClient.data.sData.tData;
                    var str = MjClient.playui.getGameInfoString("roundInfo");
                    this.setString(str);
                    this.ignoreContentAdaptWithSize(true);
                },
            },
            banner: {
                _layout: [
                    [0.5, 0.5],
                    [0.53, 1],
                    [0, 0]
                ],
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
                gps_btn: {
                    _run: function() {
                        this.setVisible(false);
                    },
                    _click: function() {
                    }
                },
                changeBg: {
                    _run:function() {
                        //setWgtLayout(this,[0.12, 0.12],[0.85,0.05],[0,0]);

                        var banner = this.parent;
                        var waitNode = MjClient.playui.getChildByName("playUINode").getChildByName("wait");
                        var delroom = waitNode.getChildByName("delroom");
                        var backHomebtn = waitNode.getChildByName("backHomebtn");
                        var distanceX = banner.getChildByName("setting").getPositionX() - this.getPositionX();

                        delroom.setScale(banner.scaleX,banner.scaleY);
                        backHomebtn.setScale(banner.scaleX,banner.scaleY);

                        delroom.setPosition(waitNode.convertToNodeSpace(banner.convertToWorldSpace(cc.p(this.getPositionX() - distanceX,this.getPositionY()))));
                        backHomebtn.setPosition(waitNode.convertToNodeSpace(banner.convertToWorldSpace(cc.p(this.getPositionX() - 2*distanceX,this.getPositionY()))));
                    }
                },
            },
            wait: {
                _run:function() {
                    this.visible = true;
                },
                getRoomNum: {
                    _run:function(){
                        setWgtLayout(this, [0.18, 0.18],[0.4, 0.5],[0, 0]);
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
                        [0.6, 0.5],
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
                        // if (isIPhoneX()) {
                        //     setWgtLayout(this, [0.11, 0.11],[0.1, 0.6],[0, 0]);
                        // }
                        // else {
                        //     setWgtLayout(this, [0.11, 0.11], [0.05, 0.6], [0, 0]);
                        // }
                    },
                    _click: function(btn) {
                        MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Likaifangjian", {uid:SelfUid(), gameType:MjClient.gameType});

                        var sData = MjClient.data.sData;
                        if (sData) {
                            if (IsRoomCreator()) {
                                MjClient.showMsg("返回大厅房间仍然保留\n赶快去邀请好友吧",
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
                        this.getChildByName('getRoomNum').visible = IsInviteVisible() && !MjClient.remoteCfg.guestLogin;
                        this.getChildByName('wxinvite').visible = IsInviteVisible() && !MjClient.remoteCfg.guestLogin;
                        this.getChildByName('delroom').visible = IsInviteVisible() || isWaitReady;
                        this.getChildByName('backHomebtn').visible = IsInviteVisible() || isWaitReady;
                    },
                    addPlayer: function(eD) {
                        var isWaitReady = eD.tData.tState == TableState.waitReady;
                        console.log(">>>>>> play add player >>>>");
                        this.getChildByName('getRoomNum').visible = IsInviteVisible() && !MjClient.remoteCfg.guestLogin;
                        this.getChildByName('wxinvite').visible = IsInviteVisible() && !MjClient.remoteCfg.guestLogin;
                        this.getChildByName('delroom').visible = IsInviteVisible() || isWaitReady;
                        this.getChildByName('backHomebtn').visible = IsInviteVisible() || isWaitReady;
                    },
                    removePlayer: function(eD) {
                        var isWaitReady = eD.tData.tState == TableState.waitReady;
                        this.getChildByName('getRoomNum').visible = !MjClient.remoteCfg.guestLogin;
                        this.getChildByName('wxinvite').visible = !MjClient.remoteCfg.guestLogin;
                        this.getChildByName('delroom').visible = IsInviteVisible() || isWaitReady;
                        this.getChildByName('backHomebtn').visible = IsInviteVisible() || isWaitReady;
                    }
                }
            },
            BtnReady: {
                _visible: false,
                _run: function() {
                    if (MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP || MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ) {
                        setWgtLayout(this,[0.16, 0], [0.5, 0.4], [0, 0]);
                    }
                    else {
                        setWgtLayout(this,[0.2, 0.2], [0.5, 0.4], [0, 0]);
                    }  
                },
                _click: function(_this) {
                    PKPassConfirmToServer_card();
                    //MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Zhunbei", {uid: SelfUid(), gameType:MjClient.gameType});
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
            BtnPutCard:{
                _event:{
                    waitPut: function() {
                        var tData = MjClient.data.sData.tData;
                        if(!IsTurnToMe() || tData.tState != TableState.waitPut || MjClient.playui.isFaPai)
                        {
                            this.visible = false;
                        }
                        else
                        {
                            this.visible = true;
                        }

                        // 跑得快 自动出牌
                        if (IsTurnToMe()) {
                            // 如果提示只有一手牌， 自动提起
                            // 如果提示只有一手牌， 且是我全部的手牌数量， 自动打出
                            AutoPutLastCard_card();
                        }
                    },
                }
            },//end of add by sking
            flyCard:{
                _event:{
                    waitPut:function(eD){
                        var tData = MjClient.data.sData.tData;
                        if (tData.roundNum == tData.roundAll && tData.lastPutPlayer == -1) {
                            setWgtLayout(this,[0.036, 0], [0.5, 0.75], [0, 0]);
                            MjClient.playui.shwoFlyCardAnim(this,11);
                        }
                    }
                }
            },
            down: {
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
                        }
                    },
                    PostCardsEnded: function()
                    {
                        // 发牌完毕处理正常牌逻辑
                        if(!MjClient.playui.isFaPai && 
                            MjClient.data.sData.tData.tState == TableState.waitPut && 
                            MjClient.playui.isWaitAniEnd)
                        {
                            delete MjClient.playui.isWaitAniEnd;
                            
                            DealWaitPut_card(this, null, 0);
                            UpdataCurrentPutCard();
                        }
                    },
                },
            },
            clock: {
                number: {
                    _event: {
                        waitPut: function() {
                            this.stopAllActions();
                            MjClient.clockNode.visible = true;
                            stopEffect(playTimeUpEff);
                            MjClient.playui.clockNumberUpdate(this);
                            MjClient.playui.updateClockPosition(MjClient.clockNode);
                        },
                    }
                },
            },
        }
    },
    ctor: function() {
        this._super(res.Play_PaoDeKuaiNT_json);

        // 在亲友圈房间中添加邀请亲友圈牌有一起对局
        addClubYaoqingBtn(4);

        // 俱乐部返回大厅功能：by_jcw
        addClub_BackHallBtn(true);

        return true;
    }
});

PlayLayer_paoDeKuaiNT.prototype.initUserHandUIPaoDeKuai = function (node, off, needSort)
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

            if (/*tData.areaSelectMode.fangZuoBi && */tData.lastPutPlayer == -1 && tData.curPlayer != getPlayerIndex(0))
            {
                MjClient.playui.isShowHandCardBeiMain = true;
                MjClient.playui.showHandCardBeiMian(true);
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
}

PlayLayer_paoDeKuaiNT.prototype.updateClockPosition = function(arrowNode)
{
    var tData = MjClient.data.sData.tData;
    var uids = tData.uids;
    var curPlayerIndex = (tData.curPlayer + MjClient.MaxPlayerNum - tData.uids.indexOf(SelfUid())) % MjClient.MaxPlayerNum;

    var curPlayerNode = null;
    var deskCardPosOffset = {
        x: 44,
        y:-34
    }
    if (curPlayerIndex == 1)
        curPlayerNode = this._rightNode;
    else if (curPlayerIndex == 2) {
        curPlayerNode = this._topNode;
        deskCardPosOffset.x = 0 - deskCardPosOffset.x;
    }

    if (curPlayerNode != null){
        var deskCardPos = curPlayerNode.getChildByName("deskCard").getPosition();

        if (isIPhoneX() && MjClient.rePlayVideo != -1 && !MjClient.data.sData.tData.fieldId) {
            deskCardPos.x += 41 * Math.min(MjClient.size.width/1280,MjClient.size.height/720) * (curPlayerIndex == 1 ? 2 : -2);
        } else {
            deskCardPos.y += deskCardPosOffset.y;
            deskCardPos.x += deskCardPosOffset.x; 
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
PlayLayer_paoDeKuaiNT.prototype.getGameInfoString = function(param)
{
    var tData = MjClient.data.sData.tData;
    var str = "";

    if (param != "roundInfo")
        str += MjClient.MaxPlayerNum == 3 ? "三人玩," : "两人玩,";
    str += tData.areaSelectMode.handCardType == 0 ? "AAAA," : "AAA+2,",
    //str += tData.areaSelectMode.isZhaDanFanBei ? "炸弹翻倍," : "";
    //str += tData.areaSelectMode.mustPutHongTaoSan ? "先出红桃三," : "";
    str += tData.areaSelectMode.mustPut ? "能管必管," : "";
    str += tData.areaSelectMode.isBiMenFanBei ? "16张牌32分," : "";
    str += tData.areaSelectMode.winCountType == 0 ? "一个赢家," : "两两结算,";
    str += tData.areaSelectMode.baoDanMustPut ? "报单必顶," : "";
    str += tData.areaSelectMode.isPlayerShuffle == 1 ? "手动切牌," : "系统切牌,";

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

    if (param != "roundInfo") 
        str += tData.areaSelectMode.showCardNumber ? "显示牌数," : "";

    if(tData.areaSelectMode.fanBei == 1)
        str += "少于" + tData.areaSelectMode.fanBeiScore + "分翻倍,";
    else if(tData.areaSelectMode.fanBei == 2)
        str += "少于5分翻3倍,";
    
    if(tData.areaSelectMode.trustTime > 0)
    {
        str += Math.floor(tData.areaSelectMode.trustTime/60) + "分钟,";
    } 

    if (param != "roundInfo")
    {
        switch (tData.areaSelectMode.payWay)
        {
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