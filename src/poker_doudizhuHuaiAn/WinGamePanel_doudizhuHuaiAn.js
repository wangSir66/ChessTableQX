

function SetEndOneUserUI_doudizhuHuaiAn(node, off) {
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var pl = MjClient.getPlayerByIndex(off);
    node.setVisible(false);
    if (!pl) return;
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
        head: {
            name: {
                _run:function()
                {
                    this.ignoreContentAdaptWithSize(true);
                    this.setFontName("Arial");
                    this.setFontSize(25);
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
                    var arry = [];

                    //添加手牌
                    for (var i = 0; i < pl.mjhand.length; i++) {
                        arry.push(getNewCard_card(node, "stand", "mjhand", pl.mjhand[i], 0));
                    }

                    for (var i = 0; i < arry.length; i++) {
                        arry[i].visible = true;
                        arry[i].enabled = false;
                        arry[i].setScale(arry[i].getScale() * 0.75);
                    }
                    CardLayoutRestoreForEndOne_doudizhuHuaiAn(node, pl);
                }
            },
            cardType: {
                _run:function()
                {
                    this.zIndex = 100;
                    this.ignoreContentAdaptWithSize(true);
                },
                _text: function () {
                    return pl.mjdesc + ""
                },
            }
        }
		, winNum: {
            _run: function () {
                this.ignoreContentAdaptWithSize(true);
            },
		    _text: function () {
		        var pre = "";
		        if (pl.winone > 0) pre = "+";
		        return pre + pl.winone;
		    }
            , fenshu_bg: {
                _run: function() {
                    this.x = this.getParent().width / 2;
                }
            }
            , fenshu: {
                _run:function()
                {
                    this.ignoreContentAdaptWithSize(true);
                },
            }
		}
        , Image_dizhu: {
            _run: function () {
                this.visible = false;
                var tData = MjClient.data.sData.tData;
                if(tData.uids[MjClient.playui.zhuang] == pl.info.uid)
                {
                    this.visible = true;
                }
            }
        },
    }
    BindUiAndLogic(node.parent, uibind);
    addWxHeadToEndUI(uibind.head._node, off);
    //uibind.winNum._node.y=uibind.head._node.y;
}

function CardLayoutRestoreForEndOne_doudizhuHuaiAn(node, plNode) {
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


var EndOneView_doudizhuHuaiAn = cc.Layer.extend({
    jsBind: {
        block: {
            _layout: [[1, 1], [0.5, 0.5], [0, 0], true]
        },
        back: {
            _layout: [[1, 1], [0.5, 0.5], [0, 0]],
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
    		        if (MjClient.isDismiss) {
    		            this.loadTexture("gameOver/jiesan.png");
    		        }
    		    }
    		},
            share: {
                _click:function(btn,eT){
                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Xiaojiesuanjiemian_Fenxiang", {uid:SelfUid()});

                    MjClient.shareMultiPlatform(MjClient.systemConfig.sharePlatforms, function()
                    {
                        postEvent("capture_screen");
                        MjClient.endoneui.capture_screen = true;
                        btn.setTouchEnabled(false);
                        //btn.setBright(false);
                    });
                }
                ,_event:{
                    captureScreen_OK: function () {
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
                            //this.setBright(true);
                        }.bind(this))));
                    }
                }
                ,_visible: function () {
                    return !MjClient.remoteCfg.guestLogin;
                }
            },
            ready: {
                _run: function () {
                    if (MjClient.remoteCfg.guestLogin) {
                        setWgtLayout(this, [0.15, 0.15], [0.5, 0.085], [0, 0], false, true);
                    }
                },
                _click: function (btn, eT) {

                    postEvent("clearCardUI");

                    MjClient.endoneui.removeFromParent(true);
                    MjClient.endoneui = null;
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    if (MjClient.rePlayVideo >= 0 && MjClient.replayui) {
                        MjClient.replayui.replayEnd();
                    }
                    else {
                        PKPassConfirmToServer_card();
                    }
                    // if (MjClient.arrowbkNode) {
                    //     MjClient.arrowbkNode.setVisible(false);
                    // }

                    //reInitarrCardVisible();
                }
            },
            dir:
            {
                _visible: true,
                _run:function()
                {
                    this.ignoreContentAdaptWithSize(true);
                },
                _text: function () {

                     var tData = MjClient.data.sData.tData;

                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    var text = "";
                    text += "斗地主,";
                    // text += MjClient.MaxPlayerNum == 3 ? "三人玩," : "两人玩,";
                    // text += tData.areaSelectMode.isZhaDanFanBei ? "炸弹翻倍," : "";
                    // text += tData.areaSelectMode.mustPutHongTaoSan ? "先出红桃三," : "";
                    // text += tData.areaSelectMode.mustPut ? "能管必管," : "";
                    // text += tData.areaSelectMode.showCardNumber ? "显示牌数," : "";
                    text += tData.areaSelectMode.difen ? "底分:"+tData.areaSelectMode.difen+"," : "";
                    switch (tData.areaSelectMode.zhafengding)
                    {
                        case 12:
                            text += "12分封顶,";
                            break;
                        case 24:
                            text += "24分封顶,";
                            break;
                    }
                    for(var k in tData.areaSelectMode)
                    {
                        if(tData.areaSelectMode[k])
                        {
                            switch (k)
                            {
                                case "bijiaoShuangwang":
                                    text += "双王必叫,";
                                    break;
                                case "bijiaoShuangZhadan":
                                    text += "双炸弹必叫,";
                                    break;
                                case "daiti":
                                    text += "带踢带勾,";
                                    break;
                                case "farmerCanTi":
                                    text += "农民可踢,";
                                    break;
                            }
                        }
                    }
                    switch (tData.areaSelectMode.payWay)
                    {
                        case 0:
                            text += "房主付";
                            break;
                        case 1:
                            text += "AA付";
                            break;
                        case 2:
                            text += "大赢家付";
                            break;
                    }
                    var _currentRound = tData.roundAll - tData.roundNum;
                    if(_currentRound > tData.roundAll) _currentRound = tData.roundAll;

                    _roundText = ",局数:" + _currentRound + "/" + tData.roundAll;
                    var roundNumPre = typeof(tData.roundNumPre) != "undefined" ? tData.roundNumPre : tData.roundNum;
                    if (roundNumPre && tData.roundAll - tData.roundNumPre + 1 <= tData.roundAll)
                    {
                        var _currentRound = tData.roundAll - tData.roundNumPre + 1;
                        if(_currentRound > tData.roundAll) _currentRound = tData.roundAll;
                        _roundText = ",局数:" + _currentRound + "/" + tData.roundAll;
                    }
                    text += ("房间号:" + tData.tableid)+_roundText;
                    return text;
                }
            },
            head0: {
                head: {
                    //zhuang:{_visible:false}
                },
                winNum: {
                },
                tiTagiconForHead:{
                    _visible: false,
                    _run: function () {
                        var pl = MjClient.getPlayerByIndex(0);
                        this.visible=pl.jiazhuNum > 0
                    }
                },
                _run: function () { SetEndOneUserUI_doudizhuHuaiAn(this, 0); },

            }
    		, head1: {
    		    head: {
    		        //:{_visible:false}
    		    },
    		    winNum: {
    		        // _layout:[[0.08,0.08],[1,0.5],[-2.5,0.75]]
    		    },
                tiTagiconForHead:{
                    _visible: false,
                    _run: function () {
                        var pl = MjClient.getPlayerByIndex(1);
                        this.visible=pl.jiazhuNum > 0
                    }
                },
    		    _run: function () { SetEndOneUserUI_doudizhuHuaiAn(this, 1); }
    		}

    		, head2: {
    		    head: {
    		        //zhuang:{_visible:false}
    		    },
    		    winNum: {
    		        // _layout:[[0.08,0.08],[1,0.5],[-2.5,-0.75]]
    		    },
                tiTagiconForHead:{
                    _visible: false,
                    _run: function () {
                        var pl = MjClient.getPlayerByIndex(2);
                        this.visible=pl.jiazhuNum > 0
                    }
                },
    		    _run: function () { SetEndOneUserUI_doudizhuHuaiAn(this, 2); }
    		}
        }
    },
    ctor: function (zhuang) {
        this._super();
        MjClient.playui.zhuang= zhuang;
        var endoneui = ccs.load(res.EndOne_doudizhuHuaiAn_json);
        BindUiAndLogic(endoneui.node, this.jsBind);
        this.addChild(endoneui.node);

        var _dir = endoneui.node.getChildByName("back").getChildByName("dir");
        _dir.ignoreContentAdaptWithSize(true);
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