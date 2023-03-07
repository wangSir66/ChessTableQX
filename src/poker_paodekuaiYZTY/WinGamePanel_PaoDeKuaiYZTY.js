
//永州，邵阳，湘乡，耒阳，衡阳的跑得快公用
function SetEndOneUserUI_PaoDeKuaiYZTY(node, off) {
    var sData = MjClient.data.sData;
    var tData = sData.tData;

    var selfindex = getPlayerIndex(0);
    off = MjClient.data.sData.tData.fieldId? (selfindex + off ): off;//金币场要求头像，第一个是自己，然后按出牌顺序排列
    off = off % 3;//MjClient.MaxPlayerNum;

    var pl = MjClient.getPlayerByIndex(off);
    node.setVisible(false);
    if (!pl) {
        // 二人玩时，显示剩余的底牌
        if(tData.otherCards) {
            node.setVisible(true);
            for(var i in node.children) {
                var child = node.children[i];
                child.setVisible(false);
            }

            //添加手牌
            var stand_other = node.getChildByName("stand_other");
            if(MjClient.getAppType() === MjClient.APP_TYPE.QXYZQP || MjClient.getAppType() === MjClient.APP_TYPE.BDYZPHZ || 
                MjClient.getAppType() === MjClient.APP_TYPE.QXLYQP || MjClient.getAppType() === MjClient.APP_TYPE.BDHYZP){
                node.getChildByName("head_bg").setVisible(false);
            }else{
                node.getChildByName("head_bg").setVisible(true);
            }
            node.getChildByName("stand_other_desc").setVisible(true);
            node.getChildByName("stand_other_desc").ignoreContentAdaptWithSize(true);
            stand_other.setVisible(false)

            var stand = stand_other//head.getChildByName("stand");
            var offX = stand.x;
            var upSize = stand.getSize();
            var upS = stand.scale;

            var otrCards = MjClient.majiang.sortHandCards(tData.otherCards, 0);
            for (var i = 0; i < otrCards.length; i++) {
                var card = getNewCard_card(node, "stand_other", "mjhand", otrCards[i], 0);
                card.visible = true;
                card.enabled = false;
                card.setScale(0.5);
                if (i != 0) {
                    offX += upSize.width * upS * 0.4;//调牌的距离的
                    card.x = offX;//调牌的距离的
                }else {
                    card.x = offX /*+ upSize.width * upS * 0.1*/;
                }

            }

        }
        return;
    }
    if (MjClient.getAppType() != MjClient.APP_TYPE.BDHYZP &&
        MjClient.getAppType() != MjClient.APP_TYPE.QXXXGHZ)
        setUserOfflineWinGamePanel(node,pl);//不知道为什么，衡阳在下面代码的addWxHeadToEndUI里会实现相关功能，所以屏蔽
    node.setVisible(true);
    node = node.getChildByName("head");

    // var zhuangNode = node.getChildByName("zhuang");
    // var tempZhuang = (typeof MjClient.preZhuang != 'undefined') ? MjClient.preZhuang : tData.zhuang;
    // zhuangNode.setVisible(tData.uids[tempZhuang] == pl.info.uid);
    // zhuangNode.zIndex=10;

    //add by sking
    var name = node.getChildByName("name");
    name.ignoreContentAdaptWithSize(true);

    

    var uibind = {
        head_bg: {
            _run:function()
            {
                this.ignoreContentAdaptWithSize(true);
            },
        },
        head: {
            name: {
                _run:function()
                {
                    this.ignoreContentAdaptWithSize(true);
                    this.setFontName("Arial");
                    this.setFontSize(this.getFontSize());
                },
                _text: function () {
                    var _nameStr = unescape(pl.info.nickname ) + "";
                    //this.ignoreContentAdaptWithSize(true);
                    return getNewName(_nameStr);
                }
            },
            id: {
                _run:function()
                {
                    this.ignoreContentAdaptWithSize(true);
                },
                _text: function () {
                    return "ID:" + pl.info.uid.toString();
                }
            },
            stand: {
                _visible: false,
                _run: function () {
                    if( (!pl.mjhandRecord) || (!pl.mjhandRecord.length) || (!pl.mjhand) ){
                        return;
                    }
        
                    var arry = [];
                    if (pl.mjhandRecord)
                    {
                        //添加手牌
                        for (var i = 0; i < pl.mjhandRecord.length; i++) {
                            var card = getNewCard_card(node, "stand", "mjhand", pl.mjhandRecord[i], 0);
                            arry.push(card);
                            // 如果是打出去的牌， 显示遮罩
                            if( pl.mjhand.indexOf(pl.mjhandRecord[i]) < 0) {
                                card.isGray = true;
                                card.setColor(MjClient.grayColor);
                            }
                        }
                    }

                    for (var i = 0; i < arry.length; i++) {
                        arry[i].visible = true;
                        arry[i].enabled = false;
                        arry[i].setScale(arry[i].getScale() * 0.75);
                    }
                    CardLayoutRestoreForEndOne_ty(node, pl);
                }
            }
        }, 
        winNum: {
            _text: function () {
                var pre = "";
                if (pl.winone > 0) pre = "+";
                return pre + pl.winone;
            }
        },
        cardNum : {
            _visible: false,
            _run: function() {
                this.ignoreContentAdaptWithSize(true);
                if( pl.mjhand.length > 0)
                    this.visible = true;
            },
            _text: function() {
                return '剩' + pl.mjhand.length + '张';
            }
        }
        , desc: {
            _visible: false,
            _run: function () {
                this.ignoreContentAdaptWithSize(true);
                console.log('desc desc pl.zhaDanCount', pl.uid, pl.zhaDanCount, tData.ht10Player)
                var iszhaniao = ((tData.areaSelectMode.hongTao10Niao || tData.areaSelectMode.zhaniao > 1) && tData.ht10Player == tData.uids.indexOf(pl.info.uid)) || 
                    (tData.areaSelectMode.zhaniao == 1 && tData.ht9Player == tData.uids.indexOf(pl.info.uid));
                if(pl.zhaDanCount > 0 || iszhaniao)
                    this.visible = true;
                if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ){
                    if(pl.mjdesc.length > 0) {
                        this.visible = true;
                    }
                }
            },
            _text: function () {
                var str = '';
                if(pl.zhaDanCount > 0){
                    str += '炸弹:' + pl.zhaDanCount;
                }
                var iszhaniao = ((tData.areaSelectMode.hongTao10Niao || tData.areaSelectMode.zhaniao > 1) && tData.ht10Player == tData.uids.indexOf(pl.info.uid)) || 
                    (tData.areaSelectMode.zhaniao == 1 && tData.ht9Player == tData.uids.indexOf(pl.info.uid));
                if(iszhaniao){
                    if(str.length > 0)  str += '\n';
                    str += '扎鸟';
                }
                console.log('desc desc _text pl.zhaDanCount', pl.zhaDanCount, tData.ht10Player)

                if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ){
                    str = "";

                    for(var i in pl.mjdesc) {
                        var istr = pl.mjdesc[i];
                        if( istr.length > 16 ) istr = '申请解散';
                        if(str.length > 0)  str += '\n';
                        str += istr;
                    }
                }
            
                return str;
            },  
        }
        , desc0: {
            _visible: false,
            _run: function () {
                this.ignoreContentAdaptWithSize(true);
                if(pl.mjdesc0.length > 0)    this.visible = true;
                this.visible = (MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ || MjClient.getAppType() == MjClient.APP_TYPE.QXLYQP);
            },
            _text: function () {
                var str = '';

                for(var i in pl.mjdesc0) {
                    var istr = pl.mjdesc0[i];
                    if(str.length > 0)  str += ',';
                    str += istr;
                }
                return str;
            },
        }
        , desc1: {
            _visible: false,
            _run: function () {
                this.ignoreContentAdaptWithSize(true);
                if(pl.mjdesc1.length > 0)    this.visible = true;
                this.visible = !(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ);
            },
            _text: function () {
                var str = '';

                for(var i in pl.mjdesc1) {
                    var istr = pl.mjdesc1[i];
                    if(str.length > 0)  str += '\n';
                    str += istr;
                }
                return str;
            },  
        }
        , desc2: {
            _visible: false,
            _run: function () {
                this.ignoreContentAdaptWithSize(true);
                if(pl.mjdesc2.length > 0)    this.visible = true;
                this.visible = !(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ);
            },
            _text: function () {
                var str = '';

                for(var i in pl.mjdesc2) {
                    var istr = pl.mjdesc2[i];
                    if(str.length > 0)  str += '\n';
                    str += istr;
                }
                return str;
            },  
        }
        , winNum1:{
            _visible: false,
            _run: function () {
            this.ignoreContentAdaptWithSize(true);
            if(pl.mjdescScore.length > 0 && Number(pl.mjdescScore) >= 0)
            {
                this.visible = true;
                this.setString(Math.abs(Number(pl.mjdescScore)) + "");
                this.visible = (MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ);
            }
            
            },
        }
        , winNum2:{
        _visible: false,
            _run: function () {
            this.ignoreContentAdaptWithSize(true);
            if(pl.mjdescScore.length > 0 && Number(pl.mjdescScore) < 0)
            {
                this.visible = true;
                this.setString(Math.abs(Number(pl.mjdescScore)) + "");
                this.visible = (MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ);
            }
            
        },
    }
        , zhadanfanbei: {
            _run: function() {
                if (!tData.areaSelectMode.isZhaDanFanBei || !pl.zhaDanCount || pl.zhaDanCount <= 0 || pl.winone <= 0)
                {
                    this.visible = false;
                    return;
                }

                // "炸弹 x XX 倍"
                var sprites = [];
                sprites[0] = new cc.Sprite("gameOver/zhadan_cheng.png");
                var beishu = 1 << pl.zhaDanCount;
                for (var i = 1; beishu > 0; i ++)
                {
                    var num = beishu % 10; 
                    beishu = Math.floor(beishu / 10);
                    sprites[i] = new cc.Sprite("gameOver/zhadan_" + num + ".png");
                }

                var width = 80 / sprites.length;
                for (var i = 0, len = sprites.length; i < len; i ++)
                {
                    sprites[i].y = this.height/2;
                    if (i == 0)
                        sprites[i].x = 65 + width/2;
                    else
                        sprites[i].x = 65 + (len - i) * width + width/2;

                    if (width < sprites[i].width)
                        sprites[i].scale = width/sprites[i].width;

                    this.addChild(sprites[i]);
                }
            }   
        }
    }
    BindUiAndLogic(node.parent, uibind);
    if (MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ || MjClient.getAppType() == MjClient.APP_TYPE.QXLYQP) {
        // 背景切换
        for(var i in pl.mjdesc2) {
            var str = pl.mjdesc2[i];
            var s_num = 0;
            if (str.indexOf("总分") != -1 ) {
                s_num = str.slice(str.indexOf(":") + 1);
                cc.log("jiangcw: s_num = " + s_num);
            }
            if (Number(s_num) > 0) {
                uibind.head_bg._node.loadTexture("gameOver/di_red.png");
            }
        }
        // 头像圆形裁剪
        var pl = MjClient.getPlayerByIndex(off);
        CircularCuttingHeadImg(uibind.head._node, pl);
    }
    else {
        addWxHeadToEndUI(uibind.head._node, off);
    }

    if(MjClient.getAppType() === MjClient.APP_TYPE.QXXXGHZ){
        var pl = MjClient.getPlayerByIndex(off);
        setRoundEndUserOffline_xiangxiang(uibind.head._node,pl);
    }
    //uibind.winNum._node.y=uibind.head._node.y;
}

function CardLayoutRestoreForEndOne_PaoDeKuaiYZTY(node, plNode) {
    var layoutType = false;//默认排序
    var newVal = 0; //新牌的值，是几万，几筒，几条....为数字
    var pl; //player 信息

    pl = plNode;//获取玩家信息.off 为0 ，就是自己得信息，能看到自己摸牌 by sking
    var children = node.children;
    var tempMaJiang = MjClient.majiang; //麻将的各种方法判断，是否可以杠，是否可以吃... by sking

    //up stand 是2种麻将的图。
    var up = node.getChildByName("up");
    var stand = node.getChildByName("stand");
    var start;
    start = stand;
    var upSize = start.getSize();
    var upS = start.scale;
    //mjhand standPri out chi peng gang0 gang1
    var uipeng = [];
    var uigang0 = [];
    var uigang1 = [];
    var uichi = [];
    var uistand = [];
    var uihun = [];//癞子牌在最左边
    // var sData = MjClient.data.sData;
    // var tData = sData.tData;
    for (var i = 0; i < children.length; i++) //children 为 "down" 节点下的字节点
    {
        var ci = children[i];
        if (ci.name == "mjhand") {
            if (MjClient.data.sData.tData.hunCard == ci.tag) {
                uihun.push(ci);
            }
            else {
                uistand.push(ci);
            }

            if (MjClient.data.sData.tData.hunCard == ci.tag) {
                //ci.setColor(cc.color(255,255,63));
            }

            var _smallFlower = ci.getChildByName("cardType").getChildByName("smallFlower");
            if (_smallFlower) {
                _smallFlower.setPosition(22, 35)
            }

        }
        else if (ci.name == "standPri") {
            uistand.push(ci);
        }
        else if (ci.name == "mjhand_replay") {
            uistand.push(ci);
            var _smallFlower = ci.getChildByName("cardType").getChildByName("smallFlower");
            if (_smallFlower) {
                _smallFlower.setPosition(22, 35)
            }
        }
    }

    /*
     排序方式
     */
    var rankType = 1;//0 从小到大排序 ，1 按照算法排序
    var pro_rankType = false;
    if (!layoutType) {
        pro_rankType = false;
    }
    else {
        pro_rankType = true;
    }

    if (rankType == 0) {
        uistand.sort(TagOrder);
    }
    else {
        if (pl.mjhand.length > 0) {
            var mjhandPai = tempMaJiang.sortHandCards(pl.mjhand, pro_rankType);
            var cardCount = 0;
            var tempuistand = uistand.slice();
            cc.log(pro_rankType + "=========  mjhandPai = " + JSON.stringify(mjhandPai));
            var myUiStand = []; //重新排序后
            for (var j = 0; j < mjhandPai.length; j++) {
                for (var i = 0; i < tempuistand.length; i++) {
                    var tag = tempuistand[i].tag;
                    if (tag == mjhandPai[j]) {
                        myUiStand.push(tempuistand[i]);
                        var index = tempuistand.indexOf(tempuistand[i]);
                        tempuistand.splice(index, 1);
                        cardCount++;
                    }
                }
            }
            uistand = myUiStand;
        }
    }


    if (uihun.length > 0) //是否有柰子，有则放在最前面 by sking
    {
        for (var i = 0; i < uihun.length; i++) {
            uistand.unshift(uihun[i]); //向数组开头添加一个元素 unshift
        }
    }

    var uiOrder = [uigang1, uigang0, uipeng, uichi, uistand];

    var orders = []; //重新排序后装到数组里 by sking
    for (var j = 0; j < uiOrder.length; j++) {
        var uis = uiOrder[j];
        for (var i = 0; i < uis.length; i++) {
            orders.push(uis[i]);
        }
    }

    //设置麻将位置
    for (var i = 0; i < orders.length; i++) {
        var ci = orders[i];
        if (i != 0) {
            if (ci.name == orders[i - 1].name) {
                if (ci.name == "mjhand") {
                    ci.x = orders[i - 1].x + upSize.width * upS * 0.4;//调牌的距离的
                }
            }
        }
        else {
            ci.x = start.x + upSize.width * upS * 0.1;
        }

        ci.zIndex = i;
    }
};


var EndOneView_PaoDeKuaiYZTY = cc.Layer.extend({
    jsBind: {
        block: {
            _layout: [[1, 1], [0.5, 0.5], [0, 0], true]
        },
        back: {
            _run: function () {
                if (MjClient.getAppType() == MjClient.APP_TYPE.QXYZQP && isIPhoneX()) {
                    // 永州跑得快超框处理
                    setWgtLayout(this, [0.8, 0.8], [0.5, 0.5], [0, 0]);
                } else {
                    setWgtLayout(this, [1, 1], [0.5, 0.5], [0, 0]);
                }
            },
            wintitle:
    		{
    		    _visible: function () {
    		        var pl = getUIPlayer(0);
    		        if (pl) {
    		            //playEffect("win");
    		            return pl.winone >= 1;
    		        }
    		        return false;
    		    }
    		}, losetitle:
    		{
    		    _visible: function () {
    		        var pl = getUIPlayer(0);
    		        if (pl) {
    		            //playEffect("lose");
    		            return pl.winone < 0;
    		        }
    		        return false;
    		    }
    		}, pingju:
    		{
    		    _visible: function () {

    		        var pl = getUIPlayer(0);

    		        if (pl) {
    		            //playEffect("lose");
    		            return pl.winone == 0;
    		        }
    		        return false;
    		    }, _run: function () {
    		        var sData = MjClient.data.sData;
    		        var tData = sData.tData;
                    if(MjClient.getAppType() == MjClient.APP_TYPE.QXYZQP || MjClient.getAppType() == MjClient.APP_TYPE.BDYZPHZ)
                    {
                        this.ignoreContentAdaptWithSize(true);
                    }
    		        if (MjClient.isDismiss) {
    		            this.loadTexture("gameOver/jiesan.png");
    		        }
    		    }
    		},
            share: {
                _click:function(btn,eT){
                    MjClient.shareMultiPlatform(MjClient.systemConfig.sharePlatforms, function()
                    {
                        postEvent("capture_screen");
                        MjClient.endoneui.capture_screen = true;
                        btn.setTouchEnabled(false);
                        // btn.setBright(false);
                    });
                },
                _visible: function () {
                    return !MjClient.remoteCfg.guestLogin;
                },
                _event:{
                    captureScreen_OK:function(){
                        if (MjClient.endoneui.capture_screen != true)
                            return;
                        MjClient.endoneui.capture_screen = false;
                        var writePath = jsb.fileUtils.getWritablePath();
                        var textrueName = "wxcapture_screen.png";
                        var savepath = writePath+textrueName;
                        MjClient.shareImageToSelectedPlatform(savepath);
                        this.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(function()
                        {
                            this.setTouchEnabled(true);
                            // this.setBright(true);
                        }.bind(this))));
                    }
                }
            },
            xiPai: {
                _run: function () {
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;

                    // 非回放状态、自动切牌、牌局没有结束  洗牌按钮可见
                    this.visible = MjClient.gameType == MjClient.GAME_TYPE.YZ_PAO_DE_KUAI_TY && (MjClient.rePlayVideo == -1 && tData.areaSelectMode.isPlayerShuffle == 0 && sData.tData.roundNum > 0 && !tData.matchId);

                    if (!this.visible) {
                        return;
                    }

                    if (tData.areaSelectMode.fangkaCount > 0) {
                        // 元宝场
                        this.getChildByName("icon").loadTexture("gameOver/newOver/ico_zuanshi.png");
                        this.getChildByName("numTxt").setString("x" + 1);
                    }
                },
                _click: function(btn,eT){ 
                    MjClient.gamenet.request("pkroom.handler.tableMsg", {
                        cmd: "MJShuffle"
                    },function(data) {
                        if (data && data.code == -1)
                        {
                            MjClient.showToast(data.message);
                            return;
                        }

                        postEvent("clearCardUI");
                        MjClient.endoneui.removeFromParent(true);
                        MjClient.endoneui = null;

                        PKPassConfirmToServer_card();

                        if (MjClient.arrowbkNode && cc.sys.isObjectValid( MjClient.arrowbkNode )) {
                            MjClient.arrowbkNode.setVisible(false);
                        }
                    });
                } 
            },
            ready: {
                _run: function () {
                    if (MjClient.remoteCfg.guestLogin) {
                        setWgtLayout(this, [0.15, 0.15], [0.5, 0.085], [0, 0], false, true);
                    }
                },
                _click: function (btn, eT) {
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;

                    if(!tData.fieldId){
                        postEvent("clearCardUI");
                        MjClient.endoneui.removeFromParent(true);
                        MjClient.endoneui = null;
                    }

                    if (MjClient.rePlayVideo >= 0 && MjClient.replayui && !MjClient.endallui) {
                        MjClient.replayui.replayEnd();
                    }
                    else {
                        if (tData.fieldId){
                            leaveGameClearUI();
                            MjClient.Scene.addChild(new goldMatchingLayer({matching:false}));
                            MjClient.goldfieldEnter(tData.fieldId,tData.gameType);
                            return;
                        }else{
                            PKPassConfirmToServer_card();
                        }
                    }
                    if (MjClient.arrowbkNode && cc.sys.isObjectValid( MjClient.arrowbkNode )) {
                        MjClient.arrowbkNode.setVisible(false);
                    }
                    if (MjClient.endallui && sys.isObjectValid(MjClient.endallui))
                    {
                        MjClient.endallui.setVisible(true);
                    }
                    else
                        MjClient.endallui = null;

                    //reInitarrCardVisible();
                }
            },
            close:{
                _visible: function () {
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    if(tData.fieldId){
                        return true;
                    }
                    return false;
                },
                _click: function (btn, eT) {
                    leaveGameClearUI();
                }
            },
            delText:
            {
                _visible: function () {
                    return MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ;
                },
                _run: function() {
                    if (MjClient.getAppType() != MjClient.APP_TYPE.HUNANWANGWANG && MjClient.getAppType() != MjClient.APP_TYPE.QXSYDTZ)this.setString("");
                    this.setFontName("Arial");
                    this.setFontSize(this.getFontSize());
                    if (MjClient.isDismiss) {
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;
                        var id = tData.firstDel;
                        var pl = sData.players[id];
                        var delStr = "";
                        if (pl) {
                            var name = unescape(pl.info.nickname );
                            delStr = name + pl.mjdesc[0];
                        } else { // 会长或管理员解散房间时 pl 会为 null
                            pl = getUIPlayer(0);
                            if (pl)
                                delStr = tData.dissolveWay == -1? '系统停服自动解散房间':'会长或管理员解散房间';//pl.mjdesc[0];
                        }
                        this.setString(delStr);
                    } else {
                        this.setString("");
                    }
                }
            },
            dir:
            {
                _visible: true,
                _run:function()
                {   
                    if(MjClient.getAppType() != MjClient.APP_TYPE.HUNANWANGWANG && MjClient.getAppType() != MjClient.APP_TYPE.QXSYDTZ && 
                        MjClient.getAppType() != MjClient.APP_TYPE.QXLYQP){
                        this.ignoreContentAdaptWithSize(true);
                    }
                },
                _text: function () {

                     var tData = MjClient.data.sData.tData;

                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    var text = "";
                    //text += "跑得快,";
                    //text += MjClient.MaxPlayerNum == 3 ? "三人玩," : "两人玩,";
                    text += tData.areaSelectMode.cardNumIndex == 0 ? "16张," : "15张,";
                    text += tData.areaSelectMode.mustPut ? "" : "非必管,";
                    text += tData.areaSelectMode.zhaDanBuChai ? "炸弹不可拆," : "";
                    text += tData.areaSelectMode.isAutoTip ? "自动提示," : "";
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

                    if (tData.areaSelectMode.jiaFen > 0)
                    {
                        firstOutRuleStr = "加" + tData.areaSelectMode.jiaFen + "分,";
                    }
                    // text += tData.areaSelectMode.firstHeiTao3 ? "首局先出黑桃三," : "";
                    text += firstOutRuleStr;
                    // text += tData.areaSelectMode.can4dai2 ? "四带二," : "";
                    // text += tData.areaSelectMode.can4dai3 ? "四带三," : "";
                    text += tData.areaSelectMode.hongTao10Niao ? "红桃10扎鸟," : "";

                    if (tData.areaSelectMode.zhaniao) {
                        if (tData.areaSelectMode.zhaniao == 1)
                            text += "红桃9翻倍,";
                        else if (tData.areaSelectMode.zhaniao == 2)
                            text += "红桃10翻倍,";
                        else if (tData.areaSelectMode.zhaniao == 3)
                            text += "红桃10飘5分,";
                        else if (tData.areaSelectMode.zhaniao == 4)
                            text += "红桃10飘10分,";
                    }

                    text += tData.areaSelectMode.can3aZhaDan ? "3个A算炸弹," : "";
                    text += tData.areaSelectMode.can3ge3ZhaDan ? "3个3算炸弹," : "";
                    text += tData.areaSelectMode.isPlayerShuffle == 1 ? "手动切牌," : "系统切牌,";

                    var piaoFenStr = "";
                    switch (tData.areaSelectMode.piaofen){
                        case 1:{
                            piaoFenStr = "飘123,";
                            break;
                        }
                        case 2:{
                            piaoFenStr = "飘235,";
                            break;
                        }
                        case 3:{
                            piaoFenStr = "飘258,";
                            break;
                        }
                        case 4:{
                            piaoFenStr = "每局飘1,";
                            break;
                        }
                        case 5:{
                            piaoFenStr = "每局飘2,";
                            break;
                        }
                        default:{
                            piaoFenStr = ""
                            break;
                        }
                    }
                    text += piaoFenStr;

                    if (typeof(tData.areaSelectMode.fengDing) == "number") {
                        switch (tData.areaSelectMode.fengDing)
                        {
                            case 1:
                                text += "30/32分封顶,";
                                break;
                            case 2:
                                text += "60/64分封顶,";
                                break;
                        }
                    }
                    
                    if (typeof(tData.areaSelectMode.fanBei) != 'undefined') 
                        text += tData.areaSelectMode.fanBei == 0 ? "不翻倍," : "低于" + tData.areaSelectMode.fanBeiScore + "分翻倍,";
                    //text += tData.areaSelectMode.showCardNumber ? "显示牌数," : "";
                    if (tData.fieldBase) // 金币场底分
                        text += "底分X" + tData.fieldBase + ",";
                    else
                        text += tData.areaSelectMode.paodekuaiTY_difen ? "底分X" + tData.areaSelectMode.paodekuaiTY_difen + ",":"";
                    if (MjClient.getAppType() != MjClient.APP_TYPE.HUNANWANGWANG && MjClient.getAppType() != MjClient.APP_TYPE.QXSYDTZ && 
                        MjClient.getAppType() != MjClient.APP_TYPE.QXLYQP){
                        text += ("房间号:" + tData.tableid);
                    }
                    return text;
                }
            },
            dir_0:
            {
                _visible: true,
                _run:function()
                {
                },
                _text: function () {
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    var text = "";

                    if(MjClient.data.sData.tData.fieldId){
                        text = GameCnName[MjClient.gameType] + " " + tData.maxPlayer + " 人";
                    }else{
                        text = GameCnName[MjClient.gameType] + " " + tData.maxPlayer + " 人   房号：" + tData.tableid;
                    }
                    return text;
                }
            },
            head0: {
                head: {
                    //zhuang:{_visible:false}
                },
                winNum: {
                },
                _run: function () { SetEndOneUserUI_PaoDeKuaiYZTY(this, 0); },

            }
    		, head1: {
    		    head: {
    		        //:{_visible:false}
    		    },
    		    winNum: {
    		        // _layout:[[0.08,0.08],[1,0.5],[-2.5,0.75]]
    		    },
    		    _run: function () { SetEndOneUserUI_PaoDeKuaiYZTY(this, 1); }
    		}

    		, head2: {
    		    head: {
    		        //zhuang:{_visible:false}
    		    },
    		    winNum: {
    		        // _layout:[[0.08,0.08],[1,0.5],[-2.5,-0.75]]
    		    },
    		    _run: function () { SetEndOneUserUI_PaoDeKuaiYZTY(this, 2); }
    		},

        }
    },
    ctor: function () {
        this._super();
        var endoneui = ccs.load("endOne_PaoDeKuaiTY.json");
        BindUiAndLogic(endoneui.node, this.jsBind);
        this.addChild(endoneui.node);

        // var _dir = endoneui.node.getChildByName("back").getChildByName("dir");
        // _dir.ignoreContentAdaptWithSize(true);
        //时间
        var _back = endoneui.node.getChildByName("back");
        var _time = _back.getChildByName("time");
        _time.visible = true;

        //var _laizi = endoneui.node.getChildByName("back").getChildByName("laizi");
        //setCardSprite(_laizi, MjClient.data.sData.tData.hunCard, 4);

        _time.setString(MjClient.roundEndTime);
        MjClient.endoneui = this;

        return true;
    }
});