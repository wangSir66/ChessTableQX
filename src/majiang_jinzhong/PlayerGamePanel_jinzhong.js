/**
 * Created by sking on 2019/3/4.
 */

var PlayLayer_jinzhong = PlayLayer.extend({
    jsBind: {
        roundnumImg: {
            roundnumAtlas: {
            }
        },
        cardNumImg: {
            cardnumAtlas: {
            }
        },
        back: {
            back: {
            },
            LeftBottom:{
            },
            RightBottom:{
            },
            RightTop:{
            },
            leftTop:{
            }
        },
        info:
            {
            },
        gameName:{
        },
        roundInfo:{
        },
        banner: {
            bg_time:{
            },
            wifi: {
            },
            powerBar: {

            },
            tableid: {
            },
            setting: {

            },
            Button_1: {

            },
            hunPai:{
                baidaBg:{
                },
                baidaText: {
                },
            },
        },
        BtnPutCard:{ //add by  sking for put card button
        },//end of add by sking
        eat: {
            chi0: {
                bg_img:{
                },
                bgimg: {

                },
                bgground: {

                },
                card1: {},
                card2: {},
                card3: {}
            },
            chi1: {
            },
            chi2: {
            },
            ting: {
                bg_img:{
                },
            },
            noTing : {
            },
            peng: {
                bg_img:{
                },
                bgimg: {
                }
            },
            gang0: {
                bg_img:{
                },
                card1: {},
                bgimg: {
                },
                bgground: {

                }
            },
            gang1: {
                card: {},
            },
            gang2: {
                card: {},
            },
            guo: {
                bgimg: {
                }
            },
            hu: {
                bg_img:{
                },
                bgimg: {
                }
            },
            cancel: {
            },
            changeui: {
                changeuibg: {
                    guobg: {
                        guo: {
                        },
                        fanhui: {
                        }
                    }

                }
            },
        },
        chat_btn: {
        },
        voice_btn: {
        },
        gps_btn: {
        },
        hua_btn: {
        },
        block_tuoguan:{
        }
    },
    onExit:function()
    {
        this._super();
    },
    initLoadJsonFile:function(){
        this._super();
        var playui = ccs.load(res.Play_jinzhong_json);
        this.addChild(playui.node);
        BindUiAndLogic(playui.node, this.jsBind);
        return playui.node;
    },
    /**
     * 移动一张麻将时，移动距离多远麻将才开始移动
     * @returns {boolean}
     */
    cardMoveDistance:function()
    {
        var standUI = getNode(0).getChildByName("stand");
        var _standHeight = standUI.getContentSize().height;
        var pos = MjClient.movingCard.getTouchMovePosition();
        if( pos.y - cardBeginPos.y > _standHeight/2)
        {
            return true;
        }
        return false;
    },
    registerTouchCardHandler:function(btn, tp)
    {
        this._super(btn, tp);
        switch (tp)
        {
            case ccui.Widget.TOUCH_BEGAN:
                cc.log("================TOUCH_BEGAN ======");
                break;
            case ccui.Widget.TOUCH_MOVED:
                cc.log("================TOUCH_MOVED ======");
                break;
            case ccui.Widget.TOUCH_ENDED:
            case ccui.Widget.TOUCH_CANCELED:
                cc.log("===TOUCH_ENDED TOUCH_CANCELED ======");
                break;
            default:
                break;
        }
    },
    /**
     * 在这些情况下不能出牌，简化addTouchEventListener里面的判断，增强代码可读性
     * @param cardui
     * @param btn
     * @returns {boolean} 返回false 表示不能出牌
     */
    isCanTouch:function(cardui,btn,touchType)
    {
        var _canTouch = this._super(cardui,btn,touchType);
        /****有需要请添加****/
        //todo...

        return _canTouch;
    },
    InitUserHandUI:function(node, off)
    {
        this._super(node, off);
    },

    showPlayerInfo:function(off, node)
    {
        var pl = getUIPlayer(off);
        if(pl)
        {
            MjClient.showPlayerInfoPlaying(pl.info);
        }
    },
    /*
     听牌之后，还可以显示张数（晋中麻将玩法,除乡宁摔金）
     */
    setTingCards:function(node, tingSet)
    {
        if (!tingSet) {
            return;
        }

        node.zIndex = 500;
        node.visible = true;

        var cardNode0 = node.getChildByName("showNode");
        cardNode0.setVisible(false);
        var BindingNode = node.getChildByName("cardNodeList");
        BindingNode.removeAllChildren(true);

        var i = 0;
        var j = 0;//高
        var bHaveValue = false;

        var width = cardNode0.getContentSize().width * 0.28 * 2 - 5;
        var height = cardNode0.getContentSize().height * 0.28 + 5;

        for (var cd in tingSet)
        {
            var cardNode = cardNode0.clone();
            cardNode.visible = true;
            bHaveValue = true;
            if(i == 7)
            {
                j++;
                i = 0;
            }
            cardNode.setPositionX(cardNode0.getContentSize().width * 0.28 / 2 + i * width);
            cardNode.setPositionY(cardNode0.getContentSize().height * 0.28 / 2 + j * height);
            BindingNode.addChild(cardNode);
            setCardSprite(cardNode, parseInt(cd), 0);
            i++;

            var _countNode = new ccui.Text();
            if(MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP || MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ ) {//岳阳同一使用方正兰亭
                _countNode.setFontName("fonts/lanting.TTF");
            }else{
                _countNode.setFontName(MjClient.fzcyfont);
            }
            _countNode.setPosition(cc.p(cardNode.getContentSize().width * 1.3, cardNode.getContentSize().height/2 + 45));
            var icount = getHuCardNum(parseInt(cd));
            _countNode.setString(icount + "");
            _countNode.setFontSize(20);
            _countNode.setScale(3.5);
            _countNode.setColor(cc.color(19,238,96));
            cardNode.addChild(_countNode);

            var _zhangNode = new ccui.Text();
            if(MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP || MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ ) {//岳阳同一使用方正兰亭
                _zhangNode.setFontName("fonts/lanting.TTF");
            }else{
                _zhangNode.setFontName(MjClient.fzcyfont);
            }
            _zhangNode.setPosition(cc.p(cardNode.getContentSize().width * 1.3, cardNode.getContentSize().height/2 - 35));
            _zhangNode.setString("张");
            _zhangNode.setFontSize(18);
            _zhangNode.setScale(3.5);
            _zhangNode.setColor(cc.color(255,220,74));
            cardNode.addChild(_zhangNode);

            if(MjClient.data.sData.tData.areaSelectMode["is68"] && MjClient.data.sData.tData.uids.length == 2)
            {
                _countNode.visible = false;
                _zhangNode.visible = false;
            }
        }

        if (j >= 1) i = 7;
        // 容器大小设置
        var tingCardsWidth = i * width;
        var tingCardsHeight = (j + 1) * height;
        BindingNode.setContentSize(tingCardsWidth, height);

        var showBtn = node.getChildByName("showBtn");
        if (showBtn) {
            showBtn.removeFromParent();
            showBtn = null;
        }
        if (j >= 1) {
            var showAll = false;
            // 添加显示隐藏按钮
            showBtn = new ccui.Button();
            showBtn.loadTextureNormal("png/show_up.png");
            showBtn.setAnchorPoint(0.5, 0.5);
            showBtn.setName("showBtn");
            showBtn.setPosition(cc.p(45 + tingCardsWidth + showBtn.getContentSize().width/2, 25));
            node.addChild(showBtn);
            showBtn.addTouchEventListener(function(sender, Type) {
                switch (Type) {
                    case ccui.Widget.TOUCH_ENDED:
                        if (showAll) {
                            showAll = false;
                            BindingNode.height = height;
                            node.height = height;
                            showBtn.loadTextureNormal("png/show_up.png");
                        }
                        else {
                            showAll = true;
                            BindingNode.height = tingCardsHeight;
                            node.height = tingCardsHeight;
                            showBtn.loadTextureNormal("png/show_down.png");
                        }
                        break;
                    default:
                        break;
                }
            }, this);
        }

        // node 节点大小设置
        var nodeWidth = 45 + tingCardsWidth;
        if (showBtn) {
            nodeWidth = 45 + tingCardsWidth + showBtn.getContentSize().width + 10;
        }
        node.setContentSize(nodeWidth, height);

        var pl = getUIPlayer(0);
        var _gameName = node.getChildByName("gamePlayTip");
        if (_gameName) {
            _gameName.removeFromParent();
            _gameName = null;
        }
        if (pl.isTing) {
            _gameName = new cc.LabelTTF("听牌自动摸打...",MjClient.fzcyfont,25);
            _gameName.setFontSize(_gameName.getFontSize());
            _gameName.setName("gamePlayTip");
            _gameName.setColor(cc.color(255,220,74));
            _gameName.setAnchorPoint(0,0.5);
            _gameName.setPosition(nodeWidth, 25);
            node.addChild(_gameName);
        }

        //如果没有值则隐藏
        if (!bHaveValue) {
            node.visible = false;
        }
    },

    /**
     *这张牌，外面还剩几张可以胡
     * @param card
     * @returns {number} 返回张数,一般麻将 count <= 4
     */
    getHuCardNum:function(card){
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

            //别家听牌时打出去的牌会盖住，要把减掉的一张加回来，晋中麻将特有的
            if(off != 0
                && pl.putCardAfterTing >= 0
                && pl.mjput[pl.putCardAfterTing] == card
            )
            {
                icount += 1;
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
    },
    /**
     * 添加混牌，癞子牌...
     * @param cardNode 当前麻将的节点
     * @param off  并非方位的off 而是对应的图片
     */
    setCardSpriteHunCard:function(cardNode,off)
    {
        //todo...晋中麻将没有癞子麻将
    },
    /**
     * 根据麻将背景的类型，对应的调整贴图的位置
     * @param cardNode 当前麻将的节点
     * @param off 并非方位的off 而是对应的图片
     */
    resetCardSpriteWithMJBgType:function(cardNode,off)
    {
        var x0 = cardNode.getSize().width * 0.5;
        var y0 = cardNode.getSize().height * 0.42;
        var y1 = cardNode.getSize().height * 0.63;
        var offSets = [[x0, y1], [x0, y1], [x0, y1], [x0, y1], [x0, y0], [x0, 65], [x0, 25]];

        var MJBgType = getCurrentMJBgType();
        var imgNode = cardNode.getChildByName("imgNode");
        imgNode.setPosition(offSets[off][0], offSets[off][1]);
        if (MJBgType != 0) { // 左右两侧的牌偏大，特殊处理，缩小
            if (off == 1 || off == 3) {
                imgNode.setScale(0.8);
            }
        }

        if (off == 6) imgNode.setScale(0.45);

        //todo...
        cardNode.off = off;
        this.setMJDif(cardNode,off);

        // //山西百搭命名的种类，根据麻将种类调整位置
        // var baidaNameArray = ["haozi","lizi","imgBaiDa","wangzi"];
        // var childs = cardNode.children;
        // var pos = {};
        // pos = [{x:0.6, y:0.68}, {x:0.45, y:0.60}, {x:0.6, y:0.68}, {x:0.55, y:0.60}, {x:0.56, y:0.49}]; // {x:0.5, y:0.43}
        // for(var i = 0; i < childs.length; i++)
        // {
        //     if(baidaNameArray.indexOf(childs[i].getName()) >= 0)
        //     {
        //         childs[i].ignoreContentAdaptWithSize(true);
        //         childs[i].setPositionPercent(pos[off]);
        //     }
        // }
    },
    /**
     * 麻将的贴图的位置调整
     * @param node
     * @param MJpic
     */
    setMJDif:function(node,MJpic)
    {
        var imgNode = node.getChildByName("imgNode");
        if(imgNode)
        {
            imgNode.standScale = 1;
            if(COMMON_UI3D.is3DUI()) // 3D 麻将贴图调整
            {
                imgNode.setScale(imgNode.standScale * 1.26);
            }
            else // 2D 麻将资源调整
            {
                if(node.name === "showNode" || node.name === "baidaImg")   // 已听小牌和百搭牌，纹理还原
                {
                    imgNode.setScale(1);
                }

                if(node.name === "mjhand")
                {
                    imgNode.setScale(imgNode.standScale * 0.98);
                }
                else if(node.name === "out" || node.name === "newout" )
                {
                    imgNode.setScale(imgNode.standScale * 0.9);
                }
                else if(node.name === "showNode")
                {
                    imgNode.setScale(imgNode.standScale * 1.2);
                }
            }

            if(node.name === "mjhand" || node.name === "baidaImg")
            {
                var pos = {x: 0.5, y: 0.44};
                imgNode.setPositionPercent(pos);
            }
            else if(node.name === "out" || node.name === "newout")
            {
                var py = 0.61;
                if(MJpic == 1 || MJpic == 3) //麻将贴图类型
                {
                    py = 0.68;
                }
                if(MJpic || MJpic == 0)
                {
                    var pos = {x: 0.48, y: py};
                    imgNode.setPositionPercent(pos);
                }
            }

            // 麻将在空中的状态特殊处理, mjhand在空中isOuting是true, 所以分开写   —— by Tom
            if(node.isOuting)
            {
                var pos = {x: 0.5, y: 0.63};
                imgNode.setPositionPercent(pos);
            }
        }
    },

    /************************事件回调函数*************************/
    callBack_MJPut:function() {
        this._super();
        cc.log("玩法:" + GameCnName[MjClient.gameType] + "######################事件：" + "MJPut");
    },
    callBack_roundEnd:function() {
        this._super();
        cc.log("玩法:" + GameCnName[MjClient.gameType] + "######################事件：" + "roundEnd");
        var self = MjClient.backNode;
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
            self.addChild(new EndOneView_jinzhong(),500);
        }
        if(MjClient.rePlayVideo === -1)    // 正常游戏
        {
            self.runAction(cc.sequence(cc.delayTime(0.1),cc.callFunc(COMMON_UI.showMjhandBeforeEndOne),cc.delayTime(1.7),cc.callFunc(delayExe)));
        }
        else
        {
            self.runAction(cc.sequence(cc.DelayTime(0.2),cc.callFunc(delayExe)));
        }
    },
    callBack_mjhand:function() {
        this._super();
        cc.log("玩法:" + GameCnName[MjClient.gameType] + "######################事件：" + "mjhand");
    },
    callBack_LeaveGame:function() {
        this._super();
        cc.log("玩法:" + GameCnName[MjClient.gameType] + "######################事件：" + "LeaveGa");
    },
    callBack_endRoom:function() {
        this._super();
        cc.log("玩法:" + GameCnName[MjClient.gameType] + "######################事件：" + "endRoom");
    },
    callBack_clearCardUI:function() {
        this._super();
        cc.log("玩法:" + GameCnName[MjClient.gameType] + "######################事件：" + "clearCardUI");
    },
    callBack_DelRoom:function() {
        this._super();
        cc.log("玩法:" + GameCnName[MjClient.gameType] + "######################事件：" + "DelRoom");
    },
    callBack_MJPass:function() {
        this._super();
        cc.log("玩法:" + GameCnName[MjClient.gameType] + "######################事件：" + "MJPass");
    },
    callBack_MJPeng:function() {
        this._super();
        cc.log("玩法:" + GameCnName[MjClient.gameType] + "######################事件：" + "MJPeng");
    },
    callBack_MJChi:function() {
        this._super();
        cc.log("玩法:" + GameCnName[MjClient.gameType] + "######################事件：" + "MJChi");
    },
    callBack_MJGang:function() {
        this._super();
        cc.log("玩法:" + GameCnName[MjClient.gameType] + "######################事件：" + "MJGang");
    },
    callBack_MJTing:function() {
        this._super();
        cc.log("玩法:" + GameCnName[MjClient.gameType] + "######################事件：" + "MJTing");
    },
    callBack_waitPut:function() {
        this._super();
        cc.log("玩法:" + GameCnName[MjClient.gameType] + "######################事件：" + "waitPut");

        cc.log("*********自动出牌*********");
        function putTheCard() {
            var downNode = MjClient.playui._downNode;
            var standUI = downNode.getChildByName("stand");
            var children = downNode.children;
            for(var i = 0; i < children.length; i++) {
                if(children[i].name == "mjhand") {
                    if(children[i].y > standUI.y + 10) {
                        PutOutCard(children[i], children[i].tag); //可以出牌
                        break;
                    }
                }
            }
        }

        var pl = getUIPlayer(0);
        var eat = MjClient.playui.jsBind.eat;
        if (IsTurnToMe() && pl.isTing && !eat.hu._node.visible && !eat.gang0._node.visible && !eat.gang1._node.visible && !eat.gang2._node.visible)
        {
            this.runAction(cc.sequence(cc.delayTime(0.5),
                cc.callFunc(putTheCard)));
        }
    },
    callBack_onlinePlayer:function() {
        this._super();
        cc.log("玩法:" + GameCnName[MjClient.gameType] + "######################事件：" + "onlinePlayer");
    },
    callBack_initSceneData:function() {
        this._super();
        cc.log("玩法:" + GameCnName[MjClient.gameType] + "######################事件：" + "initSceneData");
    },
    callBack_moveHead:function() {
        this._super();
        cc.log("玩法:" + GameCnName[MjClient.gameType] + "######################事件：" + "moveHead");
    }
    /*********************end of 事件回调函数******************************/

});

