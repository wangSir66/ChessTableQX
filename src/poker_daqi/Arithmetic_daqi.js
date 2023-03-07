//跑得快算法类
(function() {
function PokerDaQi() {
    this.handCount = 21;
    this.laiziCard = -1;

    this.cardCfg = {};
    // key:常主牌值  value:相对主牌的牌值大小 14:小王 15:大王
    this.cardCfg.changZhuByPoint = {2:1, 7:2, 14:3, 15:4};
    this.cardCfg.fk = {};
    this.cardCfg.mh = {};
    this.cardCfg.hx = {};
    this.cardCfg.ht = {};
    this.cardCfg.jokerBlack = 53;
    this.cardCfg.jokerRed = 54;
    for(var i=1; i<=52; i++ ){
        // 0:方块  1:梅花  2:红心  3:黑桃
        var cardType = (i + 3) % 4;
        // 牌值 1 - 13
        var cardValue = Math.ceil(i / 4);
        if(0 == cardType) this.cardCfg.fk[cardValue] = i;
        if(1 == cardType) this.cardCfg.mh[cardValue] = i;
        if(2 == cardType) this.cardCfg.hx[cardValue] = i;
        if(3 == cardType) this.cardCfg.ht[cardValue] = i;
    }

    this.fkZhu = 0;
    this.mhZhu = 1;
    this.hxZhu = 2;
    this.htZhu = 3;
    this.wuZhu = 4;
}

if(typeof(cc)=='undefined') {
    var cc = function(){}
    cc.log = function(){
        var str = '';
        for (var i=0; i<arguments.length; i++){
            str  = str + arguments[i] + ' ';
        }
        console.log( str );
    }
}

var PDK_CARDTPYE = {
    liandui: 5,
    duizi: 2,
    danpai: 1,
};
PokerDaQi.prototype.CARDTPYE = PDK_CARDTPYE;
var PDK_CARDCOUNT = {};
PDK_CARDCOUNT[PDK_CARDTPYE.liandui] = 4;
PDK_CARDCOUNT[PDK_CARDTPYE.duizi] = 2;
PDK_CARDCOUNT[PDK_CARDTPYE.danpai] = 1;

var DAWANG = 54;    // 大王
var XIAOWANG = 53; // 小王
// var JIAO_ZHU_POINT = 16;// 7
// var ZHUPOINT = 15;  // 2
// var APOINT = 14;
var KPOINT = 13;

// 1 - 52  方块A:1 梅花A:2 红心A:3 黑桃A:4 -- 黑桃王:52
// 1.16张玩法为现有的没有大小王、只有一个2、三个A的玩法 一共48张
// 2.15张玩法：在16张的基础上，再去掉两个A（剩红桃A）、一个K（去掉黑桃K），一共45张
PokerDaQi.prototype.randomCards = function(areaSelectMode, tData) {
    var cards = [];
    // 去掉3、4
    for (var i = 1; i <= 54; i++) {
        if( this.calPoint(i) != 3 && this.calPoint(i) != 4 )
            cards.push(i);
    }

    // 两幅扑克牌
    cards = cards.concat(cards);

    // 洗牌
    shuffleArray(cards);

    return cards;
};

function transformCard_daqi(num) {
    var tData = MjClient.data.sData.tData;
    if (num == tData.mcTransValue) {
        return tData.mingCard;
    }else{
        return num;
    }
}

//将牌中明牌的值转换为真实牌值
function transformCardArray_daqi(oCards){
    var cards = [];
    var tData = MjClient.data.sData.tData;
    for (var i = 0; i < oCards.length; i++) {
        if (oCards[i] == tData.mcTransValue) {
            cards.push(tData.mingCard);
        }else{
            cards.push(oCards[i]);
        }
    }
    return cards;
}

PokerDaQi.prototype.cardlog = function(cards, zhuColorType) {
    var col = ["a", "b", "c", "d"]; // 方块 梅花 红心 黑桃
    var str = "";
    for(var i in cards) {
        var card = cards[i];
        var color = this.calColor_daqi(card);
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
PokerDaQi.prototype.countWinType = function(jiaofen, PfenPaiArr, isTouXiang, Pkoudifen) {
    Pkoudifen = Pkoudifen || 0;
    var defen = this.getAllCardFen( PfenPaiArr ) + Pkoudifen;
    var difffen = defen - jiaofen;
    var winType = 0;

    // 大光 每个闲家-3
    if(difffen < 0 && defen == 0 )
    {
        winType = -3;
    } 
    // 小光 每个闲家-2
    else if ( difffen < 0 && defen < 30)
    {
        winType = -2;
    }
    // 过庄 每个闲家-1
    else if ( difffen < 0 )
    {
        winType = -1;
    }
    // 跨庄 每个闲家+1
    else if( difffen >= 0 && difffen < 40)
    {
        winType = 1;
    }
    // 小倒 每个闲家+2
    else if( difffen >= 0 && difffen < 70)
    {
        winType = 2;
    }
    // 大倒 每个闲家+3
    else if( difffen >= 0 )
    {
        winType = 3;
    }

    if( isTouXiang )
    {
        winType = 4;
    }

    return winType;
}

PokerDaQi.prototype.isWuZhu = function(zhuColorType) {
    if(zhuColorType == -1 || zhuColorType ==4 ) {
        return true;
    } else {
        return false;
    }
}

// 计算牌点数 1 2 3 4 5 6 7 8 9 10 11 12 13   14:小王  15:大王
PokerDaQi.prototype.calPoint = function(num) {
    if (!num) return -1;

    num = transformCard_daqi(num);
    var point = Math.ceil(num / 4);
    if(num == this.cardCfg.jokerRed) point = 15;
    if(num == this.cardCfg.jokerBlack) point = 14;
    return point;
};

// zhuColorType 主花花色，没选主花时为-1， 不为空时， 牌值根据zhuColorType计算大小(0:方块  1：梅花 2：红心 3：黑桃)
PokerDaQi.prototype.calPointBySdh = function(num, zhuColorType) {
    if (!num) return -1;
    num = transformCard_daqi(num);

    var point = this.calPoint(num);
    var color = this.calColor_daqi(num);

    // 是否无主
    if( this.isWuZhu(zhuColorType) ) {
        var pointToSdh = {3:1, 4:2, 5:3, 6:4, 8:5, 9:6, 10:7, 11:8, 12:9, 13:10, 1:11, 2:12, 7:13, 14:14, 15:15};
        var sdhPoint = pointToSdh[point];
        return sdhPoint;

    // 有选主
    } else {

        var pointToSdh = {3:1, 4:2, 5:3, 6:4, 8:5, 9:6, 10:7, 11:8, 12:9, 13:10, 1:11, 2:[12, 13], 7:[14, 15], 14:16, 15:17};
        var sdhPoint = pointToSdh[point];

        // 如果是2，7主牌， 区分副主和选主
        if(point == 2 || point == 7) {
            // 如果是选主
            if(color == zhuColorType) {
                sdhPoint = sdhPoint[1];
            } else {
                sdhPoint = sdhPoint[0];
            }
        }

        // 主花点数比非主花大
        if(color == zhuColorType || this.cardCfg.changZhuByPoint[point]) {
            sdhPoint += 100;
        }

        return sdhPoint;
    }
}

//计算颜色
function calColor_daqi(num) {
    if (!num) return -1;
    num = transformCard_daqi(num);
    // 0:方块  1:梅花  2:梅花  3:黑桃
    if (num == DAWANG || num == XIAOWANG) {
        return -1;
    }
    var cardType = (num + 3) % 4;
    return cardType;
}

// 牌的花色0
PokerDaQi.prototype.calColor_daqi = calColor_daqi;

// 返回此牌花色， 如果是主花， 返回主花(不返回原花色)
PokerDaQi.prototype.calColor_daqiSdh = function(num, zhuColorType) {
    if (!num) return -1;
    num = transformCard_daqi(num);
    // 0:方块  1:梅花  2:红心  3:黑桃 4:主花
    var cardType = -1;
    if(this.isZhuCard(num, zhuColorType)) {
        cardType = 4;
    } else {
        cardType = (num + 3) % 4;
    }
    return cardType;
}

// 判断此牌是否是主花
PokerDaQi.prototype.isZhuCard = function(num, zhuColorType) {
    var point = this.calPoint(num);
    var color = this.calColor_daqi(num);

    if( color == zhuColorType || this.cardCfg.changZhuByPoint[point] )
    {
        return true;
    } else {
        return false;
    }
}

// 判断出牌是否都是主牌
PokerDaQi.prototype.isAllZhuCard = function(cards, zhuColorType) {
    for (var i = 0; i < cards.length; i++) {
        if(!this.isZhuCard(cards[i], zhuColorType)){
            return false;
        }
    }
    return true;
}

PokerDaQi.prototype.getRoundFirstCards = function(putCardsRecord, uid, maxPlayNum) {
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
}

PokerDaQi.prototype.getRoundCardsByUid = function(putCardsRecord, uid, maxPlayNum) {
    if(!putCardsRecord || typeof putCardsRecord == 'undefined') {
        return null;
    }

    var roundPutCards = putCardsRecord[putCardsRecord.length - 1];

    if(!roundPutCards || typeof roundPutCards == 'undefined') {
        return null;
    }

    return roundPutCards[uid];
}

// 获取本轮(或到当前玩家)最大的牌， 同点数先出比后出的大 添加currentUid 当前打牌者玩家id
PokerDaQi.prototype.getMaxCardPlayerUid = function(roundPutCards, firstPutUid, uids, zhuColorType, currentUid) {
    var frontUid = -1;
    if(!roundPutCards || typeof roundPutCards == 'undefined') {
        return frontUid;
    }

    var index = uids.indexOf(firstPutUid);
    for(var i=0; i<uids.length; i++) {
        index = index % uids.length;
        var uid = uids[index];
        if(frontUid > 0) {
            var tmpcards = roundPutCards[frontUid];
            var cards = roundPutCards[uid];
            if(cards && tmpcards && this.isBigger(tmpcards, cards, zhuColorType) > 0) {
                frontUid = parseInt(uid);
            }
        } else {
            frontUid = parseInt(uid);
        }

        if(currentUid && uid == currentUid){//找到从首玩家到当前玩家中最大的牌的玩家 则直接返回
            return frontUid;
        }
        index++
    }

    return frontUid;
}

PokerDaQi.prototype.getAllCardFen = function( fenPaiArr ) {
    var fen = 0;
    for(var i in fenPaiArr) {
        var card = fenPaiArr[i];
        fen += this.getCardFen(card);
    }
    return fen;
}

// 获得牌的分  非分牌返回0分 
PokerDaQi.prototype.getCardFen = function(num) {
    var cardValue = this.calPoint(num);
    var cfg = {'5': 5,  '10': 10,  '13': 10}
    return cfg[cardValue] || 0;
}

// 获取所有对应牌数的拖拉机组合
PokerDaQi.prototype.getLianDuiCards = function(oCards, cardNum, zhuColorType) {
    if(oCards.length < cardNum) return false;
    var resCards = [];
    oCards.sort(this.cardRealPointCmp);
    for(var i=0; i < oCards.length - cardNum + 1; i++) {
        var cards = oCards.slice(i, i + cardNum);
        if( this.isLiandui(cards, zhuColorType) ) 
            resCards.push(cards);
    }

    if(resCards.length > 0) {
        cc.log("--------------resCards.length--------------"+resCards.length);
        return resCards;
    } else {
        cc.log("--------------resCards.length----oCards----------"+JSON.stringify(oCards));
        return false;
    }
}

// 获取所有对应牌数的拖拉机组合
PokerDaQi.prototype.getDuiZis = function(oCards, zhuColorType) {
    if(oCards.length < 2) return false;
    var resCards = [];
    for(var i=0; i < oCards.length - 1; i++) {
        var cards = oCards.slice(i, i + 2);
        if( this.isDuizi(cards) ) 
            resCards.push(cards);
    }

    if(resCards.length > 0) {
        return resCards;
    } else {
        return false;
    }
}

PokerDaQi.prototype.countDuiNum = function(oCards, zhuColorType) {
    var num = 0;
    var cardNumByValue = {};
    for(var i in oCards){
        var cardValue = this.calPointBySdh(oCards[i], zhuColorType);
        var cardValue = oCards[i];
        if(!cardNumByValue[cardValue]){
            cardNumByValue[cardValue] = 1;  
        } else {
            cardNumByValue[cardValue]++;
            if(cardNumByValue[cardValue] % 2 == 0)
                num++;
        }
    }

    return num;
}

// 计算真实的点
function calRealPoint_daqi(num) {
    if (!num) {
        return -1;
    }
    num = transformCard_daqi(num);
    var ceilNum = Math.ceil(num / 4);

    if (ceilNum > KPOINT) {
        return num; // 大小王原数字返回53、54
    }
    return ceilNum;
}

//真实牌点 真实花色排序 比较函数 A==1 2==2 7==7 的排序
PokerDaQi.prototype.cardRealPointCmp = function(a, b) 
{
    var ca = calColor_daqi(a);
    var cb = calColor_daqi(b);

    var pa = calRealPoint_daqi(a);
    var pb = calRealPoint_daqi(b);

    if(ca == cb){
        if(pa == pb){
            return a - b;
        }
        return pa - pb;
    }else{
        return cb - ca
    }
}

/**
 * 判断是否是连对
 * @param {array} pCards 按点数排好序的牌
 * @return {bool}
 */
PokerDaQi.prototype.isLiandui = function(pCards, zhuColorType) { //pCards
    var cardNum = PDK_CARDCOUNT[PDK_CARDTPYE.liandui];// 连对最小牌数

    if(!pCards || pCards.length < cardNum || pCards.length % 2 != 0){
        return false;
    }   

    var oCards = transformCardArray_daqi(pCards);

    // if (oCards[oCards.length-1] >= XIAOWANG)
    //     return false;

    //按真实点数排序
    oCards.sort(this.cardRealPointCmp);
    var cardCount = oCards.length;
    var points = [];
    var colors = [];
    var colorsSdh = [];
    for (var i = 0; i < oCards.length; i++) {
        points.push(calRealPoint_daqi(oCards[i]));
        colors.push(this.calColor_daqi(oCards[i]));
        colorsSdh.push(this.calColor_daqiSdh(oCards[i], zhuColorType));
    }
    for(var i=0; i < cardCount - 1; i++) {
        // 判断对子
        if (i % 2 == 0 && (points[i] != points[i + 1] || colors[i] != colors[i + 1] ) ) 
        {
            console.log('no liandui-1 i:', i, points[i], points[i+1])
            return false; 
        }

        // 判断连对
        if(i % 2 == 1 && Math.abs(points[i] - points[i+1]) != 1 && Math.abs(points[i] - points[cardCount - 1]) != 12) 
        {
            console.log('no liandui-2 i:', i, points[i], points[i+1])
            return false; 
        }

        if( colorsSdh[i] != colorsSdh[i+1] || colors[i] != colors[i + 1]) return false;
    }

    return true;
};

PokerDaQi.prototype.isDuizi = function(pCards) {
    var points = [];
    var colors = [];

    var oCards = transformCardArray_daqi(pCards);
    for (var i = 0; i < oCards.length; i++) {
        points.push(calRealPoint_daqi(oCards[i]));
        colors.push(this.calColor_daqi(oCards[i]));
    }

    if (points[0] != points[1] || colors[0] != colors[1]){
        return false; 
    }else{
        return true;
    }
}

/**
 * 计算牌型
 * @param {array} cards 按点数排好序的牌
 * @return {PDK_CARDTPYE} 牌型，-1 = 不成型
 */
PokerDaQi.prototype.calType = function(cards, zhuColorType) {
    var cardCount = cards.length;

    // 连对，2对起
    if (cardCount >= PDK_CARDCOUNT[PDK_CARDTPYE.liandui]  && this.isLiandui(cards, zhuColorType))
        return PDK_CARDTPYE.liandui;

    // 对子
    if (cardCount == 2 && this.isDuizi(cards) )
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
PokerDaQi.prototype.calCardsValue = function(cards, zhuColorType) {
    if (!cards || cards.length == 0)
        return -1;

    var lastCard = cards[cards.length - 1];

    return this.calPointBySdh(lastCard, zhuColorType);
};

// // 牌点比较函数
PokerDaQi.prototype.cardValueCmp = function(a, b, zhuColorType) {
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
PokerDaQi.prototype.isBigger = function(beiYaCards, oLastCards, zhuColorType) {

    var cardsType = this.calType(beiYaCards, zhuColorType);

    if (cardsType == -1){
        return -1;
    } else if ( !oLastCards || typeof oLastCards == 'undefined' || oLastCards.length == 0) {
        return 1;
    }

    // 同花色 或 是主牌 才能比较点数
    var beiYaCardsColor = this.calColor_daqiSdh(beiYaCards[0], zhuColorType);
    var oLastCardsColor1 = this.calColor_daqiSdh(oLastCards[0], zhuColorType);
    var oLastCardsColor2 = this.calColor_daqiSdh(oLastCards[oLastCards.length - 1], zhuColorType);
    // 如果提起的牌 花色不全相同  或 和被压牌不相同 并 不是主牌 点数比被压牌小
    if(oLastCardsColor1 != oLastCardsColor2 || (oLastCardsColor1 != beiYaCardsColor && oLastCardsColor1 != 4) ) {
        return -1;
    }

    var lastCardsType = this.calType(oLastCards, zhuColorType);
    if (cardsType == lastCardsType ) {
        var beiYaTypeValue = 0;
        var lastTypeValue = 0;
        if (cardsType == PDK_CARDTPYE.liandui){//如果是连对
            beiYaCards.sort(this.cardRealPointCmp);
            oLastCards.sort(this.cardRealPointCmp);
            beiYaTypeValue = calRealPoint_daqi(beiYaCards[beiYaCards.length - 1]);
            lastTypeValue = calRealPoint_daqi(oLastCards[oLastCards.length - 1]);
        }else{
            beiYaTypeValue = this.calCardsValue(beiYaCards, zhuColorType);
            lastTypeValue = this.calCardsValue(oLastCards, zhuColorType);
        }
        if(lastTypeValue > beiYaTypeValue) {
            return 1;
        }else if(lastTypeValue == beiYaTypeValue) {
            return 0;
        }else {
            return -1;
        } 
    }

    return -1;
}; 


PokerDaQi.prototype.checkPut = function(oHands, cards) {
    if(!cards || typeof(cards)=='undefined' || cards.length == 0) return null;
    if(!oHands || typeof(oHands)=='undefined' || oHands.length == 0) return null;

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
PokerDaQi.prototype.checkPutSdh = function(oHands, outCards, oBeiYaCard, zhuColorType, isCanShuaiPai) {
    if(!outCards || typeof(outCards)=='undefined' || outCards.length == 0) return null;
    if(!oHands || typeof(oHands)=='undefined' || oHands.length == 0) return null;

    var outCards = this.sortHandCards(outCards, zhuColorType);
    var hands = this.checkPut(oHands, outCards);
    if(hands == null)
        return null;

    // 首出牌， 同花色的 单张， 对子 连对
    if(!oBeiYaCard || oBeiYaCard.length <= 0) {
        var color = this.calColor_daqiSdh(outCards[0], zhuColorType);
        var colorcards = this.getColorCards(outCards, [color], zhuColorType);
        // 花色不是全部相同，不能打出
        if(colorcards.length != outCards.length) {
            return null;
        }

        // 甩牌 只能甩主牌
        if(isCanShuaiPai && color == 4) {
            return hands;
        }

        var outCardType = this.calType(outCards, zhuColorType);
        if( outCardType < 0) return null;

    // 检测是否打出同花色的牌
    } else if( oBeiYaCard && oBeiYaCard.length > 0 ) {
        var beiyaColor = this.calColor_daqiSdh(oBeiYaCard[0], zhuColorType);
        var handColorSameCards = this.getColorCards(oHands, [beiyaColor], zhuColorType);
        var handColorSameNum = handColorSameCards.length;
        var outCardsSameColorNum = this.getColorCards(outCards, [beiyaColor], zhuColorType).length;

        // 如果选择的牌是同花色， 有相同牌型需要打相同牌型， 牌型不够需要补牌， 没有牌型才能随意出
        if(outCards.length <= handColorSameNum &&  outCardsSameColorNum == outCards.length) {
            var oBeiYaType = this.calType(oBeiYaCard, zhuColorType);
            var outCardType = this.calType(outCards, zhuColorType);
            // 被压的是拖拉机，
            if(outCardType != oBeiYaType && oBeiYaType == PDK_CARDTPYE.liandui) {
                var needPutLianDui = false;
                var needPutDuiZi = false;

                var handColorSameCards = this.sortHandCards(handColorSameCards, zhuColorType)
                // 同花色的牌有拖拉机， 但是提起的不是拖拉机， 不能打出
                if( this.getLianDuiCards(handColorSameCards, oBeiYaCard.length, zhuColorType) && !this.isLiandui(outCards, zhuColorType) )
                    needPutLianDui = true;

                // 同花色的牌有对子， 但是没有提起对应的对子， 不能打出
                var duiNum = this.countDuiNum(handColorSameCards, zhuColorType);
                var needPutDuiZiNum = duiNum*2 > oBeiYaCard.length ? oBeiYaCard.length/2 : duiNum;
                var outDuiNum = this.countDuiNum(outCards, zhuColorType);
                if( outDuiNum < needPutDuiZiNum)
                    needPutDuiZi = true;

                if(needPutLianDui || needPutDuiZi)
                    return null;
            }

            // 被压的是对子
            if(outCardType != oBeiYaType && oBeiYaType == PDK_CARDTPYE.duizi ) {
                // 同花色的牌有对子， 但是提起的不是对子， 不能打出
                if( this.countDuiNum(handColorSameCards, zhuColorType) > 0 && !this.isDuizi(outCards))
                    return null;
            }

        }

        // 如果同花色的牌足够 
        if(outCards.length <= handColorSameNum &&  outCardsSameColorNum < outCards.length) {
            return null;
        }
        // 如果同花色的牌不够  没有提起所有花色， 不能出牌
        if(outCards.length > handColorSameNum && outCardsSameColorNum < handColorSameNum) {
            return null;
        }

        if( oBeiYaCard.length != outCards.length ) {
            return null;
        }

    } else {
        console.log('error PokerDaQi.prototype.checkPut', oHands, outCards, oBeiYaCard, zhuColorType);
        return null;
    }

    var sortCards = this.sortHandCards(outCards, zhuColorType)
    var sortLastCards = this.sortHandCards(oBeiYaCard, zhuColorType)

    return hands;

}



PokerDaQi.prototype.findCardByType = function(oHands, oBeiYaCard, zhuColorType) {
    if(!oBeiYaCard || typeof(oBeiYaCard)=='undefined') return [];

    var firstCardColor = this.calColor_daqiSdh(oBeiYaCard[0], zhuColorType);
    var handsColorCards = this.getColorCards(oHands, [firstCardColor], zhuColorType);

    if( handsColorCards.length >= oBeiYaCard.length ) {
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
PokerDaQi.prototype.tipCards = function(oHands, oBeiYaCard, zhuColorType) {
    // cc.log("----------------tipCards", oHands)
    // cc.log("----------------tipCards", oBeiYaCard)
    // cc.log("----------------tipCards", zhuColorType)
    // 如果不需要压牌， 可以任意出牌
    if(!oBeiYaCard) {
        return [oHands];
    }
    else {
        var firstCardColor = this.calColor_daqiSdh(oBeiYaCard[0], zhuColorType);
        var handsColorCards = this.getColorCards(oHands, [firstCardColor], zhuColorType);
        handsColorCards = this.sortHandCards(handsColorCards, zhuColorType).reverse();
        var beiyaType = this.calType(oBeiYaCard, zhuColorType)
        var tiparr = [];
        var cardNum = oBeiYaCard.length;
        this.cardlog(handsColorCards, zhuColorType);
        if( handsColorCards.length >= cardNum ) {
            // 压拖拉机
            if(beiyaType == PDK_CARDTPYE.liandui) {
                // 有拖拉机出拖拉机
                var lianduis = this.getLianDuiCards(handsColorCards, cardNum, zhuColorType);
                if( lianduis ) {
                    tiparr = tiparr.concat(lianduis);

                } else {
                    //没有拖拉机 提起最小的相同数量的牌
                    // for(var i=0; i < handsColorCards.length - cardNum + 1; i++) {
                    //     var sanpai = handsColorCards.slice(i, i + cardNum);
                    //     tiparr.push(sanpai);
                    // }
                    // 没有拖拉机出对子
                    var duizis = this.getDuiZis(handsColorCards, zhuColorType);
                    if( duizis ) {
                        if(duizis.length * 2 >= cardNum) {
                            for(var i = 0; i < (duizis.length - cardNum/2 + 1); i++) {
                                var tmpduizi = []
                                for(var j = 0; j < cardNum/2; j++) {
                                    tmpduizi = tmpduizi.concat(duizis[i+j]);
                                }
                                tiparr.push(tmpduizi);
                            }

                        // 对子不够 用单牌 (全同花色)
                        } else {
                            var tmpduizi = []
                            for(var i = 0; i < duizis.length; i++) {
                                tmpduizi = tmpduizi.concat(duizis[i]);
                            }
                            var delcard = this.delCards(handsColorCards, tmpduizi);
                            var needNum = cardNum - tmpduizi.length;
                            for(var i=0; i < delcard.length - needNum + 1; i++) {
                                var sanpai = delcard.slice(i, i + needNum);
                                tiparr.push(tmpduizi.concat(sanpai));
                            }
                        }

                    // 没有对子 用单牌
                    } else {
                        for(var i=0; i < handsColorCards.length - cardNum + 1; i++) {
                            var sanpai = handsColorCards.slice(i, i + cardNum);
                            tiparr.push(sanpai);
                        }
                    }
                }

            // 压对子 有对子出对子 没有对子出单牌 (全同花色)
            }
            else if (beiyaType == PDK_CARDTPYE.duizi) {
                var duizis = this.getDuiZis(handsColorCards, zhuColorType);
                if( duizis ) {
                    tiparr = tiparr.concat(duizis);
                } else {
                    for(var i=0; i < handsColorCards.length; i++) {
                        if (handsColorCards[i + 1])
                            tiparr.push([handsColorCards[i], handsColorCards[i+1]]);
                    }
                }
            // 有单牌 (全同花色)
            }
            else if(beiyaType == PDK_CARDTPYE.danpai) {
                for(var i = 0; i < handsColorCards.length; i++) {
                    if (i == 0 || tiparr[tiparr.length-1][0] != handsColorCards[i]) tiparr.push([handsColorCards[i]])
                }
            }
            return tiparr;

        // 同花色不够 用其他花色凑
        }
        else {
            var needNum = cardNum - handsColorCards.length;

            var delcard = this.delCards(oHands, handsColorCards);
            delcard = this.sortHandCards(delcard, zhuColorType).reverse();
            for(var i=0; i < delcard.length - needNum + 1; i++) {
                var sanpai = delcard.slice(i, i + needNum);
                tiparr.push(handsColorCards.concat(sanpai));
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
PokerDaQi.prototype.sortHandCards = function(oCards, zhuColorType) {
    if( !oCards || typeof oCards != 'object' ) return [];
    var cards = oCards.slice();
    var sortColors = []
    sortColors[0] = [0, 3, 2, 1];    // 主花为方：方黑红梅
    sortColors[1] = [1, 2, 3, 0];    // 主花为梅：梅红黑方
    sortColors[2] = [2, 3, 0, 1];    // 主花为红：红黑方梅
    sortColors[3] = [3, 2, 1, 0];    // 主花为黑：黑红梅方

    var fs = function(a, b) {
        var ca = this.calColor_daqi(a);
        var cb = this.calColor_daqi(b);
        var cza = this.calColor_daqiSdh(a, zhuColorType);
        var czb = this.calColor_daqiSdh(b, zhuColorType);

        if(cza != czb )
        {
            // 如果有选主，非主牌的排序 主牌==4
            if( !this.isWuZhu(zhuColorType) && cza != 4 && czb != 4 ){
                var sortcol = sortColors[zhuColorType];
                return sortcol.indexOf(ca) - sortcol.indexOf(cb);

            // 主牌排序
            } else {
                return czb - cza;
            }
        }

        var pa = this.calPointBySdh(a, zhuColorType);
        var pb = this.calPointBySdh(b, zhuColorType);

        if(pa == pb) {
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
PokerDaQi.prototype.findNSameCard = function(hands, point, n, zhuColorType) {
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
PokerDaQi.prototype.delPoint = function(hands, points){
    var arr = hands.slice();
    for(var i=0; i < points.length; i++){
        for (var j = 0; j < arr.length; j++) {
            var jp = this.calPointBySdh(arr[j], zhuColorType);
            if( jp == points[i] ){
                arr.splice(j, 1);
                j--;
            }
        }
    }
    return arr;
}

// 删除相同的牌(花色相同，牌值相同)
PokerDaQi.prototype.delCards = function(hands, cards) {
    if(!hands) return;
    var arr = hands.slice();
    for(var i=0; i < cards.length; i++){
        for (var j = 0; j < arr.length; j++) {
            if( arr[j] == cards[i] ){
                arr.splice(j, 1);
                j--;
            }
        }
    }
    return arr;
}

// 从牌组中获取指定花色
PokerDaQi.prototype.getColorCards = function(cards, colors, zhuColorType) {
    var arr = [];
    if(!cards || typeof(cards)=='undefined' || cards.length == 0) return arr;
    for(var i=0; i < cards.length; i++) {
        var num = cards[i];
        var color = this.calColor_daqiSdh(num, zhuColorType);
        if(colors.indexOf(color) >= 0) {
            arr.push(num);
        }
    }
    return arr;
}

PokerDaQi.prototype.formatCards = function(oCards, zhuColorType) {
    var info = {};
    // key:牌值  value:数量  (10有3张）
    info.mValueToNum = {};
    // key:数量  value:牌值  (3张的牌有10, K, 4)
    info.mNumToValue = {};

    var cds = this.sortHandCards(oCards, zhuColorType);
    info.cds = cds;

    for(var i in cds){
        var value = this.calPointBySdh(cds[i]);
        if( !info.mValueToNum[value] ) info.mValueToNum[value] = [];

        info.mValueToNum[value].push(cds[i]);
    }

    for(var i in cds){
        var value = this.calPointBySdh(cds[i]);
        var num = info.mValueToNum[value].length;

        if( !info.mNumToValue[num] ) info.mNumToValue[num] = [];

        if( info.mNumToValue[num].indexOf(value) < 0 )
            info.mNumToValue[num].push(value);
    }

    return info;
}

PokerDaQi.prototype.isSameCards = function(cards1, cards2, zhuColorType) {
    if(cards1.length != cards2.length) return false;
    var cds1 = this.sortHandCards(cards1, zhuColorType);
    var cds2 = this.sortHandCards(cards2, zhuColorType);

    for(var i in cds1){
        if(cds1[i] != cds2[i])
            return false;
    }

    return true;
}



// 求出牌型
PokerDaQi.prototype.cardsType = function(oCards, zhuColorType) {
    if (oCards) {
        return this.calType(oCards, zhuColorType);
    }
    return -1;
};


if(typeof(module)!="undefined" && module.exports)    
    module.exports = PokerDaQi;

if(typeof(MjClient)!="undefined")
    MjClient.poker_DaQi = new PokerDaQi();


// 方块:  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 1, 2
//      [ 9, 13, 17, 21, 25, 29, 33, 37, 41, 45, 49, 1, 5 ]

// 梅花:  3,  4,  5,  6,  7,  8,  9,  10, 11, 12, 13, 1, 2
//     [ 10, 14, 18, 22, 26, 30, 34, 38, 42, 46, 50, 2 , 6 ]

// 红心:  3,  4,  5,  6,  7,  8,  9,  10, 11, 12, 13, 1, 2
//     [ 11, 15, 19, 23, 27, 31, 35, 39, 43, 47, 51, 3, 7 ]
//     
// 黑桃:  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 1, 2
//     [ 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 4, 8 ]
//     

/*测试 * / 
var pdk = new PokerSanDaHa()
// console.log(pdk.cardCfg);
var c = pdk.cardCfg;
var cards = pdk.randomCards({handCardNum:0}, {maxPlayer:3});
// console.log(cards.length);
// console.log(cards.toString());
var handCards = [c.ht[12], c.ht[12], c.ht[11], c.ht[11], c.ht[10], c.ht[10], c.ht[9], c.ht[9], c.hx[6],c.hx[6], c.hx[5], c.mh[6], c.mh[6], c.mh[8], c.fk[8]]; // 有拖拉机
// var handCards = [ c.mh[7], c.hx[11]];
// var putCards = [c.ht[10], c.ht[10], c.hx[8], c.hx[8], c.hx[8], c.hx[7], c.hx[7], c.hx[7], c.hx[4], c.hx[4]];
var lastCards = [c.ht[10], c.ht[10], c.ht[11], c.ht[11]];   // 拖拉机
lastCards = [c.ht[10], c.ht[10]];   
lastCards = [c.hx[6], c.hx[6]];   
lastCards = [c.fk[6], c.fk[6]];   
var zhuPaiType = pdk.fkZhu;

handCards = [21,32,1,46,49,49,28,3,44,32,51,37,27,52 ]
lastCards = [17];
zhuPaiType = 0;
console.log('count', handCards.length);
pdk.cardlog(handCards, zhuPaiType);
console.log('count', lastCards.length);
pdk.cardlog(lastCards, zhuPaiType);
var tipcards = pdk.tipCards(handCards, lastCards, zhuPaiType);
console.log('tipcount', tipcards.length)
for(var i in tipcards) {
    pdk.cardlog(tipcards[i], zhuPaiType);
}
// console.log( pdk.calPointBySdh(c.fk[13], 0) );
// console.log( pdk.calPointBySdh(c.mh[5], 0) );
// console.log( pdk.calCardsValue([c.fk[2] ], zhuPaiType) );
// console.log( pdk.calCardsValue([c.mh[2] ], zhuPaiType) );

// 压牌测试
// var roundPutCards = {}
// var firstPutUid = 1;
// var uids = [1,2,3,4];
// roundPutCards = {
//     1:[c.fk[6], c.fk[6]], 
//     2:[c.fk[8], c.fk[5]], 
// }
// zhuPaiType = 0;
// roundPutCards = {
// 1:[ c.hx[8], c.hx[8], c.hx[9], c.hx[9] ],
// 2:[ c.hx[11], c.hx[11], c.hx[6], c.hx[6] ],
// 3:[ c.hx[7], c.hx[7], c.ht[2], c.ht[2] ], 
// 4:[ c.hx[2], c.mh[2], c.fk[2], c.fk[2] ], 
// }
// console.log( 'getMaxCardPlayerUid uid:', pdk.getMaxCardPlayerUid(roundPutCards, firstPutUid, uids, zhuPaiType) )

// 牌型检测
// var testcards = []
// zhuPaiType = 0;
// testcards.push([ c.hx[8], c.hx[8], c.hx[9], c.hx[9] ])
// testcards.push([ c.hx[11], c.hx[11], c.hx[6], c.hx[6] ])
// testcards.push([ c.hx[7], c.hx[7], c.ht[2], c.ht[2] ])  // 副7副2 不是拖拉机
// testcards.push([ c.hx[2], c.mh[2], c.fk[2], c.fk[2] ])  // 主2红心副2， 是拖拉机
// testcards.push([ c.mh[2], c.mh[2], c.ht[2], c.ht[2] ])  // 主2黑桃副2， 是拖拉机
// for(var i in testcards) {
//     var cards = testcards[i];
//     console.log('lianduis', pdk.isLiandui(cards, zhuPaiType))
// }

// change( pdk.sortHandCards(handCards, zhuPaiType) );

//*/


})();