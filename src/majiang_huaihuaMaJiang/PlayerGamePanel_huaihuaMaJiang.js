/**
 * Created by Administrator on 2017/3/9.
 */
var actionZindex = 1000;
var isTouZi_huaihuaMJ = false;
//向服务器发送 过消息
MjClient.MJPass2NetForhuaihuaMaJiang = function()
{
   // console.log(">>>>>>>>>普通  过 <<<<<<<<");
    cc.log("====================send======pass=====");
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var pl = getUIPlayer(0);
    // if(pl.isZiMoHu) {
    //     return MjClient.showToast("自摸必须胡牌");
    // }

    var eat = MjClient.playui.jsBind.eat;
    // if(pl.mustHu){
    //     return MjClient.showToast("有胡必胡");
    // }
    var hasHu = false;

        // 过杠记录存储
    var roomMsgValue = tData.tableid +":"+tData.roundNum;
    var saveRoomMsgValueG = util.localStorageEncrypt.getStringItem("IGNORE_G_TIP","")

    if(IsTurnToMe() && tData.tState == TableState.waitPut)
    {
        var eat = MjClient.playui.jsBind.eat;
        var passCallBack = function(){
            //cc.log("==========1=============");
            if(eat.gang0._node.visible){
                util.localStorageEncrypt.setStringItem("IGNORE_G_TIP",roomMsgValue)
            }


            if(MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType() && eat.hu._node.visible){
                MjClient.showToast("你选择了过，暂时放弃胡牌");
            }
            eat.gang0._node.visible = false;
            eat.hu._node.visible = false;
            eat.guo._node.visible = false;
            eat.ting._node.visible = false;
            eat.cancel._node.visible = false;
            eat.touzi._node.visible = false;
            MJTingOrMJPassToServer_huaihuaMaJiang(hasHu);
        }  


        var msg = "确认过";
        if(eat.gang0._node.visible)
        {
            msg += " 杠 ";
        }

        if(eat.hu._node.visible)
        {
            msg += " 胡 ";
            hasHu = true;
        }else if(eat.gang0._node.visible){
            // 只有杠就不弹出确认框了
            if(roomMsgValue == saveRoomMsgValueG){
                passCallBack();
                return;
            } 
        }

        msg = msg + "吗?";
        MjClient.showMsg(msg, function()
        {
            //cc.log("==========1=============");
            passCallBack();
        }, function() {}, "1");
    }
    else
    {
        if(MjClient.playui.jsBind.eat.hu._node.visible)
        {
            
            MjClient.showMsg("确认不胡吗?", function() {
                if(MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType()){
                    MjClient.showToast("你选择了过，暂时放弃胡牌");
                }
                MJTingOrMJPassToServer_huaihuaMaJiang(true);
            }, function() {}, "1");
        }
        else
        {
            MJPassConfirmToServer();
        }
    }
}

function MJTingOrMJPassToServer_huaihuaMaJiang(hasHu){
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var eat = MjClient.playui.jsBind.eat;
    var isAfterTou = false;

    if(SelfUid() == tData.uids[tData.zhuang] && sData.players[tData.uids[tData.zhuang]].isTing){
        isAfterTou = true;
    }

    if(sData.players[tData.uids[tData.zhuang]].putCount == 0 && hasHu && !isAfterTou){
        MjClient.majiang.MJTingToServer(SelfUid(), false);
        eat.gang0._node.visible = false;
        eat.hu._node.visible = false;
        eat.guo._node.visible = false;
        eat.ting._node.visible = false;
        eat.cancel._node.visible = false;
        eat.touzi._node.visible = false;
    }else{
        MJPassConfirmToServer();
        if (hasHu) {
            MjClient.data.sData.players[SelfUid()].clickPass = true;
        }
    }
}

// 这个没看懂干嘛的
// off 是四个位置，根据off 显示四个位置的信息 by sking
function SetUserVisible_huaihuaMaJiang(node, off)
{
    //var sData = MjClient.data.sData;
    //return;
    cc.log("====================off======================" + off);
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
        score_bg.visible = true;
        MjClient.loadWxHead(pl.info.uid, pl.info.headimgurl);
        setUserOffline(node, off);
        InitUserHandUI_huaihuaMaJiang(node, off);
        //GLog("pl.info.uid = "+pl.info.uid);
    }
    else
    {
        name.visible = false;
        coin.visible = false;
        offline.visible = false;
        coin.visible = false;
        var WxHead = nobody.getChildByName("WxHead");
        if(WxHead)
        {
            WxHead.removeFromParent(true);
        }
    }
}

function InitUserHandUI_huaihuaMaJiang(node, off)
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
    //setPlayerRoundDir(off);
    // if(vnPos.indexOf(off) == -1)
    // {
    //     vnPos.push(off);
    // }

    if (tData.tState == TableState.waitJiazhu && SelfUid() == pl.info.uid) {
        if (pl.mjState == TableState.waitJiazhu) {
            var layer = new jiaZhuCS();
            MjClient.playui.addChild(layer, 99);
            if (MjClient.webViewLayer != null) {
                MjClient.webViewLayer.close();
            }
        } else {
            //弹窗等待其他玩家加注
            MjClient.playui._jiazhuWait.visible = true;
        }
    }

    if(
        tData.tState != TableState.waitPut &&
        tData.tState != TableState.waitEat &&
        tData.tState != TableState.waitCard
    )
    {
        return;
    }
    
    setHunNodeVisible(false);


    //添加碰
    for(var i = 0; i < pl.mjpeng.length; i++)
    {
        var idx = tData.uids.indexOf(pl.info.uid);
        var offIdx = (pl.pengchigang.peng[i].pos - idx + 4) % 4 - 1;//表示被碰的人和pl之间隔着几个人，如果是pl碰下家，则offIdx=0，pl碰上家，则offIdex=2

        for(var j = 0; j < 3; j++)
        {
            if( (j % 3 == 2 - offIdx && off % 3 == 0) || (j % 3 == offIdx && off % 3 != 0) )
            {
                var cdui = getNewCard(node, "up", "peng", pl.mjpeng[i], off, "heng", "heng");
                setCardArrow(cdui, offIdx, off);
            }
            else
            {
                getNewCard(node, "up", "peng", pl.mjpeng[i], off);
            }
        }
    }


    //添加明杠
    for(var i = 0; i < pl.mjgang0.length; i++)
    {
        var idx = tData.uids.indexOf(pl.info.uid);
        //var offIdx = 0;
        //if(i < pl.pengchigang.gang.length)
        //{
        //    offIdx = (pl.pengchigang.gang[i].pos - idx + 4) % 4 - 1;
        //}
        //else {
        //    offIdx = (pl.pengchigang.pgang[i-pl.pengchigang.gang.length].pos - idx + 4) % 4 - 1;
        //}
        var offIdx = null;
        for (var j=0; j<pl.pengchigang.gang.length; j++)
        {
            if (pl.pengchigang.gang[j].card == pl.mjgang0[i])
            {
                offIdx = (pl.pengchigang.gang[j].pos - idx + 4) % 4 - 1;
                break;
            }
        }
        if (offIdx == null)
        {
            for (var j=0; j<pl.pengchigang.pgang.length; j++)
            {
                if (pl.pengchigang.pgang[j].card == pl.mjgang0[i])
                {
                    offIdx = (pl.pengchigang.pgang[j].pos - idx + 4) % 4 - 1;
                    break;
                }
            }
        }
        if (offIdx == null)
        {
            cc.log("InitUserHandUI:offIdx == null!!!!");
            offIdx = 0;
        }

        for(var j = 0; j < 4; j++)
        {
            if(j == 3)
            {
                getNewCard(node, "up", "gang0", pl.mjgang0[i], off, "isgang4").tag = pl.mjgang0[i];//最后一张牌放上面
            }
            else
            {
                if( (j % 3 == 2 - offIdx && off % 3 == 0) || (j % 3 == offIdx && off % 3 != 0) )
                {
                    var cdui = getNewCard(node, "up", "gang0", pl.mjgang0[i], off, "heng", "heng");
                    setCardArrow(cdui, offIdx, off);
                }
                else
                {
                    getNewCard(node, "up", "gang0", pl.mjgang0[i], off);
                }
            }
        }
    }


    //添加暗杠
    for(var i = 0; i < pl.mjgang1.length; i++)
    {
        for(var j = 0; j < 4; j++)
        {
            if(j == 3)
            {
                getNewCard(node, "down", "gang1", 0, off, "isgang4").tag = pl.mjgang1[i];
            }
            else
            {
                getNewCard(node, "up", "gang1", pl.mjgang1[i], off);
            }
        }
    }

    //cc.log("pl.mjchi = " + pl.mjchi);
    var chiIdx = 0;
    for(var i = 0; i < pl.mjchi.length; i++)
    {
        if(i % 3==0)
        {
            chiIdx++;
        }

        if(pl.mjchiCard[chiIdx-1] == pl.mjchi[i])//吃的横牌表示吃的是哪张牌
        {
            var cdui = getNewCard(node, "up", "chi", pl.mjchi[i], off, "heng");
            setCardArrow(cdui, MjClient.MaxPlayerNum - 2, off);
        }
        else
        {
            getNewCard(node, "up", "chi", pl.mjchi[i], off);
        }
    }

    //添加打出的牌
    for(var i = 0; i < pl.mjput.length; i++)
    {
        var msg =
        {
            card: pl.mjput[i],
            uid: pl.info.uid
        };

        DealMJPut(node, msg, off, i);
    }

    //添加手牌
    if(MjClient.rePlayVideo == -1)//表示正常游戏
    {
        if(pl.mjhand && off == 0)
        {
            for(var i = 0; i < pl.mjhand.length; i++)
            {
                getNewCard(node, "stand", "mjhand", pl.mjhand[i], off);
            }
        }
        else if (pl.mjhand && pl.mjState == TableState.roundFinish) {
            COMMON_UI.showMjhandBeforeEndOnePlayer(off);
        }
        else
        {
            var CardCount = 0;
            if(tData.tState == TableState.waitPut && tData.uids[tData.curPlayer] == pl.info.uid)
            {
                CardCount = 14;
            }
            else
            {
                CardCount = 13;
            }

            var upCardCount = CardCount - ((pl.mjpeng.length + pl.mjgang0.length + pl.mjgang1.length) * 3 + pl.mjchi.length);
            for(var i = 0; i < upCardCount; i++)
            {
                getNewCard(node, "stand", "standPri");
            }
        }
    }
    else
    {
        /*
         播放录像
         */
        cc.log("_________________mjhand_replay_______________"+JSON.stringify(pl.mjhand));
        if (pl.mjhand)
        {
            if(off == 0)
            {
                for (var i = 0; i < pl.mjhand.length; i++) {
                    getNewCard(node, "stand", "mjhand", pl.mjhand[i], off);
                }
            }
            else
            {

                for (var i = 0; i < pl.mjhand.length && i < 13; i++) {
                    getNewCard(node, "up", "mjhand_replay", pl.mjhand[i], off);
                }
            }
        }

    }



    //添加手花
    if (pl.mjflower.length > 0)
    {
        MjClient.majiang.setFlowerImg(node, pl);
        ShowEatActionAnim(node,ActionType.FLOWER,off);
        //playEffect("lyg/nv/flower");
        playEffectInPlay("flower");
    }

    MjClient.playui.CardLayoutRestore(node, off);
}

function initFlower_huaihuaMaJiang() {
    initFlower(false, false);
}


var PlayLayer_huaihuaMaJiang = cc.Layer.extend({

    getJsBind: function(){
        var jsBind = {
                _event: {
                    mjhand: function() {
                        if(MjClient.endoneui != null)
                        {
                            cc.log("=======mjhand====endoneui====" + typeof (MjClient.endoneui) );
                            MjClient.endoneui.removeFromParent(true);
                            MjClient.endoneui = null;
                        }
        
                        for (var i = 0; i < MjClient.MaxPlayerNum; i ++) {
                            var off = getOffForPlayerNum(i);
                            MjClient.playui.NowRoundScore(getNode(off).getChildByName("head"), off, false);
                        }
        
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;
                        resetFlowerNum(this);
                        resetJiaZhuNum(this);
                        if (MjClient.rePlayVideo != -1)//回放，做下挻时，否则位置会有问题（岳阳的不会）
                            MjClient.playui.runAction(cc.sequence(cc.delayTime(0.3), cc.callFunc(function() {MjClient.playui.resetJiaZhuTip()})));
                        else
                            MjClient.playui.resetJiaZhuTip();
                        if (tData.roundNum != tData.roundAll) return;
                        var pls = sData.players;
                        var ip2pl = {};
                        for (var uid in pls) {
                            var pi = pls[uid];
                            var ip = pi.info.remoteIP;
                            if (ip) {
                                if (!ip2pl[ip]) ip2pl[ip] = [];
                                ip2pl[ip].push(unescape(pi.info.nickname));
                            }
                        }
                        var ipmsg = [];
                        for (var ip in ip2pl) {
                            var ips = ip2pl[ip];
                            if (ips.length > 1) {
                                ipmsg.push("玩家:" + ips.join("，") + "为同一IP地址。")
                            }
                        }
                        if (ipmsg.length > 0 && !tData.matchId) {
                            //if(cc.sys.OS_WINDOWS != cc.sys.os)
                            // {
                            //     AlertSameIP(ipmsg.join("\n"));
                            // }
                        }
                        mylog("ipmsg " + ipmsg.length);
        
                        //距离位置显示
                        // checkCanShowDistance();
        
                    },
                    MJChat : function(data){
                        if(data.type == 4){
                            //距离位置显示
                            // checkCanShowDistance();
                        }
                    },
                    addPlayer:function () {
                        tableStartHeadMoveAction_paohuzi(this);   //不涉及到头像移动动作
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
                        MjClient.playui.removeChildByName("jiaZhuCS");
        
                        mylog(JSON.stringify(msg));
                        if (msg.showEnd) this.addChild(new GameOverLayer(),500);
                        else
                            MjClient.Scene.addChild(new StopRoomView());
                    },
                    roundEnd: function() {
                        MjClient.playui.removeChildByName("jiaZhuCS");
        
                        var self = this;
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;
        
                        var that = this;
                        function showEndCards()
                        {
                            var sData = MjClient.data.sData;
                            var tData = sData.tData;
                            resetEatActionAnim();
                            if (sData.tData.roundNum <= 0)
                            {
                                if(!tData.matchId){
                                    var layer = new GameOverLayer();
                                    layer.setVisible(false);
                                    self.addChild(layer,500);
                                }else{
                                    self.runAction(cc.sequence(cc.delayTime(3),cc.callFunc(function(){
                                        var layer = new GameOverLayer();
                                        layer.setVisible(false);
                                        self.addChild(layer,500);
                                    })))
                                }
                            }
                            self.addChild(new EndOneView_huaihuaMaJiang(),500);
                        }
        
                        function delayExe()
                        {
                            if(MjClient.rePlayVideo == -1)//正常游戏才显示摊牌
                            {
                                //弹小结算之前显示其他人牌
                                that.runAction(cc.sequence(cc.delayTime(0.1),cc.callFunc(COMMON_UI.showMjhandBeforeEndOne),cc.delayTime(1.5),cc.callFunc(showEndCards)));
                            }
                            else
                            {
                                that.runAction(cc.sequence(cc.delayTime(0.2),cc.callFunc(showEndCards)));
                            }
                        }
                        //this.runAction(cc.sequence(cc.DelayTime(0.2),cc.callFunc(delayExe)));
        
        
                        var showCards = tData.mopai;
                        // for(var off = 0;off <4;off++)
                        // {
                        //     var pl = getUIPlayer(off);
                        //     if(pl &&  pl.mopai && pl.mopai.length > 0)
                        //     {
                        //         showCards = pl.mopai;
                        //         break;
                        //     }
                        // }
        
                       function addshowcardlayer()
                        {
                            if (showCards.length >= 1) {
                                MjClient.Scene.addChild(new HAHZ_showCardLayer(showCards, function() {
                                    showEndCards();
                                }));
                            } else {
                                showEndCards();
                            }
                        }   
        
                        var isQxsydtz = (MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType());
                        //如果没有
                        if(!showCards || cc.isUndefined(showCards) || showCards.length <= 0 )
                        {  
                            //胡牌牌型动画、（一炮多响时则等待所有人胡完）倒牌→0.5S→小结算
                            if(isQxsydtz){
                                self.runAction(cc.sequence(cc.delayTime(1.2),
                                    MjClient.rePlayVideo == -1?cc.callFunc(COMMON_UI.showMjhandBeforeEndOne):cc.delayTime(0),
                                    cc.delayTime(0.5),cc.callFunc(showEndCards))); 
                            }else{
                                this.runAction(cc.sequence(cc.DelayTime(0.2),cc.callFunc(delayExe))); 
                                return;
                            }
                            
                        }else if(isQxsydtz){
                            //胡牌牌型动画、（一炮多响时则等待所有人胡完）倒牌→0.5S→抓鸟→小结算
                            self.runAction(cc.sequence(cc.delayTime(1.2),
                                MjClient.rePlayVideo == -1?cc.callFunc(COMMON_UI.showMjhandBeforeEndOne):cc.delayTime(0),
                                cc.delayTime(0.5),
                                cc.callFunc(addshowcardlayer))); 
                        }
                        if(isQxsydtz) return;
        
                        MjClient.Scene.addChild(new HAHZ_showCardLayer(showCards,function(){
                            delayExe();
                        }));
        
                    },
                    moveHead: function() {
                        postEvent("returnPlayerLayer");
                        tableStartHeadMoveAction(this);
                        if (MjClient.playui._jiazhuWait)
                            MjClient.playui._jiazhuWait.visible = false;
                        //MjClient.playui._btnFlower.visible = true;
                        initFlower_huaihuaMaJiang();
                    },
                    initSceneData: function() {
                        reConectHeadLayout(this);
                        cc.log("initSceneData -----------------gunyun = " + JSON.stringify(this));
                        CheckRoomUiDelete();
        
                        tableStartHeadMoveAction_paohuzi(this);   //不涉及到头像移动动作
        
                        //距离位置显示
                        // checkCanShowDistance();
                    },
                    onlinePlayer: function() {
                        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType()){
                            var pl = getUIPlayer(0);
                            if(!pl) return;
                            if(pl.mjState != TableState.roundFinish) 
                                reConectHeadLayout(this);
                        }else{
                            reConectHeadLayout(this);
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
                    changeMJBgEvent: function() {
                        changeMJBg(this, getCurrentMJBgType());
                    }
                },
                roundnumImg: {
                    _run:function () {
                        //roundnumImgObj = this;
                        MjClient.roundnumImgNode = this;
                        setWgtLayout(this,[0.1, 0.1], [0.5, 0.5], [-1.2, 1.0]);
                    },
                    _event: {
                        initSceneData: function(eD) {
                            this.visible = IsArrowVisible();
                        },
                        mjhand: function(eD) {
                            this.visible = IsArrowVisible();
                        },
                        onlinePlayer: function(eD) {
                            //this.visible = IsArrowVisible();
                        }
                    },
                    roundnumAtlas: {
                        _run:function(){
                            this.ignoreContentAdaptWithSize(true);
                        },
                        _text: function() {
                            var sData = MjClient.data.sData;
                            var tData = sData.tData;
                            if (tData) return (tData.roundNum - 1);
                        },
                        _event: {
                            mjhand: function() {
                                var sData = MjClient.data.sData;
                                var tData = sData.tData;
                                if (tData) return this.setString(tData.roundNum - 1);
                            }
                        }
                    }
                },
                cardNumImg: {
                    _run:function () {
                        MjClient.cardNumImgNode = this;
                        setWgtLayout(this,[0.1, 0.1], [0.5, 0.5], [1.2, 1.0]);
                    },
                    _event: {
                        initSceneData: function(eD) {
                            this.visible = IsArrowVisible();
                        },
                        mjhand: function(eD) {
                            this.visible = IsArrowVisible();
                        },
                        onlinePlayer: function(eD) {
                            //this.visible = IsArrowVisible();
                        }
                    },
                    cardnumAtlas: {
                        _run:function(){
                            this.ignoreContentAdaptWithSize(true);
                        },
                        _text: function() {
                            var sData = MjClient.data.sData;
                            var tData = sData.tData;
                            if (tData) return MjClient.majiang.getAllCardsTotal(tData) - tData.cardNext;
                        },
                        _event: {
                            waitPut: function() {
                                var sData = MjClient.data.sData;
                                var tData = sData.tData;
                                if (tData) this.setString(MjClient.majiang.getAllCardsTotal(tData) - tData.cardNext);
                                cc.log(MjClient.majiang.getAllCardsTotal(tData) + "-----------------waitPut------------------" + tData.cardNext);
                            },
                            MJZhiTouZi: function() {
                                var sData = MjClient.data.sData;
                                var tData = sData.tData;
                                var that = this;
                                var callBack = cc.callFunc(function() {
                                    if (tData) that.setString(MjClient.majiang.getAllCardsTotal(tData) - tData.cardNext);
                                });
                                this.runAction(cc.sequence(cc.delayTime(2),callBack));
                            },
                        }
                    }
                },
                back: {
                    back: {
                        _run: function() {
                            changeGameBg(this, true);
                        },
                        _event: {
                            changeGameBgEvent: function() {
                                changeGameBg(this, true);
                            }
                        },
                        _layout: [
                            [1, 1],
                            [0.5, 0.5],
                            [0, 0], true
                        ],
                    },
                    LeftBottom:{
                        _layout: [
                            [0.1, 0.1],
                            [0.03, 0.045],
                            [0, 0]
                        ],
                    },
                    RightBottom:{
                        _layout: [
                            [0.1, 0.1],
                            [0.97,0.05],
                            [0, 0]
                        ],
                    },
                    RightTop:{
                        _layout: [
                            [0.1, 0.1],
                            [0.97,0.95],
                            [0, 0]
                        ],
                    },
                    leftTop:{
                        _layout: [
                            [0.1, 0.1],
                            [0.03,0.95],
                            [0,0]
                        ],
                        // _run:function()
                        // {
                        //     var text = new ccui.Text();
                        //     text.setFontName("fonts/fzcy.ttf");
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
                info:
                {
                    _layout: [
                        [0.16, 0.16],
                        [0.01, 0.935],
                        [0, 0]
                    ]
                },
                gameName:{
                    _layout: [
                        [0.16, 0.16],
                        [0.5, 0.62],
                        [0, 1.0]
                    ]
                },
                roundInfo:{
                    _layout: [
                        [0.1, 0.1],
                        [0.5, 0.38],
                        [0, 1.0]
                    ],
                    _run:function()
                    {
                        var tData = MjClient.data.sData.tData;
                        var str = "";
        
                        str += tData.areaSelectMode.huType == 1 ? "自摸胡" : "接炮胡"; 
                        str += tData.areaSelectMode.xiaohubudianpao ? ",小胡不可接炮" : "";
                        str += tData.areaSelectMode.sihongzhong     ? ",四红中" : ""; //四红中 选择为true否则为false
                        str += tData.areaSelectMode.tianhu          ? ",天胡"   : ""; //天胡   选择为true否则为false
                        str += tData.areaSelectMode.dihu            ? ",地胡"   : ""; //地胡   选择为true否则为false
                        str += tData.areaSelectMode.banbanhu        ? ",板板胡" : ""; //板板胡 选择为true否则为false
                        str += tData.areaSelectMode.yitiaolong      ? ",一条龙" : ""; //一条龙 选择为true否则为false
                        str += tData.areaSelectMode.longqidui       ? ",龙七对" : ""; //龙七对 选择为true否则为false
                        str += tData.areaSelectMode.siguiyi         ? ",四归一" : ""; //四归一 选择为true否则为false
                        str += tData.areaSelectMode.jiangjianghu    ? ",将将胡" : ""; //将将胡 选择为true否则为false
                        str += tData.areaSelectMode.queyise         ? ",缺一色" : ""; //缺一色 选择为true否则为false
                        switch (tData.areaSelectMode.zhuaniaotype)
                        {
                            case 0:
                                str += ",不抓鸟"
                                break;
                            case 1:
                                str += ",抓1鸟"
                                break;
                            case 2:
                                str += ",抓2鸟"
                                break;
                            case 3:
                                str += ",抓3鸟"
                                break;
                            default:
                                break;
                        }
                        str += tData.areaSelectMode.zhuaniaovalue   ? ",159抓鸟"  : "";  //159抓鸟 选中为true否则为false
                        str += tData.areaSelectMode.keganghu        ? tData.areaSelectMode.qiangGangQuanBao ? ",抢杠全包" : ",可抢杠胡" : "";  //可抢杠胡 选择为true否则为false
                        str += tData.areaSelectMode.qiShou14        ? ",起手胡14张" : "";  //起手胡14张     选择为true否则为false
                        str += tData.areaSelectMode.baogang         ? ",包杠"     : "";  //包杠     选择为true否则为false
                        str += tData.areaSelectMode.touhougang      ? ",骰后杠"   : "";  //骰后杠   选择为true否则为false
                        str += tData.areaSelectMode.huanggangzhuang ? ",荒庄荒杠" : "";  //荒庄荒杠 选择为true否则为false
                        
                        if(tData.areaSelectMode.jieSuanDiFen){
                            var difen = tData.areaSelectMode.jieSuanDiFen;
                            str += difen != 1 ? ",积分底分x" + difen : "";
                        }
                        str += tData.areaSelectMode.fanBei == 0 ? ",不翻倍" : ",低于" + tData.areaSelectMode.fanBeiScore + "分翻倍";
                        
                        this.ignoreContentAdaptWithSize(true);
                        var strPayWay = "";
                        // switch (tData.areaSelectMode.payWay)
                        // {
                        //     case 0:
                        //         strPayWay = ",房主付";
                        //         break;
                        //         strPayWay = ",AA付";
                        //         break;
                        //     case 2:
                        //         strPayWay = ",亲友圈付";
                        //         break;
                        // }
        
                        var str1 = strPayWay;
                        this.setString(str + str1);
        
                        //比赛场
                        var BSStr = "";
                        if(tData.matchId){
                            BSStr = ",10秒出牌";
                            this.setString(str + str1 + BSStr);
                        }
                    }
                },
                jiazhuWait: {
                    _visible: false,
                    _run: function() {
                        this.ignoreContentAdaptWithSize(true);
                    },
                    _layout: [
                        [0.2, 0.2],
                        [0.5, 0.7],
                        [0, 0]
                    ]
                },
                huWait: {
                    _visible: false,
                    _run: function() {
                        this.ignoreContentAdaptWithSize(true);
                    },
                    _layout: [
                        [0.3, 0.3],
                        [0.5, 0.37],
                        [0, 0]
                    ],
                    _event: {
                        MJCanBaoTing: function(){
                            cc.log("------------HHHHH: MJCanBaoTing-----------");
                            MjClient.playui.EatVisibleCheck();
                            var sData = MjClient.data.sData;
                            var tData = sData.tData;
                            if(SelfUid() != tData.uids[tData.zhuang]){
                                return ;
                            }
        
                            for (var uid in sData.players) {
                                if(SelfUid() == uid) continue;
                                var pl = sData.players[uid];
                                if (pl.tingStatus == 2) {
                                    this.visible = true;
                                    break ;
                                }
                            }
                        },
                        MJBaoTing: function(){
                            var sData = MjClient.data.sData;
                            var tData = sData.tData;
                            if(SelfUid() != tData.uids[tData.zhuang]){
                                return ;
                            }
        
                            if(tData.canBaotingNum == 0){
                                this.visible = false;
                            }
                        },
                        initSceneData: function(){
                            this.visible = false;
                            var sData = MjClient.data.sData;
                            var tData = sData.tData;
                            if(SelfUid() != tData.uids[tData.zhuang]){
                                return ;
                            }
                            if(tData.tState == TableState.waitPut && tData.canBaotingNum != 0){
                                this.visible = true;
                            }
                        },
                        clearCardUI: function(eD) {
                            this.visible = false;
                        },
                        MJHu: function(eD) {
                            this.visible = false;
                        },
                        MJGang: function(eD) {
                            var sData = MjClient.data.sData;
                            var tData = sData.tData;
                            if(tData.canBaotingNum == 0){
                                this.visible = false;
                            }
                        },
                        roundEnd: function(){
                            this.visible = false;
                        }
                    }
                },
                banner: {
                    _layout: [
                        [0.5, 0.5],
                        [0.5, 1],
                        [0, 0]
                    ],
                    bg_time:{
                         _run:function()
                        {
                            var text = new ccui.Text();
                            text.setFontName("fonts/fzcy.ttf");
                            text.setFontSize(26);
                            
                            text.setAnchorPoint(1,0.5);
                            text.setPosition(66, 15);
                            this.addChild(text);
                            text.schedule(function(){
                                
                                var time = MjClient.getCurrentTime();
                                var str = (time[3]<10?"0"+time[3]:time[3])+":"+
                                    (time[4]<10?"0"+time[4]:time[4]);
                                this.setString(str);
                            });
                        }
        
                    },
                    wifi: {
                        _run: function() {
                            updateWifiState(this);
                        }
                    },
                    powerBar: {
                        _run: function() {
                            cc.log("powerBar_run");
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
                    setting: {
                        _click: function() {
                            var settingLayer = new RoomMaJiangSetting();
                            settingLayer.setName("PlayLayerClick");
                            MjClient.Scene.addChild(settingLayer);
                            MjClient.native.umengEvent4CountWithProperty("Fangjiannei_shezhi", {uid:SelfUid(),gameType:MjClient.gameType});
                        }
                    },
                    Button_1: {
                        _visible : true,
                        _click: function() {
                            MjClient.openWeb({url:MjClient.GAME_TYPE.HA_HONGZHONG,help:true});
                        }
                    },
                    // back_btn: {
                    //     _visible : true,
                    //     _click: function() {
                    //         MjClient.showMsg("是否解散房间？", function () {
                    //             MjClient.delRoom(true);
                    //         }, function(){}, "1");
                    //     }
                    // },
                    hunPai:{
                        _visible: false,
                        baidaBg:{
                            small:{
                                _run:function() {
                                    this.runAction(cc.sequence(cc.fadeOut(1), cc.fadeIn(0.5)).repeatForever());
                                },
                                _event:{
                                    mjhand:function()
                                    {
                                        this.visible = true;
                                    }
                                }
                            },
                            _run:function()
                            {
                                //baidaBg = this;
                                this.setVisible(true);
                            },
                            _event: {
                                mjhand:function()
                                {
                                    this.visible = true;
                                },
                                roundEnd:function (eD) {
                                    // this.visible = false;
                                }
                            },
                        },
                        baidaImg: {
                            _run:function()
                            {
                                this.setVisible(false);
                            },
                            _event: {
                                mjhand:function()
                                {
                                    this.visible = true;
                                    var HuncardMsg = MjClient.data.sData.tData.hunCard;
                                    if(HuncardMsg != 0){
                                        setCardSprite(this, parseInt(HuncardMsg), 4);
                                        this.runAction(cc.sequence(cc.delayTime(1),
                                            cc.spawn(cc.scaleTo(0.6,0.5))));
                                    }
                                },
                                initSceneData:function()
                                {
                                    this.visible = true;
                                    var HuncardMsg = MjClient.data.sData.tData.hunCard;
                                    if(HuncardMsg != 0)
                                    {
                                        setCardSprite(this, parseInt(HuncardMsg), 4);
                                    }
                                },
                                roundEnd:function (eD) {
                                    // this.visible = false;
                                }
                            },
                        },
                        baidaText: {
                            _run:function()
                            {
                                //baidaOject = this;
                                this.setVisible(true);
                            },
                            _event: {
                                mjhand:function(){
                                    this.visible = true;
                                },
                                roundEnd:function (eD) {
                                    this.visible = false;
                                }
                            },
                        },
                        _event:{
                            clearCardUI: function(eD) {
                                this.visible = false;
                            },
                            mjhand:function()
                            {
                                this.visible = MjClient.playui.isShowHunCard();
                            },
                            initSceneData:function()
                            {
                                this.visible = MjClient.playui.isShowHunCard() && IsArrowVisible();
                            }
                        }
                    },
                },
                // arrowbk: {
                //     _layout: [
                //         [0.2, 0.2],
                //         [0.5, 0.5],
                //         [0, 0.25]
                //     ],
                //     _run:function () {
                //         MjClient.arrowbkNode = this;
                //         setDirVisible(this, true);
                //         setArrowFengDir(this);
                //         // windObj["dong"] = this.getChildByName("dir_right");
                //         // windObj["nan"] = this.getChildByName("dir_down");
                //         // windObj["xi"] = this.getChildByName("dir_left");
                //         // windObj["bei"] = this.getChildByName("dir_up");
                //         // windPos["dong"] = windObj["dong"].getPosition();
                //         // windPos["nan"]   = windObj["nan"].getPosition();
                //         // windPos["xi"]   =  windObj["xi"].getPosition();
                //         // windPos["bei"]  = windObj["bei"].getPosition();
                //     },
                //     _event: {
                //         initSceneData: function(eD) {
                //             this.visible = IsArrowVisible();
                //             SetArrowRotation(this)
                //         },
                //         mjhand: function(eD) {
                //             this.visible = IsArrowVisible();
                //             SetArrowRotation(this);
                //         },
                //         onlinePlayer: function(eD) {
                //             //this.visible = IsArrowVisible();
                //         },
                //         waitPut: function() {
                //             SetArrowRotation(this)
                //         },
                //         MJPeng: function(eD) {
                //             SetArrowRotation(this)
                //         },
                //         MJChi: function(eD) {
                //             SetArrowRotation(this)
                //         },
                //         MJGang: function(eD) {
                //             SetArrowRotation(this)
                //         },
                //         MJFlower: function(eD) {
                //             SetArrowRotation(this)
                //         },
                //
                //     },
                //     number: {
                //         _run: function() {
                //             this.setString("00");
                //             //arrowbkNumberUpdate(this);
                //             this.ignoreContentAdaptWithSize(true);
                //         },
                //         _event: {
                //             MJPeng: function() {
                //                 this.stopAllActions();
                //                 stopEffect(playTimeUpEff);
                //                 playTimeUpEff = null;
                //                 arrowbkNumberUpdate(this);
                //             },
                //             MJChi: function() {
                //                 this.stopAllActions();
                //                 stopEffect(playTimeUpEff);
                //                 playTimeUpEff = null;
                //                 arrowbkNumberUpdate(this);
                //             },
                //             waitPut: function() {
                //                 this.stopAllActions();
                //                 stopEffect(playTimeUpEff);
                //                 playTimeUpEff = null;
                //                 var eat = MjClient.playui.jsBind.eat;
                //                 var endFunc = null;
                //                 if (IsTurnToMe()
                //                     && !eat.ting._node.visible
                //                     && !eat.hu._node.visible
                //                     && !eat.peng._node.visible
                //                     && !eat.chi0._node.visible
                //                     && !eat.gang0._node.visible
                //                     && !eat.gang1._node.visible
                //                     && !eat.gang2._node.visible) {
                //                     endFunc = MjClient.playui.jsBind.BtnPutCard._click;
                //                 }
                //                 arrowbkNumberUpdate(this, endFunc);
                //             },
                //             MJPut: function(msg) {
                //                 if (msg.uid == SelfUid()) {
                //                     this.stopAllActions();
                //                     stopEffect(playTimeUpEff);
                //                     playTimeUpEff = null;
                //                     //arrowbkNumberUpdate(this);
                //                     this.setString("00");
                //                 }
                //             },
                //             roundEnd: function() {
                //                 this.stopAllActions();
                //                 stopEffect(playTimeUpEff);
                //                 playTimeUpEff = null;
                //             },
                //             LeaveGame: function() {
                //                 this.stopAllActions();
                //                 stopEffect(playTimeUpEff);
                //                 playTimeUpEff = null;
                //             }
                //         }
                //     },
                // },
                touziNode:{
                    _run:function(){
                        this.visible = false;
                        this.setScale(0.5);
                        this.setPosition(cc.p(MjClient.size.width *0.5, MjClient.size.height *0.4));  
                        cc.spriteFrameCache.addSpriteFrames("playing/other/shaizi.plist","playing/other/shaizi.png");
                    },
                    _event:{
                        MJZhiTouZi:function(data){
                            cc.log("MJZhiTouZi 掷骰子啰~~~:");
                            var touzi1 = this.getChildByName("touzi_1");
                            var touzi2 = this.getChildByName("touzi_2");
                            touzi2.setScale(this.getScale());
                            var touzi3 = this.getChildByName("touzi_3");
                            touzi3.setScale(this.getScale());
                            this.visible = true;
                            touzi1.visible = false;
                            touzi2.visible = false;
                            touzi3.visible = false;
                            var addnewcard = data.addnewcard;
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
                            var callFunc2 = cc.callFunc(function(){
                                postEvent("showCardsOfKaiGang", addnewcard);
                            });
        
                            firstFrame.runAction(cc.sequence(animate,callFunc,delayAction,callFunc1,callFunc2,cc.removeSelf()));
                        }
                    }
                },
                wait: {
                    wxinvite: {
                        _layout: [
                            [0.2, 0.2],
                            [0.5, 0.56],
                            [0, 0]
                        ],
                        _click: function() {
                            // var tData = MjClient.data.sData.tData;
                            // var str1 = ""
                            // var str2 = "";
                            // var str = "";
        
                            // switch (tData.areaSelectMode.zhuaniao)
                            // {
                            //     case 0:
                            //         str += "不抓鸟"
                            //         break;
                            //     case 1:
                            //         str += "一鸟全中,"
                            //         break;
                            //     case 2:
                            //         str += "2鸟,"
                            //         break;
                            //     case 4:
                            //         str += "4鸟,"
                            //         break;
                            //     case 6:
                            //         str += "6鸟,"
                            //         break;
                            //     default:
                            //         break;
                            // }
                            // str += tData.areaSelectMode.zhuangxianfen ? "庄闲分,":"";
                            // str += tData.areaSelectMode.dianpao ? "点炮胡,":"";
                            // str += tData.areaSelectMode.qianggang ? "抢杠胡,":"";
                            // str += tData.areaSelectMode.qianggangquanbao ? "抢杠全包,":"";
                            // str += tData.areaSelectMode.hongzhong8 ? "8红中,":"";
                            // str += tData.areaSelectMode.qidui ? "七对可胡,":"";
                            // str += tData.areaSelectMode.youhongzhongbujiepao ? "有红中不接炮,":"";
                            // str += tData.areaSelectMode.wuhongzhongjiabei ? "无红中加倍,":"";
        
                            // var strPayWay = "";
                            // switch (tData.areaSelectMode.payWay)
                            // {
                            //     case 0:
                            //         strPayWay = "房主付,";
                            //         break;
                            //     case 1:
                            //         strPayWay = "AA付,";
                            //         break;
                            //     case 2:
                            //         strPayWay = "亲友圈付,";
                            //         break;
                            // }
        
                            // var str5 = strPayWay;
                            // var str6 = tData.roundNum + "局," + "速度加入【"+AppCnName[MjClient.getAppType()]+"】";
                            // var txt_club = tData.clubId ? "亲友圈("+tData.clubId + ")" : "";
                            // GLog(str1 + str2 + str + str5 + str6 + txt_club);
                            // MjClient.native.wxShareUrl(MjClient.remoteCfg.entreRoomUrl+"?vipTable="+tData.tableid, GameCnName[MjClient.gameType] + "  " + tData.tableid + "  三缺一  点击加入>>>" + txt_club,
                            //     str1+str2+str+str5+str6);
                            getPlayingRoomInfo(2);
                        },
                        _visible:function(){
                            return !MjClient.remoteCfg.guestLogin;
                        }
                    },
                    delroom: {
                        _run:function(){
                            if (MjClient.remoteCfg.guestLogin){
                                setWgtLayout(this, [0.11, 0.11],[0.05, 0.5],[0, 0]);
                            }else{
                                setWgtLayout(this, [0.11, 0.11],[0.05, 0.5],[0, 0]);
                            }
                        },
                        _click: function() {
                            MjClient.delRoom(true);
                        }
                    },
                    backHomebtn: {
                        _run:function(){
                            if (MjClient.remoteCfg.guestLogin){
                                setWgtLayout(this, [0.11, 0.11],[0.05, 0.65],[0, 0]);
                            }else{
                                setWgtLayout(this, [0.11, 0.11],[0.05, 0.65],[0, 0]);
                            }
                        },
                        _click: function(btn) {
                            var sData = MjClient.data.sData;
                            if (sData) {
                                if (IsRoomCreator()) {
        
                                    if(!isAgent()){
                                        //如果不是代理直接解散房间
                                        MjClient.delRoom(true);
                                        return;
                                    }
                                    
                                    MjClient.showMsg("返回大厅房间仍然保留\n赶快去邀请好友吧",
                                        function() {
                                            MjClient.leaveGame();
                                            if (!MjClient.enterui && !getClubInfoInTable())
                                                MjClient.Scene.addChild(new EnterRoomLayer());
                                        },
                                        function() {});
                                } else {
                                    MjClient.showMsg("确定要退出房间吗？",
                                        function() {
                                            MjClient.leaveGame();
                                            if (!MjClient.enterui && !getClubInfoInTable())
                                                MjClient.Scene.addChild(new EnterRoomLayer());
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
                                this.visible = IsInviteVisible();
                            },
                            addPlayer: function(eD) {
                                this.visible = IsInviteVisible();
                            },
                            removePlayer: function(eD) {
                                this.visible = IsInviteVisible();
                            }
                        }
                    },
                    waitFriends:{
                        _layout: [[0.06, 0.06],[0.5, 0.36],[0, 0]],
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
                BtnPutCard:{ //add by  sking for put card button
                    _run: function () {
        
                        var tData = MjClient.data.sData.tData;
                        cc.log("BtnPutCard _run set put card btn state = " + tData.tState );
        
                        if(!IsTurnToMe() || tData.tState != TableState.waitPut)
                        {
                            // cc.log(" it's not my turn------------------sking");
                            this.visible = false;
                        }
                        else
                        {
                            // cc.log(" it's my turn------------------sking");
                            this.visible = true;
                        }
        
                        setWgtLayout(this,[0.18, 0.18], [0.82, 0.3], [0.7, -0.1]);
                    },
                    _click: function(btn) {
                        cc.log("点击出牌");
                        //var sData = MjClient.data.sData;
                        //cc.log("sData.tState == " + sData.tState);
                        var downNode = MjClient.playui._downNode;
                        var standUI = downNode.getChildByName("stand");
                        var children = downNode.children;
                        for(var i = 0; i < children.length; i++)
                        {
                            if(children[i].name == "mjhand")
                            {
                                if(children[i].y > standUI.y + 10)
                                {
                                    PutOutCard(children[i], children[i].tag); //可以出牌
                                    break;
                                }
                            }
                        }
                        this.visible = false;
                    },
                    _event:{
                        //拿到一张牌的时候，出牌按钮亮起，其他状态隐藏，by sking
                        mjhand: function() {
                            this.visible = false;
                            cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>initSceneData");
                        },
                        MJHu:function(){
                            this.visible = false;
                            cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>mjhand");
                        },
                        newCard: function(eD)
                        {
                            cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>newCard by sking");
                            this.visible = true;
                            //setWgtLayout(this, [0.1, 0.1],[0.7, 0.2],[0, 0]);
                        },
                        MJPut: function(eD) {
                            cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>MJPut by sking");
                            this.visible = false;
                        },
                        MJChi: function(eD) {
                            cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>MJChi by sking");
                            if(IsTurnToMe())
                            {
                                this.visible = true;
                            }
                        },
                        MJGang: function(eD) {
                            cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>MJGang by sking");
                            var pl = getUIPlayer(0);
                            var rtn = MjClient.majiang.canGang1(pl.mjpeng, pl.mjhand, pl.putCount);
                            if(IsTurnToMe() && rtn.length > 0)
                            {
                                this.visible = true;
                            }else{
                                this.visible = false;
                            }
        
                        },
                        MJPeng: function(eD) {
                            cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>MJPeng by sking");
                            if(IsTurnToMe())
                            {
                                //cc.log("    ----------------------peng  btn show----");
                                this.visible = true;
                            }
                        },
                        MJTing: function (eD) {
                            if(MjClient.playui.isCanPutCard())
                            {
                                this.visible = true;
                                cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>MJTing by sking - hide");
                            }else{
                                this.visible = false;
                            }
                        },
                        waitPut: function() {
                            var pl = getUIPlayer(0);
                            var eat = MjClient.playui.jsBind.eat;
                            if (IsTurnToMe() && pl.isTing && !eat.hu._node.visible && !eat.gang0._node.visible && !eat.gang1._node.visible && !eat.gang2._node.visible && !eat.touzi._node.visible) {
                                cc.log("*********自动出牌*********");
                                this.runAction(cc.sequence(cc.delayTime(0.8), 
                                    cc.callFunc(MjClient.playui.jsBind.BtnPutCard._click)));
                            }else{
                                if(MjClient.playui.isCanPutCard())
                                {
                                    if(eat.hu._node.visible)
                                    {
                                        this.visible = false;
                                        cc.log("--------------------有胡按钮拉--------------");
                                    }
                                    else
                                    {
                                        this.visible = true;
                                    }
                                }
                            }
                        },
                        MJPass: function(){
                            var pl = getUIPlayer(0);
                            var eat = MjClient.playui.jsBind.eat; 
                            if(IsTurnToMe() && pl.isTing && pl.touziCount > 0){
                                cc.log("*********自动出牌*********");
                                this.runAction(cc.sequence(cc.delayTime(0.8), 
                                    cc.callFunc(MjClient.playui.jsBind.BtnPutCard._click)));
                            }                   
                        }
                    }
                },//end of add by sking
                down: {
                    head: {
                        TG_CountDown:{//托管倒计时
                            _run:function () {
                                this.visible = false;
                                this.ignoreContentAdaptWithSize(true);
                            },
                            _event:{
                                trustTip:function (msg) {
                                    if(getUIPlayer(0)&&getUIPlayer(0).info.uid == msg.uid){
                                        this.visible = true;
                                        this.setString(msg.tipCountDown);
                                        var tipCountDown = msg.tipCountDown;
                                        var self = this;
                                        this.schedule(function () {
                                            self.setString(tipCountDown);
                                            if (tipCountDown > 0) {
                                                tipCountDown--;
                                            }else {
                                                self.setVisible(false);
                                                self.unscheduleAllCallbacks();
                                            }
                                        }, 1, cc.REPEAT_FOREVER, 0);
                                    }
                                },
                                MJPut:function (msg) {
                                    this.visible = false;
                                },
                                MJHu:function (msg) {
                                    this.visible = false;
                                }
                            }
                        },
                        tuoguan: {
                            _run:function () {
                                this.visible = false;
                            },
                            _event:{
                                beTrust:function (msg) {
                                    if(getUIPlayer(0)&&getUIPlayer(0).info.uid == msg.uid){
                                        this.visible = true;
                                    }
                                },
                                cancelTrust:function (msg) {
                                    if(getUIPlayer(0)&&getUIPlayer(0).info.uid == msg.uid){
                                        this.visible = false;
                                    }
                                },
                                initSceneData:function (msg) {
                                    var pl = getUIPlayer(0);
                                    if(pl&&pl.trust){
                                        this.visible = true;
                                    }else {
                                        this.visible = false;
                                    }
                                }
                            }
                        },
                        zhuang: {
                            _run: function() {
                                this.visible = false;
                            },
                            _event: {
                                waitPut: function() {
                                    showUserZhuangLogo(this, 0);
                                },
                                initSceneData: function() {
                                    if (IsArrowVisible()) showUserZhuangLogo(this, 0);
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
                                        cc.log("show user Chat MJCHAT" );
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
                            },
                            showTableEvent: function(isShow){ 
                                MjClient.playui.NowRoundScore(this,0,isShow);
                            }
                        },
                        _run: function () {
                            // this.zIndex = 600;
                            showFangzhuTagIcon(this,0);
                        },
                        score_bg:{_visible:false},
                        name_bg:{_visible:false},
                        flower_layout: {_visible:false},
                        flower_zfb_layout : {_visible:false},
                        tingCard: {_visible:false},
                        //     _visible:false,
                        //     _event: {
                        //         MJTing: function (eD) {
                        //             if(eD.uid == SelfUid())
                        //             {
                        //                 var pl = getUIPlayer(0);
                        //                 pl.putCardAfterTing = eD.putCardAfterTing;
                        //                 MjClient.playui.setTingCardInfo(this,eD,0);
                        //             }
                        //         },
                        //         clearCardUI: function(eD) {
                        //             cc.log("ready to----- clear sking ----");
                        //             this.visible = false;
                        //         },
                        //         MJHu: function(eD) {
                        //             this.visible = false;
                        //         },
                        //         onlinePlayer: function(eD) {
                        //             //MjClient.playui.setTingCardInfo(this,eD,0);
                        //         },
                        //         initSceneData:function(eD)
                        //         {
                        //             MjClient.playui.setTingCardInfo(this,eD,0);
                        //         }
                        //     }
                        // },
                        tingIcon: {_visible:false},
                        //     _visible:false,
                        //     _run:function(){
                        //         this.visible = false;
                        //         this.runAction(cc.sequence(cc.spawn(cc.tintTo(0.6, 255,0,0),cc.scaleTo(0.6,this.getScale() + 0.3)),
                        //             cc.spawn(cc.tintTo(0.6, 255,255,255),cc.scaleTo(0.6,this.getScale()))).repeatForever());
                        //     },
                        //     _event: {
                        //         clearCardUI: function(eD) {
                        //             this.visible = false;
                        //         },
                        //         MJHu: function(eD) {
                        //             this.visible = false;
                        //         },
                        //         moveHead: function() {
                        //             MjClient.playui.tingIconVisible(this, 0);
                        //         },
                        //         onlinePlayer: function(eD) {
                        //             //MjClient.playui.tingIconVisible(this,0);
                        //         },
                        //         initSceneData:function(eD)
                        //         {
                        //             MjClient.playui.tingIconVisible(this,0);
                        //         },
                        //         roundEnd: function(){
                        //             // cc.log("end rounde------------------------");
                        //             this.visible = false;
                        //         }
                        //     }
                        // },
                        huaCount: {
                            _run:function(){
                                changeAtalsForLabel(this,0);
                            },
                            _event:
                            {
                                clearCardUI: function(eD) {
                                    changeAtalsForLabel(this,0);
                                }
                            }
                        },//end of by sking
                        skipHuIconTag: {
                            _visible:false,
                            _event: {
                                clearCardUI: function(eD) {
                                    this.visible = false;
                                },
                                MJHu: function(eD) {
                                    this.visible = false;
                                },
                                initSceneData:function(eD)
                                {
                                    var pl = getUIPlayer(0);
                                    if (pl.skipHu) {
                                        //var _skipHuIconNode =  MjClient.playui._downNode.getChildByName("head").getChildByName("skipHuIconTag");
                                        this.visible = true;
                                    }
                                }
                            }
                        },
                        skipPengIconTag: {
                            _visible:false,
                            _event: {
                                clearCardUI: function(eD) {
                                    this.visible = false;
                                },
                                MJpeng: function(eD) {
                                    this.visible = false;
                                },
                                initSceneData:function(eD)
                                {
                                    var pl = getUIPlayer(0);
                                    if (pl.skipPeng.length > 0) {
                                        //var _skipHuIconNode =  MjClient.playui._downNode.getChildByName("head").getChildByName("skipHuIconTag");
                                        this.visible = true;
                                    }else{
                                        this.visible = false;
                                    }
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
                    },
                    play_tips: {
                        _layout: [[0.08, 0.14], [0.5, 0.25], [0, 0.5]],
                        _run: function () {
                            this.zIndex = actionZindex;
                        },
                        _visible:false,
                    },
                    tai_layout:{
                        _layout: [
                            [0.018, 0.018],
                            [0, 0],
                            [0, 0.2]
                        ],
                        tai_info:{
                            _visible:true,
                            _run: function () {
                                this.setString("");
                            }
                        },
                    },
                    ready: {
                        _layout: [
                            [0.07, 0.07],
                            [0.5, 0.5],
                            [0, -1.5]
                        ],
                        _run: function() {
                            GetReadyVisible(this, 0);
                        },
                        _event: {
                            initSceneData: function(){
                                GetReadyVisible(this, 0);
                            },
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
                        _layout: [
                            [0.057, 0],
                            [0.5, 0],
                            [8, 0.68]
                        ],
                        _visible: false,
                        _run: function () {
                            // this.zIndex = 500;
                        },
                    },
                    up: {
                        _layout: [
                            [0.05, 0],
                            [0, 0],
                            [0.8, 0.7]
                        ],
                        _visible: false
                    },
                    down: {
                        _layout: [
                            [0.05, 0],
                            [0, 0],
                            [3.5, 1]
                        ],
                        _visible: false
                    },
                    out1: {
                        _run: function () {
                            if (MjClient.size.width / MjClient.size.height >= 1.5)
                            {
                                
                                setWgtLayout(this, [0.0, 0.0763], [0.53, 0], [-7, 4.9]);
                            }
                            else
                            {   
                                
                                setWgtLayout(this, [0.0, 0.07], [0.53, 0], [-7, 4.9]);
                            }
                            if(MjClient.MaxPlayerNum === 2)
                            {
                                this.x -= this.height * this.scale * 3.5;
                            }
        
                        },
                        _visible: false
                    },
                    out0: {
                        _run: function () {
                            if (MjClient.size.width / MjClient.size.height >= 1.5)
                            {
                                setWgtLayout(this, [0.0, 0.0763], [0.53, 0], [-7, 3.9]);
                            }
                            else
                            {
                                setWgtLayout(this, [0.0, 0.07], [0.53, 0], [-7, 3.9]);
                            }
                            if(MjClient.MaxPlayerNum === 2)
                            {
                                this.x -= this.height * this.scale * 3.5;
                            }
        
                        },
        
                        _visible: false
                    },
                    outBig: {
                        _layout: [
                            [0.0836, 0],
                            [0.5, 0.32],
                            [0, 0]
                        ],
                        _visible: false
                    },
                    tingCardsNode: {
                        _layout: [[0.25, 0.12], [0.2, 0.25], [0, -0.3]],
                        _visible: false,
                        _event: {
                            clearCardUI: function(eD) {
                                this.visible = false;
                            },
                            MJHu: function(eD) {
                                this.visible = false;
                            },
                            initSceneData:function(eD)
                            {
                                MjClient.playui.tingIconVisible(this,0);
                            }
                        }
                    },
                    tingCardNumNode: {
                        _layout: [[0.25, 0.12], [0.12, 0.25], [0,-0.2]],
                        _visible: false,
                        _event: {
                            clearCardUI: function(eD) {
                                this.visible = false;
                            },
                            MJHu: function(eD) {
                                this.visible = false;
                            },
                            MJPut: function(eD) {
                                this.visible = false;
                            },
                            MJChat : function(eD) {
                                var pl = getUIPlayer(0);
                                if(pl && (pl.mjState == TableState.isReady || pl.mjState == TableState.roundFinish)){
                                    this.visible = false;
                                }
                            },
                        }
                    },
                    _event: {
                        clearCardUI: function() {
                            clearCardUI(this, 0);
                        },
                        initSceneData: function(eD) {
                            SetUserVisible_huaihuaMaJiang(this, 0);
                            MjClient.playui.ShowAllTingTips();
                            var tingSetNode = this.getChildByName("tingCardNumNode");
                            var pl = getUIPlayer(0);
                            if(pl.mjState == TableState.waitEat || pl.mjState == TableState.waitPut && MjClient.data.sData.tData.curPlayer != getPlayerIndex(0) ||
                                pl.mjState == TableState.waitCard)
                            {
                                var tingSetNode = this.getChildByName("tingCardNumNode");
                                if(tingSetNode && !tingSetNode.visible){
                                    
                                    var _tingCards = this.getChildByName("tingCardsNode");
                                    var tingSet = MjClient.majiang.calTingSet(pl.mjhand, MjClient.data.sData.tData.hunCard);
                                    setTingCards(_tingCards, tingSet);                        
                                }
                            }
                        },
                        addPlayer: function(eD) {
                            SetUserVisible_huaihuaMaJiang(this, 0);
                        },
                        removePlayer: function(eD) {
                            SetUserVisible_huaihuaMaJiang(this, 0);
                        },
                        mjhand: function(eD) {
        
                            if(MjClient.rePlayVideo != -1 || (MjClient.getAppType() != MjClient.APP_TYPE.HUNANWANGWANG && MjClient.APP_TYPE.QXSYDTZ != MjClient.getAppType()) || COMMON_UI3D.is3DUI())//回放的时候不用斗牌
                            {
                                InitUserHandUI_huaihuaMaJiang(this, 0);
                            }
                            else
                            {
                                COMMON_UI.playMjhandAni();
                            }
                        },
                        showTableEvent: function(isShow){ 
                            InitUserHandUI_huaihuaMaJiang(this, 0);
                        },
                        roundEnd: function() {
                            InitUserCoinAndName(this, 0);
                            //setTaiInfo("");
                        },
                        newCard: function(eD) {
                            // cdsNums++;
                            console.log("客户端发牌组合......eD= "+JSON.stringify(eD));
                            //cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>newCard---------------");
                            var _tingCards = this.getChildByName("tingCardsNode");
                            _tingCards.visible = false;
                            //MjClient.playui._btnPutCard.visible = true;
                            if (typeof(eD) == "number") {
                                eD = {newCard: eD};
                            }
                            DealNewCard(this,eD.newCard,0,eD.isFistCard);
                            if(!eD.isFistCard)
                            {
                                MjClient.playui.CardLayoutRestore(getNode(0), 0, true);
                            }
        
                            hideTingBtn();
                            MjClient.playui.ShowAllTingTips();
                        },
                        MJPut: function(eD) {
                            cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>MJPut---------------");
                            DealMJPut(this,eD,0);
                            var pl = getUIPlayer(0);
                            if (eD.uid == SelfUid())
                            {
                                var _tingCards = this.getChildByName("tingCardsNode");
                                var tingSet = MjClient.majiang.calTingSet(pl.mjhand, MjClient.data.sData.tData.hunCard);
                                setTingCards(_tingCards,tingSet);
                            }
                        },
                        MJChi: function(eD) {
                            DealMJChi(this, eD, 0);
                            if (MjClient.data.sData.tData.curPlayer == getPlayerIndex(0))
                                MjClient.playui._tingCardsNode.visible = false;
                        },
                        MJGang: function(eD) {
                            DealMJGang(this, eD, 0);
                            hideTingBtn();
                        },
                        MJPeng: function(eD) {
                            DealMJPeng(this, eD, 0);
                            if (MjClient.data.sData.tData.curPlayer == getPlayerIndex(0))
                                MjClient.playui._tingCardsNode.visible = false;
                        },
                        MJHu: function(eD) {
                            HandleMJHu(this, eD, 0);
                        },
                        onlinePlayer: function(eD) {
                            setUserOffline(this, 0);
                        },
                        playerStatusChange: function(eD) {
                            setUserOffline(this, 0);
                        },
                        MJFlower: function(eD) {
                            HandleMJFlower(this, eD, 0);
                        },
                        MJTing: function (eD) {
                            HandleMJTing(this, eD, 0);
                        },
                        waitJiazhu: function(msg) {
                            postEvent("returnPlayerLayer");
                            //弹窗选择是否飘分
                            var layer = new jiaZhuCS(function(){
                                //弹窗等待
                                MjClient.playui._jiazhuWait.visible = true;
                            });
                            MjClient.playui.addChild(layer, 99);
                            if (MjClient.webViewLayer != null) {
                                MjClient.webViewLayer.close();
                            }
                        }
                    }
                },
                right: {
                    _run: function(){
                        this.visible = MjClient.MaxPlayerNum != 2;
                    },
                    head: {
                        TG_CountDown:{//托管倒计时
                            _run:function () {
                                this.visible = false;
                                this.ignoreContentAdaptWithSize(true);
                            },
                            _event:{
                                trustTip:function (msg) {
                                    if(getUIPlayer(1)&&getUIPlayer(1).info.uid == msg.uid){
                                        this.visible = true;
                                        this.setString(msg.tipCountDown);
                                        var tipCountDown = msg.tipCountDown;
                                        var self = this;
                                        this.schedule(function () {
                                            self.setString(tipCountDown);
                                            if (tipCountDown > 0) {
                                                tipCountDown--;
                                            }else {
                                                self.setVisible(false);
                                                self.unscheduleAllCallbacks();
                                            }
                                        }, 1, cc.REPEAT_FOREVER, 0);
                                    }
                                },
                                MJPut:function (msg) {
                                    this.visible = false;
                                },
                                MJHu:function (msg) {
                                    this.visible = false;
                                }
                            }
                        },
                        tuoguan: {
                            _run:function () {
                                this.visible = false;
                            },
                            _event:{
                                beTrust:function (msg) {
                                    if(getUIPlayer(1)&&getUIPlayer(1).info.uid == msg.uid){
                                        this.visible = true;
                                    }
                                },
                                cancelTrust:function (msg) {
                                    if(getUIPlayer(1)&&getUIPlayer(1).info.uid == msg.uid){
                                        this.visible = false;
                                    }
                                },
                                initSceneData:function (msg) {
                                    var pl = getUIPlayer(1);
                                    if(pl&&pl.trust){
                                        this.visible = true;
                                    }else {
                                        this.visible = false;
                                    }
                                }
                            }
                        },
                        zhuang: {
                            _run: function() {
                                this.visible = false;
                            },
                            _event: {
                                waitPut: function() {
                                    showUserZhuangLogo(this, 1);
                                },
                                initSceneData: function() {
                                    if (IsArrowVisible()) showUserZhuangLogo(this, 1);
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
                            },
                            showTableEvent: function(isShow){ 
                                MjClient.playui.NowRoundScore(this,1,isShow);
                            }
                        },
                        _run: function () {
                            // this.zIndex = 600;
                            showFangzhuTagIcon(this,1);
                        },
                        score_bg:{_visible:false},
                        name_bg:{_visible:false},
                        flower_layout: {_visible:false},
                        flower_zfb_layout : {_visible:false},
                        tingCard: {_visible:false},
                        //     _event: {
                        //         MJTing: function (eD) {
                        //             if(MjClient.playui.isPlayerPutCard(eD,1))
                        //             {
                        //                 var pl = getUIPlayer(1);
                        //                 pl.putCardAfterTing = eD.putCardAfterTing;
                        //                 MjClient.playui.setTingCardInfo(this,eD,1);
                        //             }
                        //         },
                        //         clearCardUI: function(eD) {
        
                        //             this.visible = false;
                        //         },
                        //         MJHu: function(eD) {
                        //             this.visible = false;
                        //         },
                        //         onlinePlayer: function(eD) {
                        //             //MjClient.playui.setTingCardInfo(this,eD,1);
                        //         },
                        //         initSceneData:function(eD)
                        //         {
                        //             MjClient.playui.setTingCardInfo(this,eD,1);
                        //         }
                        //     }
                        // },
                        tingIcon: {_visible:false},
                        //     _visible:false,
                        //     _run:function(){
                        //         this.visible = false;
        
                        //         this.runAction(cc.sequence(cc.spawn(cc.tintTo(0.6, 255,0,0),cc.scaleTo(0.6,this.getScale() + 0.3)),
                        //             cc.spawn(cc.tintTo(0.6, 255,255,255),cc.scaleTo(0.6,this.getScale()))).repeatForever());
                        //     },
                        //     _event: {
                        //         clearCardUI: function(eD) {
                        //             this.visible = false;
                        //         },
                        //         MJHu: function(eD) {
                        //             this.visible = false;
                        //         },
                        //         moveHead: function() {
                        //             MjClient.playui.tingIconVisible(this, 1);
                        //         },
                        //         onlinePlayer: function(eD) {
                        //             //MjClient.playui.tingIconVisible(this,1);
                        //         },
                        //         initSceneData:function(eD)
                        //         {
                        //             MjClient.playui.tingIconVisible(this,1);
                        //         },
                        //         roundEnd: function(){
                        //             // cc.log("end rounde------------------------");
                        //             this.visible = false;
                        //         }
                        //     }
                        // },
                        huaCount: {
                            _run:function(){
                                changeAtalsForLabel(this,0);
                            },
                            _event:
                                {
                                    clearCardUI: function(eD) {
                                        changeAtalsForLabel(this,0);
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
                    },
                    play_tips: {
                        _layout: [[0.08, 0.14], [0.75, 0.5], [0, 0.5]],
                        _run: function () {
                            this.zIndex = actionZindex;
                        },
                        _visible:false,
                    },
                    ready: {
                        _layout: [
                            [0.07, 0.07],
                            [0.5, 0.5],
                            [2, 0]
                        ],
                        _run: function() {
                            GetReadyVisible(this, 1);
                        },
                        _event: {
                            initSceneData: function(){
                                GetReadyVisible(this, 1);
                            },
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
                            [0, 0.08],
                            [1, 1],
                            [-5.5, -2.3]
                        ],
                        _visible: false
                    },
        
                    up: {
                        _layout: [
                            [0, 0.05],
                            [1, 0],
                            [-3.0, 6]
                        ],
                        _visible: false
                    },
                    down: {
                        _layout: [
                            [0, 0.05],
                            [1, 0],
                            [-3, 6.3]
                        ],
                        _visible: false
                    },
        
                   out0: {
                        _run: function () {
                            if (MjClient.size.width / MjClient.size.height >= 1.5)
                            {
                                setWgtLayout(this, [0, 0.0545],[1, 0.5],[-4.8, -4.1]);
                            }
                            else
                            {
                                setWgtLayout(this, [0, 0.05],[1, 0.5],[-4.8, -5.1]);
                            }
        
                        },
                        _visible: false
                    },
                    out1: {
        
                       _run: function () {
                            if (MjClient.size.width / MjClient.size.height >= 1.5)
                            {
                                setWgtLayout(this, [0, 0.0545],[1, 0.5],[-6.0, -4.1]);
                            }
                            else
                            {
                                setWgtLayout(this, [0, 0.05],[1, 0.5],[-6.0, -5.1]);
                            }
        
                        },
                        _visible: false
                    },
                    outBig: {
                        _layout: [
                            [0.0836, 0],
                            [0.75, 0.58],
                            [0, 0]
                        ],
                        _visible: false
                    },
                    _event: {
                        clearCardUI: function() {
                            clearCardUI(this, 1);
                        },
                        initSceneData: function(eD) {
                            SetUserVisible_huaihuaMaJiang(this, 1);
                        },
                        addPlayer: function(eD) {
                            SetUserVisible_huaihuaMaJiang(this, 1);
                        },
                        removePlayer: function(eD) {
                            SetUserVisible_huaihuaMaJiang(this, 1);
                        },
                        showTableEvent: function(isShow){ 
                            InitUserHandUI_huaihuaMaJiang(this, 1);
                        },
                        mjhand: function(eD) {
                            InitUserHandUI_huaihuaMaJiang(this, 1);
                        },
                        roundEnd: function() {
                            InitUserCoinAndName(this, 1);
                        },
                        waitPut: function() {
                            var tData = MjClient.data.sData.tData;
                            DealWaitPut(this, tData, 1);
                        },
                        MJPut: function(eD) {
                            DealMJPut(this, eD, 1);
                            if(eD.uid != SelfUid())
                            {
                                hideTingBtn();
                            }
                        },
                        MJChi: function(eD) {
                            DealMJChi(this, eD, 1);
                        },
                        MJGang: function(eD) {
                            DealMJGang(this, eD, 1);
                        },
                        MJPeng: function(eD) {
                            DealMJPeng(this, eD, 1);
                        },
                        MJHu: function(eD) {
                            HandleMJHu(this, eD,1);
                        },
                        onlinePlayer: function(eD) {
                            setUserOffline(this, 1);
                        },
                        playerStatusChange: function(eD) {
                            setUserOffline(this, 1);
                        },
                        MJFlower: function(eD) {
                            HandleMJFlower(this, eD, 1);
                        },
                        MJTing: function (eD) {
                            HandleMJTing(this, eD, 1);
                        }
                    }
                },
                top: {
                    _run: function() {
                        this.visible = MjClient.MaxPlayerNum != 3;
                    },
                    head: {
                        TG_CountDown:{//托管倒计时
                            _run:function () {
                                this.visible = false;
                                this.ignoreContentAdaptWithSize(true);
                            },
                            _event:{
                                trustTip:function (msg) {
                                    if(getUIPlayer(2)&&getUIPlayer(2).info.uid == msg.uid){
                                        this.visible = true;
                                        this.setString(msg.tipCountDown);
                                        var tipCountDown = msg.tipCountDown;
                                        var self = this;
                                        this.schedule(function () {
                                            self.setString(tipCountDown);
                                            if (tipCountDown > 0) {
                                                tipCountDown--;
                                            }else {
                                                self.setVisible(false);
                                                self.unscheduleAllCallbacks();
                                            }
                                        }, 1, cc.REPEAT_FOREVER, 0);
                                    }
                                },
                                MJPut:function (msg) {
                                    this.visible = false;
                                },
                                MJHu:function (msg) {
                                    this.visible = false;
                                }
                            }
                        },
                        tuoguan: {
                            _run:function () {
                                this.visible = false;
                            },
                            _event:{
                                beTrust:function (msg) {
                                    if(getUIPlayer(2)&&getUIPlayer(2).info.uid == msg.uid){
                                        this.visible = true;
                                    }
                                },
                                cancelTrust:function (msg) {
                                    if(getUIPlayer(2)&&getUIPlayer(2).info.uid == msg.uid){
                                        this.visible = false;
                                    }
                                },
                                initSceneData:function (msg) {
                                    var pl = getUIPlayer(2);
                                    if(pl&&pl.trust){
                                        this.visible = true;
                                    }else {
                                        this.visible = false;
                                    }
                                }
                            }
                        },
                        zhuang: {
                            _run: function() {
                                this.visible = false;
                            },
                            _event: {
                                waitPut: function() {
                                    showUserZhuangLogo(this, 2);
                                },
                                initSceneData: function() {
                                    if (IsArrowVisible()) showUserZhuangLogo(this, 2);
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
                            },
                            showTableEvent: function(isShow){ 
                                MjClient.playui.NowRoundScore(this,2,isShow);
                            }
                        },
                        _run: function () {
                            // this.zIndex = 600;
                            showFangzhuTagIcon(this,2);
                        },
                        score_bg:{_visible:false},
                        name_bg:{_visible:false},
                        flower_layout: {_visible:false},
                        flower_zfb_layout : {_visible:false},
                        tingCard: {_visible:false},
                        //     _visible:false,
                        //     _event: {
                        //         MJTing: function (eD) {
                        //             if(MjClient.playui.isPlayerPutCard(eD,2))
                        //             {
                        //                 var pl = getUIPlayer(2);
                        //                 pl.putCardAfterTing = eD.putCardAfterTing;
                        //                 MjClient.playui.setTingCardInfo(this,eD,2);
                        //             }
                        //         },
                        //         clearCardUI: function(eD) {
                        //             cc.log("ready to----- clear sking ----");
                        //             this.visible = false;
                        //         },
                        //         moveHead: function(eD) {
                        //             cc.log("top---moveHead ----");
                        //             MjClient.playui.setTingCardInfo(this,eD,2);
                        //         },
                        //         MJHu: function(eD) {
                        //             this.visible = false;
                        //         },
                        //         onlinePlayer: function(eD) {
                        //             cc.log("top---onlinePlayer ----");
                        //             //MjClient.playui.setTingCardInfo(this,eD,2);
                        //         },
                        //         initSceneData:function(eD)
                        //         {
                        //             MjClient.playui.setTingCardInfo(this,eD,2);
                        //         }
                        //     }
                        // },
                        tingIcon: {_visible:false},
                        //     _visible:false,
                        //     _run:function(){
                        //         this.visible = false;
                        //         this.runAction(cc.sequence(cc.spawn(cc.tintTo(0.6, 255,0,0),cc.scaleTo(0.6,this.getScale() + 0.3)),
                        //             cc.spawn(cc.tintTo(0.6, 255,255,255),cc.scaleTo(0.6,this.getScale()))).repeatForever());
                        //     },
                        //     _event: {
                        //         clearCardUI: function(eD) {
                        //             this.visible = false;
                        //             cc.log("tingIcon 22 ----- clearCardUI----");
                        //         },
                        //         MJHu: function(eD) {
                        //             this.visible = false;
                        //         },
                        //         moveHead: function() {
                        //             MjClient.playui.tingIconVisible(this, 2);
                        //         },
                        //         onlinePlayer: function(eD) {
                        //             //MjClient.playui.tingIconVisible(this,2);
                        //         },
                        //         initSceneData:function(eD)
                        //         {
                        //             MjClient.playui.tingIconVisible(this,2);
                        //         },
                        //         roundEnd: function(){
                        //             // cc.log("end rounde------------------------222");
                        //             this.visible = false;
                        //         }
                        //     }
                        // },
                        huaCount: {
                            _run:function(){
                                changeAtalsForLabel(this,0);
                            },
                            _event:
                                {
                                    clearCardUI: function(eD) {
                                        changeAtalsForLabel(this,0);
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
                    },
                    play_tips: {
                        _layout: [[0.08, 0.14], [0.5, 0.75], [0, 0]],
                        _run: function () {
                            this.zIndex = actionZindex;
                        },
                        _visible:false,
                    },
                    ready: {
                        _layout: [
                            [0.07, 0.07],
                            [0.5, 0.5],
                            [0, 1.5]
                        ],
                        _run: function() {
                            GetReadyVisible(this, 2);
                        },
                        _event: {
                            initSceneData: function(){
                                GetReadyVisible(this, 2);
                            },
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
                        _layout: [
                            [0, 0.07],
                            [0.5, 1],
                            [-6, -1.0]
                        ],
                        _visible: false
                    },
        
                    up: {
                        _layout: [
                            [0, 0.07],
                            [0.5, 1],
                            [6, -1.0]
                        ],
                        _visible: false
                    },
                    down: {
                        _layout: [
                            [0, 0.07],
                            [0.5, 1],
                            [6, -0.7]
                        ],
                        _visible: false
                    },
        
                   out0: {
                        _run: function () {
                            if (MjClient.size.width / MjClient.size.height >= 1.5)
                            {
                                setWgtLayout(this, [0, 0.0763],[0.5, 1],[6.8, -2.5]);
                            }
                            else
                            {
                                setWgtLayout(this, [0, 0.07],[0.5, 1],[6.8, -2.5]);
                            }
                            if(MjClient.MaxPlayerNum === 2)
                            {
                                this.x += this.height * this.scale * 4.8;
                            }
                        },
                        
                        _visible: false
                    },
                    out1: {
                        _run: function () {
                            if (MjClient.size.width / MjClient.size.height >= 1.5)
                            {
                                setWgtLayout(this, [0, 0.0763],[0.5, 1],[6.8, -3.5]);
                            }
                            else
                            {
                                setWgtLayout(this, [0, 0.07],[0.5, 1],[6.8, -3.5]);
                            }
                            if(MjClient.MaxPlayerNum === 2)
                            {
                                this.x += this.height * this.scale * 4.8;
                            }
                        },
                        
                        _visible: false
                    },
                    outBig: {
                        _layout: [
                            [0.0836, 0],
                            [0.5, 0.75],
                            [0, 0]
                        ],
                        _visible: false
                    },
                    _event: {
                        clearCardUI: function() {
                            clearCardUI(this, 2);
                        },
                        initSceneData: function(eD) {
                            SetUserVisible_huaihuaMaJiang(this, 2);
                        },
                        addPlayer: function(eD) {
                            SetUserVisible_huaihuaMaJiang(this, 2);
                        },
                        removePlayer: function(eD) {
                            SetUserVisible_huaihuaMaJiang(this, 2);
                        },
                        mjhand: function(eD) {
                            InitUserHandUI_huaihuaMaJiang(this, 2);
                        },
                        showTableEvent: function(isShow){ 
                            InitUserHandUI_huaihuaMaJiang(this, 2);
                        },
                        roundEnd: function() {
                            InitUserCoinAndName(this, 2);
        
                        },
                        waitPut: function() {
                            var tData = MjClient.data.sData.tData;
                            DealWaitPut(this, tData, 2);
                        },
                        MJPut: function(eD) {
                            DealMJPut(this, eD, 2);
                            if(eD.uid != SelfUid())
                            {
                                hideTingBtn();
                            }
                        },
                        MJChi: function(eD) {
                            DealMJChi(this, eD, 2);
                        },
                        MJGang: function(eD) {
                            DealMJGang(this, eD, 2);
                        },
                        MJPeng: function(eD) {
                            DealMJPeng(this, eD, 2);
                        },
                        MJHu: function(eD) {
                            HandleMJHu(this, eD,2);
                        },
                        onlinePlayer: function(eD) {
                            setUserOffline(this, 2);
                        },
                        playerStatusChange: function(eD) {
                            setUserOffline(this, 2);
                        },
                        MJFlower: function(eD) {
                            HandleMJFlower(this, eD, 2);
                        },
                        MJTing: function (eD) {
                            HandleMJTing(this, eD, 2);
                        }
                    }
                },
                left: {
                    _run: function(){
                        this.visible = MjClient.MaxPlayerNum != 2;
                    },
                    head: {
                        TG_CountDown:{//托管倒计时
                            _run:function () {
                                this.visible = false;
                                this.ignoreContentAdaptWithSize(true);
                            },
                            _event:{
                                trustTip:function (msg) {
                                    if(getUIPlayer(3)&&getUIPlayer(3).info.uid == msg.uid){
                                        this.visible = true;
                                        this.setString(msg.tipCountDown);
                                        var tipCountDown = msg.tipCountDown;
                                        var self = this;
                                        this.schedule(function () {
                                            self.setString(tipCountDown);
                                            if (tipCountDown > 0) {
                                                tipCountDown--;
                                            }else {
                                                self.setVisible(false);
                                                self.unscheduleAllCallbacks();
                                            }
                                        }, 1, cc.REPEAT_FOREVER, 0);
                                    }
                                },
                                MJPut:function (msg) {
                                    this.visible = false;
                                },
                                MJHu:function (msg) {
                                    this.visible = false;
                                }
                            }
                        },
                        tuoguan: {
                            _run:function () {
                                this.visible = false;
                            },
                            _event:{
                                beTrust:function (msg) {
                                    if(getUIPlayer(3)&&getUIPlayer(3).info.uid == msg.uid){
                                        this.visible = true;
                                    }
                                },
                                cancelTrust:function (msg) {
                                    if(getUIPlayer(3)&&getUIPlayer(3).info.uid == msg.uid){
                                        this.visible = false;
                                    }
                                },
                                initSceneData:function (msg) {
                                    var pl = getUIPlayer(3);
                                    if(pl&&pl.trust){
                                        this.visible = true;
                                    }else {
                                        this.visible = false;
                                    }
                                }
                            }
                        },
                        zhuang: {
                            _run: function() {
                                this.visible = false;
                            },
                            _event: {
                                waitPut: function() {
                                    showUserZhuangLogo(this, 3);
                                },
                                initSceneData: function() {
                                    if (IsArrowVisible()) showUserZhuangLogo(this, 3);
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
                            },
                            showTableEvent: function(isShow){ 
                                MjClient.playui.NowRoundScore(this,3,isShow);
                            }
                        },
                        _run: function () {
                            // this.zIndex = 600;
                            showFangzhuTagIcon(this,3);
                        },
                        score_bg:{_visible:false},
                        name_bg:{_visible:false},
                        flower_layout: {_visible:false},
                        flower_zfb_layout : {_visible:false},
                        tingCard: {_visible:false},
                        //     _visible:false,
                        //     _event: {
                        //         MJTing: function (eD) {
                        //             if(MjClient.playui.isPlayerPutCard(eD,3))
                        //             {
                        //                 var pl = getUIPlayer(3);
                        //                 pl.putCardAfterTing = eD.putCardAfterTing;
                        //                 MjClient.playui.setTingCardInfo(this,eD,3);
                        //             }
                        //         },
                        //         clearCardUI: function(eD) {
                        //             cc.log("ready to----- clear sking ----");
                        //             this.visible = false;
                        //         },
                        //         MJHu: function(eD) {
                        //            this.visible = false;
                        //         },
                        //         onlinePlayer: function(eD) {
                        //             //MjClient.playui.setTingCardInfo(this,eD,3);
                        //         },
                        //         initSceneData:function(eD)
                        //         {
                        //             MjClient.playui.setTingCardInfo(this,eD,3);
                        //         }
                        //     }
                        // },
                        tingIcon: {_visible:false},
                        //     _visible:false,
                        //     _run:function(){
                        //         this.visible = false;
                        //         this.runAction(cc.sequence(cc.spawn(cc.tintTo(0.6, 255,0,0),cc.scaleTo(0.6,this.getScale() + 0.3)),
                        //             cc.spawn(cc.tintTo(0.6, 255,255,255),cc.scaleTo(0.6,this.getScale()))).repeatForever());
                        //     },
                        //     _event: {
                        //         clearCardUI: function(eD) {
                        //             this.visible = false;
                        //             cc.log("tingIcon 333 ----- clearCardUI ----");
                        //         },
                        //         MJHu: function(eD) {
                        //             this.visible = false;
                        //         },
                        //         moveHead: function() {
                        //             MjClient.playui.tingIconVisible(this, 3);
                        //         },
                        //         onlinePlayer: function(eD) {
                        //             //MjClient.playui.tingIconVisible(this,3);
                        //         },
                        //         initSceneData:function(eD)
                        //         {
                        //             MjClient.playui.tingIconVisible(this,3);
                        //         },
                        //         roundEnd: function(){
                        //             // cc.log("end rounde-----------------------333-");
                        //             this.visible = false;
                        //         }
                        //     }
                        // },
                        huaCount: {
                            _run:function(){
                                changeAtalsForLabel(this,0);
                            },
                            _event:
                                {
                                    clearCardUI: function(eD) {
                                        changeAtalsForLabel(this,0);
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
                    },
                    play_tips: {
                        _layout: [[0.08, 0.14], [0.25, 0.5], [0, 0.5]],
                        _run: function () {
                            this.zIndex = actionZindex;
                        },
                        _visible:false,
                    },
                    ready: {
                        _layout: [
                            [0.07, 0.07],
                            [0.5, 0.5],
                            [-2, 0]
                        ],
                        _run: function() {
                            GetReadyVisible(this, 3);
                        },
                        _event: {
                            initSceneData: function(){
                                GetReadyVisible(this, 3);
                            },
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
        
                    up: {
                        _layout: [
                            [0, 0.05],
                            [0, 1],
                            [3.0, -3.5]
                        ],
                        _visible: false
                    },
                    down: {
                        _layout: [
                            [0, 0.05],
                            [0, 1],
                            [3, -3]
                        ],
                        _visible: false
                    },
                    stand: {
                        _layout: [
                            [0, 0.08],
                            [0, 0],
                            [5.2, 3]
                        ],
                        _visible: false
                    },
        
                    out0: {
                        _run: function () {
                            if (MjClient.size.width / MjClient.size.height >= 1.5)
                            {
                                setWgtLayout(this, [0, 0.0545],[0, 0.5],[4.57, 4.8]);
                            }
                            else
                            {
                                setWgtLayout(this, [0, 0.05],[0, 0.5],[4.57, 4.8]);
                            }
        
                        },
                       
                        _visible: false
                    },
                    out1: {
                        _run: function () {
                            if (MjClient.size.width / MjClient.size.height >= 1.5)
                            {
                                setWgtLayout(this, [0, 0.0545],[0, 0.5],[5.7, 4.8]);
                            }
                            else
                            {
                                setWgtLayout(this, [0, 0.05],[0, 0.5],[5.7, 4.8]);
                            }
        
                        },
                        _visible: false
                    },
                    outBig: {
                        _layout: [
                            [0.0836, 0],
                            [0.25, 0.58],
                            [0, 0]
                        ],
                        _visible: false
                    },
                    _event: {
                        clearCardUI: function() {
                            clearCardUI(this, 3);
                        },
                        initSceneData: function(eD) {
                            SetUserVisible_huaihuaMaJiang(this, 3);
                        },
                        addPlayer: function(eD) {
                            SetUserVisible_huaihuaMaJiang(this, 3);
                        },
                        removePlayer: function(eD) {
                            SetUserVisible_huaihuaMaJiang(this, 3);
                        },
                        mjhand: function(eD) {
                            InitUserHandUI_huaihuaMaJiang(this, 3);
                        },
                        showTableEvent: function(isShow){ 
                            InitUserHandUI_huaihuaMaJiang(this, 3);
                        },
                        roundEnd: function() {
                            InitUserCoinAndName(this, 3);
                        },
                        waitPut: function() {
                            var tData = MjClient.data.sData.tData;
                            DealWaitPut(this, tData, 3);
                        },
                        MJPut: function(eD) {
                            DealMJPut(this, eD, 3);
                            if(eD.uid != SelfUid())
                            {
                                hideTingBtn();
                            }
                        },
                        MJChi: function(eD) {
                            DealMJChi(this, eD, 3);
                        },
                        MJGang: function(eD) {
                            DealMJGang(this, eD, 3);
                        },
                        MJPeng: function(eD) {
                            DealMJPeng(this, eD, 3);
                        },
                        MJHu: function(eD) {
                            HandleMJHu(this, eD, 3);
                        },
                        onlinePlayer: function(eD) {
                            setUserOffline(this, 3);
                        },
                        playerStatusChange: function(eD) {
                            setUserOffline(this, 3);
                        },
                        MJFlower: function(eD) {
                            HandleMJFlower(this, eD, 3);
                        },
                        MJTing: function (eD) {
                            HandleMJTing(this, eD, 3);
                        }
                    }
                },
                eat: {
                    kaiGangKuang: {
                        _visible: false,
                        _layout: [
                            [0.20, 0.29],
                            [0.5, 0.35],
                            [0, 0.4]
                        ],
                        _event:{
                            showCardsOfKaiGang: function(addnewcard){
                                var tData = MjClient.data.sData.tData;
                                if (addnewcard && addnewcard.length != 0)
                                {
                                    MjClient.playui.showKaiGangBigCards(this, addnewcard);
                                }
                            },
                            putCardAfterGang: function(data){
                                cc.log(">>>>>>>>>>>>putCardAfterGang>>>>>>>>:" + data.card);
                                var cardNode1 = this.getChildByName("card1");
                                var cardNode2 = this.getChildByName("card2");
                                var cardNode3 = this.getChildByName("card3");
                                var off = getUiOffByUid(data.uid);
                                var node = getNode(off);
                                var msg = {
                                        card: data.card,
                                        uid: data.uid,
                                        isAfterGang: data.afterGang,
                                    };
        
                                if(data.cardIndex == 0){
                                    cardNode2.visible = false;
                                    cardBeginPos = this.getPosition();
                                    DealMJPut(node, msg, off);
        
                                    var pl = getUIPlayer(0);
                                    if (data.uid == SelfUid()) {
                                        var _tingCards = MjClient.playui._tingCardsNode;
                                        var tingSet = MjClient.majiang.calTingSet(pl.mjhand, MjClient.data.sData.tData.hunCard);
                                        setTingCards(_tingCards,tingSet);
                                    }
                                }
        
                                // if(data.cardIndex == 1){
                                //     cardNode2.visible = false;
                                //     cardBeginPos = this.getPosition();
                                //     DealMJPut(node, msg, off);
                                // }
        
                                // if(data.cardIndex == 2){
                                //     cardNode3.visible = false;
                                //     cardBeginPos = this.getPosition();
                                //     DealMJPut(node, msg, off);
                                // }
        
                                if(cardNode1.visible == cardNode2.visible && cardNode2.visible == cardNode3.visible && cardNode3.visible == false){
                                    this.visible = false;
                                    MjClient.playui.EatVisibleCheck();
                                }
                            },
                            //重连问题在上面延迟0.1S处理，方式是重发 showCardsOfKaiGang 消息
                            // initSceneData: function(eD) {
                            //     var tData = MjClient.data.sData.tData;
                            //     if(tData && tData.gangAddCard && tData.gangAddCard.length != 0){
                            //         postEvent("showCardsOfKaiGang", tData.gangAddCard);
                            //     }
                            // },
                            MJGang: function() {
                                this.visible = false;
                            },
                            clearCardUI: function() {
                                this.visible = false;
                            },
                        }
                    },
                    chi0: {
                        _visible: false,
                        _layout: [
                            [0, 0.1],
                            [0.5, 0],
                            [1.3, 2.5]
                        ],
                        _touch: function(btn, eT) {
                            if (eT == 2) {
                                if(MjClient.playui.jsBind.eat.hu._node.visible)
                                {
                                    MjClient.showMsg("确认不胡吗?", function(){
                                        MJChiCardchange(btn.tag);
                                    }, function() {}, "1");
                                }else{
                                    MJChiCardchange(btn.tag);
                                }
                                
                            }
                        },
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
                        bgimg: {
                            _run: function() {
                                this.zIndex = -1;
                            }
                        },
                        bgground: {
                            _run: function() {
                                this.zIndex = -1;
                            }
                        },
                        card1: {},
                        card2: {},
                        card3: {}
                    },
                    chi1: {
                        _visible: false,
                        _layout: [
                            [0, 0.1],
                            [0.5, 0],
                            [1.3, 3.8]
                        ],
                        _touch: function(btn, eT) {
                            if (eT == 2) MJChiCardchange(btn.tag);
                        }
                    },
                    chi2: {
                        _visible: false,
                        _layout: [
                            [0, 0.1],
                            [0.5, 0],
                            [1.3, 5.1]
                        ],
                        _touch: function(btn, eT) {
                            if (eT == 2) MJChiCardchange(btn.tag);
                        }
                    },
                    ting: {
                        _visible: false,
                        _layout: [
                            [0, 0.1],
                            [0.5, 0],
                            [1.3, 2.5]
                        ],
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
                            if (eT == 2)
                            {
                                // MJTingToServer();
                                var eat = MjClient.playui.jsBind.eat;
                                eat.gang0._node.visible = false;
                                eat.guo._node.visible = false;
                                eat.ting._node.visible = false;
                                eat.cancel._node.visible = true;
                                MjClient.clickTing = true;
                                eat.hu._node.visible = false;
                                MjClient.playui._btnPutCard.visible = true;
                                MjClient.playui.CardLayoutRestore(MjClient.playui._downNode, 0);
                                /*
                                 设置当前听牌的张数
                                 */
                                var pl = getUIPlayer(0);
                                var currentCard = CurrentPutCardMsg();
                                var tingCards = getCheckTingHuCards(currentCard,pl.mjhand);
                                setCurrentTingNum(tingCards);
                            }
                        }
                    },
                    noTing : {
                        _visible : false,
                        _layout: [
                            [0, 0.1],
                            [0.5, 0],
                            [4.6, 2.5]
                        ],
                        _touch: function(btn, eT) {
                            if (eT == 2)
                            {
                                cc.log("_____noting__888888____");
                                hideTingBtn();
                            }
                        }
                    },
                    peng: {
                        _visible: false,
                        _layout: [
                            [0, 0.1],
                            [0.5, 0],
                            [0, 2.5]
                        ],
                        _touch: function(btn, eT) {
                            console.log(">>>> lf，点击碰按钮");
                            if (eT == 2) {
                                if(MjClient.playui.jsBind.eat.hu._node.visible)
                                {
                                    MjClient.showMsg("确认不胡吗?", function(){
                                        MJPengToServer();
                                    }, function() {}, "1");
                                }else{
                                    MJPengToServer();
                                }
                            }
                        },
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
                        bgimg: {
                            _run: function() {
                                this.zIndex = -1;
                            }
                        }
                    },
                    gang0: {
                        _visible: false,
                        _layout: [
                            [0, 0.1],
                            [0.5, 0],
                            [-1.7, 2.5]
                        ],
                        card1: {},
                        _touch: function(btn, eT) {
                            if (eT == 2) {
                                isTouZi_huaihuaMJ = false;
                                if(MjClient.playui.jsBind.eat.hu._node.visible)
                                {
                                    MjClient.showMsg("确认不胡吗?", function(){
                                        MJGangCardchange(btn.tag);
                                    }, function() {}, "1");
                                }else{
                                    MJGangCardchange(btn.tag);
                                }   
                            }
                        },
                        bgimg: {
                            _run: function() {
                                this.zIndex = -1;
                            }
                        },
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
                        bgground: {
                            _run: function() {
                                this.zIndex = -1;
                            }
                        }
                    },
                    gang1: {
                        _visible: false,
                        _layout: [
                            [0, 0.1],
                            [0.5, 0],
                            [-1.7, 3.8]
                        ],
                        card: {},
                        _touch: function(btn, eT) {
                            if (eT == 2) {
                                isTouZi_huaihuaMJ = false;
                                MJGangCardchange(btn.tag);
                            }
                        }
                    },
                    gang2: {
                        _visible: false,
                        _layout: [
                            [0, 0.1],
                            [0.5, 0],
                            [-1.7, 5.1]
                        ],
                        card: {},
                        _touch: function(btn, eT) {
                            if (eT == 2) {
                                isTouZi_huaihuaMJ = false;
                                MJGangCardchange(btn.tag);
                            }
                        }
                    },
                    touzi: {
                        _visible: false,
                        _layout: [
                            [0, 0.1],
                            [0.5, 0],
                            [-1.7, 5.1]
                        ],
                        card: {},
                        _touch: function(btn, eT) {
                            if (eT == 2) {
                                isTouZi_huaihuaMJ = true;
                                var sData = MjClient.data.sData;
                                var tData = sData.tData;
                                var pl = MjClient.data.sData.players[SelfUid() + ""];
                                //自摸
                                if(tData.tState == TableState.waitPut && pl.mjState == TableState.waitPut && IsTurnToMe())
                                {
                                    MjClient.gangCards = MjClient.majiang.canGang1(pl.mjpeng, pl.mjhand, pl.putCount, true);
                                }
                                MJGangCardchange(btn.tag);
                            } 
                        }
                    },
                    guo: {
                        _visible: false,
                        _layout: [
                            [0, 0.1],
                            [0.5, 0],
                            [4.6, 2.5]
                        ],
                        _touch: function(btn, eT) {
                            if (eT == 2)
                            {
                                MjClient.MJPass2NetForhuaihuaMaJiang();
                            }
                        },
                        bgimg: {
                            _run: function() {
                                this.zIndex = -1;
                            }
                        }
                    },
                    hu: {
                        _visible: false,
                        _layout: [
                            [0, 0.1],
                            [0.5, 0],
                            [-3, 2.5]
                        ],
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
                                MJHuToServer();
                                MjClient.playui.hideEat();
                            }
                        },
                        bgimg: {
                            _run: function() {
                                this.zIndex = -1;
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
                                MjClient.clickTing = false;
                                hideCurrentTingNum();
                                MjClient.playui.EatVisibleCheck();
                                MjClient.playui.CardLayoutRestore(MjClient.playui._downNode, 0);
                            }
                        }
                    },
                    changeui: {
                        _visible:true,
                        changeuibg: {
                            _layout: [
                                [0.36, 0.36],
                                [0.5, 0.15],
                                [0, 0]
                            ],
                            _run: function() {
                                this.visible = false;
                                this.getChildByName("card").visible = false;
                                this.chiTouch = function(btn, et) {
                                    if (et == 2) 
                                    {
                                        if (btn.name.localeCompare("card3") < 0)
                                        {
                                            MJChiToServer(0);
                                        }
                                        else if (btn.name.localeCompare("card6") < 0)
                                        {
                                            MJChiToServer(1);
                                        }
                                        else
                                        {
                                            MJChiToServer(2);
                                        }
                                    }
                                };
                                this.gangTouch = function(btn, et) {
                                    if (et == 2){
                                        if(isTouZi_huaihuaMJ){
                                            MjClient.majiang.MJTouZiToServer(btn.tag);
                                        }else{
                                            MJGangToServer(btn.tag);
                                        }
                                    }
                                };       
                            },
                            guobg: {
                                guo: {
                                    _touch: function(btn, eT) {
                                        if (eT == 2) MjClient.MJPass2NetForhuaihuaMaJiang();
                                    }
                                },
                                fanhui: {
                                    _touch: function(btn, et) {
                                        if (et == 2) {
                                            isTouZi_huaihuaMJ = false;
                                            btn.getParent().getParent().visible = false;
                                            MjClient.playui.EatVisibleCheck();
                                        }
                                    }
                                }
                            }
                        }
                    },
                    _event: {
                        MJBaoTing:function(eD){
                            if(MjClient.rePlayVideo != -1){
                                var pl = MjClient.data.sData.players[SelfUid()];
                                if(pl && pl.passHu && MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType()){
                                    MjClient.showToast("你选择了过，暂时放弃胡牌");
                                }
                            }
                        },
                        clearCardUI: function() {
                            //add by sking
                            cc.log("ting yu no ting hide --------by sking");
                            MjClient.playui.EatVisibleCheck();
                            hideTingBtn();
                        },
                        MJPass: function(eD) {
                            console.log("HHH :，MJPass------");
                            if(MjClient.rePlayVideo != -1){
                                var pl = MjClient.data.sData.players[SelfUid()];
                                if(pl && pl.passHu && MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType()){
                                    MjClient.showToast("你选择了过，暂时放弃胡牌");
                                }
                            }
                            setSkipHuState();
                            setSkipPengState(); // 开启 过碰 机制
                            MjClient.playui.EatVisibleCheck();
                        },
                        mjhand: function(eD) {
                            console.log("HHH :，mjhand------");
                            MjClient.playui.EatVisibleCheck();
                        },
                        waitPut: function() {
                            console.log("HHH :，waitPut------");
                            MjClient.data.sData.players[SelfUid()].clickPass = false;
                            MjClient.playui.EatVisibleCheck();
                        },
                        MJPut: function(eD) {
                            console.log("HHH :，MJPut------");
                            MjClient.data.sData.players[SelfUid()].clickPass = false;
                            MjClient.playui.EatVisibleCheck();
                        },
                        MJPeng: function(eD) {
                            console.log("HHH :，MJPeng------");
                            MjClient.playui.EatVisibleCheck();
                        },
                        MJChi: function(eD) {
                            console.log("HHH :，MJChi------");
                            MjClient.playui.EatVisibleCheck();
                        },
                        MJGang: function(eD) {
                            console.log("HHH :，MJGang------");
                            MjClient.playui.EatVisibleCheck();
                        },
                        MJTing: function (eD) {
                            console.log("HHH :，MJTing------");
                            hideTingBtn();
                            isCheckedTing = false;
                        },
                        roundEnd: function(eD) {
                            console.log("HHH :，roundEnd------");
                            MjClient.playui.EatVisibleCheck();
                        },
                        initSceneData: function(eD) {
                            var sData = MjClient.data.sData;
                            var tData = sData.tData;
                            var pl = sData.players[SelfUid()];
                            var curPl = sData.players[tData.uids[tData.curPlayer]];
                            var isShowKaiGang = true;
                            pl.clickPass = false;
                            if(tData.tState === TableState.roundFinish && pl.mjState === TableState.isReady || curPl && curPl.eatFlag == 0){
                                isShowKaiGang = false;
                            }
        
                            function delayExe()
                            {
                                if(isShowKaiGang && tData.gangAddCard && tData.gangAddCard.length != 0){
                                    postEvent("showCardsOfKaiGang", tData.gangAddCard);
                                }else{
                                    MjClient.playui.EatVisibleCheck();
                                }
                            }
                            this.runAction(cc.sequence(cc.DelayTime(0.1),cc.callFunc(delayExe)));
                        }
                    }
                },
                gps_btn: {
                    _layout: [
                        [0.09, 0.09],
                        [0.95, 0.0],
                        [0, 3.7]
                    ],
                    _run: function() {
                        this.visible = MjClient.MaxPlayerNum != 2;
                    },
                    _click: function() {
                        MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Dingwei", {uid: SelfUid()});
                        if (MjClient.MaxPlayerNum == 3) {
                            MjClient.Scene.addChild(new showDistance3PlayerLayer());
                        } else if (MjClient.MaxPlayerNum == 4) {
                            MjClient.Scene.addChild(new showDistanceLayer());
                        }
                    }
                },
                chat_btn: {
                    _layout: [
                        [0.09, 0.09],
                        [0.95, 0.1],
                        [0, 3.7]
                    ],
                    _click: function() {
                        var chatlayer = new ChatLayer();
                        MjClient.Scene.addChild(chatlayer);
                    }
                },
                voice_btn: {
                    _layout: [
                        [0.09, 0.09],
                        [0.95, 0.2],
                        [0, 3.7]
                    ],
                    _run: function() {
                        initVoiceData();
                        cc.eventManager.addListener(getTouchListener(), this);
                        if(MjClient.isShenhe) this.visible=false;
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
                        }
                    }
                },
                hua_btn: {
                    _layout: [
                        [0.09, 0.09],
                        [0.95, 0.2],
                        [0, 1.5]
                    ],
                    _run: function() {
                        this.visible = false;
                        this.opacity = 255;
                        if (IsArrowVisible()) this.visible = true;;
                    },
                    _touch: function(btn, eT) {
                        if (eT == 2) {
                            //显示花
                            var layer = new showFlowerLayer();
                            MjClient.Scene.addChild(layer);
                        }
                    }
                },
                block_tuoguan:{
                    _layout:[
                        [1, 1],
                        [0.5, 0.5],
                        [0, 0],
                        true
                    ],
                    _run: function() {
                        this.visible = false;
                        if(this.getParent() != MjClient.playui.getChildByName("playui")){
                            this.getParent().visible = false;
                        }
                    },
                    btn_tuoguan:{
                        _touch:function (btn, eT) {
                            if (eT == 2) {
                                MjClient.gamenet.request("pkroom.handler.tableMsg", {cmd: "cancelTrust"},function (rtn) {
                                    btn.getParent().setVisible(false);
                                    var parent = btn.getParent();
                                    if(parent.getParent() != MjClient.playui.getChildByName("playui")){
                                        parent.getParent().setVisible(false);
                                    }
                                });
                            }
                        }
                    },
                    _event:{
                        beTrust:function (msg) {
                            cc.log("wxd........beTrust......."+JSON.stringify(msg));
                            if(getUIPlayer(0)&&getUIPlayer(0).info.uid == msg.uid){
                                if(MjClient.movingCard){
                                    MjClient.movingCard.setTouchEnabled(false);
                                    MjClient.movingCard.setScale(cardBeginScale);
                                    MjClient.movingCard.setTouchEnabled(true);
                                }
                                this.visible = true;
                                if(this.getParent() != MjClient.playui.getChildByName("playui")){
                                    this.getParent().setVisible(true);
                                }
                            }
                        },
                        cancelTrust:function (msg) {
                            if(getUIPlayer(0)&&getUIPlayer(0).info.uid == msg.uid) {
                                this.visible = false;
                                if(this.getParent() != MjClient.playui.getChildByName("playui")){
                                    this.getParent().setVisible(false);
                                }
                            }
                        },
                        initSceneData:function (msg) {
                            var pl = getUIPlayer(0);
                            if(pl&&pl.trust){
                                this.visible = true;
                                if(this.getParent() != MjClient.playui.getChildByName("playui")){
                                    this.getParent().setVisible(true);
                                }
                            }else {
                                this.visible = false;
                                if(this.getParent() != MjClient.playui.getChildByName("playui")){
                                    this.getParent().setVisible(false);
                                }
                            }
                        },
                        roundEnd: function(msg){
                            var tData = MjClient.data.sData.tData;
                            if(tData.roundNum <= 0 || MjClient.rePlayVideo != -1){
                                this.visible = false;
                                if(this.getParent() != MjClient.playui.getChildByName("playui")){
                                    this.getParent().setVisible(false);
                                }
                            }
                            
                        }
                    }
                }
         
        };
        return jsBind;
    },
    _downNode:null,
    _rightNode:null,
    _topNode:null,
    _leftNode:null,
    _btnPutCard:null,
    //_btnFlower:null,
    ctor: function() {
        this._super();
        this.srcMaxPlayerNum = MjClient.MaxPlayerNum;
        MjClient.MaxPlayerNum = parseInt(MjClient.data.sData.tData.maxPlayer);
        var playui = ccs.load("Play_huaihuaMaJiang.json");
        playui.node.setName("playui");
        playMusic("bgFight");
        this._downNode  = playui.node.getChildByName("down");
        this._rightNode = playui.node.getChildByName("right");
        this._topNode   = playui.node.getChildByName("top");
        this._leftNode  = playui.node.getChildByName("left");
        MjClient.playui = this;
        this._btnPutCard = playui.node.getChildByName("BtnPutCard");
        this._tingCardsNode = this._downNode.getChildByName("tingCardsNode");
        this._tingCardNumNode = this._downNode.getChildByName("tingCardNumNode");
        MjClient.playui._AniNode =  playui.node.getChildByName("eat");

        var jsBind = this.getJsBind();
        this.jsBind = {};
        util.assign(this.jsBind, jsBind);

        //托管层剥离成独立的最上层Layer
        var tuoGuanBindCp = {};
        util.assign(tuoGuanBindCp, this.jsBind.block_tuoguan);
        delete this.jsBind["block_tuoguan"];
        this.detachTuoGuanLayer(playui.node.getChildByName("block_tuoguan"), tuoGuanBindCp);

        BindUiAndLogic(playui.node, this.jsBind);

        // 添加光晕动画
        COMMON_UI.addAniEatCardsBtn();

        this.addChild(playui.node);

        //添加滚动通知 by sking
        var _laba_bg =  playui.node.getChildByName("banner").getChildByName("laba_bg");
        _laba_bg.visible = false;
        var _scroll =  playui.node.getChildByName("banner").getChildByName("scroll");
        _scroll.visible = false;
        MjClient.playui._jiazhuWait = playui.node.getChildByName("jiazhuWait");
        //MjClient.playui._btnFlower = playui.node.getChildByName("hua_btn");
        //var _msg = _scroll.getChildByName("msg");
        //homePageRunText(_msg);
        //function getMsg()
        //{
        //    var content = (MjClient.updateCfg != null && (typeof MjClient.updateCfg) != 'undefined') ? MjClient.updateCfg.homeScroll : "";
        //    return MjClient.isTest ? "" : content;
        //}
        //_msg.setString(getMsg());


        MjClient.lastMJTick = Date.now();
        this.runAction(cc.repeatForever(cc.sequence(cc.callFunc(function() {
            if (MjClient.game_on_show) MjClient.tickGame(0);
        }), cc.delayTime(7))));

        changeMJBg(this, getCurrentMJBgType());

        initSceneFunc();

        // 在亲友圈房间中添加邀请亲友圈牌有一起对局
        addClubYaoqingBtn(2);
        // 俱乐部返回大厅功能：by_jcw
        addClub_BackHallBtn();
        return true;
    },
    resetJiaZhuTip: function()
    {
        var tData = MjClient.data.sData.tData;
        if (!tData.areaSelectMode.jiapiao)
            return;
        var nodes = [this._downNode, this._rightNode, this._topNode, this._leftNode];
        for (var i = 0; i < MjClient.MaxPlayerNum; i ++)
        {
            var pl = getUIPlayer(getOffForPlayerNum(i));
            if (!pl) 
                return;

            cc.log("resetJiaZhuTip jiazhuNum = " + pl.jiazhuNum);
            var node = nodes[getOffForPlayerNum(i)];
            var tipNode = node.getChildByName("head").getChildByName("jiaZhuTip");
            var playTipNode = node.getChildByName("play_tips");
            var point = playTipNode.convertToWorldSpace(playTipNode.getChildByName("hu").getPosition());
            tipNode.setPosition(tipNode.parent.convertToNodeSpace(point));
            tipNode.visible = true;
            tipNode.opacity = 255;
            tipNode.ignoreContentAdaptWithSize(true);
            tipNode.setString(pl.jiazhuNum > 0 ? "飘分" : "不飘分");
            tipNode.runAction(cc.sequence(cc.delayTime(1), cc.fadeOut(0.5), cc.callFunc(function(){ this.visible = false;}, tipNode)));
        }
    },

    //根据玩家选择，判断是否显示癞子牌
    isShowHunCard: function(){
        if(MjClient.data.sData.tData.hunCard != 0){
            return true;
        }
        return false;
    },

    /*
     判断当前是否可以出牌，add by sking
     */
    isCanPutCard:function()
    {
        var bPut = false;
        var downNode = MjClient.playui._downNode;
        var standUI = downNode.getChildByName("stand");
        var children = downNode.children;
        for(var i = 0; i < children.length; i++)
        {
            if(children[i].name == "mjhand")
            {
                if(children[i].y > standUI.y + 10)
                {
                    bPut = true;
                    break;
                }
            }
        }
        return bPut;
    },

    /*
     设置听的icon 是否可见 add by sking
     */
     tingIconVisible:function(node,off)
    {
        var pl = getUIPlayer(off)
        if(pl == null) return;
        var tData = MjClient.data.sData.tData;
        cc.log("offffffffffffffffffffff  =  " + off );
        //cc.log("(((((((((((( set card))))))))))))))))) == pl.mjState  " + pl.mjState );

        if(pl && (pl.mjState == TableState.isReady || pl.mjState == TableState.roundFinish))
        {
            //准备状态时，所有的听Icon不可见
            //var node = node.getParent().getParent().getParent().getChildByName("")
            var _tingIcon1 = this._downNode.getChildByName("head").getChildByName("tingIcon");
            _tingIcon1.visible = false;

            var _tingIcon2 = this._rightNode.getChildByName("head").getChildByName("tingIcon");
            _tingIcon2.visible = false;

            var _tingIcon3 = this._topNode.getChildByName("head").getChildByName("tingIcon");
            _tingIcon3.visible = false;

            var _tingIcon4 = this._leftNode.getChildByName("head").getChildByName("tingIcon");
            _tingIcon4.visible = false;
            // cc.log("(((((((((((( TableState.isReady))))))))))))))))) == TableState.isReady  " + TableState.isReady);
            node.visible = false;
        }else{
            if(pl != null)
            {
                if (pl.isTing) {
                    // cc.log("(((((((((((( TableState.isReady))))))))))))))))) == pl.isTing  " + pl.isTing);
                    node.visible = true;
                    if (off == 0)
                    {
                        var tingSet = MjClient.majiang.calTingSet(pl.mjhand, MjClient.data.sData.tData.hunCard);
                        setTingCards(this._tingCardsNode,tingSet);
                    }
                }
                else {
                    node.visible = false;
                }
            }
        }
        return node.visible;
    },
    /*
        设置听牌之后打牌的花色, by sking
    */
    setTingCardInfo:function(node,eD,off)
    {
        /*
            游戏准备
         */
        cc.log("%%%%%%%%%%%%%%%%setCard%%%%%%%%%%%%%%%%%%% = " + off);
        var pl = getUIPlayer(off);
        if(pl == null) return;
        var tData = MjClient.data.sData.tData;
        cc.log("(((((((((((( set card))))))))))))))))) == pl.mjState  " + pl.mjState);
        if( pl.mjState == TableState.isReady || pl.mjState == TableState.roundFinish)
        {
            cc.log("*********set ting card info***************111");
            node.visible = false;
            return;
        }

        /*
            判断是否拿到了听之后的那张牌
         */
        var cd = -1;

        if(pl.isTing)
        {
            if(pl.putCardAfterTing)
            {
                cd = pl.putCardAfterTing;
            }else{
                return;
            }
        }else{
            node.visible = false;
            return;
        }

        cc.log("%%%%%%%%%%%%%%%%setCard%%%%%%%%%%%%%%%%%%%  pl.putCardAfterTing = " + pl.putCardAfterTing);

        /*
            设置麻将的花纹
         */
        //东南西北中发白
        var imgNames = ["Bamboo_", "Character_", "Dot_", "Wind_east", "Wind_south", "Wind_west", "Wind_north", "Red", "Green", "White"];
        var offSets = [];
        if (getCurrentMJBgType() == 0)
            offSets = [[50, 90], [60, 70], [50, 90], [60, 70], [48, 62]];
        else
            offSets = [[52, 100], [60, 70], [52, 100], [60, 70], [50, 66]];
        //麻将的底牌公用图，4张
        //node.loadTexture("playing/MJ/Mj_up_" + off + ".png");

        var imgNode = new ccui.ImageView();
        imgNode.setPosition(offSets[0][0], offSets[0][1]);
        node.visible = true;
        node.removeAllChildren();
        node.addChild(imgNode);

        // 贴在麻将上面可变的图
        var path = "playing/MJ/"
        var imgName = "";
        if(cd < 30)
        {
            //条，筒，万
            imgName = imgNames[Math.floor(cd / 10)] + cd % 10;
        }
        else if (cd <= 91)
        {	//东南西北中发白
            imgName = imgNames[Math.floor(cd / 10)];//东南西北中发白
        }
        else if (cd <= 181){
            imgName = "flower_" + cd;
        }

        //node.tag = cd;
        var callback = function()
        {
            //加载小图
            imgNode.loadTexture(getNewMJBgFile(path + imgName + ".png"));
            if (getCurrentMJBgType() != 0) {
                // 左右两侧的牌偏大，特殊处理，缩小
                if (off == 1 || off == 3) {
                    imgNode.setScale(0.8);
                }
            }
        };

        node.stopAllActions();
        node.runAction(cc.sequence(cc.callFunc(callback), cc.delayTime(1)));
    },
    /*
        打出去的牌是那个玩家的， by sking
     */
    isPlayerPutCard:function(eD,off)
    {
        var tData = MjClient.data.sData.tData;
        var uids = tData.uids;
        var idx = uids.indexOf(eD.uid);
        var selfidx = uids.indexOf(SelfUid());
        var offidx = (idx-selfidx+4)%4;

        if(offidx == off)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
});

PlayLayer_huaihuaMaJiang.prototype.hideEat= function() {
    if (MjClient.getAppType() != MjClient.APP_TYPE.HUNANWANGWANG && MjClient.APP_TYPE.QXSYDTZ != MjClient.getAppType()) {
        return ;
    }

    var eat = MjClient.playui.jsBind.eat;
    eat.chi0._node.visible = false;
    eat.chi1._node.visible = false;
    eat.chi2._node.visible = false;
    eat.peng._node.visible = false;
    eat.gang0._node.visible = false;
    eat.gang1._node.visible = false;
    eat.gang2._node.visible = false;
    eat.hu._node.visible = false;
    eat.guo._node.visible = false;
    eat.cancel._node.visible = false;
    eat.touzi._node.visible = false;
},

// 显示当前局数增加的分数
PlayLayer_huaihuaMaJiang.prototype.NowRoundScore = function(node,off,isShow) { 
    var pl = getUIPlayer(off);
    if(!pl)return; 

    if (MjClient.data.sData.tData.areaSelectMode.jiapiao)
        return;

    var score = null;
    if(node.getChildByName("roundScore")){
        score = node.getChildByName("roundScore"); 
    }else{
        score = new ccui.Text();
        score.setFontName("fonts/fzcy.ttf");
        score.setColor(cc.color.WHITE);
        score.setName("roundScore");
        score.setFontSize(30);
        node.addChild(score,100); 
        var sumScore = node.getChildByName("score_bg");
        if(MjClient.MaxPlayerNum == 2){
            var nobody = node.getChildByName("nobody");
            if(off == 0){
                score.setPosition(cc.p(sumScore.x ,sumScore.y - (sumScore.height + 10))); 
            }else{
                score.setPosition(cc.p(nobody.x + (nobody.width * 0.8),nobody.y)); 
            }
        }else{  
            
            if(off == 0 || off == 2){
                score.setPosition(cc.p(sumScore.x + (sumScore.width *0.8),sumScore.y)); 
            }else{
                score.setPosition(cc.p(sumScore.x,sumScore.y - 40));  
            }  

        } 
    }    
    score.setVisible(isShow);
    score.setColor(cc.color(114,255,0));
    if(pl.winone >= 0 ){
        score.setColor(cc.color(255,192,0));
    }
    score.setString( (pl.winone > 0 ?"+":"") + pl.winone );  
}

PlayLayer_huaihuaMaJiang.prototype.showKaiGangBigCards = function(kaiGangKuang, addnewcard) {
    var tData = MjClient.data.sData.tData;
    cc.log("showKaiGangBigCards  addnewcard:" + JSON.stringify(addnewcard));

    var cardNode1 = kaiGangKuang.getChildByName("card1");
    var cardNode2 = kaiGangKuang.getChildByName("card2");
    var cardNode3 = kaiGangKuang.getChildByName("card3");
    kaiGangKuang.setVisible(true);
    cardNode1.setVisible(false);
    cardNode2.setVisible(true);
    cardNode3.setVisible(false);

    if (addnewcard[0])
        setCardSprite(cardNode2, addnewcard[0], 0);

    MjClient.playui.EatVisibleCheck();
}

PlayLayer_huaihuaMaJiang.prototype.CardLayoutRestore = function(node, off,isNewCard)
{
    // node 是克隆新建的一个麻将节点 by sking

    var newC = null; //先创建麻将的UI节点
    var newVal = 0; //新牌的值，是几万，几筒，几条....为数字
    var pl = getUIPlayer(off);//获取玩家信息.off 为0 ，就是自己得信息，能看到自己摸牌 by sking
    if(!pl)
        return;
    var mjhandNum = 0;
    var children = node.children;
    for(var i = 0; i < children.length; i++)
    {
        var ci = children[i];
        if(ci.name == "mjhand")
        {
            mjhandNum++;
            if((typeof MjClient.init_y) == 'undefined')
            {
                MjClient.init_y = ci.y;
            }
            ci.visible = true;
            ci.y = MjClient.init_y;
        }
    }
    var tempMaJiang = MjClient.majiang; //麻将的各种方法判断，是否可以杠，是否可以吃... by sking
    //排序麻将的位置 by sking
    if (pl.mjhand && pl.mjhand.length > 0)
    {
        var count = tempMaJiang.CardCount(pl);
        if(count == 14 && mjhandNum == pl.mjhand.length)
        {
            if(pl.isNew ) //isNew 每次摸完牌后设为true,打出去一张牌后 设为false by sking
            {
                newVal = pl.mjhand[pl.mjhand.length - 1]; //为什么取最后一个节点 ？
            }
            else
            {
                pl.mjhand.sort(function(a, b)
                {
                    if(MjClient.majiang.isHunCard(a, MjClient.data.sData.tData.hunCard))
                    {
                        return -1;
                    }
                    else if (MjClient.majiang.isHunCard(b, MjClient.data.sData.tData.hunCard))
                    {
                        return 1;
                    }
                    else
                    {
                        return a - b;
                    }
                });

                newVal = pl.mjhand[pl.mjhand.length - 1];
            }
        }
    }
    //up stand 是2种麻将的图。
    var up = node.getChildByName("up");
    var stand = node.getChildByName("stand");
    var start, offui;
    switch (off)
    {
        case 0:
            start = up;
            offui = stand;
            break;
        case 1:
            start = stand;
            offui = up;
            break;
        case 2:
            start = stand;
            offui = up;
            break;
        case 3:
            start = up;
            offui = up;
            break;
    }
    var upSize = offui.getSize();
    var upS = offui.scale;
    //mjhand standPri out chi peng gang0 gang1
    var uipeng = [];
    var uigang0 = [];
    var uigang1 = [];
    var uichi = [];
    var uistand = [];
    var uihun = [];//癞子牌在最左边
    // var sData = MjClient.data.sData;
    // var tData = sData.tData;
    for(var i = 0; i < children.length; i++) //children 为 "down" 节点下的字节点
    {
        var ci = children[i];
        if(ci.name == "mjhand")
        {
            if(newC == null && newVal == ci.tag)
            {
                newC = ci; //从down 节点下，复制一个麻将node保存在newC 里 by sking    //newC就是新摸的那张手牌
            }
            else
            {
                if(MjClient.majiang.isHunCard(ci.tag, MjClient.data.sData.tData.hunCard))
                {
                    uihun.push(ci);
                }
                else
                {
                    uistand.push(ci);
                }
            }
            if(MjClient.majiang.isHunCard(ci.tag, MjClient.data.sData.tData.hunCard))
            {
                ci.setColor(cc.color(255,255,63));
            }
        }
        else if(ci.name == "standPri")
        {
            uistand.push(ci);
        }
        else if(ci.name == "gang0")
        {
            uigang0.push(ci);
        }
        else if (ci.name == "gang1")
        {
            uigang1.push(ci);
        }
        else if (ci.name == "chi")
        {
            uichi.push(ci);
        }
        else if (ci.name == "peng")
        {
            uipeng.push(ci);
        }
        else if(ci.name == "mjhand_replay")
        {
            uistand.push(ci);
        }
    }

    var HandCardsLength = uistand.length + uihun.length;
    if (off != 0 && MjClient.rePlayVideo != -1 && HandCardsLength > 0 && HandCardsLength % 3 == 2 
        && (MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType())) // 回放或倒牌
    {
        var lastCard = uistand.pop();
        uistand.sort(TagOrder);

        if(uihun.length > 0) //是否有柰子，有则放在最前面 by sking
        {
            for(var i = 0; i < uihun.length; i++)
            {
                uistand.unshift(uihun[i]); //向数组开头添加一个元素 unshift
            }
        }
        //uistand.push(lastCard);
        if(off == 3){
            uistand.push(lastCard);
        }else{
            uistand.unshift(lastCard);
        }
        // uistand.unshift(lastCard);
        cc.log(" rePlayVideo ----------",lastCard.name,lastCard.tag);
    }else{
       uistand.sort(TagOrder);
        if(uihun.length > 0) //是否有柰子，有则放在最前面 by sking
        {
            for(var i = 0; i < uihun.length; i++)
            {
                uistand.unshift(uihun[i]); //向数组开头添加一个元素 unshift
            }
        } 
    }
    if(newC)
    {
        uistand.push(newC); //把这张牌放入手牌的数组里  by sking
    }
    var uiOrder = [uigang1, uigang0, uipeng, uichi, uistand];
    if(off == 1 || off == 2)
    {
        uiOrder.reverse();//颠倒顺序
    }
    var orders = []; //重新排序后装到数组里 by sking
    for(var j = 0; j < uiOrder.length; j++)
    {
        var uis = uiOrder[j];
        for(var i = 0; i < uis.length; i++)
        {
            orders.push(uis[i]);
        }
    }
    //设置麻将大小
    var slotwith = upSize.width * upS * 0.2;//0.05;
    var slotheigt = upSize.height * upS * 0.3;
    var hasUp = false;
    var spacingNum = 0;// 增加间距
    for(var i = 0; i < orders.length; i++)
    {
        var ci = orders[i];
        if(off % 2 == 0)//自己或者对家
        {
            if(i != 0)
            {
                if(ci.name == orders[i - 1].name)
                {
                    spacingNum++;
                    if(ci.isgang4)
                    {
                        ci.x = orders[i - 2].x;
                        ci.y = orders[i - 2].y + upSize.height * upS * 0.18;
                        spacingNum = 0;
                    }
                    else if(orders[i - 1].isgang4)
                    {
                        ci.x = orders[i - 2].x + upSize.width * upS + slotwith;
                        spacingNum = 0;
                    }
                    else
                    {
                        if(ci.name == "mjhand")
                        {
                            if(off == 0)
                            {
                                ci.x = orders[i - 1].x + upSize.width * upS *1.2//1.08;
                            }
                            else//这个地方不是对家的手牌，下面的代码好像没用
                            {
                                ci.x = orders[i - 1].x + upSize.width * upS * 1.8;
                            }
                        }
                        else
                        {
                            if(off == 0)
                            {
                                ci.x = orders[i - 1].x + upSize.width * upS * 0.91;
                            }
                            else
                            {
                                ci.x = orders[i - 1].x + upSize.width * upS * 1;//对家的手牌
                            }
                        }
                    }
                }
                else if(orders[i - 1].name == "gang0" || orders[i - 1].name == "gang1")
                {
                    ci.x = orders[i - 2].x + upSize.width * upS + slotwith;
                    spacingNum = 0;
                }
                else
                {
                    ci.x = orders[i - 1].x + upSize.width * upS * 1.3;
                    spacingNum = 0;
                }

                if( orders[i].name == "chi"  ||orders[i].name == "peng" ){  
                    if(spacingNum >= 3 ){
                        ci.x += slotwith;
                        spacingNum = 0;
                    }
                } 

            }
            else
            {
                if (off == 0)
                {
                    ci.x = start.x + upSize.width * upS * 0.1;
                }
                else
                {
                    ci.x = start.x + upSize.width * upS;
                }

                var isGray =  pl.isTing && ci.name == "mjhand";
                if (isGray)
                {
                    ci.setColor(cc.color(190, 190, 190));
                    ci.addTouchEventListener(function () {});
                }

                if (ci.name == "mjhand" && (pl.isTing || MjClient.clickTing && !MjClient.canTingCards[ci.tag]))
                    ci.setColor(cc.color(190, 190, 190));
                else
                    ci.setColor(cc.color(255, 255, 255));
            }

            if(off == 0)
            {
                /*
                 ting的情况下，将麻将置灰
                 */
                // console.log("--------orders.length--------"+orders.length);
                var isGray =  pl.isTing && ci.name == "mjhand";
                //if(ci.name == "mjhand")

                if(MjClient.clickTing)
                {
                    if (ci.name == "mjhand")
                    {
                        if(MjClient.canTingCards[ci.tag])
                        {
                            ci.setColor(cc.color(255, 255, 255));
                            if (!hasUp) {
                                ci.y += 20;
                                hasUp = true;
                            }
                        }
                        else {
                            ci.setColor(cc.color(190, 190, 190));
                        }
                    }
                    else {
                        ci.setColor(cc.color(255, 255, 255));
                    }
                }
                else if(i == orders.length - 1)
                {
                    console.log(ci.tag+"--------newC--------"+newC);
                    if(newC)
                    {
                        ci.setColor(cc.color(255, 255, 255));
                        SetTouchCardHandler(stand, ci);
                        MjClient.newCard = newC;
                        MjClient.newCard.isNew = true;
                        if(isNewCard)
                        {
                            ci.x = ci.x + slotwith + 10;
                            ci.y += 20;
                            COMMON_UI.newCardShakAni(ci,off,true);
                        }
                        
                    }
                    else if(isGray)
                    {
                        ci.setColor(cc.color(190, 190, 190));
                        ci.addTouchEventListener(function () {});
                    }
                    else
                    {
                        ci.setColor(cc.color(255, 255, 255));
                        SetTouchCardHandler(stand, ci);
                    }
                }
                else if(isGray)
                {
                    ci.setColor(cc.color(190, 190, 190));
                    ci.addTouchEventListener(function () {});
                }
                else
                {
                    ci.setColor(cc.color(255, 255, 255));
                    SetTouchCardHandler(stand, ci);
                }
            }
        }
        else
        {
            if(i != 0)
            {
                if(ci.name == orders[i - 1].name)
                {
                    spacingNum++;
                    if(ci.isgang4)
                    {
                        ci.y = orders[i - 2].y + slotheigt;
                    }
                    else if(orders[i - 1].isgang4)
                    {
                        ci.y = orders[i - 2].y - upSize.height * upS * 0.7;
                    }
                    else
                    {
                        ci.y = orders[i - 1].y - upSize.height * upS * 0.8;
                    }
                }
                else if(orders[i - 1].name == "standPri")
                {
                    ci.y = orders[i - 1].y - upSize.height * upS * 2;
                }
                else if(orders[i - 1].name == "gang0" || orders[i - 1].name == "gang1")
                {
                    ci.y = orders[i - 2].y - upSize.height * upS * 1.1;
                }
                else if(orders[i - 1].name == "mjhand_replay")
                {
                    ci.y = orders[i - 1].y - upSize.height * upS * 2;
                }
                else
                {
                    ci.y = orders[i - 1].y - upSize.height * upS * 1.1;
                }

                if(ci.name != orders[i - 1].name){
                    spacingNum = 0;
                }
                if( orders[i].name == "chi"  ||orders[i].name == "peng" ){  
                    if(spacingNum >= 3 ){
                        ci.y -= slotheigt;
                        spacingNum = 0;
                    }
                } 

                ci.zIndex = orders[i - 1].zIndex + 1;//调整每张牌的层级
            }
            else
            {
                ci.y = start.y - upSize.height * upS * 0.2;
                ci.y += 10;
                ci.zIndex = start.zIndex;//第一张牌的层级
            }
        }
    }

    //其他家新摸的牌动作
    if(isNewCard)
    {
        if(off == 2)
        {
            var num = COMMON_UI.countMjHandNums(orders, 2);
            var newCard = null;
            orders[0].x = orders[0].x - upSize.width * upS *1;
            if(COMMON_UI3D.is3DUI())
            {
                newCard = orders[num - 1];
            }
            else
            {
                newCard = orders[0];
            }
            COMMON_UI.newCardShakAni(newCard, off);
        }
        else if(off == 1)
        {
            orders[0].y = orders[0].y + upSize.width * upS * 1;
            orders[0].zIndex = - 1;
            COMMON_UI.newCardShakAni(orders[0],off);
        }
        else if(off == 3 )
        {
            orders[orders.length - 1].y = orders[orders.length - 1].y - upSize.width * upS * 0.8;
            COMMON_UI.newCardShakAni(ci,off);
        }
    }
    //刷新手牌大小
    if(COMMON_UI3D.is3DUI()){
        COMMON_UI3D.set3DCardSprite(off);
    }
    else {
        //刷新手牌大小
        resetCardSize();
    }
    MjClient.playui.ShowAllTingTips();
};

// 判断吃碰杠胡的状态
PlayLayer_huaihuaMaJiang.prototype.EatVisibleCheck = function()
{
    isTouZi_huaihuaMJ = false;
    var eat = MjClient.playui.jsBind.eat;
    //sk 为啥要隐藏掉？   //因为一开始是不可见的，隐藏根节点 by sking
    MjClient.playui.jsBind.eat.changeui.changeuibg._node.visible = false;
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var leftCard = MjClient.majiang.getAllCardsTotal(tData) - tData.cardNext;
    var isQiShou = tData.isFirstPut;

    eat.chi0._node.visible = false;
    eat.chi1._node.visible = false;
    eat.chi2._node.visible = false;
    eat.peng._node.visible = false;
    eat.gang0._node.visible = false;
    eat.gang1._node.visible = false;
    eat.gang2._node.visible = false;
    eat.hu._node.visible = false;
    eat.guo._node.visible = false;
    eat.cancel._node.visible = false;
    eat.touzi._node.visible = false;

    var _bIsZiMo = false;


    var pl = sData.players[SelfUid() + ""];
    MjClient.gangCards = [];
    MjClient.eatpos = [];
    pl.isZiMoHu = false;
    pl.mustHu = false;
    var mj = MjClient.majiang;

    //吃碰杠胡node
    var vnode = [];

    if(
        pl.mjState == TableState.waitEat ||
        pl.mjState == TableState.waitPut &&
        tData.uids[tData.curPlayer] == SelfUid() || isQiShou)
    {

    }
    else
    {
        return;
    }

    //自摸
    if(tData.tState == TableState.waitPut && pl.mjState == TableState.waitPut)
    {
        if(IsTurnToMe() || isQiShou)
        {
            //检测补花
            var cduis=MjClient.playui.jsBind.down._node.children;
            for(var i=cduis.length-1;i>=0;i--)
            {
                if(cduis[i].name == "mjhand" && MjClient.majiang.isCardFlower(cduis[i].tag))
                {
                    var callback = function () {
                        PutOutCard(cduis[i], cduis[i].tag);
                    };
                    cduis[i].runAction(cc.sequence(cc.delayTime(0.3), cc.callFunc(callback)));
                    return;
                }
            }

            //骰
            if (pl.eatFlag & 16) {
                vnode.push(eat.touzi._node);
            }

            //杠
            var rtn = MjClient.majiang.canGang1(pl.mjpeng, pl.mjhand, pl.putCount);
            if (pl.isZiMoHu && rtn.length > 0) {// 自摸时需要删去rtn不能杠的
                MjClient.majiang.gangWhenZimo(pl.mjhand, rtn, tData.hunCard); 
            }
            cc.log("$$$$杠牌监测"+JSON.stringify(rtn));
            if(rtn.length > 0 && pl.isNew && IsTurnToMe() && !pl.clickPass)
            {
                MjClient.gangCards = rtn;
                if(pl.isTing && (pl.eatFlag & 16) != 16 && !tData.areaSelectMode.touhougang){

                }else{
                    vnode.push(eat.gang0._node);
                }
            }

            //胡
            if ((pl.isNew || isQiShou) && pl.eatFlag & 8) {
                pl.isZiMoHu = true;
                _bIsZiMo = true;
                vnode.push(eat.hu._node);
            }

            var canPass = !(pl.newCd == 71 && pl.isTing) && !(tData.gangAddCard && tData.gangAddCard.length != 0 && tData.gangAddCard[0] == 71)
            if(vnode.length > 0 && canPass)
            {
                //if(!_bIsZiMo) 
                    vnode.push(eat.guo._node);
                eat.ting._node.visible = false;
                eat.noTing._node.visible = false;
                isCheckedTing = false;
            }
        }
    }
    //别人点
    else if(tData.tState == TableState.waitEat)
    {
        cc.log("diao pao hu-=================================================pl.eatFlag = " + pl.eatFlag);
        if(!IsTurnToMe())
        {
            cc.log("diao pao hu-================================================= pl.mustHu  = " + pl.mustHu);
            //骰
            if (pl.eatFlag & 16) {
                vnode.push(eat.touzi._node);
            }
            if (pl.eatFlag & 4) {
                vnode.push(eat.gang0._node);
                MjClient.gangCards = [tData.lastPutCard];
                eat.gang0._node.visible = true;
                setCardSprite(eat.gang0.card1._node, MjClient.gangCards[0], 0);
            }
            if (pl.eatFlag & 2) {
                if(!pl.mustHu) vnode.push(eat.peng._node);
            }
            if (pl.eatFlag & 8) {
                vnode.push(eat.hu._node);
                if (tData.areaSelectMode["bihuType"]) {
                    pl.mustHu = true;
                }
            }
            //如果，有杠，碰，吃。 这出现过的UI. 否则玩家状态为等待
            if(vnode.length > 0)
            {
                if(!pl.mustHu) vnode.push(eat.guo._node);
                eat.ting._node.visible = false;
                eat.noTing._node.visible = false;
                isCheckedTing = false;
            }
            else
            {
                getUIPlayer(0).mjState = TableState.waitCard;
            }
        }
    }

    pl.clickPass = false;
    //吃碰杠胡过处理
    if(vnode.length > 0)
    {
        var btnImgs =
        {
            "peng": ["playing/gameTable/youxizhong-2_57.png", "playing/gameTable/youxizhong-2_07.png"],
            "gang0": ["playing/gameTable/youxizhong-2_55.png", "playing/gameTable/youxizhong-2_05.png"],
            "chi0": ["playing/gameTable/youxizhong-2_59.png", "playing/gameTable/youxizhong-2_09.png"],
        }

        for(var i = 0; i < vnode.length; i++)
        {
            vnode[i].visible = true;
            vnode[i].setTouchEnabled(true);
            
            if(vnode[i].getChildByName("card1"))
            {
                vnode[i].getChildByName("card1").visible = false;
            }

            if(vnode[i].getChildByName("bgground"))
            {
                vnode[i].getChildByName("bgground").visible = false;
            }

            if(vnode[i].getChildByName("bgimg"))
            {
                vnode[i].getChildByName("bgimg").visible = true;
            }

            var btnName = vnode[i].name;
            if(btnName == "peng" || btnName == "chi0" || btnName == "gang0")
            {
                vnode[i].loadTextureNormal(btnImgs[btnName][0]);
                // vnode[i].loadTexturePressed(btnImgs[btnName][1]);
            }

            if(i == 0)
            {
                var cardVal = 0;
                if(vnode[i].getChildByName("bgimg"))
                {
                    vnode[i].getChildByName("bgimg").visible = false;
                }

                if(btnName == "peng" || btnName == "chi0" || btnName == "gang0")
                {
                    vnode[i].loadTextureNormal(btnImgs[btnName][0]);
                    // vnode[i].loadTexturePressed(btnImgs[btnName][1]);
                }

                if(btnName == "peng")
                {
                    cardVal = tData.lastPutCard;
                }
                else if(btnName == "chi0")
                {
                    if(MjClient.eatpos.length == 1)
                    {
                        cardVal = tData.lastPutCard;
                    }
                }
                else if(btnName == "gang0")
                {
                    if(MjClient.gangCards.length == 1)
                    {
                        cardVal = MjClient.gangCards[0];
                    }
                }
                else if(btnName == "hu")
                {
                    if(IsTurnToMe())
                    {
                        cardVal = pl.mjhand[pl.mjhand.length - 1];
                    }
                    else
                    {
                        cardVal = tData.lastPutCard;
                    }
                }

                if(cardVal && cardVal > 0)
                {
                    setCardSprite(vnode[0].getChildByName("card1"), cardVal, 0);
                    vnode[0].getChildByName("card1").visible = true;
                }

                if(vnode[0].getChildByName("bgground"))
                {
                    vnode[0].getChildByName("bgground").zIndex = -1;
                    vnode[0].getChildByName("bgground").visible = true;
                }

                //屏蔽到 碰 ，杠 的显示牌 add by sking
                if(vnode[0].getChildByName("bgground"))
                {
                    vnode[0].getChildByName("bgground").visible = false;
                }
                if(vnode[i].getChildByName("card1"))
                {
                    vnode[i].getChildByName("card1").visible = false;
                }
                //end of 屏蔽 碰，杠的显示牌
            }

            if (MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType()) {
                setWgtLayout(vnode[i], [0, 0.18], [0.5, 0], [(1 - vnode.length) / 1.8 + i * 1.4, 1.8], false, false);
            }
            else {
                setWgtLayout(vnode[i], [0, 0.16], [0.5, 0], [(1 - vnode.length) / 1.8 + i * 1.4, 1.8], false, false);
            }
            // if(vnode[i].getName() == "hu" && MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ){ 
            //     setWgtLayout(vnode[i], [0, 0.185], [0.5, 0], [(1 - vnode.length) / 1.8 + i * 1.4, 1.6], false, false);  
            // }
        }
    }

    /* 吃碰杠胡等按钮的 iOS适配 */
    COMMON_UI.vnodeAdaptForiOS(vnode);

    if(eat.hu._node.visible)
    {
        MjClient.playui._btnPutCard.visible = false;
    }

    MjClient.playui.ShowAllTingTips();
}

PlayLayer_huaihuaMaJiang.prototype.ShowAllTingTips = function ()
{
    if(!IsTurnToMe()) return;
    var downNode = MjClient.playui._downNode;
    var children = downNode.children;
    var pl = getUIPlayer(0);
    if (pl.mjState === TableState.roundFinish) return;
    for (var i = 0; i < children.length; i++)
    {
        if(children[i].name == "mjhand")
        {
            var temp_tag = children[i].tag;

            var tingCards = MjClient.majiang.getCheckTingHuCards(temp_tag, pl.mjhand, true);
            var card = children[i];
            if(card.getChildByName("ting_tips")) card.removeChildByName("ting_tips");
            if(Object.keys(tingCards).length > 0)
            {
                var ting_tips = new ccui.ImageView("playing/MJ/ting_tips.png");
                ting_tips.setName("ting_tips");
                var cardSize = card.getContentSize();
                ting_tips.setPosition(cc.p(cardSize.width / 2, cardSize.height *1.1));
                card.addChild(ting_tips, 10);
            }
        }
    }
};


//剥离托管层
PlayLayer_huaihuaMaJiang.prototype.detachTuoGuanLayer = function(node, jsBind){
    var tuoGuanLayer = new cc.Layer();
    tuoGuanLayer.setName("tuoGuanLayer");
    tuoGuanLayer.setLocalZOrder(100);
    node.removeFromParent(true);
    var listener = cc.EventListener.create({
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        swallowTouches: true,
        onTouchBegan: function(){
            return tuoGuanLayer.isVisible();
        },
    });
    cc.eventManager.addListener(listener, tuoGuanLayer);
    tuoGuanLayer.addChild(node);


    var btnTuoGuan = node.getChildByName("btn_tuoguan");
    btnTuoGuan.removeFromParent(true);
    var file = btnTuoGuan.getVirtualRenderer().getTexture().getPath();
    var pos  = btnTuoGuan.getPosition();
    var scale = btnTuoGuan.getScale();
    var btn = new ccui.Button(file, "", "");
    btn.setName("btn_tuoguan");
    btn.setPosition(pos);
    btn.setScale(scale);
    node.addChild(btn);

    this.addChild(tuoGuanLayer);
    this.tuoGuanLayer = tuoGuanLayer;
    BindUiAndLogic(node, jsBind);
};

//获取托管层层级，用于将所有其他层放在托管层下面
PlayLayer_huaihuaMaJiang.prototype.getTuoGuanLayerZIndex = function(node){
    return this.getChildByName("tuoGuanLayer").getLocalZOrder();
};