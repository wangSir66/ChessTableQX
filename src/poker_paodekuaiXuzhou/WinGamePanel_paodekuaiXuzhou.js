

function SetEndOneUserUI_paodekuaiXuzhou(node, off) {
    var sData = MjClient.data.sData;
    var tData = sData.tData;
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
            node.getChildByName("head_bg").setVisible(true);
            node.getChildByName("stand_other_desc").setVisible(true);
            node.getChildByName("stand_other_desc").ignoreContentAdaptWithSize(true);
            stand_other.setVisible(false)

            var stand = stand_other//head.getChildByName("stand");
            var offX = stand.x;
            var upSize = stand.getSize();
            var upS = stand.scale;

            for (var i = 0; i < tData.otherCards.length; i++) {
                var card = getNewCard_card(node, "stand_other", "mjhand", tData.otherCards[i], 0);
                card.visible = true;
                card.enabled = false;
                card.setScale(0.48);
                if (i != 0) {
                    offX += upSize.width * upS * 0.4;//调牌的距离的
                    card.x = offX;//调牌的距离的
                }else {
                    card.x = offX + upSize.width * upS * 0.1;
                }

            }

        }
        return;
    }
    node.setVisible(true);
    setUserOfflineWinGamePanel(node,pl);
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
                    for (var i = 0; i < pl.mjhandRecord.length; i++) {
                        var card = getNewCard_card(node, "stand", "mjhand", pl.mjhandRecord[i], 0);
                        arry.push(card);
                        // 如果是打出去的牌， 显示遮罩
                        if( pl.mjhand.indexOf(pl.mjhandRecord[i]) < 0) {
                            card.isGray = true;
                            card.setColor(MjClient.grayColor);
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
        }
		, winNum: {
		    _text: function () {
		        var pre = "";
		        if (pl.winone > 0) pre = "+";
		        return pre + pl.winone;
		    },
            _run: function () {
                if(pl.winone < 0) { // 分数小于零，改变字体颜色
                    this.setTextColor(cc.color(124,198,236));
                    this.enableOutline(cc.color(92,100,199), 2);
                }
            }
            , fenshu: {
                _run:function()
                {
                    this.ignoreContentAdaptWithSize(true);
                },
            }
		}
        , cardNum : {
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
                if(pl.mjdesc.length > 0)    this.visible = true;
            },
            _text: function () {
                var str = '';

                for(var i in pl.mjdesc) {
                    var istr = pl.mjdesc[i];
                    if( istr.length > 16 ) istr = '申请解散';
                    if(str.length > 0)  str += '\n';
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
    }
    BindUiAndLogic(node.parent, uibind);
    addWxHeadToEndUI(uibind.head._node, off);
    //uibind.winNum._node.y=uibind.head._node.y;
}

function CardLayoutRestoreForEndOne_paodekuaiXuzhou(node, plNode) {
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


var EndOneView_paodekuaiXuzhou = cc.Layer.extend({
    jsBind: {
        block: {
            _layout: [[1, 1], [0.5, 0.5], [0, 0], true]
        },
        back: {
            // _layout:{ 
                //[[1, 1], [0.5, 0.5], [0, 0]], 
                _run:function()
                {
                    
                    setWgtLayout(this, [1, 1], [0.5, 0.5], [0, 0]);
                    if (isIPhoneX())
                    {
                        setWgtLayout(this, [1, 1], [0.5, 0.5], [0, 0], true);
                    }
                },
            // },
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
                        // btn.setBright(false);
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
                            // this.setBright(true);
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
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    if (sData.tData.roundNum <= 0) 
                        MjClient.endoneui.getParent().addChild(new GameOverLayer(),500);

                    postEvent("clearCardUI");
                    MjClient.endoneui.removeFromParent(true);
                    MjClient.endoneui = null;
                   
                    if (MjClient.rePlayVideo >= 0 && MjClient.replayui) {
                        MjClient.replayui.replayEnd();
                    }
                    else {
                        PKPassConfirmToServer_card();
                    }
                    if (MjClient.arrowbkNode && cc.sys.isObjectValid( MjClient.arrowbkNode )) {
                        MjClient.arrowbkNode.setVisible(false);
                    }

                    //reInitarrCardVisible();
                }
            },
            delText:
            {
                _run: function() {
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
                                delStr = pl.mjdesc[0];
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
                    if (!MjClient.endoneui.isNewUi)
                        this.ignoreContentAdaptWithSize(true);
                },
                _text: function () {
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    var text = "";

                    if (MjClient.endoneui.isNewUi)
                        text = GameCnName[MjClient.gameType] + " " + tData.maxPlayer + " 人   房号：" + tData.tableid + "\n";

                    //text += "跑得快,";
                    //text += MjClient.MaxPlayerNum == 3 ? "三人玩," : "两人玩,";
                    //text += tData.areaSelectMode.cardNumIndex == 0 ? "16张," : "15张,";
                    //text += tData.areaSelectMode.firstHeiTao3 ? "黑桃3先出," : "赢家先出,";
                    text += tData.areaSelectMode.isXiaoGuan ? "小关X2," : "";
                    text += tData.areaSelectMode.isDaGuan ? "大关X3," : "";
                    text += tData.areaSelectMode.isDaGuanX2 ? "大关X2," : "";
                    text += tData.areaSelectMode.can3daiNum == 1 ? "3带1," : "3带2,";
                    //text += tData.areaSelectMode.can4dai2 ? "4带2," : "";
                    text += tData.areaSelectMode.can3aZhaDan ? "3个A算炸弹," : "";
                    text += tData.areaSelectMode.can3ge3ZhaDan ? "3个3算炸弹," : "";
                    text += tData.areaSelectMode.isPlayerShuffle == 1 ? "手动切牌," : "系统切牌,";

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
                    
                    text += tData.areaSelectMode.isZhaDanJiaFen ? "炸弹加分," : "";
                    if (typeof(tData.areaSelectMode.fanBei) != 'undefined') 
                    text += tData.areaSelectMode.fanBei == 0 ? "不翻倍," : "低于" + tData.areaSelectMode.fanBeiScore + "分翻倍,";
                    //text += tData.areaSelectMode.difen ? "底分X" + tData.areaSelectMode.difen + ",":"";

                    if (!MjClient.endoneui.isNewUi)
                        text += ("房间号:" + tData.tableid);

                    if (text.charAt(text.length - 1) == ",")
                        text = text.substring(0, text.length - 1);
                    return text;
                }
            },
            head0: {
                head: {
                    //zhuang:{_visible:false}
                },
                winNum: {
                },
                _run: function () { SetEndOneUserUI_paodekuaiXuzhou(this, 0); },

            }
    		, head1: {
    		    head: {
    		        //:{_visible:false}
    		    },
    		    winNum: {
    		        // _layout:[[0.08,0.08],[1,0.5],[-2.5,0.75]]
    		    },
    		    _run: function () { SetEndOneUserUI_paodekuaiXuzhou(this, 1); }
    		}

    		, head2: {
    		    head: {
    		        //zhuang:{_visible:false}
    		    },
    		    winNum: {
    		        // _layout:[[0.08,0.08],[1,0.5],[-2.5,-0.75]]
    		    },
    		    _run: function () { SetEndOneUserUI_paodekuaiXuzhou(this, 2); }
    		}
        }
    },
    ctor: function () {
        this._super();
        this.isNewUi = (MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP|| MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ);
        MjClient.endoneui = this;

        var endoneui = ccs.load(res.EndOne_PaoDeKuaiXuzhou_json);
        BindUiAndLogic(endoneui.node, this.jsBind);
        this.addChild(endoneui.node);

        //时间
        var _back = endoneui.node.getChildByName("back");
        var _time = _back.getChildByName("time");
        _time.visible = true;

        //var _laizi = endoneui.node.getChildByName("back").getChildByName("laizi");
        //setCardSprite(_laizi, MjClient.data.sData.tData.hunCard, 4);

        _time.setString(MjClient.roundEndTime);
        return true;
    }
});