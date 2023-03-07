function addPlayerHandCards_YuanJiangGuiHuZi(node, off) {
    var card = node.getChildByName("card");
    card.visible = false;
    var pl = getUIPlayer_YuanJiangGuiHuZi(off);
    var cardArr = MjClient.majiang.sortCard(pl.mjhand);
    cc.log("chow", "addPlayerHandCards_YuanJiangGuiHuZi" + " cardArr = " + JSON.stringify(cardArr));
    for(var i  = 0; i < cardArr.length; i++){
        var lineNode = new cc.Node();
        for(var j = 0; j < cardArr[i].length; j++){
            var cardClone = card.clone();
            cardClone.visible = true;
            cardClone.loadTexture(MjClient.cardPath_YuanJiangGuiHuZi + "out" + cardArr[i][j] + ".png");
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
function addDiPaiCards_YuanJiangGuiHuZi(node) {
    var card = node.getChildByName("card");
    card.visible = false;

    var tData = MjClient.data.sData.tData;
    var cards = MjClient.data.sData.cards;
    for(var i = tData.cardNext; i < MjClient.majiang.getAllCardsTotal(MjClient.data.sData); i++){
        var cardClone = card.clone();
        cardClone.visible = true;
        node.addChild(cardClone);
        cardClone.loadTexture(MjClient.cardPath_YuanJiangGuiHuZi + "out" + cards[i] + ".png");

        cardClone.x = (i - tData.cardNext) % 40 * cardClone.width * cardClone.scale;
        cardClone.y = node.height - Math.floor((i - tData.cardNext) / 40) * cardClone.height * cardClone.scale;
    }
}
function addMaiPaiCards_YuanJiangGuiHuZi(node) {
    var card = node.getChildByName("card");
    card.visible = false;

    var tData = MjClient.data.sData.tData;
    var cards = MjClient.data.sData.cards;
    var index = MjClient.majiang.getAllCardsTotal(MjClient.data.sData);
    for(var i = index; i < cards.length; i++){
        var cardClone = card.clone();
        cardClone.visible = true;
        node.addChild(cardClone);
        cardClone.loadTexture(MjClient.cardPath_YuanJiangGuiHuZi + "out" + cards[i] + ".png");

        cardClone.x = (i - index) % 40 * cardClone.width * cardClone.scale;
        cardClone.y = (1 - Math.floor((i - index) / 40)) * cardClone.height * cardClone.scale;
    }
}
function CircularCuttingHeadImg_YuanJiangGuiHuZi(node, pl) {
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
function setSortCard_YuanJiangGuiHuZi(node, item, pl) {
    var sortArr = pl.mjsort;
    var sortTitle = {
        mjgang3:{resPath:"playing/waihuzi/zha.png", count:4},
        mjgang2:{resPath:"playing/waihuzi/liu.png", count:4},
        mjgang1:{resPath:"playing/waihuzi/liu.png", count:4},
        mjgang0:{resPath:"playing/waihuzi/piao.png", count:4},
        danwai:{resPath:"playing/waihuzi/wai.png", count:2},
        mjwei:{resPath:"playing/waihuzi/wai.png", count:3},
        mjpeng:{resPath:"playing/waihuzi/peng.png", count:3},
        mjchi:{resPath:"playing/waihuzi/chi.png", count:3},

        liu:{resPath:"playing/waihuzi/liu.png", count:4},
        kan:{resPath:"playing/waihuzi/kan.png", count:3},
        shun:{resPath:"playing/waihuzi/shun.png", count:3},
        jiang:{resPath:"playing/waihuzi/jiang.png", count:2},
        men:{resPath:"playing/waihuzi/men.png", count:2},
        dan:{resPath:"playing/waihuzi/dan.png", count:1}
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
            cardClone.loadTexture(MjClient.cardPath_YuanJiangGuiHuZi + "out" + cards[i] + ".png");
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
        item.x += item.width;
    }

    var handArr;
    var huCardNum = -1;
    var huCardLine = -1;
    var tData = MjClient.data.sData.tData;
    if(tData.uids[tData.winner] == pl.info.uid){
        handArr = pl.handSort;
        huCardNum = (pl.huCard == -1 ? tData.lastPutCard : pl.huCard);
        huCardLine = pl.huCardPos;
    }else{
        handArr = MjClient.majiang.sortCard(pl.mjhand, 1);
        MjClient.majiang.sortCard2(handArr);
    }
    cc.log("chow", "setSortCard_YuanJiangGuiHuZi" + " handArr" + JSON.stringify(handArr) + " huCardNum = " + huCardNum + " huCardLine = " + huCardLine);

    cc.log("chow", "setSortCard_YuanJiangGuiHuZi : " + " sortArr = " + JSON.stringify(sortArr));
    for(var i = 0; i < sortArr.length; i++){
       var name =  sortArr[i].name;
       var pos = sortArr[i].pos;

        if(name == "mjchi"){
            var eatCards = pl[name][pos].eatCards;
            var biCards = pl[name][pos].biCards;

            addOneItem(name, eatCards);

            if(biCards){
                for(var j = 0; j < biCards.length; j++){
                    addOneItem(name, biCards[j]);
                }
            }
        }else{
            var cardsTemp = [];
            for(var j = 0; j < sortTitle[name].count; j++){
                cardsTemp.push(pl[name][pos]);
            }
            if(huCardLine == -1){
                addOneItem(name, cardsTemp, huCardNum);
            }else{
                addOneItem(name, cardsTemp);
            }
        }
    }

    for(var i = 0; i < handArr.length; i++){
        if(handArr[i].name){
            if(i == huCardLine){
                addOneItem(handArr[i].name, handArr[i].cards, huCardNum);
            }else{
                addOneItem(handArr[i].name, handArr[i].cards);
            }
        }else{
            if(isLiu(handArr[i])){
                addOneItem("liu", handArr[i]);
            }else if(isKan(handArr[i])){
                addOneItem("kan", handArr[i]);
            }else if(isShun(handArr[i])){
                addOneItem("shun", handArr[i]);
            }else if(isJiang(handArr[i])){
                addOneItem("jiang", handArr[i]);
            }else if(isMen(handArr[i])){
                addOneItem("men", handArr[i]);
            }else if(isDan(handArr[i])){
                addOneItem("dan", handArr[i]);
            }else{
                addOneItem("dan", handArr[i]);
            }
        }
    }
    function isLiu(cards) {
        return (cards.length == 4 && cards[0] == cards[1] && cards[0] == cards[2] && cards[0] == cards[3]);
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
        return (cardTemp[0] == cardTemp[1] - 1 && cardTemp[0] == cardTemp[2] - 2)
            || (cardTemp[0] == 2 && cardTemp[1] == 7 && cardTemp[2] == 10)
            || (cardTemp[0] == 22 && cardTemp[1] == 27 && cardTemp[2] == 30);
    }
    function isJiang(cards) {
        return (cards.length == 2 && cards[0] == cards[1]);
    }
    function isMen(cards) {
        if(cards.length != 2){
            return false;
        }
        var cardTemp = cards.slice();
        cardTemp.sort(sortCard);
        return (Math.abs(cardTemp[0] - cardTemp[1]) <= 2)
            || (cardTemp[0] != cardTemp[1] && (([2, 7, 10].indexOf(cardTemp[0]) >= 0 && [2, 7, 10].indexOf(cardTemp[1]) >= 0) ||
            ([22, 27, 30].indexOf(cardTemp[0]) >= 0 && [22, 27, 30].indexOf(cardTemp[1]) >= 0)));
    }
    function isDan(cards) {
        return (cards.length == 1);
    }
    function sortCard(a, b) {
        return a - b;
    }
}
function setScore_YuanJiangGuiHuZi(node, pl){
    var score = node.getChildByName("score");
    var title = score.getChildByName("title");
    var num1 = score.getChildByName("num1");
    num1.ignoreContentAdaptWithSize(true);
    num1.visible = false;
    var num2 = score.getChildByName("num2");
    num2.ignoreContentAdaptWithSize(true);
    num2.visible = false;
    if(pl.winone >= 0){
        num1.visible = true;
        num1.setString(pl.winone);
    }else{
        num2.visible = true;
        num2.setString(Math.abs(pl.winone));
    }
    if(pl.winone <= 0){
        title.visible = false;
    }
}
function setPlayerWinner_YuanJiangGuiHuZi(node, pl) {
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
    CircularCuttingHeadImg_YuanJiangGuiHuZi(headBg, pl);

    setOfflineShow_YuanJiangGuiHuZi(headBg, pl);

    var playerName = node.getChildByName("playerName");
    playerName.ignoreContentAdaptWithSize(true);
    playerName.setString(sliceStrByLen_YuanJiangGuiHuZi(unescape(pl.info.nickname), 5));

    var cardSort = node.getChildByName("cardSort");
    var cardItem = cardSort.getChildByName("cardItem");
    cardItem.visible = false;
    setSortCard_YuanJiangGuiHuZi(cardSort, cardItem, pl);

    setScore_YuanJiangGuiHuZi(node, pl);

    var score = node.getChildByName("score");
    var huxi = node.getChildByName("huxi");
    var huxiNum = huxi.getChildByName("num");
    // var neiYuan = node.getChildByName("neiYuan");
    // var neiYuanNum = neiYuan.getChildByName("num");
    // var waiYuan = node.getChildByName("waiYuan");
    // var waiYuanNum = waiYuan.getChildByName("num");
    huxiNum.ignoreContentAdaptWithSize(true);
    // neiYuanNum.ignoreContentAdaptWithSize(true);
    // waiYuanNum.ignoreContentAdaptWithSize(true);
    if(tData.winner == -1 || tData.uids[tData.winner] != pl.info.uid){
        huxi.visible = false;
        // neiYuan.visible = false;
        // waiYuan.visible = false;
        score.x = node.width / 2;
    }else{
        huxiNum.setString(pl.huXi + "");//胡息
        // neiYuanNum.setString(pl.yuan.neiHao + "");//内豪
        // waiYuanNum.setString(pl.yuan.waiHao + "");//外豪
    }
    var mingTangTitle = {tingHu:"听胡", tianHu:"天胡", diHu:"地胡", shiSanHong:"十三红",
        yiDianHong:"一点红", quanHei:"全黑", quanDa:"全大", quanXiao:"全小", wuDuiHu:"乌对胡", shiDui:"十对",
        yiDui:"一对", jiuDui:"九对", hangHangXi:"行行息", duiZiXi:"对子息", haiLao:"海底胡", quanQiuRen:"全求人", piaoFen:"飘分",
        beiKaoBei:"背靠背", shouQianShou:"手牵手",tianHu:"天胡",daZiHu:"大字胡",xiaoZiHu:"小字胡",baoTing:"报听",wuXiPingHu:"无息平胡",
        huaHuZi:"花胡子", jiuDuiBan:"九对半", Hong14:"14红", Hong15:"15红", Hong16:"16红", Hong17:"17红", Hong18:"18红", Hong19:"19红", Hong20:"20红"};
    var mingTangItem = node.getChildByName("mingTangItem");
    mingTangItem.visible = false;
    var count = 0;

    var xiTitle = {};
    if(!pl.isDaHu && pl.hardHuXi != 0) xiTitle.hardHuXi = "硬息";
    if(pl.kanWaiLiu != 0) xiTitle.kanWaiLiu = "坎歪溜";
    if(!pl.isDaHu && pl.duoXi != 0 && tData.areaSelectMode.mingTang != 0) xiTitle.duoXi = "多息";
    if(pl.neiHao != 0) xiTitle.neiHao = "内圆";
    if(pl.waiHao != 0) xiTitle.waiHao = "外圆";

    if(tData.uids[tData.winner] == pl.info.uid) {
        for(var i in xiTitle)
        {
            var mingTangItemClone = mingTangItem.clone();
            mingTangItemClone.visible = true;
            node.addChild(mingTangItemClone);

            mingTangItemClone.setString(xiTitle[i] + ":" + pl[i]);
            mingTangItemClone.x += count % 3 * mingTangItemClone.width;
            mingTangItemClone.y -= Math.floor(count / 3) * mingTangItemClone.height * 1.5;
            count++;
        }
        for (var key in pl.hzdesc)
        {
            var mingTangItemClone = mingTangItem.clone();
            mingTangItemClone.visible = true;
            node.addChild(mingTangItemClone);
            if(key == "haiLao" || key == "baoTing"|| key == "Hong14"|| key == "Hong15"|| key == "Hong16"
                ||  key == "Hong17"|| key == "Hong18"|| key == "Hong19"|| key == "Hong20")
            {
                mingTangItemClone.setString(mingTangTitle[key] + "x" + pl.hzdesc[key]);
            }
            else {
                mingTangItemClone.setString(mingTangTitle[key] + ":" + pl.hzdesc[key]);
            }
            mingTangItemClone.x += count % 3 * mingTangItemClone.width;
            mingTangItemClone.y -= Math.floor(count / 3) * mingTangItemClone.height * 1.5;
            count++;
        }
    }
}
function setPlayerPlayer_YuanJiangGuiHuZi(node, pl) {
    if(SelfUid() == pl.info.uid){
        node.loadTexture("playing/waihuzi/g_s_1.png");
    }else{
        node.loadTexture("playing/waihuzi/g_s.png");
    }

    var headBg = node.getChildByName("headBg");
    CircularCuttingHeadImg_YuanJiangGuiHuZi(headBg, pl);

    setOfflineShow_YuanJiangGuiHuZi(headBg, pl);

    var playerName = node.getChildByName("playerName");
    playerName.ignoreContentAdaptWithSize(true);
    playerName.setString(sliceStrByLen_YuanJiangGuiHuZi(unescape(pl.info.nickname), 5));

    var cardSort = node.getChildByName("cardSort");
    var cardItem = cardSort.getChildByName("cardItem");
    cardItem.visible = false;
    setSortCard_YuanJiangGuiHuZi(cardSort, cardItem, pl);

    setScore_YuanJiangGuiHuZi(node, pl);
}
function addPlayerItem_YuanJiangGuiHuZi(node) {
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
    setPlayerWinner_YuanJiangGuiHuZi(item, sData.players[firstPlayer]);
    winner.x += winner.width;
    winner.x += 23;
    node.addChild(item);

    for(var uid in sData.players){
        if(uid == firstPlayer){
            continue;
        }
        var item;
        if(MjClient.MaxPlayerNum_YuanJiangGuiHuZi == 2){
            item = winner.clone();
            item.visible = true;
            setPlayerWinner_YuanJiangGuiHuZi(item, sData.players[uid]);

            winner.x += winner.width;
            winner.x += 23;
        }else{
            item = player.clone();
            item.visible = true;
            setPlayerPlayer_YuanJiangGuiHuZi(item, sData.players[uid]);

            player.y -= player.height;
            player.y -= 10;
        }
        node.addChild(item);
    }
}
var EndOneView_YuanJiangGuiHuZi = cc.Layer.extend({
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
                    addPlayerHandCards_YuanJiangGuiHuZi(this, MjClient.MaxPlayerNum_YuanJiangGuiHuZi - 1);
                }
            },
            rightPanel: {
                _run: function () {
                    if (MjClient.MaxPlayerNum_YuanJiangGuiHuZi == 2 || MjClient.rePlayVideo != -1) {
                        this.visible = false;
                    }
                    addPlayerHandCards_YuanJiangGuiHuZi(this, MjClient.MaxPlayerNum_YuanJiangGuiHuZi - 2);
                }
            },
        },
        resultPanel: {
            _layout: [[1, 1], [0.5, 0.5], [0, 0]],
            _run: function () {
                MjClient.endoneui.resultPanel = this;
                addPlayerItem_YuanJiangGuiHuZi(this);
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
                        addDiPaiCards_YuanJiangGuiHuZi(this);
                    }
                }
            },
            maiPai:{
                _run:function () {
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    this.visible = (tData.areaSelectMode.maiPai19 || tData.areaSelectMode.maiPaiNum != 0) ? true : false;
                },
                cardList:{
                    _run:function () {
                        addMaiPaiCards_YuanJiangGuiHuZi(this);
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
                _run: function(){
                    if(MjClient.rePlayVideo == -1 && 
                        !MjClient.data.sData.tData.areaSelectMode.isManualCutCard && 
                        !MjClient.endallui){
                            return;
                    }else{
                        this.setPositionX(this.getParent().getContentSize().width/2);
                    }
                },
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
            btn_xiPai: {
                _run: function(){
                    if(MjClient.rePlayVideo == -1 && 
                        !MjClient.data.sData.tData.areaSelectMode.isManualCutCard && 
                        !MjClient.endallui) {
                        this.visible = true;
                        var icon = this.getChildByName("icon");
                        var numTxt = this.getChildByName("numTxt"); 
                        if(MjClient.data.sData.tData.areaSelectMode.fangkaCount != undefined) {
                            //钻石场
                            icon.loadTexture("gameOver/newOver/ico_zuanshi.png");
                            numTxt.setString("x1");
                        }else {
                            //元宝场
                            icon.loadTexture("gameOver/newOver/ico_yuanbao.png");
                            numTxt.setString("x2");
                        }
                        
                    }else {
                        this.visible = false;
                    }
                },
                _click: function(btn,eT){ 
                    MjClient.gamenet.request("pkroom.handler.tableMsg", {
                        cmd: "MJShuffle"
                    },function(data) {
                        if (data != null && data.code == -1)
                        {
                            console.log("======MJShuffle=====", JSON.stringify(data));
                            MjClient.showToast(data.message);
                            return;
                        }

                        postEvent("clearCardUI");
                        postEvent("clearCardArr"); 
                        MjClient.endoneui.gameMain = null; 
                        MjClient.endoneui.removeFromParent(true);
                        MjClient.endoneui = null; 
                        MjClient.gamenet.request("pkroom.handler.tableMsg", {
                            cmd: "MJPass"
                        });
                    });
                    
                } 
            },
            roundInfo: {
                _run: function () {
                    this.setString(getRoundInfo_YuanJiangGuiHuZi());
                }
            },
        }
    },
    ctor: function () {
        this._super();
        MjClient.endoneui = this;
        var endoneui = ccs.load("endOne_yuanJiangGuiHuZi.json");
        BindUiAndLogic(endoneui.node, this.jsBind);
        this.addChild(endoneui.node);
        return true;
    }
});