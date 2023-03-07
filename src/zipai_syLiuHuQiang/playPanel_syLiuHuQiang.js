//新版邵阳六胡抢
var playPanel_syLiuHuQiang = playLayer_ziPai.extend({
	ctor: function() {
		this._super("Play_shaoYangLiuHuQiang.json");
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
				roundEnd: function() {
		            var self = this;
		            var sData = MjClient.data.sData;
		            var tData = sData.tData;
		            var delayTime = 0;
		            if( tData.hunCard && tData.hunCard != -1 && tData.areaSelectMode.xingType==2){
	                    delayTime = 1.8;
	                    var hunCard = sData.cards[tData.cardNext];
	                    if(!hunCard){
	                        hunCard = tData.lastPutCard;
	                    }
	                    MjClient.playui.showFanXing(hunCard);
	                }

	                function delayExe(){
			            if (MjClient.data.sData.tData.roundNum <= 0 && !MjClient.playui.isCoinField()) {
			                var layer = MjClient.playui.createGameOverLayer();
			                layer.setVisible(false);
			                self.addChild(layer, 500);
			            }

			            if (!MjClient.endoneui) {
			                self.addChild(MjClient.playui.createEndOneLayer(), 500);
			            }
	                }
	                this._delayExeAction = this.runAction(cc.sequence(cc.delayTime(delayTime),cc.callFunc(delayExe)));
		        },
		        initSceneData: function() {
		        	if (this._delayExeAction && cc.sys.isObjectValid(this._delayExeAction)){
	                    this.stopAction(this._delayExeAction);
	                    delete this._delayExeAction;
	                }
		            CheckRoomUiDelete(); // 公用代码todo
		            sendGPS();
		            MjClient.checkChangeLocationApp();
		        },
		        LeaveGame: function() {
		        	if (this._delayExeAction && cc.sys.isObjectValid(this._delayExeAction)){
	                    this.stopAction(this._delayExeAction);
	                    delete this._delayExeAction;
	                }

		            MjClient.addHomeView();
		            MjClient.playui.removeFromParent(true);
		            stopEffect(); // 公用代码todo
		            playTimeUpEff = null;
		            delete MjClient.playui;
		            delete MjClient.endoneui;
		            delete MjClient.endallui;
		            cc.audioEngine.stopAllEffects();
		            playMusic("bgMain"); // 公用代码todo
		        },
			},
			img_banner: {
				btn_setting: {
					_click: function() {
						MjClient.Scene.addChild(new settingPanel_syLiuHuQiang(), 6000);
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
            text_roundInfo: {
                _run:function () {
                    if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ) {
                        this.visible = false;
                    }
                }
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
            node_left:{
                layout_eatDisplay: {
                    _layout: [[0.12, 0.12], [0.04, 0.93], [0, 0]],
                }
            },
            node_right:{
                layout_eatDisplay: {
                    _layout: [[0.12, 0.12], [0.95, 0.91], [0, 0]],
                }
            },
            node_down:{
                layout_eatDisplay: {
                    _layout: [[0.12, 0.12], [0.5, 0.45], [0, 0]],
                    img_fanXing: {
                        _visible: false
                    },
                },
                img_putCard: {
                    _layout: [[0.35, 0.35], [0.65, 0.6], [0, 0]]
                },
                img_xingCard: {
	                _visible: false,
	                _run:function()
	                {
	                    setWgtLayout(this, [0.35, 0.35], [0.5, 0.6], [0, 0]);
	                    var userData = {scale:this.getScale(), pos:this.getPosition()};
	                    this.setUserData(userData);
	                }
	            },
            },
            node_xing:{
                layout_eatDisplay: {
                    _layout: [[0.12, 0.12], [0.95, 0.10], [0, 0]],
                }
            },
            layout_cardNum: {
		        img_card: {
		            _run: function() {
		                this.refreshCardsTotal = function(isRemove) {
		                    var tData = MjClient.data.sData.tData;
		                    var cardsTotal = MjClient.playui.getInitDiPaiCount();
		                    var left = MjClient.majiang.getAllCardsTotal() - tData.areaSelectMode.maiPaiNum - tData.cardNext;
		                    if (isRemove) {
		                        var children = this.getChildren();
		                        var count = this.getChildrenCount();
		                        var factRemoveCount = (cardsTotal - left) / (cardsTotal / 20);
		                        if (Math.floor(count + factRemoveCount) > 20) {
		                            children[count - 1].removeFromParent(true);
		                        }
		                    } else {
		                        this.removeAllChildren();
		                        left = left / (cardsTotal / 20);
		                        for (var i = 1; i <= left; i++) {
		                            var child = ccui.ImageView("playing/ziPaiBanner/paidui.png");
		                            child.setPosition(cc.p(this.width / 2, this.height / 2 + i * 0.8));
		                            this.addChild(child);
		                        }
		                    }
		                }
		            }
		        },
		        text_cardNum: {
		            _run: function() {
		                this.ignoreContentAdaptWithSize(true);
		                this.refreshText = function() {
		                    var tData = MjClient.data.sData.tData;
		                    if (tData) {
 		                        this.setString(MjClient.majiang.getAllCardsTotal() - tData.areaSelectMode.maiPaiNum - tData.cardNext);
		                    }

		                    var img_card = this.getParent().getChildByName("img_card");
		                    this.y = 40 + img_card.getChildrenCount() * 0.8;
		                };
		                this.refreshText();
		            },
		        },
		    }
		};

		return jsBind;
	}
});

//检测距离信息
playPanel_syLiuHuQiang.prototype.checkCanShowDistance = function(layoutData) {
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
playPanel_syLiuHuQiang.prototype.getCardFontList = function() {
    return ["type1", "type2", "type3"];
};

//Override
playPanel_syLiuHuQiang.prototype.getInitDiPaiCount = function() {
	var tData = MjClient.data.sData.tData;
    var diPaiCount = MjClient.majiang.getAllCardsTotal();

	// if (tData.areaSelectMode.isMaiPai) {
 //        diPaiCount -= 20;
 //    }
    diPaiCount -= tData.areaSelectMode.maiPaiNum

    diPaiCount = diPaiCount - tData.maxPlayer * (tData.areaSelectMode.is21Zhang ? 20 : 14);
    return diPaiCount;
};

//Override 
playPanel_syLiuHuQiang.prototype.initSettingData = function() {
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
playPanel_syLiuHuQiang.prototype.isShowLongCard = function() {
	return true;
};

playPanel_syLiuHuQiang.prototype.isCheckTingStats = function() {
    return true;
}

//获取听的牌
playPanel_syLiuHuQiang.prototype.getTingCards = function(sData, pl, putCard) {
	return MjClient.huzi.getTingCards(sData, pl, putCard);
};

/**
 * 计算听牌提示
 */
playPanel_syLiuHuQiang.prototype.calculateHintPutList = function() {
	MjClient.hintPutList_ziPai = MjClient.huzi.hintPutCardsToTing();
};

//Override
playPanel_syLiuHuQiang.prototype.createGameOverLayer = function(type) {
	return new GameOverLayer_syZiPai();
};

//Override
playPanel_syLiuHuQiang.prototype.createEndOneLayer = function(type) {
	return new EndOneView_syZiPai();
};

//字牌字体idx
playPanel_syLiuHuQiang.prototype.getCardFontIdx = function() {
    return util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_ZI_PAI_TYPE, 2);
};

//布局类型
playPanel_syLiuHuQiang.prototype.getLayoutType = function() {
    return util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_PLAY_UI_LAYOUT, 0);
};

//Override
playPanel_syLiuHuQiang.prototype.getGameBgList = function() {
	return ["playing/gameTable/beijing_1.jpg", "playing/gameTable/beijing_2.jpg", "playing/gameTable/beijing_3.jpg"];
};

//Override
playPanel_syLiuHuQiang.prototype.getGameBgIdx = function() {
	return util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_GAME_BG_TYPE, 0);
};

//Override
playPanel_syLiuHuQiang.prototype.getHuXiType = function() {
    var idx = util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_HU_XI_TYPE, 0);
    return [1, 0][idx];
};

//Override
playPanel_syLiuHuQiang.prototype.getXuXianType = function() {
    return util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_XU_XIAN_TYPE, 1);
};

//Override
playPanel_syLiuHuQiang.prototype.getSuDuType = function() {
    var old = util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_SU_DU_TYPE, 2);
    return [2,0,1,3][old];
};

//Override
playPanel_syLiuHuQiang.prototype.getTingPaiType = function() {
    var idx = util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_PLAY_TING_PAI, 1);
    return [1, 0][idx];
};

playPanel_syLiuHuQiang.prototype.isAniParallel = function() {
    return false;
};

playPanel_syLiuHuQiang.prototype.showFanXing = function(card){
	var tData = MjClient.data.sData.tData;
	var node = MjClient.playui._downNode.getChildByName("img_xingCard");

	var imgCard = node.getChildByName("img_card"); // 牌
    var src = this.getCardSrc("put", card, false);
    imgCard.loadTexture(src, 0);
    node.visible = true;

    var pos = MjClient.playui.jsBind.layout_cardNum._node.getPosition();
    var actTime = this.getAniTimeByType("send");

    node.setPosition(pos);
    node.stopAllActions();
    node.setScale(0);
    var seq = cc.sequence(
        cc.spawn(cc.scaleTo(actTime, node.getUserData().scale), cc.moveTo(actTime, node.getUserData().pos)).easing(cc.easeCubicActionOut()),
        cc.delayTime(1.8 - actTime),
        cc.callFunc(function() {
        	node.visible = false;
        })
    );
    node.runAction(seq);


    var layout_eatCards = MjClient.playui._downNode.getChildByName("layout_eatDisplay");
    var eatLabel = layout_eatCards.getChildByName("img_fanXing");
    eatLabel.visible = true;
	eatLabel.runAction(cc.sequence(cc.delayTime(1.6), cc.callFunc(() => {
	        eatLabel.visible = false;
	})));
};

playPanel_syLiuHuQiang.prototype.changeEatBtnLayout = function(btnNode, len, idx) {
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

//Override 手牌张数 
playPanel_syLiuHuQiang.prototype.getHandCount = function() {
    return MjClient.data.sData.tData.areaSelectMode.is21Zhang ? 20 : 14;
}