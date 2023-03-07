var actionZindex = 1000;
function getUIPlayer_daZhaDan(off) {
    var sData = MjClient.data.sData;
    var tData = sData.tData;

    // 4人选择分组阶段
    // if ((tData.tState == TableState.waitJoin || tData.tState == TableState.waitReady) && (tData.maxPlayer == 4 && tData.areaSelectMode.isDivideTeam)) {
    //     return sData.players[tData.inTeamUids[off]];
    // } else 
    {
        var uids = tData.uids;
        var index = getPlayerIndex(off);
        if(index < uids.length)
        {
            return sData.players[uids[index]];
        }

        return null;
    }
}

function setHeadImg_daZhaDan(node, off) {
    var pl = getUIPlayer_daZhaDan(off);
    var head = node.getChildByName("head");
    var nobody = head.getChildByName("nobody");
    var WxHead = nobody.getChildByName("WxHead");
    if (pl) {
        var url = pl.info.headimgurl || "png/default_headpic.png";
        cc.loader.loadImg(url, {isCrossOrigin: true}, function(err, texture) {
            if (!err && texture) {
                if (WxHead && cc.sys.isObjectValid(nobody)) {
                    WxHead.removeFromParent(true);
                }
                WxHead = null;
                //缓存头像
                postEvent( "QueueNetMsg",["loadWxHead",{uid:pl.info.uid,img:texture}]);

                var sp = new cc.Sprite(texture);
                sp.setName("WxHead");
                if(nobody && cc.sys.isObjectValid(nobody)){
                    nobody.addChild(sp);
                    setWgtLayout(sp, [0.91, 0.91], [0.5, 0.5], [0, 0], false, true);
                }
                
            }
        });
    }
}

// off 是四个位置，根据off 显示四个位置的信息 by sking
function SetUserVisible_daZhaDan(node, off) {
    var pl = getUIPlayer_daZhaDan(off);
    var head = node.getChildByName("head");
    var name = head.getChildByName("name");
    var nobody = head.getChildByName("nobody");
    var coin = head.getChildByName("coin");
    var offline = head.getChildByName("offline");
    var name_bg = head.getChildByName("name_bg");

    // 分组信息
    var sData = MjClient.data.sData;
    var tData = sData.tData;

    if (pl) {
        head.visible = true;
        name.visible = true;
        coin.visible = true;
        offline.visible = true;
        coin.visible = true;
        // name_bg.visible = true;
        // score_bg.visible = true;

        // MjClient.loadWxHead(pl.info.uid, pl.info.headimgurl);
        setHeadImg_daZhaDan(node, off);
        setUserOffline_daZhaDan(node, off);
        InitUserHandUI_daZhaDan(node, off);
    } else {
        head.visible = false;
        name.visible = false;
        coin.visible = false;
        offline.visible = false;
        coin.visible = false;
        var WxHead = nobody.getChildByName("WxHead");
        if (WxHead)
            WxHead.removeFromParent(true);
    }
}

function updateZuInfo_daZhaDan(node, off) {
    // 分组信息
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var head = node.getChildByName("head");
    var zu = head.getChildByName("zu");
    if (tData.maxPlayer != 4 || !tData.areaSelectMode.isDivideTeam) {
        zu.visible = false;
    } else {
        zu.visible = true;
        var src = "";
        if ((tData.tState == TableState.waitJoin || tData.tState == TableState.waitReady)) {
            src = off % 2 == 0 ? "daZhaDan/duiYou.png" : "daZhaDan/duiYou.png";
        } else {
            src = pl.teamid == "A" ? "daZhaDan/duiYou.png" : "daZhaDan/duiYou.png";
        }
        zu.loadTexture(src);
    }
}

// 4人分组时候更新对应位置玩家信息
function updateHeadInfo_daZhaDan(node, off) {
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    // 4人选择分组阶段
    if (!((tData.tState == TableState.waitJoin || tData.tState == TableState.waitReady) && (tData.maxPlayer == 4 && tData.areaSelectMode.isDivideTeam))) {
        return;
    }

    var pl = getUIPlayer_daZhaDan(off);
    var head = node.getChildByName("head");
    var name = head.getChildByName("name");
    var nobody = head.getChildByName("nobody");
    var coin = head.getChildByName("coin");
    var offline = head.getChildByName("offline");
    var name_bg = head.getChildByName("name_bg");
    if (pl) {
        name.visible = true;
        coin.visible = true;
        offline.visible = true;
        coin.visible = true;

        setHeadImg_daZhaDan(node, off);
        InitUserCoinAndName_daZhaDan(node, off);
    } else {
        name.visible = false;
        coin.visible = false;
        offline.visible = false;
        coin.visible = false;
        var WxHead = nobody.getChildByName("WxHead");
        if (WxHead)
            WxHead.removeFromParent(true);
    }
}

function InitUserHandUI_daZhaDan(node, off) {
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var pl = getUIPlayer_daZhaDan(off);

    if (!pl) {
        return;
    }

    //初始化玩家金币和名称
    InitUserCoinAndName_daZhaDan(node, off);
    setAreaTypeInfo(true);
    currentLeftCardCount_daZhaDan(off);

    // initSortUI();

    if (
        tData.tState != TableState.waitPut &&
        tData.tState != TableState.waitEat &&
        tData.tState != TableState.waitCard && 
        tData.tState != TableState.waitBao
    ) {
        return;
    }

    //添加手牌
    if (MjClient.rePlayVideo == -1) // 表示正常游戏
    {
        if (pl.mjhand && off == 0) { //只初始化自己的手牌
            var arr = [];
            var copyArr = pl.mjhand.concat();
            cc.log("copyArr:", copyArr);
            copyArr = MjClient.majiang.sortCard(copyArr, MjClient.data.sData.tData.areaSelectMode, MjClient.majiang.sortType);
            cc.log("copyArr:", copyArr);

            for (var i = 0; i < copyArr.length; i++) {
                var info = new daZhaDan.CardInfo();
                info.type = copyArr[i];
                arr.push(info);
            }

            initCardList_daZhaDan();

            var cardList = node.cardList;
            cardList.addCards(arr, false);
            if (cardList) {
                var tData = MjClient.data.sData.tData;
                if (!IsTurnToMe() || tData.tState != TableState.waitPut) {
                    cardList.showBtnNode(false);
                } else {
                    // cardList.showBtnNode(true);
                }
            }
        } else if (off > 0) {

        }
    } else {
        /*
            播放录像
        */
        if (pl.mjhand) {
            // if(off == 0)
            // {
            //     for (var i = 0; i < pl.mjhand.length; i++) {
            //         getNewCard_card(node, "stand", "mjhand", pl.mjhand[i], off);
            //     }
            // }
            // else
            // {
            //     for (var i = 0; i < pl.mjhand.length ; i++) {
            //         getNewCard_card(node, "stand", "mjhand_replay", pl.mjhand[i], off);
            //     }
            // }
            var arr = [];
            var copyArr = pl.mjhand.concat();
            
            cc.log("copyArr:", copyArr);
            copyArr = MjClient.majiang.sortCard(copyArr, MjClient.data.sData.tData.areaSelectMode, MjClient.majiang.sortType);
            cc.log("copyArr:", copyArr);
            for (var i = 0; i < copyArr.length; i++) {
                var info = new daZhaDan.CardInfo();
                info.type = copyArr[i];
                arr.push(info);
            }

            initCardList_daZhaDan();

            var cardList = node.cardList;
            cardList.addCards(arr, true);
            if (cardList) {
                // var tData = MjClient.data.sData.tData;
                // if(!IsTurnToMe() || tData.tState != TableState.waitPut)
                // {
                //     cardList.showBtnNode(false);
                // }
                // else
                // {
                //     cardList.showBtnNode(true);
                // }
            }
        }
    }
}

function showPaiMianFen_daZhaDan(node, data){
    var zfTxt = node.getChildByName("zfTxt");
    zfTxt.ignoreContentAdaptWithSize(true);
    zfTxt.setString(data.score_draw !== undefined ? data.score_draw : "0");

    var obj = data.stats_draw ? data.stats_draw : {"5":0, "10":0, "13":0};
    var fen5Txt = node.getChildByName("fen5Txt");
    fen5Txt.ignoreContentAdaptWithSize(true);
    fen5Txt.setString(obj["5"]);

    var fen10Txt = node.getChildByName("fen10Txt");
    fen10Txt.ignoreContentAdaptWithSize(true);
    fen10Txt.setString(obj["10"]);

    var fenKTxt = node.getChildByName("fenKTxt");
    fenKTxt.ignoreContentAdaptWithSize(true);
    fenKTxt.setString(obj["13"]);
}

//小局结算后清空本地数据
function clearJiFen_daZhaDan(){
    var sData = MjClient.data.sData;
    //4人
    var teams = sData.teams;
    for(var tid in teams){
        var team = teams[tid];

        team.score_draw = 0;
        // team.score_spclType = 0;
    }
    // 2 3人
    var plList = sData.players;
    var i = 0;
    for(var n in plList){
        var pl = plList[n];
        pl.score_draw = 0;
        // pl.score_spclType = 0;
        i++
    }


    postEvent("clearScoreDTZ",{});
    cc.log("post clearScoreDTZ");
    
}


var PlayLayer_daZhaDan = cc.Layer.extend({
    _btnPutCard:null,
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
                // resetFlowerNum(this);
                // resetJiaZhuNum(this);
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
                if (ipmsg.length > 0) {
                    if(cc.sys.OS_WINDOWS != cc.sys.os)
                    {
                        AlertSameIP(ipmsg.join("\n"));
                    }
                }
                mylog("ipmsg " + ipmsg.length);

                //距离位置显示
                var data = [[0.25, 0.25], [0.5, 0.72], [0, 0]];
                //checkCanShowDistance(data);

                clearJiFen_daZhaDan();

                for(var i = 0;i < MjClient.MaxPlayerNum;i++)
                {
                    currentLeftCardCount_daZhaDan(i);
                }

            },
            changePosition: function(msg) {
                /*
                   换位置
              */
                var currentSelectCard = msg.selectedCard;
                var change_uids  = msg.uids;
                var sData = MjClient.data.sData;
                var tData = sData.tData;
                var current_uids = tData.uids;

                cc.log("changePosition change_uids = " + JSON.stringify(change_uids));
                cc.log("changePosition current_uids = " + JSON.stringify(current_uids));


                //初始化手牌张数
                if (msg.handCounts) {
                    var sData = MjClient.data.sData;
                    for (var uid in msg.handCounts) {
                        var pl = sData.players[uid];
                        pl.handCount = msg.handCounts[uid];
                        //cc.log("初始化手牌张数 .handCount =" + pl.handCount);
                    }
                }

                for(var i = 0;i < MjClient.MaxPlayerNum;i++)
                {
                    currentLeftCardCount_daZhaDan(i);
                }

                //回放的时候
                if(MjClient.rePlayVideo != -1)
                {
                    tData.uids = msg.uids;//要更新uid位置
                    resetPlayerHead_daZhaDan();
                }
                else
                {
                    //牌的翻的效果,正常打牌
                    cardRollAction(currentSelectCard,function(){

                        var _toNodePos = [];
                        for(var i = 0;i < change_uids.length; i++)
                        {
                            var _toNode   = getNode_cards(i).getChildByName("head");
                            _toNodePos.push(_toNode.getPosition());
                        }

                        for(var i = 0;i < change_uids.length; i++)
                        {

                            var change_UIoff = card_getUiOffByUid(change_uids[i],change_uids);

                            var current_UIoff = card_getUiOffByUid(change_uids[i],current_uids);

                            if(change_UIoff != current_UIoff)
                            {
                                changePositionByUIoff(current_UIoff, _toNodePos[change_UIoff]);
                            }
                        }
                        tData.uids = msg.uids;//要更新uid位置
                        MjClient.playui.runAction(cc.sequence(cc.delayTime(0.3), cc.callFunc(function () {
                            resetPlayerHead_daZhaDan();
                        })));
                    });
                }
            },
            MJChat : function(data){
                if(data.type == 4){
                    //距离位置显示
                    var data = [[0.25, 0.25], [0.5, 0.72], [0, 0]];
                    //checkCanShowDistance(data);
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
                mylog(JSON.stringify(msg));
                if (msg.showEnd) this.addChild(new GameOverLayer_daZhaDan(),500);
                else
                    MjClient.Scene.addChild(new StopRoomView());
            },
            roundEnd: function() {
                var self = this;
                function delayExe()
                {
                    MjClient.playui._downNode.throwList.scale /= 0.55;
                    MjClient.playui._rightNode.throwList.scale /= 0.55;
                    MjClient.playui._topNode.throwList.scale /= 0.55;   
                    MjClient.playui._topNode.throwList.y -= 20;   
                    MjClient.playui._leftNode.throwList.scale /= 0.55;

                    var sData = MjClient.data.sData;
                    //resetEatActionAnim();
                    if (sData.tData.roundNum <= 0) {
                        var layer = new GameOverLayer_daZhaDan();
                        layer.setVisible(false);
                        self.addChild(layer);
                    }
                    postEvent("clearRankIcon_daZhaDan", {}); //只为了清除排名标记
                    self.addChild(new EndOneView_daZhaDan(), 500);
                }

                function showHandCards() {
                    MjClient.playui._downNode.throwList.scale *= 0.55;
                    MjClient.playui._rightNode.throwList.scale *= 0.55;
                    MjClient.playui._topNode.throwList.scale *= 0.55;   
                    MjClient.playui._topNode.throwList.y += 20;   
                    MjClient.playui._leftNode.throwList.scale *= 0.55;

                    MjClient.playui._downNode.throwList.showHandCards(getUIPlayer(0).mjhand);
                    MjClient.playui._rightNode.throwList.showHandCards(getUIPlayer(1).mjhand);
                    MjClient.playui._topNode.throwList.showHandCards(getUIPlayer(2).mjhand);   
                    MjClient.playui._leftNode.throwList.showHandCards(getUIPlayer(3).mjhand);
                } 
                this.runAction(cc.sequence(cc.DelayTime(0.5), cc.callFunc(showHandCards), cc.DelayTime(2), cc.callFunc(delayExe)));

                MjClient.playui.showAndHideHeadEffect();
            },
            moveHead: function() {
                postEvent("returnPlayerLayer");
                tableStartHeadMoveAction_daZhaDan(this);
            },
            initSceneData: function() {
                this.stopAllActions();
                reConectHeadLayout_daZhaDan(this);
                CheckRoomUiDelete();
                var sData = MjClient.data.sData;
                var tData = sData.tData;
                if(tData.tState == TableState.waitPut )
                {
                    UpdataCurrentPutCard_daZhaDan();
                }

                for(var i = 0;i < MjClient.MaxPlayerNum;i++)
                {
                    currentLeftCardCount_daZhaDan(i);
                }

                tableStartHeadMoveAction_paohuzi(this);   //不涉及到头像移动动作
                var data = [[0.25, 0.25], [0.5, 0.72], [0, 0]];
                //checkCanShowDistance(data);

                // this.addChild(new GameOverLayer_daZhaDan());

                MjClient.playui.showAndHideHeadEffect();

                var cardList = MjClient.playui._downNode.cardList;
                if(cardList){
                    cardList.upBtnNode();
                }
            },
            onlinePlayer: function() {
                reConectHeadLayout_daZhaDan(this);
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
            PKPut: function(){
                for(var i = 0;i < MjClient.MaxPlayerNum;i++)
                {
                    currentLeftCardCount_daZhaDan(i);
                }
                MjClient.playui.showAndHideHeadEffect();
            },
            waitPut: function(){
                MjClient.playui.showAndHideHeadEffect();
                if(this.throwList && !MjClient.data.sData.tData.lastPutCard){
                    this.throwList.hideCards();
                }
            },
            waitBao : function(){
                var cardList = MjClient.playui._downNode.cardList;
                if(cardList){
                    cardList.upBtnNode();
                }
                MjClient.playui.showAndHideHeadEffect();
            },
            waitFindFriend : function(){
                var cardList = MjClient.playui._downNode.cardList;
                if(cardList){
                    cardList.upBtnNode();
                    cardList.grayNotFindCards();
                }
                MjClient.playui.showAndHideHeadEffect();
            },
            PKBao : function(){
                var cardList = MjClient.playui._downNode.cardList;
                if(cardList){
                    var tData = MjClient.data.sData.tData;
                    if (!IsTurnToMe() || tData.tState != TableState.waitPut) {
                        cardList.showBtnNode(false);
                    }
                }

                showFangzhuTagIcon_daZhaDan(MjClient.playui._downNode.getChildByName("head"), 0);
                showFangzhuTagIcon_daZhaDan(MjClient.playui._rightNode.getChildByName("head"), 1);
                showFangzhuTagIcon_daZhaDan(MjClient.playui._topNode.getChildByName("head"), 2);
                showFangzhuTagIcon_daZhaDan(MjClient.playui._leftNode.getChildByName("head"), 3);
            }
        },
        back: {
            back: {
                _run: function() {
                    changeGameBg(this);

                //     var text = new ccui.Text();
                //     text.setFontName(MjClient.fzcyfont);
                //     text.setFontSize(20);
                //     text.setAnchorPoint(0,0.5);
                //     text.setPosition(23.5, this.height - 20.5);
                //     this.addChild(text);
                //     text.schedule(function(){
                //         var time = MjClient.getCurrentTime();
                //         var str = time[0]+"/"+time[1]+"/"+ time[2]+" "+
                //             (time[3]<10?"0"+time[3]:time[3])+":"+
                //             (time[4]<10?"0"+time[4]:time[4])+":"+
                //             (time[5]<10?"0"+time[5]:time[5]);
                //         this.setString(str);
                //     });
                },
                _event: {
                    changeGameBgEvent: function(d) {
                        changeGameBg(this, null, d);
                    }
                },
                _layout: [
                    [1, 1],
                    [0.5, 0.5],
                    [0, 0], true
                ],
            },
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
                [0.5, 0.48],
                [0, 0]
            ]
        },
        roundInfo:{
            _layout: [
                [0.12, 0.12],
                [0.5, 0.38],
                [0, 0]
            ],
            _run:function()
            {
                var tData = MjClient.data.sData.tData;

                var str = MjClient.playui.getGameInfoString("roundInfo");
                this.setString(str);
                this.ignoreContentAdaptWithSize(true);
            },
            _event:{
                mjhand:function()
                {
                    // var tData = MjClient.data.sData.tData;
                    // var str = "剩余"+(tData.roundNum - 1)+"局";
                    // var str1 = MjClient.playui.getGameInfoString("roundInfo");
                    // if (str1.length > 0)
                    //     str += "," + str1;
                    // this.setString(str);
                },
            }
        },
        banner: {
            _layout: [
                [100/1280, 0],
                [0.6058, 1.08],
                [0, 0]
            ],
            bg_time:{
                 _run:function()
                {
                    var text = new ccui.Text();
                    text.setFontName(MjClient.fzcyfont);
                    text.setFontSize(20);
                    
                    text.setAnchorPoint(1,0.5);
                    text.setPosition(58, 13);
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
                    //cc.log("powerBar_run");
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
            Button_1: {
                _visible : false,
                _click: function() {
                    MjClient.openWeb({url:MjClient.GAME_TYPE.PAO_DE_KUAI,help:true});
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
                            this.visible = false;
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
                            this.visible = true;
                            this.setScale(1);
                            this.setPosition(-296,-280);
                            var HuncardMsg = MjClient.data.sData.tData.hunCard;

                            var func = cc.callFunc(function(){
                                playEffect("hunCardFly");
                            })
                            setCardSprite(this, parseInt(HuncardMsg), 4);
                            this.runAction(cc.sequence(cc.delayTime(1),
                                cc.spawn(cc.scaleTo(0.6,0.5),cc.moveTo(0.6,6.6,1.86)).easing(cc.easeQuinticActionOut()),
                                func));
                        },
                        initSceneData:function()
                        {
                            this.visible = true;
                            var HuncardMsg = MjClient.data.sData.tData.hunCard;
                            if(HuncardMsg)
                            {
                                setCardSprite(this, parseInt(HuncardMsg), 4);
                            }
                        },
                        roundEnd:function (eD) {
                            this.visible = false;
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
                        this.visible = true;
                    },
                    initSceneData:function()
                    {
                        this.visible = true;
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;
                        //cc.log(" tData.tState  ------------sking = " + tData.tState );
                        if(tData.tState != TableState.waitPut &&
                            tData.tState != TableState.waitEat &&
                            tData.tState != TableState.waitCard
                        )
                        {
                            this.visible = false;
                        }else{
                            this.visible = true;
                        }
                    }
                }
            },
            jushu:{
                _run: function() {
                    this.ignoreContentAdaptWithSize(true);
                    var tData = MjClient.data.sData.tData;
                    if(tData.roundNum){
                        this.setString("第" + (tData.roundAll - tData.roundNum + 1) + "局");
                    }else{
                        this.setString("第1局");
                    }
                    
                },
                _event:{
                    mjhand:function()
                    {
                        var tData = MjClient.data.sData.tData;
                        if(tData.roundNum){
                            this.setString("第" + (tData.roundAll - tData.roundNum + 1) + "局");
                        }else{
                            this.setString("第1局");
                        }
                    },
                    initSceneData:function()
                    {
                        var tData = MjClient.data.sData.tData;
                        if(tData.roundNum){
                            this.setString("第" + (tData.roundAll - tData.roundNum + 1) + "局");
                        }else{
                            this.setString("第1局");
                        }
                    }
                }
                
            },
            tongji : {
                _run: function() {
                    this.visible = false;

                    this.showScore = function() {
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;
                        if (tData.baoType != 2) {
                            return;
                        }

                        this.visible = true;
                        var players = sData.players;
                        var ourFen = 0;
                        var otherFen = 0;
                        var pl = players[SelfUid()];
                        for (var uid in players) {
                            var p = players[uid];
                            if (p.info.uid == pl.info.uid || p.friendUid == pl.info.uid) {
                                ourFen += p.score_draw;
                            } else {
                                otherFen += p.score_draw;
                            }
                        }
                        var ourSide = this.getChildByName("ourSide");
                        var otherSide = this.getChildByName("otherSide");
                        ourSide.setString(ourFen);
                        otherSide.setString(otherFen);
                    }
                },
                _event:{
                    mjhand:function()
                    {
                        this.showScore();
                    },
                    initSceneData:function()
                    {
                        this.showScore();
                    },
                    TZScore:function()
                    {
                        this.showScore();
                    },
                    PKTeam : function()
                    {
                        this.showScore();
                    },
                    clearCardUI : function()
                    {
                        this.visible = false;
                    }
                }
            }
        },
        clock: {
            _layout: [
                [0.088, 0.18],
                [0.5, 0.58],
                [0, 0]
            ],
            _run:function () {
                MjClient.clockNode = this;
                this.visible = false;
                this.srcPosition = this.getPosition();
            },
            number: {
                _run:function () {
                    this.ignoreContentAdaptWithSize(true);
                },
                _event: {
                    initSceneData: function() {
                        if (MjClient.data.sData.tData.tState == TableState.waitPut)
                        {
                            // MjClient.clockNode.visible = true;
                            this.setString("00");
                            MjClient.playui.updateClockPosition(MjClient.clockNode);
                        }
                        MjClient.clockNode.visible = false;
                    },
                    waitPut: function() {
                        this.stopAllActions();
                        // MjClient.clockNode.visible = true;
                        stopEffect(playTimeUpEff);
                        MjClient.playui.clockNumberUpdate(this);
                        MjClient.playui.updateClockPosition(MjClient.clockNode);
                    },
                    PKPut: function(msg) {
                        if (msg.uid == SelfUid()) {
                            this.stopAllActions();
                            stopEffect(playTimeUpEff);
                            playTimeUpEff = null;
                            MjClient.playui.clockNumberUpdate(this);
                            this.setString("00");
                        }
                    },
                    roundEnd: function() {
                        this.stopAllActions();
                        stopEffect(playTimeUpEff);
                        playTimeUpEff = null;
                    },
                    onlinePlayer: function() {
                        MjClient.clockNode.visible = false;
                    },
                    LeaveGame: function() {
                        this.stopAllActions();
                        stopEffect(playTimeUpEff);
                        playTimeUpEff = null;
                    }
                }
            },
        },
        delroom: {
                _layout: [
                    [68/1280, 0],
                    [0.9649, 0.16],
                    [0, 0]
                ],
                _run:function(){
                    if(MjClient.rePlayVideo !== -1){
                        this.visible = false;
                    }
                    // setWgtLayout(this, [0.12, 0.12],[0.13, 0.62],[0, 0]);
                    this.visible = false;
                    if(isIPhoneX()){
                        setWgtLayout(this, [68/1280 * 0.88, 0], [0.9649, 0.13], [0, 0]);
                    }
                },
                _click: function() {
                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Jiesanfangjian", {uid:SelfUid(), gameType:MjClient.gameType});

                    MjClient.delRoom(true);
                },
                _event: {
                    mjhand: function(eD) {
                        this.visible = false;
                    },
                    initSceneData : function(){
                        var tData = MjClient.data.sData.tData;
                        if(tData.tState > TableState.waitReady){
                            //牌局开始后隐藏按钮
                            this.visible = false;
                        }
                    }
                }
            },
        backHomebtn: {
            _layout: [
                [68/1280, 0],
                [0.9649, 0.2668],
                [0, 0]
            ],
            _run:function(){
                if(MjClient.rePlayVideo !== -1){
                    this.visible = false;
                }
                this.visible = false;
                // setWgtLayout(this, [0.12, 0.12],[0.04, 0.62],[0, 0]);

                if(isIPhoneX()){
                    setWgtLayout(this, [68/1280 * 0.88, 0], [0.9649, 0.2368], [0, 0]);
                }

            },
            _click: function(btn) {
                MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Likaifangjian", {uid:SelfUid(), gameType:MjClient.gameType});

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
                                if (!MjClient.enterui && !MjClient.FriendCard_main_ui)
                                    MjClient.Scene.addChild(new EnterRoomLayer());
                            },
                            function() {});
                    } else {
                        MjClient.showMsg("确定要退出房间吗？",
                            function() {
                                MjClient.leaveGame();
                                if (!MjClient.enterui && !MjClient.FriendCard_main_ui)
                                    MjClient.Scene.addChild(new EnterRoomLayer());
                            },
                            function() {});
                    }
                }
            },
            _event: {
                mjhand: function(eD) {
                    this.visible = false;
                },
                initSceneData : function(){
                    var tData = MjClient.data.sData.tData;
                    if(tData.tState > TableState.waitReady){
                        //牌局开始后隐藏按钮
                        this.visible = false;
                    }
                }
            }
        },
        wait: {
            getRoomNum: {
                _run:function(){
                    if (MjClient.remoteCfg.guestLogin)
                    {
                        setWgtLayout(this, [0.18, 0.18],[0.3, 0.5],[0, 0]);
                    }
                    else
                    {
                        setWgtLayout(this, [0.18, 0.18],[0.3, 0.5],[0.6, 0.7]);
                    }
                },
                _visible:function()
                {
                    return false;//!MjClient.remoteCfg.guestLogin;
                },
                _click: function() {
                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Fuzhifangjianxinxi", {uid:SelfUid(), gameType:MjClient.gameType});

                    /*
                     复制房间号-----------------------
                     */
                    var tData = MjClient.data.sData.tData;
                    var str1 = "打炸弹,"
                    var str2 = MjClient.playui.getGameInfoString("getRoomNum") + ",";
                    var str3 = tData.roundNum + "局,";
                    var str4 = "速度加入【"+AppCnName[MjClient.getAppType()]+"】\n" + "(复制此消息打开游戏可直接进入该房间)";
                    

                    var sData = MjClient.data.sData;
                    var numArr = ["0","一", "二", "三", "四"];
                    var str7 = numArr[Object.keys(sData.players).length] + "缺" + numArr[MjClient.data.sData.tData.maxPlayer - Object.keys(sData.players).length];
                    str7 += "(";
                    var index = 0;
                    for(var uid in sData.players){
                        var pl = sData.players[uid + ""];
                        if (!pl) continue;
                        str7 += unescape(pl.info.nickname );
                        if(index < Object.keys(sData.players).length - 1){
                            str7 += ",";
                        }
                        index ++;
                    }
                    str7 += ")";

                    GLog(str1+str2+str3+str7+str4);
                    MjClient.native.doCopyToPasteBoard("房间号:[" + tData.tableid + "]\n" + str1+str2+str3+str7+str4);
                    MjClient.showMsg("已复制房间号，请不要返回大厅。打开微信后粘贴房间信息。", function(){
                        MjClient.native.openWeixin();
                    }, function(){});
                }
            },
            wxinvite: {
                _layout: [[0.2, 0.2],[0.5, 0.55],[0, -0.5]],
                _click: function() {
                    getPlayingRoomInfo(2);
                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Yaoqingweixinhaoyou", {uid:SelfUid(), gameType:MjClient.gameType});

                    // var tData = MjClient.data.sData.tData;
                    // var str1 = "";
                    // var str2 = MjClient.playui.getGameInfoString("wxinvite") + ",";
                    // var str3 = "速度加入【"+AppCnName[MjClient.getAppType()]+"】";

                    // var sData = MjClient.data.sData;
                    // // var str7 = "二缺一";
                    // // if((MjClient.MaxPlayerNum_leiyang - Object.keys(sData.players).length) == 2){
                    // //     str7 = "一缺二";
                    // // }
                    // // str7 += "(";
                    // // var index = 0;
                    // // for(var uid in sData.players){
                    // //     var pl = sData.players[uid + ""];
                    // //     if (!pl) continue;
                    // //     str7 += unescape(pl.info.nickname );
                    // //     if(index < Object.keys(sData.players).length - 1){
                    // //         str7 += ",";
                    // //     }
                    // //     index ++;
                    // // }
                    // // str7 += ")";

                    // var numArr = ["0", "一", "二", "三", "四"];
                    // var str7 = numArr[Object.keys(sData.players).length] + "缺" + numArr[MjClient.data.sData.tData.maxPlayer - Object.keys(sData.players).length];
                    // var txt_club = tData.clubId ? "(亲友圈:" + tData.clubId + "," + getPlayersName(sData.players) +  ")" : 
                    //             "(" + getPlayersName(sData.players) + ")";
                    // var wxUrl1 = MjClient.remoteCfg.entreRoomUrl + "?vipTable=" + tData.tableid;
                    // var wxUrl2 = GameCnName[MjClient.gameType] + "  房间号:" + tData.tableid + " " + str7 + txt_club;
                    // var wxUrl3 = str1 + str2 + str3;

                    // // MjClient.native.wxShareUrl(wxUrl1, wxUrl2,wxUrl3);
                    // MjClient.shareUrlToMultiPlatform(wxUrl1, wxUrl2, wxUrl3);
                },
                _visible:function()
                {
                    return !MjClient.remoteCfg.guestLogin;
                }
            },
            
            waitFriends:{
                _layout: [[0.06, 0.06],[0.5, 0.5],[0, -4]],
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

                    if(MjClient.data.sData.tData.maxPlayer == 4){
                        this.visible = false;
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
        BtnHimt:{
            _run: function () {
                this.visible = false;
            },
        },
        BtnReady: {
            _visible: false,
            _run: function() {
                setWgtLayout(this, [0.18, 0.18], [0.5, 0.45], [0, 0]);
            },
            _click: function(_this) {
                MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Zhunbei", {uid: SelfUid(), gameType:MjClient.gameType});
                PKPassConfirmToServer_card();
            },
            _event: {
                waitReady: function() {
                    this.visible = true;
                    var tData = MjClient.data.sData.tData;
                    // if (tData.maxPlayer == 4 && tData.inTeamUids.indexOf(0) >= 0) {
                    //     this.visible = false;
                    // }
                },
                mjhand: function() {
                    this.visible = false;
                },
                initSceneData: function() {
                    this.visible = false;
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    if (tData.roundNum != tData.roundAll) {
                        return;
                    }

                    if (Object.keys(sData.players).length < tData.maxPlayer) {
                        return;
                    }

                    // if (tData.maxPlayer == 4 && tData.inTeamUids.indexOf(0) >= 0) {
                    //     return;
                    // }

                    var pl = sData.players[SelfUid()];
                    if(tData.tState == TableState.waitReady && pl.mjState == TableState.waitReady)
                    {
                        this.visible = true;
                    }
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
                TZJoinTeam: function() {
                    // if (MjClient.data.sData.tData.inTeamUids.indexOf(0) < 0) {
                    //     this.visible = true;
                    // }
                }
            }
        },
        BtnNoPut:{
            _run: function () {
                this.visible = false;
            },
        },
        BtnPutCard:{
            _run: function () {
                this.visible = false;
            },
        },
        noPutTips:{ //add by  sking for put card button
            _run: function () {
                this.visible = false;
                setWgtLayout(this,[0.39, 0], [0.5, 0.45], [0, 0]);
            },
            _event:{
                clearCardUI:function()
                {
                    this.visible = false;
                },
                mjhand:function()
                {
                    this.visible = false;
                },
            }
        },//end of add by sking
        flyCard:{
            _run: function() {
                this.visible = false;
            },
            _event:{
                // waitPut:function(eD){
                //     var tData = MjClient.data.sData.tData;
                //     if (tData.roundNum == tData.roundAll && tData.lastPutPlayer == -1) {
                //         setWgtLayout(this,[0.036, 0], [0.5, 0.75], [0, 0]);
                //         MjClient.playui.shwoFlyCardAnim(this);
                //     }
                // }
            }
        },
        down: {
            _run : function(){
                // var cardList = new daZhaDan.CardListLayer();
                // this.addChild(cardList);
                // setWgtLayout(cardList, [1, 0], [0, 0], [0, 0]);
                // this.cardList = cardList;

                // var throwList = new daZhaDan.CardThrowListLayer();
                // this.addChild(throwList);
                // this.throwList = throwList;
                // setWgtLayout(throwList, [0.4, 0], [0.45, 0.4], [0, 0]);
            },
            bottomMenu:{
                _layout: [[1280/1280, 0], [0.5, 0.04], [0, 0]],
                btn_liPai : {
                    _click : function(){
                        var pl =  MjClient.data.sData.players[SelfUid()];
                        if(pl.bao == -2 || pl.bao == -1){
                            //防止找队友时 刷掉禁用找队友的牌
                            return;
                        }
                        if(MjClient.playui._downNode.cardList){
                            MjClient.playui._downNode.cardList.doLiPai(1);
                        }
                    }
                },
                btn_510K : {
                    _click : function(){
                        // MjClient.Scene.addChild(new GameOverLayer_daZhaDan(), 500);
                        var pl =  MjClient.data.sData.players[SelfUid()];
                        if(pl.bao == -2 || pl.bao == -1){
                            return;
                        }
                        if(MjClient.playui._downNode.cardList){
                            MjClient.playui._downNode.cardList.doLiPai(2);
                        }
                    }
                },
                btn_kanFen : {
                    _click : function(){
                        if(MjClient.data.sData.tData.tState == TableState.waitPut){
                            MjClient.Scene.addChild(new DaZhaDanFenPaiLayer());
                        }
                    }
                },
            },
            head: {
                _click: function(btn) { // todo
                    showPlayerInfo_daZhaDan(0, btn);
                },
                _event: {
                    loadWxHead: function(d) {
                        // setWxHead(this, d, 0);
                    },
                    addPlayer: function() {
                        showFangzhuTagIcon_daZhaDan(this,0);
                    },
                    removePlayer: function() {
                        showFangzhuTagIcon_daZhaDan(this,0);
                    },
                    initSceneData : function(){
                        showFangzhuTagIcon_daZhaDan(this,0);
                        MjClient.playui.showOrHideTeam(this, 0);
                    },
                    mjhand : function(){
                        showFangzhuTagIcon_daZhaDan(this,0);
                        MjClient.playui.showOrHideTeam(this, 0);
                    },
                    PKTeam : function(){
                        MjClient.playui.showOrHideTeam(this, 0);
                    }
                },
                _run: function () {
                    //this.zIndex = 600;
                    showFangzhuTagIcon_daZhaDan(this,0);
                },
                zu: {
                    _run : function(){
                        this.visible = false;
                    },
                },
                zhuang: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        waitPut: function() {
                            //showUserZhuangLogo_card(this, 0);
                        },
                        initSceneData: function() {
                            //if (IsArrowVisible()) showUserZhuangLogo_card(this, 0);
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

                                showUserChat(this, 0, msg);
                            },
                            playVoice: function(voicePath) {
                                MjClient.data._tempMessage.msg = voicePath;
                                showUserChat(this, 0, MjClient.data._tempMessage);
                            }
                        }
                    }
                },
                name_bg:{_visible:false},
                rankIcon : {
                    _run : function(){
                        this.visible = false;
                    },
                    _event : {
                        initSceneData: function(eD)
                        {   
                            MjClient.playui.checkRankState(this, 0);
                        },
                        PKPut: function(){
                            MjClient.playui.checkRankState(this, 0);
                        },
                        roundEnd : function(){
                            MjClient.playui.checkRankState(this, 0, true);
                        },
                        clearRankIcon_daZhaDan : function(){
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
            ready: {
                _layout: [
                    [0.07, 0.07],
                    [0.5, 0.5],
                    [0, 0]
                ],
                _run: function() {
                    GetReadyVisible(this, 0);
                    //this.visible = true;
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
                        cc.log("============online player=======1063======");
                        GetReadyVisible(this, 0);
                    }
                }
            },
            stand: {
                _layout: [
                    [0.090, 0],
                    [0.5, 0.03],
                    [0, 0.7]
                ],
                _visible: false,
                _run: function () {
                     this.zIndex = 600;
                },
            },
            deskCard: {
                // _layout: [
                //     [0.1, 0.15],
                //     [0.6, 0],
                //     [-1.8, 2]
                // ],
                _run:function()
                {
                    setWgtLayout(this,[0.052, 0],[0.5, 0.17],[0, 3.3]);
                },
                _visible: false
            },
            noPutTag: {
                _run:function()
                {
					// this.setScale(MjClient.size.width/1280);
                    // this.setPosition(MjClient.playui._downNode.getChildByName("deskCard").getPosition());
                    setWgtLayout(this, [133/1280, 0], [0.5, 0.45], [0, 0]);
                },
                _event:{
                  PKPass:function(eD)
                  {
                      cc.log("=====PKPASS=========" + JSON.stringify(eD));
                      var UIoff = getUiOffByUid(eD.uid);
                      if(UIoff == 0)
                      {
                        DealPKPass_daZhaDan(UIoff);
                        var url = "daZhaDan/nv/buyao";
                        var pl = MjClient.data.sData.players[eD.uid];
                        playEffect(url, false, pl.info.sex);
                      }
                  }
                },
                _visible: false
            },
            _event: {
                clearCardUI: function() {
                    clearCardUI_daZhaDan(this, 0);
                },
                initSceneData: function(eD) {
                    SetUserVisible_daZhaDan(this, 0);
                    reConnectShowDeskCard_daZhaDan();
                    var pl = getUIPlayer_daZhaDan(0);
                    if(pl.mjhand && pl.mjhand.length <= 0 && pl.teamerHand && this.cardList){
                        this.cardList.showTeamHand(true, pl.teamerHand);
                    }
                },
                addPlayer: function(eD) {
                    SetUserVisible_daZhaDan(this, 0);
                },
                removePlayer: function(eD) {
                    SetUserVisible_daZhaDan(this, 0);
                },
                TZJoinTeam: function() {
                    updateHeadInfo_daZhaDan(this, 0);
                    updateZuInfo_daZhaDan(this, 0);
                },
                mjhand: function(eD) {
                    if(this.cardList){
                        this.cardList.showTeamHand(false);
                    }
                    
                    InitUserHandUI_daZhaDan(this, 0);

                    SetUserVisible_daZhaDan(this, 0);
                },
                roundEnd: function() {
                    this.cardList.showTeamHand(false);
                    InitUserCoinAndName_daZhaDan(this, 0);
                    //setTaiInfo("");
                    // this.cardList.removeFromParent();
                    // this.cardList = null;
                },
                newCard: function(eD) {
                    // cdsNums++;
                    console.log("客户端发牌组合...... ");
                    //cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>newCard---------------");
                    //var putButtn = this.getChildByName("BtnPutCard");
                    //putButtn.visible = true;
                    //MjClient.playui._btnPutCard.visible = true;
                    if (typeof(eD) == "number") {
                        eD = {newCard: eD};
                    }
                },
                PKPut: function(eD) {
                    //cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>PKPut---------------");
                    if(eD.uid == SelfUid() && MjClient.rePlayVideo == -1){
                        cc.log("===========throwList self====================");
                    }else
                    {
                        if(this.throwList){
                            // this.throwList.hideCards();
                        }
                        DealMJPut_daZhaDan(this,eD, 0);
                    }

                    var pl = getUIPlayer_daZhaDan(0);
                    if(pl.mjhand.length <= 0 && pl.teamerHand){
                        this.cardList.showTeamHand(true, pl.teamerHand);
                    }
                    
                },

                ZDTeamerHand : function(){
                    var pl = getUIPlayer_daZhaDan(0);
                    this.cardList.showTeamHand(true, pl.teamerHand);
                },

                PKPut_daZhaDan : function(eD){
                    //本地发起的事件
                    if(this.throwList){
                        this.throwList.hideCards();
                        this.throwList.showCards(eD.cards, eD.sex, true);
                    }
                },
                waitPut:function(eD){
                    cc.log(">>>>>>>>>>>>>>>>down>>>>>>>>>>>>>>>waitPut");

                    var tData = MjClient.data.sData.tData;
                    if (MjClient.playui.isShowHandCardBeiMain && (tData.curPlayer == getPlayerIndex(0) || tData.lastPutPlayer != -1)) {
                        MjClient.playui.isShowHandCardBeiMain = false;
                        MjClient.playui.hideHandCardBeiMian();
                    }

                    UpdataCurrentPutCard_daZhaDan();
                    DealWaitPut_daZhaDan(this, eD, 0);
                    if(this.throwList && !MjClient.data.sData.tData.lastPutCard){
                        this.throwList.hideCards();
                    }

                    // if(IsTurnToMe())
                    // {
                    //     this.getChildByName("noPutTag").visible = false;
                    //     MjClient.playui._downNode.cardList.showBtnNode(true);
                    //     MjClient.playui._downNode.throwList.hideCards();
                    // }else{
                    //     MjClient.playui._downNode.cardList.showBtnNode(false);
                    // }
                },
                onlinePlayer: function(eD) {
                    setUserOffline_daZhaDan(this, 0);
                },
                playerStatusChange: function(eD) {
                    setUserOffline_daZhaDan(this, 0);
                },
                TZScore: function(msg){
                    InitUserCoinAndName_daZhaDan(this, 0);

                    MjClient.playui.checkScoreState(this, 0);
                },
                TZXi : function(){
                    InitUserCoinAndName_daZhaDan(this, 0);

                    MjClient.playui.checkScoreState(this, 0);
                }
            }
        },
        right: {
            head: {
                zhuang: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        waitPut: function() {
                            //showUserZhuangLogo_card(this, 1);
                        },
                        initSceneData: function() {
                            //if (IsArrowVisible()) showUserZhuangLogo_card(this, 1);
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
                    showPlayerInfo_daZhaDan(1, btn);
                },
                _event: {
                    loadWxHead: function(d) {
                        // setWxHead(this, d, 1);
                    },
                    addPlayer: function() {
                        showFangzhuTagIcon_daZhaDan(this, 1);
                    },
                    removePlayer: function() {
                        showFangzhuTagIcon_daZhaDan(this, 1);
                    },
                    initSceneData : function(){
                        showFangzhuTagIcon_daZhaDan(this,1);
                        MjClient.playui.showOrHideTeam(this, 1);
                    },
                    mjhand : function(){
                        showFangzhuTagIcon_daZhaDan(this,1);
                        MjClient.playui.showOrHideTeam(this, 1);
                    },
                    PKTeam : function(){
                        MjClient.playui.showOrHideTeam(this, 1);
                    }
                },
                _run: function () {
                    // this.zIndex = 600;
                    showFangzhuTagIcon_daZhaDan(this,1);
                },
                name_bg:{_visible:false},
                tingCard:{
                    _visible:false,
                    _event:{
                        initSceneData: function(eD)
                        {
                            var pl = getUIPlayer_daZhaDan(1);
                            if(pl && pl.handCount)
                            {
                                this.visible = true;
                            }
                            else
                            {
                                this.visible = false;
                            }
                            if(MjClient.rePlayVideo != -1){
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

                            if(MjClient.rePlayVideo != -1){
                                this.visible = false;
                            }
                        }
                    }
                },
                rankIcon : {
                    _run : function(){
                        this.visible = false;
                    },
                    _event : {
                        initSceneData: function(eD)
                        {
                            MjClient.playui.checkRankState(this, 1);
                        },
                        PKPut: function(){
                            MjClient.playui.checkRankState(this, 1);
                        },
                        roundEnd : function(){
                            MjClient.playui.checkRankState(this, 1, true);
                        },
                        clearRankIcon_daZhaDan : function(){
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
                    [0.7, 0.65],
                    [0, 0]
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
                _layout: [
                    [0, 0.13],
                    [1, 1],
                    [-2.5, 0]
                ],
                _visible: false
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
                        setWgtLayout(this,[0.052, 0],[1, 0.70],[-3.5, 0.5]);
                    else
                        setWgtLayout(this,[0.052, 0],[1, 0.70],[-4.2, 0.5]);
                },
                _visible: false
            },
            noPutTag: {
                _run:function()
                {
					// this.setScale(MjClient.size.width/1280);
                    // this.setPosition(MjClient.playui._rightNode.getChildByName("deskCard").getPosition());
                    setWgtLayout(this, [133/1280, 0], [0.8, 0.63], [0, 0]);
                },
                _event:{
                    PKPass:function(eD)
                    {
                        var UIoff = getUiOffByUid(eD.uid);
                        if(UIoff == 1)
                        {
                            DealPKPass_daZhaDan(UIoff);
                            var url = "daZhaDan/nv/buyao";
                            var pl = MjClient.data.sData.players[eD.uid];
                            playEffect(url, false, pl.info.sex);
                        }
                    }
                },
                _visible: false
            },
            _event: {
                clearCardUI: function() {
                    clearCardUI_daZhaDan(this, 1);
                },
                initSceneData: function(eD) {
                    SetUserVisible_daZhaDan(this, 1);
                    // MjClient.playui.checkScoreState(this, 1);
                },
                addPlayer: function(eD) {
                    SetUserVisible_daZhaDan(this, 1);
                },
                removePlayer: function(eD) {
                    SetUserVisible_daZhaDan(this, 1);
                },
                TZJoinTeam: function() {
                    updateHeadInfo_daZhaDan(this, 1);
                    updateZuInfo_daZhaDan(this, 1);

                },
                mjhand: function(eD) {
                    InitUserHandUI_daZhaDan(this, 1);

                    SetUserVisible_daZhaDan(this, 1);
                },
                roundEnd: function() {
                    InitUserCoinAndName_daZhaDan(this, 1);
                    // this.cardList.removeFromParent();
                    // this.cardList = null;
                },
                waitPut: function(eD) {
                    DealWaitPut_daZhaDan(this, eD, 1);
                    if(this.throwList && !MjClient.data.sData.tData.lastPutCard){
                        this.throwList.hideCards();
                    }
                },
                PKPut: function(eD) {
                    if(this.throwList){
                        // this.throwList.hideCards();
                    }
                    DealMJPut_daZhaDan(this, eD, 1);
                    if(eD.uid != SelfUid())
                    {

                    }
                },
                onlinePlayer: function(eD) {
                    setUserOffline_daZhaDan(this, 1);
                },
                playerStatusChange: function(eD) {
                    setUserOffline_daZhaDan(this, 1);
                },
                TZScore: function(msg){
                    InitUserCoinAndName_daZhaDan(this, 1);

                    MjClient.playui.checkScoreState(this, 1);
                },
                TZXi : function(){
                    InitUserCoinAndName_daZhaDan(this, 1);

                    MjClient.playui.checkScoreState(this, 1);
                }
            }
        },
        top: {
            _run:function() {
                this.visible = MjClient.MaxPlayerNum >= 3;
            },
            head: {
                zhuang: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        waitPut: function() {
                            //showUserZhuangLogo_card(this, 2);
                        },
                        initSceneData: function() {
                            //if (IsArrowVisible()) showUserZhuangLogo_card(this, 2);
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
                                if(MjClient.data.sData.tData.maxPlayer < 3){
                                    return;
                                }
                                showUserChat(this, 2, msg);
                            },
                            playVoice: function(voicePath) {
                                if(MjClient.data.sData.tData.maxPlayer < 3){
                                    return;
                                }
                                MjClient.data._tempMessage.msg = voicePath;
                                showUserChat(this, 2, MjClient.data._tempMessage);
                            }
                        }
                    }
                },
                _click: function(btn) {
                    showPlayerInfo_daZhaDan(2, btn);
                },
                _event: {
                    loadWxHead: function(d) {
                        // setWxHead(this, d, 2);
                    },
                    addPlayer: function() {
                        showFangzhuTagIcon_daZhaDan(this, 2);
                    },
                    removePlayer: function() {
                        showFangzhuTagIcon_daZhaDan(this, 2);
                    },
                    initSceneData : function(){
                        showFangzhuTagIcon_daZhaDan(this,2);
                        MjClient.playui.showOrHideTeam(this, 2);
                    },
                    mjhand : function(){
                        showFangzhuTagIcon_daZhaDan(this,2);
                        MjClient.playui.showOrHideTeam(this, 2);
                    },
                    PKTeam : function(){
                        MjClient.playui.showOrHideTeam(this, 2);
                    }
                },
                _run: function () {
                    // this.zIndex = 600;
                    showFangzhuTagIcon_daZhaDan(this,2);
                },
                name_bg:{_visible:false},
                tingCard:{
                    _visible:false,
                    _event:{
                        initSceneData: function(eD)
                        {
                            var pl = getUIPlayer_daZhaDan(2);
                            if(pl && pl.handCount)
                            {
                                this.visible = true;
                            }
                            else
                            {
                                this.visible = false;
                            }

                            if(MjClient.rePlayVideo != -1){
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

                            if(MjClient.rePlayVideo != -1){
                                this.visible = false;
                            }
                        }
                    }
                },
                rankIcon : {
                    _run : function(){
                        this.visible = false;
                    },
                    _event : {
                        initSceneData: function(eD)
                        {
                            MjClient.playui.checkRankState(this, 2);
                        },
                        PKPut: function(){
                            MjClient.playui.checkRankState(this, 2);
                        },
                        roundEnd : function(){
                            MjClient.playui.checkRankState(this, 2, true);
                        },
                        clearRankIcon_daZhaDan : function(){
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
                // _layout: [
                //     [0.07, 0.07],
                //     [0.5, 0.8],
                //     [0, 0]
                // ],
                _run: function() {
                    if(MjClient.data.sData.tData.maxPlayer == 3){
                        setWgtLayout(this, [0.07, 0], [0.3, 0.65], [0,0]);
                    }else{
                        setWgtLayout(this, [0.07, 0], [0.5, 0.8], [0,0]);
                    }
                    
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
                _layout: [
                    [0, 0.13],
                    [0, 1],
                    [2.5, 0]
                ],
                _visible: false,
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
                        setWgtLayout(this,[0.052, 0],[0.50, 0.7],[0.5, 0.5]);
                    else
                        setWgtLayout(this,[0.052, 0],[0.16, 0.7],[1.2, 0.5]);
                },
                _visible: false,
            },
            noPutTag: {
                _run:function()
                {
					// this.setScale(MjClient.size.width/1280);
                    // this.setPosition(MjClient.playui._topNode.getChildByName("deskCard").getPosition());
                    setWgtLayout(this, [133/1280, 0], [0.5, 0.75], [0, 0]);
                    if(MjClient.MaxPlayerNum == 3){
                        setWgtLayout(this, [133/1280, 0], [0.20, 0.63], [0, 0]);
                    }
                },
                _event:{
                    PKPass:function(eD)
                    {
                        var UIoff = getUiOffByUid(eD.uid);
                        if(UIoff == 2)
                        {
                            DealPKPass_daZhaDan(UIoff);
                            var url = "daZhaDan/nv/buyao";
                            var pl = MjClient.data.sData.players[eD.uid];
                            playEffect(url, false, pl.info.sex);
                        }
                    }
                },
                _visible: false
            },
            _event: {
                clearCardUI: function() {
                    clearCardUI_daZhaDan(this, 2);
                },
                initSceneData: function(eD) {
                    SetUserVisible_daZhaDan(this, 2);
                },
                addPlayer: function(eD) {
                    SetUserVisible_daZhaDan(this, 2);
                },
                removePlayer: function(eD) {
                    SetUserVisible_daZhaDan(this, 2);
                },
                TZJoinTeam: function() {
                    updateHeadInfo_daZhaDan(this, 2);
                    updateZuInfo_daZhaDan(this, 2);

                },
                mjhand: function(eD) {
                    InitUserHandUI_daZhaDan(this, 2);

                    SetUserVisible_daZhaDan(this, 2);
                },
                roundEnd: function() {
                    InitUserCoinAndName_daZhaDan(this, 2);
                    // this.cardList.removeFromParent();
                    // this.cardList = null;
                },
                waitPut: function(eD) {
                    DealWaitPut_daZhaDan(this, eD, 2);
                    if(this.throwList && !MjClient.data.sData.tData.lastPutCard){
                        this.throwList.hideCards();
                    }
                },
                PKPut: function(eD) {
                    if(this.throwList){
                        // this.throwList.hideCards();
                    }
                    DealMJPut_daZhaDan(this, eD, 2);
                },
                onlinePlayer: function(eD) {
                    setUserOffline_daZhaDan(this, 2);
                },
                playerStatusChange: function(eD) {
                    setUserOffline_daZhaDan(this, 2);
                },
                MJFlower: function(eD) {
                    HandleMJFlower(this, eD, 2);
                },
                MJTing: function (eD) {
                    HandleMJTing(this, eD, 2);
                },
                TZScore: function(msg){
                    InitUserCoinAndName_daZhaDan(this, 2);

                    MjClient.playui.checkScoreState(this, 2);
                },
                TZXi : function(){
                    InitUserCoinAndName_daZhaDan(this, 2);

                    MjClient.playui.checkScoreState(this, 2);
                }
            }
        },
        left: {
            _run:function() {
                this.visible = MjClient.MaxPlayerNum == 4;
            },
            head: {
                zhuang: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        waitPut: function() {
                            //showUserZhuangLogo_card(this, 2);
                        },
                        initSceneData: function() {
                            //if (IsArrowVisible()) showUserZhuangLogo_card(this, 2);
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
                                if(MjClient.data.sData.tData.maxPlayer < 4){
                                    return;
                                }
                                showUserChat(this, 3, msg);
                            },
                            playVoice: function(voicePath) {
                                if(MjClient.data.sData.tData.maxPlayer < 4){
                                    return;
                                }
                                MjClient.data._tempMessage.msg = voicePath;
                                showUserChat(this, 3, MjClient.data._tempMessage);
                            }
                        }
                    }
                },
                _click: function(btn) {
                    cc.log("_click");
                    showPlayerInfo_daZhaDan(3, btn);
                },
                _event: {
                    loadWxHead: function(d) {
                        // setWxHead(this, d, 3);
                    },
                    addPlayer: function() {
                        showFangzhuTagIcon_daZhaDan(this, 3);
                    },
                    removePlayer: function() {
                        showFangzhuTagIcon_daZhaDan(this, 3);
                    },
                    initSceneData : function(){
                        showFangzhuTagIcon_daZhaDan(this,3);
                        MjClient.playui.showOrHideTeam(this, 3);
                    },
                    mjhand : function(){
                        showFangzhuTagIcon_daZhaDan(this,3);
                        MjClient.playui.showOrHideTeam(this, 3);
                    },
                    PKTeam : function(){
                        MjClient.playui.showOrHideTeam(this, 3);
                    }
                },
                _run: function () {
                    // this.zIndex = 600;
                    showFangzhuTagIcon_daZhaDan(this,3);
                },
                name_bg:{_visible:false},
                tingCard:{
                    _visible:false,
                    _event:{
                        initSceneData: function(eD)
                        {
                            var pl = getUIPlayer_daZhaDan(3);
                            if(pl && pl.handCount)
                            {
                                this.visible = true;
                            }
                            else
                            {
                                this.visible = false;
                            }

                            if(MjClient.rePlayVideo != -1){
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

                            if(MjClient.rePlayVideo != -1){
                                this.visible = false;
                            }
                        }
                    }
                },
                rankIcon : {
                    _run : function(){
                        this.visible = false;
                    },
                    _event : {
                        initSceneData: function(eD)
                        {
                            MjClient.playui.checkRankState(this, 3);
                        },
                        PKPut: function(){
                            MjClient.playui.checkRankState(this, 3);
                        },
                        roundEnd : function(){
                            MjClient.playui.checkRankState(this, 3, true);
                        },
                        clearRankIcon_daZhaDan : function(){
                            this.visible = false;
                        }
                    }
                }
            },
            play_tips: {
                _layout: [[0.08, 0.14], [0.25, 0.5], [0, 0.5]],
                _run: function() {
                    this.zIndex = actionZindex;
                },
                _visible:false,
            },
            ready: {
                _layout: [
                    [0.07, 0.07],
                    [0.3, 0.65],
                    [0, 0]
                ],
                _run: function() {
                    GetReadyVisible(this, 3);
                },
                _event: {
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
            stand: {
                _layout: [
                    [0, 0.13],
                    [0, 1],
                    [2.5, 0]
                ],
                _visible: false,
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
                        setWgtLayout(this,[0.052, 0],[0.16, 0.7],[0.5, 0.5]);
                    else
                        setWgtLayout(this,[0.052, 0],[0.16, 0.7],[1.2, 0.5]);
                },
                _visible: false,
            },
            noPutTag: {
                _run:function()
                {
                    // this.setScale(MjClient.size.width/1280);
                    // this.setPosition(MjClient.playui._leftNode.getChildByName("deskCard").getPosition());
                    setWgtLayout(this, [133/1280, 0], [0.20, 0.63], [0, 0]);
                },
                _event:{
                    PKPass:function(eD)
                    {
                        var UIoff = getUiOffByUid(eD.uid);
                        if(UIoff == 3)
                        {
                            DealPKPass_daZhaDan(UIoff);
                            var url = "daZhaDan/nv/buyao";
                            var pl = MjClient.data.sData.players[eD.uid];
                            playEffect(url, false, pl.info.sex);
                        }
                    }
                },
                _visible: false
            },
            _event: {
                clearCardUI: function() {
                    clearCardUI_daZhaDan(this, 3);
                },
                initSceneData: function(eD) {
                    SetUserVisible_daZhaDan(this, 3);
                    // MjClient.playui.checkScoreState(this, 3);
                },
                addPlayer: function(eD) {
                    SetUserVisible_daZhaDan(this, 3);
                },
                removePlayer: function(eD) {
                    SetUserVisible_daZhaDan(this, 3);
                },
                TZJoinTeam: function() {
                    updateHeadInfo_daZhaDan(this, 3);
                    updateZuInfo_daZhaDan(this, 3);
                },
                mjhand: function(eD) {
                    InitUserHandUI_daZhaDan(this, 3);

                    SetUserVisible_daZhaDan(this, 3);
                },
                roundEnd: function() {
                    InitUserCoinAndName_daZhaDan(this, 3);
                    // this.cardList.removeFromParent();
                    // this.cardList = null;
                },
                waitPut: function(eD) {
                    DealWaitPut_daZhaDan(this, eD, 3);
                    if(this.throwList && !MjClient.data.sData.tData.lastPutCard){
                        this.throwList.hideCards();
                    }
                },
                PKPut: function(eD) {
                    if(this.throwList){
                        // this.throwList.hideCards();
                    }
                    DealMJPut_daZhaDan(this, eD, 3);
                },
                onlinePlayer: function(eD) {
                    setUserOffline_daZhaDan(this, 3);
                },
                playerStatusChange: function(eD) {
                    setUserOffline_daZhaDan(this, 3);
                },
                MJFlower: function(eD) {
                    HandleMJFlower(this, eD, 3);
                },
                MJTing: function (eD) {
                    HandleMJTing(this, eD, 3);
                },
                TZScore: function(msg){
                    InitUserCoinAndName_daZhaDan(this, 3);

                    MjClient.playui.checkScoreState(this, 3);
                    
                },
                TZXi : function(){
                    InitUserCoinAndName_daZhaDan(this, 3);

                    MjClient.playui.checkScoreState(this, 3);
                }
            }
        },
        chat_btn: {
            _layout: [
                [55/1280, 0],
                [0.9626, 0.3],
                [0, 0]
            ],
            _run : function(){
                if(MjClient.rePlayVideo !== -1){
                    this.visible = false;
                }

                // 4人选择分组阶段
                // var tData = MjClient.data.sData.tData;
                // if ((tData.tState == TableState.waitJoin || tData.tState == TableState.waitReady) && tData.maxPlayer == 4) {
                //     this.visible = false;
                // }

                if(isIPhoneX()){
                    setWgtLayout(this, [68/1280 * 0.88, 0], [0.9649, 0.3345], [0, 0]);
                }
            },
            _click: function() {
                var chatlayer = new ChatLayer();
                MjClient.Scene.addChild(chatlayer);
            },
            _event : {
                mjhand: function(){
                    this.visible = true;
                    if(MjClient.rePlayVideo !== -1){
                        this.visible = false;
                    }
                }
            }
        },
        voice_btn: {
            _layout: [
                [43/1280, 0],
                [0.9624, 0.38],
                [0, 0]
            ],
            _run: function() {
                initVoiceData();
                
                if(MjClient.isShenhe) this.visible=false;

                if(MjClient.rePlayVideo !== -1){
                    this.visible = false;
                }

                this.hasEvent = false;

                // // 4人选择分组阶段
                // var tData = MjClient.data.sData.tData;
                // if ((tData.tState == TableState.waitJoin || tData.tState == TableState.waitReady) && tData.maxPlayer == 4) {
                //     this.visible = false;
                // }else
                {
                    cc.eventManager.addListener(getTouchListener(), this);
                    this.hasEvent = true;
                }

                if(isIPhoneX()){
                    setWgtLayout(this, [68/1280 * 0.88, 0], [0.9649, 0.4317], [0, 0]);
                }
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
                },

                mjhand: function(){
                    this.visible = true;
                    if(!this.hasEvent){
                        cc.eventManager.addListener(getTouchListener(), this);
                        this.hasEvent = true;
                    }
                    if(MjClient.rePlayVideo !== -1){
                        this.visible = false;
                    }
                    
                }
            }
        },
        setting: {
            _layout: [
                [68/1280, 0],
                [0.9649, 0.95],
                [0, 0]
            ],
            _run: function() {
                if(MjClient.rePlayVideo !== -1){
                    this.visible = false;
                }
            },
            _click: function() {
                var settringLayer = new DianTuoSetting();
                settringLayer.setName("PlayLayerClick");
                MjClient.Scene.addChild(settringLayer);
                MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Shezhi", {uid:SelfUid(),gameType:MjClient.gameType});
            }
        },
        gps_btn: {
            _layout: [
                [68 / 1280, 0],
                [0.855, 0.95],
                [0, 0]
            ],
            _run: function() {
                if(MjClient.data.sData.tData.maxPlayer == 2)
                {
                    this.visible = false;
                }
                if(MjClient.rePlayVideo !== -1){
                    this.visible = false;
                }

                // if(isIPhoneX()){
                //     setWgtLayout(this, [68/1280 * 0.88, 0], [0.04, 0.4417], [0, 0]);
                // }
            },
            _click: function() {
                MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Dingwei", {uid: SelfUid()});
                if(MjClient.data.sData.tData.maxPlayer == 3){
                    MjClient.Scene.addChild(new showDistance3PlayerLayer());
                }else if(MjClient.data.sData.tData.maxPlayer == 4){
                    MjClient.Scene.addChild(new showDistanceLayer());
                }
            }
        },
        back_btn: {
            _layout: [
                [68/1280, 0],
                [0.80, 0.95],
                [0, 0]
            ],
            _run : function(){
                if(MjClient.rePlayVideo !== -1){
                    this.visible = false;
                }
                this.visible = true;
            },
            _click: function() {
                if (!IsRoomCreator() &&
                    (MjClient.data.sData.tData.tState == TableState.waitJoin || MjClient.data.sData.tData.tState == TableState.waitReady))
                {
                    MjClient.showMsg("确定要退出房间吗？",
                        function() {
                            MjClient.leaveGame();
                            if (!MjClient.enterui && !MjClient.FriendCard_main_ui)
                                MjClient.Scene.addChild(new EnterRoomLayer());
                        },
                        function() {});
                }
                else {
                    MjClient.showMsg("是否解散房间？", function () {
                        MjClient.delRoom(true);
                    }, function(){}, 1);
                }
            },
            _event: {
                mjhand: function(eD) {
                    this.visible = false;
                },
                initSceneData : function(){
                    var tData = MjClient.data.sData.tData;
                    if(tData.tState > TableState.waitReady){
                        //牌局开始后隐藏按钮
                        this.visible = false;
                    }
                }
            }

        },
        changeBg: {
            _layout: [
                [68/1280, 0],
                [0.91, 0.95],
                [0, 0]
            ],
            _run : function(){
                if(MjClient.rePlayVideo !== -1){
                    this.visible = false;
                }
            },
            _click: function() {
                setCurrentGameBgTypeToNext();
                postEvent("changeGameBgEvent");
            }
        },
        jiaoPai : {
            _layout: [[112/1280, 0], [0.0462, 0.8378], [0, 0]],
            _run : function(){
                if(MjClient.rePlayVideo !== -1){
                    setWgtLayout(this, [112/1280, 0], [0.2, 0.8378], [0, 0]);
                }

                this.visible = false;
                this.checkFriendCard = function(){
                    var tData = MjClient.data.sData.tData;
                    var card = tData.friendCard;
                    if(card > 0){
                        this.visible = true;
                        var cardImg = this.getChildByName("card");
                        cardImg.loadTexture("playing/diantuo/cards/" + card + ".png");
                    }else{
                        this.visible = false;
                    }
                }
            },
            _event : {
                initSceneData : function(){
                    this.checkFriendCard();
                },

                PKFindFriend : function(){
                    this.checkFriendCard();
                    var cardList = MjClient.playui._downNode.cardList;
                    if(cardList){
                        cardList.upBtnNode();
                        cardList.refreshHandCards();
                    }
                },
                clearCardUI : function(){
                    this.visible = false;
                }
            }
        },
        deskScoreBg : {
            _run:function()
            {
                this.visible = false;
                setWgtLayout(this,[this.width/1280, this.height/720],[0.5, 0.57],[0, 0]);
            },
            _event:{
                mjhand:function()
                {
                    this.visible = true;
                },
                initSceneData: function() {
                    if(MjClient.data.sData.tData.tState == TableState.waitPut || 
                        MjClient.data.sData.tData.tState == TableState.waitBao)
                    {
                        this.visible = true;
                    }
                },
                clearCardUI : function(){
                    this.visible = false;
                }
            },
            deskScore:{
                _run:function()
                {
                    this.ignoreContentAdaptWithSize(true);
                    this.setString("本轮桌面分：0");
                },
                _event:{
                    waitPut:function()
                    {
                        var tData = MjClient.data.sData.tData;
                        this.setString("本轮桌面分：" + tData.score_draw);
                    },
                    initSceneData: function() {
                        var tData = MjClient.data.sData.tData;
                        this.setString("本轮桌面分：" + (tData.score_draw ? tData.score_draw : 0));
                    }
                }
            }
        }
    },
    _downNode:null,
    _rightNode:null,
    _topNode:null,
    _leftNode:null,
    ctor: function() {
        this._super();
        var playui = ccs.load("Play_yueYangDaZhaDan.json");

        this.srcMaxPlayerNum = MjClient.MaxPlayerNum;
        MjClient.MaxPlayerNum = parseInt(MjClient.data.sData.tData.maxPlayer);

        playMusic("bgFight_niushibie");

        this._downNode  = playui.node.getChildByName("down");
        this._rightNode = playui.node.getChildByName("right");
        this._topNode   = playui.node.getChildByName("top");
        this._leftNode  = playui.node.getChildByName("left");

        this._noPutTips    = playui.node.getChildByName("noPutTips");
        MjClient.playui = this;
        MjClient.playui._AniNode =  playui.node.getChildByName("eat");
        this.sortType     = MjClient.sortType.normal;
        this.nextSortType = MjClient.sortType.count;


        MjClient.sortClassType = 0;//util.localStorageEncrypt.getNumberItem(MjClient.sortClassKey,MjClient.sortClassType);
        MjClient.playui.sortType = MjClient.sortType.normal;

        if(MjClient.rePlayVideo != -1)// 表示回放
        {
            MjClient.sortClassType = 0;
            MjClient.playui.sortType = MjClient.sortType.normal;
        }



        BindUiAndLogic(playui.node, this.jsBind);
        this.addChild(playui.node);

        MjClient.playui._jiazhuWait = playui.node.getChildByName("jiazhuWait");

        MjClient.lastMJTick = Date.now();
        this.runAction(cc.repeatForever(cc.sequence(cc.callFunc(function() {
            if (MjClient.game_on_show) MjClient.tickGame(0);
        }), cc.delayTime(7))));

        // 在亲友圈房间中添加邀请亲友圈牌有一起对局
        addClubYaoqingBtn(2);

        // var sData = {"players":{"1000140":{"mjdesc":[],"mjhand":[],"winone":250,"winall":250,"info":{"uid":1000140,"appid":"yueyang","unionid":"unionid-1000140","sex":2,"nickname":"%u6E38%u5BA2140","headimgurl":"http://thirdwx.qlogo.cn/mmopen/vi_32/5XtTKNI6jSECJsYmb581vUWCaNAgXjtdC7TCFttnlMNzUW1yJYibf5Fv7NKGaXPbiaYX9129gWHwBkDcNhkxURNQ/132","photo":null,"mobileNum":null,"identityNum":null,"loginCode":"ABCDEF","lastLoginTime":1541419782102,"lastShareDay":0,"createRoomNum":10,"money":100,"gold":2000,"integral":0,"memberId":null,"myMemberId":null,"createTime":1540611035657,"sid":63,"fid":"pkcon-b","os":"Windows","remoteIP":"172.17.100.9","location":{"longitude":0,"latitude":0,"address":"['','','','','','']"},"lockMoney":0,"grade":{"common":0,"bopi":0}},"roomStatistics":[0,0,0,0,0],"score_draw":30,"stats_draw":{"5":0,"10":2,"13":1},"score_rank":0},"1000141":{"mjdesc":[],"mjhand":[415,112,213,215,308,305,307,314,110,408,207,310,206,104,211,405,412,313,303,109,406,412,114,415,404,209,205],"winone":-150,"winall":-150,"info":{"uid":1000141,"appid":"yueyang","unionid":"unionid-1000141","sex":2,"nickname":"%u6E38%u5BA2141","headimgurl":"http://thirdwx.qlogo.cn/mmopen/vi_32/JAMqdYJnEr4jnmicrSjusUoSiaTV1vq5ib2yEwkeMPYEusnpV1u2vRekFGhvy2UtXB6iadMAbw9r2PibBfLHibb6fyzA/132","photo":null,"mobileNum":null,"identityNum":null,"loginCode":"ABCDEF","lastLoginTime":1541419939983,"lastShareDay":0,"createRoomNum":10,"money":100,"gold":2000,"integral":0,"memberId":null,"myMemberId":null,"createTime":1540611035658,"sid":66,"fid":"pkcon-b","os":"Windows","remoteIP":"172.17.100.9","location":{"longitude":0,"latitude":0,"address":"['','','','','','']"},"lockMoney":0,"grade":{"common":0,"bopi":0}},"roomStatistics":[0,0,0,0,0],"score_draw":0,"stats_draw":{"5":0,"10":0,"13":0},"score_rank":0},"1000142":{"mjdesc":[],"mjhand":[415,112,213,215,308,305,307,314,110,408,207,310,206,104,211,405,412,313,303,109,406,412,114,415,404,209,205],"winone":-150,"winall":-150,"info":{"uid":1000142,"appid":"yueyang","unionid":"unionid-1000142","sex":2,"nickname":"%u6E38%u5BA2142","headimgurl":"http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIuNQXObUwZmMqN2Akkq3S67yrDVXmEeokXD8WldBGI5B71vxKBnibsUd3pib84n7bNia734CAbniczfw/132","photo":null,"mobileNum":null,"identityNum":null,"loginCode":"ABCDEF","lastLoginTime":1541419651459,"lastShareDay":0,"createRoomNum":10,"money":100,"gold":2000,"integral":0,"memberId":null,"myMemberId":null,"createTime":1540611035659,"sid":64,"fid":"pkcon-b","os":"Windows","remoteIP":"172.17.100.9","location":{"longitude":0,"latitude":0,"address":"['','','','','','']"},"lockMoney":0,"grade":{"common":0,"bopi":0}},"roomStatistics":[0,0,0,0,0],"score_draw":0,"stats_draw":{"5":0,"10":0,"13":0},"score_rank":0},"1000143":{"mjdesc":[],"mjhand":[],"winone":50,"winall":50,"info":{"uid":1000143,"appid":"yueyang","unionid":"unionid-1000143","sex":2,"nickname":"%u6E38%u5BA2143","headimgurl":"http://thirdwx.qlogo.cn/mmopen/vi_32/e1WrIt3ibc3LQzDrSDkxW2icLG4UxOMlHemqXjDmYo3g95ziaBA1tCoxp9iasLdYliauH5ISHlhhVvTmkkK6gtM2NRw/132","photo":null,"mobileNum":null,"identityNum":null,"loginCode":"ABCDEF","lastLoginTime":1541424389978,"lastShareDay":0,"createRoomNum":10,"money":100,"gold":2000,"integral":0,"memberId":null,"myMemberId":null,"createTime":1540611035660,"sid":133,"fid":"pkcon-a","os":"Windows","remoteIP":"172.17.100.9","location":{"longitude":0,"latitude":0,"address":"['','','','','','']"},"lockMoney":0,"grade":{"common":0,"bopi":0}},"roomStatistics":[0,0,0,0,0],"score_draw":70,"stats_draw":{"5":6,"10":2,"13":2},"score_rank":0}},"tData":{"tableid":585097,"initCoin":0,"gameType":2018153,"roundAll":8,"roundNum":7,"isValidTable":false,"fanNum":0,"maxPlayer":4,"uids":[1000140,1000141,1000142,1000143],"uidsQueue":[1000140,1000141,1000142,1000143],"owner":1000140,"maxHunNum":4,"cardNext":108,"winner":-1,"zhuang":0,"curPlayer":2,"lastPutPlayer":0,"putType":0,"lastDrawPlayer":-1,"tState":6,"lastPutCard":[415],"genpaiCount":0,"isHunCardPlay":false,"canHu7":false,"freeBegin":0,"firstFree":0,"delEnd":0,"delEndHePai":0,"firstDel":0,"canEatHu":true,"huangNum":14,"lastGangType":0,"lastGangDianpaoPlayer":-1,"xingPlayer":-1,"datuoNum":0,"shuffleCardsNum":108,"hunCard":-1,"shuffler":-1,"mustJiao":false,"zhuafenlist":[],"roundzhuafen":0,"areaSelectMode":{"maxPlayer":4,"payWay":0,"isShowLeft":true,"shunType":1,"hasWings":true,"hasShun":true,"isAllXiFen":true},"shunType":1,"hasWings":true,"hasShun":true,"gameCnName":"´òÕ¨µ¯","hasReadyBtn":true,"currCard":-1,"drawType":0,"bodyLen":null,"lastPutCardType":0,"score_draw":0,"stats_draw":{"5":0,"10":0,"13":0},"rank":[1000143,1000140,1000142],"friendCard":303,"baoType":2,"baoUid":-1,"scoreCards":[405,305,205,310,110,405,305,205,313,213,310,110,313],"haveBalance":false,"roundNum_play":null},"cards":[516,517,516,517,308,305,307,314,110,408,207,310,206,104,211,405,412,313,303,109,406,412,114,415,404,209,205,415,112,213,215,308,305,307,314,110,408,207,310,206,104,211,405,412,313,303,109,406,412,114,415,404,209,205,415,112,213,215,308,305,307,314,110,408,207,310,206,104,211,405,412,313,303,109,406,412,114,415,404,209,205,415,112,213,215,308,305,307,314,110,408,207,310,206,104,211,405,412,313,303,109,406,412,114,415,404,209,205],"roundEndTime":"2018-11-05 21:38:07","isDismiss":false,"serverTime":1541425087538};
        // MjClient.data.sData = sData;

        return true;
    },
    onEnterTransitionDidFinish : function()
    {
        //this.setTouchEnabled(true);
        //cc.log("-----------init touch ---- ")
        this._super();
    },

    onExit:function()
    {
        this._super();
        MjClient.MaxPlayerNum = this.srcMaxPlayerNum;
    },

});

PlayLayer_daZhaDan.prototype.cannotOutCardGrey = function()
{
    if (MjClient.data.sData.tData.lastPutPlayer == -1 || MjClient.data.sData.tData.lastPutPlayer == MjClient.data.sData.tData.curPlayer)
        return;

    // 三带一、四带二、飞机 不变灰
    var lastPutCard = MjClient.data.sData.tData.lastPutCard
    if (lastPutCard && lastPutCard != -1)
    {
        var lastCards = [];
        var lastLaizi = MjClient.majiang.transformAndGetLaizi(lastPutCard, lastCards);
        var lastCardsType = MjClient.majiang.calType(lastCards, MjClient.data.sData.tData.areaSelectMode);
        if (lastCardsType == MjClient.majiang.CARDTPYE.sandaiyi || lastCardsType == MjClient.majiang.CARDTPYE.sidaier || lastCardsType == MjClient.majiang.CARDTPYE.feiji)
        {
            if (MjClient.tipCardsArray.length > 0)
                return;
        }
    }

    var children = this._downNode.children;
    for (var i = 0; i < children.length; i++)
    {
        if (children[i].name != "mjhand")
            continue;

        var point = Math.ceil(children[i].tag/4);
        var atTipArray = false;
        for (var j = 0, len = MjClient.tipCardsArray.length; j < len; j ++)
        {
            for (var k = 0, len2 =MjClient.tipCardsArray[j].length; k < len2; k ++)
            {
                if (Math.ceil(MjClient.tipCardsArray[j][k]/4) == point)
                {
                    atTipArray = true;
                    break;
                }
            }
            if (atTipArray)
                break;
        }

        children[i].cannotOut = !atTipArray;
        if (atTipArray)
            children[i].setColor(MjClient.whiteColor);
        else
            children[i].setColor(MjClient.grayColor);
    }
}

PlayLayer_daZhaDan.prototype.recoverCannotOutCard = function()
{
    var children = this._downNode.children;
    for (var i = 0; i < children.length; i++)
    {
        if (children[i].name != "mjhand")
            continue;

        children[i].cannotOut = false;
        children[i].setColor(MjClient.whiteColor);
    }
}

PlayLayer_daZhaDan.prototype.clockNumberUpdate = function(node, endFunc)
{
    //取消闹钟声音
    // return arrowbkNumberUpdate(node, endFunc);
}

PlayLayer_daZhaDan.prototype.updateClockPosition = function(arrowNode)
{
    var tData = MjClient.data.sData.tData;
    var uids = tData.uids;
    var curPlayerIndex = (tData.curPlayer + MjClient.MaxPlayerNum - tData.uids.indexOf(SelfUid())) % MjClient.MaxPlayerNum;
    cc.log(curPlayerIndex + "..@@@...");

    var curPlayerNode = null;
    if (curPlayerIndex == 0)
        curPlayerNode = this._downNode;
    else if (curPlayerIndex == 1)
        curPlayerNode = this._rightNode;
    else if (curPlayerIndex == 2)
        curPlayerNode = this._topNode;
    else if(curPlayerIndex == 3){
        curPlayerNode = this._leftNode;
    }

    if (curPlayerNode != null && curPlayerNode.throwList){
        var p = curPlayerNode.throwList.getPosition();
        arrowNode.setPosition(p.x, p.y + curPlayerNode.throwList.height * 0.5);     
    }else{
        arrowNode.setPosition(arrowNode.srcPosition);
    }

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

PlayLayer_daZhaDan.prototype.showAndHideHeadEffect = function(){
    var tData = MjClient.data.sData.tData;
    var uids = tData.uids;
    var curPlayerIndex = (tData.curPlayer + MjClient.MaxPlayerNum - tData.uids.indexOf(SelfUid())) % MjClient.MaxPlayerNum;
    cc.log(curPlayerIndex + "..@@@...");

    var curPlayerNode = null;
    if (curPlayerIndex == 0){
        curPlayerNode = this._downNode.getChildByName("head").getChildByName("bg");
    }
    else if (curPlayerIndex == 1){
        curPlayerNode = this._rightNode.getChildByName("head").getChildByName("bg");
    }else if (curPlayerIndex == 2){
        curPlayerNode = this._topNode.getChildByName("head").getChildByName("bg");
    }else if(curPlayerIndex == 3){
        curPlayerNode = this._leftNode.getChildByName("head").getChildByName("bg");
    }

    var tag = 2018322;
    this._downNode.getChildByName("head").getChildByName("bg").removeChildByTag(tag, true);
    this._rightNode.getChildByName("head").getChildByName("bg").removeChildByTag(tag, true);
    this._topNode.getChildByName("head").getChildByName("bg").removeChildByTag(tag, true);
    this._leftNode.getChildByName("head").getChildByName("bg").removeChildByTag(tag, true);

    if (curPlayerNode != null && 
        (MjClient.data.sData.tData.tState == TableState.waitPut || MjClient.data.sData.tData.tState == TableState.waitBao))
    {   
        cc.spriteFrameCache.addSpriteFrames("daZhaDan/effect/head/head.plist");

        var sp = curPlayerNode.getChildByTag(tag);
        if(sp && cc.sys.isObjectValid(sp)){
            sp.stopAllActions();
            sp.removeFromParent(true);
            sp = null;
        }

        var sp = new cc.Sprite("#0.png");
        sp.setAnchorPoint(0.5,0.5);
        // sp.scale = 1;
        sp.x = curPlayerNode.width * 0.5;
        sp.y = curPlayerNode.height * 0.5 + 0.5;
        // setWgtLayout(sp, [164/1280, 0], [0.5, 0.5], [0,0],false, true);
        sp.setTag(tag);
        curPlayerNode.addChild(sp);

        var ac = getAnimate_daZhaDan("",29,0.06);
        sp.runAction(cc.RepeatForever(ac));
    }
}

/**
 * 拼接游戏玩法及付费信息
 * @function
 * @return {String}
 */
PlayLayer_daZhaDan.prototype.getGameInfoString = function(param)
{
    var tData = MjClient.data.sData.tData;
    var str = "";

    if (param != "roundInfo"){
        str += ["","","二","三","四"][MjClient.MaxPlayerNum] + "人玩,";
    }

    str += tData.areaSelectMode.hasBaoPai ? "可包牌," : "";
    str += tData.areaSelectMode.isAllXiFen ? "喜压死有分," : "";
    str += tData.areaSelectMode.hasFiveXi ? "5张算喜," : "";
    str += tData.areaSelectMode.isShowLeft ? "显示剩余牌," : "";
    str += tData.areaSelectMode.shunType ? "2可做连字," : "";
    str += tData.areaSelectMode.hasSanWangZha ? "三王算炸," : "";
    str += tData.areaSelectMode.hasSanWangXi ? "三王算喜," : "";
    str += tData.areaSelectMode.hasWings ? "允许三带二," : "";
    str += tData.areaSelectMode.hasShun ? "可以单顺子," : "";
    str += tData.areaSelectMode.isNo34 ? "不要3和4," : "";
    str += tData.areaSelectMode.isRandomTeam ? "随机找队友," : "";
    str += ("积分底分" + tData.areaSelectMode.jieSuanDiFen);

    if (str.charAt(str.length - 1) == ",")
        str = str.substring(0, str.length - 1);
    return str;
};

PlayLayer_daZhaDan.prototype.shwoFlyCardAnim = function(flyNode)
{
    var tData = MjClient.data.sData.tData;
    var off = getOffByIndex(tData.curPlayer);
    var playerNode = getNode_cards(off);
    if (!playerNode)
        return;

    var headNode = playerNode.getChildByName("head");
    var point = headNode.convertToWorldSpace(cc.p(headNode.width/2, headNode.height/2));
    point = flyNode.getParent().convertToNodeSpace(point);
    setCardSprite_card(flyNode, 12, false);
    flyNode.setVisible(true);
    flyNode.setScale(flyNode.getScale() * 1.5);
    flyNode.runAction(cc.sequence(cc.delayTime(0.2), cc.spawn(cc.moveTo(1.0, point), cc.scaleTo(1.0, flyNode.getScale()/1.5)), cc.callFunc(function() {
        flyNode.setVisible(false);
    })));
}

PlayLayer_daZhaDan.prototype.showHandCardBeiMian = function()
{
    cc.log("showHandCardBeiMian");
    var playerNode = getNode_cards(0);
    var childrens = playerNode.getChildren();
    for (var i = 0; i < childrens.length; i++)
    {
        if (childrens[i].name != "mjhand")
            continue;

        var beiMain = new cc.Sprite("playing/cardPic2/beimian_puke.png");
        beiMain.setName("beiMain");
        beiMain.setPosition(childrens[i].width/2, childrens[i].height/2);
        childrens[i].addChild(beiMain, 111);
    }
}

PlayLayer_daZhaDan.prototype.hideHandCardBeiMian = function()
{
    cc.log("hideHandCardBeiMian");
    var playerNode = getNode_cards(0);
    var childrens = playerNode.getChildren();
    for (var i = 0; i < childrens.length; i++)
    {
        if (childrens[i].name != "mjhand")
            continue;

        childrens[i].removeChildByName("beiMain");
    }
}

PlayLayer_daZhaDan.prototype.checkRankState = function(node, uiOff, isRoundEnd){

    var tState = MjClient.data.sData.tData.tState;
    if(!tState || tState == TableState.roundFinish){
        if(!isRoundEnd){
            node.visible = false;
            return;
        }
    }
    var pl = getUIPlayer(uiOff);
    var rank = MjClient.data.sData.tData.rank;
    if(rank && rank.length > 0){
        for(var i = 0; i < rank.length; i++){
            var uid = rank[i];
            if(uid == pl.info.uid){
                var src = "playing/niushibie/Ui_you"+ (i+1) + ".png";
                if(pl.handCount > 0){
                    src = "playing/niushibie/Ui_you4.png"
                }
                node.ignoreContentAdaptWithSize(true);
                node.loadTexture(src);
                node.visible = true;
                break;
            }
        }
    }
}

PlayLayer_daZhaDan.prototype.checkScoreState = function(node, uiOff){
    return;
    var pl = getUIPlayer(uiOff);
    if(pl.inc > 0)
    {
        var nodeP = getNode(uiOff).getChildByName("head").getPosition();
        var len = 10;
        if(pl.inc >= 50){
            len = 18;
        }
        var list = [];
        for(var i = 0; i < len; i++){

            var gap = Math.random()*20 + 400 * (200/1280) ;
            var startP =  cc.p(nodeP.x + gap, nodeP.y + gap);
            if(uiOff == 1){
                startP =  cc.p(nodeP.x - gap, nodeP.y + gap * 0.6);
            }else if(uiOff == 2){
                startP =  cc.p(nodeP.x - gap, nodeP.y - gap);
            }else if(uiOff == 3){
                startP =  cc.p(nodeP.x + gap, nodeP.y + gap * 0.5);
            }

            startP = this._paiMianFen.getPosition();
            startP.x += 45;
            startP.y -= 15;

            var gold = new daZhaDan.Gold();
            gold.setPosition(startP.x, startP.y);
            gold.setScale(MjClient.size.height/720);
            var _AniNode = MjClient.playui._AniNode;
            _AniNode.addChild(gold,10000);
            list.push(gold);
        }

        var index = 0;
        var tID = setInterval(function(){
            var gold = list[index];
            gold.doMoveAction(nodeP.x + Math.random()*20, nodeP.y + Math.random()*20);
            index += 1;
            if(index >= list.length){
                clearInterval(tID); 
            }
        }, 50);
        setTimeout(function(){
            playEffect("daZhaDan/effect/jetton", false);
        }, 100);
    }
}

PlayLayer_daZhaDan.prototype.showOrHideTeam = function(node, uiOff){
    var baoImg = node.getChildByName("baoPai");
    var zuImg = node.getChildByName("zu");
    baoImg.visible = false;
    zuImg.visible = false;
    var pl = getUIPlayer(uiOff);
    if(pl){
        var sData = MjClient.data.sData;
        var tData = sData.tData;
        if(tData.baoType == 1 || tData.baoType == 0){
            //暗包 || 包牌
            if(tData.baoUid == pl.info.uid){
                baoImg.visible = true;
            }
        }else if(tData.baoType == 2){
            //分组
            var selfPl = getUIPlayer(0);
            if(pl.info.uid == selfPl.friendUid){
                zuImg.visible = true;
            }
        }
    }
}