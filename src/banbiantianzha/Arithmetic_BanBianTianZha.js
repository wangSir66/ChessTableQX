// 半边天炸算法
(function() {
    var SMALL_JOKER = 516; // 小王
    var BIG_JOKER =  517; // 大王

    var SUIT_TYPE = {
        diamonds: 1, // 方块
        clubs: 2, // 梅花
        hearts: 3, // 红桃
        spades: 4, // 黑桃
        joker: 5 // 小丑
    };

    var CARD_TYPE = {
        noType: -1,     // 无牌型
        danZhang: 0,    // 单张
        duiZi: 1,       // 对子
        sanZhang: 2,    // 三张
        siDaiSan : 3,    //四带三
        shunZi: 4,      // 顺子
        lianDui: 5,     // 连对
        feiJi: 6,       // 飞机

        zaHuaWuShiK: 7, // 杂花5-10-k
        tongHuaWuShiK: 8,   // 同花5-10-k
        zhaDan: 9,      // 炸弹
        tongHuaShun: 10, //同花顺
        diZha : 11,     //地炸 4个以上的连队
        tianZha: 12,     //天炸  单张王
    };

    // 顺子队列
    var SHUN_QUEUE = [ 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]; // k 可以连A

    function BanBianTianZha() {
        this.CARD_TYPE = CARD_TYPE;
        this.sortType = 2;
    }

    var utils = function() {

    };

    // 牌点
    utils.prototype.point = function(card) {
        return card % 100;
    };

    // 花色
    utils.prototype.suit = function(card) {
        return Math.floor(card / 100);
    };

    var _ = new utils();

    // 洗牌
    BanBianTianZha.prototype.randomCards = function(areaSelectMode) {
        var deckNum = areaSelectMode.deckNum || 1;
        var tzcards = [
            103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, /*115,*/ // 方块3-K A 2
            203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214,  /*215,*/ // 梅花
            303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, // 红桃
            403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415  // 黑桃
        ];

        //if (areaSelectMode.hasJoker) {
            tzcards.push(BIG_JOKER);
        //}

        var cards = [];
        for (var i = 0; i < deckNum; i++) {
            cards = cards.concat(tzcards);
        }

        shuffleArray(cards);
        return cards;
    };

    // 排序
    BanBianTianZha.prototype.formatSort = function(cards) {
        cards.sort(function(a, b) {
            if (_.point(a) == _.point(b)) {
                return a - b;
            }

            return _.point(a) - _.point(b);
        });
    }

    BanBianTianZha.prototype.sort2 = function(cards) {
        // 牌统计; 提取炸弹 五十K
        var p_dict = {
            "5": 0,
            "10": 0,
            "13": 0
        };

        var c_dict = {};
        var jokerList = [];
        for (var i = 0; i < cards.length; i++) {
            var c = cards[i];
            if (c == BIG_JOKER || c == SMALL_JOKER) {
                jokerList.push(c);
                continue;
            }
            c_dict[c] = c_dict[c] ? c_dict[c] + 1 : 1;

            var p = _.point(cards[i]);
            p_dict[p] = p_dict[p] ? p_dict[p] + 1 : 1;
        }
        // console.log("p_dict@@ ", p_dict);

        // 获取一定张数的特定牌点的牌
        function getCardsByNum(point, needNum) {
            // console.log("getCardsByNum point@@", point, " needNum@@ ", needNum);
            // console.log("c_dict @@", JSON.stringify(c_dict));
            if (point == 2) { // 2实际编码
                point = 15;
            }

            var rtn = [];
            var findNum = 0;
            while (findNum < needNum) {
                for (var suit in SUIT_TYPE) {
                    var cd = SUIT_TYPE[suit] * 100 + point;
                    var num = c_dict[cd];
                    if (num && num > 0) {
                        for (var i = 1; i <= Math.min(num, needNum - findNum); i++) {
                            rtn.push(cd);
                        }
                        findNum += num;
                    }
                }
            }
            return rtn;
        }

        function out(row) {
            for (var i = 0; i < row.length; i++) {
                c_dict[row[i]]--;
                p_dict[_.point(row[i])]--;
            }
        }

        var zhaDanList = []; // 炸弹
        var wuShiKList = []; // 五十K
        var danWangList = []; // 单王
        if (jokerList.length >= 2) {
            jokerList.sort(function(a, b) {
                return a - b;
            });
            zhaDanList.push({cards: jokerList, value: this.getZhaDanValue(jokerList)});
        }

        for (var k in p_dict) {
            if (p_dict[k] >= 4) {
                var tmp = getCardsByNum(Number(k), p_dict[k]);
                zhaDanList.push({cards: tmp, value: this.getZhaDanValue(tmp)});
            }
        }

        zhaDanList.sort(function(a, b) {
            return a.value - b.value;
        });
        // console.log("zhaDanList@@ ", zhaDanList);

        if (p_dict[5] < 4 && p_dict[10] < 4 && p_dict[13] < 4) {
            var num = Math.min(p_dict[5], p_dict[10], p_dict[13]);
            var findNum = 0;
            for (var i = 1; i <= 4; i++) {
                if (c_dict[i * 100 + 5] > 0 && c_dict[i * 100 + 10] > 0 && c_dict[i * 100 + 13] > 0) {
                    var row = [i * 100 + 5, i * 100 + 10, i * 100 + 13];
                    wuShiKList.push(row);
                    out(row);
                    findNum++;
                    i--;
                }
            }

            while(num - findNum) {
                var row = [getCardsByNum(5, 1)[0], getCardsByNum(10, 1)[0], getCardsByNum(13, 1)[0]];
                wuShiKList = [row].concat(wuShiKList);
                out(row);
                findNum++;
            }
        }

        // 牌点按张数 分类
        var pHash = [
            [], // 0张的牌点(wuyong)
            [], // 1张
            [], // 2张
            [], // 3张
        ];

        for (var k in p_dict) {
            var count = p_dict[k];
            var point = Number(k);
            if (count > 0 && count <= 3) {
                pHash[count].push(point);
            }
        }
        // console.log("pHash@@ ", pHash);
        // console.log("wuShiKList@@ ", wuShiKList);
        // console.log("zhaDanList@@ ", zhaDanList);

        var rtn = [];
        for (var i = 0; i < pHash[1].length; i++) {
            rtn = rtn.concat(getCardsByNum(pHash[1][i], 1));
        }
        // console.log(rtn);

        for (var i = 0; i < pHash[2].length; i++) {
            rtn = rtn.concat(getCardsByNum(pHash[2][i], 2));
        }
        // console.log(rtn);

        if (jokerList.length == 1) {
            rtn = rtn.concat(jokerList);
        }
        // console.log(rtn);

        for (var i = 0; i < pHash[3].length; i++) {
            rtn = rtn.concat(getCardsByNum(pHash[3][i], 3));
        }
        // console.log(rtn);

        for (var i = 0; i < wuShiKList.length; i++) {
            rtn = rtn.concat(wuShiKList[i]);
        }
        // console.log(rtn);


        for (var i = 0; i < zhaDanList.length; i++) {
            rtn = rtn.concat(zhaDanList[i].cards);
        }
        // console.log(rtn);

        return rtn;
    };
    BanBianTianZha.prototype.sortByBomb = function(cards) {
        var c_dict = {};
        var p_dict = {};
        var result = [[],[],[],[],[],[],[]];
        var sortCards = cards.slice();

        // 获取一定张数的特定牌点的牌
        function getCardsByNum(point, needNum) {
            point = Number(point);
            var rtn = [];
            var findNum = 0;
            while (findNum < needNum) {
                var signCdBak = [];
                for (var suit in SUIT_TYPE) {
                    var cd = SUIT_TYPE[suit] * 100 + point;
                    var cdItem = c_dict[cd];
                    if (cdItem){
                        if (cdItem.sign == 0){
                            if (cdItem.count && cdItem.count > 0) {
                                for (var i = 1; i <= Math.min(cdItem.count, needNum - findNum); i++) {
                                    rtn.push(Number(cd));
                                }
                                findNum += cdItem.count;
                            }
                        }else{
                            signCdBak[cd] = cdItem;
                        }
                    }
                }
                if (findNum < needNum){
                    for (var cd in signCdBak){
                        var cdItem = signCdBak[cd];
                        if (cdItem && cdItem.count > 0) {
                            for (var i = 1; i <= Math.min(cdItem.count, needNum - findNum); i++) {
                                rtn.push(Number(cd));
                            }
                            findNum += cdItem.count;
                        }
                    }
                }
            }
            return rtn;
        }

        function removeCards(cards) {
            for (var i = 0; i < cards.length; ++i){
                if (c_dict[cards[i]]){
                    c_dict[cards[i]].count--;
                    var p = _.point(cards[i]);
                    p_dict[p]--;
                }
            }
        }

        function checkHasCards(cards) {
            var hasCards = true;
            for (var i = 0; i < cards.length; ++i){
                if (c_dict[cards[i]] && c_dict[cards[i]].count > 0){
                }else{
                    hasCards = false;
                    break;
                }
            }
            return hasCards;
        }


        for (var i = 0; i < cards.length; i++) {
            var c = cards[i];
            (c_dict[c] = c_dict[c] ? c_dict[c] : {count:0,sign:0}).count++;
            var p = _.point(cards[i]);
            p_dict[p] = p_dict[p] ? p_dict[p] + 1 : 1;
        }

        sortCards.sort(function (a,b) {
            return a - b;
        })

        //标记阶段
        //同花顺
        for (var i = 0; i < sortCards.length;){
            var shunCount = 1;
            var j = i + 1;
            var cdi = sortCards[i];
            var cdTemp = cdi;
            for (; j < sortCards.length; ++j){
                var cdj = sortCards[j];
                if (_.point(cdj) != 15){
                    if (c_dict[cdj].count > 0 && cdj == cdTemp + 1){
                        cdTemp = cdj;
                        shunCount++;
                        continue;
                    }else if (cdj == cdTemp){
                        continue;
                    }
                }
                break;
            }

            if (shunCount >= 5){
                var item = [];
                for (var k = 0; k < shunCount; ++k){
                    c_dict[cdi + k].sign++;
                }
            }
            i = j;
        }

        var tongHua510K = [];
        //510k
        for (var suit = 1; suit < 5; ++suit){
            var c1 = suit * 100 + 5;
            var c2 = suit * 100 + 10;
            var c3 = suit * 100 + 13;

            if (c_dict[c1] && c_dict[c2] && c_dict[c3]){
                var count = Math.min(c_dict[c1].count, c_dict[c2].count,c_dict[c3].count);
                for (var i = 0; i < count; ++i){
                    var tongHuaItem = [c1,c2,c3];
                    c_dict[c1].sign++;
                    c_dict[c2].sign++;
                    c_dict[c3].sign++;
                    tongHua510K.push(tongHuaItem);
                }
            }
        }

        //选牌阶段
        //天炸
        while (c_dict[BIG_JOKER] && c_dict[BIG_JOKER].count > 0){
            result[0].push([BIG_JOKER]);
            c_dict[BIG_JOKER].count--;
            p_dict[_.point(BIG_JOKER)]--;
        }

        //地炸
        var needOneMore = true;
        while(needOneMore){
            needOneMore = false;
            for (var i = 0; i < SHUN_QUEUE.length - 3;){
                var minCount = p_dict[SHUN_QUEUE[i]] || 0;
                if (minCount > 1){
                    var j = i + 1;
                    for (; j < SHUN_QUEUE.length; ++j){
                        var jMinCount =  p_dict[SHUN_QUEUE[j]] || 0;
                        if (jMinCount < 2){
                            break;
                        }else{
                            var minCount =  Math.min(jMinCount, minCount);
                            continue;
                        }
                    }

                    if (j - i >= 4){
                        for (var m = 0; m < Math.floor(minCount / 2); ++m){
                            var item = [];
                            for (var k = i; k < j; ++k){
                                item.push.apply(item, getCardsByNum(SHUN_QUEUE[k], 2));
                            }
                            removeCards(item);
                            result[1].push(item);
                            needOneMore = true;
                        }
                    }
                    i = j;
                }else{
                    ++i;
                }
            }
        }

        //同花顺
        // needOneMore = true;
        // while(needOneMore){
        //     needOneMore = false;
        for (var i = 0; i < sortCards.length;){
            var cdi = sortCards[i];
            var cdTemp = cdi;
            if (c_dict[cdi].count > 0){
                var shunCount = 1;
                var j = i + 1;
                for (; j < sortCards.length; ++j){
                    var cdj = sortCards[j];
                    if (_.point(cdj) != 15){
                        if (c_dict[cdj].count > 0 && cdj == cdTemp + 1){
                            cdTemp = cdj;
                            shunCount++;
                            continue;
                        }else if (cdj == cdTemp){
                            continue;
                        }
                    }
                    break;
                }

                if (shunCount >= 5){
                    var item = [];
                    for (var k = 0; k < shunCount; ++k){
                        item.push(cdi + k);
                    }
                    removeCards(item);
                    result[2].push(item);
                    //needOneMore = true;
                }
                i = j;
            }else{
                ++i;
            }
        }
        //}

        //炸弹
        for(var i in p_dict){
            if (p_dict[i] >= 4){
                var item = [];
                item.push.apply(item, getCardsByNum(i, p_dict[i]));
                removeCards(item);
                result[3].push(item);
            }
        }

        //正五十k
        for(var i = 0; i < tongHua510K.length; ++i){
            var item = tongHua510K[i];
            if (checkHasCards(item)){
                removeCards(item);
                result[4].push(item);
            }
        }

        //副五十k
        if (p_dict[5] > 0 && p_dict[10] > 0 && p_dict[13] > 0){
            var count = Math.min(p_dict[5], p_dict[10], p_dict[13]);
            for (var i = 0; i < count; ++i){
                var item = [];
                item.push.apply(item, getCardsByNum(5, 1));
                item.push.apply(item, getCardsByNum(10, 1));
                item.push.apply(item, getCardsByNum(13, 1));
                removeCards(item);
                result[5].push(item);
            }
        }

        //剩余牌
        var leftCards = [];
        for (var index in c_dict){
            var cd = c_dict[index];
            for (var i = 0; i < cd.count; ++i){
                leftCards.push(Number(index));
            }
        }
        this.formatSort(leftCards);
        result[6].push(leftCards);
        return result;
    }

    BanBianTianZha.prototype.sortCard = function(cards, sortType) {
        this.sortType = sortType || (this.sortType % 2 + 1);
        switch (this.sortType) {
            case 1:
                var infoList = [];
                this.formatSort(cards);
                cc.log("chow", "cards = " + JSON.stringify(cards));
                for(var i = 0; i < cards.length; i++){
                    var info = {type:cards[i], bombType:6};
                    infoList.push(info);
                }
                return infoList;
            case 2:
                var infoList = [];
                var allMatrix = this.sortByBomb(cards);
                cc.log("chow", "allMatrix = " + JSON.stringify(allMatrix));
                for(var i = allMatrix.length - 1; i >= 0; i--){
                    var oneMatrix = allMatrix[i];
                    for(var j = 0; j < oneMatrix.length; j++){
                        var row = oneMatrix[j];
                        for(var k = 0; k < row.length; k++){
                            var info = {type:row[k], bombType:i};
                            infoList.push(info);
                        }
                    }
                }
                return infoList;
        }
    }

    BanBianTianZha.prototype.sortCardByDegree = function (hand) {
        //console.log("chow sortCardByDegree" + " hand = " + JSON.stringify(hand));
        var allMatrix = [[], [], [], [], [], [], []]//0 天炸 1 地炸 2 同花顺 3 炸弹 4 正510k 5 负510k 6 其他;
        var jokeList = [];
        var point_dict = [];
        var card_dict = [];
        var huase_dict = [[], [], [], []];
        var card_list = hand.slice();
        for(var i = 0; i < hand.length; i++){
            if(hand[i] == BIG_JOKER || hand[i] == SMALL_JOKER){
                jokeList.push(hand[i]);
            }else{
                var suit = _.suit(hand[i]);
                huase_dict[suit - 1].push(hand[i]);

                var point = _.point(hand[i]);
                point_dict[point] = point_dict[point] ? point_dict[point] + 1 : 1;

                var card = hand[i];
                card_dict[card] = card_dict[card] ? card_dict[card] + 1 : 1;
            }
        }
        //console.log("chow  sortCardByDegree start" + " jokeList = " + JSON.stringify(jokeList));
        //console.log("chow  sortCardByDegree start" + " point_dict = " + JSON.stringify(point_dict));
        //console.log("chow  sortCardByDegree start" + " card_dict = " + JSON.stringify(card_dict));
        //console.log("chow  sortCardByDegree start" + " huase_dict = " + JSON.stringify(huase_dict));

        function getCardsByPoint(cards, point, num) {
            if(num <= 0){
                return [];
            }
            var tempCards = [];
            for(var i = cards.length - 1; i >= 0; i--){
                if(_.point(cards[i]) == point){
                    tempCards = tempCards.concat(cards.splice(i, 1));
                    if(tempCards.length >= num){
                        break;
                    }
                }
            }
            return tempCards;
        }
        
        function getCardsByCard(cards, card, num) {
            if(num <= 0){
                return [];
            }
            var tempCards = [];
            for(var i = cards.length - 1; i >= 0; i--){
                if(cards[i] == card){
                    tempCards = tempCards.concat(cards.splice(i, 1));
                    if(tempCards.length >= num){
                        break;
                    }
                }
            }
            return tempCards;
        }
        
        function indexOfPoint(cards, point) {
            for(var i = 0; i < cards.length; i++){
                if(_.point(cards[i]) == point){
                    return i;
                }
            }
            return -1;
        }

        //抽取炸弹
        for(var point in point_dict){
            if(point_dict[point] >= 4){
                var row = getCardsByPoint(hand, point, point_dict[point]);
                allMatrix[3].push(row);
            }
        }
        //console.log("chow  sortCardByDegree zhadan" + " hand = " + JSON.stringify(hand));
        //console.log("chow", "sortCardByDegree zhadan" + " allMatrix = " + JSON.stringify(allMatrix));

        //提取510K
        if(point_dict[5] < 4 && point_dict[10] < 4 && point_dict[13] < 4){
            var maxNum = Math.min(point_dict[5], point_dict[10], point_dict[13]);
            maxNum = maxNum ? maxNum : 0;
            var hasfindNum = 0;
            //console.log("chow  maxNum = " + maxNum);
            for(var i = 1; i <= 4; i++){
                var findNum = Math.min(card_dict[i * 100 + 5], card_dict[i * 100 + 10] , card_dict[i * 100 + 13]);
                findNum = findNum ? findNum : 0;
                getCardsByCard(hand, i * 100 + 5, findNum);
                getCardsByCard(hand, i * 100 + 10, findNum);
                getCardsByCard(hand, i * 100 + 13, findNum);
                for(var j = 0; j < findNum; j++){
                    allMatrix[4].push([i * 100 + 5, i * 100 + 10, i * 100 + 13]);
                }
                hasfindNum += findNum;
            }
            //console.log("chow  hasfindNum = " + hasfindNum);
            for(var i = 0; i < maxNum - hasfindNum; i++){
                allMatrix[5].push([getCardsByPoint(hand, 5, 1)[0], getCardsByPoint(hand, 10, 1)[0], getCardsByPoint(hand, 13, 1)[0]]);
            }
        }
        //console.log("chow sortCardByDegree 510k" + " hand = " + JSON.stringify(hand));
        //console.log("chow sortCardByDegree 510k" + " allMatrix = " + JSON.stringify(allMatrix));
        //提取同花顺
        var allTongHuaShun = this.getTongHuaShun(huase_dict);
        allTongHuaShun.sort(function (a, b) {
            if(a.count > b.count){
                return 1;
            }else if(a.count == b.count){
                if(_.point(a.card) > _.point(b.card)){
                    return 1;
                }else if(_.point(a.card) == _.point(b.card)){
                    if(_.suit(a.card) > _.suit(b.card)){
                        return 1;
                    }else{
                        return -1;
                    }
                }else{
                    return -1;
                }
            }else{
                return -1;
            }
        });
        for(var i = 0; i < allTongHuaShun.length; i++){
            var tongHuaShun = allTongHuaShun[i];
            var row = [];
            for(var j = 0; j < tongHuaShun.count; j++){
                while(true){
                    var card = tongHuaShun.card - j;
                    var cards = getCardsByCard(hand, card, 1);
                    //cc.log("chow" , "allTongHuaShun card = " + card + " cards = " + JSON.stringify(cards));
                    if(cards.length >= 1){
                        row = row.concat(cards);
                        break;
                    }else{
                        hand = hand.concat(cards);//还原
                        var needCount = 1 - cards.length;
                        var count = 0;
                        var flag = false;
                        for(var index = 0; index < allMatrix[5].length; index++) {//从负510k里面找
                            if(allMatrix[5][index].indexOf(card) >= 0){
                                hand = hand.concat(allMatrix[5][index]);
                                allMatrix[5].splice(index, 1);
                                count++;
                                if(count >= needCount){
                                    flag = true;
                                    break;
                                }
                            }
                        }
                        if(flag){
                            continue;
                        }
                        for(var index = 0; index < allMatrix[4].length; index++) {//从正510k里面找
                            if(allMatrix[4][index].indexOf(card) >= 0){
                                hand = hand.concat(allMatrix[4][index]);
                                allMatrix[4].splice(index, 1);
                                count++;
                                if(count >= needCount){
                                    flag = true;
                                    break;
                                }
                            }
                        }
                        if(flag){
                            continue;
                        }
                        for(var index = 0; index < allMatrix[3].length; index++) {//从炸弹里面找
                            if(allMatrix[3][index].indexOf(card) >= 0){
                                hand = hand.concat(allMatrix[3][index]);
                                allMatrix[3].splice(index, 1);
                                count += 4;
                                if(count >= needCount){
                                    flag = true;
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            allMatrix[2].push(row);
        }
        //console.log("chow  sortCardByDegree tonghuashun" + " hand = " + JSON.stringify(hand));
        //console.log("chow  sortCardByDegree tonghuashun" + " allMatrix = " + JSON.stringify(allMatrix));

        var allDiZha = this.getDizha(card_list);
        allDiZha.sort(function (a, b) {
            if(a.count > b.count){
                return 1;
            }else if(a.count == b.count){
                if(a.card > b.card){
                    return 1;
                }else{
                    return -1;
                }
            }else{
                return -1;
            }
        });
        //console.log("chow  getDizha" + " allDiZha = " + JSON.stringify(allMatrix));
        for(var i = 0; i < allDiZha.length; i++){
            var diZha = allDiZha[i];
            var row = [];
            for(var j = 0; j < diZha.count; j++){
                while(true){
                    var card = diZha.card - j;
                    var cards = getCardsByPoint(hand, card, 2);
                    //console.log("chow allDiZha card = " + card + " cards = " + JSON.stringify(cards));
                    if(cards.length >= 2){
                        row = row.concat(cards);
                        break;
                    }else{
                        hand = hand.concat(cards);//还原
                        var needCount = 2 - cards.length;
                        var count = 0;
                        var flag = false;
                        for(var index = 0; index < allMatrix[5].length; index++) {//从负510k里面找
                            if(indexOfPoint(allMatrix[5][index], card) >= 0){
                                hand = hand.concat(allMatrix[5][index]);
                                allMatrix[5].splice(index, 1);
                                count++;
                                if(count >= needCount){
                                    flag = true;
                                    break;
                                }
                            }
                        }
                        if(flag){
                            continue;
                        }
                        for(var index = 0; index < allMatrix[4].length; index++) {//从正510k里面找
                            if(indexOfPoint(allMatrix[4][index], card) >= 0){
                                hand = hand.concat(allMatrix[4][index]);
                                allMatrix[4].splice(index, 1);
                                count++;
                                if(count >= needCount){
                                    flag = true;
                                    break;
                                }
                            }
                        }
                        if(flag){
                            continue;
                        }
                        for(var index = 0; index < allMatrix[3].length; index++) {//从炸弹里面找
                            if(indexOfPoint(allMatrix[3][index], card) >= 0){
                                hand = hand.concat(allMatrix[3][index]);
                                allMatrix[3].splice(index, 1);
                                count += 4;
                                if(count >= needCount){
                                    flag = true;
                                    break;
                                }
                            }
                        }
                        if(flag){
                            continue;
                        }
                        for(var index = 0; index < allMatrix[2].length; index++){//从同花顺里面找
                            var k = indexOfPoint(allMatrix[2][index], card);
                            if(k >= 0){
                                var cards1 = allMatrix[2][index].slice(0, k);
                                //console.log("chow  getDizha" + " cards1 = " + JSON.stringify(cards1));
                                var cards2 = allMatrix[2][index].slice(k + 1, allMatrix[2][index].length);
                                //console.log("chow  getDizha" + " cards2 = " + JSON.stringify(cards2));
                                hand = hand.concat(allMatrix[2][index].splice(k, 1));
                                allMatrix[2].splice(index, 1);
                                if(this.isTongHuaShun(cards1)){
                                    allMatrix[2].push(cards1);
                                }else{
                                    hand = hand.concat(cards1);
                                }
                                if(this.isTongHuaShun(cards2)){
                                    allMatrix[2].push(cards2);
                                }else{
                                    hand = hand.concat(cards2);
                                }
                                count++;
                                if(count >= needCount){
                                    flag = true;
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            allMatrix[1].push(row);
        }
        //console.log("chow  sortCardByDegree dizha" + " hand = " + JSON.stringify(hand));
        //console.log("chow  sortCardByDegree dizha" + " allMatrix = " + JSON.stringify(allMatrix));

        //提取天炸
        for(var i = 0; i < jokeList.length; i++){
            if(jokeList[i] == BIG_JOKER){
                allMatrix[0].push(getCardsByCard(hand, jokeList[i], 1));
                break;
            }
        }
        return {allMatrix:allMatrix, hand:hand};
    }
    
    BanBianTianZha.prototype.sortCardsInOrder = function (cards) {
        var allMatrix = [[], [], [], [], [], [], []]//0 天炸 1 地炸 2 同花顺 3 炸弹 4 正510k 5 负510k 6 其他;
        var hand = cards.slice();
        while(true){
            var oneMatrix = this.sortCardByDegree(hand);
            var isOver = true;
            for(var i = 0; i < oneMatrix.allMatrix.length; i++){
                if(oneMatrix.allMatrix[i].length != 0){
                    isOver = false;
                    break;
                }
            }
            if(isOver){
                break;
            }else{
                for(var i = 0; i < allMatrix.length; i++){
                    allMatrix[i] = allMatrix[i].concat(oneMatrix.allMatrix[i]);
                }
            }
            hand = oneMatrix.hand;
        }
        this.formatSort(hand);
        allMatrix[6].push(hand);
        //console.log("chow sortCardsInOrder last" + " allMatrix = " + JSON.stringify(allMatrix));
        return allMatrix;
    }

    // 是否有王
    BanBianTianZha.prototype.hasWang = function(cards) {
        return cards.indexOf(BIG_JOKER) != -1;
    }

    // 是否单王
    BanBianTianZha.prototype.isTianZha = function(cards) {
        if (cards.length != 1) {
            return false;
        }

        return cards[0] == BIG_JOKER;
    }

    // 是否单张
    BanBianTianZha.prototype.isDanZhang = function(cards) {
        if (this.isTianZha(cards)) {
            return false;
        }

        return cards.length == 1;
    }

    // 是否对
    BanBianTianZha.prototype.isDuiZi = function(cards) {
        if (cards.length != 2) {
            return false;
        }

        if (this.isZhaDan(cards)) { // 双王
            return false;
        }

        return _.point(cards[0]) == _.point(cards[1]);
    }

    // 分析三张主体 翅膀
    BanBianTianZha.prototype.analyzeSanZhang = function(cards) {
        var dict = {};
        for (var i = 0; i < cards.length; i++) {
            var p = _.point(cards[i]);
            dict[p] = dict[p] ? dict[p] + 1 : 1;
        }

        var body = -1; // 主体
        var wing = []; // 翅膀
        for (var p in dict) {
            if (dict[p] >= 3) {
                body = Number(p);

                cards = cards.slice();
                this.formatSort(cards);
                for (var i = 0; i < cards.length; i++) {
                    if (_.point(cards[i]) == body) {
                        cards.splice(i, 3);
                        wing = cards;
                        break;
                    }
                }

                break;
            }
        }

        return {body: body, wing: wing};
    }

    // 分析四张主体 翅膀
    BanBianTianZha.prototype.analyzeSiZhang = function(cards) {
        var dict = {};
        for (var i = 0; i < cards.length; i++) {
            var p = _.point(cards[i]);
            dict[p] = dict[p] ? dict[p] + 1 : 1;
        }

        var body = -1; // 主体
        var wing = []; // 翅膀
        for (var p in dict) {
            if (dict[p] >= 4) {
                body = Number(p);

                cards = cards.slice();
                this.formatSort(cards);
                for (var i = 0; i < cards.length; i++) {
                    if (_.point(cards[i]) == body) {
                        cards.splice(i, 4);
                        wing = cards;
                        break;
                    }
                }

                break;
            }
        }

        return {body: body, wing: wing};
    }

    // 是否三张
    BanBianTianZha.prototype.isSanZhang = function(cards, hasWings) {
        if (cards.length < 3 || cards.length > 5) {
            return false;
        }

        if (this.isZhaDan(cards)) {
            return false;
        }

        var struct = this.analyzeSanZhang(cards);
        if (struct.body == -1) {
            return false;
        }

        return true;
    }

    // 分析顺子连牌队列
    BanBianTianZha.prototype.analyzeShunZi = function(list) {
        if (list.length < 2) {
            return [];
        }

        var queue = list.slice();
        for (var i = 0; i < queue.length; i++) {
            queue[i] = _.point(queue[i]);
            //不能到2
            if (queue[i] == 15){
                return [];
            }
        }

        queue.sort(function(a, b) {
            return a - b;
        });

        var isShun = true;
        for (var i = queue.length - 1; i >= 1; i--) {
            if (queue[i] - queue[i - 1] != 1) {
                isShun = false;
                break;
            }
        }

        if (isShun) {
            return queue;
        }
        return [];
    }

    // 是否顺子
    BanBianTianZha.prototype.isShunZi = function(cards) {
        if (cards.length < 5) {
            return false;
        }

        return this.analyzeShunZi(cards).length > 0;
    }

    BanBianTianZha.prototype.analyzeLianDui = function(cards) {
        cards = cards.slice();
        this.formatSort(cards);
        var list = [];
        for (var i = 0; i < cards.length; i+=2) {
            if (_.point(cards[i]) != _.point(cards[i + 1])) {
                return [];
            }

            list.push(cards[i]);
        }

        return this.analyzeShunZi(list);
    }

    // 是否连对
    BanBianTianZha.prototype.isLianDui = function(cards) {
        if (cards.length  < 4 || cards.length  > 7 || cards.length % 2 != 0) {
            return false;
        }

        if (this.analyzeLianDui(cards).length > 0) {
            return true;
        }

        return false;
    }


    // 分析飞机主体 翅膀
    BanBianTianZha.prototype.analyzeFeiJi = function(cards, hasWings, bodyLen) {
        hasWings = true;

        var dict = {};
        for (var i = 0; i < cards.length; i++) {
            var p = _.point(cards[i]);
            dict[p] = dict[p] ? dict[p] + 1 : 1;
        }

        var body = []; // 主体 
        var wing = []; // 翅膀
        var list = [];
        for (var p in dict) {
            if (dict[p] >= 3 && p != 15) {
                list.push(Number(p));
            }   
        }

        var queue = list.slice();
        for (var i = 0; i < queue.length; i++) {
            queue[i] = _.point(queue[i]);
        }

        // 正顺
        queue.sort(function(a, b) {
            return a - b;
        });

        var linkNum = 1;
        var maxLinkNum = 1;
        var maxLinkIdx = -1;
        for (var i = 1; i < queue.length; i++) {
            linkNum = (queue[i] - queue[i - 1] == 1) ? linkNum + 1 : 1;
            if (linkNum > maxLinkNum) {
                maxLinkNum = linkNum;
                maxLinkIdx = i;
            }
        }

        if (maxLinkNum >= (bodyLen || 2)) {
            maxLinkNum = bodyLen || maxLinkNum;
            body = queue.slice().splice(maxLinkIdx + 1 - maxLinkNum, maxLinkNum);

            // 这里不计算 翅膀牌
            if (cards.length <= body.length * 5) {
                return {body: body, wing: wing};
            }
        }
        return {body: [], wing: []};
    }

    // 是否飞机
    BanBianTianZha.prototype.isFeiJi = function(cards, hasWings) {
        if (cards.length < 6) {
            return false;
        }

        var struct = this.analyzeFeiJi(cards, hasWings);
        if (struct.body.length < 2) {
            return false;
        }

        return true;
    }

    // 是否同花5-10-k
    BanBianTianZha.prototype.isTongHuaWuShiK = function(cards) {
        if (cards.length != 3) {
            return false;
        }

        cards = cards.slice();
        cards.sort(function(a, b) {
            return _.point(a) - _.point(b);
        });

        if (_.point(cards[0]) != 5 || _.point(cards[1]) != 10 || _.point(cards[2]) != 13) {
            return false;
        }

        if (_.suit(cards[0]) != _.suit(cards[1]) || _.suit(cards[0]) != _.suit(cards[2])) {
            return false;
        }

        return true;
    }

    // 是否杂花5-10-k
    BanBianTianZha.prototype.isZaHuaWuShiK = function(cards) {
        if (cards.length != 3) {
            return false;
        }

        cards = cards.slice();
        cards.sort(function(a, b) {
            return _.point(a) - _.point(b);
        });

        if (_.point(cards[0]) != 5 || _.point(cards[1]) != 10 || _.point(cards[2]) != 13) {
            return false;
        }

        if (_.suit(cards[0]) == _.suit(cards[1]) && _.suit(cards[0]) == _.suit(cards[2])) {
            return false;
        }

        return true;
    }

    // 是否炸弹(王2张及以上 普通牌4张 )
    BanBianTianZha.prototype.isZhaDan = function(cards) {
        if (this.isWangZha(cards)) {
            return true;
        }

        if (cards.length < 4) {
            return false;
        }

        for (var i = 1; i < cards.length; i++) {
            if (_.point(cards[i]) != _.point(cards[i - 1])) {
                return false;
            }

        }

        return true;
    }

    // 是否王炸
    BanBianTianZha.prototype.isWangZha = function(cards) {
        if (cards.length <= 1) {
            return false;
        }

        for (var i = 0; i < cards.length; i++) {
            if (cards[i] != BIG_JOKER && cards[i] != SMALL_JOKER) {
                return false;
            }
        }

        return true;
    }

    // 是否地炸
    BanBianTianZha.prototype.isDiZha = function(cards) {
        if (cards.length  < 8 || cards.length % 2 != 0) {
            return false;
        }

        if (this.analyzeLianDui(cards).length > 0) {
            return true;
        }

        return false;
    }

    //是否四带三
    BanBianTianZha.prototype.isSiDaiSan = function(cards) {
        if (cards.length != 7) {
            return false;
        }

        if (this.isZhaDan(cards)) {
            return false;
        }

        var struct = this.analyzeSiZhang(cards);
        if (struct.body == -1) {
            return false;
        }

        return true;
    }

    //是否同花顺
    BanBianTianZha.prototype.isTongHuaShun = function(cards) {
        if(!this.isShunZi(cards)){
            return false;
        }

        var suitCompare = -1;
        for (var i = 0; i < cards.length; i++) {
            if (suitCompare == -1){
                suitCompare = _.suit(cards[i]);
            }else if (suitCompare != _.suit(cards[i])){
                return false;
            }
        }
        return true;
    }

    // 获取牌型
    BanBianTianZha.prototype.getCardType = function(cards, hasWings, isSiDaiSan) {
        hasWings = true;

        if (this.isTianZha(cards)) {
            return CARD_TYPE.tianZha;
        }

        if (this.isDanZhang(cards)) {
            return CARD_TYPE.danZhang;
        }

        if (this.isZhaDan(cards)) {
            return CARD_TYPE.zhaDan;
        }

        if (this.isDuiZi(cards)) {
            return CARD_TYPE.duiZi;
        }

        if (isSiDaiSan && this.isSiDaiSan(cards)) {
            return CARD_TYPE.siDaiSan;
        }

        if (this.isSanZhang(cards, hasWings)) {
            return CARD_TYPE.sanZhang;
        }

        if (this.isTongHuaShun(cards)){
            return CARD_TYPE.tongHuaShun;
        }

        if (this.isShunZi(cards)) {
            return CARD_TYPE.shunZi;
        }

        if (this.isDiZha(cards)){
            return CARD_TYPE.diZha;
        }

        if (this.isLianDui(cards)) {
            return CARD_TYPE.lianDui;
        }

        if (this.isFeiJi(cards, hasWings)) {
            return CARD_TYPE.feiJi;
        }

        if (this.isTongHuaWuShiK(cards)) {
            return CARD_TYPE.tongHuaWuShiK;
        }

        if (this.isZaHuaWuShiK(cards)) {
            return CARD_TYPE.zaHuaWuShiK;
        }

        return CARD_TYPE.noType;
    }

    // 获取炸弹权值
    BanBianTianZha.prototype.getZhaDanValue = function(cards) {
        var value;
        if (cards[0] == BIG_JOKER || cards[0] == SMALL_JOKER) {
            value = (cards.length * 2 + 0.5) * 100 + _.point(SMALL_JOKER);
            if (cards.toString() == [BIG_JOKER, BIG_JOKER].toString()) { // 2大王能压2小王
                value += 1; // 此处写死 因为不存在2大王 一大王一小王的情况！
            }
        } else {
            value = cards.length * 100 + _.point(cards[0]);
        }

        return value;
    }

    // 牌1是否比牌2大
    BanBianTianZha.prototype.isBigger = function(cards1, cards2, type2, hasWings, bodyLen, wuShiKSe, siDaiSan) {
        hasWings = true;
        
        var type1 = this.getCardType(cards1, hasWings, siDaiSan);
        type2 = type2 || this.getCardType(cards2, hasWings, siDaiSan);

        if (type1 == CARD_TYPE.noType || type2 == CARD_TYPE.noType) {
            return false;
        }

        if (type1 < type2) {
            return false;
        }

        if (type1 > type2) {
            return type1 >= CARD_TYPE.zaHuaWuShiK;
        }

        // 同种牌型
        switch (type1) {
            case CARD_TYPE.danZhang: // 单张
            case CARD_TYPE.duiZi:    // 对子
                return _.point(cards1[0]) > _.point(cards2[0]);
            case CARD_TYPE.sanZhang: // 三张
                return this.analyzeSanZhang(cards1).body > this.analyzeSanZhang(cards2).body;
            case CARD_TYPE.siDaiSan: // 四带三
                return this.analyzeSiZhang(cards1).body > this.analyzeSiZhang(cards2).body;
            case CARD_TYPE.shunZi:  // 顺子
                if (cards1.length != cards2.length) {
                    return false;
                }

                return this.analyzeShunZi(cards1)[0] > this.analyzeShunZi(cards2)[0];
            case CARD_TYPE.lianDui: // 连对
                if (cards1.length != cards2.length) {
                    return false;
                }

                return this.analyzeLianDui(cards1)[0] > this.analyzeLianDui(cards2)[0];
            case CARD_TYPE.feiJi: // 飞机
                var body1 = this.analyzeFeiJi(cards1, hasWings, bodyLen).body;
                var body2 = this.analyzeFeiJi(cards2, hasWings, bodyLen).body;
                if (body1.length != body2.length) {
                    return false;
                }

                return body1[0] > body2[0];
            case CARD_TYPE.zaHuaWuShiK: // 杂花五十K
                return false;
            case CARD_TYPE.tongHuaWuShiK: // 同花五十K
                if (wuShiKSe){
                    return _.suit(cards1[0]) > _.suit(cards2[0]);
                }
                return false;
            case CARD_TYPE.zhaDan: // 炸弹
                return this.getZhaDanValue(cards1) > this.getZhaDanValue(cards2);
            case CARD_TYPE.diZha://地炸 长打短，同长度比点数，同点数不能互压
                if (cards1.length == cards2.length) {
                    return this.analyzeLianDui(cards1)[0] > this.analyzeLianDui(cards2)[0];
                }
                return cards1.length > cards2.length;
            case CARD_TYPE.tongHuaShun:
                if (cards1.length == cards2.length) {
                    var dianShuDif = this.analyzeShunZi(cards1)[0] - this.analyzeShunZi(cards2)[0];
                    if (dianShuDif == 0){//点数都相同则比花色
                        return _.suit(cards1[0]) > _.suit(cards2[0]);
                    }
                    return dianShuDif > 0;
                }
                return cards1.length > cards2.length;
        }
    }

    //是否要的起
    BanBianTianZha.prototype.canBeat = function(hand, cards2, type2, hasWings, bodyLen, isWuShiKHuaSe, isSiDaiSan) {
        hasWings = true;

        type2 = type2 || this.getCardType(cards2, hasWings, isSiDaiSan);
        if (type2 == CARD_TYPE.noType) {
            return false;
        }
        var p_dict = {};//点
        var c_dict = {};//牌
        var jokerList = [];//王
        var huase_dick = [[], [], [], []];//花色牌
        for (var i = 0; i < hand.length; i++) {
            var p = _.point(hand[i]);
            p_dict[p] = p_dict[p] ? p_dict[p] + 1 : 1;

            var c = hand[i];
            c_dict[c] = c_dict[c] ? c_dict[c] + 1 : 1;

            if (c == BIG_JOKER || c == SMALL_JOKER) {
                jokerList.push(c);
            }else{
                huase_dick[_.suit(c) - 1].push(c);
            }
        }
        // 牌点按张数 分类
        var pHash = [
            [], // 0张的牌点(wuyong)
            [], // 1张
            [], // 2张
            [], // 3张
            [], // 4张及以上
        ];
        for (var k in p_dict) {
            var idx = Math.min(p_dict[k], 4);
            pHash[idx].push(Number(k));
        }

        function compareType0To3(list, value) {
            for (var i = list.length - 1; i >= 0; i--) {
                if (list[i] > value) {
                    return true;
                }
            }
            return false;
        }
        
        function compareType4To6(list, value, linkNum) {
            var nowLinkNum = 1;
            var copy = list.slice();
            for (var i = 0; i < copy.length; i++) {
                if (copy[i] == 15) { // 2编码替换
                    copy[i] = 2;
                }
            }

            copy.sort(function(a, b) {
                return a - b;
            });
            for (var i = copy.length - 1; i > 0; i--) {

                if (copy[i] <= value + 1 - nowLinkNum) {
                    return false;
                }

                nowLinkNum = copy[i] - copy[i - 1] == 1 ? nowLinkNum + 1 : 1;
                if (nowLinkNum >= linkNum) {
                    return true;
                }
            }
            return false;
        }
        
        function compareTypeWuShiK(wuShiKList, suit) {
            console.log("chow", "compareTypeWuShiK" +  "wuShiKList = " + JSON.stringify(wuShiKList) + " suit" + suit);
            if(isWuShiKHuaSe){
                for(var i = 0; i < wuShiKList.length; i++){
                    if(wuShiKList[i] > suit){
                        return true;
                    }
                }
            }
            return false;
        }

        function compareTongHuaShun(tongHuaShunList, cards) {
            if(!cards){
                return true;
            }
            for(var i = 0; i < tongHuaShunList.length; i++){
                if(tongHuaShunList[i].count > cards.length){
                    return true;
                }else if(tongHuaShunList[i].count == cards.length){
                    if(_.point(tongHuaShunList[i].card) > _.point(cards[0])){
                        return true;
                    }else if(_.point(tongHuaShunList[i].card) == _.point(cards[0])){
                        if(_.suit(tongHuaShunList[i].card) > _.suit(cards[0])){
                            return true;
                        }
                    }
                }
            }
            return false;
        }

        function compareDiZha(diZhaList, cards) {
            if(!cards){
                return true;
            }
            for(var i = 0; i < diZhaList.length; i++){
                if(diZhaList[i].count * 2 > cards.length){
                    return true;
                }else if(diZhaList[i].count * 2 == cards.length){
                    if(_.point(diZhaList[i].card) > _.point(cards[0])){
                        return true;
                    }
                }
            }
            return false;
        }

        switch(type2){
            case CARD_TYPE.danZhang:
                return compareType0To3(pHash[1].concat(pHash[2], pHash[3]), _.point(cards2[0]))
                    || this.hasWuShiK(p_dict)
                    || this.getTongHuaWuShiK(c_dict).length > 0
                    || pHash[4].length > 0
                    || this.getTongHuaShun(huase_dick).length > 0
                    || this.getDizha(hand).length> 0
                    || jokerList.length > 0;
            case CARD_TYPE.duiZi:
                return compareType0To3(pHash[2].concat(pHash[3]), _.point(cards2[0]))
                    || this.hasWuShiK(p_dict)
                    || this.getTongHuaWuShiK(c_dict).length > 0
                    || pHash[4].length > 0
                    || this.getTongHuaShun(huase_dick).length > 0
                    || this.getDizha(hand).length> 0
                    || jokerList.length > 0;
            case CARD_TYPE.sanZhang:
                return compareType0To3(pHash[3], this.analyzeSanZhang(cards2).body)
                    || this.hasWuShiK(p_dict)
                    || this.getTongHuaWuShiK(c_dict).length > 0
                    || pHash[4].length > 0
                    || this.getTongHuaShun(huase_dick).length > 0
                    || this.getDizha(hand).length> 0
                    || jokerList.length > 0;
            case CARD_TYPE.siDaiSan:
                return compareType0To3(pHash[4], this.analyzeSiZhang(cards2).body)
                    || this.hasWuShiK(p_dict)
                    || this.getTongHuaWuShiK(c_dict).length > 0
                    || pHash[4].length > 0
                    || this.getTongHuaShun(huase_dick).length > 0
                    || this.getDizha(hand).length> 0
                    || jokerList.length > 0;
            case CARD_TYPE.shunZi:
                var queue = this.analyzeShunZi(cards2);
                return compareType4To6(pHash[1].concat(pHash[2], pHash[3]), queue[queue.length - 1], cards2.length)
                    || this.hasWuShiK(p_dict)
                    || this.getTongHuaWuShiK(c_dict).length > 0
                    || pHash[4].length > 0
                    || this.getTongHuaShun(huase_dick).length > 0
                    || this.getDizha(hand).length> 0
                    || jokerList.length > 0;
            case CARD_TYPE.lianDui:
                var queue = this.analyzeLianDui(cards2);
                return compareType4To6(pHash[2].concat(pHash[3]), queue[queue.length - 1], cards2.length / 2)
                    || this.hasWuShiK(p_dict)
                    || this.getTongHuaWuShiK(c_dict).length > 0
                    || pHash[4].length > 0
                    || this.getTongHuaShun(huase_dick).length > 0
                    || this.getDizha(hand).length> 0
                    || jokerList.length > 0;
            case CARD_TYPE.feiJi:
                var body = this.analyzeFeiJi(cards2, hasWings, bodyLen).body;
                return compareType4To6(pHash[3], body[body.length - 1], body.length)
                    || this.hasWuShiK(p_dict)
                    || this.getTongHuaWuShiK(c_dict).length > 0
                    || pHash[4].length > 0
                    || this.getTongHuaShun(huase_dick).length > 0
                    || this.getDizha(hand).length> 0
                    || jokerList.length > 0;
                break;
            case CARD_TYPE.zaHuaWuShiK:
                return this.getTongHuaWuShiK(c_dict).length > 0
                    || pHash[4].length > 0
                    || this.getTongHuaShun(huase_dick).length > 0
                    || this.getDizha(hand).length> 0
                    || jokerList.length > 0;
            case CARD_TYPE.tongHuaWuShiK:
                return compareTypeWuShiK(this.getTongHuaWuShiK(c_dict), _.suit(cards2[0]))
                    || pHash[4].length > 0
                    || this.getTongHuaShun(huase_dick).length > 0
                    || this.getDizha(hand).length> 0
                    || jokerList.length > 0;
            case CARD_TYPE.zhaDan:
                return compareType0To3(pHash[4], _.point(cards2[0]))
                    || this.getTongHuaShun(huase_dick).length > 0
                    || this.getDizha(hand).length> 0
                    || jokerList.length > 0;
                break;
            case CARD_TYPE.tongHuaShun:
                return compareTongHuaShun(this.getTongHuaShun(huase_dick), cards2)
                    || this.getDizha(hand).length> 0
                    || jokerList.length > 0;
            case CARD_TYPE.diZha:
                return compareDiZha(this.getDizha(hand), cards2)
                || jokerList.length > 0;
            case CARD_TYPE.tianZha:
                return false;
            default:
                break;
        }
        return false;
    }

    BanBianTianZha.prototype.hasWuShiK = function(pointCards) {
        if (pointCards[5] > 0 && pointCards[10] > 0 && pointCards[13] > 0) {
            return true;
        }
        return false;
    }

    BanBianTianZha.prototype.getTongHuaWuShiK = function(cards) {
        var tongHuaWuShiK = [];
        for (var suit in SUIT_TYPE) {
            if (cards[SUIT_TYPE[suit] * 100 + 5] > 0 && cards[SUIT_TYPE[suit] * 100 + 10] > 0 && cards[SUIT_TYPE[suit] * 100 + 13] > 0) {
                tongHuaWuShiK.push(SUIT_TYPE[suit]);
            }
        }
        console.log("chow", "getTongHuaWuShiK" + " tongHuaWuShiK = " + JSON.stringify(tongHuaWuShiK));
        return tongHuaWuShiK;
    }

    BanBianTianZha.prototype.getTongHuaShun = function(huaseCards) {
        var dict = huaseCards.slice();
        for(var index = 0; index < dict.length; index++){
            dict[index].sort(function (a, b) {
                return a - b;
            })
        }
        var tonghuashun = [];
        //console.log("chow getTongHuaShun" + " dict = " + JSON.stringify(dict));
        for(var index = 0; index < dict.length; index++){
            var count = 1;
            var card = -1;
            for(var i = 0; i < dict[index].length; i++) {
                var j = i + 1;
                if (j < dict[index].length && _.point(dict[index][i]) != 15 && _.point(dict[index][j]) != 15) {
                    if (dict[index][j] - dict[index][i] == 0) {
                        continue;
                    } else if (dict[index][j] - dict[index][i] == 1) {
                        count++;
                        card = dict[index][j];
                    } else {
                        if (count >= 5) {
                            tonghuashun.push({count: count, card: card});
                        }
                        count = 1;
                    }
                }else{
                    if (count >= 5) {
                        tonghuashun.push({count: count, card: card});
                    }
                    count = 1;
                }
            }
        }
        //console.log("chow  getTongHuaShun" + " tonghuashun = " + JSON.stringify(tonghuashun));
        return tonghuashun;
    }

    BanBianTianZha.prototype.getDizha = function(handCards) {
        var cards = [];
        for(var i = 0; i < handCards.length; i++){
            cards.push(_.point(handCards[i]));
        }
        cards.sort(function (a, b) {
            return a - b;
        });
        var dizha = [];
        //console.log("chow  getDizha" + " cards = " + JSON.stringify(cards));
        var count = 0;
        var card = -1;
        var cur = 0;
        for(var i = 0; i < cards.length; i++) {
            var j = i + 1;
            if (j < cards.length && _.point(cards[i]) != 15 && _.point(cards[j]) != 15) {
                if(cards[j] - cards[i] == 0) {
                    cur++;
                }else if(cards[j] - cards[i] == 1) {
                    if(cur >= 1){
                        count++;
                        card = cards[i];
                    }else{
                        if(count >= 4){
                            dizha.push({count:count, card:card});
                        }
                        count = 0;
                    }
                    cur = 0;
                }else{
                    if(cur >= 1){
                        count++;
                        card = cards[i];
                    }
                    if(count >= 4){
                        dizha.push({count:count, card:card});
                    }
                    count = 0;
                    cur = 0;
                }
            }else{
                if(cur >= 1){
                    count++;
                    card = cards[i];
                }
                if(count >= 4){
                    dizha.push({count:count, card:card});
                }
                count = 0;
                cur = 0;
            }
        }
        //console.log("chow  getDizha" + " dizha = " + JSON.stringify(dizha));
        return dizha;
    }

    //提示出牌
    BanBianTianZha.prototype.hintPutCard = function (hand, cards2, type2, hasWings, bodyLen, isWuShiKHuaSe, isSiDaiSan) {
        hasWings = true;
        if (cards2) {
            type2 = type2 || this.getCardType(cards2, hasWings, isSiDaiSan);
            if (type2 == CARD_TYPE.noType) {
                return [];
            }
        }
        var allMatrix = this.sortByBomb(hand);
        var p_dict = {};
        var c_dict = {};
        for (var i = 0; i < allMatrix[6][0].length; i++) {
            var c = allMatrix[6][0][i];
            c_dict[c] = c_dict[c] ? c_dict[c] + 1 : 1;

            var p = _.point(allMatrix[6][0][i]);
            p_dict[p] = p_dict[p] ? p_dict[p] + 1 : 1;

        }
        // 牌点按张数 分类
        var pHash = [
            [], // 0张的牌点(wuyong)
            [], // 1张
            [], // 2张
            [], // 3张
        ];

        for (var k in p_dict) {
            var count = p_dict[k];
            var point = Number(k);
            pHash[count].push(point);
        }
        var bigTypeMatrix = []; // 更大牌型
        var sameTypeMatrix = []; // 同种牌型的大牌
        var breakMatrix = []; // 需拆组合的牌（连对,三张,飞机）
        // 单张、对子不拆连对 三张不拆飞机;
        function canLink(list, i) {
            // var SHUN_QUEUE = [14, 15, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

            if (list[i] == 14) { // A
                return (/*list.indexOf(15) >= 0 || */list.indexOf(13) >= 0);
            }

            var idx = SHUN_QUEUE.indexOf(list[i]);
            if (idx < 0) {
                return false;
            }

            if (list.indexOf(SHUN_QUEUE[idx - 1]) >= 0 || list.indexOf(SHUN_QUEUE[idx + 1]) >= 0) {
                return true;
            }

            return false;
        }
        function out(row) {
            for (var i = 0; i < row.length; i++) {
                c_dict[row[i]]--;
                p_dict[_.point(row[i])]--;
            }
        }
        // 获取一定张数的特定牌点的牌
        function getCardsByNum(point, needNum) {
            if (point == 2) { // 2实际编码
                point = 15;
            }

            var rtn = [];
            var findNum = 0;
            while (findNum < needNum) {
                for (var suit in SUIT_TYPE) {
                    var cd = SUIT_TYPE[suit] * 100 + point;
                    var num = c_dict[cd];
                    if (num && num > 0) {
                        for (var i = 1; i <= Math.min(num, needNum - findNum); i++) {
                            rtn.push(cd);
                        }
                        findNum += num;
                    }
                }
            }
            return rtn;
        }
        
        function getBiggerZaHuaWushiK() {
            return allMatrix[5];
        }

        function getBiggerTongHuaWushiK(cards) {
            //console.log("chow", "getBiggerTongHuaWushiK" + " isWuShiKHuaSe = " + isWuShiKHuaSe);
            var matrix = [];
            for(var i = 0; i < allMatrix[4].length; i++){
                var row = allMatrix[4][i];
                var add = false;
                if(cards){
                    if(isWuShiKHuaSe && _.suit(row[0]) > _.suit(cards[0])){
                        add = true;
                    }
                }else{
                    add = true;

                }
                if(add == true){
                    matrix.push(row);
                }
            }
            return matrix;
        }
        
        function getBiggerZha(cards) {
            var matrix = [];
            for(var i = 0; i < allMatrix[3].length; i++){
                var row = allMatrix[3][i];
                var add = false;
                if(cards){
                    if(_.point(row[0]) > _.point(cards[0])){
                        add = true;
                    }
                }else{
                    add = true;

                }
                if(add == true){
                    matrix.push(row);
                }
            }
            return matrix;
        }

        function getBiggerTongHuaShun(cards) {
            var matrix = [];
            for(var i = 0; i < allMatrix[2].length; i++){
                var row = allMatrix[2][i];
                var add = false;
                if(cards){
                    if(row.length > cards.length){
                        add = true;
                    }else if(row.length == cards.length){
                        if(_.point(row[row.length - 1]) > _.point(cards[0])){
                            add = true;
                        }else if(_.point(row[row.length - 1]) == _.point(cards[0])){
                            if(_.suit(row[row.length - 1]) > _.suit(cards[0])){
                                add = true;
                            }
                        }
                    }
                }else{
                    add = true;

                }
                if(add == true){
                    matrix.push(row);
                }
            }
            return matrix;
        }

        function getBiggerDizha(cards) {
            var matrix = [];
            for(var i = 0; i < allMatrix[1].length; i++){
                var row = allMatrix[1][i];
                var add = false;
                if(cards){
                    if(row.length > cards.length){
                        add = true;
                    }else if(row.length == cards.length){
                        if(_.point(row[row.length - 1]) > _.point(cards[0])){
                            add = true;
                        }
                    }
                }else{
                    add = true;

                }
                if(add == true){
                    matrix.push(row);
                }
            }
            return matrix;
        }
        
        function getBigerTianZha() {
            return allMatrix[0];
        }

        if (!cards2) { // 回合第一首牌
            var type = this.getCardType(allMatrix[6][0], hasWings);
            if (type == CARD_TYPE.sanZhang || type == CARD_TYPE.feiJi) { // 单张 飞机
                allMatrix[6][0] = allMatrix[6][0].slice();
                this.formatSort(allMatrix[6][0]);
                return [allMatrix[6][0]];
            }

            // 单张
            for (var i = 0; i < pHash[1].length; i++) {
                var cards = getCardsByNum(pHash[1][i], 1);
                sameTypeMatrix.push(cards);
            }

            // 对子
            for (var i = 0; i < pHash[2].length; i++) {
                var point = pHash[2][i];
                if (!canLink(pHash[2], i)) {
                    var cards = getCardsByNum(point, 2);
                    sameTypeMatrix.push(cards);
                }
            }

            // 三张
            for (var i = 0; i < pHash[3].length; i++) {
                var point = pHash[3][i];
                if (!canLink(pHash[3], i)) {
                    var cards = getCardsByNum(point, 3);
                    sameTypeMatrix.push(cards);
                }
            }

            // 顺子 连对飞机牌型组合
            var pushLinkCards = function(list, endPos, linkNum, needNum) {
                var cards = [];
                for (var i = linkNum - 1; i >= 0; i--) {
                    cards = cards.concat(getCardsByNum(SHUN_QUEUE[endPos - i], needNum));
                }

                this.formatSort(cards);
                sameTypeMatrix.push(cards);
            }.bind(this);

            // 顺子
            var list = pHash[1].concat(pHash[2]);
            list.sort(function(a, b) {
                return SHUN_QUEUE.indexOf(a) - SHUN_QUEUE.indexOf(b);
            });
            for(var i = list.length - 1; i >= 0; i--){
                if(list[i] == 15){
                    list.splice(i, 1);
                }
            }
            if (list.indexOf(14) >= 0 && list.length <= SHUN_QUEUE.length - 1) {
                list.push(14); // 最后放一个A
            }

            var nowLinkNum = 1;
            var pos = 0;
            for (var i = 1; i < list.length; i++) {
                if (nowLinkNum == 1) {
                    pos = SHUN_QUEUE.indexOf(list[i - 1]);
                }

                if (list[i] == SHUN_QUEUE[pos + 1]) {
                    nowLinkNum++;
                    pos++;
                } else {
                    if (nowLinkNum >= 5) {
                        pushLinkCards(list, pos, nowLinkNum, 1);
                    }
                    nowLinkNum = 1;
                }

                if (i == list.length - 1 && nowLinkNum >= 5) { // 收尾
                    if (nowLinkNum == SHUN_QUEUE.length) {
                        nowLinkNum--;
                    }
                    pushLinkCards(list, pos, nowLinkNum, 1);
                }
            }

            // 连对
            var list = pHash[2];
            for (var i = 0; i < pHash[3].length; i++) {
                if (!canLink(pHash[3], i)) {
                    list.push(pHash[3][i]);
                }
            }
            list.sort(function(a, b) {
                return SHUN_QUEUE.indexOf(a) - SHUN_QUEUE.indexOf(b);
            });
            for(var i = list.length - 1; i >= 0; i--){
                if(list[i] == 15){
                    list.splice(i, 1);
                }
            }
            if (list.indexOf(14) >= 0 && list.length <= SHUN_QUEUE.length - 1) {
                list.push(14); // 最后放一个A
            }

            var nowLinkNum = 1;
            var pos = 0;
            for (var i = 1; i < list.length; i++) {
                if (nowLinkNum == 1) {
                    pos = SHUN_QUEUE.indexOf(list[i - 1]);
                }
                if (list[i] == SHUN_QUEUE[pos + 1]) {
                    nowLinkNum++;
                    pos++;
                } else {
                    if (nowLinkNum >= 2) {
                        pushLinkCards(list, pos, nowLinkNum, 2);
                    }
                    nowLinkNum = 1;
                }

                if (i == list.length - 1 && nowLinkNum >= 2) { // 收尾
                    if (nowLinkNum == SHUN_QUEUE.length) {
                        nowLinkNum--;
                    }
                    pushLinkCards(list, pos, nowLinkNum, 2);
                }
            }

            // var SHUN_QUEUE = [14, 15, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

            // 飞机
            list = pHash[3].slice();
            list.sort(function(a, b) {
                return SHUN_QUEUE.indexOf(a) - SHUN_QUEUE.indexOf(b);
            });
            for(var i = list.length - 1; i >= 0; i--){
                if(list[i] == 15){
                    list.splice(i, 1);
                }
            }
            nowLinkNum = 1;
            pos = 0;
            for (var i = 1; i < list.length; i++) {
                if (nowLinkNum == 1) {
                    pos = SHUN_QUEUE.indexOf(list[i - 1]);
                }

                if (list[i] == SHUN_QUEUE[pos + 1]) {
                    nowLinkNum++;
                    pos++;
                } else {
                    if (nowLinkNum >= 2) {
                        pushLinkCards(list, pos, nowLinkNum, 3);
                    }
                    nowLinkNum = 1;
                }

                if (i == list.length - 1 && nowLinkNum >= 2) { // 收尾
                    if (nowLinkNum == SHUN_QUEUE.length) {
                        nowLinkNum--;
                    }
                    pushLinkCards(list, pos, nowLinkNum, 3);
                }
            }
            bigTypeMatrix = bigTypeMatrix.
            concat(getBiggerZaHuaWushiK()).
            concat(getBiggerTongHuaWushiK()).
            concat(getBiggerZha()).
            concat(getBiggerTongHuaShun()).
            concat(getBiggerDizha()).
            concat(getBigerTianZha());
        } else if (type2 < CARD_TYPE.zaHuaWuShiK) { //五十K以下
            var needNum = 0; // 需要牌张数
            var list = []; // 可取牌点集合
            var breakList = [];
            var value = 0; // 比较值
            var linkNum = 0; // 连对 飞机连牌数

            if (type2 == CARD_TYPE.sanZhang || type2 == CARD_TYPE.feiJi) { // 三张、飞机可带完 提示全部手牌
                var type = this.getCardType(allMatrix[6][0], hasWings);
                if ((type == CARD_TYPE.sanZhang || type == CARD_TYPE.feiJi) && this.isBigger(allMatrix[6][0], cards2, type2, hasWings, bodyLen, isWuShiKHuaSe, isSiDaiSan)) {
                    allMatrix[6][0] = allMatrix[6][0].slice();
                    this.formatSort(allMatrix[6][0]);
                    return [allMatrix[6][0]].
                            concat(getBiggerZaHuaWushiK()).
                            concat(getBiggerTongHuaWushiK()).
                            concat(getBiggerZha()).
                            concat(getBiggerTongHuaShun()).
                            concat(getBiggerDizha()).
                            concat(getBigerTianZha());
                }
            }

            switch (type2) {
                case CARD_TYPE.danZhang: // 单张
                    needNum = 1;
                    list = pHash[1];
                    breakList = pHash[3];
                    for (var i = 0; i < pHash[2].length; i++) {
                        if (!canLink(pHash[2], i)) { // 不拆连对
                            list.push(pHash[2][i]);
                        } else {
                            breakList.push(pHash[2][i]);
                        }
                    }
                    value = _.point(cards2[0]);
                    break;
                case CARD_TYPE.duiZi:    // 对子
                    needNum = 2;
                    list = [];
                    breakList = pHash[3];
                    for (var i = 0; i < pHash[2].length; i++) {
                        if (!canLink(pHash[2], i)) { // 不拆连对
                            list.push(pHash[2][i]);
                        } else {
                            breakList.push(pHash[2][i]);
                        }
                    }
                    value = _.point(cards2[0]);
                    break;
                case CARD_TYPE.sanZhang: // 三张
                    needNum = 3;
                    list = [];
                    for (var i = 0; i < pHash[3].length; i++) {
                        if (!canLink(pHash[3], i)) { // 不拆飞机
                            list.push(pHash[3][i]);
                        } else {
                            breakList.push(pHash[3][i]);
                        }
                    }
                    value = this.analyzeSanZhang(cards2).body;
                    break;
                case CARD_TYPE.shunZi: // 顺子
                    needNum = 1;
                    list = pHash[1].concat(pHash[2]).concat(pHash[3]);
                    linkNum = cards2.length;
                    var queue = this.analyzeShunZi(cards2);
                    value = queue[queue.length - 1];
                    break;
                case CARD_TYPE.lianDui: // 连对
                    needNum = 2;
                    list = pHash[2].concat(pHash[3]);
                    linkNum = cards2.length / 2;
                    var queue = this.analyzeLianDui(cards2);
                    value = queue[queue.length - 1];
                    break;
                case CARD_TYPE.feiJi: // 飞机
                    needNum = 3;
                    list = pHash[3].slice();
                    var body2 = this.analyzeFeiJi(cards2, hasWings, bodyLen).body;
                    linkNum = body2.length;
                    value = body2[body2.length - 1];
                    break;
            }

            if (type2 == CARD_TYPE.danZhang || type2 == CARD_TYPE.duiZi || type2 == CARD_TYPE.sanZhang) {
                for (var i = 0; i < list.length; i++) {
                    if (list[i] > value) {
                        var cards = getCardsByNum(list[i], needNum);
                        sameTypeMatrix.push(cards);
                    }
                }

                for (var i = 0; i < breakList.length; i++) {
                    if (breakList[i] > value) {
                        var cards = getCardsByNum(breakList[i], needNum);
                        breakMatrix.push(cards);
                    }
                }
            } else { // 顺子 连对 飞机
                var nowLinkNum = 1;
                for (var i = 0; i < list.length; i++) {
                    if (list[i] == 15) { // 2 编码替换
                        list[i] = 2;
                        break;
                    }
                }

                list.sort(function(a, b) {
                    return a - b;
                });
                for (var i = 1; i < list.length; i++) {
                    nowLinkNum = list[i] - list[i - 1] == 1 ? nowLinkNum + 1 : 1;
                    if (nowLinkNum >= linkNum && list[i] > value) {
                        var cards = [];
                        for (var j = linkNum - 1; j >= 0; j--) {
                            cards = cards.concat(getCardsByNum(list[i] - j, needNum));
                        }

                        this.formatSort(cards);
                        sameTypeMatrix.push(cards);
                        nowLinkNum -= 1;
                    }
                }
            }
            bigTypeMatrix = bigTypeMatrix.
                            concat(getBiggerZaHuaWushiK()).
                            concat(getBiggerTongHuaWushiK()).
                            concat(getBiggerZha()).
                            concat(getBiggerTongHuaShun()).
                            concat(getBiggerDizha()).
                            concat(getBigerTianZha());
        } else {
            switch (type2) {
                case CARD_TYPE.zaHuaWuShiK:
                    bigTypeMatrix = bigTypeMatrix.
                    concat(getBiggerTongHuaWushiK()).
                    concat(getBiggerZha()).
                    concat(getBiggerTongHuaShun()).
                    concat(getBiggerDizha()).
                    concat(getBigerTianZha());
                    break;
                case CARD_TYPE.tongHuaWuShiK:
                    bigTypeMatrix = bigTypeMatrix.
                    concat(getBiggerTongHuaWushiK(cards2)).
                    concat(getBiggerZha()).
                    concat(getBiggerTongHuaShun()).
                    concat(getBiggerDizha()).
                    concat(getBigerTianZha());
                    break;
                case CARD_TYPE.zhaDan: // 炸弹
                    bigTypeMatrix = bigTypeMatrix.
                    concat(getBiggerZha(cards2)).
                    concat(getBiggerTongHuaShun()).
                    concat(getBiggerDizha()).
                    concat(getBigerTianZha());
                    break;
                case CARD_TYPE.tongHuaShun:
                    bigTypeMatrix = bigTypeMatrix.
                    concat(getBiggerTongHuaShun(cards2)).
                    concat(getBiggerDizha()).
                    concat(getBigerTianZha());
                    break;
                case CARD_TYPE.diZha:
                    bigTypeMatrix = bigTypeMatrix.
                    concat(getBiggerDizha(cards2)).
                    concat(getBigerTianZha());
                    break;
                case CARD_TYPE.tianZha:
                    break;
                default:
                    break;
            }
        }
        console.log("chow", "hintPutCard" + " bigTypeMatrix = " + JSON.stringify(bigTypeMatrix));
        if (sameTypeMatrix.concat(bigTypeMatrix).length == 0 && breakMatrix.length > 0) {
            return breakMatrix;
        }

        return sameTypeMatrix.concat(bigTypeMatrix);
    }

    // 提示出牌
    /*BanBianTianZha.prototype.hintPutCard = function(hand, cards2, type2, hasWings, bodyLen, isWuShiKHuaSe, isSiDaiSan) {
        hasWings = true;
        var hintMatrix = [];
        if (cards2) {
            type2 = type2 || this.getCardType(cards2, hasWings, isSiDaiSan);
            if (type2 == CARD_TYPE.noType) {
                return hintMatrix;
            }
        }

        var breakMatrix = []; // 需拆组合的牌（连对,三张,飞机）

        // 牌统计; 提取炸弹 五十K
        var p_dict = {
            "5": 0,
            "10": 0,
            "13": 0
        };
        var c_dict = {};
        var jokerList = [];
        var huase_dick = [[], [], [], []];//花色牌
        for (var i = 0; i < hand.length; i++) {
            var c = hand[i];
            if (c == BIG_JOKER || c == SMALL_JOKER) {
                jokerList.push(c);
                continue;
            }else{
                huase_dick[_.suit(c) - 1].push(c);
            }
            c_dict[c] = c_dict[c] ? c_dict[c] + 1 : 1;

            var p = _.point(hand[i]);
            p_dict[p] = p_dict[p] ? p_dict[p] + 1 : 1;

        }

        var zhaDanList = []; // 炸弹
        var wuShiKList1 = []; // 正五十K
        var wuShiKList2 = [];//副五十K

        function out(row) {
            for (var i = 0; i < row.length; i++) {
                c_dict[row[i]]--;
                p_dict[_.point(row[i])]--;
            }
        }

        // 获取一定张数的特定牌点的牌
        function getCardsByNum(point, needNum) {
            // console.log("getCardsByNum point@@", point, " needNum@@ ", needNum);
            // console.log("c_dict @@", JSON.stringify(c_dict));
            if (point == 2) { // 2实际编码
                point = 15;
            }

            var rtn = [];
            var findNum = 0;
            while (findNum < needNum) {
                for (var suit in SUIT_TYPE) {
                    var cd = SUIT_TYPE[suit] * 100 + point;
                    var num = c_dict[cd];
                    if (num && num > 0) {
                        for (var i = 1; i <= Math.min(num, needNum - findNum); i++) {
                            rtn.push(cd);
                        }
                        findNum += num;
                    }
                }
            }

            // console.log('rtn@@ ', rtn);
            return rtn;
        }

        // 取五十K
        if (p_dict[5] < 4 && p_dict[10] < 4 && p_dict[13] < 4) {
            var num = Math.min(p_dict[5], p_dict[10], p_dict[13]);
            var findNum = 0;
            for (var i = 1; i <= 4; i++) {
                if (c_dict[i * 100 + 5] > 0 && c_dict[i * 100 + 10] > 0 && c_dict[i * 100 + 13] > 0) {
                    var row = [i * 100 + 5, i * 100 + 10, i * 100 + 13];
                    wuShiKList1.push(row);
                    out(row);
                    findNum++;
                    i--;
                }
            }

            while(num - findNum) {
                var row = [getCardsByNum(5, 1)[0], getCardsByNum(10, 1)[0], getCardsByNum(13, 1)[0]];
                wuShiKList2.push(row);
                out(row);
                findNum++;
            }
        }

        // 牌点按张数 分类
        var pHash = [
            [], // 0张的牌点(wuyong)
            [], // 1张
            [], // 2张
            [], // 3张
        ];

        for (var k in p_dict) {
            var count = p_dict[k];
            var point = Number(k);
            if (count > 0 && count <= 3) {
                pHash[count].push(point);
            } else if (count >= 4) {
                var cards = getCardsByNum(point, count); // 组成炸弹的牌
                zhaDanList.push({cards: cards, value: this.getZhaDanValue(cards)});
            }
        }


        zhaDanList.sort(function(a, b) {
            return a.value - b.value;
        });

        var allZhaMatrix = [];

        for (var i = 0; i < zhaDanList.length; i++) {
            allZhaMatrix.push(zhaDanList[i].cards);
        }

        var bigTypeMatrix = []; // 更大牌型
        var sameTypeMatrix = []; // 同种牌型的大牌

        // 单张、对子不拆连对 三张不拆飞机;
        function canLink(list, i) {
            // var SHUN_QUEUE = [14, 15, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

            if (list[i] == 14) { // A
                return (list.indexOf(15) >= 0 || list.indexOf(13) >= 0);
            }

            var idx = SHUN_QUEUE.indexOf(list[i]);
            if (idx < 0) {
                return false;
            }

            if (list.indexOf(SHUN_QUEUE[idx - 1]) >= 0 || list.indexOf(SHUN_QUEUE[idx + 1]) >= 0) {
                return true;
            }

            return false;
        }
        
        function getTongHuaWuShiK(wuShiKList, cards) {
            var matrix = [];
            for(var i = 0; i < wuShiKList.length; i++){
                var add = false;
                if(cards){
                    if(isWuShiKHuaSe && _.suit(wuShiKList[i][0]) > _.suit(cards[0])){
                        add = true;
                    }
                }else{
                    add = true;
                }
                if(add == true){
                    matrix.push(wuShiKList[i]);
                }
            }
            cc.log("chow", "hintPutCard" + " getTongHuaWuShiK" + " matrix = " + JSON.stringify(matrix));
            return matrix;
        }
        
        function getTongHuaShun(tongHuaShunList, cards) {
            var matrix = [];
            for(var i = 0; i < tongHuaShunList.length; i++){
                var add = false;
                if(cards){
                    if(tongHuaShunList[i].count > cards.length){
                        add = true;
                    }else if(tongHuaShunList[i].count == cards.length){
                        if(_.point(tongHuaShunList[i].card) > _.point(cards[0])){
                            add = true;
                        }else if(_.point(tongHuaShunList[i].card) == _.point(cards[0])){
                            if(_.suit(tongHuaShunList[i].card) > _.suit(cards[0])){
                                add = true;
                            }
                        }
                    }
                }else{
                    add = true;
                }
                if(add == true){
                    var row = [];
                    for(var j = 0; j < tongHuaShunList[i].count; j++){
                        row.push(tongHuaShunList[i].card - j);
                    }
                    matrix.push(row);
                }
            }
            cc.log("chow", "hintPutCard" + " getTongHuaShun" + " matrix = " + JSON.stringify(matrix));
            return matrix;
        }
        
        function getDiZha(diZhaList, cards) {
            var matrix = [];
            for(var i = 0; i < diZhaList.length; i++){
                var add = false;
                if(cards){
                    if(diZhaList[i].count * 2 > cards.length){
                        add = true;
                    }else if(diZhaList[i].count * 2 == cards.length){
                        if(_.point(diZhaList[i].card) > _.point(cards[0])){
                            add = true;
                        }
                    }
                }else{
                    add = true;
                }
                if(add == true){
                    var row = [];
                    for(var j = 0; j < diZhaList[i].count; j++){
                        var cardsTemp = getCardsByNum(diZhaList[i].card - j, 2);
                        row.push(cardsTemp[0]);
                        row.push(cardsTemp[1]);
                    }
                    matrix.push(row);
                }
            }
            cc.log("chow", "hintPutCard" + " getDiZha" + " matrix = " + JSON.stringify(matrix));
            return matrix;
        }

        if (!cards2) { // 回合第一首牌
            var type = this.getCardType(hand, hasWings);
            if (type == CARD_TYPE.sanZhang || type == CARD_TYPE.feiJi) { // 单张 飞机
                hand = hand.slice();
                this.formatSort(hand);
                return [hand];
            }

            // 单张
            for (var i = 0; i < pHash[1].length; i++) {
                var cards = getCardsByNum(pHash[1][i], 1);
                sameTypeMatrix.push(cards);
            }

            // 对子
            for (var i = 0; i < pHash[2].length; i++) {
                var point = pHash[2][i];
                if (!canLink(pHash[2], i)) {
                    var cards = getCardsByNum(point, 2);
                    sameTypeMatrix.push(cards);
                }
            }

            // 三张
            for (var i = 0; i < pHash[3].length; i++) {
                var point = pHash[3][i];
                if (!canLink(pHash[3], i)) {
                    var cards = getCardsByNum(point, 3);
                    sameTypeMatrix.push(cards);
                }
            }

            // 顺子 连对飞机牌型组合
            var pushLinkCards = function(list, endPos, linkNum, needNum) {
                var cards = [];
                for (var i = linkNum - 1; i >= 0; i--) {
                    cards = cards.concat(getCardsByNum(SHUN_QUEUE[endPos - i], needNum));
                }

                this.formatSort(cards);
                sameTypeMatrix.push(cards);
            }.bind(this);

            // 顺子
            var list = pHash[1].concat(pHash[2]);
            list.sort(function(a, b) {
                return SHUN_QUEUE.indexOf(a) - SHUN_QUEUE.indexOf(b);
            });
            if (list.indexOf(14) >= 0 && list.length <= SHUN_QUEUE.length - 1) {
                list.push(14); // 最后放一个A
            }

            var nowLinkNum = 1;
            var pos = 0;
            for (var i = 1; i < list.length; i++) {
                if (nowLinkNum == 1) {
                    pos = SHUN_QUEUE.indexOf(list[i - 1]);
                }

                if (list[i] == SHUN_QUEUE[pos + 1]) {
                    nowLinkNum++;
                    pos++;
                } else {
                    if (nowLinkNum >= 5) {
                        pushLinkCards(list, pos, nowLinkNum, 1);
                    }
                    nowLinkNum = 1;
                }

                if (i == list.length - 1 && nowLinkNum >= 5) { // 收尾
                    if (nowLinkNum == SHUN_QUEUE.length) {
                        nowLinkNum--;
                    }
                    pushLinkCards(list, pos, nowLinkNum, 1);
                }
            }

            // 连对
            var list = pHash[2];
            for (var i = 0; i < pHash[3].length; i++) {
                if (!canLink(pHash[3], i)) {
                    list.push(pHash[3][i]);
                }
            }
            list.sort(function(a, b) {
                return SHUN_QUEUE.indexOf(a) - SHUN_QUEUE.indexOf(b);
            });

            if (list.indexOf(14) >= 0 && list.length <= SHUN_QUEUE.length - 1) {
                list.push(14); // 最后放一个A
            }

            var nowLinkNum = 1;
            var pos = 0;
            for (var i = 1; i < list.length; i++) {
                if (nowLinkNum == 1) {
                    pos = SHUN_QUEUE.indexOf(list[i - 1]);
                }

                if (list[i] == SHUN_QUEUE[pos + 1]) {
                    nowLinkNum++;
                    pos++;
                } else {
                    if (nowLinkNum >= 2) {
                        pushLinkCards(list, pos, nowLinkNum, 2);
                    }
                    nowLinkNum = 1;
                }

                if (i == list.length - 1 && nowLinkNum >= 2) { // 收尾
                    if (nowLinkNum == SHUN_QUEUE.length) {
                        nowLinkNum--;
                    }
                    pushLinkCards(list, pos, nowLinkNum, 2);
                }
            }

            // var SHUN_QUEUE = [14, 15, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

            // 飞机
            list = pHash[3].slice();
            list.sort(function(a, b) {
                return SHUN_QUEUE.indexOf(a) - SHUN_QUEUE.indexOf(b);
            });
            nowLinkNum = 1;
            pos = 0;
            for (var i = 1; i < list.length; i++) {
                if (nowLinkNum == 1) {
                    pos = SHUN_QUEUE.indexOf(list[i - 1]);
                }

                if (list[i] == SHUN_QUEUE[pos + 1]) {
                    nowLinkNum++;
                    pos++;
                } else {
                    if (nowLinkNum >= 2) {
                        pushLinkCards(list, pos, nowLinkNum, 3);
                    }
                    nowLinkNum = 1;
                }

                if (i == list.length - 1 && nowLinkNum >= 2) { // 收尾
                    if (nowLinkNum == SHUN_QUEUE.length) {
                        nowLinkNum--;
                    }
                    pushLinkCards(list, pos, nowLinkNum, 3);
                }
            }
        } else if (type2 < CARD_TYPE.zaHuaWuShiK) { //五十K以下
            var needNum = 0; // 需要牌张数
            var list = []; // 可取牌点集合
            var breakList = [];
            var value = 0; // 比较值
            var linkNum = 0; // 连对 飞机连牌数

            if (type2 == CARD_TYPE.sanZhang || type2 == CARD_TYPE.feiJi) { // 三张、飞机可带完 提示全部手牌
                var type = this.getCardType(hand, hasWings);
                if ((type == CARD_TYPE.sanZhang || type == CARD_TYPE.feiJi) && this.isBigger(hand, cards2, type2, hasWings, bodyLen, isWuShiKHuaSe)) {
                    hand = hand.slice();
                    this.formatSort(hand);
                    return [hand];
                }
            }

            switch (type2) {
                case CARD_TYPE.danZhang: // 单张
                    needNum = 1;
                    list = pHash[1];
                    breakList = pHash[3];
                    for (var i = 0; i < pHash[2].length; i++) {
                        if (!canLink(pHash[2], i)) { // 不拆连对
                            list.push(pHash[2][i]);
                        } else {
                            breakList.push(pHash[2][i]);
                        }
                    }
                    value = _.point(cards2[0]);
                    break;
                case CARD_TYPE.duiZi:    // 对子
                    needNum = 2;
                    list = [];
                    breakList = pHash[3];
                    for (var i = 0; i < pHash[2].length; i++) {
                        if (!canLink(pHash[2], i)) { // 不拆连对
                            list.push(pHash[2][i]);
                        } else {
                            breakList.push(pHash[2][i]);
                        }
                    }
                    value = _.point(cards2[0]);
                    break;
                case CARD_TYPE.sanZhang: // 三张
                    needNum = 3;
                    list = [];
                    for (var i = 0; i < pHash[3].length; i++) {
                        if (!canLink(pHash[3], i)) { // 不拆飞机
                            list.push(pHash[3][i]);
                        } else {
                            breakList.push(pHash[3][i]);
                        }
                    }
                    value = this.analyzeSanZhang(cards2).body;
                    break;
                case CARD_TYPE.shunZi: // 顺子
                    needNum = 1;
                    list = pHash[1].concat(pHash[2]).concat(pHash[3]);
                    linkNum = cards2.length;
                    var queue = this.analyzeShunZi(cards2);
                    value = queue[queue.length - 1];
                    break;
                case CARD_TYPE.lianDui: // 连对
                    needNum = 2;
                    list = pHash[2].concat(pHash[3]);
                    linkNum = cards2.length / 2;
                    var queue = this.analyzeLianDui(cards2);
                    value = queue[queue.length - 1];
                    break;
                case CARD_TYPE.feiJi: // 飞机
                    needNum = 3;
                    list = pHash[3].slice();
                    var body2 = this.analyzeFeiJi(cards2, hasWings, bodyLen).body;
                    linkNum = body2.length;
                    value = body2[body2.length - 1];
                    break;
            }

            if (type2 == CARD_TYPE.danZhang || type2 == CARD_TYPE.duiZi || type2 == CARD_TYPE.sanZhang) {
                for (var i = 0; i < list.length; i++) {
                    if (list[i] > value) {
                        var cards = getCardsByNum(list[i], needNum);
                        sameTypeMatrix.push(cards);
                    }
                }

                for (var i = 0; i < breakList.length; i++) {
                    if (breakList[i] > value) {
                        var cards = getCardsByNum(breakList[i], needNum);
                        breakMatrix.push(cards);
                    }
                }
            } else { // 顺子 连对 飞机
                var nowLinkNum = 1;
                for (var i = 0; i < list.length; i++) {
                    if (list[i] == 15) { // 2 编码替换
                        list[i] = 2;
                        break;
                    }
                }

                list.sort(function(a, b) {
                    return a - b;
                });
                for (var i = 1; i < list.length; i++) {
                    nowLinkNum = list[i] - list[i - 1] == 1 ? nowLinkNum + 1 : 1;
                    if (nowLinkNum >= linkNum && list[i] > value) {
                        var cards = [];
                        for (var j = linkNum - 1; j >= 0; j--) {
                            cards = cards.concat(getCardsByNum(list[i] - j, needNum));
                        }

                        this.formatSort(cards);
                        sameTypeMatrix.push(cards);
                        nowLinkNum -= 1;
                    }
                }
            }
            cc.log("chow", "jokerList = " + JSON.stringify(jokerList));
            bigTypeMatrix = bigTypeMatrix.concat(wuShiKList2).
            concat(getTongHuaWuShiK(wuShiKList1)).
            concat(allZhaMatrix).
            concat(getTongHuaShun(this.getTongHuaShun(huase_dick))).
            concat(getDiZha(this.getDizha(hand))).
            concat([jokerList]);
        } else {
            switch (type2) {
                case CARD_TYPE.zaHuaWuShiK:
                    bigTypeMatrix = bigTypeMatrix.concat(getTongHuaWuShiK(wuShiKList1)).
                    concat(allZhaMatrix).
                    concat(getTongHuaShun((this.getTongHuaShun(huase_dick)))).
                    concat(getDiZha(this.getDizha(hand))).
                    concat([jokerList]);
                    break;
                case CARD_TYPE.tongHuaWuShiK:
                    bigTypeMatrix = bigTypeMatrix.concat(getTongHuaWuShiK(wuShiKList1,cards)).
                    concat(allZhaMatrix).
                    concat(getTongHuaShun((this.getTongHuaShun(huase_dick)))).
                    concat(getDiZha(this.getDizha(hand))).concat([jokerList]);
                    break;
                case CARD_TYPE.zhaDan: // 炸弹
                    for (var i = 0; i < zhaDanList.length; i++) {
                        if (zhaDanList[i].value  > this.getZhaDanValue(cards2)) {
                            sameTypeMatrix = allZhaMatrix.slice(i);
                            break;
                        }
                    }
                    bigTypeMatrix = bigTypeMatrix.concat(getTongHuaShun(this.getTongHuaShun(huase_dick))).
                    concat(getDiZha(this.getDizha(hand))).
                    concat([jokerList]);
                    break;
                case CARD_TYPE.tongHuaShun:
                    bigTypeMatrix = bigTypeMatrix. concat(getTongHuaShun(this.getTongHuaShun(huase_dick), cards)).
                    concat(getDiZha(this.getDizha(hand))).
                    concat([jokerList]);
                    break;
                case CARD_TYPE.diZha:
                    bigTypeMatrix = bigTypeMatrix.concat(getDiZha(this.getDizha(hand), cards)).
                    concat([jokerList]);
                    break;
                case CARD_TYPE.tianZha:
                    break;
                default:
                    break;
            }
        }
        cc.log("chow", "hintPutCard" + " bigTypeMatrix = " + JSON.stringify(bigTypeMatrix));
        if (sameTypeMatrix.concat(bigTypeMatrix).length == 0 && breakMatrix.length > 0) {
            return breakMatrix;
        }

        return sameTypeMatrix.concat(bigTypeMatrix);
    }*/

    // 不可用的牌
    BanBianTianZha.prototype.getDisabledList = function(hand, cards2, type2, deckNum, hasWings, bodyLen, isWuShiKHuaSe, isSiDaiSan) {
        hasWings = true;
        return []; // todo

        if (!cards2) {
            return [];
        }

        type2 = type2 || this.getCardType(cards2, deckNum, hasWings, isSiDaiSan);
        if (type2 == CARD_TYPE.noType) {
            return [];
        }

        var list4 = []; // 提取筒子 地炸 喜之前4张以上牌

        // 牌统计; 提取喜、地炸、筒子
        var p_dict = {};
        var c_dict = {};
        for (var i = 0; i < hand.length; i++) {
            var p = _.point(hand[i]);
            p_dict[p] = p_dict[p] ? p_dict[p] + 1 : 1;

            var c = hand[i];
            c_dict[c] = c_dict[c] ? c_dict[c] + 1 : 1;
        }

        var zhaDanList = []; // 炸弹
        var tongZiList = []; // 筒子
        var diZhaList = []; // 地炸
        var xiList = []; // 喜
        for (var k in p_dict) {
            if (p_dict[k] >= 4) {
                list4.push(Number(k));
            }

            if (p_dict[k] >= 8 && deckNum == 3) {
                if (c_dict[Number(k) + 100] >= 2 && c_dict[Number(k) + 200] >= 2 && c_dict[Number(k) + 300] >= 2 && c_dict[Number(k) + 400] >= 2) {
                    diZhaList.push(Number(k));
                    // p_dict[k] -= 8;
                    // for (var i = 1; i <= 4; i++) {
                    //     c_dict[i * 100 + Number(k)] -= 2;
                    // }
                }
            }
        }

        for (var k in c_dict) {
            var cd = Number(k);
            // if (c_dict[k] == 3 && diZhaList.indexOf(_.point(k)) < 0) { // 地炸和筒子 优先地炸
            if (c_dict[k] == 3) { // 地炸和筒子 优先地炸
                tongZiList.push(cd);
                // p_dict[_.point(cd)] -= 3;
                // c_dict[cd] -= 3;
            } else if (c_dict[k] == 4) {
                xiList.push(cd);
                // p_dict[_.point(cd)] -= 4;
                // c_dict[cd] -= 4;
            }
        }
        this.formatSort(tongZiList);

        // 牌点按张数 分类
        var pHash = [
            [], // 0张的牌点(wuyong)
            [], // 1张
            [], // 2张
            [], // 3张
            [], // 4张及以上
        ];
        var zhaDanList = [];
        for (var k in p_dict) {
            var count = p_dict[k];
            var point = Number(k);
            if (count > 0 && count <= 3) {
                pHash[count].push(point);
            } else if (count >= 4) {
                zhaDanList.push({count: count, point: point});
            }
        }
        zhaDanList.sort(function(a, b) {
            if (a.count == b.count) {
                return a.point - b.point;
            }

            return a.count - b.count;
        });

        var allZhaMatrix = [
            [], // 炸弹matrix
            [], // 筒子
            [], // 地炸
            [] // 喜
        ];

        for (var i = 0; i < zhaDanList.length; i++) {
            allZhaMatrix[0].push(zhaDanList[i].point); // 牌点
        }

        for (var i = 0; i < tongZiList.length; i++) {
            allZhaMatrix[1].push(tongZiList[i]); // 牌
        }

        for (var i = 0; i < diZhaList.length; i++) {
            allZhaMatrix[2].push(diZhaList[i]); // 牌点
        }

        for (var i = 0; i < xiList.length; i++) {
            allZhaMatrix[3].push(xiList[i]); // 牌
        }
        // console.log("pHash@@ ", pHash);
        // console.log("allZhaMatrix@@ ", allZhaMatrix);

        var cList = []; // 可用牌集合
        var pList = []; // 可用牌点集合
        var idx = 0;
        if (type2 >= CARD_TYPE.zhaDan) {
            idx = type2 + 1 - CARD_TYPE.zhaDan;
        }

        for (var i = idx; i < allZhaMatrix.length; i++) {
            if (i == 0 || i == 2) {
                pList = pList.concat(allZhaMatrix[i]);
            } else {
                cList = cList.concat(allZhaMatrix[i]);
            }
        }

        if (type2 < CARD_TYPE.zhaDan) { // 炸弹以下
            var list = []; // 可取牌点集合
            var value = 0; // 比较值
            var linkNum = 0; // 连对 飞机连牌数

            switch (type2) {
                case CARD_TYPE.danZhang: // 单张
                    list = pHash[1].concat(pHash[2], pHash[3]);
                    value = _.point(cards2[0]);
                    break;
                case CARD_TYPE.duiZi:    // 对子
                    list = pHash[2].concat(pHash[3]);
                    value = _.point(cards2[0]);
                    break;
                case CARD_TYPE.lianDui: // 连对
                    needNum = 2;
                    list = pHash[2].concat(pHash[3]);
                    list.sort(function(a, b) {
                        return a - b;
                    });
                    linkNum = cards2.length / 2;
                    for (var i = 0; i < cards2.length; i++) {
                        value = Math.max(_.point(cards2[i]), value);
                    }
                    break;
                case CARD_TYPE.sanZhang: // 三张
                    needNum = 3;
                    list = pHash[3];
                    value = this.analyzeSanZhang(cards2).body;
                    break;
                case CARD_TYPE.feiJi: // 飞机
                    needNum = 3;
                    list = pHash[3];
                    var body2 = this.analyzeFeiJi(cards2, deckNum, hasWings, bodyLen).body;
                    linkNum = body2.length;
                    value = body2[body2.length - 1];
                    break;
            }

            for (var i = 0; i < list4.length; i++) {
                if (list.indexOf(list4[i]) < 0) {
                    list.push(list4[i]);
                }
            }

            list.sort(function(a, b) {
                return a - b;
            });

            var wingFlag = false; // 是否可以带牌（有三张 飞机）
            if (type2 == CARD_TYPE.danZhang || type2 == CARD_TYPE.duiZi || type2 == CARD_TYPE.sanZhang) {
                for (var i = 0; i < list.length; i++) {
                    if (list[i] > value) {
                        wingFlag = true;
                        pList.push(list[i]);
                    }
                }
            } else { // 连对 飞机
                var nowLinkNum = 1;
                for (var i = 1; i < list.length; i++) {
                    if (list[i] >= 15 && deckNum == 3) {
                        continue;
                    }

                    nowLinkNum = list[i] - list[i - 1] == 1 ? nowLinkNum + 1 : 1;
                    if (nowLinkNum >= linkNum && list[i] > value) {
                        wingFlag = true;
                        for (var j = linkNum - 1; j >= 0; j--) {
                            pList.push(list[i] - j); // 有重复
                        }
                        nowLinkNum -= 1;
                    }
                }
            }

            if ((type2 == CARD_TYPE.sanZhang || type2 == CARD_TYPE.feiJi) && hasWings && wingFlag) {
                return [];
            }
        } else {
            switch (type2) {
                case CARD_TYPE.xi: // 喜
                    for (var i = 0; i < xiList.length; i++) {
                        if (_.point(xiList[i]) >_.point(cards2[0])) {
                            cList.push(xiList[i]);
                        }
                    }
                    break;
                case CARD_TYPE.diZha: // 地炸
                    for (var i = 0; i < diZhaList.length; i++) {
                        if (_.point(diZhaList[i]) >_.point(cards2[0])) {
                            pList.push(_.point(diZhaList[i]));
                        }
                    }
                    break;
                case CARD_TYPE.tongZi: // 筒子
                    for (var i = 0; i < tongZiList.length; i++) {
                        if (_.point(tongZiList[i]) >_.point(cards2[0])) {
                            cList.push(tongZiList[i]);
                        }

                        if (_.point(tongZiList[i]) == _.point(cards2[0]) && tongZiList[i] > cards2[0] && deckNum == 3) {
                            cList.push(tongZiList[i]);
                        }
                    }
                    break;
                case CARD_TYPE.zhaDan: // 炸弹
                    for (var i = 0; i < zhaDanList.length; i++) {
                        if (zhaDanList[i].count == cards2.length && zhaDanList[i].point > _.point(cards2[0])) {
                            pList.push(zhaDanList[i].point);
                        }

                        if (zhaDanList[i].count > cards2.length) {
                            pList.push(zhaDanList[i].point);
                        }
                    }
                    break;
            }
        }

        var disabledList = [];
        for (var i = 0; i < hand.length; i++) {
            if (cList.indexOf(hand[i]) < 0 && pList.indexOf(_.point(hand[i])) < 0) {
                disabledList.push(hand[i]);
            }
        }

        return disabledList;
    }

    // 获取特殊牌型的牌
    BanBianTianZha.prototype.getSpclMatrix = function(hand, deckNum) {
        // 牌统计; 提取喜、地炸、筒子
        var spclMatrix = [];
        return spclMatrix;
        var p_dict = {};
        var c_dict = {};
        for (var i = 0; i < hand.length; i++) {
            var p = _.point(hand[i]);
            p_dict[p] = p_dict[p] ? p_dict[p] + 1 : 1;

            var c = hand[i];
            c_dict[c] = c_dict[c] ? c_dict[c] + 1 : 1;
        }

        var tongZiList = []; // 筒子
        var diZhaList = []; // 地炸
        var xiList = []; // 喜
        for (var k in p_dict) {
            if (p_dict[k] >= 8 && deckNum == 3) {
                if (c_dict[Number(k) + 100] >= 2 && c_dict[Number(k) + 200] >= 2 && c_dict[Number(k) + 300] >= 2 && c_dict[Number(k) + 400] >= 2) {
                    diZhaList.push(Number(k));
                    p_dict[k] -= 8;
                    for (var i = 1; i <= 4; i++) {
                        c_dict[i * 100 + Number(k)] -= 2;
                    }
                }
            }
        }

        for (var k in c_dict) {
            var cd = Number(k);
            if (c_dict[k] == 3 && diZhaList.indexOf(_.point(k)) < 0) { // 地炸和筒子 优先地炸
                tongZiList.push(cd);
                p_dict[_.point(cd)] -= 3;
            } else if (c_dict[k] == 4) {
                xiList.push(cd);
                p_dict[_.point(cd)] -= 4;
            }
        }

        for (var i = 0; i < tongZiList.length; i++) {
            spclMatrix.push([tongZiList[i], tongZiList[i], tongZiList[i]]);
        }

        for (var i = 0; i < diZhaList.length; i++) {
            var tmp = [];
            for (var j = 1; j <= 4; j++) {
                tmp.push(diZhaList[i] + j * 100, diZhaList[i] + j * 100);
            }
            spclMatrix.push(tmp);
        }

        for (var i = 0; i < xiList.length; i++) {
            spclMatrix.push([xiList[i], xiList[i], xiList[i], xiList[i]]);
        }

        return spclMatrix;
    }
    BanBianTianZha.prototype.getBreakDesc = function (hand, cards, hasWings, isSiDaiSan) {
        var desc = "";
        var type = this.getCardType(cards, hasWings, isSiDaiSan);
        if(type == CARD_TYPE.noType){
            return desc;
        }
        var srcHand = hand.slice();
        var srcAllMatrix = this.sortByBomb(srcHand);
        console.log("getBreakDesc 1 : " + JSON.stringify(srcAllMatrix));
        switch(type){
            case CARD_TYPE.zaHuaWuShiK:
                if(srcAllMatrix[5].length > 0){
                    srcAllMatrix[5].splice(0, 1);
                }
                break;
            case CARD_TYPE.tongHuaWuShiK:
                for(var i = 0; i < srcAllMatrix[4].length; i++){
                    var row = srcAllMatrix[4][i];
                    if(_.suit(row[0]) == _.suit(cards[0])){
                        return desc;
                    }
                }
                break;
            case CARD_TYPE.zhaDan:
                for(var i = 0; i < srcAllMatrix[3].length; i++){
                    var row = srcAllMatrix[3][i];
                    if(_.point(row[0]) == _.point(cards[0])){
                        return desc;
                    }
                }
                break;
            case CARD_TYPE.tongHuaShun:
                for(var i = 0; i < srcAllMatrix[2].length; i++){
                    var row = srcAllMatrix[2][i];
                    if(row.length == cards.length && row[row.length - 1] == cards[0]){
                        return desc;
                    }
                }
                break;
            case CARD_TYPE.diZha:
                for(var i = 0; i < srcAllMatrix[1].length; i++){
                    var row = srcAllMatrix[1][i];
                    if(row.length == cards.length && _.point(row[row.length - 1]) == _.point(cards[0])){
                        srcAllMatrix[1].splice(i, 1);
                    }
                }
                break;
            case CARD_TYPE.tianZha:
                return desc;
            default:
                break
        }
        console.log("getBreakDesc 2 : " + JSON.stringify(srcAllMatrix));
        var breakFlag = 0;//1 天炸 2 地炸 4 同花顺 8 炸弹 16 同花510k 32 杂花510k
        var dstHand = hand.slice();
        for(var i = 0; i < cards.length; i++){
            var index = dstHand.indexOf(cards[i]);
            if(index >= 0){
                dstHand.splice(index, 1);
            }
        }
        var dstAllMatrix = this.sortByBomb(dstHand);
        console.log("getBreakDesc 3 : " + JSON.stringify(dstAllMatrix));

        if(srcAllMatrix[0].length > dstAllMatrix[0].length){
            breakFlag = breakFlag | 1;
        }

        if(srcAllMatrix[1].length > dstAllMatrix[1].length){
            breakFlag = breakFlag | 2;
        }else{
            for(var i = 0; i < srcAllMatrix[1].length; i++){
                var srcRow = srcAllMatrix[1][i];
                var j;
                for(j = 0; j < dstAllMatrix[1].length; j++){
                    var dstRow = dstAllMatrix[1][j];
                    if(srcRow.length == dstRow.length && _.point(srcRow[0]) == _.point(dstRow[0])){
                        break;
                    }
                }
                if(j == dstAllMatrix[1].length){
                    breakFlag = breakFlag | 2;
                    break;
                }
            }
        }

        if(srcAllMatrix[2].length > dstAllMatrix[2].length){
            breakFlag = breakFlag | 4;
        }else{
            for(var i = 0; i < srcAllMatrix[2].length; i++){
                var srcRow = srcAllMatrix[2][i];
                var j;
                for(j = 0; j < dstAllMatrix[2].length; j++){
                    var dstRow = dstAllMatrix[2][j];
                    if(srcRow.length == dstRow.length && _.suit(srcRow[0]) == _.suit(dstRow[0]) && _.point(srcRow[0]) == _.point(dstRow[0])){
                        break;
                    }
                }
                if(j == dstAllMatrix[2].length){
                    breakFlag = breakFlag | 4;
                    break;
                }
            }
        }

        if(srcAllMatrix[3].length > dstAllMatrix[3].length){
            breakFlag = breakFlag | 8;
        }else{
            for(var i = 0; i < srcAllMatrix[3].length; i++){
                var srcRow = srcAllMatrix[3][i];
                var j;
                for(j = 0; j < dstAllMatrix[3].length; j++){
                    var dstRow = dstAllMatrix[3][j];
                    if(srcRow.length == dstRow.length && _.point(srcRow[0]) == _.point(dstRow[0])){
                        break;
                    }
                }
                if(j == dstAllMatrix[3].length){
                    breakFlag = breakFlag | 8;
                    break;
                }
            }
        }

        if(srcAllMatrix[4].length > dstAllMatrix[4].length){
            breakFlag = breakFlag | 16;
        }else{
            for(var i = 0; i < srcAllMatrix[4].length; i++){
                var srcRow = srcAllMatrix[4][i];
                var j;
                for(j = 0; j < dstAllMatrix[4].length; j++){
                    var dstRow = dstAllMatrix[4][j];
                    if(_.suit(srcRow[0]) == _.suit(dstRow[0])){
                        break;
                    }
                }
                if(j == dstAllMatrix[4].length){
                    breakFlag = breakFlag | 16;
                    break;
                }
            }
        }

        if(srcAllMatrix[5].length > dstAllMatrix[5].length){
            breakFlag = breakFlag | 32;
        }

        if(breakFlag & 1){
            desc = "天炸";
        }else if(breakFlag & 2){
            desc = "地炸";
        }else if(breakFlag & 4){
            desc = "同花顺";
        }else if(breakFlag & 8){
            desc = "炸弹";
        }else if(breakFlag & 16){
            desc = "正510K";
        }else if(breakFlag & 32){
            desc = "510K";
        }else{
            desc = "";
        }
        return desc;
    }
    // 拆牌提示
    BanBianTianZha.prototype.getBreakUpDesc = function(hand, cards, hasWings) {
        hasWings = true;

        var desc = "";
        var type = this.getCardType(cards, hasWings);
        if (type == CARD_TYPE.noType) {
            return desc;
        }

        // 牌统计; 提取炸弹
        var p_dict = {};
        var c_dict = {};
        for (var i = 0; i < hand.length; i++) {
            var p = _.point(hand[i]);
            p_dict[p] = p_dict[p] ? p_dict[p] + 1 : 1;

            var c = hand[i];
            c_dict[c] = c_dict[c] ? c_dict[c] + 1 : 1;
        }

        var zhaDanList = []; // 炸弹

        var zhaDanList = [];
        for (var k in p_dict) {
            var count = p_dict[k];
            var point = Number(k);
            if (count >= 4) {
                zhaDanList.push({count: count, point: point});
            }
        }
        // console.log("zhaDanList@@ ", zhaDanList);

        var breakUpFlag = 0; // 炸弹
        switch (type) {
            case CARD_TYPE.zhaDan:
                for (var i = 0; i < zhaDanList.length; i++) {
                    if (zhaDanList[i].point == _.point(cards[0]) && zhaDanList[i].count > cards.length) {
                        breakUpFlag  = (breakUpFlag | 1);
                    }
                }
                break;
            case CARD_TYPE.danZhang:
            case CARD_TYPE.duiZi:
            case CARD_TYPE.sanZhang:
            case CARD_TYPE.shunZi:
            case CARD_TYPE.lianDui:
            case CARD_TYPE.feiJi:
            case CARD_TYPE.zaHuaWuShiK:
            case CARD_TYPE.tongHuaWuShiK:
                for (var i = 0; i < cards.length; i++) {
                    var cd = cards[i];
                    for (var j = 0; j < zhaDanList.length; j++) {
                        if (zhaDanList[j].point == _.point(cd)) {
                            breakUpFlag = (breakUpFlag | 1);
                        }
                    }
                }
                break;
        }

        if ((breakUpFlag & 8) > 0) {
            desc = "喜";
        } else if ((breakUpFlag & 4) > 0) {
            desc = "地炸";
        } else if ((breakUpFlag & 2) > 0) {
            desc = "筒子";
        } else if ((breakUpFlag & 1) > 0) {
            desc = "炸弹";
        }

        return desc;
    }

    // 计算牌分
    BanBianTianZha.prototype.getCardScore = function(card) {
        switch (_.point(card)) {
            case 5:
                return 5;
            case 10:
                return 10;
            case 13:
                return 10;
            default:
                return 0;
        }
    }

    // 获取特殊牌型
    BanBianTianZha.prototype.getSpclType = function(cards, deckNum, hasWings) {
        hasWings = true;
        return SPCL_TYPE.noType;

        switch (this.getCardType(cards, deckNum, hasWings)) {
            case CARD_TYPE.tongZi:
                if (deckNum == 3 && _.point(cards[0]) >= 13 && _.point(cards[0]) <= 15) {
                    return _.point(cards[0]) - 12;
                } else if (deckNum == 3 && (cards[0] == SMALL_JOKER || cards[0] == BIG_JOKER)) {
                    return SPCL_TYPE.tongZiJoker;
                }
                break;
            case CARD_TYPE.diZha:
                return SPCL_TYPE.diZha;
            case CARD_TYPE.xi:
                if (cards[0] == SMALL_JOKER) {
                    return SPCL_TYPE.xiSmallJoker;
                } else if (cards[0] == BIG_JOKER) {
                    return SPCL_TYPE.xiBigJoker;
                } else {
                    return SPCL_TYPE.xiOther;
                }
            default:
                break;
        }

        return SPCL_TYPE.noType;
    };

    // 获取特殊牌型加分
    BanBianTianZha.prototype.getSpclTypeScore = function(spclType) {
        return spclType2Score[spclType];
    }

    // 统计剩余牌(记牌器)
    BanBianTianZha.prototype.statsLeftCards = function(sData, mjhand) {
        var tzcards = [
            105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, // 方块5-K A 2
            205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, // 梅花
            305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, // 红桃
            405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415  // 黑桃
        ];

        var areaSelectMode = sData.tData.areaSelectMode;
        if (areaSelectMode.deckNum == 4 || areaSelectMode.haveKingTz) { // 4副牌带王
            tzcards.push(SMALL_JOKER, BIG_JOKER);
        }

        var c_dict = {};
        for (var i = 0; i < tzcards.length; i++) {
            c_dict[tzcards[i]] = areaSelectMode.deckNum;
        }

        for (var i = 0; i < mjhand.length; i++) {
            c_dict[mjhand[i]]--;
        }

        for (var uid in sData.players) {
            var pl = sData.players[uid];
            for (var i = 0; i < pl.mjput.length; i++) {
                for (var j = 0; j < pl.mjput[i].length; j++) {
                    c_dict[pl.mjput[i][j]]--;
                }
            }
        }

        var stats = [];
        for (var k in c_dict) {
            if (c_dict[k] > 0) {
                stats.push({card: Number(k), num: c_dict[k]});
            }
        }

        stats.sort(function(a, b) {
            if (_.point(a.card) == _.point(b.card)) {
                return b.card - a.card;
            };

            return _.point(b.card) - _.point(a.card);
        })

        return stats;
    }

    // 飞机牌拆分（主体 翅膀）
    BanBianTianZha.prototype.splitFeiJi = function(cards, hasWings, bodyLen) {
        hasWings = true;

        var dict = {};
        for (var i = 0; i < cards.length; i++) {
            var p = _.point(cards[i]);
            dict[p] = dict[p] ? dict[p] + 1 : 1;
        }

        var body = []; // 主体
        var wing = []; // 翅膀
        var queue = [];
        for (var p in dict) {
            if (dict[p] >= 3) {
                queue.push(Number(p));
            }
        }

        for (var i = 0; i < queue.length; i++) {
            queue[i] = _.point(queue[i]);
        }

        // 正顺
        queue.sort(function(a, b) {
            return a - b;
        });

        var linkNum = 1;
        var maxLinkNum = 1;
        var maxLinkIdx = -1;
        for (var i = 1; i < queue.length; i++) {
            linkNum = (queue[i] - queue[i - 1] == 1) ? linkNum + 1 : 1;
            if (linkNum > maxLinkNum) {
                maxLinkNum = linkNum;
                maxLinkIdx = i;
            }
        }

        if (maxLinkNum >= (bodyLen || 2)) {
            maxLinkNum = bodyLen || maxLinkNum;
            var list = queue.slice().splice(maxLinkIdx + 1 - maxLinkNum, maxLinkNum);

            var copy = cards.slice();
            for (var i = 0; i < list.length; i++) {
                var num = 0;
                while (num < 3) {
                    for (var j = 1; j <= 4; j++) {
                        var p = list[i];
                        if (p == 1 || p == 2) { // A 2
                            p += 13;
                        }
                        var idx = copy.indexOf(j * 100 + p);
                        if (idx >= 0) {
                            body.push(j * 100 + p);
                            copy.splice(idx, 1);
                            num++;
                            if (num >= 3) {
                                break;
                            }
                        }
                    }

                    // todo 这里没有break 找不到会死循环
                }
            }

            wing = copy;

            if (cards.length <= list.length * 5) {
                return {body: body, wing: wing};
            }
        }
        return {body: [], wing: []};
    }

    // 三张拆分(主体 带的牌)
    BanBianTianZha.prototype.splitSanZhang = function(cards) {
        var dict = {};
        for (var i = 0; i < cards.length; i++) {
            var p = _.point(cards[i]);
            dict[p] = dict[p] ? dict[p] + 1 : 1;
        }

        var body = -1; // 主体
        var wing = []; // 翅膀
        for (var p in dict) {
            if (dict[p] >= 3) {
                body = Number(p);

                cards = cards.slice();
                this.formatSort(cards);
                for (var i = 0; i < cards.length; i++) {
                    if (_.point(cards[i]) == body) {
                        body = cards.splice(i, 3);
                        wing = cards;
                        break;
                    }
                }

                break;
            }
        }

        return {body: body, wing: wing};
    }
    
    BanBianTianZha.prototype.splitSiZhang = function (cards) {
        var c_dict = [];
        for(var i = 0; i < cards.length; i++){
            var point = _.point(cards[i]);
            c_dict[point] = c_dict[point] ? c_dict[point] + 1 : 1;
        }
        var body = -1;
        var wing = [];
        for(var point in c_dict){
            if(c_dict[point] >= 4){
                body = Number(point);
                cards = cards.slice();
                this.formatSort(cards);
                for (var i = 0; i < cards.length; i++) {
                    if (_.point(cards[i]) == body) {
                        body = cards.splice(i, 4);
                        wing = cards;
                        break;
                    }
                }
            }
        }
        return {body: body, wing: wing};
    }

    BanBianTianZha.prototype.formatPutCard = function(cards, type, hasWings, bodyLen) {
        type = type || this.getCardType(cards); // type是0会重算一遍
        var list = [];
        switch (type) {
            case CARD_TYPE.danZhang:
            case CARD_TYPE.danWang:
            case CARD_TYPE.duiZi:
            case CARD_TYPE.zhaDan:
                list = cards.slice();
                break;
            case CARD_TYPE.shunZi:
                var queue = this.analyzeShunZi(cards);
                for (var i = 0; i < queue.length; i++) {
                    if (queue[i] == 1 || queue[i] == 2) {
                        queue[i] += 13;
                    }
                }

                list = cards.slice();
                list.sort(function(a, b) {
                    return queue.indexOf(_.point(a)) - queue.indexOf(_.point(b));
                });
                break;
            case CARD_TYPE.lianDui:
                var queue = this.analyzeLianDui(cards);
                for (var i = 0; i < queue.length; i++) {
                    if (queue[i] == 1 || queue[i] == 2) {
                        queue[i] += 13;
                    }
                }

                list = cards.slice();
                list.sort(function(a, b) {
                    return queue.indexOf(_.point(a)) - queue.indexOf(_.point(b));
                });
                break;
            case CARD_TYPE.zaHuaWuShiK:
            case CARD_TYPE.tongHuaWuShiK:
                list = cards.slice();
                list.sort(function(a, b) {
                    return _.point(a) - _.point(b);
                });
                break;
            default:
                list = cards.slice();
                break;
        }

        return list;
    }

    BanBianTianZha.prototype.checkPut = function(hand, cards) {
        if (cards && typeof(cards) != 'undefined' && cards.length == 0) {
            return null;
        }

        var hands = hand.slice();
        for (var i = 0; i < cards.length; i++) {
            var p = hands.indexOf(cards[i]);
            if (p >= 0) {
                hands.splice(p, 1);
            } else {
                return null; // 手里没有这些牌
            }
        }
        return hands;
    }

    //计算cards中出现炸弹(天炸、地炸、同花顺、炸弹、510k)数超过count个
    BanBianTianZha.prototype.bombCountMoreThan = function(cards, count) {
        if (count == 0){return true;}
        var surplusCount = count - 1;

        var c_dict = {};
        var p_dict = {};
        for (var i = 0; i < cards.length; i++) {
            var c = cards[i];
            c_dict[c] = c_dict[c] ? c_dict[c] + 1 : 1;
            var p = _.point(cards[i]);
            p_dict[p] = p_dict[p] ? p_dict[p] + 1 : 1;
        }

        function removeCards(cards, removeCards){
            cards = cards.slice();
            for (var i = 0; i < removeCards.length; ++i){
                var index = cards.indexOf(removeCards[i]);
                if (index != -1){
                    cards[index] = cards[cards.length - 1];
                    cards.length--;
                }
            }
            return cards;
        }

        // 获取一定张数的特定牌点的牌
        function getCardsByNum(point, needNum) {
            point = Number(point);
            // console.log("getCardsByNum point@@", point, " needNum@@ ", needNum);
            // console.log("c_dict @@", JSON.stringify(c_dict));
            if (point == 2) { // 2实际编码
                point = 15;
            }

            var rtn = [];
            var findNum = 0;
            while (findNum < needNum) {
                for (var suit in SUIT_TYPE) {
                    var cd = SUIT_TYPE[suit] * 100 + point;
                    var num = c_dict[cd];
                    if (num && num > 0) {
                        for (var i = 1; i <= Math.min(num, needNum - findNum); i++) {
                            rtn.push(cd);
                        }
                        findNum += num;
                    }
                }
            }
            return rtn;
        }

        //天炸
        if (cards.indexOf(BIG_JOKER) != -1){
            if (this.bombCountMoreThan(removeCards(cards, [BIG_JOKER]), surplusCount)){
                return true;
            }
            return false;
        }

        //同花顺
        for (var suit in SUIT_TYPE) {
            for (var i = 0; i < SHUN_QUEUE.length - 4; ++i){
                var c1 = SUIT_TYPE[suit] * 100 + SHUN_QUEUE[i];
                var c2 = SUIT_TYPE[suit] * 100 + SHUN_QUEUE[i + 1];
                var c3 = SUIT_TYPE[suit] * 100 + SHUN_QUEUE[i + 2];
                var c4 = SUIT_TYPE[suit] * 100 + SHUN_QUEUE[i + 3];
                var c5 = SUIT_TYPE[suit] * 100 + SHUN_QUEUE[i + 4];
                if (c_dict[c1] && c_dict[c2] && c_dict[c3] && c_dict[c4] && c_dict[c5]){
                    if (this.bombCountMoreThan(removeCards(cards, [c1, c2, c3, c4, c5]), surplusCount)){
                        return true;
                    }
                }
            }
        }

        //炸弹
        for(var i in p_dict){
            if (p_dict[i] >= 4){
                if (this.bombCountMoreThan(removeCards(cards, getCardsByNum(i, 4)), surplusCount)){
                    return true;
                }
            }
        }

        //五十k
        if (p_dict[5] > 0 && p_dict[10] > 0 && p_dict[13] > 0){
            var cds = [];
            cds.push.apply(cds, getCardsByNum(5, 1));
            cds.push.apply(cds, getCardsByNum(10, 1));
            cds.push.apply(cds, getCardsByNum(13, 1));
            if (this.bombCountMoreThan(removeCards(cards, cds), surplusCount)){
                return true;
            }
        }

        //地炸
        for (var i = 0; i < SHUN_QUEUE.length - 3; ++i){
            var p1 = SHUN_QUEUE[i];
            var p2 = SHUN_QUEUE[i + 1];
            var p3 = SHUN_QUEUE[i + 2];
            var p4 = SHUN_QUEUE[i + 3];

            if (p_dict[p1] > 1 && p_dict[p2] > 1 && p_dict[p3] > 1 && p_dict[p4] > 1){
                var cds = [];
                cds.push.apply(cds, getCardsByNum(p1, 2));
                cds.push.apply(cds, getCardsByNum(p2, 2));
                cds.push.apply(cds, getCardsByNum(p3, 2));
                cds.push.apply(cds, getCardsByNum(p4, 2));
                if (this.bombCountMoreThan(removeCards(cards, cds), surplusCount)){
                    return true;
                }
            }
        }
        return false;
    }


    if (typeof(MjClient) != "undefined") {
        MjClient.majiang_BanBianTianZha = new BanBianTianZha();
    } else {
        module.exports = BanBianTianZha;
    }



    function test() {
        var a = new BanBianTianZha();
        // var cards1 = [215, 215, 215, 315, 315, 315, 415, 415, 115, 115, 115];
        /*for(var i = 0; i < 100000; i++){
            var cards1 = [];
            for(var j = 0; j < 17; j++){
                cards1.push(Math.floor(Math.random() * 100) % 13 + 3 + (Math.floor(Math.random() * 100) % 4 + 1) * 100);
            }
            console.log(JSON.stringify(cards1));
            console.log(a.hintPutCard(cards1));
        }*/
        /*for(var i = 0; i < 100000; i++){
            var cards1 = [];
            for(var j = 0; j < 17; j++){
                cards1.push(Math.floor(Math.random() * 100) % 13 + 3 + (Math.floor(Math.random() * 100) % 4 + 1) * 100);
            }
            console.log(JSON.stringify(cards1));
            console.log(a.sortCardsInOrder([305,305,208,112,211,205,215,403,406,207,112,406,104,204,206,405,107]));
        }*/
        //var res = a.hintPutCard([303,304,305,306,307,308,309,310,311,312,313,314,403,404,408,409,414],[203,204,205,206,207,208,209,210,211,212,213,214]);
        //var cards2 = [516];
        //console.log(a.randomCards())
        // console.log(a.getCardType(cards2, true));
        // console.log(a.splitFeiJi(cards1));
        // console.log(a.isBigger(cards2, cards1, null, true, null));
        // console.log(a.canBeat(cards2, cards1, null, true, null));
        // console.log(a.isFeiJi(cards1));
        // console.log(a.getDisabledList(cards2, cards1, null, 4, true, 2));
        // console.log(a.hintPutCard(cards1, null, null, true, 2));
        // console.log(a.getBreakUpDesc(cards1, cards2, true));
        // console.log(a.isBigger(cards2, cards1, null, 3, true, 2));
        // console.log(a.sort2(cards1, 3));
        // console.log(a.splitFeiJi(cards1, 4, true, 4));
        // var cards1 = [112, 113, 213, 413, 113];
        // console.log(a.splitSanZhang(cards1, 3));
        // var cards = [113, 110, 105];
        // console.log(a.fortmatPutCard(cards, null, true, null));
    }
     test();
}());