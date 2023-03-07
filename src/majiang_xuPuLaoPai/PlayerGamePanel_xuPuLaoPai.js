/**
 * Created by Administrator on 2017/3/9.
 */
var actionZindex = 1000;
//向服务器发送 过消息
MjClient.MJPass2NetForxuPuLaoPai = function()
{
    console.log(">>>>>>过过过>>>普通  过 <<<<<<<<");
    var sData = MjClient.data.sData;
    var tData = sData.tData;

    var eat = MjClient.playui.jsBind.eat;

    if(IsTurnToMe() && tData.tState == TableState.waitPut)
    {
        var msg = "确认过";
        if(eat.peng._node.visible)
        {
            msg += " 碰 ";
        }

        if(eat.chi0._node.visible)
        {
            msg += " 吃 ";
        }

        if(eat.hu._node.visible)
        {
            msg += " 胡 ";
        }

        //cc.log("-- = getUIPlayer(0).isTing = " + getUIPlayer(0).isTing)
        if(eat.ting._node.visible)
        {
            msg = "你确认要放弃听牌";
            if(eat.peng._node.visible)
            {
                msg = "确认过";
                msg += " 碰 ";
            }

            if(eat.chi0._node.visible)
            {
                msg += " 吃 ";
            }

            msg += " 听 ";
        }


        msg = msg + "吗?"

        MjClient.showMsg(msg, function()
        {
            if(eat.hu._node.visible){
                MjClient.showToast("你选择了过，暂时放弃胡牌");
            }
            eat.panelBg._node.visible = false;
            eat.peng._node.visible = false;
            eat.chi0._node.visible = false;
            eat.hu._node.visible = false;
            eat.guo._node.visible = false;
            eat.ting._node.visible = false;
            eat.cancel._node.visible = false;
            MJPassConfirmToServer();
        }, function() {}, "1");
    }
    else
    {

        var tData = MjClient.data.sData.tData;
        if(MjClient.playui.jsBind.eat.hu._node.visible)
        {
            MjClient.showMsg("确认不胡吗?", function(){
                MjClient.showToast("你选择了过，暂时放弃胡牌");
                MJPassConfirmToServer();
            }, function() {}, "1");
        }
        // else if(tData && tData.areaSelectMode["cpqr"] && (eat.peng._node.visible || eat.chi0._node.visible))
        // {
        //     var msg = "确认过";
        //     if(eat.peng._node.visible)
        //     {
        //         msg += " 碰 ";
        //     }
        //
        //     if(eat.chi0._node.visible)
        //     {
        //         msg += " 吃 ";
        //     }
        //     msg = msg + "吗?"
        //     MjClient.showMsg(msg, function()
        //     {
        //         MJPassConfirmToServer();
        //         eat.peng._node.visible = false;
        //         eat.chi0._node.visible = false;
        //         eat.hu._node.visible = false;
        //         eat.guo._node.visible = false;
        //         eat.ting._node.visible = false;
        //         eat.cancel._node.visible = false;
        //     }, function() {}, "1");
        // }
        else
        {
            MJPassConfirmToServer();
        }
    }
}


// 这个没看懂干嘛的
// off 是四个位置，根据off 显示四个位置的信息 by sking
function SetUserVisible_xuPuLaoPai(node, off)
{
    var pl = getUIPlayer(off);
    var head = node.getChildByName("head");
    var name = head.getChildByName("name");
    var nobody = head.getChildByName("nobody");
    var coin = head.getChildByName("coin");
    var offline = head.getChildByName("offline");
    if(pl)
    {
        cc.log("====================off======================" + off);
        head.visible = true;
        name.visible = true;
        coin.visible = true;
        offline.visible = true;
        coin.visible = true;
        name.ignoreContentAdaptWithSize(true);
        coin.ignoreContentAdaptWithSize(true);
        MjClient.loadWxHead(pl.info.uid, pl.info.headimgurl);
        setUserOffline(node, off);
        InitUserHandUI_xuPuLaoPai(node, off);
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


function InitUserHandUI_xuPuLaoPai(node, off)
{
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var pl = getUIPlayer(off);
    if(!pl) return;

    //初始化玩家金币和名称
    InitUserCoinAndName_jinzhong(node, off);
    setAreaTypeInfo(true);

    if (SelfUid() === pl.info.uid) {
        if (tData.tState === TableState.waitJiazhu) {
            if (pl.mjState === TableState.waitJiazhu) {
                if(!MjClient.playui.getChildByName("xuPuChongLayer")){
                    var layer = new xuPuChongLayer();
                    MjClient.playui.addChild(layer, 99,826);
                }

                if (MjClient.webViewLayer != null) {
                    MjClient.webViewLayer.close();
                }
            } else {
                //弹窗等待其他玩家加注
                MjClient.playui._jiazhuWait.visible = true;
            }
        }
    }

    if(tData.tState !== TableState.waitPut && tData.tState !== TableState.waitEat && tData.tState !== TableState.waitCard) return;

    //添加碰
    for(var i = 0; i < pl.mjpeng.length; i++)
    {
        var idx = tData.uids.indexOf(pl.info.uid);
        var offIdx = (pl.pengchigang.peng[i].pos - idx + 4) % 4 - 1;//表示被碰的人和pl之间隔着几个人，如果是pl碰下家，则offIdx=0，pl碰上家，则offIdex=2
        var cdui = null;
        for(var j = 0; j < 3; j++)
        {
            if( (j % 3 == 2 - offIdx && off % 3 == 0) || (j % 3 == offIdx && off % 3 != 0))
            {
                cdui = MjClient.playui.getNewCard(node, "up", "peng", pl.mjpeng[i], off, "heng", "heng");
            }
            else
            {
                cdui = MjClient.playui.getNewCard(node, "up", "peng", pl.mjpeng[i], off);
            }

            if(j === 2)
            {
                cdui.ispeng3 = true;
            }
        }
    }

    var chiIdx = 0;
    var cdui = null;

    for(var i = 0; i < pl.mjchi.length; i++)
    {
        if(i % 3 === 0)
        {
            chiIdx++;
        }

        if(pl.mjchiCard[chiIdx-1] === pl.mjchi[i])//吃的横牌表示吃的是哪张牌
        {
            cdui = MjClient.playui.getNewCard(node, "up", "chi", pl.mjchi[i], off, "heng");
            cdui.ischiCard = true;
        }
        else
        {
            cdui =  MjClient.playui.getNewCard(node, "up", "chi", pl.mjchi[i], off);
        }
    }

    //添加打出的牌
    for(var i = 0; i < pl.mjput.length; i++)
    {
        var msg = {
            card: pl.mjput[i],
            uid: pl.info.uid
        };
        MjClient.playui.DealMJPut(node, msg, off, i);
    }

    //添加手牌
    if(MjClient.rePlayVideo === -1)//表示正常游戏
    {
        if(pl.mjhand && off === 0)
        {
            for(var i = 0; i < pl.mjhand.length; i++)
            {
                MjClient.playui.getNewCard(node, "stand", "mjhand", pl.mjhand[i], off);
            }
        }
    }
    else
    {
        cc.log(" 录像_________________mjhand_replay_______________"+JSON.stringify(pl.mjhand));
        if (pl.mjhand)
        {
            if(off === 0)
            {
                for (var i = 0; i < pl.mjhand.length; i++) {
                    MjClient.playui.getNewCard(node, "stand", "mjhand", pl.mjhand[i], off);
                }
            }
            else
            {
                for (var i = 0; i < pl.mjhand.length && i < 13; i++) {
                    MjClient.playui.getNewCard(node, "up", "mjhand_replay", pl.mjhand[i], off);
                }
            }
        }

    }
    MjClient.playui.CardLayoutRestore(node, off);
}


var PlayLayer_xuPuLaoPai = cc.Layer.extend({
    jsBind: {
        _event: {
            mjhand: function() {
                if(MjClient.endoneui != null) {
                    MjClient.endoneui.removeFromParent(true);
                    MjClient.endoneui = null;
                }

                var sData = MjClient.data.sData;
                var tData = sData.tData;
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
                var self = this;
                function delayExe() {
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    resetEatActionAnim();
                    if (sData.tData.roundNum <= 0 && !tData.fieldId) {
                        if(!tData.matchId){
                            self.addChild(new GameOverLayer(),500);
                        }else{
                            self.runAction(cc.sequence(cc.delayTime(3),cc.callFunc(function(){
                                self.addChild(new GameOverLayer(),500);
                            })))
                        }
                    }
                    self.addChild(new EndOneView_xuPuLaoPai(),500);
                }

                this.runAction(cc.sequence(cc.callFunc(delayExe)));
            },
            moveHead: function() {
                postEvent("returnPlayerLayer");
                // MjClient.playui.tableStartHeadMoveAction(this);
                sendGPS();
                var tData = MjClient.data.sData.tData;
                // if(tData.areaSelectMode.flowerType == WithFlowerType.noFlower)
                // {
                //     MjClient.playui._btnFlower.visible = false;
                // }
                // else
                // {
                //     MjClient.playui._btnFlower.visible = true;
                // }


                //initFlower_xuPuLaoPai();
                MjClient.playui._jiazhuWait.visible = false;
            },
            initSceneData: function() {
                MjClient.playui.reConectHeadLayout(this);
                CheckRoomUiDelete();
            },
            onlinePlayer: function() {
                MjClient.playui.reConectHeadLayout(this);
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
                _run:function()
                {
                    if (MjClient.data.sData.tData.fieldId) {
                        this.setVisible(false)
                    }
                }
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
                this.visible = false;
                if(tData.matchId && tData.matchInfo){
                    if(MjClient.matchRank){
                        showPlayUI_matchInfo("排名："+MjClient.matchRank+"/"+tData.matchInfo.userCount+"\n前"+tData.matchInfo.jingjiCount+"名晋级");
                    }else {
                        showPlayUI_matchInfo("排名："+tData.matchInfo.userCount+"/"+tData.matchInfo.userCount+"\n前"+tData.matchInfo.jingjiCount+"名晋级");
                    }
                }
            }
        },
        banner: {
            _run: function () {
                this.zIndex = 500;
            },
            _layout: [
                [1, 1],
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
                    if (MjClient.data.sData.tData.fieldId) {
                        this.setVisible(false)
                    }
                    this.ignoreContentAdaptWithSize(true);
                },
                _event: {
                    initSceneData: function() {
                        this.ignoreContentAdaptWithSize(true);
                        this.setString(MjClient.data.sData.tData.tableid);
                    }
                }
            },
            roomNo: {
                _run: function() {
                    if (MjClient.data.sData.tData.fieldId) {
                        this.setVisible(false)
                    }
                },
            },
            roundnumAtlas: {
                _run:function () {
                    MjClient.roundnumImgNode = this;
                },
                _text: function() {
                    var tData = MjClient.data.sData.tData;
                    var _roundText = "";
                    if (tData) {
                        var _currentRoundIdx =  parseInt(tData.roundAll - tData.roundNum) + 1;
                        if (_currentRoundIdx > tData.roundAll) _currentRoundIdx = 1;
                        _roundText = "第 " + _currentRoundIdx + "/" + tData.roundAll + " 局";
                    }
                    return _roundText;
                },
                _event: {
                    initSceneData: function(eD) {
                        this.visible = IsArrowVisible();
                    },
                    onlinePlayer: function(eD) {
                        this.visible = IsArrowVisible();
                    },
                    mjhand: function(eD) {
                        this.visible = IsArrowVisible();
                        var tData = MjClient.data.sData.tData;
                        var _roundText = "";
                        if (tData) {
                            var _currentRoundIdx =  parseInt(tData.roundAll - tData.roundNum) + 1;
                            if (_currentRoundIdx > tData.roundAll) _currentRoundIdx = 1;
                            _roundText = "第 " + _currentRoundIdx + " / " + tData.roundAll + " 局";
                        }
                        this.setString(_roundText);
                    }
                }
            },
            setting: {
                _click: function() {
                    MjClient.Scene.addChild(new SettingPanel_xuPuLaoPai());
                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Shezhi", {uid:SelfUid(),gameType:MjClient.gameType});
                }
            },
            gps_btn: {
                _run: function() {
                    if (MjClient.data.sData.tData.fieldId) {
                        this.setVisible(false);
                    }
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
            btn_exit: {
                _run: function() {
                    this.visible = !MjClient.data.sData.tData.fieldId;
                },
                _click: function() {
                    var tData = MjClient.data.sData.tData;
                    if (tData.owner != SelfUid() && (tData.tState == TableState.waitJoin || tData.tState == TableState.waitReady)) {
                        MjClient.showMsg("确定要退出房间吗？",
                            function() {
                                MjClient.leaveGame();
                                if (!MjClient.enterui && !getClubInfoInTable())
                                    MjClient.Scene.addChild(new EnterRoomLayer());
                            },
                            function() {});
                    } else {
                        MjClient.showMsg("是否解散房间？", function() {
                            MjClient.delRoom(true);
                        }, function() {}, 1);
                    }
                }
            },
            btn_help: {
                _run: function () {
                    var tData = MjClient.data.sData.tData;
                    MjClient.playui.showPlayUI_roundInfo(getPlayingRoomInfo(0), tData.tableid);
                },
            },
            Button_1: {
                _visible : true,
                _click: function() {
                    MjClient.openWeb({url:MjClient.GAME_TYPE.HUAI_AN,help:true});
                }
            },
        },
        jiazhuWait: {
            _visible: false,
            _run: function() {
                this.ignoreContentAdaptWithSize(true);
            },
            _layout: [
                [0.4, 0.4],
                [0.5, 0.3],
                [0, 0]
            ]
        },
        guChouTip: {
            _visible: false,
            _run: function() {
                this.ignoreContentAdaptWithSize(true);
            },
            _layout: [
                [0.4, 0.4],
                [0.5, 0.4],
                [0, 0]
            ]
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
                    if (IsTurnToMe() && pl.isTing && !eat.hu._node.visible) {
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
        eat: {
            panelBg:{
                _visible: false,
                _layout: [[1, 1], [0.5, 0.5], [0, 0], true],
            },

            gang0:{
                _visible: false
            },
            gang1:{
                _visible: false
            },
            gang2:{
                _visible: false
            },

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
                    if (eT == 2) {

                        var eat = MjClient.playui.jsBind.eat;
                        var tData = MjClient.data.sData.tData;
                        if(tData.areaSelectMode["cpqr"]) {
                            MjClient.showMsg("确认吃吗？", function() {
                                eat.panelBg._node.visible = false;
                                eat.peng._node.visible = false;
                                eat.chi0._node.visible = false;
                                eat.hu._node.visible = false;
                                eat.guo._node.visible = false;
                                eat.ting._node.visible = false;
                                eat.cancel._node.visible = false;
                                MJChiCardchange(btn.tag);
                            }, function() {}, "1");
                        }
                        else {
                            eat.panelBg._node.visible = false;
                            eat.peng._node.visible = false;
                            eat.chi0._node.visible = false;
                            eat.hu._node.visible = false;
                            eat.guo._node.visible = false;
                            eat.ting._node.visible = false;
                            eat.cancel._node.visible = false;
                            MJChiCardchange(btn.tag);
                        }
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
                    if (eT == 2) {
                        var eat = MjClient.playui.jsBind.eat;
                        var tData = MjClient.data.sData.tData;
                        if(tData.areaSelectMode["cpqr"]) {
                            MjClient.showMsg("确认吃吗？", function() {
                                eat.panelBg._node.visible = false;
                                eat.peng._node.visible = false;
                                eat.chi0._node.visible = false;
                                eat.hu._node.visible = false;
                                eat.guo._node.visible = false;
                                eat.ting._node.visible = false;
                                eat.cancel._node.visible = false;
                                MJChiCardchange(btn.tag);
                            }, function() {}, "1");
                        }
                        else {
                            eat.panelBg._node.visible = false;
                            eat.peng._node.visible = false;
                            eat.chi0._node.visible = false;
                            eat.hu._node.visible = false;
                            eat.guo._node.visible = false;
                            eat.ting._node.visible = false;
                            eat.cancel._node.visible = false;
                            MJChiCardchange(btn.tag);
                        }
                    }
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
                    if (eT == 2) {
                        var eat = MjClient.playui.jsBind.eat;
                        var tData = MjClient.data.sData.tData;
                        if(tData.areaSelectMode["cpqr"]) {
                            MjClient.showMsg("确认吃吗？", function() {
                                eat.panelBg._node.visible = false;
                                eat.peng._node.visible = false;
                                eat.chi0._node.visible = false;
                                eat.hu._node.visible = false;
                                eat.guo._node.visible = false;
                                eat.ting._node.visible = false;
                                eat.cancel._node.visible = false;
                                MJChiCardchange(btn.tag);
                            }, function() {}, "1");
                        }
                        else {
                            eat.panelBg._node.visible = false;
                            eat.peng._node.visible = false;
                            eat.chi0._node.visible = false;
                            eat.hu._node.visible = false;
                            eat.guo._node.visible = false;
                            eat.ting._node.visible = false;
                            eat.cancel._node.visible = false;
                            MJChiCardchange(btn.tag);
                        }
                    }
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
                        var copyhand = pl.mjhand.slice();
                        var index = copyhand.indexOf(currentCard);//排除当前选择的一张牌
                        copyhand.splice(index,1);
                        var tData = MjClient.data.sData.tData;
                        var tingCards = calTingSet(copyhand, new Set([tData.hunCard, tData.hunCard2]));
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
                        var eat = MjClient.playui.jsBind.eat;
                        var tData = MjClient.data.sData.tData;
                        if(tData.areaSelectMode["cpqr"]) {
                            MjClient.showMsg("确认碰吗？", function() {
                                eat.panelBg._node.visible = false;
                                eat.peng._node.visible = false;
                                eat.chi0._node.visible = false;
                                eat.hu._node.visible = false;
                                eat.guo._node.visible = false;
                                eat.ting._node.visible = false;
                                eat.cancel._node.visible = false;
                                MJPengToServer();
                            }, function() {}, "1");
                        }
                        else {
                            eat.panelBg._node.visible = false;
                            eat.peng._node.visible = false;
                            eat.chi0._node.visible = false;
                            eat.hu._node.visible = false;
                            eat.guo._node.visible = false;
                            eat.ting._node.visible = false;
                            eat.cancel._node.visible = false;
                            MJPengToServer();
                        }
                    }
                },
                bgimg: {
                    _run: function() {
                        this.zIndex = -1;
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
                        MjClient.MJPass2NetForxuPuLaoPai();
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
                                if (eT == 2) MjClient.MJPass2NetForxuPuLaoPai();
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
                    if(MjClient.rePlayVideo != -1){
                        var pl = MjClient.data.sData.players[SelfUid()];
                        if(pl && pl.passHu){
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
                MJTing: function (eD) {
                    console.log("HHH :，MJTing------");
                    hideTingBtn();
                    isCheckedTing = false;
                },
                roundEnd: function(eD) {
                    console.log("HHH :，roundEnd------");
                    MjClient.playui.EatVisibleCheck();
                },
                MJHu: function(eD) {
                    console.log("HHH :，MJHu ------");
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
                [0.05, 0.05],
                [0.975, 0.37],
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
                [0.975, 0.27],
                [0, 0]
            ],
            _run: function() {
                if (MjClient.data.sData.tData.fieldId) {
                    this.setVisible(false);
                }
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

        duty_btn: {
            _layout: [
                [0.08, 0.08],
                [0.97, 0.2],
                [0, 3.2]
            ],
            _run: function() {
                this.setVisible(false)
                if (MjClient.data.sData.tData.fieldId) {
                    this.setVisible(true)
                    ShowDayTaskTips(this,"left")
                }
            },
            _click: function() {
                MjClient.Scene.addChild(new GoldTaskLayer());
            },
        },

        tuoguan_btn: {
            _layout: [
                [0.08, 0.08],
                [0.97, 0.3],
                [0, 3.2]
            ],
            _run: function() {
                var fieldId = MjClient.data.sData.tData.fieldId;
                this.visible = fieldId ? true : false;
            },
            _click: function() {
                MjClient.gamenet.request("pkroom.handler.tableMsg", {cmd: "beTrust"});
            },
            _event:{
                beTrust:function (msg) {
                    if(msg.uid === SelfUid()){
                        this.enabled = false;
                    }
                },
                cancelTrust:function (msg) {
                    if(msg.uid === SelfUid()){
                        this.enabled = true;
                    }
                },
                initSceneData:function (msg) {
                    var pl = getUIPlayer(0);
                    this.enabled = pl.trust ? false : true;
                },
            },
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
                [1, 0],
                [0.5, 0],
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
                    }else {
                        this.visible = false;
                    }
                }
            }
        },
        panel_showCardInfo:{
            _layout: [[1, 1], [0.5, 0.5], [0, 0], true],
            _visible: false,
            _touch: function(sender, type) {
                if(type === ccui.Widget.TOUCH_ENDED){
                    MjClient.playui.cleanShowCard(this);
                    this.setVisible(false);
                }
            },
            _event:{
                showCardInfo: function (params) {
                    var pl = getUIPlayer(params.off);
                    if(pl){
                        this.setVisible(true);
                        MjClient.playui.cleanShowCard(this);
                        MjClient.playui.showCardInfoPanel(this, params);
                    }
                }
            }
        },
        panel_showMingCardInfo: {
            _layout: [[1, 1], [0.5, 0.5], [0, 0], true],
            _visible: false,
            _touch: function(sender, type) {
                if(type === ccui.Widget.TOUCH_ENDED){
                    postEvent("hideMingCardInfo");
                }
            },
            _event:{
                showMingCardInfo: function () {
                    this.setVisible(true);
                    MjClient.playui.cleanMingCard(this);
                    MjClient.playui.showMingCardInfoPanel(this);
                }
            },
            bg: {
                _layout: [[0.9, 0.9], [0.5, 0.5], [0, 0], false, true],
                _run: function(){
                    this.endScale = this.getScale();
                },
                _event:{
                    showMingCardInfo: function () {
                        var endScale = this.endScale;
                        this.setVisible(true);
                        this.setScale(0);
                        this.runAction(cc.ScaleTo(0.5, endScale).easing(cc.easeBackOut()));
                    },
                    hideMingCardInfo: function () {
                        var that = this;
                        this.runAction(cc.sequence(
                            cc.ScaleTo(0.3, 0).easing(cc.easeSineIn()),
                            cc.callFunc(function () {
                                that.parent.setVisible(false);
                                MjClient.playui.cleanMingCard(that.parent);
                            })
                        ));
                    }
                },
            }
        },
        layout_waitFriends: {
            _layout: [[0.06, 0.06], [0.5, 0.5], [0, -3]],
            _run: function() {
                var offestY = 20;
                for (var i = 0; i < 9; i++) {
                    if (i >= 6) {
                        offestY = 10;
                    }

                    var img_word = this.getChildByName("img_waitFriend_" + i);
                    if (img_word) {
                        img_word.runAction(cc.repeatForever(cc.sequence(cc.delayTime(i * 0.3), cc.moveBy(0.3, 0, offestY), cc.moveBy(0.3, 0, -offestY), cc.delayTime(3 - i * 0.3))));
                    }
                }
            },
            _event: {
                initSceneData: function() {
                    MjClient.playui.checkInviteVisible(this);
                },
                addPlayer: function() {
                    MjClient.playui.checkInviteVisible(this);
                },
                removePlayer: function() {
                    MjClient.playui.checkInviteVisible(this);
                }
            }
        },
        tingTipText: {
            _visible: false,
            _layout: [[0.15, 0.15], [0.5, 0.5], [-1.38, 1.5]],
            _event: {
                initSceneData: function(){
                    MjClient.playui.showTingCardsName(this);
                },
                mjhand: function(){
                    MjClient.playui.showTingCardsName(this);
                },
                newCard: function(msg){
                    MjClient.playui.showTingCardsName(this, msg);
                },
                MJPut: function(msg){
                    MjClient.playui.showTingCardsName(this, msg);
                },
                MJChi: function(msg) {
                    MjClient.playui.showTingCardsName(this, msg);
                },
                MJPeng: function(msg) {
                    MjClient.playui.showTingCardsName(this, msg);
                },
                MJHu: function(msg) {
                    MjClient.playui.showTingCardsName(this, msg);
                },
                roundEnd: function(){
                    this.visible = false;
                }
            }
        },
        tingpaiBtn: {
            _visible: false,
            _layout: [[0.1, 0.1], [0.5, 0.5], [1.05, 0.6]],
            _touch:function (btn, eT) {
                if (eT == 2) {
                    MjClient.gamenet.request("pkroom.handler.tableMsg", {
                        cmd: "isTingState",
                        isTing: true,
                    });
                }
            },
            _event: {
                initSceneData: function(){
                    MjClient.playui.checkTingBtn(this);
                },
                mjhand: function(){
                    MjClient.playui.checkTingBtn(this);
                },
                newCard: function(){
                    MjClient.playui.checkTingBtn(this);
                },
                MJPut: function(msg){
                    MjClient.playui.checkTingBtn(this, msg);
                },
                MJChi: function(msg) {
                    MjClient.playui.checkTingBtn(this, msg);
                },
                MJPeng: function(msg) {
                    MjClient.playui.checkTingBtn(this, msg);
                },
                selectTing: function(msg) {
                    MjClient.playui.checkTingBtn(this, msg);
                },
                MJHu: function(msg) {
                    MjClient.playui.checkTingBtn(this, msg);
                },
                roundEnd: function(){
                    this.visible = false;
                }
            }
        },
        cancleTingBtn: {
            _visible: false,
            _layout: [[0.1, 0.1], [0.5, 0.5], [1.05, 0.6]],
            _touch:function (btn, eT) {
                if (eT == 2) {
                    MjClient.gamenet.request("pkroom.handler.tableMsg", {
                        cmd: "isTingState",
                        isTing: false,
                    });
                }
            },
            _event: {
                initSceneData: function(){
                    MjClient.playui.checkCancleTingBtn(this);
                },
                mjhand: function(){
                    MjClient.playui.checkCancleTingBtn(this);
                },
                newCard: function(){
                    MjClient.playui.checkCancleTingBtn(this);
                },
                MJPut: function(msg){
                    MjClient.playui.checkCancleTingBtn(this, msg);
                },
                MJChi: function(msg) {
                    MjClient.playui.checkCancleTingBtn(this, msg);
                },
                MJPeng: function(msg) {
                    MjClient.playui.checkCancleTingBtn(this, msg);
                },
                selectTing: function(msg) {
                    MjClient.playui.checkCancleTingBtn(this, msg);
                },
                MJHu: function(msg) {
                    MjClient.playui.checkCancleTingBtn(this, msg);
                },
                roundEnd: function(){
                    this.visible = false;
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
        var playui = ccs.load("res/Play_xuPuLaoPai.json");
        this.srcMaxPlayerNum = MjClient.MaxPlayerNum;
        MjClient.MaxPlayerNum = parseInt(MjClient.data.sData.tData.maxPlayer);
        cc.log("MjClient.MaxPlayerNum LYG = " + MjClient.MaxPlayerNum);
        playMusic("bgFight");
        this._downNode  = playui.node.getChildByName("down");
        this._rightNode = playui.node.getChildByName("right");
        this._topNode   = playui.node.getChildByName("top");
        this._leftNode  = playui.node.getChildByName("left");
        MjClient.playui = this;
        this._tingTipText  = playui.node.getChildByName("tingTipText");
        this._btnPutCard = playui.node.getChildByName("BtnPutCard");
        this._tingCardsNode = this._downNode.getChildByName("tingCardsNode");
        this._tingCardNumNode = this._downNode.getChildByName("tingCardNumNode");
        MjClient.playui._AniNode = playui.node.getChildByName("eat");
        MjClient.playui.eatNode = playui.node.getChildByName("eat");
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
        MjClient.playui._guChouTip   = playui.node.getChildByName("guChouTip");

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
        MjClient.playui.initSceneFunc();
        // 在亲友圈房间中添加邀请亲友圈牌有一起对局
        addClubYaoqingBtn(5);

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
                    node.visible = false;
                    if (off == 0)
                    {
                        var tingSet = calTingSet(pl.mjhand, new Set([tData.hunCard, tData.hunCard2]));
                        MjClient.playui.setTingCards(this._tingCardsNode,tingSet);
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


PlayLayer_xuPuLaoPai.prototype.CardLayoutRestore = function(node, off) {

    var newC = null, chiCard, tempArr = [], chiCardArr = [],
        tData = MjClient.data.sData.tData,
        newVal = 0,
        pl = getUIPlayer(off),
        mjhandNum = 0,
        children = node.children;

    if(!pl) return;

    if(tData.areaSelectMode["qxgc"] || pl.guChouValue != 1) {
        MjClient.playui.checkOutTingCards(pl.mjhand); // 求出符合出打出去能听的牌
    }

    for(var i = 0; i < children.length; i++) {
        var ci = children[i];
        ci.stopActionByTag(20180131);
        if(ci.name === "mjhand") {
            mjhandNum ++;
            if((typeof MjClient.init_y) == 'undefined') {
                MjClient.init_y = ci.y;
            }
            ci.y = MjClient.init_y;
        }
    }

    if (pl.mjhand && pl.mjhand.length > 0) {
        var count = MjClient.majiang.CardCount(pl);
        if(count === 17 && mjhandNum === pl.mjhand.length) {
            if(pl.isNew) {
                newVal = pl.mjhand[pl.mjhand.length - 1];
            } else {
                pl.mjhand.sort(function(a, b) {
                    return a - b;
                });
                newVal = pl.mjhand[pl.mjhand.length - 1];
            }
        }
    }

    var up = node.getChildByName("up");
    var stand = node.getChildByName("stand");

    // 吃碰的牌
    var upSize = up.getSize();
    var upScale = up.scale;

    // 手牌
    if(off === 0){
        var standSize = stand.getSize();
        var standScale = stand.scale;
    }

    var chiCards = [], pengCards = [], handCards = [], allCardArr = [];
    for(var i = 0; i < children.length; i++) {
        var ci = children[i];
        if (ci.name === "chi") {
            chiCards.push(ci);
        }else if(ci.name === "peng"){
            pengCards.push(ci)
        }else if(ci.name === "mjhand"){
            if(!newC && newVal === ci.tag) {
                newC = ci;
            } else {
                handCards.push(ci);
            }
        } else if(ci.name === "mjhand_replay") {
            handCards.push(ci);
        }
    }
    handCards.sort(function (a, b) {
        return a.tag - b.tag;
    });
    if(newC) handCards.push(newC);

    // 被吃掉的牌放第一张
    for(var c = 0; c < chiCards.length; c++){
        if(chiCards[c].ischiCard){
            chiCard = chiCards[c];
        }else{
            tempArr.push(chiCards[c]);
        }
        if(c % 3 === 2) {
            if(chiCard) tempArr.unshift(chiCard);
            tempArr[0].ischi3 = false;
            tempArr[1].ischi3 = false;
            tempArr[2].ischi3 = true;
            chiCardArr = chiCardArr.concat(tempArr);
            tempArr = [];
        }
    }
    chiCards = chiCardArr.slice();

    var uiCardArr = [chiCards, pengCards, handCards];
    for(var i = 0; i < uiCardArr.length; i++){
        var arr = uiCardArr[i];
        for(var j = 0; j < arr.length; j++){
            allCardArr.push(arr[j]);
        }
    }

    for(var i = 0; i < allCardArr.length; i++)
    {
        var card = allCardArr[i];
        card.setColor(cc.color(255, 255, 255));

        if(off === 0)
        {
            if(i > 0){
                // down: 吃，碰的牌
                if(card.name === "chi" || card.name === "peng"){
                    // 吃碰牌堆之间的牌
                    if (allCardArr[i - 1].ispeng3 || allCardArr[i - 1].ischi3){
                        card.x = allCardArr[i - 1].x + upSize.width * upScale * 1.20;  // 吃吃牌堆间隙，碰碰牌堆间隙
                   }else{
                        card.x = allCardArr[i - 1].x + upSize.width * upScale * 0.93;  // 正常吃碰
                    }
                }

                // down: 自己手牌
                if(card.name === "mjhand"){
                    if(allCardArr[i - 1].ispeng3 || allCardArr[i - 1].ischi3){
                        card.x = allCardArr[i - 1].x + standSize.width * standScale;   // 手牌前一张是吃碰牌
                    }else{
                        card.x = allCardArr[i - 1].x + standSize.width * standScale * 0.93;  // 正常手牌
                    }
                }
                card.zIndex = allCardArr[i - 1].zIndex + 1;
            }else{
                card.x = up.x;
                card.y = up.y;
                card.zIndex = up.zIndex + 100;
            }
        }
        else if(off === 1 || off === 2 || off === 3)
        {
            var dire = off === 1 ? -1 : 1;
            var gap = 0.25;
            // right, top, left: 吃，碰的牌
            if(i > 0){
                if(card.name === "chi" || card.name === "peng") {
                    // 吃碰牌堆之间的牌
                    if (allCardArr[i - 1].ispeng3 || allCardArr[i - 1].ischi3) {
                        card.x = allCardArr[i - 1].x + upSize.width * upScale * dire;
                        card.y = up.y;
                    } else {
                        card.x = allCardArr[i - 1].x;
                        card.y = allCardArr[i - 1].y - upSize.height * upScale * gap;
                    }
                }
                card.zIndex = allCardArr[i - 1].zIndex + 1;
            } else{
                card.x = up.x;
                card.y = up.y;
                card.zIndex = up.zIndex;
            }
        }

        card.setColor(cc.color(255, 255, 255));

        if(off === 0) {
            if(card.name === "mjhand") {
                SetTouchCardHandler(stand, card);

                // 听牌置灰
                if(pl && pl.isTing) {
                    card.setColor(cc.color(170, 170, 170));
                    card.addTouchEventListener(function () {});
                }

                // 点击听牌置灰
                if(MjClient.clickTing && !MjClient.canTingCards[card.tag]) {
                    card.setColor(cc.color(170, 170, 170));
                    card.addTouchEventListener(function () {});
                }


                // 听牌提示
                if (MjClient.outTingCards && MjClient.outTingCards[card.tag.toString()]) {
                    card.getChildByName("tingSign").visible = true;
                }
                else {
                    card.getChildByName("tingSign").visible = false;
                }


                // 新牌特殊处理
                if(i === allCardArr.length - 1 && newC) {
                    var newX = upSize.width * upScale * 0.35;
                    card.x = card.x + newX;
                    MjClient.newCard = newC;
                    SetTouchCardHandler(stand, card);
                }

                // 取消箍臭 置灰
                if(!tData.areaSelectMode["qxgc"] && pl.guChouValue === 1) {
                    card.setColor(cc.color(170, 170, 170));
                    card.addTouchEventListener(function () {});
                }

                //吃后，不能打的这张牌
                if(IsTurnToMe() && tData.tState === TableState.waitPut)
                {
                    if(tData.putType === 1 && pl.mjhand.length > 2 && pl.mjchiCard && tData.areaSelectMode["chbctz"])
                    {
                        if(pl.mjchiCard[pl.mjchiCard.length - 1] === card.tag)
                        {
                            card.setColor(cc.color(170, 170, 170));
                        }
                    }

                    if(tData.putType === 3 && pl.mjhand.length > 2 && pl.mjpeng && tData.areaSelectMode["phbctz"])
                    {
                        if(pl.mjpeng[pl.mjpeng.length - 1] === card.tag)
                        {
                            card.setColor(cc.color(170, 170, 170));
                        }
                    }
                }
            }

        }else{

            // 其他玩家吃碰牌加监听
            if(card.name === "chi" || card.name === "peng"){
                MjClient.playui.addTouchEnventForShowCard(card, off);
            }
        }


        // 吃掉的牌置灰
        if(card.ischiCard){
            card.setColor(cc.color(170, 170, 170));
        }
    }
};

// 判断吃碰杠胡的状态
PlayLayer_xuPuLaoPai.prototype.EatVisibleCheck = function()
{
    var eat = MjClient.playui.jsBind.eat;
    MjClient.playui.jsBind.eat.changeui.changeuibg._node.visible = false;
    var sData = MjClient.data.sData;
    var tData = sData.tData;

    eat.panelBg._node.visible = false;
    eat.chi0._node.visible = false;
    eat.chi1._node.visible = false;
    eat.chi2._node.visible = false;
    eat.peng._node.visible = false;
    eat.hu._node.visible = false;
    eat.guo._node.visible = false;
    eat.cancel._node.visible = false;

    var pl = sData.players[SelfUid() + ""];
    MjClient.eatpos = [];


    //吃碰杠胡node
    var vnode = [];
    if((pl.mjState !== TableState.waitPut || tData.uids[tData.curPlayer] !== SelfUid()) && pl.mjState !== TableState.waitEat){
        return;
    }

    //自摸
    if(tData.tState === TableState.waitPut && pl.mjState === TableState.waitPut)
    {
        if(IsTurnToMe()) {

            //胡
            if (pl.isNew && pl.eatFlag & 8) {
                vnode.push(eat.hu._node);
                pl.isZiMoHu = true;
            }

            //听
            if (!pl.isTing) {
                MjClient.canTingCards = {};
                for (var i = 0; i < pl.mjhand.length; i++) {
                    var cardsAfterPut = pl.mjhand.slice(0);
                    var card = cardsAfterPut[i];
                    cardsAfterPut.splice(i, 1); //依次去掉某张牌看能不能听
                    if (MjClient.majiang.canTing(cardsAfterPut)) {
                        MjClient.canTingCards[card] = 1;
                    }
                }
            }

            if(vnode.length > 0) {
                vnode.push(eat.guo._node);

                eat.ting._node.visible = false;
                eat.noTing._node.visible = false;
                isCheckedTing = false;
            }
        }
    }
    //别人点
    else if(tData.tState === TableState.waitEat)
    {
        if(!IsTurnToMe()) {
            if (pl.eatFlag & 8) {
                if(pl.mustHu) pl.isZiMoHu = true;
                vnode.push(eat.hu._node);
            }
            if (pl.eatFlag & 2) {
                vnode.push(eat.peng._node);
            }
            if (pl.eatFlag & 1) {
                MjClient.eatpos = MjClient.majiang.canChi(pl.mjhand, tData.lastPutCard);
                if (MjClient.eatpos.length > 0) vnode.push(eat.chi0._node);
            }

            if(vnode.length > 0) {
                vnode.push(eat.guo._node);
                eat.ting._node.visible = false;
                eat.noTing._node.visible = false;
                isCheckedTing = false;
            } else {
                getUIPlayer(0).mjState = TableState.waitCard;
            }
        }
    }

    //吃碰胡过处理
    if(vnode.length > 0) {
        MjClient.playui.showCurEatCards(vnode);
    }

    if (pl.isTing && eat.hu._node.visible) {
        MjClient.playui.sendMessage_MJHu();
    }
};


// 叫听自动胡
PlayLayer_xuPuLaoPai.prototype.sendMessage_MJHu = function()
{
    cc.log("send Message ------ MJHu");
    if (MjClient.rePlayVideo != -1) return; // 回放时候不能请求
    MjClient.gamenet.request("pkroom.handler.tableMsg", {
        cmd: "MJHu",
        eatFlag: EatFlag()
    });
}

/*
    玩家ui，信息
 */
PlayLayer_xuPuLaoPai.prototype.Node_player = function(off)
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
    var _chongIcon = _head.getChildByName("chongIcon");

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
        var tData = MjClient.data.sData.tData;
        if(tData.fieldId){
            _zhuang.loadTexture("playing/gameTable/youxizhong-1_89_2.png");
            _zhuang.setPosition(cc.p(110,30));
        }
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

    var _flower_layout = _head.getChildByName("flower_layout");
    _flower_layout.visible = false;

    var _flower_zfb_layout = _head.getChildByName("flower_zfb_layout");
    _flower_zfb_layout.visible = false;

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
    var _iconList = ["bc","c1","c2","c3","c4"];

    UIEventBind(null, _node, "clearCardUI", function (eD) {
        clearCardUI(_node, off);
        if(_huaCount) _huaCount.setString("花 x 0");
        if(_skipHuIconTag) _skipHuIconTag.visible = false;
        if(_skipPengIconTag) _skipPengIconTag.visible = false;
        if(_tingCardsNode) _tingCardsNode.visible = false;
        if(_tingCardNumNode) _tingCardNumNode.visible = false;
    });

    UIEventBind(null, _node, "initSceneData", function (eD) {
        SetUserVisible_xuPuLaoPai(_node, off);
        if (IsArrowVisible()) MjClient.playui.showUserZhuangLogo(_zhuang, off);
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
        if(_tingCardsNode) MjClient.playui.tingIconVisible(_tingCardsNode,off);

        //冲
        if(pl && pl.chongScore >= 0)
        {
            _chongIcon.loadTexture("res/playing/changpai/other/" + _iconList[pl.chongScore] + ".png");
            _chongIcon.visible = true;
        }
        else
        {
            _chongIcon.visible = false;
        }

        //显示古丑的弹窗
        var _currentZhuang = MjClient.data.sData.tData.zhuang;
        var idx = MjClient.data.sData.tData.uids.indexOf(SelfUid());
        if(pl && pl.info.uid == SelfUid() && !MjClient.data.sData.tData.areaSelectMode["qxgc"] )
        {

            var tData = MjClient.data.sData.tData;

            if (tData.tState != TableState.waitPut) {
                return;
            }
            var _isShowGuLayer = true;
            var _seletIdx = 0; //当前做选择的人数
            MjClient.AllPlayerRun(function (Pll) {
                if (Pll.guChouValue > 0 && _isShowGuLayer)//如果有人选了古丑
                {
                    _isShowGuLayer = false;
                }

                if (Pll.guChouValue != -1) {
                    _seletIdx++;
                }
            });

            if(_currentZhuang != idx) { //自己不是是庄的情况
                if (_isShowGuLayer && _seletIdx < (MjClient.MaxPlayerNum - 1) && pl.guChouValue == -1) {
                    var layer = new xuPuGuChouLayer(function () {
                        // 弹窗等待
                        // MjClient.playui._jiazhuWait.visible = true;
                    });
                    MjClient.playui.addChild(layer, 99, 826);
                }
                else
                {
                    MjClient.playui._guChouTip.visible = true;
                }
            }
            else
            {
                if(_isShowGuLayer && _seletIdx < (MjClient.MaxPlayerNum -1)) MjClient.playui._guChouTip.visible = true;
                if(_seletIdx == (MjClient.MaxPlayerNum -1)) //大家不选，删除
                {
                    if(MjClient.playui.getChildByName("xuPuGuChouLayer"))
                    {
                        MjClient.playui.removeChildByName("xuPuGuChouLayer");
                    }
                    MjClient.playui._guChouTip.visible = false;
                }
            }

            if(!_isShowGuLayer ) //有人选了古丑，删除
            {
                if(MjClient.playui.getChildByName("xuPuGuChouLayer"))
                {
                    MjClient.playui.removeChildByName("xuPuGuChouLayer");
                }
                MjClient.playui._guChouTip.visible = false;
            }
        }
        MjClient.playui.updateMjHandColor(_node);
    });
    UIEventBind(null, _node, "addPlayer", function (eD) {
        SetUserVisible_xuPuLaoPai(_node, off);
        showFangzhuTagIcon(_head,off);
        if(_huaCount) MjClient.playui.setPlayerHuaValueShow(_huaCount.getParent());
        GetReadyVisible(_ready, off);

    });
    UIEventBind(null, _node, "removePlayer", function (eD) {
        SetUserVisible_xuPuLaoPai(_node, off);
        showFangzhuTagIcon(_head,off);
        GetReadyVisible(_ready, off);
        if(_huaCount)  MjClient.playui.setPlayerHuaValueShow(_huaCount.getParent());
    });
    UIEventBind(null, _node, "mjhand", function (eD) {
        InitUserHandUI_xuPuLaoPai(_node, off);
        var _currentZhuang = MjClient.data.sData.tData.zhuang;
        var idx = MjClient.data.sData.tData.uids.indexOf(SelfUid());
       if(off == 0 && !MjClient.data.sData.tData.areaSelectMode["qxgc"] ) //没有选择取消古丑；如果当前自己是庄则不弹古丑的弹窗
       {
           MjClient.playui._guChouTip.visible = false;
           if(_currentZhuang != idx)
           {
               var layer = new xuPuGuChouLayer();
               MjClient.playui.addChild(layer, 99, 826);
           }
           else
           {
               MjClient.playui._guChouTip.visible = true;
           }
       }

       var tData = MjClient.data.sData.tData;
        if (tData.areaSelectMode.chongFenId == 2) { // 选择必冲要初始化显示冲的值
            var pl = getUIPlayer(off);
            if (pl) {
                pl.chongScore = tData.areaSelectMode.chongFenScore;
                _chongIcon.loadTexture("res/playing/changpai/other/" + _iconList[pl.chongScore] + ".png");
                _chongIcon.visible = true;
            }
        }

    });
    UIEventBind(null, _node, "roundEnd", function (eD) {
        var tData = MjClient.data.sData.tData;
        if (!tData.fieldId)
            InitUserCoinAndName_jinzhong(_node, off);
        else
            InitUserCoinAndName(_node, off);
        _tingIcon.visible = false;
        _chongIcon.visible = false;

        if(MjClient.playui.getChildByName("xuPuGuChouLayer"))
        {
            MjClient.playui.removeChildByName("xuPuGuChouLayer");
        }

        if(MjClient.playui.getChildByName("xuPuChongLayer"))
        {
            MjClient.playui.removeChildByName("xuPuChongLayer");
        }

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
            MjClient.playui.DealNewCard(_node,eD.newCard,off);
            hideTingBtn();
        }
    });

    UIEventBind(null, _node, "MJPut", function (eD) {
        MjClient.playui.DealMJPut(_node, eD, off);
        if(_tingCardNumNode) _tingCardNumNode.visible = false;
        setUserOffline(_node, off);
    });

    UIEventBind(null, _node, "MJChi", function (eD) {
        MjClient.playui.DealMJChi(_node, eD, off);
        setUserOffline(_node, off);
    });


    UIEventBind(null, _node, "MJPeng", function (eD) {
        MjClient.playui.DealMJPeng(_node, eD, off);
        setUserOffline(_node, off);
    });

    UIEventBind(null, _node, "MJHu", function (eD) {
        HandleMJHu(_node, eD, off);
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

    UIEventBind(null, _node, "MJTing", function (eD) {
        HandleMJTing(_node, eD, off);
        var pl = getUIPlayer(off);
        if(pl && eD.uid == getUIPlayer(off).info.uid)
        {
            pl.putCardAfterTing = eD.putCardAfterTing;
        }
    });


    UIEventBind(null, _node, "waitPut", function (eD) {
        MjClient.playui.showUserZhuangLogo(_zhuang, off);
        if(off != 0) MjClient.playui.DealWaitPut(this, eD, off); //其他家发牌
        MjClient.playui.updateMjHandColor(_node);

        // 回放刷新冲显示
        var tData = MjClient.data.sData.tData;
        if (MjClient.rePlayVideo != -1 && tData.areaSelectMode.chongFenId != 1) {
            var pl = getUIPlayer(off);
            if (pl) {
                for (var k in eD.data) {
                    if (k == pl.info.uid) {
                        pl.chongScore = eD.data[k];
                        break;
                    }
                }
                //冲
                if(pl && pl.chongScore >= 0) {
                    _chongIcon.loadTexture("res/playing/changpai/other/" + _iconList[pl.chongScore] + ".png");
                    _chongIcon.visible = true;
                }
                else {
                    _chongIcon.visible = false;
                }
            }
        }
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
                var tingSet = calTingSet(pl.mjhand, new Set([tData.hunCard, tData.hunCard2]));
                cc.log("PlayerGamePanel ---------- refreshTingNum ---------- tingSet = " + JSON.stringify(tingSet));
                if(_tingCards) MjClient.playui.setTingCards(_tingCards, tingSet);
            }
        };
        // 刷新听牌张数
        UIEventBind(null, _node, "MJPut", function (eD) {
            refreshTingNum(off, eD);
        });

        UIEventBind(null, _node, "MJChi", function (eD) {
            refreshTingNum(off, eD);
        });

        UIEventBind(null, _node, "MJPeng", function (eD) {
            refreshTingNum(off, eD);
        });

        UIEventBind(null, _node, "selectTing", function (eD) {
            
        });

        UIEventBind(null, _node, "waitJiazhu", function (eD) {
            var pl = getUIPlayer(off);
            if (pl) {
                for (var key in eD.chongData) {
                    if (key == pl.info.uid) {
                        pl.minSelectChongScore = eD.chongData[key];
                    }
                }
            }

            var layer = new xuPuChongLayer(function(){
                //弹窗等待
                MjClient.playui._jiazhuWait.visible = true;
            });
            MjClient.playui.addChild(layer, 99,826);
            if (MjClient.webViewLayer != null) {
                MjClient.webViewLayer.close();
            }
        });
    }

    //玩家选了冲之后服务器返回回调
    UIEventBind(null, _node, "selectChong", function (eD) {
        cc.log("===============================eD = " + JSON.stringify(eD));
        var pl = getUIPlayer(off);
        if(pl && eD.uid == pl.info.uid)
        {
            _chongIcon.visible = true;
            _chongIcon.loadTexture("res/playing/changpai/other/" + _iconList[eD.chongScore] + ".png")
        }
    });



    //玩家选了古丑之后服务器返回回调
    UIEventBind(null, _node, "selectGuChou", function (eD) {
        var pl = getUIPlayer(off);
        var _isShowGuLayer = true;
        var _seletIdx = 0;
        MjClient.AllPlayerRun(function(Pll){
            if(Pll.guChouValue > 0 && _isShowGuLayer)//如果有人选了古丑
            {
                _isShowGuLayer =  false;
            }

            if(Pll.guChouValue != -1)
            {
                _seletIdx++;
            }
        });


        if(eD.uid == SelfUid())
        {
            if(!_isShowGuLayer || _seletIdx == (MjClient.MaxPlayerNum -1))   MjClient.playui._guChouTip.visible = false; //古丑动作结束
            if(_isShowGuLayer && _seletIdx < (MjClient.MaxPlayerNum -1)) MjClient.playui._guChouTip.visible = true;
        }

        if(!_isShowGuLayer || _seletIdx == (MjClient.MaxPlayerNum -1)) //有人选了古丑,或者大家不选，删除
        {
            if(MjClient.playui.getChildByName("xuPuGuChouLayer"))
            {
                MjClient.playui.removeChildByName("xuPuGuChouLayer");
            }
            MjClient.playui._guChouTip.visible = false;
        }

    });



    /********************************************设置位置*********************************************/
    switch (off)
    {
        case 0:
            setWgtLayout(_play_tips,[0, 0.14], [0.5, 0.4], [0, 0]);
            setWgtLayout(_ready,[0.07, 0.07], [0.5, 0.5], [0, -1.5]);
            setWgtLayout(_stand,[0.055, 0], [0.5, 0], [0, 0]);
            setWgtLayout(_up,[0.04, 0], [0.1, 0], [0, 0]);
            setWgtLayout(_out0, [0, 0.18], [0.35, 0.42], [0, 0]);
            setWgtLayout(_out1, [0, 0.18], [0.35, 0.37], [0, 0]);

            if(_out2) setWgtLayout(_out2, [0.0, 0.18], [0.35, 0.32], [0, 0]);
            if(_outBig) setWgtLayout(_outBig, [0.0836, 0], [0.5, 0.32], [0, 0]);
            if (MjClient.MaxPlayerNum == 2)
            {
                setWgtLayout(_out0, [0, 0.18], [0.2, 0.42], [0, 0]);
                setWgtLayout(_out1, [0, 0.18], [0.2, 0.37], [0, 0]);
                if(_out2) setWgtLayout(_out2, [0.0, 0.18], [0.2, 0.32], [0, 0]);
            }

            if(_tingCardsNode) setWgtLayout(_tingCardsNode, [0.25, 0.15], [0.15, 0.25], [-0.2, 0]);
            // if(_tingCardNumNode) setWgtLayout(_tingCardNumNode, [0.2, 0.2], [0.12, 0.35], [0,-0.2]);
            if(_tingCardNumNode) setWgtLayout(_tingCardNumNode, [0.2, 0.2], [0.12, 0.35], [0,-100]);
            break;
        case 1:
            setWgtLayout(_play_tips,[0.08, 0.14], [0.75, 0.5], [0, 0.5]);
            setWgtLayout(_ready,[0.07, 0.07], [0.5, 0.5], [2, 0]);
            setWgtLayout(_up,[0, 0.18], [0.97, 0.82],[0, 0]);
            setWgtLayout(_out0, [0, 0.18], [0.70, 0.67], [0, 0]);
            setWgtLayout(_out1, [0, 0.18], [0.75, 0.67], [0, 0]);
            if(_out2) setWgtLayout(_out2, [0, 0.18], [0.80, 0.67], [0, 0]);
            if(_outBig) setWgtLayout(_outBig, [0.0836, 0], [0.75, 0.58], [0, 0]);
            if (MjClient.MaxPlayerNum == 3)
            {
                setWgtLayout(_out0, [0, 0.18], [0.70, 0.8], [0, 0]);
                setWgtLayout(_out1, [0, 0.18], [0.75, 0.8], [0, 0]);
                if(_out2) setWgtLayout(_out2, [0, 0.18], [0.80, 0.8], [0, 0]);
            }
            break;
        case 2:
            setWgtLayout(_play_tips,[0.08, 0.14], [0.5, 0.75], [0, 0]);
            setWgtLayout(_ready,[0.07, 0.07], [0.5, 0.5], [0, 1.5]);
            setWgtLayout(_up,[0, 0.18], [0.55, 0.9], [0, 0]);
            setWgtLayout(_out0, [0, 0.18], [0.35, 0.67], [0, 0]);
            setWgtLayout(_out1, [0, 0.18], [0.35, 0.72], [0, 0]);
            if(_out2) setWgtLayout(_out2, [0, 0.18], [0.35, 0.77], [0, 0]);
            if(_outBig) setWgtLayout(_outBig, [0.0836, 0], [0.5, 0.75], [0, 0]);
            if (MjClient.MaxPlayerNum == 2)
            {
                setWgtLayout(_out0, [0, 0.18], [0.2, 0.67], [0, 0]);
                setWgtLayout(_out1, [0, 0.18], [0.2, 0.72], [0, 0]);
                if(_out2) setWgtLayout(_out2, [0, 0.18], [0.2, 0.77], [0, 0]);
            }
            break;
        case 3:
            setWgtLayout(_play_tips,[0.08, 0.14], [0.25, 0.5], [0, 0.5]);
            setWgtLayout(_ready,[0.07, 0.07], [0.5, 0.5], [-2, 0]);
            setWgtLayout(_up,[0, 0.18], [0.03, 0.82], [0, 0]);
            setWgtLayout(_out0, [0, 0.18], [0.20, 0.67], [0, 0]);
            setWgtLayout(_out1, [0, 0.18], [0.25, 0.67], [0, 0]);
            if(_out2) setWgtLayout(_out2, [0, 0.18], [0.30, 0.67], [0, 0]);
            if(_outBig) setWgtLayout(_outBig, [0.0836, 0], [0.25, 0.58], [0, 0]);
            if (MjClient.MaxPlayerNum == 3)
            {
                setWgtLayout(_out0, [0, 0.18], [0.20, 0.8], [0, 0]);
                setWgtLayout(_out1, [0, 0.18], [0.25, 0.8], [0, 0]);
                if(_out2) setWgtLayout(_out2, [0, 0.18], [0.30, 0.8], [0, 0]);
            }
            break;
        default:
            break;
    }
}

/*
    听牌按钮检测
 */
PlayLayer_xuPuLaoPai.prototype.checkTingBtn = function (node, msg) {
    var tData = MjClient.data.sData.tData;
    if (!tData.areaSelectMode.tingPai) return;

    node.visible = false;

    if (!(tData.tState == TableState.waitPut 
        || tData.tState == TableState.waitEat 
        || tData.tState == TableState.waitCard)) {
        return;
    }

    var pl = getUIPlayer(0);
    if (!pl || !pl.mjhand) {
        return;
    }

    if (pl.isTing) {
        return;
    }
    
    var tingCards = {};
    if (pl.mjhand.length % 3 == 1) {
        var handCards = pl.mjhand.slice();
        tingCards = MjClient.majiang.calTingSet(handCards, tData.hunCard);  
    }

    if (Object.keys(tingCards).length > 0) {
        node.visible = true;
    }
}

/*
    取消听牌按钮检测
 */
PlayLayer_xuPuLaoPai.prototype.checkCancleTingBtn = function (node, msg) {
    var tData = MjClient.data.sData.tData;
    if (!tData.areaSelectMode.tingPai) return;

    node.ignoreContentAdaptWithSize(true);
    node.visible = false;

    if (!(tData.tState == TableState.waitPut 
        || tData.tState == TableState.waitEat 
        || tData.tState == TableState.waitCard)) {
        return;
    }

    var pl = getUIPlayer(0);
    if (!pl || !pl.mjhand) {
        return;
    }

    if (pl.isTing) {
        node.visible = true;
    }
}

/*
    根据牌值获取牌的名字
 */
PlayLayer_xuPuLaoPai.prototype.getCardName = function (card) 
{
    cc.log("jcw =========== card = ", card);
    var str = ""
    if (card > 30) {
        str = ["", "老钱", "飘花", "牛婆"][card % 30];
    }
    else {
        var color = Math.floor(card / 10);
        var idx = card % 10;
        str = ["一","二","三","四","五","六","七","八","九"][idx-1] + ["万", "本", "索"][color];
    }
    return str;
}

/*
    显示听牌
 */
PlayLayer_xuPuLaoPai.prototype.showTingCardsName = function (node, msg, tingCards) {

    if (!node) node = this._tingTipText;

    var tData = MjClient.data.sData.tData;
    node.visible = false;

    if (!(tData.tState == TableState.waitPut 
        || tData.tState == TableState.waitEat 
        || tData.tState == TableState.waitCard)) {
        return;
    }

    var pl = getUIPlayer(0);
    if (!pl || !pl.mjhand) {
        return;
    }

    var cards = [];
    if (tingCards) {
        cards = tingCards;
    }
    else {
        var tingCards = {};
        if (pl.mjhand.length % 3 == 1) {
            var handCards = pl.mjhand.slice();
            tingCards = MjClient.majiang.calTingSet(handCards, tData.hunCard);  
        }
        cards = Object.keys(tingCards);
    }
    

    if (cards.length > 0) {
        node.visible = true;
        var str = "听：";
        for (var i = 0; i < cards.length; i++) {
            str += MjClient.playui.getCardName(cards[i]) + " ";
        }
        node.setString(str);
    }
    else {
        node.visible = false;
    }
};
