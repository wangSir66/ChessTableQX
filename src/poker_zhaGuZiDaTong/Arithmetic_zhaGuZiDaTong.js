//大同扎股子
(function() {
    function PokerZhaGuZiDaTong() {
        this.handCount = 10;
    }

    // 方片3亮(isShowFuCard) 红桃3+方片3比火箭大，单牌比4大
    // 亮片3且有双红3 红桃3-黑桃3-王-4-其他3-2-A-K-Q
    // 不亮片3活有双红3 红桃3-黑桃3-王-4-其他3-2-A-K-Q
    var ZHU_POINT = 18; // 红桃3
    var FOUR_POINT = 17; // 4
    var THREE_POINT = 16; // 3
    var TWO_POINT = 15; // 2
    var APOINT = 14; // A
    var KPOINT = 13; // k
    var MIN_POINT = 5; // 最小的牌
    var XIAO_WANG = 53;
    var DA_WANG = 54; // 大王
    var MAN_TIAN_FEI = 55; // 满天飞
    var FIRST_PUT_CARD = 19; // 红桃5,首出的牌
    var ZHU_VALUE = 11; // 红桃3
    var FU_VALUE = 9; // 方块3
    var CARDTPYE = {
        mantianfei:120,
        huojian: 115,
        zhadan: 110,
        ruanzha:105,
        big: 100, // 大牌分界线
        duizi: 2,
        danpai: 1,
    };

    PokerZhaGuZiDaTong.prototype.CARDTPYE = CARDTPYE;
    var CARDCOUNT = {};
    CARDCOUNT[CARDTPYE.mantianfei] = 2;
    CARDCOUNT[CARDTPYE.huojian] = 2;
    CARDCOUNT[CARDTPYE.zhadan] = 4;
    CARDCOUNT[CARDTPYE.ruanzha] = 3;
    CARDCOUNT[CARDTPYE.duizi] = 2;
    CARDCOUNT[CARDTPYE.danpai] = 1;

    // 随机牌 5 人玩法，去掉4个6
    PokerZhaGuZiDaTong.prototype.randomCards = function(areaSelectMode, tData) {
        var cards = [];
        for (var i = 1; i <= DA_WANG; i++) {
            if (tData.maxPlayer==5 && calPoint(i) == 6) { continue; }
            cards.push(i);
        }
        shuffleArray(cards);
        return cards;
    };


    function calPoint(num) {
        if (!num) { return -1; }

        if (num==DA_WANG || num==XIAO_WANG) { return num; }

        var ceilNum = Math.ceil(num / 4);
        if (ceilNum == 4) {
            return FOUR_POINT;
        } else if (ceilNum == 3) {
            return THREE_POINT;
        } else if (ceilNum == 2) {
            return TWO_POINT;
        } else if (ceilNum == 1) {
            return APOINT;
        }

        return ceilNum;
    };

    PokerZhaGuZiDaTong.prototype.calPoint = calPoint;

    // 0:方块  1:梅花  2:梅花  3:黑桃
    PokerZhaGuZiDaTong.prototype.calColor = function (card) {
        return (card + 3) % 4;
    };

    PokerZhaGuZiDaTong.prototype.isCanLiangSan = function (hands) {
        if (!hands || hands.length == 0) {
            return false;
        }
        for (var i = 0; i < hands.length; i++) {
            if(hands[i] == ZHU_VALUE || hands[i] == FU_VALUE) {
                return true;
            }
        }
        return false;
    };

    PokerZhaGuZiDaTong.prototype.isFindFirstPutCard = function (cards) {
        if (!cards || cards.length == 0) {
            return false;
        }
        return cards.indexOf(FIRST_PUT_CARD) > -1;
    };

    PokerZhaGuZiDaTong.prototype.isShowFuCardForJiaZhu = function (cards) {
        if (!cards || cards.length == 0) {
            return false;
        }
        return cards.indexOf(FU_VALUE) > -1;
    };

    PokerZhaGuZiDaTong.prototype.isHaveZhuCard = function (cards) {
        if (!cards || cards.length == 0) {
            return false;
        }
        return cards.indexOf(ZHU_VALUE) > -1;
    };

    PokerZhaGuZiDaTong.prototype.isHeiSanShowId = function(cards) {
        if (!cards || cards.length == 0) {
            return false;
        }
        for (var i = 0; i < cards.length; i++) {
            if (cards[i] == 10 || cards[i] == 12) {
                return true;
            }
        }
        return false;
    };

    PokerZhaGuZiDaTong.prototype.getLiangSanIegitimateStatus = function (hands, cards) {
        if (!cards || !hands || hands.length == 0 || cards.length == 0) {
            return -3;
        }
        //   2个红3的玩家选择亮3，则必须亮出方片3，红桃3可以不亮
        if (this.isShowFuCardForJiaZhu(cards)) {
            return 1;
        }
        if(hands.indexOf(FU_VALUE) > -1) {
            return -2;
        }
        if(cards.indexOf(ZHU_VALUE) > -1)
        {
            return 1;
        } else {
            return -1;
        }
    };

    // 红桃3和方块3和黑桃3三个3
    PokerZhaGuZiDaTong.prototype.isCanSurrender = function (hands) {
        if (!hands || hands.length == 0) {
            return false;
        }
        var sanArr = [];
        for (var i = 0; i < hands.length; i++) {
            if (calPoint(hands[i]) == THREE_POINT) {
                sanArr.push(hands[i]);
            }
        }
        var len = sanArr.length;
        return len == 4 || (len == 3 && sanArr.indexOf(10) == -1);
    };

    PokerZhaGuZiDaTong.prototype.getColorForLiang = function (cards) {
        if (!cards || cards.length == 0) {
            return [];
        }
        var color = [];
        for (var i = 0; i < cards.length; i++) {
            if (calPoint(cards[i]) == THREE_POINT) {
                color.push(this.calColor(cards[i]) + 1);
            } else {
                return null;
            }
        }
        return color;
    };

    // 计算牌型 isShowFuCard:方片3是否亮
    PokerZhaGuZiDaTong.prototype.calType = function(cards, isShowFuCard) {
        var cardCount = cards.length;
        if (cardCount == CARDCOUNT[CARDTPYE.huojian] && cards[0] == XIAO_WANG) {
            return CARDTPYE.huojian;
        } else if (cardCount == CARDCOUNT[CARDTPYE.danpai]) {
            return CARDTPYE.danpai;
        }

        var allSame = calPoint(cards[0]) == calPoint(cards[cards.length - 1]);

        if (cardCount == CARDCOUNT[CARDTPYE.zhadan] && allSame) {
            return CARDTPYE.zhadan;
        } else if (cardCount == CARDCOUNT[CARDTPYE.ruanzha]  && allSame) {
            return CARDTPYE.ruanzha;
        } else if (cardCount == CARDCOUNT[CARDTPYE.duizi] && allSame) {
            return isShowFuCard && cards[0]==FU_VALUE && cards[1]==ZHU_VALUE ? CARDTPYE.mantianfei : CARDTPYE.duizi;
        }

        return -1;
    };

    // 计算牌型点数
    PokerZhaGuZiDaTong.prototype.calCardsValue = function(cards, cType, isShowFuCard) {
        if (cType == -1 || !cards || cards.length == 0) {
            return -1;
        }
        if (cType == CARDTPYE.mantianfei) {
            return MAN_TIAN_FEI;
        } else if (cType == CARDTPYE.danpai && calPoint(cards[0]) == THREE_POINT && (cards[0] == ZHU_VALUE || (isShowFuCard && cards[0] == FU_VALUE))) {
            // 亮方片3,方片3==红桃3>4 不亮方片3,红桃3 > 4 > 方片3
            return ZHU_POINT;
        }

        return calPoint(cards[0]);
    };

    // 牌点比较函数
    PokerZhaGuZiDaTong.prototype.cardValueCmp = function(a, b) {
        var pa = calPoint(a);
        var pb = calPoint(b);
        if (pa == pb) {
            return a - b;
        }
        return pa - pb;
    };

    PokerZhaGuZiDaTong.prototype.isCardTypeEqual = function(lastCardsType, nowCardsType) {
        if (lastCardsType == nowCardsType) {
            return true;
        }
        if (lastCardsType ==  CARDTPYE.huojian && nowCardsType == CARDTPYE.mantianfei) { // 双三满天飞 == 王炸
            return true;
        }
        if (lastCardsType ==  CARDTPYE.mantianfei && nowCardsType == CARDTPYE.huojian) { // 双三满天飞 == 王炸
            return true;
        }
        return false;
    };

    // 牌是否能压上
    PokerZhaGuZiDaTong.prototype.canPut = function(oCards, oLastCards, isShowFuCard) {
        var cards = oCards.slice();
        cards.sort(this.cardValueCmp);
        var cardsType = this.calType(cards, isShowFuCard);
        if (cardsType == -1) {
            return false;
        }
        if (!oLastCards) {
            return true; // 没有上次打的牌，三家过自己再出牌
        }
        if (oLastCards == -1) { return true; }

        var lastCards = oLastCards.slice();
        lastCards.sort(this.cardValueCmp);
        var lastCardsType = this.calType(lastCards, isShowFuCard);
        if (cardsType == lastCardsType && cards.length == lastCards.length) {
            var typeValue = this.calCardsValue(cards, cardsType, isShowFuCard);
            var lastTypeValue = this.calCardsValue(lastCards, lastCardsType, isShowFuCard);
            return typeValue > lastTypeValue;
        }
        else if (cardsType > CARDTPYE.big && cardsType > lastCardsType) {
            if (this.isCardTypeEqual(lastCardsType, cardsType)) { return false; }
            return true;
        }
        return false;
    };

    // 检查是否能出牌
    PokerZhaGuZiDaTong.prototype.checkPut = function(oHands, oCards, lastPutCard, tData) {
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
        if (tData.isFirstPut && !this.isFindFirstPutCard(cards)) { // 首出没有红桃5
            return null;
        }
        if (this.canPut(cards, lastPutCard, tData.isShowFuCard)) {
            return hands; // 能打得过上家的牌
        }
        return null;
    };

    // 检查是否是一次可以出完
    PokerZhaGuZiDaTong.prototype.checkPutByOneTimes = function (oHands, tData) {
        return this.cardsType(oHands, tData.areaSelectMode, tData) != -1;
    };

    // 找N张点数一样的牌
    PokerZhaGuZiDaTong.prototype.findNSameCard = function(hands, point, n) {
        for (var i = 0; i < hands.length; i++) {
            if (calPoint(hands[i]) == point && calPoint(hands[i + n - 1]) == point) {
                return hands.slice(i, i + n);
            }
        }
        return null;
    };

    // 排序 order 1 从小到大 -1 从大到小
    PokerZhaGuZiDaTong.prototype.sortCards = function (oCards, isShowFuCard, order) {
        var cardLen = oCards.length;
        var tmpCards = oCards.slice();
        var hasManTianFei = false;
        if (isShowFuCard) {
            var num = 0;
            for (var i = cardLen - 1; i >= 0; i--) {
                if (tmpCards[i] == ZHU_VALUE || tmpCards[i] == FU_VALUE) {
                    tmpCards.splice(i, 1);
                    num++;
                }
            }
            hasManTianFei = num == 2;
        }

        var cards = hasManTianFei ? tmpCards : oCards.slice(); // 是否有满天飞
        var cmp = this.cardValueCmp;
        cards.sort(function(a, b) {
            return cmp(a, b) * order;
        });
        if (hasManTianFei) {
            if (order == 1) {
                cards.push(FU_VALUE);
                cards.push(ZHU_VALUE);
            } else {
                cards.splice(0, 0, ZHU_VALUE, FU_VALUE);
            }
        }
        return cards;
    };

    PokerZhaGuZiDaTong.prototype.getPointMapForCards = function (cards) {
        var counts = {};
        for (var i = 0; i < cards.length; i++) {
            var point = calPoint(cards[i]);
            if (counts[point] == null) {
                counts[point] = [];
            }
            counts[point].push(cards[i]);
        }
        return counts;
    };

    // 对手牌排序，从大到小
    PokerZhaGuZiDaTong.prototype.sortHandCards = function(oCards, isShowFuCard) {
        return this.sortCards(oCards, isShowFuCard, -1);
    };

    PokerZhaGuZiDaTong.prototype.isHaveManTianFei = function(counts, isShowFuCard) {
        if (!isShowFuCard || counts == null || counts[THREE_POINT] == null) { return false; }        
        var tmpCards = counts[THREE_POINT];
        if (tmpCards < CARDCOUNT[CARDTPYE.mantianfei]) { return false; }
        return tmpCards.indexOf(FU_VALUE) != -1 && tmpCards.indexOf(ZHU_VALUE) != -1;
    };

    PokerZhaGuZiDaTong.prototype.findCardByCounts = function(counts, cType, isOne) {
        var rets = [];
        for (var i = MIN_POINT; i <= FOUR_POINT; i++) {
            var tmpCards = counts[i];
            if (tmpCards == null) { continue; }
            if (tmpCards.length != CARDCOUNT[cType]) {
                if (!isOne && i==THREE_POINT && tmpCards.length==1 && cType==CARDTPYE.duizi && counts[ZHU_POINT]!=null && counts[ZHU_POINT].length==1) {
                    rets.push([tmpCards[0], counts[ZHU_POINT][0]]); // 对子处理一个主三，一个副三的情况
                }
                continue;
             }
            if (isOne) {
                rets.push([tmpCards[0]]);
            } else {
                rets.push(tmpCards);
            }
        }
        return rets;
    }

    PokerZhaGuZiDaTong.prototype.getPointMapByShowFuCard = function(hands, isShowFuCard) {
        var counts = this.getPointMapForCards(hands);
        var hasManTianFei = this.isHaveManTianFei(counts, isShowFuCard);
        var tmpCards = counts[THREE_POINT];
        if (tmpCards != null) { // 处理三
            var tmpLen = tmpCards.length;
            counts[ZHU_POINT] = [];
            if (hasManTianFei) {
                counts[ZHU_POINT] = [FU_VALUE, ZHU_VALUE];
                if (tmpLen == 2) {
                    tmpCards = null;
                } else {
                    tmpCards.splice(tmpCards.indexOf(ZHU_VALUE), 1);
                    tmpCards.splice(tmpCards.indexOf(FU_VALUE), 1);
                }
            } else if (tmpLen < 3) {
                var idx = isShowFuCard ? tmpCards.indexOf(FU_VALUE) : -1;
                if (idx != -1) {
                    counts[ZHU_POINT].push(FU_VALUE)
                    tmpCards.splice(idx, 1);
                }
                idx = tmpCards.indexOf(ZHU_VALUE);
                if (idx != -1) {
                    counts[ZHU_POINT].push(ZHU_VALUE)
                    tmpCards.splice(idx, 1);
                }
            }
        }
        return counts;
    }

    // 找出type牌型的牌, 不拆炸弹
    // 单牌：亮片3  红桃3==方片3 > 4; 不亮片3 红桃3 > 4 > 方片3
    PokerZhaGuZiDaTong.prototype.findCardByType = function(oHands, cType, cardCount, isShowFuCard) {
        var hands = oHands.slice();
        var handsLen = hands.length;
        if (handsLen < cardCount) {
            return [];
        }
        
        var counts = this.getPointMapByShowFuCard(hands, isShowFuCard);
        var hasManTianFei = counts[ZHU_POINT] != null && counts[ZHU_POINT].length == CARDCOUNT[CARDTPYE.mantianfei];

        if (cType == CARDTPYE.mantianfei) { // 满天飞, 红桃3+方片3
            return hasManTianFei ? [[FU_VALUE, ZHU_VALUE]] : [];
        }
        if (cType == CARDTPYE.huojian) { // 火箭
            var hasHuoJian = counts[DA_WANG] != null && counts[XIAO_WANG] != null;
            return hasHuoJian ? [[XIAO_WANG, DA_WANG]] : [];
        }
        var rets = this.findCardByCounts(counts, cType, false);
        if (cType != CARDTPYE.danpai) {
            return rets;
        }

        if (!hasManTianFei && counts[ZHU_POINT] != null && counts[ZHU_POINT].length == 1) {
            rets.push(counts[ZHU_POINT]);
        }

        // 单牌
        if (counts[XIAO_WANG] != null && counts[DA_WANG] == null) {
            rets.push(counts[XIAO_WANG]);
        }
        if (counts[XIAO_WANG] == null && counts[DA_WANG] != null) {
            rets.push(counts[DA_WANG]);
        }

        var rets1 = this.findCardByCounts(counts, CARDTPYE.duizi, true);
        if (rets1.length > 0) {
            rets = rets.concat(rets1);
        }        
        return rets;
    };


    // 求解提示出牌
    PokerZhaGuZiDaTong.prototype.getTipCardsArr = function(oHands, oLastCards, isShowFuCard) {
        var rets = [];
        if (!oLastCards || !oLastCards.length) {
            return rets;
        }
        var hands = this.sortCards(oHands, isShowFuCard, 1);
        var lastCards = oLastCards.slice();
        lastCards.sort(this.cardValueCmp);
        var lastCardsType = this.calType(lastCards, isShowFuCard);

        var cardsTypeList = [CARDTPYE.ruanzha, CARDTPYE.zhadan, CARDTPYE.huojian, CARDTPYE.mantianfei];
        if (lastCardsType == CARDTPYE.duizi || lastCardsType == CARDTPYE.danpai) {
            cardsTypeList.splice(0, 0, lastCardsType);
        }

        for (var t = 0;  t < cardsTypeList.length; t++) {
            if (cardsTypeList[t] < lastCardsType) { continue; }
            var sameTypeCards = this.findCardByType(hands, cardsTypeList[t], CARDCOUNT[cardsTypeList[t]], isShowFuCard);
            if (sameTypeCards.length == 0) { continue; }
            if (this.isCardTypeEqual(lastCardsType, cardsTypeList[t])) {
                for (var i = 0; i < sameTypeCards.length; i++) {
                    if (this.canPut(sameTypeCards[i], lastCards, isShowFuCard)) {
                        rets.push(sameTypeCards[i]);
                    }
                }
            } else {
                rets = rets.concat(sameTypeCards)
            }
        }
        return rets;
    };

    // 求出牌型
    PokerZhaGuZiDaTong.prototype.cardsType = function(oCards, areaSelectMode, tData) {
        if (oCards) {
            var cards = oCards.slice();
            cards.sort(this.cardValueCmp);
            return this.calType(cards, tData.isShowFuCard);
        }
        return -1;
    };

    // 计算真实的点
    PokerZhaGuZiDaTong.prototype.calRealPoint = function(num) {
        if (!num) {
            return -1;
        }
        var ceilNum = Math.ceil(num / 4);

        if (ceilNum > KPOINT) {
            return num; // 大小王原数字返回53、54
        }
        return ceilNum;
    };

// ==========================[[ 前端提牌 ]] ===================================

    // 返回值，牌的下标，value真实的值
    // 例如 红桃8梅花8方块8 出 88, tipCardsArray 仅有 方块8和梅花8，出红桃8梅花8
    PokerZhaGuZiDaTong.prototype.findSelectCardForAutoUp = function(tipCards, selectValue) {
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
    PokerZhaGuZiDaTong.prototype.changeSelectCardForAuto = function(tipCards, idx, selectValue) {
        tipCards[idx] = selectValue;
        return tipCards;
    };


    PokerZhaGuZiDaTong.prototype.findTheRightTouchMoveCards = function(upSelectCards, cType, oLastCards, isShowFuCard) {
        var sameTypeCards = this.findCardByType(upSelectCards, cType, oLastCards.length, isShowFuCard);
        var counts = this.getPointMapForCards(upSelectCards);
        for (var i = 0; i < sameTypeCards.length; i++) {
            var point = calPoint(sameTypeCards[i][0]);
            if (cType == CARDTPYE.danpai || cType == CARDTPYE.duizi) {
                if (counts[point] == CARDCOUNT[CARDTPYE.zhadan] || counts[point] == CARDCOUNT[CARDTPYE.ruanzha]) {
                    return counts;
                }
            }

            if (cType == CARDTPYE.ruanzha && counts[point] == CARDCOUNT[CARDTPYE.zhadan]) {
                return counts;
            }

            if (this.canPut(sameTypeCards[i], oLastCards, isShowFuCard)) {
                return sameTypeCards[i];
            }
        }
        return null;
    };

    // 自动提牌-点牌
    PokerZhaGuZiDaTong.prototype.handleAutoByFirstCard = function(tipCardsArray, upSelectCard, cType) {
        var tipLen = tipCardsArray.length;
        for (var i = 0; i < tipLen; i++) {
            var idx = tipCardsArray[i].indexOf(upSelectCard);
            if (idx == -1) { continue;}
            return tipCardsArray[i];
        }
        return null;
    };

    // 计算划牌结果
    PokerZhaGuZiDaTong.prototype.calAutoPutCards = function (bTouchMove, tipCardsArray, upSelectCards, tData) {
        var data = {};
        var cType = this.calType(tData.lastPutCard, tData.isShowFuCard);
        upSelectCards = this.sortCards(upSelectCards, tData.isShowFuCard, 1);
        if (bTouchMove && upSelectCards.length > 1) {
            // 划牌第一步：划的牌拥有可以出的牌型，返回第一个可以出的牌组，否则进行第一步
            data.tSelectCards = this.findTheRightTouchMoveCards(upSelectCards, cType, tData.lastPutCard, tData.isShowFuCard);
            if (data.tSelectCards == null) {
                // 划牌第二步：划的牌不满足出牌，处理最小牌
                data.tSelectCards = this.handleAutoByFirstCard(tipCardsArray, upSelectCards[0], cType);
            }
        } else if (upSelectCards.length == 1) {
            data.tSelectCards = this.handleAutoByFirstCard(tipCardsArray, upSelectCards[0], cType);
        }
        data.hasCardToUp = data.tSelectCards != null;
        return data;
    };

    if(typeof(module)!="undefined" && module.exports)
        module.exports = PokerZhaGuZiDaTong;
    if(typeof(MjClient)!="undefined")
        MjClient.zhaguizi_datong = new PokerZhaGuZiDaTong();
})();