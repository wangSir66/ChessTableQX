var actionZindex = 1000;
MjClient.KEY_DIAN_TUO_SHOW_CARDS_NUM = "KEY_DIAN_TUO_SHOW_CARDS_NUM";
function getUIPlayer_dianTuo(off) {
 

    var sData = MjClient.data.sData;
    if(!sData) return; // 因为游戏结束的时候，这个值没有了，处理一下
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

function GetReadyVisible_diantuo(node, index)
{
    if(index < 0)
    {
        node.visible = false;
        return false;
    }
    var tData = MjClient.data.sData.tData;

    var indexId =  tData.uids[index];
    var pl = MjClient.data.sData.players[indexId]; //getUIPlayer(off);
    if(!pl) return;
    
    var isCanShow = true;
    if(tData.tState == TableState.waitReady) {
        var isFull =  Object.keys(MjClient.data.sData.players).length == tData.maxPlayer;
        if(!isFull) isCanShow = false;
    }
   
    if(pl && pl.mjState == TableState.isReady && tData.tState != TableState.waitJoin && isCanShow)
    {
        //已经准备好了，并且状态不是等待，ready 设置可见
        node.visible = true;
        //p0.isTing = false;
        cc.log("visible = ",true);
    }
    else
    {
        node.visible = false;
        cc.log("visible = ",false);
    }

    return node.visible;
}

// 限制获取装备函数的调用情况（只有三人的允许调用 新增.三副牌也调用）
function limit_GetReadyVisible(node,off){
    if(MjClient.MaxPlayerNum == 3 || MjClient.data.sData.tData.areaSelectMode.isSanFuPai){
        GetReadyVisible(node, off); 
    }else{
        GetReadyVisible(node, -1); 
    }
}

function loaderHeadImage_dianTuo(node, pl,reset){
    var WxHead = node.getChildByName("WxHead");
    var name = node.getChildByName("name");
    var ready = node.getChildByName("ready");
    name.setVisible(true);
    // 
    // name.ignoreContentAdaptWithSize(true);
    name.setString(""); 
    if(reset && WxHead ){
        WxHead.removeFromParent(true);
        ready.setVisible(false);
        return;
    }
    if(!pl) return;

    
    var url = pl.info.headimgurl || "png/default_headpic.png";
    cc.log(" url ================= ",url);  

    var tData = MjClient.data.sData.tData;
    var mode = tData.areaSelectMode;
    if(mode.isBuDaGang && pl.info.uid != SelfUid() && MjClient.rePlayVideo == -1) {
        name.setString("玩家" + (tData.uids.indexOf(pl.info.uid) + 1));
        url = "png/default.png";
    }else {
        name.setString(unescape(pl.info.nickname));
    }

    cc.loader.loadImg(url, {isCrossOrigin: true}, function(err, texture) {
        if (!err && texture) {
            if (WxHead) {
                WxHead.removeFromParent(true);
            }
            cc.log("----------------111111111111111  = ",url);
            //缓存头像
            //postEvent( "QueueNetMsg",["loadWxHead",{uid:pl.info.uid,img:texture}]);
            //使用新的事件循环机制
            MjClient.Scene.pushQueueNetMsg(["loadWxHead", { uid: pl.info.uid, img: texture }]);

            var sp = new cc.Sprite(texture);
            sp.setName("WxHead");
            node.addChild(sp); 

            sp.setScale(node.width / (sp.width * 1.2));
            sp.setPosition(cc.p(node.width / 2,node.height *0.55));

           

            // setWgtLayout(sp, [node.width / sp.width, node.height / sp.height], [0.5, 0.5], [0, 0], false, true);
        }
    });
}


function showVoiceEffect(node,type,num){
    var sData = MjClient.data.sData;
    if(!sData) return; // 因为游戏结束的时候，这个值没有了，处理一下
    var tData = sData.tData;
    node.stopAllActions();
    
    if(!tData.realtimeVoice) return;

    var text = "可开启实时语音";
    if(type == 2){
        text = "已开启实时语音";//num + "人在语音房间";
    }else if(type == 3){
        text = "已关闭实时语音";
    } 
    // 默认跑一遍动画
    var itemTxt = node.getChildByName("content");
    var itemMgs = node.getChildByName("msgBg");
    itemTxt.visible = true;
    itemMgs.visible = true; 
    itemTxt.setString(text);
    itemTxt.ignoreContentAdaptWithSize(true);
    var seq = cc.sequence(cc.delayTime(3),cc.callFunc(function(){
        itemTxt.visible = false;
        itemMgs.visible = false;
    }))
    node.runAction(seq);
}

function setShowKingData(isClose){
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var kingNode = MjClient.playui._kingCardNode;
    if(tData.tState != TableState.waitPut &&
        tData.tState != TableState.waitEat &&
        tData.tState != TableState.waitCard)   {
        if(kingNode)
            kingNode.removeAllChildren();
        return;
    }    

    
    if(isClose || tData.isFirstSingleCard != 1)
        kingNode.removeAllChildren();
    // var kingData = {1000109:[516,516,517],1000110:[],1000111:[517],1000112:[516,516,517,517,517]};
    if(!tData.kingList) {
        kingNode.removeAllChildren()
        return;
    }

    var kingList = tData.kingList;
    var kingData = {};

    for (var i = 0; i < kingList.length; i++) {
        kingData[tData.uids[i]] = kingList[i];
    } 
    
    var posArr = [ [0.5,0.55],[0.2,0.75],[0.7,0.92],[0.8,0.75] ];
    if(MjClient.MaxPlayerNum == 3){
        posArr = [ [0.5,0.55],[0.2,0.75],[0.8,0.75] ];  
    }
    
    // 在kingnode上添加王， 
    cc.log("json = ",JSON.stringify(kingData));  
    for (var index in kingData) {
        var curPlayerIndex = (tData.uids.indexOf( SelfUid() ) + MjClient.MaxPlayerNum - tData.uids.indexOf( parseInt(index)  )) % MjClient.MaxPlayerNum;
        
        var cardList = kingData[index];
        // if(curPlayerIndex == 0) continue; // 自己的不显示 
        for (var i = 0; i < cardList.length; i++) {
            var imgKing = new ccui.ImageView("playing/diantuo/cards/" + cardList[i] + ".png" ); 
            kingNode.addChild(imgKing);
            //设置位置
            var x = posArr[curPlayerIndex][0] + ( (30 * i) / MjClient.playui.width );
            if(curPlayerIndex == 3){
                x = posArr[curPlayerIndex][0] - ( (30 * i) / MjClient.playui.width );
                imgKing.setLocalZOrder(cardList.length - i);
            }

            var y = posArr[curPlayerIndex][1];
            setWgtLayout(imgKing,[0.15,0.15],[x, y],[0, 0]);
        } 

    }   


}

function loadtWXHeadAndName(node,pl){

    var tData = MjClient.data.sData.tData;
    var mode = tData.areaSelectMode;
    var name = node.getChildByName("name");
    name.setVisible(true);
    name.ignoreContentAdaptWithSize(true);
    name.setString("");
    var url = pl.info.headimgurl || "png/default_headpic.png";
    if(mode.isBuDaGang && pl.info.uid != SelfUid() && MjClient.rePlayVideo == -1) {
        name.setString("玩家" + (tData.uids.indexOf(pl.info.uid) + 1));
        url = "png/default.png";
    }else {
        name.setString(unescape(pl.info.nickname));
    }

    cc.loader.loadImg(url, {isCrossOrigin: true}, function(err, texture) {
    if (!err && texture) { 
            //缓存头像 
            //使用新的事件循环机制
            var head_bg = node.getChildByName("head_bg");

            var sp = new cc.Sprite(texture);
            sp.setName("WxHead");
            head_bg.addChild(sp); 

            sp.setScale(head_bg.width / (sp.width * 1.2));
            sp.setPosition(cc.p(head_bg.width / 2,head_bg.height *0.55));

            
            // setWgtLayout(sp, [node.width / sp.width, node.height / sp.height], [0.5, 0.5], [0, 0], false, true);
        }
    });

}

function setHeadImg_dianTuo(node, off) {
    var pl = getUIPlayer_dianTuo(off);
    var head = node.getChildByName("head");
    var nobody = head.getChildByName("nobody");
    var WxHead = nobody.getChildByName("WxHead");
    if (pl) {
        var url = pl.info.headimgurl || "png/default_headpic.png";
        var mode = MjClient.data.sData.tData.areaSelectMode;
        if(mode.isBuDaGang && pl.info.uid != SelfUid() && MjClient.rePlayVideo == -1) {
            url = "png/default.png";
        }
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
function SetUserVisible_dianTuo(node, off) {
    var pl = getUIPlayer_dianTuo(off);
    var head = node.getChildByName("head");
    var name = head.getChildByName("name");
    var nobody = head.getChildByName("nobody"); 
    var offline = head.getChildByName("offline");
    var name_bg = head.getChildByName("name_bg");

    var score_bg = head.getChildByName("score_bg");
    var chi_score = head.getChildByName("chi_score");
    var zhua_bg = head.getChildByName("zhua_bg");
    var zhua_label = zhua_bg.getChildByName("zhua_label");

    var xi_score = head.getChildByName("xi_score");


    var databg = head.getChildByName("databg");
    

    var sData = MjClient.data.sData;
    var tData = sData.tData; 
    if(tData.areaSelectMode.isBombScore || tData.areaSelectMode.isRedBlackScore){
        zhua_label.loadTexture("playing/diantuo/xifen.png");
    }


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
    //         src = off % 2 == 0 ? "daZhaDan/duiYou.png" : "daZhaDan/duiYou.png";
    //     } else {

    //         cc.log("#####pl:" + JSON.stringify(pl));
    //         src = pl.teamid == "A" ? "daZhaDan/duiYou.png" : "daZhaDan/duiYou.png";
    //     }
    //     cc.log(off);
    //     cc.log(src);
    //     zu.loadTexture(src);
    // }

    //随机分组时 分组阶段不显示头像(新增.3副牌无分组)
    if((tData.tState == TableState.waitJoin || tData.tState == TableState.waitReady) && 
        tData.maxPlayer == 4 && !tData.areaSelectMode.isSanFuPai){
        head.visible = false;
    }else{
        head.visible = true;
    }

    if (pl) {
        name.visible = true; 
        offline.visible = true; 

        score_bg.visible = true;
        chi_score.visible = true;
        zhua_bg.visible = true;
        zhua_label.visible = true;
        if(databg){
            databg.visible = true;
        }
        
        xi_score.visible = true;
        // name_bg.visible = true;
        // score_bg.visible = true;

        // MjClient.loadWxHead(pl.info.uid, pl.info.headimgurl);
        setHeadImg_dianTuo(node, off);
        setUserOffline_dianTuo(node, off);
        InitUserHandUI_dianTuo(node, off);
    } else {
        name.visible = false; 
        offline.visible = false; 
        score_bg.visible = false;
        chi_score.visible = false;
        zhua_bg.visible = false;
        zhua_label.visible = false;
        if(databg){
           databg.visible = false; 
        }
        
        xi_score.visible = false;


        var WxHead = nobody.getChildByName("WxHead");
        if (WxHead)
            WxHead.removeFromParent(true);
    }
}

function updateZuInfo_dianTuo(node, off) {
    // 分组信息
    // var sData = MjClient.data.sData;
    // var tData = sData.tData;
    // var head = node.getChildByName("head");
    // var zu = head.getChildByName("zu");
    // if (tData.maxPlayer != 4 || !tData.areaSelectMode.isDivideTeam) {
    //     zu.visible = false;
    // } else {
    //     return;
    //     zu.visible = true;
    //     var src = "";
    //     if ((tData.tState == TableState.waitJoin || tData.tState == TableState.waitReady)) {
    //         src = off % 2 == 0 ? "daZhaDan/duiYou.png" : "daZhaDan/duiYou.png";
    //     } else {
    //         src = pl.teamid == "A" ? "daZhaDan/duiYou.png" : "daZhaDan/duiYou.png";
    //     }
    //     zu.loadTexture(src);
    // }
}

// 4人分组时候更新对应位置玩家信息
function updateHeadInfo_dianTuo(node, off) {
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    // 4人选择分组阶段
    if (!((tData.tState == TableState.waitJoin || tData.tState == TableState.waitReady) && (tData.maxPlayer == 4 && tData.areaSelectMode.isDivideTeam))) {
        return;
    }

    var pl = getUIPlayer_dianTuo(off);
    var head = node.getChildByName("head");
    var name = head.getChildByName("name");
    var nobody = head.getChildByName("nobody"); 
    var offline = head.getChildByName("offline");
    var name_bg = head.getChildByName("name_bg");
    if (pl) {
        name.visible = true; 
        offline.visible = true; 

        setHeadImg_dianTuo(node, off);
        InitUserCoinAndName_dianTuo(node, off);
    } else {
        name.visible = false; 
        offline.visible = false; 
        var WxHead = nobody.getChildByName("WxHead");
        if (WxHead)
            WxHead.removeFromParent(true);
    }
}

function InitUserHandUI_dianTuo(node, off) {
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var pl = getUIPlayer_dianTuo(off);

    if (!pl) {
        return;
    }

    // node.setVisible(true);

    // cc.log("tData.tState = ",tData.tState);
    // if(tData.tState === TableState.waitJoin || tData.tState === TableState.waitReady){
    //     node.setVisible(false); 
    // }else{
    //     node.setVisible(true); 
    // }
    // if(off == 0)
    //     node.setVisible(true); 

    //初始化玩家金币和名称
    InitUserCoinAndName_dianTuo(node, off);
    setAreaTypeInfo(true);
    currentLeftCardCount_dianTuo(off);

    // initSortUI();

    if (
        tData.tState != TableState.waitPut &&
        tData.tState != TableState.waitEat &&
        tData.tState != TableState.waitCard &&
        tData.tState != TableState.waitJiazhu
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
            copyArr = MjClient.majiang.sortCard(copyArr, MjClient.majiang.sortType);
            cc.log("copyArr:", copyArr);
            var cardNumArr = MjClient.majiang.getOneTypeCardNum(copyArr);
            cc.log("cardNumArr:",JSON.stringify(cardNumArr) );
            for (var i = 0; i < copyArr.length; i++) {
                var info = new dianTuo.CardInfo();
                info.type = copyArr[i];
                // 存一下数量
                var index = copyArr[i] % 100 + "";
                index += "";
                // cc.log("cardNumArr[index ] = ",cardNumArr[index + "" ]);
                // info.numText = 8;
                // if(cardNumArr[index ]){
                //     info.numText = cardNumArr[index];
                //     cardNumArr[index] = 0;
                // }
                arr.push(info);
            }

            initCardList_dianTuo();

            var cardList = node.cardList;
            cardList.addCards(arr, false, cardNumArr);
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
            copyArr = MjClient.majiang.sortCard(copyArr, MjClient.majiang.sortType);
            var cardNumArr = MjClient.majiang.getOneTypeCardNum(copyArr);
            cc.log("copyArr:", copyArr);

            for (var i = 0; i < copyArr.length; i++) {
                var info = new dianTuo.CardInfo();
                info.type = copyArr[i];
                // 存一下数量
                if(cardNumArr[copyArr[i] % 100]){
                    info.numText = cardNumArr[copyArr[i] % 100];
                    cardNumArr[copyArr[i] % 100] = 0;
                }

                arr.push(info);
            }

            initCardList_dianTuo();

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

function showPaiMianFen_dianTuo(node, data){
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

function showJiFen3Ren_dianTuo(node, sData, len){
    if(MjClient.data.sData.tData.areaSelectMode.isDivideTeam || MjClient.data.sData.tData.areaSelectMode.isRandomTeam){
        return;
    }

    len = len === undefined ? 3 : len;

    var oldXiFenList = [];
    for(var i = 0; i < len; i++){;
        var name = node.getChildByName("name_" + i);
        name.ignoreContentAdaptWithSize(true);
        var lsjf = node.getChildByName("lsjf_" + i);
        lsjf.ignoreContentAdaptWithSize(true);
        var bjdf = node.getChildByName("bjdf_" + i);
        bjdf.ignoreContentAdaptWithSize(true);
        var zxf = node.getChildByName("zxf_" + i);
        zxf.ignoreContentAdaptWithSize(true);

        var num = parseInt(zxf.getString());
        num = num ? num : 0;
        oldXiFenList.push(num);
        name.setString("");
        lsjf.setString("");
        bjdf.setString("");
        zxf.setString("");
        if(bjdf._oldP){
            bjdf.setPosition(bjdf._oldP);
            bjdf.setTextColor(cc.color(34,234,156));
        }
        if(zxf._oldP){
            zxf.setPosition(zxf._oldP);
            zxf.setTextColor(cc.color(34,234,156));
        }
    }

    var plList = sData.players;
    var i = 0;
    for(var n in plList){
        var pl = plList[n];
        var name = node.getChildByName("name_" + i);
        if(!name){
            break;
        }
        name.ignoreContentAdaptWithSize(true);
        var lsjf = node.getChildByName("lsjf_" + i);
        lsjf.ignoreContentAdaptWithSize(true);
        var bjdf = node.getChildByName("bjdf_" + i);
        bjdf.ignoreContentAdaptWithSize(true);
        var zxf = node.getChildByName("zxf_" + i);
        zxf.ignoreContentAdaptWithSize(true);

        cc.log("showJiFen3Ren_dianTuo:" + JSON.stringify(pl));
        name.setString(sliceStrByLen(unescape(pl.info.nickname), 4));
        lsjf.setString(pl.winall);
        bjdf.setString(pl.score_draw);
        cc.log("bjdf:", pl.score_draw);
        zxf.setString(pl.score_spclType);

        //文本动画
        if(pl.inc > 0){
            playScoreEffect_dianTuo(bjdf);
        }
        if(pl.score_spclType > oldXiFenList[i]){
            playScoreEffect_dianTuo(zxf);
        }

        if(bjdf._oldP){
            bjdf.setPosition(bjdf._oldP);
            bjdf.setTextColor(cc.color(34,234,156));
        }
        if(zxf._oldP){
            zxf.setPosition(zxf._oldP);
            zxf.setTextColor(cc.color(34,234,156));
        }

        i++
    }
}

function showJiFen4Ren_dianTuo(node, sData){

    var teams = sData.teams;

    var oldXiFenList = {};
    var obj = {"A":{}, "B":{}}
    for(var tid in obj){
        var lsjf = node.getChildByName("lsjf_" + tid);
        lsjf.ignoreContentAdaptWithSize(true);
        var bjdf = node.getChildByName("bjdf_" + tid);
        bjdf.ignoreContentAdaptWithSize(true);
        var zxf = node.getChildByName("zxf_" + tid);
        zxf.ignoreContentAdaptWithSize(true);

        var num = parseInt(zxf.getString());
        num = num ? num : 0;
        oldXiFenList[tid] = num;
        lsjf.setString("0");
        bjdf.setString("0");
        zxf.setString("0");
    }

    for(var tid in teams){
        var team = teams[tid];

        var lsjf = node.getChildByName("lsjf_" + tid);
        lsjf.ignoreContentAdaptWithSize(true);
        var bjdf = node.getChildByName("bjdf_" + tid);
        bjdf.ignoreContentAdaptWithSize(true);
        var zxf = node.getChildByName("zxf_" + tid);

        lsjf.setString(team.winall);
        bjdf.setString(team.score_draw);
        zxf.setString(team.score_spclType);

        //文本动画
        if(team.inc > 0){
            playScoreEffect_dianTuo(bjdf);
        }
        if(team.score_spclType > oldXiFenList[tid]){
            playScoreEffect_dianTuo(zxf);
        }
    }
}

//小局结算后清空本地数据
function clearJiFen_dianTuo(){
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

// 显示报里面的文本
function showBaoText(type){
    if(MjClient.rePlayVideo !== -1){
        return
    }
    //MjClient.playui
    var sData = MjClient.data.sData;
    var tData = sData.tData; 

    var playDianTuoText = ccs.load("PlayDianTuoText.json").node;
    MjClient.playui.addChild(playDianTuoText,999);
    playDianTuoText.setPosition(cc.p(MjClient.size.width / 2,MjClient.size.height/2)); 

    var back = playDianTuoText.getChildByName("back"); 

    setWgtLayout(back,[back.width/1280, back.height/720],[0,0],[0, 0]);

    var close = back.getChildByName("close");
    close.addClickEventListener(function(){ 
        playDianTuoText.removeFromParent(true);
    });

    var cnText = ["你方便出吗？","你打还是我打？","打他不？","可以接不？","我来要，你别管","你接，我不要了","不好打就让他们打","快点出牌啊，我快睡着了","你有小王吗？","你有大王吗？","你要什么？","你打什么？","你通了吗？","我打5炸","我打6炸","我打掂坨","我打正掂坨","不好意思，接电话去了","我有","没有","可以","不可以","打他","算下分","我打花牌","我打分牌、","我打炸弹","我要单牌","我要对子","我要三带","我要连对","我要飞机","我要顺子","我通了，你随意","我需要你空接我","你按自己的牌出"];
    // cc.log(JSON.stringify(cnText));
    var btn_item = back.getChildByName("btn_item");
    var x= 0 ;var y = 0;
    for (var i = 0; i < cnText.length; i++) {
        var name = cnText[i];
        var cloneBtn =  btn_item;
        if(i != 0){
            cloneBtn = btn_item.clone();
            back.addChild(cloneBtn); 
        } 
        cloneBtn.setTag(i);
       
        var yu = ( i % 4); var floor = Math.floor(i / 4);  var des = 20;
        cloneBtn.x = back.width * 0.16 + (cloneBtn.width* yu + (des * yu)); 
        cloneBtn.y = (back.height * 0.91 - ( floor * cloneBtn.height) - (des * floor));
        cloneBtn.setTitleText(name);

        cloneBtn.addClickEventListener(function(sender,type){  

            MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Duihua_wenziyuyin", {uid: SelfUid()}); 
            MjClient.gamenet.request("pkroom.handler.tableMsg", {
                cmd: "MJChat",
                uid: SelfUid(),
                type: 1,
                msg: {text:cnText[sender.getTag() ]  , voiceType:1},
                num: (sender.getTag() + 99)
            });

            playDianTuoText.removeFromParent(true);
        }, cloneBtn); 

      


    }

   
}


// 报分和已得分 type 来区分
function showScoreTable(type){
    if(MjClient.rePlayVideo !== -1){
        return
    }

    //MjClient.playui
    var sData = MjClient.data.sData;
    var tData = sData.tData; 

    var PlayDianTuoScore = ccs.load("PlayDianTuoScore.json").node;
    MjClient.playui.addChild(PlayDianTuoScore,999);
    PlayDianTuoScore.setPosition(cc.p(MjClient.size.width / 2,MjClient.size.height/2));
    // PlayDianTuoScore.x = 0;
    // PlayDianTuoScore.y = 0;

    var back = PlayDianTuoScore.getChildByName("back"); 

    var title = back.getChildByName("title"); 
    title.loadTexture("playing/diantuo/" +(type == 1 ? "score_title_1" : "score_title_2")  +  ".png"); 

    var close = back.getChildByName("close");
    close.addClickEventListener(function(){ 
        PlayDianTuoScore.removeFromParent(true);
    });

    setWgtLayout(back,[back.width/1280, back.height/720],[0,0],[0, 0]);

    var item = back.getChildByName("item");
    for (var i = 0; i < MjClient.MaxPlayerNum; i++) {
        var index =  tData.uids[i];
        if(!index) continue; 

        var cloneItem = item.clone();
        back.addChild(cloneItem);
        cloneItem.y -= i * (cloneItem.height * 1.1);
   

        
        var pl = sData.players[index]; //getUIPlayer_diantuo(i);
        if(!pl) return;
        loadtWXHeadAndName(cloneItem,pl);
        var tempData = tData.baoFenCards;
        if(type == 2){
            tempData = tData.yiDeFenCards;
        }
        // 

        if(tempData){
            if(!tempData[i]) continue;
            // 初始化牌分 
            for (var d = 0; d < tempData[i].length; d++) {
                var cardData = tempData[i][d];

                // 初始化玩家信息  
                var cardItem = cloneItem.getChildByName("cards");
                if(d != 0){
                    cardItem = cardItem.clone();
                    cardItem.x += (cardItem.width * cardItem.getScale()  ) * d;
                    cloneItem.addChild(cardItem);
                }
                cardItem.setVisible(true);
                cardItem.loadTexture("playing/niushibie/miniCardPic/" + cardData + ".png");
            }  
        }
        
    }
    item.visible = false;
}


var PlayLayer_dianTuo = cc.Layer.extend({
    _btnPutCard:null,
    jsBind: {
        _event: {
            PKBaoFen: function(){
                showScoreTable(1);
            },
            mjhand: function() {
                if(cc.sys.isObjectValid(MjClient.endoneui)/*MjClient.endoneui != null*/)
                {
                    cc.log("=======mjhand====endoneui====" + typeof (MjClient.endoneui) );
                    MjClient.endoneui.removeFromParent(true);
                    MjClient.endoneui = null;
                } else {
                    MjClient.endoneui = null;
                }

                var sData = MjClient.data.sData;
                var tData = sData.tData;
                // resetFlowerNum(this);
                // resetJiaZhuNum(this);
                this.getChildByName("roundScore_img").setVisible(true);
                this.getChildByName("tableScore").setVisible(true);
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

                

                clearJiFen_dianTuo();

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
                    currentLeftCardCount_dianTuo(i);
                }

                //回放的时候
                if(MjClient.rePlayVideo != -1)
                {
                    tData.uids = msg.uids;//要更新uid位置
                    resetPlayerHead_dianTuo();
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
                            resetPlayerHead_dianTuo();
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
                // 退出语音房间
                if(MjClient.native.yayaVoice){
                    MjClient.native.yayaVoice.leaveRoom();
                }

                MjClient.addHomeView();
                MjClient.playui.removeFromParent(true);
                delete MjClient.playui;
                delete MjClient.endoneui;
                delete MjClient.endallui;
                cc.audioEngine.stopAllEffects();
                playMusic("bgMain");

                
            },
            endRoom: function(msg) {
                // 退出语音房间
                if(MjClient.native.yayaVoice){
                    MjClient.native.yayaVoice.leaveRoom();
                }
                setShowKingData(true);
                mylog(JSON.stringify(msg));
                if (msg.showEnd) this.addChild(new GameOverLayer_dianTuo(),500);
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
                        var layer = new GameOverLayer_dianTuo();
                        // layer.setVisible(false);
                        self.addChild(layer);
                    }
                    postEvent("clearRankIcon_dianTuo", {}); //只为了清除排名标记
                    self.addChild(new EndOneView_dianTuo(), 500);
                    clearJiFen_dianTuo();
                }
                this.runAction(cc.sequence(cc.DelayTime(1),cc.callFunc(delayExe)));

                //clearJiFen_dianTuo();
                setShowKingData(true);
                this.getChildByName("roundScore_img").setVisible(false);
                this.getChildByName("tableScore").setVisible(false);

                MjClient.playui.showAndHideHeadEffect();
            },
            moveHead: function() {
                postEvent("returnPlayerLayer");
                tableStartHeadMoveAction_dianTuo(this);
            },
            initSceneData: function() {
                reConectHeadLayout_dianTuo(this);
                CheckRoomUiDelete();
                var sData = MjClient.data.sData;
                var tData = sData.tData;
                if(tData.tState == TableState.waitPut )
                {
                    UpdataCurrentPutCard_dianTuo();
                }

                for(var i = 0;i < MjClient.MaxPlayerNum;i++)
                {
                    currentLeftCardCount_dianTuo(i);
                }

                tableStartHeadMoveAction_paohuzi(this);   //不涉及到头像移动动作
                var data = [[0.25, 0.25], [0.5, 0.72], [0, 0]];
                //checkCanShowDistance(data);

                if(MjClient.data.sData.tData.tState <= TableState.waitReady)
                { 

                }else{
                    this.getChildByName("roundScore_img").setVisible(true);
                    this.getChildByName("tableScore").setVisible(true);

                }
                // 重连 或者第一次进入，都需要赋初值
                MjClient.native.yayaVoice._isOpenVoice = false;
                // this.addChild(new GameOverLayer_dianTuo());
                setShowKingData();
                MjClient.playui.showAndHideHeadEffect();
            },
            onlinePlayer: function() {
                reConectHeadLayout_dianTuo(this);
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
                    currentLeftCardCount_dianTuo(i);
                }
                setShowKingData();
                MjClient.playui.showAndHideHeadEffect();
            },
            PKPass:function(eD)
            {
                setShowKingData(); 
            },
            waitPut: function(){
                MjClient.playui.showAndHideHeadEffect();
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
            _run:function()
            {
                this.loadTexture(GameBg[MjClient.gameType]);
                setWgtLayout(this,[0.12, 0.06],[0.5, 0.68],[0, 0]);
            }
        },
        roundScore_img:{
            _run: function(){
                this.visible = false;
                setWgtLayout(this,[this.width/1280, this.height/720],[0.47, 0.59],[0, 0]);
            }
        },
        tableScore: {
            _run: function(){
                this.visible = false;
                setWgtLayout(this,[this.width/1280, this.height/720],[0.54, 0.59],[0, 0]);
                this.setString("0");
                this.ignoreContentAdaptWithSize(true);
            },
            _event:{
                PKPut:function(ed){ 
                    this.setString(ed.table_score); 
                },
                initSceneData:function(){
                    var tData = MjClient.data.sData.tData;
                    this.setString(tData.score_draw || 0); 
                },
                TZScore: function(){
                    this.setString(0); 
                }
            }

        },
        roundInfo:{
            _run:function()
            {
                setWgtLayout(this,[0.12, 0.12],[0.5, 0.52],[0, 0]);

                var tData = MjClient.data.sData.tData;
                var str = MjClient.playui.getGameInfoString("roundInfo");
                this.setString(str);
                this.ignoreContentAdaptWithSize(true);

                if(tData.matchId && tData.matchInfo){
                    if(MjClient.matchRank){
                        showPlayUI_matchInfo("排名："+MjClient.matchRank+"/"+tData.matchInfo.userCount+"\n前"+tData.matchInfo.jingjiCount+"名晋级");
                    }else {
                        showPlayUI_matchInfo("排名："+tData.matchInfo.userCount+"/"+tData.matchInfo.userCount+"\n前"+tData.matchInfo.jingjiCount+"名晋级");
                    }
                }
            },
            _event:{
                mjhand:function()
                {
                    var tData = MjClient.data.sData.tData;
                    var str = MjClient.playui.getGameInfoString("roundInfo");
                    this.setString(str);
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
                
            },
            // tongji : {
            //     _run: function() {
            //         this.ourSide = this.getChildByName("ourSide");
            //         // this.otherSide = this.getChildByName("otherSide");
            //         this.ourSide.setString("0");
            //         // this.otherSide.setString("0");
            //     },
            //     _event:{
            //         mjhand:function()
            //         {
                        
            //         },
            //         initSceneData:function()
            //         {
                        
            //         }
            //     }
            // }
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
                        var tData = MjClient.data.sData.tData;
                        if (tData.tState == TableState.waitPut || 
                            tData.tState == TableState.waitJiazhu)
                        {
                            MjClient.clockNode.visible = true;
                            this.setString("00");
                            MjClient.playui.updateClockPosition(MjClient.clockNode);
                        }
                    },
                    waitJiazhu: function(){
                        this.stopAllActions();
                        MjClient.clockNode.visible = true;
                        if(playTimeUpEff){
                            stopEffect(playTimeUpEff);
                        }
                        MjClient.playui.clockNumberUpdate(this);
                        MjClient.playui.updateClockPosition(MjClient.clockNode);
                    },
                    waitPut: function() {
                        this.stopAllActions();
                        MjClient.clockNode.visible = true;
                        if(playTimeUpEff){
                            stopEffect(playTimeUpEff);
                        }
                        MjClient.playui.clockNumberUpdate(this);
                        MjClient.playui.updateClockPosition(MjClient.clockNode);
                    },
                    PKPut: function(msg) {
                        if (msg.uid == SelfUid()) {
                            this.stopAllActions();
                            if(playTimeUpEff){
                                stopEffect(playTimeUpEff);
                            }
                            playTimeUpEff = null;
                            //MjClient.playui.clockNumberUpdate(this);
                            this.setString("00");
                        }
                    },
                    roundEnd: function() {
                        this.stopAllActions();
                        if(playTimeUpEff){
                            stopEffect(playTimeUpEff);
                        }
                        playTimeUpEff = null;
                        
                    },
                    onlinePlayer: function() {
                        // MjClient.clockNode.visible = false;
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
                    var str1 = "掂坨,"
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
                _layout: [[0.2, 0.2],[0.5, 0.5],[0, -0.5]],
                _click: function() {
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
                    getPlayingRoomInfo(2);
                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Yaoqingweixinhaoyou", {uid:SelfUid(), gameType:MjClient.gameType});

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

                    var tData = MjClient.data.sData.tData;
                    if(tData.maxPlayer == 4 && !tData.areaSelectMode.isSanFuPai){
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
                setWgtLayout(this, [0.18, 0.18], [0.5, 0.35], [0, 0]);
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
                // var cardList = new dianTuo.CardListLayer();
                // this.addChild(cardList);
                // setWgtLayout(cardList, [1, 0], [0, 0], [0, 0]);
                // this.cardList = cardList;

                // var throwList = new dianTuo.CardThrowListLayer();
                // this.addChild(throwList);
                // this.throwList = throwList;
                // setWgtLayout(throwList, [0.4, 0], [0.45, 0.4], [0, 0]);
            },
            bottomMenu:{
                _layout: [[1280/1280, 0], [0.5, 0.04], [0, 0]],
                btn_liPai : {
                    _click : function(){
                        console.log("li pai ...");
                        if(MjClient.playui._downNode.cardList){
                            MjClient.playui._downNode.cardList.doLiPai();
                        }
                    }
                },
                btn_510K : {
                    _click : function(){
                        // console.log("510K ...");
                        var tData = MjClient.data.sData.tData;
                        var pl = getUIPlayer_dianTuo(0);
                        var card =  MjClient.majiang.getWuShiKCardsList(pl.mjhand); 
                        if((tData.lastPutCardType || 0)  >= 8){
                            return; // wushik打不过
                        }    
                            
                        var isOk = false; // 是否找到过
                        function test(){
                            var index = MjClient.majiang.getWuShikIndex(card.length);
                            var cardTable = card[index];  
                            if(!cardTable && !isOk)
                                return false;  
                            var lastCards = tData.lastPutCard;
                            if(lastCards == -1)
                                lastCards = null;
                            
                            if(MjClient.majiang.isBigger(tData.areaSelectMode, pl.mjhand.length, cardTable.cards,lastCards || [1])){
                                isOk = true;
                                return cardTable;
                            }else{
                                if(!card[index + 1]){
                                    if(!isOk)
                                        return false; // 找不到大的 
                                    MjClient.majiang.getWuShikIndex(card.length,true);
                                    cardTable = card[0];
                                }
                                return test();
                            }  
                        }
                        var logdata = test();  
                        if(!logdata) return;

                        MjClient.playui._downNode.cardList.showListCard(logdata.cards);
                    }
                },
                btn_zhaDan : {
                    _click : function(){
                        
                        // MjClient.Scene.addChild(new dianTuoFenPaiLayer());
                        var tData = MjClient.data.sData.tData;
                        var pl = getUIPlayer_dianTuo(0);
                        var card =  MjClient.majiang.getZhaCardsList(pl.mjhand, tData.areaSelectMode); 
                        var isOk = false; // 是否找到过
                        function test(){
                            var index = MjClient.majiang.getBoomIndex(card.length);
                            var cardTable = card[index];  
                            if(!cardTable && !isOk)
                                return false;    
                            var lastCards = tData.lastPutCard;
                            if(lastCards == -1)
                                lastCards = null;

                            if(MjClient.majiang.isBigger(tData.areaSelectMode, pl.mjhand.length, cardTable.cards,lastCards || [1])){
                                isOk = true;
                                return cardTable;
                            }else{
                                if(!card[index + 1]){
                                    if(!isOk)
                                        return false; // 找不到大的 
                                    MjClient.majiang.getBoomIndex(card.length,true);
                                    cardTable = card[0];
                                }
                                return test();
                            }  
                        }
                        var logdata = test();
                        if(!logdata) return;

                        MjClient.playui._downNode.cardList.showListCard(logdata.cards);
                        


                        // if(tData.lastPutCardType )
                    }
                },
                gps_btn:{
                    _click:function(){
                        // cc.log("touch gps");
                        if (MjClient.MaxPlayerNum == 3) {
                            MjClient.Scene.addChild(new showDistance3PlayerLayer());
                        } else if (MjClient.MaxPlayerNum == 4) {
                            MjClient.Scene.addChild(new showDistanceLayer());
                        }
                        MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Dingwei", {uid: SelfUid(),gameType:MjClient.gameType});
                    }
                },
                setting:{
                    _click:function(){
                        // cc.log("touch setting");
                        var settringLayer = new DianTuoSetting();
                        settringLayer.setName("PlayLayerClick");
                        MjClient.Scene.addChild(settringLayer);
                        MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Shezhi", {uid:SelfUid(),gameType:MjClient.gameType});
                    }
                },
                img_num:{
                    _run:function() {
                        this.setVisible(true);
                        this.setTouchEnabled(true);
                        var bShow = util.localStorageEncrypt.getBoolItem(MjClient.KEY_DIAN_TUO_SHOW_CARDS_NUM, true);
                        var path = bShow ? "playing/diantuo/num_s.png" : "playing/diantuo/num_n.png";
                        this.loadTexture(path);
                    },
                    _click:function(node, eT) {
                        var bShow = util.localStorageEncrypt.getBoolItem(MjClient.KEY_DIAN_TUO_SHOW_CARDS_NUM, true);
                        if(bShow) {
                            node.loadTexture("playing/diantuo/num_n.png")
                        }else {
                            node.loadTexture("playing/diantuo/num_s.png");
                        }
                        //显隐数量状态
                        postEvent(MjClient.KEY_DIAN_TUO_SHOW_CARDS_NUM, {state:!bShow});
                        util.localStorageEncrypt.setBoolItem(MjClient.KEY_DIAN_TUO_SHOW_CARDS_NUM, !bShow);
                    }
                },
            },
            head: { 
                // 吃分
                chi_score:{   
                    _run: function(){
                        this.setString("0");
                        this.ignoreContentAdaptWithSize(true);
                    },
                    _event:{
                        mjhand:function(){
                            this.setString("0");
                        },
                        initSceneData:function(){
                            var pl = getUIPlayer_dianTuo(0);
                            if(!pl) return; 
                            
                            this.setString(pl.score_draw); 
                        },
                        TZScore: function(){
                            var pl = getUIPlayer_dianTuo(0);
                            if(!pl) return; 
                            this.setString(pl.score_draw); 
                        },
                        roundEnd: function(){
                            var pl = getUIPlayer_dianTuo(0);
                            if(!pl) return; 
                            this.setString(0); 
                        }
                    }
                },
                xi_score:{
                    _run: function(){
                        this.setString("0");
                        this.ignoreContentAdaptWithSize(true);
                    },
                    _event:{
                        initSceneData:function(){
                            var tData = MjClient.data.sData.tData;
                            var pl = getUIPlayer_dianTuo(0);
                            if(!pl) return; 
                            var score = 0;
                            if(tData.areaSelectMode.isBombScore || tData.areaSelectMode.isRedBlackScore){
                                 // 显示喜分 
                                score = pl.score_xi;
                            }else{ // 显示总分 
                                score = pl.t_score_draw;
                            }  
                            this.setString(score || 0); 
                        },
                        TZScore: function(){
                            var tData = MjClient.data.sData.tData;
                            var pl = getUIPlayer_dianTuo(0);
                            if(!pl) return; 
                            var score = 0;
                            if(tData.areaSelectMode.isBombScore || tData.areaSelectMode.isRedBlackScore){
                                 // 显示喜分 
                                score = pl.score_xi;
                            }else{ // 显示总分 
                                score = pl.t_score_draw;
                            }  
                            this.setString(score); 
                        },
                        PKPut: function(){
                            var tData = MjClient.data.sData.tData;
                            var pl = getUIPlayer_dianTuo(0);
                            if(!pl) return; 
                            // 没有喜分就返回
                            if(!(tData.areaSelectMode.isBombScore || tData.areaSelectMode.isRedBlackScore)) return; 
                            this.setString(pl.score_xi); 
                        },
                        roundEnd: function(){
                            var tData = MjClient.data.sData.tData;
                            var pl = getUIPlayer_dianTuo(0);
                            if(!pl) return; 
                            var score = 0;
                            if(tData.areaSelectMode.isBombScore || tData.areaSelectMode.isRedBlackScore){
                                 // 显示喜分  
                                this.setString(0); 
                            }else{ // 显示总分  
                                this.setString(pl.t_score_draw); 
                            }  
                            
                        }
                    }
                },
                zu: {
                    _run : function(){
                        this.visible = false;
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
                        var tempNode = MjClient.playui._chatBgLayout;
                        // tempNode.scale = this.getParent().getScale();
                        this.getParent().zIndex = 600;
                        var clone = this.clone();
                        clone.setTag(0); 
                        
                        tempNode.addChild(clone);
                        var pos = this.getParent().convertToWorldSpace(clone.getPosition());
                        clone.setPosition(pos);

                    },
                    chattext: {
                        _event: {

                            MJChat: function(msg) {
                                var tempNode = MjClient.playui._chatBgLayout;
                                var tempThis = tempNode.getChildByTag(0).getChildByName("chattext");
                                if(msg.type == 0 || msg.type == 1){
                                    showUserChat(tempThis, 0, msg); // 文本消息层级提高
                                }else{
                                    showUserChat(this, 0, msg);
                                }
                            },
                            playVoice: function(voicePath) {
                                MjClient.data._tempMessage.msg = voicePath;
                                showUserChat(this, 0, MjClient.data._tempMessage);
                            }
                        }
                    }
                },
                _click: function(btn) { // todo
                    showPlayerInfo_dianTuo(0, btn);
                },
                _event: {
                    loadWxHead: function(d) {
                        // setWxHead(this, d, 0);
                    },
                    addPlayer: function() {
                        // showFangzhuTagIcon_dianTuo(this,0);
                    },
                    removePlayer: function() {
                        // showFangzhuTagIcon_dianTuo(this,0);
                    },
                    initSceneData : function(){
                        // showFangzhuTagIcon_dianTuo(this,0);
                    },
                    mjhand : function(){
                        // showFangzhuTagIcon_dianTuo(this,0);
                    }
                },
                _run: function () {
                    //this.zIndex = 600;
                    // showFangzhuTagIcon_dianTuo(this,0);
                    var mode = MjClient.data.sData.tData.areaSelectMode;
                    this.setTouchEnabled(!mode.isBuDaGang);
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
                        clearRankIcon_dianTuo : function(){
                            this.visible = false;
                        }
                    }
                },
                duzhan_item : {
                    _run : function(){
                        this.visible = false;
                    },
                    _event : {
                        mjhand: function(){
                            // this.visible = false;
                        },
                        initSceneData: function(eD)
                        {   
                            var tData = MjClient.data.sData.tData;
                            var pl = getUIPlayer_dianTuo(0);
                            if(!pl) return;
                            this.setVisible(tData.duZhanPlayer == pl.info.uid);  
                            
                        }, 
                        duZhanSelectRet: function(ed){
                            var pl = getUIPlayer_dianTuo(0);
                            if(!pl) return;
                            this.setVisible(ed.duZhanPlayer == pl.info.uid); 
                        },
                        roundEnd : function(){
                            // this.setVisible(false);
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
                    limit_GetReadyVisible(this, -1);
                    //this.visible = true;
                },
                _event: {
                    initSceneData: function(){
                        limit_GetReadyVisible(this, -1);
                    },
                    moveHead: function() {
                        limit_GetReadyVisible(this, -1);
                    },
                    addPlayer: function() {
                        limit_GetReadyVisible(this, 0);//根据状态设置ready 是否可见 add by sking
                    },
                    removePlayer: function() {
                        limit_GetReadyVisible(this, 0);
                    },
                    onlinePlayer: function() {
                        cc.log("============online player=======1063======");
                        limit_GetReadyVisible(this, 0);
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
                        DealPKPass_dianTuo(UIoff);
                        var playType =["putong/","fangyan/"][getCurrentVoiceType()];
                        var url = "diantuo/" + playType + "nv/pass";
                        var pl = MjClient.data.sData.players[eD.uid];
                        playEffect(url, false, pl.info.sex);
                      }
                  }
                },
                _visible: false
            },
            _event: {
                clearCardUI: function() {
                    clearCardUI_dianTuo(this, 0);
                },
                initSceneData: function(eD) {
                    SetUserVisible_dianTuo(this, 0);
                    reConnectShowDeskCard_dianTuo();
                    var pl = getUIPlayer_dianTuo(0);
                    if(pl.mjhand && pl.mjhand.length <= 0 && pl.teamerHand && this.cardList){
                        this.cardList.showTeamHand(true, pl.teamerHand);
                    }
                },
                addPlayer: function(eD) {
                    SetUserVisible_dianTuo(this, 0);
                },
                removePlayer: function(eD) {
                    SetUserVisible_dianTuo(this, 0);
                },
                TZJoinTeam: function() {
                    updateHeadInfo_dianTuo(this, 0);
                    updateZuInfo_dianTuo(this, 0);
                },
                mjhand: function(eD) {
                    if(this.cardList){
                        this.cardList.showTeamHand(false);
                    }
                    
                    InitUserHandUI_dianTuo(this, 0);

                    SetUserVisible_dianTuo(this, 0);
                },
                roundEnd: function() {
                    this.cardList.showTeamHand(false);
                    InitUserCoinAndName_dianTuo(this, 0);
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
                            this.throwList.hideCards();
                        }
                        DealMJPut_dianTuo(this,eD, 0);
                    }

                    var pl = getUIPlayer_dianTuo(0);
                    if(pl.mjhand.length <= 0 && pl.teamerHand){
                        this.cardList.showTeamHand(true, pl.teamerHand);
                    }
                    
                },

                ZDTeamerHand : function(){
                    var pl = getUIPlayer_dianTuo(0);
                    this.cardList.showTeamHand(true, pl.teamerHand);
                },

                PKPut_dianTuo : function(eD){
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

                    UpdataCurrentPutCard_dianTuo();
                    DealWaitPut_dianTuo(this, eD, 0);

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
                    setUserOffline_dianTuo(this, 0);
                },
                playerStatusChange: function(eD) {
                    setUserOffline_dianTuo(this, 0);
                },
                TZScore: function(msg){
                    InitUserCoinAndName_dianTuo(this, 0);

                    MjClient.playui.checkScoreState(this, 0);
                }

            }
        },
        right: {
            head: { 
                                // 吃分
                chi_score:{   
                    _run: function(){
                        this.setString("0");
                        this.ignoreContentAdaptWithSize(true);
                    },
                    _event:{
                        mjhand:function(){
                            this.setString("0");
                        },
                        initSceneData:function(){
                            var pl = getUIPlayer_dianTuo(1);
                            if(!pl) return; 
                            
                            this.setString(pl.score_draw); 
                        },
                        TZScore: function(){
                            var pl = getUIPlayer_dianTuo(1);
                            if(!pl) return; 
                            this.setString(pl.score_draw); 
                        },
                        roundEnd: function(){
                            var pl = getUIPlayer_dianTuo(1);
                            if(!pl) return; 
                            this.setString(0); 
                        }
                    }
                },
                xi_score:{
                    _run: function(){
                        this.setString("0");
                        this.ignoreContentAdaptWithSize(true);
                    },
                    _event:{
                        initSceneData:function(){
                            var tData = MjClient.data.sData.tData;
                            var pl = getUIPlayer_dianTuo(1);
                            if(!pl) return; 
                            var score = 0;
                            if(tData.areaSelectMode.isBombScore || tData.areaSelectMode.isRedBlackScore){
                                 // 显示喜分 
                                score = pl.score_xi;
                            }else{ // 显示总分 
                                score = pl.t_score_draw;
                            }  
                            this.setString(score || 0); 
                        },
                        TZScore: function(){
                            var tData = MjClient.data.sData.tData;
                            var pl = getUIPlayer_dianTuo(1);
                            if(!pl) return; 
                            var score = 0;
                            if(tData.areaSelectMode.isBombScore || tData.areaSelectMode.isRedBlackScore){
                                 // 显示喜分 
                                score = pl.score_xi;
                            }else{ // 显示总分 
                                score = pl.t_score_draw;
                            }  
                            this.setString(score); 
                        },
                        PKPut: function(){
                            var tData = MjClient.data.sData.tData;
                            var pl = getUIPlayer_dianTuo(1);
                            if(!pl) return; 
                            // 没有喜分就返回
                            if(!(tData.areaSelectMode.isBombScore || tData.areaSelectMode.isRedBlackScore)) return; 
                            this.setString(pl.score_xi); 
                        },
                        roundEnd: function(){
                            var tData = MjClient.data.sData.tData;
                            var pl = getUIPlayer_dianTuo(1);
                            if(!pl) return; 
                            var score = 0;
                            if(tData.areaSelectMode.isBombScore || tData.areaSelectMode.isRedBlackScore){
                                 // 显示喜分  
                                this.setString(1); 
                            }else{ // 显示总分  
                                this.setString(pl.t_score_draw); 
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
                        var clone = this.clone();
                        clone.setTag(1);
                        var tempNode = MjClient.playui._chatBgLayout;
                        tempNode.addChild(clone);
                        var pos = this.getParent().convertToWorldSpace(clone.getPosition());
                        clone.setPosition(pos);
                    },
                    chattext: {
                        _event: {

                           MJChat: function(msg) {
                                var tempNode = MjClient.playui._chatBgLayout;
                                var tempThis = tempNode.getChildByTag(1).getChildByName("chattext");
                                if(msg.type == 0 || msg.type == 1){
                                    showUserChat(tempThis, 1, msg); // 文本消息层级提高
                                }else{
                                    showUserChat(this, 1, msg);
                                }
                            },
                            playVoice: function(voicePath) {
                                MjClient.data._tempMessage.msg = voicePath;
                                showUserChat(this, 1, MjClient.data._tempMessage);
                            }
                        }
                    }
                },
                _click: function(btn) {
                    showPlayerInfo_dianTuo(1, btn);
                },
                _event: {
                    loadWxHead: function(d) {
                        // setWxHead(this, d, 1);
                    },
                    addPlayer: function() {
                        // showFangzhuTagIcon_dianTuo(this, 1);
                    },
                    removePlayer: function() {
                        // showFangzhuTagIcon_dianTuo(this, 1);
                    },
                    initSceneData : function(){
                        // showFangzhuTagIcon_dianTuo(this,1);
                    },
                    mjhand : function(){
                        // showFangzhuTagIcon_dianTuo(this,1);
                    }
                },
                _run: function () {
                    // this.zIndex = 600;
                    // showFangzhuTagIcon_dianTuo(this,1);
                    var mode = MjClient.data.sData.tData.areaSelectMode;
                    this.setTouchEnabled(!mode.isBuDaGang);
                },
                name_bg:{_visible:false},
                tingCard:{
                    _visible:false,
                    Text_count:{
                        _run:function(){
                            this.ignoreContentAdaptWithSize(true);
                        }
                    },
                    _event:{
                        mjhand: function(){
                            this.setVisible(true);
                        },
                        initSceneData: function(eD)
                        {
                            var pl = getUIPlayer_dianTuo(1);
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
                        clearRankIcon_dianTuo : function(){
                            this.visible = false;
                        }
                    }
                },
                voice_icon:{
                    _visible: false,
                    _event : {
                        EventRoomUsers: function(eD){
                             // 首次加入计算一遍
                            if(MjClient.native.yayaVoice._isOpenVoice){
                                // 判断这个uid
                                this.visible = true;
                                var pl = getUIPlayer_dianTuo(1);
                                if(!pl) return;
                                this.loadTexture("playing/paodekuaiTable_new/closeYaya.png");
                                for (var i = 0; i < eD.uids.length; i++) {
                                    if(pl.info.uid == eD.uids[i]){
                                        this.loadTexture("playing/paodekuaiTable_new/openYaya.png");
                                    }
                                }
                            }
                        },
                        EventJoinRoom: function(eD){
                            var pl = getUIPlayer_dianTuo(1);
                            if(!pl) return;
                            if(pl.info.uid == eD.uid)
                                this.loadTexture("playing/paodekuaiTable_new/openYaya.png");
                        },
                        EventLeaveRoom: function(eD){
                            var pl = getUIPlayer_dianTuo(1);
                            if(!pl) return;
                            if(pl.info.uid == eD.uid)
                                this.loadTexture("playing/paodekuaiTable_new/closeYaya.png");
                            if(eD.uid == SelfUid())
                                this.visible = false;
                        }
                    }
                },
                duzhan_item : {
                    _run : function(){
                        this.visible = false;
                    },
                    _event : {
                        mjhand: function(){
                            // this.visible = false;
                        },
                        initSceneData: function(eD)
                        {   
                            var tData = MjClient.data.sData.tData;
                            var pl = getUIPlayer_dianTuo(1);
                            if(!pl) return;
                            this.setVisible(tData.duZhanPlayer == pl.info.uid);  
                            
                        }, 
                        duZhanSelectRet: function(ed){
                            var pl = getUIPlayer_dianTuo(1);
                            if(!pl) return;
                            this.setVisible(ed.duZhanPlayer == pl.info.uid); 
                        },
                        roundEnd : function(){
                            // this.setVisible(false);
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
                    limit_GetReadyVisible(this, -1);
                },
                _event: {
                    initSceneData: function(){
                        limit_GetReadyVisible(this, 1);
                    },
                    moveHead: function() {
                        limit_GetReadyVisible(this, -1);
                    },
                    addPlayer: function() {
                        limit_GetReadyVisible(this, 1);
                    },
                    removePlayer: function() {
                        limit_GetReadyVisible(this, 1);
                    },
                    onlinePlayer: function() {
                        limit_GetReadyVisible(this, 1);
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
                            DealPKPass_dianTuo(UIoff);
                            var playType =["putong/","fangyan/"][getCurrentVoiceType()];
                            var url = "diantuo/" + playType + "nv/pass";
                            var pl = MjClient.data.sData.players[eD.uid];
                            playEffect(url, false, pl.info.sex);
                        }
                    }
                },
                _visible: false
            },
            _event: {
                clearCardUI: function() {
                    clearCardUI_dianTuo(this, 1);
                },
                initSceneData: function(eD) {
                    SetUserVisible_dianTuo(this, 1);
                    // MjClient.playui.checkScoreState(this, 1);
                },
                addPlayer: function(eD) {
                    SetUserVisible_dianTuo(this, 1);
                },
                removePlayer: function(eD) {
                    SetUserVisible_dianTuo(this, 1);
                },
                TZJoinTeam: function() {
                    updateHeadInfo_dianTuo(this, 1);
                    updateZuInfo_dianTuo(this, 1);

                },
                mjhand: function(eD) {
                    InitUserHandUI_dianTuo(this, 1);

                    SetUserVisible_dianTuo(this, 1);
                },
                roundEnd: function() {
                    InitUserCoinAndName_dianTuo(this, 1);
                    // this.cardList.removeFromParent();
                    // this.cardList = null;
                },
                waitPut: function(eD) {
                    DealWaitPut_dianTuo(this, eD, 1);
                },
                PKPut: function(eD) {
                    if(this.throwList){
                        this.throwList.hideCards();
                    }
                    DealMJPut_dianTuo(this, eD, 1);
                    if(eD.uid != SelfUid())
                    {

                    }
                },
                onlinePlayer: function(eD) {
                    setUserOffline_dianTuo(this, 1);
                },
                playerStatusChange: function(eD) {
                    setUserOffline_dianTuo(this, 1);
                },
                TZScore: function(msg){
                    InitUserCoinAndName_dianTuo(this, 1);

                    MjClient.playui.checkScoreState(this, 1);
                }
            }
        },
        top: {
            _run:function() {
                this.visible = MjClient.MaxPlayerNum >= 3;
            },
            head: {
                                // 吃分
                chi_score:{   
                    _run: function(){
                        this.setString("0");
                        this.ignoreContentAdaptWithSize(true);
                    },
                    _event:{
                        mjhand:function(){
                            this.setString("0");
                        },
                        initSceneData:function(){
                            var pl = getUIPlayer_dianTuo(2);
                            if(!pl) return; 
                            
                            this.setString(pl.score_draw); 
                        },
                        TZScore: function(){
                            var pl = getUIPlayer_dianTuo(2);
                            if(!pl) return; 
                            this.setString(pl.score_draw); 
                        },
                        roundEnd: function(){
                            var pl = getUIPlayer_dianTuo(2);
                            if(!pl) return; 
                            this.setString(0); 
                        }
                    }
                },
                xi_score:{
                    _run: function(){
                        this.setString("0");
                        this.ignoreContentAdaptWithSize(true);
                    },
                    _event:{
                        initSceneData:function(){
                            var tData = MjClient.data.sData.tData;
                            var pl = getUIPlayer_dianTuo(2);
                            if(!pl) return; 
                            var score = 0;
                            if(tData.areaSelectMode.isBombScore || tData.areaSelectMode.isRedBlackScore){
                                 // 显示喜分 
                                score = pl.score_xi;
                            }else{ // 显示总分 
                                score = pl.t_score_draw;
                            }  
                            this.setString(score || 0); 
                        },
                        TZScore: function(){
                            var tData = MjClient.data.sData.tData;
                            var pl = getUIPlayer_dianTuo(2);
                            if(!pl) return; 
                            var score = 0;
                            if(tData.areaSelectMode.isBombScore || tData.areaSelectMode.isRedBlackScore){
                                 // 显示喜分 
                                score = pl.score_xi;
                            }else{ // 显示总分 
                                score = pl.t_score_draw;
                            }  
                            this.setString(score); 
                        },
                        PKPut: function(){
                            var tData = MjClient.data.sData.tData;
                            var pl = getUIPlayer_dianTuo(2);
                            if(!pl) return; 
                            // 没有喜分就返回
                            if(!(tData.areaSelectMode.isBombScore || tData.areaSelectMode.isRedBlackScore)) return; 
                            this.setString(pl.score_xi); 
                        },
                        roundEnd: function(){
                            var tData = MjClient.data.sData.tData;
                            var pl = getUIPlayer_dianTuo(2);
                            if(!pl) return; 
                            var score = 0;
                            if(tData.areaSelectMode.isBombScore || tData.areaSelectMode.isRedBlackScore){
                                 // 显示喜分  
                                this.setString(2); 
                            }else{ // 显示总分  
                                this.setString(pl.t_score_draw); 
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
                        var clone = this.clone();
                        clone.setTag(2);
                        var tempNode = MjClient.playui._chatBgLayout;
                        tempNode.addChild(clone);
                        var pos = this.getParent().convertToWorldSpace(clone.getPosition());
                        clone.setPosition(pos);
                    },
                    chattext: {
                        _event: {

                            MJChat: function(msg) {
                                if(MjClient.data.sData.tData.maxPlayer < 3){
                                    return;
                                }
                                var tempNode = MjClient.playui._chatBgLayout;
                                var tempThis = tempNode.getChildByTag(2).getChildByName("chattext");
                                if(msg.type == 0 || msg.type == 1){
                                    showUserChat(tempThis, 2, msg); // 文本消息层级提高
                                }else{
                                    showUserChat(this, 2, msg);
                                }
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
                    showPlayerInfo_dianTuo(2, btn);
                },
                _event: {
                    loadWxHead: function(d) {
                        // setWxHead(this, d, 2);
                    },
                    addPlayer: function() {
                        // showFangzhuTagIcon_dianTuo(this, 2);
                    },
                    removePlayer: function() {
                        // showFangzhuTagIcon_dianTuo(this, 2);
                    },
                    initSceneData : function(){
                        // showFangzhuTagIcon_dianTuo(this,2);
                    },
                    mjhand : function(){
                        // showFangzhuTagIcon_dianTuo(this,2);
                    }
                },
                _run: function () {
                    // this.zIndex = 600;
                    // showFangzhuTagIcon_dianTuo(this,2);
                    var mode = MjClient.data.sData.tData.areaSelectMode;
                    this.setTouchEnabled(!mode.isBuDaGang);
                },
                name_bg:{_visible:false},
                tingCard:{
                    _visible:false,
                    Text_count:{
                        _run:function(){
                            this.ignoreContentAdaptWithSize(true);
                        }
                    },
                    _event:{
                        mjhand: function(){
                            this.setVisible(true);
                        },
                        initSceneData: function(eD)
                        {
                            var pl = getUIPlayer_dianTuo(2);
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
                        clearRankIcon_dianTuo : function(){
                            this.visible = false;
                        }
                    }
                },
                voice_icon:{
                    _visible: false,
                    _event : {
                        EventRoomUsers: function(eD){
                             // 首次加入计算一遍
                            if(MjClient.native.yayaVoice._isOpenVoice){
                                // 判断这个uid
                                this.visible = true;
                                var pl = getUIPlayer_dianTuo(2);
                                if(!pl) return;
                                this.loadTexture("playing/paodekuaiTable_new/closeYaya.png");
                                for (var i = 0; i < eD.uids.length; i++) {
                                    if(pl.info.uid == eD.uids[i]){
                                        this.loadTexture("playing/paodekuaiTable_new/openYaya.png");
                                    }
                                }
                            }
                        },
                        EventJoinRoom: function(eD){
                            var pl = getUIPlayer_dianTuo(2);
                            if(!pl) return;
                            if(pl.info.uid == eD.uid)
                                this.loadTexture("playing/paodekuaiTable_new/openYaya.png");
                        },
                        EventLeaveRoom: function(eD){
                            var pl = getUIPlayer_dianTuo(2);
                            if(!pl) return;
                            if(pl.info.uid == eD.uid)
                                this.loadTexture("playing/paodekuaiTable_new/closeYaya.png");
                            if(eD.uid == SelfUid())
                                this.visible = false;
                        }
                    }
                },
                duzhan_item : {
                    _run : function(){
                        this.visible = false;
                    },
                    _event : {
                        mjhand: function(){
                            // this.visible = false;
                        },
                        initSceneData: function(eD)
                        {   
                            var tData = MjClient.data.sData.tData;
                            var pl = getUIPlayer_dianTuo(2);
                            if(!pl) return; 
                            
                            if(tData.duZhanPlayer == -1 && tData.maxPlayer == 4 && !tData.areaSelectMode.isSanFuPai){
                                // 队友 
                                cc.log("ffffffffffffffffffff");
                                //roundFinish waitReady  
                                if((tData.tState > TableState.waitReady && tData.tState < TableState.roundFinish) 
                                    || tData.tState == TableState.waitJiazhu){
                                    this.setVisible(true);
                                    this.loadTexture("playing/diantuo/team_icon.png");
                                } 
                            }else{
                              this.setVisible(tData.duZhanPlayer == pl.info.uid);    
                            }

                            
                        }, 
                        duZhanSelectRet: function(ed){
                            var pl = getUIPlayer_dianTuo(2);
                            if(!pl) return;
                            if(ed.duZhanPlayer == -1){ 
                            }else{
                                this.loadTexture("playing/diantuo/duzhan.png");
                                this.setVisible(ed.duZhanPlayer == pl.info.uid);  
                            }
                            
                        },
                        roundEnd : function(){
                            // 还原内容
                            // this.setVisible(false);
                            // this.loadTexture("playing/diantuo/duzhan.png"); 
                        },
                        TZTeam : function(){
                            var tData = MjClient.data.sData.tData; 
                            var pl = getUIPlayer_dianTuo(2);
                            if(!pl || tData.duZhanPlayer != -1) return;    
                            this.setVisible(true);
                            this.loadTexture("playing/diantuo/team_icon.png"); 
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
                    var tData = MjClient.data.sData.tData;
                    if(tData.maxPlayer == 3){
                        setWgtLayout(this, [0.07, 0], [0.3, 0.65], [0,0]);
                    }else{
                        setWgtLayout(this, [0.06, 0], [0.5, 0.8], [0,0]);
                    }
                    
                    limit_GetReadyVisible(this, -1);
                },
                _event: {
                    initSceneData: function(){
                        limit_GetReadyVisible(this, 2);
                    },
                    moveHead: function() {
                        limit_GetReadyVisible(this, -1);
                    },
                    addPlayer: function() {
                        limit_GetReadyVisible(this, 2);
                    },
                    removePlayer: function() {
                        limit_GetReadyVisible(this, 2);
                    },
                    onlinePlayer: function() {
                        limit_GetReadyVisible(this, 2);
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
                            DealPKPass_dianTuo(UIoff);
                            var playType =["putong/","fangyan/"][getCurrentVoiceType()];
                            var url = "diantuo/" + playType + "nv/pass";
                            var pl = MjClient.data.sData.players[eD.uid];
                            playEffect(url, false, pl.info.sex);
                        }
                    }
                },
                _visible: false
            },
            _event: {
                clearCardUI: function() {
                    clearCardUI_dianTuo(this, 2);
                },
                initSceneData: function(eD) {
                    SetUserVisible_dianTuo(this, 2);
                },
                addPlayer: function(eD) {
                    SetUserVisible_dianTuo(this, 2);
                },
                removePlayer: function(eD) {
                    SetUserVisible_dianTuo(this, 2);
                },
                TZJoinTeam: function() {
                    updateHeadInfo_dianTuo(this, 2);
                    updateZuInfo_dianTuo(this, 2);

                },
                mjhand: function(eD) {
                    InitUserHandUI_dianTuo(this, 2);

                    SetUserVisible_dianTuo(this, 2);
                },
                roundEnd: function() {
                    InitUserCoinAndName_dianTuo(this, 2);
                    // this.cardList.removeFromParent();
                    // this.cardList = null;
                },
                waitPut: function(eD) {
                    DealWaitPut_dianTuo(this, eD, 2);
                },
                PKPut: function(eD) {
                    if(this.throwList){
                        this.throwList.hideCards();
                    }
                    DealMJPut_dianTuo(this, eD, 2);
                },
                onlinePlayer: function(eD) {
                    setUserOffline_dianTuo(this, 2);
                },
                playerStatusChange: function(eD) {
                    setUserOffline_dianTuo(this, 2);
                },
                MJFlower: function(eD) {
                    HandleMJFlower(this, eD, 2);
                },
                MJTing: function (eD) {
                    HandleMJTing(this, eD, 2);
                },
                TZScore: function(msg){
                    InitUserCoinAndName_dianTuo(this, 2);

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
                                // 吃分
                chi_score:{   
                    _run: function(){
                        this.setString("0");
                        this.ignoreContentAdaptWithSize(true);
                    },
                    _event:{
                        initSceneData:function(){
                            var pl = getUIPlayer_dianTuo(3);
                            if(!pl) return; 
                            
                            this.setString(pl.score_draw); 
                        },
                        TZScore: function(){
                            var pl = getUIPlayer_dianTuo(3);
                            if(!pl) return; 
                            this.setString(pl.score_draw); 
                        },
                        roundEnd: function(){
                            var pl = getUIPlayer_dianTuo(3);
                            if(!pl) return; 
                            this.setString(0); 
                        },
                        mjhand:function(){
                            this.setString("0");
                        }
                    }
                },
                xi_score:{
                    _run: function(){
                        this.setString("0");
                        this.ignoreContentAdaptWithSize(true);
                    },
                    _event:{
                        initSceneData:function(){
                            var tData = MjClient.data.sData.tData;
                            var pl = getUIPlayer_dianTuo(3);
                            if(!pl) return; 
                            var score = 0;
                            if(tData.areaSelectMode.isBombScore || tData.areaSelectMode.isRedBlackScore){
                                 // 显示喜分 
                                score = pl.score_xi;
                            }else{ // 显示总分 
                                score = pl.t_score_draw;
                            }  
                            this.setString(score || 0); 
                        },
                        TZScore: function(){
                            var tData = MjClient.data.sData.tData;
                            var pl = getUIPlayer_dianTuo(3);
                            if(!pl) return; 
                            var score = 0;
                            if(tData.areaSelectMode.isBombScore || tData.areaSelectMode.isRedBlackScore){
                                 // 显示喜分 
                                score = pl.score_xi;
                            }else{ // 显示总分 
                                score = pl.t_score_draw;
                            }  
                            this.setString(score); 
                        },
                        PKPut: function(){
                            var tData = MjClient.data.sData.tData;
                            var pl = getUIPlayer_dianTuo(3);
                            if(!pl) return; 
                            // 没有喜分就返回
                            if(!(tData.areaSelectMode.isBombScore || tData.areaSelectMode.isRedBlackScore)) return; 
                            this.setString(pl.score_xi); 
                        },
                        roundEnd: function(){
                            var tData = MjClient.data.sData.tData;
                            var pl = getUIPlayer_dianTuo(3);
                            if(!pl) return; 
                            var score = 0;
                            if(tData.areaSelectMode.isBombScore || tData.areaSelectMode.isRedBlackScore){
                                 // 显示喜分  
                                this.setString(3); 
                            }else{ // 显示总分  
                                this.setString(pl.t_score_draw); 
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
                        var clone = this.clone();
                        clone.setTag(3); 
                        var tempNode = MjClient.playui._chatBgLayout;
                        tempNode.addChild(clone);
                        var pos = this.getParent().convertToWorldSpace(clone.getPosition());
                        clone.setPosition(pos);
                    },
                    chattext: {
                        _event: {

                            MJChat: function(msg) {
                                if(MjClient.data.sData.tData.maxPlayer < 4){
                                    return;
                                }
                                var tempNode = MjClient.playui._chatBgLayout;
                                var tempThis = tempNode.getChildByTag(3).getChildByName("chattext");
                                if(msg.type == 0 || msg.type == 1){
                                    showUserChat(tempThis, 3, msg); // 文本消息层级提高
                                }else{
                                    showUserChat(this, 3, msg);
                                }
                                
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
                    showPlayerInfo_dianTuo(3, btn);
                },
                _event: {
                    loadWxHead: function(d) {
                        // setWxHead(this, d, 3);
                    },
                    addPlayer: function() {
                        // showFangzhuTagIcon_dianTuo(this, 3);
                    },
                    removePlayer: function() {
                        // showFangzhuTagIcon_dianTuo(this, 3);
                    },
                    initSceneData : function(){
                        // showFangzhuTagIcon_dianTuo(this,3);
                    },
                    mjhand : function(){
                        // showFangzhuTagIcon_dianTuo(this,3);
                    }
                },
                _run: function () {
                    // this.zIndex = 600;
                    // showFangzhuTagIcon_dianTuo(this,3);
                    var mode = MjClient.data.sData.tData.areaSelectMode;
                    this.setTouchEnabled(!mode.isBuDaGang);
                },
                name_bg:{_visible:false},
                tingCard:{
                    _visible:false,
                    Text_count:{
                        _run:function(){
                            this.ignoreContentAdaptWithSize(true);
                        }
                    },
                    _event:{
                        mjhand: function(){
                            this.setVisible(true);
                        },
                        initSceneData: function(eD)
                        {
                            var pl = getUIPlayer_dianTuo(3);
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
                        clearRankIcon_dianTuo : function(){
                            this.visible = false;
                        }
                    }
                },
                voice_icon:{
                    _visible: false,
                    _event : {
                        EventRoomUsers: function(eD){
                             // 首次加入计算一遍
                            if(MjClient.native.yayaVoice._isOpenVoice){
                                // 判断这个uid
                                this.visible = true;
                                var pl = getUIPlayer_dianTuo(3);
                                if(!pl) return;
                                this.loadTexture("playing/paodekuaiTable_new/closeYaya.png");
                                for (var i = 0; i < eD.uids.length; i++) {
                                    if(pl.info.uid == eD.uids[i]){
                                        this.loadTexture("playing/paodekuaiTable_new/openYaya.png");
                                    }
                                }
                            }
                        },
                        EventJoinRoom: function(eD){
                            var pl = getUIPlayer_dianTuo(3);
                            if(!pl) return;
                            if(pl.info.uid == eD.uid)
                                this.loadTexture("playing/paodekuaiTable_new/openYaya.png");
                        },
                        EventLeaveRoom: function(eD){
                            var pl = getUIPlayer_dianTuo(3);
                            if(!pl) return;
                            if(pl.info.uid == eD.uid)
                                this.loadTexture("playing/paodekuaiTable_new/closeYaya.png");
                            if(eD.uid == SelfUid())
                                this.visible = false;
                        }
                    }
                },
                duzhan_item : {
                    _run : function(){
                        this.visible = false;
                    },
                    _event : {
                        mjhand: function(){
                            // this.visible = false;
                        },
                        initSceneData: function(eD)
                        {   
                            var tData = MjClient.data.sData.tData;
                            var pl = getUIPlayer_dianTuo(3);
                            if(!pl) return;
                            cc.log("dddddddddddddddd = ",tData.duZhanPlayer );
                            this.setVisible(tData.duZhanPlayer == pl.info.uid);  
                            
                        }, 
                        duZhanSelectRet: function(ed){
                            var pl = getUIPlayer_dianTuo(3);
                            if(!pl) return;
                            this.setVisible(ed.duZhanPlayer == pl.info.uid); 
                        },
                        roundEnd : function(){
                            // this.setVisible(false);
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
                    limit_GetReadyVisible(this, -1);
                },
                _event: {
                    initSceneData: function(){
                        limit_GetReadyVisible(this, 3);
                    },
                    moveHead: function() {
                        limit_GetReadyVisible(this, -1);
                    },
                    addPlayer: function() {
                        limit_GetReadyVisible(this, 3);
                    },
                    removePlayer: function() {
                        limit_GetReadyVisible(this, 3);
                    },
                    onlinePlayer: function() {
                        limit_GetReadyVisible(this, 3);
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
                            DealPKPass_dianTuo(UIoff);
                            var playType =["putong/","fangyan/"][getCurrentVoiceType()];
                            var url = "diantuo/" + playType + "nv/pass";
                            var pl = MjClient.data.sData.players[eD.uid];
                            playEffect(url, false, pl.info.sex);
                        }
                    }
                },
                _visible: false
            },
            _event: {
                clearCardUI: function() {
                    clearCardUI_dianTuo(this, 3);
                },
                initSceneData: function(eD) {
                    SetUserVisible_dianTuo(this, 3);
                    // MjClient.playui.checkScoreState(this, 3);
                },
                addPlayer: function(eD) {
                    SetUserVisible_dianTuo(this, 3);
                },
                removePlayer: function(eD) {
                    SetUserVisible_dianTuo(this, 3);
                },
                TZJoinTeam: function() {
                    updateHeadInfo_dianTuo(this, 3);
                    updateZuInfo_dianTuo(this, 3);
                },
                mjhand: function(eD) {
                    InitUserHandUI_dianTuo(this, 3);

                    SetUserVisible_dianTuo(this, 3);
                },
                roundEnd: function() {
                    InitUserCoinAndName_dianTuo(this, 3);
                    // this.cardList.removeFromParent();
                    // this.cardList = null;
                },
                waitPut: function(eD) {
                    DealWaitPut_dianTuo(this, eD, 3);
                },
                PKPut: function(eD) {
                    if(this.throwList){
                        this.throwList.hideCards();
                    }
                    DealMJPut_dianTuo(this, eD, 3);
                },
                onlinePlayer: function(eD) {
                    setUserOffline_dianTuo(this, 3);
                },
                playerStatusChange: function(eD) {
                    setUserOffline_dianTuo(this, 3);
                },
                MJFlower: function(eD) {
                    HandleMJFlower(this, eD, 3);
                },
                MJTing: function (eD) {
                    HandleMJTing(this, eD, 3);
                },
                TZScore: function(msg){
                    InitUserCoinAndName_dianTuo(this, 3);

                    if(MjClient.data.sData.tData.maxPlayer == 4){
                        MjClient.playui.checkScoreState(this, 3);
                    }
                    
                }
            }
        },
        bao_btn: {
            _run: function() {
                setWgtLayout(this, [0.06, 0.06], [0.835, 0.17], [0, 3]); 
                if(MjClient.rePlayVideo !== -1){
                    this.visible = false;
                }
            },
            _event: {
                mjhand: function(){
                    this.visible = true;
                    if(MjClient.rePlayVideo !== -1){
                        this.visible = false;
                    }
                },
                initSceneData: function(){ 
                    var tData = MjClient.data.sData.tData;
                    this.visible = true;
                    if(MjClient.rePlayVideo !== -1 || tData.tState == TableState.waitJoin || tData.tState == TableState.waitReady){
                        this.visible = false;
                    }
                }
            },
            _click: function() {  
                // 显示语言文本
                showBaoText();
            }
        },
        chat_btn: { 
            _run : function(){
                setWgtLayout(this, [0.05, 0.05], [0.9, 0.2], [0, 3]);
                if(MjClient.rePlayVideo !== -1){
                    this.visible = false;
                }

                // 4人选择分组阶段
                // var tData = MjClient.data.sData.tData;
                // if ((tData.tState == TableState.waitJoin || tData.tState == TableState.waitReady) && tData.maxPlayer == 4) {
                //     this.visible = false;
                // }

                // if(isIPhoneX()){
                //     setWgtLayout(this, [68/1280 * 0.88, 0], [0.9649, 0.3345], [0, 0]);
                // }
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
                },
                initSceneData: function(){ 
                    this.visible = true;
                    var tData = MjClient.data.sData.tData;
                    if(MjClient.rePlayVideo !== -1 || tData.tState == TableState.waitJoin || tData.tState == TableState.waitReady){
                        this.visible = false;
                    }
                }
            }
        },
        voice_btn: {
            _run: function() {
                // initVoiceData();
                setWgtLayout(this, [0.07, 0.07], [0.965, 0.14], [0, 3]);
                
                if(MjClient.isShenhe) this.visible=false;

                if(MjClient.rePlayVideo !== -1){
                    this.visible = false;
                }

                // if(isIPhoneX()){
                //     setWgtLayout(this, [68/1280 * 0.88, 0], [0.9649, 0.4317], [0, 0]);
                // }


            },
            // test 语音内容，关注一下
            _click: function(sender){

                // 不知道怎么判断是打开的还是关闭的
                var tData = MjClient.data.sData.tData;
                if(MjClient.native.yayaVoice && tData.realtimeVoice){ 
                    sender.setTouchEnabled(false); 
                    MjClient.playui.runAction(cc.sequence(cc.delayTime(3),cc.callFunc(function () {
                        sender.setTouchEnabled(true);
                    })));  
                    if(MjClient.native.yayaVoice._isOpenVoice){
                        MjClient.native.yayaVoice.leaveRoom();
                    }else{
                        MjClient.native.yayaVoice.joinRoom(tData.tableid);
                    }
                }
            },

            _event: {
                // PKPut: function(eD) {
                //     // 以免有问题，让他在打牌的时候再刷一次
                //     if(MjClient.native.yayaVoice && MjClient.native.yayaVoice._isOpenVoice 
                //         && eD.uid == SelfUid() && MjClient.rePlayVideo == -1){
                //         cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>PKPut----------1111111111-----");
                //         MjClient.native.yayaVoice.getRoomUsers();
                //     } 
                    
                // },
                // 有人加入
                EventJoinRoom: function(){

                    if (cc.sys.OS_WINDOWS != cc.sys.os){
                        MjClient.native.yayaVoice.getRoomUsers();
                        return;
                    } 

                    // test  win32 
                    MjClient.native.yayaVoice._isOpenVoice = true;
                    MjClient.native.yayaVoice.getRoomUsers();
                    // 这里还要请求一下人数
                    changeEffectVoice_dianTuo(false);
                    this.loadTextures("playing/paodekuaiTable_new/yuyin_n.png", "", "");
                },
 
                // 正式加入
                EventOpenMic: function(eD){
                        showVoiceEffect(this,2,0); 
                    // cc.log("test EventOpenMic = ",JSON.stringify(eD) );
                    // if(eD.uid  == SelfUid()){
                        MjClient.native.yayaVoice._isOpenVoice = true;
                        MjClient.native.yayaVoice.getRoomUsers();
                        // 这里还要请求一下人数
                        changeEffectVoice_dianTuo(false);
                        this.loadTextures("playing/paodekuaiTable_new/yuyin_n.png", "", "");
                    // }

                },
                // 离开
                EventLeaveRoom: function(eD){
                    cc.log("test EventLeaveRoom = ",eD);
                    if(eD.uid == SelfUid()){
                        changeEffectVoice_dianTuo(true);
                        MjClient.native.yayaVoice._isOpenVoice = false;
                        // 显示离开房间的内容
                        if(!MjClient.native.yayaVoice._isOpenVoice){
                            showVoiceEffect(this,3);
                        }
                        this.loadTextures("playing/paodekuaiTable_new/close_yuyin.png", "", "");
                    }else{
                        MjClient.native.yayaVoice.getRoomUsers();
                    }
                }, 

                // 获取人数
                EventRoomUsers: function(eD){
                     // 显示房间里的人数的提示语
                    if(MjClient.native.yayaVoice._isOpenVoice){
                        // showVoiceEffect(this,2,eD.uids.length); 
                    }
                },

                mjhand: function(){
                    this.visible = true;

                    var tData = MjClient.data.sData.tData;
                    if(MjClient.rePlayVideo !== -1){
                        this.visible = false;
                    }else if(tData.roundNum == tData.roundAll){
                        showVoiceEffect(this,1); // 第一局显示一下
                    }
                },
                initSceneData: function(eD){ 

                    this.visible = true;
                    var tData = MjClient.data.sData.tData;
                    if(MjClient.rePlayVideo !== -1 || tData.tState == TableState.waitJoin || tData.tState == TableState.waitReady){
                        this.visible = false;
                    }else if(MjClient.native.yayaVoice) {
                        // 重新进来肯定是未开启状态
                        MjClient.native.yayaVoice._isOpenVoice = false;
                        MjClient.native.yayaVoice.leaveRoom();
                        this.loadTextures("playing/paodekuaiTable_new/close_yuyin.png", "", "");
                        showVoiceEffect(this,1);
                    }
                }
            }
        },
        duZhanNode: {
            _run:function(){
                this.setVisible(false);
                this.setPosition(cc.p(0,0));
            },
            duzhan_btn:{
                _layout: [
                    [0.12, 0.12],
                    [0.4, 0.42],
                    [0, 0]
                ],
                _click:function(btn){
                    MjClient.gamenet.request("pkroom.handler.tableMsg", {
                       cmd: "c2s_duZhanRet",
                       isDuZhan: true,
                    });
                    // btn.getParent().visible = false;  
                }
            },
            fangqi_btn:{
                _layout: [
                    [0.12, 0.12],
                    [0.6, 0.42],
                    [0, 0]
                ],
                _click:function(btn){
                    MjClient.gamenet.request("pkroom.handler.tableMsg", {
                       cmd: "c2s_duZhanRet",
                       isDuZhan: false,
                    });
                    // btn.getParent().visible = false; 
                }

            },
            _event:{
                waitJiazhu:function(ed){ 
                    this.setVisible(false);
                    var tData = MjClient.data.sData.tData;
                    tData.curPlayer = ed.curPlayer;
                    this.visible = (tData.uids[tData.curPlayer] == SelfUid()); 
                     cc.log(SelfUid());
                },
                initSceneData:function(){
                    var pl = getUIPlayer_dianTuo(0); 
                    var tData = MjClient.data.sData.tData;
                    if(tData.uids[tData.curPlayer] != SelfUid() ) return;
                    if(!pl || pl.jiazhuNum != -1) return;
                    cc.log("pppppppppppppp = ",pl.jiazhuNum );
                    this.visible = true; 
                },
                duZhanSelectRet:function(ed){
                    this.visible = false;
                    // tData:tData, uid:pl.uid, jiazhuNum:pl.jiazhuNum
                    cc.log("duZhanSelectRet = ",JSON.stringify(ed));
                } 
            }
        },
        fenZuNode: {
            _run:function() {
                // var tData = MjClient.data.sData.tData;  

                setWgtLayout(this, [this.width/1280, this.height/720], [0.5, 0.6], [0, 0]);
                this.visible = false;
                this.update = function() {

                    // this.removeAllChildren();
                    var isVisible = true;
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    var areaSelectMode = tData.areaSelectMode;  
                    if(tData.maxPlayer == 3 || areaSelectMode.isSanFuPai){
                        this.visible = false; 
                        return;
                    }

                    if (tData.tState != TableState.waitJoin && tData.tState != TableState.waitReady) {
                        isVisible = false;
                    }

                    if (!isVisible) {
                        this.visible = false;
                        return;
                    }

                    this.visible = true; 

                    for (var i = 0; i < tData.uids.length; i++) {
                        var pl = sData.players[tData.uids[i]];
                        var hand = this.getChildByName("head_" + (i + 1));
                        if(!pl || !hand){
                            loaderHeadImage_dianTuo(hand,null,true);  
                           continue;  
                        } 
                        loaderHeadImage_dianTuo(hand,pl);  
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
                TZTeam: function(){
                     this.setVisible(false);
                },
                mjhand: function() {
                    // this.update();
                   
                },
                onlinePlayer: function() {
                    this.update();
                }
            },
            head_1:{
                ready:{
                    _event:{
                        addPlayer: function() {
                            GetReadyVisible_diantuo(this, 0);//根据状态设置ready 是否可见 add by sking
                        },
                        removePlayer: function() {
                            GetReadyVisible_diantuo(this, 0);
                        },
                        onlinePlayer: function() {
                            GetReadyVisible_diantuo(this, 0);
                        },
                        initSceneData: function(){
                            GetReadyVisible_diantuo(this, 0);
                        }
                    }
                }
            },
            head_2:{
                ready:{
                    _event:{
                        addPlayer: function() {
                            GetReadyVisible_diantuo(this, 1);//根据状态设置ready 是否可见 add by sking
                        },
                        removePlayer: function() {
                            GetReadyVisible_diantuo(this, 1);
                        },
                        onlinePlayer: function() {
                            cc.log("?????????????????????");
                            GetReadyVisible_diantuo(this, 1);
                        },
                        initSceneData: function(){
                            GetReadyVisible_diantuo(this, 1);
                        }
                    }
                }

            },
            head_3:{
                ready:{
                    _event:{
                        addPlayer: function() {
                            GetReadyVisible_diantuo(this, 2);//根据状态设置ready 是否可见 add by sking
                        },
                        removePlayer: function() {
                            GetReadyVisible_diantuo(this, 2);
                        },
                        onlinePlayer: function() {
                            GetReadyVisible_diantuo(this, 2);
                        },
                        initSceneData: function(){
                            GetReadyVisible_diantuo(this, 2);
                        }
                    }
                }

            },
            head_4:{
                ready:{
                    _event:{
                        addPlayer: function() {
                            GetReadyVisible_diantuo(this, 3);//根据状态设置ready 是否可见 add by sking
                        },
                        removePlayer: function() {
                            GetReadyVisible_diantuo(this, 3);
                        },
                        onlinePlayer: function() {
                            GetReadyVisible_diantuo(this, 3);
                        },
                        initSceneData: function(){
                            GetReadyVisible_diantuo(this, 3);
                        }
                    }
                }

            }

        },
        btn_outRoom:{ 
            _run:function(){
                setWgtLayout(this, [this.width/1280, this.height/720], [0.79, 0.92], [0, 0]);
            },
            _click: function(btn) {

                    var sData = MjClient.data.sData;
                    if (sData) {
                        if (IsRoomCreator()) {
                            MjClient.showMsg("返回大厅房间仍然保留\n赶快去邀请好友吧",
                                function() {
                                    MjClient.leaveGame();
                                },
                                function() {});
                        } else {
                            MjClient.showMsg("确定要退出房间吗？",
                                function() {
                                    MjClient.leaveGame();
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
                        this.visible = isShowBackBtn_dianTuo();
                    },
                    removePlayer: function(eD) {
                        this.visible = isShowBackBtn_dianTuo();
                    },
                    mjhand: function(){
                        this.visible = false;
                    },
                    waitReady:function()
                    {
                        this.visible = true;
                    },
                    waitJiazhu:function() {
                        this.visible = false;
                    }
                }
        },
        btn_showDeFen:{
            _run:function(){
                setWgtLayout(this, [this.width/1280, this.height/720], [0.87, 0.92], [0, 0]);
            },
            _click:function(){
                showScoreTable(2);
            }
        },
        btn_showBaoFen:{
            _run:function(){
                setWgtLayout(this, [this.width/1280, this.height/720], [0.95, 0.92], [0, 0]);
            },
            _click:function(){
                showScoreTable(1);
            }
        }
    },
    _downNode:null,
    _rightNode:null,
    _topNode:null,
    _leftNode:null,
     // 显示王的节点
    _kingCardNode : null, // 当打出单牌的时候显示王
    // 语音文本节点（产品要求，语音文本节点放到最高层级所以要重新提取出来）
    _chatBgLayout : null,
    _isOpenVoice: false, // 进入语音
    ctor: function() {
        this._super();
        var playui = ccs.load("Play_diantuo.json");

        this.srcMaxPlayerNum = MjClient.MaxPlayerNum;
        MjClient.MaxPlayerNum = parseInt(MjClient.data.sData.tData.maxPlayer);

        playMusic("bgFight_niushibie");

        // this._chatBgLayout = new cc.Node();

        this._chatBgLayout = new ccui.Layout();
        this._chatBgLayout.setContentSize(cc.size(1280,720));
        this.addChild(this._chatBgLayout,1000);

        setWgtLayout(this._chatBgLayout, [1, 1], [0, -0.02], [0, 0]);

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

        // 显示每个人有的王
        this._kingCardNode = new cc.Node();
        this.addChild(this._kingCardNode,100);

        

        MjClient.playui._jiazhuWait = playui.node.getChildByName("jiazhuWait");

        MjClient.lastMJTick = Date.now();
        this.runAction(cc.repeatForever(cc.sequence(cc.callFunc(function() {
            if (MjClient.game_on_show) MjClient.tickGame(0);
        }), cc.delayTime(7))));

        // 在亲友圈房间中添加邀请亲友圈牌有一起对局
        addClubYaoqingBtn(2); 

        MjClient.playui.resetMaxPlayerNumPos();
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

// 重置三人的时候部分表现位置
PlayLayer_dianTuo.prototype.resetMaxPlayerNumPos = function(headNode){
    if(MjClient.data.sData.tData.maxPlayer != 3) return;
    // 把top的位置全部设置成left一样
    var leftHeadNode = MjClient.playui._leftNode.getChildByName("head");
    var topHeadNode = MjClient.playui._topNode.getChildByName("head");
    for (var i = 0; i < leftHeadNode.getChildren().length; i++) {
        var left = leftHeadNode.getChildren()[i];
        if(left.name){
            var topChild = topHeadNode.getChildByName(left.name);
            topChild.setPosition(cc.p(left.getPosition()));
        }
    }
    var pos = this._chatBgLayout.getChildByTag(3).getPosition();
    this._chatBgLayout.getChildByTag(2).setPosition(cc.p(pos));
}

PlayLayer_dianTuo.prototype.cannotOutCardGrey = function()
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

PlayLayer_dianTuo.prototype.recoverCannotOutCard = function()
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

PlayLayer_dianTuo.prototype.clockNumberUpdate = function(node, endFunc)
{
    //取消闹钟声音
    return arrowbkNumberUpdate(node, endFunc);
}

PlayLayer_dianTuo.prototype.updateClockPosition = function(arrowNode)
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

    // if (curPlayerNode != null){
    //     // var p = curPlayerNode.throwList.getPosition();
    //     // arrowNode.setPosition(p.x, p.y + curPlayerNode.throwList.height * 0.5);   
    //     arrowNode.setPosition(curPlayerNode.getChildByName("deskCard").getPosition());  
    // }else { 
    //     arrowNode.setPosition(arrowNode.srcPosition);
    // } 

    if(curPlayerIndex == 0){ 
        setWgtLayout(arrowNode, [0.088, 0.18], [0.17, 0.45], [0, 0]);
    }else if(curPlayerIndex == 3 || (curPlayerIndex == 2 && MjClient.MaxPlayerNum  == 3)){
        setWgtLayout(arrowNode, [0.088, 0.15], [0.2, 0.6], [0, 0]);
    }else if(curPlayerIndex == 2){
        setWgtLayout(arrowNode, [0.088, 0.15], [0.5, 0.78], [0, 0]);
    }else if(curPlayerIndex == 1){
        setWgtLayout(arrowNode, [0.088, 0.15], [0.8, 0.6], [0, 0]);
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

PlayLayer_dianTuo.prototype.showAndHideHeadEffect = function(){
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

    return;
    if (curPlayerNode != null && MjClient.data.sData.tData.tState == TableState.waitPut)
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
PlayLayer_dianTuo.prototype.getGameInfoString = function(param)
{
    var tData = MjClient.data.sData.tData;
    var str = "";

    if (param != "roundInfo"){
        str += ["","","二","三","四"][MjClient.MaxPlayerNum] + "人玩,";
    }  
     
    if(MjClient.MaxPlayerNum == 3){
        // str += "去掉3、4,去两张牌,不分组,";
    }

    var score = Number(tData.areaSelectMode.nScoreLine);
    if(score == 1 || score == 2 || score == 4) {
        score = score + "局,";
    }else {
        score = score + "分,";
    }
    str +=  score;

    str += tData.areaSelectMode.isSanFuPai ? "三副牌," : "";
    str +=  (!tData.areaSelectMode.isFullCard && MjClient.MaxPlayerNum != 3) ? "去掉3、4," : "";
    str +=  (tData.areaSelectMode.isSeeTeamCard && MjClient.MaxPlayerNum == 3 ) ? "看队友牌," : "";
    str +=  tData.areaSelectMode.isRdTeam ? "随机分组," : "";
    // str +=  tData.areaSelectMode.isShowRemainCards ? "看手牌数," : ""; // 产品要求，不显示看手牌数
    str +=  tData.areaSelectMode.isNoShunZi ? "不打顺子," : "";
    str +=  tData.areaSelectMode.isBuDaGang ? "不打港," : "";

    str +=  tData.areaSelectMode.isZhaNoKing ? "炸弹不带王," : "";
    str +=  tData.areaSelectMode.isHuaSeValid ? "正五十K分花色," : "";
    str +=  tData.areaSelectMode.isZuiHouShaoDai ? "仅最后飞机三条可少带," : "";

    str +=  tData.areaSelectMode.isBombScore ? "炸弹有喜," : "";
    str +=  tData.areaSelectMode.isRedBlackScore ? "四红四黑," : ""; 
    if(tData.areaSelectMode.nTianZhaScore > 0){
        str += "天炸"+ tData.areaSelectMode.nTianZhaScore + "分,";
    }

    str += '积分底分' + tData.areaSelectMode.jieSuanDiFen;

    if (str.charAt(str.length - 1) == ",")
        str = str.substring(0, str.length - 1);
    return str;
};

PlayLayer_dianTuo.prototype.shwoFlyCardAnim = function(flyNode)
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

PlayLayer_dianTuo.prototype.showHandCardBeiMian = function()
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

PlayLayer_dianTuo.prototype.hideHandCardBeiMian = function()
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

PlayLayer_dianTuo.prototype.checkRankState = function(node, uiOff, isRoundEnd){
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
                var src = "playing/diantuo/you_"+ (i+1) + "_icon.png";
                if(pl.handCount > 0 && MjClient.MaxPlayerNum == 4){
                    src = "playing/diantuo/you_4_icon.png"
                }
                // 关闭同类玩家的手牌效果以及报警效果
                var selfNode = node.getParent();
                if(selfNode){
                   if(selfNode.getChildByName("tingCard")){
                       selfNode.getChildByName("tingCard").visible = false
                   }
                   if(selfNode.getChildByName("warning")){
                       selfNode.getChildByName("warning").visible = false
                   }  
                } 

                node.ignoreContentAdaptWithSize(true);
                node.loadTexture(src);
                node.visible = true;
                break;
            }
        }
    }
}

PlayLayer_dianTuo.prototype.checkScoreState = function(node, uiOff){
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

            var gold = new dianTuo.Gold();
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
