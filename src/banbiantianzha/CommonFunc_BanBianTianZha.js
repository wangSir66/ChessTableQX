
function playScoreEffect_BanBianTianZha(txtNode){
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

function playSoundEffect_BanBianTianZha(cards, uid, isLocal){
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
    var type = tData.lastPutCardType;//MjClient.majiang.getCardType(cards, tData.deckNum, tData.hasWings);
    if(uid == SelfUid()){
        type = MjClient.majiang.getCardType(cards, tData.hasWings, tData.areaSelectMode.isSiDaiSan);
    }
    var cardVal = cards[0] % 100; 

    var url = "banbiantianzha/";
    switch (type){
        case banBianTianZha.CARD_TYPE.danZhang:
            url += cardVal;
            playEffect(url, false, sex);
            break;
        case banBianTianZha.CARD_TYPE.duiZi:
            url += "d" + cardVal;
            playEffect(url, false, sex);
            break;
        case banBianTianZha.CARD_TYPE.lianDui:
            url += "liandui";
            playEffect(url, false, sex);
            break;
        case banBianTianZha.CARD_TYPE.sanZhang:
            var obj = MjClient.majiang.analyzeSanZhang(cards);
            url += "sandai" + obj.wing.length;
            playEffect(url, false, sex);
            break;
        case banBianTianZha.CARD_TYPE.feiJi:
            url += "feiji";
            playEffect(url, false, sex);
            break;
        case banBianTianZha.CARD_TYPE.zhaDan:
            url += "zhadan";
            playEffect(url, false, sex);
            break;
        case banBianTianZha.CARD_TYPE.zaHuaWuShiK:
            url += "510k";
            playEffect(url, false, sex);
            break;
        case banBianTianZha.CARD_TYPE.tongHuaWuShiK:
            url += "z510k";
            playEffect(url, false, sex);
            break;
        case banBianTianZha.CARD_TYPE.shunZi:
            url += "shunzi";
            playEffect(url, false, sex);
            break;
        case banBianTianZha.CARD_TYPE.siDaiSan:
            var obj = MjClient.majiang.analyzeSiZhang(cards);
            url += "sidai" + obj.wing.length;
            playEffect(url, false, sex);
            break;
        case banBianTianZha.CARD_TYPE.tongHuaShun:
            url += "tonghuashun";
            playEffect(url, false, sex);
            break;
        case banBianTianZha.CARD_TYPE.diZha:
            url += "dizha";
            playEffect(url, false, sex);
            break;
        case banBianTianZha.CARD_TYPE.tianZha:
            url += "tianzha";
            playEffect(url, false, sex);
            break;
    }
}

//显示玩家信息
function showPlayerInfo_BanBianTianZha(off, node)
{
    //var tData = MjClient.data.sData.tData;
    var pl = getUIPlayer_BanBianTianZha(off);
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
function currentLeftCardCount_BanBianTianZha(UIoff)
{
    var tData = MjClient.data.sData.tData;
    var isShowLeft = tData.areaSelectMode.isPaiShu;
    cc.log("chow", "currentLeftCardCount_BanBianTianZha" + " isShowLeft = " + isShowLeft);


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

    var _unKnow = _countNode.getChildByName("unKnow");
    var _sprite_single = _countNode.getChildByName("sprite_single");
    var _Text_count = _countNode.getChildByName("Text_count");
    _Text_count.ignoreContentAdaptWithSize(true);
    _Text_count.setString(pl.handCount);

    if(tData.areaSelectMode.isPaiShu)
    {
        _Text_count.visible = true;
        _unKnow.visible = false;
    }
    else {
        _unKnow.visible = true;
        _Text_count.visible = false;
    }

    _sprite_single.visible = pl.handCount == 1;
    cc.log("bao dan :", pl.info.uid);
    cc.log("bao dan handCount:", pl.handCount);
    _sprite_single.stopAllActions();
    // 报单
    if (pl.handCount == 1)
    {
         var ac = getAnimate_BanBianTianZha("baodan_", 5);
         _sprite_single.runAction(cc.repeatForever(cc.sequence([ac])));
    }
};

function getAnimate_BanBianTianZha(preName, len, delaytime, playCount){
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
function resetPlayerHead_BanBianTianZha()
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

    reConectHeadLayout_BanBianTianZha(node.parent);
}

//设置玩家掉线头像
function setUserOffline_BanBianTianZha(node, off)
{
    var pl = getUIPlayer_BanBianTianZha(off);
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

    node.getChildByName("head").getChildByName("offlineBg").visible = false;
    node.getChildByName("head").getChildByName("offline").y = 80;
    node.getChildByName("head").getChildByName("offline").zIndex = 99;
    node.getChildByName("head").getChildByName("offline").visible = !pl.onLine;
    // cc.log( MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP);
  
    if (pl.onLine == false || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ ||
     MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP || MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG )
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

function tableStartHeadMoveAction_BanBianTianZha(node)
{
    cc.log("-----------------set head position ------");
    var down = node.getChildByName("down").getChildByName("head");
    var top = node.getChildByName("top").getChildByName("head");
    var left = node.getChildByName("left").getChildByName("head");
    var right = node.getChildByName("right").getChildByName("head");
    {
        setWgtLayout(down, [118/1280, 0], [0.05, 20/720], [0,66/125], false, false);//chow 已名字为基准，计算偏移 (abs(y1)+h/2)/h
        setWgtLayout(top, [118/1280, 0], [0.557, 0.9], [0, 0], false, false);
        setWgtLayout(left, [118/1280, 0], [0.04, 0.62], [0, 0], false, false);
        setWgtLayout(right, [118/1280, 0], [0.96, 0.62], [0, 0], false, false);
        if(MjClient.MaxPlayerNum == 3){
            setWgtLayout(top, [118/1280, 0], [0.04, 0.62], [0, 0], false, false);
        }

        if(MjClient.rePlayVideo != -1){
            //回放
            setWgtLayout(left, [118/1280, 0], [0.08, 0.92], [0, 0], false, false);
            setWgtLayout(right, [118/1280, 0], [0.94, 0.88], [0, 0], false, false);
            if(MjClient.MaxPlayerNum == 3){
                setWgtLayout(top, [118/1280, 0], [0.06, 0.88], [0, 0], false, false);
            }
        }
    }

    sendGPS();
}

//重置4家头像位置
function reConectHeadLayout_BanBianTianZha(node)
{
    var tData = MjClient.data.sData.tData;
    var down = node.getChildByName("down").getChildByName("head");
    var top = node.getChildByName("top").getChildByName("head");
    var left = node.getChildByName("left").getChildByName("head");
    var right = node.getChildByName("right").getChildByName("head");

    {
        setWgtLayout(down, [118/1280, 0], [0.05, 20/720], [0,66/125], false, false);
        setWgtLayout(top, [118/1280, 0], [0.557, 0.9], [0, 0], false, false);
        setWgtLayout(left, [118/1280, 0], [0.04, 0.62], [0, 0], false, false);
        setWgtLayout(right, [118/1280, 0], [0.96, 0.62], [0, 0], false, false);
        if(MjClient.MaxPlayerNum == 3){
            setWgtLayout(top, [118/1280, 0], [0.04, 0.62], [0, 0], false, false);
        }

        if(MjClient.rePlayVideo != -1){
            //回放
            setWgtLayout(left, [118/1280, 0], [0.08, 0.92], [0, 0], false, false);
            setWgtLayout(right, [118/1280, 0], [0.94, 0.90], [0, 0], false, false);
            if(MjClient.MaxPlayerNum == 3){
                setWgtLayout(top, [118/1280, 0], [0.06, 0.90], [0, 0], false, false);
            }
        }
    }

        //UpdataCurrentPutCard();
        //resetFlowerNum(node);
}

//出牌回调
function DealWaitPut_BanBianTianZha(node, msg, off)
{
    var pl = getUIPlayer_BanBianTianZha(off);
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
function clearCardUI_BanBianTianZha(node)
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

}

function initCardList_BanBianTianZha(){

    var ratio = 1;
    if(isIPhoneX()){
        ratio = 0.80;
    }

    //down
    if(!MjClient.playui._downNode.cardList && !cc.sys.isObjectValid(MjClient.playui._downNode.cardList)){
        var cardList = new banBianTianZha.CardListLayer();
        MjClient.playui._downNode.addChild(cardList);
        setWgtLayout(cardList, [1 * ratio, 0], [0.05, 0.17], [0, 0]);
        if(isIPhoneX()){
            setWgtLayout(cardList, [1 * ratio, 0], [0.1, 0.17], [0, 0]);
        }
        MjClient.playui._downNode.cardList = cardList;
     }
    
     if(!MjClient.playui._downNode.throwList && !cc.sys.isObjectValid(MjClient.playui._downNode.throwList)){
        var throwList = new banBianTianZha.CardThrowListLayer();
        throwList.setCardsAnchorPoint(0.5,0);
        MjClient.playui._downNode.addChild(throwList);
        MjClient.playui._downNode.throwList = throwList;
        setWgtLayout(throwList, [0.3 * ratio, 0], [0.5, 0.4], [0, 0]);
     }

     //right
     if(!MjClient.playui._rightNode.cardList && !cc.sys.isObjectValid(MjClient.playui._rightNode.cardList)){
        var cardList = new banBianTianZha.CardListLayer();
        cardList.setTouchOpen(false);
        MjClient.playui._rightNode.addChild(cardList);
        setWgtLayout(cardList, [0.4 * ratio, 0], [0.97, 0.17], [0, 0]); //right
        cardList.setRotation(-90);
        MjClient.playui._rightNode.cardList = cardList;
     }
    
     if(!MjClient.playui._rightNode.throwList && !cc.sys.isObjectValid(MjClient.playui._rightNode.throwList)){
        var throwList = new banBianTianZha.CardThrowListLayer();
        throwList.setCardsAnchorPoint(1,0);
        MjClient.playui._rightNode.addChild(throwList);
        MjClient.playui._rightNode.throwList = throwList;
        setWgtLayout(throwList, [0.3 * ratio, 0], [0.87, 0.55], [0, 0]);
        // throwList.visible = false;
     }

     //top
     if(!MjClient.playui._topNode.cardList && !cc.sys.isObjectValid(MjClient.playui._topNode.cardList)){
        var cardList = new banBianTianZha.CardListLayer();
        cardList.setTouchOpen(false);
        MjClient.playui._topNode.addChild(cardList);
        setWgtLayout(cardList, [0.4 * ratio, 0], [0.2, 0.85], [0, 0]); //top
        MjClient.playui._topNode.cardList = cardList;
        if(MjClient.MaxPlayerNum == 3){
            cardList.setRotation(90);
            setWgtLayout(cardList, [0.4 * ratio, 0], [0.03, 0.82], [0, 0]);
        }
     }
    
     if(!MjClient.playui._topNode.throwList && !cc.sys.isObjectValid(MjClient.playui._topNode.throwList)){
        var throwList = new banBianTianZha.CardThrowListLayer();
        throwList.setCardsAnchorPoint(0.5,0);
        MjClient.playui._topNode.addChild(throwList);
        MjClient.playui._topNode.throwList = throwList;
        setWgtLayout(throwList, [0.3 * ratio, 0], [0.5, 0.54], [0, 0]);
        if(MjClient.MaxPlayerNum == 3){
            throwList.setCardsAnchorPoint(0,0);
            setWgtLayout(throwList, [0.3 * ratio, 0], [0.13, 0.55], [0, 0]);
        }
     }

     //left
     if(!MjClient.playui._leftNode.cardList && !cc.sys.isObjectValid(MjClient.playui._leftNode.cardList)){
        var cardList = new banBianTianZha.CardListLayer();
        cardList.setTouchOpen(false);
        MjClient.playui._leftNode.addChild(cardList);
        setWgtLayout(cardList, [0.38 * ratio, 0], [0.05, 0.90], [0, 0]); //left
        cardList.setRotation(90);
        MjClient.playui._leftNode.cardList = cardList;
     }
    
     if(!MjClient.playui._leftNode.throwList && !cc.sys.isObjectValid(MjClient.playui._leftNode.throwList)){
        var throwList = new banBianTianZha.CardThrowListLayer();
        throwList.setCardsAnchorPoint(0,0);
        MjClient.playui._leftNode.addChild(throwList);
        MjClient.playui._leftNode.throwList = throwList;
        setWgtLayout(throwList, [0.3 * ratio, 0], [0.13, 0.55], [0, 0]);
     }
}

//过的回调
function DealPKPass_BanBianTianZha(off)
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
function UpdataCurrentPutCard_BanBianTianZha()
 {
    initCardList_BanBianTianZha();

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
function reConnectShowDeskCard_BanBianTianZha()//为 down  top, left ,right 节点
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
        showCurrentPutCards_BanBianTianZha(UIOff, uids[off]);
    }

    //断线重连，且轮到自己出牌
    if(IsTurnToMe() && tData.tState == TableState.waitPut)
    {
        //更新按钮状态
        UpdataCurrentPutCard_BanBianTianZha();

        //初始化，出牌提示数组
        // InitPutOutCardTips(0);
    }

}

function getNewCard_BanBianTianZha(node, copy, name, tag)
{
    var cpnode = node.getChildByName(copy);
    var cp = cpnode.clone(); //克隆一个白板，上面没有任何条纹的麻将 ，by sking
    if (name == "mjhand")
    {
        cp.setScale(cp.getScale()*1.30);
    }
    // else
    // {
    //     cp.setScale(cp.getScale()*1);
    // }
    cp.visible = true;
    cp.name = name;

    node.addChild(cp);

    if(tag > 0)
    {
        //创建一个带有麻将信息的麻将 cp为创建后的麻将
        setCardSprite_BanBianTianZha(cp, tag);
        if(name == "mjhand")
        {
            SetTouchCardHandler_card(cpnode, cp);
        }
    }
    return cp;
}

//处理出牌,放一张牌，打牌动作
function DealMJPut_BanBianTianZha(node, msg, UIOff, outNum)
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

        showCurrentPutCards_BanBianTianZha(UIOff, msg.uid);

        var pl = getUIPlayer_BanBianTianZha(UIOff);
        if(pl && pl.handCount == 1)
        {
            var url = "banbiantianzha/last";
            playEffect(url, false, pl.info.sex);
        }
    }

    //刷新 牌显示张数
    currentLeftCardCount(UIOff);

    if (uids[selfIndex] == msg.uid && 
        (MjClient.gameType == MjClient.GAME_TYPE.PAO_DE_KUAI ||
         MjClient.gameType == MjClient.GAME_TYPE.YZ_PAO_DE_KUAI_TY))
    {
        var pl = getUIPlayer_BanBianTianZha(UIOff);
        if (pl && pl.handCount && pl.handCount == 1)
            playEffectInPlay("single");
    }
}

//显示当前打出在牌桌上的牌 uid:当前出牌的玩家
function showCurrentPutCards_BanBianTianZha(UIoff, uid)
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

            var cardList = node.cardList;
            cardList.removeCardsByTypes(putCards);
            cardList.refreshHandCards();
        }
    }

}

//设置牌的渲染
function setCardSprite_BanBianTianZha(node, cd, isOnDesk)
{
    
    var path = "playing/cardPic2/";
    
    //麻将的底牌公用图，4张
    node.loadTexture("daTongZi/cards/"+ cd +".png");
    node.removeAllChildren();


    // var nodeSize = node.getContentSize();
    // cardTypeNode.setPosition(7 + cardTypeNode.getContentSize().width/2, nodeSize.height - 7 - cardTypeNode.getContentSize().height/2);
    // flowerTypeNode.setPosition(nodeSize.width - 10 - flowerTypeNode.getContentSize().width*flowerTypeNode.getScaleX()/2, 10 + flowerTypeNode.getContentSize().height/2);

    // if(MjClient.sortClassType == 0 || isOnDesk)
    //     smallFlowerNode.setPosition(cardTypeNode.getPositionX(), nodeSize.height - 80);
    // else
    //     smallFlowerNode.setPosition(65,80);

    node.tag = cd;
}

//设置牌的渲染
function setCardSprite_BanBianTianZha2(node, cd, isOnDesk)
{
    if (cd == 53 || cd == 54 || MjClient.data.sData.tData.hunCard == cd)//小王，大王, 癞子牌
    {
        cc.log("setCardSprite_card2: param error!!!");
        return;
    }

    var path = "playing/cardPic2/";
    
    //麻将的底牌公用图，4张
    node.loadTexture(path + "baidi_puke.png");
    var cardType = Math.ceil(cd / 4);// A,2 ,3, 4, 。。。。 j ,Q .k
    var flowerType = cd % 4;// 0 黑桃 ，1 方块 ，2 梅花 ，3 红桃

    node.removeAllChildren();

    //牌的类型
    var cardTypeNode = new ccui.ImageView();
    if(flowerType == 0 || flowerType == 2)
        cardTypeNode.loadTexture(path + "hei_" + cardType + ".png");
    else
        cardTypeNode.loadTexture(path + "hong_" + cardType + ".png");
    cardTypeNode.setName("cardType");
    node.addChild(cardTypeNode);

    //花色类型
    var flowerTypeNode = new ccui.ImageView();
    flowerTypeNode.loadTexture(path + "flower_" + flowerType + ".png");
    flowerTypeNode.setName("imgNode");
    flowerTypeNode.setScale(0.66);
    node.addChild(flowerTypeNode);

    //小花
    var smallFlowerNode = new ccui.ImageView();
    smallFlowerNode.loadTexture(path + "flower_" + flowerType + ".png");
    smallFlowerNode.setName("smallFlower");
    smallFlowerNode.setScale(0.4);
    node.addChild(smallFlowerNode);

    var nodeSize = node.getContentSize();
    cardTypeNode.setPosition(7 + cardTypeNode.getContentSize().width/2, nodeSize.height - 7 - cardTypeNode.getContentSize().height/2);
    flowerTypeNode.setPosition(nodeSize.width - 10 - flowerTypeNode.getContentSize().width*flowerTypeNode.getScaleX()/2, 10 + flowerTypeNode.getContentSize().height/2);

    if(MjClient.sortClassType == 0 || isOnDesk)
        smallFlowerNode.setPosition(cardTypeNode.getPositionX(), nodeSize.height - 80);
    else
        smallFlowerNode.setPosition(65,80);

    node.tag = cd;
}

//初始化玩家金币和名字
function InitUserCoinAndName_BanBianTianZha(node, off) {
    var pl = getUIPlayer_BanBianTianZha(off);
    if (!pl) {
        return;
    }

    var tData = MjClient.data.sData.tData;
    var bind = {
        head: {
            name: {
                _run: function() {
                    this.ignoreContentAdaptWithSize(true);
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
                    changeAtalsForLabel(this, pl.winall);
                }
            }
        }
    }

    var name = node.getChildByName("head").getChildByName("name");
    name.ignoreContentAdaptWithSize(true);

    BindUiAndLogic(node, bind);
}

function loaderHeadImage_BanBianTianZha(node, pl){
    var WxHead = node.getChildByName("WxHead");
    var url = pl.info.headimgurl || "png/default_headpic.png";
    cc.loader.loadImg(url, {isCrossOrigin: true}, function(err, texture) {
        if (!err && texture) {
            if (WxHead) {
                WxHead.removeFromParent(true);
            }
            cc.log("----------------");
            //缓存头像
            //postEvent( "QueueNetMsg",["loadWxHead",{uid:pl.info.uid,img:texture}]);
            //使用新的事件循环机制
            MjClient.Scene.pushQueueNetMsg(["loadWxHead", { uid: pl.info.uid, img: texture }]);

            var sp = new cc.Sprite(texture);
            sp.setName("WxHead");
            node.addChild(sp);
            setWgtLayout(sp, [0.91, 0.91], [0.5, 0.5], [0, 0], false, true);
        }
    });
}

function showFangzhuTagIcon_BanBianTianZha(node,off){
    var tData = MjClient.data.sData.tData;
    if(MjClient.gameType == MjClient.GAME_TYPE.DA_TONG_ZI_SHAO_YANG)
    {
        // 4人选择分组阶段
        if ((tData.tState == TableState.waitJoin || tData.tState == TableState.waitReady) && 
            (tData.maxPlayer == 4)) {
            node.removeChildByName("fangTag");
            return;
        }      
    }
    if(MjClient.gameType == MjClient.GAME_TYPE.BAN_BIAN_TIAN_ZHA)
    {
        // 4人选择分组阶段
        if ((tData.tState == TableState.waitJoin || tData.tState == TableState.waitReady) && 
            (tData.maxPlayer == 4 && tData.areaSelectMode.isDivideTeam)) {
            node.removeChildByName("fangTag");
            return;
        }      
    }
    showFangzhuTagIcon(node, off);
}

