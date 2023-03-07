

function SetEndOneUserUI_daozhouMJ(node,off)
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
			},
			up: {
				_visible: false, 
				_run: function () {
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
					if (pl.mjhand){
						for (var i = 0; i < pl.mjhand.length; i++) {

							arry.push(getNewCard(node, "up", "mjhand", pl.mjhand[i], 0));
						}
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
				_visible:function(){
					if(!MjClient.isDismiss){
						return true;
					}
					return false;
				},
                _run:function()
                {
                    this.ignoreContentAdaptWithSize(true);
                },
				_text: function () {
					return pl.mjdesc.length > 0?pl.mjdesc + "":"";
				},
			},
			// cardTypeHuang: {
			// 	_visible:function(){
			// 		if(tData.winner == -1 && !MjClient.isDismiss){
			// 			cc.log("cardTypeHuang show!!!!!!!!!!!!!");
			// 			return true;
			// 		}
			// 		return false;
			// 	},
			// 	_run:function()
			// 	{
			// 		cc.log("===========================================::::::::::::::");
			// 		this.ignoreContentAdaptWithSize(true);
			// 	},
			// 	_text:function()
			// 	{
			// 		return pl.mjdesc + "";
			// 	}
			// },
			jiaZhu: {
				_run:function()
				{
					this.visible = pl.jiazhuNum > 0;
				}
			}

		}, 
		winNum: {
			_text: function () {
				var pre = "";
				if (pl.winone > 0) pre = "+";
				return pre + pl.winone;
			},
			fenshu_bg: {
				_visible:function(){
					if(tData.winner == -1 && !MjClient.isDismiss){
						return false;
					}
					return false;
				}
			},
			hu: {
				_visible:function(){
					if(tData.winner == -1 && !MjClient.isDismiss){
						return false;
					}
					return true;
				},
				_run: function () {
					setGameOverPanelPlayerState(this, pl, true);
				}
			}, 
			fenshu: {
				_visible:function(){
					if(tData.winner == -1 && !MjClient.isDismiss){
						return false;
					}
					return false;
				},
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
                    // 计算当前总分
                    // var winScore = 0;
                    // var tableMsg = pl.roomStatistics;
                    // if(!tableMsg)
                    // {
                    //     tableMsg = [0,0,0,0,0];
                    // }
                    // for(var i = 0;i < tableMsg.length;i++)
                    // {
                    //     winScore += tableMsg[i];
                    //     // 精度修正
                    //     winScore = revise(winScore);
                    // }

                    var pre = "";
                    // if (winScore > 0) pre = "+";
                    return pre + pl.winall;
                }
            }
		}
	};
	BindUiAndLogic(node.parent,uibind);
	addWxHeadToEndUI(uibind.head._node,off);
	//uibind.winNum._node.y=uibind.head._node.y;
}

var EndOneView_WangDiaoMJ = cc.Layer.extend({
	jsBind:{
		block: {
			_layout: [[1, 1], [0.5, 0.5], [0, 0], true]
		},
		back:{
            _run:function()
            {
                if(isIPhoneX())
                    setWgtLayout(this, [0.85,0.85],[0.5,0.5],[0,0], false);
                else
                    setWgtLayout(this, [1,1],[0.5,0.5],[0,0], false);
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
				this.loadTexture("gameOver/pingju_03.png");
                if (MjClient.isDismiss)
                {
                    this.loadTexture("playing/paohuzi/jiesan.png");
                }
                else if(tData.winner == -1){
                	this.loadTexture("playing/paohuzi/huangzhuang.png");
                }
    //             else if(MjClient.CheckPlayerCount(function(p){ if(p.winone==0){return true;} return false;}) == tData.maxPlayer)
				// {
					
				// }

			}
		}
        ,
		share:{
			// _run: function(){
			// 	setWgtLayout(this, [0.15, 0.15],[0.65, 0.15],[0, 0], false, true);

			// },
			_click:function(btn,eT){
				MjClient.shareMultiPlatform(MjClient.systemConfig.sharePlatforms, function()
				{
					postEvent("capture_screen");
					MjClient.endoneui.capture_screen = true;
					btn.setTouchEnabled(false);
				});
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
			 	if(MjClient.remoteCfg.guestLogin){
			 		setWgtLayout(this, [0.15, 0.15],[0.85, 0.15],[0, 0], false, true);
			 	}
			},
			_click:function(btn,eT)
			{
				/*
				 准备的时候花、加注数清掉
				 */
                for(var i = 0; i < MjClient.MaxPlayerNum;i++)
                {
                    var pl = getUIPlayer(getOffForPlayerNum(i));
                    if(!pl){
                    	continue;
                    }
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
                    MjClient.MJPass2NetForWangDiaoMJ();
                }
				reInitarrCardVisible();
				},
				_visible :function()
				{
					var tData = MjClient.data.sData.tData;
					return !tData.matchId;
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

				var str = GameCnName[MjClient.gameType] + ",";

				 switch (tData.areaSelectMode.payWay)
	            {
	                case 0:
	                    str += "房主付,";
	                    break;
	                case 1:
	                    str += "AA付,";
	                    break;
	                case 2:
	                    str += "亲友圈付,";
	                    break;
	            }

				str += tData.areaSelectMode.maxPlayer + "人场,"
		        switch (tData.areaSelectMode.maPai)
		        {
		            case 0:
		                str += "数字码,";
		                break;
		            case 4:
		                str += "4码,";
		                break;
		            case 6:
		                str += "6码,";
		                break;
		            case 8:
		            	str += "8码,";
		                break;
		        } 

		        if(tData.areaSelectMode.isQiangGangHu)
		        	str += "抢杠胡,";
		        if(tData.areaSelectMode.isLiangPian)
		        	str += "两片,";
		        if(tData.areaSelectMode.wuTong)
		        	str += "无筒,";
		        if(tData.areaSelectMode.qidui){
		            str += "七对可胡,";
		        }
		        if(tData.areaSelectMode.zhuangxianfen){
		            str += "庄闲分,";
		        }
		        if(tData.areaSelectMode.pengpenghu){
		            str += "碰碰胡,";
		        }
		        if(tData.areaSelectMode.isErfen){
		            str += "底分2分,";
		        }

        		str += tData.areaSelectMode.jieSuanDiFen && tData.areaSelectMode.jieSuanDiFen > 0 ? "积分底分" + tData.areaSelectMode.jieSuanDiFen + "," : ""; 
		  
				var text = str;
				text += ("房间号:" + tData.tableid);
				return text;
			}
		},
		dir_0: {
			_visible:false,
			_text: function () {
				// 晋中换皮，房间信息显示根据"#"拆分，by 江崇伟
				var arr = getPlayingRoomInfo(3).split("#");
				var str2 = arr[0];
				return (str2);
			}
		},
		oneScore_title: {
			_run:function(){
				this.ignoreContentAdaptWithSize(true);
			},
		},
		allScore_title: {
			_run:function(){
				this.ignoreContentAdaptWithSize(true);
			},
		},
		head0:{
			head:{
				zhuang:{_visible:false}
			},
		    winNum:{
			},
		   _run:function(){ SetEndOneUserUI_daozhouMJ(this,0); },
		   
		}
		,head1:{ 
		   head:{
			   zhuang:{_visible:false}
		   },
	       winNum:{
			   // _layout:[[0.08,0.08],[1,0.5],[-2.5,0.75]]
		   },
		  _run:function(){ SetEndOneUserUI_daozhouMJ(this,1); }
		}
		
		,head2:{ 
		   head:{
			   zhuang:{_visible:false}
		   },
	       winNum:{
			   // _layout:[[0.08,0.08],[1,0.5],[-2.5,-0.75]]
		   },
		   _run:function(){ SetEndOneUserUI_daozhouMJ(this,2); }
		}
		,head3:{
			 head:
			 {
				zhuang:{_visible:false}
			 },
			 winNum:{
				 // _layout:[[0.08,0.08],[1,0.5],[-2.5,-2.25]]
			 },
			_run:function(){ SetEndOneUserUI_daozhouMJ(this,3); }
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
        var endoneui = ccs.load("endOne_WDMJ.json");
		BindUiAndLogic(endoneui.node,this.jsBind);
        this.addChild(endoneui.node);

        // var _dir = endoneui.node.getChildByName("back").getChildByName("dir");
        // _dir.ignoreContentAdaptWithSize(true);
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

 

        //显示抓码的牌
        var _Image_niao = _back.getChildByName("Image_niao");
        _Image_niao.visible = false; 
        _Image_niao.loadTexture("gameOver/zhuama.png");
       
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
        cardnode.visible = true;
        var slotwith = cardnode.width * cardnode.scale * 1;//0.05;
        //var slotheigt = upSize.height * upS * 0.3;
        //cards = [1,2,3];//todo test code
        if(!cards || cc.isUndefined(cards) || cards.length <= 0 ){
            cards = []; 
		}
  
		var addMaPai = _Image_niao.getChildByName("addMaPai");
		var mapaiNum = MjClient.majiang.getMaPaiNum(cards,tData);
		cc.log(mapaiNum);
		var testStr = " + " +mapaiNum;
		addMaPai.setString( testStr );
		
        for(var i = 0;i < cards.length;i++)
        {
        	_Image_niao.setVisible(true);

            var _node = cardnode.clone();
            _node.visible = true; 
            _node.setColor(cc.color(100,100,100)); 

            _node.setPosition(cc.p(cardnode.x + slotwith*i,cardnode.y));
            _Image_niao.addChild(_node);
            setCardSprite(_node, cards[i],0);
            //addMaPai
            addMaPai.setVisible(true);
            addMaPai.setPosition(cc.p(_node.getPositionX() + 50,_node.getPositionY()));

            // 改变非码牌的颜色
            if(cards[i] == tData.hunCard)
        		_node.setColor(cc.color(255,255,255));
        	if(cards[i] > 30)
        		continue;

            if(tData.areaSelectMode.maPai == 0){ // 数字码
            	// 1-9 71 
            	_node.setColor(cc.color(255,255,255)); 
            }else{
            	// 1 5 9 71 
            	var dataNum = cards[i] % 10;
            	if(dataNum == 1 || dataNum == 5 || dataNum == 9)
            		_node.setColor(cc.color(255,255,255)); 
            }  
        }

    	if(cards.length >= 6){
    		var shareBtn = _back.getChildByName("share");
    		var sharePos = shareBtn.getPosition();
    		shareBtn.setPosition(cc.p(sharePos.x + 80,sharePos.y));
    		var readyBtn = _back.getChildByName("ready");
    		var readyPos = readyBtn.getPosition();
    		readyBtn.setPosition(cc.p(readyPos.x + 80,readyPos.y));
    	}

 		return true;
    }
});