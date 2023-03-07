//跑得快算法类
(function() {
function PaodekuaiHuaian() {
    PaodekuaiBase.apply(this,arguments)
    this.cardCfg.firstOutCard = this.cardCfg.hx[3];

    //牌型
    this.CARDTPYE.sztonghua=110;
    this.CARDTPYE.sanshun = null;
    this.CARDTPYE.sandaiyi = null;

    this.PDK_CARDCOUNT[this.CARDTPYE.sztonghua] = 5;
    this.PDK_CARDCOUNT[this.CARDTPYE.szdaipai] = 8;

    this.PDK_CARD_VALUE[this.CARDTPYE.sztonghua] = 4;

    // 出牌提示顺序
    this.pdk_allZhaDan.push(this.CARDTPYE.sztonghua);
    // 出牌提示时不拆的所有牌型
    this.pdk_allBuChaiType.push(this.CARDTPYE.sztonghua);
}

PaodekuaiHuaian.prototype = Object.create(PaodekuaiBase.prototype);
PaodekuaiHuaian.prototype.constructor = PaodekuaiHuaian

// 1 - 52  方块A:1 梅花A:2 红心A:3 黑桃A:4 -- 黑桃王:52
// 1.16张玩法为现有的没有大小王、只有一个2、三个A的玩法 一共48张
// 2.15张玩法：在16张的基础上，再去掉两个A（剩红桃A）、一个K（去掉黑桃K），一共45张
PaodekuaiHuaian.prototype.randomCards = function(areaSelectMode, tData) {
    var cards = [];
    var handCardNum = 1 == areaSelectMode['cardNumIndex'] ? 15 : 16;
    this.handCount = handCardNum;
    var allHandCardNum = handCardNum * tData.maxPlayer;
    // 没有大小王的 52 张牌
    for (var i = 1; i <= 52; i++) {
        cards.push(i);
    }

    // 去掉 方块2 梅花2 黑桃2
    cards.splice( cards.indexOf(this.cardCfg.fk[2]), 1 );
    cards.splice( cards.indexOf(this.cardCfg.mh[2]), 1 );
    cards.splice( cards.indexOf(this.cardCfg.ht[2]), 1 );

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

    // 红心3先去掉, 确定人数后再放进牌堆， 保证红心3发到玩家手上, 拿红心3的先出
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

PaodekuaiHuaian.prototype.calFlower = function(num) {
    return (num + 3) % 4;
}

PaodekuaiHuaian.prototype.formatFeiJiType = function(oCards){
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
    feijiInfo.DAI_CHI_BANG = 1; // 飞机类型: 两张牌做翅膀
    feijiInfo.DAN_ZHANG_CHI_BANG = 2;// 飞机类型: 单张做翅膀
    feijiInfo.NO_CHI_BANG = 3;  // 飞机类型: 不带翅膀
    feijiInfo.value = 0;    // 飞机的牌值
    feijiInfo.type = feijiInfo.BU_SHI_FEI_JI; // 飞机类型
    feijiInfo.sanPaiCards = [];
    feijiInfo.sanZhangCards = [];


    // 包含四张同样的牌不算飞机
    for(var i=0; i < oCards.length; i++){
        var cardValue = this.calPoint(oCards[i]);
        var findCards = this.findNSameCard(oCards, cardValue, 4);
        if(findCards) return feijiInfo;
    }


    if(0 == sanShunList.length) return feijiInfo;

    // 两张牌做翅膀
    var duiNum = this.countDuiNum(sanPaiList);
    if(sanShunList.length/3 == duiNum) // 翅膀需要是对子  333-444-5556   
    // if(feijiInfo.type == feijiInfo.BU_SHI_FEI_JI && sanShunList.length/3 >= sanPaiList.length/2 && oCards.length % 5 == 0) // 翅膀任意牌 333444-6789 
        feijiInfo.type = feijiInfo.DAI_CHI_BANG;

    // 单张做翅膀
    // 如果是 用3张作翅膀的牌型: 555666777888  333444555666777888999101010 
    // if(feijiInfo.type == feijiInfo.BU_SHI_FEI_JI && 0 == sanShunList.length % 12 && 0 == sanPaiList.length)
    //     feijiInfo.type = feijiInfo.DAN_ZHANG_CHI_BANG;
    // 如果飞机和翅膀数量相等
    // if(feijiInfo.type == feijiInfo.BU_SHI_FEI_JI && sanPaiList.length == sanShunList.length/3)
    //     feijiInfo.type = feijiInfo.DAN_ZHANG_CHI_BANG;

    
    if(feijiInfo.type == feijiInfo.BU_SHI_FEI_JI && sanShunList.length > 0 && sanPaiList.length == 0)  // 不带翅膀 的飞机
    // if(feijiInfo.type == feijiInfo.BU_SHI_FEI_JI && sanShunList.length > 0 && sanPaiList.length <= sanShunList.length/3*2) // 任意翅膀数量的飞机
        feijiInfo.type = feijiInfo.NO_CHI_BANG;

    if(feijiInfo.type != feijiInfo.BU_SHI_FEI_JI){
        feijiInfo.value = sanShunList[sanShunList.length-1];

        feijiInfo.sanPaiCards = sanPaiList;
        feijiInfo.sanZhangCards = sanShunList;
    }

    // console.log('sanSameList', sanSameList.toString());
    // console.log('sanShunList', sanShunList.toString());
    // console.log('sanPaiList', sanPaiList.toString());
    return feijiInfo;
}

PaodekuaiHuaian.prototype.isZhaDan = function(oCards, areaSelectMode) {
    if(!oCards || oCards.length ==0) return false;

    var cardType = this.calType(oCards, areaSelectMode);

    // 四炸
    if( cardType == this.CARDTPYE.sizha
        || cardType == this.CARDTPYE.sangeA 
        || cardType == this.CARDTPYE.sange3 
        || cardType == this.CARDTPYE.sztonghua )
    {
        return true;
    } else {
        return false;
    }

}

PaodekuaiHuaian.prototype.isHadZhaDan = function(cards, areaSelectMode) {
    for(var i=0; i < cards.length; i++){
        var cardValue = this.calPoint(cards[i]);
        var isHadZhaDan = this.findNSameCard(cards, cardValue, 4);
        if(isHadZhaDan) return true;
    }

    if( areaSelectMode.can3aZhaDan ) {
        var isSanA = this.findNSameCard(cards, this.PDK_APOINT, 3);
        if(isSanA) return true;
    }

    var shunzis = this.findShunZi(cards, cards.length, true);
    if( shunzis ) return true;

    return false;
}

/**
 * 查找oCards是否有顺子或同花顺
 * @param  {Array} oCards 需要查找的牌
 * @param  {Number} cardNum 查找顺子牌数，最少5张牌
 * @param  {Boolean} isNeedSameFlower 是否查找同花顺
 * @return {Array} 如有顺子，返回牌数组， 否则返回Null
 */
PaodekuaiHuaian.prototype.findShunZi = function(oCards, cardNum, isNeedSameFlower) {
    // var cards = oCards.slice();
    // 从大到小排序， 牌面数值 1最小  k最大
    // cards.sort(this.sortBigCardValue.bind(this));
    if(cardNum < this.PDK_CARDCOUNT[this.CARDTPYE.shunzi]) return null;

    var getShunzis = function(_ocards, _cardNum) {
        var allsz = [];
        for (var pi = 1; pi <= this.PDK_APOINT - _cardNum + 1; pi++) { // 顺子首张
            var shun = [];

            for (var j = 0; j < _cardNum; j++) {
                var p = pi + j;
                var find = null;

                if(p == 1 || p == 2) {
                    for(var i in _ocards) {
                        if(this.calPoint(_ocards[i], true) == p) {
                            find = [_ocards[i]];
                        }
                    }

                } else {
                    find = this.findNSameCard(_ocards, p, 1)
                } 

                if (find)
                    shun = shun.concat(find);
            }
            if (shun.length == _cardNum )
                allsz.push(shun);
        }
        return allsz;

    }.bind(this);

    var shunzis = []

    if(isNeedSameFlower) {
        var flowers = {};

        for(var i in oCards) {
            var card = oCards[i];
            var flower = this.calFlower(card);
            if(!flowers[flower]) flowers[flower] = [];
            flowers[flower].push(card);
        }

        for(var i in flowers) {
            if(flowers[i].length >= cardNum)
                shunzis = shunzis.concat( getShunzis(flowers[i], cardNum) )
        }

    } else {
        shunzis = getShunzis(oCards, cardNum);
    }

    if(shunzis.length > 0) {
        return shunzis;
    } else {
        return null;        
    }
}

/**
 * 计算牌型
 * @param {array} cards 按点数排好序的牌
 * @return {this.CARDTPYE} 牌型，-1 = 不成型
 */
PaodekuaiHuaian.prototype.calType = function(pCards, areaSelectMode) {

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
    if ( this.CARDTPYE.sangeA > 0 && cardCount == this.PDK_CARDCOUNT[this.CARDTPYE.sangeA] && pointCounts[this.PDK_APOINT] == 3 && areaSelectMode.can3aZhaDan)
        return this.CARDTPYE.sangeA || -1;

    // 三个3 算炸弹  带红桃3不算炸弹
    if ( this.CARDTPYE.sange3 > 0 && cardCount == this.PDK_CARDCOUNT[this.CARDTPYE.sange3] && pointCounts[this.PDK_MINPOINT] == 3 && cards.indexOf(this.cardCfg.hx[3]) < 0 )
        return this.CARDTPYE.sange3 || -1;

    // 飞机
    if( this.CARDTPYE.feiji > 0 && cardCount >= 6 && maxCount >= 3 && this.isFeiJi(cards)!=0 ){
        return this.CARDTPYE.feiji || -1;
    }

    // 3顺
    if( this.CARDTPYE.sanshun > 0 && cardCount >= 3 && maxCount == 3 && this.isSanShun(cards)){
        return this.CARDTPYE.sanshun || -1;
    }

    // 同花顺
    if ( this.CARDTPYE.sztonghua > 0 && areaSelectMode.tongHuaShun && cardCount >= 5 && maxCount == 1 && this.findShunZi(cards, cardCount, true))
        return this.CARDTPYE.sztonghua || -1;

    // 同花顺带牌 同花顺5张可带3张牌，6张可带4张
    if ( this.CARDTPYE.szdaipai > 0 && areaSelectMode.tongHuaShun && cardCount >= 8 && this.findShunZi(cards, 5 + (cardCount - 8) / 2, true))
        return this.CARDTPYE.szdaipai || -1;

    // 顺子，5张起 
    if ( this.CARDTPYE.shunzi > 0 && cardCount >= 5 && maxCount == 1 && this.findShunZi(cards, cardCount, false) )
        return this.CARDTPYE.shunzi || -1;

    // 连对，2对起
    if ( this.CARDTPYE.liandui > 0 && cardCount >= this.PDK_CARDCOUNT[this.CARDTPYE.liandui] && maxCount == 2 && this.isLiandui(cards))
        return this.CARDTPYE.liandui || -1;

    // 四带三
    if ( this.CARDTPYE.sidaisan > 0 && cardCount == 7 && maxCount == 4 )
        return this.CARDTPYE.sidaisan || -1;

    //四带二
    if ( this.CARDTPYE.sidaier > 0 && cardCount == 6 && maxCount == 4 )
        return this.CARDTPYE.sidaier || -1;

    //四炸
    if ( this.CARDTPYE.sizha > 0 && cardCount == 4 && allSame)
        return this.CARDTPYE.sizha || -1;

    // 三带二
    if ( this.CARDTPYE.sandaier > 0 && areaSelectMode.can3dai2 && cardCount == this.PDK_CARDCOUNT[this.CARDTPYE.sandaier] && maxCount == 3 ) {
        for(var i in pointCounts) {
            // 只能3带对子
            if( pointCounts[i] == 2 ) return this.CARDTPYE.sandaier || -1;
        }
    }

    //三带一
    if (this.CARDTPYE.sandaiyi > 0 && cardCount == 4 && maxCount == 3 )
        return this.CARDTPYE.sandaiyi || -1;

    // 三张
    if ( this.CARDTPYE.sanzhang > 0 && cardCount == 3 && allSame)
        return this.CARDTPYE.sanzhang || -1;

    // 对子
    if ( this.CARDTPYE.duizi > 0 && cardCount == 2 && allSame)
        return this.CARDTPYE.duizi || -1;

    // 单牌
    if ( this.CARDTPYE.danpai > 0 && cardCount == 1)
        return this.CARDTPYE.danpai || -1;

    return -1;
};

PaodekuaiHuaian.prototype.cardsType = function(cards, areaSelectMode) {
    return this.calType(cards, areaSelectMode)
}

/**
 * 计算牌型点数
 * @param {array} cards 按点数排好序的牌
 * @return {number}
 */
PaodekuaiHuaian.prototype.calCardsValue = function(cards, type, areaSelectMode) {

    if (!cards || cards.length == 0)
        return -1;
    
    if (!type)
        type = this.calType(cards, areaSelectMode);
    
    var lastCard = cards[cards.length - 1];
        
    if (type == this.CARDTPYE.sandaier)
        return this.calPoint(cards[2]);

    if (type == this.CARDTPYE.sandaiyi)
        return this.calPoint(cards[2]);
    
    if (type == this.CARDTPYE.sidaier)
        return this.calPoint(cards[3]);
        
    if (type == this.CARDTPYE.sidaisan)
        return this.calPoint(cards[3]);

    if (type == this.CARDTPYE.feiji)
        return this.calPoint( this.isFeiJi(cards) );

    if (type == this.CARDTPYE.szdaipai) {
        var sznum = 5 + (cards.length - 8) / 2;
        var shunzis = this.findShunZi(cards, sznum, true);
        var sz = shunzis[0];
        sz.sort( this.sortBigCardValue.bind(this) );
        if(Math.ceil(sz[sz.length-1] / 4) == 1 && this.calPoint(sz[0]) == 13) return this.PDK_APOINT;    // KQJ10A 特需处理
        return this.calPoint( sz[ Math.ceil(sz.length/2) ], true )
    }

    if (type == this.CARDTPYE.shunzi || type == this.CARDTPYE.sztonghua) {
        cards.sort( this.sortBigCardValue.bind(this) );
        if(Math.ceil(cards[cards.length-1] / 4) == 1 && this.calPoint(cards[0]) == 13) return this.PDK_APOINT;    // KQJ10A 特需处理
        return this.calPoint( cards[ Math.ceil(cards.length/2) ], true )
    }


    // 单牌，对子，三张，顺子，连对，四炸，三个A
    return this.calPoint(lastCard);
};

PaodekuaiHuaian.prototype.sortBigCardValue = function(a, b) {
    var pa = Math.ceil(a / 4);
    var pb = Math.ceil(b / 4);
    if (pa == pb)
        return b - a;
    
    return pb - pa;
}

/** 
 * 牌是否能压上
 * @param {array} oCards 按点数排好序的牌/选择了的手牌
 * @param {array} [oLastCards] 按点数排好序的牌/最后打出的牌
 * @param {number} [handsNum] 手牌数量
 */
PaodekuaiHuaian.prototype.canPut = function(oCards, oLastCards, handsNum, areaSelectMode) {

    var cardsType = this.calType(oCards, areaSelectMode);

    // cc.log("PaodekuaiHuaian.prototype.canPut oCards:", oCards );
    // cc.log("oLastCards" , oLastCards );
    // cc.log("handsNum" , handsNum );
    // cc.log("canPut cardsType", cardsType)
    // 如果客户端调用时 没有 传areaSelectMode

    if (cardsType == -1)
        return false;

    // 3张 只能在最后一手牌出
    // if (cardsType == this.CARDTPYE.sanzhang){
    //     if( oCards.length == handsNum ){
    //         return true;
    //     }
    //     return false;
    // }

    // 单张翅膀 和 不带翅膀的飞机最后一手可以出
    // if (cardsType == this.CARDTPYE.feiji){
    //     var feijiInfo = this.formatFeiJiType(oCards);
    //     if(feijiInfo.type != feijiInfo.DAI_CHI_BANG){
    //         if(oCards.length == handsNum){
    //             return true;
    //         }else{
    //             return false;
    //         }
    //     }
    // }

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

/**
 * 是否首手必须先出红桃/黑桃3
 * @param  {array} oHands 我的手牌
 * @param  {object} areaSelectMode 创建房间的选项
 * @param  {Boolean} isFirstRound 是否第一局
 * @return {Boolean} 
 */
PaodekuaiHuaian.prototype.isMustPutCard3 = function(oHands, areaSelectMode, isFirstRound) {
    return (isFirstRound || (areaSelectMode && areaSelectMode.mustPutHongTaoSan)) && oHands.indexOf(this.cardCfg.firstOutCard)>=0;
}

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
PaodekuaiHuaian.prototype.checkPut = function(oHands, cards, lastCards, areaSelectMode, isNextPlayerOneCard, isFirstRound) {
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

    // 第一局 红桃三先出时 有红桃三必须出
    if ( (isFirstRound || areaSelectMode && areaSelectMode.mustPutHongTaoSan ) && cards.indexOf(this.cardCfg.hx[3])<0 && oHands.indexOf(this.cardCfg.hx[3])>=0){
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

    // 三个三 
    // if (cardType == this.CARDTPYE.sange3 && cards.indexOf(this.cardCfg.hx[3]) >= 0) {
    //     return null
    // }

    // 如果 下家报单 提起的一张牌 不是最大的牌
    var sortHand = oHands.slice();
    sortHand.sort(this.cardValueCmp.bind(this));
    var maxCards = this.getAllMaxCard(oHands);
    if(isNextPlayerOneCard && cards.length==1 && this.calPoint(maxCards[0]) != this.calPoint(cards[0]) )
        return null;


    var sortCards = cards;
    var sortLastCards = lastCards;

    if (typeof(sortLastCards) == "number")
        sortLastCards = null;
    
    if (sortCards){
        sortCards = sortCards.slice();
        sortCards.sort(this.cardValueCmp.bind(this));
    }
    if (sortLastCards instanceof Array){
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
PaodekuaiHuaian.prototype.findCardByType = function(hands, laizi, type, lastCards, buChaiTypes) {
    var rets = [];
    var laizis = [];
    var cardNum = typeof(lastCards)!='undefined' && lastCards ? lastCards.length : null;
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
        var handCardSanZhangNum = handFeiji[0].length/3;
        var handCardSanPaiNum = handFeiji[1].length;

        if (handCardSanZhangNum >= 2)
        {
            if (lastCards && lastCards != -1 && lastCards.length > 0)
            {
                var feijiInfo = this.formatFeiJiType(lastCards);
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
                        var feiJiValue_a = this.formatFeiJiType(handFeiji[0]).value;
                        var feiJiValue_b = feijiInfo.value;
                        if(feiJiValue_a < feiJiValue_b) continue;
                        sanpai = handFeiji[0].slice(0, startSanIndex);
                        sanpai = sanpai.concat(handFeiji[0].slice(lastSanIndex, handFeiji[0].length));
                        sanpai = sanpai.concat(handFeiji[1]);

                        if (lastCardSanPaiNum > 0) {
                            var allSanPaiZhuHe = [];
                            if (this.useNewTip) {
                                allSanPaiZhuHe = this.findDaiPai(sanpai, this.CARDTPYE.feiji, lastCardSanPaiNum, feijiInfo.type == feijiInfo.DAI_CHI_BANG, buChaiTypes);
                            } else {
                                // allSanPaiZhuHe = this.lieju(sanpai, lastCardSanPaiNum);   // 列举所有散牌组合
                                for(var j=0; j < sanpai.length && sanpai.length >= j+lastCardSanPaiNum; j++) {  // 依次散牌组合
                                    var cards = sanpai.slice(j, j+lastCardSanPaiNum);
                                    allSanPaiZhuHe.push(cards);
                                }
                            }

                            for(var j in allSanPaiZhuHe){
                                var ret = sanShun.concat( allSanPaiZhuHe[j] );
                                if (this.isFeiJi(ret) != 0){
                                    rets.push(ret);
                                }
                            }

                        } else {
                            rets.push(sanShun);
                        }
                    }
                }
            }
            else
            {
                // 首次出牌或者其他玩家过牌

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

                //                 if (lastCardSanPaiNum > 0) {
                //                     var allSanPaiZhuHe = [];

                //                     if (this.useNewTip) 
                //                     {
                //                         allSanPaiZhuHe = this.findDaiPai(sanpai, this.CARDTPYE.feiji, lastCardSanPaiNum, false, buChaiTypes);
                //                     } 
                //                     else 
                //                     {
                //                         // allSanPaiZhuHe = this.lieju(sanpai, lastCardSanPaiNum);   // 列举所有散牌组合
                //                         for(var j=0; j < sanpai.length && sanpai.length >= j+lastCardSanPaiNum; j++) 
                //                         {  
                //                             // 依次散牌组合
                //                             var cards = sanpai.slice(j, j+lastCardSanPaiNum);
                //                             allSanPaiZhuHe.push(cards);
                //                         }
                //                     }

                //                     for(var j in allSanPaiZhuHe)
                //                     {
                //                         var ret = sanShun.concat( allSanPaiZhuHe[j] );

                //                         ret.sort(this.cardValueCmp.bind(this));

                //                         if(this.isFeiJi(ret) != 0)
                //                         {
                //                             rets.push(ret);
                //                         }
                //                     }
                //                 }
                //                 else
                //                 {
                //                     rets.push(sanShun);
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
            var newHands = this.delPoint(hands, [this.PDK_APOINT]);
            if (find){
                for(var i in newHands) {
                    var cards = find.concat(newHands[i]);
                    if(!this.indexOfCards(rets, cards)) rets.push(cards); 
                }
            }  
        }
    }
    else if (type == this.CARDTPYE.sange3) {
        if (laizi == 0)
        {
            var newHands = this.delPoint(hands, null, [this.cardCfg.hx[3]]);
            var find = this.findNSameCard(newHands, this.PDK_MINPOINT, 3);
            newHands = this.delPoint(newHands, [this.PDK_MINPOINT]);
            if (find){
                for(var i in newHands) {
                    var cards = find.concat(newHands[i]);
                    if(!this.indexOfCards(rets, cards)) rets.push(cards); 
                }
            }  
        }
    }
    else if (type == this.CARDTPYE.sizha  || type == this.CARDTPYE.duizi || type == this.CARDTPYE.sanzhang) { 
        for (var i = this.PDK_MINPOINT; i <= this.PDK_MAXPOINT; i++) {
            var find = this.findNSameCard(hands, i, cardCount - laizi);
            if (find) {
                var cards = laizis.concat(find);
                if(!this.indexOfCards(rets, cards)) rets.push(cards);
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
                    var findCards = this.findDaiPai(newHands, type, 2, true, buChaiTypes);
                    for (var j in findCards) {
                        var ret = laizis.concat(temp1);
                        ret = ret.concat(findCards[j]);
                        if (!this.indexOfCards(rets, ret)) 
                            rets.push(ret);
                    }
                }
                else {
                    for(var j=1; j < newHands.length; j++)
                    {
                        var point1 = this.calPoint(newHands[j]);
                        var point2 = this.calPoint(newHands[j-1]);
                        if(point1 == point2) {
                            var ret = laizis.concat(temp1);
                            ret.push(newHands[j-1]);
                            ret.push(newHands[j]);
                            if( !this.indexOfCards(rets, ret) ) 
                                rets.push(ret);
                        }
                    }
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
            }
        }
    }
    else if (type == this.CARDTPYE.shunzi) {
        var shunzis = this.findShunZi(hands, cardCount, false)
        for(var i in shunzis) {
            if (!this.indexOfCards(rets, shunzis[i])) rets.push(shunzis[i]);
        }
    }
    else if (type == this.CARDTPYE.sztonghua && hands.length >= cardCount) {
        var shunziNum = cardNum && cardNum > 5 ? cardNum : cardCount;
        var shunzis = this.findShunZi(hands, shunziNum, true)
        for (var i in shunzis) {
            if (!this.indexOfCards(rets, shunzis[i])) rets.push(shunzis[i]);
        }
    }
    else if (type == this.CARDTPYE.szdaipai && hands.length >= cardCount) {
        var szdaipaiNum = cardNum && cardNum > 5 ? cardNum : cardCount; // 顺子带牌的总数量
        var sznum = 5 + (szdaipaiNum - 8) / 2;  // 同花顺牌数
        var daipainum = szdaipaiNum - sznum;    // 带的牌数
        var shunzis = this.findShunZi(hands, sznum, true)
        if(shunzis) {
            for(var i in shunzis) {
                var sz = shunzis[i];
                var newHands = this.delPoint(hands, null, sz);
                for (var j = 0; j < newHands.length - daipainum + 1; j++)
                {
                    sz = shunzis[i].slice();
                    sz = sz.concat( newHands.slice(j, j + daipainum) );
                    if(!this.indexOfCards(rets, sz))    rets.push(sz); 
                }
            }
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
                //cc.log("hands " + hands + " i = " + i);
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
    return rets;
};

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
PaodekuaiHuaian.prototype.tipCards = function(oHands, oLastCards, areaSelectMode, isNextPlayerOneCard, isFirstRound, isSmartTip) {
    if(isSmartTip) {
        this.canPutTypesCache = [];

        this.useNewTip = true;
        var ret = this.findPutTipCards(oHands, oLastCards, areaSelectMode, isNextPlayerOneCard, isFirstRound);
        this.useNewTip = false;
        if (ret.length > 0) return ret;
    }

    //  第一个局 当勾“先出黑桃三”选项时，提示出黑桃三
    if (this.isMustPutCard3(oHands, areaSelectMode, isFirstRound)) {
        return [[this.cardCfg.hx[3]]]
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
        if(lastCardsType ==  this.CARDTPYE.sange3) break;
        
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

    var cardtypes = this.findCardByType(hands, 0, this.CARDTPYE.sange3);
    for (var i = 0; i < cardtypes.length; i++) {
        if (this.canPut(cardtypes[i], oLastCards, oHands.length, areaSelectMode)) {
            rets.push(cardtypes[i]);
        }
    }
    if(areaSelectMode.can3aZhaDan){
        var cardtypes = this.findCardByType(hands, 0, this.CARDTPYE.sangeA);
        for (var i = 0; i < cardtypes.length; i++) {
            if (this.canPut(cardtypes[i], oLastCards, oHands.length, areaSelectMode)) {
                rets.push(cardtypes[i]);
            }
        }
    }
    
    if(areaSelectMode.tongHuaShun){
        var cardtypes = this.findCardByType(hands, 0, this.CARDTPYE.sztonghua) ;
        for (var i = 0; i < cardtypes.length; i++) {
            if ( !this.indexOfCards(rets, cardtypes[i]) && this.canPut(cardtypes[i], oLastCards, oHands.length, areaSelectMode)) {
                rets.push(cardtypes[i]);
            }
        }
    }

    return rets;
};

/**
 * 如果是有效牌型，剔除带牌
 * @param  {array} Cards 牌组
 * @param  {Boolean} areaSelectMode 创建房间的选项
 */
PaodekuaiHuaian.prototype.delDaipai = function(Cards, areaSelectMode)
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
        cardtype == this.CARDTPYE.danpai||
        cardtype == this.CARDTPYE.sztonghua)
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
    module.exports = PaodekuaiHuaian;

if(typeof(MjClient)!="undefined")
    MjClient.majiang_PaodekuaiHuaian = new PaodekuaiHuaian();

})();

