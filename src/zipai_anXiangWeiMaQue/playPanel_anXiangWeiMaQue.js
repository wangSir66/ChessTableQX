// 郴州字牌
var playLayer_anXiangWeiMaQue;
(function() {
    playLayer_anXiangWeiMaQue = playLayer_ziPai.extend({
        getJsBind: function(){
            var jsBind = {
                img_banner: {
                    _layout: [[0.35, 0.35], [0.476, 1], [0, 0]],
                    btn_wanFa: {
                        _click: function(sender) {
                            MjClient.playui.showWanFaUi(true);
                        }
                    },
                    btn_setting: {
                        _click: function() {
                            cc.log("btn_setting");
                            MjClient.Scene.addChild(new setting_anXiangWeiMaQue(), 6000);
                            MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Shezhi", {uid:SelfUid(),gameType:MjClient.gameType});
                        }
                    }
                },
                text_roundInfo: {
                    _layout: [[0.11, 0.11], [0.5, 0.66], [0, 0]],
                    _run: function() {
                        this.ignoreContentAdaptWithSize(true);
                    },
                    _event: {
                        initSceneData: function() {
                            this.setString(MjClient.playui.getGameCnDesc());
                        },
                        mjhand: function() {
                            this.setString(MjClient.playui.getGameCnDesc());
                        },
                        addPlayer: function(d) {
                            this.setString(MjClient.playui.getGameCnDesc());
                        },
                        removePlayer: function() {
                            this.setString(MjClient.playui.getGameCnDesc());
                        }
                    }
                },
                layout_cardNum: {
                    img_card: {
                        _run:function() {
                            this.refreshCardsTotal = function(isRemove) {
                                var sData = MjClient.data.sData;
                                var tData = sData.tData;
                                var maiPai = (tData.maxPlayer == 2 && tData.areaSelectMode.isMaiPai) ? 19 : 0;
                                var next = MjClient.majiang.getAllCardsTotal() - tData.cardNext;
                                //next -= maiPai;
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
                                        for(var i = 1; i <= next; i++) {
                                            var child = ccui.ImageView("playing/ziPaiBanner/paidui.png");
                                            child.setPosition(cc.p(this.width/2, this.height/2 + i * 0.8));
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
                    }
                },
                img_liuzi: {
                    _layout: [[0.15, 0.15], [0.2942, 0.86], [0, 0]],
                    _run:function() {
                        var tData = MjClient.data.sData.tData;
                        this.setVisible(tData.areaSelectMode.isDouLiuZi);
                        if (MjClient.rePlayVideo != -1) {
                            setWgtLayout(this, [0.15, 0.15], [0.5, 0.88], [0, 0])
                        }
                    },
                    txt_liuzi: {
                        _event: {
                            initSceneData:function() {
                                var tData = MjClient.data.sData.tData;
                                this.setString("溜子 " + (tData.liuZiScore || 0));
                            },
                            mjhand:function() {
                                var tData = MjClient.data.sData.tData;
                                this.setString("溜子 " + (tData.liuZiScore || 0));
                            },
                            roundEnd:function() {
                                var tData = MjClient.data.sData.tData;
                                this.setString("溜子 " + (tData.liuZiScore || 0));
                            }
                        },
                    }
                },
                img_cutLine: {
                    _event: {
                        waitPut: function() {
                            MjClient.playui.checkCutLineVisible(this);
                        }
                    },
                },
                btn_putCrad:{
                    _visible: false,
                },
                node_eatChoice: {
                    btn_cancel: {
                        _run: function(){
							//重载
                            this.changeLayout = function() {
                                if (MjClient.playui.getPlayersNum() == 4) {return;}
                                setWgtLayout(this, [0, 0.16], [0.78, 0.3], [0, 1.12]);
                            }
                        },
                    },
                    btn_zhe: {
                        _visible: false,
                        _layout: [[0, 0.1], [0.5, 0], [-6, 2.5]],
                        bg_img: {
                            _run: function() {
                                MjClient.playui.doBtnLightAction(this);
                            }
                        },
                        _click: function() {
                            var tData = MjClient.data.sData.tData;
                            var msg = {
                                cmd: "MJPass",
                                isZhe: true,
                                cardNext: tData.cardNext,
                                card: tData.lastPutCard,
                                eatFlag: MjClient.playui.getSelfEatFlag()
                            };
                            MjClient.showMsg("确定过胡吗？", function() {
                                MjClient.playui.hideEatBtns();
                                MjClient.gamenet.request("pkroom.handler.tableMsg", msg);
                            }, function() {}, "1");
                        },
                    }
                },
                btn_chat: {
                    _run: function() {
                        //重载
                        this.changeLayout = function() {
                            if (MjClient.playui.getPlayersNum() == 4) {return;}
                            setWgtLayout(this, [55 / 1280, 0], [0.97, 0.187], [0, 0]);
                        }
                        
                    },
                },
                btn_voice: {
                    _run: function() {
                        this.visible = !MjClient.playui.isCoinField();
                        initVoiceData();
                        cc.eventManager.addListener(getTouchListener(), this);
                        if (MjClient.isShenhe) this.visible = false;

                        //重载
                        this.changeLayout = function() {
                            if (MjClient.playui.getPlayersNum() == 4) {return;}
                            setWgtLayout(this, [43 / 1280, 0], [0.91, 0.1875], [0, 0]);
                        }
                    }
                },
                btn_sort: {
                    _click: function() {
                        if (!MjClient.playui.isInPlay()) {
                            return;
                        }

                        var pl = MjClient.playui.getUIPlayer(0);
                        //MjClient.HandCardArr = MjClient.majiang.sortCard(pl.mjhand);
                        MjClient.HandCardArr = MjClient.majiang.sortByUser();
                        MjClient.playui.refreshHandCard(0);
                        var isZheValid = pl.zheCards && (pl.zheCards.length > 0);
                        isZheValid = MjClient.playui.isInPlay() ? isZheValid : false;
                        if(isZheValid) {
                            //设置牌为不可点击
                            MjClient.playui.setHandCardDisEnabled();
                        }
                    }
                },
                node_down: {
                    layout_head: {
                        img_siShou: {
                            _visible: false,
                            _event: {
                                MJPeng: function() {
                                    MjClient.playui.checkSiShouVisible(this);
                                },
                                HZChiCard: function() {
                                    MjClient.playui.checkSiShouVisible(this);
                                },
                                HZWeiCard: function() {
                                    MjClient.playui.checkSiShouVisible(this);
                                },
                                initSceneData: function() {
                                    MjClient.playui.checkSiShouVisible(this);
                                },
                                mjhand: function() {
                                    MjClient.playui.checkSiShouVisible(this);
                                }
                            }
                        }
                    },
                    layout_handCards: {
                        _event: {
                            initSceneData: function() {
                                var pl = MjClient.playui.getUIPlayer(0);
                                MjClient.playui.calculateHintPutList();
                                MjClient.playui.initHandCards(this);
                                var isZheValid = pl.zheCards && (pl.zheCards.length > 0);
                                isZheValid = MjClient.playui.isInPlay() ? isZheValid : false;
                                if(isZheValid) {
                                    //设置牌为不可点击
                                    MjClient.playui.setHandCardDisEnabled();
                                }
                            },
                            MJPass: function(d) { 
                                MjClient.playui.calculateHintPutList();
                                MjClient.playui.addTingSign();
                                var isZheValid = d.zheCards && (d.zheCards.length > 0);
                                isZheValid = MjClient.playui.isInPlay() ? isZheValid : false;
                                if(isZheValid) {
                                    //设置牌为不可点击
                                    MjClient.playui.setHandCardDisEnabled();
                                }
                            },
                            waitPut: function() {
                                MjClient.playui.calculateHintPutList();
                                MjClient.playui.addTingSign();
                            }
                        },
                    }
                },
                node_left: {
                    layout_head: {
                        img_siShou: {
                            _visible: false,
                            _event: {
                                MJPeng: function() {
                                    MjClient.playui.checkSiShouVisible(this);
                                },
                                HZChiCard: function() {
                                    MjClient.playui.checkSiShouVisible(this);
                                },
                                HZWeiCard: function() {
                                    MjClient.playui.checkSiShouVisible(this);
                                },
                                initSceneData: function() {
                                    MjClient.playui.checkSiShouVisible(this);
                                },
                                mjhand: function() {
                                    MjClient.playui.checkSiShouVisible(this);
                                }
                            }
                        }
                    }
                },
                node_right: {
                    layout_head: {
                        img_siShou: {
                            _visible: false,
                            _event: {
                                MJPeng: function() {
                                    MjClient.playui.checkSiShouVisible(this);
                                },
                                HZChiCard: function() {
                                    MjClient.playui.checkSiShouVisible(this);
                                },
                                HZWeiCard: function() {
                                    MjClient.playui.checkSiShouVisible(this);
                                },
                                initSceneData: function() {
                                    MjClient.playui.checkSiShouVisible(this);
                                },
                                mjhand: function() {
                                    MjClient.playui.checkSiShouVisible(this);
                                }
                            }
                        }
                    }
                },
                pnl_trust: {
                    _layout: [[1000/1280, 0], [0.1094, 0], [0, 0]],
                    _run: function() {
                        this.setLocalZOrder(999);
                        this.setVisible(false);
                        this.setTouchEnabled(false);
                    },
                    _event: {
                        initSceneData:function(d) {
                            var pl = MjClient.playui.getUIPlayer(0);
                            if(!pl)
                                return;
                            var isZheValid = pl.zheCards && (pl.zheCards.length > 0);
                            isZheValid = MjClient.playui.isInPlay() ? isZheValid : false;
                            this.setVisible(isZheValid);
                        },
                        roundEnd:function(d) {
                            this.setVisible(false);
                        },
                        MJPass:function(d) {
                            var isZheValid = d.zheCards && (d.zheCards.length > 0);
                            isZheValid = MjClient.playui.isInPlay() ? isZheValid : false;
                            this.setVisible(isZheValid);
                            MjClient.data.sData.tData.zheCards = d.zheCards;
                        }
                    }
                },
                img_wanFa: {
                    _layout: [[220/1280, 0], [0.82, 0.9292], [0, 0]],
                    _run:function() {
                        this.visible = false;
                        this.iScaleX = this.getScaleX();
                        this.iScaleY = this.getScaleY();
                        //初始化文本
                        MjClient.playui.setWanFaUi(this);
                        this.addTouchEventListener(function(sender, event) {
                            if(event == ccui.Widget.TOUCH_ENDED) {
                                MjClient.playui.showWanFaUi(false);
                            }
                        }) 
                    },
                    img_up: {
                        _run:function() {
                            this.visible = true;
                            this.addTouchEventListener(function(sender, event) {
                                if(event == ccui.Widget.TOUCH_ENDED) {
                                    MjClient.playui.showWanFaUi(false);
                                }
                            })
                        }
                    }
                }
            };
            return jsBind;
        },
        ctor: function() {
            this._super("Play_ZiPaiAnXiangWeiMaQue.json");
            //自由人数
            if (MjClient.data.sData.tData.areaSelectMode["convertible"] && MjClient.rePlayVideo == -1)
                addFreeNumberBtn([0.5, 0.4]);

            //调整俱乐部返回大厅按钮位置
            var _parentNode = MjClient.playui._downNode.getParent();
            var backHallBtn = _parentNode.getChildByName("backhallbtn");
            if(cc.sys.isObjectValid(backHallBtn)) {
                setWgtLayout(backHallBtn, [0.036, 0], [0.88, 0.95], [0, 0]);
            }

            return true;
        },
    });
}());

playLayer_anXiangWeiMaQue.prototype.setWanFaUi = function(node) {
    var mode = MjClient.data.sData.tData.areaSelectMode;
    var wanFa = ['老名堂', '小卓版', '大卓版', '全名堂', '钻石版','至尊版'];
    var zhuangXian_2 = ["20/10", "30/20", "40/30", "50/50"];
    var zhuangXian_3 = ["20/10/10", "30/20/20", "40/30/30", "50/50/50"];
    var deng = ['一登=80', '一登=100', '一登=200'];
    var mingTangIdx = {
        //小卓版
        "全球人":30, "上下五千年":35, "大龙摆尾":26, 

        //大卓版，钻石版, 全名堂
        "2息满园花":8, 

        //全名堂
        "自摸":62, "心连心":49, "对倒胡":38,
        "活捉小三":53, "两红两黑":54, "一条龙":51,
        "隔山打牛":52
    };
    var max = MjClient.playui.getPlayersNum();
    var collect = [];
    //溜子分, 登分
    if(mode.isDouLiuZi) {
        var idx = mode.douLiuZiScore;
        var val = max == 2 ? zhuangXian_2[idx] : zhuangXian_3[idx];
        collect.push(val);
        collect.push(deng[mode.yiDengScore]);
    }
    //人数
    if(mode.convertible) {
        collect.push("自由人数");
    }else{
        collect.push(mode.maxPlayer + "人场");
    }
    if(mode.maxPlayer == 2 ||
        mode.convertible) {
        collect.push(mode.isCanChiDuiJiaChuPai ? "可吃对家牌" : "不能吃对家牌");
        collect.push(mode.minHuXi == 0 ? "十胡起胡" : "十五胡起胡");
    }
    //翻倍
    collect.push(mode.fanBei == 0 ? "不翻倍" : ("少于" + mode.fanBeiScore + "分翻倍"));
    if(mode.isRandomZhuang) {
        //collect.push("第一局随机庄");
    }
    //名堂
    collect.push(wanFa[mode.mingTangType]); //单独一行
    collect.push("换行");
    for(var i = 0; i < mode.mingTangSelectList.length; i++) {
        var id = mode.mingTangSelectList[i];
        for(var k in mingTangIdx) {
            if(id == mingTangIdx[k])
                collect.push(k);
        }
    }
    
    if (mode.jieSuanDiFen != 1) {
        collect.push('换行');
        collect.push("积分底分x" + mode.jieSuanDiFen);
    }

    cc.log("什么鬼", collect);

    //设置UI
    var maxW = node.width - 32;
    var gapX = 20;
    var gapY = 5;
    var curW = 0;
    var curLine = 0;

    var text = node.getChildByName("text");
    text.setVisible(false);
    for(var i = 0; i < collect.length; i++) {
        if(collect[i] == "换行") {
            curLine++;
            curW = 0;
            continue;
        }
        var mt = text.clone();
        mt.setVisible(true);
        mt.ignoreContentAdaptWithSize(true);
        mt.setString(collect[i]);
        if(curW + mt.width + gapX <= maxW) {
            mt.x += (curW + (curW == 0 ? 0 : gapX));
            curW += ((curW == 0 ? 0 : gapX) + mt.width);
        } else {
            curLine++;
            curW = mt.width;
        }
        mt.y -= curLine * (mt.height + gapY);
        node.addChild(mt);
    }
    //自适应文本高度
    var oldY = node.height;
    node.height = mt.height * (curLine+1) + gapY * curLine + 2*14;
    var children = node.getChildren();
    for(var c in children) {
        var child = children[c];
        if(child.getName() == "img_up") 
            continue;
        child.y += node.height - oldY;
    }
}

playLayer_anXiangWeiMaQue.prototype.showWanFaUi = function(isShow) {
    var imgWanFa = MjClient.playui.jsBind.img_wanFa._node;
    if(isShow && imgWanFa.isVisible()) {
        return;
    }

    if(imgWanFa.tId) {
        clearInterval(imgWanFa.tId);
        imgWanFa.tId = null;
    }
    var hide = function(ref) {
        if(!cc.sys.isObjectValid(ref)) {
            return;
        }
        ref.runAction(cc.sequence(cc.scaleTo(0.2, ref.iScaleX, 0.000001).easing(cc.easeSineOut()),
            cc.callFunc(function(sender) {
                sender.visible = false;
            })));
    }
    if(isShow) {
        imgWanFa.setScaleY(0.000001);
        imgWanFa.visible = true;
        imgWanFa.runAction(cc.sequence(cc.scaleTo(0.2, imgWanFa.iScaleX, imgWanFa.iScaleY).easing(cc.easeSineIn()),
            cc.callFunc(function(sender) {
                //开启5s定时器
                sender.tId = setInterval(function() {
                    hide(sender);
                    clearInterval(sender.tId); 
                    sender.tId = null;
                }, 5*1000);
            })));
    }else {
        hide(imgWanFa);
    }
}

playLayer_anXiangWeiMaQue.prototype.setHandCardDisEnabled = function() {
    var uiNode = this.getUINode(0);
    var children = uiNode.getChildByName("layout_handCards").getChildren();
    for(var k in children) {
        var childPnl = children[k];
        if(!childPnl.getChildren)
            continue;
        var childs = childPnl.getChildren();
        for(var c in childs) {
            var child = childs[c];
            if(!child.addTouchEventListener || !child.setTouchEnabled)
                continue;
            child.addTouchEventListener(null);
            child.setTouchEnabled(false);
        }
    }
}

//Override
playLayer_anXiangWeiMaQue.prototype.createEndOneLayer = function(type) {
    return new EndOneView_anXiangWeiMaQue();
};

//Override
playLayer_anXiangWeiMaQue.prototype.getGameBgList = function() {
    return ["playing/anhuapaohuzi/bg/beijing_1.jpg", "playing/anhuapaohuzi/bg/beijing_2.jpg", "playing/anhuapaohuzi/bg/beijing_3.jpg"];
};

//Override
playLayer_anXiangWeiMaQue.prototype.getGameBgIdx = function() {
    return util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_GAME_BG_TYPE, 2);
};

//Override
playLayer_anXiangWeiMaQue.prototype.setCardTouchHandler = function(card, off) {
    var self = this;
    var pl = this.getUIPlayer(off);
    var dict = {};
    for (var i = 0; i < pl.mjhand.length; i++) {
        var cd = pl.mjhand[i];
        dict[cd] = dict[cd] ? dict[cd] + 1 : 1;
    }
    
    card.setColor(cc.color(255, 255, 255));
    card.banPut = false;

    if(pl.canNotPutCard.indexOf(card.tag) >= 0) {
        card.setColor(cc.color(170, 170, 170));
        card.banPut = true; //禁止出牌
    }

    var isZheValid = pl.zheCards && (pl.zheCards.length > 0);
    isZheValid = MjClient.playui.isInPlay() ? isZheValid : false;
    if(pl.info.uid == SelfUid() && isZheValid) {
        card.addTouchEventListener(null);
        card.setTouchEnabled(false);
        return;
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
                cloneCard.loadTexture(src, MjClient.playui.getResType());
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
                btn.loadTexture(src, MjClient.playui.getResType());
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
                btn.loadTexture(src, MjClient.playui.getResType());
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
            if (!MjClient.hasPut && IsTurnToMe() && tData.tState == TableState.waitPut && pos.y > MjClient.playui.jsBind.img_cutLine._node.y && !btn.banPut) {
                function doPut() {
                    var putNode = MjClient.playui.getUINode(0).getChildByName("img_putCard");
                    putNode.stopAllActions();
                    putNode.visible = true;
                    putNode.opacity = 255;
                    putNode.getChildByName("img_card").loadTexture(self.getCardSrc("put", card, false), MjClient.playui.getResType()); // todo
                    putNode.loadTexture("playing/paohuzi/chupai_bj.png");

                    var pos = putNode.getUserData().pos;
                    putNode.setScale(putNode.getUserData().scale);
                    var p = btn.parent.convertToWorldSpace(cc.p(btn.x + (0.5 - btn.anchorX) * btn.width * btn.scaleX, btn.y + (0.5 - btn.anchorY) * btn.height * btn.scaleY));
                    putNode.setPosition(putNode.parent.convertToNodeSpace(p));
                    putNode.runAction(cc.moveTo(MjClient.playui.getActionTime(), pos.x, pos.y));
                    // tood 背光

                    btn.removeFromParent(true);

                    if (!Array.isArray(MjClient.HandCardArr[col]) || MjClient.HandCardArr[col][row] != card) {
                        putNode.visible = false;
                        if(MjClient.playui.isCheckTingStats()){
                            MjClient.playui.checkTingStats();
                        }else{
                            MjClient.playui.checkTingCards();
                        }
                        MjClient.playui.refreshHandCard(0);
                        delete MjClient.moveCard;
                        return;
                    }

                    MjClient.hasPut = true;
                    MjClient.HandCardArr[col].splice(row, 1);
                    MjClient.gamenet.request("pkroom.handler.tableMsg", {
                        cmd: "MJPut",
                        card: card
                    });
                    MjClient.playui.checkCutLineVisible();
                }

                doPut();
            } else { // 移动手牌
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
                } else if (MjClient.HandCardArr.length < 10) { // 最前或最后 新增一列
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

            if (MjClient.playui.hasTingByPut()) {
                MjClient.playui.checkTingCardsNew();
            } else if(MjClient.playui.isCheckTingStats()){
                MjClient.playui.checkTingStats();
            } else {
                MjClient.playui.checkTingCards();
            }
            MjClient.playui.refreshHandCard(0);

            MjClient.addGroupIndex = -1;
            delete MjClient.moveCard;
        }
    });
};

//Override
playLayer_anXiangWeiMaQue.prototype.getHuXiType = function() {
    return 1;
};

//Override
playLayer_anXiangWeiMaQue.prototype.getEatCardShowType = function(eatType, card, cardIndex, off) {
    var showType = 2;
    if (eatType == "mjchi") {
        showType = cardIndex < 2 ? 2 : 3;
    } else if (eatType == "mjwei" || eatType == "mjgang1") {
        showType = this.getCardShowType(card, off);
        if (showType == 1) { //自己两暗一明
            showType = this.getShowCardIndex(eatType, off) == cardIndex ? 2 : 0;
        }
    }
    return showType;
};

//Override
playLayer_anXiangWeiMaQue.prototype.calculateHuXi = function(off) {
    var pl = this.getUIPlayer(off);
    return MjClient.majiang.getHuxi(pl);
};

//Override
playLayer_anXiangWeiMaQue.prototype.showSelectEatCards = function() {
    var self = this;
    var sData = MjClient.data.sData;
    var pl = sData.players[SelfUid()];
    var putCard = sData.tData.lastPutCard;

    this.hideEatBtns();
    MjClient.playui.jsBind.node_eatChoice.btn_cancel._node.visible = true;
    var selectBg = MjClient.playui.jsBind.node_eatChoice.img_chiSelect._node;

    //添加一组可以吃或比的牌
    var addSelectEatCardsRow = function(handCardArr) {
        selectBg.visible = true;
        selectBg.x = cc.winSize.width * 0.5;

        var optionCards = MjClient.majiang.getChiCards(handCardArr, putCard);
        if (!optionCards || optionCards.length == 0) {
            return;
        }

        var optionBtns = self.addSelectEatBtns(selectBg, optionCards);
        for (var i = 0; i < optionBtns.length; ++i) {
            var btn = optionBtns[i];
            (function(cards) {
                btn.addClickEventListener(function(btn) {
                    self.commitEatCard(cards);
                });
            })(optionCards[i]);
        }
        self.doSelectEatAction([selectBg], true);
    };
    addSelectEatCardsRow(pl.mjhand.slice());
};

playLayer_anXiangWeiMaQue.prototype.isShowCardBack = function(msg) {
    return msg && (SelfUid() != msg.uid) && msg.isCurrCardHide;
};

//Override
playLayer_anXiangWeiMaQue.prototype.getShowEatNodes = function() {
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var eat = MjClient.playui.jsBind.node_eatChoice;
    var pl = sData.players[SelfUid() + ""];
    if (!pl || (pl.eatFlag & 16) || (pl.eatFlag & 8)) {
        return;
    }

    if (tData.tState == TableState.roundFinish) {
        return [];
    }

    var vnode = [];
    if (pl.eatFlag & 32) { // 胡
        if(tData.isZheOpen && tData.currCard && tData.currCard > 0) {
            vnode.push(eat.btn_zhe._node);
        }
        vnode.push(eat.btn_hu._node);
    }

    if (pl.eatFlag & 2) { // 碰
        vnode.push(eat.btn_peng._node);
    }

    if (pl.eatFlag & 1) { // 吃
        vnode.push(eat.btn_chi._node);
    }

    if (vnode.length > 0) { // 过
        vnode.push(eat.btn_guo._node);
    }

    return vnode;
};

//Override(打牌界面用)
playLayer_anXiangWeiMaQue.prototype.getGameCnDesc = function(ignoreType) {
    var tData = MjClient.data.sData.tData;
    var areaSelectMode = tData.areaSelectMode;
    var qiHu;
    var valid = 0;
    for (var i=0; i<tData.uids.length; i++) {
        if(tData.uids[i] != 0)
            valid++;
    }
    if(valid == 2 && areaSelectMode.minHuXi == 1) {
        qiHu = "十五胡起胡";
    }else {
        qiHu = "十胡起胡";
    }

    return qiHu + "    " + "胡摸的牌";
};

// 初始化弃牌
playLayer_anXiangWeiMaQue.prototype.initOutCard = function(node) {
    if (!this.isInPlay()) return;
    var off = this.getUIOffByNode(node);
    var pl = this.getUIPlayer(off);
    node.removeAllChildren();
    var putLen = pl.mjput.length;
    if (this.isCurPlayer(off) && pl.mjput.length > 0 && MjClient.data.sData.tData.currCard == pl.mjput[pl.mjput.length - 1]) {
        putLen -= 1;
    }
    for (var i = 0; i < putLen; i++) {
        var pos = this.getOutCardPos(off);
        var orientation = this.getOutCardOrientation(off, true);
        var outCard = this.getNewCard("out", pl.mjput[i], off, false);
        outCard.setPosition(pos);
        outCard.visible = true;
        node.addChild(outCard);
        //添加黄角标
        this.addOutFlag(outCard, pl.mjputType[i]);
    }
};

// 落牌动画
playLayer_anXiangWeiMaQue.prototype.showOutCardAnimation = function(node) {
    var off = this.getUIOffByNode(node);
    var tData = MjClient.data.sData.tData;
    if (this.getIndexInUids(off) != (tData.curPlayer - 1 + tData.maxPlayer) % tData.maxPlayer) { // 不是发牌玩家上家
        return;
    }

    var pl = this.getUIPlayer(off);
    var uiNode = this.getUINode(off);

    if (!node.isVisible()) { // 没有展示牌
        return;
    }

    if (pl.mjput.length <= 0) {
        return;
    }

    var endPos = this.getOutCardPos(off);
    var outLayout = uiNode.getChildByName("layout_outCards");
    var outCard = this.getNewCard("out", pl.mjput[pl.mjput.length - 1], off, false);
    outCard.setPosition(endPos);
    outLayout.addChild(outCard);

    //添加黄角标
    this.addOutFlag(outCard, pl.mjputType[pl.mjputType.length - 1]);

    var anmEndPos = outLayout.convertToWorldSpace(cc.p(endPos.x, endPos.y)); // 动画结束坐标
    var actTime = this.getAniTimeByType("land");

    outCard.setOpacity(0);
    outCard.setScale(0.4);
    var spa = cc.spawn(cc.fadeIn(0.05), cc.scaleTo(0.05, 1));
    outCard.runAction(cc.sequence(cc.delayTime(actTime - 0.05), spa, cc.callFunc(function() {
        outCard.visible = true;
    })));

    // 播放缩小动画到outcard的所在位置
    var scy = (outCard.height * outCard.scaleY) / node.height;
    var spa = cc.spawn(cc.scaleTo(actTime, scy), cc.fadeTo(actTime, 255 * 0.6), cc.moveTo(actTime, cc.p(anmEndPos)))
    var seq = cc.sequence(spa, cc.callFunc(function() {
        node.setOpacity(255);
        node.visible = false;

    }));

    node.stopAllActions();
    node.runAction(seq);
};

//结算用
playLayer_anXiangWeiMaQue.prototype.getRoundInfo = function() {
    var wanFa = ['老名堂', '小卓版', '大卓版', '全名堂', '钻石版','至尊版'];
    var zhuangXian_2 = ["20/10", "30/20", "40/30", "50/50"];
    var zhuangXian_3 = ["20/10/10", "30/20/20", "40/30/30", "50/50/50"];
    var deng = ['一登=80', '一登=100', '一登=200'];
    var areaSelectMode = MjClient.data.sData.tData.areaSelectMode;
    var max = MjClient.playui.getPlayersNum();
    var str = "";
    str += max + "人局,";
    if(max == 2) {
        str += areaSelectMode.isCanChiDuiJiaChuPai ? "能吃对家牌," : "不能吃对家牌,";
        str += areaSelectMode.isMaiPai ? "底牌22张," : "底牌41张,";
    }
    str += areaSelectMode.minHuXi == 0 ? "十胡起胡," : "十五胡起胡,";
    str += areaSelectMode.isRandomZhuang ? "第一局随机庄," : "";
    str += wanFa[areaSelectMode.mingTangType] + ',';
    if(areaSelectMode.isDouLiuZi) {
        var idx = areaSelectMode.douLiuZiScore
        if(max == 2) {
            str += zhuangXian_2[idx] + ',';
        }else {
            str += zhuangXian_3[idx] + ',';
        }
        str += deng[areaSelectMode.yiDengScore] + ',';
    }
    var desc = '少于' + areaSelectMode.fanBeiScore + '分翻倍,';
    str += areaSelectMode.fanBei == 1 ? desc : "不翻倍,";
    str += "积分底分x" + areaSelectMode.jieSuanDiFen;
    return str;
};

//总结算面板
playLayer_anXiangWeiMaQue.prototype.createGameOverLayer = function(type) {
    return new GameOverLayer_anXiangWeiMaQue();
};

//小结算面板
playLayer_anXiangWeiMaQue.prototype.createEndOneLayer = function(type) {
    return new EndOneView_anXiangWeiMaQue();
};

playLayer_anXiangWeiMaQue.prototype.changeEatBtnLayout = function(btnNode, len, idx) {
    setWgtLayout(btnNode, [0, 0.20], [0.88 - (len - 1 - idx) * 0.12, 0.11], [ 0, 1.8], false, false);
};

//死手
playLayer_anXiangWeiMaQue.prototype.checkSiShouVisible = function(node) {
    node.visible = false;
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    if (!this.isTableFull()) {
        return;
    }

    if (!this.isInPlay()) {
        return;
    }

    var off = this.getUIOffByNode(node);
    var pl = this.getUIPlayer(off);
    node.visible = pl.isDead;
};

playLayer_anXiangWeiMaQue.prototype.isCheckTingStats = function() {
    return true;
}

playLayer_anXiangWeiMaQue.prototype.getTingStats = function(putCard) {
    var sData = MjClient.data.sData;
    var pl = sData.players[SelfUid()];
    return MjClient.majiang.getTingStats(sData, pl, putCard);
}

playLayer_anXiangWeiMaQue.prototype.isPutCardLayout = function() {
    return true;
}

//Override
/*
playLayer_anXiangWeiMaQue.prototype.doSelectEatAction = function(arr, isScale) {
    if (!arr || arr.length == 0) {
        return;
    }
    var gap = 5;
    isScale = isScale === undefined ? true : isScale;
    var len = arr.length;
    var w = 0;
    for (var i = 0; i < len; i++) {
        var node = arr[i];
        if (node && node.width) {
            w += node.width * node.scale;
            w += gap;
        }
    }

    //初始的缩放值
    var initChiBgScale = MjClient.playui.jsBind.node_eatChoice.img_chiSelect._node.initChiBgScale;
    var scaleActionNode = arr[len - 1];

    var width = cc.winSize.width * 0.91;
    var beginX = width < w ? 0 : (width - w);
    arr.reverse();

    for (var i = 0; i < len; i++) {
        var node = arr[i];
        if (node) {
            node.stopAllActions();
            beginX += node.width * 0.5 * initChiBgScale + gap;
            //最后一个节点缩放
            if (node == scaleActionNode) {
                node.x = beginX;
                if (isScale) {
                    node.scale = 0.1;
                    var ac = cc.scaleTo(0.1, initChiBgScale).easing(cc.easeExponentialOut(0.1));
                    node.runAction(ac);
                }
                //其他节点位移
            } else {
                node.scale = initChiBgScale;
                var p = cc.p(beginX, node.y);
                var ac = cc.moveTo(0.2, p).easing(cc.easeExponentialOut(0.2));
                node.runAction(ac);
            }
            beginX += node.width * 0.5 * initChiBgScale;
        }
    }
};
*/
