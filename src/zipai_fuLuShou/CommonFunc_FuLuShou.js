
/* ======================================
 *  放一些共用的方法
 *  ====================================== */


// 耒阳字牌全局方法
MjClient.MaxPlayerNum_fuLuShou = 4;
MjClient.cardPath_fuLuShou = "playing/fulushou/card/";
var ActionType_fuLuShou =  //图片提示
    {
        CHI:1,
        PENG:2,
        ZHAO:3,     
        GANG:4,
        HU:5,
    };

//初始化玩家金币、名字、胡息
function InitUserCoinAndName_fuLuShou(node, off){
    var pl = getUIPlayer_fuLuShou(off);
    if(!pl){
        return;
    }

    var tData = MjClient.data.sData.tData;
    var bind ={
        head:{
            name:{
                _run:function(){
                    this.ignoreContentAdaptWithSize(true);
                    this.setFontName("Arial");
                    this.setFontSize(this.getFontSize());
                },
                _text: function()
                {
                    var _nameStr = unescape(pl.info.nickname );
                    return getNewName(_nameStr);
                }
            },
            coin:{
                _visible: true,
                _run: function(){
                    //sk,todo,这里有问题，服务器的pl.winall没有赋值，这里加了有个毛用？
                    var coin = tData.initCoin;
                    this.setString("" + (coin + pl.winall));
                    //changeAtalsForLabel(this, coin + pl.winall);
                }
            },
        }
    };
    //add by sking
    var name = node.getChildByName("head").getChildByName("name");
    name.ignoreContentAdaptWithSize(true);

    BindUiAndLogic(node, bind);
}

//向服务器发送打牌操作
function HZPutCardToServer_fuLuShou(card){
    cc.log("====================HZPutCardToServer_fuLuShou=================");
    MjClient.gamenet.request("pkroom.handler.tableMsg", {
        cmd: "MJPut",
        card: card
    });
}

// 向服务器发送吃牌
function HZChiToServer_fuLuShou(){
    if (MjClient.rePlayVideo != -1) {
        return; // 回放时候不能请求
    }

    var tData = MjClient.data.sData.tData;
    MjClient.gamenet.request("pkroom.handler.tableMsg", {
        cmd: "MJChi",
        //eatCards: eatCards,
        //cardNext: tData.cardNext,
        card: tData.lastPutCard
    });
}

//像服务器发送碰牌
function HZPengToServer_fuLuShou()
{
    if (MjClient.rePlayVideo != -1) return; // 回放时候不能请求
    cc.log("====================HZPengToServer_fuLuShou=================");
    MjClient.gamenet.request("pkroom.handler.tableMsg", {
        cmd: "MJPeng"
    });
}

// 向服务器发送过牌
function HZPassConfirmToServer_fuLuShou() {
    if (MjClient.rePlayVideo != -1)  {
        return; // 回放时候不能请求
    }

    var tData = MjClient.data.sData.tData;
    MjClient.gamenet.request("pkroom.handler.tableMsg", {
        cmd: "MJPass",
        eatFlag: EatFlag_fuLuShou(),
        cardNext: tData.cardNext,
        card: tData.lastPutCard
    });
}

// 向服务器发送托管
function HZTrustToServer_fuLuShou()
{
    if (MjClient.rePlayVideo != - 1)
        return;
    MjClient.gamenet.request("pkroom.handler.tableMsg", {
        cmd: "FLSdoTrust",
    })
}

//向服务器发送发牌命令
function HZNewCardToServer_fuLuShou(){
    if (MjClient.rePlayVideo != -1) return; // 回放时候不能请求
    cc.log("====================HZNewCardToServer_fuLuShou=================");
    MjClient.gamenet.request("pkroom.handler.tableMsg", {
        cmd: "HZNewCard"
    });
}

//向服务器发送胡牌命令
function MJHuToServer_fuLuShou(){
    if (MjClient.rePlayVideo != -1) return; // 回放时候不能请求
    cc.log("====================MJHuToServer=================");
    MjClient.gamenet.request("pkroom.handler.tableMsg", {
        cmd: "MJHu",
        eatFlag: EatFlag_fuLuShou()
    });
}

//添加吃的牌
function addEatCard_fuLuShou(node,name,mjNum,off,isTurn){
    //根据牌的类型获得需要添加的节点
    var eatNode = node.getChildByName("eatNode");
    if(!eatNode){
        return;
    }
    var type = 2;
    //设置牌
    var newCard = getNewCard_fuLuShou(mjNum,type,off,isTurn);
    var parentCount = eatNode.childrenCount;
    //首先根据name判断cpNode中是否已经添加
    var cardParent = eatNode.getChildByName(name);
    if(!cardParent){
        cardParent = new cc.Node();
        cardParent.setName(name);
        if(node.getName() == "down"){
            cardParent.x = parentCount * newCard.width;
            cardParent.y = 0;
        }else if (node.getName() == "right"){
            cardParent.x = eatNode.width - parentCount * newCard.width;
            cardParent.y = -eatNode.height;
        }else if (node.getName() == "left"){
            cardParent.x = parentCount * newCard.width;
            cardParent.y = -eatNode.height;
        }else if (node.getName() == "xing"){
            cardParent.x = eatNode.width - parentCount * newCard.width;
            cardParent.y = 0;
        }
        eatNode.addChild(cardParent);
    }
    var off_y = 0;
    if(node.getName() == "down"){
        off_y = newCard.height;
        newCard.anchorX = 0;
        newCard.anchorY = 0;
    }else if(node.getName() == "right"){
        off_y = newCard.height;
        newCard.anchorX = 1;
        newCard.anchorY = 0;
    }else if(node.getName() == "left"){
        off_y = newCard.height;
        newCard.anchorX = 0;
        newCard.anchorY = 0;
    }else if (node.getName() == "xing"){
        off_y = newCard.height;
        newCard.anchorX = 1;
        newCard.anchorY = 0;
    }
    var cardCount = cardParent.childrenCount;
    newCard.zIndex = 4 - cardCount;
    newCard.x = 0;

    if(node.getName() == "down" || node.getName() == "xing") {
        newCard.y = cardCount * off_y;
    }else {
        newCard.y = newCard.zIndex * off_y;
    }

    cardParent.addChild(newCard);
}

/**
 添加手牌(回放)
 */
function addHandCardReplay_fuLuShou(tagName,index,mjNum,off){
    var _node = getNode_fuLuShou(off);
    //根据牌的类型获得需要添加的节点
    var addNode = _node.getChildByName("replayNode");
    if(!addNode){
        return;
    }
    //设置牌
    var type = 2;
    var newCard = getNewCard_fuLuShou(mjNum,type,off);
    var scale_y = newCard.scaleY;
    var parentCount = addNode.childrenCount;
    //首先根据name判断cpNode中是否已经添加
    var cardParent = addNode.getChildByTag(tagName);
    if(!cardParent){
        cardParent = new cc.Node();
        cardParent.tag = tagName;
        if(_node.getName() == "down"){
            cardParent.x = parentCount * newCard.width;
            cardParent.y = 0;
        }else if (_node.getName() == "right"){
            cardParent.x = addNode.width - parentCount * newCard.width;
            cardParent.y = 0;
        }else if (_node.getName() == "left"){
            cardParent.x = parentCount * newCard.width;
            cardParent.y = 0;
        }else if (_node.getName() == "xing"){
            cardParent.x = addNode.width - parentCount * newCard.width;
            cardParent.y = 0;
        }
        addNode.addChild(cardParent);
    }
    var off_y = 0;
    if(_node.getName() == "down" || _node.getName() == "left"){
        off_y = newCard.height;
        newCard.anchorX = 0;
        newCard.anchorY = 0;
    }else if(_node.getName() == "right" || _node.getName() == "xing"){
        off_y = newCard.height;
        newCard.anchorX = 1;
        newCard.anchorY = 0;
    }
    var cardCount = cardParent.childrenCount;
    newCard.zIndex = 4 - cardCount;
    newCard.x = 0;
    newCard.y = cardCount * off_y;
    cardParent.addChild(newCard);
}

/*
 添加手牌(正常打牌)
 每一组添加到一个节点,比如4个同样的为一个节点，单牌也为一个节点
 */
 //tagName = k, index=j
function addHandCard_fuLuShou(tagName,index,mjNum,off){
    if(off != 0){
        return;
    }
    var _node = getNode_fuLuShou(off);
    //根据牌的类型获得需要添加的节点
    var addNode = _node.getChildByName("handNode");
    if(!addNode){
        return;
    }
    //设置牌
    var newCard = getNewCard_fuLuShou(mjNum,1,off);
    var scale_y = newCard.scaleY;
    //var parentCount = addNode.childrenCount;
    //首先根据name判断cpNode中是否已经添加
    var cardParent = addNode.getChildByTag(tagName);
    if(!cardParent){
        cardParent = new cc.Node();
        cardParent.tag = tagName;
        cardParent.width = newCard.width;
        addNode.addChild(cardParent);
    }
    var posSc = 0.8;

    var beginPoint = cc.p(0,newCard.height * newCard.scale * (2 * posSc) );
    var off_y = newCard.height * scale_y - newCard.height/4 * scale_y;



    var cardCount = cardParent.childrenCount;
    newCard.setName(index);
    //newCard.zIndex = 4 - index;
    newCard.anchorX = 0;
    newCard.anchorY = 0;
    newCard.x = beginPoint.x;
    newCard.scale = newCard.scale*1.02;
    //检索当前列是否有同样的牌
    var pl = MjClient.data.sData.players[SelfUid()];
    if(!pl)
        return;
    var cards = cardParent.getChildren();
    var isHave = false;
    var sameCard;
    var sameNum = 0;
    var cardsNum = [];
    for (var i=0; i<cardCount; i++) {
        if(cards[i].tag == mjNum) {
            isHave = true;
            sameCard = cards[i];
            sameNum += 1;
            cards[i].getChildByName("img_num").setVisible(false);   //隐藏数量标识
            cards[i].setTouchEnabled(false);   //变为不可点击，只能点上一层的牌
            cards[i].getChildByName("img_num").setUserData({"num":1});
            cards[i].setUserData({"bOut":false});  //默认设置为非最外层
        }
        cardsNum.push(cards[i].tag);
    }
    //已有相同牌就堆叠
    if(isHave) {
        newCard.y = sameCard.y - sameCard.getBoundingBox().height/9;//4张牌堆叠时，第4张的高线在第一张的1/3处
        newCard.zIndex = sameCard.zIndex+1;
    } else if(cardCount==0) {
        newCard.y = beginPoint.y;
        newCard.zIndex = 1;
    } else {
        //没有就找位置
        //是否该列最小牌
        var sc = newCard.getScale();
        var min = Math.min.apply(Math, cardsNum);
        var max = Math.max.apply(Math, cardsNum);
        if(mjNum < min) {
            newCard.y = beginPoint.y;
            newCard.zIndex = 1;
        }else if(min == max) {
            newCard.y = beginPoint.y - (newCard.height * sc * posSc);
            newCard.zIndex = 21;
        }else if(mjNum > max) {
            newCard.y = beginPoint.y - (newCard.height * 2 * sc * posSc);
            newCard.zIndex = 31;
        }else {
            newCard.y = beginPoint.y - (newCard.height * sc * posSc);
            newCard.zIndex = 21;      
        }
    }
    newCard.setTouchEnabled(true);
    newCard.setUserData({"bOut":true});
    cardParent.addChild(newCard);

    //更新堆叠的数量标识
    var imgNum = newCard.getChildByName("img_num");
    if(imgNum && cc.sys.isObjectValid(imgNum)) {
        if(isHave) {
            imgNum.loadTexture("playing/fulushou/"+(sameNum+1)+".png");
            imgNum.setVisible(true);
        } else {
            imgNum.setVisible(false);
        }
        imgNum.setUserData({"num":sameNum+1});
    }
    //托管后/杠后自动摸打，牌的特殊处理
    if ((pl.isTing && pl.newSendCard) || pl.isTuoGuan) {
        if(newCard.tag != pl.newSendCard) {
            newCard.setColor(cc.color(0x7F, 0x7F, 0x7F));
            newCard.setTouchEnabled(false);
        }
        else {
            var tData = MjClient.data.sData.tData;
            if((tData.tState == TableState.waitPut || 
                (tData.tState == TableState.waitEat && (pl.eatFlag & 32)) > 0) && 
                curPlayerIsMe_fuLuShou(0)) {
                //记录这张需要自动打出的牌
                pl.autoCard = newCard;
            }else {
                newCard.setColor(cc.color(0x7F, 0x7F, 0x7F));
                newCard.setTouchEnabled(false);
            } 
        }
    }
}

/**
 mjNum:牌的数字
 type:类型，1:手牌 2：吃牌 3：打的牌 4：招杠
 **/
function getNewCard_fuLuShou(mjNum, type, off, isTurn){
    var _node = getNode_fuLuShou(off);
    var copyNode = null;
    if(type == 1){
        //手牌
        copyNode = _node.getChildByName("handCard");
    }else if(type == 2){
        //吃的牌
        copyNode = _node.getChildByName("out0");
    }else if(type == 4){
        //醒牌
        copyNode = _node.getChildByName("xingPai");
    }else{
        //打出的牌
        copyNode = _node.getChildByName("put");
    }
    var mjNode = copyNode.clone(); //克隆一个白板，上面没有任何条纹的麻将 ，by sking
    mjNode.visible = true;

    //cc.log("getNewCard_fuLuShou:"+mjNum+","+type+","+off+","+isTurn);
    if(mjNum > 0){
        //创建一个带有麻将信息的麻将 cp为创建后的麻将
        setCardSprite_fuLuShou(mjNode, mjNum, type, isTurn);
        if(type == 1){
            //只有手牌才会有点击事件
            SetTouchCardHandler_fuLuShou(mjNode,off);
        }
    }

    return mjNode;
}

//大结算和小结算   设置玩家掉线头像
function setRoundEndUserOffline_fuLuShou(node, pl){
    //var pl = getPlayerByIndex(off);
     
    if(!pl)
    {
        return;
    }

    if (pl.onLine == false)
    {
        var _offline = new cc.Sprite("playing/paohuzi/offLine_new.png");
        _offline.setName("offline");
        node.addChild(_offline);
        node.getChildByName("offline").x = 50;
        node.getChildByName("offline").y = 48;
        node.getChildByName("offline").zIndex = 99;
        node.getChildByName("offline").visible = !pl.onLine;
    }
  
    if (pl.onLine == false )
    {  
        var _offLineNode = node.getChildByName("offline"); 
        _offLineNode.unscheduleAllCallbacks();
        var _currentTime = new Date().getTime();
        _offLineNode.schedule(function(){
            var _timeNode = _offLineNode.getChildByName("offLineTime");
            if (!_timeNode) {

                _timeNode = new ccui.Text();
                _timeNode.setName("offLineTime");
                _timeNode.setFontSize(20);
                _offLineNode.addChild(_timeNode)
            }
            else
            {
                _timeNode.visible = true;
            }

            _timeNode.setPosition(cc.p(_offLineNode.getContentSize().width/2,_offLineNode.getContentSize().height*0.2));

            if (pl.offLineTime)
            {
                var _showTime = _currentTime - pl.offLineTime;
                _timeNode.setString(MjClient.dateFormat(new Date(_showTime),"mm:ss"));
            }
            else
            {
                _timeNode.setString("");
            }
        });
    }

}

//没有过胡确认--------------mark
function commitEatCards_fuLuShou(eatCards, biArr){
    if (MjClient.rePlayVideo == -1 && (MjClient.data.sData.players[SelfUid()].eatFlag & 32) > 0) {
        MjClient.showMsg("吃牌后视为过胡，确定吃吗？", function() {
            setChiVisible_fuLuShou();
            HZChiToServer_fuLuShou(eatCards, biArr); 
        }, function() {}, "1");
    } else {
        setChiVisible_fuLuShou();
        HZChiToServer_fuLuShou(eatCards, biArr); 
    }
}

//向服务器发送招牌
function HZZhaoToServer_fuLuShou(cd) {
    if (MjClient.rePlayVideo != -1) {
        return;
    }

    //发送招的协议
    var tData = MjClient.data.sData.tData;
    MjClient.gamenet.request("pkroom.handler.tableMsg", {
        cmd:"MJZhao",
        card: cd,
        eatFlag:EatFlag_fuLuShou()
    });
}

//向服务器发送杠牌
function HZGangToServer_fuLuShou(cd) {
    if (MjClient.rePlayVideo != -1) {
        return;
    }

    var tData = MjClient.data.sData.tData;
    MjClient.gamenet.request("pkroom.handler.tableMsg", {
        cmd:"MJGang",
        card: cd,
        eatFlag:EatFlag_fuLuShou()
    });
}

// 向服务器发送吃牌
function HZChiToServer_fuLuShou(eatCards, biCards){
    if (MjClient.rePlayVideo != -1) {
        return; // 回放时候不能请求
    }

    var tData = MjClient.data.sData.tData;
    MjClient.gamenet.request("pkroom.handler.tableMsg", {
        cmd: "MJChi",
        card: tData.lastPutCard
    });

}

// 判断招、杠列表
function checkZhaoGangList(isGang) {
    var pl = MjClient.data.sData.players[SelfUid()];
    //如果是点杠、点招则直接回给服务器
    //if(MjClient.data.sData.tData.lastDrawPlayer != SelfUid()) {
    if(!curPlayerIsMe_fuLuShou(0)) {
        cc.log(isGang ? "点杠" : "点招", MjClient.data.sData.tData.lastPutCard);
        if (isGang && MjClient.GAME_TYPE.YUE_YANG_FU_LU_SHOU == MjClient.gameType) {
            HZGangToServer_fuLuShou(MjClient.data.sData.tData.lastPutCard);
        }else {
            HZZhaoToServer_fuLuShou(MjClient.data.sData.tData.lastPutCard);
        }
        return;
    }

    //获取可招列表
    var list = [];
    var algorithm = MjClient.gameType == MjClient.GAME_TYPE.YUE_YANG_FU_LU_SHOU ? MjClient.majiang_fulushou : MjClient.majiang_fulushouErShi;
    if (isGang && MjClient.gameType == MjClient.GAME_TYPE.YUE_YANG_FU_LU_SHOU) {
        //list = algorithm.getGangList();
        list = algorithm.searchGang(pl, MjClient.data.sData);
    }else {
        //list = algorithm.getZhaoList();
        list = algorithm.searchHandZhao(pl.mjhand);
    }
    cc.log("弹窗选择", list);
    if (list.length > 1) {
        //弹窗选择
        MjClient.playui.showZhaoGangListLayer(isGang, list);
    }
    else if(list.length == 1){
        if(isGang)
            HZGangToServer_fuLuShou(list[0]);
        else
            HZZhaoToServer_fuLuShou(list[0]);
    }
    else {
        if(isGang)
            HZGangToServer_fuLuShou(MjClient.data.sData.tData.lastPutCard);
        else
            HZZhaoToServer_fuLuShou(MjClient.data.sData.tData.lastPutCard);
    }
}

/**
 设置牌的渲染
 mjNode:麻将node
 mjNum:麻将tag
 type:类型，1:手牌 2：吃牌 3：打的牌
 */
function setCardSprite_fuLuShou(mjNode, mjNum, type, isTurn){

    //MjClient.cardPath_fuLuShou = "playing/fulushou/card/";
    if(type == 1){
        mjNode.loadTexture(MjClient.cardPath_fuLuShou+"hand_" + mjNum + ".png");
    }
    if(type == 2){
        mjNode.loadTexture(MjClient.cardPath_fuLuShou+"out_" + mjNum + ".png");
        if(isTurn){
            mjNode.loadTexture("playing/fulushou/paibei_03.png");
            //mjNode.setScale(mjNode.getScale()*0.9);
        }
    }
    if(type == 3 || type == 4){
        mjNode.loadTexture(MjClient.cardPath_fuLuShou+"put_" + mjNum + ".png");
        if(isTurn){
            mjNode.loadTexture("playing/fulushou/paibei_01.png");
        }
    }
    mjNode.tag = mjNum;
}

// 新的听牌
function newCheckTingCards_fuLuShou(putCard){
    // return;
    // if(MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ || MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP){
        //听牌检测
        var sData = MjClient.data.sData;

        if(MjClient.data.sData.tData.tState == TableState.waitPut && curPlayerIsMe_fuLuShou(0) && putCard === undefined){
            cc.log("is waitPut....");
            postEvent("showNewTingLayer", []);
            return;
        }

        if(putCard && (!curPlayerIsMe_fuLuShou(0) || sData.tData.tState != TableState.waitPut)){
            putCard = undefined;
        }

        if(!curPlayerIsMe_fuLuShou(0))
            return;

        var pl = sData.players[SelfUid()];
        var textData;
        if(MjClient.data.sData.tData.tState == TableState.waitPut){
            if(MjClient.gameType == MjClient.GAME_TYPE.FU_LU_SHOU_ER_SHI_ZHANG) {
                textData = MjClient.majiang_fulushouErShi.getTingStats(sData, pl, putCard);
            } else {
                textData = MjClient.majiang_fulushou.getTingStats(sData, pl, putCard);
            }
            postEvent("showNewTingLayer", textData);
        }
        
    // }
}

function checkTingCards_fuLuShou(putCard){
        if(ziPai.getTingPai() != 0) {
            postEvent("showTingLayer", []);
            return;
        }
    // if(MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ || MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP){
        //听牌检测
        var sData = MjClient.data.sData;

        if(MjClient.data.sData.tData.tState == TableState.waitPut && curPlayerIsMe_fuLuShou(0) && putCard === undefined){
            cc.log("is waitPut....");
             postEvent("showTingLayer", []);
            return;
        }

        if(putCard && (!curPlayerIsMe_fuLuShou(0) || sData.tData.tState != TableState.waitPut)){
            putCard = undefined;
        }

        var pl = sData.players[SelfUid()];
        var cards = [];
        if(pl.mjhand)
        {
            if(MjClient.gameType == MjClient.GAME_TYPE.FU_LU_SHOU_ER_SHI_ZHANG) {
                cards = MjClient.majiang_fulushouErShi.getTingCards(sData, pl, putCard);
            } else {
                cards = MjClient.majiang_fulushou.getTingCards(sData, pl, putCard);
            }
        }

        postEvent("showTingLayer", cards);
    // }
}

function getPut2TingStats_fuLuShou() {
    return;

    var sData = MjClient.data.sData;
    var tData = sData.tData;

    if (tData.tState != TableState.waitPut || !curPlayerIsMe_fuLuShou(0)){
        return;
    }

    var time1 = +new Date();
    /* /////写这玩意又没用到
    var pl = sData.players[SelfUid()];
    var info;
    if (MjClient.gameType == MjClient.GAME_TYPE.FU_LU_SHOU_ER_SHI_ZHANG) {
        info = MjClient.majiang_fulushouErShi.put2TingStats(sData, pl);
    } else {
        info = MjClient.majiang_fulushou.put2TingStats(sData, pl);
    }
    */
    var time2 = +new Date();
    //cc.log("getPut2TingStats_fuLuShou time@@ ", time2 - time1);
    //console.log("put2TingStats@@ ", JSON.stringify(info));
}
 
//双击判定
var touchTime = 0;
var deltaTime = 0;
var outTime = 0.6;
var timerId;
function update_fuLuShou() {
    var fRate = 1 / cc.director.getFrameRate();
    if(++deltaTime * fRate > outTime) {
        touchTime = 0; //超时重置touchTime
        if(timerId) clearInterval(timerId);
    }
}

MjClient.movingCard_fuLuShou = null;
//MjClient.cloneCard = null;
//MjClient.putCard = null;
MjClient.hasPut = false;
MjClient.touchCell = null;
MjClient.touchCellZIndex = 0;
MjClient.copyCell = null;
function SetTouchCardHandler_fuLuShou(card,off){
    var orgPos = [];
    var isShowImgNum = false;       //触摸初始角标是否显示状态
    var cardTag = card.tag;
    var pl = getUIPlayer_fuLuShou(off);
    var mjhand = pl.mjhand;
    var cardArr = {};
    for(var i = 0;i< mjhand.length;i++){
        if(!cardArr[mjhand[i]]){
            cardArr[mjhand[i]] = 1;
        }else{
            cardArr[mjhand[i]] ++;
        }
    }

    var _node = getNode_fuLuShou(off);

    var acTime = ziPai.getSuDuType() == 0 ? 0.1 : 0.2;
    var cloneCard = null;

    var isDbClick = false;  //是否双击

    card.addTouchEventListener(function(btn,eventType){

        //禁止同时移动多个牌
        if(MjClient.movingCard_fuLuShou !== null && cc.sys.isObjectValid(MjClient.movingCard_fuLuShou) && MjClient.movingCard_fuLuShou !== btn){
            return;
        }

        if(MjClient.isRefreshNodeing){
            return;
        }

        if(eventType == ccui.Widget.TOUCH_BEGAN){
            if(touchTime) {
                //双击, 重置deltaTime，启动定时触摸结束
                isDbClick = true;
                deltaTime = 0;
                clearInterval(timerId);
                timerId = setInterval(update_fuLuShou, 1/cc.director.getFrameRate() * 1000);
            }else {
                //初次点击，启动定时下一次点击
                isDbClick = false;
                deltaTime = 0;
                touchTime = outTime;
                clearInterval(timerId);
                timerId = setInterval(update_fuLuShou, 1/cc.director.getFrameRate() * 1000);
            }

            MjClient.movingCard_fuLuShou = btn;
            //
            var beginPos = btn.getPosition();
            var touchPos = beginPos;//btn.parent.convertToWorldSpace(beginPos);
            touchPos = cc.p(touchPos.x + (0.5 - btn.anchorX) * btn.width * btn.scaleX,
                touchPos.y + (0.5 - btn.anchorY) * btn.height * btn.scaleY);
            /*
            cloneCard = btn.clone();
            setCardSprite_fuLuShou(cloneCard, cardTag, 1, false);
            cloneCard.opacity = 150;
            cloneCard.setTouchEnabled(false);
            btn.parent.addChild(cloneCard);
            //设置克隆牌的角标
            var uData = btn.getChildByName("img_num").getUserData();
            if(uData && uData.num && uData.num <= 4) {
                var num = uData.num - 1;
                cloneCard.getChildByName("img_num").setVisible(num > 1);
                if(num > 1) {
                    cloneCard.getChildByName("img_num").loadTexture("playing/fulushou/"+num+".png");
                }
            }
            */

            MjClient.touchCell = btn;
            MjClient.touchCellZIndex = btn.getLocalZOrder();
            //MjClient.copyCell = cloneCard;

            // 设置点击牌为最高层级
            var maxZOrder = -1;
            if (btn.parent && btn.parent.parent) {
                var handNode = btn.parent.parent;
                for (var i = 0; i < handNode.getChildrenCount(); i++) {
                    var zorder = handNode.getChildren()[i].getLocalZOrder();
                    if (maxZOrder < zorder) {
                        maxZOrder = zorder;
                    }
                }
            }
            btn.parent.zIndex = maxZOrder + 1;
            btn.zIndex = 40; // 写死了！！

            btn.anchorX = 0.5;
            btn.anchorY = 0.5;
            btn.x = touchPos.x;
            btn.y = touchPos.y;
            //ShowPutCardIcon_fuLuShou();

            //newCheckTingCards_fuLuShou(btn.tag);
            checkTingCards_fuLuShou(btn.tag);

            //记录起始坐标
            orgPos = [btn.x, btn.y];
            //记录初始是否可见
            var imgNum = btn.getChildByName("img_num");
            isShowImgNum = imgNum.isVisible();

            return true;
        }
        if(eventType == ccui.Widget.TOUCH_MOVED){
            if (MjClient.movingCard_fuLuShou==null) return;
            var movePos = btn.getTouchMovePosition();
            movePos = cc.pSub(movePos, btn.parent.getPosition());
            btn.x = movePos.x;
            btn.y = movePos.y;
            //拖动时牌的堆叠角标隐藏
            var imgNum = btn.getChildByName("img_num");
            if(imgNum && isShowImgNum) {
                imgNum.setVisible(false);
            }
        }
        if(eventType == ccui.Widget.TOUCH_ENDED || 
            eventType == ccui.Widget.TOUCH_CANCELED){ //fix by 千千 统一处理
            if (MjClient.movingCard_fuLuShou==null) return;
            MjClient.movingCard_fuLuShou = null;
            var btnParent = btn.parent;
            var btnTag = btn.tag;
            var btnName = btn.name;
            var scale_x = btn.scaleX;
            var endPos = btn.getTouchEndPosition();
            var pl = getUIPlayer_fuLuShou(0);
            var tData = MjClient.data.sData.tData;
            var cutLine = MjClient.playui.jsBind.cutLine._node;
            var bRestorePos = false;  //是否进行了坐标还原

            // if(cloneCard && cc.sys.isObjectValid(cloneCard)){
            //     cloneCard.opacity = 255;
            // }

            //是否有效的双击
            var dbClickValid = isDbClick && touchTime; //连击并且仍处于计时中
            var pTow = btnParent.convertToWorldSpace(btn.getPosition());

            //判断向下拖动并且超过一定Y方向移动距离
            var h = btn.getBoundingBox().height;
            var bPos = btn.getTouchBeganPosition();
            var yMoved = bPos.y - endPos.y;

            cc.log("能不能打出去", IsTurnToMe(), tData.tState == TableState.waitPut, pl.mjState == TableState.waitPut,
                !MjClient.isCommon, cutLine.visible, endPos.y >= cutLine.y, !MjClient.hasPut, pTow.y, h/3, dbClickValid, yMoved);
            
            if(IsTurnToMe() && tData.tState == TableState.waitPut && pl.mjState == TableState.waitPut &&
                !MjClient.isCommon && cutLine.visible && (endPos.y >= cutLine.y || (pTow.y <= h/3 && yMoved >= 10) || dbClickValid) && !MjClient.hasPut/* && 
                !MjClient.isInOp*/)
            {
                btn.removeFromParent();

                //出牌后直接落牌，add by maoyu
                var putNode = MjClient.playui._downNode.getChildByName("put");
                putNode.removeAllChildren();
                var putCard = getNewCard_fuLuShou(btnTag, 3 ,off);
                putCard.scaleX = putCard.width/putNode.width - 0.16;
                putCard.scaleY = putCard.width/putNode.width - 0.06;
                putCard.x = putCard.width/2;
                putCard.y = putCard.height/2;
                putNode.addChild(putCard);
                putNode.visible = true;
                var pos = putNode.getUserData().pos;
                putNode.setScale(0);
                putNode.setPosition(cc.p(pos.x ,pos.y - 200));
                var action1 = cc.scaleTo(acTime,putNode.getUserData().scale);
                var action2 = cc.moveTo(acTime,pos.x,pos.y);
                putNode.stopAllActions();
                putNode.runAction(cc.spawn(action1,action2));

                MjClient.hasPut = true;
                MjClient.isCommon = false;
                //刷新手牌数据统一调sortCard接口，而且不应该立刻在这里改变，应该在接到MJPut消息后处理
                //MjClient.HandCardArr[btnParent.tag].splice(parseInt(btnName),1);
                HZPutCardToServer_fuLuShou(btnTag);
                ShowPutCardIcon_fuLuShou();
            } else {
                MjClient.touchCell = null;
                MjClient.copyCell = null;

                //cloneCard.removeFromParent();
                //ShowPutCardIcon_fuLuShou();

                btn.zIndex = MjClient.touchCellZIndex;
                //坐标还原(因为加入了双击需求，此处不能再设还原动画了)
                /*
                btn.setTouchEnabled(false);
                var moveAct = cc.MoveTo.create(0.2, cc.p(orgPos[0], orgPos[1]));
                var cb = cc.callFunc(function() {
                    btn.setTouchEnabled(true);      //还原动作过程中屏蔽点击
                });
                btn.runAction(cc.sequence(moveAct, cb));
                */
                btn.setPosition(cc.p(orgPos[0], orgPos[1]));

                //还原时牌的堆叠角标显示
                var imgNum = btn.getChildByName("img_num");
                if(cc.sys.isObjectValid(imgNum)) {
                    imgNum.setVisible(isShowImgNum);
                }
                bRestorePos = true;
            }

            //判断是否需要隐藏听牌
            if (bRestorePos && IsTurnToMe() && tData.tState == TableState.waitPut 
                && pl.mjState == TableState.waitPut && !MjClient.hasPut)
            {
                postEvent("showTingLayer", []);
                postEvent("showNewTingCard", []);
            }  
        }
    });
}

//自动打牌
function autoPutCard() {
    var pl = MjClient.data.sData.players[SelfUid()];
    if(!pl.autoCard || !cc.sys.isObjectValid(pl.autoCard) || MjClient.hasPut || !curPlayerIsMe_fuLuShou(0)) {
        return;
    }
    var btn = pl.autoCard;

    //出牌后直接落牌，add by maoyu
    var putNode = MjClient.playui._downNode.getChildByName("put");
    putNode.removeAllChildren();
    var putCard = getNewCard_fuLuShou(btn.tag, 3 ,0);
    putCard.scaleX = putCard.width/putNode.width - 0.16;
    putCard.scaleY = putCard.width/putNode.width - 0.06;
    putCard.x = putCard.width/2;
    putCard.y = putCard.height/2;
    putNode.addChild(putCard);
    putNode.visible = true;
    var pos = putNode.getUserData().pos;
    putNode.setScale(0);
    putNode.setPosition(cc.p(pos.x ,pos.y - 200));
    var action1 = cc.scaleTo(0.2,putNode.getUserData().scale);
    var action2 = cc.moveTo(0.2,pos.x,pos.y);
    putNode.stopAllActions();
    putNode.runAction(cc.spawn(action1,action2));

    //MjClient.hasPut = true;
    MjClient.isCommon = false;
    //MjClient.HandCardArr[btn.parent.tag].splice(parseInt(btn.name),1);
    //HZPutCardToServer_fuLuShou(btn.tag);
    checkTingCards_fuLuShou(btn.tag);
    btn.removeFromParent();
    pl.autoCard = null;
}

//根据坐标Y，添加到数组对应的位置
function _fixArrIndex_fuLuShou(arr, btnTag, btn){
    if(_isKan_fuLuShou(arr)){
        arr.push(btnTag);
    }else{
        var off_y = btn.height/4 * btn.scaleY;
        var maxH = btn.height * btn.scaleY * 3 - off_y * 2;
        if(btn.y > maxH){
            arr.push(btnTag);
        }else if(btn.y > btn.height * btn.scaleY * 2 - off_y){
            arr.splice(2,0,btnTag);
        }else if(btn.y > btn.height * btn.scaleY){
            arr.splice(1,0,btnTag);
        }else{
            arr.splice(0,0,btnTag);
        }
    }

}

//改变数组元素的位置
function _changeArrIndex_fuLuShou(arr, btnTag, btn){
    if(!_isKan_fuLuShou(arr)){
        var len = arr.length;
        for(var i = 0; i < len; i++){
            var tag = arr[i];
            if(tag == btnTag){
                arr.splice(i,1);
                break;
            }
        }
        _fixArrIndex_fuLuShou(arr, btnTag, btn);
    }
}

//数组里的是否为三个相同的牌
function _isKan_fuLuShou(arr){
    var len = arr.length;
    if(len < 3){
        return false;
    }

    var count = 1;
    var temTag = arr[0];
    for(var i = 1; i < len; i++){
        var tag = arr[i];
        if(tag == temTag){
            count += 1;
        }
    }
    if(count >= 3){
        return true;
    }
    return false;
}

//断线重连之后，显示之前玩家打的牌
function DealOffLineCard_fuLuShou(node, off){
    cc.log("====================DealOffLineCard_fuLuShou=================");
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    //cc.log("断线重连数据处理", JSON.stringify(sData));
    if(tData.tState != TableState.waitPut && tData.tState != TableState.waitEat && tData.tState != TableState.waitCard) {
        //不在打牌过程中
        return;
    }

    if(typeof(tData.lastPutCard) != "undefined" && tData.lastPutCard != -1 
        && typeof(tData.lastPutPlayer) != "undeifined" && tData.lastPutPlayer != -1){

        /*
        //如果轮到自己出牌，并且无菜单操作，不显示之前打出的牌
        //再添加一条. 如果当前我有菜单操作，并且是自摸后的菜单，则不显示之前玩家打出的牌
        //另一种情况:A->1 B:碰 C原地断线重连依然会显示A打出的牌，这样看上去可能会造成显示多牌现象
        var pl = sData.players[SelfUid()];
        if (pl && ((pl.mjState == TableState.waitPut && pl.eatFlag == 0) || 
            (pl.eatFlag != 0 && tData.lastDrawPlayer == pl.info.uid) ||
            tData.tState != TableState.waitEat)) {
            return;
        }
        */

        //无菜单操作不显示上一张打出的牌
        var pl = sData.players[SelfUid()];
        if(!pl || tData.tState != TableState.waitEat) {
            return;
        }

        //如果当前我有菜单操作，并且是自摸后的菜单，则不显示之前玩家打出的牌
        if(pl.eatFlag != 0 && tData.lastDrawPlayer == pl.info.uid) {
            return;
        }


        var uids = tData.uids;
        var selfIndex = (uids.indexOf(SelfUid()) + off) % MjClient.MaxPlayerNum_fuLuShou;
        var mjput = sData.players[uids[tData.lastPutPlayer]].mjput;
        if(uids[selfIndex] == uids[tData.lastPutPlayer] && mjput.length > 0){
            var putCard = getNewCard_fuLuShou(/*tData.lastPutCard*/mjput[mjput.length-1], 3, off);
            var putNode = node.getChildByName("put");
            putNode.scale = putNode.getUserData().scale;
            putCard.scaleX = putCard.width/putNode.width - 0.16;
            putCard.scaleY = putCard.width/putNode.width - 0.06;
            putCard.x = putCard.width/2;
            putCard.y = putCard.height/2;
            putNode.visible = true;
            putNode.setPosition(putNode.getUserData().pos);
            putNode.addChild(putCard);
        }
    }
}

//发牌
MjClient.isCommon = false;
function DealNewCard_fuLuShou(node, msg, off){
    //cc.log("======DealNewCard_fuLuShou======= " + off, JSON.stringify(msg));
    //没有发牌过来的时候直接忽略
    if(!msg.newCard){
        RemovePutCardOut_fuLuShou();
        MjClient.playui.EatVisibleCheck();
        return;
    }

    //先隐藏听牌面版
    postEvent("showNewTingLayer", []);

    //存在发牌
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var uids = tData.uids;
    var selfIndex = (uids.indexOf(SelfUid()) + off) % MjClient.MaxPlayerNum_fuLuShou;
    
    if(uids[selfIndex] == msg.uid){
        //清理之前玩家打的牌
        var lastPlayer = tData.lastPlayer;
        if(lastPlayer != -1){
            RemovePutCardOut_fuLuShou();
        }

        var isTurn = false;
        if (off != 0 && tData.isLastDraw) { // 庄家最后一张牌 其他玩家显示牌背
            isTurn = true;
        }

        var pl = sData.players[uids[selfIndex]];
        var putCard = getNewCard_fuLuShou(msg.newCard, 3, off, isTurn);
        var putNode = node.getChildByName("put");
        putNode.removeAllChildren();
        putCard.scaleX = putCard.width/putNode.width - 0.16;
        putCard.scaleY = putCard.width/putNode.width - 0.06;
        putCard.x = putCard.width/2;
        putCard.y = putCard.height/2;
        putNode.visible = true;
        putNode.addChild(putCard);

        //添加动作
        putNode.setScale(0);
        putNode.setPosition(cc.p(cc.winSize.width/2, cc.winSize.height/2+160));
        var action1 = cc.scaleTo(0.1, putNode.getUserData().scale);
        var action2 = cc.moveTo(0.1, putNode.getUserData().pos);
        putNode.stopAllActions();
        putNode.runAction(cc.spawn(action1,action2).easing(cc.easeCubicActionOut()));

        if(!msg.isCommon){
            if(MjClient.rePlayVideo == -1){
                MjClient.isCommon = true;
                var callback = function(){
                    //如果是自己则需要重新整理手牌
                    if(msg.uid == SelfUid()){
                        //下面这种刷手牌方法不高效而且福禄寿的牌标志会闪，后面改进
                        var pl = sData.players[SelfUid()];
                        if(!pl) 
                            return;
                        //重新计算一遍手牌
                        MjClient.HandCardArr = MjClient.majiang.sortCard(pl.mjhand);
                        MjClient.playui.ResetHandCard(node,off,false,true);
                        //手牌刷新后才可打
                        MjClient.isCommon = false;
                        ShowPutCardIcon_fuLuShou();
                        MjClient.playui.EatVisibleCheck();
                    }
                };
                var dt = ziPai.getSuDuType() == 0 ? 0.2 : 0.6;
                var delay = cc.delayTime(dt);
                var remove = cc.callFunc(function() {
                    RemovePutCardOut_fuLuShou(true);
                });
                var removeEnd = cc.callFunc(callback);
                var seq = cc.sequence(delay,remove,cc.delayTime(0.1),removeEnd);
                //putNode.stopAllActions();
                putNode.runAction(seq);
            }else{
                if (msg.uid == SelfUid()) {
                    MjClient.HandCardArr = MjClient.majiang.sortCard(pl.mjhand);
                } else {
                    //自己的角度进牌在netcallback中已经Push到mjhand中了
                    //这里给其它视角加上
                    pl.mjhand.push(msg.newCard);
                    MjClient.OtherHandArr[off] = MjClient.majiang.sortCard(pl.mjhand);
                }
                
                putNode.stopAllActions();
                putNode.runAction(cc.sequence(
                    cc.delayTime(0.5),
                    cc.callFunc(function(){
                        RemovePutCardOut_fuLuShou(true);
                        MjClient.playui.CardLayoutRestore(node,off);
                        if(msg.uid == SelfUid()) {
                            MjClient.playui.EatVisibleCheck();
                        }
                    })
                ));
            }
        }else{
            // MjClient.playui.EatVisibleCheck(off);
        }
    }
    else{
        //MjClient.playui.ResetOtherCard(node,off);//mod by maoyu
        MjClient.playui.ResetPutCard(node,off);
    }
}

//处理出牌
function DealPutCard_fuLuShou(node, msg, off){
    //cc.log("======DealPutCard_fuLuShou=======沃特法克 " + off);
    //cc.log("这里打牌消息", JSON.stringify(msg));
    MjClient.hasPut = false;
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var uids = tData.uids;
    var selfIndex = (uids.indexOf(SelfUid()) + off) % MjClient.MaxPlayerNum_fuLuShou;
    var pl = sData.players[SelfUid()];
    if(msg.uid == SelfUid()) {
        if(!pl)
            return;
        //重新计算一遍手牌
        MjClient.HandCardArr = MjClient.majiang.sortCard(pl.mjhand);
    }
    if(uids[selfIndex] == msg.uid)
    {
        //别人出牌或者回放时，添加动作, 进入自动摸打后自己出的牌也展示
        //if (/*SelfUid() != msg.uid || MjClient.rePlayVideo != -1*/pl.isTing)
        if (SelfUid() != msg.uid || (SelfUid() == msg.uid && (pl.isTing || pl.isTuoGuan)))
        {
            var putNode = node.getChildByName("put");
            putNode.removeAllChildren();
            var putCard = getNewCard_fuLuShou(msg.card, 3 ,off);
            putCard.scaleX = putCard.width/putNode.width - 0.16;
            putCard.scaleY = putCard.width/putNode.width - 0.06;
            putCard.x = putCard.width/2;
            putCard.y = putCard.height/2;
            putNode.addChild(putCard);
            putNode.visible = true;
            // putNode.setScale(putNode.getUserData().scale);
            putNode.setPosition(putNode.getUserData().pos);


            var pos = putNode.getUserData().pos;
            putNode.setScale(0);
            if(SelfUid() == msg.uid){
                putNode.setPosition(cc.p(pos.x ,pos.y - 100));
            }else {
                // putNode.setPosition(node.getChildByName("head").getPosition());
                putNode.y -= 150;
                putNode.x -= 100
                if(off == 1){
                    putNode.x += 230;
                }
            }
            var action1 = cc.scaleTo(0.2, putNode.getUserData().scale);
            var action2 = cc.moveTo(0.2, pos.x,pos.y);
            putNode.stopAllActions();
            putNode.runAction(cc.spawn(action1,action2).easing(cc.easeCubicActionOut()));
        }

        if(MjClient.rePlayVideo == -1 && off == 0){
            MjClient.playui.ResetHandCard(node,off,false,true);
            if(pl && ((pl.isTing && pl.newSendCard) || pl.isTuoGuan)) {
                checkTingCards_fuLuShou();
                MjClient.isCommon = false;  //托管状态下出牌后还要置位false
            }
        }

        if (off == 0) {
            removeTingSign_fuLuShou(node);
        }

        if(MjClient.rePlayVideo != -1){
            RemoveHandCard_fuLuShou(node,msg.card,off);
            MjClient.playui.ResetHandCard(node,off);
        }
    }
}

function calculateHintPutList_fuLuShou() {
    if(MjClient.gameType == MjClient.GAME_TYPE.FU_LU_SHOU_ER_SHI_ZHANG) {
        MjClient.hintPutList_ziPai = MjClient.majiang_fulushouErShi.hintPutCardsToTing();
    }else {
        MjClient.hintPutList_ziPai = MjClient.majiang_fulushou.hintPutCardsToTing();
    }
}

function addTingSign_fuLuShou(node) {
    if(ziPai.getTingPai() != 0) {
        postEvent("showTingLayer", []);
        return;
    }
    var hintPutList = MjClient.hintPutList_ziPai;
    //cc.log("听牌内容", JSON.stringify(hintPutList));
    // todo 回放
    // console.log("hintPutList@@ ", hintPutList);
    if (Array.isArray(hintPutList) && hintPutList.length > 0) {
        var handNode = node.getChildByName("handNode");
        if (!handNode) {
            return;
        }
        var children = handNode.getChildren();
        for (var i = 0; i < children.length; i++) {
            var addNode = children[i];
            for (var j = 0; j < addNode.getChildren().length; j++) {
                var card = addNode.getChildren()[j];
                var tag = card.tag;
                var uData = card.getUserData();
                var bOut = false;
                if (uData && uData.bOut) {
                    bOut = true;            //只有最外层一张图显示听(并且必须可出的牌)
                }
                if (tag && hintPutList.indexOf(tag) >= 0 && bOut && card.isTouchEnabled()) {
                    var tingImg = new ccui.ImageView("playing/fulushou/ting.png");
                    tingImg.anchorX = 1;
                    tingImg.anchorY = 1;
                    tingImg.x = card.getContentSize().width-2;
                    tingImg.y = card.getContentSize().height;
                    tingImg.setName("IMG_TING");
                    card.addChild(tingImg)
                } else {
                    //card.removeAllChildren(true);
                    if(card.getChildByName("IMG_TING")) {
                        card.removeChildByName("IMG_TING");
                    }
                }
            }
        }
        cc.log("添加听牌角标");
    }
}

function removeTingSign_fuLuShou(node) {
    cc.log("移除掉了听牌角标");
    var handNode = node.getChildByName("handNode");
    if (!handNode) {
        return;
    }

    var children = handNode.getChildren();
    for (var i = 0; i < children.length; i++) {
        var addNode = children[i];
        for (var j = 0; j < addNode.getChildren().length; j++) {
            var card = addNode.getChildren()[j];
            card.removeChildByName("IMG_TING");
            //card.removeAllChildren(true);
        }
    }
}

//吃牌
function DealChiCard_fuLuShou(node, msg, off) {
    //cc.log("======DealChiCard_fuLuShou======= " + off, JSON.stringify(msg));
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var uids = tData.uids;
    var selfIndex = (uids.indexOf(SelfUid()) + off) % MjClient.MaxPlayerNum_fuLuShou;
    if (tData.curPlayer == selfIndex) {
        RemovePutCardOut_fuLuShou();
        var pl = sData.players[uids[selfIndex]];
        var mjchi = msg.mjchi.slice();

        if(msg.uid == SelfUid()) {
            //刷新手牌
            MjClient.HandCardArr = MjClient.majiang.sortCard(pl.mjhand);
        } else {
            if(MjClient.rePlayVideo != -1) {
                MjClient.OtherHandArr[off] = MjClient.majiang.sortCard(pl.mjhand);
            }
        }
        MjClient.playui.ResetHandCard(node, off);

        //吃牌动作
        var eatNode = node.getChildByName("eatNode");
        var parent = new cc.Node();
        var cardWidth = 0;
        //先把吃牌排序(上至下->红绿黑排序, 且吃的那张永远在中间)
        var sortType = 1;
        if(node.getName() == "down" || node.getName() == "xing") {
            sortType = 2;
        }
        SortChiCard_fuLuShou(mjchi, tData.lastPutCard, sortType);
        for (var i = 0; i < mjchi.length; i++) {
            var card = getNewCard_fuLuShou(mjchi[i], 2, off);
            /*
            if (i == 2) {
                card.setColor(cc.color(170, 170, 170));
            }
            */

            cardWidth = card.width //*eatNode.scaleX;
            //var childCount = parent.childrenCount;
            card.zIndex = 4 - i;
            card.x = 0;
            var off_y = getOffY_fuLuShou(node, card);
            if(node.getName() == "down" || node.getName() == "xing") {
                card.y = i * off_y;
            }else {
                card.y = card.zIndex * off_y;
            }
            //card.y = off_count * getOffY_fuLuShou(node, card);
            setChiCardAnchorPoint_fuLuShou(node, card);
            parent.addChild(card);
        }

        var selfColCount = 1;
        eatNode.addChild(parent);
        var parentPos = getChiCardParentPosition_fuLuShou(node, cardWidth, off, selfColCount);
        var moveX0 = 0;
        var outNodeCount = eatNode.getChildrenCount();
        if (outNodeCount > 0) {
            if (node.getName() == "down" || node.getName() == "left") {
                moveX0 = parentPos.x + 3 * cardWidth;
            } else if (node.getName() == "right" || node.getName() == "xing") {
                moveX0 = parentPos.x - 3 * cardWidth;
            }
        }
        parent.x = moveX0;
        parent.y = parentPos.y;
        //setCardParentPosY_fuLuShou(node, parent);
        var action2 = cc.moveTo(0.16, parentPos.x, parentPos.y);
        var callback = function() {
            MjClient.isInOp = false;
            // parent.removeFromParent(true);
            // MjClient.playui.ResetOtherCard(node, off);
        };
        parent.runAction(cc.sequence(action2, cc.delayTime(1.2), cc.callFunc(callback)));

        ShowEatActionAnim_fuLuShou(node, ActionType_fuLuShou.CHI, off);
    }
    //MjClient.playui.CardLayoutRestore(node,off);
}

//招牌或者杠牌
function DealGangCard_fuLuShou(node, msg, off, isZhao) {
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var uids = tData.uids;
    var selfIndex = (uids.indexOf(SelfUid()) + off) % MjClient.MaxPlayerNum_fuLuShou;
    var gangUid = msg.id;
    if (tData.curPlayer == selfIndex) {
        RemovePutCardOut_fuLuShou();
        ShowEatActionAnim_fuLuShou(node, isZhao ? ActionType_fuLuShou.ZHAO : ActionType_fuLuShou.GANG, off);

        var parent = new cc.Node();
        var eatNode = node.getChildByName("eatNode");
        var cardWidth = 0;
        var pl = sData.players[tData.uids[selfIndex] + ""];
        var gangCard;
        if(isZhao) {
            gangCard = msg.isNew ? msg.mjzhao1 : msg.mjzhao0;
        } else {
            gangCard = msg.isNew ? msg.mjgang1 : msg.mjgang0;
        }
        for (var i = 0; i < 4; i++) {
            //暗招和暗杠 己方视角三暗一明，其他视角4暗
            //明招和明杠 全明
            var card;
            if (msg.isNew) {
                if(off != 0) {
                    card = getNewCard_fuLuShou(gangCard, 2, off, true);
                }
                else {
                    //暗招
                    card = getNewCard_fuLuShou(gangCard, 2, off, i==3 ? false : true);
                } 
            } else {
                card = getNewCard_fuLuShou(gangCard, 2, off, false);
            }
            
            if(!card)
                break;
            cardWidth = card.width //*eatNode.scaleX;
            card.zIndex = 4 - i;
            card.x = 0;
            var off_y = getOffY_fuLuShou(node, card);
            if(node.getName() == "down" || node.getName() == "xing") {
                card.y = i * off_y;
            }else {
                card.y = card.zIndex * off_y;
            }
            //card.y = i * getOffY_fuLuShou(node, card);
            setChiCardAnchorPoint_fuLuShou(node, card);
            parent.addChild(card);
        }

        if(msg.id == SelfUid()) {
            //刷新手牌
            MjClient.HandCardArr = MjClient.majiang.sortCard(pl.mjhand);
        }
        MjClient.playui.ResetHandCard(node, off);

        var selfColCount = 1;
        eatNode.addChild(parent);
        var parentPos = getChiCardParentPosition_fuLuShou(node, cardWidth, off, selfColCount);
        var moveX0 = 0;
        var outNodeCount = eatNode.getChildrenCount();
        if (outNodeCount > 0) {
            if (node.getName() == "down" || node.getName() == "left") {
                moveX0 = parentPos.x + 3 * cardWidth;
            } else if (node.getName() == "right" || node.getName() == "xing") {
                moveX0 = parentPos.x - 3 * cardWidth;
            }
        }
        parent.x = moveX0;
        parent.y = parentPos.y;
        //setCardParentPosY_fuLuShou(node, parent);
        var action2 = cc.moveTo(0.16, parentPos.x, parentPos.y);
        var callback = function() {
            MjClient.isInOp = false;
        };
        parent.runAction(cc.sequence(action2, cc.delayTime(1.2), cc.callFunc(callback)));
    }
}

function setChiCardAnchorPoint_fuLuShou(node,newCard) {
    if(node.getName() == "down"){
        newCard.anchorX = 0;
        newCard.anchorY = 0;
    }else if(node.getName() == "right"){
        newCard.anchorX = 1;
        newCard.anchorY = 0;
    }else if(node.getName() == "left"){
        newCard.anchorX = 0;
        newCard.anchorY = 0;
    }else if (node.getName() == "xing"){
        newCard.anchorX = 1;
        newCard.anchorY = 0;
    }
}
function getOffY_fuLuShou(node,newCard) {
    var off_y = 0;
    if(node.getName() == "down"){
        off_y = newCard.height;
    }else if(node.getName() == "right"){
        off_y = newCard.height;
    }else if(node.getName() == "left"){
        off_y = newCard.height;
    }else if (node.getName() == "xing"){
        off_y = newCard.height;
    }
    return off_y;
}
function getChiCardParentPosition_fuLuShou(node, newCardWidth, off, selfColCount, orignColPosX) {
    selfColCount = selfColCount || 1;
    var eatNode = node.getChildByName("eatNode");
    // var parentCount = eatNode.getChildrenCount() - 1;

    var pl = getUIPlayer_fuLuShou(off);
    // var totalColCount = pl.mjpeng.length + pl.mjwei.length + pl.mjgang0.length + pl.mjgang1.length;
    var totalColCount = pl.mjchi.length + pl.mjpeng.length + pl.mjzhao0.length + 
    pl.mjzhao1.length + pl.mjgang0.length + pl.mjgang1.length;
    cc.log(totalColCount, "当前长度");

    var preColCount = totalColCount - selfColCount;
    var X = 0;
    var Y = 0;
    if(node.getName() == "down"){
        X = preColCount * newCardWidth;
        Y = 0;
    }else if (node.getName() == "right"){
        X = eatNode.width - preColCount * newCardWidth;
        Y = -eatNode.height;
    }else if (node.getName() == "left"){
        X = preColCount * newCardWidth;
        Y = -eatNode.height;
    }else if (node.getName() == "xing"){
        X = eatNode.width - preColCount * newCardWidth;
        Y = 0;
    }
    
    if (orignColPosX != undefined) {
        X = orignColPosX
    }
    return cc.p(X, Y);
}
function setCardParentPosY_fuLuShou(node, cardParent) {
    var eatNode = node.getChildByName("eatNode");
    if(node.getName() == "down"){
        cardParent.y = 0;
    }else if (node.getName() == "right"){
        cardParent.y = eatNode.height;
    }else if (node.getName() == "left"){
        cardParent.y = eatNode.height;
    }else if (node.getName() == "xing"){
        cardParent.y = 0;
    }
}

// 处理碰
function DealPengCard_fuLuShou(node, msg, off){
    cc.log("======DealChiCard_fuLuShou======= ");  
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var uids = tData.uids;
    var selfIndex = (uids.indexOf(SelfUid()) + off) % MjClient.MaxPlayerNum_fuLuShou;
    if(tData.curPlayer == selfIndex){
        RemovePutCardOut_fuLuShou();

        var parent = new cc.Node();
        var eatNode = node.getChildByName("eatNode");
        var cardWidth = 0;
        var pl = sData.players[tData.uids[selfIndex] + ""];
        var pengCard = pl.mjpeng[pl.mjpeng.length-1];
        for(var i = 0;i < 3; i++) {
            var card = getNewCard_fuLuShou(pengCard,2,off);
            cardWidth = card.width//*eatNode.scaleX;
            //var childCount = parent.childrenCount;
            card.zIndex = 4 - i;
            card.x = 0;
            var off_y = getOffY_fuLuShou(node, card);
            if(node.getName() == "down" || node.getName() == "xing") {
                card.y = i * off_y;
            }else {
                card.y = card.zIndex * off_y;
            }
            //card.y = childCount * getOffY_fuLuShou(node, card);
            setChiCardAnchorPoint_fuLuShou(node, card);
            parent.addChild(card);
        }
        eatNode.addChild(parent);

        RemoveHandCard_fuLuShou(node,pengCard,off);
        RemoveHandCard_fuLuShou(node,pengCard,off);
        MjClient.playui.ResetHandCard(node, off);
        ShowEatActionAnim_fuLuShou(node, ActionType_fuLuShou.PENG, off);


        var callback = function(){
            ShowPutCardIcon_fuLuShou();
            MjClient.isInOp = false;
            // parent.removeFromParent(true);
            // MjClient.playui.ResetOtherCard(node, off);
        };

        var parentPos = getChiCardParentPosition_fuLuShou(node, cardWidth, off, 1);
        var moveX0 = 0;
        var outNodeCount = eatNode.getChildrenCount();
        if(outNodeCount>0){
            if(node.getName() == "down" || node.getName() == "left"){
                moveX0 = parentPos.x + 3*cardWidth;
            }else if(node.getName() == "right" || node.getName() == "xing"){
                moveX0 = parentPos.x - 3*cardWidth;
            }
        }
        parent.x = moveX0;
        parent.y = parentPos.y;
        //setCardParentPosY_fuLuShou(node, parent);
        var action2 = cc.moveTo(0.16, parentPos.x,parentPos.y);
        var action3 = cc.callFunc(callback);
        parent.runAction(cc.sequence(action2, cc.delayTime(1.2), action3));
    }
}

// 处理胡
function DealHu_fuLuShou(node, msg, off){
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var selfIndex = (tData.uids.indexOf(SelfUid()) + off) % MjClient.MaxPlayerNum_fuLuShou;
    var pl = getUIPlayer_fuLuShou(off);
    if(tData.uids[selfIndex] != msg.uid){
        return;
    }
    if(pl){
        pl.eatFlag = 0;
        MjClient.playui.EatVisibleCheck();
        ShowEatActionAnim_fuLuShou(node,ActionType_fuLuShou.HU,off);
    }
}

function DealAddCard_fuLuShou(node,msg, off){
    if(MjClient.rePlayVideo == -1 && off != 0){
        return;
    }
    var cardArr = MjClient.HandCardArr;
    if(off != 0 && MjClient.rePlayVideo != -1){
        cardArr = MjClient.OtherHandArr[off];
    }
    var pl = getUIPlayer_fuLuShou(off);
    if (msg.uid == pl.info.uid) {
        cardArr.push(msg.cardList);
        if(off == 0){
            MjClient.HandCardArr = MjClient.majiang.sortByUser(cardArr);
        }else {
            MjClient.OtherHandArr[off] = MjClient.majiang.sortByUser(cardArr);
        }
    }

    MjClient.playui.ResetHandCard(node,off);
}

// 处理等待出牌
function DealWaitPut_fuLuShou(node, msg, off)
{
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var uids = tData.uids;
    var selfIndex = (uids.indexOf(SelfUid()) + off) % MjClient.MaxPlayerNum_fuLuShou;
    //if(tData.curPlayer == selfIndex)
   // {
        /*
        if (MjClient.rePlayVideo == -1)//正常打牌流程
        {
            getNewCard_changpai(node, "stand", "standPri");
        }
        else //播放录像
        {
            var pl = getUIPlayer_changpai(off);
            getNewCard_changpai(node, "up", "mjhand_replay", pl.mjhand[pl.mjhand.length-1], off);
        }
        */

        MjClient.playui.CardLayoutRestore(node, off);
    //}
}

/**
     * trace
     * @param [int] [count=10]
     */
    function trace (count) {
        var caller = arguments.callee.caller;
        var i = 0;
        count = count || 10;
        cc.log("***----------------------------------------  ** " + (i + 1));
        while (caller && i < count) {
            cc.log(caller.toString());
            caller = caller.caller;
            i++;
            cc.log("***---------------------------------------- ** " + (i + 1));
        }
    }

//清除打出的牌
function RemovePutCardOut_fuLuShou(noAction){
    //trace();
    var jsBind = MjClient.playui.jsBind;
    var uiList;
    if (MjClient.MaxPlayerNum_fuLuShou == 2) {
        uiList = [jsBind.down, jsBind.left];
    }
    else if (MjClient.MaxPlayerNum_fuLuShou == 3)
    {
        uiList = [jsBind.down, jsBind.right, jsBind.left];
    }
    else
    {
        uiList = [jsBind.down, jsBind.xing, jsBind.right, jsBind.left];
    }

    for(var i = 0;i < uiList.length;i++){
        var _node = uiList[i];
        var putNode = _node._node.getChildByName("put");
        if (!putNode)
        {
            continue;
        }

        var pl = getUIPlayer_fuLuShou(i);
        if (!noAction &&
            MjClient.data.sData.tData.xingPlayer!=MjClient.data.sData.tData.uids.indexOf(SelfUid()) &&//醒家视角时播动作有bug未解决
            pl &&
            pl.mjput.length>0 &&
            putNode.getChildren().length>0 &&
            putNode.getChildren()[0].tag == pl.mjput[pl.mjput.length-1]
        )
        {
            var outNode = _node._node.getChildByName("outNode");

            var moveX = outNode.getPosition().x;
            var outNodeChilden = outNode.getChildren();
            var outNodeCount = outNode.getChildrenCount();
            var moveY = outNode.getPosition().y;
            if (outNodeCount > 0) {
                //3 4人不换行
                if (MjClient.MaxPlayerNum_fuLuShou == 4 || MjClient.MaxPlayerNum_fuLuShou == 3) {
                    if (_node._node.getName() == "down" || _node._node.getName() == "xing" || _node._node.getName() == "right") {
                        moveX = outNode.getPosition().x - outNodeChilden[0].width * outNodeCount * outNode.getScale();
                    } else if (_node._node.getName() == "left") {
                        moveX = outNode.getPosition().x + outNodeChilden[0].width * outNodeCount * outNode.getScale();
                    }
                    moveY = outNode.getPosition().y;
                    // if (_node._node.getName() == "down" || _node._node.getName() == "xing" || _node._node.getName() == "right") {
                    //     moveX = outNode.getPosition().x - outNodeChilden[0].width * (outNodeCount % 9) * outNode.getScale();
                    // } else if (_node._node.getName() == "left") {
                    //     moveX = outNode.getPosition().x + outNodeChilden[0].width * (outNodeCount % 9) * outNode.getScale();
                    // }
                    //moveY = outNode.getPosition().y + outNodeChilden[0].height * outNode.getScale() * Math.floor(outNodeCount / 9);
                } else {
                    //2人玩法17张，换行，第二行起空6张之后开始显示。
                    var index = outNodeCount;
                    var ty = 0;
                    if (_node._node.getName() == "left"){
                        if (outNodeCount > 18){
                            index = (outNodeCount - 18 - 1) % 12 + 6 + 1;
                            ty = (1 + Math.floor((outNodeCount - 18 - 1) / 12)) * outNodeChilden[0].height * outNode.getScale();
                        }
                    }else{
                        if (outNodeCount > 18){
                            index = (outNodeCount - 1) % 18 + 1;
                            ty = Math.floor((outNodeCount - 1) / 18) * outNodeChilden[0].height * outNode.getScale();
                        }
                    }

                    if (_node._node.getName() == "down") {
                        moveX = outNode.getPosition().x - outNodeChilden[0].width * index * outNode.getScale();
                        moveY = outNode.getPosition().y + ty;
                    } else if (_node._node.getName() == "left") {
                        moveX = outNode.getPosition().x + outNodeChilden[0].width * index * outNode.getScale();
                        moveY = outNode.getPosition().y + ty;
                    }
                }
            }

            var targetPos = cc.p(moveX, moveY);
            putNode.stopAllActions();
            putNode.runAction(cc.sequence(
                cc.spawn(cc.moveTo(0.1, targetPos), cc.scaleTo(0.1, putNode.getUserData().scale*0.3)),
                cc.callFunc(function () {
                    this.removeAllChildren();
                    this.visible = false;
                }.bind(putNode))
            ));
        }
        else
        {
            putNode.removeAllChildren();
            putNode.visible = false;
        }
    }
}

//发手牌时再清理一遍
function clearMJHandCardUI_fuLuShou() {
    // var handNode = MjClient.playui._downNode.getChildByName("handNode");
    // handNode.removeAllChildren();
    var eatNode = MjClient.playui._downNode.getChildByName("eatNode");
    eatNode.removeAllChildren();
    var outNode = MjClient.playui._downNode.getChildByName("outNode");
    outNode.removeAllChildren();
    var eatNodeR = MjClient.playui._rightNode.getChildByName("eatNode");
    eatNodeR.removeAllChildren();
    var outNodeR = MjClient.playui._rightNode.getChildByName("outNode");
    outNodeR.removeAllChildren();
    var eatNodeL = MjClient.playui._topNode.getChildByName("eatNode");
    eatNodeL.removeAllChildren();
    var outNodeL = MjClient.playui._topNode.getChildByName("outNode");
    outNodeL.removeAllChildren();
    if(MjClient.MaxPlayerNum_fuLuShou == 4){
        var eatNodeX = MjClient.playui._xingNode.getChildByName("eatNode");
        eatNodeX.removeAllChildren();
        var outNodeX = MjClient.playui._xingNode.getChildByName("outNode");
        outNodeX.removeAllChildren();
    }
    RemovePutCardOut_fuLuShou(true);
}

//出牌表示状态
function ShowPutCardIcon_fuLuShou() {
    var finger = MjClient.playui.jsBind.finger._node;
    var cutLine = MjClient.playui.jsBind.cutLine._node;
    if(MjClient.hasPut) {
        cutLine.visible = false;
        finger.visible = false;
    } else {
        var tData = MjClient.data.sData.tData;
        var status = true;
        if (!IsTurnToMe() || tData.tState != TableState.waitPut) {
            status = false;
        } else {
            status = true;
            var pl = getUIPlayer_fuLuShou(0);
            if (pl.isQiHu) {
                status = false;
            }
        }

        finger.visible = status;
        cutLine.visible = status;

        if(!finger.getChildByName("animSprite")){
            var animSprite = new cc.Sprite("playing/fingerEffer/finger0.png");
            animSprite.x = 120;
            animSprite.y = 120;
            finger.addChild(animSprite);
            animSprite.setName("animSprite");
            var action = createAnimation("playing/fingerEffer/finger",13,cc.rect(0, 0,166,195),0.07);
            animSprite.runAction(cc.sequence([action]).repeatForever());
        }
    }
}

//清除手牌
function RemoveHandCard_fuLuShou(node,card,off){
    if(MjClient.rePlayVideo == -1 && off != 0){
        return;
    }
    var cardArr = MjClient.HandCardArr;
    if(off != 0 && MjClient.rePlayVideo != -1){
        cardArr = MjClient.OtherHandArr[off];
    }
    for(var i = 0;i < cardArr.length;i++){
        var groupList = cardArr[i];
        var isRemove = false;
        for(var k = 0;k < groupList.length;k++){
            if(groupList[k] == card){
                isRemove = true;
                groupList.splice(k,1);
                if(groupList.length == 0){
                    cardArr.splice(i,1);
                }
                break;
            }
        }
        if(isRemove){
            break;
        }
    }
}


// 初始化吃碰杠胡动作
function InitShowEatActionNode_fuLuShou(plNode){
    var play_tips = plNode.getChildByName("play_tips");
    for(var i = 0; i < play_tips.children.length; i++){
        play_tips.children[i].visible = false;
    }
}

// 重置吃碰杠胡动作
function resetEatActionAnim_fuLuShou()
{
    var jsBind = MjClient.playui.jsBind;
    var ui = [jsBind.down,jsBind.right,jsBind.left];
    var tData = MjClient.data.sData.tData;
    if(tData.maxPlayer == 4){
        ui = [jsBind.down, jsBind.xing, jsBind.right, jsBind.left];
    }
    var count = MjClient.MaxPlayerNum_fuLuShou;
    for(var i = 0; i < count; i++)
    {
        if(ui[i])
            InitShowEatActionNode_fuLuShou(ui[i]._node);
    }
}

//播放头像移动
function tableStartHeadMoveAction_fuLuShou(node){
    sendGPS();
    MjClient.checkChangeLocationApp();
}

//重置3家头像位置
function reConectHeadLayout_fuLuShou(node){
    var tData = MjClient.data.sData.tData;
    var down = node.getChildByName("down").getChildByName("head");
    var left = node.getChildByName("left").getChildByName("head");
    var right = node.getChildByName("right").getChildByName("head");
    var xing = node.getChildByName("xing").getChildByName("head");

    resetEatActionAnim_fuLuShou();
    setWgtLayout(down, [0.18, 0.18], [0.04, 0.05], [0, 0], false, false);
    setWgtLayout(left, [0.18, 0.18], [0.04, 0.90], [0, 0], false, false);
    setWgtLayout(right,[0.18, 0.18], [0.96, 0.89], [0, 0], false, false);
    setWgtLayout(xing,[0.18, 0.18], [0.96, 0.05], [0, 0], false, false);
}

//根据偏移获得玩家node
function getNode_fuLuShou(off){
    var _node = null;
    switch (off){
        case 0:
            _node = MjClient.playui._downNode;
            break;
        case 1:
            _node = MjClient.playui._rightNode;
            break;
        case 2:
            _node = MjClient.playui._topNode;
            break;
        default:
            break;
    }
    if(MjClient.MaxPlayerNum_fuLuShou == 2) {
        switch (off){
            case 0:
                _node = MjClient.playui._downNode;
                break;
            case 1:
                _node = MjClient.playui._topNode;
                break;
            case 2:
                _node = MjClient.playui._rightNode;
                break;
            default:
                break;
        }
    }
    if(MjClient.MaxPlayerNum_fuLuShou == 4)
    {
        switch (off){
            case 0:
                _node = MjClient.playui._downNode;
                break;
            case 1:
                _node = MjClient.playui._xingNode;
                break;
            case 2:
                _node = MjClient.playui._rightNode;
                break;
            case 3:
                _node = MjClient.playui._topNode;
                break;
            default:
                break;
        }
    }
    return _node;
}

/**
 * 通过相对于 我 的偏移量 获取 pl对象 (偏移量：uids的差)  (我的位置down:0)
 * @param  {number} off 相对于我的偏移量
 * @return {object} 玩家数据
 */
function getUIPlayer_fuLuShou(off){
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var uids = tData.uids;
    var selfIndex = uids.indexOf(SelfUid());
    selfIndex = (selfIndex + off) % MjClient.MaxPlayerNum_fuLuShou;
    if(selfIndex < uids.length){
        return sData.players[uids[selfIndex]];
    }

    return null;
}

// 获取ui头像，通过偏移值
function getUIHeadByOff_fuLuShou(off){
    var pl = getUIPlayer_fuLuShou(off);
    if(!pl)
    {
        return {};
    }

    return {
        uid: pl.info.uid,
        url: pl.info.headimgurl
    };
}

/**
 * 下载录音, 调用 播放函数
 * */
function downAndPlayVoice_fuLuShou(uid, filePath){
    var index = getUiOffByUid_fuLuShou(uid);
    //console.log("index is downAndPlayVoice" + index);
    MjClient.native.DownLoadFile(jsb.fileUtils.getWritablePath(), index + ".mp3", MjClient.remoteCfg.voiceUrl + filePath, "playVoice");
}

function getUiOffByUid_fuLuShou(uid){
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var uids = tData.uids;
    var selfIndex = uids.indexOf(SelfUid());
    var targetIndex = uids.indexOf(uid);
    return (targetIndex - selfIndex + MjClient.MaxPlayerNum_fuLuShou) % MjClient.MaxPlayerNum_fuLuShou;
}

//设置微信头像
function setWxHead_fuLuShou(node, d, off){
    if(d.uid == getUIHeadByOff_fuLuShou(off).uid){
        var nobody = node.getChildByName("nobody");
        var wxHead = nobody.getChildByName("WxHead");
        if(wxHead)
            wxHead.removeFromParent();

        var sp = new cc.Sprite(d.img);
        sp.setName("WxHead");
        nobody.addChild(sp);
        setWgtLayout(sp, [0.87, 0.87], [0.5, 0.5], [0, 0], false, true);
        COMMON_UI.addNobleHeadFrame(nobody,getUIPlayer_fuLuShou(off))
    }
}

//显示玩家庄的ui
function showUserZhuangLogo_fuLuShou(node, off){
    var tData = MjClient.data.sData.tData;
    var pl = getUIPlayer_fuLuShou(off);
    node.zIndex = 100;
    if(tData && pl){
        if(tData.uids[tData.zhuang] == pl.info.uid){
            node.visible = true;
            var linkZhuang = node.getChildByName("linkZhuang");
            if(cc.sys.isObjectValid(linkZhuang))
                linkZhuang.setVisible(false);
            //var path = "playing/gameTable/shuzi/shuzi_" + pl.linkZhuang + ".png";
            //linkZhuang.loadTexture(path);
        }else{
            node.visible = false;
        }
    }
}

//显示房主  add by sking
function showFangzhuTagIcon_fuLuShou(node,off)
{
    var pl = getUIPlayer_fuLuShou(off);
    if(!pl) //位置上没人则删掉房主标签
    {
        if(node.getChildByName("fangTag"))
        {
            node.removeChildByName("fangTag");
        }
        if(node.getChildByName("playerDirection"))
        {
            node.removeChildByName("playerDirection");
        }
        return;
    }

    var tData = MjClient.data.sData.tData;
    if (tData.owner == pl.info.uid)
    {
        if(!node.getChildByName("fangTag"))
        {
            var sp = new cc.Sprite("playing/ziPaiBanner/fangzhu.png");
            if(node.getParent().getName() == "left" || node.getParent().getName() == "down"){
                sp.setPosition(15,node.getContentSize().height);
                sp.setAnchorPoint(0,1);
            }else{
                sp.setPosition(node.getContentSize().width - 15,node.getContentSize().height);
                sp.setAnchorPoint(1,1);
            }
            sp.setName("fangTag");
            node.addChild(sp);
        }
    }
    else
    {
        if(node.getChildByName("fangTag"))
        {
            node.removeChildByName("fangTag");
        }
    }
}

// 清理ui
function clearCardUI_fuLuShou(node,off){
    mylog("clearCardUI_fuLuShou");
    var children = node.children;
    for(var i = 0; i < children.length; i++)
    {
        var ni = children[i];
        if(ni.getName() != "head"
            && ni.getName() != "handNode"
            && ni.getName() != "eatNode"
            && ni.getName() != "outNode"
            && ni.getName() != "out0"
            && ni.getName() != "handCard"
            && ni.getName() != "replayNode"
            && ni.getName() != "put"
            && ni.getName() != "ready"
            && ni.getName() != "play_tips"
            && ni.getName() != "tai_layout"
            && ni.getName() != "tingCardsNode"
            && ni.getName() != "tingCardNumNode"
            && ni.getName() != "fangTag"
            && ni.getName() != "weiSurePanel"
            && ni.getName() != "xingPai"
            //&& ni.getName() != "out_qshu_layout"
        )
        {
            ni.removeFromParent(true);
        }
        else if(ni.getName() == "play_tips")
        {
            InitShowEatActionNode_fuLuShou(ni.getParent());
        }
    }
}

function EatFlag_fuLuShou(){
    var eat = MjClient.playui.jsBind.eat;
    var eatFlag = 0;

    if(eat.hu._node.visible)
    {
        eatFlag = eatFlag + 32;
    }

    if(eat.gang && eat.gang._node.visible) {
        eatFlag = eatFlag + 8;
    }

    if(eat.zhao && eat.zhao._node.visible) {
        eatFlag = eatFlag + 4;
    }

    if(eat.chi &&　eat.chi._node.visible)
    {
        eatFlag = eatFlag + 1;
    }

    if(eat.peng._node.visible)
    {
        eatFlag = eatFlag + 2;
    }

    mylog("eatFlag" + eatFlag);
    return eatFlag;
}

function huXiScore_fuLuShou(type,card)
{
    var cardType = Math.ceil(card/10);
    var score = 0;
    switch(type)
    {
        case "peng":
            if(cardType == 1){
                score += 1;
            }else if(cardType == 3){
                score += 3;
            }
            break;
        case "kan":
            if(cardType == 1){
                score += 3;
            }else if(cardType == 3){
                score += 6;
            }
            break;
        case "chi":
            if(cardType == 1){
                score += 3;
            }else if(cardType == 3){
                score += 6;
            }
            break;
        case "zhao":
            break;
        case "gang":
            break;
    }
    return score;
}

//刷新胡息
function UpdateHuXi_fuLuShou(off){
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var score = 0;
    var pl = getUIPlayer_fuLuShou(off);
    if(!pl){
        return;
    }
    //招牌
    //score += 3;     //临时写个

    //碰
    var mjpeng = pl.mjpeng;
    if(mjpeng.length>0){
        for(var i=0;i<mjpeng.length;i++){
            score += huXiScore_fuLuShou("peng",mjpeng[i]);
        }
    }

    //吃
    

    //杠


    return score;
}

//设置转盘显示状态
function IsArrowVisible_fuLuShou(){
    var pl = getUIPlayer_fuLuShou(0);
    if (!pl)
    {
        return;
    }

    if(
        TableState.waitPut == pl.mjState ||
        TableState.waitEat == pl.mjState ||
        TableState.waitCard == pl.mjState ||
        TableState.roundFinish == pl.mjState ||
        TableState.waitJiazhu == pl.mjState ||
        TableState.isReady == pl.mjState
    )
    {
        return true;
    }else{
        return false;
    }
}

// 显示吃碰杠胡动作
function ShowEatActionAnim_fuLuShou(node, actType, off){
    var delayTime = 1;
    switch(actType)
    {
        case ActionType_fuLuShou.FANXING:
            delayTime = 1.6;
            break;
        default:
            break;
    }
    var eatActionNode = node.getChildByName("play_tips");
    if(!eatActionNode){
        return;
    }
    var eatActionChild;
    var callback = function (){
        eatActionChild.visible = false;
    };
    eatActionNode.visible = true;
    switch(actType)
    {
        case ActionType_fuLuShou.CHI:

            eatActionChild = eatActionNode.getChildByName("chi");
            eatActionChild.visible = true;
            eatActionChild.runAction(cc.sequence(cc.delayTime(delayTime), cc.callFunc(callback)));
            break;

        case ActionType_fuLuShou.PENG:

            eatActionChild = eatActionNode.getChildByName("peng");
            eatActionChild.visible = true;
            eatActionChild.runAction(cc.sequence(cc.delayTime(delayTime), cc.callFunc(callback)));
            break;

        case ActionType_fuLuShou.HU:

            eatActionChild = eatActionNode.getChildByName("hu");
            eatActionChild.visible = true;
            break;

            //招、杠
        case ActionType_fuLuShou.ZHAO:
        case ActionType_fuLuShou.GANG:
            //eatActionChild = eatActionNode.getChildByName("hu");
            //eatActionChild.visible = true;
            break;

    }
}

//显示玩家信息
function showPlayerInfo_fuLuShou(off, node){
    var pl = getUIPlayer_fuLuShou(off);
    if(pl){
        if (pl.info.uid == SelfUid()){
            MjClient.showPlayerInfo(pl.info, false, true);
        }else{
            MjClient.showPlayerInfoPlaying(pl.info);
        }
    }
}

//展示吃的牌
var initSize = null;				//吃牌背景的初始大小

function resetChiParam_fuLuShou(){

}

function setChiVisible_fuLuShou(){
    var eat = MjClient.playui.jsBind.eat;
    eat.chi._node.visible = false;
    eat.peng._node.visible = false;
    eat.hu._node.visible = false;
    eat.guo._node.visible = false;
    eat.zhao._node.visible = false;
    eat.gang._node.visible = false;
    eat.cancel._node.visible = false;

    eat.chi._node.setTouchEnabled(false);
    eat.peng._node.setTouchEnabled(false);
    eat.hu._node.setTouchEnabled(false);
    eat.guo._node.setTouchEnabled(false);
    eat.zhao._node.setTouchEnabled(false);
    eat.gang._node.setTouchEnabled(false);
    eat.cancel._node.setTouchEnabled(false);
}

doMoveCenterAction_fuLuShou = function(arr,isScale){
    arr.reverse();
    var gap = 5;
    isScale = isScale === undefined ? true : isScale;
    if(arr && arr.length > 0){
        var len = arr.length;
        var w = 0;
        for(var i = 0; i < len; i++){
            var node = arr[i];
            if(node && node.width){
                w += node.width * node.scale;
                w += gap;
            }
        }        
    }
    var size = cc.size(cc.winSize.width - cc.winSize.width*0.09, cc.winSize.height);
    var tx = (size.width - w);
    if(size.width < w){
        tx = 0;
    }
    var preNode = null;
    var oldScale = 0.4;
    for(var i = 0; i < len - 1; i++){
        var node = arr[i];
        if(i == 0){
            oldScale = node.scale;
        }

        if(node){
            node.stopAllActions();
            tx += node.width * 0.5 * node.scale + gap;
            var p = cc.p(tx, node.y);
            var ac = cc.moveTo(ziPai.acTime, p).easing(cc.easeExponentialOut(0.2));;
            node.runAction(ac);

            tx += node.width * 0.5 * node.scale;
        }
    }

    var node = arr[len - 1];
    if(node){
        node.stopAllActions();
        tx += node.width * 0.5 * node.scale + gap;
        node.x = tx;

        if(isScale){
            node.scale = 0.1;
            var ac = cc.scaleTo(0.1, oldScale).easing(cc.easeExponentialOut(0.1));
            node.runAction(ac);
        }
    }
        
};

function GetReadyVisible_fuLuShou(node, off) {
    if (off < 0) {
        node.visible = false;
        return false;
    }


    var sData = MjClient.data.sData;
    var tData = sData.tData;
    if (Object.keys(sData.players).length < tData.maxPlayer) {
        node.visible = false;
        return false;
    }

    var pl = getUIPlayer_fuLuShou(off);
    if (pl && pl.mjState == TableState.isReady && tData.tState != TableState.waitJoin && tData.tState != TableState.waitJiazhu) {
        node.visible = true;
    } else {
        node.visible = false;
    }

    return node.visible;
}

//设置玩家掉线头像
function setUserOffline_fuLuShou(node, off){
    var pl = getUIPlayer_fuLuShou(off);
    if(!pl){
        return;
    }
  
    node.getChildByName("head").getChildByName("offline").y = 80;
    node.getChildByName("head").getChildByName("offline").zIndex = 99;
    node.getChildByName("head").getChildByName("offline").visible = !pl.onLine;
    if (pl.onLine == false )
    { 
        var _offLineNode = node.getChildByName("head").getChildByName("offline");
        _offLineNode.unscheduleAllCallbacks();
        _offLineNode.schedule(function(){
            var _timeNode = _offLineNode.getChildByName("offLineTime");
            if (!_timeNode) {

                _timeNode = new ccui.Text();
                _timeNode.setName("offLineTime");
                _timeNode.setFontSize(26);
                _offLineNode.addChild(_timeNode)

                if(MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP)
                    _timeNode.setFontSize(30);
            }
            else
            {
                _timeNode.visible = true;
            }

            _timeNode.setPosition(cc.p(_offLineNode.getContentSize().width/2,_offLineNode.getContentSize().height*0.8));

            if (pl.offLineTime)
            {
                var _currentTime = new Date().getTime();
                var _showTime = _currentTime - pl.offLineTime;
                _timeNode.setString(MjClient.dateFormat(new Date(_showTime),"mm:ss"));
            }
            else
            {
                _timeNode.setString("");
            }
        });
    }
}

//显示玩家文字
function showUserChat_fuLuShou(node, off, msg){
    var tData = MjClient.data.sData.tData;
    if(msg.type == 4 && off == 0 && tData.roundNum==tData.roundAll ){ //位置截取
        var geogData = [];
        for (var i = 0; i < tData.uids.length; i++) {
            var pl = MjClient.data.sData.players[tData.uids[i]];
            if (pl && pl.locationMsg) {
                geogData.push(pl.locationMsg);
            }
        }

        if (geogData.length == tData.maxPlayer)
        {
            var displayCount = 0;
            for(var i=0; i<geogData.length; i++)
            {
                for(var j=i+1; j<geogData.length; j++)
                {
                    var plyoneV = new Array();
                    var plytwoV = new Array();
                    plyoneV = geogData[i].split(";");
                    plytwoV = geogData[j].split(";");
                    var plone = getUIPlayerByUID(plyoneV[3]);
                    var _oneLatitude = plone.info.location.latitude;
                    var _oneLongitude = plone.info.location.longitude;
                    if(!_oneLatitude)  _oneLatitude = plyoneV[0];
                    if(!_oneLongitude)  _oneLongitude =  plyoneV[1];

                    var pltwo = getUIPlayerByUID(plytwoV[3]);
                    var _twoLatitude = pltwo.info.location.latitude;
                    var _twoLongitude = pltwo.info.location.longitude;
                    if(!_twoLatitude) _twoLatitude = plytwoV[0];
                    if(!_twoLongitude) _twoLongitude =  plytwoV[1];

                    var distance = MjClient.native.CalculateLineDistance(_oneLatitude, _oneLongitude, _twoLatitude, _twoLongitude);
                    if( distance < 50 && distance >=0 )
                    {
                        displayCount++;
                        break;
                    }
                }

                if (displayCount>0)
                {
                    break;
                }
            }

            //add by sking 当有人距离小于500米 时候提示
            if(displayCount >= 1 && !tData.matchId)
            {
                if (tData.maxPlayer == 3)
                    MjClient.Scene.addChild(new showDistance3PlayerLayer());
                else if(tData.maxPlayer == 4)
                    MjClient.Scene.addChild(new showDistanceLayer());
            }
        }

        return;
    }

    var pl = getUIPlayer_fuLuShou(off);
    //var uid = msg.uid;
    var type = msg.type;
    var message = "";
    if(msg.msg.text){
        message = msg.msg.text;
    }else{
        message = msg.msg;
    }
 
    var num = msg.num;

    if(pl && msg.uid == pl.info.uid)
    {
        if(type == 0)
        {
              
            node.getParent().visible = true;
            node.setString(message);

            var callback = function()
            {
                node.getParent().visible = false;
            };

            node.getParent().width = node.stringLength * node.fontSize + 72;
            node.runAction(cc.sequence(cc.delayTime(2.5), cc.callFunc(callback)));
        }
        else if(type == 1)
        {
            node.getParent().visible = true;
            cc.log("********************************************");
            cc.log(message);

            node.setString(message);
            var callback = function()
            {
                node.getParent().visible = false;
            };

            var musicnum = msg.num + 1;

            //var one = node.getCustomSize().width / 20.0;
            node.getParent().width = node.stringLength * node.fontSize + 72;
            var voiceType = /*msg.msg.voiceType == 0 ? "normal" :*/ MjClient.gameType;
            playEffect(GameSound4Chat[voiceType][getRandomRange(0,GameSound4Chat[voiceType].length-1)] + musicnum, false, pl.info.sex);
            node.runAction(cc.sequence(cc.delayTime(2.5), cc.callFunc(callback)));
        }
        else if(type == 2)
        {
            var em_node = node.getParent().getParent().getChildByName("emoji");
            PlayEmojiAct(em_node, msg.num);
        }
        else if(type == 3)//播放录音
        {
            playRecord(node, num, message);
        }
        else if (type == 5) // 转运道具
        {
            var em_node = node.getParent().getParent().getChildByName("emoji");
            playZhuanYunPropAct(em_node, msg.num);
        }
    }
}

/**
 * 当前玩家是不是自己
 * @param  {number} off 和‘我’在uids的下标的差
 * @return {bool} true:轮到我操作  false:不是我在操作
 */
function curPlayerIsMe_fuLuShou(off){
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    if(tData.tState == TableState.waitReady){
        return false;
    }
    var selfIndex = tData.uids.indexOf(SelfUid());
    selfIndex = (selfIndex + off)%MjClient.MaxPlayerNum_fuLuShou;
    return selfIndex == tData.curPlayer;
}

function getVisablePlayerCount_fuLuShou(){
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var uids = tData.uids;
    var count = 0;
    for(var i = 0;i < uids.length;i++){
        if(uids[i] != 0){
            count ++;
        }
    }
    return count;
}

/**
 * 获取醒家相对我的位置偏移 (醒家和我的距离) uids下标的差
 * @return {number} [description]
 */
function getXingPlayerIndex_fuLuShou(){
    if(MjClient.MaxPlayerNum_fuLuShou != 4){
        return -1;
    }
    if(getVisablePlayerCount_fuLuShou() < 3){
        return -1;
    }
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var zhuang = tData.zhuang;
    if(zhuang == -1){
        zhuang = 0;
    }
    var xingIndex = (zhuang + 2 + MjClient.MaxPlayerNum_fuLuShou) % MjClient.MaxPlayerNum_fuLuShou;
    var selfIndex = tData.uids.indexOf(SelfUid());
    xingIndex = (xingIndex - selfIndex + MjClient.MaxPlayerNum_fuLuShou) % MjClient.MaxPlayerNum_fuLuShou;
    return xingIndex;
}

/**
 * 获取 我和off的距离（我和off在uids的下标的差） (如果醒家,醒家传过来的off固定是2)
 * @param  {number} off 在ui层上的位置 (down=0 right=1 left/top=3 xing=2)
 * @return {number} 返回偏移后的resoff  则 selfIndex 和 off位置的玩家 的距离,
 *                  提供 getUIPlayer_fuLuShou(resoff) 获取 off位置玩家数据
 */
function getOffByXing_fuLuShou(off){
    var resOff = off
    if(MjClient.MaxPlayerNum_fuLuShou != 4){
        return resOff;
    }
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var zhuang = tData.zhuang;
    //当庄还没确定的时候
    if(zhuang == -1){
        zhuang = 0;
    }
    var xingIndex = (zhuang + 2 + MjClient.MaxPlayerNum_fuLuShou) % MjClient.MaxPlayerNum_fuLuShou;
    //开局之后的判断
    var selfIndex = tData.uids.indexOf(SelfUid());
    if(selfIndex == xingIndex){ // xing为off固定为2， 参数off
        resOff = (2 + off) % MjClient.MaxPlayerNum_fuLuShou;
    }else{
        // 如果我的下家是醒家，且是ui层传过来的是位置是1 则跳过
        if((selfIndex + 1 + MjClient.MaxPlayerNum_fuLuShou) % MjClient.MaxPlayerNum_fuLuShou == xingIndex && off == 1){
            resOff = off + 1;

            // 如果我的上家是醒家，且是ui层传过来的是位置是3 则跳过
        }else if((selfIndex -1 + MjClient.MaxPlayerNum_fuLuShou) % MjClient.MaxPlayerNum_fuLuShou == xingIndex
            && off == MjClient.MaxPlayerNum_fuLuShou - 1){
            resOff = off - 1;

            // 如果我的上家是醒家, 且 传过来的是位置是2 , (发表情时发的是2）
        }else if( off==2 ){
            if((selfIndex + 1 + MjClient.MaxPlayerNum_fuLuShou) % MjClient.MaxPlayerNum_fuLuShou == xingIndex ){
                resOff = 1;
            }
            if((selfIndex - 1 + MjClient.MaxPlayerNum_fuLuShou) % MjClient.MaxPlayerNum_fuLuShou == xingIndex ){
                resOff = 3;
            }
        }
    }
    return resOff;
}

//重新开始后，重置MjClient.HandCardArr
function resetHandAfterBegin_fuLuShou(){
    var sData = MjClient.data.sData;
    var pl = sData.players[SelfUid() + ""];
    if(pl.mjState == TableState.isReady){
        MjClient.HandCardArr = [];
    }
}

//设置飘分标志
function setPiaoFlag_fuLuShou(node, off) {
    node.visible = false;
    var tData = MjClient.data.sData.tData;
    var pl = getUIPlayer_fuLuShou(off);
    if (!pl || tData.areaSelectMode.piaoType == 3 || pl.piaoFen == -1) {
        return;
    }
    node.loadTexture("playing/ziPaiBanner/bupiao.png");
    node.visible = true;

    if (tData.tState == TableState.waitCard || tData.tState == TableState.waitEat || tData.tState == TableState.waitPut) {
        if(pl.piaoFen > 0) {
            node.loadTexture("playing/ziPaiBanner/piao" + pl.piaoFen + ".png");
        }
    }
    else {
        node.visible = false;
    }
}

/*
 设置弃胡状态
 */
function setQiHuState_fuLuShou()
{
    return;  //福禄寿没有弃胡
    var pl = getUIPlayer_fuLuShou(0);
    if (pl.isQiHu) {
        var _skipHuIconNode = MjClient.playui._downNode.getChildByName("head").getChildByName("skipHuIconTag");
        _skipHuIconNode.visible = true;
    }
}


function changeMJBg_fuLuShou(node, type)
{
    if (node.toString() == "[object ImageView]") {
        var oldFile = node.getRenderFile().file;
        var newFile = getNewMJBgFile_fuLuShou(oldFile, type);

        if (newFile != oldFile) {
            node.loadTexture(newFile);
        }
    }

    var childArray = node.getChildren();
    for(var index in childArray)
    {
        var child = childArray[index];
        changeMJBg_fuLuShou(child, type);
    }
}

function getNewMJBgFile_fuLuShou(oldFile, type)
{
    if (oldFile.indexOf("playing/paohuzi/") == -1)
        return oldFile;

    if (type == undefined)
        type = ziPai.getZiPaiType();//getCurrentMJBgType_fuLuShou();

    var newFile = "";
    if (type == 0) {
        if (oldFile.indexOf("playing/paohuzi/MJBg1/") != -1){
            newFile = oldFile.replace("/MJBg1", "");
            MjClient.cardPath_fuLuShou = "playing/paohuzi/";
        }else if (oldFile.indexOf("playing/paohuzi/MJBg2/") != -1){
            newFile = oldFile.replace("/MJBg2", "");
            MjClient.cardPath_fuLuShou = "playing/paohuzi/";
        }
    }
    else if (type == 1) {
        if (oldFile.indexOf("/MJBg1") != -1)
            ;
        else if (oldFile.indexOf("/MJBg2") != -1){
            newFile = oldFile.replace("playing/paohuzi/MJBg2/", "playing/paohuzi/MJBg1/");
            MjClient.cardPath_fuLuShou = "playing/paohuzi/MJBg1/";
        }
        else if (oldFile.indexOf("playing/paohuzi/") != -1) {
            newFile = oldFile.replace("playing/paohuzi/", "playing/paohuzi/MJBg1/");
            MjClient.cardPath_fuLuShou = "playing/paohuzi/MJBg1/";
        }
    }
    else if (type == 2 ) {
        if (oldFile.indexOf("/MJBg2") != -1)
            ;
        else if (oldFile.indexOf("playing/paohuzi/MJBg1/") != -1){
            newFile = oldFile.replace("/MJBg1", "/MJBg2");
            MjClient.cardPath_fuLuShou = "playing/paohuzi/MJBg2/";
        }
        else if (oldFile.indexOf("playing/paohuzi/") != -1) {
            newFile = oldFile.replace("playing/paohuzi/", "playing/paohuzi/MJBg2/");
            MjClient.cardPath_fuLuShou = "playing/paohuzi/MJBg2/";
        }
    }

    // cc.log("newFile=" + newFile);
    if (newFile != "" && !jsb.fileUtils.isFileExist(newFile)) {
        // cc.log("getNewMJBgFile file not exsit : " + newFile);
        newFile = "";
    }

    return newFile != "" ? newFile : oldFile;
}

function setHuCardMark(card){
    var huMark = ccui.ImageView("playing/paohuzi/hu.png");
    huMark.setPosition(cc.p(card.width-10,card.height-10));
    card.addChild(huMark);
}

/**
* 单选组件
* @param  {array} nodes 多个CheckBox节点组成的列表
* @param  {Function} callback 点击组件后的回调 默认值:空
* @param  {number} defaultIndex 默认选择的节点 默认值:0
* @return {obj} 返回单选组件的实例
*         var radioNode = createRadioBoxForCheckBoxs([node0, node1], function(index){}, 0);
*/
function createRadioBoxForCheckBoxs_fuLuShou(nodes, callback, defaultIndex){
    var newobj = {};

    newobj._nodeList = nodes;
    newobj._selectIndex = defaultIndex || -1;
    newobj._callback = callback || function(){};

    for (var i in newobj._nodeList){
        var item = newobj._nodeList[i];
        item._index = i;
        item.addEventListener(function(sender,type)
        {
            switch (type) {
                case ccui.CheckBox.EVENT_SELECTED:
                case ccui.CheckBox.EVENT_UNSELECTED:
                    newobj.selectItem(sender._index);
                    newobj._callback(sender._index, sender, newobj._nodeList);
                    break;
            }
        }, item);
    }

    newobj.selectItem = function(index){
        index = Number(index);
        if(index >= newobj._nodeList.length){
            cc.log('selectItem index overflow index:', index, newobj._nodeList.length)
            return;
        }

        if(index != newobj._selectIndex){
            for(var j in newobj._nodeList){
                if(parseInt(j) != index){
                    newobj._nodeList[j].setSelected(false);
                }else if(parseInt(j) == index){
                    newobj._nodeList[j].setSelected(true);
                    newobj._selectIndex = parseInt(j);
                }
            }

        }else{
            if(newobj._nodeList[index]){
                newobj._nodeList[index].setSelected(false);
                newobj._selectIndex = -1
            }
        }

        cc.log("selectItem radio select", typeof(index), index);
    }

    newobj.getSelectItem = function(){
        return newobj._nodeList[newobj._selectIndex];
    }

    newobj.getSelectIndex = function(){
        //cc.log("getSelectIndex radio select", typeof(newobj._selectIndex), newobj._selectIndex);
        return newobj._selectIndex;
    }

    newobj.setSelectCallBack = function(callback){
        newobj._callback = callback;
    }

    newobj.selectItem(newobj._selectIndex);

    return newobj;
}

/**
 *
 * @param {ImageView} backImageView
 */
function changeGameBg_fuLuShou(backImageView)
{
    var type = ziPai.getGameBgType();
    type = typeof(type) == "undefined" ? 0 : type;
    /***************************************************
        福禄寿换第一张桌面, 由于资源放在共用目录下，
        不能直接替换bg0.png, 因此这里把type=0转一下
    ***************************************************/
    type = type == 0 ? 4 : type;
    var file = "playing/gameTable/bg" + type + ".jpg";

    /*
    var file = "playing/gameTable/titleBg" + type + ".png";
    switch(type){ 
        case 3:
            file = "playing/gameTable/titleBg2.png";
        break;
    }
    */
    if (jsb.fileUtils.isFileExist(file))
        backImageView.loadTexture(file);
};

//是否显示离开按钮（包括准备阶段）
function isShowBackBtn_fuLuShou(){
    if(IsInviteVisible()){
        return true;
    }else{
        var sData = MjClient.data.sData;
        var tData = sData.tData;
        if(TableState.waitReady == tData.tState){
            return false;
        }
        return false;
    }
};

/**
 * 播放起手胡动画
 */
function playQiShouHuAnim_fuLuShouErShiZhang(node, eD, off, cb){
    if (MjClient.gameType != MjClient.GAME_TYPE.FU_LU_SHOU_ER_SHI_ZHANG) {
        return;
    }

    var pl = getUIPlayer_fuLuShou(off);
    if (!pl) {
        return;
    }

    //根据方位off设置node坐标
    var x = 0, y = 0;
    if (off == 0) {
        x = cc.winSize.width * 0.5;
        y = cc.winSize.height * 0.5;
    } else if (off == 1) {
        if (MjClient.MaxPlayerNum_fuLuShou == 2) {
            x = cc.winSize.width * 0.2;
            y = cc.winSize.height * 0.7;
        } else {
            x = cc.winSize.width * 0.8;
            y = cc.winSize.height * 0.7;
        }
    } else if (off == 2) {
        x = cc.winSize.width * 0.2;
        y = cc.winSize.height * 0.7;
    } else {
        return;
    }

    node.setPosition(cc.p(x, y));
    node.setLocalZOrder(999);

    var uid = pl.info.uid;
    var startHuNums = eD.startHuNums[uid];
    var startHuCards = eD.startHuCards[uid];

    //解析要亮的牌型和图标
    var cards = [];
    //缺一色、板板胡全亮
    if (startHuCards.isQueYiSe) {
        var item = {};
        item.name = "queyise";
        item.cards = startHuCards.mjhand;
        cards.push(item);
    }
    if (startHuCards.isBanBanHu) {
        var item = {};
        item.name = "banbanhu";
        item.cards = startHuCards.mjhand;
        cards.push(item);
    }
    //六六顺(两组以上刻子)
    if (startHuCards.keZiArr && startHuCards.keZiArr.length >= 2) {
        var item = {};
        item.name = "liuliushun";
        item.cards = [];
        item.cards.push(startHuCards.keZiArr[0]);
        item.cards.push(startHuCards.keZiArr[1]);
        cards.push(item);
    }
    //大四喜(取一组)
    if (startHuCards.daSiXiArr && startHuCards.daSiXiArr.length > 0) {
        var item = {};
        item.name = "dasixi";
        item.cards = [];
        item.cards.push(startHuCards.daSiXiArr[0]);
        cards.push(item);
    }

    //小胡牌型展示
    var down = MjClient.playui._downNode
    var gap = 2;        //牌间隙
    var groupGap = 20;  //牌组间隙
    var yGap = 6;       //行间隙
    var showXiaoHu = function(item) {
        //node.removeAllChildren();
        var children = node.getChildren();
        for (var i = 0; i < children.length; i++) {
            if (children[i] && children[i].getName() != "img_name") {
                children[i].removeFromParent();
            }
        }
        item.cards.sort(function(a, b) {
            return a - b;
        });
        var len = 0, card = 0;
        if (item.name == 'queyise' || item.name == 'banbanhu') {
            len = item.cards.length;
        }
        else if (item.name == 'liuliushun') {
            len = 6;
        }
        else if (item.name == 'dasixi') {
            len = 4;
        }
        //先设置容器大小
        var out = down.getChildByName("out0").clone();
        var w = out.getContentSize().width;
        var h = out.getContentSize().height;
        var pnlHeight = h * 2 + yGap; //node.getContentSize().height;
        var pnlWidth = w * len + (len - 1) * gap;   //容器宽度
        pnlWidth += item.name == 'liuliushun' ? groupGap : 0;
        pnlWidth /= len > 10 ? 2 : 1;       //缺一色和板板胡宽度缩一半
        pnlHeight /= len > 10 ? 1 : 2;      //六六顺和大四喜高度缩一半
        node.setContentSize(cc.size(pnlWidth, pnlHeight));
        var imgFlag = node.getChildByName("img_name");
        imgFlag.loadTexture("playing/fulushou/" + item.name + ".png");
        imgFlag.setPosition(cc.p(pnlWidth/2, pnlHeight + imgFlag.getContentSize().height/4));

        //再摆放亮牌
        for (var i = 0; i < len; i++) {
            card = item.cards[i];
            var out = down.getChildByName("out0").clone();
            if (item.name == 'liuliushun') {
                card = i < 3 ? item.cards[0] : item.cards[1];
            }
            if (item.name == 'dasixi') {
                card = item.cards[0];
            }
            
            //牌坐标
            var x = 0, y = 0;
            if (i < 10) {
                x = (w + gap) * i + w/2;
                y = len < 10 ? pnlHeight/2 : h/2;
            } 
            else {
                x = (w + gap) * (i - 10) + w/2;
                y = h + yGap + h/2;
            }

            if (item.name == 'liuliushun') {
                x += i < 3 ? 0 : groupGap;
            }
            out.visible = true;
            out.setPosition(cc.p(x, y));
            out.setAnchorPoint(cc.p(0.5, 0.5));

            setCardSprite_fuLuShou(out, card, 2);
            node.addChild(out);
        }
    };

    node.visible = true;
    node.setOpacity(0);

    var dt = 2;
    var idx = 0;
    var callBack = function(){
        //var data = node.getUserData();
        node.stopAllActions();
        var item = cards[idx];
        if (idx >= cards.length || !item) {
            node.visible = false;
            if (cb)
                cb();
            return;
        }
        showXiaoHu(item);
        var fade1 = cc.FadeTo(0.2, 255);
        var fade2 = cc.FadeTo(0.2, 0);
        var delay = cc.DelayTime(dt);
        node.runAction(cc.sequence(fade1, delay, fade2, cc.callFunc(callBack)));
        idx++;
    }
    
    //node.setUserData({idx:0, cards:cards});
    node.runAction(cc.sequence(cc.delayTime(0.000001), cc.callFunc(callBack)));

    return true;
}

function _checkIsAddGroup_fuLuShou(){
    var cardArr = MjClient.HandCardArr;
    var _node = getNode_fuLuShou(0);
    //根据牌的类型获得需要添加的节点
    var addNode = _node.getChildByName("handNode");
    if(!addNode){
        return;
    }

    var childNum = addNode.childrenCount;
    //有新增
    if(MjClient.addGroupIndex == 0){
        //添加在前面
        for(var i = 0; i < childNum; i++){
            var cardParent = addNode.getChildByTag(i);
            if(cardParent){
                cardParent.tag += 1; 
            }
        }

    }else if(MjClient.addGroupIndex == cardArr.length){
        //添加在后面

    }
}

function _hasValueInArr_fuLuShou(arr,value){
    var len = arr.length;
    for(var i = 0; i < len; i++){
        var temp = arr[i];
        if(temp == value){
            return true;
        }
    }
    return false;
}

function _checkGroupList_fuLuShou(groupList,tagName){
    var _node = getNode_fuLuShou(0);
    //根据牌的类型获得需要添加的节点
    var addNode = _node.getChildByName("handNode");
    if(!addNode){
        return;
    }

    var cardParent = addNode.getChildByTag(tagName);
    // if(cardParent)cardParent.removeAllChildren();
    // return;


    if(cardParent){
        var len = groupList.length;
        if(cardParent.childrenCount >= 4 && cardParent.childrenCount >= groupList.length){
            cardParent.removeAllChildren();
            return;
        }

        for(var i = 0; i < len; i++){
            var mjName = groupList[i];
            var card = cardParent.getChildByName(i);
            if(card && card.tag != mjName){
                card.removeFromParent(true);
                card = null;
            }else{

            }
        }
        for(var j = len; j < 4; j++){
            var card = cardParent.getChildByName(j);
            if(card && 
                (!_hasValueInArr_fuLuShou(groupList,card.tag) || 
                    hasSameChild_fuLuShou(cardParent) ))// || cardParent.childrenCount > groupList.length))
            {
                card.removeFromParent();
            }
        }

        //当拖动时，一列中有相同的两张牌时 不会删牌的问题
        if(cardParent.childrenCount > groupList.length){
            for(var j = len; j < 4; j++){

                if(cardParent.childrenCount <= groupList.length){
                    break;
                }

                var card = cardParent.getChildByName(j);
                if(card && 
                    (!_hasValueInArr_fuLuShou(groupList,card.tag) || 
                        hasSameChild_fuLuShou(cardParent) || cardParent.childrenCount > groupList.length))
                {
                    card.removeFromParent();
                }
            }
        }

    }
}

//一列中是否是相同的牌
function hasSameChild_fuLuShou(cardParent){
    var count = cardParent.childrenCount;
    var mjNum = -1;
    var sameNum = 0;
    for(var i = 0; i < count; i++){
        var child = cardParent.getChildByName(i);
        if(child){
            if(mjNum == -1){
                mjNum = child.tag;
                sameNum = 1;
            }else{
                if(mjNum == child.tag){
                    sameNum += 1;
                }
            }
        }
    }

    if(count > 0 && sameNum == count){
        return true;
    }
    return false;
}

//通过名字和tag 查找节点
function findChildByNameAndIndex_fuLuShou(cardParent, mjNum, index){
    var child = cardParent.getChildByName(index);
    if(!child){
        var count = cardParent.childrenCount;
        for(var i = index+1; i < 4; i++){
            child = cardParent.getChildByName(i);
            if(child && child.tag == mjNum){
                return child;
            }
        }
    }

    return child;
}

function refreshHandCard_fuLuShou(tagName,index,mjNum,off){
    if(off != 0){
        return;
    }
    var _node = getNode_fuLuShou(off);
    //根据牌的类型获得需要添加的节点
    var addNode = _node.getChildByName("handNode");
    if(!addNode){
        return;
    }
    
    //var parentCount = addNode.childrenCount;
    //首先根据name判断cpNode中是否已经添加
    var cardParent = addNode.getChildByTag(tagName);
    if(!cardParent){
        cardParent = new cc.Node();
        cardParent.tag = tagName;
        // cardParent.setName(0);           //用于标记子节点的name,用于排序
        addNode.addChild(cardParent);
        // SetTouchCardHandler_fuLuShou(cardParent);
    }

    var newCard = findChildByNameAndIndex_fuLuShou(cardParent, mjNum, index);

    if(!newCard){
        newCard = getNewCard_fuLuShou(mjNum,1,off);
        
        var scale_y = newCard.scaleY;
        var posSc = 0.9;

        var beginPoint = cc.p(0,newCard.height * newCard.scale * (2 * posSc) );
        //检索当前列是否有同样的牌
        var cards = cardParent.getChildren();
        var isHave = false;
        var sameCard;
        var sameNum = 0;
        var cardsNum = [];
        for (var i=0; i<cardCount; i++) {
            if(cards[i].tag == mjNum) {
                isHave = true;
                sameCard = cards[i];
                sameNum += 1;
                cards[i].getChildByName("img_num").setVisible(false);   //隐藏数量标识
            }
            cardsNum.push(cards[i].tag);
        }
        //已有相同牌就堆叠
        if(isHave) {
            newCard.y = sameCard.y-5;
            newCard.zIndex = sameCard.zIndex+1;
        } else if(cardCount==0) {
            newCard.y = beginPoint.y;
            newCard.zIndex = 1;
        } else {
            //没有就找位置
            //是否该列最小牌
            var min = Math.min.apply(Math, cardsNum);
            var max = Math.max.apply(Math, cardsNum);
            var sc = newCard.getScale();
            if(mjNum < min) {
                newCard.y = beginPoint.y;
                newCard.zIndex = 1;
            }else if(min == max) {
                newCard.y = beginPoint.y - (newCard.height * sc * posScposSc);
                newCard.zIndex = 21;
            }else if(mjNum > max) {
                newCard.y = beginPoint.y - (newCard.height * 2 * sc * posSc);
                newCard.zIndex = 31;
            }else {
                newCard.y = beginPoint.y - (newCard.height * sc * posSc);
                newCard.zIndex = 21;      
            }
        }
        newCard.x = beginPoint.x;

        cardParent.addChild(newCard);
        if(cardParent.width == 0){
            cardParent.width = newCard.width;
        } 
    }
    
    var scale_y = newCard.scaleY;

    var beginPoint = cc.p(0,100);

    var cardCount = cardParent.childrenCount;
    newCard.setName(index);
    newCard.anchorX = 0;
    newCard.anchorY = 0;
    
    doMovetoAction(newCard, cc.p(beginPoint.x, newCard.y));
    
}

function doMovetoAction(node,endP){
    node.stopAllActions();
    var ac = cc.moveTo(0.1,endP);
    node.runAction(ac);
}

function refreshNode_fuLuShou(posNode,off,needAction){
    var handNode = posNode.getChildByName("handNode");
    if(!handNode){
        //容错 正常情况不会
        return;
    }
    return;
    MjClient.isRefreshNodeing = true;   //正在刷新手牌，用于在此期间禁止拖动

    //刷新之前清除掉拖动数据
    if(MjClient.touchCell && cc.sys.isObjectValid(MjClient.touchCell)){

        if(MjClient.copyCell && cc.sys.isObjectValid(MjClient.copyCell)){
            MjClient.touchCell.x = MjClient.copyCell.x;
            MjClient.touchCell.y = MjClient.copyCell.y;

            MjClient.copyCell.removeFromParent();
        }
        MjClient.copyCell = null;
        MjClient.touchCell = null;
    }

    handNode.visible = true;
    // handNode.removeAllChildren();
    var cardArr = MjClient.HandCardArr;
    var oldLen = cardArr.length;
    var deleIndexArr = [];
    //清理空数组
    for(var k = cardArr.length - 1;k >=0;k--){
        if(cardArr[k].length == 0){
            cardArr.splice(k,1);
            deleIndexArr.push(k);
        }
    }

    _checkIsAddGroup_fuLuShou();

    var index = 0;
    for(var k = 0;k < oldLen;k++){
        var groupList = cardArr[index];

        if(_hasValueInArr_fuLuShou(deleIndexArr, k)){
            continue;
        }

        _checkGroupList_fuLuShou(groupList,k);
        for(var j = 0;j < groupList.length;j++){
            refreshHandCard_fuLuShou(k,j,groupList[j],off);
        }
        index += 1;
    }

    var handCard = posNode.getChildByName("handCard");
    var scale_x = handCard.scaleX;
    var winSize = MjClient.size;
    var type = ziPai.getZiPaiType();
    var sizeArr = [98,84,100];
    var width =sizeArr[type]; 

    var totalWidth = width * cardArr.length * scale_x;
    var index = 0;
    for(var i = 0; i < oldLen; i++){
        var addNode = handNode.getChildByTag(i);
        if(addNode && _hasValueInArr_fuLuShou(deleIndexArr, addNode.tag)){
            addNode.removeFromParent();
            addNode = null;
            continue;
        }
        if(addNode){

            addNode.tag = index;
            if(addNode.x == 0){
                addNode.x = (winSize.width - totalWidth)/2 + index * width * scale_x;
            }
            doMovetoAction(addNode, cc.p((winSize.width - totalWidth)/2 + index * width * scale_x,0));
            index += 1;
        }
    }

    //为了修复理牌时，最后一列没清除的问题
    var count = handNode.childrenCount;
    if(count > cardArr.length){
        for(var i = cardArr.length; i < count; i++){
            var child = handNode.getChildByTag(i);
            if(child){
                child.removeFromParent();
                child = null;
            }
        }
    }

    var tag = 20180625;
    MjClient.playui.removeChildByTag(20180625);

    var node = new cc.Sprite();
    MjClient.playui.addChild(node);
    node.setTag(tag);
    node.runAction(cc.sequence(cc.delayTime(0.2),
        cc.callFunc(function(){
        cc.log("clearRefreshNodeing...");
        MjClient.isRefreshNodeing = false;
        this.removeFromParent();
    }.bind(node))));
};

//吃牌排序(上至下->红绿黑，且吃牌永远在中间) 
function SortChiCard_fuLuShou(chiList, chiCard, sortType) {
    if(!chiList || !chiCard || chiList.length != 3) {
        return chiList;
    }

    sortType == sortType ? sortType : 1;
    if(sortType == 1) {
        chiList.sort(function(a, b) {
            return a - b;
        })
    }else {
        chiList.sort(function(a, b) {
            return b - a;
        })
    }
    
    var mid = 1;
    var idx = chiList.indexOf(chiCard);
    //交换吃牌和中间牌
    chiList.splice(idx, 1, ...chiList.splice(mid, 1, chiList[idx]));
    cc.log(chiList);
}