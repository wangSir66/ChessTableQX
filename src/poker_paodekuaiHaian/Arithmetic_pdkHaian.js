//跑得快算法类
(function() {
function PaodekuaiHaian() {
    PaodekuaiBase.apply(this,arguments)

    //牌值
    this.HONG_TAO_3 = 11;
    //牌型
    this.CARDTPYE.sidaiyi=101;
    this.CARDTPYE.sangeAdaiyi=102;
    this.CARDTPYE.sange3daiyi=103;

    this.PDK_CARDCOUNT[this.CARDTPYE.sidaiyi] = 5;
    this.PDK_CARDCOUNT[this.CARDTPYE.sangeAdaiyi] = 4;
    this.PDK_CARDCOUNT[this.CARDTPYE.sange3daiyi] = 4;
    this.PDK_CARDCOUNT[this.CARDTPYE.feiji] = 6;
    this.PDK_CARDCOUNT[this.CARDTPYE.liandui] = 4;///修改

    this.PDK_CARD_VALUE[this.CARDTPYE.sztonghua] = 4;
    // this.PDK_CARD_VALUE[this.CARDTPYE.sangeA] = 3;
    this.PDK_CARD_VALUE[this.CARDTPYE.sangeAdaiyi] = 3;
    // this.PDK_CARD_VALUE[this.CARDTPYE.sizha] = 2;
    this.PDK_CARD_VALUE[this.CARDTPYE.sidaiyi] = 2;
    // this.PDK_CARD_VALUE[this.CARDTPYE.sange3] = 1;
    this.PDK_CARD_VALUE[this.CARDTPYE.sange3daiyi] = 1;

    //只能提示
    this.allTipsNoOrder = null;
}

PaodekuaiHaian.prototype = Object.create(PaodekuaiBase.prototype);
PaodekuaiHaian.prototype.constructor = PaodekuaiHaian

// 去大小王、三个 2 、一个 A 
// 去大小王、四个二
PaodekuaiHaian.prototype.randomCards = function(areaSelectMode, tData) {
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

PaodekuaiHaian.prototype.formatFeiJiType = function(oCards){
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
 * 计算牌型
 * @param {array} cards 按点数排好序的牌
 * @return {this.CARDTPYE} 牌型，-1 = 不成型
 */
PaodekuaiHaian.prototype.calType = function(cards, areaSelectMode) {

    if(!areaSelectMode) areaSelectMode = {};
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

    // 三个A  和三顺牌型相似， 避免判断为三顺， 放到三顺前     // handCardType = 发牌牌型 0:AAAA  1:AAA+2
    if (areaSelectMode.handCardType == 1 && cardCount == 3 && numToPoint[3] && this.calPoint(cards[0]) == this.PDK_APOINT)
        return this.CARDTPYE.sangeA || -1;

    // 三个3(不包含红心3)  算炸弹
    if (cardCount == 3 && numToPoint[3] && this.calPoint(cards[0]) == this.PDK_MINPOINT && cards.indexOf(this.HONG_TAO_3) < 0)
        return this.CARDTPYE.sange3 || -1;

    // 飞机
    if(cardCount >= 6 && maxCount >= 3 && this.isFeiJi(cards)!=0 ){
        return this.CARDTPYE.feiji || -1;
    }


    //三个A带一张
    if(cardCount == 4 && areaSelectMode.handCardType == 1&& numToPoint[3] && numToPoint[3].indexOf("14") >= 0 && areaSelectMode.canZhaDanDai1)
        return this.CARDTPYE.sangeAdaiyi || -1;

    //三个3带一张
    if(cardCount == 4&& numToPoint[3] && numToPoint[3].indexOf("3") >= 0 && cards.indexOf(this.HONG_TAO_3) < 0 && areaSelectMode.canZhaDanDai1)
        return this.CARDTPYE.sange3daiyi || -1;

    //四代一
    if(cardCount == 5 && maxCount == 4 && areaSelectMode.canZhaDanDai1)
        return this.CARDTPYE.sidaiyi || -1;

    // 3顺
    // if(cardCount >= 3 && maxCount == 3 && this.isSanShun(cards)){
    //     return this.CARDTPYE.sanshun;
    // }

    // 顺子，5张起
    if (cardCount >= 5 && maxCount == 1 && this.isShun(cards))
        return this.CARDTPYE.shunzi || -1;

    // 连对，2对起
    if (cardCount >= 4 && maxCount == 2 && this.isLiandui(cards))
        return this.CARDTPYE.liandui || -1;

    // //四带二
    // if (cardCount == 6 && maxCount == 4 )
    //     return this.CARDTPYE.sidaier;



    // 三带二 3张带对子
    if (cardCount == 5 && numToPoint[3] && numToPoint[2])
        return this.CARDTPYE.sandaier || -1;

    //三带一
    if (cardCount == 4 && maxCount == 3 )
        return this.CARDTPYE.sandaiyi || -1;

    //四炸
    if (cardCount == 4 && numToPoint[4])
        return this.CARDTPYE.sizha || -1;

    // 三张
    if (cardCount == 3 && numToPoint[3])
        return this.CARDTPYE.sanzhang || -1;

    // 对子
    if (cardCount == 2 && numToPoint[2])
        return this.CARDTPYE.duizi || -1;

    // 单牌
    if (cardCount == 1)
        return this.CARDTPYE.danpai || -1;

    return -1;
};

/**
 * 计算牌型点数
 * @param {array} cards 按点数排好序的牌
 * @return {number}
 */
PaodekuaiHaian.prototype.calCardsValue = function(cards, type, areaSelectMode) {

    if (!cards || cards.length == 0)
        return -1;
    
    if (!type)
        type = this.calType(cards, areaSelectMode);
    
    var lastCard = cards[cards.length - 1];
    
    if (type == this.CARDTPYE.sandaier)
        return this.calPoint(cards[2]);

    if (type == this.CARDTPYE.sandaiyi)
        return this.calPoint(cards[2]);
    
    if (type == this.CARDTPYE.sidaier ||
        type == this.CARDTPYE.sidaiyi)
        return this.calPoint(cards[3]);
    
    if (type == this.CARDTPYE.feiji)
        return   this.calPoint( this.isFeiJi(cards) );

    // 单牌，对子，三张，顺子，连对，四炸，三个A
    return this.calPoint(lastCard);
};

/** 
 * 牌是否能压上
 * @param {array} oCards 按点数排好序的牌/选择了的手牌
 * @param {array} [oLastCards] 按点数排好序的牌/最后打出的牌
 * @param {number} [handsNum] 手牌数量
 */
PaodekuaiHaian.prototype.canPut = function(oCards, oLastCards, handsNum, areaSelectMode) {
    var cards = oCards.slice();
    var cardsType = this.calType(cards, areaSelectMode);

    if (cardsType == -1)
        return false;

    // 不能出3张 或 3顺不能出
    // if (cardsType == this.CARDTPYE.sanzhang || cardsType == this.CARDTPYE.sanshun){
    //     if( oCards.length == handsNum ){// 如果最后一手牌是3张或3顺
    //         return true;
    //     }
    //     return false;
    // }

    // 没有上次打的牌，三家过自己再出牌
    if (!oLastCards)
        return true;

    if ((cardsType == this.CARDTPYE.shunzi ||
        cardsType == this.CARDTPYE.feiji || 
        cardsType == this.CARDTPYE.liandui) ) 
    {
        if(oCards.length != oLastCards.length)  return false;
    }

    var lastCards = [];
    var lastLaizi = this.transformAndGetLaizi(oLastCards, lastCards);
    var lastCardsType = this.calType(lastCards, areaSelectMode);
    if (cardsType == lastCardsType && oCards.length == oLastCards.length) {
        var typeValue = this.calCardsValue(cards, cardsType, areaSelectMode);
        var lastTypeValue = this.calCardsValue(lastCards, lastCardsType, areaSelectMode);
        return typeValue > lastTypeValue;
    }
    else if (this.PDK_CARD_VALUE[cardsType] && this.PDK_CARD_VALUE[cardsType] == this.PDK_CARD_VALUE[lastCardsType]) {
        var typeValue = this.calCardsValue(oCards, cardsType, areaSelectMode);
        var lastTypeValue = this.calCardsValue(oLastCards, lastCardsType, areaSelectMode);
        return typeValue > lastTypeValue;
    }
    else if (this.PDK_CARD_VALUE[cardsType]) {
        var last_card_value = this.PDK_CARD_VALUE[lastCardsType] || 0;
        return this.PDK_CARD_VALUE[cardsType] > last_card_value;
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
PaodekuaiHaian.prototype.checkPut = function(oHands, cards, lastCards, areaSelectMode, isNextPlayerOneCard, isFirstRound) {
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
    if (mustPutHongTaoSan && cards.indexOf(this.HONG_TAO_3)<0 && oHands.indexOf(this.HONG_TAO_3)>=0){
        return null;
    }
    if(!areaSelectMode && cc ) {
        areaSelectMode = MjClient.data.sData.tData.areaSelectMode;
    }
    var cardType = this.calType(cards,areaSelectMode);
    // 三个三
    if (cardType == this.CARDTPYE.sange3 && areaSelectMode && cards.indexOf(this.cardCfg.hx[3]) >= 0) {
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

    if (this.canPut(sortCards, sortLastCards, oHands.length, areaSelectMode)) {
        return hands; // 能打得过上家的牌
    }
    return null;
};

// 删除相应牌值
PaodekuaiHaian.prototype.delPoint = function(hands, points, values){
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
 * 用laizi张癞子去拼出type牌型的牌
 * @param {array} hands 按点数按好序的牌
 * @param {number} laizi 所使用的癞子数
 * @param {this.CARDTPYE} type 要拼出的牌型
 * @param {array} lastCards 最后一手牌
 * @param {array} 拼好的 
 */
PaodekuaiHaian.prototype.findCardByType = function(hands, laizi, type, lastCards) {
    var rets = [];
    var laizis = [];
    var cardNum = typeof(lastCards)!='undefined' ? lastCards.length : null;
    var cardCount = this.PDK_CARDCOUNT[type];

    if (cardNum && (type == this.CARDTPYE.liandui || type == this.CARDTPYE.shunzi))
        cardCount = cardNum;

    if (laizi > cardCount || laizi + hands.length < cardCount) {
        return rets;
    }

    for (var i = 0; i < laizi; i++) {
        laizis.push(this.laiziCard);
    }

    if (type == this.CARDTPYE.feiji && hands.length >= cardCount) {
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
        
    }else if (type == this.CARDTPYE.sangeA) {
        if (laizi == 0)
        {
            var find = this.findNSameCard(hands, this.PDK_APOINT, 3);
            if (find)
                rets.push(find);
        }
    }
    else if (type == this.CARDTPYE.sange3) {
        if (laizi == 0)
        {
            var newHands = this.delPoint(hands, null, [this.cardCfg.hx[3]]);
            var find = this.findNSameCard(newHands, this.PDK_MINPOINT, 3);
            if (find)   rets.push(find);
        }
    }
    else if (type == this.CARDTPYE.sizha  || type == this.CARDTPYE.duizi || type == this.CARDTPYE.sanzhang) { 
        for (var i = this.PDK_MINPOINT; i <= this.PDK_MAXPOINT; i++) {
            var find = this.findNSameCard(hands, i, cardCount - laizi);
            if (find) {
                // 3张3的时候， 有红心3才算普通3张， 否则是炸弹
                if (i == this.PDK_MINPOINT && type == this.CARDTPYE.sanzhang) {
                    if (find.indexOf(this.cardCfg.hx[3]) > 0) rets.push(laizis.concat(find));
                } else {
                    rets.push(laizis.concat(find));
                }
            }
        }
    }
    else if (type == this.CARDTPYE.liandui) {
        for (var i = this.PDK_MINPOINT; i <= this.PDK_APOINT - cardCount/2 + 1; i++) // 连对首张
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
    else if (type == this.CARDTPYE.sandaier) {
        for (var aLaizi = 0; aLaizi <= laizi; aLaizi++) 
        {
            for (var i = this.PDK_MINPOINT; i <= this.PDK_MAXPOINT; i++) 
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
    else if (type == this.CARDTPYE.sandaiyi) {
        for (var aLaizi = 0; aLaizi <= laizi; aLaizi++) 
        {
            for (var i = this.PDK_MINPOINT; i <= this.PDK_MAXPOINT; i++) 
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

    else if (type == this.CARDTPYE.sangeAdaiyi) {
        for (var aLaizi = 0; aLaizi <= laizi; aLaizi++) 
        {
            var temp1 = this.findNSameCard(hands, this.PDK_APOINT, 3 - aLaizi);
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
                if(cardPoint != this.PDK_APOINT){
                    rets.push(laizis.concat(temp1).concat(hands[j])); 
                }
            }
        }
    }
    else if (type == this.CARDTPYE.sange3daiyi) {
        for (var aLaizi = 0; aLaizi <= laizi; aLaizi++) 
        {
            var newhands = this.delPoint(hands, null, [this.cardCfg.hx[3]]);
            var temp1 = this.findNSameCard(newhands, this.PDK_MINPOINT, 3 - aLaizi);
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
                if(cardPoint != this.PDK_MINPOINT){
                    rets.push(laizis.concat(temp1).concat(hands[j])); 
                }
                

            }
        }
    }
    else if (type == this.CARDTPYE.sidaiyi) {
        for (var aLaizi = 0; aLaizi <= laizi; aLaizi++) 
        {
            for (var i = this.PDK_MINPOINT; i <= this.PDK_MAXPOINT; i++) 
            {
                var temp1 = this.findNSameCard(hands, i, 4 - aLaizi);
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

    else if (type == this.CARDTPYE.shunzi) {
        for (var i = this.PDK_MINPOINT; i <= this.PDK_APOINT - cardCount + 1; i++) { // 顺子首张
            var shun = laizis.slice();

            for (var j = 0; j < cardCount; j++) {
                var p = i + j;
                var find = this.findNSameCard(hands, p, 1);
                if( (p-1)==this.PDK_KPOINT )  // 如果上张牌是K ,需要考虑计算A
                    find = this.findNSameCard(hands, this.PDK_APOINT, 1);

                if (find)
                    shun = shun.concat(find);
            }
            if (shun.length == cardCount)
                rets.push(shun);
        }
    }
    else if (type == this.CARDTPYE.danpai) {
        if (laizis.length == 1) {
            rets.push(laizis.slice());
        }
        else {
            for (var i = this.PDK_MINPOINT; i <= this.PDK_MAXPOINT; i++) 
            {
                cc.log("hands " + hands + " i = " + i);
                var find = this.findNSameCard(hands, i, 1);
                if (find)
                    rets.push(find);
            }
        }
    }
    else if (type == this.CARDTPYE.sidaier){
        for (var i = this.PDK_MINPOINT; i <= this.PDK_APOINT; i++) // 连对首张
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

/**
 * 提示可出的牌
 * @param  {array} oHands 我的手牌
 * @param  {array} oLastCards 上家出的牌
 * @param  {Boolean} areaSelectMode 创建房间的选项
 * @param  {Boolean} isNextPlayerOneCard 下家是否报单
 * @param  {Boolean} isFirstRound 是否第一局
 * @return {array} 提示的牌
 */
PaodekuaiHaian.prototype.tipCards = function(oHands, oLastCards, areaSelectMode, isNextPlayerOneCard, isFirstRound) {
    //当勾“先出红桃三”选项时，提示出红桃三
    var isMustPutHongTaoSan = true;//areaSelectMode.mustPutHongTaoSan;
    if (isMustPutHongTaoSan && oHands.indexOf(this.HONG_TAO_3) >=0){
           return [[this.HONG_TAO_3]]
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
    var lastCardsType = this.calType(lastCards, areaSelectMode);
    var rets = [];
    for (var laizi = 0; laizi <= handLaizi; laizi++) {
        if(lastCardsType ==  this.CARDTPYE.sizha) break;
        if(lastCardsType ==  this.CARDTPYE.sange3) break;
        if(lastCardsType ==  this.CARDTPYE.sidaiyi) break;
        if(lastCardsType ==  this.CARDTPYE.sange3daiyi) break;

        var sameTypeCards = this.findCardByType(hands, laizi, lastCardsType, oLastCards);
        for (var i = 0; i < sameTypeCards.length; i++) {
            if (this.canPut(sameTypeCards[i], oLastCards, oHands.length, areaSelectMode)) {
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

    var booms = this.findCardByType(hands, 0, this.CARDTPYE.sizha);
    for (var i = 0; i < booms.length; i++) {
        if (this.canPut(booms[i], oLastCards, oHands.length, areaSelectMode)) {
            rets.push(booms[i]);
        }
    }



    var ret = this.findCardByType(hands, 0, this.CARDTPYE.sange3);
    if (ret && ret.length > 0 && this.canPut(ret[0], oLastCards, oHands.length, areaSelectMode)) {
        if (ret) rets = rets.concat(ret)
    }

    if(areaSelectMode && areaSelectMode.canZhaDanDai1) {
        ret = this.findCardByType(hands, 0, this.CARDTPYE.sange3daiyi);
        if (ret && ret.length > 0 && this.canPut(ret[0], oLastCards, oHands.length, areaSelectMode)) {
            if (ret) rets = rets.concat(ret)
        }
        booms = this.findCardByType(hands, 0, this.CARDTPYE.sidaiyi);
        for (var i = 0; i < booms.length; i++) {
            if (this.canPut(booms[i], oLastCards, oHands.length, areaSelectMode)) {
                rets.push(booms[i]);
            }
        }
    }
    

    // handCardType = 发牌牌型 0:AAAA  1:AAA+2
    if(areaSelectMode && areaSelectMode.handCardType == 1) {
        rets = rets.concat(this.findCardByType(hands, 0, this.CARDTPYE.sangeA) );

        ret = this.findCardByType(hands, 0, this.CARDTPYE.sangeAdaiyi);
        if (ret && ret.length > 0 && this.canPut(ret[0], oLastCards, oHands.length, areaSelectMode)) {
            if (ret) rets = rets.concat(ret)
        }
    }

    return rets;
};

/**
 * 如果是有效牌型，剔除带牌
 * @param  {array} Cards 牌组
 * @param  {Boolean} areaSelectMode 创建房间的选项
 */
PaodekuaiHaian.prototype.delDaipai = function(Cards, areaSelectMode)
{
    var cardtype = this.calType(Cards, areaSelectMode);

    if (cardtype == this.CARDTPYE.sanshun ||
        cardtype == this.CARDTPYE.sangeA ||
        cardtype == this.CARDTPYE.sange3 ||
        cardtype == this.CARDTPYE.sizha ||
        cardtype == this.CARDTPYE.liandui ||
        cardtype == this.CARDTPYE.shunzi ||
        cardtype == this.CARDTPYE.sanzhang ||
        cardtype == this.CARDTPYE.duizi ||
        cardtype == this.CARDTPYE.danpai)
        return Cards;

    var point = this.calCardsValue(Cards, cardtype, areaSelectMode)
    if( cardtype == this.CARDTPYE.sandaier||
        cardtype == this.CARDTPYE.sandaiyi)
        Cards = this.findNSameCard(Cards, point, 3);
    else if(cardtype == this.CARDTPYE.sidaier)
        Cards = this.findNSameCard(Cards, point, 4);
    else if(cardtype == this.CARDTPYE.feiji)
    {
        var feiji  = this.formatFeiJiType(Cards,areaSelectMode);
        Cards = feiji.sanZhangCards;
    }

    return Cards;
}


if(typeof(module)!="undefined" && module.exports)    
    module.exports = PaodekuaiHaian;

if(typeof(MjClient)!="undefined")
    MjClient.majiang_paodekuaiHaian = new PaodekuaiHaian();
})();