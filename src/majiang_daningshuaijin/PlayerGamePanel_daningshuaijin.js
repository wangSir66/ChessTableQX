/**
 * Created by Administrator on 2017/3/9.
 */
var actionZindex = 1000;
//向服务器发送 过消息
MjClient.MJPass2NetFordaningshuaijin = function()
{
    // console.log(">>>>>>>>>普通  过 <<<<<<<<");
    cc.log("====================MJPass2NetFordaningshuaijin======pass=====");
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
function SetUserVisible_daningshuaijin(node, off)
{
    //var sData = MjClient.data.sData;
    //return;
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
        InitUserHandUI_daningshuaijin(node, off);
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
function DealMJPut_daningshuaijin(node, msg, off, outNum)
{
    DealMJPut_shanXiApp(node, msg, off, outNum);
}

function InitUserHandUI_daningshuaijin(node, off)
{
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var pl = getUIPlayer(off);
    if(!pl)
    {
        return;
    }
    //初始化玩家金币和名称
    InitUserCoinAndName_jinzhong(node, off);
    setAreaTypeInfo(true);
    if(
        tData.tState != TableState.waitPut &&
        tData.tState != TableState.waitEat &&
        tData.tState != TableState.waitCard
    )
    {
        return;
    }

    if (MjClient.rePlayVideo == -1)
    {
        setHunNodeVisible(true);
    }
    else
    {
        setHunNodeVisible(false);
    }
    //添加碰
    MjClient.playui.addPengUI(node,pl,tData,off);
    //添加明杠
    MjClient.playui.addGangUI(node,pl,tData,off);
    //添加暗杠
    MjClient.playui.addAnGangUI(node,pl,tData,off);
    //添加吃
    MjClient.playui.addChiUI(node,pl,tData,off);
    //添加打出的牌
    MjClient.playui.addOutCardUI(node,pl,tData,off);
    //添加手牌
    MjClient.playui.addHandCardUI(node,pl,tData,off);
    //添加手花
    MjClient.playui.addFlowerCardUI(node,pl,tData,off);
    MjClient.playui.CardLayoutRestore(node, off);
}

function initFlower_daningshuaijin() {
    initFlower(false, false);
}


var PlayLayer_daningshuaijin = cc.Layer.extend({
    jsBind: {
        _event: {
            mjhand: function() {
                if(MjClient.endoneui != null)
                {
                    cc.log("=======mjhand====endoneui====" + typeof (MjClient.endoneui) );
                    MjClient.endoneui.removeFromParent(true);
                    MjClient.endoneui = null;
                }
                setHunNodeVisible(true);
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
                        self.addChild(new EndOneView_daningshuaijin(),500);
                    }
                    this.runAction(cc.sequence(cc.DelayTime(0.2),cc.callFunc(delayExe)));
                }
            },
            moveHead: function() {
                postEvent("returnPlayerLayer");
                tableStartHeadMoveAction(this);
                var tData = MjClient.data.sData.tData;

                initFlower_daningshuaijin();
            },
            initSceneData: function() {
                reConectHeadLayout(this);
                cc.log("initSceneData -----------------gunyun = " + JSON.stringify(this));
                CheckRoomUiDelete();
            },
            onlinePlayer: function(msg) {
                cc.log('88383838383+'+JSON.stringify(this));
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
                    if(MjClient.matchRank){
                        showPlayUI_matchInfo("排名："+MjClient.matchRank+"/"+tData.matchInfo.userCount+"\n前"+tData.matchInfo.jingjiCount+"名晋级");
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
                    MjClient.openWeb({url:MjClient.GAME_TYPE.DA_NING_SHUAI_JIN,help:true});
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
                            //this.visible = false;
                        },
                        mjhand:function()
                        {
                            this.visible = true;
                        },
                        initSceneData: function () {
                            this.visible = true;
                        }
                    },
                },
                baidaText: {
                    _run:function()
                    {
                        //baidaOject = this;
                        this.setVisible(false);
                    },
                    _event: {
                        roundEnd:function (eD) {
                            //this.visible = false;
                        }
                    },
                },
                baidaImg: {
                    _run: function () {
                        this.setVisible(false);
                    },
                    _event: {
                        mjhand: function () {
                            this.setScale(1);
                            this.setPosition(-296, -280);
                            var hunCardMsg = MjClient.data.sData.tData.hunCard;
                            this.visible = false;
                            if(hunCardMsg && hunCardMsg != -1)
                            {
                                this.visible = true;
                                var func = cc.callFunc(function(){
                                    playEffect("hunCardFly");
                                });
                                setCardSprite(this, parseInt(hunCardMsg), 4);
                                this.runAction(cc.sequence(cc.delayTime(1),
                                    cc.spawn(cc.scaleTo(0.6,0.5),cc.moveTo(0.6,0,1.86)).easing(cc.easeQuinticActionOut()),
                                    func));
                            }
                            else
                            {
                                this.getParent().visible = false;
                            }
                        },
                        initSceneData: function () {
                            this.visible = true;
                            var hunCardMsg = MjClient.data.sData.tData.hunCard;
                            if (hunCardMsg && hunCardMsg != -1) {
                                setCardSprite(this, parseInt(hunCardMsg), 4);
                            }
                        },
                        roundEnd: function (eD) {
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
                        var hunCardMsg = MjClient.data.sData.tData.hunCard;
                        if(hunCardMsg && hunCardMsg != -1)
                        {
                            this.visible = true;
                        }
                        else
                        {
                            this.visible = false;
                        }

                    },
                    initSceneData:function()
                    {
                        this.visible = true;
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;
                        cc.log(" tData.tState  ------------sking = " + tData.tState );
                        if(tData.tState != TableState.waitPut &&
                            tData.tState != TableState.waitEat &&
                            tData.tState != TableState.waitCard
                        )
                        {
                            this.visible = false;
                        }else{
                            var hunCardMsg = MjClient.data.sData.tData.hunCard;
                            if(hunCardMsg && hunCardMsg != -1)
                            {
                                this.visible = true;
                            }
                            else
                            {
                                this.visible = false;
                            }
                        }
                    }
                },
                _run: function() {
                    this.visible = false;
                },
            },
            _event:{
                endRoom: function() {
                    this.visible=false;
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
        //
        //     },
        //     _event: {
        //         initSceneData: function(eD) {
        //             this.visible = IsArrowVisible();
        //             SetArrowRotation(this)
        //         },
        //         mjhand: function(eD) {
        //             this.visible = IsArrowVisible();
        //             SetArrowRotation(this);
        //             setArrowFengDir(this);
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

        BtnPutCard:{ //add by  sking for put card button
            _run: function () {

                var tData = MjClient.data.sData.tData;


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

                },
                MJHu:function(){
                    this.visible = false;

                },
                newCard: function(eD)
                {

                    this.visible = true;
                    //setWgtLayout(this, [0.1, 0.1],[0.7, 0.2],[0, 0]);
                },
                MJPut: function(eD) {

                    this.visible = false;
                },
                MJChi: function(eD) {

                    if(IsTurnToMe())
                    {
                        this.visible = true;
                    }
                },
                MJGang: function(eD) {

                    if(IsTurnToMe())
                    {
                        this.visible = true;
                    }
                },
                MJPeng: function(eD) {

                    if(IsTurnToMe())
                    {

                        this.visible = true;
                    }
                },
                MJTing: function (eD) {
                    if(MjClient.playui.isCanPutCard())
                    {
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
                        eat.ou._node.visible=false;
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
                        var tingCards = {};

                        tingCards = MjClient.majiang.getCheckTingHuCards(currentCard, pl.mjhand, true);
                        MjClient.playui.setCurrentTingNum(tingCards, false, currentCard);
                        COMMON_UI.clearShowCurrentEatCards();
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

                        MJPengToServer();
                        COMMON_UI.clearShowCurrentEatCards();
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
                    if (eT == 2) {

                        MJGangCardchange(btn.tag);
                        COMMON_UI.clearShowCurrentEatCards();
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
                    if (eT == 2){

                        MJGangCardchange(btn.tag);
                        COMMON_UI.clearShowCurrentEatCards();
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
                    if (eT == 2)
                    {

                        MJGangCardchange(btn.tag);
                        COMMON_UI.clearShowCurrentEatCards();
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
                        MjClient.MJPass2NetFordaningshuaijin();
                    }
                },
                bgimg: {
                    _run: function() {
                        this.zIndex = -1;
                    }
                }
            },
            ou: {
                _visible: false,
                _layout: [
                    [0, 0.1],
                    [0.5, 0],
                    [-3, 2.5]
                ],

                _touch: function(btn, eT) {
                    console.log(">>>> lf，点击讴牌按钮");
                    if (eT == 2) {
                        var msg="怄牌后不参与牌局，\n 但是仍然正常结算，\n 确认怄牌吗？";
                        MjClient.showMsg(msg, function()
                        {
                            //cc.log("==========1=============");
                            this.visible = false;
                            hideCurrentTingNum();
                            MJOuCardToServer();
                            COMMON_UI.clearShowCurrentEatCards();
                        }, function() {}, "1");

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
                    if (eT == 2)
                    {
                        hideTingBtn();
                        MJHuToServer();
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
                    cc.log("111111111111111111111111111+cancle");
                    if (eT == 2) {
                        cc.log("111111111111111111111111111+cancle");
                        btn.visible = false;
                        MjClient.clickTing = false;
                        hideCurrentTingNum();
                        MjClient.playui.CardLayoutRestore(MjClient.playui._downNode, 0);
                        MjClient.playui.EatVisibleCheck();
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
                                if (eT == 2) MjClient.MJPass2NetFordaningshuaijin();
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

                    MjClient.playui.HideEatChildren( MjClient.playui.jsBind.eat);
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
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    tData.curPlayer=eD.curPlayer;
                    MjClient.playui.EatVisibleCheck();
                },
                newCard:function(eD)
                {
                    console.log("HHH :，newcard------11111111111");
                    var tmp=eD.mustHu;
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    tData.curPlayer=tData.uids.indexOf(SelfUid());
                    cc.log("hhh-newcard"+tData.curPlayer);
                    var pl = sData.players[SelfUid() + ""];
                    pl.mustHu=tmp;
                    pl.newSendCard=eD.newCard;
                    MjClient.playui.EatVisibleCheck(tmp);
                },
                MJPut: function(eD) {
                    console.log("HHH :，MJPut------1111111111111");
                    var tmp=eD.mustHus[SelfUid()];

                    MjClient.playui.EatVisibleCheck(tmp);
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
                    MjClient.playui.HideOubtn();
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
                    this.runAction(cc.sequence(cc.DelayTime(0.1),cc.callFunc(delayExe)));
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
                    if(getUIPlayer(0)&&getUIPlayer(0).info.uid == msg.uid){
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
        var playui = ccs.load("Play_daningshuaijin.json");
        this.srcMaxPlayerNum = MjClient.MaxPlayerNum;
        MjClient.MaxPlayerNum = parseInt(MjClient.data.sData.tData.maxPlayer);
        cc.log("MjClient.MaxPlayerNum LYG = " + MjClient.MaxPlayerNum);
        playMusic("bgFight");
        this._downNode  = playui.node.getChildByName("down");
        this._rightNode = playui.node.getChildByName("right");
        this._topNode   = playui.node.getChildByName("top");
        this._leftNode  = playui.node.getChildByName("left");
        MjClient.playui = this;
        this._btnPutCard = playui.node.getChildByName("BtnPutCard");
        this._tingCardsNode = this._downNode.getChildByName("tingCardsNode");
        this._tingCardNumNode = this._downNode.getChildByName("tingCardNumNode");
        var showBtn = this._tingCardNumNode.getChildByName("show_btn");
        this._tingCard_showAll = false;
        showBtn.addTouchEventListener(function(sender, Type) {
            switch (Type) {
                case ccui.Widget.TOUCH_ENDED:
                    if(this._tingCard_showAll == false){
                        this._tingCard_showAll = true;
                    }else{
                        this._tingCard_showAll = false;
                    }

                    var pl = getUIPlayer(0);
                    var tingCards = {};
                    if(MjClient.data.sData.tData.tState == TableState.waitPut
                        && pl.mjState == TableState.waitPut && IsTurnToMe() && sender.cardTag != null)
                    {
                        tingCards = MjClient.majiang.getCheckTingHuCards(sender.cardTag, pl.mjhand, true);

                    }else{

                        tingCards = MjClient.majiang.calTingSet(pl.mjhand, MjClient.data.sData.tData.hunCard, true);
                    }
                    if (Object.keys(tingCards).length <= 7){//小于7时重置
                        this._tingCard_showAll = false;
                    }
                    MjClient.playui.setCurrentTingNum(tingCards, this._tingCard_showAll, sender.cardTag);
                    break;
                default:
                    break;
            }
        }, this)
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


        MjClient.lastMJTick = Date.now();
        this.runAction(cc.repeatForever(cc.sequence(cc.callFunc(function() {
            if (MjClient.game_on_show) MjClient.tickGame(0);
        }), cc.delayTime(7))));

        changeMJBg(this, getCurrentMJBgType());

        var tData = MjClient.data.sData.tData;

        this._tingCardNumNode.setVisible(false);
        /*
         初始化，每个人的信息节点
         */
        for (var i=0;i< 4;i++){
            MjClient.playui.Node_player(i);
        }
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
     设置听和讴牌的icon 是否可见 add by sking
     */
    tingAndOuIconVisible:function(node,off,bcheckOu)
    {
        var pl = getUIPlayer(off)
        if(pl == null) return;
        var tData = MjClient.data.sData.tData;
      //  cc.log("offffffffffffffffffffff  =  " + off );
      //  cc.log("(((((((((((( set card))))))))))))))))) == pl.mjState  " + pl.mjState );

        if(pl && (pl.mjState == TableState.isReady || pl.mjState == TableState.roundFinish))
        {
            node.visible=false;
        }else{
            if(pl != null)
            {
                if(bcheckOu)
                {
                    if (pl.isOuCard) {
                        node.visible = true;

                    }
                    else {
                        node.visible = false;
                    }
                }else{
                    if (pl.isTing) {

                        node.visible = true;

                    }
                    else {
                        node.visible = false;
                    }
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


PlayLayer_daningshuaijin.prototype.CardLayoutRestore = function(node, off)
{
    // node 是克隆新建的一个麻将节点 by sking

    var newC = null; //先创建麻将的UI节点
    var newVal = 0; //新牌的值，是几万，几筒，几条....为数字
    var pl = getUIPlayer(off);//获取玩家信息.off 为0 ，就是自己得信息，能看到自己摸牌 by sking

    var mjhandNum = 0;
    var children = node.children;

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
                    if(tempMaJiang.isEqualHunCard(a))
                    {
                        return -1;
                    }
                    else if (tempMaJiang.isEqualHunCard(b))
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
    var uiOu=[];
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

    var sData = MjClient.data.sData;
    if (sData) var tData = sData.tData;
    var zimoHuType = (pl.huWord && (pl.huWord == "zimo" || pl.huWord == "tianhu"))
        || (pl.mjState && tData && (tData.tState == TableState.waitPut && pl.mjState == TableState.waitPut ));
    if (off != 0 && uistand.length > 0 && zimoHuType && pl.zimoNode) {
        uistand[uistand.length - 1].removeFromParent();
        var zimoNode = getNewCard(getNode(off), "up", "standPri", pl.zimoNode, off);
        zimoNode.setName("zimoCardNode");
        if (off == 3) {
            uistand.push(zimoNode);
        }
        else {
            uistand.unshift(zimoNode);
        }
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
                                ci.x = orders[i - 1].x + upSize.width * upS *COMMON_UI.cardBetween
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
                if(ci.name=="mjhand")
                {
                    if(MjClient.majiang.isHasJinCards(pl.mjhand,tData.hunCard)&&
                        (MjClient.majiang.CalHunCardNum(pl.mjhand,tData.hunCard)>1))
                    {
                        if(MjClient.majiang.isEqualHunCard([ci.tag]))
                        {
                            ci.setColor(cc.color(255, 255, 255));
                        }else{
                            ci.setColor(cc.color(190, 190, 190));
                        }
                    }

                }



            }

            if(off == 0)
            {
                    /*
                ting的情况下，将麻将置灰
                */
                    //讴牌

                    var isGray =  pl.isTing && ci.name == "mjhand";

                    if(MjClient.clickTing&&(tData.uids[tData.curPlayer] == SelfUid()))
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
                            }else if(MjClient.majiang.isEqualHunCard[ci.tag])
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
                            MjClient.newCard = newC;
                            MjClient.newCard.isNew = true; 
                            if(MjClient.majiang.CalHunCardNum(pl.mjhand,tData.hunCard)>1&&!MjClient.majiang.isEqualHunCard([ci.tag])){
                                ci.setColor(cc.color(190, 190, 190));
                                ci.x = ci.x + slotwith + 10;
                                ci.addTouchEventListener(function () {});
                            }else{
                                ci.setColor(cc.color(255, 255, 255));
                                SetTouchCardHandler(stand, ci);
                                ci.x = ci.x + slotwith + 10;

                                //ci.y += 20;//发的新牌默认不提起
                                if (isGray) ci.y += 20;//听牌情况下，发的新牌才默认提起
                            }

                        }
                        else if(isGray)
                        {
                            ci.setColor(cc.color(190, 190, 190));
                            ci.addTouchEventListener(function () {});
                        }
                        else if(MjClient.majiang.CalHunCardNum(pl.mjhand,tData.hunCard)>1&&
                            (tData.uids[tData.curPlayer] == SelfUid()))
                        {
                            if(MjClient.majiang.isEqualHunCard([ci.tag]))
                            {
                                ci.setColor(cc.color(255, 255, 255));
                                if (!hasUp) {
                                    ci.y += 20;
                                    hasUp = true;
                                }
                            }else{
                                ci.setColor(cc.color(190, 190, 190));
                            }
                        }

                        else
                        {
                            ci.setColor(cc.color(255, 255, 255));
                            SetTouchCardHandler(stand, ci);
                        }
                    }else if(MjClient.majiang.CalHunCardNum(pl.mjhand,tData.hunCard)>1&&
                        (tData.uids[tData.curPlayer] == SelfUid()))
                    {
                        if(MjClient.majiang.isEqualHunCard([ci.tag]))
                        {
                            if(pl.isTing&&i != orders.length - 1){
                                 ci.setColor(cc.color(255, 255, 255));
                            }else{
                                 ci.setColor(cc.color(255, 255, 255));
                                 if (!hasUp) {
                                    ci.y += 20;
                                    hasUp = true;
                                 }
                            }
                           
                        }else{
                            ci.setColor(cc.color(190, 190, 190));
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

    //刷新手牌大小
    if(COMMON_UI3D.is3DUI()){
        COMMON_UI3D.set3DCardSprite(off);
    }
    else {
        //刷新手牌大小
        resetCardSize();
    }
};

// 判断吃碰杠胡讴牌的状态
PlayLayer_daningshuaijin.prototype.EatVisibleCheck = function()
{
    if(MjClient.majiang != MjClient.majiang_daningshuaijin){
        return;
    }

    var eat = MjClient.playui.jsBind.eat;
    //sk 为啥要隐藏掉？   //因为一开始是不可见的，隐藏根节点 by sking
    MjClient.playui.jsBind.eat.changeui.changeuibg._node.visible = false;
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var leftCard = MjClient.majiang.getAllCardsTotal() - tData.cardNext;
    var children = getNode(0).children;
    var _downNode = getNode(0);

    MjClient.playui.HideEatChildren(eat);

    var pl = sData.players[SelfUid() + ""];
    MjClient.gangCards = [];
    MjClient.eatpos = [];
    MjClient.canTingCards = {};
    cc.log(" ====== SelfUid() ",SelfUid());
    var mj = MjClient.majiang;

    //吃碰杠胡node
    var vnode = [];
    //var pl = sData.players[SelfUid() + ""];
     if(pl.isOuCard)
         MjClient.playui._tingCardNumNode.visible=false;
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
    var tingStat=false;
    //自摸
    if(tData.tState == TableState.waitPut && pl.mjState == TableState.waitPut)
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
            //金牌大于2张不检测
            if((MjClient.majiang.CalHunCardNum(pl.mjhand,tData.hunCard)>2))
            {
                //显示讴牌

                MjClient.playui.showOuCard(eat.ou._node);
                return;
            }
            //胡
            if (pl.isNew && pl.eatFlag & 8) {
                if(pl.mustHu) pl.isZiMoHu = true;
                vnode.push(eat.hu._node);
            }

            //计算哪个些牌打出去可以听
            if (!pl.isTing){
                tingStat=MjClient.playui.deljinfunc(pl,tData);
                if(tingStat && vnode.indexOf(eat.ting._node) < 0) {
                    vnode.push(eat.ting._node);
                }
            }else{

                tingStat=MjClient.playui.deljinfunc(pl,tData);

            }

            var rtn = MjClient.majiang.canGang1(pl.mjpeng, pl.mjhand, pl.isTing, true);
            cc.log("$$$$杠牌监测"+JSON.stringify(rtn));
            if(rtn.length > 0 && pl.isNew)
            {
                MjClient.gangCards = rtn;
                pl.isCanGang = true;
                vnode.push(eat.gang0._node);
            }
            if(vnode.length > 0)
            {
                if(!pl.mustHu) vnode.push(eat.guo._node);
                if(!MjClient.majiang.isEqualHunCard(pl.newSendCard)) {
                    if (vnode.indexOf(eat.hu._node) >= 0) {
                        if (vnode.indexOf(eat.guo._node) > 0)
                            vnode.pop(eat.guo._node);
                    }
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
        // cc.log("diao pao hu-=================================================");
        if(!IsTurnToMe())
        {
            if (pl.eatFlag & 8) {
                if(pl.mustHu) pl.isZiMoHu = true;
                vnode.push(eat.hu._node);
            }
            if (pl.eatFlag & 4) {
                vnode.push(eat.gang0._node);
                pl.isCanGang = true;
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
                if(!pl.mustHu) vnode.push(eat.guo._node);


                if(vnode.indexOf(eat.hu._node)>=0)
                {
                    if(vnode.indexOf(eat.guo._node)>0)
                        vnode.pop(eat.guo._node);
                }

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

    MjClient.playui.delChiPengGangHu(vnode,tData,pl);
    if(eat.hu._node.visible)
    {
        MjClient.playui._btnPutCard.visible = false;
    }

    if (IsTurnToMe() && Object.keys(MjClient.canTingCards).length > 0)
    {
        cc.log("听牌判断------------")
        MjClient.playui.clearntingcardsign(children);
        cc.log("pl ========="+ JSON.stringify(pl));


        var tingCards = {};

        tingCards = MjClient.majiang.calTingSet(pl.mjhand, MjClient.data.sData.tData.hunCard, true);


        if (Object.keys(tingCards).length <= 7){//小于7时重置
            _downNode._tingCard_showAll = false;
        }

        var tData = MjClient.data.sData.tData;

        MjClient.playui.setCurrentTingNum(tingCards, _downNode._tingCard_showAll);


        MjClient.playui.addtingcardsign(children,MjClient.canTingCards);
    }
    if(IsTurnToMe()&&!pl.isTing&&(vnode.length==0||pl.isCanGang||tingStat))
    {
        MjClient.playui.showOuCard(eat.ou._node);
    }
    //显示，吃，碰，杠的那几张牌
    COMMON_UI.showCurrentEatCards(vnode);
}
//吃碰杠胡过讴牌处理
PlayLayer_daningshuaijin.prototype.delChiPengGangHu=function(vnode,tData,pl){

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
            var tmpcard1=vnode[i].getChildByName("card1");
            var tmpbgground=vnode[i].getChildByName("bgground");
            var tmpbgimg=vnode[i].getChildByName("bgimg");

            if(tmpcard1)
            {
                tmpcard1.visible = false;
            }

            if(tmpbgground)
            {
                tmpbgground.visible = false;
            }

            if(tmpbgimg)
            {
                tmpbgimg.visible = true;
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
                if(tmpbgimg)
                {
                    tmpbgimg.visible = false;
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
            setWgtLayout(vnode[i], [0, 0.16], [0.5, 0], [(1 - vnode.length) / 1.8 + i * 1.4, 1.8], false, false);
        }
    }
}
PlayLayer_daningshuaijin.prototype.deljinfunc=function(pl,tData){
    MjClient.canTingCards={};
    var tingStat = false;
    var needErgodic = true; // 是否需要遍历数组
    var onlyDelJinCards = false; // 仅需要删除金牌
    var jinCount=MjClient.majiang.CalHunCardNum(pl.mjhand,tData.hunCard);
    if (jinCount>1) {
        // 手上有金牌的，看去掉金牌是否还能听
        var cardsAfterPut = pl.mjhand.slice(0);
        cardsAfterPut.splice(cardsAfterPut.indexOf(tData.hunCard),1);
        // 如果删除金牌，剩下的牌不能听，则不可以听
        needErgodic = MjClient.majiang.canHu(cardsAfterPut,200, MjClient.data.sData.tData.hunCard, true);
    }

    if (needErgodic) {
        if (jinCount > 1) {
            MjClient.canTingCards[tData.hunCard] = 1;
            tingStat = true;
        } else {
            for (var i = 0; i < pl.mjhand.length; i++) {
                var cardsAfterPut = pl.mjhand.slice(0);
                cardsAfterPut.splice(i, 1); //依次去掉某张牌看能不能听
                if (MjClient.majiang.canHu(cardsAfterPut, 200, MjClient.data.sData.tData.hunCard, true)) {
                    MjClient.canTingCards[pl.mjhand[i]] = 1;
                    tingStat = true;
                }
            }
        }

    }
    return tingStat;
}
/*
 玩家ui，信息
 */
PlayLayer_daningshuaijin.prototype.Node_player = function(off)
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
            if(getUIPlayer(off) && getUIPlayer(off).info.uid == msg.uid){
                _tuoguan.visible = true;
            }
        });

        UIEventBind(null, _tuoguan, "cancelTrust", function (msg) {
            if(getUIPlayer(off)&&getUIPlayer(off).info.uid == msg.uid){
                this.visible = false;
            }
        });
    }

    //摔金标记
    var _shuaiTag = _head.getChildByName("shuaiTag");
    if (_shuaiTag)
    {
        _shuaiTag.visible = false;
        UIEventBind(null, _shuaiTag, "MJPut", function (msg){
            if(getUIPlayer(off)&&getUIPlayer(off).info.uid == msg.uid&&MjClient.majiang.isEqualHunCard(msg.card)){
                var pl = getUIPlayer(off);
                _shuaiTag.visible = true;
                if (msg.rate > 0){
                    if(pl){pl.rate = msg.rate;}
                    _shuaiTag.getChildByName("num_text").setString("x" + msg.rate);
                }else{
                    _shuaiTag.visible = false;
                }
            }
        });

        UIEventBind(null, _shuaiTag, "initSceneData", function (msg){
            var pl = getUIPlayer(off);
            if (pl && pl.rate > 0 && pl.mjState != TableState.isReady && pl.mjState != TableState.roundFinish) {
                _shuaiTag.visible = true;
                _shuaiTag.getChildByName("num_text").setString("x" + pl.rate);
            }else{
                _shuaiTag.visible = false;
            }
        });

        UIEventBind(null, _shuaiTag, "roundEnd", function (msg){
            _shuaiTag.visible = false;
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
            if(MjClient.data._tempMessage)
            {
                MjClient.data._tempMessage.msg = voicePath;
                showUserChat(_chattext, off, MjClient.data._tempMessage);
            }
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
    var _ouIcon=_node.getChildByName("ouIcon");
    cc.log("node_player------------------------"+JSON.stringify(_ouIcon));
    if(_ouIcon)
    {
        _ouIcon.visible=false;
    }

    var _outBig = _node.getChildByName("outBig");
    if(_outBig)  _outBig.visible = false;

    var _tingCardsNode = _node.getChildByName("tingCardsNode");
    if(_tingCardsNode)  _tingCardsNode.visible = false;

    var _tingCardNumNode = _node.getChildByName("tingCardNumNode");
    // if(_tingCardNumNode) _tingCardNumNode.visible = false;

    var self = this;
    /********************************************事件处理*********************************************/

    UIEventBind(null, _node, "clearCardUI", function (eD) {
        clearCardUI(_node, off);
        _tingCard.visible = false;
        if(_huaCount) _huaCount.setString("花 x 0");
        if(_skipHuIconTag) _skipHuIconTag.visible = false;
        if(_skipPengIconTag) _skipPengIconTag.visible = false;
        if(_tingCardsNode) _tingCardsNode.visible = false;
        if(_tingCardNumNode) _tingCardNumNode.visible = false;
        if(_ouIcon)  _ouIcon.visible=false;
    });

    UIEventBind(null, _node, "initSceneData", function (eD) {
        if(MjClient.majiang != MjClient.majiang_daningshuaijin){
            return;
        }

        SetUserVisible_daningshuaijin(_node, off);
        if (IsArrowVisible()) showUserZhuangLogo(_zhuang, off);
        MjClient.playui.tingAndOuIconVisible(_tingIcon,off);

        MjClient.playui.tingAndOuIconVisible(_ouIcon,off,true);
        showAndHideHeadEffect();
        var pl = getUIPlayer(off);
        cc.log("daningshuaijin______________initScenedata+"+JSON.stringify(pl));
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
        if(off == 0 && pl.mjState != TableState.isReady && pl.mjState != TableState.roundFinish){
            var tingCards = {};

            tingCards = MjClient.majiang.calTingSet(pl.mjhand, MjClient.data.sData.tData.hunCard, true);
            if (Object.keys(tingCards).length <= 7){//小于7时重置
                self._tingCard_showAll = false;
            }

            var tData = MjClient.data.sData.tData;
            if (pl.isTing) {
                MjClient.playui.setCurrentTingNum(tingCards, self._tingCard_showAll);
            }
        }
        if(_tingCardsNode)  _tingCardsNode.visible = false;
        var tmp={};
        if(pl&&pl.mjState != TableState.isReady && pl.mjState != TableState.roundFinish){
            tmp.uid=pl.info.uid;
            tmp.isOuCard=pl.isOuCard;
            MjClient.playui.showOuState(_ouIcon,off,tmp);
        }

    });
    UIEventBind(null, _node, "addPlayer", function (eD) {
        SetUserVisible_daningshuaijin(_node, off);
        showFangzhuTagIcon(_head,off);
        if(_huaCount) MjClient.playui.setPlayerHuaValueShow(_huaCount.getParent());
        GetReadyVisible(_ready, off);

    });
    UIEventBind(null, _node, "removePlayer", function (eD) {
        SetUserVisible_daningshuaijin(_node, off);
        showFangzhuTagIcon(_head,off);
        GetReadyVisible(_ready, off);
        if(_huaCount)  MjClient.playui.setPlayerHuaValueShow(_huaCount.getParent());
    });
    UIEventBind(null, _node, "mjhand", function (eD) {
        var sData = MjClient.data.sData;
        var pl = sData.players[eD.uid + ""];
        InitUserHandUI_daningshuaijin(_node, off);

    });
    UIEventBind(null, _node, "roundEnd", function (eD) {
        InitUserCoinAndName_jinzhong(_node, off);
        _tingIcon.visible = false;
        _ouIcon.visible=false;
        showAndHideHeadEffect();
        MjClient.playui.clearOuState(_ouIcon,off,eD);
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
          //  MjClient.playui.HideOubtn();
        }
    });
    UIEventBind(null,_node,"MJOuCard",function (eD) {

        MjClient.playui.showOuState(_ouIcon,off,eD);


    });
    UIEventBind(null, _node, "MJPut", function (eD) {

        var pl = getUIPlayer(off);
        var _tingCards = _node.getChildByName("tingCardsNode");
        if (_tingCards) {
            _tingCards.setVisible(false);
        }

        if(pl && pl.info.uid == eD.uid && MjClient.majiang.isEqualHunCard(eD.card) ){
            if(eD.tingAfterPut == true)
            {
                MjClient.playui.runAction( cc.sequence(cc.delayTime(2),
                    cc.callFunc(function() {
                        ShowEatActionAnim(_node,ActionType.SHUAIJIN,off)
                    })
                ))
            }
                else
            {
                ShowEatActionAnim(_node,ActionType.SHUAIJIN,off)
            }

        }

        DealMJPut_daningshuaijin(_node,eD,off);
        hideTingBtn();
        MjClient.playui.HideOubtn();
        //if(_tingCardNumNode) _tingCardNumNode.visible = false;
        setUserOffline(_node, off);
        showAndHideHeadEffect();
        var putflag=true;
        //听牌提示
        if(off == 0){
            var tingCards = {};

            tingCards = MjClient.majiang.calTingSet(pl.mjhand, MjClient.data.sData.tData.hunCard, true);
            if (Object.keys(tingCards).length <= 7){//小于7时重置
                self._tingCard_showAll = false;
            }

            // var tData = MjClient.data.sData.tData;
            //
            if(pl.isTing)
             MjClient.playui.setCurrentTingNum(tingCards, self._tingCard_showAll);

        }
        var sData = MjClient.data.sData;
        var tmppl = sData.players[SelfUid() + ""];
        if(tmppl.isOuCard)
            MjClient.playui._tingCardNumNode.visible=false;
    });

    UIEventBind(null, _node, "MJChi", function (eD) {
        DealMJChi(_node, eD, off);
        setUserOffline(_node, off);
    });

    UIEventBind(null, _node, "MJGang", function (eD) {
        DealMJGang(_node, eD, off);
        hideTingBtn();
        if(_skipPengIconTag) _skipPengIconTag.visible = false;
        setUserOffline(_node, off);
        MjClient.playui.calTingByShuaijin(off);
    });

    UIEventBind(null, _node, "MJPeng", function (eD) {
        COMMON_UI.clearShowCurrentEatCards();
        DealMJPeng(_node, eD, off);
        setUserOffline(_node, off);
        MjClient.playui.EatVisibleCheck();
        showAndHideHeadEffect();
    });

    UIEventBind(null, _node, "MJHu", function (eD) {
        HandleMJHu(_node, eD, off);
        _tingCard.visible = false;
        if(_skipHuIconTag) _skipHuIconTag.visible = false;
        if(_tingCardsNode) _tingCardsNode.visible = false;
        // if(_tingCardNumNode) _tingCardNumNode.visible = false;
        setUserOffline(_node, off);
    });

    UIEventBind(null, _node, "onlinePlayer", function (eD) {

        setUserOffline(_node, off);
        GetReadyVisible(_ready, off);
    });

    UIEventBind(null, _node, "playerStatusChange", function (eD) {
        setUserOffline(_node, off);
    });

    UIEventBind(null, _node, "MJFlower", function (eD) {
        HandleMJFlower(_node, eD, off);
    });

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
        if(off != 0) DealWaitPut(this, eD, off); //其他家发牌
        showAndHideHeadEffect();
    });


    UIEventBind(null, _head, "loadWxHead", function (d) {
        setWxHead(_head, d, off);
    });

    UIEventBind(null, _tingIcon, "moveHead", function (d) {

        MjClient.playui.tingAndOuIconVisible(_tingIcon, off);
        MjClient.playui.tingAndOuIconVisible(_ouIcon,off,true);
        GetReadyVisible(_ready, -1);
    });


    /********************************************设置位置*********************************************/
    switch (off)
    {
        case 0:
            setWgtLayout(_play_tips,[0.08, 0.14], [0.5, 0.25], [0, 0.5]);
            setWgtLayout(_ready,[0.07, 0.07], [0.5, 0.5], [0, -1.5]);
            setWgtLayout(_stand,[0.057, 0], [0.5, 0], [8, 0.68]);
            setWgtLayout(_ouIcon,[0.2, 0], [0.5, 0], [0, 0.8]);
            setWgtLayout(_up,[0.05, 0], [0, 0], [0.8, 0.7]);
            //setWgtLayout(_stand,[0.057, 0], [0.5, 0], [8, 0.6]);
            //setWgtLayout(_up,[0.05, 0], [0, 0], [1.8, 0.6]);
            setWgtLayout(_down,[0.05, 0], [0, 0], [3.5, 1]);
            // setWgtLayout(_out0, [0.0, 0.063], [0.53, 0], [-7, 6.1]);
            // setWgtLayout(_out1, [0.0, 0.0.063], [0.53, 0], [-7, 4.9]);
            // if(_out2) setWgtLayout(_out2, [0.0, 0.063], [0.53, 0], [-7, 3.7]);
            setWgtLayout(_out0, [0.0, 0.08], [0.55, -0.08], [-7, 6.1]);
            setWgtLayout(_out1, [0.0, 0.08], [0.55, -0.06], [-7, 4.9]);
            if(_out2) setWgtLayout(_out2, [0.0, 0.08], [0.55, -0.04], [-7, 3.7]);
            if(_outBig) setWgtLayout(_outBig, [0.0836, 0], [0.5, 0.32], [0, 0]);
            if (MjClient.MaxPlayerNum == 2)
            {
                _out0.x -= _out0.height * _out0.scale * 5;
                _out1.x -= _out1.height * _out1.scale * 5;
                if(_out2) _out2.x -= _out2.height * _out2.scale * 5;
            }

            if(_tingCardsNode) setWgtLayout(_tingCardsNode, [0.25, 0.12], [0.2, 0.25], [0, -0.3]);
            if(_tingCardNumNode) setWgtLayout(_tingCardNumNode, [0.25, 0.12], [0.12, 0.22], [0,-0.2]);
            break;
        case 1:
            setWgtLayout(_play_tips,[0.08, 0.14], [0.75, 0.5], [0, 0.5]);
            setWgtLayout(_ready,[0.07, 0.07], [0.5, 0.5], [2, 0]);
            setWgtLayout(_stand,[0, 0.08],[1, 1], [-5.5, -2.3]);
            setWgtLayout(_ouIcon,[0, 0.08],[1, 0.6], [-1, 0]);
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
            setWgtLayout(_stand,[0, 0.07],[0.5, 1], [-6, -1.0]);
            setWgtLayout(_ouIcon,[0, 0.07],[0.5, 1], [0, -1.5]);
            setWgtLayout(_up,[0, 0.07], [0.5, 1], [6, -1.0]);
            setWgtLayout(_down,[0, 0.07], [0.5, 1], [6, -0.7]);
            // setWgtLayout(_out0, [0, 0.063], [0.5, 1], [6.8, -4.9]);
            // setWgtLayout(_out1, [0, 0.063], [0.5, 1], [6.8, -3.7]);
            // if(_out2) setWgtLayout(_out2, [0, 0.063], [0.5, 1], [6.8, -2.5]);
            setWgtLayout(_out0, [0, 0.08], [0.55, 1], [4.1, -4.1]);
            setWgtLayout(_out1, [0, 0.08], [0.55, 1], [4.1, -3.2]);
            if(_out2) setWgtLayout(_out2, [0, 0.08], [0.55, 1], [4.1, -2.3]);
            if(_outBig) setWgtLayout(_outBig, [0.0836, 0], [0.5, 0.75], [0, 0]);
            if (MjClient.MaxPlayerNum == 2)
            {
                _out0.x += _out0.height * _out0.scale * 5.5;
                _out1.x += _out1.height * _out1.scale * 5.5;
                if(_out2) _out2.x += _out2.height * _out2.scale * 5.5;
            }
            break;
        case 3:
            setWgtLayout(_play_tips,[0.08, 0.14], [0.25, 0.5], [0, 0.5]);
            setWgtLayout(_ready,[0.07, 0.07], [0.5, 0.5], [-2, 0]);
            setWgtLayout(_stand,[0, 0.08], [0, 0.6], [5.2, 3]);
            setWgtLayout(_ouIcon,[0, 0.08], [0, 0.6], [1, 0]);
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
}

PlayLayer_daningshuaijin.prototype.setCurrentTingNum = function(tingSet ,showall, cardTag)
{
    var carNumNode = MjClient.playui._tingCardNumNode;
    //如果没有可听的牌
    cc.log("=========tingSet======== " + JSON.stringify(tingSet));
    var bHaveValue = false;

    carNumNode.zIndex = 500;
    carNumNode.setAnchorPoint(0,0);
    carNumNode.setContentSize(272, 80 * 0.8);
    //位置被改变了，需要还原位置
    if(setTingCardPosX == null)
    {
        setTingCardPosX = carNumNode.getPositionX();
    }else{
        carNumNode.setPositionX(setTingCardPosX);
    }

    carNumNode.visible = true;
    var cardTextNode = carNumNode.getChildByName("showNode");
    cardTextNode.visible = false;

    var BindingNode = carNumNode.getChildByName("Node_card");
    BindingNode.removeAllChildren(true);
    var i=0;
    var j=0;//高的idx
    var width = 86 * 0.8;
    var hight = 80 * 0.8;

    var showBtn = carNumNode.getChildByName("show_btn");
    showBtn.setPositionX(cardTextNode.getPositionX() + width*7*1 + 15);

    if(cardTag){
        showBtn.cardTag = cardTag;
    }else{
        showBtn.cardTag = null;
    }
    // showBtn.setPositionY(cardTextNode.getPositionY() + width*8*1);

    var tingSetKeys = Object.keys(tingSet);

    if(tingSetKeys.length > 7){
        showBtn.visible = true;
    }else{
        showBtn.visible = false;
    }

    if(showall == true){
        showBtn.loadTextureNormal("png/show_down.png");
    }else{
        showBtn.loadTextureNormal("png/show_up.png");
    }

    for (var cd in tingSet)
    {
        var cardNode = cardTextNode.clone();
        cardNode.setScale(0.8);
        cardNode.visible = true;
        bHaveValue = true;
        if(i >= 7)
        {
            if(showall == true){
                i = 0;
                j++;
            }else{
                break;
            }
        }
        cardNode.setPositionX(cardTextNode.getPositionX() + width*i*1);//cardTextNode.getContentSize().width*0.5);

        cardNode.setPositionY(cardTextNode.getPositionY() + hight*j*1);//cardTextNode.getContentSize().width*0.5);
        BindingNode.addChild(cardNode);
        var countNode = cardNode.getChildByName("cardCount");
        var icount = getHuCardNum(parseInt(cd));
        countNode.setString(icount + "");
        var off = 0;
        if (MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP|| MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ)
            off = 6;
        setCardSprite(cardNode.getChildByName("cardNode"), parseInt(cd), off);
        i++;
    }
    //如果对象中没有值
    if(!bHaveValue)
    {
       carNumNode.visible = false;
    }

    //设置背景的长度
    if(j > 0) i = 7;
    var tingCardsWidth = (i + 1)*width + 20;
    var tingCardHigh   = carNumNode.getContentSize().height + j*hight;
    carNumNode.setContentSize(tingCardsWidth, tingCardHigh);

    //carNumNode.setPositionX(carNumNode.getPositionX() - (i - 1)*width/2 - 50);
    var nodeWidth = tingCardsWidth - 30;
    if (showBtn) {
        nodeWidth = tingCardsWidth + showBtn.getContentSize().width - 30;
    }
    // node.setContentSize(nodeWidth, height);

    var pl = getUIPlayer(0);
    var _gameName = carNumNode.getChildByName("gamePlayTip");
    if (_gameName) {
        _gameName.removeFromParent();
        _gameName = null;
    }
    if (pl.isTing) {
        _gameName = new cc.LabelTTF("听牌自动摸打...",MjClient.fzcyfont,25);
        _gameName.setFontSize(_gameName.getFontSize());
        _gameName.setName("gamePlayTip");
        _gameName.setColor(cc.color(255,220,74));
        _gameName.setAnchorPoint(0,0.5);
        _gameName.setPosition(nodeWidth, 25);
        carNumNode.addChild(_gameName);
    }

    if (bHaveValue && (MjClient.gameType == MjClient.GAME_TYPE.HUAI_AN_ERZ ||
        MjClient.gameType == MjClient.GAME_TYPE.HUAI_AN_CC ||
        MjClient.gameType == MjClient.GAME_TYPE.HZ_TUI_DAO_HU))
    {
        if (MjClient.clickTing)
            carNumNode.getChildByName("icon").loadTexture("playing/gameTable/icon_jiating.png");
        else
            carNumNode.getChildByName("icon").loadTexture("playing/gameTable/icon_ting.png");
    }
}

PlayLayer_daningshuaijin.prototype.showQuanTingPai = function(quanting)
{
    if(!MjClient.playui._AniNode.getChildByName("quanTingPaiIcon"))
    {
        var _quantingpai = new ccui.ImageView("playing/other/quanting.png");
        _quantingpai.setName("quanTingPaiIcon");
        setWgtLayout(_quantingpai,[0.28, 0.28], [0.14, 0.3], [0,0]);
        _quantingpai.setPosition(MjClient.playui._tingCardNumNode.getPositionX()*2,MjClient.playui._tingCardNumNode.getPositionY()*1.2);
        MjClient.playui._AniNode.addChild(_quantingpai);
    }

    if (quanting){
        MjClient.playui._AniNode.getChildByName("quanTingPaiIcon").visible = true;
    }else{
        MjClient.playui._AniNode.getChildByName("quanTingPaiIcon").visible = false;
    }
}

PlayLayer_daningshuaijin.prototype.addtingcardsign = function(children,tingCard)
{
    for (var i = 0; i < children.length; i++) {
        if (children[i].name == "mjhand")
        {
            if (Object.keys(tingCard).length > 0)
            {
                if (children[i].tag in tingCard)
                {
                    if(!children[i].getChildByName("tingSign"))
                    {
                    var tingSign = new ccui.ImageView();
                    tingSign.loadTexture("playing/other/tingcard.png");
                    tingSign.setName("tingSign");
                    //tingSign.setScale(0);
                    tingSign.setPosition(children[i].getContentSize().width/2,children[i].getContentSize().height+20);
                    children[i].addChild(tingSign,20);
                     }
                     else
                    {
                        children[i].getChildByName("tingSign").setVisible(true);
                    }

                }
            }
        }
    }
}
PlayLayer_daningshuaijin.prototype.clearntingcardsign = function(children)
{
    for (var i = 0; i < children.length; i++) {
        if (children[i].name == "mjhand")
        {
            var sign = children[i].getChildByName("tingSign");
            if (sign)
            {
                // sign.removeFromParent();
                sign.setVisible(false);
            }
        }
    }
}

PlayLayer_daningshuaijin.prototype.calTingByShuaijin = function(off) {
    if (off != 0) { return; }
    var pl = getUIPlayer(off);
    var tingCards = MjClient.majiang.calTingSet(pl.mjhand,MjClient.data.sData.tData.hunCard, true);
    MjClient.playui.setCurrentTingNum(tingCards);
    cc.log("xiangningshuajin---------caltingbyshuaijin");
}
/*
* 设置eat的子节点的可视化。
*
*
*
* */
PlayLayer_daningshuaijin.prototype.HideEatChildren=function (eat) {

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
    eat.ou._node.visible=false;
    eat.ting._node.visible = false;
    eat.noTing._node.visible = false;
}
PlayLayer_daningshuaijin.prototype.addPengUI=function (node,pl,tData,off) {
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
}
//添加杠ui
PlayLayer_daningshuaijin.prototype.addGangUI=function (node,pl,tData,off) {
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
}
PlayLayer_daningshuaijin.prototype.addAnGangUI=function (node,pl,tData,off) {
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

}
PlayLayer_daningshuaijin.prototype.addChiUI=function (node,pl,tData,off) {
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

}
PlayLayer_daningshuaijin.prototype.addOutCardUI=function (node,pl,tData,off) {
    for(var i = 0; i < pl.mjput.length; i++)
    {
        var msg =
            {
                card: pl.mjput[i],
                uid: pl.info.uid
            };

        DealMJPut_daningshuaijin(node, msg, off, i);
    }
}
PlayLayer_daningshuaijin.prototype.addHandCardUI=function (node,pl,tData,off) {
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

}
PlayLayer_daningshuaijin.prototype.addFlowerCardUI=function (node,pl,tData,off) {
    if (pl.mjflower.length > 0)
    {
        MjClient.majiang.setFlowerImg(node, pl);
        ShowEatActionAnim(node,ActionType.FLOWER,off);
        playEffectInPlay("flower");
    }
}
PlayLayer_daningshuaijin.prototype.showOuCard=function (vnode) {
    if(MjClient.rePlayVideo == -1)
    {
        vnode.loadTextureNormal("playing/gameTable/youxizhong-2_52.png");
        // vnode.loadTexturePressed("playing/gameTable/youxizhong-2_02.png");
        setWgtLayout(vnode,[0.2, 0.2], [0.5, 0.5], [-2.2, -0.9]);
        var tData = MjClient.data.sData.tData;
        if(tData.areaSelectMode.oupai)
        {
            vnode.visible=true;
        }
        else {
            vnode.visible=false;
        }
    }

};

/*
    显示偶牌手牌的状态 by sking 2018 9.12
 */
PlayLayer_daningshuaijin.prototype.setOuCard = function(off)
{
    var pl = getUIPlayer(off);
    var _UINode = getNode(off);
    var children = _UINode.children;
    var tmp=_UINode.getChildByName("stand");
    var cpnode = _UINode.getChildByName("down");

    if(pl && pl.isOuCard)
    {
        for (var i = 0; i < children.length; i++) {
            var ci = children[i];
            cc.log("showOutState+mjname---------------------" + ci.name);
            ci.setColor(cc.color(190, 190, 190));
            if (off == 0) {
                if (ci.name == "mjhand") {
                    var MJType = getCurrentMJBgType();
                    var arr = [1.05, 1.36, 1.35, 2.25];
                    var sca = COMMON_UI3D.is3DUI() ? 1.32 : arr[MJType];
                    ci.removeAllChildren();
                    ci.loadTexture(cpnode.getRenderFile().file);
                    ci.setPositionY(tmp.getPositionY());
                    ci.name = "mjou";
                    ci.ignoreContentAdaptWithSize(true);
                    ci.setScale(tmp.getScale() * sca);
                }
            } else if (off == 2) {
                if (ci.name == "standPri") {
                    cc.log("showOutState+mjhand---------------------" + off);
                    ci.removeAllChildren();
                    ci.loadTexture(cpnode.getRenderFile().file);
                    ci.setPositionY(tmp.getPositionY());
                    ci.name = "mjou";
                }
            } else {
                if (ci.name == "standPri") {
                    cc.log("showOutState+mjhand---------------------" + off);
                    ci.removeAllChildren();
                    if (COMMON_UI3D.is3DUI()) {

                        if (off == 1) {
                            ci.setFlippedY(true);
                            ci.loadTexture("playing/MJ3D/common/2-8.png");
                        }
                        else if (off == 3) {
                            ci.loadTexture("playing/MJ3D/common/2-1.png");
                        }
                    }
                    else {
                        ci.loadTexture(getNewMJBgFile(cpnode.getRenderFile().file));
                        ci.setRotation(0);
                        ci.setSize(cpnode.getContentSize());
                        ci.setPositionX(tmp.getPositionX());
                    }
                    ci.name = "mjou";
                }
            }
        }
    }
}


PlayLayer_daningshuaijin.prototype.showOuState=function (vnode,off,eD) {

    vnode.loadTexture("playing/gameTable/icon_ou.png");
    vnode.setLocalZOrder(700);
    var pl = getUIPlayer(off);
    if(MjClient.rePlayVideo == -1)
    {
        if (pl && eD.uid == getUIPlayer(off).info.uid&&eD.isOuCard)
        {
            vnode.visible = true;
            pl.isOuCard=true;
            MjClient.playui.setOuCard(off);
        }
    }else{
        if (pl && eD.uid == getUIPlayer(off).info.uid&&eD.isOuCard)
        {
            vnode.visible = true;
        }
    }


}
PlayLayer_daningshuaijin.prototype.HideOubtn=function(){
    MjClient.playui.jsBind.eat.ou._node.visible = false;
}
PlayLayer_daningshuaijin.prototype.clearOuState=function (vnode,off) {
    var _UINode = getNode(off);
    var children = _UINode.children;
    var tmp=_UINode.getChildByName("stand");

    var cpnode = _UINode.getChildByName("down");

    for(var i = 0; i < children.length; i++)
    {
        var ci = children[i];
        cc.log("showOutState+mjname---------------------"+ci.name);
        ci.setColor(cc.color(255, 255, 255));

    }
}
