/***
 * 溆浦老牌，小结算
 * @type {void | Class | *}
 */

var EndOneView_xuPuLaoPai = cc.Layer.extend({

	jsBind: {
		block: {
			_layout: [[1, 1], [0.5, 0.5], [0, 0], true]
		},
		back: {
			_layout: [[1, 1], [0.5, 0.5], [0, 0]],
			wintitle: {
				_visible: function () {
					var pl = getUIPlayer(0);
					return pl && pl.winone >= 1;
				}
			},
			losetitle: {
				_visible: function () {
					var pl = getUIPlayer(0);
					return pl && pl.winone < 0;
				}
			},
			pingju: {
				_visible: function () {
					var pl = getUIPlayer(0);
					return pl && pl.winone === 0;
				},
				_run: function () {
					var sData = MjClient.data.sData;
					var tData = sData.tData;
					if (MjClient.isDismiss) {
						this.loadTexture("gameOver/jiesan.png");
					} else if(MjClient.CheckPlayerCount(function(p){ if(p.winone===0){return true;} return false;}) === tData.maxPlayer) {
						if(isRealHuangZhuang()) this.loadTexture("gameOver/huangzhuan_35.png");
					}
				}
			},
			share: {
				_visible: function () {
					var tData = MjClient.data.sData.tData;
					return (!MjClient.remoteCfg.guestLogin && !tData.matchId);
				},
				_click: function (btn, eT) {
					MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Xiaojiesuanjiemian_Fenxiang", {uid: SelfUid()});
					MjClient.shareMultiPlatform(MjClient.systemConfig.sharePlatforms, function () {
						postEvent("capture_screen");
						MjClient.endoneui.capture_screen = true;
						btn.setTouchEnabled(false);
					});
				},
				_event: {
					captureScreen_OK: function () {
						if (MjClient.endoneui.capture_screen !== true) return;
						MjClient.endoneui.capture_screen = false;
						var writePath = jsb.fileUtils.getWritablePath();
						var textrueName = "wxcapture_screen.png";
						var savepath = writePath + textrueName;
						MjClient.shareImageToSelectedPlatform(savepath);
						this.runAction(cc.sequence(
							cc.delayTime(1),
							cc.callFunc(function () {
								this.setTouchEnabled(true);
							}.bind(this))
						));
					}
				},
			},
			ready: {
				_visible: function () {
					var tData = MjClient.data.sData.tData;
					return !tData.matchId;
				},
				_run: function () {
					if (MjClient.remoteCfg.guestLogin) {
						setWgtLayout(this, [0.15, 0.15], [0.5, 0.085], [0, 0], false, true);
					}
				},
				_click: function () {
					var sData = MjClient.data.sData;
					var tData = sData.tData;
					if (tData.fieldId) {
						MjClient.native.umengEvent4CountWithProperty("Jinbichang_Xiaojiesuan_Zhunbei", {uid: SelfUid()});
						leaveGameClearUI();
						MjClient.Scene.addChild(new goldMatchingLayer({matching: false, gameType: tData.gameType}));
						MjClient.goldfieldEnter(tData.fieldId, tData.gameType);
					} else {
						if (sData.tData.roundNum <= 0) MjClient.endoneui.getParent().addChild(new GameOverLayer(), 500);

						postEvent("clearCardUI");
						MjClient.endoneui.removeFromParent(true);
						MjClient.endoneui = null;
						if (MjClient.rePlayVideo >= 0 && MjClient.replayui) {
							MjClient.replayui.replayEnd();
						} else {
							MjClient.MJPass2NetForxuPuLaoPai();
						}
						reInitarrCardVisible();
					}
				},
			},
			showTable:{
				_visible: false
			},
			info: {
				_visible: true,
				_text: function () {
					return getPlayingRoomInfo(5);
				}
			},
			dir: {
				_visible: true,
				_text: function () {
					return getPlayingRoomInfo(0);
				}
			},
			head0: {
				_run: function () {
					MjClient.endoneui.setEndOneUserUI(this, 0);
				},
			},
			head1: {
				_run: function () {
					MjClient.endoneui.setEndOneUserUI(this, 1);
				},
			},
			head2: {
				_run: function () {
					MjClient.endoneui.setEndOneUserUI(this, 2);
				},
			},
			head3: {
				_run: function () {
					MjClient.endoneui.setEndOneUserUI(this, 3);
				},
			},
		},
		time: {
			_text: function () {
				return MjClient.roundEndTime;
			}
		},
		count_down: {
			_visible: function () {
				return MjClient.data.sData.tData.matchId;
			},
			_run: function () {
				schedulLoadTexture(this);
			}
		}
	},

    ctor:function () {
		this._super();
		MjClient.endoneui = this;
		var endoneUI = ccs.load("endOne_xuPuLaoPai.json");
		BindUiAndLogic(endoneUI.node, this.jsBind);
		this.addChild(endoneUI.node);
		changeMJBg(this, getCurrentMJBgType());
 		return true;
    },
	
	setEndOneUserUI: function (playerNode, off) {
		var sData = MjClient.data.sData;
		var tData = sData.tData;
		var player = MjClient.getPlayerByIndex(off);
		if(!player) return playerNode.setVisible(false);
		setUserOfflineWinGamePanel(playerNode, player);

		var playerNodeBind = {
			head_bg: {
				_run: function(){
					this.loadTexture(player.winone > 0 ? "gameOver/di_red.png" : "gameOver/di_green.png");
				}
			},
			head: {
				_run: function(){
					MjClient.endoneui.circularCuttingHead(this, player);
					MjClient.endoneui.updatePlayerCardsForEndOne(this, off);
				},
				zhuang:{
					_visible:function () {
						var zhuangData = (typeof MjClient.preZhuang != 'undefined') ? MjClient.preZhuang : tData.zhuang;
						return tData.uids[zhuangData] === player.info.uid;
					}
				},
				name: {
					_run:function() {
						this.setFontName("Arial");
						this.ignoreContentAdaptWithSize(true);
						this.setString(getNewName(unescape(player.info.nickname).toString()))
					},
				},
				winType: {
					_run:function() {
						this.ignoreContentAdaptWithSize(true);
						this.setString(player.baseWin > 0 ? ("X" + player.baseWin) : "0");
					},
				},
				imgChong: {
					_visible: function(){
						return player.chongId !== 2;
					},
					_run:function() {
						var chongScore = player.chongScore ? player.chongScore : 0;
						this.loadTexture("gameOver_changPai/c" + chongScore + ".png");
					},
				},
				imgHu:{
					_visible: function () {
						return player.winType > 0;
					}
				},
				imgPao:{
					_visible: false,
					_run: function () {
						if(player.mjdesc.indexOf("点炮") > -1){
							this.setVisible(true);
							this.loadTexture("gameOver_changPai/dianpao.png");
						}

						if(player.mjdesc.indexOf("接炮") > -1){
							this.setVisible(true);
							this.loadTexture("gameOver_changPai/jiepao.png");
						}
					}
				},
				card: {
					_visible: false
				},
				tingIcon:{
					_visible: function () {
						return player.isTing;
					}
				}
			},
			winNum: {
				_run: function(){
					var pre = player.winone > 0 ? "+" : "";
					this.ignoreContentAdaptWithSize(true);
					this.setString(pre + player.winone);
				}
			}
		};

		BindUiAndLogic(playerNode, playerNodeBind);
	},

	circularCuttingHead: function (headNode, player) {
		var url = player.info.headimgurl;
		if(!url) url = "png/default_headpic.png";
		cc.loader.loadImg(url, {isCrossOrigin : true}, function(err, texture) {
			if(!err && texture && cc.sys.isObjectValid(headNode)) {
				var clippingNode = new cc.ClippingNode();
				var mask = new cc.Sprite("gameOver/gameOver_headBg2.png");
				clippingNode.setAlphaThreshold(0);
				clippingNode.setStencil(mask);
				var img = new cc.Sprite(texture);
				img.setScale(mask.getContentSize().width / img.getContentSize().width);
				clippingNode.addChild(img);
				clippingNode.setPosition(headNode.getContentSize().width / 2, headNode.getContentSize().height / 2);
				var hideblock = new cc.Sprite("gameOver/gameOver_headBg3.png");
				hideblock.setPosition(headNode.getContentSize().width / 2, headNode.getContentSize().height / 2);
				headNode.addChild(clippingNode);
				headNode.addChild(hideblock);
			}
		});
	},


	removeAllCards: function(node){
		var chidren = node.children;
		var cardName = ["mjhand", "chi", "peng"];
		for(var i = 0; i < chidren.length; i ++){
			var child = chidren[i];
			for(var key in cardName){
				if(child.getName() === cardName[key]){
					child.removeFromParent(true);
					break;
				}
			}
		}
	},


	updatePlayerCardsForEndOne: function (node, off) {
		var player = MjClient.getPlayerByIndex(off);
		if(!player) return;
		this.removeAllCards(node);

		var cardArr = [];
		//添加碰
		for (var i = 0; i < player.mjpeng.length; i++) {
			for (var j = 0; j < 3; j++) {
				cardArr.push(MjClient.playui.getNewCard(node, "card", "peng", player.mjpeng[i], 0));
			}
			cardArr.push(-1);
		}


		//添加吃
		if(player.mjchi.length > 0){
			for (var i = 0; i < player.mjchi.length; i++) {
				cardArr.push(MjClient.playui.getNewCard(node, "card", "chi", player.mjchi[i], 0));
				if(i !== 0 && (i + 1) % 3 === 0) cardArr.push(-1);
			}
		}



		//添加手牌
		if(player.mjhand){
			var hand = player.mjhand.slice(),
				len = hand.length,
				newCardTag;

			if(len % 3 === 2){
				newCardTag = hand[player.mjhand.length - 1];
				hand.splice(-1, 1);
			}

			hand.sort(function (a, b) {
				return a - b;
			});
			if(newCardTag) hand.push(newCardTag);

			for (var i = 0; hand && i < len; i++) {
				var card = MjClient.playui.getNewCard(node, "card", "mjhand", hand[i], 0);
				if(newCardTag && i === len - 1) cardArr.push(-1);
				cardArr.push(card);
			}
		}


		var posX = 0, scale = 0.95;
		for(var i = 0; i < cardArr.length; i ++) {
			if (cardArr[i] === -1) {
				posX += 10;
				continue;
			}

			cardArr[i].enabled = false;
			cardArr[i].visible = true;
			cardArr[i].x += posX;

			posX += cardArr[i].width * cardArr[i].scale * scale;
		}
	}
});