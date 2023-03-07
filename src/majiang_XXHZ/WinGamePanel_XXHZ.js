/**
 * added by Joey 2018/06/13
 */

function SetEndOneUserUI_XXHZ(node, off) {
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var pl = MjClient.getPlayerByIndex(off);
    node.setVisible(false);
    if (!pl) {
        return;
    }
    node.setVisible(true);
    node = node.getChildByName("head");
    var zhuangNode = node.getChildByName("zhuang");
    var tempZhuang = (typeof MjClient.preZhuang != 'undefined') ? MjClient.preZhuang : tData.zhuang;
    zhuangNode.setVisible(tData.uids[tempZhuang] == pl.info.uid);
    zhuangNode.zIndex = 10;

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
                    var _nameStr = unescape(pl.info.nickname ) + "";
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

            winType: {
                _run: function () {
                    this.ignoreContentAdaptWithSize(true);
                },

                _text: function () {
                    return pl.baseWin > 0 ? ("X" + pl.baseWin) : "0";
                }
            },

            up: {
                _visible: false,
                _run: function () {
                    var arry = [];
                    //明杠
                    for (var i = 0; i < pl.mjgang0.length; i++) {
                        for (var j = 0; j < 4; j++) {
                            if (j == 3) {
                                arry.push(getNewCard(node, "up", "gang0", pl.mjgang0[i], 0, "isgang4"))
                            } else {
                                arry.push(getNewCard(node, "up", "gang0", pl.mjgang0[i], 0));
                            }
                        }
                    }

                    //添加暗杠
                    for (var i = 0; i < pl.mjgang1.length; i++) {
                        for (var j = 0; j < 4; j++) {

                            if (j == 3) {
                                var card = getNewCard(node, "down", "gang1", 0, 0, "isgang4");
                                card.tag = pl.mjgang1[i];
                                arry.push(card);
                            } else {
                                arry.push(getNewCard(node, "up", "gang1", pl.mjgang1[i], 0));
                            }
                        }
                    }
                    //添加碰
                    for (var i = 0; i < pl.mjpeng.length; i++) {
                        for (var j = 0; j < 3; j++) {
                            arry.push(getNewCard(node, "up", "peng", pl.mjpeng[i], 0));
                        }
                    }

                    //添加吃
                    for (var i = 0; i < pl.mjchi.length; i++) {

                        arry.push(getNewCard(node, "up", "chi", pl.mjchi[i], 0));
                    }
                    //添加手牌
                    for (var i = 0; i < pl.mjhand.length; i++) {

                        arry.push(getNewCard(node, "up", "mjhand", pl.mjhand[i], 0));
                    }

                    for (var i = 0; i < arry.length; i++) {
                        arry[i].visible = true;
                        arry[i].enabled = false;
                        arry[i].setScale(arry[i].getScale() * 1.1);
                    }

                    CardLayoutRestoreForEndOne(node, pl);

                }
            },

            down: {
                _visible: false
            },

            stand: {
                _visible: false
            },

            cardType: {
                _run: function () {
                    this.ignoreContentAdaptWithSize(true);
                },
                _text: function () {
                    return pl.mjdesc + ""
                }
            }
        },

        winNum: {
            _text: function () {
                var pre = "";
                if (pl.winone > 0) pre = "+";
                return pre + pl.winone;
            },

            hu: {
                _run: function () {
                    setGameOverPanelPlayerState(this, pl, true);
                }
            },

            fenshu: {
                _run: function () {
                    this.ignoreContentAdaptWithSize(true);
                }
            }
        }
    };

    BindUiAndLogic(node.parent, uibind);
    addWxHeadToEndUI(uibind.head._node, off);

    if(MjClient.getAppType() === MjClient.APP_TYPE.QXXXGHZ){
        var pl = MjClient.getPlayerByIndex(off);
        setRoundEndUserOffline_xiangxiang(uibind.head._node,pl);
    }
}

var EndOneView_XXHZ = cc.Layer.extend({
    jsBind: {
        block: {
            _layout: [[1, 1], [0.5, 0.5], [0, 0], true]
        },

        back: {
            _layout: [[1, 1], [0.538, 0.5], [-0.035, 0]],

            wintitle: {
                _visible: function () {
                    var pl = getUIPlayer(0);
                    if (pl) {
                        return pl.winone >= 1;
                    }
                    return false;
                }
            },

            losetitle: {
                _visible: function () {
                    var pl = getUIPlayer(0);
                    if (pl) {
                        return pl.winone < 0;
                    }
                    return false;
                }
            },

            pingju: {
                _visible: function () {

                    var pl = getUIPlayer(0);

                    if (pl) {
                        return pl.winone == 0;
                    }
                    return false;
                },

                _run: function () {
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    if (MjClient.isDismiss) {
                        this.loadTexture("gameOver/jiesan.png");
                    }
                    else if (MjClient.CheckPlayerCount(function (p) {
                            if (p.winone == 0) {
                                return true;
                            }
                            return false;
                        }) == tData.maxPlayer) {
                        this.loadTexture("gameOver/huangzhuan_35.png");
                    }
                }
            },

            share: {
                _click: function (btn, eT) {
                    MjClient.shareMultiPlatform(MjClient.systemConfig.sharePlatforms, function () {
                        postEvent("capture_screen");
                        MjClient.endoneui.capture_screen = true;
                        btn.setTouchEnabled(false);
                    });
                },

                _visible: function () {
                    var tData = MjClient.data.sData.tData;
                    return (!MjClient.remoteCfg.guestLogin && !tData.matchId);
                },

                _event: {
                    captureScreen_OK: function () {
                        if (MjClient.endoneui.capture_screen != true) {
                            return;
                        }
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
            },

            ready: {
                _run: function () {
                    if (MjClient.remoteCfg.guestLogin) {
                        setWgtLayout(this, [0.15, 0.15], [0.5, 0.085], [0, 0], false, true);
                    }
                },

                _click: function (btn, eT) {
                    /*
                     准备的时候花清掉
                     */
                    for (var i = 0; i < 4; i++) {
                        var pl = getUIPlayer(i)
                        if (pl && pl.mjflower) {
                            pl.mjflower = [];
                        }
                    }

                    postEvent("clearCardUI");
                    MjClient.endoneui.removeFromParent(true);
                    MjClient.endoneui = null;
                    if (MjClient.rePlayVideo >= 0 && MjClient.replayui) {
                        MjClient.replayui.replayEnd();
                    }
                    else {
                        MjClient.MJPass2NetForXXHZ();
                    }

                    if (MjClient.endallui) {
                        MjClient.endallui.setVisible(true);
                    }
                    reInitarrCardVisible();
                },

                _visible: function () {
                    var tData = MjClient.data.sData.tData;
                    return !tData.matchId;
                }
            },

            dir: {
                _visible: true,
                _run: function () {
                    this.ignoreContentAdaptWithSize(true);
                },

                _text: function () {
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    var text = "";
                    text += "红中麻将";
                    var str = "";
                    switch (tData.areaSelectMode.zhuaniao) {
                        case 1:
                            str += ",一鸟全中";
                            break;
                        case 2:
                            str += ",2鸟";
                            break;
                        case 4:
                            str += ",4鸟";
                            break;
                        case 6:
                            str += ",6鸟";
                            break;
                        default:
                            break;
                    }
                    str += tData.areaSelectMode.zhuangxianfen ? ",庄闲分" : "";
                    str += tData.areaSelectMode.dianpao ? ",点炮胡" : "";
                    switch (tData.areaSelectMode.qianggang) {
                        case 1:
                        case true:
                            str += ",抢杠算自摸";
                            str += tData.areaSelectMode.qianggangquanbao ? ",抢杠全包" : "";
                            str += tData.areaSelectMode.wuhongzhong ? ",有红中可抢杠胡" : "";
                            break;
                        case 2:
                            str += ",抢杠算点炮";
                            str += tData.areaSelectMode.wuhongzhong ? ",有红中可抢杠胡" : "";
                            break;
                    }
                    str += tData.areaSelectMode.hongzhong8 ? ",8红中" : "";
                    //str += tData.areaSelectMode.qidui ? ",七对可胡" : "";
                    //str += tData.areaSelectMode.youhongzhongbujiepao ? ",有红中不接炮" : "";
                    str += tData.areaSelectMode.wuhongzhongjiabei ? ",无红中加倍" : "";
                    str += tData.areaSelectMode.genzhangbudianpao ? ",跟张不点炮":"";
                    str += tData.areaSelectMode.zhuaniao > 1 && tData.areaSelectMode.niaofen ? ",中鸟" + tData.areaSelectMode.niaofen + "分" : "";
                    str += tData.areaSelectMode.bihuType ? ",有胡必胡" : "";
                    str += tData.areaSelectMode.zhuaniao == 6 && tData.areaSelectMode.liuniaowanfa ? ",不中算全中, 全中算翻倍" : "";
                    str += tData.areaSelectMode.fanBei == 0 ? ",不翻倍" : ",低于" + tData.areaSelectMode.fanBeiScore + "分翻倍";
                    if(MjClient.APP_TYPE.QXXXGHZ == MjClient.getAppType()){
                        str += ",托管" + Math.floor(tData.areaSelectMode.trustTime/60) + "分钟";
                    }

                    text += str;
                    text += (",房间号:" + tData.tableid);
                    //text = getNewName(text, 30);
                    return text;
                }
            },

            head0: {
                head: {
                    zhuang: {_visible: false}
                },

                winNum: {},
                _run: function () {
                    SetEndOneUserUI_XXHZ(this, 0);
                }
            },

            head1: {
                head: {
                    zhuang: {_visible: false}
                },

                winNum: {},

                _run: function () {
                    SetEndOneUserUI_XXHZ(this, 1);
                }
            },

            head2: {
                head: {
                    zhuang: {_visible: false}
                },

                winNum: {},

                _run: function () {
                    SetEndOneUserUI_XXHZ(this, 2);
                }
            },

            head3: {
                head: {
                    zhuang: {_visible: false}
                },

                winNum: {},

                _run: function () {
                    SetEndOneUserUI_XXHZ(this, 3);
                }
            },

            count_down: {
                _visible: function () {
                    var tData = MjClient.data.sData.tData;
                    return tData.matchId;
                },

                _run: function () {
                    schedulLoadTexture(this);
                }
            }
        }
    },

    ctor: function () {

        this._super();
        var endoneui = ccs.load("endOne_XXHZ.json");
        BindUiAndLogic(endoneui.node, this.jsBind);
        this.addChild(endoneui.node);

        var _dir = endoneui.node.getChildByName("back").getChildByName("dir");
        _dir.ignoreContentAdaptWithSize(true);
        //时间
        var _back = endoneui.node.getChildByName("back");
        var _time = _back.getChildByName("time");
        _time.visible = true;
        _time.setString(MjClient.roundEndTime);

        MjClient.endoneui = this;

        changeMJBg(this, getCurrentMJBgType());

        //显示抓鸟的牌
        var _Image_niao = _back.getChildByName("Image_niao");
        var sData = MjClient.data.sData;
        var tData = sData.tData;
        var cards = tData.mopai;
        var cardnode = _Image_niao.getChildByName("niao_card");
        var countNode = _Image_niao.getChildByName("niao_count");
        cardnode.visible = false;
        var slotwith = cardnode.width * cardnode.scale * 0.9;//0.05;

        var zhongCount = 0;
        for (var i = 0; i < cards.length; i++) {
            var _node = cardnode.clone();
            _node.visible = true;
            _node.setPosition(cc.p(cardnode.x + slotwith * i, cardnode.y));
            _Image_niao.addChild(_node);
            setCardSprite(_node, cards[i], 0);
            if(MjClient.getAppType() == MjClient.APP_TYPE.QXXXGHZ && tData.areaSelectMode.zhuaniao == 1){   //一鸟全中
                zhongCount++;
                _node.setColor(cc.color(255,255,255));
            }else{
                if (cards[i] == 31 || cards[i] == 71 ||
                    (cards[i] <= 29 && cards[i] % 10 == 1 || cards[i] % 10 == 5 || cards[i] % 10 == 9)) {
                    zhongCount++;
                } else {
                    _node.setColor(cc.color(170, 170, 170));
                }
            }
        }

        if (zhongCount == 0) {
            countNode.setVisible(false);
        }
        else {
            var pos = cc.p(cardnode.x + slotwith * cards.length - slotwith / 2, cardnode.y);
            countNode.setPosition(pos);
            countNode.setString("+" + zhongCount);

            if (cards.length >= 6) {
                var shareBtn = _back.getChildByName("share");
                var sharePos = shareBtn.getPosition();
                shareBtn.setPosition(cc.p(sharePos.x + 50, sharePos.y));
                var readyBtn = _back.getChildByName("ready");
                var readyPos = readyBtn.getPosition();
                readyBtn.setPosition(cc.p(readyPos.x + 50, readyPos.y));
            }
        }

        return true;
    }
});

