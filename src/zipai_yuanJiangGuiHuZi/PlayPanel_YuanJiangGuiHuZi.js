//新版沅江鬼胡子
var PlayPanel_YuanJiangGuiHuZi = playLayer_ziPai.extend({
	jsonFile:"Play_ZiPaiYuanJiangGuiHuZi.json",
	ctor:function(){
		var tData = MjClient.data.sData.tData;
        MjClient.MaxPlayerNum_YuanJiangGuiHuZi = tData.maxPlayer;
		this._super(this.jsonFile);
		if (MjClient.data.sData.tData.areaSelectMode["convertible"] && MjClient.rePlayVideo == -1){
            addFreeNumberBtn([0.5, 0.4]);
        }
        MjClient.playui.jsBind._node.addChild(new roundRule_ziPai(roundRule_ziPai.getRoundRules()));
	},

	getJsBind: function(){
		var jsBind = {
			img_gameName:{
				_layout: [[0.12, 0.12],[0.5, 0.8292],[0, 0]]
			},
			text_roundInfo:{
				 _layout: [[0.11, 0.11], [0.5, 0.5], [0, 0]],
				 _run:function(){
				 	this.visible = false;
				 }
			},
			img_banner:{
				_run:function(){

				},
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
			            MjClient.Scene.addChild(new SettingPanel_ZiPaiYuanJiangGuiHuZi(), 6000);
			            MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Shezhi", {
			                uid: SelfUid(),
			                gameType: MjClient.gameType
			            });
			        }
			    },
			},
			node_down:{
				_event:{
					EZP_cardType: function(eD) {
                        MjClient.playui.changeHandCardSize(this.getChildByName("img_handCard"));
                        var layoutHand = this.getChildByName("layout_handCards");
                        if (layoutHand) {
                            layoutHand.removeAllChildren();
                        }
                        MjClient.playui.refreshHandCard(0);
                        MjClient.playui.changeCardFrame(this, eD.type);
					},
					MJPassWei:function(eD){
						MjClient.playui.handlePassWei(this, eD);
					}
				},
				img_putCard:{
					_layout : [[0.35, 0.35], [0.5, 0.6], [1.8, -0.05]],
					img_cardBg:{
						_visible:false
					}
				},
				layout_head:{
					img_siShou:{
						_visible:false,
						_event:{
							initSceneData:function () {
								MjClient.playui.checkSiShou(this,0);
	                        },
	                        MJPeng: function(eD) {
	                            MjClient.playui.checkSiShou(this,0);
	                        },
	                        HZChiCard: function(eD) {
	                            MjClient.playui.checkSiShou(this,0);
	                        },
	                        HZLiuCard: function(eD) {
	                            MjClient.playui.checkSiShou(this,0);
	                        },
	                        HZWeiCard: function(eD) {
	                            MjClient.playui.checkSiShou(this,0);
	                        },
	                        MJPut: function(eD){
	                            MjClient.playui.checkSiShou(this,0);
	                        },
	                        roundEnd: function(eD){
	                            this.visible = false;
	                        }
						}
					}
				},
				layout_eatDisplay:{
					img_zha:{
						_visible:false
					}
				}
			},
			node_right:{
				_event:{
					MJPassWei:function(eD){
						MjClient.playui.handlePassWei(this, eD);
					}
				},
				layout_head:{
					img_siShou:{
						_visible:false,
						_event:{
							initSceneData:function () {
								MjClient.playui.checkSiShou(this,MjClient.playui.getPlayersNum() - 2);
	                        },
	                        MJPeng: function(eD) {
	                        	MjClient.playui.checkSiShou(this,MjClient.playui.getPlayersNum() - 2);
	                        },
	                        HZChiCard: function(eD) {
	                            MjClient.playui.checkSiShou(this,MjClient.playui.getPlayersNum() - 2);
	                        },
	                        HZLiuCard: function(eD) {
	                            MjClient.playui.checkSiShou(this,MjClient.playui.getPlayersNum() - 2);
	                        },
	                        HZWeiCard: function(eD) {
	                            MjClient.playui.checkSiShou(this,MjClient.playui.getPlayersNum() - 2);
	                        },
	                        MJPut: function(eD){
	                            MjClient.playui.checkSiShou(this,MjClient.playui.getPlayersNum() - 2);
	                        },
	                        roundEnd: function(eD){
	                            this.visible = false;
	                        }
						}
					}
				},
				img_putCard:{
					img_cardBg:{
						_visible:false
					}
				},
				layout_eatDisplay:{
					img_zha:{
						_visible:false
					}
				}
			},
			node_left:{
				_event:{
					MJPassWei:function(eD){
						MjClient.playui.handlePassWei(this, eD);
					}
				},
				layout_head:{
					img_siShou:{
						_visible:false,
						_event:{
							initSceneData:function () {
								MjClient.playui.checkSiShou(this,MjClient.playui.getPlayersNum() - 1);
	                        },
	                        MJPeng: function(eD) {
	                        	MjClient.playui.checkSiShou(this,MjClient.playui.getPlayersNum() - 1);
	                        },
	                        HZChiCard: function(eD) {
	                        	MjClient.playui.checkSiShou(this,MjClient.playui.getPlayersNum() - 1);
	                        },
	                        HZLiuCard: function(eD) {
	                        	MjClient.playui.checkSiShou(this,MjClient.playui.getPlayersNum() - 1);
	                        },
	                        HZWeiCard: function(eD) {
	                        	MjClient.playui.checkSiShou(this,MjClient.playui.getPlayersNum() - 1);
	                        },
	                        MJPut: function(eD){
	                        	MjClient.playui.checkSiShou(this,MjClient.playui.getPlayersNum() - 1);
	                        },
	                        roundEnd: function(eD){
	                            this.visible = false;
	                        }
						}
					}
				},
				img_putCard:{
					img_cardBg:{
						_visible:false
					}
				},
				layout_eatDisplay:{
					img_zha:{
						_visible:false
					}
				}
			},
			node_xing:{
				_event:{
					MJPassWei:function(eD){
						MjClient.playui.handlePassWei(this, eD);
					}
				},
				layout_head:{
					img_siShou:{
						_visible:false,
						_event:{
							initSceneData:function () {
	                            if(MjClient.playui.getPlayersNum() == 4) 
	                            	MjClient.playui.checkSiShou(this,1);
	                        },
	                        MJPeng: function(eD) {
	                            if(MjClient.playui.getPlayersNum() == 4) 
	                            	MjClient.playui.checkSiShou(this,1);
	                        },
	                        HZChiCard: function(eD) {
	                            if(MjClient.playui.getPlayersNum() == 4) 
	                            	MjClient.playui.checkSiShou(this,1);
	                        },
	                        HZLiuCard: function(eD) {
	                            if(MjClient.playui.getPlayersNum() == 4) 
	                            	MjClient.playui.checkSiShou(this,1);
	                        },
	                        HZWeiCard: function(eD) {
	                            if(MjClient.playui.getPlayersNum() == 4) 
	                            	MjClient.playui.checkSiShou(this,1);
	                        },
	                        MJPut: function(eD){
	                            if(MjClient.playui.getPlayersNum() == 4) 
	                            	MjClient.playui.checkSiShou(this,1);
	                        },
	                        roundEnd: function(eD){
	                            this.visible = false;
	                        }
						}
					}
				},
				img_putCard:{
					img_cardBg:{
						_visible:false
					}
				},
				layout_eatDisplay:{
					img_zha:{
						_visible:false
					}
				},
			},
			node_eatChoice:{
				btn_chi:{
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
									if (pl.mjhand.indexOf(putCard) < 0 || copy.indexOf(putCard) >= 0) {
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
				//歪
				btn_wai:{
					_visible:false,
					_layout: [[0, 0.1],[0.5, 0],[0, 2.5]],
					_click: function() {
						MjClient.playui.hideEatBtns();
						MjClient.gamenet.request("pkroom.handler.tableMsg", {cmd: "HZWeiCard"});
					},
					bg_img: {
						_run: function() {
							MjClient.playui.doBtnLightAction(this);
						}
					},
				},
				//溜
				btn_liu:{
					_visible:false,
					_layout: [[0, 0.1],[0.5, 0],[0, 2.5]],
					_click: function() {
						MjClient.playui.hideEatBtns();
						MjClient.playui.showLiuSelectedPanel(0)
					},
					bg_img: {
						_run: function() {
							MjClient.playui.doBtnLightAction(this);
						}
					},
				},
				//飘
				btn_piao:{
					_visible:false,
					_layout: [[0, 0.1],[0.5, 0],[0, 2.5]],
					_click: function() {
						var pl = MjClient.data.sData.players[SelfUid()];
						MjClient.playui.hideEatBtns();
						MjClient.playui.commitLiuCards(pl.piaoCards[0], 1);
					},
					bg_img: {
						_run: function() {
							MjClient.playui.doBtnLightAction(this);
						}
					},
				},
				//碰
				btn_peng:{
					_click: function() {
						MjClient.playui.handlePeng(this);
					}
				},
				//炸
				btn_zha:{
					_visible: false,
					_layout: [[0, 0.1],[0.5, 0],[0, 2.5]],
					_click:function(){
						var pl = MjClient.data.sData.players[SelfUid()];
						MjClient.playui.hideEatBtns();
						MjClient.playui.sendLiuOPToServer(pl.zhaCards[0], 2)
					}
				},
				img_liuSelect:{
					_visible:false,
					_layout: [[0,0.38],[0.5,0.76],[0,0]],
					_run:function(){
						this.setUserData({originalSize: this.getContentSize()});
					}
				},
				_event:{
					MJPassWei:function(){
						MjClient.playui.updateEatBtns();
					},
				}
			},
			btn_putCard:{
				_visible: false,
				_layout: [[0.185, 0.143], [0.75, isIPhoneX() ? 0.6 : 0.5], [0, 0], true],
				_click: function() {
					if (MjClient.selectCard_paohuzi !== null && cc.sys.isObjectValid(MjClient.selectCard_paohuzi)){
						if (MjClient.selectCard_paohuzi.putCardCb){
							MjClient.selectCard_paohuzi.putCardCb();
						}
						MjClient.selectCard_paohuzi = null;
					}
				},
				_event: {
					EZP_chuPai:function () {
                        MjClient.playui.checkPutCardBtnVisible(this);
                        if (MjClient.playui.getChuPaiType() == 0){
                            MjClient.playui.refreshHandCard(0);
                        }
                    },
                    initSceneData: function() {
                        MjClient.playui.checkPutCardBtnVisible(this);
                    },
                    HZCheckRaise: function() {
                        MjClient.playui.checkPutCardBtnVisible(this);
                    },
                    HZChiCard: function() {
                        MjClient.playui.checkPutCardBtnVisible(this);
                    },
                    MJPeng: function() {
                        MjClient.playui.checkPutCardBtnVisible(this);
                    },
                    HZWeiCard: function() {
                        MjClient.playui.checkPutCardBtnVisible(this);
                    },
                    HZGangCard: function() {
                        MjClient.playui.checkPutCardBtnVisible(this);
                    },
                    MJPass: function() {
                        MjClient.playui.checkPutCardBtnVisible(this);
                    },
                    MJPut:function () {
                        MjClient.playui.checkPutCardBtnVisible(this);
                    },
					roundEnd:function(){
					  this.visible = false;
					}
				},
			}
		};
		return jsBind;
	},
});

//检查玩家是否死守
PlayPanel_YuanJiangGuiHuZi.prototype.checkSiShou = function(node, off){
	if(!node || !cc.sys.isObjectValid(node)) return;

	if(!this.isArrowVisible()) return;

	var pl = this.getUIPlayer(off);
	if(!pl) return;

	node.visible = pl && pl.isDead;
};

//当前玩家是否处于这些状态
PlayPanel_YuanJiangGuiHuZi.prototype.isArrowVisible = function(){
	var pl = this.getUIPlayer(0);
	if(!pl) return;

    return (TableState.waitPut == pl.mjState || TableState.waitEat == pl.mjState
        || TableState.waitCard == pl.mjState || TableState.roundFinish == pl.mjState
        || TableState.waitJiazhu == pl.mjState);
};

//Override
PlayPanel_YuanJiangGuiHuZi.prototype.getTableHuXi = function(off) {
    var pl = this.getUIPlayer(off);
    if (!pl) {
        return 0;
    }

	var score = 0;	
	//跑牌
    var paoCards = pl.mjgang0.concat(pl.mjgang3);
	for(var i = 0; i < paoCards.length; i++){
		score += 1;
	}

	//碰
	for(var i = 0; i < pl.mjpeng.length; i++){
		score += 1;
	}

	var getRowHuxi  = function(chiRow) {
        var chiScore = 0;
        chiRow = [].concat(chiRow);

        chiRow.sort(function(a, b) {
            return a - b
        });

        if (chiRow[0] == 2 && chiRow[1] == 7 && chiRow[2] == 10) {
            chiScore += 1;
        } else if (chiRow[0] == 22 && chiRow[1] == 27 && chiRow[2] == 30) {
            chiScore += 1;
        }
        return chiScore;
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
	
	//提牌
	var tiCards = pl.mjgang1.concat(pl.mjgang2);
	for (var i = 0; i < tiCards.length; i++) {
		score += 1;
	}

	//偎牌
	for (var i = 0; i < pl.mjwei.length; i++) {
		score += 1;
	}
    return score;
};

/**
 * 处理溜/飘
 * type 0:溜   1:飘
 */
PlayPanel_YuanJiangGuiHuZi.prototype.showLiuSelectedPanel = function(type) {
	this.hideEatBtns();
	var cancelBtn = MjClient.playui.jsBind.node_eatChoice.btn_cancel._node;
	cancelBtn.visible = true;

	var self = this;
	var sData = MjClient.data.sData;
	var tData = sData.tData;
	var pl = sData.players[SelfUid()];
	
	if((type == 0 && !pl.liuCards) || (type == 1 && !pl.piaoCards))  return;
       
	switch(type){
		//溜
		case 0:
			if(pl.liuCards.length <= 0 && tData.lastPutCard != -1)
				pl.liuCards.push(tData.lastPutCard);
			if(pl.liuCards.length <= 0){
				cancelBtn.visible = false;
				return;
			}
			break;
		//飘
		case 1:
			if(pl.piaoCards.length <= 0 && tData.lastPutCard != -1)
				pl.piaoCards.push(tData.lastPutCard);

			if(pl.piaoCards.length <= 0){
				cancelBtn.visible = false;
				return;
			}
			break;
	}

	var parent = cancelBtn.getParent();
    var liuCardsPanel = parent.getChildByName("img_liuSelect");
	
	this.addLiuCards(liuCardsPanel, pl, type);
};

//溜牌选择面板添加溜牌
PlayPanel_YuanJiangGuiHuZi.prototype.addLiuCards = function(liuCardsPanel, pl, type){
	var self = this;
	var cards = (type == 0) ? pl.liuCards : pl.piaoCards;
    liuCardsPanel.x = cc.winSize.width * 0.865;
	liuCardsPanel.visible = true;

    var children = liuCardsPanel.children;
    for(var i = 0; i < children.length; i++){
        if(children[i].getName() == "cloneBtn"){
            children[i].removeFromParent(true);
        }
    }

    var off_x = 5;
    var selectBtn = liuCardsPanel.getChildByName("btn_select");
    selectBtn.visible = true;
	var startPos = selectBtn.getPosition();
	var originalSize = liuCardsPanel.getUserData().originalSize;

    var off_width = (originalSize.width-selectBtn.width)/2;
    liuCardsPanel.setContentSize(cc.size(selectBtn.width * cards.length + (cards.length-1) * off_x + off_width*2,originalSize.height));

    for(var i = 0; i < cards.length; i++){
        var selectBtnClone = selectBtn.clone();
        selectBtnClone.visible = true;
        selectBtnClone.setName("cloneBtn");

        var card = selectBtnClone.getChildByName("img_card");
        card.visible = false;
        for(var j = 0; j < 4; j++){
            var cardClone = card.clone();
			cardClone.visible = true;
			var src = this.getCardSrc("hand", cards[i]);
			this.loadCardTexture(cardClone, src, this.getResType());
            selectBtnClone.addChild(cardClone);
            cardClone.y += j * card.height * card.scaleY;
        }

        selectBtnClone.setPosition(cc.p(startPos.x + (selectBtnClone.width + off_x) * i, startPos.y));
        liuCardsPanel.addChild(selectBtnClone);
        selectBtnClone.tag = cards[i];

        selectBtnClone.addClickEventListener(function(sender){
            var btnList = liuCardsPanel.children;
            for(var m = 0; m < btnList.length;m++){
                btnList[m].setBright(false);
			}
			self.commitLiuCards(sender.tag, type);
        });
	}
	
    // if(ziPai.getUiLayoutType() == 0){//新布局
    //     doMoveCenterAction_YuanJiangGuiHuZi([liuCardsPanel], false);
    // }
};

//处理溜牌操作
PlayPanel_YuanJiangGuiHuZi.prototype.commitLiuCards = function(card, type){
	var self = this;
	if (MjClient.data.sData.players[SelfUid()].eatFlag & 32) {
        MjClient.showMsg(type == 0 ? "溜牌后视为过胡，确定溜吗？" : "飘牌后视为过胡，确定飘吗？", function() {
            self.hideEatBtns();
            self.sendLiuOPToServer(card, type);
        }, function() {}, "1");
    } else {
        self.hideEatBtns();
        self.sendLiuOPToServer(card, type);
    }
};

//发送溜牌/飘牌消息
PlayPanel_YuanJiangGuiHuZi.prototype.sendLiuOPToServer  = function (card, type){
    if (MjClient.rePlayVideo != -1) {
        return; // 回放时候不能请求
    }
    var optFlag;
    if(type == 0)
    {
        optFlag = 16;
    }
    else if(type == 1)
    {
        optFlag = 4;
    }
    else if(type == 2)
    {
        optFlag = 64;
    }
    if(card){
        MjClient.gamenet.request("pkroom.handler.tableMsg", {
            cmd: "HZLiuCard",
            card: card,
            optFlag:optFlag
        });
    }
};

//处理碰牌操作
PlayPanel_YuanJiangGuiHuZi.prototype.handlePeng  = function (sender){
	var self = this;
	var pl = MjClient.data.sData.players[SelfUid()];
	var tData = MjClient.data.sData.tData;
	var roomMsgValue = tData.tableid +":"+tData.roundNum;
	var saveRoomMsgValue = util.localStorageEncrypt.getStringItem("IGNORE_G_TIP","");
	if (MjClient.data.sData.players[SelfUid()].eatFlag & 32) {
		MjClient.showMsg("选择碰后视为过胡，确定碰吗？", function() {
			self.hideEatBtns();
			self.sendPengOPToServer();
		}, function() {}, "1");
	}else if(MjClient.majiang.cardHandCount(pl.mjhand, tData.lastPutCard) == 3){	
		if(saveRoomMsgValue.length > 0 && saveRoomMsgValue == roomMsgValue){
			self.hideEatBtns();
			self.sendPengOPToServer();
			return;
		}

		MjClient.showMsg("已有三张相同的牌，确定碰吗？", function(result) {
			if(result && result.isSelect){
				//选择了不在提示,
				util.localStorageEncrypt.setStringItem("IGNORE_G_TIP",roomMsgValue);
			}
			self.hideEatBtns();
			self.sendPengOPToServer();
		}, function(result) {
			if(result && result.isSelect){
				//选择了不在提示,
				util.localStorageEncrypt.setStringItem("IGNORE_G_TIP",roomMsgValue);
			}
		}, "3");
	}else{
		self.hideEatBtns();
		self.sendPengOPToServer();
	}
};

//发送碰牌消息
PlayPanel_YuanJiangGuiHuZi.prototype.sendPengOPToServer = function(){
	MjClient.gamenet.request("pkroom.handler.tableMsg", {
		cmd: "MJPeng"
	});
};

/**
 * Override
 * 获取操作按钮数组
 */
PlayPanel_YuanJiangGuiHuZi.prototype.getShowEatNodes = function() {
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var eat = MjClient.playui.jsBind.node_eatChoice;
    var pl = sData.players[SelfUid() + ""];
    if (!pl) {
        return;
    }

    if (tData.tState == TableState.roundFinish) {
        return [];
    }

	var vnode = [];
	
	//胡
	if(pl.eatFlag & 32)
		vnode.push(eat.btn_hu._node);

	//吃
	if(pl.eatFlag & 1)
		vnode.push(eat.btn_chi._node);

	//飘
	if(pl.eatFlag & 4)
		vnode.push(eat.btn_piao._node);

	//炸
	if (pl.eatFlag & 64) {
		vnode.push(eat.btn_zha._node);
	}

	//溜
	if(pl.eatFlag & 16)
		vnode.push(eat.btn_liu._node);

	//歪
	if(pl.eatFlag & 8)
		vnode.push(eat.btn_wai._node);

	// 碰
	if (pl.eatFlag & 2)
		vnode.push(eat.btn_peng._node);

	if(vnode.length > 0 && !((pl.eatFlag & 8) && (pl.eatFlag & 32) && tData.areaSelectMode.isKaWai)
		&& !((pl.eatFlag & 16) && pl.mjhand.length % 3 == 2 && MjClient.majiang.getCanPutCardNum(pl) == 0))
		vnode.push(eat.btn_guo._node);

    return vnode;
};

//验证按钮显示与玩家eatFlag是否能对应上
PlayPanel_YuanJiangGuiHuZi.prototype.checkBtnWithPlayerFlag = function(){
    var sData = MjClient.data.sData;
    var pl = sData.players[SelfUid() + ""];
    if(!pl){
        return;
    }
	var btnArray = [];
	//吃
    if (pl.eatFlag & 1) {
        btnArray.push("btn_chi");
	}
	//碰
    if (pl.eatFlag & 2) {
        btnArray.push("btn_peng");
	}
	//飘
	if(pl.eatFlag & 4){
		btnArray.push("btn_piao");
	}
	//歪
	if(pl.eatFlag & 8){
		btnArray.push("btn_wai");
	}
	//溜
	if(pl.eatFlag & 16){
		btnArray.push("btn_liu");
	}
	//胡
    if (pl.eatFlag & 32) {
        btnArray.push("btn_hu");
    }
    var eat = MjClient.playui.jsBind.node_eatChoice;
    for(var i = 0;i < btnArray.length;i++){
        var btnName = btnArray[i];
        if(!eat[btnName]._node.visible){
            MjClient.gamenet.request("pkroom.handler.tableMsg", {
                cmd: "checkBtnWithFlag",
                mjState: pl.mjState,
                eatFlag: pl.eatFlag,
                tableid: sData.tData.tableid,
            });   
            break;          
        }
    }
};

// 初始化手牌
PlayPanel_YuanJiangGuiHuZi.prototype.initHandCards = function(node, msg) {
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
            MjClient.OtherHandArr[off] = MjClient.majiang.sortCard3(hand, 2);
        }else{
            MjClient.OtherHandArr[off] = MjClient.majiang.sortCard3(pl.mjhand || [], 2);
        }
	}
	
	//整理自己手牌
    if (MjClient.rePlayVideo == -1 && off == 0) {
        MjClient.HandCardArr = MjClient.majiang.sortCard3(pl.mjhand || [], 2);
    }
    this.refreshHandCard(off);
};

//坎是否置灰
PlayPanel_YuanJiangGuiHuZi.prototype.is34Mask = function() {
    return false;
};

/**
 * 获取吃牌列表
 */
PlayPanel_YuanJiangGuiHuZi.prototype.getChiCards = function () {
    var sData = MjClient.data.sData;
    var pl = sData.players[SelfUid()];
    var putCard = sData.tData.lastPutCard;
    return MjClient.majiang.getChiList(pl, putCard);
};

//Override
PlayPanel_YuanJiangGuiHuZi.prototype.addOutFrame = function (outCard, pl, index) {
	var flag = pl.mjputType[index];
	if(flag == 0){
        var frame = new ccui.ImageView("playing/paohuziTable/putCardFrame_new.png");
        frame.x = outCard.width / 2;
        frame.y = outCard.height / 2;
        outCard.addChild(frame);
    }
}

//总结算面板
PlayPanel_YuanJiangGuiHuZi.prototype.createGameOverLayer = function(type) {
    return new GameOverLayer_YuanJiangGuiHuZi();
};

//小结算面板
PlayPanel_YuanJiangGuiHuZi.prototype.createEndOneLayer = function(type) {
    return new EndOneView_YuanJiangGuiHuZi();
};

/**
 * Override
 * 显示吃牌选择
 */
PlayPanel_YuanJiangGuiHuZi.prototype.showSelectEatCards = function() {
    var self = this;
    var sData = MjClient.data.sData;
    var pl = sData.players[SelfUid()];
    var putCard = sData.tData.lastPutCard;

    this.hideEatBtns();
    MjClient.playui.jsBind.node_eatChoice.btn_cancel._node.visible = true;

    var selectBgArr = [MjClient.playui.jsBind.node_eatChoice.img_chiSelect._node];

    var selectedCardsArr = []; //记录选择的组合
    var bShowEatCardsScaleAction = false; //是否执行缩放动画

    //添加一组可以吃或比的牌
    var addSelectEatCardsRow = function(handCardArr) {
        var selectBg = selectBgArr[selectedCardsArr.length];
        selectBg.visible = true;
        selectBg.x = cc.winSize.width * 0.5;
	
		var optionCards;
        if (selectedCardsArr.length == 0)
            var optionCards = self.getChiCards();

        if (!optionCards || optionCards.length == 0)
            return;

        var optionBtns = self.addSelectEatBtns(selectBg, optionCards);
        for (var i = 0; i < optionBtns.length; ++i) {
            var btn = optionBtns[i];
            (function(tag, cards) {
                btn.addClickEventListener(function(btn) {
                    bShowEatCardsScaleAction = (tag + 1) > selectedCardsArr.length;
                    selectedCardsArr = selectedCardsArr.slice(0, tag);
                    selectedCardsArr.push(cards);

                    for (var m = 0; m < optionBtns.length; m++) {
                        optionBtns[m].setBright(true);
                    }
                    btn.setBright(false);

                    self.commitEatCard(selectedCardsArr[0], null);
                });
            })(selectedCardsArr.length, optionCards[i]);
        }
        self.doSelectEatAction(selectBgArr.slice(0, selectedCardsArr.length + 1), bShowEatCardsScaleAction);
    };
    addSelectEatCardsRow(pl.mjhand.slice());
};

/**
 * Override
 * 判断是否可以出牌
 */
PlayPanel_YuanJiangGuiHuZi.prototype.checkCardCanPut = function(pl, card) {
	var tData = MjClient.data.sData.tData;
	//没有轮到我
	if(!IsTurnToMe())
		 return false;
		 
	//混牌不能出
	if(MjClient.majiang.isEqualHunCard(card))
		return false;
	
	//不能出的牌中包含这张牌
	if(pl.canNotPutCard && pl.canNotPutCard.indexOf(card) > -1)
		return false;

	//能出的牌张数为0
	if(MjClient.majiang.getCanPutCardNum(pl) == 0)
		return false;
		
	if(!((tData.tState == TableState.waitPut && pl.mjState == TableState.waitPut) || ( pl.eatFlag  == 16 && tData.doAfterCanLiuList[pl.info.uid]
		&& tData.tState == TableState.waitEat && (!pl.canNotPutCard||pl.canNotPutCard.indexOf(btnTag)==-1))))
		return false;
    return true;
};

/**
 * Override
 * 获取吃牌的展示类型（0：不可见   1：蒙层   2 可见  3 置灰）
 * @param eatType 吃牌类型
 * @param card 显示的牌
 * @param cardIndex 吃牌列中位置
 * @param off 位置偏移
 * @returns {number}
 */
PlayPanel_YuanJiangGuiHuZi.prototype.getEatCardShowType = function(eatType, card, cardIndex, off) {
	var tData = MjClient.data.sData.tData;
	var pl = this.getUIPlayer(off);
	var showType = 2;
	
	//吃，最上面一张蒙层，其他正常显示
	if(eatType == "mjchi")
		showType = cardIndex < 2 ? 2 : 3;

	//碰，三张全明
	if(eatType == "mjpeng")
		showType = 2;
	
	//偎
	if(eatType == "mjwei"){
		var skipPeng = pl.skipPeng;
		if(MjClient.majiang.getCardShowType(pl.info.uid,card)){
			if(tData.areaSelectMode["anWaiLiu"]){
				if(off == 0)
					showType = cardIndex < 2 ? 0 : 2;
				else
					showType = 0;
			}else
				showType = cardIndex < 2 ? 0 : 2;
		}else if(!skipPeng || skipPeng.indexOf(card) < 0){
			if(tData.areaSelectMode["anWaiLiu"]){
				if(off == 0)
					showType = cardIndex < 2 ? 0 : 2;
				else
					showType = 0;
			}else
				showType = cardIndex < 2 ? 0 : 2;
		}else{
			showType = cardIndex < 2 ? 0 : 2;
		}
	}
	
	if(eatType == "mjgang0")
		showType = 2;
	
	if(eatType == "mjgang1"){
		if(tData.areaSelectMode["anWaiLiu"]){
			if(off == 0)
				showType = cardIndex < 3 ? 0 : 2;
			else
				showType = 0; 
		}else
			showType = cardIndex < 3 ? 0 : 2;
	}

	if(eatType == "mjgang2"){
		var isQiShouLiu = tData.qiShouLiuList[pl.info.uid].indexOf(card) != -1;
		if(tData.areaSelectMode["anWaiLiu"] || isQiShouLiu){
			if(off == 0)
				showType = cardIndex < 3 ? 0 : 2;
			else
				showType = 0;
		}else
			showType = cardIndex < 3 ? 0 : 2;
	}

	if(eatType == "mjgang3")
		showType = 2;
		
    return showType;
};

/**
 * Override
 * 获取拓展类型的数据
 * @param eatType 吃牌类型
 * @param off 位置偏移
 */
PlayPanel_YuanJiangGuiHuZi.prototype.getExtendEatCardArr = function(eatType, off, pos) {
	var cardArr = [];
	if(eatType == "mjgang3"){
		var pl = this.getUIPlayer(off);
    	var eatArr = pl[eatType];
    	var pos = typeof(pos) == "undefined" ? (eatArr.length - 1) : pos;
		var card = eatArr[pos];
		var tempArr = [];
		for(var i = 0; i < 4; i++)
			tempArr.push(card);

		cardArr.push(tempArr);
	}
	return cardArr;
};

/**
 * Override
 */
PlayPanel_YuanJiangGuiHuZi.prototype.getEatLabel = function(eatType) {
	var res = null;
	if(eatType == "mjwei")
		res = "playing/paohuzi/t_wai.png";

	if(eatType == "mjgang0")
		res = "playing/paohuzi/t_piao.png";
	
	if(eatType == "mjgang1")
		res = "playing/paohuzi/t_liu.png";
    return res;
};

/**
 * 展示吃牌特效字
 * @param eatType 吃牌类型
 * @param off 位置偏移
 */
PlayPanel_YuanJiangGuiHuZi.prototype.displayEatLabel = function(node, eatType, msg) {
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
		mjgang3: "img_zha",
		hu: "img_hu",
		
    };
    var eatLabel = layout_eatCards.getChildByName(labels[eatType]);
    eatLabel.visible = true;

    if(this.getEatLabel(eatType)){
        eatLabel.loadTexture(this.getEatLabel(eatType));
    }

    if (this.isAniParallel()) {
        eatLabel.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(() => {
            eatLabel.visible = false;
        })));
    } else {
        if (eatLabel.getUserData()) {
            eatLabel.scale = eatLabel.getUserData().scale;
        } else {
            eatLabel.setUserData({
                scale: eatLabel.scale
            });
        }

        var initScale = eatLabel.scale;
        eatLabel.runAction(cc.sequence(cc.scaleTo(0.3, initScale * 1.5), cc.delayTime(0.5), cc.scaleTo(0.3, initScale), cc.callFunc(() => {
            eatLabel.visible = false;
        })));
    }
};

// 出牌线&出牌手指动画
PlayPanel_YuanJiangGuiHuZi.prototype.checkCutLineVisible = function(node) {
    var cutLine = node || this.jsBind.img_cutLine._node;
	var finger = this.jsBind.img_finger._node;
	var putSureBtn = this.jsBind.btn_putCard._node;

    cutLine.visible = false;
	finger.visible = false;
	putSureBtn.visible = false;
    if (MjClient.hasPut) {
        return;
	}

	var tData = MjClient.data.sData.tData;
	var status = true;
	var pl = this.getUIPlayer(0);

	if ((!IsTurnToMe() || tData.tState != TableState.waitPut) &&
		!( pl.eatFlag  == 16 && tData.doAfterCanLiuList[pl.info.uid] && tData.tState == TableState.waitEat && MjClient.majiang.getCanPutCardNum(pl) != 0)) {
		status = false;
	} else {
		status = true;

		if (pl.isQiHu) {
			status = false;
		}
	}

	finger.stopAllActions();
	finger.setOpacity(255);
	if(!finger.getChildByTag(100)){
		finger.loadTexture("playing/fingerEffer/finger.png");
		var sp = new cc.Sprite("playing/fingerEffer/finger0.png");
		sp.setTag(100);
		sp.x = 120;
		sp.y = 120;
		finger.addChild(sp);
		var ac = createAnimation("playing/fingerEffer/finger",13,cc.rect(0, 0,166,195),0.07);
		sp.runAction(cc.sequence([ac]).repeatForever());
	}
	finger.stopAllActions();
	finger.visible = status && this.getChuPaiGuide() == 0;
	finger.setLocalZOrder(putSureBtn.getLocalZOrder()+1);
	var action1 = cc.fadeTo(0.5, 0);
	var action2 = cc.fadeTo(0.5, 255);
	var seq = cc.sequence(action1, action2);
	finger.runAction(cc.repeatForever(seq));

	cutLine.visible = status;
	putSureBtn.visible = status && this.getChuPaiType() == 0;
	cutLine.visible = status;
};

//Override
PlayPanel_YuanJiangGuiHuZi.prototype.setCardTouchHandler = function(card,off){
    var self = this;
    var pl = this.getUIPlayer(off);
    var dict = {};
    for (var i = 0; i < pl.mjhand.length; i++) {
        var cd = pl.mjhand[i];
        dict[cd] = dict[cd] ? dict[cd] + 1 : 1;
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
            MjClient.selectCard_paohuzi = null;
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
            MjClient.moveCard.curPosition = btn.parent.convertToWorldSpace(cc.p(btn.x - btn.anchorX * btn.width * btn.scaleX,  btn.y - btn.anchorY * btn.height * btn.scaleY));
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

            var resetPos = function(){
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
                } else if (MjClient.HandCardArr.length < 10){ // 最前或最后 新增一列
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
			// 出牌
            var isPutCommon = tData.tState == TableState.waitPut;
            var isPutSpecil = MjClient.playui.checkPutSpecil();
            var putCardCb = function () {
				if(IsTurnToMe() && (isPutCommon || isPutSpecil) && MjClient.playui.checkCardCanPut(pl, card) && !MjClient.hasPut && 
					(pos.y > MjClient.playui.jsBind.img_cutLine._node.y || MjClient.selectCard_paohuzi)){
					function doPut() {
                        var putNode = MjClient.playui.getUINode(0).getChildByName("img_putCard");
                        putNode.stopAllActions();
                        putNode.visible = true;
                        putNode.opacity = 255;
                        var src = self.getCardSrc("put", card, false);
						putNode.getChildByName("img_card").loadTexture(src, 0); // todo
						putNode.loadTexture(MjClient.playui.getPutCardBg(0));

                        var pos = putNode.getUserData().pos;

                        var p = btn.parent.convertToWorldSpace(cc.p(btn.x + (0.5 - btn.anchorX) * btn.width * btn.scaleX, btn.y + (0.5 - btn.anchorY) * btn.height * btn.scaleY));
                        putNode.setPosition(putNode.parent.convertToNodeSpace(p));
						putNode.setScale(putNode.getUserData().scale);
						
						var putCardBg = putNode.getChildByName("img_cardBg");//出牌光圈
						putCardBg.loadTexture("playing/paohuzi/mopai_bj_new.png");

						var putCard = putNode.getChildByName("img_card")
						putCardBg.scaleX = 0.858;
						putCardBg.scaleY = 0.935;
						putCardBg.x = putCard.x;
						putCardBg.y = putCard.y - 0.5;
						putCardBg.visible = true;

                        putNode.runAction(cc.moveTo(MjClient.playui.getActionTime(), pos.x, pos.y));
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
                        MjClient.playui.checkPutCardBtnVisible();
                    }

					doPut();
					MjClient.playui.refreshHandCard(0);
    
                }else {
					resetPos();
					MjClient.playui.refreshHandCard(0);
                }
                
            };

            if (pos.y > MjClient.playui.jsBind.img_cutLine._node.y) {
                putCardCb();
            }else{
                resetPos();
                MjClient.playui.refreshHandCard(0);
                if (IsTurnToMe() && (isPutCommon || isPutSpecil) && MjClient.playui.checkCardCanPut(pl, card) && !MjClient.hasPut){
                    if (MjClient.playui.getChuPaiType() == 0) {
                        MjClient.selectCard_paohuzi = btn;
                        MjClient.selectCard_paohuzi.setColor(cc.color(170, 170, 170));
                        MjClient.selectCard_paohuzi.putCardCb = putCardCb;

                        col = btn.parent.tag;
                        row = btn.name;
                    }
                }
            }

            if (MjClient.playui.hasTingByPut()) {
                MjClient.playui.checkTingCardsNew();
            } else if(MjClient.playui.isCheckTingStats()){
                MjClient.playui.checkTingStats();
            }else{
                MjClient.playui.checkTingCards();
            }
            MjClient.addGroupIndex = -1;
            delete MjClient.moveCard;
        }
    });   
};

//出牌按钮
PlayPanel_YuanJiangGuiHuZi.prototype.checkPutCardBtnVisible = function(node) {
    node = node || MjClient.playui.jsBind.btn_putCard._node;
    node.visible = !MjClient.hasPut && this.getChuPaiType() == 0 && (IsTurnToMe() && MjClient.data.sData.tData.tState == TableState.waitPut);
};

/**
 * Override
 * 移除手牌中的此次吃牌
 * @param eatType 吃牌类型
 * @param cardArr 吃牌数据
 * @param card 吃的牌
 * @param msg 后端返回吃牌信息
 * @param off 位置偏移
 */
PlayPanel_YuanJiangGuiHuZi.prototype.removeEatArrFromHand = function(eatType, cardArr, msg, off) {
    var card = this.getEatCard(eatType, off);
    if (eatType == "mjchi") {
        this.removeChiFromHand(cardArr, card, off);
    } else if (eatType == "mjpeng") {
        this.removePengFromHand(card, off);
    } else if (eatType == "mjgang0" || eatType == "mjgang1" || eatType == "mjgang2" || eatType == "mjgang3") {
        this.removeGangFromHand(eatType, card, off);
    } else if (eatType == "mjwei") {
        this.removeWeiFromHand(card, msg, off);
    } else {
        this.removeExtendFromHand(eatType, cardArr, card, msg, off);
    }
};

PlayPanel_YuanJiangGuiHuZi.prototype.apartGangType = function(eatType, msg) {
	var eatType = eatType;

	if(eatType == "mjgang"){
		if(msg.type == 2)//跑
			eatType = "mjgang0";
		else if(msg.type == 3)//炸
			eatType = "mjgang3";
		else if(msg.type == 1){//溜
			//手牌四张直接溜
			if(msg.liuType == 2)
				eatType = "mjgang2";
			else//手中三张或者外后溜
				eatType = "mjgang1";
		}
	}
    return eatType;
};

//Override
PlayPanel_YuanJiangGuiHuZi.prototype.getEatCardArr = function(eatType, off, pos) {
    if (eatType == "mjchi") {
        return this.getChiCardArr(off, pos);
	} else if (eatType == "mjpeng" || eatType == "mjgang0" || eatType == "mjwei" || eatType == "mjgang1" 
		|| eatType == "mjgang2" || eatType == "mjgang3") {
        return this.getOtherEatCardArr(eatType, off, pos);
    } else {
        return this.getExtendEatCardArr(eatType, off, pos);
    }
};

//Override
PlayPanel_YuanJiangGuiHuZi.prototype.getOtherEatCardArr = function(eatType, off, pos) {
    var card = this.getEatCard(eatType, off, pos);
    var countArr = {
        mjpeng: 3,
        mjgang0: 4,
        mjwei: 3,
        mjgang1: 4,
		mjgang2: 4,
		mjgang3: 4,
    };
    var cardArr = [];
    var tempArr = [];
    for (var i = 0; i < countArr[eatType]; i++) {
        tempArr.push(card);
    }
    cardArr.push(tempArr);
    return cardArr;
};

//Override
PlayPanel_YuanJiangGuiHuZi.prototype.getEatCard = function(eatType, off, pos) {
    var pl = this.getUIPlayer(off);
    var eatAll = {
        mjchi: pl.mjchiCard,
        mjpeng: pl.mjpeng,
        mjgang0: pl.mjgang0,
        mjwei: pl.mjwei,
        mjgang1: pl.mjgang1,
		mjgang2: pl.mjgang2,
		mjgang3: pl.mjgang3,
    };
    var eatArr = eatAll[eatType];
    var pos = typeof(pos) == "undefined" ? (eatArr.length - 1) : pos;
    return eatArr[pos];
};

//Override
PlayPanel_YuanJiangGuiHuZi.prototype.isCheckTingStats = function() {
    return true;
}

//Override
PlayPanel_YuanJiangGuiHuZi.prototype.hasTingByPut = function() {
    return true;
};

//Override
PlayPanel_YuanJiangGuiHuZi.prototype.getTingStats = function(putCard) {
    var sData = MjClient.data.sData;
	var pl = sData.players[SelfUid()];
	if(pl.isDead || !pl.mjhand || pl.mjhand.length == 0)
		return {};
    return MjClient.majiang.getTingStats(sData, pl, putCard, true);
}

//Override
PlayPanel_YuanJiangGuiHuZi.prototype.checkTingStats = function(putCard) {
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    if (tData.tState == TableState.waitPut && this.isCurPlayer(0) && putCard === undefined) {
        postEvent("showTingStats", {});
        return;
    }
    if (putCard && (!this.isCurPlayer(0) || tData.tState != TableState.waitPut)) {
        putCard = undefined;
	}
    postEvent("showTingStats", this.getTingStats(putCard));
};

//Override
PlayPanel_YuanJiangGuiHuZi.prototype.changeEatBtnLayout = function(btnNode, len, idx) {
    var type = this.getLayoutType();
    switch (type) {
        case 1:
            setWgtLayout(btnNode, [0, 0.20], [0.5, 0.18], [(idx - (len - 1) / 2) * 1.3, 1.8], false, false);
            break;
        case 0:
			if(btnNode.name == "btn_guo")
				setWgtLayout(btnNode, [0, 0.16], [0.88 - (len - 1 - idx) * 0.12, 0.11], [-0.08, 2.25], false, false);
			else
            	setWgtLayout(btnNode, [0, 0.20], [0.88 - (len - 1 - idx) * 0.12, 0.11], [0, 1.8], false, false);
            break;
    }
};

//Override
PlayPanel_YuanJiangGuiHuZi.prototype.getGameBgList = function() {
    return ["playing/paohuziTable/beijing_1.jpg", "playing/paohuziTable/beijing_2.jpg", "playing/paohuziTable/beijing_3.jpg","playing/paohuziTable/beijing_4.jpg"];
};

/**
 * Override
 * 字牌字体列表
 */
PlayPanel_YuanJiangGuiHuZi.prototype.getCardFontList = function() {
    return ["playing/paohuzi/", "playing/paohuzi/MJBg4/", "playing/paohuzi/MJBg2/", "playing/paohuzi/MJBg3/"];
};

/**
 * Override
 * @param node 
 * @param {String} type 改变的类型:font|size
 */
PlayPanel_YuanJiangGuiHuZi.prototype.changeCardFrame = function(node, type) {
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

    var list = this.getCardFontList();
    var idx = this.getCardFontIdx();

	var newFile = "";
	var replacedStr = "";
	switch(idx){
		case 0 :
			replacedStr = list[idx];
			if (oldFile.indexOf(list[1]) != -1){
				newFile = oldFile.replace(list[1], replacedStr);
			}else if (oldFile.indexOf(list[2]) != -1){
				newFile = oldFile.replace(list[2], replacedStr);
			}else if (oldFile.indexOf(list[3]) != -1){
				newFile = oldFile.replace(list[3], replacedStr);
			}
			break;
		case 1 :
			replacedStr = list[idx];
			if (oldFile.indexOf(list[1]) != -1){
				
			}else if (oldFile.indexOf(list[2]) != -1){
				newFile = oldFile.replace(list[2], replacedStr);
			}else if (oldFile.indexOf(list[3]) != -1){
				newFile = oldFile.replace(list[3], replacedStr);
			}else if(oldFile.indexOf(list[0]) != -1){
				newFile = oldFile.replace(list[0], replacedStr);
			}
			break;
		case 2 :
			replacedStr = list[idx];
			if (oldFile.indexOf(list[2]) != -1){
				
			}else if (oldFile.indexOf(list[1]) != -1){
				newFile = oldFile.replace(list[1], replacedStr);
			}else if (oldFile.indexOf(list[3]) != -1){
				newFile = oldFile.replace(list[3], replacedStr);
			}else if(oldFile.indexOf(list[0]) != -1){
				newFile = oldFile.replace(list[0], replacedStr);
			}
			break;
		case 3 :
			replacedStr = list[idx];
			if (oldFile.indexOf(list[3]) != -1){
				
			}else if (oldFile.indexOf(list[1]) != -1){
				newFile = oldFile.replace(list[1], replacedStr);
			}else if (oldFile.indexOf(list[2]) != -1){
				newFile = oldFile.replace(list[2], replacedStr);
			}else if(oldFile.indexOf(list[0]) != -1){
				newFile = oldFile.replace(list[0], replacedStr);
			}
			break;
	}

    if (newFile != oldFile && ((jsb.fileUtils.isFileExist(newFile) && this.getResType() == 0) || this.getResType() == 1)) {
        //node.loadTexture(newFile, (node.getParent().getName() == "img_putCard" || (this.isShowLongCard() && node == MjClient.movingCard_paohuzi)) ? 0 : this.getResType());
        this.loadCardTexture(node, newFile, (node.getParent().getName() == "img_putCard" || (this.isShowLongCard() && node == MjClient.movingCard_paohuzi)) ? 0 : this.getResType())
    }
};

/**
 * Override
 * 字牌资源路径
 */
PlayPanel_YuanJiangGuiHuZi.prototype.getCardFilePath = function() {
	var fontList = this.getCardFontList();
	var fontIdx = this.getCardFontIdx();

    return fontList[fontIdx];
};

/**
 *  Override
 * 摸牌是否显示牌背
 */ 
PlayPanel_YuanJiangGuiHuZi.prototype.isShowCardBack = function(msg, node, isReconnect) {
	var tData = MjClient.data.sData.tData;
	var isShowBack = false;
	if(isReconnect){
		var off = this.getUIOffByNode(node);
		var currIndex = (tData.uids.indexOf(SelfUid()) + off) % this.getPlayersNum();
        isShowBack = tData.uids[currIndex] == tData.uids[tData.curPlayer] 
			&& tData.uids[currIndex] != SelfUid() && tData.mjHideCard[tData.uids[currIndex]].indexOf(tData.currCard) >= 0;
			 
	}else
		isShowBack = msg && SelfUid() != msg.uid && ((msg.mjHide && msg.mjHide.indexOf(msg.newCard) >= 0) || tData.isLastDraw == true);
    return isShowBack;
};

/**
 * Override
 * 获取长牌背景
 * @param putType
 * @returns {string}
 */
PlayPanel_YuanJiangGuiHuZi.prototype.getPutCardBg = function (putType) {
    return "playing/paohuzi/mopai_bj_no_effect.png";
};

/**
 * Override
 * 更新展示牌(背光跟牌)
 */
PlayPanel_YuanJiangGuiHuZi.prototype.updatePutCard = function(node, msg, isReconnect, card, isNotPlayAnin) {
    var tData = MjClient.data.sData.tData;
    var putType = tData.putType;
	var card = card || tData.currCard;
	
	if(node.isPick){
        delete node.isPick;
    }

    var off = this.getUIOffByNode(node);
    if (!this.isCurPlayer(off) || card == -1 || !this.isInPlay()) {
        return;
    }

    // 牌局中自己手动出牌
    if (putType == 0 && off == 0 && MjClient.rePlayVideo == -1 && !this.isInTrust(SelfUid()) && !isReconnect) {
		if(!node.visible){
            node.visible = true;
        }
        return;
    }

    node.loadTexture(this.getPutCardBg(putType));
    node.visible = true;
    node.opacity = 255;

    var putCard = node.getChildByName("img_card"); // 牌
	var src = this.getCardSrc("put", card, this.isShowCardBack(msg, node, isReconnect));
	
	var putCardBg = node.getChildByName("img_cardBg");//出牌光圈
	putCardBg.loadTexture("playing/paohuzi/mopai_bj_new.png");
	
	putCardBg.scaleX = 0.858;
	putCardBg.scaleY = 0.935;
	putCardBg.x = putCard.x;
	putCardBg.y = putCard.y - 0.5;
	putCardBg.visible = (putType == 0 && !this.isShowCardBack(msg, node, isReconnect));

	putCard.loadTexture(src, 0);

	if(isNotPlayAnin) return;
    this.showPutCardAnimation(node);
};


PlayPanel_YuanJiangGuiHuZi.prototype.getDefaultSetting = function() {
    return {
        layout: 0,
        bg: 0,
        pai: 1,
        fastEat: 0,
        huXi: 1,
        xuXian: 0,
        suDu: 0,
        size: 0,
        voice: 0,
        ting: 0,
        chuBtn: 0,
        dblClick: 1,
        chuGuide:0,
    };
};

/**
 * Override
 * 获取当前吃牌列的总数
 * @param curLineCount 当前吃牌列的总数（吃牌有比牌）
 * @param off 位置偏移
 * @returns {number}
 */
PlayPanel_YuanJiangGuiHuZi.prototype.getLastEatNodeLineCount = function(curLineCount, off) {
    var indexInUids = this.getIndexInUids(off);
    var pl = MjClient.data.sData.players[MjClient.data.sData.tData.uids[indexInUids]];
	var totalLinesCount = pl.mjpeng.length + pl.mjwei.length + pl.mjgang0.length + pl.mjgang1.length + (pl.mjgang2 ? pl.mjgang2.length : 0);
	totalLinesCount += (pl.mjgang3 ? pl.mjgang3.length : 0)
    for (var i = 0; i < pl.mjchi.length; i++) {
        totalLinesCount += 1;
        if (pl.mjchi[i].biCards) {
            totalLinesCount += pl.mjchi[i].biCards.length;
        }
    }
    return totalLinesCount - curLineCount;
};

/**
 * 显示一个吃牌列节点
 * @param eatCardNode 吃牌列节点
 * @param lastLineCount 已有的吃牌列总数
 * @param isInit 是否牌桌初始化
 * @param eatType 吃牌类型
 * @param off 位置偏移
 */
PlayPanel_YuanJiangGuiHuZi.prototype.dislpayEatCardNode = function(eatCardNode, lastLineCount, isInit, eatType, off) {
    var layout_eatCards = this.getUINode(off).getChildByName("layout_eatCards");
    var point = this.getEatCardPoint(off);
    var targetY = point.y;
    var targetX = point.x + point.dx * lastLineCount * eatCardNode.cardWidth;
    if (!isInit && (eatType == "mjgang0" || eatType == "mjgang1" || eatType == "mjgang2" || eatType == "mjgang3")) {
        var card = this.getEatCard(eatType, off);
        var children = layout_eatCards.children;
        for (var i = 0; i < children.length; i++) {
            var cardParent = children[i];
            if (cardParent.children[0].tag == card) {
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

/**
 * 新听牌显示
 * @param putCard
 */
PlayPanel_YuanJiangGuiHuZi.prototype.checkTingCardsNew = function(putCard) {
    var sData = MjClient.data.sData;
    var tData = sData.tData;

    if (tData.tState != TableState.waitPut) {
        return;
    }

    if (tData.tState == TableState.waitPut && this.isCurPlayer(0) && putCard === undefined) {
        postEvent("showTingLayer", []);
        postEvent("showNewTingLayer", []);
        return;
    }

    if (putCard && (!this.isCurPlayer(0) || tData.tState != TableState.waitPut)) {
        putCard = undefined;
    }

    if (!this.isCurPlayer(0))
        return;

    var pl = sData.players[SelfUid()];
    var textData = MjClient.majiang.getTingStats(sData, pl, putCard , true);
    postEvent("showNewTingLayer", textData);
};

//获取听的牌
PlayPanel_YuanJiangGuiHuZi.prototype.getTingCards = function(sData, pl, putCard) {
    return MjClient.majiang.getTingCards(sData, pl, putCard, true);
};

//Override
// 判断吃、碰、胡、过操作按钮的状态
PlayPanel_YuanJiangGuiHuZi.prototype.updateEatBtns = function(msg) {
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
	var tData = MjClient.data.sData.tData;
	if (MjClient.rePlayVideo == -1){
        if (msg && SelfUid() != msg.uid){
            if (msg.mjHide && msg.mjHide.indexOf(msg.newCard) >= 0)
                return;
        }
        if(tData.mjHideCard){
            if(tData.uids[tData.curPlayer] != SelfUid() && tData.mjHideCard[tData.uids[tData.curPlayer]].indexOf(tData.currCard) >= 0)
                return;
        }
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

//处理过偎
PlayPanel_YuanJiangGuiHuZi.prototype.handlePassWei = function(node,eD){
	//自己过偎，不用刷新出牌
	if(eD.uid == SelfUid()) return;
	var off = this.getUIOffByNode(node);
	var pl = this.getUIPlayer(off);
	
	var putNode = node.getChildByName("img_putCard");
	if(putNode.visible == false) return;
	this.updatePutCard(putNode, null, false, eD.lastPutCard, true);
}

/**
 * Override
 * 改变手牌大小
 */
PlayPanel_YuanJiangGuiHuZi.prototype.changeHandCardSize = function(handCard) {
	var src = this.getCardSrc("hand", 1)
    //handCard.loadTexture(src, this.getResType());
    this.loadCardTexture(handCard, src, this.getResType());
    var idx = this.getCardSizeIdx();
	var cardSize = [98,84,105,103];
    setWgtLayout(handCard, [cardSize[idx] / 1280, 0], [0.27, 0.75], [0, 0]);
};

/**
 * Override
 * 获取手牌尺寸
 */
PlayPanel_YuanJiangGuiHuZi.prototype.getHandCardSize = function() 
{
    var uiNode = this.getUINode(0);
	var handCard = uiNode.getChildByName("img_handCard");
	var type = ziPai.getZiPaiType();
	var cardSize = handCard.getVirtualRendererSize();
	if(type == 1)
		cardSize.width -= 1;
	if(type == 2)
		cardSize.width -= 3;
    return cardSize;
}

PlayPanel_YuanJiangGuiHuZi.prototype.isChargeShuffle = function() {
    return true;
};

/**
 * Override
 */
// PlayPanel_YuanJiangGuiHuZi.prototype.getOffYByCard = function(card){
// 	var off_y = card.height * card.scaleY - card.height/4  * card.scaleY;
// 	var type = ziPai.getZiPaiType();
// 	if(type == 2){
//         off_y += 10;
//     }
//     return card.height * card.scaleY - card.height / 4 * card.scaleY;
// }
