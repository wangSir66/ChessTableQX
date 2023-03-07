//跑得快算法类
(function() {
function PaodekuaiJZ() {
    PaodekuaiBase.apply(this,arguments)

    this.CARDTPYE.sange3 = null;

    //智能提示
    this.allTipsNoOrder = null;
}

PaodekuaiJZ.prototype = Object.create(PaodekuaiBase.prototype);
PaodekuaiJZ.prototype.constructor = PaodekuaiJZ

// 1 - 52  方块A:1 梅花A:2 红心A:3 黑桃A:4 -- 黑桃王:52
// 1.16张玩法为现有的没有大小王、只有一个2、三个A的玩法 一共48张
// 2.15张玩法：在16张的基础上，再去掉两个A（剩红桃A）、一个K（去掉黑桃K），一共45张
PaodekuaiJZ.prototype.randomCards = function(areaSelectMode, tData) {
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
    shuffleArray(cards);

    // 取得对应人数的牌数 - 1
    cards = cards.slice(0, allHandCardNum - 1);

    // 黑桃3放进洗牌堆
    cards.push(this.cardCfg.ht[3]);

    // 洗牌
    shuffleArray(cards);

    return cards;
};

PaodekuaiJZ.prototype.formatFeiJiType = function(oCards){
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
    feijiInfo.ANY_CHI_BANG = 4;  // 飞机类型: 翅膀可以是任意牌，任意数量
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
    // if(sanShunList.length/3 == duiNum) // 翅膀需要是对子  333-444555-6   333444-6789
    if(feijiInfo.type == feijiInfo.BU_SHI_FEI_JI && sanShunList.length/3 >= sanPaiList.length/2 && oCards.length % 5 == 0) // 翅膀任意牌，但是必须 3:2
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
    // if(feijiInfo.type == feijiInfo.BU_SHI_FEI_JI && 0 == sanShunList.length % 12 && 0 == sanPaiList.length)
    //     feijiInfo.type = feijiInfo.DAN_ZHANG_CHI_BANG;
    // // 如果飞机和翅膀数量相等
    // if(feijiInfo.type == feijiInfo.BU_SHI_FEI_JI && sanPaiList.length == sanShunList.length/3)
    //     feijiInfo.type = feijiInfo.DAN_ZHANG_CHI_BANG;

    // 不带翅膀 的飞机
    // if(sanShunList.length > 0 && sanPaiList.length == 0)
    //     feijiInfo.type = feijiInfo.NO_CHI_BANG;

    if(feijiInfo.type == feijiInfo.BU_SHI_FEI_JI && sanShunList.length > 0 && sanPaiList.length <= sanShunList.length/3*2) // 任意翅膀数量的飞机, 3:xs
        feijiInfo.type = feijiInfo.ANY_CHI_BANG;

    if(feijiInfo.type != feijiInfo.BU_SHI_FEI_JI){
        feijiInfo.value = sanShunList[sanShunList.length-1];
    }

    // console.log('sanSameList', sanSameList.toString());
    // console.log('sanShunList', sanShunList.toString());
    // console.log('sanPaiList', sanPaiList.toString());
    return feijiInfo;
}

PaodekuaiJZ.prototype.isZhaDan = function(oCards, areaSelectMode) {
    if(!oCards || oCards.length ==0) return false;

    // 四炸
    var cardNum = this.PDK_CARDCOUNT[this.CARDTPYE.sizha];
    if(oCards.length == cardNum) {
        var allSame = true;
        for (var i=1; i < oCards.length; i++){
            if( this.calPoint(oCards[i]) != this.calPoint(oCards[i-1]) )
                allSame = false;
        }
        return allSame;
    }

    // 3个A作炸弹
    if( areaSelectMode.can3aZhaDan && oCards.length == 3) {
        for (var i=1; i < oCards.length; i++){
            if( this.calPoint(oCards[i]) != this.PDK_APOINT) {
                return false;
            }
        }
        return true;
    }
}

PaodekuaiJZ.prototype.isHadZhaDan = function(cards, areaSelectMode) {
    for(var i=0; i < cards.length; i++){
        var cardValue = this.calPoint(cards[i]);
        var isHadZhaDan = this.findNSameCard(cards, cardValue, 4);
        if(isHadZhaDan) return true;
    }

    if( areaSelectMode.can3aZhaDan ) {
        var isSanA = this.findNSameCard(cards, this.PDK_APOINT, 3);
    }

    return false;
}

/** 
 * 牌是否能压上
 * @param {array} oCards 按点数排好序的牌/选择了的手牌
 * @param {array} [oLastCards] 按点数排好序的牌/最后打出的牌
 * @param {number} [handsNum] 手牌数量
 */
PaodekuaiJZ.prototype.canPut = function(oCards, oLastCards, handsNum, areaSelectMode) {

    var cardsType = this.calType(oCards, areaSelectMode);

    // cc.log("PaodekuaiJZ.prototype.canPut oCards:", oCards );
    // cc.log("oLastCards" , oLastCards );
    // cc.log("handsNum" , handsNum );
    // cc.log("canPut cardsType", cardsType)
    // 如果客户端调用时 没有 传areaSelectMode

    if (cardsType == -1)
        return false;

    // 3张 或 3带1 只能在最后一手牌出
    if (cardsType == this.CARDTPYE.sanzhang || cardsType == this.CARDTPYE.sandaiyi){
        if( oCards.length == handsNum ){
            return true;
        }
        return false;
    }

    // 单张翅膀 和 不带翅膀的飞机最后一手可以出
    if (cardsType == this.CARDTPYE.feiji){
        var feijiInfo = this.formatFeiJiType(oCards);
        if(feijiInfo.type == feijiInfo.ANY_CHI_BANG){
            if(oCards.length == handsNum){
                return true;
            }else{
                return false;
            }
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
    else if (cardsType == this.CARDTPYE.sangeA && lastCardsType != this.CARDTPYE.sangeA) {
        return true;
    }
    else if (cardsType == this.CARDTPYE.sizha && lastCardsType != this.CARDTPYE.sangeA) {
        return true;
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
PaodekuaiJZ.prototype.checkPut = function(oHands, cards, lastCards, areaSelectMode, isNextPlayerOneCard, isFirstRound) {
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

    // 第一局 黑桃三先出时 有黑桃三必须出 晋中不用必出3
    // if (isFirstRound && areaSelectMode && areaSelectMode.firstHeiTao3 && cards.indexOf(this.cardCfg.ht[3])<0 && oHands.indexOf(this.cardCfg.ht[3])>=0){
    //     return null;
    // }

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
    var maxCards = this.getAllMaxCard(oHands);
    if(isNextPlayerOneCard && areaSelectMode.baoDanPutMax && cards.length==1 && this.calPoint(maxCards[0]) != this.calPoint(cards[0]) )
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

/** 
 * 用laizi张癞子去拼出type牌型的牌
 * @param {array} hands 按点数按好序的牌
 * @param {number} laizi 所使用的癞子数
 * @param {this.CARDTPYE} type 要拼出的牌型
 * @param {array} lastCards 最后一手牌
 * @param {array} 拼好的 
 */
PaodekuaiJZ.prototype.findCardByType = function(hands, laizi, type, lastCards) {
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

                var newHands = this.delPoint(hands, [i]);
                for(var j=0; j < newHands.length; j++)
                {
                    var ret = laizis.concat(temp1);
                    ret.push(newHands[j]);
                    rets.push(ret); 
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
        for (var i = this.PDK_MINPOINT; i <= this.PDK_MAXPOINT; i++)
        {
            var find = this.findNSameCard(hands, i, 4);
            if(find){
                var newHands = this.delPoint(hands, [i]);
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
            if(find){
                var newHands = this.delPoint(hands, [i]);
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
PaodekuaiJZ.prototype.tipCards = function(oHands, oLastCards, areaSelectMode, isNextPlayerOneCard, isFirstRound) {
    //  第一个局 当勾“先出黑桃三”选项时，提示出黑桃三
    // if (isFirstRound && areaSelectMode && areaSelectMode.firstHeiTao3 && oHands.indexOf(this.cardCfg.ht[3])>=0 ) {
    //        return [[this.cardCfg.ht[3]]]
    // }

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
        
        var sameTypeCards = this.findCardByType(hands, laizi, lastCardsType, oLastCards);
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

    // 下家报单强制出最大 晋中跑单可以不出最大，不出最大造成下家又赢了需要包分
    // 报单出大牌，需要出最大单牌
    if(isNextPlayerOneCard && areaSelectMode.baoDanPutMax){
        // 如果上家出牌且是一张，  才使用报单提示
        if(rets.length>0 && oLastCards && oLastCards.length <= 1 ){
            rets = this.getAllMaxCard(oHands);
        // 如果上家没有出牌， 使用报单提示
        }else if(rets.length>0 && !oLastCards || oLastCards == -1 ){
            rets = this.getAllMaxCard(oHands);
        }
    }

    var booms = this.findCardByType(hands, 0, this.CARDTPYE.sizha);
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
        rets = rets.concat(this.findCardByType(hands, 0, this.CARDTPYE.sangeA) );
    }
    return rets;
};

/**
 * 如果是有效牌型，剔除带牌
 * @param  {array} Cards 牌组
 * @param  {Boolean} areaSelectMode 创建房间的选项
 */
PaodekuaiJZ.prototype.delDaipai = function(Cards, areaSelectMode)
{
    var cardtype = this.calType(Cards, areaSelectMode);

    if (cardtype == this.CARDTPYE.sanshun ||
        cardtype == this.CARDTPYE.sangeA ||
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
    else if(cardtype == this.CARDTPYE.sidaisan||
            cardtype == this.CARDTPYE.sidaier)
        Cards = this.findNSameCard(Cards, point, 4);
    else if(cardtype == this.CARDTPYE.feiji)
    {
        var feiji  = this.formatFeiJiType(Cards,areaSelectMode);
        Cards = feiji.sanZhangCards;
    }

    return Cards;
}

if(typeof(module)!="undefined" && module.exports)    
    module.exports = PaodekuaiJZ;

if(typeof(MjClient)!="undefined")
    MjClient.majiang_PaodekuaiJZ = new PaodekuaiJZ();

})();