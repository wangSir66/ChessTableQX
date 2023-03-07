//新版剥皮
var playPanel_DaZiBoPi = playLayer_ziPai.extend({
	ctor: function() {
		this._super("Play_DaZiBoPi.json");

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
						MjClient.Scene.addChild(new settingPanel_DaZiBoPi(), 6000);
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

// Override 获取玩法描述(桌面 邀请 结算)
playPanel_DaZiBoPi.prototype.getGameCnDesc = function(ignoreType) {
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

playPanel_DaZiBoPi.prototype.showOrHideJiachuiText = function(node, off) {
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
playPanel_DaZiBoPi.prototype.checkCanShowDistance = function(layoutData) {
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
playPanel_DaZiBoPi.prototype.getCardFontList = function() {
    return ["type1", "type2", "type3"];
};

//Override
playPanel_DaZiBoPi.prototype.getInitDiPaiCount = function() {
	var tData = MjClient.data.sData.tData;
    return MjClient.majiang.getAllCardsTotal() - tData.maxPlayer * 14;
};

//Override
playPanel_DaZiBoPi.prototype.checkChuiFlagVisible = function(node) {
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
playPanel_DaZiBoPi.prototype.isShowLongCard = function() {
	return true;
};

//获取听的牌
playPanel_DaZiBoPi.prototype.getTingCards = function(sData, pl, putCard) {
	return MjClient.huzi.getTingCards(sData, pl, putCard);
};

/**
 * 计算听牌提示
 */
playPanel_DaZiBoPi.prototype.calculateHintPutList = function() {
	MjClient.hintPutList_ziPai = MjClient.huzi.hintPutCardsToTing();
};

//Override
playPanel_DaZiBoPi.prototype.createGameOverLayer = function(type) {
	return new GameOverLayer_syZiPai();
};

//Override
playPanel_DaZiBoPi.prototype.createEndOneLayer = function(type) {
	if (this.isCoinField()) {
		return new EndOneView_ziPaiGold();
	}
	return new EndOneView_syZiPai();
};

//字牌字体idx
playPanel_DaZiBoPi.prototype.getCardFontIdx = function() {
    return util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_ZI_PAI_TYPE, 2);
};

//布局类型
playPanel_DaZiBoPi.prototype.getLayoutType = function() {
    return util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_PLAY_UI_LAYOUT, 0);
};

//Override
playPanel_DaZiBoPi.prototype.getGameBgList = function() {
	return ["playing/gameTable/beijing_1.jpg", "playing/gameTable/beijing_2.jpg", "playing/gameTable/beijing_3.jpg"];
};

//Override
playPanel_DaZiBoPi.prototype.getGameBgIdx = function() {
	return util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_GAME_BG_TYPE, 0);
};

//Override
playPanel_DaZiBoPi.prototype.getHuXiType = function() {
    var idx = util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_HU_XI_TYPE, 0);
    return [1, 0][idx];
};

//Override
playPanel_DaZiBoPi.prototype.getXuXianType = function() {
    return util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_XU_XIAN_TYPE, 1);
};

//Override
playPanel_DaZiBoPi.prototype.getSuDuType = function() {
    var old = util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_SU_DU_TYPE, 2);
    return [2,0,1,3][old];
};

//Override
playPanel_DaZiBoPi.prototype.getTingPaiType = function() {
    var idx = util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_PLAY_TING_PAI, 1);
    return [1, 0][idx];
};

playPanel_DaZiBoPi.prototype.isAniParallel = function() {
    return false;
};

// 发牌间隔
playPanel_DaZiBoPi.prototype.getSendCardInterval = function() {
    var areaSelectMode = MjClient.data.sData.tData.areaSelectMode;
    if ([0, 1, 2].indexOf(areaSelectMode.faPai) < 0) {
        return 1;
    }

    return [1.5, 1.1, 0.8][areaSelectMode.faPai];
};

playPanel_DaZiBoPi.prototype.getResType = function () {
  return 1;
};

playPanel_DaZiBoPi.prototype.changeEatBtnLayout = function(btnNode, len, idx) {
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
playPanel_DaZiBoPi.prototype.getHandCount = function() {
    return 14;
}

playPanel_DaZiBoPi.prototype.isCheckTingStats = function() {
    return true;
}

playPanel_DaZiBoPi.prototype.isUpdateXingPlayer = function (off) {
    return this.getIndexInUids(off) == MjClient.data.sData.tData.xingPlayer && MjClient.data.sData.tData.curPlayer == MjClient.data.sData.tData.zhuang;
};

// 更新手牌(收入亮张)
playPanel_DaZiBoPi.prototype.updateHandCardByPick = function(node, msg) {
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
playPanel_DaZiBoPi.prototype.updateHandCardByPut = function(node) {
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

playPanel_DaZiBoPi.prototype.updateHandCardByEat = function(node, eatType, msg) {
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

playPanel_DaZiBoPi.prototype.removeXingHandCardByEat = function(eatType, cardArr, msg, off, zhuangOff) {
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

playPanel_DaZiBoPi.prototype.showOutCardAnimation = function(node) {
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
playPanel_DaZiBoPi.prototype.updateHandCardByAdd = function(node, msg) {
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
playPanel_DaZiBoPi.prototype.checkZhuangVisible = function(node) {
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