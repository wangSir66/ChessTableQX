/**
 * Created by Administrator on 2017/3/9.
 */

var PlayLayer_PaoDeKuaiXS = PlayLayer_PDK.extend({
    getJsBind: function() {
        return {
            _event: {
                roundEnd: function() {
                    MjClient.selectTipCardsArray = null;

                    // function showLeftHandCardView(){
                        
                    //     function showLeftCards(node, deskCard, putCards){
                    //         for (var i = 0; i < putCards.length; i++) {
                    //             var out = deskCard.clone();

                    //             out.visible = true;
                    //             out.name = "out";

                    //             setCardSprite_card(out, putCards[i], true, out.name);
                    //             node.addChild(out);
                    //         }
                    //     }

                    //     for(var i = 0; i < MjClient.MaxPlayerNum; i ++){
                    //         var node = getNode_cards(i);
                    //         var pl = MjClient.getPlayerByIndex(i);
                    //         if(pl && i != 0){
                    //             var cards = pl.mjhand;
                    //             var deskCard = node.getChildByName("deskCard");
                                

                    //             if(cards.length > 0 && deskCard ){
                    //                 showLeftCards(node, deskCard, cards);

                    //                MjClient.playui.CardLayoutDesk(node, cards, i);
                    //             }
                    //         }
                    //     }
                    // }
                    // showLeftHandCardView()
                    // 

                    var self = this;

                    function showLeftCardsView(){
                        if (MjClient.rePlayVideo == -1) {
                            self.runAction(cc.sequence(cc.DelayTime(0.1), cc.callFunc(function(){
                                for (var off = 0; off <= 2; off++) {
                                    MjClient.playui.cardLayoutRestore_endfiled(off);
                                }
                            })));
                        }
                    }
                    showLeftCardsView();

                    function delayExe()
                    {
                        function removeAllDeskCards(){
                            
                            for(var i = 0; i < MjClient.MaxPlayerNum; i ++){
                                
                                var node = getNode_cards(i);
                                var children = node.children;

                                for (var i = 0; i < children.length; i++)
                                {
                                    var ni = children[i];
                                    if(ni.name == "out")
                                    {
                                        ni.removeFromParent(true);
                                    }
                                } 
                            }
                        }

                        //removeAllDeskCards();

                        var sData = MjClient.data.sData;
                        var tData = sData.tData;

                        if(tData.tState && tData.tState !=TableState.roundFinish){
                            return;
                        }
                        
                        //resetEatActionAnim();
                        if (sData.tData.roundNum <= 0)
                        {
                            if(tData.matchId){
                                self.runAction(cc.sequence(cc.delayTime(3),cc.callFunc(function(){
                                    self.addChild(new GameOverLayer(),500);
                                })))
                            }
                        }
                        self.addChild(new EndOneView_PaodekuaiXS(),500);
                    }
                    this.runAction(cc.sequence(cc.DelayTime(2),cc.callFunc(delayExe)));
                },
                onlinePlayer: function() {
                    // reConectHeadLayout_card(this);
                },
            },
            roundInfo:{
                _run:function()
                {
                    setWgtLayout(this,[0.12, 0.12],[0.5, 0.52],[0, 0]);

                    var tData = MjClient.data.sData.tData;
                    var str = MjClient.playui.getGameInfoString();
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
                        var str = MjClient.playui.getGameInfoString();
                        this.setString(str);
                    },
                }
            },
            banner: {
                setting: {
                    _click: function() {
                        var settingLayer = new SettingViewCard();
                        settingLayer.setName("PlayLayerClick");
                        MjClient.Scene.addChild(settingLayer);
                        MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Shezhi", {uid:SelfUid(),gameType:MjClient.gameType});
                    },
                },
            },
            BtnReady: {
                _visible: false,
                _run: function() {
                    setWgtLayout(this, [0.18, 0.18], [0.5, 0.4], [0, 0]);
                },
                _click: function(_this) {
                    PKPassConfirmToServer_card();
                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Zhunbei", {uid: SelfUid(), gameType:MjClient.gameType});
                },
                _event: {
                    waitReady: function() {
                        if (currentIsAutoRelay())
                            PKPassConfirmToServer_card();
                        else
                            this.visible = true;
                    },
                    mjhand: function() {
                        this.visible = false;
                    },
                    initSceneData: function() {
                        this.visible = false;
                        var tData = MjClient.data.sData.tData;
                        var pl = getUIPlayer(0);
                        this.visible = tData.roundNum == tData.roundAll && tData.tState == TableState.waitReady && pl.mjState == TableState.waitReady && !IsInviteVisible();
                        if (this.visible&&currentIsAutoRelay()) {
                            PKPassConfirmToServer_card();
                            this.visible = false;
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
                }
            },
            flyCard:{
                _event:{
                    waitPut:function(eD){
                        var tData = MjClient.data.sData.tData;
                        if ( MjClient.MaxPlayerNum == 3 && (tData.roundNum == tData.roundAll || tData.areaSelectMode.mustPutHongTaoSan) && tData.lastPutPlayer == -1) {
                            setWgtLayout(this,[0.036, 0], [0.5, 0.75], [0, 0]);
                            MjClient.playui.shwoFlyCardAnim(this,11);
                        }
                    }
                }
            },
            down: {
                ready: {
                    _run: function() {
                        setWgtLayout(this, [this.width / 1280, this.height / 720], [0.5, 0.5], [0, -1.5]);
                        GetReadyVisible(this, 0);
                        //this.visible = true;
                    }
                },
                _event: {
                    waitPut:function(eD){
                        cc.log(">>>>>>>>>>>>>>>>down>>>>>>>>>>>>>>>waitPut");

                        var tData = MjClient.data.sData.tData;
                        if (MjClient.playui.isShowHandCardBeiMain && (tData.curPlayer == getPlayerIndex(0) || tData.lastPutPlayer != -1)) {
                            MjClient.playui.isShowHandCardBeiMain = false;
                            MjClient.playui.hideHandCardBeiMian();
                        }

                        // 发牌时暂时不计算牌型提示
                        if (!MjClient.playui.isFaPai)
                        {
                            if (MjClient.playui.isWaitAniEnd)
                                delete MjClient.playui.isWaitAniEnd;

                            DealWaitPut_card(this, eD, 0);
                            UpdataCurrentPutCard();

                            // 跑得快 自动出牌
                            if (IsTurnToMe()) {
                                // 如果提示只有一手牌， 自动提起
                                // 如果提示只有一手牌， 且是我全部的手牌数量， 自动打出
                                AutoPutLastCard_card_ty();
                            }
                        }
                    },
                    mjhand: function(eD) {
                        MjClient.playui.initUserHandUIPaoDeKuai(this, 0);
                        // 先排序 再发牌 上面的这个函数可能不走排序的代码段
                        delete MjClient.playui.isFaPai;
                        MjClient.playui.CardLayoutRestore(this, 0);
                        var tData = MjClient.data.sData.tData;
                        var pl = getUIPlayer(0);

                        if (tData.matchId ||(pl && pl.trust))
                        {
                            // 托管状态下，不播放发牌动画 
                        }
                        else
                        {
                            
                        } 

                        MjClient.playui.isWaitAniEnd = true;
                    }
                }
            },
            right: {
                ready: {
                    _run: function() {
                        setWgtLayout(this, [this.width / 1280, this.height / 720], [0.5, 0.5], [2, 0]);
                        GetReadyVisible(this, 1);
                    }
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
                            setWgtLayout(this,[0.052, 0],[1, 0.65],[-3.5, 0.5]);
                        else if (isIPhoneX() && MjClient.rePlayVideo != -1 && !MjClient.data.sData.tData.fieldId)
                            setWgtLayout(this,[0.052, 0],[1, 0.65],[-4.25, 0.5]);
                        else
                            setWgtLayout(this,[0.052, 0],[1, 0.65],[-4.2, 0.5]);
                    },
                },
            },
            top: {
                ready: {
                    _run: function() {
                        setWgtLayout(this, [this.width / 1280, this.height / 720], [0.5, 0.5], [-2, 0]);
                        GetReadyVisible(this, 2);
                    }
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
                            setWgtLayout(this,[0.052, 0],[0.16, 0.65],[0.5, 0.5]);
                        else if (isIPhoneX() && MjClient.rePlayVideo != -1 && !MjClient.data.sData.tData.fieldId)
                            setWgtLayout(this,[0.052, 0],[0.16, 0.65],[2.2, 0.5]);
                        else
                            setWgtLayout(this,[0.052, 0],[0.16, 0.65],[1.2, 0.5]);
                    },
                },
            },
        };
    },
    ctor: function() {
        this._super(res.Play_PaoDeKuaiXS_json);

        MJ_setWaitBtn(true);

        // 在亲友圈房间中添加邀请亲友圈牌有一起对局
        addClubYaoqingBtn();

        if (MjClient.data.sData.tData.areaSelectMode["convertible"] && MjClient.rePlayVideo == -1)
            addFreeNumberBtn([0.5, 0.4]);

        return true;
    }
});

// add...................   Greene
//初始化桌子上的客户端数据c_data..各个游戏的自身数据可以在这里初始，
//尽量不要在外部公共代码判断游戏类型，而是在c_data里初始化数据。
//在PlayLayer的_event 的 initSceneData调用
PlayLayer_PaoDeKuaiXS.prototype.InitC_Data = function() {
    if (!MjClient.data.c_Data)
        MjClient.data.c_Data = {};
    cc.log("InitC_Data===========================")
    //出牌是否动画
    MjClient.data.c_Data.bPutCardAnim = false;
    MjClient.data.c_Data.bTxtAnim = false;
}

// off 是四个位置，根据off 显示四个位置的信息 by sking
PlayLayer_PaoDeKuaiXS.prototype.setUserVisiblePaoDeKuai = function (node, off)
{
    var pl = getUIPlayer(off);
    var head = node.getChildByName("head");
    var name = head.getChildByName("name");
    var nobody = head.getChildByName("nobody");
    var coin = head.getChildByName("coin");
    var offline = head.getChildByName("offline");
    var name_bg = head.getChildByName("name_bg");
    var score_bg = head.getChildByName("score_bg");

    if(pl)
    {
        name.visible = true;
        coin.visible = true;
        offline.visible = true;
        coin.visible = true;
        // name_bg.visible = true;
        // score_bg.visible = true;
        MjClient.loadWxHead(pl.info.uid, pl.info.headimgurl);
        setUserOffline(node, off);
        MjClient.playui.initUserHandUIPaoDeKuai(node, off);
    }
    else
    {
        name.visible = false;
        coin.visible = false;
        offline.visible = false;
        coin.visible = false;
        var WxHead = nobody.getChildByName("WxHead");
        if(WxHead)
            WxHead.removeFromParent(true);
    }
}


PlayLayer_PaoDeKuaiXS.prototype.cardLayoutRestore_endfiled = function (off)
{
    var node = getNode_cards(off);
    //隐藏牌数标记
    var tingCard = node.getChildByName('head').getChildByName("tingCard");
    if(tingCard){
        tingCard.visible = false;
    }

    //清除牌桌打出的牌
    var children = node.children;
    for (var i = 0; i < children.length; i++)
    {
        var ni = children[i];
        if(ni.name == "out")
        {
            ni.removeFromParent(true);
        }
    }

    if(off == 0){//自己不用展示手牌
        return;
    }

    var pl = getUIPlayer(off);
    if(!pl || !pl.mjhand || pl.mjhand.length <= 0)
    {
        return;
    }

    //展示手牌
    var _deskCard = node.getChildByName("deskCard");
    var _showCards = [];
    for(var i = 0; i < pl.mjhand.length;i++)
    {
        var out = _deskCard.clone();
        out.setScale(out.getScale()*1.3);
        out.visible = true;
        out.name = "out";
        setCardSprite_card(out, pl.mjhand[i], 0,true);
        node.addChild(out);
        _showCards.push(out);
    }

    var sort = function (node)
    {
        var pointCounts = {};
        for (var i = 0; i < node.length; i++) {
            var p = MjClient.majiang.calPoint(node[i].tag);
            if (pointCounts[p])
                pointCounts[p] ++;
            else
                pointCounts[p] = 1;
        }

        var commonCmp = function (a, b) {
            var c1 = pointCounts[MjClient.majiang.calPoint(a.tag)];
            var c2 = pointCounts[MjClient.majiang.calPoint(b.tag)];
            if (c1 == c2)
                return MjClient.majiang.cardValueCmp(a.tag, b.tag);
            else
                return c1 - c2;
        }

        node.sort(function(a, b) { return -commonCmp(a, b);});
    }

    sort(_showCards);

    var outSize = _showCards[0].getSize();
    var outScale = _showCards[0].scale;
    var width = outSize.width * outScale * 0.4;
    var height = outSize.height * outScale * 0.55;
    var initPosX = 0;
    var areaWidth = (_showCards.length - 1) * width + outSize.width * outScale;
    if(_showCards.length > 10){
        areaWidth = 9 * width + outSize.width * outScale;
    }
    switch (off)
    {
        case 1:
            initPosX = _deskCard.x - areaWidth + outSize.width * outScale;
            break;
        case 2:
            initPosX = _deskCard.x;
            break;
    }

    var startX = initPosX;
    var startY = _deskCard.y;
    for(var i = 0; i < _showCards.length; i++)
    {
        _showCards[i].x = startX;
        _showCards[i].y = startY;
        _showCards[i].zIndex = i*2;
        startX += width;
        if(i == 9){
            startX = initPosX;
            startY = _deskCard.y - height;
        }
    }

    if(pl.mjdesc3 == "大关" || pl.mjdesc3 == "小关"){
        var _spPosX = initPosX + areaWidth / 2 - 50;
        var _spPosY  = startY - 15;

        var _index = (_showCards.length >= 10) ? (_showCards.length - 2)/2 : (_showCards.length/2 - 1);
        var _path = "gameOver/xiaoguan.png";
        if(pl.mjdesc3 == "大关"){
            _path = "gameOver/daguan.png";
        }

        var _image = new ccui.ImageView(_path);
        _image.setName("guan_Info");
        _image.setScale(0.8 * Math.min(MjClient.size.width/1280,MjClient.size.height/720));

        _image.zIndex = 9999;
        _image.setPosition(_spPosX, _spPosY);
        node.addChild(_image)
    }
}

PlayLayer_PaoDeKuaiXS.prototype.initUserHandUIPaoDeKuai = function (node, off, needSort)
{
    if (cc.isUndefined(needSort))
        needSort = true;

    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var pl = getUIPlayer(off);

    if(!pl)
    {
        return;
    }

    //初始化玩家金币和名称
    InitUserCoinAndName(node, off);
    setAreaTypeInfo(true);
    currentLeftCardCount_paodekuai(off);

    if(
        tData.tState != TableState.waitPut &&
        tData.tState != TableState.waitEat &&
        tData.tState != TableState.waitCard
    )
    {
        return;
    }

    //添加手牌
    if(MjClient.rePlayVideo == -1)// 表示正常游戏
    {
        if (pl.mjhand && off == 0) {//只初始化自己的手牌
            var vcard = [];
            for (var i = 0; i < pl.mjhand.length; i++) {

                var card = getNewCard_card(node, "stand", "mjhand", pl.mjhand[i], off);
                var index = vcard.indexOf(pl.mjhand[i]);//区分2张一样的牌
                if(index >= 0)
                {
                    card.setUserData(1);
                }
                else
                {
                    card.setUserData(0);
                }
                vcard.push(pl.mjhand[i]);
            }

            if (tData.areaSelectMode.fangZuoBi && tData.lastPutPlayer == -1 && tData.curPlayer != getPlayerIndex(0))
            {
                MjClient.playui.isShowHandCardBeiMain = true;
                MjClient.playui.showHandCardBeiMian();
            }
        }
        else if (off > 0) {

        }
    }
    else
    {
        /*
            播放录像
        */
        if (pl.mjhand)
        {
            if(off == 0)
            {
                for (var i = 0; i < pl.mjhand.length; i++) {
                    getNewCard_card(node, "stand", "mjhand", pl.mjhand[i], off);
                }
            }
            else
            {
                for (var i = 0; i < pl.mjhand.length ; i++) {
                    getNewCard_card(node, "stand", "mjhand_replay", pl.mjhand[i], off);
                }
            }
        }
    }

    MjClient.playui.CardLayoutRestore(node, off, needSort);
}

PlayLayer_PaoDeKuaiXS.prototype.updateClockPosition = function(arrowNode)
{
    var tData = MjClient.data.sData.tData;
    var uids = tData.uids;
    var curPlayerIndex = (tData.curPlayer + MjClient.MaxPlayerNum - tData.uids.indexOf(SelfUid())) % MjClient.MaxPlayerNum;

    var curPlayerNode = null;
    var deskCardPosOffset = {
        x: 44,
        y:-34
    }
    if (curPlayerIndex == 1)
        curPlayerNode = this._rightNode;
    else if (curPlayerIndex == 2) {
        curPlayerNode = this._topNode;
        deskCardPosOffset.x = 0 - deskCardPosOffset.x;
    }
    if (curPlayerNode != null){
        var deskCardPos = curPlayerNode.getChildByName("deskCard").getPosition();

        if (isIPhoneX() && MjClient.rePlayVideo != -1 && !MjClient.data.sData.tData.fieldId) {
            deskCardPos.x += 41 * Math.min(MjClient.size.width/1280,MjClient.size.height/720) * (curPlayerIndex == 1 ? 2 : -2);
        } else {
            deskCardPos.y += deskCardPosOffset.y;
            deskCardPos.x += deskCardPosOffset.x; 
        }      

        arrowNode.setPosition(deskCardPos);
    }
    else if (isIPhoneX() && MjClient.rePlayVideo != -1 && !MjClient.data.sData.tData.fieldId) {
        var deskCardPos = this._topNode.getChildByName("deskCard").getPosition();
        deskCardPos.x -= 41 * Math.min(MjClient.size.width/1280,MjClient.size.height/720) * 2;
        deskCardPos.y = arrowNode.srcPosition.y;
        arrowNode.setPosition(deskCardPos);
    }
    else
        arrowNode.setPosition(arrowNode.srcPosition);

    if (curPlayerNode != null && (tData.curPlayer !== tData.lastPutPlayer))
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

/**
 * 拼接游戏玩法及付费信息
 * @function
 * @return {String}
 */
PlayLayer_PaoDeKuaiXS.prototype.getGameInfoString = function()
{
    var tData = MjClient.data.sData.tData;
    var str = "";

    str += tData.areaSelectMode.firstOutOption == 1 ? "红桃3先手," : "赢家先手(首局红桃3),";
    if(MjClient.MaxPlayerNum == 2){
       str = "赢家先手(首局随机),";
    }
    str += tData.areaSelectMode.can4dai2 ? "四带二," : "";
    str += tData.areaSelectMode.can4dai1 ? "四帶一算炸弹," : "";
    str += tData.areaSelectMode.daGuan ? "大关," : "";
    str += tData.areaSelectMode.xiaoGuan ? "小关," : "";
    str += tData.areaSelectMode.zhaDanFen ? "炸弹"+ tData.areaSelectMode.difen * 10 + "分,": "";
    str += tData.areaSelectMode.showCardNumber ? "显示牌数," : "";
    str += tData.areaSelectMode.mustPut ? "必管," : "非必管,";
    str += tData.areaSelectMode.difen == 1 ? "底分1分," : "底分2分,";
    
    
    // if (typeof(tData.areaSelectMode.fengDing) == "number") {
    //     switch (tData.areaSelectMode.fengDing)
    //     {
    //         case 1:
    //             str += "30/32分封顶,";
    //             break;
    //         case 2:
    //             str += "60/64分封顶,";
    //             break;
    //     }
    // }
    
    // // str += tData.areaSelectMode.difen ? "底分X" + tData.areaSelectMode.difen + ","  : "";
    // if(tData.areaSelectMode.fanBei == 1)
    // {
    //     str += "小于" + tData.areaSelectMode.fanBeiScore + "分翻倍,";
    // } 

    // if(tData.areaSelectMode.trustTime > 0)
    // {
    //     str += Math.floor(tData.areaSelectMode.trustTime/60) + "分钟,";
    // }

    if (str.charAt(str.length - 1) == ",")
        str = str.substring(0, str.length - 1);


    //比赛场
    var BSStr = "";
    if(tData.matchId){
        BSStr = ",10秒出牌";
        str += BSStr;
        str = GameCnName[MjClient.gameType]+","+str;
    }
    return str;
};
