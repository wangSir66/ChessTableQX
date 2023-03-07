

function addWxHeadToEndUI_rugaoER(node,off)
{
    var pl = MjClient.getPlayerByIndex(off);
    //var pl= getUIPlayer_changpai(off);
    var img = "png/default_headpic.png";
    //if(pl && pl.wxHeadImg)
    //{
    //    img = pl.wxHeadImg;
    //}
    //else
    //{
    //    return;
    //}
    if(pl && pl.info.headimgurl)
    {
        cc.loader.loadImg(pl.info.headimgurl, { isCrossOrigin: true }, function(err, texture) {
            if (!err && texture) {
                img = texture;
            }
        });
    }
    else
    {
        return;
    }
    var sp = new cc.Sprite(img);
    node.addChild(sp);
    var frame = node.getChildByName("frame");
    if (frame){
        frame.zIndex = sp.zIndex + 1;
    }
    setWgtLayout(sp,[0.88,0.88],[0.5,0.5],[0,0],false,true);
}

function SetEndOneUserUI_rugaoER(node,off)
{
	var sData=MjClient.data.sData;
	var tData=sData.tData;
	//var pl= getUIPlayer_changpai(off);
    var pl = MjClient.getPlayerByIndex(off);
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

    node.getChildByName("huaX").zIndex = 11;
    node.getChildByName("huaIcon").zIndex = 11;
    var huaCount = node.getChildByName("huaCount");
    huaCount.zIndex = 11;

    var tData = MjClient.data.sData.tData;
    if(tData.areaSelectMode.flowerType == WithFlowerType.noFlower)
    {
        huaCount.visible = false;
        node.getChildByName("huaX").visible = false;
        node.getChildByName("huaIcon").visible = false;
    }else{

        changeAtalsForLabel(huaCount, pl.mjflower.length);
    }


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

    var maizhuangIcon = node.getChildByName("icon_zhuang");
    maizhuangIcon.zIndex = 11;
    if (pl.jiazhuNum > 0)
    {
        maizhuangIcon.setVisible(true);
    }
    else
    {
        maizhuangIcon.setVisible(false);
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
                    MjClient.playui._BtnCardType.bSimple = true;//结算用简体
					//明杠
					for (var i = 0; i < pl.mjgang0.length; i++) {

						for (var j = 0; j < 4; j++) {
                            arry.push(getNewCard_changpai(node, "up", "gang0", pl.mjgang0[i], 0));
						}
					}

					//添加暗杠
					for (var i = 0; i < pl.mjgang1.length; i++) {
                        var cardCount = pl.mjgang1[i] == tData.hunCard ? 3 : 4;
                        for(var j = 0; j < cardCount; j++)
                        {
                            arry.push(getNewCard_changpai(node, "up", "gang1", pl.mjgang1[i], 0));
						}
					}
					//添加碰
					for (var i = 0; i < pl.mjpeng.length; i++) {
						for (var j = 0; j < 3; j++) {
							arry.push(getNewCard_changpai(node, "up", "peng", pl.mjpeng[i], 0));
						}
					}

					//添加手牌
					for (var i = 0; i < pl.mjhand.length; i++) {

						arry.push(getNewCard_changpai(node, "up", "mjhand", pl.mjhand[i], 0,"endOne"));
					}

					for (var i = 0; i < arry.length; i++) {
						arry[i].visible = true;
						arry[i].enabled = false;
                        arry[i].setScale(arry[i].getScale()*0.7);
					}
					//var pl = getUIPlayer_changpai(off);
                    cc.log("===================== off = " + off );
                    cc.log("===================== mjhand = " +pl.mjhand );
                    CardLayoutRestore_changpai_rugaoER(node, pl);
                    //MjClient.playui.CardLayoutRestore(node, 0)
				},
			},
			stand: {
				_visible: false,
			},
			cardType: {
				_run:function()
				{
                    this.zIndex = 100;
					this.ignoreContentAdaptWithSize(true);
				},
				_text: function () {
					// 胡数
                    var huScore;
                    if(!pl.huScore || pl.huScore <= 0) {
                        huScore = 0;
                    }
                    else {
                        huScore = pl.huScore;
                    }
                    return pl.mjdesc + ",胡数" + huScore;
				},
			}

		}
		, winNum: {
            _run: function () {
                this.ignoreContentAdaptWithSize(true);
            },
			_text: function () {
				var pre = "";
				if (pl.winone > 0) pre = "+";
				return pre + pl.winone;
			}
			, hu: {
				_run: function () {
                    this.x = this.getParent().width * 1.05; // 胡，自摸标志在分数105%的位置显示
                    setGameOverPanelPlayerState(this, pl, false);
				}
			}
            , fenshu_bg: {
                _run: function() {
                    this.x = this.getParent().width / 2;
                }
            }
            , fenshu: {
                _run:function()
                {
                    this.ignoreContentAdaptWithSize(true);
                },
            }
		}
        , winNum_0: {
            _text: function () {


                if(pl.huScore <= 0)
                {
                    return 0;
                }
                else
                {
                    cc.log("----------------huscore = " + pl.huScore);
                    if(!pl.huScore)
                    {
                        return 0;
                    }
                    return pl.huScore;
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
    addWxHeadToEndUI_rugaoER(uibind.head._node,off);
	//uibind.winNum._node.y=uibind.head._node.y;
}

CardLayoutRestore_changpai_rugaoER = function(node, pl)
{
    if(!pl) return;

    // node 是克隆新建的一个麻将节点 by sking
    var newC = null; //先创建麻将的UI节点
    var newVal = 0; //新牌的值，是几万，几筒，几条....为数字
    var pl = pl;////获取玩家信息.off 为0 ，就是自己得信息，能看到自己摸牌 by sking
    var mjhandNum = 0;
    var children = node.children;
    for(var i = 0; i < children.length; i++)
    {
        var ci = children[i];
        if(ci.name == "mjhand")
        {
            mjhandNum++;
            if((typeof MjClient.init_y) == 'undefined')
            {
                MjClient.init_y = ci.y;
            }

            ci.y = MjClient.init_y;
        }
    }
    var tempMaJiang = MjClient.majiang; //麻将的各种方法判断，是否可以杠，是否可以吃... by sking


    //排序麻将的位置 by sking
    if (pl.mjhand && pl.mjhand.length > 0)
    {
        var count = tempMaJiang.CardCount(pl);
        if(count == 23 && mjhandNum == pl.mjhand.length)
        {
            cc.log("------------------------isNew = ");
            if(pl.isNew ) //isNew 每次摸完牌后设为true,打出去一张牌后 设为false by sking
            {
                newVal = pl.mjhand[pl.mjhand.length - 1];
                cc.log("------------------------newVal = " + newVal);
            }
            else
            {
                // pl.mjhand.sort(function(a, b)
                // {
                //     if(tempMaJiang.isEqualHunCard(a))
                //     {
                //         return -1;
                //     }
                //     else if (tempMaJiang.isEqualHunCard(b))
                //     {
                //         return 1;
                //     }
                //     else
                //     {
                //         return a - b;
                //     }
                // });

                newVal = pl.mjhand[pl.mjhand.length - 1];
            }
        }
    }
    //up stand 是2种麻将的图。
    var up = node.getChildByName("up");
    var stand = node.getChildByName("stand");
    var left, right;
    left = up ;//取位置
    right = stand; //取Size

    var upSize = right.getSize();
    var upS = right.scale;
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
                newC = ci; //从down 节点下，复制一个麻将node保存在newC 里 by sking    //newC就是新摸的那张手牌
            }
            else
            {
                if(tempMaJiang.isEqualHunCard(ci.tag))
                {
                    uihun.push(ci);
                }
                else
                {
                    uistand.push(ci);
                }
            }
            if(tempMaJiang.isEqualHunCard(ci.tag))
            {
                ci.setColor(cc.color(255,255,63));
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
        else if(ci.name == "mjhand_replay")
        {
            uistand.push(ci);
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
        newC.setColor(cc.color(0, 255, 255));
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


    var hasUp = false;
    var typeCount = 0;


    /*
     sort by sking
     */
    //if(off == 0)
    {
        var _uiDx = upSize.width * upS * 1.3;//0.05;
        var _uiDy = upSize.height * upS * 0.12;
        //碰，杠，从左边作为起点
        var leftStartX = left.x;
        var uiArray0 = [uigang1, uigang0, uipeng, uichi];
        for(var i = 0;i < uiArray0.length;i++)
        {
            var _uis = uiArray0[i];
            var _idx = 0;
            if(_uis.length > 0)
            {
                leftStartX += _uiDx
            }
            for(var j = 0;j < _uis.length;j++)
            {
                var ci = _uis[j];
                ci.setScale(ci.getScale()*0.9);
                if(i == 0 || i == 1 )//杠是四张牌
                {
                    if(_idx == 4)
                    {
                        _idx = 0;
                        leftStartX += _uiDx;
                    }
                    else if (_idx == 3 && _uis[j - 1].tag == MjClient.data.sData.tData.hunCard) //如皋三张牌的杠
                    {
                        // cc.log("--------杠是四张牌----------");
                        _idx = 0;
                        leftStartX += _uiDx;
                    }

                    if(i == 0)
                    {
                        if(_idx != 0)
                        {
                            ci.loadTexture(getNewMJBgFile("playing/ChangPai/beimian.png"));
                        }
                        else
                        {
                            setCardSprite_CP(ci,ci.tag);
                        }
                    }

                }
                else if(i == 2 || i == 3) //碰，吃 三张牌
                {
                    if(_idx == 3)
                    {
                        _idx = 0;
                        leftStartX += _uiDx;
                    }
                }

                ci.x = leftStartX;
                ci.y = stand.y + _uiDy*_idx;
                ci.zIndex = (10 - _idx);
                _idx++;
            }
        }


        //手牌
        // var _CardWith = upSize.width * upS*24;
        // var scaleValue = MjClient.size.width/_CardWith;
        var _onecCardWith = upSize.width * upS * 1;//0.05;

        var rightStartX = right.x;//MjClient.size.width ; //- upSize.width * upS * 0.8;//屏幕宽度;
        for(var i = uistand.length - 1;i >= 0;i--)
        {
            var ci = uistand[i];
            ci.y = stand.y + 8;
            if(i == (uistand.length - 1))
            {
                ci.x = rightStartX;
                if(newC)
                {
                    ci.setColor(cc.color(255, 255, 255));
                    ci.x += 30;
                }
                else
                {
                    ci.setColor(cc.color(255, 255, 255));
                }
            }
            else
            {
                if(newC && i == (uistand.length - 2))
                {
                    ci.x = uistand[i + 1].x - _onecCardWith - slotwith;
                }
                else
                {
                    ci.x = uistand[i + 1].x - _onecCardWith;
                }
                //cc.log("=============cx = " + ci.x);
            }
        }
    }
};

var EndOneView_rugaoER = cc.Layer.extend({
	jsBind:{
        block: {
            _layout: [[1, 1], [0.5, 0.5], [0, 0], true]
        },
		back:{
            _layout:[[1,1],[0.5,0.5],[0,0]]
		,wintitle:
		{
			_visible:function(){
				  var pl=getUIPlayer_changpai(0);
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
				  var pl=getUIPlayer_changpai(0);
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

				  var pl=getUIPlayer_changpai(0);

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
				return !MjClient.remoteCfg.guestLogin;
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
                for(var i = 0; i < 3;i++)
                {
                    var pl = getUIPlayer_changpai(i)
                    if(pl && pl.mjput)
                    {
                        pl.mjput = [];
                    }
                    if(pl && pl.long)
                    {
                        pl.long = [];
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
                    MjClient.MJPass2NetForrugaoER();
                }
				reInitarrCardVisible();
			}
		},
		dir:
		{
			_visible:true,
            _run:function(){
                this.ignoreContentAdaptWithSize(true);
            },
			_text: function () {
                return getPlayingRoomInfo(3);
			}
		},
		head0:{
			head:{
				zhuang:{_visible:false}
			},
		    winNum:{
			},
		   _run:function(){ SetEndOneUserUI_rugaoER(this,0); },

		}
		,head1:{
		   head:{
			   zhuang:{_visible:false}
		   },
	       winNum:{
			   // _layout:[[0.08,0.08],[1,0.5],[-2.5,0.75]]
		   },
		  _run:function(){ SetEndOneUserUI_rugaoER(this,1); }
		}
		,head2:{
		   head:{
			   zhuang:{_visible:false}
		   },
	       winNum:{
			   // _layout:[[0.08,0.08],[1,0.5],[-2.5,-0.75]]
		   },
		   _run:function(){ SetEndOneUserUI_rugaoER(this,2); }
		}
		}
	},
    ctor:function () {
        this._super();
        var endoneui = ccs.load(res.EndOne_rugaoER_json);
		BindUiAndLogic(endoneui.node,this.jsBind);
        this.addChild(endoneui.node);

        var _dir = endoneui.node.getChildByName("back").getChildByName("dir");
        _dir.ignoreContentAdaptWithSize(true);
        //时间
        var _back = endoneui.node.getChildByName("back");
        var _time =  _back.getChildByName("time");
        _time.visible = true;

        var _jiangpai = endoneui.node.getChildByName("back").getChildByName("hunCard");
        setCardSprite_changpai(_jiangpai, MjClient.data.sData.tData.hunCard);
        _time.setString(MjClient.roundEndTime);
        _time.ignoreContentAdaptWithSize(true);

		MjClient.endoneui=this;
 		return true;
    }
});