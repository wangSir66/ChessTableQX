/**
 * Created by Administrator on 2017/3/9.
 */
var actionZindex = 1000;
var _isAniShow_Haian = false; //为了控制mjhand之后播骰子动画时newCard的状态显示
//向服务器发送 过消息
MjClient.MJPass2NetForhaian = function()
{
   // console.log(">>>>>>>>>普通  过 <<<<<<<<");
    cc.log("====================send======pass=====");
    var sData = MjClient.data.sData;
    var tData = sData.tData;

    if(IsTurnToMe() && tData.tState == TableState.waitPut)
    {
        var eat = MjClient.playui.jsBind.eat;
        var msg = "确认过";
        if(eat.gang0._node.visible)
        {
            msg += " 杠 ";
        }

        if(eat.hu._node.visible)
        {
            msg += " 胡 ";
        }

        msg = msg + "吗?"
        MjClient.showMsg(msg, function()
        {
            //cc.log("==========1=============");
            eat.gang0._node.visible = false;
            eat.hu._node.visible = false;
            eat.guo._node.visible = false;
            eat.ting._node.visible = false;
            eat.cancel._node.visible = false;
            MJPassConfirmToServer();
        }, function() {}, "1");
    }
    else
    {
        if(MjClient.playui.jsBind.eat.hu._node.visible)
        {
            MjClient.showMsg("确认不胡吗?", MJPassConfirmToServer, function() {}, "1");
        }
        else
        {
            MJPassConfirmToServer();
        }
    }
}


//处理出牌,放一张牌，打牌动作
function DealMJPut_haian(node, msg, off, outNum)
{
    if(COMMON_UI3D.is3DUI()) return COMMON_UI3D.DealMJPut_3D(node, msg, off, outNum);
    cc.log("======DealMJPut_haian======= " + off);
    //cardPutted = false;
    var sData = MjClient.data.sData;
    var tData = sData.tData;

    var uids = tData.uids;
    var selfIndex = getPlayerIndex(off);
    if(uids[selfIndex] == msg.uid)
    {
        var pl = sData.players[msg.uid];
        var putnum = outNum >= 0 ? outNum : (pl.mjput.length - 1);
        var tingIndex = pl.tingIndex;//沭阳麻将需要

        cc.log( off + "------------- pl.tingIndex =" + pl.tingIndex);
        cc.log("------------- pl.isTing =" + pl.isTing);

        if(cc.isUndefined(tingIndex) || !pl.isTing)
        {
            tingIndex = -1;//为了不报错;
        }


        var out0 = node.getChildByName("out0");
        var out1 = node.getChildByName("out1");
        var out2 = node.getChildByName("out2");

        var out0_self = getNode(0).getChildByName("out0");
        var out1_self = getNode(0).getChildByName("out1");
        var out2_self = getNode(0).getChildByName("out2");


        var maxNum = 10;
        if (MjClient.MaxPlayerNum == 2)
            maxNum = 20;
        else if (MjClient.MaxPlayerNum == 3 && off != 0)
            maxNum = 13;


        var out;
        var out_self;

        if (putnum >= maxNum*2 && out2)
        {
            out = out2.clone();
            out_self = out2_self.clone();
        }
        else if(putnum >= maxNum)
        {
            out = out1.clone();
            out_self = out1_self.clone();
        }
        else
        {
            out = out0.clone();
            out_self = out0_self.clone();
        }

        //out = CommonPool.getFromPool("out");
        //if (!out) {
        //    out = out0.clone();
        //}else{
        //    COMMON_UI.CopyProperties(out, out0);
        //    cc.log("COMMON_UI.CopyProperties(out, out0);");
        //}


        out.setScale(out.getScale()*1.3);
        out_self.setScale(out_self.getScale()*1.3);
        var oSize = out.getSize();
        var oSc = out.scale;

        if (off == 0 && putnum >= maxNum * 2 && out2)
        {
            node.addChild(out,putnum + 30);
        }
        else if (off == 0 && putnum >= maxNum)
        {
            node.addChild(out,putnum + 20);
        }
        else if(off == 0)
        {
            node.addChild(out,putnum + 10);
        }
        else if(off == 1 )
        {
            node.addChild(out, putnum);
        }
        else if(off == 2 || off == 3)
        {
            node.addChild(out, 20 - putnum);
        }
        else
        {
            node.addChild(out);
        }

        for(var i = 0; i < node.children.length; i++)
        {
            if(node.children[i].name == "newout")
            {
                node.children[i].name = "out";
            }
        }

        out.visible = true;
        out.name = "out";
        setCardSprite(out, msg.card, off);

        var endPoint = cc.p(0, 0);
        var Midpoint = cc.p(0, 0);
        var ws = cc.director.getWinSize();
        if (putnum > maxNum*2 - 1 && out2)
        {
            out.x = out2.x;
            out.y = out2.y;
            putnum -= maxNum*2;
            tingIndex -= maxNum*2;
        }
        else if (putnum > maxNum - 1)
        {
            out.x = out1.x;
            out.y = out1.y;
            putnum -= maxNum;
            tingIndex -= maxNum;
        }


        //是否需要变宽
        var addWide =  0;
        if (tingIndex <= putnum && tingIndex >= 0 && MjClient.gameType != MjClient.GAME_TYPE.GUAN_NAN && MjClient.gameType != MjClient.GAME_TYPE.HUAI_AN_ERZ){
            if(off == 0 || off == 2)
            {
                addWide =  oSize.width * oSc *0.91;
            }
            else if (off  == 1 || off == 3)
            {
                addWide =  oSize.height * oSc *0.73;
            }
        }


        if(off == 0)
        {
            endPoint.y = out.y;
            endPoint.x = out.x + oSize.width * oSc * putnum*0.95 + addWide;
            Midpoint.x = ws.width / 2;
            Midpoint.y = ws.height*0.3;
            if(!(outNum >= 0))
            {
                if(RemoveNodeBack(node, "putOutCard", 1, msg.card) == 0)
                {
                    RemoveNodeBack(node, "mjhand", 1, msg.card);
                }
            }
        }
        else if (off == 1)
        {
            if(!(outNum >= 0))
            {
                if (MjClient.rePlayVideo == -1)
                    RemoveFrontNode(node, "standPri", 1);
                else//回放
                    RemoveFrontNode(node, "mjhand_replay", 1, msg.card);
            }
            cc.log("DealMJPut_haian remove card  = " + msg.card);
            endPoint.y = out.y + oSize.height * oSc * putnum * 0.7 + addWide;
            endPoint.x = out.x;
            Midpoint.x = ws.width *0.78;
            Midpoint.y = ws.height*0.57;
            out.zIndex = 100 - putnum;
        }
        else if(off == 2)
        {
            if(!(outNum >= 0))
            {
                if (MjClient.rePlayVideo == -1)
                    RemoveFrontNode(node, "standPri", 1);
                else//回放
                    RemoveFrontNode(node, "mjhand_replay", 1, msg.card);
            }

            endPoint.x = out.x - oSize.width * oSc * putnum*0.95 - addWide;
            endPoint.y = out.y;
            Midpoint.x = ws.width / 2;
            Midpoint.y = ws.height / 4 * 3;
        }
        else if (off == 3)
        {
            if(!(outNum >= 0))
            {
                if (MjClient.rePlayVideo == -1)
                    RemoveNodeBack(node, "standPri", 1);
                else
                    RemoveNodeBack(node, "mjhand_replay", 1, msg.card);
            }

            endPoint.y = out.y - oSize.height * oSc * putnum * 0.7 - addWide;
            endPoint.x = out.x;
            Midpoint.x = ws.width*(1- 0.78);
            Midpoint.y = ws.height * 0.57;
            out.zIndex = putnum;
        }





        if(outNum >= 0) //重连
        {
            // cc.log("==================tData = "+ JSON.stringify(tData));
            //断线重连的时候
            if (tData.lastPutCard == msg.card && tData.lastPutPlayer == tData.uids.indexOf(msg.uid))
            {
                out.x = endPoint.x;
                out.y = endPoint.y;
                clearCurrentPutTag();
                addCurrentPutTag(out, off);
            }

            if((outNum == pl.mjput.length - 1) && tData.curPlayer == selfIndex && tData.tState == TableState.waitEat)
            {

            }
            else
            {
                out.x = endPoint.x;
                out.y = endPoint.y;
                return;
            }
        }
        else //打牌
        {
            clearCurrentPutTag();
            //if (off != 0) addCurrentPutTag(out, off);
        }


        var zoder = out.zIndex;
        out.zIndex = 200;
        out.visible = false;
        out.x = Midpoint.x;
        out.y = Midpoint.y;
        out.scale = 2 * oSc;
        out.name = "newout";



        //var outAction = CommonPool.getFromPool("outAction");
        //var muban;
        //if (off != 0) {
        //    muban = out0_self;
        //}else{
        //    muban = out;
        //}
        //if (!outAction) {
        //    outAction = muban.clone();
        //}else{
        //    COMMON_UI.CopyProperties(outAction, muban);
        //    cc.log("COMMON_UI.CopyProperties(outAction, muban);");
        //}
        //if (off != 0) {
        //    outAction.setScale(outAction.getScale()*1.3);
        //}

        var outAction = null;
        if (off != 0)
        {
            outAction = out_self.clone();
            setCardSprite(outAction, msg.card, 0);
        }
        else
        {
            outAction = out.clone();
            setCardSprite(outAction, msg.card, off);
        }
        outAction.name = "outAction";
        outAction.visible = true;
        node.addChild(outAction);
        outAction.zIndex = 200;




        var RemovePutCard = function (onlySelf, huNoAction)
        {
            if (!huNoAction) {
                MjClient.lastCardposNode = null;//抢杠胡没有牌 可以劈
            }

            if (!cc.sys.isObjectValid(outAction))
            {
                return;
            }

            if (!onlySelf)
            {
                var _delayTime = 1;
                if(off == 0) _delayTime = 0.5;

                var delayNum = _delayTime - (Date.now() - putTime) / 1000;
                if (delayNum < 0)
                {
                    delayNum = 0;
                }
                //outAction.setScale(outAction.getScale()*1.2);
                if (huNoAction) {
                    outAction.removeFromParent();
                    if(cc.sys.isObjectValid(out))
                    {
                        out.visible = true;
                        out.zIndex = zoder;
                        out.setPosition(endPoint);
                        out.setScale(oSc);
                        addCurrentPutTag(out, off);
                    }
                }
                else {
                    outAction.runAction(cc.sequence(
                        cc.delayTime(delayNum),
                        cc.callFunc(function()
                        {
                            if(cc.sys.isObjectValid(out))
                            {
                                out.visible = true;
                                out.runAction(cc.sequence(
                                    cc.spawn(cc.moveTo(0.1, endPoint), cc.scaleTo(0.1, oSc)),
                                    cc.callFunc(function(){
                                        out.zIndex = zoder;
                                        addCurrentPutTag(out, off);
                                    })
                                ));
                            }
                            //CommonPool.putInPool(outAction);
                            //outAction.removeFromParent();
                        }),
                        cc.removeSelf()
                    ));
                }
            }
            else
            {
                //CommonPool.putInPool(outAction);
                outAction.removeFromParent();
            }
        }



        var outActionBind =
        {
            _event:
            {
                MJPass: function()
                {
                    RemovePutCard(false);
                },
                waitPut: function()
                {
                    RemovePutCard(false);
                },
                MJChi: function()
                {
                    RemovePutCard(true);
                },
                MJPeng: function()
                {
                    RemovePutCard(true);
                },
                MJGang: function(eD)
                {
                    RemovePutCard(true);
                },
                roundEnd: function()
                {
                    RemovePutCard(true);
                },
                MJHu:function()
                {
                    if (MjClient.gameType == MjClient.GAME_TYPE.XUE_LIU) { // 血流胡牌去除动画效果
                        RemovePutCard_2(false,true);
                    }
                    else {
                        RemovePutCard(false, true);
                    }
                }
                //MJFlower: function () {
                //    RemovePutCard(false);
                //}
            }
        }



        var RemovePutCard_2 = function (onlySelf,type)
        {
            if (!type) 
            {
                MjClient.lastCardposNode = null;//抢杠胡没有牌 可以劈
            }

            if (!onlySelf)
            {
                if (cc.sys.isObjectValid(outAction))
                {
                    outAction.runAction(cc.sequence(
                        cc.delayTime(1),
                        //cc.callFunc(function(){
                        //    CommonPool.putInPool(outAction);
                        //    outAction.removeFromParent();
                        //})
                        cc.removeSelf()
                    ));
                }
            }
            else
            {
                if (cc.sys.isObjectValid(outAction))
                {
                    if (type) 
                    {                      
                        outAction.runAction(cc.sequence(
                            cc.delayTime(1),
                            //cc.callFunc(function(){
                            //    outAction.stopAllActions();
                            //    CommonPool.putInPool(outAction);
                            //    outAction.removeFromParent();
                            //})
                            cc.removeSelf()
                        ));
                    }
                    else
                    {                    
                        outAction.stopAllActions();
                        //CommonPool.putInPool(outAction);
                        outAction.removeFromParent();
                    }
                }
                if (cc.sys.isObjectValid(out))
                {
                    if (type) 
                    {                    
                        out.runAction(cc.sequence(
                            cc.delayTime(1),
                            cc.callFunc(function(){
                                out.visible = false;
                                clearCurrentPutTag();
                            })
                        ));
                    }
                    else
                    {                    
                        out.visible = false;
                        clearCurrentPutTag();
                    }
                }
            }
        }

        var outActionBind_2 =
        {
            _event:
            {
                waitPut: function()
                {
                    RemovePutCard_2(false);
                },
                MJChi: function()
                {
                    RemovePutCard_2(true);
                },
                MJPeng: function()
                {
                    RemovePutCard_2(true);
                },
                MJGang: function(eD)
                {
                    RemovePutCard_2(true);
                },
                roundEnd: function()
                {
                    RemovePutCard_2(true);
                },
                MJHu:function()
                {
                    if (MjClient.gameType == MjClient.GAME_TYPE.XUE_LIU) { // 血流胡牌去除动画效果
                        RemovePutCard_2(false,true);
                    }
                }
            }
        }


        var putTime = Date.now();
        if (off == 0 && MjClient.rePlayVideo == -1)
        {
            outAction.x = Midpoint.x;
            outAction.y = Midpoint.y;
            outAction.scale = 2*oSc;
            //RemovePutCard(false);
            outAction.runAction(cc.sequence(
                cc.delayTime(0.5),
                cc.callFunc(function()
                {
                    if(cc.sys.isObjectValid(out))
                    {
                        out.visible = true;
                        out.runAction(cc.sequence(
                            cc.spawn(cc.moveTo(0.1, endPoint), cc.scaleTo(0.1, oSc)),
                            cc.callFunc(function(){
                                out.zIndex = zoder;
                                addCurrentPutTag(out, off);
                            })
                        ));
                    }
                }),
                cc.hide()
            ));
            BindUiAndLogic(outAction, outActionBind_2);
        }
        else
        {
            outAction.x = node.getChildByName("stand").x;
            outAction.y = node.getChildByName("stand").y;
            outAction.scale = oSc;
            outAction.runAction(cc.spawn(cc.moveTo(0.1, Midpoint), cc.scaleTo(0.1, 2 * oSc)));
            var pl = sData.players[SelfUid()+""];
            if (tData.tState != TableState.waitEat || (pl && pl.eatFlag == 0))//自己没有吃碰杠等操作
            {
                //RemovePutCard(false);
                outAction.runAction(cc.sequence(
                    cc.delayTime(0.5),
                    cc.callFunc(function()
                    {
                        if(cc.sys.isObjectValid(out))
                        {
                            out.visible = true;
                            out.runAction(cc.sequence(
                                cc.spawn(cc.moveTo(0.1, endPoint), cc.scaleTo(0.1, oSc)),
                                cc.callFunc(function(){
                                    out.zIndex = zoder;
                                    addCurrentPutTag(out, off);
                                })
                            ));
                        }
                    }),
                    cc.hide()
                ));
                BindUiAndLogic(outAction, outActionBind_2);
            }
            else
            {
                BindUiAndLogic(outAction, outActionBind);
            }
        }



        if (!(outNum >= 0))
        {
            MjClient.playui.CardLayoutRestore(node, off);
        }

        //add by sking
        if(off == 0 && getUIPlayer(0).mjhand)
        {
            cc.log("----------------重新排列--------00000---------");
            MjClient.playui.CardLayoutRestore(node, off);
        }


        if (off != 0)
        {
            showMJOutBig(node, msg.card);
        }
    }
}


function showShaiziAni_haian(poff)
{
    if(poff == 0) {

        //摇骰子的时候全部隐藏
        var eat = MjClient.playui.jsBind.eat;
        eat.chi0._node.visible = false;
        eat.chi1._node.visible = false;
        eat.chi2._node.visible = false;
        eat.peng._node.visible = false;
        eat.gang0._node.visible = false;
        eat.gang1._node.visible = false;
        eat.gang2._node.visible = false;
        eat.hu._node.visible = false;
        eat.guo._node.visible = false;
        eat.cancel._node.visible = false;


        if(MjClient.rePlayVideo != -1 )//回放
        {
            for (var off = 0; off < 4; off++) {
                var _node = getNode(off);
                var children = _node.children;
                for(var i = 0; i < children.length; i++)
                {
                    var ni = children[i];
                    if(ni.name == "mjhand")
                    {
                        ni.removeFromParent(true);
                    }
                }
                clearCardUI(_node);
                InitUserHandUI_haian(_node, off);
            }
            playEffect("shuffle");
            MjClient.playui.EatVisibleCheck();
            return;
        }


        var _AniNode = MjClient.playui._AniNode;
        var tData = MjClient.data.sData.tData;
        var shaiziArray = tData.shaizi;
        var soundID = null;
        cc.log("shaiziArray = " + shaiziArray);
        _isAniShow_Haian = true;
        cc.spriteFrameCache.addSpriteFrames("playing/other/shaizi.plist","playing/other/shaizi.png");
        var firstFrame = new cc.Sprite("#shaizi_1.png");
        var frames = [];
        var prefix = "shaizi_";
        var fc = cc.spriteFrameCache;
        for (var i = 1; i <= 9; i++) {
            var name = prefix + i + ".png";
            cc.log("----------name = " + name);
            var f = fc.getSpriteFrame(name);
            if(f)
            {
                frames.push(f);
            }
        }
        var animate = cc.animate(new cc.Animation(frames, 0.1, 2));
        var playSoundFunc = cc.callFunc(function(){

            for (var off = 0; off < 4; off++) {
                var _node = getNode(off);
                var children = _node.children;
                for(var i = 0; i < children.length; i++)
                {
                    var ni = children[i];
                    if(ni.name == "mjhand" )
                    {
                        ni.removeFromParent(true);
                    }
                    if(ni.name == "stand" ){
                        cc.log("=====================stand false");
                        ni.visible = false;
                    }
                }
            }

            //todo...如果需要播骰子声音在这里
            soundID = playEffect("shaizi",true);
        });
        firstFrame.setPosition(cc.p(MjClient.size.width/2,MjClient.size.height/2));
        firstFrame.setScale(MjClient.size.height/800);

        var showPonitFunc = cc.callFunc(function(){
            var _shai1 = new ccui.ImageView("playing/other/shaizi/"+ (shaiziArray[0] + 1) + ".png");
            var _shai2 = new ccui.ImageView("playing/other/shaizi/"+(shaiziArray[1] + 1) +".png");
            _shai1.setPosition(cc.p((MjClient.size.width/2)*0.95,MjClient.size.height/2));
            _shai1.setName("shaizi");
            _shai2.setName("shaizi");
            _shai1.setScale(MjClient.size.height/800);
            _shai2.setScale(MjClient.size.height/800);
            _AniNode.addChild(_shai1,10000);
            _shai2.setPosition(cc.p((MjClient.size.width/2)*1.05 + 30,MjClient.size.height/2));
            _AniNode.addChild(_shai2,10000);
            firstFrame.visible = false;
            stopEffect(soundID);
        });


        firstFrame.runAction(cc.sequence(playSoundFunc, animate,showPonitFunc,cc.delayTime(0.8),cc.callFunc(function(){
            //发牌
            _isAniShow_Haian = false;
            var _Anichildren = _AniNode.children;
            for(var i = 0; i < _Anichildren.length; i++) {
                var _c = _Anichildren[i];
                if(_c.name == "shaizi")
                {
                    _c.removeFromParent(true);
                }
            }
            for (var off = 0; off < 4; off++) {
                var _node = getNode(off);
                var children = _node.children;
                for(var i = 0; i < children.length; i++)
                {
                    var ni = children[i];
                    if(ni.name == "mjhand")
                    {
                        ni.removeFromParent(true);
                    }
                }
                InitUserHandUI_haian(_node, off);
            }
            playEffect("shuffle");
            MjClient.playui.EatVisibleCheck();

            //添加显示骰子的显示
            var planel_shaizi =  _AniNode.getParent().getChildByName("Panel_shaizi");
            showShaiZiUI_haian(planel_shaizi);

        }),cc.removeSelf()));
        firstFrame.setName("shaiziAni");
        _AniNode.addChild(firstFrame,10000);
    }
}

//
// function setRoomInfo_haian()
// {
//     var _infoNode = MjClient.playui._downNode.getParent().getChildByName("node_roomInfo");
//     if(_infoNode)
//     {
//         setWgtLayout(_infoNode,[0.1, 0.1], [0, 1], [0, 0]);
//
//         var _tableIdNode = _infoNode.getChildByName("Image_1").getChildByName("tableid");
//         _tableIdNode.ignoreContentAdaptWithSize(true);
//         _tableIdNode.setString(MjClient.data.sData.tData.tableid);
//
//         var _roundInfoNode = _infoNode.getChildByName("info_bg").getChildByName("roundInfo");
//         var _info = MjClient.playui._downNode.getParent().getChildByName("roundInfo");
//         _info.visible = false;
//         cc.log("------------------_info.getString() = " + _info.getString());
//         _roundInfoNode.setString(_info.getString());
//
//         var _bannerNode = MjClient.playui._downNode.getParent().getChildByName("banner");
//         _bannerNode.getChildByName("tableid").visible = false;
//         _bannerNode.getChildByName("roomNo").visible = false;
//
//
//         var _info_bgNode = _infoNode.getChildByName("info_bg");
//         _info_bgNode.setPosition(cc.p(460.79,41.10));
//         _info_bgNode.setUserData(1);
//
//         var _btn_arrowNode = _infoNode.getChildByName("info_bg").getChildByName("btn_arrow");
//         _btn_arrowNode.setTouchEnabled(true);
//         _btn_arrowNode.runAction(cc.sequence(cc.fadeOut(0.4),cc.fadeIn(0.6)).repeatForever());
//         _btn_arrowNode.loadTexture("playing/other/roomInfo3.png");
//
//
//         _info_bgNode.scheduleOnce(function(){
//             _info_bgNode.runAction(cc.sequence(cc.moveTo(0.5,cc.p(143.79,41.10)),cc.callFunc(function(){
//
//             })));
//             _btn_arrowNode.loadTexture("playing/other/roomInfo2.png");
//             _info_bgNode.setUserData(0);
//         },5);
//
//         _btn_arrowNode.addTouchEventListener(function(sender,type){
//             if(type == 2)
//             {
//                 if(_info_bgNode.getUserData() == 0)
//                 {
//                     _info_bgNode.runAction(cc.sequence(cc.moveTo(0.5,cc.p(460.79,41.10)),cc.callFunc(function(){
//
//                     })));
//                     cc.log("------------------_info.getStri000000= " + _info.getString());
//                     _btn_arrowNode.loadTexture("playing/other/roomInfo3.png");
//                     _info_bgNode.setUserData(1);
//                 }
//                 else {
//                     _info_bgNode.runAction(cc.sequence(cc.moveTo(0.5,cc.p(143.79,41.10)),cc.callFunc(function(){
//                         //_btn_arrowNode.loadTexture("playing/other/roomInfo2.png");
//                     })));
//                     cc.log("------------------_info.getString() 11111111111= " + _info.getString());
//                     _btn_arrowNode.loadTexture("playing/other/roomInfo2.png");
//                     _info_bgNode.setUserData(0);
//                 }
//             }
//         },this);
//     }
// }

function updateHeadUI_haian(node, off , actionType)
{
    cc.log('updateHeadUI_haian', off)
    var pl = getUIPlayer(off);
    if(!pl) return;
    // showHandCard_MLHZ(node, off);
    showHandCard_haian(node,off);
    MjClient.playui.CardLayoutRestore(node, off);
    cc.log('updateHeadUI_haian update success', off)

    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var uids = tData.uids;
    var selfIndex = getPlayerIndex(off);
    if(tData.curPlayer == selfIndex)
    {
        ShowEatActionAnim(node, actionType, off);
    }
}


// 这个没看懂干嘛的
// off 是四个位置，根据off 显示四个位置的信息 by sking
function SetUserVisible_haian(node, off)
{
    /*摇色子，断网重连手牌异常bug*/
    var _AniNode = MjClient.playui._AniNode;
    var shaiziNode = _AniNode.getChildByName("shaiziAni");
    if(!shaiziNode)
    {
        _isAniShow_Haian = false;
    }

    if (_isAniShow_Haian)  // 解决摇骰子时断线重连调用本函数，会手牌重复的bug by cyc
        return;

    //var sData = MjClient.data.sData;
    //return;

    var pl = getUIPlayer(off);
    var head = node.getChildByName("head");
    var name = head.getChildByName("name");
    var nobody = head.getChildByName("nobody");
    var coin = head.getChildByName("coin");
    var offline = head.getChildByName("offline");
    var name_bg = head.getChildByName("name_bg");
    var score_bg = head.getChildByName("score_bg");


    if(pl)
    {
        cc.log("====================off======================" + JSON.stringify(pl));
        cc.log("====================off======================" + off);
        head.visible = true;
        name.visible = true;
        coin.visible = true;
        offline.visible = true;
        name_bg.visible = true;
        score_bg.visible = true;
        MjClient.loadWxHead(pl.info.uid, pl.info.headimgurl);
        setUserOffline(node, off);
        InitUserHandUI_haian(node, off);
        //GLog("pl.info.uid = "+pl.info.uid);
    }
    else
    {
        name.visible = false;
        coin.visible = false;
        offline.visible = false;
        coin.visible = false;
        var WxHead = nobody.getChildByName("WxHead");
        if(WxHead)
        {
            WxHead.removeFromParent(true);
        }
    }
}

function showHandCard_haian(node, off)
{
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var pl = getUIPlayer(off);
    if(!pl)
    {
        return;
    }

    var children = node.children;
    for(var i = 0; i < children.length; i++)
    {
        var child = children[i];
        var name = child.name;
        if(name == "peng"
            || name == "chi"
            || name == "gang0"
            || name == "gang1"
            || name == "mjhand"
            || name == "mjhand_replay"
            || name == "standPri")
        {
            if(cc.sys.isObjectValid(child)) child.removeFromParent(true);
        }

    }


    //添加碰
    for(var i = 0; i < pl.mjpeng.length; i++)
    {
        var idx = tData.uids.indexOf(pl.info.uid);
        var offIdx = (pl.pengchigang.peng[i].pos - idx + 4) % 4 - 1;//表示被碰的人和pl之间隔着几个人，如果是pl碰下家，则offIdx=0，pl碰上家，则offIdex=2
        var cdui = null;
        for(var j = 0; j < 3; j++)
        {
            if( (j % 3 == 2 - offIdx && off % 3 == 0) || (j % 3 == offIdx && off % 3 != 0) )
            {
                var cdui = getNewCard(node, "up", "peng", pl.mjpeng[i], off, "heng", "heng");
                setCardArrow(cdui, offIdx, off);
            }
            else
            {
                cdui = getNewCard(node, "up", "peng", pl.mjpeng[i], off);
            }
            if(j == 2)
            {
                cdui.ispeng3 = true;
            }
        }
    }


    //添加明杠
    for(var i = 0; i < pl.mjgang0.length; i++)
    {
        var idx = tData.uids.indexOf(pl.info.uid);
        //var offIdx = 0;
        //if(i < pl.pengchigang.gang.length)
        //{
        //    offIdx = (pl.pengchigang.gang[i].pos - idx + 4) % 4 - 1;
        //}
        //else {
        //    offIdx = (pl.pengchigang.pgang[i-pl.pengchigang.gang.length].pos - idx + 4) % 4 - 1;
        //}
        var offIdx = null;
        for (var j=0; j<pl.pengchigang.gang.length; j++)
        {
            if (pl.pengchigang.gang[j].card == pl.mjgang0[i])
            {
                offIdx = (pl.pengchigang.gang[j].pos - idx + 4) % 4 - 1;
                break;
            }
        }
        if (offIdx == null)
        {
            for (var j=0; j<pl.pengchigang.pgang.length; j++)
            {
                if (pl.pengchigang.pgang[j].card == pl.mjgang0[i])
                {
                    offIdx = (pl.pengchigang.pgang[j].pos - idx + 4) % 4 - 1;
                    break;
                }
            }
        }
        if (offIdx == null)
        {
            cc.log("InitUserHandUI:offIdx == null!!!!");
            offIdx = 0;
        }

        var setCardArrowOnGang4 = false;
        for(var j = 0; j < 4; j++)
        {
            if(j < 3)
            {
                if( (j % 3 == 2 - offIdx && off % 3 == 0) || (j % 3 == offIdx && off % 3 != 0) )
                {
                    var cdui = getNewCard(node, "up", "gang0", pl.mjgang0[i], off, "heng", "heng");
                    setCardArrow(cdui, offIdx, off);
                    if (j==1)
                    {
                        setCardArrowOnGang4 = true;
                    }
                }
                else
                {
                    getNewCard(node, "up", "gang0", pl.mjgang0[i], off);
                }
            }
            else
            {
                var cdui = getNewCard(node, "up", "gang0", pl.mjgang0[i], off, "isgang4");//最后一张牌放上面
                cdui.tag = pl.mjgang0[i];
                if (setCardArrowOnGang4)
                {
                    setCardArrow(cdui, offIdx, off);
                }
            }
        }
    }


    //添加暗杠
    for(var i = 0; i < pl.mjgang1.length; i++)
    {
        for(var j = 0; j < 4; j++)
        {
            if(j == 3)
            {
                getNewCard(node, "down", "gang1", 0, off, "isgang4").tag = pl.mjgang1[i];
            }
            else
            {
                getNewCard(node, "up", "gang1", pl.mjgang1[i], off);
            }
        }
    }

    //cc.log("pl.mjchi = " + pl.mjchi);
    var chiIdx = 0;
    var cdui = null;
    for(var i = 0; i < pl.mjchi.length; i++)
    {
        if(i % 3==0)
        {
            chiIdx++;
        }

        if(pl.mjchiCard[chiIdx-1] == pl.mjchi[i])//吃的横牌表示吃的是哪张牌
        {
            cdui = getNewCard(node, "up", "chi", pl.mjchi[i], off, "heng");
            setCardArrow(cdui, 2, off);
            setCardArrow_chi(cdui, 2, off);
        }
        else
        {
            cdui = getNewCard(node, "up", "chi", pl.mjchi[i], off);
        }

        if (i % 3 == 2) cdui.ischi3 = true;
    }

    //添加手牌
    if(MjClient.rePlayVideo == -1)//表示正常游戏
    {
        if(pl.mjhand && off === 0)
        {
            for(var i = 0; i < pl.mjhand.length; i++)
            {
                getNewCard(node, "stand", "mjhand", pl.mjhand[i], off);
            }
        }
        else if (pl.mjhand && pl.mjState === TableState.roundFinish) {
            COMMON_UI.showMjhandBeforeEndOnePlayer(off);
        }
        else
        {
            var CardCount = 0;
            if(tData.tState == TableState.waitPut && tData.uids[tData.curPlayer] == pl.info.uid)
            {
                CardCount = 14;
            }
            else
            {
                CardCount = 13;
            }

            var upCardCount = CardCount - ((pl.mjpeng.length + pl.mjgang0.length + pl.mjgang1.length) * 3 + pl.mjchi.length);
            for(var i = 0; i < upCardCount; i++)
            {
                getNewCard(node, "stand", "standPri");
            }
        }
    }
    else
    {
        /*
         播放录像
         */
        cc.log("_________________mjhand_replay_______________"+JSON.stringify(pl.mjhand));
        if (pl.mjhand)
        {
            if(off == 0)
            {
                for (var i = 0; i < pl.mjhand.length; i++) {
                    getNewCard(node, "stand", "mjhand", pl.mjhand[i], off);
                }
            }
            else
            {

                for (var i = 0; i < pl.mjhand.length && i < 13; i++) {
                    getNewCard(node, "up", "mjhand_replay", pl.mjhand[i], off);
                }
            }
        }

    }


}


function InitUserHandUI_haian(node, off)
{
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var pl = getUIPlayer(off);
    cc.log("--------InitUserHandUI_haian  off = " + off);
    if(!pl)
    {
        return;
    }
    cc.log("--------InitUserHandUI_haian  pl = " + JSON.stringify(pl));
    //初始化玩家金币和名称
    InitUserCoinAndName(node, off);
    setAreaTypeInfo(true);
    //setPlayerRoundDir(off);

    if(
        tData.tState != TableState.waitPut &&
        tData.tState != TableState.waitEat &&
        tData.tState != TableState.waitCard
    )
    {
        return;
    }

    setHunNodeVisible(false);
    showHandCard_haian(node,off)

    //添加打出的牌
    for(var i = 0; i < pl.mjput.length; i++)
    {
        var msg =
        {
            card: pl.mjput[i],
            uid: pl.info.uid
        };

        DealMJPut_haian(node, msg, off, i);
    }

    //添加手花
    if (pl.mjflower.length > 0)
    {
        MjClient.majiang.setFlowerImg(node, pl);
        // ShowEatActionAnim(node,ActionType.FLOWER,off);
        // //playEffect("lyg/nv/flower");
        // playEffectInPlay("flower");
    }

    MjClient.playui.CardLayoutRestore(node, off);

    //23d的位置不一样
    var planel_shaizi =   MjClient.playui._AniNode.getParent().getChildByName("Panel_shaizi");
    setWgtLayout(planel_shaizi,[0.12, 0.12], [0.81, 0.95], [0, 0]);
    if(COMMON_UI3D.is3DUI())
    {
        setWgtLayout(planel_shaizi,[0.11, 0.11], [0.185, 0.955], [0, 0]);
    }
}

function initFlower_haian() {
    initFlower(false, false);
}


function showShaiZiUI_haian(rootNode)
{
    var tData = MjClient.data.sData.tData;
    var shaiziArray = tData.shaizi;
    cc.log("=====================shaiziArray = " + JSON.stringify(shaiziArray));

    if(shaiziArray && shaiziArray.length === 2) {
        var _shaizi1 = rootNode.getChildByName("shaizi1");
        var _shaizi2 = rootNode.getChildByName("shaizi2");
         _shaizi1.loadTexture("res/playing/other/shaizi_pic/" + (shaiziArray[0] + 1) + ".png");
         _shaizi2.loadTexture("res/playing/other/shaizi_pic/" + (shaiziArray[1]  + 1) + ".png");
        rootNode.visible = true;
    }
    else {
        if(rootNode) rootNode.visible = false;
    }
}



var PlayLayer_haian = cc.Layer.extend({
    jsBind: {
        _event: {
            mjhand: function() {
                if(MjClient.endoneui != null && cc.sys.isObjectValid(MjClient.endoneui))
                {
                    cc.log("=======mjhand====endoneui====" + typeof (MjClient.endoneui) );
                    MjClient.endoneui.removeFromParent(true);
                    MjClient.endoneui = null;
                }

                var sData = MjClient.data.sData;
                var tData = sData.tData;
                resetFlowerNum(this);
                resetMaiZhuangNum_haian(this);
                if (tData.roundNum != tData.roundAll) return;
                var pls = sData.players;
                var ip2pl = {};
                for (var uid in pls) {
                    var pi = pls[uid];
                    var ip = pi.info.remoteIP;
                    if (ip) {
                        if (!ip2pl[ip]) ip2pl[ip] = [];
                        ip2pl[ip].push(unescape(pi.info.nickname ));
                    }
                }
                var ipmsg = [];
                for (var ip in ip2pl) {
                    var ips = ip2pl[ip];
                    if (ips.length > 1) {
                        ipmsg.push("玩家:" + ips.join("，") + "为同一IP地址。")
                    }
                }
                if (ipmsg.length > 0 && !tData.matchId) {
                    //if(cc.sys.OS_WINDOWS != cc.sys.os)
                    {
                        //AlertSameIP(ipmsg.join("\n"));
                    }
                }
                mylog("ipmsg " + ipmsg.length);

            },
            LeaveGame: function() {
                MjClient.addHomeView();
                MjClient.playui.removeFromParent(true);
                delete MjClient.playui;
                delete MjClient.endoneui;
                delete MjClient.endallui;
                cc.audioEngine.stopAllEffects();
                playMusic("bgMain");
            },
            endRoom: function(msg) {
                mylog(JSON.stringify(msg));
                if (msg.showEnd) this.addChild(new GameOverLayer(),500);
                else
                    MjClient.Scene.addChild(new StopRoomView());
            },
            roundEnd: function() {
                var self = this;
                function delayExe()
                {
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    resetEatActionAnim();
                    if (sData.tData.roundNum <= 0)
                    {
                        if(!tData.matchId){
                            self.addChild(new GameOverLayer(),500);
                        }else{
                            self.runAction(cc.sequence(cc.delayTime(3),cc.callFunc(function(){
                                self.addChild(new GameOverLayer(),500);
                            })))
                        }
                    }
                    self.addChild(new EndOneView_haian(),500);
                }
                if(MjClient.rePlayVideo === -1){
                    this.runAction(cc.sequence(cc.delayTime(0.1),cc.callFunc(COMMON_UI.showMjhandBeforeEndOne),cc.delayTime(1.7),cc.callFunc(delayExe)));
                } else {
                    this.runAction(cc.sequence(cc.delayTime(1.5),cc.callFunc(delayExe)));
                }
            },
            moveHead: function() {
                postEvent("returnPlayerLayer");
                tableStartHeadMoveAction(this);
                var tData = MjClient.data.sData.tData;
                // if(tData.areaSelectMode.flowerType == WithFlowerType.noFlower)
                // {
                //     MjClient.playui._btnFlower.visible = false;
                // }
                // else
                // {
                //     MjClient.playui._btnFlower.visible = true;
                // }


                initFlower_haian();
            },
            initSceneData: function() {
                reConectHeadLayout(this);
                cc.log("initSceneData -----------------gunyun = " + JSON.stringify(this));
                CheckRoomUiDelete();
            },
            onlinePlayer: function() {
                reConectHeadLayout(this);
            },
            logout: function() {
                if (MjClient.playui) {
                    MjClient.addHomeView();
                    MjClient.playui.removeFromParent(true);
                    delete MjClient.playui;
                    delete MjClient.endoneui;
                    delete MjClient.endallui;
                }
            },
            DelRoom: function() {
                CheckRoomUiDelete();
            },
            changeMJBgEvent: function() {
                changeMJBg(this, getCurrentMJBgType());
            }
        },
        roundnumImg: {
            _run:function () {
                //roundnumImgObj = this;
                MjClient.roundnumImgNode = this;
                setWgtLayout(this,[0.1, 0.1], [0.5, 0.5], [-1.2, 0.8]);
            },
            _event: {
                initSceneData: function(eD) {
                    this.visible = IsArrowVisible();
                },
                mjhand: function(eD) {
                    this.visible = IsArrowVisible();
                },
                onlinePlayer: function(eD) {
                    //this.visible = IsArrowVisible();
                }
            },
            roundnumAtlas: {
                _run:function(){
                    this.ignoreContentAdaptWithSize(true);
                },
                _text: function() {
                    var tData = MjClient.data.sData.tData;
                    if(tData)
                    {
                        var _currentRoundIdx = parseInt(tData.roundAll - tData.roundNum) + 1;
                        if(_currentRoundIdx > tData.roundAll) _currentRoundIdx = 1;
                        return _currentRoundIdx + "/" + tData.roundAll;
                    }
                },
                _event: {
                    mjhand: function() {
                        var tData = MjClient.data.sData.tData;
                        if(tData)
                        {
                            var _currentRoundIdx = parseInt(tData.roundAll - tData.roundNum) + 1;
                            if(_currentRoundIdx > tData.roundAll) _currentRoundIdx = 1;
                            this.setString(_currentRoundIdx + "/" + tData.roundAll);
                        }
                    }
                }
            }
        },
        cardNumImg: {
            _run:function () {
                MjClient.cardNumImgNode = this;
                setWgtLayout(this,[0.1, 0.1], [0.5, 0.5], [1.2, 0.8]);
            },
            _event: {
                initSceneData: function(eD) {
                    this.visible = IsArrowVisible();
                },
                mjhand: function(eD) {
                    this.visible = IsArrowVisible();
                },
                onlinePlayer: function(eD) {
                    //this.visible = IsArrowVisible();
                }
            },
            cardnumAtlas: {
                _run:function(){
                    this.ignoreContentAdaptWithSize(true);
                },
                _text: function() {
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    if (tData) return MjClient.majiang.getAllCardsTotal() - tData.cardNext;
                },
                _event: {
                    waitPut: function() {
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;
                        if (tData) this.setString(MjClient.majiang.getAllCardsTotal() - tData.cardNext);
                        cc.log(MjClient.majiang.getAllCardsTotal() + "-----------------waitPut------------------" + tData.cardNext);
                    }
                }
            }
        },
        back: {
            back: {
                _run: function() {
                    changeGameBg(this);
                },
                _event: {
                    changeGameBgEvent: function() {
                        changeGameBg(this);
                    }
                },
                _layout: [
                    [1, 1],
                    [0.5, 0.5],
                    [0, 0], true
                ],
            },
            LeftBottom:{
                _layout: [
                    [0.1, 0.1],
                    [0.03, 0.045],
                    [0, 0]
                ],
            },
            RightBottom:{
                _layout: [
                    [0.1, 0.1],
                    [0.97,0.05],
                    [0, 0]
                ],
            },
            RightTop:{
                _layout: [
                    [0.1, 0.1],
                    [0.97,0.95],
                    [0, 0]
                ],
            },
            leftTop:{
                _layout: [
                    [0.1, 0.1],
                    [0.03,0.95],
                    [0,0]
                ],
                // _run:function()
                // {
                //     var text = new ccui.Text();
                //     text.setFontName(MjClient.fzcyfont);
                //     text.setFontSize(20);
                //     text.setRotation(-90);
                //     text.setAnchorPoint(0,0.5);
                //     text.setPosition(23.5, 20.5);
                //     this.addChild(text);
                //     text.schedule(function(){
                //         var time = MjClient.getCurrentTime();
                //         var str = time[0]+"/"+time[1]+"/"+ time[2]+" "+
                //             (time[3]<10?"0"+time[3]:time[3])+":"+
                //             (time[4]<10?"0"+time[4]:time[4])+":"+
                //             (time[5]<10?"0"+time[5]:time[5]);
                //         this.setString(str);
                //     });
                // }
            }
        },
        info:
        {
            _layout: [
                [0.16, 0.16],
                [0.01, 0.935],
                [0, 0]
            ]
        },
        gameName:{
            _layout: [
                [0.20, 0.20],
                [0.5, 0.62],
                [0, 1.0]
            ]
        },
        roundInfo:{
            _layout: [
                [0.09, 0.09],
                [0.5, 0.408],
                [0, 1.0]
            ],
            _run:function()
            {
                var tData = MjClient.data.sData.tData;
                this.ignoreContentAdaptWithSize(true);
                this.setString(getPlayingRoomInfo(0));
                showPlayUI_roundInfo(this.getString(),tData.tableid);

                var tData = MjClient.data.sData.tData;
                if(tData.matchId && tData.matchInfo){
                    if(MjClient.matchRank){
                        showPlayUI_matchInfo("排名："+MjClient.matchRank+"/"+tData.matchInfo.userCount+"\n前"+tData.matchInfo.jingjiCount+"名晋级");
                    }else {
                        showPlayUI_matchInfo("排名："+tData.matchInfo.userCount+"/"+tData.matchInfo.userCount+"\n前"+tData.matchInfo.jingjiCount+"名晋级");
                    }
                }
            }
        },
        // jiazhuWait:{
        //     _visible:false,
        //     _layout: [
        //         [0.2, 0.2],
        //         [0.5, 0.5],
        //         [0, 0]
        //     ]
        // },
        banner: {
            _layout: [
                [0.5, 0.5],
                [0.5, 1],
                [0, 0]
            ],
             bg_time:{
                 _run:function()
                {
                    var text = new ccui.Text();
                    text.setFontName(MjClient.fzcyfont);
                    text.setFontSize(26);

                    text.setAnchorPoint(1,0.5);
                    text.setPosition(66, 15);
                    this.addChild(text);
                    text.schedule(function(){

                        var time = MjClient.getCurrentTime();
                        var str = (time[3]<10?"0"+time[3]:time[3])+":"+
                            (time[4]<10?"0"+time[4]:time[4]);
                        this.setString(str);
                    });
                }

            },
            wifi: {
                _run: function() {
                    updateWifiState(this);
                }
            },
            powerBar: {
                _run: function() {
                    cc.log("powerBar_run");
                    updateBattery(this);
                },
                _event: {
                    nativePower: function(d) {
                        this.setPercent(Number(d));
                    }
                }
            },
            tableid: {
                _run: function() {
                    this.ignoreContentAdaptWithSize(true);
                },
                _event: {
                    initSceneData: function() {
                        this.ignoreContentAdaptWithSize(true);
                        this.setString(MjClient.data.sData.tData.tableid);
                    }
                }
            },
            Button_1: {
                _visible : true,
                _click: function() {
                    MjClient.openWeb({url:MjClient.GAME_TYPE.HAI_AN,help:true});
                }
            },
            hunPai:{
                baidaBg:{
                    _run:function()
                    {
                        //baidaBg = this;
                        this.setVisible(false);
                    },
                    _event: {
                        roundEnd:function (eD) {
                            this.visible = false;
                        }
                    },
                },
                baidaText: {
                    _run:function()
                    {
                        //baidaOject = this;
                        this.setVisible(false);
                    },
                    _event: {
                        roundEnd:function (eD) {
                            this.visible = false;
                        }
                    },
                },
                _run:function()
                {
                    this.setVisible(false);
                },
            },
            setting: {
                _click: function() {
                    var settringLayer = new SettingView();
                    settringLayer.setName("PlayLayerClick");
                    MjClient.Scene.addChild(settringLayer);
                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Shezhi", {uid:SelfUid(),gameType:MjClient.gameType});
                }
            },

            // gps_btn: {
            //     //_layout: [[0.09, 0.09],[0.38, 0.93],[0, 0]],
            //     _click: function() {
            //         cc.log("----gps--click--666666666-");
            //         MjClient.Scene.addChild(new showDistance3PlayerLayer());
            //     }
            // },
        },

        //骰子的显示
        Panel_shaizi:{
            _layout: [
                [0.12, 0.12],
                [0.81, 0.95],
                [0, 0]
            ],
            _run:function()
            {
                this.visible = false;
                if(COMMON_UI3D.is3DUI())
                {
                    setWgtLayout(this,[0.11, 0.11], [0.185, 0.955], [0, 0]);
                }
            },
            _event:{
                initSceneData:function()
                {
                    var tData = MjClient.data.sData.tData;
                    if(tData.tState !== TableState.waitJiazhu &&
                        tData.tState !== TableState.waitReady &&
                        tData.tState !== TableState.waitJoin) {
                        showShaiZiUI_haian(this);
                    }
                },
                mjhand:function()
                {
                  this.visible = false;
                },
                roundEnd:function()
                {
                    this.visible = false;
                }
            }
        },

        // arrowbk: {
        //     _layout: [
        //         [0.17, 0.17],
        //         [0.5, 0.5],
        //         [0, 0.25]
        //     ],
        //     _run:function () {
        //         MjClient.arrowbkNode = this;
        //         setDirVisible(this, true);
        //         setArrowFengDir(this);
        //         // windObj["dong"] = this.getChildByName("dir_right");
        //         // windObj["nan"] = this.getChildByName("dir_down");
        //         // windObj["xi"] = this.getChildByName("dir_left");
        //         // windObj["bei"] = this.getChildByName("dir_up");
        //         // windPos["dong"] = windObj["dong"].getPosition();
        //         // windPos["nan"]   = windObj["nan"].getPosition();
        //         // windPos["xi"]   =  windObj["xi"].getPosition();
        //         // windPos["bei"]  = windObj["bei"].getPosition();
        //     },
        //     _event: {
        //         initSceneData: function(eD) {
        //             this.visible = IsArrowVisible();
        //             SetArrowRotation(this)
        //         },
        //         mjhand: function(eD) {
        //             this.visible = IsArrowVisible();
        //             setArrowFengDir(this);
        //             SetArrowRotation(this);
        //         },
        //         onlinePlayer: function(eD) {
        //             //this.visible = IsArrowVisible();
        //         },
        //         waitPut: function() {
        //             cc.log("===========arrowbkNumbcerUpdate==========1111");
        //             SetArrowRotation(this)
        //         },
        //         MJPeng: function(eD) {
        //             SetArrowRotation(this)
        //         },
        //         MJChi: function(eD) {
        //             SetArrowRotation(this)
        //         },
        //         MJGang: function(eD) {
        //             SetArrowRotation(this)
        //         },
        //         MJFlower: function(eD) {
        //             SetArrowRotation(this)
        //         },
        //
        //     },
        //     number: {
        //         _run: function() {
        //             this.setString("00");
        //             //arrowbkNumberUpdate(this);
        //             this.ignoreContentAdaptWithSize(true);
        //         },
        //         _event: {
        //             MJPeng: function() {
        //                 this.stopAllActions();
        //                 stopEffect(playTimeUpEff);
        //                 playTimeUpEff = null;
        //                 arrowbkNumberUpdate(this);
        //             },
        //             MJChi: function() {
        //                 this.stopAllActions();
        //                 stopEffect(playTimeUpEff);
        //                 playTimeUpEff = null;
        //                 arrowbkNumberUpdate(this);
        //             },
        //             waitPut: function() {
        //                 cc.log("===========arrowbkNumbcerUpdate==========0000");
        //                 this.stopAllActions();
        //                 stopEffect(playTimeUpEff);
        //                 playTimeUpEff = null;
        //                 var eat = MjClient.playui.jsBind.eat;
        //                 var endFunc = null;
        //                 if (IsTurnToMe()
        //                     && !eat.ting._node.visible
        //                     && !eat.hu._node.visible
        //                     && !eat.peng._node.visible
        //                     && !eat.chi0._node.visible
        //                     && !eat.gang0._node.visible
        //                     && !eat.gang1._node.visible
        //                     && !eat.gang2._node.visible) {
        //                     endFunc = MjClient.playui.jsBind.BtnPutCard._click;
        //                 }
        //                 cc.log("===========arrowbkNumbcerUpdate==========");
        //                 arrowbkNumberUpdate(this, endFunc);
        //             },
        //             MJPut: function(msg) {
        //                 //if (msg.uid == SelfUid()) {
        //                 //    this.stopAllActions();
        //                 //    stopEffect(playTimeUpEff);
        //                 //    playTimeUpEff = null;
        //                 //    //arrowbkNumberUpdate(this);
        //                 //    this.setString("00");
        //                 //}
        //             },
        //             roundEnd: function() {
        //                 this.stopAllActions();
        //                 stopEffect(playTimeUpEff);
        //                 playTimeUpEff = null;
        //             },
        //             LeaveGame: function() {
        //                 this.stopAllActions();
        //                 stopEffect(playTimeUpEff);
        //                 playTimeUpEff = null;
        //             }
        //         }
        //     },
        // },
        // wait: {
        //     getRoomNum: {
        //         _run:function(){
        //             setWgtLayout(this, [0.18, 0.18],[0.4, 0.5],[0, 0]);
        //         },
        //         _visible:function()
        //         {
        //             return !MjClient.remoteCfg.guestLogin;
        //         },
        //         _click: function() {
        //             getPlayingRoomInfo(1);
        //         }
        //     },
        //     wxinvite: {
        //         _layout: [
        //             [0.18, 0.18],
        //             [0.6, 0.5],
        //             [0, 0]
        //         ],
        //         _click: function() {
        //             getPlayingRoomInfo(2);
        //         },
        //         _visible:function()
        //         {
        //             return !MjClient.remoteCfg.guestLogin;
        //         }
        //     },
        //     delroom: {
        //         _run:function(){
        //             setWgtLayout(this, [0.11, 0.11],[0.05, 0.45],[0, 0]);
        //         },
        //         _click: function() {
        //             MjClient.delRoom(true);
        //         }
        //     },
        //     backHomebtn: {
        //         _run:function(){
        //             setWgtLayout(this, [0.11, 0.11],[0.05, 0.6],[0, 0]);
        //         },
        //         _click: function(btn) {
        //             var sData = MjClient.data.sData;
        //             if (sData) {
        //                 if (IsRoomCreator()) {
        //                     MjClient.showMsg("返回大厅房间仍然保留\n赶快去邀请好友吧",
        //                         function() {
        //                             MjClient.leaveGame();
        //                         },
        //                         function() {});
        //                 } else {
        //                     MjClient.showMsg("确定要退出房间吗？",
        //                         function() {
        //                             MjClient.leaveGame();
        //                         },
        //                         function() {});
        //                 }
        //             }
        //
        //         },
        //         _event: {
        //             returnPlayerLayer: function() {
        //                 MjClient.playui.visible = true;
        //             },
        //             initSceneData: function(eD) {
        //                 this.visible = IsInviteVisible();
        //             },
        //             addPlayer: function(eD) {
        //                 this.visible = IsInviteVisible();
        //             },
        //             removePlayer: function(eD) {
        //                 this.visible = IsInviteVisible();
        //             }
        //         }
        //     },
        //     _event: {
        //         initSceneData: function(eD) {
        //             this.visible = IsInviteVisible();
        //         },
        //         addPlayer: function(eD) {
        //             console.log(">>>>>> play add player >>>>");
        //             this.visible = IsInviteVisible();
        //         },
        //         removePlayer: function(eD) {
        //             this.visible = IsInviteVisible();
        //         }
        //     }
        // },
        BtnPutCard:{ //add by  sking for put card button
            _run: function () {

                var tData = MjClient.data.sData.tData;
                cc.log("BtnPutCard _run set put card btn state = " + tData.tState );

                if(!IsTurnToMe() || tData.tState != TableState.waitPut)
                {
                    // cc.log(" it's not my turn------------------sking");
                    this.visible = false;
                }
                else
                {
                    // cc.log(" it's my turn------------------sking");
                    this.visible = true;
                }

                setWgtLayout(this,[0.18, 0.18], [0.82, 0.3], [0.7, -0.1]);
            },
            _click: function(btn) {
                cc.log("点击出牌");
                //var sData = MjClient.data.sData;
                //cc.log("sData.tState == " + sData.tState);
                var downNode = MjClient.playui._downNode;
                var standUI = downNode.getChildByName("stand");
                var children = downNode.children;
                for(var i = 0; i < children.length; i++)
                {
                    if(children[i].name == "mjhand")
                    {
                        if(children[i].y > standUI.y + 10)
                        {
                            PutOutCard(children[i], children[i].tag); //可以出牌
                            break;
                        }
                    }
                }
                this.visible = false;
            },
            _event:{
                //拿到一张牌的时候，出牌按钮亮起，其他状态隐藏，by sking
                mjhand: function() {
                    this.visible = false;
                    cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>initSceneData");
                },
                MJHu:function(){
                    this.visible = false;
                    cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>mjhand");
                },
                newCard: function(eD)
                {
                    cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>newCard by sking");
                    this.visible = true;
                    //setWgtLayout(this, [0.1, 0.1],[0.7, 0.2],[0, 0]);
                },
                MJPut: function(eD) {
                    cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>MJPut by sking");
                    this.visible = false;
                },
                MJChi: function(eD) {
                    cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>MJChi by sking");
                    if(IsTurnToMe())
                    {
                        this.visible = true;
                    }
                },
                MJGang: function(eD) {
                    cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>MJGang by sking");
                    if(IsTurnToMe())
                    {
                        this.visible = true;
                    }
                },
                MJPeng: function(eD) {
                    cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>MJPeng by sking");
                    if(IsTurnToMe())
                    {
                        //cc.log("    ----------------------peng  btn show----");
                        this.visible = true;
                    }
                },
                MJTing: function (eD) {
                    if(MjClient.playui.isCanPutCard())
                    {
                        this.visible = true;
                        cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>MJTing by sking - hide");
                    }else{
                        this.visible = false;
                    }
                },
                roundEnd:function()
                {
                    this.visible = false;
                },
                waitPut: function() {
                    if(_isAniShow_Haian) return;
                    var pl = getUIPlayer(0);
                    var eat = MjClient.playui.jsBind.eat;
                    if (IsTurnToMe() && pl.isTing && !eat.hu._node.visible && !eat.gang0._node.visible && !eat.gang1._node.visible && !eat.gang2._node.visible) {
                        cc.log("*********自动出牌*********");
                        this.runAction(cc.sequence(cc.delayTime(0.4),
                            cc.callFunc(MjClient.playui.jsBind.BtnPutCard._click)));
                    }else{
                        if(MjClient.playui.isCanPutCard())
                        {
                            if(eat.hu._node.visible)
                            {
                                this.visible = false;
                                cc.log("--------------------有胡按钮拉--------------");
                            }
                            else
                            {
                                this.visible = true;
                            }
                        }
                    }
                }
            }
        },//end of add by sking
        down: {
            head: {
                tuoguan: {
                    _run:function () {
                        this.visible = false;
                    },
                    _event:{
                        beTrust:function (msg) {
                            if(getUIPlayer(0)&&getUIPlayer(0).info.uid == msg.uid){
                                this.visible = true;
                            }
                        },
                        cancelTrust:function (msg) {
                            if(getUIPlayer(0)&&getUIPlayer(0).info.uid == msg.uid){
                                this.visible = false;
                            }
                        }
                    }
                },
                zhuang: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        waitPut: function() {
                            showUserZhuangLogo(this, 0);
                        },
                        initSceneData: function() {
                            if (IsArrowVisible()) showUserZhuangLogo(this, 0);
                        }
                    }
                },
                chatbg: {
                    _run: function() {
                        this.getParent().zIndex = 600;
                    },
                    chattext: {
                        _event: {

                            MJChat: function(msg) {
                                this.setFontSize(30);
                                cc.log("show user Chat MJCHAT" );
                                showUserChat(this, 0, msg);
                            },
                            playVoice: function(voicePath) {
                                MjClient.data._tempMessage.msg = voicePath;
                                showUserChat(this, 0, MjClient.data._tempMessage);
                            }
                        }
                    }
                },
                _click: function(btn) {
                    showPlayerInfo(0, btn);
                },
                _event: {
                    loadWxHead: function(d) {
                        setWxHead(this, d, 0);
                    },
                    addPlayer: function(eD) {
                        showFangzhuTagIcon(this,0);
                    },
                    removePlayer: function(eD) {
                        showFangzhuTagIcon(this,0);
                    }
                },
                _run: function () {
                    // this.zIndex = 600;
                    showFangzhuTagIcon(this,0);
                },
                score_bg:{_visible:false},
                name_bg:{_visible:false},
                flower_layout: {_visible:false},
                flower_zfb_layout : {_visible:false},
                tingCard: { //add by sking
                    _visible:false,
                    _event: {
                        MJTing: function (eD) {
                            if(eD.uid == SelfUid())
                            {
                                var pl = getUIPlayer(0);
                                pl.putCardAfterTing = eD.putCardAfterTing;
                                MjClient.playui.setTingCardInfo(this,eD,0);
                            }
                        },
                        clearCardUI: function(eD) {
                            cc.log("ready to----- clear sking ----");
                            this.visible = false;
                        },
                        MJHu: function(eD) {
                            this.visible = false;
                        },
                        onlinePlayer: function(eD) {
                            //MjClient.playui.setTingCardInfo(this,eD,0);
                        },
                        initSceneData:function(eD)
                        {
                            MjClient.playui.setTingCardInfo(this,eD,0);
                        }
                    }
                },
                tingIcon: {
                    _visible:false,
                    _run:function(){
                        this.visible = false;
                        this.runAction(cc.sequence(cc.spawn(cc.tintTo(0.6, 255,0,0),cc.scaleTo(0.6,this.getScale() + 0.3)),
                            cc.spawn(cc.tintTo(0.6, 255,255,255),cc.scaleTo(0.6,this.getScale()))).repeatForever());
                    },
                    _event: {
                        clearCardUI: function(eD) {
                            this.visible = false;
                        },
                        MJHu: function(eD) {
                            this.visible = false;
                        },
                        moveHead: function() {
                            MjClient.playui.tingIconVisible(this, 0);
                        },
                        onlinePlayer: function(eD) {
                            //MjClient.playui.tingIconVisible(this,0);
                        },
                        initSceneData:function(eD)
                        {
                            MjClient.playui.tingIconVisible(this,0);
                        },
                        roundEnd: function(){
                            // cc.log("end rounde------------------------");
                            this.visible = false;
                        }
                    }
                },
                huaCount: {
                    _run:function(){
                        MjClient.playui.setPlayerHuaValueShow(this.getParent());
                        changeAtalsForLabel(this, 0);
                    },
                    _event:
                    {
                        clearCardUI: function(eD) {
                            changeAtalsForLabel(this,0);
                        },

                        addPlayer: function(eD) {
                            MjClient.playui.setPlayerHuaValueShow(this.getParent());
                        },

                        removePlayer: function(eD) {
                            MjClient.playui.setPlayerHuaValueShow(this.getParent());
                        },

                        waitJiazhu: function (eD) {
                            MjClient.playui.setPlayerHuaValueShow(this.getParent());
                        }
                    }
                },//end of by sking
                maizhuang: {
                    _run: function() {
                        this.visible = false;
                        var _zhuangIcon = getNode(0).getChildByName("head").getChildByName("maizhuangicon");
                        _zhuangIcon.visible = false;
                    },
                    _event: {
                        waitJiazhu:function (eD) {
                            this.visible = false;
                            var _zhuangIcon = getNode(0).getChildByName("head").getChildByName("maizhuangicon");
                            _zhuangIcon.visible = false;
                        },
                        clearCardUI: function() {
                            this.visible = false;
                            var _zhuangIcon = getNode(0).getChildByName("head").getChildByName("maizhuangicon");
                            _zhuangIcon.visible = false;
                        },
                        MJJiazhu: function(msg) {
                            setMaizhuangTag_haian(msg,0)
                        },
                        mjhand:function()
                        {
                            this.visible = false;
                        },
                        initSceneData: function() {

                        }
                    }
                },
                skipHuIconTag: {
                    _visible:false,
                    _event: {
                        clearCardUI: function(eD) {
                            this.visible = false;
                        },
                        MJHu: function(eD) {
                            this.visible = false;
                        },
                        initSceneData:function(eD)
                        {
                            var pl = getUIPlayer(0);
                            if (pl && pl.skipHu) {
                                //var _skipHuIconNode =  MjClient.playui._downNode.getChildByName("head").getChildByName("skipHuIconTag");
                                this.visible = true;
                            }
                        }
                    }
                },
                skipPengIconTag: {
                    _visible:false,
                    _event: {
                        clearCardUI: function(eD) {
                            this.visible = false;
                        },
                        MJpeng: function(eD) {
                            this.visible = false;
                        },
                        initSceneData:function(eD)
                        {
                            var pl = getUIPlayer(0);
                            if (pl && pl.skipPeng.length > 0) {
                                //var _skipHuIconNode =  MjClient.playui._downNode.getChildByName("head").getChildByName("skipHuIconTag");
                                this.visible = true;
                            }else{
                                this.visible = false;
                            }
                        }
                    }
                }

            },
            play_tips: {
                _layout: [[0.08, 0.14], [0.5, 0.25], [0, 0.5]],
                _run: function () {
                    this.zIndex = actionZindex;
                },
                _visible:false,
            },
            tai_layout:{
                _layout: [
                    [0.018, 0.018],
                    [0, 0],
                    [0, 0.2]
                ],
                tai_info:{
                    _visible:true,
                    _run: function () {
                        this.setString("");
                    }
                },
            },
            ready: {
                _layout: [
                    [0.07, 0.07],
                    [0.5, 0.5],
                    [0, -1.5]
                ],
                _run: function() {
                    GetReadyVisible(this, 0);
                },
                _event: {
                    moveHead: function() {
                        GetReadyVisible(this, -1);
                    },
                    addPlayer: function() {
                        GetReadyVisible(this, 0);//根据状态设置ready 是否可见 add by sking
                    },
                    removePlayer: function() {
                        GetReadyVisible(this, 0);
                    },
                    onlinePlayer: function() {
                        GetReadyVisible(this, 0);
                    },
                    waitJiazhu: function () {
                        GetReadyVisible(this, -1);
                    }
                }
            },
            stand: {
                _layout: [
                    [0.053, 0],
                    [0.5, 0],
                    [8, 0.72]
                ],
                _visible: false,
                _run: function () {
                    // this.zIndex = 500;
                },
                _event: {
                    mjhand:function () {
                        this.visible = false;
                    }
                }
            },
            up: {
                _layout: [
                    [0.05, 0],
                    [0, 0],
                    [0.8, 0.7]
                ],
                _visible: false
            },
            down: {
                _layout: [
                    [0.05, 0],
                    [0, 0],
                    [3.5, 1]
                ],
                _visible: false
            },
            out0: {
                _run: function() {
                    // setWgtLayout(this, [0.0, 0.063], [0.53, 0], [-7, 6.1]);
                    setWgtLayout(this, [0.0, 0.08], [0.55, -0.08], [-7, 6.1]);
                    if (MjClient.MaxPlayerNum == 2)
                        this.x -= this.height * this.scale * 5;
                },
                _visible: false
            },
            out1: {
                _run: function() {
                    // setWgtLayout(this, [0.0, 0.063], [0.53, 0], [-7, 4.9]);
                    setWgtLayout(this, [0.0, 0.08], [0.55, -0.06], [-7, 4.9]);
                    if (MjClient.MaxPlayerNum == 2)
                        this.x -= this.height * this.scale * 5;
                },
                _visible: false
            },
            out2: {
                _run: function() {
                    // setWgtLayout(this, [0.0, 0.063], [0.53, 0], [-7, 3.7]);
                    setWgtLayout(this, [0.0, 0.08], [0.55, -0.04], [-7, 3.7]);
                    if (MjClient.MaxPlayerNum == 2)
                        this.x -= this.height * this.scale * 5;
                },

                _visible: false
            },
            outBig: {
                _layout: [
                    [0.0836, 0],
                    [0.5, 0.32],
                    [0, 0]
                ],
                _visible: false
            },
            tingCardsNode: {
                _layout: [[0.25, 0.12], [0.2, 0.25], [0, -0.3]],
                _visible: false,
                _event: {
                    clearCardUI: function(eD) {
                        this.visible = false;
                    },
                    MJHu: function(eD) {
                        this.visible = false;
                    },
                    initSceneData:function(eD)
                    {
                        MjClient.playui.tingIconVisible(this,0);
                    }
                }
            },
            tingCardNumNode: {
                _layout: [[0.25, 0.12], [0.12, 0.25], [0,-0.2]],
                _visible: false,
                _event: {
                    clearCardUI: function(eD) {
                        this.visible = false;
                    },
                    MJHu: function(eD) {
                        this.visible = false;
                    },
                    MJPut: function(eD) {
                        this.visible = false;
                    }
                }
            },
            _event: {
                clearCardUI: function() {
                    clearCardUI(this, 0);
                },
                initSceneData: function(eD) {
                    SetUserVisible_haian(this, 0);
                },
                addPlayer: function(eD) {
                    SetUserVisible_haian(this, 0);
                },
                removePlayer: function(eD) {
                    SetUserVisible_haian(this, 0);
                },
                mjhand: function(eD) {
                    showShaiziAni_haian(0);
                },
                roundEnd: function() {
                    InitUserCoinAndName(this, 0);
                    //setTaiInfo("");
                },
                newCard: function(eD) {
                    if(_isAniShow_Haian) return;
                    // cdsNums++;
                    console.log("客户端发牌组合......eD= "+JSON.stringify(eD));
                    //cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>newCard---------------");
                    //var putButtn = this.getChildByName("BtnPutCard");
                    //putButtn.visible = true;
                    //MjClient.playui._btnPutCard.visible = true;
                    if (typeof(eD) == "number") {
                        eD = {newCard: eD};
                    }
                    DealNewCard(this,eD.newCard,0);
                    hideTingBtn();
                },
                MJPut: function(eD) {

                    DealMJPut_haian(this,eD,0);
                    var pl = getUIPlayer(0);
                    if (eD.uid == SelfUid())
                    {
                        var _tingCards = this.getChildByName("tingCardsNode");
                        var tingSet = calTingSet(pl.mjhand);
                        setTingCards_showCount(_tingCards,tingSet);
                    }
                    setUserOffline(this, 0);
                },
                MJChi: function(eD) {
                    // DealMJChi(this, eD, 0);
                    if (MjClient.rePlayVideo != -1) {
                        DealMJChi(this, eD, 0);
                    }else {
                        updateHeadUI_haian(this, 0, ActionType.CHI);
                    }
                    setUserOffline(this, 0);
                },
                MJGang: function(eD) {
                    DealMJGang(this, eD, 0);
                    hideTingBtn();
                    setUserOffline(this, 0);
                },
                MJPeng: function(eD) {
                    // DealMJPeng(this, eD, 0);
                    if (MjClient.rePlayVideo != -1){
                        DealMJPeng(this, eD, 0);
                    }else {
                        updateHeadUI_haian(this, 0, ActionType.PENG);
                    }
                    var pl = getUIPlayer(0);
                    var _tingCards = this.getChildByName("tingCardsNode");
                    var tingSet = calTingSet(pl.mjhand);
                    setTingCards_showCount(_tingCards,tingSet);
                    setUserOffline(this, 0);
                },
                MJHu: function(eD) {
                    HandleMJHu(this, eD, 0);
                    setUserOffline(this, 0);
                },
                onlinePlayer: function(eD) {
                    setUserOffline(this, 0);
                },
                playerStatusChange: function(eD) {
                    setUserOffline(this, 0);
                },
                MJFlower: function(eD) {
                    HandleMJFlower(this, eD, 0);
                },
                MJTing: function (eD) {
                    HandleMJTing(this, eD, 0);
                },
            }
        },
        right: {
            _run: function() {
                this.visible = MjClient.MaxPlayerNum !== 2;
            },
            head: {
                tuoguan: {
                    _run:function () {
                        this.visible = false;
                    },
                    _event:{
                        beTrust:function (msg) {
                            if(getUIPlayer(1)&&getUIPlayer(1).info.uid == msg.uid){
                                this.visible = true;
                            }
                        },
                        cancelTrust:function (msg) {
                            if(getUIPlayer(1)&&getUIPlayer(1).info.uid == msg.uid){
                                this.visible = false;
                            }
                        }
                    }
                },
                zhuang: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        waitPut: function() {
                            showUserZhuangLogo(this, 1);
                        },
                        initSceneData: function() {
                            if (IsArrowVisible()) showUserZhuangLogo(this, 1);
                        }
                    }
                },
                chatbg: {
                    _run: function() {
                        this.getParent().zIndex = 500;
                    },
                    chattext: {
                        _event: {

                            MJChat: function(msg) {
                                this.setFontSize(30);
                                showUserChat(this, 1, msg);
                            },
                            playVoice: function(voicePath) {
                                if(MjClient.data._tempMessage)
                                {
                                    MjClient.data._tempMessage.msg = voicePath;
                                    showUserChat(this, 1, MjClient.data._tempMessage);
                                }
                            }
                        }
                    }
                },
                _click: function(btn) {
                    showPlayerInfo(1, btn);
                },
                _event: {
                    loadWxHead: function(d) {
                        setWxHead(this, d, 1);
                    },
                    addPlayer: function(eD) {
                        showFangzhuTagIcon(this,1);
                    },
                    removePlayer: function(eD) {
                        showFangzhuTagIcon(this,1);
                    }
                },
                _run: function () {
                    // this.zIndex = 600;
                    showFangzhuTagIcon(this,1);
                },
                score_bg:{_visible:false},
                name_bg:{_visible:false},
                flower_layout: {_visible:false},
                flower_zfb_layout : {_visible:false},
                tingCard: {
                    _visible:false,
                    _event: {
                        MJTing: function (eD) {
                            if(MjClient.playui.isPlayerPutCard(eD,1))
                            {
                                var pl = getUIPlayer(1);
                                pl.putCardAfterTing = eD.putCardAfterTing;
                                MjClient.playui.setTingCardInfo(this,eD,1);
                            }
                        },
                        clearCardUI: function(eD) {

                            this.visible = false;
                        },
                        MJHu: function(eD) {
                            this.visible = false;
                        },
                        onlinePlayer: function(eD) {
                            //MjClient.playui.setTingCardInfo(this,eD,1);
                        },
                        initSceneData:function(eD)
                        {
                            MjClient.playui.setTingCardInfo(this,eD,1);
                        }
                    }
                },
                tingIcon: {
                    _visible:false,
                    _run:function(){
                        this.visible = false;

                        this.runAction(cc.sequence(cc.spawn(cc.tintTo(0.6, 255,0,0),cc.scaleTo(0.6,this.getScale() + 0.3)),
                            cc.spawn(cc.tintTo(0.6, 255,255,255),cc.scaleTo(0.6,this.getScale()))).repeatForever());
                    },
                    _event: {
                        clearCardUI: function(eD) {
                            this.visible = false;
                        },
                        MJHu: function(eD) {
                            this.visible = false;
                        },
                        moveHead: function() {
                            MjClient.playui.tingIconVisible(this, 1);
                        },
                        onlinePlayer: function(eD) {
                            //MjClient.playui.tingIconVisible(this,1);
                        },
                        initSceneData:function(eD)
                        {
                            MjClient.playui.tingIconVisible(this,1);
                        },
                        roundEnd: function(){
                            // cc.log("end rounde------------------------");
                            this.visible = false;
                        }
                    }
                },
                maizhuang: {
                    _run: function() {
                        this.visible = false;
                        var _zhuangIcon = getNode(1).getChildByName("head").getChildByName("maizhuangicon");
                        _zhuangIcon.visible = false;
                    },
                    _event: {
                        waitJiazhu:function (eD) {
                            this.visible = false;
                            var _zhuangIcon = getNode(1).getChildByName("head").getChildByName("maizhuangicon");
                            _zhuangIcon.visible = false;
                        },
                        clearCardUI: function() {
                            this.visible = false;
                            var _zhuangIcon = getNode(1).getChildByName("head").getChildByName("maizhuangicon");
                            _zhuangIcon.visible = false;
                        },
                        MJJiazhu: function(msg) {
                            setMaizhuangTag_haian(msg,1)
                        },
                        mjhand:function()
                        {
                            this.visible = false;
                        },
                        initSceneData: function() {

                        }
                    }
                },
                huaCount: {
                    _run:function(){
                        MjClient.playui.setPlayerHuaValueShow(this.getParent());
                        changeAtalsForLabel(this, 0);
                    },
                    _event:
                    {
                        clearCardUI: function(eD) {
                            changeAtalsForLabel(this,0);
                        },

                        addPlayer: function(eD) {
                            MjClient.playui.setPlayerHuaValueShow(this.getParent());
                        },

                        removePlayer: function(eD) {
                            MjClient.playui.setPlayerHuaValueShow(this.getParent());
                        },

                        waitJiazhu: function (eD) {
                            MjClient.playui.setPlayerHuaValueShow(this.getParent());
                        }
                    }
                },

            },
            play_tips: {
                _layout: [[0.08, 0.14], [0.75, 0.5], [0, 0.5]],
                _run: function () {
                    this.zIndex = actionZindex;
                },
                _visible:false,
            },
            ready: {
                _layout: [
                    [0.07, 0.07],
                    [0.5, 0.5],
                    [2, 0]
                ],
                _run: function() {
                    GetReadyVisible(this, 1);
                },
                _event: {
                    moveHead: function() {
                        GetReadyVisible(this, -1);
                    },
                    addPlayer: function() {
                        GetReadyVisible(this, 1);
                    },
                    removePlayer: function() {
                        GetReadyVisible(this, 1);
                    },
                    onlinePlayer: function() {
                        GetReadyVisible(this, 1);
                    },
                    waitJiazhu: function () {
                        GetReadyVisible(this, -1);
                    }
                }
            },
            stand: {
                _layout: [
                    [0, 0.08],
                    [1, 1],
                    [-5.5, -2.3]
                ],
                _visible: false,
                _event: {
                    mjhand:function () {
                        this.visible = false;
                    }
                }
            },

            up: {
                _layout: [
                    [0, 0.05],
                    [1, 0],
                    [-3.0, 6]
                ],
                _visible: false
            },
            down: {
                _layout: [
                    [0, 0.05],
                    [1, 0],
                    [-3, 6.3]
                ],
                _visible: false
            },

            out2: {
                _run: function() {
                    // setWgtLayout(this, [0, 0.043], [0.97, 0.55], [-4.6, -5.1]);
                    setWgtLayout(this, [0, 0.055], [0.94, 0.5], [-2.8, -4.0]);
                },
                _visible: false
            },
            out1: {
                _run: function() {
                    // setWgtLayout(this, [0, 0.043], [0.97, 0.55], [-5.9, -5.1]);
                    setWgtLayout(this, [0, 0.055], [0.94, 0.5], [-4.0, -4.0]);
                },
                _visible: false
            },
            out0: {
                _run: function() {
                    // setWgtLayout(this, [0, 0.043], [0.97, 0.55], [-7.2, -5.1]);
                    setWgtLayout(this, [0, 0.055], [0.94, 0.5], [-5.2, -4.0]);
                },
                _visible: false
            },
            outBig: {
                _layout: [
                    [0.0836, 0],
                    [0.75, 0.58],
                    [0, 0]
                ],
                _visible: false
            },
            _event: {
                clearCardUI: function() {
                    clearCardUI(this, 1);
                },
                initSceneData: function(eD) {
                    SetUserVisible_haian(this, 1);
                },
                addPlayer: function(eD) {
                    SetUserVisible_haian(this, 1);
                },
                removePlayer: function(eD) {
                    SetUserVisible_haian(this, 1);
                },
                mjhand: function(eD) {
                    //showShaiziAni_haian(1);
                },
                roundEnd: function() {
                    InitUserCoinAndName(this, 1);
                },
                waitPut: function() {
                    if(_isAniShow_Haian) return;
                    DealWaitPut(this, MjClient.data.sData.tData, 1);
                },
                MJPut: function(eD) {
                    DealMJPut_haian(this, eD, 1);
                    if(eD.uid != SelfUid())
                    {
                        hideTingBtn();
                    }
                    setUserOffline(this, 1);
                },
                MJChi: function(eD) {
                    // DealMJChi(this, eD, 1);
                    if (MjClient.rePlayVideo != -1) {
                        DealMJChi(this, eD, 1);
                    }else {
                        updateHeadUI_haian(this, 1, ActionType.CHI);
                    }
                    setUserOffline(this, 1);
                },
                MJGang: function(eD) {
                    DealMJGang(this, eD, 1);
                    setUserOffline(this, 1);
                },
                MJPeng: function(eD) {
                    // DealMJPeng(this, eD, 1);
                    if (MjClient.rePlayVideo != -1) {
                        DealMJPeng(this, eD, 1);
                    }else {
                        updateHeadUI_haian(this, 1, ActionType.PENG);
                    }
                    setUserOffline(this, 1);
                },
                MJHu: function(eD) {
                    HandleMJHu(this, eD,1);
                    setUserOffline(this, 1);
                },
                onlinePlayer: function(eD) {
                    setUserOffline(this, 1);
                },
                playerStatusChange: function(eD) {
                    setUserOffline(this, 1);
                },
                MJFlower: function(eD) {
                    HandleMJFlower(this, eD, 1);
                },
                MJTing: function (eD) {
                    HandleMJTing(this, eD, 1);
                }
            }
        },
        top: {
            _run: function() {
                this.visible = MjClient.MaxPlayerNum !== 3;
            },
            head: {
                tuoguan: {
                    _run:function () {
                        this.visible = false;
                    },
                    _event:{
                        beTrust:function (msg) {
                            if(getUIPlayer(2)&&getUIPlayer(2).info.uid == msg.uid){
                                this.visible = true;
                            }
                        },
                        cancelTrust:function (msg) {
                            if(getUIPlayer(2)&&getUIPlayer(2).info.uid == msg.uid){
                                this.visible = false;
                            }
                        }
                    }
                },
                zhuang: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        waitPut: function() {
                            showUserZhuangLogo(this, 2);
                        },
                        initSceneData: function() {
                            if (IsArrowVisible()) showUserZhuangLogo(this, 2);
                        }
                    }
                },
                chatbg: {
                    _run: function() {
                        this.getParent().zIndex = 500;
                    },
                    chattext: {
                        _event: {

                            MJChat: function(msg) {
                                this.setFontSize(30);
                                showUserChat(this, 2, msg);
                            },
                            playVoice: function(voicePath) {
                                if(MjClient.data._tempMessage)
                                {
                                    MjClient.data._tempMessage.msg = voicePath;
                                    showUserChat(this, 2, MjClient.data._tempMessage);
                                }
                            }
                        }
                    }
                },
                _click: function(btn) {
                    showPlayerInfo(2, btn);
                },
                _event: {
                    loadWxHead: function(d) {
                        setWxHead(this, d, 2);
                    },
                    addPlayer: function(eD) {
                        showFangzhuTagIcon(this,2);
                    },
                    removePlayer: function(eD) {
                        showFangzhuTagIcon(this,2);
                    }
                },
                _run: function () {
                    // this.zIndex = 600;
                    showFangzhuTagIcon(this,2);
                },
                score_bg:{_visible:false},
                name_bg:{_visible:false},
                flower_layout: {_visible:false},
                flower_zfb_layout : {_visible:false},
                tingCard: {
                    _visible:false,
                    _event: {
                        MJTing: function (eD) {
                            if(MjClient.playui.isPlayerPutCard(eD,2))
                            {
                                var pl = getUIPlayer(2);
                                pl.putCardAfterTing = eD.putCardAfterTing;
                                MjClient.playui.setTingCardInfo(this,eD,2);
                            }
                        },
                        clearCardUI: function(eD) {
                            cc.log("ready to----- clear sking ----");
                            this.visible = false;
                        },
                        moveHead: function(eD) {
                            cc.log("top---moveHead ----");
                            MjClient.playui.setTingCardInfo(this,eD,2);
                        },
                        MJHu: function(eD) {
                            this.visible = false;
                        },
                        onlinePlayer: function(eD) {
                            cc.log("top---onlinePlayer ----");
                            //MjClient.playui.setTingCardInfo(this,eD,2);
                        },
                        initSceneData:function(eD)
                        {
                            MjClient.playui.setTingCardInfo(this,eD,2);
                        }
                    }
                },
                tingIcon: {
                    _visible:false,
                    _run:function(){
                        this.visible = false;
                        this.runAction(cc.sequence(cc.spawn(cc.tintTo(0.6, 255,0,0),cc.scaleTo(0.6,this.getScale() + 0.3)),
                            cc.spawn(cc.tintTo(0.6, 255,255,255),cc.scaleTo(0.6,this.getScale()))).repeatForever());
                    },
                    _event: {
                        clearCardUI: function(eD) {
                            this.visible = false;
                            cc.log("tingIcon 22 ----- clearCardUI----");
                        },
                        MJHu: function(eD) {
                            this.visible = false;
                        },
                        moveHead: function() {
                            MjClient.playui.tingIconVisible(this, 2);
                        },
                        onlinePlayer: function(eD) {
                            //MjClient.playui.tingIconVisible(this,2);
                        },
                        initSceneData:function(eD)
                        {
                            MjClient.playui.tingIconVisible(this,2);
                        },
                        roundEnd: function(){
                            // cc.log("end rounde------------------------222");
                            this.visible = false;
                        }
                    }
                },
                maizhuang: {
                    _run: function() {
                        this.visible = false;
                        var _zhuangIcon = getNode(2).getChildByName("head").getChildByName("maizhuangicon");
                        _zhuangIcon.visible = false;
                    },
                    _event: {
                        waitJiazhu:function (eD) {
                            this.visible = false;
                            var _zhuangIcon = getNode(2).getChildByName("head").getChildByName("maizhuangicon");
                            _zhuangIcon.visible = false;
                        },
                        clearCardUI: function() {
                            this.visible = false;
                            var _zhuangIcon = getNode(2).getChildByName("head").getChildByName("maizhuangicon");
                            _zhuangIcon.visible = false;
                        },
                        MJJiazhu: function(msg) {
                            setMaizhuangTag_haian(msg,2)
                        },
                        mjhand:function()
                        {
                            this.visible = false;
                        },
                        initSceneData: function() {

                        }
                    }
                },
                huaCount: {
                    _run:function(){
                        MjClient.playui.setPlayerHuaValueShow(this.getParent());
                        changeAtalsForLabel(this, 0);
                    },
                    _event:
                    {
                        clearCardUI: function(eD) {
                            changeAtalsForLabel(this,0);
                        },

                        addPlayer: function(eD) {
                            MjClient.playui.setPlayerHuaValueShow(this.getParent());
                        },

                        removePlayer: function(eD) {
                            MjClient.playui.setPlayerHuaValueShow(this.getParent());
                        },

                        waitJiazhu: function (eD) {
                            MjClient.playui.setPlayerHuaValueShow(this.getParent());
                        }
                    }
                },
            },
            play_tips: {
                _layout: [[0.08, 0.14], [0.5, 0.75], [0, 0]],
                _run: function () {
                    this.zIndex = actionZindex;
                },
                _visible:false,
            },
            ready: {
                _layout: [
                    [0.07, 0.07],
                    [0.5, 0.5],
                    [0, 1.5]
                ],
                _run: function() {
                    GetReadyVisible(this, 2);
                },
                _event: {
                    moveHead: function() {
                        GetReadyVisible(this, -1);
                    },
                    addPlayer: function() {
                        GetReadyVisible(this, 2);
                    },
                    removePlayer: function() {
                        GetReadyVisible(this, 2);
                    },
                    onlinePlayer: function() {
                        GetReadyVisible(this, 2);
                    },
                    waitJiazhu: function () {
                        GetReadyVisible(this, -1);
                    }
                }
            },

            stand: {
                _layout: [
                    [0, 0.07],
                    [0.5, 1],
                    [-6, -1.4]
                ],
                _visible: false,
                _event: {
                    mjhand:function () {
                        this.visible = false;
                    }
                }
            },

            up: {
                _layout: [
                    [0, 0.07],
                    [0.5, 1],
                    [6, -1.4]
                ],
                _visible: false
            },
            down: {
                _layout: [
                    [0, 0.07],
                    [0.5, 1],
                    [6, -0.7]
                ],
                _visible: false
            },
            out2: {
                _run: function() {
                    // setWgtLayout(this, [0, 0.063], [0.5, 1], [6.8, -2.5]);
                    setWgtLayout(this, [0, 0.08], [0.55, 1], [4.1, -2.3]);
                    if (MjClient.MaxPlayerNum == 2)
                        this.x += this.height * this.scale * 5.5;
                },

                _visible: false
            },
            out1: {
                _run: function() {
                    // setWgtLayout(this, [0, 0.063], [0.5, 1], [6.8, -3.7]);
                    setWgtLayout(this, [0, 0.08], [0.55, 1], [4.1, -3.2]);
                    if (MjClient.MaxPlayerNum == 2)
                        this.x += this.height * this.scale * 5.5;
                },

                _visible: false
            },
            out0: {
                _run: function() {
                    // setWgtLayout(this, [0, 0.063], [0.5, 1], [6.8, -4.9]);
                    setWgtLayout(this, [0, 0.08], [0.55, 1], [4.1, -4.1]);
                    if (MjClient.MaxPlayerNum == 2)
                        this.x += this.height * this.scale * 5.5;
                },

                _visible: false
            },
            outBig: {
                _layout: [
                    [0.0836, 0],
                    [0.5, 0.75],
                    [0, 0]
                ],
                _visible: false
            },
            _event: {
                clearCardUI: function() {
                    clearCardUI(this, 2);
                },
                initSceneData: function(eD) {
                    SetUserVisible_haian(this, 2);
                },
                addPlayer: function(eD) {
                    SetUserVisible_haian(this, 2);
                },
                removePlayer: function(eD) {
                    SetUserVisible_haian(this, 2);
                },
                mjhand: function(eD) {
                    //showShaiziAni_haian(2);
                },
                roundEnd: function() {
                    InitUserCoinAndName(this, 2);

                },
                waitPut: function() {
                    if(_isAniShow_Haian) return;
                    DealWaitPut(this, MjClient.data.sData.tData, 2);
                },
                MJPut: function(eD) {
                    DealMJPut_haian(this, eD, 2);
                    if(eD.uid != SelfUid())
                    {
                        hideTingBtn();
                    }
                    setUserOffline(this, 2);
                },
                MJChi: function(eD) {
                    // DealMJChi(this, eD, 2);
                    if (MjClient.rePlayVideo != -1) {
                        DealMJChi(this, eD, 2);
                    }else {
                        updateHeadUI_haian(this, 2, ActionType.CHI);
                    }
                    setUserOffline(this, 2);
                },
                MJGang: function(eD) {
                    DealMJGang(this, eD, 2);
                    setUserOffline(this, 2);
                },
                MJPeng: function(eD) {
                    // DealMJPeng(this, eD, 2);
                    if (MjClient.rePlayVideo != -1) {
                        DealMJPeng(this, eD, 2);
                    }else {
                        updateHeadUI_haian(this, 2, ActionType.PENG);
                    }
                    setUserOffline(this, 2);
                },
                MJHu: function(eD) {
                    HandleMJHu(this, eD,2);
                    setUserOffline(this, 2);
                },
                onlinePlayer: function(eD) {
                    setUserOffline(this, 2);
                },
                playerStatusChange: function(eD) {
                    setUserOffline(this, 2);
                },
                MJFlower: function(eD) {
                    HandleMJFlower(this, eD, 2);
                },
                MJTing: function (eD) {
                    HandleMJTing(this, eD, 2);
                }
            }
        },
        left: {
            _run: function() {
                this.visible = MjClient.MaxPlayerNum !== 2;
            },
            head: {
                tuoguan: {
                    _run:function () {
                        this.visible = false;
                    },
                    _event:{
                        beTrust:function (msg) {
                            if(getUIPlayer(3)&&getUIPlayer(3).info.uid == msg.uid){
                                this.visible = true;
                            }
                        },
                        cancelTrust:function (msg) {
                            if(getUIPlayer(3)&&getUIPlayer(3).info.uid == msg.uid){
                                this.visible = false;
                            }
                        }
                    }
                },
                zhuang: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        waitPut: function() {
                            showUserZhuangLogo(this, 3);
                        },
                        initSceneData: function() {
                            if (IsArrowVisible()) showUserZhuangLogo(this, 3);
                        }
                    }
                },
                chatbg: {
                    _run: function() {
                        this.getParent().zIndex = 500;
                    },
                    chattext: {
                        _event: {

                            MJChat: function(msg) {
                                this.setFontSize(30);
                                showUserChat(this, 3, msg);
                            },
                            playVoice: function(voicePath) {
                                MjClient.data._tempMessage.msg = voicePath;
                                showUserChat(this, 3, MjClient.data._tempMessage);
                            }
                        }
                    }
                },
                _click: function(btn) {
                    showPlayerInfo(3, btn);
                },
                _event: {
                    loadWxHead: function(d) {
                        setWxHead(this, d, 3);
                    },
                    addPlayer: function(eD) {
                        showFangzhuTagIcon(this,3);
                    },
                    removePlayer: function(eD) {
                        showFangzhuTagIcon(this,3);
                    }
                },
                _run: function () {
                    // this.zIndex = 600;
                    showFangzhuTagIcon(this,3);
                },
                score_bg:{_visible:false},
                name_bg:{_visible:false},
                flower_layout: {_visible:false},
                flower_zfb_layout : {_visible:false},
                tingCard: {
                    _visible:false,
                    _event: {
                        MJTing: function (eD) {
                            if(MjClient.playui.isPlayerPutCard(eD,3))
                            {
                                var pl = getUIPlayer(3);
                                pl.putCardAfterTing = eD.putCardAfterTing;
                                MjClient.playui.setTingCardInfo(this,eD,3);
                            }
                        },
                        clearCardUI: function(eD) {
                            cc.log("ready to----- clear sking ----");
                            this.visible = false;
                        },
                        MJHu: function(eD) {
                           this.visible = false;
                        },
                        onlinePlayer: function(eD) {
                            //MjClient.playui.setTingCardInfo(this,eD,3);
                        },
                        initSceneData:function(eD)
                        {
                            MjClient.playui.setTingCardInfo(this,eD,3);
                        }
                    }
                },
                tingIcon: {
                    _visible:false,
                    _run:function(){
                        this.visible = false;
                        this.runAction(cc.sequence(cc.spawn(cc.tintTo(0.6, 255,0,0),cc.scaleTo(0.6,this.getScale() + 0.3)),
                            cc.spawn(cc.tintTo(0.6, 255,255,255),cc.scaleTo(0.6,this.getScale()))).repeatForever());
                    },
                    _event: {
                        clearCardUI: function(eD) {
                            this.visible = false;
                            cc.log("tingIcon 333 ----- clearCardUI ----");
                        },
                        MJHu: function(eD) {
                            this.visible = false;
                        },
                        moveHead: function() {
                            MjClient.playui.tingIconVisible(this, 3);
                        },
                        onlinePlayer: function(eD) {
                            //MjClient.playui.tingIconVisible(this,3);
                        },
                        initSceneData:function(eD)
                        {
                            MjClient.playui.tingIconVisible(this,3);
                        },
                        roundEnd: function(){
                            // cc.log("end rounde-----------------------333-");
                            this.visible = false;
                        }
                    }
                },
                maizhuang: {
                    _run: function() {
                        this.visible = false;
                        var _zhuangIcon = getNode(3).getChildByName("head").getChildByName("maizhuangicon");
                        _zhuangIcon.visible = false;
                    },
                    _event: {
                        waitJiazhu:function (eD) {
                            this.visible = false;
                            var _zhuangIcon = getNode(3).getChildByName("head").getChildByName("maizhuangicon");
                            _zhuangIcon.visible = false;
                        },
                        clearCardUI: function() {
                            this.visible = false;
                            var _zhuangIcon = getNode(3).getChildByName("head").getChildByName("maizhuangicon");
                            _zhuangIcon.visible = false;
                        },
                        MJJiazhu: function(msg) {
                            setMaizhuangTag_haian(msg,3)
                        },
                        mjhand:function()
                        {
                            this.visible = false;
                        },
                        initSceneData: function() {

                        }
                    }
                },
                huaCount: {
                    _run:function(){
                        MjClient.playui.setPlayerHuaValueShow(this.getParent());
                        changeAtalsForLabel(this, 0);
                    },
                    _event:
                    {
                        clearCardUI: function(eD) {
                            changeAtalsForLabel(this,0);
                        },

                        addPlayer: function(eD) {
                            MjClient.playui.setPlayerHuaValueShow(this.getParent());
                        },

                        removePlayer: function(eD) {
                            MjClient.playui.setPlayerHuaValueShow(this.getParent());
                        },

                        waitJiazhu: function (eD) {
                            MjClient.playui.setPlayerHuaValueShow(this.getParent());
                        }
                    }
                }
            },
            play_tips: {
                _layout: [[0.08, 0.14], [0.25, 0.5], [0, 0.5]],
                _run: function () {
                    this.zIndex = actionZindex;
                },
                _visible:false,
            },
            ready: {
                _layout: [
                    [0.07, 0.07],
                    [0.5, 0.5],
                    [-2, 0]
                ],
                _run: function() {
                    GetReadyVisible(this, 3);
                },
                _event: {
                    moveHead: function() {
                        GetReadyVisible(this, -1);
                    },
                    addPlayer: function() {
                        GetReadyVisible(this, 3);
                    },
                    removePlayer: function() {
                        GetReadyVisible(this, 3);
                    },
                    onlinePlayer: function() {
                        GetReadyVisible(this, 3);
                    },
                    waitJiazhu: function () {
                        GetReadyVisible(this, -1);
                    }
                }
            },

            up: {
                _layout: [
                    [0, 0.05],
                    [0, 1],
                    [3.0, -3.5]
                ],
                _visible: false
            },
            down: {
                _layout: [
                    [0, 0.05],
                    [0, 1],
                    [3, -3]
                ],
                _visible: false
            },
            stand: {
                _layout: [
                    [0, 0.08],
                    [0, 0.6],
                    [5.2, 3]
                ],
                _visible: false,
                _event: {
                    mjhand:function () {
                        this.visible = false;
                    }
                }
            },

            out2: {
                _run: function() {
                    // setWgtLayout(this, [0, 0.043], [0.05, 0.5], [4.5, 4.8]);
                    setWgtLayout(this, [0, 0.055], [0.065, 0.5], [2.6, 4.2]);
                    // if (MjClient.MaxPlayerNum == 3)
                    //     this.y += this.height * this.scale * 2;
                },

                _visible: false
            },
            out1: {
                _run: function() {
                    // setWgtLayout(this, [0, 0.043], [0.05, 0.5], [5.8, 4.8]);
                    setWgtLayout(this, [0, 0.055], [0.065, 0.5], [3.9, 4.2]);
                    // if (MjClient.MaxPlayerNum == 3)
                    //     this.y += this.height * this.scale * 2;
                },
                _visible: false
            },
            out0: {
                _run: function() {
                    // setWgtLayout(this, [0, 0.043], [0.05, 0.5], [7.2, 4.8]);
                    setWgtLayout(this, [0, 0.055], [0.065, 0.5], [5.2, 4.2]);
                    // if (MjClient.MaxPlayerNum == 3)
                    //     this.y += this.height * this.scale * 2;
                },
                _visible: false
            },
            outBig: {
                _layout: [
                    [0.0836, 0],
                    [0.25, 0.58],
                    [0, 0]
                ],
                _visible: false
            },
            _event: {
                clearCardUI: function() {
                    clearCardUI(this, 3);
                },
                initSceneData: function(eD) {
                    SetUserVisible_haian(this, 3);
                },
                addPlayer: function(eD) {
                    SetUserVisible_haian(this, 3);
                },
                removePlayer: function(eD) {
                    SetUserVisible_haian(this, 3);
                },
                mjhand: function(eD) {
                    //showShaiziAni_haian(3);
                },
                roundEnd: function() {
                    InitUserCoinAndName(this, 3);
                },
                waitPut: function() {
                    if(_isAniShow_Haian) return;
                    DealWaitPut(this, MjClient.data.sData.tData, 3);
                },
                MJPut: function(eD) {
                    DealMJPut_haian(this, eD, 3);
                    if(eD.uid != SelfUid())
                    {
                        hideTingBtn();
                    }
                    setUserOffline(this, 3);
                },
                MJChi: function(eD) {
                    // DealMJChi(this, eD, 3);
                    if (MjClient.rePlayVideo != -1) {
                        DealMJChi(this, eD, 3);
                    }else {
                        updateHeadUI_haian(this, 3, ActionType.CHI);
                    }
                    setUserOffline(this, 3);
                },
                MJGang: function(eD) {
                    DealMJGang(this, eD, 3);
                    setUserOffline(this, 3);
                },
                MJPeng: function(eD) {
                    // DealMJPeng(this, eD, 3);
                    if (MjClient.rePlayVideo != -1) {
                        DealMJPeng(this, eD, 3);
                    }else {
                        updateHeadUI_haian(this, 3, ActionType.PENG);
                    }
                    setUserOffline(this, 3);
                },
                MJHu: function(eD) {
                    HandleMJHu(this, eD, 3);
                    setUserOffline(this, 3);
                },
                onlinePlayer: function(eD) {
                    setUserOffline(this, 3);
                },
                playerStatusChange: function(eD) {
                    setUserOffline(this, 3);
                },
                MJFlower: function(eD) {
                    HandleMJFlower(this, eD, 3);
                },
                MJTing: function (eD) {
                    HandleMJTing(this, eD, 3);
                }
            }
        },
        eat: {

            chi0: {
                _visible: false,
                _layout: [
                    [0, 0.1],
                    [0.5, 0],
                    [1.3, 2.5]
                ],
                bg_img:{
                    _run:function(){
                        var _Image_light_scale = this.getScale();

                        var a = cc.scaleTo(0.5,_Image_light_scale*1.0);
                        var aa = cc.fadeIn(0.5);
                        var a1 = cc.scaleTo(1,_Image_light_scale*1.3);
                        var a2 = cc.fadeOut(1);
                        var a3 = cc.callFunc(function(){
                            //this.setOpacity(255);
                            this.setScale(_Image_light_scale*0.95);
                        }.bind(this));

                        this.runAction(cc.sequence(cc.spawn(a,aa), cc.spawn(a1,a2).easing(cc.easeCubicActionOut()),a3,cc.delayTime(0.2)).repeatForever());

                    }

                },
                _touch: function(btn, eT) {
                    if (eT == 2) MJChiCardchange(btn.tag);
                },
                bgimg: {
                    _run: function() {
                        this.zIndex = -1;
                    }
                },
                bgground: {
                    _run: function() {
                        this.zIndex = -1;
                    }
                },
                card1: {},
                card2: {},
                card3: {}
            },
            chi1: {
                _visible: false,
                _layout: [
                    [0, 0.1],
                    [0.5, 0],
                    [1.3, 3.8]
                ],
                _touch: function(btn, eT) {
                    if (eT == 2) MJChiCardchange(btn.tag);
                }
            },
            chi2: {
                _visible: false,
                _layout: [
                    [0, 0.1],
                    [0.5, 0],
                    [1.3, 5.1]
                ],
                _touch: function(btn, eT) {
                    if (eT == 2) MJChiCardchange(btn.tag);
                }
            },
            ting: {
                _visible: false,
                _layout: [
                    [0, 0.1],
                    [0.5, 0],
                    [1.3, 2.5]
                ],
                bg_img:{
                    _run:function(){
                        var _Image_light_scale = this.getScale();

                        var a = cc.scaleTo(0.5,_Image_light_scale*1.0);
                        var aa = cc.fadeIn(0.5);
                        var a1 = cc.scaleTo(1,_Image_light_scale*1.3);
                        var a2 = cc.fadeOut(1);
                        var a3 = cc.callFunc(function(){
                            //this.setOpacity(255);
                            this.setScale(_Image_light_scale*0.95);
                        }.bind(this));

                        this.runAction(cc.sequence(cc.spawn(a,aa), cc.spawn(a1,a2).easing(cc.easeCubicActionOut()),a3,cc.delayTime(0.2)).repeatForever());

                    }

                },
                _touch: function(btn, eT) {
                    if (eT == 2)
                    {
                        // MJTingToServer();
                        var eat = MjClient.playui.jsBind.eat;
                        eat.gang0._node.visible = false;
                        eat.guo._node.visible = false;
                        eat.ting._node.visible = false;
                        eat.cancel._node.visible = true;
                        MjClient.clickTing = true;
                        eat.hu._node.visible = false;
                        MjClient.playui._btnPutCard.visible = true;
                        MjClient.playui.CardLayoutRestore(MjClient.playui._downNode, 0);
                        /*
                         设置当前听牌的张数
                         */
                        var pl = getUIPlayer(0);
                        var currentCard = CurrentPutCardMsg();
                        var tingCards = getCheckTingHuCards(currentCard,pl.mjhand);
                        setCurrentTingNum(tingCards);
                    }
                }
            },
            noTing : {
                _visible : false,
                _layout: [
                    [0, 0.1],
                    [0.5, 0],
                    [4.6, 2.5]
                ],
                _touch: function(btn, eT) {
                    if (eT == 2)
                    {
                        cc.log("_____noting__888888____");
                        hideTingBtn();
                    }
                }
            },
            peng: {
                _visible: false,
                _layout: [
                    [0, 0.1],
                    [0.5, 0],
                    [0, 2.5]
                ],
                bg_img:{
                    _run:function(){
                        var _Image_light_scale = this.getScale();

                        var a = cc.scaleTo(0.5,_Image_light_scale*1.0);
                        var aa = cc.fadeIn(0.5);
                        var a1 = cc.scaleTo(1,_Image_light_scale*1.3);
                        var a2 = cc.fadeOut(1);
                        var a3 = cc.callFunc(function(){
                            //this.setOpacity(255);
                            this.setScale(_Image_light_scale*0.95);
                        }.bind(this));

                        this.runAction(cc.sequence(cc.spawn(a,aa), cc.spawn(a1,a2).easing(cc.easeCubicActionOut()),a3,cc.delayTime(0.2)).repeatForever());

                    }

                },
                _touch: function(btn, eT) {
                    console.log(">>>> lf，点击碰按钮");
                    if (eT == 2) MJPengToServer();
                },
                bgimg: {
                    _run: function() {
                        this.zIndex = -1;
                    }
                }
            },
            gang0: {
                _visible: false,
                _layout: [
                    [0, 0.1],
                    [0.5, 0],
                    [-1.7, 2.5]
                ],
                bg_img:{
                    _run:function(){
                        var _Image_light_scale = this.getScale();

                        var a = cc.scaleTo(0.5,_Image_light_scale*1.0);
                        var aa = cc.fadeIn(0.5);
                        var a1 = cc.scaleTo(1,_Image_light_scale*1.3);
                        var a2 = cc.fadeOut(1);
                        var a3 = cc.callFunc(function(){
                            //this.setOpacity(255);
                            this.setScale(_Image_light_scale*0.95);
                        }.bind(this));

                        this.runAction(cc.sequence(cc.spawn(a,aa), cc.spawn(a1,a2).easing(cc.easeCubicActionOut()),a3,cc.delayTime(0.2)).repeatForever());

                    }

                },
                card1: {},
                _touch: function(btn, eT) {
                    if (eT == 2) MJGangCardchange(btn.tag);
                },
                bgimg: {
                    _run: function() {
                        this.zIndex = -1;
                    }
                },
                bgground: {
                    _run: function() {
                        this.zIndex = -1;
                    }
                }
            },
            gang1: {
                _visible: false,
                _layout: [
                    [0, 0.1],
                    [0.5, 0],
                    [-1.7, 3.8]
                ],
                card: {},
                _touch: function(btn, eT) {
                    if (eT == 2) MJGangCardchange(btn.tag);
                }
            },
            gang2: {
                _visible: false,
                _layout: [
                    [0, 0.1],
                    [0.5, 0],
                    [-1.7, 5.1]
                ],
                card: {},
                _touch: function(btn, eT) {
                    if (eT == 2) MJGangCardchange(btn.tag);
                }
            },
            guo: {
                _visible: false,
                _layout: [
                    [0, 0.1],
                    [0.5, 0],
                    [4.6, 2.5]
                ],
                _touch: function(btn, eT) {
                    if (eT == 2)
                    {
                        MjClient.MJPass2NetForhaian();
                    }
                },
                bgimg: {
                    _run: function() {
                        this.zIndex = -1;
                    }
                }
            },
            hu: {
                _visible: false,
                _layout: [
                    [0, 0.1],
                    [0.5, 0],
                    [-3, 2.5]
                ],
                bg_img:{
                    _run:function(){
                        var _Image_light_scale = this.getScale();

                        var a = cc.scaleTo(0.5,_Image_light_scale*1.0);
                        var aa = cc.fadeIn(0.5);
                        var a1 = cc.scaleTo(1,_Image_light_scale*1.3);
                        var a2 = cc.fadeOut(1);
                        var a3 = cc.callFunc(function(){
                            //this.setOpacity(255);
                            this.setScale(_Image_light_scale*0.95);
                        }.bind(this));

                        this.runAction(cc.sequence(cc.spawn(a,aa), cc.spawn(a1,a2).easing(cc.easeCubicActionOut()),a3,cc.delayTime(0.2)).repeatForever());

                    }

                },
                _touch: function(btn, eT) {
                    if (eT == 2) MJHuToServer();
                },
                bgimg: {
                    _run: function() {
                        this.zIndex = -1;
                    }
                }
            },
            cancel: {
                _visible: false,
                _layout: [
                    [0, 0.16],
                    [0.78, 0.1],
                    [0, 1.12]
                ],
                _touch: function(btn, eT) {
                    if (eT == 2) {
                        btn.visible = false;
                        MjClient.clickTing = false;
                        hideCurrentTingNum();
                        MjClient.playui.EatVisibleCheck();
                        MjClient.playui.CardLayoutRestore(MjClient.playui._downNode, 0);
                    }
                }
            },
            changeui: {
                _visible:true,
                changeuibg: {
                    _layout: [
                        [0.36, 0.36],
                        [0.5, 0.15],
                        [0, 0]
                    ],
                    _run: function() {
                        this.visible = false;
                        this.getChildByName("card").visible = false;
                        this.chiTouch = function(btn, et) {
                            if (et == 2)
                            {
                                if (btn.name.localeCompare("card3") < 0)
                                {
                                    MJChiToServer(0);
                                }
                                else if (btn.name.localeCompare("card6") < 0)
                                {
                                    MJChiToServer(1);
                                }
                                else
                                {
                                    MJChiToServer(2);
                                }
                            }
                        };
                        this.gangTouch = function(btn, et) {
                            if (et == 2)
                                MJGangToServer(btn.tag);
                        };
                    },
                    guobg: {
                        guo: {
                            _touch: function(btn, eT) {
                                if (eT == 2) MjClient.MJPass2NetForhaian();
                            }
                        },
                        fanhui: {
                            _touch: function(btn, et) {
                                if (et == 2) {
                                    btn.getParent().getParent().visible = false;
                                    MjClient.playui.EatVisibleCheck();
                                }
                            }
                        }
                    }
                }
            },
            _event: {
                clearCardUI: function() {
                    //add by sking
                    cc.log("ting yu no ting hide --------by sking");
                    MjClient.playui.EatVisibleCheck();
                    hideTingBtn();
                },
                MJPass: function(eD) {
                    console.log("HHH :，MJPass------");
                    setSkipHuState();
                    setSkipPengState(); // 开启 过碰 机制
                    MjClient.playui.EatVisibleCheck();
                },
                mjhand: function(eD) {
                    console.log("HHH :，mjhand------");
                    //MjClient.playui.EatVisibleCheck();
                },
                waitPut: function() {
                    console.log("HHH :，waitPut------");
                    MjClient.playui.EatVisibleCheck();
                    COMMON_UI.willHuShowArrow();
                },
                MJPut: function(eD) {
                    console.log("HHH :，MJPut------");
                    MjClient.playui.EatVisibleCheck();
                },
                MJPeng: function(eD) {
                    console.log("HHH :，MJPeng------");
                    MjClient.playui.EatVisibleCheck();
                },
                MJChi: function(eD) {
                    console.log("HHH :，MJChi------");
                    MjClient.playui.EatVisibleCheck();
                },
                MJGang: function(eD) {
                    console.log("HHH :，MJGang------");
                    MjClient.playui.EatVisibleCheck();
                },
                MJTing: function (eD) {
                    console.log("HHH :，MJTing------");
                    hideTingBtn();
                    isCheckedTing = false;
                },
                roundEnd: function(eD) {
                    console.log("HHH :，roundEnd------");
                    MjClient.playui.EatVisibleCheck();
                },
                initSceneData: function(eD) {
                    function delayExe()
                    {
                        MjClient.playui.EatVisibleCheck();
                    }
                    this.runAction(cc.sequence(cc.DelayTime(0.1),cc.callFunc(delayExe)));
                }
            }
        },
        chat_btn: {
            _layout: [
                [0.08, 0.08],
                [0.97, 0.37],
                [0, 0]
            ],
            _click: function() {
                var chatlayer = new ChatLayer();
                //chatlayer.setScale(1.2);
                MjClient.Scene.addChild(chatlayer);
            }
        },
        voice_btn: {
            _layout: [
                [0.08, 0.08],
                [0.97, 0.46],
                [0, 0]
            ],
            _run: function() {
                initVoiceData();
                cc.eventManager.addListener(getTouchListener(), this);
                if(MjClient.isShenhe) this.visible=false;
            },
            _touch: function(btn, eT) {
                // 点击开始录音 松开结束录音,并且上传至服务器, 然后通知其他客户端去接受录音消息, 播放
                if (eT == 0) {
                    startRecord();
                } else if (eT == 2) {
                    endRecord();
                } else if (eT == 3) {
                    cancelRecord();
                }
            },
            _event: {
                cancelRecord: function() {
                    MjClient.native.HelloOC("cancelRecord !!!");
                },
                uploadRecord: function(filePath) {
                    if (filePath) {
                        MjClient.native.HelloOC("upload voice file");
                        MjClient.native.UploadFile(filePath, MjClient.remoteCfg.voiceUrl, "sendVoice");
                    } else {
                        MjClient.native.HelloOC("No voice file update");
                    }
                },
                sendVoice: function(fullFilePath) {
                    if (!fullFilePath) {
                        console.log("sendVoice No fileName");
                        return;
                    }

                    var getFileName = /[^\/]+$/;
                    var extensionName = getFileName.exec(fullFilePath);
                    var fileName = extensionName[extensionName.length - 1];
                    console.log("sfileName is:" + fileName);

                    MjClient.gamenet.request("pkroom.handler.tableMsg", {
                        cmd: "downAndPlayVoice",
                        uid: SelfUid(),
                        type: 3,
                        msg: fileName,
                        num: MjClient.data._JiaheTempTime//录音时长
                    });
                    MjClient.native.HelloOC("download file");
                },
                downAndPlayVoice: function(msg) {
                    MjClient.native.HelloOC("downloadPlayVoice ok");
                    MjClient.data._tempMessage = msg;
                    MjClient.native.HelloOC("mas is" + JSON.stringify(msg));
                    downAndPlayVoice(msg.uid, msg.msg);
                }
            }
        },
        hua_btn: {
            _layout: [
                [0.08, 0.08],
                [0.97, 0.55],
                [0, 0]
            ],
            _run: function() {
                this.visible = true;
                this.opacity = 255;
                cc.log("===============================run------------- ");
                // var tData = MjClient.data.sData.tData;
                // if(tData.areaSelectMode.flowerType == WithFlowerType.noFlower)
                // {
                //     if (IsArrowVisible()) this.visible = true;
                // }
                // else
                // {
                //     this.visible = false;
                // }

            },
            _touch: function(btn, eT) {
                if (eT == 2) {
                    //显示花
                    var layer = new showFlowerLayer();
                    MjClient.Scene.addChild(layer);


                    //var showCards = [12,13,25];
                    //MjClient.Scene.addChild(new HAHZ_showCardLayer(showCards,function(){
                    //    cc.log("finished call back show cards");
                    //}));
                }
            }
        },
        block_tuoguan:{
            _layout:[
                [1, 1],
                [0.5, 0.5],
                [0, 0],
                true
            ],
            _run: function() {
                this.visible = false;
            },
            btn_tuoguan:{
                _touch:function (btn, eT) {
                    if (eT == 2) {
                        MjClient.gamenet.request("pkroom.handler.tableMsg", {cmd: "cancelTrust"},function (rtn) {
                            btn.getParent().setVisible(false);
                        });
                    }
                }
            },
            _event:{
                beTrust:function (msg) {
                    cc.log("wxd........beTrust......."+JSON.stringify(msg));
                    if(getUIPlayer(0)&&getUIPlayer(0).info.uid == msg.uid){
                        if(MjClient.movingCard){
                            MjClient.movingCard.setTouchEnabled(false);
                            MjClient.movingCard.setScale(cardBeginScale);
                            MjClient.movingCard.setTouchEnabled(true);
                        }
                        this.visible = true;
                    }
                },
                initSceneData:function (msg) {
                    // var pl = getUIPlayer(0);
                    // if(pl.trust){
                    //     this.visible = true;
                    // }else {
                    //     this.visible = false;
                    // }
                }
            }
        },
        gps_btn: {
            _layout: [
                [0.08, 0.08],
                [0.97, 0.84],
                [0, 0]
            ],
            _run: function() {
                if(MjClient.data.sData.tData.maxPlayer == 2)
                {
                    this.visible = false;
                }
            },
            _click: function() {
                if(MjClient.data.sData.tData.maxPlayer == 3){
                    MjClient.Scene.addChild(new showDistance3PlayerLayer());
                }else if(MjClient.data.sData.tData.maxPlayer == 4){
                    MjClient.Scene.addChild(new showDistanceLayer());
                }
                MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Dingwei", {uid: SelfUid(),gameType:MjClient.gameType});
            }
        },
        BtnMai:{
            _run: function () {
                this.visible = false;
                setWgtLayout(this,[0.14, 0.14], [0.6, 0.4], [0, 0]);
            },
            _click: function(btn,type) {
                cc.log("买");
                btn.visible = false;
                btn.getParent().getChildByName("BtnBumai").visible = false;
                MjClient.gamenet.request("pkroom.handler.tableMsg", {
                    cmd: "MJJiazhu",
                    jiazhuNum: 1,
                });
            },
            _event: {
                mjhand: function () {
                    this.visible = false;
                },
                initSceneData:function()
                {
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    var pl = getUIPlayer_changpai(0);
                    if(tData.tState == TableState.waitJiazhu && SelfUid() == pl.info.uid)
                    {
                        if(pl.mjState == TableState.waitJiazhu)
                        {
                            this.visible = true;
                        }
                    }
                },
                waitJiazhu:function (eD) {
                    this.visible = true;
                },
            }
        },
        BtnBumai:{
            _run: function () {
                this.visible = false;
                setWgtLayout(this,[0.14, 0.14], [0.4, 0.4], [0, 0]);
            },
            _click: function(btn,type) {
                cc.log("不买");
                btn.visible = false;
                btn.getParent().getChildByName("BtnMai").visible = false;
                MjClient.gamenet.request("pkroom.handler.tableMsg", {
                    cmd: "MJJiazhu",
                    jiazhuNum: 0,
                });
            },
            _event: {
                mjhand: function () {
                    this.visible = false;
                },
                initSceneData:function()
                {
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    var pl = getUIPlayer_changpai(0);
                    if(tData.tState == TableState.waitJiazhu && SelfUid() == pl.info.uid)
                    {
                        if(pl.mjState == TableState.waitJiazhu)
                        {
                            this.visible = true;
                        }
                    }
                },
                waitJiazhu:function (eD) {
                    this.visible = true;
                },
            }
        },//排序
    },
    _downNode:null,
    _rightNode:null,
    _topNode:null,
    _leftNode:null,
    _btnPutCard:null,
    _btnFlower:null,
    ctor: function() {
        this._super();
        this.srcMaxPlayerNum = MjClient.MaxPlayerNum;
        MjClient.MaxPlayerNum = Number(MjClient.data.sData.tData.maxPlayer);
        if(Number(MjClient.MaxPlayerNum) === 3) //三个人，按四个人的位置来
        {
            MjClient.MaxPlayerNum = 4;
        }
        var playui = ccs.load(res.Play_haian_json);
        playMusic("bgFight");
        this._downNode  = playui.node.getChildByName("down");
        this._rightNode = playui.node.getChildByName("right");
        this._topNode   = playui.node.getChildByName("top");
        this._leftNode  = playui.node.getChildByName("left");
        MjClient.playui = this;
        this._btnPutCard = playui.node.getChildByName("BtnPutCard");
        this._tingCardsNode = this._downNode.getChildByName("tingCardsNode");
        this._tingCardNumNode = this._downNode.getChildByName("tingCardNumNode");
        MjClient.playui._AniNode =  playui.node.getChildByName("eat");
        BindUiAndLogic(playui.node, this.jsBind);

        // 添加光晕动画
        COMMON_UI.addAniEatCardsBtn();

        this.addChild(playui.node);

        // 有筛子动画，进行标记
        MjClient.playui.hasShaziAni = true;


        cc.log("====================MjClient.MaxPlayerNum =" + JSON.stringify(MjClient.data.sData.tData));
        //添加滚动通知 by sking
        var _laba_bg =  playui.node.getChildByName("banner").getChildByName("laba_bg");
        _laba_bg.visible = false;
        var _scroll =  playui.node.getChildByName("banner").getChildByName("scroll");
        _scroll.visible = false;
        MjClient.playui._btnFlower = playui.node.getChildByName("hua_btn");

        //MjClient.playui._jiazhuWait = playui.node.getChildByName("jiazhuWait");
        //var _msg = _scroll.getChildByName("msg");
        //homePageRunText(_msg);
        //function getMsg()
        //{
        //    var content = (MjClient.updateCfg != null && (typeof MjClient.updateCfg) != 'undefined') ? MjClient.updateCfg.homeScroll : "";
        //    return MjClient.isTest ? "" : content;
        //}
        //_msg.setString(getMsg());


        MjClient.lastMJTick = Date.now();
        this.runAction(cc.repeatForever(cc.sequence(cc.callFunc(function() {
            if (MjClient.game_on_show) MjClient.tickGame(0);
        }), cc.delayTime(7))));

        changeMJBg(this, getCurrentMJBgType());

        //房间信息，这个要放在下面，需要前面的UI初始化的支持
        //setRoomInfo_haian();
        //初始化其他功能
        initSceneFunc();

        // 在亲友圈房间中添加邀请亲友圈牌有一起对局
        addClubYaoqingBtn();

        return true;
    },
    onExit:function()
    {
        this._super();
        MjClient.MaxPlayerNum = this.srcMaxPlayerNum;
    },

    setPlayerHuaValueShow:function(parentNode)
    {
        var tData = MjClient.data.sData.tData;
        var isShow = tData.areaSelectMode.flowerType != WithFlowerType.noFlower && !IsInviteVisible() && (tData.tState !== TableState.waitJiazhu);
        parentNode.getChildByName("huaIcon").visible = isShow;
        parentNode.getChildByName("huaX").visible = isShow;
        parentNode.getChildByName("huaCount").visible = isShow;
    },

    /*
     判断当前是否可以出牌，add by sking
     */
    isCanPutCard:function()
    {

        var bPut = false;
        var downNode = MjClient.playui._downNode;
        var standUI = downNode.getChildByName("stand");
        var children = downNode.children;
        for(var i = 0; i < children.length; i++)
        {
            if(children[i].name == "mjhand")
            {
                if(children[i].y > standUI.y + 10)
                {
                    bPut = true;
                    break;
                }
            }
        }
        return bPut;
    },

    /*
     设置听的icon 是否可见 add by sking
     */
     tingIconVisible:function(node,off)
    {
        var pl = getUIPlayer(off)
        if(pl == null) return;
        var tData = MjClient.data.sData.tData;

        if(pl && (pl.mjState == TableState.isReady || pl.mjState == TableState.roundFinish))
        {
            //准备状态时，所有的听Icon不可见
            //var node = node.getParent().getParent().getParent().getChildByName("")
            var _tingIcon1 = this._downNode.getChildByName("head").getChildByName("tingIcon");
            _tingIcon1.visible = false;

            var _tingIcon2 = this._rightNode.getChildByName("head").getChildByName("tingIcon");
            _tingIcon2.visible = false;

            var _tingIcon3 = this._topNode.getChildByName("head").getChildByName("tingIcon");
            _tingIcon3.visible = false;

            var _tingIcon4 = this._leftNode.getChildByName("head").getChildByName("tingIcon");
            _tingIcon4.visible = false;
            // cc.log("(((((((((((( TableState.isReady))))))))))))))))) == TableState.isReady  " + TableState.isReady);
            node.visible = false;
        }else{
            if(pl != null)
            {
                if (pl.isTing) node.visible = true;

                // 有起手听牌检查，这里应该可以不用了
                // if (off == 0)
                // {
                //     var tingSet = calTingSet(pl.mjhand);
                //     setTingCards_showCount(this._tingCardsNode,tingSet);
                // }
            }
        }
        return node.visible;
    },
    /*
        设置听牌之后打牌的花色, by sking
    */
    setTingCardInfo:function(node,eD,off)
    {
        /*
            游戏准备
         */
        cc.log("%%%%%%%%%%%%%%%%setCard%%%%%%%%%%%%%%%%%%% = " + off);
        var pl = getUIPlayer(off);
        if(pl == null) return;
        var tData = MjClient.data.sData.tData;
        cc.log("(((((((((((( set card))))))))))))))))) == pl.mjState  " + pl.mjState);
        if( pl.mjState == TableState.isReady || pl.mjState == TableState.roundFinish)
        {
            cc.log("*********set ting card info***************111");
            node.visible = false;
            return;
        }

        /*
            判断是否拿到了听之后的那张牌
         */
        var cd = -1;

        if(pl.isTing)
        {
            if(pl.putCardAfterTing)
            {
                cd = pl.putCardAfterTing;
            }else{
                return;
            }
        }else{
            node.visible = false;
            return;
        }

        cc.log("%%%%%%%%%%%%%%%%setCard%%%%%%%%%%%%%%%%%%%  pl.putCardAfterTing = " + pl.putCardAfterTing);

        /*
            设置麻将的花纹
         */
        //东南西北中发白
        var imgNames = ["Bamboo_", "Character_", "Dot_", "Wind_east", "Wind_south", "Wind_west", "Wind_north", "Red", "Green", "White"];
        var offSets = [];
        if (getCurrentMJBgType() == 0)
            offSets = [[50, 90], [60, 70], [50, 90], [60, 70], [48, 62]];
        else
            offSets = [[52, 100], [60, 70], [52, 100], [60, 70], [50, 66]];
        //麻将的底牌公用图，4张
        //node.loadTexture("playing/MJ/Mj_up_" + off + ".png");

        var imgNode = new ccui.ImageView();
        imgNode.setPosition(offSets[0][0], offSets[0][1]);
        node.visible = true;
        node.removeAllChildren();
        node.addChild(imgNode);

        // 贴在麻将上面可变的图
        var path = "playing/MJ/"
        var imgName = "";
        if(cd < 30)
        {
            //条，筒，万
            imgName = imgNames[Math.floor(cd / 10)] + cd % 10;
        }
        else if (cd <= 91)
        {   //东南西北中发白
            imgName = imgNames[Math.floor(cd / 10)];//东南西北中发白
        }
        else if (cd <= 181){
            imgName = "flower_" + cd;
        }

        //node.tag = cd;
        var callback = function()
        {
            //加载小图
            imgNode.loadTexture(getNewMJBgFile(path + imgName + ".png"));
            if (getCurrentMJBgType() != 0) {
                // 左右两侧的牌偏大，特殊处理，缩小
                if (off == 1 || off == 3) {
                    imgNode.setScale(0.8);
                }
            }
        };

        node.stopAllActions();
        node.runAction(cc.sequence(cc.callFunc(callback), cc.delayTime(1)));
    },
    /*
        打出去的牌是那个玩家的， by sking
     */
    isPlayerPutCard:function(eD,off)
    {
        // var tData = MjClient.data.sData.tData;
        // var uids = tData.uids;
        // var idx = uids.indexOf(eD.uid);
        // var selfidx = uids.indexOf(SelfUid());
        // var offidx = (idx-selfidx+4)%4;

        var _UIOff = getUiOffByUid(eD.uid)

        if(_UIOff == off)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
});


PlayLayer_haian.prototype.CardLayoutRestore = function(node, off)
{
    // node 是克隆新建的一个麻将节点 by sking

    var newC = null; //先创建麻将的UI节点
    var newVal = 0; //新牌的值，是几万，几筒，几条....为数字
    var pl = getUIPlayer(off);//获取玩家信息.off 为0 ，就是自己得信息，能看到自己摸牌 by sking
    var mjhandNum = 0;
    var children = node.children;
    for(var i = 0; i < children.length; i++)
    {
        var ci = children[i];
        if(ci.name == "mjhand")
        {
            ci.stopActionByTag(20180131);
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
        if(count == 14 && mjhandNum == pl.mjhand.length)
        {
            if(pl.isNew ) //isNew 每次摸完牌后设为true,打出去一张牌后 设为false by sking
            {
                newVal = pl.mjhand[pl.mjhand.length - 1]; //为什么取最后一个节点 ？
            }
            else
            {
                pl.mjhand.sort(function(a, b)
                {
                    if(tempMaJiang.isEqualHunCard(a))
                    {
                        return -1;
                    }
                    else if (tempMaJiang.isEqualHunCard(b))
                    {
                        return 1;
                    }
                    else
                    {
                        return a - b;
                    }
                });

                newVal = pl.mjhand[pl.mjhand.length - 1];
            }
        }
    }
    //up stand 是2种麻将的图。
    var up = node.getChildByName("up");
    var stand = node.getChildByName("stand");
    var start, offui;
    switch (off)
    {
        case 0:
            start = up;
            offui = stand;
            break;
        case 1:
            start = stand;
            offui = up;
            break;
        case 2:
            start = stand;
            offui = up;
            break;
        case 3:
            start = up;
            offui = up;
            break;
    }
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

    var sData = MjClient.data.sData;
    if (sData) var tData = sData.tData;
    var zimoHuType = (pl.huWord && (pl.huWord == "zimo" || pl.huWord == "tianhu"))
                    || (pl.mjState && tData && (tData.tState == TableState.waitPut && pl.mjState == TableState.waitPut));
    if (off != 0 && uistand.length > 0 && zimoHuType && pl.zimoNode) {
        uistand[uistand.length - 1].removeFromParent();
        var zimoNode = getNewCard(getNode(off), "up", "standPri", pl.zimoNode, off);
        zimoNode.setName("zimoCardNode");
        if (off == 3) {
            uistand.push(zimoNode);
        }
        else {
            uistand.unshift(zimoNode);
        }
    }

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
    if(off == 1 || off == 2)
    {
        uiOrder.reverse();//颠倒顺序
    }
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
    for(var i = 0; i < orders.length; i++)
    {
        var ci = orders[i];
        if(off % 2 == 0)//自己或者对家
        {
            if(i != 0)
            {
                if(ci.name == orders[i - 1].name)
                {
                    if(ci.isgang4)
                    {
                        ci.x = orders[i - 2].x;
                        ci.y = orders[i - 2].y + upSize.height * upS * 0.18;
                    }
                    else if(orders[i - 1].isgang4)
                    {
                        ci.x = orders[i - 2].x + upSize.width * upS + slotwith;
                    }
                    else if(orders[i - 1].ispeng3 || orders[i - 1].ischi3)
                    {
                        ci.x = orders[i - 1].x + upSize.width * upS + slotwith;
                    }
                    else
                    {
                        if(ci.name == "mjhand")
                        {
                            if(off == 0)
                            {
                                ci.x = orders[i - 1].x + upSize.width * upS *1.2//1.08;
                            }
                            else//这个地方不是对家的手牌，下面的代码好像没用
                            {
                                ci.x = orders[i - 1].x + upSize.width * upS * 1.8;
                            }
                        }
                        else
                        {
                            if(off == 0)
                            {
                                ci.x = orders[i - 1].x + upSize.width * upS * 0.91;
                            }
                            else
                            {
                                ci.x = orders[i - 1].x + upSize.width * upS * 1.05;//对家的手牌
                            }
                        }
                    }
                }
                else if(orders[i - 1].name == "gang0" || orders[i - 1].name == "gang1")
                {
                    ci.x = orders[i - 2].x + upSize.width * upS + slotwith;
                }
                else
                {
                    ci.x = orders[i - 1].x + upSize.width * upS * 1.3;
                }
                ci.zIndex = orders[i - 1].zIndex + 1;
            }
            else
            {
                if (off == 0)
                {
                    ci.x = start.x + upSize.width * upS * 0.1;
                    ci.zIndex = start.zIndex + 100  ;//第一张牌的层级
                }
                else
                {
                    ci.x = start.x + upSize.width * upS;
                }

                var isGray =  pl.isTing && ci.name == "mjhand";
                if (isGray)
                {
                    ci.setColor(cc.color(190, 190, 190));
                    ci.addTouchEventListener(function () {});
                }

                if (ci.name == "mjhand" && (pl.isTing || MjClient.clickTing && !MjClient.canTingCards[ci.tag]))
                    ci.setColor(cc.color(190, 190, 190));
                else
                    ci.setColor(cc.color(255, 255, 255));
            }

            if(off == 0)
            {
                /*
                 ting的情况下，将麻将置灰
                 */
                // console.log("--------orders.length--------"+orders.length);
                var isGray =  pl.isTing && ci.name == "mjhand";
                //if(ci.name == "mjhand")

                if(MjClient.clickTing)
                {
                    if (ci.name == "mjhand")
                    {
                        if(MjClient.canTingCards[ci.tag])
                        {
                            ci.setColor(cc.color(255, 255, 255));
                            if (!hasUp) {
                                //ci.y += 20;
                                hasUp = true;
                            }
                        }
                        else {
                            ci.setColor(cc.color(190, 190, 190));
                        }
                    }
                    else {
                        ci.setColor(cc.color(255, 255, 255));
                    }
                }
                else if(i == orders.length - 1)
                {
                    console.log(ci.tag+"--------newC--------"+newC);
                    if(newC)
                    {
                        ci.setColor(cc.color(255, 255, 255));
                        SetTouchCardHandler(stand, ci);
                        ci.x = ci.x + slotwith + 10;
                        //ci.y += 20;
                    }
                    else if(isGray)
                    {
                        ci.setColor(cc.color(190, 190, 190));
                        ci.addTouchEventListener(function () {});
                    }
                    else
                    {
                        ci.setColor(cc.color(255, 255, 255));
                        SetTouchCardHandler(stand, ci);
                    }
                }
                else if(isGray)
                {
                    ci.setColor(cc.color(190, 190, 190));
                    ci.addTouchEventListener(function () {});
                }
                else
                {
                    ci.setColor(cc.color(255, 255, 255));
                    SetTouchCardHandler(stand, ci);
                }

                //吃后，不能打的这张牌
                var tData = MjClient.data.sData.tData;
                if(IsTurnToMe() && tData.tState === TableState.waitPut)
                {
                    if(ci.name == "mjhand" && tData.putType == 1 && pl.mjhand.length > 2 && pl.mjchiCard)
                    {
                        if(pl.mjchiCard[pl.mjchiCard.length - 1] === ci.tag)
                        {
                            ci.setColor(cc.color(190, 190, 190));
                            // ci.addTouchEventListener(function () {});
                        }
                    }

                    if(MjClient.majiang.isCardFlower(ci.tag))
                    {
                        if(!pl.isNew)
                        {
                            ci.setColor(cc.color(190, 190, 190));
                        }
                    }
                }
            }
        }
        else
        {
            if(i != 0)
            {
                if(ci.name == orders[i - 1].name)
                {
                    if(ci.isgang4)
                    {
                        ci.y = orders[i - 2].y + slotheigt;
                    }
                    else if(orders[i - 1].isgang4)
                    {
                        ci.y = orders[i - 2].y - upSize.height * upS * 1.1;
                    }
                    else if(orders[i - 1].ispeng3 || orders[i - 1].ischi3)
                    {
                        ci.y = orders[i - 1].y - upSize.height * upS * 1.1 ;
                    }
                    else
                    {
                        ci.y = orders[i - 1].y - upSize.height * upS * 0.8;
                    }
                }
                else if(orders[i - 1].name == "standPri")
                {
                    ci.y = orders[i - 1].y - upSize.height * upS * 2;
                }
                else if(orders[i - 1].name == "gang0" || orders[i - 1].name == "gang1")
                {
                    ci.y = orders[i - 2].y - upSize.height * upS * 1.1;
                }
                else if(orders[i - 1].name == "mjhand_replay")
                {
                    ci.y = orders[i - 1].y - upSize.height * upS * 2;
                }
                else
                {
                    ci.y = orders[i - 1].y - upSize.height * upS * 1.1;
                }

                ci.zIndex = orders[i - 1].zIndex + 1;//调整每张牌的层级
            }
            else
            {
                ci.y = start.y - upSize.height * upS * 0.2;
                ci.y += 10;
                ci.zIndex = start.zIndex ;//第一张牌的层级
            }
        }
    }

    //刷新手牌大小
    if(COMMON_UI3D.is3DUI()){
        COMMON_UI3D.set3DCardSprite(off);
    }
    else {
        resetCardSize();
    }
    //胡牌引导，可听得牌加箭头
    COMMON_UI.willHuShowArrow();
};

// 判断吃碰杠胡的状态
PlayLayer_haian.prototype.EatVisibleCheck = function()
{
    if(_isAniShow_Haian) return;
    var eat = MjClient.playui.jsBind.eat;
    //sk 为啥要隐藏掉？   //因为一开始是不可见的，隐藏根节点 by sking
    MjClient.playui.jsBind.eat.changeui.changeuibg._node.visible = false;
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var leftCard = MjClient.majiang.getAllCardsTotal() - tData.cardNext;
    eat.chi0._node.visible = false;
    eat.chi1._node.visible = false;
    eat.chi2._node.visible = false;
    eat.peng._node.visible = false;
    eat.gang0._node.visible = false;
    eat.gang1._node.visible = false;
    eat.gang2._node.visible = false;
    eat.hu._node.visible = false;
    eat.guo._node.visible = false;
    eat.cancel._node.visible = false;


    var pl = sData.players[SelfUid() + ""];
    MjClient.gangCards = [];
    MjClient.eatpos = [];

    var mj = MjClient.majiang;

    //吃碰杠胡node
    var vnode = [];

    if(
        pl.mjState == TableState.waitEat ||
        pl.mjState == TableState.waitPut &&
        tData.uids[tData.curPlayer] == SelfUid())
    {

    }
    else
    {
        return;
    }

    //自摸
    if(tData.tState == TableState.waitPut && pl.mjState == TableState.waitPut)
    {
        if(IsTurnToMe())
        {
            //检测补花
            var cduis=MjClient.playui.jsBind.down._node.children;
            for(var i=cduis.length-1;i>=0;i--)
            {
                if(cduis[i].name == "mjhand" && MjClient.majiang.isCardFlower(cduis[i].tag) && pl.isNew)
                {
                    // var callback = function () {
                    //     PutOutCard(cduis[i], cduis[i].tag);
                    // };
                    // cduis[i].runAction(cc.sequence(cc.delayTime(0.3), cc.callFunc(callback)));
                    return;
                }
            }
            //胡
            if (pl.isNew && pl.eatFlag & 8) {
                vnode.push(eat.hu._node);
            }
            // 听
            // if (!pl.isTing) {
            //     // cc.log("￥￥￥￥听牌监测");
            //     MjClient.canTingCards = {};
            //     for (var i = 0; i < pl.mjhand.length; i++) {
            //         var cardsAfterPut = pl.mjhand.slice(0);
            //         cardsAfterPut.splice(i,1); //依次去掉某张牌看能不能听
            //         // cc.log(cardsAfterPut);
            //         if (MjClient.majiang.canTing(cardsAfterPut)) {
            //             MjClient.canTingCards[pl.mjhand[i]] = 1;
            //             if (vnode.indexOf(eat.ting._node) < 0) {
            //                 vnode.push(eat.ting._node);
            //             }
            //         }
            //     }
            // }
            // 杠
            cc.log("=== pl.mjpeng :  " + pl.mjpeng)
            cc.log("=== pl.mjhand :  " + pl.mjhand)
            cc.log("=== pl.isTing :  " + pl.isTing)

            var isNoGang = tData.areaSelectMode.biHu && (pl.eatFlag & 8);

            var rtn = !isNoGang && MjClient.majiang.canGang1(pl.mjpeng, pl.mjhand, pl.isTing);
            cc.log("$$$$杠牌监测"+JSON.stringify(rtn));
            if(rtn.length > 0 && pl.isNew)
            {
                MjClient.gangCards = rtn;
                vnode.push(eat.gang0._node);
            }
            if(vnode.length > 0)
            {
                vnode.push(eat.guo._node);
                eat.ting._node.visible = false;
                eat.noTing._node.visible = false;
                isCheckedTing = false;
            }
        }
    }
    //别人点
    else if(tData.tState == TableState.waitEat)
    {
        // cc.log("diao pao hu-=================================================");
        if(!IsTurnToMe())
        {
            if (pl.eatFlag & 8) {
                vnode.push(eat.hu._node);
            }
            if (pl.eatFlag & 4) {
                vnode.push(eat.gang0._node);
                MjClient.gangCards = [tData.lastPutCard];
                eat.gang0._node.visible = true;
                setCardSprite(eat.gang0.card1._node, MjClient.gangCards[0], 0);
            }
            if (pl.eatFlag & 2) {
                vnode.push(eat.peng._node);
            }
            if (pl.eatFlag & 1) {
                var eatpos = mj.canChi(pl.mjhand, tData.lastPutCard);
                MjClient.eatpos = eatpos;
                if (eatpos.length > 0) {
                    vnode.push(eat.chi0._node);
                }
            }

            //如果，有杠，碰，吃。 这出现过的UI. 否则玩家状态为等待
            if(vnode.length > 0)
            {
                vnode.push(eat.guo._node);
                eat.ting._node.visible = false;
                eat.noTing._node.visible = false;
                isCheckedTing = false;
            }
            else
            {
                getUIPlayer(0).mjState = TableState.waitCard;
            }
        }
    }

    //吃碰杠胡过处理
    if(vnode.length > 0)
    {
        var btnImgs =
        {
            "peng": ["playing/gameTable/youxizhong-2_57.png", "playing/gameTable/youxizhong-2_07.png"],
            "gang0": ["playing/gameTable/youxizhong-2_55.png", "playing/gameTable/youxizhong-2_05.png"],
            "chi0": ["playing/gameTable/youxizhong-2_59.png", "playing/gameTable/youxizhong-2_09.png"],
        }

        for(var i = 0; i < vnode.length; i++)
        {
            vnode[i].visible = true;

            if(vnode[i].getChildByName("card1"))
            {
                vnode[i].getChildByName("card1").visible = false;
            }

            if(vnode[i].getChildByName("bgground"))
            {
                vnode[i].getChildByName("bgground").visible = false;
            }

            if(vnode[i].getChildByName("bgimg"))
            {
                vnode[i].getChildByName("bgimg").visible = true;
            }

            var btnName = vnode[i].name;
            if(btnName == "peng" || btnName == "chi0" || btnName == "gang0")
            {
                vnode[i].loadTextureNormal(btnImgs[btnName][0]);
                // vnode[i].loadTexturePressed(btnImgs[btnName][1]);
            }

            if(i == 0)
            {
                var cardVal = 0;
                if(vnode[i].getChildByName("bgimg"))
                {
                    vnode[i].getChildByName("bgimg").visible = false;
                }

                if(btnName == "peng" || btnName == "chi0" || btnName == "gang0")
                {
                    vnode[i].loadTextureNormal(btnImgs[btnName][0]);
                    // vnode[i].loadTexturePressed(btnImgs[btnName][1]);
                }

                if(btnName == "peng")
                {
                    cardVal = tData.lastPutCard;
                }
                else if(btnName == "chi0")
                {
                    if(MjClient.eatpos.length == 1)
                    {
                        cardVal = tData.lastPutCard;
                    }
                }
                else if(btnName == "gang0")
                {
                    if(MjClient.gangCards.length == 1)
                    {
                        cardVal = MjClient.gangCards[0];
                    }
                }
                else if(btnName == "hu")
                {
                    if(IsTurnToMe())
                    {
                        cardVal = pl.mjhand[pl.mjhand.length - 1];
                    }
                    else
                    {
                        cardVal = tData.lastPutCard;
                    }
                }

                if(cardVal && cardVal > 0)
                {
                    setCardSprite(vnode[0].getChildByName("card1"), cardVal, 0);
                    vnode[0].getChildByName("card1").visible = true;
                }

                if(vnode[0].getChildByName("bgground"))
                {
                    vnode[0].getChildByName("bgground").zIndex = -1;
                    vnode[0].getChildByName("bgground").visible = true;
                }

                //屏蔽到 碰 ，杠 的显示牌 add by sking
                if(vnode[0].getChildByName("bgground"))
                {
                    vnode[0].getChildByName("bgground").visible = false;
                }
                if(vnode[i].getChildByName("card1"))
                {
                    vnode[i].getChildByName("card1").visible = false;
                }
                //end of 屏蔽 碰，杠的显示牌
            }

            setWgtLayout(vnode[i], [0, 0.18], [0.5, 0], [(1 - vnode.length) / 1.8 + i * 1.4, 1.8], false, false);
        }
    }

    if(eat.hu._node.visible)
    {
        MjClient.playui._btnPutCard.visible = false;
    }

    //显示，吃，碰，杠的那几张牌
    COMMON_UI.showCurrentEatCards(vnode);

    if (tData.areaSelectMode.biHu && eat.hu._node.visible == true) {
        eat.guo._node.visible = false;
    }
}