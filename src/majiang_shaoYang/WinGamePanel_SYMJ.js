

function SetEndOneUserUI_SYMJ(node,off)
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

var EndOneView_SYMJ = cc.Layer.extend({
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
        },
		back:{
            _layout:[[1,1],[0.538,0.5],[-0.035,0]],
            _event: { 
            	showTableEvent: function(isShow){
            		this.setVisible(!isShow);
            	}
            },
			wintitle: {
				_visible:function(){
					  var pl=getUIPlayer(0);
					  if(pl)
	                  {
	                      //playEffect("win");
	                      return pl.winone >=1;
	                  }
					  return false;
				}
			},
			losetitle:{
				_visible:function(){
					  var pl=getUIPlayer(0);
					  if(pl)
	                  {
	                      //playEffect("lose");
	                      return pl.winone <0;
	                  }
					  return false;
				}
			},
			pingju:{
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
		
			showTable: {
				_click:function(btn,eT){ 
					postEvent("showTableEvent",true);
				}
			},

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
                	
                	postEvent("closeJiaChuiUI"); 
					postEvent("clearCardUI");
					MjClient.endoneui.removeFromParent(true);
	                MjClient.endoneui = null;
					var sData=MjClient.data.sData;
					var tData=sData.tData; 
	                // if (MjClient.rePlayVideo >= 0 && MjClient.replayui)   
	                if(MjClient.rePlayVideo >= 0 && MjClient.replayui) // 回放把下面的影藏了
	                { 
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
			info: // 左上角
			{
				_visible:true,
				_text: function () {
					return getPlayingRoomInfo(5);
				}
			},
			dir:{
				_visible:true,
	            // _run:function(){
	            //     this.ignoreContentAdaptWithSize(true);
	            // },
				_text: function () {
					var sData=MjClient.data.sData;
					var tData=sData.tData;
					var text = "";
					// text += "邵阳麻将";
	                //var strZaiMo = "";
	                // text += (",房间号:" + tData.tableid);
	                var str = "";
	                switch (tData.areaSelectMode.zhuaniao)
	                {
	                    case 0:
	                        str += "不抓鸟"
	                        break; 
	                    case 1:
	                    	str += "窝窝鸟";
	                    	break;
	                    default: 
	                        str += tData.areaSelectMode.zhuaniao + "鸟"
	                        break;
	                }
	                str += tData.areaSelectMode.isDaiFeng ? ",带风":"";
	                str += tData.areaSelectMode.isJiaChui ? ",加锤":"";
	                str += tData.areaSelectMode.isCanChi ? ",可吃牌":"";
	                str += tData.areaSelectMode.isQingYiSeChi ? ",清一色可吃牌":"";
	                str += !tData.areaSelectMode.isCanChi && !tData.areaSelectMode.isQingYiSeChi ? ",不可吃" : "";
	                str += tData.areaSelectMode.syDuoHu ? ",一炮多响" : "一炮一响";
	                str += ","+ tData.areaSelectMode.maxPlayer + "人场";

	                if(tData.areaSelectMode.jieSuanDiFen){
	                    var difen = tData.areaSelectMode.jieSuanDiFen;
	                    str += difen != 1 ? ",积分底分x" + difen : "";
	                }
                	str += tData.areaSelectMode.fanBei == 0 ? "/不翻倍" : "/低于" + tData.areaSelectMode.fanBeiScore + "分翻倍";
                	
	                text += str;
					
	                text = getNewName(text,30);
					return text;
				}
			},
			head0:{
				head:{
					zhuang:{_visible:false}
				},
			    winNum:{
				},
			   _run:function(){ SetEndOneUserUI_SYMJ(this,0); },
			   
			},
			head1:{ 
			   head:{
				   zhuang:{_visible:false}
			   },
		       winNum:{
				   // _layout:[[0.08,0.08],[1,0.5],[-2.5,0.75]]
			   },
			  _run:function(){ SetEndOneUserUI_SYMJ(this,1); }
			},

			head2:{ 
			   head:{
				   zhuang:{_visible:false}
			   },
		       winNum:{
				   // _layout:[[0.08,0.08],[1,0.5],[-2.5,-0.75]]
			   },
			   _run:function(){ SetEndOneUserUI_SYMJ(this,2); }
			},
			head3:{
				 head:
				 {
					zhuang:{_visible:false}
				 },
				 winNum:{
					 // _layout:[[0.08,0.08],[1,0.5],[-2.5,-2.25]]
				 },
				_run:function(){ SetEndOneUserUI_SYMJ(this,3); }
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
        var endoneui = ccs.load("endOne_SYMJ.json");
		BindUiAndLogic(endoneui.node,this.jsBind);
        this.addChild(endoneui.node);

        // var _dir = endoneui.node.getChildByName("back").getChildByName("dir");
        // _dir.ignoreContentAdaptWithSize(true);
        //时间
        var _back = endoneui.node.getChildByName("back");
        var _time =  _back.getChildByName("time");
        _time.visible = true;
        function _setTime()
        {
           var time = MjClient.getCurrentTime();
           var str = " " + time[0] + "-" + time[1] + "-" + time[2] + " " + time[3] + ":" + time[4] + ":" + time[5];
           cc.log("str time =  " + str);
           return str;
        }
        _time.setString(MjClient.roundEndTime);

		MjClient.endoneui=this;

		changeMJBg(this, getCurrentMJBgType());

		COMMON_UI.showMjWinGamePanelDiPai(_back);

        //显示抓鸟的牌
        var _Image_niao = _back.getChildByName("Image_niao");
        var sData = MjClient.data.sData;
        var tData = sData.tData;
        var moCard = [];
        for (var index in sData.players) {
        	 if(sData.players[index].mopai.length > 0)
        	 	moCard = sData.players[index].mopai;
        }

        var cards = moCard;//sData.players[tData.owner].mopai;//tData.mopai;   

        var cardnode = _Image_niao.getChildByName("niao_card");
        cardnode.visible = false;
        var slotwith = cardnode.width * cardnode.scale * 0.9;//0.05;
        //var slotheigt = upSize.height * upS * 0.3;
        //cards = [1,2,3];//todo test code

        var addMaPai = _Image_niao.getChildByName("addMaPai");
		var mapaiNum = MjClient.majiang.getMaPaiNum(cards,tData); 
		
 
		var huNum = 0;
		var dianpaoPlayer = null;
		for (var index in sData.players) {
        	if(sData.players[index].winType > 0){
        	 	huNum++;
        	 	dianpaoPlayer = sData.players[index].dianPaoPlayer;
        	}
        }


        var zhongNiaoNum = 0; // 中的鸟的数量
        for(var i = 0;i < cards.length;i++)
        { 
            var _node = cardnode.clone();
            _node.visible = true;
            _node.setPosition(cc.p(cardnode.x + slotwith*i,cardnode.y));
            _node.setColor(cc.color(100,100,100)); 
            _Image_niao.addChild(_node);
            setCardSprite(_node, cards[i],0); 
     
        	addMaPai.setVisible(true);
            addMaPai.setPosition(cc.p(_node.getPositionX() + 50,_node.getPositionY()));

            if(huNum > 1){
            	// 多胡
            	var niaoData = MjClient.majiang.getNiaoIsShow(cards[i],4); 
            	 cc.log("cards[i] =" +  cards[i] + "niaoData = " + niaoData);
            	if(niaoData != -1){
            		var index = (dianpaoPlayer + niaoData) % 4; // 可以获得这个鸟的位置  
            		var temp_Pl = sData.players[tData.uids[index] ]; // 通过位置来获取玩家信息
            		if(!temp_Pl || temp_Pl.winType <= 0)
            			continue; 
            		_node.setColor(cc.color(255,255,255));
            		zhongNiaoNum++;
            	}
            	
            }else{
            	// 159 + 风牌
            	var dataNum = cards[i] % 10;
        		if(dataNum == 1 || dataNum == 5 || dataNum == 9 || cards[i] > 30 ){
        			_node.setColor(cc.color(255,255,255));  
        			zhongNiaoNum++;
        		}

            }  
        }

        var testStr = " + " +zhongNiaoNum;
		addMaPai.setString( testStr );

 		return true;
    } 
});