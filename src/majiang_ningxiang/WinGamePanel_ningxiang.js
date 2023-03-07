function CardLayoutRestoreForEndOne_ningxiang(node, endonepl, isHu)
{
    // node 是克隆新建的一个麻将节点 by sking

    // var newC = null; //先创建麻将的UI节点
    // var newVal = 0; //新牌的值，是几万，几筒，几条....为数字
    var pl = endonepl; //player 信息
    var mjhandNum = 0;
    var children = node.children;
    var huCard_1 = null;
    var huCard_2 = null;
    // for(var i = 0; i < children.length; i++)
    // {
    //     var ci = children[i];
    //     if(ci.name == "mjhand")
    //     {
    //         mjhandNum++;
    //     }
    // }

    // var tempMaJiang = MjClient.majiang; //麻将的各种方法判断，是否可以杠，是否可以吃... by sking

    // //排序麻将的位置 by sking
    // if (pl.mjhand && pl.mjhand.length > 0)
    // {
    //     var count = tempMaJiang.CardCount(pl);
    //     if(count == 14 && mjhandNum == pl.mjhand.length)
    //     {
    //         newVal = pl.mjhand[pl.mjhand.length - 1]; //为什么取最后一个节点 ？
    //     }
    // }

    //up stand 是2种麻将的图。
    var up = node.getChildByName("up");
    var stand = node.getChildByName("stand");
    var start = up, offui = stand;


    var upSize = offui.getSize();
    var upS = offui.scale;
    //mjhand standPri out chi peng gang0 gang1
    var uipeng = [];
    var uigang0 = [];
    var uigang1 = [];
    var uichi = [];
    var uistand = [];
    var uihun = [];//癞子牌在最左边
    // var sData = MjClient.data.sData;
    // var tData = sData.tData;
    for(var i = 0; i < children.length; i++) //children 为 "down" 节点下的字节点
    {
        var ci = children[i];
        if(ci.name == "mjhand")
        {
            if(huCard_1 == null && pl.huGangCards && pl.huGangCards[0] && pl.huGangCards[0] == ci.tag)
            {
                huCard_1 = ci; 
            }
            else if(huCard_2 == null && pl.huGangCards && pl.huGangCards[1] && pl.huGangCards[1] == ci.tag)
            {
                huCard_2 = ci; 
            }
            else
            {
                if(MjClient.data.sData.tData.hunCard == ci.tag)
                {
                    uihun.push(ci);
                }
                else
                {
                    uistand.push(ci);
                }
            }

            //if(MjClient.data.sData.tData.hunCard == ci.tag)
            //{
            //    ci.setColor(cc.color(255,255,63));
            //}

        }
        else if(ci.name == "standPri")
        {
            uistand.push(ci);
        }
        else if(ci.name == "gang0")
        {
            uigang0.push(ci);
        }
        else if (ci.name == "gang1")
        {
            uigang1.push(ci);
        }
        else if (ci.name == "chi")
        {
            uichi.push(ci);
        }
        else if (ci.name == "peng")
        {
            uipeng.push(ci);
        }
    }


    if(MjClient.gameType === MjClient.GAME_TYPE.XU_ZHOU)
    {
        uistand.sort(TagOrder_xz);
    }
    else
    {
        uistand.sort(TagOrder);
    }


    if(uihun.length > 0) //是否有柰子，有则放在最前面 by sking
    {
        for(var i = 0; i < uihun.length; i++)
        {
            uistand.unshift(uihun[i]); //向数组开头添加一个元素 unshift
        }
    }

    if(huCard_1)
    {
        uistand.push(huCard_1);
    }

    if(huCard_2)
    {
        uistand.push(huCard_2);
    }

    var uiOrder = [uigang1, uigang0, uipeng, uichi, uistand];


    var orders = []; //重新排序后装到数组里 by sking
    for(var j = 0; j < uiOrder.length; j++)
    {
        var uis = uiOrder[j];
        for(var i = 0; i < uis.length; i++)
        {
            orders.push(uis[i]);
        }
    }

    //设置麻将大小
    var slotwith = upSize.width * upS * 0.2;//0.05;
    var slotheigt = upSize.height * upS * 0.3;
    for(var i = 0; i < orders.length; i++)
    {
        var ci = orders[i];
        if(i != 0)
        {
            if(ci.name == orders[i - 1].name)
            {
                if(ci.isgang4)
                {
                    ci.x = orders[i - 2].x;
                    ci.y = orders[i - 2].y + upSize.height * upS * 0.18;
                }
                else if (orders[i - 1].isTeshuGang3_3)
                {
                    ci.x = orders[i - 1].x + upSize.width * upS + slotwith;
                }
                else if(orders[i - 1].isgang4)
                {
                    ci.x = orders[i - 2].x + upSize.width * upS*1.2 + slotwith;
                }
                else
                {
                    if(ci.name == "mjhand")
                    {
                        ci.x = orders[i - 1].x + upSize.width * upS *1.35;
                    }
                    else
                    {
                        ci.x = orders[i - 1].x + upSize.width * upS *1.2;
                    }
                }
            }
            else if(orders[i - 1].name == "gang0" || orders[i - 1].name == "gang1")
            {
				if (orders[i - 1].y - orders[i - 2].y < upSize.height * upS * 0.1)
					ci.x = orders[i - 1].x + upSize.width * upS*1.2 + slotwith;
				else
                	ci.x = orders[i - 2].x + upSize.width * upS*1.2 + slotwith;
            }
            else
            {
                ci.x = orders[i - 1].x + upSize.width * upS*1.2 + slotwith;
            }

            if(huCard_2 && i == orders.length - 2 || huCard_1 && i == orders.length - 1)
            {
                ci.x = ci.x + slotwith + 10;
                huCard_1 = null;
                huCard_2 = null;
            }
        }
        else
        {
            ci.x = start.x + upSize.width * upS;
        }
    }
}

function SetEndOneUserUI_ningxiang(node,off)
{
	var sData=MjClient.data.sData;
	var tData=sData.tData;
	var pl=MjClient.getPlayerByIndex(off);
	node.setVisible(false);
	if(!pl)return;
	node.setVisible(true);
    setUserOfflineWinGamePanel(node,pl);
	node=node.getChildByName("head");
	var zhuangNode = node.getChildByName("zhuang");
	var tempZhuang = (typeof MjClient.preZhuang != 'undefined') ? MjClient.preZhuang : tData.zhuang;
    zhuangNode.setVisible(tData.uids[tempZhuang] == pl.info.uid);
	zhuangNode.zIndex=10;

    //add by sking
    var name = node.getChildByName("name");
    name.ignoreContentAdaptWithSize(true);

    //node.getChildByName("huaX").zIndex = 11;
    //node.getChildByName("huaIcon").zIndex = 11;
    // var huaCount = node.getChildByName("huaCount");
    // huaCount.zIndex = 11;
    // changeAtalsForLabel(huaCount, pl.mjflower.length);

    // var tingIcon = node.getChildByName("tingIcon");
    // tingIcon.zIndex = 11;
    // if (pl.isTing && (pl.mjdesc + "").indexOf("未听牌") < 0 )
    // {
    //     tingIcon.setVisible(true);
    // }
    // else
    // {
    //     tingIcon.setVisible(false);
    // }


	var uibind= {
        head_bg: {
            _run: function(){
                if(pl.winone > 0)
                {
                    this.loadTexture("gameOver/di_red.png");
                }
            }
        },
		head: {
			name: {
                _run:function()
                {
                    this.ignoreContentAdaptWithSize(true);
                    this.setFontName("Arial");
                    this.setFontSize(this.getFontSize());
                },
				_text: function () {
				    var _nameStr = unescape(pl.info.nickname ) + "";
				    //this.ignoreContentAdaptWithSize(true);
                    return getNewName (_nameStr);
				}
			},
			id: {
                _run:function()
                {
                    this.ignoreContentAdaptWithSize(true);
                },
				_text: function () {
					return "ID:" + pl.info.uid.toString();
				}
			},

			winType: {
                _run:function()
                {
                    this.ignoreContentAdaptWithSize(true);
                },
				_text: function () {
					return pl.baseWin > 0 ? ("X" + pl.baseWin) : "0";
				},
				// _run:function()
				// {
				// 	if(MjClient.gameType == MjClient.GAME_TYPE.NING_BO || MjClient.gameType == MjClient.GAME_TYPE.WEN_ZHOU)
				// 	this.setVisible(false);
				// }
			},
			up: {
				_visible: false
				, _run: function () {
					var arry = [];
					//明杠
					for (var i = 0; i < pl.mjgang0.length; i++) {

						for (var j = 0; j < 4; j++) {
							if (j == 3) {
								arry.push(getNewCard(node, "up", "gang0", pl.mjgang0[i], 0, "isgang4"))
							} else {
								arry.push(getNewCard(node, "up", "gang0", pl.mjgang0[i], 0));
							}

						}
					}

					//添加暗杠
					for (var i = 0; i < pl.mjgang1.length; i++) {

						for (var j = 0; j < 4; j++) {

							if (j == 3) {
								var card = getNewCard(node, "down", "gang1", 0, 0, "isgang4");
								card.tag = pl.mjgang1[i];
								arry.push(card);

							} else {
								arry.push(getNewCard(node, "up", "gang1", pl.mjgang1[i], 0));
							}
						}

					}
					//添加碰
					for (var i = 0; i < pl.mjpeng.length; i++) {
						for (var j = 0; j < 3; j++) {
							arry.push(getNewCard(node, "up", "peng", pl.mjpeng[i], 0));
						}
					}

					//添加吃
					for (var i = 0; i < pl.mjchi.length; i++) {

						arry.push(getNewCard(node, "up", "chi", pl.mjchi[i], 0));
					}
					//添加手牌
					for (var i = 0; i < pl.mjhand.length; i++) {

						arry.push(getNewCard(node, "up", "mjhand", pl.mjhand[i], 0));
					}

					for (var i = 0; i < arry.length; i++) {
						arry[i].visible = true;
						arry[i].enabled = false;
                        arry[i].setScale(arry[i].getScale()*1.1);
					}

					CardLayoutRestoreForEndOne_ningxiang(node, pl);

				},
			},
			down: {
				_visible: false
			},
			stand: {
				_visible: false
			},
			cardType: {
                _run:function()
                {
                    this.ignoreContentAdaptWithSize(true);
                },
				_text: function () {
					return pl.mjdesc + ""
				},
			}

		}
		, winNum: {
			_text: function () {
				var pre = "";
				if (pl.winone > 0) pre = "+";
				return pre + pl.winone;
			}
			, hu: {
				_run: function () {
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    var isCheckCount = true;
                    if(sData.players[tData.uids[tData.zhuang]].putCount == 0){
                        isCheckCount = false;
                    }
					setGameOverPanelPlayerState(this, pl, isCheckCount);
				}
			}
            , fenshu: {
                _run:function()
                {
                    this.ignoreContentAdaptWithSize(true);
                },
            },
			allScore: {
                _run:function()
                {
                    this.ignoreContentAdaptWithSize(true);
                },
                _text: function () {
                    var pre = "";
                    return pre + pl.winall;
                }
            },
            niao_card: {
                _visible: false,
                _run:function(){
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    var cards = pl.niaoCards;
                    if(cards.length == 0){
                        return ;
                    }

                    var zhongCount = pl.niaoNum;
                    var niao_count = this.getParent().getChildByName("niao_count");
                    var slotwith = this.width * this.scale;//0.05;
                    var startX = this.getParent().getChildByName("hu").x - (slotwith * cards.length + 1);

                    for(var i = 0;i < cards.length;i++)
                    {
                        var _node = this.clone();
                        _node.visible = true;
                        _node.setPosition(cc.p(startX + slotwith*i,this.y));
                        this.getParent().addChild(_node);
                        setCardSprite(_node, cards[i],0);
                        /*if (cards[i] % 10 == (off - tData.winner + tData.maxPlayer) % tData.maxPlayer + 1)
                        {
                            zhongCount++;
                        }*/
                    }

                    niao_count.visible = true;
                    niao_count.ignoreContentAdaptWithSize(true);
                    niao_count.setScale(0.8);
                    niao_count.setString("中鸟+" + zhongCount);
                    niao_count.x = startX + cards.length / 2 * slotwith;
                }
            },
		}
	}
	BindUiAndLogic(node.parent,uibind);
	if(MjClient.APP_TYPE.QXYYQP == MjClient.getAppType()|| MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ)
	{
        var pl = MjClient.getPlayerByIndex(off);
        CircularCuttingHeadImg(uibind.head._node, pl);

    }else{
        addWxHeadToEndUI(uibind.head._node,off);
    }
	//uibind.winNum._node.y=uibind.head._node.y;
}

var EndOneView_ningxiang = cc.Layer.extend({
	jsBind:{
		block: {
            _layout: [[1, 1], [0.5, 0.5], [0, 0], true],
            _event:{
            	showTableEvent:function(isShow){   
            		if(MjClient.endallui){
            			MjClient.endallui.setVisible(!isShow);
            		}
            		if(isShow){
            			this.setOpacity(0);
            		}else{
            			this.setOpacity(255 * 0.9);
            		} 
            	} 
            }
        }, 
		back:{
            _layout:[[1,1],[0.538,0.5],[-0.035,0]]
            ,_event: { 
        	showTableEvent: function(isShow){
        		this.setVisible(!isShow);
        	}
        }
		,wintitle:
		{
			_visible:function(){
				  var pl=getUIPlayer(0);
				  if(pl)
                  {
                      //playEffect("win");
                      return pl.winone >=1;
                  }
				  return false;
			}
		},losetitle:
		{
			_visible:function(){
				  var pl=getUIPlayer(0);
				  if(pl)
                  {
                      //playEffect("lose");
                      return pl.winone <0;
                  }
				  return false;
			}
		},pingju:
		{
			_visible:function(){

				  var pl=getUIPlayer(0);
				  
				  if(pl)
                  {
                      //playEffect("lose");
                      return pl.winone==0;
                  }
				  return false;
			},_run:function()
			{
				var sData = MjClient.data.sData;
				var tData = sData.tData;
                if (MjClient.isDismiss)
                {
                	if(MjClient.getAppType() == MjClient.APP_TYPE.QXYZQP || MjClient.getAppType() == MjClient.APP_TYPE.BDYZPHZ){
                		this.loadTexture("playing/paohuzi/jiesan.png");
                	}else{
                		this.loadTexture("gameOver/jiesan.png");
                	}
                }
                else if(MjClient.CheckPlayerCount(function(p){ if(p.winone==0){return true;} return false;}) == tData.maxPlayer)
				{
                	if(MjClient.getAppType() == MjClient.APP_TYPE.QXYZQP || MjClient.getAppType() == MjClient.APP_TYPE.BDYZPHZ){
                		this.loadTexture("playing/paohuzi/huangzhuang.png");
                	}else{
                		this.loadTexture("gameOver/huangzhuan_35.png");
                	}
				}

			}
		}
        ,
		share:{
			_click:function(btn,eT){
                MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Xiaojiesuanjiemian_Fenxiang", {uid:SelfUid()});
                
				MjClient.shareMultiPlatform(MjClient.systemConfig.sharePlatforms, function()
				{
					postEvent("capture_screen");
					MjClient.endoneui.capture_screen = true;
					btn.setTouchEnabled(false);
					// btn.setBright(false);
				});
			},
			_visible :function()
			{
					var tData = MjClient.data.sData.tData;
					return (!MjClient.remoteCfg.guestLogin && !tData.matchId);
			},
			_event:{
				captureScreen_OK:function(){
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
						// this.setBright(true);
					}.bind(this))));
				}
			}
		},
		ready:{
			_run:function ()
			{
				if(MjClient.remoteCfg.guestLogin)
				{
					setWgtLayout(this, [0.15, 0.15],[0.5, 0.085],[0, 0], false, true);
				}
			},
			_click:function(btn,eT)
			{
				/*
				 准备的时候花清掉
				 */
                for(var i = 0; i < 4;i++)
                {
					var pl = getUIPlayer(i)
					if (!pl)
						continue;

					if (pl.mjflower)
						pl.mjflower = [];
					if (pl.jiazhuNum)
						pl.jiazhuNum = 0;
                }

				postEvent("clearCardUI");
				MjClient.endoneui.removeFromParent(true);
                MjClient.endoneui = null;
				var sData=MjClient.data.sData;
				var tData=sData.tData;
                if (MjClient.rePlayVideo >= 0 && MjClient.replayui) {
                    MjClient.replayui.replayEnd();
                }
                else {
                    MjClient.MJPass2NetForningxiang();
                }

				if (MjClient.endallui)
				{
					MjClient.endallui.setVisible(true);
				}
				
				if(MjClient.playui && MjClient.playui.jsBind.eat.kaiGangKuang._node){
					MjClient.playui.jsBind.eat.kaiGangKuang._node.visible = false;
				}
				reInitarrCardVisible();
			},
			_visible :function()
			{
					var tData = MjClient.data.sData.tData;
					return !tData.matchId;
			}
		},
		info: // 左上角
		{
			_visible:true,
			_text: function () {
				return getPlayingRoomInfo(5);
			}
		},
		dir:  // 右下角
		{
			_visible:true,
			_text: function () {
				var tData = MjClient.data.sData.tData;
				return getPlayingRoomInfo(0);
			}
		},
		head0:{
			head:{
				zhuang:{_visible:false}
			},
		    winNum:{
			},
		   _run:function(){ SetEndOneUserUI_ningxiang(this,0); },
		   
		}
		,head1:{ 
		   head:{
			   zhuang:{_visible:false}
		   },
	       winNum:{
			   // _layout:[[0.08,0.08],[1,0.5],[-2.5,0.75]]
		   },
		  _run:function(){ SetEndOneUserUI_ningxiang(this,1); }
		}
		
		,head2:{ 
		   head:{
			   zhuang:{_visible:false}
		   },
	       winNum:{
			   // _layout:[[0.08,0.08],[1,0.5],[-2.5,-0.75]]
		   },
		   _run:function(){ SetEndOneUserUI_ningxiang(this,2); }
		}
		,head3:{
			 head:
			 {
				zhuang:{_visible:false}
			 },
			 winNum:{
				 // _layout:[[0.08,0.08],[1,0.5],[-2.5,-2.25]]
			 },
			_run:function(){ SetEndOneUserUI_ningxiang(this,3); }
			},
            count_down:{
                _visible :function()
                {
                    var tData = MjClient.data.sData.tData;
                    return tData.matchId;
                },
                _run:function()
				{
                    schedulLoadTexture(this);
				}
			}
		},

	},
    ctor:function () {
        this._super();
        var endoneui = ccs.load("endOne_ningxiang.json");
		BindUiAndLogic(endoneui.node,this.jsBind);
        this.addChild(endoneui.node);
        
        var _dir = endoneui.node.getChildByName("back").getChildByName("dir");
        //_dir.ignoreContentAdaptWithSize(true);
        //时间
        var _back = endoneui.node.getChildByName("back");
        var _time =  _back.getChildByName("time");
        _time.visible = true;
        //function _setTime()
        //{
        //    var time = MjClient.getCurrentTime();
        //    var str = " " + time[0] + "-" + time[1] + "-" + time[2] + " " + time[3] + ":" + time[4] + ":" + time[5];
        //    cc.log("str time =  " + str);
        //    return str;
        //}
        _time.setString(MjClient.roundEndTime);

		MjClient.endoneui=this;

		changeMJBg(this, getCurrentMJBgType());

		COMMON_UI.showMjWinGamePanelDiPai(_back);

        //显示抓鸟的牌
        var _Image_niao = _back.getChildByName("Image_niao");
        var sData = MjClient.data.sData;
        var tData = sData.tData;
        var cards = tData.mopai;
        var cardnode = _Image_niao.getChildByName("niao_card");
        var countNode = _Image_niao.getChildByName("niao_count");
        cardnode.visible = false;
        var slotwith = cardnode.width * cardnode.scale * 0.9;//0.05;

		var zhongCount = 0;
        for(var i = 0;i < cards.length;i++)
        {
            var _node = cardnode.clone();
            _node.visible = true;
            _node.setPosition(cc.p(cardnode.x + slotwith*i,cardnode.y));
            _Image_niao.addChild(_node);
            setCardSprite(_node, cards[i],0);
            // if (cards[i] % 10 % tData.maxPlayer == 1)
            // {
            //     zhongCount++;
            // }else{
            // 	_node.setColor(cc.color(170,170,170));
            // }
        }

        if(zhongCount == 0){
        	countNode.setVisible(false);
        }else{
        	var pos = cc.p(cardnode.x + slotwith * cards.length  - slotwith/2, cardnode.y);
        	countNode.setPosition(pos);
        	countNode.setString("+" + zhongCount);
         
        	if(MjClient.getAppType() != MjClient.APP_TYPE.HUNANWANGWANG && MjClient.APP_TYPE.QXSYDTZ != MjClient.getAppType() && cards.length >= 6){
        		var shareBtn = _back.getChildByName("share");
        		var sharePos = shareBtn.getPosition();
        		shareBtn.setPosition(cc.p(sharePos.x + 50,sharePos.y));
        		var readyBtn = _back.getChildByName("ready");
        		var readyPos = readyBtn.getPosition();
        		readyBtn.setPosition(cc.p(readyPos.x + 50,readyPos.y));
        	}
        }

        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType()){
		 	var sy_jsBind = {  
	            closeTableBtn:{ 
		        	_run: function(){
		        		setWgtLayout(this, [0.15, 0.15],[0.5, 0.5],[0, 0]); 
		        	},
		        	_click:function(btn,eT){ 
						postEvent("showTableEvent",false);
					},
					_event:{
						showTableEvent:function(isShow){ 
		            		this.setVisible(isShow);
		            	} 
					} 
		        } 
	        };
	        BindUiAndLogic(endoneui.node, sy_jsBind);   
	        // _back 
	        var btn_jsBind = {
	        	showTable: { // 显示桌面按钮
					_click:function(btn,eT){ 
						postEvent("showTableEvent",true);
					}
				},
	        }
	        BindUiAndLogic(_back, btn_jsBind);    
		}else{
			_back.getChildByName("showTable").visible = false;
		}
        

 		return true;
    }
});