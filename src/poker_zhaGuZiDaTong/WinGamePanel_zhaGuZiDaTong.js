

function SetEndOneUserUI_zhaGuZiDaTong(node, off) {
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
                    CardLayoutRestoreForEndOne_zhaGuZiDaTong(node, pl);
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
            _run:function()
            {
                this.ignoreContentAdaptWithSize(true);
            },
            _text: function () {
                var pre = "";
                if (pl.winone > 0) pre = "+";
                return pre + pl.winone;
            }
            , fenshu: {
                _run:function()
                {
                    this.ignoreContentAdaptWithSize(true);
                },
            }
        }
        , allScore: {
            _run:function()
            {
                this.ignoreContentAdaptWithSize(true);
            },
            _text: function () {
                // 计算当前总分
                var pre = "";
                return pre + pl.winall;
            }
        }
        ,head_bg:{
            Image_dizhu: {
                _run: function () {
                    this.visible = false;
                    var tData = MjClient.data.sData.tData;
                    if(tData.uids[tData.zhuang] == pl.info.uid)
                    {
                        this.visible = true;
                    }
                }
            },
        }
        ,camp:{
            _run:function()
            {
                this.ignoreContentAdaptWithSize(true);
            },
            _text: function () {
                var pre = "";
                var uid = pl.info.uid;
                var text = tData.haveSanPlUids.indexOf(uid) == -1 ? "股家" : "三家";
                return pre + text;
            }
        }
        ,rank:{
            _run: function () {
                this.ignoreContentAdaptWithSize(true)
                var uid = pl.info.uid;
                var tourList = tData.tourList;
                var rank = tourList.indexOf(uid);
                if(rank == -1)
                {
                    rank = 4;
                }
                this.loadTexture("gameOver_zhaGuZi/"+rank+".png");
            }
        }
    }
    BindUiAndLogic(node.parent, uibind);
    addWxHeadToEndUI(uibind.head._node, off);
    //uibind.winNum._node.y=uibind.head._node.y;
}

function CardLayoutRestoreForEndOne_zhaGuZiDaTong(node, plNode) {
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

        ci.zIndex  = i;
    }
};


var EndOneView_zhaGuZiDaTong = cc.Layer.extend({
    jsBind: {
        block: {
            _layout: [[1, 1], [0.5, 0.5], [0, 0], true]
        },
        back: {
            _run:function()
            {
                if(isIPhoneX())
                    setWgtLayout(this, [0.85,0.85],[0.5,0.5],[0,0], false);
                else
                    setWgtLayout(this, [1,1],[0.5,0.5],[0,0], false);
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
    		        if (MjClient.isDismiss) {
                        this.ignoreContentAdaptWithSize(true);
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
                    // 晋中换皮，房间信息显示根据"#"拆分，by 江崇伟
                    var tData = MjClient.data.sData.tData;

                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    var text = "";
                    var _roundText = "";
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
                    text += ("房间号:" + tData.tableid);
                    text += _roundText;

                    return text;
                }
            },
            dir_0: {
                _visible:true,
                _run:function(){

                },
                _text: function () {
                    var tData = MjClient.data.sData.tData;
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    var text = "";
                    text += "大同扎股子,";
                    text += "倍率:"+ tData.totalJiaZhu +",";
                    text +=  tData.areaSelectMode.difen  + "底分,";
                    text += tData.areaSelectMode.showHandNum  ? "显示手牌":"";
                    return text;
                }
            },
            oneScore_title: {
                _run:function(){
                    this.ignoreContentAdaptWithSize(true);
                },
            },
            allScore_title: {
                _run:function(){
                    this.ignoreContentAdaptWithSize(true);
                },
            },
            head0: {
                head: {
                    //zhuang:{_visible:false}
                },
                winNum: {
                },
                _run: function () { SetEndOneUserUI_zhaGuZiDaTong(this, 0); },

            }
    		, head1: {
    		    head: {
    		        //:{_visible:false}
    		    },
    		    winNum: {
    		        // _layout:[[0.08,0.08],[1,0.5],[-2.5,0.75]]
    		    },
    		    _run: function () { SetEndOneUserUI_zhaGuZiDaTong(this, 1); }
    		}

    		, head2: {
    		    head: {
    		        //zhuang:{_visible:false}
    		    },
    		    winNum: {
    		        // _layout:[[0.08,0.08],[1,0.5],[-2.5,-0.75]]
    		    },
    		    _run: function () { SetEndOneUserUI_zhaGuZiDaTong(this, 2); }
    		}
            , head3: {
                head: {
                    //zhuang:{_visible:false}
                },
                winNum: {
                    // _layout:[[0.08,0.08],[1,0.5],[-2.5,-0.75]]
                },
                _run: function () { SetEndOneUserUI_zhaGuZiDaTong(this, 3); }
            }
            , head4: {
                head: {
                    //zhuang:{_visible:false}
                },
                winNum: {
                    // _layout:[[0.08,0.08],[1,0.5],[-2.5,-0.75]]
                },
                _run: function () { SetEndOneUserUI_zhaGuZiDaTong(this, 4); }
            }
        }
    },
    ctor: function () {
        this._super();
        var endoneui = ccs.load("endOne_zhaGuZiDaTong.json");
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