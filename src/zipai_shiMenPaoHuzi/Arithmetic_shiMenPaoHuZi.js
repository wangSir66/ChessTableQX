var majiang_shiMenPaoHuZiLink = function(majiang) {
    var allCardsArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 91];
    var hunCard = -1;//混子列表
    var sortType = 1;//排序方式

    //设置混，参数是[]，必须设置
    majiang.setHun = function(hun){
        hunCard = hun;
    };

    majiang.hunCard = function(){
        return 91;
    };

    //是否是混子
    majiang.isEqualHunCard = function(card){
        return card == 91;
    };
    majiang.getTingStats = function(tb, pl, putCard) {
        if(!pl.canNotPutCard) return {};

        if (pl.canNotPutCard.indexOf(putCard) >= 0/* || putCard == KING*/) {
            return {};
        }

        var tingCards = this.getTingCards(tb, pl, putCard);

        var stats = {};
        for (var uid in tb.players) {
            function add(cd, num) {
                stats[cd] = stats[cd] ? stats[cd] + num : num;
            }

            var p = tb.players[uid];

            for (var i = 0; i < p.mjgang0.length; i++) {
                add(p.mjgang0[i], 4);
            }

            for (var i = 0; i < p.mjgang1.length; i++) {
                if(pl.info.uid == p.info.uid){
                    add(p.mjgang1[i], 4);
                }
            }

            for (var i = 0; i < p.mjpeng.length; i++) {
                add(p.mjpeng[i], 3);
            }

            for (var i = 0; i < p.mjwei.length; i++) {
                //安化跑胡子只有自己偎的或者别人明偎可见的才加到统计牌里面 （怀化红拐弯和湘潭跑胡子也一样）
                if (p.info.uid == pl.info.uid || (p.skipPeng && p.skipPeng.indexOf(p.mjwei[i]) >= 0)){
                    add(p.mjwei[i], 3);
                }
            }

            for (var i = 0; i < p.mjchi.length; i++) {
                var chiRow = p.mjchi[i].eatCards;
                for (var x = 0; x < 3; x++) {
                    add(chiRow[x], 1);
                }

                var biCards = p.mjchi[i].biCards;
                if (biCards) {
                    for (var j = 0; j < biCards.length; j++) {
                        var biRow = biCards[j];
                        for (var x = 0; x < 3; x++) {
                            add(biRow[x], 1);
                        }
                    }
                }
            }

            var tData = tb.tData;
            for (var i = 0; i < p.mjput.length; i++) {
                if (tData.tState == TableState.waitEat) { // 牌在展示阶段
                    if (p.info.uid == tData.uids[tData.curPlayer] && i == p.mjput.length - 1) {
                        continue;
                    }
                }
                add(p.mjput[i], 1);
            }

            if (p.info.uid == pl.info.uid) {
                for (var i = 0; i < p.mjhand.length; i++) {
                    add(p.mjhand[i], 1);
                }
            }
        }

        var tingStats = {};
        for (var i = 0; i < tingCards.length; i++) {
            var card = tingCards[i];
            var totalNum = 4;
            /*if (card == KING) {
             totalNum = tb.tData.areaSelectMode.kingNum;
             }*/
            tingStats[card] = totalNum - (stats[card] || 0);
        }

        return tingStats;
    };


    majiang.setJiaZhuNum = function (node, pl)
    {
        if(!pl) return;
        var icountNode = node.getChildByName("head").getChildByName("jiaZhu");
        var tData = MjClient.data.sData.tData;
        cc.log("===========举手 = " + pl.jiazhuNum);
        if(pl.jiazhuNum == 1) {
            icountNode.visible = true;
            icountNode.ignoreContentAdaptWithSize(true);
            icountNode.setString("举手");
        }else{
            icountNode.setString("");
        }
    };

    majiang.remove34Left = function(hand) {
        var cardNum = {};
        for (var i = 0; i < hand.length; i++) {
            var card = hand[i];
            cardNum[card] = cardNum[card] ? cardNum[card] + 1 : 1;
        }

        var count = 0;
        for (var k in cardNum) {
            if (cardNum[k] < 3) {
                count += cardNum[k];
            }
        }
        return count;
    }

    majiang.getChiCards = function(mjhand, card) {
        var tData = MjClient.data.sData.tData; // todo
        var chiSet = [];
        var handArr = mjhand.slice();
        var chiRules = [[-1,1],[1,2],[-1,-2]];
        for(var i=0;i<chiRules.length;i++){
            var rule = chiRules[i];
            var firstCard = card + rule[0];
            var secCard = card + rule[1];
            if(handArr.indexOf(firstCard)>=0 && majiang.cardHandCount(handArr,firstCard)<=2 &&
                handArr.indexOf(secCard)>=0 && majiang.cardHandCount(handArr,secCard)<=2)
            {
                var set = [card,firstCard,secCard];
                set.sort(function(a,b){
                    return a-b;
                });
                chiSet.push(set);
            }
        }

        var otherRules = [[2,7,10],[22,27,30]];
        if (tData && tData.areaSelectMode.isYiwushi) {
            otherRules.push([1, 5, 10], [21, 25, 30]);
        }
        for(var k = 0;k<otherRules.length;k++){
            var other = otherRules[k];
            var cardIndex = other.indexOf(card);
            if(cardIndex>=0){
                var ss = true;
                for(var i=0;i<other.length;i++){
                    if(other[i] == card){
                        continue;
                    }
                    if(handArr.indexOf(other[i])<0 || this.cardHandCount(handArr,other[i])>2){
                        ss = false;
                    }
                }
                if(ss){
                    chiSet.push(other);
                }
            }
        }


        var type = Math.ceil(card/10);
        var another = type==1?card+20:card-20;
        var anotherCount = majiang.cardHandCount(handArr,another);
        var cardCount = majiang.cardHandCount(handArr,card);
        if(anotherCount<=2 && cardCount<=2 && (anotherCount+cardCount)>=2){
            var set = null;
            console.log(anotherCount);
            if(anotherCount == 2){
                set = [card,another,another];
                set.sort(function(a,b){
                    return a-b;
                });
                chiSet.push(set);
                if(cardCount > 0){
                    set = [card,card,another];
                    set.sort(function(a,b){
                        return a-b;
                    });
                    chiSet.push(set);
                }
            }
            if(anotherCount == 1 && cardCount > 0){
                set = [card,card,another];
                set.sort(function(a,b){
                    return a-b;
                });
                chiSet.push(set);
            }
        }

        // console.log("chiSet@@ " + JSON.stringify(chiSet));

        var indexArr = [];
        for(var i = 0;i < chiSet.length;i++){
            var tmpSet = chiSet[i];
            var tmpCardArr = tmpSet.slice();
            tmpCardArr.splice(tmpCardArr.indexOf(card),1);

            var baseArr = mjhand.slice();
            for(var k = 0;k < tmpCardArr.length;k++){
                baseArr.splice(baseArr.indexOf(tmpCardArr[k]),1);
            }
            if(baseArr.indexOf(card) >= 0){
                // baseArr.splice(baseArr.indexOf(card),1);
                // console.log("取第一次比 baseArr@@ " + JSON.stringify(baseArr));
                var biCards = this.checkBi(baseArr, card, tData);
                // console.log("biCards@@ " + JSON.stringify(biCards));
                // 耒阳吃牌死手规避
                if(biCards.length == 0 || this.remove34Left(baseArr) <= 3) {
                    if(indexArr.indexOf(i) < 0){
                        indexArr.push(i);
                    }
                }else{
                    var failCount = 0;              //判断比牌中不满足需求的个数
                    for(var k = 0;k < biCards.length;k++){
                        var tmpBiSet = biCards[k];
                        // tmpBiSet.splice(tmpBiSet.indexOf(card),1);
                        var array = baseArr.slice();
                        for(var m = 0;m < tmpBiSet.length;m++){
                            array.splice(array.indexOf(tmpBiSet[m]),1);
                        }
                        if(array.indexOf(card) >= 0){
                            // array.splice(array.indexOf(card),1); // ??
                            // console.log("array@@@ " +JSON.stringify(array));
                            var secBiCards = this.checkBi(array, card, tData);
                            // console.log("secBiCards@@ " + JSON.stringify(secBiCards));
                            if(secBiCards.length == 0 || this.remove34Left(array) <= 3){
                                failCount ++;
                            }
                        }
                    }
                    if(failCount == biCards.length){
                        if(indexArr.indexOf(i) < 0){
                            indexArr.push(i);
                        }
                    }
                }
            }
        }
        for(var t = indexArr.length-1;t >= 0;t--){
            chiSet.splice(indexArr[t],1);
        }
        return this.sortChiBiCards(chiSet);
    };

    majiang.getBiCards = function(cardArr, card) {
        var tData = MjClient.data.sData.tData;
        var biSet = this.checkBi(cardArr,card, tData);
        //多次比牌的判断
        var indexArr = [];
        for(var i = 0;i < biSet.length;i++){
            var tmpCardArr = cardArr.slice();
            var tmpBiArr = biSet[i];
            for(var k = 0;k < tmpBiArr.length;k++){
                tmpCardArr.splice(tmpCardArr.indexOf(tmpBiArr[k]),1);
            }

            if(tmpCardArr.indexOf(card) >= 0){
                var tmpSet = this.checkBi(tmpCardArr, card, tData);
                // console.log("第二次比 tmpCardArr@@"　+ JSON.stringify(tmpCardArr));
                if(tmpSet.length == 0 || this.remove34Left(tmpCardArr) <= 3){
                    indexArr.push(i);
                }else{

                }
            }
        }
        for(var i = indexArr.length-1;i >= 0 ;i--){
            biSet.splice(i,1);
        }
        return this.sortChiBiCards(biSet);
    };

    majiang.checkBi = function(cardArr,card, tData){
        var chiSet = [];
        var chiRules = [[-1,1],[1,2],[-1,-2]];
        for(var i=0;i<chiRules.length;i++){
            var rule = chiRules[i];
            var firstCard = card + rule[0];
            var secCard = card + rule[1];
            if(cardArr.indexOf(firstCard)>=0 && majiang.cardHandCount(cardArr,firstCard)<=2 &&
                cardArr.indexOf(secCard)>=0 && majiang.cardHandCount(cardArr,secCard)<=2)
            {
                var set = [card,firstCard,secCard];
                set.sort(function(a,b){
                    return a-b;
                });
                chiSet.push(set);
            }
        }

        var otherRules = [[2,7,10],[22,27,30]];
        if (tData.areaSelectMode.isYiwushi) {
            otherRules.push([1, 5, 10], [21, 25, 30]);
        }
        for(var k = 0;k<otherRules.length;k++){
            var other = otherRules[k];
            var cardIndex = other.indexOf(card);
            if(cardIndex>=0){
                var ss = true;
                for(var i=0;i<other.length;i++){
                    if(cardArr.indexOf(other[i])<0 || majiang.cardHandCount(cardArr,other[i])>2){
                        ss = false;
                    }
                }
                if(ss){
                    chiSet.push(other);
                }
            }
        }

        var type = Math.ceil(card/10);
        var another = type==1?card+20:card-20;
        var anotherCount = majiang.cardHandCount(cardArr,another);
        var cardCount = majiang.cardHandCount(cardArr,card);
        var tmpCardCount = cardCount == 0?1:cardCount;
        if(anotherCount<=2 && tmpCardCount<=2 && (anotherCount+tmpCardCount)>=3){
            var set = null;
            if(anotherCount == 2){
                set = [card,another,another];
                set.sort(function(a,b){
                    return a-b;
                });
                chiSet.push(set);
                if(cardCount == 2){
                    set = [card,card,another];
                    set.sort(function(a,b){
                        return a-b;
                    });
                    chiSet.push(set);
                }
            }
            if(anotherCount == 1 && cardCount > 0){
                set = [card,card,another];
                set.sort(function(a,b){
                    return a-b;
                });
                chiSet.push(set);
            }
        }
        return chiSet;
    };

    majiang.cardHandCount = function (cardArr,card){
        var cardCount = 0;
        for(var i=0,length=cardArr.length;i<length;i++){
            if(cardArr[i] == card){
                cardCount ++ ;
            }
        }
        return cardCount;
    };

    majiang.getAllCardsTotal = function (){
        if (MjClient.data.sData.tData.areaSelectMode.maiPai20){
            return 80 - parseInt(MjClient.data.sData.tData.areaSelectMode.maiPaiType) * 10;
        }
        return 80;
    };

    majiang.sortByUser = function(arr) {
        if (!MjClient.HandCardArr) {
            return [];
        }
        var cardArr = MjClient.HandCardArr;
        if (arr) {
            cardArr = arr;
        }

        var tmpArr = [];
        for (var i = 0; i < cardArr.length; i++) {
            for (var k = 0; k < cardArr[i].length; k++) {
                tmpArr.push(cardArr[i][k]);
            }
        }

        var tData = MjClient.data.sData.tData;


        return this.sortCard(tmpArr);

       // return this.sortCard(tmpArr, null, tData);
    };

    majiang.sortHandCardSpecial = function(handArr) {
        var tData = MjClient.data.sData.tData;
        return this.sortCard(handArr, 1);
        //return this.sortCard(handArr, null, tData);
    };

    majiang.getRelateCount = function(hand, cd) {
        // 牌点少2，牌点少1，牌点等于，牌点大1，牌点大2，牌点一样 大小相反，组成2-7-10的其余牌 牌点较小的，组成2-7-10的其余牌 牌点较大的，组成1-5-10的其余牌 牌点较小的，组成1-5-10的其余牌 牌点较大的
        var num = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        if (cd == 2 || cd == 7 || cd == 10 || cd == 22 || cd == 27 || cd == 30 || cd == 1 || cd == 5 || cd == 21 || cd == 25) {
            switch (cd) {
                case 1:
                    for (var i in hand) {
                        if (hand[i] == 5) num[8]++;
                        if (hand[i] == 10) num[9]++;
                    }
                    break;
                case 2:
                    for (var i in hand) {
                        if (hand[i] == 7) num[6]++;
                        if (hand[i] == 10) num[7]++;
                    }
                    break;
                case 5:
                    for (var i in hand) {
                        if (hand[i] == 1) num[8]++;
                        if (hand[i] == 10) num[9]++;
                    }
                    break;
                case 7:
                    for (var i in hand) {
                        if (hand[i] == 2) num[6]++;
                        if (hand[i] == 10) num[7]++;
                    }
                    break;
                case 10:
                    for (var i in hand) {
                        if (hand[i] == 2) num[6]++;
                        if (hand[i] == 7) num[7]++;
                        if (hand[i] == 1) num[8]++;
                        if (hand[i] == 5) num[9]++;
                    }
                    break;
                case 21:
                    for (var i in hand) {
                        if (hand[i] == 25) num[8]++;
                        if (hand[i] == 30) num[9]++;
                    }
                    break;
                case 22:
                    for (var i in hand) {
                        if (hand[i] == 27) num[6]++;
                        if (hand[i] == 30) num[7]++;
                    }
                    break;
                case 25:
                    for (var i in hand) {
                        if (hand[i] == 21) num[8]++;
                        if (hand[i] == 30) num[9]++;
                    }
                    break;
                case 27:
                    for (var i in hand) {
                        if (hand[i] == 22) num[6]++;
                        if (hand[i] == 30) num[7]++;
                    }
                    break;
                case 30:
                    for (var i in hand) {
                        if (hand[i] == 22) num[6]++;
                        if (hand[i] == 27) num[7]++;
                        if (hand[i] == 21) num[8]++;
                        if (hand[i] == 25) num[9]++;
                    }
                    break;
            }
        }

        for (var i = 0; i < hand.length; i++) {
            var dif = hand[i] - cd;
            switch (dif) {
                case -2:
                case -1:
                case 0:
                case 1:
                case 2:
                    num[dif + 2]++;
                    break;
                case 20:
                case -20:
                    num[5]++;
                    break;
            }
        }

        return num;
    };

    function delCard(cardList, card, num) {
        num = num ? num : 1;
        for (var j in cardList) {
            if (cardList[j] == card) {
                cardList.splice(j, num);
                break;
            }
        }
    }

    var LimitHuType = {
        ka: 0, // 卡胡 无胡(如果选了)
        black: 1, // 黑胡 一点红(如果选了)
        red: 2 // 红胡
    }

    var putCard2LimitHu = {
        1: LimitHuType.ka, // 吃4打1
        21: LimitHuType.ka,
        2: LimitHuType.black, // 吃5打2
        22: LimitHuType.black,
        7: LimitHuType.black, // 吃4打7
        27: LimitHuType.black,
        4: LimitHuType.red, // 吃7打4
        24: LimitHuType.red,
        5: LimitHuType.red, // 吃2打5
        25: LimitHuType.red
    }

    // 限胡类型tip
    majiang.getLimitHuDesc = function(putCard, tData) {
        var desc = "";
        switch (putCard2LimitHu[putCard]) {
            case LimitHuType.ka:
                desc = "卡胡";
                if (!tData.areaSelectMode.budaihu) {
                    desc += ",无胡";
                }
                break;
            case LimitHuType.black:
                desc = "黑胡";
                if (!tData.areaSelectMode.budaiyihong) {
                    desc += ",一点红";
                }
                break;
            case LimitHuType.red:
                desc = "红胡";
                break;
            default:
                break;
        }

        return desc;
    }

    // 手牌排列胡息
    majiang.getHandHuxi = function(handMatrix) {
        var huxi = 0;
        for (var i = 0; i < handMatrix.length; i++) {
            if (handMatrix[i].length == 4) {
                if (handMatrix[i][0] == handMatrix[i][1] && handMatrix[i][0] == handMatrix[i][2] && handMatrix[i][0] == handMatrix[i][3]) {
                    huxi += handMatrix[i][0] > 20 ? 12 : 9;
                }
            }
            else if (handMatrix[i].length == 3) {
                if (handMatrix[i][0] == handMatrix[i][1] && handMatrix[i][0] == handMatrix[i][2]) {
                    huxi += handMatrix[i][0] > 20 ? 6 : 3;
                } else {
                    var row = [].concat(handMatrix[i]);
                    row.sort(function(a, b) {return a - b});

                    if (row[0] == 1 && row[1] == 2 && row[2] == 3) {
                        huxi += 3;
                    }
                    else if (row[0] == 21 && row[1] == 22 && row[2] == 23) {
                        huxi += 6;
                    }
                    else if (row[0] == 2 && row[1] == 7 && row[2] == 10) {
                        huxi += 3;
                    }
                    else if (row[0] == 22 && row[1] == 27 && row[2] == 30) {
                        huxi += 6;
                    }
                    else if (row[0] == 1 && row[1] == 5 && row[2] == 10) {
                        huxi += 3;
                    }
                    else if (row[0] == 21 && row[1] == 25 && row[2] == 30) {
                        huxi += 6;
                    }
                }
            }
        }
        return huxi;
    }

    // 获取能打牌的数量
    majiang.getCanPutCardNum = function(pl, usedCards) {
        usedCards = usedCards || [];
        var hand = [].concat(pl.mjhand);

        var cardNum = {};
        for (var i = 0; i < hand.length; i++) {
            var card = hand[i];
            cardNum[card] = cardNum[card] ? cardNum[card] + 1 : 1;
        }

        // 删除3张及以上牌
        for (var k in cardNum) {
            if (cardNum[k] >= 3) {
                for (var i = 0; i < cardNum[k]; i++) {
                    hand.splice(hand.indexOf(Number(k)), 1);
                }
            }
        }

        // 删除需要用掉的牌
        for (var i = 0; i < usedCards.length; i++) {
            var card = usedCards[i];
            var idx = hand.indexOf(card);
            if (idx >= 0) {
                hand.splice(idx, 1);
            }
        }

        var num = 0;
        var canNotPutCard = pl.canNotPutCard || [];
        for (var i = 0; i < hand.length; i++) {
            var card = hand[i];
            if (canNotPutCard.indexOf(card) < 0) {
                num++;
            }
        }

        return num;
    }

    // 提 偎牌展示方式 0.隐藏牌(非提偎牌玩家) 1.隐藏牌(提偎牌玩家自己展示)  2.展示
    majiang.getCardShowType = function(uid, card) {
        var sData = MjClient.data.sData;
        var tData = sData.tData;
        var pl = sData.players[uid];
        // 展示
        if (!(pl.mjHide && pl.mjHide.indexOf(card) >= 0)) {
            return 2;
        }

        // 隐藏牌 提偎牌玩家自己展示
        if (uid == SelfUid()) {
            return 2;
        }

        return 0;
    }

    majiang.sortChiBiCards = function(arr){
        var arr = arr.concat();
        arr.sort(function(a1, a2){
            var isSame1 = (a1[0] % 10 == a1[1] % 10) && (a1[1] % 10  == a1[2] % 10);
            var isSame2 = (a2[0] % 10 == a2[1] % 10) && (a2[1] % 10  == a2[2] % 10);
            if(isSame1 && isSame2){
                return 0;
            }else if(isSame1){
                return -1;
            }else{
                return 1;
            }
        });
        return arr;
    };
};

// 字牌算法 (计算听牌用)
(function() {
    var ROW_TYPE = {
        xi: 0,
        noXi: 1,
        jiao: 2,
        dui: 3
    }

    // 有胡息组合 // todo 1-5-10
    var xiList = [
        [2, 7, 10, ],
        [22, 27, 30],
        [1, 2, 3],
        [21, 22, 23]
    ];

    // 绞牌
    var jiaoList = [];
    for (var i = 1; i <= 10; i++) {
        jiaoList.push([i + 20, i, i], [i + 20, i + 20, i]);
    }

    // 无胡息组合(绞牌除外)
    var noXiList = [];
    for (var i = 2; i <= 8; i++) {
        noXiList.push([i, i + 1, i + 2], [i + 20, i + 21, i + 22]);
    }

    // 对子
    var duiList = [];
    for (var i = 1; i <= 10; i++) {
        duiList.push([i, i], [i + 20, i + 20]);
    }

    var huzi = function() {
        this.LimitHuType = {
            ka: 0, // 卡胡 无胡(如果选了)
            black: 1, // 黑胡 一点红(如果选了)
            red: 2 // 红胡
        }

        this.sortType = 1;
    };

    huzi.prototype.getRelateCount = function(hand, card) {
        // 牌点少2，牌点少1，牌点等于，牌点大1，牌点大2，牌点一样 大小相反，组成2-7-10的其余牌 牌点较小的，组成2-7-10的其余牌 牌点较大的，组成1-5-10的其余牌 牌点较小的，组成1-5-10的其余牌 牌点较大的
        var num = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        if (card == 2 || card == 7 || card == 10 || card == 22 || card == 27 || card == 30 || card == 1 || card == 5 || card == 21 || card == 25) {
            switch (card) {
                case 1:
                    for (var i in hand) {
                        if (hand[i] == 5) num[8]++;
                        if (hand[i] == 10) num[9]++;
                    }
                    break;
                case 2:
                    for (var i in hand) {
                        if (hand[i] == 7) num[6]++;
                        if (hand[i] == 10) num[7]++;
                    }
                    break;
                case 5:
                    for (var i in hand) {
                        if (hand[i] == 1) num[8]++;
                        if (hand[i] == 10) num[9]++;
                    }
                    break;
                case 7:
                    for (var i in hand) {
                        if (hand[i] == 2) num[6]++;
                        if (hand[i] == 10) num[7]++;
                    }
                    break;
                case 10:
                    for (var i in hand) {
                        if (hand[i] == 2) num[6]++;
                        if (hand[i] == 7) num[7]++;
                        if (hand[i] == 1) num[8]++;
                        if (hand[i] == 5) num[9]++;
                    }
                    break;
                case 21:
                    for (var i in hand) {
                        if (hand[i] == 25) num[8]++;
                        if (hand[i] == 30) num[9]++;
                    }
                    break;
                case 22:
                    for (var i in hand) {
                        if (hand[i] == 27) num[6]++;
                        if (hand[i] == 30) num[7]++;
                    }
                    break;
                case 25:
                    for (var i in hand) {
                        if (hand[i] == 21) num[8]++;
                        if (hand[i] == 30) num[9]++;
                    }
                    break;
                case 27:
                    for (var i in hand) {
                        if (hand[i] == 22) num[6]++;
                        if (hand[i] == 30) num[7]++;
                    }
                    break;
                case 30:
                    for (var i in hand) {
                        if (hand[i] == 22) num[6]++;
                        if (hand[i] == 27) num[7]++;
                        if (hand[i] == 21) num[8]++;
                        if (hand[i] == 25) num[9]++;
                    }
                    break;
            }
        }

        for (var i = 0; i < hand.length; i++) {
            var dif = hand[i] - card;
            switch (dif) {
                case -2:
                case -1:
                case 0:
                case 1:
                case 2:
                    num[dif + 2]++;
                    break;
                case 20:
                case -20:
                    num[5]++;
                    break;
            }
        }

        return num;
    }

    huzi.prototype.getAllCardCount = function(pl){
        var rtn = (pl.mjgang0.length + pl.mjgang1.length) * 4 + (pl.mjpeng.length + pl.mjwei.length) * 3;
        // todo 吃牌处理
        for (var i = 0; i < pl.mjchi.length; i++) {
            rtn += 3;

            var biCards = pl.mjchi[i].biCards;
            if (biCards) {
                for (var j = 0; j < biCards.length; j++) {
                    var biRow = biCards[j];
                    rtn += 3;
                }
            }
        }
        if (pl.mjhand) rtn += pl.mjhand.length;
        return rtn;
    };

    huzi.prototype.handNum = function(pl, card) {
        var rtn = 0;
        for (var i = 0; i < pl.mjhand.length; i++) {
            if (pl.mjhand[i] == card) rtn++;
        }
        return rtn;
    }

    huzi.prototype.isRed = function(card) {
        return (card % 20 == 2 || card % 20 == 7 || card % 20 == 10)
    }

    huzi.prototype.blackRedNum = function(pl, card) {
        var rtn = [0, 0];
        var cards = [pl.mjhand, pl.mjpeng, pl.mjwei, pl.mjgang0, pl.mjgang1];
        for (var i = 0; i < cards.length; i++) {
            var cds = cards[i];
            for (var j = 0; j < cds.length; j++) {
                var ct = 0;
                if (i <= 0) ct = 1;
                else if (i <= 2) ct = 3;
                else ct = 4;
                if (this.isRed(cds[j])) {
                    rtn[1] += ct;
                } else {
                    rtn[0] += ct;
                }
            }
        }

        for (var i = 0; i < pl.mjchi.length; i++) {
            var chiRow = pl.mjchi[i].eatCards;
            for (var x = 0; x < 3; x++) {
                if (this.isRed(chiRow[x])) {
                    rtn[1] += 1;
                } else {
                    rtn[0] += 1;
                }
            }

            var biCards = pl.mjchi[i].biCards;
            if (biCards) {
                for (var j = 0; j < biCards.length; j++) {
                    var biRow = biCards[j];
                    for (var x = 0; x < 3; x++) {
                        if (this.isRed(biRow[x])) {
                            rtn[1] += 1;
                        } else {
                            rtn[0] += 1;
                        }
                    }
                }
            }
        }

        if (card) {
            if (this.isRed(card)) {
                rtn[1]++;
            } else {
                rtn[0]++;
            }
        }

        return rtn;
    }

    // 能否胡牌
    huzi.prototype.canHu = function(tb, pl, card) {
        var huMatrix = [];
        var allHuMatrix_pao = null;
        var max_pao = null;
        var canPaoHu = false;
        var maxWinOne = 0; // 过胡判断用
        // 能否跑胡
        if (card) {
            var plCpy = {
                mjpeng: [],
                mjwei: [],
                mjgang0: [],
                mjgang1: [],
                mjchi: [],
                mjhand: []
            }
            for (var k in plCpy) {
                plCpy[k] = Array.prototype.concat.apply([], pl[k]);
            }
            plCpy.uid = pl.uid;
            plCpy.limitHuTypeList = pl.limitHuTypeList || [];
            plCpy.isPutCardOnce = pl.isPutCardOnce;

            var canPao = false;
            if (plCpy.mjpeng.indexOf(card) >= 0 && tb.tData.putType == 1) {
                plCpy.mjpeng.splice(plCpy.mjpeng.indexOf(card), 1);
                canPao = true;
            } else if (plCpy.mjwei.indexOf(card) >= 0) {
                plCpy.mjwei.splice(plCpy.mjwei.indexOf(card), 1);
                canPao = true;
            } else if (this.handNum(plCpy, card) == 3) {
                canPao = true;
                for (var i = 0; i < 3; i++) {
                    plCpy.mjhand.splice(plCpy.mjhand.indexOf(card), 1);
                }
            }

            if (canPao && plCpy.mjhand.length > 0) {
                plCpy.mjgang0.push(card);
                allHuMatrix_pao = this.canHuHand(plCpy, null, tb.tData.areaSelectMode.isYiwushi);
                if (allHuMatrix_pao.length > 0) {
                    max_pao = this.maxHu(tb, plCpy, null, allHuMatrix_pao);
                    var minHuxi = tb.tData.minHuxi;
                    if (this.getHuxi(tb, plCpy, null, false) + max_pao.maxHuxi >= minHuxi
                        || ((tb.tData.areaSelectMode.maoHuType && this.getHuxi(tb, plCpy, card, false) + max_pao.maxHuxi == 0))
                    ) {
                        canPaoHu = true;
                    }
                }
            }
        }

        var allHuMatrix = this.canHuHand(pl, card, tb.tData.areaSelectMode.isYiwushi);
        if (allHuMatrix.length > 0) {
            var max = this.maxHu(tb, pl, card, allHuMatrix);
            var minHuxi = tb.tData.minHuxi;
            if (this.getHuxi(tb, pl, card, false) + max.maxHuxi >= minHuxi
                || ((tb.tData.areaSelectMode.maoHuType && this.getHuxi(tb, pl, card, false) + max.maxHuxi == 0))
            ) {
                if (!(canPaoHu && max_pao.maxWinOne > max.maxWinOne)) {
                    huMatrix.push(allHuMatrix[max.maxIdx]);
                    maxWinOne = max.maxWinOne;
                }
            }
        }

        if (canPaoHu && huMatrix.length == 0) {
            var row = [[card, card, card, card]];
            huMatrix.push(row.concat(allHuMatrix_pao[max_pao.maxIdx]));
            maxWinOne = max_pao.maxWinOne;
        }
        return {huMatrix: huMatrix, maxWinOne: maxWinOne};
    }

    // 获取胡牌组合
    huzi.prototype.canHuHand = function(pl, card, hasFiveTypeRow) {
        var self = this;
        hand = [].concat(pl.mjhand);
        if (card) hand.push(card);

        var huMatrix = [];
        var allHuMatrix = [];

        if (card === undefined) {
            return allHuMatrix;
        }

        var cardNum = {};
        for (var k = 0; k < hand.length; k++) {
            if (cardNum[hand[k]])
                cardNum[hand[k]]++;
            else
                cardNum[hand[k]] = 1;
        }

        // p破跑
        if (card && cardNum[card] == 4) {
            huMatrix.push([card, card, card]);
            cardNum[card] -= 3;
        }

        var longNum = 0;
        // 坎 垅
        for (var k in cardNum) {
            if ((cardNum[k] == 3 && !(card && Number(k) == card)) || cardNum[k] == 4) {
                var cardRow = [];
                for (var i = 1; i <= cardNum[k]; ++i) {
                    cardRow.push(Number(k));
                }
                huMatrix.push(cardRow);

                if (cardNum[k] == 4) {
                    longNum++;
                }
            }
        }

        //提 龙 跑 需要计算牌数够胡
        var allCardCount = this.getAllCardCount(pl);
        if (card) allCardCount++;

        var initHandCount = 14;
        if (allCardCount >= 21){
            initHandCount = 20;
        }

        if (allCardCount - pl.mjgang0.length - pl.mjgang1.length - longNum < initHandCount) {
            return [];
        }

        var twoIdxTab = [];
        var popTwoIdx = -1;

        var fiveIdxTab = [];
        var popFiveIdx = -1;

        var popColIdx = -1;
        var colLinkNum = [];

        function hu() {
            var isRowHu = true;
            var tmpHuMatrix = [].concat(huMatrix);

            function getRow() {
                for (var k in cardNum) //是否顺序 遍历?！！！！！
                {
                    if (cardNum[k] > 0 && cardNum[k] < 3) {
                        var myK = parseInt(k);
                        if (myK % 20 < 9 && cardNum[myK + 1] > 0 && cardNum[myK + 1] < 3 && cardNum[myK + 2] > 0 && cardNum[myK + 2] < 3) {
                            cardNum[myK]--;
                            cardNum[myK + 1]--;
                            cardNum[myK + 2]--;
                            tmpHuMatrix.push([myK, myK + 1, myK + 2]);
                            getRow();
                            cardNum[myK]++;
                            cardNum[myK + 1]++;
                            cardNum[myK + 2]++;
                        } else {
                            isRowHu = false;
                        }
                        break;
                    } else if (cardNum[k] < 0) // bug 算胡时多牌了
                    {
                        isRowHu = false;
                    }
                }
            }
            getRow();
            if (isRowHu) {
                allHuMatrix.push(tmpHuMatrix);
            }

            for (var i = 0; i <= 9; i++) {
                if (i >= popColIdx && colLinkNum[i] >= 3) {
                    if (i == popColIdx && colLinkNum[i] == 4) {
                        // console.log("InCol:" + popColIdx);
                        popColIdx = i + 0.5;
                        cardNum[i + 1] -= 1;
                        cardNum[i + 21] -= 2;
                        colLinkNum[i] -= 3;
                        huMatrix.push([i + 21, i + 21, i + 1]);
                        hu();
                        huMatrix.pop();
                        colLinkNum[i] += 3;
                        cardNum[i + 1] += 1;
                        cardNum[i + 21] += 2;
                        popColIdx = i + 0.5;
                        // console.log("outCol:" + popColIdx);
                    } else if (i > popColIdx) {
                        popColIdx = i;
                        // console.log("inCol:" +  popColIdx);
                        colLinkNum[i] -= 3;
                        if (cardNum[i + 1] == 2) {
                            if (colLinkNum[i] == 1) {
                                cardNum[i + 1] -= 2;
                                cardNum[i + 21] -= 1;
                                huMatrix.push([i + 21, i + 1, i + 1]);
                                hu();
                                popColIdx = i;
                                colLinkNum[i] += 3;
                                huMatrix.pop();
                                cardNum[i + 1] += 2;
                                cardNum[i + 21] += 1;
                                i--; // 这种情况i 还是原值
                            } else {
                                cardNum[i + 1] -= 2;
                                cardNum[i + 21] -= 1;
                                huMatrix.push([i + 21, i + 1, i + 1]);
                                hu();
                                huMatrix.pop();
                                popColIdx = i;
                                colLinkNum[i] += 3;
                                cardNum[i + 1] += 2;
                                cardNum[i + 21] += 1;
                            }
                        } else if (cardNum[i + 1] == 1) {
                            cardNum[i + 1] -= 1;
                            cardNum[i + 21] -= 2;
                            huMatrix.push([i + 21, i + 21, i + 1]);
                            hu();
                            huMatrix.pop();
                            popColIdx = i;
                            colLinkNum[i] += 3;
                            cardNum[i + 1] += 1;
                            cardNum[i + 21] += 2;
                        }
                        // console.log("outCol:" + popColIdx);
                    }
                }
            }
        }

        function noFiveTypeHu() {
            popColIdx = -1;
            colLinkNum = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            for (var i = 0; i <= 9; i++) {
                if (cardNum[i + 1] < 3) {
                    colLinkNum[i] += cardNum[i + 1];
                }

                if (cardNum[i + 21] < 3) {
                    colLinkNum[i] += cardNum[i + 21];
                }
            }
            // console.log(colLinkNum);
            hu();

            for (var i = 0; i < fiveIdxTab.length; i++) {
                if (fiveIdxTab[i] > popFiveIdx) {
                    // console.log("------InFiveIdx" + fiveIdxTab[i])
                    popFiveIdx = fiveIdxTab[i];
                    switch (fiveIdxTab[i]) {
                        case 1:
                            cardNum[1]--;
                            cardNum[5]--;
                            cardNum[10]--;
                            huMatrix.push([1, 5, 10]);
                            noFiveTypeHu();
                            huMatrix.pop();
                            cardNum[1]++;
                            cardNum[5]++;
                            cardNum[10]++;
                            break;
                        case 2:
                            cardNum[1]--;
                            cardNum[5]--;
                            cardNum[10]--;
                            huMatrix.push([1, 5, 10]);
                            noFiveTypeHu();
                            huMatrix.pop();
                            cardNum[1]++;
                            cardNum[5]++;
                            cardNum[10]++;
                            break;
                        case 3:
                            cardNum[21]--;
                            cardNum[25]--;
                            cardNum[30]--;
                            huMatrix.push([21, 25, 30]);
                            noFiveTypeHu();
                            huMatrix.pop();
                            cardNum[21]++;
                            cardNum[25]++;
                            cardNum[30]++;
                            break;
                        case 4:
                            cardNum[21]--;
                            cardNum[25]--;
                            cardNum[30]--;
                            huMatrix.push([21, 25, 30]);
                            noFiveTypeHu();
                            huMatrix.pop();
                            cardNum[21]++;
                            cardNum[25]++;
                            cardNum[30]++;
                            break;
                    }
                    popFiveIdx = fiveIdxTab[i];
                    // console.log("------outFiveIdx" + fiveIdxTab[i])
                }
            }
        }

        function noTwoTypeHu() {
            if (hasFiveTypeRow) {
                popFiveIdx = -1;
                fiveIdxTab = [];
                if (cardNum[1] > 0 && cardNum[1] < 3 && cardNum[5] > 0 && cardNum[5] < 3 && cardNum[10] > 0 && cardNum[10] < 3)
                    fiveIdxTab.push(1);
                if (cardNum[1] == 2 && cardNum[5] == 2 && cardNum[10] == 2)
                    fiveIdxTab.push(2);
                if (cardNum[21] > 0 && cardNum[21] < 3 && cardNum[25] > 0 && cardNum[25] < 3 && cardNum[30] > 0 && cardNum[30] < 3)
                    fiveIdxTab.push(3);
                if (cardNum[21] == 2 && cardNum[25] == 2 && cardNum[30] == 2)
                    fiveIdxTab.push(4);

                noFiveTypeHu();
            } else {
                popColIdx = -1;
                colLinkNum = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                for (var i = 0; i <= 9; i++) {
                    if (cardNum[i + 1] < 3) {
                        colLinkNum[i] += cardNum[i + 1];
                    }

                    if (cardNum[i + 21] < 3) {
                        colLinkNum[i] += cardNum[i + 21];
                    }
                }
                // console.log(colLinkNum);
                hu();
            }

            for (var i = 0; i < twoIdxTab.length; i++) {
                if (twoIdxTab[i] > popTwoIdx) {
                    // console.log("-----------------------InTwoIdx" + twoIdxTab[i])
                    popTwoIdx = twoIdxTab[i];
                    switch (twoIdxTab[i]) {
                        case 1:
                            cardNum[2]--;
                            cardNum[7]--;
                            cardNum[10]--;
                            huMatrix.push([2, 7, 10]);
                            noTwoTypeHu();
                            huMatrix.pop();
                            cardNum[2]++;
                            cardNum[7]++;
                            cardNum[10]++;
                            break;
                        case 2:
                            cardNum[2]--;
                            cardNum[7]--;
                            cardNum[10]--;
                            huMatrix.push([2, 7, 10]);
                            noTwoTypeHu();
                            huMatrix.pop();
                            cardNum[2]++;
                            cardNum[7]++;
                            cardNum[10]++;
                            break;
                        case 3:
                            cardNum[22]--;
                            cardNum[27]--;
                            cardNum[30]--;
                            huMatrix.push([22, 27, 30]);
                            noTwoTypeHu();
                            huMatrix.pop();
                            cardNum[22]++;
                            cardNum[27]++;
                            cardNum[30]++;
                            break;
                        case 4:
                            cardNum[22]--;
                            cardNum[27]--;
                            cardNum[30]--;
                            huMatrix.push([22, 27, 30]);
                            noTwoTypeHu();
                            huMatrix.pop();
                            cardNum[22]++;
                            cardNum[27]++;
                            cardNum[30]++;
                            break;
                    }
                    popTwoIdx = twoIdxTab[i];
                    // console.log("-----------------------outTwoIdx" + twoIdxTab[i])
                }
            }
        }

        function initTwoIdxTab() {
            popTwoIdx = -1;

            twoIdxTab = [];
            if (cardNum[2] > 0 && cardNum[2] < 3 && cardNum[7] > 0 && cardNum[7] < 3 && cardNum[10] > 0 && cardNum[10] < 3)
                twoIdxTab.push(1);
            if (cardNum[2] == 2 && cardNum[7] == 2 && cardNum[10] == 2)
                twoIdxTab.push(2);
            if (cardNum[22] > 0 && cardNum[22] < 3 && cardNum[27] > 0 && cardNum[27] < 3 && cardNum[30] > 0 && cardNum[30] < 3)
                twoIdxTab.push(3);
            if (cardNum[22] == 2 && cardNum[27] == 2 && cardNum[30] == 2)
                twoIdxTab.push(4);
        }

        function twoCardInHandHu() {
            // 手牌里有两张 card一样的
            if (card && cardNum[card] == 3) {
                var num = self.getRelateCount(hand, card);

                if (num[3] > 0 && num[3] < 3 && num[4] > 0 && num[4] < 3) {
                    // console.log("inChi 0");
                    cardNum[card]--;
                    cardNum[card + 1]--;
                    cardNum[card + 2]--;
                    huMatrix.push([card, card + 1, card + 2]);
                    initTwoIdxTab();
                    noTwoTypeHu();
                    huMatrix.pop();
                    cardNum[card]++;
                    cardNum[card + 1]++;
                    cardNum[card + 2]++;
                    // console.log("outChi 0");
                }

                if (num[1] > 0 && num[1] < 3 && num[3] > 0 && num[3] < 3) {
                    // console.log("inChi 1");
                    cardNum[card - 1]--;
                    cardNum[card]--;
                    cardNum[card + 1]--;
                    huMatrix.push([card - 1, card, card + 1]);
                    initTwoIdxTab();
                    noTwoTypeHu();
                    huMatrix.pop();
                    cardNum[card - 1]++;
                    cardNum[card]++;
                    cardNum[card + 1]++;
                    // console.log("outChi 1");
                }

                if (num[0] > 0 && num[0] < 3 && num[1] > 0 && num[1] < 3) {
                    // console.log("inChi 2");
                    cardNum[card - 2]--;
                    cardNum[card - 1]--;
                    cardNum[card]--;
                    huMatrix.push([card - 2, card - 1, card]);
                    initTwoIdxTab();
                    noTwoTypeHu();
                    huMatrix.pop();
                    cardNum[card - 2]++;
                    cardNum[card - 1]++;
                    cardNum[card]++;
                    // console.log("outChi 2");
                }

                if (num[5] > 0 && num[5] < 3) {
                    // console.log("inChi 3");
                    var distance = card < 20 ? 20 : -20;
                    cardNum[card] -= 2;
                    cardNum[card + distance]--;
                    if (card < 20)
                        huMatrix.push([card + 20, card, card]);
                    else
                        huMatrix.push([card, card, card - 20]);
                    initTwoIdxTab();
                    noTwoTypeHu();
                    huMatrix.pop();
                    cardNum[card] += 2;
                    cardNum[card + distance]++;
                    // console.log("outChi 3");
                }

                if (num[5] == 2) {
                    // console.log("inChi 4");
                    var distance = card < 20 ? 20 : -20;
                    cardNum[card + distance] -= 2;
                    cardNum[card]--;
                    if (card < 20)
                        huMatrix.push([card + 20, card + 20, card]);
                    else
                        huMatrix.push([card, card - 20, card - 20]);
                    initTwoIdxTab();
                    noTwoTypeHu();
                    huMatrix.pop();
                    cardNum[card + distance] += 2;
                    cardNum[card]++;
                    // console.log("outChi 4");
                }

                if (num[6] > 0 && num[6] < 3 && num[7] > 0 && num[7] < 3) {
                    // console.log("inChi 5");
                    var distance = card < 20 ? 0 : 20;
                    cardNum[2 + distance]--;
                    cardNum[7 + distance]--;
                    cardNum[10 + distance]--;
                    huMatrix.push([2 + distance, 7 + distance, 10 + distance]);
                    initTwoIdxTab();
                    noTwoTypeHu();
                    huMatrix.pop();
                    cardNum[2 + distance]++;
                    cardNum[7 + distance]++;
                    cardNum[10 + distance]++;
                    // console.log("outChi 5");
                }
            }
        }

        // console.log(longNum);
        // 不需要将
        if (hand.length % 3 == 0 && longNum == 0) {
            if (card && cardNum[card] == 3) {
                huMatrix.push([card, card, card]);
            }
            initTwoIdxTab();
            noTwoTypeHu();
            if (card && cardNum[card] == 3) {
                huMatrix.pop();
            }

            twoCardInHandHu();
        }
        // else if (hand.length % 3 == 2) // 需要将
        else { // 需要将
            for (var k in cardNum) {
                if (cardNum[k] == 2 || (card && k == card && cardNum[k] == 3)) {
                    // console.log("inJiang   " + k)
                    cardNum[k] -= 2;
                    hand.splice(hand.indexOf(parseInt(k)), 1); // twoCardInHandHu()需要用到hand
                    hand.splice(hand.indexOf(parseInt(k)), 1);
                    huMatrix.push([parseInt(k), parseInt(k)]);
                    if (card && cardNum[card] == 3) {
                        huMatrix.push([card, card, card]);
                    }
                    initTwoIdxTab();
                    noTwoTypeHu();
                    if (card && cardNum[card] == 3) {
                        huMatrix.pop();
                    }

                    twoCardInHandHu();

                    huMatrix.pop();
                    cardNum[k] += 2;
                    hand.push(parseInt(k));
                    hand.push(parseInt(k));
                    // console.log("outJiang   " + k)
                }
            }
        }

        return allHuMatrix;
    }

    // 最大胡牌
    huzi.prototype.maxHu = function(tb, pl, card, allHuMatrix) {
        var maxWinOne = -1;
        var maxHandScore = 0;
        var maxHandIdx = 0;
        // // todo 跑胡没算 次方法不能不传allHuMatrix直接调用
        // if (!allHuMatrix) {
        // 	allHuMatrix = this.canHuHand(pl, card);
        // }

        for (var m = 0; m < allHuMatrix.length; m++) {
            var handScore = 0;
            var winOne = 0;
            var huMatrix = allHuMatrix[m];
            for (var j = 0; j < huMatrix.length; j++) {
                if (huMatrix[j].length == 3) {
                    if (huMatrix[j][0] == huMatrix[j][1] && huMatrix[j][0] == huMatrix[j][2]) {
                        if (card && card == huMatrix[j][1]) {
                            var cardInHandNum = 0;
                            for (var k = 0; k < pl.mjhand.length; k++) {
                                if (pl.mjhand[k] == card)
                                    cardInHandNum++;
                            }

                            if (cardInHandNum >= 3)
                                handScore += huMatrix[j][1] < 20 ? 3 : 6;
                            else if (cardInHandNum == 2) {
                                handScore += huMatrix[j][0] < 20 ? 1 : 3;
                            } else if (cardInHandNum <= 1) // 王变坎
                            {
                                handScore += huMatrix[j][0] < 20 ? 3 : 6;
                            }
                        } else
                            handScore += huMatrix[j][1] < 20 ? 3 : 6;
                    } else {
                        handScore += getRowHuxi(huMatrix[j]);
                    }
                } else if (huMatrix[j].length == 4) // 手牌垅
                {
                    handScore += huMatrix[j][0] > 20 ? 12 : 9;
                }
            }

            var tData = tb.tData;
            var totalHuxi = this.getHuxi(tb, pl, card, false) + handScore;
            winOne = totalHuxi;

            if (tData.gameType == MjClient.GAME_TYPE.ZP_LY_CHZ) { // 耒阳卡胡 无胡处理
                if (totalHuxi == 0 && !tb.tData.areaSelectMode.budaihu) {
                    winOne = 21;
                } else if (totalHuxi == 10) {
                    winOne = 16;
                } else if (totalHuxi == 20) {
                    winOne = 24;
                } else if (pl.limitHuTypeList.indexOf(this.LimitHuType.ka) >= 0) { // 必须卡胡
                    winOne = 0;
                    handScore = -100; // 手牌胡息置负数 不能胡
                }

                // 考虑红黑胡  过炮比较需要 (更高分牌型)
                if (card) pl.mjhand.push(card);
                var blackRedNum = this.blackRedNum(pl);
                if (card) pl.mjhand.pop();
                if (blackRedNum[1] == 0) {
                    winOne *= 2;
                } else if (blackRedNum[1] == 1 && !tb.tData.areaSelectMode.budaiyihong) {
                    winOne *= 2;
                } else if (pl.limitHuTypeList.indexOf(this.LimitHuType.black) >= 0) { // 必须黑胡 一点红
                    winOne = 0;
                    handScore = -100; // 手牌胡息置负数 不能胡
                }

                if (blackRedNum[1] >= 13) {
                    winOne *= 2;
                } else if (pl.limitHuTypeList.indexOf(this.LimitHuType.red) >= 0) { // 必须红胡
                    winOne = 0;
                    handScore = -100; // 手牌胡息置负数 不能胡
                }
            } else if (tData.gameType == MjClient.GAME_TYPE.HY_SHI_HU_KA) { // 十胡卡 10胡处理
                if (totalHuxi == 10) {
                    winOne = 15;
                }
            }

            if (winOne > maxWinOne) {
                maxHandIdx = m;
                maxHandScore = handScore;
                maxWinOne = winOne;
            }
        }

        return {"maxIdx": maxHandIdx, "maxHuxi": maxHandScore, "maxWinOne": maxWinOne};
    }

    function getRowHuxi(chiRow) {
        var score = 0;
        chiRow = [].concat(chiRow);

        chiRow.sort(function(a, b) {
            return a - b
        });

        if (chiRow[0] == 1 && chiRow[1] == 2 && chiRow[2] == 3) {
            score += 3;
        } else if (chiRow[0] == 21 && chiRow[1] == 22 && chiRow[2] == 23) {
            score += 6;
        } else if (chiRow[0] == 2 && chiRow[1] == 7 && chiRow[2] == 10) {
            score += 3;
        } else if (chiRow[0] == 22 && chiRow[1] == 27 && chiRow[2] == 30) {
            score += 6;
        } else if (chiRow[0] == 1 && chiRow[1] == 5 && chiRow[2] == 10) {
            score += 3;
        } else if (chiRow[0] == 21 && chiRow[1] == 25 && chiRow[2] == 30) {
            score += 6;
        }
        return score;
    }

    // 胡息
    huzi.prototype.getHuxi = function(tb, pl, card, isWithHand) {
        var score = 0;
        // 提
        for (var i = 0; i < pl.mjgang1.length; i++) {
            score += pl.mjgang1[i] < 20 ? 9 : 12;
        }

        // 跑
        for (var i = 0; i < pl.mjgang0.length; i++) {
            score += pl.mjgang0[i] < 20 ? 6 : 9;
        }

        // 偎
        for (var i = 0; i < pl.mjwei.length; i++) {
            score += pl.mjwei[i] < 20 ? 3 : 6;
        }

        // 碰
        for (var i = 0; i < pl.mjpeng.length; i++) {
            score += pl.mjpeng[i] < 20 ? 1 : 3;
        }

        // 吃
        for (var i = 0; i < pl.mjchi.length; i++) {
            var chiRow = pl.mjchi[i].eatCards;
            score += getRowHuxi(chiRow);

            var biCards = pl.mjchi[i].biCards;
            if (biCards) {
                for (var j = 0; j < biCards.length; j++) {
                    var biRow = biCards[j];
                    score += getRowHuxi(biRow);
                }
            }
        }

        return score;

        // todo 加上胡牌时手牌胡息 if (isWithHand)
    }

    // 获取听牌
    huzi.prototype.getTingCards = function(tb, pl, putCard) {
        if (!pl.mjhand){return [];}
        var handCopy = pl.mjhand.slice();
        var putType = tb.tData.putType;
        tb.tData.putType = 1;

        var tingCards = [];
        if (putCard != undefined) {
            var idx = pl.mjhand.indexOf(putCard);
            if (idx < 0) {
                return [];
            }
            pl.mjhand.splice(idx, 1);
        }

        // 牌数量合法判断 (未考虑龙牌 在手里不提出去) ！！
        if (pl.mjgang0.length + pl.mjgang1.length > 0) {
            if (pl.mjhand.length % 3 != 1) {
                pl.mjhand = handCopy;
                return [];
            }
        } else {
            if (pl.mjhand.length % 3 != 2) {
                pl.mjhand = handCopy;
                return [];
            }
        }

        var dict = {};
        for (var i = 1; i <= 10; i++) {
            dict[i] = 0;
            dict[i + 20] = 0;
        }

        for (var i = 0; i < pl.mjhand.length; i++) {
            dict[pl.mjhand[i]]++;
        }

        var list = []; // 相关联的牌
        for (var i = 0; i < pl.mjpeng.length; i++) {
            list.push(pl.mjpeng[i]);
        }

        for (var i = 0; i < pl.mjwei.length; i++) {
            list.push(pl.mjwei[i]);
        }

        for (var i = 1; i <= 10; i++) {
            if (list.indexOf(i) >= 0) {
                continue;
            }

            if (dict[i] == 1 && pl.mjhand.length % 3 == 1) { // 将
                list.push(i);
            } else if (dict[i] + dict[i + 20] >= 2) { // 绞 碰
                list.push(i);
            } else if (dict[i + 1] > 0 && dict[i + 2] > 0) { // 顺子
                list.push(i);
            } else if (dict[i - 1] > 0 && dict[i + 1] > 0) {
                list.push(i);
            } else if (dict[i - 2] > 0 && dict[i - 1] > 0) {
                list.push(i);
            } else {
                // 2-7-10
                var row = [2, 7, 10];
                if (row.indexOf(i) >= 0) {
                    dict[i]++;
                    if (dict[2] > 0 && dict[7] > 0 && dict[10] > 0) {
                        list.push(i);
                    }
                    dict[i]--;
                }

                if (tb.tData.areaSelectMode.isYiwushi) {
                    var row = [1, 5, 10];
                    if (row.indexOf(i) >= 0) {
                        dict[i]++;
                        if (dict[1] > 0 && dict[5] > 0 && dict[10] > 0 && list.indexOf(i) < 0) {
                            list.push(i);
                        }
                        dict[i]--;
                    }
                }
            }
        }

        for (var i = 21; i <= 30; i++) {
            if (list.indexOf(i) >= 0) {
                continue;
            }

            if (dict[i] == 1 && pl.mjhand.length % 3 == 1) { // 将
                list.push(i);
            } else if (dict[i] + dict[i - 20] >= 2) { // 绞 碰
                list.push(i);
            } else if (dict[i + 1] > 0 && dict[i + 2] > 0) { // 顺子
                list.push(i);
            } else if (dict[i - 1] > 0 && dict[i + 1] > 0) {
                list.push(i);
            } else if (dict[i - 2] > 0 && dict[i - 1] > 0) {
                list.push(i);
            } else {
                // 2-7-10
                var row = [22, 27, 30];
                if (row.indexOf(i) >= 0) {
                    dict[i]++;
                    if (dict[22] > 0 && dict[27] > 0 && dict[30] > 0) {
                        list.push(i);
                    }
                    dict[i]--;
                }

                if (tb.tData.areaSelectMode.isYiwushi) {
                    var row = [21, 25, 30];
                    if (row.indexOf(i) >= 0) {
                        dict[i]++;
                        if (dict[21] > 0 && dict[25] > 0 && dict[30] > 0 && list.indexOf(i) < 0) {
                            list.push(i);
                        }
                        dict[i]--;
                    }
                }
            }
        }

        for (var i = 0; i < list.length; i++) {
            var card = list[i];
            if (this.canHu(tb, pl, card).huMatrix.length > 0) {
                tingCards.push(card);
            }
        }

        var stats = {};
        for (var uid in tb.players) {
            function add(cd, num) {
                stats[cd] = stats[cd] ? stats[cd] + num : num;
            }
            var p = tb.players[uid];

            for (var i = 0; i < p.mjgang0.length; i++) {
                add(p.mjgang0[i], 4);
            }

            for (var i = 0; i < p.mjgang1.length; i++) {
                add(p.mjgang1[i], 4);
            }

            for (var i = 0; i < p.mjpeng.length; i++) {
                add(p.mjpeng[i], 3);
            }

            for (var i = 0; i < p.mjwei.length; i++) {
                //安化跑胡子只有自己偎的或者别人明偎可见的才加到统计牌里面 （怀化红拐弯和湘潭跑胡子也一样）
                // if (tb.tData.areaSelectMode.isMingWei == false){
                    if (p.info.uid == pl.info.uid || (p.skipPeng && p.skipPeng.indexOf(p.mjwei[i]) >= 0)){
                        add(p.mjwei[i], 3);
                    }
                // }else{
                //     add(p.mjwei[i], 3);
                // }
            }

            for (var i = 0; i < p.mjchi.length; i++) {
                var chiRow = p.mjchi[i].eatCards;
                for (var x = 0; x < 3; x++) {
                    add(chiRow[x], 1);
                }

                var biCards = p.mjchi[i].biCards;
                if (biCards) {
                    for (var j = 0; j < biCards.length; j++) {
                        var biRow = biCards[j];
                        for (var x = 0; x < 3; x++) {
                            add(biRow[x], 1);
                        }
                    }
                }
            }

            var tData = tb.tData;
            for (var i = 0; i < p.mjput.length; i++) {
                if (tData.tState == TableState.waitEat) { // 牌在展示阶段
                    if (p.info.uid == tData.uids[tData.curPlayer] && i == p.mjput.length - 1) {
                        continue;
                    }
                }
                add(p.mjput[i], 1);
            }

            if (p.info.uid == pl.info.uid) {
                for (var i = 0; i < p.mjhand.length; i++) {
                    add(p.mjhand[i], 1);
                }
            }
        }

        for (var i = 0; i < tingCards.length; i++) {
            if (stats[tingCards[i]] >= 4) {
                tingCards.splice(i, 1);
                i--;
            }
        }

        pl.mjhand = handCopy;
        tb.tData.putType = putType;

        return tingCards;
    }

    huzi.prototype.canTing = function(tb, pl, putCard) {
        var handCopy = pl.mjhand.slice();
        var putType = tb.tData.putType;
        tb.tData.putType = 1;

        var tingCards = [];
        if (putCard != undefined) {
            var idx = pl.mjhand.indexOf(putCard);
            if (idx < 0) {
                return [];
            }
            pl.mjhand.splice(idx, 1);
        }

        // 牌数量合法判断 (未考虑龙牌 在手里不提出去) ！！
        if (pl.mjgang0.length + pl.mjgang1.length > 0) {
            if (pl.mjhand.length % 3 != 1) {
                return [];
            }
        } else {
            if (pl.mjhand.length % 3 != 2) {
                return [];
            }
        }

        var stats = {};
        for (var uid in tb.players) {
            function add(cd, num) {
                stats[cd] = stats[cd] ? stats[cd] + num : num;
            }
            var p = tb.players[uid];

            for (var i = 0; i < p.mjgang0.length; i++) {
                add(p.mjgang0[i], 4);
            }

            for (var i = 0; i < p.mjgang1.length; i++) {
                add(p.mjgang1[i], 4);
            }

            for (var i = 0; i < p.mjpeng.length; i++) {
                add(p.mjpeng[i], 3);
            }

            for (var i = 0; i < p.mjwei.length; i++) {
                //安化跑胡子只有自己偎的或者别人明偎可见的才加到统计牌里面 (怀化红拐弯也一样)
                // if (tb.tData.areaSelectMode.isMingWei == false){
                    if (p.info.uid == pl.info.uid || (p.skipPeng && p.skipPeng.indexOf(p.mjwei[i]) >= 0)){
                        add(p.mjwei[i], 3);
                    }
                // }else{
                //     add(p.mjwei[i], 3);
                // }
            }

            for (var i = 0; i < p.mjchi.length; i++) {
                var chiRow = p.mjchi[i].eatCards;
                for (var x = 0; x < 3; x++) {
                    add(chiRow[x], 1);
                }

                var biCards = p.mjchi[i].biCards;
                if (biCards) {
                    for (var j = 0; j < biCards.length; j++) {
                        var biRow = biCards[j];
                        for (var x = 0; x < 3; x++) {
                            add(biRow[x], 1);
                        }
                    }
                }
            }

            var tData = tb.tData;
            for (var i = 0; i < p.mjput.length; i++) {
                if (tData.tState == TableState.waitEat) { // 牌在展示阶段
                    if (p.info.uid == tData.uids[tData.curPlayer] && i == p.mjput.length - 1) {
                        continue;
                    }
                }
                add(p.mjput[i], 1);
            }

            if (p.info.uid == pl.info.uid) {
                for (var i = 0; i < p.mjhand.length; i++) {
                    add(p.mjhand[i], 1);
                }
            }
        }

        var dict = {};
        for (var i = 1; i <= 10; i++) {
            dict[i] = 0;
            dict[i + 20] = 0;
        }

        for (var i = 0; i < pl.mjhand.length; i++) {
            dict[pl.mjhand[i]]++;
        }

        var list = []; // 相关联的牌
        for (var i = 0; i < pl.mjpeng.length; i++) {
            list.push(pl.mjpeng[i]);
        }

        for (var i = 0; i < pl.mjwei.length; i++) {
            list.push(pl.mjwei[i]);
        }

        for (var i = 1; i <= 10; i++) {
            if (list.indexOf(i) >= 0) {
                continue;
            }

            if (dict[i] == 1 && pl.mjhand.length % 3 == 1) { // 将
                list.push(i);
            } else if (dict[i] + dict[i + 20] >= 2) { // 绞 碰
                list.push(i);
            } else if (dict[i + 1] > 0 && dict[i + 2] > 0) { // 顺子
                list.push(i);
            } else if (dict[i - 1] > 0 && dict[i + 1] > 0) {
                list.push(i);
            } else if (dict[i - 2] > 0 && dict[i - 1] > 0) {
                list.push(i);
            } else {
                // 2-7-10
                var row = [2, 7, 10];
                if (row.indexOf(i) >= 0) {
                    dict[i]++;
                    if (dict[2] > 0 && dict[7] > 0 && dict[10] > 0) {
                        list.push(i);
                    }
                    dict[i]--;
                }

                if (tb.tData.areaSelectMode.isYiwushi) {
                    var row = [1, 5, 10];
                    if (row.indexOf(i) >= 0) {
                        dict[i]++;
                        if (dict[1] > 0 && dict[5] > 0 && dict[10] > 0 && list.indexOf(i) < 0) {
                            list.push(i);
                        }
                        dict[i]--;
                    }
                }
            }
        }

        for (var i = 21; i <= 30; i++) {
            if (list.indexOf(i) >= 0) {
                continue;
            }

            if (dict[i] == 1 && pl.mjhand.length % 3 == 1) { // 将
                list.push(i);
            } else if (dict[i] + dict[i - 20] >= 2) { // 绞 碰
                list.push(i);
            } else if (dict[i + 1] > 0 && dict[i + 2] > 0) { // 顺子
                list.push(i);
            } else if (dict[i - 1] > 0 && dict[i + 1] > 0) {
                list.push(i);
            } else if (dict[i - 2] > 0 && dict[i - 1] > 0) {
                list.push(i);
            } else {
                // 2-7-10
                var row = [22, 27, 30];
                if (row.indexOf(i) >= 0) {
                    dict[i]++;
                    if (dict[22] > 0 && dict[27] > 0 && dict[30] > 0) {
                        list.push(i);
                    }
                    dict[i]--;
                }

                if (tb.tData.areaSelectMode.isYiwushi) {
                    var row = [21, 25, 30];
                    if (row.indexOf(i) >= 0) {
                        dict[i]++;
                        if (dict[21] > 0 && dict[25] > 0 && dict[30] > 0 && list.indexOf(i) < 0) {
                            list.push(i);
                        }
                        dict[i]--;
                    }
                }
            }
        }

        for (var i = 0; i < list.length; i++) {
            var card = list[i];
            if (this.canHu(tb, pl, card).huMatrix.length > 0 && !(stats[card] >= 4)) {
                pl.mjhand = handCopy;
                tb.tData.putType = putType;
                return true;
            }else if(MjClient.gameType === MjClient.GAME_TYPE.XIANG_TAN_PAO_HU_ZI && this.canHu(tb, pl, card).huMatrix.length > 0){
                //湘潭跑胡子未听牌不能放偎结果卡死问题处理
                pl.mjhand = handCopy;
                tb.tData.putType = putType;
                return true;
            }
        }

        pl.mjhand = handCopy;
        tb.tData.putType = putType;

        return false;
    }

    // 提示打后可听的牌
    huzi.prototype.hintPutCardsToTing = function() {
        var tb = sData = MjClient.data.sData;
        var tData = sData.tData;
        var pl = sData.players[SelfUid()];
        if (tData.tState != TableState.waitPut || tData.uids[tData.curPlayer] != pl.info.uid) {
            return [];
        }

        var hand = pl.mjhand.slice();
        // 牌数量合法判断 (未考虑龙牌 在手里不提出去) ！！
        if (pl.mjgang0.length + pl.mjgang1.length > 0) {
            if (hand.length % 3 != 2) {
                return [];
            }
        } else {
            if (hand.length % 3 != 0) {
                return [];
            }
        }


        var dict = {};
        for (var i = 0; i < hand.length; i++) {
            dict[hand[i]] = dict[hand[i]] ? dict[hand[i]] + 1 : 1;
        }


        var putList = [];
        for (var k in dict) {
            if (dict[k] >= 3) {
                continue;
            }

            var card = Number(k);
            if (this.canTing(tb, pl, card)) {
                putList.push(card);
            }
        }

        return putList;
    }

    // 整理手牌
    huzi.prototype.sortCard = function(hand, sortType) {
        sortType = sortType || this.sortType % 3 + 1;
        this.sortType = sortType;

        var maxColNum = 10; // todo

        // todo 1-5-10组合
        // console.log(xiList);
        // var xiList = JSON.parse(JSON.stringify(xiList));
        if (false) {
            xiList.push([1, 5, 10], [21, 25, 30]);
        }

        hand = hand.slice();
        var dict = [];
        for (var i = 0; i < hand.length; i++) {
            dict[hand[i]] = dict[hand[i]] ? dict[hand[i]] + 1 : 1;
        }

        function isContain(row) {

        }

        function delRow(row) {
            for (var i = 0; i < row.length; i++) {
                var card = row[i];
                hand.splice(hand.indexOf(card), 1);
                dict[card]--;
            }
        }

        // 坎
        var kanMatrix = [];
        var duiArr = [];
        for (var k in dict) {
            var card = Number(k);
            if (dict[k] >= 3) {
                var row = [];
                for (var i = 0; i < dict[k]; i++) {
                    row.push(card);
                }
                kanMatrix.push(row);
                delRow(row);
            } else if (dict[k] == 2) {
                duiArr.push(card);
            }
        }

        var matrix = [];
        function getRow(rowType) { // 取组合
            var list = [];
            switch (rowType) {
                case ROW_TYPE.xi:
                    list = xiList;
                    break;
                case ROW_TYPE.noXi:
                    list = noXiList;
                    break;
                case ROW_TYPE.jiao:
                    list = jiaoList;
                    break;
                case ROW_TYPE.dui:
                    list = duiList;
                    break;
            }

            if (rowType == ROW_TYPE.jiao && sortType == 1) { // 先对再绞 看已取组合中是否有相反大小的对
                var copy = hand.slice();
                for (var i = 0; i < copy.length; i++) {
                    var card = copy[i];
                    var card2 =  card < 20 ? card + 20 : card - 20;
                    if (duiArr.indexOf(card2) >= 0) {
                        for (var j = 0; j < matrix.length; j++) {
                            if (matrix[j].toString() == [card2, card2].toString()) {
                                if (card < 20) {
                                    matrix[j].push(card);
                                } else {
                                    matrix[j] = [card].concat(matrix[j]);
                                }
                                delRow([card]);
                                break;
                            }
                        }
                    }
                }
            }

            for (var i = 0; i < list.length; i++) {
                var row = list[i].slice();
                var dict2 = {};
                for (var j = 0; j < row.length; j++) {
                    dict2[row[j]] = dict2[row[j]] ? dict2[row[j]] + 1 : 1;
                }

                var isContain = true;
                for (var k in dict2) {
                    if (!(dict[k] >= dict2[k])) { // dict[k]可能为undefined 用非判断
                        isContain = false;
                    }
                }

                if (isContain) {
                    matrix.push(row);
                    delRow(row);
                }
            }
        }

        function getLink(rowType) { // 取连接的牌
            var list = [];
            switch (rowType) {
                case ROW_TYPE.xi:
                    list = xiList;
                    break;
                case ROW_TYPE.noXi:
                    list = noXiList;
                    break;
                case ROW_TYPE.jiao:
                    list = jiaoList;
                    break;
                default:
                    break;
            }

            for (var i = 0; i < list.length; i++) {
                var row = list[i].slice();
                var tmp = [];
                for (var j = 0; j < 3; j++) {
                    if (j > 0 && row[j] == row[j - 1]) {
                        continue;
                    }

                    if (dict[row[j]] > 0) {
                        tmp.push(row[j]);
                    }
                }

                if (tmp.length >= 2) {
                    matrix.push(tmp);
                    delRow(tmp);
                }
            }
        }

        // 1.对子 -- 有胡息\无胡息一句话 -- 绞牌 -- 有关联的牌
        // 2.有胡息一句话 -- 绞牌 -- 对子 -- 无胡息一句话 -- 有关联的牌
        // 3.有胡息一句话 -- 无胡息一句话 -- 绞牌 -- 对子 -- 有关联的牌
        switch (sortType) {
            case 1:
                getRow(ROW_TYPE.dui);
                getRow(ROW_TYPE.xi);
                getRow(ROW_TYPE.noXi);
                getRow(ROW_TYPE.jiao);
                break;
            case 2:
                getRow(ROW_TYPE.xi);
                getRow(ROW_TYPE.jiao);
                getRow(ROW_TYPE.dui);
                getRow(ROW_TYPE.noXi);
                break;
            case 3:
                getRow(ROW_TYPE.xi);
                getRow(ROW_TYPE.noXi);
                getRow(ROW_TYPE.jiao);
                getRow(ROW_TYPE.dui);
                break;
        }

        getLink(ROW_TYPE.xi);
        getLink(ROW_TYPE.noXi);
        getLink(ROW_TYPE.jiao);

        for (var i = 0; i < hand.length; i++) {
            matrix.push([hand[i]]);
        }

        // 最大列数 处理
        if (matrix.length + kanMatrix.length > maxColNum) {
            var total = matrix.length + kanMatrix.length - maxColNum;
            for (var i = 1; i <= total; i++) {
                // console.log('i@@ ', i);
                for (var j = 0; j < matrix.length; j++) {
                    if (matrix[j].length == 1) {
                        for (var k = j + 1; k < matrix.length; k++) {
                            if (matrix[k].length == 1) {
                                // console.log("j@@ ", j, "k@@ ", k);
                                matrix[j] = matrix[j].concat(matrix[k]);
                                matrix.splice(k, 1);
                                j = matrix.length;
                                break;
                            }
                        }
                    }
                }
            }
        }

        kanMatrix.sort(function(a, b) {
            if (a[0] % 20 == b[0] % 20) {
                return b[0] - a[0];
            }

            return a[0] % 20 - b[0] % 20;
        })

        matrix.sort(function(a, b) {
            if (a[0] % 20 == b[0] % 20) {
                return b[0] - a[0];
            }

            return a[0] % 20 - b[0] % 20;
        })

        return kanMatrix.concat(matrix);
    }

    // 获取一列牌胡息
    huzi.prototype.getRowHuxi_hand = function(row, tData) {
        row = row.slice();
        var huxi = 0;
        if (row.length == 4) {
            if (row[0] == row[1] && row[0] == row[2] && row[0] == row[3]) {
                huxi += row[0] > 20 ? 12 : 9;
            }
        } else if (row.length == 3) {
            if (row[0] == row[1] && row[0] == row[2]) {
                huxi += row[0] > 20 ? 6 : 3;
            } else {
                row.sort(function(a, b) {return a - b});

                if (row[0] == 1 && row[1] == 2 && row[2] == 3) {
                    huxi += 3;
                }
                else if (row[0] == 21 && row[1] == 22 && row[2] == 23) {
                    huxi += 6;
                }
                else if (row[0] == 2 && row[1] == 7 && row[2] == 10) {
                    huxi += 3;
                }
                else if (row[0] == 22 && row[1] == 27 && row[2] == 30) {
                    huxi += 6;
                }

                if (tData.areaSelectMode.isYiwushi) {
                    if (row[0] == 1 && row[1] == 5 && row[2] == 10) {
                        huxi += 3;
                    }
                    else if (row[0] == 21 && row[1] == 25 && row[2] == 30) {
                        huxi += 6;
                    }
                }
            }
        }

        return huxi;
    };

    //怀化红拐弯听牌时有无名堂检测
    huzi.prototype.isMingTangOfHuaiHua = function(pl, card, huMatrix, plCpy){
        var tData = MjClient.data.sData.tData;
        if (card) pl.mjhand.push(card);
        var blackRedNum = this.blackRedNum(pl);
        if (card) pl.mjhand.pop();
        //牌堆的牌数
        var cardLen = 80;
        if(tData.maxPlayer == 2 && tData.areaSelectMode.maipai) cardLen = 60;
        //碰碰胡检测
        var checkPengPengHu = function(pl, huMatrix){
            if(pl.mjchi.length > 0 ) return false;
            for (var j = 0; j < huMatrix.length; j++) {
                if(huMatrix[j].length == 3 && (huMatrix[j][0] != huMatrix[j][1] || huMatrix[j][0] != huMatrix[j][2])){
                    return false;
                }
            }
            return true;
        }
        //大小字数量检测
        var checkDaXiaoZi = function(pl, huMatrix, plCpy){
            if(pl && plCpy){
                var plTemp = pl;
                pl = plCpy;
            }
            var daXiaoZiCount = {xiao:0, da:0};
            for(var i = 0; i < huMatrix.length; i++){ //手牌
                for(var j = 0; j < huMatrix[i].length; j++){
                    if(huMatrix[i][j] > 0 && huMatrix[i][j] <= 10){
                        daXiaoZiCount.xiao++;
                    }else if(huMatrix[i][j] > 20 && huMatrix[i][j] <= 30){
                        daXiaoZiCount.da++;
                    }
                }
            }
            if(pl.mjchi.length > 0){ //吃碰牌牌堆的牌
                var mjchi = pl.mjchi;
                for(var i = 0; i < mjchi.length; i++){
                    var eatCards = mjchi[i].eatCards;
                    var biCards = mjchi[i].biCards;
                    if(eatCards){
                        for(var j = 0; j < eatCards.length; j++){
                            if(eatCards && eatCards[j] > 0 && eatCards[j] <= 10){
                                daXiaoZiCount.xiao++;
                            }else if(eatCards && eatCards[j] > 20 && eatCards[j] <= 30){
                                daXiaoZiCount.da++;
                            }

                            if(biCards && biCards[j] > 0 && biCards[j] <= 10){
                                daXiaoZiCount.xiao++;
                            }else if(biCards && biCards[j] > 20 && biCards[j] <= 30){
                                daXiaoZiCount.da++;
                            }
                        }
                    }
                }
            }
            if(pl.mjpeng.length > 0){
                var mjpeng = pl.mjpeng;
                for(var j = 0; j < mjpeng.length; j++){
                    if(mjpeng && mjpeng[j] > 0 && mjpeng[j] <= 10){
                        daXiaoZiCount.xiao += 3;
                    }else if(mjpeng && mjpeng[j] > 20 && mjpeng[j] <= 30){
                        daXiaoZiCount.da += 3;
                    }
                }
            }
            if(pl.mjwei.length > 0){
                var mjwei = pl.mjwei;
                for(var j = 0; j < mjwei.length; j++){
                    if(mjwei && mjwei[j] > 0 && mjwei[j] <= 10){
                        daXiaoZiCount.xiao += 3;
                    }else if(mjwei && mjwei[j] > 20 && mjwei[j] <= 30){
                        daXiaoZiCount.da += 3;
                    }
                }
            }
            if(pl.mjgang0.length > 0){
                var mjgang0 = pl.mjgang0;
                for(var j = 0; j < mjgang0.length; j++){
                    if(mjgang0 && mjgang0[j] > 0 && mjgang0[j] <= 10){
                        daXiaoZiCount.xiao += 4;
                    }else if(mjgang0 && mjgang0[j] > 20 && mjgang0[j] <= 30){
                        daXiaoZiCount.da += 4;
                    }
                }
            }
            if(pl.mjgang1.length > 0){
                var mjgang1 = pl.mjgang1;
                for(var j = 0; j < mjgang1.length; j++){
                    if(mjgang1 && mjgang1[j] > 0 && mjgang1[j] <= 10){
                        daXiaoZiCount.xiao += 4;
                    }else if(mjgang1 && mjgang1[j] > 20 && mjgang1[j] <= 30){
                        daXiaoZiCount.da += 4;
                    }
                }
            }
            if(pl && plCpy){
                pl = plTemp;
            }
            return daXiaoZiCount;
        }
        //地胡检测
        var checkDiHu = function (pl) {
            //吃
            if(pl.mjchi.length > 0 )
                return false;
            //畏牌
            if(pl.mjwei.length > 0)
                return false;
            if(pl.mjpeng.length > 0)
                return false;
            if(pl.putCount && pl.putCount > 0)
                return false;
            if(!(pl.eatFlag & 32))
                return false;
            return true;
        }

        //天胡
        if((tData.areaSelectMode.redguaiwanwanfa & 1) == 1 && tData.lastDrawPlayer == -1 && tData.uids[tData.zhuang] === pl.info.uid && tData.isLastDraw && pl.mjgang1.length <= 1){
            return true;
        }
        //地胡
        if((tData.areaSelectMode.redguaiwanwanfa & 2) == 2 && tData.uids[tData.zhuang] != pl.info.uid && (checkDiHu(pl) || pl.mjhand.length == 20)){
            return true;
        }
        //点胡
        if((tData.areaSelectMode.redguaiwanwanfa & 4) == 4 && blackRedNum[1] == 1){
            return true;
        }
        //红胡
        if((tData.areaSelectMode.redguaiwanwanfa & 8) == 8 && blackRedNum[1] >= 10){
            return true;
        }
        //乌胡
        if((tData.areaSelectMode.redguaiwanwanfa & 16) == 16 && blackRedNum[1] == 0){
            return true;
        }
        //碰碰胡
        if((tData.areaSelectMode.redguaiwanwanfa & 32) == 32 && checkPengPengHu(pl, huMatrix)){
            return true;
        }
        //十八大
        if((tData.areaSelectMode.redguaiwanwanfa & 64) == 64 && checkDaXiaoZi(pl, huMatrix, plCpy).da >= 18){
            return true;
        }
        //十六小
        if((tData.areaSelectMode.redguaiwanwanfa & 128) == 128 && checkDaXiaoZi(pl, huMatrix, plCpy).xiao >= 16 ){
            return true;
        }
        //海底捞
        if((tData.areaSelectMode.redguaiwanwanfa & 256) == 256 && tData.cardNext == cardLen && tData.putType == 1){
            return true;
        }

        return false;
    }

    if (typeof(MjClient) != "undefined") {
        MjClient.majiang_shiMenPaoHuZi = new huzi();
        majiang_shiMenPaoHuZiLink(MjClient.majiang_shiMenPaoHuZi);
    }
}());

