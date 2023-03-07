//var PaodekuaiBase = require('./PaodekuaiBase');

//跑得快算法类
(function() {
    function PaodekuaiXiangShui() {
        PaodekuaiBase.apply(this,arguments)
        this.cardCfg.firstOutCard = this.cardCfg.hx[3];

        this.CARDTPYE.sidaiyi = 111;
        this.PDK_CARDCOUNT[this.CARDTPYE.sidaiyi] = 5;
        this.PDK_CARDCOUNT[this.CARDTPYE.feiji] = 6;
        this.PDK_CARD_VALUE[this.CARDTPYE.sidaiyi] = 2;
        this.pdk_allZhaDan.push(this.CARDTPYE.sidaiyi);
    }

    var print = function(){
        var str = '';
        for (var i=0; i<arguments.length; i++){
            str  = str + arguments[i] + ' ';
        }

        console.log(str);
    } 

    PaodekuaiXiangShui.prototype = Object.create(PaodekuaiBase.prototype);
    PaodekuaiXiangShui.prototype.constructor = PaodekuaiXiangShui

    // 1 - 52  方块A:1 梅花A:2 红心A:3 黑桃A:4 -- 黑桃王:52
    // 1.16张玩法为现有的没有大小王、只有一个2、三个A的玩法 一共48张
    // 2.15张玩法：在16张的基础上，再去掉两个A（剩红桃A）、一个K（去掉黑桃K），一共45张
    PaodekuaiXiangShui.prototype.randomCards = function(areaSelectMode, tData) {
        var cards = [];
        var allHandCardNum = this.handCount * tData.maxPlayer;
        // 没有大小王的 52 张牌
        for (var i = 1; i <= 52; i++) {
            cards.push(i);
        }

        // 去掉 方块2 梅花2 红桃2
        cards.splice( cards.indexOf(this.cardCfg.fk[2]), 1 );
        cards.splice( cards.indexOf(this.cardCfg.mh[2]), 1 );
        cards.splice( cards.indexOf(this.cardCfg.hx[2]), 1 );

        // 去跳黑桃A
        cards.splice( cards.indexOf(this.cardCfg.ht[1]), 1 );

        if (tData.maxPlayer == 2 || tData.roundAll != tData.roundNum && areaSelectMode.firstOutOption == 0) {
            // 洗牌
            shuffleArray(cards);

        	// 取得对应人数的牌数
            cards = cards.slice(0, allHandCardNum);
        } else {
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
        }

        return cards;
    };

    PaodekuaiXiangShui.prototype.calFlower = function(num) {
        return (num + 3) % 4;
    }

    PaodekuaiXiangShui.prototype.formatFeiJiType = function(oCards){
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

        var duiNum = this.countDuiNum(sanPaiList);

        // 两张牌做翅膀
        if (sanShunList.length / 3 == duiNum) // 翅膀需要是对子  333-444-5566   
            //if(feijiInfo.type == feijiInfo.BU_SHI_FEI_JI && sanShunList.length/3 >= sanPaiList.length/2 && oCards.length % 5 == 0) // 翅膀任意牌 333444-6789 
            feijiInfo.type = feijiInfo.DAI_CHI_BANG;

        // 单张做翅膀
        // 如果是 用3张作翅膀的牌型: 555666777888  333444555666777888999101010 
        if (feijiInfo.type == feijiInfo.BU_SHI_FEI_JI && 0 == sanShunList.length % 12 && 0 == sanPaiList.length)
            feijiInfo.type = feijiInfo.DAN_ZHANG_CHI_BANG;
        // 如果飞机和翅膀数量相等
        if (feijiInfo.type == feijiInfo.BU_SHI_FEI_JI && sanPaiList.length == sanShunList.length / 3 && !this.haveDuizi(sanPaiList))
            feijiInfo.type = feijiInfo.DAN_ZHANG_CHI_BANG;

        if (feijiInfo.type == feijiInfo.BU_SHI_FEI_JI && sanShunList.length > 0 && sanPaiList.length == 0) // 不带翅膀 的飞机
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

    /**
     * 判断是否为飞机 
     * @param  {array} oCards 按点数排序好的牌
     * @return {num} 返回飞机的牌值， 不是飞机返回0 
     */
    PaodekuaiXiangShui.prototype.isFeiJi = function(oCards){
        return this.formatFeiJiType(oCards).value;
    }

    PaodekuaiXiangShui.prototype.isZhaDan = function(oCards, areaSelectMode) {
        if(!oCards || oCards.length ==0) return false;

        var cardType = this.calType(oCards, areaSelectMode);

        // 四炸
        if( cardType == this.CARDTPYE.sizha
            || cardType == this.CARDTPYE.sangeA 
            || cardType == this.CARDTPYE.sange3
            || cardType == this.CARDTPYE.sidaiyi)
        {
            return true;
        } else {
            return false;
        }

    }

    PaodekuaiXiangShui.prototype.isHadZhaDan = function(cards, areaSelectMode) {
        for(var i=0; i < cards.length; i++){
            var cardValue = this.calPoint(cards[i]);
            var isHadZhaDan = this.findNSameCard(cards, cardValue, 4);
            if(isHadZhaDan) return true;
        }

        var isSanA = this.findNSameCard(cards, this.PDK_APOINT, 3);
        if(isSanA) return true;

        var isSan3 = this.findNSameCard(cards, this.PDK_MINPOINT, 3);
        if(isSan3 && cards.length > 3) return true;

        return false;
    }

    /**
     * 计算牌型
     * @param {array} cards 按点数排好序的牌
     * @return {this.CARDTPYE} 牌型，-1 = 不成型
     */
    PaodekuaiXiangShui.prototype.calType = function(pCards, areaSelectMode) {

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
        if (cardCount == this.PDK_CARDCOUNT[this.CARDTPYE.sangeA] && allSame && this.calPoint(cards[0]) == this.PDK_APOINT)
            return this.CARDTPYE.sangeA || -1;

        // 三个3算炸弹
        if (cardCount == this.PDK_CARDCOUNT[this.CARDTPYE.sange3] && allSame && this.calPoint(cards[0]) == this.PDK_MINPOINT && cards.indexOf(this.cardCfg.hx[3]) < 0)
            return this.CARDTPYE.sange3 || -1;

        // 飞机
        if (cardCount >= 6 && maxCount >= 3 && this.isFeiJi(cards) != 0) {
            return this.CARDTPYE.feiji || -1;
        }

        // 顺子，5张起 
        if (cardCount >= 5 && maxCount == 1 && this.isShun(cards) )
            return this.CARDTPYE.shunzi || -1;

        // 连对，2对起
        if (cardCount >= this.PDK_CARDCOUNT[this.CARDTPYE.liandui] && maxCount == 2 && this.isLiandui(cards))
            return this.CARDTPYE.liandui || -1;

        //四带二
        if (cardCount == 6 && maxCount == 4 && areaSelectMode.can4dai2)
            return this.CARDTPYE.sidaier || -1;

        //四炸
        if (cardCount == 4 && allSame)
            return this.CARDTPYE.sizha || -1;

        //四炸带一张
        if (cardCount == 5 && maxCount == 4 && areaSelectMode.can4dai1)
            return this.CARDTPYE.sidaiyi || -1;

        // 三带二
        if (cardCount == this.PDK_CARDCOUNT[this.CARDTPYE.sandaier] && maxCount == 3 ) {
            for(var i in pointCounts) {
                // 只能3带对子
                if( pointCounts[i] == 2 ) return this.CARDTPYE.sandaier || -1;
            }
        }

        //三带一
        if (cardCount == 4 && maxCount == 3 )
            return this.CARDTPYE.sandaiyi || -1;

        // 对子
        if (cardCount == 2 && allSame)
            return this.CARDTPYE.duizi || -1;

        // 单牌
        if (cardCount == 1)
            return this.CARDTPYE.danpai || -1;

        return -1;
    };

    PaodekuaiXiangShui.prototype.cardsType = function(cards, areaSelectMode) {
        return this.calType(cards, areaSelectMode)
    }

    /**
     * 计算牌型点数
     * @param {array} cards 按点数排好序的牌
     * @return {number}
     */
    PaodekuaiXiangShui.prototype.calCardsValue = function(cards, type, areaSelectMode) {

        if (!cards || cards.length == 0)
            return -1;
        
        if (!type)
            type = this.calType(cards, areaSelectMode);
        
        var lastCard = cards[cards.length - 1];
            
        if (type == this.CARDTPYE.sandaier)
            return this.calPoint(cards[2]);

        if (type == this.CARDTPYE.sandaiyi || type == this.CARDTPYE.sidaiyi)
            return this.calPoint(cards[2]);
        
        if (type == this.CARDTPYE.sidaier)
            return this.calPoint(cards[3]);

        if (type == this.CARDTPYE.feiji)
            return this.calPoint(this.isFeiJi(cards));

        if (type == this.CARDTPYE.shunzi) {
            cards.sort( this.sortBigCardValue.bind(this) );
            if(Math.ceil(cards[cards.length-1] / 4) == 1 && this.calPoint(cards[0]) == 13) return this.PDK_APOINT;    // KQJ10A 特需处理
            return this.calPoint( cards[ Math.ceil(cards.length/2) ], true )
        }


        // 单牌，对子，三张，顺子，连对，四炸，三个A
        return this.calPoint(lastCard);
    };

    PaodekuaiXiangShui.prototype.sortBigCardValue = function(a, b) {
        var pa = Math.ceil(a / 4);
        var pb = Math.ceil(b / 4);
        if (pa == pb)
            return b - a;
        
        return pb - pa;
    }

    /**
     * 是否首手必须先出红桃/黑桃3
     * @param  {array} oHands 我的手牌
     * @param  {object} areaSelectMode 创建房间的选项
     * @param  {Boolean} isFirstRound 是否第一局
     * @return {Boolean} 
     */
    PaodekuaiXiangShui.prototype.isMustPutCard3 = function(oHands, areaSelectMode, isFirstRound) {
        if (areaSelectMode.maxPlayer == 2) {
            // 二人玩法，首局随机、续局赢家先出
            return false;
        }

        // 三人玩法，首局红桃3或每局红桃3先出
        return ((isFirstRound && areaSelectMode.firstOutOption == 0) || areaSelectMode.firstOutOption == 1) && 
            oHands.indexOf(this.cardCfg.firstOutCard) >= 0;
    }


    /** 
     * 牌是否能压上
     * @param {array} oCards 按点数排好序的牌/选择了的手牌
     * @param {array} [oLastCards] 按点数排好序的牌/最后打出的牌
     * @param {number} [handsNum] 手牌数量
     */
    PaodekuaiXiangShui.prototype.canPut = function(oCards, oLastCards, handsNum, areaSelectMode) {

        var cardsType = this.calType(oCards, areaSelectMode);

        // cc.log("PaodekuaiXiangShui.prototype.canPut oCards:", oCards );
        // cc.log("oLastCards" , oLastCards );
        // cc.log("handsNum" , handsNum );
        // cc.log("canPut cardsType", cardsType)
        // 如果客户端调用时 没有 传areaSelectMode

        if (cardsType == -1)
            return false;

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
        else if (this.PDK_CARD_VALUE[cardsType] && this.PDK_CARD_VALUE[cardsType] == this.PDK_CARD_VALUE[lastCardsType]) {
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
    PaodekuaiXiangShui.prototype.checkPut = function(oHands, cards, lastCards, areaSelectMode, isNextPlayerOneCard, isFirstRound) {
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

        if(!areaSelectMode && cc ) {
            areaSelectMode = MjClient.data.sData.tData.areaSelectMode;
        }

        //  首局红桃3先出或每局红桃3先出
        if (this.isMustPutCard3(oHands, areaSelectMode, isFirstRound) && cards.indexOf(this.cardCfg.hx[3]) < 0) {
            return null;
        }

        var cardType = this.calType(cards, areaSelectMode);
        var pthis = this;

        // 四带二
        if(cardType == this.CARDTPYE.sidaier && areaSelectMode && !areaSelectMode.can4dai2){
            return null
        }

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
        	sortLastCards = sortLastCards.slice();
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
     * @param {array} buChaiTypes 不拆牌型
     * @param {array} 拼好的 
     */
    PaodekuaiXiangShui.prototype.findCardByType = function(hands, laizi, type, lastCards, buChaiTypes) {
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
                                var sanpaiFiltered = sanpai;

                                if (feijiInfo.type == feijiInfo.DAN_ZHANG_CHI_BANG) {
                                    // 非DAI_CHI_BANG的飞机只能带单牌，去掉多余的相同的牌
                                    sanpaiFiltered = sanpaiFiltered.slice();

                                    var pointCache = {};
                                    for (var k = sanpaiFiltered.length - 1; k >= 0; k--) {
                                        var curPoint = this.calPoint(sanpaiFiltered[k]) + "_";

                                        if (pointCache[curPoint])
                                            sanpaiFiltered.splice(k,1);
                                        else
                                            pointCache[curPoint] = true;
                                    }
                                } else if (feijiInfo.type == feijiInfo.DAI_CHI_BANG) {
                                    // DAI_CHI_BANG的飞机只能带对子，去掉多余的单牌
                                    sanpaiFiltered = sanpaiFiltered.slice();
                                    sanpaiFiltered.sort(this.cardValueCmp.bind(this));

                                    var k = 0;
                                    for (k = sanpaiFiltered.length - 1; k >= 1;) {
                                        var firstPoint = this.calPoint(sanpaiFiltered[k]);
                                        var secondPoint = this.calPoint(sanpaiFiltered[k - 1]);

                                        if (firstPoint != secondPoint) {
                                            sanpaiFiltered.splice(k,1);
                                            k--;
                                        }
                                        else
                                            k -= 2;
                                    }

                                    if (k == 0)
                                        sanpaiFiltered.splice(k,1);
                                }

                                if (this.useNewTip) {
                                    allSanPaiZhuHe = this.findDaiPai(sanpaiFiltered, this.CARDTPYE.feiji, lastCardSanPaiNum, feijiInfo.type == feijiInfo.DAI_CHI_BANG, buChaiTypes);
                                } else {
                                    // allSanPaiZhuHe = this.lieju(sanpai, lastCardSanPaiNum);   // 列举所有散牌组合
                                    for(var j=0; j < sanpaiFiltered.length && sanpaiFiltered.length >= j+lastCardSanPaiNum; j++) {  // 依次散牌组合
                                        var cards = sanpaiFiltered.slice(j, j+lastCardSanPaiNum);
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
            }
        }
        else if (type == this.CARDTPYE.sangeA) {
            if (laizi == 0)
            {
                var find = this.findNSameCard(hands, this.PDK_APOINT, 3);
                if (find)   rets.push(find);
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
                    rets.push(laizis.concat(find));
                }
            }
        }
        else if (type == this.CARDTPYE.sidaiyi) {
            for (var i = this.PDK_MINPOINT; i <= this.PDK_MAXPOINT; i++) {
                var find = this.findNSameCard(hands, i, 4 - laizi);
                if (find) {
                    var newHands = this.delPoint(hands, i);

                    for(var j in newHands) {
                        var cards = find.concat(newHands[j]);
                        if(!this.indexOfCards(rets, cards)) 
                            rets.push(cards); 
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
    PaodekuaiXiangShui.prototype.tipCards = function(oHands, oLastCards, areaSelectMode, isNextPlayerOneCard, isFirstRound, isSmartTip) {
        if(isSmartTip) {
            this.canPutTypesCache = [];

            this.useNewTip = true;
            var ret = this.findPutTipCards(oHands, oLastCards, areaSelectMode, isNextPlayerOneCard, isFirstRound);
            this.useNewTip = false;
            if (ret.length > 0) return ret;
        }

        //  首局红桃3先出或每局红桃3先出，提示出红桃3
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
            if (lastCardsType == this.CARDTPYE.sange3) break;
            if (lastCardsType == this.CARDTPYE.sidaiyi) break;
            
            var sameTypeCards = this.findCardByType(hands, laizi, lastCardsType, oLastCards);
            for (var i = 0; i < sameTypeCards.length; i++) {
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

        if (areaSelectMode.can4dai1) {
            var booms = this.findCardByType(hands, 0, this.CARDTPYE.sidaiyi);
            // 不是压三带二的时候， 最后提示炸弹
            for (var i = 0; i < booms.length; i++) {
                if (this.canPut(booms[i], oLastCards, oHands.length, areaSelectMode)) {
                    rets.push(booms[i]);
                }
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

        var cardtypes = this.findCardByType(hands, 0, this.CARDTPYE.sangeA);
        for (var i = 0; i < cardtypes.length; i++) {
            if (this.canPut(cardtypes[i], oLastCards, oHands.length, areaSelectMode)) {
                rets.push(cardtypes[i]);
            }
        }


        return rets;
    };

    /**
     * 如果是有效牌型，剔除带牌
     * @param  {array} Cards 牌组
     * @param  {Boolean} areaSelectMode 创建房间的选项
     */
    PaodekuaiXiangShui.prototype.delDaipai = function(Cards, areaSelectMode)
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
        if (cardtype == this.CARDTPYE.sandaier || cardtype == this.CARDTPYE.sandaiyi)
            Cards = this.findNSameCard(Cards, point, 3);
        else if (cardtype == this.CARDTPYE.sidaier)
            Cards = this.findNSameCard(Cards, point, 4);
        else if(cardtype == this.CARDTPYE.feiji)
        {
            var feiji  = this.formatFeiJiType(Cards);
            Cards = feiji.sanZhangCards;
        }

        return Cards;
    }


    PaodekuaiXiangShui.prototype.haveDuizi = function(oCards){
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

            if (num > 0)
                return true;
        }

        return false;
    }

    if(typeof(module)!="undefined" && module.exports)    
        module.exports = PaodekuaiXiangShui;

    if(typeof(MjClient)!="undefined")
        MjClient.majiang_PaodekuaiXS = new PaodekuaiXiangShui();

})();

