/**
 * Created by wangyang on 2018/8/29.
 */
var actionZindex = 1000;
MjClient.QueMenCounts = 0;//统计缺门剩余牌张
var _isAniShow_xuezhanMJ = false; //为了控制mjhand之后播骰子动画时newCard的状态显示
//向服务器发送 过消息
MjClient.MJPass2NetForxuezhanMJ = function () {
    // cc.log(">>>>>>>>>普通  过 <<<<<<<<");
    cc.log("====================send======pass=====");
    var sData = MjClient.data.sData;
    var tData = sData.tData;

    if (IsTurnToMe() && tData.tState == TableState.waitPut) {
        var eat = MjClient.playui.jsBind.eat;
        var msg = "确认过";
        if (eat.gang0._node.visible) {
            msg += " 杠 ";
        }

        if (eat.hu._node.visible) {
            msg += " 胡 ";
        }
        msg = msg + "吗?"
        MjClient.showMsg(msg, function () {
            //cc.log("==========1=============");
            eat.gang0._node.visible = false;
            eat.hu._node.visible = false;
            eat.guo._node.visible = false;
            eat.ting._node.visible = false;
            eat.cancel._node.visible = false;
            MJPassConfirmToServer();
        }, function () { }, "1");
    }
    else {
        if (MjClient.playui.jsBind.eat.hu._node.visible) {
            MjClient.showMsg("确认不胡吗?", MJPassConfirmToServer, function () { }, "1");
        }
        else {
            MJPassConfirmToServer();
        }
    }
}


//处理出牌,放一张牌，打牌动作
function DealMJPut_YNXueZhan(node, msg, off, outNum) {
    DealMJPut_haian(node, msg, off, outNum);
}


function showShaiziAni_YNXueZhan(poff) {
    if (poff == 0) {
        //摇骰子的时候全部隐藏
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


        if (MjClient.rePlayVideo != -1)//回放
        {
            for (var off = 0; off < 4; off++) {
                var _node = getNode(off);
                var children = _node.children;
                for (var i = 0; i < children.length; i++) {
                    var ni = children[i];
                    if (ni.name == "mjhand") {
                        ni.removeFromParent(true);
                    }
                }
                InitUserHandUI_YNXueZhan(_node, off);
            }
            playEffect("shuffle");
            MjClient.playui.EatVisibleCheck();
            return;
        }


        var _AniNode = MjClient.playui._AniNode;
        var tData = MjClient.data.sData.tData;
        var shaiziArray = tData.shaizi;
        cc.log("tData.shaizi           ", tData.shaizi);
        var soundID = null;
        cc.log("shaiziArray = " + shaiziArray);
        _isAniShow_xuezhanMJ = true;
        cc.spriteFrameCache.addSpriteFrames("playing/other/shaizi.plist", "playing/other/shaizi.png");
        var firstFrame = new cc.Sprite("#shaizi_1.png");
        var frames = [];
        var prefix = "shaizi_";
        var fc = cc.spriteFrameCache;
        for (var i = 1; i <= 9; i++) {
            var name = prefix + i + ".png";
            cc.log("----------name = " + name);
            var f = fc.getSpriteFrame(name);
            if (f) {
                frames.push(f);
            }
        }
        var animate = cc.animate(new cc.Animation(frames, 0.1, 2));
        var playSoundFunc = cc.callFunc(function () {

            for (var off = 0; off < 4; off++) {
                var _node = getNode(off);
                var children = _node.children;
                for (var i = 0; i < children.length; i++) {
                    var ni = children[i];
                    if (ni.name == "mjhand") {
                        ni.removeFromParent(true);
                    }
                    if (ni.name == "stand") {
                        cc.log("=====================stand false");
                        ni.visible = false;
                    }
                }
            }

            //todo...如果需要播骰子声音在这里
            soundID = playEffect("shaizi", true);
        });
        firstFrame.setPosition(cc.p(MjClient.size.width / 2, MjClient.size.height / 2));
        firstFrame.setScale(MjClient.size.height / 800);

        var showPonitFunc = cc.callFunc(function () {
            var _shai1 = new ccui.ImageView("playing/other/shaizi/" + (shaiziArray[0] + 1) + ".png");
            var _shai2 = new ccui.ImageView("playing/other/shaizi/" + (shaiziArray[1] + 1) + ".png");
            _shai1.setPosition(cc.p((MjClient.size.width / 2) * 0.95, MjClient.size.height / 2));
            _shai1.setName("shaizi");
            _shai2.setName("shaizi");
            _shai1.setScale(MjClient.size.height / 800);
            _shai2.setScale(MjClient.size.height / 800);
            _AniNode.addChild(_shai1, 10000);
            _shai2.setPosition(cc.p((MjClient.size.width / 2) * 1.05 + 30, MjClient.size.height / 2));
            _AniNode.addChild(_shai2, 10000);
            firstFrame.visible = false;
            stopEffect(soundID);
        });



        firstFrame.runAction(cc.sequence(playSoundFunc, animate, showPonitFunc, cc.delayTime(0.8), cc.callFunc(function () {
            //发牌
            _isAniShow_xuezhanMJ = false;
            var _Anichildren = _AniNode.children;
            for (var i = 0; i < _Anichildren.length; i++) {
                var _c = _Anichildren[i];
                if (_c.name == "shaizi") {
                    _c.removeFromParent(true);
                }
            }
            for (var off = 0; off < 4; off++) {

                var _node = getNode(off);
                var children = _node.children;
                for (var i = 0; i < children.length; i++) {
                    var ni = children[i];
                    if (ni.name == "mjhand") {
                        ni.removeFromParent(true);
                    }
                }
                InitUserHandUI_YNXueZhan(_node, off);
            }
            playEffect("shuffle");
            MjClient.playui.EatVisibleCheck();
        }), cc.removeSelf()));
        firstFrame.setName("shaiziAni");
        _AniNode.addChild(firstFrame, 10000);
    }
}

function updateHeadUI_YNXueZhan(node, off, actionType) {
    cc.log('updateHeadUI_YNXueZhan', off)
    var pl = getUIPlayer(off);
    if (!pl) return;
    // showHandCard_MLHZ(node, off);
    showHandCard_YNXueZhan(node, off);
    MjClient.playui.CardLayoutRestore(node, off);
    cc.log('updateHeadUI_YNXueZhan update success', off)

    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var selfIndex = getPlayerIndex(off);
    if (tData.curPlayer == selfIndex) {
        ShowEatActionAnim(node, actionType, off);
    }
}


// 这个没看懂干嘛的
// off 是四个位置，根据off 显示四个位置的信息 by sking
function SetUserVisible_YNXueZhan(node, off) {
    /*摇色子，断网重连手牌异常bug*/
    cc.log("====================off==================1====" + off);
    var _AniNode = MjClient.playui._AniNode;
    var shaiziNode = _AniNode.getChildByName("shaiziAni");
    if (!shaiziNode) {
        _isAniShow_xuezhanMJ = false;
    }

    cc.log("====================off==============2========" + off);
    if (_isAniShow_xuezhanMJ)  // 解决摇骰子时断线重连调用本函数，会手牌重复的bug by cyc
        return;

    cc.log("====================off===========3===========" + off);
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


    if (pl) {
        cc.log("====================off============4==========" + JSON.stringify(pl));
        cc.log("====================off======================" + off);
        head.visible = true;
        name.visible = true;
        coin.visible = true;
        offline.visible = true;
        name_bg.visible = true;
        score_bg.visible = true;
        MjClient.loadWxHead(pl.info.uid, pl.info.headimgurl);
        setUserOffline(node, off);
        InitUserHandUI_YNXueZhan(node, off);
        //GLog("pl.info.uid = "+pl.info.uid);
    }
    else {
        cc.log("====================off=============5=========" + off);
        //head.visible = false;
        name.visible = false;
        coin.visible = false;
        offline.visible = false;
        coin.visible = false;
        var WxHead = nobody.getChildByName("WxHead");
        if (WxHead) {
            WxHead.removeFromParent(true);
        }
    }
}

function showHandCard_YNXueZhan(node, off) {
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var pl = getUIPlayer(off);
    if (!pl) {
        return;
    }

    var children = node.children;
    for (var i = 0; i < children.length; i++) {
        var child = children[i];
        var name = child.name;
        if (name == "peng"
            || name == "chi"
            || name == "gang0"
            || name == "gang1"
            || name == "mjhand"
            || name == "mjhand_replay"
            || name == "standPri") {
            if (cc.sys.isObjectValid(child)) child.removeFromParent(true);
        }

    }


    //添加碰
    if (pl.mjpeng) {
        for (var i = 0; i < pl.mjpeng.length; i++) {
            var idx = tData.uids.indexOf(pl.info.uid);
            var offIdx = (pl.pengchigang.peng[i].pos - idx + 4) % 4 - 1;//表示被碰的人和pl之间隔着几个人，如果是pl碰下家，则offIdx=0，pl碰上家，则offIdex=2
            var cdui = null;
            for (var j = 0; j < 3; j++) {
                if ((j % 3 == 2 - offIdx && off % 3 == 0) || (j % 3 == offIdx && off % 3 != 0)) {
                    var cdui = getNewCard(node, "up", "peng", pl.mjpeng[i], off, "heng", "heng");
                    setCardArrow(cdui, offIdx, off);
                }
                else {
                    cdui = getNewCard(node, "up", "peng", pl.mjpeng[i], off);
                }

                if (j == 2) {
                    cdui.ispeng3 = true;
                }
            }
        }
    }


    //添加明杠
    if (pl.mjgang0) {
        for (var i = 0; i < pl.mjgang0.length; i++) {
            var idx = tData.uids.indexOf(pl.info.uid);
            var offIdx = null;
            for (var j = 0; j < pl.pengchigang.gang.length; j++) {
                if (pl.pengchigang.gang[j].card == pl.mjgang0[i]) {
                    offIdx = (pl.pengchigang.gang[j].pos - idx + 4) % 4 - 1;
                    break;
                }
            }
            if (offIdx == null) {
                for (var j = 0; j < pl.pengchigang.pgang.length; j++) {
                    if (pl.pengchigang.pgang[j].card == pl.mjgang0[i]) {
                        offIdx = (pl.pengchigang.pgang[j].pos - idx + 4) % 4 - 1;
                        break;
                    }
                }
            }
            if (offIdx == null) {
                cc.log("InitUserHandUI:offIdx == null!!!!");
                offIdx = 0;
            }

            var setCardArrowOnGang4 = false;
            for (var j = 0; j < 4; j++) {
                if (j < 3) {
                    if ((j % 3 == 2 - offIdx && off % 3 == 0) || (j % 3 == offIdx && off % 3 != 0)) {
                        var cdui = getNewCard(node, "up", "gang0", pl.mjgang0[i], off, "heng", "heng");
                        setCardArrow(cdui, offIdx, off);
                        if (j == 1) {
                            setCardArrowOnGang4 = true;
                        }
                    }
                    else {
                        getNewCard(node, "up", "gang0", pl.mjgang0[i], off);
                    }
                }
                else {
                    var cdui = getNewCard(node, "up", "gang0", pl.mjgang0[i], off, "isgang4");//最后一张牌放上面
                    cdui.tag = pl.mjgang0[i];
                    if (setCardArrowOnGang4) {
                        setCardArrow(cdui, offIdx, off);
                    }
                }
            }
        }
    }


    //添加暗杠
    if (pl.mjgang1)
        for (var i = 0; i < pl.mjgang1.length; i++) {
            for (var j = 0; j < 4; j++) {
                if (j == 3) {
                    getNewCard(node, "down", "gang1", 0, off, "isgang4").tag = pl.mjgang1[i];
                }
                else {
                    getNewCard(node, "up", "gang1", pl.mjgang1[i], off);
                }
            }
        }

    //cc.log("pl.mjchi = " + pl.mjchi);
    var chiIdx = 0;
    if (pl.mjchi)
        for (var i = 0; i < pl.mjchi.length; i++) {
            if (i % 3 == 0) {
                chiIdx++;
            }

            if (pl.mjchiCard[chiIdx - 1] == pl.mjchi[i])//吃的横牌表示吃的是哪张牌
            {
                var cdui = getNewCard(node, "up", "chi", pl.mjchi[i], off, "heng");
                setCardArrow(cdui, 2, off);
                setCardArrow_chi(cdui, 2, off);
            }
            else {
                getNewCard(node, "up", "chi", pl.mjchi[i], off);
            }
        }

    //添加手牌
    if (MjClient.rePlayVideo == -1)//表示正常游戏
    {
        if (pl.mjhand && off === 0) {
            for (var i = 0; i < pl.mjhand.length; i++) {
                getNewCard(node, "stand", "mjhand", pl.mjhand[i], off);
            }
        }
        else if (pl.mjhand && pl.mjState === TableState.roundFinish) {
            COMMON_UI.showMjhandBeforeEndOnePlayer(off);
        }
        else {
            var CardCount = 0;
            cc.log('--------tData.tState------------', tData.tState)
            if ((tData.tState == TableState.waitPut || tData.tState == TableState.waitChooseCard) && tData.uids[tData.curPlayer] == pl.info.uid) {
                CardCount = MjClient.majiang.handCount + 1;
            }
            else {
                CardCount = MjClient.majiang.handCount;
            }
            var upCardCount = CardCount - (((pl.mjpeng ? pl.mjpeng.length : 0) + (pl.mjgang0 ? pl.mjgang0.length : 0) + (pl.mjgang1 ? pl.mjgang1.length : 0)) * 3 + (pl.mjchi ? pl.mjchi.length : 0));
            for (var i = 0; i < upCardCount; i++) {
                getNewCard(node, "stand", "standPri");
            }
        }
    }
    else {
        /*
         播放录像
         */
        cc.log("_________________mjhand_replay_______________" + JSON.stringify(pl.mjhand));
        cc.log("____mjhand_replay______ 数据 ", JSON.stringify(pl));
        if (pl.mjhand) {
            if (off == 0) {
                for (var i = 0; i < pl.mjhand.length; i++) {
                    getNewCard(node, "stand", "mjhand", pl.mjhand[i], off);
                }
            }
            else {

                for (var i = 0; i < pl.mjhand.length; i++) {
                    getNewCard(node, "up", "mjhand_replay", pl.mjhand[i], off);
                }
            }
        }

    }

    //cc.log(" pl ----  第二局    ",pl.huCards,pl.huCards.length,off);
    if (typeof (pl.huCards) != "undefined" && pl.huCards.length > 0) {
        MjClient.playui.resetCardAfterHu(node, off);
    }

}


function InitUserHandUI_YNXueZhan(node, off) {
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var pl = getUIPlayer(off);
    cc.log("--------InitUserHandUI_YNXueZhan  off = " + off);
    if (!pl) {
        return;
    }
    cc.log("--------InitUserHandUI_YNXueZhan  pl = " + JSON.stringify(pl));
    //初始化玩家金币和名称
    InitUserCoinAndName(node, off);
    if (
        tData.tState != TableState.waitPut &&
        tData.tState != TableState.waitEat &&
        tData.tState != TableState.waitCard &&
        tData.tState != TableState.waitSelect &&
        tData.tState != TableState.waitChooseCard
    ) {
        return;
    }

    showHandCard_YNXueZhan(node, off)

    //添加打出的牌
    if (pl.mjput)
        for (var i = 0; i < pl.mjput.length; i++) {
            var msg =
            {
                card: pl.mjput[i],
                uid: pl.info.uid
            };

            DealMJPut_YNXueZhan(node, msg, off, i);
        }

    MjClient.playui.CardLayoutRestore(node, off);

}

function initFlower_xuezhanMJ() {
    initFlower(false, false);
}


var PlayLayer_YNXueZhan = cc.Layer.extend({
    jsBind: {
        _event: {
            mjhand: function () {
                if (MjClient.endoneui != null) {
                    cc.log("=======mjhand====endoneui====" + typeof (MjClient.endoneui));
                    MjClient.endoneui.removeFromParent(true);
                    MjClient.endoneui = null;
                }

                var sData = MjClient.data.sData;
                var tData = sData.tData;
                resetFlowerNum(this);
                //resetMaiZhuangNum_haian(this);
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
                    {
                        //AlertSameIP(ipmsg.join("\n"));
                    }
                }
                mylog("ipmsg " + ipmsg.length);

            },
            LeaveGame: function () {
                MjClient.addHomeView();
                MjClient.playui.removeFromParent(true);
                delete MjClient.playui;
                delete MjClient.endoneui;
                delete MjClient.endallui;
                cc.audioEngine.stopAllEffects();
                playMusic("bgMain");
            },
            endRoom: function (msg) {
                mylog(JSON.stringify(msg));
                if (msg.showEnd) this.addChild(new GameOverLayer(), 500);
                else
                    MjClient.Scene.addChild(new StopRoomView());
            },
            roundEnd: function () {
                var self = this;
                function delayExe() {
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    resetEatActionAnim();
                    if (sData.tData.roundNum <= 0) {
                        if (!tData.matchId) {
                            self.addChild(new GameOverLayer(), 500);
                        } else {
                            self.runAction(cc.sequence(cc.delayTime(3), cc.callFunc(function () {
                                self.addChild(new GameOverLayer(), 500);
                            })))
                        }
                    }
                    self.addChild(new EndOneView_YNXueZhan(), 500);
                }
                if (MjClient.rePlayVideo === -1) {
                    this.runAction(cc.sequence(cc.delayTime(0.1), cc.callFunc(COMMON_UI.showMjhandBeforeEndOne), cc.delayTime(1.7), cc.callFunc(delayExe)));
                } else {
                    this.runAction(cc.sequence(cc.delayTime(1.5), cc.callFunc(delayExe)));
                }



            },
            moveHead: function () {
                postEvent("returnPlayerLayer");
                tableStartHeadMoveAction(this);
                initFlower_xuezhanMJ();
            },
            initSceneData: function () {
                reConectHeadLayout(this);
                cc.log("initSceneData -----------------gunyun = " + JSON.stringify(this));
                CheckRoomUiDelete();
            },
            onlinePlayer: function () {
                reConectHeadLayout(this);
            },
            logout: function () {
                if (MjClient.playui) {
                    MjClient.addHomeView();
                    MjClient.playui.removeFromParent(true);
                    delete MjClient.playui;
                    delete MjClient.endoneui;
                    delete MjClient.endallui;
                }
            },
            DelRoom: function () {
                CheckRoomUiDelete();
            },
            changeMJBgEvent: function () {
                changeMJBg(this, getCurrentMJBgType());
            },
            waitPut: function () {
                COMMON_UI.clearShowCurrentEatCards();
            },
        },
        roundnumImg: {
            _run: function () {
                //roundnumImgObj = this;
                MjClient.roundnumImgNode = this;
                setWgtLayout(this, [0.1, 0.1], [0.5, 0.5], [-1.2, 0.8]);
            },
            _event: {
                initSceneData: function (eD) {
                    this.visible = IsArrowVisible();
                },
                mjhand: function (eD) {
                    this.visible = IsArrowVisible();
                },
                onlinePlayer: function (eD) {
                    //this.visible = IsArrowVisible();
                }
            },
            roundnumAtlas: {
                _run: function () {
                    this.ignoreContentAdaptWithSize(true);
                },
                _text: function () {
                    var tData = MjClient.data.sData.tData;
                    if (tData) {
                        var _currentRoundIdx = parseInt(tData.roundAll - tData.roundNum) + 1;
                        if (_currentRoundIdx > tData.roundAll) _currentRoundIdx = 1;
                        return _currentRoundIdx + "/" + tData.roundAll;
                    }
                },
                _event: {
                    mjhand: function () {
                        var tData = MjClient.data.sData.tData;
                        if (tData) {
                            var _currentRoundIdx = parseInt(tData.roundAll - tData.roundNum) + 1;
                            if (_currentRoundIdx > tData.roundAll) _currentRoundIdx = 1;
                            this.setString(_currentRoundIdx + "/" + tData.roundAll);
                        }
                    }
                }
            }
        },
        cardNumImg: {
            _run: function () {
                MjClient.cardNumImgNode = this;
                setWgtLayout(this, [0.1, 0.1], [0.5, 0.5], [1.2, 0.8]);
            },
            _event: {
                initSceneData: function (eD) {
                    this.visible = IsArrowVisible();
                },
                mjhand: function (eD) {
                    this.visible = IsArrowVisible();
                },
                onlinePlayer: function (eD) {
                    //this.visible = IsArrowVisible();
                }
            },
            cardnumAtlas: {
                _run: function () {
                    this.ignoreContentAdaptWithSize(true);
                },
                _text: function () {
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    if (tData) return MjClient.majiang.getAllCardsTotal() - tData.cardNext;
                },
                _event: {
                    waitPut: function () {
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
                _run: function () {
                    changeGameBg(this);
                },
                _event: {
                    changeGameBgEvent: function () {
                        changeGameBg(this);
                    }
                },
                _layout: [
                    [1, 1],
                    [0.5, 0.5],
                    [0, 0], true
                ],
            },
            LeftBottom: {
                _layout: [
                    [0.1, 0.1],
                    [0.03, 0.045],
                    [0, 0]
                ],
            },
            RightBottom: {
                _layout: [
                    [0.1, 0.1],
                    [0.97, 0.05],
                    [0, 0]
                ],
            },
            RightTop: {
                _layout: [
                    [0.1, 0.1],
                    [0.97, 0.95],
                    [0, 0]
                ],
            },
            leftTop: {
                _layout: [
                    [0.1, 0.1],
                    [0.03, 0.95],
                    [0, 0]
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
        gameName: {
            _visible: false,
            _layout: [
                [0.20, 0.20],
                [0.5, 0.62],
                [0, 1.0]
            ],
            _run: function () {
                var subName = MjClient.data.sData.tData.areaSelectMode.subRule,
                    txtArr = ['xzddTitle', 'sanrensanfang', 'sanrenliangfang', 'errenliangfang', 'errenyifang'];
                this.loadTexture('XueZhanDaoDi/' + txtArr[subName] + '.png');
                this.visible = true;
            }
        },
        roundInfo: {
            _visible: false,
            _layout: [
                [0.09, 0.09],
                [0.5, 0.408],
                [0, 1.0]
            ],
            _run: function () {
                var tData = MjClient.data.sData.tData;
                this.ignoreContentAdaptWithSize(true);
                this.setString(getPlayingRoomInfo(0));
                if (tData.matchId && tData.matchInfo) {
                    if (MjClient.matchRank) {
                        showPlayUI_matchInfo("排名：" + MjClient.matchRank + "/" + tData.matchInfo.userCount + "\n前" + tData.matchInfo.jingjiCount + "名晋级");
                    } else {
                        showPlayUI_matchInfo("排名：" + tData.matchInfo.userCount + "/" + tData.matchInfo.userCount + "\n前" + tData.matchInfo.jingjiCount + "名晋级");
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
            bg_time: {
                _run: function () {
                    var text = new ccui.Text();
                    text.setFontName(MjClient.fzcyfont);
                    text.setFontSize(26);

                    text.setAnchorPoint(1, 0.5);
                    text.setPosition(66, 15);
                    this.addChild(text);
                    text.schedule(function () {
                        var time = MjClient.getCurrentTime();
                        var str = (time[3] < 10 ? "0" + time[3] : time[3]) + ":" +
                            (time[4] < 10 ? "0" + time[4] : time[4]);
                        this.setString(str);
                    });
                }

            },
            wifi: {
                _run: function () {
                    updateWifiState(this);
                }
            },
            powerBar: {
                _run: function () {
                    cc.log("powerBar_run");
                    updateBattery(this);
                },
                _event: {
                    nativePower: function (d) {
                        this.setPercent(Number(d));
                    }
                }
            },
            tableid: {
                _run: function () {
                    this.ignoreContentAdaptWithSize(true);
                },
                _event: {
                    initSceneData: function () {
                        this.ignoreContentAdaptWithSize(true);
                        this.setString('房号：' + MjClient.data.sData.tData.tableid);
                    }
                }
            },
            Button_1: {
                _visible: false,
                _click: function () {
                    MjClient.openWeb({ url: MjClient.GAME_TYPE.XUE_ZHAN_MAHJONG, help: true });
                }
            },
            setting: {
                _click: function () {
                    var settringLayer = new RoomSettingView();
                    MjClient.Scene.addChild(settringLayer);
                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Shezhi", { uid: SelfUid(), gameType: MjClient.gameType });
                }
            },
            rule_btn: {
                _visible: true,
                _click: function () {
                    MjClient.showRuleView = new GameRule_YAXueZhan();
                    MjClient.Scene.addChild(MjClient.showRuleView);
                },
            },
        },
        BtnPutCard: { //add by  sking for put card button
            _run: function () {

                var tData = MjClient.data.sData.tData;
                cc.log("BtnPutCard _run set put card btn state = " + tData.tState);

                if (!IsTurnToMe() || tData.tState != TableState.waitPut) {
                    // cc.log(" it's not my turn------------------sking");
                    this.visible = false;
                }
                else {
                    // cc.log(" it's my turn------------------sking");
                    this.visible = true;
                }

                setWgtLayout(this, [0.18, 0.18], [0.82, 0.3], [0.7, -0.1]);
            },
            _click: function (btn) {
                cc.log("点击出牌");
                //var sData = MjClient.data.sData;
                //cc.log("sData.tState == " + sData.tState);
                var downNode = MjClient.playui._downNode;
                var standUI = downNode.getChildByName("stand");
                var children = downNode.children;
                for (var i = 0; i < children.length; i++) {
                    if (children[i].name == "mjhand") {
                        if (children[i].y > standUI.y + 10) {
                            PutOutCard(children[i], children[i].tag); //可以出牌
                            break;
                        }
                    }
                }
                this.visible = false;
            },
            _event: {
                //拿到一张牌的时候，出牌按钮亮起，其他状态隐藏，by sking
                mjhand: function () {
                    this.visible = false;
                    cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>initSceneData");
                },
                MJHu: function () {
                    this.visible = false;
                    cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>mjhand");
                },
                newCard: function (eD) {
                    cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>newCard by sking");
                    this.visible = true;
                    //setWgtLayout(this, [0.1, 0.1],[0.7, 0.2],[0, 0]);
                },
                MJPut: function (eD) {
                    cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>MJPut by sking");
                    this.visible = false;
                },
                MJChi: function (eD) {
                    cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>MJChi by sking");
                    if (IsTurnToMe()) {
                        this.visible = true;
                    }
                },
                MJGang: function (eD) {
                    cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>MJGang by sking");
                    if (IsTurnToMe()) {
                        this.visible = true;
                    }
                },
                MJPeng: function (eD) {
                    cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>MJPeng by sking");
                    if (IsTurnToMe()) {
                        //cc.log("    ----------------------peng  btn show----");
                        this.visible = true;
                    }
                },
                MJTing: function (eD) {
                    if (MjClient.playui.isCanPutCard()) {
                        this.visible = true;
                        cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>MJTing by sking - hide");
                    } else {
                        this.visible = false;
                    }
                },
                roundEnd: function () {
                    this.visible = false;
                },
                waitPut: function () {
                    if (_isAniShow_xuezhanMJ) return;
                    var pl = getUIPlayer(0);
                    var eat = MjClient.playui.jsBind.eat;
                    if (IsTurnToMe() && pl.isTing && !eat.hu._node.visible && !eat.gang0._node.visible && !eat.gang1._node.visible && !eat.gang2._node.visible) {
                        cc.log("*********自动出牌*********");
                        this.runAction(cc.sequence(cc.delayTime(0.4),
                            cc.callFunc(MjClient.playui.jsBind.BtnPutCard._click)));
                    } else {
                        if (MjClient.playui.isCanPutCard()) {
                            if (eat.hu._node.visible) {
                                this.visible = false;
                                cc.log("--------------------有胡按钮拉--------------");
                            }
                            else {
                                this.visible = true;
                            }
                        }
                    }
                }
            }
        },//end of add by sking
        down: {
            head: {
                TG_CountDown: {//托管倒计时
                    _run: function () {
                        this.visible = false;
                        this.ignoreContentAdaptWithSize(true);
                    },
                    _event: {
                        trustTip: function (msg) {
                            if (getUIPlayer(0) && getUIPlayer(0).info.uid == msg.uid) {
                                this.visible = true;
                                this.setString(msg.tipCountDown);
                                var tipCountDown = msg.tipCountDown;
                                var self = this;
                                this.schedule(function () {
                                    self.setString(tipCountDown);
                                    if (tipCountDown > 0) {
                                        tipCountDown--;
                                    } else {
                                        self.setVisible(false);
                                        self.unscheduleAllCallbacks();
                                    }
                                }, 1, cc.REPEAT_FOREVER, 0);
                            }
                        },
                        MJPut: function (msg) {
                            this.visible = false;
                        },
                        roundEnd: function () {
                            this.visible = false;
                        }
                    }
                },
                tuoguan: {
                    _run: function () {
                        this.visible = false;
                    },
                    _event: {
                        beTrust: function (msg) {
                            if (getUIPlayer(0) && getUIPlayer(0).info.uid == msg.uid) {
                                this.visible = true;
                            }
                        },
                        cancelTrust: function (msg) {
                            if (getUIPlayer(0) && getUIPlayer(0).info.uid == msg.uid) {
                                this.visible = false;
                            }
                        }
                    }
                },
                zhuang: {
                    _run: function () {
                        this.visible = false;
                    },
                    _event: {
                        mjhand: function () {
                            showUserZhuangLogo(this, 0);
                        },
                        initSceneData: function () {
                            if (IsArrowVisible()) showUserZhuangLogo(this, 0);
                        }
                    }
                },
                chatbg: {
                    _run: function () {
                        this.getParent().zIndex = 600;
                    },
                    chattext: {
                        _event: {

                            MJChat: function (msg) {
                                this.setFontSize(30);
                                cc.log("show user Chat MJCHAT");
                                showUserChat(this, 0, msg);
                            },
                            playVoice: function (voicePath) {
                                MjClient.data._tempMessage.msg = voicePath;
                                showUserChat(this, 0, MjClient.data._tempMessage);
                            }
                        }
                    }
                },
                _click: function (btn) {
                    showPlayerInfo(0, btn);
                },
                _event: {
                    loadWxHead: function (d) {
                        setWxHead(this, d, 0);
                    },
                    addPlayer: function (eD) {
                        showFangzhuTagIcon(this, 0);
                    },
                    removePlayer: function (eD) {
                        showFangzhuTagIcon(this, 0);
                    }
                },
                _run: function () {
                    // this.zIndex = 600;
                    showFangzhuTagIcon(this, 0);
                },
                score_bg: { _visible: false },
                name_bg: { _visible: false },
                flower_layout: { _visible: false },
                flower_zfb_layout: { _visible: false },
                tingCard: { //add by sking
                    _visible: false,
                    _event: {
                        MJTing: function (eD) {
                            if (eD.uid == SelfUid()) {
                                var pl = getUIPlayer(0);
                                pl.putCardAfterTing = eD.putCardAfterTing;
                                MjClient.playui.setTingCardInfo(this, eD, 0);
                            }
                        },
                        clearCardUI: function (eD) {
                            cc.log("ready to----- clear sking ----");
                            this.visible = false;
                        },
                        MJHu: function (eD) {
                            this.visible = false;
                        },
                        onlinePlayer: function (eD) {
                            //MjClient.playui.setTingCardInfo(this,eD,0);
                        },
                        initSceneData: function (eD) {
                            MjClient.playui.setTingCardInfo(this, eD, 0);
                        }
                    }
                },
                tingIcon: {
                    _visible: false,
                    _run: function () {
                        this.visible = false;
                        this.runAction(cc.sequence(cc.spawn(cc.tintTo(0.6, 255, 0, 0), cc.scaleTo(0.6, this.getScale() + 0.3)),
                            cc.spawn(cc.tintTo(0.6, 255, 255, 255), cc.scaleTo(0.6, this.getScale()))).repeatForever());
                    },
                    _event: {
                        clearCardUI: function (eD) {
                            this.visible = false;
                        },
                        MJHu: function (eD) {
                            this.visible = false;
                        },
                        moveHead: function () {
                            MjClient.playui.tingIconVisible(this, 0);
                        },
                        onlinePlayer: function (eD) {
                            //MjClient.playui.tingIconVisible(this,0);
                        },
                        initSceneData: function (eD) {
                            MjClient.playui.tingIconVisible(this, 0);
                        },
                        roundEnd: function () {
                            // cc.log("end rounde------------------------");
                            this.visible = false;
                        }
                    }
                },
                skipHuIconTag: {
                    _visible: false,
                    _event: {
                        clearCardUI: function (eD) {
                            this.visible = false;
                        },
                        MJHu: function (eD) {
                            this.visible = false;
                        },
                        initSceneData: function (eD) {
                            // var pl = getUIPlayer(0);
                            // if (pl && pl.skipHu) {
                            //     //var _skipHuIconNode =  MjClient.playui._downNode.getChildByName("head").getChildByName("skipHuIconTag");
                            //     this.visible = pl.skipHu.length > 0;
                            // }
                        }
                    }
                },
                skipPengIconTag: {
                    _visible: false,
                    _event: {
                        clearCardUI: function (eD) {
                            this.visible = false;
                        },
                        MJpeng: function (eD) {
                            this.visible = false;
                        },
                        initSceneData: function (eD) {
                            // var pl = getUIPlayer(0);
                            // if (pl && pl.skipPeng.length > 0) {
                            //     //var _skipHuIconNode =  MjClient.playui._downNode.getChildByName("head").getChildByName("skipHuIconTag");
                            //     this.visible = true;
                            // } else {
                            //     this.visible = false;
                            // }
                        }
                    }
                }

            },
            play_tips: {
                _layout: [[0.08, 0.14], [0.5, 0.25], [0, 0.5]],
                _run: function () {
                    this.zIndex = actionZindex;
                },
                _visible: false,
            },
            tai_layout: {
                _layout: [
                    [0.018, 0.018],
                    [0, 0],
                    [0, 0.2]
                ],
                tai_info: {
                    _visible: true,
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
                _run: function () {
                    GetReadyVisible(this, 0);
                },
                _event: {
                    moveHead: function () {
                        GetReadyVisible(this, -1);
                    },
                    addPlayer: function () {
                        GetReadyVisible(this, 0);//根据状态设置ready 是否可见 add by sking
                    },
                    removePlayer: function () {
                        GetReadyVisible(this, 0);
                    },
                    onlinePlayer: function () {
                        GetReadyVisible(this, 0);
                    }
                }
            },
            stand: {
                _layout: [
                    [0.053, 0],
                    [0.5, 0],
                    [8, 0.72]
                ],
                _visible: false,
                _run: function () {
                    // this.zIndex = 500;
                },
                _event: {
                    mjhand: function () {
                        this.visible = false;
                    }
                }
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
            out0: {
                _run: function () {
                    // setWgtLayout(this, [0.0, 0.063], [0.53, 0], [-7, 6.1]);
                    setWgtLayout(this, [0.0, 0.08], [0.55, -0.08], [-7, 6.1]);
                    if (MjClient.MaxPlayerNum == 2)
                        this.x -= this.height * this.scale * 5;
                },
                _visible: false
            },
            out1: {
                _run: function () {
                    // setWgtLayout(this, [0.0, 0.063], [0.53, 0], [-7, 4.9]);
                    setWgtLayout(this, [0.0, 0.08], [0.55, -0.06], [-7, 4.9]);
                    if (MjClient.MaxPlayerNum == 2)
                        this.x -= this.height * this.scale * 5;
                },
                _visible: false
            },
            out2: {
                _run: function () {
                    // setWgtLayout(this, [0.0, 0.063], [0.53, 0], [-7, 3.7]);
                    setWgtLayout(this, [0.0, 0.08], [0.55, -0.04], [-7, 3.7]);
                    if (MjClient.MaxPlayerNum == 2)
                        this.x -= this.height * this.scale * 5;
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
                    clearCardUI: function (eD) {
                        this.visible = false;
                    },
                    MJHu: function (eD) {
                        this.visible = false;
                    },
                    initSceneData: function (eD) {
                        MjClient.playui.tingIconVisible(this, 0);
                    }
                }
            },
            tingCardNumNode: {
                _layout: [[0.25, 0.12], [0.12, 0.25], [0, -0.2]],
                _visible: false,
                _event: {
                    clearCardUI: function (eD) {
                        this.visible = false;
                    },
                    MJHu: function (eD) {
                        this.visible = false;
                    },
                    MJPut: function (eD) {
                        this.visible = false;
                    }
                }
            },
            SwappingTip: {
                _visible: false,
                _layout: [[0.4, 0.4], [0.5, 0.4], [0, 0]],
                _event: {
                    waitHuanPai: function () {
                        var tData = MjClient.data.sData.tData;
                        MjClient.playui._huanPaiUpNum = 0;
                        MjClient.movingCard = null;
                        var eatArr = MjClient.playui.jsBind.node_eat;
                        for (var key in eatArr) {
                            if (eatArr[key]._node)
                                eatArr[key]._node.setVisible(false);
                        }
                        if (tData.areaSelectMode.SwappingType !== 0) return;
                        // 提起系统推荐的手牌3张
                        MjClient.playui.raiseRecommendedHands(this.getParent());
                    },
                    canSwapBtn: function (show) {
                        var tData = MjClient.data.sData.tData;
                        this.getChildByName('tipLabel').visible = tData.areaSelectMode.SwappingType == 0;
                        this.getChildByName('tipLabel1').visible = tData.areaSelectMode.SwappingType == 1;
                        this.visible = show;
                        postEvent('canShowBtn');
                    },
                    chooseCards: function (msg) {
                        let off = 0, pl = getUIPlayer(off);
                        if (pl && pl.info.uid == msg.uid) {
                            this.setVisible(false);
                        }
                    }
                },
                swappBtn: {
                    _event: {
                        canShowBtn: function () {
                            var tData = MjClient.data.sData.tData;
                            let flg = MjClient.playui._huanPaiUpNum == MjClient.playui.HuanPaiCount();
                            if (tData.areaSelectMode.SwappingType == 0) {
                                let cDs = MjClient.playui.getUpHandCardNode(), cDc = -1, cdF = true;
                                for (let _i = 0; _i < cDs.length; _i++) {
                                    const cd = cDs[_i], l = ~~(cd / 10);
                                    if (cDc == -1) cDc = l;
                                    if (l != cDc) {
                                        cdF = false;
                                        break;
                                    }
                                }
                                flg = flg && cdF;
                            }
                            this.setEnabled(flg);
                        },
                    },
                    _touch: function (btn, eT) {
                        if (eT == 2) {
                            var mjputMsg = {
                                cmd: "chooseCards",
                                chooseCards: MjClient.playui.getUpHandCardNode(),
                            };
                            MjClient.gamenet.request("pkroom.handler.tableMsg", mjputMsg);
                        }
                    },
                }
            },
            swappType: {
                _visible: false,
                _layout: [[0.6, 0.6], [0.5, 0.54], [0, 0]],
                _event: {
                    chooseCards: function (msg) {
                        if (msg.isDone) {
                            let nowShow = null;
                            this.visible = true;
                            for (let _i = 0; _i < this.children.length; _i++) {
                                const itemN = this.children[_i];
                                if (itemN.getName() == 'totle_back' + (msg.swappingMode + 1)) nowShow = itemN;
                                else itemN.visible = false;
                            }
                            if (nowShow) {
                                nowShow.visible = true;
                                nowShow.runAction(cc.sequence(cc.fadeIn(0.5), cc.delayTime(0.8), cc.fadeOut(0.2), cc.callFunc(() => {
                                    nowShow.visible = false;
                                    this.visible = false;
                                })))
                            }
                            if (msg.tState == TableState.waitSelect) {
                                setTimeout(() => {
                                    MjClient.playui.showDingQueLayer();
                                }, 1500);
                            }
                        }
                    }
                }
            },
            huanpaizhong: {
                _visible: false,
                _layout: [[0.1, 0.1], [0.5, 0.3], [0, 0]],
            },
            _event: {
                waitDingQue: function () {
                    MjClient.playui.showDingQueLayer();
                },
                clearCardUI: function () {
                    clearCardUI(this, 0);
                },
                initSceneData: function (eD) {
                    SetUserVisible_YNXueZhan(this, 0);
                    var pl = getUIPlayer(0);
                    //换牌
                    if (MjClient.playui.checkIsWaitHuanPai()) {
                        if (pl.chooseCards && pl.chooseCards.length === 0) {
                            MjClient.playui._huanPaiUpNum = 0;
                            MjClient.playui.raiseRecommendedHands(this);
                        } else {
                            MjClient.playui.showHuanPaiAnim(this, 0, true);
                        }
                        return;
                    }
                    MjClient.playui.showDingQueLayer();
                    if (pl && pl.que != -1 && MjClient.data.sData.tData.tState != TableState.roundFinish) {
                        MjClient.playui.playSignAnimation(this.getChildByName("head"), pl.que, 0, false);
                    }

                    var _tingCards = this.getChildByName("tingCardsNode");
                    var tingSet = calTingSet(pl.mjhand);
                    if (MjClient.majiang.hasquesecard(pl.mjhand, pl.que) &&
                        typeof (pl.huCards) != "undefined" && pl.huCards.length <= 0) {
                        setTingCards_showCount(_tingCards, tingSet);
                    }
                },
                addPlayer: function (eD) {
                    SetUserVisible_YNXueZhan(this, 0);
                },
                removePlayer: function (eD) {
                    SetUserVisible_YNXueZhan(this, 0);
                },
                mjhand: function (eD) {
                    //showShaiziAni_YNXueZhan(0);
                    InitUserHandUI_YNXueZhan(this, 0);
                    MjClient.playui.clearSign(0);
                },
                roundEnd: function () {
                    InitUserCoinAndName(this, 0);
                    //setTaiInfo("");
                    MjClient.playui.clearSign(0);
                },
                MJSelect: function (msg) {
                    MjClient.playui.CardLayoutRestore(this, 0);
                    var pl = getUIPlayer(0);
                    if (pl && msg.uid == pl.info.uid) {
                        MjClient.playui.playSignAnimation(this.getChildByName("head"), msg.que, 0);
                    }
                    MjClient.playui.EatVisibleCheck();
                },
                newCard: function (eD) {
                    if (_isAniShow_xuezhanMJ) return;
                    // cdsNums++;
                    cc.log("客户端发牌组合......eD= " + JSON.stringify(eD));
                    //cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>newCard---------------");
                    //var putButtn = this.getChildByName("BtnPutCard");
                    //putButtn.visible = true;
                    //MjClient.playui._btnPutCard.visible = true;
                    if (typeof (eD) == "number") {
                        eD = { newCard: eD };
                    }
                    DealNewCard(this, eD.newCard, 0);
                    hideTingBtn();
                },
                MJPut: function (eD) {

                    DealMJPut_YNXueZhan(this, eD, 0);
                    var pl = getUIPlayer(0);
                    if (eD.uid == SelfUid()) {
                        var _tingCards = this.getChildByName("tingCardsNode");
                        var tingSet = calTingSet(pl.mjhand);
                        cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>MJPut---------------= " + JSON.stringify(tingSet));
                        if (MjClient.majiang.hasquesecard(pl.mjhand, pl.que) && (!pl.huCards || pl.huCards.length <= 0)) {
                            setTingCards_showCount(_tingCards, tingSet);
                        }
                    }
                    setUserOffline(this, 0);
                    MjClient.playui.resetCardcolor(0);
                    COMMON_UI.cleanTingSign();
                },
                MJChi: function (eD) {
                    // DealMJChi(this, eD, 0);
                    if (MjClient.rePlayVideo != -1) {
                        DealMJChi(this, eD, 0);
                    } else {
                        updateHeadUI_YNXueZhan(this, 0, ActionType.CHI);
                    }
                    setUserOffline(this, 0);
                },
                MJGang: function (eD) {
                    DealMJGang(this, eD, 0);
                    hideTingBtn();
                    setUserOffline(this, 0);
                },
                MJPeng: function (eD) {
                    // DealMJPeng(this, eD, 0);
                    if (MjClient.rePlayVideo != -1) {
                        DealMJPeng(this, eD, 0);
                    } else {
                        updateHeadUI_YNXueZhan(this, 0, ActionType.PENG);
                    }
                    var pl = getUIPlayer(0);
                    var _tingCards = this.getChildByName("tingCardsNode");
                    var tingSet = calTingSet(pl.mjhand);

                    if (MjClient.majiang.hasquesecard(pl.mjhand, pl.que) && (!pl.huCards || pl.huCards.length <= 0)) {
                        setTingCards_showCount(_tingCards, tingSet);
                    }
                    setUserOffline(this, 0);
                },
                MJHu: function (eD) {
                    HandleMJHu(this, eD, 0);
                    setUserOffline(this, 0);
                    var pl = getUIPlayer(0);
                    cc.log("手牌数据----    ", JSON.stringify(pl));
                    if (MjClient.rePlayVideo == -1) {
                        updateHeadUI_YNXueZhan(this, 0);
                    }
                },
                onlinePlayer: function (eD) {
                    setUserOffline(this, 0);
                },
                playerStatusChange: function (eD) {
                    setUserOffline(this, 0);
                },
                MJTing: function (eD) {
                    HandleMJTing(this, eD, 0);
                },
                chooseCards: function (msg) {
                    let off = 0, pl = getUIPlayer(off);
                    if (pl && pl.info.uid == msg.uid) {
                        MjClient.playui.showHuanPaiAnim(this, off, false);
                    }
                    if (msg.isDone) MjClient.playui.addSwapTitle(msg, this, off);
                }
            }
        },
        right: {
            _run: function () {
                cc.log("MjClient.MaxPlayerNum  right", MjClient.MaxPlayerNum);
                this.visible = MjClient.MaxPlayerNum != 2;
            },
            head: {
                TG_CountDown: {//托管倒计时
                    _run: function () {
                        this.visible = false;
                        this.ignoreContentAdaptWithSize(true);
                    },
                    _event: {
                        trustTip: function (msg) {
                            if (getUIPlayer(1) && getUIPlayer(1).info.uid == msg.uid) {
                                this.visible = true;
                                this.setString(msg.tipCountDown);
                                var tipCountDown = msg.tipCountDown;
                                var self = this;
                                this.schedule(function () {
                                    self.setString(tipCountDown);
                                    if (tipCountDown > 0) {
                                        tipCountDown--;
                                    } else {
                                        self.setVisible(false);
                                        self.unscheduleAllCallbacks();
                                    }
                                }, 1, cc.REPEAT_FOREVER, 0);
                            }
                        },
                        MJPut: function (msg) {
                            this.visible = false;
                        },
                        roundEnd: function () {
                            this.visible = false;
                        }
                    }
                },
                tuoguan: {
                    _run: function () {
                        this.visible = false;
                    },
                    _event: {
                        beTrust: function (msg) {
                            if (getUIPlayer(1) && getUIPlayer(1).info.uid == msg.uid) {
                                this.visible = true;
                            }
                        },
                        cancelTrust: function (msg) {
                            if (getUIPlayer(1) && getUIPlayer(1).info.uid == msg.uid) {
                                this.visible = false;
                            }
                        }
                    }
                },
                dingque: {
                    _visible: false,
                    _run: function () {
                        setWgtLayout(this, [1.5, 1.5], [-1.5, 0], [0, 0], false, true);
                    },
                    _event: {
                        chooseCards: function (msg) {
                            if (msg.isDone) {
                                this.visible = false;
                                const tData = MjClient.data.sData.tData;
                                if (!tData.areaSelectMode.DesignatingUnwantedEnabled) return;
                                this.visible = true;
                            }
                        },
                        waitDingQue: function () {
                            this.visible = true;
                        },
                        MJSelect: function (msg) {
                            var pl = getUIPlayer(1);
                            if (pl && msg.uid == pl.info.uid) {
                                this.visible = false;
                                MjClient.playui.playSignAnimation(this.getParent(), msg.que, 1);
                            }
                        },
                        initSceneData: function () {
                            const tData = MjClient.data.sData.tData;
                            if (!tData.areaSelectMode.DesignatingUnwantedEnabled) return;
                            var pl = getUIPlayer(1);
                            if (pl && pl.que != -1 && tData.tState != TableState.roundFinish) {
                                MjClient.playui.playSignAnimation(this.getParent(), pl.que, 1, false);
                                this.visible = false;
                            }
                            else if (pl && pl.que == -1) {
                                this.visible = tData.tState == TableState.waitSelect;
                            }
                        },
                        roundEnd: function () {
                            this.visible = false;
                        }
                    }
                },
                zhuang: {
                    _run: function () {
                        this.visible = false;
                    },
                    _event: {
                        mjhand: function () {
                            showUserZhuangLogo(this, 1);
                        },
                        initSceneData: function () {
                            if (IsArrowVisible()) showUserZhuangLogo(this, 1);
                        }
                    }
                },
                chatbg: {
                    _run: function () {
                        this.getParent().zIndex = 500;
                    },
                    chattext: {
                        _event: {

                            MJChat: function (msg) {
                                this.setFontSize(30);
                                showUserChat(this, 1, msg);
                            },
                            playVoice: function (voicePath) {
                                if (MjClient.data._tempMessage) {
                                    MjClient.data._tempMessage.msg = voicePath;
                                    showUserChat(this, 1, MjClient.data._tempMessage);
                                }
                            }
                        }
                    }
                },
                _click: function (btn) {
                    showPlayerInfo(1, btn);
                },
                _event: {
                    loadWxHead: function (d) {
                        setWxHead(this, d, 1);
                    },
                    addPlayer: function (eD) {
                        showFangzhuTagIcon(this, 1);
                    },
                    removePlayer: function (eD) {
                        showFangzhuTagIcon(this, 1);
                    }
                },
                _run: function () {
                    // this.zIndex = 600;
                    showFangzhuTagIcon(this, 1);
                },
                score_bg: { _visible: false },
                name_bg: { _visible: false },
                flower_layout: { _visible: false },
                flower_zfb_layout: { _visible: false },
                tingCard: {
                    _visible: false,
                    _event: {
                        MJTing: function (eD) {
                            if (MjClient.playui.isPlayerPutCard(eD, 1)) {
                                var pl = getUIPlayer(1);
                                pl.putCardAfterTing = eD.putCardAfterTing;
                                MjClient.playui.setTingCardInfo(this, eD, 1);
                            }
                        },
                        clearCardUI: function (eD) {

                            this.visible = false;
                        },
                        MJHu: function (eD) {
                            this.visible = false;
                        },
                        onlinePlayer: function (eD) {
                            //MjClient.playui.setTingCardInfo(this,eD,1);
                        },
                        initSceneData: function (eD) {
                            MjClient.playui.setTingCardInfo(this, eD, 1);
                        }
                    }
                },
                tingIcon: {
                    _visible: false,
                    _run: function () {
                        this.visible = false;

                        this.runAction(cc.sequence(cc.spawn(cc.tintTo(0.6, 255, 0, 0), cc.scaleTo(0.6, this.getScale() + 0.3)),
                            cc.spawn(cc.tintTo(0.6, 255, 255, 255), cc.scaleTo(0.6, this.getScale()))).repeatForever());
                    },
                    _event: {
                        clearCardUI: function (eD) {
                            this.visible = false;
                        },
                        MJHu: function (eD) {
                            this.visible = false;
                        },
                        moveHead: function () {
                            MjClient.playui.tingIconVisible(this, 1);
                        },
                        onlinePlayer: function (eD) {
                            //MjClient.playui.tingIconVisible(this,1);
                        },
                        initSceneData: function (eD) {
                            MjClient.playui.tingIconVisible(this, 1);
                        },
                        roundEnd: function () {
                            // cc.log("end rounde------------------------");
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
                _visible: false,
            },
            ready: {
                _layout: [
                    [0.07, 0.07],
                    [0.5, 0.5],
                    [2, 0.4]
                ],
                _run: function () {
                    GetReadyVisible(this, 1);
                },
                _event: {
                    moveHead: function () {
                        GetReadyVisible(this, -1);
                    },
                    addPlayer: function () {
                        GetReadyVisible(this, 1);
                    },
                    removePlayer: function () {
                        GetReadyVisible(this, 1);
                    },
                    onlinePlayer: function () {
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
                _visible: false,
                _event: {
                    mjhand: function () {
                        this.visible = false;
                    }
                }
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

            out2: {
                _run: function () {
                    // setWgtLayout(this, [0, 0.043], [0.97, 0.55], [-4.6, -5.1]);
                    setWgtLayout(this, [0, 0.055], [0.94, 0.5], [-2.8, -4.0]);
                },
                _visible: false
            },
            out1: {
                _run: function () {
                    // setWgtLayout(this, [0, 0.043], [0.97, 0.55], [-5.9, -5.1]);
                    setWgtLayout(this, [0, 0.055], [0.94, 0.5], [-4.0, -4.0]);
                },
                _visible: false
            },
            out0: {
                _run: function () {
                    // setWgtLayout(this, [0, 0.043], [0.97, 0.55], [-7.2, -5.1]);
                    setWgtLayout(this, [0, 0.055], [0.94, 0.5], [-5.2, -4.0]);
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
            huanpaizhong: {
                _visible: false,
                _layout: [[0.1, 0.1], [0.8, 0.5], [0, 0]],
                _event: {
                    waitHuanPai: function () {
                        this.setVisible(true);
                    },
                    chooseCards: function (msg) {
                        let off = 1, pl = getUIPlayer(off);
                        if (pl && pl.info.uid == msg.uid) {
                            this.setVisible(false);
                        }
                    }
                }
            },
            _event: {
                clearCardUI: function () {
                    clearCardUI(this, 1);
                },
                initSceneData: function (eD) {
                    SetUserVisible_YNXueZhan(this, 1);
                    var pl = getUIPlayer(1);
                    //换牌
                    if (pl && MjClient.playui.checkIsWaitHuanPai()) {
                        if (pl.chooseCards && pl.chooseCards.length === 0) {
                            this.getChildByName('huanpaizhong').visible = true;
                        } else {
                            MjClient.playui.showHuanPaiAnim(this, 1, true);
                        }
                        return;
                    }
                },
                addPlayer: function (eD) {
                    SetUserVisible_YNXueZhan(this, 1);
                },
                removePlayer: function (eD) {
                    SetUserVisible_YNXueZhan(this, 1);
                },
                mjhand: function (eD) {
                    //showShaiziAni_YNXueZhan(1);
                    InitUserHandUI_YNXueZhan(this, 1);
                    MjClient.playui.clearSign(1);
                },
                roundEnd: function () {
                    InitUserCoinAndName(this, 1);
                    MjClient.playui.clearSign(1);
                },
                waitPut: function () {
                    if (_isAniShow_xuezhanMJ) return;
                    DealWaitPut(this, MjClient.data.sData.tData, 1);
                },
                MJPut: function (eD) {
                    DealMJPut_YNXueZhan(this, eD, 1);
                    if (eD.uid != SelfUid()) {
                        hideTingBtn();
                    }
                    setUserOffline(this, 1);
                },
                MJChi: function (eD) {
                    // DealMJChi(this, eD, 1);
                    if (MjClient.rePlayVideo != -1) {
                        DealMJChi(this, eD, 1);
                    } else {
                        updateHeadUI_YNXueZhan(this, 1, ActionType.CHI);
                    }
                    setUserOffline(this, 1);
                },
                MJGang: function (eD) {
                    DealMJGang(this, eD, 1);
                    setUserOffline(this, 1);
                },
                MJPeng: function (eD) {
                    // DealMJPeng(this, eD, 1);
                    if (MjClient.rePlayVideo != -1) {
                        DealMJPeng(this, eD, 1);
                    } else {
                        updateHeadUI_YNXueZhan(this, 1, ActionType.PENG);
                    }
                    setUserOffline(this, 1);
                },
                MJHu: function (eD) {
                    HandleMJHu(this, eD, 1);
                    setUserOffline(this, 1);
                    var pl = getUIPlayer(1);
                    if (MjClient.rePlayVideo == -1) {
                        updateHeadUI_YNXueZhan(this, 1);
                    }
                },
                onlinePlayer: function (eD) {
                    setUserOffline(this, 1);
                },
                playerStatusChange: function (eD) {
                    setUserOffline(this, 1);
                },
                MJTing: function (eD) {
                    HandleMJTing(this, eD, 1);
                },
                chooseCards: function (msg) {
                    let off = 1, pl = getUIPlayer(off);
                    if (pl && pl.info.uid == msg.uid) {
                        MjClient.playui.showHuanPaiAnim(this, off, false);
                    }
                    if (msg.isDone) MjClient.playui.addSwapTitle(msg, this, off);
                }
            }
        },
        top: {
            _run: function () {
                cc.log("MjClient.MaxPlayerNum", MjClient.MaxPlayerNum);
                this.visible = MjClient.MaxPlayerNum != 3;
            },
            head: {
                TG_CountDown: {//托管倒计时
                    _run: function () {
                        this.visible = false;
                        this.ignoreContentAdaptWithSize(true);
                    },
                    _event: {
                        trustTip: function (msg) {
                            if (getUIPlayer(2) && getUIPlayer(2).info.uid == msg.uid) {
                                this.visible = true;
                                this.setString(msg.tipCountDown);
                                var tipCountDown = msg.tipCountDown;
                                var self = this;
                                this.schedule(function () {
                                    self.setString(tipCountDown);
                                    if (tipCountDown > 0) {
                                        tipCountDown--;
                                    } else {
                                        self.setVisible(false);
                                        self.unscheduleAllCallbacks();
                                    }
                                }, 1, cc.REPEAT_FOREVER, 0);
                            }
                        },
                        MJPut: function (msg) {
                            this.visible = false;
                        },
                        roundEnd: function () {
                            this.visible = false;
                        }
                    }
                },
                dingque: {
                    _visible: false,
                    _run: function () {
                        setWgtLayout(this, [1.5, 1.5], [4.3, -0.5], [0, 0], false, true);
                    },
                    _event: {
                        chooseCards: function (msg) {
                            if (msg.isDone) {
                                this.visible = false;
                                const tData = MjClient.data.sData.tData;
                                if (!tData.areaSelectMode.DesignatingUnwantedEnabled) return;
                                this.visible = true;
                            }
                        },
                        waitDingQue: function () {
                            this.visible = true;
                        },
                        MJSelect: function (msg) {
                            var pl = getUIPlayer(2);
                            if (pl && msg.uid == pl.info.uid) {
                                this.visible = false;
                                MjClient.playui.playSignAnimation(this.getParent(), msg.que, 2);
                            }
                        },
                        initSceneData: function () {
                            const tData = MjClient.data.sData.tData;
                            if (!tData.areaSelectMode.DesignatingUnwantedEnabled) return;
                            var pl = getUIPlayer(2);
                            if (pl && pl.que != -1 && tData.tState != TableState.roundFinish) {
                                MjClient.playui.playSignAnimation(this.getParent(), pl.que, 2, false);
                                this.visible = false;
                            }
                            else if (pl && pl.que == -1) {
                                this.visible = tData.tState == TableState.waitSelect;
                            }
                        },
                        roundEnd: function () {
                            this.visible = false;
                        }
                    }
                },
                tuoguan: {
                    _run: function () {
                        this.visible = false;
                    },
                    _event: {
                        beTrust: function (msg) {
                            if (getUIPlayer(2) && getUIPlayer(2).info.uid == msg.uid) {
                                this.visible = true;
                            }
                        },
                        cancelTrust: function (msg) {
                            if (getUIPlayer(2) && getUIPlayer(2).info.uid == msg.uid) {
                                this.visible = false;
                            }
                        }
                    }
                },
                zhuang: {
                    _run: function () {
                        this.visible = false;
                    },
                    _event: {
                        mjhand: function () {
                            showUserZhuangLogo(this, 2);
                        },
                        initSceneData: function () {
                            if (IsArrowVisible()) showUserZhuangLogo(this, 2);
                        }
                    }
                },
                chatbg: {
                    _run: function () {
                        this.getParent().zIndex = 500;
                    },
                    chattext: {
                        _event: {

                            MJChat: function (msg) {
                                this.setFontSize(30);
                                showUserChat(this, 2, msg);
                            },
                            playVoice: function (voicePath) {
                                if (MjClient.data._tempMessage) {
                                    MjClient.data._tempMessage.msg = voicePath;
                                    showUserChat(this, 2, MjClient.data._tempMessage);
                                }
                            }
                        }
                    }
                },
                _click: function (btn) {
                    showPlayerInfo(2, btn);
                },
                _event: {
                    loadWxHead: function (d) {
                        setWxHead(this, d, 2);
                    },
                    addPlayer: function (eD) {
                        showFangzhuTagIcon(this, 2);
                    },
                    removePlayer: function (eD) {
                        showFangzhuTagIcon(this, 2);
                    }
                },
                _run: function () {
                    // this.zIndex = 600;
                    showFangzhuTagIcon(this, 2);
                },
                score_bg: { _visible: false },
                name_bg: { _visible: false },
                flower_layout: { _visible: false },
                flower_zfb_layout: { _visible: false },
                tingCard: {
                    _visible: false,
                    _event: {
                        MJTing: function (eD) {
                            if (MjClient.playui.isPlayerPutCard(eD, 2)) {
                                var pl = getUIPlayer(2);
                                pl.putCardAfterTing = eD.putCardAfterTing;
                                MjClient.playui.setTingCardInfo(this, eD, 2);
                            }
                        },
                        clearCardUI: function (eD) {
                            cc.log("ready to----- clear sking ----");
                            this.visible = false;
                        },
                        moveHead: function (eD) {
                            cc.log("top---moveHead ----");
                            MjClient.playui.setTingCardInfo(this, eD, 2);
                        },
                        MJHu: function (eD) {
                            this.visible = false;
                        },
                        onlinePlayer: function (eD) {
                            cc.log("top---onlinePlayer ----");
                            //MjClient.playui.setTingCardInfo(this,eD,2);
                        },
                        initSceneData: function (eD) {
                            MjClient.playui.setTingCardInfo(this, eD, 2);
                        }
                    }
                },
                tingIcon: {
                    _visible: false,
                    _run: function () {
                        this.visible = false;
                        this.runAction(cc.sequence(cc.spawn(cc.tintTo(0.6, 255, 0, 0), cc.scaleTo(0.6, this.getScale() + 0.3)),
                            cc.spawn(cc.tintTo(0.6, 255, 255, 255), cc.scaleTo(0.6, this.getScale()))).repeatForever());
                    },
                    _event: {
                        clearCardUI: function (eD) {
                            this.visible = false;
                            cc.log("tingIcon 22 ----- clearCardUI----");
                        },
                        MJHu: function (eD) {
                            this.visible = false;
                        },
                        moveHead: function () {
                            MjClient.playui.tingIconVisible(this, 2);
                        },
                        onlinePlayer: function (eD) {
                            //MjClient.playui.tingIconVisible(this,2);
                        },
                        initSceneData: function (eD) {
                            MjClient.playui.tingIconVisible(this, 2);
                        },
                        roundEnd: function () {
                            // cc.log("end rounde------------------------222");
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
                _visible: false,
            },
            ready: {
                _layout: [
                    [0.07, 0.07],
                    [0.5, 0.5],
                    [0, 2.2]
                ],
                _run: function () {
                    GetReadyVisible(this, 2);
                },
                _event: {
                    moveHead: function () {
                        GetReadyVisible(this, -1);
                    },
                    addPlayer: function () {
                        GetReadyVisible(this, 2);
                    },
                    removePlayer: function () {
                        GetReadyVisible(this, 2);
                    },
                    onlinePlayer: function () {
                        GetReadyVisible(this, 2);
                    }
                }
            },
            stand: {
                _layout: [
                    [0, 0.07],
                    [0.5, 1],
                    [-6, -1.4]
                ],
                _visible: false,
                _event: {
                    mjhand: function () {
                        this.visible = false;
                    }
                }
            },
            up: {
                _layout: [
                    [0, 0.07],
                    [0.5, 1],
                    [6, -1.4]
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
            out2: {
                _run: function () {
                    // setWgtLayout(this, [0, 0.063], [0.5, 1], [6.8, -2.5]);
                    setWgtLayout(this, [0, 0.08], [0.55, 1], [4.1, -2.3]);
                    if (MjClient.MaxPlayerNum == 2)
                        this.x += this.height * this.scale * 5.5;
                },

                _visible: false
            },
            out1: {
                _run: function () {
                    // setWgtLayout(this, [0, 0.063], [0.5, 1], [6.8, -3.7]);
                    setWgtLayout(this, [0, 0.08], [0.55, 1], [4.1, -3.2]);
                    if (MjClient.MaxPlayerNum == 2)
                        this.x += this.height * this.scale * 5.5;
                },

                _visible: false
            },
            out0: {
                _run: function () {
                    // setWgtLayout(this, [0, 0.063], [0.5, 1], [6.8, -4.9]);
                    setWgtLayout(this, [0, 0.08], [0.55, 1], [4.1, -4.1]);
                    if (MjClient.MaxPlayerNum == 2)
                        this.x += this.height * this.scale * 5.5;
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
            huanpaizhong: {
                _visible: false,
                _layout: [[0.1, 0.1], [0.5, 0.8], [0, 0]],
                _event: {
                    waitHuanPai: function () {
                        this.setVisible(true);
                    },
                    chooseCards: function (msg) {
                        let off = 2, pl = getUIPlayer(off);
                        if (pl && pl.info.uid == msg.uid) {
                            this.setVisible(false);
                        }
                    }
                }
            },
            _event: {
                clearCardUI: function () {
                    clearCardUI(this, 2);
                },
                initSceneData: function (eD) {
                    SetUserVisible_YNXueZhan(this, 2);
                    var pl = getUIPlayer(2);
                    //换牌
                    if (pl && MjClient.playui.checkIsWaitHuanPai()) {
                        if (pl.chooseCards && pl.chooseCards.length === 0) {
                            this.getChildByName('huanpaizhong').visible = true;
                        } else {
                            MjClient.playui.showHuanPaiAnim(this, 2, true);
                        }
                        return;
                    }
                },
                addPlayer: function (eD) {
                    SetUserVisible_YNXueZhan(this, 2);
                },
                removePlayer: function (eD) {
                    SetUserVisible_YNXueZhan(this, 2);
                },
                mjhand: function (eD) {
                    //showShaiziAni_YNXueZhan(2);
                    InitUserHandUI_YNXueZhan(this, 2);
                    MjClient.playui.clearSign(2);
                },
                roundEnd: function () {
                    InitUserCoinAndName(this, 2);
                    MjClient.playui.clearSign(2);
                },
                waitPut: function () {
                    if (_isAniShow_xuezhanMJ) return;
                    DealWaitPut(this, MjClient.data.sData.tData, 2);
                },
                MJPut: function (eD) {
                    DealMJPut_YNXueZhan(this, eD, 2);
                    if (eD.uid != SelfUid()) {
                        hideTingBtn();
                    }
                    setUserOffline(this, 2);
                },
                MJChi: function (eD) {
                    // DealMJChi(this, eD, 2);
                    if (MjClient.rePlayVideo != -1) {
                        DealMJChi(this, eD, 2);
                    } else {
                        updateHeadUI_YNXueZhan(this, 2, ActionType.CHI);
                    }
                    setUserOffline(this, 2);
                },
                MJGang: function (eD) {
                    DealMJGang(this, eD, 2);
                    setUserOffline(this, 2);
                },
                MJPeng: function (eD) {
                    // DealMJPeng(this, eD, 2);
                    if (MjClient.rePlayVideo != -1) {
                        DealMJPeng(this, eD, 2);
                    } else {
                        updateHeadUI_YNXueZhan(this, 2, ActionType.PENG);
                    }
                    setUserOffline(this, 2);
                },
                MJHu: function (eD) {
                    HandleMJHu(this, eD, 2);
                    setUserOffline(this, 2);
                    var pl = getUIPlayer(2);
                    if (MjClient.rePlayVideo == -1) {
                        updateHeadUI_YNXueZhan(this, 2);
                    }
                },
                onlinePlayer: function (eD) {
                    setUserOffline(this, 2);
                },
                playerStatusChange: function (eD) {
                    setUserOffline(this, 2);
                },
                MJTing: function (eD) {
                    HandleMJTing(this, eD, 2);
                },
                chooseCards: function (msg) {
                    let off = 2, pl = getUIPlayer(off);
                    if (pl && pl.info.uid == msg.uid) {
                        MjClient.playui.showHuanPaiAnim(this, off, false);
                    }
                    if (msg.isDone) MjClient.playui.addSwapTitle(msg, this, off);
                }
            }
        },
        left: {
            _run: function () {
                cc.log("MjClient.MaxPlayerNum  left", MjClient.MaxPlayerNum);
                this.visible = MjClient.MaxPlayerNum != 2;
            },
            head: {
                TG_CountDown: {//托管倒计时
                    _run: function () {
                        this.visible = false;
                        this.ignoreContentAdaptWithSize(true);
                    },
                    _event: {
                        trustTip: function (msg) {
                            if (getUIPlayer(3) && getUIPlayer(3).info.uid == msg.uid) {
                                this.visible = true;
                                this.setString(msg.tipCountDown);
                                var tipCountDown = msg.tipCountDown;
                                var self = this;
                                this.schedule(function () {
                                    self.setString(tipCountDown);
                                    if (tipCountDown > 0) {
                                        tipCountDown--;
                                    } else {
                                        self.setVisible(false);
                                        self.unscheduleAllCallbacks();
                                    }
                                }, 1, cc.REPEAT_FOREVER, 0);
                            }
                        },
                        MJPut: function (msg) {
                            this.visible = false;
                        },
                        roundEnd: function () {
                            this.visible = false;
                        }
                    }
                },
                tuoguan: {
                    _run: function () {
                        this.visible = false;
                    },
                    _event: {
                        beTrust: function (msg) {
                            if (getUIPlayer(3) && getUIPlayer(3).info.uid == msg.uid) {
                                this.visible = true;
                            }
                        },
                        cancelTrust: function (msg) {
                            if (getUIPlayer(3) && getUIPlayer(3).info.uid == msg.uid) {
                                this.visible = false;
                            }
                        }
                    }
                },
                dingque: {
                    _visible: false,
                    _run: function () {
                        setWgtLayout(this, [1.5, 1.5], [2.5, 0], [0, 0], false, true);
                    },
                    _event: {
                        chooseCards: function (msg) {
                            if (msg.isDone) {
                                this.visible = false;
                                const tData = MjClient.data.sData.tData;
                                if (!tData.areaSelectMode.DesignatingUnwantedEnabled) return;
                                this.visible = true;
                            }
                        },
                        waitDingQue: function () {
                            this.visible = true;
                        },
                        MJSelect: function (msg) {
                            var pl = getUIPlayer(3);
                            if (pl && msg.uid == pl.info.uid) {
                                this.visible = false;
                                MjClient.playui.playSignAnimation(this.getParent(), msg.que, 3);
                            }
                        },
                        initSceneData: function () {
                            const tData = MjClient.data.sData.tData;
                            if (!tData.areaSelectMode.DesignatingUnwantedEnabled) return;
                            var pl = getUIPlayer(3);
                            if (pl && pl.que != -1 && tData.tState != TableState.roundFinish) {
                                MjClient.playui.playSignAnimation(this.getParent(), pl.que, 3, false);
                                this.visible = false;
                            }
                            else if (pl && pl.que == -1) {
                                this.visible = tData.tState == TableState.waitSelect;
                            }
                        },
                        roundEnd: function () {
                            this.visible = false;
                        }
                    }
                },
                zhuang: {
                    _run: function () {
                        this.visible = false;
                    },
                    _event: {
                        mjhand: function () {
                            showUserZhuangLogo(this, 3);
                        },
                        initSceneData: function () {
                            if (IsArrowVisible()) showUserZhuangLogo(this, 3);
                        }
                    }
                },
                chatbg: {
                    _run: function () {
                        this.getParent().zIndex = 500;
                    },
                    chattext: {
                        _event: {

                            MJChat: function (msg) {
                                this.setFontSize(30);
                                showUserChat(this, 3, msg);
                            },
                            playVoice: function (voicePath) {
                                MjClient.data._tempMessage.msg = voicePath;
                                showUserChat(this, 3, MjClient.data._tempMessage);
                            }
                        }
                    }
                },
                _click: function (btn) {
                    showPlayerInfo(3, btn);
                },
                _event: {
                    loadWxHead: function (d) {
                        setWxHead(this, d, 3);
                    },
                    addPlayer: function (eD) {
                        showFangzhuTagIcon(this, 3);
                    },
                    removePlayer: function (eD) {
                        showFangzhuTagIcon(this, 3);
                    }
                },
                _run: function () {
                    // this.zIndex = 600;
                    showFangzhuTagIcon(this, 3);
                },
                score_bg: { _visible: false },
                name_bg: { _visible: false },
                flower_layout: { _visible: false },
                flower_zfb_layout: { _visible: false },
                tingCard: {
                    _visible: false,
                    _event: {
                        MJTing: function (eD) {
                            if (MjClient.playui.isPlayerPutCard(eD, 3)) {
                                var pl = getUIPlayer(3);
                                pl.putCardAfterTing = eD.putCardAfterTing;
                                MjClient.playui.setTingCardInfo(this, eD, 3);
                            }
                        },
                        clearCardUI: function (eD) {
                            cc.log("ready to----- clear sking ----");
                            this.visible = false;
                        },
                        MJHu: function (eD) {
                            this.visible = false;
                        },
                        onlinePlayer: function (eD) {
                            //MjClient.playui.setTingCardInfo(this,eD,3);
                        },
                        initSceneData: function (eD) {
                            MjClient.playui.setTingCardInfo(this, eD, 3);
                        }
                    }
                },
                tingIcon: {
                    _visible: false,
                    _run: function () {
                        this.visible = false;
                        this.runAction(cc.sequence(cc.spawn(cc.tintTo(0.6, 255, 0, 0), cc.scaleTo(0.6, this.getScale() + 0.3)),
                            cc.spawn(cc.tintTo(0.6, 255, 255, 255), cc.scaleTo(0.6, this.getScale()))).repeatForever());
                    },
                    _event: {
                        clearCardUI: function (eD) {
                            this.visible = false;
                            cc.log("tingIcon 333 ----- clearCardUI ----");
                        },
                        MJHu: function (eD) {
                            this.visible = false;
                        },
                        moveHead: function () {
                            MjClient.playui.tingIconVisible(this, 3);
                        },
                        onlinePlayer: function (eD) {
                            //MjClient.playui.tingIconVisible(this,3);
                        },
                        initSceneData: function (eD) {
                            MjClient.playui.tingIconVisible(this, 3);
                        },
                        roundEnd: function () {
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
                _visible: false,
            },
            ready: {
                _layout: [
                    [0.07, 0.07],
                    [0.5, 0.5],
                    [-2, 0.4]
                ],
                _run: function () {
                    GetReadyVisible(this, 3);
                },
                _event: {
                    moveHead: function () {
                        GetReadyVisible(this, -1);
                    },
                    addPlayer: function () {
                        GetReadyVisible(this, 3);
                    },
                    removePlayer: function () {
                        GetReadyVisible(this, 3);
                    },
                    onlinePlayer: function () {
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
                    [0, 0.6],
                    [5.2, 3]
                ],
                _visible: false,
                _event: {
                    mjhand: function () {
                        this.visible = false;
                    }
                }
            },
            out2: {
                _run: function () {
                    // setWgtLayout(this, [0, 0.043], [0.05, 0.5], [4.5, 4.8]);
                    setWgtLayout(this, [0, 0.055], [0.065, 0.5], [2.6, 4.2]);
                    // if (MjClient.MaxPlayerNum == 3)
                    //     this.y += this.height * this.scale * 2;
                },

                _visible: false
            },
            out1: {
                _run: function () {
                    // setWgtLayout(this, [0, 0.043], [0.05, 0.5], [5.8, 4.8]);
                    setWgtLayout(this, [0, 0.055], [0.065, 0.5], [3.9, 4.2]);
                    // if (MjClient.MaxPlayerNum == 3)
                    //     this.y += this.height * this.scale * 2;
                },
                _visible: false
            },
            out0: {
                _run: function () {
                    // setWgtLayout(this, [0, 0.043], [0.05, 0.5], [7.2, 4.8]);
                    setWgtLayout(this, [0, 0.055], [0.065, 0.5], [5.2, 4.2]);
                    // if (MjClient.MaxPlayerNum == 3)
                    //     this.y += this.height * this.scale * 2;
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
            huanpaizhong: {
                _visible: false,
                _layout: [[0.1, 0.1], [0.2, 0.5], [0, 0]],
                _event: {
                    waitHuanPai: function () {
                        this.setVisible(true);
                    },
                    chooseCards: function (msg) {
                        let off = 3, pl = getUIPlayer(off);
                        if (pl && pl.info.uid == msg.uid) {
                            this.setVisible(false);
                        }
                    }
                }
            },
            _event: {
                clearCardUI: function () {
                    clearCardUI(this, 3);
                },
                initSceneData: function (eD) {
                    SetUserVisible_YNXueZhan(this, 3);
                    var pl = getUIPlayer(3);
                    //换牌
                    if (pl && MjClient.playui.checkIsWaitHuanPai()) {
                        if (pl.chooseCards && pl.chooseCards.length === 0) {
                            this.getChildByName('huanpaizhong').visible = true;
                        } else {
                            MjClient.playui.showHuanPaiAnim(this, 3, true);
                        }
                        return;
                    }
                },
                addPlayer: function (eD) {
                    SetUserVisible_YNXueZhan(this, 3);
                },
                removePlayer: function (eD) {
                    SetUserVisible_YNXueZhan(this, 3);
                },
                mjhand: function (eD) {
                    //showShaiziAni_YNXueZhan(3);
                    InitUserHandUI_YNXueZhan(this, 3);
                    MjClient.playui.clearSign(3);
                },
                roundEnd: function () {
                    InitUserCoinAndName(this, 3);
                    MjClient.playui.clearSign(3);
                },
                waitPut: function () {
                    if (_isAniShow_xuezhanMJ) return;
                    DealWaitPut(this, MjClient.data.sData.tData, 3);
                },
                MJPut: function (eD) {
                    DealMJPut_YNXueZhan(this, eD, 3);
                    if (eD.uid != SelfUid()) {
                        hideTingBtn();
                    }
                    setUserOffline(this, 3);
                },
                MJChi: function (eD) {
                    // DealMJChi(this, eD, 3);
                    if (MjClient.rePlayVideo != -1) {
                        DealMJChi(this, eD, 3);
                    } else {
                        updateHeadUI_YNXueZhan(this, 3, ActionType.CHI);
                    }
                    setUserOffline(this, 3);
                },
                MJGang: function (eD) {
                    DealMJGang(this, eD, 3);
                    setUserOffline(this, 3);
                },
                MJPeng: function (eD) {
                    // DealMJPeng(this, eD, 3);
                    if (MjClient.rePlayVideo != -1) {
                        DealMJPeng(this, eD, 3);
                    } else {
                        updateHeadUI_YNXueZhan(this, 3, ActionType.PENG);
                    }
                    setUserOffline(this, 3);
                },
                MJHu: function (eD) {
                    HandleMJHu(this, eD, 3);
                    setUserOffline(this, 3);
                    var pl = getUIPlayer(3);
                    if (MjClient.rePlayVideo == -1) {
                        updateHeadUI_YNXueZhan(this, 3);
                    }
                },
                onlinePlayer: function (eD) {
                    setUserOffline(this, 3);
                },
                playerStatusChange: function (eD) {
                    setUserOffline(this, 3);
                },
                MJTing: function (eD) {
                    HandleMJTing(this, eD, 3);
                },
                chooseCards: function (msg) {
                    let off = 3, pl = getUIPlayer(off);
                    if (pl && pl.info.uid == msg.uid) {
                        MjClient.playui.showHuanPaiAnim(this, off, false);
                    }
                    if (msg.isDone) MjClient.playui.addSwapTitle(msg, this, off);
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
                bg_img: {
                    _run: function () {
                        var _Image_light_scale = this.getScale();

                        var a = cc.scaleTo(0.5, _Image_light_scale * 1.0);
                        var aa = cc.fadeIn(0.5);
                        var a1 = cc.scaleTo(1, _Image_light_scale * 1.3);
                        var a2 = cc.fadeOut(1);
                        var a3 = cc.callFunc(function () {
                            //this.setOpacity(255);
                            this.setScale(_Image_light_scale * 0.95);
                        }.bind(this));

                        this.runAction(cc.sequence(cc.spawn(a, aa), cc.spawn(a1, a2).easing(cc.easeCubicActionOut()), a3, cc.delayTime(0.2)).repeatForever());

                    }

                },
                _touch: function (btn, eT) {
                    if (eT == 2) MJChiCardchange(btn.tag);
                },
                bgimg: {
                    _run: function () {
                        this.zIndex = -1;
                    }
                },
                bgground: {
                    _run: function () {
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
                _touch: function (btn, eT) {
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
                _touch: function (btn, eT) {
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
                bg_img: {
                    _run: function () {
                        var _Image_light_scale = this.getScale();

                        var a = cc.scaleTo(0.5, _Image_light_scale * 1.0);
                        var aa = cc.fadeIn(0.5);
                        var a1 = cc.scaleTo(1, _Image_light_scale * 1.3);
                        var a2 = cc.fadeOut(1);
                        var a3 = cc.callFunc(function () {
                            //this.setOpacity(255);
                            this.setScale(_Image_light_scale * 0.95);
                        }.bind(this));

                        this.runAction(cc.sequence(cc.spawn(a, aa), cc.spawn(a1, a2).easing(cc.easeCubicActionOut()), a3, cc.delayTime(0.2)).repeatForever());

                    }

                },
                _touch: function (btn, eT) {
                    if (eT == 2) {
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
                        var tingCards = getCheckTingHuCards(currentCard, pl.mjhand);
                        setCurrentTingNum(tingCards);
                    }
                }
            },
            noTing: {
                _visible: false,
                _layout: [
                    [0, 0.1],
                    [0.5, 0],
                    [4.6, 2.5]
                ],
                _touch: function (btn, eT) {
                    if (eT == 2) {
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
                bg_img: {
                    _run: function () {
                        var _Image_light_scale = this.getScale();

                        var a = cc.scaleTo(0.5, _Image_light_scale * 1.0);
                        var aa = cc.fadeIn(0.5);
                        var a1 = cc.scaleTo(1, _Image_light_scale * 1.3);
                        var a2 = cc.fadeOut(1);
                        var a3 = cc.callFunc(function () {
                            //this.setOpacity(255);
                            this.setScale(_Image_light_scale * 0.95);
                        }.bind(this));

                        this.runAction(cc.sequence(cc.spawn(a, aa), cc.spawn(a1, a2).easing(cc.easeCubicActionOut()), a3, cc.delayTime(0.2)).repeatForever());

                    }

                },
                _touch: function (btn, eT) {
                    cc.log(">>>> lf，点击碰按钮");
                    COMMON_UI.clearShowCurrentEatCards();
                    if (eT == 2) MJPengToServer();

                },
                bgimg: {
                    _run: function () {
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
                bg_img: {
                    _run: function () {
                        var _Image_light_scale = this.getScale();

                        var a = cc.scaleTo(0.5, _Image_light_scale * 1.0);
                        var aa = cc.fadeIn(0.5);
                        var a1 = cc.scaleTo(1, _Image_light_scale * 1.3);
                        var a2 = cc.fadeOut(1);
                        var a3 = cc.callFunc(function () {
                            //this.setOpacity(255);
                            this.setScale(_Image_light_scale * 0.95);
                        }.bind(this));

                        this.runAction(cc.sequence(cc.spawn(a, aa), cc.spawn(a1, a2).easing(cc.easeCubicActionOut()), a3, cc.delayTime(0.2)).repeatForever());

                    }

                },
                card1: {},
                _touch: function (btn, eT) {
                    if (eT == 2) MJGangCardchange(btn.tag);
                },
                bgimg: {
                    _run: function () {
                        this.zIndex = -1;
                    }
                },
                bgground: {
                    _run: function () {
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
                _touch: function (btn, eT) {
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
                _touch: function (btn, eT) {
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
                _touch: function (btn, eT) {
                    if (eT == 2) {
                        MjClient.MJPass2NetForxuezhanMJ();
                    }
                },
                bgimg: {
                    _run: function () {
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
                bg_img: {
                    _run: function () {
                        var _Image_light_scale = this.getScale();

                        var a = cc.scaleTo(0.5, _Image_light_scale * 1.0);
                        var aa = cc.fadeIn(0.5);
                        var a1 = cc.scaleTo(1, _Image_light_scale * 1.3);
                        var a2 = cc.fadeOut(1);
                        var a3 = cc.callFunc(function () {
                            //this.setOpacity(255);
                            this.setScale(_Image_light_scale * 0.95);
                        }.bind(this));

                        this.runAction(cc.sequence(cc.spawn(a, aa), cc.spawn(a1, a2).easing(cc.easeCubicActionOut()), a3, cc.delayTime(0.2)).repeatForever());

                    }

                },
                _touch: function (btn, eT) {
                    if (eT == 2) MJHuToServer();
                },
                bgimg: {
                    _run: function () {
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
                _touch: function (btn, eT) {
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
                _visible: true,
                changeuibg: {
                    _layout: [
                        [0.36, 0.36],
                        [0.5, 0.15],
                        [0, 0]
                    ],
                    _run: function () {
                        this.visible = false;
                        this.getChildByName("card").visible = false;
                        this.chiTouch = function (btn, et) {
                            if (et == 2) {
                                if (btn.name.localeCompare("card3") < 0) {
                                    MJChiToServer(0);
                                }
                                else if (btn.name.localeCompare("card6") < 0) {
                                    MJChiToServer(1);
                                }
                                else {
                                    MJChiToServer(2);
                                }
                            }
                        };
                        this.gangTouch = function (btn, et) {
                            if (et == 2)
                                MJGangToServer(btn.tag);
                        };
                    },
                    guobg: {
                        guo: {
                            _touch: function (btn, eT) {
                                if (eT == 2) MjClient.MJPass2NetForxuezhanMJ();
                            }
                        },
                        fanhui: {
                            _touch: function (btn, et) {
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
                clearCardUI: function () {
                    //add by sking
                    cc.log("ting yu no ting hide --------by sking");
                    MjClient.playui.EatVisibleCheck();
                    hideTingBtn();
                },
                MJPass: function (eD) {
                    cc.log("HHH :，MJPass------");
                    setSkipHuState();
                    setSkipPengState(); // 开启 过碰 机制
                    MjClient.playui.EatVisibleCheck();
                },
                mjhand: function (eD) {
                    cc.log("HHH :，mjhand------");
                    //MjClient.playui.EatVisibleCheck();
                },
                waitPut: function () {
                    cc.log("HHH :，waitPut------");
                    MjClient.playui.EatVisibleCheck();
                    var pl = getUIPlayer(0);
                    if (typeof (pl.que) != "undefined" && pl.que != -1 && pl.huCards.length <= 0) {
                        if (MjClient.majiang.hasquesecard(pl.mjhand, pl.que)) {
                            COMMON_UI.willHuShowArrow();
                        }
                    }
                },
                MJPut: function (eD) {
                    cc.log("HHH :，MJPut------");
                    MjClient.playui.EatVisibleCheck();
                },
                MJPeng: function (eD) {
                    cc.log("HHH :，MJPeng------");
                    MjClient.playui.EatVisibleCheck();
                },
                MJChi: function (eD) {
                    cc.log("HHH :，MJChi------");
                    MjClient.playui.EatVisibleCheck();
                },
                MJGang: function (eD) {
                    cc.log("HHH :，MJGang------");
                    MjClient.playui.EatVisibleCheck();
                },
                MJTing: function (eD) {
                    cc.log("HHH :，MJTing------");
                    hideTingBtn();
                    isCheckedTing = false;
                },
                roundEnd: function (eD) {
                    cc.log("HHH :，roundEnd------");
                    MjClient.playui.EatVisibleCheck();
                },
                initSceneData: function (eD) {
                    function delayExe() {
                        MjClient.playui.EatVisibleCheck();
                    }
                    this.runAction(cc.sequence(cc.DelayTime(0.1), cc.callFunc(delayExe)));
                }
            }
        },
        chat_btn: {
            _layout: [
                [0.08, 0.08],
                [0.97, 0.37],
                [0, 0]
            ],
            _click: function () {
                var chatlayer = new ChatLayer();
                //chatlayer.setScale(1.2);
                MjClient.Scene.addChild(chatlayer);
            }
        },
        voice_btn: {
            _layout: [
                [0.08, 0.08],
                [0.97, 0.46],
                [0, 0]
            ],
            _run: function () {
                initVoiceData();
                cc.eventManager.addListener(getTouchListener(), this);
                if (MjClient.isShenhe) this.visible = false;
            },
            _touch: function (btn, eT) {
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
                cancelRecord: function () {
                    MjClient.native.HelloOC("cancelRecord !!!");
                },
                uploadRecord: function (filePath) {
                    if (filePath) {
                        MjClient.native.HelloOC("upload voice file");
                        MjClient.native.UploadFile(filePath, MjClient.remoteCfg.voiceUrl, "sendVoice");
                    } else {
                        MjClient.native.HelloOC("No voice file update");
                    }
                },
                sendVoice: function (fullFilePath) {
                    if (!fullFilePath) {
                        cc.log("sendVoice No fileName");
                        return;
                    }

                    var getFileName = /[^\/]+$/;
                    var extensionName = getFileName.exec(fullFilePath);
                    var fileName = extensionName[extensionName.length - 1];
                    cc.log("sfileName is:" + fileName);

                    MjClient.gamenet.request("pkroom.handler.tableMsg", {
                        cmd: "downAndPlayVoice",
                        uid: SelfUid(),
                        type: 3,
                        msg: fileName,
                        num: MjClient.data._JiaheTempTime//录音时长
                    });
                    MjClient.native.HelloOC("download file");
                },
                downAndPlayVoice: function (msg) {
                    MjClient.native.HelloOC("downloadPlayVoice ok");
                    MjClient.data._tempMessage = msg;
                    MjClient.native.HelloOC("mas is" + JSON.stringify(msg));
                    downAndPlayVoice(msg.uid, msg.msg);
                }
            }
        },
        block_tuoguan: {
            _layout: [
                [1, 1],
                [0.5, 0.5],
                [0, 0],
                true
            ],
            _run: function () {
                this.visible = false;
            },
            btn_tuoguan: {
                _touch: function (btn, eT) {
                    if (eT == 2) {
                        MjClient.gamenet.request("pkroom.handler.tableMsg", { cmd: "cancelTrust" }, function (rtn) {
                            btn.getParent().setVisible(false);
                        });
                    }
                }
            },
            _event: {
                beTrust: function (msg) {
                    cc.log("wxd........beTrust......." + JSON.stringify(msg));
                    if (getUIPlayer(0) && getUIPlayer(0).info.uid == msg.uid) {
                        if (MjClient.movingCard) {
                            MjClient.movingCard.setTouchEnabled(false);
                            MjClient.movingCard.setScale(cardBeginScale);
                            MjClient.movingCard.setTouchEnabled(true);
                        }
                        this.visible = true;
                    }
                },
                initSceneData: function (msg) {
                    // var pl = getUIPlayer(0);
                    // if(pl.trust){
                    //     this.visible = true;
                    // }else {
                    //     this.visible = false;
                    // }
                }
            }
        },
        duty_btn: {
            _layout: [
                [0.09, 0.09],
                [0.95, 0.4],
                [0, 3.7]
            ],
            _run: function () {
                this.setVisible(MjClient.data.sData.tData.fieldId ? true : false);
                ShowDayTaskTips(this, "left")
            },
            _click: function () {
                MjClient.Scene.addChild(new GoldTaskLayer());
            },
            Image_hongdian: {
                _run: function () {
                    this.visible = MjClient._GoldFuli;
                },
                _event: {
                    refresh_mission: function () {
                        this.visible = MjClient._GoldFuli;
                    }
                }
            }
        },
        tuoguan_btn: {
            _layout: [
                [0.09, 0.09],
                [0.95, 0.3],
                [0, 3.7]
            ],
            _run: function () {
                this.setVisible(MjClient.data.sData.tData.fieldId ? true : false);

            },
            _click: function () {
                MjClient.gamenet.request("pkroom.handler.tableMsg", { cmd: "beTrust" });
            },
            _event: {
                beTrust: function (msg) {
                    if (msg.uid == SelfUid()) {
                        this.enabled = false;
                    }
                },
                cancelTrust: function (msg) {
                    if (msg.uid == SelfUid()) {
                        this.enabled = true;
                    }
                },
                initSceneData: function (msg) {
                    var pl = getUIPlayer(0);
                    if (pl.trust) {
                        this.enabled = false;
                    } else {
                        this.enabled = true;
                    }
                },
            },
        },
        block_load: {
            _visible: false
        }
    },
    _downNode: null,
    _rightNode: null,
    _topNode: null,
    _leftNode: null,
    _btnPutCard: null,
    ctor: function () {
        this._super();
        this.srcMaxPlayerNum = MjClient.MaxPlayerNum;
        MjClient.MaxPlayerNum = Number(MjClient.data.sData.tData.maxPlayer);
        var playui = ccs.load("Play_XueZhanMahjong.json");
        playMusic("bgFight");
        this._downNode = playui.node.getChildByName("down");
        this._rightNode = playui.node.getChildByName("right");
        this._topNode = playui.node.getChildByName("top");
        this._leftNode = playui.node.getChildByName("left");
        MjClient.playui = this;
        this._btnPutCard = playui.node.getChildByName("BtnPutCard");
        this._tingCardsNode = this._downNode.getChildByName("tingCardsNode");
        this._tingCardNumNode = this._downNode.getChildByName("tingCardNumNode");
        MjClient.playui._AniNode = playui.node.getChildByName("eat");
        BindUiAndLogic(playui.node, this.jsBind);
        // 添加光晕动画
        COMMON_UI.addAniEatCardsBtn();
        this.addChild(playui.node);
        cc.log("====================MjClient.MaxPlayerNum =" + JSON.stringify(MjClient.data.sData.tData));

        MjClient.lastMJTick = Date.now();
        this.runAction(cc.repeatForever(cc.sequence(cc.callFunc(function () {
            if (MjClient.game_on_show) MjClient.tickGame(0);
        }), cc.delayTime(7))));

        changeMJBg(this, getCurrentMJBgType());
        //初始化其他功能
        initSceneFunc();

        //东南西北转盘初始化
        COMMON_UI3D.InitSetArrowbk();

        // 在亲友圈房间中添加邀请亲友圈牌有一起对局
        addClubYaoqingBtn();


        var playerNodeArr = [];
        var nodeNameArr = ["down", "right", "top", "left"];
        this.DefaultNodeNameArray = nodeNameArr;
        if (MjClient.MaxPlayerNum == 3) {
            nodeNameArr = ["down", "right", "left"];
        } else if (MjClient.MaxPlayerNum == 2) {
            nodeNameArr = ["down", "top"];
        }
        for (var k = 0; k < nodeNameArr.length; k++) {
            playerNodeArr.push(playui.node.getChildByName(nodeNameArr[k]));
        }
        this.playerNodeArr = playerNodeArr;

        return true;
    },
    //定缺界面
    showDingQueLayer: function () {
        const tData = MjClient.data.sData.tData;
        let pl = getUIPlayer(0);
        if (!pl) return;
        if (tData.tState == TableState.waitSelect && tData.areaSelectMode.DesignatingUnwantedEnabled) {
            if (typeof (pl.que) == "undefined" || pl.que == -1) {
                var layer = new DingQueLayer(function () {
                    //弹窗等待
                }, pl);
                layer.setName("dingque");
                MjClient.playui.addChild(layer, 99);
                if (MjClient.webViewLayer != null) {
                    MjClient.webViewLayer.close();
                }
            }
        }
    },
    //换三张扔牌效果
    showHuanPaiAnim: function (node, off, reset = false) {
        let delCardNode = [];
        //是否删除牌
        if ((off == 0 && !reset) || off != 0) {
            if (off != 0 && MjClient.rePlayVideo == -1) {
                const count = MjClient.data.sData.tData.areaSelectMode.SwappingTiles || 3;
                for (let _i = 0; _i < count; _i++) {
                    const item = node.getChildByName(MjClient.rePlayVideo != -1 ? 'mjhand_replay' : 'standPri');
                    if (item) {
                        delCardNode.push(item.getPosition());
                        item.removeFromParent(true);
                    }
                }
            } else {
                const pl = getUIPlayer(off);
                if (pl && pl.chooseCards) {
                    let children = node.children, cList = pl.chooseCards.concat([]);
                    var handCard = node.getChildByName('stand');
                    for (var k = 0; k < children.length && cList.length > 0; k++) {
                        var cardNode = children[k], _indx = cList.indexOf(cardNode.tag);
                        if (cardNode.name === 'mjhand' && cardNode.y > handCard.getPositionY() && _indx > -1) {
                            delCardNode.push(cardNode.getPosition());
                            cardNode.removeFromParent(true);
                            cList.splice(_indx, 1);
                        }
                    }
                    for (let _i = 0; _i < cList.length; _i++) {
                        const cd = cList[_i];
                        for (let _j = 0; _j < node.children.length; _j++) {
                            const pai = node.children[_j];
                            if (pai.name == 'mjhand' && pai.tag == cd) {
                                delCardNode.push(pai.getPosition());
                                pai.removeFromParent(true);
                                break;
                            }
                        }
                    }
                }
            }
        }
        //扔牌
        const preNode = node.getChildByName('down');
        if (delCardNode.length == 0) {
            const pPos = preNode.getPosition();
            const count1 = MjClient.data.sData.tData.areaSelectMode.SwappingTiles || 3;
            for (let _i = 0; _i < count1; _i++) {
                delCardNode.push(cc.p(pPos.x + 100 * _i, pPos.y));
            }
        }
        for (let _k = 0; _k < delCardNode.length; _k++) {
            const aniPos = delCardNode[_k];
            let n = preNode.clone();
            if (n) {
                n.setPosition(aniPos);
                delCardNode[_k] = n;
                node.addChild(n);
                n.visible = true;
            }
        }
        const endPos = node.parent.getChildByName("arrowbk").getPosition();
        for (let _k = 0; _k < delCardNode.length; _k++) {
            let aniNode = delCardNode[_k];
            aniNode.runAction(cc.sequence(cc.moveTo(0.5, endPos).easing(cc.easeExponentialOut(0.5)), cc.callFunc(() => { aniNode.removeFromParent(true); })))
        }
        //理牌
        setTimeout(() => {
            MjClient.playui.CardLayoutRestore(node, off);
        }, 600);
    },
    //换三张 换回的牌  插牌
    addSwapTitle: function (msg, node, off) {
        const pl = getUIPlayer(off);
        if (!pl) return;
        off == 0 && (MjClient.playui.jsBind.block_load._node.visible = true);
        setTimeout(() => {
            if (off == 0 || MjClient.rePlayVideo != -1) {
                let cards = msg.cards[pl.info.uid] || [],
                    cdNode = node.children.filter(ns => ns.getName() == (off == 0 ? "mjhand" : 'mjhand_replay'));
                let lastCx = cdNode.concat([]);
                lastCx.sort((a, b) => b.x - a.x);
                let lastCy = cdNode.concat([]);
                lastCy.sort((a, b) => a.y - b.y);
                for (var i = 0; i < cards.length; i++) {
                    const cD = getNewCard(node, off == 0 ? "stand" : 'up', off == 0 ? "mjhand" : 'mjhand_replay', cards[i], off);
                    if (off == 0 || off == 2) {
                        let lpos = lastCx[0].y;
                        cD.setPosition(lastCx[0].x + (lastCx[0].x - lastCx[1].x) * (i + 1), lpos + (off == 0 ? 20 : 0));
                        if (off == 0) {
                            cD.runAction(cc.sequence(cc.moveTo(1, cc.p(cD.x, lpos))));
                        }
                    } else {
                        cD.setPosition(lastCy[0].x, lastCy[0].y - (lastCy[1].y - lastCy[0].y));
                    }
                }
            } else {
                const count = MjClient.data.sData.tData.areaSelectMode.SwappingTiles || 3;
                for (var i = 0; i < count; i++) {
                    getNewCard(node, "stand", "standPri");
                }
            }
            setTimeout(() => {
                MjClient.playui.CardLayoutRestore(node, off);
                off == 0 && (MjClient.playui.jsBind.block_load._node.visible = false);
            }, off == 0 ? 1500 : 0);
        }, 600);
    },

    onExit: function () {
        this._super();
        MjClient.MaxPlayerNum = this.srcMaxPlayerNum;
    },

    setPlayerHuaValueShow: function (parentNode) {
        var tData = MjClient.data.sData.tData;
        var isShow = false;

        parentNode.getChildByName("huaIcon").visible = isShow;
        parentNode.getChildByName("huaX").visible = isShow;
        parentNode.getChildByName("huaCount").visible = isShow;
    },

    /*
     判断当前是否可以出牌，add by sking
     */
    isCanPutCard: function () {

        var bPut = false;
        var downNode = MjClient.playui._downNode;
        var standUI = downNode.getChildByName("stand");
        var children = downNode.children;
        for (var i = 0; i < children.length; i++) {
            if (children[i].name == "mjhand") {
                if (children[i].y > standUI.y + 10) {
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
    tingIconVisible: function (node, off) {
        var pl = getUIPlayer(off)
        if (pl == null) return;
        var tData = MjClient.data.sData.tData;

        if (pl && (pl.mjState == TableState.isReady || pl.mjState == TableState.roundFinish)) {
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
        } else {
            if (pl != null) {
                if (pl.isTing && pl.huCards.length <= 0) node.visible = true;

                // 有起手听牌检查，这里应该可以不用了
                // if (off == 0)
                // {
                //     var tingSet = calTingSet(pl.mjhand);
                //     setTingCards_showCount(this._tingCardsNode,tingSet);
                // }
            }
        }
        return node.visible;
    },
    /*
        设置听牌之后打牌的花色, by sking
    */
    setTingCardInfo: function (node, eD, off) {
        /*
            游戏准备
         */
        cc.log("%%%%%%%%%%%%%%%%setCard%%%%%%%%%%%%%%%%%%% = " + off);
        var pl = getUIPlayer(off);
        if (pl == null) return;
        var tData = MjClient.data.sData.tData;
        cc.log("(((((((((((( set card))))))))))))))))) == pl.mjState  " + pl.mjState);
        if (pl.mjState == TableState.isReady || pl.mjState == TableState.roundFinish) {
            cc.log("*********set ting card info***************111");
            node.visible = false;
            return;
        }

        /*
            判断是否拿到了听之后的那张牌
         */
        var cd = -1;

        if (pl.isTing) {
            if (pl.putCardAfterTing) {
                cd = pl.putCardAfterTing;
            } else {
                return;
            }
        } else {
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
        node.visible = false;
        node.removeAllChildren();
        node.addChild(imgNode);

        // 贴在麻将上面可变的图
        var path = "playing/MJ/"
        var imgName = "";
        if (cd < 30) {
            //条，筒，万
            imgName = imgNames[Math.floor(cd / 10)] + cd % 10;
        }
        else if (cd <= 91) {   //东南西北中发白
            imgName = imgNames[Math.floor(cd / 10)];//东南西北中发白
        }
        else if (cd <= 181) {
            imgName = "flower_" + cd;
        }

        //node.tag = cd;
        var callback = function () {
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
    isPlayerPutCard: function (eD, off) {
        // var tData = MjClient.data.sData.tData;
        // var uids = tData.uids;
        // var idx = uids.indexOf(eD.uid);
        // var selfidx = uids.indexOf(SelfUid());
        // var offidx = (idx-selfidx+4)%4;

        var _UIOff = getUiOffByUid(eD.uid)

        if (_UIOff == off) {
            return true;
        }
        else {
            return false;
        }
    },
    raiseRecommendedHands: function (downNode) {
        var player = getUIPlayer(0);
        if (!player) return;
        var card = MjClient.majiang.getRecommendHuanPaiArr(player.mjhand, MjClient.data.sData.tData.areaSelectMode.SwappingTiles || 3);
        var handModelCard = downNode.getChildByName('stand');
        var children = downNode.children;
        for (var i = 0; i < children.length; i++) {
            var cardNode = children[i], _indx = card.indexOf(cardNode.tag);
            if (cardNode.name === 'mjhand' &&  _indx > -1 && this._huanPaiUpNum < this.HuanPaiCount()) {
                cardNode.y = handModelCard.y + 20;
                MjClient.selectedCard = cardNode;
                this._huanPaiUpNum++;
                card.splice(_indx, 1);
            }
        }
        postEvent('canSwapBtn', true);
    },
    checkIsWaitHuanPai: function () {
        var tData = MjClient.data.sData.tData;
        return tData.tState === TableState.waitChooseCard;
    },
    HuanPaiCount: function () {
        var tData = MjClient.data.sData.tData;
        return tData.areaSelectMode.SwappingTiles || 3;
    },

    getUpHandCardNode: function () {
        var res = [];
        var playerNode = this.playerNodeArr[0];
        var children = playerNode.children;
        var handCard = playerNode.getChildByName('stand');
        for (var k = 0; k < children.length; k++) {
            var cardNode = children[k];
            if (cardNode.name === 'mjhand' && cardNode.y > handCard.getPositionY()) {
                res.push(cardNode.tag);
            }
        }
        return res;
    },

    checkWhenTouchBegan: function (cardNode) {
        var player = getUIPlayer(0);
        // 换牌前
        if (this.checkIsWaitHuanPai() && player.chooseCards && player.chooseCards.length > 0) return true;
        if (this.checkIsWaitHuanPai()) {
            return false;
        }
        if (MjClient.movingCard !== null && MjClient.movingCard != cardNode) {
            return true;
        }
        var handCount = this.getCardNodeCountByName(cardNode.getParent(), 'mjhand');
        if (!(handCount % 3 == 2 && IsTurnToMe() || handCount % 3 == 1 && !IsTurnToMe())) {
            return true;
        }
        // 自动摸打
        if (player.tPutCard && IsTurnToMe()) {
            if (!MjClient.Scene.ToastNodeArray || MjClient.Scene.ToastNodeArray.length == 0) {
                MjClient.showToast("出牌请先取消自动摸打");
            }
            return true;
        }
        //必须先打定缺牌
        if (player && player.que > -1 && MjClient.QueMenCounts > 0) {
            return Math.floor(cardNode.tag / 10) != player.que;
        }
    },
    getCardNodeCountByName: function (node, typeName) {
        var count = 0;
        var children = node.children;
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            if (child.getName() == typeName) {
                count++;
            }
        }
        return count;
    },
    SetTouchCardHandler: function (templateHandCard, handCard) {
        var self = this;

        handCard.addTouchEventListener(function (cardNode, eventType) {
            const canTouch = MjClient.playui.checkWhenTouchBegan(cardNode);
            if (canTouch) return;
            if (eventType === ccui.Widget.TOUCH_BEGAN) {
                self.handlerWhenCardTouchBegan(cardNode);
                playEffect("cardClick");
                MjClient.movingCard = cardNode;
                MjClient.selectedCard = cardNode;
                self.cardBeginPos = cardNode.getPosition();
                self.cardBeginScale = cardNode.getScale();
                self.cardBeginZIndex = cardNode.zIndex;
                self.cardIsPut = true;
                self.cardValidMoved = false;
                handCard.zIndex = self.cardBeginZIndex + 100;
            } else if (eventType === ccui.Widget.TOUCH_MOVED) {
                if (MjClient.movingCard == null || !IsTurnToMe()) {
                    return;
                }

                var movePos = cardNode.getTouchMovePosition();
                movePos.x = movePos.x < 0 ? 0 : movePos.x > MjClient.size.width ? MjClient.size.width : movePos.x;
                movePos.y = movePos.y < 0 ? 0 : movePos.y > MjClient.size.height ? MjClient.size.height : movePos.y;
                var dis_y = movePos.y - self.cardBeginPos.y;

                if (!self.cardValidMoved && dis_y < templateHandCard.height / 2) {
                    cardNode.setPosition(self.cardBeginPos);
                } else {
                    self.cardIsPut = true;
                    self.cardValidMoved = true;
                    cardNode.setPosition(movePos);
                    cardNode.scale = self.cardBeginScale;

                    if (dis_y < templateHandCard.height / 2) {
                        self.cardIsPut = false;
                    }
                }
            }
            else if (eventType === ccui.Widget.TOUCH_ENDED || eventType === ccui.Widget.TOUCH_CANCELED) {
                self.cardValidMoved = false;
                if (MjClient.movingCard == null || !cc.sys.isObjectValid(MjClient.movingCard)) {
                    return;
                }

                if (self.checkIsWaitHuanPai()) {

                } else {
                    if (!IsTurnToMe()) {
                        MjClient.movingCard = null;
                        self.updateColoeAfterSelectCard();
                        return;
                    }
                }
                cardNode.scale = self.cardBeginScale;
                cardNode.zIndex = self.cardBeginZIndex;
                var dis_endY = Math.round(cardNode.y - templateHandCard.y);
                //点击杠按钮，命令没回来之前不能点击牌(self.hasClickBtn防止按钮和牌的多点触控导致的多牌)
                if (!self.cardIsPut || dis_endY < 20 || self.hasClickBtn) {
                    MjClient.movingCard = null;
                    cardNode.setPosition(self.cardBeginPos);
                    cardNode.y = templateHandCard.y + 20;
                    if (self.checkIsWaitHuanPai()) {
                        self._huanPaiUpNum++;
                        postEvent('canShowBtn');
                    }
                    return;
                }
                if (self.checkIsWaitHuanPai()) {
                    var downNode = self.playerNodeArr[0];
                    var stand = downNode.getChildByName('stand');
                    if (MjClient.selectedCard && cc.sys.isObjectValid(MjClient.selectedCard)) {
                        MjClient.selectedCard.setPositionY(stand.getPositionY());
                        self._huanPaiUpNum--;
                        postEvent('canShowBtn');
                    }
                    return;
                }
                //出牌消息
                PutOutCard(cardNode, cardNode.tag);
            }
        }, handCard);
    },
    handlerWhenCardTouchBegan: function (selectCard) {
        this.updateColoeAfterSelectCard(selectCard)
        //还原之前选中牌的位置
        var downNode = this.playerNodeArr[0];
        var handCard = downNode.getChildByName('stand');
        var icCanPro = MjClient.selectedCard && cc.sys.isObjectValid(MjClient.selectedCard) && MjClient.selectedCard !== selectCard;
        if (this.checkIsWaitHuanPai()) {
            if (this._huanPaiUpNum === this.HuanPaiCount() && icCanPro && selectCard.y === handCard.getPositionY()) {
                MjClient.selectedCard.setPositionY(handCard.getPositionY());
                this._huanPaiUpNum--;
                postEvent('canShowBtn');
            }
        } else {
            if (icCanPro) {
                MjClient.selectedCard.setPositionY(handCard.getPositionY());
            }
        }
    },
    /**
     * 选中某张手牌之后，改变其颜色
     **/
    updateColoeAfterSelectCard: function (selectCardNode) {
        for (var i = 0; i < this.playerNodeArr.length; i++) {
            var playNode = this.playerNodeArr[i];
            var children = playNode.children;
            for (var k = 0; k < children.length; k++) {
                var cardNode = children[k];
                if (cardNode.name != 'chi' &&
                    cardNode.name != 'peng') {
                    continue;
                }
                cardNode.setColor(cc.color(255, 255, 255));
                if (selectCardNode && cardNode.tag == selectCardNode.tag) {
                    cardNode.setColor(cc.color(170, 170, 170));
                }
            }
        }
    }
});


PlayLayer_YNXueZhan.prototype.CardLayoutRestore = function (node, off) {
    // node 是克隆新建的一个麻将节点 by sking

    var newC = null; //先创建麻将的UI节点
    var newVal = 0; //新牌的值，是几万，几筒，几条....为数字
    var pl = getUIPlayer(off);//获取玩家信息.off 为0 ，就是自己得信息，能看到自己摸牌 by sking
    var mjhandNum = 0;
    var children = node.children;
    for (var i = 0; i < children.length; i++) {
        var ci = children[i];
        if (ci.name == "mjhand") {
            ci.stopActionByTag(20180131);
            mjhandNum++;
            if ((typeof MjClient.init_y) == 'undefined') {
                MjClient.init_y = ci.y;
            }

            ci.y = MjClient.init_y;
        }
    }
    var tempMaJiang = MjClient.majiang; //麻将的各种方法判断，是否可以杠，是否可以吃... by sking
    //排序麻将的位置 by sking
    if (pl.mjhand && pl.mjhand.length > 0) {
        var count = tempMaJiang.CardCount(pl);
        if (count == (MjClient.majiang.handCount + 1) && mjhandNum == pl.mjhand.length) {
            if (pl.isNew) //isNew 每次摸完牌后设为true,打出去一张牌后 设为false by sking
            {
                newVal = pl.mjhand[pl.mjhand.length - 1]; //为什么取最后一个节点 ？
            }
            else {
                pl.mjhand.sort(function (a, b) {
                    if (tempMaJiang.isEqualHunCard(a)) {
                        return -1;
                    }
                    else if (tempMaJiang.isEqualHunCard(b)) {
                        return 1;
                    }
                    else {
                        return a - b;
                    }
                });

                newVal = pl.mjhand[pl.mjhand.length - 1];
                if (pl.que) {
                    for (var i = pl.mjhand.length - 1; i >= 0; i--) {
                        var realnewVal = pl.mjhand[i];
                        if (Math.floor(realnewVal / 10) == pl.que) {
                            newVal = realnewVal;
                            break;
                        }
                    }
                }
            }
        }
    }
    //up stand 是2种麻将的图。
    var up = node.getChildByName("up");
    var stand = node.getChildByName("stand");
    var start, offui;
    switch (off) {
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
    var uique = [];//缺色牌
    // var sData = MjClient.data.sData;
    // var tData = sData.tData;
    for (var i = 0; i < children.length; i++) //children 为 "down" 节点下的字节点
    {
        var ci = children[i];
        if (ci.name == "mjhand") {
            if (newC == null && newVal == ci.tag) {
                newC = ci; //从down 节点下，复制一个麻将node保存在newC 里 by sking    //newC就是新摸的那张手牌
            }
            else {
                if (tempMaJiang.isEqualHunCard(ci.tag)) {
                    uihun.push(ci);
                }
                else {
                    if (Math.floor(ci.tag / 10) == pl.que) {
                        uique.push(ci);
                    }
                    else {
                        uistand.push(ci);
                    }
                }
            }
            if (tempMaJiang.isEqualHunCard(ci.tag)) {
                ci.setColor(cc.color(255, 255, 63));
            }
        }
        else if (ci.name == "standPri") {
            uistand.push(ci);
        }
        else if (ci.name == "gang0") {
            uigang0.push(ci);
        }
        else if (ci.name == "gang1") {
            uigang1.push(ci);
        }
        else if (ci.name == "chi") {
            uichi.push(ci);
        }
        else if (ci.name == "peng") {
            uipeng.push(ci);
        }
        else if (ci.name == "mjhand_replay") {
            uistand.push(ci);
        }
    }

    if (MjClient.rePlayVideo == -1 && pl.huCards && pl.huCards.length <= 0) {
        uistand.sort(TagOrder);
        uique.sort(TagOrder);
    }
    else if (MjClient.rePlayVideo != -1) {
        uistand.sort(TagOrder);
        uique.sort(TagOrder);
    }

    var sData = MjClient.data.sData;
    if (sData) var tData = sData.tData;

    if (uihun.length > 0) //是否有柰子，有则放在最前面 by sking
    {
        for (var i = 0; i < uihun.length; i++) {
            uistand.unshift(uihun[i]); //向数组开头添加一个元素 unshift
        }
    }

    if (uique.length > 0) //是否有定缺色牌，有则放在最后面
    {
        for (var i = 0; i < uique.length; i++) {
            uistand.push(uique[i]);
        }
    }


    if (newC) {
        uistand.push(newC); //把这张牌放入手牌的数组里  by sking
        if (pl.huCards && pl.huCards.length > 0) {
            newC.loadTexture(up.getRenderFile().file);
            setCardSprite(newC, pl.huCards[0], off);
        }
    }
    var uiOrder = [uigang1, uigang0, uipeng, uichi, uistand];
    if (off == 1 || off == 2) {
        uiOrder.reverse();//颠倒顺序
    }
    var orders = []; //重新排序后装到数组里 by sking
    for (var j = 0; j < uiOrder.length; j++) {
        var uis = uiOrder[j];
        for (var i = 0; i < uis.length; i++) {
            orders.push(uis[i]);
        }
    }

    var pl = getUIPlayer(0);
    MjClient.QueMenCounts = 0;
    //排序前先统计手牌中剩余缺色牌数
    if (MjClient.rePlayVideo == -1) {
        for (var i = 0; i < pl.mjhand.length; i++) {
            if (Math.floor(pl.mjhand[i] / 10) == pl.que) {
                MjClient.QueMenCounts += 1;
                break;
            }
        }
    }
    //设置麻将大小
    var slotwith = upSize.width * upS * 0.2;//0.05;
    var slotheigt = upSize.height * upS * 0.3;
    var hasUp = false;

    for (var i = 0; i < orders.length; i++) {
        var ci = orders[i];
        if (off % 2 == 0)//自己或者对家
        {
            if (i != 0) {
                if (ci.name == orders[i - 1].name) {
                    if (ci.isgang4) {
                        ci.x = orders[i - 2].x;
                        ci.y = orders[i - 2].y + upSize.height * upS * 0.18;
                    }
                    else if (orders[i - 1].isgang4) {
                        ci.x = orders[i - 2].x + upSize.width * upS + slotwith;
                    }
                    else if (orders[i - 1].ispeng3) {
                        ci.x = orders[i - 1].x + upSize.width * upS + slotwith;
                    }
                    else {
                        if (ci.name == "mjhand") {
                            if (off == 0) {
                                ci.x = orders[i - 1].x + upSize.width * upS * 1.2//1.08;
                            }
                            else//这个地方不是对家的手牌，下面的代码好像没用
                            {
                                ci.x = orders[i - 1].x + upSize.width * upS * 1.8;
                            }
                        }
                        else {
                            if (off == 0) {
                                ci.x = orders[i - 1].x + upSize.width * upS * 0.91;
                            }
                            else {
                                ci.x = orders[i - 1].x + upSize.width * upS * 1.05;//对家的手牌
                            }
                        }
                    }
                }
                else if (orders[i - 1].name == "gang0" || orders[i - 1].name == "gang1") {
                    ci.x = orders[i - 2].x + upSize.width * upS + slotwith;
                }
                else {
                    ci.x = orders[i - 1].x + upSize.width * upS * 1.3;
                }
                ci.zIndex = orders[i - 1].zIndex + 1;
            }
            else {
                if (off == 0) {
                    ci.x = start.x + upSize.width * upS * 0.1;
                    ci.zIndex = start.zIndex + 100;//第一张牌的层级
                }
                else {
                    ci.x = start.x + upSize.width * upS;
                }

                var isGray = pl.isTing && ci.name == "mjhand";
                if (isGray) {
                    ci.setColor(cc.color(190, 190, 190));
                    ci.addTouchEventListener(function () { });
                }

                if (ci.name == "mjhand" && (pl.isTing || MjClient.clickTing && !MjClient.canTingCards[ci.tag]))
                    ci.setColor(cc.color(190, 190, 190));
                else
                    ci.setColor(cc.color(255, 255, 255));
            }

            if (off == 0) {
                /*
                 ting的情况下，将麻将置灰
                 */
                var isGray = pl.isTing && ci.name == "mjhand";

                if (MjClient.clickTing) {
                    if (ci.name == "mjhand") {
                        if (MjClient.canTingCards[ci.tag]) {
                            ci.setColor(cc.color(255, 255, 255));
                            if (!hasUp) {
                                //ci.y += 20;
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
                else if (i == orders.length - 1) {
                    if (newC) {
                        ci.setColor(cc.color(255, 255, 255));
                        SetTouchCardHandler(stand, ci);
                        ci.x = ci.x + slotwith + 10;
                        //ci.y += 20;
                        if (pl.que != -1 &&
                            Math.floor(ci.tag / 10) != pl.que
                            && MjClient.QueMenCounts > 0) {

                            ci.setColor(cc.color(190, 190, 190));
                        }
                    }
                    else if (isGray) {
                        ci.setColor(cc.color(190, 190, 190));
                        ci.addTouchEventListener(function () { });
                    }
                    else {
                        ci.setColor(cc.color(255, 255, 255));
                        SetTouchCardHandler(stand, ci);
                        if (pl.que != -1 &&
                            Math.floor(ci.tag / 10) != pl.que
                            && MjClient.QueMenCounts > 0) {
                            ci.setColor(cc.color(190, 190, 190));
                        }
                    }
                }
                else if (isGray) {
                    ci.setColor(cc.color(190, 190, 190));
                    ci.addTouchEventListener(function () { });
                }
                else {
                    ci.setColor(cc.color(255, 255, 255));
                    SetTouchCardHandler(stand, ci);
                    if (pl.que != -1 &&
                        Math.floor(ci.tag / 10) != pl.que
                        && MjClient.QueMenCounts > 0) {
                        ci.setColor(cc.color(190, 190, 190));
                    }
                }

                //吃后，不能打的这张牌
                var tData = MjClient.data.sData.tData;
                if (IsTurnToMe() && tData.tState === TableState.waitPut) {
                    if (ci.name == "mjhand" && tData.putType == 1 && pl.mjhand.length > 2 && pl.mjchiCard) {
                        if (pl.mjchiCard[pl.mjchiCard.length - 1] === ci.tag) {
                            ci.setColor(cc.color(190, 190, 190));
                            // ci.addTouchEventListener(function () {});
                        }
                    }

                    if (MjClient.majiang.isCardFlower(ci.tag)) {
                        if (!pl.isNew) {
                            ci.setColor(cc.color(190, 190, 190));
                        }
                    }
                }
            }
        }
        else {
            if (i != 0) {
                if (ci.name == orders[i - 1].name) {
                    if (ci.isgang4) {
                        ci.y = orders[i - 2].y + slotheigt;
                    }
                    else if (orders[i - 1].isgang4) {
                        ci.y = orders[i - 2].y - upSize.height * upS * 1.1;
                    }
                    else if (orders[i - 1].ispeng3) {
                        ci.y = orders[i - 1].y - upSize.height * upS * 1.1;
                    }
                    else {
                        ci.y = orders[i - 1].y - upSize.height * upS * 0.8;
                    }
                }
                else if (orders[i - 1].name == "standPri") {
                    ci.y = orders[i - 1].y - upSize.height * upS * 2;
                }
                else if (orders[i - 1].name == "gang0" || orders[i - 1].name == "gang1") {
                    ci.y = orders[i - 2].y - upSize.height * upS * 1.5;
                }
                else if (orders[i - 1].name == "mjhand_replay") {
                    ci.y = orders[i - 1].y - upSize.height * upS * 2;
                }
                else {
                    ci.y = orders[i - 1].y - upSize.height * upS * 1.5;
                }

                ci.zIndex = orders[i - 1].zIndex + 1;//调整每张牌的层级
            }
            else {
                ci.y = start.y - upSize.height * upS * 0.2;
                ci.y += 10;
                ci.zIndex = start.zIndex;//第一张牌的层级
            }
            if (ci.name == "gang0" || ci.name == "gang1" || ci.name == "peng") {
                ci.x = start.x;
                if (off == 3) {
                    ci.x = start.x + 4;
                }
            }

        }
    }

    //刷新手牌大小
    if (COMMON_UI3D.is3DUI()) {
        COMMON_UI3D.set3DCardSprite(off);
    }
    else {
        resetCardSize();
    }


    //胡牌引导，可听得牌加箭头
    if (typeof (pl.que) != "undefined" && pl.que != -1 && pl.huCards.length <= 0) {
        if (MjClient.majiang.hasquesecard(pl.mjhand, pl.que)) {
            COMMON_UI.willHuShowArrow();
        }
    }
    cc.log("QueMenCounts ----------------   ", MjClient.QueMenCounts);
    MjClient.playui.resetCardcolor(0);
};

// 判断吃碰杠胡的状态
PlayLayer_YNXueZhan.prototype.EatVisibleCheck = function () {
    if (_isAniShow_xuezhanMJ) return;
    var eat = MjClient.playui.jsBind.eat;
    //sk 为啥要隐藏掉？   //因为一开始是不可见的，隐藏根节点 by sking
    MjClient.playui.jsBind.eat.changeui.changeuibg._node.visible = false;
    var sData = MjClient.data.sData;
    var tData = sData.tData;
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

    if (!pl) {
        return;
    }

    var mj = MjClient.majiang;

    //吃碰杠胡node
    var vnode = [];

    if (
        pl.mjState == TableState.waitEat ||
        pl.mjState == TableState.waitPut &&
        tData.uids[tData.curPlayer] == SelfUid()) {

    }
    else {
        return;
    }

    //自摸
    if (tData.tState == TableState.waitPut && pl.mjState == TableState.waitPut) {
        if (IsTurnToMe()) {
            //检测补花
            var cduis = MjClient.playui.jsBind.down._node.children;
            for (var i = cduis.length - 1; i >= 0; i--) {
                if (cduis[i].name == "mjhand" && MjClient.majiang.isCardFlower(cduis[i].tag) && pl.isNew) {
                    return;
                }
            }
            //胡
            if (pl.isNew && pl.eatFlag & 8) {
                vnode.push(eat.hu._node);
            }
            // 杠
            cc.log("=== pl.mjpeng :  " + pl.mjpeng)
            cc.log("=== pl.mjhand :  " + pl.mjhand)
            cc.log("=== pl.isTing :  " + pl.isTing)
            var rtn = MjClient.majiang.canGang1(pl.mjpeng, pl.mjhand, pl.isTing, pl.que);
            cc.log("$$$$杠牌监测" + JSON.stringify(rtn));
            if (rtn.length > 0 && pl.isNew) {
                MjClient.gangCards = rtn;
                vnode.push(eat.gang0._node);
            }
            if (vnode.length > 0) {
                vnode.push(eat.guo._node);
                eat.ting._node.visible = false;
                eat.noTing._node.visible = false;
                isCheckedTing = false;
            }
        }
    }
    //别人点
    else if (tData.tState == TableState.waitEat) {
        // cc.log("diao pao hu-=================================================");
        if (!IsTurnToMe()) {
            cc.log("pl.eatFlag ---------------   ", pl.eatFlag);
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
            if (pl.eatFlag & 1) {
                var eatpos = mj.canChi(pl.mjhand, tData.lastPutCard);
                MjClient.eatpos = eatpos;
                if (eatpos.length > 0) {
                    vnode.push(eat.chi0._node);
                }
            }

            //如果，有杠，碰，吃。 这出现过的UI. 否则玩家状态为等待
            if (vnode.length > 0) {
                vnode.push(eat.guo._node);
                eat.ting._node.visible = false;
                eat.noTing._node.visible = false;
                isCheckedTing = false;
            }
            else {
                getUIPlayer(0).mjState = TableState.waitCard;
            }
        }
    }

    //吃碰杠胡过处理
    if (vnode.length > 0) {
        var btnImgs =
        {
            "peng": ["playing/gameTable/youxizhong-2_57.png", "playing/gameTable/youxizhong-2_07.png"],
            "gang0": ["playing/gameTable/youxizhong-2_55.png", "playing/gameTable/youxizhong-2_05.png"],
            "chi0": ["playing/gameTable/youxizhong-2_59.png", "playing/gameTable/youxizhong-2_09.png"],
        }

        for (var i = 0; i < vnode.length; i++) {
            vnode[i].visible = true;

            if (vnode[i].getChildByName("card1")) {
                vnode[i].getChildByName("card1").visible = false;
            }

            if (vnode[i].getChildByName("bgground")) {
                vnode[i].getChildByName("bgground").visible = false;
            }

            if (vnode[i].getChildByName("bgimg")) {
                vnode[i].getChildByName("bgimg").visible = true;
            }

            var btnName = vnode[i].name;
            if (btnName == "peng" || btnName == "chi0" || btnName == "gang0") {
                vnode[i].loadTextureNormal(btnImgs[btnName][0]);
                // vnode[i].loadTexturePressed(btnImgs[btnName][1]);
            }

            if (i == 0) {
                var cardVal = 0;
                if (vnode[i].getChildByName("bgimg")) {
                    vnode[i].getChildByName("bgimg").visible = false;
                }

                if (btnName == "peng" || btnName == "chi0" || btnName == "gang0") {
                    vnode[i].loadTextureNormal(btnImgs[btnName][0]);
                    // vnode[i].loadTexturePressed(btnImgs[btnName][1]);
                }

                if (btnName == "peng") {
                    cardVal = tData.lastPutCard;
                }
                else if (btnName == "chi0") {
                    if (MjClient.eatpos.length == 1) {
                        cardVal = tData.lastPutCard;
                    }
                }
                else if (btnName == "gang0") {
                    if (MjClient.gangCards.length == 1) {
                        cardVal = MjClient.gangCards[0];
                    }
                }
                else if (btnName == "hu") {
                    if (IsTurnToMe()) {
                        cardVal = pl.mjhand[pl.mjhand.length - 1];
                    }
                    else {
                        cardVal = tData.lastPutCard;
                    }
                }

                if (cardVal && cardVal > 0) {
                    setCardSprite(vnode[0].getChildByName("card1"), cardVal, 0);
                    vnode[0].getChildByName("card1").visible = true;
                }

                if (vnode[0].getChildByName("bgground")) {
                    vnode[0].getChildByName("bgground").zIndex = -1;
                    vnode[0].getChildByName("bgground").visible = true;
                }

                //屏蔽到 碰 ，杠 的显示牌 add by sking
                if (vnode[0].getChildByName("bgground")) {
                    vnode[0].getChildByName("bgground").visible = false;
                }
                if (vnode[i].getChildByName("card1")) {
                    vnode[i].getChildByName("card1").visible = false;
                }
                //end of 屏蔽 碰，杠的显示牌
            }

            setWgtLayout(vnode[i], [0, 0.18], [0.5, 0], [(1 - vnode.length) / 1.8 + i * 1.4, 1.8], false, false);
        }
    }

    if (eat.hu._node.visible) {
        MjClient.playui._btnPutCard.visible = false;
    }

    //显示，吃，碰，杠的那几张牌
    COMMON_UI.showCurrentEatCards(vnode);
}
PlayLayer_YNXueZhan.prototype.resetCardcolor = function (off) {
    var node = getNode(off);
    var children = node.children;
    if (children) {
        return;
    }
    if (MjClient.QueMenCounts <= 0) {
        for (var i = 0; i < children.length; i++) {
            if (children[i].name == "mjhand") {
                children[i].setColor(255, 255, 255);
            }
        }
    }
}
PlayLayer_YNXueZhan.prototype.playSignAnimation = function (node, off, dir, ani = true) {
    var filePath = "XueZhanDaoDi/sing_" + off + ".png";
    if (!jsb.fileUtils.isFileExist(filePath)) {
        cc.log("加载文件路径--------", filePath);
        return;
    }
    var sign = new ccui.ImageView();
    sign.loadTexture(filePath);
    sign.name = "sign";
    var posX = node.getContentSize().width / 6 * 5;
    var posY = node.getContentSize().height;
    node.addChild(sign);
    if (dir == 2) {
        posX = node.getContentSize().width / 6;
        posY = node.getContentSize().height / 6 * 5
        setWgtLayout(sign, [1, 1], [0.64, -0.71], [0.5, 0.5]);
    }
    else if (dir == 3) {
        setWgtLayout(sign, [1, 1], [1.02, -0.31], [0.5, 0.5]);
    }
    else if (dir == 1) {
        posX = node.getContentSize().width / 6;
        setWgtLayout(sign, [1, 1], [-0.935, -0.325], [0.5, 0.5]);
    }
    else if (dir == 0) {
        setWgtLayout(sign, [1, 1], [1.02, 0.43], [0.5, 0.5]);
    }
    if (ani)
        sign.runAction(cc.spawn(cc.scaleTo(0.7, 1), cc.moveTo(0.7, cc.p(posX, posY))));
    else {
        sign.setScale(1)
        sign.setPosition(cc.p(posX, posY));
    }
}

PlayLayer_YNXueZhan.prototype.clearSign = function (off) {
    var node = getNode(off);
    if (!node) {
        return;
    }
    var sign = node.getChildByName("head").getChildByName("sign");
    if (sign) {
        sign.removeFromParent();
    }
}

PlayLayer_YNXueZhan.prototype.resetCardAfterHu = function (node, off) {

    var cnode = getNode(off);
    var children = node.children;
    var pl = getUIPlayer(off);
    if (!pl || !pl.huCards)
        return;
    var cardname = "mjhand";
    if (off != 0) {
        cardname = "standPri";
    }

    var cpnode = cnode.getChildByName("down");
    var cpnode_hu = cnode.getChildByName("up");
    var tmp = cnode.getChildByName("stand");

    var huCardsarry = [];

    for (var i = 0; i < children.length; i++) {
        var ci = children[i];
        if (ci.name == cardname) {
            huCardsarry.push(ci);
        }
    }

    for (var i = 0; i < huCardsarry.length; i++) {

        huCardsarry[i].removeAllChildren();
        huCardsarry[i].loadTexture(cpnode.getRenderFile().file);
        if (off == 1 || off == 3) {
            huCardsarry[i].setSize(cpnode.getContentSize());
            //huCardsarry[i].setRotation(off * 180);
            // huCardsarry[i].setScale(0.26);
        }
        cc.log("加载新图  ", cpnode.getRenderFile().file, off);
    }


    //最后一张手牌显示所胡的牌

    var AllCard = huCardsarry.length;
    if (AllCard % 3 == 2) {
        if (off == 2) {
            RemoveNodeBack(node, cardname, 1);
            getNewCard(node, "up", cardname, pl.huCards[pl.huCards.length - 1], off);
        }
        else if (off == 1 || off == 3) {
            RemoveNodeBack(node, cardname, 1);
            var card = getNewCard(node, "up", cardname, pl.huCards[pl.huCards.length - 1], off);
            card.setScale(huCardsarry[0].getScale());
            card.setPositionX(huCardsarry[0].getPositionX());
        }
    }
    else {
        if (off == 2 || off == 0) {
            getNewCard(node, "up", cardname, pl.huCards[pl.huCards.length - 1], off);
        }
        else if (off == 1 || off == 3) {
            var card = getNewCard(node, "up", cardname, pl.huCards[pl.huCards.length - 1], off);
            card.setScale(huCardsarry[0].getScale());
            card.setPositionX(huCardsarry[0].getPositionX());
        }
    }
}