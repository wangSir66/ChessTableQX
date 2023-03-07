

function SetEndOneUserUI_leiyangGMJ(node,off)
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

	var uibind= {
		head_bg: {
            _run: function(){
                if(pl.winone > 0 && 
                	(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXLYQP || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ))
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
			},
			jiaZhu: {
				_run:function()
				{
					this.visible = pl.jiazhuNum > 0;
				}
			}

		}
		, winNum: {
			_run:function()
            {	
            	if(MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP){
            		this.ignoreContentAdaptWithSize(true);
            		if(pl.winone < 0){
	                    this.setProperty(pl.winone, "ui/common/fufen.png", 40, 53, "+");
	                }
            	}
            },
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
            }
		}
	}
	BindUiAndLogic(node.parent,uibind);
	if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.APP_TYPE.QXLYQP == MjClient.getAppType() || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ)
	{
        var pl = MjClient.getPlayerByIndex(off);
        CircularCuttingHeadImg(uibind.head._node, pl);

    }else{
        addWxHeadToEndUI(uibind.head._node,off);
    }
	//uibind.winNum._node.y=uibind.head._node.y;
}

var EndOneView_leiyangGMJ = cc.Layer.extend({
	jsBind:{
		block: {
			_layout: [[1, 1], [0.5, 0.5], [0, 0], true]
		},
		back:{
            _layout:[[1,1],[0.5,0.5],[0,0]]
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
                    this.loadTexture("gameOver/jiesan.png");
                }
                else if(MjClient.CheckPlayerCount(function(p){ if(p.winone==0){return true;} return false;}) == tData.maxPlayer)
				{
					this.loadTexture("gameOver/huangzhuan_36_MJ.png");
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
			}
			,_event:{
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
			},
			_visible :function()
			{
					var tData = MjClient.data.sData.tData;
					return (!MjClient.remoteCfg.guestLogin && !tData.matchId);
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
				 准备的时候花、加注数清掉
				 */
                for(var i = 0; i < MjClient.MaxPlayerNum;i++)
                {
                    var pl = getUIPlayer(getOffForPlayerNum(i))
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
                    MjClient.MJPass2NetForleiyangGMJ();
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
                if(MjClient.getAppType() != MjClient.APP_TYPE.HUNANWANGWANG && MjClient.getAppType() != MjClient.APP_TYPE.QXLYQP && MjClient.getAppType() != MjClient.APP_TYPE.QXSYDTZ){
					this.ignoreContentAdaptWithSize(true);
				}
            },
			_text: function () {
				var sData=MjClient.data.sData;
				var tData=sData.tData;

				var str = GameCnName[MjClient.gameType] + ",";

				str += tData.areaSelectMode.guipaiType == 0 ? "翻鬼," : tData.areaSelectMode.guipaiType == 1 ? "红中鬼," : "上下鬼,";

		        switch (tData.areaSelectMode.zhuaniaoNum)
		        {
		            case 1:
		                str += "一鸟全中,";
		                break;
		            case 2:
		                str += "2鸟,";
		                break;
		            case 4:
		                str += "4鸟,";
		                break;
		            case 6:
		                str += "6鸟,";
		                break;
		        }

		        switch (tData.areaSelectMode.shaguiType)
		        {
	                case 0:
	                    str += "不杀鬼,";
	                    break;
	                case 1:
	                    str += "杀鬼翻番,";
	                    break;
	                case 2:
	                    str += "杀鬼加5分,";
	                    break;
		        }
		        switch (tData.areaSelectMode.wuguiType)
		        {
		            case 0:
		                str += "";
		                break;
		            case 1:
		                str += "无鬼翻2倍,";
		                break;
		            case 2:
		                str += "无鬼翻3倍,";
		                break;
		        }

		        if (tData.areaSelectMode.isQishouhu)
            		str += "四鬼起手胡,";

        		if (tData.areaSelectMode.isQiangganghu)
            		str += tData.areaSelectMode.isQianggangquanbao ? "抢杠全包," : "抢杠胡,";

            	if (tData.areaSelectMode.diFen > 0)
            		str += "低于" + tData.areaSelectMode.diFen + "分翻倍,";

            	if (tData.areaSelectMode.jieSuanDiFen != 1)
            		str += "积分底分x" + tData.areaSelectMode.jieSuanDiFen + ",";

				var text = str;
				if(MjClient.getAppType() != MjClient.APP_TYPE.HUNANWANGWANG && MjClient.getAppType() != MjClient.APP_TYPE.QXLYQP && MjClient.getAppType() != MjClient.APP_TYPE.QXSYDTZ){
					text += ("房间号:" + tData.tableid);
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
		   _run:function(){ SetEndOneUserUI_leiyangGMJ(this,0); },
		   
		}
		,head1:{ 
		   head:{
			   zhuang:{_visible:false}
		   },
	       winNum:{
			   // _layout:[[0.08,0.08],[1,0.5],[-2.5,0.75]]
		   },
		  _run:function(){ SetEndOneUserUI_leiyangGMJ(this,1); }
		}
		
		,head2:{ 
		   head:{
			   zhuang:{_visible:false}
		   },
	       winNum:{
			   // _layout:[[0.08,0.08],[1,0.5],[-2.5,-0.75]]
		   },
		   _run:function(){ SetEndOneUserUI_leiyangGMJ(this,2); }
		}
		,head3:{
			 head:
			 {
				zhuang:{_visible:false}
			 },
			 winNum:{
				 // _layout:[[0.08,0.08],[1,0.5],[-2.5,-2.25]]
			 },
			_run:function(){ SetEndOneUserUI_leiyangGMJ(this,3); }
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
        //_event:{
        //    captureScreen_OK:function(){
			//	if (MjClient.endoneui.capture_screen != true)
			//		return;
        //
			//	var writePath = jsb.fileUtils.getWritablePath();
			//	var textrueName = "wxcapture_screen.png";
			//	var savepath = writePath+textrueName;
			//	MjClient.shareImageToMultiPlatform(savepath);
        //    }
        //}
	},
    ctor:function () {
        this._super();
        var endoneui = ccs.load("endOne_leiyangGMJ.json");
		BindUiAndLogic(endoneui.node,this.jsBind);
        this.addChild(endoneui.node);

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

        //显示抓鸟的牌
        var _Image_niao = _back.getChildByName("Image_niao");
        var sData = MjClient.data.sData;
        var tData = sData.tData;
        var cards = tData.mopai;
        for(var off = 0;off <4;off++)
        {
            var pl = getUIPlayer(off);
            if(pl &&  pl.mopai && pl.mopai.length > 0)
            {
                cards = pl.mopai;
                break;
            }
        }
        var cardnode = _Image_niao.getChildByName("niao_card");
        var countNode = _Image_niao.getChildByName("niao_count");
        cardnode.visible = false;
        var slotwith = cardnode.width * cardnode.scale * 1;//0.05;
        //var slotheigt = upSize.height * upS * 0.3;
        //cards = [1,2,3];//todo test code
        if(!cards || cc.isUndefined(cards) || cards.length <= 0 ){
            cards = [];
		}
		var zhongCount = 0;
        for(var i = 0;i < cards.length;i++)
        {
            var _node = cardnode.clone();
            _node.visible = true;
            _node.setPosition(cc.p(cardnode.x + slotwith*i,cardnode.y));
            _Image_niao.addChild(_node);
            setCardSprite(_node, cards[i],0);

            if (tData.areaSelectMode.zhuaniaoNum == 1) {
            	zhongCount = cards[i] == tData.hunCard ? 9 : cards[i] % 10;
            	continue;
            }

            if (cards[i] == tData.hunCard || [1, 5, 9].indexOf(cards[i] % 10) >= 0) {
            	zhongCount++;
            	continue;
            }
            
            _node.setColor(cc.color(170,170,170));
        }

        if(zhongCount == 0){
        	countNode.setVisible(false);
        }else{
        	var pos = cc.p(cardnode.x + slotwith * cards.length  - slotwith/2, cardnode.y);
        	countNode.setPosition(pos);
        	countNode.setString("+" + zhongCount);
        }

 		return true;
    }
});