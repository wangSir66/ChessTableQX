// 岳阳沅江千分
(function () {
    function PokerYueYangYuanJiangQianFen() { }

    var TWO_POINT = 15; // 2
    var APOINT = 14; // A
    var KPOINT = 13; // k
    var MIN_POINT = 5; // 最小的牌
    var XIAO_WANG = 53;
    var CARDTPYE = {
        zhadan: 110,
        big: 100, // 大牌分界线
        feiji: 6,
        sandaier: 5,
        shunzi: 4,
        liandui: 3,
        duizi: 2,
        danpai: 1,
    };

    PokerYueYangYuanJiangQianFen.prototype.CARDTPYE = CARDTPYE;
    var CARDCOUNT = {};
    CARDCOUNT[CARDTPYE.zhadan] = 4;
    CARDCOUNT[CARDTPYE.feiji] = 10;
    CARDCOUNT[CARDTPYE.sandaier] = 5;
    CARDCOUNT[CARDTPYE.shunzi] = 5;
    CARDCOUNT[CARDTPYE.liandui] = 4;
    CARDCOUNT[CARDTPYE.duizi] = 2;
    CARDCOUNT[CARDTPYE.danpai] = 1;

    PokerYueYangYuanJiangQianFen.prototype.getTotalCardCount = function (isQuDiao67) {
        var count = XIAO_WANG - 1 - 8; // 去掉大小王、3，4
        count = isQuDiao67 ? count - 8 : count; // 去掉 6、7
        return count * 3; // 3副牌 
    };

    PokerYueYangYuanJiangQianFen.prototype.getOnePairOfCards = function (isQuDiao67) {
        var cards = [];
        for (var i = 1; i < XIAO_WANG; i++) {
            // 去掉3、4、大小王、67（选项）
            var point = this.calPoint(i);
            if (point == 3 || point == 4) { continue; }
            if (isQuDiao67 && (point == 6 || point == 7)) { continue; }
            cards.push(i);
        }
        return cards;
    }

    PokerYueYangYuanJiangQianFen.prototype.isNeedRepeat = function(cards, handCount) {
        var countData = {};
        var lastIndex = -1;
        for (var j = 0; j <= cards.length; j++) {
            var idx = Math.floor(j/handCount);
            if(idx > 2) { break; }
            if (lastIndex != idx) {
                countData = {}
                lastIndex = idx;
            }
            var p = calPoint(cards[j]);
            if (countData[p] == null) { countData[p] = 0; }
            countData[p]++;
            if (countData[p] > 7) { return true; }
        }
        return false;
    };

    PokerYueYangYuanJiangQianFen.prototype.getQianFenRandomCards = function(tData, isNeedCheck) {
        var cards = this.getOnePairOfCards(tData.areaSelectMode.quDiao67 == 0);
        var totalCards = cards.concat(cards);
        totalCards = totalCards.concat(cards);
        shuffleArray(totalCards);
        // 27张牌不用考虑重发问题, 其他的大于7张的重发一次，减少大炸弹数
        if (isNeedCheck && tData.handCount > 27 && this.isNeedRepeat(totalCards, tData.handCount)) {
            return null;
        }
        return totalCards;
    }

    // 随机牌 5 人玩法，去掉4个6
    PokerYueYangYuanJiangQianFen.prototype.randomCards = function (areaSelectMode, tData) {
        var cards = this.getQianFenRandomCards(tData, true);
        if (cards == null) {
            cards = this.getQianFenRandomCards(tData, false);
        }
        return cards;
    };

    // 示众牌
    PokerYueYangYuanJiangQianFen.prototype.getShowCard = function (isQuDiao67) {
        var cards = this.getOnePairOfCards(isQuDiao67);
        return cards[Math.floor((Math.random() * cards.length))];
    }

    PokerYueYangYuanJiangQianFen.prototype.calcFenByCard = function (card) {
        var point = this.calPoint(card);
        if (point == 5 || point == 10 || point == 13) {
            return point == 5 ? 5 : 10;
        }
        return 0;
    };

    function calPoint(num) {
        if (!num) { return -1; }
        var ceilNum = Math.ceil(num / 4);
        if (ceilNum == 2) {
            return TWO_POINT;
        } else if (ceilNum == 1) {
            return APOINT;
        } else {
            return ceilNum;
        }
    };

    PokerYueYangYuanJiangQianFen.prototype.calPoint = calPoint;

    // 0:方块  1:梅花  2:梅花  3:黑桃
    PokerYueYangYuanJiangQianFen.prototype.calColor = function (card) {
        return (card + 3) % 4;
    };

    PokerYueYangYuanJiangQianFen.prototype.isShunZi = function (oCards, isQuDiao67) { //oCards有序
        if (!oCards) {
            return false;
        }
        var cardCount = oCards.length;
        if (cardCount < CARDCOUNT[CARDTPYE.shunzi] || calPoint(oCards[oCards.length - 1]) >= TWO_POINT) {
            return false;
        }
        var lastPoint = -1;
        for (var i = 0; i < oCards.length; i++) {
            var nowPoint = calPoint(oCards[i]);
            if (i > 0 && lastPoint != nowPoint - 1) {
                var flag = isQuDiao67 && lastPoint == 5 && nowPoint == 8;
                if (!flag) { return false; }
            }
            lastPoint = nowPoint;
        }
        return true;
    };

    PokerYueYangYuanJiangQianFen.prototype.isLianDui = function (oCards, isQuDiao67) { //oCards有序
        if (!oCards) {
            return false;
        }
        var cardCount = oCards.length;
        if (cardCount < CARDCOUNT[CARDTPYE.liandui] || cardCount % 2 != 0 || calPoint(oCards[oCards.length - 1]) > TWO_POINT) {
            return false;
        }
        var lastPoint = -1;
        for (var i = 0; i < oCards.length; i++) {
            var nowPoint = calPoint(oCards[i]);
            if (i % 2 == 1) {
                var flag = isQuDiao67 && lastPoint == 5 && nowPoint == 8;
                if (!flag && lastPoint != nowPoint) { return false; }
            } else if (i != 0 && lastPoint != nowPoint - 1) {
                var flag = isQuDiao67 && lastPoint == 5 && nowPoint == 8;
                if (!flag) { return false; }
            }
            lastPoint = nowPoint;
        }
        return true;
    };

    // 飞机和三带二算法一致
    PokerYueYangYuanJiangQianFen.prototype.isFeiji = function (oCards, isQuDiao67) { //cards有序
        if (!oCards) {
            return false;
        }
        var cards = oCards.slice();
        var cardCount = cards.length;
        if (cardCount < CARDCOUNT[CARDTPYE.sandaier] || cardCount % 5 != 0) {
            return false;
        }

        var kinds = [];
        var lastPoint = -1;
        for (var i = 0; i < cards.length; i++) {
            var p = calPoint(cards[i]);
            if (lastPoint == p) { continue; }
            lastPoint = p;
            if (this.findNSameCard(cards.slice(i), Number(p), 3)) {
                i = i + 2;
                kinds.push(p);
            }
        }

        var shunLen = 0;
        var num = 1;
        for (var i = 1; i < kinds.length; i++) {
            if ((kinds[i] - 1) == kinds[i - 1] || (isQuDiao67 && kinds[i - 1] == 5 && kinds[i] == 8)) {
                num++;
            } else {
                shunLen = shunLen > num ? shunLen : num;
                num = 1;
            }
        }
        shunLen = shunLen > num ? shunLen : num;
        return shunLen >= cardCount / 5;
    };

    PokerYueYangYuanJiangQianFen.prototype.calType = function (cards, isQuDiao67) {
        var cardCount = cards.length;
        var allSame = calPoint(cards[0]) == calPoint(cards[cards.length - 1]);
        if (allSame) {
            if (cardCount >= CARDCOUNT[CARDTPYE.zhadan]) {
                return CARDTPYE.zhadan;
            }
            if (cardCount == CARDCOUNT[CARDTPYE.duizi]) {
                return CARDTPYE.duizi;
            }
            if (cardCount == CARDCOUNT[CARDTPYE.danpai]) {
                return CARDTPYE.danpai;
            }
            return -1; // 三张不合法
        }

        var pointCounts = {};
        for (var i = 0; i < cards.length; i++) {
            increaseByKey(pointCounts, calPoint(cards[i]));
        }
        var maxCount = 0; // 最多有几张点数最多的牌
        var minCount = 12; // 最少的有几张
        for (var p in pointCounts) {
            if (maxCount < pointCounts[p]) {
                maxCount = pointCounts[p];
            }
            if (minCount > pointCounts[p]) {
                minCount = pointCounts[p];
            }
        }
        if (cardCount >= CARDCOUNT[CARDTPYE.shunzi] && maxCount == 1 && this.isShunZi(cards, isQuDiao67)) {
            return CARDTPYE.shunzi;
        }
        if (cardCount >= CARDCOUNT[CARDTPYE.liandui] && maxCount == 2 && minCount == 2 && this.isLianDui(cards, isQuDiao67)) {
            return CARDTPYE.liandui;
        }
        if (cardCount == CARDCOUNT[CARDTPYE.sandaier] && maxCount == 3) {
            return CARDTPYE.sandaier;
        }
        if (cardCount >= CARDCOUNT[CARDTPYE.feiji] && maxCount == 3 && this.isFeiji(cards, isQuDiao67)) {
            return CARDTPYE.feiji;
        }
        return -1;
    };

    // 计算牌型点数
    PokerYueYangYuanJiangQianFen.prototype.calCardsValue = function (cards, cType, isQuDiao67) {
        if (!cards || cards.length == 0) {
            return -1;
        }
        if (!cType) { cType = this.calType(cards, isQuDiao67); }

        if (cType == CARDTPYE.sandaier) {
            return calPoint(cards[2]);
        }
        if (cType == CARDTPYE.feiji) {
            var len = cards.length / 5;
            for (var i = cards.length - 1; i >= 2; i--) {
                var p = calPoint(cards[i]);
                if (p == calPoint(cards[i - 2])) {
                    var idx = i - (len - 1) * 3 - 2;
                    if (cards[idx] == null) {
                        break;
                    }
                    var minPoint = p - len + 1;
                    if (isQuDiao67 && (minPoint == 6 || minPoint == 7)) {
                        minPoint = 5;
                    }
                    if (minPoint == calPoint(cards[idx])) {
                        return p;
                    }

                }
            }
        }
        return calPoint(cards[cards.length - 1]);
    };

    // 牌点比较函数
    PokerYueYangYuanJiangQianFen.prototype.cardValueCmp = function (a, b) {
        var pa = calPoint(a);
        var pb = calPoint(b);
        if (pa == pb) {
            return a - b;
        }
        return pa - pb;
    };

    // 牌是否能压上
    PokerYueYangYuanJiangQianFen.prototype.canPut = function (oCards, oLastCards, isQuDiao67) {
        var cards = oCards.slice();
        cards.sort(this.cardValueCmp);
        var cType = this.calType(cards, isQuDiao67);
        if (cType == -1) {
            return false;
        }
        if (!oLastCards || oLastCards == -1) {
            return true; // 没有上次打的牌，三家过自己再出牌
        }

        var lastCards = oLastCards.slice();
        lastCards.sort(this.cardValueCmp);
        var lastCType = this.calType(lastCards, isQuDiao67);
        if (cType == lastCType) {
            if (cards.length == lastCards.length) {
                return this.calCardsValue(cards, cType, isQuDiao67) > this.calCardsValue(lastCards, lastCType, isQuDiao67);
            } else if (cType == CARDTPYE.zhadan) { // 炸弹张数多的较大
                return cards.length > lastCards.length;
            }
        } else if (cType > CARDTPYE.big && cType > lastCType) {
            return true;
        }
        return false;
    };

    // 检查是否能出牌
    PokerYueYangYuanJiangQianFen.prototype.checkPut = function (oHands, oCards, lastPutCard, tData) {
        var hands = oHands.slice();
        var cards = oCards.slice();
        for (var i = 0; i < cards.length; i++) {
            var p = hands.indexOf(cards[i]);
            if (p >= 0) {
                hands.splice(p, 1);
            } else {
                return null; // 手里没有这些牌
            }
        }
        if (this.canPut(cards, lastPutCard, tData.areaSelectMode.quDiao67 == 0)) {
            return hands; // 能打得过上家的牌
        }
        return null;
    };

    // 找N张点数一样的牌
    PokerYueYangYuanJiangQianFen.prototype.findNSameCard = function (hands, point, n) {
        for (var i = 0; i < hands.length; i++) {
            if (calPoint(hands[i]) == point && calPoint(hands[i + n - 1]) == point) {
                return hands.slice(i, i + n);
            }
        }
        return null;
    };

    // 排序 order 1 从小到大 -1 从大到小
    PokerYueYangYuanJiangQianFen.prototype.sortCardsValues = function (oCards, order) {
        if (!oCards || typeof (oCards) == 'undefined' || oCards.length == 0) return oCards;
        var cards = oCards.slice();
        var cmp = this.cardValueCmp;
        cards.sort(function (a, b) {
            return cmp(a, b) * order;
        });
        return cards;
    }

    // 同样的点为一组
    PokerYueYangYuanJiangQianFen.prototype.changeToGroupCards = function (oCards) {
        if (!oCards || typeof (oCards) == 'undefined' || oCards.length == 0) return oCards;
        var cards = oCards.slice();
        var handCards = [];
        var lastPoint = -1;
        var begin = -1;
        for (var i = 0; i < cards.length; i++) {
            var point = calPoint(cards[i]);
            if (point == -1) continue;
            if (lastPoint != point) {
                begin++;
                handCards[begin] = [];
                lastPoint = point;
            }
            handCards[begin].push(cards[i])
        }
        return handCards;
    };

    // 对手牌排序，从大到小
    PokerYueYangYuanJiangQianFen.prototype.sortHandCards = function (oCards) {
        var cards = this.sortCardsValues(oCards, -1);
        return this.changeToGroupCards(cards);
    };

    // 牌的二维数组比较，数量 > 点数
    PokerYueYangYuanJiangQianFen.prototype.cardArrValueCmp = function (a, b) {
        var na = a.length;
        var nb = b.length;
        if (na != nb && (na >= CARDCOUNT[CARDTPYE.zhadan] || nb >= CARDCOUNT[CARDTPYE.zhadan])) {
            return na - nb;
        }

        return calPoint(a) - calPoint(b)
    };

    // isFindZhaDan true找炸弹，false 找炸弹以外的 
    PokerYueYangYuanJiangQianFen.prototype.findAboutZhanDanByCards = function (oCards, isFindZhaDan) { // oCards 是二维数组
        if (!oCards || typeof (oCards) == 'undefined' || oCards.length == 0) return [];
        var cards = oCards.slice();
        cards.sort(this.cardArrValueCmp);
        var rets = [];
        for (var i = 0; i < cards.length; i++) {
            var isZhaDan = cards[i].length >= CARDCOUNT[CARDTPYE.zhadan];
            if (isFindZhaDan && isZhaDan) {
                rets.push(cards[i])
            } else if (!isFindZhaDan && !isZhaDan) {
                rets.push(cards[i])
            }
        }
        return rets;
    }

    PokerYueYangYuanJiangQianFen.prototype.findMulGroupsSanDaiErByCards = function (oCards, cardCount, isQuDiao67) { // oCards 是二维数组
        if (!oCards || typeof (oCards) == 'undefined' || oCards.length == 0) return [];
        var cards = oCards.slice();
        var rets = [];
        var group = cardCount / 5;
        for (var i = 0; i < cards.length - group + 1; i++) {
            if (cards[i].length != 3) { continue; }
            var bPoint = calPoint(cards[i][0]);
            var ePoint = calPoint(cards[i + group - 1][0]);
            if ((bPoint + group - 1) != ePoint) {
                var flag = isQuDiao67 && bPoint <= 5 && ePoint >= 8 && (bPoint + group + 1 == ePoint);
                if (!flag) { continue; }
            }
            var arr = cards[i].slice();
            for (var j = i + 1; j < i + group; j++) {
                if (cards[j].length == 3) {
                    arr = arr.concat(cards[j]);
                } else {
                    break;
                }
            }
            if (arr.length / 3 == group) {
                for (var j = 0; j < cards.length; j++) {
                    if (i <= j && j < i + group) { continue; }
                    arr = arr.concat(cards[j].slice())
                    if (arr.length >= cardCount) {
                        arr = arr.splice(0, cardCount);
                        break;
                    }
                }
                if (arr.length != cardCount) { break; }
                rets.push(arr);
            }
        }
        return rets;
    }

    PokerYueYangYuanJiangQianFen.prototype.findShunZiOrLianDuiByCards = function (oCards, cardCount, num, maxPoint, isQuDiao67) { // oCards 是二维数组
        if (!oCards || typeof (oCards) == 'undefined' || oCards.length == 0) return [];
        var cards = oCards.slice();
        var rets = [];
        var group = cardCount / num;

        for (var i = 0; i < cards.length - group + 1; i++) {
            var bPoint = calPoint(cards[i][0]);
            var ePoint = bPoint + group - 1;
            if (isQuDiao67 && bPoint <= 5 && ePoint + 2 >= 8) {
                ePoint += 2;
            }
            if (ePoint > maxPoint) { break; }
            if (ePoint != calPoint(cards[i + group - 1][0])) {
                continue;
            }
            var arr = [];
            for (var j = i; j < i + group; j++) {
                if (cards[j].length < num) {
                    i = j;
                    break;
                } else {
                    arr = arr.concat(cards[j].slice().splice(0, num));
                }
            }
            if (arr.length == cardCount) {
                rets.push(arr);
            }
        }
        return rets;
    }

    PokerYueYangYuanJiangQianFen.prototype.findDuiZiOrDanPaiByCards = function (oCards, cardCount) { // oCards 是二维数组
        if (!oCards || typeof (oCards) == 'undefined' || oCards.length == 0) return [];
        var cards = oCards.slice();
        cards.sort(this.cardArrValueCmp);
        var rets = [];
        for (var i = 0; i < cards.length; i++) {
            if (cards[i].length < cardCount) {
                continue;
            }
            rets.push(cards[i].splice(0, cardCount))
        }
        return rets;
    }

    // 找出type牌型的牌, 不拆炸弹
    PokerYueYangYuanJiangQianFen.prototype.findCardByType = function (oHands, cType, cardCount, isQuDiao67) {
        var hands = oHands.slice();
        if (hands.length < cardCount) {
            return [];
        }
        var hands = this.sortCardsValues(hands, 1);
        var handCards = this.changeToGroupCards(hands); // 二维数组
        var cards = this.findAboutZhanDanByCards(handCards, cType == CARDTPYE.zhadan); // 不拆炸弹，排除炸弹
        if (cType == CARDTPYE.zhadan) {
            return cards;
        }

        if (cType == CARDTPYE.feiji || cType == CARDTPYE.sandaier) {
            return this.findMulGroupsSanDaiErByCards(cards, cardCount, isQuDiao67);
        } else if (cType == CARDTPYE.shunzi || cType == CARDTPYE.liandui) {
            var num = cType == CARDTPYE.shunzi ? 1 : 2;
            var maxPoint = cType == CARDTPYE.shunzi ? APOINT : TWO_POINT;
            return this.findShunZiOrLianDuiByCards(cards, cardCount, num, maxPoint, isQuDiao67);
        } else if (cType == CARDTPYE.duizi || cType == CARDTPYE.danpai) {
            return this.findDuiZiOrDanPaiByCards(cards, cardCount);
        }
        return [];
    };

    // 先手按照优先级顺序提示：飞机、三带二、连对、顺子、对子、单牌、炸弹由小至大依次提示。
    PokerYueYangYuanJiangQianFen.prototype.getTipCardsArrForFirstHand = function (hands, isQuDiao67) {
        var cTypeList = [CARDTPYE.feiji, CARDTPYE.sandaier, CARDTPYE.liandui, CARDTPYE.shunzi, CARDTPYE.duizi, CARDTPYE.danpai, CARDTPYE.zhadan];
        var rets = [];

        for (var i = 0; i < cTypeList.length; i++) {
            var cardType = cTypeList[i];
            var cardCount = CARDCOUNT[cardType];
            var retsFirstTipLength = rets.length > 0 ? rets[0].length : 0;

            if ((cardType == CARDTPYE.sandaier || cardType == CARDTPYE.duizi || cardType == CARDTPYE.danpai) && retsFirstTipLength > cardCount) {
                // 已有提示张数大于三代二、对子、单牌的张数，这三种牌型不必找了
                continue;
            }

            if (retsFirstTipLength > 0 && cardType != CARDTPYE.zhadan) {
                // 在上次查找结果张数的基础上找新的牌型
                cardCount = Math.max(cardCount,retsFirstTipLength);

                if ((cardType == CARDTPYE.liandui && cardCount % 2 != 0) || (cardType == CARDTPYE.shunzi && cardCount % 2 == 0))
                    cardCount++;
            }
            
            var tCards = this.findCardByType(hands, cardType, cardCount, isQuDiao67);

            if (tCards.length > 0) {
                if (cardType != CARDTPYE.zhadan) {
                    if (cardType == CARDTPYE.feiji || cardType == CARDTPYE.liandui || cardType == CARDTPYE.shunzi) {
                        // 飞机、连队、顺子查找更长
                        var stepping = 0;
                        var longerCards = tCards;
                        
                        switch (cardType) {
                            case CARDTPYE.feiji:
                                stepping = 5;
                                break;
                            case CARDTPYE.liandui:
                                stepping = 2;
                                break;
                            case CARDTPYE.shunzi:
                                stepping = 1;
                                break;
                            default:
                                break;
                        }

                        while (longerCards.length > 0) {
                            cardCount += stepping;
                            longerCards = this.findCardByType(hands, cardType, cardCount, isQuDiao67);

                            if (longerCards.length > 0) {
                                tCards = longerCards;
                            }
                        }
                    }

                    if (tCards[0].length > retsFirstTipLength) {
                        // 如果新牌型的张数较多，覆盖已有提示
                        rets = tCards;
                    } else {
                        rets = rets.concat(tCards);
                    }
                } else {
                    // 炸弹放到已有提示之后
                    rets = rets.concat(tCards);
                }
            }
        }

        return rets;
    }

    // 接牌
    PokerYueYangYuanJiangQianFen.prototype.getTipCardsArrForBackHand = function (hands, oLastCards, isQuDiao67) {
        var lastCards = oLastCards.slice();
        lastCards.sort(this.cardValueCmp);
        var lastCardsType = this.calType(lastCards, isQuDiao67);
        var sameTypeCards = this.findCardByType(hands, lastCardsType, lastCards.length, isQuDiao67);
        var rets = [];
        for (var i = 0; i < sameTypeCards.length; i++) {
            if (this.canPut(sameTypeCards[i], oLastCards, isQuDiao67)) {
                rets.push(sameTypeCards[i]);
            }
        }
        if (lastCardsType < CARDTPYE.zhadan) {
            var bombCards = this.findCardByType(hands, CARDTPYE.zhadan, CARDCOUNT[CARDTPYE.zhadan], isQuDiao67);
            rets = rets.concat(bombCards);
        }
        return rets;
    }

    // 求解提示出牌
    PokerYueYangYuanJiangQianFen.prototype.getTipCardsArr = function (oHands, oLastCards, tData) {
        var hands = oHands.slice();
        hands.sort(this.cardValueCmp);
        var isQuDiao67 = tData.areaSelectMode.quDiao67 == 0;
        if (!oLastCards || oLastCards.length == 0) {
            return this.getTipCardsArrForFirstHand(hands, isQuDiao67);
        } else {
            return this.getTipCardsArrForBackHand(hands, oLastCards, isQuDiao67);
        }
    };

    // 求出牌型
    PokerYueYangYuanJiangQianFen.prototype.cardsType = function (oCards, isQuDiao67) {
        if (oCards) {
            var cards = oCards.slice();
            cards.sort(this.cardValueCmp);
            return this.calType(cards, isQuDiao67);
        }
        return -1;
    };

    PokerYueYangYuanJiangQianFen.prototype.isPutOutZhaDan = function (oCards) {
        return this.cardsType(oCards, false) == CARDTPYE.zhadan;
    }

    if (typeof (module) != "undefined" && module.exports)
        module.exports = PokerYueYangYuanJiangQianFen;
    if (typeof (MjClient) != "undefined")
        MjClient.yueYangYuanJiangQianFen = new PokerYueYangYuanJiangQianFen();
})();