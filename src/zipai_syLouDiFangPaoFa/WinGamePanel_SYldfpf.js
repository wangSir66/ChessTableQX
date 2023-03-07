function getOutCardRes_SYldfpf(card){
    if (MjClient.playui && MjClient.playui.getCardSrc) {
        return MjClient.playui.getCardSrc("out", card);
    }else{
        return MjClient.cardPath_xiangxiang+"out" + card + ".png";
    }
}

function addWxHeadToEndUI_SYldfpf(node,off)
{
    var pl = getUIPlayer_xiangxiang(off);
    //var pl= getUIPlayer_changpai(off);
    var img = "png/default_headpic.png";
    if(pl && pl.wxHeadImg)
    {
        img = pl.wxHeadImg;
    }
    else
    {
        return;
    }
    var sp = new cc.Sprite(img);
    //node.addChild(sp);
    var frame = node.getChildByName("frame");
    if (frame){
        frame.zIndex = sp.zIndex + 1;
    }

    var clippingNode = new cc.ClippingNode();
    var mask = new cc.Sprite("gameOver/gameOver_headBg2.png");
    clippingNode.setAlphaThreshold(0);
    clippingNode.setStencil(mask);

    sp.setScale(mask.getContentSize().width / sp.getContentSize().width);
    clippingNode.addChild(sp);
    clippingNode.setPosition(frame.getContentSize().width / 2, frame.getContentSize().height / 2);
    // //遮罩框
    var hideblock = new cc.Sprite("gameOver/gameOver_headBg3.png");
    hideblock.setPosition(frame.getContentSize().width / 2, frame.getContentSize().height / 2);
    frame.addChild(clippingNode);
    
    setRoundEndUserOffline_shaoyang(frame,pl);
    frame.addChild(hideblock);
    //setWgtLayout(sp,[0.88,0.88],[0.5,0.5],[0,0],false,true);
}

function reInitarrCardVisible_SYldfpf()
{
	//没用到的东西，写这个干嘛????
	// if(MjClient.roundnumImgNode){
 //        MjClient.roundnumImgNode.setVisible(false);
	// }
	// if(MjClient.cardNumImgNode){
 //        MjClient.cardNumImgNode.setVisible(false);
	// }
}

var EndOneView_SYldfpf = cc.Layer.extend({
    _block:null,
	jsBind:{
		block:{
		    _run:function () {
                MjClient.endoneui._block = this;
            },
			_layout:[[1,1],[0.5,0.5],[0,0],true]
		},
		parent:{
            _layout:[[1,1],[0.5,0.5],[0,0],false],
			// shareBtn:{
			// 	_click:function(){
			// 		postEvent("capture_screen");
			// 	},
			// 	_event:{
			// 		captureScreen_OK:function(){MjClient.native.wxShareImage();}
			// 	},
			// 	_visible :function(){
			// 		return !MjClient.remoteCfg.guestLogin;
			// 	},
			// 	_run:function(){
			// 		cc.log("shareBtn:" + JSON.stringify(this.getPosition()));
			// 	}
			// },
			close:{
				_run: function(){
					if (MjClient.data.sData.tData.fieldId){
	            		this.visible = true;
	                }else{
	                	this.visible = false; 
	                }
				},
				_click: function(btn,eT){ 
					if (MjClient.data.sData.tData.fieldId){
	                    leaveGameClearUI();
	                    return;
	                }
				}
			},
			shareBtn:{
				_visible:false,
				_run: function(){
					if (MjClient.data.sData.tData.fieldId){
	            		this.visible = true;
	                }else{
	                	this.visible = false; 
	                }
				},
				_click:function(btn,eT){
                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Xiaojiesuanjiemian_Fenxiang", {uid:SelfUid()});

                    if (MjClient.data.sData.tData.fieldId)
                        MjClient.native.umengEvent4CountWithProperty("Jinbichang_Xiaojiesuan_Fenxiang", {uid:SelfUid()});

                    MjClient.shareMultiPlatform(MjClient.systemConfig.sharePlatforms, function()
                    {
                        postEvent("capture_screen");
                        MjClient.endoneui.capture_screen = true;
                        btn.setTouchEnabled(false);
                        //btn.setBright(false);
                    });
                }
                ,_event:{
                    captureScreen_OK: function () {
                        if (MjClient.endoneui.capture_screen != true)
                            return;
                        MjClient.endoneui.capture_screen = false;
                        var writePath = jsb.fileUtils.getWritablePath();
                        var textrueName = "wxcapture_screen.png";
                        var savepath = writePath+textrueName;
                        MjClient.shareImageToSelectedPlatform(savepath);
                        this.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(function()
                        {
                            this.setTouchEnabled(true);
                            //this.setBright(true);
                        }.bind(this))));
                    }
                }
			},
			readyBtn:{
				_run:function (){
					if(MjClient.remoteCfg.guestLogin){
						setWgtLayout(this, [0.15, 0.15],[0.5, 0.085],[0, 0], false, true);
					}
				},
				_click:function(btn,eT){
					if (MjClient.data.sData.tData.fieldId){
                		var gameType = MjClient.gameType;
	            		var fieldId = MjClient.data.sData.tData.fieldId;
	                    leaveGameClearUI();
	                    // MjClient.Scene.addChild(new goldMatchingLayer({matching:false, gameType:gameType}));
	                    MjClient.goldfieldEnter(fieldId, gameType);
	                    return;
	                }else{
	                	postEvent("clearCardUI");
						postEvent("clearCardArr");
						MjClient.endoneui.gameBalance = null;
						MjClient.endoneui.gameMain = null;
						MjClient.endoneui._block = null;
						MjClient.endoneui.removeFromParent(true);
						MjClient.endoneui = null;
						var sData=MjClient.data.sData;
						var tData=sData.tData;
		                if (MjClient.rePlayVideo >= 0 && MjClient.replayui) {
		                    MjClient.replayui.replayEnd();
		                }else {
		                    //MjClient.MJPass2NetForloudifpf();
		                    MjClient.gamenet.request("pkroom.handler.tableMsg", {
		                        cmd: "MJPass"
		                    });
		                }

	                    if (MjClient.endallui)
						{
	                        MjClient.endallui.setVisible(true);
						}

						reInitarrCardVisible_SYldfpf();
	                }
				}
			},
			switchImg_zhuomian:{
				_run: function(){
					if (MjClient.data.sData.tData.fieldId){
	            		this.visible = false;
	                }else{
	                	this.visible = true; 
	                }
				},
				_touch:function(btn, eT){
					if(eT == 2){
						if(!MjClient.endoneui.gameMain.visible){
							MjClient.endoneui.gameBalance.visible = false;
							MjClient.endoneui.gameMain.visible = true;
                            MjClient.endoneui._block.setOpacity(0);
                            this.visible = false;
                            this.getParent().getChildByName("switchImg_jiesuan").visible = true;
						}
					}
				}
			},
			switchImg_jiesuan:{
				_run:function(){
					this.visible = false;
				},
				_touch:function(btn, eT){
					if(eT == 2){
						if(!MjClient.endoneui.gameBalance.visible){
							MjClient.endoneui.gameBalance.visible = true;
							MjClient.endoneui.gameMain.visible = false;
                            MjClient.endoneui._block.setOpacity(255);
							this.visible = false;
							this.getParent().getChildByName("switchImg_zhuomian").visible = true;
						}
					}
				}
			},
			btn_desc: {
				_run: function(){
					// setWgtLayout(this, [0.18, 0.18],[0.2562, 0.06],[0, 0]);  

					if(MjClient.rePlayVideo == -1 && !MjClient.data.sData.tData.areaSelectMode.isManualCutCard && !MjClient.endallui) {
						this.visible = false;
					}else {
						this.visible = true;
					}
				},
				_click: function(btn,eT){
					cc.log("btn_desc=========================");
					var panel = new HandCardPanel_ziPai();
					MjClient.endoneui.addChild(panel);
				} 
			},
			btn_xiPai: {
				_run: function(){
					// setWgtLayout(this, [0.18, 0.18],[0.2562, 0.06],[0, 0]); 

					if(MjClient.rePlayVideo == -1 && !MjClient.data.sData.tData.areaSelectMode.isManualCutCard && !MjClient.endallui) {
						this.visible = true;
						var icon = this.getChildByName("icon");
						var numTxt = this.getChildByName("numTxt"); 
						if(MjClient.data.sData.tData.areaSelectMode.fangkaCount != undefined) {
							//钻石场
							icon.loadTexture("gameOver/newOver/ico_zuanshi.png");
							numTxt.setString("x1");
						}else {
							//元宝场
							icon.loadTexture("gameOver/newOver/ico_yuanbao.png");
							numTxt.setString("x2");
						}
						
					}else {
						this.visible = false;
					}
				},
				_click: function(btn,eT){ 
					MjClient.gamenet.request("pkroom.handler.tableMsg", {
	                    cmd: "MJShuffle"
	                },function(data) {
	                    if (data != null && data.code == -1)
	                    {
	                    	console.log("======MJShuffle=====", JSON.stringify(data));
	                        MjClient.showToast(data.message);
	                        return;
	                    }

	                    postEvent("clearCardUI");
						postEvent("clearCardArr"); 
						MjClient.endoneui.gameMain = null; 
						MjClient.endoneui.removeFromParent(true);
						MjClient.endoneui = null; 
						reInitarrCardVisible_SYldfpf();
	                    MjClient.gamenet.request("pkroom.handler.tableMsg", {
		                    cmd: "MJPass"
		                });
	                });
					
				} 
			},		
			xingPaiImg:{
				_run:function()
				{
					MjClient.endoneui._xingPaiImg = this;
					if(MjClient.gameType == MjClient.GAME_TYPE.ZP_LY_CHZ || 
						MjClient.gameType == MjClient.GAME_TYPE.SHAO_YANG_ZI_PAI ||
						MjClient.gameType == MjClient.GAME_TYPE.SHAO_YANG_BO_PI){
                        this.setVisible(false);
					}
				},
				pai:{
					_run:function(){
				        //醒牌
				        var tData = MjClient.data.sData.tData;
				        if(MjClient.isDismiss || tData.hunCard == -1 || tData.winner == -1){
				        	this.visible = false;
				        }else{
				        	this.loadTexture("playing/paohuzi/out" + tData.hunCard + ".png");
				        }
					}
				}
			},
			balance:{
				_run:function(){
					MjClient.endoneui.gameBalance = this;
				},
	            winImg:{
	            	_run:function(){
	            		var sData = MjClient.data.sData;
	            		var tData = sData.tData;
	            		if (MjClient.isDismiss){
	            			this.loadTexture("gameOver/newOver/title_2.png");
	            		}else{
	            			var selfPlayer = getUiOffByUid(SelfUid());
	            			var isHuang = false;
	            			if(tData.winner == -1){
	            				this.loadTexture("gameOver/newOver/title_1.png");
	            			}else{
	            				var uids = tData.uids;
	            				var selfIndex = uids.indexOf(SelfUid());
	            				var sub = (selfIndex - tData.winner + tData.maxPlayer) % tData.maxPlayer;
	            				if(sub == 0){
	            					this.loadTexture("gameOver/newOver/title_3.png");
	            				}else if(sub == 2){
	            					this.loadTexture("gameOver/newOver/title_4.png");
	            				}else if(sub == 1){
	            					this.loadTexture("gameOver/newOver/title_4.png");
	            				}else{
	            					this.loadTexture("gameOver/newOver/title_4.png");
	            				}
	            			}
	            		}
	            	},
				},
				gamelabel:{
				    _run:function () {
                        this.ignoreContentAdaptWithSize(true);
                        if (MjClient.data.sData.tData.fieldId){
		            		this.visible = false;
		                }else{
		                	this.visible = true; 
		                }
                    },
					_text:function(){
						var sData=MjClient.data.sData;
						var tData=sData.tData;
						return tData.gameCnName;						
					}
				},
				roomLabel:{
                    _run:function () {
                        this.ignoreContentAdaptWithSize(true);
                        if (MjClient.data.sData.tData.fieldId){
		            		this.visible = false;
		                }else{
		                	this.visible = true; 
		                }
                    },
					_text:function(){
						var sData=MjClient.data.sData;
						var tData=sData.tData;
						return "房间号:" + tData.tableid;						
					}
				},
				timeLabel:{
                    _run:function () {
                        this.ignoreContentAdaptWithSize(true);
                        if (MjClient.data.sData.tData.fieldId){
		            		this.visible = false;
		                }else{
		                	this.visible = true; 
		                }
                    },
					_text:function(){
						return MjClient.roundEndTime;						
					}
				},
				showList:{
					head:{
						_visible:false
					},
				   	_run:function(){
				   		var sData = MjClient.data.sData;
				   		var tData = sData.tData;
				   		var players = sData.players;
				   		var bgSize = this.getCustomSize();
				   		var head = this.getChildByName("head");
				   		var headSize = head.getContentSize();
				   		var playerCount = Object.keys(players).length;
				   		var off_x = bgSize.width/(playerCount+1);
				   		var uids = tData.uids;
				   		var selfIndex = tData.uids.indexOf(SelfUid());
				   		if(tData.maxPlayer == 4){
				   			off_x = off_x * 5 / 6;
				   			this.x += this.getCustomSize().width / 12;
				   			this.getChildByName("line").x -= this.getCustomSize().width / 12;
				   		}
				   		//坐醒玩法先将玩家排序
				   		if(playerCount == 4 && tData.areaSelectMode.zuoXing){
				   			var sortPlayer = [];
					   		sortPlayer[tData.winner] = 1;
					   		sortPlayer[tData.xingPlayer] = 2;
					   		var otherPlayer = 3;
					   		for(var playerIndex = 0; playerIndex < 4; playerIndex++){
					   			if(!sortPlayer[playerIndex]){
					   				sortPlayer[playerIndex] = otherPlayer;
					   				otherPlayer++;
					   			}
					   		}
				   		}

				   		for(var index = 0;index<playerCount;index++){
				   			var cloneHead = head.clone();
				   			cloneHead.visible = true;
				   			cloneHead.setPosition(cc.p((index+1) * off_x,bgSize.height/2));
				   			//胡牌玩家置为最前
				   			if(tData.winner != -1 && tData.winner != 0 && !tData.areaSelectMode.zuoXing){
				   				if(index == 0){
				   					cloneHead.setPosition(cc.p((tData.winner+1) * off_x,bgSize.height/2));
				   				}else if(index == tData.winner){
				   					cloneHead.setPosition(cc.p(off_x,bgSize.height/2));
				   				}
				   			}
				   			//醒家位置置为第二
				   			if(playerCount == 4 && tData.areaSelectMode.zuoXing){
				   				cloneHead.setPosition(cc.p(off_x * sortPlayer[index],bgSize.height/2));
				   				if(sortPlayer[index] == 5){
				   					cloneHead.setPosition(cc.p(off_x, bgSize.height/2));
				   				}
				   			}

				   			this.addChild(cloneHead);

				   			var zhuang = cloneHead.getChildByName("zhuang");
				   			if(index == tData.zhuang){
				   				zhuang.loadTexture("playing/gameTable/youxizhong-1_89.png");
				   				zhuang.visible = true;
				   				zhuang.zIndex = 100;
				   			}else{
				   				zhuang.visible = false;
				   			}

				   			if(playerCount == 4 && tData.areaSelectMode.zuoXing && index == tData.xingPlayer){
					            zhuang.loadTexture("playing/gameTable/youxizhong-1_90.png");
					            zhuang.visible = true;
					            zhuang.zIndex = 100;
					        }

				   			var nameLabel = cloneHead.getChildByName("name");
				   			nameLabel.ignoreContentAdaptWithSize(true);
				   			var uid = uids[index];
				   			var pl = players[uid + ""];
						    var _nameStr = unescape(pl.info.nickname ) + "";
						    nameLabel.setString(getNewName (_nameStr));

						    var scoreLabel = cloneHead.getChildByName("score");
						    var score_winner = cloneHead.getChildByName("score_winner");
						    scoreLabel.ignoreContentAdaptWithSize(true);
						    score_winner.ignoreContentAdaptWithSize(true);
						    var score = pl.winone;

						    if(MjClient.data.sData.tData.fieldId){
						    	score = pl.fenshu;
						    }

						    if(tData.winner == -1){
						    	if(pl.winone == 0 && !MjClient.data.sData.tData.fieldId){
						    		scoreLabel.setString("   " + "0");
						    	}else{

                                    if(MjClient.gameType == MjClient.GAME_TYPE.ZP_LY_CHZ || 
                                    	MjClient.gameType == MjClient.GAME_TYPE.SHAO_YANG_BO_PI)
                                    {
                                        scoreLabel.setString(score >= 0?"+" + score:score);
                                    }else {
                                        scoreLabel.setString(score >= 0?"+" + score:score);
                                        score_winner.setString(score >= 0?"+" + score:score);
									}
						    	}
						    }else{
						    	if(pl.winone == 0 && !MjClient.data.sData.tData.fieldId){
						    		scoreLabel.setString("0");
						    	}else{
						    		scoreLabel.setString(score >= 0?"+" + score:score);
						    		score_winner.setString(score >= 0?"+" + score:score);
						    	}
						    }
						    score_winner.visible = false;
						    if(pl.winone > 0){
						    	//nameLabel.setColor(cc.color(243,243,109));
						    	//scoreLabel.setColor(cc.color(226,43,0));
						    	score_winner.visible = true;
						    	scoreLabel.visible = false;
						    }

						    var jinbiIcon = cloneHead.getChildByName("jinbi");
						    if(jinbiIcon && MjClient.data.sData.tData.fieldId){
						    	jinbiIcon.visible = true;
					           	score_winner.x += jinbiIcon.width * 1.8;
						    	scoreLabel.x += jinbiIcon.width * 1.8;

						    	if(index == tData.winner){
						    		cloneHead.x += jinbiIcon.width * 1.8;
						    	}

						    	if(tData.winner != 2 && index == 2 || tData.winner == 2 && index == 0){
						    		cloneHead.x -= jinbiIcon.width * 1.8;
						    	}
						    }else{
						    	jinbiIcon.visible = false;
						    }

						    var longCards = pl.longCard;
						    var card0 = cloneHead.getChildByName("card_0");
						    var pos0 = card0.getPosition();
						    for(var i = 0; i < longCards.length; i++){
                                var card = longCards[i];
                                var cloneCard = card0.clone();
                                cloneCard.visible = true;
                                //cloneCard.loadTexture(MjClient.cardPath_xiangxiang+"out" + card +".png");
                                cloneCard.loadTexture(getOutCardRes_SYldfpf(card));
                                if(i < 3){
                                    cloneCard.setPosition(cc.p(pos0.x + i*card0.width , pos0.y));
                                }else {
                                    cloneCard.setPosition(cc.p(pos0.x + (i-3)*card0.width  ,pos0.y - (card0.height + 5)));
                                }
                                cloneHead.addChild(cloneCard);
                            }

                            // var dianPaoType =  cloneHead.getChildByName("dianPaoType");
                            // if(tData.putType == 0 && tData.winner > -1){
                            // 	dianPaoType.visible = true;
                            // 	if(index == tData.lastPutPlayer){
                            // 		dianPaoType.loadTexture("playing/paohuzi/phz_s_fp.png");
                            // 	}else if(index == tData.winner){
                            // 		dianPaoType.loadTexture("playing/paohuzi/phz_s_jp.png");
                            // 	}else{
                            // 		dianPaoType.visible = false;
                            // 	}

                            // }else{
                            // 	dianPaoType.visible = false;
                            // }

                            var text_Long = cloneHead.getChildByName("Text_Long");
                            text_Long.visible = longCards.length > 0;

						    var showIndex = (index - selfIndex + MjClient.MaxPlayerNum_xiangxiang) % MjClient.MaxPlayerNum_xiangxiang;
						    addWxHeadToEndUI_SYldfpf(cloneHead,showIndex);
				   		}
				   	},
				},
				showInfo:{
				   	diPai:{
				   		title:{
				   			_visible:false
				   		},
				   		_run:function(){
				   			var sData = MjClient.data.sData;
				   			var tData = sData.tData;
				   			if(tData.winner == -1 && (tData.maxPlayer != 2 || !tData.areaSelectMode.isMaiPai)){
				   				return;
				   			}
				   			
				   			var cards = sData.cards;
                            if(tData.cardNext < cards.length){
                                var size = this.getContentSize();
                                var cardObj = this.getChildByName("card");
                                var totalWidth = cardObj.width * (cards.length - tData.cardNext);
                                var width20Cards = cardObj.width * 20;
                                var startPos = cc.p((size.width - totalWidth)/2 + cardObj.width/2,size.height/2);
                                if((cards.length - tData.cardNext) > 20){
                                    startPos = cc.p((size.width - width20Cards)/2 + cardObj.width/2,size.height/2);
                                }
                                var nameImg = this.getChildByName("title");
                                nameImg.setPosition(cc.p(startPos.x - nameImg.width/2,startPos.y));
                                nameImg.visible = true;

                                if(tData.maxPlayer == 2 && tData.areaSelectMode.isMaiPai){ 
					   				// 加一个埋牌文本
					   				var tips = this.getChildByName("title");
					   				var cloneTips = tips.clone();
					   				cloneTips.setPositionY(-startPos.y+15);
					   				cloneTips.setString("埋牌:");
					   				this.addChild(cloneTips); 
					   			} 

					   			var nextLine;
					   			var scrollView;
					   			if(MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType()){
					   				var maiPaiType = tData.areaSelectMode.hasOwnProperty("maiPaiType") ? tData.areaSelectMode.maiPaiType : 0;//埋牌方式  0：不埋   1：埋10   2：埋20
						   			if(!tData.areaSelectMode.isMaiPai) maiPaiType = 0;
						   			if(tData.areaSelectMode.isMaiPai && maiPaiType == 0) maiPaiType = 2;
						   			nextLine = (tData.maxPlayer == 2 && tData.areaSelectMode.isMaiPai) ? cards.length - maiPaiType * 10  : tData.cardNext + 20;
					   				if(nextLine - tData.cardNext > 20){
						   				scrollView = ccui.ScrollView.create();
						   				scrollView.setContentSize(cc.size(width20Cards, cardObj.height));
						   				scrollView.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
						   				scrollView.setBounceEnabled(true);
						   				scrollView.setInnerContainerSize(cc.size(cardObj.width * (nextLine - tData.cardNext), cardObj.height));
						   				scrollView.setPosition(cc.pSub(startPos, cc.p(cardObj.width/2,cardObj.height/2)));
						   				scrollView.setScrollBarEnabled(false);
						   				this.addChild(scrollView);
						   			}
					   			}else{
					   				nextLine = (tData.maxPlayer == 2 && tData.areaSelectMode.isMaiPai) ? cards.length - 20 : tData.cardNext + 20;
					   			}

					   			
					   			
                                for(var i = tData.cardNext;i < cards.length;i++){
                                    var card = cards[i];
                                    var cloneCard = cardObj.clone();
                                    cloneCard.visible = true;
                                    //cloneCard.loadTexture(MjClient.cardPath_xiangxiang+"out" + card +".png");
                                    cloneCard.loadTexture(getOutCardRes_SYldfpf(card));
                                    var cardPos = cc.p(0, 0);
                                    if(i < nextLine){
                                        cardPos = cc.p(startPos.x + cloneCard.width*(i - tData.cardNext), startPos.y);
                                    }else {
                                        cardPos = cc.p(startPos.x + cloneCard.width*(i - nextLine), -startPos.y+15);
                                    }
                                    cloneCard.setPosition(cardPos);
                                    if(i < nextLine && scrollView && cc.sys.isObjectValid(scrollView)){
                                    	cloneCard.setPosition(cc.pSub(cloneCard.getPosition(),cc.p(startPos.x - cloneCard.width/2, startPos.y - cloneCard.height/2)));
                                    	scrollView.addChild(cloneCard);
                                    }else
                                    	this.addChild(cloneCard);
                                }
                            }
				   		}
				   	},
				   	listView:{
				   		_visible: false,
				   		_run:function(){
				   			var tData = MjClient.data.sData.tData;
				   			if(tData.winner == -1){
				   				return;
				   			}
				   			this.visible = true;
				   			this.setScrollBarEnabled(true);
				   			var itemModel = this.children[0];
				   			this.setItemModel(itemModel);
				   			this.removeAllChildren();
				   			var listView = this;
				   			var getItem = function(name,mult){
				   				listView.pushBackDefaultItem();
				   				var children = listView.children;
				   				var insertItem = children[children.length-1];
				   				return insertItem;
				   			};

					   		var sData = MjClient.data.sData;
					   		var players = sData.players;
					   		var pl = players[tData.uids[tData.winner] + ""];
					   		var item = null;

				   			if(pl.hzdesc.tianhu){
				   				item = getItem();
				   				item.getChildByName("imgName").setString("天胡");
				   				item.getChildByName("count").setString("+100");
				   			}
				   			if(pl.hzdesc.zimo){
				   				item = getItem();
				   				item.getChildByName("imgName").setString("自摸");
				   				item.getChildByName("count").setString("×2");
				   			}
				   			if(pl.hzdesc.kahusanshi){
				   				item = getItem();
				   				item.getChildByName("imgName").setString("30胡");
				   				item.getChildByName("count").setString("+100");
				   			}
				   			if(pl.hzdesc.kahuershi){
				   				item = getItem();
				   				item.getChildByName("imgName").setString("20胡");
				   				item.getChildByName("count").setString("×2");
				   			}
				   			if(pl.hzdesc.yitiaobian){
				   				item = getItem();
				   				item.getChildByName("imgName").setString("一条扁");
				   				item.getChildByName("count").setString("×2");
				   			}
				   			if(pl.hzdesc.yidianhong){
				   				item = getItem();
				   				item.getChildByName("imgName").setString("一点红");
				   				item.getChildByName("count").setString("×2");
				   			}
				   			if(pl.hzdesc.wuhu){
				   				item = getItem();
				   				item.getChildByName("imgName").setString("乌胡");
				   				item.getChildByName("count").setString("+100");
				   			}
				   			if(pl.hzdesc.haidilao){
				   				item = getItem();
				   				item.getChildByName("imgName").setString("海底胡");
				   				item.getChildByName("count").setString("×2");
				   			}
				   			if(pl.hzdesc.shihong){
				   				item = getItem();
				   				item.getChildByName("imgName").setString("十红");
				   				item.getChildByName("count").setString("×2");
				   			}
				   			if(pl.hzdesc.shisanhong){
				   				item = getItem();
				   				item.getChildByName("imgName").setString("十三红");
				   				item.getChildByName("count").setString("+100");
				   			}
				   			if(pl.hzdesc.dihu){
				   				item = getItem();
				   				item.getChildByName("imgName").setString("地胡");
				   				item.getChildByName("count").setString("+100");
				   			}
				   			if(pl.hzdesc.piaohu){
                                item = getItem();
                                item.getChildByName("imgName").setString("飘胡");
                                item.getChildByName("count").setString("+30");
                            }
				   		}
				   	},
				   	cardInfo:{
				   		info:{
				   			_visible:false
				   		},
				   		_run:function(){
					   		var sData = MjClient.data.sData;
					   		var tData = sData.tData;
				   			if(tData.winner == -1){
				   				return;
				   			}
					   		var players = sData.players;
					   		var pl = players[tData.uids[tData.winner] + ""];

					   		//添加胡牌标志
							var isHand = !pl.isHuByHand; // 胡的牌是否在手牌中
							if (tData.isLastDraw && !(pl.mjgang1.toString() == [tData.lastPutCard].toString())) {
								isHand = true;
							}

							var huCard = tData.lastPutCard;
							// 补牌天胡
							if (tData.isLastDraw && pl.mjgang1.length >= 2) {
								huCard = pl.mjhand[pl.mjhand.length - 1];
							}

				   			var bgSize = this.getCustomSize();
				   			var off_x = (bgSize.width - 7*42)/6-13;
				  			var info = this.getChildByName("info");
                            var mjSortArr = pl.mjsort;
                            var handSortArr = pl.handSort;
				   			var startPos = cc.p((bgSize.width-(mjSortArr.length+handSortArr.length)*42-(handSortArr.length+mjSortArr.length-1)*off_x)/2+16,info.x - 10);
							for(k = 0;k < mjSortArr.length;k++){
						        var mjsort = mjSortArr[k];
						        var pos = mjsort.pos;
						        var name = mjsort.name;
						        var cardNum = 0;
						        //提
						        if(name == "mjgang1"){
						            cardNum = pl.mjgang1[pos];
						            clone = info.clone();
						            clone.visible = true;
						            clone.getChildByName("title").setString("提");
						            for(i = 1;i <= 4;i++){
						                var up = clone.getChildByName("card" + i);
						                //up.loadTexture(MjClient.cardPath_xiangxiang+"out" + cardNum + ".png");
						                up.loadTexture(getOutCardRes_SYldfpf(cardNum));
						                if(i==4 && isHand == false && cardNum == huCard){
                                            setHuCardMark_xxghz(up,clone);
										}
						            }
						            var huxi = huXiScore_xiangxiang("tiPai",cardNum);
						            MjClient._originalHuxiScore += huxi;
						            clone.setString(huxi);
						            clone.setPosition(startPos);
						            this.addChild(clone);
						            startPos = cc.p(startPos.x + off_x + 42,startPos.y);
						        }
						        //偎
						        if(name == "mjwei"){
						            cardNum = pl.mjwei[pos]; 
						            clone = info.clone();
						            clone.visible = true;
						            clone.getChildByName("title").setString("偎");
						            for(i = 1;i <= 4;i++){
						                var up = clone.getChildByName("card" + i);
						                if(i == 4){
						                	up.visible = false;
						                }else{
						                	//up.loadTexture(MjClient.cardPath_xiangxiang+"out" + cardNum + ".png");
						                	up.loadTexture(getOutCardRes_SYldfpf(cardNum));
						                }
                                        if(i==3 && isHand == false && cardNum == huCard){
                                            setHuCardMark_xxghz(up,clone);
                                        }
						            }
						            var huxi = huXiScore_xiangxiang("weiPai",cardNum);
						            MjClient._originalHuxiScore += huxi;
						            clone.setString(huxi);
						            clone.setPosition(startPos);
						            this.addChild(clone);
						            startPos = cc.p(startPos.x + off_x + 42,startPos.y);
						        }
						        //跑
						        if(name == "mjgang0"){
						            cardNum = pl.mjgang0[pos];
						            clone = info.clone();
						            clone.visible = true;
						            clone.getChildByName("title").setString("跑");
						            for(i = 1;i <= 4;i++){
						                var up = clone.getChildByName("card" + i);
						                //up.loadTexture(MjClient.cardPath_xiangxiang+"out" + cardNum + ".png");
                                        up.loadTexture(getOutCardRes_SYldfpf(cardNum));
                                        if(i==4 && isHand == false && cardNum == huCard){
                                            setHuCardMark_xxghz(up,clone);
                                        }
						            }
						            var huxi = huXiScore_xiangxiang("paoPai",cardNum);
						            MjClient._originalHuxiScore += huxi;
						            clone.setString(huxi);
						            clone.setPosition(startPos);
						            this.addChild(clone);
						            startPos = cc.p(startPos.x + off_x + 42,startPos.y);
						        }
						        //碰
						        if(name == "mjpeng"){
						            cardNum = pl.mjpeng[pos];
						            clone = info.clone();
						            clone.visible = true;
						            clone.getChildByName("title").setString("碰");
						            for(i = 1;i <= 4;i++){
						                var up = clone.getChildByName("card" + i);
						               	if(i == 4){
						               		up.visible = false;
						               	}else{
						               		//up.loadTexture(MjClient.cardPath_xiangxiang+"out" + cardNum + ".png");
						               		up.loadTexture(getOutCardRes_SYldfpf(cardNum));
						               	}
						            }
						            var huxi = huXiScore_xiangxiang("peng",cardNum);
						            MjClient._originalHuxiScore += huxi;
						            clone.setString(huxi);
						            clone.setPosition(startPos);
						            this.addChild(clone);
						            startPos = cc.p(startPos.x + off_x + 42,startPos.y);
						        }
						        //吃
						        if(name == "mjchi"){
						        	var getHuXi = function(cards){
						        		cards = [].concat(cards);
						        		cards.sort(function(a, b) {return a - b});
						        		var normal = [[1,2,3],[21,22,23], [2, 7, 10], [22, 27, 30], [1, 5, 10], [21, 25, 30]];
						        		for(var t = 0;t < normal.length;t++){
						        			if(normal[t].toString() == cards.toString()){
						        				var huxi = huXiScore_xiangxiang("chi",cards[0]);
						        				return huxi;
						        			}
						        		}
						        		
						        		return 0;			        		
						        	}

						            var eatCards = pl.mjchi[pos].eatCards;
						            clone = info.clone();
						            clone.visible = true;
						            var cards = [].concat(eatCards);
						            if(cards[0] == cards[1] || cards[0] == cards[2] || cards[1] == cards[2]){
						            	clone.getChildByName("title").setString("绞");
						            }else{
						            	clone.getChildByName("title").setString("顺");
						            }
						            for(i = 1;i <= 4;i++){
						            	var up = clone.getChildByName("card" + i);
						            	var card = eatCards[i-1];
						            	if(card){
						            		//up.loadTexture(MjClient.cardPath_xiangxiang+"out" + card + ".png");
						            		up.loadTexture(getOutCardRes_SYldfpf(card));
						            	}else{
						            		up.visible = false;
						            	}
						            	if(i == 3){
						            		up.setColor(cc.color(170, 170, 170));
										}
						            }
						            var huxi = getHuXi(eatCards);
						            MjClient._originalHuxiScore += huxi;
						            clone.setString(huxi);
						            clone.setPosition(startPos);
						            this.addChild(clone);
						            startPos = cc.p(startPos.x + off_x + 42,startPos.y);

						            var biCards = pl.mjchi[pos].biCards;
						            if(biCards && biCards.length > 0){
						            	//计算坐标
						            	for(var m = 0;m < biCards.length;m++){
						            		var biArr = biCards[m];
							            	clone = info.clone();
								            clone.visible = true;
								            var cards = [].concat(biArr);
								            if(cards[0] == cards[1] || cards[0] == cards[2] || cards[1] == cards[2]){
								            	clone.getChildByName("title").setString("绞");
								            }else{
								            	clone.getChildByName("title").setString("顺");
								            }
								            for(i = 1;i <= 4;i++){
								            	var up = clone.getChildByName("card" + i);
								            	var card = biArr[i-1];
								            	if(card){
								            		//up.loadTexture(MjClient.cardPath_xiangxiang+"out" + card + ".png");
								            		up.loadTexture(getOutCardRes_SYldfpf(card));
								            	}else{
								            		up.visible = false;
								            	}
                                                if(i == 3){
                                                    up.setColor(cc.color(170, 170, 170));
                                                }
								            }
								          	var huxi = getHuXi(biArr);
								          	MjClient._originalHuxiScore += huxi;
							            	clone.setString(huxi);
							            	clone.setPosition(startPos);
							            	this.addChild(clone);
							            	startPos = cc.p(startPos.x + off_x + 42,startPos.y);
						            	}      
						            }
						        }
						    }

						    //手牌
						    for(var index in handSortArr){
						    	var handSort = handSortArr[index];
						    	clone = info.clone();
					            clone.visible = true;
					            if(handSort.name){
					            	if(handSort.name == "chi"){
					            		var cards = handSort.cards;
					            		if(cards[0] == cards[1] || cards[0] == cards[2] || cards[1] == cards[2]){
							            	clone.getChildByName("title").setString("绞");
							            }else{
							            	clone.getChildByName("title").setString("顺");
							            }
					            	}
					            	if(handSort.name == "kan"){
					            		clone.getChildByName("title").setString("偎");
					            	}
					            	if(handSort.name == "ti"){
					            		clone.getChildByName("title").setString("提");
					            	}
					            	if(handSort.name == "peng"){
                                        clone.getChildByName("title").setString("碰");
									}
					            }else{
					            	clone.getChildByName("title").setString("将");
					            }
					            
					            var cards = handSort.cards;
					            var cardNum = 0;
					            for (var i = 0; i < pl.mjhand.length; i++) {
					            	if (pl.mjhand[i] == tData.lastPutCard) {
					            		cardNum++;
					            	}
					            }

					            for(i = 4;i >= 1; i--) {
					            	var up = clone.getChildByName("card" + i);
					            	var card = cards[i-1];
					            	if(card){
					            		//up.loadTexture(MjClient.cardPath_xiangxiang+"out" + card + ".png");
					            		up.loadTexture(getOutCardRes_SYldfpf(card));
					            	}else{
					            		up.visible = false;
					            	}

					            	if (!(cardNum == 4 && cards[0] == tData.lastPutCard && cards.length == 3 && cards[0] == cards[1] && cards[0] == cards[2])) {
					            		if (isHand && card == huCard){
					            		    setHuCardMark_xxghz(up,clone);
					            		    isHand = false;
					            		}
					            	}
					            }
					            MjClient._originalHuxiScore += handSort.score;
					            clone.setString(handSort.score);
					            clone.setPosition(startPos);
					            this.addChild(clone);
					            startPos = cc.p(startPos.x + off_x + 42,startPos.y);
						    }
				   		}
				   	},
				   	scoreInfomation:{
				   		_run: function(){
				   			this.visible = false;
				   		}
				   	},
				   	scoreInfo:{
				   		_visible: false,
				   		originalHuxiScore:{
				   			_run:function(){
				   				var sData = MjClient.data.sData;
					   			var tData = sData.tData;
						   		if(tData.winner == -1){
				   					return;
				   				}
				   				this.getParent().visible = true;
					   			this.setString(MjClient._originalHuxiScore);
					   			this.ignoreContentAdaptWithSize(true);				   				
				   			}
				   		},
				   		huxiScore:{
				   			_run:function(){
				   				var sData = MjClient.data.sData;
					   			var tData = sData.tData;
						   		if(tData.winner == -1){
				   					return;
				   				}
				   				this.getParent().visible = true;
				   				var players = sData.players;
					   			var pl = players[tData.uids[tData.winner] + ""];
					   			this.setString(pl.winone);
					   			this.ignoreContentAdaptWithSize(true);				   				
				   			}
				   		},
				   		zonhuxiScore:{
				   			_run:function(){
				   				var sData = MjClient.data.sData;
					   			var tData = sData.tData;
						   		if(tData.winner == -1){
				   					return;
				   				}
				   				this.getParent().visible = true;
				   				var players = sData.players;
					   			var pl = players[tData.uids[tData.winner] + ""];
					   			this.setString(pl.winall);
					   			this.ignoreContentAdaptWithSize(true);	

					   			if(MjClient.data.sData.tData.fieldId){
					   				this.visible = false;
					   				this.getParent().getChildByName("zonhuxi").visible = false;
					   			}			   			
					   		}
				   		},
				   	}
				},	
			},
			main:{
				_run:function(){
					MjClient.endoneui.gameMain = this;

					// 跑胡非胡玩家处理 去掉展示牌(已经在胡家吃牌中) 
					var sData = MjClient.data.sData;
				    var tData = sData.tData;
					if (tData.winner != -1) {
						if(!tData.fieldId && tData.maxPlayer < 4) {
							var huPl = sData.players[tData.uids[tData.winner]];
							if (huPl.mjgang0.indexOf(tData.lastPutCard) >= 0) {
								delPutCard_paohuzi();
							}
						}else {
							if(tData.uids[tData.winner] != SelfUid()) {
								var huPl = sData.players[tData.uids[tData.winner]];
								if (huPl.mjgang0.indexOf(tData.lastPutCard) >= 0) {
									delPutCard_paohuzi();
								}
							}
						}
					}
				},
				diPai:{
			   		title:{
			   			_visible:false
			   		},
			   		_run:function(){
			   			var sData = MjClient.data.sData;
			   			var tData = sData.cards;
			   			if(tData.winner == -1){
			   				return;
			   			}
			   			
			   			var cards = sData.cards;
			   			if(tData.cardNext < cards.length){
			   				var size = this.getContentSize();
			   				var cardObj = this.getChildByName("card");
			   				var totalWidth = cardObj.width * (cards.length - tData.cardNext);
			   				var width20Cards = cardObj.width * 20;
                            var startPos = cc.p((size.width - totalWidth)/2 + cardObj.width/2,size.height/2);
			   				if((cards.length - tData.cardNext) > 20){
                                startPos = cc.p((size.width - width20Cards)/2 + cardObj.width/2,size.height/2);
							}
			   				var nameImg = this.getChildByName("title");
			   				nameImg.visible = true;
			   				nameImg.setPosition(cc.p(startPos.x - nameImg.width/2,startPos.y));

			   				for(var i = tData.cardNext;i < cards.length;i++){
			   					var card = cards[i];
			   					var cloneCard = cardObj.clone();
			   					cloneCard.visible = true;
			   					//cloneCard.loadTexture(MjClient.cardPath_xiangxiang+"out" + card +".png");
                                cloneCard.loadTexture(getOutCardRes_SYldfpf(card));
                                var cardPos = cc.p(0, 0);
			   					if(i < tData.cardNext + 20){
			   						cardPos = cc.p(startPos.x + cloneCard.width*(i - tData.cardNext), startPos.y);
								}else {
                                    cardPos = cc.p(startPos.x + cloneCard.width*(i - tData.cardNext - 20), -startPos.y+15);
								}
			   					cloneCard.setPosition(cardPos);
			   					this.addChild(cloneCard);
			   				}
			   			}
			   		}
				},
				leftPanel:{
					_run:function(){
						var sData = MjClient.data.sData;
				    	var tData = sData.tData;
	                    if(MjClient.MaxPlayerNum_xiangxiang == 2){
	                    	//this.setVisible(false);
	                    	//addWinMjHand_SYldfpf(this,1);
						}
						addWinMjHand_SYldfpf(this,MjClient.MaxPlayerNum_xiangxiang - 1);
						// if(MjClient.gameType === MjClient.GAME_TYPE.SHAO_YANG_FANG_PAO_FA && MjClient.MaxPlayerNum_xiangxiang == 4 && isXingPlayer_shaoyang(3)){
						// 	this.setVisible(false);
						// }
						if(MjClient.rePlayVideo != -1){
	                    	this.visible = false;
	                    }
					}
				},
				rightPanel:{
					_run:function(){
						var sData = MjClient.data.sData;
				    	var tData = sData.tData;
						if(MjClient.gameType === MjClient.GAME_TYPE.SHAO_YANG_FANG_PAO_FA && MjClient.MaxPlayerNum_xiangxiang == 4){
							addWinMjHand_SYldfpf(this,MjClient.MaxPlayerNum_xiangxiang - 2);
                    	}else if(MjClient.gameType === MjClient.GAME_TYPE.SHAO_YANG_FANG_PAO_FA && MjClient.MaxPlayerNum_xiangxiang == 2) {
                    		this.setVisible(false);
                    	}
                    	else{
							addWinMjHand_SYldfpf(this,1);
						}
						// if(MjClient.gameType === MjClient.GAME_TYPE.SHAO_YANG_FANG_PAO_FA && MjClient.MaxPlayerNum_xiangxiang == 4 && isXingPlayer_shaoyang(2)){
						// 	this.setVisible(false);
						// }
						if(MjClient.rePlayVideo != -1){
	                    	this.visible = false;
	                    }
					}
				},
				xingPanel:{
                    _run:function(){
                    	var sData = MjClient.data.sData;
				   		var tData = sData.tData;
                    	if(MjClient.gameType === MjClient.GAME_TYPE.SHAO_YANG_FANG_PAO_FA && MjClient.MaxPlayerNum_xiangxiang == 4){
							addWinMjHand_SYldfpf(this,1);
							this.setVisible(true);
                    	}else{
                    		this.setVisible(false);
                    	}
      //               	if(MjClient.gameType === MjClient.GAME_TYPE.SHAO_YANG_FANG_PAO_FA && MjClient.MaxPlayerNum_xiangxiang == 4 && isXingPlayer_shaoyang(1)){
						// 	this.setVisible(false);
						// }
						if(MjClient.rePlayVideo != -1){
	                    	this.visible = false;
	                    }
                    }
				}
			}
		},
	},
    ctor:function () {
        this._super();
        if(MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP){
            MjClient.cardPath_xiangxiang = MjClient.cardPath_hengYang;
        }
        MjClient.endoneui=this;
        MjClient._originalHuxiScore = 0;
        var endoneui = ccs.load("endOne_xxGaoHuZi.json");
		BindUiAndLogic(endoneui.node,this.jsBind);
        this.addChild(endoneui.node);
        this._endoneuiNode = endoneui.node;
        this.setDissmissInfo();
 		return true;
    },
    setDissmissInfo : function(){
    	 //解散信息 说明
    	var balance = this._endoneuiNode.getChildByName("parent").getChildByName("balance");
    	var dissmissInfo = balance.getChildByName("dissmissInfo");
    	if (dissmissInfo) {
	    	dissmissInfo.setVisible(false);
	        if (MjClient.isDismiss)
	        {  
	        	var sData = MjClient.data.sData;
	   			var tData = sData.tData;
	            var id = tData.firstDel;
	            var pl = sData.players[id];
	            var delStr = "";
	            if(pl) {
	                var name  =  unescape(pl.info.nickname);
	                delStr = name + pl.mjdesc[0]; 
	            } else {
	                pl = getUIPlayer(0);
                    if (pl)
                        delStr = pl.mjdesc[0];
	            }  
	            dissmissInfo.setString("" + delStr) ;
	            dissmissInfo.setVisible(true);    
	        }
        }
    },
});

//添加手牌
function addWinMjHand_SYldfpf(_node,off) {
	var sData = MjClient.data.sData;
    var tData = sData.tData;

	//fix by 千千
    var pl = getUIPlayer_xiangxiang(off);
    var copyMjhand = pl.mjhand.concat();
    // 胡家手牌 去掉桌面当前展示牌
    if (tData.currCard != -1 && tData.winner != -1 && pl.info.uid == tData.uids[tData.winner]) {
    	copyMjhand.pop();
    }

    // if(tData.currCard != -1) {
    // 	//删掉手牌里胡的牌
    // 	if(tData.uids[tData.winner] != MjClient.data.pinfo._id && 
    // 		tData.uids[tData.winner] == pl.info._id)
    // 	{
    // 		if(isPaoHu_paohuzi(MjClient.data.sData.players[tData.uids[tData.winner]], tData.currCard)){
    // 			//删显示的牌
    // 			delPutCard_paohuzi(off);
    // 		}else{
    // 			//删手牌
    // 			copyMjhand.pop();
    // 		}
    // 	}
    // }

    var sortArr = MjClient.majiang.sortHandCardSpecial(copyMjhand);
    //end

    //按照产品需求，邵阳字牌2人玩法对家结算手牌移动到头像旁边
    if((MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ) &&
     (MjClient.gameType == MjClient.GAME_TYPE.SHAO_YANG_FANG_PAO_FA)){
      	if(MjClient.MaxPlayerNum_xiangxiang == 2) {
      		_node.x -= 80;
      		_node.y += 214;
      		_node.setScale(_node.getScale()*0.7);
      	}
    }
    
	//根据牌的类型获得需要添加的节点
	var cardNode = _node.getChildByName("card");
	for(var i = 0;i < sortArr.length;i++){
		var cardParent = new cc.Node();
		if (_node.getName() == "rightPanel"){
			cardParent.x = _node.width - i * cardNode.width;
			cardParent.y = _node.height;
		}else if (_node.getName() == "leftPanel"){
			cardParent.x = i * cardNode.width;
			cardParent.y = _node.height;
		}else if (_node.getName() == "xingPanel"){
			cardParent.x = _node.width - i * cardNode.width;
			cardParent.y = 0;
		}
		_node.addChild(cardParent);

		cc.log("winGame_ZPLYPHZ@@@");
		var childSort = sortArr[i];
        for(var j = 0;j < childSort.length;j++){
			var card = childSort[j];
			var clone = cardNode.clone();
			clone.visible = true;
			//clone.loadTexture(MjClient.cardPath_xiangxiang+"out" + card +".png");
			clone.loadTexture(getOutCardRes_SYldfpf(card));
			var off_y = 0;
			if(_node.getName() == "rightPanel"){
				off_y = clone.height;
				clone.anchorX = 1;
				clone.anchorY = 0;
			}else if(_node.getName() == "leftPanel"){
				off_y = clone.height;
				clone.anchorX = 0;
				clone.anchorY = 0;
			}else if(_node.getName() == "xingPanel"){
                off_y = clone.height;
                clone.anchorX = 1;
                clone.anchorY = 0;
            }

   //         	if(_node.getName() == "rightPanel"){
			// 	off_y = -clone.height;
			// 	clone.anchorX = 1;
			// 	clone.anchorY = 1;
			// }else if(_node.getName() == "leftPanel"){
			// 	off_y = -clone.height;
			// 	clone.anchorX = 0;
			// 	clone.anchorY = 1;
			// }else if(_node.getName() == "xingPanel"){
   //              off_y = clone.height;
   //              clone.anchorX = 1;
   //              clone.anchorY = 0;
   //          }

			clone.zIndex = j;
			clone.x = 0;
			clone.y = ( j -2 - 54 /42)* off_y;
			cardParent.addChild(clone);
        }
	}	
}