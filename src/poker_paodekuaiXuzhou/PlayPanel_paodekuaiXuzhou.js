
var PlayLayer_paodekuaiXuzhou = PlayLayer_PDK.extend({
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
                        if (sData.tData.roundNum <= 0)
                        {
                            if(tData.matchId){
                                self.runAction(cc.sequence(cc.delayTime(3),cc.callFunc(function(){
                                    self.addChild(new GameOverLayer(),500);
                                })))
                            }
                        }
                        self.addChild(new EndOneView_paodekuaiXuzhou(),500);
                    }
                    this.runAction(cc.sequence(cc.DelayTime(0.2),cc.callFunc(delayExe)));
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

                    if(MjClient.data.sData.tData.tState <= TableState.waitReady)
                    {
                        sendGPS();
                        MjClient.checkChangeLocationApp();
                    }
                    if (IsTurnToMe()) {
                        // 如果提示只有一手牌， 自动提起
                        // 如果提示只有一手牌， 且是我全部的手牌数量， 自动打出
                        AutoPutLastCard_card_ty();
                    }
                },
                onlinePlayer: function() {
                    // reConectHeadLayout_card(this);
                },
            },
            gameName:{
                _run:function()
                {
                    setWgtLayout(this,[0.15, 0.18],[0.5, 0.6],[0, 0]);
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
                        this.setVisible(MjClient.MaxPlayerNum != 2);

                        var banner = this.parent;
                        var waitNode = MjClient.playui.getChildByName("playUINode").getChildByName("wait");
                        var delroom = waitNode.getChildByName("delroom");
                        var backHomebtn = waitNode.getChildByName("backHomebtn");
                        var distanceX = banner.getChildByName("setting").getPositionX() - banner.getChildByName("changeBg").getPositionX();

                        delroom.setScale(banner.scaleX,banner.scaleY);
                        backHomebtn.setScale(banner.scaleX,banner.scaleY);

                        if (this.isVisible()) {
                            delroom.setPosition(waitNode.convertToNodeSpace(banner.convertToWorldSpace(cc.p(this.getPositionX() - distanceX,this.getPositionY()))))
                            backHomebtn.setPosition(waitNode.convertToNodeSpace(banner.convertToWorldSpace(cc.p(this.getPositionX() - 2*distanceX,this.getPositionY()))))
                        }
                        else {
                            delroom.setPosition(waitNode.convertToNodeSpace(banner.convertToWorldSpace(this.getPosition())))
                            backHomebtn.setPosition(waitNode.convertToNodeSpace(banner.convertToWorldSpace(cc.p(this.getPositionX() - distanceX,this.getPositionY()))))
                        }
                    },
                    _click: function() {
                        if (MjClient.MaxPlayerNum == 3) {
                            MjClient.Scene.addChild(new showDistance3PlayerLayer());
                        } else if (MjClient.MaxPlayerNum == 4) {
                            MjClient.Scene.addChild(new showDistanceLayer());
                        }
                        MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Dingwei", {uid: SelfUid(),gameType:MjClient.gameType});
                    }
                },
            },
            BtnReady: {
                _visible: false,
                _run: function() {
                    setWgtLayout(this,[0.2, 0.2], [0.5, 0.4], [0, 0]);
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
            noPutTips:{ //add by  sking for put card button
                _run: function () {
                    this.visible = false;
                    setWgtLayout(this,[0.39, 0], [0.5, 0.45], [0, 0]);
                },
            },//end of add by sking
            baoDanMaxTip: {
                _run: function() {
                    this.visible = false;
                    setWgtLayout(this, [0.56, 0], [0.5, 0.1], [0, 0]);

                    this.checkVisible = function() {
                        var tData = MjClient.data.sData.tData;
                        var plNext = getUIPlayer(1);

                        // 下家报单,单牌请出最大牌
                        if (IsTurnToMe() && tData.tState == TableState.waitPut && plNext && plNext.handCount == 1) {
                            this.visible = tData.lastPutPlayer == tData.curPlayer || tData.lastPutCard.length == 1;
                        }
                    }
                },
                _event: {
                    clearCardUI: function() {
                        this.visible = false;
                    },
                    mjhand: function() {
                        this.visible = false;
                    },
                    PKPut: function(eD) {
                        this.visible = false;
                    },
                    initSceneData: function(eD) {
                        this.checkVisible();
                    },
                    waitPut: function() {
                        this.checkVisible();
                    },
                }
            },
            flyCard:{
                _event:{
                    waitPut:function(eD){
                        var tData = MjClient.data.sData.tData;
                        if (tData.roundNum == tData.roundAll && tData.lastPutPlayer == -1) {
                            setWgtLayout(this,[0.036, 0], [0.5, 0.75], [0, 0]);
                            MjClient.playui.shwoFlyCardAnim(this,12);
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
                    mjhand: function(eD) {
                        if (MjClient.data.sData.tData.areaSelectMode.fangZuoBi)
                            MjClient.data.sData.tData.curPlayer = -1;
                        MjClient.playui.initUserHandUIPaoDeKuai(this, 0);
                        // 先排序 再发牌 上面的这个函数可能不走排序的代码段
                        delete MjClient.playui.isFaPai;
                        MjClient.playui.CardLayoutRestore(this, 0);
                        var tData = MjClient.data.sData.tData;
                        var pl = getUIPlayer(0);

                        if (tData.matchId ||(pl && pl.trust))
                        {
                            // 托管状态下，不播放发牌动画 
                        }
                        else
                        {
                            showPostCardAnimation();
                        } 

                        MjClient.playui.isWaitAniEnd = true;
                    },
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
                head: {
                    tingCard:{
                        _run: function () {
                            if (isIPhoneX() && MjClient.rePlayVideo != -1 && !MjClient.data.sData.tData.fieldId)
                                this.setPositionX(155);
                        },
                        _visible:false,
                        _event:{
                            initSceneData: function(eD)
                            {
                                var pl = getUIPlayer(2);
                                if(pl && pl.handCount)
                                {
                                    this.visible = true;
                                }
                                else
                                {
                                    this.visible = false;
                                }

                            },
                            clearCardUI:function()
                            {
                                this.visible = false;
                            },
                            changePosition:function()
                            {
                                this.visible = true;
                            }
                        }
                    },
                },
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
        var playui = this._super(res.Play_PaoDeKuaiXuzhou_json);

        //新版wait状态 的四个按钮
        MJ_setWaitBtn(true, [[0.115, 0.115], [0.595,0.93], [0,0]], [[0.12, 0.12], [0.595,0.92], [0,0]]);
        // 在亲友圈房间中添加邀请亲友圈牌有一起对局
        addClubYaoqingBtn(1);
        // 回看
        if(MjClient.rePlayVideo == -1){
            this._viewLookBack = COMMON_UI.createPokerLookbackView()
            playui.node.addChild(this._viewLookBack);
            this._viewLookBack.setPosition(MjClient.size.width / 2,MjClient.size.height / 2);
            this._viewLookBack.setContentSize(MjClient.size.width, MjClient.size.height);
        }

        return true;
    }

});

// off 是四个位置，根据off 显示四个位置的信息 by sking
PlayLayer_paodekuaiXuzhou.prototype.setUserVisiblePaoDeKuai = function (node, off)
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
}


PlayLayer_paodekuaiXuzhou.prototype.initUserHandUIPaoDeKuai = function (node, off, needSort)
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

/**
 * 拼接游戏玩法及付费信息
 * @function
 * @return {String}
 */
PlayLayer_paodekuaiXuzhou.prototype.getGameInfoString = function(param)
{
    var tData = MjClient.data.sData.tData;
    var str = "";

    if (param != "roundInfo")
        str += MjClient.MaxPlayerNum == 3 ? "三人玩," : "两人玩,";
    str += tData.areaSelectMode.cardNumIndex == 0 ? "16张," : "15张,";
    str += tData.areaSelectMode.firstHeiTao3 ? "黑桃3先出," : "赢家先出,";
    str += tData.areaSelectMode.isXiaoGuan ? "小关X2," : "";
    str += tData.areaSelectMode.isDaGuan ? "大关X3," : "";
    str += tData.areaSelectMode.isDaGuanX2 ? "大关X2," : "";
    str += tData.areaSelectMode.can3daiNum == 1 ? "3带1," : "3带2,";
    str += tData.areaSelectMode.can4dai2 ? "4带2," : "";
    str += tData.areaSelectMode.can3aZhaDan ? "3个A算炸弹," : "";
    str += tData.areaSelectMode.can3ge3ZhaDan ? "3个3算炸弹," : "";
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
    
    str += tData.areaSelectMode.isZhaDanJiaFen ? "炸弹加分," : "";
    str += tData.areaSelectMode.mustPut ? "必管," : "非必管,";
    if (param != "roundInfo")
    {
        str += tData.areaSelectMode.fangZuoBi ? "防作弊," : "";
        str += tData.areaSelectMode.showCardNumber ? "显示牌数," : "";
    }
    if(tData.areaSelectMode.fanBei == 1)
    {
        str += "小于" + tData.areaSelectMode.fanBeiScore + "分翻倍,";
    } 

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