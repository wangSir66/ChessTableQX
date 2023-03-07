/**
 * Created by Administrator on 2017/3/9.
 */

var PlayLayer_paodekuaiHaian = PlayLayer_PDK.extend({
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
                            if(!tData.matchId) {
                                self.addChild(new GameOverLayer(), 500);
                            }else {
                                self.runAction(cc.sequence(cc.delayTime(3),cc.callFunc(function(){
                                    self.addChild(new GameOverLayer(),500);
                                })))
                            }
                        }
                        self.addChild(new EndOneView_paodekuaiHaian(),500);
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

                        // 海安跑得快去除牌面遮挡
                        
                        // var tData = MjClient.data.sData.tData;
                        // if (MjClient.playui.isShowHandCardBeiMain && (tData.curPlayer == getPlayerIndex(0) || tData.lastPutPlayer != -1)) {
                        //     MjClient.playui.isShowHandCardBeiMain = false;
                        //     MjClient.playui.hideHandCardBeiMian();
                        // }

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
                    }
                }
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
                        }
                    }
                },
            },
        };
    },
    ctor: function() {
        this._super(res.Play_PaoDeKuaiHaian_json);

        //初始化其他功能
        initSceneFunc(true, [[0.115, 0.115], [0.59,0.93], [0,0]], [[0.12, 0.12], [0.56,0.92], [0,0]]);
        // 在亲友圈房间中添加邀请亲友圈牌有一起对局
        addClubYaoqingBtn(1);

        return true;
    }
});

// add...................   Greene
//初始化桌子上的客户端数据c_data..各个游戏的自身数据可以在这里初始，
//尽量不要在外部公共代码判断游戏类型，而是在c_data里初始化数据。
//在PlayLayer的_event 的 initSceneData调用
PlayLayer_paodekuaiHaian.prototype.InitC_Data = function() {
    if (!MjClient.data.c_Data)
        MjClient.data.c_Data = {};
    cc.log("InitC_Data===========================")
    //出牌是否动画
    MjClient.data.c_Data.bPutCardAnim = true;
    //牌型动画是否是文字图片
    MjClient.data.c_Data.bTxtAnim = false;
    //非必管时，要不起时，是否给用户自动过牌
    MjClient.data.c_Data.bMustputIsAutoPass = false;
}

PlayLayer_paodekuaiHaian.prototype.initUserHandUIPaoDeKuai = function (node, off, needSort)
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
                // 海安跑得快去除牌面遮挡
                // MjClient.playui.isShowHandCardBeiMain = true;
                // MjClient.playui.showHandCardBeiMian();
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

PlayLayer_paodekuaiHaian.prototype.updateClockPosition = function(arrowNode)
{
    var tData = MjClient.data.sData.tData;
    var uids = tData.uids;
    var curPlayerIndex = (tData.curPlayer + MjClient.MaxPlayerNum - tData.uids.indexOf(SelfUid())) % MjClient.MaxPlayerNum;

    var curPlayerNode = null;
    var deskCardPosOffset = {
        x: 44,
        y:-34
    };
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
PlayLayer_paodekuaiHaian.prototype.getGameInfoString = function(param)
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
    str += tData.areaSelectMode.is15Thirty ? "15张牌30分," : "";
    str += tData.areaSelectMode.isZhaDanJiaFen ? "炸弹加分," : "";
    str += tData.areaSelectMode.canZhaDanDai1 ? "炸弹可带一张," : "";
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
