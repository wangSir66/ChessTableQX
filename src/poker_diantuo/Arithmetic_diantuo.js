// 岳阳掂坨算法
(function() {
    var SMALL_JOKER = 516; // 小王
    var BIG_JOKER =  517; // 大王

    var MAX_NUMS_ZHADAN = 8;    //炸弹最大张数

    var SUIT_TYPE = {
        diamonds: 1, // 方块
        clubs: 2, // 梅花
        hearts: 3, // 红桃
        spades: 4, // 黑桃
        joker: 5 // 小丑
    };

    var CARD_TYPE = {
        noType: -1,     // 无牌型
        danZhang: 0,    // 单张
        duiZi: 1,       // 对子
        sanZhang: 2,    // 三张
        shunZi: 3,      // 顺子
        lianDui: 4,     // 连对
        feiJi: 5,       // 飞机
        zaHuaWuShiK: 7, // 杂花5-10-k
        tongHuaWuShiK: 8,   // 同花5-10-k
        zhaDan: 9,      // 炸弹
    };

    // 顺子队列
    //var SHUN_QUEUE = [14, 15, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]; // k 可以连A
    // var SHUN_QUEUE = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    var SHUN_QUEUE = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]; // k 可以连A
    
    function DianTuo() {
        this.CARD_TYPE = CARD_TYPE;
        this.sortType = 1;
        this.wuShikIndex = 0;
        this.boomType = 0;
    }

    var utils = function() {

    };

    // 牌点
    utils.prototype.point = function(card) {
        return card % 100;
    };

    // 花色
    utils.prototype.suit = function(card) {
        return Math.floor(card / 100);
    };

    //排除不参与构成顺子的牌点(非重复的牌点)
    utils.prototype.delCanNotLink = function(list) {
        for (var cd = 15; cd <= 17; cd++) {
            var idx = list.indexOf(cd);
            if (idx >= 0) {
                list.splice(idx, 1);
            }
        }
    }

    var _ = new utils();

    // 洗牌
    DianTuo.prototype.randomCards = function(areaSelectMode) {
        var deckNum = areaSelectMode.isSanFuPai ? 3 : 2;
        var tzcards = [
            103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, // 方块3-K A 2
            203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, // 梅花
            303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, // 红桃
            403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415  // 黑桃
        ];

        //3副牌没王
        if (!areaSelectMode.isSanFuPai) {
            tzcards.push(SMALL_JOKER, BIG_JOKER);
        }
        
        
        var invalid = [3, 4];
        var delInvalid = function(invalid) {
            var b = 100;
            for (var i = 1; i < 5; i++) {
                for (var j = 0; j < invalid.length; j++) {
                    var idx = tzcards.indexOf(b*i + invalid[j]);
                    if (idx < 0) {
                        continue;
                    }
                    tzcards.splice(idx, 1);
                }
            }
        }

        //去掉3、4玩法
        if (!areaSelectMode.isFullCard) {
            delInvalid([3, 4]);
        }

        //3副牌去掉3467
        if (deckNum == 3) {
            delInvalid([3, 4, 6, 7]);
        }

        var cards = [];
        for (var i = 0; i < deckNum; i++) {
            cards = cards.concat(tzcards);
        }

        //3人玩法需要再随机去掉2张牌
        if (areaSelectMode.maxPlayer == 3) {
            var len = cards.length;
            var rdIdx = Math.floor(Math.random()*len);
            cards.splice(rdIdx, 1);
            len -= 1;
            rdIdx = Math.floor(Math.random()*len);
            cards.splice(rdIdx, 1);
        }

        shuffleArray(cards);
        return cards;
    };

    // 排序
    DianTuo.prototype.formatSort = function(cards) {
        cards.sort(function(a, b) {
            if (_.point(a) == _.point(b)) {
                return a - b;
            }

            return _.point(a) - _.point(b);
        });
    }

    DianTuo.prototype.sort2 = function(cards) {
        // 牌统计; 提取炸弹 五十K
        var p_dict = {
            "5": 0,
            "10": 0,
            "13": 0
        };

        var c_dict = {};
        var jokerList = [];
        for (var i = 0; i < cards.length; i++) {
            var c = cards[i];
            if (c == BIG_JOKER || c == SMALL_JOKER) {
                jokerList.push(c);
                continue;
            }
            c_dict[c] = c_dict[c] ? c_dict[c] + 1 : 1;

            var p = _.point(cards[i]);
            p_dict[p] = p_dict[p] ? p_dict[p] + 1 : 1;
        }
        // console.log("p_dict@@ ", p_dict);

        // 获取一定张数的特定牌点的牌
        function getCardsByNum(point, needNum) {
            // console.log("getCardsByNum point@@", point, " needNum@@ ", needNum);
            // console.log("c_dict @@", JSON.stringify(c_dict));
            if (point == 2) { // 2实际编码
                point = 15;
            }

            var rtn = [];
            var findNum = 0;
            while (findNum < needNum) {
                for (var suit in SUIT_TYPE) {
                    var cd = SUIT_TYPE[suit] * 100 + point;
                    var num = c_dict[cd];
                    if (num && num > 0) {
                        for (var i = 1; i <= Math.min(num, needNum - findNum); i++) {
                            rtn.push(cd);
                        }
                        findNum += num;
                    }
                }
            }
            return rtn;
        }

        function out(row) {
            for (var i = 0; i < row.length; i++) {
                c_dict[row[i]]--;
                p_dict[_.point(row[i])]--;
            }
        } 

        var zhaDanList = []; // 炸弹
        var wuShiKList = []; // 五十K

        if (jokerList.length == 4) {
            jokerList.sort(function(a, b) {
                return a - b;
            });
            zhaDanList.push({cards: jokerList, value: this.getZhaDanValue(jokerList)});
        }

        for (var k in p_dict) {
            if (p_dict[k] >= 4) {
                var tmp = getCardsByNum(Number(k), p_dict[k]);
                zhaDanList.push({cards: tmp, value: this.getZhaDanValue(tmp)});
            }
        }

        zhaDanList.sort(function(a, b) {
            return a.value - b.value;
        });
        // console.log("zhaDanList@@ ", zhaDanList);

        if (p_dict[5] < 4 && p_dict[10] < 4 && p_dict[13] < 4) {
            var num = Math.min(p_dict[5], p_dict[10], p_dict[13]);
            var findNum = 0;
            for (var i = 1; i <= 4; i++) {
                if (c_dict[i * 100 + 5] > 0 && c_dict[i * 100 + 10] > 0 && c_dict[i * 100 + 13] > 0) {
                    var row = [i * 100 + 5, i * 100 + 10, i * 100 + 13];
                    wuShiKList.push(row);
                    out(row);
                    findNum++;
                    i--;
                }
            }

            while(num - findNum) {
                var row = [getCardsByNum(5, 1)[0], getCardsByNum(10, 1)[0], getCardsByNum(13, 1)[0]];
                wuShiKList = [row].concat(wuShiKList);
                out(row);
                findNum++;
            }
        }

        // 牌点按张数 分类
        var pHash = [
            [], // 0张的牌点(wuyong)
            [], // 1张
            [], // 2张
            [], // 3张
        ];

        for (var k in p_dict) {
            var count = p_dict[k];
            var point = Number(k);
            if (count > 0 && count <= 3) {
                pHash[count].push(point);
            }
        }
        // console.log("pHash@@ ", pHash);
        // console.log("wuShiKList@@ ", wuShiKList);
        // console.log("zhaDanList@@ ", zhaDanList);

        var rtn = [];
        for (var i = 0; i < pHash[1].length; i++) {
            rtn = rtn.concat(getCardsByNum(pHash[1][i], 1));
        }

        for (var i = 0; i < pHash[2].length; i++) {
            rtn = rtn.concat(getCardsByNum(pHash[2][i], 2));
        }

        if (jokerList.length == 4) {
            rtn = rtn.concat(jokerList);
        }

        for (var i = 0; i < pHash[3].length; i++) {
            rtn = rtn.concat(getCardsByNum(pHash[3][i], 3));
        }

        for (var i = 0; i < wuShiKList.length; i++) {
            rtn = rtn.concat(wuShiKList[i]);
        }

        for (var i = 0; i < zhaDanList.length; i++) {
            rtn = rtn.concat(zhaDanList[i].cards);
        }

        return rtn;
    };
    // this.wuShikIndex = 1;
    // this.boomType = 1;
    // 比较后，获取结果
    DianTuo.prototype.getBoomIndex = function(len,isReset) {  
        if(isReset)
            this.boomType = 0;

        return this.boomType++ % len;
    }       


    // 比较后，获取结果
    DianTuo.prototype.getWuShikIndex = function(len,isReset) {  
        if(isReset)
            this.wuShikIndex = 0;

        return this.wuShikIndex++ % len;
    }       

    // 获取一个类型的牌数量
    DianTuo.prototype.getOneTypeCardNum = function(cards) {  
        var cardNumArr = {};
        for (var i = 0; i < cards.length; i++) {
            if(!cardNumArr[cards[i] % 100])
                cardNumArr[cards[i] % 100] = 0;
            cardNumArr[cards[i] % 100]++;
        }
        return cardNumArr;
    }      

    DianTuo.prototype.sortCard = function(cards, sortType) {
        // this.sortType = sortType || (this.sortType % 2 + 1);
        // switch (this.sortType) {
        //     case 1:
        //         this.formatSort(cards);
        //         return cards;
        //     case 2:
        //         return this.sort2(cards);
        // }

        this.sortType = sortType || (this.sortType % 2 + 1);
        

        // switch (this.sortType) {
        //     case 1:
        //         this.formatSort(cards);
        //         return cards;
        //     case 2:
        //         return this.sort2(cards);
        // }
        return this.getSortCard(cards, this.sortType);
    }

    //前端新加的
    DianTuo.prototype.getSortCard = function(tempCard,sortType) {
 

        function resetSortCardData(){
            tempCard.sort();
            tempCard.sort(function(a,b){
                return b%100 - a%100;
            }) 
        }
        resetSortCardData();
        
           // 删除已被拿出来的牌
        function removeData(data){
            // var tempData = tempCard.slice();
            for (var i = 0; i < data.length; i++) {
                tempCard.splice(tempCard.indexOf(data[i]),1);
            }
            resetSortCardData();
        }
        // 找王
        var kingCard = [];
        // 找所有的5、10、k
        var cardsWuShiK= []; 
        for (var i = 0; i < tempCard.length; i++) { 
            if(tempCard[i]% 100 == 5 || tempCard[i]% 100 == 10 || tempCard[i]% 100 == 13){
                cardsWuShiK.push(tempCard[i]);
            }else if(tempCard[i] == 516 || tempCard[i] == 517){
                kingCard.push(tempCard[i]);
            }
        }
        removeData(cardsWuShiK); 
        removeData(kingCard); 
     


        var cardsBoom= [];
        //找所有的炸弹
        var tempSelect = 0; 
        var tempBoomArr = [];
        
        var multiArray = new Array(4); // 记录每类牌有多少个

        for (var i = 0; i < tempCard.length; i++) {
            // 如果没有找到过，或者找到了相同的就++
            if(tempBoomArr.length == 0 || tempBoomArr[tempBoomArr.length-1] % 100 == tempCard[i] % 100){ 
                tempBoomArr.push(tempCard[i]); 
            }else if(tempBoomArr.length >= 4){ //是个炸弹
                for (var j = 0; j < tempBoomArr.length; j++) {
                    cardsBoom.push(tempBoomArr[j]); 
                }
                tempBoomArr = []; 
                tempBoomArr.push(tempCard[i]); 
            }// 需要多考虑几个最后一个数是炸弹的情况
            else{ 
                if(!multiArray[tempBoomArr.length])
                    multiArray[tempBoomArr.length] = [];

                // 把非炸弹的存起来用作另一种排序
                for (var d = 0; d < tempBoomArr.length; d++) {
                     multiArray[tempBoomArr.length].push(tempBoomArr[d]);
                } 
                // 把所有累计过的内容记录下来，除炸弹和和510K
                tempBoomArr = []; 
                tempBoomArr.push(tempCard[i]); 
                // continue;
            }
            if(i == tempCard.length-1) // 最后一个
            {
                if(tempBoomArr.length >= 4){
                    for (var j = 0; j < tempBoomArr.length; j++) {
                        cardsBoom.push(tempBoomArr[j]); // 最小的一个炸弹
                    }  
                }else{
                    // 把非炸弹的存起来用作另一种排序
                    if(!multiArray[tempBoomArr.length])
                        multiArray[tempBoomArr.length] = [];
                    for (var d = 0; d < tempBoomArr.length; d++) {
                         multiArray[tempBoomArr.length].push(tempBoomArr[d]);
                    }
                } 
            }
        }
        removeData(cardsBoom);  

        cardsWuShiK.sort(function(a,b){return a%100 -  b%100 ;});
        cardsBoom.sort(function(a,b){return b%100 - a%100 ;});
        
        if(sortType == 1){ // 从大到小排序
            tempCard.sort(function(a,b){return b%100 - a % 100;});
        }else{ 
            var newCardData = [];
            for (var j = multiArray.length; j > 0; j--) {
                if(!multiArray[j]) continue;
                for (var d = 0; d < multiArray[j].length; d++) {
                    newCardData.push(multiArray[j][d]);
                }
            }
            tempCard = newCardData;  
        } 

        var sumSort = [cardsWuShiK,cardsBoom,kingCard,tempCard];
        var newCardArr = [];
        for (var i = 0; i < sumSort.length; i++) {
            var data = sumSort[i];
            for (var j = 0; j < data.length; j++) {
                newCardArr.push(data[j]);
            } 
        }  

        return newCardArr.reverse();
    };

    // 是否单王, 掂坨不用
    DianTuo.prototype.isDanWang = function(cards) {
        if (cards.length != 1) {
            return false;
        }

        return cards[0] == BIG_JOKER || cards[0] == SMALL_JOKER;
    }

    // 是否单张
    DianTuo.prototype.isDanZhang = function(cards) {
        /*
        if (this.isDanWang(cards)) {
            return false;
        }
        */

        return cards.length == 1;
    }
    
    // 是否对
    DianTuo.prototype.isDuiZi = function(cards) {
        if (cards.length != 2) {
            return false;
        }

        /*
        if (this.isZhaDan(cards)) { // 双王
            return false;
        }
        */
        return _.point(cards[0]) == _.point(cards[1]);
    }

    // 分析三张主体 翅膀
    DianTuo.prototype.analyzeSanZhang = function(cards) {
        var dict = {};
        for (var i = 0; i < cards.length; i++) {
            var p = _.point(cards[i]);
            dict[p] = dict[p] ? dict[p] + 1 : 1;
        }

        var body = -1; // 主体 
        var wing = []; // 翅膀
        for (var p in dict) {
            if (dict[p] >= 3) {
                body = Number(p);

                cards = cards.slice();
                this.formatSort(cards);
                for (var i = 0; i < cards.length; i++) {
                    if (_.point(cards[i]) == body) {
                        cards.splice(i, 3);
                        wing = cards;
                        break;
                    }
                }

                break;
            }   
        }

        return {body: body, wing: wing};
    }

    // 是否三张
    DianTuo.prototype.isSanZhang = function(createParam, cards, hasWings, handCount) {
        if (cards.length < 3 || cards.length > 5) {
            return false;
        }

        if (this.isZhaDan(cards, createParam)) {
            return false;
        }

        handCount = handCount ? handCount : cards.length;
        var struct = this.analyzeSanZhang(cards);
        if (struct.body == -1) {
            return false;
        }

        return this.checkSanZhangValid(struct, handCount, createParam);
    }

    // 分析顺子连牌队列.新增3副牌(没有3467, 5-8可以连)
    DianTuo.prototype.analyzeShunZi = function(list, createParam) {
        if (createParam.isSanFuPai) {
            SHUN_QUEUE = [5, 8, 9, 10, 11, 12, 13, 14];
        }

        if (list.length < 2 || list.length > SHUN_QUEUE.length) {
            return [];
        }

        var queue = list.slice();
        for (var i = 0; i < queue.length; i++) {
            queue[i] = _.point(queue[i]);
        }

        queue.sort(function(a, b) {
            return a - b;
        });

        if (queue[queue.length - 1] > 14) {
            return [];
        }

        var isShun = true; 
        var isValid58 = false;  //是否有效的5-8连
        for (var i = 1; i < queue.length; i++) {
            if (i == 1 && createParam.isSanFuPai) {
                isValid58 = queue[i] == 8 && queue[i - 1] == 5;     //i==1时判断就行了
            }
            if (queue[i] - queue[i - 1] != 1 && !isValid58) {
                isShun = false;
                break; 
            }
            isValid58 = false;
        }

        if (isShun) {
            return queue;
        }

        return [];
    }

    // 是否顺子
    DianTuo.prototype.isShunZi = function(cards, createParam) {
        if (createParam.isNoShunZi || cards.length < 5) {
            return false;
        }

        return this.analyzeShunZi(cards, createParam).length > 0;
    }

    DianTuo.prototype.analyzeLianDui = function(cards, createParam) {
        cards = cards.slice();
        this.formatSort(cards);
        var list = [];
        for (var i = 0; i < cards.length; i+=2) {
            if (_.point(cards[i]) != _.point(cards[i + 1])) {
                return [];
            }

            list.push(cards[i]);
        }

        return this.analyzeShunZi(list, createParam);
    }

    // 是否连对
    DianTuo.prototype.isLianDui = function(cards, createParam) {
        if (cards.length  < 4 || cards.length % 2 != 0) {
            return false;
        }

        //有王就不是连对, 省的再传创建房间参数判定王炸了. ex.有2也不是连对
        for (var i = 0; i < cards.length; i++) {
            if(cards[i] == SMALL_JOKER || cards[i] == BIG_JOKER ||
                _.point(cards[i]) == 15) {
                return false;
            }
        }

        if (this.analyzeLianDui(cards, createParam).length > 0) {
            return true;
        }

        return false;
    }

    // 分析飞机主体 翅膀
    DianTuo.prototype.analyzeFeiJi = function(createParam, handCount, cards, hasWings, bodyLen) {
        hasWings = true;

        var dict = {};
        for (var i = 0; i < cards.length; i++) {
            var p = _.point(cards[i]);
            dict[p] = dict[p] ? dict[p] + 1 : 1;
        }

        var body = []; // 主体 
        var wing = []; // 翅膀
        var list = [];
        for (var p in dict) {
            if (dict[p] >= 3 && Number(p) < 15/*_.point(SMALL_JOKER)*/) {
                list.push(Number(p));
            }   
        }

        var queue = list.slice();
        for (var i = 0; i < queue.length; i++) {
            queue[i] = _.point(queue[i]);
        }

        queue.sort(function(a, b) {
            return a - b;
        });

        var body1 = [];
        var wing1 = [];
        var linkNum = 1;
        var maxLinkNum = 1;
        var maxLinkIdx = -1;
        for (var i = 1; i < queue.length; i++) {
            linkNum = (queue[i] - queue[i - 1] == 1 || 
                (queue[i] == 8 && queue[i - 1] == 5 && createParam.isSanFuPai)) ? linkNum + 1 : 1;
            if (linkNum > maxLinkNum) {
                maxLinkNum = linkNum;
                maxLinkIdx = i;
            }
        }

        if (maxLinkNum == 1) {
            return {body: [], wing: []};;
        }

        var removeCd = function(cardList, p) {
            for(var i = 1; i <= 4; i++) {
                var cd = i*100+p;
                var idx = cardList.indexOf(cd);
                if(idx > -1) {
                    cardList.splice(idx, 1);
                    break;
                } 
            }
        }

        var getWing = function(b, l) { 
            var cardList = l.slice();
            for (var i = 0; i < b.length; i++) {
                removeCd(cardList, b[i]);
                removeCd(cardList, b[i]);
                removeCd(cardList, b[i]);
            }
            return cardList; //剩下的是翅膀
        }

        if (maxLinkNum >= (bodyLen || 2)) {
            if (bodyLen || maxLinkNum == 2) {
                //在指定长度或者最大长度为2时直接判定带牌数
                maxLinkNum = bodyLen ? bodyLen : maxLinkNum;
                if (cards.length <= maxLinkNum * 5) {
                    body1 = queue.slice().splice(maxLinkIdx + 1 - maxLinkNum, maxLinkNum);
                    wing1 = getWing(body1, cards);
                }
            }
            else {
                var bodyList = [];
                //没指定body长度时要考虑拆飞机组带牌(飞机长度变化)的情况
                for (var i = 2; i <= maxLinkNum; i++) {
                    if (cards.length <= i * 5) {

                        //这里取maxLinkIdx默认就是牌点最大的飞机
                        var b = queue.slice().splice(maxLinkIdx + 1 - i, i);
                        if (b.length > 0) {
                            var preFeiJi = {body:b, wing:getWing(b, cards)};
                            if(this.checkFeiJiValid(preFeiJi, handCount, createParam)) {
                                bodyList.push(b);
                            }
                        }
                    }
                }

                //没指定长度时，默认取最大长度
                if (bodyList.length > 0) {
                    body1 = bodyList[0];
                    for (var i = 1; i < bodyList.length; i++) {
                        if (bodyList[i].length > body1.length) {
                            body1 = bodyList[i];
                        }
                    }
                }

                //翅膀
                if (body1.length > 0) {
                    wing1 = getWing(body1, cards);
                }
            }
        }

        body = body1;
        wing = wing1;
        return {body: body, wing: wing1};
    }

    // 检查飞机合法性
    DianTuo.prototype.checkFeiJiValid = function(feiji, handCount, createParam) {
        if (!feiji || !feiji.body || !feiji.wing) {
            return false;
        }
        var cardsLen = feiji.body.length * 3 + feiji.wing.length;
        handCount = handCount ? handCount : cardsLen;
        if(createParam.isZuiHouShaoDai) {
            if(handCount != cardsLen) {
                //仅最后少带牌，又不是最后一手的情况下，必须(3带2) * n的形式
                //翅膀张数必须是body的2倍
                return feiji.wing.length == 2 * feiji.body.length;
            }
            return feiji.wing.length <= 2 * feiji.body.length;
        }else {
            //翅膀张数必须是body的0，1，2倍
            return (feiji.wing.length == 0 ||
                    feiji.wing.length == feiji.body.length ||
                    feiji.wing.length == 2 * feiji.body.length);
        }
    }

    // 检查三张合法性
    DianTuo.prototype.checkSanZhangValid = function(sanZhang, handCount, createParam) {
        if (!sanZhang) {
            return false;
        }
        if (!sanZhang.body || sanZhang.body == -1 || !sanZhang.wing) {
            return false;
        }
        var cardsLen = sanZhang.wing.length + 3;
        handCount = handCount ? handCount : cardsLen;
        if(createParam.isZuiHouShaoDai) {
            if(handCount != cardsLen) {
                //仅最后少带牌，又不是最后一手的情况下，必须(3带2) * n的形式
                return sanZhang.wing.length == 2;
            }
            return sanZhang.wing.length <= 2;
        }

        return true;
    }

    // 是否飞机
    DianTuo.prototype.isFeiJi = function(cards, hasWings, handCount, createParam) {
        if (cards.length < 6) {
            return false;
        }

        handCount = handCount ? handCount : cards.length;
        var struct = this.analyzeFeiJi(createParam, handCount, cards, hasWings);
        if (struct.body.length < 2) {
            return false;
        }

        return this.checkFeiJiValid(struct, handCount, createParam);
    }

    // 是否同花5-10-k
    DianTuo.prototype.isTongHuaWuShiK = function(cards) {
        if (cards.length != 3) {
            return false;
        }

        cards = cards.slice();
        cards.sort(function(a, b) {
            return _.point(a) - _.point(b);
        });

        if (_.point(cards[0]) != 5 || _.point(cards[1]) != 10 || _.point(cards[2]) != 13) {
            return false;
        }

        if (_.suit(cards[0]) != _.suit(cards[1]) || _.suit(cards[0]) != _.suit(cards[2])) {
            return false;
        }

        return true;
    }

    // 是否杂花5-10-k
    DianTuo.prototype.isZaHuaWuShiK = function(cards) {
        if (cards.length != 3) {
            return false;
        }

        cards = cards.slice();
        cards.sort(function(a, b) {
            return _.point(a) - _.point(b);
        });

        if (_.point(cards[0]) != 5 || _.point(cards[1]) != 10 || _.point(cards[2]) != 13) {
            return false;
        }

        if (_.suit(cards[0]) == _.suit(cards[1]) && _.suit(cards[0]) == _.suit(cards[2])) {
            return false;
        }

        return true;
    }

    // 是否5-10-k
    DianTuo.prototype.isWuShiK = function(cards) {
        return this.isZaHuaWuShiK(cards) || this.isTongHuaWuShiK(cards);
    }

    // 是否炸弹(4王天炸 普通牌4张 或者 混合王凑的炸弹)
    DianTuo.prototype.isZhaDan = function(cards, createParam) {
        MAX_NUMS_ZHADAN = createParam.isSanFuPai ? 12 : MAX_NUMS_ZHADAN;
        if (cards.length < 4 || cards.length > MAX_NUMS_ZHADAN) {
            return false;
        }

        if (this.isWangZha(cards)) {
            return true;
        }

        //混合炸
        if (this.isMixZha(cards, createParam)) {
            return true;
        }

        //普通炸
        for (var i = 1; i < cards.length; i++) {
            if (_.point(cards[i]) != _.point(cards[i - 1])) {
                return false;
            }
        }

        return true;
    }

    // 是否天炸
    DianTuo.prototype.isWangZha = function(cards) {
        if (cards.length != 4) {
            return false;
        }

        for (var i = 0; i < cards.length; i++) {
            if (cards[i] != BIG_JOKER && cards[i] != SMALL_JOKER) {
                return false;
            }
        }

        return true;
    }

    // 混合炸(普通炸弹的基础上再+王)
    DianTuo.prototype.isMixZha = function(cards, createParam) {
        if (createParam.isZhaNoKing) {
            return false;   //规定炸弹不带王
        }

        MAX_NUMS_ZHADAN = createParam.isSanFuPai ? 12 : MAX_NUMS_ZHADAN;
        if (cards.length < 5 || cards.length > MAX_NUMS_ZHADAN) {
            return false;
        }

        var arr = cards.slice();
        //提取王
        var jokerList = [];
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == SMALL_JOKER || arr[i] == BIG_JOKER) {
                jokerList.push(arr[i]);
            }
        }

        if (jokerList.length == 0) {
            return false;
        }

        //剔除提出的王
        for (var i = 0; i < jokerList.length; i++) {
            var joker = jokerList[i];
            var idx = arr.indexOf(joker);
            if (idx >= 0) {
                arr.splice(idx, 1);
            }
        }

        if (arr.length < 4) {
            return false;
        }

        for (var i = 1; i < arr.length; i++) {
            //剩下的牌如果不一致
            if (_.point(arr[i]) != _.point(arr[i - 1])) {
                return false;
            }
        }

        return true;
    }

    // 获取所有的王 
    DianTuo.prototype.getJokerCards = function(cards) {
        if (!cards || cards.length == 0) {
            return [];
        }

        var jokerList = [];
        for (var i = 0; i < cards.length; i++) {
            if (cards[i] == SMALL_JOKER || cards[i] == BIG_JOKER) {
                jokerList.push(cards[i]);
            }
        }

        return jokerList;
    }

    // 获取牌型
    DianTuo.prototype.getCardType = function(cards, hasWings, handCount, createParam) {
        if (!cards) {
            return CARD_TYPE.noType;
        }
        
        hasWings = true;
        
        if (this.isDanZhang(cards)) {
            return CARD_TYPE.danZhang;
        }

        if (this.isZhaDan(cards, createParam)) {
            return CARD_TYPE.zhaDan;
        }

        if (this.isDuiZi(cards)) {
            return CARD_TYPE.duiZi;
        }

        if (this.isSanZhang(createParam, cards, hasWings, handCount)) {
            return CARD_TYPE.sanZhang;
        }

        if (this.isShunZi(cards, createParam)) {
            return CARD_TYPE.shunZi;
        }

        if (this.isLianDui(cards, createParam)) {
            return CARD_TYPE.lianDui;
        }

        if (this.isFeiJi(cards, hasWings, handCount, createParam)) {
            return CARD_TYPE.feiJi;
        }

        if (this.isTongHuaWuShiK(cards)) {
            return CARD_TYPE.tongHuaWuShiK;
        }

        if (this.isZaHuaWuShiK(cards)) {
            return CARD_TYPE.zaHuaWuShiK;
        }

        return CARD_TYPE.noType;
    }

    // 获取炸弹权值
    DianTuo.prototype.getZhaDanValue = function(cards) {
        if (!cards || cards.length <= 0) {
            return 0;
        }
        var value;
        //先排序，否则混合炸会算错
        cards = cards.sort(function(a, b) {
            return a - b;
        });
        if (this.isWangZha(cards) /*cards[0] == BIG_JOKER || cards[0] == SMALL_JOKER*/) {
            value = 9 * 100;  //天炸无敌
        } else {
            value = cards.length * 100 + _.point(cards[0]);
        }

        return value;
    }

    // 获取同花色5-10-k权值
    DianTuo.prototype.getWuShiKValue = function(cards, createParam) {
        if (!createParam.isHuaSeValid || !cards || cards.length <= 0) {
            return 0;
        }
        return _.suit(cards[0]); 
    }

    // 牌1是否比牌2大
    DianTuo.prototype.isBigger = function(createParam, handCount, cards1, cards2, type2, hasWings, bodyLen) {
        hasWings = true;

        var type1 = this.getCardType(cards1, hasWings, handCount, createParam);
        type2 = type2 || this.getCardType(cards2, hasWings, null, createParam);

        if (type1 == CARD_TYPE.noType || type2 == CARD_TYPE.noType) {
            return false;
        }

        if (type1 < type2) {
            return false;
        }

        if (type1 > type2) {
            return type1 >= CARD_TYPE.zaHuaWuShiK;
        }

        // 同种牌型
        switch (type1) {
            case CARD_TYPE.danZhang: // 单张
            case CARD_TYPE.duiZi:    // 对子
                return _.point(cards1[0]) > _.point(cards2[0]);
            case CARD_TYPE.sanZhang: // 三张
                var sanZhang1 = this.analyzeSanZhang(cards1);
                var sanZhang2 = this.analyzeSanZhang(cards2);
                var bodyRet = sanZhang1.body > sanZhang2.body;
                var wingRet = false;
                if (createParam.isZuiHouShaoDai) {
                    if(handCount == cards1.length) {
                        wingRet = true;  //最后一手无翅膀限制
                    }else {
                        wingRet = sanZhang1.wing.length == 2; //必须带2张
                    }
                }else {
                    wingRet = sanZhang1.wing.length == sanZhang2.wing.length; //带牌数必须相同
                }
                return bodyRet && wingRet;
            case CARD_TYPE.shunZi:  // 顺子
                if (cards1.length != cards2.length) {
                    return false;
                }

                return this.analyzeShunZi(cards1, createParam)[0] > this.analyzeShunZi(cards2, createParam)[0];
            case CARD_TYPE.lianDui: // 连对
                if (cards1.length != cards2.length) {
                    return false;
                }
                
                return this.analyzeLianDui(cards1, createParam)[0] > this.analyzeLianDui(cards2, createParam)[0];
            case CARD_TYPE.feiJi: // 飞机
                var feiji1 = this.analyzeFeiJi(createParam, handCount, cards1, hasWings, bodyLen);
                var feiji2 = this.analyzeFeiJi(createParam, null, cards2, hasWings, bodyLen);
                if (createParam.isZuiHouShaoDai) {
                    if(handCount == cards1.length) {
                        return feiji1.body[0] > feiji2.body[0]; //最后一手可少带
                    }else {
                        //带牌必须是2的倍数
                        if (feiji1.wing.length != feiji1.body.length * 2) {
                            return false;
                        }
                        return feiji1.body[0] > feiji2.body[0];
                    } 
                }else {
                    if (cards1.length != cards2.length) {
                        return false;
                    }

                    return feiji1.body[0] > feiji2.body[0];
                }
                break;
            case CARD_TYPE.zaHuaWuShiK: // 杂花五十K
                return false;
            case CARD_TYPE.tongHuaWuShiK: // 同花五十K
                if(createParam.isHuaSeValid) {
                    return this.getWuShiKValue(cards1, createParam) > this.getWuShiKValue(cards2, createParam);
                }
                return false;
            case CARD_TYPE.zhaDan: // 炸弹
                return this.getZhaDanValue(cards1) > this.getZhaDanValue(cards2);
        }
    }

    // 是否要的起
    DianTuo.prototype.canBeat = function(createParam, hand, cards2, type2, hasWings, bodyLen) {
        hasWings = true;

        type2 = type2 || this.getCardType(cards2, hasWings, null, createParam);
        if (type2 == CARD_TYPE.noType) {
            return false;
        }

        var p_dict = {};
        var c_dict = {};
        var jokerList = [];
        for (var i = 0; i < hand.length; i++) {
            var p = _.point(hand[i]);
            p_dict[p] = p_dict[p] ? p_dict[p] + 1 : 1;

            var c = hand[i];
            c_dict[c] = c_dict[c] ? c_dict[c] + 1 : 1;

            if (c == BIG_JOKER || c == SMALL_JOKER) {
                jokerList.push(c);
            }
        }

        // 牌点按张数 分类
        var pHash = [
            [], // 0张的牌点(wuyong)
            [], // 1张
            [], // 2张
            [], // 3张
            [], // 4张及以上
        ];
        for (var k in p_dict) {
            var idx = Math.min(p_dict[k], 4); 
            pHash[idx].push(Number(k));
        }

        var mixZhaList = this.getMixZha(hand, createParam);  //统计混合炸
        var comZhaDanList = pHash[4]; // 普通炸弹  此处不含混合炸和王炸
        var wangZha = jokerList.length == 4;
        //天炸最大, 此处可直接判断一次, 提高效率
        if (wangZha) {
            return true;
        }
        var tongHuaFlag = false;
        var zaHuaFlag = false;
        var wskList = this.getWuShiKCardsList(hand);
        var tongHuaList = [];
        var zaHuaList = [];
        for (var k in wskList) {
            if(wskList[k].cardType == CARD_TYPE.tongHuaWuShiK) {
                tongHuaList.push(wskList[k].cards);
                tongHuaFlag = true;
            }else {
                zaHuaList.push(wskList[k].cards);
                zaHuaFlag = true;
            }
        }
        
        /*
        for (var suit in SUIT_TYPE) {
            if (c_dict[SUIT_TYPE[suit] * 100 + 5] > 0 && c_dict[SUIT_TYPE[suit] * 100 + 10] > 0 && c_dict[SUIT_TYPE[suit] * 100 + 13] > 0) {
                tongHuaFlag = true;
                break;
            }
        }

        if (!tongHuaFlag) {
            if (p_dict[5] > 0 && p_dict[10] > 0 && p_dict[13] > 0) {
                zaHuaFlag = true;
            } 
        }
        */
        if (type2 < CARD_TYPE.zaHuaWuShiK) { // 杂花五十K以下牌型
            /*
            if (type2 == CARD_TYPE.danZhang || type2 == CARD_TYPE.duiZi) {
                if (jokerList.length > 0) {
                    return true;
                }
            }
            */

            if (tongHuaFlag || zaHuaFlag || jokerList.length == 4 || 
                comZhaDanList.length > 0 || mixZhaList.length > 0 || wangZha) {
                return true;
            }

            var list = [];
            var value = 0; // 比较值
            var linkNum = 0; // 连对 飞机连牌数
            switch (type2) {
                case CARD_TYPE.danZhang: // 单张
                    list = pHash[1].concat(pHash[2], pHash[3]);
                    value = _.point(cards2[0]);
                    break;
                case CARD_TYPE.duiZi:    // 对子
                    list = pHash[2].concat(pHash[3]);
                    value = _.point(cards2[0]);
                    break;
                case CARD_TYPE.sanZhang: // 三张
                    list = pHash[3];
                    value = this.analyzeSanZhang(cards2).body;
                    break;
                case CARD_TYPE.shunZi: // 顺子
                    list = pHash[1].concat(pHash[2], pHash[3]);
                    linkNum = cards2.length;
                    var queue = this.analyzeShunZi(cards2, createParam);
                    value = queue[queue.length - 1];
                    break;
                case CARD_TYPE.lianDui: // 连对
                    list = pHash[2].concat(pHash[3]);
                    linkNum = cards2.length / 2;
                    var queue = this.analyzeLianDui(cards2, createParam);
                    value = queue[queue.length - 1];
                    break;
                case CARD_TYPE.feiJi: // 飞机
                    list = pHash[3];
                    var body2 = this.analyzeFeiJi(createParam, null, cards2, hasWings, bodyLen).body;
                    linkNum = body2.length;
                    value = body2[body2.length - 1];
                    break;
                default:
                    break;
            }

            // console.log("list@@ ", list, " value@@ ", value, " linkNum@@ ", linkNum);
            if (type2 == CARD_TYPE.danZhang || type2 == CARD_TYPE.duiZi || type2 == CARD_TYPE.sanZhang) {
                for (var i = list.length - 1; i >= 0; i--) {
                    if (list[i] > value) {
                        if (type2 == CARD_TYPE.sanZhang) {
                            if(createParam.isZuiHouShaoDai) {
                                return true; 
                            }
                            //三张还必须张数一样
                            return hand.length >= cards2.length
                        }
                        return true;
                    }
                }
            } else { // 顺子 连对 飞机
                var nowLinkNum = 1;
                var copy = list.slice();
                //2, 大小王 不参与顺子 连对 飞机
                _.delCanNotLink(copy);

                copy.sort(function(a, b) {
                    return a - b;
                });

                for (var i = copy.length - 1; i > 0; i--) {

                    if (copy[i] <= value + 1 - nowLinkNum) { 
                        return false;       //58连可用的情况下, 此处其实已经过滤掉了5-8连, 因为是最小的连
                    }

                    nowLinkNum = (copy[i] - copy[i - 1] == 1 || 
                        (copy[i] == 8 && copy[i - 1] == 5 && createParam.isSanFuPai)) ? nowLinkNum + 1 : 1;
                    if (nowLinkNum >= linkNum) {    
                        if (type2 == CARD_TYPE.feiJi) {
                            if(createParam.isZuiHouShaoDai) {
                                return true;
                            }
                            return hand.length >= cards2.length; //飞机必须用相同牌数压;
                        }
                        return true;
                    }
                }
            }

            return false;
        }

        switch (type2) {
            case CARD_TYPE.zaHuaWuShiK: // 杂花五十K
                return (tongHuaFlag || wangZha || comZhaDanList.length > 0 || mixZhaList > 0);
            case CARD_TYPE.tongHuaWuShiK: // 同花五十K
                if(wangZha || comZhaDanList.length > 0 || mixZhaList > 0) {
                    return true;
                }
                if(createParam.isHuaSeValid && tongHuaFlag) {
                    var cards2Value = this.getWuShiKValue(cards2, createParam);
                    for(var t = 0; t < tongHuaList.length; t++) {
                        if(this.getWuShiKValue(tongHuaList[t], createParam) > cards2Value) {
                            return true;
                        }
                    }
                }
                break;
            case CARD_TYPE.zhaDan: // 炸弹
                if (wangZha) {
                    return true;    //天炸无敌
                }
                var value = this.getZhaDanValue(cards2);
                
                // 混合炸
                for (var i = 0; i < mixZhaList.length; i++) {
                    if (this.getZhaDanValue(mixZhaList[i]) > value) {
                        return true;
                    }
                }

                // 普通炸
                for (var i = 0; i < comZhaDanList.length; i++) {
                    var p = comZhaDanList[i];
                    if (p_dict[p] * 100 + p > value) {
                        return true;
                    }
                }
        }

        return false;
    }

    // 获取三张/飞机的翅膀提示
    DianTuo.prototype.getHintWing = function(allHints, mode, cards, key, wing) {
        /*
            1、接三张不带牌，保持现有逻辑

            2、接三带一，提示也带一张牌，带牌按以下优先级选择
            1）选择一张散牌 - 请注意，如果玩法选择了【不打顺子】，则检查散牌是顺子不算牌型
            2）选择一张顺子里面去掉也不会拆散顺子、且不成对的牌
            3）从最小对子拆一张牌
            4）选择最小的一张牌

            3、接三带二，提示也带两张牌，带牌按以下优先级，从考虑的牌里直到选出最小两张为止
            1）只考虑散牌 - 请注意，如果玩法选择了【不打顺子】，则顺子可以拆散
            2）把顺子里面去掉也不会拆散顺子、且不成对的牌也加入考虑
            3）把最小对子拆散加入考虑
            4）所有牌都考虑
        */
        // console.log("所有牌型=", JSON.stringify(allHints));
        // console.log(key, "=", JSON.stringify(cards));
        // console.log("翅膀", wing);

        var self = this;
        var wings = [];
        cards = cards.slice();
        allHints = JSON.parse(JSON.stringify(allHints));
        //剔除已选中的主体牌型
        var list = allHints[key].slice();
        var sortCards = function(a, b) {
            return a - b;
        }
        var sortByPoint = function(a, b) {
            if (_.point(a[0]) == _.point(b[0])) {
                return a[0] - b[0];
            }

            return _.point(a[0]) - _.point(b[0]);
        }
        cards.sort(sortCards);
        for(var k=0; k < list.length; k++) {
            list[k].sort(sortCards);
        }
        for(var k=0; k < list.length; k++) {
            if(list[k].toString() == cards.toString()) {
                list.splice(k, 1);
                break;
            }
        }
        /*如果是拆散飞机过来的三张, 飞机数组可能将改变, 理论上如果带牌需要拆三张或者拆飞机时优先拆三张
          此处暂时不予考虑, 可能会拆三张, 也可能会拆飞机
        if(key == 'sanZhang') {
            //提示的三张可能拆了飞机, 三张, 飞机, 牌型需要重新统计
        }
        */

        var extractWings = function(num) {
            //先统计对子(连对也拆进来)
            var duiZiList = allHints.duiZi;
            var lianDuiList = allHints.lianDui;
            duiZiList.sort(sortByPoint);
            lianDuiList.sort(sortByPoint);

            //连对可能包含了对子
            for(var i = 0; i < lianDuiList.length; i++) {
                var lianDui = lianDuiList[i];
                for(var j = 0; j < duiZiList.length; j++) {
                    var k1 = lianDui.indexOf(duiZiList[j][0]);
                    var k2 = lianDui.indexOf(duiZiList[j][0]);
                    if(k1 >= 0) {
                        lianDui.splice(k1, 1);
                    }
                    if(k2 >= 0) {
                        lianDui.splice(k2, 1);
                    }
                }
            }

            var duiZiToDanList = [];
            var toDan = function(list) {
                for(var k=0; k < list.length; k++) {
                    var duiZi = list[k];
                    for(var j=0; j<duiZi.length; j++) {
                        if(_.point(duiZi[j]) == _.point(cards[0])) 
                            continue; //对子可能是拆了三张或飞机的情况
                        duiZiToDanList.push(duiZi[j]);
                    }
                }
            }
            toDan(duiZiList);
            toDan(lianDuiList);
            self.formatSort(duiZiToDanList);

            //按优先级提取
            // 1.单牌
            var idx = 0;
            var validList = [];
            var danList = allHints.danZhang;
            var shunList = allHints.shunZi;
            var zhaDanList = allHints.zhaDan;   //单王可能可以凑炸，也排除
            for(var m=0; m<danList.length; m++) {
                var isInShunZi = false;
                var isInZha = false;
                for(var n=0; n<shunList.length; n++) {
                    self.formatSort(shunList[n]);
                    if(shunList[n].indexOf(danList[m][0]) >= 0) {
                        isInShunZi = true;
                        break;
                    }
                }
                for(var n=0; n<zhaDanList.length; n++) {
                    self.formatSort(zhaDanList[n]);
                    if(zhaDanList[n].indexOf(danList[m][0]) >= 0) {
                        isInZha = true;
                        break;
                    }
                }
                if(!isInShunZi && !isInZha) {
                    validList.push(danList[m]);
                }
            }
            self.formatSort(validList);
            while(wings.length < num && validList.length > idx) {
                wings.push(validList[idx]);
                idx++;
            }
            if(wings.length == num) {
                return wings;
            }

            // 2.拆顺子
            shunList.sort(sortByPoint);
            for(var m=0; m<shunList.length; m++) {
                idx = 0;
                var validNum = shunList[m].length - 5;
                while(wings.length < num && validNum > 0 && idx < shunList[m].length) {
                    var card = shunList[m][idx];
                    var breakShunZi = shunList[m].slice();
                    breakShunZi.splice(idx, 1);
                    if(duiZiToDanList.indexOf(card) < 0 && 
                        self.isShunZi(breakShunZi, mode)) {
                        wings.push(card);
                        validNum--;
                    } 
                    idx++;
                }
                if(wings.length == num) {
                    return wings;
                }
            }

            // 3.拆对子(此处暂未考虑一种情况.对子拆后遗留的单牌小于原本的单牌,可能需要带整个对子而保留较大单牌)
            while(wings.length < num && duiZiToDanList.length > idx) {
                wings.push(duiZiToDanList[idx]);
                idx++;
            }
            if(wings.length == num) {
                return wings;
            }

            idx = 0;
            // 4.最小的牌
            var allCards = [];
            for(var k in allHints) {
                var curType = k == key ? list : allHints[k];
                for(var t=0; t<curType.length; t++) {
                    allCards = allCards.concat(curType[t])
                }
            }
            self.formatSort(allCards);
            //剔除已经选中的牌
            for(var k=0; k<wings.length; k++) {
                var index = allCards.indexOf(wings[k]);
                allCards.splice(index, 1);
            }
            while(wings.length < num && allCards.length > idx) {
                wings.push(allCards[idx]);
                idx++;
            }
        }

        if(mode.isZuiHouShaoDai) {
            //仅最后一手可少带的情况下，强制带2*n张
            extractWings(cards.length/3 * 2);
        }else {
            if(!wing || wing.length == 0) {
                //回合第一手出牌(默认不提示带牌) || 接对家不带翅膀的牌
                return [];
            }
            extractWings(wing.length);
        }

        return wings;
    }

    // 提示出牌
    DianTuo.prototype.hintPutCard = function(createParam, hand, cards2, type2, hasWings, bodyLen, isNoShunZi) {
        var shun;
        if (createParam.isSanFuPai) {
            shun = [5, 8, 9, 10, 11, 12, 13, 14];
        } else {
            shun = SHUN_QUEUE.slice();
        }

        hasWings = true;

        var hintMatrix = [];
        if (cards2) {
            type2 = type2 || this.getCardType(cards2, hasWings, null, createParam);
            if (type2 == CARD_TYPE.noType) {
                return hintMatrix;
            }
        }

        var breakMatrix = []; // 需拆组合的牌（连对,三张,飞机）

        // 牌统计; 提取炸弹 五十K
        var p_dict = {
            "5": 0,
            "10": 0,
            "13": 0
        };
        var c_dict = {};
        var jokerList = [];
        for (var i = 0; i < hand.length; i++) {
            var c = hand[i];
            if (c == BIG_JOKER || c == SMALL_JOKER) {
                jokerList.push(c);
                //continue;
            }
            c_dict[c] = c_dict[c] ? c_dict[c] + 1 : 1;

            var p = _.point(hand[i]);
            p_dict[p] = p_dict[p] ? p_dict[p] + 1 : 1;

        }

        var zhaDanList = []; // 炸弹
        var wuShiKList = []; // 五十K

        function out(row) {
            for (var i = 0; i < row.length; i++) {
                c_dict[row[i]]--;
                p_dict[_.point(row[i])]--;
            }
        } 

        // 获取一定张数的特定牌点的牌
        function getCardsByNum(point, needNum) {
            // console.log("getCardsByNum point@@", point, " needNum@@ ", needNum);
            // console.log("c_dict @@", JSON.stringify(c_dict));
            if (point == 2 || point == 1) { // 2实际编码
                point += 13;
            }

            var rtn = [];
            var findNum = 0;
            if (point >= _.point(SMALL_JOKER)) { // 王不在c_dict p_dict中
                for (var i = 0; i < jokerList.length; i++) {
                    if (_.point(jokerList[i]) == point) {
                        rtn.push(jokerList[i]);
                        findNum++;
                        if (findNum >= needNum) {
                            break;
                        }
                    }
                }
                return rtn;
            }

            while (findNum < needNum) {
                for (var suit in SUIT_TYPE) {
                    var cd = SUIT_TYPE[suit] * 100 + point;
                    var num = c_dict[cd];
                    if (num && num > 0) {
                        for (var i = 1; i <= Math.min(num, needNum - findNum); i++) {
                            rtn.push(cd);
                        }
                        findNum += num;
                    }
                }
            }

            // console.log('rtn@@ ', rtn);
            return rtn;
        }

        // 取五十K
        var tongHuaFlag = false;
        var zaHuaFlag = false;
        var tongHuaList = [];
        var zaHuaList = [];
        if (p_dict[5] < 4 && p_dict[10] < 4 && p_dict[13] < 4) {
            var num = Math.min(p_dict[5], p_dict[10], p_dict[13]);
            var findNum = 0;
            for (var i = 1; i <= 4; i++) {
                if (c_dict[i * 100 + 5] > 0 && c_dict[i * 100 + 10] > 0 && c_dict[i * 100 + 13] > 0) {
                    var row = [i * 100 + 5, i * 100 + 10, i * 100 + 13];
                    wuShiKList.push(row);
                    tongHuaList.push(row);
                    tongHuaFlag = true;
                    out(row);
                    findNum++;
                    i--;
                }
            }

            while(num - findNum) {
                zaHuaFlag = true;
                var row = [getCardsByNum(5, 1)[0], getCardsByNum(10, 1)[0], getCardsByNum(13, 1)[0]];
                wuShiKList.push(row);
                zaHuaList.push(row);
                out(row);
                findNum++;
            }
        }

        // 牌点按张数 分类
        var pHash = [
            [], // 0张的牌点(wuyong)
            [], // 1张
            [], // 2张
            [], // 3张
        ];

        jokerList.sort(function(a, b) {
            return a - b;
        });

        var zhaDanList = [];
        if (jokerList.length == 4) {
            zhaDanList.push({cards: jokerList, value: this.getZhaDanValue(jokerList)});
        }

        // console.log("p_dict@@ ", p_dict);

        for (var k in p_dict) {
            var count = p_dict[k];
            var point = Number(k);
            if (count > 0 && count <= 3) {
                pHash[count].push(point);
            } else if (count >= 4) {
                var cards = getCardsByNum(point, count); // 组成炸弹的牌
                zhaDanList.push({cards: cards, value: this.getZhaDanValue(cards)});
            }
        }

        var mixZhaList = this.getMixZha(hand, createParam);
        if (mixZhaList && mixZhaList.length > 0) {
            //混合炸
            for (var i = 0; i < mixZhaList.length; i++) {
                var cards = mixZhaList[i];
                zhaDanList.push({cards: cards, value: this.getZhaDanValue(cards)});
            }
        }

        // console.log("pHash@@ ", pHash);
        // console.log("zhaDanList@@ ", zhaDanList);

        zhaDanList.sort(function(a, b) {
            return a.value - b.value;
        });

        var allZhaMatrix = [
            [], // 杂花五十K
            [], // 同花五十K
            []  //炸弹
        ];

        if (tongHuaFlag) {
            allZhaMatrix[1] = [tongHuaList[0]]; //[wuShiKList[0]];
        }

        if (zaHuaFlag) {
            allZhaMatrix[0] = [zaHuaList[0]]; //[wuShiKList[wuShiKList.length - 1]];
        }
        
        for (var i = 0; i < zhaDanList.length; i++) {
            allZhaMatrix[2].push(zhaDanList[i].cards);
        }

        // console.log("zhaDanList@@ ", zhaDanList);
        // console.log("allZhaMatrix@@ ", allZhaMatrix);

        var bigTypeMatrix = []; // 更大牌型
        var sameTypeMatrix = []; // 同种牌型的大牌
        var idx = 0;
        if (cards2 && type2 >= CARD_TYPE.zaHuaWuShiK) {
            idx = type2 + 1 - CARD_TYPE.zaHuaWuShiK;
        }

        for (var i = idx; i < allZhaMatrix.length; i++) {
            bigTypeMatrix = bigTypeMatrix.concat(allZhaMatrix[i]);
        }

        // console.log("bigTypeMatrix@@ ", bigTypeMatrix);

        // 单张、对子不拆连对 三张不拆飞机;
        function canLink(list, i) {
            var idx = shun.indexOf(list[i]);
            if (idx < 0) {
                return false;  // 排除非顺子元素
            }

            if ((idx > 0 && list.indexOf(shun[idx - 1]) >= 0) || (idx < shun.length - 1 && list.indexOf(shun[idx + 1]) >= 0)) {
                return true;
            }

            return false;
        }

        //新增提示三张、飞机带牌，这里以回合第一首所有的可能为基础进行选取
        var allHints = {};   
        allHints.danZhang = [];
        allHints.duiZi = [];
        allHints.shunZi = [];
        allHints.lianDui = [];
        allHints.sanZhang = [];
        allHints.feiJi = [];
        allHints.zhaDan = bigTypeMatrix;            

        var self = this;
        var getAllHint = function() {
            // 单张
            for (var i = 0; i < pHash[1].length; i++) {
                var cards = getCardsByNum(pHash[1][i], 1);
                allHints.danZhang.push(cards);
            }

            // 对子
            for (var i = 0; i < pHash[2].length; i++) {
                var point = pHash[2][i];
                if (!canLink(pHash[2], i)) {
                    var cards = getCardsByNum(point, 2);
                    allHints.duiZi.push(cards);
                }
            }

            // 三张
            for (var i = 0; i < pHash[3].length; i++) {
                var point = pHash[3][i];
                if (!canLink(pHash[3], i)) {
                    var cards = getCardsByNum(point, 3);
                    allHints.sanZhang.push(cards);
                }
            }

            // 顺子 连对 飞机牌型组合
            var pushLinkCards = function(list, endPos, linkNum, needNum, linkType) {
                var cards = [];
                for (var i = linkNum - 1; i >= 0; i--) {
                    cards = cards.concat(getCardsByNum(shun[endPos - i], needNum));
                }

                self.formatSort(cards);
                allHints[linkType].push(cards);
            }.bind(self);

            if(!isNoShunZi) {
                // 顺子
                var list = pHash[1].concat(pHash[2]);
                list = list.slice()
                _.delCanNotLink(list);
                
                list.sort(function(a, b) {
                    return a - b;
                });

                var nowLinkNum = 1;
                var pos = 0;
                for (var i = 1; i < list.length; i++) {
                    if (nowLinkNum == 1) {
                        pos = shun.indexOf(list[i - 1]);
                    }

                    if (list[i] == shun[pos + 1]) {
                        nowLinkNum++;
                        pos++;
                    } else {
                        if (nowLinkNum >= 5) {
                            pushLinkCards(list, pos, nowLinkNum, 1, "shunZi");
                        }
                        nowLinkNum = 1;
                    }

                    if (i == list.length - 1 && nowLinkNum >= 5) { // 收尾
                        // if (nowLinkNum == shun.length) {
                        //     nowLinkNum--;
                        // }
                        pushLinkCards(list, pos, nowLinkNum, 1, "shunZi");
                    }
                }
            }

            // 连对
            var list = pHash[2].slice();
            _.delCanNotLink(list);
            for (var i = 0; i < pHash[3].length; i++) {
                if (!canLink(pHash[3], i)) {
                    list.push(pHash[3][i]);
                }
            }

            list.sort(function(a, b) {
                return a - b;
            });

            var nowLinkNum = 1;
            var pos = 0;
            for (var i = 1; i < list.length; i++) {
                if (nowLinkNum == 1) {
                    pos = shun.indexOf(list[i - 1]);
                }

                if (list[i] == shun[pos + 1]) {
                    nowLinkNum++;
                    pos++;
                } else {
                    if (nowLinkNum >= 2) {
                        pushLinkCards(list, pos, nowLinkNum, 2, "lianDui");
                    }
                    nowLinkNum = 1;
                }

                if (i == list.length - 1 && nowLinkNum >= 2) { // 收尾
                    // if (nowLinkNum == shun.length) {
                    //     nowLinkNum--;
                    // }
                    pushLinkCards(list, pos, nowLinkNum, 2, "lianDui");
                }
            }

            // 飞机
            list = pHash[3].slice();
            _.delCanNotLink(list);
            list.sort(function(a, b) {
                return a - b;
            });

            nowLinkNum = 1; 
            pos = 0;
            for (var i = 1; i < list.length; i++) {
                if (nowLinkNum == 1) {
                    pos = shun.indexOf(list[i - 1]);
                }

                if (list[i] == shun[pos + 1]) {
                    nowLinkNum++;
                    pos++;
                } else {
                    if (nowLinkNum >= 2) {
                        pushLinkCards(list, pos, nowLinkNum, 3, "feiJi");
                    }
                    nowLinkNum = 1;
                }

                if (i == list.length - 1 && nowLinkNum >= 2) { // 收尾
                    // if (nowLinkNum == SHUN_QUEUE.length) {
                    //     nowLinkNum--;
                    // }
                    pushLinkCards(list, pos, nowLinkNum, 3, "feiJi");
                }
            }
        }

        getAllHint();
        if (!cards2) { // 回合第一首牌
            var type = this.getCardType(hand, hasWings, hand.length, createParam);
            if (type == CARD_TYPE.sanZhang || type == CARD_TYPE.feiJi) { // 单张 飞机
                hand = hand.slice();
                this.formatSort(hand);
                return [hand];  
            }
            for(var key in allHints) {
                //炸弹最后返回时会加上
                if(key == 'zhaDan')
                    continue;
                var hintType = allHints[key];
                for(var idx in hintType) {
                    var cards = hintType[idx];
                    if(key == 'sanZhang' || key == 'feiJi') {
                        var wings = this.getHintWing(allHints, createParam, cards, key);
                        sameTypeMatrix.push(cards.concat(wings));
                    }else {
                        sameTypeMatrix.push(cards);
                    }
                }
            }
        } else if (type2 < CARD_TYPE.zaHuaWuShiK) { //五十K以下
            var needNum = 0; // 需要牌张数
            var list = []; // 可取牌点集合
            var breakList = []; 
            var value = 0; // 比较值
            var linkNum = 0; // 连对 飞机连牌数
            if (type2 == CARD_TYPE.sanZhang || type2 == CARD_TYPE.feiJi) { // 三张、飞机可带完 提示全部手牌
                var type = this.getCardType(hand, hasWings, hand.length, createParam);
                if ((type == CARD_TYPE.sanZhang || type == CARD_TYPE.feiJi) && this.isBigger(createParam, hand.length, hand, cards2, type2, hasWings, bodyLen)) {
                    hand = hand.slice();
                    this.formatSort(hand);
                    return [hand];
                }
            }
            
            switch (type2) {
                case CARD_TYPE.danZhang: // 单张
                    needNum = 1;
                    list = pHash[1];
                    breakList = pHash[3];
                    for (var i = 0; i < pHash[2].length; i++) {
                        if (!canLink(pHash[2], i)) { // 不拆连对
                            list.push(pHash[2][i]);
                        } else {
                            breakList.push(pHash[2][i]);
                        }
                    }
                    // list.sort(function(a, b) {
                    //     return a - b;
                    // });
                    value = _.point(cards2[0]);
                    break;
                case CARD_TYPE.duiZi:    // 对子
                    needNum = 2;
                    list = [];
                    breakList = pHash[3];
                    for (var i = 0; i < pHash[2].length; i++) {
                        if (!canLink(pHash[2], i)) { // 不拆连对
                            list.push(pHash[2][i]);
                        } else {
                            breakList.push(pHash[2][i]);
                        }
                    }
                    value = _.point(cards2[0]);
                    break;
                case CARD_TYPE.sanZhang: // 三张
                    needNum = 3;
                    list = [];
                    for (var i = 0; i < pHash[3].length; i++) {
                        if (!canLink(pHash[3], i)) { // 不拆飞机
                            list.push(pHash[3][i]);
                        } else {
                            breakList.push(pHash[3][i]);
                        }
                    }
                    value = this.analyzeSanZhang(cards2).body;
                    break;
                case CARD_TYPE.shunZi: // 顺子
                    needNum = 1;
                    list = pHash[1].concat(pHash[2]).concat(pHash[3]);
                    linkNum = cards2.length;
                    var queue = this.analyzeShunZi(cards2, createParam);
                    value = queue[queue.length - 1];
                    break;
                case CARD_TYPE.lianDui: // 连对
                    needNum = 2;
                    list = pHash[2].concat(pHash[3]);
                    linkNum = cards2.length / 2;
                    var queue = this.analyzeLianDui(cards2, createParam);
                    value = queue[queue.length - 1];
                    break;
                case CARD_TYPE.feiJi: // 飞机
                    needNum = 3;
                    list = pHash[3].slice();
                    var body2 = this.analyzeFeiJi(createParam, null, cards2, hasWings, bodyLen).body;
                    linkNum = body2.length;
                    value = body2[body2.length - 1];
                    break;
            }

            if (type2 == CARD_TYPE.danZhang || type2 == CARD_TYPE.duiZi || type2 == CARD_TYPE.sanZhang) {
                for (var i = 0; i < list.length; i++) {
                    if (list[i] > value) {
                        var cards = getCardsByNum(list[i], needNum);
                        if(type2 == CARD_TYPE.sanZhang) {
                            //计算带牌后加入
                            var sanZhang2 = this.analyzeSanZhang(cards2);
                            var wings = this.getHintWing(allHints, createParam, cards, 'sanZhang', sanZhang2.wing);
                            sameTypeMatrix.push(cards.concat(wings));
                        }else {
                            sameTypeMatrix.push(cards);
                        }
                    }
                }

                for (var i = 0; i < breakList.length; i++) {
                    if (breakList[i] > value) {
                        var cards = getCardsByNum(breakList[i], needNum);
                        if(type2 == CARD_TYPE.sanZhang) {
                            //计算带牌后加入
                            var sanZhang2 = this.analyzeSanZhang(cards2);
                            var wings = this.getHintWing(allHints, createParam, cards, 'sanZhang', sanZhang2.wing);
                            breakMatrix.push(cards.concat(wings));
                        }else {
                            breakMatrix.push(cards);
                        }
                    }
                }
            } else { // 顺子 连对 飞机
                var nowLinkNum = 1;
                list = list.slice();
                _.delCanNotLink(list);
                list.sort(function(a, b) {
                    return a - b;
                });

                for (var i = 1; i < list.length; i++) {
                    nowLinkNum = (list[i] - list[i - 1] == 1 || 
                        (list[i] == 8 && list[i - 1] == 5 && createParam.isSanFuPai)) ? nowLinkNum + 1 : 1;
                    if (nowLinkNum >= linkNum && list[i] > value) {
                        var cards = [];
                        for (var j = linkNum - 1; j >= 0; j--) {
                            cards = cards.concat(getCardsByNum(list[i] - j, needNum));
                        }

                        this.formatSort(cards);
                        if(type2 == CARD_TYPE.feiJi) {
                            //计算带牌后加入
                            var feiJi2 = this.analyzeFeiJi(createParam, null, cards2, hasWings, bodyLen);
                            var wings = this.getHintWing(allHints, createParam, cards, 'feiJi', feiJi2.wing);
                            sameTypeMatrix.push(cards.concat(wings));
                        }else {
                            sameTypeMatrix.push(cards);
                        }
                        nowLinkNum -= 1;
                    }
                }
            }
        } else {
            switch (type2) {
                case CARD_TYPE.zaHuaWuShiK: // 杂花五十K
                    break;
                case CARD_TYPE.tongHuaWuShiK: // 同花五十K
                    if(createParam.isHuaSeValid && tongHuaFlag) {
                        var cards2Value = this.getWuShiKValue(cards2, createParam);
                        for (var i = 0; i < tongHuaList.length; i++) {
                            if(this.getWuShiKValue(tongHuaList[i], createParam) > cards2Value) {
                                sameTypeMatrix.push(tongHuaList[i]);
                            }
                        }
                    }
                    break;
                case CARD_TYPE.zhaDan: // 炸弹
                    for (var i = 0; i < zhaDanList.length; i++) {
                        if (zhaDanList[i].value  > this.getZhaDanValue(cards2)) {
                            sameTypeMatrix = allZhaMatrix[2].slice(i);
                            break;
                        }
                    }
                    break;
            }
        }

        if (sameTypeMatrix.concat(bigTypeMatrix).length == 0 && breakMatrix.length > 0) {
            return breakMatrix;
        }

        return sameTypeMatrix.concat(bigTypeMatrix);
    }

    // 不可用的牌, 掂坨不用
    DianTuo.prototype.getDisabledList = function(createParam, hand, cards2, type2, hasWings, bodyLen) {
        hasWings = true;
        return []; // todo
        
        if (!cards2) {
            return [];
        }

        type2 = type2 || this.getCardType(cards2, hasWings, null, createParam);
        if (type2 == CARD_TYPE.noType) {
            return [];
        }

        var list4 = []; // 提取筒子 地炸 喜之前4张以上牌

        // 牌统计; 提取喜、地炸、筒子
        var p_dict = {};
        var c_dict = {};
        for (var i = 0; i < hand.length; i++) {
            var p = _.point(hand[i]);
            p_dict[p] = p_dict[p] ? p_dict[p] + 1 : 1;

            var c = hand[i];
            c_dict[c] = c_dict[c] ? c_dict[c] + 1 : 1;
        }

        var zhaDanList = []; // 炸弹 
        var tongZiList = []; // 筒子
        var diZhaList = []; // 地炸
        var xiList = []; // 喜
        for (var k in p_dict) {
            if (p_dict[k] >= 4) {
                list4.push(Number(k));
            }

            if (p_dict[k] >= 8 && deckNum == 3) {
                if (c_dict[Number(k) + 100] >= 2 && c_dict[Number(k) + 200] >= 2 && c_dict[Number(k) + 300] >= 2 && c_dict[Number(k) + 400] >= 2) {
                    diZhaList.push(Number(k));
                    // p_dict[k] -= 8;
                    // for (var i = 1; i <= 4; i++) {
                    //     c_dict[i * 100 + Number(k)] -= 2;
                    // }
                }
            }
        }
        
        for (var k in c_dict) {
            var cd = Number(k);
            // if (c_dict[k] == 3 && diZhaList.indexOf(_.point(k)) < 0) { // 地炸和筒子 优先地炸
            if (c_dict[k] == 3) { // 地炸和筒子 优先地炸
                tongZiList.push(cd);
                // p_dict[_.point(cd)] -= 3;
                // c_dict[cd] -= 3;
            } else if (c_dict[k] == 4) {
                xiList.push(cd);
                // p_dict[_.point(cd)] -= 4;
                // c_dict[cd] -= 4;
            }   
        }
        this.formatSort(tongZiList);

        // 牌点按张数 分类
        var pHash = [
            [], // 0张的牌点(wuyong)
            [], // 1张
            [], // 2张
            [], // 3张
            [], // 4张及以上
        ];
        var zhaDanList = [];
        for (var k in p_dict) {
            var count = p_dict[k];
            var point = Number(k);
            if (count > 0 && count <= 3) {
                pHash[count].push(point);
            } else if (count >= 4) {
                zhaDanList.push({count: count, point: point});
            }
        }
        zhaDanList.sort(function(a, b) {
            if (a.count == b.count) {
                return a.point - b.point;
            }

            return a.count - b.count;
        });

        var allZhaMatrix = [
            [], // 炸弹matrix
            [], // 筒子
            [], // 地炸
            [] // 喜
        ];

        for (var i = 0; i < zhaDanList.length; i++) {
            allZhaMatrix[0].push(zhaDanList[i].point); // 牌点
        }

        for (var i = 0; i < tongZiList.length; i++) {
            allZhaMatrix[1].push(tongZiList[i]); // 牌
        }

        for (var i = 0; i < diZhaList.length; i++) {
            allZhaMatrix[2].push(diZhaList[i]); // 牌点
        }

        for (var i = 0; i < xiList.length; i++) {
            allZhaMatrix[3].push(xiList[i]); // 牌
        }
        // console.log("pHash@@ ", pHash);
        // console.log("allZhaMatrix@@ ", allZhaMatrix);

        var cList = []; // 可用牌集合
        var pList = []; // 可用牌点集合
        var idx = 0;
        if (type2 >= CARD_TYPE.zhaDan) {
            idx = type2 + 1 - CARD_TYPE.zhaDan;
        }

        for (var i = idx; i < allZhaMatrix.length; i++) {
            if (i == 0 || i == 2) {
                pList = pList.concat(allZhaMatrix[i]);
            } else {
                cList = cList.concat(allZhaMatrix[i]);
            }
        }

        if (type2 < CARD_TYPE.zhaDan) { // 炸弹以下
            var list = []; // 可取牌点集合
            var value = 0; // 比较值
            var linkNum = 0; // 连对 飞机连牌数

            switch (type2) {
                case CARD_TYPE.danZhang: // 单张
                    list = pHash[1].concat(pHash[2], pHash[3]);
                    value = _.point(cards2[0]);
                    break;
                case CARD_TYPE.duiZi:    // 对子
                    list = pHash[2].concat(pHash[3]);
                    value = _.point(cards2[0]);
                    break;
                case CARD_TYPE.lianDui: // 连对
                    needNum = 2;
                    list = pHash[2].concat(pHash[3]);
                    list.sort(function(a, b) {
                        return a - b;
                    });
                    linkNum = cards2.length / 2;
                    for (var i = 0; i < cards2.length; i++) {
                        value = Math.max(_.point(cards2[i]), value);
                    }
                    break;
                case CARD_TYPE.sanZhang: // 三张
                    needNum = 3;
                    list = pHash[3];
                    value = this.analyzeSanZhang(cards2).body;
                    break;
                case CARD_TYPE.feiJi: // 飞机
                    needNum = 3;
                    list = pHash[3];
                    var body2 = this.analyzeFeiJi(createParam, null, cards2, hasWings, bodyLen).body;
                    linkNum = body2.length;
                    value = body2[body2.length - 1];
                    break;
            }

            for (var i = 0; i < list4.length; i++) {
                if (list.indexOf(list4[i]) < 0) {
                    list.push(list4[i]);
                }
            }
            
            list.sort(function(a, b) {
                return a - b;
            });

            var wingFlag = false; // 是否可以带牌（有三张 飞机）
            if (type2 == CARD_TYPE.danZhang || type2 == CARD_TYPE.duiZi || type2 == CARD_TYPE.sanZhang) {
                for (var i = 0; i < list.length; i++) {
                    if (list[i] > value) {
                        wingFlag = true;
                        pList.push(list[i]);
                    }
                }
            } else { // 连对 飞机
                var nowLinkNum = 1;
                for (var i = 1; i < list.length; i++) {
                    if (list[i] >= 15 && deckNum == 3) {
                        continue;
                    }
                    
                    nowLinkNum = list[i] - list[i - 1] == 1 ? nowLinkNum + 1 : 1;
                    if (nowLinkNum >= linkNum && list[i] > value) {
                        wingFlag = true;
                        for (var j = linkNum - 1; j >= 0; j--) {
                            pList.push(list[i] - j); // 有重复
                        }
                        nowLinkNum -= 1;
                    }
                }
            }

            if ((type2 == CARD_TYPE.sanZhang || type2 == CARD_TYPE.feiJi) && hasWings && wingFlag) {
                return [];
            }
        } else {
            switch (type2) {
                case CARD_TYPE.xi: // 喜
                    for (var i = 0; i < xiList.length; i++) {
                        if (_.point(xiList[i]) >_.point(cards2[0])) {
                            cList.push(xiList[i]);
                        }
                    }
                    break;
                case CARD_TYPE.diZha: // 地炸
                    for (var i = 0; i < diZhaList.length; i++) {
                        if (_.point(diZhaList[i]) >_.point(cards2[0])) {
                            pList.push(_.point(diZhaList[i]));
                        }
                    }
                    break;
                case CARD_TYPE.tongZi: // 筒子
                    for (var i = 0; i < tongZiList.length; i++) {
                        if (_.point(tongZiList[i]) >_.point(cards2[0])) {
                            cList.push(tongZiList[i]);
                        }

                        if (_.point(tongZiList[i]) == _.point(cards2[0]) && tongZiList[i] > cards2[0] && deckNum == 3) {
                            cList.push(tongZiList[i]);
                        }
                    }
                    break;
                case CARD_TYPE.zhaDan: // 炸弹
                    for (var i = 0; i < zhaDanList.length; i++) {
                        if (zhaDanList[i].count == cards2.length && zhaDanList[i].point > _.point(cards2[0])) {
                            pList.push(zhaDanList[i].point);
                        }

                        if (zhaDanList[i].count > cards2.length) {
                            pList.push(zhaDanList[i].point);
                        }
                    }
                    break;
            }
        }

        var disabledList = [];
        for (var i = 0; i < hand.length; i++) {
            if (cList.indexOf(hand[i]) < 0 && pList.indexOf(_.point(hand[i])) < 0) {
                disabledList.push(hand[i]);
            }
        }

        return disabledList;
    }

    // 获取特殊牌型的牌, 掂坨不用
    DianTuo.prototype.getSpclMatrix = function(hand, deckNum) {
        // 牌统计; 提取喜、地炸、筒子
        var spclMatrix = [];
        return spclMatrix;
        var p_dict = {};
        var c_dict = {};
        for (var i = 0; i < hand.length; i++) {
            var p = _.point(hand[i]);
            p_dict[p] = p_dict[p] ? p_dict[p] + 1 : 1;

            var c = hand[i];
            c_dict[c] = c_dict[c] ? c_dict[c] + 1 : 1;
        }

        var tongZiList = []; // 筒子
        var diZhaList = []; // 地炸
        var xiList = []; // 喜
        for (var k in p_dict) {
            if (p_dict[k] >= 8 && deckNum == 3) {
                if (c_dict[Number(k) + 100] >= 2 && c_dict[Number(k) + 200] >= 2 && c_dict[Number(k) + 300] >= 2 && c_dict[Number(k) + 400] >= 2) {
                    diZhaList.push(Number(k));
                    p_dict[k] -= 8;
                    for (var i = 1; i <= 4; i++) {
                        c_dict[i * 100 + Number(k)] -= 2;
                    }
                }
            }
        }
        
        for (var k in c_dict) {
            var cd = Number(k);
            if (c_dict[k] == 3 && diZhaList.indexOf(_.point(k)) < 0) { // 地炸和筒子 优先地炸
                tongZiList.push(cd);
                p_dict[_.point(cd)] -= 3;
            } else if (c_dict[k] == 4) {
                xiList.push(cd);
                p_dict[_.point(cd)] -= 4;
            }   
        }

        for (var i = 0; i < tongZiList.length; i++) {
            spclMatrix.push([tongZiList[i], tongZiList[i], tongZiList[i]]);
        }

        for (var i = 0; i < diZhaList.length; i++) {
            var tmp = [];
            for (var j = 1; j <= 4; j++) {
                tmp.push(diZhaList[i] + j * 100, diZhaList[i] + j * 100);
            }
            spclMatrix.push(tmp);
        }

        for (var i = 0; i < xiList.length; i++) {
            spclMatrix.push([xiList[i], xiList[i], xiList[i], xiList[i]]);
        }

        return spclMatrix;
    }

    // 统计混合炸组合, param = return getMixZha()
    DianTuo.prototype.calculateMixZha = function(list, createParam) {
        if (createParam.isZhaNoKing || !list || !list.joker || !list.point || !list.cards) {
            return [];
        }
        if (list.joker.length <= 0 || list.point.length <= 0 || list.cards.length <= 0) {
            return [];
        }

        var ret = [];
        for (var i = 0; i < list.point.length; i++) {
            //取相应的牌
            var cd = [];
            for (var j = 0; j < list.cards.length; j++) {
                if (_.point(list.cards[j]) == list.point[i]) {
                    cd.push(list.cards[j]);
                }
            }
            if (cd.length > 0) {
                cd = cd.concat(list.joker);
                ret.push(cd);
            }
        }

        return ret;
    }

    // 提取混合炸
    DianTuo.prototype.getMixZha = function(cards, createParam) {
        if (createParam.isZhaNoKing || !cards || cards.length < 5) {
            return [];
        }

        var jokerList = [];
        var c_dict = [];
        var p_dict = {};
        for (var i = 0; i < cards.length; i++) {
            var c = cards[i];
            if (c == BIG_JOKER || c == SMALL_JOKER) {
                jokerList.push(c);
                continue;
            }

            var p = _.point(cards[i]);
            p_dict[p] = p_dict[p] ? p_dict[p] + 1 : 1;

            c_dict.push(cards[i]);    
        }

        if (jokerList.length == 0) {
            return [];
        }

        jokerList.sort(function(a, b) {
            return a - b;
        });
        var ret = [];
        var list = {};
        list.point = [];
        list.joker = jokerList;
        list.cards = c_dict;
        for (var p in p_dict) {
            if (p_dict[p] >= 4) {
                list.point.push(p);
            }
        }

        if (list.point.length > 0) {
            ret = this.calculateMixZha(list, createParam);
        }

        return ret;
    }

    // 获取分牌
    DianTuo.prototype.getScoreCards = function(hand) {
        if (!hand || hand.length <= 0) {
            return [];
        }

        var scoreCards = [];
        for (var i = 0; i < hand.length; i++) {
            var card = hand[i];
            if (this.getCardScore(card)) {
                scoreCards.push(card);
            }
        }

        return scoreCards;
    }

    // 获取所有的5-10-k牌型列表
    DianTuo.prototype.getWuShiKCardsList = function(hand) {
        if (!hand || hand.length < 3) {
            return [];
        }

        var ret = [];
        //提取所有的5-10-k牌
        var wuShiKCards = {
            "5": [],
            "10": [],
            "13": []
        };

        var insertCard = function(p, card) {
            for (var k in wuShiKCards) {
                if (Number(p) == Number(k)) {
                    wuShiKCards[k].push(card);
                }
            }
        }

        for (var i = 0; i < hand.length; i++) {
            var c = hand[i];
            var p = _.point(c);
            if (p == 5 || p == 10 || p == 13) {
                insertCard(p, c);
            }
        }

        //凑5-10-k
        // 取五十K
        var num = Math.min(wuShiKCards[5].length, wuShiKCards[10].length, wuShiKCards[13].length);
        var findNum = 0;

        var wsk = wuShiKCards;

        function out(row) {
            var i = 0;
            for (var k in wsk) {
                wsk[k].splice(wsk[k].indexOf(row[i]), 1);
                i++;
            }
        } 

        //先找同花
        for (var i = 1; i <= 4; i++) {
            var wu = i*100 + 5;
            var shi = i*100 + 10;
            var k = i*100 + 13;
            if (wsk[5].indexOf(wu) >= 0 
                && wsk[10].indexOf(shi) >= 0 
                && wsk[13].indexOf(k) >= 0) {
                var row = [wu, shi, k];
                ret.push({cards: row, cardType: CARD_TYPE.tongHuaWuShiK});
                out(row);
                findNum++;
                i--;
            }
        }

        while(num - findNum) {
            var row = [wsk[5][0], wsk[10][0], wsk[13][0]];
            ret.push({cards: row, cardType: CARD_TYPE.zaHuaWuShiK});
            out(row);
            findNum++;
        }
        cc.log(ret);
        if(ret.length == 0) return [];

        var tempCardData = [];
        for (var i = 0; i < ret.length; i++) {
            var index = ret[i].cardType%7; 
            if(!tempCardData[index])
                tempCardData[index] = [];
            tempCardData[index].push(ret[i]);
        }  

        var fullCard = [];
        for (var i = 0; i < tempCardData.length; i++) {
            if(!tempCardData[i]) continue;
            for (var j = 0; j < tempCardData[i].length; j++) {
                var cardTable = tempCardData[i][j];
                fullCard.push(cardTable);  
            }
        }  

        return fullCard;
    }

    // 获取所有的炸弹牌型列表
    DianTuo.prototype.getZhaCardsList = function(hand, createParam) {
        if (!hand || hand.length < 4) {
            return [];
        }
        var ret = [];
        var p_dict = {};
        var jokerList = [];
        for (var i = 0; i < hand.length; i++) {
            var c = hand[i];
            if (c == BIG_JOKER || c == SMALL_JOKER) {
                jokerList.push(c);
                continue;
            }

            var p = _.point(hand[i]);
            p_dict[p] = p_dict[p] ? p_dict[p] + 1 : 1;
        }

        var getCard = function(p, cards, zhaCards) {
            for (var l = 0; l < hand.length; l++) {
                if (_.point(hand[l]) == k) {
                    zhaCards.push(hand[l]);
                }
            }
        }
        
        //取普通炸弹牌
        var comZhaList = [];
        for (var k in p_dict) {
            var zhaCards = [];
            if (p_dict[k] >= 4) {
                getCard(k, hand, zhaCards);
                comZhaList.push(zhaCards);
            }      
        }

        var mixZhaList = this.getMixZha(hand, createParam);  //统计混合炸
        var wangZha = jokerList.length == 4;

        if (wangZha) {
            ret.push({cards: jokerList, value: this.getZhaDanValue(jokerList)});
        }

        for (var i = 0; i < comZhaList.length; i++) {
            var cards = comZhaList[i];
            ret.push({cards: cards, value: this.getZhaDanValue(cards)})
        }
        
        for (var i = 0; i < mixZhaList.length; i++) {
            var cards = mixZhaList[i];
            ret.push({cards: cards, value: this.getZhaDanValue(cards)});
        }

        ret.sort(function(a, b) {
            return a.value - b.value;
        });
        
        return ret;
    }

    // 拆牌提示, 掂坨不用
    DianTuo.prototype.getBreakUpDesc = function(createParam, hand, cards, hasWings) {
        hasWings = true;

        var desc = "";
        var type = this.getCardType(cards, hasWings, null, createParam);
        if (type == CARD_TYPE.noType) {
            return desc;
        }

        // 牌统计; 提取炸弹
        var p_dict = {};
        var c_dict = {};
        for (var i = 0; i < hand.length; i++) {
            var p = _.point(hand[i]);
            p_dict[p] = p_dict[p] ? p_dict[p] + 1 : 1;

            var c = hand[i];
            c_dict[c] = c_dict[c] ? c_dict[c] + 1 : 1;
        }

        var zhaDanList = []; // 炸弹 

        var zhaDanList = [];
        for (var k in p_dict) {
            var count = p_dict[k];
            var point = Number(k);
            if (count >= 4) {
                zhaDanList.push({count: count, point: point});
            }
        }
        // console.log("zhaDanList@@ ", zhaDanList);

        var breakUpFlag = 0; // 炸弹
        switch (type) {
            case CARD_TYPE.zhaDan:
                for (var i = 0; i < zhaDanList.length; i++) {
                    if (zhaDanList[i].point == _.point(cards[0]) && zhaDanList[i].count > cards.length) {
                        breakUpFlag  = (breakUpFlag | 1);
                    }
                }
                break;
            case CARD_TYPE.danZhang:
            case CARD_TYPE.duiZi:
            case CARD_TYPE.sanZhang:
            case CARD_TYPE.shunZi:
            case CARD_TYPE.lianDui:
            case CARD_TYPE.feiJi:
            case CARD_TYPE.zaHuaWuShiK:
            case CARD_TYPE.tongHuaWuShiK:
                for (var i = 0; i < cards.length; i++) {
                    var cd = cards[i];
                    for (var j = 0; j < zhaDanList.length; j++) {
                        if (zhaDanList[j].point == _.point(cd)) {
                            breakUpFlag = (breakUpFlag | 1);
                        }
                    }
                }
                break;
        }

        if ((breakUpFlag & 8) > 0) {
            desc = "喜";
        } else if ((breakUpFlag & 4) > 0) {
            desc = "地炸";
        } else if ((breakUpFlag & 1) > 0) {
            desc = "炸弹";
        }

        return desc;
    }

    // 计算牌分
    DianTuo.prototype.getCardScore = function(card) {
        switch (_.point(card)) {
            case 5:
                return 5;
            case 10: 
                return 10;
            case 13: 
                return 10;
            default:
                return 0;
        }
    }

    // 获取炸弹喜分, 第二个参数=天炸分
    DianTuo.prototype.getZhaScore = function(createParam, cards, tianZhaScore, hasWings) {

        //炸弹不超过8张
        MAX_NUMS_ZHADAN = createParam.isSanFuPai ? 12 : MAX_NUMS_ZHADAN;
        if (cards.length > MAX_NUMS_ZHADAN) {
            return 0;
        }

        var type = this.getCardType(cards, hasWings, null, createParam);
        if (type != CARD_TYPE.zhaDan) {
            return 0;
        }

        if (this.isWangZha(cards)) {
            return tianZhaScore;  //天炸分按创建规则算
        }

        var zhaCards = cards.slice();
        if (this.isMixZha(zhaCards, createParam)) {
            // 又改规则带王炸剔除王再算炸弹分
            var jokerList = [];
            for (var i = 0; i < zhaCards.length; i++) {
                var c = zhaCards[i]; 
                if (c == SMALL_JOKER || c == BIG_JOKER) {
                    jokerList.push(c);
                }
            }
            //剔除提出的王
            for (var i = 0; i < jokerList.length; i++) {
                var joker = jokerList[i];
                var key = zhaCards.indexOf(joker);
                if (key >= 0) {
                    zhaCards.splice(key, 1);
                }
            }
            
            //return 0;       //混合炸不算炸弹分
        }

        var idx = [6, 7, 8].indexOf(zhaCards.length);
        if (idx >= 0) {
            return idx+1;   //6炸1分, 7炸2分, 8炸3分
        }

        //混合炸和普通4，5炸不算分
        return 0;
    }

    // 获取炸弹红黑分
    DianTuo.prototype.getRedBlackScore = function(createParam, cards, hasWings) {

        //炸弹不超过8张
        MAX_NUMS_ZHADAN = createParam.isSanFuPai ? 12 : MAX_NUMS_ZHADAN;
        if (cards.length > MAX_NUMS_ZHADAN) {
            return 0;
        }

        var type = this.getCardType(cards, hasWings, null, createParam);
        if (type != CARD_TYPE.zhaDan) {
            return 0;
        }

        //天炸，8炸(非混合炸) 固定2分
        if (this.isWangZha(cards) || (cards.length == 8 && !this.isMixZha(cards, createParam))) {
            return 2;
        }

        //统计花色
        var color = {
            red: 0,
            black: 0
        };
        for (var i = 0; i < cards.length; i++) {
            var c = _.suit(cards[i]);
            if (c == SUIT_TYPE.joker) {
                continue;
            }
            if (c == SUIT_TYPE.diamonds || c == SUIT_TYPE.hearts) {
                color.red += 1;
            } else {
                color.black += 1;
            } 
        }

        var score = 0;
        score += (color.red >= 4) ? 1 : 0;
        score += (color.black >= 4) ? 1 : 0;

        return score;
    }

    // 获取特殊牌型, 掂坨不用
    DianTuo.prototype.getSpclType = function(createParam, cards, hasWings) {
        hasWings = true;
        return SPCL_TYPE.noType;
        
        switch (this.getCardType(cards, hasWings, null, createParam)) {
            case CARD_TYPE.tongZi:
                if (deckNum == 3 && _.point(cards[0]) >= 13 && _.point(cards[0]) <= 15) {
                    return _.point(cards[0]) - 12;
                } else if (deckNum == 3 && (cards[0] == SMALL_JOKER || cards[0] == BIG_JOKER)) {
                    return SPCL_TYPE.tongZiJoker;
                }
                break;
            case CARD_TYPE.diZha:
                return SPCL_TYPE.diZha;
            case CARD_TYPE.xi:
                if (cards[0] == SMALL_JOKER) {
                    return SPCL_TYPE.xiSmallJoker;
                } else if (cards[0] == BIG_JOKER) {
                    return SPCL_TYPE.xiBigJoker;
                } else {
                    return SPCL_TYPE.xiOther;
                }
            default:
                break;
        }

        return SPCL_TYPE.noType;
    };

    // 获取特殊牌型加分
    DianTuo.prototype.getSpclTypeScore = function(spclType) {
        return spclType2Score[spclType];
    }

    // 统计剩余牌(记牌器)
    DianTuo.prototype.statsLeftCards = function(sData, mjhand) {
        var tzcards = [
            105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, // 方块5-K A 2
            205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, // 梅花
            305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, // 红桃
            405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415  // 黑桃
        ];

        var areaSelectMode = sData.tData.areaSelectMode;
        if (areaSelectMode.deckNum == 4 || areaSelectMode.haveKingTz) { // 4副牌带王
            tzcards.push(SMALL_JOKER, BIG_JOKER);
        }

        var c_dict = {};
        for (var i = 0; i < tzcards.length; i++) {
            c_dict[tzcards[i]] = areaSelectMode.deckNum;
        }

        for (var i = 0; i < mjhand.length; i++) {
            c_dict[mjhand[i]]--;
        }

        for (var uid in sData.players) {
            var pl = sData.players[uid];
            for (var i = 0; i < pl.mjput.length; i++) {
                for (var j = 0; j < pl.mjput[i].length; j++) {
                    c_dict[pl.mjput[i][j]]--;
                }
            }
        }

        var stats = [];
        for (var k in c_dict) {
            if (c_dict[k] > 0) {
                stats.push({card: Number(k), num: c_dict[k]});
            }
        }

        stats.sort(function(a, b) {
            if (_.point(a.card) == _.point(b.card)) {
                return b.card - a.card;
            };

            return _.point(b.card) - _.point(a.card);
        })

        return stats;
    }

    // 飞机牌拆分（主体 翅膀）
    DianTuo.prototype.splitFeiJi = function(createParam, handCount, cards, hasWings, bodyLen) {
        hasWings = true;
        
        handCount = handCount ? handCount : cards.length;
        var dict = {};
        for (var i = 0; i < cards.length; i++) {
            var p = _.point(cards[i]);
            dict[p] = dict[p] ? dict[p] + 1 : 1;
        }

        var body = []; // 主体 
        var wing = []; // 翅膀
        var queue = [];
        for (var p in dict) {
            if (dict[p] >= 3 && Number(p) < 15/*_.point(SMALL_JOKER)*/) { //飞机最多到A
                queue.push(Number(p));
            }   
        }

        for (var i = 0; i < queue.length; i++) {
            queue[i] = _.point(queue[i]);
        }

        queue.sort(function(a, b) {
            return a - b;
        });

        var linkNum = 1;
        var maxLinkNum = 1;
        var maxLinkIdx = -1;
        var feiJiList = [];
        for (var i = 1; i < queue.length; i++) {
            linkNum = (queue[i] - queue[i - 1] == 1 || 
                (queue[i] == 8 && queue[i - 1] == 5 && createParam.isSanFuPai)) ? linkNum + 1 : 1;
            if (linkNum > maxLinkNum) {
                maxLinkNum = linkNum;
                maxLinkIdx = i;
            }
        }

        var calculateFeiJiCards = function(maxLinkNum) {
            var feiJi = {
                "body": [],
                "wing": []
            };
            var list = queue.slice().splice(maxLinkIdx + 1 - maxLinkNum, maxLinkNum);
            var copy = cards.slice();
            for (var i = 0; i < list.length; i++) {
                var num = 0;
                var loop = 0;
                while (loop < 4 && num < 3) {
                    for (var j = 1; j <= 4; j++) {
                        var p = list[i];
                        var idx = copy.indexOf(j * 100 + p);
                        if (idx >= 0) {
                            feiJi.body.push(j * 100 + p);
                            copy.splice(idx, 1);
                            num++;
                            if (num >= 3) {
                                break;
                            }
                        }
                    }
                    loop++;  //最高找4轮
                }
            }
            feiJi.wing = copy;

            //飞机数量
            var bodyNum = feiJi.body.length / 3;
            var wingNum = feiJi.wing.length;
            //剔除非法分割
            if (createParam.isZuiHouShaoDai) {
                if(handCount == cards.length) {
                    if(wingNum <= bodyNum * 2) {
                        feiJiList.push(feiJi);
                    }
                }else {
                    if(wingNum == bodyNum * 2) {
                        feiJiList.push(feiJi);
                    }
                }
            }else {
                var groups = wingNum / bodyNum;
                //剔除非法分割, 翅膀张数必须是body的0，1，2倍数
                if (groups == 0 || groups == 1 || groups == 2) {
                    feiJiList.push(feiJi);
                }
            }
        }

        if (maxLinkNum >= (bodyLen || 2)) {
            if (bodyLen || maxLinkNum == 2) {
                //在指定长度或者最大长度为2时直接判定带牌数
                maxLinkNum = bodyLen ? bodyLen : maxLinkNum;
                if (cards.length <= maxLinkNum * 5) {
                    calculateFeiJiCards(maxLinkNum);
                }
            }
            else {
                //没指定body长度时要考虑拆飞机组带牌(飞机长度变化)的情况
                for (var i = 2; i <= maxLinkNum; i++) {
                    if (cards.length <= i * 5) {
                        calculateFeiJiCards(i);
                    }
                }
            }
            
        }
        
        if (feiJiList.length > 0) {
            //默认取最长的飞机
            feiJiList.sort(function(a, b) {
                return b.body.length - a.body.length;
            });
            
            return feiJiList[0];
        }
        
        return {body: [], wing: []};
    }

    // 三张拆分(主体 带的牌)
    DianTuo.prototype.splitSanZhang = function(cards) {
        var dict = {};
        for (var i = 0; i < cards.length; i++) {
            var p = _.point(cards[i]);
            dict[p] = dict[p] ? dict[p] + 1 : 1;
        }

        var body = -1; // 主体 
        var wing = []; // 翅膀
        for (var p in dict) {
            if (dict[p] >= 3) {
                body = Number(p);

                cards = cards.slice();
                this.formatSort(cards);
                for (var i = 0; i < cards.length; i++) {
                    if (_.point(cards[i]) == body) {
                        body = cards.splice(i, 3);
                        wing = cards;
                        break;
                    }
                }

                break;
            }   
        }

        return {body: body, wing: wing};
    }

    DianTuo.prototype.formatPutCard = function(createParam, cards, type, hasWings, bodyLen) {
        type = type || this.getCardType(cards, hasWings, null, createParam); // type是0会重算一遍
        var list = [];
        switch (type) {
            case CARD_TYPE.danZhang:
            case CARD_TYPE.duiZi:
            case CARD_TYPE.zhaDan:
                list = cards.slice();
                break;
            case CARD_TYPE.shunZi:
                var queue = this.analyzeShunZi(cards, createParam);
                for (var i = 0; i < queue.length; i++) {
                    if (queue[i] == 1 || queue[i] == 2) {
                        queue[i] += 13;
                    }
                }

                list = cards.slice();
                list.sort(function(a, b) {
                    return queue.indexOf(_.point(a)) - queue.indexOf(_.point(b));
                });
                break;
            case CARD_TYPE.lianDui:
                var queue = this.analyzeLianDui(cards, createParam);
                for (var i = 0; i < queue.length; i++) {
                    if (queue[i] == 1 || queue[i] == 2) {
                        queue[i] += 13;
                    }
                }

                list = cards.slice();
                list.sort(function(a, b) {
                    return queue.indexOf(_.point(a)) - queue.indexOf(_.point(b));
                });
                break;
            case CARD_TYPE.zaHuaWuShiK:
            case CARD_TYPE.tongHuaWuShiK:
                list = cards.slice();
                list.sort(function(a, b) {
                    return _.point(a) - _.point(b);
                });
                break;
            default:
                list = cards.slice();
                break;
        }

        return list;
    }

    DianTuo.prototype.checkPut = function(hand, cards) {
        if (cards && typeof(cards) != 'undefined' && cards.length == 0) {
            return null;
        }

        var hands = hand.slice();
        for (var i = 0; i < cards.length; i++) {
            var p = hands.indexOf(cards[i]);
            if (p >= 0) {
                hands.splice(p, 1);
            } else {
                return null; // 手里没有这些牌
            }
        }
        return hands;
    }

    if (typeof(MjClient) != "undefined") {
        MjClient.majiang_diantuo = new DianTuo();
    } else {
        module.exports = DianTuo;
    }


    /**
     * trace
     * @param [int] [count=10]
     */
    function trace (count) {
        var caller = arguments.callee.caller;
        var i = 0;
        count = count || 10;
        cc.log("***----------------------------------------  ** " + (i + 1));
        while (caller && i < count) {
            cc.log(caller.toString());
            caller = caller.caller;
            i++;
            cc.log("***---------------------------------------- ** " + (i + 1));
        }
    }

    function test() {
        var a = new DianTuo();
        // var cards1 = [215, 215, 215, 315, 315, 315, 415, 415, 115, 115, 115];
        var cards1 = [112,411,311,310,110,309,208,407,307,207,206,405,205,105,404,404,304,403,303,415,315,214,114,413,213,113,412];
        var cards2 = [415, 415, 516, 516];
        var cards1 = [408,206,104,304,115,408,312,213,111,404,214,204,516,213,306,308,104,107,108,207,406,406];
        // console.log(a.hintPutCard(cards1, null, null, 1, true, null));



        var cards2 = [115, 115, 114, 114];
        var cards1 = [214, 215, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 516, 214, 215, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113];
        var cards1 = [415,115,115,414,314,114,403,303,203,107];
        // console.log(a.splitFeiJi(cards1, true, 2));
        
        var cards1 = [104, 204, 204, 304, 105, 205, 305, 405, 516, 517];
        //console.log(a.getMixZha(cards1));
        //console.log(a.isMixZha(cards1));
        //console.log(a.getZhaCardsList(cards1));
        //console.log(a.getWuShiKCardsList(cards1));
        //console.log(a.getJokerCards());

        var cards1 = [105, 113, 110, 205, 110, 305, 413, 413, 310];
        //console.log(a.getWuShiKCardsList(cards1));
        //console.log(a.isWuShiK(cards1));

        var cards1 = [103,103,203,104,104,204,106,106,206];
        var cards2 = [203,303,403,315,415,107,207,404,404,414,212];
        console.log(a.hintPutCard(cards1));

        var cards1 = [104, 304, 304, 404];
        var cards2 = [114, 214, 314, 414, 516];
        //console.log("比大小", a.isBigger(50, cards2, cards1));

        // console.log(a.getCardType(cards2, 1, true));
        // console.log(a.splitFeiJi(cards1));
        // console.log(a.isBigger(cards2, cards1, null, true, null));
        // console.log(a.canBeat(cards2, cards1, null, 0, true, null));
        // console.log(a.isFeiJi(cards1));
        // console.log(a.getDisabledList(cards2, cards1, null, 4, true, 2));
        // console.log(a.hintPutCard(cards1, null, null, 1, true, null));
        // console.log(a.analyzeFeiJi(cards1, true, 3));
        // console.log(a.getBreakUpDesc(cards1, cards2, true));
        // console.log(a.isBigger(cards2, cards1, null, 3, true, 2));
        // console.log(a.sort2(cards1, 3));
        // var cards1 = [112, 113, 213, 413, 113];
        // console.log(a.splitSanZhang(cards1, 3));
        // var cards = [113, 110, 105];
        // console.log(a.fortmatPutCard(cards, null, true, null));
    }
    // test();
}());
