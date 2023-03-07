/**
 * Created by Administrator on 2017/3/9.
 */
var actionZindex = 1000;
//向服务器发送 过消息
MjClient.MJPass2NetForhongtongwangpai = function()
{
   // console.log(">>>>>>>>>普通  过 <<<<<<<<");
    cc.log("====================MJPass2NetForhongtongwangpai======pass=====");
    var sData = MjClient.data.sData;
    var tData = sData.tData;

    if(IsTurnToMe() && tData.tState == TableState.waitPut)
    {
        var eat = MjClient.playui.jsBind.eat;
        var msg = "确认过";
        if(eat.gang0._node.visible)
        {
            msg += " 杠 ";
        }

        if(eat.hu._node.visible)
        {
            msg += " 胡 ";
        }

        //cc.log("-- = getUIPlayer(0).isTing = " + getUIPlayer(0).isTing)
        if(eat.ting._node.visible)
        {
            msg = "你确认要放弃听牌";
            if(eat.gang0._node.visible)
            {
                msg = "确认过";
                msg += " 听 ";
                msg += " 杠 ";
            }
        }


        msg = msg + "吗?"

        MjClient.showMsg(msg, function()
        {
            //cc.log("==========1=============");
            eat.gang0._node.visible = false;
            eat.hu._node.visible = false;
            eat.guo._node.visible = false;
            eat.ting._node.visible = false;
            eat.cancel._node.visible = false;
            MJPassConfirmToServer();
        }, function() {}, "1");
    }
    else
    {
        if(MjClient.playui.jsBind.eat.hu._node.visible)
        {
            MjClient.showMsg("确认不胡吗?", MJPassConfirmToServer, function() {}, "1");
        }
        else
        {
            MJPassConfirmToServer();
        }
    }
}


// 这个没看懂干嘛的
// off 是四个位置，根据off 显示四个位置的信息 by sking
function SetUserVisible_hongtongwangpai(node, off)
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
        cc.log("====================off======================" + off);
        head.visible = true;
        name.visible = true;
        coin.visible = true;
        offline.visible = true;
        coin.visible = true;
        name_bg.visible = true;
        score_bg.visible = true;
        name.setScale(1.5);
        coin.setScale(1.2);
        MjClient.loadWxHead(pl.info.uid, pl.info.headimgurl);
        setUserOffline(node, off);
        InitUserHandUI_hongtongwangpai(node, off);
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


//处理出牌,放一张牌，打牌动作
function DealMJPut_hongtongwangpai(node, msg, off, outNum)
{
    DealMJPut_shanXiApp(node, msg, off, outNum);
}


function InitUserHandUI_hongtongwangpai(node, off)
{
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var pl = getUIPlayer(off);
    if(!pl)
    {
        return;
    }
    cc.log("房间数据---------",JSON.stringify(tData));
    //初始化玩家金币和名称
    InitUserCoinAndName_jinzhong(node, off);
    setAreaTypeInfo(true);
    //setPlayerRoundDir(off);
    // if(vnPos.indexOf(off) == -1)
    // {
    //     vnPos.push(off);
    // }
    var eat = MjClient.playui.jsBind.eat;
    cc.log("pl数据————————————InitUserHandUI",JSON.stringify(pl));
    if (MjClient.rePlayVideo == -1)
    {
        if (tData.tState == TableState.waitWang || pl.hunCard == -1) 
        {
            if (tData.areaSelectMode.wanfa == "duiwangdajiangbao") {
             cc.log("对王大将报");
             MjClient.playui._queding.visible=true;
             MjClient.playui._selecttip.visible=true;
            } 
        }
    }
    else {
            MjClient.playui._queding.visible=false;
            MjClient.playui._selecttip.visible=false;
        }

 
    if(
        tData.tState != TableState.waitPut &&
        tData.tState != TableState.waitEat &&
        tData.tState != TableState.waitCard &&
        tData.tState != TableState.waitWang
    )
    {
        return;
    }

    if (tData.areaSelectMode.wanfa == "dajiangwangheifengbao" 
        || tData.areaSelectMode.wanfa == "duiwangdajiangbao" )
     {
        setHunNodeVisible(false);
    }else
    {
        setHunNodeVisible(true);

    }
    
    //添加碰
    for(var i = 0; i < pl.mjpeng.length; i++)
    {
        var idx = tData.uids.indexOf(pl.info.uid);
        var offIdx = (pl.pengchigang.peng[i].pos - idx + 4) % 4 - 1;//表示被碰的人和pl之间隔着几个人，如果是pl碰下家，则offIdx=0，pl碰上家，则offIdex=2
        var cdui = null;
        for(var j = 0; j < 3; j++)
        {
            if( (j % 3 == 2 - offIdx && off % 3 == 0) || (j % 3 == offIdx && off % 3 != 0) )
            {
                cdui = getNewCard(node, "up", "peng", pl.mjpeng[i], off, "heng", "heng");
                setCardArrow(cdui, offIdx, off);
            }
            else
            {
                cdui = getNewCard(node, "up", "peng", pl.mjpeng[i], off);
            }

            if(j == 2)
            {
                cdui.ispeng3 = true;
            }
        }
    }

    //添加明杠
    var bIsPengGang = false;
    for(var i = 0; i < pl.mjgang0.length; i++)
    {
        var idx = tData.uids.indexOf(pl.info.uid);

        var offIdx = null;
        for (var j=0; j<pl.pengchigang.gang.length; j++)
        {
            if (pl.pengchigang.gang[j].card == pl.mjgang0[i])
            {
                offIdx = getOffByIndex(pl.pengchigang.gang[j].pos, idx) - 1;
                break;
            }
        }
        if (offIdx == null)
        {
            for (var j=0; j<pl.pengchigang.pgang.length; j++)
            {
                if (pl.pengchigang.pgang[j].card == pl.mjgang0[i])
                {
                    offIdx = getOffByIndex(pl.pengchigang.pgang[j].pos, idx) - 1;
                    bIsPengGang = true;
                    break;
                }
            }
        }
        if (offIdx == null)
        {
            cc.log("InitUserHandUI:offIdx == null!!!!");
            offIdx = 0;
        }

        var setCardArrowOnGang4 = false;
        for(var j = 0; j < 4; j++)
        {
            if(j < 3)
            {
                if( (j % 3 == 2 - offIdx && off % 3 == 0) || (j % 3 == offIdx && off % 3 != 0) )
                {
                    var cdui = getNewCard(node, "up", "gang0", pl.mjgang0[i], off, "heng", "heng");
                    if(bIsPengGang) offIdx = 3;
                    setCardArrow(cdui, offIdx, off);
                    if (j==1)
                    {
                        setCardArrowOnGang4 = true;
                    }
                }
                else
                {
                    getNewCard(node, "up", "gang0", pl.mjgang0[i], off);
                }
            }
            else
            {
                var cdui = getNewCard(node, "up", "gang0", pl.mjgang0[i], off, "isgang4");//最后一张牌放上面
                cdui.tag = pl.mjgang0[i];
                if (setCardArrowOnGang4)
                {
                    if(bIsPengGang) offIdx = 3;
                    setCardArrow(cdui, offIdx, off);
                }
            }
        }
    }


    //添加暗杠
    cc.log("------------添加暗杠-----------" + pl.mjgang1);
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
            setCardArrow(cdui, 2, off);
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

        DealMJPut_hongtongwangpai(node, msg, off, i);
    }

    
    //添加手牌
    if(MjClient.rePlayVideo == -1)//表示正常游戏
    {
        if(pl.mjhand && off === 0)
        {
            for(var i = 0; i < pl.mjhand.length; i++)
            {
                 getNewCard(node, "stand", "mjhand", pl.mjhand[i], off);
            }
        }
        else if (pl.mjhand && pl.mjState === TableState.roundFinish)
        {
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

            var count = 0;
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

function initFlower_hongtongwangpai() {
    initFlower(false, false);
}


var PlayLayer_hongtongwangpai = cc.Layer.extend({
    jsBind: {
        _event: {
            mjhand: function() {
                if(MjClient.endoneui != null)
                {
                    cc.log("=======mjhand====endoneui====" + typeof (MjClient.endoneui) );
                    MjClient.endoneui.removeFromParent(true);
                    MjClient.endoneui = null;
                }
                MjClient.yingkouCache = -1;
                var sData = MjClient.data.sData;
                var tData = sData.tData;
                resetFlowerNum(this);
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
                if (ipmsg.length > 0 && !tData.matchId) {
                    //if(cc.sys.OS_WINDOWS != cc.sys.os)
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
                if (msg.showEnd) this.addChild(new GameOverLayer(),500);
                else
                    MjClient.Scene.addChild(new StopRoomView());
            },
            roundEnd: function() {
                if (MjClient.getAppType() == MjClient.APP_TYPE.TXLINFENMJ)
                {
                    //TODO  明牌
                    DealRoundEnd_LF(this);
                }else{
                    var self = this;
                    function delayExe()
                    {
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;
                        resetEatActionAnim();
                        if (sData.tData.roundNum <= 0) 
                        {
                            if(!tData.matchId){
                                self.addChild(new GameOverLayer(),500);
                            }else{
                                self.runAction(cc.sequence(cc.delayTime(3),cc.callFunc(function(){
                                    self.addChild(new GameOverLayer(),500);
                                })))
                            }
                        }
                        self.addChild(new EndOneView_hongtongwangpai(),500);
                    }
                    //hideCurrentTingNum();
                    if(MjClient.rePlayVideo === -1)    // 正常游戏
                    {
                        this.runAction(cc.sequence(cc.delayTime(0.1),cc.callFunc(COMMON_UI.showMjhandBeforeEndOne),cc.delayTime(1.7),cc.callFunc(delayExe)));
                    }
                    else
                    {
                        this.runAction(cc.sequence(cc.DelayTime(0.2),cc.callFunc(delayExe)));
                    }
                }
            },
            moveHead: function() {
                postEvent("returnPlayerLayer");
                tableStartHeadMoveAction(this);
                var tData = MjClient.data.sData.tData;
                // if(tData.areaSelectMode.flowerType == WithFlowerType.noFlower)
                // {
                //     MjClient.playui._btnFlower.visible = false;
                // }
                // else
                // {
                //     MjClient.playui._btnFlower.visible = true;
                // }


                initFlower_hongtongwangpai();
            },
            initSceneData: function() {
                reConectHeadLayout(this);
                CheckRoomUiDelete();
            },
            onlinePlayer: function(msg) {
                cc.log('88383838383+'+JSON.stringify(this));
                //reConectHeadLayout(this);
                if(msg.uid == SelfUid()){
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
                setWgtLayout(this,[0.1, 0.1], [0.205, 0.485], [1.79, 1.0]);
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
                    this.getParent().getChildByName("roundnumText").visible = true;
                    this.getParent().getChildByName("Text").visible = true;
                    this.ignoreContentAdaptWithSize(true);
                },
                _text: function() {
                    var tData = MjClient.data.sData.tData;
                    if(tData)
                    {
                        var _currentRoundIdx =  parseInt(tData.roundAll - tData.roundNum) + 1;

                        cc.log("tData.roundAll = " + tData.roundAll);
                        cc.log("tData.roundNum = " + tData.roundNum);
                        cc.log("_currentRoundIdx = " + _currentRoundIdx);

                        if(_currentRoundIdx > tData.roundAll)
                        {
                            _currentRoundIdx = 1;
                        }
                        var _roundText = _currentRoundIdx + "/" + tData.roundAll ;
                    }
                     return (_roundText);
                },
                _event: {
                    mjhand: function() {
                        var tData = MjClient.data.sData.tData;
                        if(tData)
                        {
                            var _currentRoundIdx =  parseInt(tData.roundAll - tData.roundNum) + 1;

                            cc.log("tData.roundAll = " + tData.roundAll);
                            cc.log("tData.roundNum = " + tData.roundNum);
                            cc.log("_currentRoundIdx = " + _currentRoundIdx);

                            if(_currentRoundIdx > tData.roundAll)
                            {
                                _currentRoundIdx = 1;
                            }
                            var _roundText = _currentRoundIdx + "/" + tData.roundAll ;
                        }
                        this.setString(_roundText);
                    }
                }
            }
        },
        cardNumImg: {
            _run:function () {
                MjClient.cardNumImgNode = this;
                setWgtLayout(this,[0.1, 0.1], [0.435, 0.485], [1.79, 1.0]);
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
                    if (tData) return MjClient.majiang.getAllCardsTotal() - tData.cardNext;
                },
                _event: {
                    waitPut: function() {
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;
                        if (tData) this.setString(MjClient.majiang.getAllCardsTotal() - tData.cardNext);
                        cc.log(MjClient.majiang.getAllCardsTotal() + "-----------------waitPut------------------" + tData.cardNext);
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
                [0.09, 0.09],
                [0.5, 0.408],
                [0, 1.0]
            ],
            _run:function()
            {
                var tData = MjClient.data.sData.tData;
                this.ignoreContentAdaptWithSize(true);
                this.setString(getPlayingRoomInfo(0));
                showPlayUI_roundInfo(this.getString(),tData.tableid);

                var tData = MjClient.data.sData.tData;
                if(tData.matchId && tData.matchInfo){
                    if(tData.rank){
                        showPlayUI_matchInfo("排名："+tData.rank+"/"+tData.matchInfo.userCount+"\n前"+tData.matchInfo.jingjiCount+"名晋级");
                    }else {
                        showPlayUI_matchInfo("排名："+tData.matchInfo.userCount+"/"+tData.matchInfo.userCount+"\n前"+tData.matchInfo.jingjiCount+"名晋级");
                    }
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
                    text.setFontName(MjClient.fzcyfont);
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
                    var settringLayer = new SettingView();
                    settringLayer.setName("PlayLayerClick");
                    MjClient.Scene.addChild(settringLayer);
                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Shezhi", {uid:SelfUid(),gameType:MjClient.gameType});
                }
            },
            Button_1: {
                _visible : true,
                _click: function() {
                    MjClient.openWeb({url:MjClient.GAME_TYPE.HONG_TONG_WANG_PAI,help:true});
                }
            },
            hunPai:{
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
                            //this.visible = false;
                        }
                    },
                },
                baidaImg: {
                    _run:function()
                    {
                        //baidaOject = this;
                        this.setVisible(false);
                    },
                    _event: {
                        mjhand:function()
                        {
                            this.setScale(1);
                            this.setPosition(-296,-280);
                            var tData =MjClient.data.sData.tData;
                            var HuncardMsg = MjClient.majiang.getHunCard(getUIPlayer(0), tData, getUIPlayer(0).mjhand);                           
                            this.visible = false;
                            cc.log("-------------------mjhand-----------------HuncardMsg = " + HuncardMsg);
                            if(HuncardMsg && HuncardMsg != -1)
                            {
                                this.visible = true;
                                var func = cc.callFunc(function(){
                                    playEffect("hunCardFly");
                                });
                                setCardSprite(this, parseInt(HuncardMsg), 4);
                                var imgMing = new ccui.ImageView();
                                //imgMing.loadTexture("playing/MJ/wangzi.png");
                                imgMing.setPosition(this.getContentSize().width/2,this.getContentSize().height/2);
                                this.addChild(imgMing);
                                this.runAction(cc.sequence(cc.delayTime(1),
                                    cc.spawn(cc.scaleTo(0.6,0.5),cc.moveTo(0.6,0,1.86)).easing(cc.easeQuinticActionOut()),
                                    func));
                            }
                            else
                            {
                                this.getParent().visible = false;
                            }
                        },
                        initSceneData:function()
                        {
                            this.visible = true;
                            var tData =MjClient.data.sData.tData;
                            var HuncardMsg = MjClient.majiang.getHunCard(getUIPlayer(0), tData, getUIPlayer(0).mjhand); 
                            cc.log("==============当前耗子======HuncardMsg = " + HuncardMsg);
                            if(HuncardMsg && HuncardMsg != -1)
                            {
                                setCardSprite(this, parseInt(HuncardMsg), 4);
                                var imgMing = new ccui.ImageView();
                                //imgMing.loadTexture("playing/MJ/wangzi.png");
                                imgMing.setPosition(this.getContentSize().width/2,this.getContentSize().height/2);
                                this.addChild(imgMing,100);
                            }
                        },
                        roundEnd:function (eD) {
                            //this.visible = false;
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
                            //this.visible = false;
                        }
                    },
                },
                _event:{
                    clearCardUI: function(eD) {
                        this.visible = false;
                    },
                    mjhand:function()
                    {
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;
                        var HuncardMsg = MjClient.majiang.getHunCard(getUIPlayer(0), tData, getUIPlayer(0).mjhand);
                        if(HuncardMsg && HuncardMsg != -1)
                        {
                            cc.log("tData.areaSelectMode.wanfa " ,tData.areaSelectMode.wanfa,"mjhand");
                            if (tData.areaSelectMode.wanfa != "dajiangwangheifengbao" &&
                                tData.areaSelectMode.wanfa != "duiwangdajiangbao")
                            {
                                this.visible = true;
                            }else
                            {
                                this.visible = false;
                            }
                        }
                        else
                        {
                            this.visible = false;
                        }
                    },
                    initSceneData:function()
                    {
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;
                        cc.log("tData.areaSelectMode.wanfa " ,tData.areaSelectMode.wanfa,"initSceneData");
                        if (tData.areaSelectMode.wanfa != "dajiangwangheifengbao" &&
                            tData.areaSelectMode.wanfa != "duiwangdajiangbao")
                        {
                            this.visible = true;
                        }
                        else
                        {
                            cc.log("visible false");
                            this.visible = false;
                        }
                        

                        cc.log(" tData.tState  ------------sking = " + tData.tState );
                        if(tData.tState != TableState.waitPut &&
                            tData.tState != TableState.waitEat &&
                            tData.tState != TableState.waitCard &&
                            tData.tState != TableState.waitWang
                        )
                        {
                            cc.log(" tData.tState  ------------sking = --- false");
                            this.visible = false;
                        }else{

                            var tData = MjClient.data.sData.tData;
                            var HuncardMsg = MjClient.majiang.getHunCard(getUIPlayer(0), tData, getUIPlayer(0).mjhand);
                            if(HuncardMsg && HuncardMsg != -1)
                            {
                                cc.log("tData.areaSelectMode.wanfa " ,tData.areaSelectMode.wanfa,tData.tState);
                                if (tData.areaSelectMode.wanfa != "dajiangwangheifengbao" &&
                                    tData.areaSelectMode.wanfa != "duiwangdajiangbao")
                                {
                                    this.visible = true;
                                }
                                else
                                {
                                    this.visible = false;
                                }
                            }
                            else
                            {
                                this.visible = false;
                            }
                        }
                    }
                }
            },
        },
        // arrowbk: {
        //     _layout: [
        //         [0.17, 0.17],
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
        //         waitPut: function(eD) {
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
        // wait: {
        //     getRoomNum: {
        //         _run:function(){
        //             setWgtLayout(this, [0.18, 0.18],[0.4, 0.5],[0, 0]);
        //         },
        //         _visible:function()
        //         {
        //             return !MjClient.remoteCfg.guestLogin;
        //         },
        //         _click: function() {
        //             getPlayingRoomInfo(1);
        //         }
        //     },
        //     wxinvite: {
        //         _layout: [
        //             [0.18, 0.18],
        //             [0.6, 0.5],
        //             [0, 0]
        //         ],
        //         _click: function() {
        //             getPlayingRoomInfo(2);
        //         },
        //         _visible:function()
        //         {
        //             return !MjClient.remoteCfg.guestLogin;
        //         }
        //     },
        //     delroom: {
        //         _run:function(){
        //             setWgtLayout(this, [0.11, 0.11],[0.05, 0.45],[0, 0]);
        //         },
        //         _click: function() {
        //             cc.log("------delroom------");
        //             MjClient.delRoom(true);
        //         }
        //     },
        //     backHomebtn: {
        //         _run:function(){
        //             setWgtLayout(this, [0.11, 0.11],[0.05, 0.6],[0, 0]);
        //         },
        //         _click: function(btn) {
        //             var sData = MjClient.data.sData;
        //             if (sData) {
        //                 if (IsRoomCreator()) {
        //                     MjClient.showMsg("返回大厅房间仍然保留\n赶快去邀请好友吧",
        //                         function() {
        //                             MjClient.leaveGame();
        //                         },
        //                         function() {});
        //                 } else {
        //                     MjClient.showMsg("确定要退出房间吗？",
        //                         function() {
        //                             MjClient.leaveGame();
        //                         },
        //                         function() {});
        //                 }
        //             }
        //
        //         },
        //         _event: {
        //             returnPlayerLayer: function() {
        //                 MjClient.playui.visible = true;
        //             },
        //             initSceneData: function(eD) {
        //                 this.visible = IsInviteVisible();
        //             },
        //             addPlayer: function(eD) {
        //                 this.visible = IsInviteVisible();
        //             },
        //             removePlayer: function(eD) {
        //                 this.visible = IsInviteVisible();
        //             }
        //         }
        //     },
        //     _event: {
        //         initSceneData: function(eD) {
        //             this.visible = IsInviteVisible();
        //         },
        //         addPlayer: function(eD) {
        //             console.log(">>>>>> play add player >>>>");
        //             this.visible = IsInviteVisible();
        //         },
        //         removePlayer: function(eD) {
        //             this.visible = IsInviteVisible();
        //         }
        //     }
        // },
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
                    if(IsTurnToMe())
                    {
                        this.visible = true;
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
                roundEnd:function()
                {
                    this.visible = false;
                },
                waitPut: function() {
                    var pl = getUIPlayer(0);
                    var eat = MjClient.playui.jsBind.eat;
                    if (IsTurnToMe() && pl.isTing && !eat.hu._node.visible && !eat.gang0._node.visible && !eat.gang1._node.visible && !eat.gang2._node.visible) {
                        cc.log("*********自动出牌*********");
                        this.runAction(cc.sequence(cc.delayTime(0.5),
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
                }
            }
        },//end of add by sking
        selecttip:
        {
            _visible:false,
            _layout:[
                [0,0.06],
                [0.5,0.62],
                [0,2.5]
            ],
        },
        //top
        select1:
        {
            _visible:false,
            _layout:[
                [0,0.06],
                [0.5,0.7],
                [0,2.5]
            ],
        },
        //left
        select2:
        {
            _visible:false,
            _layout:[
                [0,0.06],
                [0.2,0.42],
                [0,2.5]
            ]
        },
        //right
        select3:
        {
            _visible:false,
            _layout:[
                [0,0.06],
                [0.8,0.42],
                [0,2.5]
            ]
        },
        queding_btn:
        {
            _visible: false,
            _layout: [
                    [0, 0.1],
                    [0.5, 0.1],
                    [0, 2.5]
                    ],
            _click:function(btn)
            {
                var downNode = MjClient.playui._downNode;
                var standUI = downNode.getChildByName("stand");
                var children = downNode.children;
                var tData = MjClient.data.sData.tData;
                MjClient.unselecedWangCards = {};
                var pl = getUIPlayer(0);
                
                var isfind = false;
                 
                for(var i = 0; i < children.length; i++)
                {
                    
                    if(children[i].name == "mjhand")
                    {  
                        if(children[i].y > standUI.y + 10)
                        {
                            isfind = true;
                            break;
                        }
                    }
                }

                if (isfind) {
                    MjClient.playui._queding.visible=false;
                    MjClient.playui._selecttip.visible=false;
                    //MjClient.playui.jsBind.eat.ting._node.visible = true;  
                    MjClient.gamenet.request("pkroom.handler.tableMsg", {
                            cmd: "MJSelectCard",
                            card: children[i].tag
                        }
                    );
                    pl.hunCard = children[i].tag;
                }
                else{
                    var haswang = false;
                    for(var i = 0; i < children.length; i++)
                    {                        
                        if(children[i].name == "mjhand")
                        {  
                            if(children[i].isTouchEnabled())
                            {
                                haswang = true;
                                break;
                            } 
                        }
                    }
                    if (!haswang) 
                    {
                        MjClient.playui._queding.visible=false;
                        MjClient.playui._selecttip.visible=false; 
                        MjClient.gamenet.request("pkroom.handler.tableMsg", {
                        cmd: "MJSelectCard",
                        card: 0
                        }
                    ); 
                      pl.hunCard = 0;  
                    } 
                }
                //监测
                //MjClient.playui.EatVisibleCheck();
            }
        },
        //发
        yingkou1:
        {
            _visible: false,
            _layout: [
                    [0, 0.15],
                    [0.2, 0.01],
                    [0, 2.2]
                    ],
            _click:function(btn)
            {
                //隐藏硬扣按钮
                MjClient.playui._yingkou1.visible=false;
                MjClient.playui._yingkou2.visible=false;
                MjClient.playui._yingkou3.visible=false;
                MjClient.playui._buyingkou.visible=false;
                MjClient.playui.jsBind.eat.cancel._node.visible = true;
                MjClient.yingkouCache = 81;

                refreshhand(MjClient.yingkouCache);
            },
            _event:{
                initSceneData:function()
                {
                    this.visible = false;
                    //var pl = getUIPlayer(0);
/*                    if (pl && pl.yingkou)
                    pl.yingkou = -1;*/
                }
            }
        },
        //中
        yingkou2:
        {
            _visible: false,
            _layout: [
                    [0, 0.15],
                    [0.41, 0.01],
                    [0, 2.2]
                    ],
            _click:function(btn)
            {
                MjClient.playui._yingkou1.visible=false;
                MjClient.playui._yingkou2.visible=false;
                MjClient.playui._yingkou3.visible=false;
                MjClient.playui._buyingkou.visible=false;
                MjClient.playui.jsBind.eat.cancel._node.visible = true;
                MjClient.yingkouCache = 71;

                refreshhand(MjClient.yingkouCache);
            },
            _event:{
                initSceneData:function()
                {
                    this.visible = false;
/*                    var pl = getUIPlayer(0);
                    if (pl && pl.yingkou)
                    pl.yingkou = -1;   */
                }
            }
        },
        //白
        yingkou3:
        {
            _visible: false,
            _layout: [
                    [0, 0.15],
                    [0.62, 0.01],
                    [0, 2.2]
                    ],
            _click:function(btn)
            {
                MjClient.playui._yingkou1.visible=false;
                MjClient.playui._yingkou2.visible=false;
                MjClient.playui._yingkou3.visible=false;
                MjClient.playui._buyingkou.visible=false;
                MjClient.playui.jsBind.eat.cancel._node.visible = true;
                MjClient.yingkouCache = 91;

                refreshhand(MjClient.yingkouCache);
            },
            _event:{
                initSceneData:function()
                {
                    this.visible = false;
/*                    var pl = getUIPlayer(0);
                    if (pl && pl.yingkou)
                    pl.yingkou = -1; */  
                }
            }
        },  
        buyingkou:
        {
            _visible: false,
            _layout: [
                    [0, 0.15],
                    [0.82, 0.01],
                    [0, 2.2]
                    ],
            _click:function(btn)
            {

                //ting    pl.yingkou == -1  Object.keys(res).length > 0
                MjClient.playui._yingkou1.visible=false;
                MjClient.playui._yingkou2.visible=false;
                MjClient.playui._yingkou3.visible=false;
                MjClient.playui._buyingkou.visible=false;
                MjClient.playui.jsBind.eat.cancel._node.visible = true;
                MjClient.yingkouCache = 0;

                var pl = getUIPlayer(0);

                var tData = MjClient.data.sData.tData;
                

                var downNode = MjClient.playui._downNode;
                var children = downNode.children;
                var tData = MjClient.data.sData.tData;  
                for (var i = 0; i < children.length; i++) {
                    if (children[i].name == "mjhand") 
                    {
                        children[i].setTouchEnabled(true);
                    }
                }
                MjClient.playui.CardLayoutRestore(MjClient.playui._downNode, 0);  

                pl.yingkou = 0;
                var currentCard = CurrentPutCardMsg();
                var copyhand = pl.mjhand.slice();
                var index = copyhand.indexOf(currentCard);//排除当前选择的一张牌
                copyhand.splice(index,1);
                //cc.log("???",index,copyhand)
                var tingCards = MjClient.majiang.calTingSet(copyhand, null, pl, tData);
                //var tingCards = getCheckTingHuCards(currentCard,pl.mjhand);
                setCurrentTingNum(tingCards);                             
            },
            _event:{
                initSceneData:function()
                {
                    this.visible = false;
/*                    var pl = getUIPlayer(0);
                    if (pl && pl.yingkou)
                    pl.yingkou = -1; */  
                }
            }
        },
        eat: {

            chi0: {
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
                    if (eT == 2) MJChiCardchange(btn.tag);
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
                        eat.hu._node.visible = false;
                        MjClient.playui._btnPutCard.visible = true;
                        MjClient.clickTing = true;
                        MjClient.playui.CardLayoutRestore(MjClient.playui._downNode, 0);

                        var downNode = MjClient.playui._downNode;
                        var standUI = downNode.getChildByName("stand");
                        var children = downNode.children;
                        
                        /*
                         设置当前听牌的张数
                         */
                        var pl = getUIPlayer(0);
                        var tData = MjClient.data.sData.tData;
                        var res = MjClient.majiang.getYingkouData(pl,tData);
                        cc.log("pl      ++++++++",JSON.stringify(pl));
                        cc.log("tData      ++++++++",JSON.stringify(tData));
                        cc.log("res  data ===========",JSON.stringify(res));
                        cc.log("硬扣===========",pl.yingkou);
                        if (Object.keys(res).length > 0)
                        {
                            if(res[91])
                            {
                                MjClient.playui.jsBind.eat.cancel._node.visible = false;
                                MjClient.playui._yingkou3.visible=true;
                                MjClient.playui._buyingkou.visible = true;

                            }
                            if (res[71])
                            {
                                MjClient.playui.jsBind.eat.cancel._node.visible = false;
                                MjClient.playui._yingkou2.visible = true;
                                MjClient.playui._buyingkou.visible = true;

                            }
                            if (res[81])
                            {
                                MjClient.playui.jsBind.eat.cancel._node.visible = false;
                                MjClient.playui._yingkou1.visible = true;
                                MjClient.playui._buyingkou.visible = true;
                            }

                            for (var i = 0; i <children.length; i++) {
                                if (children[i].name == "mjhand")
                                {
                                    children[i].setTouchEnabled(false);
                                    if (children[i].y > standUI.y) 
                                    {
                                        children[i].y = standUI.y;
                                    }
                                }
                            }
                        }
                        else
                        {
                            var currentCard = CurrentPutCardMsg();
                            var copyhand = pl.mjhand.slice();
                            var index = copyhand.indexOf(currentCard);//排除当前选择的一张牌
                            copyhand.splice(index,1);
                            //cc.log("???",index,copyhand)
                            var tingCards = MjClient.majiang.calTingSet(copyhand, null, pl, tData);
                            //var tingCards = getCheckTingHuCards(currentCard,pl.mjhand);
                            setCurrentTingNum(tingCards);
                             
                        }                        
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
                    if (eT == 2) MJPengToServer();
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
                card1: {},
                _touch: function(btn, eT) {
                    if (eT == 2) MJGangCardchange(btn.tag);
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
                    if (eT == 2) MJGangCardchange(btn.tag);
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
                    if (eT == 2) MJGangCardchange(btn.tag);
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
                        MjClient.MJPass2NetForhongtongwangpai();
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
                    if (eT == 2) MJHuToServer();
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
                        var pl = getUIPlayer(0);
                        if (pl.yingkou)
                        {
                            delete pl.yingkou;
                        }
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
                            if (et == 2)
                                MJGangToServer(btn.tag);
                        };       
                    },
                    guobg: {
                        guo: {
                            _touch: function(btn, eT) {
                                if (eT == 2) MjClient.MJPass2NetForhongtongwangpai();
                            }
                        },
                        fanhui: {
                            _touch: function(btn, et) {
                                if (et == 2) {
                                    btn.getParent().getParent().visible = false;
                                    MjClient.playui.EatVisibleCheck();
                                }
                            }
                        }
                    }

                }
            },
            _event: {
                clearCardUI: function() {
                    //add by sking
                    cc.log("ting yu no ting hide --------by sking");
                    MjClient.playui.EatVisibleCheck();
                    hideTingBtn();
                },
                MJPass: function(eD) {
                    console.log("HHH :，MJPass------");
                    setSkipHuState();
                    setSkipPengState(); // 开启 过碰 机制
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
                MJPut: function(eD) {
                    console.log("HHH :，MJPut------");
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
                    function delayExe()
                    {
                        MjClient.playui.EatVisibleCheck();
                    }
                    this.runAction(cc.sequence(cc.delayTime(0.1),cc.callFunc(delayExe)));
                }
            }
        },
        chat_btn: {
            _layout: [
                [0.08, 0.08],
                [0.95, 0.1],
                [0, 3.2]
            ],
            _click: function() {
                var chatlayer = new ChatLayer();
                MjClient.Scene.addChild(chatlayer);
            }
        },
        voice_btn: {
            _layout: [
                [0.08, 0.08],
                [0.95, 0.2],
                [0, 3.2]
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
        gps_btn: {
            _layout: [
                [0.08, 0.08],
                [0.95, 0.3],
                [0, 3.2]
            ],
            _run: function() {
                if(MjClient.data.sData.tData.maxPlayer == 2)
                {
                    this.visible = false;
                }
            },
            _click: function() {
                if(MjClient.data.sData.tData.maxPlayer == 3){
                    MjClient.Scene.addChild(new showDistance3PlayerLayer());
                }else if(MjClient.data.sData.tData.maxPlayer == 4){
                    MjClient.Scene.addChild(new showDistanceLayer());
                }
                MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Dingwei", {uid: SelfUid(),gameType:MjClient.gameType});
            }
        },
        hua_btn: {
            _layout: [
                [0.08, 0.08],
                [0.95, 0.4],
                [0, 3.2]
            ],
            _run: function() {
                this.visible = false;
                this.opacity = 255;
                var tData = MjClient.data.sData.tData;
                if(tData.areaSelectMode.flowerType == WithFlowerType.noFlower)
                {
                    if (IsArrowVisible()) this.visible = true;
                }
                else
                {
                    this.visible = false;
                }

            },
            _touch: function(btn, eT) {
                if (eT == 2) {
                    //显示花
                    var layer = new showFlowerLayer();
                    MjClient.Scene.addChild(layer);


                    //var showCards = [12,13,25];
                    //MjClient.Scene.addChild(new HAHZ_showCardLayer(showCards,function(){
                    //    cc.log("finished call back show cards");
                    //}));
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
            },
            btn_tuoguan:{
                _touch:function (btn, eT) {
                    if (eT == 2) {
                        MjClient.gamenet.request("pkroom.handler.tableMsg", {cmd: "cancelTrust"},function (rtn) {
                            btn.getParent().setVisible(false);
                        });
                    }
                }
            },
            _event:{
                beTrust:function (msg) {
                    cc.log("wxd........beTrust......."+JSON.stringify(msg));
                    if(getUIPlayer(0).info.uid == msg.uid){
                        if(MjClient.movingCard){
                            MjClient.movingCard.setTouchEnabled(false);
                            MjClient.movingCard.setScale(cardBeginScale);
                            MjClient.movingCard.setTouchEnabled(true);
                        }
                        this.visible = true;
                    }
                },
                initSceneData:function (msg) {
                    var pl = getUIPlayer(0);
                    if(pl.trust){
                        this.visible = true;
                    }
                }
            }
        }
    },
    _downNode:null,
    _rightNode:null,
    _topNode:null,
    _leftNode:null,
    _btnPutCard:null,
    _btnFlower:null,
    _queding:null,
    _yingkou1:null,
    _yingkou2:null,
    _yingkou3:null,
    _buyingkou:null,
    _yingkoucount:0,
    _selecttip:null,
    _select1:null,
    _select2:null,
    _select3:null,
    _showwang:false,
    _nowangtips:true,
    hassetwang:true,
    _showqueding:false,
    ctor: function() {
        this._super();
        var playui = ccs.load("Play_hongtongwangpai.json");
        this.srcMaxPlayerNum = MjClient.MaxPlayerNum;
        MjClient.MaxPlayerNum = parseInt(MjClient.data.sData.tData.maxPlayer);
        cc.log("MjClient.MaxPlayerNum LYG = " + MjClient.MaxPlayerNum);
        playMusic("bgFight");
        this._downNode  = playui.node.getChildByName("down");
        this._rightNode = playui.node.getChildByName("right");
        this._topNode   = playui.node.getChildByName("top");
        this._leftNode  = playui.node.getChildByName("left");
        MjClient.playui = this;
        this._queding = playui.node.getChildByName("queding_btn");
        this._selecttip = playui.node.getChildByName("selecttip");
        this._yingkou1 = playui.node.getChildByName("yingkou1");
        this._yingkou2 = playui.node.getChildByName("yingkou2");
        this._yingkou3 = playui.node.getChildByName("yingkou3");
        this._buyingkou = playui.node.getChildByName("buyingkou");
        this._btnPutCard = playui.node.getChildByName("BtnPutCard");

        this._select1 = playui.node.getChildByName("select1");
        this._select2 = playui.node.getChildByName("select2");
        this._select3 = playui.node.getChildByName("select3");


        this._tingCardsNode = this._downNode.getChildByName("tingCardsNode");
        this._tingCardNumNode = this._downNode.getChildByName("tingCardNumNode");
        MjClient.playui._AniNode =  playui.node.getChildByName("eat");
        BindUiAndLogic(playui.node, this.jsBind);

        // 添加光晕动画
        COMMON_UI.addAniEatCardsBtn();
        
        this.addChild(playui.node);

        //添加滚动通知 by sking
        var _laba_bg =  playui.node.getChildByName("banner").getChildByName("laba_bg");
        _laba_bg.visible = false;
        var _scroll =  playui.node.getChildByName("banner").getChildByName("scroll");
        _scroll.visible = false;

        var arrowbk3D = getNode(0).getParent().getChildByName("arrowbk3D");
        if(arrowbk3D)arrowbk3D.visible = false;

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


        /*
            初始化，每个人的信息节点
         */
        MjClient.playui.Node_player(0);
        MjClient.playui.Node_player(1);
        MjClient.playui.Node_player(2);
        MjClient.playui.Node_player(3);

        //初始化其他功能
        initSceneFunc();

        //东南西北转盘初始化
        COMMON_UI3D.InitSetArrowbk();

        // 在亲友圈房间中添加邀请亲友圈牌有一起对局
        addClubYaoqingBtn();
        
        return true;
    },
    onExit:function()
    {
        this._super();
        MjClient.MaxPlayerNum = this.srcMaxPlayerNum;
    },
    setPlayerHuaValueShow:function(parentNode)
    {
        var tData = MjClient.data.sData.tData;
        var isShow = tData.areaSelectMode.flowerType != WithFlowerType.noFlower && !IsInviteVisible();

        parentNode.getChildByName("huaBg").visible = isShow;
        parentNode.getChildByName("huaCount").visible = isShow;
    },
    

    addwangsign:function(node,off)
    {
        if (!node.getChildByName("wangzi")) 
        {
            var offHunSet = [[50 + 10, 90 + 17], [52, 70], [50 - 10, 84], [60 + 14, 68], [48 + 13, 62 + 16], [48 + 13, 62 + 16], [22, 30]];
            var _wangzi = new ccui.ImageView();
            _wangzi.loadTexture("playing/MJ/wangzi.png");
            _wangzi.setName("wangzi");
            _wangzi.setTag(1);
            _wangzi.setPosition(node.getContentSize().width/2+10,node.getContentSize().height/2+30);
            var myoff = off;
            if (myoff == 2) {myoff = 0;}
            _wangzi.setRotation(-90 * (myoff));
                
            if (myoff == 1)
            {
                _wangzi.setPosition(node.getContentSize().width/2-13,node.getContentSize().height/2+13);   
            } 
            else if (off == 2)
            {
                _wangzi.setPosition(node.getContentSize().width/2+10,node.getContentSize().height/2+30);
            } 
            else if (myoff == 3)
            {
              _wangzi.setPosition(node.getContentSize().width/2 +10 ,node.getContentSize().height/2+15);  
            } 

            node.addChild(_wangzi,20);  
        }

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
        var tData = MjClient.data.sData.tData;
        cc.log(tData.areaSelectMode.wanfa);
        cc.log(tData.hunCard);
        for(var i = 0; i < children.length; i++)
        {
            if(children[i].name == "mjhand")
            {
                if(children[i].y > standUI.y + 10)
                {
                    bPut=true;
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
                        var tingSet = MjClient.majiang.calTingSet(pl.mjhand, null, pl, tData);
                        setTingCards_JINZHONGMJ(this._tingCardsNode,tingSet);
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
        return;//不显示
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
            if(pl.putCardAfterTing > 0 && pl.putCardAfterTing != -1)
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
        {   //东南西北中发白
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
        // var tData = MjClient.data.sData.tData;
        // var uids = tData.uids;
        // var idx = uids.indexOf(eD.uid);
        // var selfidx = uids.indexOf(SelfUid());
        // var offidx = (idx-selfidx+4)%4;

        var _UIOff = getUiOffByUid(eD.uid)

        if(_UIOff == off)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
});



PlayLayer_hongtongwangpai.prototype.hideYingKouButton = function()
{
    MjClient.playui._yingkou1 && MjClient.playui._yingkou1.setVisible(false);
    MjClient.playui._yingkou2 && MjClient.playui._yingkou2.setVisible(false);
    MjClient.playui._yingkou3 && MjClient.playui._yingkou3.setVisible(false);
    MjClient.playui._buyingkou && MjClient.playui._buyingkou.setVisible(false);
    if(getUIPlayer(0).yingkou) getUIPlayer(0).yingkou = -1;
};


PlayLayer_hongtongwangpai.prototype.CardLayoutRestore = function(node, off,over)
{
    // node 是克隆新建的一个麻将节点 by sking
    cc.log("===============CardLayoutRestore 00000000000000000000000");
    var tData = MjClient.data.sData.tData;
    var newC = null; //先创建麻将的UI节点
    var newVal = 0; //新牌的值，是几万，几筒，几条....为数字
    var pl = getUIPlayer(off);//获取玩家信息.off 为0 ，就是自己得信息，能看到自己摸牌 by sking
    var mjhandNum = 0;
    var children = node.children;
    var isgameover = over!= null ? over : false;
    for(var i = 0; i < children.length; i++)
    {
        var ci = children[i];
        ci.stopActionByTag(20180131);
        if(ci.name == "mjhand")
        {
            mjhandNum++;
            if((typeof MjClient.init_y) == 'undefined')
            {
                MjClient.init_y = ci.y;
            }

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
                        return a - b;
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
                if (MjClient.data.sData.tData.areaSelectMode.wanfa == "duiwangdajiangbao") 
                {
                    if (getUIPlayer(off).hunCard  && getUIPlayer(off).hunCard == ci.tag) 
                    {
                        uihun.push(ci);
                    }
                    else
                    {
                        uistand.push(ci);
                    }
                }
                else
                {
                    if(MjClient.data.sData.tData.hunCard && MjClient.data.sData.tData.hunCard == ci.tag)
                    {
                        uihun.push(ci);
                    }
                    else
                    {
                        uistand.push(ci);
                    }
                }
            }
            if(MjClient.data.sData.tData.hunCard && MjClient.data.sData.tData.hunCard == ci.tag)
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


    if (isgameover && off != 3) 
    {
         uistand.sort(TagOrder);
    }
    else
    {
        if (MjClient.rePlayVideo == -1 && 
            tData.areaSelectMode.wanfa == "duiwangdajiangbao") 
        {
            if(off == 0)
                uistand.sort(TagOrder);
        }
        else
        {
            uistand.sort(TagOrder);
        }
    }


    if (tData.areaSelectMode.wanfa == "duiwangdajiangbao" && off != 3) 
    {
        var _newUiStand = [];
        var _huncardUI = [];
        for(var i = 0;i < uistand.length;i++)
        {
            if(uistand[i].tag != pl.hunCard)
            {
                _newUiStand.push(uistand[i]);
            }
            else
            {
                _huncardUI.push(uistand[i]);
            }
        }

        for(var j = 0;j < _huncardUI.length;j++)
        {
            _newUiStand.push(_huncardUI[j]);
        }

        uistand = _newUiStand;
    }

    if(uihun.length > 0) //是否有柰子，有则放在最前面 by sking
    {
        for(var i = 0; i < uihun.length; i++)
        {
            uistand.unshift(uihun[i]); //向数组开头添加一个元素 unshift
        }
    }

    if(newC)
    {
        uistand.push(newC);
         //把这张牌放入手牌的数组里  by sking
    }

    //断线重连时处理已经暗杆王牌
    var pl = getUIPlayer(off);
    var isgangwang = false;
    for (var i in pl.mjgang1) {
        if (pl.mjgang1[i] == pl.hunCard) 
            isgangwang = true;
            break;
    }

    if (MjClient.rePlayVideo == -1 && tData.areaSelectMode.wanfa == "duiwangdajiangbao" && !isgangwang) 
    {
        var wangcard = tData.wangpais;
        cc.log("wangcard"+ wangcard);

        cc.log("MjClient.playui.hassetwang ====",MjClient.playui.hassetwang);
        if (wangcard && Object.keys(wangcard).length > 0 && MjClient.playui.hassetwang) 
        {
            MjClient.playui._showwang = false;
        }

        cc.log("show info of tState ====",tData.tState);
        cc.log("show info of tState ====",pl.mjState);
        if (!MjClient.playui._showwang && MjClient.rePlayVideo == -1) 
        {
            if (tData.areaSelectMode.wanfa == "duiwangdajiangbao" ) 
            {
                var pl = getUIPlayer(off);
                if (off != 0 && pl)
                {
                    if (pl.hunCard && pl.hunCard != -1 && pl.hunCard != 0 && uistand.length > 2) 
                    {
                        cc.log("remove   off  == ",off+ "off hunCard" ,pl.hunCard);
                        //RemoveNodeBack(getNode(off) , "standPri", 2);
                        if (off == 3) 
                        {
                            var chi1 =  uistand.shift();
                            chi1.removeFromParent();
                            var chi2 = uistand.shift();
                            chi2.removeFromParent();
                        }
                        else
                        {
                            var chi1 =  uistand.pop();
                            chi1.removeFromParent();
                            var chi2 = uistand.pop();
                            chi2.removeFromParent();
                        }

                        var cardnode1 = getNewCard(getNode(off),"up","standPri",pl.hunCard,off);
                        cardnode1.isWangPai = true;
                        MjClient.playui.addwangsign(cardnode1,off);
                        var cardnode2 = getNewCard(getNode(off),"up","standPri",pl.hunCard,off);
                        cardnode2.isWangPai = true;
                        MjClient.playui.addwangsign(cardnode2,off);

                        if (off == 3) 
                        {
                            uistand.unshift(cardnode1);
                            uistand.unshift(cardnode2);
                        }
                        else{                            
                            uistand.push(cardnode1);
                            uistand.push(cardnode2);
                        }
                    }
                }
            }  
        }
    }

    var sData = MjClient.data.sData;
    if (sData) var tData = sData.tData;
    var zimoHuType = (pl.huWord && (pl.huWord == "zimo" || pl.huWord == "tianhu"))
        || (pl.mjState && tData && (tData.tState == TableState.waitPut && pl.mjState == TableState.waitPut ));
    if (off != 0 && uistand.length > 0 && zimoHuType && pl.zimoNode) {
        var lastNode = null;
        if (off == 3) {
            lastNode =  uistand.pop(); // 洪洞王牌特殊处理（删除手牌的第一张牌）
        }
        else {
            lastNode =  uistand.shift();
        }
        lastNode.removeFromParent();
        var zimoNode = getNewCard(getNode(off), "up", "standPri", pl.zimoNode, off);
        zimoNode.setName("zimoCardNode");
        if (off == 3) {
            uistand.push(zimoNode);
        }
        else {
            uistand.unshift(zimoNode);
        }
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



    for (var i = 0; i <4; i++) {
       if (getUIPlayer(i)==null) 
       {
            continue;
       }
       else
       {
        if (getUIPlayer(i).hunCard != null && getUIPlayer(i).hunCard != -1) 
        {
            MjClient.playui._showwang = true;
        }
        else
        {
            MjClient.playui._showwang = false;
            break;  
        }
       }
    }

    for(var i = 0; i < orders.length; i++)
    {
        var ci = orders[i];
        if(off % 2 == 0)//自己或者对家
        {
            if(i != 0)
            {
                if(ci.name == orders[i - 1].name)
                {
                    if(ci.isgang4)
                    {
                        ci.x = orders[i - 2].x;
                        ci.y = orders[i - 2].y + upSize.height * upS * 0.18;
                    }
                    else if(orders[i - 1].isgang4)
                    {
                        ci.x = orders[i - 2].x + upSize.width * upS + slotwith;
                    }
                    else if(orders[i - 1].ispeng3)
                    {
                        ci.x = orders[i - 1].x + upSize.width * upS + slotwith;
                    }
                    else
                    {
                        if(ci.name == "mjhand")
                        {
                            if(off == 0)
                            {
                                ci.x = orders[i - 1].x + upSize.width * upS *COMMON_UI.cardBetween//1.02
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
                                var cardBetween = COMMON_UI.chipenggangBetween;
                                ci.x = orders[i - 1].x + upSize.width * upS * cardBetween;
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
                }
                else
                {
                    ci.x = orders[i - 1].x + upSize.width * upS * 1.3;
                }
                ci.zIndex = orders[i - 1].zIndex + 1;
            }
            else
            {
                if (off == 0)
                {
                    ci.x = start.x + upSize.width * upS * 0.1;
                    ci.zIndex = start.zIndex + 100  ;//第一张牌的层级
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
                        ci.setTouchEnabled(true);
                        SetTouchCardHandler(stand, ci);
                        ci.x = ci.x + slotwith + 10;
                        MjClient.newCard = newC;
                        MjClient.newCard.isNew = true; 
                        //ci.y += 20;//发的新牌默认不提起
                        if (isGray) ci.y += 20;//听牌情况下，发的新牌才默认提起
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
            else
            {
                if(ci.getChildByName("imgNode"))
                    ci.getChildByName("imgNode").setRotation(0);
            }

            if(MjClient.data.sData.tData.hunCard && MjClient.data.sData.tData.hunCard != -1 )
            {
                if(MjClient.data.sData.tData.hunCard == ci.tag)
                {
                    ci.setColor(cc.color(240, 230, 140));
                }
            }

        }
        else
        {
            if(i != 0)
            {
                if(ci.name == orders[i - 1].name)
                {
                    if(ci.isgang4)
                    {
                        ci.y = orders[i - 2].y + slotheigt;
                    }
                    else if(orders[i - 1].isgang4)
                    {
                        ci.y = orders[i - 2].y - upSize.height * upS * 1.1;
                    }
                    else if(orders[i - 1].ispeng3)
                    {
                        ci.y = orders[i - 1].y - upSize.height * upS * 1.1 ;
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

    if(MjClient.rePlayVideo != -1)//表示回放
    {
        if (off != 0) 
        {
            var children = getNode(off).children;
            var pl = getUIPlayer(off);
            for (var i = 0; i < children.length; i++) {
            if (children[i].tag == pl.hunCard /*&& children[i].name == "mjhand_replay"*/ ) 
            {
                MjClient.playui.addwangsign(children[i],off);
            }
        }
        }

    }
    if (isgameover == true) 
    {
        resetwangpaishow(node,off);
    }

    //对王暗杆王牌
/*    var pl = getUIPlayer(0);
    var children = getNode(0).children;
    for (var i in children) {
        if (children[i].name == "gang1" && children[i].tag == pl.hunCard && children[i].isgang4 == null) 
        {
            MjClient.playui.addwangsign(children[i],off);
        }
    }*/

    //刷新手牌大小
    if(COMMON_UI3D.is3DUI()){
        COMMON_UI3D.set3DCardSprite(off);
    }
    else {
        //刷新手牌大小
        resetCardSize();
        //刷新贴图 选王牌
        MjClient.playui.resetCardsprite()

    }

    //选完状态处理
    if (isgangwang == false) 
    {
        DealSelect(node,off);
    }
};

// 判断吃碰杠胡的状态
PlayLayer_hongtongwangpai.prototype.EatVisibleCheck = function()
{

    cc.log("getin  peng");

    var eat = MjClient.playui.jsBind.eat;
    //sk 为啥要隐藏掉？   //因为一开始是不可见的，隐藏根节点 by sking
    MjClient.playui.jsBind.eat.changeui.changeuibg._node.visible = false;
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var leftCard = MjClient.majiang.getAllCardsTotal() - tData.cardNext;

    var _downNode = getNode(0);

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


    var pl = sData.players[SelfUid() + ""];
    MjClient.gangCards = [];
    MjClient.eatpos = [];

    var mj = MjClient.majiang;

    cc.log("状态========",tData.tState)
    cc.log("王牌========", pl.hunCard)
    //选王状态直接跳过
    if (tData.areaSelectMode.wanfa == "duiwangdajiangbao") 
    {
        if (pl.hunCard == null || pl.hunCard == -1) 
        {
            return;
        }
    }

    //吃碰杠胡node
    var vnode = [];

    if(
        pl.mjState == TableState.waitEat ||
        pl.mjState == TableState.waitPut && 
        tData.uids[tData.curPlayer] == SelfUid()) 
        
    {

    }
    else
    {
        return;
    }

    //自摸

    cc.log(pl.mjState + " tState "+tData.tState);
    if(tData.tState == TableState.waitPut && pl.mjState == TableState.waitPut   )
    {
        if(IsTurnToMe())
        {
            //检测补花
            var cduis=_downNode.children;
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
            //胡
            // pl.mustHu = false;
            if (pl.isNew && pl.eatFlag & 8) {
                vnode.push(eat.hu._node);
                // pl.mustHu = (tData.hunCard == pl.mjhand[pl.mjhand.length - 1] && MjClient.majiang.quantingpai(pl.mjhand.slice(0, -1), pl, tData));
                // if(pl.mustHu) pl.isZiMoHu = true;
            }
            //听
            //----------
            delete MjClient.yingkouCache;
            if (!pl.isTing) {
                 cc.log("￥￥￥￥听牌监测");
                MjClient.canTingCards = {};
                 var sData = MjClient.data.sData;
                 var tData = sData.tData;  
                for (var i = 0; i < pl.mjhand.length; i++) {
                    if (tData.areaSelectMode["wanfa"] == "dajiangwangheifengbao" && !MjClient.majiang.fengs.has(pl.mjhand[i])
                     || tData.areaSelectMode["wanfa"] == "duiwangdajiangbao" && !MjClient.majiang.jians.has(pl.mjhand[i])) {
                        // 特定玩法必须打相应的牌
                        continue;
                    }
                    var cardsAfterPut = pl.mjhand.slice(0);
                    cardsAfterPut.splice(i,1); //依次去掉某张牌看能不能听
                    // cc.log(cardsAfterPut);
                    if (MjClient.majiang.canTing(cardsAfterPut, pl, tData)) {
                        //cc.log("can ting pl.mjhand[i] value",pl.mjhand[i]);
                        MjClient.canTingCards[pl.mjhand[i]] = 1;
                        if (vnode.indexOf(eat.ting._node) < 0) {
                            vnode.push(eat.ting._node);
                        }
                    }
                }
             }
            
            //杠
            cc.log("=== pl.mjpeng :  " + pl.mjpeng)
            cc.log("=== pl.mjhand :  " + pl.mjhand)
            cc.log("=== pl.isTing :  " + pl.isTing)
            var rtn = MjClient.majiang.canGang1(pl.mjpeng, pl.mjhand, pl.isTing, pl, tData);
            cc.log("$$$$杠牌打印==========",JSON.stringify(rtn))
            cc.log("$$$$杠牌监测"+JSON.stringify(rtn));
            if(rtn.length > 0/* && pl.isNew && !pl.mustHu*/)
            {
                MjClient.gangCards = rtn;
                vnode.push(eat.gang0._node);
            }
            if(vnode.length > 0)
            {
                // if(!pl.mustHu) 
                {
                    vnode.push(eat.guo._node);
                }
                eat.ting._node.visible = false;
                eat.noTing._node.visible = false;
                isCheckedTing = false;
            }
        }
    }
    //别人点
    else if(tData.tState == TableState.waitEat)
    {
         cc.log("diao pao hu-=================================================");
        if(!IsTurnToMe())
        {
            if (pl.eatFlag & 8) {
                vnode.push(eat.hu._node);
            }
            if (pl.eatFlag & 4) {
                vnode.push(eat.gang0._node);
                MjClient.gangCards = [tData.lastPutCard];
                eat.gang0._node.visible = true;
                setCardSprite(eat.gang0.card1._node, MjClient.gangCards[0], 0);
            }
            cc.log("碰+===============",pl.eatFlag)
            if (pl.eatFlag & 2) {
                vnode.push(eat.peng._node);
            }

            //如果，有杠，碰，吃。 这出现过的UI. 否则玩家状态为等待
            if(vnode.length > 0)
            {
                vnode.push(eat.guo._node);
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

            setWgtLayout(vnode[i], [0, 0.19], [0.5, 0], [(1 - vnode.length) / 1.8 + i * 1.4, 1.8], false, false);
        }
    }

    if(eat.hu._node.visible)
    {
        MjClient.playui._btnPutCard.visible = false;
    }

    if (eat.ting._node.visible) 
    {
        eat.guo._node.visible = true;
    }
}

/*
    玩家ui，信息
 */
PlayLayer_hongtongwangpai.prototype.Node_player = function(off)
{
    var _node = getNode(off);

    if(off == 1 || off == 3)
    {
        _node.visible = MjClient.MaxPlayerNum != 2;
    }

    if( off == 2)
    {
        _node.visible = MjClient.MaxPlayerNum != 3;
    }

    /********************************************UI节点*********************************************/
    var _head = _node.getChildByName("head");

    //托管
    var _tuoguan = _head.getChildByName("tuoguan");
    if(_tuoguan)
    {
        _tuoguan.visible = false;
        UIEventBind(null, _tuoguan, "beTrust", function (msg) {
            if(getUIPlayer(off)&&getUIPlayer(off).info.uid == msg.uid){
                _tuoguan.visible = true;
            }
        });

        UIEventBind(null, _tuoguan, "cancelTrust", function (msg) {
            if(getUIPlayer(off)&&getUIPlayer(off).info.uid == msg.uid){
                _tuoguan.visible = false;
            }
        });
    }

    var _zhuang = _head.getChildByName("zhuang");
    if(_zhuang)
    {
        _zhuang.visible = false;
    }

    var _chatbg = _head.getChildByName("chatbg");
    if(_chatbg)
    {
        _chatbg.getParent().zIndex = 600;

        var _chattext = _chatbg.getChildByName("chattext");
        UIEventBind(null, _chattext, "MJChat", function (msg) {
            showUserChat(_chattext, off, msg);
        });

        UIEventBind(null, _chattext, "playVoice", function (voicePath) {
            MjClient.data._tempMessage.msg = voicePath;
            showUserChat(_chattext, off, MjClient.data._tempMessage);
        });
    }

    _head.setTouchEnabled(true);
    _head.addTouchEventListener(function(sender, type) {
        if (type == 2) {
            showPlayerInfo(off, sender);
        }
    }, _head);

    showFangzhuTagIcon(_head,off);

    var _score_bg = _head.getChildByName("score_bg");
    _score_bg.visible = false;

    var _name_bg = _head.getChildByName("name_bg");
    _name_bg.visible = false;

    var _flower_layout = _head.getChildByName("flower_layout");
    _flower_layout.visible = false;

    var _flower_zfb_layout = _head.getChildByName("flower_zfb_layout");
    _flower_zfb_layout.visible = false;

    var _tingCard = _head.getChildByName("tingCard");
    if(_tingCard)
    {
        _tingCard.visible = false;
    }

    var _tingIcon = _head.getChildByName("tingIcon");
    if(_tingIcon)
    {
        _tingIcon.visible = false;
        _tingIcon.runAction(cc.sequence(cc.spawn(cc.tintTo(0.6, 255,0,0),cc.scaleTo(0.6,_tingIcon.getScale() + 0.3)),
            cc.spawn(cc.tintTo(0.6, 255,255,255),cc.scaleTo(0.6,_tingIcon.getScale()))).repeatForever());
    }

    var _huaCount = _head.getChildByName("huaCount");
    if(_huaCount)
    {
        MjClient.playui.setPlayerHuaValueShow(_huaCount.getParent());
        _huaCount.ignoreContentAdaptWithSize(true);
        _huaCount.setString("花 x 0");
    }

    var _skipHuIconTag = _head.getChildByName("skipHuIconTag");
    if(_skipHuIconTag)  _skipHuIconTag.visible = false;

    var _skipPengIconTag = _head.getChildByName("skipPengIconTag");
    if(_skipPengIconTag)  _skipPengIconTag.visible = false;

    var _play_tips = _node.getChildByName("play_tips");
    if(_play_tips)
    {
        _play_tips.visible = false;
        _play_tips.zIndex = actionZindex;
    }


    var _tai_layout = _node.getChildByName("tai_layout");
    if(_tai_layout)
    {
         var _tai_nifo = _tai_layout.getChildByName("tai_info");
        // _tai_nifo.visible = true;
         _tai_nifo.setString("");
    }


    var _ready = _node.getChildByName("ready");
    if(_ready) GetReadyVisible(_ready, off);

    var _stand = _node.getChildByName("stand");
    if(_stand) _stand.visible = false;

    var _up = _node.getChildByName("up");
    if(_up) _up.visible = false;

    var _down = _node.getChildByName("down");
    if(_down) _down.visible = false;

    var _out0  = _node.getChildByName("out0");
    _out0.visible = false;
    var _out1 = _node.getChildByName("out1");
    _out1.visible = false;
    var _out2 = _node.getChildByName("out2");
    if (_out2) _out2.visible = false;


    var _outBig = _node.getChildByName("outBig");
    if(_outBig)  _outBig.visible = false;

    var _tingCardsNode = _node.getChildByName("tingCardsNode");
    if(_tingCardsNode)  _tingCardsNode.visible = false;

    var _tingCardNumNode = _node.getChildByName("tingCardNumNode");
    if(_tingCardNumNode) _tingCardNumNode.visible = false;


    /********************************************事件处理*********************************************/

    UIEventBind(null, _node, "clearCardUI", function (eD) {
        clearCardUI(_node, off);
        _tingCard.visible = false;
        if(_huaCount) _huaCount.setString("花 x 0");
        if(_skipHuIconTag) _skipHuIconTag.visible = false;
        if(_skipPengIconTag) _skipPengIconTag.visible = false;
        if(_tingCardsNode) _tingCardsNode.visible = false;
        if(_tingCardNumNode) _tingCardNumNode.visible = false;
    });

    UIEventBind(null, _node, "initSceneData", function (eD) {
        SetUserVisible_hongtongwangpai(_node, off);
        if (IsArrowVisible()) showUserZhuangLogo(_zhuang, off);
        //MjClient.playui.setTingCardInfo(_tingCard,eD,off);
        //MjClient.playui.EatVisibleCheck();
        MjClient.playui.tingIconVisible(_tingIcon,off);
        var pl = getUIPlayer(off);
        if (pl && pl.skipHu && pl.skipHu.length > 0) {
            if(_skipHuIconTag) _skipHuIconTag.visible = true;
        }
        if(pl && _skipPengIconTag)
        {
            if (pl.skipPeng.length > 0) {
                _skipPengIconTag.visible = true;
            }else{
                _skipPengIconTag.visible = false;
            }
        }
        showAndHideHeadEffect();
        MjClient.playui.hassetwang = true;
        if(_tingCardsNode) MjClient.playui.tingIconVisible(_tingCardsNode,off);

        var pl = getUIPlayer(0);
        var children = getNode(0).children;
        if (pl && pl.hunCard != null && pl.hunCard != -1) 
        {
            MjClient.playui._queding.visible=false;
            MjClient.playui._selecttip.visible=false;
        }
    });
    UIEventBind(null, _node, "addPlayer", function (eD) {
        SetUserVisible_hongtongwangpai(_node, off);
        showFangzhuTagIcon(_head,off);
        if(_huaCount) MjClient.playui.setPlayerHuaValueShow(_huaCount.getParent());
        GetReadyVisible(_ready, off);

    });
    UIEventBind(null, _node, "removePlayer", function (eD) {
        SetUserVisible_hongtongwangpai(_node, off);
        showFangzhuTagIcon(_head,off);
        GetReadyVisible(_ready, off);
        if(_huaCount)  MjClient.playui.setPlayerHuaValueShow(_huaCount.getParent());
    });
    UIEventBind(null, _node, "mjhand", function (eD) {
        InitUserHandUI_hongtongwangpai(_node, off);
    });
    UIEventBind(null, _node, "MJSelectCard", function (eD) {
        var children = _node.children;
        var pl = getUIPlayer(off);
        var tData = MjClient.data.sData.tData;
        MjClient.playui.EatVisibleCheck();
        if (pl && eD.uid == getUIPlayer(off).info.uid && 
            tData.areaSelectMode.wanfa == "duiwangdajiangbao")
        {
            //MjClient.playui.CardLayoutRestore(_node, off);

            cc.log("off~~~~~~~~~~~",off);
            MjClient.playui.CardLayoutRestore(_node, off);
            var children = _node.children;
            for (var i = 0; i <children.length-1; i++)
            //for (var i in children)
            {
                if (children[i].name == "mjhand") 
                {
                    children[i].setColor(cc.color(255,255,255));
                    children[i].setTouchEnabled(true);
                }
            }
        }
    });
    UIEventBind(null, _node, "roundEnd", function (eD) {
        InitUserCoinAndName_jinzhong(_node, off);
        _tingIcon.visible = false;
        showAndHideHeadEffect();
    });

    UIEventBind(null, _node, "newCard", function (eD) {
        if(off == 0)
        {
            if (typeof(eD) == "number") {
                eD = {newCard: eD};
            }

            var pl = getUIPlayer(off);
            if(pl.skipHu)
            {
                var _skipHuIconNode = MjClient.playui._downNode.getChildByName("head").getChildByName("skipHuIconTag");
                if(_skipHuIconNode)
                {
                    _skipHuIconNode.visible = (pl.skipHu.length > 0);
                }
            }
            DealNewCard(_node,eD.newCard,off);
            hideTingBtn();
        }
    });

    UIEventBind(null, _node, "MJPut", function (eD) {

        // var pl = getUIPlayer(off);
        // var tData = MjClient.data.sData.tData;
        // if (pl && eD.uid == getUIPlayer(off).info.uid && pl.isTing && pl.mjhand)
        // {
        //     var _tingCards = _node.getChildByName("tingCardsNode");
        //     cc.log("calTingSet========",tingSet);
        //     var tingSet = MjClient.majiang.calTingSet(pl.mjhand, null, pl, tData);
        //     if(_tingCards) setTingCards_JINZHONGMJ(_tingCards,tingSet);
        // }
        DealMJPut_hongtongwangpai(_node,eD,off);
        hideTingBtn();
        if(_tingCardNumNode) _tingCardNumNode.visible = false;
        setUserOffline(_node, off);
        MjClient.playui.hassetwang = false;
        MjClient.playui._showwang = true;
        showAndHideHeadEffect();
        delete MjClient.yingkouCache;
    });

    UIEventBind(null, _node, "MJChi", function (eD) {
        DealMJChi(_node, eD, off);
        setUserOffline(_node, off);
    });

    UIEventBind(null, _node, "MJGang", function (eD) {
        DealMJGang(_node, eD, off);
        hideTingBtn();
        if(_skipPengIconTag) _skipPengIconTag.visible = false;
         MjClient.playui.hassetwang = true;
         MjClient.playui._showwang = true;
        setUserOffline(_node, off);
    });

    UIEventBind(null, _node, "MJPeng", function (eD) {
        DealMJPeng(_node, eD, off);
        setUserOffline(_node, off);
        showAndHideHeadEffect();
    });

    UIEventBind(null, _node, "MJHu", function (eD) {
        HandleMJHu(_node, eD, off);
        _tingCard.visible = false;
        if(_skipHuIconTag) _skipHuIconTag.visible = false;
        if(_tingCardsNode) _tingCardsNode.visible = false;
        if(_tingCardNumNode) _tingCardNumNode.visible = false;
        setUserOffline(_node, off);
    });

    UIEventBind(null, _node, "onlinePlayer", function (eD) {
        setUserOffline(_node, off);
        GetReadyVisible(_ready, off);
    });

    UIEventBind(null, _node, "playerStatusChange", function (eD) {
        setUserOffline(_node, off);
    });

/*    UIEventBind(null, _node, "MJFlower", function (eD) {
        HandleMJFlower(_node, eD, off);
    });*/

    UIEventBind(null, _node, "MJTing", function (eD) {
        HandleMJTing(_node, eD, off);
        var pl = getUIPlayer(off);
        if(pl && eD.uid == getUIPlayer(off).info.uid)
        {
            pl.putCardAfterTing = eD.putCardAfterTing;
            MjClient.playui.setTingCardInfo(_tingCard,eD,off);
        }
    });


    UIEventBind(null, _node, "waitPut", function (eD) {
        showUserZhuangLogo(_zhuang, off);
        MjClient.playui.hassetwang = false;
        if(off != 0) DealWaitPut(this, eD, off); //其他家发牌
        showAndHideHeadEffect();
    });


    UIEventBind(null, _head, "loadWxHead", function (d) {
        setWxHead(_head, d, off);
    });

    UIEventBind(null, _tingIcon, "moveHead", function (d) {
        MjClient.playui.tingIconVisible(_tingIcon, off);
        GetReadyVisible(_ready, -1);
    });

    if (off == 0) {
        // 吃，碰，杠，出牌的时候，刷新听牌提示的牌的个数  by jiangcw
        var refreshTingNum = function(off, eD){
            var pl = getUIPlayer(off);
            var tData = MjClient.data.sData.tData;
            if (pl && pl.isTing) {
                var _tingCards = _node.getChildByName("tingCardsNode");
                var tingSet = MjClient.majiang.calTingSet(pl.mjhand, null, pl, tData);
                cc.log("PlayerGamePanel ---------- refreshTingNum ---------- tingSet = " + JSON.stringify(tingSet));
                if(_tingCards) setTingCards_JINZHONGMJ(_tingCards, tingSet);
            }
        };
        // 刷新听牌张数
        UIEventBind(null, _node, "MJPut", function (eD) {
            refreshTingNum(off, eD);
        });

        UIEventBind(null, _node, "MJChi", function (eD) {
            refreshTingNum(off, eD);
        });

        UIEventBind(null, _node, "MJGang", function (eD) {
            refreshTingNum(off, eD);
        });

        UIEventBind(null, _node, "MJPeng", function (eD) {
            refreshTingNum(off, eD);
        });
    }

    /********************************************设置位置*********************************************/
    switch (off)
    {
        case 0:
            setWgtLayout(_play_tips,[0.08, 0.14], [0.5, 0.25], [0, 0.5]);
            setWgtLayout(_ready,[0.07, 0.07], [0.5, 0.5], [0, -1.5]);
            setWgtLayout(_stand,[0.057, 0], [0.5, 0], [8, 0.68]);
            setWgtLayout(_up,[0.05, 0], [0, 0], [0.8, 0.7]);
            setWgtLayout(_down,[0.05, 0], [0, 0], [3.5, 1]);
            setWgtLayout(_out0, [0.0, 0.08], [0.55, -0.08], [-7, 6.1]);
            setWgtLayout(_out1, [0.0, 0.08], [0.55, -0.06], [-7, 4.9]);
            if(_out2) setWgtLayout(_out2, [0.0, 0.08], [0.55, -0.04], [-7, 3.7]);
            if(_outBig) setWgtLayout(_outBig, [0.0836, 0], [0.5, 0.32], [0, 0]);
            if (MjClient.MaxPlayerNum == 2)
            {
                _out0.x -= _out0.height * _out0.scale * 4;
                _out1.x -= _out1.height * _out1.scale *  4;
                if(_out2) _out2.x -= _out2.height * _out2.scale *  4;
            }

            if(_tingCardsNode) setWgtLayout(_tingCardsNode, [0.25, 0.12], [0.2, 0.25], [-0.2, -0.8]);
            if(_tingCardNumNode) setWgtLayout(_tingCardNumNode, [0.25, 0.12], [0.12, 0.25], [0,-0.2]);
            break;
        case 1:
            setWgtLayout(_play_tips,[0.08, 0.14], [0.75, 0.5], [0, 0.5]);
            setWgtLayout(_ready,[0.07, 0.07], [0.5, 0.5], [2, 0]);
            setWgtLayout(_stand,[0, 0.08],[1, 1], [-5.5, -2.3]);
            setWgtLayout(_up,[0, 0.05], [1, 0],[-3.0, 6]);
            setWgtLayout(_down,[0, 0.05],[1, 0], [-3, 6.3]);
            // setWgtLayout(_out0, [0, 0.043], [0.97, 0.55], [-7.2, -5.1]);
            // setWgtLayout(_out1, [0, 0.043], [0.97, 0.55], [-5.9, -5.1]);
            // if(_out2) setWgtLayout(_out2, [0, 0.043], [0.97, 0.55], [-4.6, -5.1]);
            setWgtLayout(_out0, [0, 0.055], [0.94, 0.5], [-5.2, -4.0]);
            setWgtLayout(_out1, [0, 0.055], [0.94, 0.5], [-4.0, -4.0]);
            if(_out2) setWgtLayout(_out2, [0, 0.055], [0.94, 0.5], [-2.8, -4.0]);
            if(_outBig) setWgtLayout(_outBig, [0.0836, 0], [0.75, 0.58], [0, 0]);
            break;
        case 2:
            setWgtLayout(_play_tips,[0.08, 0.14], [0.5, 0.75], [0, 0]);
            setWgtLayout(_ready,[0.07, 0.07], [0.5, 0.5], [0, 1.5]);
            setWgtLayout(_stand,[0, 0.07],[0.5, 1], [-6, -1.4]);
            setWgtLayout(_up,[0, 0.07], [0.5, 1], [6, -1.4]);
            setWgtLayout(_down,[0, 0.07], [0.5, 1], [6, -0.7]);

            setWgtLayout(_out0, [0, 0.08], [0.55, 1], [4.1, -4.1]);
            setWgtLayout(_out1, [0, 0.08], [0.55, 1], [4.1, -3.2]);
            if(_out2) setWgtLayout(_out2, [0, 0.08], [0.55, 1], [4.1, -2.3]);
            if(_outBig) setWgtLayout(_outBig, [0.0836, 0], [0.5, 0.75], [0, 0]);
            if (MjClient.MaxPlayerNum == 2)
            {
                _out0.x += _out0.height * _out0.scale *  4;
                _out1.x += _out1.height * _out1.scale *  4;
                if(_out2) _out2.x += _out2.height * _out2.scale *  4;
            }
            break;
        case 3:
            setWgtLayout(_play_tips,[0.08, 0.14], [0.25, 0.5], [0, 0.5]);
            setWgtLayout(_ready,[0.07, 0.07], [0.5, 0.5], [-2, 0]);
            setWgtLayout(_stand,[0, 0.08], [0, 0.6], [5.2, 3]);
            setWgtLayout(_up,[0, 0.05], [0, 1], [3.0, -3.5]);
            setWgtLayout(_down,[0, 0.05], [0, 1], [3, -3]);
            // setWgtLayout(_out0, [0, 0.043], [0.05, 0.5], [7.2, 4.8]);
            // setWgtLayout(_out1, [0, 0.043], [0.05, 0.5], [5.8, 4.8]);
            // if(_out2) setWgtLayout(_out2, [0, 0.043], [0.05, 0.5], [4.5, 4.8]);
            setWgtLayout(_out0, [0, 0.055], [0.065, 0.5], [5.2, 4.2]);
            setWgtLayout(_out1, [0, 0.055], [0.065, 0.5], [3.9, 4.2]);
            if(_out2) setWgtLayout(_out2, [0, 0.055], [0.068, 0.5], [2.6, 4.2]);
            if(_outBig) setWgtLayout(_outBig, [0.0836, 0], [0.25, 0.58], [0, 0]);
            if (MjClient.MaxPlayerNum == 3)
            {
                _out0.y += _out0.height * _out0.scale * 2;
                _out1.y += _out1.height * _out1.scale * 2;
                if(_out2) _out2.y += _out2.height * _out2.scale * 2;
            }
            break;
        default:
            break;
    }
};
/*
    出牌判断
    
*/
function PutOutCardForHTWP(cardui)
{
    var tData=MjClient.data.sData.tData;
    var pl = getUIPlayer(0);
    if (tData.areaSelectMode.wanfa == "duiwangdajiangbao")
    {
        if(tData.tState != TableState.waitWang && pl.hunCard && pl.hunCard != -1)
        {

            var eat = MjClient.playui.jsBind.eat;
            if(eat.hu._node.visible)//有胡的情况下，要先提示
            {
                MjClient.showMsg("确认不胡吗?", function(){
                    PutOutCard(cardui, cardui.tag);
                }, function() {
                    MjClient.playui.CardLayoutRestore(getNode(0), 0);
                }, "1");
            }
            else{
                PutOutCard(cardui, cardui.tag);
            }
        }
        else if (pl.hunCard == 0) 
        {
             PutOutCard(cardui, cardui.tag);
        }
    }
    else
    {
        var eat = MjClient.playui.jsBind.eat;
        if(eat.hu._node.visible)//有胡的情况下，要先提示
        {
            MjClient.showMsg("确认不胡吗?", function(){
                PutOutCard(cardui, cardui.tag);
            }, function() {
                MjClient.playui.CardLayoutRestore(getNode(0), 0);
            }, "1");
        }
        else{
            PutOutCard(cardui, cardui.tag);
        }
    }
}
/**
 * 硬扣时候刷新可以选硬扣手牌。   
 * @param  {number} cd 设置硬扣牌值
 */
function refreshhand(cd)
{
    //设置可听牌数
    var pl = getUIPlayer(0);
    var tData = MjClient.data.sData.tData;
    var downNode = MjClient.playui._downNode;
    var children = downNode.children;

    var count =  MjClient.yingkouCache;
    cc.log("get pl.yingkou ",count);
    var res = MjClient.majiang.getYingkouData(pl,tData);
    cc.log("get res yingkou",JSON.stringify(res));
    if (res[count]) 
    {
        var counts = {};
        for (var c = 0; c < res[count].length; c++) {
            for (var i = 0; i < children.length; i++) {

                if (children[i].name == "mjhand") 
                {
                    if (!counts[children[i].tag]) {
                    counts[children[i].tag] = 0;
                    }
                    if (children[i].tag == res[count][c]) {  
                        counts[children[i].tag]++;
                    }    
                }
            }
        }
        for (var j = 0; j < children.length; j++) {

            if (children[j].name == "mjhand") 
            {
                //cc.log("牌值=========",children[j].tag);
                if (counts[children[j].tag] >= 1) {
                    //亮
                    children[j].setColor(cc.color(255,255,255));
                    children[j].setTouchEnabled(true);
                }
                else {
                    //暗
                    children[j].setColor(cc.color(190,190,190));
                    children[j].setTouchEnabled(false);
                }
                if (tData.hunCard && children[j].tag == tData.hunCard )
                {
                     children[j].setColor(cc.color(240, 230, 140));
                }               
            }
        }
    }

    pl.yingkou = cd;
    var currentCard = CurrentPutCardMsg();
    var copyhand = pl.mjhand.slice();
    var index = copyhand.indexOf(currentCard);//排除当前选择的一张牌
    copyhand.splice(index,1);
    var tingCards = MjClient.majiang.calTingSet(copyhand, null, pl, tData);
    cc.log("可听牌数========= 硬扣发",JSON.stringify(tingCards));
    setCurrentTingNum(tingCards);

}


function DealSelect(node,off)
{
    if(off == 0) MjClient.unselecedWangCards = {};
    //选王状态非对牌置灰
    var pl =getUIPlayer(off);
    var children = node.children;
    var tData = MjClient.data.sData.tData;
    if ((pl.hunCard == null || pl.hunCard == -1) &&
        tData.areaSelectMode.wanfa == "duiwangdajiangbao") 
    {
        var counts = {};
        for (var i = 0; i < children.length; i++) {

            if (children[i].name == "mjhand")
            {
                if (!counts[children[i].tag]) {
                    counts[children[i].tag] = 0;
                }
                counts[children[i].tag]++;
            }
        }
        for (var j = 0; j < children.length; j++) {

            if (children[j].name == "mjhand") 
            {
                if (counts[children[j].tag] >= 2) {
                    //亮
                    children[j].setColor(cc.color(255,255,255));
                    children[j].setTouchEnabled(true);
                }
                else {
                    //暗
                    MjClient.unselecedWangCards[children[j].tag] = 1;
                    children[j].setColor(cc.color(190,190,190));
                    children[j].setTouchEnabled(false);
                }               
            }
        }
    }
    //选王提示

    if (tData.areaSelectMode.wanfa == "duiwangdajiangbao") 
    {
        var pl = getUIPlayer(off);
        if (pl ) 
        {
            if (pl.hunCard == -1 ||  pl.hunCard == null) 
            {
                if (off == 1) 
                {
                    MjClient.playui._select3.visible=true;
                }
                if (off == 2) 
                {
                    MjClient.playui._select1.visible=true;
                }
                if (off == 3) 
                {
                    MjClient.playui._select2.visible=true;
                }
            }
            else
            {   
                if (off == 1) 
                {   
                    cc.log("get in right",MjClient.playui._select3.visible);
                    MjClient.playui._select3.visible=false;
                }
                if (off == 2) 
                {
                    cc.log("get in top",MjClient.playui._select1.visible);
                    MjClient.playui._select1.visible=false;
                }
                if (off == 3) 
                {
                    cc.log("get in left",MjClient.playui._select2.visible);
                    MjClient.playui._select2.visible=false;
                }
            }
        }
    }

    var children = getNode(0).children;
    MjClient.playui._showqueding = MjClient.playui._queding.visible;
    if (MjClient.playui._showqueding) 
    {
        var haswang = false;
        for(var i = 0; i < children.length; i++)
        {
            
            if(children[i].name == "mjhand")
            {  
                if(children[i].isTouchEnabled())
                {
                    haswang = true;
                    break;
                } 
            }
        }

        if (!haswang && MjClient.playui._nowangtips && tData.tState == TableState.waitWang) 
        {
            MjClient.showToast("你没有对子，无法选王 ");
            MjClient.playui._nowangtips = false;
        }
    }
}

function resetwangpaishow(node,off)
{
    //重置王牌显示
    //var children = getNode(off).children;
    var tData = MjClient.data.sData.tData;
    var children = node.children;
    var pl = getUIPlayer(off);
    if (tData.areaSelectMode.wanfa == "duiwangdajiangbao") 
    {
        for (var i = 0; i < children.length; i++) {
            if (children[i].getChildByName("wangzi")) 
            {
                if (children[i].name == "mjhand_replay" || children[i].name == "mjhand") 
                children[i].removeChildByName("wangzi");
            }
        }
        for (var i = 0; i < children.length; i++) {
            cc.log("children name ",children[i].name,pl.hunCard);
            if (children[i].name == "mjhand_replay" || children[i].name == "mjhand") 
            {
                if (children[i].tag == pl.hunCard) {
                    var _wangzi = new ccui.ImageView();
                    var pos = children[i];
                    _wangzi.loadTexture("playing/MJ/wangzi.png");
                    _wangzi.setName("wangzi");   
                    var myoff = off;
                    //if (myoff == 2) { myoff = 0;}
                    _wangzi.setRotation(-90 * (myoff));

                    if (myoff == 1)
                    {
                        _wangzi.setPosition(pos.getContentSize().width/2-13,pos.getContentSize().height/2+13);   
                    } 
                    else if (myoff == 2)
                    {
                        _wangzi.setPosition(pos.getContentSize().width/2,pos.getContentSize().height/2+10);
                    } 
                    else if (myoff == 3)
                    {
                      _wangzi.setPosition(pos.getContentSize().width/2 +10 ,pos.getContentSize().height/2+15);  
                    } 
                     

                    children[i].addChild(_wangzi,20);
                }
            }
        }
    }

}
PlayLayer_hongtongwangpai.prototype.resetCardsprite = function()
{
    var _downNode = getNode(0);
    var _cpnode = _downNode.getChildByName("stand");
    var pl = getUIPlayer(0);

    cc.log("===========  node.resetCardsprite =================== _currentMJType = " );
    var children = _downNode.children;
    for(var i = 0; i < children.length; i++)
    {
        if(children[i].name == "mjhand" && children[i].tag == pl.hunCard)
        {
            setCardSprite(children[i], children[i].tag, 4);
            if (pl.isTing) 
            {
                children[i].setColor(cc.color(190, 190, 190));
            }
        }
    }
}
