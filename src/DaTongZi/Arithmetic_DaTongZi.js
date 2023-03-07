// 邵阳打筒子算法
(function() {
    // var SMALL_JOKER = 520; // 小王
    // var BIG_JOKER =  530; // 大王
    var SMALL_JOKER = 516; // 小王
    var BIG_JOKER =  517; // 大王

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
        lianDui: 2,     // 连对
        sanZhang: 3,    // 三张
        feiJi: 4,       // 飞机
        zhaDan: 5,      // 炸弹
        tongZi: 6,      // 筒子
        diZha: 7,       // 地炸
        xi: 8           // 喜
    };

    // 特殊加分牌型
    var SPCL_TYPE = {
        noType: 0,      // 非特殊牌型
        tongZiK: 1,     // K筒子
        tongZiA: 2,     // A筒子
        tongZi2: 3,     // 2筒子
        tongZiJoker: 4, // 王筒子
        diZha: 5,       // 地炸
        xiSmallJoker: 6,// 小王喜
        xiBigJoker: 7,  // 大王喜
        xiOther: 8,     // 除大小王外 喜
        xiSmall: 9,     // 5-Q喜
        xiK: 10,        // K喜 
        xiA: 11,        // A喜
        xi2: 12,        // 2喜
    };

    var spclType2Score = [0, 100, 200, 300, 400, 400, 200, 200, 100, 400, 500, 600, 700];

    function DaTongZi() {
        this.CARD_TYPE = CARD_TYPE;
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

    var _ = new utils();

    DaTongZi.prototype.canLink15 = function(options) {
        return options.deckNum == 4 && !options.isSiXi;
    }

    // 洗牌
    DaTongZi.prototype.randomCards = function(areaSelectMode, tData) {
        var deckNum = areaSelectMode.deckNum || 3;
        var tzcards = [
            105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, // 方块5-K A 2
            205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, // 梅花
            305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, // 红桃
            405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415  // 黑桃
        ];
        if (!areaSelectMode.isSiXi && deckNum == 4 || areaSelectMode.haveKingTz) { // 4副牌带王
            tzcards.push(SMALL_JOKER, BIG_JOKER);
        }

        var cards = [];
        for (var i = 0; i < deckNum; i++) {
            cards = cards.concat(tzcards);
        }

        shuffleArray(cards);

        var maxNum = 0; // 最大
        var totalNum = 0; // 总共
        for (var i = 0; i < tData.maxPlayer; i++) { // 洗牌特殊处理(多个特殊牌)
            var c_dict = {};
            var p_dict = {};
            
            for (var j = i * tData.handCount; j < (i + 1) * tData.handCount; j++) {
                var cd = cards[j];
                c_dict[cd] = c_dict[cd] ? c_dict[cd] + 1 : 1;

                var point = _.point(cd);
                p_dict[point] = p_dict[point] ? p_dict[point] + 1 : 1;
            }

            var spclTypeNum = 0;  // 特殊牌数量
            var diZhaList = [];
            if (deckNum == 3) {
                for (var k in p_dict) {
                    if (p_dict[k] >= 8 && p_dict[k] < 16) {
                        if (c_dict[Number(k) + 100] >= 2 && c_dict[Number(k) + 200] >= 2 && c_dict[Number(k) + 300] >= 2 && c_dict[Number(k) + 400] >= 2) {
                            diZhaList.push(Number(k));
                            spclTypeNum++;
                        }
                    }
                }
            }
            
            for (var k in c_dict) {
                if (deckNum == 3 && c_dict[k] == 3 && _.point(Number(k)) >= 13) {
                    if (diZhaList.indexOf(_.point(Number(k))) < 0) {
                        spclTypeNum++;
                    }
                }

                if (deckNum == 4 && c_dict[k] == 4) {
                    spclTypeNum++;
                }
            }

            maxNum = Math.max(maxNum, spclTypeNum);
            totalNum += spclTypeNum;

            // if (tongZiNum == 2 && Math.random() < 0.2) {
            //     shuffleArray(cards);
            //     break;
            // } else if (tongZiNum >= 3 && Math.random() < 0.3) {
            //     shuffleArray(cards);
            //     break;
            // }
        }

        if (totalNum >= 6) {
            // console.log("重新洗牌1@@");
            return this.randomCards(areaSelectMode, tData);
        }

        if (maxNum >= 3) {
            // console.log("重新洗牌2@@");
            shuffleArray(cards);
        }

        return cards;
    };

    // 排序 (特殊牌型组合 放同牌点最后)
    DaTongZi.prototype.sort2 = function(hand, deckNum) {
        hand = hand.slice();
        // 牌统计
        var p_dict = {};
        var c_dict = {};
        for (var i = 0; i < hand.length; i++) {
            var p = _.point(hand[i]);
            p_dict[p] = p_dict[p] ? p_dict[p] + 1 : 1;

            var c = hand[i];
            c_dict[c] = c_dict[c] ? c_dict[c] + 1 : 1;
        }

        // 记录喜、地炸、筒子
        var tongZiList = []; // 筒子
        var diZhaList = []; // 地炸
        var xiList = []; // 喜
        for (var k in p_dict) {
            if (p_dict[k] >= 8 && deckNum == 3) {
                if (c_dict[Number(k) + 100] >= 2 && c_dict[Number(k) + 200] >= 2 && c_dict[Number(k) + 300] >= 2 && c_dict[Number(k) + 400] >= 2) {
                    var n = Number(k);
                    diZhaList.push(n + 100, n + 100, n + 200, n + 200, n + 300, n + 300, n + 400, n + 400);
                }
            }
        }
        
        for (var k in c_dict) {
            var cd = Number(k);
            if (c_dict[k] == 3 && diZhaList.indexOf(cd) < 0) { // 地炸和筒子 优先地炸
                tongZiList.push(cd);
            } else if (c_dict[k] == 4) {
                xiList.push(cd);
            }   
        }

        for (var i = 0; i < hand.length; i++) {
            var cd = hand[i];
            if (xiList.indexOf(cd) >= 0) {
                hand[i] += 2000;
            } else if (tongZiList.indexOf(cd) >= 0) {
                hand[i] += 1000;
            } else if (diZhaList.indexOf(cd) >= 0) {
                hand[i] += 1000;
                diZhaList.splice(diZhaList.indexOf(cd), 1);
            }
        }
        this.formatSort(hand);

        for (var i = 0; i < hand.length; i++) {
            if (hand[i] >= 2000) {
                hand[i] -= 2000;
            } else if (hand[i] >= 1000) {
                hand[i] -= 1000;
            }
        }

        return hand;
    }

    // 排序
    DaTongZi.prototype.formatSort = function(cards) {
        cards.sort(function(a, b) {
            if (_.point(a) == _.point(b)) {
                return a - b;
            }

            return _.point(a) - _.point(b);
        });
    }

    // 是否单张
    DaTongZi.prototype.isDanZhang = function(cards) {
        return cards.length == 1;
    }
    
    // 是否对子
    DaTongZi.prototype.isDuiZi = function(cards) {
        if (cards.length != 2) {
            return false;
        }

        return _.point(cards[0]) == _.point(cards[1]);
    }

    // 是否连对
    DaTongZi.prototype.isLianDui = function(cards, options, deckNum) {
        if (cards.length  < 4 || cards.length % 2 != 0) {
            return false;
        }

        cards = cards.slice();
        this.formatSort(cards);
        for (var i = 0; i < cards.length; i+=2) {
            if (_.point(cards[i]) != _.point(cards[i + 1])) {
                return false;
            }

            if (!this.canLink15(options) && _.point(cards[i]) >= 15) { // 不能连2
                return false;
            }

            if (i != 0 && _.point(cards[i]) - _.point(cards[i - 2]) != 1) {
                return false;
            }
        }

        return true;
    }

    // 分析三张主体 翅膀
    DaTongZi.prototype.analyzeSanZhang = function(cards) {
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
    DaTongZi.prototype.isSanZhang = function(cards, deckNum, hasWings) {
        if (hasWings == undefined) { // 线上回放兼容处理
            hasWings = deckNum == 3;
        }

        if (cards.length < 3 || cards.length > 5) {
            return false;
        }

        if (!hasWings && cards.length != 3) { // 4副牌三张不能带
            return false;
        }

        if (this.isTongZi(cards) || this.isZhaDan(cards, deckNum) || this.isXi(cards)) {
            return false;
        }

        var struct = this.analyzeSanZhang(cards);
        // console.log("struct@@ " + JSON.stringify(struct));
        if (struct.body == -1) {
            return false;
        }

        return true;
    }

    // 分析飞机主体 翅膀
    DaTongZi.prototype.analyzeFeiJi = function(cards, options, deckNum, hasWings, bodyLen) {
        if (hasWings == undefined) { // 线上回放兼容处理
            hasWings = deckNum == 3;
        }

        var dict = {};
        for (var i = 0; i < cards.length; i++) {
            var p = _.point(cards[i]);
            dict[p] = dict[p] ? dict[p] + 1 : 1;
        }

        var body = []; // 主体 
        var wing = []; // 翅膀
        var threeList = [];
        // console.log("dict@@ " + JSON.stringify(dict));
        for (var p in dict) {
            if (dict[p] >= 3 && (Number(p) < 15 || this.canLink15(options))) {
                threeList.push(Number(p));
            }   
        }
        // console.log(threeList);

        var linkNum = 1;
        var maxLinkNum = 1;
        var maxLinkIdx = -1;
        for (var i = 1; i < threeList.length; i++) {
            linkNum = (threeList[i] - threeList[i - 1] == 1) ? linkNum + 1 : 1;
            if (linkNum > maxLinkNum) {
                maxLinkNum = linkNum;
                maxLinkIdx = i;
            }
        }

        if (maxLinkNum >= (bodyLen || 2)) {
            maxLinkNum = bodyLen || maxLinkNum;
            body = threeList.splice(maxLinkIdx + 1 - maxLinkNum, maxLinkNum);

            var idx = 0;
            cards = cards.slice();
            this.formatSort(cards);
            // console.log("cards@@ " + cards);
            for (var j = 0; j < cards.length; j++) {
                if (_.point(cards[j]) == body[idx]) {
                    cards.splice(j, 3);
                    j--;
                    idx++;
                    if (idx > body.length - 1) {
                        break;
                    }
                }
            }
            wing = cards;
        }

        // 是飞机 但是拆分 按指定连牌数非法
        if (!hasWings && wing.length > 0) {
            body = [];
        } else if (hasWings && wing.length > body.length * 2) {
            body = [];
        }

        return {body: body, wing: wing};
    }

    // 是否飞机
    DaTongZi.prototype.isFeiJi = function(cards, options, deckNum, hasWings) {
        if (hasWings == undefined) { // 线上回放兼容处理
            hasWings = deckNum == 3;
        }

        if (cards.length < 6) {
            return false;
        }

        var struct = this.analyzeFeiJi(cards, options, deckNum, hasWings);
        if (struct.body.length < 2) {
            return false;
        }

        if (!hasWings && struct.wing.length > 0) {
            return false;
        }

        if (struct.wing.length > struct.body.length * 2) {
            return false;
        }

        return true;
    }

    // 是否炸弹
    DaTongZi.prototype.isZhaDan = function(cards, deckNum) {
        // todo 10个牌以上不算炸弹！！
        // if (cards.length < 4 || cards.length > 10) {
        if (cards.length < 4) {
            return false;
        }

        if (this.isXi(cards) || this.isDiZha(cards, deckNum)) {
            return false;
        }

        for (var i = 1; i < cards.length; i++) {
            if (_.point(cards[i]) != _.point(cards[i - 1])) {
                return false;
            }
        }

        return true;
    }

    // 是否筒子
    DaTongZi.prototype.isTongZi = function(cards) {
        if (cards.length != 3) {
            return false;
        }

        if (cards[0] != cards[1] || cards[0] != cards[2]) {
            return false;
        }

        return true;
    }

    // 是否地炸
    DaTongZi.prototype.isDiZha = function(cards, deckNum) {
        if (deckNum == 4) {
            return false;
        }

        if (cards.length != 8) {
            return false;
        }

        cards.slice();
        this.formatSort(cards);

        for (var i = 1; i < cards.length; i++) {
            if (i % 2 == 0 && cards[i] - cards[i - 1] != 100) {
                return false;
            }

            if (i % 2 == 1 && cards[i] - cards[i - 1] != 0) {
                return false;
            }  
        }

        return true;
    }

    // 是否喜
    DaTongZi.prototype.isXi = function(cards) {
        if (cards.length != 4) {
            return false;
        }

        if (cards[0] != cards[1] || cards[0] != cards[2] || cards[0] != cards[3]) {
            return false;
        }

        return true;
    }

    // 获取牌型
    DaTongZi.prototype.getCardType = function(cards, options, deckNum, hasWings) {
        if (hasWings == undefined) { // 线上回放兼容处理
            hasWings = deckNum == 3;
        }

        if (this.isDanZhang(cards)) {
            return CARD_TYPE.danZhang;
        }

        if (this.isDuiZi(cards)) {
            return CARD_TYPE.duiZi;
        }

        if (this.isLianDui(cards, options, deckNum)) {
            return CARD_TYPE.lianDui;
        }

        if (this.isTongZi(cards, deckNum)) {
            return CARD_TYPE.tongZi;
        }

        if (this.isXi(cards)) {
            return CARD_TYPE.xi;
        }

        if (this.isDiZha(cards, deckNum)) {
            return CARD_TYPE.diZha;
        }

        if (this.isZhaDan(cards, deckNum)) {
            return CARD_TYPE.zhaDan;
        }

        if (this.isSanZhang(cards, deckNum, hasWings)) {
            return CARD_TYPE.sanZhang;
        }

        if (this.isFeiJi(cards, options, deckNum, hasWings)) {
            return CARD_TYPE.feiJi;
        }

        return CARD_TYPE.noType;
    }

    // 牌1是否比牌2大
    DaTongZi.prototype.isBigger = function(cards1, cards2, type2, options, deckNum, hasWings, bodyLen) {
        if (hasWings == undefined) { // 线上回放兼容处理
            hasWings = deckNum == 3;
        }

        var type1 = this.getCardType(cards1, options, deckNum, hasWings);
        type2 = type2 || this.getCardType(cards2, options, deckNum, hasWings);
        if (type1 == CARD_TYPE.noType || type2 == CARD_TYPE.noType) {
            return false;
        }

        if (type1 < type2) {
            return false;
        }

        if (type1 > type2) {
            return type1 >= CARD_TYPE.zhaDan;
        }

        // 飞机指定bodyLen处理
        // if (type1 == CARD_TYPE.feiJi && deckNum == 3 && bodyLen) {
        //     if (cards1.length > bodyLen * 5) {
        //         return false;
        //     }
        // }

        // if (type1 == CARD_TYPE.feiJi && bodyLen) {
        //     if (deckNum == 3 && cards1.length > bodyLen * 5) {
        //         return false;
        //     }

        //     if (deckNum == 4 && cards1.length != cards2.length) {
        //         return false;
        //     }
        // }

        // 同种牌型
        switch (type1) {
            case CARD_TYPE.danZhang: // 单张
            case CARD_TYPE.duiZi:    // 对子
            case CARD_TYPE.diZha:    // 地炸
                return  _.point(cards1[0]) > _.point(cards2[0]);
            case CARD_TYPE.xi:       // 喜
                if (_.point(cards1[0]) != _.point(cards2[0])) {
                    return _.point(cards1[0]) > _.point(cards2[0]);
                }

                if (options.isSiXi) {
                    return cards1[0] > cards2[0];
                }

                return false;
            case CARD_TYPE.lianDui: // 连对
                if (cards1.length != cards2.length) {
                    return false;
                }

                cards1 = cards1.slice();
                this.formatSort(cards1);
                cards2 = cards2.slice();
                this.formatSort(cards2);
                return _.point(cards1[0]) > _.point(cards2[0]);
            case CARD_TYPE.sanZhang: // 三张
                return this.analyzeSanZhang(cards1).body > this.analyzeSanZhang(cards2).body;
            case CARD_TYPE.feiJi: // 飞机
                var body1 = this.analyzeFeiJi(cards1, options, deckNum, hasWings, bodyLen).body;
                var body2 = this.analyzeFeiJi(cards2, options, deckNum, hasWings, bodyLen).body;
                // todo 主体比牌2 多的时候特殊判断！！
                if (body1.length != body2.length) {
                    return false;
                }

                return body1[0] > body2[0];
            case CARD_TYPE.zhaDan: // 炸弹
                if (cards1.length != cards2.length) {
                    return cards1.length > cards2.length;
                }

                return _.point(cards1[0]) > _.point(cards2[0]);
            case CARD_TYPE.tongZi: // 筒子
                var point1 = _.point(cards1[0]);
                var point2 = _.point(cards2[0]);
                if (point1 != point2) {
                    return point1 > point2;
                }

                if (deckNum == 3 || options.isSiXi) {
                    return cards1[0] > cards2[0];
                }

                return false;
        }
    }

    // 是否要的起
    DaTongZi.prototype.canBeat = function(hand, cards2, type2, options, deckNum, hasWings, bodyLen) {
        if (hasWings == undefined) { // 线上回放兼容处理
            hasWings = deckNum == 3;
        }

        type2 = type2 || this.getCardType(cards2, options, deckNum, hasWings);
        if (type2 == CARD_TYPE.noType) {
            return false;
        }

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

            if (p_dict[k] >= 8 && deckNum == 3) {
                if (c_dict[Number(k) + 100] >= 2 && c_dict[Number(k) + 200] >= 2 && c_dict[Number(k) + 300] >= 2 && c_dict[Number(k) + 400] >= 2) {
                    diZhaList.push(Number(k));
                }
            }
        }
        // console.log("pHash@@ ", pHash);
        
        zhaDanList = pHash[4];
        for (var k in c_dict) {
            if (c_dict[k] == 3) {
                tongZiList.push(Number(k));
            } else if (c_dict[k] == 4) {
                xiList.push(Number(k));
            }   
        }
        // console.log("zhaDanList@@ " + zhaDanList);
        // console.log("tongZiList@@ " + tongZiList);
        // console.log("diZhaList@@ " + diZhaList);
        // console.log("xiList@@ " + xiList);
        // console.log("type2@@ " + type2);
        if (type2 < CARD_TYPE.zhaDan) { // 炸弹以下牌型
            if (zhaDanList.length > 0 || tongZiList.length > 0) {
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
                case CARD_TYPE.lianDui: // 连对
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
                    list = pHash[3];
                    value = this.analyzeSanZhang(cards2).body;
                    break;
                case CARD_TYPE.feiJi: // 飞机
                    list = pHash[3];
                    var body2 = this.analyzeFeiJi(cards2, options, deckNum, hasWings, bodyLen).body;
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
                        return true;
                    }
                }
            } else { // 连对 飞机
                var nowLinkNum = 1;
                for (var i = list.length - 1; i > 0; i--) {
                    if (list[i] >= 15 && !this.canLink15(options)) {
                        continue;
                    }

                    if (list[i] <= value + 1 - nowLinkNum) {
                        return false;
                    }

                    nowLinkNum = list[i] - list[i - 1] == 1 ? nowLinkNum + 1 : 1;
                    if (nowLinkNum >= linkNum) {
                        return true;
                    }
                }
            }

            return false;
        }

        // 炸弹及以上牌型
        var typeHash = [tongZiList, diZhaList, xiList];
        for (var i = type2 - CARD_TYPE.zhaDan; i < typeHash.length; i++) {
            if (typeHash[i].length > 0) { // 有更大的牌型
                return true;
            }
        }

        switch (type2) {
            case CARD_TYPE.xi: // 喜
                for (var i = 0; i < xiList.length; i++) {
                    if (_.point(xiList[i]) > _.point(cards2[0])) {
                        return true;
                    }

                    if (_.point(xiList[i]) == _.point(cards2[0]) && xiList[i] > cards2[0] && options.isSiXi ) {
                        return true;
                    }
                }
                break;
            case CARD_TYPE.diZha: // 地炸
                for (var i = 0; i < diZhaList.length; i++) {
                    if (_.point(diZhaList[i]) >_.point(cards2[0])) {
                        return true;
                    }
                }
                break;
            case CARD_TYPE.tongZi: // 筒子
                for (var i = 0; i < tongZiList.length; i++) {
                    if (_.point(tongZiList[i]) >_.point(cards2[0])) {
                        return true;
                    }

                    if (_.point(tongZiList[i]) == _.point(cards2[0]) && tongZiList[i] > cards2[0] && (deckNum == 3 || options.isSiXi)) {
                        return true;
                    }
                }
                break;
            case CARD_TYPE.zhaDan: // 炸弹
                for (var i = zhaDanList.length - 1; i >= 0; i--) {
                    var cd = zhaDanList[i];
                    if (p_dict[cd] > cards2.length) {
                        return true;
                    }

                    if (p_dict[cd] == cards2.length && cd > _.point(cards2[0])) {
                        return true;
                    }
                }
                break;
        }

        return false;
    }

    // 提示出牌
    DaTongZi.prototype.hintPutCard = function(hand, cards2, type2, options, deckNum, hasWings, bodyLen) {
        if (hasWings == undefined) { // 线上回放兼容处理
            hasWings = deckNum == 3;
        }

        var hintMatrix = [];
        if (cards2) {
            type2 = type2 || this.getCardType(cards2, options, deckNum, hasWings);
            if (type2 == CARD_TYPE.noType) {
                return hintMatrix;
            }
        }

        var breakMatrix = []; // 需拆组合的牌（连对,三张,飞机）

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
                c_dict[cd] -= 3;
            } else if (c_dict[k] == 4) {
                xiList.push(cd);
                p_dict[_.point(cd)] -= 4;
                c_dict[cd] -= 4;
            }   
        }
        this.formatSort(tongZiList);

        // 获取一定张数的特定牌点的牌
        function getCardsByNum(point, needNum) {
            // console.log("getCardsByNum point@@", point, " needNum@@ ", needNum);
            // console.log("c_dict @@", JSON.stringify(c_dict));
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

            // console.log('rtn@@ ', rtn);
            return rtn;
        }

        // 牌点按张数 分类
        var pHash = [
            [], // 0张的牌点(wuyong)
            [], // 1张
            [], // 2张
            [], // 3张
        ];
        var zhaDanList = [];
        for (var k in p_dict) {
            var count = p_dict[k];
            var point = Number(k);
            if (count > 0 && count <= 3) {
                pHash[count].push(point);
            } else if (count >= 4) {
                var cards = getCardsByNum(point, count); // 组成炸弹的牌
                zhaDanList.push({count: count, point: point, cards: cards});
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
            allZhaMatrix[0].push(zhaDanList[i].cards);
        }

        for (var i = 0; i < tongZiList.length; i++) {
            if (i >= 1 && _.point(tongZiList[i]) == _.point(tongZiList[i - 1]) && deckNum == 4 && !options.isSiXi) { 
                continue;
            }
            allZhaMatrix[1].push([tongZiList[i], tongZiList[i], tongZiList[i]]); 
        }

        for (var i = 0; i < diZhaList.length; i++) {
            var tmp = [];
            for (var j = 1; j <= 4; j++) {
                tmp.push(diZhaList[i] + j * 100, diZhaList[i] + j * 100);
            }
            allZhaMatrix[2].push(tmp);
        }

        for (var i = 0; i < xiList.length; i++) {
            // 同牌点的喜 只提示一次
            if (i >= 1 && _.point(xiList[i]) == _.point(xiList[i - 1] && !options.isSiXi)) { 
                continue;
            }
            allZhaMatrix[3].push([xiList[i], xiList[i], xiList[i], xiList[i]]);
        }

        var bigTypeMatrix = []; // 更大牌型
        var sameTypeMatrix = []; // 同种牌型的大牌
        var idx = 0;
        if (cards2 && type2 >= CARD_TYPE.zhaDan) {
            idx = type2 + 1 - CARD_TYPE.zhaDan;
        }

        for (var i = idx; i < allZhaMatrix.length; i++) {
            bigTypeMatrix = bigTypeMatrix.concat(allZhaMatrix[i]);
        }

        // 单张、对子不拆连对 三张不拆飞机;
        var  canLink = function (list, i) {
            if (i >= 1 && list[i] - list[i - 1] == 1 && (list[i] < 15 || this.canLink15(options))) {
                return true;
            }

            if (i <= list.length - 2 && list[i + 1] - list[i] == 1 && (list[i + 1] < 15 || this.canLink15(options))) {
                return true;
            }

            return false;
        }.bind(this);

        if (!cards2) { // 回合第一首牌
            // if (tongZiList.length == 0 && xiList.length == 0) {
                var type = this.getCardType(hand, options, deckNum, hasWings);
                if (type == CARD_TYPE.sanZhang || type == CARD_TYPE.feiJi) { // 单张 飞机
                    hand = hand.slice();
                    hand = this.sort2(hand);
                    return [hand];
                }
            // }

            // 单张
            for (var i = 0; i < pHash[1].length; i++) {
                var cards = getCardsByNum(pHash[1][i], 1);
                sameTypeMatrix.push(cards);
            }

            // 对子
            for (var i = 0; i < pHash[2].length; i++) {
                var point = pHash[2][i];
                if (!canLink(pHash[2], i)) {
                    var cards = getCardsByNum(point, 2);
                    sameTypeMatrix.push(cards);
                }
            }

            // 三张
            for (var i = 0; i < pHash[3].length; i++) {
                var point = pHash[3][i];
                if (!canLink(pHash[3], i)) {
                    var cards = getCardsByNum(point, 3);
                    sameTypeMatrix.push(cards);
                }
            }

            // 连对飞机牌型组合
            function pushLinkCards(list, endPos, linkNum, needNum) {
                var cards = [];
                var isBreakFeiJi = true;
                for (var i = linkNum - 1; i >= 0; i--) {
                    // console.log(list[endPos -i]);

                    // todo 拆飞机应该在list中排除
                    if (needNum == 2 && pHash[3].indexOf(list[endPos - i]) < 0) {
                        isBreakFeiJi = false;
                    }
                    cards = cards.concat(getCardsByNum(list[endPos - i], needNum));
                }

                if (needNum == 3 || !isBreakFeiJi) {
                    sameTypeMatrix.push(cards);
                }
            }

             // 连对
            var list = pHash[2].concat(pHash[3]);
            list.sort(function(a, b) {
                return a - b;
            });
            var nowLinkNum = 1;
            for (var i = 1; i < list.length; i++) {
                if (list[i] - list[i - 1] == 1 && (list[i] < 15 || this.canLink15(options))) {
                    nowLinkNum++;
                } else {
                    if (nowLinkNum >= 2) {
                        pushLinkCards(list, i - 1, nowLinkNum, 2);
                    }
                    nowLinkNum = 1;
                }

                if (i == list.length - 1 && nowLinkNum >= 2) { // 收尾
                    pushLinkCards(list, i, nowLinkNum, 2);
                }
            }

            // 飞机
            list = pHash[3];
            nowLinkNum = 1;
            for (var i = 1; i < list.length; i++) {
                if (list[i] - list[i - 1] == 1 && (list[i] < 15 || this.canLink15(options))) {
                    nowLinkNum++;
                } else {
                    if (nowLinkNum >= 2) {
                        pushLinkCards(list, i - 1, nowLinkNum, 3);
                    }
                    nowLinkNum = 1;
                }

                if (i == list.length - 1 && nowLinkNum >= 2) { // 收尾
                    pushLinkCards(list, i, nowLinkNum, 3);
                }
            }
        } else if (type2 < CARD_TYPE.zhaDan) { // 炸弹以下
            var needNum = 0; // 需要牌张数
            var list = []; // 可取牌点集合
            var breakList = []; 
            var value = 0; // 比较值
            var linkNum = 0; // 连对 飞机连牌数

            if (type2 == CARD_TYPE.sanZhang || type2 == CARD_TYPE.feiJi) { // 三张、飞机可带完 提示全部手牌
                // if (tongZiList.length == 0 && xiList.length == 0) {
                    var type = this.getCardType(hand, options, deckNum, hasWings);
                    if ((type == CARD_TYPE.sanZhang || type == CARD_TYPE.feiJi) && this.isBigger(hand, cards2, type2, deckNum, hasWings, bodyLen)) {
                        hand = hand.slice();
                        hand = this.sort2(hand);
                        return [hand];
                    }
                // }
            }
            
            switch (type2) {
                case CARD_TYPE.danZhang: // 单张
                    needNum = 1;
                    list = pHash[1];
                    breakList = [];
                    for (var i = 0; i < pHash[2].length; i++) {
                        if (!canLink(pHash[2], i)) { // 不拆连对
                            list.push(pHash[2][i]);
                        } else {
                            breakList.push(pHash[2][i]);
                        }
                    }

                    for (var i = 0; i < pHash[3].length; i++) {
                        if (!canLink(pHash[3], i)) { // 不拆飞机
                            list.push(pHash[3][i]);
                        } else {
                            breakList.push(pHash[3][i]);
                        }
                    }
                    // list.sort(function(a, b) {
                    //     return a - b;
                    // });

                    value = _.point(cards2[0]);
                    break;
                case CARD_TYPE.duiZi:    // 对子
                    needNum = 2;
                    list = pHash[2];
                    breakList = pHash[3];
                    // for (var i = 0; i < pHash[2].length; i++) {
                    //     if (!canLink(pHash[2], i)) { // 不拆连对
                    //         list.push(pHash[2][i]);
                    //     } else {
                    //         breakList.push(pHash[2][i]);
                    //     }
                    // }
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
                    breakList = [];
                    // for (var i = 0; i < pHash[3].length; i++) {
                    //     if (!canLink(pHash[3], i)) { // 不拆飞机
                    //         list.push(pHash[3][i]);
                    //     } else {
                    //         breakList.push(pHash[3][i]);
                    //     }
                    // }
                    value = this.analyzeSanZhang(cards2).body;
                    break;
                case CARD_TYPE.feiJi: // 飞机
                    needNum = 3;
                    list = pHash[3];
                    var body2 = this.analyzeFeiJi(cards2, options, deckNum, hasWings, bodyLen).body;
                    linkNum = body2.length;
                    value = body2[body2.length - 1];
                    break;
            }

            if (type2 == CARD_TYPE.danZhang || type2 == CARD_TYPE.duiZi || type2 == CARD_TYPE.sanZhang) {
                for (var i = 0; i < list.length; i++) {
                    if (list[i] > value) {
                        var cards = getCardsByNum(list[i], needNum);
                        sameTypeMatrix.push(cards);
                    }
                }

                for (var i = 0; i < breakList.length; i++) {
                    if (breakList[i] > value) {
                        var cards = getCardsByNum(breakList[i], needNum);
                        breakMatrix.push(cards);
                    }
                }
            } else { // 连对 飞机
                var nowLinkNum = 1;
                for (var i = 1; i < list.length; i++) {
                    if (list[i] >= 15 && !this.canLink15(options)) {
                        continue;
                    }
                    
                    nowLinkNum = list[i] - list[i - 1] == 1 ? nowLinkNum + 1 : 1;
                    if (nowLinkNum >= linkNum && list[i] > value) {
                        var cards = [];
                        for (var j = linkNum - 1; j >= 0; j--) {
                            cards = cards.concat(getCardsByNum(list[i] - j, needNum));
                        }
                        sameTypeMatrix.push(cards);
                        nowLinkNum -= 1;
                    }
                }
            }
        } else {
            switch (type2) {
                case CARD_TYPE.xi: // 喜
                    for (var i = 0; i < xiList.length; i++) {
                        // 同牌点的喜 只提示一次
                        if (i >= 1 && _.point(xiList[i]) == _.point(xiList[i - 1]) && !options.isSiXi) { 
                            continue;
                        }

                        if (_.point(xiList[i]) >_.point(cards2[0])) {
                            sameTypeMatrix.push([xiList[i], xiList[i], xiList[i], xiList[i]]);
                        }

                        if (_.point(xiList[i]) == _.point(cards2[0]) && xiList[i] > cards2[0] && options.isSiXi) {
                            sameTypeMatrix.push([xiList[i], xiList[i], xiList[i], xiList[i]]);
                        }
                    }
                    break;
                case CARD_TYPE.diZha: // 地炸
                    for (var i = 0; i < diZhaList.length; i++) {
                        if (_.point(diZhaList[i]) >_.point(cards2[0])) {
                            var tmp = []
                            for (var j = 1; j <= 4; j++) {
                                tmp.push(diZhaList[i] + j * 100, diZhaList[i] + j * 100);
                            }
                            sameTypeMatrix.push(tmp);
                        }
                    }
                    break;
                case CARD_TYPE.tongZi: // 筒子
                    for (var i = 0; i < tongZiList.length; i++) {
                        if (_.point(tongZiList[i]) >_.point(cards2[0])) {
                            sameTypeMatrix.push([tongZiList[i], tongZiList[i], tongZiList[i]]);
                        }

                        if (_.point(tongZiList[i]) == _.point(cards2[0]) && tongZiList[i] > cards2[0] && (deckNum == 3 || options.isSiXi)) {
                            sameTypeMatrix.push([tongZiList[i], tongZiList[i], tongZiList[i]]);
                        }
                    }
                    break;
                case CARD_TYPE.zhaDan: // 炸弹
                    for (var i = 0; i < zhaDanList.length; i++) {
                        if (zhaDanList[i].count == cards2.length && zhaDanList[i].point > _.point(cards2[0])) {
                            sameTypeMatrix = allZhaMatrix[0].slice(i);
                            break;
                        }

                        if (zhaDanList[i].count > cards2.length) {
                            sameTypeMatrix = allZhaMatrix[0].slice(i);
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

    // 不可用的牌
    DaTongZi.prototype.getDisabledList = function(hand, cards2, type2, options, deckNum, hasWings, bodyLen) {
        if (hasWings == undefined) { // 线上回放兼容处理
            hasWings = deckNum == 3;
        }

        if (!cards2) {
            return [];
        }

        type2 = type2 || this.getCardType(cards2, options, deckNum, hasWings);
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
                    var body2 = this.analyzeFeiJi(cards2, options, deckNum, hasWings, bodyLen).body;
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
                    if (list[i] >= 15 && !this.canLink15(options)) {
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

                        if (options.isSiXi && _.point(xiList[i]) == _.point(cards2[0]) && xiList[i] > cards2[0]) {
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

                        if (_.point(tongZiList[i]) == _.point(cards2[0]) && tongZiList[i] > cards2[0] && (deckNum == 3 || options.isSiXi)) {
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

    // 获取特殊牌型的牌
    DaTongZi.prototype.getSpclMatrix = function(hand, deckNum) {
        // 牌统计; 提取喜、地炸、筒子
        var spclMatrix = [];
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

    // 拆牌提示
    DaTongZi.prototype.getBreakUpDesc = function(hand, cards, options, deckNum, hasWings) {
        if (hasWings == undefined) { // 线上回放兼容处理
            hasWings = deckNum == 3;
        }

        var desc = "";
        var type = this.getCardType(cards, options, deckNum, hasWings);
        if (type == CARD_TYPE.noType || type == CARD_TYPE.xi || type == CARD_TYPE.diZha) {
            return desc;
        }

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
                c_dict[cd] -= 3;
            } else if (c_dict[k] == 4) {
                xiList.push(cd);
                p_dict[_.point(cd)] -= 4;
                c_dict[cd] -= 4;
            }   
        }
        this.formatSort(tongZiList);

        var zhaDanList = [];
        for (var k in p_dict) {
            var count = p_dict[k];
            var point = Number(k);
            if (count >= 4) {
                zhaDanList.push({count: count, point: point});
            }
        }
        // console.log("zhaDanList@@ ", zhaDanList);

        var breakUpFlag = 0; // 喜 地炸 筒子 炸弹
        switch (type) {
            case CARD_TYPE.tongZi: // 筒子拆地炸
                if (xiList.indexOf(cards[0]) >= 0) {
                    breakUpFlag = (breakUpFlag | 8);
                }

                if (diZhaList.indexOf(_.point(cards[0])) >= 0) {
                    breakUpFlag = (breakUpFlag | 4);
                }
                break;
            case CARD_TYPE.zhaDan:
                for (var i = 0; i < cards.length; i++) {
                    var cd = cards[i];
                    if (xiList.indexOf(cd) >= 0) {
                        breakUpFlag = (breakUpFlag | 8);
                    }

                    if (diZhaList.indexOf(_.point(cd)) >= 0) {
                        var leftCount = c_dict[cd];
                        var usedCount = 0;
                        for (var j = 0; j < cards.length; j++) {
                            if (cards[j] == cd) {
                                usedCount++;
                            }
                        }

                        if (usedCount > leftCount) {
                            breakUpFlag = (breakUpFlag | 4);
                        }
                    }

                    if (tongZiList.indexOf(cd) >= 0) {
                        breakUpFlag  = (breakUpFlag | 2);
                    }
                }

                for (var i = 0; i < zhaDanList.length; i++) {
                    if (zhaDanList[i].point == _.point(cards[0]) && zhaDanList[i].count > cards.length) {
                        breakUpFlag  = (breakUpFlag | 1);
                    }
                }
                break;
            case CARD_TYPE.duiZi:
            case CARD_TYPE.sanZhang:
            case CARD_TYPE.lianDui:
            case CARD_TYPE.feiJi:
            case CARD_TYPE.danZhang:
                for (var i = 0; i < cards.length; i++) {
                    var cd = cards[i];
                    if (xiList.indexOf(cd) >= 0) {
                        breakUpFlag = (breakUpFlag | 8);
                    }

                    if (diZhaList.indexOf(_.point(cd)) >= 0) {
                        var leftCount = c_dict[cd];
                        var usedCount = 0;
                        for (var j = 0; j < cards.length; j++) {
                            if (cards[j] == cd) {
                                usedCount++;
                            }
                        }

                        if (usedCount > leftCount) {
                            breakUpFlag = (breakUpFlag | 4);
                        }
                    }

                    if (tongZiList.indexOf(cd) >= 0) {
                        breakUpFlag = (breakUpFlag | 2);
                    }

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
        } else if ((breakUpFlag & 2) > 0) {
            desc = "筒子";
        } else if ((breakUpFlag & 1) > 0) {
            desc = "炸弹";
        }

        return desc;
    }

    // 计算牌分
    DaTongZi.prototype.getCardScore = function(card) {
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

    // 获取特殊牌型
    DaTongZi.prototype.getSpclType = function(cards, options, deckNum, hasWings, isSiXi) {
        if (hasWings == undefined) { // 线上回放兼容处理
            hasWings = deckNum == 3;
        }

        switch (this.getCardType(cards, options, deckNum, hasWings)) {
            case CARD_TYPE.tongZi:
                if ((deckNum == 3 || isSiXi) && _.point(cards[0]) >= 13 && _.point(cards[0]) <= 15) {
                    return _.point(cards[0]) - 12;
                } else if (deckNum == 3 && (cards[0] == SMALL_JOKER || cards[0] == BIG_JOKER)) {
                    return SPCL_TYPE.tongZiJoker;
                }
                break;
            case CARD_TYPE.diZha:
                return SPCL_TYPE.diZha;
            case CARD_TYPE.xi:
                if (isSiXi) {
                    if (_.point(cards[0]) < 13) {
                        return SPCL_TYPE.xiSmall;
                    } else if (_.point(cards[0]) < _.point(SMALL_JOKER)) {
                        return _.point(cards[0]) - 12 + SPCL_TYPE.xiSmall; // K A 2喜
                    }
                } else {
                    if (cards[0] == SMALL_JOKER) {
                        return SPCL_TYPE.xiSmallJoker;
                    } else if (cards[0] == BIG_JOKER) {
                        return SPCL_TYPE.xiBigJoker;
                    } else {
                        return SPCL_TYPE.xiOther;
                    }
                }
                break;
            default:
                break;
        }

        return SPCL_TYPE.noType;
    }

    // 获取特殊牌型加分
    DaTongZi.prototype.getSpclTypeScore = function(spclType) {
        return spclType2Score[spclType];
    }

    // 统计剩余牌(记牌器)
    DaTongZi.prototype.statsLeftCards = function(sData, mjhand) {
        var tzcards = [
            105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, // 方块5-K A 2
            205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, // 梅花
            305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, // 红桃
            405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415  // 黑桃
        ];

        var areaSelectMode = sData.tData.areaSelectMode;
        if (!areaSelectMode.isSiXi && areaSelectMode.deckNum == 4 || areaSelectMode.haveKingTz) { // 4副牌带王
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
    DaTongZi.prototype.splitFeiJi = function(cards, options, deckNum, hasWings, bodyLen) {
        if (hasWings == undefined) { // 线上回放兼容处理
            hasWings = deckNum == 3;
        }
        
        var dict = {};
        for (var i = 0; i < cards.length; i++) {
            var p = _.point(cards[i]);
            dict[p] = dict[p] ? dict[p] + 1 : 1;
        }

        var body = []; // 主体 
        var wing = []; // 翅膀
        var threeList = [];
        for (var p in dict) {
            if (dict[p] >= 3 && (Number(p) < 15 || this.canLink15(options))) {
                threeList.push(Number(p));
            }   
        }

        var linkNum = 1;
        var maxLinkNum = 1;
        var maxLinkIdx = -1;
        for (var i = 1; i < threeList.length; i++) {
            linkNum = (threeList[i] - threeList[i - 1] == 1) ? linkNum + 1 : 1;
            if (linkNum > maxLinkNum) {
                maxLinkNum = linkNum;
                maxLinkIdx = i;
            }
        }

        if (maxLinkNum >= (bodyLen || 2)) {
            maxLinkNum = bodyLen || maxLinkNum;
            var list = threeList.splice(maxLinkIdx + 1 - maxLinkNum, maxLinkNum);

            var idx = 0;
            cards = cards.slice();
            this.formatSort(cards);
            for (var i = 0; i < list.length; i++) {
                if (list[i] >= _.point(SMALL_JOKER)) {
                    body.push(500 + list[i], 500 + list[i], 500 + list[i]);
                    for (var j = 0; j < 3; j++) {
                        cards.splice(cards.indexOf(500 + list[i]), 1);
                    }
                } else {
                    var num = 0;
                    while (num < 3) {
                        for (var j = 1; j <= 4; j++) {
                            var idx = cards.indexOf(j * 100 + list[i]);
                            if (idx >= 0) {
                                body.push(j * 100 + list[i]);
                                cards.splice(idx, 1);
                                num++;
                                if (num >= 3) {
                                    break;
                                }
                            }
                        }
                    }
                }
            }

            

            // for (var j = 0; j < cards.length; j++) {
            //     if (_.point(cards[j]) == list[idx]) {
            //         body = body.concat(cards.splice(j, 3));
            //         j--;
            //         idx++;
            //         if (idx > list.length - 1) {
            //             break;
            //         }
            //     }
            // }
            wing = cards;

            // 是飞机 但是拆分 按指定连牌数非法
            if (!hasWings && wing.length > 0) {
                body = [];
            } else if (hasWings && wing.length > body.length * 2) {
                body = [];
            }
        }

        return {body: body, wing: wing};
    }

    // 三张拆分(主体 带的牌)
    DaTongZi.prototype.splitSanZhang = function(cards, deckNum) {
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

    DaTongZi.prototype.checkPut = function(hand, cards) {
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
        MjClient.majiang_DaTongZi = new DaTongZi();
    } else {
        module.exports = DaTongZi;
    }

    function test() {
        var a = new DaTongZi();
        // var cards1 = [215, 215, 215, 315, 315, 315, 415, 415, 115, 115, 115];
        var cards1 = [113, 213, 313, 414, 114, 214, 315, 215, 115];
        var cards2 = [111, 211, 311, 412, 112, 212, 313, 213, 113];
        var cards1 = [115, 115, 115];
        var cards2 = [315, 315, 315];

        var cards1 = [112,112,312,211,311,411, 612];
        var cards2 = [312,114,214,114,212,213,412,113,313,411,311,211];
        var cards1 = [111, 111, 111, 111]
        // console.log(a.getBreakUpDesc(cards1, cards2, 3, true));
        // console.log(a.getSpclType(cards1, 3, true));


        shuffleArray = function(arr) {
            for (var i = 0; i < arr.length; i++) {
                var randIndex = i + Math.floor(Math.random() * (arr.length - i));
                var temp = arr[i];
                arr[i] = arr[randIndex];
                arr[randIndex] = temp;
            }
            return arr;
        };

        var para = {
            deckNum: 3,
            haveKingTz: true 
        }
        var tData = {
            maxPlayer: 3,
            handCount: 41
        }

        var c = 1;
        var stats = {};
        while (c--) {
            var cards = a.randomCards(para, tData);
            for (var i = 0; i < cards.length; i++) {
                stats[cards[i]] = stats[cards[i]] ? stats[cards[i]] + 1 : 1;
            }
        }
        // console.log(stats);
        // var i = 1;
        // while(i--) {
        //     a.randomCards(para, tData);
        // }


        var hand = [306,305,109,313,114,408,412,109,415,315,105,413,412,209,115,406,412,414,406,107,114,407,412,411,113,407,208,206,405,211,315,411,311,305,415];
        var cards2 = [112,112,112,112];
        var options = {
            "maxPlayer": 3,
            "payWay": 0,
            "deckNum": 4,
            "isSiXi": true,
            "scoreLine": 1000,
            "lastRoundScore": 100,
            "isAnCards": true,
            "isReCall": false,
            "isShowLeft": true,
            "isRandom": true,
            "haveKingTz": false,
            "isBiChu": true,
            "isTrust": true,
            "hasWings": true
        }
        // console.log(a.getDisabledList(hand, cards2, 6, options, 4, true, null));

        // console.log(a.getCardType(cards1, 4, true));
        // console.log(a.canBeat(cards2, cards1, null, 3, true, 2));
        // console.log(a.getDisabledList(cards2, cards1, null, 4, true, 2));
        // console.log(a.hintPutCard(cards2, cards1, null, 3, true, 2));
        // console.log(a.isBigger(cards2, cards1, null, 3, true, 2));
        // console.log(a.sort2(cards1, 3));
        // console.log(a.splitFeiJi(cards1, 4, true, 4));
        // var cards1 = [112, 113, 213, 413, 113];
        // console.log(a.splitSanZhang(cards1, 3));
    }
    // test();
}());