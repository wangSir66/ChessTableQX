// 溆浦跑胡子
var playPanel_xuPuPaoHuZi = playLayer_ziPai.extend({
    ctor: function() {
        this._super("Play_xuPuPaoHuZi.json");
        MjClient.playui.jsBind._node.addChild(new roundRule_ziPai(roundRule_ziPai.getRoundRules()));
    },
    getJsBind: function() {
        var jsBind = {
            text_roundInfo: {
                _run: function () {
                    this.visible = false;
                },
            },
            img_gameName: {
                _layout: [[199/1280, 0], [0.5, 0.83], [0, 0]],
            },
            img_banner: {
                btn_setting: {
                    _click: function() {
                        MjClient.Scene.addChild(new setting_xuPuPaoHuZi(), 6000);
                        MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Shezhi", {uid:SelfUid(),gameType:MjClient.gameType});
                    }
                },
                btn_changeBg: {
                    _run: function () {
                        this.loadTextureNormal("playing/ziPaiBanner/wenhao.png");
                        this.setContentSize(this.getNormalTextureSize());
                    },
                    _click: function () {
                        postEvent("EZP_rule");
                    }
                },
            },
            img_cutLine: {
                _event: {
                    HZNewCard: function() {
                        MjClient.playui.checkCutLineVisible(this);
                    },
                    MJGuChou: function() {
                        MjClient.playui.checkCutLineVisible(this);
                    }
                },
            },
            layout_cardNum: {
                _layout: [[115/1280, 0], [0.5, 0.7], [0, 0]],
                img_card: {
                    _run:function() {
                        this.loadTexture("playing/paohuzi/paidui.png");
                        this.scale = 0.6;
                        this.refreshCardsTotal = function(isRemove) {
                            var sData = MjClient.data.sData;
                            var tData = sData.tData;
                            var maiPai = (tData.maxPlayer == 2) ? tData.areaSelectMode.maiPaiNum : 0;
                            var next = MjClient.majiang.getAllCardsTotal() - tData.cardNext;
                            if(next <= 0) {
                                this.visible = false; 
                            }
                            else {
                                this.visible = true;
                                if(isRemove) {
                                    var children = this.getChildren();
                                    var childNum = this.getChildrenCount();
                                    if(childNum > 0 && childNum + 1 > next && next < 20) {
                                        //少于20张时开始减高度
                                        children[childNum - 1].removeFromParent(true);
                                    }
                                }
                                else {
                                    this.removeAllChildren();
                                    next = next > 20 ? 20 : next;
                                    var xGap = 1;
                                    for(var i = 1; i <= next; i++) {
                                        var child = ccui.ImageView("playing/paohuzi/paidui.png");
                                        child.setPosition(cc.p(this.width/2 - xGap * i, this.height/2));
                                        this.addChild(child);
                                    }
                                }
                            }
                        }
                    },
                    _event: {
                        initSceneData: function() {
                            this.refreshCardsTotal();
                            this.getParent().getChildByName("text_cardNum").refreshText();
                        },
                        mjhand: function() {
                            this.refreshCardsTotal();
                            this.getParent().getChildByName("text_cardNum").refreshText();
                        }
                    }
                },
                text_cardNum: {
                    _run: function() {
                        this.ignoreContentAdaptWithSize(true);
                        this.refreshText = function() {
                            var tData = MjClient.data.sData.tData;
                            if (tData) {
                                this.setString(MjClient.majiang.getAllCardsTotal() - tData.cardNext);
                            }

                            var img_card = this.getParent().getChildByName("img_card");
                            this.y = this.getParent().height / 2;
                        };
                        this.refreshText();
                    },
                },
            },
            node_jiaChui: {
                _event: {
                    initSceneData: function() {
                        this.visible = false;
                        var pl = MjClient.playui.getUIPlayer(0);
                        var tData = MjClient.data.sData.tData;
                        if (tData.tState == TableState.waitJiazhu && pl.jiachuiNum == -1) {
                            this.visible = true;
                        }
                    },
                    waitJiazhu: function() {
                        this.visible = true;
                    },
                    MJJiazhu: function() {
                        var pl = MjClient.playui.getUIPlayer(0);
                        if (pl.jiachuiNum != -1) {
                            this.visible = false;
                        }
                    }
                },
                btn_buchong: {
                    _layout: [
                        [0.12, 0.12],
                        [0.2, 0.4],
                        [0, 0]
                    ],
                    _click: function(btn) {
                        MjClient.gamenet.request("pkroom.handler.tableMsg", {
                            cmd: "MJJiazhu",
                            jiachuiNum: 0,
                        });
                    }
                },
                btn_chong1: {
                    _layout: [
                        [0.12, 0.12],
                        [0.4, 0.4],
                        [0, 0]
                    ],
                    _click: function(btn) {
                        MjClient.gamenet.request("pkroom.handler.tableMsg", {
                            cmd: "MJJiazhu",
                            jiachuiNum: 1,
                        });
                    }
                },
                btn_chong2: {
                    _layout: [
                        [0.12, 0.12],
                        [0.6, 0.4],
                        [0, 0]
                    ],
                    _click: function(btn) {
                        MjClient.gamenet.request("pkroom.handler.tableMsg", {
                            cmd: "MJJiazhu",
                            jiachuiNum: 2,
                        });
                    }
                },
                btn_chong3: {
                    _layout: [
                        [0.12, 0.12],
                        [0.8, 0.4],
                        [0, 0]
                    ],
                    _click: function(btn) {
                        MjClient.gamenet.request("pkroom.handler.tableMsg", {
                            cmd: "MJJiazhu",
                            jiachuiNum: 3,
                        });
                    }
                }
            },
            node_left:{
                layout_eatDisplay: {
                    _layout: [[0.12, 0.12], [0.04, 0.93], [0, 0]],
                },
                layout_head: {
                    _layout: [[0.1, 0.1], [0.06, 0.9], [0, 0], true],
                    img_jiachuiText : {
                        _run:function() {
                            MjClient.playui.checkChuiStateVisible(this);
                        },
                        _event:{
                            initSceneData: function() {
                                MjClient.playui.checkChuiStateVisible(this);
                            },
                            MJJiazhu: function() {
                                MjClient.playui.checkChuiStateVisible(this);
                            },
                            mjhand: function() {
                                this.visible = false;
                            }
                        }
                    },
                    img_guChou: {
                        _run:function() {
                            this.visible = false;
                        },
                        _event: {
                            initSceneData: function() {
                                MjClient.playui.checkGuChouVisible(this);
                            },
                            MJGuChou: function() {
                                MjClient.playui.checkGuChouVisible(this);
                            },
                            mjhand: function() {
                                this.visible = false;
                            },
                            onlinePlayer: function() {
                                if (MjClient.playui.isInPlay()) {
                                    MjClient.playui.checkGuChouVisible(this);
                                } else {
                                    this.visible = false;
                                } 
                            }
                        }
                    }
                },
                img_putCard: {
                    _layout: [[120/1280, 0], [0.2, 0.75], [0, 0]],
                    img_di: {
                        _visible: false,
                        _event: {
                            HZNewCard: function() {
                                MjClient.playui.checkCardDiFlagVisible(this);
                            },
                            MJPut: function(msg) {
                                MjClient.playui.checkCardDiFlagVisible(this, msg);
                            }
                        }
                    }
                },
            },
            node_right:{
                layout_eatDisplay: {
                    _layout: [[0.12, 0.12], [0.95, 0.91], [0, 0]],
                },
                layout_head: {
                    _layout: [[0.1, 0.1], [0.94, 0.87], [0, 0], true],
                    img_jiachuiText : {
                        _run:function() {
                            MjClient.playui.checkChuiStateVisible(this);
                        },
                        _event:{
                            initSceneData: function() {
                                MjClient.playui.checkChuiStateVisible(this);
                            },
                            MJJiazhu: function() {
                                MjClient.playui.checkChuiStateVisible(this);
                            },
                            mjhand: function() {
                                this.visible = false;
                            }
                        }
                    },
                    img_guChou: {
                        _run:function() {
                            this.visible = false;
                        },
                        _event: {
                            initSceneData: function() {
                                MjClient.playui.checkGuChouVisible(this);
                            },
                            MJGuChou: function() {
                                MjClient.playui.checkGuChouVisible(this);
                            },
                            mjhand: function() {
                                this.visible = false;
                            },
                            onlinePlayer: function() {
                                if (MjClient.playui.isInPlay()) {
                                    MjClient.playui.checkGuChouVisible(this);
                                } else {
                                    this.visible = false;
                                } 
                            }
                        }
                    }
                },
                img_putCard: {
                    _layout: [[120/1280, 0], [0.73, 0.75], [0, 0]],
                    img_di: {
                        _visible: false,
                        _event: {
                            HZNewCard: function() {
                                MjClient.playui.checkCardDiFlagVisible(this);
                            },
                            MJPut: function(msg) {
                                MjClient.playui.checkCardDiFlagVisible(this, msg);
                            }
                        }
                    }
                }
            },
            node_down:{
                layout_eatDisplay: {
                    _layout: [[0.12, 0.12], [0.5, 0.45], [0, 0]],
                },
                img_putCard: {
                    _layout: [[120/1280, 0], [0.65, 0.6], [0, 0]],
                    img_di: {
                        _visible: false,
                        _event: {
                            HZNewCard: function() {
                                MjClient.playui.checkCardDiFlagVisible(this);
                            },
                            MJPut: function(msg) {
                                MjClient.playui.checkCardDiFlagVisible(this, msg);
                            }
                        }
                    }
                },
                layout_head: {
                    _layout: [[0.1, 0.1], [0.06, 0.05], [0, 0], true],
                    img_jiachuiText : {
                        _run:function() {
                            MjClient.playui.checkChuiStateVisible(this);
                        },
                        _event:{
                            initSceneData: function() {
                                MjClient.playui.checkChuiStateVisible(this);
                            },
                            MJJiazhu: function() {
                                MjClient.playui.checkChuiStateVisible(this);
                            },
                            mjhand: function() {
                                this.visible = false;
                            }
                        }
                    },
                    img_guChou: {
                        _run:function() {
                            this.visible = false;
                        },
                        _event: {
                            initSceneData: function() {
                                MjClient.playui.checkGuChouVisible(this);
                            },
                            MJGuChou: function() {
                                MjClient.playui.checkGuChouVisible(this);
                            },
                            mjhand: function() {
                                this.visible = false;
                            },
                            onlinePlayer: function() {
                                if (MjClient.playui.isInPlay()) {
                                    MjClient.playui.checkGuChouVisible(this);
                                } else {
                                    this.visible = false;
                                } 
                            }
                        }
                    }
                },
                _event: {
                    //溆浦跑胡子每套牌大小不一样，所以切换牌时需要重设尺寸
                    EZP_cardType: function(eD) {
                        MjClient.playui.changeHandCardSize(this.getChildByName("img_handCard"));
                        var layoutHand = this.getChildByName("layout_handCards");
                        if (layoutHand) {
                            layoutHand.removeAllChildren();
                        }
                        MjClient.playui.refreshHandCard(0);
                        MjClient.playui.changeCardFrame(this, eD.type);
                    }
                }
            },
            node_xing:{
                layout_eatDisplay: {
                    _layout: [[0.12, 0.12], [0.95, 0.10], [0, 0]],
                },
                layout_head: {
                    _layout: [[0.1, 0.1], [0.94, 0.05], [0, 0], true],
                    img_jiachuiText : {
                        _run:function() {
                            MjClient.playui.checkChuiStateVisible(this);
                        },
                        _event:{
                            initSceneData: function() {
                                MjClient.playui.checkChuiStateVisible(this);
                            },
                            MJJiazhu: function() {
                                MjClient.playui.checkChuiStateVisible(this);
                            },
                            mjhand: function() {
                                this.visible = false;
                            }
                        }
                    },
                    img_guChou: {
                        _run:function() {
                            this.visible = false;
                        },
                        _event: {
                            initSceneData: function() {
                                MjClient.playui.checkGuChouVisible(this);
                            },
                            MJGuChou: function() {
                                MjClient.playui.checkGuChouVisible(this);
                            },
                            mjhand: function() {
                                this.visible = false;
                            },
                            onlinePlayer: function() {
                                if (MjClient.playui.isInPlay()) {
                                    MjClient.playui.checkGuChouVisible(this);
                                } else {
                                    this.visible = false;
                                } 
                            }
                        }
                    }
                },
                img_putCard: {
                    _layout: [[86/1280, 0], [0.73, 0.6], [0, 0]],
                    img_di: {
                        _visible: false,
                        _event: {
                            HZNewCard: function() {
                                MjClient.playui.checkCardDiFlagVisible(this);
                            },
                            MJPut: function(msg) {
                                MjClient.playui.checkCardDiFlagVisible(this, msg);
                            }
                        }
                    }
                }
            },
            btn_guChou: {
                _layout: [[147/1280, 0], [0.9315, 0.3], [0, 0]],
                _run:function() {
                    this.visible = true;
                },
                _event: {
                    initSceneData: function() {
                        if (!MjClient.playui.isInPlay()) {
                            this.visible = false;
                            return;
                        }
                        var pl = MjClient.playui.getUIPlayer(0);
                        this.visible = !pl.isGuChou;
                    },
                    mjhand: function() {
                        this.visible = true;
                    },
                    MJGuChou: function(d) {
                        if (!d || d.uid != SelfUid()) {
                            return;
                        }
                        this.visible = !d.isGuChou;
                        postEvent("showTingStats", {});
                    },
                    /*
                    roundEnd: function() {
                        this.visible = false;
                    }
                    */
                    clearCardUI: function() {
                        this.visible = false;
                    }
                },
                _click: function(btn) {
                    MjClient.showMsg("确定箍臭吗？", function() {
                        MjClient.gamenet.request("pkroom.handler.tableMsg", {
                            cmd: "MJGuChou"
                        });
                    }, function() {
                        return;
                    }, "1");
                    
                }
            },
            node_eatChoice: {
                btn_chi: {
                    _click: function() {
                        var getFastEatCard = function() {
                            if (MjClient.playui.getFastEatType()) {
                                // 快速吃牌
                                var sData = MjClient.data.sData;
                                var putCard = sData.tData.lastPutCard;
                                var pl = sData.players[SelfUid()];
                                var chiSet =MjClient.playui.getChiCards();
                                if (chiSet.length == 1) {
                                    var eatCards = chiSet[0];
                                    var copy = eatCards.slice();
                                    copy.splice(copy.indexOf(putCard), 1);
                                    var chiCards = MjClient.majiang.getSameCards(pl.mjhand, putCard);
                                    var copyCards = MjClient.majiang.getSameCards(copy, putCard);
                                    if (chiCards.length <= 0 || copyCards.length > 0) {
                                        return eatCards;
                                    }
                                }
                            }
                        };

                        var eatCards = getFastEatCard();
                        if (eatCards) {
                            MjClient.playui.commitEatCard(eatCards);
                        } else {
                            MjClient.playui.showSelectEatCards();
                        }
                    }
                },
            }
        }

        return jsBind;
    },
});

playPanel_xuPuPaoHuZi.prototype.checkCardDiFlagVisible = function(node, msg) {
    node.visible = false;
    var off = this.getUIOffByNode(node);
    if (!this.isCurPlayer(off)) {
        return;
    }
    if (msg && msg.putType != undefined) {
        node.visible = !!msg.putType;
    } else {
        node.visible = !!MjClient.data.sData.tData.putType;
    }
}

//Override
playPanel_xuPuPaoHuZi.prototype.checkChuiFlagVisible = function(node) {
    var off = this.getUIOffByNode(node);
    var pl = this.getUIPlayer(off);
    var tData = MjClient.data.sData.tData;
    if (!pl || !tData.areaSelectMode.isJiaChui) {
        node.visible = false;
        return;
    }

    node.visible = true;
    if (pl.jiachuiNum >= 0 ) {
        node.loadTexture("playing/paohuzi/img_chong" + pl.jiachuiNum + ".png");
    } else {
        node.visible = false;
    }
};

// 玩家点冲后展示状态
playPanel_xuPuPaoHuZi.prototype.checkChuiStateVisible = function(node) {
    var off = this.getUIOffByNode(node);
    node.visible = false;
    var tData = MjClient.data.sData.tData;
    var pl = this.getUIPlayer(off);
    if (!pl) {
        return;
    }
    if (tData.tState == TableState.waitJiazhu && pl.jiachuiNum >= 0) {
        node.loadTexture("playing/paohuzi/chong" + pl.jiachuiNum + ".png");
        node.visible = true;   
    }
}

// 玩家点箍臭后展示状态
playPanel_xuPuPaoHuZi.prototype.checkGuChouVisible = function(node) {
    var off = this.getUIOffByNode(node);
    node.visible = false;
    var tData = MjClient.data.sData.tData;
    var pl = this.getUIPlayer(off);
    if (!pl) {
        return;
    }
    node.visible = pl.isGuChou;
}

//Override
playPanel_xuPuPaoHuZi.prototype.createGameOverLayer = function(type) {
    return new GameOverLayer_syZiPai();
};

//Override
playPanel_xuPuPaoHuZi.prototype.createEndOneLayer = function(type) {
    return new EndOneView_xuPuPaoHuZi();
};

//Override
playPanel_xuPuPaoHuZi.prototype.getOtherEatCardArr = function(eatType, off, pos) {
    var pl = this.getUIPlayer(off);
    var eatAll = {
        mjpeng: pl.mjpeng,
        mjgang0: pl.mjgang0,
        mjwei: pl.mjwei,
        mjgang1: pl.mjgang1,
    };
    var eatArr = eatAll[eatType];
    var pos = typeof(pos) == "undefined" ? (eatArr.length - 1) : pos;
    if (eatType == 'mjpeng' || eatType == 'mjwei') {
        return [eatArr[pos]];
    }

    // 跑、提重新构造, 第一张是操作的牌
    var card = this.getEatCard(eatType, off, pos);
    var cards = [];
    if (card > 300) {
        cards.push(card, card - 200, card - 200, card);
    } else {
        cards.push(card, card, card + 200, card + 200);
    }
    return [cards];
};

playPanel_xuPuPaoHuZi.prototype.dislpayEatCardNode = function(eatCardNode, lastLineCount, isInit, eatType, off) {
    var layout_eatCards = this.getUINode(off).getChildByName("layout_eatCards");
    var point = this.getEatCardPoint(off);
    var targetY = point.y;
    var targetX = point.x + point.dx * lastLineCount * eatCardNode.cardWidth;
    if (!isInit && (eatType == "mjgang0" || eatType == "mjgang1")) {
        var card = MjClient.majiang.value(this.getEatCard(eatType, off));
        var children = layout_eatCards.children;
        for (var i = 0; i < children.length; i++) {
            var cardParent = children[i];
            if (MjClient.majiang.value(cardParent.children[0].tag) == card) {
                targetX = cardParent.targetX != undefined ? cardParent.targetX : cardParent.x;
                break;
            }
        }
    }

    eatCardNode.x = eatCardNode.targetX = targetX;
    eatCardNode.y = targetY;
    layout_eatCards.addChild(eatCardNode);

    if (!isInit) {
        var aniTime = this.getAniTimeByType("eat");
        if (this.isAniParallel()) { // 1段
            eatCardNode.x = targetX + point.dx * 3 * eatCardNode.cardWidth;
            eatCardNode.runAction(cc.moveTo(aniTime, targetX, targetY));
        } else { // 3段动画
            var card = eatCardNode.children[0];
            var targetScale = card.scale;
            for (var i = 0; i < eatCardNode.children.length; i++) {
                card = eatCardNode.children[i];
                card.scale = targetScale * 1.7;
                card.runAction(cc.scaleTo(aniTime[0], targetScale));
            }

            eatCardNode.x = point.x + point.dx * 7.5 * eatCardNode.cardWidth;
            var action = cc.sequence(
                cc.delayTime(aniTime[0] + aniTime[1]),
                cc.moveTo(aniTime[2], targetX, targetY).easing(cc.easeSineIn())
            );
            eatCardNode.runAction(action);
        }
    }
};

//Override
playPanel_xuPuPaoHuZi.prototype.removePengFromHand = function(cardArr, off) {
    for (var i = 1; i < 3; i++) {
        this.removeHandCard(cardArr[i], off);
    }
};

//Override
playPanel_xuPuPaoHuZi.prototype.removeGangFromHand = function(eatType, card, off) {
    // 构造张牌
    card = card > 300 ? card - 200 : card;
    var cards = [card, card, card + 200, card + 200];
    for (var i = 0; i < 4; i++) {
        this.removeHandCard(cards[i], off);
    }
};

//Override
playPanel_xuPuPaoHuZi.prototype.removeWeiFromHand = function(cardArr, msg, off) {
    for (var i = 1; i < 3; i++) {
        this.removeHandCard(cardArr[i], off);
    }
};

// 是否需要切牌动画
playPanel_xuPuPaoHuZi.prototype.isNeedShuffle = function() {
    return false;
};

//Override
playPanel_xuPuPaoHuZi.prototype.getOffYByCard = function(card){
    var factor = [2.4, 2, 2][this.getCardFontIdx()];
    return card.height * card.scaleY - card.height / factor * card.scaleY;
}

playPanel_xuPuPaoHuZi.prototype.isShowCardBack = function(msg) {
    var tData = MjClient.data.sData.tData;  
    return getOffByIndex(tData.curPlayer) != 0 && tData.putType==1 && tData.isLastDraw;
};

playPanel_xuPuPaoHuZi.prototype.changeLayout = function(uiNode) {
    var downNode = uiNode.getChildByName("node_down");
    var rightNode = uiNode.getChildByName("node_right");
    var leftNode = uiNode.getChildByName("node_left");

    var type = this.getLayoutType();
    // 间距
    var des = 0.005;

    var ipxSpace = isIPhoneX() ? 0.04 : 0; //ipx 增加间距
    if (type == 0) { //偏右
        var layoutOut = downNode.getChildByName("layout_outCards");
        setWgtLayout(layoutOut, [0.14, 0.14], [1 - des, des], [0, 0]);

        var layoutOut = leftNode.getChildByName("layout_outCards");
        setWgtLayout(layoutOut, [0.14, 0.14], [des + ipxSpace, 320 / 720], [0, 0]);

        var layoutOut = rightNode.getChildByName("layout_outCards");
        setWgtLayout(layoutOut, [0.14, 0.14], [1 - des, 320 / 720], [0, 0]);

        var layoutEat = downNode.getChildByName("layout_eatCards");
        var ipxPosY = isIPhoneX() ? 50 : 0; // 公用代码todo
        setWgtLayout(layoutEat, [0.14, 0.14], [533 / 1280, (330 + ipxPosY) / 720], [-0.2, 0]);
        var layoutEat = leftNode.getChildByName("layout_eatCards");
        setWgtLayout(layoutEat, [0.14, 0.14], [des + ipxSpace, 0.84], [0, 0]);

        var layoutEat = rightNode.getChildByName("layout_eatCards");
        setWgtLayout(layoutEat, [0.14, 0.14], [1 - des, 0.82], [0, 0]);
    } else { //传统
        var layoutOut = downNode.getChildByName("layout_outCards");
        setWgtLayout(layoutOut, [0.14, 0.14], [1 - des, des], [0, 0]);

        var layoutOut = leftNode.getChildByName("layout_outCards");
        setWgtLayout(layoutOut, [0.14, 0.14], [ipxSpace + des, 0.85 - des], [0, 0]);

        var layoutOut = rightNode.getChildByName("layout_outCards");
        setWgtLayout(layoutOut, [0.14, 0.14], [1 - des, 0.824 - des], [0, 0]);

        var ipxPosY = isIPhoneX() ? 0.01 : 0;

        var layoutEat = downNode.getChildByName("layout_eatCards");
        setWgtLayout(layoutEat, [0.14, 0.14], [des + ipxSpace, 0.34 - ipxPosY], [0, 0]);

        var layoutEat = leftNode.getChildByName("layout_eatCards");
        setWgtLayout(layoutEat, [0.14, 0.14], [des + ipxSpace, 0.76 + ipxPosY], [0, 0]);

        var layoutEat = rightNode.getChildByName("layout_eatCards");
        setWgtLayout(layoutEat, [0.14, 0.14], [1 - des, 0.734 + ipxPosY], [0, 0]);
    }
};

//Override
playPanel_xuPuPaoHuZi.prototype.refreshHandCard = function(off, isRefresh) {
    if (!this.isInPlay() && !isRefresh) {
        return;
    }

    var uiNode = this.getUINode(off);
    if (MjClient.rePlayVideo == -1) {
        if (off == 0) {
            if (MjClient.movingCard_paohuzi !== null && cc.sys.isObjectValid(MjClient.movingCard_paohuzi)) {
                MjClient.movingCard_paohuzi.removeFromParent(true);
            }
            this.checkHandCard(off);
            var layout_handCards = uiNode.getChildByName("layout_handCards");
            layout_handCards.visible = true;
            this.handleHandCardBeforeRefresh(off);
            layout_handCards.removeAllChildren();
            var cardArr = MjClient.HandCardArr;
            //清理空数组
            for (var k = cardArr.length - 1; k >= 0; k--) {
                if (cardArr[k].length == 0) {
                    cardArr.splice(k, 1);
                }
            }
            for (var k = 0; k < cardArr.length; k++) {
                var groupList = cardArr[k];
                for (var j = 0; j < groupList.length; j++) {
                    this.addOneHandCard(k, j, groupList[j], off);
                }
            }
            this.releaseHandCardNode(off);

            this.addTingSign(); // 添加听牌角标
            var gap = [4, 12, 0][this.getCardFontIdx()]; //美术图画布比图稍微大一点，擦...
            var handCard = uiNode.getChildByName("img_handCard");
            var scale_x = handCard.scaleX;
            var width = this.getHandCardSize().width - gap * scale_x;
            var winSize = MjClient.size;
            var totalWidth = width * cardArr.length * scale_x;
            for (var i = 0; i < cardArr.length; i++) {
                var addNode = layout_handCards.getChildByTag(i);
                this.showHandHuXi(addNode);

                if (addNode.lastPosition) {
                    addNode.setPosition(addNode.lastPosition);
                    this.doMoveToAction(addNode, cc.p((winSize.width - totalWidth) / 2 + i * width * scale_x, 0));
                } else {
                    addNode.setPosition(cc.p((winSize.width - totalWidth) / 2 + i * width * scale_x, 0));
                }
            }
            postEvent("LY_addHandHuXi");
        }
    } else {
        //回放
        var handNode = null;
        var cardArr = null;
        var handCard = null;
        if (off == 0) {
            if (this.getPlayersNum() == 4) {
                handNode = uiNode.getChildByName("layout_replayCards");
                handCard = uiNode.getChildByName("img_out");
            } else {
                handNode = uiNode.getChildByName("layout_handCards");
                handCard = uiNode.getChildByName("img_handCard");
            }
            cardArr = MjClient.HandCardArr;
        } else {
            handNode = uiNode.getChildByName("layout_replayCards");
            handCard = uiNode.getChildByName("layout_replayCards");
            cardArr = MjClient.OtherHandArr[off];
        }
        handNode.visible = true;
        handNode.removeAllChildren();

        //清理空数组
        if (!cardArr) {
            return;
        }
        for (var k = cardArr.length - 1; k >= 0; k--) {
            if (cardArr[k].length == 0) {
                cardArr.splice(k, 1);
            }
        }
        for (var k = 0; k < cardArr.length; k++) {
            var groupList = cardArr[k];
            for (var j = 0; j < groupList.length; j++) {
                if (off == 0) {
                    if (this.getPlayersNum() == 4) {
                        this.addHandCardReplay(k, j, groupList[j], off);
                    } else {
                        this.addHandCard(k, j, groupList[j], off);
                    }
                } else {
                    this.addHandCardReplay(k, j, groupList[j], off);
                }
            }
        }

        if (off == 0 && this.getPlayersNum() != 4) {
            var scale_x = handCard.scaleX;
            var winSize = MjClient.size;
            var totalWidth = this.getHandCardSize().width * cardArr.length * scale_x;
            for (var i = 0; i < cardArr.length; i++) {
                var addNode = handNode.getChildByTag(i);
                addNode.setPosition(cc.p((winSize.width - totalWidth) / 2 + i * handCard.width * scale_x, 0));
            }
        }
        cc.log("================off:" + off + "----------" + JSON.stringify(cardArr));
    }
};

playPanel_xuPuPaoHuZi.prototype.handleHandCardBeforeRefresh = function(off) {
    var uiNode = this.getUINode(off);
    //根据牌的类型获得需要添加的节点
    var layout_handCards = uiNode.getChildByName("layout_handCards");


    //root列节点 card 牌节点
    layout_handCards.cardRoot = [];
    layout_handCards.cardList = [];

    //获取所有的牌节点
    var children1 = layout_handCards.getChildren();
    //cc.log("chow children1", JSON.stringify(children1, null, "  ") + "");
    if (children1) {
        for (var i = 0; i < children1.length; i++) {
            var children2 = children1[i].getChildren();
            //cc.log("chow children2", JSON.stringify(children2, null, "  ") + "");
            if (children2) {
                for (var j = 0; j < children2.length; j++) {
                    if (children2[j]) {
                        layout_handCards.cardList.push(children2[j]);
                    }
                }
            }
        }
    }
    //去除非卡牌节点,例如胡息显示
    function clearNotNumber(cardList) {
        if (cardList) {
            for (var i = cardList.length - 1; i >= 0; i--) {
                if (!((cardList[i].tag >= 103 && cardList[i].tag <= 110) || 
                      (cardList[i].tag >= 203 && cardList[i].tag <= 210) || 
                      (cardList[i].tag >= 303 && cardList[i].tag <= 310) ||
                      (cardList[i].tag >= 403 && cardList[i].tag <= 410))) {
                    var node = cardList.splice(i, 1);
                    node[0].removeFromParent();
                }
            }
        }
    }
    clearNotNumber(layout_handCards.cardList);
    if (layout_handCards.cardList.length == 0) {
        return;
    }
    //按列从下而上排序 与上一次数据一一对应起来
    layout_handCards.cardList.sort(function(a, b) {
            if (a.parent.tag < b.parent.tag) {
                return -1;
            } else if (a.parent.tag == b.parent.tag) {
                if (a.name < b.name) {
                    return -1;
                } else if (a.name == b.name) {
                    return 0;
                } else {
                    return 1;
                }
            } else {
                return 1;
            }
        })
        /*for(var k = 0; k < layout_handCards.cardList.length; k++){
         cc.log("chow", "cleanCardNode cardList: k = " + k + " tag = " + layout_handCards.cardList[k].tag + " name = " + layout_handCards.cardList[k].name + " parentTag =" + layout_handCards.cardList[k].parent.tag);
         }*/
        //查找当前移动的牌 并更新移动位置
    if (MjClient.moveCard) {
        cc.log("chow", "cleanCardNode" + " moveCard curCIndex = " + MjClient.moveCard.curCIndex + " curRIndex = " + MjClient.moveCard.curRIndex + " nexCIndex = " + MjClient.moveCard.nexCIndex + " nexRIndex = " + MjClient.moveCard.nexRIndex);

        var oldIndex = layout_handCards.cardList.length;
        //var moveCard;
        //查找当前移动牌
        for (var i = 0; i < layout_handCards.cardList.length; i++) {
            if (layout_handCards.cardList[i].parent.tag == MjClient.moveCard.curCIndex && layout_handCards.cardList[i].name == MjClient.moveCard.curRIndex) {
                //cc.log("chow", "cleanCardNode" + " layout_handCards i = " + i + " tag = " + layout_handCards.cardList[i].parent.tag + " name = " + layout_handCards.cardList[i].name);
                oldIndex = i;
                //moveCard = layout_handCards.cardList.splice(i, 1);
                break;
            }
        }
        if (oldIndex != layout_handCards.cardList.length) {
            //转化成当前坐标
            //moveCard[0].setPosition(moveCard[0].parent.convertToNodeSpace(MjClient.moveCard.curPosition));
            layout_handCards.cardList[oldIndex].setPosition(layout_handCards.cardList[oldIndex].parent.convertToNodeSpace(MjClient.moveCard.curPosition));

            if (MjClient.moveCard.curCIndex != MjClient.moveCard.nexCIndex || MjClient.moveCard.curRIndex != MjClient.moveCard.nexRIndex) {
                var moveCard = layout_handCards.cardList.splice(oldIndex, 1);
                //cc.log("chow", "cleanCardNode" + " moveCard tag = " + moveCard[0].tag + " name = " + moveCard[0].name);
                var newIndex = layout_handCards.cardList.length;
                //查到当前移动牌移动的目标位置
                for (var i = 0; i < layout_handCards.cardList.length; i++) {
                    //cc.log("chow", "cleanCardNode" + " layout_handCards.cardList tag = " + layout_handCards.cardList[i].parent.tag + " name = " + layout_handCards.cardList[i].name);
                    if (layout_handCards.cardList[i].parent.tag == MjClient.moveCard.nexCIndex && layout_handCards.cardList[i].name >= MjClient.moveCard.nexRIndex || layout_handCards.cardList[i].parent.tag > MjClient.moveCard.nexCIndex) {
                        newIndex = i;
                        break;
                    }
                }
                cc.log("chow", "cleanCardNode" + " newIndex = " + newIndex);
                if (newIndex == layout_handCards.cardList.length) {
                    layout_handCards.cardList.push(moveCard[0]);
                } else {
                    layout_handCards.cardList.splice(newIndex, 0, moveCard[0]);
                }
            }
            // else {
            //     //00位置移动到00位置
            //     layout_handCards.cardList.unshift(moveCard[0]);
            // }
        }
    }
    //将按数据排序好的牌复用 后续直接取
    // cc.log("chow cleanCardNode cardList.length = ", layout_handCards.cardList.length + "");
    /*for(var k = 0; k < layout_handCards.cardList.length; k++){
     cc.log("chow", "cleanCardNode cardList: k = " + k + " tag = " + layout_handCards.cardList[k].tag + " name = " + layout_handCards.cardList[k].name + " parentTag =" + layout_handCards.cardList[k].parent.tag);
     }*/
    //cc.log("chow", JSON.stringify(layout_handCards.cardList, null, "  ") + "");
    for (var k = 0; k < layout_handCards.cardList.length; k++) {
        layout_handCards.cardList[k].lastPosition = layout_handCards.cardList[k].parent.convertToWorldSpace(layout_handCards.cardList[k].getPosition());
        layout_handCards.cardList[k].isSelect = false;
        layout_handCards.cardList[k].retain();
        layout_handCards.cardList[k].removeFromParent(false);
        // cc.log("chow", "cleanCardNode cardList: k = " + k + " tag = " + layout_handCards.cardList[k].tag + " pos = " + JSON.stringify(layout_handCards.cardList[k].lastPosition), null, "  ");
    }

    //获取所有的列节点 按照数据顺序0-X
    for (var i = 0; i < layout_handCards.childrenCount; i++) {
        layout_handCards.cardRoot.push(layout_handCards.getChildByTag(i));
    }
    if (layout_handCards.cardRoot.length == 0) {
        return;
    }
    //复用列节点 ,后续直接查找使用
    // cc.log("chow cleanCardNode cardRoot.length = ", layout_handCards.cardRoot.length + "");
    for (var k = 0; k < layout_handCards.cardRoot.length; k++) {
        //cc.log("chow", "cleanCardNode cardRoot: k = " + k + " : " + layout_handCards.cardRoot[k].tag);
        layout_handCards.cardRoot[k].retain();
        layout_handCards.cardRoot[k].removeFromParent(false);

        //layout_handCards.cardRoot[k].lastPosition = layout_handCards.cardRoot[k].getPosition();
        //cc.log("chow", JSON.stringify(layout_handCards.cardRoot[k].lastPosition), null, "  ");
    }
    //查找数据中被删除的列索引
    // cc.log("chow", "cleanCardNode : MjClient.HandCardArr = "  + JSON.stringify(MjClient.HandCardArr));
    var empty = this.getEmptyIndex(MjClient.HandCardArr);
    for (var i = 0; i < empty.length; i++) {
        // cc.log("chow", "cleanCardNode empty[" + i + "] = " + empty[i]);
    }

    //区分左右新建列和无变化
    // cc.log("chow", "cleanCardNode addGroupIndex:" + MjClient.addGroupIndex);
    if (MjClient.addGroupIndex == 0) {
        //最左边新建
        if (empty.length == 0) {
            //新增列，新增一个列结点插入最前面
            var cardParent = new cc.Node();
            cardParent.width = layout_handCards.cardList[0].width;
            cardParent.retain();
            cardParent.setPosition(cc.p(layout_handCards.cardRoot[0].x - layout_handCards.cardRoot[0].width / 2, layout_handCards.cardRoot[0].y));

            layout_handCards.cardRoot.unshift(cardParent);
        } else {
            //只有当列数大于1时才取出设置 否则不用移动
            if (layout_handCards.cardRoot.length > 1) {
                //移动列，取出移动列插入到最前面
                var cardParent = layout_handCards.cardRoot.splice(empty[0] - 1, 1); //这里需要减去前面新增的一个位置
                cardParent[0].setPosition(cc.p(layout_handCards.cardRoot[0].x - layout_handCards.cardRoot[0].width / 2, layout_handCards.cardRoot[0].y));
                layout_handCards.cardRoot.unshift(cardParent[0]);
            }
        }
    } else if (MjClient.addGroupIndex == MjClient.HandCardArr.length - 1) {
        //最右边新建
        if (empty.length == 0) {
            //新增列，新增一个列结点插入最后面
            var cardParent = new cc.Node();
            cardParent.width = layout_handCards.cardList[0].width;
            cardParent.retain();
            cardParent.setPosition(cc.p(layout_handCards.cardRoot[layout_handCards.cardRoot.length - 1].x + layout_handCards.cardRoot[layout_handCards.cardRoot.length - 1].width / 2, layout_handCards.cardRoot[layout_handCards.cardRoot.length - 1].y));

            layout_handCards.cardRoot.push(cardParent);
        } else {
            //只有当列数大于1时才取出设置 否则不用移动
            if (layout_handCards.cardRoot.length > 1) {
                //移动列，取出移动列插入到最后面
                var cardParent = layout_handCards.cardRoot.splice(empty[0], 1);
                cardParent[0].setPosition(cc.p(layout_handCards.cardRoot[layout_handCards.cardRoot.length - 1].x + layout_handCards.cardRoot[layout_handCards.cardRoot.length - 1].width / 2, layout_handCards.cardRoot[layout_handCards.cardRoot.length - 1].y));
                layout_handCards.cardRoot.push(cardParent[0]);
            }
        }
    } else {
        //删除无数据列
        for (var i = empty.length - 1; i >= 0; i--) {
            var cardParent = layout_handCards.cardRoot.splice(empty[i], 1);
            if (layout_handCards.cardRoot.length > 0) {
                cardParent[0].setPosition(cc.p(layout_handCards.cardRoot[layout_handCards.cardRoot.length - 1].x + layout_handCards.cardRoot[layout_handCards.cardRoot.length - 1].width / 2, layout_handCards.cardRoot[layout_handCards.cardRoot.length - 1].y));
            }
            layout_handCards.cardRoot.push(cardParent[0]);
        }
        //刷新时导致列数不够需要先补齐列数
        if (layout_handCards.cardRoot.length > 0) {
            var addRootCount = MjClient.HandCardArr.length - layout_handCards.cardRoot.length;
            // cc.log("chow", "cleanCardNode" + " addRootCount = " + addRootCount);
            for (var i = 0; i < addRootCount; i++) {
                var cardParent = new cc.Node();
                cardParent.width = layout_handCards.cardList[0].width;
                cardParent.retain();
                cardParent.setPosition(cc.p(layout_handCards.cardRoot[layout_handCards.cardRoot.length - 1].x + layout_handCards.cardRoot[layout_handCards.cardRoot.length - 1].width / 2, layout_handCards.cardRoot[layout_handCards.cardRoot.length - 1].y));

                layout_handCards.cardRoot.push(cardParent);
            }
        }
    }
    //排好顺序的列节点，重置顺序Id
    for (var k = 0; k < layout_handCards.cardRoot.length; k++) {
        layout_handCards.cardRoot[k].tag = k;
        layout_handCards.cardRoot[k].lastPosition = layout_handCards.cardRoot[k].getPosition();
        // cc.log("chow", JSON.stringify(layout_handCards.cardRoot[k].lastPosition), null, "  ");
    }
};

playPanel_xuPuPaoHuZi.prototype.addHandCard = function(col, row, cardNum, off) {
    var uiNode = this.getUINode(off);
    //根据牌的类型获得需要添加的节点
    var layout_handCards = uiNode.getChildByName("layout_handCards");

    //设置牌
    var newCard = this.getNewCard("hand", cardNum, off);
    var scale_y = newCard.scaleY;
    //首先根据name判断cpNode中是否已经添加
    var cardParent = layout_handCards.getChildByTag(col);
    if (!cardParent) {
        cardParent = new cc.Node();
        cardParent.tag = col;
        cardParent.width = newCard.width;
        layout_handCards.addChild(cardParent);
    }

    var beginPoint = cc.p(0, 0);
    var off_y = newCard.height * scale_y - newCard.height / 2 * scale_y;

    var cardCount = cardParent.childrenCount;
    newCard.setName(row);
    newCard.zIndex = 4 - row;
    newCard.anchorX = 0;
    newCard.anchorY = 0;
    newCard.x = beginPoint.x;
    newCard.y = beginPoint.y + cardCount * off_y;
    cardParent.addChild(newCard);

    var pl = this.getUIPlayer(off);
    if (pl && pl.canNotPutCard) {
        if (pl.canNotPutCard.indexOf(cardNum) != -1) {
            newCard.setColor(cc.color(170, 170, 170));
        }
    }
    cc.log("chow", "addHandCard_hengYang: name=" + newCard.getName() + " num=" + newCard.num + " tag =" + newCard.tag);
};

//Override
playPanel_xuPuPaoHuZi.prototype.getEatCardOffest = function(eatType, totalCount, cardIndex, off) {
    var uiNode = this.getUINode(off);
    if (uiNode.getName() == "node_left" || uiNode.getName() == "node_right") {
        return -120;
    } else {
        return 0;
    }
};

playPanel_xuPuPaoHuZi.prototype.showCardTingSign = function(card, isShow) {
    var pl = this.getUIPlayer(0);
    if (isShow && pl && !pl.isGuChou) {
        var tingSign = card.getChildByName("tingSign");
        if (!tingSign) {
            tingSign = new ccui.ImageView("playing/paohuzi/ting.png");
            tingSign.setName("tingSign");
            var tingScale = [0.74, 1.5, 1.6];
            tingSign.scale *= tingScale[this.getCardFontIdx()];
            card.addChild(tingSign);
        }
        tingSign.visible = true;
        tingSign.setPosition(0, card.getContentSize().height);
        tingSign.setAnchorPoint(0, 1);
    } else {
        card.removeChildByName("tingSign");
    }
};

playPanel_xuPuPaoHuZi.prototype.getShowCardIndex = function(eatType, off) {
    var uiNode = this.getUINode(off);
    var index = 0;
    if (eatType == "mjwei") {
        index = 2;
    } else if (eatType == "mjgang1") {
        index = 3;
    }
    return index;
};

playPanel_xuPuPaoHuZi.prototype.getEatCardOrientation = function(off) {
    var uiNode = this.getUINode(off);
    var orientation = {
        dx: 1,
        dy: 1,
        anchorX: 0,
        anchorY: 0
    };

    if (uiNode.getName() == "node_left") {
        orientation.dy = -1;
    } else if (uiNode.getName() == "node_right") {
        orientation.dx = -1;
    } else if (uiNode.getName() == "node_xing") {
        orientation.dx = -1;
        orientation.anchorX = 1;
    }
    return orientation;
};

//Override
playPanel_xuPuPaoHuZi.prototype.getEatCardNode = function(eatType, cardArr, off) {
    var uiNode = this.getUINode(off);
    var orientation = this.getEatCardOrientation(off);

    var eatCardNode = new cc.Node();
    var firstY = this.getEatCardOffest(eatType, 0, 0, off);
    var fontsScale = [1, 0.97, 1.1];
    var fontIdx = this.getCardFontIdx();
    for (var i = 0; i < cardArr.length; i++) {
        for (var j = 0; j < cardArr[i].length; j++) {
            var showType = this.getEatCardShowType(eatType, cardArr[i][j], j, off);
            var card = this.getNewCard("out", cardArr[i][j], off, showType == 0);
            if (showType == 1) {
                this.addShaderForCard(card);
            } else if (showType == 3) {
                card.setColor(cc.color(170, 170, 170));
            }

            eatCardNode.addChild(card, cardArr[i].length - j);
            card.x = orientation.dx * (i + 0.5) * card.width * card.scaleX;
            card.y = firstY + card.height * card.scaleY * 0.6 * j;
            eatCardNode.cardWidth = eatCardNode.cardWidth || card.width * card.scaleX;
            if (showType == 0) {
                //由于牌的尺寸不规范，牌背微调size
                card.scale = fontsScale[fontIdx];
            }
        }
    }
    return eatCardNode;
};

//Override
playPanel_xuPuPaoHuZi.prototype.showSelectEatCards = function() {
    var self = this;
    var sData = MjClient.data.sData;
    var pl = sData.players[SelfUid()];
    var putCard = sData.tData.lastPutCard;

    this.hideEatBtns();
    MjClient.playui.jsBind.node_eatChoice.btn_cancel._node.visible = true;

    var selectBgArr = [MjClient.playui.jsBind.node_eatChoice.img_chiSelect._node,
                       MjClient.playui.jsBind.node_eatChoice.img_biSelect._node,
                       MjClient.playui.jsBind.node_eatChoice.img_biSelect1._node];

    var selectedCardsArr = []; //记录选择的组合
    var bShowEatCardsScaleAction = false; //是否执行缩放动画

    //添加一组可以吃或比的牌
    var addSelectEatCardsRow = function(handCardArr) {
        var selectBg = selectBgArr[selectedCardsArr.length];
        selectBg.visible = true;
        selectBg.x = cc.winSize.width * 0.5;

        if (selectedCardsArr.length == 0) {
            var optionCards = self.getChiCards();
        } else {
            var card = putCard;
            if (handCardArr.indexOf(card) < 0) {
                card = card > 300 ? card - 200 : card + 200;
            }
            var optionCards = MjClient.majiang.getBiCards(handCardArr, card);
        }
        if (!optionCards || optionCards.length == 0) {
            return;
        }

        var optionBtns = self.addSelectEatBtns(selectBg, optionCards);
        for (var i = 0; i < optionBtns.length; ++i) {
            var btn = optionBtns[i];
            (function(tag, cards) {
                btn.addClickEventListener(function(btn) {
                    bShowEatCardsScaleAction = (tag + 1) > selectedCardsArr.length;
                    selectedCardsArr = selectedCardsArr.slice(0, tag);
                    selectedCardsArr.push(cards);

                    for (var i = selectedCardsArr.length; i < selectBgArr.length; ++i) {
                        selectBgArr[i].visible = false;
                    }

                    for (var m = 0; m < optionBtns.length; m++) {
                        optionBtns[m].setBright(true);
                    }
                    btn.setBright(false);

                    var tmpHandCardArr = handCardArr.slice();
                    var tmpCards = cards.slice();
                    var sameCard = putCard > 300 ? (putCard - 200) : (putCard + 200);
                    if (selectedCardsArr.length == 3) {
                        return self.commitEatCard(selectedCardsArr[0], selectedCardsArr.slice(1, selectedCardsArr.length));
                    } else if (selectedCardsArr.length == 1) {
                        var idx = tmpCards.indexOf(putCard);
                        if (idx >= 0) {
                            tmpCards.splice(idx, 1);
                        }
                    }
                    for (var i = 0; i < tmpCards.length; i++) {
                        tmpHandCardArr.splice(tmpHandCardArr.indexOf(tmpCards[i]), 1);
                    }
                    if ((tmpHandCardArr.indexOf(putCard) < 0 && tmpHandCardArr.indexOf(sameCard) < 0) || !self.checkBiCards()) {
                        self.commitEatCard(selectedCardsArr[0], selectedCardsArr.length == 1 ? null : selectedCardsArr.slice(1, selectedCardsArr.length));
                    } else {
                        addSelectEatCardsRow(tmpHandCardArr);
                    }
                });
            })(selectedCardsArr.length, optionCards[i]);
        }
        self.doSelectEatAction(selectBgArr.slice(0, selectedCardsArr.length + 1), bShowEatCardsScaleAction);
    };
    addSelectEatCardsRow(pl.mjhand.slice());
};

//Override
playPanel_xuPuPaoHuZi.prototype.fixArrIndex = function(arr, cardNum, card) {
    if (arr) {
        if (this.isKan(arr)) {
            arr.push(cardNum);
            MjClient.moveCard.nexRIndex = 3;
        } else {
            var factor = [2.4, 2, 2][this.getCardFontIdx()];
            var off_y = card.height / factor * card.scaleY;
            var maxH = card.height * card.scaleY + off_y * 2;
            if (card.y > maxH) {
                arr.push(cardNum);
                MjClient.moveCard.nexRIndex = 3;
            } else if (card.y > maxH - off_y) {
                arr.splice(2, 0, cardNum);
                MjClient.moveCard.nexRIndex = 2;
            } else if (card.y > card.height * card.scaleY) {
                arr.splice(1, 0, cardNum);
                MjClient.moveCard.nexRIndex = 1;
            } else {
                arr.splice(0, 0, cardNum);
                MjClient.moveCard.nexRIndex = 0;
            }
        }
    }
};

// 出牌线&出牌手指动画
playPanel_xuPuPaoHuZi.prototype.checkCutLineVisible = function(node) {
    var cutLine = node || this.jsBind.img_cutLine._node;
    var finger = this.jsBind.img_finger._node

    cutLine.visible = false;
    finger.visible = false;
    if (MjClient.hasPut) {
        return;
    }

    var tData = MjClient.data.sData.tData;
    var pl = this.getUIPlayer(0);
    if (IsTurnToMe() && pl && !pl.isGuChou) {
        var status = (tData.tState == TableState.waitPut || this.checkPutSpecil());
        cutLine.visible = status;

        finger.visible = status && this.getChuPaiGuide() == 0;

        if(!finger.getChildByName("animSprite")){
            var animSprite = new cc.Sprite("playing/fingerEffer/finger0.png");
            animSprite.x = 120;
            animSprite.y = 120;
            finger.addChild(animSprite);
            animSprite.setName("animSprite");
            var action = createAnimation("playing/fingerEffer/finger",13,cc.rect(0, 0,166,195),0.07);
            animSprite.runAction(cc.sequence([action]).repeatForever());
        }
    }
};

playPanel_xuPuPaoHuZi.prototype.calculateHuXi = function(off) {
    var pl = this.getUIPlayer(off);
    var huxi = MjClient.majiang.getHuxi(MjClient.data.sData, pl);

    if (off == 0) {
        huxi += MjClient.majiang.getHandHuxi(MjClient.HandCardArr);
    }

    return huxi;
};

// 放偎是否能听检测
playPanel_xuPuPaoHuZi.prototype.checkFangWeiGray = function(card, pl) {
    if (!card || !this.isOtherWei(card)) {
        return false;
    }
    var tingCards = MjClient.majiang.getTingCards(MjClient.data.sData, pl, card);
    // 策划要求, 只要有听口就可以打出, 即使能听的牌打完了
    return tingCards.length <= 0; //不能打出则置灰
}

// 是否放偎
playPanel_xuPuPaoHuZi.prototype.isOtherWei = function(card) {
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    for (var i = 0; i < tData.uids.length; ++i) {
        var uid = tData.uids[i];
        var pl = sData.players[uid];
        if (uid == SelfUid()) {
            continue;
        }

        for (var j = 0; j < pl.mjwei.length; ++j) {
            if (MjClient.majiang.value(pl.mjwei[j][0]) == MjClient.majiang.value(card) && 
                this.getCardShowType(card, this.getUIOffByUid(uid)) != 0) {
                return true;
            }
        }
    }

    return false;
};

playPanel_xuPuPaoHuZi.prototype.setCardTouchHandler = function(card, off) {
    var self = this;
    var pl = this.getUIPlayer(off);
    var dict = {};
    for (var i = 0; i < pl.mjhand.length; i++) {
        var value = MjClient.majiang.value(pl.mjhand[i]);
        dict[value] = dict[value] ? dict[value] + 1 : 1;
    }

    if (dict[MjClient.majiang.value(card.tag)] >= 3 && this.is34Mask()) {
        if (this.is34ColorGrey()) {
            card.setColor(cc.color(170, 170, 170));
        }
        card.addTouchEventListener(null);
        card.setTouchEnabled(false);
        if (MjClient.movingCard_paohuzi == card) {
            MjClient.movingCard_paohuzi = null;
        }
        return;
    }

    card.setColor(cc.color(255, 255, 255));

    if (this.checkFangWeiGray(card.tag, pl)) {
        card.setColor(cc.color(170, 170, 170));
        card.isGray = true;
    } else {
        card.isGray = false;
    }

    var cloneCard = null;
    card.addTouchEventListener(function(btn, eventType) {
        if (MjClient.movingCard_paohuzi !== null && cc.sys.isObjectValid(MjClient.movingCard_paohuzi) && MjClient.movingCard_paohuzi !== btn) {
            return;
        }

        if (MjClient.isRefreshNodeing || MjClient.isDealing) {
            return;
        }

        if (eventType == ccui.Widget.TOUCH_BEGAN) {
            MjClient.movingCard_paohuzi = btn;
            if (MjClient.playui.isShowCloneCard()) { // 添加残影
                if (cc.sys.isObjectValid(cloneCard)) {
                    cloneCard.removeFromParent(true);
                }

                cloneCard = btn.clone();
                cloneCard.opacity = 100;
                cloneCard.setTouchEnabled(false);
                var src = MjClient.playui.getCardSrc("hand", btn.tag, false);
                //cloneCard.loadTexture(src, MjClient.playui.getResType());
                MjClient.playui.loadCardTexture(cloneCard, src, MjClient.playui.getResType());
                btn.parent.addChild(cloneCard);
            }

            btn.parent.zIndex = 1;
            btn.zIndex = 5;
            btn.setAnchorPoint(0.5, 0.5);
            btn.x += btn.width * btn.scaleX * 0.5;
            btn.y += btn.height * btn.scaleY * 0.5;
            // updateBtnMovedPosition_hengYang(btn, eventType);
            if (Array.isArray(MjClient.hintPutList_ziPai) && MjClient.hintPutList_ziPai.indexOf(btn.tag) >= 0) {
                if (MjClient.playui.hasTingByPut()) {
                    MjClient.playui.checkTingCardsNew(btn.tag);
                }else if(MjClient.playui.isCheckTingStats()){
                    MjClient.playui.checkTingStats(btn.tag);
                } else {
                    MjClient.playui.checkTingCards(btn.tag);
                }
            }

            if (MjClient.playui.isShowLongCard()) { // 显示长牌
                var alignWidth = btn.scale * btn.width;
                var src = MjClient.playui.getCardSrc("put", btn.tag, false);
                btn.loadTexture(src, 0);
                btn.scale = alignWidth / btn.width;
                var tingSign = btn.getChildByName("tingSign");
                if (cc.sys.isObjectValid(tingSign) && tingSign.isVisible()) {
                    tingSign.y = btn.getContentSize().height;
                }
            }
        }

        if (eventType == ccui.Widget.TOUCH_MOVED) {
            btn.setPosition(cc.pSub(btn.getTouchMovePosition(), btn.parent.getPosition()));
            // updateBtnMovedPosition_hengYang(btn, eventType);
        }

        if (eventType == ccui.Widget.TOUCH_ENDED || eventType == ccui.Widget.TOUCH_CANCELED) {
            MjClient.movingCard_paohuzi = null;
            // updateBtnMovedPosition_hengYang(btn, eventType);
            MjClient.moveCard = {};
            MjClient.moveCard.curPosition = btn.parent.convertToWorldSpace(cc.p(btn.x - btn.anchorX * btn.width * btn.scaleX, btn.y - btn.anchorY * btn.height * btn.scaleY));
            var col = MjClient.moveCard.curCIndex = MjClient.moveCard.nexCIndex = btn.parent.tag;
            var row = MjClient.moveCard.curRIndex = MjClient.moveCard.nexRIndex = btn.name;
            var pos = btn.getTouchEndPosition();
            var card = btn.tag;

            if (cc.sys.isObjectValid(cloneCard)) {
                cloneCard.removeFromParent(true);
            }

            if (MjClient.playui.isShowLongCard()) {
                var src = MjClient.playui.getCardSrc("hand", btn.tag, false);
                //btn.loadTexture(src, MjClient.playui.getResType());
                // MjClient.playui.changeHandCardSize(btn);
                MjClient.playui.loadCardTexture(btn, src, MjClient.playui.getResType());
                btn.scale = cc.director.getWinSize().width / 1280;
            }

            if (!Array.isArray(MjClient.HandCardArr[col]) || MjClient.HandCardArr[col][row] != card) {
                if(MjClient.playui.isCheckTingStats()){
                    MjClient.playui.checkTingStats();
                }else{
                    MjClient.playui.checkTingCards();
                }
                MjClient.playui.refreshHandCard(0);
                delete MjClient.moveCard;
                return;
            }

            var tData = MjClient.data.sData.tData;


            // 出牌
            var pl = MjClient.data.sData.players[SelfUid()];
            var isPutCommon = tData.tState == TableState.waitPut;
            var isPutSpecil = MjClient.playui.checkPutSpecil();
            var isCanPut = (IsTurnToMe() && !pl.isGuChou && (isPutCommon || isPutSpecil) && MjClient.playui.checkCardCanPut(pl, card) && !MjClient.hasPut && pos.y > MjClient.playui.jsBind.img_cutLine._node.y);
            if (isCanPut && !btn.isGray) {
                if (self.isOtherWei(card)) {
                    MjClient.showMsg("放偎之后这局将不能再吃碰，是否确定？", function() {
                        MjClient.playui.doPut(card, btn, col, row);
                        MjClient.playui.refreshHandCard(0);
                        delete MjClient.moveCard;
                    }, function() {
                        btn.setAnchorPoint(0, 0);
                        if(MjClient.playui.isCheckTingStats()){
                            MjClient.playui.checkTingStats();
                        }else{
                            MjClient.playui.checkTingCards();
                        }
                        MjClient.playui.refreshHandCard(0);
                        delete MjClient.moveCard;
                    }, "1");

                    return;
                } else {
                    MjClient.playui.doPut(card, btn, col, row);
                }
            } else { // 移动手牌
                if (isCanPut && btn.isGray) {
                    MjClient.showToast("未听牌不能放偎");
                }
                // cc.log("pos.x@@ ", pos.x, " btn.parent.x@@ ", btn.parent.x);
                var dstCol = col + Math.round((pos.x - btn.parent.x) / (btn.parent.width * btn.scaleX) - 0.5); // 目的列
                // cc.log("dstCol@@ ", dstCol);
                if (dstCol == col) { // 列未变
                    MjClient.HandCardArr[col].splice(parseInt(row), 1);
                    MjClient.playui.fixArrIndex(MjClient.HandCardArr[dstCol], card, btn);
                } else if (dstCol >= 0 && dstCol < MjClient.HandCardArr.length) { // 当前有手牌列
                    if (MjClient.HandCardArr[dstCol].length < 4) { // 插牌
                        MjClient.moveCard.nexCIndex = dstCol;
                        MjClient.HandCardArr[col].splice(row, 1);
                        MjClient.playui.fixArrIndex(MjClient.HandCardArr[dstCol], card, btn);
                    }
                } else if (MjClient.HandCardArr.length < MjClient.playui.getMaxColumnCount()) { // 最前或最后 新增一列
                    MjClient.HandCardArr[col].splice(parseInt(row), 1);
                    if (dstCol < 0) {
                        MjClient.HandCardArr.unshift([card]);
                        MjClient.addGroupIndex = 0;
                    } else if (dstCol >= MjClient.HandCardArr.length) {
                        MjClient.HandCardArr.push([card]);
                        MjClient.addGroupIndex = MjClient.HandCardArr.length - 1;
                    }

                    MjClient.moveCard.nexCIndex = MjClient.addGroupIndex;
                    MjClient.moveCard.nexRIndex = 0;
                }
                btn.setAnchorPoint(0, 0);
            }

            //还原大小
            if(btn && cc.sys.isObjectValid(btn) && MjClient.playui.isShowLongCard()) {
                MjClient.playui.changeHandCardSize(btn);
                var src = MjClient.playui.getCardSrc("hand", btn.tag, false);
                MjClient.playui.loadCardTexture(btn, src, MjClient.playui.getResType()); 
            }
            

            if (MjClient.playui.hasTingByPut()) {
                MjClient.playui.checkTingCardsNew();
            } else if(MjClient.playui.isCheckTingStats()){
                MjClient.playui.checkTingStats();
            }else{
                MjClient.playui.checkTingCards();
            }
            MjClient.playui.refreshHandCard(0);

            MjClient.addGroupIndex = -1;
            delete MjClient.moveCard;
        }
    });
};

playPanel_xuPuPaoHuZi.prototype.changeEatBtnLayout = function(btnNode, len, idx) {
    var scale = 0.20;
    if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ){
        if(btnNode.name == "btn_guo"){
            scale = 103 / 720;
        }else if(btnNode.name == "btn_hu"){
            scale = 149 / 720;
        }
    }
    var type = this.getLayoutType();
    switch (type) {
        case 1:
            setWgtLayout(btnNode, [0, scale], [0.5, 0.18], [(idx - (len - 1) / 2) * 1.3 * 0.20 / scale, 1.8 * 0.20 / scale], false, false);
            break;
        case 0:
            setWgtLayout(btnNode, [0, scale], [0.88 - (len - 1 - idx) * 0.12 * 0.20 / scale, 0.11], [0, 1.8 * 0.20 / scale], false, false);
            break;
    }
};

// 改变手牌大小.固定
playPanel_xuPuPaoHuZi.prototype.changeHandCardSize = function(handCard) {
    var src = this.getCardSrc("hand", 101)
    this.loadCardTexture(handCard, src, 0);
    setWgtLayout(handCard, [86 / 1280, 0], [0.27, 0.75], [0, 0]);
};

//Override
playPanel_xuPuPaoHuZi.prototype.getPutCardBg = function (putType) {
    return "playing/paohuzi/xupu_pkBg.png";
};

// 获取牌资源路径
playPanel_xuPuPaoHuZi.prototype.getCardSrc = function(name, tag, isTurn) {
    name = name == "put" ? "hand" : name; //hand和put用同一套
    var path = this.getCardFilePath();
    if (isTurn) {
        return path + "paiBei.png";  
    }

    return (path + name + "/" + tag + ".png");
};

//字牌资源路径
playPanel_xuPuPaoHuZi.prototype.getCardFilePath = function() {
    var fontList = this.getCardFontList();
    var fontIdx = this.getCardFontIdx();

    return "playing/ziPai/xuPuphz/" + fontList[fontIdx] + "/";
};

//字牌字体列表
playPanel_xuPuPaoHuZi.prototype.getCardFontList = function() {
    return ["type1", "type2", "type3"];
};

/**
 * @param node 
 * @param {String} type 改变的类型:font|size
 */
playPanel_xuPuPaoHuZi.prototype.changeCardFrame = function(node, type) {
    if (type != 'font') {
        return;
    }

    var childArray = node.getChildren();
    var len = childArray.length;
    for (var i = 0; i < len; i++) {
        var child = childArray[i];
        this.changeCardFrame(child, type);
    }

    if (node.toString() != "[object ImageView]") {
        return;
    }

    var oldFile = node.getRenderFile().file;
    if (oldFile.indexOf("type1/") < 0 && oldFile.indexOf("type2/") < 0 && oldFile.indexOf("type3/") < 0) {
        return;
    }

    var list = this.getCardFontList();
    var idx = this.getCardFontIdx();

    var newFile = oldFile;
    for (var i = 0; i < list.length; i++) {
        if (oldFile.indexOf(list[i]) != -1) {
            newFile = oldFile.replace(list[i], list[idx]);
            break;
        }
    }

    if (newFile != oldFile && (jsb.fileUtils.isFileExist(newFile))) {
        this.loadCardTexture(node, newFile, 0);
        if (oldFile.indexOf('paiBei') >= 0) {
            node.scale = [1, 0.97, 1.1][this.getCardFontIdx()];
        }
    }
};

//Override
playPanel_xuPuPaoHuZi.prototype.getGameBgList = function() {
    return ["playing/gameTable/beijing_1.jpg", "playing/gameTable/beijing_2.jpg", "playing/gameTable/beijing_3.jpg"];
};

//Override
playPanel_xuPuPaoHuZi.prototype.getGameBgIdx = function() {
    return util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_GAME_BG_TYPE, 0);
};

playPanel_xuPuPaoHuZi.prototype.isAniParallel = function() {
    return false;
};

playPanel_xuPuPaoHuZi.prototype.isCheckTingStats = function() {
    return true;
}

playPanel_xuPuPaoHuZi.prototype.getTingStats = function(putCard) {
    var sData = MjClient.data.sData;
    var pl = sData.players[SelfUid()];
    return MjClient.majiang.getTingStats(sData, pl, putCard);
}

playPanel_xuPuPaoHuZi.prototype.checkTingStats = function(putCard) {
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var pl = sData.players[SelfUid()];
    if(!pl.mjhand || pl.isGuChou){
        postEvent("showTingStats", {});
        return;
    }
    if (tData.tState == TableState.waitPut && this.isCurPlayer(0) && putCard === undefined) {
        postEvent("showTingStats", {});
        return;
    }
    if (putCard && (!this.isCurPlayer(0) || tData.tState != TableState.waitPut)) {
        putCard = undefined;
    }
    postEvent("showTingStats", this.getTingStats(putCard));
}

// 发牌间隔
playPanel_xuPuPaoHuZi.prototype.getSendCardInterval = function() {
    var areaSelectMode = MjClient.data.sData.tData.areaSelectMode;
    if ([0, 1, 2].indexOf(areaSelectMode.faPai) < 0) {
        return 1;
    }

    return [1.5, 1.1, 0.8][areaSelectMode.faPai];
};

playPanel_xuPuPaoHuZi.prototype.getDefaultSetting = function() {
    return {
        layout: 1,
        bg: 1,
        pai: 0,
        fastEat: 1,
        huXi: 1,
        xuXian: 0,
        suDu: 1,
        size: 0,
        voice: 1,
        ting: 0,
        chuBtn: 0,
        dblClick: 0,
        chuGuide:0,
    };
};

