//岳阳三打哈
(function () {
    function PokerYueYangSanDaHa() {
        this.handCount = 28;
        this.laiziCard = -1;

        this.cardCfg = {};
        // key:常主牌值  value:相对主牌的牌值大小 14:小王 15:大王
        this.cardCfg.changZhuByPoint = { 2: 1, 7: 2, 14: 3, 15: 4 };
        this.cardCfg.fk = {};
        this.cardCfg.mh = {};
        this.cardCfg.hx = {};
        this.cardCfg.ht = {};
        this.cardCfg.jokerBlack = 53;
        this.cardCfg.jokerRed = 54;
        for (var i = 1; i <= 52; i++) {
            // 0:方块  1:梅花  2:梅花  3:黑桃
            var cardType = (i + 3) % 4;
            // 牌值 1 - 13
            var cardValue = Math.ceil(i / 4);
            if (0 == cardType) this.cardCfg.fk[cardValue] = i;
            if (1 == cardType) this.cardCfg.mh[cardValue] = i;
            if (2 == cardType) this.cardCfg.hx[cardValue] = i;
            if (3 == cardType) this.cardCfg.ht[cardValue] = i;
        }

        this.fkZhu = 0;
        this.mhZhu = 1;
        this.hxZhu = 2;
        this.htZhu = 3;
        this.wuZhu = 4;
    }

    if (typeof (cc) == 'undefined') {
        var cc = function () { }
        cc.log = function () {
            var str = '';
            for (var i = 0; i < arguments.length; i++) {
                str = str + arguments[i] + ' ';
            }
        }
    }

    var PDK_CARDTPYE = {
        liandui: 5,
        duizi: 2,
        danpai: 1,
    };
    PokerYueYangSanDaHa.prototype.CARDTPYE = PDK_CARDTPYE;
    var PDK_CARDCOUNT = {};
    PDK_CARDCOUNT[PDK_CARDTPYE.liandui] = 4;
    PDK_CARDCOUNT[PDK_CARDTPYE.duizi] = 2;
    PDK_CARDCOUNT[PDK_CARDTPYE.danpai] = 1;

    var MINI_JIAO_FEN = 40;
    var MAX_JIAO_FEN = 80;
    var INIT_FEN = 100;

    PokerYueYangSanDaHa.prototype.getInitFen = function () { // 获取初始分
        return INIT_FEN;
    };

    PokerYueYangSanDaHa.prototype.getLevelScore = function (jiaofen) {
        return (MAX_JIAO_FEN - jiaofen) / 5 + 1;
    };

    PokerYueYangSanDaHa.prototype.isJiaoFenLegality = function (jiaofen, lastjiaofen) { // 1
        if (jiaofen >= lastjiaofen) { return false; }
        if (jiaofen > MAX_JIAO_FEN || jiaofen < MINI_JIAO_FEN) { return false; }
        if (jiaofen % 5 != 0) { return false; }
        return true;
    };

    PokerYueYangSanDaHa.prototype.isMiniJiaoFen = function (jiaofen) { // 1
        return jiaofen == MINI_JIAO_FEN;
    };



    // 1 - 52  方块A:1 梅花A:2 红心A:3 黑桃A:4 -- 黑桃王:52
    // 1.16张玩法为现有的没有大小王、只有一个2、三个A的玩法 一共48张
    // 2.15张玩法：在16张的基础上，再去掉两个A（剩红桃A）、一个K（去掉黑桃K），一共45张
    PokerYueYangSanDaHa.prototype.randomCards = function (areaSelectMode, tData) {
        var cards = [];
        // 去掉3、4
        for (var i = 1; i <= 54; i++) {
            if (this.calPoint(i) != 3 && this.calPoint(i) != 4)
                cards.push(i);
        }

        // 两幅扑克牌
        cards = cards.concat(cards);

        // 洗牌
        shuffleArray(cards);

        return cards;
    };

    PokerYueYangSanDaHa.prototype.cardlog = function (cards, zhuColorType) {
        var col = ["a", "b", "c", "d"]; // 方块 梅花 红心 黑桃
        var str = "";
        for (var i in cards) {
            var card = cards[i];
            var color = this.calColor(card);
            var pointsdh = this.calPointBySdh(card, zhuColorType);
            var point = this.calPoint(card);
            str += col[color] + point + " ";
        }
        // console.log(cards);
        // console.log(str);
    }

    /**
     * 计算成立类型
     * @param  {number} jiaofen 庄家叫分
     * @param  {array} PfenPaiArr 分牌
     * @param  {Boolean} isTouXiang [是否投降]
     * @param  {[number]} Pkoudifen [扣底得分 可为空]
     * @return {[number]} [] winType < 0 庄家赢        winType > 0 闲家赢
     */
    PokerYueYangSanDaHa.prototype.countWinType = function (jiaofen, PfenPaiArr, isTouXiang, Pkoudifen) {
        Pkoudifen = Pkoudifen || 0;
        var defen = this.getAllCardFen(PfenPaiArr) + Pkoudifen;
        var difffen = defen - jiaofen;
        var winType = 0;

        if (isTouXiang) {
            winType = 4;
        } else if (difffen < 0) {
            // 庄家赢

            if (defen == 0) {
                winType = -3; // 大光 每个闲家-3
            } else if (defen < 25) {
                winType = -2; // 小光 每个闲家-2
            } else {
                winType = -1; // 过庄 每个闲家-1
            }
        } else {
            // 闲家赢
            if (difffen < 45) {
                winType = 1;  // 跨庄 每个闲家+1
            } else if (difffen < 70) {
                winType = 2; // 小倒 每个闲家+2
            } else {
                winType = 3; // 大倒 每个闲家+3
            }
        }

        if (isTouXiang) {
            winType = 4;
        }

        return winType;
    }

    PokerYueYangSanDaHa.prototype.isWuZhu = function (zhuColorType) {
        if (zhuColorType == -1 || zhuColorType == 4) {
            return true;
        } else {
            return false;
        }
    }

    // 计算牌点数 1 2 3 4 5 6 7 8 9 10 11 12 13   14:小王  15:大王
    PokerYueYangSanDaHa.prototype.calPoint = function (num) {
        if (!num) return -1;
        var point = Math.ceil(num / 4);
        if (num == this.cardCfg.jokerRed) point = 15;
        if (num == this.cardCfg.jokerBlack) point = 14;
        return point;
    };

    // zhuColorType 主花花色，没选主花时为-1， 不为空时， 牌值根据zhuColorType计算大小(0:方块  1：梅花 2：红心 3：黑桃)
    PokerYueYangSanDaHa.prototype.calPointBySdh = function (num, zhuColorType) {
        if (!num) return -1;
        var point = this.calPoint(num);
        var color = this.calColor(num);

        // 是否无主
        if (this.isWuZhu(zhuColorType)) {
            var pointToSdh = { 3: 1, 4: 2, 5: 3, 6: 4, 8: 5, 9: 6, 10: 7, 11: 8, 12: 9, 13: 10, 1: 11, 2: 12, 7: 13, 14: 14, 15: 15 };
            var sdhPoint = pointToSdh[point];
            return sdhPoint;

            // 有选主
        } else {

            var pointToSdh = { 3: 1, 4: 2, 5: 3, 6: 4, 8: 5, 9: 6, 10: 7, 11: 8, 12: 9, 13: 10, 1: 11, 2: [12, 13], 7: [14, 15], 14: 16, 15: 17 };
            var sdhPoint = pointToSdh[point];

            // 如果是2，7主牌， 区分副主和选主
            if (point == 2 || point == 7) {
                // 如果是选主
                if (color == zhuColorType) {
                    sdhPoint = sdhPoint[1];
                } else {
                    sdhPoint = sdhPoint[0];
                }
            }

            // 主花点数比非主花大
            if (color == zhuColorType || this.cardCfg.changZhuByPoint[point]) {
                sdhPoint += 100;
            }

            return sdhPoint;
        }
    }


    // 牌的花色
    PokerYueYangSanDaHa.prototype.calColor = function (num) {
        if (!num) return -1;
        // 0:方块  1:梅花  2:梅花  3:黑桃
        var cardType = (num + 3) % 4;
        return cardType;
    }

    // 返回此牌花色， 如果是主花， 返回主花(不返回原花色)
    PokerYueYangSanDaHa.prototype.calColorSdh = function (num, zhuColorType) {
        if (!num) return -1;
        // 0:方块  1:梅花  2:红心  3:黑桃 4:主花
        var cardType = -1;
        if (this.isZhuCard(num, zhuColorType)) {
            cardType = 4;
        } else {
            cardType = (num + 3) % 4;
        }
        return cardType;
    }

    // 判断此牌是否是主花
    PokerYueYangSanDaHa.prototype.isZhuCard = function (num, zhuColorType) {
        var point = this.calPoint(num);
        var color = this.calColor(num);

        if (color == zhuColorType || this.cardCfg.changZhuByPoint[point]) {
            return true;
        } else {
            return false;
        }
    }

    PokerYueYangSanDaHa.prototype.getRoundFirstCards = function (putCardsRecord, uid, maxPlayNum) {
        if (!putCardsRecord || typeof putCardsRecord == 'undefined') {
            return null;
        }

        var roundPutCards = putCardsRecord[putCardsRecord.length - 1];

        if (!roundPutCards || typeof roundPutCards == 'undefined') {
            return null;
        }
        if (Object.keys(roundPutCards).length == maxPlayNum) {
            return null;
        }
        return roundPutCards[uid];
    }

    PokerYueYangSanDaHa.prototype.getRoundCardsByUid = function (putCardsRecord, uid, maxPlayNum) {
        if (!putCardsRecord || typeof putCardsRecord == 'undefined') {
            return null;
        }

        var roundPutCards = putCardsRecord[putCardsRecord.length - 1];

        if (!roundPutCards || typeof roundPutCards == 'undefined') {
            return null;
        }

        return roundPutCards[uid];
    }

    // 获取本轮最大的牌， 同点数先出比后出的大
    PokerYueYangSanDaHa.prototype.getMaxCardPlayerUid = function (roundPutCards, firstPutUid, uids, zhuColorType) {
        var frontUid = -1;
        if (!roundPutCards || typeof roundPutCards == 'undefined') {
            return frontUid;
        }

        var index = uids.indexOf(firstPutUid);
        for (var i = 0; i < uids.length; i++) {
            index = index % uids.length;
            var uid = uids[index];
            if (frontUid > 0) {
                var tmpcards = roundPutCards[frontUid];
                var cards = roundPutCards[uid];
                if (cards && tmpcards && this.isBigger(tmpcards, cards, zhuColorType) > 0) {
                    frontUid = parseInt(uid);
                }
            } else {
                frontUid = parseInt(uid);
            }
            index++
        }

        return frontUid;
    }

    PokerYueYangSanDaHa.prototype.getAllCardFen = function (fenPaiArr) {
        var fen = 0;
        for (var i in fenPaiArr) {
            var card = fenPaiArr[i];
            fen += this.getCardFen(card);
        }
        return fen;
    }

    // 获得牌的分  非分牌返回0分 
    PokerYueYangSanDaHa.prototype.getCardFen = function (num) {
        var cardValue = this.calPoint(num);
        var cfg = { '5': 5, '10': 10, '13': 10 }
        return cfg[cardValue] || 0;
    }

    // 获取所有对应牌数的拖拉机组合
    PokerYueYangSanDaHa.prototype.getLianDuiCards = function (oCards, cardNum, zhuColorType) {
        if (oCards.length < cardNum) return false;
        var resCards = [];
        for (var i = 0; i < oCards.length - cardNum + 1; i++) {
            var cards = oCards.slice(i, i + cardNum);
            if (this.isLiandui(cards, zhuColorType))
                resCards.push(cards);
        }

        if (resCards.length > 0) {
            return resCards;
        } else {
            return false;
        }
    }

    // 获取所有对应牌数的拖拉机组合
    PokerYueYangSanDaHa.prototype.getDuiZis = function (oCards, zhuColorType) {
        if (oCards.length < 2) return false;
        var resCards = [];
        for (var i = 0; i < oCards.length - 1; i++) {
            var cards = oCards.slice(i, i + 2);
            if (this.isDuizi(cards))
                resCards.push(cards);
        }

        if (resCards.length > 0) {
            return resCards;
        } else {
            return false;
        }
    }

    PokerYueYangSanDaHa.prototype.countDuiNum = function (oCards, zhuColorType) {
        var num = 0;
        var cardNumByValue = {};
        for (var i in oCards) {
            var cardValue = this.calPointBySdh(oCards[i], zhuColorType);
            var cardValue = oCards[i];
            if (!cardNumByValue[cardValue]) {
                cardNumByValue[cardValue] = 1;
            } else {
                cardNumByValue[cardValue]++;
                if (cardNumByValue[cardValue] % 2 == 0)
                    num++;
            }
        }

        return num;
    }

    /**
     * 判断是否是连对
     * @param {array} oCards 按点数排好序的牌
     * @return {bool}
     */
    PokerYueYangSanDaHa.prototype.isLiandui = function (oCards, zhuColorType) { //oCards有序
        var cardNum = PDK_CARDCOUNT[PDK_CARDTPYE.liandui];// 连对最小牌数

        if (!oCards || oCards.length < cardNum || oCards.length % 2 != 0)
            return false;

        var cardCount = oCards.length;
        var points = [];
        var colors = [];
        var colorsSdh = [];
        for (var i = 0; i < oCards.length; i++) {
            points.push(this.calPointBySdh(oCards[i], zhuColorType));
            colors.push(this.calColor(oCards[i]));
            colorsSdh.push(this.calColorSdh(oCards[i], zhuColorType));
        }

        for (var i = 0; i < cardCount - 1; i++) {
            // 判断对子
            if (i % 2 == 0 && (points[i] != points[i + 1] || colors[i] != colors[i + 1])) {
                return false;
            }

            // 判断连对
            if (i % 2 == 1 && Math.abs(points[i] - points[i + 1]) != 1) {
                return false;
            }

            if (colorsSdh[i] != colorsSdh[i + 1]) return false;
        }

        return true;
    };

    PokerYueYangSanDaHa.prototype.isDuizi = function (oCards) {
        if (oCards.length == 2 && oCards[0] == oCards[1]) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 计算牌型
     * @param {array} cards 按点数排好序的牌
     * @return {PDK_CARDTPYE} 牌型，-1 = 不成型
     */
    PokerYueYangSanDaHa.prototype.calType = function (cards, zhuColorType) {
        var cardCount = cards.length;

        // 连对，2对起
        if (cardCount >= PDK_CARDCOUNT[PDK_CARDTPYE.liandui] && this.isLiandui(cards, zhuColorType))
            return PDK_CARDTPYE.liandui;

        // 对子
        if (cardCount == 2 && this.isDuizi(cards))
            return PDK_CARDTPYE.duizi;

        // 单牌
        if (cardCount == 1)
            return PDK_CARDTPYE.danpai;

        return -1;
    };

    /**
     * 计算牌型点数
     * @param {array} cards 按点数排好序的牌
     * @return {number}
     */
    PokerYueYangSanDaHa.prototype.calCardsValue = function (cards, zhuColorType) {
        if (!cards || cards.length == 0)
            return -1;

        var lastCard = cards[cards.length - 1];

        return this.calPointBySdh(lastCard, zhuColorType);
    };

    // // 牌点比较函数
    PokerYueYangSanDaHa.prototype.cardValueCmp = function (a, b, zhuColorType) {
        var pa = this.calPointBySdh(a, zhuColorType);
        var pb = this.calPointBySdh(b, zhuColorType);
        if (pa == pb)
            return a - b;

        return pa - pb;
    };

    /** 
     * 牌是否能压上
     * @param {array} oCards 被压的牌，可以组成牌型的牌
     * @param {array} [oLastCards] 按点数排好序的牌/最后打出的牌
     * @return {number} -1:oCards比oLastCard小  0:相等  1:大
     */
    PokerYueYangSanDaHa.prototype.isBigger = function (beiYaCards, oLastCards, zhuColorType) {

        var cardsType = this.calType(beiYaCards, zhuColorType);

        if (cardsType == -1) {
            return -1;
        } else if (!oLastCards || typeof oLastCards == 'undefined' || oLastCards.length == 0) {
            return 1;
        }

        // 同花色 或 是主牌 才能比较点数
        var beiYaCardsColor = this.calColorSdh(beiYaCards[0], zhuColorType);
        var oLastCardsColor1 = this.calColorSdh(oLastCards[0], zhuColorType);
        var oLastCardsColor2 = this.calColorSdh(oLastCards[oLastCards.length - 1], zhuColorType);
        // 如果提起的牌 花色不全相同  或 和被压牌不相同 并 不是主牌 点数比被压牌小
        if (oLastCardsColor1 != oLastCardsColor2 || (oLastCardsColor1 != beiYaCardsColor && oLastCardsColor1 != 4)) {
            return -1;
        }

        var lastCardsType = this.calType(oLastCards, zhuColorType);
        if (cardsType == lastCardsType) {
            var beiYaTypeValue = this.calCardsValue(beiYaCards, zhuColorType);
            var lastTypeValue = this.calCardsValue(oLastCards, zhuColorType);
            if (lastTypeValue > beiYaTypeValue) {
                return 1;
            } else if (lastTypeValue == beiYaTypeValue) {
                return 0;
            } else {
                return -1;
            }
        }

        return -1;
    };


    PokerYueYangSanDaHa.prototype.checkPut = function (oHands, cards) {
        if (!cards || typeof (cards) == 'undefined' || cards.length == 0) return null;
        if (!oHands || typeof (oHands) == 'undefined' || oHands.length == 0) return null;

        var hands = oHands.slice();
        for (var i = 0; i < cards.length; i++) {
            var p = hands.indexOf(cards[i]);
            if (p >= 0) {
                hands.splice(p, 1);
            }
            else {
                return null; // 手里没有这些牌
            }
        }

        return hands;
    };

    /**
     * 检测是否能出牌
     * @param  {Array} oHands 手牌
     * @param  {Array} outCards 提起的牌/选择了的牌
     * @param  {Array} oBeiYaCard 被压的牌
     * @return {Array} 返回可以出的牌
     */
    PokerYueYangSanDaHa.prototype.checkPutSdh = function (oHands, pOutCards, oBeiYaCard, tData, isCanShuaiPai) {
        if (!pOutCards || typeof (pOutCards) == 'undefined' || pOutCards.length == 0) return null;
        if (!oHands || typeof (oHands) == 'undefined' || oHands.length == 0) return null;

        var zhuColorType = tData.zhuPaiType;
        var outCards = pOutCards.slice();
        var outCards = this.sortHandCards(outCards, zhuColorType);
        var hands = this.checkPut(oHands, outCards);
        if (hands == null)
            return null;

        // 首出牌， 同花色的 单张， 对子 连对
        if (!oBeiYaCard || oBeiYaCard.length <= 0) {
            var color = this.calColorSdh(outCards[0], zhuColorType);
            var colorcards = this.getColorCards(outCards, [color], zhuColorType);
            // 花色不是全部相同，不能打出
            if (colorcards.length != outCards.length) {
                return null;
            }

            var isZhuangShuaiTwo = tData.areaSelectMode["SAN_DA_HA_shuaiPaiLimitTwoCard"] && tData.curPlayer == tData.zhuang;
            // 甩牌 && 只能甩主牌 && ( !庄家甩牌最多两张 || 出牌不超过两张 )
            if (isCanShuaiPai && color == 4 && (!isZhuangShuaiTwo || outCards.length <= 2)) {
                return hands;

            }

            var outCardType = this.calType(outCards, zhuColorType);
            if (outCardType < 0) return null;

            // 检测是否打出同花色的牌
        } else if (oBeiYaCard && oBeiYaCard.length > 0) {
            var beiyaColor = this.calColorSdh(oBeiYaCard[0], zhuColorType);
            var handColorSameCards = this.getColorCards(oHands, [beiyaColor], zhuColorType);
            var handColorSameNum = handColorSameCards.length;
            var outCardsSameColorNum = this.getColorCards(outCards, [beiyaColor], zhuColorType).length;

            // 如果选择的牌是同花色， 有相同牌型需要打相同牌型， 牌型不够需要补牌， 没有牌型才能随意出
            if (outCards.length <= handColorSameNum && outCardsSameColorNum == outCards.length) {
                var oBeiYaType = this.calType(oBeiYaCard, zhuColorType);
                var outCardType = this.calType(outCards, zhuColorType);
                // 被压的是拖拉机， 
                if (outCardType != oBeiYaType && oBeiYaType == PDK_CARDTPYE.liandui) {
                    var needPutLianDui = false;
                    var needPutDuiZi = false;

                    var handColorSameCards = this.sortHandCards(handColorSameCards, zhuColorType);
                    // 没用选择拖拉机消对, 同花色的牌有拖拉机， 但是提起的不是拖拉机， 不能打出
                    if (!tData.areaSelectMode["SAN_DA_HA_allowTuoLaJiXiaoDui"] && this.getLianDuiCards(handColorSameCards, oBeiYaCard.length, zhuColorType) && !this.isLiandui(outCards, zhuColorType))
                        needPutLianDui = true;

                    // 同花色的牌有对子， 但是没有提起对应的对子， 不能打出
                    var duiNum = this.countDuiNum(handColorSameCards, zhuColorType);
                    var needPutDuiZiNum = duiNum * 2 > oBeiYaCard.length ? oBeiYaCard.length / 2 : duiNum;
                    var outDuiNum = this.countDuiNum(outCards, zhuColorType);
                    if (outDuiNum < needPutDuiZiNum)
                        needPutDuiZi = true;

                    if (needPutLianDui || needPutDuiZi)
                        return null;
                }

                // 被压的是对子
                if (outCardType != oBeiYaType && oBeiYaType == PDK_CARDTPYE.duizi) {
                    // 同花色的牌有对子， 但是提起的不是对子， 不能打出
                    if (this.countDuiNum(handColorSameCards, zhuColorType) > 0 && !this.isDuizi(outCards))
                        return null;
                }

            }

            // 如果同花色的牌足够 
            if (outCards.length <= handColorSameNum && outCardsSameColorNum < outCards.length) {
                return null;
            }
            // 如果同花色的牌不够  没有提起所有花色， 不能出牌
            if (outCards.length > handColorSameNum && outCardsSameColorNum < handColorSameNum) {
                return null;
            }

            if (oBeiYaCard.length != outCards.length) {
                return null;
            }

        } else {
            return null;
        }

        var sortCards = this.sortHandCards(outCards, zhuColorType)
        var sortLastCards = this.sortHandCards(oBeiYaCard, zhuColorType)

        return hands;

    }



    PokerYueYangSanDaHa.prototype.findCardByType = function (oHands, oBeiYaCard, zhuColorType) {
        if (!oBeiYaCard || typeof (oBeiYaCard) == 'undefined') return [];

        var firstCardColor = this.calColorSdh(oBeiYaCard[0], zhuColorType);
        var handsColorCards = this.getColorCards(oHands, [firstCardColor], zhuColorType);

        if (handsColorCards.length >= oBeiYaCard.length) {
            return handsColorCards;
        } else {
            return oHands;
        }

    };


    /**
     * 提示可出的牌
     * @param  {array} oHands 用来压牌的手牌
     * @param  {array} oBeiYaCard 被压的牌
     * @return {array} 提示的牌
     */
    PokerYueYangSanDaHa.prototype.tipCards = function (oHands, oBeiYaCard, zhuColorType, allowTuoLaJiXiaoDui) {
        // cc.log("----------------tipCards", oHands)
        // cc.log("----------------tipCards", oBeiYaCard)
        // cc.log("----------------tipCards", zhuColorType)
        // 如果不需要压牌， 可以任意出牌
        if (!oBeiYaCard) {
            return [oHands];
        } else {
            var firstCardColor = this.calColorSdh(oBeiYaCard[0], zhuColorType);
            var handsColorCards = this.getColorCards(oHands, [firstCardColor], zhuColorType);
            oBeiYaCard = this.sortHandCards(oBeiYaCard, zhuColorType);
            handsColorCards = this.sortHandCards(handsColorCards, zhuColorType).reverse();
            var beiyaType = this.calType(oBeiYaCard, zhuColorType)
            var tiparr = [];
            var cardNum = oBeiYaCard.length;
            this.cardlog(handsColorCards, zhuColorType);
            if (handsColorCards.length >= cardNum) {

                // 压拖拉机 
                if (beiyaType == PDK_CARDTPYE.liandui) {
                    // 有拖拉机出拖拉机 
                    var lianduis = null;
                    if (!allowTuoLaJiXiaoDui) {
                        // 如果是拖拉机消对，不需要计算拖拉机，只计算对子
                        lianduis = this.getLianDuiCards(handsColorCards, cardNum, zhuColorType);
                    }
                    if (lianduis) {
                        tiparr = tiparr.concat(lianduis);
                    } else {

                        // 没有拖拉机出对子  
                        var duizis = this.getDuiZis(handsColorCards, zhuColorType);
                        if (duizis) {
                            if (duizis.length * 2 >= cardNum) {
                                var indexs = this.getTipsDuiGroup(duizis.length, cardNum / 2);
                                tiparr = this.findNumsByIndexs(duizis, indexs);

                                // 对子不够 用单牌 (全同花色)
                            } else {
                                var tmpduizi = []
                                for (var i = 0; i < duizis.length; i++) {
                                    tmpduizi = tmpduizi.concat(duizis[i]);
                                }
                                var delcard = this.delCards(handsColorCards, tmpduizi);
                                var needNum = cardNum - tmpduizi.length;
                                for (var i = 0; i < delcard.length - needNum + 1; i++) {
                                    var sanpai = delcard.slice(i, i + needNum);
                                    tiparr.push(tmpduizi.concat(sanpai));
                                }
                            }

                            // 没有对子 用单牌
                        } else {
                            for (var i = 0; i < handsColorCards.length - cardNum + 1; i++) {
                                var sanpai = handsColorCards.slice(i, i + cardNum);
                                tiparr.push(sanpai);
                            }
                        }
                    }

                    // 压对子 有对子出对子 没有对子出单牌 (全同花色)
                } else if (beiyaType == PDK_CARDTPYE.duizi) {
                    var duizis = this.getDuiZis(handsColorCards, zhuColorType);
                    if (duizis) {
                        tiparr = tiparr.concat(duizis);
                    } else {
                        for (var i = 0; i < handsColorCards.length; i++) {
                            if (handsColorCards[i + 1])
                                tiparr.push([handsColorCards[i], handsColorCards[i + 1]]);
                        }
                    }

                    // 有单牌 (全同花色)
                } else if (beiyaType == PDK_CARDTPYE.danpai) {
                    for (var i = 0; i < handsColorCards.length; i++) {
                        if (i == 0 || tiparr[tiparr.length - 1][0] != handsColorCards[i]) tiparr.push([handsColorCards[i]])
                    }
                }
                return tiparr;

                // 同花色不够 用其他花色凑
            } else {
                var needNum = cardNum - handsColorCards.length;

                var delcard = this.delCards(oHands, handsColorCards);
                delcard = this.sortHandCards(delcard, zhuColorType).reverse();
                var lastSanPai = null;
                for (var i = 0; i < delcard.length - needNum + 1; i++) {
                    var sanpai = delcard.slice(i, i + needNum);
                    if (lastSanPai && JSON.stringify(lastSanPai) == JSON.stringify(sanpai))
                        continue;
                    tiparr.push(handsColorCards.concat(sanpai));
                    lastSanPai = sanpai;
                }
                return tiparr;
            }

        }
    };

    /**
     * 对手牌从大到小排序
     * @param {array} 
     * @param {number} zhuColorType 主牌花色
     */
    PokerYueYangSanDaHa.prototype.sortHandCards = function (oCards, zhuColorType) {
        if (!oCards || typeof oCards != 'object') return [];
        var cards = oCards.slice();
        var sortColors = []
        sortColors[0] = [0, 3, 2, 1];    // 主花为方：方黑红梅
        sortColors[1] = [1, 2, 3, 0];    // 主花为梅：梅红黑方
        sortColors[2] = [2, 3, 0, 1];    // 主花为红：红黑方梅
        sortColors[3] = [3, 2, 1, 0];    // 主花为黑：黑红梅方

        var fs = function (a, b) {
            var ca = this.calColor(a);
            var cb = this.calColor(b);
            var cza = this.calColorSdh(a, zhuColorType);
            var czb = this.calColorSdh(b, zhuColorType);

            if (cza != czb) {
                // 如果有选主，非主牌的排序 主牌==4
                if (!this.isWuZhu(zhuColorType) && cza != 4 && czb != 4) {
                    var sortcol = sortColors[zhuColorType];
                    return sortcol.indexOf(ca) - sortcol.indexOf(cb);

                    // 主牌排序
                } else {
                    return czb - cza;
                }
            }

            var pa = this.calPointBySdh(a, zhuColorType);
            var pb = this.calPointBySdh(b, zhuColorType);

            if (pa == pb) {
                return cb - ca;
            } else {
                return pb - pa;
            }


        }.bind(this)

        cards.sort(fs);
        return cards;
    };

    /** 
     * 找N张点数一样的牌
     * @param {array} hands 按点数排好序的牌 
     * @param {number} points
     * @param {number}
     * @return {array}
     */
    PokerYueYangSanDaHa.prototype.findNSameCard = function (hands, point, n, zhuColorType) {
        var newh = this.sortHandCards(hands, zhuColorType);
        for (var i = 0; i < newh.length; i++) {
            var pa = this.calPointBySdh(newh[i], zhuColorType);
            var pb = this.calPointBySdh(newh[i + n - 1], zhuColorType);
            if (pa == point && pb == point)
                return newh.slice(i, i + n);
        }
        return null;
    };

    // 删除相应牌值(不算花色)
    PokerYueYangSanDaHa.prototype.delPoint = function (hands, points) {
        var arr = hands.slice();
        for (var i = 0; i < points.length; i++) {
            for (var j = 0; j < arr.length; j++) {
                var jp = this.calPointBySdh(arr[j], zhuColorType);
                if (jp == points[i]) {
                    arr.splice(j, 1);
                    j--;
                }
            }
        }
        return arr;
    }

    // 删除相同的牌(花色相同，牌值相同)
    PokerYueYangSanDaHa.prototype.delCards = function (hands, cards) {
        var arr = hands.slice();
        for (var i = 0; i < cards.length; i++) {
            for (var j = 0; j < arr.length; j++) {
                if (arr[j] == cards[i]) {
                    arr.splice(j, 1);
                    j--;
                }
            }
        }
        return arr;
    }

    // 从牌组中获取指定花色
    PokerYueYangSanDaHa.prototype.getColorCards = function (cards, colors, zhuColorType) {
        var arr = [];
        for (var i = 0; i < cards.length; i++) {
            var num = cards[i];
            var color = this.calColorSdh(num, zhuColorType);
            if (colors.indexOf(color) >= 0) {
                arr.push(num);
            }
        }
        return arr;
    }

    PokerYueYangSanDaHa.prototype.formatCards = function (oCards, zhuColorType) {
        var info = {};
        // key:牌值  value:数量  (10有3张）
        info.mValueToNum = {};
        // key:数量  value:牌值  (3张的牌有10, K, 4)
        info.mNumToValue = {};

        var cds = this.sortHandCards(oCards, zhuColorType);
        info.cds = cds;

        for (var i in cds) {
            var value = this.calPointBySdh(cds[i]);
            if (!info.mValueToNum[value]) info.mValueToNum[value] = [];

            info.mValueToNum[value].push(cds[i]);
        }

        for (var i in cds) {
            var value = this.calPointBySdh(cds[i]);
            var num = info.mValueToNum[value].length;

            if (!info.mNumToValue[num]) info.mNumToValue[num] = [];

            if (info.mNumToValue[num].indexOf(value) < 0)
                info.mNumToValue[num].push(value);
        }

        return info;
    }

    PokerYueYangSanDaHa.prototype.isSameCards = function (cards1, cards2, zhuColorType) {
        if (cards1.length != cards2.length) return false;
        var cds1 = this.sortHandCards(cards1, zhuColorType);
        var cds2 = this.sortHandCards(cards2, zhuColorType);

        for (var i in cds1) {
            if (cds1[i] != cds2[i])
                return false;
        }

        return true;
    }

    PokerYueYangSanDaHa.prototype.isAllZhuCard = function (cards, zhuColorType) {
        for (var i = 0; i < cards.length; i++) {
            if (!this.isZhuCard(cards[i], zhuColorType)) {
                return false;
            }
        }
        return true;
    }


    // 求出牌型
    PokerYueYangSanDaHa.prototype.cardsType = function (oCards, zhuColorType) {
        if (oCards) {
            return this.calType(oCards, zhuColorType);
        }
        return -1;
    };

    PokerYueYangSanDaHa.prototype.getTipsDuiGroup = function (len, num) {
        var indexs = [];
        var temp = [];
        for (var i = 0; i < len; i++) {
            temp[i] = i < num ? 1 : 0;
        }
        indexs.push(temp.slice());
        var find = true;
        while (find) {
            find = false;
            for (var i = 0; i < len - 1; i++) {
                if (temp[i] == 1 && temp[i + 1] == 0) {
                    find = true;
                    temp[i] = 0;
                    temp[i + 1] = 1;
                    if (i > 1) { temp = this.moveOneToLeft(temp, i) }
                    indexs.push(temp.slice());
                    break
                }
            }
            if (!find) { break }
        }
        return indexs;
    };

    PokerYueYangSanDaHa.prototype.moveOneToLeft = function (arr, idx) {
        var sum = 0;
        for (var i = 0; i < idx; i++) {
            if (arr[i] == 1) {
                sum++;
            }
        }
        for (var i = 0; i < idx; i++) {
            arr[i] = i < sum ? 1 : 0;
        }
        return arr;
    };

    PokerYueYangSanDaHa.prototype.findNumsByIndexs = function (duizis, indexs) {
        var len = indexs.length;
        var result = [];
        for (var i = 0; i < len; i++) {
            var temp = [];
            for (var j = 0; j < indexs[i].length; j++) {
                if (indexs[i][j] == 1) {
                    temp = temp.concat(duizis[j]);
                }
            }
            result.push(temp);
        }
        return result;
    };

    // 检查是否是一次可以出完
    PokerYueYangSanDaHa.prototype.checkPutByOneTimes = function (oHands, zhuColorType) {
        var cards = this.sortHandCards(oHands.slice(), zhuColorType);
        return this.cardsType(cards, zhuColorType) != -1;
    };


    if (typeof (module) != "undefined" && module.exports)
        module.exports = PokerYueYangSanDaHa;

    if (typeof (MjClient) != "undefined")
        MjClient.PokerYueYangSanDaHa = new PokerYueYangSanDaHa();

})();