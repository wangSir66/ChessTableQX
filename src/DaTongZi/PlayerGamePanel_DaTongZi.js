var actionZindex = 1000;
function getUIPlayer_daTongZi(off) {
    var sData = MjClient.data.sData;
    var tData = sData.tData;

    // 4人选择分组阶段
    if ((tData.tState == TableState.waitJoin || tData.tState == TableState.waitReady) && tData.maxPlayer == 4) {
        return sData.players[tData.inTeamUids[off]];
    } else {
        var uids = tData.uids;
        var index = getPlayerIndex(off);
        if(index < uids.length)
        {
            return sData.players[uids[index]];
        }

        return null;
    }
}

function setHeadImg_daTongZi(node, off) {
    var pl = getUIPlayer_daTongZi(off);
    var head = node.getChildByName("head");
    var nobody = head.getChildByName("nobody");
    var WxHead = nobody.getChildByName("WxHead");
    if (pl) {
        var url = pl.info.headimgurl || "png/default_headpic.png";
        cc.loader.loadImg(url, {isCrossOrigin: true}, function(err, texture) {
            if (!err && texture) {
                if (WxHead && cc.sys.isObjectValid(WxHead)) {
                    WxHead.removeFromParent(true);
                }
                WxHead = null;
                //缓存头像
                //postEvent( "QueueNetMsg",["loadWxHead",{uid:pl.info.uid,img:texture}]);
                //使用新的事件循环机制
                MjClient.Scene.pushQueueNetMsg(["loadWxHead", { uid: pl.info.uid, img: texture }]);

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
function SetUserVisible_daTongZi(node, off) {
    var pl = getUIPlayer_daTongZi(off);
    var head = node.getChildByName("head");
    var name = head.getChildByName("name");
    var nobody = head.getChildByName("nobody");
    var coin = head.getChildByName("coin");
    var offline = head.getChildByName("offline");
    var name_bg = head.getChildByName("name_bg");
    var score_bg = head.getChildByName("score_bg");

    // 分组信息
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var zu = head.getChildByName("zu");
    if (tData.maxPlayer != 4) {
        zu.visible = false;
    } else {
        zu.visible = true;
        var src = "";
        if ((tData.tState == TableState.waitJoin || tData.tState == TableState.waitReady)) {
            src = off % 2 == 0 ? "daTongZi/playing/a.png" : "daTongZi/playing/b.png";
        } else {

            cc.log("#####pl:" + JSON.stringify(pl));
            src = pl.teamid == "A" ? "daTongZi/playing/a.png" : "daTongZi/playing/b.png";
        }
        cc.log(off);
        cc.log(src);
        zu.loadTexture(src);
    }

    if (pl) {
        name.visible = true;
        coin.visible = true;
        offline.visible = true;
        coin.visible = true;
        // name_bg.visible = true;
        // score_bg.visible = true;

        // MjClient.loadWxHead(pl.info.uid, pl.info.headimgurl);
        setHeadImg_daTongZi(node, off);
        setUserOffline_hengYang(node, off);
        InitUserHandUI_daTongZi(node, off);
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

function updateZuInfo_daTongZi(node, off) {
    // 分组信息
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var head = node.getChildByName("head");
    var zu = head.getChildByName("zu");
    if (tData.maxPlayer != 4) {
        zu.visible = false;
    } else {
        zu.visible = true;
        var src = "";
        if ((tData.tState == TableState.waitJoin || tData.tState == TableState.waitReady)) {
            src = off % 2 == 0 ? "daTongZi/playing/a.png" : "daTongZi/playing/b.png";
        } else {
            src = pl.teamid == "A" ? "daTongZi/playing/a.png" : "daTongZi/playing/b.png";
        }
        zu.loadTexture(src);
    }
}

// 4人分组时候更新对应位置玩家信息
function updateHeadInfo_daTongZi(node, off) {
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    // 4人选择分组阶段
    if (!((tData.tState == TableState.waitJoin || tData.tState == TableState.waitReady) && tData.maxPlayer == 4)) {
        return;
    }

    var pl = getUIPlayer_daTongZi(off);
    var head = node.getChildByName("head");
    var name = head.getChildByName("name");
    var nobody = head.getChildByName("nobody");
    var coin = head.getChildByName("coin");
    var offline = head.getChildByName("offline");
    var name_bg = head.getChildByName("name_bg");
    var score_bg = head.getChildByName("score_bg");
    if (pl) {
        name.visible = true;
        coin.visible = true;
        offline.visible = true;
        coin.visible = true;

        setHeadImg_daTongZi(node, off);
        InitUserCoinAndName_daTongZi(node, off);
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

function InitUserHandUI_daTongZi(node, off) {
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var pl = getUIPlayer_daTongZi(off);

    if (!pl) {
        return;
    }

    //初始化玩家金币和名称
    InitUserCoinAndName_daTongZi(node, off);
    setAreaTypeInfo(true);
    currentLeftCardCount_daTongZi(off);

    // initSortUI();

    if (
        tData.tState != TableState.waitPut &&
        tData.tState != TableState.waitEat &&
        tData.tState != TableState.waitCard
    ) {
        return;
    }

    //添加手牌
    if (MjClient.rePlayVideo == -1) // 表示正常游戏
    {
        if (pl.mjhand && off == 0) { //只初始化自己的手牌
            // var vcard = [];
            // for (var i = 0; i < pl.mjhand.length; i++) {

            //     var card = getNewCard_daTongZi(node, "stand", "mjhand", pl.mjhand[i], off);
            //     var index = vcard.indexOf(pl.mjhand[i]);//区分2张一样的牌
            //     if(index >= 0)
            //     {
            //         card.setUserData(1);
            //     }
            //     else
            //     {
            //         card.setUserData(0);
            //     }
            //     vcard.push(pl.mjhand[i]);
            // }

            // if (tData.areaSelectMode.fangZuoBi && tData.lastPutPlayer == -1 && tData.curPlayer != getPlayerIndex(0))
            // {
            //     MjClient.playui.isShowHandCardBeiMain = true;
            //     MjClient.playui.showHandCardBeiMian();
            // }

            var arr = [];
            var copyArr = pl.mjhand.concat();
            cc.log("copyArr:", copyArr);
            copyArr = MjClient.majiang.sort2(copyArr, MjClient.data.sData.tData.deckNum);
            cc.log("copyArr:", copyArr);

            for (var i = 0; i < copyArr.length; i++) {
                var info = new daTongZi.CardInfo();
                info.type = copyArr[i];
                arr.push(info);
            }

            initCardList_daTongZi();

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
            copyArr = MjClient.majiang.sort2(copyArr, MjClient.data.sData.tData.deckNum);
            cc.log("copyArr:", copyArr);
            for (var i = 0; i < copyArr.length; i++) {
                var info = new daTongZi.CardInfo();
                info.type = copyArr[i];
                arr.push(info);
            }

            initCardList_daTongZi();

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

function cardsSort_daTongZi(cards)
{
    var pointCounts = {};
    for (var i = 0; i < cards.length; i++) {
        var p = MjClient.majiang.calPoint(cards[i]);
        if (pointCounts[p])
            pointCounts[p] ++;
        else
            pointCounts[p] = 1;
    }

    var commonCmp = function (a, b) {
        var c1 = pointCounts[MjClient.majiang.calPoint(a)];
        var c2 = pointCounts[MjClient.majiang.calPoint(b)];
        if (c1 == c2)
            return MjClient.majiang.cardValueCmp(a, b);
        else
            return c1 - c2;
    }

    cards.sort(function(a, b) { return -commonCmp(a, b);});
}

function showPaiMianFen_daTongZi(node, data){
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

function showJiFen3Ren_daTongZi(node, sData){
    if(sData.tData.maxPlayer > 3) return;

    for(var i = 0; i < 3; i++){;
        var name = node.getChildByName("name_" + i);
        name.ignoreContentAdaptWithSize(true);
        var lsjf = node.getChildByName("lsjf_" + i);
        lsjf.ignoreContentAdaptWithSize(true);
        var bjdf = node.getChildByName("bjdf_" + i);
        bjdf.ignoreContentAdaptWithSize(true);
        var dztf = node.getChildByName("dztf_" + i);
        dztf.ignoreContentAdaptWithSize(true);

        name.setString("");
        lsjf.setString("");
        bjdf.setString("");
        dztf.setString("");
        if(bjdf._oldP){
            bjdf.setPosition(bjdf._oldP);
            bjdf.setTextColor(cc.color(34,234,156));
        }
    }

    var plList = sData.players;
    var i = 0;
    for(var n in plList){
        var pl = plList[n];
        var name = node.getChildByName("name_" + i);
        name.ignoreContentAdaptWithSize(true);
        var lsjf = node.getChildByName("lsjf_" + i);
        lsjf.ignoreContentAdaptWithSize(true);
        var bjdf = node.getChildByName("bjdf_" + i);
        bjdf.ignoreContentAdaptWithSize(true);
        var dztf = node.getChildByName("dztf_" + i);
        dztf.ignoreContentAdaptWithSize(true);

        cc.log("showJiFen3Ren_daTongZi:" + JSON.stringify(pl));
        name.setString(getNewName_new(unescape(pl.info.nickname), 4));
        name.setFontName("Arial");
        name.setFontSize(name.getFontSize());
        lsjf.setString(pl.winall);
        bjdf.setString(pl.score_draw);
        dztf.setString(pl.score_spclType);
        cc.log("bjdf:", pl.score_draw);

        //文本动画
        if(pl.inc > 0){
            playScoreEffect_daTongZi(bjdf);
        }

        if(bjdf._oldP){
            bjdf.setPosition(bjdf._oldP);
            bjdf.setTextColor(cc.color(34,234,156));
        }

        i++
    }
}

function showJiFen4Ren_daTongZi(node, sData){

    var teams = sData.teams;

    var obj = {"A":{}, "B":{}}
    for(var tid in obj){
        var lsjf = node.getChildByName("lsjf_" + tid);
        lsjf.ignoreContentAdaptWithSize(true);
        var bjdf = node.getChildByName("bjdf_" + tid);
        bjdf.ignoreContentAdaptWithSize(true);
        var dztf = node.getChildByName("dztf_" + tid);
        dztf.ignoreContentAdaptWithSize(true);

        lsjf.setString("0");
        bjdf.setString("0");
        dztf.setString("0");
    }

    for(var tid in teams){
        var team = teams[tid];

        var lsjf = node.getChildByName("lsjf_" + tid);
        lsjf.ignoreContentAdaptWithSize(true);
        var bjdf = node.getChildByName("bjdf_" + tid);
        bjdf.ignoreContentAdaptWithSize(true);
        var dztf = node.getChildByName("dztf_" + tid);
        dztf.ignoreContentAdaptWithSize(true);

        lsjf.setString(team.winall);
        bjdf.setString(team.score_draw);
        dztf.setString(team.score_spclType);

        //文本动画
        if(team.inc > 0){
            playScoreEffect_daTongZi(bjdf);
        }
    }
}

function setBtnJoinTeamVisible_daTongZi(node) {
    var isVisible = function() {
        var tData = MjClient.data.sData.tData;
        // console.log("tData.inTeamUids@@ " + tData.inTeamUids, " node.tag@@ ", node.tag);
        if (tData.maxPlayer != 4) {
            return false;
        }

        if (tData.tState != TableState.waitJoin && tData.tState != TableState.waitReady) {
            return false;
        }

        var idx = tData.inTeamUids.indexOf(SelfUid());
        if (idx == 0) {
            return false;
        }

        if (tData.inTeamUids[node.tag] != 0) {
            return false;
        }

        return true;
    }

    var flag = isVisible();
    node.setTouchEnabled(flag);
    node.visible = flag;
}

//小局结算后清空本地数据
function clearJiFen_daTongZi(){
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

var PlayLayer_DaTongZi = cc.Layer.extend({
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

                if (MjClient.getAppType() == MjClient.APP_TYPE.QXYZQP || MjClient.getAppType() == MjClient.APP_TYPE.BDYZPHZ || MjClient.getAppType() == MjClient.APP_TYPE.BDYZPHZ) {
                    return;
                }

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
                if (ipmsg.length > 0) {
                    if(cc.sys.OS_WINDOWS != cc.sys.os)
                    {
                        AlertSameIP(ipmsg.join("\n"));
                    }
                }
                mylog("ipmsg " + ipmsg.length);

                //距离位置显示
                var data = [[0.25, 0.25], [0.5, 0.72], [0, 0]];
                checkCanShowDistance(data);

                clearJiFen_daTongZi();

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
                    currentLeftCardCount_daTongZi(i);
                }

                //回放的时候
                if(MjClient.rePlayVideo != -1)
                {
                    tData.uids = msg.uids;//要更新uid位置
                    resetPlayerHead_daTongZi();
                    MjClient.playui._positionCard.visible = false;
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
                            resetPlayerHead_daTongZi();
                        })));
                    });
                }
            },
            MJChat : function(data){
                if(data.type == 4){
                    //距离位置显示
                    var data = [[0.25, 0.25], [0.5, 0.72], [0, 0]];
                    checkCanShowDistance(data);
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
                if (msg.showEnd) {
                    this.addChild(new GameOverLayer_daTongZi(),500);

                    var pl = getUIPlayer_daTongZi(0);
                    if(pl.shuffled > 0) {
                        MjClient.showToast("因牌局解散，系统已返还洗牌费用");
                    }
                }
                else
                    MjClient.Scene.addChild(new StopRoomView());
            },
            roundEnd: function() {
                var self = this;
                function delayExe()
                {
                    var sData = MjClient.data.sData;
                    //resetEatActionAnim();
                    if (sData.tData.roundNum <= 0) {
                        var layer = new GameOverLayer_daTongZi();
                        layer.setVisible(false);
                        self.addChild(layer);
                    }
                    postEvent("clearRankIcon_daTongZi", {}); //只为了清除排名标记
                    self.addChild(new EndOneView_daTongZi(), 500);
                }
                this.runAction(cc.sequence(cc.DelayTime(1),cc.callFunc(delayExe)));

                clearJiFen_daTongZi();

                MjClient.playui.showAndHideHeadEffect();
            },
            moveHead: function() {
                postEvent("returnPlayerLayer");
                tableStartHeadMoveAction_daTongZi(this);
            },
            initSceneData: function() {
                reConectHeadLayout_daTongZi(this);
                CheckRoomUiDelete();
                var sData = MjClient.data.sData;
                var tData = sData.tData;
                if(tData.tState == TableState.waitPut )
                {
                    UpdataCurrentPutCard_daTongZi();
                }

                for(var i = 0;i < MjClient.MaxPlayerNum;i++)
                {
                    currentLeftCardCount_daTongZi(i);
                }

                tableStartHeadMoveAction_paohuzi(this);   //不涉及到头像移动动作
                var data = [[0.25, 0.25], [0.5, 0.72], [0, 0]];
                checkCanShowDistance(data);

                // this.addChild(new GameOverLayer_daTongZi());

                MjClient.playui.showAndHideHeadEffect();
            },
            onlinePlayer: function(data) {
                reConectHeadLayout_daTongZi(this);

                if(!data.isTrust){
                    return;
                }
                var player = getUIPlayer_daTongZi(0);
                if(player.info.uid != data.uid){
                    return;
                }
                postEvent("clearCardUI");
                if(MjClient.endoneui && cc.sys.isObjectValid(MjClient.endoneui)){
                    MjClient.endoneui.removeFromParent(true);
                    MjClient.endoneui = null;
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
            PKPut: function(){
                for(var i = 0;i < MjClient.MaxPlayerNum;i++)
                {
                    currentLeftCardCount_daTongZi(i);
                }
                MjClient.playui.showAndHideHeadEffect();
            },
            waitPut: function(){
                MjClient.playui.showAndHideHeadEffect();
            },
            MJShuffle : function(eD) {
                if (MjClient.rePlayVideo != -1)
                    return;
                
                MjClient.playui.shuffleList.push(eD.uid);
                MjClient.playui.playShuffleEffect();
            }
        },
        back: {
            back: {
                _run: function() {
                    changeGameBg(this);

                //     var text = new ccui.Text();
                //     text.setFontName("fonts/fzcy.ttf");
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
                    text.setFontName("fonts/fzcy.ttf");
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
                    if(tData.roundNum_play){
                        this.setString("第" + (tData.roundNum_play + 1) + "局");
                    }else{
                        this.setString("第1局");
                    }
                    
                },
                _event:{
                    mjhand:function()
                    {
                        var tData = MjClient.data.sData.tData;
                        if(tData.roundNum_play){
                            this.setString("第" + (tData.roundNum_play + 1) + "局");
                        }else{
                            this.setString("第1局");
                        }
                    },
                    initSceneData:function()
                    {
                        var tData = MjClient.data.sData.tData;
                        if(tData.roundNum_play){
                            this.setString("第" + (tData.roundNum_play + 1) + "局");
                        }else{
                            this.setString("第1局");
                        }
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

                    if(isIPhoneX()){
                        setWgtLayout(this, [68/1280 * 0.88, 0], [0.9649, 0.13], [0, 0]);
                    }
                },
                _click: function() {
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
                // setWgtLayout(this, [0.12, 0.12],[0.04, 0.62],[0, 0]);

                if(isIPhoneX()){
                    setWgtLayout(this, [68/1280 * 0.88, 0], [0.9649, 0.2368], [0, 0]);
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
                    /*
                     复制房间号-----------------------
                     */
                    var tData = MjClient.data.sData.tData;
                    var str1 = "打筒子,"
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
                        str7 += unescape(pl.info.nickname);
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
                    var tData = MjClient.data.sData.tData;
                    var str1 = "";
                    var str2 = MjClient.playui.getGameInfoString("wxinvite") + ",";
                    var str3 = "速度加入【"+AppCnName[MjClient.getAppType()]+"】";

                    var sData = MjClient.data.sData;
                    // var str7 = "二缺一";
                    // if((MjClient.MaxPlayerNum_leiyang - Object.keys(sData.players).length) == 2){
                    //     str7 = "一缺二";
                    // }
                    // str7 += "(";
                    // var index = 0;
                    // for(var uid in sData.players){
                    //     var pl = sData.players[uid + ""];
                    //     if (!pl) continue;
                    //     str7 += unescape(pl.info.nickname );
                    //     if(index < Object.keys(sData.players).length - 1){
                    //         str7 += ",";
                    //     }
                    //     index ++;
                    // }
                    // str7 += ")";

                    var numArr = ["0", "一", "二", "三", "四"];
                    var str7 = numArr[Object.keys(sData.players).length] + "缺" + numArr[MjClient.data.sData.tData.maxPlayer - Object.keys(sData.players).length];
                    
                    var clubInfoTable = getClubInfoInTable();
                    var txt_club = clubInfoTable ? "(亲友圈:" + clubInfoTable.clubId + "," + getPlayersName(sData.players) +  ")" : 
                                "(" + getPlayersName(sData.players) + ")";
                    var wxUrl1 = MjClient.remoteCfg.entreRoomUrl + "?vipTable=" + tData.tableid;
                    var wxUrl2 = GameCnName[MjClient.gameType] + "  房间号:" + tData.tableid + " " + str7 + txt_club;
                    var wxUrl3 = str1 + str2 + str3;

                    // MjClient.native.wxShareUrl(wxUrl1, wxUrl2,wxUrl3);
                    MjClient.getInviteUrl(function (url) {
                        MjClient.shareUrlToMultiPlatform(url, wxUrl2, wxUrl3);
                    });
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
        BtnHimt:{ //add by  sking for put card button
            _run: function () {
                this.visible = false;
                if (true)// MjClient.data.sData.tData.areaSelectMode.mustPut)
                    setWgtLayout(this,[0.135, 0.128], [0.5, 0.40], [-0.8, 0.26]);
                else
                    setWgtLayout(this,[0.135, 0.128], [0.5, 0.40], [-1.3, 0.26]);
            },
            _click: function(btn) {
                //cc.log("BtnHimt");
                if(putOutCardTips() == 0)
                {
                    PKPassConfirmToServer_card();
                   	MjClient.playui.recoverCannotOutCard();
                }
                playEffect("guandan/tishi");
            },
            _event:{
                //拿到一张牌的时候，出牌按钮亮起，其他状态隐藏，by sking
                // mjhand: function() {
                //     var tData = MjClient.data.sData.tData;
                //     if(!IsTurnToMe() || tData.tState != TableState.waitPut)
                //     {
                //         this.visible = false;
                //     }
                //     else
                //     {
                //         this.visible = true;
                //     }
                // },
                // newCard: function(eD)
                // {
                //     //cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>newCard by sking");
                //     this.visible = true;
                //     //setWgtLayout(this, [0.1, 0.1],[0.7, 0.2],[0, 0]);
                // },
                // PKPut: function(eD) {
                //     //cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>PKPut by sking");
                //     this.visible = false;
                // },
                // waitPut: function() {
                //     var tData = MjClient.data.sData.tData;
                //     if(!IsTurnToMe() || tData.tState != TableState.waitPut)
                //     {
                //         this.visible = false;
                //     }
                //     else
                //     {
                //         this.visible = true;
                //     }
                // },
                // initSceneData: function()
                // {
                //     var tData = MjClient.data.sData.tData;
                //     if(!IsTurnToMe() || tData.tState != TableState.waitPut)
                //     {
                //         this.visible = false;
                //     }
                //     else
                //     {
                //         this.visible = true;
                //     }
                // }
            }
        },//end of add by sking
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
                    if (tData.maxPlayer == 4 && tData.inTeamUids.indexOf(0) >= 0) {
                        this.visible = false;
                    }
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

                    if (tData.maxPlayer == 4 && tData.inTeamUids.indexOf(0) >= 0) {
                        return;
                    }

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
                    if (MjClient.data.sData.tData.inTeamUids.indexOf(0) < 0) {
                        this.visible = true;
                    }
                }
            }
        },
        BtnNoPut:{
            _run: function () {
                this.visible = false;
                setWgtLayout(this,[0.135, 0.128], [0.5, 0.40], [0.0, 0.26]);
            },
            _click: function(btn) {
                // PKPassConfirmToServer_card();
                //  MjClient.playui.recoverCannotOutCard();
                // this.visible = false;
            },
            _event:{
                // 不出按钮 可以过牌的时候亮
                // mjhand: function() {
                //     var tData = MjClient.data.sData.tData;
                //     this.visible = IsTurnToMe() && tData.tState == TableState.waitPut && !tData.areaSelectMode.mustPut;
                // },
                // PKPut: function(eD) {
                //     this.visible = false;
                // },
                // waitPut: function() {
                //     var tData = MjClient.data.sData.tData;
                //     this.visible = IsTurnToMe() && tData.tState == TableState.waitPut && !tData.areaSelectMode.mustPut;
                // },
                // initSceneData: function()
                // {
                //     var tData = MjClient.data.sData.tData;
                //     this.visible = IsTurnToMe() && tData.tState == TableState.waitPut && !tData.areaSelectMode.mustPut;
                // }
            }
        },
        BtnPutCard:{
            _run: function () {
                this.visible = false;
                if (true)// MjClient.data.sData.tData.areaSelectMode.mustPut)
                    setWgtLayout(this,[0.135, 0.128], [0.5, 0.40], [0.8, 0.32]);
                else
                    setWgtLayout(this,[0.135, 0.128], [0.5, 0.40], [1.3, 0.32]);
            },
            _click: function(btn) {
                //cc.log("BtnPutCard");
				cardsSort_daTongZi(MjClient.selectCards_card);
                PutOutCard_card(); //可以出牌
                // MjClient.playui.recoverCannotOutCard();
                this.visible = false;
            },
            _event:{
                //拿到一张牌的时候，出牌按钮亮起，其他状态隐藏，by sking
                // mjhand: function() {
                //     //cc.log("============mjhand=========== btnPutCard");
                //     var tData = MjClient.data.sData.tData;
                //     if(!IsTurnToMe() || tData.tState != TableState.waitPut)
                //     {
                //         this.visible = false;
                //     }
                //     else
                //     {
                //         this.visible = true;
                //     }
                // },
                // newCard: function(eD)
                // {
                //     //cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>newCard by sking");
                //     this.visible = true;
                //     //setWgtLayout(this, [0.1, 0.1],[0.7, 0.2],[0, 0]);
                // },
                // PKPut: function(eD) {
                //     //cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>PKPut by sking");
                //     this.visible = false;
                //     MjClient.playui.recoverCannotOutCard();
                // },

                // waitPut: function() {
                //     var tData = MjClient.data.sData.tData;
                //     if(!IsTurnToMe() || tData.tState != TableState.waitPut)
                //     {
                //         this.visible = false;
                //     }
                //     else
                //     {
                //         this.visible = true;
                //     }
                // },
                // initSceneData: function()
                // {
                //     var tData = MjClient.data.sData.tData;
                //     if(!IsTurnToMe() || tData.tState != TableState.waitPut)
                //     {
                //         this.visible = false;
                //     }
                //     else
                //     {
                //         this.visible = true;
                //     }
                // }
            }
        },//end of add by sking
        positionCard:{ //add by  sking for put card button
            _run: function () {
                this.visible = false;
                setWgtLayout(this,[0.18, 0.18], [0.5, 0.5], [0, 0]);
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
                changePosition: function(msg)
                {
                    this.visible = true;
                }
            }
        },//end of add by sking
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
                // var cardList = new daTongZi.CardListLayer();
                // this.addChild(cardList);
                // setWgtLayout(cardList, [1, 0], [0, 0], [0, 0]);
                // this.cardList = cardList;

                // var throwList = new daTongZi.CardThrowListLayer();
                // this.addChild(throwList);
                // this.throwList = throwList;
                // setWgtLayout(throwList, [0.4, 0], [0.45, 0.4], [0, 0]);
            },
            head: {
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
                trust : {
                    _run : function(){
                        this.visible = false;
                    },
                    _event:{
                        TZTrust : function(){
                            var pl = getUIPlayer_daTongZi(0);
                            if(pl){
                                this.visible = pl.isTrust;
                            }
                        },
                        initSceneData: function() {
                            var pl = getUIPlayer_daTongZi(0);
                            if(pl){
                                this.visible = pl.isTrust;
                            }
                        },
                        mjhand: function(){
                            var pl = getUIPlayer_daTongZi(0);
                            if(pl){
                                this.visible = pl.isTrust;
                            }
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
                _click: function(btn) { // todo
                    showPlayerInfo_daTongZi(0, btn);
                },
                _event: {
                    loadWxHead: function(d) {
                        // setWxHead(this, d, 0);
                    },
                    addPlayer: function() {
                        showFangzhuTagIcon_daTongZi(this, 0);
                    },
                    removePlayer: function() {
                        showFangzhuTagIcon_daTongZi(this, 0);
                    },
                    initSceneData : function(){
                        showFangzhuTagIcon_daTongZi(this,0);
                    },
                    mjhand : function(){
                        showFangzhuTagIcon_daTongZi(this,0);
                    }
                },
                _run: function () {
                    //this.zIndex = 600;
                    showFangzhuTagIcon(this,0);
                },
                score_bg:{_visible:false},
                name_bg:{_visible:false},
                jiPaiQi: {
                    _run : function(){
                        var tData = MjClient.data.sData.tData
                        if(tData.maxPlayer == 4 && tData.areaSelectMode.isReCall){
                            this.visible = true;
                        }else{
                            this.visible = false;
                        }

                        if(MjClient.rePlayVideo != -1){
                            this.visible = false;
                        }

                        if(isIPhoneX()){
                            this.y -= 20;
                        }
                    },
                    _click : function(btn){
                        var tData = MjClient.data.sData.tData;
                        if (tData.tState == TableState.waitPut || tData.tState == TableState.waitEat) {
                            var jpqNode = new daTongZi.JiPaiQiNode();
                            MjClient.playui.addChild(jpqNode);
                        }

                        //test
                        //3人3副
                        // var obj = {"players":{"1000112":{"mjdesc":[" ÓÚ2018-03-17 20:19:58ÉêÇë½âÉ¢"],"mjhand":[310,530,305,207,407,407,108,210,110,414,114,112,520,405,210,208,107,305,412,308,107,410],"winone":0,"winall":0,"info":{"uid":1000112,"appid":"shaoyang","unionid":"unionid-1000112","sex":2,"nickname":"%u6E38%u5BA2112","headimgurl":"http://cdn.jtcfgame.com/images/8.jpg","district":"¹ã¶«Ê¡ÉîÛÚÊÐ","mobileNum":null,"registerIp":"244.240.176.134","lastLoginTime":1521288587919,"lastShareDay":0,"createRoomNum":10,"createTime":1520218954230,"money":100,"integral":0,"limitMoney":0,"myAgentId":null,"sid":30,"fid":"pkcon001","remoteIP":"172.17.100.38","lockMoney":0,"did":"pkplayer000","lastGameTime":1521289199971},"roomStatistics":[0,0,0,0,0],"score_draw":0,"stats_draw":{"5":0,"10":0,"13":0},"score_rank":0,"score_lastRound":0,"score_spclType":0,"stats_spclType":[0,0,0,0,0,0,0,0,0],"windif":-400},"1000113":{"mjdesc":["Í¬Òâ½âÉ¢"],"mjhand":[206,205,115,311,415,105,311,312,306,405,315,405,411,112,312,111,115,105,309,213,313,209,209,205,315],"winone":65,"winall":65,"info":{"uid":1000113,"appid":"shaoyang","unionid":"unionid-1000113","sex":2,"nickname":"%u6E38%u5BA2113","headimgurl":"http://cdn.jtcfgame.com/images/9.jpg","district":"¹ã¶«Ê¡ÉîÛÚÊÐ","mobileNum":null,"registerIp":"12.131.2.229","lastLoginTime":1521288590062,"lastShareDay":0,"createRoomNum":10,"createTime":1520218954230,"money":100,"integral":0,"limitMoney":0,"myAgentId":null,"sid":30,"fid":"pkcon000","remoteIP":"172.17.100.38","lockMoney":0,"did":"pkplayer001","lastGameTime":1521289199971},"roomStatistics":[0,0,0,0,0],"score_draw":65,"stats_draw":{"5":1,"10":0,"13":6},"score_rank":0,"score_lastRound":0,"score_spclType":0,"stats_spclType":[0,0,0,0,0,0,0,0,0],"windif":-100},"1000114":{"mjdesc":["³¬Ê±Ä¬ÈÏÍ¬Òâ"],"mjhand":[414,306,110,209,409,409,109,211,213,106,407,115,415,411,111,310,310,520,214,314,113,106,415,110,413,520,307,114,406],"winone":0,"winall":0,"info":{"uid":1000114,"appid":"shaoyang","unionid":"unionid-1000114","sex":2,"nickname":"%u6E38%u5BA2114","headimgurl":"http://cdn.jtcfgame.com/images/5.jpg","district":"¹ã¶«Ê¡ÉîÛÚÊÐ","mobileNum":null,"registerIp":"198.246.119.181","lastLoginTime":1521288592248,"lastShareDay":0,"createRoomNum":10,"createTime":1520218954230,"money":100,"integral":0,"limitMoney":0,"myAgentId":null,"sid":31,"fid":"pkcon001","remoteIP":"172.17.100.38","lockMoney":0,"did":"pkplayer000","lastGameTime":1521289199972},"roomStatistics":[0,0,0,0,0],"score_draw":0,"stats_draw":{"5":0,"10":0,"13":0},"score_rank":0,"score_lastRound":0,"score_spclType":300,"stats_spclType":[0,0,0,1,0,0,0,0,0],"windif":500}},"tData":{"initCoin":0,"gameType":2018067,"roundAll":600,"roundNum":-2,"isValidTable":false,"fanNum":0,"maxPlayer":3,"uids":[1000112,1000114,1000113],"owner":1000112,"maxHunNum":4,"tableid":"396834","cardNext":129,"winner":-1,"zhuang":0,"curPlayer":2,"lastPutPlayer":2,"putType":0,"lastDrawPlayer":-1,"tState":6,"lastPutCard":null,"genpaiCount":0,"isHunCardPlay":false,"canHu7":false,"delEnd":1521289318196,"delEndHePai":0,"firstDel":1000112,"canEatHu":true,"huangNum":14,"lastGangType":0,"lastGangDianpaoPlayer":-1,"xingPlayer":-1,"areaSelectMode":{"maxPlayer":3,"payWay":0,"deckNum":3,"scoreLine":600,"lastRoundScore":200,"isAnCards":true,"isReCall":false,"isShowLeft":true,"isRandom":false,"haveKingTz":true,"isBiChu":true},"deckNum":3,"handCount":43,"leftCardCount":9,"inTeamUids":[],"gameCnName":"ÉÛÑô´òÍ²×Ó","hunCard":-1,"currCard":-1,"drawType":0,"roundNum_play":1,"tids":[],"lastPutCardType":null,"score_draw":0,"stats_draw":{"5":0,"10":0,"13":0},"rank":[],"hePai":false,"roundNumPre":600},"teams":{},"cards":[210,205,414,211,206,305,113,410,410],"roundEndTime":"2018-03-17 20:19:59","isDismiss":true,"playInfo":{"gameid":"js3mj","ip":"test-project-0.oss-cn-hangzhou.aliyuncs.com","gametype":2018067,"owner":1000112,"money":0,"now":"2018-03-17 20:19:59","tableid":"396834","logid":"pkroom000_1521280225470","players":[{"uid":1000112,"winall":0,"score_spclType":0,"score_lastRound":0,"windif":-400,"nickname":"%u6E38%u5BA2112","money":100},{"uid":1000113,"winall":65,"score_spclType":0,"score_lastRound":0,"windif":-100,"nickname":"%u6E38%u5BA2113","money":100},{"uid":1000114,"winall":0,"score_spclType":300,"score_lastRound":0,"windif":500,"nickname":"%u6E38%u5BA2114","money":100}]}};
                        //3人4副
                        //var obj = {"players":{"1000140":{"mjdesc":[],"mjhand":[],"winone":15,"winall":15,"info":{"uid":1000140,"appid":"shaoyang","unionid":"unionid-1000140","sex":2,"nickname":"%u6E38%u5BA2140","headimgurl":"http://cdn.jtcfgame.com/images/0.jpg","district":"¹ã¶«Ê¡ÉîÛÚÊÐ","mobileNum":null,"registerIp":"26.218.159.11","lastLoginTime":1520818403843,"lastShareDay":0,"createRoomNum":10,"createTime":1520218954230,"money":100,"limitMoney":0,"myAgentId":null,"remoteIP":"172.17.100.42","lockMoney":0,"sid":18,"fid":"pkcon001","did":"pkplayer000","lastGameTime":1520824670698},"roomStatistics":[0,0,0,0,0],"score_draw":55,"stats_draw":{"5":3,"10":4,"13":0},"score_rank":-40,"score_lastRound":0,"score_spclType":0,"stats_spclType":[0,0,0,0,0,0,0,0],"windif":-500},"1000141":{"mjdesc":[],"mjhand":[413,520,530,312],"winone":-15,"winall":-15,"info":{"uid":1000141,"appid":"shaoyang","unionid":"unionid-1000141","sex":2,"nickname":"%u6E38%u5BA2141","headimgurl":"http://cdn.jtcfgame.com/images/4.jpg","district":"¹ã¶«Ê¡ÉîÛÚÊÐ","mobileNum":null,"registerIp":"215.7.37.240","lastLoginTime":1520818405636,"lastShareDay":0,"createRoomNum":10,"createTime":1520218954230,"money":100,"limitMoney":0,"myAgentId":null,"remoteIP":"172.17.100.42","lockMoney":0,"sid":19,"fid":"pkcon000","did":"pkplayer001","lastGameTime":1520824670708},"roomStatistics":[0,0,0,0,0],"score_draw":45,"stats_draw":{"5":5,"10":0,"13":2},"score_rank":-60,"score_lastRound":0,"score_spclType":0,"stats_spclType":[0,0,0,0,0,0,0,0],"windif":-500},"1000142":{"mjdesc":[],"mjhand":[],"winone":260,"winall":260,"info":{"uid":1000142,"appid":"shaoyang","unionid":"unionid-1000142","sex":2,"nickname":"%u6E38%u5BA2142","headimgurl":"http://cdn.jtcfgame.com/images/5.jpg","district":"¹ã¶«Ê¡ÉîÛÚÊÐ","mobileNum":null,"registerIp":"45.201.52.220","lastLoginTime":1520824278328,"lastShareDay":0,"createRoomNum":10,"createTime":1520218954230,"money":100,"limitMoney":0,"myAgentId":null,"remoteIP":"172.17.100.42","lockMoney":0,"sid":19,"fid":"pkcon001","did":"pkplayer000","lastGameTime":1520824670710},"roomStatistics":[0,0,0,0,0],"score_draw":160,"stats_draw":{"5":2,"10":7,"13":8},"score_rank":100,"score_lastRound":200,"score_spclType":0,"stats_spclType":[0,0,0,0,0,0,0,0],"windif":0}},"tData":{"initCoin":0,"gameType":2018067,"roundAll":8,"roundNum":-2,"isValidTable":false,"fanNum":0,"maxPlayer":3,"uids":[1000140,1000141,1000142],"owner":1000140,"maxHunNum":4,"tableid":"643483","cardNext":132,"winner":-1,"zhuang":-1,"curPlayer":1,"lastPutPlayer":-1,"putType":0,"lastDrawPlayer":-1,"tState":6,"lastPutCard":[115,115,215],"genpaiCount":0,"isHunCardPlay":false,"canHu7":false,"delEnd":0,"delEndHePai":0,"firstDel":0,"canEatHu":true,"huangNum":14,"lastGangType":0,"lastGangDianpaoPlayer":-1,"xingPlayer":-1,"areaSelectMode":{"maxPlayer":3,"payWay":0,"deckNum":4,"scoreLine":100,"lastRoundScore":200},"deckNum":4,"handCount":44,"leftCardCount":52,"gameCnName":"ÉÛÑô´òÍ²×Ó","hunCard":-1,"currCard":-1,"drawType":0,"roundNum_play":1,"tids":[],"lastPutCardType":3,"score_draw":0,"stats_draw":{"5":0,"10":0,"13":0},"rank":[1000142,1000140,1000141]},"teams":{},"roundEndTime":"2018-03-12 11:17:50","isDismiss":false};
                        
                        //4人3副
                        // var obj = {"players":{"1000140":{"mjdesc":[],"mjhand":[],"winone":0,"winall":0,"info":{"uid":1000140,"appid":"shaoyang","unionid":"unionid-1000140","sex":2,"nickname":"%u6E38%u5BA2140","headimgurl":"http://cdn.jtcfgame.com/images/0.jpg","district":"¹ã¶«Ê¡ÉîÛÚÊÐ","mobileNum":null,"registerIp":"26.218.159.11","lastLoginTime":1520835620414,"lastShareDay":0,"createRoomNum":10,"createTime":1520218954230,"money":100,"limitMoney":0,"myAgentId":null,"remoteIP":"172.17.100.42","lockMoney":0,"sid":117,"fid":"pkcon000","did":"pkplayer000","lastGameTime":1520837739641},"roomStatistics":[0,0,0,0,0],"score_draw":50,"stats_draw":{"5":4,"10":1,"13":2},"score_rank":0,"score_lastRound":0,"score_spclType":0,"stats_spclType":[0,0,0,0,0,0,0,0],"windif":0},"1000141":{"mjdesc":[],"mjhand":[408,312,115,111,411,213,411,109,415,113,212,106,215,311,105,210,113,410,309,205,206,112,209,307,105,405,210,414,111,108,313,310,309],"winone":0,"winall":0,"info":{"uid":1000141,"appid":"shaoyang","unionid":"unionid-1000141","sex":2,"nickname":"%u6E38%u5BA2141","headimgurl":"http://cdn.jtcfgame.com/images/4.jpg","district":"¹ã¶«Ê¡ÉîÛÚÊÐ","mobileNum":null,"registerIp":"215.7.37.240","lastLoginTime":1520835622033,"lastShareDay":0,"createRoomNum":10,"createTime":1520218954230,"money":100,"limitMoney":0,"myAgentId":null,"remoteIP":"172.17.100.42","lockMoney":0,"sid":117,"fid":"pkcon001","did":"pkplayer001","lastGameTime":1520837739642},"roomStatistics":[0,0,0,0,0],"score_draw":0,"stats_draw":{"5":0,"10":0,"13":0},"score_rank":0,"score_lastRound":0,"score_spclType":0,"stats_spclType":[0,0,0,0,0,0,0,0],"windif":0},"1000142":{"mjdesc":[],"mjhand":[],"winone":0,"winall":0,"info":{"uid":1000142,"appid":"shaoyang","unionid":"unionid-1000142","sex":2,"nickname":"%u6E38%u5BA2142","headimgurl":"http://cdn.jtcfgame.com/images/5.jpg","district":"¹ã¶«Ê¡ÉîÛÚÊÐ","mobileNum":null,"registerIp":"45.201.52.220","lastLoginTime":1520835624186,"lastShareDay":0,"createRoomNum":10,"createTime":1520218954230,"money":100,"limitMoney":0,"myAgentId":null,"remoteIP":"172.17.100.42","lockMoney":0,"sid":118,"fid":"pkcon000","did":"pkplayer000","lastGameTime":1520837739642},"roomStatistics":[0,0,0,0,0],"score_draw":75,"stats_draw":{"5":1,"10":4,"13":3},"score_rank":0,"score_lastRound":0,"score_spclType":0,"stats_spclType":[0,0,0,0,0,0,0,0],"windif":0},"1000143":{"mjdesc":[],"mjhand":[207,208,412,407,213,308,115,313,315,314,305,214,313,305,307,414,310,311,112,410,211,106,114,315,114,211,109,405,308,110,114,314,409],"winone":0,"winall":0,"info":{"uid":1000143,"appid":"shaoyang","unionid":"unionid-1000143","sex":2,"nickname":"%u6E38%u5BA2143","headimgurl":"http://cdn.jtcfgame.com/images/5.jpg","district":"¹ã¶«Ê¡ÉîÛÚÊÐ","mobileNum":null,"registerIp":"180.200.169.183","lastLoginTime":1520837536851,"lastShareDay":0,"createRoomNum":10,"createTime":1520218954230,"money":100,"limitMoney":0,"myAgentId":null,"remoteIP":"172.17.100.42","lockMoney":0,"sid":118,"fid":"pkcon001","did":"pkplayer001","lastGameTime":1520837739643},"roomStatistics":[0,0,0,0,0],"score_draw":0,"stats_draw":{"5":0,"10":0,"13":0},"score_rank":0,"score_lastRound":0,"score_spclType":0,"stats_spclType":[0,0,0,0,0,0,0,0],"windif":0}},"tData":{"initCoin":0,"gameType":2018067,"roundAll":8,"roundNum":-2,"isValidTable":false,"fanNum":0,"maxPlayer":4,"uids":[1000140,1000141,1000142,1000143],"owner":1000140,"maxHunNum":4,"tableid":"158834","cardNext":132,"winner":-1,"zhuang":-1,"curPlayer":1,"lastPutPlayer":-1,"putType":0,"lastDrawPlayer":-1,"tState":6,"lastPutCard":[107,107,207,307,407,407],"genpaiCount":0,"isHunCardPlay":false,"canHu7":false,"delEnd":0,"delEndHePai":0,"firstDel":0,"canEatHu":true,"huangNum":14,"lastGangType":0,"lastGangDianpaoPlayer":-1,"xingPlayer":-1,"areaSelectMode":{"maxPlayer":4,"payWay":0,"deckNum":3,"scoreLine":100,"lastRoundScore":200},"deckNum":3,"handCount":33,"leftCardCount":0,"gameCnName":"ÉÛÑô´òÍ²×Ó","hunCard":-1,"currCard":-1,"drawType":0,"roundNum_play":1,"tids":["A","B"],"lastPutCardType":5,"score_draw":0,"stats_draw":{"5":0,"10":0,"13":0},"rank":[1000142,1000140]},"teams":{"A":{"uids":[1000140,1000142],"stats_spclType":[0,0,0,0,0,0,0,0],"score_spclType":0,"score_lastRound":200,"winall":125,"windif":300,"score_draw":125,"stats_draw":{"5":5,"10":5,"13":5},"score_rank":0,"winone":125,"score_total":300},"B":{"uids":[1000141,1000143],"stats_spclType":[0,0,0,0,0,0,0,0],"score_spclType":0,"score_lastRound":0,"winone":0,"winall":0,"windif":-300,"score_draw":0,"stats_draw":{"5":0,"10":0,"13":0},"score_rank":0,"score_total":0}},"roundEndTime":"2018-03-12 14:55:39","isDismiss":false};
                        //roundEnd
                        // var obj = {"players":{"1000140":{"mjdesc":[" ÓÚ2018-03-15 21:27:32ÉêÇë½âÉ¢"],"mjhand":[112,114,411,308,210,207,215,311,410,106,108,409,105,407,409,311,313,309,214,314,405,211,210,411,315,110,111,408,106,115,410],"winone":0,"winall":0,"info":{"uid":1000140,"appid":"shaoyang","unionid":"unionid-1000140","sex":2,"nickname":"%u6E38%u5BA2140","headimgurl":"http://cdn.jtcfgame.com/images/0.jpg","district":"¹ã¶«Ê¡ÉîÛÚÊÐ","mobileNum":null,"registerIp":"26.218.159.11","lastLoginTime":1521119480981,"lastShareDay":0,"createRoomNum":10,"createTime":1520218954230,"money":100,"limitMoney":0,"myAgentId":null,"remoteIP":"172.17.100.42","lockMoney":0,"sid":1,"fid":"pkcon000","did":"pkplayer000","lastGameTime":1521120454894},"roomStatistics":[0,0,0,0,0],"score_draw":0,"stats_draw":{"5":0,"10":0,"13":0},"score_rank":0,"score_lastRound":0,"score_spclType":0,"stats_spclType":[0,0,0,0,0,0,0,0,0],"windif":0},"1000141":{"mjdesc":["Í¬Òâ½âÉ¢"],"mjhand":[107,412,314,215,111,312,315,213,214,212,305,114,206,110,208,307,406,109,310,210,415,407,406,313,308,405,110,112,207,208,314],"winone":0,"winall":0,"info":{"uid":1000141,"appid":"shaoyang","unionid":"unionid-1000141","sex":2,"nickname":"%u6E38%u5BA2141","headimgurl":"http://cdn.jtcfgame.com/images/4.jpg","district":"¹ã¶«Ê¡ÉîÛÚÊÐ","mobileNum":null,"registerIp":"215.7.37.240","lastLoginTime":1521115723247,"lastShareDay":0,"createRoomNum":10,"createTime":1520218954230,"money":100,"limitMoney":0,"myAgentId":null,"remoteIP":"172.17.100.42","lockMoney":0,"sid":1,"fid":"pkcon001","did":"pkplayer001","lastGameTime":1521120454897},"roomStatistics":[0,0,0,0,0],"score_draw":0,"stats_draw":{"5":0,"10":0,"13":0},"score_rank":0,"score_lastRound":0,"score_spclType":0,"stats_spclType":[0,0,0,0,0,0,0,0,0],"windif":0},"1000142":{"mjdesc":["³¬Ê±Ä¬ÈÏÍ¬Òâ"],"mjhand":[415,113,312,108,213,212,208,205,311,413,209,408,114,306,113,305,113,107,215,412,307,106,411,414,213,306,205,309,214,206,414],"winone":0,"winall":0,"info":{"uid":1000142,"appid":"shaoyang","unionid":"unionid-1000142","sex":2,"nickname":"%u6E38%u5BA2142","headimgurl":"http://cdn.jtcfgame.com/images/5.jpg","district":"¹ã¶«Ê¡ÉîÛÚÊÐ","mobileNum":null,"registerIp":"45.201.52.220","lastLoginTime":1521115725279,"lastShareDay":0,"createRoomNum":10,"createTime":1520218954230,"money":100,"limitMoney":0,"myAgentId":null,"remoteIP":"172.17.100.42","lockMoney":0,"sid":2,"fid":"pkcon000","did":"pkplayer000","lastGameTime":1521120454905},"roomStatistics":[0,0,0,0,0],"score_draw":0,"stats_draw":{"5":0,"10":0,"13":0},"score_rank":0,"score_lastRound":0,"score_spclType":0,"stats_spclType":[0,0,0,0,0,0,0,0,0],"windif":0},"1000143":{"mjdesc":["Í¬Òâ½âÉ¢"],"mjhand":[312,310,211,309,209,105,410,112,109,115,315,415,115,205,211,413,108,409,105,405,406,107,109,407,408,313,212,412,307,207,209],"winone":0,"winall":0,"info":{"uid":1000143,"appid":"shaoyang","unionid":"unionid-1000143","sex":2,"nickname":"%u6E38%u5BA2143","headimgurl":"http://cdn.jtcfgame.com/images/5.jpg","district":"¹ã¶«Ê¡ÉîÛÚÊÐ","mobileNum":null,"registerIp":"180.200.169.183","lastLoginTime":1521116669868,"lastShareDay":0,"createRoomNum":10,"createTime":1520218954230,"money":100,"limitMoney":0,"myAgentId":null,"remoteIP":"172.17.100.42","lockMoney":0,"sid":2,"fid":"pkcon001","did":"pkplayer001","lastGameTime":1521120454906},"roomStatistics":[0,0,0,0,0],"score_draw":0,"stats_draw":{"5":0,"10":0,"13":0},"score_rank":0,"score_lastRound":0,"score_spclType":200,"stats_spclType":[0,0,1,0,0,0,0,0,0],"windif":0}},"tData":{"initCoin":0,"gameType":2018067,"roundAll":1000,"roundNum":-2,"isValidTable":true,"fanNum":0,"maxPlayer":4,"uids":[1000140,1000143,1000142,1000141],"owner":1000140,"maxHunNum":4,"tableid":"819124","cardNext":124,"winner":-1,"zhuang":0,"curPlayer":0,"lastPutPlayer":-1,"putType":0,"lastDrawPlayer":-1,"tState":6,"lastPutCard":null,"genpaiCount":0,"isHunCardPlay":false,"canHu7":false,"delEnd":0,"delEndHePai":0,"firstDel":1000140,"canEatHu":true,"huangNum":14,"lastGangType":0,"lastGangDianpaoPlayer":-1,"xingPlayer":-1,"areaSelectMode":{"maxPlayer":4,"payWay":0,"deckNum":3,"scoreLine":1000,"lastRoundScore":0,"isAnCards":true,"isReCall":true,"isShowLeft":false,"isRandom":false,"haveKingTz":false,"isBiChu":false},"deckNum":3,"handCount":31,"leftCardCount":8,"inTeamUids":[1000140,1000143,1000142,1000141],"gameCnName":"ÉÛÑô´òÍ²×Ó","hunCard":-1,"currCard":-1,"drawType":0,"roundNum_play":2,"tids":["A","B"],"lastPutCardType":null,"score_draw":0,"stats_draw":{"5":0,"10":0,"13":0},"rank":[],"hePai":false,"roundNumPre":999},"teams":{"A":{"uids":[1000140,1000142],"score_draw":0,"stats_spclType":[0,0,0,0,0,0,0,0,0],"score_spclType":0,"score_lastRound":0,"winall":220,"windif":0,"stats_draw":{"5":0,"10":0,"13":0},"score_rank":0,"winone":0,"score_total":200},"B":{"score_draw":0,"uids":[1000143,1000141],"stats_spclType":[0,0,1,0,0,0,0,0,0],"score_spclType":200,"score_lastRound":0,"winone":0,"winall":10,"windif":0,"stats_draw":{"5":0,"10":0,"13":0},"score_rank":0,"score_total":200}},"cards":[413,310,306,414,206,305,308,111],"roundEndTime":"2018-03-15 21:27:34","isDismiss":true};
                        //4人4副
                        //总结算
                        // var obj = {"players":{"1000111":{"mjdesc":[],"mjhand":[],"winone":0,"winall":0,"info":{"uid":1000111,"appid":"shaoyang","unionid":"unionid-1000111","sex":2,"nickname":"%u6E38%u5BA2111","headimgurl":"http://cdn.jtcfgame.com/images/4.jpg","district":"¹ã¶«Ê¡ÉîÛÚÊÐ","mobileNum":null,"registerIp":"76.249.100.54","lastLoginTime":1521167816946,"lastShareDay":20180314,"createRoomNum":10,"createTime":1520218954230,"money":102,"limitMoney":0,"myAgentId":null,"sid":12,"fid":"pkcon000","remoteIP":"172.17.100.38","lockMoney":0,"did":"pkplayer001","lastGameTime":1521182754848},"roomStatistics":[0,0,0,0,0],"score_draw":40,"stats_draw":{"5":0,"10":0,"13":4},"score_rank":0,"score_lastRound":0,"score_spclType":0,"stats_spclType":[0,0,0,0,0,0,0,0,0],"windif":0},"1000112":{"mjdesc":[],"mjhand":[],"winone":0,"winall":0,"info":{"uid":1000112,"appid":"shaoyang","unionid":"unionid-1000112","sex":2,"nickname":"%u6E38%u5BA2112","headimgurl":"http://cdn.jtcfgame.com/images/8.jpg","district":"¹ã¶«Ê¡ÉîÛÚÊÐ","mobileNum":null,"registerIp":"244.240.176.134","lastLoginTime":1521167818739,"lastShareDay":0,"createRoomNum":10,"createTime":1520218954230,"money":100,"limitMoney":0,"myAgentId":null,"sid":13,"fid":"pkcon000","remoteIP":"172.17.100.38","lockMoney":0,"did":"pkplayer000","lastGameTime":1521182754850},"roomStatistics":[0,0,0,0,0],"score_draw":170,"stats_draw":{"5":8,"10":8,"13":5},"score_rank":0,"score_lastRound":0,"score_spclType":300,"stats_spclType":[0,1,1,0,0,0,0,0,0],"windif":0},"1000113":{"mjdesc":[],"mjhand":[307,407,207,414,207,215,215],"winone":0,"winall":0,"info":{"uid":1000113,"appid":"shaoyang","unionid":"unionid-1000113","sex":2,"nickname":"%u6E38%u5BA2113","headimgurl":"http://cdn.jtcfgame.com/images/9.jpg","district":"¹ã¶«Ê¡ÉîÛÚÊÐ","mobileNum":null,"registerIp":"12.131.2.229","lastLoginTime":1521167820667,"lastShareDay":0,"createRoomNum":10,"createTime":1520218954230,"money":100,"limitMoney":0,"myAgentId":null,"sid":13,"fid":"pkcon001","remoteIP":"172.17.100.38","lockMoney":0,"did":"pkplayer001","lastGameTime":1521182754851},"roomStatistics":[0,0,0,0,0],"score_draw":10,"stats_draw":{"5":0,"10":0,"13":1},"score_rank":0,"score_lastRound":0,"score_spclType":200,"stats_spclType":[0,0,1,0,0,0,0,0,0],"windif":0},"1000114":{"mjdesc":[],"mjhand":[],"winone":0,"winall":0,"info":{"uid":1000114,"appid":"shaoyang","unionid":"unionid-1000114","sex":2,"nickname":"%u6E38%u5BA2114","headimgurl":"http://cdn.jtcfgame.com/images/5.jpg","district":"¹ã¶«Ê¡ÉîÛÚÊÐ","mobileNum":null,"registerIp":"198.246.119.181","lastLoginTime":1521167822714,"lastShareDay":0,"createRoomNum":10,"createTime":1520218954230,"money":100,"limitMoney":0,"myAgentId":null,"sid":14,"fid":"pkcon001","remoteIP":"172.17.100.38","lockMoney":0,"did":"pkplayer000","lastGameTime":1521182754851},"roomStatistics":[0,0,0,0,0],"score_draw":60,"stats_draw":{"5":4,"10":2,"13":2},"score_rank":0,"score_lastRound":0,"score_spclType":0,"stats_spclType":[0,0,0,0,0,0,0,0,0],"windif":0}},"tData":{"initCoin":0,"gameType":2018067,"roundAll":600,"roundNum":-2,"isValidTable":true,"fanNum":0,"maxPlayer":4,"uids":[1000111,1000114,1000112,1000113],"owner":1000111,"maxHunNum":4,"tableid":"538018","cardNext":124,"winner":-1,"zhuang":2,"curPlayer":3,"lastPutPlayer":0,"putType":0,"lastDrawPlayer":-1,"tState":6,"lastPutCard":[211,211,411,212,212,312],"genpaiCount":0,"isHunCardPlay":false,"canHu7":false,"delEnd":0,"delEndHePai":0,"firstDel":0,"canEatHu":true,"huangNum":14,"lastGangType":0,"lastGangDianpaoPlayer":-1,"xingPlayer":-1,"areaSelectMode":{"maxPlayer":4,"payWay":0,"deckNum":3,"scoreLine":600,"lastRoundScore":200,"isAnCards":true,"isReCall":true,"isShowLeft":false,"isRandom":false,"haveKingTz":false,"isBiChu":false},"deckNum":3,"handCount":31,"leftCardCount":8,"inTeamUids":[1000111,1000114,1000112,1000113],"gameCnName":"ÉÛÑô´òÍ²×Ó","hunCard":-1,"currCard":-1,"drawType":0,"roundNum_play":3,"tids":["A","B"],"lastPutCardType":4,"score_draw":0,"stats_draw":{"5":0,"10":0,"13":0},"rank":[1000114,1000112,1000111,1000113]},"teams":{"A":{"uids":[1000111,1000112],"score_draw":210,"stats_spclType":[0,1,1,0,0,0,0,0,0],"score_spclType":300,"score_lastRound":200,"winall":630,"windif":700,"stats_draw":{"5":8,"10":8,"13":9},"score_rank":0,"winone":210,"score_total":1100},"B":{"score_draw":70,"uids":[1000114,1000113],"stats_spclType":[0,0,1,0,0,0,0,0,0],"score_spclType":200,"score_lastRound":0,"winone":70,"winall":175,"windif":-700,"stats_draw":{"5":4,"10":2,"13":3},"score_rank":0,"score_total":400}},"cards":[415,306,210,110,114,108,311,106],"roundEndTime":"2018-03-16 14:45:54","isDismiss":false};
                        // MjClient.data.sData.players = obj.players;
                        // MjClient.data.sData.tData = obj.tData;
                        // MjClient.data.sData.teams = obj.teams;
                        // MjClient.data.sData.cards = obj.cards;

                        // MjClient.Scene.addChild(new EndOneView_daTongZi());
                        // MjClient.Scene.addChild(new GameOverLayer_daTongZi());

                    }
                },
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
                        clearRankIcon_daTongZi : function(){
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
                    },
                    initSceneData: function() {
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
                        DealPKPass_daTongZi(UIoff);
                        var url = "datongzi/nv/pass";
                        var pl = MjClient.data.sData.players[eD.uid];
                        playEffect(url, false, pl.info.sex);
                      }
                  }
                },
                _visible: false
            },
            trustTime : {
                _run:function()
                {
                    setWgtLayout(this, [0, 43/720], [0.2, 0.43], [0, 0]);
                    if(isIPhoneX()){
                        setWgtLayout(this, [0, 43/720], [0.15, 0.38], [0, 0]);
                    }
                    this.ignoreContentAdaptWithSize(true);
                    this.setString("");
                },
                _event : {
                    initSceneData : function(){
                        MjClient.playui.showCountdown(this, 0);
                    },
                    PKPut: function(){
                        MjClient.playui.showCountdown(this, 0);
                    },
                    waitPut: function(){
                        MjClient.playui.showCountdown(this, 0);
                    },
                    mjhand: function(){
                        MjClient.playui.showCountdown(this, 0);
                    },
                    TZTrust : function(){
                        MjClient.playui.showCountdown(this, 0);
                    }
                }
            },
            _event: {
                clearCardUI: function() {
                    clearCardUI_daTongZi(this, 0);
                },
                initSceneData: function(eD) {
                    SetUserVisible_daTongZi(this, 0);
                    reConnectShowDeskCard_daTongZi();
                    MjClient.playui.showAndHideTrust(this, 0);
                },
                addPlayer: function(eD) {
                    SetUserVisible_daTongZi(this, 0);
                },
                removePlayer: function(eD) {
                    SetUserVisible_daTongZi(this, 0);
                },
                TZJoinTeam: function() {
                    updateHeadInfo_daTongZi(this, 0);
                    updateZuInfo_daTongZi(this, 0);
                },
                mjhand: function(eD) {
                    InitUserHandUI_daTongZi(this, 0);
                    SetUserVisible_daTongZi(this, 0);
                    MjClient.playui.showAndHideTrust(this, 0);
                },
                roundEnd: function() {
                    InitUserCoinAndName_daTongZi(this, 0);
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
                    var pl = getUIPlayer_daTongZi(0);
                    if(eD.uid == SelfUid() && MjClient.rePlayVideo == -1){
                        cc.log("===========throwList self====================");
                        if(this.cardList && pl.isTrust){
                            this.cardList.trustAction(eD.card);
                        }
                    }else
                    {
                        if(this.throwList){
                            this.throwList.hideCards();
                        }
                        DealMJPut_daTongZi(this,eD, 0);
                    }
                    
                    MjClient.playui.showAndHideTrust(this, 0);
                },
                PKPut_daTongZi : function(eD){
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

                        if(this.throwList){
                            this.throwList.hideCards();
                        }
                    }

                    UpdataCurrentPutCard_daTongZi();
                    DealWaitPut_daTongZi(this, eD, 0);

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
                    setUserOffline_hengYang(this, 0);
                },
                playerStatusChange: function(eD) {
                    setUserOffline_hengYang(this, 0);
                },
                TZScore: function(msg){
                    InitUserCoinAndName_daTongZi(this, 0);

                    MjClient.playui.checkScoreState(this, 0);
                },
                TZTrust : function(){
                    MjClient.playui.showAndHideTrust(this, 0);
                    UpdataCurrentPutCard_daTongZi();
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
                trust : {
                    _run : function(){
                        this.visible = false;
                    },
                    _event:{
                        TZTrust : function(){
                            var pl = getUIPlayer_daTongZi(1);
                            if(pl){
                                this.visible = pl.isTrust;
                            }
                        },
                        initSceneData: function() {
                            var pl = getUIPlayer_daTongZi(1);
                            if(pl){
                                this.visible = pl.isTrust;
                            }
                        },
                        mjhand: function(){
                            var pl = getUIPlayer_daTongZi(1);
                            if(pl){
                                this.visible = pl.isTrust;
                            }
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
                    showPlayerInfo_daTongZi(1, btn);
                },
                _event: {
                    loadWxHead: function(d) {
                        // setWxHead(this, d, 1);
                    },
                    addPlayer: function() {
                        showFangzhuTagIcon_daTongZi(this, 1);
                    },
                    removePlayer: function() {
                        showFangzhuTagIcon_daTongZi(this, 1);
                    },
                    initSceneData : function(){
                        showFangzhuTagIcon_daTongZi(this,1);
                    },
                    mjhand : function(){
                        showFangzhuTagIcon_daTongZi(this,1);
                    }
                },
                _run: function () {
                    // this.zIndex = 600;
                    showFangzhuTagIcon(this,1);
                },
                score_bg:{_visible:false},
                name_bg:{_visible:false},
                tingCard:{
                    _visible:false,
                    _event:{
                        initSceneData: function(eD)
                        {
                            var pl = getUIPlayer_daTongZi(1);
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
                        clearRankIcon_daTongZi : function(){
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
                    },
                    initSceneData: function() {
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
                            DealPKPass_daTongZi(UIoff);
                            var url = "datongzi/nv/pass";
                            var pl = MjClient.data.sData.players[eD.uid];
                            playEffect(url, false, pl.info.sex);
                        }
                    }
                },
                _visible: false
            },
            trustTime : {
                _run:function()
                {
                    setWgtLayout(this, [0, 43/720], [0.8, 0.63], [0, 0]);
                    this.ignoreContentAdaptWithSize(true);
                    this.setString("");
                },
                _event : {
                    initSceneData : function(){
                        MjClient.playui.showCountdown(this, 1);
                    },
                    PKPut: function(){
                        MjClient.playui.showCountdown(this, 1);
                    },
                    waitPut: function(){
                        MjClient.playui.showCountdown(this, 1);
                    },
                    mjhand: function(){
                        MjClient.playui.showCountdown(this, 1);
                    },
                    TZTrust : function(d){
                        MjClient.playui.showCountdown(this, 1);
                    }
                }
            },
            _event: {
                clearCardUI: function() {
                    clearCardUI_daTongZi(this, 1);
                },
                initSceneData: function(eD) {
                    SetUserVisible_daTongZi(this, 1);
                    // MjClient.playui.checkScoreState(this, 1);
                },
                addPlayer: function(eD) {
                    SetUserVisible_daTongZi(this, 1);
                },
                removePlayer: function(eD) {
                    SetUserVisible_daTongZi(this, 1);
                },
                TZJoinTeam: function() {
                    updateHeadInfo_daTongZi(this, 1);
                    updateZuInfo_daTongZi(this, 1);

                },
                mjhand: function(eD) {
                    InitUserHandUI_daTongZi(this, 1);

                    SetUserVisible_daTongZi(this, 1);
                },
                roundEnd: function() {
                    InitUserCoinAndName_daTongZi(this, 1);
                    // this.cardList.removeFromParent();
                    // this.cardList = null;
                },
                waitPut: function(eD) {
                    DealWaitPut_daTongZi(this, eD, 1);
                    if(this.throwList && !MjClient.data.sData.tData.lastPutCard){
                        this.throwList.hideCards();
                    }
                },
                PKPut: function(eD) {
                    if(this.throwList){
                        this.throwList.hideCards();
                    }
                    DealMJPut_daTongZi(this, eD, 1);
                    if(eD.uid != SelfUid())
                    {

                    }
                },
                onlinePlayer: function(eD) {
                    setUserOffline_hengYang(this, 1);
                },
                playerStatusChange: function(eD) {
                    setUserOffline_hengYang(this, 1);
                },
                TZScore: function(msg){
                    InitUserCoinAndName_daTongZi(this, 1);

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
                trust : {
                    _run : function(){
                        this.visible = false;
                    },
                    _event:{
                        TZTrust : function(){
                            if(MjClient.data.sData.tData.maxPlayer < 3){
                                return;
                            }
                            var pl = getUIPlayer_daTongZi(2);
                            if(pl){
                                this.visible = pl.isTrust;
                            }
                        },
                        initSceneData: function() {
                            var pl = getUIPlayer_daTongZi(2);
                            if(pl){
                                this.visible = pl.isTrust;
                            }
                        },
                        mjhand: function(){
                            var pl = getUIPlayer_daTongZi(2);
                            if(pl){
                                this.visible = pl.isTrust;
                            }
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
                    showPlayerInfo_daTongZi(2, btn);
                },
                _event: {
                    loadWxHead: function(d) {
                        // setWxHead(this, d, 2);
                    },
                    addPlayer: function() {
                        showFangzhuTagIcon_daTongZi(this, 2);
                    },
                    removePlayer: function() {
                        showFangzhuTagIcon_daTongZi(this, 2);
                    },
                    initSceneData : function(){
                        showFangzhuTagIcon_daTongZi(this,2);
                    },
                    mjhand : function(){
                        showFangzhuTagIcon_daTongZi(this,2);
                    }
                },
                _run: function () {
                    // this.zIndex = 600;
                    showFangzhuTagIcon(this,2);
                },
                score_bg:{_visible:false},
                name_bg:{_visible:false},
                tingCard:{
                    _visible:false,
                    _event:{
                        initSceneData: function(eD)
                        {
                            var pl = getUIPlayer_daTongZi(2);
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
                        clearRankIcon_daTongZi : function(){
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
                    },
                    initSceneData: function() {
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
                            DealPKPass_daTongZi(UIoff);
                            var url = "datongzi/nv/pass";
                            var pl = MjClient.data.sData.players[eD.uid];
                            playEffect(url, false, pl.info.sex);
                        }
                    }
                },
                _visible: false
            },
            trustTime : {
                _run:function()
                {
                    setWgtLayout(this, [0, 43/720], [0.5, 0.75], [0, 0]);
                    if(MjClient.MaxPlayerNum == 3){
                        setWgtLayout(this, [0, 43/720], [0.20, 0.63], [0, 0]);
                    }
                    this.ignoreContentAdaptWithSize(true);
                    this.setString("");
                },
                _event : {
                    initSceneData : function(){
                        MjClient.playui.showCountdown(this, 2);
                    },
                    PKPut: function(){
                        MjClient.playui.showCountdown(this, 2);
                    },
                    waitPut: function(){
                        MjClient.playui.showCountdown(this, 2);
                    },
                    mjhand: function(){
                        MjClient.playui.showCountdown(this, 2);
                    },
                    TZTrust : function(){
                        MjClient.playui.showCountdown(this, 2);
                    }
                }
            },
            _event: {
                clearCardUI: function() {
                    clearCardUI_daTongZi(this, 2);
                },
                initSceneData: function(eD) {
                    SetUserVisible_daTongZi(this, 2);
                },
                addPlayer: function(eD) {
                    SetUserVisible_daTongZi(this, 2);
                },
                removePlayer: function(eD) {
                    SetUserVisible_daTongZi(this, 2);
                },
                TZJoinTeam: function() {
                    updateHeadInfo_daTongZi(this, 2);
                    updateZuInfo_daTongZi(this, 2);

                },
                mjhand: function(eD) {
                    InitUserHandUI_daTongZi(this, 2);

                    SetUserVisible_daTongZi(this, 2);
                },
                roundEnd: function() {
                    InitUserCoinAndName_daTongZi(this, 2);
                    // this.cardList.removeFromParent();
                    // this.cardList = null;
                },
                waitPut: function(eD) {
                    DealWaitPut_daTongZi(this, eD, 2);
                    if(this.throwList && !MjClient.data.sData.tData.lastPutCard){
                        this.throwList.hideCards();
                    }
                },
                PKPut: function(eD) {
                    if(this.throwList){
                        this.throwList.hideCards();
                    }
                    DealMJPut_daTongZi(this, eD, 2);
                },
                onlinePlayer: function(eD) {
                    setUserOffline_hengYang(this, 2);
                },
                playerStatusChange: function(eD) {
                    setUserOffline_hengYang(this, 2);
                },
                MJFlower: function(eD) {
                    HandleMJFlower(this, eD, 2);
                },
                MJTing: function (eD) {
                    HandleMJTing(this, eD, 2);
                },
                TZScore: function(msg){
                    InitUserCoinAndName_daTongZi(this, 2);

                    if(MjClient.data.sData.tData.maxPlayer == 3){
                        MjClient.playui.checkScoreState(this, 2);
                    }
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
                trust : {
                    _run : function(){
                        this.visible = false;
                    },
                    _event:{
                        TZTrust : function(){
                            if(MjClient.data.sData.tData.maxPlayer < 4){
                                return;
                            }
                            var pl = getUIPlayer_daTongZi(3);
                            if(pl){
                                this.visible = pl.isTrust;
                            }
                        },
                        initSceneData: function() {
                            var pl = getUIPlayer_daTongZi(3);
                            if(pl){
                                this.visible = pl.isTrust;
                            }
                        },
                        mjhand: function(){
                            var pl = getUIPlayer_daTongZi(3);
                            if(pl){
                                this.visible = pl.isTrust;
                            }
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
                    showPlayerInfo_daTongZi(3, btn);
                },
                _event: {
                    loadWxHead: function(d) {
                        // setWxHead(this, d, 3);
                    },
                    addPlayer: function() {
                        showFangzhuTagIcon_daTongZi(this, 3);
                    },
                    removePlayer: function() {
                        showFangzhuTagIcon_daTongZi(this, 3);
                    },
                    initSceneData : function(){
                        showFangzhuTagIcon_daTongZi(this,3);
                    },
                    mjhand : function(){
                        showFangzhuTagIcon_daTongZi(this,3);
                    }
                },
                _run: function () {
                    // this.zIndex = 600;
                    showFangzhuTagIcon(this,3);
                },
                score_bg:{_visible:false},
                name_bg:{_visible:false},
                tingCard:{
                    _visible:false,
                    _event:{
                        initSceneData: function(eD)
                        {
                            var pl = getUIPlayer_daTongZi(3);
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
                        clearRankIcon_daTongZi : function(){
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
                    },
                    initSceneData: function() {
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
                            DealPKPass_daTongZi(UIoff);
                            var url = "datongzi/nv/pass";
                            var pl = MjClient.data.sData.players[eD.uid];
                            playEffect(url, false, pl.info.sex);
                        }
                    }
                },
                _visible: false
            },
            trustTime : {
                _run:function()
                {
                    setWgtLayout(this, [0, 43/720], [0.20, 0.63], [0, 0]);
                    this.ignoreContentAdaptWithSize(true);
                    this.setString("");
                },
                _event : {
                    initSceneData : function(){
                        MjClient.playui.showCountdown(this, 3);
                    },
                    PKPut: function(){
                        MjClient.playui.showCountdown(this, 3);
                    },
                    waitPut: function(){
                        MjClient.playui.showCountdown(this, 3);
                    },
                    mjhand: function(){
                        MjClient.playui.showCountdown(this, 3);
                    },
                    TZTrust : function(){
                        MjClient.playui.showCountdown(this, 3);
                    }
                }
            },
            _event: {
                clearCardUI: function() {
                    clearCardUI_daTongZi(this, 3);
                },
                initSceneData: function(eD) {
                    SetUserVisible_daTongZi(this, 3);
                    // MjClient.playui.checkScoreState(this, 3);
                },
                addPlayer: function(eD) {
                    SetUserVisible_daTongZi(this, 3);
                },
                removePlayer: function(eD) {
                    SetUserVisible_daTongZi(this, 3);
                },
                TZJoinTeam: function() {
                    updateHeadInfo_daTongZi(this, 3);
                    updateZuInfo_daTongZi(this, 3);
                },
                mjhand: function(eD) {
                    InitUserHandUI_daTongZi(this, 3);

                    SetUserVisible_daTongZi(this, 3);
                },
                roundEnd: function() {
                    InitUserCoinAndName_daTongZi(this, 3);
                    // this.cardList.removeFromParent();
                    // this.cardList = null;
                },
                waitPut: function(eD) {
                    DealWaitPut_daTongZi(this, eD, 3);
                    if(this.throwList && !MjClient.data.sData.tData.lastPutCard){
                        this.throwList.hideCards();
                    }
                },
                PKPut: function(eD) {
                    if(this.throwList){
                        this.throwList.hideCards();
                    }
                    DealMJPut_daTongZi(this, eD, 3);
                },
                onlinePlayer: function(eD) {
                    setUserOffline_hengYang(this, 3);
                },
                playerStatusChange: function(eD) {
                    setUserOffline_hengYang(this, 3);
                },
                MJFlower: function(eD) {
                    HandleMJFlower(this, eD, 3);
                },
                MJTing: function (eD) {
                    HandleMJTing(this, eD, 3);
                },
                TZScore: function(msg){
                    InitUserCoinAndName_daTongZi(this, 3);

                    if(MjClient.data.sData.tData.maxPlayer == 4){
                        MjClient.playui.checkScoreState(this, 3);
                    }
                    
                }
            }
        },
        chat_btn: {
            _layout: [
                [68/1280, 0],
                [0.9649, 0.3645],
                [0, 0]
            ],
            _run : function(){
                if(MjClient.rePlayVideo !== -1){
                    this.visible = false;
                }

                // 4人选择分组阶段
                var tData = MjClient.data.sData.tData;
                if ((tData.tState == TableState.waitJoin || tData.tState == TableState.waitReady) && tData.maxPlayer == 4) {
                    this.visible = false;
                }

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
                [68/1280, 0],
                [0.9649, 0.4617],
                [0, 0]
            ],
            _run: function() {
                initVoiceData();
                
                if(MjClient.isShenhe) this.visible=false;

                if(MjClient.rePlayVideo !== -1){
                    this.visible = false;
                }

                this.hasEvent = false;

                // 4人选择分组阶段
                var tData = MjClient.data.sData.tData;
                if ((tData.tState == TableState.waitJoin || tData.tState == TableState.waitReady) && tData.maxPlayer == 4) {
                    this.visible = false;
                }else{
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
                [0.9649, 0.9087],
                [0, 0]
            ],
            _run: function() {
                if(MjClient.rePlayVideo !== -1){
                    this.visible = false;
                }
            },
            _click: function() {
                var settringLayer = new SettingView();
                settringLayer.setName("PlayLayerClick");
                MjClient.Scene.addChild(settringLayer);
                MjClient.native.umengEvent4CountWithProperty("Fangjiannei_shezhi", {uid:SelfUid(),gameType:MjClient.gameType});
            }
        },
        gps_btn: {
            _layout: [
                [68 / 1280, 0],
                [0.04, 0.4617],
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

                if(isIPhoneX()){
                    setWgtLayout(this, [68/1280 * 0.88, 0], [0.08, 0.4417], [0, 0]);
                }
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
                [0.9649, 0.2668],
                [0, 0]
            ],
            _run : function(){
                if(MjClient.rePlayVideo !== -1){
                    this.visible = false;
                }
                this.visible = false;
            },
            _click: function() {
                if (!IsRoomCreator() &&
                    (MjClient.data.sData.tData.tState == TableState.waitJoin || MjClient.data.sData.tData.tState == TableState.waitReady))
                {
                    MjClient.showMsg("确定要退出房间吗？",
                        function() {
                            MjClient.leaveGame();
                            if (!MjClient.enterui && !getClubInfoInTable())
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
        fenZuNode:{
            _layout: [[100/1280, 0], [0.7503, 0.0278], [0, 0]],
            _run:function() {
                this.update = function() {
                    var isVisible = true;
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    if (tData.maxPlayer != 4) {
                        isVisible = false;
                    }

                    if (tData.tState != TableState.waitJoin && tData.tState != TableState.waitReady) {
                        isVisible = false;
                    }

                    if (!isVisible) {
                        this.visible = false;
                        return;
                    }

                    this.visible = true;
                    var joinTip = this.getChildByName("fenzuxuanze");
                    joinTip.visible = tData.inTeamUids.indexOf(SelfUid()) < 0;
                    for (var i = 0; i <= 3; i++) {
                        var head = this.getChildByName("head_" + i);
                        var zuImg = head.getChildByName("zu");
                        zuImg.visible = false;
                        if (tData.uids[i] == 0) {
                            var noBody = head.getChildByName("nobody");
                            var headSp = noBody.getChildByName("WxHead");
                            if(headSp){
                                headSp.removeFromParent(true);
                            }
                            head.getChildByName("name").setString("");
                            head.getChildByName("xuanze").getChildByName("msg").setString("");
                            continue;
                        }
                        var pl = sData.players[tData.uids[i]];
                        head.visible = true;
                        // cc.log("addWxHeadToEndUI_daTongZi:",loaderHeadImage_daTongZi);
                        loaderHeadImage_daTongZi(head.getChildByName("nobody"), pl);
                        head.getChildByName("name").setString(unescape(pl.info.nickname));
                        var idx = tData.inTeamUids.indexOf(pl.info.uid);
                        if (idx >= 0) {
                            zuImg.visible = true;
                            var src = idx % 2 == 0 ? "daTongZi/playing/a.png" : "daTongZi/playing/b.png";
                            zuImg.loadTexture(src);
                        }

                        var xuanZeMsg = head.getChildByName("xuanze").getChildByName("msg");
                        xuanZeMsg.setString(idx >= 0 ? "已选组" : "选组中");
                        xuanZeMsg.setColor(cc.color(185,36,36));
                        if (idx >= 0) {
                            xuanZeMsg.setColor(cc.color(255, 165, 0));
                        }
                    }
                }
            },
            _event: {
                initSceneData: function() {
                    this.update();
                },
                addPlayer: function() {
                    this.update();
                },
                removePlayer: function() {
                    this.update();
                },
                TZJoinTeam: function() {
                    this.update();
                },
                mjhand: function() {
                    this.update();
                }
            }
        },
        dipai:{
            _layout: [
                [97/1280, 0],
                [0.9594, 0.7951],
                [0, 0]
            ],
            _run:function(){
                // this.visible = false;
                var countTxt =  this.getChildByName("countTxt");
                countTxt.ignoreContentAdaptWithSize(true);
                countTxt.setString(MjClient.data.sData.tData.leftCardCount);
            }
        },
        jiFen4Ren : {
            _layout: [
                [377/1280, 0],
                [0.1508, 0.9236],
                [0, 0]
            ],
            _run:function(){
                this.visible = MjClient.MaxPlayerNum == 4;
                if(MjClient.rePlayVideo !== -1){
                    this.visible = false;
                }
            },
            fenzu : {
                _run:function(){
                    this.ignoreContentAdaptWithSize(true);
                }
            },
            lsjf : {
                _run:function(){
                    this.ignoreContentAdaptWithSize(true);
                }
            },
            bjdf : {
                _run:function(){
                    this.ignoreContentAdaptWithSize(true);
                }
            },
            dztf : {
                _run:function(){
                    this.ignoreContentAdaptWithSize(true);
                    if(MjClient.data.sData.tData.deckNum == 4){
                        this.setString("喜总分");
                    }else{
                        this.setString("地炸/筒分");
                    }
                }
            },

            bjdf_A : {
                _run : function(){
                    this._oldP = this.getPosition();
                }
            },
            bjdf_B : {
                _run : function(){
                    this._oldP = this.getPosition();
                }
            },
            _click : function(sender, et){
                var btn = sender.getChildByName("btn");
                cc.log("---", btn.doClick);
                if(btn && btn.doClick){
                    btn.doClick(btn, et);
                }
            },
            btn:{
                _run:function(){
                    this._isShow = true; //面板显示状态
                    this._isMove = false;

                    this.doClick = function(btn, et){
                        if(btn._isMove) return;
                        var pNode = btn.getParent();
                        var cb = cc.callFunc(function(){
                            btn._isMove = false;
                        }.bind(btn));
                        var ac = cc.moveBy(0.2,0,pNode.height * pNode.scale).easing(cc.easeBackOut());
                        if(!btn._isShow){
                            ac = cc.moveBy(0.2,0,pNode.height * pNode.scale * -1).easing(cc.easeBackOut());
                        }
                        pNode.runAction(cc.sequence(ac, cb));
                        btn._isShow = !btn._isShow;
                        
                        var imgSrc = btn._isShow ? "upScoreSp" : "down";
                        cc.log("daTongZi/playing" + imgSrc + ".png");
                        btn.loadTexture("daTongZi/playing/" + imgSrc + ".png");
                    }
                },
                _click : function(btn,et){
                    btn.doClick(btn, et);
                }
            },
            _event : {
                roudEnd: function(msg){
                    showJiFen4Ren_daTongZi(this,MjClient.data.sData);
                },
                TZScore: function(msg){
                    showJiFen4Ren_daTongZi(this,MjClient.data.sData);
                },
                initSceneData : function(){
                    showJiFen4Ren_daTongZi(this, MjClient.data.sData);
                },
                addPlayer : function(){
                    showJiFen4Ren_daTongZi(this, MjClient.data.sData);
                },
                removePlayer: function() {
                    showJiFen4Ren_daTongZi(this, MjClient.data.sData);
                },
                mjhand : function(){
                    showJiFen4Ren_daTongZi(this, MjClient.data.sData);
                },
                clearScoreDTZ : function(){
                    cc.log("hand ClearScoreDTZ");
                    showJiFen4Ren_daTongZi(this, MjClient.data.sData);
                }
            }
        },
        jiFen3Ren : {
            _layout: [
                [414/1280, 0],
                [0.1641, 0.8986],
                [0, 0]
            ],
            _run:function(){
                this.visible = MjClient.MaxPlayerNum <= 3;
                if(MjClient.rePlayVideo !== -1){
                    this.visible = false;
                }
            },
            fenzu : {
                _run:function(){
                    this.ignoreContentAdaptWithSize(true);
                }
            },
            lsjf : {
                _run:function(){
                    this.ignoreContentAdaptWithSize(true);
                }
            },
            bjdf : {
                _run:function(){
                    this.ignoreContentAdaptWithSize(true);
                }
            },
            dztf : {
                _run:function(){
                    this.ignoreContentAdaptWithSize(true);
                    if(MjClient.data.sData.tData.deckNum == 4){
                        this.setString("喜总分");
                    }else{
                        this.setString("地炸/筒分");
                    }
                }
            },
            bjdf_0 : {
                _run: function(){
                    this._oldP = this.getPosition();
                }
            },
            bjdf_1 : {
                _run: function(){
                    this._oldP = this.getPosition();
                }
            },
            bjdf_2 : {
                _run: function(){
                    this._oldP = this.getPosition();
                }
            },
            _click : function(sender, et){
                var btn = sender.getChildByName("btn");
                cc.log("---", btn.doClick);
                if(btn && btn.doClick){
                    btn.doClick(btn, et);
                }
            },
            btn:{
                _run:function(){
                    this._isShow = true; //面板显示状态
                    this._isMove = false;

                    this.doClick = function(btn, et){
                        if(btn._isMove) return;
                        var pNode = btn.getParent();
                        var cb = cc.callFunc(function(){
                            btn._isMove = false;
                        }.bind(btn));
                        var ac = cc.moveBy(0.2,0,pNode.height * pNode.scale).easing(cc.easeBackOut());
                        if(!btn._isShow){
                            ac = cc.moveBy(0.2,0,pNode.height * pNode.scale * -1).easing(cc.easeBackOut());
                        }
                        pNode.runAction(cc.sequence(ac, cb));
                        btn._isShow = !btn._isShow;
                        
                        var imgSrc = btn._isShow ? "upScoreSp" : "down";
                        btn.loadTexture("daTongZi/playing/" + imgSrc + ".png");
                    }
                },
                _click : function(btn,et){
                    btn.doClick(btn, et);
                }
            },
            _event : {
                roudEnd: function(msg){
                    console.log("rounEnd====:" + JSON.stringify(msg));
                    showJiFen3Ren_daTongZi(this,MjClient.data.sData);
                },
                TZScore: function(msg){
                    console.log("TZScore====:" + JSON.stringify(msg));
                    showJiFen3Ren_daTongZi(this,MjClient.data.sData);
                },
                initSceneData : function(){
                    console.log("initSceneData====:" + JSON.stringify(MjClient.data.sData));
                    showJiFen3Ren_daTongZi(this, MjClient.data.sData);
                },
                addPlayer : function(){
                    showJiFen3Ren_daTongZi(this, MjClient.data.sData);
                },
                removePlayer: function() {
                    showJiFen3Ren_daTongZi(this, MjClient.data.sData);
                },
                mjhand : function(){
                    showJiFen3Ren_daTongZi(this, MjClient.data.sData);
                },
                clearScoreDTZ : function(){
                    showJiFen3Ren_daTongZi(this, MjClient.data.sData);
                }
            }
        },
        paiMianFen : {
            _layout: [
                [254/1280, 0],
                [0.4261, 0.9236],
                [0, 0]
            ],
            _run:function(){
                this.visible = true;
                if(MjClient.rePlayVideo !== -1){
                    this.visible = false;
                }
            },
            pmf : {
                _run:function(){
                    this.ignoreContentAdaptWithSize(true);
                }
            },
            zf : {
                _run:function(){
                    this.ignoreContentAdaptWithSize(true);
                }
            },
            fen5 : {
                _run:function(){
                    this.ignoreContentAdaptWithSize(true);
                }
            },
            fen10 : {
                _run:function(){
                    this.ignoreContentAdaptWithSize(true);
                }
            },
            fenK : {
                _run:function(){
                    this.ignoreContentAdaptWithSize(true);
                }
            },
            _click : function(sender, et){
                var btn = sender.getChildByName("btn");
                cc.log("---", btn.doClick);
                if(btn && btn.doClick){
                    btn.doClick(btn, et);
                }
            },
            btn:{
                _run:function(){
                    this._isShow = true; //面板显示状态
                    this._isMove = false;

                    this.doClick = function(btn, et){
                        if(btn._isMove) return;
                        var pNode = btn.getParent();
                        var cb = cc.callFunc(function(){
                            btn._isMove = false;
                        }.bind(btn));
                        var ac = cc.moveBy(0.2,0,pNode.height * pNode.scale).easing(cc.easeBackOut());
                        if(!btn._isShow){
                            ac = cc.moveBy(0.2,0,pNode.height * pNode.scale * -1).easing(cc.easeBackOut());
                        }
                        pNode.runAction(cc.sequence(ac, cb));
                        btn._isShow = !btn._isShow;
                        
                        var imgSrc = btn._isShow ? "upScoreSp" : "down";
                        cc.log("daTongZi/playing" + imgSrc + ".png");
                        btn.loadTexture("daTongZi/playing/" + imgSrc + ".png");
                    }
                },
                _click : function(btn,et){
                    btn.doClick(btn, et);
                }
            },
            _event : {
                PKPut: function(msg) {
                    showPaiMianFen_daTongZi(this, MjClient.data.sData.tData);
                },
                TZScore: function(msg){
                    showPaiMianFen_daTongZi(this,{});   //清空牌面分
                },
                initSceneData : function(){
                    showPaiMianFen_daTongZi(this,MjClient.data.sData.tData);
                }
            }
        },
        BtnAddA : {
            _layout: [[154/1280, 0], [0.4971, 0.8026], [0, 0]],
            _run: function() {
                this.tag = 2;
            },
            _click: function(sender) {
                MjClient.gamenet.request("pkroom.handler.tableMsg", {cmd: "TZJoinTeam", pos: sender.tag});
            },
            _event: {
                initSceneData: function() {
                    setBtnJoinTeamVisible_daTongZi(this);
                },
                addPlayer: function() {
                    setBtnJoinTeamVisible_daTongZi(this);
                },
                removePlayer: function() {
                    setBtnJoinTeamVisible_daTongZi(this);
                },
                TZJoinTeam: function() {
                    setBtnJoinTeamVisible_daTongZi(this);
                },
                mjhand: function() {
                    setBtnJoinTeamVisible_daTongZi(this);
                }
            }
        },
        BtnAddB_right : {
            _layout: [[154/1280, 0], [0.8048, 0.6889], [0, 0]],
            _run: function() {
                this.tag = 1;
            },
            _click: function(sender) {
                MjClient.gamenet.request("pkroom.handler.tableMsg", {cmd: "TZJoinTeam", pos: sender.tag});
            },
            _event: {
                initSceneData: function() {
                    setBtnJoinTeamVisible_daTongZi(this);
                },
                addPlayer: function() {
                    setBtnJoinTeamVisible_daTongZi(this);
                },
                removePlayer: function() {
                    setBtnJoinTeamVisible_daTongZi(this);
                },
                TZJoinTeam: function() {
                    setBtnJoinTeamVisible_daTongZi(this);
                },
                mjhand: function() {
                    setBtnJoinTeamVisible_daTongZi(this);
                }
            }
        },
        BtnAddB_left : {
            _layout: [[154/1280, 0],[0.1976, 0.6889],[0, 0]],
            _run: function() {
                this.tag = 3;
            },
            _click: function(sender) {
                MjClient.gamenet.request("pkroom.handler.tableMsg", {cmd: "TZJoinTeam", pos: sender.tag});
            },
            _event: {
                initSceneData: function() {
                    setBtnJoinTeamVisible_daTongZi(this);
                },
                addPlayer: function() {
                    setBtnJoinTeamVisible_daTongZi(this);
                },
                removePlayer: function() {
                    setBtnJoinTeamVisible_daTongZi(this);
                },
                TZJoinTeam: function() {
                    setBtnJoinTeamVisible_daTongZi(this);
                },
                mjhand: function() {
                    setBtnJoinTeamVisible_daTongZi(this);
                }
            }
        },
    },
    _downNode:null,
    _rightNode:null,
    _topNode:null,
    _leftNode:null,
    _btn_rank:null,
    ctor: function() {
        this._super();
        cc.spriteFrameCache.addSpriteFrames("daTongZi/cards.plist");

        var playui = ccs.load("Play_DaTongZi.json");

        this.srcMaxPlayerNum = MjClient.MaxPlayerNum;
        MjClient.MaxPlayerNum = parseInt(MjClient.data.sData.tData.maxPlayer);

        playMusic("bgFight_daTongZi");

        this._paiMianFen = playui.node.getChildByName("paiMianFen");

        this._downNode  = playui.node.getChildByName("down");
        this._rightNode = playui.node.getChildByName("right");
        this._topNode   = playui.node.getChildByName("top");
        this._leftNode  = playui.node.getChildByName("left");
        this._tingCardsNode = this._downNode.getChildByName("tingCardsNode");
        this._tingCardNumNode = this._downNode.getChildByName("tingCardNumNode");

        this._positionCard = playui.node.getChildByName("positionCard");
        this._noPutTips    = playui.node.getChildByName("noPutTips");
        this._btn_rank     = playui.node.getChildByName("btn_rank");
        MjClient.playui = this;
        MjClient.playui._AniNode =  playui.node.getChildByName("eat");
        this.sortType     = MjClient.sortType.normal;
        this.nextSortType = MjClient.sortType.count;

        this.pmfBtn = playui.node.getChildByName("paiMianFen").getChildByName("btn");
        this.pmfBtn.addTouchEventListener(function(type){
            if(type == 2){

            }
        },this.pmfBtn);


        MjClient.sortClassType = 0;//util.localStorageEncrypt.getNumberItem(MjClient.sortClassKey,MjClient.sortClassType);
        MjClient.playui.sortType = MjClient.sortType.normal;

        if(MjClient.rePlayVideo != -1)// 表示回放
        {
            MjClient.sortClassType = 0;
            MjClient.playui.sortType = MjClient.sortType.normal;
        }



        BindUiAndLogic(playui.node, this.jsBind);
        this.addChild(playui.node);

        //this._back  = playui.node.getChildByName("back");
// 
        //触摸事件监听注册
        // cc.eventManager.addListener(cc.EventListener.create(getTouchListener_card()),this._rightNode);

        // //添加滚动通知 by sking
        // var _laba_bg =  playui.node.getChildByName("banner").getChildByName("laba_bg");
        // _laba_bg.visible = false;
        // var _scroll =  playui.node.getChildByName("banner").getChildByName("scroll");
        // _scroll.visible = false;

        MjClient.playui._jiazhuWait = playui.node.getChildByName("jiazhuWait");

        MjClient.lastMJTick = Date.now();
        this.runAction(cc.repeatForever(cc.sequence(cc.callFunc(function() {
            if (MjClient.game_on_show) MjClient.tickGame(0);
        }), cc.delayTime(7))));

        // 在亲友圈房间中添加邀请亲友圈牌有一起对局
        addClubYaoqingBtn(2);

        // 俱乐部返回大厅功能：by_jcw
        if (MjClient.MaxPlayerNum == 4) {
            addClub_BackHallBtn(true, [[68/1280, 0], [0.9649, 0.3736], [0, 0]], [[68/1280, 0], [0.9649, 0.3436], [0, 0]]);
        }
        else {
            addClub_BackHallBtn(true, [[68/1280, 0], [0.9649, 0.06], [0, 0]], [[68/1280, 0], [0.9649, 0.05], [0, 0]]);
        }

        this.shuffleList = [];  //洗牌玩家

        return true;
    },
    onEnterTransitionDidFinish : function()
    {
        //this.setTouchEnabled(true);
        //cc.log("-----------init touch ---- ")
        this._super();
    },

    onEnter : function(){
        this._super();
        cc.log("onEnter...");

        // var cardList = new daTongZi.CardListLayer();
        // this._downNode.addChild(cardList);
        // setWgtLayout(cardList, [1, 0], [0, 0], [0, 0]);
        // this._downNode.cardList = cardList;

        // var throwList = new daTongZi.CardThrowListLayer();
        // this._downNode.addChild(throwList);
        // this._downNode.throwList = throwList;
        // setWgtLayout(throwList, [0.4, 0], [0.45, 0.4], [0, 0]);
    },

    onExit:function()
    {
        this._super();
        MjClient.MaxPlayerNum = this.srcMaxPlayerNum;
    },

});

PlayLayer_DaTongZi.prototype.cannotOutCardGrey = function()
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

PlayLayer_DaTongZi.prototype.recoverCannotOutCard = function()
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

PlayLayer_DaTongZi.prototype.clockNumberUpdate = function(node, endFunc)
{
    //取消闹钟声音
    // return arrowbkNumberUpdate(node, endFunc);
}

PlayLayer_DaTongZi.prototype.updateClockPosition = function(arrowNode)
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

PlayLayer_DaTongZi.prototype.showAndHideHeadEffect = function(){
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
    if (curPlayerNode != null && MjClient.data.sData.tData.tState == TableState.waitPut)
    {   
        cc.spriteFrameCache.addSpriteFrames("daTongZi/effect/head/head.plist");

        var sp = curPlayerNode.getChildByTag(tag);
        if(sp && cc.sys.isObjectValid(sp)){
            sp.stopAllActions();
            sp.removeFromParent(true);
            sp = null;
        }

        var sp = new cc.Sprite("#0.png");
        sp.setAnchorPoint(0.5,0.5);
        sp.scale = 0.9;
        sp.x = curPlayerNode.width * 0.5;
        sp.y = curPlayerNode.height * 0.5 + 0.5;
        // setWgtLayout(sp, [164/1280, 0], [0.5, 0.5], [0,0],false, true);
        sp.setTag(tag);
        curPlayerNode.addChild(sp);

        var ac = getAnimate("",29,0.06);
        sp.runAction(cc.RepeatForever(ac));
    }
}

/**
 * 拼接游戏玩法及付费信息
 * @function
 * @return {String}
 */
PlayLayer_DaTongZi.prototype.getGameInfoString = function(param)
{
    var tData = MjClient.data.sData.tData;
    var str = "";

    if (param != "roundInfo"){
        str += ["","","二","三","四"][MjClient.MaxPlayerNum] + "人玩,";
    }
    if(tData.areaSelectMode.isSiXi){
        str += "天天四喜,";
    }else{
        str += tData.deckNum + "副牌,";
    }
    if(tData.areaSelectMode.scoreLine == 1) {
        str += tData.areaSelectMode.scoreLine + "局结算,";
    }else {
        str += tData.areaSelectMode.scoreLine + "分结算,";
    }
    
    str += tData.areaSelectMode.hasWings ? "可带牌," : "";
    str += "终局奖励" + tData.areaSelectMode.lastRoundScore + "分,";
    if (tData.areaSelectMode.jieSuanDiFen){
        str += "积分底分" + tData.areaSelectMode.jieSuanDiFen;
    }
    // if (param != "roundInfo")
    // {
    //     switch (tData.areaSelectMode.payWay)
    //     {
    //         case 0:
    //             str += "房主付";
    //             break;
    //         case 1:
    //             str += "AA付";
    //             break;
    //         case 2:
    //             str += "亲友圈付";
    //             break;
    //     }
    // }

    if (str.charAt(str.length - 1) == ",")
        str = str.substring(0, str.length - 1);
    return str;
};

PlayLayer_DaTongZi.prototype.shwoFlyCardAnim = function(flyNode)
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

PlayLayer_DaTongZi.prototype.showHandCardBeiMian = function()
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

PlayLayer_DaTongZi.prototype.hideHandCardBeiMian = function()
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

PlayLayer_DaTongZi.prototype.checkRankState = function(node, uiOff, isRoundEnd){

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
                var src = "daTongZi/playing/rank"+ (i+1) + ".png";
                if(pl.handCount > 0){
                    src = "daTongZi/playing/rank4.png"
                }
                node.ignoreContentAdaptWithSize(true);
                node.loadTexture(src);
                node.visible = true;
                break;
            }
        }
    }
}

PlayLayer_DaTongZi.prototype.checkScoreState = function(node, uiOff){
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

            var gold = new daTongZi.Gold();
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
            playEffect("datongzi/effect/jetton", false);
        }, 100);
    }
}

PlayLayer_DaTongZi.prototype.showAndHideTrust = function(node, uiOff){
    var tData = MjClient.data.sData.tData;
    var pl = getUIPlayer_daTongZi(uiOff);
    var head = node.getChildByName("head");
    var trust = head.getChildByName("trust");
    if(pl && pl.isTrust){
        trust.visible = true;
        if(uiOff == 0){
            var cardList = node.cardList;
            if(cardList){
                if(pl.handCount <= 0){
                    cardList.setTrust(false);
                }else{
                    cardList.setTrust(true);
                }
            }
        }
    }else{
        trust.visible = false;
        if(uiOff == 0){
            var cardList = node.cardList;
            if(cardList){
                cardList.setTrust(false);
            }
        }
    }


}

PlayLayer_DaTongZi.prototype.showCountdown = function(node, uiOff){
    var pl = getUIPlayer_daTongZi(uiOff);
    if(pl && MjClient.rePlayVideo == -1){
        var time = util.Timer.getCountdownByTime(pl.trustTime);
        if(time > 0){
            node.schedule(function(){
                var time = util.Timer.getCountdownByTime(pl.trustTime);
                this.setString("" + time);
                if(time <= 0){
                    this.setString("");
                    this.unscheduleAllCallbacks();
                }
            },1);
        }else{
            node.setString("");
            node.unscheduleAllCallbacks();
        }
    }
}

PlayLayer_DaTongZi.prototype.removeShuffleNode = function() {
    this.shuffleNode.removeFromParent(true);
    this.shuffleNode = null;
};

PlayLayer_DaTongZi.prototype.playShuffleEffect = function() {
    if(this.isPlayShuffle || this.shuffleList.length <= 0) {
        return;
    }

    this.isPlayShuffle = true;
    if(!this.shuffleNode) {
        this.shuffleNode = new ShuffleEffectLayer_Poker();
        this.jsBind._node.addChild(this.shuffleNode, 499);
    }

    this.shuffleNode.visible = true;
    var uid = this.shuffleList[0];
    this.shuffleList.splice(0, 1);
    this.shuffleNode.playEffect(uid);

    this.scheduleOnce(function(){
        this.isPlayShuffle = false;

        if (this.shuffleNode)
            this.shuffleNode.visible = false;
        
        this.playShuffleEffect();
    }, 1.6);
};
