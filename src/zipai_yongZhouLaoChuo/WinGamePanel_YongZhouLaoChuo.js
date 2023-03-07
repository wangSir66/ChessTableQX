//邵阳永州扯胡子小结算面板
function addWxHeadToEndUI_yongZhouLaoChuo(node,off){
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
function addWinMjHand_yongZhouLaoChuo(_node,off){
    var tData = MjClient.data.sData.tData;
    // if(MjClient.GAME_TYPE.PAO_HU_ZI_SR == MjClient.gameType || MjClient.gameType == MjClient.GAME_TYPE.PAO_HU_ZI_SR_King){
    // 	off = getOffByXing_paohuzi(off);
    // }
	//var pl =  getUIPlayer_paohuzi(off);
	
	var pl = getUIPlayer_YongZhouLaoChuo(off);
	_node.setVisible(true)
    var copyMjhand = pl.mjhand.concat();//[3,29,7,26,30,6,10,6,26,29,2,5,3,23,9,3,23]//

    if(copyMjhand.length <= 0 ){
    	return
    }
    // if(tData.currCard != -1){
    // 	//删掉手牌里胡的牌
    // 	var selfId = MjClient.data.pinfo._id ? MjClient.data.pinfo._id : MjClient.data.pinfo.uid;
    // 	var plId =  pl.info._id ? pl.info._id : pl.info.uid;

    // 	if(tData.uids[tData.winner] != selfId && 
    // 		tData.uids[tData.winner] == plId)
    // 	{
    // 		if(isPaoHu_paohuzi(MjClient.data.sData.players[tData.uids[tData.winner]], tData.currCard)){
    // 			//删显示的牌
    // 			delPutCard_paohuzi(off);
    // 		}else if(tData.currCard != 91){
    // 			//删手牌
    // 			copyMjhand.pop();
    // 		}
    // 	}
    // }
    var temp = MjClient.majiang.sortCards(copyMjhand).sec; //MjClient.majiang.sortHandCardMax(copyMjhand);
    var sortArr = [];
    var index = 0
    for(k in temp){
    	sortArr.push(temp[k]);
    }

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
			cc.log("==============count====off====", off, card)
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

var EndOneView_YongZhouLaoChuo = cc.Layer.extend({
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
					if(true){
						this.visible = false;
						return
					}
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
                            cmd: "PKPass"
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
	                            MjClient.endoneui._xingPaiImg.visible = false;
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
                                MjClient.endoneui._xingPaiImg.visible = false;
							}
						}
					}
				},
			},
			xingPaiImg:{
				_run:function(){
					MjClient.endoneui._xingPaiImg = this;
					this.visible = false;
				},
				// pai:{
				// 	_run:function(){
				//         //醒牌
				//         var tData = MjClient.data.sData.tData;
				//         if(MjClient.isDismiss || tData.hunCard == -1 || tData.winner == -1){
				//         	this.visible = false;
				//         }else{
				//         	this.loadTexture("playing/paohuzi/out" + tData.hunCard + ".png");
				//         }	            						
				// 	}
				// }
			},
			balance:{
				_run:function(){
					MjClient.endoneui.gameBalance = this;
				},
	            winImg:{
	            	_run:function(){
	            		var sData = MjClient.data.sData;
	            		var tData = sData.tData;
	            		this.visible = true;
	            		this.getParent().getChildByName("huangzhuang").setVisible(false);
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
	            					this.getParent().getChildByName("huangzhuang").setVisible(true);
	            					this.visible = false;
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
						var tData = MjClient.data.sData.tData;
					    var str = "";

					    str += ([MjClient.MaxPlayerNum] + "人场,");
					    var chuoInfo = ["14戳,","15戳,"];
					    if(MjClient.MaxPlayerNum == 4){
					        chuoInfo = ["11戳,","15戳,"];
					    }

					    str += ["曲戳,","定戳,"][tData.areaSelectMode.chuoType];
					    str += chuoInfo[tData.areaSelectMode.chuoNum];
					    str += tData.areaSelectMode.isJianHongJiaFen ? "见红加分," : "";
					    str += tData.areaSelectMode.isQiHuErFen ? "起胡2分," : "";
					    str += tData.areaSelectMode.isHongChuoSiFan ? "红戳4番," : "";
					    str += tData.areaSelectMode.isFanChuo ? "番戳," : "";

					    if(tData.areaSelectMode.trustTime > 0)
					    {
					        str += Math.floor(tData.areaSelectMode.trustTime/60) + "分钟,";
					    } 

					    if(/*tData.areaSelectMode.isTrustWhole*/ tData.areaSelectMode.trustTime > 0 && tData.areaSelectMode.trustWay >= 0)
					    {
					        str += ["托管当局,", "托管当局+下一局,", "整场托管,"][tData.areaSelectMode.trustWay] || "";
					    } 

					    if (tData.areaSelectMode.jieSuanDiFen){
					        str += "底分" + tData.areaSelectMode.jieSuanDiFen;
					    }

						return str;						
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
						    var score = pl.winone;
						    if(tData.winner == -1){
						    	if(pl.winone == 0){
						    		scoreLabel.setString(0);
						    	}else{
						    		scoreLabel.setString((score > 0?"+" + score:score));
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
       //                      if (-pl.winone2 == tData.areaSelectMode.fengDing && tData.areaSelectMode.fengDing>0)
							// {
       //                          text_fengding.setVisible(true);
							// }

						    if(pl.winone < 0){
								nameLabel.setColor(cc.color(243,243,109));
								scoreLabel.setColor(cc.color(243,243,109));
								text_fengding.setColor(cc.color(243,243,109));
						    }
						    var showIndex = (index - selfIndex + MjClient.MaxPlayerNum_paohuzi) % MjClient.MaxPlayerNum_paohuzi;
						    addWxHeadToEndUI_yongZhouLaoChuo(cloneHead,index);
				   		}
				   	},
				},
				hongheichuo :{
					_visible:false,
					_run:function(){
			   			var tData = MjClient.data.sData.tData;
			   			if(tData.winner == -1 ){
			   				return;
			   			}
			   			this.visible = true;

			   			var players = MjClient.data.sData.players;
					   	var pl = players[tData.uids[tData.winner] + ""];

					   	var num = this.getChildByName("num");
					   	
					   	if(pl.hzdesc.heiChuo ){
					   		this.loadTexture("playing/paohuzi/heichuo.png");

					   		num.loadTexture("playing/paohuzi/" + pl.hzdesc.heiChuo + ".png");
					   	}else if(pl.hzdesc.hongChuo ){
					   		this.loadTexture("playing/paohuzi/hongchuo.png");

					   		num.loadTexture("playing/paohuzi/" + pl.hzdesc.hongChuo + ".png");
					   	}
					   	else{
					   		this.visible = false;
					   	}
                       
			   		}

				},
				showInfo:{
				   	diPai:{
				   		title:{
				   			_visible:false
				   		},
				   		_run:function(){
				   			var tData = MjClient.data.sData.tData;
				   			if(tData.winner == -1 || true){
				   				return;
				   			}

                           
				   		}
				   	},
				   /*	listView:{
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
				   	}, */
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

					   		this.visible = true;
					   		var cardNode = this.getChildByName("cards");
					   		cardNode.visible = false;
					   		var startPos = cardNode.getPosition();

					   		var copyCards = pl.chuoCards.concat();//[[6,6],[10], [3,3,3,1,1], [6,6,6,6],[5,5,5,25,25,25],[7,8,9]]//
						    var col = 0;
						    var gap = 5;
						    for(var i = 0; i < copyCards.length; i++){
						        var _groups = copyCards[i];
						        
						        var row = 0;
						        for(var j = 0; j < _groups.length; j++){

						            var value = _groups[j];

						            if(j > 0 && j%3 == 0){
						                col++;
						                row = 0
						            }

						            var cloneCard = cardNode.clone();
						            cloneCard.visible = true;
						            cloneCard.loadTexture("playing/paohuzi/out" + value +".png");
						            var cardPos = cc.p(0, 0);
						            cardPos = cc.p(startPos.x + cloneCard.width*(col) + (gap*(i-1)), startPos.y + cloneCard.height*(row));
						            cloneCard.setPosition(cardPos);
						            
						            this.addChild(cloneCard);
						            

						            row++;
						        }
						        
						        col++
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
					   			this.setString(pl.hzdesc.chuoCount);
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
					   			this.setString(pl.hzdesc.baseScore);
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
					   			this.setString(pl.hzdesc.hongScore);
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
					   			this.setString(pl.winone /*pl.hzdesc.totalFan * pl.hzdesc.totalTun*/);
                                this.ignoreContentAdaptWithSize(true);
				   			}
				   		},
				   		fanchuo:{
				   			_run:function(){
				   				this.visible = false;
				   				var sData = MjClient.data.sData;
					   			var tData = sData.tData;
					   			if(tData.winner == -1){
				   					return;
				   				}
				   				
				   				var players = sData.players;
					   			var pl = players[tData.uids[tData.winner] + ""];
					   			this.visible = pl.hzdesc.fanChuo;
                                //this.ignoreContentAdaptWithSize(true);
				   			}
				   		},
				   		

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
			   			// if(true){
			   			// 	return
			   			// }

			   			var cards = MjClient.data.sData.cards.slice(tData.cardNext, MjClient.data.sData.cards.length);
			   			//var cards = [1,1,2,3,22,4,5,7,8,10,21,22,23,4,6,9,7,7,21,10,23,24,25,26,27,29];
			   			var size = this.getContentSize();
                        var cardNode = this.getChildByName("card");
					   	cardNode.visible = false;
					   	var startPos = cardNode.getPosition();

					   	var col = 0;
					   	var row = 0;
					   	for(var i = 0; i < cards.length; i++){
					   		col = Math.ceil((i + 1)/4) - 1;
					   		row = i%4;

					   		var value = cards[i];
					   		var cloneCard = cardNode.clone();
				            cloneCard.visible = true;
				            cloneCard.loadTexture("playing/paohuzi/out" + value +".png");
				            var cardPos = cc.p(0, 0);
				            cardPos = cc.p(startPos.x + cloneCard.width*(col) , startPos.y + cloneCard.height*(row));
				            cloneCard.setPosition(cardPos);
				            
				            this.addChild(cloneCard);
					   	}
			   		}
				},
				xingPanel:{
					_run:function(){
						if(MjClient.MaxPlayerNum < 3 ){
							this.setVisible(false);
						}else{
							var tData = MjClient.data.sData.tData;
							// var player = getUIPlayer_paohuzi(MjClient.MaxPlayerNum_paohuzi - 1);
							// if(tData.uids.indexOf(player.info.uid) == tData.xingPlayer){
							// 	this.visible = false;
							// 	return;
							// }
							addWinMjHand_yongZhouLaoChuo(this, 2);
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
						// if(MjClient.MaxPlayerNum_paohuzi == 4){
						// 	index = 2;
						// }
						// var player = getUIPlayer_paohuzi(index);
						// if(tData.uids.indexOf(player.info.uid) == tData.xingPlayer){
						// 	this.visible = false;
						// 	return;
						// }
						addWinMjHand_yongZhouLaoChuo(this, index);
						if(MjClient.rePlayVideo != -1){
	                    	this.visible = false;
	                    }
					}
				},
				leftPanel:{
                    _run:function(){
                    	if(MjClient.MaxPlayerNum != 4){
                    		this.visible = false;
                    	}else{
							// var tData = MjClient.data.sData.tData;
							// var player = getUIPlayer_paohuzi(1);
							// if(tData.uids.indexOf(player.info.uid) == tData.xingPlayer){
							// 	this.visible = false;
							// 	return;
							// }
							addWinMjHand_yongZhouLaoChuo(this, 3);
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
        var endoneui = ccs.load("endOne_yongZhouLaoChuo.json");
		BindUiAndLogic(endoneui.node,this.jsBind);
        this.addChild(endoneui.node);
 		return true;
    }
});