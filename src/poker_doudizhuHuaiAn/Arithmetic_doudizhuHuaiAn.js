//斗地主算法类
(function() {
function DoudizhuHuaiAn() {
    this.handCount = 17;
}

var ZHUPAI = 2;
var XIAOWANG = 53;
var DAWANG = 54;
var MINPOINT = 3;
var KPOINT = 13;
var APOINT = 14;
var ZHUPOINT = 15;
var XIAOWANGPOINT = 16;
var DAWANGPOINT = 17;
var CARDTPYE = {
    huojian: 105,
    zhadan: 104,
    big: 100, // 大牌分界线
    sandaier:10,
    sidaier: 9,
    feiji: 8,
    sanshun: 7,
    liandui: 6,
    shunzi: 5,
    sandaiyi: 4,
    sanzhang: 3,
    duizi: 2,
    danpai: 1,
};
DoudizhuHuaiAn.prototype.CARDTPYE = CARDTPYE;
var CARDCOUNT = {};
CARDCOUNT[CARDTPYE.huojian] = 2;
CARDCOUNT[CARDTPYE.zhadan] = 4;
CARDCOUNT[CARDTPYE.sidaier] = 6;
CARDCOUNT[CARDTPYE.feiji] = 8;
CARDCOUNT[CARDTPYE.sanshun] = 6;
CARDCOUNT[CARDTPYE.liandui] = 6;
CARDCOUNT[CARDTPYE.shunzi] = 5;
CARDCOUNT[CARDTPYE.sandaier] = 5;
CARDCOUNT[CARDTPYE.sandaiyi] = 4;
CARDCOUNT[CARDTPYE.sanzhang] = 3;
CARDCOUNT[CARDTPYE.duizi] = 2;
CARDCOUNT[CARDTPYE.danpai] = 1;

// 随机牌
// 扑克牌1——54分别为：方片A、梅花A、红心A、黑桃A、方片2……黑桃K、小王、大王
DoudizhuHuaiAn.prototype.randomCards = function() {
    var cards = [];
    for (var i = 1; i <= DAWANG; i++) {
        cards.push(i);
    }
    shuffleArray(cards);
    return cards;
};

function calPoint(num) {
    if (!num) {
        return -1;
    }
    var ceilNum = Math.ceil(num / 4);
    if (ceilNum == 1) {
        return APOINT; // A记为14
    }
    if (ceilNum == ZHUPAI) {
        return ZHUPOINT; // 主牌记为15
    }
    if (ceilNum > KPOINT) {
        return num; // 大小王原数字返回53、54
    }
    return ceilNum;
};
DoudizhuHuaiAn.prototype.calPoint = calPoint;

DoudizhuHuaiAn.prototype.isShun = function(oCards) { //oCards有序
    if (!oCards) {
        return false;
    }
    var cardCount = oCards.length;
    if (cardCount < CARDCOUNT[CARDTPYE.shunzi] || calPoint(oCards[oCards.length - 1]) >= ZHUPOINT) {
        return false; // 小于5张、有大小王或2不会是顺子
    }
    var cards = [];
    for (var i = 0; i < oCards.length; i++) {
        cards.push(calPoint(oCards[i])); // 只考虑点数
        if (i > 0 && cards[i - 1] != cards[i] - 1) {
            return false;
        }
    }
    return true;
};

DoudizhuHuaiAn.prototype.isLiandui = function(oCards) { //oCards有序
    if (!oCards) {
        return false;
    }
    var cardCount = oCards.length;
    if (cardCount < CARDCOUNT[CARDTPYE.liandui] || cardCount % 2 != 0 || calPoint(oCards[oCards.length - 1]) >= ZHUPOINT) {
        return false; // 非6张、有大小王或2不会是顺子
    }
    var cards = [];
    for (var i = 0; i < oCards.length; i++) {
        cards.push(calPoint(oCards[i])); // 只考虑点数
        if (i == 0) continue;
        if (i % 2 == 1) {
            if (cards[i - 1] != cards[i]) {
                return false;
            }
        }
        else if (cards[i - 1] != cards[i] - 1) {
            return false;
        }
    }
    return true;
};

DoudizhuHuaiAn.prototype.isSanshun = function(cards) { //cards有序
    if (!cards) {
        return false;
    }
    var cardCount = cards.length;
    if (cardCount < CARDCOUNT[CARDTPYE.sanshun] || cardCount % 3 != 0 || calPoint(cards[cards.length - 1]) >= ZHUPOINT) {
        return false; // 非6张、有大小王或2不会是顺子
    }
    var pointCounts = {};
    for (var i = 0; i < cards.length; i++) {
        increaseByKey(pointCounts, calPoint(cards[i]));
    }

    // 补充逻辑
    for (var point in pointCounts) {
        // 每个点数的牌的张数不等于3
        if (pointCounts[point] != 3)
            return false;
    }
    
    var numCount = Object.keys(pointCounts).length;
    return numCount == cardCount / 3 && calPoint(cards[0]) + numCount - 1 == calPoint(cards[cards.length - 1]);
};

DoudizhuHuaiAn.prototype.isFeiji = function(oCards) { //cards有序
    if (!oCards) {
        return false;
    }
    var cards = oCards.slice();
    var cardCount = cards.length;
    if (cardCount < CARDCOUNT[CARDTPYE.sanshun] || cardCount % 4 != 0) {
        return false;
    }

    var kinds = [];
    var lastPoint = -1;
    for (var i = 0; i < cards.length; i++) {
        var p = calPoint(cards[i]);
        if (lastPoint == p) { continue; }
        if (this.findNSameCard(cards.slice(i), Number(p), 3)) {
            kinds.push(p);
            i = i + 2;
        }
    }

    var shunLen = 0;
    var num = 1;
    for (var i = 1; i < kinds.length; i++) {
        if ((kinds[i]-1) == kinds[i-1]) {
            num++;
        } else {
            shunLen = shunLen > num ? shunLen : num;
            num = 1;
        }
    }
    shunLen = shunLen > num ? shunLen : num;

    return shunLen == cardCount / 4;
};

// 计算牌型
DoudizhuHuaiAn.prototype.calType = function(cards) {
    var cardCount = cards.length;
    if (cardCount == CARDCOUNT[CARDTPYE.huojian] && cards[0] == XIAOWANG) {
        return CARDTPYE.huojian;
    }
    var allSame = calPoint(cards[0]) == calPoint(cards[cards.length - 1]);
    var pointCounts = {};
    for (var i = 0; i < cards.length; i++) {
        increaseByKey(pointCounts, calPoint(cards[i]));
    }
    var maxCount = 0; // 最多有几张点数最多的牌
    for (var p in pointCounts) {
        if (maxCount < pointCounts[p]) {
            maxCount = pointCounts[p];
        }
    }
    if (cardCount == CARDCOUNT[CARDTPYE.zhadan] && allSame) {
        return CARDTPYE.zhadan;
    }
    if (cardCount >= CARDCOUNT[CARDTPYE.shunzi] && maxCount == 1 && this.isShun(cards)) {
        return CARDTPYE.shunzi;
    }
    if (cardCount >= CARDCOUNT[CARDTPYE.liandui] && maxCount == 2 && this.isLiandui(cards)) {
        return CARDTPYE.liandui;
    }
    if (cardCount >= CARDCOUNT[CARDTPYE.sanshun] && maxCount == 3 && this.isSanshun(cards)) {
        return CARDTPYE.sanshun;
    }
    if (cardCount >= CARDCOUNT[CARDTPYE.feiji] && maxCount >= 3 && this.isFeiji(cards)) {
        return CARDTPYE.feiji;
    }
    if (cardCount == CARDCOUNT[CARDTPYE.sidaier] && maxCount == 4) {
        return CARDTPYE.sidaier;
    }
    if (cardCount == CARDCOUNT[CARDTPYE.sandaiyi] && maxCount == 3) {
        return CARDTPYE.sandaiyi;
    }
    // 三带二
    if (cardCount == CARDCOUNT[CARDTPYE.sandaier] && maxCount == 3)
    {
        var count = 0
        for(var i in pointCounts) count++;
        if (count == 2) return CARDTPYE.sandaier;
    }
    if (cardCount == CARDCOUNT[CARDTPYE.sanzhang] && allSame) {
        return CARDTPYE.sanzhang;
    }
    if (cardCount == CARDCOUNT[CARDTPYE.duizi] && allSame) {
        return CARDTPYE.duizi;
    }
    if (cardCount == CARDCOUNT[CARDTPYE.danpai]) {
        return CARDTPYE.danpai;
    }
    return -1;
};

// 计算牌型点数，一般为较大那张牌，特殊牌型特殊处理
DoudizhuHuaiAn.prototype.calCardsValue = function(cards, type) {
    if (!cards || cards.length == 0) {
        return -1;
    }
    if (cards.length == 0) {
        return -1;
    }
    if (!type) {
        type = this.calType(cards);
    }
    var valueCard = cards[cards.length - 1];
    if (type == CARDTPYE.sandaiyi) {
        return calPoint(cards[1]);
    }
    if (type == CARDTPYE.sandaier) {
        return this.calPoint(cards[2]);
    }
    if (type == CARDTPYE.sidaier) {
        return calPoint(cards[3]);
    }
    if (type == CARDTPYE.feiji) {
        for (var i = cards.length - 1; i >= 2; i--) {
            var p = calPoint(cards[i]);
            if (p == calPoint(cards[i - 2]) && p == calPoint(cards[i - 3])+1) {
                return p;
            }
        }
    }
    return calPoint(valueCard);
};

// 牌点比较函数
DoudizhuHuaiAn.prototype.cardValueCmp = function(a, b) {
    var pa = calPoint(a);
    var pb = calPoint(b);
    if (pa == pb) {
        return a - b;
    }
    return pa - pb;
};

// 删除相应牌值
DoudizhuHuaiAn.prototype.delPoint = function(hands, points){
    var arr = hands.slice();
    for(var i=0; i < points.length; i++){
        for (var j = 0; j < arr.length; j++) {
            if( this.calPoint(arr[j]) == points[i] ){
                arr.splice(j, 1);
                j--;
            }
        }
    }
    return arr;
}

DoudizhuHuaiAn.prototype.indexOfCards = function(cardList, cards) {
    for(var i = 0; i < cardList.length; i++) {
        var tmpCards = cardList[i];
        if( this.isSameCards(tmpCards, cards) )
            return true;
    }
    return false;
}

DoudizhuHuaiAn.prototype.isSameCards = function(cards1, cards2) {
    if(cards1.length != cards2.length) return false;

    var cds1 = cards1.slice();
    var cds2 = cards2.slice();
    cds1.sort(this.cardValueCmp.bind(this));
    cds2.sort(this.cardValueCmp.bind(this));

    for(var i in cds1){
        if(cds1[i] != cds2[i])
            return false;
    }

    return true;
}

// 牌是否能压上
DoudizhuHuaiAn.prototype.canPut = function(oCards, oLastCards, tData) {
    var cards = oCards.slice();
    cards.sort(this.cardValueCmp);
    var cardsType = this.calType(cards);
    if (cardsType == -1 || cardsType == CARDTPYE.sanzhang) {
        return false; // 不是最后一手三张不可以直接出
    }
    if (!oLastCards) {
        // if (cardsType == CARDTPYE.sidaier && tData && !tData.areaSelectMode["sidaier"]) {
        //     return false;
        // }
        return true; // 没有上次打的牌，三家过自己再出牌
    }
    var lastCards = oLastCards.slice();
    lastCards.sort(this.cardValueCmp);
    var lastCardsType = this.calType(lastCards);
    if (cardsType == lastCardsType && cards.length == lastCards.length) {
        var typeValue = this.calCardsValue(cards, cardsType);
        var lastTypeValue = this.calCardsValue(lastCards, lastCardsType);
        return typeValue > lastTypeValue;
    }
    else if (cardsType > CARDTPYE.big && cardsType > lastCardsType) {
        return true;
    }
    return false;
};

// 检查是否能出牌
DoudizhuHuaiAn.prototype.checkPut = function(oHands, oCards, lastCards, tData) {
    var hands = oHands.slice();
    var cards = oCards.slice();
    for (var i = 0; i < cards.length; i++) {
        var p = hands.indexOf(cards[i]);
        if (p >= 0) {
            hands.splice(p, 1);
        }
        else {
            return null; // 手里没有这些牌
        }
    }
    if (hands.length == 0 && lastCards == null) { // 最后一手三张可以直接出
        cards.sort(this.cardValueCmp);
        if (this.calType(cards) == CARDTPYE.sanzhang) {
            return hands;
        }
    }
    if (this.canPut(cards, lastCards, tData)) {
        return hands; // 能打得过上家的牌
    }
    return null;
};

// 检查是否是一次可以出完(炸弹不拆，不拼四带xx)
DoudizhuHuaiAn.prototype.checkPutByOneTimes = function (oHands) {
    var cType = this.cardsType(oHands);
    if (cType == -1 || cType == CARDTPYE.sidaier){
        return false;
    } else if (cType == CARDTPYE.feiji) {
        // 飞机要检查是否包含炸弹
        var cards = oHands.slice();
        cards.sort(this.cardValueCmp);
        var len = cards.length;
        var lastPoint = -1;
        for (var i = 0; i < len; i++) {
            var point = calPoint(cards[i]);
            if (point == lastPoint) { continue; }
            if (point == DAWANG && lastPoint == XIAOWANG) { return false; } // 王炸不能出
            if (calPoint(cards[i + CARDCOUNT[CARDTPYE.zhadan] - 1]) == point) { // 炸弹
                return false;
            }
            lastPoint = point;
        }
    }
    return true;
};

// 对手牌排序，普通牌型和同花顺优先排序
DoudizhuHuaiAn.prototype.sortHandCards = function(oCards, sortType) {
    var cards = oCards.slice();
    var cmp = this.cardValueCmp;
    var commonCmp = this.cardValueCmp;
    if (sortType == 1) { // 花色排序
        commonCmp = function (a, b) {
            var c1 = (a + 3) % 4;
            var c2 = (b + 3) % 4;
            if (a >= XIAOWANG || b >= XIAOWANG || c1 == c2) {
                return cmp(a, b);
            }
            return c1 - c2;
        }
    }
    else if (sortType == 2) { // 张数排序
        var pointCounts = {};
        for (var i = 0; i < cards.length; i++) {
            increaseByKey(pointCounts, calPoint(cards[i]));
        }
        commonCmp = function (a, b) {
            var c1 = pointCounts[calPoint(a)];
            var c2 = pointCounts[calPoint(b)];
            if (c1 == c2) {
                return cmp(a, b);
            }
            return c1 - c2;
        }
    }
    cards.sort(function(a, b) {
        return -commonCmp(a, b);
    });
    return cards;
};

// 找N张点数一样的牌
DoudizhuHuaiAn.prototype.findNSameCard = function(hands, point, n) { 
    if (point == XIAOWANGPOINT) {
        point = XIAOWANG;
    }
    if (point == DAWANGPOINT) {
        point = DAWANG;
    }
    for (var i = 0; i < hands.length; i++) {
        if (calPoint(hands[i]) == point && calPoint(hands[i + n - 1]) == point) {
            return hands.slice(i, i + n);
        }
    }
    return null;
};

// 提示牌依次暗条件后移
var filters = [CARDTPYE.duizi, CARDTPYE.sanzhang, CARDTPYE.shunzi, CARDTPYE.zhadan];
DoudizhuHuaiAn.prototype.filterSort = function(hands, cardsArray, type) { 
    for (var i = 0; i < filters.length; i++) {
        if (filters[i] > type) {
            var deleteCards = [];
            if (filters[i] == CARDTPYE.shunzi) {
                var shunzis = this.findCardByType(hands, CARDTPYE.shunzi, CARDCOUNT[filters[i]]);
                for (var j = cardsArray.length - 1; j >= 0; j--) {
                    var p = calPoint(cardsArray[j][0]);
                    var find = this.findNSameCard(hands, p, CARDCOUNT[type] + 1);
                    if (find) {
                        continue; // 有同样的多张牌保留
                    }
                    for (var k = 0; k < shunzis.length; k++) {
                        if (calPoint(shunzis[k][4]) >= p && p >= calPoint(shunzis[k][0])) {
                            var ss = cardsArray.splice(j, 1);
                            deleteCards.splice(0, 0, ss[0]);
                            break;
                        }
                    }
                }
            }
            else {
                for (var j = cardsArray.length - 1; j >= 0; j--) {
                    var p = calPoint(cardsArray[j][0]);
                    if (this.findNSameCard(hands, p, CARDCOUNT[filters[i]])) {
                        var ss = cardsArray.splice(j, 1);
                        if (type < CARDTPYE.big && filters[i] > CARDTPYE.big) {
                            // 不是炸弹的，不拆炸弹
                            continue
                        }
                        deleteCards.splice(0, 0, ss[0]);
                    }
                }
            }
            for (var j = 0; j < deleteCards.length; j++) {
                cardsArray.push(deleteCards[j]);
            }
        }
    }
    // 王炸
    if (type == CARDTPYE.danpai && hands.indexOf(XIAOWANG) >= 0 && hands.indexOf(DAWANG) >= 0) {
        for (var j = cardsArray.length - 1; j >= 0; j--) {
            if (cardsArray[j][0] == XIAOWANG) {
                cardsArray.splice(j, 1);
                break;
            }
        }
        for (var j = cardsArray.length - 1; j >= 0; j--) {
            if (cardsArray[j][0] == DAWANG) {
                cardsArray.splice(j, 1);
                break;
            }
        }
    }
};

// 找出type牌型的牌
DoudizhuHuaiAn.prototype.findCardByType = function(hands, type, cardCount) { 
    var rets = [];
    var zhadanMap = this.getZhaDanMapByCards(hands);
    if (hands.length < cardCount) {
        return rets;
    }
    if (type == CARDTPYE.huojian) {
        if (hands[hands.length - cardCount] == XIAOWANG) {
            rets.push(hands.slice(-cardCount));
        }
    }
    else if (type >= CARDTPYE.zhadan || type == CARDTPYE.sanzhang) {
        for (var i = MINPOINT; i <= ZHUPOINT; i++) {
            var find = this.findNSameCard(hands, i, cardCount);
            if (find) {
                rets.push(find);
            }
        }
    }
    else if (type == CARDTPYE.feiji) {
        var shunCount = cardCount / 4;
        for (var i = MINPOINT; i <= APOINT - shunCount + 1; i++) {
            var ret = [];
            for (var j = 0; j < shunCount; j++) {
                var temp = this.findNSameCard(hands, i + j, 3);
                if (temp) {
                    ret = ret.concat(temp);
                }
                else {
                    break;
                }
            }
            if (ret.length == shunCount * 3) {
                for (var j = 0; j < hands.length; j++) {
                    if (zhadanMap[calPoint(hands[j])] == null && ret.indexOf(hands[j]) < 0 && ret.length < cardCount) {
                        ret.push(hands[j]);
                    }
                }
                if (ret.length == cardCount) {
                    rets.push(ret);
                }
            }
        }
    }
    else if (type == CARDTPYE.sanshun) {
        for (var i = MINPOINT; i <= APOINT - cardCount / 3 + 1; i++) {
            var ret = [];
            for (var j = 0; j < cardCount / 3; j++) {
                var temp = this.findNSameCard(hands, i + j, 3);
                if (temp) {
                    ret = ret.concat(temp);
                }
                else {
                    break;
                }
            }
            if (ret.length == cardCount) {
                rets.push(ret);
            }
        }
    }
    else if (type == CARDTPYE.liandui) {
        for (var i = MINPOINT; i <= APOINT - cardCount / 2 + 1; i++) { // 连对首张
            var ldCount = 0;
            var ret = [];
            for (var j = 0; j < cardCount / 2; j++) {
                var p = i + j;
                for (var k = 0; k < hands.length; k++) {
                    if (calPoint(hands[k]) == p) {
                        ldCount++;
                        ret.push(hands[k]);
                        if (calPoint(hands[k + 1]) == p) {
                            ldCount++;
                            ret.push(hands[k + 1]);
                        }
                        break;
                    }
                }
            }
            if (ldCount == cardCount) {
                rets.push(ret);
            }
        }
    }
    else if (type == CARDTPYE.sidaier) {
        for (var i = MINPOINT; i <= ZHUPOINT; i++) {
            var ret = this.findNSameCard(hands, i, 4);
            if (ret) {
                for (var j = 0; j < hands.length; j++) {
                    if (ret.indexOf(hands[j]) < 0 && ret.length < cardCount) {
                        ret.push(hands[j]);
                    }
                }
                if (ret.length == cardCount) {
                    rets.push(ret);
                }
            }
        }
    }
    else if (type == CARDTPYE.sandaiyi) {
        for (var i = MINPOINT; i <= ZHUPOINT; i++) {
            var temp1 = this.findNSameCard(hands, i, 3);
            if (temp1) {
                var cardsArray = [];
                for (var j = MINPOINT; j <= DAWANGPOINT; j++) {
                    if (i != j) {
                        var temp2 = this.findNSameCard(hands, j, 1);
                        if (temp2) {
                            cardsArray.push(temp2);
                        }
                    }
                }
                this.filterSort(hands, cardsArray, CARDTPYE.danpai);
                if (cardsArray.length > 0) {
                    var find = this.findNSameCard(hands, calPoint(cardsArray[0][0]), 1);
                    rets.push(temp1.concat(find));
                }
            }
        }
    }
    else if (type == CARDTPYE.sandaier) {
        for (var i = MINPOINT; i <= ZHUPOINT; i++) 
        {
            var temp1 = this.findNSameCard(hands, i, 3);
            if (!temp1)
                continue;

            var newHands = this.delPoint(hands, [i]);

            for(var j=1; j < newHands.length; j++)
            {
                if (this.calPoint(newHands[j-1]) == this.calPoint(newHands[j]))
                {
                    var ret = temp1.slice();
                    ret.push(newHands[j-1]);
                    ret.push(newHands[j]);
                    if( !this.indexOfCards(rets, ret) ) 
                        rets.push(ret);                            
                }
            }
        }
    }
    else if (type == CARDTPYE.shunzi) {
        for (var i = MINPOINT; i <= APOINT - 4; i++) { // 顺子首张
            var shun = [];
            for (var j = 0; j < cardCount; j++) { // 顺子五张牌
                var p = i + j;
                if (p > APOINT) { continue; }
                var find = this.findNSameCard(hands, p, 1);
                if (find) {
                    shun = shun.concat(find);
                }
            }
            if (shun.length == cardCount) {
                rets.push(shun);
            }
        }
    }
    else if (type == CARDTPYE.duizi) {
        for (var i = MINPOINT; i <= DAWANGPOINT; i++) {
            var find = this.findNSameCard(hands, i, cardCount);
            if (find) {
                rets.push(find);
            }
        }
    }
    else if (type == CARDTPYE.danpai) {
        for (var i = MINPOINT; i <= DAWANGPOINT; i++) {
            var find = this.findNSameCard(hands, i, 1);
            if (find) {
                rets.push(find);
            }
        }
    }
    return rets;
};

// 是否可以包含炸弹
DoudizhuHuaiAn.prototype.isCanContainZhadan = function (type) {
    return type == CARDTPYE.zhadan;
};

// 不拆炸弹
DoudizhuHuaiAn.prototype.dismantleZhadan = function (hands, cardsArray, type) {
    if (this.isCanContainZhadan(type)) {
        return;
    }

    for (var i = cardsArray.length-1; i>-1; i--) {
        var cards = cardsArray[i];
        var cardType = this.calType(cards);
        if (this.isCanContainZhadan(cardType)) {
            continue
        }
        // 三带一，四带二，顺子，连对，飞机
        for (var j=0; j<cards.length; j++) {
            if (j > 0 && cards[j] == cards[j-1]) {
                continue
            }
            var p = calPoint(cards[j]);
            if (this.findNSameCard(hands, p, CARDCOUNT[CARDTPYE.zhadan])) {
                cardsArray.splice(i, 1);
                break;
            }
        }
    }
};

// 求解提示出牌
DoudizhuHuaiAn.prototype.tipCards = function(oHands, oLastCards) {
    var rets = [];
    if (!oHands || !oHands.length) {
        return rets;
    }
    var hands = oHands.slice();
    hands.sort(this.cardValueCmp);
    if (!oLastCards || !oLastCards.length) {
        return this.getAutoPutCardWithFirstOut(hands);
    }
    var lastCards = oLastCards.slice();
    lastCards.sort(this.cardValueCmp);
    var lastCardsType = this.calType(lastCards);
    var sameTypeCards = this.findCardByType(hands, lastCardsType, lastCards.length);
    for (var i = 0; i < sameTypeCards.length; i++) {
        if (this.canPut(sameTypeCards[i], oLastCards)) {
            rets.push(sameTypeCards[i]);
        }
    }
    if (lastCardsType == CARDTPYE.duizi || lastCardsType == CARDTPYE.danpai) {
        this.filterSort(hands, rets, lastCardsType);
    } else {
        this.dismantleZhadan(hands, rets, lastCardsType);
    }
    for (var type = Math.max(CARDTPYE.zhadan, lastCardsType + 1); type <= CARDTPYE.huojian; type++) {
        var bombCards = this.findCardByType(hands, type, CARDCOUNT[type]);
        rets = rets.concat(bombCards)
    }
    return rets;
};

// 求出牌型
DoudizhuHuaiAn.prototype.cardsType = function(oCards) {
    if (oCards) {
        var cards = oCards.slice();
        cards.sort(this.cardValueCmp);
        return this.calType(cards);
    }
    return -1;
};

// 计算真实的点
DoudizhuHuaiAn.prototype.calRealPoint = function(num) {
    if (!num) {
        return -1;
    }
    var ceilNum = Math.ceil(num / 4);

    if (ceilNum > KPOINT) {
        return num; // 大小王原数字返回53、54
    }
    return ceilNum;
};

// ==========================[[ 首出提示  ]] ====================================
// 如果最小的牌是炸弹，返回最小炸弹和第二最小牌，否则仅返回最小牌
DoudizhuHuaiAn.prototype.findMinPointAndMinZhaDanByHands = function (hands) {
    var cards = hands.slice();
    cards.sort(this.cardValueCmp);
    var data = {minPoint:-1, minZhaDan:-1};
    var len = cards.length;
    for (var i = 0; i < len; i++) {
        var point = calPoint(cards[i]);
        if (i+1 < len && cards[i] == XIAOWANG && cards[i+1] == DAWANG) {
            data.minZhaDan = data.minZhaDan == -1 ? point : data.minZhaDan;
            break;
        }
        if (i+3 < len && point == calPoint(cards[i+3])) {
            data.minZhaDan = data.minZhaDan == -1 ? point : data.minZhaDan;
            i = i + 3;
            continue;
        }
  
        data.minPoint = point;
        break;
    }
    return data;
};

// 找最小牌的顺子/连对
DoudizhuHuaiAn.prototype.findCardsByMinPointAndType = function (cardsMap, len, minPoint, cType) {
    var count = CARDCOUNT[cType];
    var rate = cType == CARDTPYE.shunzi ? 1 : 2;
    if (len < count || (minPoint + count/rate - 1) > APOINT) {
        return null;
    }

    var cards = [];
    for (var i = minPoint; i < ZHUPOINT; i++) {
        if (cardsMap[i] == null || cardsMap[i].length < rate) { break; }
        var tmpCards = cardsMap[i].slice(0, rate)
        cards = cards.concat(tmpCards);
    }
    return cards.length >= count ? cards : null;
};

// 找最小牌的三张 3+N (最小的找三张，剩余的最小找对子或单张)
DoudizhuHuaiAn.prototype.findSanZhangByMinPoint = function (cardsMap, len, minPoint) {
    if (len < CARDCOUNT[CARDTPYE.sandaiyi] || cardsMap[minPoint] == null ||  cardsMap[minPoint].length < 3) { return null;}

    var cards = [];
    var danPai = [];
    var status = 0; // 0 : 三连张 1 : 最小有对子 2： 仅带单牌
    for (var i = minPoint; i < ZHUPOINT; i++) {
        if (status == 0) {
            status = (cardsMap[i] != null && cardsMap[i].length >= 3) ? 0 : 1;
        } else {
            status = 2;
        }
        if (cardsMap[i] == null) { continue; }
        if (status == 0) {
            var tmpCards = cardsMap[i].slice(0, 3);
            cards = cards.concat(tmpCards); 
        } else {
            var tDan = cardsMap[i].length == 4 ? cardsMap[i].slice(0, 3) : cardsMap[i].slice();
            danPai = danPai.concat(tDan);
        }
    }

    if (cards.length == 0) { return null; }
    if (cards.length == 3) { return null; }
    var count = cards.length / 3;
    if (cardsMap[XIAOWANG] != null) {
        danPai.push(XIAOWANG);
    } else if (cardsMap[DAWANG] != null) {
        danPai.push(DAWANG);
    }

    if (danPai.length >= count) {
        return cards.concat(danPai.slice(0, count)); 
    }
    return cards;
};

// 找最小牌的对子
DoudizhuHuaiAn.prototype.findDuiZiByMinPoint = function (cardsMap, len, minPoint) {
    var count = CARDCOUNT[CARDTPYE.duizi];
    if (cardsMap[minPoint] != null && cardsMap[minPoint].length >= count) {
        return cardsMap[minPoint].slice(0,count);
    } 
    return null;
};

DoudizhuHuaiAn.prototype.changeCardsToMap = function (hands) {
    var cardsMap = {}
    for (var i = 0; i < hands.length; i++) {
        var p = calPoint(hands[i]);
        if (cardsMap[p] == null) {
            cardsMap[p] = [];
        }
        cardsMap[p].push(hands[i]);
        if (cardsMap[p].length == 4) { delete cardsMap[p]; }
    }
    if (cardsMap[XIAOWANG] != null && cardsMap[DAWANG] != null) {
        delete cardsMap[XIAOWANG];
        delete cardsMap[DAWANG];
    }
    return cardsMap;
};

// 首出逻辑
DoudizhuHuaiAn.prototype.getAutoPutCardWithFirstOut = function(hands) {
    // 1. 从小到大出牌
    // 2. 顺子>连对> 飞机 3+N (三张主体越多优先级越高)>对子>单张 (炸弹跳过)
    // 3. 仅有炸弹，炸弹出最小
    var len = hands.length;
    var minData = this.findMinPointAndMinZhaDanByHands(hands);
    if (minData.minPoint == -1) { // 仅有炸弹
        var cards = this.findNSameCard(hands, minData.minZhaDan, CARDCOUNT[CARDTPYE.zhadan]);
        return cards != null ? [cards] : [];
    }
    var minPoint = minData.minPoint;
    var cardsList = [];
    var cardsMap = this.changeCardsToMap(hands);
    // 顺子
    var shunZi = this.findCardsByMinPointAndType(cardsMap, len, minPoint, CARDTPYE.shunzi);
    if (shunZi != null) { cardsList.push(shunZi); }
    // 连对
    var lianDui = this.findCardsByMinPointAndType(cardsMap, len, minPoint, CARDTPYE.liandui);
    if (lianDui != null) { cardsList.push(lianDui); }
    // 3+N飞机、三顺、三带N
    var sanzhang = this.findSanZhangByMinPoint(cardsMap, len, minPoint);
    if (sanzhang != null) { cardsList.push(sanzhang); }
    // 对子
    var duiZi = this.findDuiZiByMinPoint(cardsMap, len, minPoint);
    if (duiZi != null) { cardsList.push(duiZi); }

    // 单张
    cardsList.push([cardsMap[minPoint][0]]); 
    return cardsList;
};

// ==========================[[ 斗地主提牌 ]] ===================================

// 是否是三张系列
DoudizhuHuaiAn.prototype.is3ZhangType = function(cType) {
    return cType==CARDTPYE.sanzhang || cType==CARDTPYE.sandaiyi || cType==CARDTPYE.sanshun || cType==CARDTPYE.feiji;
}

// 返回值，牌的下标，value真实的值
// 例如 红桃8梅花8方块8 出 88, tipCardsArray 仅有 方块8和梅花8，出红桃8梅花8
DoudizhuHuaiAn.prototype.findSelectCardForAutoUp = function(tipCards, selectValue) {
    var idx = tipCards.indexOf(selectValue);
    if (idx > 0 && calPoint(tipCards[idx]) == calPoint(tipCards[0])) {
        return 0;
    }
    if (idx == -1) {
        var point = this.calRealPoint(selectValue);
        var maxValue = point * 4;
        for (var i = 0; i <= 3; i++) {
            if (maxValue-i == selectValue) {
                continue;
            }
            idx = tipCards.indexOf(maxValue-i);
            if (idx > -1) {
                break;
            }
        }
    }
    return idx;
};

// 更换牌值
DoudizhuHuaiAn.prototype.changeSelectCardForAuto = function(tipCards, idx, selectValue) {
    tipCards[idx] = selectValue;
    return tipCards;
}

// 有足够的三张牌组
DoudizhuHuaiAn.prototype.isEnough3SameCards = function (upSelectCards, groupNum) { 
    var start = false;
    var tmpCards = [];
    for (var i = 0; i < upSelectCards.length; i++) {
        var p = calPoint(upSelectCards[i]);
        var find = this.findNSameCard(upSelectCards, p, 3);
        if (find) {
            start = true;
            tmpCards = tmpCards.concat(find);
        } else if (start) {
            break;
        }
    }
    return (tmpCards.length/3) >= groupNum
};

// 不足3张的牌组，是否能在手牌找到合法的3张
DoudizhuHuaiAn.prototype.findEnough3SameCard = function(oHands, upSelectCards, groupNum, zhadanMap) {
    var tmpSelect = [];
    var lastPoint = -1;
    for (var i = 0; i < upSelectCards.length; i++) {
        var point = calPoint(upSelectCards[i]);
        if (lastPoint == point) { continue; }
        lastPoint = point;
        if (zhadanMap[point]) { return null; }
        var find = this.findNSameCard(oHands, point, 3);
        if (find) {
            tmpSelect = tmpSelect.concat(find);
        } else {
            return null;
        }
    }
    if (tmpSelect.length != groupNum * 3) {
        return null;
    }
    tmpSelect.sort(this.cardValueCmp);
    return tmpSelect;
};

// 找三张配合的牌
DoudizhuHuaiAn.prototype.findDaiCardsWithSanZhang = function(oHands, upSelectCards, cType, groupNum, zhadanMap) {
    var findNum = 1;
    var pointCounts = {};
    for (var i = 0; i < upSelectCards.length; i++) {
        increaseByKey(pointCounts, calPoint(upSelectCards[i]));
    }
    var num = 0;
    for (var i = 0; i < oHands.length; i++) {
        var point = calPoint(oHands[i]);
        if (zhadanMap[point] != null) { continue; }
        if (pointCounts[point] != null) {
            if(pointCounts[point] == 3) { continue; }
            if (upSelectCards.indexOf(oHands[i]) > -1) { continue; }
        }
        if (point == XIAOWANG && i == (oHands.length - 2)) { break; } // 过滤火箭

        var find = this.findNSameCard(oHands.slice(i), point, findNum);
        if (find) {
            upSelectCards = upSelectCards.concat(find);
            num++;
            i = i + findNum - 1;
        }
        if (groupNum == num) {
            break;
        }
    }
    if (groupNum == num) {
        upSelectCards.sort(this.cardValueCmp);
        return upSelectCards;
    } else {
        return null;
    }
};

// 自动提牌-划动-三张系列
DoudizhuHuaiAn.prototype.handleAutoByTouchMoveSanZhang = function(upSelectCards, cType, oLastCards, oHands) {
    var groupNum = 1; 
    if (cType == CARDTPYE.sanshun) {
        groupNum = oLastCards.length / 3;
    } else if (cType == CARDTPYE.feiji) {
        groupNum = oLastCards.length / 4;
    }
    var zhadanMap = this.getZhaDanMapByCards(oHands);
    // 判断主体部分是否足够
    if (!this.isEnough3SameCards(upSelectCards, groupNum)) {
        // 主体部分不足，判断选的牌是否可以和手牌凑够主体
        upSelectCards = this.findEnough3SameCard(oHands, upSelectCards, groupNum, zhadanMap);
        if (upSelectCards == null) {
            return null;
        }
    }
    if (cType != CARDTPYE.sanzhang && cType != CARDTPYE.sanshun) { // 3+N
        // 主体部分足够，找主体配合的牌
        upSelectCards = this.findDaiCardsWithSanZhang(oHands, upSelectCards, cType, groupNum, zhadanMap);
        if (upSelectCards == null) {
            return null;
        }
    }
    // 查找合适的牌组
    return this.findTheRightTouchMoveCards(upSelectCards, cType, oLastCards);
};

DoudizhuHuaiAn.prototype.findTheRightTouchMoveCards = function(upSelectCards, cType, oLastCards) {
    var sameTypeCards = this.findCardByType(upSelectCards, cType, oLastCards.length);
    for (var i = 0; i < sameTypeCards.length; i++) {
        if (this.canPut(sameTypeCards[i], oLastCards)) {
            return sameTypeCards[i];
        }
    }  
    return null;
}

DoudizhuHuaiAn.prototype.findZhadanTouchMoveCards = function(upSelectCards) {
    var tCards = [];
    var lastPoint = -1;
    var zhadanMap = this.getZhaDanMapByCards(upSelectCards);
    if (Object.keys(zhadanMap) <= 0) { return null; }

    for (var i = 0; i < upSelectCards.length; i++) {
        var point = calPoint(upSelectCards[i]);
        if (lastPoint == point) { continue; }
        if (zhadanMap[point] != null) {
            return this.findNSameCard(upSelectCards, point, CARDCOUNT[CARDTPYE.zhadan]);
        } 
        lastPoint = point;
    }
    return null;
}

// 自动提牌-划牌
DoudizhuHuaiAn.prototype.handleAutoByTouchMove = function (bTouchMove, upSelectCards, cType, tipCardsArray, oLastCards, oHands) {
    //划牌第0步，类型是对子和三张的，判断划的牌是否有炸弹
    var tCards = null;
    if (cType == CARDTPYE.duizi || cType == CARDTPYE.sanzhang || cType == CARDTPYE.sandaiyi) {
        tCards = this.findZhadanTouchMoveCards(upSelectCards);
        if (tCards != null) { return tCards; }
    }
    
    // 划牌第一步：划的牌拥有可以出的牌型，返回第一个可以出的牌组，否则进行第一步
    tCards = this.findTheRightTouchMoveCards(upSelectCards, cType, oLastCards);
    if (tCards != null) { return tCards; }

    // 划牌第二步：划的牌不满足出牌，氛围两种处理方式
    if (cType == CARDTPYE.shunzi || cType == CARDTPYE.liandui) {
        // 2-1: 顺子、连对，划牌的最小的牌，找到合适的提示
        tCards = this.handleAutoByFirstCard(tipCardsArray, upSelectCards[0], cType);
    } else if (this.is3ZhangType(cType)) {
        // 2-2：三张系列
        tCards = this.handleAutoByTouchMoveSanZhang(upSelectCards, cType, oLastCards, oHands);
    } else if (cType == CARDTPYE.zhadan || cType == CARDTPYE.sidaier) {
        tCards = this.handleAutoByFirstCard(tipCardsArray, upSelectCards[0], cType);
    }
    if (tCards) {
        return tCards;
    }

    // 第三步，找到划牌种的炸弹
    for (var type = Math.max(CARDTPYE.zhadan, cType + 1); type <= CARDTPYE.huojian; type++) {
        var bombCards = this.findCardByType(upSelectCards, type, CARDCOUNT[type]);
        if (bombCards.length > 0) {
            return bombCards[0];
        }
    }
    return null;
};

// 自动提牌-点牌
DoudizhuHuaiAn.prototype.handleAutoByFirstCard = function(tipCardsArray, upSelectCard, cType) {
    var tipLen = tipCardsArray.length;
    var tmpArr = null;
    for (var i = 0; i < tipLen; i++) {
        var idx = this.findSelectCardForAutoUp(tipCardsArray[i], upSelectCard);
        if (idx == -1) { continue;}
        if (idx == 0) {
            tmpArr = tipCardsArray[i];
        } else if (tmpArr == null) {
            tmpArr = this.changeSelectCardForAuto(tipCardsArray[i], idx, upSelectCard);
        }
        if (tmpArr != null && cType == CARDTPYE.sidaier) {
            if (this.calType(tmpArr) == cType) {
                tmpArr = null;
                continue;
            }
        }
        if (idx == 0) { return tmpArr; }
    }
    return tmpArr;
};

// 计算斗地主划牌结果
DoudizhuHuaiAn.prototype.calAutoPutCards = function (bTouchMove, tipCardsArray, upSelectCards, oLastCards, oHands) {
    var data = {};
    var cType = this.calType(oLastCards);
    upSelectCards.sort(this.cardValueCmp);
    var hands = oHands.slice();
    hands.sort(this.cardValueCmp);
    if (bTouchMove && upSelectCards.length > 1) {
        data.tSelectCards = this.handleAutoByTouchMove(bTouchMove, upSelectCards, cType, tipCardsArray, oLastCards, hands);
    } else if (upSelectCards.length == 1) {
        data.tSelectCards = this.handleAutoByFirstCard(tipCardsArray, upSelectCards[0], cType);
    }
    data.hasCardToUp = data.tSelectCards != null;
    return data;
};

DoudizhuHuaiAn.prototype.getFindCardForFirstPut = function(cards, cType, count) {
    var realCards = null;
    var rateType = {};
    rateType[CARDTPYE.shunzi] = 1; 
    rateType[CARDTPYE.feiji] = 4; 
    rateType[CARDTPYE.liandui] = 2;

    if(count < CARDCOUNT[cType] || rateType[cType]==null) { return realCards; }
    if (count % rateType[cType] == 0) {
        var rets = this.findCardByType(cards, cType, count);
        if (rets.length > 0) {
            realCards = rets[0];
        }
    }

    return realCards;
};

// 计算斗地主，首出牌划牌的结果(首出提示：顺子 > 飞机2 > 飞机 > 连对)
DoudizhuHuaiAn.prototype.calAutoPutCardWithFirstOut = function(upSelectCards, hands) {
    var data = {hasCardToUp:false};
    var minLen = CARDCOUNT[CARDTPYE.shunzi];
    if (upSelectCards.length < minLen) { return data; } // 选择的牌不够

    var select = this.calSelectWithoutZhadan(upSelectCards, this.getZhaDanMapByCards(hands));
    var selectLen = select.length;
    var shunZiSelect = null;
    var feiJi2Select = null;
    var feiJiSelect = null;
    var lianDuiSelect = null;
    for (var i = selectLen; i >= minLen; i--) {
        shunZiSelect = this.getFindCardForFirstPut(select, CARDTPYE.shunzi, i);
        if (shunZiSelect != null) { break; }

        if (feiJiSelect == null) { 
            feiJiSelect = this.getFindCardForFirstPut(select, CARDTPYE.feiji, i);
        }
        if (feiJiSelect != null) { continue; }

        if (lianDuiSelect != null) { continue; }
        lianDuiSelect = this.getFindCardForFirstPut(select, CARDTPYE.liandui, i);
    }

    if (shunZiSelect != null) { 
        data.tSelectCards = shunZiSelect;
    } else if (feiJiSelect != null) { 
        data.tSelectCards = feiJiSelect;
    } else if (lianDuiSelect != null) {
        data.tSelectCards = lianDuiSelect;
    }

    data.hasCardToUp = data.tSelectCards != null;
    return data;
};

// 计算选择的牌,排除炸弹
DoudizhuHuaiAn.prototype.calSelectWithoutZhadan = function(upSelectCards, zhadanMap) {
    var cards = upSelectCards.slice();
    cards.sort(this.cardValueCmp);
    var select = [];
    var len = upSelectCards.length;
    for (var i = 0; i < len; i++) {
        var point = calPoint(cards[i]);
        if (zhadanMap[point]) { continue; }
        select.push(cards[i]);
    }
    return select;
};

// 计算牌组的炸弹
DoudizhuHuaiAn.prototype.getZhaDanMapByCards = function(oHands) {
    var hands = oHands.slice();
    hands.sort(this.cardValueCmp);
    var zhadanCardsNum = CARDCOUNT[CARDTPYE.zhadan];
    var zhadanMap = {}
    var lastPoint = -1;
    for (var i = 0; i < hands.length; i++) {
        var point = calPoint(hands[i]);
        if (lastPoint == point) { continue; }
        if (calPoint(hands[i + zhadanCardsNum - 1]) == point) {
            zhadanMap[point] = 1;
            i = i + zhadanCardsNum - 1;
        } else if (lastPoint == XIAOWANG && point == DAWANG) {
            zhadanMap[XIAOWANG] = 1;
            zhadanMap[DAWANG] = 1;
        }
        lastPoint = point;
    }
    return zhadanMap;
};

if(typeof(module)!="undefined" && module.exports)    
    module.exports = DoudizhuHuaiAn;
if(typeof(MjClient)!="undefined")
    MjClient.doudizhu_HuaiAn = new DoudizhuHuaiAn();
})();