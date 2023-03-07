

function addWxHeadToEndUI_rugaoMJH(node,off)
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

function SetEndOneUserUI_rugaoMJH(node,off)
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
            upEndOne: {
				_visible: false
				, _run: function () {
					var arry = [];
                    //MjClient.playui._BtnCardType.bSimple = true;//结算用简体
					//明杠
					for (var i = 0; i < pl.mjgang0.length; i++) {

						for (var j = 0; j < 4; j++) {
                            arry.push(getNewCard_changpai(node, "upEndOne", "gang0", pl.mjgang0[i], 0));
						}
					}

                    //暗杠，要排除龙的
                    var _gang1 = [];
                    for (var i = 0; i < pl.mjgang1.length; i++) {
                        if (pl.long.indexOf(pl.mjgang1[i]) == -1) {
                            _gang1.push(pl.mjgang1[i]);
                        }
                    }


					//添加暗杠
					for (var i = 0; i < _gang1.length; i++) {
						for (var j = 0; j < 4; j++) {
                            arry.push(getNewCard_changpai(node, "upEndOne", "gang1", _gang1[i], 0));
						}
					}

                    //添加龙
                    for (var i = 0; i < pl.long.length; i++) {
                        for (var j = 0; j < 4; j++) {
                            arry.push(getNewCard_changpai(node, "upEndOne", "long", pl.long[i], 0));
                        }
                    }

					//添加碰
					for (var i = 0; i < pl.mjpeng.length; i++) {
						for (var j = 0; j < 3; j++) {
							arry.push(getNewCard_changpai(node, "upEndOne", "peng", pl.mjpeng[i], 0));
						}
					}

					//添加手牌
					for (var i = 0; i < pl.mjhand.length; i++) {

						arry.push(getNewCard_changpai(node, "stand", "mjhand", pl.mjhand[i], 0));
					}

					for (var i = 0; i < arry.length; i++) {
						arry[i].visible = true;
						arry[i].enabled = false;
                        arry[i].setScale(arry[i].getScale()*0.9);
					}
					//var pl = getUIPlayer_changpai(off);
                    //var pl = getUIPlayer_changpai(off);//获取玩家信息.off 为0 ，就是自己得信息，能看到自己摸牌 by sking
                    cc.log("===================== off = " + off );
                    cc.log("====game end ================= mjhand = " +pl.mjhand );
					CardLayoutRestore_MJH(node, pl);
                    //MjClient.playui. (node, 0)
				},
			},
			stand: {
				_visible: false,
			},
            stand_0: {
                _visible: false,
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
    addWxHeadToEndUI_rugaoMJH(uibind.head._node,off);
	//uibind.winNum._node.y=uibind.head._node.y;
}

CardLayoutRestore_MJH = function(node, pl)
{
    // node 是克隆新建的一个麻将节点 by sking
    var newC = null; //先创建麻将的UI节点
    var newVal = 0; //新牌的值，是几万，几筒，几条....为数字

    //var pl = MjClient.getPlayerByIndex(off);
    var mjhandNum = 0;
    var children = node.children;
    // for(var i = 0; i < children.length; i++)
    // {
    //     var ci = children[i];
    //     if(ci.name == "mjhand")
    //     {
    //         mjhandNum++;
    //         if((typeof MjClient.init_y) == 'undefined')
    //         {
    //             MjClient.init_y = ci.y;
    //         }
    //
    //         ci.y = MjClient.init_y;
    //     }
    // }

    for(var i = 0; i < children.length; i++)
    {
        if(children[i].name == "mjhand" )
        {
            mjhandNum++;
            setStandUIY(children[i]);
        }
    }

    var tempMaJiang = MjClient.majiang; //麻将的各种方法判断，是否可以杠，是否可以吃... by sking


    //排序麻将的位置 by sking
    if (pl.mjhand && pl.mjhand.length > 0)
    {
        var count = tempMaJiang.CardCount(pl);
        cc.log("====================---new val==== " + count);
        if(count == 23 && mjhandNum == pl.mjhand.length)
        {
            // if(pl.isNew ) //isNew 每次摸完牌后设为true,打出去一张牌后 设为false by sking
            // {
            //
            //     newVal = pl.mjhand[pl.mjhand.length - 1]; //为什么取最后一个节点 ？
            //     cc.log("-----------new val 11= " + newVal);
            // }
            // else
            // {
            //     pl.mjhand.sort(function(a, b)
            //     {
            //         if(tempMaJiang.isEqualHunCard(a))
            //         {
            //             return -1;
            //         }
            //         else if (tempMaJiang.isEqualHunCard(b))
            //         {
            //             return 1;
            //         }
            //         else
            //         {
            //             return a - b;
            //         }
            //     });

                newVal = pl.mjhand[pl.mjhand.length - 1];
                cc.log("-----------new val22 = " + newVal);
            //}
        }
    }
    //up stand 是2种麻将的图。
    //var up = node.getChildByName("up");
    var stand = node.getChildByName("stand");
    var stand_0 = node.getChildByName("stand_0");

    var upSize = stand.getSize();
    var upS = stand.scale;
    //mjhand standPri out chi peng gang0 gang1
    var uipeng = [];
    var uigang0 = [];
    var uigang1 = [];
    var uichi = [];
    var uistand = [];
    var uihun = [];//癞子牌在最左边
    var uilong = [];
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
        else if (ci.name == "long")
        {
            uilong.push(ci);
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
        uistand.push(newC); //把这张牌放入手牌的数组里  by sking

        cc.log("====================---new newC==== " + newC.tag);
    }
    var uiOrder = [uigang1, uigang0,uilong, uipeng, uichi, uistand];
    // if(off == 1 || off == 2)
    // {
    //     uiOrder.reverse();//颠倒顺序
    // }
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
    cc.log("555555555555555-------------------------pl.mjgang1 = "+ JSON.stringify(pl.mjgang1));
    //排序
    //按照顺序存贮节点，杠
    var _uigang1 = [];
    for(var a = 0;a < pl.mjgang1.length;a++)
    {
        for(var b = 0;b < uigang1.length;b++)
        {
            var _ci = uigang1[b];
            if(_ci.tag  == pl.mjgang1[a])
            {
                cc.log("--------------------mjgang1 = " + _ci.tag);
                _uigang1.push(_ci);
            }
        }
    }
    uigang1 = _uigang1;

    //按照顺序存贮节点，杠
    cc.log("555555555555555-------------------------pl.mjgang0 = "+ JSON.stringify(pl.mjgang0));
    var _uigang0 = [];
    for(var a = 0;a < pl.mjgang0.length;a++)
    {
        for(var b = 0;b < uigang0.length;b++)
        {
            var _ci = uigang0[b];
            if(_ci.tag  == pl.mjgang0[a])
            {
                cc.log("---------------------gang0 = " + _ci.tag);
                _uigang0.push(_ci);
            }
        }
    }
    uigang0 = _uigang0;

    var _uilong = [];
    for(var a = 0;a < pl.long.length;a++)
    {
        for(var b = 0;b < uilong.length;b++)
        {
            var _ci = uilong[b];
            if(_ci.tag  == pl.long[a])
            {
                cc.log("--------------------long = " + _ci.tag);
                _uilong.push(_ci);
            }
        }
    }
    uilong = _uilong;


    //按照顺序存贮节点,碰
    cc.log("5555555555555555-------------------------pl.mjpeng = "+ JSON.stringify(pl.mjpeng));
    var _uipeng = [];
    for(var a = 0;a < pl.mjpeng.length;a++)
    {
        for(var b = 0;b < uipeng.length;b++)
        {
            var _ci = uipeng[b];
            if(_ci.tag  == pl.mjpeng[a])
            {
                cc.log("===============mjpeng = " + _ci.tag);
                _uipeng.push(_ci);
            }
        }
    }
    uipeng = _uipeng;


    //if(off == 0)
    {
        var chipenggangCount = 0;
        var _onechipenggangWith = upSize.width * upS * 0.85;//0.05;
        var _uiDx = _onechipenggangWith*(3 + 0.2); ;//0.05;
        //var _uiDy = upSize.height * upS * 0.1;
        var standStartX = stand.x;//MjClient.size.width*0.27// ;upSize.width * upS * 4;//左边的起点
        var leftStartX = standStartX;//左边的起点
        var uiArray0 = [uigang0,uigang1,uilong, uipeng, uichi];
        var StandY = stand.y;
        var secStandY = stand_0.y;
        var bchigangChanged = false;//吃碰杠是否需要换行

        chipenggangCount = pl.mjpeng.length + pl.mjgang0.length + pl.mjgang1.length + pl.long.length;
        cc.log("standStartXstandStartXstandStartX " + standStartX);
        var currentCount = 0;
        var bFirstCard = true;

        for(var i = 0;i < uiArray0.length;i++)
        {
            var _uis = uiArray0[i];
            var _idx = 0;
            if(_uis.length > 0)//碰，杠，吃，之间的间距
            {
                currentCount++;
                if(bFirstCard)
                {
                    bFirstCard = false;
                }
                else
                {
                    leftStartX += _uiDx;
                }
            }
            else
            {
                continue;
            }


            for(var j = 0;j < _uis.length;j++)
            {
                var ci = _uis[j];
                if(i === 0 )//明杠
                {
                    if(_idx === 4)
                    {
                        _idx = 0;
                        leftStartX += _uiDx;
                        currentCount++;
                    }
                    else if(_idx === 3)
                    {
                        var _centerCardPos = _uis[j - 2].getPosition();
                        ci.setPosition(_centerCardPos.x,_centerCardPos.y + upSize.height * upS*0.18);
                        ci.zIndex = 15;
                    }
                    cc.log("明杠-----" + _idx);
                }
                else if(i === 1 || i === 2)//暗杠
                {
                    if(_idx === 4)
                    {
                        _idx = 0;
                        leftStartX += _uiDx;
                        currentCount++;

                        ci.loadTexture(getNewMJBgFile("playing/MJ/Mj_04.png"));
                        ci.removeAllChildren();
                    }
                    else if(_idx != 3)
                    {
                        ci.loadTexture(getNewMJBgFile("playing/MJ/Mj_04.png"));
                        ci.removeAllChildren();
                    }
                    else if(_idx === 3)
                    {
                        var _centerCardPos = _uis[j - 2].getPosition();
                        ci.setPosition(_centerCardPos.x,_centerCardPos.y + + upSize.height * upS*0.18);
                        ci.zIndex = 15;
                    }
                    cc.log("暗杠-----" + _idx);
                }
                else if(i == 3 || i == 4) //碰，吃 三张牌
                {
                    if(_idx == 3)
                    {
                        _idx = 0;
                        leftStartX += _uiDx;
                        currentCount++;
                    }
                }

                var bGangCardSet = false;
                if(i == 1 ||i == 0 || i == 2)//杠的有一张牌放在中间上面
                {
                    if(_idx == 3)
                    {
                        bGangCardSet = true;//杠的第四张牌
                    }
                }

                if(!bchigangChanged && currentCount > 4)
                {
                    cc.log("要换行了-----currentCount = " + currentCount);
                    StandY = secStandY;
                    leftStartX = standStartX - _onechipenggangWith;//左边的起点
                    bchigangChanged = true;
                }

                if(!bGangCardSet)
                {
                    ci.x = leftStartX + _onechipenggangWith*_idx;
                    ci.y = StandY;
                    ci.zIndex = (10 - _idx);
                }
                _idx++;
            }
        }

        cc.log("======================chipenggangCount = " + currentCount);
        cc.log("======================standStartX = " + standStartX);

        //////////////////////////////////////////
        //手牌
        //////////////////////////////////////////
        var withPengGang = (currentCount > 0) ? _onechipenggangWith*0.5 : 0;
        var _onecCardWith = upSize.width * upS * 1;//0.05;
        var handStartX = standStartX +　currentCount*_uiDx + withPengGang;    //MjClient.size.width - upSize.width * upS * 1.2;//屏幕宽度;

        var bChanged = false;
        for(var i = 0;i < uistand.length;i++)
        {
            var ci = uistand[i];

            var bsetChanged = false;
            ci.y = StandY;
            var ChangeIdx = currentCount*3 + i;
            if(ChangeIdx >= 11)
            {
                if(!bChanged)
                {
                    StandY = secStandY;
                    var addX = 0;
                    cc.log("======================currentCount = " + currentCount);
                    if(currentCount >= 4)
                    {
                        addX = (currentCount -4)*_uiDx;
                        cc.log("======================currentCount = " + currentCount);
                        cc.log("======================addX = " + addX);
                    }

                    handStartX = standStartX + addX;
                    bsetChanged = true;
                }
            }


            if(i !== 0)
            {
                var preStandX = uistand[i - 1].x;
                if(i === (uistand.length - 1))
                {
                    if(newC)
                    {
                        if(ChangeIdx == 11)//换行
                        {
                            ci.x = standStartX;
                        }
                        else
                        {
                            ci.x = preStandX + _onecCardWith + slotwith;
                        }
                        ci.setColor(cc.color(255, 255, 255));
                        ci.y += 20;
                    }
                    else
                    {
                        if(ChangeIdx == 11)//换行
                        {
                            ci.x = standStartX;
                            cc.log("===========222===========standStartX = " + standStartX);
                        }
                        else
                        {
                            ci.x = preStandX + _onecCardWith;
                        }
                        ci.setColor(cc.color(255, 255, 255));
                    }
                }
                else
                {
                    if(!bChanged && ChangeIdx >= 11)//换行
                    {
                        ci.x = standStartX + withPengGang ;
                        ci.y = secStandY;
                        //StandY = secStandY;
                        //handStartX = standStartX;
                        cc.log("======================standStartX = " + standStartX);
                    }
                    else
                    {
                        ci.x = preStandX + _onecCardWith;
                    }
                }
            }
            else
            {
                if(!bChanged && ChangeIdx >= 11)
                {
                    ci.x = handStartX + withPengGang;
                    ci.y = secStandY;
                    //StandY = secStandY;
                    //handStartX = standStartX;
                }
                else
                {
                    ci.x = handStartX;
                }
            }

            ci.zIndex++;
            if(!bChanged)
            {
                bChanged = bsetChanged;
            }


            /*
             听牌的时候
             */
            // var isGray =  pl.isTing && ci.name == "mjhand";
            // if(MjClient.clickTing)
            // {
            //     if (ci.name == "mjhand")
            //     {
            //         if(MjClient.canTingCards[ci.tag])
            //         {
            //             ci.setColor(cc.color(255, 255, 255));
            //             if (!hasUp) {
            //                 ci.y += 20;
            //                 hasUp = true;
            //             }
            //         }
            //         else {
            //             ci.setColor(cc.color(190, 190, 190));
            //         }
            //     }
            //     else {
            //         ci.setColor(cc.color(255, 255, 255));
            //     }
            // }
            // else if(i == uistand.length - 1)
            // {
            //     console.log(ci.tag+"--------newC--------"+newC);
            //     if(newC)
            //     {
            //         ci.setColor(cc.color(255, 255, 255));
            //         SetTouchCardHandler_changpai(stand, ci);
            //         // ci.x = ci.x + slotwith + 10;
            //         // ci.y += 20;
            //     }
            //     else if(isGray)
            //     {
            //         ci.setColor(cc.color(190, 190, 190));
            //         ci.addTouchEventListener(function () {});
            //     }
            //     else
            //     {
            //         ci.setColor(cc.color(255, 255, 255));
            //         SetTouchCardHandler_changpai(stand, ci);
            //     }
            // }
            // else if(isGray)
            // {
            //     ci.setColor(cc.color(190, 190, 190));
            //     ci.addTouchEventListener(function () {});
            // }
            // else
            // {
            //     ci.setColor(cc.color(255, 255, 255));
            //     SetTouchCardHandler_changpai(stand, ci);
            // }
        }
    }
};

var EndOneView_rugaoMJH = cc.Layer.extend({
	jsBind:{
        block: {
            _layout: [[1, 1], [0.5, 0.5], [0, 0], true]
        },
		back:{
            _layout:[[1.0,1.0],[0.5,0.5],[0,0]]
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
                    if(pl.mjput)
                    {
                        pl.mjput = [];
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
                    MjClient.MJPass2NetForrugaoMJH();
                }
				reInitarrCardVisible();
			}
		},
		dir:
		{
			_visible:true,
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
		   _run:function(){ SetEndOneUserUI_rugaoMJH(this,0); },

		}
		,head1:{
		   head:{
			   zhuang:{_visible:false}
		   },
	       winNum:{
			   // _layout:[[0.08,0.08],[1,0.5],[-2.5,0.75]]
		   },
		  _run:function(){ SetEndOneUserUI_rugaoMJH(this,1); }
		}
		,head2:{
		   head:{
			   zhuang:{_visible:false}
		   },
	       winNum:{
			   // _layout:[[0.08,0.08],[1,0.5],[-2.5,-0.75]]
		   },
		   _run:function(){ SetEndOneUserUI_rugaoMJH(this,2); }
		}
		}
	},
    ctor:function () {
        this._super();
        var endoneui = ccs.load(res.EndOne_rugao_MJH_json);
		BindUiAndLogic(endoneui.node,this.jsBind);
        this.addChild(endoneui.node);

        var _dir = endoneui.node.getChildByName("back").getChildByName("dir");
        _dir.ignoreContentAdaptWithSize(true);
        //时间
        var _back = endoneui.node.getChildByName("back");
        var _time =  _back.getChildByName("time");
        _time.visible = true;

        var _jiangpai = endoneui.node.getChildByName("back").getChildByName("hunCard");
        if(_jiangpai)
        {
            setCardSprite_changpai(_jiangpai, MjClient.data.sData.tData.hunCard,4);
        }

        _time.setString(MjClient.roundEndTime);
        _time.ignoreContentAdaptWithSize(true);

		MjClient.endoneui=this;

        changeMJBg(this, getCurrentMJBgType());

 		return true;
    }
});