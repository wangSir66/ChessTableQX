

function SetEndOneUserUI_RunFasterYA(node, off) {
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var pl = MjClient.getPlayerByIndex(off);
    node.setVisible(false);
    if (!pl) return;
    node.setVisible(true);
    setUserOfflineWinGamePanel(node, pl);
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
                _run: function () {
                    this.ignoreContentAdaptWithSize(true);
                    this.setFontName("Arial");
                    this.setFontSize(this.getFontSize());
                },
                _text: function () {
                    var _nameStr = unescape(pl.info.nickname) + "";
                    //this.ignoreContentAdaptWithSize(true);
                    return getNewName(_nameStr);
                }
            },
            id: {
                _run: function () {
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
                        let cnode = getNewCard_card(node, "stand", "mjhand", pl.mjhand[i], 0),
                            notOut = pl.initHands.indexOf(pl.mjhand[i]);
                        cnode.setColor(cc.color(150, 150, 150))
                        arry.push(cnode);
                        if (notOut > -1) cnode.setColor(cc.color(255, 255, 255))
                    }
                    for (var i = 0; i < arry.length; i++) {
                        arry[i].visible = true;
                        arry[i].enabled = false;
                        arry[i].setScale(arry[i].getScale() * 0.75);
                    }
                    CardLayoutRestoreForEndOne_ty(node, pl);
                }
            },
            zhuang: {
                _run: function () {
                    this.visible = tData.uids[tData.zhuang] === pl.info.uid
                }
            }
        }
        , winNum: {
            _text: function () {
                var pre = "";
                if (pl.winone > 0) pre = "+";
                return pre + pl.winone;
            }
            , fenshu: {
                _run: function () {
                    this.ignoreContentAdaptWithSize(true);
                },
            }
        }
        , cardNum: {
            _visible: false,
            _run: function () {
                this.ignoreContentAdaptWithSize(true);
                if (pl.initHands.length > 0)
                    this.visible = true;
            },
            _text: function () {
                return '剩' + pl.initHands.length + '张';
            }
        }
        , desc: {
            _visible: false,
            _run: function () {
                this.ignoreContentAdaptWithSize(true);
                if (pl.mjdesc.length > 0) this.visible = true;
            },
            _text: function () {
                var str = '';

                for (var i in pl.mjdesc) {
                    var istr = pl.mjdesc[i];
                    if (istr.length > 16) istr = '申请解散';
                    if (str.length > 0) str += '\n';
                    str += istr;
                }
                return str;
            },
        }
        , zhadanfanbei: {
            _run: function () {
                if (!tData.areaSelectMode.isZhaDanFanBei || !pl.zhaDanCount || pl.zhaDanCount <= 0 || pl.winone <= 0) {
                    this.visible = false;
                    return;
                }

                // "炸弹 x XX 倍"
                var sprites = [];
                sprites[0] = new cc.Sprite("gameOver/zhadan_cheng.png");
                var beishu = 1 << pl.zhaDanCount;
                for (var i = 1; beishu > 0; i++) {
                    var num = beishu % 10;
                    beishu = Math.floor(beishu / 10);
                    sprites[i] = new cc.Sprite("gameOver/zhadan_" + num + ".png");
                }

                var width = 80 / sprites.length;
                for (var i = 0, len = sprites.length; i < len; i++) {
                    sprites[i].y = this.height / 2;
                    if (i == 0)
                        sprites[i].x = 65 + width / 2;
                    else
                        sprites[i].x = 65 + (len - i) * width + width / 2;

                    if (width < sprites[i].width)
                        sprites[i].scale = width / sprites[i].width;

                    this.addChild(sprites[i]);
                }
            }
        }
    }
    BindUiAndLogic(node.parent, uibind);
    addWxHeadToEndUI(uibind.head._node, off);
    //uibind.winNum._node.y=uibind.head._node.y;
}

function CardLayoutRestoreForEndOne_RunFasterYA(node, plNode) {
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


var EndOneView_RunFasterYA = cc.Layer.extend({
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
                },
                _run: function () {
                    if (MjClient.isDismiss) {
                        this.loadTexture("gameOver/jiesan.png");
                    }
                },
                lb: {
                    _run: function () {
                        this.visible = !MjClient.isDismiss;
                    }
                }
            },
            share: {
                _click: function (btn, eT) {
                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Xiaojiesuanjiemian_Fenxiang", { uid: SelfUid() });

                    MjClient.shareMultiPlatform(MjClient.systemConfig.sharePlatforms, function () {
                        postEvent("capture_screen");
                        MjClient.endoneui.capture_screen = true;
                        btn.setTouchEnabled(false);
                    });
                }
                , _event: {
                    captureScreen_OK: function () {
                        if (MjClient.endoneui.capture_screen != true)
                            return;
                        MjClient.endoneui.capture_screen = false;
                        var writePath = jsb.fileUtils.getWritablePath();
                        var textrueName = "wxcapture_screen.png";
                        var savepath = writePath + textrueName;
                        MjClient.shareImageToSelectedPlatform(savepath);
                        this.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(function () {
                            this.setTouchEnabled(true);
                        }.bind(this))));
                    }
                }
                , _visible: function () {
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
                    MjClient.endoneui.nextStartGame();
                }
            },
            delText:
            {
                _run: function () {
                    if (MjClient.isDismiss) {
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;
                        var id = tData.firstDel;
                        var pl = sData.players[id];
                        var delStr = "";
                        if (pl) {
                            var name = unescape(pl.info.nickname);
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
            time:
            {
                _visible: true,
                _run: function () {
                    // if (!MjClient.endoneui.isNewUi)
                    // this.ignoreContentAdaptWithSize(true);
                },
                _text: function () {
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    var str = [],
                        rule = tData.areaSelectMode;

                    if (MjClient.endoneui.isNewUi)
                        str.push(GameCnName[MjClient.gameType] + " " + tData.maxPlayer + " 人   房号：" + tData.tableid);

                    str.push(['每局黑桃五先出', '每局赢家先出'][rule.mustPutHongTaoSan]);
                    rule.Sisters && str.push("姊妹对");
                    rule.AllBlack && str.push("全黑");
                    rule.AllRed && str.push("全红");
                    rule.AllBig && str.push("全大");
                    rule.AllSmall && str.push("全小");
                    rule.AllSingly && str.push("全单");
                    rule.AllDouble && str.push("全双");
                    rule.Four5OrA && str.push("5555，AAAA");
                    rule.FourOther && str.push("4个6-4个K");
                    rule.can3geZha && str.push("3张算炸");
                    rule.can4geZha && str.push("4张算炸");
                    rule.isZhaDanJiaFen && str.push('带炸弹');

                    if (typeof (rule.fengDing) == "number") {
                        switch (rule.fengDing) {
                            case 1:
                                str.push("30/32分封顶");
                                break;
                            case 2:
                                str.push("60/64分封顶");
                                break;
                        }
                    }

                    str.push("底分X" + rule.difen);
                    if (typeof (rule.fanBei) != 'undefined')
                        str.push(rule.fanBei == 0 ? "不翻倍," : "低于" + rule.fanBeiScore + "分翻倍,");

                    return str.join(',');
                }
            },
            head0: {
                head: {
                    //zhuang:{_visible:false}
                },
                winNum: {
                },
                _run: function () { SetEndOneUserUI_RunFasterYA(this, 0); },

            },
            head1: {
                head: {
                    //:{_visible:false}
                },
                winNum: {
                    // _layout:[[0.08,0.08],[1,0.5],[-2.5,0.75]]
                },
                _run: function () { SetEndOneUserUI_RunFasterYA(this, 1); }
            },
            head2: {
                head: {
                    //zhuang:{_visible:false}
                },
                winNum: {
                    // _layout:[[0.08,0.08],[1,0.5],[-2.5,-0.75]]
                },
                _run: function () { SetEndOneUserUI_RunFasterYA(this, 2); }
            },
            head3: {
                head: {
                    //zhuang:{_visible:false}
                },
                winNum: {
                    // _layout:[[0.08,0.08],[1,0.5],[-2.5,-0.75]]
                },
                _run: function () { SetEndOneUserUI_RunFasterYA(this, 3); }
            },
            countDown: {
                _visible: false,
                _run: function () {
                    var show = MjClient.data.sData.tData.areaSelectMode.AutoReady;
                    this.setVisible(!!show);
                    cc.log('-----countDown---------', show)
                    if (!show) return;
                    var i = MjClient.rePlayVideo == -1 ? 10 : 0;
                    if (i > 0) {
                        this.setString('(' + i + 's' + ')');
                        this.schedule(() => {
                            i--;
                            if (i < 0) {
                                this.unscheduleAllCallbacks();
                                MjClient.endoneui.nextStartGame();
                                return;
                            }
                            this.setString('(' + i + 's' + ')');
                        }, 1);
                    }
                }
            },
        }
    },
    nextStartGame: function () {
        cc.log('--------下一局消息事件-----');
        var sData = MjClient.data.sData;
        var tData = sData.tData;
        postEvent("clearCardUI");
        MjClient.endoneui.removeFromParent(true);
        MjClient.endoneui = null;

        if (MjClient.rePlayVideo >= 0 && MjClient.replayui) {
            MjClient.replayui.replayEnd();
        }
        else {
            tData.roundNum <= 0 || PKPassConfirmToServer_card();
        }
        if (MjClient.arrowbkNode && cc.sys.isObjectValid(MjClient.arrowbkNode)) {
            MjClient.arrowbkNode.setVisible(false);
        }
        if (tData.roundNum <= 0) {
            postEvent("showEndRoom");
        }
    },
    ctor: function () {
        this._super();
        this.isNewUi = (MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP || MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ);
        MjClient.endoneui = this;

        var endoneui = ccs.load('endOne_RunFasterYA.json');
        BindUiAndLogic(endoneui.node, this.jsBind);
        this.addChild(endoneui.node);

        //时间
        var _back = endoneui.node.getChildByName("back");
        var _time = _back.getChildByName("dir");
        _time.visible = true;

        _time.setString(MjClient.roundEndTime + '\n' + '房间号：' + MjClient.data.sData.tData.tableid);
        return true;
    }
});