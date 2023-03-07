//永州，邵阳，湘乡，耒阳，衡阳的跑得快公用
var actionZindex = 1000;

// off 是四个位置，根据off 显示四个位置的信息 by sking
function SetUserVisible_PaoDeKuaiYZTY(node, off)
{
    var pl = getUIPlayer(off);
    var head = node.getChildByName("head");
    var name = head.getChildByName("name");
    var nobody = head.getChildByName("nobody");
    var coin = head.getChildByName("coin");
    var offline = head.getChildByName("offline");
    var name_bg = head.getChildByName("name_bg");
    var score_bg = head.getChildByName("score_bg");
    var head_bottom = head.getChildByName("head_bottom");
    var icon_bottom = head.getChildByName("icon_bottom");
    var name_bottom = head.getChildByName("name_bottom");

    if(pl)
    {
        name.visible = true;
        coin.visible = true;
        offline.visible = true;
        coin.visible = true;
        // name_bg.visible = true;
        // score_bg.visible = true;
        var sData = MjClient.data.sData;
        var tData = sData.tData;

        if (name_bottom && tData.fieldId &&　(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ) ) {
            name_bottom.visible = true;
        }
        
        if (icon_bottom && tData.fieldId && (MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ) ) {
            icon_bottom.visible = true;
        }
        if (tData.fieldId) {
            name.setFontSize(24)
        }else if(head_bottom) {
            head_bottom.visible = true;
        }
            
        MjClient.loadWxHead(pl.info.uid, pl.info.headimgurl);
        setUserOffline(node, off);
        InitUserHandUI_PaoDeKuaiYZTY(node, off);
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


function InitUserHandUI_PaoDeKuaiYZTY(node, off, needSort)
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

    initSortUI();

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

function cardsSort_PaoDeKuaiYZTY(cards)
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

var PlayLayer_PaoDeKuaiYZTY = cc.Layer.extend({
    _btnPutCard:null,

   
    jsBind: {
        _run: function() {
            if (MjClient.playui._spriteSingle) {
                setWgtLayout(MjClient.playui._spriteSingle, [MjClient.playui._spriteSingle.width / 1280, MjClient.playui._spriteSingle.height / 720], [0.4, 0.18], [0, 0]);
            }
        },
        _event: {
            mjhand: function() {
                if(MjClient.endoneui != null && cc.sys.isObjectValid(MjClient.endoneui))
                {
                    cc.log("=======mjhand====endoneui====" + typeof (MjClient.endoneui) );
                    MjClient.endoneui.removeFromParent(true);
                    MjClient.endoneui = null;
                }

                var sData = MjClient.data.sData;
                var tData = sData.tData;
                // resetFlowerNum(this);
                MjClient.playui.resetJiaZhuNum(this);
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
                    currentLeftCardCount_paodekuai(i);
                }

                //回放的时候
                if(MjClient.rePlayVideo != -1)
                {
                    tData.uids = msg.uids;//要更新uid位置
                    resetPlayerHead();
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
                            resetPlayerHead();
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
                if (msg.showEnd) this.addChild(new GameOverLayer(),500);
                else
                    MjClient.Scene.addChild(new StopRoomView());

                //选择飘分时候解散房间，清除飘分选择页面
                var layer = MjClient.playui.getChildByName("JiaZhu");
                if (layer) { layer.removeFromParent();}
            },
            roundEnd: function() {
                MjClient.selectTipCardsArray = null;
                
                var self = this;
                function delayExe()
                {
                    var sData = MjClient.data.sData;

                    if(sData.tData.tState && sData.tData.tState !=TableState.roundFinish){
                        return;
                    }

                    //resetEatActionAnim();
                    if(!sData.tData.fieldId){
                        if (sData.tData.roundNum <= 0) {
                            var layer = new GameOverLayer();
                            layer.setVisible(false);
                            self.addChild(layer,500);
                        }

                        var _lay = self.getChildByTag(650);
                        if(_lay){
                            _lay.removeFromParent();
                        }

                        self.addChild(new EndOneView_PaoDeKuaiYZTY(),500,650);
                    }else{
                        self.addChild(new GoldEndOneLayer_PDK(),500);
                        if(isGoldActivityOpen_2() && sData.tData.streakInfo){
                            Active_chuangGuan.createRoomChuangGuanResultUi(self);
                        }
                    }
                }
                // 金币场需要展示其他玩家剩余手牌
                if (MjClient.data.sData.tData.fieldId && MjClient.rePlayVideo == -1) {
                    this.runAction(cc.sequence(cc.DelayTime(0.6), cc.callFunc(function(){
                        for (var off = 0; off <= 2; off++) {
                            MjClient.playui.cardLayoutRestore_endfiled(off);
                        }
                    })));
                }
                
                var time = MjClient.data.sData.tData.fieldId ? 2 : 1;//金币场需要延迟2秒到小结算
                this.runAction(cc.sequence(cc.DelayTime(time),cc.callFunc(delayExe)));
            },
            moveHead: function() {
                postEvent("returnPlayerLayer");

                if (MjClient.playui._jiazhuWait)
                    MjClient.playui._jiazhuWait.visible = false;

                // 跑得快不再播放头像移动动画
                //tableStartHeadMoveAction_card(this);
                
                MjClient.playui.reConectHeadLayout_PaoDeKuaiYZTY(this);
                sendGPS();
            },
            initSceneData: function() {
                var self = this;
                var sData = MjClient.data.sData;
                var tData = sData.tData;
                if(tData.fieldId && tData.redPacketInfo && MjClient._redPacketInfo && isGoldActivityOpen()){
                    var activeGoldPlaying = self.getChildByName("activeGoldPlaying");
                    if(activeGoldPlaying == null){
                        activeGoldPlaying = new ActiveGoldPlaying();
                        activeGoldPlaying.setName("activeGoldPlaying")
                        self.addChild(activeGoldPlaying,501);
                    }
                }else{
                    self.removeChildByName("activeGoldPlaying");
                }
                if(tData.fieldId && tData.streakInfo && MjClient._streakInfo && isGoldActivityOpen_2()){
                    if(!MjClient.playui.Active_chuangGuan){
                        MjClient.playui.Active_chuangGuan = Active_chuangGuan.createRoomTipUi(MjClient.playui._banner,cc.p(440,MjClient.playui._get_gold_btn.y));
                    }
                }else{
                    if(MjClient.playui.Active_chuangGuan){
                        MjClient.playui.Active_chuangGuan.removeFromParent(true);
                    }
                }
                //初始化桌子的客户端数据
                MjClient.playui.InitC_Data();
                MjClient.playui.reConectHeadLayout_PaoDeKuaiYZTY(this);
                MjClient.playui.showJiaZhu_PaodekuaiTY()
                MjClient.playui.resetJiaZhuNum(this);
                CheckRoomUiDelete();

                if(tData.tState == TableState.waitPut )
                {
                    UpdataCurrentPutCard();
                }

                for(var i = 0;i < MjClient.MaxPlayerNum;i++)
                {
                    currentLeftCardCount_paodekuai(i);
                }

                tableStartHeadMoveAction_paohuzi(this);   //不涉及到头像移动动作
                var data = [[0.25, 0.25], [0.5, 0.72], [0, 0]];
                checkCanShowDistance(data);

                if (IsTurnToMe()) {
                    // 如果提示只有一手牌， 自动提起
                    // 如果提示只有一手牌， 且是我全部的手牌数量， 自动打出
                    AutoPutLastCard_card_ty();
                }

                //重新加载下操作按钮资源
                MjClient.playui.reLoadOptBtnRes();
            },
            onlinePlayer: function(msg) {
                MjClient.playui.reConectHeadLayout_PaoDeKuaiYZTY(this);

                // 全局托管，自动准备移除小结算
                var mySelf = getUIPlayer(0);
                if (!mySelf)
                    return;

                if (!msg.isTrust){
                    return;
                }

                if (mySelf.info.uid != msg.uid)
                    return;

                postEvent("clearCardUI");

                if(MjClient.endoneui && cc.sys.isObjectValid(MjClient.endoneui)){
                    MjClient.endoneui.removeFromParent(true);
                    MjClient.endoneui = null;
                }

                if (MjClient.rePlayVideo >= 0 && MjClient.replayui && !MjClient.endallui) {
                    MjClient.replayui.replayEnd();
                }
               
                if (MjClient.arrowbkNode && cc.sys.isObjectValid( MjClient.arrowbkNode )) {
                    MjClient.arrowbkNode.setVisible(false);
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
            changePKImgEvent: function() {
                changePKImg(this, getCurrentPKImgType());

                // 换了牌面后，牌的大小有变化，位置需要重排
                MjClient.playui.CardLayoutRestore(getNode_cards(0),0);
            },
            beTrust:function (msg) {//{uid: pl.uid};
                var sData = MjClient.data.sData;
                var pl = sData.players[msg.uid];
                if(pl){
                    pl.trust = true;
                }
            },
            cancelTrust:function (msg) {
                var sData = MjClient.data.sData;
                var pl = sData.players[msg.uid];
                if(pl){
                    pl.trust = false;
                }
            },
            clearCardUI: function(eD) {
                if (MjClient.playui._spriteSingle) {
                    MjClient.playui._spriteSingle.visible = false;
                }
            },
            PKPut: function(eD) {
                MjClient.clockNode.visible = false;
            },
            PKPass:function(eD)
            {
                MjClient.clockNode.visible = false;
            },
            waitPut: function() {
                //重新加载下操作按钮资源
                MjClient.playui.reLoadOptBtnRes();
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
                    changeGameBgEvent: function() {
                        changeGameBg(this);
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
                setWgtLayout(this,[0.12, 0.06],[0.5, 0.6],[0, 0]);
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
        jiazhuWait: {
            _visible: false,
            _layout: [
                [0.2, 0.2],
                [0.5, 0.7],
                [0, 0]
            ]
        },
        banner: {
            _run:function()
            {
                MjClient.playui._banner = this;
                if(MjClient.getAppType() == MjClient.APP_TYPE.QXYZQP ||
                   MjClient.getAppType() == MjClient.APP_TYPE.QXLYQP ||
                   MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP ||
                   MjClient.getAppType() == MjClient.APP_TYPE.QXXXGHZ)
                    setWgtLayout(this,[0.5, 0.5],[0.53, 1],[0,0]);
                else
                    setWgtLayout(this,[0.5, 0.5],[0.5, 1],[0,0]);
            },
            roomNumBg:{
                _run:function()
                {
                    if(MjClient.data.sData.tData.fieldId){
                        if(!this.initWidth){
                            this.initWidth = this.width;
                        }
                        if(!this.initX){
                            this.initX = this.x;
                        }
                        var dw = 0.17;
                        this.x = this.initX -this.initWidth * (parseFloat(dw/2));
                        this.width = this.initWidth * (1-dw);
                    }
                }
            },
            bg_time:{
                 _run:function()
                {
                    MjClient.playui.BgTime_run(this);
                }

            },
            wifi: {
                _run: function() {
                    updateWifiState_new(this);
                }
            },
            roundnumAtlas:{
                _visible : function () {
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    if (tData){
                        if(tData.fieldId) {//金币场显示场次名称
                            return false;
                        }
                    }
                    return true;
                },
                _run: function() {
                    this.ignoreContentAdaptWithSize(true);
                },
                _text: function() {
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    var extraNum = tData.extraNum ? tData.extraNum:0;
                    return "第 " + ( tData.roundAll-tData.roundNum + 1 + extraNum)+"/"+tData.roundAll + " 局";
                },
                _event: {
                    mjhand: function() {
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;
                        var extraNum = tData.extraNum ? tData.extraNum:0;
                        if (tData) 
                            return this.setString("第" + (tData.roundAll-tData.roundNum + 1 + extraNum)+"/"+tData.roundAll + "局");
                    },
                    initSceneData: function() {
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;
                        var extraNum = tData.extraNum ? tData.extraNum:0;
                        if (tData) return this.setString("第" + (tData.roundAll-tData.roundNum + 1 + extraNum)+"/"+tData.roundAll + "局");
                    },
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
                    if(MjClient.data.sData && MjClient.data.sData.tData && MjClient.data.sData.tData.fieldId){//金币场显示场次名称
                        this.setString(MjClient.data.sData.tData.fieldTitle+"   底分"+getJinbiStr(MjClient.data.sData.tData.fieldBase)+"金币");
                    }
                },
                _event: {
                    initSceneData: function() {
                        this.ignoreContentAdaptWithSize(true);
                        if(MjClient.data.sData.tData.fieldId){//金币场显示场次名称
                            this.setString(MjClient.data.sData.tData.fieldTitle+"   底分"+getJinbiStr(MjClient.data.sData.tData.fieldBase)+"金币");
                        }else{
                            this.setString("房间号：" + MjClient.data.sData.tData.tableid);
                        }

                    }
                }
            },
            setting: {
                _click: function() {
                    var settringLayer = new SettingView();
                    settringLayer.setName("PlayLayerClick");
                    MjClient.Scene.addChild(settringLayer);
                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_shezhi", {uid:SelfUid(),gameType:MjClient.gameType});
                },
                _run:function() {
                    /*if(MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ)
                        setWgtLayout(this,[0.133, 0.133],[1.08,0.04],[0,0]);
                    else
                        setWgtLayout(this,[0.12, 0.12],[0.94,0.05],[0,0]);*/
                }
            },               
            gps_btn: {
                _run: function() {
                    if(MjClient.data.sData.tData.maxPlayer == 2)
                    {
                        this.visible = false;
                    }
                    if(MjClient.data.sData.tData.fieldId){
                        this.visible = false;
                    }

                    var banner = this.parent;
                    var waitNode = MjClient.playui.getChildByName("playUINode").getChildByName("wait");
                    var delroom = waitNode.getChildByName("delroom");
                    var backHomebtn = waitNode.getChildByName("backHomebtn");
                    var distanceX = banner.getChildByName("setting").getPositionX() - banner.getChildByName("changeBg").getPositionX();

                    delroom.setScale(banner.scaleX,banner.scaleY);
                    backHomebtn.setScale(banner.scaleX,banner.scaleY);

                    if (this.isVisible()) {
                        delroom.setPosition(waitNode.convertToNodeSpace(banner.convertToWorldSpace(cc.p(this.getPositionX() - distanceX,this.getPositionY()))))
                        backHomebtn.setPosition(waitNode.convertToNodeSpace(banner.convertToWorldSpace(cc.p(this.getPositionX() - 2*distanceX,this.getPositionY()))))
                    }
                    else {
                        delroom.setPosition(waitNode.convertToNodeSpace(banner.convertToWorldSpace(this.getPosition())))
                        backHomebtn.setPosition(waitNode.convertToNodeSpace(banner.convertToWorldSpace(cc.p(this.getPositionX() - distanceX,this.getPositionY()))))
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
            tuoguan_btn:{
                _run:function () {
                    this.setVisible(MjClient.data.sData.tData.fieldId ? true : false);
                },
                _click: function() {
                    MjClient.gamenet.request("pkroom.handler.tableMsg", {cmd: "beTrust"});
                },
                _event:{
                    beTrust:function (msg) {
                        if(msg.uid == SelfUid()){
                            this.enabled = false;
                        }
                    },
                    cancelTrust:function (msg) {
                        if(msg.uid == SelfUid()){
                            this.enabled = true;
                        }
                    },
                    initSceneData:function (msg) {
                        var pl = getUIPlayer(0);
                        if(pl.trust){
                            this.enabled = false;
                        }else {
                            this.enabled = true;
                        }
                    },
                }
            },
            duty_btn: {
                _run: function () {
                    this.setVisible(MjClient.data.sData.tData.fieldId ? true : false);
                    if (!MjClient.data.sData.tData.fieldId ) {
                        return
                    }
                    MjClient.block();
                    ShowDayTaskTips(this)
                    
                },
                _click: function () {
                    MjClient.Scene.addChild(new GoldTaskLayer());
                },
                Image_hongdian:{
                    _run: function () {
                        this.visible = MjClient._GoldFuli;
                    },
                    _event: {
                        refresh_mission: function() {
                            this.visible = MjClient._GoldFuli;
                        }
                    }
                }
            },
            changeBg: {
                _run: function(){
                    /*if(MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ)
                        setWgtLayout(this,[0.133, 0.133],[0.985,0.04],[0,0]);
                    else
                        setWgtLayout(this,[0.12, 0.12],[0.85,0.05],[0,0]);*/
                },
                _click: function() {
                    setCurrentGameBgTypeToNext();
                    postEvent("changeGameBgEvent");
                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Pifu", {uid:SelfUid(),gameType:MjClient.gameType});
                }
            },
            back_btn: {
                _run: function() {
                    // if(MjClient.data.sData.tData.maxPlayer == 2){
                    //     this.x += 30;
                    // }
                },
                //_layout: [[0.09, 0.09],[0.38, 0.93],[0, 0]],
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
                }
            },
            get_gold_btn:{
                _run:function () {
                    MjClient.playui._get_gold_btn = this;
                    if(MjClient._GOLD_RECHARGE && MjClient.data.sData.tData.fieldId){
                        this.setVisible(true);
                    }else {
                        this.setVisible(false);
                    }

                    // 隐藏按钮，暂不开放
                    this.setVisible(false);
                },
                _click: function() {
                    MjClient.Scene.addChild(new goldStoreLayer());
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
        },
        clock: {
            _run:function () {
                if(MjClient.data.sData.tData.areaSelectMode.mustPut == true)
                {
                    if (MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZTZ || 
                        MjClient.getAppType() == MjClient.APP_TYPE.QXLYQP)
                    {
                        // 邵阳、耒阳特殊处理
                        if(isIPhoneX())
                            setWgtLayout(this,[0.065, 0.14],[0.25,0.51],[0,0]);
                        else
                            setWgtLayout(this,[0.065, 0.14],[0.25,0.44],[0,0]);
                    }
                    else
                    {
                        if(isIPhoneX())
                            setWgtLayout(this,[0.065, 0.14],[0.25,0.47],[0,0]);
                        else
                            setWgtLayout(this,[0.065, 0.14],[0.25,0.4],[0,0]);
                    }

                }
                else
                {
                    if (MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ || 
                        MjClient.getAppType() == MjClient.APP_TYPE.QXLYQP)
                    {
                        // 邵阳、耒阳特殊处理
                        if(isIPhoneX())
                            setWgtLayout(this,[0.065, 0.14],[0.17,0.51],[0,0]);
                        else
                            setWgtLayout(this,[0.065, 0.14],[0.17,0.44],[0,0]);
                    }
                    else
                    {
                        if(isIPhoneX())
                            setWgtLayout(this,[0.065, 0.14],[0.17,0.47],[0,0]);
                        else
                            setWgtLayout(this,[0.065, 0.14],[0.17,0.4],[0,0]);
                    }
                }
                MjClient.clockNode = this;
                this.visible = false;
                this.zIndex = 100;
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
                            MjClient.clockNode.visible = true;
                            this.setString("0");
                            MjClient.playui.updateClockPosition(MjClient.clockNode);
                        }
                    },
                    waitPut: function() {
                        this.stopAllActions();
                        var tData = MjClient.data.sData.tData;
                        var haveTip = (tData.hadTipCards !== false);
                        // 必出且不能管
                        var isNewOut = (tData.curPlayer === tData.lastPutPlayer);
                        var isClockVisible = (isNewOut || haveTip) ? true : false;
                        MjClient.clockNode.visible = isClockVisible;
                        stopEffect(playTimeUpEff);
                        MjClient.playui.clockNumberUpdate(this);
                        MjClient.playui.updateClockPosition(MjClient.clockNode);
                    },
                    PKPut: function(msg) {
                        if (msg.uid == SelfUid()) {
                            this.stopAllActions();
                            stopEffect(playTimeUpEff);
                            playTimeUpEff = null;
                            //MjClient.playui.clockNumberUpdate(this);
                            this.setString("0");
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
        wait: {
            _run:function() {
                this.visible = true;
            },
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
                    getPlayingRoomInfo(1);
                }
            },
            wxinvite: {
                _layout: [[0.2, 0.2],[0.5, 0.38],[0, -0.5]],
                _click: function() {
                    getPlayingRoomInfo(2);
                },
                _visible:function()
                {
                    if( MjClient.data.sData && MjClient.data.sData.tData && MjClient.data.sData.tData.fieldId){
                        return false;
                    }
                    return !MjClient.remoteCfg.guestLogin;
                }
            },
            delroom: {
                _run:function(){
                    // if (isIPhoneX())
                    //     setWgtLayout(this, [0.12, 0.12],[0.18, 0.62],[0, 0]);
                    // else
                    //     setWgtLayout(this, [0.12, 0.12],[0.13, 0.62],[0, 0]);
                },
                _click: function() {
                    MjClient.delRoom(true);
                },
                _event: {
                    waitReady: function() {
                        this.visible = true;
                    }
                }
            },
            backHomebtn: {
                _run:function(){
                    // if (isIPhoneX())
                    //     setWgtLayout(this, [0.12, 0.12],[0.09, 0.62],[0, 0]);
                    // else
                    //     setWgtLayout(this, [0.12, 0.12],[0.04, 0.62],[0, 0]);
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
                    waitReady: function() {
                        this.visible = true;
                    }
                }
            },
            waitFriends:{
                _layout: [[0.06, 0.06],[0.5, 0.37],[0, -4]],
                _run:function () {
                    for(var i=0 ; i<9 ; i++){
                        var imgZi = this.getChildByName("waitFriend_" + i);
                        imgZi.visible = false;
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
                },
            },
            _event: {
                onlinePlayer: function() {
                    if( IsAllPlayerReadyState() ) {
                        this.getChildByName('delroom').visible = false;
                        this.getChildByName('backHomebtn').visible = false;
                    } 
                },
                initSceneData: function(eD) {
                    var isWaitReady = eD.tData.tState == TableState.waitReady;
                    this.getChildByName('getRoomNum').visible = false;
                    this.getChildByName('wxinvite').visible = IsInviteVisible() && !MjClient.remoteCfg.guestLogin;
                    this.getChildByName('delroom').visible = IsInviteVisible() || isWaitReady;
                    this.getChildByName('backHomebtn').visible = IsInviteVisible() || isWaitReady;
                    this.getChildByName('waitFriends').visible = this.getChildByName('wxinvite').visible;
                },
                addPlayer: function(eD) {
                    var isWaitReady = eD.tData.tState == TableState.waitReady;
                    console.log(">>>>>> play add player >>>>");
                    this.getChildByName('getRoomNum').visible = false;
                    this.getChildByName('wxinvite').visible = IsInviteVisible() && !MjClient.remoteCfg.guestLogin;
                    this.getChildByName('delroom').visible = IsInviteVisible() || isWaitReady;
                    this.getChildByName('backHomebtn').visible = IsInviteVisible() || isWaitReady;
                    this.getChildByName('waitFriends').visible = this.getChildByName('wxinvite').visible;
                },
                removePlayer: function(eD) {
                    var isWaitReady = eD.tData.tState == TableState.waitReady;
                    this.getChildByName('getRoomNum').visible = false;
                    this.getChildByName('wxinvite').visible = !MjClient.remoteCfg.guestLogin;
                    this.getChildByName('delroom').visible = IsInviteVisible() || isWaitReady;
                    this.getChildByName('backHomebtn').visible = IsInviteVisible() || isWaitReady;
                    this.getChildByName('waitFriends').visible = this.getChildByName('wxinvite').visible;
                }
            }
        },
        BtnHimt:{ //add by  sking for put card button
            _run: function () {
                this.visible = false;
                if (MjClient.data.sData.tData.areaSelectMode.mustPut)// MjClient.data.sData.tData.areaSelectMode.mustPut)
                {
                    if (MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ || 
                        MjClient.getAppType() == MjClient.APP_TYPE.QXLYQP)
                    {
                        // 邵阳、耒阳特殊处理
                        if(isIPhoneX())
                            setWgtLayout(this,[0.15, 0.14], [0.52, 0.48], [-0.8, 0.26]);
                        else
                            setWgtLayout(this,[0.15, 0.14], [0.52, 0.41], [-0.8, 0.26]);
                    }
                    else
                    {
                        if(isIPhoneX())
                            setWgtLayout(this,[0.15, 0.14], [0.52, 0.43], [-0.8, 0.26]);
                        else
                            setWgtLayout(this,[0.15, 0.14], [0.52, 0.36], [-0.8, 0.26]);
                    }
                }
                else
                {
                    if (MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ || 
                        MjClient.getAppType() == MjClient.APP_TYPE.QXLYQP)
                    {
                        // 邵阳、耒阳特殊处理
                        if(isIPhoneX())
                            setWgtLayout(this,[0.15, 0.14], [0.52, 0.48], [0, 0.26]);
                        else
                            setWgtLayout(this,[0.15, 0.14], [0.52, 0.41], [0, 0.26]);
                    }
                    else
                    {
                        if(isIPhoneX())
                            setWgtLayout(this,[0.15, 0.14], [0.52, 0.43], [0, 0.26]);
                        else
                            setWgtLayout(this,[0.15, 0.14], [0.52, 0.36], [0, 0.26]);
                    }
                }
                // setWgtLayout(this,[0.135, 0.128], [0.5, 0.36], [-1.3, 0.26]);
            },
            _click: function(btn) {
                if(putOutCardTips() == 0 && cc.sys.isObjectValid(MjClient.playui) && MjClient.playui._btnHimt.visible)
                {
                    PKPassConfirmToServer_card({cmd: "PKPass", Opt : 3 /*点提示过*/});
                   	MjClient.playui.recoverCannotOutCard();
                }
                playEffect("guandan/tishi");
            },
            _event:{
                //拿到一张牌的时候，出牌按钮亮起，其他状态隐藏，by sking
                mjhand: function() {
                    var tData = MjClient.data.sData.tData;
                    if(!IsTurnToMe() || tData.tState != TableState.waitPut)
                    {
                        this.visible = false;
                    }
                    else
                    {
                        this.visible = true;
                    }
                },
                newCard: function(eD)
                {
                    //cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>newCard by sking");
                    this.visible = true;
                    //setWgtLayout(this, [0.1, 0.1],[0.7, 0.2],[0, 0]);
                },
                PKPut: function(eD) {
                    //cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>PKPut by sking");
                    this.visible = false;
                },
                waitPut: function() {
                    var tData = MjClient.data.sData.tData;
                    if(!IsTurnToMe() || tData.tState != TableState.waitPut || MjClient.playui.isFaPai)
                    {
                        this.visible = false;
                    }
                    else
                    {
                        this.visible = true;
                    }
                },
                initSceneData: function()
                {
                    var tData = MjClient.data.sData.tData;
                    if(!IsTurnToMe() || tData.tState != TableState.waitPut || MjClient.playui.isFaPai)
                    {
                        this.visible = false;
                    }
                    else
                    {
                        this.visible = true;
                    }
                },
                PostCardsEnded: function()
                {
                    var tData = MjClient.data.sData.tData;
                    if(IsTurnToMe() && tData.tState == TableState.waitPut && !MjClient.playui.isFaPai)
                    {
                        this.visible = true;
                    }
                }
            }
        },//end of add by sking
        BtnReady: {
            _visible: true,
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
                },
                mjhand: function() {
                    this.visible = false;
                },
                initSceneData: function() {
                    this.visible = false;
                    var tData = MjClient.data.sData.tData;
                    var pl = getUIPlayer(0);
                    this.visible = tData.roundNum == tData.roundAll && tData.tState == TableState.waitReady && pl.mjState == TableState.waitReady && !IsInviteVisible();
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
        BtnNoPut:{
            _run: function () {
                this.visible = false;

                if (MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ || 
                    MjClient.getAppType() == MjClient.APP_TYPE.QXLYQP)
                {
                    // 耒阳特殊处理
                    if(isIPhoneX())
                        setWgtLayout(this,[0.15, 0.14], [0.525, 0.48], [-1.3, 0.26]);
                    else
                        setWgtLayout(this,[0.15, 0.14], [0.525, 0.41], [-1.3, 0.26]);
                }
                else
                {
                    if(isIPhoneX())
                        setWgtLayout(this,[0.15, 0.14], [0.525, 0.43], [-1.3, 0.26]);
                    else
                        setWgtLayout(this,[0.15, 0.14], [0.525, 0.36], [-1.3, 0.26]);
                }
            },
            _click: function(btn) {
                PKPassConfirmToServer_card({cmd: "PKPass", Opt : 2 /*点不出过*/});
                MjClient.playui.recoverCannotOutCard();
                btn.visible = false;
            },
            _event:{
                // 不出按钮 可以过牌的时候亮
                mjhand: function() {
                    var tData = MjClient.data.sData.tData;
                    this.visible = IsTurnToMe() && tData.tState == TableState.waitPut && 
                    !tData.areaSelectMode.mustPut && !MjClient.playui.isFaPai;
                },
                PKPut: function(eD) {
                    this.visible = false;
                },
                waitPut: function() {
                    var tData = MjClient.data.sData.tData;
                    this.visible = IsTurnToMe() && tData.tState == TableState.waitPut && 
                    !tData.areaSelectMode.mustPut && !MjClient.playui.isFaPai;
                },
                initSceneData: function()
                {
                    var tData = MjClient.data.sData.tData;
                    this.visible = IsTurnToMe() && tData.tState == TableState.waitPut && 
                    !tData.areaSelectMode.mustPut && !MjClient.playui.isFaPai;
                },
                PostCardsEnded: function()
                {
                    var tData = MjClient.data.sData.tData;
                    this.visible = IsTurnToMe() && tData.tState == TableState.waitPut && 
                    !tData.areaSelectMode.mustPut && !MjClient.playui.isFaPai;
                }
            }
        },
        BtnPutCard:{
            _run: function () {
                this.visible = false;
                if (MjClient.data.sData.tData.areaSelectMode.mustPut)
                {
                    if (MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ || 
                        MjClient.getAppType() == MjClient.APP_TYPE.QXLYQP)
                    {
                        // 邵阳、耒阳特殊处理
                        if(isIPhoneX())
                            setWgtLayout(this,[0.15, 0.14], [0.5, 0.48], [0.8, 0.32]);
                        else
                            setWgtLayout(this,[0.15, 0.14], [0.5, 0.41], [0.8, 0.32]);
                    }
                    else
                    {
                        if(isIPhoneX())
                            setWgtLayout(this,[0.15, 0.14], [0.5, 0.43], [0.8, 0.32]);
                        else
                            setWgtLayout(this,[0.15, 0.14], [0.5, 0.36], [0.8, 0.32]);
                    }
                }          
                else
                {
                    if (MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ || 
                        MjClient.getAppType() == MjClient.APP_TYPE.QXLYQP)
                    {
                        // 邵阳、耒阳特殊处理
                        if(isIPhoneX())
                            setWgtLayout(this,[0.15, 0.14], [0.515, 0.48], [1.3, 0.32]);
                        else
                            setWgtLayout(this,[0.15, 0.14], [0.515, 0.41], [1.3, 0.32]); 
                    }
                    else
                    {
                        if(isIPhoneX())
                            setWgtLayout(this,[0.15, 0.14], [0.515, 0.43], [1.3, 0.32]);
                        else
                            setWgtLayout(this,[0.15, 0.14], [0.515, 0.36], [1.3, 0.32]); 
                    }
                }
                    
            },
            _click: function(btn) {
                //cc.log("BtnPutCard");
				cardsSort_PaoDeKuaiYZTY(MjClient.selectCards_card);
                PutOutCard_card(); //可以出牌
                // MjClient.playui.recoverCannotOutCard();
                btn.visible = false;
            },
            _event:{
                //拿到一张牌的时候，出牌按钮亮起，其他状态隐藏，by sking
                mjhand: function() {
                    //cc.log("============mjhand=========== btnPutCard");
                    var tData = MjClient.data.sData.tData;
                    if(!IsTurnToMe() || tData.tState != TableState.waitPut)
                    {
                        this.visible = false;
                    }
                    else
                    {
                        this.visible = true;
                    }
                },
                newCard: function(eD)
                {
                    //cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>newCard by sking");
                    this.visible = true;
                    //setWgtLayout(this, [0.1, 0.1],[0.7, 0.2],[0, 0]);
                },
                PKPut: function(eD) {
                    //cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>PKPut by sking");
                    this.visible = false;
                    MjClient.playui.recoverCannotOutCard();
                },

                waitPut: function() {
                    var tData = MjClient.data.sData.tData;
                    if(!IsTurnToMe() || tData.tState != TableState.waitPut || MjClient.playui.isFaPai)
                    {
                        this.visible = false;
                    }
                    else
                    {
                        this.visible = true;
                    }
                },
                initSceneData: function()
                {
                    var tData = MjClient.data.sData.tData;
                    if(!IsTurnToMe() || tData.tState != TableState.waitPut || MjClient.playui.isFaPai)
                    {
                        this.visible = false;
                    }
                    else
                    {
                        this.visible = true;
                    }
                },
                PostCardsEnded: function()
                {
                    var tData = MjClient.data.sData.tData;
                    if(IsTurnToMe() && tData.tState == TableState.waitPut && !MjClient.playui.isFaPai)
                    {
                        this.visible = true;
                    }
                }
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
                setWgtLayout(this,[0.39, 0], [0.5, 0.1], [0, 0]);
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
                waitPut:function(eD){
                    var tData = MjClient.data.sData.tData;
                    if (tData.roundNum == tData.roundAll && tData.lastPutPlayer == -1) {
                        setWgtLayout(this,[0.036, 0], [0.5, 0.75], [0, 0]);
                        MjClient.playui.shwoFlyCardAnim(this);
                    }
                }
            }
        },
        down: {
            head: {
                countDownBg:{//托管倒计时
                    _run:function () {
                        this.visible = false;
                        this.getChildByName("TG_CountDown").ignoreContentAdaptWithSize(true);
                    },
                    _event:{
                        trustTip:function (msg) {
                            setTuoGuanCountDown(msg,this,0);
                        },
                        PKPut:function (msg) {
                            this.visible = false;
                        },
                        roundEnd:function()
                        {
                            this.visible = false;
                        }
                    }
                },
                tuoguan: {
                    _run:function () {
                        this.visible = false;
                    },
                    _event:{
                        beTrust:function (msg) {
                            if(getUIPlayer(0)&&getUIPlayer(0).info.uid == msg.uid){
                                this.visible = true;
                            }
                        },
                        cancelTrust:function (msg) {
                            if(getUIPlayer(0)&&getUIPlayer(0).info.uid == msg.uid){
                                this.visible = false;
                            }
                        } ,
                        initSceneData:function (msg) {
                            var pl = getUIPlayer(0);
                            if(pl && pl.trust){
                                this.visible = true;
                            }else {
                                this.visible = false;
                            }
                        },
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
                _click: function(btn) {
                    showPlayerInfo(0, btn);
                },
                jiaZhu: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        clearCardUI: function(eD) {
                            this.visible = false;
                        }
                    }
                },
                _event: {
                    loadWxHead: function(d) {
                        setWxHead(this, d, 0);
                    },
                    addPlayer: function(eD) {
                        showFangzhuTagIcon(this,0);
                    },
                    removePlayer: function(eD) {
                        showFangzhuTagIcon(this,0);
                    }

                },
                _run: function () {
                    //this.zIndex = 600;
                    showFangzhuTagIcon(this,0);

                    var head_bottom = this.getChildByName("head_bottom");
                    if (head_bottom) {
                        head_bottom.visible = false;
                    }
                    var icon_bottom = this.getChildByName("icon_bottom");
                    if (icon_bottom) {
                        icon_bottom.visible = false;
                    }
                    var name_bottom = this.getChildByName("name_bottom");
                    if (name_bottom) {
                        name_bottom.visible = false;
                    }
                        
                },
                score_bg:{_visible:false},
                name_bg:{_visible:false},
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
                    [0, -1.5]
                ],
                _run: function() {
                    if(MjClient.getAppType() == MjClient.APP_TYPE.QXXXGHZ) {
                        setWgtLayout(this, [0.07, 0.07], [0.1, 0.5], [0, 0]);
                        //湘乡告胡子APP添加ipad适配
                        if(isIpadSize()){
                            setWgtLayout(this, [0.07, 0.07], [0.13, 0.5], [0, 0]);
                        }
                    } else {
                        setWgtLayout(this, [0.07, 0.07],[0.5, 0.5], [0, -1.5]);
                    }
                    GetReadyVisible(this, 0);
                    //this.visible = true;
                },
                _event: {
                    showPlayerShuffleView:function () {
                        GetReadyVisible(this, -1);
                    },
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
                    [0, 0.55]
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
                    setWgtLayout(this,[0.052, 0],[0.5, 0.06],[0, 3.3]);
                },
                _visible: false
            },
            noPutTag: {
                _run:function()
                {
					this.setScale(MjClient.size.width/1280);
                    this.setPosition(MjClient.playui._downNode.getChildByName("deskCard").getPosition());
                },
                _event:{
                  PKPass:function(eD)
                  {
                      cc.log("=====PKPASS=========" + JSON.stringify(eD));
                      var UIoff = getUiOffByUid(eD.uid);
                      if(UIoff == 0)
                      {
                          DealPKPass_card(UIoff);
                      }
                  }
                },
                _visible: false
            },
            _event: {
                clearCardUI: function() {
                    clearCardUI_card(this, 0);
                },
                initSceneData: function(eD) {
                    SetUserVisible_PaoDeKuaiYZTY(this, 0);
                    reConnectShowDeskCard();
                    delete MjClient.playui.isFaPai;
                    MjClient.playui.CardLayoutRestore(this, 0);
                },
                addPlayer: function(eD) {
                    SetUserVisible_PaoDeKuaiYZTY(this, 0);
                },
                removePlayer: function(eD) {
                    SetUserVisible_PaoDeKuaiYZTY(this, 0);
                },
                mjhand: function(eD) {
                    InitUserHandUI_PaoDeKuaiYZTY(this, 0);
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
                        showPostCardAnimation();
                    } 

                    MjClient.playui.isWaitAniEnd = true;
                },
                roundEnd: function() {
                    InitUserCoinAndName(this, 0);
                    //setTaiInfo("");
                },
                updateInfo:function (d) {
                    if(MjClient.data.sData.tData.fieldId && d && d.gold){
                        InitUserCoinAndName(this,0);
                    }
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

                    //掼蛋不需要发牌
                    //DealNewCard(this,eD.newCard,0);// checkCanTing(eD);
                },
                PKPut: function(eD) {
                    //cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>PKPut---------------");
                    var pl = getUIPlayer(0);
                    if(pl && pl.trust || eD.uid != SelfUid() ||  MjClient.rePlayVideo != -1)
                        DealMJPut_card(this,eD, 0);

                    // var pl = getUIPlayer(0);
                    // cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>PKPut---------------" + pl.isTing);
                    // if (eD.uid == SelfUid() && pl.isTing)
                    // {
                    //     var _tingCards = this.getChildByName("tingCardsNode");
                    //     var tingSet = calTingSet(pl.mjhand, MjClient.data.sData.tData.hunCard);
                    //     setTingCards(_tingCards,tingSet);
                    // }

                    correctPKPut(eD, 0);
                },
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
                PostCardsEnded: function()
                {
                    // 发牌完毕处理正常牌逻辑
                    if(!MjClient.playui.isFaPai && 
                        MjClient.data.sData.tData.tState == TableState.waitPut && 
                        MjClient.playui.isWaitAniEnd)
                    {
                        delete MjClient.playui.isWaitAniEnd;
                        
                        DealWaitPut_card(this, null, 0);
                        UpdataCurrentPutCard();
                        // 跑得快 自动出牌
                        if (IsTurnToMe()) {
                            // 如果提示只有一手牌， 自动提起
                            // 如果提示只有一手牌， 且是我全部的手牌数量， 自动打出
                            AutoPutLastCard_card_ty();
                        }
                    }
                },
                onlinePlayer: function(eD) {
                    setUserOffline(this, 0);
                },
                playerStatusChange: function(eD) {
                    setUserOffline(this, 0);
                },
                waitJiazhu: function(msg) {
                    var tData = MjClient.data.sData.tData;
                    var layer = new JiaZhu_PaodekuaiTY(tData.areaSelectMode.piaofen,function(){
                        //弹窗等待
                        MjClient.playui._jiazhuWait.visible = true;
                    });
                    layer.setName("JiaZhu");
                    cc.log("_jiazhuWait===================2222");
                    //MjClient.playui.addChild(layer, 99);
                    MjClient.playui.getChildByName("playUINode").addChild(layer, 99);
                }
            }
        },
        right: {

            head: {
                countDownBg:{//托管倒计时
                    _run:function () {
                        this.visible = false;
                        this.getChildByName("TG_CountDown").ignoreContentAdaptWithSize(true);
                    },
                    _event:{
                        trustTip:function (msg) {
                            setTuoGuanCountDown(msg,this,1);
                        },
                        PKPut:function (msg) {
                            this.visible = false;
                        },
                        roundEnd:function()
                        {
                            this.visible = false;
                        }
                    }
                },
                tuoguan: {
                    _run:function () {
                        this.visible = false;
                    },
                    _event:{
                        beTrust:function (msg) {
                            if(getUIPlayer(1)&&getUIPlayer(1).info.uid == msg.uid){
                                this.visible = true;
                            }
                        },
                        cancelTrust:function (msg) {
                            if(getUIPlayer(1)&&getUIPlayer(1).info.uid == msg.uid){
                                this.visible = false;
                            }
                        },
                        initSceneData:function (msg) {
                            var pl = getUIPlayer(1);
                            if(pl && pl.trust){
                                this.visible = true;
                            }else {
                                this.visible = false;
                            }
                        },
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
                    showPlayerInfo(1, btn);
                },
                jiaZhu: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        clearCardUI: function(eD) {
                            this.visible = false;
                        }
                    }
                },
                _event: {
                    loadWxHead: function(d) {
                        setWxHead(this, d, 1);
                    },
                    addPlayer: function(eD) {
                        showFangzhuTagIcon(this,1);
                    },
                    removePlayer: function(eD) {
                        showFangzhuTagIcon(this,1);
                    }
                },
                _run: function () {
                    // this.zIndex = 600;
                    showFangzhuTagIcon(this,1);

                    var head_bottom = this.getChildByName("head_bottom");
                    if (head_bottom) {
                        head_bottom.visible = false;
                    }
                    var icon_bottom = this.getChildByName("icon_bottom");
                    if (icon_bottom) {
                        icon_bottom.visible = false;
                    } 
                    var name_bottom = this.getChildByName("name_bottom");
                    if (name_bottom) {
                        name_bottom.visible = false;
                    }
                        
                },
                score_bg:{_visible:false},
                name_bg:{_visible:false},
                tingCard:{
                    _run: function () {
                        var tData = MjClient.data.sData.tData;
                        if(tData.fieldId) this.y = -10;
                        else if (isIPhoneX() && MjClient.rePlayVideo != -1)
                            this.setPositionX(-24);
                    },
                    _visible:false,
                    _event:{
                        initSceneData: function(eD)
                        {
                            var pl = getUIPlayer(1);
                            if(pl && pl.handCount)
                            {
                                this.visible = true;
                            }
                            else
                            {
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
                    [0.5, 0.5],
                    [2, 0]
                ],
                _run: function() {
                    if(MjClient.getAppType() == MjClient.APP_TYPE.QXXXGHZ) {
                        setWgtLayout(this, [0.07, 0.07], [0.9, 0.8], [0, 0]);
                        //湘乡告胡子APP添加ipad适配
                        if(isIpadSize()){
                            setWgtLayout(this, [0.07, 0.07], [0.865, 0.8], [0, 0]);
                        }
                    } else {
                        setWgtLayout(this, [0.07, 0.07],[0.5, 0.5], [2, 0]);
                    }
                    GetReadyVisible(this, 1);
                },
                _event: {
                    showPlayerShuffleView:function () {
                        GetReadyVisible(this, -1);
                    },
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
                _run: function() {
                    if (isIPhoneX() && !MjClient.data.sData.tData.fieldId)
                        setWgtLayout(this,[0, 0.13],[1, 1],[-2.1, 0]);
                    else
                        setWgtLayout(this,[0, 0.13],[1, 1],[-2.5, 0]);

                    this.visible = false;
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
                _visible: false
            },
            noPutTag: {
                _run:function()
                {
                    var tData = MjClient.data.sData.tData;
                    var pos = MjClient.playui._rightNode.getChildByName("deskCard").getPosition();
                    if (tData.fieldId)pos.y -= 20;
                    this.setScale(MjClient.size.width/1280);
                    this.setPosition(pos);
                },
                _event:{
                    PKPass:function(eD)
                    {
                        var UIoff = getUiOffByUid(eD.uid);
                        if(UIoff == 1)
                        {
                            DealPKPass_card(UIoff);
                        }
                    }
                },
                _visible: false
            },
            _event: {
                clearCardUI: function() {
                    clearCardUI_card(this, 1);
                },
                initSceneData: function(eD) {
                    SetUserVisible_PaoDeKuaiYZTY(this, 1);
                },
                addPlayer: function(eD) {
                    SetUserVisible_PaoDeKuaiYZTY(this, 1);
                },
                removePlayer: function(eD) {
                    SetUserVisible_PaoDeKuaiYZTY(this, 1);
                },
                mjhand: function(eD) {
                    InitUserHandUI_PaoDeKuaiYZTY(this, 1);
                },
                roundEnd: function() {
                    InitUserCoinAndName(this, 1);
                },
                waitPut: function(eD) {
                    DealWaitPut_card(this, eD, 1);
                },
                PKPut: function(eD) {
                    DealMJPut_card(this, eD, 1);
                    if(eD.uid != SelfUid())
                    {

                    }
                },
                onlinePlayer: function(eD) {
                    setUserOffline(this, 1);
                },
                playerStatusChange: function(eD) {
                    setUserOffline(this, 1);
                }
            }
        },
        top: {
            _run:function() {
                this.visible = MjClient.MaxPlayerNum >= 3;
            },
            head: {
                countDownBg:{//托管倒计时
                    _run:function () {
                        this.visible = false;
                        this.getChildByName("TG_CountDown").ignoreContentAdaptWithSize(true);
                    },
                    _event:{
                        trustTip:function (msg) {
                            setTuoGuanCountDown(msg,this,2);
                        },
                        PKPut:function (msg) {
                            this.visible = false;
                        },
                        roundEnd:function()
                        {
                            this.visible = false;
                        }
                    }
                },
                tuoguan: {
                    _run:function () {
                        this.visible = false;
                    },
                    _event:{
                        beTrust:function (msg) {
                            if(getUIPlayer(2)&&getUIPlayer(2).info.uid == msg.uid){
                                this.visible = true;
                            }
                        },
                        cancelTrust:function (msg) {
                            if(getUIPlayer(2)&&getUIPlayer(2).info.uid == msg.uid){
                                this.visible = false;
                            }
                        },
                        initSceneData:function (msg) {
                            var pl = getUIPlayer(2);
                            if(pl && pl.trust){
                                this.visible = true;
                            }else {
                                this.visible = false;
                            }
                        },

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
                                showUserChat(this, 2, msg);
                            },
                            playVoice: function(voicePath) {
                                MjClient.data._tempMessage.msg = voicePath;
                                showUserChat(this, 2, MjClient.data._tempMessage);
                            }
                        }
                    }
                },
                _click: function(btn) {
                    showPlayerInfo(2, btn);
                },
                jiaZhu: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        clearCardUI: function(eD) {
                            this.visible = false;
                        }
                    }
                },
                _event: {
                    loadWxHead: function(d) {
                        setWxHead(this, d, 2);
                    },
                    addPlayer: function(eD) {
                        showFangzhuTagIcon(this,2);
                    },
                    removePlayer: function(eD) {
                        showFangzhuTagIcon(this,2);
                    }
                },
                _run: function () {
                    // this.zIndex = 600;
                    showFangzhuTagIcon(this,2);

                    var head_bottom = this.getChildByName("head_bottom");
                    if (head_bottom) {
                        head_bottom.visible = false;
                    }
                    var icon_bottom = this.getChildByName("icon_bottom");
                    if (icon_bottom) {
                        icon_bottom.visible = false;
                    } 
                    var name_bottom = this.getChildByName("name_bottom");
                    if (name_bottom) {
                        name_bottom.visible = false;
                    }
                },
                score_bg:{_visible:false},
                name_bg:{_visible:false},
                tingCard:{
                    _run: function () {
                        var tData = MjClient.data.sData.tData;
                        if(tData.fieldId) this.y = -10;
                        else if (isIPhoneX() && MjClient.rePlayVideo != -1)
                            this.setPositionX(151);
                    },
                    _visible:false,
                    _event:{
                        initSceneData: function(eD)
                        {
                            var pl = getUIPlayer(2);
                            if(pl && pl.handCount)
                            {
                                this.visible = true;
                            }
                            else
                            {
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
                        }
                    }
                },
            },
            play_tips: {
                _layout: [[0.08, 0.14], [0.25, 0.5], [0, 0.5]],
                _run: function () {
                    this.zIndex = actionZindex;
                },
                _visible:false,
            },
            ready: {
                _layout: [
                    [0.07, 0.07],
                    [0.5, 0.5],
                    [-2, 0]
                ],
                _run: function() {
                    if(MjClient.getAppType() == MjClient.APP_TYPE.QXXXGHZ) {
                        setWgtLayout(this, [0.07, 0.07], [0.1, 0.8], [0, 0]);
                        //湘乡告胡子APP添加ipad适配
                        if(isIpadSize()){
                            setWgtLayout(this, [0.07, 0.07], [0.13, 0.8], [0, 0]);
                        }
                    } else {
                        setWgtLayout(this, [0.07, 0.07],[0.5, 0.5], [-2, 0]);
                    }
                    GetReadyVisible(this, 2);
                },
                _event: {
                    showPlayerShuffleView:function () {
                        GetReadyVisible(this, -1);
                    },
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
                _run: function() {
                    if (isIPhoneX() && !MjClient.data.sData.tData.fieldId)
                        setWgtLayout(this,[0, 0.13],[0, 1],[2.76, 0]);
                    else
                        setWgtLayout(this,[0, 0.13],[0, 1],[2.5, 0]);

                    this.visible = false;
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
                        setWgtLayout(this,[0.052, 0],[0.16, 0.65],[1.8, 0.5]);
                    else
                        setWgtLayout(this,[0.052, 0],[0.16, 0.65],[1.2, 0.5]);
                },
                _visible: false,
            },
            noPutTag: {
                _run:function()
                {
                    var tData = MjClient.data.sData.tData;
                    var pos = MjClient.playui._topNode.getChildByName("deskCard").getPosition();
                    if (tData.fieldId)pos.y -= 20;
                    this.setScale(MjClient.size.width/1280);
                    this.setPosition(pos);
                },
                _event:{
                    PKPass:function(eD)
                    {
                        var UIoff = getUiOffByUid(eD.uid);
                        if(UIoff == 2)
                        {
                            DealPKPass_card(UIoff);
                        }
                    }
                },
                _visible: false
            },
            _event: {
                clearCardUI: function() {
                    clearCardUI_card(this, 2);
                },
                initSceneData: function(eD) {
                    SetUserVisible_PaoDeKuaiYZTY(this, 2);
                },
                addPlayer: function(eD) {
                    SetUserVisible_PaoDeKuaiYZTY(this, 2);
                },
                removePlayer: function(eD) {
                    SetUserVisible_PaoDeKuaiYZTY(this, 2);
                },
                mjhand: function(eD) {
                    InitUserHandUI_PaoDeKuaiYZTY(this, 2);
                },
                roundEnd: function() {
                    InitUserCoinAndName(this, 2);
                },
                waitPut: function(eD) {
                    DealWaitPut_card(this, eD, 2);
                },
                PKPut: function(eD) {
                    DealMJPut_card(this, eD, 2);
                },
                onlinePlayer: function(eD) {
                    setUserOffline(this, 2);
                },
                playerStatusChange: function(eD) {
                    setUserOffline(this, 2);
                },
                MJFlower: function(eD) {
                    HandleMJFlower(this, eD, 2);
                },
                MJTing: function (eD) {
                    HandleMJTing(this, eD, 2);
                }
            }
        },
        left: {
        },
        chat_btn: {
            _run: function() {
                if(isIPhoneX()) {
                    if (MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ || 
                        MjClient.getAppType() == MjClient.APP_TYPE.QXLYQP)
                        // 邵阳、耒阳特殊处理
                        setWgtLayout(this, [0.05, 0.05], [0.965, 0.31], [0, 3.5]);
                    else
                        setWgtLayout(this, [0.05, 0.05], [0.965, 0.23], [0, 3.5]);
                } else {
                    if (MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ || 
                        MjClient.getAppType() == MjClient.APP_TYPE.QXLYQP)
                        // 邵阳、耒阳特殊处理
                        setWgtLayout(this, [0.05, 0.05], [0.965, 0.23], [0, 3.7]);
                    else
                        setWgtLayout(this, [0.05, 0.05], [0.965, 0.23], [0, 3.5]);
                }
            },
            _click: function() {
                var chatlayer = new ChatLayer();
                MjClient.Scene.addChild(chatlayer);
            }
        },
        voice_btn: {
            _run: function() {
                if(isIPhoneX() && (MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || 
                    MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ || MjClient.getAppType() == MjClient.APP_TYPE.QXLYQP)) {
                    // IphoneX设备，邵阳、耒阳特殊处理
                    setWgtLayout(this, [0.08, 0.08], [0.965, 0.31], [0, 3.5]);
                } else {
                    setWgtLayout(this, [0.08, 0.08], [0.965, 0.25], [0, 3.5]);
                }

                initVoiceData();
                cc.eventManager.addListener(getTouchListener(), this);
                if(MjClient.isShenhe) this.visible=false;
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
                }
            }
        },
        btn_rank: {
            _layout: [
                [0.1, 0.1],
                [0.95, 0],
                [0, 3]
            ],
            _run: function() {
                this.opacity = 255;
                this.visible = false;
            },
        },
        bg_sort: {
            _layout: [
                [0.5, 0.5],
                [0.5, 0],
                [0, 0]
            ],
            _run: function() {
                this.visible = false;
            },
        },
        btn_sortClass: {
            _layout: [
                [0.14, 0.14],
                [0.78, 0.92],
                [0, 0]
            ],
            _run: function() {
                this.visible = false;
            },
        },
        block_tuoguan:{
            _layout:[
                [1, 1],
                [0.5, 0.5],
                [0, 0],
                true
            ],
            _run: function() {
                this.visible = false;
                this.zIndex = 500;
            },
            btn_tuoguan:{
                _touch:function (btn, eT) {
                    if (eT == 2) {
                        MjClient.gamenet.request("pkroom.handler.tableMsg", {cmd: "cancelTrust"},function (rtn) {
                            btn.getParent().setVisible(false);
                        });
                    }
                }
            },
            Text_1:{
                _run: function() {
                    this.ignoreContentAdaptWithSize(true);
                },
            },
            _event:{
                beTrust:function (msg) {
                    cc.log("wxd........beTrust......."+JSON.stringify(msg));
                    if(getUIPlayer(0)&&getUIPlayer(0).info.uid == msg.uid){
                        if(MjClient.movingCard){
                            MjClient.movingCard.setTouchEnabled(false);
                            MjClient.movingCard.setScale(cardBeginScale);
                            MjClient.movingCard.setTouchEnabled(true);
                        }
                        this.visible = true;
                    }
                },
                cancelTrust:function (msg) {
                    if(getUIPlayer(0)&&getUIPlayer(0).info.uid == msg.uid) {
                        this.visible = false;
                    }
                },
                initSceneData:function (msg) {
                    var pl = getUIPlayer(0);
                    if(pl.trust){
                        this.visible = true;
                    }else {
                        this.visible = false;
                    }
                },
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
        var playui = ccs.load("Play_PaoDeKuaiTY.json");

        this.srcMaxPlayerNum = MjClient.MaxPlayerNum;
        MjClient.MaxPlayerNum = parseInt(MjClient.data.sData.tData.maxPlayer);

        playMusic("bgFight_paodekuai");
        this._downNode  = playui.node.getChildByName("down");
        this._rightNode = playui.node.getChildByName("right");
        this._topNode   = playui.node.getChildByName("top");
        this._leftNode  = playui.node.getChildByName("left");
        this._tingCardsNode = this._downNode.getChildByName("tingCardsNode");
        this._tingCardNumNode = this._downNode.getChildByName("tingCardNumNode");

        this._positionCard = playui.node.getChildByName("positionCard");
        this._btnPutCard   = playui.node.getChildByName("BtnPutCard");
        this._btnHimt      = playui.node.getChildByName("BtnHimt");
        this._btnNoPut     = playui.node.getChildByName("BtnNoPut");
        this._noPutTips    = playui.node.getChildByName("noPutTips");
        this._btn_rank     = playui.node.getChildByName("btn_rank");
        this._bg_sort    = playui.node.getChildByName("bg_sort");
        MjClient.playui = this;
        MjClient.playui._AniNode =  playui.node.getChildByName("eat");
        MjClient.playui._clock = playui.node.getChildByName("clock");
        this.sortType     = MjClient.sortType.normal;
        this.nextSortType = MjClient.sortType.count;

        this._spriteSingle = playui.node.getChildByName("sprite_single");

        MjClient.sortClassType = 0;//util.localStorageEncrypt.getNumberItem(MjClient.sortClassKey,MjClient.sortClassType);
        MjClient.playui.sortType = MjClient.sortType.normal;

        if(MjClient.rePlayVideo != -1)// 表示回放
        {
            MjClient.sortClassType = 0;
            MjClient.playui.sortType = MjClient.sortType.normal;
        }


        this.addChild(playui.node,0,"playUINode");
        BindUiAndLogic(playui.node, this.jsBind);
        

        //this._back  = playui.node.getChildByName("back");

        //触摸事件监听注册
        cc.eventManager.addListener(cc.EventListener.create(getTouchListener_card()),this._rightNode);

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
        addClub_BackHallBtn("backHomebtn","left","delroom");

        // 回看
        if(MjClient.rePlayVideo == -1 && !MjClient.data.sData.tData.fieldId){
            this._viewLookBack = COMMON_UI.createPokerLookbackView()
            playui.node.addChild(this._viewLookBack);
            this._viewLookBack.setPosition(MjClient.size.width / 2,MjClient.size.height / 2);
            this._viewLookBack.setContentSize(MjClient.size.width, MjClient.size.height);

            if (MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ || 
                MjClient.getAppType() == MjClient.APP_TYPE.QXLYQP) {
                // 耒阳向上偏移
                var btnLookBack = this._viewLookBack.getChildByName("btnLookBack");
                btnLookBack.setPositionY(btnLookBack.getPositionY() + (isIPhoneX() ? 17 : 5) * 720/MjClient.size.height);
            }
        }

        // 切牌
        if(MjClient.rePlayVideo == -1){
            this._viewPlayerShuffle = COMMON_UI.createPokerPlayerShuffleView()
            playui.node.addChild(this._viewPlayerShuffle);
            this._viewPlayerShuffle.setPosition(MjClient.size.width / 2,MjClient.size.height / 2);
            this._viewPlayerShuffle.setContentSize(MjClient.size.width, MjClient.size.height);
        }
        this.initFieldIdUI(playui.node)

        if (this.isInField())
            MjClient.playui.createJiPaiQiPanel();

        this.shuffleList = [];  //洗牌玩家

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

// add...................   Greene
//初始化桌子上的客户端数据c_data..各个游戏的自身数据可以在这里初始，
//尽量不要在外部公共代码判断游戏类型，而是在c_data里初始化数据。
//在PlayLayer的_event 的 initSceneData调用
PlayLayer_PaoDeKuaiYZTY.prototype.InitC_Data = function() {
    if (!MjClient.data.c_Data)
        MjClient.data.c_Data = {};

    var bret = MjClient.data.sData.tData.areaSelectMode.playSpeed == undefined ? false : true;
    //出牌是否动画(如果没有速度定义，就用出牌复杂动画)
    bret = bret? (MjClient.data.sData.tData.areaSelectMode.playSpeed != 0) : true;
    MjClient.data.c_Data.bPutCardAnim = bret;

    bret = MjClient.data.sData.tData.areaSelectMode.playSpeed == undefined ? false : true;
    //牌型动画是否是文字图片(如果没有速度定义，就不用简单的文字动画)
    bret = bret? (MjClient.data.sData.tData.areaSelectMode.playSpeed == 0) : false;
    MjClient.data.c_Data.bTxtAnim = bret;
}

PlayLayer_PaoDeKuaiYZTY.prototype.cannotOutCardGrey = function()
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

PlayLayer_PaoDeKuaiYZTY.prototype.recoverCannotOutCard = function()
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

PlayLayer_PaoDeKuaiYZTY.prototype.clockNumberUpdate = function(node, endFunc)
{
    return arrowbkNumberUpdate(node, endFunc);
}

PlayLayer_PaoDeKuaiYZTY.prototype.updateClockPosition = function(arrowNode)
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
    if (curPlayerNode != null) {
        var deskCardPos = curPlayerNode.getChildByName("deskCard").getPosition();
        if (!MjClient.data.sData.tData.fieldId)
        {
            if (isIPhoneX() && MjClient.rePlayVideo != -1) {
                deskCardPos.x += 41 * Math.min(MjClient.size.width/1280,MjClient.size.height/720) * (curPlayerIndex == 1 ? 2 : -2);
            } else {
                deskCardPos.y += deskCardPosOffset.y;
                deskCardPos.x += deskCardPosOffset.x; 
            }           
        }
        else{
            deskCardPos.x += 40 * (curPlayerIndex == 2? -1:1);
            deskCardPos.y += 20;
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

    if (curPlayerNode != null && (tData.curPlayer !== tData.lastPutPlayer) )
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
PlayLayer_PaoDeKuaiYZTY.prototype.getGameInfoString = function(param)
{
    var tData = MjClient.data.sData.tData;
    var str = "";

    if (param != "roundInfo")
        str += MjClient.MaxPlayerNum == 3 ? "三人玩," : "两人玩,";
    str += tData.areaSelectMode.cardNumIndex == 0 ? "16张," : "15张,";
    str += tData.areaSelectMode.mustPut ? "" : "非必管,";
    str += tData.areaSelectMode.zhaDanBuChai ? "炸弹不可拆," : "";
    str += tData.areaSelectMode.isAutoTip ? "自动提示," : "";
    var firstOutRuleStr = "";
    switch (tData.areaSelectMode.firstPutRule){
        case 1:{
            firstOutRuleStr = tData.areaSelectMode.isPreRoundFirstRule==true?  "每局先出黑桃3,":"首局先出黑桃3,"
            break;
        }
        case 2:{
            firstOutRuleStr = ""
            break;
        }
        case 3:{
            firstOutRuleStr = tData.areaSelectMode.isPreRoundFirstRule==true?  "每局先出黑桃3,":"首局先出黑桃3,"
            break;
        }
        case 4:{
            firstOutRuleStr = tData.areaSelectMode.isPreRoundFirstRule==true?  "每局随机先手,":"首局随机先手,"
            break;
        }
        default:{
            firstOutRuleStr = ""
            break
        }
    }

    switch (tData.areaSelectMode.piaofen){
        case 1:{ str += "飘123,"; break; }
        case 2:{ str += "飘235,"; break; }
        case 3:{ str += "飘258,"; break; }
        case 4:{ str += "每局飘1,"; break; }
        case 5:{ str += "每局飘2,"; break; }
        default:{ str += ""; break }
    };

    // str += tData.areaSelectMode.firstHeiTao3 ? "首局先出黑桃三," : "";
    str += firstOutRuleStr;
    str += tData.areaSelectMode.can4dai2 ? "四带二," : "";
    str += tData.areaSelectMode.can4dai3 ? "四带三," : "";
    str += tData.areaSelectMode.hongTao10Niao ? "红桃10扎鸟," : "";
    str += tData.areaSelectMode.ht10zhaniaohanzhadan ? "扎鸟含炸弹," : "";
    if (tData.areaSelectMode.zhaniao) {
        if (tData.areaSelectMode.zhaniao == 1)
            str += "红桃9翻倍,";
        else if (tData.areaSelectMode.zhaniao == 2)
            str += "红桃10翻倍,";
        else if (tData.areaSelectMode.zhaniao == 3)
            str += "红桃10飘5分,";
        else if (tData.areaSelectMode.zhaniao == 4)
            str += "红桃10飘10分,";
    }

    str += tData.areaSelectMode.can3aZhaDan ? "3个A算炸弹," : "";
    str += tData.areaSelectMode.can3ge3ZhaDan ? "3个3算炸弹," : "";
    str += tData.areaSelectMode.isPlayerShuffle == 1 ? "手动切牌," : "系统切牌,";

    if (typeof(tData.areaSelectMode.fengDing) == "number") {
        switch (tData.areaSelectMode.fengDing)
        {
            case 1:
                str += "30/32分封顶,";
                break;
            case 2:
                str += "60/64分封顶,";
                break;
        }
    }
    
    if (param != "roundInfo")
    {
        str += tData.areaSelectMode.fangZuoBi ? "防作弊," : "";
        str += tData.areaSelectMode.showCardNumber ? "显示牌数," : "";
        str += tData.areaSelectMode.canPutAnyFeiji ? "飞机可少带接完," : "";
        str += tData.areaSelectMode.canPutAnySanZhang ? "三张可少带接完," : "";
    }

    if(tData.areaSelectMode.fanBei == 1)
    {
        str += "小于" + tData.areaSelectMode.fanBeiScore + "分翻倍,";
    } 
    
    if(tData.areaSelectMode.trustTime > 0)
    {
        str += Math.floor(tData.areaSelectMode.trustTime/60) + "分钟,";
    } 

    if (param != "roundInfo")
    {
        switch (tData.areaSelectMode.payWay)
        {
            case 0:
                str += "房主付";
                break;
            case 1:
                str += "AA付";
                break;
            case 2:
                str += "亲友圈付";
                break;
        }
    }

    if(tData.areaSelectMode.isTrustWhole && tData.areaSelectMode.trustWay >= 0)
    {
        str += ["托管当局,", "托管当局+下一局,", "整场托管,"][tData.areaSelectMode.trustWay] || "";
    } 

    if (str.charAt(str.length - 1) == ",")
        str = str.substring(0, str.length - 1);
        
    if(tData.fieldId)
    {
        str = "";
        str += tData.areaSelectMode.cardNumIndex == 0 ? "16张," : "15张,";
        str += tData.areaSelectMode.paodekuaiTY_difen ? "底分X" + tData.fieldBase + ","  : "";
    }
    return str;
};

PlayLayer_PaoDeKuaiYZTY.prototype.shwoFlyCardAnim = function(flyNode)
{
    var tData = MjClient.data.sData.tData;
    var off = getOffByIndex(tData.curPlayer);
    var playerNode = getNode_cards(off);
    if (!playerNode)
        return;

    if( 4 == tData.areaSelectMode.firstPutRule ) return;    // 2人完 随机先手，可以不出3，不播放黑桃3加入手牌的动画
    
    var pl; //player 信息
    pl = getUIPlayer(off);
    if(!pl || (pl.mjhand && pl.mjhand.indexOf(MjClient.majiang.cardCfg.ht[3]) < 0) )
        return;

    var headNode = playerNode.getChildByName("head");
    var point = headNode.convertToWorldSpace(cc.p(headNode.width/2, headNode.height/2));
    point = flyNode.getParent().convertToNodeSpace(point);
    setCardSprite_card(flyNode, 12, false);
    flyNode.setVisible(false);
    flyNode.setScale(flyNode.getScale() * 1.5);
    flyNode.runAction(cc.sequence(
        cc.delayTime(0.2),
        cc.show(),
        cc.spawn(
            cc.moveTo(1.0, point),
            cc.scaleTo(1.0, flyNode.getScale() / 1.5)),
        cc.callFunc(function () {
            flyNode.setVisible(false);

            if(!MjClient.playui.isFaPai)
            {
                postCardsEnded();
            }
        })));
}

PlayLayer_PaoDeKuaiYZTY.prototype.showHandCardBeiMian = function()
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
        beiMain.setScale(childrens[i].width/beiMain.width, childrens[i].height/beiMain.height);
        beiMain.setPosition(childrens[i].width/2, childrens[i].height/2);
        childrens[i].addChild(beiMain, 111);
    }
}

PlayLayer_PaoDeKuaiYZTY.prototype.hideHandCardBeiMian = function()
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

PlayLayer_PaoDeKuaiYZTY.prototype.CardLayoutRestore = function(node, off, needSort)
{
    cc.log("PlayLayer_PaoDeKuaiYZTY11==============");
    // 如果正在发牌 不排序
    if (MjClient.playui.isFaPai) return;
    cc.log("PlayLayer_PaoDeKuaiYZTY22==============");

    if (cc.isUndefined(needSort))
        needSort = true;

    //先停止手牌的动作，在重排
    StopHandCardAnim(node);

    if(MjClient.sortClassType == 0)
    {
        cc.log("横向排序");
        MjClient.playui.horSort(node, off, needSort);
    }
    else
    {
        cc.log("纵向排序");
        MjClient.playui.verSort(node, off, needSort);
    }
};

//处理金币场牌局结束时布局
PlayLayer_PaoDeKuaiYZTY.prototype.cardLayoutRestore_endfiled = function (off)
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
}

PlayLayer_PaoDeKuaiYZTY.prototype.CardLayoutDesk = function(node,cards,off)
{
    //if(off != 0) return;
    var children = node.children;
    var initDesk_y = node.getChildByName("deskCard").y;
    for(var i = 0; i < children.length; i++)
    {
        var ci = children[i];
        if(ci.name == "out")
            ci.y = initDesk_y;
    }

    var outStand = node.getChildByName("deskCard");
    outStand.visible = false;

    var uiOut = [];
    var uiHun = [];//癞子牌在最左边

    for(var i = 0; i < children.length; i++)
    {
        var ci = children[i];
        if(ci.name != "out")
            continue;

        if(MjClient.data.sData.tData.hunCard == ci.tag)
            uiHun.push(ci);
        else
            uiOut.push(ci);
    }

    if (uiHun.length + uiOut.length == 0)
        return;

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

    sort(uiOut);

    if(uiHun.length > 0) //是否有柰子，有则放在最前面 by sking
    {
        for(var i = 0; i < uiHun.length; i++)
        {
            uiOut.unshift(uiHun[i]); //向数组开头添加一个元素 unshift
        }
    }

    var cards = [];
    for (var i = 0; i < uiOut.length; i ++)
    {
        cards[i] = uiOut[i].tag;
    }

    var outSize = uiOut[0].getSize();
    var outScale = uiOut[0].scale;

    var cardType = MjClient.majiang.cardsType(cards, MjClient.data.sData.tData.areaSelectMode);
    var width = outSize.width * outScale * 0.4;
   
    var x = 0;

    var areaWidth = (uiOut.length - 1) * width + outSize.width * outScale;
    if (cardType == MjClient.majiang.CARDTPYE.sandaiyi || cardType == MjClient.majiang.CARDTPYE.sidaier)
        areaWidth += outSize.width * outScale * 1.05;

    switch (off)
    {
        case 0:
            x = outStand.x - areaWidth/2 + outSize.width * outScale / 2;
            break;
        case 1:
            x = outStand.x - areaWidth + outSize.width * outScale;
            if(MjClient.rePlayVideo == -1)  // 表示正常游戏
            {
                if (uiOut.length >= 7)
                    x += width;
            }
            break;
        case 2:
            x = outStand.x;
            x = outStand.x;
            if(MjClient.rePlayVideo == -1)  // 表示正常游戏
            {
                if (uiOut.length >= 6)
                    x -= width;
            }
            break;
        case 3:
            x = outStand.x;
            break;
    }

    //设置麻将大小
    for(var i = 0; i < uiOut.length; i++)
    {
        uiOut[i].x = x;
        uiOut[i].zIndex = i*2;

        if ((cardType == MjClient.majiang.CARDTPYE.sandaiyi && i == 2) || (cardType == MjClient.majiang.CARDTPYE.sidaier && i == 3))
            x += outSize.width * outScale * 1.05;
        else
            x += width;
    }
    MjClient.initDesk_y = "undefined";
};

//横向摆放《正常》
PlayLayer_PaoDeKuaiYZTY.prototype.horSort = function(node, off, needSort)
{
    var pl; //player 信息
    pl = getUIPlayer(off);//获取玩家信息.off 为0 ，就是自己得信息，能看到自己摸牌 by sking
    if(!pl) return;

    if(MjClient.rePlayVideo != -1)// 表示回放
    {
        MjClient.sortClassType = 0;
        MjClient.playui.sortType = MjClient.sortType.normal;
    }

    var mjhandNum = 0;
    var children = node.children;
    for(var i = 0; i < children.length; i++)
    {
        var ci = children[i];
        if(ci.name == "mjhand")
        {
            mjhandNum++;
            if((typeof MjClient.init_y) == 'undefined')
            {
                MjClient.init_y = ci.y;
            }
            
            var _cardType = ci.getChildByName("cardType");
            var _smallFlower = _cardType && _cardType.getChildByName("smallFlower");
            if(_smallFlower)
            {
                _smallFlower.setPosition(22,35)
            }
        }
    }

    var tempMaJiang = MjClient.majiang; //麻将的各种方法判断，是否可以杠，是否可以吃... by sking

    //up stand 是2种麻将的图。
    var stand = node.getChildByName("stand");
    stand.visible = false;
    var start = stand;

    var upSize = start.getSize();
    var upS = start.scale;
    var uistand = [];
    var uisort = [];
    var uihun = [];//癞子牌在最左边

    for(var i = 0; i < children.length; i++) //children 为 "down" 节点下的字节点
    {
        var ci = children[i];
        if(ci.name == "mjhand")
        {
            if (!ci.cannotOut)
                ci.setColor(cc.color(255,255,255));
            uistand.push(ci);
        }
        else if(ci.name == "mjhand_replay")
        {
            uistand.push(ci);
        }
    }


    /*
     排序方式
     */
    // var pro_rankType = 1;
    // if(off == 0)
    // {
    //     pro_rankType = MjClient.playui.sortType;
    // }

    var pro_rankType = MjClient.playui.sortType;

    if(!pl.mjhand || cc.isUndefined(pl.mjhand))
    {
        return;
    }


    //排除理牌的牌
    var mjhandCopy = pl.mjhand.concat();
    var copyuistand = uistand.concat();
    for(var i = 0;i< MjClient.colloctionCardsUIArray.length;i++) {
        var colloctionUI = []; //重新排序后
        cc.log("--重新排序后--");
        var _colloctionUICards = MjClient.colloctionCardsUIArray[i].concat();
        for(var j = 0;j < _colloctionUICards.length;j++) {
            for (var k = 0; k < copyuistand.length; k++) {
                if (copyuistand[k].tag == _colloctionUICards[j].tag &&
                    copyuistand[k].getUserData() == _colloctionUICards[j].getUserData() ){//这里保存的有可能是我当前选中的牌，这里应该排除我当前选的牌
                    if(!checkUINodeHave(uisort,copyuistand[k]))
                    {
                        colloctionUI.push(copyuistand[k]);//有可能第二次装的数组还是，前一个值，ui节点是同一个。
                        break;
                    }
                }
            }
        }
        uisort[i] = colloctionUI;//保存理牌数组
        mjhandCopy = getExcludeCards(mjhandCopy,MjClient.colloctionCardsArray[i]);
    }


    //理牌的牌，装进数组 mySortui
    var mySortui = [];
    for(var j = 0; j < uisort.length; j++)
    {
        var uiss = uisort[j];
        for(var i = 0; i < uiss.length; i++)
        {
            uiss[i].zIndex = 0;
            cc.log("理牌的牌 = " + uiss[i].tag);
            uiss[i].setColor(cc.color(190,190,190));
            mySortui.push(uiss[i]);
        }
    }


    //理牌后剩下其他的牌
    var mjhandPai = null;
    if (needSort)
        mjhandPai = tempMaJiang.sortHandCards(mjhandCopy,pro_rankType);
    else
        mjhandPai = mjhandCopy.slice();

    //移除已选牌的UI
    var newuiStand = [];
    for(var j = 0;j <uistand.length;j++ )
    {
        var bExsit = false;
        for(var i = 0 ;i < mySortui.length;i++)
        {
            if(mySortui[i].tag == uistand[j].tag  && mySortui[i].getUserData() == uistand[j].getUserData())
            {
                if(!checkUINodeHave(newuiStand,uistand[j]))
                {
                    bExsit = true;
                    break;
                }
            }
        }

        if(!bExsit)
        {
            newuiStand.push(uistand[j]);
        }
    }
    uistand = newuiStand;



    var myUiStand = []; //重新排序后
    for(var j = 0;j < mjhandPai.length;j++)
    {
        for (var i = 0; i < uistand.length; )
        {
            if (uistand[i].tag == mjhandPai[j])//这张牌，有可能是，理牌里面的牌，也有可能是没理牌的牌
            {
                myUiStand.push(uistand[i]);
                uistand.splice(i,1);
            }
            else
            {
                i++;
            }
        }
    }
    uistand = myUiStand;


    var uiOrder = [mySortui, uistand];
    var orders = []; //重新排序后装到数组里 by sking
    //不需要理牌的手牌
    for(var j = 0; j < uiOrder.length; j++)
    {
        var uis = uiOrder[j];
        for(var i = 0; i < uis.length; i++)
        {
            uis[i].zIndex = 0;
            orders.push(uis[i]);
        }
    }

    //设置麻将位置
    
    if(off == 0)//自己或者对家
    {
        var cardWidth = orders[0] ? orders[0].width * orders[0].scale : 0;
        var screenScale = MjClient.size.width/1280;
        var areaWidth = MjClient.size.width - screenScale * 30;
        var width = (areaWidth - cardWidth) / (16 - 1) + (16 - orders.length) * 1 * screenScale;
        var startX = screenScale * 20 + (areaWidth - width * (orders.length - 1))/2;

        for(var i = 0; i < orders.length; i++)
        {
            var ci = orders[i];
            ci.x = startX;
            startX += width;
            ci.zIndex = i;
        }
    }
    else if (off == 1)//右侧的
    {
        for(var i = orders.length - 1; i >= 0; i --)
        {
            var ci = orders[i];
            //if(ci.name == orders[i - 1].name)
            {
                if (ci.name == "mjhand_replay") {
                    if (i != orders.length - 1) {
                        ci.y = orders[i + 1].y - upSize.width * upS * 0.3 - (27 - orders.length) * 0.3;//调牌的距离的，todo...
                    }
                    else {
                        ci.y = start.y - upSize.width * upS * 0.2 - ((27 - orders.length) * upSize.width * upS * 0.3) / 3;
                    }
                }
            }
        }

        for(var i = 0; i < orders.length; i++)
        {
            orders[i].zIndex = i;
        }
    }
    else if (off == 2)//左侧的
    {
        for(var i = 0; i < orders.length; i++)
        {
            var ci = orders[i];
            //if(ci.name == orders[i - 1].name)
            {
                if (ci.name == "mjhand_replay") {
                    if (i != 0) {
                        ci.y = orders[i - 1].y - upSize.width * upS * 0.3 - (27 - orders.length) * 0.3;//调牌的距离的，todo...
                    }
                    else {
                        ci.y = start.y - upSize.width * upS * 0.2 - ((27 - orders.length) * upSize.width * upS * 0.3) / 3;
                    }

                    ci.zIndex = i;
                }
            }
        }
    }
}

//纵向摆放
PlayLayer_PaoDeKuaiYZTY.prototype.verSort = function(node, off, needSort)
{
    if(off != 0)
    {
        return;
    }
    var pl = getUIPlayer(off);//获取玩家信息.off 为0 ，就是自己得信息，能看到自己摸牌 by sking

    MjClient.playui.sortType = MjClient.sortType.normal;

    var mjhandNum = 0;
    var children = node.children;
    for(var i = 0; i < children.length; i++)
    {
        var ci = children[i];
        if(ci.name == "mjhand")
        {
            mjhandNum++;
            if((typeof MjClient.init_y) == 'undefined')
            {
                MjClient.init_y = ci.y;
            }

            ci.y = MjClient.init_y;
            //ci.isGray = false;
            var _smallFlower = ci.getChildByName("cardType").getChildByName("smallFlower");
            if(_smallFlower)
            {
                _smallFlower.setPosition(65,80);
            }
        }
    }

    var tempMaJiang = MjClient.majiang; //麻将的各种方法判断，是否可以杠，是否可以吃... by sking

    //up stand 是2种麻将的图。
    var up = node.getChildByName("up");
    var stand = node.getChildByName("stand");
    stand.visible = false;
    var start = stand;

    var upSize = start.getSize();
    var upS = start.scale;
    var uistand = [];
    var uisort = [];
    var uihun = [];//癞子牌在最左边

    for(var i = 0; i < children.length; i++) //children 为 "down" 节点下的字节点
    {
        var ci = children[i];
        if(ci.name == "mjhand")
        {
            //ci.setColor(cc.color(255,255,255));

            uistand.push(ci);
        }
        else if(ci.name == "mjhand_replay")
        {
            uistand.push(ci);
        }
    }


    /*
     排序方式
     */
    var pro_rankType = 1;
    if(off == 0)
    {
        pro_rankType = MjClient.playui.sortType;
    }

    if(!pl.mjhand || cc.isUndefined(pl.mjhand))
    {
        return;
    }


    //排除理牌的牌
    var mjhandCopy = pl.mjhand.concat();
    var copyuistand = uistand.concat();
    for(var i = 0;i< MjClient.colloctionCardsUIArray.length;i++) {
        var colloctionUI = []; //重新排序后
        var _colloctionUICards = MjClient.colloctionCardsUIArray[i].concat();
        for(var j = 0;j < _colloctionUICards.length;j++) {
            for (var k = 0; k < copyuistand.length; k++) {
                if (copyuistand[k].tag == _colloctionUICards[j].tag &&
                    copyuistand[k].getUserData() == _colloctionUICards[j].getUserData()){//这里保存的有可能是我当前选中的牌，这里应该排除我当前选的牌
                    if(!checkUINodeHave(uisort,copyuistand[k]))
                    {
                        colloctionUI.push(copyuistand[k]);//有可能第二次装的数组还是，前一个值，ui节点是同一个。
                        break;
                    }
                    break;
                }
            }
        }
        uisort[i] = colloctionUI;//保存理牌数组
        mjhandCopy = getExcludeCards(mjhandCopy,MjClient.colloctionCardsArray[i]);
    }

    cc.log("MjClient.colloctionCardsArray = " + JSON.stringify(MjClient.colloctionCardsArray));


    //理牌的牌，装进数组 mySortui
    var mySortui = [];
    for(var j = 0; j < uisort.length; j++)
    {
        var uiss = uisort[j];
        for(var i = 0; i < uiss.length; i++)
        {
            uiss[i].zIndex = 50;
            cc.log("理牌的牌 = " + uiss[i].tag);
            mySortui.push(uiss[i]);
        }
    }

    //理牌后剩下其他的牌
    var mjhandPai = null;
    if (needSort)
        mjhandPai = tempMaJiang.sortHandCards(mjhandCopy,pro_rankType);
    else
        mjhandPai = mjhandCopy.slice();

    //移除已选牌的UI
    var newuiStand = [];
    for(var j = 0;j <uistand.length;j++ )
    {
        var bExsit = false;
        for(var i = 0 ;i < mySortui.length;i++)
        {
            if(mySortui[i].tag == uistand[j].tag  && mySortui[i].getUserData() == uistand[j].getUserData())
            {
                if(!checkUINodeHave(newuiStand,uistand[j]))
                {
                    bExsit = true;
                    break;
                }
            }
        }

        if(!bExsit)
        {
            newuiStand.push(uistand[j]);
        }
    }
    uistand = newuiStand;


    //重新排序后的牌
    var myUiStand = [];
    for(var j = 0;j < mjhandPai.length;j++)
    {
        for (var i = 0; i < uistand.length; )
        {
            if (uistand[i].tag == mjhandPai[j])//这张牌，有可能是，理牌里面的牌，也有可能是没理牌的牌
            {
                myUiStand.push(uistand[i]);
                uistand.splice(i,1);
            }
            else
            {
                i++;
            }
        }
    }
    uistand = myUiStand;


    /*
        纵向排序
    */

    //没有理牌的牌，按照牌分别存贮在各个数组里
    var afterSortUI = [];
    var lashCardValue = -1;
    var icount = 0;
    var _length = 0;
    for(var i = 0;i<uistand.length;i++)
    {
        var _value = getCardValueByID(uistand[i].tag);

        if(lashCardValue != _value)
        {
            icount = 0;
            lashCardValue = _value;
            _length = afterSortUI.length;
            afterSortUI[_length] = [];
        }
        uistand[i].zIndex = 100;
        afterSortUI[_length][icount] = uistand[i];
        icount++;
    }


    /*
        清除空牌堆
    */
    var _afterSortUI = [];
    for(var i =  0;i < afterSortUI.length;i++)
    {
        var _uiArray = afterSortUI[i];
        if(_uiArray.length > 0)
        {
            _afterSortUI.push(_uiArray);
        }
    }
    afterSortUI = _afterSortUI;

    var _uisort = [];
    for(var i =  0;i < uisort.length;i++)
    {
        var _uiArray = uisort[i];
        if(_uiArray.length > 0)
        {
            _uisort.push(_uiArray);
        }
    }
    uisort = _uisort;




    //初始化排序的出数值
    var _cardPileLength = afterSortUI.length;//其他牌堆个数
    var _sortPileLength = uisort.length ;//理牌堆的个数
    if(uisort.length > 0)//有理牌堆
    {
        _cardPileLength += _sortPileLength;
    }
    MjClient.currentCardPileCount = _cardPileLength;
    var screenX = MjClient.size.width;//屏幕宽度
    var cardX = upSize.width * upS*1.28;//一张牌的宽度
    var oneX = upSize.width * upS * 1.28;//牌间距
    var dy = upSize.width * upS*0.55;//竖着的间隙
    var StartX = screenX/2 - _cardPileLength*cardX/2 + cardX/2;
    var StartY = start.y;

    if(_cardPileLength <= 13)
    {
        oneX = cardX;
    }
    else
    {
        oneX =  cardX - (cardX/13)*(_cardPileLength - 13);//满屏13张牌，每多一张牌，减除一张牌的宽度
        StartX = screenX/2 - _cardPileLength*oneX/2 + oneX/2;
    }


    /*
      1 先排序理牌的牌
    */
    for(var i = 0;i < uisort.length;i++)
    {
        var _sortuiArray = uisort[i];
        var x = StartX + oneX*i;
        var y = StartY;
        for(var j = 0;j < _sortuiArray.length;j++)
        {
            var ci = _sortuiArray[j];
            cc.log("理牌 tag = " + ci.tag);
            ci.x  = x;
            ci.y  = y + j*dy;
            ci.zIndex -= j*3;
            ci.zIndex += i*2;
        }
    }

    /*
       2 排序其他的牌
    */
    StartX += oneX*_sortPileLength;
    for(var i =  0;i < afterSortUI.length;i++)
    {
        var x = StartX + oneX*i;
        var y = StartY;
        var _uicard = afterSortUI[i];

        for(var j = 0;j < _uicard.length;j++)
        {
            var ci = _uicard[j];
            ci.x  = x;
            ci.y  = y + j*dy;
            ci.zIndex -= j*2;
            ci.zIndex += i*2;
        }
    }
}

PlayLayer_PaoDeKuaiYZTY.prototype.showJiaZhu_PaodekuaiTY = function()
{
    if (!MjClient.playui._jiazhuWait)
        return;

    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var pl = getUIPlayer(0);
    MjClient.playui._jiazhuWait.visible = false;
    if (tData.tState == TableState.waitJiazhu && SelfUid() == pl.info.uid) {
        if (pl.mjState == TableState.waitJiazhu ) {

            //清除飘分选择页面
            var layer = MjClient.playui.getChildByName("playUINode").getChildByName("JiaZhu");
            if (layer) { return;}
            var layer = new JiaZhu_PaodekuaiTY(tData.areaSelectMode.piaofen,function(){
                //弹窗等待
                MjClient.playui._jiazhuWait.visible = true;
            });
            layer.setName("JiaZhu");
            cc.log("_jiazhuWait====================1111");
            //MjClient.playui.addChild(layer, 99);
            MjClient.playui.getChildByName("playUINode").addChild(layer, 99);
        }
        else {
            //弹窗等待其他玩家加注
            MjClient.playui._jiazhuWait.visible = true;
        }
    }
}

 PlayLayer_PaoDeKuaiYZTY.prototype.resetJiaZhuNum = function(node)
{
    var directions = ["down","top","left","right"];

    for (var i = 0; i < directions.length; i++) {
        this.setJiaZhuNum(node.getChildByName(directions[i]), getUIPlayer(i));
    }
}

PlayLayer_PaoDeKuaiYZTY.prototype.setJiaZhuNum = function (node, pl)
{
    if(!pl) return;
    var icountNode = node.getChildByName("head").getChildByName("jiaZhu");
    if (!icountNode) return;
    var tData = MjClient.data.sData.tData;
    cc.log("===========飘分 = " + pl.jiazhuNum);
    if(pl.jiazhuNum > 0) {
        icountNode.visible = true;
        icountNode.ignoreContentAdaptWithSize(true);
        icountNode.setAnchorPoint(cc.p(1, 0.5))
        icountNode.setString("飘" + pl.jiazhuNum + "分");
    }else{
        icountNode.setString("");
    }
}


////////////////////////////////////////////////////////////////////////////////////////
//头像位置
PlayLayer_PaoDeKuaiYZTY.prototype.reConectHeadLayout_PaoDeKuaiYZTY = function (node)
{
    var sData = MjClient.data.sData;
    if(sData.tData.fieldId)
        this.reConectHeadLayout_PaoDeKuai_fieldId(node);
    else
        reConectHeadLayout_card(node);
}

//时间节点设置
PlayLayer_PaoDeKuaiYZTY.prototype.BgTime_run = function (node)
{
    var text = new ccui.Text();
    if(MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP) {//岳阳同一使用方正兰亭
        text.setFontName("fonts/lanting.TTF");
    }else{
        text.setFontName(MjClient.fzcyfont);
    }
    text.setFontSize(18);
    text.setTextColor(cc.color(222,226,199));
    text.setAnchorPoint(0.5,0.5);
    text.setPosition(node.getContentSize().width / 2, node.getContentSize().height / 2);
    node.addChild(text);
    text.schedule(function(){
        
        var time = MjClient.getCurrentTime();
        var str = (time[3]<10?"0"+time[3]:time[3])+":"+
            (time[4]<10?"0"+time[4]:time[4]);
        this.setString(str);
    });
}


//////////////////////////金币场UI调整//////////////////////////////////////////////////////////////////////////////////////
PlayLayer_PaoDeKuaiYZTY.prototype.reConectHeadLayout_PaoDeKuai_fieldId= function (node)
{
    var down = node.getChildByName("down").getChildByName("head");
    var top = node.getChildByName("top").getChildByName("head");
    var right = node.getChildByName("right").getChildByName("head");

    setWgtLayout(right, [0.13, 0.13], [1, 1.0], [-0.6, -2.0], false, false);
    if (isIPhoneX()) {
        setWgtLayout(down, [0.13, 0.13], [0.00, 0.0], [0.6, 0.65], false, false);       
        setWgtLayout(top, [0.13, 0.13], [0.00, 1.0], [0.6, -2.0], false, false);
    }else{
        setWgtLayout(down, [0.13, 0.13], [0, 0.0], [0.6, 0.65], false, false);
        setWgtLayout(top, [0.13, 0.13], [0, 1.0], [0.6, -2.0], false, false);
    }

    var sData = MjClient.data.sData;
    var tData = sData.tData;
    if ( !tData.fieldId || (MjClient.getAppType() != MjClient.APP_TYPE.HUNANWANGWANG && MjClient.getAppType() != MjClient.APP_TYPE.QXSYDTZ) ) {
        var head_bottom = down.getChildByName("name_bottom");
        var coinbg = down.getChildByName("coinbg");
        if (!head_bottom || !coinbg)return;
        head_bottom.visible = false;
        coinbg.visible = true;
    }
}

PlayLayer_PaoDeKuaiYZTY.prototype.initFieldIdUI = function (node)
{
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var fieldNode = node.getChildByName("FieldNode");
    if (!fieldNode) return;
    if (tData.fieldId)
    {
        fieldNode.visible=true;
    }
    else{
        fieldNode.visible=false;
        return;
    }
    this.BindFieldIdUI(fieldNode);

    //隐藏金币场不需要的节点
    node.getChildByName("banner").visible = false;
    node.getChildByName("voice_btn").visible = false;
    node.getChildByName("chat_btn").visible = false;

    //金币场节点位置调整
    var bottonBG = fieldNode.getChildByName("bottonBG");
    var offH = bottonBG.height*bottonBG.scaleY;

    node.getChildByName("noPutTips").y += offH;
    node.getChildByName("BtnReady").y += offH;
    node.getChildByName("BtnNoPut").y += offH;
    node.getChildByName("BtnPutCard").y += offH;
    node.getChildByName("BtnHimt").y += offH;

    var down = node.getChildByName("down");
    down.getChildByName("play_tips").y += offH;
    down.getChildByName("ready").y += offH;
    down.getChildByName("stand").y += (offH + 10 * bottonBG.scaleY);
    down.getChildByName("deskCard").y += offH;
    down.getChildByName("noPutTag").y += offH;

    var block_tuoguan = node.getChildByName("block_tuoguan");
    block_tuoguan.getChildByName("btn_tuoguan").y += offH;
    block_tuoguan.getChildByName("Text_1").y += offH;

    MjClient.clockNode.srcPosition.y += offH;
}

PlayLayer_PaoDeKuaiYZTY.prototype.BindFieldIdUI = function (node)
{
    var uibind = {
        bottonBG:
        {
            _run: function() {
                setWgtLayout(this, [this.width/1280, 0], [0.0, 0.0], [0, 0]);
            },
            chat_btn: {
                _click: function() {
                    var chatlayer = new ChatLayer();
                    MjClient.Scene.addChild(chatlayer);
                }
            },
            jipai_btn: {
                _run: function() {
                    this.visible = false;
                },
                _click: function() {
                    var jiPaiQiPanel = MjClient.playui.getChildByName("jiPaiQiPanel");

                    // postEvent("jiPaiQiOperation",!jiPaiQiPanel.isJiPaiQiShowing());

                    if (jiPaiQiPanel.isJiPaiQiShowing()) {
                        postEvent("jiPaiQiOperation",false);
                    } else if (MjClient.playui.isUsingJiPaiQi()) {
                        postEvent("jiPaiQiOperation",true);
                    } else {
                        var useJipaiqi = function () {
                            cc.log("this is in useJipaiqi");
                            // 使用记牌器
                            MjClient.gamenet.request("pkroom.handler.tableMsg", {cmd: "useJipaiqi"}, 
                                function(rtn) {
                                    if (rtn.code == 0) {
                                        // postEvent("jiPaiQiOperation",true);
                                    } else if (rtn.message) {
                                        MjClient.showToast(rtn.message);
                                    }
                                }
                            );
                        }
                        if (MjClient.data.pinfo.jipaiqi1 > 0 || MjClient.data.pinfo.jipaiqi2 > 0) {
                            // 直接使用
                            useJipaiqi();
                        } else {
                            // 先购买
                            MjClient.gamenet.request("pkplayer.handler.getRechargeLadder", {type: "jipaiqi"}, 
                                function(rtn) {
                                    if (rtn.code == 0) {
                                        var validCommoditys = MjClient.playui.checkJiPaiQiListValid(rtn.data);

                                        if (validCommoditys)
                                            MjClient.playui.showJiPaiQiBuyingPanel(validCommoditys,useJipaiqi)
                                        else
                                            MjClient.showToast("无可用记牌器");
                                    } else if (rtn.message) {
                                        MjClient.showToast(rtn.message);
                                    }
                                }
                            );
                        }
                    }
                },
                _event:{
                    mjhand: function() {
                        MjClient.playui.setJiPaiQiEnabled(this);
                        MjClient.playui.checkJiPaiQiButtonVisible(this);
                    },
                    waitPut: function() {
                        MjClient.playui.setJiPaiQiEnabled(this);
                    },
                    initSceneData: function()
                    {
                        MjClient.playui.setJiPaiQiEnabled(this);
                        MjClient.playui.checkJiPaiQiButtonVisible(this);
                    },
                    PostCardsEnded: function()
                    {
                        MjClient.playui.setJiPaiQiEnabled(this);
                    }
                },
                jiPaiQiNum: {
                    _run: function() {
                        MjClient.playui.setJiPaiQiNum(this);
                    },
                    _event: {
                        updateInfo: function() {
                            MjClient.playui.setJiPaiQiNum(this);
                        }
                    }
                }
            },
        },
        LeftTopBG:
        {
            _run: function() {
                setWgtLayout(this, [this.width/1280, 0], [0.0, 1.0], [0, 0]);
            },
            bg_time:{
                _run:function() {
                    MjClient.playui.BgTime_run(this);
               }
            },

            wifi: {
                _run: function() {
                    MjClient.playui.updateWifiState_field(this);
                }
            }
        },
        RightTopBG:
        {
            _run: function() {
                setWgtLayout(this, [this.width/1280, 0], [1.0, 1.0], [0, 0]);
            },
            setting: {
                _click: function() {
                    var settringLayer = new SettingView();
                    settringLayer.setName("PlayLayerClick");
                    MjClient.Scene.addChild(settringLayer);
                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Shezhi", {uid:SelfUid(),gameType:MjClient.gameType});
                },
            },
            get_gold_btn:{
                _run: function() {
                    // 隐藏按钮，暂不开放
                    this.setVisible(false);
                },
                _click: function() {
                    MjClient.Scene.addChild(new goldStoreLayer());
                }
            },
            tuoguan_btn:{
                _run:function () {
                    this.setVisible(MjClient.data.sData.tData.fieldId ? true : false);
                },
                _click: function() {
                    MjClient.gamenet.request("pkroom.handler.tableMsg", {cmd: "beTrust"});
                },
                _event:{
                    beTrust:function (msg) {
                        if(msg.uid == SelfUid()){
                            this.enabled = false;
                        }
                    },
                    cancelTrust:function (msg) {
                        if(msg.uid == SelfUid()){
                            this.enabled = true;
                        }
                    },
                    initSceneData:function (msg) {
                        var pl = getUIPlayer(0);
                        if(pl.trust){
                            this.enabled = false;
                        }else {
                            this.enabled = true;
                        }
                    },
                },
            },
            duty_btn: {
                _run: function () {
                    this.setVisible(MjClient.data.sData.tData.fieldId ? true : false);
                    if (!MjClient.data.sData.tData.fieldId ) {
                        return
                    }
                    MjClient.block();
                    ShowDayTaskTips(this)
                },
                _click: function () {
                    MjClient.Scene.addChild(new GoldTaskLayer());
                },
                Image_hongdian:{
                    _run: function () {
                        this.visible = MjClient._GoldFuli;
                    },
                    _event: {
                        refresh_mission: function() {
                            this.visible = MjClient._GoldFuli;
                        }
                    }
                }
            },
        }
    }
    BindUiAndLogic(node, uibind);
}

// 更新wifi信号 3张图片
PlayLayer_PaoDeKuaiYZTY.prototype.updateWifiState_field = function(node)
{
    var callback = function()
    {
        var ms = MjClient.reqPingPong / 1000.0;
        if(ms < 0.3)
            node.loadTexture("playing/pdkfield/wf.png");
        else if(ms < 0.6)
            node.loadTexture("playing/pdkfield/wf3.png");
        else
            node.loadTexture("playing/pdkfield/wf4.png");
    };
    node.runAction(cc.repeatForever(cc.sequence(cc.callFunc(callback), cc.delayTime(5))));
}

PlayLayer_PaoDeKuaiYZTY.prototype.isInField = function()
{
    return MjClient.data.sData.tData.fieldId;
}

PlayLayer_PaoDeKuaiYZTY.prototype.isUsingJiPaiQi = function()
{
    var jipaiqi = MjClient.data.sData.tData.jipaiqi;
    return jipaiqi && jipaiqi.indexOf(SelfUid()) >= 0;
}

PlayLayer_PaoDeKuaiYZTY.prototype.createJiPaiQiPanel = function()
{
    var jiPaiQiPanel = null;
    var JiPaiQiPanel = cc.Layer.extend({
        jsBind:{
            jiPaiQiBg:{
                _run: function() {
                    setWgtLayout(this, [this.width/1280, this.height/720], [0.5, 1.0], [0, 0.5]);
                },
                _event:{
                    PKPut: function(msg) {
                        if (msg.uid == SelfUid())
                            return;

                        if (!MjClient.playui.isUsingJiPaiQi())
                            return;
                        
                        // 去除本次打出的牌
                        for (var i = 0; i < msg.card.length; i++) {
                            jiPaiQiPanel.cardsFormated[MjClient.majiang.calPoint(msg.card[i])]--;
                        }

                        jiPaiQiPanel.updateJiPaiQi(this);
                    },
                    roundEnd: function() {
                        jiPaiQiPanel.showOrHideJiPaiQi(this,false);
                    },
                    initSceneData: function(msg) {
                        if (!MjClient.playui.isUsingJiPaiQi())
                            return;

                        jiPaiQiPanel.formatCards(msg.leftCards);

                        var selfPlayer = getUIPlayer(0);

                        // 去除己方手牌
                        for (var i = 0; i < selfPlayer.mjhand.length; i++) {
                            jiPaiQiPanel.cardsFormated[MjClient.majiang.calPoint(selfPlayer.mjhand[i])]--;
                        }

                        jiPaiQiPanel.updateJiPaiQi(this);

                        if (MjClient.data.sData.tData.tState == TableState.roundFinish) {
                            jiPaiQiPanel.showOrHideJiPaiQi(this,false);
                        }
                    },
                    initJiPaiQi: function(msg) {
                        jiPaiQiPanel.formatCards(msg.leftCards);

                        // 在位置未定的情况下这样查找己方较为准确
                        var sData = MjClient.data.sData;
                        var players = sData.players;
                        var selfPlayer = null;
                        for (var uid in players) {
                            if (SelfUid() == uid)
                            {
                                selfPlayer = players[uid];
                                break;
                            }
                        }

                        // 去除己方手牌
                        for (var i = 0; i < selfPlayer.mjhand.length; i++) {
                            jiPaiQiPanel.cardsFormated[MjClient.majiang.calPoint(selfPlayer.mjhand[i])]--;
                        }

                        jiPaiQiPanel.updateJiPaiQi(this);
                        jiPaiQiPanel.showOrHideJiPaiQi(this,true);
                    },
                    jiPaiQiOperation: function(bShow) {
                        jiPaiQiPanel.showOrHideJiPaiQi(this,bShow);
                    }
                }
            }
        },
        ctor: function () {
            this._super();

            var panelUi = ccs.load("JiPaiQiPanel.json");
            BindUiAndLogic(panelUi.node,this.jsBind);
            this.addChild(panelUi.node);
        },
        formatCards: function(leftCards) {
            this.cardsFormated = {};
            var keys = [16,14,13,12,11,10,9,8,7,6,5,4,3];
            var cardsCount = keys.length;

            for (var i = 0; i < cardsCount; i++) {
                this.cardsFormated[keys[i]] = 0;
            }

            cardsCount = leftCards.length;
            for (var i = 0; i < cardsCount; i++) {
                if (leftCards[i])
                    this.cardsFormated[MjClient.majiang.calPoint(leftCards[i])]++;
            }
        },
        updateJiPaiQi: function(jiPaiQiBg) {
            var textColors = [cc.color(221,86,31),cc.color(151,151,151)];

            for (var key in this.cardsFormated) {
                var cardCount = this.cardsFormated[key];
                var textNode = jiPaiQiBg.getChildByName(parseInt(key));

                if (!textNode)
                    continue;

                textNode.setString(cardCount);
                textNode.setColor(cardCount > 0 ? textColors[0] : textColors[1]);
            }
        },
        showOrHideJiPaiQi: function(jiPaiQiBg,bShow) {
            this.jiPaiQiShowing = bShow;

            jiPaiQiBg.stopAllActions();

            if (bShow)
                jiPaiQiBg.runAction(cc.sequence(cc.moveTo(0.3, MjClient.size.width/2, MjClient.size.height - (jiPaiQiBg.getContentSize().height/2 + 10) * jiPaiQiBg.getScale()).easing(cc.easeSineOut())));
            else
                jiPaiQiBg.runAction(cc.sequence(cc.moveTo(0.3, MjClient.size.width/2, MjClient.size.height + jiPaiQiBg.getContentSize().height * jiPaiQiBg.getScale() / 2).easing(cc.easeSineIn())));
        },
        isJiPaiQiShowing: function() {
            return this.jiPaiQiShowing;
        }
    });

    jiPaiQiPanel = new JiPaiQiPanel();
    MjClient.playui.addChild(jiPaiQiPanel,600,"jiPaiQiPanel");
}

// 记牌器购买面板
PlayLayer_PaoDeKuaiYZTY.prototype.showJiPaiQiBuyingPanel = function(commoditys,purchaseCallback) {
    var buyingPanel = null;
    var JiPaiQiBuyingPanel = cc.Layer.extend({
        jsBind:{
            block:{
                _event:{
                    roundEnd:function(){
                        buyingPanel.removeFromParent();
                    },
                    initSceneData: function(){
                        buyingPanel.removeFromParent();
                    }
                }
            }
        },
        ctor: function () {
            this._super();

            var panelUi = ccs.load("JiPaiQiBuyingPanel.json");
            BindUiAndLogic(panelUi.node,this.jsBind);
            this.addChild(panelUi.node);

            var _block = panelUi.node.getChildByName("block");
            setWgtLayout(_block,[1,1],[0.5,0.5],[0,0],true);

            var _back = panelUi.node.getChildByName("back");
            setWgtLayout(_back,[0.64,0.78],[0.5,0.5],[0,0]);

            var btn_close = _back.getChildByName("btn_close");
            btn_close.addTouchEventListener(function(sender,type){
                switch (type)
                {
                    case ccui.Widget.TOUCH_ENDED:
                        this.removeFromParent();
                        break;
                    default :
                        break;
                }
            },this);

            var confirmCallBack = function(commodityID) {
                // 发送购买消息

                //MjClient.block();

                MjClient.gamenet.request("pkplayer.handler.purchaseCardHolder", {id: commodityID}, 
                    function(rtn) {
                        //MjClient.unblock();
                        if(!sys.isObjectValid(buyingPanel)){
                            return;
                        }

                        if (rtn.code == 0) {
                            buyingPanel.removeFromParent();

                            purchaseCallback();
                        } else if (rtn.message) {
                            cc.log("rtn.message rtn.message = " + rtn.message);
                            MjClient.showToast(rtn.message);
                        }
                    }
                );
            }

            var itemList = _back.getChildByName("itemList");
            var firstItem = itemList.getChildByName("item");
            var commoditysCount = commoditys.length;
            for (var i = 0; i < commoditysCount; i++) {
                var item = i == 0 ? firstItem : firstItem.clone();
                if (i != 0)
                    itemList.insertCustomItem(item, i);
                this.itemsBind(item, commoditys[i], confirmCallBack);
            }
        },
        itemsBind: function(item, commodity, confirmCallBack) {
            var bind = {
                btnBuy: {
                    _click: function() {
                        if (MjClient.data.pinfo.gold < commodity.lowerLimit) {
                            MjClient.showToast("金币大于" + commodity.lowerLimit + "才可购买");
                            return;
                        }

                        if (MjClient.data.pinfo.gold < commodity.amount) {
                            MjClient.showToast("金币不足");
                            return;
                        }

                        var content;
                        if (commodity.os == "jipaiqi1")
                            content = "确定使用" + commodity.amount + "金币购买记牌器" + commodity.money + "个吗？"
                        else
                            content = "确定使用" + commodity.amount + "金币购买记牌器" + commodity.money + "天吗？"
                       
                        MjClient.showMsg(content, function () {
                            confirmCallBack(commodity.id);
                        }, function(){}, 1);
                    }
                }
            }

            BindUiAndLogic(item, bind);

            cc.log("commodity commodity " + JSON.stringify(commodity));

            item.getChildByName("costLabel").setString(getJinbiStrEx(commodity.amount));
            item.getChildByName("itemTitle").setString(commodity.title);
        },
    });

    var buyingPanel = new JiPaiQiBuyingPanel();
    MjClient.playui.addChild(buyingPanel,500);
}

PlayLayer_PaoDeKuaiYZTY.prototype.setJiPaiQiEnabled = function(node) {
    var tData = MjClient.data.sData.tData;
    var enabled = tData.tState != TableState.waitJoin && 
        tData.tState != TableState.roundFinish && 
        tData.tState != TableState.waitReady && 
        tData.tState != TableState.waitCard &&
        !MjClient.playui.isFaPai;

    node.setBright(enabled);
    node.setTouchEnabled(enabled);
}

PlayLayer_PaoDeKuaiYZTY.prototype.setJiPaiQiNum = function(node) {
    if (MjClient.data.pinfo.jipaiqi2 > 0)
        node.setString(MjClient.data.pinfo.jipaiqi2 + "天");
    else if (MjClient.data.pinfo.jipaiqi1 > 0)
        node.setString(MjClient.data.pinfo.jipaiqi1 + "个");
    else
        node.setString("0个");
}

PlayLayer_PaoDeKuaiYZTY.prototype.checkJiPaiQiListValid = function(commoditys) {
    if (!commoditys || commoditys.length <= 0)
        return null;

    var validCommoditys = [];
    for (var i = 0; i < commoditys.length; i++) {
        if (commoditys[i].money && commoditys[i].money > 0)
            validCommoditys.push(commoditys[i]);
    }

    if (validCommoditys[0])
        return validCommoditys;
    else
        return null;
}

PlayLayer_PaoDeKuaiYZTY.prototype.checkJiPaiQiButtonVisible = function(node) {
    if (MjClient.playui.isUsingJiPaiQi() || 
        MjClient.data.pinfo.jipaiqi1 > 0 || 
        MjClient.data.pinfo.jipaiqi2 > 0)
        node.visible = true;
    else {
        node.visible = false;

        // 根据是否配置了记牌器商品显隐记牌器按钮
        MjClient.gamenet.request("pkplayer.handler.getRechargeLadder", {type: "jipaiqi"}, 
            function(rtn) {
                this.visible = (rtn.code == 0 && MjClient.playui.checkJiPaiQiListValid(rtn.data));
            }.bind(node)
        );
    }
}
 
PlayLayer_PaoDeKuaiYZTY.prototype.reLoadOptBtnRes = function() {
    //出牌按钮
    if(this._btnPutCard) this._btnPutCard.loadTextures("playing/paodekuaiTable_new/chupai.png", null, "playing/paodekuaiTable_new/chupai_2.png");
    //提示按钮  
    if(this._btnHimt) this._btnHimt.loadTextures("playing/paodekuaiTable_new/tishi.png", null, "playing/paodekuaiTable_new/tishi_s.png");
     //不出按钮   
    if(this._btnNoPut) this._btnNoPut.loadTextures("playing/paodekuaiTable_new/buchu.png", null, "playing/paodekuaiTable_new/buchu_s.png");
}

PlayLayer_PaoDeKuaiYZTY.prototype.removeShuffleNode = function() {
    this.shuffleNode.removeFromParent(true);
    this.shuffleNode = null;
};

PlayLayer_PaoDeKuaiYZTY.prototype.playShuffleEffect = function() {
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