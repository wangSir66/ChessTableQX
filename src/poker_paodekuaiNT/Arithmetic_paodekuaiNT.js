//跑得快算法类
(function() {
function PaodekuaiNT() {
    this.handCount = 16;
    this.laiziCard = -1;

    // this.cardCfg.fk[1]==方块1 
    // this.cardCfg.ht[13]==黑桃K
    // this.cardCfg.jokerRed==大王
    this.cardCfg = {};
    this.cardCfg.fk = {};
    this.cardCfg.mh = {};
    this.cardCfg.hx = {};
    this.cardCfg.ht = {};
    this.cardCfg.jokerRed = 53;
    this.cardCfg.jokerBlack = 54;
    for(var i=1; i<=52; i++ ){
        // 0:方块  1:梅花  2:梅花  3:黑桃
        var cardType = (i + 3) % 4;
        // 牌值 1 - 13
        var cardValue = Math.ceil(i / 4);
        if(0 == cardType) this.cardCfg.fk[cardValue] = i;
        if(1 == cardType) this.cardCfg.mh[cardValue] = i;
        if(2 == cardType) this.cardCfg.hx[cardValue] = i;
        if(3 == cardType) this.cardCfg.ht[cardValue] = i;
    }
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


var HONG_TAO_3 = 11;
var PDK_MINPOINT = 3;
var PDK_KPOINT = 13;
var PDK_APOINT = 14;
var PDK_2POINT = 16;// 2，和A必须分开
var PDK_MAXPOINT = PDK_2POINT; 
var PDK_CARDTPYE = {
    sandaier: 13,
    sizha: 12,
    feiji: 11,
    sanshun: 10,
    sidaier: 9,
    sangeA: 8,
    sange3: 7,
    sandaiyi: 6,
    liandui: 5,
    shunzi: 4,
    sanzhang: 3, // 只能最后一次出牌有效
    duizi: 2,
    danpai: 1,
};
PaodekuaiNT.prototype.CARDTPYE = PDK_CARDTPYE;
var PDK_CARDCOUNT = {};
PDK_CARDCOUNT[PDK_CARDTPYE.feiji] = 6;
PDK_CARDCOUNT[PDK_CARDTPYE.sanshun] = 6;
PDK_CARDCOUNT[PDK_CARDTPYE.sidaier] = 6;
PDK_CARDCOUNT[PDK_CARDTPYE.sangeA] = 3;
PDK_CARDCOUNT[PDK_CARDTPYE.sange3] = 3;
PDK_CARDCOUNT[PDK_CARDTPYE.sizha] = 4;
PDK_CARDCOUNT[PDK_CARDTPYE.sandaier] = 5;
PDK_CARDCOUNT[PDK_CARDTPYE.sandaiyi] = 4;
PDK_CARDCOUNT[PDK_CARDTPYE.liandui] = 6;
PDK_CARDCOUNT[PDK_CARDTPYE.shunzi] = 5;
PDK_CARDCOUNT[PDK_CARDTPYE.sanzhang] = 3;
PDK_CARDCOUNT[PDK_CARDTPYE.duizi] = 2;
PDK_CARDCOUNT[PDK_CARDTPYE.danpai] = 1;

var PDK_CARD_VALUE = {};
PDK_CARD_VALUE[PDK_CARDTPYE.sztonghua] = 4;
PDK_CARD_VALUE[PDK_CARDTPYE.sangeA] = 3;
PDK_CARD_VALUE[PDK_CARDTPYE.sizha] = 2;
PDK_CARD_VALUE[PDK_CARDTPYE.sange3] = 1;

// 去大小王、三个 2 、一个 A 
// 去大小王、四个二
PaodekuaiNT.prototype.randomCards = function(areaSelectMode, tData) {
    var cards = [];
    var handCardNum = 16;
    var handCardType = areaSelectMode['handCardType'];
    var allHandCardNum = handCardNum * tData.maxPlayer;
    // 没有大小王的 52 张牌
    for (var i = 1; i <= 52; i++) {
        cards.push(i);
    }

    // AAAA 去大小王、四个二
    if(0 == handCardType) {
        cards.splice( cards.indexOf(this.cardCfg.fk[2]), 1 );
        cards.splice( cards.indexOf(this.cardCfg.mh[2]), 1 );
        cards.splice( cards.indexOf(this.cardCfg.hx[2]), 1 );
        cards.splice( cards.indexOf(this.cardCfg.ht[2]), 1 );

    // AAA+2 去掉 方块2 梅花2 黑桃2 黑桃A
    } else {
        cards.splice( cards.indexOf(this.cardCfg.fk[2]), 1 );
        cards.splice( cards.indexOf(this.cardCfg.mh[2]), 1 );
        cards.splice( cards.indexOf(this.cardCfg.hx[2]), 1 );
        cards.splice( cards.indexOf(this.cardCfg.ht[1]), 1 );
    }

    // 红心3先去掉, 确定人数后再放进牌堆， 保证红心3发到玩家手上, 拿黑桃3的先出
    cards.splice( cards.indexOf(this.cardCfg.hx[3]), 1 );

    // 洗牌
    shuffleArray(cards);

    // 取得对应人数的牌数 - 1
    cards = cards.slice(0, allHandCardNum - 1);

    // 红心3放进洗牌堆
    cards.push(this.cardCfg.hx[3]);

    // 洗牌
    shuffleArray(cards);

    return cards;
};

/**
 * 计算牌点数
 * @param {number} num
 * @return {number}
 */
PaodekuaiNT.prototype.calPoint = function(num) {
    if (!num)
        return -1;
    
    var ceilNum = Math.ceil(num / 4);
    if (ceilNum == 1)
        return PDK_APOINT; // A记为14
    
    if (ceilNum == 2)
        return PDK_MAXPOINT; // 2记为16
    
    return ceilNum;
};

/**
 * 判断是否为3顺  : 555666 , 555666777
 * @param  {array} oCards 按点数排序好的皮
 * @return {boll} 
 */
PaodekuaiNT.prototype.isSanShun = function(oCards){
    if ( 0 != oCards.length % 3 ) 
        return false;

    for(var i in oCards){
        if(i==0) continue;

        var cardPoint1 = this.calPoint(oCards[i]);
        var cardPoint2 = this.calPoint(oCards[i-1]);

        if(0!=i && 0!=i%3 && cardPoint1!=cardPoint2 )
            return false;

        // 每第3张牌比第4张牌少1点, 否则不是3顺
        if(0!=i && 0==i%3 && (cardPoint1-cardPoint2)!=1 )
            return false;
    }

    return true;
}

/**
 * 获取所有3顺的组合
 * @param  {array} oCards 按点数排序好的牌
 * @return {array} 所有3顺的组合 和 散牌
 */
PaodekuaiNT.prototype.getSanShunAndSanPai = function(oCards){
    var countSanSame = 0;
    // 记录所有3张的数值
    var sanSameList = [];
    // 记录散牌
    var sanPaiList = [];

    for(var i in oCards){

        // 如 是第一张牌 或 重置搜索, 记录已搜索一张牌， 跳过牌值对比
        if(0 == i || 0 == countSanSame)  {
            countSanSame = 1;
            // 最后一张牌，放到散牌里
            if(i == (oCards.length - 1) ){
                sanPaiList.push( oCards[i] );
            }
            continue;
        }

        var cardPoint1 = this.calPoint(oCards[i]);
        var cardPoint2 = this.calPoint(oCards[i-1]);

        // 如果此牌 和 搜索的牌值相等, 搜索记录+1
        if(cardPoint1==cardPoint2){
            countSanSame++;

        }else{
            // 如 已搜索的牌 是散牌， 记录为散牌
            for(var j=1; j <= countSanSame; j++)
                sanPaiList.push( oCards[i-j] );
            
            // 此牌oCards[i] 继续和后面的牌对比, 所以记录此牌在搜索 
            countSanSame = 1;
            
        }

        // 如果3张 ，记录， 重置搜索  
        if(3 == countSanSame){
            for(var j=0; j < countSanSame; j++)
                sanSameList.push( oCards[i-j] );
            countSanSame = 0;

        // 如 最后一张牌没有3张
        }else if(i == (oCards.length - 1) ){
            for(var j=0; j < countSanSame; j++)
                sanPaiList.push( oCards[i-j] );
            countSanSame = 0;
        }
    }


    var tmpsanShun1 = [];
    var tmpsanShun2 = [];
    var handIndex = 0;
    sanSameList.sort(this.cardSortBigToSmall.bind(this));// 从大到小排序
    for(var i=0; i < sanSameList.length - 1; i++) {
        var pa = this.calPoint(sanSameList[i]);
        var pb = this.calPoint(sanSameList[i+1]);  

        // 如果不能组成三顺 或者 是数组最后一位， 计算记录 最大的 三顺
        if( pa - pb > 1 || (i + 1) == sanSameList.length - 1) 
        {
            if( (i + 1) == sanSameList.length - 1 ) {
                tmpsanShun2 = sanSameList.slice(handIndex, sanSameList.length);
            } else {
                tmpsanShun2 = sanSameList.slice(handIndex, i + 1);
                handIndex = i + 1;
            }
            if(tmpsanShun1.length < tmpsanShun2.length || this.calPoint(tmpsanShun1[0]) < this.calPoint(tmpsanShun2[0]) )
            {
                tmpsanShun1 = tmpsanShun2;
            }
        }
    }

    for(var i in tmpsanShun1) {
        var card = tmpsanShun1[i]
        sanSameList.splice(sanSameList.indexOf(card), 1);
    }
    sanPaiList = sanPaiList.concat(sanSameList);

    return [tmpsanShun1, sanPaiList];
}

PaodekuaiNT.prototype.countDuiNum = function(oCards){
    var num = 0;
    var cardNumByValue = {};
    for(var i in oCards){
        var cardValue = this.calPoint(oCards[i]);
        if(!cardNumByValue[cardValue]){
            cardNumByValue[cardValue] = 1;  
        } else {
            cardNumByValue[cardValue]++;
            if(cardNumByValue[cardValue] % 2 == 0)
                num++;
        }
    }

    if(num == oCards.length/2){
        return num;
    }else{
        return 0;
    }
}

PaodekuaiNT.prototype.formatFeiJiType = function(oCards){
    // 记录所有3张的数值
    var sanSameList = [];
    // 记录散牌
    var sanPaiList = [];
    var sanShunAndSanPai = this.getSanShunAndSanPai(oCards);

    sanSameList = sanShunAndSanPai[0];
    sanPaiList = sanShunAndSanPai[1];

    // 将3张里的 最大数量的3顺 整理出来
    var maxCountShunIndex1 = 0;     // 最大数量的3顺 的数组下表始值
    var maxCountShunIndex2 = -3;    // 最大数量的3顺 的数组下表终值
    var countSanShun = 0;         // 3顺最大数量的
    var tempCountSanShun = 0;
    for(var i=0; i<sanSameList.length/3; i++){
        if(i==0){
            tempCountSanShun++;
            continue;
        }    
        
        var cardPoint1 = this.calPoint(sanSameList[i*3]);
        var cardPoint2 = this.calPoint(sanSameList[i*3-1]);
        var isLastCount = i==(sanSameList.length/3 - 1);    // 此3张是否为最后3张
        var isSanShun = (cardPoint1-cardPoint2) <= 1;       // 此3张和前3张是否为顺

        // 如果是 3顺， 顺数量+1
        if( isSanShun )   tempCountSanShun++;

        // 如果不是 3顺， 顺的数量 比 前面顺的数量多 (数量最大的顺作为 飞机)
        // 如果和前3张组成3顺， 且是最后的3张， 
        if(  (!isSanShun || isSanShun && isLastCount )
            && countSanShun <= tempCountSanShun){
            maxCountShunIndex2 = (i+1)*3 - 1;
            countSanShun = tempCountSanShun;
        }

    }
    maxCountShunIndex1 = maxCountShunIndex2 - countSanShun*3 + 1

    var sanShunList = []
    for(var i in sanSameList){
        if(i>=maxCountShunIndex1 && i<=maxCountShunIndex2){
            sanShunList.push(sanSameList[i]);
            
        }else{
            sanPaiList.push(sanSameList[i]);
        }
    }

    var feijiInfo = {}
    feijiInfo.BU_SHI_FEI_JI = 0 // 飞机类型: 不是飞机
    feijiInfo.DAI_CHI_BANG = 1; // 飞机类型: 带翅膀
    feijiInfo.DAN_ZHANG_CHI_BANG = 2;// 飞机类型: 带单张的翅膀
    feijiInfo.NO_CHI_BANG = 3;  // 飞机类型: 不带翅膀
    feijiInfo.value = 0;    // 飞机的牌值
    feijiInfo.type = feijiInfo.BU_SHI_FEI_JI; // 飞机类型


    // 包含四张同样的牌不算飞机
    for(var i=0; i < oCards.length; i++){
        var cardValue = this.calPoint(oCards[i]);
        var findCards = this.findNSameCard(oCards, cardValue, 4);
        if(findCards) return feijiInfo;
    }


    if(0 == sanShunList.length) return feijiInfo;

    // 飞机带翅膀
    var duiNum = this.countDuiNum(sanPaiList);
    if(sanShunList.length/3 == duiNum) // 翅膀需要是对子  333-444555-6   333444-6789  
    // if(feijiInfo.type == feijiInfo.BU_SHI_FEI_JI && sanShunList.length/3 >= sanPaiList.length/2 && oCards.length % 5 == 0) // 翅膀任意牌
        feijiInfo.type = feijiInfo.DAI_CHI_BANG;

    // 带对应单张的飞机
    // 如果是 用3张作翅膀的牌型: 555666777888  333444555666777888999101010 
    if(feijiInfo.type == feijiInfo.BU_SHI_FEI_JI && 0 == sanShunList.length % 12 && 0 == sanPaiList.length)
        feijiInfo.type = feijiInfo.DAN_ZHANG_CHI_BANG;
    // 如果飞机和翅膀数量相等
    if(feijiInfo.type == feijiInfo.BU_SHI_FEI_JI && sanPaiList.length == sanShunList.length/3)
        feijiInfo.type = feijiInfo.DAN_ZHANG_CHI_BANG;

    // 不带翅膀 的飞机
    if(sanShunList.length > 0 && sanPaiList.length == 0)
    // if(feijiInfo.type == feijiInfo.BU_SHI_FEI_JI && sanShunList.length > 0 && sanPaiList.length <= sanShunList.length/3*2) // 任意翅膀数量的飞机
        feijiInfo.type = feijiInfo.NO_CHI_BANG;

    if(feijiInfo.type != feijiInfo.BU_SHI_FEI_JI){
        feijiInfo.value = sanShunList[sanShunList.length-1];
    }

    // console.log('sanSameList', sanSameList.toString());
    // console.log('sanShunList', sanShunList.toString());
    // console.log('sanPaiList', sanPaiList.toString());
    return feijiInfo;
}

/**
 * 判断是否为飞机 : 555666xx , 555666777xxx (warn: 555666777888)
 * @param  {array} oCards 按点数排序好的牌
 * @return {num} 返回飞机的牌值， 不是飞机返回0 
 */
PaodekuaiNT.prototype.isFeiJi = function(oCards){
    var feijiInfo = this.formatFeiJiType(oCards);
    return feijiInfo.value;
}


/**
 * 判断是否是顺子
 * @param {array} oCards 按点数排好序的牌
 * @return {bool}
 */
PaodekuaiNT.prototype.isShun = function(oCards) {
    if (!oCards || oCards.length < 5)
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
PaodekuaiNT.prototype.isLiandui = function(oCards) { //oCards有序
    var cardNum = 4;// 连对最小牌数

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


/**
 * 计算牌型
 * @param {array} cards 按点数排好序的牌
 * @return {PDK_CARDTPYE} 牌型，-1 = 不成型
 */
PaodekuaiNT.prototype.calType = function(cards) {

    var cardCount = cards.length;
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
    var numToPoint = [];
    for (var p in pointCounts) {
        if (maxCount < pointCounts[p]) {
            maxCount = pointCounts[p];
        }
        if( !numToPoint[pointCounts[p]] ) numToPoint[pointCounts[p]] = [];
        numToPoint[pointCounts[p]].push(p)
    }

    // 三个A  和三顺牌型相似， 避免判断为三顺， 放到三顺前
    // if (cardCount == 3 && numToPoint[3] && this.calPoint(cards[0]) == PDK_APOINT)
    //     return PDK_CARDTPYE.sangeA;

    // 三个3(不包含红心3)  算炸弹
    if (cardCount == 3 && numToPoint[3] && this.calPoint(cards[0]) == PDK_MINPOINT && cards.indexOf(HONG_TAO_3) < 0)
        return PDK_CARDTPYE.sange3;

    // 飞机
    if(cardCount >= 6 && maxCount >= 3 && this.isFeiJi(cards)!=0 ){
        return PDK_CARDTPYE.feiji;
    }

    // 3顺
    // if(cardCount >= 3 && maxCount == 3 && this.isSanShun(cards)){
    //     return PDK_CARDTPYE.sanshun;
    // }

    // 顺子，5张起
    if (cardCount >= 5 && maxCount == 1 && this.isShun(cards))
        return PDK_CARDTPYE.shunzi;

    // 连对，2对起
    if (cardCount >= 4 && maxCount == 2 && this.isLiandui(cards))
        return PDK_CARDTPYE.liandui;

    // //四带二
    // if (cardCount == 6 && maxCount == 4 )
    //     return PDK_CARDTPYE.sidaier;

    // 三带二 3张带对子
    if (cardCount == 5 && numToPoint[3] && numToPoint[2])
        return PDK_CARDTPYE.sandaier;

    //三带一
    if (cardCount == 4 && maxCount == 3 )
        return PDK_CARDTPYE.sandaiyi;

    //四炸
    if (cardCount == 4 && numToPoint[4])
        return PDK_CARDTPYE.sizha;

    // 三张
    if (cardCount == 3 && numToPoint[3])
        return PDK_CARDTPYE.sanzhang;

    // 对子
    if (cardCount == 2 && numToPoint[2])
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
PaodekuaiNT.prototype.calCardsValue = function(cards, laizi, type) {

    if (!cards || cards.length == 0)
        return -1;
    
    if (!type)
        type = this.calType(cards);
    
    var lastCard = cards[cards.length - 1];
    
    if (type == PDK_CARDTPYE.sandaier)
        return this.calPoint(cards[2]);

    if (type == PDK_CARDTPYE.sandaiyi)
        return this.calPoint(cards[2]);
    
    if (type == PDK_CARDTPYE.sidaier)
        return this.calPoint(cards[3]);
    
    if (type == PDK_CARDTPYE.feiji)
        return   this.calPoint( this.isFeiJi(cards) );

    // 单牌，对子，三张，顺子，连对，四炸，三个A
    return this.calPoint(lastCard);
};

// 牌点比较函数
PaodekuaiNT.prototype.cardValueCmp = function(a, b) {
    var pa = this.calPoint(a);
    var pb = this.calPoint(b);
    if (pa == pb)
        return a - b;
    
    return pa - pb;
};

PaodekuaiNT.prototype.cardSortBigToSmall = function(a, b) {
    var pa = this.calPoint(a);
    var pb = this.calPoint(b);
    if (pa == pb)
        return b - a;
    
    return pb - pa;
}

/** 剔除癞子
 * @param {array} oCards [in] 
 * @param {array} cards [out] 剔除癞子后的按点数据序的牌
 * @return {number} 返回癞子数
 */
PaodekuaiNT.prototype.transformAndGetLaizi = function(oCards, cards) {
    var laizi = 0;
    for (var i = 0; i < oCards.length; i++) {
        if (oCards[i] == this.laiziCard)
            laizi ++;
        else
            cards.push(oCards[i]);
    }
    cards.sort(this.cardValueCmp.bind(this));
    return laizi;
};



/** 
 * 牌是否能压上
 * @param {array} oCards 按点数排好序的牌/选择了的手牌
 * @param {array} [oLastCards] 按点数排好序的牌/最后打出的牌
 * @param {number} [handsNum] 手牌数量
 */
PaodekuaiNT.prototype.canPut = function(oCards, oLastCards, handsNum) {
    var cards = [];
    var laizi = this.transformAndGetLaizi(oCards, cards);
    var cardsType = this.calType(cards, laizi);

    if (cardsType == -1)
        return false;

    // 不能出3张 或 3顺不能出
    // if (cardsType == PDK_CARDTPYE.sanzhang || cardsType == PDK_CARDTPYE.sanshun){
    //     if( oCards.length == handsNum ){// 如果最后一手牌是3张或3顺
    //         return true;
    //     }
    //     return false;
    // }

    // 没有上次打的牌，三家过自己再出牌
    if (!oLastCards)
        return true;

    if ((cardsType == PDK_CARDTPYE.shunzi ||
        cardsType == PDK_CARDTPYE.feiji || 
        cardsType == PDK_CARDTPYE.liandui) ) 
    {
        if(oCards.length != oLastCards.length)  return false;
    }

    var lastCards = [];
    var lastLaizi = this.transformAndGetLaizi(oLastCards, lastCards);
    var lastCardsType = this.calType(lastCards, lastLaizi);
    if (cardsType == lastCardsType && oCards.length == oLastCards.length) {
        var typeValue = this.calCardsValue(cards, laizi, cardsType);
        var lastTypeValue = this.calCardsValue(lastCards, lastLaizi, lastCardsType);
        return typeValue > lastTypeValue;
    }
    else if(PDK_CARD_VALUE[cardsType]) {
        var last_card_value = PDK_CARD_VALUE[lastCardsType] || 0;
        return PDK_CARD_VALUE[cardsType] > last_card_value;
    }

    return false;
};


// 检查是否能出牌
/**
 * 检测是否能出牌
 * @param  {Array} oHands 手牌
 * @param  {Array} cards 提起的牌/选择了的牌
 * @param  {Array} lastCards 上次出的牌/打在桌面上的牌
 * @param  {object}  areaSelectMode 玩法选项 
 * @param  {bool}  isNextPlayerOneCard 下家是否为报单
 * @param  {bool}  isFirstRound 是否第一局
 * @return {Array} 返回可以出的牌
 */
PaodekuaiNT.prototype.checkPut = function(oHands, cards, lastCards, areaSelectMode, isNextPlayerOneCard, isFirstRound) {
    if(cards && typeof(cards)!='undefined' && cards.length == 0) return null;

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

    var mustPutHongTaoSan = true;//areaSelectMode.mustPutHongTaoSan;

    // 选择 红桃三先出时 有红桃三必须出
    if (mustPutHongTaoSan && cards.indexOf(HONG_TAO_3)<0 && oHands.indexOf(HONG_TAO_3)>=0){
        return null;
    }

    var cardType = this.calType(cards);
        // 三个三
    if (cardType == PDK_CARDTPYE.sange3 && areaSelectMode && cards.indexOf(this.cardCfg.hx[3]) >= 0) {
        return null
    }

    // 如果 下家报单 提起的一张牌 不是最大的牌
    var sortHand = oHands.slice();
    sortHand.sort(this.cardValueCmp.bind(this));
    var maxCards = this.getAllMaxCard(oHands);

    if(isNextPlayerOneCard && cards.length==1 && (areaSelectMode.winCountType != 1 || areaSelectMode.baoDanMustPut) && this.calPoint(maxCards[0]) != this.calPoint(cards[0]) )
        return null;


    var sortCards = cards;
    var sortLastCards = lastCards;

    if (typeof(sortLastCards) == "number")
        sortLastCards = null;
    
    if (sortCards){
        sortCards = sortCards.slice();
        sortCards.sort(this.cardValueCmp.bind(this));
    }
    if (sortLastCards){
        sortLastCards = sortLastCards.slice(),
        sortLastCards.sort(this.cardValueCmp.bind(this));
    }

    if (this.canPut(sortCards, sortLastCards, oHands.length)) {
        return hands; // 能打得过上家的牌
    }
    return null;
};

/**
 * 对手牌排序
 * @param {array} 
 * @param {number} sortType 1 = 花色排序, 2 = 张数排序, 0 ==普通牌型
 */
PaodekuaiNT.prototype.sortHandCards = function(oCards, sortType) {
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
        }
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
        }
    }

    cards.sort(function(a, b) {
        return -commonCmp(a, b);
    });
    return cards;
};

/** 
 * 找N张点数一样的牌
 * @param {array} hands 按点数排好序的牌 
 * @param {number} points
 * @param {number}
 * @return {array}
 */
PaodekuaiNT.prototype.findNSameCard = function(hands, point, n) {
    for (var i = 0; i < hands.length; i++) {
        if (this.calPoint(hands[i]) == point && this.calPoint(hands[i + n - 1]) == point)
            return hands.slice(i, i + n);
    }
    return null;
};


// 删除相应牌值
PaodekuaiNT.prototype.delPoint = function(hands, points, values){
    var arr = hands.slice();
    var delitems = points || values;
    for(var i=0; i < delitems.length; i++){
        for (var j = 0; j < arr.length; j++) {
            if( points && this.calPoint(arr[j]) == delitems[i] ){
                arr.splice(j, 1);
                j--;
            }else if( values && arr[j] == delitems[i] ){
                arr.splice(j, 1);
                j--;
            }
        }
    }
    return arr;
}
/**
 * 列举集合里面 num 个元素的所有组合
 * @param  {array} parr 集合数组
 * @param  {number} num 元素个数
 * @return {array} nun个元素的所有组合
 */
PaodekuaiNT.prototype.lieju = function(parr, num){
    var tmps = [];

    var zhuhe = function(srcArr, eleNum, tagArr){
        if(eleNum == 0) return tagArr;
        var newZhuHe = [];

        if(!tagArr){
            tagArr = [];
            tagArr.push(srcArr[0]);
            newZhuHe.push(tagArr);
        }else{
            for(var i=0; i<tagArr.length; i++){
                for(var j=i; j<srcArr.length; j++){
                    newZhuHe.push( tagArr[i].concat( srcArr[j] ) );
                }
            }
        }

        var pSrcArr = srcArr.slice(1, srcArr.length);
        return zhuhe(pSrcArr, --eleNum, newZhuHe)
    }

    for(var i=0; i < parr.length-num+1; i++){
        var tmp = zhuhe(parr.slice(i, parr.length), num) ;
        tmps = tmps.concat(tmp);
    }

    return tmps;
}

PaodekuaiNT.prototype.formatCards = function(oCards) {
    var info = {};
    // key:牌值  value:数量  (10有3张）
    info.mValueToNum = {};
    // key:数量  value:牌值  (3张的牌有10, K, 4)
    info.mNumToValue = {};

    var cds = oCards.slice();
    cds.sort(this.cardValueCmp.bind(this));
    info.cds = cds;

    for(var i in cds){
        var value = this.calPoint(cds[i]);
        if( !info.mValueToNum[value] ) info.mValueToNum[value] = [];

        info.mValueToNum[value].push(cds[i]);
    }

    for(var i in cds){
        var value = this.calPoint(cds[i]);
        var num = info.mValueToNum[value].length;

        if( !info.mNumToValue[num] ) info.mNumToValue[num] = [];

        if( info.mNumToValue[num].indexOf(value) < 0 )
            info.mNumToValue[num].push(value);
    }

    return info;
}

PaodekuaiNT.prototype.hadCards = function(oCards, fCards) {
    if(oCards.length >= fCards.length) {
        for( var i in fCards ) {
            var fc = fCards[i];
            if( oCards.indexOf(fc) < 0 ) {
                return false;
            }
        }
        return fCards;
    } else {
        return false;
    }
}

PaodekuaiNT.prototype.indexOfCards = function(cardList, cards) {
    for(var i in cardList) {
        var tmpCards = cardList[i];
        if( this.isSameCards(tmpCards, cards) )
            return true;
    }
    return false;
}

PaodekuaiNT.prototype.isSameCards = function(cards1, cards2) {
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

PaodekuaiNT.prototype.findCardByRole = function(oCards, findNum, ignoreCardValued) {

    var cinfo = this.formatCards(oCards);
    var fCards = [];

    // 最小的两张单牌
    if(cinfo.mNumToValue[1] && cinfo.mNumToValue[1].length >= 2) {
        var ret = [];
        for(var i = 0; i < findNum; i++){
            var value = cinfo.mNumToValue[1][i];
            if( !ignoreCardValued || !ignoreCardValued[value] ) {
                var card = cinfo.mValueToNum[value][0];
                ret.push(card);
            }
        }

        if( ret.length == findNum && !this.indexOfCards(fCards, ret) ) 
            fCards.push( ret );
    }

    // 最小的一个对子
    if(cinfo.mNumToValue[2] && cinfo.mNumToValue[2].length >= 1) {
        var ret = [];
        var value = cinfo.mNumToValue[2][0];
        if( !ignoreCardValued || !ignoreCardValued[value] ) {
            var cards = cinfo.mValueToNum[value];
            ret = ret.concat(cards)
        }
        if( ret.length == findNum ) fCards.push( ret );
    }

    // 不拆3，4张的情况下，最小的两张牌
    var ret = [];
    for(var i in cinfo.cds) {
        var card = cinfo.cds[i];
        var value = this.calPoint(card);
        if( !ignoreCardValued || !ignoreCardValued[value] ) {
            var length = cinfo.mValueToNum[value].length;
            if( length <= 2 ) 
                ret.push(card);
        }

        if( ret.length == findNum ) {
            if( !this.indexOfCards(fCards, ret) ) fCards.push( ret );
            break;
        }
    }

    // 最小的两张牌
    var ret = [];
    for(var i in cinfo.cds) {
        var card = cinfo.cds[i];
        var value = this.calPoint(card);
        if( !ignoreCardValued || !ignoreCardValued[value] ) {
            ret.push(card);
        }

        if( ret.length == findNum ) {
            if( !this.indexOfCards(fCards, ret) ) fCards.push( ret );
            break;
        }
    }

    return fCards;
}


/** 
 * 用laizi张癞子去拼出type牌型的牌
 * @param {array} hands 按点数按好序的牌
 * @param {number} laizi 所使用的癞子数
 * @param {PDK_CARDTPYE} type 要拼出的牌型
 * @param {array} lastCards 最后一手牌
 * @param {array} 拼好的 
 */
PaodekuaiNT.prototype.findCardByType = function(hands, laizi, type, lastCards) {
    var rets = [];
    var laizis = [];
    var cardNum = typeof(lastCards)!='undefined' ? lastCards.length : null;
    var cardCount = PDK_CARDCOUNT[type];

    if (cardNum && (type == PDK_CARDTPYE.liandui || type == PDK_CARDTPYE.shunzi))
        cardCount = cardNum;

    if (laizi > cardCount || laizi + hands.length < cardCount) {
        return rets;
    }

    for (var i = 0; i < laizi; i++) {
        laizis.push(this.laiziCard);
    }

    if (type == PDK_CARDTPYE.feiji && hands.length >= cardCount) {
        var handFeiji = this.getSanShunAndSanPai(hands);
        var lastCardsFeiji = this.getSanShunAndSanPai(lastCards);
        var handCardSanZhangNum = handFeiji[0].length/3;
        var handCardSanPaiNum = handFeiji[1].length;
        var lastCardSanZhangNum = lastCardsFeiji[0].length/3;
        var lastCardSanPaiNum = lastCardsFeiji[1].length;

        if(handCardSanZhangNum >= lastCardSanZhangNum){
            var sanShun = [];
            var sanpai = [];
            for(var i=0; i<handCardSanZhangNum; i++){
                var startSanIndex = i*3;
                var lastSanIndex = i*3+lastCardSanZhangNum*3;
                sanShun = handFeiji[0].slice(startSanIndex, lastSanIndex)
                if(sanShun.length != lastCardsFeiji[0].length) continue;
                if (lastCardsFeiji[1].length == 0) {
                    rets.push(sanShun);
                    continue;
                }
                sanpai = handFeiji[0].slice(0, startSanIndex);
                sanpai = sanpai.concat(handFeiji[0].slice(lastSanIndex, handFeiji[0].length));//-lastSanIndex));
                sanpai = sanpai.concat(handFeiji[1]);

                var allSanPaiZhuHe = this.lieju(sanpai, lastCardSanPaiNum);
                for(var j in allSanPaiZhuHe){
                    var ret = sanShun.concat( allSanPaiZhuHe[j] );
                    if(this.isFeiJi(ret) != 0){
                        rets.push(ret);
                    }
                }
            }
        }
        
    }else if (type == PDK_CARDTPYE.sangeA) {
        // if (laizi == 0)
        // {
        //     var find = this.findNSameCard(hands, PDK_APOINT, 3);
        //     if (find)
        //         rets.push(find);
        // }
    }
    else if (type == PDK_CARDTPYE.sange3) {
        if (laizi == 0)
        {
            var newHands = this.delPoint(hands, null, [this.cardCfg.hx[3]]);
            var find = this.findNSameCard(newHands, PDK_MINPOINT, 3);
            if (find)   rets.push(find);
        }
    }

    else if (type == PDK_CARDTPYE.sizha  || type == PDK_CARDTPYE.duizi || type == PDK_CARDTPYE.sanzhang) { 
        for (var i = PDK_MINPOINT; i <= PDK_MAXPOINT; i++) {
            var find = this.findNSameCard(hands, i, cardCount - laizi);
            if (find) {
                // 3张3的时候， 有红心3才算普通3张， 否则是炸弹
                if (i == PDK_MINPOINT && type == PDK_CARDTPYE.sanzhang) {
                    if (find.indexOf(this.cardCfg.hx[3]) > 0) rets.push(laizis.concat(find));
                } else {
                    rets.push(laizis.concat(find));
                }
            }
        }

    }
    else if (type == PDK_CARDTPYE.liandui) {
        for (var i = PDK_MINPOINT; i <= PDK_APOINT - cardCount/2 + 1; i++) // 连对首张
        {
            var ldCount = 0;
            var ret = laizis.slice();
            for (var j = 0; j < cardCount/2; j++) 
            {
                var p = i + j;
                for (var k = 0; k < hands.length - 1; k++) 
                {
                    var point1 = this.calPoint(hands[k]);
                    var point2 = this.calPoint(hands[k + 1]);
                    if (point1 != p || point2 != p)
                        continue;

                    ldCount += 2;
                    ret.push(hands[k]);
                    ret.push(hands[k + 1]);
                    break;
                }
            }
            if (ldCount + laizi == cardCount) {
                rets.push(ret);
            }
        }
    }
    else if (type == PDK_CARDTPYE.sandaier) {
        for (var aLaizi = 0; aLaizi <= laizi; aLaizi++) 
        {
            for (var i = PDK_MINPOINT; i <= PDK_MAXPOINT; i++) 
            {
                var temp1 = this.findNSameCard(hands, i, 3 - aLaizi);
                if (!temp1)
                    continue;

                if(1 - (laizi - aLaizi) <= 0) 
                {
                    rets.push(laizis.concat(temp1));
                    continue;
                }

                var newHands = this.delPoint(hands, [i]);

                // 接3带2时，提示逻辑固定
                // 1）带最小的两张单牌
                // 2）如单牌不足两张，带最小一个对子
                // 3）对子也没有，就取除三张外最小的两张牌
                var findCards = this.findCardByRole(newHands, 2);
                for(var j in findCards){
                    var ret = laizis.concat(temp1);
                    ret = ret.concat(findCards[j])
                    rets.push(ret); 
                }

                for(var j=1; j < newHands.length; j++)
                {
                    var ret = laizis.concat(temp1);
                    ret.push(newHands[j-1]);
                    ret.push(newHands[j]);
                    if( !this.indexOfCards(rets, ret) ) 
                        rets.push(ret); 
                }
            }
        }
    }
    else if (type == PDK_CARDTPYE.sandaiyi) {
        for (var aLaizi = 0; aLaizi <= laizi; aLaizi++) 
        {
            for (var i = PDK_MINPOINT; i <= PDK_MAXPOINT; i++) 
            {
                var temp1 = this.findNSameCard(hands, i, 3 - aLaizi);
                if (!temp1)
                    continue;

                if(1 - (laizi - aLaizi) <= 0) 
                {
                    rets.push(laizis.concat(temp1));
                    continue;
                }

                for( var j in hands)
                {
                    var cardPoint = this.calPoint(hands[j]);
                    if(cardPoint != i){
                        rets.push(laizis.concat(temp1).concat(hands[j])); 
                    }
                    

                }

            }
        }
    }
    else if (type == PDK_CARDTPYE.shunzi) {
        for (var i = PDK_MINPOINT; i <= PDK_APOINT - cardCount + 1; i++) { // 顺子首张
            var shun = laizis.slice();

            for (var j = 0; j < cardCount; j++) {
                var p = i + j;
                var find = this.findNSameCard(hands, p, 1);
                if( (p-1)==PDK_KPOINT )  // 如果上张牌是K ,需要考虑计算A
                    find = this.findNSameCard(hands, PDK_APOINT, 1);

                if (find)
                    shun = shun.concat(find);
            }
            if (shun.length == cardCount)
                rets.push(shun);
        }
    }
    else if (type == PDK_CARDTPYE.danpai) {
        if (laizis.length == 1) {
            rets.push(laizis.slice());
        }
        else {
            for (var i = PDK_MINPOINT; i <= PDK_MAXPOINT; i++) 
            {
                cc.log("hands " + hands + " i = " + i);
                var find = this.findNSameCard(hands, i, 1);
                if (find)
                    rets.push(find);
            }
        }
    }
    else if (type == PDK_CARDTPYE.sidaier){
        for (var i = PDK_MINPOINT; i <= PDK_APOINT; i++) // 连对首张
        {
            var find = this.findNSameCard(hands, i, 4);
            if(find){
                
                for (var k = 0; k < hands.length - 1; k++) 
                {   
                    var cardPoint1 = this.calPoint(hands[k]);

                    if(cardPoint1==i) continue;

                    for (var j = 0; j < hands.length - 1; j++) 
                    {   
                        var cardPoint2 = this.calPoint(hands[j]);
                        if(cardPoint2==i || j==k) continue;
                        
                        var ret = laizis.slice();
                        ret = ret.concat(find);
                        ret.push(hands[k]);
                        ret.push(hands[j]);
                        rets.push(ret);
                    }
     
                }  
            }
            
        }
    }
    return rets;
};

PaodekuaiNT.prototype.getAllMaxCard = function(oCards){
    var sortHands = oCards.slice();
    sortHands.sort(this.cardValueCmp.bind(this));
    var maxCard = sortHands[sortHands.length - 1];

    var rets = []
    for(var i in sortHands){
        var ret = []
        if(this.calPoint(maxCard) == this.calPoint(sortHands[i])){
            ret.push(sortHands[i]);
            rets.push(ret);
        }
    }

    return rets;
}

/**
 * 提示可出的牌
 * @param  {array} oHands 我的手牌
 * @param  {array} oLastCards 上家出的牌
 * @param  {Boolean} areaSelectMode 创建房间的选项
 * @param  {Boolean} isNextPlayerOneCard 下家是否报单
 * @param  {Boolean} isFirstRound 是否第一局
 * @return {array} 提示的牌
 */
PaodekuaiNT.prototype.tipCards = function(oHands, oLastCards, areaSelectMode, isNextPlayerOneCard, isFirstRound) {
    //当勾“先出红桃三”选项时，提示出红桃三
    var isMustPutHongTaoSan = true;//areaSelectMode.mustPutHongTaoSan;
    if (isMustPutHongTaoSan && oHands.indexOf(HONG_TAO_3) >=0){
           return [[HONG_TAO_3]]
    }

    // 第一个出牌时，提示出最大的
    var isFirstPlayerPut = (!oLastCards || oLastCards == -1 || oLastCards.length == 0);
    if(isFirstPlayerPut)
    {
        var sortHands = oHands.slice();
        sortHands.sort(this.cardValueCmp.bind(this));
        return [[sortHands[sortHands.length - 1]]];
    }
    
    var hands = [];
    var handLaizi = this.transformAndGetLaizi(oHands, hands);
    var lastCards = [];
    var lastLaizi = this.transformAndGetLaizi(oLastCards, lastCards);
    var lastCardsType = this.calType(lastCards, lastLaizi);
    var rets = [];
    for (var laizi = 0; laizi <= handLaizi; laizi++) {
        if(lastCardsType ==  PDK_CARDTPYE.sizha) break;
        if(lastCardsType ==  PDK_CARDTPYE.sange3) break;
        
        var sameTypeCards = this.findCardByType(hands, laizi, lastCardsType, oLastCards);
        for (var i = 0; i < sameTypeCards.length; i++) {
            if (this.canPut(sameTypeCards[i], oLastCards, oHands.length)) {
                rets.push(sameTypeCards[i]);
            }
        }
    }

    if(isNextPlayerOneCard && (areaSelectMode.winCountType != 1 || areaSelectMode.baoDanMustPut)){
        // 如果上家出牌且是一张，  才使用报单提示
        if(rets.length>0 && oLastCards && oLastCards.length <= 1 ){
            rets = this.getAllMaxCard(oHands);
        // 如果上家没有出牌， 使用报单提示
        }else if(rets.length>0 && !oLastCards || oLastCards == -1 ){
            rets = this.getAllMaxCard(oHands);
        }
    }

    var booms = this.findCardByType(hands, 0, PDK_CARDTPYE.sizha);
    for (var i = 0; i < booms.length; i++) {
        if (this.canPut(booms[i], oLastCards, oHands.length)) {
            rets.push(booms[i]);
        }
    }

    var ret = this.findCardByType(hands, 0, PDK_CARDTPYE.sange3);
    if (ret && ret.length > 0 && this.canPut(ret[0], oLastCards, oHands.length, areaSelectMode)) {
        if (ret) rets = rets.concat(ret)
    }

    // rets = rets.concat(this.findCardByType(hands, 0, PDK_CARDTPYE.sangeA) );
    
    return rets;
};

// 求出牌型
PaodekuaiNT.prototype.cardsType = function(oCards) {
    if (oCards) {
        var cards = [];
        var laizi = this.transformAndGetLaizi(oCards, cards);
        return this.calType(cards, laizi);
    }
    return -1;
};

/**
 * 提示可出的牌，是否相同牌型，相同牌值
 * @param  {array} tipscardsArray 我的手牌
 */
PaodekuaiNT.prototype.IsSametipCards = function(tipscardsArray, areaSelectMode)
{
    if (tipscardsArray.length <= 0)return false;
    var cardType = this.calType(tipscardsArray[0], areaSelectMode);
    var cardNum = tipscardsArray[0].length;
    var cardpoint = this.calCardsValue(tipscardsArray[0], cardType, areaSelectMode)
    for(var i = 0; i < tipscardsArray.length; i++)
    {
        var tmp_cardType = this.calType(tipscardsArray[i],areaSelectMode);
        var tmp_cardNum = tipscardsArray[i].length;
        var tmp_cardpoint = this.calCardsValue(tipscardsArray[i], cardType, areaSelectMode)
        if (tmp_cardType != cardType || tmp_cardNum != cardNum || tmp_cardpoint != cardpoint )
            return false;
    }
    return true;
};

/**
 * 如果是有效牌型，剔除带牌
 * @param  {array} Cards 牌组
 * @param  {Boolean} areaSelectMode 创建房间的选项
 */
// sizha: 14,
// sandaier: 12,====
// feiji: 11,=====
// sanshun: 10,
// sidaier: 9,=====
// sangeA: 8,
// sange3: 7,
// sandaiyi: 6,=====
// liandui: 5,
// shunzi: 4,
// sanzhang: 3, // 只能最后一次出牌有效
// duizi: 2,
// danpai: 1,
PaodekuaiNT.prototype.delDaipai = function(Cards, areaSelectMode)
{
    var cardtype = this.calType(Cards, areaSelectMode);

    if (cardtype == PDK_CARDTPYE.sanshun ||
        cardtype == PDK_CARDTPYE.sangeA ||
        cardtype == PDK_CARDTPYE.sange3 ||
        cardtype == PDK_CARDTPYE.sizha ||
        cardtype == PDK_CARDTPYE.liandui ||
        cardtype == PDK_CARDTPYE.shunzi ||
        cardtype == PDK_CARDTPYE.sanzhang ||
        cardtype == PDK_CARDTPYE.duizi ||
        cardtype == PDK_CARDTPYE.danpai)
        return Cards;

    var point = this.calCardsValue(Cards, cardtype, areaSelectMode)
    if( cardtype == PDK_CARDTPYE.sandaier||
        cardtype == PDK_CARDTPYE.sandaiyi)
        Cards = this.findNSameCard(Cards, point, 3);
    else if(cardtype == PDK_CARDTPYE.sidaier)
        Cards = this.findNSameCard(Cards, point, 4);
    else if(cardtype == PDK_CARDTPYE.feiji)
    {
        var feiji  = this.formatFeiJiType(Cards,areaSelectMode);
        Cards = feiji.sanZhangCards;
    }

    return Cards;
}


if(typeof(module)!="undefined" && module.exports)    
    module.exports = PaodekuaiNT;

if(typeof(MjClient)!="undefined")
    MjClient.majiang_paodekuaiNT = new PaodekuaiNT();



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
/**测试 * / 
var pdk = new PaodekuaiNT()
// console.log(pdk.cardCfg);
var c = pdk.cardCfg;

var handCards = [c.hx[6], c.mh[6], c.fk[6], c.ht[3], c.mh[3], c.fk[3]];
// var putCards = [c.ht[10], c.ht[10], c.hx[8], c.hx[8], c.hx[8], c.hx[7], c.hx[7], c.hx[7], c.hx[4], c.hx[4]];
var lastCards = [c.hx[3], c.mh[3], c.fk[3]];
// console.log('PaodekuaiNT.prototype.checkPut', pdk.checkPut(handCards, putCards, lastCards) );
// handCards = [1,49,50,45,41,42,43,37,38,39,33,17,18,19,13,9]

var change = function(cards) {
    var col = ["a", "b", "c", "d"]; // 方块 梅花 红心 黑桃
    var str = "";
    for(var i in cards) {
        var card = cards[i];
        // var color = pdk.calColor(card);
        var point = pdk.calPoint(card);
        str += point + " ";
    }
    var feijiInfo = pdk.formatFeiJiType(cards);
    // console.log('feiji type', feijiInfo.type );
    // console.log('feiji  value', feijiInfo.value );
    console.log(cards);
}

var tipcards = pdk.tipCards(handCards, lastCards);
for(var i in tipcards) {
    change(tipcards[i])
}

// console.log( pdk.checkPut(handCards, [c.ht[3], c.mh[3], c.fk[3]], lastCards) );
// console.log( pdk.checkPut(handCards, [c.hx[4] ], lastCards) );
// 
// var feijis = []
// feijis.push( [c.ht[13], c.ht[13], c.fk[13], c.hx[12], c.hx[4], c.hx[4], c.hx[4], c.hx[3], c.hx[3], c.hx[3]] );
// feijis.push( [c.ht[13], c.fk[13], c.hx[12], c.hx[4], c.hx[4], c.hx[4], c.hx[3], c.hx[3], c.hx[3]] );
// feijis.push( [c.ht[13], c.ht[13], c.fk[13], c.hx[12], c.hx[12], c.hx[12], c.hx[4], c.hx[3], c.hx[3], c.hx[3]] );
// feijis.push( [c.ht[13], c.ht[13], c.fk[13], c.hx[12], c.hx[12], c.hx[12], c.hx[4], c.hx[3], c.hx[3]] );
// feijis.push( [c.ht[13], c.ht[13], c.fk[13], c.hx[12], c.hx[12], c.hx[12], c.hx[4], c.hx[3]] );
// feijis.push( [c.ht[13], c.ht[13], c.fk[13], c.hx[12], c.hx[12], c.hx[12], c.hx[4]] );
// feijis.push( [c.ht[13], c.ht[13], c.fk[13], c.hx[12], c.hx[12], c.hx[12]] );
// feijis.push( [c.ht[10], c.ht[10], c.hx[8], c.hx[8], c.hx[8], c.hx[7], c.hx[7], c.hx[7], c.hx[4], c.hx[4]] );

// for(var i in feijis) {
//     console.log('isfeiji', i, pdk.isFeiJi(feijis[i]) );
// }
/**/

})();