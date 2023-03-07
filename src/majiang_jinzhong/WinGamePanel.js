/**
 * 麻将的新框架，为了减少代码的关联，同时增强可读性,可能有待完善
 * Created by sking on 2019/3/8.
 */

var EndOnePanel = cc.Layer.extend({
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
					if(isRealHuangZhuang()) this.loadTexture("gameOver/huangzhuan_35.png");
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
                    MjClient.playui.MJPass2Net();
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
                        var jinzhongCardsHeap = new PopupShowCardsHeap();
                        jinzhongCardsHeap.setName("jinzhongCardsHeap");
                        MjClient.endoneui.addChild(jinzhongCardsHeap);
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
		   _run:function(){ MjClient.endoneui.SetEndOneUserUI(this,0); },
		   
		},
		head1:{
		   head:{
			   zhuang:{_visible:false}
		   },
	       winNum:{
			   // _layout:[[0.08,0.08],[1,0.5],[-2.5,0.75]]
		   },
		  _run:function(){ MjClient.endoneui.SetEndOneUserUI(this,1); }
		},
		head2:{
		   head:{
			   zhuang:{_visible:false}
		   },
	       winNum:{
			   // _layout:[[0.08,0.08],[1,0.5],[-2.5,-0.75]]
		   },
		   _run:function(){ MjClient.endoneui.SetEndOneUserUI(this,2); }
		},
		head3:{
			 head:
			 {
				zhuang:{_visible:false}
			 },
			 winNum:{
				 // _layout:[[0.08,0.08],[1,0.5],[-2.5,-2.25]]
			 },
			_run:function(){ MjClient.endoneui.SetEndOneUserUI(this,3); }
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
        var endNode = this.initLoadJsonFile();
        MjClient.endoneui = this;
        BindUiAndLogic(endNode,this.jsBind);
        this.initUIset(endNode);

 		return true;
    }
});

EndOnePanel.prototype.initLoadJsonFile = function(){

},

EndOnePanel.prototype.initUIset = function(endoneNode){
    var _dir = endoneNode.getChildByName("back").getChildByName("dir");
    _dir.ignoreContentAdaptWithSize(true);
    //时间
    var _back = endoneNode.getChildByName("back");
    var _time =  _back.getChildByName("time");
    _time.visible = true;
    _time.setString(MjClient.roundEndTime);
    COMMON_UI.showMjWinGamePanelDiPai(_back);
    changeMJBg(MjClient.endoneui, getCurrentMJBgType());
}
EndOnePanel.prototype.SetEndOneUserUI = function(node,off)
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
                        arry[i].setScale(arry[i].getScale()*1.12);
                    }
                    MjClient.endoneui.CardLayoutForEndOne(node, pl);
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
        }, allScore: {
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
        if(pl.putCardAfterTing >= 0 && pl.putCardAfterTing != -1)
        {
            _tingIcon.visible = true;
            var _cd = pl.mjput[pl.putCardAfterTing];
            _tingIcon.setColor(cc.color(190, 190, 190));
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

EndOnePanel.prototype.CardLayoutForEndOne = function(node, endonepl)
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
        if(count % 3 == 2 && mjhandNum == pl.mjhand.length)
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
    // var tData = sData.tData;
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

                if((MjClient.data.sData.tData.hunCard && MjClient.data.sData.tData.hunCard == ci.tag) ||
                    (MjClient.data.sData.tData.hunCard2 && MjClient.data.sData.tData.hunCard2 == ci.tag))
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
                console.log("--------newC--------"+newC);
                if(newC && endonepl)
                {
                    ci.x = ci.x + slotwith + 10;
                }
                else if(newC)
                {
                    ci.x = ci.x + slotwith + 10;
                    ci.y += 20;
                }

                //如果胡牌，pl.winType（胡牌类型）一定大于0
                if(newC && pl.winType && pl.winType > 0)
                {
                    var cardTag = new ccui.ImageView("playing/other/huTag.png");
                    cardTag.setPosition(newC.getContentSize().width*0.9,newC.getContentSize().height *0.8);
                    cardTag.setScale(2.2);
                    newC.addChild(cardTag,50);
                }
            }
        }
        else
        {
            ci.x = start.x + upSize.width * upS;
        }

        // 小结算吃碰杠手牌位置调整
        if(ci.name !== "mjhand" && ci.name !== "standPri" && !ci.isgang4)
        {
            ci.y = start.y - upSize.height * upS * 0.08;
        }

    }
}