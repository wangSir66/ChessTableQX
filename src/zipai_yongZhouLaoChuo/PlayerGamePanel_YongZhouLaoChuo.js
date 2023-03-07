var actionZindex = 1000;
function getUIPlayer_YongZhouLaoChuo(off) {
    var sData = MjClient.data.sData;
    var tData = sData.tData;

    var uids = tData.uids;
    var index = getPlayerIndex(off);
    if(index < uids.length)
    {
        return sData.players[uids[index]];
    }

    return null;
}

function setHeadImg_YongZhouLaoChuo(node, off) {
    var pl = getUIPlayer_YongZhouLaoChuo(off);
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
function SetUserVisible_YongZhouLaoChuo(node, off) {
    var pl = getUIPlayer_YongZhouLaoChuo(off);
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
    // var zu = head.getChildByName("zu");
    // if (tData.maxPlayer != 4 || !tData.areaSelectMode.isDivideTeam) {
    //     zu.visible = false;
    // } else {
    //     zu.visible = true;
    //     var src = "";
    //     if ((tData.tState == TableState.waitJoin || tData.tState == TableState.waitReady)) {
    //         src = off % 2 == 0 ? "daTongZi/playing/a.png" : "daTongZi/playing/b.png";
    //     } else {

    //         cc.log("#####pl:" + JSON.stringify(pl));
    //         src = pl.teamid == "A" ? "daTongZi/playing/a.png" : "daTongZi/playing/b.png";
    //     }
    //     cc.log(off);
    //     cc.log(src);
    //     zu.loadTexture(src);
    // }

    //随机分组时 分组阶段不显示头像
    // if(tData.areaSelectMode.isDivideTeam && tData.areaSelectMode.isRandomTeam && 
    //     (tData.tState == TableState.waitJoin || tData.tState == TableState.waitReady)){
    //     head.visible = false;
    // }else{
    //     head.visible = true;
    // }

    if (pl) {
        name.visible = true;
        coin.visible = true;
        offline.visible = true;
        coin.visible = true;
        head.visible = true;
        // name_bg.visible = true;
        // score_bg.visible = true;

        // MjClient.loadWxHead(pl.info.uid, pl.info.headimgurl);
        setHeadImg_YongZhouLaoChuo(node, off);
        setUserOffline_YongZhouLaoChuo(node, off);
        InitUserHandUI_YongZhouLaoChuo(node, off);
    } else {
        name.visible = false;
        coin.visible = false;
        offline.visible = false;
        coin.visible = false;
        head.visible = false; 
        var WxHead = nobody.getChildByName("WxHead");
        if (WxHead)
            WxHead.removeFromParent(true);
    }
}

// function updateZuInfo_YongZhouLaoChuo(node, off) {
//     // 分组信息
//     var sData = MjClient.data.sData;
//     var tData = sData.tData;
//     var head = node.getChildByName("head");
//     var zu = head.getChildByName("zu");
//     if (tData.maxPlayer != 4 || !tData.areaSelectMode.isDivideTeam) {
//         zu.visible = false;
//     } else {
//         zu.visible = true;
//         var src = "";
//         if ((tData.tState == TableState.waitJoin || tData.tState == TableState.waitReady)) {
//             src = off % 2 == 0 ? "daTongZi/playing/a.png" : "daTongZi/playing/b.png";
//         } else {
//             src = pl.teamid == "A" ? "daTongZi/playing/a.png" : "daTongZi/playing/b.png";
//         }
//         zu.loadTexture(src);
//     }
// }

// // 4人分组时候更新对应位置玩家信息
// function updateHeadInfo_YongZhouLaoChuo(node, off) {
//     var sData = MjClient.data.sData;
//     var tData = sData.tData;
//     // 4人选择分组阶段
//     if (!((tData.tState == TableState.waitJoin || tData.tState == TableState.waitReady) && (tData.maxPlayer == 4 && tData.areaSelectMode.isDivideTeam))) {
//         return;
//     }

//     var pl = getUIPlayer_YongZhouLaoChuo(off);
//     var head = node.getChildByName("head");
//     var name = head.getChildByName("name");
//     var nobody = head.getChildByName("nobody");
//     var coin = head.getChildByName("coin");
//     var offline = head.getChildByName("offline");
//     var name_bg = head.getChildByName("name_bg");
//     var score_bg = head.getChildByName("score_bg");
//     if (pl) {
//         name.visible = true;
//         coin.visible = true;
//         offline.visible = true;
//         coin.visible = true;

//         setHeadImg_YongZhouLaoChuo(node, off);
//         InitUserCoinAndName_YongZhouLaoChuo(node, off);
//     } else {
//         name.visible = false;
//         coin.visible = false;
//         offline.visible = false;
//         coin.visible = false;
//         var WxHead = nobody.getChildByName("WxHead");
//         if (WxHead)
//             WxHead.removeFromParent(true);
//     }
// }

function InitUserHandUI_YongZhouLaoChuo(node, off) {
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var pl = getUIPlayer_YongZhouLaoChuo(off);

    if (!pl) {
        return;
    }

    //初始化玩家金币和名称
    InitUserCoinAndName_YongZhouLaoChuo(node, off);
    setAreaTypeInfo(true);
    currentLeftCardCount_YongZhouLaoChuo(off);

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
            var arr = [];
            var copyArr = pl.mjhand.concat();
            cc.log("copyArr:", copyArr);
            copyArr = MjClient.majiang.sortCards(copyArr, MjClient.majiang.sortType).fir;
            cc.log("copyArr:", copyArr);

            for (var i = 0; i < copyArr.length; i++) {
                var info = new daTongZi.CardInfo();
                info.type = copyArr[i];
                arr.push(info);
            }

            initCardList_YongZhouLaoChuo();

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
            copyArr = MjClient.majiang.sortCards(copyArr, MjClient.majiang.sortType).fir;
            cc.log("copyArr:", copyArr);
            for (var i = 0; i < copyArr.length; i++) {
                var info = new daTongZi.CardInfo();
                info.type = copyArr[i];
                arr.push(info);
            }

            initCardList_YongZhouLaoChuo();

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

// function showPaiMianFen_YongZhouLaoChuo(node, data){
//     var zfTxt = node.getChildByName("zfTxt");
//     zfTxt.ignoreContentAdaptWithSize(true);
//     zfTxt.setString(data.score_draw !== undefined ? data.score_draw : "0");

//     var obj = data.stats_draw ? data.stats_draw : {"5":0, "10":0, "13":0};
//     var fen5Txt = node.getChildByName("fen5Txt");
//     fen5Txt.ignoreContentAdaptWithSize(true);
//     fen5Txt.setString(obj["5"]);

//     var fen10Txt = node.getChildByName("fen10Txt");
//     fen10Txt.ignoreContentAdaptWithSize(true);
//     fen10Txt.setString(obj["10"]);

//     var fenKTxt = node.getChildByName("fenKTxt");
//     fenKTxt.ignoreContentAdaptWithSize(true);
//     fenKTxt.setString(obj["13"]);
// }

// function showJiFen3Ren_YongZhouLaoChuo(node, sData, len){
//     if(MjClient.data.sData.tData.areaSelectMode.isDivideTeam || MjClient.data.sData.tData.areaSelectMode.isRandomTeam){
//         return;
//     }

//     len = len === undefined ? 3 : len;

//     var oldXiFenList = [];
//     for(var i = 0; i < len; i++){;
//         var name = node.getChildByName("name_" + i);
//         name.ignoreContentAdaptWithSize(true);
//         var lsjf = node.getChildByName("lsjf_" + i);
//         lsjf.ignoreContentAdaptWithSize(true);
//         var bjdf = node.getChildByName("bjdf_" + i);
//         bjdf.ignoreContentAdaptWithSize(true);
//         var zxf = node.getChildByName("zxf_" + i);
//         zxf.ignoreContentAdaptWithSize(true);

//         var num = parseInt(zxf.getString());
//         num = num ? num : 0;
//         oldXiFenList.push(num);
//         name.setString("");
//         lsjf.setString("");
//         bjdf.setString("");
//         zxf.setString("");
//         if(bjdf._oldP){
//             bjdf.setPosition(bjdf._oldP);
//             bjdf.setTextColor(cc.color(34,234,156));
//         }
//         if(zxf._oldP){
//             zxf.setPosition(zxf._oldP);
//             zxf.setTextColor(cc.color(34,234,156));
//         }
//     }

//     var plList = sData.players;
//     var i = 0;
//     for(var n in plList){
//         var pl = plList[n];
//         var name = node.getChildByName("name_" + i);
//         if(!name){
//             break;
//         }
//         name.ignoreContentAdaptWithSize(true);
//         var lsjf = node.getChildByName("lsjf_" + i);
//         lsjf.ignoreContentAdaptWithSize(true);
//         var bjdf = node.getChildByName("bjdf_" + i);
//         bjdf.ignoreContentAdaptWithSize(true);
//         var zxf = node.getChildByName("zxf_" + i);
//         zxf.ignoreContentAdaptWithSize(true);

//         cc.log("showJiFen3Ren_YongZhouLaoChuo:" + JSON.stringify(pl));
//         name.setString(getNewName_new(unescape(pl.info.nickname), 4));
//         name.setFontName("Arial");
//         name.setFontSize(name.getFontSize());
//         lsjf.setString(pl.winall);
//         bjdf.setString(pl.score_draw);
//         cc.log("bjdf:", pl.score_draw);
//         zxf.setString(pl.score_spclType);

//         //文本动画
//         if(pl.inc > 0){
//             playScoreEffect_YongZhouLaoChuo(bjdf);
//         }
//         if(pl.score_spclType > oldXiFenList[i]){
//             playScoreEffect_YongZhouLaoChuo(zxf);
//         }

//         if(bjdf._oldP){
//             bjdf.setPosition(bjdf._oldP);
//             bjdf.setTextColor(cc.color(34,234,156));
//         }
//         if(zxf._oldP){
//             zxf.setPosition(zxf._oldP);
//             zxf.setTextColor(cc.color(34,234,156));
//         }

//         i++
//     }
// }

// function showJiFen4Ren_YongZhouLaoChuo(node, sData){

//     var teams = sData.teams;

//     var oldXiFenList = {};
//     var obj = {"A":{}, "B":{}}
//     for(var tid in obj){
//         var lsjf = node.getChildByName("lsjf_" + tid);
//         lsjf.ignoreContentAdaptWithSize(true);
//         var bjdf = node.getChildByName("bjdf_" + tid);
//         bjdf.ignoreContentAdaptWithSize(true);
//         var zxf = node.getChildByName("zxf_" + tid);
//         zxf.ignoreContentAdaptWithSize(true);

//         var num = parseInt(zxf.getString());
//         num = num ? num : 0;
//         oldXiFenList[tid] = num;
//         lsjf.setString("0");
//         bjdf.setString("0");
//         zxf.setString("0");
//     }

//     for(var tid in teams){
//         var team = teams[tid];

//         var lsjf = node.getChildByName("lsjf_" + tid);
//         lsjf.ignoreContentAdaptWithSize(true);
//         var bjdf = node.getChildByName("bjdf_" + tid);
//         bjdf.ignoreContentAdaptWithSize(true);
//         var zxf = node.getChildByName("zxf_" + tid);

//         lsjf.setString(team.winall);
//         bjdf.setString(team.score_draw);
//         zxf.setString(team.score_spclType);

//         //文本动画
//         if(team.inc > 0){
//             playScoreEffect_YongZhouLaoChuo(bjdf);
//         }
//         if(team.score_spclType > oldXiFenList[tid]){
//             playScoreEffect_YongZhouLaoChuo(zxf);
//         }
//     }
// }

// function setBtnJoinTeamVisible_YongZhouLaoChuo(node) {
//     var isVisible = function() {
//         var tData = MjClient.data.sData.tData;
//         // console.log("tData.inTeamUids@@ " + tData.inTeamUids, " node.tag@@ ", node.tag);
//         var areaSelectMode = MjClient.data.sData.tData.areaSelectMode;
//         if (tData.maxPlayer != 4 || !areaSelectMode.isDivideTeam || (areaSelectMode.isDivideTeam && areaSelectMode.isRandomTeam)) {
//             return false;
//         }

//         if (tData.tState != TableState.waitJoin && tData.tState != TableState.waitReady) {
//             return false;
//         }

//         var idx = tData.inTeamUids.indexOf(SelfUid());
//         if (idx == 0) {
//             return false;
//         }

//         if (tData.inTeamUids[node.tag] != 0) {
//             return false;
//         }

//         return true;
//     }

//     var flag = isVisible();
//     node.setTouchEnabled(flag);
//     node.visible = flag;
// }

//小局结算后清空本地数据
function clearJiFen_YongZhouLaoChuo(){
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


var PlayLayer_YongZhouLaoChuo = cc.Layer.extend({
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

                // if (MjClient.getAppType() == MjClient.APP_TYPE.QXYZQP || MjClient.getAppType() == MjClient.APP_TYPE.BDYZPHZ || MjClient.getAppType() == MjClient.APP_TYPE.BDYZPHZ) {
                //     return;
                // }

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

                //clearJiFen_YongZhouLaoChuo();

            },
            // changePosition: function(msg) {
            //     /*
            //        换位置
            //   */
            //     var currentSelectCard = msg.selectedCard;
            //     var change_uids  = msg.uids;
            //     var sData = MjClient.data.sData;
            //     var tData = sData.tData;
            //     var current_uids = tData.uids;

            //     cc.log("changePosition change_uids = " + JSON.stringify(change_uids));
            //     cc.log("changePosition current_uids = " + JSON.stringify(current_uids));


            //     //初始化手牌张数
            //     if (msg.handCounts) {
            //         var sData = MjClient.data.sData;
            //         for (var uid in msg.handCounts) {
            //             var pl = sData.players[uid];
            //             pl.handCount = msg.handCounts[uid];
            //             //cc.log("初始化手牌张数 .handCount =" + pl.handCount);
            //         }
            //     }

            //     for(var i = 0;i < MjClient.MaxPlayerNum;i++)
            //     {
            //         currentLeftCardCount_YongZhouLaoChuo(i);
            //     }

            //     //回放的时候
            //     if(MjClient.rePlayVideo != -1)
            //     {
            //         tData.uids = msg.uids;//要更新uid位置
            //         resetPlayerHead_YongZhouLaoChuo();
            //         MjClient.playui._positionCard.visible = false;
            //     }
            //     else
            //     {
            //         //牌的翻的效果,正常打牌
            //         cardRollAction(currentSelectCard,function(){

            //             var _toNodePos = [];
            //             for(var i = 0;i < change_uids.length; i++)
            //             {
            //                 var _toNode   = getNode_cards(i).getChildByName("head");
            //                 _toNodePos.push(_toNode.getPosition());
            //             }

            //             for(var i = 0;i < change_uids.length; i++)
            //             {

            //                 var change_UIoff = card_getUiOffByUid(change_uids[i],change_uids);

            //                 var current_UIoff = card_getUiOffByUid(change_uids[i],current_uids);

            //                 if(change_UIoff != current_UIoff)
            //                 {
            //                     changePositionByUIoff(current_UIoff, _toNodePos[change_UIoff]);
            //                 }
            //             }
            //             tData.uids = msg.uids;//要更新uid位置
            //             MjClient.playui.runAction(cc.sequence(cc.delayTime(0.3), cc.callFunc(function () {
            //                 resetPlayerHead_YongZhouLaoChuo();
            //             })));
            //         });
            //     }
            // },
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
                if (msg.showEnd) this.addChild(new GameOverLayer_syZiPai(),500);
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
                        var layer = new GameOverLayer_syZiPai();
                        layer.setVisible(false);
                        self.addChild(layer);
                    }
                    postEvent("clearRankIcon_YongZhouLaoChuo", {}); //只为了清除排名标记
                    self.addChild(new EndOneView_YongZhouLaoChuo(), 500);
                }
                this.runAction(cc.sequence(cc.DelayTime(1),cc.callFunc(delayExe)));

                //clearJiFen_YongZhouLaoChuo();
                if(MjClient.CheckPlayerCount( function(p){ if(p.winone==0){return true;} return false;}) == MjClient.MaxPlayerNum &&
                    !MjClient.isDismiss ){
                    playCardAni_huangZhuang(0)
                }
                
                if(MjClient.playui._downNode.cardList){
                    MjClient.playui._downNode.cardList.showBtnNode(false);
                }
                MjClient.playui.showAndHideHeadEffect();
            },
            moveHead: function() {
                postEvent("returnPlayerLayer");
                tableStartHeadMoveAction_YongZhouLaoChuo(this);
            },
            initSceneData: function() {
                reConectHeadLayout_YongZhouLaoChuo(this);
                CheckRoomUiDelete();
                var sData = MjClient.data.sData;
                var tData = sData.tData;
                if(tData.tState == TableState.waitPut )
                {
                    UpdataCurrentPutCard_YongZhouLaoChuo();
                }

                for(var i = 0;i < MjClient.MaxPlayerNum;i++)
                {
                    currentLeftCardCount_YongZhouLaoChuo(i);
                }

                tableStartHeadMoveAction_paohuzi(this);   //不涉及到头像移动动作
                var data = [[0.25, 0.25], [0.5, 0.72], [0, 0]];
                checkCanShowDistance(data);

                // this.addChild(new GameOverLayer_YongZhouLaoChuo());

                MjClient.playui.showAndHideHeadEffect();

                //this.addChild(new EndOneView_YongZhouLaoChuo(), 500);
            },
            onlinePlayer: function(data) {
                if(!data.isTrust){
                    return;
                }
                
                reConectHeadLayout_YongZhouLaoChuo(this);
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
                    currentLeftCardCount_YongZhouLaoChuo(i);
                }
                MjClient.playui.showAndHideHeadEffect();
            },
            waitPut: function(){
                MjClient.playui.showAndHideHeadEffect();
            },
            // clearCardUI : function(){
            //     MjClient.playui.reSetRoundData();
            // }
        },
        back: {
            back: {
                _run: function() {
                    changeGameBg(this);
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
                [0.5, 0.65],
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
                    this.setString("第" + (tData.roundAll-tData.roundNum + 1) +/*"/"+tData.roundAll +*/ "局");
                    
                },
                _event:{
                    mjhand:function()
                    {
                        var tData = MjClient.data.sData.tData;
                        this.setString("第" + (tData.roundAll-tData.roundNum + 1) +/*"/"+tData.roundAll +*/ "局");
                    },
                    initSceneData:function()
                    {
                        var tData = MjClient.data.sData.tData;

                        this.setString("第" + (tData.roundAll-tData.roundNum + 1) +/*"/"+tData.roundAll +*/ "局");
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
                    [0.9649, 0.0590],
                    [0, 0]
                ],
                _run:function(){
                    if(MjClient.rePlayVideo !== -1){
                        this.visible = false;
                    }
                    // setWgtLayout(this, [0.12, 0.12],[0.13, 0.62],[0, 0]);

                    if(isIPhoneX()){
                        setWgtLayout(this, [68/1280 * 0.88, 0], [0.9649, 0.06], [0, 0]);
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
                [0.9649, 0.16],
                [0, 0]
            ],
            _run:function(){
                if(MjClient.rePlayVideo !== -1){
                    this.visible = false;
                }
                // setWgtLayout(this, [0.12, 0.12],[0.04, 0.62],[0, 0]);

                if(isIPhoneX()){
                    setWgtLayout(this, [68/1280 * 0.88, 0], [0.9649, 0.15], [0, 0]);
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
                    var str1 = "永州老戳,"
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
                // TZJoinTeam: function() {
                //     if (MjClient.data.sData.tData.inTeamUids.indexOf(0) < 0) {
                //         this.visible = true;
                //     }
                // }
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

        BtnHu: {
            _visible: false,
            _run: function() {
                setWgtLayout(this, [0.0898, 0.166666], [0.4, 0.5], [0, 0]);
            },
            _click: function(btn) {
                btn.setVisible(false);
                btn.getParent().getChildByName("BtnGuo").setVisible(false);
                
                MjClient.gamenet.request("pkroom.handler.tableMsg", {
                    cmd: "MJHu",
                    eatFlag: MjClient.playui.getSelfEatFlag()
                });
            },
            _event: {
                waitReady: function() {
                    this.visible = false;
                },
                mjhand: function() {
                    this.visible = false;
                },
                initSceneData: function() {
                    this.visible = false;
                    var tData = MjClient.data.sData.tData;
                    var pl = getUIPlayer_YongZhouLaoChuo(0);
                    this.visible = ((pl.eatFlag & 32) ? true :false) && (tData.tState != TableState.roundFinish);

                    cc.log("======89999BtnHu==========", pl.eatFlag, (pl.eatFlag & 32), tData.tState)
                },
                PKPass: function() {
                    this.visible = false;
                },
                HZUpdateEatFlag:function(eD){
                    var tData = MjClient.data.sData.tData;
                    var pl = MjClient.data.sData.players[SelfUid() + ""];

                    if (tData.tState == TableState.roundFinish) {
                        return [];
                    }

                    if(pl.eatFlag & 32) {
                        this.visible = true;
                    }
                },
                roundEnd : function(){
                    this.visible = false;
                },

            }
        },
        BtnGuo: {
            _visible: false,
            _run: function() {
                setWgtLayout(this, [0.0898, 0.166666], [0.6, 0.5], [0, 0]);
            },
            _click: function(btn) {
                btn.setVisible(false);
                btn.getParent().getChildByName("BtnHu").setVisible(false);
                var msg = {
                            cmd: "PKPass",
                            eatFlag: MjClient.playui.getSelfEatFlag()
                        };
                MjClient.gamenet.request("pkroom.handler.tableMsg", msg);
                cc.log("============xxxxxxxxxxxBtnGuo==")
            },
            _event: {
                waitReady: function() {
                    this.visible = false;
                },
                mjhand: function() {
                    this.visible = false;
                },
                initSceneData: function() {
                    this.visible = false;
                    var tData = MjClient.data.sData.tData;
                    var pl = getUIPlayer_YongZhouLaoChuo(0);;
                    this.visible = ((pl.eatFlag & 32 && pl.mjhand.length > 0) ? true :false) && (tData.tState != TableState.roundFinish);
                },
                PKPass: function() {
                    this.visible = false;
                },
                roundEnd : function(){
                    this.visible = false;
                },
                HZUpdateEatFlag: function(eD){
                    var tData = MjClient.data.sData.tData;
                    var pl = MjClient.data.sData.players[SelfUid() + ""];

                    if (tData.tState == TableState.roundFinish) {
                        return [];
                    }

                    if(pl.eatFlag & 32 && pl.mjhand.length > 0) {
                        this.visible = true;
                    }
                },
            }
        },
        Btn_ShowChuoZi: {
            _visible: false,
            _run: function() {
                setWgtLayout(this, [0.0664, 0.11666], [0.04, 0.428], [0, 0]);
            },
            _click: function(btn) {

                btn.getParent().getChildByName("block_ShowChuoZi").setVisible(true);
                postEvent("updataChuo",{});
            },
            _event: {
                mjhand: function() {
                    this.visible = true;
                },
                initSceneData: function() {
                    this.visible = (MjClient.data.sData.tData.tState == TableState.waitPut || 
                        MjClient.data.sData.tData.tState == TableState.waitEat) ;
                },
                clearCardUI: function(eD) {
                    this.visible = false;
                },
                roundEnd : function(){
                    this.visible = false;
                },
            }
        },
        block_ShowChuoZi : {
            _visible: false,
            _run: function() {
                setWgtLayout(this, [1, 1], [0.5, 0.5], [0, 0], true);
            },

            Image_bg: {
                _run: function() {
                    this.visible = true;
                },
                Image_0:{
                    _visible: true,
                    _run: function() {
                        
                    },
                    _event: {
                        updataChuo : function(eD){
                            MjClient.playui.setItemChuoZiInfo(this, 0)
                            //postEvent("HZUpdateData",{}); 
                        },
                        initSceneData: function() {
                            //MjClient.playui.addPlayerHeadItemInfo(this, 0)
                        },

                        roundEnd : function(){

                        },
                        HZUpdateData : function(){
                            cc.log("--------setItemChuoZiInfo--HZUpdateData-------")
                            MjClient.playui.setItemChuoZiInfo(this, 0)
                        },
                    },
                    head:{
                        _run:function(){
                            this.visible = false;
                        },

                    },
                    cards:{
                        _run:function(){
                            this.visible = false
                        },

                    }
                },
                Image_1:{
                    _visible: true,
                    _run: function() {
                    },
                    _event: {
                        updataChuo : function(eD){
                            MjClient.playui.setItemChuoZiInfo(this, 1)
                        },
                        initSceneData: function() {
                           //MjClient.playui.addPlayerHeadItemInfo(this, 1)
                        },

                        roundEnd : function(){
                        },
                        HZUpdateData : function(){
                            MjClient.playui.setItemChuoZiInfo(this, 1)
                        },
                    },

                    head:{

                    },
                    cards:{

                    }
                },
                Image_2:{
                    _visible: true,
                    _run: function() {
                    },
                    _event: {
                        updataChuo : function(eD){
                            MjClient.playui.setItemChuoZiInfo(this, 2)
                        },
                        initSceneData: function() {
                            //MjClient.playui.addPlayerHeadItemInfo(this, 2)
                        },

                        roundEnd : function(){
                        },
                        HZUpdateData : function(){
                            MjClient.playui.setItemChuoZiInfo(this, 2)
                        },
                    },

                    head:{
                        _run:function(){
                            this.visible = false;
                        },
                    },
                    cards:{
                        _run:function(){
                            this.visible = false;
                        },
                    }
                },
                Image_3:{
                    _visible: true,
                    _run: function() {

                    },
                    _event: {
                        updataChuo : function(eD){
                            MjClient.playui.setItemChuoZiInfo(this, 3)
                        },
                        initSceneData: function() {
                            //MjClient.playui.addPlayerHeadItemInfo(this, 3)
                        },

                        roundEnd : function(){
                        },
                        HZUpdateData : function(){
                            MjClient.playui.setItemChuoZiInfo(this, 3)
                        },
                    },

                    head:{
                        _run:function(){
                            this.visible = false;
                        },
                    },
                    cards:{
                        _run:function(){
                            this.visible = false;
                        },
                    }
                },
            },
            btn_close:{
                _click: function(btn) {
                    btn.getParent().setVisible(false);
                },
            },
            _event: {
                waitReady: function() {
                    this.visible = false;
                },
                mjhand: function() {
                    this.visible = false;
                },
                initSceneData: function() {
                    //this.visible = true;
                    // var tData = MjClient.data.sData.tData;
                    // var pl = getUIPlayer_YongZhouLaoChuo(0);;
                    // this.visible = (pl.eatFlag & 32 && pl.mjhand.length > 0) ? true :false;
                },

                roundEnd : function(){
                    this.visible = false;
                },
                HZUpdateData : function(eD) {
                    // if(this.throwList){
                    //     this.throwList.hideCards();
                    // }
                },
            }

        },
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
                roundEnd : function(){
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
                zu: {
                    _run : function(){
                        this.visible = false;
                    },
                    _event: {
                        initSceneData: function() {
                            MjClient.playui.checkZhuangVisible(this, 0);
                        },
                        mjhand: function() {
                            MjClient.playui.checkZhuangVisible(this, 0);
                        }
                    }
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
                _click: function(btn) { // todo
                    showPlayerInfo_YongZhouLaoChuo(0, btn);
                },
                _event: {
                    loadWxHead: function(d) {
                        // setWxHead(this, d, 0);
                    },
                    addPlayer: function() {
                        showFangzhuTagIcon_YongZhouLaoChuo(this,0);
                    },
                    removePlayer: function() {
                        showFangzhuTagIcon_YongZhouLaoChuo(this,0);
                    },
                    initSceneData : function(){
                        showFangzhuTagIcon_YongZhouLaoChuo(this,0);
                    },
                    mjhand : function(){
                        showFangzhuTagIcon_YongZhouLaoChuo(this,0);
                    }
                },
                _run: function () {
                    //this.zIndex = 600;
                    showFangzhuTagIcon_YongZhouLaoChuo(this,0);
                },
                score_bg:{_visible:false},
                name_bg:{_visible:false},
                liPai: {
                    _run : function(){
                        if(MjClient.rePlayVideo != -1){
                            this.visible = false;
                        }

                        if(isIPhoneX()){
                            this.y -= 20;
                        }
                    },
                    _click : function(btn){

                        if(MjClient.playui._downNode.cardList){
                            MjClient.playui._downNode.cardList.doLiPai();
                        }
                        //test
                        //2人解散
                        // var obj = {"players":{"1000140":{"mjdesc":[],"mjhand":[],"winone":25,"winall":25,"rankall":0,"info":{"uid":1000140,"appid":"shaoyang","unionid":"unionid-1000140","sex":2,"nickname":"%u6E38%u5BA2140","headimgurl":"http://cdn.jtcfgame.com/images/1.jpg","district":"¹ã¶«Ê¡ÉîÛÚÊÐ","mobileNum":null,"registerIp":"181.81.72.150","lastLoginTime":1529379587478,"lastShareDay":0,"createRoomNum":10,"createTime":1529371863553,"money":80,"integral":0,"myMemberId":null,"myMemberLevel":null,"memberId":null,"bindHistory":0,"sid":59,"fid":"pkcon001","remoteIP":"172.17.100.49","lockMoney":10,"did":"pkplayer000"},"roomStatistics":[0,0,0,0,0],"score_draw":25,"stats_draw":{"5":1,"10":1,"13":1},"score_rank":0,"score_lastRound":0,"score_spclType":0,"stats_spclType":[0,0,0,0,0,0,0,0,0],"windif":-70,"lastOffLineTime":null},"1000141":{"mjdesc":[],"mjhand":[415,412,114,313],"winone":5,"winall":5,"rankall":-40,"info":{"uid":1000141,"appid":"shaoyang","unionid":"unionid-1000141","sex":2,"nickname":"%u6E38%u5BA2141","headimgurl":"http://cdn.jtcfgame.com/images/2.jpg","district":"¹ã¶«Ê¡ÉîÛÚÊÐ","mobileNum":null,"registerIp":"163.38.189.133","lastLoginTime":1529379589255,"lastShareDay":0,"createRoomNum":10,"createTime":1529371863553,"money":100,"integral":0,"myMemberId":null,"myMemberLevel":null,"memberId":null,"bindHistory":0,"sid":60,"fid":"pkcon000","remoteIP":"172.17.100.49","lockMoney":0,"did":"pkplayer001"},"roomStatistics":[0,0,0,0,0],"score_draw":45,"stats_draw":{"5":1,"10":2,"13":2},"score_rank":-40,"score_lastRound":0,"score_spclType":0,"stats_spclType":[0,0,0,0,0,0,0,0,0],"windif":-130,"lastOffLineTime":null},"1000142":{"mjdesc":[],"mjhand":[],"winone":115,"winall":115,"rankall":40,"info":{"uid":1000142,"appid":"shaoyang","unionid":"unionid-1000142","sex":2,"nickname":"%u6E38%u5BA2142","headimgurl":"http://cdn.jtcfgame.com/images/9.jpg","district":"¹ã¶«Ê¡ÉîÛÚÊÐ","mobileNum":null,"registerIp":"240.143.181.247","lastLoginTime":null,"lastShareDay":0,"createRoomNum":10,"createTime":1529371863553,"money":100,"integral":0,"myMemberId":null,"myMemberLevel":null,"memberId":null,"bindHistory":0,"sid":60,"fid":"pkcon001","remoteIP":"172.17.100.49","lockMoney":0,"did":"pkplayer000"},"roomStatistics":[0,0,0,0,0],"score_draw":75,"stats_draw":{"5":5,"10":4,"13":1},"score_rank":40,"score_lastRound":0,"score_spclType":0,"stats_spclType":[0,0,0,0,0,0,0,0,0],"windif":200,"lastOffLineTime":null}},"tData":{"initCoin":0,"gameType":2018110,"roundAll":300,"roundNum":299,"isValidTable":true,"fanNum":0,"maxPlayer":3,"uids":[1000140,1000141,1000142],"uidsQueue":[1000140,1000141,1000142],"owner":1000140,"maxHunNum":4,"tableid":"518170","cardNext":81,"winner":-1,"zhuang":0,"curPlayer":1,"lastPutPlayer":0,"putType":0,"lastDrawPlayer":-1,"tState":6,"lastPutCard":[517],"genpaiCount":0,"isHunCardPlay":false,"canHu7":false,"delEnd":0,"delEndHePai":0,"firstDel":0,"canEatHu":true,"huangNum":14,"lastGangType":0,"lastGangDianpaoPlayer":-1,"xingPlayer":-1,"datuoNum":0,"shuffleCardsNum":108,"hunCard":-1,"areaSelectMode":{"maxPlayer":3,"payWay":0,"deckNum":2,"scoreLine":300,"isShowLeft":true,"hasJoker":true,"isDivideTeam":false},"deckNum":2,"isDivideTeam":false,"hasWings":true,"handCount":27,"leftCardCount":27,"inTeamUids":[],"gameCnName":"Â¡»Ø°ÔÕ¨µ¯","hasReadyBtn":true,"currCard":-1,"drawType":0,"roundNum_play":1,"tids":[],"bodyLen":null,"lastPutCardType":6,"score_draw":0,"stats_draw":{"5":0,"10":0,"13":0},"rank":[1000142,1000140,1000141],"stats_spclType":[0,0,0,0,0,0,0,0,0],"haveBalance":false,"unlockMoney":true,"hasPay":true},"teams":{},"cards":[409,308,209,303,107,112,108,211,110,414,113,205,407,403,107,208,104,215,311,413,413,115,406,314,412,103,207],"roundEndTime":"2018-06-19 11:46:32","isDismiss":false,"serverTime":1529379992265};
                        // MjClient.data.sData.players = obj.players;
                        // MjClient.data.sData.tData = obj.tData;
                        // MjClient.data.sData.teams = obj.teams;
                        // MjClient.data.sData.cards = obj.cards;
                        // MjClient.isDismiss = true;

                        // MjClient.Scene.addChild(new EndOneView_YongZhouLaoChuo());
                        // MjClient.Scene.addChild(new GameOverLayer_YongZhouLaoChuo());

                    }
                },
                chuo : {
                    _run : function(){
                        this.visible = true;
                        this.setString("")
                    },
                    _event : {
                        initSceneData: function(eD)
                        {
                            MjClient.playui.setChuoNum(this, 0);
                        },
                        mjhand : function(){
                            //MjClient.playui.setChuoNum(this, 0);
                        },
                        HZUpdateData : function(){
                            MjClient.playui.setChuoNum(this, 0);
                        },
                        roundEnd : function(){
                            this.setString("")
                        }
                    }
                },
                img_trustFlag: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        initSceneData: function() {
                            MjClient.playui.checkTrustFlagVisible(this, 0);
                        },
                        cancelTrust: function() {
                            MjClient.playui.checkTrustFlagVisible(this, 0);
                        },
                        beTrust: function() {
                            MjClient.playui.checkTrustFlagVisible(this, 0);
                        },
                        roundEnd: function() {
                            MjClient.playui.checkTrustFlagVisible(this, 0);
                        }
                    }
                },
                text_trustCountDown: {
                    _run: function() {
                        this.ignoreContentAdaptWithSize(true);
                    },
                    _event: {
                        initSceneData: function() {
                            MjClient.playui.checkTrustCountDownVisible(this, 0);
                        },
                        
                        PKPut: function() {
                            MjClient.playui.checkTrustCountDownVisible(this, 0);
                        },
                        trustTime: function() {
                            MjClient.playui.checkTrustCountDownVisible(this, 0);
                        },
                        roundEnd: function() {
                            MjClient.playui.checkTrustCountDownVisible(this, 0);
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
                            MjClient.playui.checkRankState(this, 0);
                        },
                        PKPut: function(){
                            MjClient.playui.checkRankState(this, 0);
                        },
                        roundEnd : function(){
                            MjClient.playui.checkRankState(this, 0, true);
                        },
                        clearRankIcon_YongZhouLaoChuo : function(){
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
                        DealPKPass_YongZhouLaoChuo(UIoff);
                        var url = "yongZhouLaoChuo/nv/pass";
                        var pl = MjClient.data.sData.players[eD.uid];
                        playEffect(url, false, pl.info.sex);
                      }
                  }
                },
                _visible: false
            },
            /*changeNode : {
                _run:function()
                {
                    setWgtLayout(this, [200/1280, 0], [0.01, 0.27], [0, 0]);
                    this.visible = false;
                    this.setLocalZOrder(10);
                    if(isIPhoneX()){
                        setWgtLayout(this, [200/1280 * 0.65, 0], [0.01, 0.29], [0, 0]);
                    }
                },
                resetBtn : {
                    _click : function(){
                        postEvent("resetCardsList",{});
                    }
                },
                tuoBtn : {
                    _click : function(btn){
                        var t = MjClient.playui._handMode;
                        if(t == 1){
                            t = 0;
                        }else{
                            t = 1;
                        }
                        postEvent("changeMode", {type:t});
                    }
                },
                chuBtn : {
                    _click : function(btn){
                        var t = MjClient.playui._handMode;
                        if(t == 1){
                            t = 0;
                        }else{
                            t = 1;
                        }
                        postEvent("changeMode", {type:t});
                    }
                },
                _event : {
                    initSceneData: function(eD) {
                        if(MjClient.rePlayVideo != -1){
                            this.visible = false;
                            return;
                        }

                        if (MjClient.data.sData.tData.tState == TableState.waitPut)
                        {
                            this.visible = true;
                            var type = MjClient.playui._handMode || 0;
                            postEvent("changeMode", {type:type});
                        }
                    },
                    mjhand: function(eD) {
                        if(MjClient.rePlayVideo != -1){
                            this.visible = false;
                            return;
                        }
                        this.visible = true;
                        var type = MjClient.playui._handMode || 0;
                        postEvent("changeMode", {type:type});
                    },
                    roundEnd: function(){
                        this.visible = false;
                    }
                }
            }, */
            _event: {
                clearCardUI: function() {
                    clearCardUI_YongZhouLaoChuo(this, 0);
                },
                initSceneData: function(eD) {
                    SetUserVisible_YongZhouLaoChuo(this, 0);
                    reConnectShowDeskCard_YongZhouLaoChuo();
                    var pl = getUIPlayer_YongZhouLaoChuo(0);
                    if(MjClient.data.sData.tData.tState != TableState.roundFinish && pl.mjhand && pl.mjhand.length <= 0 && pl.teamerHand && this.cardList){
                    //    this.cardList.showTeamHand(true, pl.teamerHand);
                    }

                    if(MjClient.rePlayVideo != -1){
                        return;
                    }
                    if (MjClient.data.sData.tData.tState == TableState.waitPut)
                    {
                        MjClient.playui._handMode = 0;
                        if(this.cardList){
                            this.cardList.setHandMode();
                        }
                    }
                },
                addPlayer: function(eD) {
                    SetUserVisible_YongZhouLaoChuo(this, 0);
                },
                removePlayer: function(eD) {
                    SetUserVisible_YongZhouLaoChuo(this, 0);
                },
                // TZJoinTeam: function() {
                //     updateHeadInfo_YongZhouLaoChuo(this, 0);
                //     updateZuInfo_YongZhouLaoChuo(this, 0);
                // },
                mjhand: function(eD) {
                    if(this.cardList){
                     //   this.cardList.showTeamHand(false);
                    }
                    
                    InitUserHandUI_YongZhouLaoChuo(this, 0);

                    SetUserVisible_YongZhouLaoChuo(this, 0);
                    if(MjClient.rePlayVideo == -1){
                        MjClient.playui.shuffleCutCards();
                    }

                    if(MjClient.rePlayVideo != -1){
                        return;
                    }
                    MjClient.playui._handMode = 0;
                    if(this.cardList){
                        this.cardList.setHandMode();
                    }
                },
                roundEnd: function() {
                    //this.cardList.showTeamHand(false);
                    InitUserCoinAndName_YongZhouLaoChuo(this, 0);
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
                        var pl = getUIPlayer_YongZhouLaoChuo(0);
                        if(pl.trust){
                            
                            DealMJPut_YongZhouLaoChuo(this,eD, 0);
                        }else{
                            if(this.throwList){
                                //this.throwList.hideCards();
                                this.throwList.showCards(eD.card, eD.sex, true, !eD.canBeat);
                            }
                        }
                    }else
                    {
                        // if(this.throwList){
                        //     this.throwList.hideCards();
                        // }
                        DealMJPut_YongZhouLaoChuo(this,eD, 0);
                    }

                    var pl = getUIPlayer_YongZhouLaoChuo(0);
                    // if(pl.mjhand.length <= 0 && pl.teamerHand){
                    //     this.cardList.showTeamHand(true, pl.teamerHand);
                    // }
                    
                },

                ZDTeamerHand : function(){
                    var pl = getUIPlayer_YongZhouLaoChuo(0);
                    //this.cardList.showTeamHand(true, pl.teamerHand);
                },

                PKPut_YongZhouLaoChuo : function(eD){
                    //本地发起的事件
                    // if(this.throwList){
                    //     //this.throwList.hideCards();
                    //     this.throwList.showCards(eD.cards, eD.sex, true);
                    // }
                },
                waitPut:function(eD){
                    cc.log(">>>>>>>>>>>>>>>>down>>>>>>>>>>>>>>>waitPut");

                    // var tData = MjClient.data.sData.tData;
                    // if (MjClient.playui.isShowHandCardBeiMain && (tData.curPlayer == getPlayerIndex(0) || tData.lastPutPlayer != -1)) {
                    //     MjClient.playui.isShowHandCardBeiMain = false;
                    //     MjClient.playui.hideHandCardBeiMian();

                    //     if(this.throwList){
                    //         this.throwList.hideCards();
                    //     }
                    // }

                    //youhuaba
                    // if(IsTurnToMe()){
                    //     if(this.throwList){
                    //         this.throwList.hideCards();
                    //     }
                    // }

                    UpdataCurrentPutCard_YongZhouLaoChuo();
                    DealWaitPut_YongZhouLaoChuo(this, eD, 0);

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
                    setUserOffline_YongZhouLaoChuo(this, 0);
                },
                playerStatusChange: function(eD) {
                    setUserOffline_YongZhouLaoChuo(this, 0);
                },
                TZScore: function(msg){
                    InitUserCoinAndName_YongZhouLaoChuo(this, 0);

                    MjClient.playui.checkScoreState(this, 0);
                },
                resetCardsList : function(){
                    if(this.cardList){
                        this.cardList.resetCards();
                    }
                },
                HZUpdateData : function(eD) {
                    MjClient.playui.delayExeUpdata(this, 0);
                    // if(this.throwList){
                    //     this.throwList.hideCards();
                    // }
                },
                HZUpdateEatFlag:function(eD){

                },

                // changeMode : function(d){
                //     var type = d.type;
                //     MjClient.playui._handMode = type;
                //     var tuoBtn = this.getChildByName("changeNode").getChildByName("tuoBtn");
                //     var chuBtn = this.getChildByName("changeNode").getChildByName("chuBtn");
                //     if(type == 0){
                //         chuBtn.loadTextureNormal("baZhaDan/chupai_n.png",ccui.Widget.LOCAL_TEXTURE);
                //         tuoBtn.loadTextureNormal("baZhaDan/tuopai_s.png",ccui.Widget.LOCAL_TEXTURE);
                //     }else{
                //         chuBtn.loadTextureNormal("baZhaDan/chupai_s.png",ccui.Widget.LOCAL_TEXTURE);
                //         tuoBtn.loadTextureNormal("baZhaDan/tuopai_n.png",ccui.Widget.LOCAL_TEXTURE);
                //     }
                //     if(this.cardList){
                //         this.cardList.setHandMode();
                //     }
                // }

            }
        },
        right: {
            head: {
                zu: {
                    _run : function(){
                        this.visible = false;
                    },
                    _event: {
                        initSceneData: function() {
                            MjClient.playui.checkZhuangVisible(this, 1);
                        },
                        mjhand: function() {
                            MjClient.playui.checkZhuangVisible(this, 1);
                        }
                    }
                },
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
                    showPlayerInfo_YongZhouLaoChuo(1, btn);
                },
                _event: {
                    loadWxHead: function(d) {
                        // setWxHead(this, d, 1);
                    },
                    addPlayer: function() {
                        showFangzhuTagIcon_YongZhouLaoChuo(this, 1);
                    },
                    removePlayer: function() {
                        showFangzhuTagIcon_YongZhouLaoChuo(this, 1);
                    },
                    initSceneData : function(){
                        showFangzhuTagIcon_YongZhouLaoChuo(this,1);
                    },
                    mjhand : function(){
                        showFangzhuTagIcon_YongZhouLaoChuo(this,1);
                    }
                },
                _run: function () {
                    // this.zIndex = 600;
                    showFangzhuTagIcon_YongZhouLaoChuo(this,1);
                },
                score_bg:{_visible:false},
                name_bg:{_visible:false},
                tingCard:{
                    _visible:false,
                    _event:{
                        initSceneData: function(eD)
                        {
                            var pl = getUIPlayer_YongZhouLaoChuo(1);
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
                        clearRankIcon_YongZhouLaoChuo : function(){
                            this.visible = false;
                        }
                    }
                },
                chuo : {
                    _run : function(){
                        this.visible = true;
                        this.setString("")
                    },
                    _event : {
                        initSceneData: function(eD)
                        {
                            MjClient.playui.setChuoNum(this, 1);
                        },
                        mjhand : function(){
                            //MjClient.playui.setChuoNum(this, 1);
                        },
                        HZUpdateData : function(){
                            MjClient.playui.setChuoNum(this, 1);
                        },
                        roundEnd : function(){
                            this.setString("")
                        }
                    }
                },
                img_trustFlag: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        initSceneData: function() {
                            MjClient.playui.checkTrustFlagVisible(this, 1);
                        },
                        cancelTrust: function() {
                            MjClient.playui.checkTrustFlagVisible(this, 1);
                        },
                        beTrust: function() {
                            MjClient.playui.checkTrustFlagVisible(this, 1);
                        },
                        roundEnd: function() {
                            MjClient.playui.checkTrustFlagVisible(this, 1);
                        }
                    }
                },
                text_trustCountDown: {
                    _run: function() {
                        this.ignoreContentAdaptWithSize(true);
                    },
                    _event: {
                        initSceneData: function() {
                            MjClient.playui.checkTrustCountDownVisible(this, 1);
                        },
                        
                        PKPut: function() {
                            MjClient.playui.checkTrustCountDownVisible(this, 1);
                        },
                        trustTime: function() {
                            MjClient.playui.checkTrustCountDownVisible(this, 1);
                        },
                        roundEnd: function() {
                            MjClient.playui.checkTrustCountDownVisible(this, 1);
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
                            DealPKPass_YongZhouLaoChuo(UIoff);
                            var url = "yongZhouLaoChuo/nv/pass";
                            var pl = MjClient.data.sData.players[eD.uid];
                            playEffect(url, false, pl.info.sex);
                        }
                    }
                },
                _visible: false
            },
            _event: {
                clearCardUI: function() {
                    clearCardUI_YongZhouLaoChuo(this, 1);
                },
                initSceneData: function(eD) {
                    SetUserVisible_YongZhouLaoChuo(this, 1);
                    // MjClient.playui.checkScoreState(this, 1);
                },
                addPlayer: function(eD) {
                    SetUserVisible_YongZhouLaoChuo(this, 1);
                },
                removePlayer: function(eD) {
                    SetUserVisible_YongZhouLaoChuo(this, 1);
                },
                // TZJoinTeam: function() {
                //     updateHeadInfo_YongZhouLaoChuo(this, 1);
                //     updateZuInfo_YongZhouLaoChuo(this, 1);

                // },
                mjhand: function(eD) {
                    InitUserHandUI_YongZhouLaoChuo(this, 1);

                    SetUserVisible_YongZhouLaoChuo(this, 1);
                },
                roundEnd: function() {
                    InitUserCoinAndName_YongZhouLaoChuo(this, 1);
                    // this.cardList.removeFromParent();
                    // this.cardList = null;
                },
                waitPut: function(eD) {
                    DealWaitPut_YongZhouLaoChuo(this, eD, 1);
                },
                PKPut: function(eD) {
                    // if(this.throwList){
                    //     this.throwList.hideCards();
                    // }
                    DealMJPut_YongZhouLaoChuo(this, eD, 1);
                    if(eD.uid != SelfUid())
                    {

                    }
                },
                onlinePlayer: function(eD) {
                    setUserOffline_YongZhouLaoChuo(this, 1);
                },
                playerStatusChange: function(eD) {
                    setUserOffline_YongZhouLaoChuo(this, 1);
                },
                HZUpdateData : function(eD) {
                    MjClient.playui.delayExeUpdata(this, 1);
                    // if(this.throwList){
                    //     this.throwList.hideCards();
                    // }
                },
                // TZScore: function(msg){
                //     InitUserCoinAndName_YongZhouLaoChuo(this, 1);

                //     MjClient.playui.checkScoreState(this, 1);
                // }
            }
        },
        top: {
            _run:function() {
                this.visible = MjClient.MaxPlayerNum >= 3;
            },
            head: {
                zu: {
                    _run : function(){
                        this.visible = false;
                    },
                    _event: {
                        initSceneData: function() {
                            MjClient.playui.checkZhuangVisible(this, 2);
                        },
                        mjhand: function() {
                            MjClient.playui.checkZhuangVisible(this, 2);
                        }
                    }
                },
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
                    showPlayerInfo_YongZhouLaoChuo(2, btn);
                },
                _event: {
                    loadWxHead: function(d) {
                        // setWxHead(this, d, 2);
                    },
                    addPlayer: function() {
                        showFangzhuTagIcon_YongZhouLaoChuo(this, 2);
                    },
                    removePlayer: function() {
                        showFangzhuTagIcon_YongZhouLaoChuo(this, 2);
                    },
                    initSceneData : function(){
                        showFangzhuTagIcon_YongZhouLaoChuo(this,2);
                    },
                    mjhand : function(){
                        showFangzhuTagIcon_YongZhouLaoChuo(this,2);
                    }
                },
                _run: function () {
                    // this.zIndex = 600;
                    showFangzhuTagIcon_YongZhouLaoChuo(this,2);
                },
                score_bg:{_visible:false},
                name_bg:{_visible:false},
                tingCard:{
                    _visible:false,
                    _event:{
                        initSceneData: function(eD)
                        {
                            var pl = getUIPlayer_YongZhouLaoChuo(2);
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
                chuo : {
                    _run : function(){
                        this.visible = true;
                        this.setString("")
                    },
                    _event : {
                        initSceneData: function(eD)
                        {
                            MjClient.playui.setChuoNum(this, 2);
                        },
                        mjhand : function(){
                            //MjClient.playui.setChuoNum(this, 2);
                        },
                        HZUpdateData : function(){
                            MjClient.playui.setChuoNum(this, 2);
                        },
                        roundEnd : function(){
                            this.setString("")
                        }
                    }
                },
                img_trustFlag: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        initSceneData: function() {
                            MjClient.playui.checkTrustFlagVisible(this, 2);
                        },
                        cancelTrust: function() {
                            MjClient.playui.checkTrustFlagVisible(this, 2);
                        },
                        beTrust: function() {
                            MjClient.playui.checkTrustFlagVisible(this, 2);
                        },
                        roundEnd: function() {
                            MjClient.playui.checkTrustFlagVisible(this, 2);
                        }
                    }
                },
                text_trustCountDown: {
                    _run: function() {
                        this.ignoreContentAdaptWithSize(true);
                        if(MjClient.MaxPlayerNum == 3){
                            this.setAnchorPoint(0.5, 0);
                            var parent = this.getParent();
                            this.setPosition(parent.width/2, parent.height + 10);
                        };
                    },
                    _event: {
                        initSceneData: function() {
                            MjClient.playui.checkTrustCountDownVisible(this, 2);
                        },
                        
                        PKPut: function() {
                            MjClient.playui.checkTrustCountDownVisible(this, 2);
                        },
                        trustTime: function() {
                            MjClient.playui.checkTrustCountDownVisible(this, 2);
                        },
                        roundEnd: function() {
                            MjClient.playui.checkTrustCountDownVisible(this, 2);
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
                        clearRankIcon_YongZhouLaoChuo : function(){
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
                            DealPKPass_YongZhouLaoChuo(UIoff);
                            var url = "yongZhouLaoChuo/nv/pass";
                            var pl = MjClient.data.sData.players[eD.uid];
                            playEffect(url, false, pl.info.sex);
                        }
                    }
                },
                _visible: false
            },
            _event: {
                clearCardUI: function() {
                    clearCardUI_YongZhouLaoChuo(this, 2);
                },
                initSceneData: function(eD) {
                    SetUserVisible_YongZhouLaoChuo(this, 2);
                },
                addPlayer: function(eD) {
                    SetUserVisible_YongZhouLaoChuo(this, 2);
                },
                removePlayer: function(eD) {
                    SetUserVisible_YongZhouLaoChuo(this, 2);
                },
                // TZJoinTeam: function() {
                //     updateHeadInfo_YongZhouLaoChuo(this, 2);
                //     updateZuInfo_YongZhouLaoChuo(this, 2);

                // },
                mjhand: function(eD) {
                    InitUserHandUI_YongZhouLaoChuo(this, 2);

                    SetUserVisible_YongZhouLaoChuo(this, 2);
                },
                roundEnd: function() {
                    InitUserCoinAndName_YongZhouLaoChuo(this, 2);
                    // this.cardList.removeFromParent();
                    // this.cardList = null;
                },
                waitPut: function(eD) {
                    DealWaitPut_YongZhouLaoChuo(this, eD, 2);
                },
                PKPut: function(eD) {
                    // if(this.throwList){
                    //     this.throwList.hideCards();
                    // }
                    DealMJPut_YongZhouLaoChuo(this, eD, 2);
                },
                onlinePlayer: function(eD) {
                    setUserOffline_YongZhouLaoChuo(this, 2);
                },
                playerStatusChange: function(eD) {
                    setUserOffline_YongZhouLaoChuo(this, 2);
                },
                MJFlower: function(eD) {
                    HandleMJFlower(this, eD, 2);
                },
                MJTing: function (eD) {
                    HandleMJTing(this, eD, 2);
                },
                HZUpdateData : function(eD) {
                    MjClient.playui.delayExeUpdata(this, 2);
                    // if(this.throwList){
                    //     this.throwList.hideCards();
                    // }
                },
                // TZScore: function(msg){
                //     InitUserCoinAndName_YongZhouLaoChuo(this, 2);

                //     if(MjClient.data.sData.tData.maxPlayer == 3){
                //         MjClient.playui.checkScoreState(this, 2);
                //     }
                // }
            }
        },
        left: {
            _run:function() {
                this.visible = MjClient.MaxPlayerNum == 4;
            },
            head: {
                zu: {
                    _run : function(){
                        this.visible = false;
                    },
                    _event: {
                        initSceneData: function() {
                            MjClient.playui.checkZhuangVisible(this, 3);
                        },
                        mjhand: function() {
                            MjClient.playui.checkZhuangVisible(this, 3);
                        }
                    }
                },
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
                    showPlayerInfo_YongZhouLaoChuo(3, btn);
                },
                _event: {
                    loadWxHead: function(d) {
                        // setWxHead(this, d, 3);
                    },
                    addPlayer: function() {
                        showFangzhuTagIcon_YongZhouLaoChuo(this, 3);
                    },
                    removePlayer: function() {
                        showFangzhuTagIcon_YongZhouLaoChuo(this, 3);
                    },
                    initSceneData : function(){
                        showFangzhuTagIcon_YongZhouLaoChuo(this,3);
                    },
                    mjhand : function(){
                        showFangzhuTagIcon_YongZhouLaoChuo(this,3);
                    }
                },
                _run: function () {
                    // this.zIndex = 600;
                    showFangzhuTagIcon_YongZhouLaoChuo(this,3);
                },
                score_bg:{_visible:false},
                name_bg:{_visible:false},
                tingCard:{
                    _visible:false,
                    _event:{
                        initSceneData: function(eD)
                        {
                            var pl = getUIPlayer_YongZhouLaoChuo(3);
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
                chuo : {
                    _run : function(){
                        this.visible = true;
                        this.setString("")
                    },
                    _event : {
                        initSceneData: function(eD)
                        {
                            MjClient.playui.setChuoNum(this, 3);
                        },
                        mjhand : function(){
                            //MjClient.playui.setChuoNum(this, 3);
                        },
                        HZUpdateData : function(){
                            MjClient.playui.setChuoNum(this, 3);
                        },
                        roundEnd : function(){
                            this.setString("")
                        }
                    }
                },
                img_trustFlag: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        initSceneData: function() {
                            MjClient.playui.checkTrustFlagVisible(this, 3);
                        },
                        cancelTrust: function() {
                            MjClient.playui.checkTrustFlagVisible(this, 3);
                        },
                        beTrust: function() {
                            MjClient.playui.checkTrustFlagVisible(this, 3);
                        },
                        roundEnd: function() {
                            MjClient.playui.checkTrustFlagVisible(this, 3);
                        }
                    }
                },
                text_trustCountDown: {
                    _run: function() {
                        this.ignoreContentAdaptWithSize(true);
                    },
                    _event: {
                        initSceneData: function() {
                            MjClient.playui.checkTrustCountDownVisible(this, 3);
                        },
                        
                        PKPut: function() {
                            MjClient.playui.checkTrustCountDownVisible(this, 3);
                        },
                        trustTime: function() {
                            MjClient.playui.checkTrustCountDownVisible(this, 3);
                        },
                        roundEnd: function() {
                            MjClient.playui.checkTrustCountDownVisible(this, 3);
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
                        clearRankIcon_YongZhouLaoChuo : function(){
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
                            DealPKPass_YongZhouLaoChuo(UIoff);
                            var url = "yongZhouLaoChuo/nv/pass";
                            var pl = MjClient.data.sData.players[eD.uid];
                            playEffect(url, false, pl.info.sex);
                        }
                    }
                },
                _visible: false
            },
            _event: {
                clearCardUI: function() {
                    clearCardUI_YongZhouLaoChuo(this, 3);
                },
                initSceneData: function(eD) {
                    SetUserVisible_YongZhouLaoChuo(this, 3);
                    // MjClient.playui.checkScoreState(this, 3);
                },
                addPlayer: function(eD) {
                    SetUserVisible_YongZhouLaoChuo(this, 3);
                },
                removePlayer: function(eD) {
                    SetUserVisible_YongZhouLaoChuo(this, 3);
                },
                // TZJoinTeam: function() {
                //     updateHeadInfo_YongZhouLaoChuo(this, 3);
                //     updateZuInfo_YongZhouLaoChuo(this, 3);
                // },
                mjhand: function(eD) {
                    InitUserHandUI_YongZhouLaoChuo(this, 3);

                    SetUserVisible_YongZhouLaoChuo(this, 3);
                },
                roundEnd: function() {
                    InitUserCoinAndName_YongZhouLaoChuo(this, 3);
                    // this.cardList.removeFromParent();
                    // this.cardList = null;
                },
                waitPut: function(eD) {
                    DealWaitPut_YongZhouLaoChuo(this, eD, 3);
                },
                PKPut: function(eD) {
                    // if(this.throwList){
                    //     this.throwList.hideCards();
                    // }
                    DealMJPut_YongZhouLaoChuo(this, eD, 3);
                },
                onlinePlayer: function(eD) {
                    setUserOffline_YongZhouLaoChuo(this, 3);
                },
                playerStatusChange: function(eD) {
                    setUserOffline_YongZhouLaoChuo(this, 3);
                },
                MJFlower: function(eD) {
                    HandleMJFlower(this, eD, 3);
                },
                MJTing: function (eD) {
                    HandleMJTing(this, eD, 3);
                },
                HZUpdateDate: function(eD){

                },
                HZUpdateData : function(eD) {
                    MjClient.playui.delayExeUpdata(this, 3);
                    // if(this.throwList){
                    //     this.throwList.hideCards();
                    // }
                }
                // TZScore: function(msg){
                //     InitUserCoinAndName_YongZhouLaoChuo(this, 3);

                //     if(MjClient.data.sData.tData.maxPlayer == 4){
                //         MjClient.playui.checkScoreState(this, 3);
                //     }
                    
                // }
            }
        },
        chat_btn: {
            _layout: [
                [68/1280, 0],
                [0.9649, 0.3035], //0.061
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
                [0.9649, 0.4007],
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
                if (tData.maxPlayer == 4) {
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
                // playCardAni_huangZhuang(1);
                // if(true){
                //     return
                // }
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
                    var tData = MjClient.data.sData.tData;
                    if(MjClient.rePlayVideo !== -1 || tData.maxPlayer == 4){
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
                // MjClient.Scene.addChild(new SettingPanel_CheHuZI(), 6000);
                // // MjClient.Scene.addChild(new SettingPanel_ZiPaiPaoHuZi(), 6000);
                // MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Shezhi", {
                //     uid: SelfUid(),
                //     gameType: MjClient.gameType
                // });
                var settringLayer = new SettingView();
                settringLayer.setName("PlayLayerClick");
                MjClient.Scene.addChild(settringLayer);
                MjClient.native.umengEvent4CountWithProperty("Fangjiannei_shezhi", {uid:SelfUid(),gameType:MjClient.gameType});
            }
        },
        gps_btn: {
            _layout: [
                [68 / 1280, 0],
                [0.9649, 0.2035],//0.2645
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
                    setWgtLayout(this, [68/1280 * 0.88, 0], [0.9649, 0.243], [0, 0]);
                }
            },
            _click: function() {
                //MjClient.playui.addChild(new EndOneView_YongZhouLaoChuo(), 500);
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
        /*fenZuNode:{
            _layout: [[100/1280, 0], [0.7503, 0.0278], [0, 0]],
            _run:function() {
                this.update = function() {
                    var isVisible = true;
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    var areaSelectMode = tData.areaSelectMode;

                    if (tData.maxPlayer != 4 || !areaSelectMode.isDivideTeam) {
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
                        loaderHeadImage_YongZhouLaoChuo(head.getChildByName("nobody"), pl);
                        head.getChildByName("name").setString(unescape(pl.info.nickname));
                        head.getChildByName("name").setFontName("Arial"); 
                        head.getChildByName("name").setFontSize(25);
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

                        if(tData.areaSelectMode.isRandomTeam){
                            zuImg.visible = false;
                            xuanZeMsg.setString(" ");

                            if (pl && pl.mjState == TableState.isReady && tData.tState != TableState.waitJoin) {
                                xuanZeMsg.setString("准备");
                            }
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
                },
                onlinePlayer: function() {
                    this.update();
                }
            }
        }, */
        dipai:{
            _layout: [
                [97/1280, 0],
                [0.9594, 0.7951],
                [0, 0]
            ],
            _run:function(){
                this.visible = false;
                var countTxt =  this.getChildByName("countTxt");
                countTxt.ignoreContentAdaptWithSize(true);
                //countTxt.setString(MjClient.data.sData.tData.leftCardCount);
            }
        },
        pai26:{
            _layout: [
                [0.0875, 0.1597],
                [0.92, 0.80],
                [0, 0]
            ],
            _run:function(){
                this.visible = MjClient.MaxPlayerNum == 2 ;
                
            }
        },
        // jiFen4RenTeam : {
        //     _layout: [
        //         [275/1280, 0],
        //         [0.118, 0.9236],
        //         [0, 0]
        //     ],
        //     _run:function(){
        //         var areaSelectMode = MjClient.data.sData.tData.areaSelectMode;
        //         this.visible =  (MjClient.MaxPlayerNum == 4 && (areaSelectMode.isDivideTeam || areaSelectMode.isRandomTeam));
        //         if(MjClient.rePlayVideo !== -1){
        //             this.visible = false;
        //         }
        //     },
        //     fenzu : {
        //         _run:function(){
        //             this.ignoreContentAdaptWithSize(true);
        //         }
        //     },
        //     lsjf : {
        //         _run:function(){
        //             this.ignoreContentAdaptWithSize(true);
        //         }
        //     },
        //     bjdf : {
        //         _run:function(){
        //             this.ignoreContentAdaptWithSize(true);
        //         }
        //     },
        //     zxf : {
        //         _run:function(){
        //             this.ignoreContentAdaptWithSize(true);
        //         }
        //     },
        //     bjdf_A : {
        //         _run : function(){
        //             this._oldP = this.getPosition();
        //         }
        //     },
        //     bjdf_B : {
        //         _run : function(){
        //             this._oldP = this.getPosition();
        //         }
        //     },
        //     zxf_A : {
        //         _run : function(){
        //             this._oldP = this.getPosition();
        //         }
        //     },
        //     zxf_B : {
        //         _run : function(){
        //             this._oldP = this.getPosition();
        //         }
        //     },
        //     _click : function(sender, et){
        //         var btn = sender.getChildByName("btn");
        //         cc.log("---", btn.doClick);
        //         if(btn && btn.doClick){
        //             btn.doClick(btn, et);
        //         }
        //     },
        //     btn:{
        //         _run:function(){
        //             this._isShow = true; //面板显示状态
        //             this._isMove = false;

        //             this.doClick = function(btn, et){
        //                 if(btn._isMove) return;
        //                 var pNode = btn.getParent();
        //                 var cb = cc.callFunc(function(){
        //                     btn._isMove = false;
        //                 }.bind(btn));
        //                 var ac = cc.moveBy(0.2,0,pNode.height * pNode.scale).easing(cc.easeBackOut());
        //                 if(!btn._isShow){
        //                     ac = cc.moveBy(0.2,0,pNode.height * pNode.scale * -1).easing(cc.easeBackOut());
        //                 }
        //                 pNode.runAction(cc.sequence(ac, cb));
        //                 btn._isShow = !btn._isShow;
                        
        //                 var imgSrc = btn._isShow ? "upScoreSp" : "down";
        //                 cc.log("daTongZi/playing" + imgSrc + ".png");
        //                 btn.loadTexture("daTongZi/playing/" + imgSrc + ".png");
        //             }
        //         },
        //         _click : function(btn,et){
        //             btn.doClick(btn, et);
        //         }
        //     },
        //     _event : {
        //         roudEnd: function(msg){
        //             showJiFen4Ren_YongZhouLaoChuo(this,MjClient.data.sData);
        //         },
        //         TZScore: function(msg){
        //             showJiFen4Ren_YongZhouLaoChuo(this,MjClient.data.sData);
        //         },
        //         initSceneData : function(){
        //             showJiFen4Ren_YongZhouLaoChuo(this, MjClient.data.sData);
        //         },
        //         addPlayer : function(){
        //             showJiFen4Ren_YongZhouLaoChuo(this, MjClient.data.sData);
        //         },
        //         removePlayer: function() {
        //             showJiFen4Ren_YongZhouLaoChuo(this, MjClient.data.sData);
        //         },
        //         mjhand : function(){
        //             showJiFen4Ren_YongZhouLaoChuo(this, MjClient.data.sData);
        //         },
        //         clearScoreDTZ : function(){
        //             cc.log("hand ClearScoreDTZ");
        //             showJiFen4Ren_YongZhouLaoChuo(this, MjClient.data.sData);
        //         }
        //     }
        // },
        // jiFen4Ren : {
        //     _layout: [
        //         [311/1280, 0],
        //         [0.13, 0.8722],
        //         [0, 0]
        //     ],
        //     _run:function(){
        //         var areaSelectMode = MjClient.data.sData.tData.areaSelectMode;
        //         this.visible =  (MjClient.MaxPlayerNum == 4 && !areaSelectMode.isDivideTeam);
        //         if(MjClient.rePlayVideo !== -1){
        //             this.visible = false;
        //         }
        //     },
        //     fenzu : {
        //         _run:function(){
        //             this.ignoreContentAdaptWithSize(true);
        //         }
        //     },
        //     lsjf : {
        //         _run:function(){
        //             this.ignoreContentAdaptWithSize(true);
        //         }
        //     },
        //     bjdf : {
        //         _run:function(){
        //             this.ignoreContentAdaptWithSize(true);
        //         }
        //     },
        //     zxf : {
        //         _run:function(){
        //             this.ignoreContentAdaptWithSize(true);
        //         }
        //     },
        //     bjdf_0 : {
        //         _run: function(){
        //             this._oldP = this.getPosition();
        //         }
        //     },
        //     bjdf_1 : {
        //         _run: function(){
        //             this._oldP = this.getPosition();
        //         }
        //     },
        //     bjdf_2 : {
        //         _run: function(){
        //             this._oldP = this.getPosition();
        //         }
        //     },
        //     bjdf_3 : {
        //         _run: function(){
        //             this._oldP = this.getPosition();
        //         }
        //     },
        //     zxf_0 : {
        //         _run: function(){
        //             this._oldP = this.getPosition();
        //         }
        //     },
        //     zxf_1 : {
        //         _run: function(){
        //             this._oldP = this.getPosition();
        //         }
        //     },
        //     zxf_2 : {
        //         _run: function(){
        //             this._oldP = this.getPosition();
        //         }
        //     },
        //     zxf_3 : {
        //         _run: function(){
        //             this._oldP = this.getPosition();
        //         }
        //     },
        //     _click : function(sender, et){
        //         var btn = sender.getChildByName("btn");
        //         cc.log("---", btn.doClick);
        //         if(btn && btn.doClick){
        //             btn.doClick(btn, et);
        //         }
        //     },
        //     btn:{
        //         _run:function(){
        //             this._isShow = true; //面板显示状态
        //             this._isMove = false;

        //             this.doClick = function(btn, et){
        //                 if(btn._isMove) return;
        //                 var pNode = btn.getParent();
        //                 var cb = cc.callFunc(function(){
        //                     btn._isMove = false;
        //                 }.bind(btn));
        //                 var ac = cc.moveBy(0.2,0,pNode.height * pNode.scale).easing(cc.easeBackOut());
        //                 if(!btn._isShow){
        //                     ac = cc.moveBy(0.2,0,pNode.height * pNode.scale * -1).easing(cc.easeBackOut());
        //                 }
        //                 pNode.runAction(cc.sequence(ac, cb));
        //                 btn._isShow = !btn._isShow;
                        
        //                 var imgSrc = btn._isShow ? "upScoreSp" : "down";
        //                 btn.loadTexture("daTongZi/playing/" + imgSrc + ".png");
        //             }
        //         },
        //         _click : function(btn,et){
        //             btn.doClick(btn, et);
        //         }
        //     },
        //     _event : {
        //         roudEnd: function(msg){
        //             console.log("rounEnd====:" + JSON.stringify(msg));
        //             showJiFen3Ren_YongZhouLaoChuo(this,MjClient.data.sData, 4);
        //         },
        //         TZScore: function(msg){
        //             console.log("TZScore====:" + JSON.stringify(msg));
        //             showJiFen3Ren_YongZhouLaoChuo(this,MjClient.data.sData, 4);
        //         },
        //         initSceneData : function(){
        //             console.log("initSceneData====:" + JSON.stringify(MjClient.data.sData));
        //             showJiFen3Ren_YongZhouLaoChuo(this, MjClient.data.sData, 4);
        //         },
        //         addPlayer : function(){
        //             showJiFen3Ren_YongZhouLaoChuo(this, MjClient.data.sData, 4);
        //         },
        //         removePlayer: function() {
        //             showJiFen3Ren_YongZhouLaoChuo(this, MjClient.data.sData, 4);
        //         },
        //         mjhand : function(){
        //             showJiFen3Ren_YongZhouLaoChuo(this, MjClient.data.sData, 4);
        //         },
        //         clearScoreDTZ : function(){
        //             showJiFen3Ren_YongZhouLaoChuo(this, MjClient.data.sData, 4);
        //         }
        //     }
        // },
        // jiFen3Ren : {
        //     _layout: [
        //         [311/1280, 0],
        //         [0.13, 0.8986],
        //         [0, 0]
        //     ],
        //     _run:function(){
        //         var areaSelectMode = MjClient.data.sData.tData.areaSelectMode;
        //         this.visible =  MjClient.MaxPlayerNum <= 3;
        //         if(MjClient.rePlayVideo !== -1){
        //             this.visible = false;
        //         }
        //     },
        //     fenzu : {
        //         _run:function(){
        //             this.ignoreContentAdaptWithSize(true);
        //         }
        //     },
        //     lsjf : {
        //         _run:function(){
        //             this.ignoreContentAdaptWithSize(true);
        //         }
        //     },
        //     bjdf : {
        //         _run:function(){
        //             this.ignoreContentAdaptWithSize(true);
        //         }
        //     },
        //     zxf : {
        //         _run:function(){
        //             this.ignoreContentAdaptWithSize(true);
        //         }
        //     },
        //     bjdf_0 : {
        //         _run: function(){
        //             this._oldP = this.getPosition();
        //         }
        //     },
        //     bjdf_1 : {
        //         _run: function(){
        //             this._oldP = this.getPosition();
        //         }
        //     },
        //     bjdf_2 : {
        //         _run: function(){
        //             this._oldP = this.getPosition();
        //         }
        //     },
        //     zxf_0 : {
        //         _run: function(){
        //             this._oldP = this.getPosition();
        //         }
        //     },
        //     zxf_1 : {
        //         _run: function(){
        //             this._oldP = this.getPosition();
        //         }
        //     },
        //     zxf_2 : {
        //         _run: function(){
        //             this._oldP = this.getPosition();
        //         }
        //     },
        //     _click : function(sender, et){
        //         var btn = sender.getChildByName("btn");
        //         cc.log("---", btn.doClick);
        //         if(btn && btn.doClick){
        //             btn.doClick(btn, et);
        //         }
        //     },
        //     btn:{
        //         _run:function(){
        //             this._isShow = true; //面板显示状态
        //             this._isMove = false;

        //             this.doClick = function(btn, et){
        //                 if(btn._isMove) return;
        //                 var pNode = btn.getParent();
        //                 var cb = cc.callFunc(function(){
        //                     btn._isMove = false;
        //                 }.bind(btn));
        //                 var ac = cc.moveBy(0.2,0,pNode.height * pNode.scale).easing(cc.easeBackOut());
        //                 if(!btn._isShow){
        //                     ac = cc.moveBy(0.2,0,pNode.height * pNode.scale * -1).easing(cc.easeBackOut());
        //                 }
        //                 pNode.runAction(cc.sequence(ac, cb));
        //                 btn._isShow = !btn._isShow;
                        
        //                 var imgSrc = btn._isShow ? "upScoreSp" : "down";
        //                 btn.loadTexture("daTongZi/playing/" + imgSrc + ".png");
        //             }
        //         },
        //         _click : function(btn,et){
        //             btn.doClick(btn, et);
        //         }
        //     },
        //     _event : {
        //         roudEnd: function(msg){
        //             console.log("rounEnd====:" + JSON.stringify(msg));
        //             showJiFen3Ren_YongZhouLaoChuo(this,MjClient.data.sData);
        //         },
        //         TZScore: function(msg){
        //             console.log("TZScore====:" + JSON.stringify(msg));
        //             showJiFen3Ren_YongZhouLaoChuo(this,MjClient.data.sData);
        //         },
        //         initSceneData : function(){
        //             console.log("initSceneData====:" + JSON.stringify(MjClient.data.sData));
        //             showJiFen3Ren_YongZhouLaoChuo(this, MjClient.data.sData);
        //         },
        //         addPlayer : function(){
        //             showJiFen3Ren_YongZhouLaoChuo(this, MjClient.data.sData);
        //         },
        //         removePlayer: function() {
        //             showJiFen3Ren_YongZhouLaoChuo(this, MjClient.data.sData);
        //         },
        //         mjhand : function(){
        //             showJiFen3Ren_YongZhouLaoChuo(this, MjClient.data.sData);
        //         },
        //         clearScoreDTZ : function(){
        //             showJiFen3Ren_YongZhouLaoChuo(this, MjClient.data.sData);
        //         }
        //     }
        // },
        // paiMianFen : {
        //     _layout: [
        //         [254/1280, 0],
        //         [0.355, 0.9236],
        //         [0, 0]
        //     ],
        //     _run:function(){
        //         this.visible = true;
        //         var areaSelectMode = MjClient.data.sData.tData.areaSelectMode;
        //         if(areaSelectMode.isDivideTeam){
        //             setWgtLayout(this, [254/1280, 0],[0.33, 0.9236],[0, 0]);
        //         }
        //         if(MjClient.rePlayVideo !== -1){
        //             this.visible = false;
        //         }
        //     },
        //     pmf : {
        //         _run:function(){
        //             this.ignoreContentAdaptWithSize(true);
        //         }
        //     },
        //     zf : {
        //         _run:function(){
        //             this.ignoreContentAdaptWithSize(true);
        //         }
        //     },
        //     fen5 : {
        //         _run:function(){
        //             this.ignoreContentAdaptWithSize(true);
        //         }
        //     },
        //     fen10 : {
        //         _run:function(){
        //             this.ignoreContentAdaptWithSize(true);
        //         }
        //     },
        //     fenK : {
        //         _run:function(){
        //             this.ignoreContentAdaptWithSize(true);
        //         }
        //     },
        //     _click : function(sender, et){
        //         var btn = sender.getChildByName("btn");
        //         cc.log("---", btn.doClick);
        //         if(btn && btn.doClick){
        //             btn.doClick(btn, et);
        //         }
        //     },
        //     btn:{
        //         _run:function(){
        //             this._isShow = true; //面板显示状态
        //             this._isMove = false;

        //             this.doClick = function(btn, et){
        //                 if(btn._isMove) return;
        //                 var pNode = btn.getParent();
        //                 var cb = cc.callFunc(function(){
        //                     btn._isMove = false;
        //                 }.bind(btn));
        //                 var ac = cc.moveBy(0.2,0,pNode.height * pNode.scale).easing(cc.easeBackOut());
        //                 if(!btn._isShow){
        //                     ac = cc.moveBy(0.2,0,pNode.height * pNode.scale * -1).easing(cc.easeBackOut());
        //                 }
        //                 pNode.runAction(cc.sequence(ac, cb));
        //                 btn._isShow = !btn._isShow;
                        
        //                 var imgSrc = btn._isShow ? "upScoreSp" : "down";
        //                 cc.log("daTongZi/playing" + imgSrc + ".png");
        //                 btn.loadTexture("daTongZi/playing/" + imgSrc + ".png");
        //             }
        //         },
        //         _click : function(btn,et){
        //             btn.doClick(btn, et);
        //         }
        //     },
        //     _event : {
        //         PKPut: function(msg) {
        //             showPaiMianFen_YongZhouLaoChuo(this, MjClient.data.sData.tData);
        //         },
        //         TZScore: function(msg){
        //             showPaiMianFen_YongZhouLaoChuo(this,{});   //清空牌面分
        //         },
        //         initSceneData : function(){
        //             showPaiMianFen_YongZhouLaoChuo(this,MjClient.data.sData.tData);
        //         }
        //     }
        // },
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
                    setBtnJoinTeamVisible_YongZhouLaoChuo(this);
                },
                addPlayer: function() {
                    setBtnJoinTeamVisible_YongZhouLaoChuo(this);
                },
                removePlayer: function() {
                    setBtnJoinTeamVisible_YongZhouLaoChuo(this);
                },
                TZJoinTeam: function() {
                    setBtnJoinTeamVisible_YongZhouLaoChuo(this);
                },
                mjhand: function() {
                    setBtnJoinTeamVisible_YongZhouLaoChuo(this);
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
                    setBtnJoinTeamVisible_YongZhouLaoChuo(this);
                },
                addPlayer: function() {
                    setBtnJoinTeamVisible_YongZhouLaoChuo(this);
                },
                removePlayer: function() {
                    setBtnJoinTeamVisible_YongZhouLaoChuo(this);
                },
                TZJoinTeam: function() {
                    setBtnJoinTeamVisible_YongZhouLaoChuo(this);
                },
                mjhand: function() {
                    setBtnJoinTeamVisible_YongZhouLaoChuo(this);
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
                    setBtnJoinTeamVisible_YongZhouLaoChuo(this);
                },
                addPlayer: function() {
                    setBtnJoinTeamVisible_YongZhouLaoChuo(this);
                },
                removePlayer: function() {
                    setBtnJoinTeamVisible_YongZhouLaoChuo(this);
                },
                TZJoinTeam: function() {
                    setBtnJoinTeamVisible_YongZhouLaoChuo(this);
                },
                mjhand: function() {
                    setBtnJoinTeamVisible_YongZhouLaoChuo(this);
                }
            }
        },
    },
    _downNode:null,
    _rightNode:null,
    _topNode:null,
    _leftNode:null,
    _btn_rank:null,
    _handMode:null, //手牌模式：0:出牌 1 拖动
    ctor: function() {
        this._super();
        //cc.spriteFrameCache.addSpriteFrames("daTongZi/cards.plist");

        var playui = ccs.load("Play_yongZhouLaoChuo.json");

        this.srcMaxPlayerNum = MjClient.MaxPlayerNum;
        MjClient.MaxPlayerNum = parseInt(MjClient.data.sData.tData.maxPlayer);

        //playMusic("bgFight_daTongZi");

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

        // this.pmfBtn = playui.node.getChildByName("paiMianFen").getChildByName("btn");
        // this.pmfBtn.addTouchEventListener(function(type){
        //     if(type == 2){

        //     }
        // },this.pmfBtn);

        MjClient.playui.isAddInfo = []; 
        // MjClient.playui.isAddInfo[1] = false; 
        // MjClient.playui.isAddInfo[2] = false; 
        // MjClient.playui.isAddInfo[3] = false; 
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

        // 俱乐部返回大厅功能：by_jcw
        if (MjClient.MaxPlayerNum == 2) {
            addClub_BackHallBtn(true, [[68/1280, 0], [0.9649, 0.26], [0, 0]], [[68/1280*0.88, 0], [0.9649, 0.26], [0, 0]]);
        }
        else if (true) {
            addClub_BackHallBtn(true, [[68/1280, 0], [0.05, 0.36], [0, 0]], [[68/1280*0.88, 0], [0.1, 0.36], [0, 0]]);
        }

        if (this.isHasTrust()) {
            //托管层
            this.trustLayer = new TrustLayer_ziPai();
            this.addChild(this.trustLayer);
            this.trustLayer.visible = false;
        }

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


PlayLayer_YongZhouLaoChuo.prototype.isHasTrust = function() {
    return MjClient.data.sData.tData.areaSelectMode.trustTime > 0;
};

PlayLayer_YongZhouLaoChuo.prototype.isCoinField = function() {
    return MjClient.data.sData.tData.fieldId;
};

PlayLayer_YongZhouLaoChuo.prototype.cannotOutCardGrey = function()
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

PlayLayer_YongZhouLaoChuo.prototype.recoverCannotOutCard = function()
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

PlayLayer_YongZhouLaoChuo.prototype.clockNumberUpdate = function(node, endFunc)
{
    //取消闹钟声音
    // return arrowbkNumberUpdate(node, endFunc);
}

PlayLayer_YongZhouLaoChuo.prototype.updateClockPosition = function(arrowNode)
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

PlayLayer_YongZhouLaoChuo.prototype.showAndHideHeadEffect = function(){
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
PlayLayer_YongZhouLaoChuo.prototype.getGameInfoString = function(param)
{
    var tData = MjClient.data.sData.tData;
    var str = "";

    str += ([MjClient.MaxPlayerNum] + "人场,");
    var chuoInfo = ["14戳,","15戳,"];
    if(MjClient.MaxPlayerNum == 4){
        chuoInfo = ["11戳,","15戳,"];
    }

    str += ["曲戳,","定戳,"][tData.areaSelectMode.chuoType];
    str += chuoInfo[tData.areaSelectMode.chuoNum];
    str += tData.areaSelectMode.isJianHongJiaFen ? "见红加分," : "";
    str += tData.areaSelectMode.isQiHuErFen ? "起胡2分," : "";
    str += tData.areaSelectMode.isHongChuoSiFan ? "红戳4番," : "";
    str += tData.areaSelectMode.isFanChuo ? "番戳," : "";

    if(tData.areaSelectMode.trustTime > 0)
    {
        str += Math.floor(tData.areaSelectMode.trustTime/60) + "分钟,";
    } 

    if(/*tData.areaSelectMode.isTrustWhole*/ tData.areaSelectMode.trustTime > 0 && tData.areaSelectMode.trustWay >= 0)
    {
        str += ["托管当局,", "托管当局+下一局,", "整场托管,"][tData.areaSelectMode.trustWay] || "";
    } 

    if (tData.areaSelectMode.jieSuanDiFen){
        str += "底分" + tData.areaSelectMode.jieSuanDiFen;
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

PlayLayer_YongZhouLaoChuo.prototype.shwoFlyCardAnim = function(flyNode)
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

PlayLayer_YongZhouLaoChuo.prototype.showHandCardBeiMian = function()
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

PlayLayer_YongZhouLaoChuo.prototype.hideHandCardBeiMian = function()
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

PlayLayer_YongZhouLaoChuo.prototype.getSelfEatFlag = function() {
    var sData = MjClient.data.sData;
    var pl = sData.players[SelfUid() + ""];

    return pl.eatFlag;
};

PlayLayer_YongZhouLaoChuo.prototype.addPlayerHeadItemInfo = function(node, off) {
    if(off >= MjClient.MaxPlayerNum || MjClient.playui.isAddInfo[off]){
        return;
    }

    MjClient.playui.isAddInfo[off] = true;

    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var players = sData.players;

    var playerCount = Object.keys(players).length;

    var uids = tData.uids;
    var selfIndex = tData.uids.indexOf(SelfUid());
    
    node.visible = true
    var head = node.getChildByName("head");
    head.visible = true;

    var zhuang = head.getChildByName("zhuang");
    if(selfIndex == tData.zhuang){
        zhuang.visible = true;
        zhuang.zIndex = 100;
    }else{
        zhuang.visible = false;
    }

    var nameLabel = head.getChildByName("name");
    nameLabel.ignoreContentAdaptWithSize(true);

    var pl = getUIPlayer_YongZhouLaoChuo(off);
    var _nameStr = unescape(pl.info.nickname ) + "";
    nameLabel.setString(getNewName (_nameStr));
    nameLabel.setFontName("Arial");
    nameLabel.setFontSize(nameLabel.getFontSize());

    nameLabel.setColor(cc.color(243,243,109));

    addWxHeadToEndUI_yongZhouLaoChuo(head, off);
},

PlayLayer_YongZhouLaoChuo.prototype.setItemChuoZiInfo = function(node, off) {

    if(off >= MjClient.MaxPlayerNum){
        return;
    }
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var players = sData.players;
    var pl = getUIPlayer_YongZhouLaoChuo(off);

    MjClient.playui.addPlayerHeadItemInfo(node, off);

    var cardNode = node.getChildByName("cards");
    var startPos = cardNode.getPosition();
    var index = 0;

    child = node.children;
    child = child.filter(function(node) {
        return node.isCardItem;
    });

    for(var i = child.length - 1; i >= 0 ; i--){
        var _cd = child[i].removeFromParent(true);
        child[i] = null;
    }

    cc.log("++++++setItemChuoZiInfo=======", off , JSON.stringify(pl.chuoCards))
    var copyCards = pl.chuoCards.concat();//[[6,6],[10], [3,3,3,1,1], [6,6,6,6],[5,5,5,25,25,25],[7,8,9]]//
    var col = 0;
    
    for(var i = 0; i < copyCards.length; i++){
        var _groups = copyCards[i];

        var gap = 5;
        
        var row = 0;
        for(var j = 0; j < _groups.length; j++){

            var value = _groups[j];

            if(j > 0 && j%3 == 0){
                col++;
                row = 0;
                gap = 0;
            }

            
            var cloneCard = cardNode.clone();
            cloneCard.visible = true;
            cloneCard.loadTexture("playing/paohuzi/out" + value +".png");
            var nScale = cloneCard.getScale();
            var cardPos = cc.p(0, 0);
            cardPos = cc.p(startPos.x + cloneCard.width*(col) + gap, startPos.y + cloneCard.height*(row)*nScale);
            cloneCard.setPosition(cardPos);
            cloneCard.isCardItem  = true;
            node.addChild(cloneCard);
            index++;

            row++;
        }
        
        col++
    }
};


PlayLayer_YongZhouLaoChuo.prototype.setChuoNum = function(node, off){ 
    if(off >= MjClient.MaxPlayerNum){
        return;
    }

    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var players = sData.players;
    var pl = getUIPlayer_YongZhouLaoChuo(off);

    var tState = MjClient.data.sData.tData.tState;
    

    if(pl && pl.chuoCards && pl.chuoCards.length > 0 && ( tState != TableState.roundFinish) ){
        var chuoCount = 0;
        for(var i = 0; i < pl.chuoCards.length; i++){
            chuoCount += pl.chuoCards[i].length;
        }
        node.setString(chuoCount + "戳")
    }else{
        node.setString("")
    }

};

PlayLayer_YongZhouLaoChuo.prototype.delayExeUpdata = function(node, off){
    if(off >= MjClient.MaxPlayerNum){
        return;
    }

    if(node && node.throwList){
        var _node = node;

        var sData = MjClient.data.sData;
        var tData = sData.tData;
        
        var curInTrust =false;
        if(tData.curStartPlayer >= 0 ){
            var curUid = tData.uids[tData.curPlayer];
            curInTrust = MjClient.playui.isInTrust(curUid);
        }

        //cc.log("======delayExeUpdata====5555=",off, getPlayerIndex(off), tData.lastPutPlayer, tData.curPlayer)
        if(tData.lastPutPlayer >= 0 && (getPlayerIndex(off) == tData.curPlayer)){
            _node.throwList.showCardIcon();
        }
        

        function delayExe()
        {
            _node.throwList.hideCards();
        }


        _node.runAction(cc.sequence(cc.DelayTime((MjClient.rePlayVideo == -1 && !MjClient.playui.isInTrust(SelfUid()) && 
            !curInTrust) ? 1 : 0.01), 
            cc.callFunc(delayExe)));
        
    }
};

PlayLayer_YongZhouLaoChuo.prototype.reSetRoundData = function(){
    var sData = MjClient.data.sData;
    var pls = sData.players;

    cc.log("=============reSetRoundData=============")

    for (var uid in pls) {
        pi = pls[uid];
       // pi.chuoCards = [];
    }
}

// 托管标志
PlayLayer_YongZhouLaoChuo.prototype.checkTrustFlagVisible = function(node, off) {

    var pl = getUIPlayer_YongZhouLaoChuo(off);
    if (!pl) {
        return;
    }

    var tData = MjClient.data.sData.tData;
    node.visible = !!pl.trust;
    if (this.trustLayer && off == 0) {
        this.trustLayer.visible = false;
        if (!pl || !pl.trust) {
            return;
        }
        var isShow = false;
        if (tData.tState != TableState.roundFinish) {
            isShow = true;
        } else {
            // roundEnd时  整场托管 && 非回放
            if (tData.areaSelectMode.isTrustWhole && MjClient.rePlayVideo == -1) {
                isShow = true;
            }

            if( (!tData.areaSelectMode.isTrustWhole) && MjClient.rePlayVideo == -1){
                //当局托管完后理应服务器下发cancel;
                // MjClient.gamenet.request("pkroom.handler.tableMsg", {
                //     cmd: "cancelTrust"
                // });
            }
        }
        if (isShow) {
            this.trustLayer.visible = true;
            // if(MjClient.movingCard_paohuzi && cc.sys.isObjectValid(MjClient.movingCard_paohuzi)){
            //     MjClient.movingCard_paohuzi.removeFromParent(true);
            //     MjClient.movingCard_paohuzi = null;
            //     delete MjClient.moveCard;
            //     MjClient.playui.refreshHandCard(0);
            // }

        }
    }
};

PlayLayer_YongZhouLaoChuo.prototype.checkTrustCountDownVisible = function(node, off) {

    node.setString("");
    node.unscheduleAllCallbacks();
    if (!this.isInPlay() || MjClient.rePlayVideo != -1) {
        return;
    }
    if (this.isCurPlayer(off)) {
        node.visible = true;
        var time = util.Timer.getCountdownByTime(MjClient.data.sData.tData.trustEnd);
        if (time > 0) {
            node.schedule(function() {
                var time = util.Timer.getCountdownByTime(MjClient.data.sData.tData.trustEnd);
                this.setString("" + time);
                if (time <= 0) {
                    this.setString("");
                    this.unscheduleAllCallbacks();
                }
            }, 1);
        }
    }
};

PlayLayer_YongZhouLaoChuo.prototype.isCurPlayer = function(off) {
    return getPlayerIndex(off) == MjClient.data.sData.tData.curPlayer;
};

PlayLayer_YongZhouLaoChuo.prototype.isInPlay = function() {
    var tData = MjClient.data.sData.tData;
    if (tData.tState == TableState.waitCard || tData.tState == TableState.waitPut || tData.tState == TableState.waitEat) {
        return true;
    }

    return false;
};

PlayLayer_YongZhouLaoChuo.prototype.isInTrust = function(uid) {
    return MjClient.data.sData.players[uid].trust && MjClient.data.sData.tData.areaSelectMode.trustTime > 0
};


 //系统自动发牌
PlayLayer_YongZhouLaoChuo.prototype.shuffleCutCards = function(){

    var cb = function(){
        reallyPlayEffect("sound/shuffler/faPai.mp3",false);
        
        for(var i = 0; i < MjClient.MaxPlayerNum; i++){
            var node = getNode_cards(i);
            if(i == 0){
                this._showDealHandCardsEffect(node);
            }else{
                this._showDealHandCardsEffectOther(node);
            }
            
        }
    }.bind(this);

    cb();
};

 //其他玩家的手牌发牌效果
PlayLayer_YongZhouLaoChuo.prototype._showDealHandCardsEffectOther = function(posNode){
    var len = 5;
    var cNodeList = [];
    var winSize = MjClient.size;
    var p = this.convertToNodeSpace(cc.p(winSize.width * 0.5, winSize.height * 0.8));
    for(var i = 0; i < len; i++){
        var cNode = new MoveShadowSprite("playing/ziPaiCut/normalBG.png");
        this.addChild(cNode);
        setWgtLayout(cNode,[cNode.width / 1280,0],[0.5,0.6],[0,0]);
        cNode.y = p.y;
        cNode.x = p.x;
        cNode.visible = false;
        cNodeList.push(cNode);
    }

    var idx = 0;
    var allT = 0.5;
    var t = 0.03;
    var moveEffect = function(){
        try {
            if(idx >= cNodeList.length){
                this.unschedule(moveEffect);
                return;
            }
            var cNode = cNodeList[idx];
            var wP = posNode.getParent().convertToWorldSpace(posNode.getChildByName("head").getPosition());
            var endP =  this.convertToNodeSpace(wP);
            var gapX = 50;
            if(endP.x > cNode.x){
                endP.x -= gapX;
            }else{
                endP.x += gapX;
            }

            cNode.visible = true;
            cNode.setOpacity(100 - idx * 2);
            cNode.setCascadeOpacityEnabled(true);
            var dt = allT - t * idx;
            var ac1 = cc.moveTo( dt,endP);
            var ac2 = cc.scaleTo(dt, 0.1);
            var cB = cc.callFunc(function(){
                this.removeFromParent(true);
            }.bind(cNode));
            cNode.runAction(cc.sequence(cc.spawn([ac1, ac2]), cB));
            idx += 1;
        } catch (e) {
            for(var i = 0; i < cNodeList.length; i++) {
                var cNode = cNodeList[i];
                if(cNode && cc.sys.isObjectValid(cNode)) {
                    cNode.removeFromParent(true);
                }
            }
            this.unschedule(moveEffect);
        }
        
    }

    this.schedule(moveEffect, t);
};

    //是否显示手牌
PlayLayer_YongZhouLaoChuo.prototype._showOrHideHandCards = function(isShow){


    var children = MjClient.playui._downNode.cardList.getChildren();
    children.sort(function(c1, c2){
        return  c1.y - c2.y ;
    });

    for(var i = 0; i < children.length; i++){
        
        card = children[i];
        dt = i * 0.005;
        card.runAction(cc.sequence(cc.delayTime(dt),cc.fadeIn(0.001))); 
    }
};


PlayLayer_YongZhouLaoChuo.prototype._copyHandCards = function(posNode) {
    var layout_handCards = posNode.getChildByName("layout_handCards");
    var layout_handCards_temp = posNode.getChildByName("layout_handCards_temp");
    
    var pl = getUIPlayer_YongZhouLaoChuo(0);
    if (!pl || true) {
        return;
    }
    var cardArr = pl.mjhand.concat() || [];

    for(var i = 0; i < cardArr.length; i++){
        var addNode = layout_handCards.getChildByTag(i);
        if(!addNode) continue;
        var node = new cc.Node();
        node.width = addNode.width;
        node.x = addNode.x;
        node.y = addNode.y;
        node.tag = addNode.tag;
        layout_handCards_temp.addChild(node);

        var children = addNode.getChildren();
        for(var j = 0; j < children.length; j++){
            var cNode = children[j];
            if(!cNode.clone){
                //胡息节点（cc.sprite);
                continue;
            }
            var tempC = cNode.clone();
            var src = MjClient.playui.getCardSrc("hand", tempC.tag, false);
            tempC.setTouchEnabled(false);
            MjClient.playui.loadCardTexture(tempC, src, MjClient.playui.getResType());
            node.addChild(tempC);
        }
    }
};

    //自己的手牌发牌效果
PlayLayer_YongZhouLaoChuo.prototype._showDealHandCardsEffect = function(posNode){
    this._copyHandCards(posNode);
    var layout_handCards = posNode.cardList;//.getChildByName("layout_handCards_temp");
    var pl = getUIPlayer_YongZhouLaoChuo(0);
    if (!pl) {
        return;
    }
    var cardArr = pl.mjhand.concat();//MjClient.HandCardArr;

    var cNodeList = [];
    for(var i = 0; i < cardArr.length; i++){
        var addNode = layout_handCards.getChildByTag(i);
        if(!addNode) continue;

        addNode.setOpacity(0);
        //var children = addNode.getChildren();
        cNodeList = cNodeList.concat(cNodeList/*addNode.getChildren()*/);
        // for(var j = 0; j < children.length; j++){
        //     var cNode = children[j];
        //     cNode.setOpacity(0);
        // }
    }
    cNodeList.sort(function(c1, c2){
        return c1.y - c2.y;
    });



    var idx = 0;
    var self = this;
    var moveEffect = function(){
        var cNode = cNodeList[idx];
        if(idx >= cNodeList.length || !cNode || !cc.sys.isObjectValid(cNode)){
            this.unschedule(moveEffect);
            
            self._showOrHideHandCards(true);
            return;
        }
        
        try {
            var endP = cNode.getPosition();
            var winSize = MjClient.size;
            var p = cNode.getParent().convertToNodeSpace(cc.p(winSize.width * 0.5, winSize.height * 0.8));
            cNode.y = p.y;
            cNode.x = p.x;
            cNode.setOpacity(0);
            cNode.setCascadeOpacityEnabled(true);
            var ac = cc.moveTo(0.15,endP);
            var ac1 = cc.fadeIn(0.15);
            cNode.runAction(cc.spawn([ac, ac1]));
            idx += 1;
        } catch (e) {
            cc.log(e);
            MjClient.playui.refreshHandCard(0);
            self.unschedule(moveEffect);
            self._showOrHideHandCards(true);
        }
        
    }

    this.schedule(moveEffect, 0.02); //
};


// 庄
PlayLayer_YongZhouLaoChuo.prototype.checkZhuangVisible = function(node, off) {
    var tData = MjClient.data.sData.tData;
    node.visible = false;
    if (off >= MjClient.MaxPlayerNum) {
        return;
    }

    var pl = getUIPlayer_YongZhouLaoChuo(off);
    if (!pl) {
        return;
    }

    if (tData.uids[tData.zhuang] == pl.info.uid) {
        node.loadTexture("playing/ziPaiBanner/zhuang.png");
        node.visible = true;
        node.setAnchorPoint(0, 0);
        node.setPosition(0, 0)
    }
};

PlayLayer_YongZhouLaoChuo.prototype.checkRankState = function(node, uiOff, isRoundEnd){

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


