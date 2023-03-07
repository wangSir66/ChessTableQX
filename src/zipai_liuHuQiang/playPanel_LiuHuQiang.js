//新版邵阳六胡抢
var playPanel_liuHuQiang = playLayer_ziPai.extend({
	ctor: function() {
		this._super("Play_yueYangLiuHuQiang.json");
        if(MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ || MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP){
            MjClient.playui.jsBind._node.addChild(new roundRule_ziPai(roundRule_ziPai.getRoundRules()));
        }
	},

	getJsBind: function() {
		var jsBind = {
			_event: {
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
                btn_changeBg:{
                    _run: function() {
                        if(MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ || MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP){
                            this.loadTextureNormal("playing/ziPaiBanner/wenhao.png");
                            this.setContentSize(this.getNormalTextureSize());
                        }else {
                            this.visible = !MjClient.playui.isCoinField();
                        }
                    },
                    _click: function() {
                        if(MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ || MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP){
                            postEvent("EZP_rule");
                        }else {
                            MjClient.playui.changeGameBgToNext();
                        }
                    }
                },
			},
            text_roundInfo: {
                _run:function () {
                    if(MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ || MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP) {
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
            node_down:{
                layout_eatDisplay: {
                    img_fanXing: {
                        _visible: false
                    },
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
            layout_cardNum: {
                img_card: {
                    _run: function() {
                        this.refreshCardsTotal = function(isRemove) {
                            var tData = MjClient.data.sData.tData;
                            var cardsTotal = MjClient.playui.getInitDiPaiCount();
                            //var left = MjClient.majiang.getAllCardsTotal() - (tData.areaSelectMode.isMaiPai ? 20 : 0) - tData.cardNext;
                            var left = MjClient.majiang.getAllCardsTotal() - ((tData.maxPlayer == 2 && tData.areaSelectMode.isMaiPai) ? tData.areaSelectMode.maiPaiNum : 0) - tData.cardNext;
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
                                //this.setString(MjClient.majiang.getAllCardsTotal() - (tData.areaSelectMode.isMaiPai ? 20 : 0) - tData.cardNext);
                                this.setString(MjClient.majiang.getAllCardsTotal() - ((tData.maxPlayer == 2 && tData.areaSelectMode.isMaiPai) ? tData.areaSelectMode.maiPaiNum : 0) - tData.cardNext);
                            }

                            var img_card = this.getParent().getChildByName("img_card");
                            this.y = 40 + img_card.getChildrenCount() * 0.8;
                        };
                        this.refreshText();
                    },
                },
            },
            node_eatChoice:{
                _event:{
    
				}
			}
		};

		return jsBind;
	}
});

//字牌字体列表
playPanel_liuHuQiang.prototype.getCardFontList = function() {
    return ["type1", "type5", "type3"];
};

//Override
playPanel_liuHuQiang.prototype.getInitDiPaiCount = function() {
	var tData = MjClient.data.sData.tData;
    var diPaiCount = MjClient.majiang.getAllCardsTotal();

	if (tData.areaSelectMode.isMaiPai) {
        //diPaiCount -= 20;
        diPaiCount -= tData.areaSelectMode.maiPaiNum;
    }

    diPaiCount = diPaiCount - tData.maxPlayer * (tData.areaSelectMode.is21Zhang ? 20 : 14);
    return diPaiCount;
};

//Override 
playPanel_liuHuQiang.prototype.initSettingData = function() {
    MjClient.KEY_ZI_PAI_PLAY_UI_LAYOUT  = "KEY_ZI_PAI_PLAY_UI_LAYOUT_HY_LIU_HU_QIANG";   //字牌布局
    MjClient.KEY_ZI_PAI_GAME_BG_TYPE  = "KEY_ZI_PAI_GAME_BG_TYPE_HY_LIU_HU_QIANG";   //字牌游戏背景类型
    MjClient.KEY_ZI_PAI_ZI_PAI_TYPE  = "KEY_ZI_PAI_ZI_PAI_TYPE_HY_LIU_HU_QIANG";   //字牌类型
    MjClient.KEY_ZI_PAI_SU_DU_TYPE  = "KEY_ZI_PAI_SU_DU_TYPE_HY_LIU_HU_QIANG";   //字牌游戏 动画速度
    MjClient.KEY_ZI_PAI_PLAY_TING_PAI  = "KEY_ZI_PAI_PLAY_TING_PAI_HY_LIU_HU_QIANG";   //听牌提示
    MjClient.KEY_ZI_PAI_CARD_SIZE = "KEY_ZI_PAI_CARD_SIZE_HY_LIU_HU_QIAN"; // 字牌大小
};

playPanel_liuHuQiang.prototype.getDefaultSetting = function() {
    return {
        layout: 0,
        bg: 0,
        pai: 1,
        fastEat: 0,
        huXi: 1,
        xuXian: 0,
        suDu: 0,
        size: 0,
        voice: 1,
        ting: 0,
        chuBtn: 0,
        dblClick: 1,
        chuGuide:0,
    };
};

//Override
playPanel_liuHuQiang.prototype.isShowLongCard = function() {
	return false;
};

//获取听的牌
playPanel_liuHuQiang.prototype.getTingCards = function(sData, pl, putCard) {
	return MjClient.huzi.getTingCards(sData, pl, putCard);
};

/**
 * 计算听牌提示
 */
playPanel_liuHuQiang.prototype.calculateHintPutList = function() {
	MjClient.hintPutList_ziPai = MjClient.huzi.hintPutCardsToTing();
};

//Override
playPanel_liuHuQiang.prototype.createGameOverLayer = function(type) {
	return new GameOverLayer_liuHuQiang();
};

//Override
playPanel_liuHuQiang.prototype.createEndOneLayer = function(type) {
	return new EndOneView_liuHuQiang();
};

playPanel_liuHuQiang.prototype.isShowLongCard = function() {
    return true;
};


playPanel_liuHuQiang.prototype.showFanXing = function(card){
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

playPanel_liuHuQiang.prototype.changeEatBtnLayout = function(btnNode, len, idx) {
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
playPanel_liuHuQiang.prototype.getHandCount = function() {
    return MjClient.data.sData.tData.areaSelectMode.is21Zhang ? 20 : 14;
}

playPanel_liuHuQiang.prototype.isCheckTingStats = function() {
    return true;
}

playPanel_liuHuQiang.prototype.isPutCardLayout = function() {
    return true;
}