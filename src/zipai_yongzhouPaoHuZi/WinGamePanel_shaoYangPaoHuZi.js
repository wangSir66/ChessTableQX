//邵阳永州扯胡子小结算面板
function addWxHeadToEndUI_shaoYangCheHuZi(node,off){
	var pl = MjClient.getPlayerByIndex(off);
	var img = "png/default_headpic.png";
	if(pl && pl.wxHeadImg){
		img = pl.wxHeadImg;
	}else{
		return;
	}
	var sp = new cc.Sprite(img);
	node.addChild(sp);
	var frame = node.getChildByName("frame");
	if (frame){
		frame.zIndex = sp.zIndex + 1;
	}
	setRoundEndUserOffline_hengYang(node,pl);
	setWgtLayout(sp,[0.88,0.88],[0.5,0.5],[0,0],false,true);
};

function reInitarrCardVisible_shoYangPaohuzi()
{
	if(MjClient.roundnumImgNode && cc.sys.isObjectValid(MjClient.roundnumImgNode)){
        MjClient.roundnumImgNode.setVisible(false);
	}
	if(MjClient.cardNumImgNode && cc.sys.isObjectValid(MjClient.cardNumImgNode)){
        MjClient.cardNumImgNode.setVisible(false);
	}
}

//添加手牌
function addWinMjHand_shoYangPaohuzi(_node,off){
    var tData = MjClient.data.sData.tData;
    // if(MjClient.GAME_TYPE.PAO_HU_ZI_SR == MjClient.gameType || MjClient.gameType == MjClient.GAME_TYPE.PAO_HU_ZI_SR_King){
    // 	off = getOffByXing_paohuzi(off);
    // }
	var pl = getUIPlayer_paohuzi(off);
	
    var copyMjhand = pl.mjhand.concat();
    if(tData.currCard != -1){
    	//删掉手牌里胡的牌
    	var selfId = MjClient.data.pinfo._id ? MjClient.data.pinfo._id : MjClient.data.pinfo.uid;
    	var plId =  pl.info._id ? pl.info._id : pl.info.uid;

    	if(tData.uids[tData.winner] != selfId && 
    		tData.uids[tData.winner] == plId)
    	{
    		if(isPaoHu_paohuzi(MjClient.data.sData.players[tData.uids[tData.winner]], tData.currCard)){
    			//删显示的牌
    			delPutCard_paohuzi(off);
    		}else if(tData.currCard != 91){
    			//删手牌
    			copyMjhand.pop();
    		}
    	}

    }
    var sortArr = MjClient.majiang.sortHandCardMax(copyMjhand);

	//根据牌的类型获得需要添加的节点
	var cardNode = _node.getChildByName("card");
	for(var i = 0;i < sortArr.length;i++){
		var cardParent = new cc.Node();
		if (_node.getName() == "rightPanel"){
			cardParent.x = _node.width - i * cardNode.width;
			cardParent.y = 0;
		}else if (_node.getName() == "leftPanel"){
			cardParent.x = i * cardNode.width;
			cardParent.y = 0;
		}else if (_node.getName() == "xingPanel"){
			cardParent.x = _node.width - i * cardNode.width;
			cardParent.y = 0;
		}
		_node.addChild(cardParent);

		var childSort = sortArr[i];
        for(var j = 0;j < childSort.length;j++){
			var card = childSort[j];
			var clone = cardNode.clone();
			clone.visible = true;
			clone.loadTexture("playing/paohuzi/out" + card +".png");
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
			clone.zIndex = j;
			clone.x = 0;
			clone.y = j * off_y;
			cardParent.addChild(clone);
        }
	}	
}

var EndOneView_shaoYangPaoHuZi = cc.Layer.extend({
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
            btn_xiPai: {
				_run: function(){
					setWgtLayout(this, [0.18, 0.18],[0.42, 0.06],[0, 0], false, true); 

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
						reInitarrCardVisible_shaoYang();
	                    MjClient.gamenet.request("pkroom.handler.tableMsg", {
		                    cmd: "MJPass"
		                });
	                });
				}
			},
			readyBtn:{
				_run:function (){
					if(MjClient.rePlayVideo == -1 && !MjClient.data.sData.tData.areaSelectMode.isManualCutCard && !MjClient.endallui) {
						setWgtLayout(this, [0.15, 0.15],[0.64, 0.06],[0, 0], false, true);
					}else {
						setWgtLayout(this, [0.15, 0.15],[0.5, 0.06],[0, 0], false, true);
					}
				},
				_click:function(btn,eT){
					postEvent("clearCardUI");
					postEvent("clearCardArr");
					MjClient.endoneui.gameBalance = null;
					MjClient.endoneui.gameMain = null;
					MjClient.endoneui._block = null;
					MjClient.endoneui._xingPaiImg = null;
					MjClient.endoneui.removeFromParent(true);
					MjClient.endoneui = null;
					var sData=MjClient.data.sData;
					var tData=sData.tData;
	                if (MjClient.rePlayVideo >= 0 && MjClient.replayui) {
	                    MjClient.replayui.replayEnd();
	                }else {
	                    MjClient.gamenet.request("pkroom.handler.tableMsg", {
                            cmd: "MJPass"
                        });
	                }

                    if (MjClient.endallui)
					{
                        MjClient.endallui.setVisible(true);
					}

					reInitarrCardVisible_shoYangPaohuzi();
				}
			},
			switchImg:{
				_run: function(){
					var switchBtn = this.getChildByName("switchBtn");
					var basePos = switchBtn.getPosition();
					var m_left = -1;
					var size = this.getContentSize();
					var touchFunc = function(sender, touchType){
						if(touchType == ccui.Widget.TOUCH_ENDED){
							m_left ++;
							if(m_left % 2 == 0){
								switchBtn.getChildByName("img").loadTexture("playing/paohuzi/xianshizhuom.png");
								var off_y = (MjClient.getAppType() == MjClient.APP_TYPE.QXYZQP || MjClient.getAppType() == MjClient.APP_TYPE.BDYZPHZ) ? 33 : 32;
								switchBtn.setPosition(cc.p(basePos.x + 142, off_y));
								MjClient.endoneui.gameBalance.visible = false;
								MjClient.endoneui.gameMain.visible = true;
	                            MjClient.endoneui._block.setOpacity(0);
	                            MjClient.endoneui._xingPaiImg.visible = false;
							}else if(m_left % 2 == 1){
								switchBtn.getChildByName("img").loadTexture("playing/paohuzi/jiesuan.png");
								var off_y = (MjClient.getAppType() == MjClient.APP_TYPE.QXYZQP || MjClient.getAppType() == MjClient.APP_TYPE.BDYZPHZ) ? 33 : 32;
								switchBtn.setPosition(cc.p(basePos.x, off_y));
								MjClient.endoneui.gameBalance.visible = true;
								MjClient.endoneui.gameMain.visible = false;
	                            MjClient.endoneui._block.setOpacity(255);
	                            MjClient.endoneui._xingPaiImg.visible = true;
							}
							
						}
					}.bind(this);
					this.addTouchEventListener(touchFunc);
				},
				tableImg:{
					_touch:function(btn, eT){
						if(eT == 2){
							if(!MjClient.endoneui.gameMain.visible){
								var switchBtn = btn.parent.getChildByName("switchBtn");
								switchBtn.getChildByName("img").loadTexture("playing/paohuzi/xianshizhuom.png");
								var pos = switchBtn.getPosition();
								var off_y = 22.5;
								switchBtn.setPosition(cc.p(pos.x + 142,off_y));
								MjClient.endoneui.gameBalance.visible = false;
								MjClient.endoneui.gameMain.visible = true;
                                MjClient.endoneui._block.setOpacity(0);
                                MjClient.endoneui._xingPaiImg.visible = false;
							}
						}
					}
				},
				balanceImg:{
					_touch:function(btn, eT){
						if(eT == 2){
							if(!MjClient.endoneui.gameBalance.visible){
								var switchBtn = btn.parent.getChildByName("switchBtn");
								switchBtn.getChildByName("img").loadTexture("playing/paohuzi/jiesuan.png");
								var pos = switchBtn.getPosition();
								var off_y = 22.5;
								switchBtn.setPosition(cc.p(pos.x-142,off_y));
								MjClient.endoneui.gameBalance.visible = true;
								MjClient.endoneui.gameMain.visible = false;
                                MjClient.endoneui._block.setOpacity(255);
                                MjClient.endoneui._xingPaiImg.visible = true;
							}
						}
					}
				},
			},
			xingPaiImg:{
				_run:function(){
					MjClient.endoneui._xingPaiImg = this;
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
	            			this.loadTexture("playing/paohuzi/jiesan.png");
	            		}else{
	            			var pl=getUIPlayer(0);
	            			if(pl.winone > 0){
	            				this.loadTexture("playing/paohuzi/win.png");
	            			}else if(pl.winone == 0){
	            				this.loadTexture("playing/paohuzi/win.png");
	            				if(MjClient.CheckPlayerCount(function(p){ if(p.winone==0){return true;} return false;}) == tData.maxPlayer){
	            					this.loadTexture("playing/paohuzi/huangzhuang.png");
	            				}
	            			}else if(pl.winone < 0){
	            				this.loadTexture("playing/paohuzi/lose.png");
	            			}
	            		}
	            	},
				},
				descLabel:{
				    _run:function () {
                        this.ignoreContentAdaptWithSize(true);
                    },
					_text:function(){
						var sData=MjClient.data.sData;
						var tData=sData.tData;
						return "房间号:" + tData.tableid;						
					}
				},
				tableLabel:{
                    _run:function () {
                        this.ignoreContentAdaptWithSize(true);
                    },
					_text:function(){
						var sData=MjClient.data.sData;
						var tData=sData.tData;
						var text = "";
						if(MjClient.gameType == MjClient.GAME_TYPE.PAO_HU_ZI){
							text += "扯胡子三人场,";
						}else if(MjClient.gameType == MjClient.GAME_TYPE.PAO_HU_ZI_ER){
							text += "扯胡子单挑场,";
						}else if(MjClient.gameType == MjClient.GAME_TYPE.PAO_HU_ZI_SR){
							text += "四人场(坐醒),";
						}else if(MjClient.gameType == MjClient.GAME_TYPE.PAO_HU_ZI_King){
                            text += "四王扯胡子,";
                        }else if(MjClient.gameType == MjClient.GAME_TYPE.PAO_HU_ZI_SR_King){
                            text += "四王坐醒,";
                        }else if(MjClient.gameType == MjClient.GAME_TYPE.PAO_HU_ZI_LR_King){
                        	text += "四王单挑场,";
                        }
                        if(MjClient.gameType == MjClient.GAME_TYPE.PAO_HU_ZI_King || 
                        	MjClient.gameType == MjClient.GAME_TYPE.PAO_HU_ZI_SR_King ||
                        	MjClient.gameType == MjClient.GAME_TYPE.PAO_HU_ZI_LR_King)
                        {
                            text += "四王,";
                            text += (tData.areaSelectMode.isKing == 0) ? "按王限胡," : "按番限胡," ;
                        }else{
							if(tData.areaSelectMode.kingNum == 0)
								text += "无王,";
							else if(tData.areaSelectMode.kingNum == 1)
								text += "单王,";
							else if(tData.areaSelectMode.kingNum == 2)
								text += "双王,";
							else if(tData.areaSelectMode.kingNum == 3)
								text += "三王,";
                        }
                        text += (tData.areaSelectMode.isGenXing == true) ? "跟醒," : "翻醒,";

                        if(MjClient.gameType == MjClient.GAME_TYPE.PAO_HU_ZI_SR_King || 
                        	MjClient.gameType == MjClient.GAME_TYPE.PAO_HU_ZI_SR){
                        	if(tData.areaSelectMode.isFanXing == 2)
                        		text += "双醒,";
                        }else
                        	text += (tData.areaSelectMode.isFanXing == 1) ? "单醒," : "双醒,";

                        text += "\n";
                        text += (tData.areaSelectMode.hongZhuan == true) ? "红转朱黑," : "";
		                text += (tData.areaSelectMode.fengDing == -1) ? "无上限," : tData.areaSelectMode.fengDing + "分封顶,";
		                text += tData.areaSelectMode.quanjufengdingScore ? ("整场" + tData.areaSelectMode.quanjufengdingScore + "封顶,") : "整场不封顶,";
		                if(tData.areaSelectMode.baodi){
		                	text += (tData.areaSelectMode.baodi == -1) ? "" : "保底" + tData.areaSelectMode.baodi + "分,";
		                } 

		                if (tData.areaSelectMode.jieSuanDiFen) {
                			text += tData.areaSelectMode.jieSuanDiFen > 0 ? "积分底分" + tData.areaSelectMode.jieSuanDiFen + "," : ""; 
		                }

		                if(MjClient.gameType == MjClient.GAME_TYPE.PAO_HU_ZI_LR_King || MjClient.gameType == MjClient.GAME_TYPE.PAO_HU_ZI_ER){
		                	text += tData.areaSelectMode.minHu ? tData.areaSelectMode.minHu + "胡起胡," : "";
		                }
		                if("qihuTun" in tData.areaSelectMode){
		                	text += ("起胡" + tData.areaSelectMode.qihuTun + "囤");
		                }
		                text += (MjClient.MaxPlayerNum_paohuzi == 3) ? "三人" : ((MjClient.MaxPlayerNum_paohuzi == 2) ? "二人" : "四人");

						if(tData.areaSelectMode.trustTime > 0) {
							text += ",托管" + Math.floor(tData.areaSelectMode.trustTime/60) + "分钟";
						}

						return text;						
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
				   		var off_x = (bgSize.width - headSize.width * playerCount)/(playerCount+1);
				   		var uids = tData.uids;
				   		var selfIndex = tData.uids.indexOf(SelfUid());
				   		for(var index = 0;index<playerCount;index++){
				   			var cloneHead = head.clone();
				   			cloneHead.visible = true;
				   			cloneHead.setPosition(cc.p((index+1) * off_x + index*headSize.width,bgSize.height/2));
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
						    nameLabel.setFontName("Arial");
						    nameLabel.setFontSize(nameLabel.getFontSize());

						    var scoreLabel = cloneHead.getChildByName("score");
						    scoreLabel.ignoreContentAdaptWithSize(true);
						    var score = pl.winone2;
						    if(tData.winner == -1){
						    	if(pl.winone == 0){
						    		scoreLabel.setString(0);
						    	}else{
						    		scoreLabel.setString("王霸" + (score > 0?"+" + score:score));
						    	}
						    }else{
						    	scoreLabel.setString(score > 0?"+" + score:score);
						    }

                            if(tData.areaSelectMode.scoreNeedEnough == 1){
                                if(pl.winone < 0 && pl.winone < pl.winone2){
                                	var frame = cloneHead.getChildByName("frame");

                                    //var bg = new ccui.Layout();
                                    //bg.setContentSize(cc.size(110, 30));
                                    //bg.setBackGroundColor(cc.color(255, 255, 255, 255));
                                    //bg.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
                                    var bg = new ccui.ImageView("gameOver/newOver/jifenbuzu.png");
                                    bg.anchorX = 0.5;
                                    bg.anchorY = 0.5;
                                    bg.x = frame.width * 0.27;
                                    bg.y = frame.height * 0.95;
                                    bg.setRotation(-15);
                                    bg.zIndex = 100;
                                    cloneHead.addChild(bg);

                                    //var tip = new ccui.Text("积分不足","fonts/lanting.TTF",24);
                                    //tip.setColor(cc.color(0,0,0));
                                    //tip.x = bg.width / 2;
                                    //tip.y = bg.height / 2;
                                    //bg.addChild(tip);
                                }
                                var oldScore = new ccui.Text("", "fonts/lanting.TTF", 24);
                                oldScore.ignoreContentAdaptWithSize(true);
                                oldScore.setColor(pl.winone >= 0 ? cc.color(246,255,102) : cc.color(243,243,109));
                                oldScore.x = scoreLabel.x + scoreLabel.width / 2;
                                oldScore.y = scoreLabel.y + scoreLabel.height;
                                oldScore.setString("(" + (pl.winone> 0 ? "+":" ") + pl.winone +")");
                                scoreLabel.getParent().addChild(oldScore);
                            }

                            var text_fengding = cloneHead.getChildByName("fengDing");
                            text_fengding.setVisible(false);
                            if (-pl.winone2 == tData.areaSelectMode.fengDing && tData.areaSelectMode.fengDing>0)
							{
                                text_fengding.setVisible(true);
							}

						    if(pl.winone < 0){
								nameLabel.setColor(cc.color(243,243,109));
								scoreLabel.setColor(cc.color(243,243,109));
								text_fengding.setColor(cc.color(243,243,109));
						    }
						    var showIndex = (index - selfIndex + MjClient.MaxPlayerNum_paohuzi) % MjClient.MaxPlayerNum_paohuzi;
						    addWxHeadToEndUI_shaoYangCheHuZi(cloneHead,index);
				   		}
				   	},
				},
				showInfo:{
				   	diPai:{
				   		title:{
				   			_visible:false
				   		},
				   		_run:function(){
				   			var tData = MjClient.data.sData.tData;
				   			if(tData.winner == -1){
				   				return;
				   			}
				   			
				   			var cards = tData.cards;
                            if(tData.cardNext < cards.length){
                                var size = this.getContentSize();
                                var cardObj = this.getChildByName("card");
                                var totalWidth = cardObj.width * (cards.length - tData.cardNext);
                                var lineCount = 20;
                                if(cards.length - tData.cardNext > 20){
                                	lineCount = Math.ceil((cards.length - tData.cardNext)/2)
                                }
                                var width20Cards = cardObj.width * lineCount;
                                var startPos = cc.p((size.width - totalWidth)/2 + cardObj.width,size.height/2);
                                if((cards.length - tData.cardNext) > lineCount){
                                    startPos = cc.p((size.width - width20Cards)/2 + cardObj.width,size.height/2);
                                }
                                var nameImg = this.getChildByName("title");
                                nameImg.visible = true;
                                nameImg.setPosition(cc.p(startPos.x - nameImg.width/2,startPos.y));

                                for(var i = tData.cardNext;i < cards.length;i++){
                                    var card = cards[i];
                                    var cloneCard = cardObj.clone();
                                    cloneCard.visible = true;
                                    cloneCard.loadTexture("playing/paohuzi/out" + card +".png");
                                    var cardPos = cc.p(0, 0);
                                    if(i < tData.cardNext + lineCount){
                                        cardPos = cc.p(startPos.x + cloneCard.width*(i - tData.cardNext), startPos.y);
                                    }else {
                                        cardPos = cc.p(startPos.x + cloneCard.width*(i - tData.cardNext - lineCount), -startPos.y+15);
                                    }
                                    cloneCard.setPosition(cardPos);
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
					   		if(pl.hzdesc.wangCards){
					   			var wangCards = pl.hzdesc.wangCards;
					   			for(var i = 0;i < wangCards.length;i++){
					   				item = getItem();
					   				var card = wangCards[i];
					   				item.getChildByName("imgName").visible = false;
					   				item.getChildByName("count").visible = false;
					   				var imgLeft = item.getChildByName("imgLeft");
					   				imgLeft.visible = true;
					   				imgLeft.loadTexture("playing/paohuzi/out" + 91 + ".png");
					   				var imgRight = item.getChildByName("imgRight");
					   				imgRight.visible = true;
					   				imgRight.loadTexture("playing/paohuzi/out" + card + ".png");
					   			}
					   		}
				   			if(pl.hzdesc.xing){
				   				item = getItem();
				   				item.getChildByName("imgName").loadTexture("playing/paohuzi/xing.png");
				   				item.getChildByName("count").setString(pl.hzdesc.xing);
				   			}
				   			if(pl.hzdesc.ziMo){
				   				item = getItem();
				   				item.getChildByName("imgName").loadTexture("playing/paohuzi/zimo.png");
				   				item.getChildByName("count").setString(pl.hzdesc.ziMo);
				   			}
				   			if(pl.hzdesc.hongHu){
				   				item = getItem();
				   				item.getChildByName("imgName").loadTexture("playing/paohuzi/honghu.png");
				   				item.getChildByName("count").setString(pl.hzdesc.hongHu);
				   			}
				   			if(pl.hzdesc.yidianZhu){
				   				item = getItem();
				   				item.getChildByName("imgName").loadTexture("playing/paohuzi/yidianzhu.png");
				   				item.getChildByName("count").setString(pl.hzdesc.yidianZhu);
				   			}
				   			if(pl.hzdesc.heiHu){
				   				item = getItem();
				   				item.getChildByName("imgName").loadTexture("playing/paohuzi/heihu.png");
				   				item.getChildByName("count").setString(pl.hzdesc.heiHu);
				   			}
				   			if(pl.hzdesc.hongZhuanZhu){
				   				item = getItem();
				   				item.getChildByName("imgName").loadTexture("playing/paohuzi/HZZ.png");
				   				item.getChildByName("count").setString(pl.hzdesc.hongZhuanZhu);
				   			}
				   			if(pl.hzdesc.hongZhuanHei){
				   				item = getItem();
				   				item.getChildByName("imgName").loadTexture("playing/paohuzi/hzh.png");
				   				item.getChildByName("count").setString(pl.hzdesc.hongZhuanHei);
				   			}		
				   			if(pl.hzdesc.wangZhaWang){
				   				item = getItem();
				   				item.getChildByName("imgName").loadTexture("playing/paohuzi/wangzhawang.png");
				   				item.getChildByName("count").setString(pl.hzdesc.wangZhaWang);
				   			}		   							   	
				   			if(pl.hzdesc.wangZha){
				   				item = getItem();
				   				item.getChildByName("imgName").loadTexture("playing/paohuzi/wangzha.png");
				   				item.getChildByName("count").setString(pl.hzdesc.wangZha);
				   			}
				   			if(pl.hzdesc.wangChuangWang){
				   				item = getItem();
				   				item.getChildByName("imgName").loadTexture("playing/paohuzi/wangchuangw.png");
				   				item.getChildByName("count").setString(pl.hzdesc.wangChuangWang);
				   			}
				   			if(pl.hzdesc.wangChuang){
				   				item = getItem();
				   				item.getChildByName("imgName").loadTexture("playing/paohuzi/wangchuang.png");
				   				item.getChildByName("count").setString(pl.hzdesc.wangChuang);
				   			}
				   			if(pl.hzdesc.wangDiaoWang){
				   				item = getItem();
				   				item.getChildByName("imgName").loadTexture("playing/paohuzi/wangdiaowang.png");
				   				item.getChildByName("count").setString(pl.hzdesc.wangDiaoWang);
				   			}
				   			if(pl.hzdesc.wangDiao){
				   				item = getItem();
				   				item.getChildByName("imgName").loadTexture("playing/paohuzi/wangdiao.png");
				   				item.getChildByName("count").setString(pl.hzdesc.wangDiao);
				   			}
                            if(pl.hzdesc.quanHong){
                                item = getItem();
                                item.getChildByName("imgName").loadTexture("playing/paohuzi/quanhong.png");
                                item.getChildByName("count").setString(pl.hzdesc.quanHong);
                            }
                            if(pl.hzdesc.totalFan == 1){
                                item = getItem();
                                item.getChildByName("imgName").loadTexture("playing/paohuzi/pinghu.png");
                                item.getChildByName("count").setString("1");
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

				   			var bgSize = this.getCustomSize();
                            var off_x = (bgSize.width - 7*42)/6-13;
				  			var info = this.getChildByName("info");
				   			var mjSortArr = pl.mjsort;
                            var handSortArr = pl.handSort;
                            var startPos = cc.p((bgSize.width-(mjSortArr.length+handSortArr.length)*42-(handSortArr.length+mjSortArr.length-1)*off_x)/2+21,info.x - 10);
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
						            clone.getChildByName("title").loadTexture("playing/paohuzi/qing.png");
						            for(i = 1;i <= 4;i++){
						                var up = clone.getChildByName("card" + i);
						                up.loadTexture("playing/paohuzi/out" + cardNum + ".png");
						            }
						            var huxi = huXiScore_paohuzi("tiPai",cardNum);
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
						            clone.getChildByName("title").loadTexture("playing/paohuzi/xiao.png");
						            for(i = 1;i <= 4;i++){
						                var up = clone.getChildByName("card" + i);
						                if(i == 4){
						                	up.visible = false;
						                }else{
						                	up.loadTexture("playing/paohuzi/out" + cardNum + ".png");
						                }
						            }
						            var huxi = huXiScore_paohuzi("weiPai",cardNum);
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
						            clone.getChildByName("title").loadTexture("playing/paohuzi/pao.png");
						            for(i = 1;i <= 4;i++){
						                var up = clone.getChildByName("card" + i);
						                up.loadTexture("playing/paohuzi/out" + cardNum + ".png");
						            }
						            var huxi = huXiScore_paohuzi("paoPai",cardNum);
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
						            clone.getChildByName("title").loadTexture("playing/paohuzi/peng.png");
						            for(i = 1;i <= 4;i++){
						                var up = clone.getChildByName("card" + i);
						               	if(i == 4){
						               		up.visible = false;
						               	}else{
						               		up.loadTexture("playing/paohuzi/out" + cardNum + ".png");
						               	}
						            }
						            var huxi = huXiScore_paohuzi("peng",cardNum);
						            clone.setString(huxi);
						            clone.setPosition(startPos);
						            this.addChild(clone);
						            startPos = cc.p(startPos.x + off_x + 42,startPos.y);
						        }
						        //吃
						        if(name == "mjchi"){
						        	var getHuXi = function(cards){
						        		var normal = [[1,2,3],[21,22,23]];
						        		for(var t = 0;t < normal.length;t++){
						        			if(normal[t].toString() == cards.toString()){
						        				var huxi = huXiScore_paohuzi("chi",cards[0]);
						        				return huxi;
						        			}
						        		}
						        		var other = [[2,7,10],[22,27,30]];
						        		for(t = 0;t < other.length;t++){
						        			if(other[t].toString() == cards.toString()){
						        				var huxi = huXiScore_paohuzi("chi",cards[0]);
						        				return huxi;
						        			}
						        		}
						        		return 0;			        		
						        	};

						            var eatCards = pl.mjchi[pos].eatCards;
						            eatCards.sort(function(a,b){
						        		return a - b;
						        	});
						            clone = info.clone();
						            clone.visible = true;
						            clone.getChildByName("title").loadTexture("playing/paohuzi/chi.png");
						            for(i = 1;i <= 4;i++){
						            	var up = clone.getChildByName("card" + i);
						            	var card = eatCards[i-1];
						            	if(card){
						            		up.loadTexture("playing/paohuzi/out" + card + ".png");
						            	}else{
						            		up.visible = false;
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
						            		biArr.sort(function(a,b){
						        				return a - b;
						        			});
							            	clone = info.clone();
								            clone.visible = true;
								            clone.getChildByName("title").loadTexture("playing/paohuzi/chi.png");
								            for(i = 1;i <= 4;i++){
								            	var up = clone.getChildByName("card" + i);
								            	var card = biArr[i-1];
								            	if(card){
								            		up.loadTexture("playing/paohuzi/out" + card + ".png");
								            	}else{
								            		up.visible = false;
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
					            		clone.getChildByName("title").loadTexture("playing/paohuzi/chi.png");
					            	}
					            	if(handSort.name == "kan"){
					            		clone.getChildByName("title").loadTexture("playing/paohuzi/xiao.png");
					            	}
					            	if(handSort.name == "ti"){
					            		clone.getChildByName("title").loadTexture("playing/paohuzi/qing.png");
					            	}
					            }else{
					            	clone.getChildByName("title").visible = false;
					            }
					            
					            var cards = handSort.cards;
					            for(i = 1;i <= 4;i++){
					            	var up = clone.getChildByName("card" + i);
					            	var card = cards[i-1];
					            	if(card){
					            		up.loadTexture("playing/paohuzi/out" + card + ".png");
					            	}else{
					            		up.visible = false;
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
				   		_visible: false,
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
					   			this.setString(pl.hzdesc.huXi);
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
				   				this.getParent().visible = true;
				   				var players = sData.players;
					   			var pl = players[tData.uids[tData.winner] + ""];
					   			this.setString(pl.hzdesc.totalTun);
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
				   				this.getParent().visible = true;
				   				var players = sData.players;
					   			var pl = players[tData.uids[tData.winner] + ""];
					   			this.setString(pl.hzdesc.totalFan);
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
				   				this.getParent().visible = true;
				   				var players = sData.players;
					   			var pl = players[tData.uids[tData.winner] + ""];
					   			this.setString(pl.hzdesc.totalFan * pl.hzdesc.totalTun);
                                this.ignoreContentAdaptWithSize(true);
				   			}
				   		}
				   	}
				},	
			},
			main:{
				_run:function(){
                    MjClient.endoneui.gameMain = this;
				},
				diPai:{
			   		title:{
			   			_visible:false
			   		},
			   		_run:function(){
			   			var tData = MjClient.data.sData.tData;
			   			if(tData.winner == -1){
			   				return;
			   			}
			   			
			   			var cards = tData.cards;
			   			if(tData.cardNext < cards.length){
			   				var size = this.getContentSize();
			   				var cardObj = this.getChildByName("card");
			   				var totalWidth = cardObj.width * (cards.length - tData.cardNext);
                            var lineCount = 20;
                            if(cards.length - tData.cardNext > 20){
                            	lineCount = Math.ceil((cards.length - tData.cardNext)/2)
                            }
			   				var width20Cards = cardObj.width * lineCount;
                            var startPos = cc.p((size.width - totalWidth)/2 + cardObj.width,size.height/2);
			   				if((cards.length - tData.cardNext) > lineCount){
                                startPos = cc.p((size.width - width20Cards)/2 + cardObj.width,size.height/2);
							}
			   				var nameImg = this.getChildByName("title");
			   				nameImg.visible = true;
			   				nameImg.setPosition(cc.p(startPos.x - nameImg.width/2,startPos.y));

			   				for(var i = tData.cardNext;i < cards.length;i++){
			   					var card = cards[i];
			   					var cloneCard = cardObj.clone();
			   					cloneCard.visible = true;
			   					cloneCard.loadTexture("playing/paohuzi/out" + card +".png");
                                var cardPos = cc.p(0, 0);
			   					if(i < tData.cardNext + lineCount){
			   						cardPos = cc.p(startPos.x + cloneCard.width*(i - tData.cardNext), startPos.y);
								}else {
                                    cardPos = cc.p(startPos.x + cloneCard.width*(i - tData.cardNext - lineCount), -startPos.y+15);
								}
			   					cloneCard.setPosition(cardPos);
			   					this.addChild(cloneCard);
			   				}
			   			}
			   		}
				},
				leftPanel:{
					_run:function(){
						if(MjClient.MaxPlayerNum_paohuzi == 2){
							this.setVisible(false);
						}else{
							var tData = MjClient.data.sData.tData;
							var player = getUIPlayer_paohuzi(MjClient.MaxPlayerNum_paohuzi - 1);
							if(tData.uids.indexOf(player.info.uid) == tData.xingPlayer){
								this.visible = false;
								return;
							}
							addWinMjHand_shoYangPaohuzi(this,MjClient.MaxPlayerNum_paohuzi - 1);
						}
						if(MjClient.rePlayVideo != -1){
	                    	this.visible = false;
	                    }
					}
				},
				rightPanel:{
					_run:function(){
						var tData = MjClient.data.sData.tData;
						var index = 1;
						if(MjClient.MaxPlayerNum_paohuzi == 4){
							index = 2;
						}
						var player = getUIPlayer_paohuzi(index);
						if(tData.uids.indexOf(player.info.uid) == tData.xingPlayer){
							this.visible = false;
							return;
						}
						addWinMjHand_shoYangPaohuzi(this,index);
						if(MjClient.rePlayVideo != -1){
	                    	this.visible = false;
	                    }
					}
				},
				xingPanel:{
                    _run:function(){
                    	if(MjClient.MaxPlayerNum_paohuzi != 4){
                    		this.visible = false;
                    	}else{
							var tData = MjClient.data.sData.tData;
							var player = getUIPlayer_paohuzi(1);
							if(tData.uids.indexOf(player.info.uid) == tData.xingPlayer){
								this.visible = false;
								return;
							}
							addWinMjHand_shoYangPaohuzi(this,1);
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
        var endoneui = ccs.load("endOne_shaoYangPaoHuZi.json");
		BindUiAndLogic(endoneui.node,this.jsBind);
        this.addChild(endoneui.node);
 		return true;
    }
});