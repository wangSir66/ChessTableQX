/**
 * 麻将的新框架，为了减少代码的关联，同时增强可读性,可能有待完善
 * 主要优化，去掉了resetCardSize,优化独立了函数，setMJDif,getNewCard,setCardSprite,触摸事件等setTouchCardHandler，基本上完全独立了
 * Created by sking on 2019/3/4.
 */
var actionZindex = 1000;

var PlayLayer = cc.Layer.extend({
    _downNode:null,
    _rightNode:null,
    _topNode:null,
    _leftNode:null,
    _btnPutCard:null,
    _btnFlower:null,
    ctor: function() {
        this._super();
        var backNode = this.initLoadJsonFile();
        MjClient.playui = this;
        MjClient.backNode = backNode;
        this.srcMaxPlayerNum = MjClient.MaxPlayerNum;
        MjClient.MaxPlayerNum = parseInt(MjClient.data.sData.tData.maxPlayer);

        this.initDefineUI(backNode);
        this.initCocosNodeUI(backNode);

        /*把之前的全局变量改为局部变量*/
        this.setTingCardPosX = null;

        /*
            初始化，每个人的信息节点
         */
        MjClient.playui.Node_player(0);
        MjClient.playui.Node_player(1);
        MjClient.playui.Node_player(2);
        MjClient.playui.Node_player(3);

        //初始化其他功能
        initSceneFunc();
        // 在亲友圈房间中添加邀请亲友圈牌有一起对局
        addClubYaoqingBtn(1);

        // 添加光晕动画
        COMMON_UI.addAniEatCardsBtn();

        MjClient.lastMJTick = Date.now();
        this.runAction(cc.repeatForever(cc.sequence(cc.callFunc(function() {
            if (MjClient.game_on_show) MjClient.tickGame(0);
        }), cc.delayTime(7))));

        changeMJBg(this, getCurrentMJBgType());

        playMusic("bgFight");
        return true;
    },

    initLoadJsonFile:function(){

    },
    onExit:function()
    {
        this._super();
        MjClient.MaxPlayerNum = this.srcMaxPlayerNum;
    },
    setPlayerHuaValueShow:function(parentNode)
    {
        var tData = MjClient.data.sData.tData;
        var isShow = tData.areaSelectMode.flowerType != WithFlowerType.noFlower && !IsInviteVisible();

        parentNode.getChildByName("huaBg").visible = isShow;
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
        cc.log("offffffffffffffffffffff  =  " + off );
        //cc.log("(((((((((((( set card))))))))))))))))) == pl.mjState  " + pl.mjState );

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
                if (pl.isTing) {
                    // cc.log("(((((((((((( TableState.isReady))))))))))))))))) == pl.isTing  " + pl.isTing);
                    node.visible = true;
                    if (off == 0)
                    {
                        var tingSet = calTingSet(pl.mjhand);
                        this.setTingCards(this._tingCardsNode,tingSet);
                    }
                }
                else {
                    node.visible = false;
                }
            }
        }
        return node.visible;
    },
    /*
        设置听牌之后打牌的花色, by sking
    */
    setTingCardInfo:function(node,eD,off)
    {
        return;//不显示
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
        var _UIOff = getUiOffByUid(eD.uid)
        if(_UIOff == off)
            return true;
        else
            return false;
    },

    isCanShowSkipAnGang:function(){
        var skipAnGangArr = String(util.localStorageEncrypt.getStringItem("lastAnGangArray", ""));
        var anGangArr = String(MjClient.playui.anGangCards);
        return skipAnGangArr !== anGangArr;
    },

    // 记录过杠数据
    recordSkipAnGangArr:function(){
        var anGangArr = MjClient.playui.anGangCards;
        util.localStorageEncrypt.setStringItem("lastAnGangArray", String(anGangArr));
    },
});

PlayLayer.prototype.CardLayoutRestore = function(node, off)
{

    var newC = null; //先创建麻将的UI节点
    var newVal = 0; //新牌的值，是几万，几筒，几条....为数字
    var pl = getUIPlayer(off);//获取玩家信息.off 为0 ，就是自己得信息，能看到自己摸牌 by sking
    var mjhandNum = 0;
    var children = node.children;
    for(var i = 0; i < children.length; i++)
    {
        var ci = children[i];
        ci.stopActionByTag(20180131);
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
        || (pl.mjState && tData && (tData.tState == TableState.waitPut && pl.mjState == TableState.waitPut ));
    if (off != 0 && uistand.length > 0 && zimoHuType && pl.zimoNode) {
        // var lastNode =  uistand.shift();
        // lastNode.removeFromParent();
        uistand[uistand.length - 1].removeFromParent();
        var zimoNode = MjClient.playui.getNewCard(getNode(off), "up", "standPri", pl.zimoNode, off);
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
                    if(ci.isgang4)        // 当前ci是杠的第四张牌，上面那张
                    {
                        ci.x = orders[i - 2].x;
                        ci.y = orders[i - 2].y + upSize.height * upS * 0.18;
                    }
                    else if(orders[i - 1].isgang4)
                    {

                        ci.x = orders[i - 2].x + upSize.width * upS + slotwith + 10;
                    }
                    else if(orders[i - 1].ispeng3)
                    {
                        ci.x = orders[i - 1].x + upSize.width * upS + slotwith + 10;
                    }
                    else
                    {
                        if(ci.name == "mjhand")
                        {
                            if(off == 0)
                            {
                                ci.x = orders[i - 1].x + upSize.width * upS * COMMON_UI.cardBetween//1.02
                            }
                            else//这个地方不是对家的手牌，下面的代码好像没用
                            {
                                ci.x = orders[i - 1].x + upSize.width * upS * 1.8;
                            }
                        }
                        else
                        {
                            // ci是吃碰杠之间的牌
                            if(off == 0)
                            {
                                var cardBetween = COMMON_UI.chipenggangBetween;
                                ci.x = orders[i - 1].x + upSize.width * upS * cardBetween;
                            }
                            else
                            {
                                ci.x = orders[i - 1].x + upSize.width * upS * 1;//对家的手牌
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
                                ci.y += 20;
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
                        MjClient.newCard = newC;
                        MjClient.newCard.isNew = true;

                        //ci.y += 20;//发的新牌默认不提起
                        if (isGray) ci.y += 20;//听牌情况下，发的新牌才默认提起
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
            }
            else
            {
                if(ci.getChildByName("imgNode"))
                    ci.getChildByName("imgNode").setRotation(0);
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
                    else if(orders[i - 1].ispeng3)
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
                ci.zIndex = start.zIndex;//第一张牌的层级
            }
        }
    }

    //刷新手牌大小
    if(COMMON_UI3D.is3DUI()){
        COMMON_UI3D.set3DCardSprite(off);
    }
    // else {
    //     //刷新手牌大小
    //     resetCardSize();
    // }

    MjClient.movingCard = null;
};

/**
 * 检查吃，碰，杠，等状态
 * @constructor
 */
PlayLayer.prototype.EatVisibleCheck = function()
{
    var eat = MjClient.playui.jsBind.eat;
    //sk 为啥要隐藏掉？   //因为一开始是不可见的，隐藏根节点 by sking
    MjClient.playui.jsBind.eat.changeui.changeuibg._node.visible = false;
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var leftCard = MjClient.majiang.getAllCardsTotal() - tData.cardNext;

    var _downNode = getNode(0);

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
    cc.log(" ====== SelfUid() ",SelfUid());
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
            var cduis=_downNode.children;
            for(var i=cduis.length-1;i>=0;i--)
            {
                if(cduis[i].name == "mjhand" && MjClient.majiang.isCardFlower(cduis[i].tag))
                {
                    var callback = function () {
                        PutOutCard(cduis[i], cduis[i].tag);
                    };
                    cduis[i].runAction(cc.sequence(cc.delayTime(0.3), cc.callFunc(callback)));
                    return;
                }
            }
            //胡
            if (pl.isNew && pl.eatFlag & 8) {
                if(pl.mustHu) pl.isZiMoHu = true;
                vnode.push(eat.hu._node);
            }
            //听
            if (!pl.isTing) {
                // cc.log("￥￥￥￥听牌监测");
                MjClient.canTingCards = {};

                for (var i = 0; i < pl.mjhand.length; i++) {
                    var cardsAfterPut = pl.mjhand.slice(0);
                    cardsAfterPut.splice(i,1); //依次去掉某张牌看能不能听
                    // cc.log(cardsAfterPut);
                    if (MjClient.majiang.canTing(cardsAfterPut, cardsAfterPut.concat(pl.mjpeng).concat(pl.mjgang1).concat(pl.mjgang0), tData.areaSelectMode["shisanyao"])) {
                        MjClient.canTingCards[pl.mjhand[i]] = 1;
                        if (vnode.indexOf(eat.ting._node) < 0) {
                            vnode.push(eat.ting._node);
                        }
                    }
                }
            }
            //杠
            cc.log("=== pl.mjpeng :  " + pl.mjpeng)
            cc.log("=== pl.mjhand :  " + pl.mjhand)
            cc.log("=== pl.isTing :  " + pl.isTing)
            var rtn = MjClient.majiang.canGang1(pl.mjpeng, pl.mjhand, pl.isTing);
            cc.log("$$$$杠牌监测"+JSON.stringify(rtn));
            if(rtn.length > 0 && pl.isNew)
            {
                MjClient.gangCards = rtn;
                vnode.push(eat.gang0._node);
            }
            if(vnode.length > 0)
            {
                if(!pl.mustHu) vnode.push(eat.guo._node);
                eat.ting._node.visible = false;
                eat.noTing._node.visible = false;
                isCheckedTing = false;
            }
        }
    }
    //别人点
    else if(tData.tState == TableState.waitEat)
    {

        if(!IsTurnToMe())
        {
            if (pl.eatFlag & 8) {
                if(pl.mustHu) pl.isZiMoHu = true;
                vnode.push(eat.hu._node);
            }
            if (pl.eatFlag & 4) {
                vnode.push(eat.gang0._node);
                MjClient.gangCards = [tData.lastPutCard];
                eat.gang0._node.visible = true;
                MjClient.playui.setCardSprite(eat.gang0.card1._node, MjClient.gangCards[0], 0);
            }
            if (pl.eatFlag & 2) {
                vnode.push(eat.peng._node);
            }

            //如果，有杠，碰，吃。 这出现过的UI. 否则玩家状态为等待
            if(vnode.length > 0)
            {
                if(!pl.mustHu) vnode.push(eat.guo._node);
                eat.ting._node.visible = false;
                eat.noTing._node.visible = false;
                isCheckedTing = false;
            }
            else
            {
                getUIPlayer(0).mjState = TableState.waitCard;
            }

            cc.log("node.length================================================vnode = " + JSON.stringify(vnode));
        }
    }

    //吃碰杠胡过处理
    if(vnode.length > 0)
    {
        cc.log("node.length=================================================" + JSON.stringify(vnode));
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
                    MjClient.playui.setCardSprite(vnode[0].getChildByName("card1"), cardVal, 0);
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

            setWgtLayout(vnode[i], [0, 0.16], [0.5, 0], [(1 - vnode.length) / 1.8 + i * 1.4, 1.8], false, false);
        }
    }

    if(eat.hu._node.visible)
    {
        MjClient.playui._btnPutCard.visible = false;
    }

    //显示，吃，碰，杠的那几张牌
    COMMON_UI.showCurrentEatCards(vnode);

    if (tData.areaSelectMode["calltingautohu"] && eat.hu._node.visible) {
        // 检测是否可胡一条龙，不可以则自动胡牌
        if (MjClient.majiang.canAutoHu(pl.mjhand)) {
            MjClient.playui.sendMessage_MJHu();
        }
    }

}

/**
 * down,top,left right 四个节点下对应的UI功能
 * @param off
 * @constructor
 */
PlayLayer.prototype.Node_player = function(off)
{
    var _node = getNode(off);

    if(off == 1 || off == 3)
    {
        _node.visible = MjClient.MaxPlayerNum != 2;
    }

    if( off == 2)
    {
        _node.visible = MjClient.MaxPlayerNum != 3;
    }

    /********************************************UI节点*********************************************/
    var _head = _node.getChildByName("head");

    //托管
    var _tuoguan = _head.getChildByName("tuoguan");
    if(_tuoguan)
    {
        _tuoguan.visible = false;
        UIEventBind(null, _tuoguan, "beTrust", function (msg) {
            if(getUIPlayer(off) && getUIPlayer(off).info.uid == msg.uid){
                _tuoguan.visible = true;
            }
        });

        UIEventBind(null, _tuoguan, "cancelTrust", function (msg) {
            if(getUIPlayer(off)&&getUIPlayer(off).info.uid == msg.uid){
                this.visible = false;
            }
        });
    }

    var _zhuang = _head.getChildByName("zhuang");
    if(_zhuang)
    {
        _zhuang.visible = false;
    }

    var _chatbg = _head.getChildByName("chatbg");
    if(_chatbg)
    {
        _chatbg.getParent().zIndex = 600;

        var _chattext = _chatbg.getChildByName("chattext");
        UIEventBind(null, _chattext, "MJChat", function (msg) {
            showUserChat(_chattext, off, msg);
        });

        UIEventBind(null, _chattext, "playVoice", function (voicePath) {
            if(MjClient.data._tempMessage)
            {
                MjClient.data._tempMessage.msg = voicePath;
                showUserChat(_chattext, off, MjClient.data._tempMessage);
            }
        });
    }

    _head.setTouchEnabled(true);
    _head.addTouchEventListener(function(sender, type) {
        if (type == 2) {
            that.showPlayerInfo(off, sender);
        }
    }, _head);

    showFangzhuTagIcon(_head,off);

    var _score_bg = _head.getChildByName("score_bg");
    _score_bg.visible = false;

    var _name_bg = _head.getChildByName("name_bg");
    _name_bg.visible = false;

    var _flower_layout = _head.getChildByName("flower_layout");
    _flower_layout.visible = false;

    var _flower_zfb_layout = _head.getChildByName("flower_zfb_layout");
    _flower_zfb_layout.visible = false;

    var _tingCard = _head.getChildByName("tingCard");

    if(_tingCard)
    {
        _tingCard.visible = false;
    }

    var _tingIcon = _head.getChildByName("tingIcon");
    if(_tingIcon)
    {
        _tingIcon.visible = false;
        _tingIcon.runAction(cc.sequence(cc.spawn(cc.tintTo(0.6, 255,0,0),cc.scaleTo(0.6,_tingIcon.getScale() + 0.3)),
            cc.spawn(cc.tintTo(0.6, 255,255,255),cc.scaleTo(0.6,_tingIcon.getScale()))).repeatForever());
    }

    var _huaCount = _head.getChildByName("huaCount");
    if(_huaCount)
    {
        MjClient.playui.setPlayerHuaValueShow(_huaCount.getParent());
        _huaCount.ignoreContentAdaptWithSize(true);
        _huaCount.setString("花 x 0");
    }

    var _skipHuIconTag = _head.getChildByName("skipHuIconTag");
    if(_skipHuIconTag)  _skipHuIconTag.visible = false;

    var _skipPengIconTag = _head.getChildByName("skipPengIconTag");
    if(_skipPengIconTag)  _skipPengIconTag.visible = false;

    var _play_tips = _node.getChildByName("play_tips");
    if(_play_tips)
    {
        _play_tips.visible = false;
        _play_tips.zIndex = actionZindex;
    }


    var _tai_layout = _node.getChildByName("tai_layout");
    if(_tai_layout)
    {
         var _tai_nifo = _tai_layout.getChildByName("tai_info");
        // _tai_nifo.visible = true;
         _tai_nifo.setString("");
    }


    var _ready = _node.getChildByName("ready");
    if(_ready) MjClient.playui.GetReadyVisible(_ready, off);

    var _stand = _node.getChildByName("stand");
    if(_stand) _stand.visible = false;

    var _up = _node.getChildByName("up");
    if(_up) _up.visible = false;

    var _down = _node.getChildByName("down");
    if(_down) _down.visible = false;

    var _out0  = _node.getChildByName("out0");
    _out0.visible = false;
    var _out1 = _node.getChildByName("out1");
    _out1.visible = false;
    var _out2 = _node.getChildByName("out2");
    if (_out2) _out2.visible = false;


    var _outBig = _node.getChildByName("outBig");
    if(_outBig)  _outBig.visible = false;

    var _tingCardsNode = _node.getChildByName("tingCardsNode");
    if(_tingCardsNode)  _tingCardsNode.visible = false;

    var _tingCardNumNode = _node.getChildByName("tingCardNumNode");
    if(_tingCardNumNode) _tingCardNumNode.visible = false;


    /********************************************事件处理*********************************************/
    var that = this;
    UIEventBind(null, _node, "clearCardUI", function (eD) {
        clearCardUI(_node, off);
        var pl = getUIPlayer(off);
        _tingCard.visible = false;
        if(_huaCount) _huaCount.setString("花 x 0");
        if(_skipHuIconTag) _skipHuIconTag.visible = false;
        if(_skipPengIconTag) _skipPengIconTag.visible = false;
        if(_tingCardsNode) _tingCardsNode.visible = false;
        if(_tingCardNumNode) _tingCardNumNode.visible = false;
        if(pl)
        {
            pl.skipHu = [];
            pl.skipPeng = [];
        }
    });

    UIEventBind(null, _node, "initSceneData", function (eD) {
        that.SetUserVisible(_node, off);
        if (IsArrowVisible()) showUserZhuangLogo(_zhuang, off);
        //MjClient.playui.setTingCardInfo(_tingCard,eD,off); ///听后的打的那张牌不用显示
        MjClient.playui.tingIconVisible(_tingIcon,off);
        var pl = getUIPlayer(off);
        if (pl && pl.skipHu && pl.skipHu.length > 0) {
            if(_skipHuIconTag) _skipHuIconTag.visible = true;
        }
        if(pl && _skipPengIconTag)
        {
            if (pl.skipPeng.length > 0) {
                _skipPengIconTag.visible = true;
            }else{
                _skipPengIconTag.visible = false;
            }
        }
        if(_tingCardsNode) MjClient.playui.tingIconVisible(_tingCardsNode,off);
        showAndHideHeadEffect();
    });
    UIEventBind(null, _node, "addPlayer", function (eD) {
        that.SetUserVisible(_node, off);
        showFangzhuTagIcon(_head,off);
        if(_huaCount) MjClient.playui.setPlayerHuaValueShow(_huaCount.getParent());
        MjClient.playui.GetReadyVisible(_ready, off);

    });
    UIEventBind(null, _node, "removePlayer", function (eD) {
        that.SetUserVisible(_node, off);
        showFangzhuTagIcon(_head,off);
        MjClient.playui.GetReadyVisible(_ready, off);
        if(_huaCount)  MjClient.playui.setPlayerHuaValueShow(_huaCount.getParent());
    });
    UIEventBind(null, _node, "mjhand", function (eD) {
        that.InitUserHandUI(_node, off);
    });
    UIEventBind(null, _node, "roundEnd", function (eD) {
        MjClient.playui.InitUserCoinAndName(_node, off);
        _tingIcon.visible = false;
        showAndHideHeadEffect();
    });

    UIEventBind(null, _node, "newCard", function (eD) {
        if(off == 0)
        {
            if (typeof(eD) == "number") {
                eD = {newCard: eD};
            }

            var pl = getUIPlayer(off);
            if(pl.skipHu)
            {
                var _skipHuIconNode = MjClient.playui._downNode.getChildByName("head").getChildByName("skipHuIconTag");
                if(_skipHuIconNode)
                {
                    _skipHuIconNode.visible = (pl.skipHu.length > 0);
                }
            }
            that.DealMessage_MJNewCard(_node,eD.newCard,off);
            hideTingBtn();
            MjClient.playui.CardLayoutRestore(getNode(0), 0);
        }
    });

    UIEventBind(null, _node, "MJPut", function (eD) {
        that.DealMessage_MJPut(_node,eD,off);
        hideTingBtn();
        if(_tingCardNumNode) _tingCardNumNode.visible = false;
        setUserOffline(_node, off);
        showAndHideHeadEffect();
    });

    UIEventBind(null, _node, "MJChi", function (eD) {
        that.DealMessage_MJChi(_node, eD, off);
        setUserOffline(_node, off);
    });

    UIEventBind(null, _node, "MJGang", function (eD) {
        that.DealMessage_MJGang(_node, eD, off);
        hideTingBtn();
        if(_skipPengIconTag) _skipPengIconTag.visible = false;
        setUserOffline(_node, off);
    });

    UIEventBind(null, _node, "MJPeng", function (eD) {
        that.DealMessage_MJPeng(_node, eD, off);
        setUserOffline(_node, off);
        showAndHideHeadEffect();
    });

    UIEventBind(null, _node, "MJHu", function (eD) {
        that.DealMessage_MJHu(_node, eD, off);
        _tingCard.visible = false;
        if(_skipHuIconTag) _skipHuIconTag.visible = false;
        if(_tingCardsNode) _tingCardsNode.visible = false;
        if(_tingCardNumNode) _tingCardNumNode.visible = false;
        setUserOffline(_node, off);
    });

    UIEventBind(null, _node, "onlinePlayer", function (eD) {
        setUserOffline(_node, off);
        MjClient.playui.GetReadyVisible(_ready, off);
    });

    UIEventBind(null, _node, "playerStatusChange", function (eD) {
        setUserOffline(_node, off);
    });

    UIEventBind(null, _node, "MJFlower", function (eD) {
        that.DealMessage_MJFlower(_node, eD, off);
    });

    UIEventBind(null, _node, "MJTing", function (eD) {
        that.DealMessage_MJTing(_node, eD, off);
        var pl = getUIPlayer(off);
        if(pl && eD.uid == getUIPlayer(off).info.uid)
        {
            pl.putCardAfterTing = eD.putCardAfterTing;
            MjClient.playui.setTingCardInfo(_tingCard,eD,off);
        }
    });


    UIEventBind(null, _node, "waitPut", function (eD) {
        showUserZhuangLogo(_zhuang, off);
        if(off != 0) that.DealMessage_WaitPut(this, eD, off); //其他家发牌
        showAndHideHeadEffect();
    });


    UIEventBind(null, _head, "loadWxHead", function (d) {
        setWxHead(_head, d, off);
    });

    UIEventBind(null, _tingIcon, "moveHead", function (d) {
        MjClient.playui.tingIconVisible(_tingIcon, off);
        MjClient.playui.GetReadyVisible(_ready, -1);
    });

    if (off == 0) {
        // 吃，碰，杠，出牌的时候，刷新听牌提示的牌的个数  by jiangcw
        var refreshTingNum = function(off, eD){
            var pl = getUIPlayer(off);
            if (pl && pl.isTing) {
                var _tingCards = _node.getChildByName("tingCardsNode");
                var tingSet = calTingSet(pl.mjhand);
                cc.log("PlayerGamePanel ---------- refreshTingNum ---------- tingSet = " + JSON.stringify(tingSet));
                if(_tingCards) this.setTingCards(_tingCards, tingSet);
            }
        };
        // 刷新听牌张数
        UIEventBind(null, _node, "MJPut", function (eD) {
            refreshTingNum(off, eD);
        });

        UIEventBind(null, _node, "MJChi", function (eD) {
            refreshTingNum(off, eD);
        });

        UIEventBind(null, _node, "MJGang", function (eD) {
            refreshTingNum(off, eD);
        });

        UIEventBind(null, _node, "MJPeng", function (eD) {
            refreshTingNum(off, eD);
        });
    }


    /********************************************设置位置*********************************************/
    switch (off)
    {
        case 0:
            setWgtLayout(_play_tips,[0.08, 0.14], [0.5, 0.25], [0, 0.5]);
            setWgtLayout(_ready,[0.07, 0.07], [0.5, 0.5], [0, -1.5]);
            setWgtLayout(_stand,[0.057, 0], [0.5, 0], [8, 0.68]);
            setWgtLayout(_up,[0.05, 0], [0, 0], [0.8, 0.7]);
            setWgtLayout(_down,[0.05, 0], [0, 0], [3.5, 1]);
            setWgtLayout(_out0, [0.0, 0.08], [0.55, -0.08], [-7, 6.1]);
            setWgtLayout(_out1, [0.0, 0.08], [0.55, -0.06], [-7, 4.9]);
            if(_out2) setWgtLayout(_out2, [0.0, 0.08], [0.55, -0.04], [-7, 3.7]);
            if(_outBig) setWgtLayout(_outBig, [0.0836, 0], [0.5, 0.32], [0, 0]);
            if (MjClient.MaxPlayerNum == 2)
            {
                _out0.x -= _out0.height * _out0.scale * 4;
                _out1.x -= _out1.height * _out1.scale *  4;
                if(_out2) _out2.x -= _out2.height * _out2.scale *  4;
            }

            if(_tingCardsNode) setWgtLayout(_tingCardsNode, [0.25, 0.12], [0.2, 0.25], [-0.2, -0.8]);
            if(_tingCardNumNode) setWgtLayout(_tingCardNumNode, [0.25, 0.12], [0.12, 0.25], [0,-0.2]);
            break;
        case 1:
            setWgtLayout(_play_tips,[0.08, 0.14], [0.75, 0.5], [0, 0.5]);
            setWgtLayout(_ready,[0.07, 0.07], [0.5, 0.5], [2, 0]);
            setWgtLayout(_stand,[0, 0.08],[1, 1], [-5.5, -2.3]);
            setWgtLayout(_up,[0, 0.05], [1, 0],[-3.0, 6]);
            setWgtLayout(_down,[0, 0.05],[1, 0], [-3, 6.3]);
            // setWgtLayout(_out0, [0, 0.043], [0.97, 0.55], [-7.2, -5.1]);
            // setWgtLayout(_out1, [0, 0.043], [0.97, 0.55], [-5.9, -5.1]);
            // if(_out2) setWgtLayout(_out2, [0, 0.043], [0.97, 0.55], [-4.6, -5.1]);
            setWgtLayout(_out0, [0, 0.055], [0.94, 0.5], [-5.2, -4.0]);
            setWgtLayout(_out1, [0, 0.055], [0.94, 0.5], [-4.0, -4.0]);
            if(_out2) setWgtLayout(_out2, [0, 0.055], [0.94, 0.5], [-2.8, -4.0]);
            if(_outBig) setWgtLayout(_outBig, [0.0836, 0], [0.75, 0.58], [0, 0]);
            break;
        case 2:
            setWgtLayout(_play_tips,[0.08, 0.14], [0.5, 0.75], [0, 0]);
            setWgtLayout(_ready,[0.07, 0.07], [0.5, 0.5], [0, 1.5]);
            setWgtLayout(_stand,[0, 0.07],[0.5, 1], [-6, -1.4]);
            setWgtLayout(_up,[0, 0.07], [0.5, 1], [6, -1.4]);
            setWgtLayout(_down,[0, 0.07], [0.5 - 0.05, 1], [6, -0.7]);

            setWgtLayout(_out0, [0, 0.08], [0.55, 1], [4.1, -4.1]);
            setWgtLayout(_out1, [0, 0.08], [0.55, 1], [4.1, -3.2]);
            if(_out2) setWgtLayout(_out2, [0, 0.08], [0.55, 1], [4.1, -2.3]);
            if(_outBig) setWgtLayout(_outBig, [0.0836, 0], [0.5, 0.75], [0, 0]);
            if (MjClient.MaxPlayerNum == 2)
            {
                _out0.x += _out0.height * _out0.scale *  4;
                _out1.x += _out1.height * _out1.scale *  4;
                if(_out2) _out2.x += _out2.height * _out2.scale *  4;
            }
            break;
        case 3:
            setWgtLayout(_play_tips,[0.08, 0.14], [0.25, 0.5], [0, 0.5]);
            setWgtLayout(_ready,[0.07, 0.07], [0.5, 0.5], [-2, 0]);
            setWgtLayout(_stand,[0, 0.08], [0, 0.6], [5.2, 3]);
            setWgtLayout(_up,[0, 0.05], [0, 1], [3.0, -3.5]);
            setWgtLayout(_down,[0, 0.05], [0, 1], [3, -3]);
            // setWgtLayout(_out0, [0, 0.043], [0.05, 0.5], [7.2, 4.8]);
            // setWgtLayout(_out1, [0, 0.043], [0.05, 0.5], [5.8, 4.8]);
            // if(_out2) setWgtLayout(_out2, [0, 0.043], [0.05, 0.5], [4.5, 4.8]);
            setWgtLayout(_out0, [0, 0.055], [0.065, 0.5], [5.2, 4.2]);
            setWgtLayout(_out1, [0, 0.055], [0.065, 0.5], [3.9, 4.2]);
            if(_out2) setWgtLayout(_out2, [0, 0.055], [0.068, 0.5], [2.6, 4.2]);
            if(_outBig) setWgtLayout(_outBig, [0.0836, 0], [0.25, 0.58], [0, 0]);
            if (MjClient.MaxPlayerNum == 3)
            {
                _out0.y += _out0.height * _out0.scale * 2;
                _out1.y += _out1.height * _out1.scale * 2;
                if(_out2) _out2.y += _out2.height * _out2.scale * 2;
            }
            break;
        default:
            break;
    }
}

/**
 * //显示玩家个人信息
 * @param off
 * @param node
 */
PlayLayer.prototype.showPlayerInfo = function(off, node)
{
    var pl = getUIPlayer(off);
    if(pl)
    {
        if (pl.info.uid == SelfUid())
        {
            MjClient.showPlayerInfo(pl.info, false, true);
        }
        else
        {
            MjClient.showPlayerInfoPlaying(pl.info);
        }
    }
}

/**
 * 初始化花，如果存在
 */
PlayLayer.prototype.initFlower = function(){
    for(var i = 0; i < 4; i++)
    {
        var _node = getNode(i);
        if(_node)
        {
            var parent0 = _node.getChildByName("head").getChildByName("flower_layout");
            if(parent0) parent0.setVisible(false);

            var parent1 = _node.getChildByName("head").getChildByName("flower_zfb_layout");
            if(parent1) parent1.setVisible(false);

        }
    }
}

//晋中初始化玩家金币和名字
PlayLayer.prototype.InitUserCoinAndName = function(node, off)
{
    var pl = getUIPlayer(off);
    if(!pl)
    {
        return;
    }

    var tData = MjClient.data.sData.tData;
    var bind =
        {
            head:
                {
                    name:
                        {
                            _run:function(){
                                this.ignoreContentAdaptWithSize(true);
                                this.setFontName("Arial");
                                this.setFontSize(this.getFontSize());
                            },
                            _text: function() {
                                    var _nameStr = unescape(pl.info.nickname);
                                    return getPlayerName(_nameStr);
                            }
                        },
                    coin:
                        {

                            _text:function ()
                            {
                                var coin=tData.initCoin;
                                var countCopy = Number(coin+ pl.winall);
                                // 精度修正
                                countCopy = revise(countCopy);
                                var tmpcount;
                                if (countCopy<0)
                                {
                                    countCopy = -countCopy;
                                    tmpcount = "-"+countCopy;
                                }
                                else {
                                    tmpcount = countCopy;
                                }

                                cc.log("=================================tmpcount = " + tmpcount);
                                //node.setString(count);
                                return tmpcount;
                            }
                        },
                    name_bg:
                        {
                            _run: function ()
                            {
                                this.setScaleY(1.1);
                            }
                        }
                }
        }

    //add by sking
    var name = node.getChildByName("head").getChildByName("name");
    name.ignoreContentAdaptWithSize(true);
    var coin=node.getChildByName("head").getChildByName("coin");

    //coin.ignoreContentAdaptWithSize(false);
    coin.setContentSize(100,21);
    BindUiAndLogic(node, bind);
}

PlayLayer.prototype.isShowHandCardState = function(off){

    var sData = MjClient.data.sData;
    var tData = sData.tData;
    if(
        tData.tState != TableState.waitPut &&
        tData.tState != TableState.waitEat &&
        tData.tState != TableState.waitCard
    )
    {
        return  false;
    }

    return  true;
}


/**
 * 初始化手牌，吃，碰，杠等麻将
 * @param node
 * @param off
 * @constructor
 */
PlayLayer.prototype.InitUserHandUI = function(node, off)
{
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var pl = getUIPlayer(off);
    if(!pl)
    {
        return;
    }

    //初始化玩家金币和名称
    MjClient.playui.InitUserCoinAndName(node, off);
    setAreaTypeInfo(true);
    if(!this.isShowHandCardState(off)) return;
    setHunNodeVisible(false);

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
                cdui = MjClient.playui.getNewCard(node, "up", "peng", pl.mjpeng[i], off, "heng", "heng");
                setCardArrow(cdui, offIdx, off);
            }
            else
            {
                cdui = MjClient.playui.getNewCard(node, "up", "peng", pl.mjpeng[i], off);
            }

            if(j == 2)
            {
                cdui.ispeng3 = true;
            }
        }
    }

    //添加明杠
    var bIsPengGang = false;
    for(var i = 0; i < pl.mjgang0.length; i++)
    {
        var idx = tData.uids.indexOf(pl.info.uid);

        var offIdx = null;
        for (var j=0; j<pl.pengchigang.gang.length; j++)
        {
            if (pl.pengchigang.gang[j].card == pl.mjgang0[i])
            {
                offIdx = getOffByIndex(pl.pengchigang.gang[j].pos, idx) - 1;
                break;
            }
        }

        if (offIdx == null)
        {
            for (var j=0; j<pl.pengchigang.pgang.length; j++)
            {
                if (pl.pengchigang.pgang[j].card == pl.mjgang0[i])
                {
                    offIdx = getOffByIndex(pl.pengchigang.pgang[j].pos, idx) - 1;
                    bIsPengGang = true;
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
                    var cdui = MjClient.playui.getNewCard(node, "up", "gang0", pl.mjgang0[i], off, "heng", "heng");
                    if(bIsPengGang) offIdx = 3;
                    setCardArrow(cdui, offIdx, off);
                    if (j==1)
                    {
                        setCardArrowOnGang4 = true;
                    }
                }
                else
                {
                    MjClient.playui.getNewCard(node, "up", "gang0", pl.mjgang0[i], off);
                }
            }
            else
            {
                var cdui = MjClient.playui.getNewCard(node, "up", "gang0", pl.mjgang0[i], off, "isgang4");//最后一张牌放上面
                cdui.tag = pl.mjgang0[i];
                if (setCardArrowOnGang4)
                {
                    if(bIsPengGang) offIdx = 3;
                    setCardArrow(cdui, offIdx, off);
                }
            }
        }
    }


    //添加暗杠
    cc.log("------------添加暗杠-----------" + pl.mjgang1);
    for(var i = 0; i < pl.mjgang1.length; i++)
    {
        for(var j = 0; j < 4; j++)
        {
            if(j == 3)
            {
                MjClient.playui.getNewCard(node, "down", "gang1", 0, off, "isgang4").tag = pl.mjgang1[i];
            }
            else
            {
                MjClient.playui.getNewCard(node, "up", "gang1", pl.mjgang1[i], off);
            }
        }
    }

    //cc.log("pl.mjchi = " + pl.mjchi);
    var chiIdx = 0;
    for(var i = 0; i < pl.mjchi.length; i++)
    {
        if(i % 3==0)
        {
            chiIdx++;
        }

        if(pl.mjchiCard[chiIdx-1] == pl.mjchi[i])//吃的横牌表示吃的是哪张牌
        {
            var cdui = MjClient.playui.getNewCard(node, "up", "chi", pl.mjchi[i], off, "heng");
            setCardArrow(cdui, 2, off);
        }
        else
        {
            MjClient.playui.getNewCard(node, "up", "chi", pl.mjchi[i], off);
        }
    }

    //添加打出的牌
    for(var i = 0; i < pl.mjput.length; i++)
    {
        var msg =
            {
                card: pl.mjput[i],
                uid: pl.info.uid
            };

        this.DealMessage_MJPut(node, msg, off, i);
    }

    //添加手牌
    if(MjClient.rePlayVideo == -1)//表示正常游戏
    {
        if(pl.mjhand && off === 0)
        {
            for(var i = 0; i < pl.mjhand.length; i++)
            {
                MjClient.playui.getNewCard(node, "stand", "mjhand", pl.mjhand[i], off);
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
                MjClient.playui.getNewCard(node, "stand", "standPri");
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
                    MjClient.playui.getNewCard(node, "stand", "mjhand", pl.mjhand[i], off);
                }
            }
            else
            {

                for (var i = 0; i < pl.mjhand.length && i < 13; i++) {
                    MjClient.playui.getNewCard(node, "up", "mjhand_replay", pl.mjhand[i], off);
                }
            }
        }

    }


    //添加手花
    if (pl.mjflower.length > 0)
    {
        MjClient.majiang.setFlowerImg(node, pl);
        ShowEatActionAnim(node,ActionType.FLOWER,off);
        playEffectInPlay("flower");
    }

    MjClient.playui.CardLayoutRestore(node, off);
}



// off 是四个位置，根据off 显示四个位置的信息 by sking
PlayLayer.prototype.SetUserVisible = function(node, off)
{
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
        head.visible = true;
        name.visible = true;
        coin.visible = true;
        offline.visible = true;
        coin.visible = true;
        name_bg.visible = true;
        score_bg.visible = true;
        name.setScale(1.5);
        coin.setScale(1.2);
        MjClient.loadWxHead(pl.info.uid, pl.info.headimgurl);
        setUserOffline(node, off);
        this.InitUserHandUI(node, off);
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


/**
 * 向服务器发送 MJPass的消息
 * @constructor
 */
PlayLayer.prototype.MJPass2Net = function()
{
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var isShowSkipAnGang = MjClient.playui.isCanShowSkipAnGang();
    if(IsTurnToMe() && tData.tState === TableState.waitPut)
    {
        var eat = MjClient.playui.jsBind.eat;
        var msg = "确认过";
        if(eat.gang0._node.visible && isShowSkipAnGang)
        {
            msg += " 杠 ";
        }

        if(eat.hu._node.visible)
        {
            msg += " 胡 ";
        }

        //cc.log("-- = getUIPlayer(0).isTing = " + getUIPlayer(0).isTing)
        if(eat.ting._node.visible)
        {
            msg = "你确认要放弃听牌";
            if(eat.gang0._node.visible && isShowSkipAnGang)
            {
                msg = "确认过";
                msg += " 听 ";
                msg += " 杠 ";
            }
        }

        msg = msg + "吗?";

        if(!isShowSkipAnGang && msg.toString() === "确认过吗?"){
            eat.gang0._node.visible = false;
            eat.hu._node.visible = false;
            eat.guo._node.visible = false;
            eat.ting._node.visible = false;
            eat.cancel._node.visible = false;
            MJPassConfirmToServer();
            return;
        }


        MjClient.showMsg(msg, function()
        {
            //cc.log("==========1=============");
            eat.gang0._node.visible = false;
            eat.hu._node.visible = false;
            eat.guo._node.visible = false;
            eat.ting._node.visible = false;
            eat.cancel._node.visible = false;
            MjClient.playui.recordSkipAnGangArr();
            MjClient.playui.sendMessage_MJPass();
        }, function() {}, "1");
    }
    else
    {
        if(MjClient.playui.jsBind.eat.hu._node.visible)
        {
            MjClient.showMsg("确认不胡吗?", MjClient.playui.sendMessage_MJPass, function() {}, "1");
        }
        else
        {
            MjClient.playui.sendMessage_MJPass();
        }
    }
}


/**
 * 主要初始化cocosbuilder 导出的UI以及对应的绑定事件
 * 托管，gps,语音,聊天等按钮，eat节点(吃，碰，杠按钮事)
 * @param backNode 根节点
 */
PlayLayer.prototype.initCocosNodeUI = function(backNode)
{
    var tData = MjClient.data.sData.tData;
    var sData = MjClient.data.sData;
    /**
     *******************************ui******************************************
     */
    //托管
    var _tuoguanNode = backNode.getChildByName("block_tuoguan");
    _tuoguanNode.visible = false;
    setWgtLayout(_tuoguanNode, [1, 1], [0.5, 0.5], [0, 0],true);
    _tuoguanNode.addTouchEventListener(function(btn, type) {
        if (type == 2) {
            MjClient.gamenet.request("pkroom.handler.tableMsg", {cmd: "cancelTrust"},function (rtn) {
                btn.getParent().setVisible(false);
            });
        }
    }, _tuoguanNode);

    //花按钮
    var _huaBtnNode = backNode.getChildByName("hua_btn");
    if(_huaBtnNode)
    {
        setWgtLayout(_huaBtnNode, [0.08, 0.08], [0.95, 0.4], [0, 3.2]);
        _huaBtnNode.visible = false;
        _huaBtnNode.opacity = 255;
        if(tData.areaSelectMode.flowerType == WithFlowerType.noFlower)
        {
            if (IsArrowVisible()) _huaBtnNode.visible = true;
        }
        else
        {
            _huaBtnNode.visible = false;
        }
        _huaBtnNode.addTouchEventListener(function(btn, type) {
            if (type == 2) {
                var layer = new showFlowerLayer();//显示花
                MjClient.Scene.addChild(layer);
            }
        }, _huaBtnNode);
    }

    //gps 按钮
    var _gpsBtnNode = backNode.getChildByName("gps_btn");
    setWgtLayout(_gpsBtnNode, [0.08, 0.08], [0.95, 0.3], [0, 3.2]);
    if(MjClient.data.sData.tData.maxPlayer == 2) _gpsBtnNode.visible = false;

    _gpsBtnNode.addTouchEventListener(function(btn, type) {
        if (type == 2) {
            if(MjClient.data.sData.tData.maxPlayer == 3){
                MjClient.Scene.addChild(new showDistance3PlayerLayer());
            }else if(MjClient.data.sData.tData.maxPlayer == 4){
                MjClient.Scene.addChild(new showDistanceLayer());
            }
            MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Dingwei", {uid: SelfUid(),gameType:MjClient.gameType});
        }
    }, _gpsBtnNode);

    //语音按钮
    var _voidBtnNode = backNode.getChildByName("voice_btn");
    setWgtLayout(_voidBtnNode, [0.08, 0.08], [0.95, 0.2], [0, 3.2]);
    initVoiceData();
    cc.eventManager.addListener(getTouchListener(), _voidBtnNode);
    if(MjClient.isShenhe) _voidBtnNode.visible = false;
    _voidBtnNode.addTouchEventListener(function(btn, type) {
        if (type == 0) {
            startRecord();
        } else if (type == 2) {
            endRecord();
        } else if (type == 3) {
            cancelRecord();
        }
    }, _voidBtnNode);

    //聊天按钮
    var _chatBtnNode = backNode.getChildByName("chat_btn");
    setWgtLayout(_chatBtnNode, [0.08, 0.08], [0.95, 0.1], [0, 3.2]);
    _chatBtnNode.addTouchEventListener(function(btn, type) {
        if (type == 2) {
            var chatlayer = new ChatLayer();
            MjClient.Scene.addChild(chatlayer);
        }
    }, _chatBtnNode);

    //banner 信息
    /*****banner began******/
    var _bannerNode = backNode.getChildByName("banner");
    setWgtLayout(_bannerNode, [0.5, 0.5], [0.5, 1], [0, 0]);

    //时间
    var _bgTime =  _bannerNode.getChildByName("bg_time");
    var text = new ccui.Text();
    text.setFontName(MjClient.fzcyfont);
    text.setFontSize(26);
    text.setAnchorPoint(1,0.5);
    text.setPosition(66, 15);
    _bgTime.addChild(text);
    text.schedule(function(){
        var time = MjClient.getCurrentTime();
        var str = (time[3]<10?"0"+time[3]:time[3])+":"+
            (time[4]<10?"0"+time[4]:time[4]);
        this.setString(str);
    });

    //wifi
    var _wifi =  _bannerNode.getChildByName("wifi");
    updateWifiState(_wifi);

    //电量
    var _powerBar =  _bannerNode.getChildByName("powerBar");
    updateBattery(_powerBar);

    //table id
    var _tableId =  _bannerNode.getChildByName("tableid");
    _tableId.ignoreContentAdaptWithSize(true);

    //setting
    var _setting =  _bannerNode.getChildByName("setting");
    _setting.addTouchEventListener(function(btn, type) {
        if (type == 2) {
            var settringLayer = new SettingView();
            settringLayer.setName("PlayLayerClick");
            MjClient.Scene.addChild(settringLayer);
            MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Shezhi", {uid:SelfUid(),gameType:MjClient.gameType});
        }
    }, _setting);

    //help 帮助 ？
    var _help =  _bannerNode.getChildByName("Button_1");
    _help.addTouchEventListener(function(btn, type) {
        if (type == 2) {
            MjClient.openWeb({url:MjClient.GAME_TYPE.HUAI_AN,help:true});
        }
    }, _help);
    //癞子牌
    var _hunPai =  _bannerNode.getChildByName("hunPai");
    _hunPai.setVisible(false);
    var _baidaBg = _hunPai.getChildByName("baidaBg");
    _baidaBg.setVisible(false);
    var _baidaText = _hunPai.getChildByName("baidaText");
    _baidaText.setVisible(false);
    /*****banner end******/

    //roundInfo
    var _roundInfo = backNode.getChildByName("roundInfo");
    setWgtLayout(_roundInfo, [0.09, 0.09], [0.5, 0.408], [0, 1.0]);
    _roundInfo.ignoreContentAdaptWithSize(true);
    _roundInfo.setString(getPlayingRoomInfo(0));
    showPlayUI_roundInfo(_roundInfo.getString(),tData.tableid);
    if(tData.matchId && tData.matchInfo){
        if(MjClient.matchRank){
            showPlayUI_matchInfo("排名："+MjClient.matchRank+"/"+tData.matchInfo.userCount+"\n前"+tData.matchInfo.jingjiCount+"名晋级");
        }else {
            showPlayUI_matchInfo("排名："+tData.matchInfo.userCount+"/"+tData.matchInfo.userCount+"\n前"+tData.matchInfo.jingjiCount+"名晋级");
        }
    }

    //gameName
    var _gameName = backNode.getChildByName("gameName");
    setWgtLayout(_gameName, [0.16, 0.16], [0.5, 0.62], [0, 1.0]);

    //info
    var _info = backNode.getChildByName("info");
    setWgtLayout(_info, [0.16, 0.16], [0.01, 0.935], [0, 0]);

    //back
    var _back = backNode.getChildByName("back");
    var _backBack = _back.getChildByName("back");
    setWgtLayout(_backBack, [1, 1], [0.5, 0.5], [0, 0],true);
    changeGameBg(_backBack);

    var _LeftBottom  = _back.getChildByName("LeftBottom");
    var _RightBottom = _back.getChildByName("RightBottom");
    var _RightTop    = _back.getChildByName("RightTop");
    var _leftTopm    = _back.getChildByName("LleftTop");
    setWgtLayout(_LeftBottom, [0.1, 0.1], [0.03, 0.045], [0, 0]);
    setWgtLayout(_RightBottom, [0.1, 0.1], [0.97,0.05], [0, 0]);
    setWgtLayout(_RightTop, [0.1, 0.1], [0.97,0.95], [0, 0]);
    setWgtLayout(_leftTopm, [0.1, 0.1], [0.03,0.95], [0, 0]);

    //roundnumImg
    var _roundnumImg  = backNode.getChildByName("roundnumImg");
    MjClient.roundnumImgNode = _roundnumImg;
    setWgtLayout(_roundnumImg,[0.1, 0.1], [0.5, 0.5], [-1.2, 1.0]);
    var _roundnumAtlas = _roundnumImg.getChildByName("roundnumAtlas");
    _roundnumAtlas.getParent().getChildByName("roundnumText").visible = false;
    _roundnumAtlas.getParent().getChildByName("Text").visible = false;
    _roundnumAtlas.ignoreContentAdaptWithSize(true);
    if(tData)
    {
        var _currentRoundIdx =  parseInt(tData.roundAll - tData.roundNum) + 1;
        if(_currentRoundIdx > tData.roundAll) _currentRoundIdx = 1;
        var _roundText = _currentRoundIdx + "/" + tData.roundAll + "局";
        _roundnumAtlas.setString(_roundText)
    }

    //roundnumImg
    var _cardNumImg  = backNode.getChildByName("cardNumImg");
    MjClient.cardNumImgNode = _cardNumImg;
    setWgtLayout(_cardNumImg,[0.1, 0.1], [0.5, 0.5], [1.2, 1.0]);
    var _cardnumAtlas = _cardNumImg.getChildByName("cardnumAtlas");
    _cardnumAtlas.ignoreContentAdaptWithSize(true);
    if (tData) _cardnumAtlas.setString(MjClient.majiang.getAllCardsTotal() - tData.cardNext);

    /*******************began of eat ********************************/
    //eat
    var _eat  = backNode.getChildByName("eat");

    //chi0
    var _chi0 = _eat.getChildByName("chi0");
    _chi0.visible = false;
    setWgtLayout(_chi0,[0, 0.1], [0.5, 0], [1.3, 2.5]);
    var _bg_img = _chi0.getChildByName("bg_img");
    var _bgimg = _chi0.getChildByName("bgimg");
    if(_bgimg)_bgimg.zIndex = -1;
    var _bgground = _chi0.getChildByName("bgground");
    if(_bgground)_bgground.zIndex = -1;
    if(_bg_img)
    {
        var _Image_light_scale = _bg_img.getScale();
        var a = cc.scaleTo(0.5,_Image_light_scale*1.0);
        var aa = cc.fadeIn(0.5);
        var a1 = cc.scaleTo(1,_Image_light_scale*1.3);
        var a2 = cc.fadeOut(1);
        var a3 = cc.callFunc(function(){
            _bg_img.setScale(_Image_light_scale*0.95);
        }.bind(_bg_img));
        _bg_img.runAction(cc.sequence(cc.spawn(a,aa), cc.spawn(a1,a2).easing(cc.easeCubicActionOut()),a3,cc.delayTime(0.2)).repeatForever());
    }

    _chi0.addTouchEventListener(function(btn, type) {
        if (type == 2) MjClient.playui.MJChiCardchange(btn.tag);
    }, _chi0);
    //chi1
    var _chi1 = _eat.getChildByName("chi1");
    _chi1.visible = false;
    setWgtLayout(_chi1,[0, 0.1], [0.5, 0], [1.3, 3.8]);
    _chi1.addTouchEventListener(function(btn, type) {
        if (type == 2) MjClient.playui.MJChiCardchange(btn.tag);
    }, _chi1);
    //chi2
    var _chi2 = _eat.getChildByName("chi2");
    _chi2.visible = false;
    setWgtLayout(_chi2,[0, 0.1], [0.5, 0], [1.3, 5.1]);
    _chi2.addTouchEventListener(function(btn, type) {
        if (type == 2) MjClient.playui.MJChiCardchange(btn.tag);
    }, _chi2);

    //ting
    var _ting = _eat.getChildByName("ting");
    _ting.visible = false;
    setWgtLayout(_ting,[0, 0.1], [0.5, 0], [1.3, 2.5]);
    var _bg_img = _eat.getChildByName("bg_img");
    if(_bg_img)
    {
        var _Image_light_scale = _bg_img.getScale();
        var a = cc.scaleTo(0.5,_Image_light_scale*1.0);
        var aa = cc.fadeIn(0.5);
        var a1 = cc.scaleTo(1,_Image_light_scale*1.3);
        var a2 = cc.fadeOut(1);
        var a3 = cc.callFunc(function(){
            _bg_img.setScale(_Image_light_scale*0.95);
        }.bind(_bg_img));
        _bg_img.runAction(cc.sequence(cc.spawn(a,aa), cc.spawn(a1,a2).easing(cc.easeCubicActionOut()),a3,cc.delayTime(0.2)).repeatForever());
    }
    _ting.addTouchEventListener(function(btn, type) {
        if (type == 2)
        {
            cc.log("=");
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
            var tingCards = MjClient.playui.getCheckTingHuCards(currentCard,pl.mjhand);
            MjClient.playui.setCurrentTingNum(tingCards);
        }
    }, _ting);

    var _noTing = _eat.getChildByName("noTing");
    _noTing.visible = false;
    setWgtLayout(_noTing,[0, 0.1], [0.5, 0], [4.6, 2.5]);
    _noTing.addTouchEventListener(function(btn, type) {
        if (type == 2)
        {
            hideTingBtn();
            hideCurrentTingNum();
            COMMON_UI.clearShowCurrentEatCards();
        }
    }, _noTing);

    //peng
    var _peng = _eat.getChildByName("peng");
    var _bgimg = _peng.getChildByName("bgimg");
    if(_bgimg)_bgimg.zIndex = - 1;
    _peng.visible = false;
    setWgtLayout(_noTing,[0, 0.1], [0.5, 0], [0, 2.5]);
    var _bg_img = _peng.getChildByName("bg_img");
    if(_bg_img)
    {
        var _Image_light_scale = _bg_img.getScale();
        var a = cc.scaleTo(0.5,_Image_light_scale*1.0);
        var aa = cc.fadeIn(0.5);
        var a1 = cc.scaleTo(1,_Image_light_scale*1.3);
        var a2 = cc.fadeOut(1);
        var a3 = cc.callFunc(function(){
            _bg_img.setScale(_Image_light_scale*0.95);
        }.bind(_bg_img));
        _bg_img.runAction(cc.sequence(cc.spawn(a,aa), cc.spawn(a1,a2).easing(cc.easeCubicActionOut()),a3,cc.delayTime(0.2)).repeatForever());
    }

    _peng.addTouchEventListener(function(btn, type) {
        if (type == 2)
        {
            MjClient.playui.sendMessage_MJPeng();
        }
    }, _peng);

    //gang0
    var _gang0 = _eat.getChildByName("gang0");
    _gang0.visible = false;
    setWgtLayout(_gang0,[0, 0.1], [0.5, 0], [-1.7, 2.5]);
    var _bg_img = _gang0.getChildByName("bg_img");
    var _bgimg = _gang0.getChildByName("bgimg");
    if(_bgimg)_bgimg.zIndex = -1;
    var _bgground = _gang0.getChildByName("bgground");
    if(_bgground)_bgground.zIndex = -1;
    if(_bg_img)
    {
        var _Image_light_scale = _bg_img.getScale();
        var a = cc.scaleTo(0.5,_Image_light_scale*1.0);
        var aa = cc.fadeIn(0.5);
        var a1 = cc.scaleTo(1,_Image_light_scale*1.3);
        var a2 = cc.fadeOut(1);
        var a3 = cc.callFunc(function(){
            _bg_img.setScale(_Image_light_scale*0.95);
        }.bind(_bg_img));
        _bg_img.runAction(cc.sequence(cc.spawn(a,aa), cc.spawn(a1,a2).easing(cc.easeCubicActionOut()),a3,cc.delayTime(0.2)).repeatForever());
    }

    _gang0.addTouchEventListener(function(btn, type) {
        if (type == 2)
        {
            MjClient.playui.MJGangCardchange(btn.tag);
        }
    }, _gang0);

    //gang1
    var _gang1 = _eat.getChildByName("gang1");
    _gang1.visible = false;
    setWgtLayout(_gang1,[0, 0.1], [0.5, 0], [-1.7, 3.8]);
    _gang1.addTouchEventListener(function(btn, type) {
        if (type == 2)
        {
            MjClient.playui.MJGangCardchange(btn.tag);
        }
    }, _gang1);

    //gang2
    var _gang2 = _eat.getChildByName("gang2");
    _gang2.visible = false;
    setWgtLayout(_gang2,[0, 0.1], [0.5, 0], [-1.7, 5.1]);
    _gang2.addTouchEventListener(function(btn, type) {
        if (type == 2)
        {
            MjClient.playui.MJGangCardchange(btn.tag);
        }
    }, _gang2);

    //guo
    var _guo = _eat.getChildByName("guo");
    _guo.visible = false;
    var _bgimg = _guo.getChildByName("bgimg");
    if(_bgimg)_bgimg.zIndex = -1;
    setWgtLayout(_guo,[0, 0.1], [0.5, 0], [-1.7, 5.1]);
    _guo.addTouchEventListener(function(btn, type) {
        if (type == 2)
        {
            MjClient.playui.MJPass2Net();
        }
    }, _guo);

    //hu
    var _hu = _eat.getChildByName("hu");
    _hu.visible = false;
    var _bgimg = _hu.getChildByName("bgimg");
    if(_bgimg)_bgimg.zIndex = -1;
    setWgtLayout(_hu,[0, 0.1], [0.5, 0], [-3, 2.5]);

    var _bg_img = _hu.getChildByName("bg_img");
    if(_bg_img)
    {
        var _Image_light_scale = _bg_img.getScale();
        var a = cc.scaleTo(0.5,_Image_light_scale*1.0);
        var aa = cc.fadeIn(0.5);
        var a1 = cc.scaleTo(1,_Image_light_scale*1.3);
        var a2 = cc.fadeOut(1);
        var a3 = cc.callFunc(function(){
            _bg_img.setScale(_Image_light_scale*0.95);
        }.bind(_bg_img));
        _bg_img.runAction(cc.sequence(cc.spawn(a,aa), cc.spawn(a1,a2).easing(cc.easeCubicActionOut()),a3,cc.delayTime(0.2)).repeatForever());
    }

    _hu.addTouchEventListener(function(btn, type) {
        if (type == 2)
        {
            MjClient.playui.sendMessage_MJHu();
        }
    }, _hu);

    //cancel
    var _cancel = _eat.getChildByName("cancel");
    _cancel.visible = false;
    setWgtLayout(_cancel,[0, 0.16], [0.78, 0.1], [0, 1.12]);
    _cancel.addTouchEventListener(function(btn, type) {
        if (type == 2)
        {
            btn.visible = false;
            MjClient.clickTing = false;
            hideCurrentTingNum();
            MjClient.playui.EatVisibleCheck();
            MjClient.playui.CardLayoutRestore(MjClient.playui._downNode, 0);
        }
    }, _cancel);

    //changeui
    var _changeui = _eat.getChildByName("changeui");
    _changeui.visible = true;
    var _changeuibg = _changeui.getChildByName("changeuibg");
    setWgtLayout(_changeuibg,[0.36, 0.36], [0.5, 0.15], [0, 0]);
    _changeuibg.visible = false;
    _changeuibg.getChildByName("card").visible = false;
    _changeuibg.chiTouch = function(btn, et) {
        if (et == 2)
        {
            if (btn.name.localeCompare("card3") < 0)
            {
                MjClient.playui.sendMessage_MJChi(0);
            }
            else if (btn.name.localeCompare("card6") < 0)
            {
                MjClient.playui.sendMessage_MJChi(1);
            }
            else
            {
                MjClient.playui.sendMessage_MJChi(2);
            }
        }
    };
    _changeuibg.gangTouch = function(btn, et) {
        if (et == 2)
            MjClient.playui.sendMessage_MJGang(btn.tag);
    };

    var _guobg = _changeuibg.getChildByName("guobg");
    var _guo = _guobg.getChildByName("guo");
    _guo.addTouchEventListener(function(btn, type) {
        if (type == 2)
        {
            MjClient.playui.MJPass2Net();
        }
    }, _guo);

    var _fanhui = _guobg.getChildByName("fanhui");
    _fanhui.addTouchEventListener(function(btn, type) {
        if (type == 2)
        {
            btn.getParent().getParent().visible = false;
            MjClient.playui.EatVisibleCheck();
        }
    }, _fanhui);

    /*******************end of eat ********************************/

    /**
     * ***********************************事件回调*****************************************
    **/
    var that = this;
    var event_fun = {};
    event_fun.mjhand  = function(){

        var tData = MjClient.data.sData.tData;
        var sData = MjClient.data.sData;

        _roundnumImg.visible = IsArrowVisible();
        _cardNumImg.visible = IsArrowVisible();
        if(tData)
        {
            var _currentRoundIdx =  parseInt(tData.roundAll - tData.roundNum) + 1;
            if(_currentRoundIdx > tData.roundAll) _currentRoundIdx = 1;
            var _roundText = _currentRoundIdx + "/" + tData.roundAll + "局";
            _roundnumAtlas.setString(_roundText)
        }

        resetFlowerNum(backNode);
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

        }
    };

    event_fun.endRoom = function(msg){
        mylog(JSON.stringify(msg));
        if (msg.showEnd) backNode.addChild(new GameOverLayer(),500);
        else
            MjClient.Scene.addChild(new StopRoomView());
    };

    event_fun.roundEnd = function() {
        _baidaBg.setVisible(false);
        _baidaText.setVisible(false);
    };

    event_fun.moveHead = function(){
        postEvent("returnPlayerLayer");
        tableStartHeadMoveAction(backNode);
        that.initFlower();
    };

    event_fun.initSceneData = function(){

        function delayExe()
        {
            MjClient.playui.EatVisibleCheck();
        }
        _eat.runAction(cc.sequence(cc.DelayTime(0.1),cc.callFunc(delayExe)));

        reConectHeadLayout(backNode);
        CheckRoomUiDelete();

        var pl = getUIPlayer(0);
        if(pl.trust){
            _tuoguanNode.visible = true;
        }else {
            _tuoguanNode.visible = false;
        }

        //table id
        _tableId.ignoreContentAdaptWithSize(true);
        _tableId.setString(MjClient.data.sData.tData.tableid);

        _roundnumImg.visible = IsArrowVisible();
        _cardNumImg.visible = IsArrowVisible();
    };

    event_fun.onlinePlayer = function(){
        reConectHeadLayout(backNode);
    };

    event_fun.logout = function(){
        if (MjClient.playui) {
            MjClient.addHomeView();
            MjClient.playui.removeFromParent(true);
            delete MjClient.playui;
            delete MjClient.endoneui;
            delete MjClient.endallui;
        }
    };

    event_fun.changeMJBgEvent = function() {
        changeMJBg(backNode, getCurrentMJBgType());
    };

    event_fun.waitPut = function(){
        if (tData) _cardnumAtlas.setString(MjClient.majiang.getAllCardsTotal() - tData.cardNext);
    };


    UIEventBind(null, backNode, "changeGameBgEvent", function (d) {
        changeGameBg(_backBack);
    });

    UIEventBind(null, backNode, "nativePower", function (d) {
        _powerBar.setPercent(Number(d));
    });

    UIEventBind(null, backNode, "cancelRecord", function (msg) {
        MjClient.native.HelloOC("cancelRecord !!!");
    });

    UIEventBind(null, backNode, "uploadRecord", function (filePath) {
        if (filePath) {
            MjClient.native.HelloOC("upload voice file");
            MjClient.native.UploadFile(filePath, MjClient.remoteCfg.voiceUrl, "sendVoice");
        } else {
            MjClient.native.HelloOC("No voice file update");
        }
    });

    UIEventBind(null, backNode, "sendVoice", function (fullFilePath) {
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
    });

    UIEventBind(null, backNode, "downAndPlayVoice", function (msg) {
        MjClient.native.HelloOC("downloadPlayVoice ok");
        MjClient.data._tempMessage = msg;
        MjClient.native.HelloOC("mas is" + JSON.stringify(msg));
        downAndPlayVoice(msg.uid, msg.msg);
    });

    UIEventBind(null, backNode, "beTrust", function (msg) {
        if(getUIPlayer(0)&&getUIPlayer(0).info.uid == msg.uid){
            if(MjClient.movingCard){
                MjClient.movingCard.setTouchEnabled(false);
                MjClient.movingCard.setScale(cardBeginScale);
                MjClient.movingCard.setTouchEnabled(true);
            }
            _tuoguanNode.visible = true;
        }
    });

    UIEventBind(null, backNode, "waitPut", function (d) {
        event_fun.waitPut();
        that.callBack_waitPut(d)
    });

    UIEventBind(null, backNode, "initSceneData", function (msg) {
        event_fun.initSceneData(msg);
        that.callBack_initSceneData(msg);
    });

    UIEventBind(null, backNode, "roundEnd", function (msg) {
        event_fun.roundEnd();
        that.callBack_roundEnd(msg);
    });

    UIEventBind(null, backNode, "mjhand", function (d) {
        event_fun.mjhand();
        that.callBack_mjhand();
    });

    UIEventBind(null, backNode, "LeaveGame", function (d) {
        that.callBack_LeaveGame();
    });

    UIEventBind(null, backNode, "endRoom", function (d) {
        event_fun.endRoom(d);
        that.callBack_endRoom(d);
    });

    UIEventBind(null, backNode, "moveHead", function (d) {
        event_fun.moveHead();
        that.callBack_moveHead();
    });

    UIEventBind(null, backNode, "onlinePlayer", function (d) {
        event_fun.onlinePlayer(d);
        that.callBack_onlinePlayer(d);
    });

    UIEventBind(null, backNode, "logout", function (d) {
        event_fun.logout();
    });

    UIEventBind(null, backNode, "DelRoom", function (d) {
        that.callBack_DelRoom();
    });

    UIEventBind(null, backNode, "changeMJBgEvent", function (d) {
        event_fun.changeMJBgEvent();
    });

    UIEventBind(null, backNode, "clearCardUI", function (d) {
        that.callBack_clearCardUI()
    });

    UIEventBind(null, backNode, "MJPass", function (d) {
        that.callBack_MJPass();
    });

    UIEventBind(null, backNode, "MJPut", function (d) {
        that.callBack_MJPut(d);
    });

    UIEventBind(null, backNode, "MJPeng", function (d) {
        that.callBack_MJPeng();
    });

    UIEventBind(null, backNode, "MJChi", function (d) {
        that.callBack_MJChi();
    });

    UIEventBind(null, backNode, "MJGang", function (d) {
        that.callBack_MJGang();
    });

    UIEventBind(null, backNode, "MJTing", function (d) {
        that.callBack_MJTing();
    });
}

/**
 * 自己定义的获取的一些节点
 * @param backNode
 */
PlayLayer.prototype.initDefineUI = function(backNode)
{
    this._downNode  = backNode.getChildByName("down");
    this._rightNode = backNode.getChildByName("right");
    this._topNode   = backNode.getChildByName("top");
    this._leftNode  = backNode.getChildByName("left");
    this._btnPutCard = backNode.getChildByName("BtnPutCard");
    this._tingCardsNode = this._downNode.getChildByName("tingCardsNode");
    this._tingCardNumNode = this._downNode.getChildByName("tingCardNumNode");
    MjClient.playui._AniNode =  backNode.getChildByName("eat");
    var _laba_bg =  backNode.getChildByName("banner").getChildByName("laba_bg");
    _laba_bg.visible = false;
    var _scroll =  backNode.getChildByName("banner").getChildByName("scroll");
    _scroll.visible = false;
    var arrowbk3D = getNode(0).getParent().getChildByName("arrowbk3D");
    if(arrowbk3D)arrowbk3D.visible = false;
}


/**
 *设置处理麻将的触摸事件
 * @param standUI
 * @param cardui
 */
PlayLayer.prototype.setTouchCardHandler = function(standUI, cardui)
{
    cardui.addTouchEventListener(this.registerTouchCardHandler, cardui);
}

/**
 * 麻将触摸事件的注册函数
 * @param btn
 * @param tp
 */
PlayLayer.prototype.registerTouchCardHandler = function(btn, tp)
{
    var downNode = MjClient.playui._downNode;
    var standUI = downNode.getChildByName("stand");
    var cardui = btn;

    var tData = MjClient.data.sData.tData;
    var pl = getUIPlayer(0);

    //返回false 表示不能出牌,增强可读性  by sking 2018.12.6
    if(!MjClient.playui.isCanTouch(cardui,btn,tp)) return;

    if(tp == ccui.Widget.TOUCH_BEGAN)
    {
        playEffect("cardClick");
        MjClient.movingCard = btn;
        MjClient.selectedCard = btn;
        cardBeginPos = btn.getPosition();
        cardBeginScale = btn.getScale();
        cardBeginZIndex = btn.zIndex;
        bIsPut = true;
        bStartMoved = false;

        var children = btn.getParent().children;
        for(var i = 0; i < children.length; i++)
        {
            if(children[i].name == "mjhand" && children[i] !== btn)
            {
                children[i].y = standUI.y;
            }
        }

        /*
         设置当前可听的牌数
         */
        if(MjClient.playui.isNeedShowTingCard())
        {
            //显示当前听得牌
            MjClient.playui.showCurrentTingCards(cardui);
        }
    }
    else if(tp == ccui.Widget.TOUCH_MOVED)
    {
        if (MjClient.movingCard == null)
        {
            return;
        }

        var pos = btn.getTouchMovePosition();
        var _standHeight = standUI.getContentSize().height;
        //if(cc.pDistance(cardBeginPos, pos) > _standHeight/2)
        if(MjClient.playui.cardMoveDistance())
        {
            if (pos.x < 0) pos.x = 0;
            if (pos.x > MjClient.size.width) pos.x = MjClient.size.width;
            if (pos.y < 0) pos.y = 0;
            if (pos.y > MjClient.size.height) pos.y = MjClient.size.height;
            btn.setPosition(pos);
            bIsPut = true;
            bStartMoved = true;
            btn.zIndex  = 500;
            btn.scale = cardBeginScale;
        }
        else
        {
            if(btn.zIndex != 500)
            {
                btn.setPosition(cardBeginPos);
                if(btn.y >= (standUI.y + 20) )
                {
                    btn.y = standUI.y + 20;
                }
            }
            else{
                //撤回这张牌
                var _pos = btn.getPosition();
                var dy = Math.round(_pos.y - standUI.y);

                if (pos.x < 0) pos.x = 0;
                if (pos.x > MjClient.size.width) pos.x = MjClient.size.width;
                if (pos.y < 0) pos.y = 0;
                if (pos.y > MjClient.size.height) pos.y = MjClient.size.height;
                btn.setPosition(pos);

                if(dy < _standHeight/2)//移动多少距离撤销
                {
                    if(bIsPut)  bIsPut = false;

                    btn.scale = cardBeginScale*0.85;
                }
            }
        }
    }
    else if(tp === ccui.Widget.TOUCH_ENDED || tp === ccui.Widget.TOUCH_CANCELED)
    {
        bStartMoved = false;
        if (MjClient.movingCard == null)
        {
            return;
        }
        btn.zIndex  = cardBeginZIndex;
        btn.scale = cardBeginScale;

        var pos = btn.getPosition();
        var dy = Math.round(pos.y - standUI.y);
        if(!bIsPut) //撤销这张牌
        {
            MjClient.movingCard = null;
            btn.setPosition(cardBeginPos);
            btn.y = standUI.y + 20;
            return;
        }


        if(dy < 20)
        {
            MjClient.movingCard = null;
            btn.setPosition(cardBeginPos);
            btn.y = standUI.y + 20;
        }
        else
        {
            hideCurrentTingNum();
            var tData = MjClient.data.sData.tData;
            var pl = getUIPlayer(0);
            var eat = MjClient.playui.jsBind.eat;
            if ( pl.eatFlag & 8) //有胡的情况下，要先提示
            {
                var roomMsgValue = tData.tableid +":"+tData.roundNum;
                MjClient.showMsg("确认不胡吗?", function(result) {
                    if(result && result.isSelect){
                        //选择了不在提示,
                        if(eat.gang0._node.visible){
                            util.localStorageEncrypt.setStringItem("IGNORE_G_TIP",roomMsgValue);
                        }
                        if(eat.hu._node.visible){
                            util.localStorageEncrypt.setStringItem("IGNORE_H_TIP",roomMsgValue);
                        }
                    }
                    MjClient.playui.sendMessage_MJPass();
                    PutOutCard(cardui, cardui.tag);
                }, function() {
                    MjClient.playui.CardLayoutRestore(getNode(0), 0);
                }, "1");
            }
            else {
                PutOutCard(cardui, cardui.tag);
            }
        }
    }
}

/**
 * 选出剔除一张手牌后，算出能听的牌
 * @param SelectCardNode 当前选择要剔除的牌
 */
PlayLayer.prototype.showCurrentTingCards = function(SelectCardNode)
{
    var pl = getUIPlayer(0);
    if(!pl.mjhand) return;
    var tingCards = MjClient.playui.getCheckTingHuCards(SelectCardNode.tag, pl.mjhand);
    MjClient.playui.setCurrentTingNum(tingCards);
}


/**
 * 选择一张牌时,剔除这张牌后，能哪些牌
 * @param selectCard  当前选的牌
 * @param mjhandCard  手牌
 * @returns {{}}  返回，听的牌
 */
PlayLayer.prototype.getCheckTingHuCards = function(selectCard,mjhandCard) {
    var copyhand = mjhandCard.slice();
    if (selectCard) {
        var index = copyhand.indexOf(selectCard);//排除当前选择的一张牌
        copyhand.splice(index,1);
    }
    var tingSet = calTingSet(copyhand, MjClient.data.sData.tData.hunCard);

    for (var card in tingSet) {
        var count = 0;
        for (var i = 0; i < mjhandCard.length; i++) {
            if (mjhandCard[i] === Number(card)) {
                count ++;
            }
        }
        if (count === 4) {
            delete tingSet[card];
        }
    }
    return tingSet;
}

/**
 * 在界面显示出当前听的那些牌
 * @param tingSet 听的牌
 */
PlayLayer.prototype.setCurrentTingNum = function(tingSet)
{
    var tData = MjClient.data.sData.tData;

    if ("isOpenTingTip" in tData.areaSelectMode && !tData.areaSelectMode.isOpenTingTip)
        return;

    var carNumNode = MjClient.playui._tingCardNumNode;

    //如果没有可听的牌
    var bHaveValue = false;

    carNumNode.zIndex = 550;
    carNumNode.setAnchorPoint(0,0);
    carNumNode.setContentSize(272, 80);
    //位置被改变了，需要还原位置
    if(MjClient.playui.setTingCardPosX == null)
    {
        MjClient.playui.setTingCardPosX = carNumNode.getPositionX();
    }else{
        carNumNode.setPositionX(MjClient.playui.setTingCardPosX);
    }
    carNumNode.visible = true;
    var cardTextNode = carNumNode.getChildByName("showNode");
    cardTextNode.visible = false;

    if(MjClient.playui._tingCardsNode) MjClient.playui._tingCardsNode.visible = !carNumNode.visible;

    var BindingNode = carNumNode.getChildByName("Node_card");

    //删除之前，先把放在池子里面
    var BindingNodeChilds = BindingNode.children;
    for(var i = 0;i < BindingNodeChilds.length ;i++)
    {
        var c = BindingNodeChilds[i];
        CommonPool.putInPool(c);
    }
    BindingNode.removeAllChildren(true);
    var i=0;
    var j=0;//高的idx
    var width = 86;
    var hight = 80;

    for (var cd in tingSet)
    {
        if(i >= 7)
        {
            i = 0;
            j++;
        }

        var cardNode = CommonPool.getFromPool(cardTextNode.getName());
        if(!cardNode)
        {
            cardNode = cardTextNode.clone();
        }

        //晋中麻将的特殊需求
        if(MjClient.data.sData.tData.areaSelectMode["is68"] && MjClient.data.sData.tData.uids.length == 2)
        {
            cardNode = cardTextNode.clone(); //缓冲取出来的麻将，可能异常显示
            cardNode.getChildByName("cardCount").visible = false;
            cardNode.getChildByName("cardText").visible = false;
        }

        var countNode = cardNode.getChildByName("cardCount");
        var icount = MjClient.playui.getHuCardNum(parseInt(cd));
        countNode.setString(icount + "");
        var off = 0;
        MjClient.playui.setCardSprite(cardNode.getChildByName("cardNode"), parseInt(cd), off);
        cardNode.setPositionX(cardTextNode.getPositionX() + width*i*1);
        cardNode.setPositionY(cardTextNode.getPositionY() + hight*j*1);
        cardNode.visible = true;
        bHaveValue = true;
        BindingNode.addChild(cardNode);
        i++;
    }
    //如果对象中没有值
    if(!bHaveValue)
    {
        carNumNode.visible = false;
    }

    //设置背景的长度
    if(j > 0) i = 7;
    var tingCardsWidth = (i + 1)*width + 20;
    var tingCardHigh = carNumNode.getContentSize().height + j*hight;
    carNumNode.setContentSize(tingCardsWidth, tingCardHigh);
    COMMON_UI.clearShowCurrentEatCards();
}

/**
 *这张牌，外面还剩几张可以胡
 * @param card
 * @returns {number} 返回张数,一般麻将 count <= 4
 */
PlayLayer.prototype.getHuCardNum = function(card)
{
    var icount = 4;//每一种牌总共4张
    var tData = MjClient.data.sData.tData;
    var sData = MjClient.data.sData;
    var uids = tData.uids;
    for(var off = 0;off < 4 ;off++)
    {
        var selfIndex = getPlayerIndex(off);
        if(selfIndex == null) continue;
        var pl = sData.players[tData.uids[selfIndex] + ""];

        if(!pl) continue;
        /*
         排除一下的牌，算出剩余张数
         */
        //碰
        if(pl.mjpeng.length > 0)
        {
            for (var i = 0; i < pl.mjpeng.length ; i++)
            {
                if(pl.mjpeng[i] == card)
                {
                    icount -= 3;
                    break;
                }
            }
        }

        //明杠
        if(pl.mjgang0)
        {
            for (var i = 0; i < pl.mjgang0.length ; i++)
            {
                if(pl.mjgang0[i] == card)
                {
                    icount -= 4;
                    break;
                }
            }
        }
        //暗杠
        if(pl.mjgang1)
        {
            for (var i = 0; i < pl.mjgang1.length ; i++)
            {

                if(pl.mjgang1[i] == card)
                {
                    icount -= 4;
                    break;
                }
            }
        }
        //吃
        if(pl.mjchi)
        {
            for (var i = 0; i < pl.mjchi.length ; i++)
            {
                if(pl.mjchi[i] == card)
                {
                    icount -= 1;
                }
            }
        }

        //打出去的牌
        if(pl.mjput)
        {
            for (var i = 0; i < pl.mjput.length ; i++)
            {
                if(pl.mjput[i] == card)
                {
                    icount -= 1;
                }
            }
        }

        //自己得手牌
        if(off == 0)
        {
            if (pl.mjhand.length > 0) {
                //碰
                for (var i = 0; i < pl.mjhand.length; i++) {
                    if (pl.mjhand[i] == card) {
                        icount -= 1;
                    }
                }

            }
        }
    }

    if(icount < 0) icount = 0;

    return icount;
}

/**
 * 有些玩法不需要，听牌如果能听也显示可以听的牌。
 * @returns {boolean} 返回true 表示无须听牌也显示当前听的牌
 */
PlayLayer.prototype.isNeedShowTingCard = function()
{
    if(MjClient.clickTing)
    {
        return true;
    }
    return false;
}


/**
 * 移动一张麻将时，移动距离多远麻将才开始移动，有的app 可能要求不一样
 * @returns {boolean}
 */
PlayLayer.prototype.cardMoveDistance = function()
{
    var standUI = getNode(0).getChildByName("stand");
    var _standHeight = standUI.getContentSize().height;
    var pos = MjClient.movingCard.getTouchMovePosition();
    if(cc.pDistance(cardBeginPos, pos) > _standHeight/2)
    {
         return true;
    }
    return false;
}

/**
 * 在这些情况下不能出牌，简化addTouchEventListener里面的判断，增强代码可读性 by sking 2018.12.6
 * @param cardui
 * @param btn
 * @returns {boolean} 返回false 表示不能出牌
 */
PlayLayer.prototype.isCanTouch = function(cardui,btn,touchType)
{
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var pl = getUIPlayer(0);
    if(!IsTurnToMe() || tData.tState != TableState.waitPut)
    {
        if(MjClient.gameType == MjClient.GAME_TYPE.HONG_TONG_WANG_PAI &&
            tData.areaSelectMode.wanfa == "duiwangdajiangbao")
        {
            if (pl.hunCard != null && pl.hunCard != -1)
            {
                if (IsTurnToMe() && tData.tState == TableState.waitWang)
                {
                    MjClient.showToast("等他其他玩家选王");
                }
                return false;
            }
        }
        else
        {
            return false;
        }
    }

    if(pl.mustHu){
        MjClient.showToast("有胡必胡");
        return false;
    }

    if (MjClient.clickTing && !MjClient.canTingCards[cardui.tag])
    {
        cc.log("MjClient.canTingCards  ",JSON.stringify(MjClient.canTingCards),MjClient.canTingCards[cardui.tag]);
        return false;
    }
    if (MjClient.clickTing && MjClient.JJHcanTingCards && !MjClient.JJHcanTingCards[cardui.tag])//目前玩法没有将将胡特殊听牌
    {
        cc.log("MjClient.JJHcanTingCards  ",JSON.stringify(MjClient.JJHcanTingCards),MjClient.JJHcanTingCards[cardui.tag]);
        return false;
    }

    if (MjClient.movingCard !== null && MjClient.movingCard !== btn)
    {
        return false;
    }

    var children = btn.getParent().children;
    for(var i = 0; i < children.length; i++)
    {
        //手里打出去，要删掉的那张牌没有删除之前不让出第二张牌，也就是没有收到Mjput消息回调前不让出牌  by sking 2018.9.12
        if(children[i].name == "putOutCard" ) return false;
    }

    if(MjClient.isChaPaiPlaying) return false; //正在播插牌动画时不让点击其他的牌 by sking 2018.9.12
    return  true;
}


PlayLayer.prototype.GetReadyVisible = function(node, off)
{
    if(off < 0 || MjClient.isInGoldFieldQuick())//金币场快速场不需要显示准备
    {
        node.visible = false;
        return false;
    }

    var pl = getUIPlayer(off);
    var tData = MjClient.data.sData.tData;

    var isCanShow = true;
    if(tData.tState == TableState.waitReady) {
        var isFull =  Object.keys(MjClient.data.sData.players).length == tData.maxPlayer;
        if(!isFull) isCanShow = false;
    }

    if(pl && pl.mjState == TableState.isReady && tData.tState != TableState.waitJoin && isCanShow)
    {
        //已经准备好了，并且状态不是等待，ready 设置可见
        node.visible = true;
        //p0.isTing = false;
    }
    else
    {
        node.visible = false;
    }

    return node.visible;
}

/*********************************************************************************************
***************************************收到的消息回调******************************************
**********************************************************************************************/

/**
 *收到后台回调事件 MJPut 时候会调用
 */
PlayLayer.prototype.callBack_MJPut = function()
{
    cc.log("HHH :，MJPut------");
    MjClient.playui.EatVisibleCheck();
}

/**
 *收到后台回调事件 roundEnd 时候会调用
 */
PlayLayer.prototype.callBack_roundEnd = function(mgs)
{
    cc.log("HHH :，roundEnd------");
    util.localStorageEncrypt.removeItem("lastAnGangArray");
    MjClient.playui.EatVisibleCheck();
}

/**
 *收到后台回调事件 mjhand 时候会调用
 */
PlayLayer.prototype.callBack_mjhand = function()
{
    cc.log("HHH :，mjhand------");
    MjClient.playui.EatVisibleCheck();
    if(MjClient.endoneui != null)
    {
        MjClient.endoneui.removeFromParent(true);
        MjClient.endoneui = null;
    }
}

/**
 *收到后台回调事件 mjhand 时候会调用
 */
PlayLayer.prototype.callBack_LeaveGame = function()
{
    cc.log("HHH :，LeaveGame------");

    MjClient.addHomeView();
    MjClient.playui.removeFromParent(true);
    delete MjClient.playui;
    delete MjClient.endoneui;
    delete MjClient.endallui;
    cc.audioEngine.stopAllEffects();
    playMusic("bgMain");
}

/**
 *收到后台回调事件 endRoom 时候会调用
 */
PlayLayer.prototype.callBack_endRoom = function()
{
    cc.log("HHH :，endRoom------");
}

/**
 *收到后台回调事件 clearCardUI 时候会调用
 */
PlayLayer.prototype.callBack_clearCardUI = function()
{
    cc.log("HHH :，clearCardUI------");

    MjClient.playui.EatVisibleCheck();
    hideTingBtn();
}

/**
 *收到后台回调事件 DelRoom 时候会调用
 */
PlayLayer.prototype.callBack_DelRoom = function()
{
    cc.log("HHH :，DelRoom------");
    CheckRoomUiDelete();
}

/**
 *收到后台回调事件 MJPass 时候会调用
 */
PlayLayer.prototype.callBack_MJPass = function()
{
    cc.log("HHH :，MJPass------");
    setSkipHuState();
    setSkipPengState(); // 开启 过碰 机制
    MjClient.playui.EatVisibleCheck();
}

/**
 *收到后台回调事件 MJPeng 时候会调用
 */
PlayLayer.prototype.callBack_MJPeng = function()
{
    cc.log("HHH :，MJPeng------");
    MjClient.playui.EatVisibleCheck();
}

/**
 *收到后台回调事件 MJChi 时候会调用
 */
PlayLayer.prototype.callBack_MJChi = function()
{
    cc.log("HHH :，MJChi------");
    MjClient.playui.EatVisibleCheck();
}

/**
 *收到后台回调事件 MJGang 时候会调用
 */
PlayLayer.prototype.callBack_MJGang = function()
{
    cc.log("HHH :，MJGang------");
    MjClient.playui.EatVisibleCheck();
}

/**
 *收到后台回调事件 MJTing 时候会调用
 */
PlayLayer.prototype.callBack_MJTing = function()
{
    cc.log("HHH :，MJTing------");
    hideTingBtn();
    isCheckedTing = false;
}

/**
 *收到后台回调事件 waitPut 时候会调用
 */
PlayLayer.prototype.callBack_waitPut = function()
{
    cc.log("HHH :，waitPut------");
    MjClient.playui.EatVisibleCheck();
}

/**
 *收到后台回调事件 onlinePlayer 时候会调用
 */
PlayLayer.prototype.callBack_onlinePlayer = function()
{
    cc.log("HHH :，onlinePlayer------");
}
/**
 *收到后台回调事件 initSceneData 时候会调用
 */
PlayLayer.prototype.callBack_initSceneData = function()
{
    cc.log("HHH :，initSceneData------");
}
/**
 *收到回调事件 moveHead 时候会调用
 */
PlayLayer.prototype.callBack_moveHead = function()
{
    cc.log("HHH :，initSceneData------");
}

/*********************************************************************************************
 ***************************************end of 收到的消息回调**********************************
 *********************************************************************************************/

/*--------------------------------------------------------------------------------------------
 -------------------------------------发送消息给服务器-----------------------------------------
 --------------------------------------------------------------------------------------------*/
PlayLayer.prototype.sendMessage_MJPass = function()
{
    cc.log("send Message ------ MJPass");
    if (MjClient.rePlayVideo != -1) return; // 回放时候不能请求
    var tData = MjClient.data.sData.tData;
    COMMON_UI.clearShowCurrentEatCards();
    MjClient.gamenet.request("pkroom.handler.tableMsg", {
        cmd: "MJPass",
        eatFlag: EatFlag(),
        cardNext: tData.cardNext
    });
}

PlayLayer.prototype.sendMessage_MJChi = function(pos)
{
    cc.log("send Message ------ MJChi");
    if (MjClient.rePlayVideo != -1) return; // 回放时候不能请求
    MjClient.gamenet.request("pkroom.handler.tableMsg", {
        cmd: "MJChi",
        pos: pos,
        eatFlag: EatFlag()
    });
}

PlayLayer.prototype.sendMessage_MJGang = function(cd)
{
    cc.log("send Message ------ MJGang");
    if (MjClient.rePlayVideo != -1) return; // 回放时候不能请求
    MjClient.gamenet.request("pkroom.handler.tableMsg", {
        cmd: "MJGang",
        card: cd,
        eatFlag: EatFlag()
    });
}

PlayLayer.prototype.sendMessage_MJPeng = function()
{
    cc.log("send Message ------ MJPeng");
    if (MjClient.rePlayVideo != -1) return; // 回放时候不能请求
    var tData = MjClient.data.sData.tData;
    var pl = getUIPlayer(0);
    if(pl.mustHu){
        return MjClient.showToast("有胡必胡");
    }
    MjClient.gamenet.request("pkroom.handler.tableMsg", {
        cmd: "MJPeng",
        eatFlag: EatFlag()
    });
}

PlayLayer.prototype.sendMessage_MJHu = function()
{
    cc.log("send Message ------ MJHu");
    if (MjClient.rePlayVideo != -1) return; // 回放时候不能请求
    MjClient.gamenet.request("pkroom.handler.tableMsg", {
        cmd: "MJHu",
        eatFlag: EatFlag()
    });
}

/*--------------------------------------------------------------------------------------------
 -------------------------------------end of 发送消息给服务器----------------------------------
 --------------------------------------------------------------------------------------------*/

/*##############################################################################################
############################################消息处理#############################################
###############################################################################################*/
/**
 * 处理，收到服务器消息MJPut后的处理,之前的DealMJPut
 */
PlayLayer.prototype.DealMessage_MJPut = function(node, msg, off, outNum)
{
    //todo..如果非山西的，需要修改
    DealMJPut_shanXiApp(node, msg, off, outNum);
}
/**
 * 处理，收到服务器消息MJPeng后的处理,之前的DealMJPeng
 */
PlayLayer.prototype.DealMessage_MJPeng = function(node, msg, off)
{
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var uids = tData.uids;
    var selfIndex = getPlayerIndex(off);
    if(tData.curPlayer == selfIndex)
    {
        var fromOff = [];
        var fromBind = GetUIBind(msg.from, fromOff);
        var fnode = fromBind._node;

        var pl = sData.players[tData.uids[selfIndex] + ""];
        var i = pl.pengchigang.peng.length - 1;
        var idx = tData.uids.indexOf(pl.info.uid);
        var offIdx = 0;


        if(i >= 0)
        {
            offIdx = getOffByIndex(pl.pengchigang.peng[i].pos, idx) - 1;
        }


        var lastPutCard = tData.lastPutCard;
        RemoveNewCardOut(fnode);
        var idxPeng =  pl.mjpeng.length -1;
        var _pengCardNode = null;
        for(var j = 0; j < 3; j++)
        {
            if( (j % 3 == 2 - offIdx && off % 3 == 0) || (j % 3 == offIdx && off % 3 != 0) )
            {
                _pengCardNode = MjClient.playui.getNewCard(node, "up", "peng", pl.mjpeng[idxPeng], off, "heng", "heng");
                setCardArrow(_pengCardNode, offIdx, off);
            }
            else
            {
                _pengCardNode = MjClient.playui.getNewCard(node, "up", "peng", pl.mjpeng[idxPeng], off);
            }

            if(msg.cpginfo.pengFourCounts && j < msg.cpginfo.pengFourCounts[pl.mjpeng[idxPeng]])
            {
                _pengCardNode.isFour = true;

                //add by sking 立四的标签不显示，切2,3D时候
                pl.pengFourCounts = msg.cpginfo.pengFourCounts;
            }

            if(j == 2)
            {
                _pengCardNode.ispeng3 = true;
            }
        }

        //删掉俩张stand
        if(off == 0)
        {
            RemoveNodeBack(node, "mjhand", 2, lastPutCard);
        }
        else if(off == 3)
        {
            if (MjClient.rePlayVideo == -1)
                RemoveNodeBack(node, "standPri", 2);
            else
                RemoveNodeBack(node, "mjhand_replay", 2, lastPutCard);
        }
        else
        {
            if (MjClient.rePlayVideo == -1)
                RemoveFrontNode(node, "standPri", 2);
            else
                RemoveFrontNode(node, "mjhand_replay", 2, lastPutCard);
        }

        MjClient.playui.CardLayoutRestore(fnode, fromOff[0]);
        MjClient.playui.CardLayoutRestore(node, off);
        ShowEatActionAnim(node, ActionType.PENG, off);


        //检查碰碰了之后UI节点是否对应删除
        checkDealMjputCards(off)
    }
}
/**
 * 处理，收到服务器消息MJPeng后的处理,之前的DealMJGang
 */
PlayLayer.prototype.DealMessage_MJGang = function(node, msg, off)
{

    MjClient.clickTing = false; //清除当前点听得按钮状态 by sking 2018.9.21 ;
    if (msg.card instanceof Array)
    {
        DealMJTeshuGang(node, msg, off);
        return;
    }

    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var uids = tData.uids;
    var selfIndex = getPlayerIndex(off);
    if(uids[selfIndex] != msg.uid)
    {
        return;
    }

    if(msg.gang == 1)//明杠
    {
        var fromOff = [];
        var fromBind = GetUIBind(msg.from, fromOff);
        var fnode = fromBind._node;
        RemoveNewCardOut(fnode);

        if(off == 0)
        {
            RemoveNodeBack(node, "mjhand", 3, msg.card);
        }
        MjClient.playui.CardLayoutRestore(fnode, fromOff[0]);
    }
    else if(msg.gang == 2)//碰杠
    {
        RemoveNodeBack(node, "peng", 3, msg.card);
        if(off == 0)
        {
            RemoveNodeBack(node, "mjhand", 1, msg.card);
        }
    }
    else if(msg.gang == 3)//暗杠
    {
        if(off == 0)
        {
            RemoveNodeBack(node, "mjhand", 4, msg.card);
        }
    }

    if(off != 0)
    {
        if(off == 3)
        {
            if(msg.gang == 1)
            {
                var fromOff = [];
                var fromBind = GetUIBind(msg.from, fromOff);
                var fnode = fromBind._node;
                RemoveNewCardOut(fnode);

                if (MjClient.rePlayVideo == -1)
                    RemoveNodeBack(node, "standPri", 3);
                else
                    RemoveNodeBack(node, "mjhand_replay", 3, msg.card);
            }
            else if(msg.gang == 2)
            {
                RemoveNodeBack(node, "peng", 3, msg.card);
                if (MjClient.rePlayVideo == -1) {
                    RemoveNodeBack(node, "standPri", 1);
                }
                else
                    RemoveNodeBack(node, "mjhand_replay", 1, msg.card);
            }
            else if(msg.gang == 3)
            {
                if (MjClient.rePlayVideo == -1)
                {
                    RemoveNodeBack(node, "standPri", 4);
                }
                else
                    RemoveNodeBack(node, "mjhand_replay", 4, msg.card);
            }
        }
        else
        {
            if(msg.gang == 1)
            {
                var fromOff = [];
                var fromBind = GetUIBind(msg.from, fromOff);
                var fnode = fromBind._node;
                    RemoveNewCardOut(fnode);

                if (MjClient.rePlayVideo == -1)
                    RemoveFrontNode(node, "standPri", 3);
                else
                    RemoveFrontNode(node, "mjhand_replay", 3, msg.card);
            }
            else if(msg.gang == 2)
            {
                RemoveFrontNode(node, "peng", 3, msg.card);
                if (MjClient.rePlayVideo == -1) {
                    RemoveFrontNode(node, "standPri", 1);
                }
                else
                    RemoveFrontNode(node, "mjhand_replay", 1, msg.card);
            }
            else if(msg.gang == 3)
            {
                if (MjClient.rePlayVideo == -1)
                {
                    RemoveFrontNode(node, "standPri", 4);
                }
                else
                    RemoveFrontNode(node, "mjhand_replay", 4, msg.card);
            }
        }
    }

    var offIdx = null;
    var pl = sData.players[tData.uids[selfIndex] + ""];
    var idx = tData.uids.indexOf(pl.info.uid);
    for (var i=0; i<pl.pengchigang.gang.length; i++)
    {
        if (pl.pengchigang.gang[i].card == msg.card)
        {
            offIdx = getOffByIndex(pl.pengchigang.gang[i].pos, idx) - 1;
            break;
        }
    }
    if (offIdx == null)
    {
        for (var i=0; i<pl.pengchigang.pgang.length; i++)
        {
            if (pl.pengchigang.pgang[i].card == msg.card)
            {
                offIdx = getOffByIndex(pl.pengchigang.pgang[i].pos, idx) - 1;
                break;
            }
        }
    }
    if (offIdx == null)
    {
        cc.log("DealMJGang:offIdx == null!!!!");
        offIdx = 0;
    }

    var setCardArrowOnGang4 = false;
    for(var j = 0; j < 4; j++)
    {
        var _cardNode = null;
        if(msg.gang == 3)//暗杠
        {
            if(j == 3)
            {
                _cardNode = MjClient.playui.getNewCard(node, "down", "gang1", 0, off, "isgang4");
                _cardNode.tag = msg.card;
            }
            else
            {
                _cardNode = MjClient.playui.getNewCard(node, "up", "gang1", msg.card, off);
            }
        }
        else if(msg.gang == 2 && isJinZhongAPPType()) //山西app，补杠箭头指向自己
        {
            if(j < 3)
            {
                if( (j % 3 == 2 - offIdx && off % 3 == 0) || (j % 3 == offIdx && off % 3 != 0) )
                {
                    _cardNode = MjClient.playui.getNewCard(node, "up", "gang0", msg.card, off, "heng", "heng");
                    setCardArrow(_cardNode, 3, off);
                    if (j==1)
                    {
                        setCardArrowOnGang4 = true;
                    }
                }
                else
                {
                    _cardNode = MjClient.playui.getNewCard(node, "up", "gang0", msg.card, off);
                }
            }
            else
            {
                _cardNode = MjClient.playui.getNewCard(node, "up", "gang0", msg.card, off, "isgang4");//最后一张牌放上面
                _cardNode.tag = msg.card;
                if (setCardArrowOnGang4)
                {
                    setCardArrow(_cardNode, 3, off);
                }
            }
        }
        else//明杠，补杠
        {
            if(j < 3)
            {
                if( (j % 3 == 2 - offIdx && off % 3 == 0) || (j % 3 == offIdx && off % 3 != 0) )
                {
                    _cardNode = MjClient.playui.getNewCard(node, "up", "gang0", msg.card, off, "heng", "heng");
                    setCardArrow(_cardNode, offIdx, off);
                    if (j==1)
                    {
                        setCardArrowOnGang4 = true;
                    }
                }
                else
                {
                    _cardNode = MjClient.playui.getNewCard(node, "up", "gang0", msg.card, off);
                }
            }
            else
            {
                _cardNode = MjClient.playui.getNewCard(node, "up", "gang0", msg.card, off, "isgang4");//最后一张牌放上面
                _cardNode.tag = msg.card;
                if (setCardArrowOnGang4)
                {
                    setCardArrow(_cardNode, offIdx, off);
                }
            }
        }
    }

    MjClient.playui.CardLayoutRestore(node, off);
    ShowEatActionAnim(node, ActionType.GANG, off);
}
/**
 * 处理，收到服务器消息MJPeng后的处理,之前的DealMJChi
 */
PlayLayer.prototype.DealMessage_MJChi = function(node, msg, off)
{
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var uids = tData.uids;
    var selfIndex = getPlayerIndex(off);
    if (tData.curPlayer == selfIndex)
    {
        var fromOff = [];
        var fromBind = GetUIBind(msg.from, fromOff);
        var fnode = fromBind._node;
        var lastPutCard = tData.lastPutCard;
        var pl = sData.players[tData.uids[selfIndex] + ""];
        RemoveNewCardOut(fnode);
        var cds = msg.mjchi;

        // 把吃的牌放中间 begin
        var _chiCenter = false;//是否需要把吃的牌放中间，如果需要 _chiCenter 设置为true

        if ( _chiCenter) {
            cds.sort(function(a, b) {
                return a - b;
            });
            var chiCardIndex = -1
            for (var i = 0;i < cds.length;i++){
                if (cds[i] == msg.mjchiCard[msg.mjchiCard.length - 1]){
                    chiCardIndex = i
                }
            }
            if (chiCardIndex >= 0){
                cds.splice(chiCardIndex,1)
                cds.splice(cds.length / 2,0,msg.mjchiCard[msg.mjchiCard.length - 1])
            }
        }
        // end

        var cdui = null;
        for(var i = 0; i < cds.length; i++)
        {
            if(cds[i] == lastPutCard)
            {
                cdui = MjClient.playui.getNewCard(node, "up", "chi", cds[i], off, "heng");
                setCardArrow(cdui, 2, off);
                // if(MjClient.gameType == MjClient.GAME_TYPE.HAI_AN_MJ ||
                //     MjClient.gameType == MjClient.GAME_TYPE.XUE_ZHAN ||
                //     MjClient.gameType == MjClient.GAME_TYPE.XUE_LIU  ||
                //     MjClient.gameType == MjClient.GAME_TYPE.HAI_AN_BAI_DA )
                // {
                //     setCardArrow_chi(cdui, 2, off);
                // }
            }
            else
            {
                cdui = MjClient.playui.getNewCard(node, "up", "chi", cds[i], off);
            }

            if(off == 0 && cds[i] != lastPutCard)
            {
                RemoveNodeBack(node, "mjhand", 1, cds[i]);
            }

            if(i == 2)
            {
                cdui.ischi3 = true;
            }
        }

        //删掉俩张stand
        if (MjClient.rePlayVideo == -1)
        {
            if(off == 3)
            {
                RemoveNodeBack(node, "standPri", 2);
            }
            else if(off != 0)
            {
                RemoveFrontNode(node, "standPri", 2);
            }
        }
        else //回放
        {
            for(var i = 0; i < cds.length; i++)
            {
                if(cds[i] != lastPutCard)
                {
                    if(off == 3)
                    {
                        RemoveNodeBack(node, "mjhand_replay", 1, cds[i]);
                    }
                    else if(off != 0)
                    {
                        RemoveFrontNode(node, "mjhand_replay", 1, cds[i]);
                    }
                }
            }
        }

        MjClient.playui.CardLayoutRestore(node, off);
        MjClient.playui.CardLayoutRestore(fnode, fromOff[0]);
        ShowEatActionAnim(node, ActionType.CHI, off);
    }
}

/**
 * 处理，收到服务器消息MJPeng后的处理,之前的DealWaitPut
 */
PlayLayer.prototype.DealMessage_WaitPut = function(node, msg, off)
{
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var uids = tData.uids;
    msg = tData; //msg 这个参数其实没什么卵用 by sking 2018.9.13
    var selfIndex = getPlayerIndex(off);
    if(tData.curPlayer == selfIndex)
    {
        if (MjClient.rePlayVideo == -1)//正常打牌流程
        {
            MjClient.playui.getNewCard(node, "stand", "standPri");
        }
        else //播放录像
        {
            var pl = getUIPlayer(off);
            if(pl){
                MjClient.playui.getNewCard(node, "up", "mjhand_replay", pl.mjhand[pl.mjhand.length-1], off);
            }else{
                cc.log('error DealWaitPut pl is null off:', off);
            }
        }
        MjClient.playui.CardLayoutRestore(node, off,true);
    }
}

/**
 * 处理，收到服务器消息MJPeng后的处理,之前的HandleMJHu
 */
PlayLayer.prototype.DealMessage_MJHu = function(node, msg, off)
{
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var selfIndex = getPlayerIndex(off);
    var pl = getUIPlayer(off);
    if(tData.uids[selfIndex] != msg.uid)
    {
        return;
    }
    if(!pl) return;

    MjClient.playui.EatVisibleCheck();
    if (pl.zimoNode && !COMMON_UI3D.is3DUI()) {
        // 自摸,天胡 闪电提示动画
        ZiMoShandianAnimate(node, off);
    }
    if (pl.huWord == "qingyise") {
        ShowEatActionAnim(node,ActionType.QINGYISE,off);
    }else if (pl.huWord == "yitiaolong") {
        ShowEatActionAnim(node,ActionType.YITIAOLONG,off);
    }else if (pl.huWord == "duiduihu") {
        ShowEatActionAnim(node,ActionType.DUIDUIHU,off);
    }else if (pl.huWord == "tianhu") {
        ShowEatActionAnim(node,ActionType.TIANHU,off);
    }else if (pl.huWord == "dihu") {
        ShowEatActionAnim(node,ActionType.DIHU,off);
    }else if (pl.huWord == "qidui") {
        ShowEatActionAnim(node,ActionType.QIDUI,off);
    }else if (pl.huWord == "gangkai") {
        ShowEatActionAnim(node,ActionType.GANGKAI,off);
    }else if (pl.huWord == "zimo") {
        ShowEatActionAnim(node,ActionType.ZIMO,off);
    }else if (pl.huWord == "dadiaoche") {
        ShowEatActionAnim(node,ActionType.DADIAOCHE,off);
    }else if (pl.huWord == "dajue") {
        ShowEatActionAnim(node,ActionType.DAJUE,off);
    }else {
        ShowEatActionAnim(node,ActionType.HU,off);
    }
}

/**
 * 处理，收到服务器消息MJPeng后的处理,之前的HandleMJTing
 */
PlayLayer.prototype.DealMessage_MJTing = function(node, msg, off)
{
    var sData=MjClient.data.sData;
    var tData=sData.tData;
    var selfIndex=getPlayerIndex(off);
    if( tData.uids[selfIndex]!=msg.uid) return;
    var pl = getUIPlayer(off);
    if(pl)
    {
        cc.log("播放听动画");
        /*
         显示听的标志，add by sking
         */
        ShowEatActionAnim(node,ActionType.TING,off);
        {
            var tingIcon = node.getChildByName("head").getChildByName("tingIcon");
            var _cardIcon = node.getChildByName("head").getChildByName("tingCard");
            if(_cardIcon && msg.putCardAfterTing >= 0)
            {
                _cardIcon.visible = true;
                _cardIcon.visible = false;
            }
            if(_cardIcon && msg.putCardAfterTing < 0)
            {
                _cardIcon.visible = false;
            }
            if(tingIcon)
                tingIcon.visible = true;
        }
    }
}

/**
 * 处理，收到服务器消息MJPeng后的处理,之前的HandleMJFlower
 */
PlayLayer.prototype.DealMessage_MJFlower = function(node, msg, off)
{
    var sData=MjClient.data.sData;
    var tData=sData.tData;
    var selfIndex=getPlayerIndex(off);
    if( tData.uids[selfIndex]!=msg.uid) return;
    var pl = getUIPlayer(off);
    if(pl)
    {
        cc.log("播放补花动画");
        if(off==0 /*&& MjClient.GAME_TYPE.LUAN_GUA_FENG != MjClient.gameType*/)
        {
            RemoveNodeBack(node, "copycdui", 1, msg.card);//在putOutCard 函数里被创建
            if(RemoveNodeBack(node, "putOutCard", 1, msg.card) == 0)
            {
                cc.log("msg.card    :",msg.card);
                RemoveNodeBack(node, "mjhand", 1, msg.card);
            }
            else
            {
                cc.log("播放补花动画 msg.card    :",msg.card);
            }
        }
        else if(off==1)
        {
            if (MjClient.rePlayVideo == -1)
                RemoveNodeBack(node, "standPri", 1);
            else
                RemoveNodeBack(node, "mjhand_replay", 1, msg.card);
        }
        else if(off == 2 || off == 3)
        {
            if (MjClient.rePlayVideo == -1)
                RemoveFrontNode(node, "standPri", 1);
            else
                RemoveFrontNode(node, "mjhand_replay", 1, msg.card);
        }
        MjClient.playui.CardLayoutRestore(node,off);
        MjClient.majiang.setFlowerImg(node, pl);
        ShowEatActionAnim(node,ActionType.FLOWER,off);
        clearCurrentPutTag();
    }

}
/**
 * 处理，收到服务器消息MJPeng后的处理,之前的DealNewCard
 */
PlayLayer.prototype.DealMessage_MJNewCard = function(node, msg, off,bFirstCard)
{
    /*
     下一次摸牌，过胡标志取消
     */
    var isNextCardCancelHuTag = false;//是否下次摸牌，取消过胡的标志

    if (isNextCardCancelHuTag)
    {
        var pl = getUIPlayer(0);
        if(!pl.isQiHu)
        {
            var _skipHuIconNode = MjClient.playui._downNode.getChildByName("head").getChildByName("skipHuIconTag");
            if(_skipHuIconNode)
            {
                _skipHuIconNode.visible = !!pl.skipHu;
            }
        }
    }
    if (off === 0){
        var _skipPengIconNode = MjClient.playui._downNode.getChildByName("head").getChildByName("skipPengIconTag");
        if(_skipPengIconNode)
            _skipPengIconNode.visible = false;
    }

    //创建一个麻将，msg为麻将的信息，数字表示。by sking
    var cardNode =  MjClient.playui.getNewCard(node, "stand", "mjhand", msg, off);

    var pl = getUIPlayer(off);//获取玩家信息.off 为0 ，就是自己得信息，能看到自己摸牌 by sking
    var children = node.children;
    for(var i = 0; i < children.length; i++)
    {
        var ci = children[i];
        if(ci.name == "mjhand")ci.isNew = false;
    }

    var isNeedMjhandAni = false; //是否需要4 4 1 发牌动画
    if (isNeedMjhandAni) // 4 列 4列的发牌效果
    {
        if(bFirstCard) cardNode.visible = false;
    }
    else
    {
        //摆放位置，排序，设置大小
        MjClient.playui.CardLayoutRestore(node, 0);
    }
}

/*##############################################################################################
######################################end of 消息处理############################################
###############################################################################################*/

//多吃的情况
PlayLayer.prototype.MJChiCardchange = function(tag)
{
    if (MjClient.eatpos.length == 0)
        return;

    var tData = MjClient.data.sData.tData;
    var pl = getUIPlayer(0);
    if(pl.mustHu){
        return MjClient.showToast("有胡必胡");
    }


    var eat = MjClient.playui.jsBind.eat;
    var changeuibg = eat.changeui.changeuibg;
    var cardTemplet = changeuibg._node.getChildByName("card");
    var children = changeuibg._node.getChildren().slice();
    for (var i = 0, len = children.length; i < len; i ++)
    {
        if (children[i] != cardTemplet && children[i].getName().indexOf("card") != -1)
            children[i].removeFromParent();
    }

    if(MjClient.eatpos.length == 1)
    {
        MjClient.playui.sendMessage_MJChi(MjClient.eatpos[0]);
    }
    else
    {
        eat.chi0._node.visible = false;
        eat.chi1._node.visible = false;
        eat.chi2._node.visible = false;
        eat.peng._node.visible = false;
        eat.gang0._node.visible = false;
        eat.gang1._node.visible = false;
        eat.gang2._node.visible = false;
        eat.hu._node.visible = false;
        eat.guo._node.visible = false;
        changeuibg._node.visible = true;

        var tData = MjClient.data.sData.tData;
        var lastPutCard = tData.lastPutCard;

        var card = [];
        var width = (cardTemplet.width - 7)*cardTemplet.scaleX;
        var startX = changeuibg._node.width/2 - width;
        for (var i = 0; i < MjClient.eatpos.length; i++)
        {
            for (var j = 0; j < 3; j ++)
            {
                card[j] = cardTemplet.clone();
                MjClient.playui.setCardSprite(card[j], lastPutCard - MjClient.eatpos[i] + j, 0);
                if (MjClient.eatpos[i] == j)
                    card[j].color = cc.color(255, 255, 0);

                card[j].visible = true;
                card[j].setName("card" + (MjClient.eatpos[i]*3 + j));
                card[j].setPosition(startX + j*width, cardTemplet.y + i*cardTemplet.height*cardTemplet.scaleY);

                var img = card[j];
                changeuibg._node.addChild(img);

                card[j].addTouchEventListener(changeuibg._node.chiTouch, card[j]);
            }
            ShowChiCards(changeuibg._node, MjClient.eatpos[i], card[0], card[1], card[2]);
        }

        if (card[0])
            changeuibg._node.height = card[0].y + card[0].height * card[0].scaleY * card[0].anchorY + 8.0;
    }
}

//多杠的情况
PlayLayer.prototype.MJGangCardchange = function(tag)
{
    var tData = MjClient.data.sData.tData;
    var gangCards = MjClient.gangCards;
    var pl = getUIPlayer(0);

    if(pl.isZiMoHu ){
        if(!pl.isCanGang) return MjClient.showToast("必须胡牌");
    }

    if(pl.mustHu && !pl.isCanGang)
    {
        return MjClient.showToast("有胡必胡");
    }
    var eat = MjClient.playui.jsBind.eat;
    var changeuibg = eat.changeui.changeuibg;
    var cardTemplet = changeuibg._node.getChildByName("card");
    var children = changeuibg._node.getChildren().slice();
    for (var i = 0, len = children.length; i < len; i ++)
    {
        if (children[i] != cardTemplet && children[i].getName().indexOf("card") != -1)
            children[i].removeFromParent();
    }

    if (gangCards.length == 1)
    {
        MjClient.playui.sendMessage_MJGang(gangCards[0]);
    }
    else
    {

        eat.chi0._node.visible = false;
        eat.chi1._node.visible = false;
        eat.chi2._node.visible = false;
        eat.peng._node.visible = false;
        eat.gang0._node.visible = false;
        eat.gang1._node.visible = false;
        eat.gang2._node.visible = false;
        eat.hu._node.visible = false;
        eat.guo._node.visible = false;
        eat.ting._node.visible = false;

        if (eat.cancel) {
            eat.cancel._node.visible = false;
        }

        changeuibg._node.visible = true;
        eat.changeui._node.zIndex = 100; //调高层级 by sking

        cc.log("杠牌多选一11111"+JSON.stringify(gangCards))
        var card = null;
        var width = (cardTemplet.width - 7)*cardTemplet.scaleX;
        var startX = changeuibg._node.width/2 - width * 1.5;
        for(var i = 0; i < gangCards.length; i++)
        {
            if (gangCards[i] instanceof Array)
            {
                var gCards = gangCards[i];
                var startX2 = changeuibg._node.width/2 - width * (gCards.length/2 - 0.5);
                for (var j = 0; j < gCards.length; j ++)
                {
                    card = cardTemplet.clone();
                    MjClient.playui.setCardSprite(card, gCards[j], 4);
                    card.visible = true;
                    card.setName("card" + (i*4 + j));
                    card.setPosition(startX2 + j*width, cardTemplet.y + i*cardTemplet.height*cardTemplet.scaleY);
                    changeuibg._node.addChild(card);
                    card.teshuGangTag = gCards;
                    card.addTouchEventListener(changeuibg._node.gangTouch, card);
                }
            }
            else
            {
                var num = 4;
                for (var j = 0; j < num; j ++)
                {
                    card = cardTemplet.clone();
                    MjClient.playui.setCardSprite(card, gangCards[i], 4);
                    card.visible = true;
                    card.setName("card" + (i*4 + j));
                    card.setPosition(startX + j*width, cardTemplet.y + i*cardTemplet.height*cardTemplet.scaleY);
                    changeuibg._node.addChild(card);

                    card.addTouchEventListener(changeuibg._node.gangTouch, card);
                }
            }
        }

        if (card)
            changeuibg._node.height = card.y + card.height * card.scaleY * card.anchorY + 8.0;
    }
}

/***
 * 替换原来在common.js 文件的 getNewCard 函数
 * @param node
 * @param copy
 * @param name
 * @param tag
 * @param off
 * @param specialTAG
 * @returns {*|ccui.Widget}
 */
PlayLayer.prototype.getNewCard = function(node, copy, name, tag, off, specialTAG)
{
    var cpnode = node.getChildByName(copy);
    var cp = cpnode.clone(); //克隆一个白板，上面没有任何条纹的麻将 ，by sking
    if(copy == "stand")
    {
        if(!cpnode.standScale) cpnode.standScale = cpnode.getScale();
    }

    var scale = cp.getScale()*1.15;
    if (name == "mjhand")
    {
        scale = cp.getScale()*1.30;
    }
    cp.setScale(scale);
    cp.visible = true;
    if(tag == 999)
    {
        cp.visible = false;
    }
    cp.name = name;
    cp.currentScale = scale;

    if(specialTAG == "isgang4")
    {
        cp.isgang4 = true;
    }
    else if(specialTAG == "heng")
    {
        cp.heng = true;
    }
    node.addChild(cp);

    if(tag > 0)
    {
        //创建一个带有麻将信息的麻将 cp为创建后的麻将
        MjClient.playui.setCardSprite(cp, tag, name == "mjhand" ? 4 : off);
        if(name == "mjhand" || name == "mjting")
        {
            MjClient.playui.setTouchCardHandler(cpnode, cp);
        }
    }
    else
    {
        if (typeof(h5) != 'undefined' && h5.nativeHelper.isWeb() ) {
            cp.loadTexture(cpnode._textureFile);
        } else {
            cp.loadTexture(cpnode.getRenderFile().file);
        }
    }
    return cp;
}

/**
 * 刷新麻将的贴图
 * @param node 麻将的背景节点
 * @param cd  这张麻将的麻将点数
 * @param off  此off 并非方位的哪个off ,不要搞错了
 */
PlayLayer.prototype.setCardSprite = function(node, cd, off)
{
    //东南西北中发白
    var imgNames = ["Bamboo_", "Character_", "Dot_", "Wind_east", "Wind_south", "Wind_west", "Wind_north", "Red", "Green", "White"];

    //麻将的底牌公用图，4张
    node.loadTexture(getNewMJBgFile("playing/MJ/Mj_up_" + off + ".png"));

    // //调牌背和牌面的大小
    // setMJDif(node,off);

    var imgNode = new ccui.ImageView();
    imgNode.setRotation(-90 * (off));
    imgNode.setName("imgNode");
    node.removeAllChildren();
    node.addChild(imgNode,10);

    // 贴在麻将上面可变的图
    var path = "playing/MJ/"
    var imgName = "";
    if(cd < 30)
    {
        //条，筒，万
        imgName = imgNames[Math.floor(cd / 10)] + cd % 10;
    }
    else if (cd <= 91)
    {	//东南西北中发白
        imgName = imgNames[Math.floor(cd / 10)];//东南西北中发白
    }
    else if (cd <= 181){
        imgName = "flower_" + cd;
    }

    if (cc.sys.isObjectValid(node) && cd != null && typeof(cd) != "undefined") {
        node.tag = cd;
    }

    //加载小图
    imgNode.loadTexture(getNewMJBgFile(path + imgName + ".png"));

    //根据背景类型调整条文贴图位置
    this.resetCardSpriteWithMJBgType(node,off);

    //癞子
    this.setCardSpriteHunCard(node,off);

    schedulePlayMoveCardOtherSameCardGrey(node);
}

/**
 * 添加混牌，癞子牌...
 * @param cardNode 当前麻将的节点
 * @param off
 */
PlayLayer.prototype.setCardSpriteHunCard = function(cardNode,off)
{
    var offHunSet = [[50 + 10, 90 + 17], [52, 70], [50 - 10, 84], [60 + 14, 68], [48 + 13, 62 + 16], [48 + 13, 62 + 16], [22, 30]];

    //癞子
    if(MjClient.data.sData.tData.hunCard && MjClient.data.sData.tData.hunCard == cd)
    {
        var _zorder  = 11;
        var imgBaiDaNode = new ccui.ImageView();
        imgBaiDaNode.setName("imgBaiDa");
        imgBaiDaNode.setPosition(offHunSet[off][0], offHunSet[off][1]);
        if (off != 5 && off != 6)
            imgBaiDaNode.setRotation(-90 * (off));

        if (off == 6)
            imgBaiDaNode.setScale(0.38);

        imgBaiDaNode.loadTexture("playing/MJ/gong.png");
        cardNode.addChild(imgBaiDaNode,_zorder);
    }
}

/**
 * 根据麻将背景的类型，对应的调整贴图的位置
 * @param imgNode
 * @param off
 */
PlayLayer.prototype.resetCardSpriteWithMJBgType = function(imgNode,off)
{
    var offSets = [[52, 100], [60, 70], [52, 100], [60, 70], [50, 66], [53, 65], [19, 25]];;
    var MJBgType = getCurrentMJBgType();
    imgNode.setPosition(offSets[off][0], offSets[off][1]);
}