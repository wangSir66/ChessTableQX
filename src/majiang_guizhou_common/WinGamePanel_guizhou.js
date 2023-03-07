/***
 * 贵州App，通用小结算文件   对应endOne_maJiang.json
 * @type {void | Class | *}
 */
var EndOneView_guizhou = EndOneView.extend({
    _showCard: [[], [], [], []],
    jsBind:{
        back:{
            btn_showTable:{
                _click: function(){
                    MjClient.endoneui.btnTableEvent();
                }
            }
        }
    },
    ctor: function(){
        this._super();
        MjClient.endoneui = this;
        this.changeAllPlayerAtlasScore();

        UIEventBind(null, this, "mjhand", function (eD) {
            this.removeFromParent(true);
        });
    },

    /**
     * 进入小结算界面再更改每个玩家牌桌内的游戏得分
     */
    changeAllPlayerAtlasScore: function () {
        var maxPlayer = MjClient.playui.getMaxPlayer();
        for (var i = 0; i < maxPlayer; i++) {
            var node = MjClient.playui.getNodeByOff(i);
            var atlasScore = node.getChildByName("layout_head").getChildByName("atlas_score");
            var player = MjClient.playui.getPlayerInfoByOff(i);
            changeAtalsForLabel(atlasScore, player.winall);
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
    initLayoutInfo: function(back, maxPlayer){
        var imgInfo = back.getChildByName("img_info");
        var imgItemBg = imgInfo.getChildByName("layout_infoData").getChildByName("img_bg1");
        var height = imgItemBg.height;
        imgInfo.visible = false;
        for (var i = 0; i < maxPlayer; i++) {
            var cloneInfoImg = imgInfo.clone();
            this.setCloneImgTexture(imgInfo, cloneInfoImg);
            back.addChild(cloneInfoImg);
            var itemY = imgInfo.y - (height * i);
            cloneInfoImg.setPositionY(itemY);
            this.setEndOneUserUI(cloneInfoImg, i);
        }
    },
    // 设置单个玩家面板数据
    setEndOneUserUI: function(infoImg, off){
        var sData = MjClient.data.sData;
        var tData = sData.tData;
        var pl = MjClient.getPlayerByIndex(off);
        if(!pl)return;
        infoImg.setVisible(true);
        infoImg = infoImg.getChildByName("layout_infoData");

        var img_zhuang = infoImg.getChildByName("img_zhuang");
        var zhuangIndex = (typeof MjClient.preZhuang != 'undefined') ? MjClient.preZhuang : tData.zhuang;
        img_zhuang.setVisible(tData.uids[zhuangIndex] === pl.info.uid);
        img_zhuang.zIndex=10;
        var uibind= {
            layout_infoData: {
                _touch: function(sender, type){
                    if(type === 2){
                        MjClient.endoneui.switchViewForEveryOne(this, off);
                    }
                },
                text_name: {
                    _run:function(){
                        this.ignoreContentAdaptWithSize(true);
                    },
                    _text: function () {
                        var _nameStr = unescape(pl.info.nickname ) + "";
                        return getNewName (_nameStr);
                    }
                },
                text_id: {
                    _run:function(){
                        this.ignoreContentAdaptWithSize(true);
                    },
                    _text: function () {
                        return "ID:" + pl.info.uid.toString();
                    }
                },
                img_eatFrontCard: {_visible: false},
                img_eatBackCard: {_visible: false},
                img_handCard: {_visible: false},
                img_chickenCard: {_visible: false},
                text_cardType: {
                    _run:function(){
                        this.ignoreContentAdaptWithSize(true);
                        if(pl.mjdesc && pl.mjdesc.length > 9){
                            this.setFontSize(17);
                        }
                    },
                    _text: function () {
                        return pl.mjdesc + "";
                    },
                },
                img_tingIcon:{
                    _run: function(){
                        var tingSet = MjClient.majiang.calTingSet(pl.mjhand, null, pl);
                        if(!!tingSet && Object.keys(tingSet).length > 0){
                            this.loadTexture("gameOver/Account_little/icon_tingpai.png");
                        }else{
                            this.loadTexture("gameOver/Account_little/icon_weitingpai.png");
                        }

                        this.visible = true;
                        if(pl.winType > 0){
                            this.visible = false;
                        }
                    }
                },
                text_winNum: {
                    _run: function(){
                        var color = Number(pl.winone) > 0 ? cc.color("#DB3711") : cc.color("#16822b");
                        this.setColor(color);
                    },
                    _text: function () {
                        var pre = "";
                        if (pl.winone > 0) pre = "+";
                        return pre + pl.winone;
                    }
                },
                img_huType: {
                    _run: function () {
                        setGameOverPanelPlayerState(this, pl, true);
                    }
                },
                text_info:{
                    _visible: false,
                    _text:function () {
                        if(!pl.mjdesc1) pl.mjdesc1 = [];

                        return pl.mjdesc1.length > 0 ? pl.mjdesc1 + "" : pl.mjdesc + "";
                    }
                }
            }
        };
        BindUiAndLogic(infoImg.parent,uibind);
        this.addWxHeadToEndUI(infoImg.getChildByName("img_head"), off);
        this.showHandCard(pl, infoImg, off);
        this.showChickenCards(infoImg, off);
        MjClient.playui.setUserOfflineInWinGame(infoImg.getChildByName("img_head"), pl);
    },
    switchViewForEveryOne: function(infoImg, off){
        var textInfo = infoImg.getChildByName("text_info");
        var textCardType = infoImg.getChildByName("text_cardType");
        textInfo.setVisible(!textInfo.isVisible());
        textCardType.setVisible(!textInfo.isVisible());
        this.switchCardStation(!textInfo.isVisible(), off);
    },
    // 显示手牌内容
    showHandCard: function(pl, infoImg, off){
        var arry = this.createEndSortCardArr(pl, infoImg);
        if(!arry) return this.removeFromParent(true);
        var posx = 0;
        var gangNum = 0; // 杠要叠牌
        for (var i = 0; i < arry.length; i++) {
            if(arry[i] === 1){
                posx += 8;
                continue;
            }

            if(!arry[i]){
                MjClient.showToast("报错了！！！");
                continue;
            }


            arry[i].visible = true;
            arry[i].enabled = false;
            arry[i].setScale(arry[i].getScale());
            if(arry[i].name === "anGang" || arry[i].name === "mingGang"){
                gangNum++;
                if(gangNum % 3 === 0 && gangNum !== 0){
                    posx -= arry[i].width * arry[i].getScale();
                    arry[i].y += 8;
                }else if(gangNum === 4){
                    gangNum = 0;
                }
            }else{
                gangNum = 0;
            }
            arry[i].x += posx;
            posx += arry[i].width * arry[i].getScale();

            this._showCard[off].push(arry[i]);
        }
    },
    switchCardStation: function(showStation, off){
        var cardArray = this._showCard[off];
        var cardLen = cardArray.length;
        for(var i = 0; i < cardLen; i ++){
            if(cc.sys.isObjectValid(cardArray[i])){
                cardArray[i].setVisible(showStation);
            }
        }
    },
    showChickenCards: function(infoImg, off){

        var pl = MjClient.getPlayerByIndex(off);
        if(!pl) return;

        var jiCards = pl.jiCards;
        var chickenCard = infoImg.getChildByName("img_chickenCard");
        var startX = chickenCard.x;
        var startY = chickenCard.y;
        var width = chickenCard.width * chickenCard.scale + 30;
        var jiCardNodeArr = [];
        for(var key in jiCards){
            var cards = jiCards[key];
            var cardInfo = cards[0] == 1000 ? 91 : cards[0];    // 当前鸡麻将的值
            var cardNum = cards[1];                               // 当前鸡麻将的张数
            var isJinJi = cards[2];                              // 当前麻将是否金鸡  0:No, 1:Yes
            if(cardInfo == 0 || cardInfo > 1000) continue;
            var cardNode = MjClient.playui.createCard(infoImg, MjClient.playui.CsdDefaultCardType.EatCardFront, MjClient.playui.HandleCardType.Chi, cardInfo, true);
            var numText = new ccui.Text(cardNum, "chicken", 55);
            cardNode.addChild(numText);
            numText.setColor(cc.color("#904722"));
            numText.setFontName(MjClient.fzcyfont);
            numText.setAnchorPoint(cc.p(0, 0));
            numText.setPosition(cardNode.width + 10, cardNode.height - 55);
            jiCardNodeArr.push(cardNode);
            // 星期鸡先按照白板处理
            if(key == "weekji" && cardInfo == 91){
                var cardImg = cardNode.getChildByName("cardImg");
                cardImg.loadTexture("gameOver/Account_little/xing.png");
            }

            if(key == "huanleji" && cardInfo == 91){
                var cardImg = cardNode.getChildByName("cardImg");
                cardImg.loadTexture("gameOver/Account_little/huan.png");
            }

            if(isJinJi && cardNode){
                cardNode.setColor(cc.color(255, 215, 0));
            }

            if(cardNode) this._showCard[off].push(cardNode);
        }

        for(var i = 0; i < jiCardNodeArr.length; i ++){
            var cd = jiCardNodeArr[i];
            cd.visible = true;
            cd.enabled = false;
            cd.y = startY;
            cd.x = startX + width * i;
        }
    },
    // 显示抓鸟内容
    showAddBird:function(back, tData) {
        //显示抓鸟的牌
        var img_bridTips = back.getChildByName("img_bridTips");
        var cards = tData.mopai;
        if (!cards) {
            cards = tData.showFanJiCards;
        }
        var cardnode = img_bridTips.getChildByName(MjClient.playui.CsdDefaultCardType["EatCardFront"]);
        var countNode = img_bridTips.getChildByName("text_count");
        cardnode.visible = false;
        countNode.visible = false;
        var slotwith = cardnode.width * cardnode.scale;//0.05;

        for (var i = 0; i < cards.length; i++) {
            var _node = util.clone(cardnode);
            _node.setName(MjClient.playui.HandleCardType["Chi"]);
            _node.visible = true;
            _node.setPosition(cc.p(cardnode.x + slotwith * i, cardnode.y));
            img_bridTips.addChild(_node);
            MjClient.playui.setCardSprite(_node, cards[i]);

            // 调整小结算，鸡牌贴图位置
            var cardImg = _node.getChildByName("cardImg");
            if(cardImg){
                cardImg.setPosition(_node.width/2, _node.height/1.7);
            }
        }
    },
    // 加载微信头像
    addWxHeadToEndUI:function(node,off) {
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
    //没有抓鸟
    isZhongNiao:function(){
        return false;
    },

    showTileType:function(title,pl){
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
            else if(this.isRealHuangZhuang(tData)){
                title.loadTexture("gameOver/Account_little/title_huangzhuang.png");
            }
            else{
                title.loadTexture("gameOver/Account_little/title_pingju.png");
            }
        }
    },


    isRealHuangZhuang: function(tData){
        return tData.winner === -1;
    },
});
