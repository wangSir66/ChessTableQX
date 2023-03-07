/***
 * 闷胡血流小结算, 该界面父节点是endone
 * @type {void | Class | *}
 */
var EndOneView_menHuXueLiu = cc.Layer.extend({

    SCORE_TYPE: {
        noType     : -1,
        menZiMo    : 0,
        menJiePao  : 1,
        menDianPao : 2,


        ziMo         : 10,
        jiePao       : 11,
        dianPao      : 12,
        gangKai      : 13,
        qiangGang    : 14,
        qiangGangNeg : 15,

        ting         : 17,
        shaTing      : 18,
        lianZhuang   : 19,
        lianZhuangNeg: 20,
        rePao        : 21,
        rePaoNeg     : 22,

        zhuanWanDou  : 30,
        menDou       : 31,
        dianDou      : 32,
        jieDou       : 33,

        baoJi        : 40,
        baoJiNeg     : 41,
        zeRenJi      : 42,   // + 责任鸡
        zeRenJiNeg   : 43,   // - 责任鸡

    },

    scoreInfoObj: [],
    showType: 0,   // 0 score  1 card
    jsonFile: "endOne_menHuXueLiu.json",
    bgWinUrl: "gameOver/Account_little/menhu/bg_win.png",
    bgLoseUrl: "gameOver/Account_little/menhu/bg_lose.png",
    btnShowAccountURL: "gameOver/Account_little/menhu/btn_showAccount.png",
    btnCardDetailURL: "gameOver/Account_little/menhu/btn_cardDetail.png",
    jsBind:{
        block: {
            _layout: [[1, 1], [0.5, 0.5], [0, 0], true]
        },
        back:{
            _layout: [[1, 1], [0.5, 0.5], [0, 0]],
            img_title: {
                _run: function () {
                    var player = MjClient.playui.getPlayerInfoByOff();
                    MjClient.endoneui.showEndOneTitle(this, player);
                }
            },
            btn_close:{
                _visible: false
            },
            text_info: {
                _text: function () {
                    return getPlayingRoomInfo(5);
                }
            },
            text_time:{
                _text:function(){
                    return MjClient.roundEndTime + "";
                }
            },
            btn_cardDetail:{
                _event:{
                    switchPanel: function (showType) {
                        this.loadTextureNormal(showType === 1 ? MjClient.endoneui.btnShowAccountURL : MjClient.endoneui.btnCardDetailURL);
                    }
                },
                _click: function(){
                    var showType = MjClient.endoneui.showType;
                    showType += 1;
                    if(showType === 2){
                        showType = 0;
                    }
                    MjClient.endoneui.showType = showType;
                    postEvent("switchPanel", showType);
                }
            },
            btn_continue: {
                _click: function () {
                    MjClient.endoneui.btnReadyEvent();
                }
            },
            btn_showTable:{
                _click: function(){
                    MjClient.endoneui.btnTableEvent();
                }
            },
            img_chickenTips:{
                _run: function () {
                    MjClient.endoneui.showChickenInfo(this);
                }
            },
            text_roomInfo:{
                _text: function () {
                    return MjClient.playui.getGameDesc();
                }
            },
            panel_score:{
                _visible: true,
                _event:{
                    switchPanel: function (type) {
                        this.setVisible(type === 0);
                    }
                },
                _run: function () {
                    MjClient.endoneui.showScoreInfo(this);
                }
            },
            panel_card:{
                _visible: false,
                _event:{
                    switchPanel: function (type) {
                        this.setVisible(type === 1);
                    }
                },
                _run: function () {
                    MjClient.endoneui.showCardInfo(this);
                }
            },
        }
    },


    ctor:function () {
        this._super();
        var endNode = ccs.load(this.jsonFile).node;
        MjClient.endoneui = this;
        this.addChild(endNode);
        BindUiAndLogic(endNode, this.jsBind);
        return true;
    },

    getEndOneInfoImageURL: function(type){
        var originUrl = "gameOver/Account_little/menhu/";
        var SCORE_TYPE = this.SCORE_TYPE;
        var IMAGE_URL = {};
        IMAGE_URL[SCORE_TYPE.menZiMo]      = originUrl + "menzimo.png";
        IMAGE_URL[SCORE_TYPE.menJiePao]    = originUrl + "menjiepao.png";
        IMAGE_URL[SCORE_TYPE.menDianPao]   = originUrl + "mendianpao.png";

        IMAGE_URL[SCORE_TYPE.ziMo]         = originUrl + "zimo.png";
        IMAGE_URL[SCORE_TYPE.jiePao]       = originUrl + "jiepao.png";
        IMAGE_URL[SCORE_TYPE.dianPao]      = originUrl + "dianpao.png";
        IMAGE_URL[SCORE_TYPE.gangKai]      = originUrl + "gangkai.png";
        IMAGE_URL[SCORE_TYPE.qiangGang]    = originUrl + "qianggang.png";
        IMAGE_URL[SCORE_TYPE.qiangGangNeg] = originUrl + "qianggangNeg.png";

        IMAGE_URL[SCORE_TYPE.ting]          = originUrl + "ting.png";
        IMAGE_URL[SCORE_TYPE.shaTing]       = originUrl + "shating.png";
        IMAGE_URL[SCORE_TYPE.lianZhuang]    = originUrl + "lianzhuang.png";
        IMAGE_URL[SCORE_TYPE.lianZhuangNeg] = originUrl + "lianZhuangNeg.png";
        IMAGE_URL[SCORE_TYPE.rePao]         = originUrl + "repao.png";
        IMAGE_URL[SCORE_TYPE.rePaoNeg]      = originUrl + "repaoNeg.png";

        IMAGE_URL[SCORE_TYPE.zhuanWanDou] = originUrl + "zhuanwandou.png";
        IMAGE_URL[SCORE_TYPE.menDou]      = originUrl + "jiedou.png";
        IMAGE_URL[SCORE_TYPE.dianDou]     = originUrl + "diandou.png";
        IMAGE_URL[SCORE_TYPE.jieDou]      = originUrl + "jiedou.png";

        IMAGE_URL[SCORE_TYPE.baoJi]       = originUrl + "baoji.png";
        IMAGE_URL[SCORE_TYPE.baoJiNeg]    = originUrl + "baojiNeg.png";
        IMAGE_URL[SCORE_TYPE.zeRenJi]     = originUrl + "zerenji.png";
        IMAGE_URL[SCORE_TYPE.zeRenJiNeg]  = originUrl + "zerenjiNeg.png";

        return IMAGE_URL[type];
    },


    showEndOneTitle:function(title, pl){
        if(pl.winone > 0){ // 胜利
            title.loadTexture("gameOver/Account_little/title_win.png");
        }else if(pl.winone < 0){ // 败了
            title.loadTexture("gameOver/Account_little/title_lose.png");
        }else{
            var sData = MjClient.data.sData;
            var tData = sData.tData;
            if (MjClient.isDismiss){
                title.loadTexture("gameOver/Account_little/title_jiesan.png");
            }
            else if(tData.winner === -1){
                title.loadTexture("gameOver/Account_little/title_huangzhuang.png");
            }
            else{
                title.loadTexture("gameOver/Account_little/title_pingju.png");
            }
        }
    },

    btnReadyEvent: function(){
        postEvent("clearCardUI");
        MjClient.endoneui.removeFromParent(true);
        MjClient.endoneui = null;
        if (MjClient.rePlayVideo >= 0 && MjClient.replayui) {
            MjClient.replayui.replayEnd();
        } else {
            MjClient.playui.sendPassToServer();
        }
        if (MjClient.endallui){
            MjClient.endallui.setVisible(true);
        }

        if(MjClient.playui) {
            MjClient.playui.hideEatNodeChildren();
            var playerNodeArr = MjClient.playui.playerNodeArr;
            for (var k = 0; k < playerNodeArr.length; k++) {
                MjClient.playui.removeAllCards(playerNodeArr[k]);
            }

            MjClient.playui.resetPlayerHeadLayout();
        }
    },

    btnTableEvent: function(){
        if(cc.sys.isObjectValid(MjClient.endoneui)){
            MjClient.endoneui.setVisible(false);
        }
        if(cc.sys.isObjectValid(MjClient.endallui)){
            MjClient.endallui.setVisible(false);
        }
        if(cc.sys.isObjectValid(MjClient.playui)){
            MjClient.playui.showTableLayer();
        }
    },

    // 展示计分详情界面
    showScoreInfo: function(infoListView){
        var sData = MjClient.data.sData;
        var players = sData.players;
        var playerCount = Object.keys(players).length;
        var infoBgSize = infoListView.getCustomSize();
        var info = infoListView.getChildByName("panel_scoreInfoItem");
        info.visible = false;
        infoListView.width = info.width * playerCount;
        infoListView.setScrollBarEnabled(false);
        var sw = MjClient.size.width;
        var bgSize = info.getCustomSize();
        var spaceX = bgSize.width * 0.04;
        var startPosX = [0, 0, sw * 0.34, sw * 0.22, sw * 0.12];
        for(var i = 0; i < playerCount; i++){
            var clone = info.clone();
            clone.visible = true;
            clone.setPosition(cc.p(startPosX[playerCount] * 1.7 + i * (bgSize.width + spaceX), infoBgSize.height/2));
            infoListView.pushBackCustomItem(clone);
            MjClient.endoneui.setEveryOneScoreInfo(clone, i);
        }
        infoListView.removeItem(0);
        infoListView.forceDoLayout();
    },

    // 展示手牌详情界面
    showCardInfo: function(panelCard) {
        var sData = MjClient.data.sData;
        var players = sData.players;
        var playerCount = Object.keys(players).length;
        var info = panelCard.getChildByName("layout_cardInfoItem");
        var infoSize = info.getCustomSize();
        info.visible = false;
        var space = infoSize.height * 0.03;
        for (var i = 0; i < playerCount; i++) {
            var clone = info.clone();
            clone.visible = true;
            clone.setPosition(cc.p(0, 400 - i * (infoSize.height + space)));
            panelCard.addChild(clone);
            MjClient.endoneui.setEveryOneCardInfo(clone, i);
        }
    },

    setEveryOneScoreInfo: function(node, off){
        var tData = MjClient.data.sData.tData;
        var player = MjClient.getPlayerByIndex(off);
        if(!player) return node.setVisible(false);

        var uibind = {
            text_name:{
                _run: function () {
                    this.ignoreContentAdaptWithSize(true);
                    this.setString(unescape(player.info.nickname) + "");
                },
            },
            text_zongji:{
                _run: function () {
                    var winall = player.winall ? player.winall : 0;
                    this.ignoreContentAdaptWithSize(true);
                    this.setString("总计: " + winall);
                },
            },
            img_head:{
                _run:function(){
                    MjClient.endoneui.addWxHeadUI(this, off);
                }
            },
            img_zhuang: {
                _run:function(){
                    var zhuangIndex = (typeof MjClient.preZhuang != 'undefined') ? MjClient.preZhuang : tData.zhuang;
                    this.setVisible(tData.uids[zhuangIndex] === player.info.uid);
                },
            },
            text_cardType:{
                _run:function(){
                    this.ignoreContentAdaptWithSize(true);
                    this.setString(player.huDesc ? player.huDesc : "");
                    this.enableShadow(player.winType > 0 ? cc.color("#DA3300") : cc.color("#808080"));
                    this.enableOutline(player.winType > 0 ? cc.color("#DA3300") : cc.color("#808080"));
                }
            },
            text_score: {
                _run:function(){
                    this.ignoreContentAdaptWithSize(true);
                    var textFileName = player.winone >= 0 ? "gameOver/over_add_sub.png" : "gameOver/over_sub_text.png";
                    this.setProperty(player.winone + "", textFileName, 40, 58, "0");
                },
                // 分数加减
                img_icon: {
                    _run : function(){
                        var fileName = player.winone >= 0 ? "gameOver/over_add_icon.png" : "gameOver/over_sub_icon.png";
                        this.loadTexture(fileName);
                    }
                }
            },
        };
        BindUiAndLogic(node, uibind);

        // 更换小结算背景
        if(jsb.fileUtils.isFileExist(this.bgWinUrl) && jsb.fileUtils.isFileExist(this.bgLoseUrl)){
            var imgBg = node.getChildByName("img_bg");
            imgBg.loadTexture(player.winone > 0 ? this.bgWinUrl : this.bgLoseUrl);
        }
        // player.menHuInfo = [
        //     {
        //         "type": 1,
        //         "desc": "平胡",
        //         "score": 2,
        //         "isAlPay": true
        //     },
        //     {
        //         "type": 19,
        //         "desc": "连庄",
        //         "score": 2,
        //         "isAlPay": true
        //     },
        //     {
        //         "type": 18,
        //         "desc": "杀听",
        //         "score": 2,
        //         "isAlPay": true
        //     }
        // ];

        // player.jiInfo = [
        //     {
        //         "card": 1,
        //         "desc": "责任幺鸡",
        //         "score": 155,
        //         "isAlPay": false
        //     },
        //     {
        //         "card": 28,
        //         "desc": "乌骨鸡",
        //         "score": 2,
        //         "isAlPay": false
        //     },
        //     {
        //         "card": 1,
        //         "desc": "星期鸡",
        //         "score": 3,
        //         "isAlPay": false
        //     }
        // ];
        // ];

        var scoreListView = node.getChildByName("listview_score");
        var panelItem = scoreListView.getChildByName("panel_item");
        if(panelItem){
            // 小结算闷胡显示
            for(var i = 0; i < player.menHuInfo.length; i ++){
                var item = panelItem.clone();
                scoreListView.pushBackCustomItem(item);
                var iconType = item.getChildByName("icon_type");
                var textScore = item.getChildByName("text_score");
                var textType = item.getChildByName("text_type");
                textType.setString(player.menHuInfo[i].desc);
                this.setEndOneIconInfo(iconType, player.menHuInfo[i].type);
                this.setEndOneScore(textScore, player.menHuInfo[i].score, player.menHuInfo[i].isAllPay);
            }

            // 小结算豆分显示
            for(var i = 0; i < player.gangInfo.length; i ++){
                var item = panelItem.clone();
                scoreListView.pushBackCustomItem(item);
                var iconType = item.getChildByName("icon_type");
                var textScore = item.getChildByName("text_score");
                var textType = item.getChildByName("text_type");
                textType.setString(player.gangInfo[i].desc);
                this.setEndOneIconInfo(iconType, player.gangInfo[i].type);
                this.setEndOneScore(textScore, player.gangInfo[i].score, player.gangInfo[i].isAllPay);
            }

            // 小结算鸡牌显示
            for(var i = 0; i < player.jiInfo.length; i ++){
                var item = panelItem.clone();
                scoreListView.pushBackCustomItem(item);
                var iconType = item.getChildByName("icon_type");
                var textScore = item.getChildByName("text_score");
                var textType = item.getChildByName("text_type");
                textType.setString(player.jiInfo[i].desc);
                this.setEndOneJiCardInfo(iconType, player.jiInfo[i]);
                this.setEndOneScore(textScore, player.jiInfo[i].score, player.jiInfo[i].isAllPay);
            }
            scoreListView.removeItem(0);
            scoreListView.forceDoLayout();
        }
    },

    setEndOneScore: function(node, score, isAllPay){
        if(!node) return;
        var num = Number(score);
        num = num === 0 ? "" : (num > 0 ? "+" + num : num);
        node.setString(num.toString());
        node.setColor(isAllPay ? cc.color("#000000") : (Number(score) > 0 ? cc.color("#FF0000") : cc.color("#7CFC00")));
    },


    setEndOneJiCardInfo: function(node, jiInfo){
        var card = jiInfo.card, desc = jiInfo.desc, scoreType = jiInfo.type;
        if(!node || !jiInfo) return;
        node.ignoreContentAdaptWithSize(true);

        if(scoreType === -1){
            var isEndOne = true;
            var cardUrl = "playing/MJ/MJBg2/Mj_up_4.png";
            node.setScale(node.scale * 0.35);
            MjClient.playui.setCardSprite(node, card, isEndOne);
            node.loadTexture(cardUrl);
            if(desc.indexOf("金") > -1){
                node.setColor(cc.color(255, 215, 0));
            }
        }else{
            var iconURL = this.getEndOneInfoImageURL(scoreType);
            if(jsb.fileUtils.isFileExist(iconURL)){
                node.loadTexture(iconURL);
            }
        }
    },


    setEndOneIconInfo: function(node, scoreType){
        if(!node) return;
        var iconURL = this.getEndOneInfoImageURL(scoreType);
        if(jsb.fileUtils.isFileExist(iconURL)){
            node.ignoreContentAdaptWithSize(true);
            node.loadTexture(iconURL);
        }
        if(scoreType === -1){
            node.setVisible(false);
        }
    },

    // 设置牌型详情界面的手牌和闷牌
    setEveryOneCardInfo: function(node, off){
        var tData = MjClient.data.sData.tData;
        var player = MjClient.getPlayerByIndex(off);
        var headNode = node.getChildByName("img_head");
        if(!player) return node.setVisible(false);

        var uibind = {
            text_name:{
                _run: function () {
                    this.ignoreContentAdaptWithSize(true);
                    this.setString(unescape(player.info.nickname) + "");
                },
            },
            text_id:{
                _run: function () {
                    this.ignoreContentAdaptWithSize(true);
                    this.setString("ID:" + player.info.uid.toString());
                },
            },
            img_head:{
                _run:function(){
                    MjClient.endoneui.addWxHeadUI(this, off);
                }
            },
            img_zhuang: {
                _run:function(){
                    var zhuangIndex = (typeof MjClient.preZhuang != 'undefined') ? MjClient.preZhuang : tData.zhuang;
                    this.setVisible(tData.uids[zhuangIndex] === player.info.uid);
                },
            },
            img_eatFrontCard:{
                _visible: false
            },
            img_eatBackCard:{
                _visible: false
            },
            img_handCard:{
                _visible: false
            },
            img_menCard:{
                _visible: false
            },
        };
        BindUiAndLogic(node, uibind);
        this.showEndOneCards(player, node);
        MjClient.playui.setUserOfflineInWinGame(headNode, player);
    },

    // 创建抓鸡的牌
    showChickenInfo:function(tipNode) {
        var tData = MjClient.data.sData.tData;
        var chickenCardStand = tipNode.getChildByName("img_chickenCard");
        var cards = tData.mopai ? tData.mopai : tData.showFanJiCards;
        var slotwith = chickenCardStand.width * chickenCardStand.scale;
        for (var i = 0; i < cards.length; i++) {
            var node = chickenCardStand.clone();
            node.setName(MjClient.playui.HandleCardType["Chi"]);
            node.visible = true;
            node.setPosition(cc.p(chickenCardStand.x + slotwith * i, chickenCardStand.y));
            tipNode.addChild(node);
            MjClient.playui.setCardSprite(node, cards[i]);
            var cardImg = node.getChildByName("cardImg");
            if(cardImg){
                cardImg.setPosition(node.width/2, node.height/1.7);
            }
        }
        if(!cards || cards.length === 0) chickenCardStand.setVisible(false);
    },

    // 加载用户的头像
    addWxHeadUI:function(node, off) {
        var pl = MjClient.getPlayerByIndex(off);
        var img = "png/default_headpic.png";
        if (pl && pl.wxHeadImg) {
            img = pl.wxHeadImg;
            loadWxHead();
        } else { // 回放直接弹总结算 没有缓存头像
            cc.loader.loadImg(pl.info.headimgurl, {isCrossOrigin: true}, function (err, texture) {
                if (!err && texture) {
                    img = texture;
                    loadWxHead();
                }
            });
        }
        function loadWxHead() {
            var sp = new cc.Sprite(img);
            sp.setScale(node.getContentSize().width / sp.getContentSize().width);
            sp.setPosition(node.getContentSize().width / 2, node.getContentSize().height / 2);
            node.addChild(sp);
        }
    },

    // 创建闷胡的牌
    createEndMenHuCardArr: function(pl, infoImg){
        var cardNode, menHuArr = [];
        if(!pl.menHu) return;
        for(var i = 0; i < pl.menHu.length; i ++){
            cardNode = MjClient.playui.createCard(infoImg, MjClient.playui.CsdDefaultCardType.HandCard,
                MjClient.playui.HandleCardType.Hand, pl.menHu[i], true);
            menHuArr.push(cardNode);
        }
        return menHuArr;
    },

    // 展示小结算牌型界面的 手牌和闷牌
    showEndOneCards: function (pl, infoImg) {
        var handArry = this.createEndSortCardArr(pl, infoImg);
        var menHuArry = this.createEndMenHuCardArr(pl, infoImg);

        var menCardStand = infoImg.getChildByName("img_menCard");
        var posx = 0;
        var gangNum = 0; // 杠要叠牌

        // 玩家手牌排列
        for (var i = 0; i < handArry.length; i++) {
            if(handArry[i] === 1){
                posx += 8;
                continue;
            }

            if(!handArry[i]){
                MjClient.showToast("报错了！！！");
                continue;
            }

            handArry[i].visible = true;
            handArry[i].enabled = false;
            handArry[i].setScale(handArry[i].getScale());
            if(handArry[i].name === "anGang" || handArry[i].name === "mingGang"){
                gangNum++;
                if(gangNum % 3 === 0 && gangNum !== 0){
                    posx -= handArry[i].width * handArry[i].getScale();
                    handArry[i].y += 8;
                }else if(gangNum === 4){
                    gangNum = 0;
                }
            }else{
                gangNum = 0;
            }
            handArry[i].x += posx;
            posx += handArry[i].width * handArry[i].getScale();
        }

        // 玩家闷牌排列
        var menStartX = menCardStand.x;
        var menStartY = menCardStand.y;
        var menScale = menCardStand.scale;
        var par = menCardStand.width * menScale;
        for(var j = 0; j < menHuArry.length; j ++){
            var menCard = menHuArry[j];
            if(!menCard) continue;
            menCard.setVisible(true);
            menCard.setTouchEnabled(false);
            menCard.setScale(menScale);
            menCard.setPosition(cc.p(menStartX + j * par, menStartY));
        }
    },

    createEndSortCardArr: function (pl, infoImg) {
        //明杠
        var i, j, cardNode, arry = [];
        for (i = 0; i < pl.mjgang0.length; i++) {
            for (j = 0; j < 4; j++) {
                cardNode = MjClient.playui.createCard(infoImg, MjClient.playui.CsdDefaultCardType.EatCardFront,
                    MjClient.playui.HandleCardType.MingGang, pl.mjgang0[i], true);
                arry.push(cardNode);
            }
            arry.push(1); // 标志多移动一点
        }
        //添加暗杠
        for (i = 0; i < pl.mjgang1.length; i++) {
            for (j = 0; j < 4; j++) {
                // 给牌背
                var handleCardType = j == 2 ? MjClient.playui.CsdDefaultCardType.EatCardBack : MjClient.playui.CsdDefaultCardType.EatCardFront;
                var cardTag = j == 2 ? null : pl.mjgang1[i];
                cardNode = MjClient.playui.createCard(infoImg, handleCardType, MjClient.playui.HandleCardType.AnGang, cardTag, true);
                arry.push(cardNode);
            }
            arry.push(1); // 标志多移动一点
        }
        //添加碰
        for (i = 0; i < pl.mjpeng.length; i++) {
            for (j = 0; j < 3; j++) {
                cardNode= MjClient.playui.createCard(infoImg, MjClient.playui.CsdDefaultCardType.EatCardFront,
                    MjClient.playui.HandleCardType.Peng, pl.mjpeng[i], true);
                arry.push(cardNode);
            }
            arry.push(1); // 标志多移动一点
        }
        //添加吃
        for (i = 0; i < pl.mjchi.length; i++) {
            cardNode = MjClient.playui.createCard(infoImg, MjClient.playui.CsdDefaultCardType.EatCardFront,
                MjClient.playui.HandleCardType.Chi, pl.mjchi[i], true);
            arry.push(cardNode);
            if(i != 0 && (i + 1) % 3 == 0) arry.push(1); // 标志多移动一点
        }
        arry.push(1); // 标志多移动一点


        var sortHandCard = this.getHandSort(pl.mjhand, pl.winType > 0);
        if(!sortHandCard) return MjClient.endoneui.removeFromParent(true);
        //添加手牌
        for (i = 0; i < sortHandCard.length; i++) {
            if(pl.winType > 0 && i == (sortHandCard.length - 1)){
                arry.push(1); // 标志多移动一点
            }
            cardNode = MjClient.playui.createCard(infoImg, MjClient.playui.CsdDefaultCardType.HandCard,
                MjClient.playui.HandleCardType.Hand, sortHandCard[i], true);
            arry.push(cardNode);

        }
        return arry;
    },

    getHandSort: function (handCards, isHu) {
        if(!handCards) return MjClient.endoneui.removeFromParent(true);
        var cardsArr = handCards.slice();
        var hunCard = MjClient.data.sData.tData.hunCard;
        var handArr = [], laiZiArr = [];
        var huCard = isHu ? cardsArr.pop() : 0;
        for(var i = 0;i < cardsArr.length;i++){
            var card = cardsArr[i];
            if(card && MjClient.majiang.isHunCard(card, hunCard)){
                laiZiArr.push(card);
                continue;
            }
            handArr.push(card);
        }
        handArr.sort(function(a, b){
            return a - b;
        });
        var sortArr = [].concat(laiZiArr, handArr);
        if(huCard){
            sortArr.push(huCard);
        }
        return sortArr;
    }
});
