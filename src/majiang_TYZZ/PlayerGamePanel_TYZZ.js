/**
 * Created by Administrator on 2017/3/9.
 */
var actionZindex = 1000;
//向服务器发送 过消息
MjClient.MJPass2NetForTYZZ = function()
{
   // console.log(">>>>>>>>>普通  过 <<<<<<<<");
    cc.log("====================send======pass=====");
    var sData = MjClient.data.sData;
    var tData = sData.tData;

    var pl = getUIPlayer(0);
    if(pl.isZiMoHu) {
        return MjClient.showToast("自摸必须胡牌");
    }
    var eat = MjClient.playui.jsBind.eat;
    if(tData.areaSelectMode.bihuType && eat.hu._node.visible){
        return MjClient.showToast("有胡必胡");
    }
    if(IsTurnToMe() && tData.tState == TableState.waitPut)
    {
        var eat = MjClient.playui.jsBind.eat;
        var commitFunc = function () {
            eat.gang0._node.visible = false;
            eat.hu._node.visible = false;
            eat.guo._node.visible = false;
            eat.ting._node.visible = false;
            eat.cancel._node.visible = false;
            MJPassConfirmToServer();
        }
        var roomMsgValue = tData.tableid +":"+tData.roundNum;
        var saveRoomMsgValueG = util.localStorageEncrypt.getStringItem("IGNORE_G_TIP","")
        var saveRoomMsgValueH = util.localStorageEncrypt.getStringItem("IGNORE_H_TIP","")
        if (MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP|| MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ) {
            if(eat.gang0._node.visible && eat.hu._node.visible){
                if((saveRoomMsgValueG.length > 0 && saveRoomMsgValueG == roomMsgValue)&&(saveRoomMsgValueH.length > 0 && saveRoomMsgValueH == roomMsgValue)){
                    commitFunc();
                    return;
                }
            }else{
                if(eat.gang0._node.visible){
                    if(saveRoomMsgValueG.length > 0 && saveRoomMsgValueG == roomMsgValue){
                        commitFunc();
                        return;
                    }
                }
                if(eat.hu._node.visible){
                    if(saveRoomMsgValueH.length > 0 && saveRoomMsgValueH == roomMsgValue){
                        commitFunc();
                        return;
                    }
                }
            }
        }

        var msg = "确认过";
        if(eat.gang0._node.visible && saveRoomMsgValueG != roomMsgValue)
        {
            msg += " 杠 ";
        }

        if(eat.hu._node.visible && saveRoomMsgValueG != roomMsgValue)
        {
            msg += " 胡 ";
        }

        msg = msg + "吗?"
        MjClient.showMsg(msg, function(result)
        {
            //cc.log("==========1=============");
            if(result && result.isSelect){
                //选择了不在提示,
                if(eat.gang0._node.visible){
                    util.localStorageEncrypt.setStringItem("IGNORE_G_TIP",roomMsgValue);
                }
                if(eat.hu._node.visible){
                    util.localStorageEncrypt.setStringItem("IGNORE_H_TIP",roomMsgValue);
                }
            }
            commitFunc();
        }, function() {}, (MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP|| MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ) ? "3":"1");
    }
    else
    {
        if(MjClient.playui.jsBind.eat.hu._node.visible)
        {
            var roomMsgValue = tData.tableid +":"+tData.roundNum;
            if (MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP|| MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ) {
                var saveRoomMsgValueH = util.localStorageEncrypt.getStringItem("IGNORE_H_TIP","");
                if(saveRoomMsgValueH.length > 0 && saveRoomMsgValueH == roomMsgValue){
                    MJPassConfirmToServer();
                    return;
                }
            }
            MjClient.showMsg("确认不胡吗?", function(result) {
                if(result && result.isSelect){
                    //选择了不在提示,
                    util.localStorageEncrypt.setStringItem("IGNORE_H_TIP",roomMsgValue);
                }
                MJPassConfirmToServer();
            }, function() {}, (MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP|| MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ) ? "3":"1");
        }
        else
        {
            MJPassConfirmToServer();
        }
    }
}


// 这个没看懂干嘛的
// off 是四个位置，根据off 显示四个位置的信息 by sking
function SetUserVisible_TYZZ(node, off)
{
    //var sData = MjClient.data.sData;
    //return;
    cc.log("====================off======================" + off);
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
        name_bg.visible = true;
        score_bg.visible = true;
        MjClient.loadWxHead(pl.info.uid, pl.info.headimgurl);
        setUserOffline(node, off);
        InitUserHandUI_TYZZ(node, off);
        //GLog("pl.info.uid = "+pl.info.uid);
    }
    else
    {
        name.visible = false;
        coin.visible = false;
        offline.visible = false;
        coin.visible = false;
        var WxHead = nobody.getChildByName("WxHead");
        if(WxHead)
        {
            WxHead.removeFromParent(true);
        }
    }
}




function InitUserHandUI_TYZZ(node, off)
{
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var pl = getUIPlayer(off);
    if(!pl)
    {
        return;
    }

    //初始化玩家金币和名称
    InitUserCoinAndName(node, off);
    if (off == 0) 
    {
        var tingSet = calTingSet(pl.mjhand, MjClient.data.sData.tData.hunCard);
        var downNode = MjClient.playui._downNode;
        if ((pl.tPutCard || Object.keys(tingSet).length > 0) && !downNode.getChildByName("AutoPut_btn")) 
        {
            var AutoPut_btn = AddAutoPutCheckBox();
            downNode.addChild(AutoPut_btn,999);
            AutoPut_btn.setSelected(pl.tPutCard)
        }
    }
    setAreaTypeInfo(true);
    //setPlayerRoundDir(off);
    // if(vnPos.indexOf(off) == -1)
    // {
    //     vnPos.push(off);
    // }

    if(
        tData.tState != TableState.waitPut &&
        tData.tState != TableState.waitEat &&
        tData.tState != TableState.waitCard
    )
    {
        return;
    }
    //刷新分数
    var coinNode = node.getChildByName("head").getChildByName("coin");
    changeAtalsForLabel(coinNode, pl.winall + pl.gangScore);    
    // 转转无混牌, 节点更名, 防止与有混牌的玩法在公用代码冲突
    // setHunNodeVisible(false);


    //添加碰
    for(var i = 0; i < pl.mjpeng.length; i++)
    {
        var idx = tData.uids.indexOf(pl.info.uid);
        var offIdx = (pl.pengchigang.peng[i].pos - idx + 4) % 4 - 1;//表示被碰的人和pl之间隔着几个人，如果是pl碰下家，则offIdx=0，pl碰上家，则offIdex=2
        var cdui = null;
        for(var j = 0; j < 3; j++)
        {
            if( (j % 3 == 2 - offIdx && off % 3 == 0) || (j % 3 == offIdx && off % 3 != 0) )
            {
                cdui = getNewCard(node, "up", "peng", pl.mjpeng[i], off, "heng", "heng");
            }
            else
            {
                cdui = getNewCard(node, "up", "peng", pl.mjpeng[i], off);
            }

            if (j == 2)
                cdui.ispeng3 = true;
        }
    }


    //添加明杠
    for(var i = 0; i < pl.mjgang0.length; i++)
    {
        var idx = tData.uids.indexOf(pl.info.uid);
        //var offIdx = 0;
        //if(i < pl.pengchigang.gang.length)
        //{
        //    offIdx = (pl.pengchigang.gang[i].pos - idx + 4) % 4 - 1;
        //}
        //else {
        //    offIdx = (pl.pengchigang.pgang[i-pl.pengchigang.gang.length].pos - idx + 4) % 4 - 1;
        //}
        var offIdx = null;
        for (var j=0; j<pl.pengchigang.gang.length; j++)
        {
            if (pl.pengchigang.gang[j].card == pl.mjgang0[i])
            {
                offIdx = (pl.pengchigang.gang[j].pos - idx + 4) % 4 - 1;
                break;
            }
        }
        if (offIdx == null)
        {
            for (var j=0; j<pl.pengchigang.pgang.length; j++)
            {
                if (pl.pengchigang.pgang[j].card == pl.mjgang0[i])
                {
                    offIdx = (pl.pengchigang.pgang[j].pos - idx + 4) % 4 - 1;
                    break;
                }
            }
        }
        if (offIdx == null)
        {
            cc.log("InitUserHandUI:offIdx == null!!!!");
            offIdx = 0;
        }

        for(var j = 0; j < 4; j++)
        {
            if(j == 3)
            {
                getNewCard(node, "up", "gang0", pl.mjgang0[i], off, "isgang4").tag = pl.mjgang0[i];//最后一张牌放上面
            }
            else
            {
                if( (j % 3 == 2 - offIdx && off % 3 == 0) || (j % 3 == offIdx && off % 3 != 0) )
                {
                    getNewCard(node, "up", "gang0", pl.mjgang0[i], off, "heng", "heng");
                }
                else
                {
                    getNewCard(node, "up", "gang0", pl.mjgang0[i], off);
                }
            }
        }
    }


    //添加暗杠
    for(var i = 0; i < pl.mjgang1.length; i++)
    {
        for(var j = 0; j < 4; j++)
        {
            if(j == 3)
            {
                getNewCard(node, "down", "gang1", 0, off, "isgang4").tag = pl.mjgang1[i];
            }
            else
            {
                getNewCard(node, "up", "gang1", pl.mjgang1[i], off);
            }
        }
    }

    //cc.log("pl.mjchi = " + pl.mjchi);
    var chiIdx = 0;
    var cdui = null;
    for(var i = 0; i < pl.mjchi.length; i++)
    {
        if(i % 3==0)
        {
            chiIdx++;
        }

        if(pl.mjchiCard[chiIdx-1] == pl.mjchi[i])//吃的横牌表示吃的是哪张牌
        {
            cdui = getNewCard(node, "up", "chi", pl.mjchi[i], off, "heng");
        }
        else
        {
            cdui = getNewCard(node, "up", "chi", pl.mjchi[i], off);
        }

        if (i % 3 == 2)
            cdui.ischi3 = true;
    }

    //添加打出的牌
    for(var i = 0; i < pl.mjput.length; i++)
    {
        var msg =
        {
            card: pl.mjput[i],
            uid: pl.info.uid
        };

        DealMJPut(node, msg, off, i);
    }

    //添加手牌
    if(MjClient.rePlayVideo == -1)//表示正常游戏
    {
        if(pl.mjhand && off == 0)
        {
            for(var i = 0; i < pl.mjhand.length; i++)
            {
                getNewCard(node, "stand", "mjhand", pl.mjhand[i], off);
            }
        }
        else if (pl.mjhand && pl.mjState == TableState.roundFinish) {
            COMMON_UI.showMjhandBeforeEndOnePlayer(off);
        }
        else
        {
            var CardCount = 0;
            if(tData.tState == TableState.waitPut && tData.uids[tData.curPlayer] == pl.info.uid)
            {
                CardCount = 14;
            }
            else
            {
                CardCount = 13;
            }

            var upCardCount = CardCount - ((pl.mjpeng.length + pl.mjgang0.length + pl.mjgang1.length) * 3 + pl.mjchi.length);
            for(var i = 0; i < upCardCount; i++)
            {
                getNewCard(node, "stand", "standPri");
            }
        }
    }
    else
    {
        /*
         播放录像
         */
        cc.log("_________________mjhand_replay_______________"+JSON.stringify(pl.mjhand));
        if (pl.mjhand)
        {
            if(off == 0)
            {
                for (var i = 0; i < pl.mjhand.length; i++) {
                    getNewCard(node, "stand", "mjhand", pl.mjhand[i], off);
                }
            }
            else
            {

                for (var i = 0; i < pl.mjhand.length && i < 13; i++) {
                    getNewCard(node, "up", "mjhand_replay", pl.mjhand[i], off);
                }
            }
        }

    }



    //添加手花
    if (pl.mjflower.length > 0)
    {
        MjClient.majiang.setFlowerImg(node, pl);
        ShowEatActionAnim(node,ActionType.FLOWER,off);
        //playEffect("lyg/nv/flower");
        playEffectInPlay("flower");
    }

    MjClient.playui.CardLayoutRestore(node, off);
}

function initFlower_TYZZ() {
    initFlower(false, false);
}


var PlayLayer_TYZZ = cc.Layer.extend({
    jsBind: {
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
                resetFlowerNum(this);
                if (tData.roundNum != tData.roundAll) return;

                cc.log("--------------same ip ------------------");
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
                if (ipmsg.length > 0 && !tData.matchId) {
                    //if(cc.sys.OS_WINDOWS != cc.sys.os)
                    {
                        //AlertSameIP(ipmsg.join("\n"));
                    }
                }
                mylog("ipmsg " + ipmsg.length);

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
            },
            roundEnd: function() {
                var self = this;
                var sData = MjClient.data.sData;
                var tData = sData.tData;
                // function delayExe()
                // {
                //     var sData = MjClient.data.sData;
                //     var tData = sData.tData;
                //     reConectHeadLayout(self);
                //     resetEatActionAnim();
		         //    if (sData.tData.roundNum <= 0)
                //     {
                //         if(!tData.matchId){
                //             self.addChild(new GameOverLayer(),500);
                //         }else{
                //             self.runAction(cc.sequence(cc.delayTime(3),cc.callFunc(function(){
                //                 self.addChild(new GameOverLayer(),500);
                //             })))
                //         }
                //     }
                //     self.addChild(new EndOneView_TYZZ(),500);
                // }


                var that = this;
                function showEndCards()
                {
                    reConectHeadLayout(self);
                    resetEatActionAnim();
                    if (sData.tData.roundNum <= 0)
                    {
                        if(!tData.matchId){
                            self.addChild(new GameOverLayer(),500);
                        }else{
                            self.runAction(cc.sequence(cc.delayTime(3),cc.callFunc(function(){
                                self.addChild(new GameOverLayer(),500);
                            })))
                        }
                    }
                    postEvent("updateScore");
                    self.addChild(new EndOneView_TYZZ(),500);
                }
                function delayExe()
                {
                    if(MjClient.rePlayVideo == -1)//正常游戏才显示摊牌
                    {
                        //弹小结算之前显示其他人牌
                        var action = cc.sequence(cc.delayTime(0.1),cc.callFunc(COMMON_UI.showMjhandBeforeEndOne),cc.delayTime(1.5),cc.callFunc(showEndCards));
                        action.setTag(20180719);
                        that.runAction(action);
                    }
                    else
                    {
                        var action = cc.sequence(cc.delayTime(0.2),cc.callFunc(showEndCards));
                        action.setTag(20180719);
                        that.runAction(action);
                    }
                }

                function addshowcardlayer()
                {
                    if(MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP){
                        MjClient.Scene.addChild(new majiang_showBird(showCards,function(){
                            showEndCards();
                        })); 
                    }else{
                       MjClient.Scene.addChild(new HAHZ_showCardLayer(showCards,function(){
                            if(showCards.length == 1){
                                delayExe();
                            }else{
                                showEndCards();
                            }
                        })); 
                    }

                    
                }
                var showCards = tData.mopai;


                var showFanPai = MjClient.rePlayVideo == -1;
                var action;
                if(!showCards || cc.isUndefined(showCards) || showCards.length <= 0 )
                {
                    //胡牌牌型动画、（一炮多响时则等待所有人胡完）倒牌→0.5S→小结算
                    action = cc.sequence(cc.delayTime(0.25),showFanPai ?cc.callFunc(COMMON_UI.showMjhandBeforeEndOne):cc.delayTime(0),cc.delayTime(0.5),cc.callFunc(showEndCards));
                }else if(showCards.length == 1){
                    //胡牌牌型动画、（一炮多响时则等待所有人胡完）倒牌&捉鸟→0.5S→小结算
                    action = cc.sequence(cc.delayTime(0.25),cc.callFunc(addshowcardlayer));
                }else{
                    //胡牌牌型动画、（一炮多响时则等待所有人胡完）倒牌→0.5S→抓鸟→小结算
                    action = cc.sequence(cc.delayTime(0.25),showFanPai ?cc.callFunc(COMMON_UI.showMjhandBeforeEndOne):cc.delayTime(0),cc.delayTime(0.5),cc.callFunc(addshowcardlayer));
                }
                action.setTag(20180626);
                this.runAction(action);

/*                MjClient.Scene.addChild(new HAHZ_showCardLayer(showCards,function(){
                    delayExe();
                }));*/

            },
            moveHead: function() {
                postEvent("returnPlayerLayer");
                tableStartHeadMoveAction(this);
                MjClient.playui._btnFlower && MjClient.playui._btnFlower.setVisible(true);
                initFlower_TYZZ();
            },
            initSceneData: function() {
                reConectHeadLayout(this);
                cc.log("initSceneData -----------------gunyun = " + JSON.stringify(this));
                CheckRoomUiDelete();

                if(MjClient.data.sData.tData.tState <= TableState.waitReady)
                {
                    sendGPS();
                    MjClient.checkChangeLocationApp();
                }
            },
            onlinePlayer: function() {
                reConectHeadLayout(this);
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
            changeMJBgEvent: function() {
                changeMJBg(this, getCurrentMJBgType());
            },
            MJPeng: function() {
                MjClient.playui.EatVisibleCheck();
            },
            MJChi: function() {
            },
            MJGang: function() {
            }
        },
        roundnumImg: {
            _run:function () {
                //roundnumImgObj = this;
                MjClient.roundnumImgNode = this;
                setWgtLayout(this,[0.086, 0.042], [0.5, 0.5], [-1.4, 1.0]);
            },
            _event: {
                initSceneData: function(eD) {
                    this.visible = IsArrowVisible();
                },
                mjhand: function(eD) {
                    this.visible = IsArrowVisible();
                },
                onlinePlayer: function(eD) {
                    //this.visible = IsArrowVisible();
                }
            },
            roundnumAtlas: {
                _run:function(){
                    this.ignoreContentAdaptWithSize(true);
                },
                _text: function() {
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    var extraNum = tData.extraNum ? tData.extraNum:0;
                    if (tData) return "第" + (tData.roundAll-tData.roundNum + 1 + extraNum)+"/"+tData.roundAll + "局";
                },
                _event: {
                    mjhand: function() {
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;
                        var extraNum = tData.extraNum ? tData.extraNum:0;
                        if (tData) this.setString("第" + (tData.roundAll-tData.roundNum + 1 + extraNum) +"/"+tData.roundAll + "局");
                    },
                    initSceneData: function() {
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;
                        var extraNum = tData.extraNum ? tData.extraNum:0;
                        if (tData) this.setString("第" + (tData.roundAll-tData.roundNum + 1 + extraNum)+"/"+tData.roundAll + "局");
                    }
                }
            }
        },
        cardNumImg: {
            _run:function () {
                MjClient.cardNumImgNode = this;
                setWgtLayout(this,[0.086, 0.042], [0.5, 0.5], [1.4, 1.0]);
            },
            _event: {
                initSceneData: function(eD) {
                    this.visible = IsArrowVisible();
                },
                mjhand: function(eD) {
                    this.visible = IsArrowVisible();
                },
                onlinePlayer: function(eD) {
                    //this.visible = IsArrowVisible();
                }
            },
            cardnumAtlas: {
                _run:function(){
                    this.ignoreContentAdaptWithSize(true);
                },
                _text: function() {
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    if (tData) return MjClient.majiang.getAllCardsTotal() - tData.cardNext;
                },
                _event: {
                    waitPut: function() {
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;
                        if (tData) this.setString(MjClient.majiang.getAllCardsTotal() - tData.cardNext);
                        cc.log(MjClient.majiang.getAllCardsTotal() + "-----------------waitPut------------------" + tData.cardNext);
                    }
                }
            }
        },
        back: {
            back: {
                _run: function() {
                    changeGameBg(this);
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
            LeftBottom:{
                _layout: [
                    [0.1, 0.1],
                    [0.03, 0.045],
                    [0, 0]
                ],
            },
            RightBottom:{
                _layout: [
                    [0.1, 0.1],
                    [0.97,0.05],
                    [0, 0]
                ],
            },
            RightTop:{
                _layout: [
                    [0.1, 0.1],
                    [0.97,0.95],
                    [0, 0]
                ],
            },
            leftTop:{
                _layout: [
                    [0.1, 0.1],
                    [0.03,0.95],
                    [0,0]
                ],
                // _run:function()
                // {
                //     var text = new ccui.Text();
                //     text.setFontName(MjClient.fzcyfont);
                //     text.setFontSize(20);
                //     text.setRotation(-90);
                //     text.setAnchorPoint(0,0.5);
                //     text.setPosition(23.5, 20.5);
                //     this.addChild(text);
                //     text.schedule(function(){
                //         var time = MjClient.getCurrentTime();
                //         var str = time[0]+"/"+time[1]+"/"+ time[2]+" "+
                //             (time[3]<10?"0"+time[3]:time[3])+":"+
                //             (time[4]<10?"0"+time[4]:time[4])+":"+
                //             (time[5]<10?"0"+time[5]:time[5]);
                //         this.setString(str);
                //     });
                // }
            }
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
                [0.5, 0.62],
                [0, 1.2]
            ]
        },
        roundInfo:{
            _layout: [
                [0.12, 0.12],
                [0.5, 0.38],
                [0, 0.6]
            ],
            _run:function()
            {

                var tData = MjClient.data.sData.tData;
                this.ignoreContentAdaptWithSize(true);
                this.setString(getPlayingRoomInfo(0));
                showPlayUI_roundInfo(this.getString(),tData.tableid);

                // var tData = MjClient.data.sData.tData;
                // var str = "";
                //
                // switch (tData.areaSelectMode.zhuaniao)
                // {
                //     case 0:
                //         str += "不抓鸟";
                //         break;
                //     case 1:
                //         str += "上中下鸟";
                //         break;
                //     case 2:
                //         str += "2鸟";
                //         break;
                //     case 4:
                //         str += "4鸟";
                //         break;
                //     case 6:
                //         str += "6鸟";
                //         break;
                //     case 10:
                //         str += "一鸟全中";
                //         break;
                //     default:
                //         break;
                // }
                //
                // str += tData.areaSelectMode.qianggangsuanzimo ? ",抢杠胡算自摸,":"";
                // str += tData.areaSelectMode.qianggangsuandianpao ? ",抢杠胡算点炮":"";
                // str += (tData.areaSelectMode.qianggangsuanzimo || tData.areaSelectMode.qianggangsuandianpao)
                //     && tData.areaSelectMode.wuhongzhong ? ",无红中可抢杠胡":"";
                // var type = tData.areaSelectMode.zhuaniao == 2 || tData.areaSelectMode.zhuaniao == 4 || tData.areaSelectMode.zhuaniao == 6
                // str += (type && tData.areaSelectMode.buzhongsuanquanzhong) ? ",不中算全中" : "";
                // str += tData.areaSelectMode.difen ? ",底分" + tData.areaSelectMode.difen:"";
                // str += tData.areaSelectMode.zhuangxianfen ? ",庄闲分":"";
                // str += tData.areaSelectMode.dianpao ? ",点炮胡":"";
                // str += tData.areaSelectMode.qidui ? ",七对可胡":"";
                // if (tData.areaSelectMode.zhuaniao != 0 && tData.areaSelectMode.zhuaniao != 10) {
                //     if (tData.areaSelectMode.niaofen == 1) str += ",中鸟1分";
                //     if (tData.areaSelectMode.niaofen == 2) str += ",中鸟2分";
                // }
                //
                // //str += (tData.areaSelectMode.maxPlayerCount == 3)  ? ",3人":",4人";
                // switch (tData.areaSelectMode.hongzhong)
                // {
                //     case 0:
                //         str += ",无癞子"
                //         break;
                //     case 4:
                //         str += ",4红中"
                //         break;
                //     case 8:
                //         str += ",8红中"
                //         break;
                //     default:
                //         break;
                // }
                // str += tData.areaSelectMode.canChi ? ",可吃" : "";
                // str += tData.areaSelectMode.quanzhongfanbei ? ",全中翻倍" : "";
                // str += tData.areaSelectMode.bihuType ? ",有胡必胡" : "";
                // str += tData.areaSelectMode.jiapiao ? ",飘分" : "";
                // cc.log("tData.areaSelectMode roundInfo= " + JSON.stringify(tData.areaSelectMode));
                //
                //
                // this.ignoreContentAdaptWithSize(true);
                // var strPayWay = "";
                // // switch (tData.areaSelectMode.payWay)
                // // {
                // //     case 0:
                // //         strPayWay = ",房主付";
                // //         break;
                // //         strPayWay = ",AA付";
                // //         break;
                // //     case 2:
                // //         strPayWay = ",大赢家付";
                // //         break;
                // // }
                //
                // var str1 = strPayWay;
                // this.setString(str + str1);
                //
                // //比赛场
                // var BSStr = "";
                // if(tData.matchId){
                //     BSStr = ",10秒出牌";
                //     this.setString(GameCnName[MjClient.gameType]+","+str + str1 + BSStr);
                // }

                var tData = MjClient.data.sData.tData;
                if(tData.matchId && tData.matchInfo){
                    if(MjClient.matchRank){
                        showPlayUI_matchInfo("排名："+MjClient.matchRank+"/"+tData.matchInfo.userCount+"\n前"+tData.matchInfo.jingjiCount+"名晋级");
                    }else {
                        showPlayUI_matchInfo("排名："+tData.matchInfo.userCount+"/"+tData.matchInfo.userCount+"\n前"+tData.matchInfo.jingjiCount+"名晋级");
                    }
                }
            }
        },
        banner: {
            _layout: [
                [0.5, 0.5],
                [0.5, 1],
                [0, 0]
            ],
            bg_time:{
                 _run:function()
                {
                    var text = new ccui.Text();
                    if(MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP|| MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ) {//岳阳同一使用方正兰亭
                        text.setFontName("fonts/lanting.TTF");
                    }else{
                        text.setFontName(MjClient.fzcyfont);
                    }
                    text.setFontSize(26);
                    
                    text.setAnchorPoint(1,0.5);
                    text.setPosition(66, 13);
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
                    cc.log("powerBar_run");
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
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    if(tData.matchId){
                        this.setVisible(false);
                    }
                },
                _event: {
                    initSceneData: function() {
                        this.ignoreContentAdaptWithSize(true);
                        this.setString(MjClient.data.sData.tData.tableid);
                    }
                }
            },
            setting: {
                _click: function() {
                    var settringLayer = new SettingView();
                    settringLayer.setName("PlayLayerClick");
                    MjClient.Scene.addChild(settringLayer);
                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Shezhi", {uid:SelfUid(),gameType:MjClient.gameType});
                }
            },
            Button_1: {
                _visible : true,
                _click: function() {
                    MjClient.openWeb({url:MjClient.GAME_TYPE.HA_HONGZHONG,help:true});
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
                            var tData = MjClient.data.sData.tData;
                            var _hongzhong = tData.areaSelectMode.hongzhong;
                            if(_hongzhong != 0)
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
                        this.setVisible(true);
                    },
                    _event: {
                        mjhand:function()
                        {
                            var tData = MjClient.data.sData.tData;
                            var _hongzhong = tData.areaSelectMode.hongzhong;

                            this.visible = true;

                            var HuncardMsg = MjClient.data.sData.tData.hunCard;
                            if(_hongzhong != 0)
                            {
                                setCardSprite(this, parseInt(HuncardMsg), 4);
                                this.runAction(cc.sequence(cc.delayTime(1),
                                    cc.spawn(cc.scaleTo(0.6,0.5))));
                            }
                            else {
                                this.getParent().visible = false;
                            }
                        },
                        initSceneData:function()
                        {
                            this.visible = true;
                            var tData = MjClient.data.sData.tData;
                            var _hongzhong = tData.areaSelectMode.hongzhong;

                            var HuncardMsg = MjClient.data.sData.tData.hunCard;
                            if(HuncardMsg && _hongzhong != 0)
                            {
                                setCardSprite(this, parseInt(HuncardMsg), 4);
                            }
                            else {
                                this.getParent().visible = false;
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
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;
                        var _hongzhong = tData.areaSelectMode.hongzhong;
                        if(_hongzhong != 0)
                            this.visible = true;
                        else
                        {
                            this.visible = false;
                        }
                    },
                    initSceneData:function()
                    {
                        this.visible = true;
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;
                        var _hongzhong = tData.areaSelectMode.hongzhong;
                        cc.log(" tData.tState  ------------sking = " + tData.tState );
                        if(tData.tState != TableState.waitPut &&
                            tData.tState != TableState.waitEat &&
                            tData.tState != TableState.waitCard
                        )
                        {
                            this.visible = false;
                        }else{
                            if(_hongzhong != 0)
                                this.visible = true;
                            else
                            {
                                this.visible = false;
                            }
                        }
                    }
                }
            },
        },
        // arrowbk: {
        //     _layout: [
        //         [0.129, 0.229],
        //         [0.5, 0.5],
        //         [0, 0.25]
        //     ],
        //     _run:function () {
        //         MjClient.arrowbkNode = this;
        //         setDirVisible(this, true);
        //         setArrowFengDir(this);
        //         // windObj["dong"] = this.getChildByName("dir_right");
        //         // windObj["nan"] = this.getChildByName("dir_down");
        //         // windObj["xi"] = this.getChildByName("dir_left");
        //         // windObj["bei"] = this.getChildByName("dir_up");
        //         // windPos["dong"] = windObj["dong"].getPosition();
        //         // windPos["nan"]   = windObj["nan"].getPosition();
        //         // windPos["xi"]   =  windObj["xi"].getPosition();
        //         // windPos["bei"]  = windObj["bei"].getPosition();
        //     },
        //     _event: {
        //         initSceneData: function(eD) {
        //             this.visible = IsArrowVisible();
        //             SetArrowRotation(this)
        //         },
        //         mjhand: function(eD) {
        //             this.visible = IsArrowVisible();
        //             SetArrowRotation(this);
        //         },
        //         onlinePlayer: function(eD) {
        //             //this.visible = IsArrowVisible();
        //         },
        //         waitPut: function() {
        //             SetArrowRotation(this)
        //         },
        //         MJPeng: function(eD) {
        //             SetArrowRotation(this)
        //         },
        //         MJChi: function(eD) {
        //             SetArrowRotation(this)
        //         },
        //         MJGang: function(eD) {
        //             SetArrowRotation(this)
        //         },
        //         MJFlower: function(eD) {
        //             SetArrowRotation(this)
        //         },
        //
        //     },
        //     number: {
        //         _run: function() {
        //             this.setString("00");
        //             //arrowbkNumberUpdate(this);
        //             this.ignoreContentAdaptWithSize(true);
        //         },
        //         _event: {
        //             MJPeng: function() {
        //                 this.stopAllActions();
        //                 stopEffect(playTimeUpEff);
        //                 playTimeUpEff = null;
        //                 arrowbkNumberUpdate(this);
        //             },
        //             MJChi: function() {
        //                 this.stopAllActions();
        //                 stopEffect(playTimeUpEff);
        //                 playTimeUpEff = null;
        //                 arrowbkNumberUpdate(this);
        //             },
        //             waitPut: function() {
        //                 this.stopAllActions();
        //                 stopEffect(playTimeUpEff);
        //                 playTimeUpEff = null;
        //                 var eat = MjClient.playui.jsBind.eat;
        //                 var endFunc = null;
        //                 if (IsTurnToMe()
        //                     && !eat.ting._node.visible
        //                     && !eat.hu._node.visible
        //                     && !eat.peng._node.visible
        //                     && !eat.chi0._node.visible
        //                     && !eat.gang0._node.visible
        //                     && !eat.gang1._node.visible
        //                     && !eat.gang2._node.visible) {
        //                     endFunc = MjClient.playui.jsBind.BtnPutCard._click;
        //                 }
        //                 arrowbkNumberUpdate(this, endFunc);
        //             },
        //             MJPut: function(msg) {
        //                 if (msg.uid == SelfUid()) {
        //                     this.stopAllActions();
        //                     stopEffect(playTimeUpEff);
        //                     playTimeUpEff = null;
        //                     //arrowbkNumberUpdate(this);
        //                     this.setString("00");
        //                 }
        //             },
        //             roundEnd: function() {
        //                 this.stopAllActions();
        //                 stopEffect(playTimeUpEff);
        //                 playTimeUpEff = null;
        //             },
        //             LeaveGame: function() {
        //                 this.stopAllActions();
        //                 stopEffect(playTimeUpEff);
        //                 playTimeUpEff = null;
        //             }
        //         }
        //     },
        // },
        wait: {
            getRoomNum: {
                _run:function(){
                    setWgtLayout(this, [0.18, 0.18],[0.5, 0.1],[0, 0]);
                },
                _visible:function()
                {
                    return !MjClient.remoteCfg.guestLogin;
                },
                _click: function() {
                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Fuzhifangjianxinxi", {uid:SelfUid(), gameType:MjClient.gameType});

                    /*
                     复制房间号-----------------------
                     */
                    var tData = MjClient.data.sData.tData;
                    var str1 = "转转麻将 "
                    var str2 = "";
                    //var strZaiMo = "";
                    var str = "";

                    switch (tData.areaSelectMode.zhuaniao)
                    {
                        case 0:
                            str += "不抓鸟,";
                            break;
                        case 1:
                            str += "上中下鸟,";
                            break;
                        case 2:
                            str += "2鸟,";
                            break;
                        case 4:
                            str += "4鸟,";
                            break;
                        case 6:
                            str += "6鸟,";
                            break;
                        case 9:
                            str += "摸几奖几,";
                            break;
                        case 10:
                            str += "一鸟全中,";
                            break;
                        default:
                            break;
                    }

                    if (tData.areaSelectMode.zuoZhuang) {
                        str += tData.areaSelectMode.zuoZhuang == 0 ? "随机坐庄," : "先进房坐庄,";
                    }

                    str += tData.areaSelectMode.zhuangxianfen ? "庄闲分,":"";
                    str += tData.areaSelectMode.dianpao ? "点炮胡,":"";
                    str += tData.areaSelectMode.qidui ? "七对可胡,":"";
                    str += (tData.maxPlayer == 3)  ? "3人,":"4人,";
                    if (tData.areaSelectMode.zhuaniao != 0 && tData.areaSelectMode.zhuaniao != 10) {
                        if (tData.areaSelectMode.niaofen == 1) str += "中鸟1分,";
                        if (tData.areaSelectMode.niaofen == 2) str += "中鸟2分,";
                    }
                    str += tData.areaSelectMode.jiapiao ? "飘分," : "";
                    str += tData.areaSelectMode.queYiMen ? "缺一门," : "";
                    str += tData.areaSelectMode.piaoniao ? "围一飘鸟," : "";
                    str += tData.areaSelectMode.anzhuang ? "按庄家抓鸟," : "";
                    str += tData.areaSelectMode.buLunKong ? "抓鸟不论空," : "";
                    str += tData.areaSelectMode.canChi ? "可吃," : "";

                    if(MjClient.getAppType() === MjClient.APP_TYPE.QXYYQP){
                        if(tData.areaSelectMode["ziMoScore"] == 1){
                            str += "自摸底分4,"; 
                        }else{ 
                            str += "自摸底分2,";  
                        }

                        if(tData.areaSelectMode["dianPaoScore"] == 1){ 
                            str += "底分2,"; 
                        }else{
                            str += "底分1,";  
                        } 
                    }


                    switch (tData.areaSelectMode.hongzhong)
                    {
                        case 0:
                            str += "无癞子,"
                            break;
                        case 4:
                            str += "4红中,"
                            break;
                        case 8:
                            str += "8红中,"
                            break;
                        default:
                            break;
                    }

                    var strPayWay = "";
                    switch (tData.areaSelectMode.payWay)
                    {
                        case 0:
                            strPayWay = "房主付,";
                            break;
                        case 1:
                            strPayWay = "AA付,";
                            break;
                        case 2:
                            strPayWay = "大赢家付,";
                            break;
                    }



                    var str5 = strPayWay;
                    var str55 = (tData.maxPlayer == 3 ) ? "二":"三";
                    var str6 = tData.roundNum + "局,"+ str55 + "缺一,速度加入【"+AppCnName[MjClient.getAppType()]+"】\n" + "(复制此消息打开游戏可直接进入该房间)";
                    GLog(str1+str2+str+str5+str6);
                    MjClient.native.doCopyToPasteBoard("房间号:[" + tData.tableid + "]\n" + str1+str2+str+str5+str6);
                    MjClient.showMsg("已复制房间号，请不要返回大厅。打开微信后粘贴房间信息。", function(){
                        MjClient.native.openWeixin();
                    }, function(){});
                }
            },
            wxinvite: {
                _layout: [
                    [0.18, 0.18],
                    [0.5, 0.23],
                    [0, 0]
                ],
                _click: function() {
                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Yaoqingweixinhaoyou", {uid:SelfUid(), gameType:MjClient.gameType});

                    var tData = MjClient.data.sData.tData;
                    var str1 = ""
                    var str2 = "";
                    var str = "";

                    switch (tData.areaSelectMode.zhuaniao) {
                        case 0:
                            str += "不抓鸟,";
                            break;
                        case 1:
                            str += "上中下鸟,";
                            break;
                        case 2:
                            str += "2鸟,";
                            break;
                        case 4:
                            str += "4鸟,";
                            break;
                        case 6:
                            str += "6鸟,";
                            break;
                        case 9:
                            str += "摸几奖几,";
                            break;
                        case 10:
                            str += "一鸟全中,";
                            break;
                        default:
                            break;
                    }

                    if (tData.areaSelectMode.zuoZhuang) {
                        str += tData.areaSelectMode.zuoZhuang == 0 ? "随机坐庄," : "先进房坐庄,";
                    }

                    str += tData.areaSelectMode.zhuangxianfen ? "庄闲分,":"";
                    str += tData.areaSelectMode.dianpao ? "点炮胡,":"";
                    str += tData.areaSelectMode.qidui ? "七对可胡,":"";
                    var cfg = {2:"2人",3:"3人",4:"4人"};
                    str += cfg[tData.maxPlayer];
                    if (tData.areaSelectMode.zhuaniao != 0 && tData.areaSelectMode.zhuaniao != 10) {
                        if (tData.areaSelectMode.niaofen == 1) str += "中鸟1分,";
                        if (tData.areaSelectMode.niaofen == 2) str += "中鸟2分,";
                    }
                    str += tData.areaSelectMode.jiapiao ? "飘分," : "";
                    str += tData.areaSelectMode.queYiMen ? "缺一门," : "";
                    str += tData.areaSelectMode.piaoniao ? "围一飘鸟," : "";
                    str += tData.areaSelectMode.anzhuang ? "按庄家抓鸟," : "";

                    str += tData.areaSelectMode.buLunKong ? "抓鸟不论空," : "";
                    str += tData.areaSelectMode.canChi ? "可吃," : "";

                    if(MjClient.getAppType() === MjClient.APP_TYPE.QXYYQP){
                        if(tData.areaSelectMode["ziMoScore"] == 1){
                            str += "自摸底分4,"; 
                        }else{ 
                            str += "自摸底分2,";  
                        }

                        if(tData.areaSelectMode["dianPaoScore"] == 1){ 
                            str += "底分2,"; 
                        }else{
                            str += "底分1,";  
                        } 
                    }

                    
                    switch (tData.areaSelectMode.hongzhong)
                    {
                        case 0:
                            str += "无癞子,"
                            break;
                        case 4:
                            str += "4红中,"
                            break;
                        case 8:
                            str += "8红中,"
                            break;
                        default:
                            break;
                    }

                    var strPayWay = "";
                    switch (tData.areaSelectMode.payWay) {
                        case 0:
                            strPayWay = "房主付,";
                            break;
                        case 1:
                            strPayWay = "AA付,";
                            break;
                        case 2:
                            strPayWay = "大赢家付,";
                            break;
                    }

                    var str5 = strPayWay;
                    var oCfg = {2:"一",3:"二",4:"三"};
                    var str55 = oCfg[tData.maxPlayer];
                    var str6 = tData.roundNum + "局," + "速度加入【" + AppCnName[MjClient.getAppType()] + "】";
                    var clubInfoTable = getClubInfoInTable();
                    var txt_club = clubInfoTable ? "亲友圈(" + clubInfoTable.clubId + ")" : "";
                    GLog(str1 + str2 + str + str5 + str6 + txt_club);

                    MjClient.getInviteUrl(function (url) {
                        MjClient.native.wxShareUrl(url,
                            GameCnName[MjClient.gameType] + "  " + tData.tableid + str55 + "缺一  点击加入>>>" + txt_club,
                            ((clubInfoTable && clubInfoTable.ruleName) ? GameCnName[MjClient.gameType] + "," : "") + str1 + str2 + str + str5 + str6);
                    });
                },
                _visible:function()
                {
                    return !MjClient.remoteCfg.guestLogin;
                }
            },
            delroom: {
                _run:function(){
                    if (isIPhoneX()) {
                        setWgtLayout(this, [0.11, 0.11],[0.1, 0.45],[0, 0]);
                    }
                    else {
                        setWgtLayout(this, [0.11, 0.11],[0.05, 0.45],[0, 0]);
                    }
                },
                _click: function() {
                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Jiesanfangjian", {uid:SelfUid(), gameType:MjClient.gameType});

                    MjClient.delRoom(true);
                }
            },
            backHomebtn: {
                _run:function(){
                    if (isIPhoneX()) {
                        setWgtLayout(this, [0.11, 0.11],[0.1, 0.6],[0, 0]);
                    }
                    else {
                        setWgtLayout(this, [0.11, 0.11],[0.05, 0.6],[0, 0]);
                    }
                },
                _click: function(btn) {
                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Likaifangjian", {uid:SelfUid(), gameType:MjClient.gameType});

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
                        this.visible = IsInviteVisible();
                    },
                    addPlayer: function(eD) {
                        this.visible = IsInviteVisible();
                    },
                    removePlayer: function(eD) {
                        this.visible = IsInviteVisible();
                    }
                }
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
        BtnPutCard:{ //add by  sking for put card button
            _run: function () {

                var tData = MjClient.data.sData.tData;
                cc.log("BtnPutCard _run set put card btn state = " + tData.tState );

                if(!IsTurnToMe() || tData.tState != TableState.waitPut)
                {
                    // cc.log(" it's not my turn------------------sking");
                    this.visible = false;
                }
                else
                {
                    // cc.log(" it's my turn------------------sking");
                    this.visible = true;
                }

                setWgtLayout(this,[0.18, 0.18], [0.82, 0.3], [0.7, -0.1]);
            },
            _click: function(btn) {
                cc.log("点击出牌");
                //var sData = MjClient.data.sData;
                //cc.log("sData.tState == " + sData.tState);
                var downNode = MjClient.playui._downNode;
                var standUI = downNode.getChildByName("stand");
                var children = downNode.children;
                for(var i = 0; i < children.length; i++)
                {
                    if(children[i].name == "mjhand")
                    {
                        if(children[i].y > standUI.y + 10)
                        {
                            PutOutCard(children[i], children[i].tag); //可以出牌
                            break;
                        }
                    }
                }
                this.visible = false;
            },
            _event:{
                //拿到一张牌的时候，出牌按钮亮起，其他状态隐藏，by sking
                mjhand: function() {
                    this.visible = false;
                    cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>initSceneData");
                },
                MJHu:function(){
                    this.visible = false;
                    cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>mjhand");
                },
                newCard: function(eD)
                {
                    cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>newCard by sking");
                    this.visible = true;
                    //setWgtLayout(this, [0.1, 0.1],[0.7, 0.2],[0, 0]);
                },
                MJPut: function(eD) {
                    cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>MJPut by sking");
                    this.visible = false;
                },
                MJChi: function(eD) {
                    cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>MJChi by sking");
                    if(IsTurnToMe())
                    {
                        this.visible = true;
                    }
                },
                MJGang: function(eD) {
                    cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>MJGang by sking");
                    var pl = getUIPlayer(0);
                    var rtn = MjClient.majiang.canGang1(pl.mjpeng, pl.mjhand, pl.putCount);
                    if(IsTurnToMe() && rtn.length > 0)
                    {
                        this.visible = true;
                    }else{
                        this.visible = false;
                    }

                },
                MJPeng: function(eD) {
                    cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>MJPeng by sking");
                    if(IsTurnToMe())
                    {
                        //cc.log("    ----------------------peng  btn show----");
                        this.visible = true;
                    }
                },
                MJTing: function (eD) {
                    if(MjClient.playui.isCanPutCard())
                    {
                        this.visible = true;
                        cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>MJTing by sking - hide");
                    }else{
                        this.visible = false;
                    }
                },
                waitPut: function() {
                    var pl = getUIPlayer(0);
                    var eat = MjClient.playui.jsBind.eat;
                    if (IsTurnToMe() && pl.isTing && !eat.hu._node.visible && !eat.gang0._node.visible && !eat.gang1._node.visible && !eat.gang2._node.visible) {
                        cc.log("*********自动出牌*********");
                        this.runAction(cc.sequence(cc.delayTime(0.8), 
                            cc.callFunc(MjClient.playui.jsBind.BtnPutCard._click)));
                    }else{
                        if(MjClient.playui.isCanPutCard())
                        {
                            if(eat.hu._node.visible)
                            {
                                this.visible = false;
                                cc.log("--------------------有胡按钮拉--------------");
                            }
                            else
                            {
                                this.visible = true;
                            }
                        }
                    }
                }
            }
        },//end of add by sking
        down: {
            head: {
                TG_CountDown:{//托管倒计时
                    _run:function () {
                        this.visible = false;
                        this.ignoreContentAdaptWithSize(true);
                    },
                    _event:{
                        trustTip:function (msg) {
                            if(getUIPlayer(0)&&getUIPlayer(0).info.uid == msg.uid){
                                this.visible = true;
                                this.setString(msg.tipCountDown);
                                var tipCountDown = msg.tipCountDown;
                                var self = this;
                                this.schedule(function () {
                                    self.setString(tipCountDown);
                                    if (tipCountDown > 0) {
                                        tipCountDown--;
                                    }else {
                                        self.setVisible(false);
                                        self.unscheduleAllCallbacks();
                                    }
                                }, 1, cc.REPEAT_FOREVER, 0);
                            }
                        },
                        MJPut:function (msg) {
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
                        },
                        initSceneData:function (msg) {
                            var pl = getUIPlayer(0);
                            if(pl&&pl.trust){
                                this.visible = true;
                            }else {
                                this.visible = false;
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
                            showUserZhuangLogo(this, 0);
                        },
                        initSceneData: function() {
                            if (IsArrowVisible()) showUserZhuangLogo(this, 0);
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
                                cc.log("show user Chat MJCHAT" );
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
                    // this.zIndex = 600;
                    showFangzhuTagIcon(this,0);
                },
                score_bg:{_visible:false},
                name_bg:{_visible:false},
                flower_layout: {_visible:false},
                flower_zfb_layout : {_visible:false},
                tingCard: { //add by sking
                    _visible:false,
                    _event: {
                        MJTing: function (eD) {
                            if(eD.uid == SelfUid())
                            {
                                var pl = getUIPlayer(0);
                                pl.putCardAfterTing = eD.putCardAfterTing;
                                MjClient.playui.setTingCardInfo(this,eD,0);
                            }
                        },
                        clearCardUI: function(eD) {
                            cc.log("ready to----- clear sking ----");
                            this.visible = false;
                        },
                        MJHu: function(eD) {
                            this.visible = false;
                        },
                        onlinePlayer: function(eD) {
                            //MjClient.playui.setTingCardInfo(this,eD,0);
                        },
                        initSceneData:function(eD)
                        {
                            MjClient.playui.setTingCardInfo(this,eD,0);
                        }
                    }
                },
                tingIcon: {
                    _visible:false,
                    _run:function(){
                        this.visible = false;
                        this.runAction(cc.sequence(cc.spawn(cc.tintTo(0.6, 255,0,0),cc.scaleTo(0.6,this.getScale() + 0.3)),
                            cc.spawn(cc.tintTo(0.6, 255,255,255),cc.scaleTo(0.6,this.getScale()))).repeatForever());
                    },
                    _event: {
                        clearCardUI: function(eD) {
                            this.visible = false;
                        },
                        MJHu: function(eD) {
                            this.visible = false;
                        },
                        moveHead: function() {
                            MjClient.playui.tingIconVisible(this, 0);
                        },
                        onlinePlayer: function(eD) {
                            //MjClient.playui.tingIconVisible(this,0);
                        },
                        initSceneData:function(eD)
                        {
                            MjClient.playui.tingIconVisible(this,0);
                        },
                        roundEnd: function(){
                            // cc.log("end rounde------------------------");
                            this.visible = false;
                        }
                    }
                },
                huaCount: {
                    _run:function(){
                        changeAtalsForLabel(this,0);
                    },
                    _event:
                    {
                        clearCardUI: function(eD) {
                            changeAtalsForLabel(this,0);
                        }
                    }
                },//end of by sking
                skipHuIconTag: {
                    _visible:false,
                    _event: {
                        clearCardUI: function(eD) {
                            this.visible = false;
                        },
                        MJHu: function(eD) {
                            this.visible = false;
                        },
                        initSceneData:function(eD)
                        {
                            var pl = getUIPlayer(0);
                            if (pl.skipHu) {
                                //var _skipHuIconNode =  MjClient.playui._downNode.getChildByName("head").getChildByName("skipHuIconTag");
                                this.visible = true;
                            }
                        }
                    }
                },
                skipPengIconTag: {
                    _visible:false,
                    _event: {
                        clearCardUI: function(eD) {
                            this.visible = false;
                        },
                        MJpeng: function(eD) {
                            this.visible = false;
                        },
                        initSceneData:function(eD)
                        {
                            var pl = getUIPlayer(0);
                            if (pl.skipPeng.length > 0) {
                                //var _skipHuIconNode =  MjClient.playui._downNode.getChildByName("head").getChildByName("skipHuIconTag");
                                this.visible = true;
                            }else{
                                this.visible = false;
                            }
                        }
                    }
                   
                },
                gangScore: {
                    _run:function () {
                        this.visible = false;
                        var winNode = this.getChildByName("win");
                        winNode.setUserData({pos:winNode.getPosition()});
                    },
                    _event: {
                        MJGangScore: function(d){
                            MjClient.playui.updateGangScore(this, d, 0);
                        },
                        initSceneData: function(){
                            this.visible = false;
                        }
                    }
                },
                newGangScore: {
                    _run:function () {
                        this.visible = false; 
                        this.setUserData({pos:this.getPosition()}); 
                    },
                    _event: {
                        MJGangScore: function(d){
                            MjClient.playui.newUpdateGangScore(this, d, 0);
                        },
                        initSceneData: function(){
                            this.visible = false;
                        }
                    }
                },
                piao: {
                    _run: function(){
                        this.visible = false;
                    },
                    _event: {
                        initSceneData: function(){
                            var pl = getUIPlayer(0);
                            if(!pl || pl.jiazhuNum < 0){
                                return;
                            }
                            this.visible = true;
                            var content = pl.jiazhuNum == 0? "不飘" : "飘" + pl.jiazhuNum;
                            var tData = MjClient.data.sData.tData;
                            if(tData.areaSelectMode.piaoniao){
                                content = "鸟+" + pl.jiazhuNum;
                            }
                            this.setString(content);
                        },
                        MJJiazhu: function(d){
                            var pl = getUIPlayer(0);
                            if(pl && pl.info.uid != d.uid){
                                return;
                            }
                            this.visible = true;
                            var content = d.jiazhuNum == 0? "不飘" : "飘" + d.jiazhuNum;
                            var tData = MjClient.data.sData.tData;
                            if(tData.areaSelectMode.piaoniao){
                                content = "鸟+" + d.jiazhuNum;
                            }
                            this.setString(content);
                        },
                        mjhand: function(d){
                            var pl = getUIPlayer(0);
                            if(!pl || pl.jiazhuNum < 0){
                                return;
                            }
                            this.visible = true;
                            var content = pl.jiazhuNum == 0? "不飘" : "飘" + pl.jiazhuNum;
                            var tData = MjClient.data.sData.tData;
                            if(tData.areaSelectMode.piaoniao){
                                content = "鸟+" + pl.jiazhuNum;
                            }
                            this.setString(content);                            
                        },
                        removePlayer: function(){
                            this.visible = false;
                        },
                        clearCardUI: function(){
                            var tData = MjClient.data.sData.tData;
                            if(!tData.areaSelectMode.piaoniao){
                                this.visible = false;
                            }
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
            tai_layout:{
                _layout: [
                    [0.018, 0.018],
                    [0, 0],
                    [0, 0.2]
                ],
                tai_info:{
                    _visible:true,
                    _run: function () {
                        this.setString("");
                    }
                },
            },
            ready: {
                _layout: [
                    [0.07, 0.07],
                    [0.5, 0.5],
                    [0, -1.5]
                ],
                _run: function() {
                    GetReadyVisible(this, 0);
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
                        GetReadyVisible(this, 0);
                    },
                    MJJiazhu: function(){
                        GetReadyVisible(this, -1);
                    }
                }
            },
            stand: {
                _layout: [
                    [0.053, 0],
                    [0.5, 0],
                    [8, 0.72]
                ],
                _visible: false,
                _run: function () {
                    this.zIndex = 201;
                },
            },
            up: {
                _layout: [
                    [0.05, 0],
                    [0, 0],
                    [0.8, 0.7]
                ],
                _visible: false
            },
            down: {
                _layout: [
                    [0.05, 0],
                    [0, 0],
                    [3.5, 1]
                ],
                _visible: false
            },
            out1: {
                _run: function () {
                    if (MjClient.size.width / MjClient.size.height >= 1.5)
                    {
                        
                        setWgtLayout(this, [0.0, 0.0763], [0.53, 0], [-7, 4.85]);
                    }
                    else
                    {   
                        
                        setWgtLayout(this, [0.0, 0.07], [0.53, 0], [-3, 4.85]);
                    }
                    if (MjClient.MaxPlayerNum == 2)
                        this.x -= this.height * this.scale * 5;
                },
                _visible: false
            },
            out0: {
                _run: function () {
                    if (MjClient.size.width / MjClient.size.height >= 1.5)
                    {
                        setWgtLayout(this, [0.0, 0.0763], [0.53, 0], [-7, 3.8]);
                    }
                    else
                    {
                        setWgtLayout(this, [0.0, 0.07], [0.53, 0], [-3, 3.8]);
                    }
                    if (MjClient.MaxPlayerNum == 2)
                        this.x -= this.height * this.scale * 5;
                },

                _visible: false
            },
            outBig: {
                _layout: [
                    [0.0836, 0],
                    [0.5, 0.32],
                    [0, 0]
                ],
                _visible: false
            },
            tingCardsNode: {
                _layout: [[0.25, 0.12], [0.2, 0.25], [0, -0.3]],
                _visible: false,
                _event: {
                    clearCardUI: function(eD) {
                        this.visible = false;
                    },
                    MJHu: function(eD) {
                        this.visible = false;
                    },
                    MJPeng: function(eD) {
                        this.visible = false;
                    },
                    initSceneData:function(eD)
                    {
                        MjClient.playui.tingIconVisible(this,0);
                    }
                }
            },
            tingCardNumNode: {
                _layout: [[0.25, 0.12], [0.12, 0.25], [0,-0.2]],
                _visible: false,
                _event: {
                    clearCardUI: function(eD) {
                        this.visible = false;
                    },
                    MJHu: function(eD) {
                        this.visible = false;
                    },
                    MJPut: function(eD) {   
                        //this.visible = false;
                    }
                }
            },
            _event: {
                clearCardUI: function() {
                    clearCardUI(this, 0);
                },
                initSceneData: function(eD) {
                    SetUserVisible_TYZZ(this, 0);
                    var pl = getUIPlayer(0);
                    var tingSet = calTingSet(pl.mjhand, MjClient.data.sData.tData.hunCard);
                    if (pl.tPutCard || Object.keys(tingSet).length > 0) 
                    {
                        var AutoPut_btn = AddAutoPutCheckBox();
                        this.addChild(AutoPut_btn,999);
                        AutoPut_btn.setSelected(pl.tPutCard)
                    }
                },
                addPlayer: function(eD) {
                    SetUserVisible_TYZZ(this, 0);
                },
                removePlayer: function(eD) {
                    SetUserVisible_TYZZ(this, 0);
                },
                mjhand: function(eD) {
                    InitUserHandUI_TYZZ(this, 0);
                },
                roundEnd: function() {
                    // InitUserCoinAndName(this, 0);
                    //setTaiInfo("");
                },
                updateScore: function(){
                    InitUserCoinAndName(this, 0);
                },
                newCard: function(eD) {
                    // cdsNums++;
                    console.log("客户端发牌组合......eD= "+JSON.stringify(eD));
                    //cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>newCard---------------");
                    var _tingCards = this.getChildByName("tingCardsNode");
                    _tingCards.visible = false;
                    //MjClient.playui._btnPutCard.visible = true;
                    if (typeof(eD) == "number") {
                        eD = {newCard: eD};
                    }
                    DealNewCard(this,eD.newCard,0);
                    MjClient.playui.CardLayoutRestore(getNode(0), 0, true);

                    hideTingBtn();
                },
                MJPut: function(eD) {
                    cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>MJPut---------------");
                    DealMJPut(this,eD,0);
                    var pl = getUIPlayer(0);
                    if (eD.uid == SelfUid() )
                    {
                        var _tingCards = this.getChildByName("tingCardsNode");
                        var tingSet = calTingSet(pl.mjhand, MjClient.data.sData.tData.hunCard);
                        if (MjClient.data.sData.tData.areaSelectMode.isOpenTingTip) 
                        {
                            setTingCards(_tingCards,tingSet);
                        }

                         if (this.getChildByName("AutoPut_btn")) 
                        {
                            if (Object.keys(tingSet).length <= 0) 
                            {
                                var AutoPut_btn = this.getChildByName("AutoPut_btn");
                                AutoPut_btn.removeFromParent();
                                MjClient.gamenet.request("pkroom.handler.tableMsg", {
                                    cmd: "MJTouchPutCard",
                                    tPutCard: false
                                });
                            }
                        }
                        else
                        {
                            if (Object.keys(tingSet).length > 0) 
                            {
                                var AutoPut_btn = AddAutoPutCheckBox();
                                this.addChild(AutoPut_btn,999);
                                AutoPut_btn.setSelected(pl.tPutCard);
                            }
                        }
                        /*if (Object.keys(tingSet).length > 0) 
                        {
                            if (!this.getChildByName("AutoPut_btn")) 
                            {
                                var AutoPut_btn = AddAutoPutCheckBox();
                                this.addChild(AutoPut_btn,999);
                                AutoPut_btn.setSelected(pl.tPutCard);
                            }
                        }
                        else{
                            if (this.getChildByName("AutoPut_btn")) 
                            {
                                var AutoPut_btn = this.getChildByName("AutoPut_btn");
                                AutoPut_btn.removeFromParent();
                                if (pl.tPutCard) 
                                {  
                                    MjClient.gamenet.request("pkroom.handler.tableMsg", {
                                        cmd: "MJTouchPutCard",
                                        tPutCard: false
                                    });
                                }
                            }
                        }*/
                        if (pl.tPutCard) {
                            MjClient.playui.CardLayoutRestore(this,0);
                        }
                    }
                    setUserOffline(this, 0);
                },
                MJChi: function(eD) {
                    DealMJChi(this, eD, 0);
                    setUserOffline(this, 0);
                    var AutoPut_btn = this.getChildByName("AutoPut_btn");
                    if (AutoPut_btn && eD.cpginfo.id == SelfUid()) 
                    {
                        AutoPut_btn.removeFromParent();
                        MjClient.gamenet.request("pkroom.handler.tableMsg", {
                            cmd: "MJTouchPutCard",
                            tPutCard: false
                        });
                    }
                },
                MJGang: function(eD) {
                    DealMJGang(this, eD, 0);
                    hideTingBtn();
                    setUserOffline(this, 0);
                    var AutoPut_btn = this.getChildByName("AutoPut_btn");
                    if (AutoPut_btn && eD.cpginfo.id == SelfUid()) 
                    {
                        AutoPut_btn.removeFromParent();
                        MjClient.gamenet.request("pkroom.handler.tableMsg", {
                            cmd: "MJTouchPutCard",
                            tPutCard: false
                        });
                    }
                },
                MJPeng: function(eD) {
                    DealMJPeng(this, eD, 0);
                    setUserOffline(this, 0);
                    var AutoPut_btn = this.getChildByName("AutoPut_btn");
                    if (AutoPut_btn && eD.cpginfo.id == SelfUid()) 
                    {
                        AutoPut_btn.removeFromParent();
                        MjClient.gamenet.request("pkroom.handler.tableMsg", {
                            cmd: "MJTouchPutCard",
                            tPutCard: false
                        });
                    }
                },
                MJHu: function(eD) {
                    HandleMJHu(this, eD, 0);
                    setUserOffline(this, 0);
                    var AutoPut_btn = this.getChildByName("AutoPut_btn");
                    if (AutoPut_btn && eD.uid == SelfUid()) 
                    {
                        AutoPut_btn.removeFromParent();
                        MjClient.gamenet.request("pkroom.handler.tableMsg", {
                            cmd: "MJTouchPutCard",
                            tPutCard: false
                        });
                    }
                },
                onlinePlayer: function(eD) {
                    setUserOffline(this, 0);
                },
                playerStatusChange: function(eD) {
                    setUserOffline(this, 0);
                },
                MJFlower: function(eD) {
                    HandleMJFlower(this, eD, 0);
                },
                MJTing: function (eD) {
                    HandleMJTing(this, eD, 0);
                }
            }
        },
        right: {
            _run:function () {
                this.visible = MjClient.MaxPlayerNum != 2;
            },
            head: {
                TG_CountDown:{//托管倒计时
                    _run:function () {
                        this.visible = false;
                        this.ignoreContentAdaptWithSize(true);
                    },
                    _event:{
                        trustTip:function (msg) {
                            if(getUIPlayer(1)&&getUIPlayer(1).info.uid == msg.uid){
                                this.visible = true;
                                this.setString(msg.tipCountDown);
                                var tipCountDown = msg.tipCountDown;
                                var self = this;
                                this.schedule(function () {
                                    self.setString(tipCountDown);
                                    if (tipCountDown > 0) {
                                        tipCountDown--;
                                    }else {
                                        self.setVisible(false);
                                        self.unscheduleAllCallbacks();
                                    }
                                }, 1, cc.REPEAT_FOREVER, 0);
                            }
                        },
                        MJPut:function (msg) {
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
                            if(pl&&pl.trust){
                                this.visible = true;
                            }else {
                                this.visible = false;
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
                            showUserZhuangLogo(this, 1);
                        },
                        initSceneData: function() {
                            if (IsArrowVisible()) showUserZhuangLogo(this, 1);
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
                },
                score_bg:{_visible:false},
                name_bg:{_visible:false},
                flower_layout: {_visible:false},
                flower_zfb_layout : {_visible:false},
                tingCard: {
                    _visible:false,
                    _event: {
                        MJTing: function (eD) {
                            if(MjClient.playui.isPlayerPutCard(eD,1))
                            {
                                var pl = getUIPlayer(1);
                                pl.putCardAfterTing = eD.putCardAfterTing;
                                MjClient.playui.setTingCardInfo(this,eD,1);
                            }
                        },
                        clearCardUI: function(eD) {

                            this.visible = false;
                        },
                        MJHu: function(eD) {
                            this.visible = false;
                        },
                        onlinePlayer: function(eD) {
                            //MjClient.playui.setTingCardInfo(this,eD,1);
                        },
                        initSceneData:function(eD)
                        {
                            MjClient.playui.setTingCardInfo(this,eD,1);
                        }
                    }
                },
                tingIcon: {
                    _visible:false,
                    _run:function(){
                        this.visible = false;

                        this.runAction(cc.sequence(cc.spawn(cc.tintTo(0.6, 255,0,0),cc.scaleTo(0.6,this.getScale() + 0.3)),
                            cc.spawn(cc.tintTo(0.6, 255,255,255),cc.scaleTo(0.6,this.getScale()))).repeatForever());
                    },
                    _event: {
                        clearCardUI: function(eD) {
                            this.visible = false;
                        },
                        MJHu: function(eD) {
                            this.visible = false;
                        },
                        moveHead: function() {
                            MjClient.playui.tingIconVisible(this, 1);
                        },
                        onlinePlayer: function(eD) {
                            //MjClient.playui.tingIconVisible(this,1);
                        },
                        initSceneData:function(eD)
                        {
                            MjClient.playui.tingIconVisible(this,1);
                        },
                        roundEnd: function(){
                            // cc.log("end rounde------------------------");
                            this.visible = false;
                        }
                    }
                },
                huaCount: {
                    _run:function(){
                        changeAtalsForLabel(this,0);
                    },
                    _event:
                        {
                            clearCardUI: function(eD) {
                                changeAtalsForLabel(this,0);
                            }
                        }
                },
                gangScore: {
                    _run:function () {
                        this.visible = false;
                        var winNode = this.getChildByName("win");
                        winNode.setUserData({pos:winNode.getPosition()});
                    },
                    _event: {
                        MJGangScore: function(d){
                            MjClient.playui.updateGangScore(this, d, 1);
                        },
                        initSceneData: function(){
                            this.visible = false;
                        }
                    }
                },
                newGangScore: {
                    _run:function () {
                        this.visible = false; 
                        this.setUserData({pos:this.getPosition()}); 
                    },
                    _event: {
                        MJGangScore: function(d){
                            MjClient.playui.newUpdateGangScore(this, d, 1);
                        },
                        initSceneData: function(){
                            this.visible = false;
                        }
                    }
                },
                piao: {
                    _run: function(){
                        this.visible = false;
                    },
                    _event: {
                        initSceneData: function(){
                            var pl = getUIPlayer(1);
                            if(!pl || pl.jiazhuNum < 0){
                                return;
                            }
                            this.visible = true;
                            var content = pl.jiazhuNum == 0? "不飘" : "飘" + pl.jiazhuNum;
                            var tData = MjClient.data.sData.tData;
                            if(tData.areaSelectMode.piaoniao){
                                content = "鸟+" + pl.jiazhuNum;
                            }
                            this.setString(content);
                        },
                        MJJiazhu: function(d){
                            var pl = getUIPlayer(1);
                            if(pl && pl.info.uid != d.uid){
                                return;
                            }
                            this.visible = true;
                            var content = d.jiazhuNum == 0? "不飘" : "飘" + d.jiazhuNum;
                            var tData = MjClient.data.sData.tData;
                            if(tData.areaSelectMode.piaoniao){
                                content = "鸟+" + d.jiazhuNum;
                            }
                            this.setString(content);
                        },
                        mjhand: function(d){
                            var pl = getUIPlayer(1);
                            if(!pl || pl.jiazhuNum < 0){
                                return;
                            }
                            this.visible = true;
                            var content = pl.jiazhuNum == 0? "不飘" : "飘" + pl.jiazhuNum;
                            var tData = MjClient.data.sData.tData;
                            if(tData.areaSelectMode.piaoniao){
                                content = "鸟+" + pl.jiazhuNum;
                            }
                            this.setString(content);                            
                        },
                        removePlayer: function(){
                            this.visible = false;
                        },
                        clearCardUI: function(){
                            var tData = MjClient.data.sData.tData;
                            if(!tData.areaSelectMode.piaoniao){
                                this.visible = false;
                            }
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
                    [0.5, 0.5],
                    [2, 0]
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
                    MJJiazhu: function(){
                        GetReadyVisible(this, -1);
                    }
                }
            },

            stand: {
                _layout: [
                    [0, 0.08],
                    [1, 1],
                    [-5.5, -2.3]
                ],
                _visible: false
            },

            up: {
                _layout: [
                    [0, 0.05],
                    [1, 0],
                    [-3.0, 6]
                ],
                _visible: false
            },
            down: {
                _layout: [
                    [0, 0.05],
                    [1, 0],
                    [-3, 6.3]
                ],
                _visible: false
            },

           out0: {
                _run: function () {
                    if (MjClient.size.width / MjClient.size.height >= 1.5)
                    {
                        setWgtLayout(this, [0, 0.0545],[1, 0.5],[-4.8, -4.1]);
                    }
                    else
                    {
                        setWgtLayout(this, [0, 0.05],[1, 0.5],[-4.8, -5.1]);
                    }

                },
                _visible: false
            },
            out1: {

               _run: function () {
                    if (MjClient.size.width / MjClient.size.height >= 1.5)
                    {
                        setWgtLayout(this, [0, 0.0545],[1, 0.5],[-6.0, -4.1]);
                    }
                    else
                    {
                        setWgtLayout(this, [0, 0.05],[1, 0.5],[-6.0, -5.1]);
                    }

                },
                _visible: false
            },
            outBig: {
                _layout: [
                    [0.0836, 0],
                    [0.75, 0.58],
                    [0, 0]
                ],
                _visible: false
            },
            _event: {
                clearCardUI: function() {
                    clearCardUI(this, 1);
                },
                initSceneData: function(eD) {
                    SetUserVisible_TYZZ(this, 1);
                },
                addPlayer: function(eD) {
                    SetUserVisible_TYZZ(this, 1);
                },
                removePlayer: function(eD) {
                    SetUserVisible_TYZZ(this, 1);
                },
                mjhand: function(eD) {
                    InitUserHandUI_TYZZ(this, 1);
                },
                roundEnd: function() {
                    // InitUserCoinAndName(this, 1);
                },
                updateScore: function(){
                    InitUserCoinAndName(this, 1);
                },
                waitPut: function() {
                    var tData = MjClient.data.sData.tData;
                    DealWaitPut(this, tData, 1);
                },
                MJPut: function(eD) {
                    DealMJPut(this, eD, 1);
                    if(eD.uid != SelfUid())
                    {
                        hideTingBtn();
                    }
                    setUserOffline(this, 1);
                },
                MJChi: function(eD) {
                    DealMJChi(this, eD, 1);
                    setUserOffline(this, 1);
                },
                MJGang: function(eD) {
                    DealMJGang(this, eD, 1);
                    setUserOffline(this, 1);
                },
                MJPeng: function(eD) {
                    DealMJPeng(this, eD, 1);
                    setUserOffline(this, 1);
                },
                MJHu: function(eD) {
                    HandleMJHu(this, eD,1);
                    setUserOffline(this, 1);
                },
                onlinePlayer: function(eD) {
                    setUserOffline(this, 1);
                },
                playerStatusChange: function(eD) {
                    setUserOffline(this, 1);
                },
                MJFlower: function(eD) {
                    HandleMJFlower(this, eD, 1);
                },
                MJTing: function (eD) {
                    HandleMJTing(this, eD, 1);
                }
            }
        },
        top: {
            _run:function () {
                this.visible = MjClient.MaxPlayerNum != 3;
            },
            head: {
                TG_CountDown:{//托管倒计时
                    _run:function () {
                        this.visible = false;
                        this.ignoreContentAdaptWithSize(true);
                    },
                    _event:{
                        trustTip:function (msg) {
                            if(getUIPlayer(2)&&getUIPlayer(2).info.uid == msg.uid){
                                this.visible = true;
                                this.setString(msg.tipCountDown);
                                var tipCountDown = msg.tipCountDown;
                                var self = this;
                                this.schedule(function () {
                                    self.setString(tipCountDown);
                                    if (tipCountDown > 0) {
                                        tipCountDown--;
                                    }else {
                                        self.setVisible(false);
                                        self.unscheduleAllCallbacks();
                                    }
                                }, 1, cc.REPEAT_FOREVER, 0);
                            }
                        },
                        MJPut:function (msg) {
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
                            if(pl&&pl.trust){
                                this.visible = true;
                            }else {
                                this.visible = false;
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
                            showUserZhuangLogo(this, 2);
                        },
                        initSceneData: function() {
                            if (IsArrowVisible()) showUserZhuangLogo(this, 2);
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
                },
                score_bg:{_visible:false},
                name_bg:{_visible:false},
                flower_layout: {_visible:false},
                flower_zfb_layout : {_visible:false},
                tingCard: {
                    _visible:false,
                    _event: {
                        MJTing: function (eD) {
                            if(MjClient.playui.isPlayerPutCard(eD,2))
                            {
                                var pl = getUIPlayer(2);
                                pl.putCardAfterTing = eD.putCardAfterTing;
                                MjClient.playui.setTingCardInfo(this,eD,2);
                            }
                        },
                        clearCardUI: function(eD) {
                            cc.log("ready to----- clear sking ----");
                            this.visible = false;
                        },
                        moveHead: function(eD) {
                            cc.log("top---moveHead ----");
                            MjClient.playui.setTingCardInfo(this,eD,2);
                        },
                        MJHu: function(eD) {
                            this.visible = false;
                        },
                        onlinePlayer: function(eD) {
                            cc.log("top---onlinePlayer ----");
                            //MjClient.playui.setTingCardInfo(this,eD,2);
                        },
                        initSceneData:function(eD)
                        {
                            MjClient.playui.setTingCardInfo(this,eD,2);
                        }
                    }
                },
                tingIcon: {
                    _visible:false,
                    _run:function(){
                        this.visible = false;
                        this.runAction(cc.sequence(cc.spawn(cc.tintTo(0.6, 255,0,0),cc.scaleTo(0.6,this.getScale() + 0.3)),
                            cc.spawn(cc.tintTo(0.6, 255,255,255),cc.scaleTo(0.6,this.getScale()))).repeatForever());
                    },
                    _event: {
                        clearCardUI: function(eD) {
                            this.visible = false;
                            cc.log("tingIcon 22 ----- clearCardUI----");
                        },
                        MJHu: function(eD) {
                            this.visible = false;
                        },
                        moveHead: function() {
                            MjClient.playui.tingIconVisible(this, 2);
                        },
                        onlinePlayer: function(eD) {
                            //MjClient.playui.tingIconVisible(this,2);
                        },
                        initSceneData:function(eD)
                        {
                            MjClient.playui.tingIconVisible(this,2);
                        },
                        roundEnd: function(){
                            // cc.log("end rounde------------------------222");
                            this.visible = false;
                        }
                    }
                },
                huaCount: {
                    _run:function(){
                        changeAtalsForLabel(this,0);
                    },
                    _event:
                        {
                            clearCardUI: function(eD) {
                                changeAtalsForLabel(this,0);
                            }
                        }
                },
                gangScore: {
                    _run:function () {
                        this.visible = false;
                        var winNode = this.getChildByName("win");
                        winNode.setUserData({pos:winNode.getPosition()});
                    },
                    _event: {
                        MJGangScore: function(d){
                            MjClient.playui.updateGangScore(this, d, 2);
                        },
                        initSceneData: function(){
                            this.visible = false;
                        }
                    }
                },
                newGangScore: {
                    _run:function () {
                        this.visible = false; 
                        this.setUserData({pos:this.getPosition()}); 
                    },
                    _event: {
                        MJGangScore: function(d){
                            MjClient.playui.newUpdateGangScore(this, d, 2);
                        },
                        initSceneData: function(){
                            this.visible = false;
                        }
                    }
                },
                piao: {
                    _run: function(){
                        this.visible = false;
                    },
                    _event: {
                        initSceneData: function(){
                            var pl = getUIPlayer(2);
                            if(!pl || pl.jiazhuNum < 0){
                                return;
                            }

                            this.visible = true;
                            var content = pl.jiazhuNum == 0? "不飘" : "飘" + pl.jiazhuNum;
                            var tData = MjClient.data.sData.tData;
                            if(tData.areaSelectMode.piaoniao){
                                content = "鸟+" + pl.jiazhuNum;
                            }
                            this.setString(content);
                        },
                        MJJiazhu: function(d){
                            var pl = getUIPlayer(2);
                            if(pl && pl.info.uid != d.uid){
                                return;
                            }
                            this.visible = true;
                            var content = d.jiazhuNum == 0? "不飘" : "飘" + d.jiazhuNum;
                            var tData = MjClient.data.sData.tData;
                            if(tData.areaSelectMode.piaoniao){
                                content = "鸟+" + d.jiazhuNum;
                            }
                            this.setString(content);
                        },
                        mjhand: function(d){
                            var pl = getUIPlayer(2);
                            if(!pl || pl.jiazhuNum < 0){
                                return;
                            }
                            this.visible = true;
                            var content = pl.jiazhuNum == 0? "不飘" : "飘" + pl.jiazhuNum;
                            var tData = MjClient.data.sData.tData;
                            if(tData.areaSelectMode.piaoniao){
                                content = "鸟+" + pl.jiazhuNum;
                            }
                            this.setString(content);                            
                        },
                        removePlayer: function(){
                            this.visible = false;
                        },
                        clearCardUI: function(){
                            var tData = MjClient.data.sData.tData;
                            if(!tData.areaSelectMode.piaoniao){
                                this.visible = false;
                            }
                        }
                    }
                }
            },
            play_tips: {
                _layout: [[0.08, 0.14], [0.5, 0.75], [0, 0]],
                _run: function () {
                    this.zIndex = actionZindex;
                },
                _visible:false,
            },
            ready: {
                _layout: [
                    [0.07, 0.07],
                    [0.5, 0.5],
                    [0, 1.5]
                ],
                _run: function() {
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
                    MJJiazhu: function(){
                        GetReadyVisible(this, -1);
                    }
                }
            },

            stand: {
                _layout: [
                    [0, 0.07],
                    [0.5, 1],
                    [-6, -1.0]
                ],
                _visible: false
            },

            up: {
                _layout: [
                    [0, 0.07],
                    [0.5, 1],
                    [6, -1.0]
                ],
                _visible: false
            },
            down: {
                _layout: [
                    [0, 0.07],
                    [0.5, 1],
                    [6, -0.7]
                ],
                _visible: false
            },

           out0: {
                _run: function () {
                    if (MjClient.size.width / MjClient.size.height >= 1.5)
                    {
                        setWgtLayout(this, [0, 0.0763],[0.5, 1],[6.8, -2.3]);
                    }
                    else
                    {
                        setWgtLayout(this, [0, 0.07],[0.5, 1],[4.8, -2.3]);
                    }
                    if (MjClient.MaxPlayerNum == 2)
                        this.x += this.height * this.scale * 5.5;
                },
                
                _visible: false
            },
            out1: {
                _run: function () {
                    if (MjClient.size.width / MjClient.size.height >= 1.5)
                    {
                        setWgtLayout(this, [0, 0.0763],[0.5, 1],[6.8, -3.35]);
                    }
                    else
                    {
                        setWgtLayout(this, [0, 0.07],[0.5, 1],[4.8, -3.35]);
                    }
                    if (MjClient.MaxPlayerNum == 2)
                        this.x += this.height * this.scale * 5.5;
                },
                
                _visible: false
            },
            outBig: {
                _layout: [
                    [0.0836, 0],
                    [0.5, 0.75],
                    [0, 0]
                ],
                _visible: false
            },
            _event: {
                clearCardUI: function() {
                    clearCardUI(this, 2);
                },
                initSceneData: function(eD) {
                    SetUserVisible_TYZZ(this, 2);
                },
                addPlayer: function(eD) {
                    SetUserVisible_TYZZ(this, 2);
                },
                removePlayer: function(eD) {
                    SetUserVisible_TYZZ(this, 2);
                },
                mjhand: function(eD) {
                    InitUserHandUI_TYZZ(this, 2);
                },
                roundEnd: function() {
                    // InitUserCoinAndName(this, 2);

                },
                updateScore: function(){
                    InitUserCoinAndName(this, 2);
                },
                waitPut: function() {
                    var tData = MjClient.data.sData.tData;
                    DealWaitPut(this, tData, 2);
                },
                MJPut: function(eD) {
                    DealMJPut(this, eD, 2);
                    if(eD.uid != SelfUid())
                    {
                        hideTingBtn();
                    }
                    setUserOffline(this, 2);
                },
                MJChi: function(eD) {
                    DealMJChi(this, eD, 2);
                    setUserOffline(this, 2);
                },
                MJGang: function(eD) {
                    DealMJGang(this, eD, 2);
                    setUserOffline(this, 2);
                },
                MJPeng: function(eD) {
                    DealMJPeng(this, eD, 2);
                    setUserOffline(this, 2);
                },
                MJHu: function(eD) {
                    HandleMJHu(this, eD,2);
                    setUserOffline(this, 2);
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
            _run:function () {
                this.visible = MjClient.MaxPlayerNum != 2;
            },
            head: {
                TG_CountDown:{//托管倒计时
                    _run:function () {
                        this.visible = false;
                        this.ignoreContentAdaptWithSize(true);
                    },
                    _event:{
                        trustTip:function (msg) {
                            if(getUIPlayer(3)&&getUIPlayer(3).info.uid == msg.uid){
                                this.visible = true;
                                this.setString(msg.tipCountDown);
                                var tipCountDown = msg.tipCountDown;
                                var self = this;
                                this.schedule(function () {
                                    self.setString(tipCountDown);
                                    if (tipCountDown > 0) {
                                        tipCountDown--;
                                    }else {
                                        self.setVisible(false);
                                        self.unscheduleAllCallbacks();
                                    }
                                }, 1, cc.REPEAT_FOREVER, 0);
                            }
                        },
                        MJPut:function (msg) {
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
                            if(getUIPlayer(3)&&getUIPlayer(3).info.uid == msg.uid){
                                this.visible = true;
                            }
                        },
                        cancelTrust:function (msg) {
                            if(getUIPlayer(3)&&getUIPlayer(3).info.uid == msg.uid){
                                this.visible = false;
                            }
                        },
                        initSceneData:function (msg) {
                            var pl = getUIPlayer(3);
                            if(pl&&pl.trust){
                                this.visible = true;
                            }else {
                                this.visible = false;
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
                            showUserZhuangLogo(this, 3);
                        },
                        initSceneData: function() {
                            if (IsArrowVisible()) showUserZhuangLogo(this, 3);
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

                                showUserChat(this, 3, msg);
                            },
                            playVoice: function(voicePath) {
                                MjClient.data._tempMessage.msg = voicePath;
                                showUserChat(this, 3, MjClient.data._tempMessage);
                            }
                        }
                    }
                },
                _click: function(btn) {
                    showPlayerInfo(3, btn);
                },
                _event: {
                    loadWxHead: function(d) {
                        setWxHead(this, d, 3);
                    },
                    addPlayer: function(eD) {
                        showFangzhuTagIcon(this,3);
                    },
                    removePlayer: function(eD) {
                        showFangzhuTagIcon(this,3);
                    }
                },
                _run: function () {
                    // this.zIndex = 600;
                    showFangzhuTagIcon(this,3);
                },
                score_bg:{_visible:false},
                name_bg:{_visible:false},
                flower_layout: {_visible:false},
                flower_zfb_layout : {_visible:false},
                tingCard: {
                    _visible:false,
                    _event: {
                        MJTing: function (eD) {
                            if(MjClient.playui.isPlayerPutCard(eD,3))
                            {
                                var pl = getUIPlayer(3);
                                pl.putCardAfterTing = eD.putCardAfterTing;
                                MjClient.playui.setTingCardInfo(this,eD,3);
                            }
                        },
                        clearCardUI: function(eD) {
                            cc.log("ready to----- clear sking ----");
                            this.visible = false;
                        },
                        MJHu: function(eD) {
                           this.visible = false;
                        },
                        onlinePlayer: function(eD) {
                            //MjClient.playui.setTingCardInfo(this,eD,3);
                        },
                        initSceneData:function(eD)
                        {
                            MjClient.playui.setTingCardInfo(this,eD,3);
                        }
                    }
                },
                tingIcon: {
                    _visible:false,
                    _run:function(){
                        this.visible = false;
                        this.runAction(cc.sequence(cc.spawn(cc.tintTo(0.6, 255,0,0),cc.scaleTo(0.6,this.getScale() + 0.3)),
                            cc.spawn(cc.tintTo(0.6, 255,255,255),cc.scaleTo(0.6,this.getScale()))).repeatForever());
                    },
                    _event: {
                        clearCardUI: function(eD) {
                            this.visible = false;
                            cc.log("tingIcon 333 ----- clearCardUI ----");
                        },
                        MJHu: function(eD) {
                            this.visible = false;
                        },
                        moveHead: function() {
                            MjClient.playui.tingIconVisible(this, 3);
                        },
                        onlinePlayer: function(eD) {
                            //MjClient.playui.tingIconVisible(this,3);
                        },
                        initSceneData:function(eD)
                        {
                            MjClient.playui.tingIconVisible(this,3);
                        },
                        roundEnd: function(){
                            // cc.log("end rounde-----------------------333-");
                            this.visible = false;
                        }
                    }
                },
                huaCount: {
                    _run:function(){
                        changeAtalsForLabel(this,0);
                    },
                    _event:
                        {
                            clearCardUI: function(eD) {
                                changeAtalsForLabel(this,0);
                            }
                        }
                },
                gangScore: {
                    _run:function () {
                        this.visible = false;
                        var winNode = this.getChildByName("win");
                        winNode.setUserData({pos:winNode.getPosition()});
                    },
                    _event: {
                        MJGangScore: function(d){
                            MjClient.playui.updateGangScore(this, d, 3);
                        },
                        initSceneData: function(){
                            this.visible = false;
                        }
                    }
                },
                newGangScore: {
                    _run:function () {
                        this.visible = false; 
                        this.setUserData({pos:this.getPosition()}); 
                    },
                    _event: {
                        MJGangScore: function(d){
                            MjClient.playui.newUpdateGangScore(this, d, 3);
                        },
                        initSceneData: function(){
                            this.visible = false;
                        }
                    }
                },
                piao: {
                    _run: function(){
                        this.visible = false;
                    },
                    _event: {
                        initSceneData: function(){
                            var pl = getUIPlayer(3);
                            if(!pl || pl.jiazhuNum < 0){
                                return;
                            }
                            this.visible = true;
                            var content = pl.jiazhuNum == 0? "不飘" : "飘" + pl.jiazhuNum;
                            var tData = MjClient.data.sData.tData;
                            if(tData.areaSelectMode.piaoniao){
                                content = "鸟+" + pl.jiazhuNum;
                            }
                            this.setString(content);
                        },
                        MJJiazhu: function(d){
                            var pl = getUIPlayer(3);
                            if(pl && pl.info.uid != d.uid){
                                return;
                            }
                            this.visible = true;
                            var content = d.jiazhuNum == 0? "不飘" : "飘" + d.jiazhuNum;
                            var tData = MjClient.data.sData.tData;
                            if(tData.areaSelectMode.piaoniao){
                                content = "鸟+" + d.jiazhuNum;
                            }
                            this.setString(content);
                        },
                        mjhand: function(d){
                            var pl = getUIPlayer(3);
                            if(!pl || pl.jiazhuNum < 0){
                                return;
                            }
                            this.visible = true;
                            var content = pl.jiazhuNum == 0? "不飘" : "飘" + pl.jiazhuNum;
                            var tData = MjClient.data.sData.tData;
                            if(tData.areaSelectMode.piaoniao){
                                content = "鸟+" + pl.jiazhuNum;
                            }
                            this.setString(content);                            
                        },
                        removePlayer: function(){
                            this.visible = false;
                        },
                        clearCardUI: function(){
                            var tData = MjClient.data.sData.tData;
                            if(!tData.areaSelectMode.piaoniao){
                                this.visible = false;
                            }
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
                _layout: [
                    [0.07, 0.07],
                    [0.5, 0.5],
                    [-2, 0]
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
                    MJJiazhu: function(){
                        GetReadyVisible(this, -1);
                    }
                }
            },

            up: {
                _layout: [
                    [0, 0.05],
                    [0, 1],
                    [3.0, -3.5]
                ],
                _visible: false
            },
            down: {
                _layout: [
                    [0, 0.05],
                    [0, 1],
                    [3, -3]
                ],
                _visible: false
            },
            stand: {
                _layout: [
                    [0, 0.08],
                    [0, 0],
                    [5.2, 3]
                ],
                _visible: false
            },

            out0: {
                _run: function () {
                    if (MjClient.size.width / MjClient.size.height >= 1.5)
                    {
                        setWgtLayout(this, [0, 0.0545],[0, 0.5],[4.5, 4.8]);
                    }
                    else
                    {
                        setWgtLayout(this, [0, 0.05],[0, 0.5],[4.5, 4.8]);
                    }

                },
               
                _visible: false
            },
            out1: {
                _run: function () {
                    if (MjClient.size.width / MjClient.size.height >= 1.5)
                    {
                        setWgtLayout(this, [0, 0.0545],[0, 0.5],[5.7, 4.8]);
                    }
                    else
                    {
                        setWgtLayout(this, [0, 0.05],[0, 0.5],[5.7, 4.8]);
                    }

                },
                _visible: false
            },
            outBig: {
                _layout: [
                    [0.0836, 0],
                    [0.25, 0.58],
                    [0, 0]
                ],
                _visible: false
            },
            _event: {
                clearCardUI: function() {
                    clearCardUI(this, 3);
                },
                initSceneData: function(eD) {
                    SetUserVisible_TYZZ(this, 3);
                },
                addPlayer: function(eD) {
                    SetUserVisible_TYZZ(this, 3);
                },
                removePlayer: function(eD) {
                    SetUserVisible_TYZZ(this, 3);
                },
                mjhand: function(eD) {
                    InitUserHandUI_TYZZ(this, 3);
                },
                roundEnd: function() {
                    // InitUserCoinAndName(this, 3);
                },
                updateScore: function(){
                    InitUserCoinAndName(this, 3);
                },
                waitPut: function() {
                    var tData = MjClient.data.sData.tData;
                    DealWaitPut(this, tData, 3);
                },
                MJPut: function(eD) {
                    DealMJPut(this, eD, 3);
                    if(eD.uid != SelfUid())
                    {
                        hideTingBtn();
                    }
                    setUserOffline(this, 3);
                },
                MJChi: function(eD) {
                    DealMJChi(this, eD, 3);
                    setUserOffline(this, 3);
                },
                MJGang: function(eD) {
                    DealMJGang(this, eD, 3);
                    setUserOffline(this, 3);
                },
                MJPeng: function(eD) {
                    DealMJPeng(this, eD, 3);
                    setUserOffline(this, 3);
                },
                MJHu: function(eD) {
                    HandleMJHu(this, eD, 3);
                    setUserOffline(this, 3);
                },
                onlinePlayer: function(eD) {
                    setUserOffline(this, 3);
                },
                playerStatusChange: function(eD) {
                    setUserOffline(this, 3);
                },
                MJFlower: function(eD) {
                    HandleMJFlower(this, eD, 3);
                },
                MJTing: function (eD) {
                    HandleMJTing(this, eD, 3);
                }
            }
        },
        eat: {

            chi0: {
                _visible: false,
                _layout: [
                    [0, 0.1],
                    [0.5, 0],
                    [1.3, 2.5]
                ],
                _touch: function(btn, eT) {
                    if (eT == 2) MJChiCardchange(btn.tag);
                },
                bg_img:{
                    _run:function(){
                        var _Image_light_scale = this.getScale();
                        
                        var a = cc.scaleTo(0.5,_Image_light_scale*1.0);
                        var aa = cc.fadeIn(0.5);
                        var a1 = cc.scaleTo(1,_Image_light_scale*1.3);
                        var a2 = cc.fadeOut(1);
                        var a3 = cc.callFunc(function(){
                            //this.setOpacity(255);
                            this.setScale(_Image_light_scale*0.95);
                        }.bind(this));
            
                        this.runAction(cc.sequence(cc.spawn(a,aa), cc.spawn(a1,a2).easing(cc.easeCubicActionOut()),a3,cc.delayTime(0.2)).repeatForever());
                    
                    }

                },
                bgimg: {
                    _run: function() {
                        this.zIndex = -1;
                    }
                },
                bgground: {
                    _run: function() {
                        this.zIndex = -1;
                    }
                },
                card1: {},
                card2: {},
                card3: {}
            },
            chi1: {
                _visible: false,
                _layout: [
                    [0, 0.1],
                    [0.5, 0],
                    [1.3, 3.8]
                ],
                _touch: function(btn, eT) {
                    if (eT == 2) MJChiCardchange(btn.tag);
                }
            },
            chi2: {
                _visible: false,
                _layout: [
                    [0, 0.1],
                    [0.5, 0],
                    [1.3, 5.1]
                ],
                _touch: function(btn, eT) {
                    if (eT == 2) MJChiCardchange(btn.tag);
                }
            },
            ting: {
                _visible: false,
                _layout: [
                    [0, 0.1],
                    [0.5, 0],
                    [1.3, 2.5]
                ],
                bg_img:{
                    _run:function(){
                        var _Image_light_scale = this.getScale();
                        
                        var a = cc.scaleTo(0.5,_Image_light_scale*1.0);
                        var aa = cc.fadeIn(0.5);
                        var a1 = cc.scaleTo(1,_Image_light_scale*1.3);
                        var a2 = cc.fadeOut(1);
                        var a3 = cc.callFunc(function(){
                            //this.setOpacity(255);
                            this.setScale(_Image_light_scale*0.95);
                        }.bind(this));
            
                        this.runAction(cc.sequence(cc.spawn(a,aa), cc.spawn(a1,a2).easing(cc.easeCubicActionOut()),a3,cc.delayTime(0.2)).repeatForever());
                    
                    }

                },
                _touch: function(btn, eT) {
                    if (eT == 2)
                    {
                        // MJTingToServer();
                        var eat = MjClient.playui.jsBind.eat;
                        eat.gang0._node.visible = false;
                        eat.guo._node.visible = false;
                        eat.ting._node.visible = false;
                        eat.cancel._node.visible = true;
                        MjClient.clickTing = true;
                        eat.hu._node.visible = false;
                        MjClient.playui._btnPutCard.visible = true;
                        MjClient.playui.CardLayoutRestore(MjClient.playui._downNode, 0);
                        /*
                         设置当前听牌的张数
                         */
                        var pl = getUIPlayer(0);
                        var currentCard = CurrentPutCardMsg();
                        var tingCards = getCheckTingHuCards(currentCard,pl.mjhand);
                        setCurrentTingNum(tingCards);
                    }
                }
            },
            noTing : {
                _visible : false,
                _layout: [
                    [0, 0.1],
                    [0.5, 0],
                    [4.6, 2.5]
                ],
                _touch: function(btn, eT) {
                    if (eT == 2)
                    {
                        cc.log("_____noting__888888____");
                        hideTingBtn();
                    }
                }
            },
            peng: {
                _visible: false,
                _layout: [
                    [0, 0.1],
                    [0.5, 0],
                    [0, 2.5]
                ],
                _touch: function(btn, eT) {
                    console.log(">>>> lf，点击碰按钮");
                    if (eT == 2) MJPengToServer();
                },
                bg_img:{
                    _run:function(){
                        var _Image_light_scale = this.getScale();
                        
                        var a = cc.scaleTo(0.5,_Image_light_scale*1.0);
                        var aa = cc.fadeIn(0.5);
                        var a1 = cc.scaleTo(1,_Image_light_scale*1.3);
                        var a2 = cc.fadeOut(1);
                        var a3 = cc.callFunc(function(){
                            //this.setOpacity(255);
                            this.setScale(_Image_light_scale*0.95);
                        }.bind(this));
            
                        this.runAction(cc.sequence(cc.spawn(a,aa), cc.spawn(a1,a2).easing(cc.easeCubicActionOut()),a3,cc.delayTime(0.2)).repeatForever());
                    
                    }

                },
                bgimg: {
                    _run: function() {
                        this.zIndex = -1;
                    }
                }
            },
            gang0: {
                _visible: false,
                _layout: [
                    [0, 0.1],
                    [0.5, 0],
                    [-1.7, 2.5]
                ],
                card1: {},
                _touch: function(btn, eT) {
                    var tData = MjClient.data.sData.tData;
                    var pl = getUIPlayer(0);
                    if(tData.areaSelectMode.bihuType && pl.eatFlag & 8){
                        if(!MjClient.majiang.canHuAfterGang(pl.mjhand, MjClient.gangCards[0], tData.hunCard)){
                            return MjClient.showToast("有胡必胡");
                        }
                    }
                    if (eT == 2) MJGangCardchange(btn.tag);
                },
                bgimg: {
                    _run: function() {
                        this.zIndex = -1;
                    }
                },
                bg_img:{
                    _run:function(){
                        var _Image_light_scale = this.getScale();
                        
                        var a = cc.scaleTo(0.5,_Image_light_scale*1.0);
                        var aa = cc.fadeIn(0.5);
                        var a1 = cc.scaleTo(1,_Image_light_scale*1.3);
                        var a2 = cc.fadeOut(1);
                        var a3 = cc.callFunc(function(){
                            //this.setOpacity(255);
                            this.setScale(_Image_light_scale*0.95);
                        }.bind(this));
            
                        this.runAction(cc.sequence(cc.spawn(a,aa), cc.spawn(a1,a2).easing(cc.easeCubicActionOut()),a3,cc.delayTime(0.2)).repeatForever());
                    
                    }

                },
                bgground: {
                    _run: function() {
                        this.zIndex = -1;
                    }
                }
            },
            gang1: {
                _visible: false,
                _layout: [
                    [0, 0.1],
                    [0.5, 0],
                    [-1.7, 3.8]
                ],
                card: {},
                _touch: function(btn, eT) {
                    if (eT == 2) MJGangCardchange(btn.tag);
                }
            },
            gang2: {
                _visible: false,
                _layout: [
                    [0, 0.1],
                    [0.5, 0],
                    [-1.7, 5.1]
                ],
                card: {},
                _touch: function(btn, eT) {
                    if (eT == 2) MJGangCardchange(btn.tag);
                }
            },
            guo: {
                _visible: false,
                _layout: [
                    [0, 0.1],
                    [0.5, 0],
                    [4.6, 2.5]
                ],
                _touch: function(btn, eT) {
                    if (eT == 2)
                    {
                        MjClient.MJPass2NetForTYZZ();
                    }
                },
                bgimg: {
                    _run: function() {
                        this.zIndex = -1;
                    }
                }
            },
            hu: {
                _visible: false,
                _layout: [
                    [0, 0.1],
                    [0.5, 0],
                    [-3, 2.5]
                ],
                bg_img:{
                    _run:function(){
                        var _Image_light_scale = this.getScale();
                        
                        var a = cc.scaleTo(0.5,_Image_light_scale*1.0);
                        var aa = cc.fadeIn(0.5);
                        var a1 = cc.scaleTo(1,_Image_light_scale*1.3);
                        var a2 = cc.fadeOut(1);
                        var a3 = cc.callFunc(function(){
                            //this.setOpacity(255);
                            this.setScale(_Image_light_scale*0.95);
                        }.bind(this));
            
                        this.runAction(cc.sequence(cc.spawn(a,aa), cc.spawn(a1,a2).easing(cc.easeCubicActionOut()),a3,cc.delayTime(0.2)).repeatForever());
                    
                    }

                },
                _touch: function(btn, eT) {
                    if (eT == 2) MJHuToServer();
                },
                bgimg: {
                    _run: function() {
                        this.zIndex = -1;
                    }
                }
            },
            cancel: {
                _visible: false,
                _layout: [
                    [0, 0.16],
                    [0.78, 0.1],
                    [0, 1.12]
                ],
                _touch: function(btn, eT) {
                    if (eT == 2) {
                        btn.visible = false;
                        MjClient.clickTing = false;
                        hideCurrentTingNum();
                        MjClient.playui.EatVisibleCheck();
                        MjClient.playui.CardLayoutRestore(MjClient.playui._downNode, 0);
                    }
                }
            },
            changeui: {
                _visible:true,
                changeuibg: {
                    _layout: [
                        [0.36, 0.36],
                        [0.5, 0.15],
                        [0, 0]
                    ],
                    _run: function() {
                        this.visible = false;
                        this.getChildByName("card").visible = false;
                        this.chiTouch = function(btn, et) {
                            if (et == 2) 
                            {
                                if (btn.name.localeCompare("card3") < 0)
                                {
                                    MJChiToServer(0);
                                }
                                else if (btn.name.localeCompare("card6") < 0)
                                {
                                    MJChiToServer(1);
                                }
                                else
                                {
                                    MJChiToServer(2);
                                }
                            }
                        };
                        this.gangTouch = function(btn, et) {
                            if (et == 2)
                                MJGangToServer(btn.tag);
                        };       
                    },
                    guobg: {
                        guo: {
                            _touch: function(btn, eT) {
                                if (eT == 2) MjClient.MJPass2NetForTYZZ();
                            }
                        },
                        fanhui: {
                            _touch: function(btn, et) {
                                if (et == 2) {
                                    btn.getParent().getParent().visible = false;
                                    MjClient.playui.EatVisibleCheck();
                                }
                            }
                        }
                    }
                }
            },
            _event: {
                clearCardUI: function() {
                    //add by sking
                    cc.log("ting yu no ting hide --------by sking");
                    MjClient.playui.EatVisibleCheck();
                    hideTingBtn();
                },
                MJPass: function(eD) {
                    console.log("HHH :，MJPass------");
                    setSkipHuState();
                    setSkipPengState(); // 开启 过碰 机制
                    MjClient.playui.EatVisibleCheck();
                },
                mjhand: function(eD) {
                    console.log("HHH :，mjhand------");
                    MjClient.playui.EatVisibleCheck();
                },
                waitPut: function() {
                    console.log("HHH :，waitPut------");
                    MjClient.playui.EatVisibleCheck();
                    COMMON_UI.cleanTingSign();
                    COMMON_UI.willHuShowArrow();
                },
                MJPut: function(eD) {
                    console.log("HHH :，MJPut------");
                    MjClient.playui.EatVisibleCheck();
                },
                MJPeng: function(eD) {
                    console.log("HHH :，MJPeng------");
                    MjClient.playui.EatVisibleCheck();
                },
                MJChi: function(eD) {
                    console.log("HHH :，MJChi------");
                    MjClient.playui.EatVisibleCheck();
                },
                MJGang: function(eD) {
                    console.log("HHH :，MJGang------");
                    MjClient.playui.EatVisibleCheck();
                },
                MJTing: function (eD) {
                    console.log("HHH :，MJTing------");
                    hideTingBtn();
                    isCheckedTing = false;
                },
                roundEnd: function(eD) {
                    console.log("HHH :，roundEnd------");
                    MjClient.playui.EatVisibleCheck();
                },
                initSceneData: function(eD) {
                    function delayExe()
                    {
                        MjClient.playui.EatVisibleCheck();
                    }
                    this.runAction(cc.sequence(cc.DelayTime(0.1),cc.callFunc(delayExe)));
                }
            }
        },
        gps_btn: {
            _layout: [
                [0.09, 0.09],
                [0.95, 0.0],
                [0, 3.7]
            ],
            _run: function() {
                this.setVisible((MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP|| MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ) && MjClient.MaxPlayerNum != 2);
            },
            _click: function() {
                if (MjClient.MaxPlayerNum == 3) {
                    MjClient.Scene.addChild(new showDistance3PlayerLayer());
                } else if (MjClient.MaxPlayerNum == 4) {
                    MjClient.Scene.addChild(new showDistanceLayer());
                }
                MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Dingwei", {uid: SelfUid(),gameType:MjClient.gameType});
            }
        },
        chat_btn: {
            _layout: [
                [0.09, 0.09],
                [0.95, 0.1],
                [0, 3.7]
            ],
            _click: function() {
                var chatlayer = new ChatLayer();
                MjClient.Scene.addChild(chatlayer);
            }
        },
        voice_btn: {
            _layout: [
                [0.09, 0.09],
                [0.95, 0.2],
                [0, 3.7]
            ],
            _run: function() {
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
        hua_btn: {
            _layout: [
                [0.09, 0.09],
                [0.95, 0.2],
                [0, 1.5]
            ],
            _run: function() {
                this.visible = false;
                this.opacity = 255;
                if (IsArrowVisible()) this.visible = true;;
            },
            _touch: function(btn, eT) {
                if (eT == 2) {
                    //显示花
                    var layer = new showFlowerLayer();
                    MjClient.Scene.addChild(layer);
                }
            }
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
                    if(pl&&pl.trust){
                        this.visible = true;
                    }else {
                        this.visible = false;
                    }
                }
            }
        },
        jiaPiao: {
            _run: function(){
                this.visible = false;
                setWgtLayout(this,[0.12, 0.12], [0.5, 0.25], [0, 0]);
            },
            piao0: {
                _click:function(btn){  
                    MjClient.gamenet.request("pkroom.handler.tableMsg", {
                        cmd: "MJJiazhu",
                        uid: SelfUid(),
                        jiazhuNum: 0,
                    }); 
                }
            },
            piao1: {
                _click:function(btn){  
                    MjClient.gamenet.request("pkroom.handler.tableMsg", {
                        cmd: "MJJiazhu",
                        uid: SelfUid(),
                        jiazhuNum: 1,
                    }); 
                }
            },
            piao2: {
                _click:function(btn){  
                    MjClient.gamenet.request("pkroom.handler.tableMsg", {
                        cmd: "MJJiazhu",
                        uid: SelfUid(),
                        jiazhuNum: 2,
                    }); 
                }
            },
            piao3: {
                _click:function(btn){  
                    MjClient.gamenet.request("pkroom.handler.tableMsg", {
                        cmd: "MJJiazhu",
                        uid: SelfUid(),
                        jiazhuNum: 3,
                    }); 
                }
            },
            _event: {
                initSceneData: function(){
                    var tData = MjClient.data.sData.tData;
                    if(tData.areaSelectMode.piaoType < 4){
                        this.visible = false;
                        return;
                    }
                    var pl = getUIPlayer(0);
                    if(!pl){
                        return;
                    }
                    if(pl.mjState == TableState.waitJiazhu){
                        this.visible = true;
                    }
                },
                waitJiazhu: function(){
                    var tData = MjClient.data.sData.tData;
                    if(tData.areaSelectMode.piaoType < 4){
                        this.visible = false;
                        return;
                    }
                    this.visible = true;
                },
                mjhand: function(){
                    this.visible = false;
                },
                MJJiazhu: function(eD){
                    var tData = MjClient.data.sData.tData;
                    if(tData.areaSelectMode.piaoType < 4){
                        this.visible = false;
                        return;
                    }
                    var pl = getUIPlayer(0);
                    if(!pl){
                        return;
                    }
                    if(pl.info.uid == eD.uid){
                        this.visible = false;
                    }
                }
            }
        },
        piaoNiao: {
            _run: function(){
                this.visible = false;
                setWgtLayout(this,[0.12, 0.12], [0.5, 0.25], [0, 0]);
            },
            piao0: {
                _click:function(btn){  
                    MjClient.gamenet.request("pkroom.handler.tableMsg", {
                        cmd: "MJJiazhu",
                        uid: SelfUid(),
                        jiazhuNum: 0,
                    }); 
                }
            },
            piao1: {
                _click:function(btn){  
                    MjClient.gamenet.request("pkroom.handler.tableMsg", {
                        cmd: "MJJiazhu",
                        uid: SelfUid(),
                        jiazhuNum: 2,
                    }); 
                }
            },
            _event: {
                initSceneData: function(){
                    var tData = MjClient.data.sData.tData;
                    if(!tData.areaSelectMode.piaoniao){
                        this.visible = false;
                        return;
                    }
                    var pl = getUIPlayer(0);
                    if(!pl){
                        return;
                    }
                    if(pl.mjState == TableState.waitJiazhu){
                        this.visible = true;
                        if(pl.jiazhuNum > 0){
                            var piao0Btn = this.getChildByName("piao0");
                            piao0Btn.loadTextures("playing/gameTable/buchuo_n.png","playing/gameTable/buchuo_s.png");
                            var piao1Btn = this.getChildByName("piao1");
                            piao1Btn.loadTextures("playing/gameTable/chuoda_n.png","playing/gameTable/chuoda_s.png");                            
                        }else{
                            var piao0Btn = this.getChildByName("piao0");
                            piao0Btn.loadTextures("playing/gameTable/buzha_n.png","playing/gameTable/buzha_s.png");
                            var piao1Btn = this.getChildByName("piao1");
                            piao1Btn.loadTextures("playing/gameTable/zhaniao_n.png","playing/gameTable/zhaniao_s.png");
                        }
                    }
                },
                waitJiazhu: function(eD){
                    var tData = MjClient.data.sData.tData;
                    if(!tData.areaSelectMode.piaoniao){
                        this.visible = false;
                        return;
                    }
                    var pl = getUIPlayer(0);
                    if(!pl){
                        return;
                    }
                    //如果赢家选了扎鸟，则替换为"戳"的按钮
                    if(cc.isArray(eD.chuoId) && eD.chuoId.indexOf(pl.info.uid) >= 0 && pl.jiazhuNum == 2){
                        var piao0Btn = this.getChildByName("piao0");
                        piao0Btn.loadTextures("playing/gameTable/buchuo_n.png","playing/gameTable/buchuo_s.png");
                        var piao1Btn = this.getChildByName("piao1");
                        piao1Btn.loadTextures("playing/gameTable/chuoda_n.png","playing/gameTable/chuoda_s.png");
                    }else{
                        var piao0Btn = this.getChildByName("piao0");
                        piao0Btn.loadTextures("playing/gameTable/buzha_n.png","playing/gameTable/buzha_s.png");
                        var piao1Btn = this.getChildByName("piao1");
                        piao1Btn.loadTextures("playing/gameTable/zhaniao_n.png","playing/gameTable/zhaniao_s.png");
                    }
                    if(cc.isArray(eD.chuoId) && eD.chuoId.indexOf(pl.info.uid) >= 0 && pl.jiazhuNum == 4){
                        this.visible = false;
                    }else{
                        this.visible = true;
                    }
                },
                mjhand: function(){
                    this.visible = false;
                },
                MJJiazhu: function(eD){
                    var tData = MjClient.data.sData.tData;
                    if(!tData.areaSelectMode.piaoniao){
                        this.visible = false;
                        return;
                    }
                    var pl = getUIPlayer(0);
                    if(!pl){
                        return;
                    }
                    if(pl.info.uid == eD.uid){
                        this.visible = false;
                    }
                }
            }
        }
    },
    _downNode:null,
    _rightNode:null,
    _topNode:null,
    _leftNode:null,
    _btnPutCard:null,
    _btnFlower:null,
    ctor: function() {
        this._super();
        var playui = ccs.load(res.Play_TYZZ_json);
        playMusic("bgFight");
        this._downNode  = playui.node.getChildByName("down");
        this._rightNode = playui.node.getChildByName("right");
        this._topNode   = playui.node.getChildByName("top");
        this._leftNode  = playui.node.getChildByName("left");
        MjClient.playui = this;
        this._btnPutCard = playui.node.getChildByName("BtnPutCard");
        this._tingCardsNode = this._downNode.getChildByName("tingCardsNode");
        this._tingCardNumNode = this._downNode.getChildByName("tingCardNumNode");
        MjClient.playui._AniNode =  playui.node.getChildByName("eat");
        BindUiAndLogic(playui.node, this.jsBind);

        if (MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP|| MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ){
            // 添加光晕动画
            COMMON_UI.addAniEatCardsBtn();
        }

        this.addChild(playui.node);

        //添加滚动通知 by sking
        var _laba_bg =  playui.node.getChildByName("banner").getChildByName("laba_bg");
        _laba_bg.visible = false;
        var _scroll =  playui.node.getChildByName("banner").getChildByName("scroll");
        _scroll.visible = false;
        MjClient.playui._btnFlower = playui.node.getChildByName("hua_btn");
        //var _msg = _scroll.getChildByName("msg");
        //homePageRunText(_msg);
        //function getMsg()
        //{
        //    var content = (MjClient.updateCfg != null && (typeof MjClient.updateCfg) != 'undefined') ? MjClient.updateCfg.homeScroll : "";
        //    return MjClient.isTest ? "" : content;
        //}
        //_msg.setString(getMsg());
        var arrowbk3D = getNode(0).getParent().getChildByName("arrowbk3D");
        if(arrowbk3D)arrowbk3D.visible = false;

        MjClient.lastMJTick = Date.now();
        this.runAction(cc.repeatForever(cc.sequence(cc.callFunc(function() {
            if (MjClient.game_on_show) MjClient.tickGame(0);
        }), cc.delayTime(7))));

        changeMJBg(this, getCurrentMJBgType());

        if (MjClient.data.sData.tData.areaSelectMode["convertible"] && MjClient.rePlayVideo == -1)
            addFreeNumberBtn([0.5, 0.48]);

        initSceneFunc();
        // 在亲友圈房间中添加邀请亲友圈牌有一起对局
        addClubYaoqingBtn();

        return true;
    },
    /*
     判断当前是否可以出牌，add by sking
     */
    isCanPutCard:function()
    {
        var bPut = false;
        var downNode = MjClient.playui._downNode;
        var standUI = downNode.getChildByName("stand");
        var children = downNode.children;
        for(var i = 0; i < children.length; i++)
        {
            if(children[i].name == "mjhand")
            {
                if(children[i].y > standUI.y + 10)
                {
                    bPut = true;
                    break;
                }
            }
        }
        return bPut;
    },

    /*
     设置听的icon 是否可见 add by sking
     */
     tingIconVisible:function(node,off)
    {
        if (!MjClient.data.sData.tData.areaSelectMode.isOpenTingTip)
            return false;

        var pl = getUIPlayer(off)
        if(pl == null) return;
        var tData = MjClient.data.sData.tData;
        cc.log("offffffffffffffffffffff  =  " + off );
        //cc.log("(((((((((((( set card))))))))))))))))) == pl.mjState  " + pl.mjState );

        if(pl && (pl.mjState == TableState.isReady || pl.mjState == TableState.roundFinish))
        {
            //准备状态时，所有的听Icon不可见
            //var node = node.getParent().getParent().getParent().getChildByName("")
            var _tingIcon1 = this._downNode.getChildByName("head").getChildByName("tingIcon");
            _tingIcon1.visible = false;

            var _tingIcon2 = this._rightNode.getChildByName("head").getChildByName("tingIcon");
            _tingIcon2.visible = false;

            var _tingIcon3 = this._topNode.getChildByName("head").getChildByName("tingIcon");
            _tingIcon3.visible = false;

            var _tingIcon4 = this._leftNode.getChildByName("head").getChildByName("tingIcon");
            _tingIcon4.visible = false;
            // cc.log("(((((((((((( TableState.isReady))))))))))))))))) == TableState.isReady  " + TableState.isReady);
            node.visible = false;
        }else{
            if(pl != null)
            {
                if (pl.isTing) {
                    // cc.log("(((((((((((( TableState.isReady))))))))))))))))) == pl.isTing  " + pl.isTing);
                    node.visible = true;
                    if (off == 0)
                    {
                        var tingSet = calTingSet(pl.mjhand, MjClient.data.sData.tData.hunCard);
                        setTingCards(this._tingCardsNode,tingSet);
                    }
                }
                else {
                    node.visible = false;
                }
            }
        }
        return node.visible;
    },
    /*
        设置听牌之后打牌的花色, by sking
    */
    setTingCardInfo:function(node,eD,off)
    {
        /*
            游戏准备
         */
        cc.log("%%%%%%%%%%%%%%%%setCard%%%%%%%%%%%%%%%%%%% = " + off);
        var pl = getUIPlayer(off);
        if(pl == null) return;
        var tData = MjClient.data.sData.tData;
        cc.log("(((((((((((( set card))))))))))))))))) == pl.mjState  " + pl.mjState);
        if( pl.mjState == TableState.isReady || pl.mjState == TableState.roundFinish)
        {
            cc.log("*********set ting card info***************111");
            node.visible = false;
            return;
        }

        /*
            判断是否拿到了听之后的那张牌
         */
        var cd = -1;

        if(pl.isTing)
        {
            if(pl.putCardAfterTing)
            {
                cd = pl.putCardAfterTing;
            }else{
                return;
            }
        }else{
            node.visible = false;
            return;
        }

        cc.log("%%%%%%%%%%%%%%%%setCard%%%%%%%%%%%%%%%%%%%  pl.putCardAfterTing = " + pl.putCardAfterTing);

        /*
            设置麻将的花纹
         */
        //东南西北中发白
        var imgNames = ["Bamboo_", "Character_", "Dot_", "Wind_east", "Wind_south", "Wind_west", "Wind_north", "Red", "Green", "White"];
        var offSets = [];
        if (getCurrentMJBgType() == 0)
            offSets = [[50, 90], [60, 70], [50, 90], [60, 70], [48, 62]];
        else
            offSets = [[52, 100], [60, 70], [52, 100], [60, 70], [50, 66]];
        //麻将的底牌公用图，4张
        //node.loadTexture("playing/MJ/Mj_up_" + off + ".png");

        var imgNode = new ccui.ImageView();
        imgNode.setPosition(offSets[0][0], offSets[0][1]);
        node.visible = true;
        node.removeAllChildren();
        node.addChild(imgNode);

        // 贴在麻将上面可变的图
        var path = "playing/MJ/"
        var imgName = "";
        if(cd < 30)
        {
            //条，筒，万
            imgName = imgNames[Math.floor(cd / 10)] + cd % 10;
        }
        else if (cd <= 91)
        {	//东南西北中发白
            imgName = imgNames[Math.floor(cd / 10)];//东南西北中发白
        }
        else if (cd <= 181){
            imgName = "flower_" + cd;
        }

        //node.tag = cd;
        var callback = function()
        {
            //加载小图
            imgNode.loadTexture(getNewMJBgFile(path + imgName + ".png"));
            if (getCurrentMJBgType() != 0) {
                // 左右两侧的牌偏大，特殊处理，缩小
                if (off == 1 || off == 3) {
                    imgNode.setScale(0.8);
                }
            }
        };

        node.stopAllActions();
        node.runAction(cc.sequence(cc.callFunc(callback), cc.delayTime(1)));
    },
    /*
        打出去的牌是那个玩家的， by sking
     */
    isPlayerPutCard:function(eD,off)
    {
        var tData = MjClient.data.sData.tData;
        var uids = tData.uids;
        var idx = uids.indexOf(eD.uid);
        var selfidx = uids.indexOf(SelfUid());
        var offidx = (idx-selfidx+4)%4;

        if(offidx == off)
        {
            return true;
        }
        else
        {
            return false;
        }
    },


});

PlayLayer_TYZZ.prototype.CardLayoutRestore = function(node, off, isNewCard)
{
    // node 是克隆新建的一个麻将节点 by sking

    var newC = null; //先创建麻将的UI节点
    var newVal = 0; //新牌的值，是几万，几筒，几条....为数字
    var pl = getUIPlayer(off);//获取玩家信息.off 为0 ，就是自己得信息，能看到自己摸牌 by sking
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
        }
    }
    var tempMaJiang = MjClient.majiang; //麻将的各种方法判断，是否可以杠，是否可以吃... by sking
    //排序麻将的位置 by sking
    if (pl.mjhand && pl.mjhand.length > 0)
    {
        var count = tempMaJiang.CardCount(pl);
        if(count == 14 && mjhandNum == pl.mjhand.length)
        {
            if(pl.isNew ) //isNew 每次摸完牌后设为true,打出去一张牌后 设为false by sking
            {
                newVal = pl.mjhand[pl.mjhand.length - 1]; //为什么取最后一个节点 ？
            }
            else
            {
                pl.mjhand.sort(function(a, b)
                {
                    if(MjClient.data.sData.tData.hunCard == a)
                    {
                        return -1;
                    }
                    else if (MjClient.data.sData.tData.hunCard == b)
                    {
                        return 1;
                    }
                    else
                    {
                        return a - b;
                    }
                });

                newVal = pl.mjhand[pl.mjhand.length - 1];
            }
        }
    }
    //up stand 是2种麻将的图。
    var up = node.getChildByName("up");
    var stand = node.getChildByName("stand");
    var start, offui;
    switch (off)
    {
        case 0:
            start = up;
            offui = stand;
            break;
        case 1:
            start = stand;
            offui = up;
            break;
        case 2:
            start = stand;
            offui = up;
            break;
        case 3:
            start = stand;
            offui = up;
            break;
    }
    var upSize = offui.getSize();
    var upS = offui.scale;
    //mjhand standPri out chi peng gang0 gang1
    var uipeng = [];
    var uigang0 = [];
    var uigang1 = [];
    var uichi = [];
    var uistand = [];
    var uihun = [];//癞子牌在最左边
    // var sData = MjClient.data.sData;
    // var tData = sData.tData;
    for(var i = 0; i < children.length; i++) //children 为 "down" 节点下的字节点
    {
        var ci = children[i];
        if(ci.name == "mjhand")
        {
            if(newC == null && newVal == ci.tag)
            {
                newC = ci; //从down 节点下，复制一个麻将node保存在newC 里 by sking    //newC就是新摸的那张手牌
            }
            else
            {
                if(MjClient.data.sData.tData.hunCard == ci.tag)
                {
                    uihun.push(ci);
                }
                else
                {
                    uistand.push(ci);
                }
            }
            if(MjClient.data.sData.tData.hunCard == ci.tag)
            {
                ci.setColor(cc.color(255,255,63));
            }
        }
        else if(ci.name == "standPri")
        {
            uistand.push(ci);
        }
        else if(ci.name == "gang0")
        {
            uigang0.push(ci);
        }
        else if (ci.name == "gang1")
        {
            uigang1.push(ci);
        }
        else if (ci.name == "chi")
        {
            uichi.push(ci);
        }
        else if (ci.name == "peng")
        {
            uipeng.push(ci);
        }
        else if(ci.name == "mjhand_replay")
        {
            uistand.push(ci);
            // if(MjClient.data.sData.tData.hunCard == ci.tag)
            // {
            //     uihun.push(ci);
            // }
            // else
            // {
            //     uistand.push(ci);
            // }

            // if(MjClient.data.sData.tData.hunCard == ci.tag)
            // {
            //     ci.setColor(cc.color(255,255,63));
            // }
        }
    }
    var HandCardsLength = uistand.length + uihun.length;
    if (off != 0 /*&& MjClient.rePlayVideo != -1*/ && HandCardsLength > 0 && HandCardsLength % 3 == 2) // 回放或倒牌
    {
        var lastCard = uistand.pop();
        uistand.sort(TagOrder);

        if(uihun.length > 0) //是否有柰子，有则放在最前面 by sking
        {
            for(var i = 0; i < uihun.length; i++)
            {
                uistand.unshift(uihun[i]); //向数组开头添加一个元素 unshift
            }
        }
        //uistand.push(lastCard);
        uistand.unshift(lastCard);
        cc.log(" rePlayVideo ----------",lastCard.name,lastCard.tag);
    } 
    else 
    {
        uistand.sort(TagOrder);
        
        if(uihun.length > 0) //是否有柰子，有则放在最前面 by sking
        {
            for(var i = 0; i < uihun.length; i++)
            {
                uistand.unshift(uihun[i]); //向数组开头添加一个元素 unshift
            }
        }
    }

    cc.log("newc  --------",newC);
    if(newC)
    {
        uistand.push(newC); //把这张牌放入手牌的数组里  by sking
    }

    if (off == 3) 
    {
        //解决碰杠牌翻转---------------
        uichi.reverse();
        uipeng.reverse();
        //uigang1.reverse();
        //uigang0.reverse();
    }
    var uiOrder = [uigang1, uigang0, uipeng, uichi, uistand];
    if(off == 1 || off == 2 || off == 3)
    {
        uiOrder.reverse();//颠倒顺序
    }
    var orders = []; //重新排序后装到数组里 by sking
    var handorders = uistand;
    for(var j = 0; j < uiOrder.length; j++)
    {
        var uis = uiOrder[j];
        for(var i = 0; i < uis.length; i++)
        {
            orders.push(uis[i]);
        }
    }

    if (off == 2)
        upS *= 1.08;
    else if (getCurrentMJBgType() == 1)
        upS *= 0.98;
    
    //设置麻将大小
    var slotwith = upSize.width * upS * 0.2;//0.05;
    var slotheigt = upSize.height * upS * 0.3;
    var hasUp = false;
    for(var i = 0; i < orders.length; i++)
    {
        var ci = orders[i];
        if(off % 2 == 0)//自己或者对家
        {
            if(i != 0)
            {
                if(ci.name == orders[i - 1].name)
                {
                    if(ci.isgang4)
                    {
                        ci.x = orders[i - 2].x;
                        ci.y = orders[i - 2].y + upSize.height * upS * 0.18;
                    }
                    else if(orders[i - 1].isgang4)
                    {
                        ci.x = orders[i - 2].x + upSize.width * upS + slotwith;
                    }
                    else if (orders[i - 1].ispeng3 || orders[i - 1].ischi3) 
                    {
                        ci.x = orders[i - 1].x + upSize.width * upS + slotwith;
                    }
                    else
                    {
                        if(ci.name == "mjhand")
                        {
                            if(off == 0)
                            {
                                ci.x = orders[i - 1].x + upSize.width * upS * 1.26//1.08;
                            }
                            else//这个地方不是对家的手牌，下面的代码好像没用
                            {
                                ci.x = orders[i - 1].x + upSize.width * upS * 1.8;
                            }
                        }
                        else
                        {
                            if(off == 0)
                            {
                                ci.x = orders[i - 1].x + upSize.width * upS * 1.05;
                            }
                            else
                            {
                                if (handorders.length % 3 == 2 && i == 1) 
                                {
                                    ci.x = start.x + upSize.width * upS * 2;
                                }
                                else
                                {
                                    ci.x = orders[i - 1].x + upSize.width * upS * 1;//对家的手牌
                                }
                            }
                        }
                    }
                }
                else if(orders[i - 1].name == "gang0" || orders[i - 1].name == "gang1")
                {
                    ci.x = orders[i - 2].x + upSize.width * upS + slotwith;
                }
                else
                {
                    ci.x = orders[i - 1].x + upSize.width * upS * 1.3;
                }


            }
            else
            {
                if (off == 0)
                {
                    ci.x = start.x + upSize.width * upS * 0.1;
                }
                else
                {
                    if (handorders.length % 3 == 2) 
                    {
                        ci.x = start.x;
                    }
                    else{
                        //ci.x = start.x + upSize.width * upS;
                        ci.x = start.x + upSize.width * upS * 2; 
                    } 
                }

                var isGray =  pl.isTing && ci.name == "mjhand";
                if (isGray)
                {
                    ci.setColor(cc.color(190, 190, 190));
                    ci.addTouchEventListener(function () {});
                }

                if (ci.name == "mjhand" && (pl.isTing || MjClient.clickTing && !MjClient.canTingCards[ci.tag]))
                    ci.setColor(cc.color(190, 190, 190));
                else
                    ci.setColor(cc.color(255, 255, 255));
            }

            if(off == 0)
            {
                /*
                 ting的情况下，将麻将置灰
                 */
                // console.log("--------orders.length--------"+orders.length);
                var isGray =  pl.isTing && ci.name == "mjhand";
                //if(ci.name == "mjhand")

                if(MjClient.clickTing)
                {
                    if (ci.name == "mjhand")
                    {
                        if(MjClient.canTingCards[ci.tag])
                        {
                            ci.setColor(cc.color(255, 255, 255));
                            if (!hasUp) {
                                ci.y += 20;
                                hasUp = true;
                            }
                        }
                        else {
                            ci.setColor(cc.color(190, 190, 190));
                        }
                    }
                    else {
                        ci.setColor(cc.color(255, 255, 255));
                    }
                }
                else if(i == orders.length - 1)
                {
                    console.log(ci.tag+"--------newC---3-----"+newC);
                    if(newC)
                    {
                        ci.setColor(cc.color(255, 255, 255));
                        SetTouchCardHandler(stand, ci);
                        if (getCurrentMJBgType() == 2)
                            ci.x = ci.x + (slotwith + 10)/2;
                        else
                            ci.x = ci.x + slotwith + 10;
                        if (isGray) // 岳阳APP不自动提起新牌
                            ci.y += 20;

                        MjClient.newCard = newC;
                        MjClient.newCard.isNew = true;

                        if (isNewCard && !isGray) {
                            COMMON_UI.newCardShakAni_yueYang(ci, off);
                        }
                    }
                    else if(isGray)
                    {
                        ci.setColor(cc.color(190, 190, 190));
                        ci.addTouchEventListener(function () {});
                    }
                    else
                    {
                        ci.setColor(cc.color(255, 255, 255));
                        SetTouchCardHandler(stand, ci);
                    }
                }
                else if(isGray)
                {
                    ci.setColor(cc.color(190, 190, 190));
                    ci.addTouchEventListener(function () {});
                }
                else
                {
                    ci.setColor(cc.color(255, 255, 255));
                    SetTouchCardHandler(stand, ci);
                }
            }
        }
        else if(off == 1)
        {
            if(i != 0)
            {
                if(ci.name == orders[i - 1].name)
                {
                    if(ci.isgang4)
                    {
                        ci.y = orders[i - 2].y + slotheigt;
                    }
                    else if(orders[i - 1].isgang4)
                    {
                        ci.y = orders[i - 2].y - upSize.height * upS * 1.1;
                    }
                    else if (orders[i - 1].ispeng3 || orders[i - 1].ischi3)
                    {
                        ci.y = orders[i - 1].y - upSize.height * upS * 1.1;
                    }
                    else
                    {
                        if (handorders.length % 3 == 2 && i == 1)
                        //if (i == 1) 
                        {
                            ci.y = start.y - upSize.height * upS * 0.8;
                        }
                        else
                        {
                            ci.y = orders[i - 1].y - upSize.height * upS * 0.8;
                        }
                    }
                }
                else if(orders[i - 1].name == "standPri")
                {
                    ci.y = orders[i - 1].y - upSize.height * upS * 2;
                }
                else if(orders[i - 1].name == "gang0" || orders[i - 1].name == "gang1")
                {
                    ci.y = orders[i - 2].y - upSize.height * upS * 1.1;
                }
                else if(orders[i - 1].name == "mjhand_replay")
                {
                    ci.y = orders[i - 1].y - upSize.height * upS * 2;
                }
                else
                {
                    ci.y = orders[i - 1].y - upSize.height * upS * 1.1;
                }

                ci.zIndex = orders[i - 1].zIndex + 1;//调整每张牌的层级
            }
            else
            {
                if (handorders.length % 3 == 2) 
                {
                    ci.y = start.y + upSize.height * upS * 1.4;
                }
                else
                {
                    ci.y = start.y - upSize.height * upS * 0.8 ;
                }

                ci.zIndex = start.zIndex;//第一张牌的层级
            }
        }
        else if(off == 3)
        {
            if(i != 0)
            {
                if(ci.name == orders[i - 1].name)
                {
                    if(ci.isgang4)
                    {
                        ci.y = orders[i - 2].y + slotheigt;
                    }
                    else if(orders[i - 1].isgang4)
                    {
                        ci.y = orders[i - 2].y + upSize.height * upS * 1.1;
                    }
                    else if (i >= 3 && (orders[i - 3].ispeng3 || orders[i - 3].ischi3))
                    {
                        ci.y = orders[i - 1].y + upSize.height * upS * 1.1;
                    }
                    else
                    {
                        if (handorders.length % 3 == 2 && i == 1)
                        //if (i == 1) 
                        {
                            ci.y = start.y + upSize.height * upS * 2.7 ;
                        }
                        else
                        {
                            ci.y = orders[i - 1].y + upSize.height * upS * 0.8;
                        }
                    }
                }
                else if(orders[i - 1].name == "standPri")
                {
                    ci.y = orders[i - 1].y + upSize.height * upS * 2;
                }
                else if(orders[i - 1].name == "gang0" || orders[i - 1].name == "gang1")
                {
                    ci.y = orders[i - 2].y + upSize.height * upS * 1.1;
                }
                else if(orders[i - 1].name == "mjhand_replay")
                {
                    ci.y = orders[i - 1].y + upSize.height * upS * 2;
                }
                else
                {
                    ci.y = orders[i - 1].y + upSize.height * upS * 1.1;
                }

                ci.zIndex = orders[i - 1].zIndex - 1;//调整每张牌的层级
                if (i > 2 && orders[i - 1].isgang4) 
                {
                        ci.zIndex = orders[i - 2].zIndex - 1;
                }
                if (ci.isgang4)
                {   
                    ci.zIndex = orders[i - 2].zIndex + 1;
                } 
            }
            else
            {
                if (handorders.length % 3 == 2) 
                {
                    ci.y = start.y + upSize.height * upS * 0.5 ;
                }
                else{
                    ci.y = start.y + upSize.height * upS * 2.7 ;
                }

                ci.zIndex = start.zIndex;//第一张牌的层级
            }
        }
    }

    //其他家新摸的牌动作
    if (isNewCard && off != 0) {
        if (COMMON_UI3D.is3DUI() && off == 1) {
            COMMON_UI.newCardShakAni_yueYang(orders[1], off);
        } else {
            COMMON_UI.newCardShakAni_yueYang(orders[0], off);
        }
    }

    if(COMMON_UI3D.is3DUI()){
        COMMON_UI3D.set3DCardSprite(off);
    }
    else {
        //刷新手牌大小
        resetCardSize();
    }
    COMMON_UI.cleanTingSign();
    COMMON_UI.willHuShowArrow();
};
// 判断吃碰杠胡的状态
PlayLayer_TYZZ.prototype.EatVisibleCheck = function()
{
    var eat = MjClient.playui.jsBind.eat;
    //sk 为啥要隐藏掉？   //因为一开始是不可见的，隐藏根节点 by sking
    MjClient.playui.jsBind.eat.changeui.changeuibg._node.visible = false;
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var leftCard = MjClient.majiang.getAllCardsTotal() - tData.cardNext;
    var children = getNode(0).children;

    eat.chi0._node.visible = false;
    eat.chi1._node.visible = false;
    eat.chi2._node.visible = false;
    eat.peng._node.visible = false;
    eat.gang0._node.visible = false;
    eat.gang1._node.visible = false;
    eat.gang2._node.visible = false;
    eat.hu._node.visible = false;
    eat.guo._node.visible = false;
    eat.cancel._node.visible = false;

    var pl = sData.players[SelfUid() + ""];
    MjClient.gangCards = [];
    MjClient.eatpos = [];

    var mj = MjClient.majiang;


    //吃碰杠胡node
    var vnode = [];

    if(
        pl.mjState == TableState.waitEat ||
        pl.mjState == TableState.waitPut &&
        tData.uids[tData.curPlayer] == SelfUid())
    {

    }
    else
    {
        return;
    }

    //自摸
    if(tData.tState == TableState.waitPut && pl.mjState == TableState.waitPut)
    {
        if(IsTurnToMe())
        {
            //检测补花
            var cduis=MjClient.playui.jsBind.down._node.children;
            for(var i=cduis.length-1;i>=0;i--)
            {
                if(cduis[i].name == "mjhand" && MjClient.majiang.isCardFlower(cduis[i].tag))
                {
                    var callback = function () {
                        PutOutCard(cduis[i], cduis[i].tag);
                    };
                    cduis[i].runAction(cc.sequence(cc.delayTime(0.3), cc.callFunc(callback)));
                    return;
                }
            }
            //胡
            if (pl.isNew && pl.eatFlag & 8) {
                pl.isZiMoHu = true;
                vnode.push(eat.hu._node);
            }
            else {
                pl.isZiMoHu = false;
            }

            //计算哪个些牌打出去可以听
            MjClient.canTingCards = {};
            for (var i = 0; i < pl.mjhand.length; i++) {
                var cardsAfterPut = pl.mjhand.slice(0);
                cardsAfterPut.splice(i,1); //依次去掉某张牌看能不能听
                if (MjClient.majiang.canTing(cardsAfterPut, MjClient.data.sData.tData.hunCard)) {
                      MjClient.canTingCards[pl.mjhand[i]] = 1;
                }
            }

            //杠
            var rtn = MjClient.majiang.canGang1(pl.mjpeng, pl.mjhand, pl.putCount);
            cc.log("$$$$杠牌监测"+JSON.stringify(rtn));
            if(rtn.length > 0 && pl.isNew && !pl.isPass)
            {
                MjClient.gangCards = rtn;
                vnode.push(eat.gang0._node);
            }
            var tData = MjClient.data.sData.tData;
            var isShow = tData.areaSelectMode.bihuType && pl.eatFlag & 8;
            if(vnode.length > 0 && !isShow)
            {
                vnode.push(eat.guo._node);
                eat.ting._node.visible = false;
                eat.noTing._node.visible = false;
                isCheckedTing = false;
            }
        }
    }
    //别人点
    else if(tData.tState == TableState.waitEat)
    {
        // cc.log("diao pao hu-=================================================");
        if(!IsTurnToMe())
        {
            if (pl.eatFlag & 8) {
                vnode.push(eat.hu._node);
            }
            if (pl.eatFlag & 4) {
                vnode.push(eat.gang0._node);
                MjClient.gangCards = [tData.lastPutCard];
                eat.gang0._node.visible = true;
                setCardSprite(eat.gang0.card1._node, MjClient.gangCards[0], 0);
            }
            if (pl.eatFlag & 2) {
                vnode.push(eat.peng._node);
            }


            var eatpos = MjClient.majiang.canChi(pl.mjhand, tData.lastPutCard,tData.hunCard);
            MjClient.eatpos = eatpos;
            if(pl.eatFlag & 1){
                vnode.push(eat.chi0._node);
            }

            //如果，有杠，碰，吃。 这出现过的UI. 否则玩家状态为等待
            var tData = MjClient.data.sData.tData;
            var isShow = tData.areaSelectMode.bihuType && pl.eatFlag & 8;
            if(vnode.length > 0)
            {
                if(!isShow){
                    vnode.push(eat.guo._node);
                    eat.ting._node.visible = false;
                    eat.noTing._node.visible = false;
                    isCheckedTing = false;
                }
            }
            else
            {
                getUIPlayer(0).mjState = TableState.waitCard;
            }
        }
    }

    //吃碰杠胡过处理
    if(vnode.length > 0)
    {
        var btnImgs =
        {
            "peng": ["playing/gameTable/youxizhong-2_57.png", "playing/gameTable/youxizhong-2_07.png"],
            "gang0": ["playing/gameTable/youxizhong-2_55.png", "playing/gameTable/youxizhong-2_05.png"],
            "chi0": ["playing/gameTable/youxizhong-2_59.png", "playing/gameTable/youxizhong-2_09.png"],
        }

        for(var i = 0; i < vnode.length; i++)
        {
            vnode[i].visible = true;
            
            if(vnode[i].getChildByName("card1"))
            {
                vnode[i].getChildByName("card1").visible = false;
            }

            if(vnode[i].getChildByName("bgground"))
            {
                vnode[i].getChildByName("bgground").visible = false;
            }

            if(vnode[i].getChildByName("bgimg"))
            {
                vnode[i].getChildByName("bgimg").visible = true;
            }

            var btnName = vnode[i].name;
            if(btnName == "peng" || btnName == "chi0" || btnName == "gang0")
            {
                vnode[i].loadTextureNormal(btnImgs[btnName][0]);
                // vnode[i].loadTexturePressed(btnImgs[btnName][1]);
            }

            if(i == 0)
            {
                var cardVal = 0;
                if(vnode[i].getChildByName("bgimg"))
                {
                    vnode[i].getChildByName("bgimg").visible = false;
                }

                if(btnName == "peng" || btnName == "chi0" || btnName == "gang0")
                {
                    vnode[i].loadTextureNormal(btnImgs[btnName][0]);
                    // vnode[i].loadTexturePressed(btnImgs[btnName][1]);
                }

                if(btnName == "peng")
                {
                    cardVal = tData.lastPutCard;
                }
                else if(btnName == "chi0")
                {
                    if(MjClient.eatpos.length == 1)
                    {
                        cardVal = tData.lastPutCard;
                    }
                }
                else if(btnName == "gang0")
                {
                    if(MjClient.gangCards.length == 1)
                    {
                        cardVal = MjClient.gangCards[0];
                    }
                }
                else if(btnName == "hu")
                {
                    if(IsTurnToMe())
                    {
                        cardVal = pl.mjhand[pl.mjhand.length - 1];
                    }
                    else
                    {
                        cardVal = tData.lastPutCard;
                    }
                }

                if(cardVal && cardVal > 0)
                {
                    setCardSprite(vnode[0].getChildByName("card1"), cardVal, 0);
                    vnode[0].getChildByName("card1").visible = true;
                }

                if(vnode[0].getChildByName("bgground"))
                {
                    vnode[0].getChildByName("bgground").zIndex = -1;
                    vnode[0].getChildByName("bgground").visible = true;
                }

                //屏蔽到 碰 ，杠 的显示牌 add by sking
                if(vnode[0].getChildByName("bgground"))
                {
                    vnode[0].getChildByName("bgground").visible = false;
                }
                if(vnode[i].getChildByName("card1"))
                {
                    vnode[i].getChildByName("card1").visible = false;
                }
                //end of 屏蔽 碰，杠的显示牌
            }

            var space = isIPad() ? 1.1 : 1.4;
            setWgtLayout(vnode[i], [0, 0.16], [0.70, 0], [(i - vnode.length + 1) * space, 1.8], false, false);
        }
    }

    /*吃碰杠按钮，适配iOS*/
    COMMON_UI.vnodeAdaptForiOS(vnode);

    if(eat.hu._node.visible)
    {
        MjClient.playui._btnPutCard.visible = false;
    }
}

PlayLayer_TYZZ.prototype.addtingcardsign = function(children,tingCard)
{
    for (var i = 0; i < children.length; i++) {
        if (children[i].name == "mjhand")
        {
            if (Object.keys(tingCard).length > 0)
            {
                if (children[i].tag in tingCard)
                {
                    if(!children[i].getChildByName("tingsign"))
                    {
                        var tingsign = new ccui.ImageView();
                        tingsign.loadTexture("playing/other/tingcard.png");
                        tingsign.setName("tingsign");
                        //tingsign.setScale(0);
                        tingsign.setPosition(children[i].getContentSize().width/2,children[i].getContentSize().height+20);
                        children[i].addChild(tingsign,20);
                    }
                    else
                    {
                        children[i].getChildByName("tingsign").setVisible(true);
                    }
                }
            }
        }
    }
}

PlayLayer_TYZZ.prototype.clearntingcardsign = function(children)
{
    for (var i = 0; i < children.length; i++) {
        if (children[i].name == "mjhand") 
        {
           var sign = children[i].getChildByName("tingsign");
           if (sign) 
           {
               // sign.removeFromParent();
               sign.setVisible(false);
           }
        }
    }
}

//新版及时刷新杠分（转转是通用玩法，只能保留两个了）
PlayLayer_TYZZ.prototype.newUpdateGangScore = function(node, data, off){
    var sData = MjClient.data.sData;
    if(!sData){
        return;
    }

    var pl = getUIPlayer(off);
    if(!pl){
        return;
    }

    var score = data.scoreArr[pl.info.uid + ""];
    if(!score || score == 0){
        return;
    }

    node.visible = true;
    node.setPosition(node.getUserData().pos);

    var iconImg = node.getChildByName("icon");
    var scoreText = node.getChildByName("score");

    pl.winall = pl.winall || 0;

    var iconFileName = score > 0 ? "playground/gang_addIcon.png":"playground/gang_subIcon.png";
    var scoreFileName = score > 0 ? "playground/gang_addText.png":"playground/gang_subText.png";

    iconImg.loadTexture(iconFileName);
    scoreText.setProperty(score, scoreFileName, 50, 73, ".");
    scoreText.ignoreContentAdaptWithSize(true);

    var moveAction = cc.moveBy(0.5,cc.p(0, 10))
    var callFunc = cc.callFunc(function(){
        var parent = node.parent;
        var coin = parent.getChildByName("coin");
        changeAtalsForLabel(coin, pl.gangScore + pl.winall);
    });
    var delayAction = cc.delayTime(1.5);
    var endCallFunc = cc.callFunc(function(){
        node.visible = false;
    });
    var seqAction = cc.sequence(moveAction, callFunc, delayAction, endCallFunc);
    node.runAction(seqAction);
};

PlayLayer_TYZZ.prototype.getIsZhongBird = function(cd,birdArr){
    var tData = MjClient.data.sData.tData ;
    var niaoToPl = {1: 0, 2: 1, 3: 2, 4: 3, 5: 0, 6: 1, 7: 2, 8: 3, 9: 0};
   
    //转转麻将上中下鸟不显示光效
    if(tData.gameType == MjClient.GAME_TYPE.TY_ZHUANZHUAN && tData.areaSelectMode.anzhuang){
        var cardNum = cd % 10;

        if ((tData.zhuang + cardNum + tData.maxPlayer - 1) % tData.maxPlayer == tData.uids.indexOf(SelfUid()))
        {
            return true;
        }
    }
    else if(tData.gameType == MjClient.GAME_TYPE.TY_ZHUANZHUAN && tData.areaSelectMode.buLunKong){
        var cardNum = cd % 10;

        if ((cardNum + tData.maxPlayer) % tData.maxPlayer == 1)
        {
            return true;
        }
    }
    else if(birdArr.length > 1 && tData.areaSelectMode.zhuaniao != 1){
        if (cd == 31 || cd == 71 ||
            (cd <= 29 && cd % 10 == 1 || cd % 10 == 5 || cd % 10 == 9))
        {
            return true
        }
    }
    return false;
}


//及时刷新杠分
PlayLayer_TYZZ.prototype.updateGangScore = function(node, data, off){
    node.visible = true;
    var winNode = node.getChildByName("win")
    winNode.visible = false;
    var loseNode = node.getChildByName("lose")
    loseNode.visible = false;
    var sData = MjClient.data.sData;
    if(!sData){
        return;
    }

    var pl = getUIPlayer(off);
    if(!pl){
        return;
    }
    var score = data.scoreArr[pl.info.uid + ""];
    if(!score || score == 0){
        return;
    }
    
    pl.winall = pl.winall || 0;
    var selectNode = score > 0 ? winNode : loseNode;
    selectNode.setPosition(winNode.getUserData().pos);
    selectNode.visible = true;
    selectNode.setString(score);
    var moveAction = cc.moveBy(0.5,cc.p(0, 10))
    var callFunc = cc.callFunc(function(){
        var parent = node.parent;
        var coin = parent.getChildByName("coin");
        changeAtalsForLabel(coin, pl.gangScore + pl.winall);
    });
    var delayAction = cc.delayTime(1.5);
    var endCallFunc = cc.callFunc(function(){
        node.visible = false;
        selectNode.visible = false;
    });
    var seqAction = cc.sequence(moveAction, callFunc, delayAction, endCallFunc);
    selectNode.runAction(seqAction);
};

//设置听牌
PlayLayer_TYZZ.prototype.setTingCards = function(node, tingSet) {
    node.zIndex = 500;
    node.visible = true;
    var cardNode0 = node.getChildByName("showNode");
    cardNode0.setVisible(false);
    var BindingNode = node.getChildByName("Node_card");
    BindingNode.removeAllChildren(true);
    node.setVisible(true);

    var ObjTingSet = {};
    if (Array.isArray(tingSet)) {
        for (var i = 0; i < tingSet.length; i++) {
            ObjTingSet[tingSet[i]] = 1;
        }
        tingSet = ObjTingSet;
    }

    var tingNum = 0;
    var cardTypeTotal = MjClient.majiang.getAllCardsTypeTotal();
    node.getChildByName("tingAllTip").visible = false;
    for (var cd in tingSet) {
        tingNum++;
    }
    if ((MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP || MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ) && tingNum == cardTypeTotal) {
        node.getChildByName("tingAllTip").visible = true;
        return ;
    }

    var i = 0;
    var j = 0;//高
    var bHaveValue = false;
    var lastCardNode = null;

    for (var cd in tingSet) {
        var cardNode = cardNode0.clone();
        lastCardNode = cardNode;
        cardNode.visible = true;
        bHaveValue = true;

        if (i == 17) {
            j++;
            i = 0;
        }
        if (MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP || MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ) {
            cardNode.setPositionY(cardNode0.getPositionY() + j*cardNode0.getBoundingBox().height);
        } else {
            cardNode.setPositionY(cardNode0.getPositionY() + j*cardNode0.getBoundingBox().height*0.85);
        }
        cardNode.setPositionX(cardNode0.getPositionX() + i*cardNode0.getBoundingBox().width*0.95);
        BindingNode.addChild(cardNode, 10-j);
        var off = 0;
        if (MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP || MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ) {
            off = 6;
        }
        setCardSprite(cardNode, parseInt(cd), off);
        i++;

    }

    var textContentW = 0;
    var pl = getUIPlayer(0);

    if (lastCardNode && pl.isTing) {
        var _gameName = new cc.LabelTTF("听牌自动摸打...",MjClient.fzcyfont,25);;
        _gameName.setFontSize(_gameName.getFontSize());
        if (MjClient.getAppType() != MjClient.APP_TYPE.QXYYQP && MjClient.getAppType() !== MjClient.APP_TYPE.YLHUNANMJ) {
            _gameName.setScale(3.5);
        }
        _gameName.setColor(cc.color(255,220,74));
        _gameName.setAnchorPoint(0,0.5);
        _gameName.setPosition(lastCardNode.getContentSize().width*1.3 ,lastCardNode.getContentSize().height/2);
        lastCardNode.addChild(_gameName);
        textContentW = _gameName.getContentSize().width;
    }

    //如果没有值则隐藏
    if (!bHaveValue) {
        node.visible = false;
    }

    if (j >= 1) {
        i = 17;
    }


    if (MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP || MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ ){
        var tingCardsHeight = cardNode0.getBoundingBox().height*1.1 + j*cardNode0.getBoundingBox().height;
    } else {
        var tingCardsHeight = cardNode0.getBoundingBox().height*1.1 + j*cardNode0.getBoundingBox().height*0.85;
    }

    var tingCardsWidth = cardNode0.getBoundingBox().width/0.207 + (i-1)*cardNode0.getBoundingBox().width*1.1;

    node.setContentSize(tingCardsWidth + textContentW, tingCardsHeight);
}

//设置可听的牌及其数量
PlayLayer_TYZZ.prototype.setCurrentTingNum = function(tingSet) {
    var carNumNode = MjClient.playui._tingCardNumNode;

    //如果没有可听的牌
    var bHaveValue = false;

    carNumNode.zIndex = 550;
    carNumNode.setAnchorPoint(0,0);
    carNumNode.setContentSize(272, 80);
    //位置被改变了，需要还原位置
    if (setTingCardPosX == null) {
        setTingCardPosX = carNumNode.getPositionX();
    } else {
        carNumNode.setPositionX(setTingCardPosX);
    }
    carNumNode.visible = true;
    var cardTextNode = carNumNode.getChildByName("showNode");
    cardTextNode.visible = false;

    if (MjClient.playui._tingCardsNode) {
        MjClient.playui._tingCardsNode.visible = !carNumNode.visible;
    }

    var BindingNode = carNumNode.getChildByName("Node_card");

    //删除之前，先把放在池子里面
    var BindingNodeChilds = BindingNode.children;
    for (var i = 0;i < BindingNodeChilds.length ;i++) {
        var c = BindingNodeChilds[i];
        CommonPool.putInPool(c);
    }

    BindingNode.removeAllChildren(true);

    if (MjClient.APP_TYPE.QXYYQP === MjClient.getAppType() || MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ) {
        var h = isIPhoneX() ? -0.1 : -0.5;
        setWgtLayout(carNumNode, [0.17, 0.17], [0.2, 0.25], [0, h]);
    }

    var tingNum = 0;
    var cardTypeTotal = MjClient.majiang.getAllCardsTypeTotal();
    carNumNode.getChildByName("tingAllTip").visible = false;
    for (var cd in tingSet) {
        tingNum++;
    }
    if ((MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP || MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ) && tingNum == cardTypeTotal) {
        carNumNode.getChildByName("tingAllTip").visible = true;
        return ;
    }

    var i=0;
    var j=0;//高的idx
    var width = 86;
    var hight = 80;

    for (var cd in tingSet) {
        if (i >= 7) {
            i = 0;
            j++;
        }

        var cardNode = CommonPool.getFromPool(cardTextNode.getName());
        if (!cardNode) {
            cardNode = cardTextNode.clone();
        }

        var countNode = cardNode.getChildByName("cardCount");
        var icount = getHuCardNum(parseInt(cd));
        countNode.setString(icount + "");
        var off = 0;
        if (MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP || MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ) {
            off = 6;
        }

        setCardSprite(cardNode.getChildByName("cardNode"), parseInt(cd), off);
        cardNode.setPositionX(cardTextNode.getPositionX() + width*i*1);
        cardNode.setPositionY(cardTextNode.getPositionY() + hight*j*1);
        cardNode.visible = true;
        bHaveValue = true;
        BindingNode.addChild(cardNode);
        i++;
    }
    //如果对象中没有值
    if(!bHaveValue)
    {
        carNumNode.visible = false;
    }

    //设置背景的长度
    if(j > 0) i = 7;
    var tingCardsWidth = (i + 1)*width + 20;
    var tingCardHigh = carNumNode.getContentSize().height + j*hight;
    carNumNode.setContentSize(tingCardsWidth, tingCardHigh);

    COMMON_UI.clearShowCurrentEatCards();
}