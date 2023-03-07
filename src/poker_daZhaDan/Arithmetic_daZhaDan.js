// 打炸弹算法
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
        zaHuaWuShiK: 6, // 杂花5-10-k
        tongHuaWuShiK: 7,   // 同花5-10-k
        zhaDan: 8,      // 炸弹
    };

    // 顺子队列
    var SHUN_QUEUE = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    
    function DaZhaDan() {
        this.CARD_TYPE = CARD_TYPE;
        this.sortType = 1;
        this.handCount = 27;
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
    DaZhaDan.prototype.randomCards = function(areaSelectMode) {
        var tzcards = [
            103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, // 方块3-K A 2
            203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, // 梅花
            303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, // 红桃
            403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415  // 黑桃
        ];

        tzcards.push(SMALL_JOKER, BIG_JOKER);

        var cards = [];
        for (var i = 0; i < 2; i++) {
            cards = cards.concat(tzcards);
        }

        shuffleArray(cards);
        return cards;
    };

    // 排序
    DaZhaDan.prototype.formatSort = function(cards) {
        cards.sort(function(a, b) {
            if (_.point(a) == _.point(b)) {
                return a - b;
            }

            return _.point(a) - _.point(b);
        });
    }

    DaZhaDan.prototype.sort2 = function(cards, options) {
        var hasSanWangZha = options.hasSanWangZha;
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
        if (jokerList.length >= (hasSanWangZha ? 3 : 4)) {
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


        for (var i = 0; i < pHash[3].length; i++) {
            rtn = rtn.concat(getCardsByNum(pHash[3][i], 3));
        }

        if (jokerList.length < (hasSanWangZha ? 3 : 4)) {
            rtn = rtn.concat(jokerList);
        }

        this.formatSort(rtn);

        for (var i = 0; i < wuShiKList.length; i++) {
            rtn = rtn.concat(wuShiKList[i]);
        }

        for (var i = 0; i < zhaDanList.length; i++) {
            rtn = rtn.concat(zhaDanList[i].cards);
        }

        return rtn;
    };

    DaZhaDan.prototype.sortCard = function(cards, options, sortType) {
        this.sortType = sortType || (this.sortType % 2 + 1);
        switch (this.sortType) {
            case 1:
                this.formatSort(cards);
                return cards;
            case 2:
                return this.sort2(cards, options);
        }
    }

    // 是否单张
    DaZhaDan.prototype.isDanZhang = function(cards) {
        return cards.length == 1;
    }
    
    // 是否对
    DaZhaDan.prototype.isDuiZi = function(cards) {
        if (cards.length != 2) {
            return false;
        }

        return _.point(cards[0]) == _.point(cards[1]);
    }

    // 分析三张主体 翅膀
    DaZhaDan.prototype.analyzeSanZhang = function(cards) {
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
    DaZhaDan.prototype.isSanZhang = function(cards, options, handCount) {
        var hasWings = options.hasWings;
        if (cards.length < 3 || cards.length > 5) {
            return false;
        }

        if (this.isZhaDan(cards, options)) {
            return false;
        }

        var struct = this.analyzeSanZhang(cards);
        if (struct.body == -1) {
            return false;
        }

        if (!hasWings) {
            return struct.wing.length == 0;
        }

        if (hasWings && (struct.wing.length == 2 || handCount == cards.length || handCount == -1)) {
            return true;
        }

        return false;
    }

    // 分析顺子连牌队列
    DaZhaDan.prototype.analyzeShunZi = function(list, shunType) {
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

        if (queue[queue.length - 1] > (shunType == 0 ? 14 : 15)) {
            return [];
        }

        for (var i = 1; i < queue.length; i++) {
            if (queue[i] - queue[i - 1] != 1) {
                return [];
            }
        }

        return queue;
    };

    // 是否顺子
    DaZhaDan.prototype.isShunZi = function(cards, shunType, hasShun) {
        if (!hasShun) {
            return false;
        }

        if (cards.length < 5) {
            return false;
        }

        var queue = this.analyzeShunZi(cards, shunType);

        return (queue.length > 0 && queue[queue.length - 1] != 15)
    };

    DaZhaDan.prototype.analyzeLianDui = function(cards, shunType) {
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
    DaZhaDan.prototype.isLianDui = function(cards, shunType) {
        if (cards.length  < 4 || cards.length % 2 != 0) {
            return false;
        }

        if (this.analyzeLianDui(cards, shunType).length > 0) {
            return true;
        }

        return false;
    }

    // 分析飞机主体 翅膀
    DaZhaDan.prototype.analyzeFeiJi = function(cards, shunType, hasWings, handCount, bodyLen) {
        var dict = {};
        for (var i = 0; i < cards.length; i++) {
            var p = _.point(cards[i]);
            dict[p] = dict[p] ? dict[p] + 1 : 1;
        }

        var body = []; // 主体 
        var wing = []; // 翅膀
        var list = [];
        for (var p in dict) {
            if (dict[p] >= 3 && Number(p) <= (shunType == 0 ? 14 : 15)) {
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

        var body = [];
        var wing = [];
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
            if (hasWings) {
                if (!(handCount == cards.length || handCount == -1)) {
                    if (Math.floor(cards.length / 5) === cards.length / 5 && maxLinkNum >= cards.length / 5) {
                        maxLinkNum = cards.length / 5;
                    }
                }
            }

            body = queue.slice().splice(maxLinkIdx + 1 - maxLinkNum, maxLinkNum);
        }

        if (body.length * 5 < cards.length) {
            body = [];
        } else if (!hasWings && body.length * 3 != cards.length) {
            body = [];
        } else if (hasWings && !(body.length * 5 == cards.length || handCount == cards.length || handCount == -1)) {
            body = [];
        }

        return {body: body, wing: []};
    }

    // 是否飞机
    DaZhaDan.prototype.isFeiJi = function(cards, shunType, hasWings, handCount) {
        if (cards.length < 6) {
            return false;
        }

        var struct = this.analyzeFeiJi(cards, shunType, hasWings, handCount);
        if (struct.body.length < 2) {
            return false;
        }

        return true;
    }

    // 是否同花5-10-k
    DaZhaDan.prototype.isTongHuaWuShiK = function(cards) {
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
    DaZhaDan.prototype.isZaHuaWuShiK = function(cards) {
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

    // 是否炸弹(王2张及3上 普通牌4张 )
    DaZhaDan.prototype.isZhaDan = function(cards, options) {
        var hasSanWangZha = options.hasSanWangZha;

        if (this.isWangZha(cards, options)) {
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
    DaZhaDan.prototype.isWangZha = function(cards, options) {
        var hasSanWangZha = options.hasSanWangZha;

        if (cards.length <= 2) {
            return false;
        }

        if (!hasSanWangZha && cards.length == 3) {
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
    DaZhaDan.prototype.getCardType = function(cards, options, handCount) {
        var shunType = options.shunType;
        var hasWings = options.hasWings;
        var hasShun = options.hasShun;
        var hasSanWangZha = options.hasSanWangZha;

        if (this.isDanZhang(cards)) {
            return CARD_TYPE.danZhang;
        }

        if (this.isDuiZi(cards)) {
            return CARD_TYPE.duiZi;
        }

        if (this.isZhaDan(cards, options)) {
            return CARD_TYPE.zhaDan;
        }

        if (this.isSanZhang(cards, options, handCount)) {
            return CARD_TYPE.sanZhang;
        }

        if (this.isShunZi(cards, hasWings, hasShun)) {
            return CARD_TYPE.shunZi;
        }

        if (this.isLianDui(cards, shunType)) {
            return CARD_TYPE.lianDui;
        }

        if (this.isFeiJi(cards, shunType, hasWings, handCount)) {
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
    DaZhaDan.prototype.getZhaDanValue = function(cards) {
        var value;
        if (cards[0] == BIG_JOKER || cards[0] == SMALL_JOKER) {
            value = cards.length == 4 ? 750 : 450;
            
        } else {
            value = cards.length * 100 + _.point(cards[0]);
        }

        return value;
    }

    // var CARD_TYPE = {
    //     noType: -1,     // 无牌型
    //     danZhang: 0,    // 单张
    //     duiZi: 1,       // 对子
    //     sanZhang: 2,    // 三张
    //     shunZi: 3,      // 顺子
    //     lianDui: 4,     // 连对
    //     feiJi: 5,       // 飞机
    //     zaHuaWuShiK: 6, // 杂花5-10-k
    //     tongHuaWuShiK: 7,   // 同花5-10-k
    //     zhaDan: 9,      // 炸弹
    // };

    // 牌1是否比牌2大
    DaZhaDan.prototype.isBigger = function(cards1, cards2, type2, options, handCount, bodyLen) {
        var shunType = options.shunType;
        var hasWings = options.hasWings;
        var hasShun = options.hasShun;
        var hasSanWangZha = options.hasSanWangZha;
        
        var type1 = this.getCardType(cards1, options, handCount);
        type2 = type2 || this.getCardType(cards2, options, -1);
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
                var body1 = this.analyzeFeiJi(cards1, shunType, hasWings, handCount, bodyLen).body;
                var body2 = this.analyzeFeiJi(cards2, shunType, hasWings, -1, bodyLen).body;
                if (body1.length != body2.length) {
                    return false;
                }

                return body1[0] > body2[0];
            case CARD_TYPE.zaHuaWuShiK: // 杂花五十K
                return false;
            case CARD_TYPE.tongHuaWuShiK: // 同花五十K
                return _.suit(cards1[0]) > _.suit(cards2[0]);
            case CARD_TYPE.zhaDan: // 炸弹
                return this.getZhaDanValue(cards1) > this.getZhaDanValue(cards2);
        }
    }

    // 是否要的起
    DaZhaDan.prototype.canBeat = function(hand, cards2, type2, options, bodyLen) {
        var shunType = options.shunType;
        var hasWings = options.hasWings;
        var hasShun = options.hasShun;
        var hasSanWangZha = options.hasSanWangZha;

        type2 = type2 || this.getCardType(cards2, options, -1);
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

            if (c == SMALL_JOKER || c == BIG_JOKER) {
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
        var tongHuaList = [];
        var zaHuaFlag = false;
        for (var suit in SUIT_TYPE) {
            if (c_dict[SUIT_TYPE[suit] * 100 + 5] > 0 && c_dict[SUIT_TYPE[suit] * 100 + 10] > 0 && c_dict[SUIT_TYPE[suit] * 100 + 13] > 0) {
                tongHuaList.push([SUIT_TYPE[suit] * 100 + 5, SUIT_TYPE[suit] * 100 + 10, SUIT_TYPE[suit] * 100 + 13]);
            }
        }

        if (tongHuaList.length <= 0) {
            if (p_dict[5] > 0 && p_dict[10] > 0 && p_dict[13] > 0) {
                zaHuaFlag = true;
            } 
        }

        if (type2 < CARD_TYPE.zaHuaWuShiK) { // 杂花五十K以下牌型
            if (tongHuaList.length > 0 || zaHuaFlag || (jokerList.length >= (hasSanWangZha ? 3 : 4)) || zhaDanList.length > 0) {
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
                    var queue = this.analyzeShunZi(cards2, shunType);
                    value = queue[queue.length - 1];
                    break;
                case CARD_TYPE.lianDui: // 连对
                    list = pHash[2].concat(pHash[3]);
                    linkNum = cards2.length / 2;
                    var queue = this.analyzeLianDui(cards2, shunType);
                    value = queue[queue.length - 1];
                    break;
                case CARD_TYPE.feiJi: // 飞机
                    list = pHash[3];
                    var body2 = this.analyzeFeiJi(cards2, shunType, hasWings, -1, bodyLen).body;
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

                if (shunType == 0 && copy.indexOf(15) >= 0) {
                    copy.splice(copy.indexOf(15), 1);
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
                return (tongHuaList.length > 0 || jokerList.length >= (hasSanWangZha ? 3 : 4) || zhaDanList.length > 0);
            case CARD_TYPE.tongHuaWuShiK: // 同花五十K
                if (jokerList.length >= (hasSanWangZha ? 3 : 4) || zhaDanList.length > 0) {
                    return true;
                }

                for (var i = 0; i < tongHuaList.length; i++) {
                    if (_.suit(tongHuaList[i][0]) > _.suit(cards2[0])) {
                        return true;
                    }
                }
            case CARD_TYPE.zhaDan: // 炸弹
                var value = this.getZhaDanValue(cards2);
                if (jokerList.length >= (hasSanWangZha ? 3 : 4) && this.getZhaDanValue(jokerList) > value) {
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
    DaZhaDan.prototype.hintPutCard = function(hand, cards2, type2, options, bodyLen) {
        var shunType = options.shunType;
        var hasWings = options.hasWings;
        var hasShun = options.hasShun;
        var hasSanWangZha = options.hasSanWangZha;
        var shun = SHUN_QUEUE.slice();

        if (shunType == 1) {
            shun.push(15);
        }

        var hintMatrix = [];
        if (cards2) {
            type2 = type2 || this.getCardType(cards2, options, -1);
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

        var tongHuaList = []; // 同花五十K
        var zaHuaList = [];  // 杂花五十K

        function out(row) {
            for (var i = 0; i < row.length; i++) {
                c_dict[row[i]]--;
                p_dict[_.point(row[i])]--;
            }
        } 

        // 获取一定张数的特定牌点的牌
        function getCardsByNum(point, needNum) {
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
                    // wuShiKList.push(row);
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
                zaHuaList.push(row);
                // wuShiKList.push(row);
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
        if (jokerList.length >= (hasSanWangZha ? 3 : 4)) {
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
            allZhaMatrix[1] = tongHuaList;
        }

        if (zaHuaFlag) {
            allZhaMatrix[0] = zaHuaList;
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
            // var SHUN_QUEUE = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
            var idx = shun.indexOf(list[i]);
            if ((idx > 0 && list.indexOf(shun[idx - 1]) >= 0) || (idx < shun.length - 1 && list.indexOf(shun[idx + 1]) >= 0)) {
                return true;
            }

            return false;
        }

        if (!cards2) { // 回合第一首牌
            var type = this.getCardType(hand, options, hand.length);
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

            if (jokerList.length < (hasSanWangZha ? 3 : 4)) {
                if (jokerList.length == 1) {
                    sameTypeMatrix.push([jokerList[0]]);
                } 

                if (jokerList.length >= 2) {
                    if (jokerList[0] != jokerList[1]) {
                        sameTypeMatrix.push([jokerList[0]]);
                    }

                    if (jokerList[jokerList.length - 1] != jokerList[jokerList.length -2]) {
                        sameTypeMatrix.push([jokerList[jokerList.length - 1]]);
                    }
                }
            }

            // 对子
            for (var i = 0; i < pHash[2].length; i++) {
                if (!canLink(pHash[2], i)) {
                    var point = pHash[2][i];
                    var cards = getCardsByNum(point, 2);
                    sameTypeMatrix.push(cards);
                }
            }

            if (jokerList.length < (hasSanWangZha ? 3 : 4) && jokerList.length >= 2) {
                if (jokerList[0] == jokerList[1]) {
                    sameTypeMatrix.push([jokerList[0], jokerList[0]]);
                }

                if (jokerList.length == 3 && jokerList[1] == jokerList[2]) {
                    sameTypeMatrix.push([jokerList[1], jokerList[1]]);
                }
            }

            // 三张
            for (var i = 0; i < pHash[3].length; i++) {
                if (!canLink(pHash[3], i)) {
                    var point = pHash[3][i];
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
            var list = [];
            if (hasShun) {
                list = pHash[1].concat(pHash[2]);
            }
            
            list.sort(function(a, b) {
                return a - b;
            });

            if (list[list.length - 1] == 15) {
                list.pop();
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
                        pushLinkCards(list, pos, nowLinkNum, 2);
                    }
                    nowLinkNum = 1;
                }

                if (i == list.length - 1 && nowLinkNum >= 2) { // 收尾
                    pushLinkCards(list, pos, nowLinkNum, 2);
                }
            }

            // var SHUN_QUEUE = [14, 15, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

            // 飞机
            list = pHash[3].slice();
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
                        pushLinkCards(list, pos, nowLinkNum, 3);
                    }
                    nowLinkNum = 1;
                }

                if (i == list.length - 1 && nowLinkNum >= 2) { // 收尾
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
                var type = this.getCardType(hand, options, hand.length);
                if ((type == CARD_TYPE.sanZhang || type == CARD_TYPE.feiJi) && this.isBigger(hand, cards2, type2, options, hand.length, bodyLen)) {
                    hand = hand.slice();
                    this.formatSort(hand);
                    return [hand];
                }
            }
            
            switch (type2) {
                case CARD_TYPE.danZhang: // 单张
                    needNum = 1;
                    list = pHash[1];

                    if (jokerList.length < (hasSanWangZha ? 3 : 4)) {
                        if (jokerList.indexOf(SMALL_JOKER) >= 0) {
                            list.push(_.point(SMALL_JOKER));
                        }

                        if (jokerList.indexOf(BIG_JOKER) >= 0) {
                            list.push(_.point(BIG_JOKER));
                        }
                    }
                    
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

                    if (jokerList.length < (hasSanWangZha ? 3 : 4) && jokerList.length >= 2) {
                        if (jokerList[0] == jokerList[1]) {
                            list.push(_.point(jokerList[0]));
                        }

                        if (jokerList.length == 3 && jokerList[1] == jokerList[2]) {
                            list.push(_.point(jokerList[1]));
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
                    var queue = this.analyzeShunZi(cards2, shunType);
                    value = queue[queue.length - 1];
                    break;
                case CARD_TYPE.lianDui: // 连对
                    needNum = 2;
                    list = pHash[2].concat(pHash[3]);
                    linkNum = cards2.length / 2;
                    var queue = this.analyzeLianDui(cards2, shunType);
                    value = queue[queue.length - 1];
                    break;
                case CARD_TYPE.feiJi: // 飞机
                    needNum = 3;
                    list = pHash[3].slice();
                    var body2 = this.analyzeFeiJi(cards2, shunType, hasWings, -1, bodyLen).body;
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
            } else { // 顺子 连对 飞机
                var nowLinkNum = 1;
                list.sort(function(a, b) {
                    return a - b;
                });

                for (var i = 1; i < list.length; i++) {
                    if (list[i] == 15 && shunType == 0) {
                        continue;
                    }

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
                    break;
                case CARD_TYPE.tongHuaWuShiK: // 同花五十K
                    for (var i = 0; i < tongHuaList.length; i++) {
                        if (_.suit(tongHuaList[i][0]) > _.suit(cards2[0])) {
                            sameTypeMatrix.push(tongHuaList[i]);
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

    // 拆牌提示
    DaZhaDan.prototype.getBreakUpDesc = function(hand, cards, options) {
        var shunType = options.shunType;
        var hasWings = options.hasWings;
        var hasShun = options.hasShun;
        var hasSanWangZha = options.hasSanWangZha;

        var desc = "";
        var type = this.getCardType(cards, options, hand.length);
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
    DaZhaDan.prototype.getCardScore = function(card) {
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
    DaZhaDan.prototype.getZhaScore = function(cards, options) {
        var shunType = options.shunType;
        var hasWings = options.hasWings;
        var hasShun = options.hasShun;
        var hasSanWangZha = options.hasSanWangZha;
        var hasFiveXi = options.hasFiveXi;
        var hasSanWangXi = options.hasSanWangXi;

        var type = this.getCardType(cards, options, -1);
        if (type != CARD_TYPE.zhaDan) {
            return 0;
        }

        if (cards[0] == SMALL_JOKER || cards[0] == BIG_JOKER) {
            if (cards.length == 4) {
                return 150;
            }

            if (hasSanWangXi && cards.length == 3) {
                return 50;
            }
        }

        if ([6, 7, 8].indexOf(cards.length) >= 0) {
            return (cards.length - 4) * 50;
        }

        if (hasFiveXi && cards.length == 5) {
            return 50;
        }

        return 0;
    }

    // 统计剩余牌(记牌器)
    DaZhaDan.prototype.statsLeftCards = function(sData, mjhand) {
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
    DaZhaDan.prototype.splitFeiJi = function(cards, shunType, hasWings, bodyLen) {
        if (!hasWings) {
            this.formatSort(cards.slice());
            return {body: cards, wing: []};
        }
 
        var dict = {};
        for (var i = 0; i < cards.length; i++) {
            var p = _.point(cards[i]);
            dict[p] = dict[p] ? dict[p] + 1 : 1;
        }

        var body = []; // 主体 
        var wing = []; // 翅膀
        var queue = [];
        for (var p in dict) {
            if (dict[p] >= 3 && Number(p) <= (shunType == 0 ? 14 : 15)) {
                queue.push(Number(p));
            }   
        }

        queue.sort(function(a, b) {
            return a - b;
        });

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
            maxLinkNum = bodyLen || maxLinkNum; // 这里不用做翅膀合法验证且bodyLen参数不为空
            var list = queue.slice().splice(maxLinkIdx + 1 - maxLinkNum, maxLinkNum);
            var copy = cards.slice();
            for (var i = 0; i < list.length; i++) {
                var num = 0;
                while (num < 3) {
                    for (var j = 1; j <= 4; j++) {
                        var p = list[i];
                        var idx = copy.indexOf(j * 100 + p);
                        if (idx >= 0) {
                            body.push(j * 100 + p);
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

            wing = copy;
        }

        return {body: body, wing: wing};
    }

    // 三张拆分(主体 带的牌)
    DaZhaDan.prototype.splitSanZhang = function(cards) {
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

    DaZhaDan.prototype.formatPutCard = function(cards, type, options, bodyLen) {
        var shunType = options.shunType;
        var hasWings = options.hasWings;
        var hasShun = options.hasShun;
        var hasSanWangZha = options.hasSanWangZha;

        type = type || this.getCardType(cards, options, -1); // type是0会重算一遍
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

    DaZhaDan.prototype.checkPut = function(hand, cards) {
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

    //获取不能找队友的牌
    DaZhaDan.prototype.getNotFindCards = function(hand) {
        var cards = [];
        var hands = hand.slice();
        var dict = {};
        for (var i = 0; i < hands.length; i++) {
            var c = hand[i];
            dict[c] = dict[c] ? dict[c] + 1 : 1; 
        }
        for (var c in dict) {
            if (dict[c] >= 2) {
                cards.push(parseInt(c));
            }
        }
        return cards;
    }

    if (typeof(MjClient) != "undefined") {
        MjClient.majiang_DaZhaDan = new DaZhaDan();
    } else {
        module.exports = DaZhaDan;
    }

    function test() {
        var a = new DaZhaDan();
        // var cards1 = [215, 215, 215, 315, 315, 315, 415, 415, 115, 115, 115];
        var cards1 = [112,411,311,310,110,309,208,407,307,207,206,405,205,105,404,404,304,403,303,415,315,214,114,413,213,113,412];
        var cards2 = [403, 403, 404, 404];
        var cards1 = [516,308,305,307,314,110,408,207,310,206,104,211,405,412,313,303,109,406,412,114,415,404,209,205];

        var cards1 = [315,115,303,314,405,108,109,314,103,403,407,207,112,205,212,315];
        // var cards2 = [105, 110, 113];

        var options = {
            hasBaoPai:false,
            hasFiveXi:false,
            hasSanWangXi:false,
            hasSanWangZha:false,
            hasWings: true,
            hasShun: false,
            hasSanWangZha: false,
            // isAllXiFen:true,
            isShowLeft:false,
            payWay:0,
            shunType: 0
        }
        console.log(a.hintPutCard(cards1, [413,413,412,212], 4, options, null));

        // var cards1 = [516,208,315,213,311,215,109,403,304,113,405,406,413,203,107,114,106,403,303,314,409,413,211,104,207,411,309];
        // var cards2 = [414,414,314,114];
        // (pl.mjhand, cards, type, tData.areaSelectMode, tData.bodyLen);
        console.log(a.canBeat(cards1, [413,413,412,212], 4, options, null));

        // var cards1 = [405, 405, 405, 410, 413, 210, 403, 311,215,109,403,304,113, 406,413,203,107, 114];
        // console.log(a.sort2(cards1).toString());

        // var cards1 = [303, 304, 305, 306, 307];
        // console.log(a.getCardType(cards1, 1, true, false, 28));


        // var cards2 = [115, 115, 114, 114];
        // var cards1 = [214, 215, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 516, 214, 215, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113];
       


        // console.log(a.splitFeiJi(cards1, true, 2));
        

        // console.log(a.getCardType(cards1, 1, true, true, 28));
        // console.log(a.isFeiJi(cards1, 1, true, 28));

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
