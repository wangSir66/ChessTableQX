//忻州三打二算法类
(function() {
function PokerXinZhouSanDaEr() {
    this.handCount = 10;
}

if(typeof(cc)=='undefined') {
    var cc = function(){}
    cc.log = function(){
        var str = '';
        for (var i=0; i<arguments.length; i++){
            str  = str + arguments[i] + ' ';
        }
    }
}

var CARDTPYE = {
    danpai: 1,
};
PokerXinZhouSanDaEr.prototype.CARDTPYE = CARDTPYE;
var PDK_CARDCOUNT = {};
PDK_CARDCOUNT[CARDTPYE.danpai] = 1;
var MAX_JIAO_FEN = 100; // 最大叫分
var MIN_JIAO_FEN = 80;  // 最小叫分
var CHOOSE_MIN_POINT = 11; // 找朋友最小的点

var ZHUPAI = 2;
var XIAOWANG = 53;
var DAWANG = 54;
var MINPOINT = 3;
var KPOINT = 13;
var APOINT = 14;
var ZHUPOINT = 15;

var ZHU_FU_TD_TYPE = 4;// 主副同打花色

// 54张
PokerXinZhouSanDaEr.prototype.randomCards = function(areaSelectMode, tData) {
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
PokerXinZhouSanDaEr.prototype.calPoint = calPoint;

function calPointBySDR(num, twoIsChangZhu, zhuColorType) {
    if (!num) {
        return -1;
    }
    var ceilNum = Math.ceil(num / 4);
    if (ceilNum == 1) {
        return APOINT; // A记为14
    }
    if (zhuColorType != ZHU_FU_TD_TYPE && twoIsChangZhu && ceilNum == ZHUPAI) {
        return ZHUPOINT; // 主牌记为15
    }
    if (ceilNum > KPOINT) {
        return num; // 大小王原数字返回53、54
    }
    return ceilNum;
};
PokerXinZhouSanDaEr.prototype.calPointBySDR = calPointBySDR;

// 0:方块  1:梅花  2:梅花  3:黑桃
PokerXinZhouSanDaEr.prototype.calColor = function (card, zhuColorType) {
    return card >= XIAOWANG ? zhuColorType : ((card + 3) % 4);
};

PokerXinZhouSanDaEr.prototype.calColorSDR = function (card, zhuColorType, twoIsChangZhu) {
    if (card >= XIAOWANG) {
        return zhuColorType;
    } else if (calPointBySDR(card, twoIsChangZhu, zhuColorType) == ZHUPOINT) {
        return zhuColorType
    } else {
        return (card + 3) % 4;
    }
};

/**
 * 计算牌型
 * @param {array} cards 按点数排好序的牌
 * @return {CARDTPYE} 牌型，-1 = 不成型
 */
PokerXinZhouSanDaEr.prototype.calType = function(cards) {
    return this.isPutlegitimate(cards) ? CARDTPYE.danpai: -1;
};

// 叫的分是否合法
PokerXinZhouSanDaEr.prototype.isJiaoFenlegitimate = function (jiaoFen, tData) {
    if (jiaoFen == -1) {
        return !tData.mustJiao;
    }
    if (jiaoFen > MAX_JIAO_FEN || jiaoFen < MIN_JIAO_FEN) { return false; }

    return jiaoFen > tData.jiaoFen && jiaoFen % 5 == 0;
};

// 下一个叫分的人
PokerXinZhouSanDaEr.prototype.getNextJiaoFenIndex = function (tb) {
    var tData = tb.tData;
    if (tData.jiaoFen == MAX_JIAO_FEN) { return -1; }

    for(var i = 1; i < tData.maxPlayer; i++) {
        var nextIndex = (tData.curPlayer + i) % tData.maxPlayer;
        if ( tb.getPlayer(tData.uids[nextIndex]).jiaoFen == 0) { return nextIndex; }
    }

    return -1
};

// 获取叫分级数
PokerXinZhouSanDaEr.prototype.getJiOfJiaoFen = function (jiaoFen, zhuaScore, isZhuangKouDi) {
    if (jiaoFen < MIN_JIAO_FEN || jiaoFen > MAX_JIAO_FEN) {
        return 0;
    }
    var ji = Math.floor((jiaoFen - MIN_JIAO_FEN)/5) + 1;
    if (!isZhuangKouDi || zhuaScore == 0 || jiaoFen == MAX_JIAO_FEN) {
        ji = ji * 2;
    }
    return ji
};

// 检查是否所有玩家都不叫
PokerXinZhouSanDaEr.prototype.isAllPlayerNoJiao = function (tb) {
    var tData = tb.tData;
    if (tData.jiaoFen >= MIN_JIAO_FEN) { return false; }
    for(var i = 0; i < tData.maxPlayer; i++) {
        var idx = (tData.curPlayer + i) % tData.maxPlayer;
        if ( tb.getPlayer(tData.uids[idx]).jiaoFen > -1) { return false; }
    }
    return true;
};

// 选择的牌是否合法  叫100，JQKA大小王，叫小于100，JQKA，排除主花色
PokerXinZhouSanDaEr.prototype.isChooseCardlegitimate = function (card, tData) {
    if (card < XIAOWANG) {
        if (this.calColor(card, tData.zhuPaiType) == tData.zhuPaiType) { return false;} // 不能和主花色同花色
        var point = calPointBySDR(card, tData.areaSelectMode["twoIsChangZhu"], tData.zhuPaiType);
        if (point < CHOOSE_MIN_POINT || point > APOINT) { return false; }
    } else {
        if (tData.jiaoFen != MAX_JIAO_FEN) { return false; }
    }
    return true;
};

// 出牌是否合法，判断传进来的牌是否合法
PokerXinZhouSanDaEr.prototype.isCardlegitimate = function (cards) {
    return cards != null && typeof(cards) !='undefined' && cards.length != 0;
};

// 出牌是否合法，只能出单牌
PokerXinZhouSanDaEr.prototype.isPutlegitimate = function (cards) {
    return this.isCardlegitimate(cards) && cards.length == PDK_CARDCOUNT[CARDTPYE.danpai];
};

// 获取本轮第一次出的牌
PokerXinZhouSanDaEr.prototype.getRoundCardsByUid = function(putCardsRecord, uid, maxPlayNum) {
    if(!putCardsRecord || typeof putCardsRecord == 'undefined') {
        return null;
    }

    var roundPutCards = putCardsRecord[putCardsRecord.length - 1];
    if(!roundPutCards || typeof roundPutCards == 'undefined') {
        return null;
    }
    if(maxPlayNum > 0 && Object.keys(roundPutCards).length == maxPlayNum) {
        return null;
    }
    return roundPutCards[uid];
};

// 获取剩余的牌，假如要删除的牌不在手牌中则返回 null
PokerXinZhouSanDaEr.prototype.getRemianCards = function(oHands, cards) {
    if(!this.isCardlegitimate(cards)) return null;
    if(!this.isCardlegitimate(oHands)) return null;

    var hands = oHands.slice();
    for (var i = 0; i < cards.length; i++) {
        var p = hands.indexOf(cards[i]);
        if (p >= 0) {
            hands.splice(p, 1);
        } else {
            return null; // 手里没有这些牌
        }
    }

    return hands;
};

// 牌不同一种花色 -1, 同一种花色 0:方块 1:梅花 2：红桃 3:黑桃 主牌算作主花色
PokerXinZhouSanDaEr.prototype.getCardListColor = function(cards, zhuColorType, twoIsChangZhu) {
    // 只有单牌
    if (cards.length != PDK_CARDCOUNT[CARDTPYE.danpai]) { return -1;}
    return this.calColorSDR(cards[0], zhuColorType,twoIsChangZhu);
};

// 检查相同花色是否有足够的牌可以出
PokerXinZhouSanDaEr.prototype.isEnoughColorToPut = function (hands, firstColorType, zhuColorType, twoIsChangZhu) {
    if (!this.isCardlegitimate(hands)) return false;
    var oHands = hands.slice();
    for (var i = 0; i < oHands.length; i++) {
        if (this.calColorSDR(oHands[i], zhuColorType, twoIsChangZhu) == firstColorType) {
            return true;
        }
    }
     return false;
 };

// 检测是否能出牌
PokerXinZhouSanDaEr.prototype.checkPut = function(hand, pOutCards, firstPutCards, tData) {
    if (!this.isPutlegitimate(pOutCards)) {
        // 忻州三打二只能出单牌，出牌数不符合
        return null;
    }

    var oHands = hand.slice();
    if (!this.isCardlegitimate(oHands)) return null;
    var outCards = pOutCards.slice();
    var hands = this.getRemianCards(oHands, outCards);
    if (hands == null) return null;

    if (this.isCardlegitimate(firstPutCards)){
        // 压牌, 首出牌不用判断
        var cardColorType = this.getCardListColor(outCards, tData.zhuPaiType, tData.areaSelectMode["twoIsChangZhu"]);
        var firstColorType = this.getCardListColor(firstPutCards, tData.zhuPaiType, tData.areaSelectMode["twoIsChangZhu"]);
        if (firstColorType != cardColorType && this.isEnoughColorToPut(oHands, firstColorType, tData.zhuPaiType, tData.areaSelectMode["twoIsChangZhu"])) {
            return null; // 出的牌是不同花色，手牌却有相同的花色
        }
    }

    return hands;
};

// 检查是否出来选择的朋友牌
PokerXinZhouSanDaEr.prototype.isPutFriendCard = function (pOutCards, friendCard) {
    if (!this.isPutlegitimate(pOutCards)) { return false; }
    return pOutCards[0] == friendCard;
};

// 根据牌二维数组，计算所有的牌的分数
PokerXinZhouSanDaEr.prototype.calPointByCardsArr = function (roundCards, tData) {
    if (!roundCards || typeof(roundCards) == 'undefined') return 0;

    var oneRoundCards = [];
    var score = 0;
    for(var i in roundCards) {
        oneRoundCards = oneRoundCards.concat(roundCards[i]);
    }

    for(var j in oneRoundCards) {
        score = score + this.getCardFen(oneRoundCards[j], tData);
    }
    return score;
};

// 获取本轮最大的牌， 同样牌型，主牌大于副牌
PokerXinZhouSanDaEr.prototype.getMaxCardPlayerUid = function(roundPutCards, tData) {
    var frontUid = -1;
    if(!roundPutCards || typeof roundPutCards == 'undefined') {
        return frontUid;
    }

    var index = tData.uids.indexOf(tData.firstPutCardUid);
    var maxIdx = -1;
    for(var i=0; i<tData.uids.length; i++) {
        index = index % tData.uids.length;
        var uid = tData.uids[index];
        if(frontUid > 0) {
            var tmpcards = roundPutCards[frontUid];
            var cards = roundPutCards[uid];
            if(cards && tmpcards && this.isBigger(tmpcards, cards, tData.zhuPaiType, tData.areaSelectMode["twoIsChangZhu"])) {
                frontUid = parseInt(uid);
                maxIdx = index;
            }
        } else {
            frontUid = parseInt(uid);
            maxIdx = index;
        }
        index++;
    }
    return frontUid;
};

/**
 * 牌是否能压上
 * @return oLastCards 比 beiYaCards 大为true
 */
PokerXinZhouSanDaEr.prototype.isBigger = function(beiYaCards, oLastCards, zhuColorType,twoIsChangZhu) {
    var cardsType = this.calType(beiYaCards);
    if (cardsType == -1){
        return true;
    } else if ( this.calType(oLastCards) == -1) {
        return false;
    }

    var beiYaColor = this.getCardListColor(beiYaCards, zhuColorType, twoIsChangZhu);
    var lastColor = this.getCardListColor(oLastCards, zhuColorType, twoIsChangZhu);
    if (beiYaColor == lastColor) {
        var p1 = calPointBySDR(beiYaCards[0],twoIsChangZhu, zhuColorType);
        var p2 = calPointBySDR(oLastCards[0],twoIsChangZhu, zhuColorType);
        if (p1 == p2 && p2 == ZHUPOINT) {
            return this.calColor(oLastCards[0], zhuColorType) == zhuColorType;
        } else {
            return p2 > p1;
        }
    } else {
       return lastColor == zhuColorType;
    }
};

/**
 * 计算牌型点数
 * @return {number}
 */
PokerXinZhouSanDaEr.prototype.calCardsValue = function(cards, tData) {
    if (!this.isPutlegitimate(cards)) { return -1; }
    return calPointBySDR(cards[0], tData.areaSelectMode["twoIsChangZhu"], tData.zhuPaiType);
};

PokerXinZhouSanDaEr.prototype.isZhuangWinWithScore = function (tData, zhuaScore) {
    return (tData.jiaoFen + zhuaScore) <= MAX_JIAO_FEN;
};

/**
 * 提示可出的牌
 * @param  {array} oHands 用来压牌的手牌
 * @param  {array} oBeiYaCard 被压的牌
 * @return {array} 提示的牌
 */
PokerXinZhouSanDaEr.prototype.tipCards = function(oHands, oBeiYaCard, zhuColorType, tData) {
    // 如果不需要压牌， 可以任意出牌
    if(!this.isCardlegitimate(oBeiYaCard)) {
        return [oHands];
    } else {
        var rets = [];
        var hands = oHands.slice();
        hands = this.sortHandCards(hands, zhuColorType,tData);
        if (!this.isCardlegitimate(hands)) {
            return rets;
        }

        var firstColorType = this.getCardListColor(oBeiYaCard, zhuColorType, tData.areaSelectMode["twoIsChangZhu"]);
        var isEnough = this.isEnoughColorToPut(hands, firstColorType,zhuColorType,tData.areaSelectMode["twoIsChangZhu"]);
        var len = hands.length;
        for (var i = len-1; i >= 0; i--) {
            var tmp = hands[i];
            if (!isEnough || this.calColorSDR(tmp, zhuColorType, tData.areaSelectMode["twoIsChangZhu"]) == firstColorType) {
                rets.push([tmp])
            }
        }
        return rets;
    }
};

/**
 * 对手牌从大到小排序 (主牌、红桃、黑桃、方块、梅花)
 * @param {array}
 * @param {number} zhuColorType 主牌花色
 */
PokerXinZhouSanDaEr.prototype.sortHandCards = function(oCards, zhuColorType, tData) {
    var hands = oCards.slice();
    var cards = [];
    if (!this.isCardlegitimate(hands)) {
        return cards;
    }
    var color0 = []; // 0:方块  1:梅花  2:梅花  3:黑桃
    var color1 = [];
    var color2 = [];
    var color3 = [];
    
    for (var i = 0; i < hands.length; i++) {
        var tmpColor = this.calColorSDR(hands[i], zhuColorType, tData.areaSelectMode["twoIsChangZhu"]);
        if (tmpColor == zhuColorType) {
            cards.push(hands[i]);
        } else if (tmpColor == 3) {
            color3.push(hands[i])
        } else if (tmpColor == 2) {
            color2.push(hands[i])
        } else if (tmpColor == 1) {
            color1.push(hands[i])
        } else if (tmpColor == 0) {
            color0.push(hands[i])
        }
    }

    var twoIsChangZhu = tData.areaSelectMode["twoIsChangZhu"];
    this.sortCardsForColor(cards,twoIsChangZhu,zhuColorType);
    this.sortCardsForColor(color3,twoIsChangZhu,zhuColorType);
    this.sortCardsForColor(color2,twoIsChangZhu,zhuColorType);
    this.sortCardsForColor(color1,twoIsChangZhu,zhuColorType);
    this.sortCardsForColor(color0,twoIsChangZhu,zhuColorType);
    cards = cards.concat(color3);
    cards = cards.concat(color2);
    cards = cards.concat(color1);
    cards = cards.concat(color0);

    return cards;
};


PokerXinZhouSanDaEr.prototype.sortCardsForColor = function (colorCards, twoIsChangZhu,zhuColorType) {
    var n = colorCards.length;
    var i, j;
    for (i = n-1; i > 0; i--) {
        for (j=0; j<i; j++) {
            var p1 = calPointBySDR(colorCards[j],twoIsChangZhu, zhuColorType);
            var p2 = calPointBySDR(colorCards[j+1],twoIsChangZhu, zhuColorType);
            if (p1 <= p2) {
                if (p1 == p2 && p2 == ZHUPOINT) {
                    var c1 = this.calColor(colorCards[j], zhuColorType);
                    var c2 = this.calColor(colorCards[j+1], zhuColorType);
                    if (c1 == zhuColorType || c1 > c2) { continue; }
                }
                var tmp = colorCards[j];
                colorCards[j] = colorCards[j+1];
                colorCards[j+1] = tmp;
            }
        }
    }
};

// 判断此牌是否是主花
PokerXinZhouSanDaEr.prototype.isZhuCard = function(num, zhuColorType, twoIsChangZhu) {
    if(zhuColorType == 4)
    {
        return false;
    }
    return this.calColorSDR(num, zhuColorType, twoIsChangZhu) == zhuColorType;
};

PokerXinZhouSanDaEr.prototype.isAllZhuCard = function(cards, zhuColorType,twoIsChangZhu) {
    for (var i = 0; i < cards.length; i++) {
        if(!this.isZhuCard(cards[i], zhuColorType,twoIsChangZhu)){
            return false;
        }
    }
    return true;
};

PokerXinZhouSanDaEr.prototype.getRoundFirstCards = function(putCardsRecord, uid, maxPlayNum) {
    if(!putCardsRecord || typeof putCardsRecord == 'undefined') {
        return null;
    }

    var roundPutCards = putCardsRecord[putCardsRecord.length - 1];

    if(!roundPutCards || typeof roundPutCards == 'undefined') {
        return null;
    }
    if(Object.keys(roundPutCards).length == maxPlayNum) {
        return null;
    }
    return roundPutCards[uid];
};

// 获得牌的分  非分牌返回0分 
PokerXinZhouSanDaEr.prototype.getCardFen = function(num) {
    var cardValue = this.calPoint(num);
    var cfg = {'5': 5,  '10': 10,  '13': 10};
    return cfg[cardValue] || 0;
};


// 牌点比较函数
PokerXinZhouSanDaEr.prototype.cardValueCmp = function(a, b) {
    var pa = this.calPoint(a);
    var pb = this.calPoint(b);
    if (pa == pb)
        return a - b;

    return pa - pb;
};


// 求出牌型
PokerXinZhouSanDaEr.prototype.cardsType = function(oCards, zhuColorType) {
    if (oCards) {
        return this.calType(oCards, zhuColorType);
    }
    return -1;
};

PokerXinZhouSanDaEr.prototype.getAllCardFen = function() {
    return 100; // 10 * 4 + 10 * 4 + 5 * 4
};



if(typeof(module)!="undefined" && module.exports)    
    module.exports = PokerXinZhouSanDaEr;

if(typeof(MjClient)!="undefined")
    MjClient.poker_XinZhouSanDaEr = new PokerXinZhouSanDaEr();

})();