

function SetEndOneUserUI_linfenyingsanzui(node,off)
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

    // node.getChildByName("huaX").zIndex = 11;
    // node.getChildByName("huaIcon").zIndex = 11;
    // var huaCount = node.getChildByName("huaCount");
    // huaCount.zIndex = 11;

    // var tData = MjClient.data.sData.tData;
    // if(tData.areaSelectMode.flowerType == WithFlowerType.noFlower)
    // {
    //     huaCount.visible = false;
    //     node.getChildByName("huaX").visible = false;
    //     node.getChildByName("huaIcon").visible = false;
    // }else{
    //
    //     changeAtalsForLabel(huaCount, pl.mjflower.length);
    // }


	var tingIcon = node.getChildByName("tingIcon");
    tingIcon.zIndex = 11;
    if (pl.isTing && (pl.mjdesc + "").indexOf("未听牌") < 0 )
    {
        tingIcon.setVisible(true);
    }
    else
    {
        tingIcon.setVisible(false);
    }

    var lightBox = node.getParent().getChildByName("lightbox");
    if (pl.info.uid == SelfUid() && pl.winType > 0) 
    {
        lightBox.visible = true;
    }
    else
    {
        lightBox.visible = false;
    }
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
						var cd = getNewCard(node, "up", "mjhand", pl.mjhand[i], 0);
						//cd.setScale(cd.getScale()/0.8);//晋中app把手牌调小了0.8倍
						arry.push(cd);
					}

					for (var i = 0; i < arry.length; i++) {
						arry[i].visible = true;
						arry[i].enabled = false;
                        arry[i].setScale(arry[i].getScale()*1.1);
					}
                    //小结算界面，显示自己对应行碰杠胡和手牌（胡牌对应的牌右上角加上胡牌标识）
                    /**
                     * 需要胡牌标志
                     * @type {boolean}
                     */
                    var isHu = true;
                    CardLayoutRestoreForEndOne(node, pl, isHu);

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
                    this.zIndex = 100;
					this.ignoreContentAdaptWithSize(true);
				},
				_text: function () {
					return pl.mjdesc + ""
				},
			}

		},
        loseNum: {
            _run:function()
            {
                this.visible = pl.winone <= 0;
            },
            _text: function () {
                var pre = "";
                //if (pl.winone > 0) pre = "+";//
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
        }
		, winNum: {
			_run:function()
            {
                this.visible = pl.winone > 0;
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
        },
        allScore: {
            _run:function()
            {
                this.ignoreContentAdaptWithSize(true);
            },
            _text: function () {
                // 计算当前总分
                var winScore = 0;
                var tableMsg = pl.roomStatistics;
                if(!tableMsg)
                {
                    tableMsg = [0,0,0,0,0];
                }
                for(var i = 0;i < tableMsg.length;i++)
                {
                    winScore += tableMsg[i];
                    // 精度修正
                    winScore = revise(winScore);
                }

                var pre = "";
                if (winScore > 0) pre = "+";
                return pre + winScore;
            }
        }
	}

	var _tingIcon = node.getChildByName("TingTag");
    _tingIcon.visible = false;
    var _noTingIcon = node.getChildByName("noTingIcon");
    _noTingIcon.visible = false;
	if(pl.isTing)
    {

        cc.log("------------pl.putCardAfterTing = " + pl.putCardAfterTing);
        cc.log("------------.pl.mjput = " + JSON.stringify(pl.mjput));

        if(pl.putCardAfterTing >= 0 && pl.putCardAfterTing != -1)
        {
            _tingIcon.visible = true;
            var _cd = pl.mjput[pl.putCardAfterTing];
            _tingIcon.setColor(cc.color(190, 190, 190))
            setCardSprite(_tingIcon, _cd, 0);
            var _fangText = new ccui.Text();
            _fangText.setName("text");
            _fangText.setFontSize(40);
            var _selectCol = cc.color(237, 101, 1);
            _fangText.setColor(_selectCol);
            _fangText.setFontName(MjClient.fzcyfont);
            _fangText.setPosition(cc.p(_tingIcon.getContentSize().width/2,_tingIcon.getContentSize().height*1.2));
            _fangText.setString("叫听牌");
            _fangText.ignoreContentAdaptWithSize(true);
            _fangText.setTouchEnabled(true);
            _tingIcon.addChild(_fangText);
        }

    }
    else
    {
        _noTingIcon.visible = true;
    }



	BindUiAndLogic(node.parent,uibind);
	addWxHeadToEndUI(uibind.head._node,off);
	//uibind.winNum._node.y=uibind.head._node.y;
}

var EndOneView_linfenyingsanzui = cc.Layer.extend({
	jsBind:{
		block: {
            _layout: [[1, 1], [0.5, 0.5], [0, 0], true]
        },
		back:{
            _run:function()
            {
                if(isIPhoneX())
                    setWgtLayout(this, [0.85,0.85],[0.5,0.55],[0,0], false);
                else
                    setWgtLayout(this, [1,1],[0.5,0.55],[0,0], false);
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
                    this.loadTexture("gameOver/jiesan.png");
                }
                else if(MjClient.CheckPlayerCount(function(p){ if(p.winone==0){return true;} return false;}) == tData.maxPlayer)
				{
					this.loadTexture("gameOver/huangzhuan_35.png");
				}

			}
		},
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
                    MjClient.MJPass2NetForlinfenyingsanzui();
                }
				reInitarrCardVisible();
				},
				_visible :function()
				{
					var tData = MjClient.data.sData.tData;
					return !tData.matchId;
			}
		},
		btnShowHeap:{
                _visible: false,
                _run:function () {

                },
                _click:function()
                {
                	if(MjClient.endoneui){
                       // var linfenyingsanzuiCardsHeap = new PopupShowCardsHeap();
                       // linfenyingsanzuiCardsHeap.setName("linfenyingsanzuiCardsHeap");
                       // MjClient.endoneui.addChild(linfenyingsanzuiCardsHeap);
                    }
                },
            },
		dir: {
			_visible:true,
			_run:function(){
				this.ignoreContentAdaptWithSize(true);
			},
			_text: function () {
				// 晋中换皮，房间信息显示根据"#"拆分，by 江崇伟
				var arr = getPlayingRoomInfo(3).split("#");
				var str1 = arr[1];
				return (str1);
			}
		},
		dir_0: {
			_visible:true,
			_run:function(){

			},
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
		   _run:function(){ SetEndOneUserUI_linfenyingsanzui(this,0); },
		   
		},
		head1:{
		   head:{
			   zhuang:{_visible:false}
		   },
	       winNum:{
			   // _layout:[[0.08,0.08],[1,0.5],[-2.5,0.75]]
		   },
		  _run:function(){ SetEndOneUserUI_linfenyingsanzui(this,1); }
		},
		head2:{
		   head:{
			   zhuang:{_visible:false}
		   },
	       winNum:{
			   // _layout:[[0.08,0.08],[1,0.5],[-2.5,-0.75]]
		   },
		   _run:function(){ SetEndOneUserUI_linfenyingsanzui(this,2); }
		},
		head3:{
			 head:
			 {
				zhuang:{_visible:false}
			 },
			 winNum:{
				 // _layout:[[0.08,0.08],[1,0.5],[-2.5,-2.25]]
			 },
			_run:function(){ SetEndOneUserUI_linfenyingsanzui(this,3); }
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
        var endoneui = ccs.load("endOne_linfenyingsanzui.json");
		BindUiAndLogic(endoneui.node,this.jsBind);
        this.addChild(endoneui.node);

        var _dir = endoneui.node.getChildByName("back").getChildByName("dir");
        _dir.ignoreContentAdaptWithSize(true);
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
        COMMON_UI.showMjWinGamePanelDiPai(_back);
		MjClient.endoneui=this;




        changeMJBg(this, getCurrentMJBgType());

 		return true;
    }
});