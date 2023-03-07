//新版永州扯胡子
var WANG_TYPE = {
	WANG_DIAO: 1,
	WANG_CHUANG: 2,
	WANG_ZHA: 4
};
var PlayPanel_luoDiSao = playLayer_ziPai.extend({
	jsonFile:"Play_ZiPaiLuoDiSao.json",

	HUN_CARD: 91,//混牌
	ctor:function(){
		var tData = MjClient.data.sData.tData;
		MjClient.MaxPlayerNum_paohuzi = tData.maxPlayer;
		this._super(this.jsonFile);
		this.shuffleList = [];  //洗牌玩家

		MjClient.playui.jsBind._node.addChild(new roundRule_ziPai(roundRule_ziPai.getRoundRules()));
	},

	getJsBind: function(){
		var jsBind = {
			img_banner:{
				btn_changeBg:{
					_run: function() {
						   this.visible = !MjClient.playui.isCoinField();
						   this.loadTextureNormal("playing/ziPaiBanner/wenhao.png");
						   this.setContentSize(this.getNormalTextureSize());
					   },
					   _click: function() {
						   postEvent("EZP_rule");
					   }
			   	},
				btn_setting: {
					_click: function() {
						MjClient.Scene.addChild(new SettingPanel_CheHuZI(), 6000);
						// MjClient.Scene.addChild(new SettingPanel_ZiPaiPaoHuZi(), 6000);
						MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Shezhi", {
							uid: SelfUid(),
							gameType: MjClient.gameType
						});
					}
				},
			},
			node_down:{
				layout_head: {
					text_skipHu: {
						_run: function(){
							this.ignoreContentAdaptWithSize(true);
							this.visible = false;
							this.isShow = function(){
							    var off = MjClient.playui.getUIOffByNode(this);
								var player = MjClient.playui.getUIPlayer(off);
								return player.isQiHu;
							};
						},
						_event: {
							initSceneData: function(){
								this.visible = this.isShow();
							},
							mjhand: function(){
								this.visible = false;
							},
							MJPass: function(){
								this.visible = this.isShow();
							},
							HZNewCard: function(){
								this.visible = this.isShow();
							},
							MJPut: function(){
								this.visible = this.isShow();
							},
							HZChiCard: function(){
								this.visible = this.isShow();
							},
							MJPeng: function(){
								this.visible = this.isShow();
							},
							HZWeiCard: function(){
								this.visible = this.isShow();
							},
							HZGangCard: function(){
								this.visible = this.isShow();
							},
							roundEnd: function(){
								this.visible = false;
							}
						}
					}
				},
				img_putCard:{
					_event:{
						roundEnd:function(){
							var pl = MjClient.playui.getUIPlayer(0);
			                if(!pl) {
			                    return;
			                }

							var sData = MjClient.data.sData;
			                if(sData && sData.tData.currCard == -1) {
			                    //跑胡 偎胡
			                    this.visible = false;
			                }
						}	
					}
				},
				img_wangCards:{
					_layout: [[0.35, 0.35], [0.5, 0.6], [0, 0]],
					img_card:{
						_visible:false,
					},
					_event:{
						MJPut:function(){
							this.visible = false;
						},
						clearCardUI: function() {
							this.visible = false;
						},
						initSceneData:function(){
							this.visible = false;
						},
						HZNewCardDelay:function(){
							this.visible = false;
						},
						roundEnd:function(){
							this.visible = false;
						}
					}
				},
				layout_eatDisplay:{
					img_wangdiao:{
						_visible: false,
					},
					img_wangchuang:{
						_visible: false,
					},
					img_wangzha:{
						_visible: false,
					},
					img_fanxing:{
						_visible:false,
						_run:function(){
							this.setPositionY(this.getPositionY() - 60);
						}
					},
					img_genxing:{
						_visible:false,
						_run:function(){
							this.setPositionY(this.getPositionY() - 60);
						}
					},
					_event:{
						HZWangChuang: function(eD){
							var eatAction = MjClient.playui.getWangType(eD);
							if(eatAction);
								MjClient.playui.displayEatLabel(this, eatAction, eD);
						},
						HZWangChuangShow:function(eD){
							var eatAction = MjClient.playui.getWangType(eD);
							if(eatAction);
								MjClient.playui.displayEatLabel(this, eatAction, eD);
						},
					}
				},
				img_xingcard:{
					_visible:false,
					_run:function(){
						setWgtLayout(this, [0.35, 0.35], [0.5, 0.6], [0, 0]);
						var userData = {scale:this.getScale(), pos:this.getPosition()};
						this.setUserData(userData);
					},
					_event:{
						MJPass: function(){
							this.visible = false;
						},
						initSceneData:function(){
							this.visible = false;
						},
						clearCardUI:function(){
							this.visible = false;
						}
					}
				},
				_event:{
					HZWangChuang: function(eD){
						MjClient.playui.handleWangChuang( this, eD);
					},
					HZWangChuangShow:function(eD){
						MjClient.playui.handleWangChuang( this, eD);
					},
				},
			},
			node_xing:{
				layout_head: {
					text_skipHu: {
						_run: function(){
							this.ignoreContentAdaptWithSize(true);
							this.visible = false;
							this.isShow = function(){
								if(MjClient.rePlayVideo == -1){
									return false;
								}
							    var off = MjClient.playui.getUIOffByNode(this);
								var player = MjClient.playui.getUIPlayer(off);
								return player.isQiHu;
							};
						},
						_event: {
							initSceneData: function(){
								this.visible = this.isShow();
							},
							mjhand: function(){
								this.visible = false;
							},
							MJPass: function(){
								this.visible = this.isShow();
							},
							HZNewCard: function(){
								this.visible = this.isShow();
							},
							MJPut: function(){
								this.visible = this.isShow();
							},
							HZChiCard: function(){
								this.visible = this.isShow();
							},
							MJPeng: function(){
								this.visible = this.isShow();
							},
							HZWeiCard: function(){
								this.visible = this.isShow();
							},
							HZGangCard: function(){
								this.visible = this.isShow();
							},
							roundEnd: function(){
								this.visible = false;
							}
						}
					}
				},
				img_putCard:{
					_event:{
						roundEnd:function(msg){
							var pl = MjClient.playui.getUIPlayer(MjClient.playui.getUIOffByNodeName('node_xing'));
			                if(!pl) {
			                    return
			                }

							var sData = MjClient.data.sData;
			                if(sData && sData.tData.currCard == -1) {
			                    //跑胡 偎胡
			                    this.visible = false;
			                    if (MjClient.rePlayVideo != -1) {
			                    	var off = MjClient.playui.getUIOffByNode(this);
			                    	var paoPai = msg.players[pl.info.uid].mjgang0;
			                    	for (var index = 0; index < paoPai.length; index++) {
			                    		MjClient.playui.removeHandCard(paoPai[index], off);
			                    		MjClient.playui.removeHandCard(paoPai[index], off);
			                    		MjClient.playui.removeHandCard(paoPai[index], off);
			                    		MjClient.playui.removeHandCard(paoPai[index], off);
			                    	}

            						MjClient.playui.refreshHandCard(off, true);
			                    }
			                }
						}	
					}
				},
				img_wangCards:{
					_layout: [[0.35, 0.35], [0.73, 0.6], [0, 0]],
					img_card:{
						_visible:false,
					},
					_event:{
						MJPut:function(){
							this.visible = false;
						},
						clearCardUI: function() {
							this.visible = false;
						},
						initSceneData:function(){
							this.visible = false;
						},
						HZNewCardDelay:function(){
							this.visible = false;
						},
						roundEnd:function(){
							this.visible = false;
						}
					}
				},
				layout_eatDisplay:{
					img_wangdiao:{
						_visible: false,
					},
					img_wangchuang:{
						_visible: false,
					},
					img_wangzha:{
						_visible: false,
					},

				},
			},
			node_right:{
				layout_head: {
					_layout: [[0.1, 0.1], [0.96, 0.9], [0, 0], true],
					text_skipHu: {
						_run: function(){
							this.ignoreContentAdaptWithSize(true);
							this.visible = false;
							this.isShow = function(){
								if(MjClient.rePlayVideo == -1){
									return false;
								}
							    var off = MjClient.playui.getUIOffByNode(this);
								var player = MjClient.playui.getUIPlayer(off);
								return player.isQiHu;
							};
						},
						_event: {
							initSceneData: function(){
								this.visible = this.isShow();
							},
							mjhand: function(){
								this.visible = false;
							},
							MJPass: function(){
								this.visible = this.isShow();
							},
							HZNewCard: function(){
								this.visible = this.isShow();
							},
							MJPut: function(){
								this.visible = this.isShow();
							},
							HZChiCard: function(){
								this.visible = this.isShow();
							},
							MJPeng: function(){
								this.visible = this.isShow();
							},
							HZWeiCard: function(){
								this.visible = this.isShow();
							},
							HZGangCard: function(){
								this.visible = this.isShow();
							},
							roundEnd: function(){
								this.visible = false;
							}
						}
					}
				},
				img_putCard:{
					_event:{
						roundEnd:function(msg){
							var pl = MjClient.playui.getUIPlayer(MjClient.playui.getUIOffByNodeName('node_right'));
			                if(!pl) {
			                    return
			                }

							var sData = MjClient.data.sData;
			                if(sData && sData.tData.currCard == -1) {
			                    //跑胡 偎胡
			                    this.visible = false;
			                    if (MjClient.rePlayVideo != -1) {
			                    	var off = MjClient.playui.getUIOffByNode(this);
			                    	var paoPai = msg.players[pl.info.uid].mjgang0;
			                    	for (var index = 0; index < paoPai.length; index++) {
			                    		MjClient.playui.removeHandCard(paoPai[index], off);
			                    		MjClient.playui.removeHandCard(paoPai[index], off);
			                    		MjClient.playui.removeHandCard(paoPai[index], off);
			                    		MjClient.playui.removeHandCard(paoPai[index], off);
			                    	}

            						MjClient.playui.refreshHandCard(off, true);
			                    }
			                }
						}	
					}
				},
				img_wangCards:{
					_layout: [[0.35, 0.35], [0.73, 0.75], [0, 0]],
					img_card:{
						_visible:false,
					},
					_event:{
						MJPut:function(){
							this.visible = false;
						},
						clearCardUI: function() {
							this.visible = false;
						},
						initSceneData:function(){
							this.visible = false;
						},
						HZNewCardDelay:function(){
							this.visible = false;
						},
						roundEnd:function(){
							this.visible = false;
						}
					}
				},
				layout_eatDisplay:{
					img_wangdiao:{
						_visible: false,
					},
					img_wangchuang:{
						_visible: false,
					},
					img_wangzha:{
						_visible: false,
					},
					_event:{
						HZWangChuang: function(eD){
							var eatAction = MjClient.playui.getWangType(eD);
							if(eatAction);
								MjClient.playui.displayEatLabel(this, eatAction, eD);
						},
						HZWangChuangShow:function(eD){
							var eatAction = MjClient.playui.getWangType(eD);
							if(eatAction);
								MjClient.playui.displayEatLabel(this, eatAction, eD);
						},
					}
				},
				_event:{
					HZWangChuang: function(eD){
						MjClient.playui.handleWangChuang( this, eD);
					},
					HZWangChuangShow:function(eD){
						MjClient.playui.handleWangChuang( this, eD);
					},
				}
			},
			node_left:{
				layout_head: {
					text_skipHu: {
						_run: function(){
							this.ignoreContentAdaptWithSize(true);
							this.visible = false;
							this.isShow = function(){
								if(MjClient.rePlayVideo == -1){
									return false;
								}
							    var off = MjClient.playui.getUIOffByNode(this);
								var player = MjClient.playui.getUIPlayer(off);
								return player.isQiHu;
							};
						},
						_event: {
							initSceneData: function(){
								this.visible = this.isShow();
							},
							mjhand: function(){
								this.visible = false;
							},
							MJPass: function(){
								this.visible = this.isShow();
							},
							HZNewCard: function(){
								this.visible = this.isShow();
							},
							MJPut: function(){
								this.visible = this.isShow();
							},
							HZChiCard: function(){
								this.visible = this.isShow();
							},
							MJPeng: function(){
								this.visible = this.isShow();
							},
							HZWeiCard: function(){
								this.visible = this.isShow();
							},
							HZGangCard: function(){
								this.visible = this.isShow();
							},
							roundEnd: function(){
								this.visible = false;
							}
						}
					}
				},
				img_putCard:{
					_event:{
						roundEnd:function(msg){
							var pl = MjClient.playui.getUIPlayer(MjClient.playui.getUIOffByNodeName('node_left'));
			                if(!pl) {
			                    return
			                }

							var sData = MjClient.data.sData;
			                if(sData && sData.tData.currCard == -1) {
			                    //跑胡 偎胡
			                    this.visible = false;
			                    if (MjClient.rePlayVideo != -1) {
			                    	var off = MjClient.playui.getUIOffByNode(this);
			                    	var paoPai = msg.players[pl.info.uid].mjgang0;
			                    	for (var index = 0; index < paoPai.length; index++) {
			                    		MjClient.playui.removeHandCard(paoPai[index], off);
			                    		MjClient.playui.removeHandCard(paoPai[index], off);
			                    		MjClient.playui.removeHandCard(paoPai[index], off);
			                    		MjClient.playui.removeHandCard(paoPai[index], off);
			                    	}

            						MjClient.playui.refreshHandCard(off, true);
			                    }
			                }
						}	
					}
				},
				img_wangCards:{
					_layout: [[0.35, 0.35], [0.27, 0.75], [0, 0]],
					img_card:{
						_visible:false,
					},
					_event:{
						MJPut:function(){
							this.visible = false;
						},
						clearCardUI: function() {
							this.visible = false;
						},
						initSceneData:function(){
							this.visible = false;
						},
						HZNewCardDelay:function(){
							this.visible = false;
						},
						roundEnd:function(){
							this.visible = false;
						}
					}
				},
				layout_eatDisplay:{
					img_wangdiao:{
						_visible: false,
					},
					img_wangchuang:{
						_visible: false,
					},
					img_wangzha:{
						_visible: false,
					},
					_event:{
						HZWangChuang: function(eD){
							var eatAction = MjClient.playui.getWangType(eD);
							if(eatAction);
								MjClient.playui.displayEatLabel(this, eatAction, eD);
						},
						HZWangChuangShow:function(eD){
							var eatAction = MjClient.playui.getWangType(eD);
							if(eatAction);
								MjClient.playui.displayEatLabel(this, eatAction, eD);
						},
					}
				},
				_event:{
					HZWangChuang: function(eD){
						MjClient.playui.handleWangChuang( this, eD);
					},
					HZWangChuangShow:function(eD){
						MjClient.playui.handleWangChuang( this, eD);
					},
				}
			},
			node_eatChoice:{
				btn_guo:{
					_touch: function(btn, eT) {
						if (eT == 2) {
							var tData = MjClient.data.sData.tData;
							MjClient.playui.hideEatBtns();
							var msg = {
								cmd: "MJPass",
								cardNext: tData.cardNext,
								card: tData.lastPutCard,
								eatFlag: MjClient.playui.getSelfEatFlag()
							};
							MjClient.gamenet.request("pkroom.handler.tableMsg", msg);
						}
					}
				},
				btn_peng:{
					_click: function() {
						MjClient.playui.handlePeng();
					}
				},
				btn_wangdiao:{
					_layout: [[0, 0.1],[0.5, 0],[0, 2.5]],
					_visible:false,
					_click:function(){
						MjClient.playui.hideEatBtns();
						MjClient.playui.sendWangToServer(WANG_TYPE.WANG_DIAO);
					}
				},
				btn_wangchuang:{
					_layout: [[0, 0.1],[0.5, 0],[0, 2.5]],
					_visible:false,
					_click:function(){
						MjClient.playui.hideEatBtns();
						MjClient.playui.sendWangToServer(WANG_TYPE.WANG_CHUANG);
					}
				},
				btn_wangzha:{
					_layout: [[0, 0.1],[0.5, 0],[0, 2.5]],
					_visible:false,
					_click:function(){
						MjClient.playui.hideEatBtns();
						MjClient.playui.sendWangToServer(WANG_TYPE.WANG_ZHA);
					}
				},
				_event:{
					mjhand: function(data) {
						return;
			        },
					HZWang:function(eD){
						MjClient.playui.updateEatBtns(eD);                    
					},
					HZWangChuang:function(eD){
						if(MjClient.rePlayVideo != -1){
							MjClient.playui.updateEatBtns(eD); 
						}                  
					},
				}
			},
			_event:{
				initSceneData: function() {
					CheckRoomUiDelete(); // 公用代码todo
					sendGPS();
					MjClient.checkChangeLocationApp();
					if (this._delayExeAction && cc.sys.isObjectValid(this._delayExeAction)){
						this.stopAction(this._delayExeAction);
						delete this._delayExeAction;
					}
				},
				roundEnd: function(eD) {
					var self = this;
					var sData = MjClient.data.sData;
					var tData = sData.tData;
					var time = 0;
					//翻醒/跟醒
					if(!MjClient.isDismiss && tData.hunCard && tData.hunCard != -1){
						time = 1.8;
						var actionType = tData.areaSelectMode.isGenXing ? "mjgenxing" : "mjfanxing";
						var hunCard = tData.hunCard;
						if(!tData.areaSelectMode.isGenXing){
							hunCard = tData.cards[tData.cardNext] ? tData.cards[tData.cardNext] : tData.lastPutCard;
						}
						MjClient.playui.displayEatLabel(MjClient.playui.getUINode(0), actionType, eD);    
						MjClient.playui.handleFanXing(hunCard);
					}
					
					var showResult = function(){
						if (MjClient.data.sData.tData.roundNum <= 0 && !MjClient.playui.isCoinField()) {
							var layer = MjClient.playui.createGameOverLayer();
							layer.setVisible(false);
							self.addChild(layer, 500);
						}
			
						if (!MjClient.endoneui) {
							self.addChild(MjClient.playui.createEndOneLayer(), 500);
						}

						var imgXingCard = MjClient.playui.jsBind.node_down.img_xingcard;
						imgXingCard._node.setVisible(false);
					}
					
					this._delayExeAction = this.runAction(cc.sequence(cc.delayTime(time),cc.callFunc(showResult)));
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
                },
			}
		};
		return jsBind;
	},
});

// 是否需要听牌提示
PlayPanel_luoDiSao.prototype.isNeedShowTing = function(){
    return false;
};

//发送王状态给server
PlayPanel_luoDiSao.prototype.sendWangToServer = function(type){
	var tData = MjClient.data.sData.tData;
    MjClient.gamenet.request("pkroom.handler.tableMsg", {
		cmd: "HZWangChuang",
		type: type,
		cardNext:tData.cardNext,
		card:tData.lastPutCard
	});	
};

//处理王状态
PlayPanel_luoDiSao.prototype.handleWang = function(data, nodeName){
	var tData = MjClient.data.sData.tData;
    MjClient.gamenet.request("pkroom.handler.tableMsg", {
		cmd: "HZWangChuang",
		type: type,
		cardNext:tData.cardNext,
		card:tData.lastPutCard
	});	
};

//Override
//吃牌
PlayPanel_luoDiSao.prototype.commitEatCard = function(eatCards, biArr) {
    var tData = MjClient.data.sData.tData;
    var msg = {
        cmd: "MJChi",
        eatCards: eatCards,
        cardNext: tData.cardNext,
        card: tData.lastPutCard
    };
    if (biArr) {
        msg.biCards = biArr;
    }

	this.hideEatBtns();
    MjClient.gamenet.request("pkroom.handler.tableMsg", msg);
};

//Override
//处理碰牌
PlayPanel_luoDiSao.prototype.handlePeng = function() {
    MjClient.playui.hideEatBtns();
	MjClient.gamenet.request("pkroom.handler.tableMsg", {
		cmd: "MJPeng"
	});
};

// 初始化手牌
PlayPanel_luoDiSao.prototype.initHandCards = function(node, msg) {
    var tData = MjClient.data.sData.tData;
    var off = this.getUIOffByNode(node);
    var pl = this.getUIPlayer(off);

    if (!pl || !this.isInPlay()) {
        return;
    }
    if (MjClient.rePlayVideo != -1 && off != 0) {
        if (!MjClient.OtherHandArr) {
            MjClient.OtherHandArr = {};
        }
        if(msg){
            var hand = [];
            for(var i = 0; i < MjClient.OtherHandArr[off].length; i++){
                hand = hand.concat(MjClient.OtherHandArr[off][i]);
            }
            hand.push(msg.card);
            MjClient.OtherHandArr[off] = MjClient.majiang.sortCard(hand, 2);
        }else{
            MjClient.OtherHandArr[off] = MjClient.majiang.sortCard(pl.mjhand || [], 2);
        }
	}
	
	//整理自己手牌
	if (MjClient.rePlayVideo == -1 && off == 0) {
        MjClient.HandCardArr = MjClient.majiang.sortCard(pl.mjhand || [], 2);
	}
    this.refreshHandCard(off);
};

//王霸数量
PlayPanel_luoDiSao.prototype.hunCount = function(mjhand){
    var hunCount = 0;
    for(var index = 0,length = mjhand.length;index < length;index++){
        if(91 == mjhand[index]){
            hunCount++;
        }
    }
    return hunCount;
};

//Override
// 获取操作按钮数组
PlayPanel_luoDiSao.prototype.getShowEatNodes = function() {
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

	//王炸
	if(pl.wangType == 4 && !pl.wangStatus && ((IsTurnToMe() && !(pl.eatFlag & 32) || !IsTurnToMe())))
		vnode.push(eat.btn_wangzha._node);

	//王闯
	if(pl.wangType == 2 && !pl.wangStatus && ((IsTurnToMe() && !(pl.eatFlag & 32) || !IsTurnToMe())))
		vnode.push(eat.btn_wangchuang._node);
	
	//王吊
	if(pl.wangType == 1 && !pl.wangStatus && ((IsTurnToMe() && !(pl.eatFlag & 32) || !IsTurnToMe())))
		vnode.push(eat.btn_wangdiao._node);
	
	if (pl.eatFlag & 32) { // 胡
		if(!IsTurnToMe() && this.hunCount(pl.mjhand) == 0) {
			this.hideEatBtns();
            MjClient.gamenet.request("pkroom.handler.tableMsg", {
                cmd: "MJHu",
                eatFlag: MjClient.playui.getSelfEatFlag()
            });
            return;
		}
		vnode.push(eat.btn_hu._node);
	}

    if (pl.eatFlag & 1) { // 吃
        vnode.push(eat.btn_chi._node);
    }

    if (pl.eatFlag & 2) { // 碰
        vnode.push(eat.btn_peng._node);
    }
	
    if (vnode.length > 0) { // 过
        vnode.push(eat.btn_guo._node);
	}
	
    return vnode;
};

//处理玩家王吊、王闯、王炸通知
PlayPanel_luoDiSao.prototype.handleWangChuang = function(node, data) {
	var off = this.getUIOffByNode(node);
	var pl = this.getUIPlayer(off);
	if(pl.info.uid == data.uid){
		var playerNode = this.getUINode(off);
		var wangCardsNum = 1;
		var animType = null;
		if(pl.wangType == 1){//王吊
			wangCardsNum = 1;
			animType = "mjwangdiao";
		}else if(pl.wangType == 2){//王闯
			wangCardsNum = 2;
			animType = "mjwangchuang";
		}else if(pl.wangType == 4){//王炸
			wangCardsNum = 3;
			animType = "mjwangzha";
		}

		this.displayEatLabel(playerNode.getChildByName("layout_eatDisplay"), animType, data);
		
		var imgWangCards = node.getChildByName("img_wangCards");
		var children = imgWangCards.getChildren();
		for(var k in children){
			var child = children[k];
			if(child.getName() != "img_card")
				child.removeFromParent(true);
		}
		imgWangCards.visible = true;
		var templateNode = imgWangCards.getChildByName("img_card");
		for(var i = 0; i < wangCardsNum; i++){
			var card = templateNode.clone();
			card.setName("card" + i);
			var src = MjClient.playui.getCardSrc("put", this.HUN_CARD, false);
			card.loadTexture(src);
			card.visible = true;
			if(i == 0 && wangCardsNum == 2)
				card.runAction(cc.sequence(cc.delayTime(0.1), cc.moveBy(0.1, cc.p(-40, 0))));
			if(i == 1 && wangCardsNum == 2)
				card.runAction(cc.sequence(cc.delayTime(0.1), cc.moveBy(0.1, cc.p(40, 0))));
			if(i == 1 && wangCardsNum == 3)
				card.runAction(cc.sequence(cc.delayTime(0.1), cc.moveBy(0.2, cc.p(-80, 0))));
			if(i == 2 && wangCardsNum == 3)
				card.runAction(cc.sequence(cc.delayTime(0.1), cc.moveBy(0.2, cc.p(80, 0))));
			imgWangCards.addChild(card);
		}
	}
}

/**	Override
 * 展示吃牌特效字
 * @param eatType 吃牌类型
 * @param off 位置偏移
 */
PlayPanel_luoDiSao.prototype.displayEatLabel = function(node, eatType, msg) {
    var off = this.getUIOffByNode(node);
    if (!this.isCurEatPlayer(msg, off)) {
        return;
    }
    var eatType = this.apartGangType(eatType, msg);
    var uiNode = this.getUINode(off);
    var layout_eatCards = uiNode.getChildByName("layout_eatDisplay");
    var labels = {
        mjchi: "img_chi",
        mjpeng: "img_peng",
        mjgang0: "img_pao",
        mjwei: "img_wei",
        mjgang1: "img_ti",
        mjgang2: "img_ti",
		hu: "img_hu",
		mjwangdiao: "img_wangdiao",
		mjwangchuang: "img_wangchuang",
		mjwangzha: "img_wangzha",
		mjfanxing: "img_fanxing",
		mjgenxing: "img_genxing"
    };
    var eatLabel = layout_eatCards.getChildByName(labels[eatType]);
    eatLabel.visible = true;

    if(this.getEatLabel(eatType)){
        eatLabel.loadTexture(this.getEatLabel(eatType));
    }
	var delayTime = 1;

	var spineRes = {
		mjwangdiao: ["spine/wangdiao/skeleton.json", "spine/wangdiao/skeleton.atlas"],
		mjwangchuang: ["spine/wangchuang/skeleton.json", "spine/wangchuang/skeleton.atlas"],
		mjwangzha: ["spine/wangzha/skeleton.json", "spine/wangzha/skeleton.atlas"]
	};

    if (this.isAniParallel()) {
		delayTime = 1;
		if(eatType == "mjfanxing" || eatType == "mjgenxing"){
			delayTime = 1.6;
		}
		
		//王闯王吊王炸有spine动画
		if(eatType == "mjwangdiao" || eatType == "mjwangchuang" || eatType == "mjwangzha"){
			this.playWangAnin(eatLabel, spineRes[eatType][0], spineRes[eatType][1]);
		}else{
			eatLabel.runAction(cc.sequence(cc.delayTime(delayTime), cc.callFunc(() => {
				eatLabel.visible = false;
			})));
		}
    } else {
		delayTime = 0.5;
        if (eatLabel.getUserData()) {
            eatLabel.scale = eatLabel.getUserData().scale;
        } else {
            eatLabel.setUserData({
                scale: eatLabel.scale
            });
        }
		if(eatType == "mjfanxing" || eatType == "mjgenxing")
			delayTime = 1.6;
		
		//王闯王吊王炸有spine动画
		if(eatType == "mjwangdiao" || eatType == "mjwangchuang" || eatType == "mjwangzha"){
			this.playWangAnin(eatLabel, spineRes[eatType][0], spineRes[eatType][1]);
		}else{
			var initScale = eatLabel.scale;
			eatLabel.runAction(cc.sequence(cc.scaleTo(0.3, initScale * 1.5), cc.delayTime(delayTime), cc.scaleTo(0.3, initScale), cc.callFunc(() => {
				eatLabel.visible = false;
			})));
		}
	};
};

//获取王类型
PlayPanel_luoDiSao.prototype.getWangType = function(data){
	var wangType = data.type;
	var eatAction = null;
	if(wangType == 1){
		eatAction = "mjwangdiao";
	}else if(wangType == 2){
		eatAction = "mjwangchuang";
	}else if(wangType == 4){
		eatAction = "mjwangzha";
	}
	return eatAction;
};

//播放王动画
PlayPanel_luoDiSao.prototype.playWangAnin = function(parentNode, spineJson, spineAtlas){
	if(!parentNode || !cc.sys.isObjectValid(parentNode)) return;
	parentNode.removeAllChildren();
	parentNode.visible = false;

	var node = parentNode.getParent().getChildByName("wangAninFather");
	if (!node) {
		node = new cc.Node();
		node.name = "wangAninFather";
		node.setPosition(parentNode.getPosition());
		parentNode.getParent().addChild(node);
	}

	var projNode = createSpine(spineJson, spineAtlas);
	projNode.setAnimation(0, 'animation', false);
	projNode.setScale(0.5);
	projNode.setTimeScale(1.5);
	var animationListener = function(skeletonNode, trackEntry, eventType, event, loopCount){
		if(eventType == sp.ANIMATION_EVENT_TYPE.COMPLETE){
			parentNode.visible = false;
			node.visible = false;
		}
	};
	projNode.setAnimationListener(projNode,animationListener);
	node.addChild(projNode);
}

//总结算面板
PlayPanel_luoDiSao.prototype.createGameOverLayer = function(type) {
    return new GameOverLayer_syZiPai();
};

//小结算面板
PlayPanel_luoDiSao.prototype.createEndOneLayer = function(type) {
    return new EndOneView_shaoYangLuoDiSao();
};

//处理翻醒
PlayPanel_luoDiSao.prototype.handleFanXing = function(card) {
	var imgXingCard = MjClient.playui.jsBind.node_down.img_xingcard._node;
	imgXingCard.stopAllActions();
    imgXingCard.visible = true;
    imgXingCard.opacity = 255;
    var src = MjClient.playui.getCardSrc("put", card, false);
    imgXingCard.getChildByName("img_card").loadTexture(src, 0); // todo
	imgXingCard.loadTexture(MjClient.playui.getPutCardBg(0));
	
	imgXingCard.setScale(0.1);
    imgXingCard.setPosition(cc.p(cc.winSize.width/2, cc.winSize.height/2+120));
    var action1 = cc.scaleTo(0.2,imgXingCard.getUserData().scale);
    var action2 = cc.moveTo(0.2,imgXingCard.getUserData().pos);
    imgXingCard.runAction(cc.spawn(action1,action2).easing(cc.easeCubicActionOut()));
};

/**
 * Override
 */
PlayPanel_luoDiSao.prototype.checkCardCanPut = function(pl, card) {
    return card != this.HUN_CARD;//王霸不能打出
};

// 初始化弃牌
PlayPanel_luoDiSao.prototype.initOutCard = function(node) {
    if (!this.isInPlay()) return;
    var off = this.getUIOffByNode(node);
    var pl = this.getUIPlayer(off);
    node.removeAllChildren();
    var putLen = pl.mjput.length;

    //计算王吊的上家，以免提前显示了弃牌
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var wangTypeIndex = -1;
    for (var index = 0; index < tData.maxPlayer; index++) {
    	if (sData.players[tData.uids[index]].wangType != 0) {
    		wangTypeIndex = index;
    		break;
    	}
    }

    var isLastPlOfWang = false;
    var isWangDiaoPL = false;
    if (wangTypeIndex != -1) {
    	var wangPl = sData.players[tData.uids[wangTypeIndex]];
    	isLastPlOfWang = ((this.getIndexInUids(off) + 1) % tData.maxPlayer) == wangTypeIndex && wangPl.eatFlag == 0;
    	isWangDiaoPL = this.getIndexInUids(off) == wangTypeIndex && wangPl.eatFlag == 0;
    }

    if ((this.isCurPlayer(off) && !isWangDiaoPL || isLastPlOfWang) && pl.mjput.length > 0 && tData.currCard == pl.mjput[pl.mjput.length - 1]) {
        putLen -= 1;
    }

    for (var i = 0; i < putLen; i++) {
        var pos = this.getOutCardPos(off);
        var orientation = this.getOutCardOrientation(off, true);
        var outCard = this.getNewCard("out", pl.mjput[i], off, false);
        outCard.setPosition(pos);
        outCard.visible = true;
        node.addChild(outCard);

        this.addOutFrame(outCard, pl, i);
    }
};

// 更新展示牌(背光跟牌)
PlayPanel_luoDiSao.prototype.updatePutCard = function(node, msg, isReconnect) {
	var sData = MjClient.data.sData;
    var tData = sData.tData;
    var putType = tData.putType;
    var card = tData.currCard;

    if(node.isPick){
        delete node.isPick;
    }

    var off = this.getUIOffByNode(node);

    //计算王吊的上家，以免牌展示不出来
    var wangTypeIndex = -1;
    for (var index = 0; index < tData.maxPlayer; index++) {
    	if (sData.players[tData.uids[index]].wangType != 0) {
    		wangTypeIndex = index;
    		break;
    	}
    }

    var isLastPlOfWang = false;
    var isWangDiaoPL = false;
    if (wangTypeIndex != -1) {
    	var wangPl = sData.players[tData.uids[wangTypeIndex]];
    	isLastPlOfWang = ((this.getIndexInUids(off) + 1) % tData.maxPlayer) == wangTypeIndex && wangPl.eatFlag == 0;
    	isWangDiaoPL = this.getIndexInUids(off) == wangTypeIndex && wangPl.eatFlag == 0
    }

    if (!this.isCurPlayer(off) && !isLastPlOfWang || card == -1 || !this.isInPlay() || isWangDiaoPL) {
        return;
    }

    // 牌局中自己手动出牌
    if (putType == 0 && off == 0 && MjClient.rePlayVideo == -1 && !this.isInTrust(SelfUid()) && !isReconnect) {
        if(!node.visible){
            node.visible = true;
        }
        return;
	}
	
	//重连不展示混牌
	if (putType == 1 && isReconnect && card == MjClient.playui.HUN_CARD) {
		return;
	}

    node.loadTexture(this.getPutCardBg(putType));
    node.visible = true;
    node.opacity = 255;

    var putCard = node.getChildByName("img_card"); // 牌
    var src = this.getCardSrc("put", card, this.isShowCardBack(msg, node, isReconnect));

    putCard.loadTexture(src, 0);

    this.showPutCardAnimation(node);
};

//Override
// 展示牌动画
PlayPanel_luoDiSao.prototype.showPutCardAnimation = function(node) {
    var off = this.getUIOffByNode(node);
    var putType = MjClient.data.sData.tData.putType;
	var card = MjClient.data.sData.tData.currCard;
    var pos; // 起始位置
    if (putType == 1) { // 摸牌
        pos = MjClient.playui.jsBind.layout_cardNum._node.getPosition();
    } else if (putType == 0) { // 出牌
        if (off == 0) {
            pos = cc.p(cc.winSize.width / 2, cc.winSize.height / 2 - 120);
        } else {
            pos = this.getUINode(off).getChildByName("layout_head").getPosition();
        }
    } else {
        return;
    }

    var actTime = this.getAniTimeByType("send");
    node.setPosition(pos);
    node.stopAllActions();
	node.setScale(0);
	var self = this;
    var seq = cc.sequence(
        cc.DelayTime(0.05),
        cc.spawn(cc.scaleTo(actTime, node.getUserData().scale), cc.moveTo(actTime, node.getUserData().pos)),
        cc.callFunc(function() {
			//混牌放入手牌中
			if(card && putType == 1 && card == MjClient.playui.HUN_CARD && node && cc.sys.isObjectValid(node)){
				self.movePutCardToHandCard(node, card);
			}
		})
    );
    node.runAction(seq);
};

//将展示牌移动到手牌中
PlayPanel_luoDiSao.prototype.movePutCardToHandCard = function(node, card){
	var off = this.getUIOffByNode(node);
	var player = this.getUIPlayer(off);
	if(!player) return;

	var uiNode = this.getUINode(off);
	var putCardNode = uiNode.getChildByName("img_putCard");
	var moveKingToHandFunc = function(){
		var isXingPlayer = this.isUpdateXingPlayer(off);
		if(isXingPlayer  || player.info.uid == SelfUid() || MjClient.rePlayVideo != -1){
			var cardArr = MjClient.HandCardArr;
			if(off != 0 && MjClient.rePlayVideo != -1 || isXingPlayer){
				cardArr = MjClient.OtherHandArr[off];
			}
			var isAdd = false;
			for(var i = 0;i < cardArr.length;i++){
				var tmpArr = cardArr[i];
				if(tmpArr.length <= 2){
					isAdd = true;
					cardArr[i].push(card);
					break;
				}
			}
			if(!isAdd){
				cardArr.push([card]);
			}
			
			MjClient.playui.refreshHandCard(off);
			MjClient.playui.checkCutLineVisible();
		}
		putCardNode.setVisible(false);
	}.bind(this);
	var delaySec = MjClient.rePlayVideo == -1 ? (this.getSendCardInterval() - this.getAniTimeByType("send") * 2) : 0;//正常打牌延迟，回放不延迟
	if(delaySec != 0 && player.isQiHu){
		delaySec = 0.2;
	}
	if(delaySec != 0 && player.trust){
		delaySec = 0.2;
	}
	delaySec = delaySec < 0 ? 0 : delaySec;
	node.runAction(cc.sequence(cc.delayTime(delaySec), cc.CallFunc(moveKingToHandFunc)));
};

//Override
PlayPanel_luoDiSao.prototype.isHandMoveToTopDiffColumn = function () {
    return true;
};

//Overide
PlayPanel_luoDiSao.prototype.getDefaultSetting = function() {
    return {
        layout: 1,
        bg: 0,
        pai: 1,
        fastEat: 0,
        huXi: 1,
        xuXian: 1,
        suDu: 3,
        size: 0,
        voice: 0,
        ting: 0,
        chuBtn: 0,
        dblClick: 1,
        chuGuide:0,
    };
};

// 发牌间隔
PlayPanel_luoDiSao.prototype.getSendCardInterval = function() {
	var areaSelectMode = MjClient.data.sData.tData.areaSelectMode;
    if ([1.4, 1, 0.7].indexOf(areaSelectMode.faPai) < 0) {
        return 1;
    }

    return [1.5, 1.1, 0.8][areaSelectMode.faPai];
};

//Override
PlayPanel_luoDiSao.prototype.isAniParallel = function() {
    return false;
};

//Override
//@brief 获取动画时间
//@param type send|land|eat
//@author evan
PlayPanel_luoDiSao.prototype.getAniTimeByType = function(type) {
    if (this.isAniParallel()) { //旧版动画
        return this.getActionTime();
    }

    var cfg = [
        { //标准 
            send: 0.15,
            land: 0.15,
            eat: [0.20, 0.16, 0.16]
        },
        { //快
            send: 0.12,
            land: 0.12,
            eat: [0.16, 0.13, 0.13]
        },
        { //慢
            send: 0.2,
            land: 0.2,
            eat: [0.25, 0.25, 0.25]
        },
        { //极快
            send: 0.1,
            land: 0.1,
            eat: [0.13, 0.10, 0.10]
        }
    ];

    //在建房选项勾选“急速”情况下 并且不是旧的动画 游戏内的功能设置默认选择“快”
    var suDuType = MjClient.data.sData.tData.areaSelectMode.faPai == 2 ? 3 : this.getSuDuType();
    return cfg[suDuType][type];
};

//Override
// 落牌 发牌节奏控制
PlayPanel_luoDiSao.prototype.checkDelayNewCard = function(node, msg) {
    if (this.shouldDealyNewCard()) {
        var delayTime = (this.getSendCardInterval() - this.getAniTimeByType("send") - this.getAniTimeByType("land")) * 0.5 + this.getAniTimeByType("land");
        node.runAction(cc.sequence(cc.delayTime(delayTime), cc.CallFunc(function() {
            postEvent("HZNewCardDelay", msg);
        })));
    } else {
        postEvent("HZNewCardDelay", msg);
    }
};

PlayPanel_luoDiSao.prototype.getGameBgList = function() {
    return ["playing/gameTable/YZCHZ/beijing_1.jpg", "playing/gameTable/YZCHZ/beijing_2.jpg", "playing/gameTable/YZCHZ/beijing_3.jpg"];
};

PlayPanel_luoDiSao.prototype.getTableHuXi = function(off) {
    var pl = this.getUIPlayer(off);
    if (!pl) {
        return 0;
    }

    var score = 0;
    // 提
    if(pl.info.uid == SelfUid()){
	    for (var i = 0; i < pl.mjgang1.length; i++) {
	        score += pl.mjgang1[i] < 20 ? 9 : 12;
	    }

	    // 偎
	    pl.mjwei = pl.mjwei || [];
	    for (var i = 0; i < pl.mjwei.length; i++) {
	        score += pl.mjwei[i] < 20 ? 3 : 6;
	    }	
    }


    // 跑
    for (var i = 0; i < pl.mjgang0.length; i++) {
        score += pl.mjgang0[i] < 20 ? 6 : 9;
    }

    // 碰
    pl.mjpeng = pl.mjpeng || [];
    for (var i = 0; i < pl.mjpeng.length; i++) {
        score += pl.mjpeng[i] < 20 ? 1 : 3;
    }

    function getRowHuxi(chiRow) {
        var score = 0;
        chiRow = [].concat(chiRow);

        chiRow.sort(function(a, b) {
            return a - b
        });

        if (chiRow[0] == 1 && chiRow[1] == 2 && chiRow[2] == 3) {
            score += 3;
        } else if (chiRow[0] == 21 && chiRow[1] == 22 && chiRow[2] == 23) {
            score += 6;
        } else if (chiRow[0] == 2 && chiRow[1] == 7 && chiRow[2] == 10) {
            score += 3;
        } else if (chiRow[0] == 22 && chiRow[1] == 27 && chiRow[2] == 30) {
            score += 6;
        }
        return score;
    }
    
    // 吃
    for (var i = 0; i < pl.mjchi.length; i++) {
        var chiRow = pl.mjchi[i].eatCards;
        score += getRowHuxi(chiRow);

        var biCards = pl.mjchi[i].biCards;
        if (biCards) {
            for (var j = 0; j < biCards.length; j++) {
                var biRow = biCards[j];
                score += getRowHuxi(biRow);
            }
        }
    }
   
    return score;
};

// 判断吃、碰、胡、过操作按钮的状态
PlayPanel_luoDiSao.prototype.updateEatBtns = function(msg) {
    var sData = MjClient.data.sData;
    var pl = sData.players[SelfUid() + ""];
    if (!pl) {
        MjClient.gamenet.request("pkroom.handler.tableMsg", {
            cmd: "checkBtnWithFlag",
            mjState: pl.mjState,
            eatFlag: pl.eatFlag,
            tableid: sData.tData.tableid,
            pl: "pl not find:" +　SelfUid()
        });
        return;
    }

    //重置吃碰隐藏
	this.hideEatBtns();

	//王吊王闯直接胡牌
	if(pl && pl.wangStatus && pl.wangType > 0 && (pl.eatFlag & 32) > 0){
		MjClient.gamenet.request("pkroom.handler.tableMsg", {
			cmd: "MJHu",
			eatFlag: MjClient.playui.getSelfEatFlag()
		});
		return;
	}

    //吃碰杠胡
    var showEatNodes = this.getShowEatNodes();

    //吃碰杠胡过处理
    if (showEatNodes && showEatNodes.length > 0) {
        this.showEatSpecialDeal();
        for (var i = 0; i < showEatNodes.length; i++) {
            var btnNode = showEatNodes[i];
            btnNode.visible = true;
            this.changeEatBtnLayout(btnNode, showEatNodes.length, i);
        }
    }
    this.checkBtnWithPlayerFlag();
};

//Override
//字牌资源路径
PlayPanel_luoDiSao.prototype.getCardFilePath = function() {
    return "playing/paohuzi/";
};

//Override
// 是否放偎
PlayPanel_luoDiSao.prototype.isOtherWei = function() {
    return false;
};

//获取牌堆总数
PlayPanel_luoDiSao.prototype.getInitDiPaiCount = function() {
	var tData = MjClient.data.sData.tData;
	var count = tData.maxPlayer;
	if(tData.maxPlayer == 4){
		count = 3;
	}
    return MjClient.majiang.getAllCardsTotal() - count * this.getHandCount() - 1;
};

//Override
// 获取提、偎牌的显示类型
PlayPanel_luoDiSao.prototype.getCardShowType = function(card, off) {
	if(MjClient.rePlayVideo != -1){
		return 1;
	}

    var indexInUids = this.getIndexInUids(off);
    var pl = MjClient.data.sData.players[MjClient.data.sData.tData.uids[indexInUids]];
    // 展示
    if (!(pl.mjHide && pl.mjHide.indexOf(card) >= 0)) {
        return 2;
	}
	
    // 隐藏牌 提偎牌玩家自己展示
    if (pl.info.uid == SelfUid()) {
        return 0;
    }

    return 0;
};

//Override   获取吃牌的展示类型（0：不可见   1：蒙层   2 可见  3 置灰）
PlayPanel_luoDiSao.prototype.getEatCardShowType = function(eatType, card, cardIndex, off) {
	var showType = 2;
	var indexInUids = this.getIndexInUids(off);
    var pl = MjClient.data.sData.players[MjClient.data.sData.tData.uids[indexInUids]];
    if (eatType == "mjchi") {
        showType = cardIndex < 2 ? 2 : 3;
    }else if(eatType == "mjwei") {
		if(pl.skipPeng.indexOf(card) >= 0){//臭偎
			showType = cardIndex < 2 ? 0 : 2;
		}else{
			showType = this.getCardShowType(card, off);
			if(off == 0)
				showType = 1;
		}
    }else if(eatType == "mjgang1"){
		showType = this.getCardShowType(card, off);
		if(off == 0)
			showType = 1;
	}
	return showType;
};

PlayPanel_luoDiSao.prototype.isUpdateXingPlayer = function (off) {
    return this.getIndexInUids(off) == MjClient.data.sData.tData.xingPlayer && MjClient.data.sData.tData.curPlayer == MjClient.data.sData.tData.zhuang;
};

// 更新手牌 (出牌)
PlayPanel_luoDiSao.prototype.updateHandCardByPut = function(node) {
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
	
	this.removeHandCard(MjClient.data.sData.tData.currCard, off);
    this.refreshHandCard(off);
};

// Override
PlayPanel_luoDiSao.prototype.updateHandCardByEat = function(node, eatType, msg) {
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

PlayPanel_luoDiSao.prototype.removeXingHandCardByEat = function(eatType, cardArr, msg, off, zhuangOff) {
    var card = this.getEatCard(eatType, zhuangOff);
    if (eatType == "mjchi") {
        this.removeChiFromHand(cardArr, card, off);
    } else if (eatType == "mjpeng") {
        this.removePengFromHand(card, off);
    } else if (eatType == "mjgang0" || eatType == "mjgang1") {
        this.removeGangFromHand(eatType, card, off);
    } else if (eatType == "mjwei") {
        this.removeWeiFromHand(card, msg, off);
    } else {
        this.removeExtendFromHand(eatType, cardArr, card, msg, off);
    }
};

//Override
// 落牌动画
PlayPanel_luoDiSao.prototype.showOutCardAnimation = function(node) {
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

// 改变手牌大小
PlayPanel_luoDiSao.prototype.changeHandCardSize = function(handCard) {
    var src = this.getCardSrc("hand", 1)
    this.loadCardTexture(handCard, src, this.getResType());
    var idx = this.getCardSizeIdx();
    switch (idx) {
        case 0:
			setWgtLayout(handCard, [95 / 1280, 0], [0.27, 0.75], [0, 0]);
            break;
        case 1:
			setWgtLayout(handCard, [100 / 1280, 0], [0.27, 0.75], [0, 0]);
            break;
        case 2:
            setWgtLayout(handCard, [105 / 1280, 0], [0.27, 0.75], [0, 0]);
            break;
    }
};

PlayPanel_luoDiSao.prototype.is34ColorGrey = function(){
	return false;
};

/** Override
 */
PlayPanel_luoDiSao.prototype.setCardTouchHandler = function(card, off) {
    var self = this;
    var pl = this.getUIPlayer(off);
    var dict = {};
    for (var i = 0; i < pl.mjhand.length; i++) {
        var cd = pl.mjhand[i];
        dict[cd] = dict[cd] ? dict[cd] + 1 : 1;
    }

	//三张混牌是可以拖动的
    if (dict[card.tag] >= 3 && this.is34Mask() && card.tag != 91) {
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
            var isPutCommon = tData.tState == TableState.waitPut;
            var isPutSpecil = MjClient.playui.checkPutSpecil();
            if (IsTurnToMe() && (isPutCommon || isPutSpecil) && MjClient.playui.checkCardCanPut(pl, card) && !MjClient.hasPut && pos.y > MjClient.playui.jsBind.img_cutLine._node.y) {

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
                // cc.log("pos.x@@ ", pos.x, " btn.parent.x@@ ", btn.parent.x);
                var dstCol = col + Math.round((pos.x - btn.parent.x) / (btn.parent.width * btn.scaleX) - 0.5); // 目的列
                // cc.log("dstCol@@ ", dstCol);
                if (dstCol == col) { // 列未变
                    MjClient.HandCardArr[col].splice(parseInt(row), 1);
                    MjClient.playui.fixArrIndex(MjClient.HandCardArr[dstCol], card, btn, false);
                } else if (dstCol >= 0 && dstCol < MjClient.HandCardArr.length) { // 当前有手牌列
                    if (MjClient.HandCardArr[dstCol].length < 4) { // 插牌
                        MjClient.moveCard.nexCIndex = dstCol;
                        MjClient.HandCardArr[col].splice(row, 1);
                        MjClient.playui.fixArrIndex(MjClient.HandCardArr[dstCol], card, btn, true);
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

//Override
//改变出牌虚线布局
PlayPanel_luoDiSao.prototype.changeCutLineLayout = function(cutLine) {
    var type = this.getXuXianType();
    switch (type) {
        case 0:
            setWgtLayout(cutLine, [1, 0.3], [0.5, 0.55], [0, -2]);
            break;
        case 1:
            setWgtLayout(cutLine, [1, 0.3], [0.5, 0.6], [0, -2]);
            break;
    }
};


// 2人布局 对家在左上还是右上
PlayPanel_luoDiSao.prototype.isLeftTop = function() {
    return false;
};

//出牌摸牌的位置是否适配偏右、传统布局
PlayPanel_luoDiSao.prototype.isPutCardLayout = function() {
    return true;
};

PlayPanel_luoDiSao.prototype.removeShuffleNode = function() {
    this.shuffleNode.removeFromParent(true);
    this.shuffleNode = null;
};

PlayPanel_luoDiSao.prototype.playShuffleEffect = function() {
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

PlayPanel_luoDiSao.prototype.getMjhandDelay = function() {
    return 2;
};