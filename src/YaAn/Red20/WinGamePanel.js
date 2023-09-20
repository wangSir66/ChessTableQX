

function SetEndOneUserUI_Red20(node, off) {
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var pl = MjClient.getPlayerByIndex(off);
    node.setVisible(false);
    if (!pl) return;
    node.setVisible(true);
    setUserOfflineWinGamePanel(node, pl);
    node = node.getChildByName("head");
    var zhuangNode = node.getChildByName("zhuang");
    var tempZhuang = (typeof MjClient.preZhuang != 'undefined') ? MjClient.preZhuang : tData.zhuang;
    zhuangNode.setVisible(tData.uids[tempZhuang] == pl.info.uid);
    zhuangNode.zIndex = 10;

    //add by sking
    var name = node.getChildByName("name");
    name.ignoreContentAdaptWithSize(true);

    result = tData.Result;
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
        },
        hand: {
            _run: function () {
                for (let _j = 0; _j < this.children.length; _j++) {
                    const c = this.children[_j];
                    if (c.name != 'stand') {
                        c.removeFromParent(true);
                        _j--;
                    } else c.visible = false;
                }
                let newCards = [].concat(pl.mjhand);
                if (result && pl.info.uid === result.Winner && result.Card) {
                    let huCard = newCards.find(val => {
                        return val === result.Card;
                    })
                    if (!huCard) {
                        newCards.push(result.Card);
                    }
                }
                for (let _i = 0; _i < newCards.length; _i++) {
                    const cd = newCards[_i];
                    getNewCard(this, 'stand', 'handEnd', cd);
                }
                MjClient.endoneui.CardLayoutRestore(this, newCards);
            }
        },
        weaves: {
            _run: function () {
                for (let _j = 0; _j < this.children.length; _j++) {
                    const c = this.children[_j];
                    if (c.name != 'stand') {
                        c.removeFromParent(true);
                        _j--;
                    } else c.visible = false;
                }
                let Wang7 = [], Wang = [];
                for (let _i = 0; _i < pl.touCardList.length; _i++) {
                    Wang7 = Wang7.concat(pl.touCardList[_i].filter(card => MjClient.majiang.getCardNum(card) === 7));
                    Wang = Wang.concat(pl.touCardList[_i].filter(card => MjClient.majiang.getCardColor(card) === 4));
                }
                let AddWeaves = (cards, name) => {
                    const nameAr = ['gang0', 'gang1', 'chi', 'peng', 'anpeng', 'wang', '7ToWang'], wangCards = [];
                    this.children.forEach(child => {
                        if (nameAr.indexOf(child.name) > -1) wangCards.push(child);
                    });
                    let d = this.getChildByName('stand'),
                        sn = wangCards.length > 0 ? wangCards.sort((a, b) => b.x - a.x)[0] : d;
                    for (let _i = 0; _i < cards.length; _i++) {
                        let child = getNewCard(this, "stand", name, cards[_i]),
                            pos = cc.p(sn.x + Red20Space.weavs[0].x + (wangCards.length > 0 ? child.getSize().width * child.scale : 0), d.y + child.getSize().width * child.scale * 0.5 * _i);
                        child.setPosition(pos);
                        child.visible = true
                        child.zIndex = 20 - _i;
                    }
                }
                Wang.length > 0 && AddWeaves(Wang, 'wang');
                Wang7.length > 0 && AddWeaves(Wang7, '7ToWang');
                pl.mjanpeng.map(m => { AddWeaves(m, 'anpeng'); });
                pl.mjpeng.map(m => { AddWeaves(m, 'peng'); });
                pl.mjchi.map(m => { AddWeaves(m, 'chi'); });
                pl.mjgang0.map(m => { AddWeaves(m, 'gang0'); });
                pl.mjgang1.map(m => { AddWeaves(m, 'gang1'); });
                MjClient.endoneui.CardLayoutRestore(this, pl.mjhand);
            }
        },
        huCard: {
            _run: function () {
                if (result && pl.info.uid === result.Winner) {
                    //胡牌取手牌最后一张
                    let huCardData = result.Card;
                    if (result.Winner !== null && !huCardData) {
                        let cards = pl.mjhand;
                        huCardData = cards[cards.length - 1];
                    }
                    setCardSprite(this, huCardData);
                    this.visible = true;
                } else this.visible = false;
            }
        },
        score: {
            _run: function () {
                this.setString(pl.winone + '');
            }
        },
        scrollview: {
            item: {
                _visible: false
            },
            _run: function () {
                this.setScrollBarEnabled(false);
                const _indx = tData.uids.indexOf(pl.info.uid),
                    other = result ? result.Other[_indx] : [],
                    base = result ? result.Base[_indx] : [];
                let baseData = null;
                if (base.length > 0) {
                    baseData = base;
                } else {
                    let arr = [], str = [];
                    let pengLen = pl.mjpeng.length + pl.mjanpeng.length;
                    let gangLen = pl.mjgang0.length + pl.mjgang1.length;
                    pl.touCardList.map(t => {
                        t.map(t1 => {
                            arr.push(t1);
                        })
                    })
                    if (arr.length > 0) str.push(['王', arr.length]);
                    if (pengLen > 0) str.push(['碰', pengLen]);
                    //杠是2番
                    if (gangLen > 0) str.push(['杠', gangLen * 2]);
                    baseData = str;
                }
                //番型
                let fan = 0, str = "";
                baseData.forEach(value => {
                    fan += value[1];
                    if (value[0] === '杠') {
                        str += (value[1] / 2 + "" + value[0]);
                    } else {
                        str += (value[1] + "" + value[0]);
                    }
                })
                this.parent.getChildByName('base').setString(str);
                let itemLB = this.getChildByName('item');
                for (let _i = 0; _i < other.length; _i++) {
                    const o = other[_i];
                    if (!o) continue;
                    fan += o[1];
                    let itl = itemLB.clone();
                    itl.setString(o[0] + "");
                    this.addChild(itl);
                    itl.visible = true;
                }
                if (result && (result.Winner === pl.info.uid || result.Scores[_indx] > 0))
                    this.parent.getChildByName('fan').setString(fan > 0 ? fan + '' : '0');
                else this.parent.getChildByName('fan').setString('');
            }
        }
    }
    BindUiAndLogic(node.parent, uibind);
    addWxHeadToEndUI(uibind.head._node, off);
}


var EndOneView_Red20 = cc.Layer.extend({
    jsBind: {
        block: {
            _layout: [[1, 1], [0.5, 0.5], [0, 0], true]
        },
        back: {
            _layout: [[0.9, 0.9], [0.5, 0.5], [0, 0.08]],
            ready: {
                _run: function () {
                    if (MjClient.remoteCfg.guestLogin) {
                        setWgtLayout(this, [0.15, 0.15], [0.5, 0.085], [0, 0], false, true);
                    }
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    if (tData.fieldId) {
                        this.loadTextureNormal("gameOver/btn_again_n.png");
                        this.loadTexturePressed("gameOver/btn_again_s.png");
                        this.loadTextureDisabled("gameOver/btn_again_s.png");
                    }
                },
                _click: function (btn, eT) {
                    MjClient.endoneui.nextStartGame();
                },
                _visible: function () {
                    var tData = MjClient.data.sData.tData;
                    return !tData.matchId;
                }
            },
            title:
            {
                _visible: true,
            },
            head0: {
                head: { zhuang: { _visible: false } },
                hand: { stand: { _visible: false } },
                weaves: { stand: { _visible: false } },
                huCard: { _visible: false },
                scrollview: { _visible: true, item: { _visible: false } },
                fan: { _visible: true },
                score: { _visible: true },
                base: { _visible: true },
                _run: function () { SetEndOneUserUI_Red20(this, 0); },

            },
            head1: {
                head: { zhuang: { _visible: false } },
                hand: { stand: { _visible: false } },
                weaves: { stand: { _visible: false } },
                huCard: { _visible: false },
                scrollview: { _visible: true, item: { _visible: false } },
                fan: { _visible: true },
                score: { _visible: true },
                base: { _visible: true },
                _run: function () { SetEndOneUserUI_Red20(this, 1); }
            },
            head2: {
                head: { zhuang: { _visible: false } },
                hand: { stand: { _visible: false } },
                weaves: { stand: { _visible: false } },
                huCard: { _visible: false },
                scrollview: { _visible: true, item: { _visible: false } },
                fan: { _visible: true },
                score: { _visible: true },
                base: { _visible: true },
                _run: function () { SetEndOneUserUI_Red20(this, 2); }
            },
            head3: {
                head: { zhuang: { _visible: false } },
                hand: { stand: { _visible: false } },
                weaves: { stand: { _visible: false } },
                huCard: { _visible: false },
                scrollview: { _visible: true, item: { _visible: false } },
                fan: { _visible: true },
                score: { _visible: true },
                base: { _visible: true },
                _run: function () { SetEndOneUserUI_Red20(this, 3); }
            },
            fanghao: {
                _visible: true,
                _run: function () { }
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
    ctor: function () {
        this._super();
        MjClient.endoneui = this;
        var endoneui = ccs.load(res.EndOne_Red20_json);
        BindUiAndLogic(endoneui.node, this.jsBind);
        this.addChild(endoneui.node);

        //时间
        var _back = endoneui.node.getChildByName("back");
        var fanghao = _back.getChildByName("fanghao");
        fanghao.visible = true;
        fanghao.setString(MjClient.data.sData.tData.tableid);
        changeMJBg(this, getCurrentMJBgType());
        return true;
    },
    CardLayoutRestore: function (node, handCards) {
        let uistand = [];
        for (var i = 0; i < node.children.length; i++) //children 为 "down" 节点下的字节点
        {
            var ci = node.children[i];
            if (ci.name == "handEnd") uistand.push(ci);
        }
        //手牌
        if (uistand.length > 0) {
            //up--开始位置 stand--大小与距离。
            var start = node.getChildByName("stand");
            var upSize = start.getSize();
            var upS = start.scale;

            const hand = MjClient.majiang.StackCards(handCards);
            let c_of = null;
            for (let _i = 0; _i < hand.length; _i++) {
                const cs = hand[_i];
                cs.sort(function (a, b) {
                    return b - a;
                });
                let ar = [];
                for (let _j = 0; _j < cs.length; _j++) {
                    const c = cs[_j];
                    let ci = null;
                    for (let _k = 0; _k < uistand.length; _k++) {
                        const ui = uistand[_k];
                        if (ui.tag == c) {
                            ci = ui;
                            uistand.splice(_k, 1);
                            break;
                        }
                    }
                    if (ci) {
                        ar.push(ci);
                        if (_i == 0) {
                            ci.x = start.x + upSize.width * upS * 0.1;
                        } else if (_j != 0) {
                            ci.x = c_of;
                        } else {
                            ci.x = c_of + upSize.width * upS * 1;
                        }
                        if (_j == 0) c_of = ci.x;
                        ci.y = start.y + upSize.height * upS * 0.5 * _j;
                    }
                }
                if (ar.length > 1) {
                    ar.map((a, idx) => {
                        a.zIndex = ar.length - 1 - idx
                    })
                }
            }
        }
    },
    nextStartGame: function () {
        cc.log('--------下一局消息事件-----')
        var sData = MjClient.data.sData;
        var tData = sData.tData;
        if (!tData.fieldId) {
            postEvent("clearCardUI");
            MjClient.endoneui.removeFromParent(true);
            MjClient.endoneui = null;
        }
        reInitarrCardVisible();
        if (MjClient.rePlayVideo != -1 && MjClient.replayui) {
            MjClient.replayui.replayEnd();
        } else {
            if (tData.fieldId) {
                leaveGameClearUI();
                MjClient.Scene.addChild(new goldMatchingLayer({ matching: false, gameType: tData.gameType }));
                MjClient.goldfieldEnter(tData.fieldId, tData.gameType);
                return;
            } else {
                tData.roundNum <= 0 || MjClient.MJPass2NetForRed20();
            }
        }
        if (tData.roundNum <= 0) {
            postEvent("showEndRoom");
        }
    }
});

function GetDelUserInfo(off) {
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    if (tData.firstDel < 0) return null;
    var idx = (tData.uids.indexOf(tData.firstDel) + off) % tData.maxPlayer;
    return sData.players[tData.uids[idx] + ""];
}

// 新解散房间玩家信息设置
function DelRoomPlayerInfo(node, off, delPlayer) {
    var pl = GetDelUserInfo(off);
    if (!node) return;
    if (!pl) {
        node.setVisible(false);
        return;
    }
    node.setVisible(true);

    // 申请解散玩家显示
    if (delPlayer && off == 0) {
        node.setString("" + unescape(pl.info.nickname));
        node.setFontName("Arial");
        node.setFontSize(node.getFontSize());
        return;
    }

    var sData = MjClient.data.sData;
    var tData = sData.tData;

    var name = node.getChildByName("name");
    if (name) {
        name.ignoreContentAdaptWithSize(true);
        name.setFontName("Arial");
        name.setFontSize(name.getFontSize());
    } else {
        node.setString("玩家[" + getNewName(unescape(pl.info.nickname) + "") + "]申请解散房间");
    }
    var tipBgWait = node.getChildByName("tipBg_wait");
    if (tipBgWait) {
        tipBgWait.getChildByName("Text").ignoreContentAdaptWithSize(true);
    }
    var tipBgSure = node.getChildByName("tipBg_sure");
    if (tipBgSure)
        tipBgSure.getChildByName("Text").ignoreContentAdaptWithSize(true);

    var head = node.getChildByName("headImg");
    if (head) {
        // 显示玩家头像
        var url = pl.info.headimgurl;
        if (!url) url = "A_Common/default_headpic.png";
        cc.loader.loadImg(url, { isCrossOrigin: true }, function (err, texture) {
            if (!err && texture && cc.sys.isObjectValid(head)) {
                var clippingNode = new cc.ClippingNode();
                var maskImg = "home/zhezhao.png";
                var hideblockImg = "home/homeHeadCusPic.png";
                if (MjClient.getAppType() == MjClient.APP_TYPE.QXNTQP ||
                    MjClient.getAppType() == MjClient.APP_TYPE.QXHAIANMJ) {
                    maskImg = "home/zhezhao.png";
                    hideblockImg = "home/zhezhao_mask.png"
                }
                var mask = new cc.Sprite(maskImg);
                clippingNode.setAlphaThreshold(0);
                clippingNode.setStencil(mask);
                var img = new cc.Sprite(texture);
                img.setScale(mask.getContentSize().width / img.getContentSize().width);
                clippingNode.addChild(img);

                if (MjClient.getAppType() == MjClient.APP_TYPE.QXYZQP) {
                    clippingNode.setScale(0.95);
                    clippingNode.setPosition(head.getContentSize().width / 1.613, head.getContentSize().height / 1.9);
                }
                else {
                    clippingNode.setScale(0.97);
                    clippingNode.setPosition(head.getContentSize().width / 2, head.getContentSize().height / 2);
                }

                //遮罩框
                var hideblock = new cc.Sprite(hideblockImg);
                hideblock.setPosition(hideblock.getContentSize().width / 2, hideblock.getContentSize().height / 2);
                head.addChild(clippingNode);
                head.addChild(hideblock);
            }
        });
    }

    if (name) {
        name.setString(getNewName(unescape(pl.info.nickname) + ""));
        name.setFontName("Arial");
        name.setFontSize(name.getFontSize());
    }
    if (pl.delRoom > 0) // 同意
    {
        if (tipBgWait)
            tipBgWait.visible = false;
        if (tipBgSure)
            tipBgSure.visible = true;
    }
    else if (pl.delRoom == 0) // 等待选择
    {
        if (tipBgWait)
            tipBgWait.visible = true;
        if (tipBgSure)
            tipBgSure.visible = false;
    }
    else if (pl.delRoom < 0) // 拒绝
    {
        if (tipBgWait)
            tipBgWait.visible = false;
        if (tipBgSure)
            tipBgSure.visible = false;
    }
}
function showDelRoomCountdown_new(node) {

    var callback = function () {
        var sData = MjClient.data.sData;
        var tData = sData.tData;
        var time = sData.serverNow + Date.now();
        var needtime = tData.delEnd - time;
        var need_s = Math.floor((needtime / 1000) % 60);
        var need_m = Math.floor((needtime / 1000) / 60);
        if (need_s == 0 && need_m == 0) {
            node.stopAllActions();
        }
        node.setString("发起解散申请，牌桌将于(" + need_m + "分" + need_s + ")后自动解散");
    };
    node.x = node.getParent().width + 10;
    node.runAction(cc.repeatForever(cc.sequence(cc.callFunc(callback), cc.delayTime(1.0))));
}
function DelRoomConsent(node, off) {
    var pl = GetDelUserInfo(off);
    if (!pl) return;
    if (!node) return;
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    node.setFontName("Arial");
    node.setFontSize(node.getFontSize());
    if (off == 0) {
        node.setString("玩家[" + unescape(pl.info.nickname) + "]申请解散房间");
    }
    else {
        if (pl.delRoom > 0) {
            node.setString("玩家[" + unescape(pl.info.nickname) + "]同意");
        }
        else if (pl.delRoom == 0) {
            node.setString("玩家[" + unescape(pl.info.nickname) + "]等待选择");
        }
        else if (pl.delRoom < 0) {
            node.setString("玩家[" + unescape(pl.info.nickname) + "]拒绝");
        }
    }
}
function setDelRoomVisible(node) {
    var pl = getUIPlayer(0);
    node.visible = pl.delRoom == 0;
}

function showDelRoomCountdown(node) {

    var callback = function () {
        var sData = MjClient.data.sData;
        var tData = sData.tData;
        var time = sData.serverNow + Date.now();
        var needtime = tData.delEnd - time;
        var need_s = Math.floor((needtime / 1000) % 60);
        var need_m = Math.floor((needtime / 1000) / 60);
        if (need_s == 0 && need_m == 0) {
            node.stopAllActions();
        }
        node.setString("在" + need_m + "分" + need_s + "之后将自动同意");
    };
    node.runAction(cc.repeatForever(cc.sequence(cc.callFunc(callback), cc.delayTime(1.0))));
}

function reInitarrCardVisible() {
    if (cc.sys.isObjectValid(MjClient.arrowbkNode) && MjClient.arrowbkNode.getParent()) {
        MjClient.arrowbkNode.setVisible(false);
    }

    if (cc.sys.isObjectValid(MjClient.arrowbk3DNode) && MjClient.arrowbk3DNode.getParent()) {
        MjClient.arrowbk3DNode.setVisible(false);
    }

    if (cc.sys.isObjectValid(MjClient.roundnumImgNode) && MjClient.roundnumImgNode.getParent()) {
        MjClient.roundnumImgNode.setVisible(false);
    }
    if (cc.sys.isObjectValid(MjClient.cardNumImgNode) && MjClient.cardNumImgNode.getParent()) {
        MjClient.cardNumImgNode.setVisible(false);
    }
}

function addWxHeadToEndUI(node, off) {
    var pl = MjClient.getPlayerByIndex(off);
    var img = "A_Common/default_headpic.png";
    //if(pl && pl.wxHeadImg)
    //{
    //	img = pl.wxHeadImg;
    //}
    //else
    //{
    //	return;
    //}

    if (pl && pl.info.headimgurl) {
        cc.loader.loadImg(pl.info.headimgurl, { isCrossOrigin: true }, function (err, texture) {
            if (!err && texture) {
                img = texture;
            }
        });
    }
    else {
        return;
    }

    var sp = new cc.Sprite(img);
    node.addChild(sp);
    var frame = node.getChildByName("frame");
    if (frame) {
        frame.zIndex = sp.zIndex + 1;
    }
    setWgtLayout(sp, [0.88, 0.88], [0.5, 0.5], [0, 0], false, true);
}

(function () {


    //申请解散房间
    RemoveRoomView = cc.Layer.extend({
        jsBind: {
            back: {
                player0:
                {
                    _event: { DelRoom: function () { DelRoomConsent(this, 0); } }
                },
                player1: {
                    _event: { DelRoom: function () { DelRoomConsent(this, 1); } }
                },
                player2: {
                    _event: { DelRoom: function () { DelRoomConsent(this, 2); } }
                },
                player3: {
                    //_run:function(){ DelRoomConsent(this,3);  },
                    _event: { DelRoom: function () { DelRoomConsent(this, 3); } }
                },
                player4: {
                    _event: { DelRoom: function () { DelRoomConsent(this, 4); } }
                },
                yes: {
                    _event: { DelRoom: function () { setDelRoomVisible(this); } }
                },
                no: {
                    _event: { DelRoom: function () { setDelRoomVisible(this); } }
                }
            },
            _event: {
                endRoom: function () { MjClient.delroomui.removeFromParent(true); delete MjClient.delroomui; },
                roundEnd: function () { MjClient.delroomui.removeFromParent(true); delete MjClient.delroomui; },
                LeaveGame: function () { MjClient.delroomui.removeFromParent(true); delete MjClient.delroomui; }
            }
        },
        ctor: function () {
            this._super();
            var delroomui = ccs.load("DelRoom.json");
            BindUiAndLogic(delroomui.node, this.jsBind);
            this.addChild(delroomui.node);
            MjClient.delroomui = this;
            dismissTipInRedPackageRoom();
            /*
                changed by sking
            */
            var _block = delroomui.node.getChildByName("block");
            setWgtLayout(_block, [1, 1], [0.5, 0.5], [0, 0], true);

            var _back = delroomui.node.getChildByName("back");
            setWgtLayout(_back, [0.6, 0.75], [0.5, 0.5], [0, 0]);

            var _player0 = _back.getChildByName("player0");
            DelRoomConsent(_player0, 0);
            _player0.ignoreContentAdaptWithSize(true);

            var _player1 = _back.getChildByName("player1");
            DelRoomConsent(_player1, 1);
            _player1.ignoreContentAdaptWithSize(true);

            var _player2 = _back.getChildByName("player2");
            DelRoomConsent(_player2, 2);
            _player2.ignoreContentAdaptWithSize(true);

            var _player3 = _back.getChildByName("player3");
            DelRoomConsent(_player3, 3);
            _player3.ignoreContentAdaptWithSize(true);

            var _player4 = _back.getChildByName("player4");
            if (_player4) {
                DelRoomConsent(_player4, 4);
                _player4.ignoreContentAdaptWithSize(true);
            }
            if (MjClient.data.sData.tData.maxPlayer == 2) {
                _player3.visible = false;
                if (_player4) {
                    _player4.visible = false;
                }
            } else if (MjClient.data.sData.tData.maxPlayer == 3 && _player4) {
                _player4.visible = false;
            }

            var _time = _back.getChildByName("time");
            showDelRoomCountdown(_time);

            //确定解散
            var _yes = _back.getChildByName("yes");
            setDelRoomVisible(_yes);
            _yes.addTouchEventListener(function (sender, Type) {
                switch (Type) {
                    case ccui.Widget.TOUCH_ENDED:
                        MjClient.delRoom(true);
                        break;
                    default:
                        break;
                }
            }, this);

            //取消
            var _no = _back.getChildByName("no");
            setDelRoomVisible(_no);
            _no.addTouchEventListener(function (sender, Type) {
                switch (Type) {
                    case ccui.Widget.TOUCH_ENDED:
                        MjClient.delRoom(false);
                        break;
                    default:
                        break;
                }
            }, this);


            return true;
        }
    });

    //新版申请解散房间
    RemoveRoomView_new = cc.Layer.extend({
        jsBind: {
            back: {
                player0:
                {
                    _event: { DelRoom: function () { DelRoomPlayerInfo(this, 0, true); } }
                },
                yes: {
                    _event: { DelRoom: function () { setDelRoomVisible(this); } }
                },
                no: {
                    _event: { DelRoom: function () { setDelRoomVisible(this); } }
                },
                item: {
                    _visible: false
                },
            },
            _event: {
                endRoom: function () { MjClient.delroomui.removeFromParent(true); delete MjClient.delroomui; },
                roundEnd: function () { MjClient.delroomui.removeFromParent(true); delete MjClient.delroomui; },
                LeaveGame: function () { MjClient.delroomui.removeFromParent(true); delete MjClient.delroomui; }
            }
        },
        ctor: function () {
            this._super();
            var delroomui = ccs.load("DelRoom.json");
            BindUiAndLogic(delroomui.node, this.jsBind);
            this.addChild(delroomui.node);
            MjClient.delroomui = this;

            dismissTipInRedPackageRoom();
            /*
                changed by sking
            */
            var _block = delroomui.node.getChildByName("block");
            setWgtLayout(_block, [1, 1], [0.5, 0.5], [0, 0], true);

            var _back = delroomui.node.getChildByName("back");
            if (MjClient.getAppType() == MjClient.APP_TYPE.QXNTQP) {
                setWgtLayout(_back, [0.65, 0.65], [0.5, 0.5], [0, 0]);
            }
            else {
                setWgtLayout(_back, [0.8, 0.8], [0.5, 0.5], [0, 0]);
            }

            if (MjClient.getAppType() == MjClient.APP_TYPE.QXNTQP ||
                MjClient.getAppType() == MjClient.APP_TYPE.QXHAIANMJ) {
                delroomui.node.getChildByName("back").getChildByName("DelRoom_title").setVisible(true);
                delroomui.node.getChildByName("back").getChildByName("hePai_title").setVisible(false);
            }

            var _player0 = _back.getChildByName("player0");
            DelRoomPlayerInfo(_player0, 0, true);
            _player0.ignoreContentAdaptWithSize(true);

            var listViewNode = _back.getChildByName("ListView");
            listViewNode.removeAllChildren();
            listViewNode.width = MjClient.data.sData.tData.maxPlayer * 168;
            var playerItem = listViewNode.getParent().getChildByName("item");
            for (var i = 0; i < MjClient.data.sData.tData.maxPlayer; i++) {
                var newitem = playerItem.clone();
                newitem.setName("item" + i);
                listViewNode.pushBackCustomItem(newitem);
                DelRoomPlayerInfo(newitem, i);
            }
            listViewNode.setScrollBarEnabled(false);

            var uibind = {
                item0: {
                    _event: { DelRoom: function () { DelRoomPlayerInfo(this, 0); } }
                },
                item1: {
                    _event: { DelRoom: function () { DelRoomPlayerInfo(this, 1); } }
                },
                item2: {
                    _event: { DelRoom: function () { DelRoomPlayerInfo(this, 2); } }
                },
                item3: {
                    _event: { DelRoom: function () { DelRoomPlayerInfo(this, 3); } }
                },
                item4: {
                    _event: { DelRoom: function () { DelRoomPlayerInfo(this, 4); } }
                },
            }
            BindUiAndLogic(listViewNode, uibind);

            var _time = _player0.getChildByName("time");
            _time.ignoreContentAdaptWithSize(true);
            showDelRoomCountdown_new(_time);

            //确定解散
            var _yes = _back.getChildByName("yes");
            setDelRoomVisible(_yes);
            _yes.addTouchEventListener(function (sender, Type) {
                switch (Type) {
                    case ccui.Widget.TOUCH_ENDED:
                        MjClient.delRoom(true);
                        MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Shezhi_Jiesanfangjian_Tongyii", { uid: SelfUid(), gameType: MjClient.gameType });

                        break;
                    default:
                        break;
                }
            }, this);

            //取消
            var _no = _back.getChildByName("no");
            setDelRoomVisible(_no);
            _no.addTouchEventListener(function (sender, Type) {
                switch (Type) {
                    case ccui.Widget.TOUCH_ENDED:
                        MjClient.delRoom(false);
                        MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Shezhi_Jiesanfangjian_Jujue", { uid: SelfUid(), gameType: MjClient.gameType });
                        break;
                    default:
                        break;
                }
            }, this);

            // UIEventBind(null, delroomui.node, "initSceneData", function (eD) {
            //     if(MjClient.delroomui){
            //         MjClient.delroomui.removeFromParent(true);
            //         delete MjClient.delroomui;
            //     }
            // });


            return true;
        }
    });

    // 晋中新解散房间
    if (MjClient.getAppType() === MjClient.APP_TYPE.TXJINZHONGMJ ||
        MjClient.getAppType() === MjClient.APP_TYPE.DQSHANXIMJ ||
        MjClient.getAppType() === MjClient.APP_TYPE.AYGUIZHOUMJ ||
        MjClient.getAppType() === MjClient.APP_TYPE.LYSICHUANMJ ||
        MjClient.getAppType() == MjClient.APP_TYPE.QXNTQP ||
        MjClient.getAppType() == MjClient.APP_TYPE.QXYZQP ||
        MjClient.getAppType() == MjClient.APP_TYPE.QXHAIANMJ) {
        RemoveRoomView = RemoveRoomView_new;
    }


    //房间已解散
    var endroomui;
    StopRoomView = cc.Layer.extend({

        ctor: function () {
            this._super();
            endroomui = ccs.load("EndRoom.json");
            //BindUiAndLogic(endroomui.node,this.jsBind);
            this.addChild(endroomui.node);

            /*
                changed by sking
            */
            var _block = endroomui.node.getChildByName("block");
            setWgtLayout(_block, [1, 1], [0.5, 0.5], [0, 0], true);

            var _back = endroomui.node.getChildByName("back");
            setWgtLayout(_back, [0.6, 0.75], [0.5, 0.5], [0, 0]);
            //返回大厅
            var _toHome = _back.getChildByName("tohome");
            _toHome.addTouchEventListener(function (sender, Type) {
                switch (Type) {
                    case ccui.Widget.TOUCH_ENDED:
                        var msg = MjClient.endRoomMsg;
                        if (msg.reason >= 0) {
                            MjClient.leaveGame();
                        }

                        if (cc.sys.isObjectValid(endroomui)) {
                            endroomui.removeFromParent(true);
                        }

                        //if (MjClient.getAppType() == MjClient.APP_TYPE.QXXZMJ ||
                        //	MjClient.getAppType() == MjClient.APP_TYPE.QXYZQP)
                        //{
                        //	if (!MjClient.enterui && !MjClient.FriendCard_main_ui)
                        //    	MjClient.Scene.addChild(new EnterRoomLayer());
                        //}
                        break;
                    default:
                        break;
                }
            }, this);

            //文字信息
            var _info = _back.getChildByName("info");
            function _setInfo() {
                var msg = MjClient.endRoomMsg;
                if (msg.reason == 0) {
                    if (MjClient.remoteCfg.hideMoney) return "还没有开始打牌";
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    if (tData.uids[0] == SelfUid()) {
                        var str = "游戏未开始，解散房间将不会扣除元宝";
                        if (MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ) {
                            str = "游戏未开始，解散房间将不会扣除元宝";
                        }
                        return str;
                    }
                    return "房间已被" + GetNameByUid([tData.uids[0]]) + "解散,请重新加入游戏";
                } else if (msg.reason == 1) {
                    return "解散房间申请超时";
                } else if (msg.reason == 2) {
                    return "玩家 " + GetNameByUid(msg.yesuid) + " 同意解散房间";
                } else if (msg.reason == 3) {
                    return "   房间已被" + unescape(msg.disbander.nickname) + "（" + msg.disbander.uid + "）解散，如有疑问请截图询问会长或管理员。";
                } else if (msg.reason == 4) {
                    if (msg.disbander) {
                        return "   房间已被" + unescape(msg.disbander.nickname) + "（" + msg.disbander.uid + "）解散";
                    } else {
                        return "           房间已被房主解散";
                    }
                } else if (msg.reason == 5) {
                    return "           房间已被系统解散";
                }
            }
            _info.setString(_setInfo());
            // 岳阳去掉文字空格
            if (MjClient.APP_TYPE.QXYYQP == MjClient.getAppType() ||
                MjClient.getAppType() == MjClient.APP_TYPE.HUBEIMJ ||
                MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ ||
                MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ ||
                MjClient.APP_TYPE.BDHYZP == MjClient.getAppType()) {
                _info.setString(_setInfo().trim());
            }
            endroomui = this;
            if (MjClient.webViewLayer != null) {
                MjClient.webViewLayer.close();
            }
            if (cc.sys.isObjectValid(MjClient.playerChatLayer)) {
                MjClient.playerChatLayer.removeFromParent(true);
                delete MjClient.playerChatLayer;
            }
            if (cc.sys.isObjectValid(MjClient.setui)) {
                MjClient.setui.removeFromParent(true);
                delete MjClient.setui;
            }

            return true;
        }
    });


})();
