var actionZindex = 1000;
//向服务器发送 过消息
MjClient.MJPass2NetForQuTang23Zhang = function()
{
   // console.log(">>>>>>>>>普通  过 <<<<<<<<");
    var sData = MjClient.data.sData;
    var tData = sData.tData;

    if(IsTurnToMe() && tData.tState === TableState.waitPut)
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

        msg = msg + "吗?";
        MjClient.showMsg(msg, function()
        {
            //cc.log("==========1=============");
            MJPassConfirmToServer();
            eat.gang0._node.visible = false;
            eat.hu._node.visible = false;
            eat.guo._node.visible = false;
            eat.ting._node.visible = false;
            eat.cancel._node.visible = false;
            eat.tingDi._node.visible = false;
            eat.long._node.visible = false;
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
function SetUserVisible_qutang_23zhang(node, off)
{
    var pl = getUIPlayer_changpai(off);
    var head = node.getChildByName("head");
    var name = head.getChildByName("name");
    var nobody = head.getChildByName("nobody");
    var coin = head.getChildByName("coin");
    var offline = head.getChildByName("offline");
    var name_bg = head.getChildByName("name_bg");
    var di = head.getChildByName("di");
    var jiaBei = head.getChildByName("jiaBei");
    if(pl)
    {
        cc.log("====================off======================" + off);
        name.visible = true;
        offline.visible = true;
        coin.visible = true;
        name_bg.visible = true;
        di.visible = true;
        jiaBei.visible = true;
        cc.log("------------------------------------ pl = "+JSON.stringify(pl));
        MjClient.loadWxHead(pl.info.uid, pl.info.headimgurl);
        setUserOffline_changpai(node, off);
        InitUserHandUI_qutang_23zhang(node, off);
    }
    else
    {
        name.visible = false;
        offline.visible = false;
        coin.visible = false;
        name_bg.visible = false;
        di.visible = false;
        jiaBei.visible = false;
        var WxHead = nobody.getChildByName("WxHead");
        if(WxHead)
        {
            WxHead.removeFromParent(true);
        }
    }
}


function InitUserHandUI_qutang_23zhang(node, off)
{
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var canJiaBei = tData.areaSelectMode.canJiaBei;
    var pl = getUIPlayer_changpai(off);
    if(!pl) return;


    //初始化玩家金币和名称
    InitUserCoinAndName_changpai(node, off);
    setAreaTypeInfo(true);

    if(tData.tState !== TableState.waitPut && tData.tState !== TableState.waitEat &&
        tData.tState !== TableState.waitLong && tData.tState !== TableState.waitCard) {
        return;
    }

    cc.log("return init handUI = " + off);
    //添加碰
    for(var i = 0; i < pl.mjpeng.length; i++)
    {
        for(var j = 0; j < 3; j++)
        {
            getNewCard_changpai(node, "up", "peng", pl.mjpeng[i], off);
        }
    }


    //添加明杠
    for(var i = 0; i < pl.mjgang0.length; i++)
    {
        for(var j = 0; j < 4; j++)
        {
            getNewCard_changpai(node, "up", "gang0", pl.mjgang0[i], off);
        }
    }


    //添加暗杠
    for(var i = 0; i < pl.mjgang1.length; i++)
    {
        for(var j = 0; j < 4; j++)
        {
            getNewCard_changpai(node, "up", "gang1", pl.mjgang1[i], off);
        }
    }



    //添加打出的牌,只用显示最后一张
    for(var i = 0; i < pl.mjput.length; i++)
    {
        var msg = {
            card: pl.mjput[i],
            uid: pl.info.uid
        };
        DealMJPut_changpai(node, msg, off, i);
    }


    //添加手牌
    if(MjClient.rePlayVideo === -1)//表示正常游戏
    {
        if(pl.mjhand) {

            if(canJiaBei && !tData.allSelect){
                var mjhandBefore = pl.mjhand.slice(0, 10);
                for(var i = 0; i < mjhandBefore.length; i++) {
                    getNewCard_changpai(node, "stand", "mjhand", mjhandBefore[i], off);
                }

            }else{
                for(var i = 0; i < pl.mjhand.length; i++) {
                    getNewCard_changpai(node, "stand", "mjhand", pl.mjhand[i], off);
                }
            }
        }
        else
        {
            var CardCount = 0;
            if(canJiaBei && !tData.allSelect) {

                CardCount = 10;
            } else{

                if(tData.tState === TableState.waitPut && tData.uids[tData.curPlayer] === pl.info.uid) {
                    CardCount = 23;
                } else{
                    CardCount = 22;
                }

            }

            var upCardCount = CardCount - ((pl.mjpeng.length  + pl.mjgang0.length + pl.mjgang1.length) * 3 + pl.mjchi.length);

            for(var i = 0; i < upCardCount; i++)
            {
                getNewCard_changpai(node, "stand", "standPri");
            }
        }
    }
    else
    {
        /*
         播放录像
         */
        cc.log("_________________mjhand_replay_______________"+JSON.stringify(pl.mjhand));
        MjClient.playui.CleanMjHand(node, off);
        if (pl.mjhand)
        {
            if(off === 0)
            {
                for (var i = 0; i < pl.mjhand.length; i++) {
                    getNewCard_changpai(node, "stand", "mjhand", pl.mjhand[i], off);
                }
            }
            else
            {
                for (var i = 0; i < pl.mjhand.length && i < 22; i++) {
                    getNewCard_changpai(node, "up", "mjhand_replay", pl.mjhand[i], off);
                }
            }
        }

    }


    //添加手花
    MjClient.playui.showflowerCount_QuTang(node, off);

    MjClient.playui.getCurrentHuCount_QuTang(off);

    MjClient.playui.CardLayoutRestore(node, off);
}

function initFlower_qutang_23zhang() {

}


function checkShowJiaBei () {
    var isSelectedJabei = true;
    var isSelectedMe = false;
    var tData = MjClient.data.sData.tData;
    for (var i = 0; i < tData.maxPlayer; i++) {
        var selfIndex = tData.uids.indexOf(SelfUid());
        selfIndex = (tData.zhuang + tData.maxPlayer - selfIndex) % tData.maxPlayer;
        var index = (selfIndex + i) % tData.maxPlayer;
        var player = getUIPlayer_changpai(index);
        var pl = getUIPlayer_changpai(0);
        if (!pl || !player) break;
        if (player == pl) {
            if(pl.jiabei === 0 && isSelectedJabei) {
                isSelectedMe = true;
            }
            break;
        }
        else if (player.jiabei === 0) {
            isSelectedJabei = false;
        }
    }
    return isSelectedMe;
}


var PlayLayer_qutang_23zhang = cc.Layer.extend({
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
                resetFlowerNum(this);
                if (tData.roundNum !== tData.roundAll) return;
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
                if (msg.showEnd) this.addChild(new GameOverLayer(),500);
                else
                    MjClient.Scene.addChild(new StopRoomView());
            },
            roundEnd: function() {
                var self = this;

                function delayExe()
                {
                    var sData = MjClient.data.sData;
                    resetEatActionAnim_changpai();
                    if (sData.tData.roundNum <= 0) self.addChild(new GameOverLayer(),500);
                    self.addChild(new EndOneView_qutang_23zhang(),500);
                }

                this.runAction(cc.sequence(cc.DelayTime(0.2),cc.callFunc(delayExe)));
            },
            moveHead: function() {
                postEvent("returnPlayerLayer");
                tableStartHeadMoveAction_changpai(this);
                initFlower_qutang_23zhang();
            },
            initSceneData: function() {
                reConectHeadLayout_changpai(this);
                CheckRoomUiDelete();
            },
            onlinePlayer: function() {
                reConectHeadLayout_changpai(this);
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
            showCard:function(msg)
            {
                var _isJiang  = msg.isJiang;
                if(_isJiang)
                {
                    cc.log("----isJiang-----");
                }
            },
            changeMJBgEvent: function() {
                changeMJBg(this, getCurrentMJBgType());
            },
        },
        roundnumImg: {
            _run:function () {
                //roundnumImgObj = this;
                MjClient.roundnumImgNode = this;
                setWgtLayout(this,[0.1, 0.1], [0.5, 0.6], [-1.2, 1.0]);
            },
            _event: {
                initSceneData: function(eD) {
                    this.visible = IsArrowVisible_changpai();
                },
                mjhand: function(eD) {
                    this.visible = IsArrowVisible_changpai();
                },
                onlinePlayer: function(eD) {
                    //this.visible = IsArrowVisible_changpai();
                }
            },
            roundnumAtlas: {
                _run:function(){
                    this.ignoreContentAdaptWithSize(true);
                },
                _text: function() {
                    var tData = MjClient.data.sData.tData;
                    if(tData)
                    {
                        var _currentRoundIdx = parseInt(tData.roundAll - tData.roundNum) + 1;
                        if(_currentRoundIdx > tData.roundAll) _currentRoundIdx = 1;
                        return _currentRoundIdx + "/" + tData.roundAll;
                    }
                },
                _event: {
                    mjhand: function() {
                        var tData = MjClient.data.sData.tData;
                        if(tData)
                        {
                            var _currentRoundIdx = parseInt(tData.roundAll - tData.roundNum) + 1;
                            if(_currentRoundIdx > tData.roundAll) _currentRoundIdx = 1;
                            this.setString(_currentRoundIdx + "/" + tData.roundAll);
                        }
                    }
                }
            }
        },
        cardNumImg: {
            _run:function () {
                MjClient.cardNumImgNode = this;
                setWgtLayout(this,[0.1, 0.1], [0.5, 0.6], [1.2, 1.0]);
            },
            _event: {
                initSceneData: function(eD) {
                    this.visible = IsArrowVisible_changpai();
                },
                mjhand: function(eD) {
                    this.visible = IsArrowVisible_changpai();
                },
                onlinePlayer: function(eD) {
                    //this.visible = IsArrowVisible_changpai();
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
                _click: function() {
                    var mjHandCardNode = MjClient.playui._downNode.children;
                    if (mjHandCardNode.length > 0) {
                        for (var i = 0; i < mjHandCardNode.length; i++) {
                            if (mjHandCardNode[i].name === "mjhand") {
                                setStandUIY(mjHandCardNode[i]);
                            }
                        }
                    }
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
                [0.5, 0.76],
                [0, 0.5]
            ]
        },
        roundInfo:{
            _layout: [
                [0.12, 0.12],
                [0.5, 0.52],
                [0, 0]
            ],
            _run:function()
            {
                this.ignoreContentAdaptWithSize(true);
                this.setString(getPlayingRoomInfo(0));
            }
        },
        banner: {
            _layout: [
                [1, 1],
                [0, 1],
                [0, 0]
            ],
            bg_time:{
                 _run:function()
                {
                    var text = new ccui.Text();
                    text.setFontName("fonts/lanting.ttf");
                    text.setFontSize(18);
                    
                    text.setAnchorPoint(0.5, 0.5);
                    text.setTextColor(cc.color(0xA6, 0xD0, 0xBD));
                    text.setPosition(this.width/2, this.height/2);
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
                        this.setString("房号  " + MjClient.data.sData.tData.tableid);
                    }
                }
            },
            gps_btn: {
                _run: function() {
                    this.visible = true;
                    this.opacity = 255;
                    if (IsArrowVisible()) this.visible = true;
                },
                _click: function() {
                    MjClient.Scene.addChild(new showDistance3PlayerLayer());
                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Dingwei", {uid: SelfUid(),gameType:MjClient.gameType});
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
                    MjClient.openWeb({url:MjClient.GAME_TYPE.QU_TANG_23_ZHANG,help:true});
                }
            },
            hunPai:{
                baidaBg:{
                    _run:function()
                    {
                        //baidaBg = this;
                        this.setVisible(false);
                    },
                    _event: {
                        roundEnd:function (eD) {
                            this.visible = false;
                        }
                    },
                },
                baidaText: {
                    _run:function()
                    {
                        this.setVisible(false);
                    },
                    _event: {
                        roundEnd:function (eD) {
                            this.visible = false;
                        }
                    },
                },

            },
        },
        arrowbk: {
            _layout: [
                [0.12, 0.12],
                [0.5, 0.65],
                [0, 0]
            ],
            _run:function () {
                MjClient.arrowbkNode = this;
                setDirVisible(this, true);
                setArrowFengDir_changpai(this);
                // windObj["dong"] = this.getChildByName("dir_right");
                // windObj["nan"] = this.getChildByName("dir_down");
                // windObj["xi"] = this.getChildByName("dir_left");
                // windObj["bei"] = this.getChildByName("dir_up");
                // windPos["dong"] = windObj["dong"].getPosition();
                // windPos["nan"]   = windObj["nan"].getPosition();
                // windPos["xi"]   =  windObj["xi"].getPosition();
                // windPos["bei"]  = windObj["bei"].getPosition();
            },
            _event: {
                initSceneData: function(eD) {
                    this.visible = IsArrowVisible_changpai();
                    SetArrowRotation_changpai(this)
                },
                mjhand: function(eD) {
                    this.visible = IsArrowVisible_changpai();
                    SetArrowRotation_changpai(this);
                },
                onlinePlayer: function(eD) {
                    //this.visible = IsArrowVisible_changpai();
                },
                waitPut: function(eD) {
                    SetArrowRotation_changpai(this)
                },
                MJPeng: function(eD) {
                    SetArrowRotation_changpai(this)
                },
                MJChi: function(eD) {
                    SetArrowRotation_changpai(this)
                },
                MJGang: function(eD) {
                    SetArrowRotation_changpai(this)
                },
                MJFlower: function(eD) {
                    SetArrowRotation_changpai(this)
                },

            },
            number: {
                _run: function() {
                    this.setString("00");
                    //arrowbkNumberUpdate(this);
                    this.ignoreContentAdaptWithSize(true);
                },
                _event: {
                    MJPeng: function() {
                        this.stopAllActions();
                        stopEffect(playTimeUpEff);
                        playTimeUpEff = null;
                        arrowbkNumberUpdate(this);
                    },
                    MJChi: function() {
                        this.stopAllActions();
                        stopEffect(playTimeUpEff);
                        playTimeUpEff = null;
                        arrowbkNumberUpdate(this);
                    },
                    waitPut: function() {
                        this.stopAllActions();
                        stopEffect(playTimeUpEff);
                        playTimeUpEff = null;
                        var eat = MjClient.playui.jsBind.eat;
                        var endFunc = null;
                        if (IsTurnToMe()
                            && !eat.ting._node.visible 
                            && !eat.hu._node.visible 
                            && !eat.peng._node.visible
                            && !eat.tingDi._node.visible
                            && !eat.long._node.visible
                            && !eat.chi0._node.visible
                            && !eat.gang0._node.visible 
                            && !eat.gang1._node.visible 
                            && !eat.gang2._node.visible) {
                            endFunc = MjClient.playui.jsBind.BtnPutCard._click;
                        }
                        arrowbkNumberUpdate(this, endFunc);
                    },
                    MJPut: function(msg) {
                        if (msg.uid === SelfUid()) {
                            this.stopAllActions();
                            stopEffect(playTimeUpEff);
                            playTimeUpEff = null;
                            //arrowbkNumberUpdate(this);
                            this.setString("00");
                        }
                    },
                    roundEnd: function() {
                        this.stopAllActions();
                        stopEffect(playTimeUpEff);
                        playTimeUpEff = null;
                    },
                    LeaveGame: function() {
                        this.stopAllActions();
                        stopEffect(playTimeUpEff);
                        playTimeUpEff = null;
                    }
                }
            },
        },
        BtnPutCard:{ //add by  sking for put card button
            _run: function () {

                var tData = MjClient.data.sData.tData;
                cc.log("BtnPutCard _run set put card btn state = " + tData.tState );

                if(!IsTurnToMe() || tData.tState !== TableState.waitPut)
                {
                    this.visible = false;
                }
                else
                {
                    this.visible = true;
                }
                setWgtLayout(this,[0.16, 0.16], [0.82, 0.26], [0.7, 0]);
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
                    if(children[i].name === "mjhand")
                    {
                        var _standUIy = getStandUIYByCardY(children[i].y);
                        cc.log("-----------------------点击出牌 _standUIy--" + _standUIy);
                        cc.log("-----------------------点击出牌 children[i].y--" + children[i].y);
                        if(children[i].y > _standUIy+ 10)
                        {
                            PutOutCard_changpai(children[i], children[i].tag); //可以出牌
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
                },
                MJHu:function(){
                    this.visible = false;
                },
                newCard: function(eD)
                {
                    this.visible = true;
                },
                MJPut: function(eD) {
                    this.visible = false;
                },
                MJChi: function(eD) {
                    if(IsTurnToMe()) {
                        this.visible = true;
                    }
                },
                MJGang: function(eD) {
                    if(IsTurnToMe()) {
                        this.visible = true;
                    }
                },
                MJPeng: function(eD) {
                    if(IsTurnToMe()) {
                        this.visible = true;
                    }
                },
                MJTing: function (eD) {
                    if(MjClient.playui.isCanPutCard()) {
                        this.visible = true;
                    }else{
                        this.visible = false;
                    }
                },
                roundEnd:function()
                {
                    this.visible = false;
                },
                waitPut: function() {
                    var pl = getUIPlayer_changpai(0);
                    var eat = MjClient.playui.jsBind.eat;
                    if (IsTurnToMe() && pl.isTing && !eat.hu._node.visible && !eat.gang0._node.visible && !eat.gang1._node.visible && !eat.gang2._node.visible && !MjClient.majiang.isCardFlower(pl.newCd)) {
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
                }
            }
        },//end of add by sking
        down: {
            head: {
                di:{

                },
                zhuang: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        waitPut: function() {
                            showUserZhuangLogo_changpai(this, 0);
                        },
                        initSceneData: function() {
                            if (IsArrowVisible_changpai()) showUserZhuangLogo_changpai(this, 0);
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
                        setWxHead_changpai(this, d, 0);
                    },
                    addPlayer: function(eD) {
                        showFangzhuTagIcon_changpai(this,0);
                    },
                    removePlayer: function(eD) {
                        showFangzhuTagIcon_changpai(this,0);
                    }
                },
                _run: function () {
                    // this.zIndex = 600;
                    showFangzhuTagIcon_changpai(this,0);
                },
                score_bg:{_visible:false},
                name_bg:{_visible:false},
                flower_layout: {_visible:false},
                flower_zfb_layout : {_visible:false},
                tingCard: { //add by sking
                    _visible:false,
                    _event: {
                        MJTing: function (eD) {
                            if(eD.uid === SelfUid())
                            {
                                var pl = getUIPlayer_changpai(0);
                                pl.putCardAfterTing = eD.putCardAfterTing;
                                MjClient.playui.setTingCardInfo(this,eD,0);
                            }
                        },
                        clearCardUI: function(eD) {
                            cc.log("ready to----- clear sking ----");
                            this.visible = false;
                        },
                        MJHu: function(eD) {
                            this.visible = false;
                        },
                        onlinePlayer: function(eD) {
                            //MjClient.playui.setTingCardInfo(this,eD,0);
                        },
                        initSceneData:function(eD)
                        {
                            MjClient.playui.setTingCardInfo(this,eD,0);
                        }
                    }
                },
                tingIcon: {
                    _visible:false,
                    _run:function(){
                        this.visible = false;
                        this.runAction(cc.sequence(cc.spawn(cc.tintTo(0.6, 255,0,0),cc.scaleTo(0.6,this.getScale() + 0.3)),
                            cc.spawn(cc.tintTo(0.6, 255,255,255),cc.scaleTo(0.6,this.getScale()))).repeatForever());
                    },
                    _event: {
                        clearCardUI: function(eD) {
                            this.visible = false;
                        },
                        MJHu: function(eD) {
                            this.visible = false;
                        },
                        moveHead: function() {
                            MjClient.playui.tingIconVisible(this, 0);
                        },
                        onlinePlayer: function(eD) {
                            //MjClient.playui.tingIconVisible(this,0);
                        },
                        initSceneData:function(eD)
                        {
                            MjClient.playui.tingIconVisible(this,0);
                        },
                        roundEnd: function(){
                            // cc.log("end rounde------------------------");
                            this.visible = false;
                        }
                    }
                },
                huaCount: {
                    _visible: false,
                    _event:{
                        clearCardUI: function() {
                            this.visible = false;
                        },
                        initSceneData: function(eD) {
                            this.visible = false;
                        },
                        mjhand: function(eD) {
                            var pl = getUIPlayer_changpai(0);
                            if(pl && pl.mjhand) this.visible = true;
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
                            var pl = getUIPlayer_changpai(0);
                            if (pl.skipHu.length > 0) {
                                this.visible = true;
                            }else{
                                this.visible = false;
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
                                this.visible = true;
                            }else{
                                this.visible = false;
                            }
                        }
                    }
                   
                },

                flowerIcon:{
                    _event:{
                        clearCardUI: function() {
                            this.visible = false;
                        },
                        initSceneData: function(eD) {
                            this.visible = false;
                        },
                        mjhand: function(eD) {
                            this.visible = true;
                        }
                    }
                },
                huCount:{
                    _event:{
                        clearCardUI: function() {
                            this.visible = false;
                        },
                        initSceneData: function(eD) {
                            this.visible = false;
                        },
                        mjhand: function(eD) {
                            var pl = getUIPlayer_changpai(0);
                            if(pl && pl.mjhand) this.visible = true;
                        }
                    }
                },
                icon_jiaBei:{
                    _run: function(){
                        // setWgtLayout(this, [0.3, 0.3], [1.1, 0.45], [0, 0], false, false);
                        if(isIPhoneX()){
                            this.y -= 200;
                        }
                    },
                    _event:{
                        JiaBeiToAllPlayer: function(d){
                            MjClient.playui.JiaBeiIconProcess(this, 0);
                            if(d.allSelect){
                                this.visible = false;
                            }
                        },
                        clearCardUI: function() {
                            this.visible = false;
                        },
                        initSceneData: function() {
                            MjClient.playui.JiaBeiIconProcess(this, 0);
                        },
                        mjhand: function() {
                            this.visible = false;
                        }
                    }
                },
                jiaBei:{
                    _event:{
                        JiaBeiToAllPlayer: function(d){
                            MjClient.playui.JiaBeiProcess(this, 0);
                            MjClient.playui.playJiaBeiEffect(d);
                            var tData = MjClient.data.sData.tData;
                            if(tData.allSelect){
                                postEvent("HideJiaBeiPanel");
                                MjClient.playui.CleanMjHand(getNode(0), 0);
                                InitUserHandUI_qutang_23zhang(getNode(0), 0);
                                MjClient.playui.showflowerCount_QuTang(getNode(0), 0);
                                MjClient.playui.EatVisibleCheck();
                            }
                            if (checkShowJiaBei()) {
                                postEvent("ShowJiaBeiPanel");
                            }
                        },
                        clearCardUI: function() {
                            this.visible = false;
                        },
                        initSceneData: function() {
                            MjClient.playui.JiaBeiProcess(this, 0);
                        },
                        mjhand: function() {
                            MjClient.playui.JiaBeiProcess(this, 0);
                        },
                    }
                },
                quanHunImg:{
                    _event:{
                        QuanHunToAllPlayer: function(d){
                            MjClient.playui.QuanHunProcess(this, 0);
                            postEvent("HideQunHunPanel");
                            MjClient.playui.EatVisibleCheck();
                            var pl = getUIPlayer_changpai(0);
                            if (pl && pl.info.uid === d.uid && pl.isQuanHun) {
                                playEffectInPlay("quanhun");
                                ShowEatActionAnim(getNode(0), ActionType.BAOQUANHUN, 0);
                            }
                        },
                        clearCardUI: function() {
                            this.visible = false;
                        },
                        initSceneData: function() {
                            MjClient.playui.QuanHunProcess(this, 0);
                        },
                        mjhand: function() {
                            this.visible = false;
                        }
                    }
                }
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
                _run: function () {
                    if(isIPhoneX()){
                        setWgtLayout(this, [0.047, 0], [0.50, 0.27], [0, 0])
                    }else if(isIPad()){
                        setWgtLayout(this, [0.058, 0], [0.50, 0.25], [0, 0])
                    }else{
                        setWgtLayout(this, [0.050, 0], [0.50, 0.25], [0, 0])
                    }
                },
            },
            stand_0: {
                _visible: false,
                _run: function () {
                    if(isIPhoneX()){
                        setWgtLayout(this, [0.047, 0], [0.50, 0.09], [0, 0])
                    }else if(isIPad()){
                        setWgtLayout(this, [0.058, 0], [0.50, 0.09], [0, 0])
                    }else{
                        setWgtLayout(this, [0.050, 0], [0.50, 0.09], [0, 0])
                    }
                },
            },
            up: {
                _visible: false,
                _run: function () {
                    if(isIPhoneX()){
                        setWgtLayout(this, [0.105, 0], [0.05, 0.12], [0.25, 0])
                    }else if(isIPad()){
                        setWgtLayout(this, [0.13, 0], [0.05, 0.12], [0.25, 0])
                    }else{
                        setWgtLayout(this, [0.12, 0], [0.05, 0.12], [0.25, 0])
                    }
                }
            },
            down: {
                _layout: [
                    [0.05, 0],
                    [0, 0],
                    [3.5, 1]
                ],
                _visible: false
            },
            out2: {
                _visible: false,
                _run: function () {
                    if(isIPhoneX()){
                        setWgtLayout(this, [0, 0.07], [0.52, 0.15], [-7, 5.7])
                    }else{
                        setWgtLayout(this, [0, 0.07], [0.50, 0.15], [-7, 5.7])
                    }
                    if(MjClient.MaxPlayerNum_changPai === 2){
                        this.x -= isIPhoneX() ? 170: 80;
                    }
                },
            },
            out1: {
                _visible: false,
                _run: function () {
                    if(isIPhoneX()){
                        setWgtLayout(this, [0, 0.07], [0.52, 0.15], [-7, 4.7])
                    }else if(isIPad()){
                        setWgtLayout(this, [0, 0.07], [0.50, 0.15], [-7, 4.0])
                    }else{
                        setWgtLayout(this, [0, 0.07], [0.50, 0.15], [-7, 4.7])
                    }
                    if(MjClient.MaxPlayerNum_changPai === 2){
                        this.x -= isIPhoneX() ? 170: 80;
                    }
                },
            },
            out0: {
                _visible: false,
                _run: function () {
                    if(isIPhoneX()){
                        setWgtLayout(this, [0, 0.07], [0.52, 0.15], [-7, 3.7])
                    }else if(isIPad()){
                        setWgtLayout(this, [0, 0.07], [0.50, 0.15], [-7, 3.0])
                    }else{
                        setWgtLayout(this, [0, 0.07], [0.50, 0.15], [-7, 3.7])
                    }
                    if(MjClient.MaxPlayerNum_changPai === 2){
                        this.x -= isIPhoneX() ? 170: 80;
                    }
                },
            },
			outBig: {
                _layout: [
                    [0.0836, 0],
                    [0.5, 0.4],
                    [0, 0]
                ],
                _visible: false
            },
            tingCardsNode: {
                _layout: [[0.25, 0.25], [0.16, 0.44], [0, 0]],
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
                _layout: [[0.27, 0.27], [0.11, 0.34], [0,-0.01]],
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
                    }
                }
            },
            _event: {
                clearCardUI: function() {
                    clearCardUI_changpai(this, 0);
                },
                initSceneData: function(eD) {
                    SetUserVisible_qutang_23zhang(this, 0);
                },
                addPlayer: function(eD) {
                    SetUserVisible_qutang_23zhang(this, 0);
                },
                removePlayer: function(eD) {
                    SetUserVisible_qutang_23zhang(this, 0);
                },
                mjhand: function(eD) {
                    InitUserHandUI_qutang_23zhang(this, 0);
                },
                roundEnd: function() {
                    InitUserCoinAndName_changpai(this, 0);
                    //setTaiInfo("");
                },
                newCard: function(eD) {
                    // cdsNums++;
                    cc.log("客户端发牌组合......eD= "+JSON.stringify(eD));
                    if (typeof(eD) == "number") {
                        eD = {newCard: eD};
                    }

                    var pl = getUIPlayer_changpai(0);
                    if (pl && pl.mjhand) {
                        for(var i = 0;i < pl.mjhand.length;i++)
                        {
                            var value = pl.mjhand[i];
                            if(value == 0) pl.mjhand.splice(i,1);
                        }
                    }

                    if (eD.newCard != 0) { 
                        DealNewCard_changpai(this, eD.newCard, 0);
                        hideTingBtn();
                    }
                    else {
                        MjClient.playui.CleanMjHand_long(getNode(0), 0);
                        InitUserHandUI_qutang_23zhang(getNode(0), 0);
                        MjClient.playui.EatVisibleCheck();
                    }
                },
                MJPut: function(eD) {

                    DealMJPut_changpai(this,eD,0);
                    var pl = getUIPlayer_changpai(0);
                    if (eD.uid === SelfUid() && pl.isTing)
                    {
                        var _tingCards = this.getChildByName("tingCardsNode");
                        var tingSet = calTingSet(pl.mjhand);
                        cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>MJPut---------------= " + JSON.stringify(tingSet));
                        setTingCards_changpai(_tingCards,tingSet);
                    }
                    setUserOffline_changpai(this, 0);
                },
                MJChi: function(eD) {
                    DealMJChi(this, eD, 0);
                    setUserOffline_changpai(this, 0);
                },
                MJGang: function(eD) {
                    DealMJGang_changpai(this, eD, 0);
                    hideTingBtn();
                    setUserOffline_changpai(this, 0);
                },
                MJPeng: function(eD) {
                    DealMJPeng_changpai(this, eD, 0);
                    setUserOffline_changpai(this, 0);
                },
                MJHu: function(eD) {
                    HandleMJHu(this, eD, 0);
                    setUserOffline_changpai(this, 0);
                },
                onlinePlayer: function(eD) {
                    setUserOffline_changpai(this, 0);
                },
                playerStatusChange: function(eD) {
                    setUserOffline_changpai(this, 0);
                },
                MJFlower: function(eD) {
                    HandleMJFlower_changpai(this, eD, 0);
                },
                MJTing: function (eD) {
                    HandleMJTing(this, eD, 0);
                },
                buLongCards: function (eD) {
                    HandleBuLongCards(eD.buCards);
                }
            }
        },
        right: {
            head: {
                di:{

                },
                zhuang: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        waitPut: function() {
                            showUserZhuangLogo_changpai(this, 1);
                        },
                        initSceneData: function() {
                            if (IsArrowVisible_changpai()) showUserZhuangLogo_changpai(this, 1);
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
                    showPlayerInfo_changpai(1, btn);
                },
                _event: {
                    loadWxHead: function(d) {
                        setWxHead_changpai(this, d, 1);
                    },
                    addPlayer: function(eD) {
                        showFangzhuTagIcon_changpai(this,1);
                    },
                    removePlayer: function(eD) {
                        showFangzhuTagIcon_changpai(this,1);
                    }
                },
                _run: function () {
                    // this.zIndex = 600;
                    showFangzhuTagIcon_changpai(this,1);
                },
                score_bg:{_visible:false},
                name_bg:{_visible:false},
                flower_layout: {_visible:false},
                flower_zfb_layout : {_visible:false},
                tingCard: {
                    _visible:false,
                    _event: {
                        MJTing: function (eD) {
                            if(MjClient.playui.isPlayerPutCard(eD,1))
                            {
                                var pl = getUIPlayer_changpai(1);
                                pl.putCardAfterTing = eD.putCardAfterTing;
                                MjClient.playui.setTingCardInfo(this,eD,1);
                            }
                        },
                        clearCardUI: function(eD) {

                            this.visible = false;
                        },
                        MJHu: function(eD) {
                            this.visible = false;
                        },
                        onlinePlayer: function(eD) {
                            //MjClient.playui.setTingCardInfo(this,eD,1);
                        },
                        initSceneData:function(eD)
                        {
                            MjClient.playui.setTingCardInfo(this,eD,1);
                        }
                    }
                },
                tingIcon: {
                    _visible:false,
                    _run:function(){
                        this.visible = false;

                        this.runAction(cc.sequence(cc.spawn(cc.tintTo(0.6, 255,0,0),cc.scaleTo(0.6,this.getScale() + 0.3)),
                            cc.spawn(cc.tintTo(0.6, 255,255,255),cc.scaleTo(0.6,this.getScale()))).repeatForever());
                    },
                    _event: {
                        clearCardUI: function(eD) {
                            this.visible = false;
                        },
                        MJHu: function(eD) {
                            this.visible = false;
                        },
                        moveHead: function() {
                            MjClient.playui.tingIconVisible(this, 1);
                        },
                        onlinePlayer: function(eD) {
                            //MjClient.playui.tingIconVisible(this,1);
                        },
                        initSceneData:function(eD)
                        {
                            MjClient.playui.tingIconVisible(this,1);
                        },
                        roundEnd: function(){
                            // cc.log("end rounde------------------------");
                            this.visible = false;
                        }
                    }
                },
                huaCount: {
                    _visible: false,
                    _event:{
                        clearCardUI: function() {
                            this.visible = false;
                        },
                        initSceneData: function(eD) {
                            this.visible = false;
                        },
                        mjhand: function(eD) {
                            var pl = getUIPlayer_changpai(1);
                            if(pl && pl.mjhand) this.visible = true;
                        }
                    }
                },
                flowerIcon:{
                    _event:{
                        clearCardUI: function() {
                            this.visible = false;
                        },
                        initSceneData: function(eD) {
                            this.visible = false;
                        },
                        mjhand: function(eD) {
                            this.visible = true;
                        }
                    }
                },
                huCount:{
                    _event:{
                        clearCardUI: function() {
                            this.visible = false;
                        },
                        initSceneData: function(eD) {
                            this.visible = false;
                        },
                        mjhand: function(eD) {
                            var pl = getUIPlayer_changpai(1);
                            if(pl && pl.mjhand) this.visible = true;
                        }
                    }
                },
                icon_jiaBei:{
                    _run: function(){
                        // setWgtLayout(this, [0.3, 0.3], [-0.4, 0], [0, 0], false, false);
                    },
                    _event:{
                        JiaBeiToAllPlayer: function(d){
                            MjClient.playui.JiaBeiIconProcess(this, 1);
                            if(d.allSelect){
                                this.visible = false;
                            }
                        },
                        clearCardUI: function() {
                            this.visible = false;
                        },
                        initSceneData: function() {
                            MjClient.playui.JiaBeiIconProcess(this, 1);
                        },
                        mjhand: function() {
                            this.visible = false;
                        },
                    }
                },
                jiaBei:{
                    _event:{
                        JiaBeiToAllPlayer: function(){
                            MjClient.playui.JiaBeiProcess(this, 1);
                            var tData = MjClient.data.sData.tData;
                            if(tData.allSelect){
                                MjClient.playui.CleanMjHand(getNode(1), 1);
                                InitUserHandUI_qutang_23zhang(getNode(1), 1);
                                MjClient.playui.showflowerCount_QuTang(getNode(1), 1);
                            }
                        },
                        clearCardUI: function() {
                            this.visible = false;
                        },
                        initSceneData: function(eD) {
                            MjClient.playui.JiaBeiProcess(this, 1);
                        },
                        mjhand: function(eD) {
                            MjClient.playui.JiaBeiProcess(this, 1);
                        }
                    }
                },
                quanHunImg:{
                    _event:{
                        QuanHunToAllPlayer: function(d){
                            MjClient.playui.QuanHunProcess(this, 1);
                            var pl = getUIPlayer_changpai(1);
                            if (pl && pl.info.uid === d.uid && pl.isQuanHun) {
                                playEffectInPlay("quanhun");
                                ShowEatActionAnim(getNode(1), ActionType.BAOQUANHUN, 1);
                            }
                        },
                        clearCardUI: function() {
                            this.visible = false;
                        },
                        initSceneData: function() {
                            MjClient.playui.QuanHunProcess(this, 1);
                        },
                        mjhand: function() {
                            this.visible = false;
                        }
                    }
                }
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
                _visible: false,
                _run: function () {
                    if(isIPhoneX()){
                        setWgtLayout(this, [0.15, 0.15], [0.80, 0.9], [0, 0])
                    }else{
                        setWgtLayout(this, [0.15, 0.15], [0.83, 0.9], [0, 0])
                    }
                },

            },
            stand_0: {
                _visible: false,
                _run: function () {
                    if(isIPhoneX()){
                        setWgtLayout(this, [0.15, 0.15], [0.85, 0.9], [0, 0])
                    }else{
                        setWgtLayout(this, [0.15, 0.15], [0.88, 0.9], [0, 0])
                    }
                },
            },
            up: {
                _layout: [
                    [0.15, 0.15],
                    [0.75, 0.9],
                    [0, 0]
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
                _visible: false,
                _run: function () {
                    if(isIPhoneX()){
                        setWgtLayout(this, [0, 0.05], [0.95, 0.5], [-6.4, -2])
                    }else if(isIPad()){
                        setWgtLayout(this, [0, 0.05], [0.95, 0.5], [-3.9, -2])
                    } else{
                        setWgtLayout(this, [0, 0.05], [0.95, 0.5], [-4.9, -2])
                    }
                    if(MjClient.MaxPlayerNum_changPai === 2){
                        this.x -= 20;
                    }
                },
            },
            out1: {
                _visible: false,
                _run: function () {
                    if(isIPhoneX()){
                        setWgtLayout(this, [0, 0.05], [0.95, 0.5], [-7.6, -2])
                    }else if(isIPad()){
                        setWgtLayout(this, [0, 0.05], [0.95, 0.5], [-5.1, -2])
                    }else{
                        setWgtLayout(this, [0, 0.05], [0.95, 0.5], [-6.1, -2])
                    }
                    if(MjClient.MaxPlayerNum_changPai === 2){
                        this.x -= 20;
                    }
                },
            },
            out2: {
                _visible: false,
                _run: function () {
                    if(isIPhoneX()){
                        setWgtLayout(this, [0, 0.05], [0.95, 0.5], [-8.8, -2])
                    }else{
                        setWgtLayout(this, [0, 0.05], [0.95, 0.5], [-7.3, -2])
                    }
                    if(MjClient.MaxPlayerNum_changPai === 2){
                        this.x -= 20;
                    }
                },
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
                    clearCardUI_changpai(this, 1);
                },
                initSceneData: function(eD) {
                    SetUserVisible_qutang_23zhang(this, 1);
                },
                addPlayer: function(eD) {
                    SetUserVisible_qutang_23zhang(this, 1);
                },
                removePlayer: function(eD) {
                    SetUserVisible_qutang_23zhang(this, 1);
                },
                mjhand: function(eD) {
                    InitUserHandUI_qutang_23zhang(this, 1);
                },
                roundEnd: function() {
                    InitUserCoinAndName_changpai(this, 1);
                },
                waitPut: function(eD) {
                    DealWaitPut_changpai(this, eD, 1);
                },
                MJPut: function(eD) {
                    DealMJPut_changpai(this, eD, 1);
                    if(eD.uid != SelfUid())
                    {
                        hideTingBtn();
                    }
                    setUserOffline_changpai(this, 1);
                },
                MJChi: function(eD) {
                    DealMJChi(this, eD, 1);
                    setUserOffline_changpai(this, 1);
                },
                MJGang: function(eD) {
                    DealMJGang_changpai(this, eD, 1);
                    setUserOffline_changpai(this, 1);
                },
                MJPeng: function(eD) {
                    DealMJPeng_changpai(this, eD, 1);
                    setUserOffline_changpai(this, 1);
                },
                MJHu: function(eD) {
                    HandleMJHu(this, eD,1);
                    setUserOffline_changpai(this, 1);
                },
                onlinePlayer: function(eD) {
                    setUserOffline_changpai(this, 1);
                },
                playerStatusChange: function(eD) {
                    setUserOffline_changpai(this, 1);
                },
                MJFlower: function(eD) {
                    HandleMJFlower_changpai(this, eD, 1);
                },
                MJTing: function (eD) {
                    HandleMJTing(this, eD, 1);
                }
            }
        },
        top: {
            head: {
                di:{

                },
                zhuang: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        waitPut: function() {
                            showUserZhuangLogo_changpai(this, 2);
                        },
                        initSceneData: function() {
                            if (IsArrowVisible_changpai()) showUserZhuangLogo_changpai(this, 2);
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
                    cc.log("=============top head ======");
                    showPlayerInfo_changpai(2, btn);
                },
                _event: {
                    loadWxHead: function(d) {
                        setWxHead_changpai(this, d, 2);
                    },
                    addPlayer: function(eD) {
                        showFangzhuTagIcon_changpai(this,2);
                    },
                    removePlayer: function(eD) {
                        showFangzhuTagIcon_changpai(this,2);
                    }
                },
                _run: function () {
                    // this.zIndex = 600;
                    showFangzhuTagIcon_changpai(this,2);
                },
                score_bg:{_visible:false},
                name_bg:{_visible:false},
                flower_layout: {_visible:false},
                flower_zfb_layout : {_visible:false},
                tingCard: {
                    _visible:false,
                    _event: {
                        MJTing: function (eD) {
                            if(MjClient.playui.isPlayerPutCard(eD,2))
                            {
                                var pl = getUIPlayer_changpai(2);
                                pl.putCardAfterTing = eD.putCardAfterTing;
                                MjClient.playui.setTingCardInfo(this,eD,2);
                            }
                        },
                        clearCardUI: function(eD) {
                            cc.log("ready to----- clear sking ----");
                            this.visible = false;
                        },
                        moveHead: function(eD) {
                            cc.log("top---moveHead ----");
                            MjClient.playui.setTingCardInfo(this,eD,2);
                        },
                        MJHu: function(eD) {
                            this.visible = false;
                        },
                        onlinePlayer: function(eD) {
                            cc.log("top---onlinePlayer ----");
                            //MjClient.playui.setTingCardInfo(this,eD,2);
                        },
                        initSceneData:function(eD)
                        {
                            MjClient.playui.setTingCardInfo(this,eD,2);
                        }
                    }
                },
                tingIcon: {
                    _visible:false,
                    _run:function(){
                        this.visible = false;
                        this.runAction(cc.sequence(cc.spawn(cc.tintTo(0.6, 255,0,0),cc.scaleTo(0.6,this.getScale() + 0.3)),
                            cc.spawn(cc.tintTo(0.6, 255,255,255),cc.scaleTo(0.6,this.getScale()))).repeatForever());
                    },
                    _event: {
                        clearCardUI: function(eD) {
                            this.visible = false;
                            cc.log("tingIcon 22 ----- clearCardUI----");
                        },
                        MJHu: function(eD) {
                            this.visible = false;
                        },
                        moveHead: function() {
                            MjClient.playui.tingIconVisible(this, 2);
                        },
                        onlinePlayer: function(eD) {
                            //MjClient.playui.tingIconVisible(this,2);
                        },
                        initSceneData:function(eD)
                        {
                            MjClient.playui.tingIconVisible(this,2);
                        },
                        roundEnd: function(){
                            // cc.log("end rounde------------------------222");
                            this.visible = false;
                        }
                    }
                },
                huaCount: {
                    _visible: false,
                    _event:{
                        clearCardUI: function() {
                            this.visible = false;
                        },
                        initSceneData: function(eD) {
                            this.visible = false;
                        },
                        mjhand: function(eD) {
                            var pl = getUIPlayer_changpai(2);
                            if(pl && pl.mjhand) this.visible = true;
                        }
                    }
                },
                flowerIcon:{
                    _event:{
                        clearCardUI: function() {
                            this.visible = false;
                        },
                        initSceneData: function(eD) {
                            this.visible = false;
                        },
                        mjhand: function(eD) {
                            this.visible = true;
                        }
                    }
                },
                huCount:{
                    _event:{
                        clearCardUI: function() {
                            this.visible = false;
                        },
                        initSceneData: function(eD) {
                            this.visible = false;
                        },
                        mjhand: function(eD) {
                            var pl = getUIPlayer_changpai(2);
                            if(pl && pl.mjhand) this.visible = true;
                        }
                    }
                },
                icon_jiaBei:{
                    _run: function(){
                        // setWgtLayout(this, [0.3, 0.3], [0.55, 0], [0, 0], false, false);
                    },
                    _event:{
                        JiaBeiToAllPlayer: function(d){
                            MjClient.playui.JiaBeiIconProcess(this, 2);
                            if(d.allSelect){
                                this.visible = false;
                            }
                        },
                        clearCardUI: function() {
                            this.visible = false;
                        },
                        initSceneData: function() {
                            MjClient.playui.JiaBeiIconProcess(this, 2);
                        },
                        mjhand: function() {
                            this.visible = false;
                        },
                    }
                },
                jiaBei:{
                    _event:{
                        JiaBeiToAllPlayer: function(){
                            MjClient.playui.JiaBeiProcess(this, 2);
                            var tData = MjClient.data.sData.tData;
                            if(tData.allSelect){
                                MjClient.playui.CleanMjHand(getNode(2), 2);
                                InitUserHandUI_qutang_23zhang(getNode(2), 2);
                                MjClient.playui.showflowerCount_QuTang(getNode(2), 2);
                            }
                        },
                        clearCardUI: function() {
                            this.visible = false;
                        },
                        initSceneData: function(eD) {
                            MjClient.playui.JiaBeiProcess(this, 2);
                        },
                        mjhand: function(eD) {
                            MjClient.playui.JiaBeiProcess(this, 2);
                        }
                    }
                },
                quanHunImg:{
                    _event:{
                        QuanHunToAllPlayer: function(d){
                            MjClient.playui.QuanHunProcess(this, 2);
                            var pl = getUIPlayer_changpai(2);
                            if (pl && pl.info.uid === d.uid && pl.isQuanHun) {
                                playEffectInPlay("quanhun");
                                ShowEatActionAnim(getNode(2), ActionType.BAOQUANHUN, 2);
                            }
                        },
                        clearCardUI: function() {
                            this.visible = false;
                        },
                        initSceneData: function() {
                            MjClient.playui.QuanHunProcess(this, 2);
                        },
                        mjhand: function() {
                            this.visible = false;
                        }
                    }
                }
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
                _visible: false,
                _run: function () {
                    if(isIPhoneX()){
                        setWgtLayout(this, [0.15, 0.15], [0.14, 0.9], [0, 0])
                    }else{
                        setWgtLayout(this, [0.15, 0.15], [0.17, 0.9], [0, 0])
                    }
                },
            },
            stand_0: {
                _visible: false,
                _run: function () {
                    if(isIPhoneX()){
                        setWgtLayout(this, [0.15, 0.15], [0.09, 0.9], [0, 0])
                    }else{
                        setWgtLayout(this, [0.15, 0.15], [0.12, 0.9], [0, 0])
                    }
                },
            },
            up: {
                _layout: [
                    [0.15, 0.15],
                    [0.2,0.95],
                    [0, 0]
                ],
                _visible: false
            },
            down: {
                _layout: [
                    [0, 0.07],
                    [0.5, 1],
                    [6, -2.2]
                ],
                _visible: false
            },
            out0: {
                _visible: false,
                _run: function () {
                    if(isIPhoneX()){
                        setWgtLayout(this, [0, 0.05], [0.08, 0.62], [3.4, 4.8])
                    }else if(isIPad()){
                        setWgtLayout(this, [0, 0.05], [0.08, 0.62], [3.2, 4.8])
                    }else{
                        setWgtLayout(this, [0, 0.05], [0.08, 0.62], [4.1, 4.8])
                    }
                },
            },
            out1: {
                _visible: false,
                _run: function () {
                    if(isIPhoneX()){
                        setWgtLayout(this, [0, 0.05], [0.08, 0.62], [4.4, 4.8])
                    }else if(isIPad()){
                        setWgtLayout(this, [0, 0.05], [0.08, 0.62], [4.2, 4.8])
                    }else{
                        setWgtLayout(this, [0, 0.05], [0.08, 0.62], [5.1, 4.8])
                    }
                },
            },
            out2: {
                _visible: false,
            },
            outBig: {
                _layout: [
                    [0.0836, 0],
                    [0.25, 0.58],
                    [0, 0]
                ],
                _visible: false
            },
            _run: function(){
                if(MjClient.MaxPlayerNum_changPai === 2){
                    this.visible = false;
                }
            },
            _event: {
                clearCardUI: function() {
                    clearCardUI_changpai(this, 2);
                },
                initSceneData: function(eD) {
                    SetUserVisible_qutang_23zhang(this, 2);
                },
                addPlayer: function(eD) {
                    SetUserVisible_qutang_23zhang(this, 2);
                },
                removePlayer: function(eD) {
                    SetUserVisible_qutang_23zhang(this, 2);
                },
                mjhand: function(eD) {
                    InitUserHandUI_qutang_23zhang(this, 2);
                },
                roundEnd: function() {
                    InitUserCoinAndName_changpai(this, 2);

                },
                waitPut: function(eD) {
                    DealWaitPut_changpai(this, eD, 2);
                },
                MJPut: function(eD) {
                    DealMJPut_changpai(this, eD, 2);
                    if(eD.uid != SelfUid())
                    {
                        hideTingBtn();
                    }
                    setUserOffline_changpai(this, 2);
                },
                MJChi: function(eD) {
                    DealMJChi(this, eD, 2);
                    setUserOffline_changpai(this, 2);
                },
                MJGang: function(eD) {
                    DealMJGang_changpai(this, eD, 2);
                    setUserOffline_changpai(this, 2);
                },
                MJPeng: function(eD) {
                    DealMJPeng_changpai(this, eD, 2);
                    setUserOffline_changpai(this, 2);
                },
                MJHu: function(eD) {
                    HandleMJHu(this, eD,2);
                    setUserOffline_changpai(this, 2);
                },
                onlinePlayer: function(eD) {
                    setUserOffline_changpai(this, 2);
                },
                playerStatusChange: function(eD) {
                    setUserOffline_changpai(this, 2);
                },
                MJFlower: function(eD) {
                    HandleMJFlower_changpai(this, eD, 2);
                },
                MJTing: function (eD) {
                    HandleMJTing(this, eD, 2);
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
                        MjClient.clickTing = true;
                        eat.hu._node.visible = false;
                        MjClient.playui.CardLayoutRestore(MjClient.playui._downNode, 0);
                        /*
                         设置当前听牌的张数
                         */
                        var pl = getUIPlayer_changpai(0);
                        var currentCard = CurrentPutCardMsg_changpai();
                        var tingCards = getCheckTingHuCards(currentCard,pl.mjhand);
                        cc.log("===========ting cards ===" + tingCards);
                        setCurrentTingNum_changpai(tingCards);

                    }
                }
            },
            tingDi: {
                _visible: false,
                _layout: [
                    [0, 0.1],
                    [0.5, 0.2],
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
                        eat.tingDi._node.visible = false;
                        eat.long._node.visible = false;
                        eat.cancel._node.visible = true;
                        MjClient.clickTing = true;
                        eat.hu._node.visible = false;
                        MjClient.playui.CardLayoutRestore(MjClient.playui._downNode, 0);
                        /*
                         设置当前听牌的张数
                         */
                        var pl = getUIPlayer_changpai(0);
                        var currentCard = CurrentPutCardMsg_changpai();


                        var tingCards = getCheckTingHuCards(currentCard,pl.mjhand);
                        cc.log("===========ting cards ===" + tingCards);
                        setCurrentTingNum_changpai(tingCards);

                    }
                }
            },
            long: {
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
                _click: function() {
                    MJGangCardchange_MJH();
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
                    if (eT == 2) MJGangCardchange_MJH(btn.tag);
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
                    if (eT == 2) MJGangCardchange_MJH(btn.tag);
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
                    if (eT == 2) MJGangCardchange_MJH(btn.tag);
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
                        MjClient.MJPass2NetForQuTang23Zhang();
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
                    [0.76, 0.1],
                    [0, 1.8]
                ],
                _touch: function(btn, eT) {
                    if (eT == 2) {
                        btn.visible = false;
                        MjClient.clickTing = false;
                        //hideCurrentTingNum();
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
                        [0.5, 0.3],
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
                                if (eT == 2) MjClient.MJPass2NetForQuTang23Zhang();
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
                    setSkipHuState_qutang_23zhang();
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
                waitLong: function(eD) {
                    console.log("HHH :，waitLong------");
                    MjClient.playui.EatVisibleCheck();
                },
                initSceneData: function(eD) {
                    function delayExe()
                    {
                        MjClient.playui.EatVisibleCheck();
                    }
                    this.runAction(cc.sequence(cc.DelayTime(0.1),cc.callFunc(delayExe)));
                }
            }
        },
        chat_btn: {
            _layout: [
                [0.08, 0.08],
                [0.97, 0.38],
                [0, 0]
            ],
            _click: function() {
                var chatlayer = new ChatLayer();
                MjClient.Scene.addChild(chatlayer);
            }
        },
        voice_btn: {
            _layout: [
                [0.08, 0.08],
                [0.97, 0.47],
                [0, 0]
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
                [0.08, 0.08],
                [0.97, 0.56],
                [0, 0]
            ],
            _run: function() {
                this.visible = true;
                this.opacity = 255;
                if (IsArrowVisible()) this.visible = true;
            },
            _touch: function(btn, eT) {
                if (eT == 2) {
                    //显示花
                    var layer = new showFlowerLayer();
                    MjClient.Scene.addChild(layer);
                }
            }
        },
        BtnPutCards:{
            _run: function () {
                this.visible = false;
                setWgtLayout(this,[0.1, 0.1], [0.1, 0.03], [0, 0]);
            },
            _click: function(btn) {
                cc.log("已出的牌");
                MjClient.playui.addChild(new putCardsLayer());
            },
            _event: {
                mjhand: function () {
                    this.visible = true;
                },
                initSceneData:function()
                {
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    if(
                        tData.tState == TableState.waitPut ||
                        tData.tState == TableState.waitEat ||
                        tData.tState == TableState.waitCard
                    )
                    {
                        this.visible = true;
                    }
                }
            }
        },
        Panel_jiabei:{
            _run: function () {
                this.zIndex = 500;
                this.visible = false;
                setWgtLayout(this,[1, 1], [0.5, 0.5], [0, 0]);
            },
            Img_clock: {
                number:{
                    _event:{
                        ShowJiaBeiPanel:function () {
                            if(MjClient.playui._canJiaBei){
                                this.ignoreContentAdaptWithSize(true);
                                var pl = getUIPlayer_changpai(0);
                                var time = pl.selectTime;   // 从服务器取得剩余时间
                                var that = this;
                                that.setString(time);
                                that.schedule(function () {
                                    that.setString(time);
                                    if (time > 0) {
                                        time --;
                                    }else {
                                        // 倒计时结束之后默认选择不加倍
                                        postEvent("BuJiaBeiEvent");
                                        postEvent("HideJiaBeiPanel");
                                        MjClient.gamenet.request("pkroom.handler.tableMsg", {
                                            cmd: "QTJiaBei",
                                            jiabei: 1,
                                        });
                                    }
                                }, 1, cc.REPEAT_FOREVER, 0);
                            }
                        },
                        HideJiaBeiPanel: function () {
                            this.unscheduleAllCallbacks();
                        }
                    }
                }
            },
            Img_tip:{
                _run: function () {
                    setWgtLayout(this,[0, 0.07], [0.5, 0.14], [0, 0], false, true);
                    if(isIPad()){
                        setWgtLayout(this,[0, 0.07], [0.5, 0], [0, 0], false, true);
                    }
                }
            },
            _event:{
                clearCardUI:function(){
                    this.visible = false;
                },
                mjhand:function(){
                    if (checkShowJiaBei()) {
                        postEvent("ShowJiaBeiPanel");
                    }
                },
                initSceneData: function() {
                    var pl = getUIPlayer_changpai(0);
                    if(pl && pl.jiabei === 0 && checkShowJiaBei()) postEvent("ShowJiaBeiPanel");
                },
                HideJiaBeiPanel: function() {
                    this.visible = false;
                },
                ShowJiaBeiPanel: function () {
                    if(MjClient.playui._canJiaBei){
                        this.visible = true;
                        this.opacity = 0;
                        this.runAction(cc.fadeIn(0.5));
                    }else{
                        this.visible = false;
                    }
                },
                JiaBeiEvent: function(){
                    var pl = getUIPlayer_changpai(0);
                    if(pl) pl.jiabei = 2;     // pl.jiabei等于2表示加倍
                },
                BuJiaBeiEvent: function(){
                    var pl = getUIPlayer_changpai(0);
                    if(pl) pl.jiabei = 1;     // pl.jiabei等于1表示不加倍
                }
            },
            Btn_jiabei: {
                _click:function () {
                    postEvent("HideJiaBeiPanel");
                    postEvent("JiaBeiEvent");
                    MjClient.gamenet.request("pkroom.handler.tableMsg", {
                        cmd: "QTJiaBei",
                        jiabei: 2,           //  jiabei等于2表示加倍
                    });
                }
            },
            Btn_bujiabei:{
                _click:function () {
                    postEvent("HideJiaBeiPanel");
                    postEvent("BuJiaBeiEvent");
                    MjClient.gamenet.request("pkroom.handler.tableMsg", {
                        cmd: "QTJiaBei",
                        jiabei: 1,           //  jiabei等于1表示不加倍
                    });
                }
            }
        },
        Panel_quanhun:{
            _run: function () {
                this.visible = false;
                setWgtLayout(this,[0.85, 0.85], [0.5, 0], [0, 0], false, false);
            },
            _event:{
                clearCardUI:function(){
                    this.visible = false;
                },
                SelectedQuanHun: function () {
                    this.visible = true;
                    MjClient.playui.jsBind.eat._node.visible = false;
                    MjClient.playui.setEatVisibleFalse();
                },
                HideQunHunPanel: function () {
                    this.visible = false;
                },
                initSceneData: function() {
                    var pl = getUIPlayer_changpai(0);
                    if(pl && pl.isSelectedPower){
                        this.visible = true;
                        MjClient.playui.jsBind.eat._node.visible = false;
                        MjClient.playui.setEatVisibleFalse();
                    }
                },
                mjhand:function () {
                    this.visible = false;
                }
            },
            Btn_quanhun:{
                bg_img:{
                    _run:function(){
                        var ls = this.getScale();
                        var a = cc.scaleTo(0.5,ls * 1.0);
                        var aa = cc.fadeIn(0.5);
                        var a1 = cc.scaleTo(1,ls * 1.3);
                        var a2 = cc.fadeOut(1);
                        var a3 = cc.callFunc(function(){
                            this.setScale(ls * 0.95);
                        }.bind(this));
                        this.runAction(cc.sequence(cc.spawn(a,aa), cc.spawn(a1, a2).easing(cc.easeCubicActionOut()),a3,cc.delayTime(0.2)).repeatForever());
                    }
                },
                _click:function(){
                    MjClient.gamenet.request("pkroom.handler.tableMsg", {
                        cmd: "QuanHun",
                        isQuanHun: true
                    });
                    postEvent("HideQunHunPanel");
                }
            },
            Btn_guo:{
                _click:function(){
                    MjClient.gamenet.request("pkroom.handler.tableMsg", {
                        cmd: "QuanHun",
                        isQuanHun: false
                    });
                    postEvent("HideQunHunPanel");
                    MjClient.playui.EatVisibleCheck();
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
    ctor: function() {
        this._super();
        var playui = ccs.load(res.Play_rugao_qutang_23zhang_json);
        playMusic("bgFight");
        this._downNode  = playui.node.getChildByName("down");
        this._rightNode = playui.node.getChildByName("right");
        this._topNode   = playui.node.getChildByName("top");
        this._leftNode  = playui.node.getChildByName("left");
        this._canJiaBei = MjClient.data.sData.tData.areaSelectMode.canJiaBei;
        MjClient.MaxPlayerNum_changPai = parseInt(MjClient.data.sData.tData.maxPlayer);
        MjClient.playui = this;
        this._btnPutCard = playui.node.getChildByName("BtnPutCard");
        this._tingCardsNode = this._downNode.getChildByName("tingCardsNode");
        this._tingCardNumNode = this._downNode.getChildByName("tingCardNumNode");
        MjClient.playui._AniNode =  playui.node.getChildByName("eat");
        BindUiAndLogic(playui.node, this.jsBind);
        this.addChild(playui.node);


       // MjClient.playui._btnFlower = playui.node.getChildByName("hua_btn");

        MjClient.lastMJTick = Date.now();
        this.runAction(cc.repeatForever(cc.sequence(cc.callFunc(function() {
            if (MjClient.game_on_show) MjClient.tickGame(0);
        }), cc.delayTime(7))));


        changeMJBg(this, getCurrentMJBgType());
        //初始化其他功能
        initSceneFunc();
        // 在亲友圈房间中添加邀请亲友圈牌有一起对局
        addClubYaoqingBtn(1);
        
        return true;
    },
    /*
     判断当前是否可以出牌，add by
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
        var pl = getUIPlayer_changpai(off)
        if(pl == null) return;
        var tData = MjClient.data.sData.tData;
        cc.log("offffffffffffffffffffff  =  " + off );
        //cc.log("(((((((((((( set card))))))))))))))))) == pl.mjState  " + pl.mjState );

        if(pl && (pl.mjState == TableState.isReady || pl.mjState == TableState.roundFinish))
        {
            //准备状态时，所有的听Icon不可见
            //var node = node.getParent().getParent().getParent().getChildByName("")
            // var _tingIcon1 = this._downNode.getChildByName("head").getChildByName("tingIcon");
            // _tingIcon1.visible = false;
            //
            // var _tingIcon2 = this._rightNode.getChildByName("head").getChildByName("tingIcon");
            // _tingIcon2.visible = false;
            //
            // var _tingIcon3 = this._topNode.getChildByName("head").getChildByName("tingIcon");
            // _tingIcon3.visible = false;

            node.visible = false;
        }else{
            if(pl != null)
            {
                if (pl.isTing) {
                    // cc.log("(((((((((((( TableState.isReady))))))))))))))))) == pl.isTing  " + pl.isTing);
                    node.visible = true;
                    if (off == 0)
                    {
                        var tingSet = calTingSet(pl.mjhand);
                        setTingCards_changpai(this._tingCardsNode,tingSet);
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
        var pl = getUIPlayer_changpai(off);
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

PlayLayer_qutang_23zhang.prototype.CardLayoutRestore = function(node, off)
{
    // node 是克隆新建的一个麻将节点 by sking
    var newC = null; //先创建麻将的UI节点
    var newVal = 0; //新牌的值，是几万，几筒，几条....为数字
    var pl = getUIPlayer_changpai(off);//获取玩家信息.off 为0 ，就是自己得信息，能看到自己摸牌 by sking
    var mjhandNum = 0;
    var children = node.children;
    var sData = MjClient.data.sData;
    var tData = sData.tData;

    for(var i = 0; i < children.length; i++)
    {
        if(children[i].name === "mjhand")
        {
            mjhandNum++;
            setStandUIY(children[i]);
        }
    }

    var tempMaJiang = MjClient.majiang; //麻将的各种方法判断，是否可以杠，是否可以吃... by sking
    if(!pl) return;

    //排序麻将的位置 by sking
    if (pl.mjhand && pl.mjhand.length > 0)
    {
        var count = tempMaJiang.CardCount(pl);
        cc.log("====================---   new pl.count==== " + count);
        if(count === 23)//&& mjhandNum == pl.mjhand.length
        {
            // 防止未选择是否加倍，标记newcard的值
            if(MjClient.playui._canJiaBei && !tData.allSelect)
            {
                newVal = 0;
            }
            else
            {
                if(pl.isNew) //isNew 每次摸完牌后设为true,打出去一张牌后 设为false by sking
                {
                    newVal = pl.mjhand[pl.mjhand.length - 1]; //为什么取最后一个节点 ？
                    cc.log("--------ddddddddddd---new val = " + newVal);

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
    }


    //up stand 是2种麻将的图。
    var up = node.getChildByName("up");
    var stand = node.getChildByName("stand");
    var stand_0 = node.getChildByName("stand_0");
    var upSize = stand.getSize();
    var upS = stand.scale;

    //mjhand standPri out chi peng gang0 gang1
    var uipeng = [];
    var uigang0 = [];
    var uigang1 = [];
    var uichi = [];
    var uistand = [];
    var uihun = [];//癞子牌在最左边
    var uilong = [];
    for(var i = 0; i < children.length; i++) //children 为 "down" 节点下的字节点
    {
        var ci = children[i];
        if(ci.name === "mjhand")
        {
            if(newC == null && newVal === ci.tag)
            {
                newC = ci;                                 //newC就是新摸的那张手牌
            }
            else
            {
                if(tempMaJiang.isEqualHunCard(ci.tag))
                {
                    uihun.push(ci);
                }
                else
                {
                    uistand.push(ci);
                }
            }
            if(tempMaJiang.isEqualHunCard(ci.tag))
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
        else if (ci.name == "long")
        {
            uilong.push(ci);
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
    uistand.sort(TagOrder);

    // 为了使手牌排序后，层级混乱问题（如皋麻将胡有两层手牌，会出现层级不统一问题）
    for (var m = 0; m < uistand.length; m++) {
        uistand[m].zIndex = m + 500; // +500 为了手牌不被已打出的牌遮挡
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
        uistand.push(newC); //把这张牌放入手牌的数组里  by sking
    }
    var uiOrder = [uigang1, uigang0, uilong,uipeng, uichi, uistand];
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
    var typeCount = 0;


    /*
        sort by sking
    */
    //cc.log("555555555555555-------------------------pl.mjgang1 = "+ JSON.stringify(pl.mjgang1));
    //排序
    //按照顺序存贮节点，杠
    var _uigang1 = [];
    for(var a = 0;a < pl.mjgang1.length;a++)
    {
        for(var b = 0;b < uigang1.length;b++)
        {
            var _ci = uigang1[b];
            if(_ci.tag  == pl.mjgang1[a])
            {
                ///cc.log("--------------------mjgang1 = " + _ci.tag);
                _uigang1.push(_ci);
            }
        }
    }
    uigang1 = _uigang1;


    var _uilong = [];
    if(pl.long)
    {
        for(var a = 0;a < pl.long.length;a++)
        {
            for(var b = 0;b < uilong.length;b++)
            {
                var _ci = uilong[b];
                if(_ci.tag  == pl.long[a])
                {
                    cc.log("--------------------long = " + _ci.tag);
                    _uilong.push(_ci);
                }
            }
        }
    }

    uilong = _uilong;


    //按照顺序存贮节点，杠
    //cc.log("555555555555555-------------------------pl.mjgang0 = "+ JSON.stringify(pl.mjgang0));
    var _uigang0 = [];
    for(var a = 0;a < pl.mjgang0.length;a++)
    {
        for(var b = 0;b < uigang0.length;b++)
        {
            var _ci = uigang0[b];
            if(_ci.tag  == pl.mjgang0[a])
            {
                cc.log("---------------------gang0 = " + _ci.tag);
                _uigang0.push(_ci);
            }
        }
    }
    uigang0 = _uigang0;



    //按照顺序存贮节点,碰
    //cc.log("5555555555555555-------------------------pl.mjpeng = "+ JSON.stringify(pl.mjpeng));
    var _uipeng = [];
    for(var a = 0;a < pl.mjpeng.length;a++)
    {
        for(var b = 0;b < uipeng.length;b++)
        {
            var _ci = uipeng[b];
            if(_ci.tag  == pl.mjpeng[a])
            {
                //cc.log("===============mjpeng = " + _ci.tag);
                _uipeng.push(_ci);
            }
        }
    }
    uipeng = _uipeng;


    if(off === 0) {
        var chipengGap = 0.84;
        var _onechipenggangWith = upSize.width * upS * chipengGap;
        var _uiDx = _onechipenggangWith * 3.45;
        var startX = isIPhoneX() ? 0.24 : 0.22;
        var standStartX = MjClient.size.width * startX;
        var leftStartX = standStartX;//左边的起点
        var uiArray0 = [uigang0, uigang1, uilong, uipeng, uichi];
        var StandY = stand.y;
        var secStandY = stand_0.y;
        var bchigangChanged = false;//吃碰杠是否需要换行

        //chipenggangCount = pl.mjpeng.length + pl.mjgang0.length + pl.mjgang1.length;
        var currentCount = 0;
        var bFirstCard = true;

        for(var i = 0;i < uiArray0.length;i++)
        {
            var _uis = uiArray0[i];
            var _idx = 0;
            if(_uis.length > 0)//碰，杠，吃，之间的间距
            {
                currentCount++;
                if(bFirstCard)
                {
                    bFirstCard = false;
                }
                else
                {
                    leftStartX += _uiDx;
                }
            }
            else
            {
                continue;
            }


            for(var j = 0;j < _uis.length;j++)
            {
                var ci = _uis[j];
                if(i === 0 )//明杠
                {
                    if(_idx === 4)
                    {
                        _idx = 0;
                        leftStartX += _uiDx;
                        currentCount++;
                    }
                    else if(_idx === 3)
                    {
                        var _centerCardPos0 = _uis[j - 2].getPosition();
                        ci.setPosition(_centerCardPos0.x,_centerCardPos0.y + upSize.height * upS*0.18);
                        ci.zIndex = 15;
                    }

                    cc.log("明杠-----" + _idx);
                }
                else if(i === 1 || i === 2)//暗杠
                {
                    if(_idx === 4)
                    {
                        _idx = 0;
                        leftStartX += _uiDx;
                        currentCount++;
                        ci.loadTexture(getNewMJBgFile("playing/MJ/Mj_04.png"));
                        ci.removeAllChildren();
                    }
                    else if(_idx != 3)
                    {
                        ci.loadTexture(getNewMJBgFile("playing/MJ/Mj_04.png"));
                        ci.removeAllChildren();
                    }
                    else if(_idx === 3)
                    {
                        var _centerCardPos = _uis[j - 2].getPosition();
                        ci.setPosition(_centerCardPos.x,_centerCardPos.y + + upSize.height * upS*0.18);
                        ci.zIndex = 15;
                    }
                    cc.log("暗杠-----" + _idx);
                }
                else if(i == 3 || i == 4) //碰，吃 三张牌
                {
                    if(_idx == 3)
                    {
                        _idx = 0;
                        leftStartX += _uiDx;
                        currentCount++;
                    }
                }

                var bGangCardSet = false;
                if(i == 1 ||i == 0 || i == 2)//杠的有一张牌放在中间上面
                {
                    if(_idx == 3)
                    {
                        bGangCardSet = true;//杠的第四张牌
                    }
                }

                if(!bchigangChanged && currentCount > 4)
                {
                    cc.log("要换行了-----currentCount = " + currentCount);
                    StandY = secStandY;
                    leftStartX = standStartX - _onechipenggangWith;//左边的起点
                    bchigangChanged = true;
                }

                if(!bGangCardSet)
                {
                    ci.x = leftStartX + _onechipenggangWith*_idx;
                    ci.y = StandY;
                    ci.zIndex = (10 - _idx);
                }
                _idx++;
            }
        }

        cc.log("======================currentCount = " + currentCount);
        cc.log("======================standStartX = " + standStartX);

        //////////////////////////////////////////
        //手牌
        //////////////////////////////////////////
        var withPengGang = (currentCount > 0) ? _onechipenggangWith*0.5 : 0;
        var _onecCardWith = upSize.width * upS * 1.1;//0.05;
        var handStartX = standStartX +　currentCount*_uiDx + withPengGang;    //MjClient.size.width - upSize.width * upS * 1.2;//屏幕宽度;

        var bChanged = false;
        for(var i = 0;i < uistand.length;i++)
        {
            var ci = uistand[i];

            var bsetChanged = false;
            ci.y = StandY;
            var ChangeIdx = currentCount*3 + i;
            if(ChangeIdx >= 11)
            {
                if(!bChanged)
                {
                    StandY = secStandY;
                    var addX = 0;
                    //cc.log("======================currentCount = " + currentCount);
                    if(currentCount >= 4)
                    {
                        addX = (currentCount -4)*_uiDx;
                        //cc.log("======================currentCount = " + currentCount);
                        //cc.log("======================addX = " + addX);
                    }

                    handStartX = standStartX + addX;
                    bsetChanged = true;
                }
            }


            if(i !== 0)
            {
                var preStandX = uistand[i - 1].x;
                if(i === (uistand.length - 1))
                {
                    if(newC)
                    {
                        if(ChangeIdx == 11)//换行
                        {
                            ci.x = standStartX;
                        }
                        else
                        {
                            ci.x = preStandX + _onecCardWith + slotwith;
                        }
                        ci.setColor(cc.color(255, 255, 255));
                        SetTouchCardHandler_changpai(stand, ci);
                        if(!hasUp)
                        {
                            //ci.y += 20;
                            hasUp = true;
                        }
                    }
                    else
                    {
                        if(ChangeIdx == 11)//换行
                        {
                            ci.x = standStartX;
                            cc.log("===========222===========standStartX = " + standStartX);
                        }
                        else
                        {
                            ci.x = preStandX + _onecCardWith;
                        }
                        ci.setColor(cc.color(255, 255, 255));
                        SetTouchCardHandler_changpai(stand, ci);
                    }
                }
                else
                {
                    if(!bChanged && ChangeIdx >= 11)//换行
                    {
                        ci.x = standStartX + withPengGang ;
                        ci.y = secStandY;
                        //StandY = secStandY;
                        //handStartX = standStartX;
                        cc.log("======================standStartX = " + standStartX);
                    }
                    else
                    {
                        ci.x = preStandX + _onecCardWith;
                    }
                }
            }
            else
            {
                if(!bChanged && ChangeIdx >= 11)
                {
                    ci.x = handStartX + withPengGang;
                    ci.y = secStandY;
                    //StandY = secStandY;
                    //handStartX = standStartX;
                }
                else
                {
                    ci.x = handStartX;
                }
            }


            if(!bChanged)
            {
                bChanged = bsetChanged;
            }


            /*
                听牌的时候
           */
            var isGray =  pl.isTing && ci.name == "mjhand";
            if(MjClient.clickTing)
            {


                if (ci.name == "mjhand")
                {
                    //cc.log("=========clickTing true==========" + JSON.stringify(MjClient.canTingCards));
                    //cc.log("=========ci.tag========== " + ci.tag);
                    if(MjClient.canTingCards[ci.tag])
                    {
                        ci.setColor(cc.color(255, 255, 255));
                        if (!hasUp) {
                            ci.y += 20;
                            hasUp = true;
                        }
                    }
                    else {
                        //cc.log("=========clickTing true=====190=====");
                        ci.setColor(cc.color(190, 190, 190));
                    }
                }
                else {
                    ci.setColor(cc.color(255, 255, 255));
                }
            }
            else if(i == uistand.length - 1)
            {
                console.log(ci.tag+"--------newC--------"+newC);
                if(newC)
                {
                    ci.setColor(cc.color(255, 255, 255));
                    SetTouchCardHandler_changpai(stand, ci);
                    // ci.x = ci.x + slotwith + 10;
                    // ci.y += 20;
                }
                else if(isGray)
                {
                    ci.setColor(cc.color(190, 190, 190));
                    ci.addTouchEventListener(function () {});
                }
                else
                {
                    ci.setColor(cc.color(255, 255, 255));
                    SetTouchCardHandler_changpai(stand, ci);
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
                SetTouchCardHandler_changpai(stand, ci);
            }
        }
    }
    else //两侧的
    {
        var _onechipenggangHeight = upSize.height * upS * 0.27;//0.05;
        var _uiDy = _onechipenggangHeight * (3 + 0.5);//0.05;
        var standStartY =  MjClient.size.height*0.88// ;upSize.width * upS * 4;//左边的起点
        var leftStartY = standStartY;//左边的起点
        var uiArray0 = [uigang0, uigang1,uilong, uipeng, uichi];
        var StandX = stand.x;
        var secStandX = stand_0.x;
        var bchigangChanged = false;//吃碰杠是否需要换行
        //var chipenggangCount = pl.mjpeng.length + pl.mjgang0.length + pl.mjgang1.length;
        var currentCount = 0;
        var bFirstCard = true;

        for (var i = 0; i < uiArray0.length; i++) {
            var _uis = uiArray0[i];
            var _idx = 0;
            if (_uis.length > 0)//碰，杠，吃，之间的间距
            {
                currentCount++;
                if (bFirstCard) {
                    bFirstCard = false;
                }
                else {
                    leftStartY  -= _onechipenggangHeight *0.2;
                }
            }
            else {
                continue;
            }

            for (var j = 0; j < _uis.length; j++) {
                var ci = _uis[j];
                if (i === 0)//明杠
                {
                    // if (_idx === 4) {
                    //     _idx = 0;
                    //     standStartY -= _uiDy;
                    //     currentCount++;
                    // }
                    // else if (_idx === 3) {
                    //     var _centerCardPos = _uis[j - 2].getPosition();
                    //     ci.setPosition(_centerCardPos.x, _centerCardPos.y + upSize.height * upS*0.1);
                    //     //ci.loadTexture("playing/MJ/Mj_04.png");
                    //     ci.zIndex = 15;
                    // }

                    if(_idx === 4)
                    {
                        _idx = 0;

                        currentCount++;
                        cc.log("明杠-----11111111--------" + leftStartY);
                    }
                    else if(_idx === 3)
                    {
                        var _centerCardPos = _uis[j - 2].getPosition();
                        ci.setPosition(_centerCardPos.x, _centerCardPos.y + upSize.height * upS*0.1);
                        //ci.loadTexture("playing/MJ/Mj_04.png");
                        ci.zIndex = 15;
                        leftStartY -= _uiDy;
                    }


                    cc.log("明杠-----11111111--------" + _idx);
                }
                else if (i === 1 || i === 2)//暗杠
                {
                    // if (_idx === 4) {
                    //     _idx = 0;
                    //     leftStartY -= _uiDy;
                    //     currentCount++;
                    // }
                    // else if (_idx === 3) {
                    //     var _centerCardPos = _uis[j - 2].getPosition();
                    //     ci.setPosition(_centerCardPos.x, _centerCardPos.y + upSize.height * upS*0.1);
                    //     ci.loadTexture("playing/MJ/Mj_04.png");
                    //     ci.removeAllChildren();
                    //     ci.zIndex = 15;
                    // }




                    if(_idx === 4)
                    {
                        _idx = 0;
                        currentCount++;
                    }
                    else if(_idx === 3)
                    {
                        ci.loadTexture(getNewMJBgFile("playing/MJ/Mj_04.png"));
                        ci.removeAllChildren();
                        var _centerCardPos = _uis[j - 2].getPosition();
                        ci.setPosition(_centerCardPos.x, _centerCardPos.y + upSize.height * upS*0.1);
                        ci.zIndex = 15;
                        leftStartY -= _uiDy;
                    }

                    cc.log("暗杠-----11111111" + _idx);
                }
                else if (i == 3 || i == 4) //碰，吃 三张牌
                {
                    if (_idx == 3) {
                        _idx = 0;
                        leftStartY -= _uiDy;
                        currentCount++;
                    }
                    cc.log("碰，吃-----11111111" + _idx);
                }

                var bGangCardSet = false;
                if (i == 1 || i == 0 || i == 2)//杠的有一张牌放在中间上面
                {
                    if (_idx == 3) {
                        bGangCardSet = true;//杠的第四张牌
                    }
                }

                if (!bchigangChanged && currentCount > 4) {
                    cc.log("要换行了-----currentCount = " + currentCount);
                    StandX = secStandX;
                    leftStartY = standStartY - _onechipenggangHeight;//左边的起点
                    bchigangChanged = true;
                }

                if (!bGangCardSet) {
                    // cc.log("leftStartX = " + leftStartY);
                    // cc.log("_onechipenggangHeight = " + _onechipenggangHeight);
                    cc.log( i + " = _idx = " + _idx);
                    //cc.log( i + " = ci.y = " + ci.y);
                    ci.y = leftStartY - _onechipenggangHeight * _idx;

                    cc.log( i + " = ci.y = " + ci.y);
                    ci.x = StandX;
                    ci.zIndex = _idx;
                }
                _idx++;
            }
        }


        //////////////////////////////////////////
        //手牌
        //////////////////////////////////////////
        var withPengGang = (currentCount > 0) ? _onechipenggangHeight * 0.5 : 0;
        var _onecCardHight = upSize.height * upS * 0.3;
        var handStartY = standStartY - currentCount * _uiDy - withPengGang;    //MjClient.size.width - upSize.width * upS * 1.2;//屏幕宽度;
        var bChanged = false;

        cc.log("======================uistand.length = " + uistand.length);

        for (var i = 0; i < uistand.length; i++) {
            var ci = uistand[i];
            var bsetChanged = false;
            ci.x = StandX;

            var ChangeIdx = currentCount * 3 + i;
            if (ChangeIdx >= 11) {
                if (!bChanged) {
                    StandX = secStandX;
                    var addX = 0;
                    if (currentCount >= 4) {//最多摆放4堆吃碰杠的牌
                        addX = (currentCount - 4) * _uiDy;
                        //cc.log("======================currentCount = " + currentCount);
                        //cc.log("======================addX = " + addX);
                    }
                    handStartY = standStartY - addX;
                    bsetChanged = true;
                }
            }


            if (i !== 0) {
                var preStandY = uistand[i - 1].y;
                if (i === (uistand.length - 1)) {
                    if (newC) {
                        cc.log("======================两侧 newC = " + newC);
                        if (ChangeIdx == 11)//换行
                        {
                            ci.y = standStartY;
                        }
                        else {
                            ci.y = preStandY - _onecCardHight - slotwith;
                        }
                        ci.y -= 30;
                    }
                    else {
                        if (ChangeIdx == 11)//换行
                        {
                            ci.y = preStandY;
                            cc.log("===========222===========standStartX = " + standStartX);
                        }
                        else {
                            ci.y = preStandY - _onecCardHight;
                        }
                    }
                }
                else {
                    if (!bChanged && ChangeIdx >= 11)//换行
                    {
                        ci.y = standStartY - withPengGang;
                        ci.x = secStandX;
                        cc.log("======================standStartX = " + secStandX);
                    }
                    else {
                        ci.y = preStandY - _onecCardHight;
                    }
                }
            }
            else {
                if (!bChanged && ChangeIdx >= 11) {
                    ci.y = handStartY - withPengGang;
                    ci.x = secStandX;
                    //StandY = secStandY;
                    //handStartX = standStartX;
                }
                else {
                    ci.y = handStartY;
                }
            }

            ci.zIndex = 30 + i;
            if (!bChanged) {
                bChanged = bsetChanged;
            }
        }
    }


    //刷新手牌大小
    resetCardSize_changpai();
};


PlayLayer_qutang_23zhang.prototype.setEatVisibleFalse = function(){
    var eat = MjClient.playui.jsBind.eat;
    eat.chi0._node.visible = false;
    eat.chi1._node.visible = false;
    eat.chi2._node.visible = false;
    eat.peng._node.visible = false;
    eat.gang0._node.visible = false;
    eat.gang1._node.visible = false;
    eat.long._node.visible = false;
    eat.gang2._node.visible = false;
    eat.hu._node.visible = false;
    eat.guo._node.visible = false;
    eat.cancel._node.visible = false;
};

// 判断吃碰杠胡的状态
PlayLayer_qutang_23zhang.prototype.EatVisibleCheck = function()
{
    var eat = MjClient.playui.jsBind.eat;
    eat._node.visible = true;
    //sk 为啥要隐藏掉？   //因为一开始是不可见的，隐藏根节点 by sking
    MjClient.playui.jsBind.eat.changeui.changeuibg._node.visible = false;
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var leftCard = MjClient.majiang.getAllCardsTotal() - tData.cardNext;

    // var panelQuanHun = MjClient.playui.jsBind.Panel_quanhun._node;
    // if(panelQuanHun) eat._node.visible = !panelQuanHun.visible;

    eat.chi0._node.visible = false;
    eat.chi1._node.visible = false;
    eat.chi2._node.visible = false;
    eat.peng._node.visible = false;
    eat.gang0._node.visible = false;
    eat.gang1._node.visible = false;
    eat.long._node.visible = false;
    eat.gang2._node.visible = false;
    eat.hu._node.visible = false;
    eat.guo._node.visible = false;
    eat.cancel._node.visible = false;


    var pl = sData.players[SelfUid() + ""];
    if(MjClient.playui._canJiaBei && !tData.allSelect) return;    // 只发十张牌的时候，不检测吃碰杠
    MjClient.gangCards = [];
    MjClient.eatpos = [];

    var mj = MjClient.majiang;
    var _isQiShow = false;
    //吃碰杠胡node
    var vnode = [];

    cc.log("===================================== tData.tState = " + tData.tState);
    cc.log("===================================== pl.mjState  = " + pl.mjState);
    if(tData.tState == TableState.waitLong && pl.mjState == TableState.waitLong) //起手要龙，要先杠
    {
        _isQiShow = true;
    }

    if(
        pl.mjState == TableState.waitEat ||
        pl.mjState == TableState.waitPut &&
        tData.uids[tData.curPlayer] == SelfUid())
    {

    }
    else
    {
        if(!_isQiShow) return;
    }

    //自摸
    if(tData.tState == TableState.waitPut && pl.mjState == TableState.waitPut || _isQiShow)
    {
        if(!_isQiShow)
        {
            cc.log("pl.eatFlag***********"+pl.eatFlag);
            cc.log("$$$$杠牌监测isNew "+pl.isNew);
            //胡
            if (pl.isNew && pl.eatFlag & 8) {
                vnode.push(eat.hu._node);
            }


            MjClient.canTingCards = {};
            for (var i = 0; i < pl.mjhand.length; i++) {
                var cardsAfterPut = pl.mjhand.slice(0);
                cardsAfterPut.splice(i,1);               //依次去掉某张牌看能不能听
                if (MjClient.majiang.canTing(cardsAfterPut)) {
                    MjClient.canTingCards[pl.mjhand[i]] = 1;
                }
            }


            //杠
            var rtn = MjClient.majiang.canGang1(pl.mjpeng, pl.mjhand, pl.isTing, pl.putCount, tData.hunCard);

            var leftCards = MjClient.majiang.getAllCardsTotal() - tData.cardNext;
            if(leftCards == 0 || !pl.isNotAnGang)
            {
                rtn = []; //最后一张牌不能杠
            }


            cc.log("$$$$杠牌监测"+JSON.stringify(rtn));

            if(rtn.length > 0 && pl.isNew)
            {
                MjClient.gangCards = rtn;
                vnode.push(eat.gang0._node);
            }
            if(vnode.length > 0)
            {
                vnode.push(eat.guo._node);
                eat.ting._node.visible = false;
                eat.noTing._node.visible = false;
                isCheckedTing = false;
            }
        }
        else //起手，只检测龙
        {
            //杠
            var rtn = MjClient.majiang.canGang1(pl.mjpeng, pl.mjhand, pl.isTing, pl.putCount, tData.hunCard);

            var leftCards = MjClient.majiang.getAllCardsTotal() - tData.cardNext;
            if(leftCards == 0)
            {
                rtn = []; //最后一张牌不能杠
            }

            cc.log("$$$$杠牌监测888888888"+JSON.stringify(rtn));
            if(rtn.length > 0)
            {
                MjClient.gangCards = rtn;
                if (pl.putCount) {
                    vnode.push(eat.gang0._node);
                }
                else {
                    vnode.push(eat.long._node);
                }
            }
            if(vnode.length > 0)
            {
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
        // cc.log("diao pao hu-=================================================");
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
                getUIPlayer_changpai(0).mjState = TableState.waitCard;
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
                vnode[i].loadTexturePressed(btnImgs[btnName][1]);
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
                    vnode[i].loadTexturePressed(btnImgs[btnName][1]);
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

            setWgtLayout(vnode[i], [0, 0.16], [0.5, 0], [(1 - vnode.length) / 1.8 + i * 1.4, 2.5], false, false);
        }
    }

    //显示，吃，碰，杠的那几张牌
    COMMON_UI.showCurrentEatCards(vnode);
}


// 清除当前手牌
PlayLayer_qutang_23zhang.prototype.CleanMjHand = function (node, off) {
    var name = "mjhand";
    if(off === 1 || off === 2) {
        if(MjClient.rePlayVideo === -1) {
            name = "standPri";
        }else{
            name = "mjhand_replay";
        }
    }
    var children = node.children;
    for(var i = 0; i < children.length; i ++){
        var cd = children[i];
        if(cd.name === name){
            cd.removeFromParent(true);
            cd = null;
        }
    }
};

// 清除当前手牌
PlayLayer_qutang_23zhang.prototype.CleanMjHand_long = function (node, off) {
    var children = node.children;
    for(var i = 0; i < children.length; i ++){
        var cd = children[i];
        if(cd.name == "mjhand" || cd.name == "peng" || 
            cd.name == "gang0" || cd.name == "gang1"|| cd.name == "long"){
            cd.removeFromParent(true);
            cd = null;
        }
    }
};

PlayLayer_qutang_23zhang.prototype.JiaBeiProcess = function (JiaBeiNode, off) {
    var pl = getUIPlayer_changpai(off);
    if(JiaBeiNode){
        JiaBeiNode.setVisible(true);
        if(MjClient.playui._canJiaBei){
            JiaBeiNode.setString("");
            if(pl && typeof (pl.jiabei) !== "undefined"){
                switch (pl.jiabei) {
                    case 0:
                        JiaBeiNode.setVisible(false);   // 未选择
                        break;
                    case 1:
                        JiaBeiNode.setString("不加");  // 不加倍
                        break;
                    case 2:
                        JiaBeiNode.setString("加倍");    // 加倍
                        break;
                }
            }
        }else{
            JiaBeiNode.setString("不加");           // 不能加倍的时候，显示不加
        }
    }
};


PlayLayer_qutang_23zhang.prototype.JiaBeiIconProcess = function (JiaBeiIconNode, off) {
    var tData = MjClient.data.sData.tData;
    var pl = getUIPlayer_changpai(off);
    var url_jiabei = "game_picture/icon_jiabei.png";
    var url_bujiabei = "game_picture/icon_bujiabei.png";
    if(JiaBeiIconNode){
        JiaBeiIconNode.ignoreContentAdaptWithSize(true);
        if(MjClient.playui._canJiaBei){
            if(pl && typeof (pl.jiabei) !== "undefined" && !tData.allSelect){
                switch (pl.jiabei) {
                    case 0:
                        JiaBeiIconNode.setVisible(false);   // 未选择
                        break;
                    case 1:
                        JiaBeiIconNode.loadTexture(url_bujiabei);  // 不加倍
                        JiaBeiIconNode.setVisible(true);
                        break;
                    case 2:
                        JiaBeiIconNode.loadTexture(url_jiabei);    // 加倍
                        JiaBeiIconNode.setVisible(true);
                        break;
                }
            }
        }else{
            JiaBeiIconNode.setVisible(false);   // 不能加倍的时候，显示不加
        }
    }
    if(tData.tState === TableState.roundFinish){
        JiaBeiIconNode.setVisible(false);
    }
};




PlayLayer_qutang_23zhang.prototype.QuanHunProcess = function(QuanHunNode, off) {
    var pl = getUIPlayer_changpai(off);
    if(QuanHunNode){
        QuanHunNode.setVisible(false);
        if(pl && pl.isQuanHun) QuanHunNode.setVisible(true);
    }
};



PlayLayer_qutang_23zhang.prototype.showflowerCount_QuTang = function(node, off)
{
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    
    var pl = getUIPlayer_changpai(off);
    if(!pl) return;
    var huaCountText = node.getChildByName("head").getChildByName("huaCount");
    huaCountText.visible = true;

    // 选择加倍之前，玩家自己统计前十张牌，花牌个数
    if (tData.areaSelectMode.canJiaBei && !tData.allSelect){
        if(off === 0){
            var huaCount = MjClient.majiang.countFlowerForMe(pl.mjhand, 1);
            huaCountText.setString("花 " + huaCount);
        }else{
            huaCountText.setString("");
        }
    }
    // 不能选择加倍 or 所有玩家已选择加倍，刷新花牌个数，并播放补花动画
    else{
        var huaNum = pl.mjflower.length === 0 ? MjClient.majiang.countFlowerForMe(pl.mjhand, 0) : pl.mjflower.length;
        huaCountText.setString("花 " + huaNum);
        if(pl.mjflower.length > 0) {
            ShowEatActionAnim(node, ActionType.FLOWER, off);
            playEffectInPlay("flower");
        }
    }
};

PlayLayer_qutang_23zhang.prototype.playJiaBeiEffect = function(data)
{
    if(data && data.jiabei){
        if(data.jiabei === 1){
            playEffectInPlay("bujiabei");
        }else if(data.jiabei === 2){
            playEffectInPlay("jiabei");
        }
    }
};


PlayLayer_qutang_23zhang.prototype.getCurrentHuCount_QuTang = function(off)
{
    var sData = MjClient.data.sData;
    var tData = sData.tData;

    var pl = getUIPlayer_changpai(off);
    var _node = getNode_changpai(off);
    if(!pl || (MjClient.rePlayVideo !== -1 && !pl.mjhand)) return;    // 是回放没有手牌，返回

    // 碰
    var pengScore = 0;
    for (var i = 0; i < pl.mjpeng.length; i++) {
        var isDaZhang = MjClient.majiang.isDaZhang(pl.mjpeng[i]);
        if(isDaZhang){
            pengScore += 4;
        }else{
            pengScore += 1;
        }
    };


    // 暗杠
    var angangScore = 0;
    for (var i = 0; i < pl.mjgang1.length; i++) {
        if (pl.long.indexOf(pl.mjgang1[i]) < 0) {                    //排除龙的情况
            var isDaZhang = MjClient.majiang.isDaZhang(pl.mjgang1[i]);
            if(isDaZhang){
                angangScore += 24;
            }else{
                angangScore += 6;
            }
        }
    }

    // 明杠
    var minggangScore = 0;
    for (var i = 0; i < pl.mjgang0.length; i++) {
        var isDaZhang = MjClient.majiang.isDaZhang(pl.mjgang0[i]);
        if(isDaZhang){
            minggangScore += 16;
        }else{
            minggangScore += 4;
        }
    }


    // 起手杠
    var longScore = 0;
    for (var i = 0; i < pl.long.length; i++) {
        var isDaZhang = MjClient.majiang.isDaZhang(pl.long[i]);
        if(isDaZhang){
            minggangScore += 32;
        }else{
            minggangScore += 8;
        }
    }

    var flowerArr = [0, 10, 30, 50, 90];
    var flowerScore = flowerArr[pl.mjflower.length];

    var sumScore = 0;
    sumScore = pengScore + minggangScore + angangScore + longScore + flowerScore;
    var _huCountNode = _node.getChildByName("head").getChildByName("huCount");
    _huCountNode.ignoreContentAdaptWithSize(true);
    _huCountNode.visible = true;
    _huCountNode.setString(sumScore + "胡");

    return sumScore;
};