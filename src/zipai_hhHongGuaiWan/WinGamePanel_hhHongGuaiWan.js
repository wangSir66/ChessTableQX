function addWxHeadToEndUI_hhHongGuaiWan(node,pl)
{
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

function reInitarrCardVisible_hhHongGuaiWan()
{
	// MjClient.arrowbkNode.setVisible(false);
	if(MjClient.roundnumImgNode && cc.sys.isObjectValid(MjClient.roundnumImgNode)){
        MjClient.roundnumImgNode.setVisible(false);
	}
	if(MjClient.cardNumImgNode && cc.sys.isObjectValid(MjClient.cardNumImgNode)){
        MjClient.cardNumImgNode.setVisible(false);
	}
}

var EndOneView_hhHongGuaiWan = cc.Layer.extend({
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
			balance:{
				_run:function(){
					MjClient.endoneui.gameBalance = this;
				},
				gamelabel:{
				    _run:function () {
                        this.ignoreContentAdaptWithSize(true);
                    },
					_text:function(){
						var sData=MjClient.data.sData;
						var tData=sData.tData;
						var text = "";
                        if(MjClient.gameType == MjClient.GAME_TYPE.HUAI_HUA_HONG_GUAI_WAN){
                            text += (tData.areaSelectMode.redguaiwanOne == 1) ? "名堂番数：红拐弯(234)" : "名堂番数：红拐弯(468)" ;
                        }
						return text;						
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
				diPai:{
					dipaiBg:{
						_run: function(){
							var sData = MjClient.data.sData;
							var tData = sData.tData;
							this.ignoreContentAdaptWithSize(true);
							if(tData.maxPlayer == 2){
								this.loadTexture("gameOver/winGame_hongguaiwan/di_dipai_2.png");
							}else if(tData.maxPlayer == 3){
								this.loadTexture("gameOver/winGame_hongguaiwan/di_dipai_3.png");
							}
						}
					},
			   		title:{
			   			_visible: true,
			   		},
			   		_run: function(){
			   			var sData = MjClient.data.sData;
			   			var tData = sData.tData;
			   			var cards = sData.cards;
			   			var tips = this.getChildByName("title");
			   			var cardObj = this.getChildByName("card");
			   			var startPosX = cardObj.x;
                        if(tData.cardNext < cards.length){
                            if(tData.maxPlayer == 2 && tData.areaSelectMode.maipai){ 
				   				// 加一个埋牌文本
				   				var cloneTips = tips.clone();
				   				cloneTips.setPositionY(tips.y - tips.getContentSize().height * 1.5);
				   				cloneTips.setString("埋牌：");
				   				this.addChild(cloneTips); 
				   			} 

				   			var nextLine;
				   			if(MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType()){
				   				var maiPaiType = tData.areaSelectMode.hasOwnProperty("maiPaiType") ? tData.areaSelectMode.maiPaiType : 0; //埋牌方式  0：不埋牌   1：埋10   2：埋20
					   			if(!tData.areaSelectMode.maipai) maiPaiType = 0;
					   			if(tData.areaSelectMode.maipai && maiPaiType == 0) maiPaiType = 2;
					   			nextLine = (tData.maxPlayer == 2 && tData.areaSelectMode.maipai) ? cards.length - maiPaiType * 10 : tData.maxPlayer == 2 ? tData.cardNext + 20 : tData.cardNext + 10;
				   			}else{
				   				nextLine = (tData.maxPlayer == 2 && tData.areaSelectMode.maipai) ? cards.length - 20 : tData.maxPlayer == 2 ? tData.cardNext + 20 : tData.cardNext + 10;
				   			}

                            for(var i = tData.cardNext;i < cards.length;i++){
                                var card = cards[i];
                                var cloneCard = cardObj.clone();
                                cloneCard.visible = true;
                                cloneCard.loadTexture(MjClient.cardPath_xiangxiang+"out" + card +".png");
                                var cardPos = cc.p(0, 0);
                                if(i < nextLine){
                                    cardPos = cc.p(startPosX + cloneCard.width*(i - tData.cardNext) * 0.7, tips.y);
                                }else {
                                    cardPos = cc.p(startPosX + cloneCard.width*(i - nextLine) * 0.7, tips.y - tips.getContentSize().height * 1.5);
                                }
                                cloneCard.setPosition(cardPos);
                                this.addChild(cloneCard);
                            }
                        }
			   		}
			   	},	
			   	winImg:{
	            	_run:function(){
	            		var sData = MjClient.data.sData;
	            		var tData = sData.tData;
	            		if (MjClient.isDismiss){
	            			this.loadTexture("gameOver/winGame_hongguaiwan/jiesan.png");
	            		}else{
	            			var selfPlayer = getUiOffByUid(SelfUid());
	            			var isHuang = false;
	            			if(tData.winner == -1){
	            				this.loadTexture("gameOver/winGame_hongguaiwan/huangzhuang.png");
	            			}else{
	            				var uids = tData.uids;
	            				var selfIndex = uids.indexOf(SelfUid());
	            				var sub = (selfIndex - tData.winner + tData.maxPlayer) % tData.maxPlayer;
	            				if(sub == 0){
	            					this.loadTexture("gameOver/winGame_hongguaiwan/win.png");
	            				}else if(sub == 2){
	            					this.loadTexture("gameOver/winGame_hongguaiwan/lose.png");
	            				}else if(sub == 1){
	            					this.loadTexture("gameOver/winGame_hongguaiwan/lose.png");
	            				}
	            			}
	            		}
	            	},
				},
			},
			gameRule:{
		   		_run: function(){
		   			var tData = MjClient.data.sData.tData;
		   			var str = "";
            		str += (tData.areaSelectMode.iszimo == 0) ? "3胡1囤" : "3胡1囤,自摸+1囤" ;
		   			str += tData.areaSelectMode.shiwuzimo ? ",15胡可自摸胡" : "";
		   			str += tData.areaSelectMode.huangzhuang ? ",黄庄" : "" ;
                	str += tData.areaSelectMode.datuanyuan ? ",大团圆" : "" ;
                	str += tData.areaSelectMode.shuahou ? ",耍猴" : "" ;
		   			str += tData.areaSelectMode.fanBei == 0 ? ",不翻倍" : ",低于" + tData.areaSelectMode.fanBeiScore + "分翻倍";
                	str += tData.areaSelectMode.jieSuanDiFen > 0 ? ",底分" + tData.areaSelectMode.jieSuanDiFen : "";
		   			if((tData.areaSelectMode.redguaiwanwanfa & 1) == 1){
	                    str += ",天胡";
	                }
	                if((tData.areaSelectMode.redguaiwanwanfa & 2) == 2){
	                    str += ",地胡";
	                }
	                if((tData.areaSelectMode.redguaiwanwanfa & 4) == 4){
	                    str += ",点胡";
	                }
	                if((tData.areaSelectMode.redguaiwanwanfa & 8) == 8){
	                    str += ",红胡";
	                }
	                if((tData.areaSelectMode.redguaiwanwanfa & 16) == 16){
	                    str += ",乌胡";
	                }
	                if((tData.areaSelectMode.redguaiwanwanfa & 32) == 32){
	                    str += ",碰碰胡";
	                }
	                if((tData.areaSelectMode.redguaiwanwanfa & 64) == 64){
	                    str += ",十八大";
	                }
	                if((tData.areaSelectMode.redguaiwanwanfa & 128) == 128){
	                    str += ",十六小";
	                }
	                if((tData.areaSelectMode.redguaiwanwanfa & 256) == 256){
	                    str += ",海底胡";
	                }
                    str += tData.areaSelectMode.trustTime > 0 ? "," + tData.areaSelectMode.trustTime / 60 + "分钟后托管" : "";
		   			this.setString("" + str);
		   		}
		   	},
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
						setWgtLayout(this, [0.15, 0.15],[0.5, 0.0564],[0, 0], false, true);
					}
					if (MjClient.endallui){
						this.loadTextures("gameOver/winGame_hongguaiwan/resume_n.png","gameOver/winGame_hongguaiwan/resume_s.png");
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
	                    if(MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ){
	                    	MjClient.gamenet.request("pkroom.handler.tableMsg", {
		                        cmd: "MJPass"
		                    });
	                    }else{
	                    	MjClient.MJPass2NetForhhHongGuaiWan();
	                    }

	                }

                    if (MjClient.endallui)
					{
                        MjClient.endallui.setVisible(true);
					}

					reInitarrCardVisible_hhHongGuaiWan();
				}
			},
		},
	},
    ctor:function () {
        this._super();
        MjClient.endoneui=this;
        var endoneui = ccs.load("endOne_hhHongGuaiWan.json");
		BindUiAndLogic(endoneui.node,this.jsBind);
        this.addChild(endoneui.node);

        var tData = MjClient.data.sData.tData;
        var uids = tData.uids;
        var maxPlayer = tData.maxPlayer;
        var balance = endoneui.node.getChildByName("parent").getChildByName("balance")
        var showInfo_big = balance.getChildByName("showInfo_big");
        var showInfo_small = balance.getChildByName("showInfo_small");
        showInfo_big.visible = false;
        showInfo_small.visible = false;
        var showInfo = maxPlayer == 2 ? showInfo_big : showInfo_small;
        var showInfoClone = null;
		var sortPlayer = [];
		var otherPlayer = 1;
		if(tData.winner != -1){
			sortPlayer[tData.winner] = 1;
			otherPlayer = 2;
		} 
		//如果有赢家则将其置为首位
		for(var playerIndex = 0; playerIndex < maxPlayer; playerIndex++){
			if(!sortPlayer[playerIndex]){
				sortPlayer[playerIndex] = otherPlayer;
				otherPlayer++;
			}
		}

        for(var i = 0; i < maxPlayer; i++){
        	if(sortPlayer[i] == 1){
        		showInfoClone = showInfo_big.clone();
        		showInfoClone.setPosition(showInfo_big.x, showInfo_big.y);
        		showInfoClone.visible = true;
        		setPlayerGameInfo_hhHongGuaiWan(showInfoClone, uids[i], i);
        		balance.addChild(showInfoClone);
        	}else{
        		var showInfo_y = sortPlayer[i] == 2 ? showInfo.y : 0;
        		showInfoClone = showInfo.clone();
        		showInfoClone.setPosition(balance.getCustomSize().width / 2, showInfo_y);
        		showInfoClone.visible = true;
        		setPlayerGameInfo_hhHongGuaiWan(showInfoClone, uids[i], i);
        		balance.addChild(showInfoClone);
        	}
        }

        this.setDissmissInfo(balance);
 		return true;
    },
    setDissmissInfo : function(balance){
    	//解散信息 说明
    	var dissmissInfo = balance.getChildByName("dissmissInfo");
    	if (dissmissInfo) {
	    	dissmissInfo.setVisible(false);
	        if (MjClient.isDismiss) {  
	        	var sData = MjClient.data.sData;
	   			var tData = sData.tData;
	            var id = tData.firstDel;
	            var pl = sData.players[id];
	            var delStr = "";
	            if(pl) {
	                var name = getNewName(unescape(pl.info.nickname) + "");
	                delStr = name + pl.mjdesc[0]; 
	            } else {
	                pl = getUIPlayer(0);
                    if (pl) {
                        delStr = pl.mjdesc[0];
                    }
	            }  
	            dissmissInfo.setString("" + delStr);
	            dissmissInfo.setVisible(true);    
	        }
        }
    }
});

function setPlayerGameInfo_hhHongGuaiWan(node, uid, plIndex){
	var sData = MjClient.data.sData;
	var tData = sData.tData;
    var selfIndex = tData.uids.indexOf(SelfUid());
    var pl = sData.players[uid + ""];
    var uiBind = {
		bigInfoBg:{
			_run: function(){
				if(SelfUid() == uid){
					this.loadTexture("gameOver/winGame_hongguaiwan/diban_big_light.png");
				}else{
					this.loadTexture("gameOver/winGame_hongguaiwan/diban_big_dark.png");
				}
			}
		},
		smallInfoBg:{
			_run: function(){
				if(SelfUid() == uid){
					this.loadTexture("gameOver/winGame_hongguaiwan/diban_small_light.png");
				}else{
					this.loadTexture("gameOver/winGame_hongguaiwan/diban_small_dark.png");
				}
			}
		},
   		huType:{
   			_visible: false,
   			_run: function(){
   				this.visible = false;
   				if(tData.winner == -1 || tData.uids[tData.winner] != uid) return ;
   				this.visible = true;
   				if(pl.hzdesc.mingtang.zimo || pl.hzdesc.mingtang.tianhu){
   					this.loadTexture("gameOver/winGame_hongguaiwan/zimo.png");
   				}else{
   					this.loadTexture("gameOver/winGame_hongguaiwan/pinghu.png");
   				}
   			}
   		},
   		head:{
   			name:{
   				_run: function(){
		   			this.ignoreContentAdaptWithSize(true);
				    var _nameStr = unescape(pl.info.nickname ) + "";
				    this.setString(getNewName (_nameStr));
   				}
   			},
   			zhuang:{
   				_visible: false,
   				_run: function(){
		   			if(uid == tData.uids[tData.zhuang]){
		   				this.visible = true;
		   				this.zIndex = 100;
		   			}else{
		   				this.visible = false;
		   			}
				}
   			},
   			_run: function(){
   				addWxHeadToEndUI_hhHongGuaiWan(this, pl);
   			}
		},
	   	listView:{
	   		_visible: false,
	   		_run:function(){
	   			if(tData.winner == -1 || tData.uids[tData.winner] != uid){
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
	   				insertItem.getChildByName("imgName").ignoreContentAdaptWithSize(true);
       				insertItem.getChildByName("count").ignoreContentAdaptWithSize(true);
	   				return insertItem;
	   			};

		   		var item = null;
		   		cc.log("名堂来了>>>>>" +JSON.stringify(pl.hzdesc));
		   		if(pl.hzdesc.mingtang.zimo && tData.areaSelectMode.iszimo){
	   				item = getItem();
	   				item.getChildByName("imgName").setString("自摸");
	   				item.getChildByName("count").setString("+1");
	   				item.getChildByName("fan").setString("囤");
	   			}
	   			if(pl.hzdesc.mingtang.honghu){
	   				item = getItem();
	   				item.getChildByName("imgName").setString("红胡");
	   				item.getChildByName("count").setString(pl.hzdesc.mingtang.honghu);
	   				item.getChildByName("fan").setString("番");
	   			}
	   			if(pl.hzdesc.mingtang.tianhu){
	   				item = getItem();
	   				item.getChildByName("imgName").setString("天胡");
	   				item.getChildByName("count").setString(pl.hzdesc.mingtang.tianhu);
	   				item.getChildByName("fan").setString("番");
	   			}
	   			if(pl.hzdesc.mingtang.dianhu){
	   				item = getItem();
	   				item.getChildByName("imgName").setString("点胡");
	   				item.getChildByName("count").setString(pl.hzdesc.mingtang.dianhu);
	   				item.getChildByName("fan").setString("番");
	   			}
	   			if(pl.hzdesc.mingtang.dihu){
	   				item = getItem();
	   				item.getChildByName("imgName").setString("地胡");
	   				item.getChildByName("count").setString(pl.hzdesc.mingtang.dihu);
	   				item.getChildByName("fan").setString("番");
	   			}
	   			if(pl.hzdesc.mingtang.pengpengHu){
	   				item = getItem();
	   				item.getChildByName("imgName").setString("碰碰胡");
	   				item.getChildByName("count").setString(pl.hzdesc.mingtang.pengpengHu);
	   				item.getChildByName("fan").setString("番");
	   			}
	   			if(pl.hzdesc.mingtang.shibada){
	   				item = getItem();
	   				item.getChildByName("imgName").setString("十八大");
	   				item.getChildByName("count").setString(pl.hzdesc.mingtang.shibada);
	   				item.getChildByName("fan").setString("番");
	   			}
	   			if(pl.hzdesc.mingtang.shiliuxiao){
	   				item = getItem();
	   				item.getChildByName("imgName").setString("十六小");
	   				item.getChildByName("count").setString(pl.hzdesc.mingtang.shiliuxiao);
	   				item.getChildByName("fan").setString("番");
	   			}
	   			if(pl.hzdesc.mingtang.wuhu){
	   				item = getItem();
	   				item.getChildByName("imgName").setString("乌胡");
	   				item.getChildByName("count").setString(pl.hzdesc.mingtang.wuhu);
	   				item.getChildByName("fan").setString("番");
	   			}
	   			if(pl.hzdesc.mingtang.haidilao){
	   				item = getItem();
	   				item.getChildByName("imgName").setString("海底胡");
	   				item.getChildByName("count").setString(pl.hzdesc.mingtang.haidilao);
	   				item.getChildByName("fan").setString("番");
	   			}
	   			if(pl.hzdesc.mingtang.huangzhuang){
	   				item = getItem();
	   				item.getChildByName("imgName").setString("黄庄");
	   				item.getChildByName("count").setString(pl.hzdesc.mingtang.huangzhuang);
	   				item.getChildByName("fan").setString("番");
	   			}
	   			if(pl.hzdesc.mingtang.datuanyuan){
	   				item = getItem();
	   				item.getChildByName("imgName").setString("大团圆");
	   				item.getChildByName("count").setString(pl.hzdesc.mingtang.datuanyuan);
	   				item.getChildByName("fan").setString("番");
	   			}
	   			if(pl.hzdesc.mingtang.shuahou){
	   				item = getItem();
	   				item.getChildByName("imgName").setString("耍猴");
	   				item.getChildByName("count").setString(pl.hzdesc.mingtang.shuahou);
	   				item.getChildByName("fan").setString("番");
	   			}
	   		}
	   	},
	   	cardInfo:{
	   		info:{
	   			_visible:false,
	   		},
	   		_run:function(){
	   			var isWinner = false;
	   			if(tData.winner != -1 && uid == tData.uids[tData.winner]){
	   				isWinner = true;
	   			}
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
		   		
	  			var info = this.getChildByName("info");
                var mjSortArr = pl.mjsort;
                var handSortArr = pl.handSort;
	   			var startPos = cc.p(info.x, info.y);
	   			var off_x = info.getCustomSize().width * 1.2;
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
			                if(isWinner && i==4 && isHand == false && cardNum == huCard){
                                setHuCardMark_xxghz(up,clone);
							}
			            }
			            var huxi = huXiScore_xiangxiang("tiPai",cardNum);
			            clone.setString(huxi);
			            clone.setPosition(startPos);
			            this.addChild(clone);
			            startPos = cc.p(startPos.x + off_x, startPos.y);
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
                            if(isWinner && i==3 && isHand == false && cardNum == huCard){
                                setHuCardMark_xxghz(up,clone);
                            }
			            }
			            var huxi = huXiScore_xiangxiang("weiPai",cardNum);
			            clone.setString(huxi);
			            clone.setPosition(startPos);
			            this.addChild(clone);
			            startPos = cc.p(startPos.x + off_x, startPos.y);
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
                            if(isWinner && i==4 && isHand == false && cardNum == huCard){
                                setHuCardMark_xxghz(up,clone);
                            }
			            }
			            var huxi = huXiScore_xiangxiang("paoPai",cardNum);
			            clone.setString(huxi);
			            clone.setPosition(startPos);
			            this.addChild(clone);
			            startPos = cc.p(startPos.x + off_x, startPos.y);
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
			            startPos = cc.p(startPos.x + off_x, startPos.y);
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
			            if(uid != SelfUid()){
			            	eatCards.reverse();
			            }
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
			            startPos = cc.p(startPos.x + off_x, startPos.y);

			            var biCards = pl.mjchi[pos].biCards;
			            if(biCards && biCards.length > 0){
			            	//计算坐标
			            	for(var m = 0;m < biCards.length;m++){
			            		var biArr = biCards[m];
			            		if(uid != SelfUid()){
					            	biArr.reverse();
					            }
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
				            	startPos = cc.p(startPos.x + off_x, startPos.y);
			            	}      
			            }
			        }
			    }
			    //手牌
			    if(tData.winner != -1 && uid == tData.uids[tData.winner]){
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
			            		clone.getChildByName("title").setString("坎");
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
			            		if (isWinner && isHand && card == huCard){
			            		    setHuCardMark_xxghz(up,clone);
			            		    isHand = false;
			            		}
			            	}
			            }
			            clone.setString(handSort.score);
			            clone.setPosition(startPos);
			            this.addChild(clone);
			            startPos = cc.p(startPos.x + off_x, startPos.y);
				    }
			    }else if(tData.winner == -1 || uid != tData.uids[tData.winner]){
		    		var copyMjhand = pl.mjhand.concat();
		    		handSortArr = MjClient.majiang.sortHandCardSpecial(copyMjhand);

		    		var handCardTextFlag = true;
			    	var handCardText = null;
				    for(var index in handSortArr){
				    	var handSort = handSortArr[index];
				    	clone = info.clone();
			            clone.visible = true;
			            if(handCardTextFlag){
			            	handCardText =  clone.getChildByName("title");
			            	handCardTextFlag = false;
			            }else{
			            	clone.getChildByName("title").visible = false;
			            	handCardText.x += off_x / 2.8;
			            }
			            handCardText.setString("手牌");
			            handCardText.ignoreContentAdaptWithSize(true);
			            if(handSort.cards){
			            	var cards = handSort.cards;
			            }else{
			            	var cards = handSort;
			            }
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
			            		if (isWinner && isHand && card == huCard){
			            		    setHuCardMark_xxghz(up,clone);
			            		    isHand = false;
			            		}
			            	}
			            }
			            clone.setString("");
			            clone.setPosition(startPos);
			            this.addChild(clone);
			            startPos = cc.p(startPos.x + off_x / 1.4, startPos.y);
				    }
		    	}
	   		}
	   	},
	   	scoreInfo:{
	   		_visible: true,
	   		card:{
	   			_run: function(){
	   				for(var i = 0; i < pl.mjput.length; i++){
	   					var mjPutCardLen = pl.mjput.length;
	   					var winningPl = sData.players[tData.uids[tData.winner]];
	   					var lastGang0Num = 0;
	   					if(winningPl && winningPl.mjgang0) lastGang0Num = winningPl.mjgang0.length;
	   					//所胡的牌没有从弃牌中删除处理
	   					if(plIndex == tData.curPlayer && winningPl && i == mjPutCardLen - 1 && tData.lastPutCard == pl.mjput[mjPutCardLen - 1]){
	   						continue ;
	   					}
	   					//所跑后胡的牌没有从弃牌中删除处理
	   					if(plIndex == tData.lastPlayer && winningPl && winningPl.mjgang0 && i == mjPutCardLen - 1 &&  
	   						tData.lastPutCard == winningPl.mjgang0[lastGang0Num - 1] && tData.lastPutCard == pl.mjput[mjPutCardLen - 1]){
	   						continue ;
	   					}
	   					var cloneCard = this.clone();
	   					cloneCard.visible = true;
	   					cloneCard.loadTexture(MjClient.cardPath_xiangxiang+"out" + pl.mjput[i] +".png");
	   					if(i < 15){
	   						cloneCard.setPosition(this.x + i * cloneCard.width * 0.7, this.y);
	   					}else if(i >= 15){
	   						cloneCard.setPosition(this.x + (i - 15) * cloneCard.width * 0.7, this.y - cloneCard.height * cloneCard.scaleY);
	   					}
	   					this.parent.addChild(cloneCard);
	   				}
	   			}
	   		},
	   		totalScore:{
	   			_run:function(){
				    this.ignoreContentAdaptWithSize(true);
				    var score = pl.winone ? pl.winone : 0;
				    if(score >= 0){
						this.setString((score > 0 ? "+":"") +  score);
						this.setTextColor(cc.color(235,46,46));
					}else{
						this.setString("" + score);
						this.setTextColor(cc.color(34,116,12));
					}
	   			}
	   		},
	   		huxiScore:{
	   			_run:function(){
	   				this.ignoreContentAdaptWithSize(true);
			   		if(tData.winner == -1 || tData.uids[tData.winner] != uid){
	   					this.setString("" + getPlayerTotalHuXi_xiangxiang(pl));
	   				}else{
			   			this.setString("" + pl.hzdesc.totalHuxi);
	   				}
	   			}
	   		},
	   		tun:{
	   			_run: function(){
	   				if(tData.winner == -1 || tData.uids[tData.winner] != uid){
	   					this.visible = false;
	   				}
	   			}
	   		},
	   		tunScore:{
	   			_run:function(){
	   				this.ignoreContentAdaptWithSize(true);
	   				if (tData.winner == -1 || tData.uids[tData.winner] != uid) {
	   					this.visible = false;
	   				} else {
	   					this.setString("" + pl.hzdesc.tunNum);
	   				}
	   			}
	   		},
	   		fan:{
	   			_run: function(){
	   				if (tData.winner == -1 || tData.uids[tData.winner] != uid) {
	   					this.visible = false;
	   				}
	   			}
	   		},
	   		fanScore:{
	   			_run:function(){
	   				this.ignoreContentAdaptWithSize(true);
	   				if (tData.winner == -1 || tData.uids[tData.winner] != uid) {
	   					this.visible = false;
	   				} else {
	   					this.setString("" + pl.hzdesc.rate);
	   				}
	   			}
	   		}
	   	},
    };
	BindUiAndLogic(node,uiBind); 
}