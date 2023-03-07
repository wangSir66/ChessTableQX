function SetEndOneUserUI_TYHZ (node, off) {
	var sData=MjClient.data.sData;
	var tData=sData.tData;
	var pl=MjClient.getPlayerByIndex(off);
	node.setVisible(false);
	if(!pl)return;
	node.setVisible(true);
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

					CardLayoutRestoreForEndOne(node, pl);

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
					setGameOverPanelPlayerState(this, pl, true);
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
            }
		}
	}
	BindUiAndLogic(node.parent,uibind);
	if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType())
	{
        var pl = MjClient.getPlayerByIndex(off);
        CircularCuttingHeadImg(uibind.head._node, pl);
        setUserOfflineWinGamePanel(node.parent,pl);
    }else{
        addWxHeadToEndUI(uibind.head._node,off);
    }
	//uibind.winNum._node.y=uibind.head._node.y;
}

var EndOneView_TYHZ = cc.Layer.extend({
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
			// _layout:[[1,1],[0.538,0.5],[-0.035,0]]
            _run:function()
            {
                if(isIPhoneX() && MjClient.getAppType() == MjClient.APP_TYPE.QXYZQP)
                    setWgtLayout(this, [0.85,0.85],[0.5,0.5],[0,0], false);
                else
                    setWgtLayout(this, [1,1],[0.5,0.5],[0,0], false);
            }
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
                	if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ){
                		//if(!MjClient.endallui){
                			MjClient.replayui.replayEnd();
                		//}
                	}else{
                		MjClient.replayui.replayEnd();
                	}
                }
                else {
                    MjClient.MJPass2NetForTYHZ();
                }

				if (MjClient.endallui)
				{
					MjClient.endallui.setVisible(true);
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
		dir:
		{
			_visible:true,
            _run:function(){
                // this.ignoreContentAdaptWithSize(true);
            },
			_text: function () {
				var sData=MjClient.data.sData;
				var tData=sData.tData;
				var text = "";
				text += "红中麻将";
                //var strZaiMo = "";
                var str = "";
                switch (tData.areaSelectMode.zhuaniao)
                {
                    case 1:
                        str += "一鸟全中"
                        break;
                    case 2:
                        str += "2鸟"
                        break;
                    case 4:
                        str += "4鸟"
                        break;
                    case 6:
                        str += "6鸟"
                        break;
                    case 8:
                        str += "一鸟全中(1算10)"
                        break;  
                    case 9:
                        str += "摸几奖几"
                        break;            
                    default:
                        break;
                }
                str += tData.areaSelectMode.bihuType ? ",有胡必胡" : "";
                str += tData.areaSelectMode.zhuangxianfen ? ",庄闲分":"";
                str += tData.areaSelectMode.dianpao ? ",点炮胡":"";
                var huType = tData.areaSelectMode.qianggang;
                str += huType == 1 ? ",抢杠算自摸":huType == 2?",抢杠算点炮":",无";
                str += huType == 1 && tData.areaSelectMode.qianggangquanbao ? ",抢杠全包":"";
                str += huType != 0 && tData.areaSelectMode.wuhongzhong ? ",有红中可抢杠胡":"";
                if(tData.areaSelectMode.appType && tData.areaSelectMode.appType == 11){
                    var cfg = {"4": ",4红中","8": ",8红中","1": ",翻癞子","2": ",双癞子",};
                    str += cfg[tData.areaSelectMode.hongzhong8];
                }else{
                    str += tData.areaSelectMode.hongzhong8 ? ",8红中":"";
                }
                str += tData.areaSelectMode.qidui ? ",七对可胡":"";
                if(tData.areaSelectMode.appType && tData.areaSelectMode.appType == 11){
                    str += tData.areaSelectMode.youhongzhongbujiepao ? ",有癞子不接炮":"";
                    str += tData.areaSelectMode.wuhongzhongjiabei ? ",无癞子加倍":"";
                }else{
                    str += tData.areaSelectMode.youhongzhongbujiepao ? ",有红中不接炮":"";
                    str += tData.areaSelectMode.wuhongzhongjiabei ? ",无红中加倍":"";
                }
                if (tData.areaSelectMode.zhuaniao != 0 && ((tData.areaSelectMode.zhuaniao != 1 &&
                	tData.areaSelectMode.zhuaniao != 8) || MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ))
                {
                    if (tData.areaSelectMode.niaofen == 1) str += ",中鸟1分";
                    if (tData.areaSelectMode.niaofen == 2) str += ",中鸟2分";
                }

                str += tData.areaSelectMode.queYiMen ? ",缺一门":"";
                str += tData.areaSelectMode.zuoZhuang == 1 ? ",先进房坐庄":",随机坐庄";
                text += str;
                if(MjClient.getAppType() != MjClient.APP_TYPE.HUNANWANGWANG && MjClient.getAppType() != MjClient.APP_TYPE.QXSYDTZ){
                	text += (",房间号:" + tData.tableid);
                }else{ 
                	var textPiaoFen = function(){
                		if(tData.areaSelectMode.piaoType == 4)
				            return ",自由下飘";
				        if(!tData.areaSelectMode.jiapiao && tData.areaSelectMode.piaoType < 3)
				            return ",飘"+ (tData.areaSelectMode.piaoType + 1) + "分";

				        return tData.areaSelectMode.jiapiao ? ",飘分" : ""
                	}

                	text += textPiaoFen();

                	text += tData.areaSelectMode.buzhongsuanquanzhong ? ",不中算全中" : "";
                	text += tData.areaSelectMode.quanzhongfanbei ? ",全中翻倍" : "";
                	text += tData.areaSelectMode.wuhongzhongjia2niao ? ",无赖子加2鸟" : "";
                	text += tData.areaSelectMode.diFen > 0 ? ",低于" + tData.areaSelectMode.diFen + "翻倍" : ""; 
                	text += tData.areaSelectMode.hongZhongKeHu ? ",4红中可起手胡" : "";
                	text += tData.areaSelectMode.duoHu ? ",一炮多响" : "";
                	text += tData.areaSelectMode.huTypeJia1Fen ? ",胡7对、碰碰胡、天胡、清一色+1分" : "";
                	text += tData.areaSelectMode.jieSuanDiFen != 1 ? ",积分底分x" + tData.areaSelectMode.jieSuanDiFen : "";
                	text += tData.areaSelectMode.suiShiKeGang ? ",随时可杠" : "";
                }

				
				if(MjClient.getAppType() != MjClient.APP_TYPE.HUNANWANGWANG && MjClient.getAppType() != MjClient.APP_TYPE.QXYZQP && MjClient.getAppType() != MjClient.APP_TYPE.QXSYDTZ
				 && MjClient.getAppType() != MjClient.APP_TYPE.BDYZPHZ){
					text = getNewName(text,30);
				}
				return text;
			}
		},
		head0:{
			head:{
				zhuang:{_visible:false}
			},
		    winNum:{
			},
		   _run:function(){ SetEndOneUserUI_TYHZ(this,0); },
		   
		}
		,head1:{ 
		   head:{
			   zhuang:{_visible:false}
		   },
	       winNum:{
			   // _layout:[[0.08,0.08],[1,0.5],[-2.5,0.75]]
		   },
		  _run:function(){ SetEndOneUserUI_TYHZ(this,1); }
		}
		
		,head2:{ 
		   head:{
			   zhuang:{_visible:false}
		   },
	       winNum:{
			   // _layout:[[0.08,0.08],[1,0.5],[-2.5,-0.75]]
		   },
		   _run:function(){ SetEndOneUserUI_TYHZ(this,2); }
		}
		,head3:{
			 head:
			 {
				zhuang:{_visible:false}
			 },
			 winNum:{
				 // _layout:[[0.08,0.08],[1,0.5],[-2.5,-2.25]]
			 },
			_run:function(){ SetEndOneUserUI_TYHZ(this,3); }
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
        var endoneui = ccs.load("endOne_TYHZ.json");
		BindUiAndLogic(endoneui.node,this.jsBind);
        this.addChild(endoneui.node);

        if(MjClient.getAppType() != MjClient.APP_TYPE.QXYZQP && 
        	MjClient.getAppType() != MjClient.APP_TYPE.BDYZPHZ &&
            MjClient.getAppType() != MjClient.APP_TYPE.HUNANWANGWANG &&
            MjClient.getAppType() != MjClient.APP_TYPE.QXSYDTZ){
	        var _dir = endoneui.node.getChildByName("back").getChildByName("dir");
	        _dir.ignoreContentAdaptWithSize(true);
        }
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
        var cardnode = null;
        var listView = null;//
        if(MjClient.getAppType() != MjClient.APP_TYPE.HUNANWANGWANG && MjClient.APP_TYPE.QXSYDTZ != MjClient.getAppType() ){
        	cardnode = _Image_niao.getChildByName("niao_card");
        }else{
        	listView = _back.getChildByName("listview_niao");
        	cardnode = _Image_niao.getChildByName("niao_item");
        }

        var countNode = _Image_niao.getChildByName("niao_count");
        cardnode.visible = false;
        var slotwith = cardnode.width * cardnode.scale * 0.9;//0.05;

		var zhongCount = 0;
        for(var i = 0;i < cards.length;i++)
        {
            var _node = cardnode.clone();
            _node.visible = true;
            if(MjClient.getAppType() != MjClient.APP_TYPE.HUNANWANGWANG && MjClient.APP_TYPE.QXSYDTZ != MjClient.getAppType() ){
            	_node.setPosition(cc.p(cardnode.x + slotwith*i,cardnode.y));
            	_Image_niao.addChild(_node);
            	setCardSprite(_node, cards[i],0);
            }else{
            	listView.pushBackCustomItem(_node);
            	setCardSprite(_node.getChildByName("niao_card"), cards[i],0);
            }
            
            
            var isHunCard = MjClient.majiang.isHunCard(cards[i], tData.hunCard);
            if (cards[i] == 71 || 
            	(cards[i] <= 29 && cards[i] % 10 == 1 || cards[i] % 10 == 5 || cards[i] % 10 == 9))
            {
                zhongCount++;
            }else{
            	_node.setColor(cc.color(170,170,170));
            }
        }
        if(listView)
        	listView.forceDoLayout();

        if(zhongCount == 0){
        	countNode.setVisible(false);
        }else{
        	if(MjClient.getAppType() != MjClient.APP_TYPE.HUNANWANGWANG && MjClient.APP_TYPE.QXSYDTZ != MjClient.getAppType() ){
        		var pos = cc.p( (cards.length * slotwith) , countNode.y);
        		countNode.setPosition(pos);
        	}
        	countNode.setString("+" + zhongCount);
         
        	if((MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType()) && cards.length >= 6){
        		var shareBtn = _back.getChildByName("share");
        		var sharePos = shareBtn.getPosition();
        		shareBtn.setPosition(cc.p(sharePos.x + 50,sharePos.y));
        		var readyBtn = _back.getChildByName("ready");
        		var readyPos = readyBtn.getPosition();
        		readyBtn.setPosition(cc.p(readyPos.x + 50,readyPos.y));
        	}
        }

        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() === MjClient.APP_TYPE.QXSYDTZ){
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
		}
        

 		return true;
    }
});