

function SetEndOneUserUI_TYZZ(node,off)
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
					if (MjClient.isDismiss && !sData.players[tData.firstDel] && pl.mjdesc[1]) // 会长或管理员解散房间
                    	return pl.mjdesc[1];
                	else
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
            }
		}
	}
	BindUiAndLogic(node.parent,uibind);
	if(MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP|| MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ)
	{
        var pl = MjClient.getPlayerByIndex(off);
        CircularCuttingHeadImg(uibind.head._node, pl);

    }else{
        addWxHeadToEndUI(uibind.head._node,off);
    }
	//uibind.winNum._node.y=uibind.head._node.y;
}

var EndOneView_TYZZ = cc.Layer.extend({
	jsBind:{
		block: {
            _layout: [[1, 1], [0.5, 0.5], [0, 0], true]
        },
		back:{
            _layout:[[1,1],[0.538,0.5],[-0.035,0]]
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
					if(isRealHuangZhuang()) this.loadTexture("gameOver/huangzhuan_35.png");
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
					}.bind(this))));
				}
			}
			,_visible :function()
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
				 准备的时候花清掉
				 */
                for(var i = 0; i < 4;i++)
                {
                    var pl = getUIPlayer(i)
                    if(pl && pl.mjflower)
                    {
                        pl.mjflower = [];
                    }
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
                    MjClient.MJPass2NetForTYZZ();
                }
				reInitarrCardVisible();
				},
				_visible :function()
				{
					var tData = MjClient.data.sData.tData;
					return !tData.matchId;
			}
		},
		delText:
		{
			_run: function() {
				if (MjClient.isDismiss) {
					var sData = MjClient.data.sData;
					var tData = sData.tData;
					var id = tData.firstDel;
					var pl = sData.players[id];
					var delStr = "";
					if (!pl) {	// 会长或管理员解散房间时 pl 会为 null
						pl = getUIPlayer(0);
						if (pl)
							delStr = pl.mjdesc[0];
					}
					this.setString(delStr);
				} else {
					this.setString("");
				}
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
				return getPlayingRoomInfo(0);
			}
		},
		// dir:
		// {
		// 	_visible:true,
         //    _run:function(){
         //        this.ignoreContentAdaptWithSize(true);
         //    },
		// 	_text: function () {
		// 		var sData=MjClient.data.sData;
		// 		var tData=sData.tData;
		// 		var text = "";
		// 		text += "转转麻将,";
         //        //var strZaiMo = "";
         //        var str = "";
         //        switch (tData.areaSelectMode.zhuaniao)
         //        {
         //            case 1:
         //                str += "上中下鸟"
         //                break;
         //            case 2:
         //                str += "2鸟"
         //                break;
         //            case 4:
         //                str += "4鸟"
         //                break;
         //            case 6:
         //                str += "6鸟"
         //                break;
         //            case 10:
         //                str += "一鸟全中"
         //                break;
         //            default:
         //                break;
         //        }
         //        str += tData.areaSelectMode.difen ? ",底分" + tData.areaSelectMode.difen:"";
         //        str += tData.areaSelectMode.zhuangxianfen ? ",庄闲分":"";
         //        str += tData.areaSelectMode.dianpao ? ",点炮胡":"";
         //        str += tData.areaSelectMode.qianggang ? ",抢杠胡":"";
         //        str += tData.areaSelectMode.qianggangquanbao ? ",抢杠全包":"";
         //        str += tData.areaSelectMode.hongzhong8 ? ",8红中":"";
         //        str += tData.areaSelectMode.qidui ? ",七对可胡":"";
         //        str += tData.areaSelectMode.youhongzhongbujiepao ? ",有红中不接炮":"";
         //        str += tData.areaSelectMode.wuhongzhongjiabei ? ",无红中加倍":"";
         //        if (tData.areaSelectMode.zhuaniao != 0 && tData.areaSelectMode.zhuaniao != 10) {
         //            if (tData.areaSelectMode.niaofen == 1) str += ",中鸟1分";
         //            if (tData.areaSelectMode.niaofen == 2) str += ",中鸟2分";
         //        }
         //        text += str;
		// 		text += (",房间号:" + tData.tableid);
         //        text = getNewName(text,50);
		// 		return text;
		// 	}
		// },
		head0:{
			head:{
				zhuang:{_visible:false}
			},
		    winNum:{
			},
		   _run:function(){ SetEndOneUserUI_TYZZ(this,0); },
		   
		}
		,head1:{ 
		   head:{
			   zhuang:{_visible:false}
		   },
	       winNum:{
			   // _layout:[[0.08,0.08],[1,0.5],[-2.5,0.75]]
		   },
		  _run:function(){ SetEndOneUserUI_TYZZ(this,1); }
		}
		
		,head2:{ 
		   head:{
			   zhuang:{_visible:false}
		   },
	       winNum:{
			   // _layout:[[0.08,0.08],[1,0.5],[-2.5,-0.75]]
		   },
		   _run:function(){ SetEndOneUserUI_TYZZ(this,2); }
		}
		,head3:{
			 head:
			 {
				zhuang:{_visible:false}
			 },
			 winNum:{
				 // _layout:[[0.08,0.08],[1,0.5],[-2.5,-2.25]]
			 },
			_run:function(){ SetEndOneUserUI_TYZZ(this,3); }
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
		}
	},
    ctor:function () {
        this._super();
        var endoneui = ccs.load(res.EndOne_TYZZ_json);
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

        var cardnode = null;
        var listView = null;//
        if(MjClient.APP_TYPE.QXYYQP != MjClient.getAppType() ){
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
            

            if(MjClient.APP_TYPE.QXYYQP != MjClient.getAppType() ){ 
	            _node.setPosition(cc.p(cardnode.x + slotwith*i,cardnode.y));
	            _Image_niao.addChild(_node);
	            setCardSprite(_node, cards[i],0);
            }else{
            	listView.pushBackCustomItem(_node);
            	setCardSprite(_node.getChildByName("niao_card"), cards[i],0);
            }


            if(tData.areaSelectMode.zhuaniao == 1){    //上中下鸟
            	_node.setColor(cc.color(255,255,255));
			}else if(MjClient.getAppType() == MjClient.APP_TYPE.QXXXGHZ && tData.areaSelectMode.zhuaniao == 10){   //一鸟全中
				zhongCount++;
				_node.setColor(cc.color(255,255,255));
			}else if(MjClient.APP_TYPE.QXYYQP === MjClient.getAppType() || MjClient.APP_TYPE.YLHUNANMJ === MjClient.getAppType()) {
				_node.setColor(cc.color(255,255,255));
			}else{
                if (cards[i] == 31 || cards[i] == 71 ||
                    (cards[i] <= 29 && cards[i] % 10 == 1 || cards[i] % 10 == 5 || cards[i] % 10 == 9))
                {
                    zhongCount++;
                }else if(!tData.areaSelectMode.anzhuang){
                    _node.setColor(cc.color(170,170,170));
                }
            }
        }

        if((countNode && zhongCount == 0) || tData.areaSelectMode.anzhuang){
        	countNode.setVisible(false);
        }else if(countNode){
        	var pos = cc.p(cardnode.x + slotwith * cards.length  - slotwith/2, cardnode.y);
        	if(MjClient.APP_TYPE.QXYYQP != MjClient.getAppType() ){ 
        		countNode.setPosition(pos);
        	}
        	countNode.setString("+" + zhongCount);
        }

        if(listView)
        	listView.forceDoLayout();

        if(cards.length >= 6 && MjClient.APP_TYPE.QXYYQP != MjClient.getAppType() ){
        	var off_x = 50;
        	if(cards.length == 8){
        		off_x = 100;
        	}
    		var shareBtn = _back.getChildByName("share");
    		var sharePos = shareBtn.getPosition();
    		shareBtn.setPosition(cc.p(sharePos.x + off_x,sharePos.y));
    		var readyBtn = _back.getChildByName("ready");
    		var readyPos = readyBtn.getPosition();
    		readyBtn.setPosition(cc.p(readyPos.x + off_x,readyPos.y));
    	}
  
 		return true;
    }
});