function addPlayerHandCards_changDePaoHuZi_new(node, off) {
    var card = node.getChildByName("card");
    card.visible = false;
    var pl = getUIPlayer_changDePaoHuZi(off);
    var cardArr = MjClient.majiang.sortCard(pl.mjhand);
    cc.log("chow", "addPlayerHandCards_changDePaoHuZi_new" + " cardArr = " + JSON.stringify(cardArr));
    for(var i  = 0; i < cardArr.length; i++){
        var lineNode = new cc.Node();
        for(var j = 0; j < cardArr[i].length; j++){
            var cardClone = card.clone();
            cardClone.visible = true;
            cardClone.loadTexture(MjClient.cardPath_changDePaoHuZi + "out" + cardArr[i][j] + ".png");
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

function addDiPaiCards_changDePaoHuZi_new(node) {
    var card = node.getChildByName("card");
    card.visible = false;

    var tData = MjClient.data.sData.tData;
    var cards = MjClient.data.sData.cards;
    for(var i = tData.cardNext; i < MjClient.majiang.getAllCardsTotal(MjClient.data.sData); i++){
        var cardClone = card.clone();
        cardClone.visible = true;
        node.addChild(cardClone);
        cardClone.loadTexture(MjClient.cardPath_changDePaoHuZi + "out" + cards[i] + ".png");

        cardClone.x = (i - tData.cardNext) % 40 * cardClone.width * cardClone.scale;
        cardClone.y = node.height - Math.floor((i - tData.cardNext) / 40) * cardClone.height * cardClone.scale;
    }
}

function addMaiPaiCards_changDePaoHuZi_new(node) {
    var card = node.getChildByName("card");
    card.visible = false;

    var tData = MjClient.data.sData.tData;
    var cards = MjClient.data.sData.cards;
    var index = MjClient.majiang.getAllCardsTotal(MjClient.data.sData);
    for(var i = index; i < cards.length; i++){
        var cardClone = card.clone();
        cardClone.visible = true;
        node.addChild(cardClone);
        cardClone.loadTexture(MjClient.cardPath_changDePaoHuZi + "out" + cards[i] + ".png");

        cardClone.x = (i - index) % 40 * cardClone.width * cardClone.scale;
        cardClone.y = (1 - Math.floor((i - index) / 40)) * cardClone.height * cardClone.scale;
    }
}

function CircularCuttingHeadImg_changDePaoHuZi_new(node, pl) {
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

function setSortCard_changDePaoHuZi_new(node, pl) {
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var uid = pl.info.uid;
    var isWinner = false;
    if(tData.winner != -1 && uid == tData.uids[tData.winner]){
        isWinner = true;
    }
    //添加胡牌标志
    var isHand = !pl.isHuByHand; // 胡的牌是否在手牌中
    if (tData.isLastDraw && !(pl.mjgang1.toString() == [tData.lastPutCard].toString())) {
        isHand = true;
    }

    var huCard = tData.lastPutCard;
    // 补牌天胡
    if (tData.isLastDraw && pl.mjgang1.length >= 2) {
        huCard = pl.mjhand[pl.mjhand.length - 1];
    }
    
    var info = node.getChildByName("info");
    var mjSortArr = pl.mjsort;
    var handSortArr = pl.handSort;
    var startPos = cc.p(info.x, info.y);
    var off_x = info.getCustomSize().width * 1.2;
    for(k = 0;k < mjSortArr.length;k++){
        var mjsort = mjSortArr[k];
        var pos = mjsort.pos;
        var name = mjsort.name;
        var cardNum = 0;
        //提
        if(name == "mjgang1"){
            cardNum = pl.mjgang1[pos];
            clone = info.clone();
            clone.visible = true;
            clone.getChildByName("title").setString("提");
            for(i = 1;i <= 4;i++){
                var up = clone.getChildByName("card" + i);
                up.loadTexture(MjClient.cardPath_changDePaoHuZi+"out" + cardNum + ".png");
                if(isWinner && i==4 && isHand == false && cardNum == huCard){
                    setHuCardMark_changDePaoHuZi(up,clone);
                }
            }
            var huxi = huXiScore_changDePaoHuZi("tiPai",cardNum);
            clone.setString(huxi);
            clone.setPosition(startPos);
            node.addChild(clone);
            startPos = cc.p(startPos.x + off_x, startPos.y);
        }
        //偎
        if(name == "mjwei"){
            cardNum = pl.mjwei[pos]; 
            clone = info.clone();
            clone.visible = true;
            clone.getChildByName("title").setString("偎");
            for(i = 1;i <= 4;i++){
                var up = clone.getChildByName("card" + i);
                if(i == 4){
                    up.visible = false;
                }else{
                    up.loadTexture(MjClient.cardPath_changDePaoHuZi+"out" + cardNum + ".png");
                }
                if(isWinner && i==3 && isHand == false && cardNum == huCard){
                    setHuCardMark_changDePaoHuZi(up,clone);
                }
            }
            var huxi = huXiScore_changDePaoHuZi("weiPai",cardNum);
            clone.setString(huxi);
            clone.setPosition(startPos);
            node.addChild(clone);
            startPos = cc.p(startPos.x + off_x, startPos.y);
        }
        //跑
        if(name == "mjgang0"){
            cardNum = pl.mjgang0[pos];
            clone = info.clone();
            clone.visible = true;
            clone.getChildByName("title").setString("跑");
            for(i = 1;i <= 4;i++){
                var up = clone.getChildByName("card" + i);
                up.loadTexture(MjClient.cardPath_changDePaoHuZi+"out" + cardNum + ".png");
                if(isWinner && i==4 && isHand == false && cardNum == huCard){
                    setHuCardMark_changDePaoHuZi(up,clone);
                }
            }
            var huxi = huXiScore_changDePaoHuZi("paoPai",cardNum);
            clone.setString(huxi);
            clone.setPosition(startPos);
            node.addChild(clone);
            startPos = cc.p(startPos.x + off_x, startPos.y);
        }
        //碰
        if(name == "mjpeng"){
            cardNum = pl.mjpeng[pos];
            clone = info.clone();
            clone.visible = true;
            clone.getChildByName("title").setString("碰");
            for(i = 1;i <= 4;i++){
                var up = clone.getChildByName("card" + i);
                if(i == 4){
                    up.visible = false;
                }else{
                    up.loadTexture(MjClient.cardPath_changDePaoHuZi+"out" + cardNum + ".png");
                }
            }
            var huxi = huXiScore_changDePaoHuZi("peng",cardNum);
            clone.setString(huxi);
            clone.setPosition(startPos);
            node.addChild(clone);
            startPos = cc.p(startPos.x + off_x, startPos.y);
        }
        //吃
        if(name == "mjchi"){
            var getHuXi = function(cards){
                cards = [].concat(cards);
                cards.sort(function(a, b) {return a - b});
                var normal = [[1,2,3],[21,22,23], [2, 7, 10], [22, 27, 30], [1, 5, 10], [21, 25, 30]];
                for(var t = 0;t < normal.length;t++){
                    if(normal[t].toString() == cards.toString()){
                        var huxi = huXiScore_changDePaoHuZi("chi",cards[0]);
                        return huxi;
                    }
                }
                
                return 0;                           
            }

            var eatCards = pl.mjchi[pos].eatCards;
            if(uid != SelfUid()){
                eatCards.reverse();
            }
            clone = info.clone();
            clone.visible = true;
            var cards = [].concat(eatCards);
            if(cards[0] == cards[1] || cards[0] == cards[2] || cards[1] == cards[2]){
                clone.getChildByName("title").setString("绞");
            }else{
                clone.getChildByName("title").setString("顺");
            }
            for(i = 1;i <= 4;i++){
                var up = clone.getChildByName("card" + i);
                var card = eatCards[i-1];
                if(card){
                    up.loadTexture(MjClient.cardPath_changDePaoHuZi+"out" + card + ".png");
                }else{
                    up.visible = false;
                }
                if(i == 3){
                    up.setColor(cc.color(170, 170, 170));
                }
            }
            var huxi = getHuXi(eatCards);
            clone.setString(huxi);
            clone.setPosition(startPos);
            node.addChild(clone);
            startPos = cc.p(startPos.x + off_x, startPos.y);

            var biCards = pl.mjchi[pos].biCards;
            if(biCards && biCards.length > 0){
                //计算坐标
                for(var m = 0;m < biCards.length;m++){
                    var biArr = biCards[m];
                    if(uid != SelfUid()){
                        biArr.reverse();
                    }
                    clone = info.clone();
                    clone.visible = true;
                    var cards = [].concat(biArr);
                    if(cards[0] == cards[1] || cards[0] == cards[2] || cards[1] == cards[2]){
                        clone.getChildByName("title").setString("绞");
                    }else{
                        clone.getChildByName("title").setString("顺");
                    }
                    for(i = 1;i <= 4;i++){
                        var up = clone.getChildByName("card" + i);
                        var card = biArr[i-1];
                        if(card){
                            up.loadTexture(MjClient.cardPath_changDePaoHuZi+"out" + card + ".png");
                        }else{
                            up.visible = false;
                        }
                        if(i == 3){
                            up.setColor(cc.color(170, 170, 170));
                        }
                    }
                    var huxi = getHuXi(biArr);
                    clone.setString(huxi);
                    clone.setPosition(startPos);
                    node.addChild(clone);
                    startPos = cc.p(startPos.x + off_x, startPos.y);
                }      
            }
        }
    }
    //手牌
    if(tData.winner != -1 && uid == tData.uids[tData.winner]){
        for(var index in handSortArr){
            var handSort = handSortArr[index];
            clone = info.clone();
            clone.visible = true;
            if(handSort.name){
                if(handSort.name == "chi"){
                    var cards = handSort.cards;
                    if(cards[0] == cards[1] || cards[0] == cards[2] || cards[1] == cards[2]){
                        clone.getChildByName("title").setString("绞");
                    }else{
                        clone.getChildByName("title").setString("顺");
                    }
                }
                if(handSort.name == "kan"){
                    clone.getChildByName("title").setString("坎");
                }
                if(handSort.name == "ti"){
                    clone.getChildByName("title").setString("提");
                }
                if(handSort.name == "peng"){
                    clone.getChildByName("title").setString("碰");
                }
            }else{
                clone.getChildByName("title").setString("将");
            }
            
            var cards = handSort.cards;
            var cardNum = 0;
            for (var i = 0; i < pl.mjhand.length; i++) {
                if (pl.mjhand[i] == tData.lastPutCard) {
                    cardNum++;
                }
            }

            for(i = 4;i >= 1; i--) {
                var up = clone.getChildByName("card" + i);
                var card = cards[i-1];
                if(card){
                    up.loadTexture(MjClient.cardPath_changDePaoHuZi+"out" + card + ".png");
                }else{
                    up.visible = false;
                }

                if (!(cardNum == 4 && cards[0] == tData.lastPutCard && cards.length == 3 && cards[0] == cards[1] && cards[0] == cards[2])) {
                    if (isWinner && isHand && card == huCard){
                        setHuCardMark_changDePaoHuZi(up,clone);
                        isHand = false;
                    }
                }
            }
            clone.setString(handSort.score);
            clone.setPosition(startPos);
            node.addChild(clone);
            startPos = cc.p(startPos.x + off_x, startPos.y);
        }
    }else if(tData.winner == -1 || uid != tData.uids[tData.winner]){
        var copyMjhand = pl.mjhand.concat();
        handSortArr = MjClient.majiang.sortHandCardSpecial(copyMjhand);

        var handCardTextFlag = true;
        var handCardText = null;
        for(var index in handSortArr){
            var handSort = handSortArr[index];
            clone = info.clone();
            clone.visible = true;
            if(handCardTextFlag){
                handCardText =  clone.getChildByName("title");
                handCardTextFlag = false;
            }else{
                clone.getChildByName("title").visible = false;
                handCardText.x += off_x / 2.8;
            }
            handCardText.setString("手牌");
            handCardText.ignoreContentAdaptWithSize(true);
            if(handSort.cards){
                var cards = handSort.cards;
            }else{
                var cards = handSort;
            }
            var cardNum = 0;
            for (var i = 0; i < pl.mjhand.length; i++) {
                if (pl.mjhand[i] == tData.lastPutCard) {
                    cardNum++;
                }
            }

            for(i = 4;i >= 1; i--) {
                var up = clone.getChildByName("card" + i);
                var card = cards[i-1];
                if(card){
                    up.loadTexture(MjClient.cardPath_changDePaoHuZi+"out" + card + ".png");
                }else{
                    up.visible = false;
                }

                if (!(cardNum == 4 && cards[0] == tData.lastPutCard && cards.length == 3 && cards[0] == cards[1] && cards[0] == cards[2])) {
                    if (isWinner && isHand && card == huCard){
                        setHuCardMark_changDePaoHuZi(up,clone);
                        isHand = false;
                    }
                }
            }
            clone.setString("");
            clone.setPosition(startPos);
            node.addChild(clone);
            startPos = cc.p(startPos.x + off_x / 1.4, startPos.y);
        }
    }
}

function setScore_changDePaoHuZi_new(node, pl){
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

function getMingTangInfo_changDePaoHuZi_new(name, tData){
        var infoData = {name:"",icon:"+"};
        var table = {ziMoJiaYiTun:"自摸",ziMo:"自摸",tianHu:"天胡", diHu:"地胡",haiHu:"海胡",haiDiLao:"海底捞",hongHu:"红胡",heiHu:"黑胡",
            dianHu:"点胡",daHu:"大字胡",xiaoHu:"小字胡",duiZiHu:"对子胡",shuaHou:"耍候",
            huangFan:"黄番",jiaHangHang:"假行行",siQiHong:"四七红",daTuanYuan:"大团圆",
            hangHangXi:"行行息",tingHu:"听胡",beiKaoBei:"背靠背",hongWu:"红乌",duoHong:"多红",jiaBeiKaoBei:"假背靠背",gaiGaiHu:"盖盖胡",
            sanTiWuKan:"三提五坎"};


        switch(name) {
            case "huangFan":
                infoData.icon = "x";
                break;
        }

        infoData.name = table[name] || "";
        return infoData;
}

function setPlayerWinner_changDePaoHuZi_new(node, pl) {
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
    CircularCuttingHeadImg_changDePaoHuZi_new(headBg, pl);

    setOfflineShow_changDePaoHuZi(headBg, pl);

    var playerName = node.getChildByName("playerName");
    playerName.ignoreContentAdaptWithSize(true);
    playerName.setString(sliceStrByLen_changDePaoHuZi(unescape(pl.info.nickname), 5));

    var cardInfo = node.getChildByName("cardInfo");
    var info = cardInfo.getChildByName("info");
    info.visible = false;
    setSortCard_changDePaoHuZi_new(cardInfo, pl);

    setScore_changDePaoHuZi_new(node, pl);

    var score = node.getChildByName("score");
    var huxi = node.getChildByName("huxi");
    if(tData.winner == -1 || tData.uids[tData.winner] != pl.info.uid){
        huxi.visible = false;
        score.x = node.width / 2;
        return;
    }

    var text_huXi = huxi.getChildByName("huXi").getChildByName("num");
    var text_tun = huxi.getChildByName("tun").getChildByName("num");
    var text_fan = huxi.getChildByName("fan").getChildByName("num");
    var text_zonTun = huxi.getChildByName("zonTun").getChildByName("num");

    text_huXi.setString(pl.hzdesc.huXi + "");
    text_tun.setString(pl.hzdesc.tunNum + "");
    text_fan.setString(pl.hzdesc.totalFan + "");
    text_zonTun.setString(pl.hzdesc.totalTun + "");

    // 名堂展示
    var mingTangItem = node.getChildByName("mingTangItem");
    mingTangItem.visible = false;
    var setHuItem = function(infoData, key, count){
        var mingTangItemClone = mingTangItem.clone();
        var content = "" + infoData.name;
        var value = "番";
        if(key == "ziMoJiaYiTun") {
            content += infoData.icon + pl.hzdesc[key] + "囤";
        }
        else {
            if (key == "huangFan") {
                value = "倍";
            }

            if (key == "daTuanYuan") { 
                // 常德跑胡子只有8 没有6
                content += infoData.icon + 8 + value;
            }
            else {
                content += infoData.icon + pl.hzdesc[key] + value;
            } 
        }

        node.addChild(mingTangItemClone);
        mingTangItemClone.setString(content);
        mingTangItemClone.x += count % 3 * mingTangItemClone.width;
        mingTangItemClone.y -= Math.floor(count / 3) * mingTangItemClone.height * 1.5;
        mingTangItemClone.visible = true;
    } 

    var count = 0;
    if (pl.hzdesc.hasOwnProperty("ziMoJiaYiTun")) {
        var infoData = this.getMingTangInfo_changDePaoHuZi_new("ziMoJiaYiTun", tData);
        setHuItem(infoData, "ziMoJiaYiTun", count++);
    }

    var otherKey = ["huXi", "totalFan", "tunNum", "totalTun", "ziMoJiaYiTun"];
    for (var key in pl.hzdesc) {
        var infoData = this.getMingTangInfo_changDePaoHuZi_new(key, tData);
        if (otherKey.indexOf(key) != -1) {
            cc.log("我不是名堂吗？");
        }
        else if(key == "daTuanYuan" && (pl.hzdesc[key] / 8) > 1){
            for (var i = 0; i < pl.hzdesc[key] / 8; i++) {
                setHuItem(infoData, key, count++); 
            }
        } 
        else {
            setHuItem(infoData, key, count++);
        }
    }
}

function setPlayerPlayer_changDePaoHuZi_new(node, pl) {
    if(SelfUid() == pl.info.uid){
        node.loadTexture("playing/waihuzi/g_s_1.png");
    }else{
        node.loadTexture("playing/waihuzi/g_s.png");
    }

    var headBg = node.getChildByName("headBg");
    CircularCuttingHeadImg_changDePaoHuZi_new(headBg, pl);

    setOfflineShow_changDePaoHuZi(headBg, pl);

    var playerName = node.getChildByName("playerName");
    playerName.ignoreContentAdaptWithSize(true);
    playerName.setString(sliceStrByLen_changDePaoHuZi(unescape(pl.info.nickname), 5));

    var cardInfo = node.getChildByName("cardInfo");
    var info = cardInfo.getChildByName("info");
    info.visible = false;
    setSortCard_changDePaoHuZi_new(cardInfo, pl);

    setScore_changDePaoHuZi_new(node, pl);
}

function addPlayerItem_changDePaoHuZi_new(node) {
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
    setPlayerWinner_changDePaoHuZi_new(item, sData.players[firstPlayer]);
    winner.x += winner.width;
    winner.x += 23;
    node.addChild(item);

    for(var uid in sData.players){
        if(uid == firstPlayer){
            continue;
        }
        var item;
        if(MjClient.MaxPlayerNum_changDePaoHuZi == 2){
            item = winner.clone();
            item.visible = true;
            setPlayerWinner_changDePaoHuZi_new(item, sData.players[uid]);

            winner.x += winner.width;
            winner.x += 23;
        }else{
            item = player.clone();
            item.visible = true;
            setPlayerPlayer_changDePaoHuZi_new(item, sData.players[uid]);

            player.y -= player.height;
            player.y -= 10;
        }
        node.addChild(item);
    }
}

var EndOneView_changDePaoHuZi_new = cc.Layer.extend({
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
                    addPlayerHandCards_changDePaoHuZi_new(this, MjClient.MaxPlayerNum_changDePaoHuZi - 1);
                }
            },
            rightPanel: {
                _run: function () {
                    if (MjClient.MaxPlayerNum_changDePaoHuZi == 2 || MjClient.rePlayVideo != -1) {
                        this.visible = false;
                    }
                    addPlayerHandCards_changDePaoHuZi_new(this, MjClient.MaxPlayerNum_changDePaoHuZi - 2);
                }
            },
        },
        resultPanel: {
            _layout: [[1, 1], [0.5, 0.5], [0, 0]],
            _run: function () {
                MjClient.endoneui.resultPanel = this;
                addPlayerItem_changDePaoHuZi_new(this);
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
                        addDiPaiCards_changDePaoHuZi_new(this);
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
                        addMaiPaiCards_changDePaoHuZi_new(this);
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
            },
            // 房间ID
            roomID:{
                _run: function(){
                    this.ignoreContentAdaptWithSize(true);
                },
                _text: function(){
                    var sData=MjClient.data.sData;
                    var tData=sData.tData;
                    return "房间号:" + tData.tableid;
                }
            },
            // 游戏结束时间
            roomTime: {
                _run: function(){
                    this.ignoreContentAdaptWithSize(true);
                },
                _text: function(){
                    return MjClient.roundEndTime;
                }
            },
            // 玩法名称
            roomInfo: {
                _run: function(){
                    this.ignoreContentAdaptWithSize(true);
                },
                _text:function(){
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    if (tData.gameCnName){
                        return tData.gameCnName;//"邵阳剥皮";
                    }else{
                        return GameCnName[MjClient.gameType];
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
                    // if(MjClient.rePlayVideo == -1 && 
                    //     !MjClient.data.sData.tData.areaSelectMode.isManualCutCard && 
                    //     !MjClient.endallui){
                    //         return;
                    // }else{
                        this.setPositionX(this.getParent().getContentSize().width/2);
                    // }
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
                    this.visible = false;
                    return;

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
                    this.setString(getRoundInfo_changDePaoHuZi());
                }
            },
        }
    },
    ctor: function () {
        this._super();
        MjClient.endoneui = this;
        var endoneui = ccs.load("endOne_changDePaoHuZi_new.json");
        BindUiAndLogic(endoneui.node, this.jsBind);
        this.addChild(endoneui.node);
        return true;
    }
});