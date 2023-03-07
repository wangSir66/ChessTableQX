/**
 *长牌 徐票老牌的 公用函数
 *   by sking
 */

//重置3家头像位置
PlayLayer_xuPuLaoPai.prototype.reConectHeadLayout = function (node)
{
    this.InitHeadPostionPlaying(node);
};

// 播放头像移动
PlayLayer_xuPuLaoPai.prototype.tableStartHeadMoveAction = function (node) 
{
    var down = node.getChildByName("down").getChildByName("head");
    var left = node.getChildByName("left").getChildByName("head");
    var right = node.getChildByName("right").getChildByName("head");
    var top = node.getChildByName("top").getChildByName("head");
    var _sc = 0.14;
    if(isIPad()) _sc = 0.085;
    this.InitHeadPostionPlaying(node);

    var downPoint = cc.p(down.x, down.y);
    var topPoint = cc.p(top.x, top.y);
    var rightPoint = cc.p(right.x, right.y);
    var leftPoint = cc.p(left.x, left.y);

    setWgtLayout(down, [_sc, _sc], [0.5, 0.5], [0, 0], false, false);
    setWgtLayout(left, [_sc, _sc], [0.3, 0.7], [0, 0], false, false);
    setWgtLayout(top,[_sc, _sc], [0.5, 0.9], [0, 0], false, false);
    setWgtLayout(right,[_sc, _sc], [0.7, 0.7], [0, 0], false, false);
    down.runAction(cc.moveTo(0.3, downPoint).easing(cc.easeCubicActionOut()));
    top.runAction(cc.moveTo(0.3, topPoint).easing(cc.easeCubicActionOut()));
    left.runAction(cc.moveTo(0.3, leftPoint).easing(cc.easeCubicActionOut()));
    right.runAction(cc.moveTo(0.3, rightPoint).easing(cc.easeCubicActionOut()));

    // sendGPS(); // 溆浦老牌没有头像移动，将定位放在moveHead里面
}

PlayLayer_xuPuLaoPai.prototype.InitHeadPostionPlaying = function (node) 
{
    if(!node) node = getNode(0).getParent();
    var down = node.getChildByName("down").getChildByName("head");
    var left = node.getChildByName("left").getChildByName("head");
    var right = node.getChildByName("right").getChildByName("head");
    var top = node.getChildByName("top").getChildByName("head");

    var _sc = 0.17;
    if(isIPad()) _sc = 0.085;

    setWgtLayout(down, [_sc, _sc], [0, 0], [0.38, 0.8], false, false);
    setWgtLayout(left, [_sc, _sc], [0, 0.55], [0.38, 0], false, false);
    setWgtLayout(top, [_sc, _sc], [0.4, 1], [0, -0.5], false, false);
    setWgtLayout(right, [_sc, _sc], [1, 0.55], [-0.38, 0], false, false);

    if (MjClient.MaxPlayerNum == 2) {
        // setWgtLayout(topHead, [_sc, _sc], [0, 1], [3.1, -0.65], false, false);
    }

    if(isIPhoneX()) {
        node.getChildByName("left").x = cc.winSize.width * 0.05;
    }else if(isIPad()){
        // setWgtLayout(topHead, [_sc, _sc], [0, 1], [2.8, -0.65], false, false);
    }
}

//显示玩家庄的ui
PlayLayer_xuPuLaoPai.prototype.showUserZhuangLogo = function (node, off)
{
    var tData = MjClient.data.sData.tData;
    var pl = getUIPlayer(off);
    node.zIndex = 99;
    if(tData && pl)
    {
        if(tData.uids[tData.zhuang] == pl.info.uid)
        {
            node.visible = true;
            var linkZhuang = node.getChildByName("linkZhuang");
            // var path = "playing/gameTable/shuzi/shuzi_" + pl.linkZhuang + ".png";
            // linkZhuang.loadTexture(path);
            linkZhuang.setVisible(false);
            // 播放金币麻将场庄家的动画
            // showFieldIdZhuangAni(node);
        }
        else
        {
            node.visible = false;
        }
    }
}

/*
 游戏场景ctor里调用，需要公共初始化的功能 by sking 2018.4.23
 */
PlayLayer_xuPuLaoPai.prototype.initSceneFunc =  function(needAdjust, posAndSizeArr, posAndSizeArrX)
{
    /* 等待玩家加入时候：复制房间号，微信邀请，解散，退出按钮*/
    this.MJ_setWaitBtn(needAdjust, posAndSizeArr, posAndSizeArrX);

    /* 设置房间内聊天按钮的状态 */
    MJ_setChatBtn();

    /* 准备按钮的初始化*/
    MJ_setReadyBtn();

    // if(isNeedSetTingBtn())
    // {
    //     COMMON_UI.showTingCardsBtn();
    // }

    /* 麻将起手听牌*/
    COMMON_UI.showStartHandTingCards();


    COMMON_UI.addLeftCardAndRound();
    /*局数显示*/

    //东南西北转盘初始化
    this.InitSetArrowbk();

    //断线重连回来后，刷新UI,局数，牌张数
    COMMON_UI.reconnectRefeshUI();
};


PlayLayer_xuPuLaoPai.prototype.InitSetArrowbk = function(){

    var tData = MjClient.data.sData.tData;
    var arrowbk = getNode(0).getParent().getChildByName("arrowbk");
    arrowbk.visible = false;
    MjClient.arrowbkNode = arrowbk;
    setWgtLayout(arrowbk, [0.18, 0.18], [0.5, 0.55], [0, 0]);

    arrowbk.addTouchEventListener(function (sender, type) {
        if(type === ccui.Widget.TOUCH_ENDED){
            postEvent("showMingCardInfo");
        }
    });

    var number = arrowbk.getChildByName("number");
    number.ignoreContentAdaptWithSize(true);

    var setRemainCardNum = function(){
        var tData = MjClient.data.sData.tData;
        if(tData) number.setString(MjClient.majiang.getAllCardsTotal() - tData.cardNext);
    };

    setRemainCardNum();
    setDirVisible(arrowbk, false);
    setArrowFengDir(arrowbk);
    SetArrowRotation(arrowbk);

    UIEventBind(null, arrowbk, "initSceneData", function (eD) {
        this.visible = IsArrowVisible();
        SetArrowRotation(this);
        setRemainCardNum();
    });

    UIEventBind(null, arrowbk, "mjhand", function (eD) {
        this.visible = IsArrowVisible();
        SetArrowRotation(this);
    });

    UIEventBind(null, arrowbk, "waitPut", function (eD) {
        SetArrowRotation(this);
        setRemainCardNum();
    });

    UIEventBind(null, arrowbk, "MJPeng", function (eD) {
        SetArrowRotation(this);
    });

    UIEventBind(null, arrowbk, "MJChi", function (eD) {
        SetArrowRotation(this);
    });

    UIEventBind(null, arrowbk, "MJPut", function (msg) {
        if (msg.uid === SelfUid()) {
            SetArrowRotation(this);
        }
    });

    UIEventBind(null, arrowbk, "roundEnd", function (eD) {
        SetArrowRotation(this);
        this.visible = false;
    });

    UIEventBind(null, arrowbk, "LeaveGame", function (eD) {
        SetArrowRotation(this);
        this.visible = false;
    });
};

/**
 * wait状态 的四个按钮
 * posAndSizeArr：返回大厅按钮自定义尺寸位置信息
 * posAndSizeArrX：返回大厅按钮自定义iPhoneX尺寸位置信息
 * 不传则用默认信息
 */
PlayLayer_xuPuLaoPai.prototype.MJ_setWaitBtn = function(needAdjust, posAndSizeArr, posAndSizeArrX)
{
    var _parentNode = MjClient.playui._downNode.getParent();
    var _waitNode = _parentNode.getChildByName("wait");
    _waitNode.visible = true;
    _waitNode.zIndex = 100;

    // 俱乐部返回大厅功能：by_jcw
    addClub_BackHallBtn(needAdjust, posAndSizeArr, posAndSizeArrX);

    // 复制房间号
    var _getRoomNumBtn = _waitNode.getChildByName("getRoomNum");
    _getRoomNumBtn.visible = !MjClient.remoteCfg.guestLogin;
    _getRoomNumBtn.visible = false;
    _getRoomNumBtn.addTouchEventListener(function(sender,type){
        if(type === 2) {
            getPlayingRoomInfo(1);
            MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Fuzhifangjianxinxi", {uid:SelfUid(), gameType:MjClient.gameType});
        }
    },this);

    // 邀请
    var _wxinviteBtn = _waitNode.getChildByName("wxinvite");
    _wxinviteBtn.visible = !MjClient.remoteCfg.guestLogin;
    _wxinviteBtn.addTouchEventListener(function(sender,type){
        if(type === 2) {
            getPlayingRoomInfo(2);
            MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Yaoqingweixinhaoyou", {uid:SelfUid(), gameType:MjClient.gameType});
        }
    },this);

    // 解散房间
    var _delroomBtn = _waitNode.getChildByName("delroom");
    _delroomBtn.visible = false;
    _delroomBtn.addTouchEventListener(function(sender,type){
        if(type === 2) {
            if (IsRoomCreator()) {
                MjClient.delRoom(true); //解散房间
                MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Jiesanfangjian", {uid:SelfUid(), gameType:MjClient.gameType});
            } else {
                MjClient.showMsg("确定要退出房间吗？",
                    function () {
                        MjClient.leaveGame();
                        MjClient.native.umengEvent4CountWithProperty("LikaifangjianClick", {uid:SelfUid(), gameType:MjClient.gameType});
                    },
                    function () {
                    });
            }
        }
    },this);

    // 退出房间
    var _backHomeBtn = _waitNode.getChildByName("backHomebtn");
    _backHomeBtn.addTouchEventListener(function(sender,type){
        if(type === 2) {
            var sData = MjClient.data.sData;
            MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Likaifangjian", {uid:SelfUid(), gameType:MjClient.gameType});

            if (sData) {
                if (IsRoomCreator()) {
                    MjClient.showMsg("返回大厅房间仍然保留\n赶快去邀请好友吧",
                        function() {
                            MjClient.leaveGame();
                            MjClient.native.umengEvent4CountWithProperty("LikaifangjianClick", {uid:SelfUid(), gameType:MjClient.gameType});
                        },
                        function() {});
                } else {
                    MjClient.showMsg("确定要退出房间吗？",
                        function() {
                            MjClient.leaveGame();
                            MjClient.native.umengEvent4CountWithProperty("LikaifangjianClick", {uid:SelfUid(), gameType:MjClient.gameType});
                        },
                        function() {});
                }
            }
        }
    },this);

    setWgtLayout(_getRoomNumBtn, [0.15, 0.15],[0.5, 0.2],[0, 0]);
    setWgtLayout(_wxinviteBtn, [0.15, 0.15],[0.7, 0.2],[0, 0]);
    setWgtLayout(_delroomBtn, [0.11, 0.11],[0.05, 0.45],[0, 0]);
    setWgtLayout(_backHomeBtn, [0.15, 0.15],[0.3, 0.2],[0, 0]);

    UIEventBind(null, _backHomeBtn, "returnPlayerLayer", function (eD) {
        MjClient.playui.visible = true;
    });

    UIEventBind(null, _backHomeBtn, "initSceneData", function (eD) {
        var isWaitReady = (eD.tData.tState == TableState.waitReady || eD.tData.tState == TableState.waitJoin);
        // _getRoomNumBtn.visible = IsInviteVisible() && !MjClient.remoteCfg.guestLogin;
        _wxinviteBtn.visible = IsInviteVisible() && !MjClient.remoteCfg.guestLogin;
        // _delroomBtn.visible = IsInviteVisible() || isWaitReady;
        _backHomeBtn.visible = IsInviteVisible() || isWaitReady;
    });

    UIEventBind(null, _backHomeBtn, "addPlayer", function (eD) {
        var isWaitReady = eD.tData.tState == TableState.waitReady || TableState.waitJoin == eD.tData.tState ;
        // _getRoomNumBtn.visible = IsInviteVisible() && !MjClient.remoteCfg.guestLogin;
        _wxinviteBtn.visible = IsInviteVisible() && !MjClient.remoteCfg.guestLogin;
        // _delroomBtn.visible = IsInviteVisible() || isWaitReady;
        _backHomeBtn.visible = IsInviteVisible() || isWaitReady;
    });

    UIEventBind(null, _backHomeBtn, "removePlayer", function (eD) {
        var isWaitReady = eD.tData.tState == TableState.waitReady;
        // _getRoomNumBtn.visible = IsInviteVisible() && !MjClient.remoteCfg.guestLogin;
        _wxinviteBtn.visible = IsInviteVisible() && !MjClient.remoteCfg.guestLogin;
        // _delroomBtn.visible = IsInviteVisible() || isWaitReady;
        _backHomeBtn.visible = IsInviteVisible() || isWaitReady;
    });

    UIEventBind(null, _backHomeBtn, "waitJiazhu", function (eD) {
        // _getRoomNumBtn.visible = false;
        _wxinviteBtn.visible = false;
        // _delroomBtn.visible = false;
        _backHomeBtn.visible = false;
    });


    UIEventBind(null, _backHomeBtn, "moveHead", function (eD) {
        // _getRoomNumBtn.visible = false;
        _wxinviteBtn.visible = false;
        // _delroomBtn.visible = false;
        _backHomeBtn.visible = false;
    });

    UIEventBind(null, _backHomeBtn, "waitReady", function (eD) {
        // _delroomBtn.visible = true;
        _backHomeBtn.visible = true;
    });

    UIEventBind(null, _backHomeBtn, "onlinePlayer", function (eD) {
        if( IsAllPlayerReadyState() ) {
            // _delroomBtn.visible = false;
            _backHomeBtn.visible = false;
        }
    });
}


//处理出牌,放一张牌，打牌动作
PlayLayer_xuPuLaoPai.prototype.DealMJPut = function(node, msg, off, outNum)
{
    //断线重连 起手胡 不消失
    var sData = MjClient.data.sData;
    var tData = sData.tData;

    var uids = tData.uids;
    var selfIndex = getPlayerIndex(off);
    if(uids[selfIndex] === msg.uid)
    {
        var pl = sData.players[msg.uid];
        var putnum = outNum >= 0 ? outNum : (pl.mjput.length - 1);
        var tingIndex = pl.tingIndex;//沭阳麻将需要
        if(cc.isUndefined(tingIndex) || !pl.isTing)
        {
            tingIndex = -1;//为了不报错;
        }

        var out0 = node.getChildByName("out0");
        var out1 = node.getChildByName("out1");
        var out2 = node.getChildByName("out2");


        var maxNum = 9;
        if (MjClient.MaxPlayerNum == 2) {
            maxNum = 20;
        }

        var out;
        if (putnum >= maxNum * 2 && out2)
        {
            out = out2.clone();
        }
        else if(putnum >= maxNum)
        {
            out = out1.clone();
        }
        else
        {
            out = out0.clone();
        }
        out.setScale(out.getScale()*1.3);

        var oSize = out.getSize();
        var oSc = out.scale;

        if (off == 0 && putnum >= maxNum * 2 && out2)  // 0第三行
        {
            node.addChild(out);
        }
        else if (off == 0 && putnum >= maxNum)  // 0第二行
        {
            // node.addChild(out, 1);
            node.addChild(out, putnum);
        }
        else if(off == 1 || off == 0)   // 0, 1第一行
        {
            node.addChild(out, putnum);
        }
        else if(off == 2 || off == 3)   // 2, 3第一行
        {
            node.addChild(out, putnum);
        }
        else
        {
            node.addChild(out);
        }

        for(var i = 0; i < node.children.length; i++)
        {
            if(node.children[i].name == "newout")
            {
                node.children[i].name = "out";
            }
        }

        out.visible = true;
        out.name = "out";
        MjClient.playui.setCardSprite(out, msg.card, off);

        var endPoint = cc.p(0, 0);
        var ws = cc.director.getWinSize();
        var lineNum = 1; // 记录当前出牌显示的行数，默认第一行
        if (putnum > maxNum*2 - 1 && out2)
        {
            out.x = out2.x;
            out.y = out2.y;
            putnum -= maxNum*2;
            lineNum = 3;
        }
        else if (putnum > maxNum - 1)
        {
            out.x = out1.x;
            out.y = out1.y;
            putnum -= maxNum;
            lineNum = 2;
        }


        if(off == 0)
        {
            endPoint.y = out.y;
            endPoint.x = out.x + oSize.width * oSc * putnum * 0.8;

            if (isIPad()) {
                var ax = ws.height/1024;
                var ay = ws.height/768;
                endPoint.x = endPoint.x + 20 * ax;
                out.zIndex = putnum;
                endPoint.y = lineNum > 1 ? endPoint.y - 8 * ay: endPoint.y;
            }

            if(!(outNum >= 0))
            {
                if(RemoveNodeBack(node, "putOutCard", 1, msg.card) == 0)
                {
                    RemoveNodeBack(node, "mjhand", 1, msg.card);
                }
            }
        }
        else if (off == 1)
        {
            if(!(outNum >= 0))
            {
                if (MjClient.rePlayVideo == -1)
                    RemoveFrontNode(node, "standPri", 1);
                else//回放
                    RemoveFrontNode(node, "mjhand_replay", 1, msg.card);
            }
            cc.log("DealMJPut remove card  = " + msg.card);
            endPoint.y = out.y - oSize.height * oSc * putnum * 0.2;
            endPoint.x = out.x;

            if (isIPad()) {
                var ay = ws.height/768;
                endPoint.y = endPoint.y - 20 * ay;
            }
            out.zIndex = putnum;
        }
        else if(off == 2)
        {
            if(!(outNum >= 0))
            {
                if (MjClient.rePlayVideo == -1)
                    RemoveFrontNode(node, "standPri", 1);
                else//回放
                    RemoveFrontNode(node, "mjhand_replay", 1, msg.card);
            }
            endPoint.x = out.x + oSize.width * oSc * putnum*0.91;
            endPoint.y = out.y;

            if (isIPad()) {
                var ax = ws.height/1024;
                var ay = ws.height/768;
                endPoint.x = endPoint.x + 20 * ax;
                out.zIndex = 100 - putnum - lineNum;
                endPoint.y = lineNum > 1 ? endPoint.y + 5 * ay: endPoint.y;
            }
        }
        else if (off == 3)
        {
            if(!(outNum >= 0))
            {
                if (MjClient.rePlayVideo == -1)
                    RemoveNodeBack(node, "standPri", 1);
                else
                    RemoveNodeBack(node, "mjhand_replay", 1, msg.card);
            }
            endPoint.y = out.y - oSize.height * oSc * putnum * 0.2;
            endPoint.x = out.x;
            out.zIndex = putnum;

            if (isIPad()) {
                var ay = ws.height/768;
                endPoint.y = MjClient.MaxPlayerNum === 3 ? endPoint.y + 120 * ay: endPoint.y - 25 * ay;
            }
        }

        if(outNum >= 0) //重连
        {
            cc.log("==================tData = "+ JSON.stringify(tData));
            //断线重连的时候
            if (tData.lastPutCard == msg.card && tData.lastPutPlayer == tData.uids.indexOf(msg.uid))
            {
                out.x = endPoint.x;
                out.y = endPoint.y;
            }

            if((outNum == pl.mjput.length - 1) && tData.curPlayer == selfIndex && tData.tState == TableState.waitEat)
            {

            }
            else
            {
                out.x = endPoint.x;
                out.y = endPoint.y;
                return;
            }
        }


        var zoder = out.zIndex;
        out.visible = false;
        out.scale = oSc;
        out.name = "newout";

        var outAction = out.clone();
        outAction.name = "outAction";
        outAction.visible = true;
        node.addChild(outAction);
        this.setCardSprite(outAction, msg.card, off);

        var playTip = node.getChildByName("play_tips");
        var showPos = playTip.getPosition();
        var kuangImg = new ccui.ImageView("playing/changpai/cards/fg.png");
        var scale = oSc * 1.4;
        outAction.zIndex = 300;
        kuangImg.setContentSize(outAction.getContentSize());
        kuangImg.setPosition(outAction.width/2, outAction.height/2);
        outAction.addChild(kuangImg);
        outAction.setScale(scale);
        outAction.setPosition(showPos);
        outAction.visible = true;
        outAction.setTouchEnabled(false);


        var outActionFunc = function () {
            if(cc.sys.isObjectValid(outAction)){
                outAction.setVisible(false);
                outAction.removeFromParent(true);
            }

            if(cc.sys.isObjectValid(out)){
                out.visible = false;
                out.zIndex = 300;
                out.setTouchEnabled(false);
                out.setPosition(showPos);
                out.runAction(cc.sequence(
                    cc.callFunc(function () {
                        out.setVisible(true);
                        out.zIndex = zoder;
                        MjClient.playui.addTouchEnventForShowCard(out, off);
                    }),
                    cc.MoveTo(0.03, endPoint)
                ));
            }
        };


        var actionBind = {
            _event:{
                waitPut: function() {
                    outActionFunc();
                },
                MJChi: function() {
                    outActionFunc();
                },
                MJPeng: function() {
                    outActionFunc();
                },
                roundEnd: function () {
                    outActionFunc();
                }
            }
        };
        BindUiAndLogic(outAction, actionBind);

        if (!(outNum >= 0)){
            if( cc.sys.isObjectValid(MjClient.playui) )  MjClient.playui.CardLayoutRestore(node, off);
        }
    }
};


PlayLayer_xuPuLaoPai.prototype.GetUIBind = function(uidPos, offStore)
{
    var uiOff = getOffByIndex(uidPos);
    if (offStore)
        offStore.push(uiOff);
    var _node = {_node:getNode(uiOff)};
    return _node;
};


// 处理吃
PlayLayer_xuPuLaoPai.prototype.DealMJChi = function(node, msg, off)
{
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var selfIndex = getPlayerIndex(off);
    if (tData.curPlayer === selfIndex)
    {
        var fromOff = [];
        var fromBind = this.GetUIBind(msg.from, fromOff);
        var fnode = fromBind._node;
        var lastPutCard = tData.lastPutCard;
        RemoveNewCardOut(fnode);

        // var curChiArr = msg.mjchi.slice();
        var cds = msg.mjchi;
        var cdui = null;

        // 吃掉的牌放最左边
        cds.sort(function(a, b) {
            return a - b;
        });

        // chiCard被吃掉的牌
        // var chiCard = msg.mjchiCard[msg.mjchiCard.length - 1];
        // var idx = curChiArr.indexOf(chiCard);
        //
        // if(idx > -1){
        //     cds.splice(idx, 1);
        //     cds.unshift(curChiArr[idx]);
        // }

        for(var i = 0; i < cds.length; i++) {
            if(cds[i] === lastPutCard)
            {
                cdui = MjClient.playui.getNewCard(node, "up", "chi", cds[i], off);
                cdui.ischiCard = true;
            }
            else
            {
                cdui = MjClient.playui.getNewCard(node, "up", "chi", cds[i], off);
            }

            if(off === 0 && cds[i] !== lastPutCard)
            {
                RemoveNodeBack(node, "mjhand", 1, cds[i]);
            }
        }

        //删掉俩张stand
        if (MjClient.rePlayVideo === -1)
        {
            if(off === 3)
            {
                RemoveNodeBack(node, "standPri", 2);
            }
            else if(off !== 0)
            {
                RemoveFrontNode(node, "standPri", 2);
            }
        }
        else //回放
        {
            for(var i = 0; i < cds.length; i++)
            {
                if(cds[i] !== lastPutCard)
                {
                    if(off === 3)
                    {
                        RemoveNodeBack(node, "mjhand_replay", 1, cds[i]);
                    }
                    else if(off !== 0)
                    {
                        RemoveFrontNode(node, "mjhand_replay", 1, cds[i]);
                    }
                }
            }
        }

        MjClient.playui.CardLayoutRestore(node, off);
        MjClient.playui.CardLayoutRestore(fnode, fromOff[0]);

        MjClient.playui.updateMjHandColor(node);
        MjClient.playui.updateMjHandColor(fnode);

        ShowEatActionAnim(node, ActionType.CHI, off);
    }
};

PlayLayer_xuPuLaoPai.prototype.DealMJPeng = function(node, msg, off)
{
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var selfIndex = getPlayerIndex(off);
    if(tData.curPlayer === selfIndex)
    {
        var fromOff = [];
        var fromBind = this.GetUIBind(msg.from, fromOff);
        var fnode = fromBind._node;
        var lastPutCard = tData.lastPutCard;
        var pl = sData.players[tData.uids[selfIndex] + ""];
        var i = pl.pengchigang.peng.length - 1;

        RemoveNewCardOut(fnode);

        var idx = tData.uids.indexOf(pl.info.uid);
        var offIdx = (pl.pengchigang.peng[i].pos - idx + MjClient.MaxPlayerNum)  % MjClient.MaxPlayerNum - 1;

        var idxPeng =  pl.mjpeng.length -1;
        for(var j = 0; j < 3; j++)
        {
            if(j === 1)
            {
                MjClient.playui.getNewCard(node, "up", "peng", pl.mjpeng[idxPeng], off, "heng", "heng");
            }
            else
            {
                var pengCard = MjClient.playui.getNewCard(node, "up", "peng", pl.mjpeng[idxPeng], off);
                if(j === 2){
                    pengCard.ispeng3 = true;
                }
            }
        }

        //删掉俩张stand
        if(off === 0)
        {
            RemoveNodeBack(node, "mjhand", 2, lastPutCard);
        }
        else if(off === 3)
        {
            if (MjClient.rePlayVideo === -1)
                RemoveNodeBack(node, "standPri", 2);
            else
                RemoveNodeBack(node, "mjhand_replay", 2, lastPutCard);
        }
        else
        {
            if (MjClient.rePlayVideo === -1)
                RemoveFrontNode(node, "standPri", 2);
            else
                RemoveFrontNode(node, "mjhand_replay", 2, lastPutCard);
        }

        MjClient.playui.CardLayoutRestore(node, off);
        MjClient.playui.CardLayoutRestore(fnode, fromOff[0]);

        MjClient.playui.updateMjHandColor(node);
        MjClient.playui.updateMjHandColor(fnode);
        ShowEatActionAnim(node, ActionType.PENG, off);
    }
};

// 处理等待出牌
PlayLayer_xuPuLaoPai.prototype.DealWaitPut = function(node, msg, off)
{
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var selfIndex = getPlayerIndex(off);
    if(tData.curPlayer === selfIndex)
    {
        cc.log("DealWaitPut ------------ = "+msg.card);
        if (MjClient.rePlayVideo === -1)//正常打牌流程
        {
            MjClient.playui.getNewCard(node, "stand", "standPri");
        }
        else //播放录像
        {
            var pl = getUIPlayer(off);
            if(pl){
                MjClient.playui.getNewCard(node, "up", "mjhand_replay", pl.mjhand[pl.mjhand.length-1], off);
            }else{
                cc.log('error DealWaitPut pl is null off:', off);
            }
        }
        MjClient.playui.CardLayoutRestore(node, off);
    }
};


PlayLayer_xuPuLaoPai.prototype.updateMjHandColor = function(node){
    var children = node.children;
    var isGray = !IsTurnToMe();
    for(var i = 0; isGray && i < children.length; i ++){
        if(children[i].name === "mjhand"){
            children[i].setColor(cc.color(170, 170, 170));
        }
    }
};

PlayLayer_xuPuLaoPai.prototype.DealNewCard = function(node, msg, off)
{
    if (off === 0)
    {
        var pl = getUIPlayer(0);
        if(!pl.isQiHu)
        {
            var _skipHuIconNode = MjClient.playui._downNode.getChildByName("head").getChildByName("skipHuIconTag");
            if(_skipHuIconNode)
            {
                _skipHuIconNode.visible = !!pl.skipHu;
            }
        }

        var _skipPengIconNode = MjClient.playui._downNode.getChildByName("head").getChildByName("skipPengIconTag");
        if(_skipPengIconNode)
            _skipPengIconNode.visible = false;
    }

    //创建一个麻将，msg为麻将的信息，数字表示。by sking
    MjClient.playui.getNewCard(node, "stand", "mjhand", msg, off);
    MjClient.playui.CardLayoutRestore(node, 0);
};

/*
     UI,房间信息：玩法名称，房间号，时间，电池，信号
 */
PlayLayer_xuPuLaoPai.prototype.showPlayUI_roundInfo = function(strInfo, tableId)
{
    if(!strInfo)
        strInfo = MjClient.playui._downNode.getParent().getChildByName("roundInfo").getString();

    if(!tableId)
        tableId = MjClient.isInGoldFieldNormal()?(getJinbiStr(MjClient.data.sData.tData.fieldBase)+"金币"):MjClient.data.sData.tData.tableId;

    if (!cc.sys.isObjectValid(MjClient.playui)) {
        cc.log(" ======= 没有找到桌面======");
        return;
    }

    var _bannerNode = MjClient.playui._downNode.getParent().getChildByName("banner");
    if (_bannerNode) {
        var _helpDisc = _bannerNode.getChildByName("btn_help");
        var _bg_disc = _helpDisc.getChildByName("bg_disc");
        _bg_disc.visible = false;

        // 创建玩法列表
        var createCopyDise = function () {
            _bg_disc.visible = true;
            _bg_disc.setScale(2);
            var _text = _bg_disc.getChildByName("Text_disc");
            _text.setVisible(false);
            var _maxWidth =  _bg_disc.getContentSize().width;   //子串最长串宽度，默认框宽度，超过则自动增长
            var _discGap = _text.height/2;            //目录留出一个字符一半高度的间隙
            var _tempList = [];                       //临时数组
            var newStr = strInfo.split(",");          //字符分割
            for(var i = 0; i < newStr.length; i++)
            {
                if (newStr[i].length <= 12) continue;
                var tempStr = newStr[i];
                newStr[i] = tempStr.substr(0, 12);
                newStr.splice(i, 0, tempStr.substr(12));
            }

            var len = newStr.length;
            var size = len > 19 ? 14 : _text.getFontSize();
            for(var i = 0; i < newStr.length; i++)
            {
                var _textCopy = _text.clone();
                _textCopy.setFontSize(size);
                _textCopy.setVisible(true);
                _textCopy.ignoreContentAdaptWithSize(true);
                _textCopy.setString(newStr[i]);
                _tempList.push(_textCopy);
                _bg_disc.addChild(_textCopy);
                _maxWidth = _textCopy.getContentSize().width > _maxWidth ? _textCopy.getContentSize().width : _maxWidth;
            }
            
            _bg_disc.ignoreContentAdaptWithSize(true);
            _bg_disc.setContentSize(_maxWidth * 1.05, _textCopy.getContentSize().height * (newStr.length + 1) * 1.25);

            for(var i = 0; i < _tempList.length; i++)
            {
                _tempList[i].setPosition(_bg_disc.getContentSize().width * 0.5, _discGap + _textCopy.getContentSize().height * i * 1.25);
            }
        }();

        _bg_disc.runAction(cc.sequence(
            cc.scaleTo(0.2, 1.5).easing(cc.easeBackOut()),
            cc.delayTime(5),
            cc.scaleTo(0.2, 0).easing(cc.easeBackIn()),
            cc.callFunc(function(){
                _bg_disc.visible = false;
            })
        ).repeat(1));

        _helpDisc.addTouchEventListener(function(sender, type) {
            if (type == 2) {
                _bg_disc = sender.getChildByName("bg_disc");
                if (_bg_disc.visible) {
                    _bg_disc.runAction(cc.sequence(
                        cc.scaleTo(0.2, 0).easing(cc.easeBackIn()),
                        cc.callFunc(function(){
                            _bg_disc.visible = false;
                        })
                    ));
                } else {
                    _bg_disc.runAction(cc.sequence(
                        cc.scaleTo(0.2, 1.5).easing(cc.easeBackOut()),
                        cc.callFunc(function(){
                            _bg_disc.visible = true;
                        })
                    ));
                }
                
            }
        });
    }
}

PlayLayer_xuPuLaoPai.prototype.getNewCard = function(node, copy, name, tag, off) {

    // cc.log(copy + " = copy ===========================off = " + off + "========tag = " + tag);
    var cpnode = node.getChildByName(copy);
    if(!cpnode) return;
    var cp = cpnode.clone(); //克隆一个白板，上面没有任何条纹的麻将 ，by sking
    var scale = cp.getScale();
    cp.setVisible(true);
    cp.setScale(scale);
    cp.setName(name);
    cp.setTag(tag);
    node.addChild(cp);
    if(tag > 0) {
        this.setCardSprite(cp, tag);
        if(name === "mjhand") {
            SetTouchCardHandler(cpnode, cp);
        }
    } else {
        if (typeof(h5) != 'undefined' && h5.nativeHelper.isWeb() ) {
            cp.loadTexture(cpnode._textureFile);
        } else {
            cp.loadTexture(cpnode.getRenderFile().file);
        }
    }
    return cp;
};


PlayLayer_xuPuLaoPai.prototype.setCardSprite = function(node, cardTag) {
    if(!node) return;
    node.removeAllChildren();
    // 贴在麻将上面可变的图
    var path = "playing/changpai/cards/";
    node.tag = cardTag;
    node.loadTexture(path + cardTag + ".png");

    if(cc.sys.os === cc.sys.OS_WINDOWS){
        if(node.getName() === "mjhand"){
            var textNode = new ccui.Text(cardTag, "fonts/fzcy.ttf", 40);
            textNode.setColor(cc.color("#FFCC33"));
            textNode.setPosition(node.width/2, node.height + 50);
            node.addChild(textNode);
        }
    }

    if(node.getName() === "mjhand" && !node.getChildByName("tingSign")){
        var iconNode = new ccui.ImageView("playing/changpai/cards/sign_1.png");
        iconNode.setPosition(node.width/2, node.height + 20);
        iconNode.setName("tingSign");
        iconNode.setVisible(false);
        node.addChild(iconNode);
    }

    //schedulePlayMoveCardOtherSameCardGrey(node)
};

/*
    求符合出打出去能听的牌
 */
PlayLayer_xuPuLaoPai.prototype.checkOutTingCards = function(hands){

    if(!hands) return;

    handCards = hands.slice();
    var outTingCards = {};
    if (handCards.length % 3 == 2) {
        for (var i = 0; i < handCards.length; i++) {
            // var Cards = handCards.slice(0, i).concat(handCards.slice(i+1, handCards.length)); // 删除某一张牌的数组
            var Cards = handCards.slice();
            var cd = Cards.splice(i,1);
            var tingArr = Object.keys(MjClient.majiang.calTingSet(Cards));
            if (tingArr.length > 0) {
                outTingCards[cd] = tingArr;
            }
        }
    }
    cc.log(" ============= outTingCards = ", JSON.stringify(outTingCards));
    MjClient.outTingCards = outTingCards;
};

PlayLayer_xuPuLaoPai.prototype.addTouchEnventForShowCard = function(cardNode, off){
    if(!cardNode) return;
    var params = {};
    params.off = off;
    params.cardNode = cardNode;
    cardNode.setTouchEnabled(true);
    cardNode.addTouchEventListener(function (node, type) {
        if(type === ccui.Widget.TOUCH_ENDED){
            postEvent("showCardInfo", params)
        }
    }, this)
};


PlayLayer_xuPuLaoPai.prototype.cleanShowCard = function(panelNode){
    var children = panelNode.children;
    for(var c = 0; c < children.length; c ++){
        if(children[c].name === "showCard"){
            children[c].removeFromParent(true);
        }
    }
};


PlayLayer_xuPuLaoPai.prototype.showCardInfoPanel = function (panelNode, params) {
    var off = params.off,
        pl = getUIPlayer(off),
        cardNode = params.cardNode,
        cardName = cardNode.name,
        nickName = getNewName(unescape(pl.info.nickname)).toString(),
        text = panelNode.getChildByName("text"),
        stand = panelNode.getChildByName("stand"),
        prop = stand.width * stand.scale * 0.95,
        startX = panelNode.width * 0.5,
        dir = ["本家", "下家", "对家", "上家"][off],
        cardScale = 0.7, msg = "", cardArr = [];

    if(cardName === "chi" || cardName === "peng"){
        cardArr = cardArr.concat(pl.mjchi);
        for(var c = 0; c < pl.mjpeng.length; c++){
            for(var j = 0; j < 3; j ++){
                cardArr.push(pl.mjpeng[c]);
            }
        }
        msg = "吃碰牌牌堆";
    }else if(cardName === "out" || cardName === "newout"){
        cardArr = pl.mjput;
        msg = "弃牌牌堆";
    }


    stand.setVisible(false);
    if(cardArr.length <= 15){

        stand.x = startX - prop * (cardArr.length - 1)/2;
        for(var i = 0; i < cardArr.length; i++){
            var card = MjClient.playui.getNewCard(panelNode, "stand", "showCard", cardArr[i], 0);
            card.x = stand.x;
            card.y = stand.y;
            card.scale = stand.scale;
            card.visible = true;
            var endPosX = stand.x + prop * i;
            var endPosY = stand.y;
            card.runAction(cc.MoveTo(0.5, cc.p(endPosX, endPosY)));
        }

    }else{

        prop = stand.width * stand.scale * 0.95 * cardScale;
        stand.x = startX - prop * (20 - 1)/2;
        for(var i = 0; i < cardArr.length; i++){
            var card = MjClient.playui.getNewCard(panelNode, "stand", "showCard", cardArr[i], 0);
            card.x = stand.x;
            card.visible = true;
            card.scale = stand.scale * cardScale;
            card.y = stand.y - stand.height/2;
            var endPosX = stand.x + prop * i;
            var endPosY = stand.y - stand.height/2;
            if(i > 19){
                card.y = stand.y + stand.height/2;
                endPosX = stand.x + prop * (i - 20);
                endPosY = stand.y + stand.height/2;
            }
            card.runAction(cc.MoveTo(0.5, cc.p(endPosX, endPosY)));
        }
    }


    var str = "昵称:" + nickName + "\t\t" + dir + "\t" + msg;
    text.ignoreContentAdaptWithSize(true);
    text.setString(str);
};


//显示当前可以，吃，碰，杠的牌
PlayLayer_xuPuLaoPai.prototype.showCurEatCards = function(vnode) {

    // chi0  peng0  guo
    if(vnode.length === 0) return;
    var tData = MjClient.data.sData.tData,
        lastPutCard = tData.lastPutCard,
        eatBgPanel = MjClient.playui.jsBind.eat.panelBg._node,
        pl = getUIPlayer(0);

    for(var i = 0; i < vnode.length; i++){
        var btnNode = vnode[i];
        var card = btnNode.getChildByName("card");
        var cardVal = 0;
        btnNode.visible = true;
        setWgtLayout(btnNode, [0, 0.16], [0.6, 0], [(1 - vnode.length) / 1.8 + i * 1.4, 2.8], false, false);

        if((btnNode.getName() === "chi0")|| btnNode.getName() === "peng"){
            cardVal = lastPutCard;
        }else if(btnNode.getName() === "hu"){
            if(IsTurnToMe()) {
                cardVal = pl.mjhand[pl.mjhand.length - 1];
            } else {
                cardVal = tData.lastPutCard;
            }
        }

        if(card){
            card.setVisible(false);
            if(cardVal && cardVal > 0){
                card.setVisible(true);
                MjClient.playui.setCardSprite(card, cardVal);
                card.zIndex = 1000;
                eatBgPanel.setVisible(true);
            }
        }
    }
};


/*
 听牌之后，还可以显示张数（晋中麻将玩法,除乡宁摔金）
 */
PlayLayer_xuPuLaoPai.prototype.setTingCards = function(node, tingSet)
{
    return; //取消显示听的牌
    
    if (!tingSet) {
        return;
    }

    node.zIndex = 500;
    node.visible = true;

    var cardNode0 = node.getChildByName("showNode");
    cardNode0.setVisible(false);
    var BindingNode = node.getChildByName("cardNodeList");
    BindingNode.removeAllChildren(true);

    var i = 0;
    var j = 0;//高
    var bHaveValue = false;

    var width = cardNode0.getContentSize().width * 0.29 * 2 - 5;
    var height = cardNode0.getContentSize().height * 0.28 + 5;

    for (var cd in tingSet)
    {
        var cardNode = cardNode0.clone();
        cardNode.visible = true;
        bHaveValue = true;
        if(i == 7)
        {
            j++;
            i = 0;
        }
        cardNode.setPositionX(cardNode0.getContentSize().width * 0.28 / 2 + i * width);
        cardNode.setPositionY(cardNode0.getContentSize().height * 0.28 / 2 + j * height);
        BindingNode.addChild(cardNode);
        setCardSprite(cardNode, parseInt(cd), 0);
        i++;

        var _countNode = new ccui.Text();
        _countNode.setFontName(MjClient.fzcyfont);
        _countNode.setPosition(cc.p(cardNode.getContentSize().width * 1.4, cardNode.getContentSize().height/2 + 45));
        var icount = getHuCardNum(parseInt(cd));
        _countNode.setString(icount + "");
        _countNode.setFontSize(20);
        _countNode.setScale(3.5);
        _countNode.setColor(cc.color(19,238,96));
        cardNode.addChild(_countNode);

        var _zhangNode = new ccui.Text();
        _zhangNode.setFontName(MjClient.fzcyfont);
        _zhangNode.setPosition(cc.p(cardNode.getContentSize().width * 1.4, cardNode.getContentSize().height/2 - 35));
        _zhangNode.setString("张");
        _zhangNode.setFontSize(18);
        _zhangNode.setScale(3.5);
        _zhangNode.setColor(cc.color(255,220,74));
        cardNode.addChild(_zhangNode);
    }

    if (j >= 1) i = 7;
    // 容器大小设置
    var tingCardsWidth = i * width;
    var tingCardsHeight = (j + 1) * height;
    BindingNode.setContentSize(tingCardsWidth, height);

    var showBtn = node.getChildByName("showBtn");
    if (showBtn) {
        showBtn.removeFromParent();
        showBtn = null;
    }
    if (j >= 1) {
        var showAll = false;
        // 添加显示隐藏按钮
        showBtn = new ccui.Button();
        showBtn.loadTextureNormal("png/show_up.png");
        showBtn.setAnchorPoint(0.5, 0.5);
        showBtn.setName("showBtn");
        showBtn.setPosition(cc.p(45 + tingCardsWidth + showBtn.getContentSize().width/2, 25));
        node.addChild(showBtn);
        showBtn.addTouchEventListener(function(sender, Type) {
            switch (Type) {
                case ccui.Widget.TOUCH_ENDED:
                    if (showAll) {
                        showAll = false;
                        BindingNode.height = height;
                        node.height = height;
                        showBtn.loadTextureNormal("png/show_up.png");
                    }
                    else {
                        showAll = true;
                        BindingNode.height = tingCardsHeight;
                        node.height = tingCardsHeight;
                        showBtn.loadTextureNormal("png/show_down.png");
                    }
                    break;
                default:
                    break;
            }
        }, this);
    }

    // node 节点大小设置
    var nodeWidth = 50 + tingCardsWidth;
    // if (showBtn) {
    //     nodeWidth = 45 + tingCardsWidth + showBtn.getContentSize().width + 10;
    // }
    node.setContentSize(nodeWidth, height);

    var pl = getUIPlayer(0);
    var _gameName = node.getChildByName("gamePlayTip");
    if (_gameName) {
        _gameName.removeFromParent();
        _gameName = null;
    }
    if (pl.isTing) {
        _gameName = new cc.LabelTTF("听牌自动摸打...",MjClient.fzcyfont,25);
        _gameName.setFontSize(_gameName.getFontSize());
        _gameName.setScale(0.8);
        _gameName.setName("gamePlayTip");
        _gameName.setColor(cc.color(255,220,74));
        _gameName.setAnchorPoint(0,0.5);
        _gameName.setPosition(nodeWidth, 35);
        node.addChild(_gameName);
    }

    //如果没有值则隐藏
    if (!bHaveValue) {
        node.visible = false;
    }
};

// 邀请好友按钮 等待玩家加入动画
PlayLayer_xuPuLaoPai.prototype.checkInviteVisible = function(node) {
    node.visible = false;

    var sData = MjClient.data.sData;
    var tData = sData.tData;
    if (tData.fieldId) {
        return;
    }
    node.visible = !(Object.keys(sData.players).length == tData.maxPlayer);
};


/**
 * 冲不冲？
 */
var xuPuChongLayer = cc.Layer.extend({
    nochong:null,
    chong1:null,
    chong2:null,
    chong3:null,
    chong4:null,
    ctor: function (reqCallBack) {
        this._super();
        var UI = ccs.load("xuPuChongLayer.json");
        this.addChild(UI.node);
        this.setName("xuPuChongLayer");
        var that = this;

        // 限制选择
        var pl = getUIPlayer(0);
        var limit = pl.minSelectChongScore;

        this.block = UI.node.getChildByName("block");
        setWgtLayout(this.block,[1, 1], [0.5, 0.5], [0, 0]);
        this.nochong = this.block.getChildByName("nochong");
        this.nochong.setTag(0);
        this.nochong.setEnabled(!(limit > 0));
        this.nochong.addTouchEventListener(function (sender, type) {
            if (type == 2) {
                this.requestJZ(sender.getTag(), reqCallBack)
            }
        }, this);

        for (var i = 1; i <= 4; i++) {
            this["chong" + i] = this.block.getChildByName("chong" + i);
            this["chong" + i].setTag(i);
            this["chong" + i].setEnabled(!(limit > i));
            this["chong" + i].addTouchEventListener(function(sender, type) {
                if (type == 2) {
                    this.requestJZ(sender.getTag(), reqCallBack)
                }
            }, this);

        }

        UIEventBind(null, this, "initSceneData", function()
        {
            that.removeFromParent();
        });
        UIEventBind(null, this, "LeaveGame", function()
        {
            that.removeFromParent();
        });

        UIEventBind(null, this, "endRoom", function()
        {
            that.removeFromParent();
        });
    },
    requestJZ: function(tag, reqCallBack) {
        MjClient.gamenet.request("pkroom.handler.tableMsg", {
            cmd: "MJJiazhu",
            jiazhuNum: tag,
        });
        if (reqCallBack) {
            reqCallBack();
        }
        this.removeFromParent();
        var pl = getUIPlayer(0);
        pl.mjState = TableState.isReady;
    },

});

/**
 * 古丑，不古丑
 */
var xuPuGuChouLayer = cc.Layer.extend({
    noGu:null,
    guChou:null,
    ctor: function (reqCallBack) {
        this._super();
        var UI = ccs.load("xuPuGuChouLayer.json");
        this.addChild(UI.node);
        this.setName("xuPuGuChouLayer");
        var that = this;

        this.block = UI.node.getChildByName("block");
        setWgtLayout(this.block,[1, 1], [0.5, 0.5], [0, 0]);
        this.noGu = this.block.getChildByName("noGu");
        this.noGu.setTag(0);
        this.noGu.addTouchEventListener(function (sender, type) {
            if (type == 2) {
                this.requestJZ(sender.getTag(), reqCallBack)
            }
        }, this);


        this.guChou = this.block.getChildByName("guChou");
        this.guChou.setTag(1);
        this.guChou.addTouchEventListener(function (sender, type) {
            if (type == 2) {
                this.requestJZ(sender.getTag(), reqCallBack)
            }
        }, this);



        UIEventBind(null, this, "initSceneData", function()
        {
            that.removeFromParent();
        });
        UIEventBind(null, this, "LeaveGame", function()
        {
            that.removeFromParent();
        });
    },
    requestJZ: function(tag, reqCallBack) {
        MjClient.gamenet.request("pkroom.handler.tableMsg", {
            cmd: "selectGuChou",
            guChouValue: tag,
        });
        if (reqCallBack) {
            reqCallBack();
        }
        this.removeFromParent();
    },

});




PlayLayer_xuPuLaoPai.prototype.cleanMingCard = function(panelNode){
    var showBg = panelNode.getChildByName("bg");
    var children = showBg.children;
    for(var c = 0; c < children.length; c ++){
        if(children[c].name !== "stand"){
            children[c].removeFromParent(true);
        }
    }
};

PlayLayer_xuPuLaoPai.prototype.countMingCardData = function () {
    var dict = {};
    for(var off = 0; off < 4; off ++){
        var pl = getUIPlayer(off);
        if(!pl) continue;

        var mjput = pl.mjput.slice();
        for(var i = 0; mjput, i < mjput.length; i ++) {
            dict[mjput[i]] = dict[mjput[i]] ? dict[mjput[i]] + 1 : 1;
        }


        var mjchi = pl.mjchi.slice();
        for(var j = 0; mjchi, j < mjchi.length; j ++) {
            dict[mjchi[j]] = dict[mjchi[j]] ? dict[mjchi[j]] + 1 : 1;
        }


        var mjpeng = pl.mjpeng.slice();
        for(var k = 0; mjpeng, k < mjpeng.length; k ++) {
            dict[mjpeng[k]] = dict[mjpeng[k]] ? dict[mjpeng[k]] + 3 : 3;
        }
    }
    return dict;
};

PlayLayer_xuPuLaoPai.prototype.showMingCardInfoPanel = function (panelNode) {
    var wanArr = [1,  2,  3,  4,  5,  6,  7,  8,  9],
        benArr = [11, 12, 13, 14, 15, 16, 17, 18, 19],
        suoArr = [21, 22, 23, 24, 25, 26, 27, 28, 29],
        huaArr = [31, 32, 33],
        cardArr = [wanArr, benArr, suoArr, huaArr],
        showBg = panelNode.getChildByName("bg"),
        stand = showBg.getChildByName("stand"),
        ph = showBg.height,
        pw = showBg.width,
        scal = stand.scale,
        prop = stand.width * scal * 2,
        yArray = [ph * 0.77, ph * 0.55, ph * 0.34, ph * 0.13],
        xStart = pw * 0.12,
        tData = MjClient.data.sData.tData,
        hua = tData.areaSelectMode.hua,
        dict = this.countMingCardData();

    stand.setVisible(false);
    Outer: for(var num = 0; num < 4; num++) {
        for(var i = 0; i < 9; i++) {
            if(!cardArr[num][i]) break Outer;
            var card = MjClient.playui.getNewCard(showBg, "stand", "mingCard", cardArr[num][i], 0);
            card.y = yArray[num];
            card.x = xStart + i * prop;
            card.scale = scal;
            card.visible = true;
            card.zIndex = 2;

            var text = new ccui.Text(),
                str = dict[card.tag] ? dict[card.tag] : "-";
            text.zIndex = 2;
            text.setString(str);
            text.setColor(cc.color("#CC0000"));
            text.setFontSize(45);
            text.setFontName(MjClient.fzcyfont);
            text.setPosition(card.width/2, card.height + 20);
            card.addChild(text);

            var cardBg = new ccui.ImageView("playing/xuPuLaoPai/cardBg.png");
            showBg.addChild(cardBg);
            cardBg.scale = 0.85;
            cardBg.x = card.x;
            cardBg.y = card.y + 5;
            cardBg.zIndex = 1;

            // 不带花, 花牌置灰
            if(hua === 0) {
                if(huaArr.indexOf(card.tag) > -1) {
                    card.setColor(cc.color(170, 170, 170));
                }
            }
        }
    }
};