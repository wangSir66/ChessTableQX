

function SetEndOneUserUI_huaihuaMaJiang(node,off)
{
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

					CardLayoutRestoreForEndOne_qxsydtz(node, pl);

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
            }
		}
	}
	BindUiAndLogic(node.parent,uibind);
	if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType())
	{
        var pl = MjClient.getPlayerByIndex(off);
        CircularCuttingHeadImg(uibind.head._node, pl);

    }else{
        addWxHeadToEndUI(uibind.head._node,off);
    }
    setUserOfflineWinGamePanel(node.parent,pl);
	//uibind.winNum._node.y=uibind.head._node.y;
}

var EndOneView_huaihuaMaJiang = cc.Layer.extend({
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
                    MjClient.MJPass2NetForhuaihuaMaJiang();
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
				//text += "怀化麻将";
				
                var str = "";
                str += tData.areaSelectMode.huType == 1 ? "自摸胡" : "接炮胡"; 
                str += tData.areaSelectMode.xiaohubudianpao ? ",小胡不可接炮" : "";
                str += tData.areaSelectMode.sihongzhong     ? ",四红中" : ""; //四红中 选择为true否则为false
                str += tData.areaSelectMode.tianhu          ? ",天胡"   : ""; //天胡   选择为true否则为false
                str += tData.areaSelectMode.dihu            ? ",地胡"   : ""; //地胡   选择为true否则为false
                str += tData.areaSelectMode.banbanhu        ? ",板板胡" : ""; //板板胡 选择为true否则为false
                str += tData.areaSelectMode.yitiaolong      ? ",一条龙" : ""; //一条龙 选择为true否则为false
                str += tData.areaSelectMode.longqidui       ? ",龙七对" : ""; //龙七对 选择为true否则为false
                str += tData.areaSelectMode.siguiyi         ? ",四归一" : ""; //四归一 选择为true否则为false
                str += tData.areaSelectMode.jiangjianghu    ? ",将将胡" : ""; //将将胡 选择为true否则为false
                str += tData.areaSelectMode.queyise         ? ",缺一色" : ""; //缺一色 选择为true否则为false
                switch (tData.areaSelectMode.zhuaniaotype)
                {
                    case 0:
                        str += ",不抓鸟"
                        break;
                    case 1:
                        str += ",抓1鸟"
                        break;
                    case 2:
                        str += ",抓2鸟"
                        break;
                    case 3:
                        str += ",抓3鸟"
                        break;
                    default:
                        break;
                }
                str += tData.areaSelectMode.zhuaniaovalue   ? ",159抓鸟"  : "";  //159抓鸟 选中为true否则为false
                str += tData.areaSelectMode.keganghu        ? tData.areaSelectMode.qiangGangQuanBao ? ",抢杠全包" : ",可抢杠胡" : "";  //可抢杠胡 选择为true否则为false
                str += tData.areaSelectMode.qiShou14        ? ",起手胡14张" : "";  //起手胡14张     选择为true否则为false
                str += tData.areaSelectMode.baogang         ? ",包杠"     : "";  //包杠     选择为true否则为false
                str += tData.areaSelectMode.touhougang      ? ",骰后杠"   : "";  //骰后杠   选择为true否则为false
                str += tData.areaSelectMode.huanggangzhuang ? ",荒庄荒杠" : "";  //荒庄荒杠 选择为true否则为false

                if(tData.areaSelectMode.jieSuanDiFen){
                    var difen = tData.areaSelectMode.jieSuanDiFen;
                    str += difen != 1 ? ",积分底分x" + difen : "";
                }
                str += tData.areaSelectMode.fanBei == 0 ? "/不翻倍" : "/低于" + tData.areaSelectMode.fanBeiScore + "分翻倍";
             
                text += str;
				//text = getNewName(text,30);

				return text;
			}
		},
		head0:{
			head:{
				zhuang:{_visible:false}
			},
		    winNum:{
			},
		   _run:function(){ SetEndOneUserUI_huaihuaMaJiang(this,0); },
		   
		}
		,head1:{ 
		   head:{
			   zhuang:{_visible:false}
		   },
	       winNum:{
			   // _layout:[[0.08,0.08],[1,0.5],[-2.5,0.75]]
		   },
		  _run:function(){ SetEndOneUserUI_huaihuaMaJiang(this,1); }
		}
		
		,head2:{ 
		   head:{
			   zhuang:{_visible:false}
		   },
	       winNum:{
			   // _layout:[[0.08,0.08],[1,0.5],[-2.5,-0.75]]
		   },
		   _run:function(){ SetEndOneUserUI_huaihuaMaJiang(this,2); }
		}
		,head3:{
			 head:
			 {
				zhuang:{_visible:false}
			 },
			 winNum:{
				 // _layout:[[0.08,0.08],[1,0.5],[-2.5,-2.25]]
			 },
			_run:function(){ SetEndOneUserUI_huaihuaMaJiang(this,3); }
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
		this.zIndex = MjClient.playui.getTuoGuanLayerZIndex() - 1;
        var endoneui = ccs.load("endOne_huaihuaMaJiang.json");
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
            // if (cards[i] == 31 || cards[i] == 71 || 
            // 	(cards[i] <= 29 && cards[i] % 10 == 1 || cards[i] % 10 == 5 || cards[i] % 10 == 9))
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