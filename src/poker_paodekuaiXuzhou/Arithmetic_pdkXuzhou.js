//跑得快算法类
(function() {
function PaodekuaiXuzhou() {
    PaodekuaiBase.apply(this,arguments)
}

PaodekuaiXuzhou.prototype = Object.create(PaodekuaiBase.prototype);
PaodekuaiXuzhou.prototype.constructor = PaodekuaiXuzhou

// 1 - 52  方块A:1 梅花A:2 红心A:3 黑桃A:4 -- 黑桃王:52
// 1.16张玩法为现有的没有大小王、只有一个2、三个A的玩法 一共48张
// 2.15张玩法：在16张的基础上，再去掉两个A（剩红桃A）、一个K（去掉黑桃K），一共45张
PaodekuaiXuzhou.prototype.randomCards = function(areaSelectMode, tData) {
    var cards = [];
    var handCardNum = 0 == areaSelectMode['cardNumIndex'] ? 16 : 15;
    this.handCount = handCardNum;
    var allHandCardNum = handCardNum * tData.maxPlayer;
    // 没有大小王的 52 张牌
    for (var i = 1; i <= 52; i++) {
        cards.push(i);
    }

    // 去掉 方块2 梅花2 红心2
    cards.splice( cards.indexOf(this.cardCfg.fk[2]), 1 );
    cards.splice( cards.indexOf(this.cardCfg.mh[2]), 1 );
    cards.splice( cards.indexOf(this.cardCfg.hx[2]), 1 );

    // 去跳黑桃A
    cards.splice( cards.indexOf(this.cardCfg.ht[1]), 1 );

    // 15张玩法 
    if(15 == handCardNum){
        // 去掉 方块A 梅花A
        cards.splice( cards.indexOf(this.cardCfg.fk[1]), 1 );
        cards.splice( cards.indexOf(this.cardCfg.mh[1]), 1 );
        // 去掉 黑桃K
        cards.splice( cards.indexOf(this.cardCfg.ht[13]), 1 );
    }

    // 黑桃3先去掉, 确定人数后再放进牌堆， 保证黑桃3发到玩家手上, 拿黑桃3的先出
    cards.splice( cards.indexOf(this.cardCfg.ht[3]), 1 );

    // 洗牌
    cards.sort(function (a, b) {
        return .5 - Math.random();
    });

    // 取得对应人数的牌数 - 1
    cards = cards.slice(0, allHandCardNum - 1);

    // 黑桃3放进洗牌堆
    cards.push(this.cardCfg.ht[3]);

    // 洗牌
    cards.sort(function (a, b) {
        return .5 - Math.random();
    });

    return cards;
};

PaodekuaiXuzhou.prototype.formatFeiJiType = function(oCards, areaSelectMode){
    // 记录所有3张的数值
    var sanSameList = [];
    // 记录散牌
    var sanPaiList = [];
    var sanShunAndSanPai = this.getSanShunAndSanPai(oCards);

    sanSameList = sanShunAndSanPai[0];
    sanPaiList = sanShunAndSanPai[1];
    var feijiInfo = {}
    feijiInfo.BU_SHI_FEI_JI = 0 // 飞机类型: 不是飞机
    feijiInfo.DAI_CHI_BANG = 1; // 飞机类型: 带翅膀
    feijiInfo.DAN_ZHANG_CHI_BANG = 2;// 飞机类型: 带单张的翅膀
    feijiInfo.NO_CHI_BANG = 3;  // 飞机类型: 不带翅膀
    feijiInfo.value = 0;    // 飞机的牌值
    feijiInfo.type = feijiInfo.BU_SHI_FEI_JI; // 飞机类型
    feijiInfo.sanPaiCards = [];
    feijiInfo.sanZhangCards = [];

    if(!oCards) return feijiInfo;

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



    // 包含四张同样的牌不算飞机
    // for(var i=0; i < oCards.length; i++){
    //     var cardValue = this.calPoint(oCards[i]);
    //     var findCards = this.findNSameCard(oCards, cardValue, 4);
    //     if(findCards) return feijiInfo;
    // }


    if(0 == sanShunList.length) return feijiInfo;

    // 飞机带翅膀
    // var duiNum = this.countDuiNum(sanPaiList);
    // if(sanShunList.length/3 == duiNum) // 翅膀需要是对子  333-444555-6   333444-6789  
    if(areaSelectMode.can3daiNum == 2 && feijiInfo.type == feijiInfo.BU_SHI_FEI_JI && sanShunList.length/3 >= sanPaiList.length/2 && oCards.length % 5 == 0) // 翅膀任意牌
    {
        var feijiNum = sanShunList.length;
        var chibangNum = sanPaiList.length
        if (feijiNum / 3 > chibangNum / 2) {
            var diffNum = (2*feijiNum - 3*chibangNum) / 5
            sanPaiList = sanPaiList.concat( sanShunList.slice(feijiNum-diffNum , feijiNum) );
            sanShunList = sanShunList.slice(0 , feijiNum-diffNum);
        }
        feijiInfo.type = feijiInfo.DAI_CHI_BANG;

    }

    // 带对应单张的飞机
    // 如果是 用3张作翅膀的牌型: 555666777888  333444555666777888999101010 
    if(areaSelectMode.can3daiNum == 1 && feijiInfo.type == feijiInfo.BU_SHI_FEI_JI && 0 == sanShunList.length % 12 && 0 == sanPaiList.length)
        feijiInfo.type = feijiInfo.DAN_ZHANG_CHI_BANG;
    // 如果飞机和翅膀数量相等
    if(areaSelectMode.can3daiNum == 1 && feijiInfo.type == feijiInfo.BU_SHI_FEI_JI && sanPaiList.length == sanShunList.length/3)
        feijiInfo.type = feijiInfo.DAN_ZHANG_CHI_BANG;

    // 不带翅膀 的飞机
    // if(sanShunList.length > 0 && sanPaiList.length == 0)
    if(feijiInfo.type == feijiInfo.BU_SHI_FEI_JI && sanShunList.length > 0 && sanPaiList.length <= sanShunList.length/3*areaSelectMode.can3daiNum) // 任意翅膀数量的飞机
        feijiInfo.type = feijiInfo.NO_CHI_BANG;

    if(feijiInfo.type != feijiInfo.BU_SHI_FEI_JI){
        feijiInfo.value = sanShunList[sanShunList.length-1];
    }

    feijiInfo.sanPaiCards = sanPaiList;
    feijiInfo.sanZhangCards = sanShunList;
    // console.log('sanSameList', sanSameList.toString());
    // console.log('sanShunList', sanShunList.toString());
    // console.log('sanPaiList', sanPaiList.toString());
    return feijiInfo;
}

// 是否包含炸弹， 例: 55556 包含炸弹 5555不算包含炸弹
PaodekuaiXuzhou.prototype.isHadZhaDan = function(cards, areaSelectMode) {
    for(var i=0; i < cards.length; i++){
        var cardValue = this.calPoint(cards[i]);
        var isHadZhaDan = this.findNSameCard(cards, cardValue, 4);
        if(isHadZhaDan && cards.length > 4) return true;
    }

    if( areaSelectMode.can3aZhaDan ) {
        var isSanA = this.findNSameCard(cards, this.PDK_APOINT, 3);
        if(isSanA && cards.length > 3) return true;
    }

    if( areaSelectMode.can3ge3ZhaDan ) {
        var newHands = this.delPoint(cards, [this.cardCfg.ht[3]]);
        var isSan3 = this.findNSameCard(newHands, this.PDK_MINPOINT, 3);
        if (isSan3 && cards.length > 3) return true;
    }

    return false;
}

// 是否拆散了炸弹牌型
PaodekuaiXuzhou.prototype.isChaiZhaDan = function(handCards, putCards, areaSelectMode){
     // 炸弹不可拆 但是可以 四带2 四代3 等四张一块出
    for(var i=0; i < putCards.length; i++){
        var cardValue = this.calPoint(putCards[i]);
        var findHand = this.findNSameCard(handCards, cardValue, 4);
        var findCards = this.findNSameCard(putCards, cardValue, 4);
        // putCards 有属于炸弹的牌， 而且 没有包含完整的炸弹牌型
        if(findHand && !findCards) {
            return true;
        }

        var isPutA = this.findNSameCard(putCards, this.PDK_APOINT, 1);
        if( areaSelectMode.can3aZhaDan && isPutA) {
            // 3A的炸弹
            var findHand3A = this.findNSameCard(handCards, this.PDK_APOINT, 3);
            var findCards3A = this.findNSameCard(putCards, this.PDK_APOINT, 3);
            // 如果拆了3个A
            if(findHand3A && !findCards3A) {
                return true;
            } 
        }
    }

    return false;
}

/**
 * 判断是否是连对
 * @param {array} oCards 按点数排好序的牌
 * @return {bool}
 */
PaodekuaiXuzhou.prototype.isLiandui = function(oCards) { //oCards有序
    var cardNum = this.PDK_CARDCOUNT[this.CARDTPYE.liandui];// 连对最小牌数

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
 * @return {this.CARDTPYE} 牌型，-1 = 不成型
 */
PaodekuaiXuzhou.prototype.calType = function(pCards, areaSelectMode) {

    var maxSameCard = 0;
    var cards = pCards.slice();
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
            maxSameCard = p;
        }
    }

    // 三个A  和三顺牌型相似， 避免判断为三顺， 放到三顺前
    if (cardCount == this.PDK_CARDCOUNT[this.CARDTPYE.sangeA] && allSame && this.calPoint(cards[0]) == this.PDK_APOINT && areaSelectMode.can3aZhaDan)
        return this.CARDTPYE.sangeA || -1;

    // 三个3算炸弹   带黑桃3不算炸弹
    if (cardCount == this.PDK_CARDCOUNT[this.CARDTPYE.sange3] && allSame && this.calPoint(cards[0]) == this.PDK_MINPOINT && cards.indexOf(this.cardCfg.ht[3]) < 0 && areaSelectMode.can3ge3ZhaDan)
        return this.CARDTPYE.sange3 || -1;

    // 飞机
    if(cardCount >= 6 && maxCount >= 3 && this.isFeiJi(cards, areaSelectMode)!=0 ){
        return this.CARDTPYE.feiji || -1;
    }

    // 3顺
    // if(cardCount >= 3 && maxCount == 3 && this.isSanShun(cards)){
    //     return this.CARDTPYE.sanshun;
    // }

    // 顺子，5张起
    if (cardCount >= 5 && maxCount == 1 && this.isShun(cards))
        return this.CARDTPYE.shunzi || -1;

    // 连对，2对起
    if (cardCount >= this.PDK_CARDCOUNT[this.CARDTPYE.liandui] && maxCount == 2 && this.isLiandui(cards))
        return this.CARDTPYE.liandui || -1;

    // 四带三
    if (cardCount == 7 && maxCount == 4 )
        return this.CARDTPYE.sidaisan || -1;

    //四带二
    if (cardCount == 6 && maxCount == 4 )
        return this.CARDTPYE.sidaier || -1;

    //四炸
    if (cardCount == 4 && allSame)
        return this.CARDTPYE.sizha || -1;

    // 三带二
    if (cardCount == this.PDK_CARDCOUNT[this.CARDTPYE.sandaier] && maxCount >= 3 && areaSelectMode.can3daiNum == 2)
        return this.CARDTPYE.sandaier || -1;

    //三带一
    if (cardCount == 4 && maxCount == 3)
        return this.CARDTPYE.sandaiyi || -1;

    // 三张
    if (cardCount == 3 && allSame)
        return this.CARDTPYE.sanzhang || -1;

    // 对子
    if (cardCount == 2 && allSame)
        return this.CARDTPYE.duizi || -1;

    // 单牌
    if (cardCount == 1)
        return this.CARDTPYE.danpai || -1;

    return -1;
};


/**
 * 是否首手必须先出红桃/黑桃3
 * @param  {array} oHands 我的手牌
 * @param  {object} areaSelectMode 创建房间的选项
 * @param  {Boolean} isFirstRound 是否第一局
 * @return {Boolean} 
 */
PaodekuaiXuzhou.prototype.isMustPutCard3 = function(oHands, areaSelectMode, isFirstRound) {
    return (isFirstRound || (areaSelectMode && areaSelectMode.firstHeiTao3)) && oHands.indexOf(this.cardCfg.firstOutCard)>=0;
}


/** 
 * 牌是否能压上
 * @param {array} oCards 按点数排好序的牌/选择了的手牌
 * @param {array} [oLastCards] 按点数排好序的牌/最后打出的牌
 * @param {number} [handsNum] 手牌数量
 */
PaodekuaiXuzhou.prototype.canPut = function(oCards, oLastCards, handsNum, areaSelectMode) {

    var cardsType = this.calType(oCards, areaSelectMode);

    // cc.log("PaodekuaiXuzhou.prototype.canPut oCards:", oCards );
    // cc.log("oLastCards" , oLastCards );
    // cc.log("handsNum" , handsNum );
    // cc.log("canPut cardsType", cardsType)
    // 如果客户端调用时 没有 传areaSelectMode

    if (cardsType == -1)
        return false;

    var canPutLastType = false;
    var canPutAnyType = [];     // 最后一手同类牌比较
    if( cardsType == this.CARDTPYE.sanzhang || (cardsType == this.CARDTPYE.sandaiyi && areaSelectMode.can3daiNum == 2) ){
        if( areaSelectMode.canPutAnySanZhang && oCards.length == handsNum && oLastCards) {
            canPutAnyType.push(this.CARDTPYE.sandaiyi);
            canPutAnyType.push(this.CARDTPYE.sandaier);
            canPutAnyType.push(this.CARDTPYE.sanzhang);
            canPutLastType = true;
        } else if ( oCards.length == handsNum && !oLastCards) {
            return true;
        } else {
            return false;
        }
    }

    // 最后一手出不完整的飞机， 3带1 3张 检测
    if( cardsType == this.CARDTPYE.feiji ) {
        var feijiInfo = this.formatFeiJiType(oCards, areaSelectMode);
        if(feijiInfo.type == feijiInfo.NO_CHI_BANG){
            if( areaSelectMode.canPutAnyFeiji && oLastCards ) {
                canPutLastType = true;
                canPutAnyType.push(this.CARDTPYE.feiji);
            }else if ( oCards.length == handsNum && !oLastCards) {
                return true;
            } else {
                return false;
            }
        }
    }

    // 最后一手牌
    if( canPutLastType ){
        if (oCards.length == handsNum )
        {
            if (!oLastCards || oLastCards.length==0 || oLastCards=='undefined')
                return true;

            var lastCardsType = this.calType(oLastCards, areaSelectMode);
            if(canPutAnyType.indexOf(lastCardsType) >= 0 ) {
                var typeValue = this.calCardsValue(oCards, cardsType, areaSelectMode);
                var lastTypeValue = this.calCardsValue(oLastCards, lastCardsType, areaSelectMode);
                return typeValue > lastTypeValue;
            } else {
                return false;
            }

        } else {
            return false;
        }
    }

    // 没有上次打的牌，三家过自己再出牌
    if (!oLastCards || oLastCards.length==0 || oLastCards=='undefined')
        return true;

    if ((cardsType == this.CARDTPYE.shunzi || cardsType == this.CARDTPYE.liandui) && oCards.length != oLastCards.length)
        return false;

    oCards.sort(this.cardValueCmp.bind(this));
    oLastCards.sort(this.cardValueCmp.bind(this));

    var lastCardsType = this.calType(oLastCards, areaSelectMode);
    if (cardsType == lastCardsType && oCards.length == oLastCards.length) {
        var typeValue = this.calCardsValue(oCards, cardsType, areaSelectMode);
        var lastTypeValue = this.calCardsValue(oLastCards, lastCardsType, areaSelectMode);
        return typeValue > lastTypeValue;
    }
    else if(this.PDK_CARD_VALUE[cardsType]) {
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
PaodekuaiXuzhou.prototype.checkPut = function(oHands, cards, lastCards, areaSelectMode, isNextPlayerOneCard, isFirstRound) {
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

    // 第一局 黑桃三先出时 有黑桃三必须出
    if ((isFirstRound || areaSelectMode && areaSelectMode.firstHeiTao3) && cards.indexOf(this.cardCfg.ht[3])<0 && oHands.indexOf(this.cardCfg.ht[3])>=0){
        return null;
    }

    if(!areaSelectMode && cc ) {
        areaSelectMode = MjClient.data.sData.tData.areaSelectMode;
    }


    var cardType = this.calType(cards, areaSelectMode);
    var pthis = this;

    // 炸弹不可拆 但是可以 四带2 四代3 等四张一块出
    if(areaSelectMode && areaSelectMode.zhaDanBuChai && this.isChaiZhaDan(oHands, cards, areaSelectMode) ){
        return null;
    }

    // 四带二
    if(cardType == this.CARDTPYE.sidaier && areaSelectMode && !areaSelectMode.can4dai2){
        return null
    }

    // 四带三
    if(cardType == this.CARDTPYE.sidaisan && areaSelectMode && !areaSelectMode.can4dai3){
        return null
    }

    // 如果 下家报单 提起的一张牌 不是最大的牌
    var sortHand = oHands.slice();
    sortHand.sort(this.cardValueCmp.bind(this));
    var maxCards = this.getAllMaxCard(oHands);
    if(isNextPlayerOneCard && cards.length==1 && this.calPoint(maxCards[0]) != this.calPoint(cards[0]) ){
        console.log('下家报单需要出最大牌')
        return null;
    }


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
        console.log('checkput canput')
        return hands; // 能打得过上家的牌
    }
    return null;
};

/** 
 * 用laizi张癞子去拼出type牌型的牌
 * @param {array} hands 按点数按好序的牌
 * @param {number} laizi 所使用的癞子数
 * @param {this.CARDTPYE} type 要拼出的牌型
 * @param {array} lastCards 最后一手牌
 * @param {object}  areaSelectMode 玩法选项
 * @return {array} 拼好的 
 */
PaodekuaiXuzhou.prototype.findCardByType = function(hands, laizi, type, lastCards, areaSelectMode, buChaiTypes) {
    var rets = [];
    var laizis = [];
    var cardNum = lastCards != null ? lastCards.length : null;
    var cardCount = this.PDK_CARDCOUNT[type];

    if (cardNum && (type == this.CARDTPYE.liandui || type == this.CARDTPYE.shunzi))
        cardCount = cardNum;

    if (laizi > cardCount || laizi + hands.length < cardCount) {
        // 如果是用所有手牌压 飞机 或 三带二 , 牌数少于被压的牌
        if(type != this.CARDTPYE.feiji && type != this.CARDTPYE.sandaier)
            return rets;
    }

    for (var i = 0; i < laizi; i++) {
        laizis.push(this.laiziCard);
    }

    if (type == this.CARDTPYE.feiji && hands.length >= cardCount) {
        var handFeiji = this.getSanShunAndSanPai(hands);
        var handCardSanZhangNum = handFeiji[0].length/3;
        var handCardSanPaiNum = handFeiji[1].length;

        if (handCardSanZhangNum >= 2)
        {
            if (lastCards && lastCards != -1 && lastCards.length > 0)
            {
                var feijiInfo = this.formatFeiJiType(lastCards, areaSelectMode);
        
                var lastCardSanZhangNum = feijiInfo.sanZhangCards.length/3;
                var lastCardSanPaiNum = feijiInfo.sanPaiCards.length;

                if(handCardSanZhangNum >= lastCardSanZhangNum){
                    var sanShun = [];
                    var sanpai = [];
                    for(var i=0; i<handCardSanZhangNum; i++){
                        var startSanIndex = i*3;
                        var lastSanIndex = i*3+lastCardSanZhangNum*3;
                        sanShun = handFeiji[0].slice(startSanIndex, lastSanIndex)
                        if(sanShun.length != feijiInfo.sanZhangCards.length) continue;
                        var feiJiValue_a = this.formatFeiJiType(handFeiji[0], areaSelectMode).value;
                        var feiJiValue_b = feijiInfo.value;
                        if(feiJiValue_a < feiJiValue_b) continue;
                        sanpai = handFeiji[0].slice(0, startSanIndex);
                        sanpai = sanpai.concat(handFeiji[0].slice(lastSanIndex, handFeiji[0].length));//-lastSanIndex));
                        sanpai = sanpai.concat(handFeiji[1]);
                        var allSanPaiZhuHe = [];
                        if (this.useNewTip) {
                            allSanPaiZhuHe = this.findDaiPai(sanpai, this.CARDTPYE.feiji, lastCardSanPaiNum, false, buChaiTypes);
                        } else {
                            for(var j=0; j < sanpai.length && sanpai.length >= j+lastCardSanPaiNum; j++) {  // 依次散牌组合
                                var cards = sanpai.slice(j, j+lastCardSanPaiNum);
                                allSanPaiZhuHe.push(cards);
                            }
                        }
                        if (allSanPaiZhuHe.length > 0) {
                            for(var j in allSanPaiZhuHe){
                                var ret = sanShun.concat( allSanPaiZhuHe[j] );
                                if(this.isFeiJi(ret, areaSelectMode) != 0){
                                    rets.push(ret);
                                }
                            }
                        }
                        else // 如果飞机是最后一手， 可以打出
                        {
                            var ret = sanShun.concat(sanpai)
                            rets.push(ret);
                        }
                    }
                }
            }
            else
            {
                // 先手

                // var lastCardSanZhangNum = 0;
                // var lastCardSanPaiNum = 0;
                // for(var k = handCardSanZhangNum; k >= 2; k--)
                // {
                //     lastCardSanZhangNum = k;

                //     for(var m = lastCardSanZhangNum; m >= 0; m--)
                //     {
                //         lastCardSanPaiNum = Math.min(handCardSanPaiNum,m*2);

                //         if(handCardSanZhangNum >= lastCardSanZhangNum)
                //         {
                //             var sanShun = [];
                //             var sanpai = [];

                //             for(var i=0; i<handCardSanZhangNum; i++)
                //             {
                //                 var startSanIndex = i*3;
                //                 var lastSanIndex = i*3+lastCardSanZhangNum*3;

                //                 sanShun = handFeiji[0].slice(startSanIndex, lastSanIndex)
                //                 sanpai = handFeiji[0].slice(0, startSanIndex);
                //                 sanpai = sanpai.concat(handFeiji[0].slice(lastSanIndex, handFeiji[1].length-lastSanIndex));
                //                 sanpai = sanpai.concat(handFeiji[1]);
                                
                //                 var allSanPaiZhuHe = [];

                //                 if (this.useNewTip) 
                //                 {
                //                     allSanPaiZhuHe = this.findDaiPai(sanpai, this.CARDTPYE.feiji, lastCardSanPaiNum, false, buChaiTypes);
                //                 } 
                //                 else 
                //                 {
                //                     for(var j=0; j < sanpai.length && sanpai.length >= j+lastCardSanPaiNum; j++) 
                //                     {  
                //                         // 依次散牌组合
                //                         var cards = sanpai.slice(j, j+lastCardSanPaiNum);
                //                         allSanPaiZhuHe.push(cards);
                //                     }
                //                 }

                //                 if (allSanPaiZhuHe.length > 0) 
                //                 {
                //                     for(var j in allSanPaiZhuHe)
                //                     {
                //                         var ret = sanShun.concat( allSanPaiZhuHe[j] );

                //                         ret.sort(this.cardValueCmp.bind(this));

                //                         if(this.isFeiJi(ret, areaSelectMode) != 0)
                //                         {
                //                             rets.push(ret);
                //                         }
                //                     }
                //                 }
                //                 else // 如果飞机是最后一手， 可以打出
                //                 {
                //                     var ret = sanShun.concat(sanpai)
                //                     rets.push(ret);
                //                 }
                //             }
                //         }
                //     }
                // }
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
            var newHands = this.delPoint(hands, [this.cardCfg.ht[3]]);
            var find = this.findNSameCard(newHands, this.PDK_MINPOINT, 3);
            if (find)   rets.push(find);
        }
    }
    else if (type == this.CARDTPYE.sizha  || type == this.CARDTPYE.duizi || type == this.CARDTPYE.sanzhang) { 
        for (var i = this.PDK_MINPOINT; i <= this.PDK_MAXPOINT; i++) {
            var find = this.findNSameCard(hands, i, cardCount - laizi);
            if (find) {
                rets.push(laizis.concat(find));
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

                if (this.useNewTip) {
                    var findCards = this.findDaiPai(newHands, type, 2, false, buChaiTypes);
                    for (var j in findCards) {
                        var ret = laizis.concat(temp1);
                        ret = ret.concat(findCards[j]);
                        if (!this.indexOfCards(rets, ret)) 
                            rets.push(ret);
                    }
                }
                else {
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


                // 如果是有3张， 但手牌数量不够组成3带二，可以用3带1 或 3张打
                if(rets.length == 0) {
                    rets.push(hands);
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

                var newHands = this.delPoint(hands, [i]);
                if (this.useNewTip) {
                    var findCards = this.findDaiPai(newHands, type, 1, false, buChaiTypes);
                    for (var j in findCards) {
                        var ret = laizis.concat(temp1);
                        ret = ret.concat(findCards[j]);
                        rets.push(ret);
                    }
                }
                else {
                    for(var j=0; j < newHands.length; j++)
                    {
                        var ret = laizis.concat(temp1);
                        ret.push(newHands[j]);
                        rets.push(ret); 
                    }
                }

                // 如果是有3张， 但手牌数量不够组成3带一，可以3张打
                if(rets.length == 0) {
                    rets.push(hands);
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
            var handsCopy = hands.slice();
            handsCopy.sort(this.cardValueCmp.bind(this));

            for (var i = this.PDK_MINPOINT; i <= this.PDK_MAXPOINT; i++) 
            {
                // cc.log("findCardByType hands " + hands + " i = " + i);

                // 效率太低，废弃
                // var find = this.findNSameCard(hands, i, 1);
                // if (find)
                //     rets.push(find);

                for (var j = 0; j < handsCopy.length; j++) {
                    if (this.calPoint(handsCopy[j]) == i) {
                        rets.push([handsCopy[j]]);
                        break;
                    }
                }
            }
        }
    }
    else if (type == this.CARDTPYE.sidaier){
        for (var i = this.PDK_MINPOINT; i <= this.PDK_MAXPOINT; i++)
        {
            var find = this.findNSameCard(hands, i, 4);
            if(!find)
                continue;

            var newHands = this.delPoint(hands, [i]);
            if (this.useNewTip) {
                var findCards = this.findDaiPai(newHands, type, 2, false, buChaiTypes);
                for (var j in findCards) {
                    var ret = laizis.concat(find);
                    ret = ret.concat(findCards[j]);
                    rets.push(ret);
                }
            } else {
                for(var j=1; j < newHands.length; j++)
                {
                    var ret = laizis.concat(find);
                    ret.push(newHands[j-1]);
                    ret.push(newHands[j]);
                    rets.push(ret); 
                }
            }
        }
    }
    else if (type == this.CARDTPYE.sidaisan){
        for (var i = this.PDK_MINPOINT; i <= this.PDK_MAXPOINT; i++)
        {
            var find = this.findNSameCard(hands, i, 4);
            if(!find)
                continue;

            var newHands = this.delPoint(hands, [i]);
            if (this.useNewTip) {
                var findCards = this.findDaiPai(newHands, type, 3, false, buChaiTypes);
                for (var j in findCards) {
                    var ret = laizis.concat(find);
                    ret = ret.concat(findCards[j]);
                    rets.push(ret);
                }
            } else {
                for(var j=2; j < newHands.length; j++)
                {
                    var ret = laizis.concat(find);
                    ret.push(newHands[j-1]);
                    ret.push(newHands[j-2]);
                    ret.push(newHands[j]);
                    rets.push(ret); 
                }
            }
        }
    }

    // 如果是最后一手牌， 可以接张数不一样类型相同的牌
    // 适用于 飞机牌型 和 三张牌型
    // 例如 3带2 可用 3带1 或 3张接
    if(cardNum >= hands.length && rets.length == 0) {
        rets.push(hands);
    }

    return rets;
};

// 此函数只供提示出牌调用
PaodekuaiXuzhou.prototype.findCardByType_fast = function(hands, laizi, type, lastCards, buChaiTypes) {
    if (!this.findCardByTypeCache)
        this.findCardByTypeCache = [];
    
    var argumentsStr = JSON.stringify(arguments);
    for (var i = 0; i < this.findCardByTypeCache.length; i ++) {
        if (this.findCardByTypeCache[i].argumentsStr == argumentsStr)
            return JSON.parse(this.findCardByTypeCache[i].retValueStr);
    }
    
    var areaSelectMode = {};
    if(typeof(MjClient)!="undefined"){//(MjClient && MjClient.data.sData) {// findCardByType_fast 客户端提示用
        areaSelectMode = MjClient.data.sData.tData.areaSelectMode;
    }
    var retValue = this.findCardByType(hands, laizi, type, lastCards, areaSelectMode, buChaiTypes);
    this.findCardByTypeCache.push({argumentsStr: argumentsStr, retValueStr: JSON.stringify(retValue)});
    return retValue;
}

/**
 * 提示可出的牌
 * @param  {array} oHands 我的手牌
 * @param  {array} oLastCards 上家出的牌
 * @param  {Boolean} areaSelectMode 创建房间的选项
 * @param  {Boolean} isNextPlayerOneCard 下家是否报单
 * @param  {Boolean} isFirstRound 是否第一局
 * @param  {Boolean} isSmartTip   是否使用智能提示
 * @return {array} 提示的牌
 */
PaodekuaiXuzhou.prototype.tipCards = function(oHands, oLastCards, areaSelectMode, isNextPlayerOneCard, isFirstRound, isSmartTip) {
    if(isSmartTip) {
        this.canPutTypesCache = [];

        this.useNewTip = true;
        var ret = this.findPutTipCards(oHands, oLastCards, areaSelectMode, isNextPlayerOneCard, isFirstRound);
        this.useNewTip = false;
        if (ret.length > 0) return ret;
    }
    cc.log("----------------tipCards", oLastCards)
    //  第一个局 当勾“先出黑桃三”选项时，提示出黑桃三
    if ((isFirstRound || (areaSelectMode && areaSelectMode.firstHeiTao3)) && oHands.indexOf(this.cardCfg.ht[3])>=0) {
           return [[this.cardCfg.ht[3]]]
    }

    // 第一个出牌时
    var isFirstPlayerPut = (!oLastCards || oLastCards == -1 || oLastCards.length == 0);
    if(isFirstPlayerPut)
    {
        var sortHands = oHands.slice();
        sortHands.sort(this.cardValueCmp.bind(this));
        return [[sortHands[sortHands.length - 1]]];
    }
    
    var hands = [];
    var handLaizi = this.transformAndGetLaizi(oHands, hands);
    var lastCardsType = this.calType(oLastCards, areaSelectMode);
    var rets = [];

    for (var laizi = 0; laizi <= handLaizi; laizi++) {
        if(lastCardsType ==  this.CARDTPYE.sizha) break;
        if(lastCardsType ==  this.CARDTPYE.sangeA) break;
        
        var sameTypeCards = this.findCardByType(hands, laizi, lastCardsType, oLastCards, areaSelectMode);
        for (var i = 0; i < sameTypeCards.length; i++) {

            // 炸弹不可拆 但是可以 四带2 四代3 等四张一块出
            if( areaSelectMode && areaSelectMode.zhaDanBuChai && this.isChaiZhaDan(oHands, sameTypeCards[i], areaSelectMode) ){
                continue;
            }

            if (this.canPut(sameTypeCards[i], oLastCards, oHands.length, areaSelectMode)) {
                rets.push(sameTypeCards[i]);
            }
        }
    }

    //  下家报单强制出最大
    if(isNextPlayerOneCard){
        // 如果上家出牌且是一张，  才使用报单提示
        if(rets.length>0 && oLastCards && oLastCards.length <= 1 ){
            rets = this.getAllMaxCard(oHands);
        // 如果上家没有出牌， 使用报单提示
        }else if(rets.length>0 && !oLastCards || oLastCards == -1 ){
            rets = this.getAllMaxCard(oHands);
        }
    }

    if (areaSelectMode.can3ge3ZhaDan) {
        var cardtypes = this.findCardByType(hands, 0, this.CARDTPYE.sange3, null, areaSelectMode);
        for (var i = 0; i < cardtypes.length; i++) {
            if (this.canPut(cardtypes[i], oLastCards, oHands.length, areaSelectMode)) {
                rets.push(cardtypes[i]);
            }
        }
    }

    var booms = this.findCardByType(hands, 0, this.CARDTPYE.sizha, null, areaSelectMode);
    // 不是压三带二的时候， 最后提示炸弹
    for (var i = 0; i < booms.length; i++) {
        if (this.canPut(booms[i], oLastCards, oHands.length, areaSelectMode)) {
            rets.push(booms[i]);
        }
    }

    // 压三带二的时候， 先提示炸弹 , 对提示的牌型进行排序
    if(lastCardsType == this.CARDTPYE.sandaier) {
        rets = this.sortByCardType(rets, areaSelectMode);
    }

    if(areaSelectMode.can3aZhaDan){
        rets = rets.concat(this.findCardByType(hands, 0, this.CARDTPYE.sangeA, null, areaSelectMode) );
    }
    return rets;
};

if(typeof(module)!="undefined" && module.exports)    
    module.exports = PaodekuaiXuzhou;

if(typeof(MjClient)!="undefined")
    MjClient.majiang_paodekuaiXuzhou = new PaodekuaiXuzhou();
})();