//斗地主算法类
(function () {
    function DoudizhuLF() {
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
        ruanzha2: 103, // 软炸 3个三
        ruanzha: 102,//软炸弹（对2或者对3）
        big: 100, // 大牌分界线
        shuangliandui: 16,  //双连对
        shunzi2: 15, // 四人斗地主顺子4张牌起
        sidaier2: 14,
        sidaier: 11,
        // feiji2: 10,
        feiji: 9,
        sanshun: 8,
        liandui: 7,
        shunzi: 6,
        sandaier: 5,
        sandaiyi: 4,
        sanzhang: 3,
        duizi: 2,
        danpai: 1,
    };
    DoudizhuLF.prototype.CARDTPYE = CARDTPYE;
    var CARDCOUNT = {};
    CARDCOUNT[CARDTPYE.huojian] = 2;
    CARDCOUNT[CARDTPYE.zhadan] = 4;
    CARDCOUNT[CARDTPYE.ruanzha] = 2;
    CARDCOUNT[CARDTPYE.ruanzha2] = 3;
    CARDCOUNT[CARDTPYE.sidaier] = 6;
    CARDCOUNT[CARDTPYE.sidaier2] = 8;
    CARDCOUNT[CARDTPYE.feiji] = 8;
    CARDCOUNT[CARDTPYE.sanshun] = 6;
    CARDCOUNT[CARDTPYE.liandui] = 6;
    CARDCOUNT[CARDTPYE.shunzi] = 5;
    CARDCOUNT[CARDTPYE.shunzi2] = 4;
    CARDCOUNT[CARDTPYE.sandaier] = 5;
    CARDCOUNT[CARDTPYE.sandaiyi] = 4;
    CARDCOUNT[CARDTPYE.sanzhang] = 3;
    CARDCOUNT[CARDTPYE.duizi] = 2;
    CARDCOUNT[CARDTPYE.danpai] = 1;
    CARDCOUNT[CARDTPYE.shuangliandui] = 4;
    // 随机牌
    // 扑克牌1——54分别为：方片A、梅花A、红心A、黑桃A、方片2……黑桃K、小王、大王
    DoudizhuLF.prototype.randomCards = function () {
        var cards = [];
        for (var i = 1; i <= DAWANG; i++) {
            cards.push(i);
        }
        cards.sort(function (a, b) {
            return .5 - Math.random();
        });
        return cards;
    };

    // 计算真实的点
    DoudizhuLF.prototype.calRealPoint = function (num) {
        if (!num) {
            return -1;
        }
        var ceilNum = Math.ceil(num / 4);

        if (ceilNum > KPOINT) {
            return num; // 大小王原数字返回53、54
        }
        return ceilNum;
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
    DoudizhuLF.prototype.calPoint = calPoint;

    DoudizhuLF.prototype.isShun = function (oCards, tmpCount) { //oCards有序
        if (!oCards) {
            return false;
        }
        var cardCount = oCards.length;
        if (cardCount < tmpCount || calPoint(oCards[oCards.length - 1]) >= ZHUPOINT) {
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

    DoudizhuLF.prototype.isLiandui = function (oCards, tmpCount) { //oCards有序
        if (!oCards) {
            return false;
        }
        var cardCount = oCards.length;
        if (cardCount < tmpCount || cardCount % 2 != 0 || calPoint(oCards[oCards.length - 1]) >= ZHUPOINT) {
            return false; // 非4、6张、有大小王或2不会是顺子
        }
        var cards = [];
        for (var i = 0; i < oCards.length; i++) {
            cards.push(calPoint(oCards[i])); // 只考虑点数
            if (i == 0) continue;
            if (i % 2 == 1) {
                if (cards[i - 1] != cards[i]) {
                    return false;
                }
            } else if (cards[i - 1] != cards[i] - 1) {
                return false;
            }
        }
        return true;
    };

    DoudizhuLF.prototype.isSanshun = function (cards) { //cards有序
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

    DoudizhuLF.prototype.isSidaier = function (oCards) { //cards有序
        if (!oCards) {
            return false;
        }
        var cards = oCards.slice();
        var cardCount = cards.length;
        if (cardCount != CARDCOUNT[CARDTPYE.sidaier]) {
            return false;
        }
        var pointCounts = {};
        for (var i = 0; i < cards.length; i++) {
            increaseByKey(pointCounts, calPoint(cards[i]));
        }

        if (pointCounts[XIAOWANG] == 1 && pointCounts[DAWANG] == 1) { //不能有王炸
            return false;
        }

        var boom = 0;

        for (var p in pointCounts) {
            if (pointCounts[p] == 4) {
                boom += 1;
            }
        }
        if (boom == 1) {
            return true;
        }
        return false;
    };

    DoudizhuLF.prototype.isSidaisi = function (oCards) { //cards有序
        if (!oCards) {
            return false;
        }
        var cards = oCards.slice();
        var cardCount = cards.length;
        if (cardCount != CARDCOUNT[CARDTPYE.sidaier2]) {
            return false;
        }
        var pointCounts = {};
        for (var i = 0; i < cards.length; i++) {
            increaseByKey(pointCounts, calPoint(cards[i]));
        }

        if (pointCounts[XIAOWANG] == 1 && pointCounts[DAWANG] == 1) { //不能有王炸
            return false;
        }

        var boom = 0;

        for (var p in pointCounts) {
            if (pointCounts[p] == 4) {
                boom += 1;
            } else if (pointCounts[p] % 2 != 0) {
                return false;
            }
        }
        if (boom == 1) {
            return true;
        }
        return false;
    };

    DoudizhuLF.prototype.isFeiji = function (oCards) { //cards有序
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
            if (lastPoint == p) {
                continue;
            }
            lastPoint = p;
            if (this.findNSameCard(cards.slice(i), Number(p), 3)) {
                if (p != ZHUPOINT) {
                    kinds.push(p);
                }
                i = i + 2;
            }
        }

        var shunLen = 0;
        var num = 1;
        for (var i = 1; i < kinds.length; i++) {
            if ((kinds[i] - 1) == kinds[i - 1]) {
                num++;
            } else {
                shunLen = shunLen > num ? shunLen : num;
                num = 1;
            }
        }
        shunLen = shunLen > num ? shunLen : num;
        return shunLen >= cardCount / 4;
    };

    // 计算牌型
    DoudizhuLF.prototype.calType = function (cards) {
        var areaSelectMode = MjClient.data.sData.tData.areaSelectMode
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
        var minCount = 4;
        for (var p in pointCounts) {
            if (maxCount < pointCounts[p]) {
                maxCount = pointCounts[p];
            }
            if (minCount > pointCounts[p]) {
                minCount = pointCounts[p];
            }
        }

        if (cardCount == CARDCOUNT[CARDTPYE.zhadan] && allSame) {
            return CARDTPYE.zhadan;
        }
        if (this.isRuanzhadan2(cards, areaSelectMode.zhaDanSanGeSan)) {
            return CARDTPYE.ruanzha2;
        }
        var tmpCount = areaSelectMode.maxPlayer == 4 ? CARDCOUNT[CARDTPYE.shunzi2] : CARDCOUNT[CARDTPYE.shunzi];
        if (cardCount >= tmpCount && maxCount == 1 && this.isShun(cards, tmpCount)) {
            return CARDTPYE.shunzi;
        }
        var bShuangLianDui = areaSelectMode.maxPlayer == 4 && areaSelectMode.shuangliandui;
        var lianduiCount = bShuangLianDui ? CARDCOUNT[CARDTPYE.shuangliandui] : CARDCOUNT[CARDTPYE.liandui];
        if (cardCount >= lianduiCount && maxCount == 2 && this.isLiandui(cards, lianduiCount)) {
            return CARDTPYE.liandui;
        }
        if (cardCount >= CARDCOUNT[CARDTPYE.feiji] && maxCount >= 3 && this.isFeiji(cards)) {
            return CARDTPYE.feiji;
        }
        // 四带二不能带双王
        if (cardCount == CARDCOUNT[CARDTPYE.sidaier] && maxCount == 4 && cards[CARDCOUNT[CARDTPYE.sidaier] - 2] != XIAOWANG) {
            return CARDTPYE.sidaier;
        }
        // 四带两对，不能带双王，不能带四个一样的，必须带两个不一样的对
        if (areaSelectMode["sidaisi"] && cardCount == CARDCOUNT[CARDTPYE.sidaier2] && maxCount == 4 && minCount == 2) {
            return CARDTPYE.sidaier2;
        }
        if (cardCount == CARDCOUNT[CARDTPYE.sandaiyi] && maxCount == 3) {
            return CARDTPYE.sandaiyi;
        }
        if (cardCount == CARDCOUNT[CARDTPYE.sanzhang] && allSame) {
            return CARDTPYE.sanzhang;
        }
        if (cardCount == CARDCOUNT[CARDTPYE.duizi] && allSame) {
            if (this.isRuanzhadan(cards)) {
                return CARDTPYE.ruanzha;
            } else {
                return CARDTPYE.duizi;
            }
        }
        if (cardCount == CARDCOUNT[CARDTPYE.danpai]) {
            return CARDTPYE.danpai;
        }
        return -1;
    };

    // 软炸弹，双2或双3
    DoudizhuLF.prototype.isRuanzhadan = function (oCards) { //oCards有序
        if (!oCards) {
            return false;
        }
        var cards = oCards.slice();
        var cardCount = oCards.length;
        if (cardCount != CARDCOUNT[CARDTPYE.ruanzha]) {
            return false; // 小于2张
        }
        var pointCounts = {};
        for (var i = 0; i < cardCount; i++) {
            increaseByKey(pointCounts, calPoint(cards[i]));
        }
        if (pointCounts[MINPOINT] == 2 || pointCounts[ZHUPOINT] == 2) {
            // 两张2或两张3
            return true;
        }
        return false;
    };

    DoudizhuLF.prototype.isRuanzhadan2 = function (oCards, zhaDanSanGeSan) { //oCards有序
        if (!oCards || !zhaDanSanGeSan) { // 没有勾选3个三
            return false;
        }
        var cards = oCards.slice();
        var cardCount = oCards.length;
        if (cardCount != CARDCOUNT[CARDTPYE.ruanzha2]) {
            return false; // 小于3张
        }
        var pointCounts = {};
        for (var i = 0; i < cardCount; i++) {
            increaseByKey(pointCounts, calPoint(cards[i]));
        }
        return pointCounts[MINPOINT] == 3;
    };

    // 计算牌型点数，一般为较大那张牌，特殊牌型特殊处理
    DoudizhuLF.prototype.calCardsValue = function (cards, type) {
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
        if (type == CARDTPYE.sandaier) {
            return calPoint(cards[2]);
        }
        if (type == CARDTPYE.sandaiyi) {
            return calPoint(cards[1]);
        }
        if (type == CARDTPYE.sidaier) {
            return calPoint(cards[3]);
        }
        if (type == CARDTPYE.sidaier2) {
            for (var i = cards.length - 1; i >= 3; i--) {
                var p = calPoint(cards[i]);
                if (p == calPoint(cards[i - 3])) {
                    return p;
                }
            }
        }
        if (type == CARDTPYE.feiji) {
            for (var i = cards.length - 1; i >= 2; i--) {
                var p = calPoint(cards[i]);
                if (p == calPoint(cards[i - 2]) && p == calPoint(cards[i - 3]) + 1) {
                    return p;
                }
            }
        }
        return calPoint(valueCard);
    };

    // 牌点比较函数
    DoudizhuLF.prototype.cardValueCmp = function (a, b) {
        var pa = calPoint(a);
        var pb = calPoint(b);
        if (pa == pb) {
            return a - b;
        }
        return pa - pb;
    };

    // 牌是否能压上
    DoudizhuLF.prototype.canPut = function (oCards, oLastCards, handLen, areaSelectMode) {
        var cards = oCards.slice();
        cards.sort(this.cardValueCmp);
        var cardsType = this.calType(cards, areaSelectMode);
        if (cardsType == -1) {
            return false;
        }
        if (!oLastCards || typeof oLastCards == 'undefined' || oLastCards.length == 0 || !Array.isArray(oLastCards)) {
            if (cardsType == CARDTPYE.sanzhang && handLen != CARDCOUNT[CARDTPYE.sanzhang]) {
                // 仅最后剩3张牌才能出三张
                return false;
            }
            return true; // 没有上次打的牌，三家过自己再出牌
        }
        var lastCards = oLastCards.slice();
        lastCards.sort(this.cardValueCmp);
        var lastCardsType = this.calType(lastCards, areaSelectMode);
        if (cardsType == lastCardsType && cards.length == lastCards.length) {
            var typeValue = this.calCardsValue(cards, cardsType, areaSelectMode);
            var lastTypeValue = this.calCardsValue(lastCards, lastCardsType, areaSelectMode);
            return typeValue > lastTypeValue;
        } else if (cardsType > CARDTPYE.big && cardsType > lastCardsType) {
            return true;
        }
        return false;
    };

    // 检查是否能出牌
    DoudizhuLF.prototype.checkPut = function (oHands, oCards, lastCards) {
        var hands = oHands.slice();
        var cards = oCards.slice();
        var handLen = hands.length;
        for (var i = 0; i < cards.length; i++) {
            var p = hands.indexOf(cards[i]);
            if (p >= 0) {
                hands.splice(p, 1);
            } else {
                return null; // 手里没有这些牌
            }
        }
        var tData = MjClient.data.sData.tData;
        if (this.canPut(cards, lastCards, handLen, tData.areaSelectMode)) {
            return hands; // 能打得过上家的牌
        }
        return null;
    };

    // 对手牌排序，普通牌型和同花顺优先排序
    DoudizhuLF.prototype.sortHandCards = function (oCards, sortType) {
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
        } else if (sortType == 2) { // 张数排序
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
        cards.sort(function (a, b) {
            return -commonCmp(a, b);
        });
        return cards;
    };

    // 找N张点数一样的牌
    DoudizhuLF.prototype.findNSameCard = function (hands, point, n) {
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
    var filters = [CARDTPYE.duizi, CARDTPYE.sanzhang, CARDTPYE.ruanzha, CARDTPYE.zhadan];
    // var filters = [CARDTPYE.duizi, CARDTPYE.sanzhang, CARDTPYE.shunzi, CARDTPYE.ruanzha, CARDTPYE.zhadan];
    DoudizhuLF.prototype.filterSort = function (hands, cardsArray, type) {
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
                } else {
                    for (var j = cardsArray.length - 1; j >= 0; j--) {
                        var p = calPoint(cardsArray[j][0]);
                        var isLegal = filters[i] == CARDTPYE.ruanzha ? (p == ZHUPOINT || p == 3) : true;
                        if (isLegal && this.findNSameCard(hands, p, CARDCOUNT[filters[i]])) {
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
    DoudizhuLF.prototype.findCardByType = function (hands, type, cardCount) {
        var rets = [];
        if (hands.length < cardCount) {
            return rets;
        }
        if (type == CARDTPYE.huojian) {
            if (hands[hands.length - cardCount] == XIAOWANG) {
                rets.push(hands.slice(-cardCount));
            }
        } else if (type >= CARDTPYE.zhadan) {
            for (var i = MINPOINT; i <= ZHUPOINT; i++) {
                var find = this.findNSameCard(hands, i, cardCount);
                if (find) {
                    rets.push(find);
                }
            }
        } else if (type == CARDTPYE.ruanzha2 && MjClient.data.sData.tData.areaSelectMode.zhaDanSanGeSan) {
            var find = this.findNSameCard(hands, MINPOINT, 3);
            if (find) {
                rets.push(find);
            }
        } else if (type == CARDTPYE.ruanzha) {
            var r = [MINPOINT, ZHUPOINT];
            for (var i = 0; i < r.length; i++) {
                var find = this.findNSameCard(hands, r[i], 2);
                if (find) {
                    rets.push(find);
                }
            }
        } else if (type == CARDTPYE.feiji) {
            var shunCount = cardCount / 4;
            for (var i = MINPOINT; i <= APOINT - shunCount + 1; i++) {
                var ret = [];
                for (var j = 0; j < shunCount; j++) {
                    var temp = this.findNSameCard(hands, i + j, 3);
                    if (temp) {
                        ret = ret.concat(temp);
                    } else {
                        break;
                    }
                }
                if (ret.length == shunCount * 3) {
                    var tmpHands = hands.slice();
                    for (var j = 0; j < hands.length; j++) {
                        if (ret.indexOf(hands[j]) < 0 && ret.length < cardCount) {
                            if (!this.findRuanZhaDan(tmpHands, hands[j])) {
                                tmpHands.splice(tmpHands.indexOf(hands[j]), 1)
                                ret.push(hands[j]);
                            }

                        }
                    }
                    if (ret.length == cardCount) {
                        rets.push(ret);
                    }
                }
            }
        } else if (type == CARDTPYE.liandui) {
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
        } else if (type == CARDTPYE.sidaier) {
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
        } else if (type == CARDTPYE.sandaiyi) {
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
        } else if (type == CARDTPYE.shunzi) {
            for (var i = MINPOINT; i <= APOINT - cardCount + 1; i++) { // 顺子首张
                var shun = [];
                for (var j = 0; j < cardCount; j++) { // 顺子五张牌
                    var p = i + j;
                    if (p > APOINT) {
                        continue;
                    }
                    var find = this.findNSameCard(hands, p, 1);
                    if (find) {
                        shun = shun.concat(find);
                    }
                }
                if (shun.length == cardCount) {
                    rets.push(shun);
                }
            }
        } else if (type == CARDTPYE.duizi) {
            for (var i = MINPOINT + 1; i <= APOINT; i++) {
                var find = this.findNSameCard(hands, i, cardCount);
                if (find) {
                    rets.push(find);
                }
            }
        } else if (type == CARDTPYE.danpai) {
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
    DoudizhuLF.prototype.isCanContainZhadan = function (type) {
        if (type == CARDTPYE.ruanzha || type == CARDTPYE.zhadan || type == CARDTPYE.sidaier || type == CARDTPYE.sidaier2) {
            return true;
        }
        return false;
    };

    // 不拆炸弹
    DoudizhuLF.prototype.dismantleZhadan = function (hands, cardsArray, type) {
        if (this.isCanContainZhadan(type)) {
            return;
        }

        for (var i = cardsArray.length - 1; i > -1; i--) {
            var cards = cardsArray[i];
            var cardType = this.calType(cards);
            if (this.isCanContainZhadan(cardType)) {
                continue
            }
            // 三带一，四带二，顺子，连对，飞机
            for (var j = 0; j < cards.length; j++) {
                if (j > 0 && cards[j] == cards[j - 1]) {
                    continue
                }
                var p = calPoint(cards[j]);
                var find = this.findNSameCard(hands, p, CARDCOUNT[CARDTPYE.zhadan]);
                if (!find) {
                    if (this.findRuanZhaDan(hands, cards[j])) {
                        find = null;
                    }
                }
                if (find) {
                    cardsArray.splice(i, 1);
                    break;
                }

            }
        }
    };

    // 是否刚好凑成软炸
    DoudizhuLF.prototype.findRuanZhaDan = function (hands, cardValue) {
        var p = calPoint(cardValue);
        var find = null;
        if (p == ZHUPOINT || p == 3) {
            find = this.findNSameCard(hands, p, CARDCOUNT[CARDTPYE.ruanzha]);
            if (find && this.findNSameCard(hands, p, 3)) { // 3张2或者3张3，可以出一张来拼凑
                find = null;
            }
        }
        return find != null;
    };

    // 求解提示出牌
    DoudizhuLF.prototype.tipCards = function (oHands, oLastCards) {
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
        var handLen = oHands.length;
        var tData = MjClient.data.sData.tData;
        for (var i = 0; i < sameTypeCards.length; i++) {
            if (this.canPut(sameTypeCards[i], oLastCards, handLen, tData.areaSelectMode)) {
                rets.push(sameTypeCards[i]);
            }
        }
        if (lastCardsType == CARDTPYE.duizi || lastCardsType == CARDTPYE.danpai) {
            this.filterSort(hands, rets, lastCardsType);
        } else {
            this.dismantleZhadan(hands, rets, lastCardsType);
        }
        for (var type = Math.max(CARDTPYE.ruanzha, lastCardsType + 1); type <= CARDTPYE.huojian; type++) {
            var bombCards = this.findCardByType(hands, type, CARDCOUNT[type]);
            rets = rets.concat(bombCards)
        }
        return rets;
    };

    // 求出牌型
    DoudizhuLF.prototype.cardsType = function (oCards) {
        if (oCards) {
            var cards = oCards.slice();
            cards.sort(this.cardValueCmp);
            return this.calType(cards);
        }
        return -1;
    };

    // 检查是否是一次可以出完(炸弹不拆，不拼四带xx)
    DoudizhuLF.prototype.checkPutByOneTimes = function (oHands, areaSelectMode) {
        var cType = this.cardsType(oHands, areaSelectMode);
        if (cType == -1 || cType == CARDTPYE.sidaier || cType == CARDTPYE.sidaier2) {
            return false;
        } else if (cType < CARDTPYE.big && cType != CARDTPYE.duizi && cType != CARDTPYE.danpai && cType != CARDTPYE.shunzi) {
            var cards = oHands.slice();
            cards.sort(this.cardValueCmp);
            var len = cards.length;
            var lastPoint = -1;
            for (var i = 0; i < len; i++) {
                var point = calPoint(cards[i]);
                if (point == lastPoint) {
                    continue;
                }
                var ruanZhaPoint = point == MINPOINT || point == ZHUPOINT;
                if (ruanZhaPoint && calPoint(cards[i + CARDCOUNT[CARDTPYE.ruanzha] - 1]) == point) { // 软炸
                    return false;
                }
                if (calPoint(cards[i + CARDCOUNT[CARDTPYE.zhadan] - 1]) == point) { // 炸弹
                    return false;
                }
                lastPoint = point;
            }
        }
        return true;
    };

    // ==========================[[ 首出提示  ]] ====================================
    // 如果最小的牌是炸弹，返回最小炸弹和第二最小牌，否则仅返回最小牌
    DoudizhuLF.prototype.findMinPointAndMinZhaDanByHands = function (hands, zhaDanSanGeSan) {
        var cards = hands.slice();
        cards.sort(this.cardValueCmp);
        var data = { minPoint: -1, minZhaDan: -1 };
        var len = cards.length;
        for (var i = 0; i < len; i++) {
            var point = calPoint(cards[i]);
            if (i + 3 < len && point == calPoint(cards[i + 3])) {
                data.minZhaDan = data.minZhaDan == -1 ? point : data.minZhaDan;
                i = i + 3;
                continue;
            }

            if (point == MINPOINT && zhaDanSanGeSan && i + 2 < len && point == calPoint(cards[i + 2])) {
                data.minZhaDan = data.minZhaDan == -1 ? point : data.minZhaDan;
                i = i + 2;
                continue;
            }

            if (i + 1 < len) {
                if (cards[i] == XIAOWANG && cards[i + 1] == DAWANG) {
                    data.minZhaDan = data.minZhaDan == -1 ? point : data.minZhaDan;
                    break;
                }
                if ((point == MINPOINT || point == ZHUPAI) && point == calPoint(cards[i + 1])) {
                    data.minZhaDan = data.minZhaDan == -1 ? point : data.minZhaDan;
                    i = i + 1;
                    continue;
                }
            }
            
            data.minPoint = point;
            break;
        }
        return data;
    };

    // 找最小牌的顺子/连对
    DoudizhuLF.prototype.findCardsByMinPointAndType = function (cardsMap, len, minPoint, cType) {
        var count = CARDCOUNT[cType];
        var rate = (cType == CARDTPYE.shunzi || cType == CARDTPYE.shunzi2) ? 1 : 2;
        if (len < count || (minPoint + count / rate - 1) > APOINT) {
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
    DoudizhuLF.prototype.findSanZhangByMinPoint = function (cardsMap, len, minPoint) {
        if (len < CARDCOUNT[CARDTPYE.sandaiyi] || cardsMap[minPoint] == null || cardsMap[minPoint].length < 3) { return null; }
        var cards = [];
        var duiZi = [];
        var danPai = [];
        var status = 0; // 0 : 三连张 1 : 最小有对子 2： 仅带单牌
        for (var i = minPoint; i < ZHUPOINT; i++) {
            if (status == 0) {
                status = (cardsMap[i] != null && cardsMap[i].length >= 3) ? 0 : 1;
            } else if (status == 1 && danPai.length > 0 && duiZi.length == 0) {
                status = 2;
            }
            if (cardsMap[i] == null) { continue; }
            if (status == 0) {
                var tmpCards = cardsMap[i].slice(0, 3);
                cards = cards.concat(tmpCards);
            } else {
                if (status == 1 && cardsMap[i].length > 1 && duiZi.length == 0) {
                    duiZi = cardsMap[i].slice(0, 2);
                }
                var tDan = cardsMap[i].length == 4 ? cardsMap[i].slice(0, 3) : cardsMap[i].slice();
                danPai = danPai.concat(tDan);
            }
        }

        if (cards.length == 0) { return null; }
        var count = cards.length / 3;
        if (duiZi.length / 2 >= count) {
            return cards.concat(duiZi.slice(0, count * 2));
        }
        if (cardsMap[XIAOWANG] != null) {
            danPai.push(XIAOWANG);
        } else if (cardsMap[DAWANG] != null) {
            danPai.push(DAWANG);
        }

        if (danPai.length >= count) {
            return cards.concat(danPai.slice(0, count));
        }
        return cards.length >= CARDCOUNT[CARDTPYE.sanshun] ? cards : null;
    };

    // 找最小牌的对子
    DoudizhuLF.prototype.findDuiZiByMinPoint = function (cardsMap, len, minPoint) {
        var count = CARDCOUNT[CARDTPYE.duizi];
        if (cardsMap[minPoint] != null && cardsMap[minPoint].length >= count) {
            return cardsMap[minPoint].slice(0, count);
        }
        return null;
    };

    DoudizhuLF.prototype.changeCardsToMap = function (hands) {
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
    DoudizhuLF.prototype.getAutoPutCardWithFirstOut = function (hands) {
        // 1. 从小到大出牌
        // 2. 顺子>连对> 飞机 3+N (三张主体越多优先级越高)>对子>单张 (炸弹跳过)
        // 3. 仅有炸弹，炸弹出最小
        var tData = MjClient.data.sData.tData;
        var len = hands.length;
        var minData = this.findMinPointAndMinZhaDanByHands(hands, tData.areaSelectMode.zhaDanSanGeSan);
        if (minData.minPoint == -1) { // 仅有炸弹
            for (var cardType = CARDTPYE.zhadan; cardType >= CARDTPYE.ruanzha; cardType--) {
                var cards = this.findNSameCard(hands, minData.minZhaDan, CARDCOUNT[cardType]);
                return cards != null ? [cards] : [];
            }
        }
        var minPoint = minData.minPoint;
        var cardsList = [];
        var cardsMap = this.changeCardsToMap(hands);
        // 顺子
        var shunZiType = tData.areaSelectMode["maxPlayer"] == 4 ? CARDTPYE.shunzi2 : CARDTPYE.shunzi;
        var shunZi = this.findCardsByMinPointAndType(cardsMap, len, minPoint, shunZiType);
        if (shunZi != null) { cardsList.push(shunZi); }
        // 连对
        var lianDuiType = tData.areaSelectMode.maxPlayer == 4 && tData.areaSelectMode.shuangliandui ? CARDTPYE.shuangliandui : CARDTPYE.liandui;
        var lianDui = this.findCardsByMinPointAndType(cardsMap, len, minPoint, lianDuiType);
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
    DoudizhuLF.prototype.is3ZhangType = function (cType) {
        return cType == CARDTPYE.sanzhang || cType == CARDTPYE.sandaiyi || cType == CARDTPYE.sandaier || cType == CARDTPYE.sanshun || cType == CARDTPYE.feiji;
    }

    // 返回值，牌的下标，value真实的值
    // 例如 红桃8梅花8方块8 出 88, tipCardsArray 仅有 方块8和梅花8，出红桃8梅花8
    DoudizhuLF.prototype.findSelectCardForAutoUp = function (tipCards, selectValue) {
        var idx = tipCards.indexOf(selectValue);
        if (idx > 0 && calPoint(tipCards[idx]) == calPoint(tipCards[0])) {
            return 0;
        }
        if (idx == -1) {
            var point = this.calRealPoint(selectValue);
            var maxValue = point * 4;
            for (var i = 0; i <= 3; i++) {
                if (maxValue - i == selectValue) {
                    continue;
                }
                idx = tipCards.indexOf(maxValue - i);
                if (idx > -1) {
                    break;
                }
            }
        }
        return idx;
    };

    // 更换牌值
    DoudizhuLF.prototype.changeSelectCardForAuto = function (tipCards, idx, selectValue) {
        tipCards[idx] = selectValue;
        return tipCards;
    }

    // 有足够的三张牌组
    DoudizhuLF.prototype.isEnough3SameCards = function (upSelectCards, groupNum) {
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
        return (tmpCards.length / 3) >= groupNum
    };

    // 不足3张的牌组，是否能在手牌找到合法的3张
    DoudizhuLF.prototype.findEnough3SameCard = function (oHands, upSelectCards, groupNum, zhadanMap) {
        var tmpSelect = [];
        var lastPoint = -1;
        for (var i = 0; i < upSelectCards.length; i++) {
            var point = calPoint(upSelectCards[i]);
            if (lastPoint == point) {
                continue;
            }
            lastPoint = point;
            if (zhadanMap[point]) {
                return null;
            }
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
    DoudizhuLF.prototype.findDaiCardsWithSanZhang = function (oHands, upSelectCards, cType, groupNum, zhadanMap) {
        var findNum = cType == CARDTPYE.sandaier ? 2 : 1;
        var pointCounts = {};
        for (var i = 0; i < upSelectCards.length; i++) {
            increaseByKey(pointCounts, calPoint(upSelectCards[i]));
        }
        var num = 0;
        for (var i = 0; i < oHands.length; i++) {
            var point = calPoint(oHands[i]);
            if (zhadanMap[point] != null) {
                continue;
            }
            if (pointCounts[point] != null) {
                if (pointCounts[point] == 3) {
                    continue;
                }
                if (upSelectCards.indexOf(oHands[i]) > -1) {
                    continue;
                }
            }
            if (point == XIAOWANG && i == (oHands.length - 2)) {
                break;
            } // 过滤火箭

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
    DoudizhuLF.prototype.handleAutoByTouchMoveSanZhang = function (upSelectCards, cType, oLastCards, oHands) {
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

    DoudizhuLF.prototype.findTheRightTouchMoveCards = function (upSelectCards, cType, oLastCards) {
        var sameTypeCards = this.findCardByType(upSelectCards, cType, oLastCards.length);
        for (var i = 0; i < sameTypeCards.length; i++) {
            if (this.canPut(sameTypeCards[i], oLastCards)) {
                return sameTypeCards[i];
            }
        }
        return null;
    }

    DoudizhuLF.prototype.findZhadanTouchMoveCards = function (upSelectCards) {
        var tCards = [];
        var lastPoint = -1;
        var zhadanMap = this.getZhaDanMapByCards(upSelectCards);
        if (Object.keys(zhadanMap) <= 0) {
            return null;
        }

        for (var i = 0; i < upSelectCards.length; i++) {
            var point = calPoint(upSelectCards[i]);
            if (lastPoint == point) {
                continue;
            }
            if (zhadanMap[point] != null) {
                var find = this.findNSameCard(upSelectCards, point, CARDCOUNT[CARDTPYE.zhadan]);
                if (find == null && (point == ZHUPOINT || point == MINPOINT)) {
                    find = this.findNSameCard(upSelectCards, point, CARDCOUNT[CARDTPYE.ruanzha]);
                }
                return find;
            }
            lastPoint = point;
        }
        return null;
    }

    // 自动提牌-划牌
    DoudizhuLF.prototype.handleAutoByTouchMove = function (bTouchMove, upSelectCards, cType, tipCardsArray, oLastCards, oHands) {
        //划牌第0步，类型是对子和三张的，判断划的牌是否有炸弹
        var tCards = null;
        if (cType == CARDTPYE.duizi || cType == CARDTPYE.sanzhang || cType == CARDTPYE.sandaiyi || cType == CARDTPYE.sandaier) {
            tCards = this.findZhadanTouchMoveCards(upSelectCards);
            if (tCards != null) {
                return tCards;
            }
        }

        // 划牌第一步：划的牌拥有可以出的牌型，返回第一个可以出的牌组，否则进行第一步
        tCards = this.findTheRightTouchMoveCards(upSelectCards, cType, oLastCards);
        if (tCards != null) {
            return tCards;
        }

        // 划牌第二步：划的牌不满足出牌，氛围两种处理方式
        if (cType == CARDTPYE.shunzi || cType == CARDTPYE.liandui) {
            // 2-1: 顺子、连对，划牌的最小的牌，找到合适的提示
            tCards = this.handleAutoByFirstCard(tipCardsArray, upSelectCards[0], cType);
        } else if (this.is3ZhangType(cType)) {
            // 2-2：三张系列
            tCards = this.handleAutoByTouchMoveSanZhang(upSelectCards, cType, oLastCards, oHands);
        } else if (cType == CARDTPYE.ruanzha || cType == CARDTPYE.zhadan || cType == CARDTPYE.sidaier || cType == CARDTPYE.sidaier2) {
            tCards = this.handleAutoByFirstCard(tipCardsArray, upSelectCards[0], cType);
        }
        if (tCards) {
            return tCards;
        }

        // 第三步，找到划牌种的炸弹
        for (var type = Math.max(CARDTPYE.ruanzha, cType + 1); type <= CARDTPYE.huojian; type++) {
            var bombCards = this.findCardByType(upSelectCards, type, CARDCOUNT[type]);
            if (bombCards.length > 0) {
                return bombCards[0];
            }
        }
        return null;
    };

    // 自动提牌-点牌
    DoudizhuLF.prototype.handleAutoByFirstCard = function (tipCardsArray, upSelectCard, cType) {
        var tipLen = tipCardsArray.length;
        var tmpArr = null;
        for (var i = 0; i < tipLen; i++) {
            var idx = this.findSelectCardForAutoUp(tipCardsArray[i], upSelectCard);
            if (idx == -1) {
                continue;
            }
            if (idx == 0) {
                tmpArr = tipCardsArray[i];
            } else if (tmpArr == null) {
                tmpArr = this.changeSelectCardForAuto(tipCardsArray[i], idx, upSelectCard);
            }
            if (tmpArr != null && (cType == CARDTPYE.sidaier || cType == CARDTPYE.sidaier2)) {
                if (this.calType(tmpArr) == cType) {
                    tmpArr = null;
                    continue;
                }
            }
            if (idx == 0) {
                return tmpArr;
            }
        }
        return tmpArr;
    };

    // 计算斗地主划牌结果
    DoudizhuLF.prototype.calAutoPutCards = function (bTouchMove, tipCardsArray, upSelectCards, oLastCards, oHands) {
        var data = { hasCardToUp: false };
        if (oHands == null) {
            return data;
        }
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

    DoudizhuLF.prototype.getFindCardForFirstPut = function (cards, cType, count) {
        var realCards = null;
        var rateType = {};
        rateType[CARDTPYE.shunzi] = 1;
        rateType[CARDTPYE.feiji] = 4;
        rateType[CARDTPYE.liandui] = 2;

        if (rateType[cType] == null) {
            return realCards;
        }
        if (count % rateType[cType] == 0) {
            var rets = this.findCardByType(cards, cType, count);
            if (rets.length > 0) {
                realCards = rets[0];
            }
        }

        return realCards;
    };

    // 计算斗地主，首出牌划牌的结果(首出提示：顺子 > 飞机 > 连对)
    DoudizhuLF.prototype.calAutoPutCardWithFirstOut = function (upSelectCards, hands, tData) {
        var data = { hasCardToUp: false };
        var minLen = tData.areaSelectMode["maxPlayer"] == 4 ? CARDCOUNT[CARDTPYE.shunzi2] : CARDCOUNT[CARDTPYE.shunzi];
        if (upSelectCards.length < minLen) {
            return data;
        } // 选择的牌不够

        var select = this.calSelectWithoutZhadan(upSelectCards, this.getZhaDanMapByCards(hands));
        var selectLen = select.length;
        var shunZiSelect = null;
        var feiJi2Select = null;
        var feiJiSelect = null;
        var lianDuiSelect = null;
        for (var i = selectLen; i >= minLen; i--) {
            shunZiSelect = this.getFindCardForFirstPut(select, CARDTPYE.shunzi, i);
            if (shunZiSelect != null) {
                break;
            }

            if (feiJiSelect == null && i >= CARDCOUNT[CARDTPYE.feiji]) {
                feiJiSelect = this.getFindCardForFirstPut(select, CARDTPYE.feiji, i);
            }
            if (feiJiSelect != null) {
                continue;
            }

            if (lianDuiSelect != null || i < CARDCOUNT[CARDTPYE.liandui]) {
                continue;
            }
            lianDuiSelect = this.getFindCardForFirstPut(select, CARDTPYE.liandui, i);
        }

        if (shunZiSelect != null) {
            data.tSelectCards = shunZiSelect;
        } else if (feiJi2Select != null) {
            data.tSelectCards = feiJi2Select;
        } else if (feiJiSelect != null) {
            data.tSelectCards = feiJiSelect;
        } else if (lianDuiSelect != null) {
            data.tSelectCards = lianDuiSelect;
        }

        data.hasCardToUp = data.tSelectCards != null;
        return data;
    };

    // 计算选择的牌,排除炸弹
    DoudizhuLF.prototype.calSelectWithoutZhadan = function (upSelectCards, zhadanMap) {
        var cards = upSelectCards.slice();
        cards.sort(this.cardValueCmp);
        var select = [];
        var len = upSelectCards.length;
        for (var i = 0; i < len; i++) {
            var point = calPoint(cards[i]);
            if (zhadanMap[point]) {
                continue;
            }
            select.push(cards[i]);
        }
        return select;
    };

    // 计算牌组的炸弹
    DoudizhuLF.prototype.getZhaDanMapByCards = function (oHands) {
        var hands = oHands.slice();
        hands.sort(this.cardValueCmp);
        var zhadanCardsNum = CARDCOUNT[CARDTPYE.zhadan];
        var ruanzhaCardsNum = CARDCOUNT[CARDTPYE.ruanzha];
        var zhadanMap = {}
        var lastPoint = -1;
        for (var i = 0; i < hands.length; i++) {
            var point = calPoint(hands[i]);
            if (lastPoint == point) {
                continue;
            }
            lastPoint = point;
            if (calPoint(hands[i + zhadanCardsNum - 1]) == point) {
                zhadanMap[point] = 1;
                i = i + zhadanCardsNum - 1;

            } else if (point == MINPOINT && calPoint(hands[i + ruanzhaCardsNum]) == point) {
                i = i + ruanzhaCardsNum; // 3个3，可以用1个3连起顺子
            } else if ((point == ZHUPOINT || point == MINPOINT) && calPoint(hands[i + ruanzhaCardsNum - 1]) == point) {
                // 两个2或两个3组成软炸，不能连起顺子
                zhadanMap[point] = 1;
                i = i + ruanzhaCardsNum - 1;
            }
        }
        return zhadanMap;
    }

    if (typeof (module) != "undefined" && module.exports)
        module.exports = DoudizhuLF;
    if (typeof (MjClient) != "undefined")
        MjClient.doudizhu_linfen = new DoudizhuLF();
})();