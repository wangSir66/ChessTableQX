/**
 * Created by Administrator on 2017/3/9.
 * 258麻将：配置地区有 衡阳、邵阳、旺旺 by cyc 20190823
 */
var actionZindex = 1000;
var _isShowShaiziAni_hengyangChangSha = false; //为了控制mjhand之后播骰子动画时newCard的状态显示
//向服务器发送 过消息
MjClient.MJPass2NetForHengYangChangSha = function()
{
   // console.log(">>>>>>>>>普通  过 <<<<<<<<");
    cc.log("====================send======pass=====");
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var roomMsgValue = tData.tableid +":"+tData.roundNum;
    var saveRoomMsgValueG = util.localStorageEncrypt.getStringItem("IGNORE_G_TIP","");

    if(IsTurnToMe() && tData.tState == TableState.waitPut)
    {
        var eat = MjClient.playui.jsBind.eat;
        var msg = "确认过";
        if(eat.gang0._node.visible)
        {
            msg += " 杠 ";
        }
        
        var isQiHu = false;
        if(eat.hu._node.visible)
        {   
            isQiHu = true;
            msg += " 胡 ";
        }

        msg = msg + "吗?";
        var popView = function () {
            MjClient.showMsg(msg, function () {
                if ((MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ || MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG) && eat.gang0._node.visible) {
                    util.localStorageEncrypt.setStringItem("IGNORE_G_TIP", roomMsgValue);
                }
                //cc.log("==========1=============");
                eat.gang0._node.visible = false;
                eat.gang1._node.visible = false;
                eat.hu._node.visible = false;
                eat.guo._node.visible = false;
                eat.ting._node.visible = false;
                eat.cancel._node.visible = false;
                eat.eatSelectPanel._node.visible = false;
                
                if(MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType() && isQiHu){
                    MjClient.showToast("你选择了过，暂时放弃胡牌");
                }
                
                MJPassConfirmToServer();
            }, function () { }, "1");
        }

        if((MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ || MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG) && eat.gang0._node.visible){
            // cc.log("＝＝＝＝＝＝saveRoomMsgValueG.length > 0 && saveRoomMsgValueG == roomMsgValue　",saveRoomMsgValueG , saveRoomMsgValueG, roomMsgValue)
            if(saveRoomMsgValueG.length > 0 && saveRoomMsgValueG == roomMsgValue){
                eat.gang0._node.visible = false;
                eat.gang1._node.visible = false;
                eat.hu._node.visible = false;
                eat.guo._node.visible = false;
                eat.ting._node.visible = false;
                eat.cancel._node.visible = false;
                eat.eatSelectPanel._node.visible = false;
                MJPassConfirmToServer();  
                return;
            }else{
                popView();
            }
        }else{
            popView();
        }
        
    }
    else
    {
        if(MjClient.playui.jsBind.eat.hu._node.visible)
        {
            MjClient.showMsg("确认不胡吗?", function(){
                if(MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType()){
                    MjClient.showToast("你选择了过，暂时放弃胡牌");
                }
                MJPassConfirmToServer();
            }, function() {}, "1");
        }
        else
        {
            MJPassConfirmToServer();
        }
    }
}

MjClient.MJPass3NetForHengYangChangSha = function(eatFlag, eatFlag2)
{
    cc.log("====================send======pass===== RRR ");
    var roomMsgValue = tData.tableid +":"+tData.roundNum;
    var saveRoomMsgValueB = util.localStorageEncrypt.getStringItem("IGNORE_B_TIP","");
    var msg = "确认过";
    if ((eatFlag & 8) || (eatFlag2 & 8))
    {
        msg += " 胡 ";
    }

    if ((eatFlag & 4) || (eatFlag2 & 4))
    {
        msg += " 补 ";
    }

    msg = msg + "吗?";
    var popView = function () {
        MjClient.showMsg(msg, function()
        {
            MjClient.playui.jsBind.eat.eatSelectPanel._node.visible = false;
            MjClient.majiang.MJPassConfirmToServer();
            if (MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ ) {
                util.localStorageEncrypt.setStringItem("IGNORE_B_TIP", roomMsgValue);
            }
        }, function() {}, "1");

    }
    if(MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ || MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG){
        if(saveRoomMsgValueG.length > 0 && saveRoomMsgValueG == roomMsgValue){
            MjClient.playui.jsBind.eat.eatSelectPanel._node.visible = false;
            MjClient.majiang.MJPassConfirmToServer();  
            return;
        }else{
            popView();
        }
    }else{
        popView();
    }


}
var showShaiziAni_hengyangChangSha = false
function showShaiziAni_hengyangChangSha_old(poff)
{
    if(poff == 0) {

        //摇骰子的时候全部隐藏
        var eat = MjClient.playui.jsBind.eat;
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

        if(MjClient.rePlayVideo != -1)//回放
        {
            for (var off = 0; off < 4; off++) {
                var _node = getNode(off);
                InitUserHandUI_hengyangChangSha(_node, off);
            }
            playEffect("shuffle");
            MjClient.playui.EatVisibleCheck();
            return;
        }

        var _AniNode = MjClient.playui._AniNode;
        var shaiziArray = [getRandomRange(0, 5), getRandomRange(0, 5)];
        var soundID = null;
        cc.log("shaiziArray = " + shaiziArray);
        _isShowShaiziAni_hengyangChangSha = true;
        cc.spriteFrameCache.addSpriteFrames("playing/other/shaizi.plist","playing/other/shaizi.png");
        var firstFrame = new cc.Sprite("#shaizi_1.png");
        var frames = [];
        var prefix = "shaizi_";
        var fc = cc.spriteFrameCache;
        for (var i = 1; i <= 9; i++) {
            var name = prefix + i + ".png";
            cc.log("----------name = " + name);
            var f = fc.getSpriteFrame(name);
            if(f)
            {
                frames.push(f);
            }
        }
        var animate = cc.animate(new cc.Animation(frames, 0.1, 2));
        var playSoundFunc = cc.callFunc(function(){
            //todo...如果需要播骰子声音在这里
            soundID = playEffect("shaizi",true);
        });
        firstFrame.setPosition(cc.p(MjClient.size.width/2,MjClient.size.height/2));
        firstFrame.setScale(MjClient.size.height/800);

        var showPonitFunc = cc.callFunc(function(){
            var _shai1 = new ccui.ImageView("playing/other/shaizi/"+ (shaiziArray[0]+ 1) + ".png");
            var _shai2 = new ccui.ImageView("playing/other/shaizi/"+(shaiziArray[1] + 1) +".png");
            _shai1.setPosition(cc.p((MjClient.size.width/2)*0.95,MjClient.size.height/2));
            _shai1.setName("shaizi");
            _shai2.setName("shaizi");
            _shai1.setScale(MjClient.size.height/800);
            _shai2.setScale(MjClient.size.height/800);
            _AniNode.addChild(_shai1,10000);
            _shai2.setPosition(cc.p((MjClient.size.width/2)*1.05 + 30,MjClient.size.height/2));
            _AniNode.addChild(_shai2,10000);
            firstFrame.visible = false;
            stopEffect(soundID);
        });



        firstFrame.runAction(cc.sequence(playSoundFunc, animate,showPonitFunc,cc.delayTime(0.8),cc.callFunc(function(){
            //发牌
            _isShowShaiziAni_hengyangChangSha = false;
            var _Anichildren = _AniNode.children;
            for(var i = 0; i < _Anichildren.length; i++) {
                var _c = _Anichildren[i];
                if(_c.name == "shaizi")
                {
                    _c.removeFromParent(true);
                }
            }
            for (var off = 0; off < 4; off++) {
                var _node = getNode(off);
                InitUserHandUI_hengyangChangSha(_node, off);
            }
            playEffect("shuffle");
            MjClient.playui.ShowQiShouHuTip();
            if( !MjClient.playui.haveQiShouHu() ){
                MjClient.playui.EatVisibleCheck();
            }
            else {
                MjClient.playui.hideAllEat();
            }
        }),cc.removeSelf()));
        _AniNode.addChild(firstFrame,10000);
    }
}

function updateHeadUI_hengyangChangSha(node, off , actionType)
{      
    cc.log('updateHeadUI_hengyangChangSha', off)
    var pl = getUIPlayer(off);
    if(!pl) return;
    // showHandCard_MLHZ(node, off);
    showHandCard_hengyangChangSha(node,off);
    MjClient.playui.CardLayoutRestore(node, off);
    cc.log('updateHeadUI_hengyangChangSha update success', off)

    // InitUserHandUI_MLHZ(node, off);

    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var uids = tData.uids;
    var selfIndex = getPlayerIndex(off);
    if(tData.curPlayer == selfIndex)
    {
        // ActionType.PENG
        ShowEatActionAnim(node, actionType, off);
    }
}

// 这个没看懂干嘛的
// off 是四个位置，根据off 显示四个位置的信息 by sking
function SetUserVisible_hengyangChangSha(node, off)
{
    if (_isShowShaiziAni_hengyangChangSha)  // 解决摇骰子时断线重连调用本函数，会手牌重复的bug by cyc
        return;

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
        InitUserHandUI_hengyangChangSha(node, off);
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

function showHandCard_hengyangChangSha(node, off)
{
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var pl = getUIPlayer(off);
    if(!pl)
    {
        return;
    }

    var children = node.children;
    for(var i = 0; i < children.length; i++)
    {
        var child = children[i];
        var name = child.name;
        if(name == "peng"
            || name == "chi"
            || name == "gang0"
            || name == "gang1"
            || name == "mjhand"
            || name == "mjhand_replay"
            || name == "standPri")
        {
            if(cc.sys.isObjectValid(child)) child.removeFromParent(true);
        }
        
    }

    
    //添加碰
    for(var i = 0; i < pl.mjpeng.length; i++)
    {
        var idx = tData.uids.indexOf(pl.info.uid);
        var offIdx = (pl.pengchigang.peng[i].pos - idx + MjClient.MaxPlayerNum) % MjClient.MaxPlayerNum - 1;//表示被碰的人和pl之间隔着几个人，如果是pl碰下家，则offIdx=0，pl碰上家，则offIdex=2

        for(var j = 0; j < 3; j++)
        {
            if(j == 1)
            {
                var cdui = getNewCard(node, "up", "peng", pl.mjpeng[i], off, "heng", "heng");
                setCardArrow(cdui, offIdx, off);
            }
            else
            {
                getNewCard(node, "up", "peng", pl.mjpeng[i], off);
            }
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
                offIdx = (pl.pengchigang.gang[j].pos - idx + MjClient.MaxPlayerNum) % MjClient.MaxPlayerNum - 1;
                break;
            }
        }
        if (offIdx == null)
        {
            for (var j=0; j<pl.pengchigang.pgang.length; j++)
            {
                if (pl.pengchigang.pgang[j].card == pl.mjgang0[i])
                {
                    offIdx = (pl.pengchigang.pgang[j].pos - idx + MjClient.MaxPlayerNum) % MjClient.MaxPlayerNum - 1;
                    break;
                }
            }
        }
        if (offIdx == null)
        {
            cc.log("InitUserHandUI:offIdx == null!!!!");
            offIdx = 0;
        }

        var setCardArrowOnGang4 = false;
        for(var j = 0; j < 4; j++)
        {
            if(j == 3)
            {
                var cdui = getNewCard(node, "up", "gang0", pl.mjgang0[i], off, "isgang4");
                cdui.tag = pl.mjgang0[i];//最后一张牌放上面
                if (setCardArrowOnGang4)
                {
                    setCardArrow(cdui, offIdx, off);
                }
            }
            else
            {
                if( (j % 3 == 2 - offIdx && off % 3 == 0) || (j % 3 == offIdx && off % 3 != 0) )
                {
                    var cdui = getNewCard(node, "up", "gang0", pl.mjgang0[i], off, "heng", "heng");
                    setCardArrowOnGang4 = true;
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

   // 把吃的牌放中间 begin
    if (pl.mjchi.length > 0){
        var allChiCards = pl.mjchi
        var oriBeChiCards = pl.mjchiCard
        var beChiCards = oriBeChiCards.slice(0,oriBeChiCards.length)

        var allChiCardArray = [];
        for(var i = 0,len = allChiCards.length;i < len;i += 3){
            allChiCardArray.push(allChiCards.slice(i,i+3));
        }
        for (var i = 0;i < allChiCardArray.length;i++){
            var chiCardIndex = -1
            for (var j = 0; j < allChiCardArray[i].length;j++){
                if (allChiCardArray[i][j] == beChiCards[0]){
                    chiCardIndex = j
                    beChiCards.splice(0,1)
                    break
                }
            }
            if (chiCardIndex >= 0){
                var chiCard = allChiCardArray[i][chiCardIndex]
                allChiCardArray[i].splice(chiCardIndex,1)
                allChiCardArray[i].splice(allChiCardArray[i].length / 2,0,chiCard)
            }
        }

        var str = allChiCardArray.join(",")
        var array = str.split(",")

        pl.mjchi = array.map(function(data){
            return +data;
        });
    }
    // end

    for(var i = 0; i < pl.mjchi.length; i++)
    {
        if(i % 3==0)
        {
            chiIdx++;
        }

        if(pl.mjchiCard[chiIdx-1] == pl.mjchi[i])//吃的横牌表示吃的是哪张牌
        {
            var cdui = getNewCard(node, "up", "chi", pl.mjchi[i], off, "heng");
            setCardArrow(cdui, MjClient.MaxPlayerNum - 2, off);
        }
        else
        {
            var cdui = getNewCard(node, "up", "chi", pl.mjchi[i], off);

        }
        if (i % 3 == 2)
            cdui.ischi3 = true;
    }

    //添加手牌
    if(MjClient.rePlayVideo == -1)//表示正常游戏
    {
        if(pl.mjhand && off === 0)
        {
            for(var i = 0; i < pl.mjhand.length; i++)
            {
                getNewCard(node, "stand", "mjhand", pl.mjhand[i], off);
            }
        }
        else if (pl.mjhand && pl.mjState === TableState.roundFinish)
        {
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

}


function InitUserHandUI_hengyangChangSha(node, off)
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
    setAreaTypeInfo(true);
    //setPlayerRoundDir(off);
    // if(vnPos.indexOf(off) == -1)
    // {
    //     vnPos.push(off);
    // }

     if (SelfUid() == pl.info.uid) {
        if (tData.tState == TableState.waitJiazhu) {
            if (pl.mjState == TableState.waitJiazhu) {
                var layer = new jiaZhuCS();
                MjClient.playui.addChild(layer, 99);
                if (MjClient.webViewLayer != null) {
                    MjClient.webViewLayer.close();
                }
            } else {
                //弹窗等待其他玩家加注
                MjClient.playui._jiazhuWait.visible = true;
            }
        }
        else if (!MjClient.playui.haveQiShouHu()) {
            MjClient.playui._jiazhuWait.visible = false;
        }
    }

    if (pl.haiDiLaoState == 2 && SelfUid() == pl.info.uid)
    {
        //弹窗选择是否捞一把
        var layer = new laZhangLayer(function(select) {
            var pl = getUIPlayer(0);
            pl.haiDiLaoState = select ? 1 : 0;
            MjClient.gamenet.request("pkroom.handler.tableMsg", {
                cmd: "MJSelectHaiDiLao",
                haiDiLaoState: pl.haiDiLaoState,
            });
        });
        MjClient.playui.addChild(layer, 99);
        if (MjClient.webViewLayer != null) {
            MjClient.webViewLayer.close();
        }
    }

    if(
        tData.tState != TableState.waitPut &&
        tData.tState != TableState.waitEat &&
        tData.tState != TableState.waitCard
    )
    {
        return;
    }

    showHandCard_hengyangChangSha(node, off);
    // 起手胡层级
    var qshuNode = node.getChildByName("out_qshu_layout");
    // qshuNode.setPositionX(qshuNode.getPositionX() - 50);
    // qshuNode.setPositionY(qshuNode.getPositionY() - 50);
    // qshuNode.setVisible( true );
    qshuNode.setZOrder(1000);

   
    //添加手花
    if (pl.mjflower.length > 0)
    {
        MjClient.majiang.setFlowerImg(node, pl);
        ShowEatActionAnim(node,ActionType.FLOWER,off);
        //playEffect("lyg/nv/flower");
        playEffectInPlay("flower");
    }

    var kaiGangCardLen = 0;
    if (tData.curPlayer == getPlayerIndex(off)) {
        if (tData.lastPutCard2 && tData.lastPutCard2 != -1)
            kaiGangCardLen = 2;
    }

    //添加打出的牌
    for(var i = 0; i < pl.mjput.length - kaiGangCardLen; i++)
    {
        var msg =
            {
                card: pl.mjput[i],
                uid: pl.info.uid
            };

        DealMJPut(node, msg, off, i);
    }
    if (kaiGangCardLen > 0) {
        var msg = {
            card1: tData.lastPutCard,
            card2: kaiGangCardLen > 1 ? tData.lastPutCard2 : -1,
            uid: pl.info.uid
        };
        MjClient.playui.DealKaiGang(node, msg, off);
    }

    MjClient.playui.CardLayoutRestore(node, off);
}

var PlayLayer_hengyangChangSha = cc.Layer.extend({
    jsBind: {
        _event: {
            mjhand: function() {
                if(MjClient.endoneui != null)
                {
                    cc.log("=======mjhand====endoneui====" + typeof (MjClient.endoneui) );
                    MjClient.endoneui.removeFromParent(true);
                    MjClient.endoneui = null;
                }

                this.stopActionByTag(20180626);

                for (var i = 0; i < MjClient.MaxPlayerNum; i ++) {
                    var off = getOffForPlayerNum(i);
                    MjClient.playui.NowRoundScore(getNode(off).getChildByName("head"), off, false);
                }

                var sData = MjClient.data.sData;
                var tData = sData.tData;
                resetFlowerNum(this);
                resetJiaZhuNum(this);
                if (MjClient.rePlayVideo != -1)//回放，做下挻时，否则位置会有问题（岳阳的不会）
                    MjClient.playui.runAction(cc.sequence(cc.delayTime(0.3), cc.callFunc(function() {MjClient.playui.resetJiaZhuTip()})));
                else
                    MjClient.playui.resetJiaZhuTip();
                if (tData.roundNum != tData.roundAll) return;
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
                MjClient.playui.removeChildByName("laZhangLayer");
                MjClient.playui.removeChildByName("jiaZhuCS");

                mylog(JSON.stringify(msg));
                if (msg.showEnd) this.addChild(new GameOverLayer(),500);
                else
                    MjClient.Scene.addChild(new StopRoomView());
            },
            roundEnd: function() {
                MjClient.playui.removeChildByName("laZhangLayer");
                MjClient.playui.removeChildByName("jiaZhuCS");

                var self = this;
                var sData = MjClient.data.sData;
                var tData = sData.tData;
                function showEndCards(){
                    resetEatActionAnim();
                    self.addChild(new EndOneView_hengyangChangSha(),500);
                }

                function addshowcardlayer()
                {
                    MjClient.Scene.addChild(new HAHZ_showCardLayer(showCards,function(){
                        if(showCards.length == 1){
                            self.runAction(cc.sequence(cc.delayTime(0.5),cc.callFunc(showEndCards)));
                        }else{
                            showEndCards();
                        }
                    }));
                }

                var showCards = tData.mopai;
                cc.log("=======showCards=====showCards = "+ JSON.stringify(showCards));
                var showFanPai = ((MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType()) && MjClient.rePlayVideo == -1);
                var action;
                //如果没有
                if(!showCards || cc.isUndefined(showCards) || showCards.length <= 0 || tData.mHaidiPl != -1)
                {
                    //胡牌牌型动画、（一炮多响时则等待所有人胡完）倒牌→0.5S→小结算
                    action = cc.sequence(cc.delayTime(1.2),showFanPai?cc.callFunc(COMMON_UI.showMjhandBeforeEndOne):cc.delayTime(0),cc.delayTime(0.5),cc.callFunc(showEndCards));
                }else if(showCards.length == 1){
                    //胡牌牌型动画、（一炮多响时则等待所有人胡完）倒牌&捉鸟→0.5S→小结算
                    action = cc.sequence(cc.delayTime(1.2),showFanPai?cc.callFunc(COMMON_UI.showMjhandBeforeEndOne):cc.delayTime(0),cc.callFunc(addshowcardlayer));
                }else{
                    //胡牌牌型动画、（一炮多响时则等待所有人胡完）倒牌→0.5S→抓鸟→小结算
                    action = cc.sequence(cc.delayTime(1.2),showFanPai?cc.callFunc(COMMON_UI.showMjhandBeforeEndOne):cc.delayTime(0),cc.delayTime(0.5),cc.callFunc(addshowcardlayer));
                }
                action.setTag(20180626);
                self.runAction(action);
                if(MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP) reConectHeadLayout(this);

            },
            moveHead: function() {
                postEvent("returnPlayerLayer");
                MjClient.playui._jiazhuWait.visible = false;
                tableStartHeadMoveAction(this);
            },
            initSceneData: function() {
                reConectHeadLayout(this);
                cc.log("initSceneData -----------------hengyangChangsha = " + JSON.stringify(this));
                CheckRoomUiDelete();

                this.stopActionByTag(20180626);

                if(MjClient.data.sData.tData.tState <= TableState.waitReady)
                    sendGPS();
            },
            onlinePlayer: function() {
                // reConectHeadLayout(this);
                
                // 邵阳APP 参考其它麻将，在这里清除胡牌文字
                if (MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType())
                    resetEatActionAnim();
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
            }
        },
        roundnumImg: {
            _run:function () {
                //roundnumImgObj = this;
                MjClient.roundnumImgNode = this;
                setWgtLayout(this,[0.1, 0.1], [0.5, 0.5], [-1.2, 1.0]);
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
                    if (tData) return (tData.roundNum - 1);
                },
                _event: {
                    mjhand: function() {
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;
                        if (tData) return this.setString(tData.roundNum - 1);
                    }
                }
            }
        },
        cardNumImg: {
            _run:function () {
                MjClient.cardNumImgNode = this;
                setWgtLayout(this,[0.1, 0.1], [0.5, 0.5], [1.2, 1.0]);
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
                    sendKaiGangCard: function(){
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;
                        if (tData) this.setString(MjClient.majiang.getAllCardsTotal() - tData.cardNext);
                        cc.log(MjClient.majiang.getAllCardsTotal() + "-----------------sendKaiGangCard------------------" + tData.cardNext);
                    },
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
                //     text.setFontName("fonts/fzcy.ttf");
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
            _run: function() {
                if (MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType())
                    setWgtLayout(this, [0.22, 0], [0.5, 0.63], [0, 1.0]);
                else
                    setWgtLayout(this, [0.22, 0], [0.5, 0.6], [0, 1.0]);
            }
        },
        tableid:{
            _layout: [
                [0.15, 0.08],
                [0.101, 0.95],
                [0, 0]
            ],
            _run: function() {
                this.ignoreContentAdaptWithSize(true);
            },
            _event: {
                initSceneData: function() {
                    this.setString(" " + MjClient.data.sData.tData.tableid);
                }
            }
        },
        roundInfo:{
            _layout: [
                [0.0, 0.0972],
                [0.5, 0.38],
                [0, 0.6]
            ],
            _run:function()
            {
                var tData = MjClient.data.sData.tData;
                var str = MjClient.playui.getGameInfoString("roundInfo");
                this.setString(str);
                this.ignoreContentAdaptWithSize(true);
            }
        },
        jiazhuWait: {
            _visible: false,
            _run: function() {
                this.ignoreContentAdaptWithSize(true);
            },
            _layout: [
                [0.2, 0.2],
                [0.5, 0.7],
                [0, 0]
            ]
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
                    text.setFontName("fonts/fzcy.ttf");
                    text.setFontSize(26);
                    
                    text.setAnchorPoint(1,0.5);
                    text.setPosition(66, 15);
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
            setting: {
                _click: function() {
                    var settringLayer = new RoomMaJiangSetting();
                    settringLayer.setName("PlayLayerClick");
                    MjClient.Scene.addChild(settringLayer);
                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_shezhi", {uid:SelfUid(),gameType:MjClient.gameType});
                }
            },
            Button_1: {
                _visible : true,
                _click: function() {
                    MjClient.openWeb({url:MjClient.GAME_TYPE.ShangSha,help:true});
                }
            },
            hunPai:{
                _run:function()
                {
                    this.setVisible(false);
                },
                baidaBg:{
                    small:{
                        _run:function() {
                            this.runAction(cc.sequence(cc.fadeOut(1), cc.fadeIn(0.5)).repeatForever());
                        },
                        _event:{
                            mjhand:function()
                            {
                                this.visible = false;
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
                        this.setVisible(true);
                    },
                    _event: {
                        mjhand:function()
                        {
                            this.visible = true;

                            var HuncardMsg = MjClient.data.sData.tData.hunCard;
                            setCardSprite(this, parseInt(HuncardMsg), 4);
                            this.runAction(cc.sequence(cc.delayTime(1),
                                cc.spawn(cc.scaleTo(0.6,0.5))));
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
                        var isDaihongzhong = MjClient.data.sData.tData.areaSelectMode.daihongzhong;
                        if(isDaihongzhong){
                            this.visible = true;
                        }else{
                            this.visible = false;
                        }
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
                        var isDaihongzhong = MjClient.data.sData.tData.areaSelectMode.daihongzhong;
                        if(isDaihongzhong){
                            this.visible = true;
                        }else{
                            this.visible = false;
                        }
                    },
                    initSceneData:function()
                    {
                        this.visible = true;
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;
                        cc.log(" tData.tState  ------------sking = " + tData.tState );
                        if(tData.tState != TableState.waitPut &&
                            tData.tState != TableState.waitEat &&
                            tData.tState != TableState.waitCard
                        )
                        {
                            this.visible = false;
                        }else{
                            this.visible = true;
                            var isDaihongzhong = MjClient.data.sData.tData.areaSelectMode.daihongzhong;
                            if(!isDaihongzhong){
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
        //             SetArrowRotation(this);
        //             MjClient.playui.refreshHeadLight(true);
        //         },
        //         mjhand: function(eD) {
        //             this.visible = IsArrowVisible();
        //             SetArrowRotation(this);
        //             MjClient.playui.refreshHeadLight(true);
        //         },
        //         onlinePlayer: function(eD) {
        //             //this.visible = IsArrowVisible();
        //         },
        //         waitPut: function(eD) {
        //             SetArrowRotation(this);
        //             MjClient.playui.refreshHeadLight(true);
        //         },
        //         MJPeng: function(eD) {
        //             SetArrowRotation(this);
        //             MjClient.playui.refreshHeadLight(true);
        //         },
        //         MJChi: function(eD) {
        //             SetArrowRotation(this);
        //             MjClient.playui.refreshHeadLight(true);
        //         },
        //         MJGang: function(eD) {
        //             SetArrowRotation(this);
        //             MjClient.playui.refreshHeadLight(true);
        //         },
        //         MJFlower: function(eD) {
        //             SetArrowRotation(this);
        //             MjClient.playui.refreshHeadLight(true);
        //         },
        //         roundEnd: function() {
        //             MjClient.playui.refreshHeadLight(false);
        //         }
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
                    setWgtLayout(this, [0.18, 0.18],[0.4, 0.5],[0, 0]);
                },
                _visible:function()
                {
                    return !MjClient.remoteCfg.guestLogin;
                },
                _click: function() {
                    /*
                     复制房间号-----------------------
                     */
                   getPlayingRoomInfo(1);
                }
            },
            wxinvite: {
                _layout: [
                    [0.2, 0.2],
                    [0.65, 0.2],
                    [0, 0]
                ],
                _click: function() {
                    getPlayingRoomInfo(2);
                },
                _visible:function()
                {
                    return !MjClient.remoteCfg.guestLogin;
                }
            },
            delroom: {
                _run:function(){
                    if(isIPhoneX()) {
                        setWgtLayout(this, [0.11, 0.11],[0.1, 0.52],[0, 0]);
                    }
                    else {
                        setWgtLayout(this, [0.11, 0.11],[0.05, 0.52],[0, 0]);
                    }

                },
                _click: function() {
                    if (IsRoomCreator()) {
                        MjClient.delRoom(true);
                    } else {
                        MjClient.showMsg("确定要退出房间吗？",
                            function() {
                                MjClient.leaveGame();
                            },
                            function() {});
                    }
                },
                _event: {
                    waitReady: function() {
                        this.visible = true;
                    }
                }
            },
            backHomebtn: {
                _run:function(){
                    if (isIPhoneX()) {
                        setWgtLayout(this, [0.11, 0.11],[0.1, 0.65],[0, 0]);
                    }
                    else {
                        setWgtLayout(this, [0.11, 0.11],[0.05, 0.65],[0, 0]);
                    }
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
                    waitReady: function() {
                        this.visible = true;
                    }
                }
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
                    this.getChildByName('getRoomNum').visible = false;//IsInviteVisible();
                    this.getChildByName('wxinvite').visible = IsInviteVisible() && !MjClient.remoteCfg.guestLogin;
                    this.getChildByName('delroom').visible = IsInviteVisible() || isWaitReady;
                    this.getChildByName('backHomebtn').visible = IsInviteVisible() || isWaitReady;
                },
                addPlayer: function(eD) {
                    var isWaitReady = eD.tData.tState == TableState.waitReady;
                    console.log(">>>>>> play add player >>>>");
                    this.getChildByName('getRoomNum').visible = false;//IsInviteVisible();
                    this.getChildByName('wxinvite').visible = IsInviteVisible() && !MjClient.remoteCfg.guestLogin;
                    this.getChildByName('delroom').visible = IsInviteVisible() || isWaitReady;
                    this.getChildByName('backHomebtn').visible = IsInviteVisible() || isWaitReady;
                },
                removePlayer: function(eD) {
                    var isWaitReady = eD.tData.tState == TableState.waitReady;
                    this.getChildByName('getRoomNum').visible = false;
                    this.getChildByName('wxinvite').visible = !MjClient.remoteCfg.guestLogin;
                    this.getChildByName('delroom').visible = IsInviteVisible() || isWaitReady;
                    this.getChildByName('backHomebtn').visible = IsInviteVisible() || isWaitReady;
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
                var putNode = null;
                for(var i = 0; i < children.length; i++)
                {
                    if(children[i].name == "mjhand")
                    {
                        if(children[i].y > standUI.y + 10)
                        {
                            putNode = children[i];
                            break;
                        }
                    }
                }
                
                if (!putNode && MjClient.newCard && cc.sys.isObjectValid(MjClient.newCard) && MjClient.newCard.isNew)
                    putNode = MjClient.newCard;
                
                if (putNode)
                    PutOutCard(putNode, putNode.tag); //可以出牌

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
                    if(IsTurnToMe())
                    {
                        this.visible = true;
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
                    if (_isShowShaiziAni_hengyangChangSha) return;
                    var pl = getUIPlayer(0);
                    var eat = MjClient.playui.jsBind.eat;
                    if (MjClient.rePlayVideo == -1 && IsTurnToMe() && pl.isTing && !eat.hu._node.visible && !eat.gang0._node.visible && !eat.gang1._node.visible && !eat.gang2._node.visible) {
                        cc.log("*********自动出牌*********");
                        this.runAction(cc.sequence(cc.delayTime(0.8), 
                            cc.callFunc(MjClient.playui.jsBind.BtnPutCard._click)));
                    }else{
                        if(MjClient.playui.isCanPutCard())
                        {
                            this.visible = true;
                        }
                    }
                }
            }
        },//end of add by sking
        BtnReady: {
            _visible: false,
            _run: function() {
                setWgtLayout(this,[0.2, 0.2], [0.5, 0.44], [0, 0]);
            },
            _click: function(_this) {
                MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Zhunbei", {uid: SelfUid(), gameType:MjClient.gameType});
                MjClient.MJPass2NetForHengYangChangSha();
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
                        },
                        MJChi: function(eD) {
                            this.visible = false;
                        },
                        MJGang: function(eD) {
                            this.visible = false;
                        },
                        MJPeng: function(eD) {
                            this.visible = false;
                        },
                        MJHu: function(eD) {
                            this.visible = false;
                        },
                        MJPass: function(eD) {
                            this.visible = false;
                        },
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
                    },
                    showTableEvent: function(isShow){ 
                        MjClient.playui.NowRoundScore(this,0,isShow);
                    }
                },
                _run: function () {
                    // this.zIndex = 600;
                    showFangzhuTagIcon(this,0);
                },
                score_bg:{_visible:false},
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
                jiaZhuTip: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        clearCardUI: function(eD) {
                            this.visible = false;
                        }
                    }
                },
                name_bg:{_visible:false},
                flower_layout: {_visible:false},
                flower_zfb_layout : {_visible:false},
                tingCard: { //add by sking
                    _visible:false,
                    // _event: {
                    //     MJTing: function (eD) {
                    //         if(eD.uid == SelfUid())
                    //         {
                    //             var pl = getUIPlayer(0);
                    //             pl.putCardAfterTing = eD.putCardAfterTing;
                    //             MjClient.playui.setTingCardInfo(this,eD,0);
                    //         }
                    //     },
                    //     clearCardUI: function(eD) {
                    //         cc.log("ready to----- clear sking ----");
                    //         this.visible = false;
                    //     },
                    //     MJHu: function(eD) {
                    //         this.visible = false;
                    //     },
                    //     onlinePlayer: function(eD) {
                    //         //MjClient.playui.setTingCardInfo(this,eD,0);
                    //     },
                    //     initSceneData:function(eD)
                    //     {
                    //         MjClient.playui.setTingCardInfo(this,eD,0);
                    //     }
                    // }
                },
                tingIcon: {
                    _visible:false,
                    // _run:function(){
                    //     this.visible = false;
                    //     this.runAction(cc.sequence(cc.spawn(cc.tintTo(0.6, 255,0,0),cc.scaleTo(0.6,this.getScale() + 0.3)),
                    //         cc.spawn(cc.tintTo(0.6, 255,255,255),cc.scaleTo(0.6,this.getScale()))).repeatForever());
                    // },
                    // _event: {
                    //     clearCardUI: function(eD) {
                    //         this.visible = false;
                    //     },
                    //     MJHu: function(eD) {
                    //         this.visible = false;
                    //     },
                    //     moveHead: function() {
                    //         MjClient.playui.tingIconVisible(this, 0);
                    //     },
                    //     onlinePlayer: function(eD) {
                    //         //MjClient.playui.tingIconVisible(this,0);
                    //     },
                    //     initSceneData:function(eD)
                    //     {
                    //         MjClient.playui.tingIconVisible(this,0);
                    //     },
                    //     roundEnd: function(){
                    //         // cc.log("end rounde------------------------");
                    //         this.visible = false;
                    //     }
                    // }
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
                    [0.084, 0.094],
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
                    }
                }
            },
            stand: {
                _layout: [
                    [0.057, 0],
                    [0.5, 0],
                    [8, 0.68]
                ],
                _visible: false,
                _run: function () {
                    // this.zIndex = 500;
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
                        
                        setWgtLayout(this, [0.0, 0.0763], [0.53, 0], [-7, 4.7]);
                    }
                    else
                    {   
                        
                        setWgtLayout(this, [0.0, 0.07], [0.53, 0], [-7, 4.7]);
                    }
                    if (MjClient.MaxPlayerNum == 3)
                        this.x -= this.width * this.scale * 1;
                    else if (MjClient.MaxPlayerNum == 2)
                        this.x -= this.height * this.scale * 5;

                },
                _visible: false
            },
            out0: {
                _run: function () {
                    if (MjClient.size.width / MjClient.size.height >= 1.5)
                    {
                        setWgtLayout(this, [0.0, 0.0763], [0.53, 0], [-7, 3.7]);
                    }
                    else
                    {
                        setWgtLayout(this, [0.0, 0.07], [0.53, 0], [-7, 3.7]);
                    }
                    if (MjClient.MaxPlayerNum == 3)
                        this.x -= this.width * this.scale * 1;
                    else if (MjClient.MaxPlayerNum == 2)
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
                    initSceneData:function(eD)
                    {
                        var pl = getUIPlayer(0);
                        var tData = MjClient.data.sData.tData;
                        if(pl && (tData.tState == TableState.waitPut && MjClient.data.sData.tData.curPlayer != getPlayerIndex(0)) || tData.tState == TableState.waitEat || tData.tState == TableState.waitCard)
                        {
                            var tingSet = MjClient.majiang.calTingSet(pl.mjhand);
                            setTingCards(this, tingSet);
                        }
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
                        this.visible = false;
                    }
                }
            },
            out_qshu_layout:{
                _layout: [[0, 0.1], [0.5, 0.4], [0,0]],
                _visible: false
            },
            _event: {
                clearCardUI: function() {
                    clearCardUI(this, 0);
                },
                initSceneData: function(eD) {
                    SetUserVisible_hengyangChangSha(this, 0);
                },
                addPlayer: function(eD) {
                    SetUserVisible_hengyangChangSha(this, 0);
                },
                removePlayer: function(eD) {
                    SetUserVisible_hengyangChangSha(this, 0);
                },
                mjhand: function(eD) {
					if (showShaiziAni_hengyangChangSha)
                    	showShaiziAni_hengyangChangSha(0);
					else
						InitUserHandUI_hengyangChangSha(this, 0);
                },
                showTableEvent: function(isShow){ 
                    InitUserHandUI_hengyangChangSha(this, 0);
                },
                roundEnd: function() {
                    InitUserCoinAndName(this, 0);
                    //setTaiInfo("");
                },
                newCard: function(eD) {
                    if (_isShowShaiziAni_hengyangChangSha) return;

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
                    if(!eD.isFistCard && (MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType()))
                    {
                        MjClient.playui.CardLayoutRestore(getNode(0), 0, true);
                    }
                    hideTingBtn();
                },
                sendKaiGangCard: function(eD) {
                    MjClient.playui.DealKaiGang(this, eD, 0);
                    var pl = getUIPlayer(0);
                    if (eD.uid == SelfUid())
                    {
                        var _tingCards = this.getChildByName("tingCardsNode");
                        var tingSet = MjClient.majiang.calTingSet(pl.mjhand);
                        setTingCards(_tingCards,tingSet);
                    }
                },
                doQiShouHu: function(eD) {
                    MjClient.playui._jiazhuWait.setVisible(false);
                    MjClient.playui.ShowQiShouHuTip();
                    playQiShouHuAnim(this, eD, 0);
                    // InitUserCoinAndName(this, 0);
                    MjClient.playui.playQiShouHuEffect(eD.qshuName);
                    if(eD.isNoQsHu) {
                        MjClient.playui.EatVisibleCheck();
                    }
                },
                MJPut: function(eD) {
                    cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>MJPut---------------");
                    DealMJPut(this,eD,0);
                    var pl = getUIPlayer(0);
                    if (eD.uid == SelfUid())
                    {
                        var _tingCards = this.getChildByName("tingCardsNode");
                        var tingSet = MjClient.majiang.calTingSet(pl.mjhand);
                        setTingCards(_tingCards,tingSet);
                    }
                    setUserOffline(this, 0);
                },
                MJChi: function(eD) {
                    // DealMJChi(this, eD, 0);
                    updateHeadUI_hengyangChangSha(this, 0 , ActionType.CHI);
                    setUserOffline(this, 0);

                    if (MjClient.data.sData.tData.curPlayer == getPlayerIndex(0))
                        MjClient.playui._tingCardsNode.visible = false;
                },
                MJGang: function(eD) {
                    DealMJGang(this, eD, 0);
                    hideTingBtn();
                    setUserOffline(this, 0);
                },
                MJPeng: function(eD) {
                    // DealMJPeng(this, eD, 0);
                    if (MjClient.rePlayVideo != -1) {
                        DealMJPeng(this, eD, 0);
                    }else {
                        updateHeadUI_hengyangChangSha(this, 0, ActionType.PENG);
                    }
                    setUserOffline(this, 0);
                    MjClient.playui.EatVisibleCheck();
                    if (MjClient.data.sData.tData.curPlayer == getPlayerIndex(0))
                        MjClient.playui._tingCardsNode.visible = false;
                },
                MJHu: function(eD) {
                    HandleMJHu(this, eD, 0);
                    setUserOffline(this, 0);
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
                    //HandleMJTing(this, eD, 0);
                },
                waitJiazhu: function(msg) {
                    postEvent("returnPlayerLayer");
                    //弹窗选择是否飘分
                    var layer = new jiaZhuCS(function(){
                        //弹窗等待
                        MjClient.playui._jiazhuWait.visible = true;
                    });
                    MjClient.playui.addChild(layer, 99);
                    if (MjClient.webViewLayer != null) {
                        MjClient.webViewLayer.close();
                    }
                },
                waitHaiDiLao: function(msg) {
                    if (MjClient.rePlayVideo != -1 && msg.uid != getUIPlayer(0).info.uid)
                        return; 

                    //弹窗选择是否捞一把
                    var layer = new laZhangLayer(function(select) {
                        var pl = getUIPlayer(0);
                        pl.haiDiLaoState = select ? 1 : 0;
                        MjClient.gamenet.request("pkroom.handler.tableMsg", {
                            cmd: "MJSelectHaiDiLao",
                            haiDiLaoState: pl.haiDiLaoState,
                        });
                    });
                    MjClient.playui.addChild(layer, 99);
                    if (MjClient.webViewLayer != null) {
                        MjClient.webViewLayer.close();
                    }
                }
            }
        },
        right: {
            _run: function() {
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
                        },
                        MJChi: function(eD) {
                            this.visible = false;
                        },
                        MJGang: function(eD) {
                            this.visible = false;
                        },
                        MJPeng: function(eD) {
                            this.visible = false;
                        },
                        MJHu: function(eD) {
                            this.visible = false;
                        },
                        MJPass: function(eD) {
                            this.visible = false;
                        },
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
                    },
                    showTableEvent: function(isShow){ 
                        MjClient.playui.NowRoundScore(this,1,isShow);
                    }
                },
                _run: function () {
                    // this.zIndex = 600;
                    showFangzhuTagIcon(this,1);
                },
                score_bg:{_visible:false},
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
                jiaZhuTip: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        clearCardUI: function(eD) {
                            this.visible = false;
                        }
                    }
                },
                name_bg:{_visible:false},
                flower_layout: {_visible:false},
                flower_zfb_layout : {_visible:false},
                tingCard: {
                    _visible:false,
                    // _event: {
                    //     MJTing: function (eD) {
                    //         if(MjClient.playui.isPlayerPutCard(eD,1))
                    //         {
                    //             var pl = getUIPlayer(1);
                    //             pl.putCardAfterTing = eD.putCardAfterTing;
                    //             MjClient.playui.setTingCardInfo(this,eD,1);
                    //         }
                    //     },
                    //     clearCardUI: function(eD) {

                    //         this.visible = false;
                    //     },
                    //     MJHu: function(eD) {
                    //         this.visible = false;
                    //     },
                    //     onlinePlayer: function(eD) {
                    //         //MjClient.playui.setTingCardInfo(this,eD,1);
                    //     },
                    //     initSceneData:function(eD)
                    //     {
                    //         MjClient.playui.setTingCardInfo(this,eD,1);
                    //     }
                    // }
                },
                tingIcon: {
                    _visible:false,
                    // _run:function(){
                    //     this.visible = false;

                    //     this.runAction(cc.sequence(cc.spawn(cc.tintTo(0.6, 255,0,0),cc.scaleTo(0.6,this.getScale() + 0.3)),
                    //         cc.spawn(cc.tintTo(0.6, 255,255,255),cc.scaleTo(0.6,this.getScale()))).repeatForever());
                    // },
                    // _event: {
                    //     clearCardUI: function(eD) {
                    //         this.visible = false;
                    //     },
                    //     MJHu: function(eD) {
                    //         this.visible = false;
                    //     },
                    //     moveHead: function() {
                    //         MjClient.playui.tingIconVisible(this, 1);
                    //     },
                    //     onlinePlayer: function(eD) {
                    //         //MjClient.playui.tingIconVisible(this,1);
                    //     },
                    //     initSceneData:function(eD)
                    //     {
                    //         MjClient.playui.tingIconVisible(this,1);
                    //     },
                    //     roundEnd: function(){
                    //         // cc.log("end rounde------------------------");
                    //         this.visible = false;
                    //     }
                    // }
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
                    [0.084, 0.094],
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
            out_qshu_layout:{
                _layout: [[0, 0.1], [0.8, 0.6], [0,0]],
                _visible: false
            },
            _event: {
                clearCardUI: function() {
                    clearCardUI(this, 1);
                },
                initSceneData: function(eD) {
                    SetUserVisible_hengyangChangSha(this, 1);
                },
                addPlayer: function(eD) {
                    SetUserVisible_hengyangChangSha(this, 1);
                },
                removePlayer: function(eD) {
                    SetUserVisible_hengyangChangSha(this, 1);
                },
                mjhand: function(eD) {
					if (!showShaiziAni_hengyangChangSha)
                    	InitUserHandUI_hengyangChangSha(this, 1);
                },
                showTableEvent: function(isShow){ 
                    InitUserHandUI_hengyangChangSha(this, 1);
                },
                roundEnd: function() {
                    InitUserCoinAndName(this, 1);
                },
                waitPut: function(eD) {
                    if (_isShowShaiziAni_hengyangChangSha) return;
                    DealWaitPut(this, eD, 1);
                },
                sendKaiGangCard: function(eD) {
                    MjClient.playui.DealKaiGang(this, eD, 1);
                },
                doQiShouHu: function(eD) {
                    playQiShouHuAnim(this, eD, 1);
                    // InitUserCoinAndName(this, 1);
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
                    if (MjClient.rePlayVideo != -1)
                        DealMJChi(this, eD, 1);
                    else
                        updateHeadUI_hengyangChangSha(this, 1, ActionType.CHI);
                    setUserOffline(this, 1);
                },
                MJGang: function(eD) {
                    DealMJGang(this, eD, 1);
                    setUserOffline(this, 1);
                },
                MJPeng: function(eD) {
                    if (MjClient.rePlayVideo != -1)
                        DealMJPeng(this, eD, 1);
                    else
                        updateHeadUI_hengyangChangSha(this, 1, ActionType.PENG);
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
                    //HandleMJTing(this, eD, 1);
                }
            }
        },
        top: {
            _run: function() {
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
                        },
                        MJChi: function(eD) {
                            this.visible = false;
                        },
                        MJGang: function(eD) {
                            this.visible = false;
                        },
                        MJPeng: function(eD) {
                            this.visible = false;
                        },
                        MJHu: function(eD) {
                            this.visible = false;
                        },
                        MJPass: function(eD) {
                            this.visible = false;
                        },
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
                    },
                    showTableEvent: function(isShow){ 
                        MjClient.playui.NowRoundScore(this,2,isShow);
                    }
                },
                _run: function () {
                    // this.zIndex = 600;
                    showFangzhuTagIcon(this,2);
                },
                score_bg:{_visible:false},
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
                jiaZhuTip: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        clearCardUI: function(eD) {
                            this.visible = false;
                        }
                    }
                },
                name_bg:{_visible:false},
                flower_layout: {_visible:false},
                flower_zfb_layout : {_visible:false},
                tingCard: {
                    _visible:false,
                    // _event: {
                    //     MJTing: function (eD) {
                    //         if(MjClient.playui.isPlayerPutCard(eD,2))
                    //         {
                    //             var pl = getUIPlayer(2);
                    //             pl.putCardAfterTing = eD.putCardAfterTing;
                    //             MjClient.playui.setTingCardInfo(this,eD,2);
                    //         }
                    //     },
                    //     clearCardUI: function(eD) {
                    //         cc.log("ready to----- clear sking ----");
                    //         this.visible = false;
                    //     },
                    //     moveHead: function(eD) {
                    //         cc.log("top---moveHead ----");
                    //         MjClient.playui.setTingCardInfo(this,eD,2);
                    //     },
                    //     MJHu: function(eD) {
                    //         this.visible = false;
                    //     },
                    //     onlinePlayer: function(eD) {
                    //         cc.log("top---onlinePlayer ----");
                    //         //MjClient.playui.setTingCardInfo(this,eD,2);
                    //     },
                    //     initSceneData:function(eD)
                    //     {
                    //         MjClient.playui.setTingCardInfo(this,eD,2);
                    //     }
                    // }
                },
                tingIcon: {
                    _visible:false,
                    // _run:function(){
                    //     this.visible = false;
                    //     this.runAction(cc.sequence(cc.spawn(cc.tintTo(0.6, 255,0,0),cc.scaleTo(0.6,this.getScale() + 0.3)),
                    //         cc.spawn(cc.tintTo(0.6, 255,255,255),cc.scaleTo(0.6,this.getScale()))).repeatForever());
                    // },
                    // _event: {
                    //     clearCardUI: function(eD) {
                    //         this.visible = false;
                    //         cc.log("tingIcon 22 ----- clearCardUI----");
                    //     },
                    //     MJHu: function(eD) {
                    //         this.visible = false;
                    //     },
                    //     moveHead: function() {
                    //         MjClient.playui.tingIconVisible(this, 2);
                    //     },
                    //     onlinePlayer: function(eD) {
                    //         //MjClient.playui.tingIconVisible(this,2);
                    //     },
                    //     initSceneData:function(eD)
                    //     {
                    //         MjClient.playui.tingIconVisible(this,2);
                    //     },
                    //     roundEnd: function(){
                    //         // cc.log("end rounde------------------------222");
                    //         this.visible = false;
                    //     }
                    // }
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
                    [0.084, 0.094],
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
                        setWgtLayout(this, [0, 0.0763],[0.5, 1],[6.8, -2.5]);
                    }
                    else
                    {
                        setWgtLayout(this, [0, 0.07],[0.5, 1],[6.8, -2.5]);
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
                        setWgtLayout(this, [0, 0.0763],[0.5, 1],[6.8, -3.5]);
                    }
                    else
                    {
                        setWgtLayout(this, [0, 0.07],[0.5, 1],[6.8, -3.5]);
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
            out_qshu_layout:{
                _layout: [[0, 0.1], [0.5, 0.75], [0,0]],
                _visible: false
            },
            _event: {
                clearCardUI: function() {
                    clearCardUI(this, 2);
                },
                initSceneData: function(eD) {
                    SetUserVisible_hengyangChangSha(this, 2);
                },
                addPlayer: function(eD) {
                    SetUserVisible_hengyangChangSha(this, 2);
                },
                removePlayer: function(eD) {
                    SetUserVisible_hengyangChangSha(this, 2);
                },
                mjhand: function(eD) {
					if (!showShaiziAni_hengyangChangSha)
                    	InitUserHandUI_hengyangChangSha(this, 2);
                }, 
                showTableEvent: function(isShow){ 
                    InitUserHandUI_hengyangChangSha(this, 2);
                },
                roundEnd: function() {
                    InitUserCoinAndName(this, 2);

                },
                waitPut: function(eD) {
                    if (_isShowShaiziAni_hengyangChangSha) return;
                    DealWaitPut(this, eD, 2);
                },
                sendKaiGangCard: function(eD) {
                    MjClient.playui.DealKaiGang(this, eD, 2);
                },
                doQiShouHu: function(eD) {
                    playQiShouHuAnim(this, eD, 2);
                    // InitUserCoinAndName(this, 2);
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
                    if (MjClient.rePlayVideo != -1)
                        DealMJChi(this, eD, 2);
                    else
                        updateHeadUI_hengyangChangSha(this, 2, ActionType.CHI);
                    setUserOffline(this, 2);
                },
                MJGang: function(eD) {
                    DealMJGang(this, eD, 2);
                    setUserOffline(this, 2);
                },
                MJPeng: function(eD) {
                    if (MjClient.rePlayVideo != -1)
                        DealMJPeng(this, eD, 2);
                    else
                        updateHeadUI_hengyangChangSha(this, 2, ActionType.PENG);
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
                    //HandleMJTing(this, eD, 2);
                }
            }
        },
        left: {
            _run: function() {
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
                        },
                        MJChi: function(eD) {
                            this.visible = false;
                        },
                        MJGang: function(eD) {
                            this.visible = false;
                        },
                        MJPeng: function(eD) {
                            this.visible = false;
                        },
                        MJHu: function(eD) {
                            this.visible = false;
                        },
                        MJPass: function(eD) {
                            this.visible = false;
                        },
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
                    },
                    showTableEvent: function(isShow){ 
                        MjClient.playui.NowRoundScore(this,3,isShow);
                    }
                },
                _run: function () {
                    // this.zIndex = 600;
                    showFangzhuTagIcon(this,3);
                },
                score_bg:{_visible:false},
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
                jiaZhuTip: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        clearCardUI: function(eD) {
                            this.visible = false;
                        }
                    }
                },
                name_bg:{_visible:false},
                flower_layout: {_visible:false},
                flower_zfb_layout : {_visible:false},
                tingCard: {
                    _visible:false,
                    // _event: {
                    //     MJTing: function (eD) {
                    //         if(MjClient.playui.isPlayerPutCard(eD,3))
                    //         {
                    //             var pl = getUIPlayer(3);
                    //             pl.putCardAfterTing = eD.putCardAfterTing;
                    //             MjClient.playui.setTingCardInfo(this,eD,3);
                    //         }
                    //     },
                    //     clearCardUI: function(eD) {
                    //         cc.log("ready to----- clear sking ----");
                    //         this.visible = false;
                    //     },
                    //     MJHu: function(eD) {
                    //        this.visible = false;
                    //     },
					//     onlinePlayer: function(eD) {
                    //         //MjClient.playui.setTingCardInfo(this,eD,3);
                    //     },	
					//     initSceneData:function(eD)
                    //     {
                    //         MjClient.playui.setTingCardInfo(this,eD,3);
                    //     }
                    // }
                },
                tingIcon: {
                    _visible:false,
                    // _run:function(){
                    //     this.visible = false;
                    //     this.runAction(cc.sequence(cc.spawn(cc.tintTo(0.6, 255,0,0),cc.scaleTo(0.6,this.getScale() + 0.3)),
                    //         cc.spawn(cc.tintTo(0.6, 255,255,255),cc.scaleTo(0.6,this.getScale()))).repeatForever());
                    // },
                    // _event: {
                    //     clearCardUI: function(eD) {
                    //         this.visible = false;
                    //         cc.log("tingIcon 333 ----- clearCardUI ----");
                    //     },
                    //     MJHu: function(eD) {
                    //         this.visible = false;
                    //     },
                    //     moveHead: function() {
                    //         MjClient.playui.tingIconVisible(this, 3);
                    //     },
                    //     onlinePlayer: function(eD) {
                    //         //MjClient.playui.tingIconVisible(this,3);
                    //     },
                    //     initSceneData:function(eD)
                    //     {
                    //         MjClient.playui.tingIconVisible(this,3);
                    //     },
                    //     roundEnd: function(){
                    //         // cc.log("end rounde-----------------------333-");
                    //         this.visible = false;
                    //     }
                    // }
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
                    [0.084, 0.094],
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
                    if (MjClient.MaxPlayerNum == 3)
                        this.y += this.height * this.scale * 2;
                },
               
                _visible: false
            },
            out1: {
                _run: function () {
                    if (MjClient.size.width / MjClient.size.height >= 1.5)
                    {
                        setWgtLayout(this, [0, 0.0545],[0, 0.5],[5.6, 4.8]);
                    }
                    else
                    {
                        setWgtLayout(this, [0, 0.05],[0, 0.5],[5.6, 4.8]);
                    }
                    if (MjClient.MaxPlayerNum == 3)
                        this.y += this.height * this.scale * 2;

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
            out_qshu_layout:{
                _layout: [[0, 0.1], [0.2, 0.6], [0,0]],
                _visible: false
            },
            _event: {
                clearCardUI: function() {
                    clearCardUI(this, 3);
                },
                initSceneData: function(eD) {
                    SetUserVisible_hengyangChangSha(this, 3);
                },
                addPlayer: function(eD) {
                    SetUserVisible_hengyangChangSha(this, 3);
                },
                removePlayer: function(eD) {
                    SetUserVisible_hengyangChangSha(this, 3);
                },
                mjhand: function(eD) {
					if (!showShaiziAni_hengyangChangSha)
                   		InitUserHandUI_hengyangChangSha(this, 3);
                },
                showTableEvent: function(isShow){ 
                    InitUserHandUI_hengyangChangSha(this, 3);
                },
                roundEnd: function() {
                    InitUserCoinAndName(this, 3);
                },
                waitPut: function(eD) {
                    if (_isShowShaiziAni_hengyangChangSha) return;
                    DealWaitPut(this, eD, 3);
                },
                sendKaiGangCard: function(eD) {
                    MjClient.playui.DealKaiGang(this, eD, 3);
                },
                doQiShouHu: function(eD) {
                    playQiShouHuAnim(this, eD, 3);
                    // InitUserCoinAndName(this, 3);
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
                    if (MjClient.rePlayVideo != -1)
                        DealMJChi(this, eD, 3);
                    else
                        updateHeadUI_hengyangChangSha(this, 3, ActionType.CHI);
                    setUserOffline(this, 3);
                },
                MJGang: function(eD) {
                    DealMJGang(this, eD, 3);
                    setUserOffline(this, 3);
                },
                MJPeng: function(eD) {
                    if (MjClient.rePlayVideo != -1)
                        DealMJPeng(this, eD, 3);
                    else
                        updateHeadUI_hengyangChangSha(this, 3, ActionType.PENG);
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
                    //HandleMJTing(this, eD, 3);
                }
            }
        },
        eat: {
            kaiGangKuang: {
                _visible: false,
                _layout: [
                    [0.20, 0.29],
                    [0.5, 0.35],
                    [0, 0.4]
                ],
            },
            eatSelectPanel: {
                _visible: false,
                _layout: [
                    [0, 0.305],
                    [0.5, 0.35],
                    [0, 0]
                ],
            },
            chi0: {
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
                    if (eT == 2) {
                        var func = function() {
                            if (MjClient.chiCards.length >= 1)
                                MJChiCardchange_kaiGang();
                            else
                                MJChiCardchange(btn.tag);
                        }

                        if (MjClient.playui.jsBind.eat.hu._node.visible) {
                            MjClient.showMsg("确认不胡吗?", func, function() {}, "1");
                        } else {
                            func();
                        }
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
                        var tingCards = MjClient.majiang.getCheckTingHuCards(currentCard,pl.mjhand);
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
                    console.log(">>>> lf，点击碰按钮");
                    if (eT == 2)  
                    {
                        var func = function() {
                            if (MjClient.pengCards.length > 1)
                                MJPengCardchange_kaiGang();
    						else if (MjClient.pengCards.length == 1)
                                MjClient.majiang.MJPengToServer(MjClient.pengCards[0]);
                            else
                                MjClient.majiang.MJPengToServer(btn.card);
                        }

                        if (MjClient.playui.jsBind.eat.hu._node.visible) {
                            MjClient.showMsg("确认不胡吗?", func, function() {}, "1");
                        } else {
                            func();
                        }
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
                card1: {},
                _touch: function(btn, eT) {
                    if (eT == 2)
                    {
                        var func = function() {
                            MjClient.playui.isKaiGang = false;   
                            if (btn.cards && btn.cards.length > 0)
                                MjClient.gangCards = btn.cards;
                            MJGangCardchange(btn.tag);
                        }

                        if (MjClient.playui.jsBind.eat.hu._node.visible) {
                            MjClient.showMsg("确认不胡吗?", func, function() {}, "1");
                        } else {
                            func();
                        }
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
                }
            },
            gang1: {
                _visible: false,
                _layout: [
                    [0, 0.1],
                    [0.5, 0],
                    [-1.7, 3.8]
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
                card: {},
                _touch: function(btn, eT) {
                    if (eT == 2) 
                    {
                        var func = function() {
                            MjClient.playui.isKaiGang = true;
                            if (btn.cards && btn.cards.length > 0)
                                MjClient.kaiGangCards = btn.cards;
                            MJGangCardchange(btn.tag);
                        }

                        if (MjClient.playui.jsBind.eat.hu._node.visible) {
                            MjClient.showMsg("确认不胡吗?", func, function() {}, "1");
                        } else {
                            func();
                        }
                    }
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
                        MjClient.MJPass2NetForHengYangChangSha();
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
                    if (eT == 2) 
                    {
                         if (MjClient.huCards.length > 1) {
                            MjClient.majiang.MJHuToServer();
                            //MJHuCardchange_kaiGang();
                        }
                        else if (MjClient.huCards.length == 1) {
                            MjClient.majiang.MJHuToServer(MjClient.huCards[0]);
                        }
                        else {
                            MjClient.majiang.MJHuToServer(btn.card);
                        }
                    }
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
                        this.srcScale = this.getScale();
                        this.srcY = this.y;
                        this.getChildByName("card").visible = false;
                        this.chiTouch = function(btn, et) {
                            if (et == 2) 
                            {
                                if (btn.name.localeCompare("card3") < 0)
                                {
                                    MjClient.majiang.MJChiToServer(0, btn.tag);
                                }
                                else if (btn.name.localeCompare("card6") < 0)
                                {
                                    MjClient.majiang.MJChiToServer(1, btn.tag);
                                }
                                else
                                {
                                    MjClient.majiang.MJChiToServer(2, btn.tag);
                                }
                            }
                        };
                        this.pengTouch = function(btn, et) {
                            if (et == 2)
                            {
                                MjClient.majiang.MJPengToServer(btn.tag);
                            }
                        };
                        this.gangTouch = function(btn, et) {
                            if (et == 2)
                            {
                                MjClient.majiang.MJGangToServer(btn.tag, MjClient.playui.isKaiGang);
                            }
                        };
                        this.huTouch = function(btn, et) {
                            if (et == 2)
                            {
                                MjClient.majiang.MJHuToServer(btn.tag);
                            }
                        };
                    },
                    guobg: {
                        guo: {
                            _touch: function(btn, eT) {
                                if (eT == 2) MjClient.MJPass2NetForHengYangChangSha();
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
            qshu_layout: {
                _visible: false,

                qshu_base:{
                    _visible: false,
                    _layout: [
                        [0, 0.15],
                        [0.62, 0.1],
                        [0, 1.12]
                    ],
                    _touch: function(btn, eT) {
                        cc.log("sdfsdfsdfsdfsdf hahahahah");
                    }
                },

                cancel_qs:{
                    _visible: true,
                    _layout: [
                        [0, 0.16],
                        [0.78, 0.1],
                        [0, 1.12]
                    ],
                    _touch: function(btn, eT) {
                        cc.log("sdfsdfsdfsdfsdf hahahahah");
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
                    if(MjClient.rePlayVideo != -1){
                        var pl = MjClient.data.sData.players[SelfUid()];
                        if(pl && pl.passHu && MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType()){
                            MjClient.showToast("你选择了过，暂时放弃胡牌");
                        }
                    }
                    setSkipHuState();
                    setSkipPengState(); // 开启 过碰 机制
                    MjClient.playui.EatVisibleCheck();
                },
                mjhand: function(eD) {
                    console.log("HHH :，mjhand------");
                    if (!showShaiziAni_hengyangChangSha)
						MjClient.playui.EatVisibleCheck();
                },
                waitPut: function(eD) {
                    if (_isShowShaiziAni_hengyangChangSha) return;
                    console.log("HHH :，waitPut------");
                    MjClient.playui.EatVisibleCheck();
                    MjClient.playui.showTingCardSign();
                },
                sendKaiGangCard: function(eD) {
                    console.log("HHH :sendKaiGangCard------");
                    MjClient.playui.EatVisibleCheck();
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
                showQiShouHu: function(eD){
                    if (_isShowShaiziAni_hengyangChangSha) return;
                    MjClient.playui.ShowQiShouHuTip();
                    MjClient.playui.hideAllEat();
                },
                passQiShouHu: function(eD){
                    cc.log("========passQiShouHu, EatVisibleCheck");
                    MjClient.playui.ShowQiShouHuTip();
                    if(eD.isNoQsHu)
                        MjClient.playui.EatVisibleCheck();
                },
                initSceneData: function(eD) {
                    var delayExe = function()
                    {
                        if( !MjClient.playui.haveQiShouHu() ){
                            MjClient.playui.EatVisibleCheck();
                        }
                        else {
                            MjClient.playui.ShowQiShouHuTip();
                            MjClient.playui.hideAllEat();
                        }
                    }
                    this.runAction(cc.sequence(cc.DelayTime(0.1),cc.callFunc(delayExe)));
                },
                loadOther: function(dr)
                {
                    if(dr.uids != undefined && dr.uids.indexOf(SelfUid()) != -1) 
                    {
                    	MjClient.playui.jsBind.eat.eatSelectPanel._node.visible = false;
                    }
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
                this.visible = MjClient.MaxPlayerNum != 2;
            },
            _click: function() {
                MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Dingwei", {uid: SelfUid()});
                if (MjClient.MaxPlayerNum == 3) {
                    MjClient.Scene.addChild(new showDistance3PlayerLayer());
                } else if (MjClient.MaxPlayerNum == 4) {
                    MjClient.Scene.addChild(new showDistanceLayer());
                }
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
                // if (IsArrowVisible()) this.visible = false;;
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
                initSceneData:function (msg) {
                    var pl = getUIPlayer(0);
                    if(pl.trust){
                        this.visible = true;
                    }else {
                        this.visible = false;
                    }
                },
                roundEnd:function(){
                    this.visible = false;
                }
            }
        }
    },
    _downNode:null,
    _rightNode:null,
    _topNode:null,
    _leftNode:null,
    _btnPutCard:null,
    ctor: function() {
        this._super();

        this.srcMaxPlayerNum = MjClient.MaxPlayerNum;
        MjClient.MaxPlayerNum = parseInt(MjClient.data.sData.tData.maxPlayer);

        if (MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType())
            var playui = ccs.load("Play_258mj.json");
        else
            var playui = ccs.load(res.Play_changSha_json);
        
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

        // 添加光晕动画
        COMMON_UI.addAniEatCardsBtn();
        
        this.addChild(playui.node);

        //添加滚动通知 by sking
        var _laba_bg =  playui.node.getChildByName("banner").getChildByName("laba_bg");
        _laba_bg.visible = false;
        var _scroll =  playui.node.getChildByName("banner").getChildByName("scroll");
        _scroll.visible = false;
        MjClient.playui._jiazhuWait = playui.node.getChildByName("jiazhuWait");
        //var _msg = _scroll.getChildByName("msg");
        //homePageRunText(_msg);
        //function getMsg()
        //{
        //    var content = (MjClient.updateCfg != null && (typeof MjClient.updateCfg) != 'undefined') ? MjClient.updateCfg.homeScroll : "";
        //    return MjClient.isTest ? "" : content;
        //}
        //_msg.setString(getMsg());


        MjClient.lastMJTick = Date.now();
        this.runAction(cc.repeatForever(cc.sequence(cc.callFunc(function() {
            if (MjClient.game_on_show) MjClient.tickGame(0);
        }), cc.delayTime(7))));

        changeMJBg(this, getCurrentMJBgType());
        addClubYaoqingBtn(1);

        initSceneFunc();

        // 俱乐部返回大厅功能：by_jcw
        addClub_BackHallBtn("delroom","down","backHomebtn");
        
        
        return true;
    },
    //拼接游戏玩法及付费信息
    getGameInfoString: function(param)
    {
        var tData = MjClient.data.sData.tData;
        var str = "";

        if (tData.areaSelectMode.zhuaNiaoType == 2) {
            str += "不抓鸟,";  
        }
        else {
            str += tData.areaSelectMode.zhuaNiaoType == 0 ? "中鸟加分," : "中鸟加倍,";
            if (tData.areaSelectMode.zhuaNiaoNum >= 0 && tData.areaSelectMode.zhuaNiaoNum <= 4)
                str += ["1鸟,", "2鸟,", "4鸟,", "6鸟,", "3鸟(自摸),"][tData.areaSelectMode.zhuaNiaoNum];
        }

        if (tData.areaSelectMode.zhuangXianFeng)
            str += "庄闲分,";
        /*
        if (tData.areaSelectMode.buBuGao)
            str += "步步高,";
        if (tData.areaSelectMode.yiZhiHua)
            str += "一枝花,";
        if (tData.areaSelectMode.jinTongYuNv)
            str += "金童玉女,";
        if (tData.areaSelectMode.zhongTuLiuLiuShun)
            str += "中途六六顺,";
        if (tData.areaSelectMode.zhongTuSiXi)
            str += "中途四喜,";
        */
        // if (tData.areaSelectMode.jiaJiangHu)
        //     str += "假将胡,";
        // if (tData.areaSelectMode.xianPiao)
        //     str += "飘分,";
        //if (tData.areaSelectMode.sanTong)
        //    str += "三同,";
        if (tData.areaSelectMode.menQingZiMo)
            str += "门清,";

        if (tData.areaSelectMode.quanQiuRenSifangBaoPei)
            str += "全求人四放包赔,";
        
        if (tData.areaSelectMode.changsha_difen)
            str += "积分底分" + tData.areaSelectMode.changsha_difen + ",";
        
        if (tData.areaSelectMode.fanBei == 1 && tData.areaSelectMode.fanBeiScore > 0) {
            str += "小于" + tData.areaSelectMode.fanBeiScore + "分翻倍";
        }else{
            str += "不翻倍,";
        }
        if (str.charAt(str.length - 1) == ",")
            str = str.substring(0, str.length - 1);
        return str;
    },
    onExit:function()
    {
        this._super();
        MjClient.MaxPlayerNum = this.srcMaxPlayerNum;
    },

    refreshHeadLight:function(visible)
    {
        for (var i = 0; i < 4; i ++)
        {
            var node = getNode(i);
            if (!node)
                continue;

            var light = node.getChildByName("head").getChildByName("light");
            var index = getPlayerIndex(i);
            light.setVisible(visible && MjClient.data.sData.tData.curPlayer == index);
        }
    },

    resetJiaZhuTip: function()
    {
        var tData = MjClient.data.sData.tData;
        if (!tData.areaSelectMode.xianPiao)
            return;
        var nodes = [this._downNode, this._rightNode, this._topNode, this._leftNode];
        for (var i = 0; i < MjClient.MaxPlayerNum; i ++)
        {
            var pl = getUIPlayer(getOffForPlayerNum(i));
            if (!pl) 
                return;

            cc.log("resetJiaZhuTip jiazhuNum = " + pl.jiazhuNum);
            var node = nodes[getOffForPlayerNum(i)];
            var tipNode = node.getChildByName("head").getChildByName("jiaZhuTip");
            var playTipNode = node.getChildByName("play_tips");
            var point = playTipNode.convertToWorldSpace(playTipNode.getChildByName("hu").getPosition());
            tipNode.setPosition(tipNode.parent.convertToNodeSpace(point));
            tipNode.visible = true;
            tipNode.opacity = 255;
            tipNode.ignoreContentAdaptWithSize(true);
            tipNode.setString(pl.jiazhuNum > 0 ? "飘分" : "不飘分");
            tipNode.runAction(cc.sequence(cc.delayTime(1), cc.fadeOut(0.5), cc.callFunc(function(){ this.visible = false;}, tipNode)));
        }
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
                        var tingSet = MjClient.majiang.calTingSet(pl.mjhand);
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
    isPlayerPutCard: function(eD, off) {
        var tData = MjClient.data.sData.tData;
        var uids = tData.uids;
        var idx = uids.indexOf(eD.uid);
        var selfidx = uids.indexOf(SelfUid());
        var offidx = (idx - selfidx + MjClient.MaxPlayerNum) % MjClient.MaxPlayerNum;

        if (offidx == off) {
            return true;
        } else {
            return false;
        }
    }
    
});

// 显示当前局数增加的分数
PlayLayer_hengyangChangSha.prototype.NowRoundScore = function(node,off,isShow) { 
    var pl = getUIPlayer(off);
    if(!pl)return; 
    var score = null;
    if(node.getChildByName("roundScore")){
        score = node.getChildByName("roundScore"); 
    }else{
        score = new ccui.Text();
        score.setFontName("fonts/fzcy.ttf");
        score.setColor(cc.color.WHITE);
        score.setName("roundScore");
        score.setFontSize(30);
        node.addChild(score,100); 
        var sumScore = node.getChildByName("score_bg");
        if(MjClient.MaxPlayerNum == 2){
            var nobody = node.getChildByName("nobody");
            if(off == 0){
                score.setPosition(cc.p(sumScore.x ,sumScore.y - (sumScore.height + 10))); 
            }else{
                score.setPosition(cc.p(nobody.x + (nobody.width * 0.8),nobody.y)); 
            }
        }else{  
            
            if(off == 0 || off == 2){
                score.setPosition(cc.p(sumScore.x + (sumScore.width *0.8),sumScore.y)); 
            }else{
                score.setPosition(cc.p(sumScore.x,sumScore.y - 40));  
            }  

        } 
    }    
    score.setVisible(isShow);
    score.setColor(cc.color(114,255,0));
    if(pl.winone >= 0 ){
        score.setColor(cc.color(255,192,0));
    }
    score.setString( (pl.winone > 0 ?"+":"") + pl.winone );  
}


PlayLayer_hengyangChangSha.prototype.CardLayoutRestore = function(node, off, isNewCard)
{
    // node 是克隆新建的一个麻将节点 by sking

    var newC = null; //先创建麻将的UI节点
    var newVal = 0; //新牌的值，是几万，几筒，几条....为数字
    var pl = getUIPlayer(off);//获取玩家信息.off 为0 ，就是自己得信息，能看到自己摸牌 by sking
    if (!pl) {
        cc.log("CardLayoutRestore error:", "off=" + off + " playerIndex=" + getPlayerIndex(off) + 
            " uids=" + JSON.stringify(MjClient.data.sData.tData.uids) + 
            " players=" + JSON.stringify(MjClient.data.sData.players));
    }

    cc.log("=========================CardLayoutRestore off = " + off);
        
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
            //uistand.push(ci);
            if(MjClient.data.sData.tData.hunCard == ci.tag)
            {
                uihun.push(ci);
            }
            else
            {
                uistand.push(ci);
            }

            if(MjClient.data.sData.tData.hunCard == ci.tag)
            {
                ci.setColor(cc.color(255,255,63));
            }
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
                                if(isYongZhouProject())
                                {
                                    ci.x = orders[i - 1].x + upSize.width * upS * 1.2//1.08;
                                }
                                else {
                                    ci.x = orders[i - 1].x + upSize.width * upS * 1.26//1.08;
                                }
                                
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
                        if (isGray || pl.haiDiLaoState == 1) ci.y += 20;//听牌情况下，发的新牌才默认提起

                        if(MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP || MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ) {
                            MjClient.newCard = newC;
                            MjClient.newCard.isNew = true;

                            if (isNewCard && !isGray && pl.haiDiLaoState != 1) {
                                COMMON_UI.newCardShakAni_yueYang(ci, off);
                            }
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

    if(MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP || MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ) {
        //其他家新摸的牌动作
        if (isNewCard && off != 0) {
            if (COMMON_UI3D.is3DUI() && off == 1) {
                COMMON_UI.newCardShakAni_yueYang(orders[1], off);
            } else {
                COMMON_UI.newCardShakAni_yueYang(orders[0], off);
            }
        }
    }

    if(COMMON_UI3D.is3DUI()){
        COMMON_UI3D.set3DCardSprite(off);
    }
    else {
        //刷新手牌大小
        resetCardSize();
    }

    COMMON_UI.willHuShowArrow();
};


PlayLayer_hengyangChangSha.prototype.showTingCardSign = function(){
    if(!IsTurnToMe()) return;
    var tingPutCards = null;
    var node = getNode(0);
    var children = node.children;
    for(var i = 0; i < children.length; i++) //children 为 "down" 节点下的子节点
    {
        var ci = children[i];
        if(ci.name == "mjhand")
        {
            if (tingPutCards == null) {
                tingPutCards = MjClient.majiang.getTingPutCards(getUIPlayer(0).mjhand);
            }

            //258麻将添加打哪张牌可以听的标志
            if (tingPutCards.indexOf(ci.tag) != -1){
                ci.removeChildByName("ting_tips");
                var image = new ccui.ImageView("playing/other/sign_1.png");
                image.setPosition(ci.width/2, ci.height + 10);
                image.setName("ting_tips");
                ci.addChild(image);
            }else {
                ci.removeChildByName("ting_tips");
            }
        }
    }
}



// 提示等待起手胡
PlayLayer_hengyangChangSha.prototype.ShowQiShouHuTip = function()
{
    var eat = MjClient.playui.jsBind.eat;
    var sData = MjClient.data.sData;
    var pl = sData.players[SelfUid()];

    var waitOtherQsHu = false;
    for(var uid in sData.players){
        var p = sData.players[uid];
        if(p != pl && p.qiShouHu && Object.keys(p.qiShouHu).length >0){
            if(!p.qiShouHu['zhongtull'] || !p.qiShouHu['zhongtusx']) {
                waitOtherQsHu = true;
                break;
            }
        }
    }

    if (!MjClient.playui._jiazhuWait.srcText)
        MjClient.playui._jiazhuWait.srcText = MjClient.playui._jiazhuWait.getString();

    if (waitOtherQsHu)
        MjClient.playui._jiazhuWait.setString("各玩家亮出起手胡");
    else
        MjClient.playui._jiazhuWait.setString(MjClient.playui._jiazhuWait.srcText);

    MjClient.playui._jiazhuWait.setVisible(waitOtherQsHu);
}

// 现实起手胡按钮
// 返回true显示成功   false不需要显示起手胡按钮
PlayLayer_hengyangChangSha.prototype.haveQiShouHu = function()
{
    var sData = MjClient.data.sData;
    for (var uid in sData.players) {
        var p = sData.players[uid];
        if (p.qiShouHu && Object.keys(p.qiShouHu).length > 0) {
            return true;
        }
    }
    return false;
}


PlayLayer_hengyangChangSha.prototype.EatKaiGangVisibleCheck = function(tData, vnode, eat, pl) 
{
    var isKaiGangAfterSelfAnGang = tData.uids[tData.curPlayer] == pl.info.uid;
    for (var i = 0; i < 2; i++) {
        var eatFlag = i == 0 ? pl.eatFlag : pl.eatFlag2;
        var lastPutCard = i == 0 ? tData.lastPutCard : tData.lastPutCard2;

        if (eatFlag & 8) {
            if (vnode.indexOf(eat.hu._node) == -1)
            {
                vnode.push(eat.hu._node);
                eat.hu._node.level = 8;
            }

            if (MjClient.huCards.indexOf(lastPutCard) == -1)
                MjClient.huCards.push(lastPutCard);
        }

        if ((eatFlag & 4) && MjClient.majiang.canKaiGang(pl.mjhand, lastPutCard, false, pl.mjpeng, isKaiGangAfterSelfAnGang)) {
            if (vnode.indexOf(eat.gang1._node) == -1)
            {
                vnode.push(eat.gang1._node);
                eat.gang1._node.level = 6;
            }

            if (eat.gang1._node.cards.indexOf(lastPutCard) == -1)
                eat.gang1._node.cards.push(lastPutCard);
        }

        if (eatFlag & 4) {
            if (vnode.indexOf(eat.gang0._node) == -1)
            {
                vnode.push(eat.gang0._node);
                eat.gang0._node.level = 4;
            }

            if (eat.gang0._node.cards.indexOf(lastPutCard) == -1)
                eat.gang0._node.cards.push(lastPutCard);
        }

        if (eatFlag & 2) {
            if (vnode.indexOf(eat.peng._node) == -1)
            {
                vnode.push(eat.peng._node);
                eat.peng._node.level = 2;
            }

            if (MjClient.chiCards.indexOf(lastPutCard) == -1)
                MjClient.pengCards.push(lastPutCard);
        }

        if (eatFlag & 1) {
            var eatpos = MjClient.majiang.canChi(pl.mjhand, lastPutCard, tData.hunCard);
            if (eatpos.length > 0) {
                if (vnode.indexOf(eat.chi0._node) == -1) {
                    vnode.push(eat.chi0._node);
                    eat.chi0._node.level = 1;
                }

                if (MjClient.chiCards.indexOf(lastPutCard) == -1) {
                    MjClient.eatpos.push(eatpos);
                    MjClient.chiCards.push(lastPutCard);
                }
            }
        }
    }
    vnode.sort(function(a, b) {
        return a.level < b.level;
    });

    if (vnode.length > 0) {
        if (!(pl.isTing && isKaiGangAfterSelfAnGang && vnode.indexOf(eat.hu._node) >= 0))  // 开杠后可以自摸则不显示【过】
            vnode.push(eat.guo._node);
        eat.ting._node.visible = false;
        eat.noTing._node.visible = false;
        isCheckedTing = false;
    } else {
        getUIPlayer(0).mjState = TableState.waitCard;
    }

    return vnode;
}


PlayLayer_hengyangChangSha.prototype.showKaiGangBigCards = function() {
    var tData = MjClient.data.sData.tData;
    cc.log("showKaiGangBigCards: tData.lastPutCard=" + tData.lastPutCard + " tData.lastPutCard2=" + tData.lastPutCard2);

    if (tData.lastPutCard == -1 && tData.lastPutCard2 == -1)
        return;

    var all_0 = true;
    for (var i = 0; i < MjClient.MaxPlayerNum; i ++)
    {
        var pl = getUIPlayer(getOffForPlayerNum(i));
        if (!pl) 
            continue;

        if (pl.eatFlag > 0 || pl.eatFlag2 > 0)
        {
            all_0 = false;
            break;
        }
    }

    if (all_0)
        return;

    var kaiGangKuang = MjClient.playui.jsBind.eat.kaiGangKuang._node;
    kaiGangKuang.setVisible(true);
    var cardNode1 = kaiGangKuang.getChildByName("card1");
    var cardNode2 = kaiGangKuang.getChildByName("card2");
    cardNode1.setVisible(tData.lastPutCard != -1);
    cardNode2.setVisible(tData.lastPutCard2 != -1);
    if (tData.lastPutCard != -1)
        setCardSprite(cardNode1, tData.lastPutCard, 0);
    if (tData.lastPutCard2 != -1)
        setCardSprite(cardNode2, tData.lastPutCard2, 0);
}

PlayLayer_hengyangChangSha.prototype.hideAllEat = function(){
    var eat = MjClient.playui.jsBind.eat;
    MjClient.playui.jsBind.eat.changeui.changeuibg._node.visible = false;
    eat.changeui.changeuibg._node.setScale(eat.changeui.changeuibg._node.srcScale);
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
    eat.qshu_layout._node.visible = false;
    eat.eatSelectPanel._node.visible = false;
    eat.kaiGangKuang._node.visible = false;

    eat.chi0._node.setTouchEnabled(true);
    eat.chi1._node.setTouchEnabled(true);
    eat.chi2._node.setTouchEnabled(true);
    eat.peng._node.setTouchEnabled(true);
    eat.gang0._node.setTouchEnabled(true);
    eat.gang1._node.setTouchEnabled(true);
    eat.gang2._node.setTouchEnabled(true);
    eat.hu._node.setTouchEnabled(true);
    eat.guo._node.setTouchEnabled(true);
    eat.changeui.changeuibg._node.setTouchEnabled(true);
}

// 判断吃碰杠胡的状态
PlayLayer_hengyangChangSha.prototype.EatVisibleCheck = function()
{


    var eat = MjClient.playui.jsBind.eat;
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var leftCard = MjClient.majiang.getAllCardsTotal() - tData.cardNext;

    this.hideAllEat();


    var pl = sData.players[SelfUid() + ""];
    MjClient.huCards = [];
    MjClient.gangCards = [];
    MjClient.kaiGangCards = [];
    MjClient.pengCards = [];
    MjClient.chiCards = [];
    MjClient.eatpos = [];
    eat.gang0._node.cards = [];
    eat.gang1._node.cards = [];

    var mj = MjClient.majiang;

     cc.log("EatVisibleCheck: pl=" + JSON.stringify(pl));
	 cc.log("tData.tState = " + tData.tState + " tData.lastPutCard2=" + tData.lastPutCard2);
     cc.log("tData=" + JSON.stringify(tData));

    if ((tData.tState == TableState.waitEat || tData.tState == TableState.waitCard) && tData.lastPutCard2)    //开杠
    {
        MjClient.playui.showKaiGangBigCards();
    }

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

    if (tData.tState == TableState.waitEat && tData.lastPutCard2)    //开杠
    {
        vnode = this.EatKaiGangVisibleCheck(tData, vnode, eat, pl);
    }
    //自摸
    else if(tData.tState == TableState.waitPut && pl.mjState == TableState.waitPut)
    {
        if(IsTurnToMe())
        {
            //胡
            if (pl.isNew && pl.eatFlag & 8) {
                vnode.push(eat.hu._node);
            }

            //杠 吃碰之后可以马上补/开杠
            var rtn = MjClient.majiang.canGang1(pl.mjpeng, pl.mjhand, pl.isTing);
            cc.log("$$$$杠牌监测"+JSON.stringify(rtn));
            if(rtn.length > 0)
            {
                for (var i = 0; i < rtn.length; i ++)
                {
                    if (MjClient.majiang.canKaiGang(pl.mjhand, rtn[i], true, pl.mjpeng, false))
                    {
                        MjClient.kaiGangCards.push(rtn[i]);
                        if (vnode.indexOf(eat.gang1._node) == -1) {
                            vnode.push(eat.gang1._node);
                        }
                    }
                }

                MjClient.gangCards = rtn;
                vnode.push(eat.gang0._node);
            }
            if(vnode.length > 0)
            {
                if (!(pl.isTing && vnode.indexOf(eat.hu._node) >= 0))  // 开杠后可以自摸则不显示【过】
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
                if (MjClient.majiang.canKaiGang(pl.mjhand, tData.lastPutCard, false, null, false)) {
                    vnode.push(eat.gang1._node)
                    MjClient.kaiGangCards = [tData.lastPutCard];
                }

                vnode.push(eat.gang0._node);

                MjClient.gangCards = [tData.lastPutCard];
                eat.gang0._node.visible = true;
                setCardSprite(eat.gang0.card1._node, MjClient.gangCards[0], 0);
            }
            if (pl.eatFlag & 2) {
                vnode.push(eat.peng._node);
            }

            if(pl.eatFlag & 1)
            {
                var eatpos = mj.canChi(pl.mjhand, tData.lastPutCard,tData.hunCard);
                MjClient.eatpos = eatpos;
                if (eatpos.length > 0)
                {
                    vnode.push(eat.chi0._node);
                }

                cc.log("tData.putType MjClient.eatpos = " + MjClient.eatpos);
            }

            //如果，有杠，碰，吃。 这出现过的UI. 否则玩家状态为等待
            if(vnode.length > 0)
            {
                vnode.push(eat.guo._node);
                eat.ting._node.visible = false;
                eat.noTing._node.visible = false;
                isCheckedTing = false;
            }
            else
            {
                getUIPlayer(0).mjState = TableState.waitCard;
            }
        }
    }

    if (pl.haiDiLaoState == 1 || MjClient.majiang.getAllCardsTotal() - tData.cardNext <= 0)
    {

        if (vnode.indexOf(eat.hu._node) != -1)
        {
            vnode = [eat.hu._node];
            eat.hu._node.stopActionByTag(1);
            eat.hu._node.runAction(cc.sequence(cc.delayTime(0.8), cc.callFunc(MJHuToServer))).tag = 1;
        }
        else if (pl.haiDiLaoState == 1)
        {
            vnode = [];
            eat._node.stopActionByTag(1);
            eat._node.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(MjClient.playui.jsBind.BtnPutCard._click))).tag = 1;
        }
    }

    //吃碰杠胡过处理
    if(vnode.length > 0)
    {
        // var btnImgs =
        // {
        //     "peng": ["playing/gameTable/youxizhong-2_57.png", "playing/gameTable/youxizhong-2_07.png"],
        //     "gang0": ["playing/gameTable/youxizhong-2_55.png", "playing/gameTable/youxizhong-2_05.png"],
        //     "chi0": ["playing/gameTable/youxizhong-2_59.png", "playing/gameTable/youxizhong-2_09.png"],
        // }

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
            // if(btnName == "peng" || btnName == "chi0" || btnName == "gang0")
            // {
            //     vnode[i].loadTextureNormal(btnImgs[btnName][0]);
            //     vnode[i].loadTexturePressed(btnImgs[btnName][1]);
            // }

            if(i == 0)
            {
                var cardVal = 0;
                if(vnode[i].getChildByName("bgimg"))
                {
                    vnode[i].getChildByName("bgimg").visible = false;
                }

                // if(btnName == "peng" || btnName == "chi0" || btnName == "gang0")
                // {
                //     vnode[i].loadTextureNormal(btnImgs[btnName][0]);
                //     vnode[i].loadTexturePressed(btnImgs[btnName][1]);
                // }

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

            setWgtLayout(vnode[i], [0, 0.18], [0.70, 0], [(i - vnode.length + 1) * 1.0, 1.8], false, false);
        }
    }

    /* 吃碰杠胡等按钮的 iOS适配 */
    COMMON_UI.vnodeAdaptForiOS(vnode);

    if(eat.hu._node.visible)
    {
        MjClient.playui._btnPutCard.visible = false;
    }
}

PlayLayer_hengyangChangSha.prototype.RemoveNewCardOut = function(node, card)
{
    cc.log("--长沙麻将--RemoveNewCardOut：card=" + card);
    /*
    var children = node.children;
    for (var i = 0; i <= children.length - 1; i ++)
    {
        var ci = children[i];
        if (ci.name == "newout" && ci.tag == card)
        {
            ci.removeFromParent(true);
            cc.log("ci.removeFromParent(true)");
            break;
        }
    }*/
}

PlayLayer_hengyangChangSha.prototype.DealKaiGang = function(node, msg, off)
{
    cc.log("======DealKaiGang======= " + off);
    //cardPutted = false;
    var sData = MjClient.data.sData;
    var tData = sData.tData;

    var uids = tData.uids;
    var selfIndex = getPlayerIndex(off);
    if(uids[selfIndex] != msg.uid)
        return;


    var pl = sData.players[msg.uid];
    var outActionList = [];

    var cards = [];
    for (var i = 1; i <= 2; i ++) {
        if (msg["card" + i] != -1)
            cards.push(msg["card" + i]);
    }

    //3D模式下的特殊UI by sking 2018.9.27
    if(COMMON_UI3D.is3DUI())
    {
        var all_0 = true;
        for (var i = 0; i < MjClient.MaxPlayerNum; i ++)
        {
            var pl = getUIPlayer(getOffForPlayerNum(i));
            if (!pl) 
                continue;

            if (pl.eatFlag > 0 || pl.eatFlag2 > 0)
            {

                all_0 = false;
                break;
            }
        }

        function showCard(removeCard) {
            if (removeCard) {
                var index = cards.indexOf(removeCard);
                if (index >= 0)
                    cards.splice(index, 1);
            }

            var sData = MjClient.data.sData;
            var tData = sData.tData;
            var pl = sData.players[msg.uid];
            for (var ii = 0; ii < cards.length; ii++) {
                var msg1 = {
                    card: cards[ii],
                    uid: msg.uid
                };
                COMMON_UI3D.DealMJPut_3D(node, msg1, off, pl.mjput.length - cards.length + ii, true);
            }
        }

        if (all_0) {
           showCard();
        }
        else {
            var outActionBind = {
                _event: {
                    waitPut: function() {
                        sprite.removeFromParent();
                        showCard();
                    },
                    MJChi: function(msg) {
                        sprite.removeFromParent();
                        showCard(msg.mjchiCard[msg.mjchiCard.length - 1]);
                    },
                    MJPeng: function(msg) {
                        sprite.removeFromParent();
                        var peng = msg.cpginfo.pengchigang.peng;
                        showCard(peng[peng.length - 1].card);
                    },
                    MJGang: function(msg) {
                        sprite.removeFromParent();
                        showCard(msg.card);
                    },
                    roundEnd: function() {
                        sprite.removeFromParent();
                        showCard();
                    }
                }
            }
            var sprite = new cc.Sprite();
            node.addChild(sprite);
            BindUiAndLogic(sprite, outActionBind);
        }

        return;
    }

    for (var ii = 0; ii < cards.length; ii ++)
    {
        var card = cards[ii];
        var putnum = pl.mjput.length - cards.length + ii;
        
        var out0 = node.getChildByName("out0");
        var out1 = node.getChildByName("out1");
        var out2 = node.getChildByName("out2");

        var maxNum = 11;
        if (MjClient.MaxPlayerNum == 2)
            maxNum = 20;
        else if (MjClient.MaxPlayerNum == 3 && off != 0)
            maxNum = 13;

        var out;
        
        if (putnum >= maxNum*2 && out2)
        {
            out = out2.clone();
        }
        else if(putnum >= maxNum)
        {
            out = out1.clone();
        }
        else
        {
            out = out0.clone();
        }
        out.setScale(out.getScale()*1.3);
        var oSize = out.getSize();
        var oSc = out.scale;

        if (off == 0 && putnum >= maxNum * 2 && out2)
        {
            node.addChild(out);
        }
        else if (off == 0 && putnum >= maxNum)
        {
            node.addChild(out, 1);
        }
        else if(off == 1 || off == 0)
        {
            node.addChild(out, 200 - putnum);
        }
        else if(off == 2 || off == 3)
        {
            node.addChild(out, putnum);
        }
        else
        {
            node.addChild(out);
        }

        if (ii == 0)
        {
            for(var i = 0; i < node.children.length; i++)
            {
                if(node.children[i].name == "newout")
                {
                    node.children[i].name = "out";
                }
            }
        }

        out.visible = true;
        out.name = "out";
        setCardSprite(out, card, off);
        var endPoint = cc.p(0, 0);
        var ws = cc.director.getWinSize();
        if (putnum > maxNum*2 - 1 && out2)
        {
            out.x = out2.x;
            out.y = out2.y;
            putnum -= maxNum*2;
        }
        else if (putnum > maxNum - 1)
        {
            out.x = out1.x;
            out.y = out1.y;
            putnum -= maxNum;
        }

        if(off == 0)
        {
            endPoint.y = out.y;
            endPoint.x = out.x + oSize.width * oSc * putnum*0.91;
        }
        else if (off == 1)
        {
            cc.log("DealMJPut remove card  = " + card);
            endPoint.y = out.y + oSize.height * oSc * putnum * 0.7;
            endPoint.x = out.x;
            out.zIndex = 100 - putnum;
        }
        else if(off == 2)
        {
            endPoint.x = out.x - oSize.width * oSc * putnum*0.91;
            endPoint.y = out.y;
        }
        else if (off == 3)
        {
            endPoint.y = out.y - oSize.height * oSc * putnum * 0.7;
            endPoint.x = out.x;
            out.zIndex = putnum;
        }

        var zoder = out.zIndex;
        out.visible = false;
        out.x = endPoint.x;
        out.y = endPoint.y;
        out.scale = oSc;
        out.name = "newout";

        if(ii == 0 ) clearCurrentPutTag();
        var outAction = out.clone();
        outAction.name = "newout";
        outAction.visible = true;
        node.addChild(outAction);
        setCardSprite(outAction, card, off);
        outAction.scale = oSc;
        outAction.zIndex = zoder;
        outAction.setPosition(endPoint);
        
        addCurrentPutTag(outAction, off);

        outAction.out = out;
        outActionList[ii] = outAction;
    }

    function RemovePutCard(visibleOut, card)
    {
        MjClient.lastCardposNode = null;//抢杠胡没有牌 可以劈

        var a = false;
        for (var i = 0; i <= outActionList.length - 1; i ++)
        {
            var isSame = outActionList[i].tag == card;
            if ((visibleOut != null && visibleOut) || (visibleOut == null && (a || !isSame)))
            {
                outActionList[i].out.visible = true;
                //outActionList[i].out.zIndex = outActionList[i].zIndex;
            }
            else
            {
                for (var j = outActionList.length - 1; j > i; j --)
                {
                    outActionList[j].setPosition(outActionList[j - 1].getPosition());
                    outActionList[j].out.setPosition(outActionList[j - 1].out.getPosition());
                    outActionList[j].zIndex = outActionList[j - 1].zIndex;
                    outActionList[j].out.zIndex = outActionList[j - 1].out.zIndex;
                }
                outActionList[i].out.removeFromParent();
                clearCurrentPutTag();

                a = true;
            }

            outActionList[i].removeFromParent();
			if (i != outActionList.length - 1) {
				outActionList.splice(i, 1);
                i --;
            }
        }
    }

    var outActionBind =
    {
        _event:
            {
                waitPut: function()
                {
                    RemovePutCard(true, -1);
                },
                MJChi: function(msg)
                {
                    RemovePutCard(null, msg.mjchiCard[msg.mjchiCard.length - 1]);
                },
                MJPeng: function(msg)
                {
                    var peng = msg.cpginfo.pengchigang.peng;
                    RemovePutCard(null, peng[peng.length - 1].card);
                },
                MJGang: function(msg)
                {
                    RemovePutCard(null, msg.card);
                },
                roundEnd: function()
                {
                     RemovePutCard(false, -1);
                },
                MJFlower: function () {
                    RemovePutCard(true, -1);
                }
            }
    }

    if (outActionList.length > 0)
    {
        BindUiAndLogic(outActionList[0], outActionBind);
        MjClient.playui.CardLayoutRestore(node, off);
    }
}

PlayLayer_hengyangChangSha.prototype.playQiShouHuEffect = function(qshuName) {
    var soundName = null;
    if (qshuName == "zhongtull" || qshuName == "liuliushun") // 中途六六顺 六六顺
        soundName = "liuliushun";
    else if (qshuName == "zhongtusx" || qshuName == "sixi") // 中途四喜 四喜
        soundName = "dasixi";
    else if (qshuName == "banbanhu") // 将将胡 板板胡
        soundName = "banbanhu";
    else if (qshuName == "queyise") // 缺一色
        soundName = "queyise";

    if (soundName)
        playEffectInPlay(soundName, false);
}

PlayLayer_hengyangChangSha.prototype.playHuEffect = function(winType, huWords) {
    huWords = huWords || [];

    var soundList = [];
    if (huWords.indexOf("gangshanghua") >= 0)
        soundList.push("gangshanghua");

    if (huWords.indexOf("gangshangpao") >= 0)
        soundList.push("gangshangpao");

    if (huWords.indexOf("haidilaoyue") >= 0 || huWords.indexOf("haidipao") >= 0)
        soundList.push("haidilao");

    if (huWords.indexOf("haohuaqidui") >= 0 || huWords.indexOf("shuanghaohuaqidui") >= 0)
        soundList.push("haohuaqidui");

    if (huWords.indexOf("jiangjianghu") >= 0)
        soundList.push("jiangjianghu");

    if (huWords.indexOf("pengpenghu") >= 0)
        soundList.push("pengpenghu");

    if (huWords.indexOf("qiangganghu") >= 0)
        soundList.push("qiangganghu");

    if (huWords.indexOf("qidui") >= 0)
        soundList.push("qidui");

    if (huWords.indexOf("qingyise") >= 0)
        soundList.push("qingyise");

    if (huWords.indexOf("quanqiuren") >= 0)
        soundList.push("quanqiuren");

    if (soundList.length == 0) {
        if (huWords.indexOf("qiangbuhu") >= 0)
            soundList.push("hu");
        else if (winType == 3)
            soundList.push("zimo");
        else
            soundList.push("fangpao");
    }

    var replay = function(list) {
        if (list.length == 0)
            return;

        playEffectInPlay(list[0], false);
        MjClient.playui.runAction(
            cc.sequence(
                cc.delayTime(1.0),
                cc.callFunc(
                    function() {
                        list.shift();
                        replay(list, 0);
                    })
            ));
    }

    replay(soundList);
}

function MJChiCardchange_kaiGang() {
    cc.log("MJChiCardchange_kaiGang: MjClient.chiCards=" + MjClient.chiCards + " MjClient.eatpos=" + MjClient.eatpos);

    var eat = MjClient.playui.jsBind.eat;
    var changeuibg = eat.changeui.changeuibg;
    var cardTemplet = changeuibg._node.getChildByName("card");
    var children = changeuibg._node.getChildren().slice();
    for (var i = 0, len = children.length; i < len; i++) {
        if (children[i] != cardTemplet && children[i].getName().indexOf("card") != -1)
            children[i].removeFromParent();
    }

    if (MjClient.eatpos.length == 1 && MjClient.eatpos[0].length == 1)
    {
        MjClient.majiang.MJChiToServer(MjClient.eatpos[0][0], MjClient.chiCards[0]);
        return;
    }

    eat.chi0._node.visible = false;
    eat.chi1._node.visible = false;
    eat.chi2._node.visible = false;
    eat.peng._node.visible = false;
    eat.gang0._node.visible = false;
    eat.gang1._node.visible = false;
    eat.gang2._node.visible = false;
    eat.hu._node.visible = false;
    eat.guo._node.visible = false;
    changeuibg._node.visible = true;

    var tData = MjClient.data.sData.tData;

    var card = [];
    var width = (cardTemplet.width - 7) * cardTemplet.scaleX;
    var startX = changeuibg._node.width / 2 - width;
    var y = cardTemplet.y;
    cc.log("MjClient.eatpos=" + MjClient.eatpos);
    for (var k = 0; k < MjClient.eatpos.length; k++) {
        for (var i = 0; i < MjClient.eatpos[k].length; i++) {
            for (var j = 0; j < 3; j++) {
                card[j] = cardTemplet.clone();
                setCardSprite(card[j], MjClient.chiCards[k] - MjClient.eatpos[k][i] + j, 0);
                card[j].setTag(MjClient.chiCards[k]);
                if (MjClient.eatpos[k][i] == j)
                    card[j].color = cc.color(255, 255, 0);

                card[j].visible = true;
                card[j].setName("card" + (MjClient.eatpos[k][i] * 3 + j));
                card[j].setPosition(startX + j * width, y);

                changeuibg._node.addChild(card[j]);

                card[j].addTouchEventListener(changeuibg._node.chiTouch, card[j]);
            }
            y += cardTemplet.height * cardTemplet.scaleY;

            ShowChiCards(changeuibg._node, MjClient.eatpos[k][i], card[0], card[1], card[2]);
        }
    }

    if (card[0])
        changeuibg._node.height = card[0].y + card[0].height * card[0].scaleY * card[0].anchorY + 8.0;

    if (MjClient.eatpos.length == 2 && MjClient.eatpos[0].length + MjClient.eatpos[1].length >= 6)
    {
        changeuibg._node.setScale(changeuibg._node.srcScale*0.9);
    }
}

function MJPengCardchange_kaiGang() {
    cc.log("MJPengCardchange_kaiGang: MjClient.pengCards=" + MjClient.pengCards);

    var eat = MjClient.playui.jsBind.eat;
    var changeuibg = eat.changeui.changeuibg;
    var cardTemplet = changeuibg._node.getChildByName("card");
    var children = changeuibg._node.getChildren().slice();
    for (var i = 0, len = children.length; i < len; i++) {
        if (children[i] != cardTemplet && children[i].getName().indexOf("card") != -1)
            children[i].removeFromParent();
    }

    eat.chi0._node.visible = false;
    eat.chi1._node.visible = false;
    eat.chi2._node.visible = false;
    eat.peng._node.visible = false;
    eat.gang0._node.visible = false;
    eat.gang1._node.visible = false;
    eat.gang2._node.visible = false;
    eat.hu._node.visible = false;
    eat.guo._node.visible = false;
    changeuibg._node.visible = true;

    var tData = MjClient.data.sData.tData;

    var card = [];
    var width = (cardTemplet.width - 7) * cardTemplet.scaleX;
    var startX = changeuibg._node.width / 2 - width;
    var y = cardTemplet.y;
    for (var i = 0; i < MjClient.pengCards.length; i++) {
        for (var j = 0; j < 3; j++) {
            card[j] = cardTemplet.clone();
            setCardSprite(card[j], MjClient.pengCards[i], 0);
            card[j].setTag(MjClient.pengCards[i]);
            card[j].visible = true;
            card[j].setPosition(startX + j * width, y);

            changeuibg._node.addChild(card[j]);

            card[j].addTouchEventListener(changeuibg._node.pengTouch, card[j]);
        }
        y += cardTemplet.height * cardTemplet.scaleY;
    }

    if (card[0])
        changeuibg._node.height = card[0].y + card[0].height * card[0].scaleY * card[0].anchorY + 8.0;
}

function MJHuCardchange_kaiGang() {
    cc.log("MJHuCardchange_kaiGang: MjClient.huCards=" + MjClient.huCards);

    var eat = MjClient.playui.jsBind.eat;
    var changeuibg = eat.changeui.changeuibg;
    var cardTemplet = changeuibg._node.getChildByName("card");
    var children = changeuibg._node.getChildren().slice();
    for (var i = 0, len = children.length; i < len; i++) {
        if (children[i] != cardTemplet && children[i].getName().indexOf("card") != -1)
            children[i].removeFromParent();
    }

    eat.chi0._node.visible = false;
    eat.chi1._node.visible = false;
    eat.chi2._node.visible = false;
    eat.peng._node.visible = false;
    eat.gang0._node.visible = false;
    eat.gang1._node.visible = false;
    eat.gang2._node.visible = false;
    eat.hu._node.visible = false;
    eat.guo._node.visible = false;
    changeuibg._node.visible = true;

    var tData = MjClient.data.sData.tData;

    var card = [];
    var startX = changeuibg._node.width / 2;
    var y = cardTemplet.y;
    cc.log("MjClient.eatpos=" + MjClient.eatpos);
    for (var i = 0; i < MjClient.huCards.length; i++) {
        card[i] = cardTemplet.clone();
        setCardSprite(card[i], MjClient.huCards[i], 0);
        card[i].setTag(MjClient.huCards[i]);
        card[i].visible = true;
        card[i].setPosition(startX, y);

        changeuibg._node.addChild(card[i]);

        card[i].addTouchEventListener(changeuibg._node.huTouch, card[i]);
        y += cardTemplet.height * cardTemplet.scaleY;
    }

    if (card[1])
        changeuibg._node.height = card[1].y + card[1].height * card[1].scaleY * card[1].anchorY + 8.0;
}
