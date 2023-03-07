
function playScoreEffect_dianTuo(txtNode){
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
function isShowBackBtn_dianTuo(){
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
}

// 播放语音的时候，关闭音效
function changeEffectVoice_dianTuo(isOpen){
    if(isOpen){
        // var v = util.localStorageEncrypt.getNumberItem("oldEffectVolume", 0); 
        // setEffectsVolume(v);
        cc.audioEngine.resumeMusic();
    }else{
        // setEffectsVolume(0);
        cc.audioEngine.pauseMusic();
    }
}


function playSoundEffect_dianTuo(cards, uid, isLocal){
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
    var type = tData.lastPutCardType;//MjClient.majiang.getCardType(cards, tData.hasWings);
    if(uid == SelfUid()){
        type = MjClient.majiang.getCardType(cards, tData.hasWings, null, tData.areaSelectMode);
    }
    var cardVal = cards[0] % 100; 

    // dianTuo.CARD_TYPE = {
    //     noType: -1,     // 无牌型
    //     danZhang: 0,    // 单张
    //     duiZi: 1,       // 对子
    //     sanZhang: 2,    // 三张
    //     shunZi: 3,      // 顺子
    //     lianDui: 4,     // 连对
    //     feiJi: 5,       // 飞机
    //     zaHuaWuShiK: 7, // 杂花5-10-k
    //     tongHuaWuShiK: 8,   // 同花5-10-k
    //     zhaDan: 9,      // 炸弹
    // };
    var playType = ["putong/","fangyan/"][getCurrentVoiceType()];
    var url = "diantuo/" + playType + "nv/";
    switch(type){
        case dianTuo.CARD_TYPE.danZhang:
            url += "1_"+cardVal;
            playEffect(url, false, sex);
        break;

        case dianTuo.CARD_TYPE.duiZi:
            url += "2_"+cardVal;
            playEffect(url, false, sex);
        break;

        case dianTuo.CARD_TYPE.sanZhang:
        cc.log("ppppppppppppppppppppp",JSON.stringify(cards));
            if(cards.length == 3){
                // 三张单牌 
                url += "3_" + cardVal;
                playEffect(url, false, sex); 
                cc.log(url);
            }else if(cards.length == 4){
                url += "sandaiyi";
                playEffect(url, false, sex);
                cc.log(url);
            }else{ 
                // 三张单牌
                url += "sange";
                playEffect(url, false, sex);
                cc.log(url);
            }
 
        break;
        case dianTuo.CARD_TYPE.zhaDan: 
            url += "zhadan";
            playEffect(url, false, sex);
        break;
        case dianTuo.CARD_TYPE.zaHuaWuShiK: 
            url += "510K";
            playEffect(url, false, sex);
        break;
        case dianTuo.CARD_TYPE.tongHuaWuShiK: 
            url += "510K";
            playEffect(url, false, sex);
        break;
        case dianTuo.CARD_TYPE.feiJi: 
            url += "feiji";
            playEffect(url, false, sex);;
        break;
        case dianTuo.CARD_TYPE.lianDui: 
            url += "liandui";
            playEffect(url, false, sex);;
        break;
        case dianTuo.CARD_TYPE.shunZi:
            url += "shunZi";
            playEffect(url, false, sex);
            break;
    }
}

//显示玩家信息
function showPlayerInfo_dianTuo(off, node)
{
    //var tData = MjClient.data.sData.tData;
    var pl = getUIPlayer_dianTuo(off);
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
            if ((tData.tState == TableState.waitJoin || tData.tState == TableState.waitReady) && tData.maxPlayer == 4 &&
                !tData.areaSelectMode.isSanFuPai) {
                MjClient.showPlayerInfo(pl.info, false, true);
            } else {
                MjClient.showPlayerInfoPlaying(pl.info);
            }
            
        }
    }
}

//剩余牌的张数
function currentLeftCardCount_dianTuo(UIoff,isTdata){
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    if(tData.tState != TableState.waitPut &&
        tData.tState != TableState.waitEat &&
        tData.tState != TableState.waitCard &&
        tData.tState != TableState.waitJiazhu)   {
        return;
    }    

    var node = getNode_cards(UIoff);
    if(UIoff != 0)//自己不需要显示张数
    {

        
        if(MjClient.rePlayVideo != -1){
            node.getChildByName("head").getChildByName("tingCard").visible = false;
            return;
        }

        var _countNode = node.getChildByName("head").getChildByName("tingCard").getChildByName("Text_count"); 
        var warning = node.getChildByName("head").getChildByName("warning"); // 报牌图标
        var rankIcon = node.getChildByName("head").getChildByName("rankIcon"); // 第几个打完的

        var pl = getUIPlayer_dianTuo(UIoff); 

        var sData = MjClient.data.sData;
        var tData = sData.tData;

        if(!tData.areaSelectMode.isShowRemainCards ){
            _countNode.setString("?"); 
        }

        if(pl && (pl.handCount || pl.handCount == 0 || tData.handCount) && _countNode)
        {
            node.getChildByName("head").getChildByName("tingCard").visible = true;

            
            if(tData.areaSelectMode.isShowRemainCards){
                if(isTdata || !pl.handCount){
                    _countNode.setString("0");
                }
                else{
                    _countNode.setString(pl.handCount);
                }
            }

      
            if(pl.handCount <= 5 || !pl.handCount){
                if(warning)
                    warning.setVisible(pl.handCount <= 5 || !pl.handCount);

                // 报警后，不管选没选，都要显示数量
                if(isTdata || !pl.handCount){
                    _countNode.setString("0");
                }
                else{
                    _countNode.setString(pl.handCount);
                }
            }
                
          
 
        }
        if(rankIcon.isVisible()){
            warning.visible = false;
            node.getChildByName("head").getChildByName("tingCard").visible = false;
        }
    }
}
function getAnimate_dianTuo(preName, len, delaytime, playCount){
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
function resetPlayerHead_dianTuo()
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

    reConectHeadLayout_dianTuo(node.parent);
}

//设置玩家掉线头像
function setUserOffline_dianTuo(node, off)
{
    var pl = getUIPlayer_dianTuo(off);
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

function tableStartHeadMoveAction_dianTuo(node)
{
    cc.log("-----------------set head position ------");
    var down = node.getChildByName("down").getChildByName("head");
    var top = node.getChildByName("top").getChildByName("head");
    var left = node.getChildByName("left").getChildByName("head");
    var right = node.getChildByName("right").getChildByName("head");
    {
        setWgtLayout(down, [118/1280, 0], [0.04, 0.045], [0,0], false, false);
        setWgtLayout(top, [118/1280, 0], [0.5, 0.9], [0, 0], false, false);
        setWgtLayout(left, [118/1280, 0], [0.05, 0.67], [0, 0], false, false);
        setWgtLayout(right, [118/1280, 0], [0.95, 0.67], [0, 0], false, false); 
        if(MjClient.MaxPlayerNum == 3){
            setWgtLayout(top, [118/1280, 0], [0.05, 0.67], [0, 0], false, false);
        }

        // if(MjClient.rePlayVideo != -1){
        //     //回放
        //     setWgtLayout(left, [118/1280, 0], [0.08, 0.92], [0, 0], false, false);
        //     setWgtLayout(right, [118/1280, 0], [0.96, 0.92], [0, 0], false, false);
        //     if(MjClient.MaxPlayerNum == 3){
        //         setWgtLayout(top, [118/1280, 0], [0.08, 0.93], [0, 0], false, false);
        //     }
        // }
    }

    sendGPS();
}

//重置4家头像位置
function reConectHeadLayout_dianTuo(node)
{
    var tData = MjClient.data.sData.tData;
    var down = node.getChildByName("down").getChildByName("head");
    var top = node.getChildByName("top").getChildByName("head");
    var left = node.getChildByName("left").getChildByName("head");
    var right = node.getChildByName("right").getChildByName("head");

    {
        setWgtLayout(down, [118/1280, 0], [0.04, 0.045], [0,0], false, false);
        setWgtLayout(top, [118/1280, 0], [0.5, 0.9], [0, 0], false, false);
        setWgtLayout(left, [118/1280, 0], [0.05, 0.67], [0, 0], false, false);
        setWgtLayout(right, [118/1280, 0], [0.95, 0.67], [0, 0], false, false);
        if(MjClient.MaxPlayerNum == 3){
            setWgtLayout(top, [118/1280, 0], [0.05, 0.67], [0, 0], false, false);
        }

        // if(MjClient.rePlayVideo != -1){
        //     //回放
        //     setWgtLayout(left, [118/1280, 0], [0.08, 0.92], [0, 0], false, false);
        //     setWgtLayout(right, [118/1280, 0], [0.96, 0.92], [0, 0], false, false);
        //     if(MjClient.MaxPlayerNum == 3){
        //         setWgtLayout(top, [118/1280, 0], [0.08, 0.93], [0, 0], false, false);
        //     }
        // }
    }

        //UpdataCurrentPutCard();
        //resetFlowerNum(node);
}

//出牌回调
function DealWaitPut_dianTuo(node, msg, off)
{
    var pl = getUIPlayer_dianTuo(off);
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
function clearCardUI_dianTuo(node)
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

function initCardList_dianTuo(){

    var ratio = 1;
    if(isIPhoneX()){
        ratio = 0.80;
    }

    //down
    if(!MjClient.playui._downNode.cardList && !cc.sys.isObjectValid(MjClient.playui._downNode.cardList)){
        var cardList = new dianTuo.CardListLayer();
        MjClient.playui._downNode.addChild(cardList);
        cardList.setLocalZOrder(-1);
        setWgtLayout(cardList, [1 * ratio, 0], [0.05, 0.18], [0, 0]);
        if(isIPhoneX()){
            setWgtLayout(cardList, [1 * ratio, 0], [0.1, 0.2], [0, 0]);
        }
        MjClient.playui._downNode.cardList = cardList;
     }
    
     if(!MjClient.playui._downNode.throwList && !cc.sys.isObjectValid(MjClient.playui._downNode.throwList)){
        var throwList = new dianTuo.CardThrowListLayer();
        throwList.setCardsAnchorPoint(0.5,0);
        throwList.setLocalZOrder(-2);
        MjClient.playui._downNode.addChild(throwList);
        MjClient.playui._downNode.throwList = throwList;
        setWgtLayout(throwList, [0.3 * ratio, 0], [0.5, 0.32], [0, 0]);
     }

     //right
     if(!MjClient.playui._rightNode.cardList && !cc.sys.isObjectValid(MjClient.playui._rightNode.cardList)){
        var cardList = new dianTuo.CardListLayer();
        cardList.setTouchOpen(false);
        MjClient.playui._rightNode.addChild(cardList);
        setWgtLayout(cardList, [0.4 * ratio, 0], [0.98, 0.15], [0, 0]); //right
        if(MjClient.rePlayVideo != -1){
            setWgtLayout(cardList, [0.4 * ratio, 0], [0.88, 0.15], [0, 0]); //right
            if(MjClient.MaxPlayerNum == 3){ // 3人往上移
                setWgtLayout(cardList, [0.4 * ratio, 0], [0.88, 0.28], [0, 0]); //right
            }
        }
        
        cardList.setRotation(-90);
        MjClient.playui._rightNode.cardList = cardList;
     }
    
     if(!MjClient.playui._rightNode.throwList && !cc.sys.isObjectValid(MjClient.playui._rightNode.throwList)){
        var throwList = new dianTuo.CardThrowListLayer();
        throwList.setCardsAnchorPoint(1,0);
        throwList.setLocalZOrder(-2);
        MjClient.playui._rightNode.addChild(throwList);
        MjClient.playui._rightNode.throwList = throwList;
        setWgtLayout(throwList, [0.3 * ratio, 0], [0.84, 0.48], [0, 0]);
        // throwList.visible = false;
     }

     //top
     if(!MjClient.playui._topNode.cardList && !cc.sys.isObjectValid(MjClient.playui._topNode.cardList)){
        var cardList = new dianTuo.CardListLayer();
        cardList.setTouchOpen(false);
        MjClient.playui._topNode.addChild(cardList);
        setWgtLayout(cardList, [0.4 * ratio, 0], [0.2, 0.83], [0, 0]); //top
        MjClient.playui._topNode.cardList = cardList;
        if(MjClient.MaxPlayerNum == 3){
            cardList.setRotation(90);
            setWgtLayout(cardList, [0.38 * ratio, 0], [0.1, 0.95], [0, 0]); //left
        }
     }
    
     if(!MjClient.playui._topNode.throwList && !cc.sys.isObjectValid(MjClient.playui._topNode.throwList)){
        var throwList = new dianTuo.CardThrowListLayer();
        throwList.setCardsAnchorPoint(0.5,0);
        throwList.setLocalZOrder(-2);
        MjClient.playui._topNode.addChild(throwList);
        MjClient.playui._topNode.throwList = throwList;
        setWgtLayout(throwList, [0.3 * ratio, 0], [0.5, 0.7], [0, 0]);
        if(MjClient.MaxPlayerNum == 3){
            throwList.setCardsAnchorPoint(0,0);
            setWgtLayout(throwList, [0.3 * ratio, 0], [0.16, 0.48], [0, 0]);
        }
     }

     //left
     if(!MjClient.playui._leftNode.cardList && !cc.sys.isObjectValid(MjClient.playui._leftNode.cardList)){
        var cardList = new dianTuo.CardListLayer();
        cardList.setTouchOpen(false);
        MjClient.playui._leftNode.addChild(cardList);
        setWgtLayout(cardList, [0.38 * ratio, 0], [0.05, 0.90], [0, 0]); //left

        if(MjClient.rePlayVideo != -1){
            setWgtLayout(cardList, [0.38 * ratio, 0], [0.12, 0.90], [0, 0]); //left
        }
        
        cardList.setRotation(90);
        MjClient.playui._leftNode.cardList = cardList;
     }
    
     if(!MjClient.playui._leftNode.throwList && !cc.sys.isObjectValid(MjClient.playui._leftNode.throwList)){
        var throwList = new dianTuo.CardThrowListLayer();
        throwList.setCardsAnchorPoint(0,0);
        throwList.setLocalZOrder(-2);
        MjClient.playui._leftNode.addChild(throwList);
        MjClient.playui._leftNode.throwList = throwList;
        setWgtLayout(throwList, [0.3 * ratio, 0], [0.16, 0.48], [0, 0]);
     }
}

//过的回调
function DealPKPass_dianTuo(off)
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
function UpdataCurrentPutCard_dianTuo()
 {
    initCardList_dianTuo();

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
function reConnectShowDeskCard_dianTuo()//为 down  top, left ,right 节点
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
        showCurrentPutCards_dianTuo(UIOff, uids[off]);
    }

    //断线重连，且轮到自己出牌
    if(IsTurnToMe() && tData.tState == TableState.waitPut)
    {
        //更新按钮状态
        UpdataCurrentPutCard_dianTuo();

        //初始化，出牌提示数组
        // InitPutOutCardTips(0);
    }

}

//处理出牌,放一张牌，打牌动作
function DealMJPut_dianTuo(node, msg, UIOff, outNum)
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

        showCurrentPutCards_dianTuo(UIOff, msg.uid);

        var pl = getUIPlayer_dianTuo(UIOff);
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
        var pl = getUIPlayer_dianTuo(UIOff);
        if (pl && pl.handCount && pl.handCount == 1)
            playEffectInPlay("single");
    }
}

//显示当前打出在牌桌上的牌 uid:当前出牌的玩家
function showCurrentPutCards_dianTuo(UIoff, uid)
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
        throwList.showCards(putCards, pl.info.sex);
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
            copyArr = MjClient.majiang.sortCard(copyArr, MjClient.majiang.sortType);


            var cardList = node.cardList;
            cardList.removeCardsByTypes(putCards);
            cardList.refreshHandCards();
        }
    }

}

//初始化玩家金币和名字
function InitUserCoinAndName_dianTuo(node, off) {
    var pl = getUIPlayer_dianTuo(off);
    if (!pl) {
        return;
    }

    var tData = MjClient.data.sData.tData;
    var bind = {
        head: {
            name: {
                _run:function(){
                    this.ignoreContentAdaptWithSize(true);
                    this.setFontName("Arial");
                    this.setFontSize(this.getFontSize());
                },
                _text: function() {
                    var _nameStr = unescape(pl.info.nickname );
                    if(tData.areaSelectMode.isBuDaGang && pl.info.uid != SelfUid() && MjClient.rePlayVideo == -1) {
                        _nameStr = "玩家" + (tData.uids.indexOf(pl.info.uid) + 1);
                    }
                    return getNewName(_nameStr);
                }
            },
            coin: {
                _visible: true,
                _run: function() {
                    var coin = tData.initCoin ? tData.initCoin : 0;
                    changeAtalsForLabel(this, coin + pl.score_draw);
                }
            },
            zhua: {
                _visible: true,
                _run: function() {
                    var coin = tData.initCoin ? tData.initCoin : 0;
                    changeAtalsForLabel(this, coin );
                }
            },
            xi: {
                _visible: true,
                _run: function() {
                    var coin = tData.initCoin ? tData.initCoin : 0;
                    changeAtalsForLabel(this, coin + pl.score_draw);
                }
            }
        }
    }

    var name = node.getChildByName("head").getChildByName("name");
    name.ignoreContentAdaptWithSize(true);

    BindUiAndLogic(node, bind);
}

// function loaderHeadImage_dianTuo(node, pl){
//     var WxHead = node.getChildByName("WxHead");
//     var url = pl.info.headimgurl || "png/default_headpic.png";
//     cc.loader.loadImg(url, {isCrossOrigin: true}, function(err, texture) {
//         if (!err && texture) {
//             if (WxHead) {
//                 WxHead.removeFromParent(true);
//             }
//             cc.log("----------------");
//             //缓存头像
//             postEvent( "QueueNetMsg",["loadWxHead",{uid:pl.info.uid,img:texture}]);

//             var sp = new cc.Sprite(texture);
//             sp.setName("WxHead");
//             node.addChild(sp);
//             setWgtLayout(sp, [0.91, 0.91], [0.5, 0.5], [0, 0], false, true);
//         }
//     });
// }

function showFangzhuTagIcon_dianTuo(node,off){
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
    if (tData.owner == pl.info.uid)
    {
        if(!node.getChildByName("fangTag"))
        {
            var sp = new cc.Sprite("playing/gameTable/fangzhu2.png");
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
}

/**
 * 当前玩家是不是自己
 * @param  {number} off 和‘我’在uids的下标的差
 * @return {bool} true:轮到我操作  false:不是我在操作
 */
function curPlayerIsMe_dianTuo(off){
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

