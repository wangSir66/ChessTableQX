
/* ======================================
 *  放一些共用的方法
 *  ====================================== */


// 耒阳字牌全局方法
MjClient.MaxPlayerNum_xyHongZi = 3;
MjClient.cardPath_xyHongZi = "playing/paohuzi/";
var ActionType_xyHongZi =  //图片提示
    {
        CHI:1,
        PENG:2,
        WEI:3,
        PAO:4,
        TI:5,
        HU:6,
        WANGDIAO:7,
        WANGCHUANG:8,
        WANGZHA:9,
        XIAHUO:10,
        FANXING:11,
    };

//初始化玩家金币、名字、胡息
function InitUserCoinAndName_xyHongZi(node, off){
    var pl = getUIPlayer_xyHongZi(off);
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
                    this.ignoreContentAdaptWithSize(true);
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

//向服务器发送王闯王钓操作
function HZWangChuangToServer_xyHongZi(type){
    cc.log("====================HZWangChuangToServer_xyHongZi=================");
    MjClient.gamenet.request("pkroom.handler.tableMsg", {
        cmd: "HZWangChuang",
        type: type
    });
}

//向服务器发送打牌操作
function HZPutCardToServer_xyHongZi(card){
    cc.log("====================HZPutCardToServer_xyHongZi=================");
    MjClient.gamenet.request("pkroom.handler.tableMsg", {
        cmd: "MJPut",
        card: card
    });
}

// 向服务器发送吃牌
function HZChiToServer_xyHongZi(eatCards, biCards){
    if (MjClient.rePlayVideo != -1) {
        return; // 回放时候不能请求
    }

    var tData = MjClient.data.sData.tData;
    if (biCards) {
        MjClient.gamenet.request("pkroom.handler.tableMsg", {
            cmd: "MJChi",
            eatCards: eatCards,
            biCards: biCards,
            cardNext: tData.cardNext,
            card: tData.lastPutCard
        });
    } else {
        MjClient.gamenet.request("pkroom.handler.tableMsg", {
            cmd: "MJChi",
            eatCards: eatCards,
            cardNext: tData.cardNext,
            card: tData.lastPutCard
        });
    }

}

//像服务器发送碰牌
function HZPengToServer_xyHongZi()
{
    if (MjClient.rePlayVideo != -1) return; // 回放时候不能请求
    cc.log("====================HZPengToServer_xyHongZi=================");
    MjClient.gamenet.request("pkroom.handler.tableMsg", {
        cmd: "MJPeng"
    });
}

// 向服务器发送过牌
function HZPassConfirmToServer_xyHongZi() {
    if (MjClient.rePlayVideo != -1)  {
        return; // 回放时候不能请求
    }

    var tData = MjClient.data.sData.tData;
    MjClient.gamenet.request("pkroom.handler.tableMsg", {
        cmd: "MJPass",
        eatFlag: EatFlag_xyHongZi(),
        cardNext: tData.cardNext,
        card: tData.lastPutCard
    });
}

//发送跑牌命令
function HZGangToServer_xyHongZi(type){
    if (MjClient.rePlayVideo != -1) return; // 回放时候不能请求
    cc.log("====================HZGangToServer_xyHongZi=================");
    MjClient.gamenet.request("pkroom.handler.tableMsg", {
        cmd: "MJGang",
        type: type,
        eatFlag: EatFlag_xyHongZi()
    });
}

//发送偎牌命令
function HZWeiToServer_xyHongZi(type){
    if (MjClient.rePlayVideo != -1) return; // 回放时候不能请求
    cc.log("====================HZWeiToServer_xyHongZi=================");
    MjClient.gamenet.request("pkroom.handler.tableMsg", {
        cmd: "HZWeiCard"
    });
}

//向服务器发送发牌命令
function HZNewCardToServer_xyHongZi(){
    if (MjClient.rePlayVideo != -1) return; // 回放时候不能请求
    cc.log("====================HZNewCardToServer_xyHongZi=================");
    MjClient.gamenet.request("pkroom.handler.tableMsg", {
        cmd: "HZNewCard"
    });
}

//向服务器发送胡牌命令
function MJHuToServer_xyHongZi(){
    if (MjClient.rePlayVideo != -1) return; // 回放时候不能请求
    cc.log("====================MJHuToServer=================");
    MjClient.gamenet.request("pkroom.handler.tableMsg", {
        cmd: "MJHu",
        eatFlag: EatFlag_xyHongZi()
    });
}

//添加吃的牌
function addEatCard_xyHongZi(node,name,mjNum,off){
    //根据牌的类型获得需要添加的节点
    var eatNode = node.getChildByName("eatNode");
    if(!eatNode){
        return;
    }
    var type = 2;
    //设置牌
    var newCard = getNewCard_xyHongZi(mjNum,type,off);
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
            cardParent.y = eatNode.height;
        }else if (node.getName() == "left"){
            cardParent.x = parentCount * newCard.width;
            cardParent.y = eatNode.height;
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
        off_y = -newCard.height;
        newCard.anchorX = 1;
        newCard.anchorY = 1;
    }else if(node.getName() == "left"){
        off_y = -newCard.height;
        newCard.anchorX = 0;
        newCard.anchorY = 1;
    }else if (node.getName() == "xing"){
        off_y = newCard.height;
        newCard.anchorX = 1;
        newCard.anchorY = 0;
    }
    var cardCount = cardParent.childrenCount;
    newCard.zIndex = 4 - cardCount;
    newCard.x = 0;

    newCard.y = cardCount * off_y;

    // 耒阳吃牌不颠倒顺序
    if (name.substr(0, 5) ==  "mjchi" || name.substr(0, 4) == "mjbi") {
        if (node.getName() == "right" || node.getName() == "left") {
            newCard.y = (2 - cardCount) * off_y;
        }
    }

    cardParent.addChild(newCard);
}

/**
 添加手牌(回放)
 */
function addHandCardReplay_xyHongZi(tagName,index,mjNum,off){
    var _node = getNode_xyHongZi(off);
    //根据牌的类型获得需要添加的节点
    var addNode = _node.getChildByName("replayNode");
    if(!addNode){
        return;
    }
    //设置牌
    var type = 2;
    var newCard = getNewCard_xyHongZi(mjNum,type,off);
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
function addHandCard_xyHongZi(tagName,index,mjNum,off){
    if(off != 0){
        return;
    }
    var _node = getNode_xyHongZi(off);
    //根据牌的类型获得需要添加的节点
    var addNode = _node.getChildByName("handNode");
    if(!addNode){
        return;
    }
    //设置牌
    var newCard = getNewCard_xyHongZi(mjNum,1,off);
    var scale_y = newCard.scaleY;
    //var parentCount = addNode.childrenCount;
    //首先根据name判断cpNode中是否已经添加
    var cardParent = addNode.getChildByTag(tagName);
    if(!cardParent){
        cardParent = new cc.Node();
        cardParent.tag = tagName;
        // cardParent.setName(0);			//用于标记子节点的name,用于排序
        cardParent.width = newCard.width;
        addNode.addChild(cardParent);
        // SetTouchCardHandler_xyHongZi(cardParent);
    }

    var beginPoint = cc.p(0,0);
    var off_y = newCard.height * scale_y - newCard.height/4 * scale_y;
    var type = ziPai.getZiPaiType();
    if(type == 2){
        off_y += 10;
    }

    var cardCount = cardParent.childrenCount;
    newCard.setName(index);
    newCard.zIndex = 4 - index;
    newCard.anchorX = 0;
    newCard.anchorY = 0;
    newCard.x = beginPoint.x;
    newCard.y = beginPoint.y + cardCount * off_y;
    cardParent.addChild(newCard);

    var pl = getUIPlayer_xyHongZi(off);
    if(pl && pl.canNotPutCard){
        if(pl.canNotPutCard.indexOf(mjNum) != -1){
            cc.log("wxd........刷新手牌时置灰..........."+JSON.stringify(pl.canNotPutCard));
            newCard.setColor(cc.color(170, 170, 170));
        }
    }
}

/**
 mjNum:牌的数字
 type:类型，1:手牌 2：吃牌 3：打的牌
 **/
function getNewCard_xyHongZi(mjNum, type, off, isTurn){
    var _node = getNode_xyHongZi(off);
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

    //cc.log("getNewCard_xyHongZi:"+mjNum+","+type+","+off+","+isTurn);
    if(mjNum > 0){
        //创建一个带有麻将信息的麻将 cp为创建后的麻将
        setCardSprite_xyHongZi(mjNode, mjNum, type, isTurn);
        if(type == 1){
            //只有手牌才会有点击事件
            SetTouchCardHandler_xyHongZi(mjNode,off);
        }
    }

    return mjNode;
}

//大结算和小结算   设置玩家掉线头像
function setRoundEndUserOffline_xyHongZi(node, pl){
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

function commitEatCards_xyHongZi(eatCards, biArr){
    if ((MjClient.data.sData.players[SelfUid()].eatFlag & 32) > 0) {
        MjClient.showMsg("吃牌后视为过胡，确定吃吗？", function() {
            setChiVisible_xyHongZi();
            HZChiToServer_xyHongZi(eatCards, biArr); 
        }, function() {}, "1");
    } else {
        setChiVisible_xyHongZi();
        HZChiToServer_xyHongZi(eatCards, biArr); 
    }
}


// 向服务器发送吃牌
function HZChiToServer_xyHongZi(eatCards, biCards){
    if (MjClient.rePlayVideo != -1) {
        return; // 回放时候不能请求
    }

    var tData = MjClient.data.sData.tData;
    if (biCards) {
        MjClient.gamenet.request("pkroom.handler.tableMsg", {
            cmd: "MJChi",
            eatCards: eatCards,
            biCards: biCards,
            cardNext: tData.cardNext,
            card: tData.lastPutCard
        });
    } else {
        MjClient.gamenet.request("pkroom.handler.tableMsg", {
            cmd: "MJChi",
            eatCards: eatCards,
            cardNext: tData.cardNext,
            card: tData.lastPutCard
        });
    }

}

function setChiVisible_xyHongZi(){
    var eat = MjClient.playui.jsBind.eat;
    eat.chi._node.visible = false;
    eat.peng._node.visible = false;
    eat.hu._node.visible = false;
    eat.guo._node.visible = false;
    eat.cancel._node.visible = false;
    eat.wangDiao._node.visible = false;
    eat.wangChuang._node.visible = false;
    eat.wangZha._node.visible = false;
    eat.chiSelect._node.visible = false;
    eat.biSelect._node.visible = false;
    eat.biSelect1._node.visible = false;

    eat.chi._node.setTouchEnabled(false);
    eat.peng._node.setTouchEnabled(false);
    eat.hu._node.setTouchEnabled(false);
    eat.guo._node.setTouchEnabled(false);
    eat.cancel._node.setTouchEnabled(false);
    eat.wangDiao._node.setTouchEnabled(false);
    eat.wangChuang._node.setTouchEnabled(false);
    eat.wangZha._node.setTouchEnabled(false);
    eat.chiSelect._node.setTouchEnabled(false);
    eat.biSelect._node.setTouchEnabled(false);
    eat.biSelect1._node.setTouchEnabled(false);
}



/**
 设置牌的渲染
 mjNode:麻将node
 mjNum:麻将tag
 type:类型，1:手牌 2：吃牌 3：打的牌
 */
function setCardSprite_xyHongZi(mjNode, mjNum, type, isTurn){
    if(getCurrentMJBgType_xyHongZi() == 0){
        MjClient.cardPath_xyHongZi = "playing/paohuzi/";
    }else if(getCurrentMJBgType_xyHongZi() == 1){
        MjClient.cardPath_xyHongZi = "playing/paohuzi/MJBg1/";
    }else if(getCurrentMJBgType_xyHongZi() == 2 && MjClient.getAppType() != MjClient.APP_TYPE.QXLYQP && MjClient.getAppType() != MjClient.APP_TYPE.QXXXGHZ){
        MjClient.cardPath_xyHongZi = "playing/paohuzi/MJBg2/";
    }else {
        MjClient.cardPath_xyHongZi = "playing/paohuzi/";
    }
    if(type == 1){
        // cc.log("full path:" + (MjClient.cardPath_xyHongZi+"hand" + mjNum + ".png"));
        mjNode.loadTexture(MjClient.cardPath_xyHongZi+"hand" + mjNum + ".png");
    }
    if(type == 2){
        mjNode.loadTexture(MjClient.cardPath_xyHongZi+"out" + mjNum + ".png");
        if(isTurn){
            mjNode.loadTexture(MjClient.cardPath_xyHongZi+"huxiBG.png");
        }
    }
    if(type == 3 || type == 4){
        mjNode.loadTexture(MjClient.cardPath_xyHongZi+"put" + mjNum + ".png");
        if(isTurn){
            mjNode.loadTexture(MjClient.cardPath_xyHongZi+"normalBG.png");
        }
    }
    mjNode.tag = mjNum;
}

// 新的听牌
function newCheckTingCards_xyHongZi(putCard){
    // return;
    // if(MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ || MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP){
        //听牌检测
        var sData = MjClient.data.sData;

        if(MjClient.data.sData.tData.tState == TableState.waitPut && curPlayerIsMe_xyHongZi(0) && putCard === undefined){
            cc.log("is waitPut....");
             postEvent("showTingLayer", []);
            return;
        }

        if(putCard && (!curPlayerIsMe_xyHongZi(0) || sData.tData.tState != TableState.waitPut)){
            putCard = undefined;
        }

        if(!curPlayerIsMe_xyHongZi(0))
            return;

        var pl = sData.players[SelfUid()];
        // var cards = MjClient.majiang_xyHongZi.getTingCards(sData, pl, putCard);
        var textData = MjClient.majiang_xyHongZi.getTingStats(sData, pl, putCard);

        // cc.log("==========checkTingCards_xyHongZi===============");
        // cc.log("sData:", JSON.stringify(sData));
        // cc.log("pl:", JSON.stringify(pl));
        // cc.log("putCard:", putCard);
        // var tingData = {};
        // tingData.cards = cards;
        // tingData.textData = textData;  

        postEvent("showNewTingLayer", textData);
    // }
}



function checkTingCards_xyHongZi(putCard){
    // return;
    // if(MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ || MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP){
        //听牌检测
        var sData = MjClient.data.sData;

        if(MjClient.data.sData.tData.tState == TableState.waitPut && curPlayerIsMe_xyHongZi(0) && putCard === undefined){
            cc.log("is waitPut....");
             postEvent("showTingLayer", []);
            return;
        }

        if(putCard && (!curPlayerIsMe_xyHongZi(0) || sData.tData.tState != TableState.waitPut)){
            putCard = undefined;
        }

        var pl = sData.players[SelfUid()];
        var cards = [];
        if(pl.mjhand){
            cards = MjClient.majiang_xyHongZi.getTingCards(sData, pl, putCard);
        }
        // var textData = MjClient.majiang_xyHongZi.getTingStats(sData, pl, putCard);

        cc.log("==========checkTingCards_xyHongZi===============");
        // cc.log("sData:", JSON.stringify(sData));
        // cc.log("pl:", JSON.stringify(pl));
        // cc.log("putCard:", putCard); 

        postEvent("showTingLayer", cards);
    // }
}

function getPut2TingStats_xyHongZi() {
    return;

    var sData = MjClient.data.sData;
    var tData = sData.tData;

    if (tData.tState != TableState.waitPut || !curPlayerIsMe_xyHongZi(0)){
        return;
    }

    var time1 = +new Date();
    var pl = sData.players[SelfUid()];
    var info = MjClient.majiang_xyHongZi.put2TingStats(sData, pl);
    var time2 = +new Date();
    cc.log("getPut2TingStats_xyHongZi time@@ ", time2 - time1);
    console.log("put2TingStats@@ ", JSON.stringify(info));
}

//刷新手牌移动时的坐标
var btn_oPos = null;
function updateBtnMovedPosition_xyHongZi(btn, eventType){
    if (eventType == ccui.Widget.TOUCH_BEGAN) {
        if(!btn_oPos){
            btn_oPos = btn.getTouchBeganPosition();
        }
    }else if(eventType == ccui.Widget.TOUCH_MOVED){
        if(!btn_oPos){
            //在移动牌的过程中，有吃碰偎跑操作导致btn_oPos=null
            btn.setPosition(cc.pSub(btn.getTouchMovePosition(), btn.parent.getPosition()));
            btn_oPos = btn.getPosition();
        }else{
            var touchPos = btn.getTouchMovePosition();
            var deltePos = cc.pSub(touchPos, btn_oPos);
            var factPos = cc.pAdd(btn.getPosition(), deltePos);
            btn.setPosition(factPos);
            btn_oPos = touchPos;
        }
    }else if(eventType == ccui.Widget.TOUCH_ENDED || eventType == ccui.Widget.TOUCH_CANCELED){
        btn_oPos = null;
    }
}

MjClient.movingCard_xyHongZi = null;
//MjClient.cloneCard = null;
//MjClient.putCard = null;
MjClient.hasPut = false;
MjClient.touchCell = null;
MjClient.copyCell = null;
function SetTouchCardHandler_xyHongZi(card,off){
    var cardTag = card.tag;
    var pl = getUIPlayer_xyHongZi(off);
    var mjhand = pl.mjhand;
    var cardArr = {};
    for(var i = 0;i< mjhand.length;i++){
        if(!cardArr[mjhand[i]]){
            cardArr[mjhand[i]] = 1;
        }else{
            cardArr[mjhand[i]] ++;
        }
    }

    var _node = getNode_xyHongZi(off);
    // var movingCard_paohuzi = null;

    var acTime = 0.2;
    var cloneCard = null;
    card.addTouchEventListener(function(btn,eventType){

        //禁止同时移动多个牌
        if(MjClient.movingCard_xyHongZi !== null && cc.sys.isObjectValid(MjClient.movingCard_xyHongZi) && MjClient.movingCard_xyHongZi !== btn){
            return;
        }

        if(MjClient.isRefreshNodeing){
            return;
        }

        if(eventType == ccui.Widget.TOUCH_BEGAN){

            MjClient.movingCard_xyHongZi = btn;
            //
            var beginPos = btn.getPosition();
            var touchPos = beginPos;//btn.parent.convertToWorldSpace(beginPos);
            touchPos = cc.p(touchPos.x + (0.5 - btn.anchorX) * btn.width * btn.scaleX,
                touchPos.y + (0.5 - btn.anchorY) * btn.height * btn.scaleY);
            cloneCard = btn.clone();
            cloneCard.setTouchEnabled(false);
            setCardSprite_xyHongZi(cloneCard, cardTag, 1, false);
            cloneCard.opacity = 0;
            btn.parent.addChild(cloneCard);

            MjClient.touchCell = btn;
            MjClient.copyCell = cloneCard;

            btn.anchorX = 0.5;
            btn.anchorY = 0.5;
            var maxZOrder = -1;
            if (btn.parent && btn.parent.parent)
            {
                var handNode = btn.parent.parent;
                for (var i=0; i<handNode.getChildrenCount(); i++)
                {
                    var zorder = handNode.getChildren()[i].getLocalZOrder();
                    if (maxZOrder < zorder) maxZOrder = zorder;
                }
            }
            else
            {
                maxZOrder = 2000;
            }
            btn.parent.zIndex = maxZOrder+1;
            btn.zIndex = 5;
            btn.x = touchPos.x;
            btn.y = touchPos.y;
            // updateBtnMovedPosition_xyHongZi(btn, eventType);
            ShowPutCardIcon_xyHongZi();

            newCheckTingCards_xyHongZi(btn.tag);

            return true;
        }
        if(eventType == ccui.Widget.TOUCH_MOVED){
            if (MjClient.movingCard_xyHongZi==null) return;
            var movePos = btn.getTouchMovePosition();
            movePos = cc.pSub(movePos, btn.parent.getPosition());
            btn.x = movePos.x;
            btn.y = movePos.y;
            // updateBtnMovedPosition_xyHongZi(btn, eventType);
        }
        if(eventType == ccui.Widget.TOUCH_ENDED || 
            eventType == ccui.Widget.TOUCH_CANCELED){ //fix by 千千 统一处理
            if (MjClient.movingCard_xyHongZi==null) return;
            // updateBtnMovedPosition_xyHongZi(btn, eventType);
            MjClient.movingCard_xyHongZi = null;
            var btnParent = btn.parent;
            var btnTag = btn.tag;
            var btnName = btn.name;
            var scale_x = btn.scaleX;
            var endPos = btn.getTouchEndPosition();
            var pl = getUIPlayer_xyHongZi(0);
            var tData = MjClient.data.sData.tData;
            var isPut = false;
            var cutLine = MjClient.playui.jsBind.cutLine._node;
            var isWangBa = MjClient.majiang.isEqualHunCard(btnTag);

            if(MjClient.HandCardArr[btnParent.tag].indexOf(btnTag) < 0){
                MjClient.touchCell = null;
                MjClient.copyCell = null;

                MjClient.playui.ResetHandCard(MjClient.playui._downNode,off);
                ShowPutCardIcon_xyHongZi();
                MjClient.addGroupIndex = -1;    //新增列标志
                return;
            }

            if(cloneCard && cc.sys.isObjectValid(cloneCard)){
                cloneCard.opacity = 255;
            }

            if(!isWangBa && (!pl.canNotPutCard||pl.canNotPutCard.indexOf(btnTag)==-1) && 
                IsTurnToMe() && tData.tState == TableState.waitPut && pl.mjState == TableState.waitPut &&
                !MjClient.isCommon && cutLine.visible && endPos.y >= cutLine.y && !MjClient.hasPut)
            {
                btn.removeFromParent();

                //出牌后直接落牌，add by maoyu
                var putNode = MjClient.playui._downNode.getChildByName("put");
                putNode.removeAllChildren();
                var putCard = getNewCard_xyHongZi(btnTag, 3 ,off);
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
                putNode.runAction(cc.spawn(action1,action2));

                isPut = true;
                MjClient.hasPut = true;
                MjClient.isCommon = false;
                MjClient.HandCardArr[btnParent.tag].splice(parseInt(btnName),1);
                HZPutCardToServer_xyHongZi(btnTag);
                MjClient.playui.ResetHandCard(MjClient.playui._downNode,off);
                ShowPutCardIcon_xyHongZi();
            }
            else
            {
                //耒阳新添加玩法
                var isNoPut = false;
                if(pl.canNotPutCard && pl.canNotPutCard.indexOf(btnTag) != -1 && MjClient.majiang.getCanPutCardNum(pl)>0){
                    isNoPut = true;
                }

                btn.removeFromParent(true);

                if(!isNoPut && !isWangBa && IsTurnToMe() && tData.tState == TableState.waitPut && pl.mjState == TableState.waitPut)
                {
                    if(!MjClient.isCommon && cutLine.visible && endPos.y >= cutLine.y && !MjClient.hasPut)
                    {
                        isPut = true;
                        MjClient.hasPut = true;
                        MjClient.isCommon = false;
                        MjClient.HandCardArr[btnParent.tag].splice(parseInt(btnName),1);
                        HZPutCardToServer_xyHongZi(btnTag);
                        MjClient.playui.ResetHandCard(MjClient.playui._downNode,off);
                        ShowPutCardIcon_xyHongZi();

                        newCheckTingCards_xyHongZi(btnTag);


                        //出牌后直接落牌，add by maoyu
                        var putNode = MjClient.playui._downNode.getChildByName("put");
                        putNode.removeAllChildren();
                        var putCard = getNewCard_xyHongZi(btnTag, 3 ,off);
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
                        putNode.runAction(cc.spawn(action1,action2));
                    }
                }
                if(!isPut || isWangBa || isNoPut)
                {
                    var count = btnParent.parent.childrenCount;
                    var totalWidth = btnParent.width * scale_x * count;
                    var min_x = (MjClient.size.width - totalWidth)/2;
                    var selectIndex = Math.ceil((endPos.x - min_x)/(btnParent.width * scale_x));
                    var selectParentTag = selectIndex - 1;
                    if(selectParentTag == btnParent.tag){
                        //位置没有发生变化
                        //if (MjClient.cloneCard) MjClient.cloneCard.opacity = 255;

                        //fix 千千
                        var selectArr = MjClient.HandCardArr[selectParentTag];
                        _changeArrIndex_xyHongZi(selectArr, btnTag, btn);
                    }
                    else if(selectParentTag >= 0 && selectParentTag < count){
                        //在手牌node的范围内
                        var selectArr = MjClient.HandCardArr[selectParentTag];
                        var cardNum = 4;//耒阳一竖条可以放4张牌
                        if(selectArr.length >= cardNum){
                            //if (MjClient.cloneCard) MjClient.cloneCard.opacity = 255;
                        }else{
                            // selectArr.push(btnTag);
                            // MjClient.HandCardArr[btnParent.tag].splice(parseInt(btnName),1);

                            //todo 千千
                            _fixArrIndex_xyHongZi(selectArr, btnTag, btn);
                            MjClient.HandCardArr[btnParent.tag].splice(parseInt(btnName),1);
                        }
                    }
                    else{
                        //最左边的牌的坐标不能小于头像的坐标
                        var head = MjClient.playui._downNode.getChildByName("head");
                        var head_max_x = head.x + (1 - head.anchorX) * head.width * head.scaleX;
                        var handCard = MjClient.playui._downNode.getChildByName("handCard");
                        var handNode = MjClient.playui._downNode.getChildByName("handNode");
                        var children = handNode.children;
                        var singleWidth = handCard.width * handCard.scaleX;
                        var minX = (MjClient.size.width - (children.length+1) * singleWidth)/2;
                        if(minX > head_max_x){
                            MjClient.HandCardArr[btnParent.tag].splice(parseInt(btnName),1);
                            var arr = [];
                            arr.push(btnTag);
                            if(selectParentTag < 0){
                                MjClient.HandCardArr.splice(0,0,arr);
                                MjClient.addGroupIndex = 0; //新增列标志
                            }else if(selectParentTag >= count){
                                MjClient.HandCardArr.push(arr);
                                MjClient.addGroupIndex = MjClient.HandCardArr.length - 1;
                            }
                        }else{
                            //if (MjClient.cloneCard) MjClient.cloneCard.opacity = 255;
                        }
                    }

                    newCheckTingCards_xyHongZi();
                    //MjClient.playui.ResetHandCard(MjClient.playui._downNode,off);
                }

                MjClient.touchCell = null;
                MjClient.copyCell = null;

                MjClient.playui.ResetHandCard(MjClient.playui._downNode,off);
                ShowPutCardIcon_xyHongZi();
                MjClient.addGroupIndex = -1;    //新增列标志
            }
        }
        // if(eventType == ccui.Widget.TOUCH_CANCELED){
        //     if (movingCard_paohuzi==null) return;
        //     movingCard_paohuzi = null;
        //     MjClient.playui.ResetHandCard(MjClient.playui._downNode,off);
        //     ShowPutCardIcon_xyHongZi();
        // }
    });
}

//根据坐标Y，添加到数组对应的位置
function _fixArrIndex_xyHongZi(arr, btnTag, btn){
    if(_isKan_xyHongZi(arr)){
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
function _changeArrIndex_xyHongZi(arr, btnTag, btn){
    if(!_isKan_xyHongZi(arr)){
        var len = arr.length;
        for(var i = 0; i < len; i++){
            var tag = arr[i];
            if(tag == btnTag){
                arr.splice(i,1);
                break;
            }
        }
        _fixArrIndex_xyHongZi(arr, btnTag, btn);
    }
}

//数组里的是否为三个相同的牌
function _isKan_xyHongZi(arr){
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
function DealOffLineCard_xyHongZi(node, off){
    if(off == 1 && node.getName() == "right" && MjClient.MaxPlayerNum_xyHongZi == 2){
        return;//2人玩法right节点同为玩家节点
    }
    cc.log("====================DealOffLineCard_xyHongZi=================");
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    /*if(tData.tState == TableState.roundFinish || tData.tState == TableState.waitReady || tData.tState == TableState.isReady) {
        return;
    }*/
    if(tData.tState != TableState.waitPut && tData.tState != TableState.waitEat && tData.tState != TableState.waitCard) {
        //不在打牌过程中
        return;
    }

    if(typeof(tData.currCard) != "undefined" && tData.currCard != -1){
        var uids = tData.uids;
        var selfIndex = (uids.indexOf(SelfUid()) + off) % MjClient.MaxPlayerNum_xyHongZi;
        if(uids[selfIndex] == uids[tData.curPlayer]){
            var putCard = getNewCard_xyHongZi(tData.currCard, 3, off);
            var putNode = node.getChildByName("put");
            if(tData.putType == 0){
                putNode.loadTexture("playing/paohuzi/chupai_bj.png");
            }else{
                putNode.loadTexture("playing/paohuzi/mopai_bj.png");
            }
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
function DealNewCard_xyHongZi(node, msg, off){
    cc.log("======DealNewCard_xyHongZi======= " + off);
    if(off == 1 && node.getName() == "right" && MjClient.MaxPlayerNum_xyHongZi == 2){
        return;//2人玩法right节点同为玩家节点
    }
    //没有发牌过来的时候直接忽略
    if(!msg.newCard){
        RemovePutCardOut_xyHongZi();
        MjClient.playui.EatVisibleCheck();
        return;
    }
    //存在发牌
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var uids = tData.uids;
    var selfIndex = (uids.indexOf(SelfUid()) + off) % MjClient.MaxPlayerNum_xyHongZi;
    if(uids[selfIndex] == msg.uid){
        //清理之前玩家打的牌
        var lastPlayer = tData.lastPlayer;
        if(lastPlayer != -1){
            //var lastOff = (off + MjClient.MaxPlayerNum_xyHongZi - selfIndex) % MjClient.MaxPlayerNum_xyHongZi;
            RemovePutCardOut_xyHongZi();
        }

        var isTurn = false;
        if (off != 0 && tData.isLastDraw) { // 庄家最后一张牌 其他玩家显示牌背
            isTurn = true;
        }

        var pl = sData.players[uids[selfIndex]];
        var putCard = getNewCard_xyHongZi(msg.newCard, 3, off, isTurn);
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
        var action1 = cc.scaleTo(0.2, putNode.getUserData().scale);
        var action2 = cc.moveTo(0.2, putNode.getUserData().pos);
        putNode.runAction(cc.spawn(action1,action2).easing(cc.easeCubicActionOut()));

        if(!msg.isCommon){
            if(MjClient.rePlayVideo == -1){
                MjClient.isCommon = true;
                //王霸牌需要收回
                var callback = function(){
                    RemovePutCardOut_xyHongZi();
                    //如果是自己则需要重新整理手牌
                    if(msg.uid == SelfUid()){
                        var cardArr = MjClient.HandCardArr;
                        var isAdd = false;
                        for(var i = 0;i < cardArr.length;i++){
                            var tmpArr = cardArr[i];
                            if(tmpArr.length <= 2){
                                isAdd = true;
                                MjClient.HandCardArr[i].push(msg.newCard);
                                break;
                            }
                        }
                        if(!isAdd){
                            MjClient.HandCardArr.push([msg.newCard]);
                        }
                        //MjClient.playui.CardLayoutRestore(node,off);
                        MjClient.playui.ResetHandCard(node,off);//mod by maoyu
                    }
                    MjClient.isCommon = false;
                    ShowPutCardIcon_xyHongZi();
                    MjClient.playui.EatVisibleCheck();
                };
                var delay = cc.delayTime(1.3);
                var remove = cc.callFunc(callback);
                var seq = cc.sequence(delay,remove);
                putNode.runAction(seq);
            }else{
                var cardArr = [];
                if(msg.uid == SelfUid()){
                    cardArr = MjClient.HandCardArr;
                }else {
                    cardArr = MjClient.OtherHandArr[off];
                }
                var isAdd = false;
                putNode.runAction(cc.sequence(
                    cc.delayTime(0.2),
                    cc.callFunc(function(){RemovePutCardOut_xyHongZi();})
                ));
                for(var i = 0;i < cardArr.length;i++){
                    var tmpArr = cardArr[i];
                    if(tmpArr.length <= 2){
                        isAdd = true;
                        tmpArr.push(msg.newCard);
                        break;
                    }
                }
                if(!isAdd){
                    cardArr.push([msg.newCard]);
                }
                MjClient.playui.CardLayoutRestore(node,off);

                cc.log("cardArr="+JSON.stringify(cardArr));
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

//翻醒发牌
function DealFanXingNewCard_xyHongZi(card){
    if(off == 1 && node.getName() == "right" && MjClient.MaxPlayerNum_xyHongZi == 2){
        return;//2人玩法right节点同为玩家节点
    }
    var putCard = getNewCard_xyHongZi(card, 4, 0);
    var putNode = MjClient.playui._downNode.getChildByName("xingPai");
    putNode.removeAllChildren();
    putCard.scaleX = putCard.width/putNode.width - 0.16;
    putCard.scaleY = putCard.width/putNode.width - 0.06;
    putCard.x = putCard.width/2;
    putCard.y = putCard.height/2;
    putNode.visible = true;
    putNode.addChild(putCard);
    putNode.zIndex = 10;

    //添加动作
    putNode.setScale(0);
    putNode.setPosition(cc.p(cc.winSize.width/2, cc.winSize.height/2+120));
    var action1 = cc.scaleTo(0.2,putNode.getUserData().scale);
    var action2 = cc.moveTo(0.2,putNode.getUserData().pos);
    putNode.runAction(cc.spawn(action1,action2).easing(cc.easeCubicActionOut()));
}

//王闯/王钓
function DealWangChuang_xyHongZi(node,msg,off){
    if(off == 1 && node.getName() == "right" && MjClient.MaxPlayerNum_xyHongZi == 2){
        return;//2人玩法right节点同为玩家节点
    }
    var sData = MjClient.data.sData;
    var tData = sData.tData;

    var uids = tData.uids;
    var selfIndex = (uids.indexOf(SelfUid()) + off) % MjClient.MaxPlayerNum_xyHongZi;
    if(uids[selfIndex] == msg.uid){
        var pl = sData.players[uids[selfIndex]];
        var lastPlayer = tData.lastPlayer;
        if(lastPlayer != -1){
            //var lastOff = (off + MjClient.MaxPlayerNum_xyHongZi - selfIndex) % MjClient.MaxPlayerNum_xyHongZi;
            RemovePutCardOut_xyHongZi();
        }
        if(pl.wangType == 1){
            var putCard = getNewCard_xyHongZi(91, 3, off);
            var putNode = node.getChildByName("put");
            putCard.scaleX = putCard.width/putNode.width - 0.16;
            putCard.scaleY = putCard.width/putNode.width - 0.06;
            putCard.x = putCard.width/2;
            putCard.y = putCard.height/2;
            putNode.visible = true;
            putNode.setPosition(putNode.getUserData().pos);
            putNode.setScale(putNode.getUserData().scale);
            putNode.addChild(putCard);

            ShowEatActionAnim_xyHongZi(node, ActionType_xyHongZi.WANGDIAO, off);

            var delay = cc.delayTime(1.5);
            var callback = function(){
                RemovePutCardOut_xyHongZi();
                //HZNewCardToServer_xyHongZi();
            }
            //putNode.runAction(cc.sequence(delay,cc.callFunc(callback)));
        }else if(pl.wangType == 2){
            var putCard = getNewCard_xyHongZi(91, 3, off);
            var putCard1 = getNewCard_xyHongZi(91, 3, off);
            var putNode = node.getChildByName("put");
            putCard.scaleX = putCard.width/putNode.width - 0.16;
            putCard.scaleY = putCard.width/putNode.width - 0.06;
            putCard1.scaleX = putCard.width/putNode.width - 0.16;
            putCard1.scaleY = putCard.width/putNode.width - 0.06;
            if(node.getName() == "down"){
                putCard.x = - 15;
                putCard.y = putCard.height/2;
                putCard1.x = putCard.width + 15;
                putCard1.y = putCard.height/2;
            }else if(node.getName() == "right"){
                putCard.x = putCard.width/2;
                putCard.y = putCard.height/2;
                putCard1.x = - putCard.width/2 - 30;
                putCard1.y = putCard.height/2;
            }else if(node.getName() == "left"){
                putCard.x = putCard.width/2;
                putCard.y = putCard.height/2;
                putCard1.x = putCard.width/2 + putCard.width + 30;
                putCard1.y = putCard.height/2;
            }
            putNode.visible = true;
            putNode.setPosition(putNode.getUserData().pos);
            putNode.setScale(putNode.getUserData().scale);
            putNode.addChild(putCard);
            putNode.addChild(putCard1);
            ShowEatActionAnim_xyHongZi(node, ActionType_xyHongZi.WANGCHUANG, off);
            var delay = cc.delayTime(1.5);
            var callback = function(){
                RemovePutCardOut_xyHongZi();
                //HZNewCardToServer_xyHongZi();
            }
            //putNode.runAction(cc.sequence(delay,cc.callFunc(callback)));
        }else if(pl.wangType == 4){
            var putCard = getNewCard_xyHongZi(91, 3, off);
            var putCard1 = getNewCard_xyHongZi(91, 3, off);
            var putCard2 = getNewCard_xyHongZi(91, 3, off);
            var putNode = node.getChildByName("put");
            putCard.scaleX = putCard.width/putNode.width - 0.16;
            putCard.scaleY = putCard.width/putNode.width - 0.06;
            putCard1.scaleX = putCard.width/putNode.width - 0.16;
            putCard1.scaleY = putCard.width/putNode.width - 0.06;
            putCard2.scaleX = putCard.width/putNode.width - 0.16;
            putCard2.scaleY = putCard.width/putNode.width - 0.06;
            if(node.getName() == "down"){
                putCard.x = putCard.width/2;
                putCard.y = putCard.height/2;
                putCard1.x = -(putCard.width/2 + 15);
                putCard1.y = putCard.height/2;
                putCard2.x = putCard.width/2 + putCard.width + 15;
                putCard2.y = putCard.height/2;
            }else if(node.getName() == "right"){
                putCard.x = putCard.width/2;
                putCard.y = putCard.height/2;
                putCard1.x = - putCard.width/2 - 30;
                putCard1.y = putCard.height/2;
                putCard2.x = - putCard.width/2 - putCard.width - 45;
                putCard2.y = putCard.height/2;
            }else if(node.getName() == "left"){
                putCard.x = putCard.width/2;
                putCard.y = putCard.height/2;
                putCard1.x = putCard.width/2 + putCard.width + 30;
                putCard1.y = putCard.height/2;
                putCard2.x = putCard.width/2 + (putCard.width + 30) * 2;
                putCard2.y = putCard.height/2;
            }
            putNode.visible = true;
            putNode.setPosition(putNode.getUserData().pos);
            putNode.setScale(putNode.getUserData().scale);
            putNode.addChild(putCard);
            putNode.addChild(putCard1);
            putNode.addChild(putCard2);
            ShowEatActionAnim_xyHongZi(node, ActionType_xyHongZi.WANGZHA, off);
            var delay = cc.delayTime(1.5);
            var callback = function(){
                RemovePutCardOut_xyHongZi();
                //HZNewCardToServer_xyHongZi();
            }
            //putNode.runAction(cc.sequence(delay,cc.callFunc(callback)));
        }

        var eat = MjClient.playui.jsBind.eat;
        eat.guo._node.visible = false;
        eat.wangDiao._node.visible = false;
        eat.wangChuang._node.visible = false;
        eat.wangZha._node.visible = false;
        eat.guo._node.setTouchEnabled(false);
        eat.wangDiao._node.setTouchEnabled(false);
        eat.wangChuang._node.setTouchEnabled(false);
        eat.wangZha._node.setTouchEnabled(false);
    }
}

//处理出牌
function DealPutCard_xyHongZi(node, msg, off){
    cc.log("======DealPutCard_xyHongZi======= " + off);
    if(off == 1 && node.getName() == "right" && MjClient.MaxPlayerNum_xyHongZi == 2){
        return;//2人玩法right节点同为玩家节点
    }
    MjClient.hasPut = false;
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var uids = tData.uids;
    var selfIndex = (uids.indexOf(SelfUid()) + off) % MjClient.MaxPlayerNum_xyHongZi;
    if(uids[selfIndex] == msg.uid)
    {
        //别人出牌或者回放时，添加动作
        if (SelfUid() != msg.uid || MjClient.rePlayVideo != -1)
        {
            var putNode = node.getChildByName("put");
            putNode.removeAllChildren();
            var putCard = getNewCard_xyHongZi(msg.card, 3 ,off);
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
            var action1 = cc.scaleTo(0.16, putNode.getUserData().scale);
            var action2 = cc.moveTo(0.16, pos.x,pos.y);
            putNode.runAction(cc.spawn(action1,action2).easing(cc.easeCubicActionOut()));
        }

        var pl = getUIPlayer_xyHongZi(off);
        if(MjClient.rePlayVideo == -1 && off == 0){
            MjClient.playui.ResetHandCard(node,off);
        }

        if (off == 0) {
            removeTingSign_xyHongZi(node);
        }

        if(MjClient.rePlayVideo != -1){
            RemoveHandCard_xyHongZi(node,msg.card,off);
            MjClient.playui.ResetHandCard(node,off);
        }
    }
}

function checkCard_xyHongZi(node, off){
    if(off != 0 || MjClient.rePlayVideo != -1){
        return;
    }
    if(off == 0 && node.getName() != "down"){
        return;//2人玩法right节点同为玩家节点
    }
    var pl = getUIPlayer_xyHongZi(off);
    if(!pl){
        return;
    }
    var sData = MjClient.data.sData;
    var tData = sData.tData; 

    // 在小结算数据的时候，不需要在去检测手牌内容了
    if(tData.tState == TableState.roundFinish ){
        return;
    }
    var cardHandArr = [];
    if (MjClient.HandCardArr) {
        for(var i = 0; i < MjClient.HandCardArr.length; i++){
            for(var j = 0; j < MjClient.HandCardArr[i].length; j++){
                cardHandArr.push(MjClient.HandCardArr[i][j]);
            }
        }
    }
    var cardHand = [];
    if(pl.mjhand){
        cardHand = pl.mjhand.slice();
    }
    if(cardHandArr.length > cardHand.length){
        cardHandArr.sort(function (a, b) {
            return a - b;
        });
        cardHand.sort(function (a, b) {
            return a - b;
        });
        for(var i = 0;i < cardHandArr.length; i++){
            if(cardHandArr[i] != cardHand[i]){
                RemoveHandCard_xyHongZi(node, cardHandArr[i], off);
                cardHandArr.splice(i, 1);
                i--;
            }
        }
    }
};

function calculateHintPutList_xyHongZi() {
    MjClient.hintPutList_ziPai = MjClient.majiang_xyHongZi.hintPutCardsToTing();
    // cc.log('MjClient.hintPutList_ziPai@@ ', MjClient.hintPutList_ziPai);
}

function addTingSign_xyHongZi(node) {
    var hintPutList = MjClient.hintPutList_ziPai;
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
                if (tag && hintPutList.indexOf(tag) >= 0) {
                    var tingImg = new ccui.ImageView("playing/paohuzi/ting.png");
                    tingImg.anchorX = 0;
                    tingImg.anchorY = 1;
                    tingImg.x = 0;
                    tingImg.y = card.getContentSize().height;
                    card.addChild(tingImg)

                } else {
                    card.removeAllChildren(true);
                }
            }
        }
    }
}

function removeTingSign_xyHongZi(node) {
    var handNode = node.getChildByName("handNode");
    if (!handNode) {
        return;
    }

    var children = handNode.getChildren();
    for (var i = 0; i < children.length; i++) {
        var addNode = children[i];
        for (var j = 0; j < addNode.getChildren().length; j++) {
            var card = addNode.getChildren()[j];
            
            card.removeAllChildren(true);
        }
    }
}

//吃牌
function DealChiCard_xyHongZi(node, msg, off) {
    if(off == 1 && node.getName() == "right" && MjClient.MaxPlayerNum_xyHongZi == 2){
        return;//2人玩法right节点同为玩家节点
    }
    cc.log("======DealChiCard_xyHongZi======= " + off);
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var uids = tData.uids;
    var selfIndex = (uids.indexOf(SelfUid()) + off) % MjClient.MaxPlayerNum_xyHongZi;
    if (tData.curPlayer == selfIndex) {
        RemovePutCardOut_xyHongZi();
        var pl = sData.players[uids[selfIndex]];
        var mjchi = pl.mjchi;
        var eatAndBiCards = mjchi[mjchi.length - 1];
        var mjchiCard = pl.mjchiCard;
        var chiCard = mjchiCard[mjchiCard.length - 1];
        var eatCards = eatAndBiCards.eatCards;
        var tmpEatCards = eatCards.slice();
        tmpEatCards.splice(tmpEatCards.indexOf(chiCard), 1);
        for (var i = 0; i < tmpEatCards.length; i++) {
            RemoveHandCard_xyHongZi(node, tmpEatCards[i], off);
        }
        var biCards = eatAndBiCards.biCards;
        if (biCards) {
            for (var k = 0; k < biCards.length; k++) {
                var biArr = biCards[k];
                var tmpBiArr = biArr.slice();
                for (var m = 0; m < biArr.length; m++) {
                    if (tmpBiArr.indexOf(biArr[m]) >= 0) {
                        tmpBiArr.splice(tmpBiArr.indexOf(biArr[m]), 1);
                        RemoveHandCard_xyHongZi(node, biArr[m], off);
                    }
                }
            }
        }
        MjClient.playui.ResetHandCard(node, off);

        //吃牌动作
        var eatNode = node.getChildByName("eatNode");
        var parent = new cc.Node();
        var cardWidth = 0;
        for (var i = 0; i < eatCards.length; i++) {
            var card = getNewCard_xyHongZi(eatCards[i], 2, off);
            if (i == 2) {
                card.setColor(cc.color(170, 170, 170));
            }

            cardWidth = card.width //*eatNode.scaleX;
            var off_count = (node.getName() == "right" || node.getName() == "left") ? (2 - i) : i;
            card.zIndex = 4 - i;
            card.x = 0;
            card.y = off_count * getOffY_xyHongZi(node, card);
            setChiCardAnchorPoint_xyHongZi(node, card);
            parent.addChild(card);
        }

        var selfColCount = 1;
        if (biCards) {
            selfColCount += biCards.length;
            for (var k = 0; k < biCards.length; k++) {
                var biArr = biCards[k];
                for (var m = 0; m < biArr.length; m++) {
                    var card = getNewCard_xyHongZi(biArr[m], 2, off);
                    if (m == 2) {
                        card.setColor(cc.color(170, 170, 170));
                    } 
                    setChiCardAnchorPoint_xyHongZi(node, card);
                    var off_count = (node.getName() == "right" || node.getName() == "left") ? (2 - m) : m;
                    card.zIndex = 10 - i;
                    card.x = card.width * card.scaleX * (k + 1) * ((node.getName() == "right" || node.getName() == "xing") ? -1 : 1);
                    card.y = off_count * getOffY_xyHongZi(node, card);
                    parent.addChild(card);
                }
            }
        }
        eatNode.addChild(parent);
        var parentPos = getChiCardParentPosition_xyHongZi(node, cardWidth, off, selfColCount);
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
        setCardParentPosY_xyHongZi(node, parent);
        var action2 = cc.moveTo(0.16, parentPos.x, parentPos.y);
        var callback = function() {
            // parent.removeFromParent(true);
            // MjClient.playui.ResetOtherCard(node, off);
        };
        parent.runAction(cc.sequence(action2,cc.callFunc(callback)));



        if (biCards) {
            ShowEatActionAnim_xyHongZi(node, ActionType_xyHongZi.XIAHUO, off);
        } else {
            ShowEatActionAnim_xyHongZi(node, ActionType_xyHongZi.CHI, off);
        }
    }
    //MjClient.playui.CardLayoutRestore(node,off);
}

function setChiCardAnchorPoint_xyHongZi(node,newCard) {
    if(node.getName() == "down"){
        newCard.anchorX = 0;
        newCard.anchorY = 0;
    }else if(node.getName() == "right"){
        newCard.anchorX = 1;
        newCard.anchorY = 1;
    }else if(node.getName() == "left"){
        newCard.anchorX = 0;
        newCard.anchorY = 1;
    }else if (node.getName() == "xing"){
        newCard.anchorX = 1;
        newCard.anchorY = 0;
    }
}
function getOffY_xyHongZi(node,newCard) {
    var off_y = 0;
    if(node.getName() == "down"){
        off_y = newCard.height;
    }else if(node.getName() == "right"){
        off_y = -newCard.height;
    }else if(node.getName() == "left"){
        off_y = -newCard.height;
    }else if (node.getName() == "xing"){
        off_y = newCard.height;
    }
    return off_y;
}
function getChiCardParentPosition_xyHongZi(node, newCardWidth, off, selfColCount, orignColPosX) {
    selfColCount = selfColCount || 1;
    var eatNode = node.getChildByName("eatNode");
    // var parentCount = eatNode.getChildrenCount() - 1;

    var pl = getUIPlayer_xyHongZi(off);
    // var totalColCount = pl.mjpeng.length + pl.mjwei.length + pl.mjgang0.length + pl.mjgang1.length;
    var totalColCount = pl.mjpeng.length + pl.mjgang0.length + pl.mjgang1.length;
    for (var i = 0; i < pl.mjchi.length; i++) {
        totalColCount += 1;
        if (pl.mjchi[i].biCards) {
            totalColCount += pl.mjchi[i].biCards.length;
        }
    }

    var preColCount = totalColCount - selfColCount;
    var X = 0;
    var Y = 0;
    if(node.getName() == "down"){
        X = preColCount * newCardWidth;
        Y = 0;
    }else if (node.getName() == "right"){
        X = eatNode.width - preColCount * newCardWidth;
        Y = eatNode.height;
    }else if (node.getName() == "left"){
        X = preColCount * newCardWidth;
        Y = eatNode.height;
    }else if (node.getName() == "xing"){
        X = eatNode.width - preColCount * newCardWidth;
        Y = 0;
    }
    
    if (orignColPosX != undefined) {
        X = orignColPosX
    }

    return cc.p(X, Y);
}
function setCardParentPosY_xyHongZi(node, cardParent) {
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

// 获取提 偎桌面上展示的亮牌 的index
function getShowCardIdx_xyHongZi(node, chiTip) {
    var idx;
    switch(node.getName()) {
        case "down":
        case "xing":
            idx = chiTip == "wei" ? 2 : 3
            break;
        case "right":
        case "left":
            idx = 0;
            break;
    }

    return idx;
}

// 处理碰
function DealPengCard_xyHongZi(node, msg, off){
    cc.log("======DealChiCard_xyHongZi======= ");
    if(off == 1 && node.getName() == "right" && MjClient.MaxPlayerNum_xyHongZi == 2){
        return;//2人玩法right节点同为玩家节点
    }
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var uids = tData.uids;
    var selfIndex = (uids.indexOf(SelfUid()) + off) % MjClient.MaxPlayerNum_xyHongZi;
    if(tData.curPlayer == selfIndex){
        RemovePutCardOut_xyHongZi();

        var parent = new cc.Node();
        var eatNode = node.getChildByName("eatNode");
        var cardWidth = 0;
        var pl = sData.players[tData.uids[selfIndex] + ""];
        var pengCard = pl.mjpeng[pl.mjpeng.length-1];
        for(var i = 0;i < 3; i++) {
            var card = getNewCard_xyHongZi(pengCard,2,off);
            cardWidth = card.width//*eatNode.scaleX;
            var childCount = parent.childrenCount;
            card.zIndex = 4 - childCount;
            card.x = 0;
            card.y = childCount * getOffY_xyHongZi(node, card);
            setChiCardAnchorPoint_xyHongZi(node, card);
            parent.addChild(card);
        }
        eatNode.addChild(parent);

        RemoveHandCard_xyHongZi(node,pengCard,off);
        RemoveHandCard_xyHongZi(node,pengCard,off);
        MjClient.playui.ResetHandCard(node, off);
        ShowEatActionAnim_xyHongZi(node, ActionType_xyHongZi.PENG, off);


        var callback = function(){
            ShowPutCardIcon_xyHongZi();
            // parent.removeFromParent(true);
            // MjClient.playui.ResetOtherCard(node, off);
        };

        var parentPos = getChiCardParentPosition_xyHongZi(node, cardWidth, off, 1);
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
        setCardParentPosY_xyHongZi(node, parent);
        var action2 = cc.moveTo(0.16, parentPos.x,parentPos.y);
        var action3 = cc.callFunc(callback);
        parent.runAction(cc.sequence(action2,action3));
    }
}

//偎牌
function DealWeiCard_xyHongZi(node, msg, off) {
    cc.log("======DealWeiCard_xyHongZi======= ");
    if(off == 1 && node.getName() == "right" && MjClient.MaxPlayerNum_xyHongZi == 2){
        return;//2人玩法right节点同为玩家节点
    }
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var uids = tData.uids;
    var selfIndex = (uids.indexOf(SelfUid()) + off) % MjClient.MaxPlayerNum_xyHongZi;
    if (tData.curPlayer == selfIndex) {
        RemovePutCardOut_xyHongZi();
        ShowEatActionAnim_xyHongZi(node, ActionType_xyHongZi.WEI, off);

        var parent = new cc.Node();
        var eatNode = node.getChildByName("eatNode");
        var cardWidth = 0;
        var pl = sData.players[tData.uids[selfIndex] + ""];
        var weiCard = msg.newCard;
        for (var i = 0; i < 3; i++) {
            var isTurn = true;
            if (MjClient.gameType == MjClient.GAME_TYPE.XIANG_XIANG_GAO_HU_ZI || MjClient.gameType == MjClient.GAME_TYPE.LOU_DI_FANG_PAO_FA ||
                MjClient.gameType == MjClient.GAME_TYPE.ZP_LY_CHZ || MjClient.majiang.getCardShowType(tData.uids[tData.curPlayer], weiCard) == 2) 
            {
                if (i == getShowCardIdx_xyHongZi(node, "wei")) {
                    isTurn = false;
                }
                var card = getNewCard_xyHongZi(weiCard, 2, off, isTurn);
            } else if (MjClient.majiang.getCardShowType(tData.uids[tData.curPlayer], weiCard) == 1) {
                var card = getNewCard_xyHongZi(weiCard, 2, off);
                var shade = new cc.Sprite("playing/paohuzi/huxiBG1.png");
                shade.opacity = 100;
                shade.x = shade.width / 2;
                shade.y = shade.height / 2;
                card.addChild(shade);
            } else if (MjClient.majiang.getCardShowType(tData.uids[tData.curPlayer], weiCard) == 0) {
                var card = getNewCard_xyHongZi(weiCard, 2, off, true);
            }
            cardWidth = card.width //*eatNode.scaleX;
            card.zIndex = 4 - i;
            card.x = 0;
            card.y = i * getOffY_xyHongZi(node, card);
            setChiCardAnchorPoint_xyHongZi(node, card);
            parent.addChild(card);
        }
        eatNode.addChild(parent);

        RemoveHandCard_xyHongZi(node, weiCard, off);
        RemoveHandCard_xyHongZi(node, weiCard, off);
        MjClient.playui.ResetHandCard(node, off);

        var callback = function() {
            ShowPutCardIcon_xyHongZi();
            // parent.removeFromParent(true);
            // MjClient.playui.ResetOtherCard(node, off);
            if (pl.mjState == TableState.waitEat) {
                MjClient.playui.EatVisibleCheck();
            }
        };

        var parentPos = getChiCardParentPosition_xyHongZi(node, cardWidth, off, 1);
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
        setCardParentPosY_xyHongZi(node, parent);
        var action2 = cc.moveTo(0.2, parentPos.x, parentPos.y);
        var action3 = cc.callFunc(callback);
        parent.runAction(cc.sequence(action2, action3));
    }
    //MjClient.playui.CardLayoutRestore(node,off);
}

// 跑牌或者提牌
function DealGangCard_xyHongZi(node, msg, off) {
    if(off == 1 && node.getName() == "right" && MjClient.MaxPlayerNum_xyHongZi == 2){
        return;//2人玩法right节点同为玩家节点
    }
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var uids = tData.uids;
    var selfIndex = (uids.indexOf(SelfUid()) + off) % MjClient.MaxPlayerNum_xyHongZi;
    var gangUid = msg.cpginfo.uid;
    if (uids.indexOf(gangUid) == selfIndex) {
        if (msg.type == 2) {
            RemovePutCardOut_xyHongZi();
            ShowEatActionAnim_xyHongZi(node, ActionType_xyHongZi.PAO, off);
        } else {
            if (!msg.isGangHand && msg.type == 1) {
                RemovePutCardOut_xyHongZi();
            }
            ShowEatActionAnim_xyHongZi(node, ActionType_xyHongZi.TI, off);
        }

        var parent = new cc.Node();
        var eatNode = node.getChildByName("eatNode");
        var cardWidth = 0;
        var pl = sData.players[tData.uids[selfIndex] + ""];
        var gangCard = msg.newCard;
        for (var i = 0; i < 4; i++) {
            var isTurn = true;
            if (msg.type == 2) {
                isTurn = false;
                var card = getNewCard_xyHongZi(gangCard, 2, off, isTurn);
            } else if (MjClient.gameType == MjClient.GAME_TYPE.XIANG_XIANG_GAO_HU_ZI || MjClient.gameType == MjClient.GAME_TYPE.LOU_DI_FANG_PAO_FA ||
                MjClient.gameType == MjClient.GAME_TYPE.ZP_LY_CHZ || MjClient.majiang.getCardShowType(tData.uids[tData.curPlayer], gangCard) == 2) 
            {
                if (i == getShowCardIdx_xyHongZi(node, "ti")) {
                    isTurn = false;
                }
                var card = getNewCard_xyHongZi(gangCard, 2, off, isTurn);
            } else if (MjClient.majiang.getCardShowType(tData.uids[tData.curPlayer], gangCard) == 1) {
                var card = getNewCard_xyHongZi(gangCard, 2, off, false);
                var shade = new cc.Sprite("playing/paohuzi/huxiBG1.png");
                shade.opacity = 100;
                shade.x = shade.width / 2;
                shade.y = shade.height / 2;
                card.addChild(shade);
            } else if (MjClient.majiang.getCardShowType(tData.uids[tData.curPlayer], gangCard) == 0) {
                var card = getNewCard_xyHongZi(gangCard, 2, off, true);
            }
            cardWidth = card.width //*eatNode.scaleX;
            card.zIndex = 4 - i;
            card.x = 0;
            card.y = i * getOffY_xyHongZi(node, card);
            setChiCardAnchorPoint_xyHongZi(node, card);
            parent.addChild(card);
        }
        var orignColPosX;
        var children = eatNode.children;
        for (var i = 0; i < children.length; i++) {
            var cardParent = children[i];
            cc.log("cardParent.children[0].tag@@ " + cardParent.children[0].tag, " i@@ ", i);
            if (cardParent.children[0].tag == gangCard) {
                orignColPosX = cardParent.x;
                break;
            }
        }

        eatNode.addChild(parent);

        RemoveHandCard_xyHongZi(node, gangCard, off);
        RemoveHandCard_xyHongZi(node, gangCard, off);
        RemoveHandCard_xyHongZi(node, gangCard, off);
        if (msg.isGangHand) {
            RemoveHandCard_xyHongZi(node, gangCard, off);
        }
        MjClient.playui.ResetHandCard(node, off);



        var callback = function() {
            ShowPutCardIcon_xyHongZi();
            // parent.removeFromParent(true);
            // MjClient.playui.ResetOtherCard(node, off);
            if (pl.mjState == TableState.waitCard) {
                //HZNewCardToServer_xyHongZi();
            } else if (pl.mjState == TableState.waitEat) {
                MjClient.playui.EatVisibleCheck();
            }
        };
        var parentPos = getChiCardParentPosition_xyHongZi(node, cardWidth, off, 1, orignColPosX);
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
        setCardParentPosY_xyHongZi(node, parent);
        var action2 = cc.moveTo(0.2, parentPos.x, parentPos.y);
        var action3 = cc.callFunc(callback);
        parent.runAction(cc.sequence(action2, action3));
    }
    //MjClient.playui.CardLayoutRestore(node,off);
}

// 处理胡
function DealHu_xyHongZi(node, msg, off){
    if(off == 1 && node.getName() == "right" && MjClient.MaxPlayerNum_xyHongZi == 2){
        return;//2人玩法right节点同为玩家节点
    }
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var selfIndex = (tData.uids.indexOf(SelfUid()) + off) % MjClient.MaxPlayerNum_xyHongZi;
    var pl = getUIPlayer_xyHongZi(off);
    if(tData.uids[selfIndex] != msg.uid){
        return;
    }
    if(pl){
        pl.eatFlag = 0;
        MjClient.playui.EatVisibleCheck();
        ShowEatActionAnim_xyHongZi(node,ActionType_xyHongZi.HU,off);
    }
}

function DealAddCard_xyHongZi(node,msg, off){
    if(off == 1 && node.getName() == "right" && MjClient.MaxPlayerNum_xyHongZi == 2){
        return;//2人玩法right节点同为玩家节点
    }
    if(MjClient.rePlayVideo == -1 && off != 0){
        return;
    }
    var cardArr = MjClient.HandCardArr;
    if(off != 0 && MjClient.rePlayVideo != -1){
        cardArr = MjClient.OtherHandArr[off];
    }
    var pl = getUIPlayer_xyHongZi(off);
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


//清除打出的牌
function RemovePutCardOut_xyHongZi(noAction){
    var jsBind = MjClient.playui.jsBind;
    var uiList = [jsBind.down, jsBind.right, jsBind.left];
    if (MjClient.gameType == MjClient.GAME_TYPE.PAO_HU_ZI_SR || MjClient.gameType == MjClient.GAME_TYPE.PAO_HU_ZI_SR_King)
    {
        uiList = [jsBind.down, jsBind.right, jsBind.xing, jsBind.left];
    }
    else if(MjClient.gameType == MjClient.GAME_TYPE.LUO_DI_SAO|| MjClient.gameType == MjClient.GAME_TYPE.HY_LIU_HU_QIANG || MjClient.gameType == MjClient.GAME_TYPE.JIANG_YONG_15Z ||
        MjClient.gameType == MjClient.GAME_TYPE.XIANG_YIN_ZHUO_HONG_ZI)
    {
        if (MjClient.MaxPlayerNum_xyHongZi == 3)
        {
            uiList = [jsBind.down, jsBind.right, jsBind.left];
        }
        else
        {
            uiList = [jsBind.down, jsBind.xing, jsBind.right, jsBind.left];
        }
    }

    for(var i = 0;i < uiList.length;i++){
        var _node = uiList[i];
        var putNode = _node._node.getChildByName("put");
        //putNode.removeAllChildren();
        //putNode.visible = false;

        if (!putNode)
        {
            continue;
        }


        var pl = getUIPlayer_xyHongZi(i);
        if (MjClient.gameType == MjClient.GAME_TYPE.PAO_HU_ZI_SR || MjClient.gameType == MjClient.GAME_TYPE.PAO_HU_ZI_SR_King)
        {
            pl = getUIPlayer_xyHongZi(getOffByXing_xyHongZi(i));
        }


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
            if(outNodeCount>0){
                var type = ziPai.getUiLayoutType();
                if(type == 0){
                    if(_node._node.getName() == "down"){
                        moveX = outNode.getPosition().x - outNodeChilden[0].width * (outNodeCount % 6) * outNode.getScale();
                        moveY = outNode.getPosition().y + outNodeChilden[0].height * Math.floor(outNodeCount / 6) * outNode.getScale();
                    }else if(_node._node.getName() == "right"){
                        moveX = outNode.getPosition().x - outNodeChilden[0].width * (outNodeCount % 6) * outNode.getScale();
                        moveY = outNode.getPosition().y + outNodeChilden[0].height * Math.floor(outNodeCount / 6) * outNode.getScale();
                    }else{
                        moveX = outNode.getPosition().x + outNodeChilden[0].width * (outNodeCount % 6) * outNode.getScale();
                        moveY = outNode.getPosition().y + outNodeChilden[0].height * Math.floor(outNodeCount / 6) * outNode.getScale();
                    }
                }else{
                    if(_node._node.getName() == "down"){
                        moveX = outNode.getPosition().x - outNodeChilden[0].width * (outNodeCount % 6) * outNode.getScale();
                        moveY = outNode.getPosition().y + outNodeChilden[0].height * Math.floor(outNodeCount / 6) * outNode.getScale();
                    }else if(_node._node.getName() == "xing"){
                        moveX = outNode.getPosition().x - outNodeChilden[0].width * outNodeCount * outNode.getScale();
                    }else if(_node._node.getName() == "right"){
                        moveX = outNode.getPosition().x - outNodeChilden[0].width * outNodeCount * outNode.getScale();
                    }else{
                        moveX = outNode.getPosition().x + outNodeChilden[0].width * outNodeCount * outNode.getScale();
                    }
                }
            }

            var targetPos = cc.p(moveX, moveY);
            putNode.runAction(cc.sequence(
                cc.spawn(cc.moveTo(0.16, targetPos), cc.scaleTo(0.16, putNode.getUserData().scale*0.3)),
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
function clearMJHandCardUI_xyHongZi() {
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
    if((MjClient.gameType == MjClient.GAME_TYPE.LUO_DI_SAO || MjClient.gameType == MjClient.GAME_TYPE.JIANG_YONG_15Z) && MjClient.MaxPlayerNum_xyHongZi == 4){
        var eatNodeX = MjClient.playui._xingNode.getChildByName("eatNode");
        eatNodeX.removeAllChildren();
        var outNodeX = MjClient.playui._xingNode.getChildByName("outNode");
        outNodeX.removeAllChildren();
    }
    RemovePutCardOut_xyHongZi(true);
}

//出牌表示状态
function ShowPutCardIcon_xyHongZi() {
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
            var pl = getUIPlayer_xyHongZi(0);
            if (pl.isQiHu) {
                status = false;
            }
        }
        finger.stopAllActions();
        finger.visible = status;
        var action1 = cc.fadeTo(0.5, 0);
        var action2 = cc.fadeTo(0.5, 255);
        var seq = cc.sequence(action1, action2);
        finger.runAction(cc.repeatForever(seq));

        cutLine.visible = status;
        // if(MjClient.movingCard_xyHongZi){
        //  cutLine.visible = status;
        // }
    }
}

//清除手牌
function RemoveHandCard_xyHongZi(node,card,off){
    if(MjClient.rePlayVideo == -1 && off != 0){
        return;
    }
    var cardArr = MjClient.HandCardArr;
    if(off != 0 && MjClient.rePlayVideo != -1){
        cardArr = MjClient.OtherHandArr[off];
    }
    cc.log("++++++++off:" + off +"-------cardArr:" + JSON.stringify(cardArr));
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
function InitShowEatActionNode_xyHongZi(plNode){
    cc.log("plNode:", plNode.name);
    var play_tips = plNode.getChildByName("play_tips");
    for(var i = 0; i < play_tips.children.length; i++){
        play_tips.children[i].visible = false;
    }
}

// 重置吃碰杠胡动作
function resetEatActionAnim_xyHongZi()
{
    var jsBind = MjClient.playui.jsBind;
    var ui = [jsBind.down,jsBind.right,jsBind.left];
    var tData = MjClient.data.sData.tData;
    if((MjClient.gameType == MjClient.GAME_TYPE.XIANG_YIN_ZHUO_HONG_ZI) && tData.maxPlayer == 4){
        ui = [jsBind.down, jsBind.xing,jsBind.right, jsBind.left];
    }
    var count = MjClient.MaxPlayerNum_xyHongZi;
    cc.log("count:", count);
    for(var i = 0; i < count; i++)
    {
        if(ui[i])
            InitShowEatActionNode_xyHongZi(ui[i]._node);
    }
}

//播放头像移动
function tableStartHeadMoveAction_xyHongZi(node){
    // var down = node.getChildByName("down").getChildByName("head");
    // var left = node.getChildByName("left").getChildByName("head");
    // var right = node.getChildByName("right").getChildByName("head");
    // setWgtLayout(down, [0.13, 0.13], [0, 0], [0.6, 2.8], false, false);
    // setWgtLayout(left, [0.13, 0.13], [0, 0.5], [0.6, 1.8], false, false);
    // setWgtLayout(right, [0.13, 0.13], [1, 0.5], [-0.6, 2.4], false, false);

    // var downPoint = cc.p(down.x, down.y);
    // var rightPoint = cc.p(right.x, right.y);
    // var leftPoint = cc.p(left.x, left.y);

    // setWgtLayout(down, [0.13, 0.13], [0.5, 0.5], [0, -2], false, false);
    // setWgtLayout(left, [0.13, 0.13], [0.5, 0.5], [-3, 0.1], false, false);
    // setWgtLayout(right, [0.13, 0.13], [0.5, 0.5], [3, 0.1], false, false);
    //    down.runAction(cc.moveTo(0.3, downPoint).easing(cc.easeCubicActionOut()));
    //    left.runAction(cc.moveTo(0.3, leftPoint).easing(cc.easeCubicActionOut()));
    //    right.runAction(cc.moveTo(0.3, rightPoint).easing(cc.easeCubicActionOut()));

    sendGPS();
    MjClient.checkChangeLocationApp();
}

//重置3家头像位置
function reConectHeadLayout_xyHongZi(node){
    var tData = MjClient.data.sData.tData;
    var down = node.getChildByName("down").getChildByName("head");
    var left = node.getChildByName("left").getChildByName("head");
    var right = node.getChildByName("right").getChildByName("head");
    var xing = node.getChildByName("xing").getChildByName("head");

    resetEatActionAnim_xyHongZi();
    setWgtLayout(down, [0.18, 0.18], [0.04, 0.05], [0, 0], false, false);
    setWgtLayout(left, [0.18, 0.18], [0.04, 0.90], [0, 0], false, false);
    setWgtLayout(right,[0.18, 0.18], [0.96, 0.89], [0, 0], false, false);
    setWgtLayout(xing,[0.18, 0.18], [0.96, 0.05], [0, 0], false, false);
    // if(tData.tState == TableState.waitJoin || tData.tState == TableState.roundFinish)
    // {
    // 	setWgtLayout(down, [0.13, 0.13], [0.5, 0.5], [0, -2], false, false);
    // 	setWgtLayout(left, [0.13, 0.13], [0.5, 0.5], [-4.8, 0.1], false, false);
    // 	setWgtLayout(right, [0.13, 0.13], [0.5, 0.5], [4.8, 0.1], false, false);
    // }
    // else
    // {
    // 	setWgtLayout(down, [0.13, 0.13], [0, 0], [0.6, 2.8], false, false);
    // 	setWgtLayout(left, [0.13, 0.13], [0, 0.5], [0.6, 1.8], false, false);
    // 	setWgtLayout(right, [0.13, 0.13], [1, 0.5], [-0.6, 2.4], false, false);
    // }
}

//根据偏移获得玩家node
function getNode_xyHongZi(off){
    var _node = null;
    if(MjClient.gameType == MjClient.GAME_TYPE.PAO_HU_ZI_SR || MjClient.gameType == MjClient.GAME_TYPE.PAO_HU_ZI_SR_King){
        var tData = MjClient.data.sData.tData;
        var selfIndex = tData.uids.indexOf(SelfUid());
        if(selfIndex == tData.xingPlayer){
            // off = (tData.zhuang + 2 + off + MjClient.MaxPlayerNum_xyHongZi) % MjClient.MaxPlayerNum_xyHongZi;
            if(off == MjClient.MaxPlayerNum_xyHongZi - 1){
                //如果是最后一个玩家，则偏移需要移动一个，换算成3人
                off -= 1;
            }
        }else{
            if(selfIndex + 1 == tData.xingPlayer && off != 0){
                //如果下家是醒家，则另外两家的偏移都要往前移动一位
                off -= 1;
            }
            if(off == MjClient.MaxPlayerNum_xyHongZi - 1){
                off -= 1;
            }
        }
    }
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
    if(MjClient.data.sData.tData.maxPlayer == 2){
        switch (off)
        {
            case 0:
                _node = MjClient.playui._downNode;
                //cc.log("0 = playChatAni");
                break;
            case 1:
                //cc.log("1 = playChatAni");
                _node = MjClient.playui._topNode;
                break;
            default:
                break;
        }
    }

    
    if(MjClient.MaxPlayerNum_xyHongZi == 4 && (MjClient.gameType == MjClient.GAME_TYPE.LUO_DI_SAO || 
                                                MjClient.gameType == MjClient.GAME_TYPE.HY_LIU_HU_QIANG || 
                                                MjClient.gameType == MjClient.GAME_TYPE.JIANG_YONG_15Z ||
                                                MjClient.gameType == MjClient.GAME_TYPE.XIANG_YIN_ZHUO_HONG_ZI))
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
function getUIPlayer_xyHongZi(off){
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var uids = tData.uids;
    var selfIndex = uids.indexOf(SelfUid());
    selfIndex = (selfIndex + off) % MjClient.MaxPlayerNum_xyHongZi;
    if(selfIndex < uids.length){
        return sData.players[uids[selfIndex]];
    }

    return null;
}

// 获取ui头像，通过偏移值
function getUIHeadByOff_xyHongZi(off){
    var pl = getUIPlayer_xyHongZi(off);
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
function downAndPlayVoice_xyHongZi(uid, filePath){
    var index = getUiOffByUid_xyHongZi(uid);
    //console.log("index is downAndPlayVoice" + index);
    MjClient.native.DownLoadFile(jsb.fileUtils.getWritablePath(), index + ".mp3", MjClient.remoteCfg.voiceUrl + filePath, "playVoice");
}

function getUiOffByUid_xyHongZi(uid){
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var uids = tData.uids;
    var selfIndex = uids.indexOf(SelfUid());
    var targetIndex = uids.indexOf(uid);
    return (targetIndex - selfIndex + MjClient.MaxPlayerNum_xyHongZi) % MjClient.MaxPlayerNum_xyHongZi;
}

//设置微信头像
function setWxHead_xyHongZi(node, d, off){
    if(d.uid == getUIHeadByOff_xyHongZi(off).uid){
        var nobody = node.getChildByName("nobody");
        var wxHead = nobody.getChildByName("WxHead");
        if(wxHead)
            wxHead.removeFromParent();

        var sp = new cc.Sprite(d.img);
        sp.setName("WxHead");
        nobody.addChild(sp);
        setWgtLayout(sp, [0.87, 0.87], [0.5, 0.5], [0, 0], false, true);
        COMMON_UI.addNobleHeadFrame(nobody,getUIPlayer_xyHongZi(off))
    }
}

//显示玩家庄的ui
function showUserZhuangLogo_xyHongZi(node, off){
    var tData = MjClient.data.sData.tData;
    var pl = getUIPlayer_xyHongZi(off);
    node.zIndex = 100;
    if(tData && pl){
        if(tData.uids[tData.zhuang] == pl.info.uid){
            node.visible = true;
            var linkZhuang = node.getChildByName("linkZhuang");
            var path = "playing/gameTable/shuzi/shuzi_" + pl.linkZhuang + ".png";
            //cc.log("path = " + path);
            linkZhuang.loadTexture(path);
            // var isVisible = (tData.gameType == MjClient.GAME_TYPE.SHEN_YANG);
            // linkZhuang.setVisible(isVisible);
        }else{
            node.visible = false;
        }
    }
}

//显示房主  add by sking
function showFangzhuTagIcon_xyHongZi(node,off)
{
    var pl = getUIPlayer_xyHongZi(off);
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


    // 显示东南西北
    var directionGameType = [];
    directionGameType.push(MjClient.GAME_TYPE.LUO_DI_SAO);
    directionGameType.push(MjClient.GAME_TYPE.JIANG_YONG_15Z);
    directionGameType.push(MjClient.GAME_TYPE.PAO_HU_ZI_SR);
    directionGameType.push(MjClient.GAME_TYPE.PAO_HU_ZI);
    directionGameType.push(MjClient.GAME_TYPE.PAO_HU_ZI_ER);
    directionGameType.push(MjClient.GAME_TYPE.PAO_HU_ZI_King);
    directionGameType.push(MjClient.GAME_TYPE.PAO_HU_ZI_SR_King);
    directionGameType.push(MjClient.GAME_TYPE.ZP_LY_CHZ);
    directionGameType.push(MjClient.GAME_TYPE.HY_LIU_HU_QIANG);
    directionGameType.push(MjClient.GAME_TYPE.HY_SHI_HU_KA);
    directionGameType.push(MjClient.GAME_TYPE.XIANG_YIN_ZHUO_HONG_ZI);

    // if( directionGameType.indexOf(MjClient.gameType) >= 0 ){
    //     var uidIndex = tData.uids.indexOf(pl.info.uid);
    //     var font = ['dong', 'nan', 'xi', 'bei'];
    //     var sp = cc.Sprite("playing/gameTable/youxizhong_zuo_" + font[uidIndex] + ".png");
    //     sp.setName('playerDirection')
    //     sp.x = -10;
    //     if(node.getChildByName('playerDirection'))	node.getChildByName('playerDirection').removeFromParent();
    //     node.addChild(sp);
    //     cc.log('directionGameType ok ok ok ');

    // }

    //改成文字
    if( directionGameType.indexOf(MjClient.gameType) >= 0 ){
        var uidIndex = tData.uids.indexOf(pl.info.uid);
        var font = ['东', '南', '西', '北'];
        var sp = new cc.LabelTTF( font[uidIndex],MjClient.fzcyfont,25);
        sp.setName('playerDirection')
        sp.x = -20;
        sp.y = -56;
        if(node.getChildByName('playerDirection'))  node.getChildByName('playerDirection').removeFromParent();
        node.addChild(sp);
        cc.log('directionGameType ok ok ok ');
    }

}

// 清理ui
function clearCardUI_xyHongZi(node,off){
    mylog("clearCardUI_xyHongZi");
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
        )
        {
            ni.removeFromParent(true);
        }
        else if(ni.getName() == "play_tips")
        {
            InitShowEatActionNode_xyHongZi(ni.getParent());
        }
    }
}

function EatFlag_xyHongZi(){
    var eat = MjClient.playui.jsBind.eat;
    var eatFlag = 0;

    if(eat.hu._node.visible)
    {
        eatFlag = eatFlag + 32;
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

function huXiScore_xyHongZi(type,card)
{
    var cardType = Math.ceil(card/10);
    var score = 0;
    switch(type)
    {
        case "tiPai":
            if(cardType == 1){
                score += 9;
            }else if(cardType == 3){
                score += 12;
            }
            break;
        case "weiPai":
            if(cardType == 1){
                score += 3;
            }else if(cardType == 3){
                score += 6;
            }
            break;
        case "paoPai":
            if(cardType == 1){
                score += 6;
            }else if(cardType == 3){
                score += 9;
            }
            break;
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
    }
    return score;
}

//刷新胡息
function UpdateHuXi_xyHongZi(off){
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var score = 0;
    var pl = getUIPlayer_xyHongZi(off);
    if(!pl){
        return;
    }
    //跑牌
    var mjpao = pl.mjgang0;
    if(mjpao.length>0){
        for(var p=0;p<mjpao.length;p++){
            score += huXiScore_xyHongZi("paoPai",mjpao[p]);
        }
    }

    //碰
    var mjpeng = pl.mjpeng;
    if(mjpeng.length>0){
        for(var i=0;i<mjpeng.length;i++){
            score += huXiScore_xyHongZi("peng",mjpeng[i]);
        }
    }

    //吃
    var mjchi = pl.mjchi;
    if(mjchi.length>0){
        var chiScore = function(cards){
            cards = [].concat(cards);
            cards.sort(function(a, b) {return a - b}); // 耒阳调整了eatCards顺序
            var chiXiArr = [[1,2,3],[21,22,23],[2,7,10],[22,27,30], [1, 5, 10], [21, 25, 30]];
            for(var k=0;k<chiXiArr.length;k++){
                var chiXiList = chiXiArr[k];
                if(cards.toString() == chiXiList.toString()){
                    score += huXiScore_xyHongZi("chi",cards[0]);
                }
            }
        };

        for(var i=0;i<mjchi.length;i++){
            var eatCards = mjchi[i].eatCards;
            var biCards = mjchi[i].biCards;
            chiScore(eatCards);
            if(biCards){
                for(var m = 0;m<biCards.length;m++){
                    chiScore(biCards[m]);
                }
            }
        }
    }

    //耒阳提偎算胡息
    if((MjClient.gameType == MjClient.GAME_TYPE.HY_LIU_HU_QIANG || MjClient.gameType == MjClient.GAME_TYPE.XIANG_YIN_ZHUO_HONG_ZI)&&pl.info.uid!=SelfUid()){
        //提牌
        var mjti = pl.mjgang1;
        if(mjti.length>0){
            for (var t = 0; t < mjti.length; t++) {
                if(MjClient.majiang.getCardShowType(pl.info.uid, mjti[t]) != 0){
                    score += huXiScore_xyHongZi("tiPai", mjti[t]);
                }
            }
        }
        //偎牌
        // var mjwei = pl.mjwei;
        // if(mjwei.length>0){
        //     for (var w = 0; w < mjwei.length; w++) {
        //         if(MjClient.majiang.getCardShowType(pl.info.uid, mjwei[w]) != 0) {
        //             score += huXiScore_xyHongZi("weiPai", mjwei[w]);
        //         }
        //     }
        // }
    }else {
        //提牌
        var mjti = pl.mjgang1;
        if(mjti.length>0){
            for (var t = 0; t < mjti.length; t++) {
                score += huXiScore_xyHongZi("tiPai", mjti[t]);
            }
        }
        //偎牌
        // var mjwei = pl.mjwei;
        // if(mjwei.length>0){
        //     for (var w = 0; w < mjwei.length; w++) {
        //         score += huXiScore_xyHongZi("weiPai", mjwei[w]);
        //     }
        // }
    }

    var selfIndex = tData.uids.indexOf(SelfUid());
    if(tData.xingPlayer == selfIndex){
        pl = getUIPlayer_xyHongZi(2);
        //提牌
        var mjti = pl.mjgang1;
        if(mjti.length>0){
            for(var t=0;t<mjti.length;t++){
                score += huXiScore_xyHongZi("tiPai",mjti[t]);
            }
        }
        //偎牌
        // var mjwei = pl.mjwei;
        // if(mjwei.length>0){
        //     for(var w=0;w<mjwei.length;w++){
        //         score += huXiScore_xyHongZi("weiPai",mjwei[w]);
        //     }
        // }
    }

    //耒阳手牌也要算胡息
    if(off == 0){
        var cardArr = MjClient.HandCardArr;
        // score +=  MjClient.majiang.getHandHuxi(cardArr); // todo qq
    }
    return score;
}

//设置转盘显示状态
function IsArrowVisible_xyHongZi(){
    var pl = getUIPlayer_xyHongZi(0);
    if (!pl)
    {
        return;
    }

    if(
        TableState.waitPut == pl.mjState ||
        TableState.waitEat == pl.mjState ||
        TableState.waitCard == pl.mjState ||
        TableState.roundFinish == pl.mjState ||
        TableState.waitJiazhu == pl.mjState
    )
    {
        return true;
    }else{
        return false;
    }
}

// 显示吃碰杠胡动作
function ShowEatActionAnim_xyHongZi(node, actType, off){
    var delayTime = 1;
    switch(actType)
    {
        case ActionType_xyHongZi.FANXING:
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
        case ActionType_xyHongZi.CHI:

            eatActionChild = eatActionNode.getChildByName("chi");
            eatActionChild.visible = true;
            eatActionChild.runAction(cc.sequence(cc.delayTime(delayTime), cc.callFunc(callback)));
            break;

        case ActionType_xyHongZi.PENG:

            eatActionChild = eatActionNode.getChildByName("peng");
            eatActionChild.visible = true;
            eatActionChild.runAction(cc.sequence(cc.delayTime(delayTime), cc.callFunc(callback)));
            break;

        case ActionType_xyHongZi.WEI:
            eatActionChild = eatActionNode.getChildByName("wei");
            //耒阳不叫啸叫偎
            eatActionChild.loadTexture("playing/paohuzi/t_wei.png");
            eatActionChild.visible = true;
            eatActionChild.runAction(cc.sequence(cc.delayTime(delayTime), cc.callFunc(callback)));
            break;

        case ActionType_xyHongZi.HU:

            eatActionChild = eatActionNode.getChildByName("hu");
            eatActionChild.visible = true;
            break;
        case ActionType_xyHongZi.PAO:
            eatActionChild = eatActionNode.getChildByName("pao");
            eatActionChild.visible = true;
            eatActionChild.runAction(cc.sequence(cc.delayTime(delayTime), cc.callFunc(callback)));
            break;
        case ActionType_xyHongZi.TI:

            eatActionChild = eatActionNode.getChildByName("ti");
            //耒阳不叫倾叫提
            eatActionChild.loadTexture("playing/paohuzi/t_ti.png");
            eatActionChild.visible = true;
            eatActionChild.runAction(cc.sequence(cc.delayTime(delayTime), cc.callFunc(callback)));
            break;
        case ActionType_xyHongZi.WANGDIAO:
            eatActionChild = eatActionNode.getChildByName("wangDiao");
            eatActionChild.visible = true;
            eatActionChild.runAction(cc.sequence(cc.delayTime(delayTime), cc.callFunc(callback)));
            break;
        case ActionType_xyHongZi.WANGCHUANG:
            eatActionChild = eatActionNode.getChildByName("wangChuang");
            eatActionChild.visible = true;
            eatActionChild.runAction(cc.sequence(cc.delayTime(delayTime), cc.callFunc(callback)));
            break;
        case ActionType_xyHongZi.XIAHUO:
            eatActionChild = eatActionNode.getChildByName("xiahuo");
            eatActionChild.visible = true;
            eatActionChild.runAction(cc.sequence(cc.delayTime(delayTime), cc.callFunc(callback)));
            break;
        case ActionType_xyHongZi.FANXING:
            eatActionChild = eatActionNode.getChildByName("fanxing");
            eatActionChild.visible = true;
            eatActionChild.runAction(cc.sequence(cc.delayTime(delayTime), cc.callFunc(callback)));
            break;
    }
}

//显示玩家信息
function showPlayerInfo_xyHongZi(off, node){
    //var tData = MjClient.data.sData.tData;
    var pl = getUIPlayer_xyHongZi(off);
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

function resetChiParam_xyHongZi(){

}

function setChiVisible_xyHongZi(){
    var eat = MjClient.playui.jsBind.eat;
    eat.chi._node.visible = false;
    eat.peng._node.visible = false;
    eat.hu._node.visible = false;
    eat.guo._node.visible = false;
    eat.cancel._node.visible = false;
    eat.wangDiao._node.visible = false;
    eat.wangChuang._node.visible = false;
    eat.wangZha._node.visible = false;
    eat.chiSelect._node.visible = false;
    eat.biSelect._node.visible = false;
    eat.biSelect1._node.visible = false;

    eat.chi._node.setTouchEnabled(false);
    eat.peng._node.setTouchEnabled(false);
    eat.hu._node.setTouchEnabled(false);
    eat.guo._node.setTouchEnabled(false);
    eat.cancel._node.setTouchEnabled(false);
    eat.wangDiao._node.setTouchEnabled(false);
    eat.wangChuang._node.setTouchEnabled(false);
    eat.wangZha._node.setTouchEnabled(false);
    eat.chiSelect._node.setTouchEnabled(false);
    eat.biSelect._node.setTouchEnabled(false);
    eat.biSelect1._node.setTouchEnabled(false);
}

function showSelectEatCards_xyHongZi(node,cardNum){
    var eat = MjClient.playui.jsBind.eat;
    eat.chi._node.visible = false;
    eat.guo._node.visible = false;
    eat.peng._node.visible = false;
    eat.hu._node.visible = false;
    eat.cancel._node.visible = true;

    eat.chi._node.setTouchEnabled(false);
    eat.guo._node.setTouchEnabled(false);
    eat.peng._node.setTouchEnabled(false);
    eat.hu._node.setTouchEnabled(false);
    eat.cancel._node.setTouchEnabled(true);
    eat.cancel._node.setBright(true);

    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var putCard = tData.lastPutCard;
    var pl = sData.players[SelfUid()];
    var chiSet = MjClient.majiang.getChiList(pl,putCard);
    cc.log("@@@pl:" + JSON.stringify(pl));
    cc.log("@@@putCard:" + putCard);
    cc.log("@@@chiSet:", chiSet);
    if(chiSet.length <= 0){
        eat.cancel._node.visible = false;
        eat.cancel._node.setTouchEnabled(false);
        return;
    }

    var parent = node.getParent();
    var chiBg = parent.getChildByName("chiSelect");
    if(!initSize){
        //保存chiBg的初始大小
        initSize = chiBg.getContentSize();
    }
    var cardArr = pl.mjhand.slice();
    addEatCards_xyHongZi(parent,cardArr,putCard, pl);
}

function doMoveCenterAction_xyHongZi(arr,isScale){
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

//添加可以吃的牌
function addEatCards_xyHongZi(node,handCardArr,putCard, pl){
    var chiBg = node.getChildByName("chiSelect");
    chiBg.x = cc.winSize.width * 0.5;
    chiBg.visible = true;

    var children = chiBg.children;
    for(var i = 0; i < children.length; i++){
        if(children[i].getName() == "cloneBtn"){
            children[i].removeFromParent(true);
        }
    }

    var off_x = 5,off_y = 20;
    var selectBtn = chiBg.getChildByName("selectBtn");
    var startPos = selectBtn.getPosition();

    var chiSet = MjClient.majiang.getChiList(pl,putCard);
    var off_width = (initSize.width-selectBtn.width)/2;
    chiBg.setContentSize(cc.size(selectBtn.width * chiSet.length + (chiSet.length-1) * off_x + off_width*2,initSize.height));

    for(var i = 0;i < chiSet.length;i++){
        var chiCloneBtn = selectBtn.clone();
        chiCloneBtn.visible = true;
        chiCloneBtn.setName("cloneBtn");

        var cardList = chiSet[i];
        for(var k = 0;k < cardList.length;k++){
            var card = cardList[k];
            var cardNode = chiCloneBtn.getChildByName("card_" + k);
            cardNode.visible = true;
            cardNode.loadTexture(MjClient.cardPath_xyHongZi+"hand" + card + ".png");
            cardNode.zIndex = cardList.length - k;
        }
        chiCloneBtn.setPosition(cc.p(startPos.x + (chiCloneBtn.width + off_x) * i , startPos.y));
        chiBg.addChild(chiCloneBtn);
        chiCloneBtn.setUserData(cardList);

        chiCloneBtn.addClickEventListener(function(chiBtn){
            if(MjClient.playui.jsBind.eat.biSelect._node.visible){
                MjClient.playui.jsBind.eat.biSelect.hasShow = true;
            }else{
                MjClient.playui.jsBind.eat.biSelect.hasShow = false;
            }
            MjClient.playui.jsBind.eat.biSelect._node.visible = false;
            MjClient.playui.jsBind.eat.biSelect1._node.visible = false;
            MjClient.playui.jsBind.eat.biSelect._node.setTouchEnabled(false);
            MjClient.playui.jsBind.eat.biSelect1._node.setTouchEnabled(false);

            var btnList = chiBg.children;
            for(var m = 0;m < btnList.length;m++){
                btnList[m].setBright(true);
            }
            chiBtn.setBright(false);
            var chiArr = chiBtn.getUserData();
            // var tmpHandCardArr = handCardArr.slice();
            // var ttArr = chiArr.slice();
            // ttArr.splice(ttArr.indexOf(putCard),1);
            // for(var i = 0;i < ttArr.length;i++){
            //     tmpHandCardArr.splice(tmpHandCardArr.indexOf(ttArr[i]),1);
            // }
            // if(tmpHandCardArr.indexOf(putCard) < 0){
            //     setChiVisible_xyHongZi();
            //     HZChiToServer_xyHongZi(chiArr,null);
            // }else{
            //     var biSet = MjClient.majiang.getBiCards(tmpHandCardArr,putCard);
            //     if(biSet && biSet.length > 0){
            //         addFirstBiCards_xyHongZi(node,biSet,putCard,tmpHandCardArr,chiArr);
            //     }
            // }
            // setChiVisible_xyHongZi();
            // HZChiToServer_xyHongZi(chiArr,null);
            commitEatCards_xyHongZi(chiArr, null);
        });
    }

    if(ziPai.getUiLayoutType() == 0){//新布局
        doMoveCenterAction_xyHongZi([chiBg], false);
    }
}

//添加第一个比牌
function addFirstBiCards_xyHongZi(node,biSet,putCard,handCardArr,chiArr){
    var biBg = node.getChildByName("biSelect");
    biBg.x = cc.winSize.width * 0.5;
    biBg.visible = true;
    biBg.setTouchEnabled(true);

    var children = biBg.children;
    for(var i = 0; i < children.length; i++){
        if(children[i].getName() == "cloneBtn"){
            children[i].removeFromParent(true);
        }
    }
    var off_x = 5,off_y = 20;
    var selectBtn = biBg.getChildByName("selectBtn");
    var startPos = selectBtn.getPosition();

    var off_width = (initSize.width-selectBtn.width)/2;
    biBg.setContentSize(cc.size(selectBtn.width * biSet.length + (biSet.length-1) * off_x + off_width*2,initSize.height));

    for(var i = 0;i < biSet.length;i++){
        var cardList = biSet[i];
        var cloneBtn = selectBtn.clone();
        cloneBtn.visible = true;
        cloneBtn.setName("cloneBtn");
        cloneBtn.setUserData(cardList);

        for(var k = 0;k < cardList.length;k++){
            var card = cardList[k];
            var cardNode = cloneBtn.getChildByName("card_" + k);
            cardNode.visible = true;
            cardNode.loadTexture(MjClient.cardPath_xyHongZi+"hand" + card + ".png");
            cardNode.zIndex = cardList.length - k;
        }
        cloneBtn.setPosition(cc.p(startPos.x + (cloneBtn.width + off_x) * i , startPos.y));
        biBg.addChild(cloneBtn);

        cloneBtn.addClickEventListener(function(btn){
            if(MjClient.playui.jsBind.eat.biSelect1._node.visible){
                MjClient.playui.jsBind.eat.biSelect1.hasShow = true;
            }else{
                MjClient.playui.jsBind.eat.biSelect1.hasShow = false;
            }
            MjClient.playui.jsBind.eat.biSelect1._node.visible = false;
            MjClient.playui.jsBind.eat.biSelect1._node.setTouchEnabled(false);
            var btnList = biBg.children;
            for(var m = 0;m < btnList.length;m++){
                btnList[m].setBright(true);
            }
            btn.setBright(false);
            var tmpHandCardArr = handCardArr.slice();
            var biArr = btn.getUserData();
            for(var i = 0;i < biArr.length;i++){
                tmpHandCardArr.splice(tmpHandCardArr.indexOf(biArr[i]),1);
            }

            if(tmpHandCardArr.indexOf(putCard) >= 0){
                var biSet = MjClient.majiang.getBiCards(tmpHandCardArr,putCard);
                if(biSet && biSet.length > 0){
                    addSecBiCards_xyHongZi(node,biSet,putCard,tmpHandCardArr,chiArr,biArr);
                }
            }else{
                setChiVisible_xyHongZi();
                HZChiToServer_xyHongZi(chiArr,[biArr]);
            }
        });
    }

    var isScale = true;
    if(MjClient.playui.jsBind.eat.biSelect.hasShow){
        isScale = false;
    }
    var chiBg = node.getChildByName("chiSelect");
    doMoveCenterAction([chiBg,biBg],isScale);
}

//添加第二个比牌
function addSecBiCards_xyHongZi(node,biSet,putCard,handCardArr,chiArr,firstBiArr){
    var biBg = node.getChildByName("biSelect1");
    biBg.x = cc.winSize.width * 0.5;
    biBg.visible = true;
    biBg.setTouchEnabled(true);

    var children = biBg.children;
    for(var i = 0; i < children.length; i++){
        if(children[i].getName() == "cloneBtn"){
            children[i].removeFromParent(true);
        }
    }
    var off_x = 5,off_y = 20;
    var selectBtn = biBg.getChildByName("selectBtn");
    var startPos = selectBtn.getPosition();

    var off_width = (initSize.width-selectBtn.width)/2;
    biBg.setContentSize(cc.size(selectBtn.width * biSet.length + (biSet.length-1) * off_x + off_width*2,initSize.height));

    for(var i = 0;i < biSet.length;i++){
        var cardList = biSet[i];
        var cloneBtn = selectBtn.clone();
        cloneBtn.visible = true;
        cloneBtn.setName("cloneBtn");
        cloneBtn.setUserData(cardList);

        for(var k = 0;k < cardList.length;k++){
            var card = cardList[k];
            var cardNode = cloneBtn.getChildByName("card_" + k);
            cardNode.visible = true;
            cardNode.loadTexture(MjClient.cardPath_xyHongZi+"hand" + card + ".png");
            cardNode.zIndex = cardList.length - k;
        }
        cloneBtn.setPosition(cc.p(startPos.x + (cloneBtn.width + off_x) * i , startPos.y));
        biBg.addChild(cloneBtn);

        cloneBtn.addClickEventListener(function(btn){
            var biArr = btn.getUserData();
            var btnList = biBg.children;
            for(var m = 0;m < btnList.length;m++){
                btnList[m].setBright(true);
            }
            btn.setBright(false);
            setChiVisible_xyHongZi();
            HZChiToServer_xyHongZi(chiArr,[firstBiArr,biArr]);
        });
    }

    var isScale = true;
    if(MjClient.playui.jsBind.eat.biSelect1.hasShow){
        isScale = false;
    }
    var chiBg = node.getChildByName("chiSelect");
    var biBg0 = node.getChildByName("biSelect");
    doMoveCenterAction([chiBg,biBg0,biBg],isScale);
}

function GetReadyVisible_xyHongZi(node, off) {
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

    var pl = getUIPlayer_xyHongZi(off);
    if (pl && pl.mjState == TableState.isReady && tData.tState != TableState.waitJoin && tData.tState != TableState.waitShuffle) {
        node.visible = true;
    } else {
        node.visible = false;
    }

    return node.visible;
}

//设置玩家掉线头像
function setUserOffline_xyHongZi(node, off){
    var pl = getUIPlayer_xyHongZi(off);
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
function showUserChat_xyHongZi(node, off, msg){
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
            // if(displayCount >= 1 && !tData.matchId)
            // {
            //     if (tData.maxPlayer == 3)
            //         MjClient.Scene.addChild(new showDistance3PlayerLayer());
            //     else if(tData.maxPlayer != 2)
            //         MjClient.Scene.addChild(new showDistanceLayer());
            // }
        }

        return;
    }

    var pl = getUIPlayer_xyHongZi(off);
    //var uid = msg.uid;
    var type = msg.type;
    cc.log("sssssssssssssssssssssssssssss");
    cc.log(msg.msg);
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
function curPlayerIsMe_xyHongZi(off){
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    if(tData.tState == TableState.waitReady || tData.tState == TableState.roundFinish || MjClient.playui.isShufffling || tData.tState == TableState.waitShuffle){
        return false;
    }
    var selfIndex = tData.uids.indexOf(SelfUid());
    selfIndex = (selfIndex + off)%MjClient.MaxPlayerNum_xyHongZi;
    return selfIndex == tData.curPlayer;
}

function getVisablePlayerCount_xyHongZi(){
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
function getXingPlayerIndex_xyHongZi(){
    if(MjClient.MaxPlayerNum_xyHongZi != 4){
        return -1;
    }
    if(getVisablePlayerCount_xyHongZi() < 3){
        return -1;
    }
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var zhuang = tData.zhuang;
    if(zhuang == -1){
        zhuang = 0;
    }
    var xingIndex = (zhuang + 2 + MjClient.MaxPlayerNum_xyHongZi) % MjClient.MaxPlayerNum_xyHongZi;
    var selfIndex = tData.uids.indexOf(SelfUid());
    xingIndex = (xingIndex - selfIndex + MjClient.MaxPlayerNum_xyHongZi) % MjClient.MaxPlayerNum_xyHongZi;
    return xingIndex;
}

/**
 * 获取 我和off的距离（我和off在uids的下标的差） (如果醒家,醒家传过来的off固定是2)
 * @param  {number} off 在ui层上的位置 (down=0 right=1 left/top=3 xing=2)
 * @return {number} 返回偏移后的resoff  则 selfIndex 和 off位置的玩家 的距离,
 *                  提供 getUIPlayer_xyHongZi(resoff) 获取 off位置玩家数据
 */
function getOffByXing_xyHongZi(off){
    var resOff = off
    if(MjClient.MaxPlayerNum_xyHongZi != 4){
        return resOff;
    }
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var zhuang = tData.zhuang;
    //当庄还没确定的时候
    if(zhuang == -1){
        zhuang = 0;
    }
    var xingIndex = (zhuang + 2 + MjClient.MaxPlayerNum_xyHongZi) % MjClient.MaxPlayerNum_xyHongZi;
    //开局之后的判断
    var selfIndex = tData.uids.indexOf(SelfUid());
    if(selfIndex == xingIndex){ // xing为off固定为2， 参数off
        resOff = (2 + off) % MjClient.MaxPlayerNum_xyHongZi;
    }else{
        // 如果我的下家是醒家，且是ui层传过来的是位置是1 则跳过
        if((selfIndex + 1 + MjClient.MaxPlayerNum_xyHongZi) % MjClient.MaxPlayerNum_xyHongZi == xingIndex && off == 1){
            resOff = off + 1;

            // 如果我的上家是醒家，且是ui层传过来的是位置是3 则跳过
        }else if((selfIndex -1 + MjClient.MaxPlayerNum_xyHongZi) % MjClient.MaxPlayerNum_xyHongZi == xingIndex
            && off == MjClient.MaxPlayerNum_xyHongZi - 1){
            resOff = off - 1;

            // 如果我的上家是醒家, 且 传过来的是位置是2 , (发表情时发的是2）
        }else if( off==2 ){
            if((selfIndex + 1 + MjClient.MaxPlayerNum_xyHongZi) % MjClient.MaxPlayerNum_xyHongZi == xingIndex ){
                resOff = 1;
            }
            if((selfIndex - 1 + MjClient.MaxPlayerNum_xyHongZi) % MjClient.MaxPlayerNum_xyHongZi == xingIndex ){
                resOff = 3;
            }
        }
    }
    return resOff;
}

//重新开始后，重置MjClient.HandCardArr
function resetHandAfterBegin_xyHongZi(){
    var sData = MjClient.data.sData;
    var pl = sData.players[SelfUid() + ""];
    if(pl.mjState == TableState.isReady){
        MjClient.HandCardArr = [];
    }
}


/*
 设置弃胡状态
 */
function setQiHuState_xyHongZi()
{
    var pl = getUIPlayer_xyHongZi(0);
    if (pl.isQiHu) {
        var _skipHuIconNode = MjClient.playui._downNode.getChildByName("head").getChildByName("skipHuIconTag");
        _skipHuIconNode.visible = true;
    }
}


function changeMJBg_xyHongZi(node, type)
{
    if (node.toString() == "[object ImageView]") {
        var oldFile = node.getRenderFile().file;
        var newFile = getNewMJBgFile_xyHongZi(oldFile, type);

        if (newFile != oldFile) {
            node.loadTexture(newFile);
        }
    }

    var childArray = node.getChildren();
    for(var index in childArray)
    {
        var child = childArray[index];
        changeMJBg_xyHongZi(child, type);
    }
}

function getNewMJBgFile_xyHongZi(oldFile, type)
{

    

    if (oldFile.indexOf("playing/paohuzi/") == -1)
        return oldFile;

    if (type == undefined)
        type = ziPai.getZiPaiType();//getCurrentMJBgType_xyHongZi();

     
    var newFile = "";
    if (type == 0) {
        if (oldFile.indexOf("playing/paohuzi/MJBg1/") != -1){
            newFile = oldFile.replace("/MJBg1", "");
            MjClient.cardPath_xyHongZi = "playing/paohuzi/";
        }else if (oldFile.indexOf("playing/paohuzi/MJBg2/") != -1){
            newFile = oldFile.replace("/MJBg2", "");
            MjClient.cardPath_xyHongZi = "playing/paohuzi/";
        }
    }
    else if (type == 1) {
        if (oldFile.indexOf("/MJBg1") != -1)
            ;
        else if (oldFile.indexOf("/MJBg2") != -1){
            newFile = oldFile.replace("playing/paohuzi/MJBg2/", "playing/paohuzi/MJBg1/");
            MjClient.cardPath_xyHongZi = "playing/paohuzi/MJBg1/";
        }
        else if (oldFile.indexOf("playing/paohuzi/") != -1) {
            newFile = oldFile.replace("playing/paohuzi/", "playing/paohuzi/MJBg1/");
            MjClient.cardPath_xyHongZi = "playing/paohuzi/MJBg1/";
        }
    }
    else if (type == 2 ) {

        if (oldFile.indexOf("/MJBg2") != -1)
            ;
        else if (oldFile.indexOf("playing/paohuzi/MJBg1/") != -1){
            newFile = oldFile.replace("/MJBg1", "/MJBg2");
            MjClient.cardPath_xyHongZi = "playing/paohuzi/MJBg2/";
        }
        else if (oldFile.indexOf("playing/paohuzi/") != -1) {
            newFile = oldFile.replace("playing/paohuzi/", "playing/paohuzi/MJBg2/");
            MjClient.cardPath_xyHongZi = "playing/paohuzi/MJBg2/";
        }
    }

    // cc.log("newFile=" + newFile);
    if (newFile != "" && !jsb.fileUtils.isFileExist(newFile)) {
        // cc.log("getNewMJBgFile file not exsit : " + newFile);
        newFile = "";
    }

    return newFile != "" ? newFile : oldFile;
}

function getOtherWeiCards(card) {
    // var sData = MjClient.data.sData;
    // for(var uid in sData.players){
    //     if(Number(uid) != SelfUid()){
    //         var pl = sData.players[uid + ""];
    //         var mjSortArr = pl.mjsort;
    //         for(var k = 0;k < mjSortArr.length;k++){
    //             var mjsort = mjSortArr[k];
    //             var pos = mjsort.pos;
    //             var name = mjsort.name;
    //             //偎
    //             if(name == "mjwei"){
    //                 var cardNum = pl.mjwei[pos];
    //                 if(((MjClient.gameType == MjClient.GAME_TYPE.HY_LIU_HU_QIANG || MjClient.gameType == MjClient.GAME_TYPE.XIANG_YIN_ZHUO_HONG_ZI) && cardNum == card && MjClient.majiang.getCardShowType(pl.info.uid, cardNum)!=0)||(MjClient.gameType != MjClient.GAME_TYPE.HY_LIU_HU_QIANG && cardNum == card)){
    //                     return true;
    //                 }
    //             }
    //         }
    //     }
    // }
    return false;
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
function createRadioBoxForCheckBoxs_xyHongZi(nodes, callback, defaultIndex){
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




        // for (var j in newobj._nodeList){
        //     if(index != j){
        //         newobj._nodeList[j].setSelected(false);
        //     }
        // }
        // newobj._selectIndex = -1
        // for(var j in newobj._nodeList){
        //     if(newobj._nodeList[j].isSelected()){
        //         newobj._selectIndex = j;
        //     }
        // }

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
function changeGameTitleBg(backImageView, atMjGameing)
{
    var type = ziPai.getGameBgType();
    var file = "playing/gameTable/titleBg" + type + ".png";
    switch(type){ 
        case 3:
            file = "playing/gameTable/titleBg2.png";
        break;
    }

    if (jsb.fileUtils.isFileExist(file))
        backImageView.loadTexture(file);
};

//是否显示离开按钮（包括准备阶段）
function isShowBackBtn_xyHongZi(){
    if(IsInviteVisible()){
        return true;
    }else{
        var sData = MjClient.data.sData;
        var tData = sData.tData;
        if(TableState.waitReady == tData.tState){
            return true;
        }
        return false;
    }
};

function _checkIsAddGroup_xyHongZi(){
    var cardArr = MjClient.HandCardArr;
    var _node = getNode_xyHongZi(0);
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

function _hasValueInArr_xyHongZi(arr,value){
    var len = arr.length;
    for(var i = 0; i < len; i++){
        var temp = arr[i];
        if(temp == value){
            return true;
        }
    }
    return false;
}

function _checkGroupList_xyHongZi(groupList,tagName){
    var _node = getNode_xyHongZi(0);
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
                (!_hasValueInArr_xyHongZi(groupList,card.tag) || 
                    hasSameChild_xyHongZi(cardParent) ))// || cardParent.childrenCount > groupList.length))
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
                    (!_hasValueInArr_xyHongZi(groupList,card.tag) || 
                        hasSameChild_xyHongZi(cardParent) || cardParent.childrenCount > groupList.length))
                {
                    card.removeFromParent();
                }
            }
        }

    }
}

//一列中是否是相同的牌
function hasSameChild_xyHongZi(cardParent){
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
function findChildByNameAndIndex_xyHongZi(cardParent, mjNum, index){
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

function refreshHandCard_xyHongZi(tagName,index,mjNum,off){
    if(off != 0){
        return;
    }
    var _node = getNode_xyHongZi(off);
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
        // SetTouchCardHandler_xyHongZi(cardParent);
    }

    var newCard = findChildByNameAndIndex_xyHongZi(cardParent, mjNum, index);

    var type = ziPai.getZiPaiType();
    if(newCard){
        // cardParent.width = newCard.width;
        // cc.log( "===========hehe ============");
        // var tempT = newCard.tag;
        // cc.log( "===========hehe ============" + tempT);
        // cc.log( "===========hehe ============" + (tempT != mjNum));
        // if(tempT != mjNum){
        //  newCard.removeFromParent();
        //  newCard = null;
        //  newCard = getNewCard_xyHongZi(mjNum,1,off);
        //  cardParent.addChild(newCard);
        // }else{
        //  // return;
        // }
    }else{
        newCard = getNewCard_xyHongZi(mjNum,1,off);
        
        var scale_y = newCard.scaleY;
        var beginPoint = cc.p(0,0);
        var off_y = newCard.height * scale_y - newCard.height/4 * scale_y;
        if(type == 2){
            off_y += 10;
        }

        newCard.x = beginPoint.x;
        newCard.y = beginPoint.y + index * off_y;
        cardParent.addChild(newCard);
        if(cardParent.width == 0){
            cardParent.width = newCard.width;
        }
        
    }
    
    var scale_y = newCard.scaleY;

    var beginPoint = cc.p(0,0);
    var off_y = newCard.height * scale_y - newCard.height/4 * scale_y;
    if(type == 2){
        off_y += 10;
    }

    var cardCount = cardParent.childrenCount;
    newCard.setName(index);
    newCard.zIndex = 4 - index;
    newCard.anchorX = 0;
    newCard.anchorY = 0;
    // newCard.x = beginPoint.x;
    // newCard.y = beginPoint.y + cardCount * off_y;

    
    doMovetoAction(newCard, cc.p(beginPoint.x, beginPoint.y + index * off_y));
    
}

function doMovetoAction(node,endP){
    node.stopAllActions();
    var ac = cc.moveTo(0.1,endP);
    node.runAction(ac);
}

function refreshNode_xyHongZi(posNode,off,needAction){
    var handNode = posNode.getChildByName("handNode");
    if(!handNode){
        //容错 正常情况不会
        return;
    }

    MjClient.isRefreshNodeing = true;   //正在刷新手牌，用于在此期间禁止拖动

    cc.log("执行动画前手牌 refreshNode_xyHongZi=====:" , MjClient.HandCardArr);

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

    _checkIsAddGroup_xyHongZi();

    var index = 0;
    for(var k = 0;k < oldLen;k++){
        var groupList = cardArr[index];

        if(_hasValueInArr_xyHongZi(deleIndexArr, k)){
            continue;
        }

        _checkGroupList_xyHongZi(groupList,k);
        for(var j = 0;j < groupList.length;j++){

            refreshHandCard_xyHongZi(k,j,groupList[j],off);
        }
        index += 1;
    }

    var handCard = posNode.getChildByName("handCard");
    var scale_x = handCard.scaleX;
    var winSize = MjClient.size;

    var type = ziPai.getZiPaiType();
    var sizeArr = [98,95,100];
    var width =sizeArr[type];
    // if(isIPhoneX()){
    //     width = 84;
    // }
    var totalWidth = width * cardArr.length * scale_x;

    var index = 0;
    for(var i = 0; i < oldLen; i++){
        var addNode = handNode.getChildByTag(i);
        if(addNode && _hasValueInArr_xyHongZi(deleIndexArr, addNode.tag)){
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

    cc.log("执行动画后手牌 refreshNode_xyHongZi=====:" , MjClient.HandCardArr);


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