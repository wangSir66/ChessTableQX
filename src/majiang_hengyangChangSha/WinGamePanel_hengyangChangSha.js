// 258麻将：配置地区有 衡阳、邵阳、旺旺 by cyc 20190823

function CardLayoutRestoreForEndOne_hengyangChangSha(node, endonepl)
{
    // node 是克隆新建的一个麻将节点 by sking

    var newC = null; //先创建麻将的UI节点
    var newVal = 0; //新牌的值，是几万，几筒，几条....为数字
    var pl = endonepl; //player 信息

    var mjhandNum = 0;
    var children = node.children;
    for(var i = 0; i < children.length; i++)
    {
        var ci = children[i];
        if(ci.name == "mjhand")
        {
            mjhandNum++;
        }
    }

    var tempMaJiang = MjClient.majiang; //麻将的各种方法判断，是否可以杠，是否可以吃... by sking

    //排序麻将的位置 by sking
    if (pl.mjhand && pl.mjhand.length > 0)
    {
        var count = tempMaJiang.CardCount(pl);
        if(count == 14 && mjhandNum == pl.mjhand.length)
        {
            newVal = pl.mjhand[pl.mjhand.length - 1]; //为什么取最后一个节点 ？
        }
    }

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
    var tData = MjClient.data.sData.tData;
    for(var i = 0; i < children.length; i++) //children 为 "down" 节点下的字节点
    {
        var ci = children[i];
        if(ci.name == "mjhand")
        {
            if(newC == null && newVal == ci.tag)
            {
                newC = ci; //从down 节点下，复制一个麻将node保存在newC 里 by sking
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

    uistand.sort(TagOrder);

    if(uihun.length > 0) //是否有柰子，有则放在最前面 by sking
    {
        for(var i = 0; i < uihun.length; i++)
        {
            uistand.unshift(uihun[i]); //向数组开头添加一个元素 unshift
        }
    }

    if(newC)
    {
        uistand.push(newC); //把这张牌放入手牌的数组里  by sking
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

            if(i == orders.length - 1)
            {
            	if(newC){
            		if(pl.hu2 && tData.lastPutCard2 && tData.lastPutCard){//胡两张
                    	var newVal1 = ci.tag == tData.lastPutCard2 ? tData.lastPutCard : tData.lastPutCard2;
                    	var newC1 = getNewCard(node, "up", "mjhand", newVal1, 0)
                    	newC1.visible = true;
						newC1.enabled = false;
                        newC1.setScale(newC1.getScale()*1.1);

                        if(ci.tag == tData.lastPutCard){
                        	ci.x = ci.x + slotwith + 10;
                        	newC1.x = ci.x + upSize.width * upS *1.35;
                        }else{
                        	newC1.x = ci.x + slotwith + 10;
                        	ci.x = newC1.x + upSize.width * upS *1.35;
                        }

                        if(!endonepl){
                        	ci.y += 20;
                        	newC1.y += 20;
                        }
                    }
                    else
                    {
                    	ci.x = ci.x + slotwith + 10;
            			if(!endonepl){
            				ci.y += 20;
            			}
                    }
            	}
            	else{
            		cc.log("-----------newC222222222----------------");
            	}
            }
        }
        else
        {
            ci.x = start.x + upSize.width * upS;
        }
    }

    if (MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType()) {
        setUserOfflineWinGamePanel(node.parent, pl);
    }
}


function SetEndOneUserUI_hengyangChangSha(node,off)
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

					CardLayoutRestoreForEndOne_hengyangChangSha(node, pl);
					//CardLayoutRestoreForEndOne(node, pl);

				},
			},
			down: {
				_visible: false
			},
			stand: {
				_visible: false
			},
			scrollView: {    // 邵阳APP走这里
                _run:function()
                {
                    var cardType = this.getChildByName("cardType");
                    cardType.ignoreContentAdaptWithSize(true);

                    cardType.setString(pl.mjdesc + "");
                    
                    this.setScrollBarOpacity(0);
                    if (cardType.getContentSize().width > this.getContentSize().width) {
                        this.setInnerContainerSize(cc.size(cardType.getContentSize().width, this.getInnerContainerSize().height))
                        cardType.x = cardType.getContentSize().width/2;
                    }
                },
			},
			cardType: {
                _run:function()
                {
                    this.ignoreContentAdaptWithSize(true);
                    var minX = this.x - this.width/2;
                    this.setString(pl.mjdesc + "");
                    if (this.x - this.width/2 < minX)
                        this.x = minX + this.width/2;
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
                if (MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP) {
					this.ignoreContentAdaptWithSize(true);
					pl.winone = revise(pl.winone);
                    if(pl.winone < 0){
                        this.setProperty(pl.winone, "ui/common/fufen.png", 40, 53, "+");
                    }
                }
            },
			_text: function () {
				var pre = "";
				if (pl.winone > 0) pre = "+";
				pl.winone = revise(pl.winone);
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
					pl.winall = revise(pl.winall);
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
	//uibind.winNum._node.y=uibind.head._node.y;
}
// 258 麻将   衡阳 和邵阳 公用一套代码
var EndOneView_hengyangChangSha = cc.Layer.extend({
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
            _layout:[[1,1],[0.5,0.5],[0,0]]
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
                      return pl.winone >=1 && !MjClient.isDismiss;
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
                      return pl.winone <0 && !MjClient.isDismiss;
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
                      return pl.winone==0 || MjClient.isDismiss;
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
				var sData = MjClient.data.sData;
				var tData = sData.tData;

				// 显示大结算
				if (sData.tData.roundNum <= 0)
					MjClient.endoneui.getParent().addChild(new GameOverLayer(), 500);

				/*
				 准备的时候花、加注数清掉
				 */
				for (var i = 0; i < MjClient.MaxPlayerNum; i++) {
					var pl = getUIPlayer(getOffForPlayerNum(i))
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

				if (MjClient.rePlayVideo >= 0 && MjClient.replayui) {
					MjClient.replayui.replayEnd();
				} else {
					MjClient.MJPass2NetForHengYangChangSha();
				}
				reInitarrCardVisible();
			},
			_visible: function() {
				var tData = MjClient.data.sData.tData;
				return !tData.matchId;
			}
		},
		delText:
		{
			_run: function() {
                this.setFontName("Arial");
                this.setFontSize(this.getFontSize());
				if (MjClient.isDismiss) {
					var sData = MjClient.data.sData;
					var tData = sData.tData;
					var id = tData.firstDel;
					var pl = sData.players[id];
					var delStr = "";
					if (pl) {
						var name = unescape(pl.info.nickname );
						delStr = name + pl.mjdesc[0];
					} else { // 会长或管理员解散房间时 pl 会为 null
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
		dir:
		{
			_visible:true,
			_run: function() {
                if (MjClient.getAppType() != MjClient.APP_TYPE.HUNANWANGWANG && MjClient.APP_TYPE.QXSYDTZ != MjClient.getAppType()) // 邵阳APP使用的是多行显示
				    this.ignoreContentAdaptWithSize(true);
			},
			_text: function () {
				var tData = MjClient.data.sData.tData;
		        var str = "";

		        if (tData.areaSelectMode.zhuaNiaoType == 2) {
		        	str += "不抓鸟,";	
		        }
		        else {
		        	str += tData.areaSelectMode.zhuaNiaoType == 0 ? "中鸟加分," : "中鸟加倍,";
		        	if (tData.areaSelectMode.zhuaNiaoNum >= 0 && tData.areaSelectMode.zhuaNiaoNum <= 4)
		        		str += ["1鸟,", "2鸟,", "4鸟,", "6鸟,", "3鸟(自摸),"][tData.areaSelectMode.zhuaNiaoNum];
		        }
		        

		        if (tData.areaSelectMode.zhuangXianFeng)
		            str += "庄闲分,";
		      
		        // if (tData.areaSelectMode.jiaJiangHu)
		        //     str += "假将胡,";
		        // if (tData.areaSelectMode.xianPiao)
		        //     str += "飘分,";
		        if (tData.areaSelectMode.menQingZiMo)
            		str += "门清,";

                if (tData.areaSelectMode.quanQiuRenSifangBaoPei)
                    str += "全求人四放包赔,";
                if (tData.areaSelectMode.changsha_difen)
                    str += "积分底分" + tData.areaSelectMode.changsha_difen + ",";

                // if (tData.areaSelectMode.fengDing >= 0)
                //     str += tData.areaSelectMode.fengDing == 0 ? "21分封顶," : "42分封顶,";

		        if(MjClient.getAppType() != MjClient.APP_TYPE.HUNANWANGWANG && MjClient.APP_TYPE.QXSYDTZ != MjClient.getAppType()){
                	str = GameCnName[MjClient.gameType] + "," + str + "房间号:" + tData.tableid;
                }
		        
        		if (MjClient.isShenhe)
            		str = "七星"+str;

				return str;
			}
		},
		head0:{
			head:{
				zhuang:{_visible:false}
			},
		    winNum:{
			},
		   _run:function(){ SetEndOneUserUI_hengyangChangSha(this,0); },
		   
		}
		,head1:{ 
		   head:{
			   zhuang:{_visible:false}
		   },
	       winNum:{
			   // _layout:[[0.08,0.08],[1,0.5],[-2.5,0.75]]
		   },
		  _run:function(){ SetEndOneUserUI_hengyangChangSha(this,1); }
		}
		
		,head2:{ 
		   head:{
			   zhuang:{_visible:false}
		   },
	       winNum:{
			   // _layout:[[0.08,0.08],[1,0.5],[-2.5,-0.75]]
		   },
		   _run:function(){ SetEndOneUserUI_hengyangChangSha(this,2); }
		}
		,head3:{
			 head:
			 {
				zhuang:{_visible:false}
			 },
			 winNum:{
				 // _layout:[[0.08,0.08],[1,0.5],[-2.5,-2.25]]
			 },
			_run:function(){ SetEndOneUserUI_hengyangChangSha(this,3); }
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

        if (MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType())
            var endoneui = ccs.load("endOne_258mj.json");
        else
            var endoneui = ccs.load(res.EndOne_changSha_json);

		BindUiAndLogic(endoneui.node,this.jsBind);
        this.addChild(endoneui.node);

        //时间
        var _back = endoneui.node.getChildByName("back");
        var _time =  _back.getChildByName("time");
        _time.visible = true;
        _time.setString(MjClient.roundEndTime);

		MjClient.endoneui=this;

		changeMJBg(this, getCurrentMJBgType());

        if (MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType())
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
        //var slotheigt = upSize.height * upS * 0.3;
        //cards = [1,2,3];//todo test code
        var zhongCount = tData.niaoDesc || "";
        // var pl = getUIPlayer(0);
        // cc.log("hengyangChangsha niaocards =====",tData.niaoCards,JSON.stringify(cards))

        for(var i = 0;i < cards.length;i++)
        {
        	cc.log("card[i]=====",cards[i])
            var _node = cardnode.clone();
            _node.visible = true;
            _node.setPosition(cc.p(cardnode.x + slotwith*i,cardnode.y));
            _Image_niao.addChild(_node);
            setCardSprite(_node, cards[i],0);
            var isNiaoCard = false;
            for(var j = 0; tData.niaoCards && j < tData.niaoCards.length; j++){
            	cc.log("niaocard1111=============",tData.niaoCards[j],cards[i],cards[i] === tData.niaoCards[j])
            	if (cards[i] === tData.niaoCards[j]){
                    // zhongCount++;
                    isNiaoCard = true;
				}
			}
			if (isNiaoCard == false){
                _node.setColor(cc.color(170,170,170));
			}
            // if (cards[i] == 31 || cards[i] == 71 ||
            //     (cards[i] <= 29 && cards[i] % 10 == 1 || cards[i] % 10 == 5 || cards[i] % 10 == 9))
            // {
            //     zhongCount++;
            // }else{
            //     _node.setColor(cc.color(170,170,170));
            // }
        }

        if(zhongCount == ""){
            countNode.setVisible(false);
        }else{
            var pos = cc.p(cardnode.x + slotwith * cards.length  - slotwith/2, cardnode.y);
            countNode.setPosition(pos);
            countNode.setString(zhongCount);
            countNode.ignoreContentAdaptWithSize(true);

            if(cards.length >= 6){
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
		}

 		return true;
    }
});