// 邵阳霸炸弹算法
(function() {
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
        sanZhang: 2,    // 三张
        shunZi: 3,      // 顺子
        lianDui: 4,     // 连对
        feiJi: 5,       // 飞机
        danWang: 6,        // 单王
        zaHuaWuShiK: 7, // 杂花5-10-k
        tongHuaWuShiK: 8,   // 同花5-10-k
        zhaDan: 9,      // 炸弹
    };

    // 顺子队列
    var SHUN_QUEUE = [14, 15, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]; // k 可以连A
    // var SHUN_QUEUE = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    
    function BaZhaDan() {
        this.CARD_TYPE = CARD_TYPE;
        this.sortType = 1;
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

    // 洗牌
    BaZhaDan.prototype.randomCards = function(areaSelectMode) {
        var deckNum = areaSelectMode.deckNum || 2;
        var tzcards = [
            103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, // 方块3-K A 2
            203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, // 梅花
            303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, // 红桃
            403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415  // 黑桃
        ];

        if (areaSelectMode.hasJoker) {
            tzcards.push(SMALL_JOKER, BIG_JOKER);
        }

        var cards = [];
        for (var i = 0; i < deckNum; i++) {
            cards = cards.concat(tzcards);
        }

        shuffleArray(cards);
        return cards;
    };

    // 排序
    BaZhaDan.prototype.formatSort = function(cards) {
        cards.sort(function(a, b) {
            if (_.point(a) == _.point(b)) {
                return a - b;
            }

            return _.point(a) - _.point(b);
        });
    }

    BaZhaDan.prototype.sort2 = function(cards) {
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
        var danWangList = []; // 单王
        if (jokerList.length >= 2) {
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

        if (jokerList.length == 1) {
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

    BaZhaDan.prototype.sortCard = function(cards, sortType) {
        this.sortType = sortType || (this.sortType % 2 + 1);
        switch (this.sortType) {
            case 1:
                this.formatSort(cards);
                return cards;
            case 2:
                return this.sort2(cards);
        }
    }

    // 是否单王
    BaZhaDan.prototype.isDanWang = function(cards) {
        if (cards.length != 1) {
            return false;
        }

        return cards[0] == BIG_JOKER || cards[0] == SMALL_JOKER;
    }

    // 是否单张
    BaZhaDan.prototype.isDanZhang = function(cards) {
        if (this.isDanWang(cards)) {
            return false;
        }

        return cards.length == 1;
    }
    
    // 是否对
    BaZhaDan.prototype.isDuiZi = function(cards) {
        if (cards.length != 2) {
            return false;
        }

        if (this.isZhaDan(cards)) { // 双王
            return false;
        }

        return _.point(cards[0]) == _.point(cards[1]);
    }

    // 分析三张主体 翅膀
    BaZhaDan.prototype.analyzeSanZhang = function(cards) {
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
    BaZhaDan.prototype.isSanZhang = function(cards, hasWings) {
        if (cards.length < 3 || cards.length > 5) {
            return false;
        }

        if (this.isZhaDan(cards)) {
            return false;
        }

        var struct = this.analyzeSanZhang(cards);
        if (struct.body == -1) {
            return false;
        }

        return true;
    }

    // 分析顺子连牌队列
    BaZhaDan.prototype.analyzeShunZi = function(list, shunType) {
        if (list.length < 2) {
            return [];
        }

        var queue = list.slice();
        for (var i = 0; i < queue.length; i++) {
            queue[i] = _.point(queue[i]);
        }

        queue.sort(function(a, b) {
            return a - b;
        });

        if (queue[queue.length - 1] > (shunType == 0 ? 15 : 16)) {
            return [];
        }

        var isShun = true; // A 2最大
        for (var i = 1; i < queue.length; i++) {
            if (queue[i] - queue[i - 1] != 1) {
                isShun = false;
                break;
            }
        }

        if (isShun) {
            return queue;
        }

        if (queue.indexOf(14) >= 0 || queue.indexOf(15) >= 0) {
            for (var i = 0; i < queue.length; i++) {
                if (queue[i] == 14 || queue[i] == 15) { // A 2编码替换
                    queue[i] -= 13;
                }
            }

            queue.sort(function(a, b) {
                return a - b;
            });
        }

        isShun = true; // A 2最小
        for (var i = 1; i < queue.length; i++) {
            if (queue[i] - queue[i - 1] != 1) {
                isShun = false;
                break;
            }
        }

        if (isShun) {
            return queue;
        }

        return [];
    }

    // 是否顺子
    BaZhaDan.prototype.isShunZi = function(cards, shunType) {
        if (cards.length < 5) {
            return false;
        }

        return this.analyzeShunZi(cards, shunType).length > 0;
    }

    BaZhaDan.prototype.analyzeLianDui = function(cards, shunType) {
        cards = cards.slice();
        this.formatSort(cards);
        var list = [];
        for (var i = 0; i < cards.length; i+=2) {
            if (_.point(cards[i]) != _.point(cards[i + 1])) {
                return [];
            }

            list.push(cards[i]);
        }

        return this.analyzeShunZi(list, shunType);
    }

    // 是否连对
    BaZhaDan.prototype.isLianDui = function(cards, shunType) {
        if (cards.length  < 4 || cards.length % 2 != 0) {
            return false;
        }

        if (this.isZhaDan(cards)) { // 2大 小王
            return false;
        }

        if (this.analyzeLianDui(cards, shunType).length > 0) {
            return true;
        }

        return false;
    }

    // 分析飞机主体 翅膀
    BaZhaDan.prototype.analyzeFeiJi = function(cards, hasWings, bodyLen) {
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
            if (dict[p] >= 3 && Number(p) < _.point(SMALL_JOKER)) {
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

        // A 2最大
        var body1 = [];
        var wing1 = [];
        var linkNum = 1;
        var maxLinkNum = 1;
        var maxLinkIdx = -1;
        for (var i = 1; i < queue.length; i++) {
            linkNum = (queue[i] - queue[i - 1] == 1) ? linkNum + 1 : 1;
            if (linkNum > maxLinkNum) {
                maxLinkNum = linkNum;
                maxLinkIdx = i;
            }
        }

        if (maxLinkNum >= (bodyLen || 2)) {
            maxLinkNum = bodyLen || maxLinkNum;
            if (cards.length <= maxLinkNum * 5) {
                body1 = queue.slice().splice(maxLinkIdx + 1 - maxLinkNum, maxLinkNum);
            }
        }

        // A 2最小
        var body2 = [];
        var wing2 = [];
        if (queue.indexOf(14) >= 0 || queue.indexOf(15) >= 0) {
            for (var i = 0; i < queue.length; i++) {
                if (queue[i] == 14 || queue[i] == 15) { // A 2编码替换
                    queue[i] -= 13;
                }
            }

            queue.sort(function(a, b) {
                return a - b;
            });
        }

        var linkNum = 1;
        var maxLinkNum = 1;
        var maxLinkIdx = -1;
        for (var i = 1; i < queue.length; i++) {
            linkNum = (queue[i] - queue[i - 1] == 1) ? linkNum + 1 : 1;
            if (linkNum > maxLinkNum) {
                maxLinkNum = linkNum;
                maxLinkIdx = i;
            }
        }

        if (maxLinkNum >= (bodyLen || 2)) {
            maxLinkNum = bodyLen || maxLinkNum;
            if (cards.length <= maxLinkNum * 5) {
                body2 = queue.slice().splice(maxLinkIdx + 1 - maxLinkNum, maxLinkNum);
            }
        }

        body = body2.length > body1.length ? body2 : body1;
        return {body: body, wing: []};
    }

    // 是否飞机
    BaZhaDan.prototype.isFeiJi = function(cards, hasWings) {
        if (cards.length < 6) {
            return false;
        }

        var struct = this.analyzeFeiJi(cards, hasWings);
        if (struct.body.length < 2) {
            return false;
        }

        return true;
    }

    // 是否同花5-10-k
    BaZhaDan.prototype.isTongHuaWuShiK = function(cards) {
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
    BaZhaDan.prototype.isZaHuaWuShiK = function(cards) {
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

    // 是否炸弹(王2张及以上 普通牌4张 )
    BaZhaDan.prototype.isZhaDan = function(cards) {
        if (this.isWangZha(cards)) {
            return true;
        }

        if (cards.length < 4) {
            return false;
        }

        for (var i = 1; i < cards.length; i++) {
            if (_.point(cards[i]) != _.point(cards[i - 1])) {
                return false;
            }

        }

        return true;
    }

    // 是否王炸
    BaZhaDan.prototype.isWangZha = function(cards) {
        if (cards.length <= 1) {
            return false;
        }

        for (var i = 0; i < cards.length; i++) {
            if (cards[i] != BIG_JOKER && cards[i] != SMALL_JOKER) {
                return false;
            }
        }

        return true;
    }

    // 获取牌型
    BaZhaDan.prototype.getCardType = function(cards, shunType, hasWings) {
        hasWings = true;

        if (this.isDanWang(cards)) {
            return CARD_TYPE.danWang;
        }
        
        if (this.isDanZhang(cards)) {
            return CARD_TYPE.danZhang;
        }

        if (this.isZhaDan(cards)) {
            return CARD_TYPE.zhaDan;
        }

        if (this.isDuiZi(cards)) {
            return CARD_TYPE.duiZi;
        }

        if (this.isSanZhang(cards, hasWings)) {
            return CARD_TYPE.sanZhang;
        }

        if (this.isShunZi(cards, shunType)) {
            return CARD_TYPE.shunZi;
        }

        if (this.isLianDui(cards, shunType)) {
            return CARD_TYPE.lianDui;
        }

        if (this.isFeiJi(cards, hasWings)) {
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
    BaZhaDan.prototype.getZhaDanValue = function(cards) {
        var value;
        if (cards[0] == BIG_JOKER || cards[0] == SMALL_JOKER) {
            value = (cards.length * 2 + 0.5) * 100 + _.point(SMALL_JOKER);
            if (cards.toString() == [BIG_JOKER, BIG_JOKER].toString()) { // 2大王能压2小王
                value += 1; // 此处写死 因为不存在2大王 一大王一小王的情况！
            }
        } else {
            value = cards.length * 100 + _.point(cards[0]);
        }

        return value;
    }

    // // 获取全能牌 大小级别(4王 8炸 7炸 3王 6炸 5炸 2王 4炸 同花五十k 杂花五十k)
    // BaZhaDan.prototype.getSpclValue = function(cards, type) {
    //     type = type || this.getCardType(cards);
    //     var value = 0;
    //     switch (type) {
    //         case CARD_TYPE.zaHuaWuShiK:
    //             value = 2;
    //             break;
    //         case CARD_TYPE.tongHuaWuShiK:
    //             value = 3;
    //             break;
    //         case CARD_TYPE.zhaDan:
    //             value = cards.length;
    //             break;
    //         case CARD_TYPE.wangZha:
    //             value = cards.length + 0.5;
    //             break;
    //         default:
    //             break;
    //     }

    //     return value;
    // }

    // var CARD_TYPE = {
    //     noType: -1,     // 无牌型
    //     danZhang: 0,    // 单张
    //     duiZi: 1,       // 对子
    //     sanZhang: 2,    // 三张
    //     shunZi: 3,      // 顺子
    //     lianDui: 4,     // 连对
    //     feiJi: 5,       // 飞机
    //     danWang: 6,        // 单王
    //     zaHuaWuShiK: 7, // 杂花5-10-k
    //     tongHuaWuShiK: 8,   // 同花5-10-k
    //     zhaDan: 9,      // 炸弹
    // };

    // 牌1是否比牌2大
    BaZhaDan.prototype.isBigger = function(cards1, cards2, type2, shunType, hasWings, bodyLen) {
        hasWings = true;
        
        var type1 = this.getCardType(cards1, shunType, hasWings);
        type2 = type2 || this.getCardType(cards2, shunType, hasWings);
        if (type1 == CARD_TYPE.noType || type2 == CARD_TYPE.noType) {
            return false;
        }

        if (type1 < type2) {
            return false;
        }

        if (type1 > type2) {
            if (type1 == CARD_TYPE.danWang) {
                return (type2 == CARD_TYPE.danZhang || type2 == CARD_TYPE.duiZi);
            }

            return type1 >= CARD_TYPE.zaHuaWuShiK;
        }

        // 同种牌型
        switch (type1) {
            case CARD_TYPE.danZhang: // 单张
            case CARD_TYPE.duiZi:    // 对子
            case CARD_TYPE.danWang:  // 单王
                return _.point(cards1[0]) > _.point(cards2[0]);
            case CARD_TYPE.sanZhang: // 三张
                return this.analyzeSanZhang(cards1).body > this.analyzeSanZhang(cards2).body;
            case CARD_TYPE.shunZi:  // 顺子
                if (cards1.length != cards2.length) {
                    return false;
                }

                return this.analyzeShunZi(cards1, shunType)[0] > this.analyzeShunZi(cards2, shunType)[0];
            case CARD_TYPE.lianDui: // 连对
                if (cards1.length != cards2.length) {
                    return false;
                }
                
                return this.analyzeLianDui(cards1)[0] > this.analyzeLianDui(cards2)[0];
            case CARD_TYPE.feiJi: // 飞机
                var body1 = this.analyzeFeiJi(cards1, hasWings, bodyLen).body;
                var body2 = this.analyzeFeiJi(cards2, hasWings, bodyLen).body;
                if (body1.length != body2.length) {
                    return false;
                }

                return body1[0] > body2[0];
            case CARD_TYPE.zaHuaWuShiK: // 杂花五十K
            case CARD_TYPE.tongHuaWuShiK: // 同花五十K
                return false;
            case CARD_TYPE.zhaDan: // 炸弹
                return this.getZhaDanValue(cards1) > this.getZhaDanValue(cards2);
        }
    }

    // 是否要的起
    BaZhaDan.prototype.canBeat = function(hand, cards2, type2, shunType, hasWings, bodyLen) {
        hasWings = true;

        type2 = type2 || this.getCardType(cards2, shunType, hasWings);
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

        var zhaDanList = pHash[4]; // 炸弹
        var tongHuaFlag = false;
        var zaHuaFlag = false;
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

        if (type2 < CARD_TYPE.zaHuaWuShiK) { // 杂花五十K以下牌型
            if (type2 == CARD_TYPE.danZhang || type2 == CARD_TYPE.duiZi) {
                if (jokerList.length > 0) {
                    return true;
                }
            }

            if (tongHuaFlag || zaHuaFlag || jokerList.length >= 2 || zhaDanList.length > 0) {
                return true;
            }

            if (type2 == CARD_TYPE.danWang) {
                return (cards2[0] == SMALL_JOKER && c_dict[BIG_JOKER] > 0);
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
                    var queue = this.analyzeShunZi(cards2, shunType);
                    value = queue[queue.length - 1];
                    break;
                case CARD_TYPE.lianDui: // 连对
                    list = pHash[2].concat(pHash[3]);
                    linkNum = cards2.length / 2;
                    var queue = this.analyzeLianDui(cards2);
                    value = queue[queue.length - 1];
                    break;
                case CARD_TYPE.feiJi: // 飞机
                    list = pHash[3];
                    var body2 = this.analyzeFeiJi(cards2, hasWings, bodyLen).body;
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
            } else { // 顺子 连对 飞机
                var nowLinkNum = 1;
                var copy = list.slice();

                copy.sort(function(a, b) {
                    return a - b;
                });

                if (shunType == 0 && copy.indexOf(16) >= 0) {
                    copy.splice(copy.indexOf(16), 1);
                }

                if (copy.indexOf(15) >= 0) {
                    copy.unshift(2);
                }

                for (var i = copy.length - 1; i > 0; i--) {

                    if (copy[i] <= value + 1 - nowLinkNum) {
                        return false;
                    }

                    nowLinkNum = copy[i] - copy[i - 1] == 1 ? nowLinkNum + 1 : 1;
                    if (nowLinkNum >= linkNum) {
                        return true;
                    }
                }
            }

            return false;
        }

        switch (type2) {
            case CARD_TYPE.zaHuaWuShiK: // 杂花五十K
                return (tongHuaFlag || jokerList.length >= 2 || zhaDanList.length > 0);
            case CARD_TYPE.tongHuaWuShiK: // 同花五十K
                return (jokerList.length >= 2 || zhaDanList.length > 0);
            case CARD_TYPE.zhaDan: // 炸弹
                var value = this.getZhaDanValue(cards2);
                if (this.getZhaDanValue(jokerList) > value) {
                    return true;
                }

                for (var i = 0; i < zhaDanList.length; i++) {
                    var p = zhaDanList[i];
                    if (p_dict[p] * 100 + p > value) {
                        return true;
                    }
                }
        }

        return false;
    }

    // 提示出牌
    BaZhaDan.prototype.hintPutCard = function(hand, cards2, type2, shunType, hasWings, bodyLen) {
        var shun = SHUN_QUEUE.slice();
        if (shunType == 1) {
            shun.push(16);
        }

        hasWings = true;
        var hintMatrix = [];
        if (cards2) {
            type2 = type2 || this.getCardType(cards2, shunType, hasWings);
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
                continue;
            }
            c_dict[c] = c_dict[c] ? c_dict[c] + 1 : 1;

            var p = _.point(hand[i]);
            p_dict[p] = p_dict[p] ? p_dict[p] + 1 : 1;

        }

        var zhaDanList = []; // 炸弹
        var wuShiKList = []; // 五十K
        var danWangList = []; // 单王

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
        if (p_dict[5] < 4 && p_dict[10] < 4 && p_dict[13] < 4) {
            var num = Math.min(p_dict[5], p_dict[10], p_dict[13]);
            var findNum = 0;
            for (var i = 1; i <= 4; i++) {
                if (c_dict[i * 100 + 5] > 0 && c_dict[i * 100 + 10] > 0 && c_dict[i * 100 + 13] > 0) {
                    var row = [i * 100 + 5, i * 100 + 10, i * 100 + 13];
                    wuShiKList.push(row);
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

        if (jokerList.length == 1) {
            danWangList.push(jokerList);
        }

        var zhaDanList = [];
        if (jokerList.length >= 2) {
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
            allZhaMatrix[1] = [wuShiKList[0]];
        }

        if (zaHuaFlag) {
            allZhaMatrix[0] = [wuShiKList[wuShiKList.length - 1]];
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

        if (!cards2 || type2 == CARD_TYPE.danZhang || type2 == CARD_TYPE.duiZi) {
            if (danWangList.length > 0) {
                bigTypeMatrix = bigTypeMatrix.concat(danWangList);
            }
        }

        for (var i = idx; i < allZhaMatrix.length; i++) {
            bigTypeMatrix = bigTypeMatrix.concat(allZhaMatrix[i]);
        }

        // console.log("bigTypeMatrix@@ ", bigTypeMatrix);

        // 单张、对子不拆连对 三张不拆飞机;
        function canLink(list, i) {
            // var SHUN_QUEUE = [14, 15, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
            var idx = shun.indexOf(list[i]);
            if ((idx > 0 && list.indexOf(shun[idx - 1]) >= 0) || (idx < shun.length - 1 && list.indexOf(shun[idx + 1]) >= 0)) {
                return true;
            }

            if (list[i] == 14 && list.indexOf(13) >= 0) { // A
                return true;
            }

            // if (list[i] == 15 && shunType == 1 && list.indexOf(16) >= 0) { // 2
            //     return true;
            // }

            return false;
        }

        if (!cards2) { // 回合第一首牌
            var type = this.getCardType(hand, shunType, hasWings);
            if (type == CARD_TYPE.sanZhang || type == CARD_TYPE.feiJi) { // 单张 飞机
                hand = hand.slice();
                this.formatSort(hand);
                return [hand];
            }

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

            // 顺子 连对 飞机牌型组合
            var pushLinkCards = function(list, endPos, linkNum, needNum) {
                var cards = [];
                for (var i = linkNum - 1; i >= 0; i--) {
                    cards = cards.concat(getCardsByNum(shun[endPos - i], needNum));
                }

                this.formatSort(cards);
                sameTypeMatrix.push(cards);
            }.bind(this);

            // 顺子
            var list = pHash[1].concat(pHash[2]);
            
            list.sort(function(a, b) {
                return a - b;
            });

            if (list.length < SHUN_QUEUE.length - 2) {
                if (list.indexOf(15) >= 0) {
                    list.unshift(15);
                }

                if (list.indexOf(14) >= 0) {
                    list.unshift(14);
                }
            }

            if (shunType == 1 && jokerList.toString() == [SMALL_JOKER].toString()) {
                list.push(_.point(SMALL_JOKER));
            }

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
                        pushLinkCards(list, pos, nowLinkNum, 1);
                    }
                    nowLinkNum = 1;
                }

                if (i == list.length - 1 && nowLinkNum >= 5) { // 收尾
                    // if (nowLinkNum == shun.length) {
                    //     nowLinkNum--;
                    // }
                    pushLinkCards(list, pos, nowLinkNum, 1);
                }
            }

            // 连对
            var list = pHash[2].slice();
            for (var i = 0; i < pHash[3].length; i++) {
                if (!canLink(pHash[3], i)) {
                    list.push(pHash[3][i]);
                }
            }
            // 先不拆对小王 todo
            list.sort(function(a, b) {
                return a - b;
            });

            if (list.length < SHUN_QUEUE.length - 2) {
                if (list.indexOf(15) >= 0) {
                    list.unshift(15);
                }

                if (list.indexOf(14) >= 0) {
                    list.unshift(14);
                }
            }

            // if (list.indexOf(14) >= 0 && list.length <= shun.length - 1) {
            //     list.push(14); // 最后放一个A
            // }

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
                        pushLinkCards(list, pos, nowLinkNum, 2);
                    }
                    nowLinkNum = 1;
                }

                if (i == list.length - 1 && nowLinkNum >= 2) { // 收尾
                    // if (nowLinkNum == shun.length) {
                    //     nowLinkNum--;
                    // }
                    pushLinkCards(list, pos, nowLinkNum, 2);
                }
            }

            // var SHUN_QUEUE = [14, 15, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

            // 飞机
            list = pHash[3].slice();
            list.sort(function(a, b) {
                return a - b;
            });

            if (list.length < SHUN_QUEUE.length - 2) {
                if (list.indexOf(15) >= 0) {
                    list.unshift(15);
                }

                if (list.indexOf(14) >= 0) {
                    list.unshift(14);
                }
            }

            nowLinkNum = 1;
            pos = 0;
            for (var i = 1; i < list.length; i++) {
                if (nowLinkNum == 1) {
                    pos = SHUN_QUEUE.indexOf(list[i - 1]);
                }

                if (list[i] == SHUN_QUEUE[pos + 1]) {
                    nowLinkNum++;
                    pos++;
                } else {
                    if (nowLinkNum >= 2) {
                        pushLinkCards(list, pos, nowLinkNum, 3);
                    }
                    nowLinkNum = 1;
                }

                if (i == list.length - 1 && nowLinkNum >= 2) { // 收尾
                    // if (nowLinkNum == SHUN_QUEUE.length) {
                    //     nowLinkNum--;
                    // }
                    pushLinkCards(list, pos, nowLinkNum, 3);
                }
            }
        } else if (type2 < CARD_TYPE.zaHuaWuShiK) { //五十K以下
            var needNum = 0; // 需要牌张数
            var list = []; // 可取牌点集合
            var breakList = []; 
            var value = 0; // 比较值
            var linkNum = 0; // 连对 飞机连牌数

            if (type2 == CARD_TYPE.sanZhang || type2 == CARD_TYPE.feiJi) { // 三张、飞机可带完 提示全部手牌
                var type = this.getCardType(hand, shunType, hasWings);
                if ((type == CARD_TYPE.sanZhang || type == CARD_TYPE.feiJi) && this.isBigger(hand, cards2, type2, hasWings, bodyLen)) {
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
                case CARD_TYPE.danWang: //单王
                    needNum = 1;
                    if (danWangList.length > 0) {
                        list = danWangList[0];
                    }
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
                    if (shunType == 1 && jokerList.toString() == [SMALL_JOKER].toString()) {
                        list.push(_.point(SMALL_JOKER));
                    }
                    linkNum = cards2.length;
                    var queue = this.analyzeShunZi(cards2, shunType);
                    value = queue[queue.length - 1];
                    break;
                case CARD_TYPE.lianDui: // 连对
                    needNum = 2;
                    list = pHash[2].concat(pHash[3]);
                    linkNum = cards2.length / 2;
                    var queue = this.analyzeLianDui(cards2);
                    value = queue[queue.length - 1];
                    break;
                case CARD_TYPE.feiJi: // 飞机
                    needNum = 3;
                    list = pHash[3].slice();
                    var body2 = this.analyzeFeiJi(cards2, hasWings, bodyLen).body;
                    linkNum = body2.length;
                    value = body2[body2.length - 1];
                    break;
            }

            if (type2 == CARD_TYPE.danWang) {
                if (_.point(list[0]) > value) {
                    sameTypeMatrix.push([list[0]]);
                }
            } else if (type2 == CARD_TYPE.danZhang || type2 == CARD_TYPE.duiZi || type2 == CARD_TYPE.sanZhang) {
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
            } else { // 顺子 连对 飞机
                var nowLinkNum = 1;
                list.sort(function(a, b) {
                    return a - b;
                });

                if (list.indexOf(15) >= 0) {
                    list.unshift(2);
                }

                for (var i = 1; i < list.length; i++) {
                    nowLinkNum = list[i] - list[i - 1] == 1 ? nowLinkNum + 1 : 1;
                    if (nowLinkNum >= linkNum && list[i] > value) {
                        var cards = [];
                        for (var j = linkNum - 1; j >= 0; j--) {
                            cards = cards.concat(getCardsByNum(list[i] - j, needNum));
                        }

                        this.formatSort(cards);
                        sameTypeMatrix.push(cards);
                        nowLinkNum -= 1;
                    }
                }
            }
        } else {
            switch (type2) {
                case CARD_TYPE.zaHuaWuShiK: // 杂花五十K
                case CARD_TYPE.tongHuaWuShiK: // 同花五十K
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

    // 不可用的牌
    BaZhaDan.prototype.getDisabledList = function(hand, cards2, type2, shunType, hasWings, bodyLen) {
        hasWings = true;
        return []; // todo
        
        if (!cards2) {
            return [];
        }

        type2 = type2 || this.getCardType(cards2, shunType, hasWings);
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
                    var body2 = this.analyzeFeiJi(cards2, deckNum, hasWings, bodyLen).body;
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

    // 获取特殊牌型的牌
    BaZhaDan.prototype.getSpclMatrix = function(hand, deckNum) {
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

    // 拆牌提示
    BaZhaDan.prototype.getBreakUpDesc = function(hand, cards, shunType, hasWings) {
        hasWings = true;

        var desc = "";
        var type = this.getCardType(cards, shunType, hasWings);
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
        } else if ((breakUpFlag & 2) > 0) {
            desc = "筒子";
        } else if ((breakUpFlag & 1) > 0) {
            desc = "炸弹";
        }

        return desc;
    }

    // 计算牌分
    BaZhaDan.prototype.getCardScore = function(card) {
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

    // 获取炸弹分
    BaZhaDan.prototype.getZhaScore = function(cards, shunType, hasWings) {
        var type = this.getCardType(cards, shunType, hasWings);
        if (type != CARD_TYPE.zhaDan) {
            return 0;
        }

        if (cards[0] == SMALL_JOKER || cards[0] == BIG_JOKER) {
            if ([3, 4].indexOf(cards.length) >= 0) {
                return cards.length == 3 ? 50 : 150;
            }

            return 0;
        }

        if ([6, 7, 8].indexOf(cards.length) >= 0) {
            return (cards.length - 5) * 50;
        }

        return 0;
    }

    // 获取特殊牌型
    BaZhaDan.prototype.getSpclType = function(cards, shunType, hasWings) {
        hasWings = true;
        return SPCL_TYPE.noType;
        
        switch (this.getCardType(cards, shunType, hasWings)) {
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
    BaZhaDan.prototype.getSpclTypeScore = function(spclType) {
        return spclType2Score[spclType];
    }

    // 统计剩余牌(记牌器)
    BaZhaDan.prototype.statsLeftCards = function(sData, mjhand) {
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
    BaZhaDan.prototype.splitFeiJi = function(cards, hasWings, bodyLen) {
        hasWings = true;
       
        var dict = {};
        for (var i = 0; i < cards.length; i++) {
            var p = _.point(cards[i]);
            dict[p] = dict[p] ? dict[p] + 1 : 1;
        }

        var body = []; // 主体 
        var wing = []; // 翅膀
        var queue = [];
        for (var p in dict) {
            if (dict[p] >= 3 && Number(p) < _.point(SMALL_JOKER)) {
                queue.push(Number(p));
            }   
        }

        for (var i = 0; i < queue.length; i++) {
            queue[i] = _.point(queue[i]);
        }

        queue.sort(function(a, b) {
            return a - b;
        });

        // A 2最大
        var body1 = [];
        var wing1 = [];
        var linkNum = 1;
        var maxLinkNum = 1;
        var maxLinkIdx = -1;
        for (var i = 1; i < queue.length; i++) {
            linkNum = (queue[i] - queue[i - 1] == 1) ? linkNum + 1 : 1;
            if (linkNum > maxLinkNum) {
                maxLinkNum = linkNum;
                maxLinkIdx = i;
            }
        }

        if (maxLinkNum >= (bodyLen || 2)) {
            maxLinkNum = bodyLen || maxLinkNum;
            if (cards.length <= maxLinkNum * 5) {
                var list = queue.slice().splice(maxLinkIdx + 1 - maxLinkNum, maxLinkNum);
                var copy = cards.slice();
                for (var i = 0; i < list.length; i++) {
                    var num = 0;
                    while (num < 3) {
                        for (var j = 1; j <= 4; j++) {
                            var p = list[i];
                            if (p == 1 || p == 2) { // A 2
                                p += 13;
                            } 
                            var idx = copy.indexOf(j * 100 + p);
                            if (idx >= 0) {
                                body1.push(j * 100 + p);
                                copy.splice(idx, 1);
                                num++;
                                if (num >= 3) {
                                    break;
                                }
                            }
                        }

                        // todo 这里没有break 找不到会死循环
                    }
                }

                wing1 = copy;
            }
        }

        // A 2最小
        var body2 = [];
        var wing2 = [];
        if (queue.indexOf(14) >= 0 || queue.indexOf(15) >= 0) {
            for (var i = 0; i < queue.length; i++) {
                if (queue[i] == 14 || queue[i] == 15) { // A 2编码替换
                    queue[i] -= 13;
                }
            }

            queue.sort(function(a, b) {
                return a - b;
            });
        }

        var linkNum = 1;
        var maxLinkNum = 1;
        var maxLinkIdx = -1;
        for (var i = 1; i < queue.length; i++) {
            linkNum = (queue[i] - queue[i - 1] == 1) ? linkNum + 1 : 1;
            if (linkNum > maxLinkNum) {
                maxLinkNum = linkNum;
                maxLinkIdx = i;
            }
        }

        if (maxLinkNum >= (bodyLen || 2)) {
            maxLinkNum = bodyLen || maxLinkNum;
            if (cards.length <= maxLinkNum * 5) {
                var list = queue.slice().splice(maxLinkIdx + 1 - maxLinkNum, maxLinkNum);
                var copy = cards.slice();
                for (var i = 0; i < list.length; i++) {
                    var num = 0;
                    while (num < 3) {
                        for (var j = 1; j <= 4; j++) {
                            var p = list[i];
                            if (p == 1 || p == 2) { // A 2
                                p += 13;
                            } 
                            var idx = copy.indexOf(j * 100 + p);
                            if (idx >= 0) {
                                body2.push(j * 100 + p);
                                copy.splice(idx, 1);
                                num++;
                                if (num >= 3) {
                                    break;
                                }
                            }
                        }

                        // todo 这里没有break 找不到会死循环
                    }
                }

                wing2 = copy;
            }
        }

        body = body2.length > body1.length ? body2 : body1;
        wing = body2.length > body1.length ? wing2 : wing1;
        return {body: body, wing: wing};
    }

    // 三张拆分(主体 带的牌)
    BaZhaDan.prototype.splitSanZhang = function(cards) {
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

    BaZhaDan.prototype.formatPutCard = function(cards, type, shunType, hasWings, bodyLen) {
        type = type || this.getCardType(cards, shunType, hasWings); // type是0会重算一遍
        var list = [];
        switch (type) {
            case CARD_TYPE.danZhang:
            case CARD_TYPE.danWang:
            case CARD_TYPE.duiZi:
            case CARD_TYPE.zhaDan:
                list = cards.slice();
                break;
            case CARD_TYPE.shunZi:
                var queue = this.analyzeShunZi(cards, shunType);
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
                var queue = this.analyzeLianDui(cards, shunType);
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

    BaZhaDan.prototype.checkPut = function(hand, cards) {
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

    BaZhaDan.prototype.formatHandCard = function(cards){
        this.formatSort(cards);
        cards.reverse();
        var obj = {};
        for(var i = 0; i < cards.length; i++){
            var num = cards[i];
            var p = _.point(num);
            if(p == 16 || p == 17){
                if(obj["king"]){
                    obj["king"].push(num);
                }else{
                    obj["king"] = [num];
                }
            }
            else if(obj["key" + p]){
                obj["key" + p].push(num);
            }else{
                obj["key" + p] = [num];
            }
        }

        return obj;
    }

    BaZhaDan.prototype.sortColumnArr = function(cards){
        var len = cards.length;
        var obj = {};
        for(var i = 0; i < len; i++){
            var p = _.point(cards[i]._info.type);
            if(obj["key" + p]){
                obj["key" + p] = obj[p] + 1;
            }else{
                obj["key" + p] = 1;
            }
        }
        cards.sort(function(c1, c2){
            var p1 = _.point(c1._info.type);
            var p2 = _.point(c2._info.type);
            if(obj["key" + p1] > obj["key" + p2]){
                return -1;
            }else if(obj["key" + p1] < obj["key" + p2]){
                return 1;
            }else{
                if (p1 == p2) {
                    return c2._info.type - c1._info.type;
                }
                return p2 - p1;
            }
        });
    }

    if (typeof(MjClient) != "undefined") {
        MjClient.majiang_BaZhaDan = new BaZhaDan();
    } else {
        module.exports = BaZhaDan;
    }

    function test() {
        var a = new BaZhaDan();
        // var cards1 = [215, 215, 215, 315, 315, 315, 415, 415, 115, 115, 115];
        var cards1 = [112,411,311,310,110,309,208,407,307,207,206,405,205,105,404,404,304,403,303,415,315,214,114,413,213,113,412];
        var cards2 = [415, 415, 516, 516];
        var cards1 = [408,206,104,304,115,408,312,213,111,404,214,204,516,213,306,308,104,107,108,207,406,406];
        // console.log(a.hintPutCard(cards1, null, null, 1, true, null));



        var cards2 = [115, 115, 114, 114];
        var cards1 = [214, 215, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 516, 214, 215, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113];
        var cards1 = [415,115,115,414,314,114,403,303,203,107];

        var cards1 = [415,215,115,214,114,114,213,211,306,106,404,204,403,403,103];
        var cards2 = [104, 404, 404, 107, 207, 307, 208, 308, 308];
        // console.log(a.splitFeiJi(cards1, true, 3));
        

        // console.log(a.getCardType(cards2, 1, true));
        // console.log(a.splitFeiJi(cards1));
        // console.log(a.hintPutCard(cards2, cards1, null, 1, true, 3));
        // console.log(a.isBigger(cards2, cards1, null, 0, true, 3));
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
