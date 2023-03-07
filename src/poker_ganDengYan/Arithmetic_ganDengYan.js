// 山西干瞪眼
(function () {
    function PokerGanDengYan() { }

    var LAI_ZI_SIGN = 100;
    var WANG_POINT = 17;
    var TWO_POINT = 16; // 2
    var APOINT = 14; // A
    var KPOINT = 13; // K
    var MIN_POINT = 3; // 最小的牌
    var MAX_POINT = TWO_POINT; 
    var XIAO_WANG = 53;
    var DA_WANG = 54;
    var CARDTPYE = {
        zhadan: 110,
        big: 100, // 大牌分界线
        shunzi: 5,
        liandui: 4,
        sanzhang: 3,
        duizi: 2,
        danpai: 1
    };

    PokerGanDengYan.prototype.CARDTPYE = CARDTPYE;

    var CARDCOUNT = {};
    CARDCOUNT[CARDTPYE.zhadan] = 4;
    CARDCOUNT[CARDTPYE.shunzi] = 3;
    CARDCOUNT[CARDTPYE.sanzhang] = 3;
    CARDCOUNT[CARDTPYE.liandui] = 4;
    CARDCOUNT[CARDTPYE.duizi] = 2;
    CARDCOUNT[CARDTPYE.danpai] = 1;

    var print = function(){
        var str = '';
        for (var i=0; i<arguments.length; i++){
            str  = str + arguments[i] + ' ';
        }

        console.log(str);
    }

    PokerGanDengYan.prototype.calPoint = function(num) {
        if (!num) { return -1; }

        num = this.removeLaiziSign(num);

        if (this.isLaizi(num))
            return WANG_POINT;

        var ceilNum = Math.ceil(num / 4);
        if (ceilNum == 2) {
            return TWO_POINT;
        } else if (ceilNum == 1) {
            return APOINT;
        } else {
            return ceilNum;
        }
    };

    PokerGanDengYan.prototype.randomCards = function (areaSelectMode, tData) {
        var cards = [];

        // 全副54张牌
        for (var i = 1; i <= DA_WANG; i++) {
            cards.push(i);
        }

        shuffleArray(cards);

        return cards;
    };

    PokerGanDengYan.prototype.isLaizi = function(card) {
        card = this.removeLaiziSign(card);
        return card == XIAO_WANG || card == DA_WANG;
    };

    /**
     * 判断是否是顺子
     * @param {array} oCards 按点数排好序的牌
     * @return {bool}
     */
    PokerGanDengYan.prototype.isShun = function(oCards) {
        if (!oCards || oCards.length < 3)
            return false;
        
        var cardCount = oCards.length;
        var points = [];
        for (var i = 0; i < oCards.length; i++) {
            points.push(this.calPoint(oCards[i]));
        }

        for (var i = 0; i <= cardCount - 2; i ++) {
            if (points[i] != points[i + 1] - 1)
                return false;
        }

        return true;
    };

    /**
     * 判断是否是连对
     * @param {array} oCards 按点数排好序的牌
     * @return {bool}
     */
    PokerGanDengYan.prototype.isLiandui = function(oCards) { //oCards有序
        var cardNum = CARDCOUNT[CARDTPYE.liandui];// 连对最小牌数

        if (!oCards || oCards.length < cardNum || oCards.length % 2 != 0)
            return false;
        
        var cardCount = oCards.length;
        var points = [];
        for (var i = 0; i < oCards.length; i++) {
            points.push(this.calPoint(oCards[i]));
        }

        for (var i = 0; i < cardCount - 2; i += 2) {
            var abs = Math.abs(points[i] - points[i + 2]);
            if ( abs != 1 || (points[i + 1] != points[i]) ||  (points[i + 2] != points[i + 3]) )  return false;
        }

        return true;
    };

    /** 剔除癞子
     * @param {array} oCards [in] 
     * @param {array} cards [out] 剔除癞子后的按点数据序的牌
     * @return {number} 返回癞子数
     */
    PokerGanDengYan.prototype.transformAndGetLaizi = function(oCards, cards) {
        var laizis = [];
        for (var i = 0; i < oCards.length; i++) {
            if (this.isLaizi(oCards[i]))
                laizis.push(oCards[i]);
            else
                cards.push(oCards[i]);
        }
        cards.sort(this.cardValueCmp.bind(this));
        return laizis;
    };

    /** 
     * 用laizi张癞子去拼出type牌型的牌
     * @param {array} hands 按点数按好序的牌
     * @param {array} laizis 所使用的癞子
     * @param {CARDTPYE} type 要拼出的牌型
     * @param {number} 目的牌张数
     */
    PokerGanDengYan.prototype.findCardByType = function(hands, laizis, type, cardCount, areaSelectMode) {
        var rets = [];
        var laizi = laizis.length;

        var minCardCount = CARDCOUNT[type];

        if ((type == CARDTPYE.duizi || type == CARDTPYE.danpai || type == CARDTPYE.sanzhang) && cardCount != minCardCount)
            return rets;

        if (type == CARDTPYE.zhadan && areaSelectMode.sanZha)
            minCardCount = 3;

        if (laizi > cardCount || laizi + hands.length < cardCount || cardCount < minCardCount) {
            return rets;
        }

        var pushRets = function(rets, cards) {
            if (cards.length != cardCount)
                return;

            for (var i = 0; i < rets.length; i++) {
                var j = 0;
                for (; j < cards.length; j++) {
                    if (rets[i].indexOf(cards[j]) < 0)
                        break;
                }
                if (j == cards.length)
                    return;
            }

            rets.push(cards);
        }

        if (type == CARDTPYE.zhadan || type == CARDTPYE.duizi || type == CARDTPYE.sanzhang) { 
            if (type == CARDTPYE.zhadan && laizi == 2 && cardCount == 2) {
                // 王炸
                pushRets(rets,laizis.slice());
            }
            else {
                for (var i = MIN_POINT; i <= MAX_POINT; i++) {
                    var find = this.findNSameCard(hands, i, cardCount - laizi);

                    if (find) {
                        if (laizi > 0) {
                            var cardsTransfered = [];

                            for (var j = 0; j < laizi; j++) {
                                var realPoint = i;

                                if (realPoint == APOINT)
                                    realPoint = 1;
                                else if (realPoint == TWO_POINT)
                                    realPoint = 2;

                                if (laizis[j] == XIAO_WANG)
                                    cardsTransfered.push(this.addLaiziSign(realPoint * 4));
                                else
                                    cardsTransfered.push(this.addLaiziSign(realPoint * 4 - 1));
                            }

                            pushRets(rets,cardsTransfered.concat(find));
                        } else
                            pushRets(rets,find);
                    }
                }
            }
        }
        else if (type == CARDTPYE.liandui) {
            var findLianDui = function(rets,newHands) {
                for (var i = MIN_POINT; i <= APOINT - cardCount/2 + 1; i++) // 连对首张
                {
                    var ldCount = 0;
                    var ret = [];

                    for (var j = 0; j < cardCount/2; j++) 
                    {
                        var p = i + j;

                        for (var k = 0; k < newHands.length - 1; k++) 
                        {
                            var point1 = this.calPoint(newHands[k]);
                            var point2 = this.calPoint(newHands[k + 1]);

                            if (point1 != p || point2 != p)
                                continue;

                            ldCount += 2;
                            ret.push(newHands[k]);
                            ret.push(newHands[k + 1]);

                            break;
                        }
                    }

                    if (ldCount == cardCount) {
                        pushRets(rets,ret);
                    }
                }
            }.bind(this)
            
            if (laizi > 0) {
                var minPoint = Math.max(this.calPoint(hands[0]) - 1,MIN_POINT);
                var maxPoint = Math.min(this.calPoint(hands[hands.length - 1]) + 1,APOINT);

                if (laizi == 1) {
                    // 一个癞子
                    for (var m = minPoint; m <= maxPoint; m++) {
                        var newHands = hands.slice();
                        var realPoint = m == APOINT ? 1 : m;

                        newHands.push(laizis[0] == XIAO_WANG ? this.addLaiziSign(realPoint * 4) : this.addLaiziSign(realPoint * 4 - 1));
                        newHands.sort(this.cardValueCmp.bind(this));
                        findLianDui(rets,newHands);
                    }
                } else {
                    // 两个癞子
                    for (var m = minPoint; m <= maxPoint; m++) {
                        for (var n = minPoint; n <= maxPoint; n++) {
                            var newHands = hands.slice();

                            newHands.push(this.addLaiziSign((m == APOINT ? 1 : m) * 4));
                            newHands.push(this.addLaiziSign((n == APOINT ? 1 : n) * 4 - 1));

                            newHands.sort(this.cardValueCmp.bind(this));
                            findLianDui(rets,newHands);
                        }
                    }
                }
            } else
                findLianDui(rets,hands);
        }
        else if (type == CARDTPYE.shunzi) {
            var findShunZi = function(rets,newHands) {
                for (var i = MIN_POINT; i <= APOINT - cardCount + 1; i++) { // 顺子首张
                    var shun = [];

                    for (var j = 0; j < cardCount; j++) {
                        var p = i + j;
                        var find = this.findNSameCard(newHands, p, 1);

                        if ((p-1) == KPOINT)  // 如果上张牌是K ,需要考虑计算A
                            find = this.findNSameCard(newHands, APOINT, 1);

                        if (find)
                            shun = shun.concat(find);
                    }

                    if (shun.length == cardCount)
                        pushRets(rets,shun);
                }
            }.bind(this);
            
            if (laizi > 0) {
                var minPoint = Math.max(this.calPoint(hands[0]) - laizi,MIN_POINT);
                var maxPoint = Math.min(this.calPoint(hands[hands.length - 1]) + laizi,APOINT);

                if (laizi == 1) {
                    // 一个癞子
                    for (var m = minPoint; m <= maxPoint; m++) {
                        var newHands = hands.slice();
                        var realPoint = m == APOINT ? 1 : m;

                        newHands.push(laizis[0] == XIAO_WANG ? this.addLaiziSign(realPoint * 4) : this.addLaiziSign(realPoint * 4 - 1));
                        newHands.sort(this.cardValueCmp.bind(this));
                        findShunZi(rets,newHands);
                    }
                } else {
                    // 两个癞子
                    for (var m = minPoint; m <= maxPoint; m++) {
                        for (var n = minPoint; n < maxPoint; n++) {
                            var newHands = hands.slice();

                            newHands.push(this.addLaiziSign((m == APOINT ? 1 : m) * 4));
                            newHands.push(this.addLaiziSign(n * 4 - 1));

                            newHands.sort(this.cardValueCmp.bind(this));
                            findShunZi(rets,newHands);
                        }
                    }
                }
            } else
                findShunZi(rets,hands);
        }
        else if (type == CARDTPYE.danpai) {
            // 单牌不能包含癞子（即大小王不能单出）
            if (laizi < 1) {
                for (var i = MIN_POINT; i <= MAX_POINT; i++) 
                {
                    for (var j = 0; j < hands.length; j++) {
                        if (this.calPoint(hands[j]) == i) {
                            pushRets(rets,[hands[j]]);
                            break;
                        }
                    }
                }
            }
        }

        return rets;
    };

    PokerGanDengYan.prototype.calType = function (oCards,areaSelectMode) {
        if (!oCards) {
            return -1;
        }

        var cards = oCards.slice();
        cards.sort(this.cardValueCmp.bind(this));

        var cardCount = cards.length;
        var allSame = this.calPoint(cards[0]) == this.calPoint(cards[cards.length - 1]);

        var pointCounts = {};
        for (var i = 0; i < cards.length; i++) {
            var p = this.calPoint(cards[i]);
            if (pointCounts[p]) {
                pointCounts[p]++;
            }
            else {
                pointCounts[p] = 1;
            }
        }
        var maxCount = 0; // 最多有几张点数最多的牌
        for (var p in pointCounts) {
            if (maxCount < pointCounts[p]) {
                maxCount = pointCounts[p];
            }
        }

        // 顺子
        if (cardCount >= CARDCOUNT[CARDTPYE.shunzi] && maxCount == 1 && this.isShun(cards))
            return CARDTPYE.shunzi;

        // 连对
        if (cardCount >= CARDCOUNT[CARDTPYE.liandui] && maxCount == 2 && this.isLiandui(cards))
            return CARDTPYE.liandui;

        // 炸弹
        var minLength = CARDCOUNT[CARDTPYE.zhadan];
        
        if (areaSelectMode.sanZha) {
            // 三炸
            minLength = 3;
        }
        if (cardCount >= minLength && allSame)
            return CARDTPYE.zhadan;

        // 王炸
        if (cardCount == 2 && this.isLaizi(cards[0]) && this.isLaizi(cards[1]))
            return CARDTPYE.zhadan;

        // 三张
        if (cardCount == 3 && allSame)
            return CARDTPYE.sanzhang;

        // 对子
        if (cardCount == 2 && allSame)
            return CARDTPYE.duizi;

        // 单牌
        if (cardCount == 1)
            return CARDTPYE.danpai;

        return -1;
    };

    PokerGanDengYan.prototype.cardsType = function(oCards, areaSelectMode) {
        return this.calType(oCards, areaSelectMode);
    }

    // 计算牌型点数
    PokerGanDengYan.prototype.calCardsValue = function (oCards, areaSelectMode) {
        if (!oCards || oCards.length == 0) {
            return -1;
        }

        return this.calPoint(oCards[oCards.length - 1]);
    };

    // 牌点比较函数
    PokerGanDengYan.prototype.cardValueCmp = function (a, b) {
        var pa = this.calPoint(a);
        var pb = this.calPoint(b);
        if (pa == pb) {
            return this.removeLaiziSign(a) - this.removeLaiziSign(b);
        }
        return pa - pb;
    };

    // 牌是否能压上
    PokerGanDengYan.prototype.canPut = function (oCards, oLastCards, areaSelectMode) {
        var cards = oCards.slice();

        cards.sort(this.cardValueCmp.bind(this));
        var cType = this.calType(cards, areaSelectMode);

        if (cType == -1) {
            return false;
        }

        if (!oLastCards || oLastCards == -1) {
            return true; // 没有上次打的牌，三家过自己再出牌
        }
        
        if ((cType == CARDTPYE.shunzi || cType == CARDTPYE.liandui) && oCards.length != oLastCards.length)
            return false;

        var lastCards = oLastCards.slice();
        lastCards.sort(this.cardValueCmp.bind(this));
        var lastCType = this.calType(lastCards, areaSelectMode);
        if (cType == lastCType) {
            if (cards.length == lastCards.length) {
                if (cType == CARDTPYE.zhadan || 
                    (cType == CARDTPYE.danpai || cType == CARDTPYE.duizi || cType == CARDTPYE.sanzhang) && this.calCardsValue(cards, areaSelectMode) == MAX_POINT)
                    return this.calCardsValue(cards, areaSelectMode) > this.calCardsValue(lastCards, areaSelectMode);
                else
                    return this.calCardsValue(cards, areaSelectMode) - this.calCardsValue(lastCards, areaSelectMode) == 1;
            } else if (cType == CARDTPYE.zhadan) { // 炸弹张数多的较大
                if (cards.length == 2) 
                    return lastCards.length <= 4;
                else if (lastCards.length == 2)
                    return cards.length > 4;
                else
                    return cards.length > lastCards.length;
            }
        } else if (cType > CARDTPYE.big && cType > lastCType) {
            return true;
        }

        return false;
    };

    // 检查是否能出牌
    PokerGanDengYan.prototype.checkPut = function (oHands, oCards, lastPutCard, areaSelectMode) {
        if (oCards && typeof(oCards)!='undefined' && oCards.length == 0) return null;

        var hands = oHands.slice();
        for (var i = 0; i < oCards.length; i++) {
            var p = hands.indexOf(oCards[i]);

            if (p >= 0) {
                hands.splice(p, 1);
            }
            else {
                p = hands.indexOf(this.getRealLaizi(oCards[i]));

                if (p >= 0) {
                    // 癞子
                    hands.splice(p, 1);
                }
                else
                    return null; // 手里没有这些牌
            }
        }

        if (this.canPut(oCards, lastPutCard, areaSelectMode)) {
            return hands; // 能打得过上家的牌
        }

        return null;
    };

    // 找N张点数一样的牌
    PokerGanDengYan.prototype.findNSameCard = function (hands, point, n) {
        for (var i = 0; i < hands.length; i++) {
            if (this.calPoint(hands[i]) == point && this.calPoint(hands[i + n - 1]) == point) {
                return hands.slice(i, i + n);
            }
        }
        return null;
    };

    /**
     * 对手牌排序
     * @param {array} 
     * @param {number} sortType 1 = 花色排序, 2 = 张数排序, 0 ==普通牌型
     */
    PokerGanDengYan.prototype.sortHandCards = function(oCards, sortType) {
        var cards = oCards.slice();
        var commonCmp = this.cardValueCmp.bind(this);
        var cardValueCmp = this.cardValueCmp.bind(this);
        if (sortType == 1) { // 花色排序
            commonCmp = function (a, b) {
                var c1 = (a + 3) % 4;
                var c2 = (b + 3) % 4;
                if (c1 == c2)
                    return cardValueCmp(a, b);
                else
                    return c1 - c2;
            }.bind(this);
        }
        else if (sortType == 2) { // 张数排序
            var pointCounts = {};
            for (var i = 0; i < cards.length; i++) {
                var p = this.calPoint(cards[i]);
                if (pointCounts[p])
                    pointCounts[p] ++;
                else
                    pointCounts[p] = 1;
            }

            commonCmp = function (a, b) {
                var c1 = pointCounts[this.calPoint(a)];
                var c2 = pointCounts[this.calPoint(b)];
                if (c1 == c2)
                    return cardValueCmp(a, b);
                else
                    return c1 - c2;
            }.bind(this);
        }

        cards.sort(function(a, b) {
            return -commonCmp(a, b);
        });
        return cards;
    };

    PokerGanDengYan.prototype.tipCards = function(oHands, oLastCards, areaSelectMode) {
        if (!oHands || oHands.length <= 0 || !oLastCards || oLastCards.length <= 0)
            return [];

        var hands = [];
        var handLaizis = this.transformAndGetLaizi(oHands, hands);
        var lastCardsType = this.calType(oLastCards, areaSelectMode);
        var rets = [];
        var tempRets = [];

        // 1、不带癞子，大1点的相同牌型
        // 2、不带癞子的2、22、222（只针对单牌、对子和三张）。

        if (lastCardsType != CARDTPYE.zhadan) {
            tempRets = this.findCardByType(hands, [], lastCardsType, oLastCards.length, areaSelectMode);

            for (var i = 0; i < tempRets.length; i++) {
                if (this.canPut(tempRets[i], oLastCards, areaSelectMode)) {
                    rets.push(tempRets[i]);
                }
            }
        } 

        // 不带癞子的炸弹
        if (lastCardsType != CARDTPYE.zhadan || oLastCards.length != 2 && oLastCards.length <= 4) {
            var zhaDanCardNums = [3,4];

            // 不支持三炸或被压牌直接四炸起步，则三炸不用找了
            if (!areaSelectMode.sanZha || lastCardsType == CARDTPYE.zhadan && oLastCards.length > 3)
                zhaDanCardNums.splice(0,1);

            for (var j = 0; j < zhaDanCardNums.length; j++) {
                tempRets = this.findCardByType(hands, [], CARDTPYE.zhadan, zhaDanCardNums[j], areaSelectMode);

                if (tempRets.length > 0) {
                    for (var i = 0; i < tempRets.length; i++) {
                        if (this.canPut(tempRets[i], oLastCards, areaSelectMode)) {
                            rets.push(tempRets[i]);
                        }
                    }
                } else {
                    // 短的炸弹没有找到，更长的不必找了
                    break;
                }
            }
        }

        // if (rets.length > 0)
        //     return rets;

        if (handLaizis.length == 0) {
            // 没有癞子，查个毛
            return rets;
        }

        // 3、带1个癞子的相同牌型。，按照癞子所代替的牌，点数从大到小的顺序提示。

        // 带一个癞子的相同牌型（非炸弹）
        if (lastCardsType != CARDTPYE.zhadan) {
            tempRets = this.findCardByType(hands, [handLaizis[0]], lastCardsType, oLastCards.length, areaSelectMode);

            if (tempRets.length > 1) {
                // 有癞子情况下，需要去重
                this.removeSameResults(tempRets);
            }

            for (var i = 0; i < tempRets.length;) {
                if (this.canPut(tempRets[i], oLastCards, areaSelectMode))
                    i++;
                else
                    tempRets.splice(i,1);
            }

            if (tempRets.length > 1) {
                // 按照癞子所代替的牌，点数从大到小排序
                this.sortRetsByLaiziReplacement(tempRets);
            }

            rets = rets.concat(tempRets);
        }

        // 4、带1个癞子的炸弹，根据炸弹大小，从小到大顺序提示。
        var zhaDanCardNums = [3,4,5];

        if (!areaSelectMode.sanZha || lastCardsType == CARDTPYE.zhadan && oLastCards.length > 3)
        {
            // 不支持三炸或被压牌直接四炸起步，则三炸不用找了
            zhaDanCardNums.splice(0,1);
        }

        for (var j = 0; j < zhaDanCardNums.length; j++) {
            tempRets = this.findCardByType(hands, [handLaizis[0]], CARDTPYE.zhadan, zhaDanCardNums[j], areaSelectMode);

            if (tempRets.length > 0) {
                for (var i = 0; i < tempRets.length; i++) {
                    if (this.canPut(tempRets[i], oLastCards, areaSelectMode)) {
                        rets.push(tempRets[i]);
                    }
                }
            } else {
                // 短的炸弹没有找到，更长的不必找了
                break;
            }
        }

        if (handLaizis.length == 1) {
            // 只有一个癞子，不用找了
            return rets;
        }

        // 5、带两个癞子的相同牌型，只提示癞子代替的牌，点数最大的情况。例如上家出456、己方手里有5、7和两个癞子。
        //    在提示两个癞子的情况下，会提示（5+癞子+癞子），因为癞子做6、7是最大的

        if (lastCardsType != CARDTPYE.zhadan) {
            tempRets = this.findCardByType(hands, handLaizis, lastCardsType, oLastCards.length, areaSelectMode);

            if (tempRets.length > 1) {
                // 有癞子情况下，可能存在癞子花色不同而导致的重复，需要去重
                this.removeSameResults(tempRets);
            }

            for (var i = 0; i < tempRets.length;) {
                if (this.canPut(tempRets[i], oLastCards, areaSelectMode))
                    i++;
                else
                    tempRets.splice(i,1);
            }

            if (tempRets.length > 1) {
                // 按照癞子所代替的牌，点数从大到小排序
                this.sortRetsByLaiziReplacement(tempRets);
            }
            if (tempRets[0]) {
                // 只挑提示癞子代替的牌，点数最大的情况
                rets.push(tempRets[0]);
            }
        }

        // 6、带两个癞子的炸弹，根据炸弹大小，从小到大的顺序提示（王炸算在此条内）
        var zhaDanCardNums = [3,4,2,5,6];

        if (!areaSelectMode.sanZha || lastCardsType == CARDTPYE.zhadan && oLastCards.length > 3) {
            // 不支持三炸或被压牌直接四炸起步，则三炸不用找了
            zhaDanCardNums.splice(1,1);
        }

        for (var j = 0; j < zhaDanCardNums.length; j++) {
            tempRets = this.findCardByType(hands, handLaizis, CARDTPYE.zhadan, zhaDanCardNums[j], areaSelectMode);

            if (tempRets.length > 1) {
                // 有癞子情况下，可能存在癞子花色不同而导致的重复，需要去重
                this.removeSameResults(tempRets);
            }

            for (var i = 0; i < tempRets.length; i++) {
                if (this.canPut(tempRets[i], oLastCards, areaSelectMode)) {
                    rets.push(tempRets[i]);
                }
            }
        }

        return rets;
    };

    /**
     * 按照癞子所代替的牌，点数从大到小排序
     * @param {array} rets 所有结果合集
     * @param {array} oHands 手牌
     */
    PokerGanDengYan.prototype.sortRetsByLaiziReplacement = function(rets) {
        var commonCmp = function (ret_1, ret_2) {
            var laiziCards_1 = this.getLaiziCardsFromRet(ret_1);
            var laiziCards_2 = this.getLaiziCardsFromRet(ret_2);

            if (!laiziCards_1[1])
                laiziCards_1.push(0);

            if (!laiziCards_2[1])
                laiziCards_2.push(0);

            var maxPoint_1 = Math.max(this.calPoint(laiziCards_1[0]),this.calPoint(laiziCards_1[1]));
            var maxPoint_2 = Math.max(this.calPoint(laiziCards_2[0]),this.calPoint(laiziCards_2[1]));

            if (maxPoint_1 != maxPoint_2) {
                // 较大代替牌相比较，大的排前边
                return maxPoint_2 - maxPoint_1;
            } else {
                // 较大代替牌相等，较小代替牌大的排前边
                return Math.min(this.calPoint(laiziCards_2[0]),this.calPoint(laiziCards_2[1])) - Math.min(this.calPoint(laiziCards_1[0]),this.calPoint(laiziCards_1[1]));
            }
        };
       
        rets.sort(commonCmp.bind(this));
    };

    /**
     * 从一组提示中找到由癞子代替的牌
     * @param {array} ret 一组结果
     */
    PokerGanDengYan.prototype.getLaiziCardsFromRet = function(ret) {
        if (!ret || ret.length <= 0)
            return [];

        var laiziCards = [];

        for (var i = 0; i < ret.length; i++) {
            if (this.haveLaiziSign(ret[i]))
                laiziCards.push(ret[i]);
        }

        return laiziCards;
    };

    /**
     * 由癞子代替的牌，返回真正的癞子
     * @param {number} laiziCard 牌值
     */
    PokerGanDengYan.prototype.getRealLaizi = function(laiziCard) {
        if (!laiziCard)
            return -1;

        if (!this.haveLaiziSign(laiziCard))
            return -1;

        laiziCard = this.removeLaiziSign(laiziCard);

        if (laiziCard % 4 == 0)
            return XIAO_WANG;
        else if (laiziCard % 4 == 3)
            return DA_WANG;

        return -1;
    };

    /**
     * 对双癞子查找结果去重
     * @param {array} rets 结果
     */
     PokerGanDengYan.prototype.removeSameResults = function(rets) {
        var pointsCache = {};
        for (var i = 0; i < rets.length;) {
            var ret = rets[i].slice();

            ret.sort(this.cardValueCmp.bind(this));

            var pointStr = ""
            for (var j = 0; j < ret.length; j++) {
                pointStr += this.calPoint(ret[j]) + "_";
            }

            if (pointsCache[pointStr])
                rets.splice(i,1);
            else {
                i++;

                pointsCache[pointStr] = true;
            }
        }
    };

    /**
     * 给牌值加上癞子标记
     * @cardValue {number} 
     */
    PokerGanDengYan.prototype.addLaiziSign = function(cardValue) {
        return cardValue + LAI_ZI_SIGN;
    }

    /**
     * 给牌值去掉癞子标记
     * @cardValue {number} 
     */
    PokerGanDengYan.prototype.removeLaiziSign = function(cardValue) {
        return cardValue % LAI_ZI_SIGN;
    }

    /**
     * 是否带有癞子标记
     * @cardValue {number} 
     */
    PokerGanDengYan.prototype.haveLaiziSign = function(cardValue) {
        if (cardValue <= 0)
            return false;
        
        return cardValue > LAI_ZI_SIGN;
    }

    if (typeof (module) != "undefined" && module.exports)
        module.exports = PokerGanDengYan;
    if (typeof (MjClient) != "undefined")
        MjClient.majiang_GanDengYan = new PokerGanDengYan();
})();