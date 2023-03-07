/*
* @Author: Administrator
* @Date:   2019-03-20 14:15:19
* @Last Modified by:   zzj
* @Last Modified time: 2019-12-23 19:51:10
*/
function addPlayerHandCards_anXiangWeiMaQue(node, off) {
    var card = node.getChildByName("card");
    card.visible = false;
    var pl = MjClient.playui.getUIPlayer(off);
    var cardArr = MjClient.majiang.sortCard(pl.mjhand, 1);
    cc.log("chow", "addPlayerHandCards_anXiangWeiMaQue" + " cardArr = " + JSON.stringify(cardArr));
    for(var i  = 0; i < cardArr.length; i++){
        var lineNode = new cc.Node();
        for(var j = 0; j < cardArr[i].length; j++){
            var cardClone = card.clone();
            cardClone.visible = true;
            cardClone.loadTexture(MjClient.cardPath_YueYangWaiHuZi + "out" + cardArr[i][j] + ".png");
            lineNode.addChild(cardClone);

            cardClone.y = j * cardClone.height * cardClone.scale;
        }
        node.addChild(lineNode);
        if(node.getName() == "leftPanel"){
            lineNode.x = i * card.width * card.scale;
        }else if(node.getName() == "rightPanel"){
            lineNode.x = node.width - i * card.width * card.scale;
        }
    }
}
function addDiPaiCards_anXiangWeiMaQue(node) {
    var card = node.getChildByName("card");
    card.visible = false;

    var tData = MjClient.data.sData.tData;
    var cards = MjClient.data.sData.cards;
    for(var i = tData.cardNext; i < MjClient.majiang.getAllCardsTotal(); i++){
        var cardClone = card.clone();
        cardClone.visible = true;
        node.addChild(cardClone);
        cardClone.loadTexture(MjClient.cardPath_YueYangWaiHuZi + "out" + cards[i] + ".png");

        cardClone.x = (i - tData.cardNext) % 40 * cardClone.width * cardClone.scale;
        cardClone.y = node.height - Math.floor((i - tData.cardNext) / 40) * cardClone.height * cardClone.scale;
    }
}
function addMaiPaiCards_anXiangWeiMaQue(node) {
    var card = node.getChildByName("card");
    card.visible = false;

    var tData = MjClient.data.sData.tData;
    var cards = MjClient.data.sData.cards;
    var index = MjClient.majiang.getAllCardsTotal();
    for(var i = index; i < cards.length; i++){
        var cardClone = card.clone();
        cardClone.visible = true;
        node.addChild(cardClone);
        cardClone.loadTexture(MjClient.cardPath_YueYangWaiHuZi + "out" + cards[i] + ".png");

        cardClone.x = (i - index) % 40 * cardClone.width * cardClone.scale;
        cardClone.y = (1 - Math.floor((i - index) / 40)) * cardClone.height * cardClone.scale;
    }
} 
function CircularCuttingHeadImg_anXiangWeiMaQue(node, pl) {
    var url = pl.info.headimgurl;
    if(!url) url = "png/default_headpic.png";
    cc.loader.loadImg(url, {isCrossOrigin : true}, function(err, texture)
    {
        if(!err && texture && cc.sys.isObjectValid(node))
        {
            var clippingNode = new cc.ClippingNode();
            var mask = new cc.Sprite("gameOver/gameOver_headBg2.png");
            clippingNode.setAlphaThreshold(0);
            clippingNode.setStencil(mask);
            var img = new cc.Sprite(texture);
            img.setScale(mask.getContentSize().width / img.getContentSize().width);
            clippingNode.addChild(img);
            clippingNode.setPosition(node.getContentSize().width / 2, node.getContentSize().height / 2);
            //遮罩框
            var hideblock = new cc.Sprite("gameOver/gameOver_headBg3.png");
            hideblock.setPosition(node.getContentSize().width / 2, node.getContentSize().height / 2);
            node.addChild(clippingNode);
            node.addChild(hideblock);
        }
    });
}
function setSortCard_anXiangWeiMaQue(node, item, pl) {
    var sortArr = pl.mjsort;
    var tData = MjClient.data.sData.tData;
    var isScale = false;
    if(tData.maxPlayer != 2) {
        if(tData.winner != -1) {
            isScale = tData.uids[tData.winner] != pl.info.uid;
        } else if(pl.info.uid != SelfUid()){
            isScale = true;
        }
    }
    var sortTitle = {
                mjwei:{resPath:"playing/anXiangWeiMaQue/wei.png", count:3},
                mjpeng:{resPath:"playing/anXiangWeiMaQue/peng.png", count:3},
                mjchi:{resPath:"playing/anXiangWeiMaQue/chi.png", count:3},

                tuan:{resPath:"playing/anXiangWeiMaQue/tuan.png", count:4},
                kan:{resPath:"playing/anXiangWeiMaQue/kan.png", count:3},
                shun:{resPath:"playing/anXiangWeiMaQue/jiao.png", count:3},
                jiang:{resPath:"playing/anXiangWeiMaQue/jiang.png", count:2},
                dan:{resPath:"playing/anXiangWeiMaQue/yu.png", count:1}
    };
    
    function addOneItem(itemName, cards, cardNum) {
        var itemClone = item.clone();
        itemClone.visible = true;
        node.addChild(itemClone);
        var huCardShow = false;

        var head = itemClone.getChildByName("head");
        head.loadTexture(sortTitle[itemName].resPath);

        var card = itemClone.getChildByName("card");
        card.visible  = false;

        for(var i = 0; i < cards.length; i++){
            var cardClone = card.clone();
            cardClone.visible = true;
            cardClone.loadTexture(MjClient.cardPath_YueYangWaiHuZi + "out" + cards[i] + ".png");
            itemClone.addChild(cardClone);

            if(cardNum && cardNum != -1 && !huCardShow && cards[i] == cardNum){
                var huIcon = ccui.ImageView.create("playing/paohuzi/huIcon.png");
                huIcon.setAnchorPoint(cc.p(1,0));
                huIcon.setPosition(cc.p(cardClone.width * cardClone.scale,0));
                cardClone.addChild(huIcon);
                huCardShow = true;
            }

            cardClone.y -= i * cardClone.height * cardClone.scale;
        }
        item.x += isScale ? item.width*0.6 : item.width;
    }

    var handArr;
    var huCardNum = -1;
    var huCardLine = -1;
    if(tData.uids[tData.winner] == pl.info.uid) {
        huCardNum = pl.huCard;
        huCardLine = pl.huCardPos;
    }
    cc.log("chow", "setSortCard_anXiangWeiMaQue : " + " sortArr = " + JSON.stringify(sortArr));
    for(var i = 0; i < sortArr.length; i++){
       var name =  sortArr[i].name;
       var pos = sortArr[i].pos;

        if(name == "mjchi"){
            var eatCards = pl[name][pos].eatCards;
            addOneItem(name, eatCards);
        }else{
            var cardsTemp = [];
            for(var j = 0; j < sortTitle[name].count; j++){
                cardsTemp.push(pl[name][pos]);
            }
            if(tData.uids[tData.winner] == pl.info.uid && huCardNum != -1 && huCardLine == -1){
                //胡家
                var lastWeiCd = pl.mjwei[pl.mjwei.length - 1];
                if(name == 'mjwei' && i == (sortArr.length-1) && huCardNum == lastWeiCd) {
                    addOneItem(name, cardsTemp, huCardNum);
                    continue;
                }
            }
            addOneItem(name, cardsTemp);
        }
    }

    if(tData.uids[tData.winner] == pl.info.uid){
        handArr = pl.handSort;
    }else{
        handArr = MjClient.majiang.sortCard(pl.mjhand, 1);
        //提取单牌列
        var okArr = [];
        var danArr = [];
        for(var i=0; i<handArr.length; i++) {
            var arr = handArr[i];
            if(isTuan(arr) || isKan(arr) || isShun(arr) || isJiang(arr)) {
                okArr.push(arr);
            }
            else {
                for (var j = 0; j < arr.length; j++) {
                    danArr.push(arr[j]);
                }
            }
        }

        //单牌组成列并排序
        var copy = danArr.slice();
        copy.sort(function(a, b){
            return a - b;
        });
        danArr = [];
        var temp = [];
        for(var i=0; i<copy.length; i++) {
            if(temp.length < 3) {
                temp.push(copy[i]);
            }else {
                danArr.push(temp);
                temp = [];
                temp.push(copy[i]);
            }
            if(i == (copy.length -1)) {
                danArr.push(temp);
            }
        }

        handArr = okArr.concat(danArr);
    }

    //剔除空列
    for (var i = handArr.length - 1; i >= 0; i--) {
        if(handArr[i].length == 0) {
            handArr.splice(i, 1);
        }
    }   

    //按照策划要求，对牌型进行排列
    var tuanArr = [];
    var kan = [];
    var shun = [];
    var jiang = [];
    var yu = [];
    for(var i=0; i<handArr.length; i++) {
        var arr = handArr[i];
        if((arr.name && arr.name == 'tuan') || isTuan(arr)) 
            tuanArr.push(arr);
        else if((arr.name && (arr.name == 'kan' || arr.name == 'mjpeng' || arr.name == 'mjwei')) || isKan(arr))
            kan.push(arr);
        else if((arr.name && arr.name == 'shun') || isShun(arr))
            shun.push(arr);
        else if((arr.name && arr.name == 'jiang') || isJiang(arr))
            jiang.push(arr);
        else
            yu.push(arr);
        if(arr.name && huCardLine == i) {
            arr.huCol = true;
        }
    }
    handArr = [];
    handArr = handArr.concat(tuanArr);
    handArr = handArr.concat(kan);
    handArr = handArr.concat(shun);
    handArr = handArr.concat(jiang);
    handArr = handArr.concat(yu);

    cc.log("chow", "setSortCard_anXiangWeiMaQue" + " handArr" + JSON.stringify(handArr) + " huCardNum = " + huCardNum + " huCardLine = " + huCardLine);
    for(var i = 0; i < handArr.length; i++){
        if(handArr[i].name){
            if(handArr[i].huCol){
                addOneItem(handArr[i].name, handArr[i].cards, huCardNum);
            }else{
                addOneItem(handArr[i].name, handArr[i].cards);
            }
        }else{
            if(isTuan(handArr[i])){
                addOneItem("tuan", handArr[i]);
            }else if(isKan(handArr[i])){
                addOneItem("kan", handArr[i]);
            }else if(isShun(handArr[i])){
                addOneItem("shun", handArr[i]);
            }else if(isJiang(handArr[i])){
                addOneItem("jiang", handArr[i]);
            }else{
                addOneItem("dan", handArr[i]);
            }
        }
    }

    function isTuan(cards) {
        if(cards.length != 4)
            return false;
        cards.sort(function(a, b) {
            return a - b;
        })
        return cards[0] == cards[3];
    }

    function isKan(cards) {
        return (cards.length == 3 && cards[0] == cards[1] && cards[0] == cards[2]);
    }

    function isShun(cards) {
        if(cards.length != 3){
            return false;
        }
        var cardTemp = cards.slice();
        cardTemp.sort(sortCard);
        return (cardTemp[0] == cardTemp[1] - 1) && (cardTemp[0] == cardTemp[2] - 2);
    }

    function isJiang(cards) {
        return (cards.length == 2 && cards[0] == cards[1]);
    }

    function sortCard(a, b) {
        return a - b;
    }
}
function setScore_anXiangWeiMaQue(node, pl){
    var score = node.getChildByName("score");
    var title = score.getChildByName("title");
    var num1 = score.getChildByName("num1");
    num1.ignoreContentAdaptWithSize(true);
    num1.visible = false;
    var num2 = score.getChildByName("num2");
    num2.ignoreContentAdaptWithSize(true);
    num2.visible = false;
    var fen = pl.winone - pl.winLiuZiScore - pl.betLiuZiScore;
    fen = revise(fen);
    if(fen >= 0){
        num1.visible = true;
        num1.setString(fen);
    }else{
        num2.visible = true;
        num2.setString(Math.abs(fen));
    }
    if(pl.winone <= 0){
        //title.visible = false;
    }
}
function setPlayerWinner_anXiangWeiMaQue(node, pl) {
    var tData = MjClient.data.sData.tData;

    if(tData.winner == -1){
        if(SelfUid() == pl.info.uid){
            node.loadTexture("playing/waihuzi/g_b_1.png");
        }else{
            node.loadTexture("playing/waihuzi/g_b.png");
        }
    }else{
        if(tData.uids[tData.winner] == pl.info.uid){
            node.loadTexture("playing/waihuzi/r_b_1.png");
        }else{
            if(SelfUid() == pl.info.uid){
                node.loadTexture("playing/waihuzi/g_b_1.png");
            }else{
                node.loadTexture("playing/waihuzi/g_b.png");
            }
        }
    }

    var huIcon = node.getChildByName("huIcon");
    huIcon.visible = false;
    if(tData.winner != -1 && tData.uids[tData.winner] == pl.info.uid){
        huIcon.visible = true;
    }

    var headBg = node.getChildByName("headBg");
    CircularCuttingHeadImg_anXiangWeiMaQue(headBg, pl);

    setOfflineShow_YueYangWaiHuZi(headBg, pl);

    var playerName = node.getChildByName("playerName");
    playerName.ignoreContentAdaptWithSize(true);
    playerName.setString(sliceStrByLen_YueYangWaiHuZi(unescape(pl.info.nickname), 5));

    var cardSort = node.getChildByName("cardSort");
    var cardItem = cardSort.getChildByName("cardItem");
    cardItem.visible = false;
    setSortCard_anXiangWeiMaQue(cardSort, cardItem, pl);

    setScore_anXiangWeiMaQue(node, pl);

    var score = node.getChildByName("score");
    var liuFen = node.getChildByName("liuZi");
    var num1 = liuFen.getChildByName("num1");
    var num2 = liuFen.getChildByName("num2");
    num1.ignoreContentAdaptWithSize(true);
    num2.ignoreContentAdaptWithSize(true);
    if(pl.winLiuZiScore >= 0) {
        num1.setVisible(true);
        num2.setVisible(false);
        num1.setString(Math.abs(pl.winLiuZiScore));
    }else {
        num1.setVisible(false);
        num2.setVisible(true);
        num2.setString(Math.abs(pl.winLiuZiScore));
    }
    //num1.ignoreContentAdaptWithSize(true);
    //num1.setString("+" + pl.winLiuZiScore);
    //liuFen.setVisible(pl.winLiuZiScore > 0);

    var yingXi = node.getChildByName("yingXi");
    yingXi.ignoreContentAdaptWithSize(true);
    if(tData.winner == -1 || tData.uids[tData.winner] != pl.info.uid){
        yingXi.visible = false;
    }else{
        yingXi.setString("硬息:" + pl.huXi);
    }

    //登
    var deng = node.getChildByName("deng");
    deng.setString("登数:" + pl.winDengNum);
    deng.setVisible(pl.winDengNum > 0);

    var mingTangItem = node.getChildByName("mingTangItem");
    mingTangItem.visible = false;
    
    var gap = 60;
    var curW = 0;
    var maxW = node.width - 80;
    var curLine = 0;
    if(tData.uids[tData.winner] == pl.info.uid) {
        //test hzdesc
        /*
        pl.hzdesc = [{"name":"上下五千年:", "desc":"+9999"},{"name":"上下五千年:", "desc":"+9999"},{"name":"上下五千年:", "desc":"+9999"},
        {"name":"上下五千年:", "desc":"+9999"},{"name":"印胡:", "desc":"+99"},{"name":"印胡:", "desc":"+99"},{"name":"印胡:", "desc":"+99"},
        {"name":"印胡:", "desc":"+99"},{"name":"上下五千年:", "desc":"+9999"},{"name":"上下五千年:", "desc":"+9999"},{"name":"上下五千年:", "desc":"+9999"},{"name":"上下五千年:", "desc":"+9999"},
        {"name":"印胡:", "desc":"+99"},{"name":"印胡:", "desc":"+99"}];
        */
        for (var i = 0; i < pl.hzdesc.length; i++) {
            var desc = pl.hzdesc[i];
            var mtTxt = new ccui.Text();
            mtTxt.setString(desc.name + desc.desc);
            if(desc.name == "啫啫胡:") { //兰亭字体不支持'啫'字....
                mtTxt.setFontSize(28);
            }else {
                mtTxt.setFontName(mingTangItem.getFontName());
                mtTxt.setFontSize(mingTangItem.getFontSize());
            }
            mtTxt.setAnchorPoint(0, 0.5);
            mtTxt.setTextColor(mingTangItem.getTextColor());
            mtTxt.x = mingTangItem.x;
            mtTxt.y = mingTangItem.y;
            node.addChild(mtTxt);

            if(curW + mtTxt.width + gap <= maxW) {
                mtTxt.x += (curW + (curW == 0 ? 0 : gap));
                curW += ((curW == 0 ? 0 : gap) + mtTxt.width);
            } else {
                curLine++;
                curW = mtTxt.width;
            }
            mtTxt.y -= curLine * mtTxt.height;
        }
    }
}
function setPlayerPlayer_anXiangWeiMaQue(node, pl) {
    if(SelfUid() == pl.info.uid){
        node.loadTexture("playing/waihuzi/g_s_1.png");
    }else{
        node.loadTexture("playing/waihuzi/g_s.png");
    }

    var headBg = node.getChildByName("headBg");
    CircularCuttingHeadImg_anXiangWeiMaQue(headBg, pl);

    setOfflineShow_YueYangWaiHuZi(headBg, pl);

    var playerName = node.getChildByName("playerName");
    playerName.ignoreContentAdaptWithSize(true);
    playerName.setString(sliceStrByLen_YueYangWaiHuZi(unescape(pl.info.nickname), 5));

    //溜分
    var liuFen = node.getChildByName("liuFen");
    liuFen.getChildByName("num2").setVisible(false);
    var num1 = liuFen.getChildByName("num1");
    var num2 = liuFen.getChildByName("num2");
    num1.ignoreContentAdaptWithSize(true);
    num2.ignoreContentAdaptWithSize(true);
    if(pl.winLiuZiScore >= 0) {
        num1.setVisible(true);
        num2.setVisible(false);
        num1.setString(Math.abs(pl.winLiuZiScore));
    }else {
        num2.setVisible(true);
        num1.setVisible(false);
        num2.setString(Math.abs(pl.winLiuZiScore));
    }
    // num1.setString("+" + pl.winLiuZiScore);
    // num1.setVisible(true);
    // num1.ignoreContentAdaptWithSize(true);
    // liuFen.setVisible(pl.winLiuZiScore > 0);

    var cardSort = node.getChildByName("cardSort");
    var cardItem = cardSort.getChildByName("cardItem");
    cardItem.visible = false;
    setSortCard_anXiangWeiMaQue(cardSort, cardItem, pl);

    setScore_anXiangWeiMaQue(node, pl);
}
function addPlayerItem_anXiangWeiMaQue(node) {
    var winner = node.getChildByName("winner");
    winner.visible = false;
    var player = node.getChildByName("player");
    player.visible = false;

    var sData = MjClient.data.sData;
    var tData = sData.tData;

    var firstIndex = tData.winner != -1 ? tData.winner : tData.uids.indexOf(SelfUid());
    var firstPlayer = tData.uids[firstIndex];
    var item = winner.clone();
    item.visible = true;
    setPlayerWinner_anXiangWeiMaQue(item, sData.players[firstPlayer]);
    winner.x += winner.width;
    winner.x += 23;
    node.addChild(item);

    for(var uid in sData.players){
        if(uid == firstPlayer){
            continue;
        }
        var item;
        if(MjClient.playui.getPlayersNum() == 2){
            item = winner.clone();
            item.visible = true;
            setPlayerWinner_anXiangWeiMaQue(item, sData.players[uid]);

            winner.x += winner.width;
            winner.x += 23;
        }else{
            item = player.clone();
            item.visible = true;
            setPlayerPlayer_anXiangWeiMaQue(item, sData.players[uid]);

            player.y -= player.height;
            player.y -= 10;
        }
        node.addChild(item);
    }
}
var EndOneView_anXiangWeiMaQue = cc.Layer.extend({
    
    jsBind: {
        block: {
            _layout: [[1, 0], [0.5, 0.5], [0, 0]],
            _run:function () {
                MjClient.endoneui.block = this;
            }
        },
        playPanel: {
            _layout: [[1, 1], [0.5, 0.5], [0, 0]],
            _run: function () {
                this.visible = false;
                MjClient.endoneui.playerPanel = this;
            },
            leftPanel: {
                _run: function () {
                    if(MjClient.rePlayVideo != -1){
                        this.visible = false;
                    }
                    addPlayerHandCards_anXiangWeiMaQue(this, MjClient.playui.getPlayersNum() - 1);
                }
            },
            rightPanel: {
                _run: function () {
                    if (MjClient.playui.getPlayersNum() == 2 || MjClient.rePlayVideo != -1) {
                        this.visible = false;
                    }
                    addPlayerHandCards_anXiangWeiMaQue(this, MjClient.playui.getPlayersNum() - 2);
                }
            },
        },
        resultPanel: {
            _layout: [[1, 1], [0.5, 0.5], [0, 0]],
            _run: function () {
                MjClient.endoneui.resultPanel = this;
                addPlayerItem_anXiangWeiMaQue(this);
            },
            titleResult: {
                _run: function () {
                    var tData = MjClient.data.sData.tData;
                    if (tData.winner == -1) {
                        this.loadTexture("gameOver/pingju_03.png");
                        if (MjClient.isDismiss) {
                            this.loadTexture("gameOver/jiesan.png");
                        }
                    } else {
                        if (tData.uids[tData.winner] == SelfUid()) {
                            this.loadTexture("gameOver/duihuan_10.png");
                        } else {
                            this.loadTexture("gameOver/duihuan_16.png");
                        }
                    }
                }
            },
            diPai:{
                cardList:{
                    _run:function () {
                        addDiPaiCards_anXiangWeiMaQue(this);
                    }
                }
            },
            maiPai:{
                _run:function () {
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    this.visible = tData.areaSelectMode.isMaiPai ? true : false;
                },
                cardList:{
                    _run:function () {
                        addMaiPaiCards_anXiangWeiMaQue(this);
                    }
                }
            },
            dissType: {
                _run:function(){
                    this.ignoreContentAdaptWithSize(true);
                    this.setVisible(MjClient.isDismiss);
                    if (MjClient.isDismiss)
                    {  
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;

                        var id = tData.firstDel;
                        var pl = sData.players[id];
                        var delStr = "";
                        if(pl) {
                            var name  =  unescape(pl.info.nickname );
                            delStr = name + pl.mjdesc[0]; 
                        } else {
                            delStr = tData.dissolveWay == -1? '系统停服自动解散房间':'会长或管理员解散房间';
                        }  
                        this.setString("" + delStr) ;
                    }
                }
            }
        },
        commonPanel: {
            _layout: [[1, 1], [0.5, 0.5], [0, 0]],
            switchBtn: {
                buttonBg: {
                    _run: function () {
                        MjClient.endoneui.switchButtonBg = this;
                    }
                },
                resultShow: {
                    _click: function (btn, eT) {
                        MjClient.endoneui.switchButtonBg.x = btn.x;
                        MjClient.endoneui.block.visible = true;
                        MjClient.endoneui.playerPanel.visible = false;
                        MjClient.endoneui.resultPanel.visible = true;
                    }
                },
                playShow: {
                    _click: function (btn, eT) {
                        MjClient.endoneui.switchButtonBg.x = btn.x;
                        MjClient.endoneui.block.visible = false;
                        MjClient.endoneui.playerPanel.visible = true;
                        MjClient.endoneui.resultPanel.visible = false;
                    }
                }
            },
            continueBtn: {
                _click: function (btn, eT) {
                    playMusic("bgHongZi");
                    postEvent("clearCardUI");
                    postEvent("clearCardArr");
                    MjClient.endoneui.removeFromParent(true);
                    MjClient.endoneui = null;
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    if (MjClient.rePlayVideo >= 0 && MjClient.replayui) {
                        MjClient.replayui.replayEnd();
                    }
                    else {
                        MjClient.gamenet.request("pkroom.handler.tableMsg", {
                            cmd: "MJPass"
                        });
                    }
                    if (MjClient.endallui)
                    {
                        MjClient.endallui.visible = true;
                    }
                }
            },
            roundInfo: {
                _run: function () {
                    this.setString(MjClient.playui.getRoundInfo());
                }
            },
        }
    },
    
    ctor: function () {
        this._super();
        MjClient.endoneui = this;
        var endoneui = ccs.load("endOne_anXiangWeiMaQue.json");
        BindUiAndLogic(endoneui.node, this.jsBind);
        this.addChild(endoneui.node);
        return true;
    }
});