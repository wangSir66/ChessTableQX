
//裁剪字符串 超出以...表示
function sliceStrByLen_daZhaDan (str,length) {
    var tempStr = str;
    var strlen = str.length;
    if(cc.isUndefined(length) || length == null)
    {
        return str;
    }
    if(strlen >= length)
    {
        tempStr =  tempStr.substring(0,length - 1);
        tempStr += "...";
        // cc.log("sking mystr =  " + _newName);
    }
    return tempStr;
}

function playScoreEffect_daZhaDan(txtNode){
    if(txtNode){
        txtNode.stopAllActions();
        var tx = txtNode.x;
        var ty = txtNode.y;
        var tC = cc.color(34,234,156);
        var gap = 10;
        var dt = 0.2;
        var ac1 = cc.moveTo(dt, cc.p(tx, ty + gap));
        var ac2 = cc.moveTo(dt, cc.p(tx, ty));
        var cb1 = cc.callFunc(function(){
             txtNode.setTextColor(cc.color(255,0,0));
         })
        var cb2 = cc.callFunc(function(){
             txtNode.setTextColor(tC);
         })
        txtNode.runAction(cc.sequence(ac1, cb1, ac2, cb2, ac1.clone(), cb1.clone(), ac2.clone(), cb2.clone()));
    }
}

function playSoundEffect_daZhaDan(cards, uid, isLocal){
    if(uid == SelfUid() && !isLocal && MjClient.rePlayVideo == -1){
        //自己的音效提前已经播了
        return;
    }

    // cards = [105,106,107,108,109];

    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var pl = sData.players[uid];
    var sex = pl.info.sex;

    var tData = MjClient.data.sData.tData;

    // todo# 用tData.lastPutCardType
    var type = tData.lastPutCardType;//
    if(uid == SelfUid()){
        type = MjClient.majiang.getCardType(cards, tData.areaSelectMode, -1);
    }
    var cardVal = cards[0] % 100; 

    var url = "daZhaDan/nv/";
    switch (type){
        case daZhaDan.CARD_TYPE.danWang:
        case daZhaDan.CARD_TYPE.danZhang:
            url += cardVal;
            playEffect(url, false, sex);
            break;
        case daZhaDan.CARD_TYPE.duiZi:
            url += cardVal + "d";
            playEffect(url, false, sex);
            break;
        case daZhaDan.CARD_TYPE.lianDui:
            url += "double_line";
            playEffect(url, false, sex);
            break;
        case daZhaDan.CARD_TYPE.sanZhang:
            var obj = MjClient.majiang.analyzeSanZhang(cards);
            cardVal = obj.body;
            url += cardVal + "t";
            playEffect(url, false, sex);
            break;
        case daZhaDan.CARD_TYPE.feiJi:
            url += "wing";
            playEffect(url, false, sex);
            break;
        case daZhaDan.CARD_TYPE.zhaDan:
            url += "zhadan";
            playEffect(url, false, sex);
            break;
        case daZhaDan.CARD_TYPE.zaHuaWuShiK:
            url += "510K";
            playEffect(url, false, sex);
            break;
        case daZhaDan.CARD_TYPE.tongHuaWuShiK:
            url += "510K";
            playEffect(url, false, sex);
            break;
        case daZhaDan.CARD_TYPE.shunZi:
            url += "shunZi";
            playEffect(url, false, sex);
            break;
    }
}

//显示玩家信息
function showPlayerInfo_daZhaDan(off, node)
{
    //var tData = MjClient.data.sData.tData;
    var pl = getUIPlayer_daZhaDan(off);
    if(pl)
    {
        cc.log("pl data == " + JSON.stringify(pl));
        if (pl.info.uid == SelfUid())
        {
            MjClient.showPlayerInfo(pl.info, false, true);
        }
        else
        {
            // 4人选择分组阶段
            var tData = MjClient.data.sData.tData;
            if ((tData.tState == TableState.waitJoin || tData.tState == TableState.waitReady) && tData.maxPlayer == 4) {
                MjClient.showPlayerInfo(pl.info, false, true);
            } else {
                MjClient.showPlayerInfoPlaying(pl.info);
            }
            
        }
    }
}

//剩余牌的张数
function currentLeftCardCount_daZhaDan(UIoff)
{
    var tData = MjClient.data.sData.tData;
    var isShowLeft = tData.areaSelectMode.isShowLeft;
    cc.log("currentLeftCardCount_daZhaDan");


    var node = getNode_cards(UIoff);
    if(UIoff == 0)//自己不需要显示张数
        return;

    var _countNode = node.getChildByName("head").getChildByName("tingCard");
    if (!_countNode)
        return;

    if(MjClient.rePlayVideo != -1 || tData.tState == TableState.roundFinish){ //回放时
        _countNode.visible = false;
        return;
    }

    var pl = getUIPlayer(UIoff);
    var sData = MjClient.data.sData;
    if (!pl || !pl.handCount || pl.handCount <= 0)
    {
        _countNode.visible = false;
        return;
    }

    _countNode.visible = true;

    var showCardNumber = isShowLeft;

    var _unKnow = _countNode.getChildByName("unKnow");
    var _sprite_single = _countNode.getChildByName("sprite_single");
    var _Text_count = _countNode.getChildByName("Text_count");
    _Text_count.ignoreContentAdaptWithSize(true);

    _Text_count.visible = showCardNumber || pl.handCount <= 1;
    _sprite_single.visible = pl.handCount == 1;

    var tData = MjClient.data.sData.tData;
    if(tData.areaSelectMode.isShowLeft)
    {
        _Text_count.setString(pl.handCount);
        _unKnow.visible = false;
    }
    else {
        _unKnow.visible = true;
        _sprite_single.visible = false;
        _Text_count.visible = false;

        //如果选了不显示剩余牌时 直接返回
        return;
    }
    
    cc.log("bao dan :", pl.info.uid);
    cc.log("bao dan handCount:", pl.handCount);

    _sprite_single.stopAllActions();
    // 报单
    if (pl.handCount == 1)
    {
        cc.log("bao dan :", pl.info.uid);
        _unKnow.visible = false;
        _Text_count.visible = true;
        _Text_count.setString(pl.handCount);
        _sprite_single.visible = false;
        // var ac = getAnimate_daZhaDan("baodan_", 5);
        // _sprite_single.runAction(cc.repeatForever(cc.sequence([ac])));
    }else if(pl.handCount == 2){
        _unKnow.visible = false;
        _Text_count.visible = true;
        _Text_count.setString(pl.handCount);
    }
};

function getAnimate_daZhaDan(preName, len, delaytime, playCount){
    playCount = playCount === undefined ? 1 : playCount;
    delaytime = delaytime === undefined ? 0.1 : delaytime;

    var arry = [];
    for(var i = 1; i <= len; i++)
    {
        var frame = cc.spriteFrameCache.getSpriteFrame(preName + i + ".png");
        if(frame)
        {
            arry.push(frame);
        }
    }
    return cc.animate(new cc.Animation(arry, delaytime, playCount));
}

//重置四个玩家的位置
function resetPlayerHead_daZhaDan()
{
    cc.log("重置头像信息位置");
    for(var off = 0;off < MjClient.MaxPlayerNum;off++)
    {
        var node = getNode_cards(off);
        var pl = getUIPlayer(off);

        if(!pl)
        {
            return;
        }
        //初始化玩家金币和名称
        // InitUserCoinAndName(node, off);
        if(off != 0)
        {
            currentLeftCardCount(off);
            SetUserVisible_tuantuanzhuan(node, off);
        }

        //重置房主
        showFangzhuTagIcon(node.getChildByName("head"),off);

        //回放的时候需要刷新手牌
        if(MjClient.rePlayVideo != -1)
        {
            refreshHandCardForReplay(off);
        }
    }

    reConectHeadLayout_daZhaDan(node.parent);
}

//设置玩家掉线头像
function setUserOffline_daZhaDan(node, off)
{
    var pl = getUIPlayer_daZhaDan(off);
    if (!pl)
    {
        return;
    }
    /*
    node.getChildByName("head").getChildByName("offlineBg").visible = !pl.onLine;
    // node.getChildByName("head").getChildByName("offline").y = 80;
    // node.getChildByName("head").getChildByName("offline").zIndex = 99;
    node.getChildByName("head").getChildByName("offline").visible = !pl.onLine;
    */

    //获取时间差
    /*MjClient.timeBetween = MjClient.data.sData.serverNow - new Date().getTime();
    pl.offLineTime = pl.lastOffLineTime - MjClient.timeBetween;
    cc.log(pl.lastOffLineTime + ">>>???" + pl.timeBetween);*/

    node.getChildByName("head").getChildByName("offline").y = 80;
    node.getChildByName("head").getChildByName("offline").zIndex = 99;
    node.getChildByName("head").getChildByName("offline").visible = !pl.onLine;
    // cc.log( MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP);
  
    if (pl.onLine == false || MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ ||
     MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP  )
    { 
        var _offLineNode = node.getChildByName("head").getChildByName("offline");
        _offLineNode.unscheduleAllCallbacks();
        _offLineNode.schedule(function(){
            var _timeNode = _offLineNode.getChildByName("offLineTime");
            if (!_timeNode) { 

                _timeNode = new ccui.Text();
                _timeNode.setName("offLineTime");
                _timeNode.setFontSize(22);
                _offLineNode.addChild(_timeNode)
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
                //cc.log("我是" + pl.info.uid + "  我的离线时间是：" + JSON.stringify(pl.offLineTime));
                _timeNode.setString(MjClient.dateFormat(new Date(_showTime),"mm:ss"));
            }
            else
            {
                _timeNode.setString("");
            }
        });
    }
}

function tableStartHeadMoveAction_daZhaDan(node)
{
    cc.log("-----------------set head position ------");
    var down = node.getChildByName("down").getChildByName("head");
    var top = node.getChildByName("top").getChildByName("head");
    var left = node.getChildByName("left").getChildByName("head");
    var right = node.getChildByName("right").getChildByName("head");
    {
        setWgtLayout(down, [118/1280, 0], [0.04, 0.045], [0,0], false, false);
        setWgtLayout(top, [118/1280, 0], [0.4, 0.9], [0, 0], false, false);
        setWgtLayout(left, [118/1280, 0], [0.04, 0.62], [0, 0], false, false);
        setWgtLayout(right, [118/1280, 0], [0.96, 0.62], [0, 0], false, false);
        if(MjClient.MaxPlayerNum == 3){
            setWgtLayout(top, [118/1280, 0], [0.04, 0.62], [0, 0], false, false);
        }

        if(MjClient.rePlayVideo != -1){
            //回放
            setWgtLayout(left, [118/1280, 0], [0.12, 0.92], [0, 0], false, false);
            setWgtLayout(right, [118/1280, 0], [0.91, 0.92], [0, 0], false, false);
            setWgtLayout(top, [118/1280, 0], [0.34, 0.93], [0, 0], false, false);
        }
    }

    sendGPS();
}

//重置4家头像位置
function reConectHeadLayout_daZhaDan(node)
{
    var tData = MjClient.data.sData.tData;
    var down = node.getChildByName("down").getChildByName("head");
    var top = node.getChildByName("top").getChildByName("head");
    var left = node.getChildByName("left").getChildByName("head");
    var right = node.getChildByName("right").getChildByName("head");

    {
        setWgtLayout(down, [118/1280, 0], [0.04, 0.045], [0,0], false, false);
        setWgtLayout(top, [118/1280, 0], [0.4, 0.9], [0, 0], false, false);
        setWgtLayout(left, [118/1280, 0], [0.04, 0.62], [0, 0], false, false);
        setWgtLayout(right, [118/1280, 0], [0.96, 0.62], [0, 0], false, false);
        if(MjClient.MaxPlayerNum == 3){
            setWgtLayout(top, [118/1280, 0], [0.04, 0.62], [0, 0], false, false);
        }

        if(MjClient.rePlayVideo != -1){
            //回放
            setWgtLayout(left, [118/1280, 0], [0.12, 0.92], [0, 0], false, false);
            setWgtLayout(right, [118/1280, 0], [0.91, 0.92], [0, 0], false, false);
            setWgtLayout(top, [118/1280, 0], [0.34, 0.93], [0, 0], false, false);
        }
    }

        //UpdataCurrentPutCard();
        //resetFlowerNum(node);
}

//出牌回调
function DealWaitPut_daZhaDan(node, msg, off)
{
    var pl = getUIPlayer_daZhaDan(off);
    var tData = MjClient.data.sData.tData;
    if(pl.info.uid == tData.uids[tData.curPlayer]){
        //隐藏之前出的牌
        if(node.throwList){
            node.throwList.hideCards();
        }

        node.getChildByName("noPutTag").visible = false;
    }
    //已经出完牌处理
    if(pl && pl.handCount == 0){
        //说明已经出完牌了
        var selfOff = getUiOffByUid(pl.info.uid);
        var curOff = getUiOffByUid(tData.uids[tData.curPlayer]);
        var preOff = selfOff - 1;
        if(preOff < 0) preOff = tData.maxPlayer - 1;
        if(preOff == curOff){
            var throwList = node.throwList;
            if(throwList){
                throwList.scheduleOnce(function(){
                    // throwList.hideCards();
                }, 2);
            }
        }
    }
}

// 清理ui
function clearCardUI_daZhaDan(node)
{
    mylog("clearCardUI");
    if(node.cardList){
        node.cardList.showBtnNode(false);
        node.cardList.removeAllCards();
    }

    if(node.throwList){
        node.throwList.hideCards();
    }

    node.getChildByName("noPutTag").visible = false;
    var head = node.getChildByName("head");
    var coin = head.getChildByName("coin").setString("0");
    var zhua = head.getChildByName("zhua").setString("0");
    var xi = head.getChildByName("xi").setString("0");
}

function initCardList_daZhaDan(){

    var ratio = 1;
    if(isIPhoneX()){
        ratio = 0.80;
    }

    //down
    if(!MjClient.playui._downNode.cardList && !cc.sys.isObjectValid(MjClient.playui._downNode.cardList)){
        var cardList = new daZhaDan.CardListLayer();
        MjClient.playui._downNode.addChild(cardList);
        cardList.setLocalZOrder(-1);
        setWgtLayout(cardList, [1 * ratio * 1.1, 0], [-0.01, 0.20], [0, 0]);
        if(isIPhoneX()){
            setWgtLayout(cardList, [1 * ratio * 1.1, 0], [0.1, 0.2], [0, 0]);
        }
        MjClient.playui._downNode.cardList = cardList;
     }
    
     if(!MjClient.playui._downNode.throwList && !cc.sys.isObjectValid(MjClient.playui._downNode.throwList)){
        var throwList = new daZhaDan.CardThrowListLayer();
        throwList.setCardsAnchorPoint(0.5,0);
        throwList.setLocalZOrder(-2);
        MjClient.playui._downNode.addChild(throwList);
        MjClient.playui._downNode.throwList = throwList;
        setWgtLayout(throwList, [0.3 * ratio, 0], [0.5, 0.3], [0, 0]);
     }

     //right
     if(!MjClient.playui._rightNode.cardList && !cc.sys.isObjectValid(MjClient.playui._rightNode.cardList)){
        var cardList = new daZhaDan.CardListLayer();
        cardList.setTouchOpen(false);
        MjClient.playui._rightNode.addChild(cardList);
        setWgtLayout(cardList, [0.4 * ratio, 0], [0.98, 0.15], [0, 0]); //right
        cardList.setRotation(-90);
        MjClient.playui._rightNode.cardList = cardList;
     }
    
     if(!MjClient.playui._rightNode.throwList && !cc.sys.isObjectValid(MjClient.playui._rightNode.throwList)){
        var throwList = new daZhaDan.CardThrowListLayer();
        throwList.setCardsAnchorPoint(1,0);
        throwList.setLocalZOrder(-2);
        MjClient.playui._rightNode.addChild(throwList);
        MjClient.playui._rightNode.throwList = throwList;
        setWgtLayout(throwList, [0.3 * ratio, 0], [0.87, 0.55], [0, 0]);
        // throwList.visible = false;
     }

     //top
     if(!MjClient.playui._topNode.cardList && !cc.sys.isObjectValid(MjClient.playui._topNode.cardList)){
        var cardList = new daZhaDan.CardListLayer();
        cardList.setTouchOpen(false);
        MjClient.playui._topNode.addChild(cardList);
        setWgtLayout(cardList, [0.4 * ratio, 0], [0.46, 0.85], [0, 0]); //top
        MjClient.playui._topNode.cardList = cardList;
        if(MjClient.MaxPlayerNum == 3){
            cardList.setRotation(90);
            setWgtLayout(cardList, [0.4 * ratio, 0], [0.03, 0.90], [0, 0]);
        }
     }
    
     if(!MjClient.playui._topNode.throwList && !cc.sys.isObjectValid(MjClient.playui._topNode.throwList)){
        var throwList = new daZhaDan.CardThrowListLayer();
        throwList.setCardsAnchorPoint(0.5,0);
        throwList.setLocalZOrder(-2);
        MjClient.playui._topNode.addChild(throwList);
        MjClient.playui._topNode.throwList = throwList;
        setWgtLayout(throwList, [0.3 * ratio, 0], [0.5, 0.62], [0, 0]);
        if(MjClient.MaxPlayerNum == 3){
            throwList.setCardsAnchorPoint(0,0);
            setWgtLayout(throwList, [0.3 * ratio, 0], [0.13, 0.55], [0, 0]);
        }
     }

     //left
     if(!MjClient.playui._leftNode.cardList && !cc.sys.isObjectValid(MjClient.playui._leftNode.cardList)){
        var cardList = new daZhaDan.CardListLayer();
        cardList.setTouchOpen(false);
        MjClient.playui._leftNode.addChild(cardList);
        setWgtLayout(cardList, [0.38 * ratio, 0], [0.05, 0.90], [0, 0]); //left
        cardList.setRotation(90);
        MjClient.playui._leftNode.cardList = cardList;
     }
    
     if(!MjClient.playui._leftNode.throwList && !cc.sys.isObjectValid(MjClient.playui._leftNode.throwList)){
        var throwList = new daZhaDan.CardThrowListLayer();
        throwList.setCardsAnchorPoint(0,0);
        throwList.setLocalZOrder(-2);
        MjClient.playui._leftNode.addChild(throwList);
        MjClient.playui._leftNode.throwList = throwList;
        setWgtLayout(throwList, [0.3 * ratio, 0], [0.13, 0.55], [0, 0]);
     }
}

//过的回调
function DealPKPass_daZhaDan(off)
{
    var _node = getNode_cards(off);
    _node.getChildByName("noPutTag").visible = true;
    _node.throwList && _node.throwList.hideCards();

    // var _node = getNode_cards(off);
    // MjClient.playui.CardLayoutRestore(_node, off);
}

/*
    每次更新选牌显示
 */
function UpdataCurrentPutCard_daZhaDan()
 {
    initCardList_daZhaDan();

    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var uids = tData.uids;
    var lastPutCards =  tData.lastPutCard;

    if(IsTurnToMe())
    {
            MjClient.playui._downNode.cardList.showBtnNode(true);
            MjClient.playui._downNode.throwList.hideCards();
    }else{
            MjClient.playui._downNode.cardList.showBtnNode(false);
    }
     
}

//显示牌桌上最后打出的牌UI,断线重连走这里
function reConnectShowDeskCard_daZhaDan()//为 down  top, left ,right 节点
{
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var uids = tData.uids;
    var off = tData.lastPutPlayer //在 uids里面的off位置
    var lastPutCards = tData.lastPutCard;
    cc.log("lastPutCards = " + JSON.stringify(lastPutCards));
    var UIOff = getUiOffByUid( uids[off]); //相对UI的off

    var lastPutUIoff = getUiOffByUid( uids[off]); //相对UI的off
    if(lastPutUIoff == UIOff)
    {
        //cc.log("============UIOFF = " + UIOff);
        showCurrentPutCards_daZhaDan(UIOff, uids[off]);
    }

    //断线重连，且轮到自己出牌
    if(IsTurnToMe() && tData.tState == TableState.waitPut)
    {
        //更新按钮状态
        UpdataCurrentPutCard_daZhaDan();

        //初始化，出牌提示数组
        // InitPutOutCardTips(0);
    }

}

//处理出牌,放一张牌，打牌动作
function DealMJPut_daZhaDan(node, msg, UIOff, outNum)
{
    if(UIOff == MjClient.MaxPlayerNum){
        //处理 2,3人时 播两次特效
        return;
    }

    var sData = MjClient.data.sData;
    var tData = sData.tData;

    var uids = tData.uids;

    var selfIndex = (uids.indexOf(SelfUid()) + UIOff) % MjClient.MaxPlayerNum;

    var _node = getNode_cards(UIOff);
    _node.getChildByName("noPutTag").visible = false;

    if(uids[selfIndex] == msg.uid)
    {
        var children = node.children;
        for (var i = 0; i < children.length; i++)
        {
            var ni = children[i];
            if(ni.name == "out")
            {
                ni.removeFromParent(true);
            }
        }

        showCurrentPutCards_daZhaDan(UIOff, msg.uid);

        var pl = getUIPlayer_daZhaDan(UIOff);
        if(pl && pl.handCount == 1)
        {
            playEffectInPlay("singer");
        }
    }

    //刷新 牌显示张数
    currentLeftCardCount(UIOff);

    if (uids[selfIndex] == msg.uid && 
        (MjClient.gameType == MjClient.GAME_TYPE.PAO_DE_KUAI ||
         MjClient.gameType == MjClient.GAME_TYPE.YZ_PAO_DE_KUAI_TY))
    {
        var pl = getUIPlayer_daZhaDan(UIOff);
        if (pl && pl.handCount && pl.handCount == 1)
            playEffectInPlay("single");
    }
}

//显示当前打出在牌桌上的牌 uid:当前出牌的玩家
function showCurrentPutCards_daZhaDan(UIoff, uid)
{
    if(UIoff >= MjClient.data.sData.tData.maxPlayer){
        //没有玩家的节点 不处理
        return;
    }

    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var node = getNode_cards(UIoff);
    var lastPutCards = tData.lastPutCard;
    var _deskCard = node.getChildByName("deskCard");
    var putCards = lastPutCards;
    if(!putCards)
    {
        return;
    }

    var throwList = node.throwList;
    if(throwList){
        // if(uid == SelfUid() && MjClient.rePlayVideo == -1){
        //     cc.log("===========throwList self====================");
        // }else{
            
        // }
        var pl = sData.players[uid];
        if(pl){
            throwList.showCards(putCards, pl.info.sex);
        }
    }

    if(MjClient.rePlayVideo != -1)
    {
        //回放
        var pl = sData.players[uid];
        cc.log("rePlay pl:", JSON.stringify(pl));
        if(pl && pl.mjhand){
            var cardList = node.cardList;
            var arr = [];
            var copyArr = pl.mjhand.concat();
            if(!copyArr){
                copyArr = [];
            }
            copyArr = MjClient.majiang.sortCard(copyArr, MjClient.data.sData.tData.areaSelectMode, MjClient.majiang.sortType);


            var cardList = node.cardList;
            cardList.removeCardsByTypes(putCards);
            cardList.refreshHandCards();
        }
    }

}

//初始化玩家金币和名字
function InitUserCoinAndName_daZhaDan(node, off) {
    var pl = getUIPlayer_daZhaDan(off);
    if (!pl) {
        return;
    }

    var tData = MjClient.data.sData.tData;
    var bind = {
        head: {
            name: {
                _run:function(){
                    this.setFontName("Arial");
                    this.setFontSize(this.getFontSize());
                },
                _text: function() {
                    var _nameStr = unescape(pl.info.nickname );
                    return getNewName(_nameStr);
                }
            },
            coin: {
                _visible: true,
                _run: function() {
                    var coin = tData.initCoin ? tData.initCoin : 0;
                    this.setString(pl.winall);
                    this.ignoreContentAdaptWithSize(true);
                }
            },
            zhua: {
                _visible: true,
                _run: function() {
                    var coin = tData.initCoin ? tData.initCoin : 0;
                    this.ignoreContentAdaptWithSize(true);
                    this.setString(pl.score_draw);
                }
            },
            xi: {
                _visible: true,
                _run: function() {
                    this.setString(pl.score_xi ? pl.score_xi : 0);
                    this.ignoreContentAdaptWithSize(true);
                }
            }
        }
    }

    var name = node.getChildByName("head").getChildByName("name");
    name.ignoreContentAdaptWithSize(true);

    BindUiAndLogic(node, bind);
}

function loaderHeadImage_daZhaDan(node, pl){
    var WxHead = node.getChildByName("WxHead");
    var url = pl.info.headimgurl || "png/default_headpic.png";
    cc.loader.loadImg(url, {isCrossOrigin: true}, function(err, texture) {
        if (!err && texture) {
            if (WxHead) {
                WxHead.removeFromParent(true);
            }
            cc.log("----------------");
            //缓存头像
            postEvent( "QueueNetMsg",["loadWxHead",{uid:pl.info.uid,img:texture}]);

            var sp = new cc.Sprite(texture);
            sp.setName("WxHead");
            node.addChild(sp);
            setWgtLayout(sp, [0.91, 0.91], [0.5, 0.5], [0, 0], false, true);
        }
    });
}

function showFangzhuTagIcon_daZhaDan(node,off){
    var pl = getUIPlayer(off);
    if(!pl) //位置上没人则删掉房主标签
    {
        if(node.getChildByName("fangTag"))
        {
            node.removeChildByName("fangTag");
        }
        return;
    }

    var tData = MjClient.data.sData.tData;
    if (tData.uids[tData.zhuang] == pl.info.uid)
    {
        if(!node.getChildByName("fangTag"))
        {
            var sp = new cc.Sprite("playing/gameTable/youxizhong-1_89.png");
            sp.setPosition(40, node.getContentSize().height - 17);
            sp.setAnchorPoint(1,0);
            sp.setName("fangTag");
            node.addChild(sp, 100);
        }
    }
    else
    {
        if(node.getChildByName("fangTag"))
        {
            node.removeChildByName("fangTag");
        }
    }

    // if (tData.uids[tData.zhuang] == pl.info.uid)
    // {
    //     if(!node.getChildByName("zhuangTag"))
    //     {
    //         var sp = new cc.Sprite("playing/gameTable/youxizhong-1_89.png");
    //         sp.setPosition(40, 10);
    //         sp.setAnchorPoint(1,0);
    //         sp.setScale(0.8);
    //         sp.setName("zhuangTag");
    //         node.addChild(sp, 100);
    //     }
    // }else{
    //     if(node.getChildByName("zhuangTag"))
    //     {
    //         node.removeChildByName("zhuangTag");
    //     }
    // }
}

/**
 * 当前玩家是不是自己
 * @param  {number} off 和‘我’在uids的下标的差
 * @return {bool} true:轮到我操作  false:不是我在操作
 */
function curPlayerIsMe_daZhaDan(off){
    if(MjClient.data.sData.tData.maxPlayer == 2 && off >= 2){
        return false;
    }
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    if(tData.tState == TableState.waitReady){
        return false;
    }
    var selfIndex = tData.uids.indexOf(SelfUid());
    selfIndex = (selfIndex + off)%MjClient.MaxPlayerNum_leiyang;
    return selfIndex == tData.curPlayer;
}

function getAnimate_daZhaDan(preName, len, delaytime, playCount){
    playCount = playCount === undefined ? 1 : playCount;
    delaytime = delaytime === undefined ? 0.1 : delaytime;

    var arry = [];
    for(var i = 1; i <= len; i++)
    {
        var frame = cc.spriteFrameCache.getSpriteFrame(preName + i + ".png");
        if(frame)
        {
            arry.push(frame);
        }
    }
    return cc.animate(new cc.Animation(arry, delaytime, playCount));
}

