//新版剥皮
var playPanel_shaoYangBoPi = playLayer_ziPai.extend({
	ctor: function() {
		this._super("Play_shaoYangBoPi.json");

        this.shuffleList = [];  //洗牌玩家

		if(MjClient.playui.getTouchType() == 1){
            cc.eventManager.addListener(MjClient.playui.getHandCardListener(), -1);
		}

        if (MjClient.data.sData.tData.areaSelectMode["convertible"] && MjClient.rePlayVideo == -1){
            addFreeNumberBtn([0.5, 0.4]);
        }
        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ){
            MjClient.playui.jsBind._node.addChild(new roundRule_ziPai(roundRule_ziPai.getRoundRules()));
        }
	},

	getJsBind: function() {
		var jsBind = {
			_event: {
				startShuffleCards: function(d) {
					MjClient.playui.checkCanShowDistance();
				},
				mjhand: function() {
					MjClient.playui.checkCanShowDistance([[0.25, 0.25], [0.5, 0.5], [0, 0]]);
				},
				initSceneData: function() {
					CheckRoomUiDelete();
					sendGPS();
					MjClient.checkChangeLocationApp();
					MjClient.playui.checkCanShowDistance([[0.25, 0.25], [0.5, 0.5], [0, 0]]);
				},
				MJChat: function(data) {
					if (data.type == 4) {
						MjClient.playui.checkCanShowDistance([[0.25, 0.25], [0.5, 0.5], [0, 0]]);
					}
				},
				removePlayer: function(eD) {
					MjClient.playui.checkCanShowDistance([[0.25, 0.25], [0.5, 0.5], [0, 0]]);
				},

                MJShuffle : function(eD) {
                    if (MjClient.rePlayVideo != -1) return; // 回放时候不播

                    MjClient.playui.shuffleList.push(eD.uid);
                    MjClient.playui.playShuffleEffect();
                },
                endRoom: function(msg) {
                    if (msg.showEnd) {
                        this.addChild(MjClient.playui.createGameOverLayer(), 500);

                        var pl = MjClient.playui.getUIPlayer(0);
                        if(pl.shuffled > 0) {
                            MjClient.showToast("因牌局解散，系统已返还洗牌费用");
                        }
                    } else {
                        MjClient.Scene.addChild(new StopRoomView());
                    }
                }
			},
            text_roundInfo: {
			    _run:function () {
                  if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ) {
                      this.visible = false;
                  }
                },
                _event: {
                    mjhand : function() {
                        this.setString(MjClient.playui.getGameCnDesc());
                    }
                }
            },
			img_banner: {
				btn_setting: {
					_click: function() {
						MjClient.Scene.addChild(new settingPanel_shaoYangBoPi(), 6000);
						MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Shezhi", {
							uid: SelfUid(),
							gameType: MjClient.gameType
						});
					}
				},
                btn_changeBg:{
                    _run: function() {
                        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ){
                            this.loadTextureNormal("playing/ziPaiBanner/wenhao.png");
                            this.setContentSize(this.getNormalTextureSize());
                        }else {
                            this.visible = !MjClient.playui.isCoinField();
                        }
                    },
                    _click: function() {
                        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ){
                            postEvent("EZP_rule");
                        }else {
                            MjClient.playui.changeGameBgToNext();
                        }
                    }
                },
			},
            btn_sort: {
                _click: function () {
                    if (!MjClient.playui.isInPlay()) {
                        return;
                    }
                    var pl = MjClient.playui.getUIPlayer(0);
                    MjClient.HandCardArr = MjClient.majiang.sortByUser();
                    MjClient.playui.refreshHandCard(0);
                }
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
				btn_jiaChui: {
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
				btn_buChui: {
					_layout: [
	                    [0.12, 0.12],
	                    [0.6, 0.4],
	                    [0, 0]
	                ],
					_click: function(btn) {
						MjClient.gamenet.request("pkroom.handler.tableMsg", {
							cmd: "MJJiazhu",
							jiachuiNum: 0,
						});
					}
				}
			},
            node_left:{
                layout_eatDisplay: {
                    _layout: [[0.12, 0.12], [0.04, 0.93], [0, 0]],
                },
                layout_head: {
                    img_jiachuiText : {
                        _run:function() {
                            MjClient.playui.showOrHideJiachuiText(this, MjClient.playui.getUIOffByNode(this));
                        },
                        _event:{
                            initSceneData: function() {
                                MjClient.playui.showOrHideJiachuiText(this, MjClient.playui.getUIOffByNode(this));
                            },
                            MJJiazhu: function() {
                                MjClient.playui.showOrHideJiachuiText(this, MjClient.playui.getUIOffByNode(this));
                            },
                            mjhand: function() {
                                this.visible = false;
                            }
                        }
                    }
                }
            },
            node_right:{
                layout_eatDisplay: {
                    _layout: [[0.12, 0.12], [0.95, 0.91], [0, 0]],
                },
                layout_head: {
                    img_jiachuiText : {
                        _run:function() {
                            MjClient.playui.showOrHideJiachuiText(this, MjClient.playui.getUIOffByNode(this));
                        },
                        _event:{
                            initSceneData: function() {
                                MjClient.playui.showOrHideJiachuiText(this, MjClient.playui.getUIOffByNode(this));
                            },
                            MJJiazhu: function() {
                                MjClient.playui.showOrHideJiachuiText(this, MjClient.playui.getUIOffByNode(this));
                            },
                            mjhand: function() {
                                this.visible = false;
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
                    _layout: [[0.35, 0.35], [0.65, 0.6], [0, 0]]
                },
                layout_head: {
                    img_jiachuiText : {
                        _run:function() {
                            MjClient.playui.showOrHideJiachuiText(this, MjClient.playui.getUIOffByNode(this));
                        },
                        _event:{
                            initSceneData: function() {
                                MjClient.playui.showOrHideJiachuiText(this, MjClient.playui.getUIOffByNode(this));
                            },
                            MJJiazhu: function() {
                                MjClient.playui.showOrHideJiachuiText(this, MjClient.playui.getUIOffByNode(this));
                            },
                            mjhand: function() {
                                this.visible = false;
                            }
                        }
                    }
                }
            },
            node_xing:{
                layout_eatDisplay: {
                    _layout: [[0.12, 0.12], [0.95, 0.10], [0, 0]],
                },
                layout_head: {
                    img_jiachuiText : {
                        _run:function() {
                            MjClient.playui.showOrHideJiachuiText(this, MjClient.playui.getUIOffByNode(this));
                        },
                        _event:{
                            initSceneData: function() {
                                MjClient.playui.showOrHideJiachuiText(this, MjClient.playui.getUIOffByNode(this));
                            },
                            MJJiazhu: function() {
                                MjClient.playui.showOrHideJiachuiText(this, MjClient.playui.getUIOffByNode(this));
                            },
                            mjhand: function() {
                                this.visible = false;
                            }
                        }
                    }
                }
            },
		};

		return jsBind;
	},

    //@Override
    updateRoundLabel : function(node) {
        node.visible = false;
        var tData = MjClient.data.sData.tData;
        if (MjClient.playui.isCoinField()) {
            return;
        }

        if (!this.isInPlay() && tData.tState != TableState.roundFinish) {
            return;
        }

        node.visible = true;
        node.setString("第" + (tData.roundAll - (tData.roundNum - 1)) + "局");
    }
});

playPanel_shaoYangBoPi.prototype.removeShuffleNode = function() {
    this.shuffleNode.removeFromParent(true);
    this.shuffleNode = null;
};

playPanel_shaoYangBoPi.prototype.playShuffleEffect = function() {
    if(this.isPlayShuffle || this.shuffleList.length <= 0) {
        return;
    }

    this.isPlayShuffle = true;
    if(!this.shuffleNode) {
        this.shuffleNode = new ShuffleEffectLayer();
        this.jsBind._node.addChild(this.shuffleNode, 499);
    }

    this.shuffleNode.visible = true;
    var uid = this.shuffleList[0];
    this.shuffleList.splice(0, 1);
    this.shuffleNode.playEffect(uid);

    this.scheduleOnce(function(){
        this.isPlayShuffle = false;
        if(this.shuffleNode) {
            this.shuffleNode.visible = false;
        }
        this.playShuffleEffect();
    }, 1.6);
};

// Override 获取玩法描述(桌面 邀请 结算)
playPanel_shaoYangBoPi.prototype.getGameCnDesc = function(ignoreType) {
    ignoreType = ignoreType || 0; // 只能默认0

    var tData = MjClient.data.sData.tData;
    var areaSelectMode = JSON.parse(JSON.stringify(tData.areaSelectMode));
    var ignoreMode = this.getIgnoreMode(ignoreType);
    for (var i = 0; i < ignoreMode.length; i++) {
        delete areaSelectMode[ignoreMode[i]];
    }

    var desc = "";
    for (var k in areaSelectMode) {
        var str = getGameCnDesc(tData.gameType, k, areaSelectMode[k], areaSelectMode);
        if(k == "isMaiPai" && tData.maxPlayer != 2 && this.isInPlay()) {
            continue;
        }
        if (str) {
            desc += str + ",";
        }
    }
    desc = desc.replace(/,$/, "");

    return desc;
};

playPanel_shaoYangBoPi.prototype.showOrHideJiachuiText = function(node, off) {
    node.visible = false;
    var tData = MjClient.data.sData.tData;
    var pl = this.getUIPlayer(off);
    if (!pl) {
        return;
    }
    if (tData.tState == TableState.waitJiazhu) {
        if (pl.jiachuiNum == 0) {
            node.loadTexture("playing/other/jiachui_text_0.png");
            node.visible = true;
        } 
        else {
            if (pl.jiachuiNum == 1) {
                node.loadTexture("playing/other/jiachui_text_1.png");
                node.visible = true;
            } 
        }    
    }
}

//检测距离信息
playPanel_shaoYangBoPi.prototype.checkCanShowDistance = function(layoutData) {
	var disLayer = this.disLayer;
	if (disLayer) {
		disLayer.removeFromParent();
		this.disLayer = null;
	}

	var tState = MjClient.data.sData.tData.tState;
	if (!tState || tState > TableState.waitReady) {
		return;
	}
	if (MjClient.data.sData.tData.fieldId) {
		return;
	}
	if (MjClient.timeoutShowDistanceID) {
		clearTimeout(MjClient.timeoutShowDistanceID);
		MjClient.timeoutShowDistanceID = null;
	}

	if (this.getPlayersNum() == 3) {
		disLayer = new Distance3PlayerLayer(layoutData);
	} else if (this.getPlayersNum() == 4) {
		disLayer = new DistanceLayer(layoutData);
	} else {
		return;
	}
	this.disLayer = disLayer;
	this.addChild(disLayer);
};

//字牌字体列表
playPanel_shaoYangBoPi.prototype.getCardFontList = function() {
    return ["type1", "type2", "type3"];
};

//Override
playPanel_shaoYangBoPi.prototype.getInitDiPaiCount = function() {
	var tData = MjClient.data.sData.tData;
	if (tData.maxPlayer == 4 && !tData.areaSelectMode.zuoXing) {
		return MjClient.majiang.getAllCardsTotal() - tData.maxPlayer * 14;
	}else if (tData.maxPlayer == 4 && tData.areaSelectMode.zuoXing) {
        return MjClient.majiang.getAllCardsTotal() - 3 * 20;
    }  else {
		return MjClient.majiang.getAllCardsTotal() - tData.maxPlayer * 20;
	}
};

//Override
playPanel_shaoYangBoPi.prototype.checkChuiFlagVisible = function(node) {
	var off = this.getUIOffByNode(node);
	var pl = this.getUIPlayer(off);
	var tData = MjClient.data.sData.tData;
	if (!pl || !tData.areaSelectMode.isJiaChui) {
		node.visible = false;
		return;
	}

	node.visible = true;
	if (pl.jiachuiNum == 1) {
		node.loadTexture("playing/ziPaiBanner/chui.png");
	} else {
		if (pl.jiachuiNum == -1) {
			node.visible = false;
		}
		node.loadTexture("playing/ziPaiBanner/buchui.png");
	}
};

//Override 
playPanel_shaoYangBoPi.prototype.initSettingData = function() {
	MjClient.KEY_ZI_PAI_CARD_SIZE = "KEY_ZI_PAI_HAND_SIZE_TYPE"; //字牌游戏字体大小类型
	MjClient.KEY_ZI_PAI_PLAY_TING_PAI = "KEY_ZI_PAI_TING_PAI_TYPE"; //字牌游戏 听牌开关
	MjClient.KEY_ZI_PAI_PLAY_UI_LAYOUT = "KEY_ZI_PAI_PLAY_UI_LAYOUT"; //字牌布局
	MjClient.KEY_ZI_PAI_GAME_BG_TYPE = "KEY_ZI_PAI_GAME_BG_TYPE"; //字牌游戏背景类型
	MjClient.KEY_ZI_PAI_ZI_PAI_TYPE = "KEY_ZI_PAI_ZI_PAI_TYPE"; //字牌游戏字体类型
	MjClient.KEY_ZI_PAI_FAST_EAT_TYPE = "KEY_ZI_PAI_FAST_EAT_TYPE"; //字牌游戏快速吃牌类型
	MjClient.KEY_ZI_PAI_HU_XI_TYPE = "KEY_ZI_PAI_HU_XI_TYPE"; //字牌游戏 显示胡息
	MjClient.KEY_ZI_PAI_XU_XIAN_TYPE = "KEY_ZI_PAI_XU_XIAN_TYPE"; //字牌游戏 虚线位置
	MjClient.KEY_ZI_PAI_SU_DU_TYPE = "KEY_ZI_PAI_SU_DU_TYPE"; //字牌游戏 动画速度
	MjClient.KEY_ZI_PAI_DOUBLE_CLICK_TYPE = "KEY_ZI_PAI_DOUBLE_CLICK_TYPE"; //字牌游戏 双击出牌
};

//Override
playPanel_shaoYangBoPi.prototype.isShowLongCard = function() {
	return true;
};

//获取听的牌
playPanel_shaoYangBoPi.prototype.getTingCards = function(sData, pl, putCard) {
	return MjClient.huzi.getTingCards(sData, pl, putCard);
};

/**
 * 计算听牌提示
 */
playPanel_shaoYangBoPi.prototype.calculateHintPutList = function() {
	MjClient.hintPutList_ziPai = MjClient.huzi.hintPutCardsToTing();
};

//Override
playPanel_shaoYangBoPi.prototype.createGameOverLayer = function(type) {
	return new GameOverLayer_syZiPai();
};

//Override
playPanel_shaoYangBoPi.prototype.createEndOneLayer = function(type) {
	if (this.isCoinField()) {
		return new EndOneView_ziPaiGold();
	}
	return new EndOneView_syZiPai();
};

//字牌字体idx
playPanel_shaoYangBoPi.prototype.getCardFontIdx = function() {
    return util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_ZI_PAI_TYPE, 2);
};

//布局类型
playPanel_shaoYangBoPi.prototype.getLayoutType = function() {
    return util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_PLAY_UI_LAYOUT, 0);
};

//Override
playPanel_shaoYangBoPi.prototype.getGameBgList = function() {
	return ["playing/gameTable/beijing_1.jpg", "playing/gameTable/beijing_2.jpg", "playing/gameTable/beijing_3.jpg"];
};

//Override
playPanel_shaoYangBoPi.prototype.getGameBgIdx = function() {
	return util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_GAME_BG_TYPE, 0);
};

//Override
playPanel_shaoYangBoPi.prototype.getHuXiType = function() {
    var idx = util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_HU_XI_TYPE, 0);
    return [1, 0][idx];
};

//Override
playPanel_shaoYangBoPi.prototype.getXuXianType = function() {
    return util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_XU_XIAN_TYPE, 1);
};

//Override
playPanel_shaoYangBoPi.prototype.getSuDuType = function() {
    var old = util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_SU_DU_TYPE, 2);
    return [2,0,1,3][old];
};

//Override
playPanel_shaoYangBoPi.prototype.getTingPaiType = function() {
    var idx = util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_PLAY_TING_PAI, 1);
    return [1, 0][idx];
};

//test
playPanel_shaoYangBoPi.prototype.addOneHandCard = function(col, row, cardNum, off) {
    var uiNode = this.getUINode(off);
    //根据牌的类型获得需要添加的节点
    var layout_handCards = uiNode.getChildByName("layout_handCards");
    //取一个对应的牌节点
    var newCard = this.getCardNodeFromList(layout_handCards.cardList, cardNum);
    if (!newCard) {
        // cc.log("chow", "newCard");
        newCard = this.getNewCard("hand", cardNum, off);
    } else {
        // cc.log("chow", "getCard");
    }
    var scale_y = newCard.scaleY;

    var cardParent = layout_handCards.getChildByTag(col);
    if (!cardParent) {
        cardParent = this.getCardRoot(layout_handCards.cardRoot, col);
        if (!cardParent) {
            // cc.log("chow", "newRoot");
            cardParent = new cc.Node();
            cardParent.tag = col;
            cardParent.width = newCard.width;
            layout_handCards.addChild(cardParent);
        } else {
            // cc.log("chow", "getRoot from list");
            layout_handCards.addChild(cardParent);
        }
        cardParent.zIndex = 0;
    } else {
        // cc.log("chow", "getRoot from parent");
    }

    if (MjClient.movingCard_paohuzi == newCard) {
        if (this.isShowLongCard()) {
            var src = this.getCardSrc("hand", newCard.tag, false);
            this.loadCardTexture(newCard, src, this.getResType());
            newCard.scale = cc.director.getWinSize().width / 1280;
        }
    }

    var beginPoint = cc.p(0, 0);
    var off_y = newCard.height * scale_y - newCard.height / 4 * scale_y
    var cardCount = cardParent.childrenCount;

    newCard.setName(row);
    newCard.zIndex = 4 - row;
    newCard.anchorX = 0;
    newCard.anchorY = 0;
    //newCard.x = beginPoint.x;
    //newCard.y = beginPoint.y + cardCount * off_y;
    cardParent.addChild(newCard);
    if (newCard.lastPosition) {
        newCard.setPosition(cardParent.convertToNodeSpace(newCard.lastPosition));
        this.doMoveToAction(newCard, cc.p(beginPoint.x, beginPoint.y + cardCount * off_y));
    } else {
        newCard.x = beginPoint.x;
        newCard.y = beginPoint.y + cardCount * off_y;
    }

    if(MjClient.playui.getTouchType() != 1){
        //newCard.opacity = 255;
        this.setCardTouchHandler(newCard, off);
	}


    var pl = this.getUIPlayer(off);
    if (pl && pl.canNotPutCard) {
        if (pl.canNotPutCard.indexOf(cardNum) != -1) {
            newCard.setColor(cc.color(170, 170, 170));
        }
    }
    if(MjClient.playui.getTouchType() != 1) {
        newCard.setTouchEnabled(true);
        newCard.runAction(cc.sequence(cc.delayTime(0.5), cc.callFunc(function () {
            if (!newCard.isRunning()) {
                newCard.setTouchEnabled(false);
            }
            if (!newCard.isTouchEnabled()) {
                newCard.setTouchEnabled(true);
            }
            cc.director.getEventDispatcher().resumeTarget(newCard);
        })));
    }
    //cc.log("chow", "addOrAdjustHandCard_hengYang: name=" + newCard.getName() + " num=" + newCard.num + " tag =" + newCard.tag);
};

//test
playPanel_shaoYangBoPi.prototype.getHandCardListener = function () {
    return {
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        swallowTouches: false,
        onTouchBegan: function(touch, event){
			return MjClient.playui.updateHandCardByTouchBegan(touch, event);
        },
        onTouchMoved:function (touch, event) {
            MjClient.playui.updateHandCardByTouchMoved(touch, event);
        },
        onTouchEnded:function (touch, event) {
			MjClient.playui.updateHandCardByTouchEndnd(touch, event);
        },
        onTouchCancelled: function(touch, event){
            MjClient.playui.updateHandCardByTouchEndnd(touch, event);
		}
    };
};

//test
playPanel_shaoYangBoPi.prototype.isHandKan = function (cardNum){
    var pl = this.getUIPlayer(0);
    var dict = {};
    for (var i = 0; i < pl.mjhand.length; i++) {
        var cd = pl.mjhand[i];
        dict[cd] = dict[cd] ? dict[cd] + 1 : 1;
    }

    if (dict[cardNum] >= 3) {
        return true;
    }
    return false;
};

//test
playPanel_shaoYangBoPi.prototype.updateHandCardByTouchBegan = function (touch, event){
    var point = touch.getLocation();
    //cc.log("chow onTouchBegan", "world point = " + JSON.stringify(point));
    if(MjClient.movingCard_paohuzi == null){
        var uiNode = MjClient.playui.getUINode(0);
        var layout_handCards = uiNode.getChildByName("layout_handCards");
        for(var i = 0; i < layout_handCards.children.length; i++){
            var colNode = layout_handCards.children[i];
            for(var  j = 0; j < colNode.children.length; j++){
                var card = colNode.children[j];
                var nodePoint = colNode.convertToNodeSpace(point);
                //cc.log("chow onTouchBegan", "nodePoint = " + JSON.stringify(nodePoint));
                //cc.log("chow onTouchBegan", "card = " + JSON.stringify(card.getBoundingBox()));
                if(cc.rectContainsPoint(card.getBoundingBox(), nodePoint)
                    && ((card.tag >= 1 && card.tag <= 10) || (card.tag >= 21 && card.tag <= 30))
                    && !MjClient.playui.isHandKan(card.tag)){
                    MjClient.movingCard_paohuzi = card;

                    card.setAnchorPoint(0.5, 0.5);
                    card.x += card.width * card.scaleX * 0.5;
                    card.y += card.height * card.scaleY * 0.5;

                    if (MjClient.playui.isShowLongCard()) { // 显示长牌
                        var alignWidth = card.scale * card.width;
                        var src = MjClient.playui.getCardSrc("put", card.tag, false);
                        card.loadTexture(src);
                        card.scale = alignWidth / card.width;
                        var tingSign = card.getChildByName("tingSign");
                        if (cc.sys.isObjectValid(tingSign) && tingSign.isVisible()) {
                            tingSign.y = card.getContentSize().height;
                        }
                    }
                    return true;
                }
            }
        }
    }
    return false;
};

//test
playPanel_shaoYangBoPi.prototype.updateHandCardByTouchMoved = function (touch, event){
    //cc.log("chow onTouchMoved", "getDelta = " + JSON.stringify(touch.getDelta()));
    if(MjClient.movingCard_paohuzi){
        MjClient.movingCard_paohuzi.setPosition(cc.pAdd(touch.getDelta(), MjClient.movingCard_paohuzi.getPosition()));
    }
};

//test
playPanel_shaoYangBoPi.prototype.updateHandCardByTouchEndnd = function (touch, event){
	var btn = MjClient.movingCard_paohuzi;
    if(btn && cc.sys.isObjectValid(btn)){
        MjClient.moveCard = {};
        MjClient.moveCard.curPosition = btn.parent.convertToWorldSpace(cc.p(btn.x - btn.anchorX * btn.width * btn.scaleX, btn.y - btn.anchorY * btn.height * btn.scaleY));
        var col = MjClient.moveCard.curCIndex = MjClient.moveCard.nexCIndex = btn.parent.tag;
        var row = MjClient.moveCard.curRIndex = MjClient.moveCard.nexRIndex = btn.name;
        var pos = btn.parent.convertToWorldSpace(btn.getPosition());
        var card = btn.tag;

        if (MjClient.playui.isShowLongCard()) {
            var src = MjClient.playui.getCardSrc("hand", btn.tag, false);
            btn.loadTexture(src);
            btn.scale = cc.director.getWinSize().width / 1280;
        }

        if (!Array.isArray(MjClient.HandCardArr[col]) || MjClient.HandCardArr[col][row] != card) {
            MjClient.playui.checkTingCards();
            MjClient.playui.refreshHandCard(0);
            delete MjClient.moveCard;
            return;
        }
        var tData = MjClient.data.sData.tData;

        // 出牌
        if (!MjClient.hasPut && IsTurnToMe() && tData.tState == TableState.waitPut && pos.y > MjClient.playui.jsBind.img_cutLine._node.y) {
            function doPut() {
                var putNode = MjClient.playui.getUINode(0).getChildByName("img_putCard");
                putNode.stopAllActions();
                putNode.visible = true;
                putNode.opacity = 255;
                putNode.getChildByName("img_card").loadTexture(MjClient.playui.getCardSrc("put", card, false)); // todo
                putNode.loadTexture("playing/paohuzi/chupai_bj.png");

                var pos = putNode.getUserData().pos;
                putNode.setScale(putNode.getUserData().scale);
                putNode.setPosition(btn.parent.convertToWorldSpace(btn.getPosition()));
                putNode.runAction(cc.moveTo(MjClient.playui.getActionTime(), pos.x, pos.y));
                // tood 背光

                btn.removeFromParent(true);

                if (!Array.isArray(MjClient.HandCardArr[col]) || MjClient.HandCardArr[col][row] != card) {
                    putNode.visible = false;
                    MjClient.playui.checkTingCards();
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

            if (MjClient.playui.isOtherWei(card)) {
                MjClient.showMsg("放偎之后这局将不能再吃碰，是否确定？", function() {
                    doPut();
                    MjClient.playui.refreshHandCard(0);
                    delete MjClient.moveCard;
                }, function() {
                    btn.setAnchorPoint(0, 0);
                    MjClient.playui.checkTingCards();
                    MjClient.playui.refreshHandCard(0);
                    delete MjClient.moveCard;
                }, "1");

                return;
            } else {
                doPut();
            }
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
        } else {
            MjClient.playui.checkTingCards();
        }
        MjClient.playui.refreshHandCard(0);

        MjClient.addGroupIndex = -1;
        delete MjClient.moveCard;
    }
    MjClient.movingCard_paohuzi = null;
    //cc.log("chow onTouchEnded", "MjClient.movingCard_paohuzi = " + MjClient.movingCard_paohuzi);
};

//test
playPanel_shaoYangBoPi.prototype.getTouchType = function(){
	return 0;
};

playPanel_shaoYangBoPi.prototype.isAniParallel = function() {
    return false;
};

// 发牌间隔
playPanel_shaoYangBoPi.prototype.getSendCardInterval = function() {
    var areaSelectMode = MjClient.data.sData.tData.areaSelectMode;
    if ([0, 1, 2].indexOf(areaSelectMode.faPai) < 0) {
        return 1;
    }

    return [1.5, 1.1, 0.8][areaSelectMode.faPai];
};

playPanel_shaoYangBoPi.prototype.getResType = function () {
  return 1;
};

playPanel_shaoYangBoPi.prototype.changeEatBtnLayout = function(btnNode, len, idx) {
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

//Override
playPanel_shaoYangBoPi.prototype.getHandCount = function() {
    var tData = MjClient.data.sData.tData;
    if(tData.maxPlayer == 4 && !tData.areaSelectMode.zuoXing) {
        return 14;
    }

    return 20;
}

playPanel_shaoYangBoPi.prototype.isCheckTingStats = function() {
    return true;
}

playPanel_shaoYangBoPi.prototype.isUpdateXingPlayer = function (off) {
    return this.getIndexInUids(off) == MjClient.data.sData.tData.xingPlayer && MjClient.data.sData.tData.curPlayer == MjClient.data.sData.tData.zhuang;
};

// 更新手牌(收入亮张)
playPanel_shaoYangBoPi.prototype.updateHandCardByPick = function(node, msg) {
    var off = this.getUIOffByNode(node);
    if (!this.isCurPlayer(off) && !this.isUpdateXingPlayer(off)) {
        if (off == 0) {
            this.refreshHandCard(off);
        }
        return;
    }

    if (MjClient.rePlayVideo == -1 && off != 0) {
        return;
    }

    MjClient.hasPut = true; // 屏蔽出牌
    var self = this;
    setTimeout(function() {
        if (off == 0) {
            var pl = self.getUIPlayer(off);
            if(self.isUpdateXingPlayer(off)){
                pl.mjhand.push(msg.card);
            }
            MjClient.HandCardArr = MjClient.majiang.sortCard(pl.mjhand, 1);
        }
        self.initHandCards(node, msg);
        setTimeout(()=>{
            MjClient.hasPut = false;
        }, 0.3);
    }, this.getActionTime());
};


// 更新手牌 (出牌)
playPanel_shaoYangBoPi.prototype.updateHandCardByPut = function(node) {
    var off = this.getUIOffByNode(node);
    if (!this.isCurPlayer(off) && !this.isUpdateXingPlayer(off)) {
        return;
    }

    if (off == 0) {
        this.removeTingSign();
    }

    // 牌局中别人出牌
    if (MjClient.rePlayVideo == -1 && off != 0) {
        return;
    }

    MjClient.hasPut = false; // todo
    // 牌局中自己手动出牌
    if (MjClient.rePlayVideo == -1 && off == 0 && !this.isInTrust(SelfUid()) && !this.isUpdateXingPlayer(off)) {
        return;
    }

    // 移除手牌
    this.removeHandCard(MjClient.data.sData.tData.currCard, off);
    this.refreshHandCard(off);
};

playPanel_shaoYangBoPi.prototype.updateHandCardByEat = function(node, eatType, msg) {
    var off = this.getUIOffByNode(node);
    if (!this.isCurEatPlayer(msg, off) && !this.isUpdateXingPlayer(off)) {
        return;
    }

    eatType = this.apartGangType(eatType, msg);
    if(this.isUpdateXingPlayer(off)){
        var tData = MjClient.data.sData.tData;
        var zhuangOff = this.getUIOffByUid(tData.uids[tData.zhuang]);
        var cardArr = this.getEatCardArr(eatType, zhuangOff);
        this.removeXingHandCardByEat(eatType, cardArr, msg, off, zhuangOff);
    }else{
        var cardArr = this.getEatCardArr(eatType, off);
        this.removeEatArrFromHand(eatType, cardArr, msg, off);
    }
    this.refreshHandCard(off);
};

playPanel_shaoYangBoPi.prototype.removeXingHandCardByEat = function(eatType, cardArr, msg, off, zhuangOff) {
    var card = this.getEatCard(eatType, zhuangOff);
    if (eatType == "mjchi") {
        this.removeChiFromHand(cardArr, card, off);
    } else if (eatType == "mjpeng") {
        this.removePengFromHand(card, off);
    } else if (eatType == "mjgang0" || eatType == "mjgang1" || eatType == "mjgang2") {
        this.removeGangFromHand(eatType, card, off);
    } else if (eatType == "mjwei") {
        this.removeWeiFromHand(card, msg, off);
    } else {
        this.removeExtendFromHand(eatType, cardArr, card, msg, off);
    }
};

playPanel_shaoYangBoPi.prototype.showOutCardAnimation = function(node) {
    if(node.isPick){
        delete node.isPick;
        return;
    }
    var off = this.getUIOffByNode(node);
    var tData = MjClient.data.sData.tData;
    var lastPlayer = (tData.curPlayer - 1 + tData.maxPlayer) % tData.maxPlayer;
    if(lastPlayer == tData.xingPlayer){
        lastPlayer = (lastPlayer - 1 + tData.maxPlayer) % tData.maxPlayer;
    }
    if (this.getIndexInUids(off) != lastPlayer) { // 不是发牌玩家上家
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

    var anmEndPos = outLayout.convertToWorldSpace(cc.p(endPos.x, endPos.y)); // 动画结束坐标
    var actTime = this.getAniTimeByType("land");
    outCard.setOpacity(0);
    outCard.setScale(0.4);
    var spa = cc.spawn(cc.fadeIn(0.05), cc.scaleTo(0.05, 1));
    outCard.runAction(cc.sequence(cc.delayTime(actTime - 0.05), spa, cc.callFunc(function() {
        outCard.visible = true;
        this.addOutFrame(outCard, pl, pl.mjput.length - 1);
    }.bind(this))));

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

// 更新手牌(补牌)
playPanel_shaoYangBoPi.prototype.updateHandCardByAdd = function(node, msg) {
    var off = this.getUIOffByNode(node);
    var pl = this.getUIPlayer(off);
    if (!pl || msg.uid != pl.info.uid) {
        return;
    }

    // 牌局中别人补牌
    if (MjClient.rePlayVideo == -1 && off != 0) {
        return;
    }

    if (off == 0) {
        if(this.isUpdateXingPlayer(off)){
            MjClient.HandCardArr.push(msg.cardList);
            var mjhand = [];
            for(var i = 0; i < MjClient.HandCardArr.length; i++){
                mjhand = mjhand.concat(MjClient.HandCardArr[i]);
            }
            MjClient.HandCardArr = MjClient.majiang.sortCard(mjhand, 1);
        }else{
            MjClient.HandCardArr = MjClient.majiang.sortCard(pl.mjhand, 1);
        }
    } else {
        MjClient.OtherHandArr[off].push(msg.cardList);
        var mjhand = [];
        for(var i = 0; i < MjClient.OtherHandArr[off].length; i++){
            mjhand = mjhand.concat(MjClient.OtherHandArr[off][i]);
        }
        MjClient.OtherHandArr[off] = MjClient.majiang.sortCard(mjhand, 1);
    }
    this.refreshHandCard(off);
};

// 庄
playPanel_shaoYangBoPi.prototype.checkZhuangVisible = function(node) {
    var tData = MjClient.data.sData.tData;
    node.visible = false;
    if (!this.isInPlay()) {
        return;
    }

    var off = this.getUIOffByNode(node);
    var pl = this.getUIPlayer(off);
    if (!pl) {
        return;
    }

    if (tData.uids[tData.zhuang] == pl.info.uid) {
        node.loadTexture("playing/ziPaiBanner/zhuang.png");
        node.visible = true;
    }else if(tData.uids[tData.xingPlayer] == pl.info.uid){
        node.loadTexture("playing/ziPaiBanner/xing.png");
        node.visible = true;
    }
};

playPanel_shaoYangBoPi.prototype.getMjhandDelay = function() {
     return 2;
};