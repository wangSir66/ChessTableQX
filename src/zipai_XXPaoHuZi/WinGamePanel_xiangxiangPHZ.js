function addWxHeadToEndUI_xiangxiangPHZ(node,off)
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
    node.addChild(sp);
    var frame = node.getChildByName("frame");
    if (frame){
        frame.zIndex = sp.zIndex + 1;
    }

    setRoundEndUserOffline_xiangxiang(node,pl);
    setWgtLayout(sp,[0.88,0.88],[0.5,0.5],[0,0],false,true);
}

function reInitarrCardVisible_xiangxiangPHZ()
{
	// MjClient.arrowbkNode.setVisible(false);
	if(MjClient.roundnumImgNode && cc.sys.isObjectValid(MjClient.roundnumImgNode)){
        MjClient.roundnumImgNode.setVisible(false);
	}
	if(MjClient.cardNumImgNode && cc.sys.isObjectValid(MjClient.cardNumImgNode)){
        MjClient.cardNumImgNode.setVisible(false);
	}
}

var EndOneView_xiangxiangPHZ = cc.Layer.extend({
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
			readyBtn:{
				_run:function (){
					if(MjClient.remoteCfg.guestLogin){
						setWgtLayout(this, [0.15, 0.15],[0.5, 0.085],[0, 0], false, true);
					}
				},
				_click:function(btn,eT){
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
	                	if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ){
	                    	MjClient.gamenet.request("pkroom.handler.tableMsg", {
		                        cmd: "MJPass"
		                    });
	                    }else{
	                    	MjClient.MJPass2NetForxiangxiangPHZ();
	                    } 
	                }

                    if (MjClient.endallui)
					{
                        MjClient.endallui.setVisible(true);
					}

					reInitarrCardVisible_xiangxiangPHZ();
				}
			},
			switchImg_zhuomian:{
				_run:function(){
					this.visible = true;
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
				},
				_click: function(btn,eT){ 
					var panel = new HandCardPanel_ziPai();
					MjClient.endoneui.addChild(panel);
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
	            		this.ignoreContentAdaptWithSize(true);
	            		loadWinGameImg(this);
	            	},
				},
				gamelabel:{
				    _run:function () {
                        this.ignoreContentAdaptWithSize(true);
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
				   		for(var index = 0;index<playerCount;index++){
				   			var cloneHead = head.clone();
				   			cloneHead.visible = true;
				   			cloneHead.setPosition(cc.p((index+1) * off_x,bgSize.height/2));
				   			//胡牌玩家置为最前
				   			if(tData.winner != -1 && tData.winner != 0){
				   				if(index == 0){
				   					cloneHead.setPosition(cc.p((tData.winner+1) * off_x,bgSize.height/2));
				   				}else if(index == tData.winner){
				   					cloneHead.setPosition(cc.p(off_x,bgSize.height/2));
				   				}
				   			}
				   			this.addChild(cloneHead);

				   			var zhuang = cloneHead.getChildByName("zhuang");
				   			if(index == tData.zhuang){
				   				zhuang.visible = true;
				   				zhuang.zIndex = 100;
				   			}else{
				   				zhuang.visible = false;
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
						    if(tData.winner == -1){
						    	if(pl.winone == 0){
						    		scoreLabel.setString("   " + "0");
						    	}else{

                                    if(MjClient.gameType == MjClient.GAME_TYPE.ZP_LY_CHZ || 
                                    	MjClient.gameType == MjClient.GAME_TYPE.SHAO_YANG_BO_PI)
                                    {
                                        scoreLabel.setString(score > 0?"+" + score:score);
                                    }else {
                                        scoreLabel.setString(score > 0?"+" + score:score);
                                        score_winner.setString(score > 0?"+" + score:score);
									}
						    	}
						    }else{
						    	scoreLabel.setString(score > 0?"+" + score:score);
						    	score_winner.setString(score > 0?"+" + score:score);
						    }
						    score_winner.visible = false;
						    if(pl.winone > 0){
						    	//nameLabel.setColor(cc.color(243,243,109));
						    	//scoreLabel.setColor(cc.color(226,43,0));
						    	score_winner.visible = true;
						    	scoreLabel.visible = false;
						    }

						    var longCards = pl.longCard;
						    var card0 = cloneHead.getChildByName("card_0");
						    var pos0 = card0.getPosition();
						    for(var i = 0; i < longCards.length; i++){
                                var card = longCards[i];
                                var cloneCard = card0.clone();
                                cloneCard.visible = true;
                                cloneCard.loadTexture(MjClient.cardPath_xiangxiang+"out" + card +".png");
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

						    if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ){
						    	addWxHeadToEndUI_shaoYang_XXZiPai(cloneHead,showIndex);
						    }else{
						    	addWxHeadToEndUI_xiangxiangPHZ(cloneHead,showIndex);
						    }
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
				   			if(tData.winner == -1 && tData.maxPlayer != 2 && !tData.areaSelectMode.maipai){
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

                                if(tData.maxPlayer == 2 && tData.areaSelectMode.maipai){ 
					   				// 加一个埋牌文本
					   				var tips = this.getChildByName("title");
					   				var cloneTips = tips.clone();
					   				cloneTips.setPositionY(-startPos.y+15);
					   				cloneTips.setString("埋牌:");
					   				this.addChild(cloneTips); 
					   			}

					   			var nextLine, scrollView;
					   			if(MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType()){
					   				var maiPaiType = tData.areaSelectMode.hasOwnProperty("maiPaiType") ? tData.areaSelectMode.maiPaiType : 0;//埋牌方式  0：不埋   1：埋10   2：埋20
					   				if(!tData.areaSelectMode.maipai) maiPaiType = 0;
					   				if(tData.areaSelectMode.maipai && maiPaiType == 0) maiPaiType = 2;
					   				nextLine = (tData.maxPlayer == 2 && tData.areaSelectMode.maipai) ? cards.length - maiPaiType * 10  : tData.cardNext + 20;
					   				
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
					   				nextLine = (tData.maxPlayer == 2 && tData.areaSelectMode.maipai) ? cards.length - 20 : tData.cardNext + 20;
					   			}

					   			
                                for(var i = tData.cardNext;i < cards.length;i++){
                                    var card = cards[i];
                                    var cloneCard = cardObj.clone();
                                    cloneCard.visible = true;
                                    cloneCard.loadTexture(MjClient.cardPath_xiangxiang+"out" + card +".png");
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
				   				item.getChildByName("count").setString("×2");
				   			}
				   			if(pl.hzdesc.dihu){
				   				item = getItem();
				   				item.getChildByName("imgName").setString("地胡");
				   				item.getChildByName("count").setString("×2");
				   			}
				   			if(pl.hzdesc.redhu){
				   				item = getItem();
				   				item.getChildByName("imgName").setString("红胡");
				   				item.getChildByName("count").setString("×2");
				   			}
				   			if(pl.hzdesc.blackhu){
				   				item = getItem();
				   				item.getChildByName("imgName").setString("黑胡");
				   				item.getChildByName("count").setString("×2");
				   			}
				   			if(pl.hzdesc.littleRed){
				   				item = getItem();
				   				item.getChildByName("imgName").setString("一点红");
				   				item.getChildByName("count").setString("×2");
				   			}
				   			// if(pl.hzdesc.zimo){
				   			// 	item = getItem();
				   			// 	item.getChildByName("imgName").setString("自摸");
				   			// 	item.getChildByName("count").setString("");
				   			// }
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
						                up.loadTexture(MjClient.cardPath_xiangxiang+"out" + cardNum + ".png");
						                if(i==4 && isHand == false && cardNum == huCard){
                                            setHuCardMark_xxghz(up,clone);
										}
						            }
						            var huxi = huXiScore_xiangxiang("tiPai",cardNum);
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
						                	up.loadTexture(MjClient.cardPath_xiangxiang+"out" + cardNum + ".png");
						                }
                                        if(i==3 && isHand == false && cardNum == huCard){
                                            setHuCardMark_xxghz(up,clone);
                                        }
						            }
						            var huxi = huXiScore_xiangxiang("weiPai",cardNum);
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
						                up.loadTexture(MjClient.cardPath_xiangxiang+"out" + cardNum + ".png");
                                        if(i==4 && isHand == false && cardNum == huCard){
                                            setHuCardMark_xxghz(up,clone);
                                        }
						            }
						            var huxi = huXiScore_xiangxiang("paoPai",cardNum);
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
						               		up.loadTexture(MjClient.cardPath_xiangxiang+"out" + cardNum + ".png");
						               	}
						            }
						            var huxi = huXiScore_xiangxiang("peng",cardNum);
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
						            		up.loadTexture(MjClient.cardPath_xiangxiang+"out" + card + ".png");
						            	}else{
						            		up.visible = false;
						            	}
						            	if(i == 3){
						            		up.setColor(cc.color(170, 170, 170));
										}
						            }
						            var huxi = getHuXi(eatCards);
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
								            		up.loadTexture(MjClient.cardPath_xiangxiang+"out" + card + ".png");
								            	}else{
								            		up.visible = false;
								            	}
                                                if(i == 3){
                                                    up.setColor(cc.color(170, 170, 170));
                                                }
								            }
								          	var huxi = getHuXi(biArr);
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
					            		up.loadTexture(MjClient.cardPath_xiangxiang+"out" + card + ".png");
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
					            clone.setString(handSort.score);
					            clone.setPosition(startPos);
					            this.addChild(clone);
					            startPos = cc.p(startPos.x + off_x + 42,startPos.y);
						    }
				   		}
				   	},
				   	scoreInfo:{
				   		_run: function(){
				   			this.visible = false;
				   		}
				   	},
				   	scoreInfomation:{
				   		_visible: false,
				   		huxi:{
				   			_run:function(){
				   				var sData = MjClient.data.sData;
					   			var tData = sData.tData;
						   		if(tData.winner == -1){
				   					return;
				   				}
				   				this.getParent().visible = true;
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
				   				var players = sData.players;
					   			var pl = players[tData.uids[tData.winner] + ""];
					   			if(pl && pl.hzdesc.huXi){
					   				this.setString(pl.hzdesc.huXi);
					   			}else{
					   				this.setString("找汪汪");
					   				mylog("这个问题要@Auto");
					   			}
					   			this.ignoreContentAdaptWithSize(true);				   			
					   		}
				   		},
				   		tun:{
				   			_run:function(){
				   				var sData = MjClient.data.sData;
					   			var tData = sData.tData;
						   		if(tData.winner == -1){
				   					return;
				   				}
				   				this.getParent().visible = true;
					   			this.ignoreContentAdaptWithSize(true);				   				
				   			}
				   		},
				   		tunScore:{
				   			_run:function(){
				   				var sData = MjClient.data.sData;
					   			var tData = sData.tData;
						   		if(tData.winner == -1){
				   					return;
				   				}
				   				var players = sData.players;
					   			var pl = players[tData.uids[tData.winner] + ""];
					   			if(pl && pl.hzdesc.totalTun){
					   				this.setString(pl.hzdesc.totalTun);
					   			}else{
					   				this.setString("找汪汪");
					   				mylog("这个问题要@Auto");
					   			}
					   			this.ignoreContentAdaptWithSize(true);				   			
					   		}
				   		},
				   		fan:{
				   			_run:function(){
				   				var sData = MjClient.data.sData;
					   			var tData = sData.tData;
						   		if(tData.winner == -1){
				   					return;
				   				}
				   				this.getParent().visible = true;
					   			this.ignoreContentAdaptWithSize(true);				   				
				   			}
				   		},
				   		fanScore:{
				   			_run:function(){
				   				var sData = MjClient.data.sData;
					   			var tData = sData.tData;
						   		if(tData.winner == -1){
				   					return;
				   				}
				   				var players = sData.players;
					   			var pl = players[tData.uids[tData.winner] + ""];
					   			if(pl && pl.hzdesc.totalFan){
					   				this.setString(pl.hzdesc.totalFan);
					   			}else{
					   				this.setString("找汪汪");
					   				mylog("这个问题要@Auto");
					   			}
					   			this.ignoreContentAdaptWithSize(true);				   			
					   		}
				   		},
				   		total:{
				   			_run:function(){
				   				var sData = MjClient.data.sData;
					   			var tData = sData.tData;
						   		if(tData.winner == -1){
				   					return;
				   				}
				   				this.getParent().visible = true;
					   			this.ignoreContentAdaptWithSize(true);				   				
				   			}
				   		},
				   		totalScore:{
				   			_run:function(){
				   				var sData = MjClient.data.sData;
					   			var tData = sData.tData;
						   		if(tData.winner == -1){
				   					return;
				   				}
				   				var players = sData.players;
					   			var pl = players[tData.uids[tData.winner] + ""];
					   			if(pl && pl.winone){
					   				this.setString(pl.winone/(tData.maxPlayer - 1));
					   			}else{
					   				this.setString("找汪汪");
					   				mylog("这个问题要@Auto");
					   			}
					   			this.ignoreContentAdaptWithSize(true);				   			
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
					if (tData.winner != -1 && tData.uids[tData.winner] != SelfUid()) {
						var huPl = sData.players[tData.uids[tData.winner]];
						if (huPl.mjgang0.indexOf(tData.lastPutCard) >= 0) {
							delPutCard_paohuzi();
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
			   					cloneCard.loadTexture(MjClient.cardPath_xiangxiang+"out" + card +".png");
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
						addWinMjHand_xiangxiangPHZ(this,MjClient.MaxPlayerNum_xiangxiang - 1);
						if(MjClient.rePlayVideo != -1){
	                    	this.visible = false;
	                    }
					}
				},
				rightPanel:{
					_run:function(){
						if(MjClient.MaxPlayerNum_xiangxiang == 2){
	                    	this.setVisible(false);
	                    	return ;
						}
						addWinMjHand_xiangxiangPHZ(this,1);
						if(MjClient.rePlayVideo != -1){
	                    	this.visible = false;
	                    }
					}
				},
				xingPanel:{
                    _run:function(){
                    	if(MjClient.gameType == MjClient.GAME_TYPE.HY_LIU_HU_QIANG || MjClient.gameType == MjClient.GAME_TYPE.SHAO_YANG_BO_PI){
	                    	if(MjClient.MaxPlayerNum_xiangxiang == 3){
	                    		this.setVisible(false);
							}
	                        addWinMjHand_xiangxiangPHZ(this,1);
                    	}
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
        MjClient.endoneui=this;
        var endoneui = ccs.load("endOne_xiangxiangPHZ.json");

        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ){
        	endoneui = ccs.load("endOne_xxGaoHuZi.json");
        }

		BindUiAndLogic(endoneui.node,this.jsBind);
        this.addChild(endoneui.node);
 		return true;
    }
});

//添加手牌
function addWinMjHand_xiangxiangPHZ(_node,off) {
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
			clone.loadTexture(MjClient.cardPath_xiangxiang+"out" + card +".png");
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