// 96扑克算法
(function() {

    function PaoHuZi96Poker() {
        this.handCount = 21;
    };

    var HuXiDict = {
        dan:{su:0,hun:1},
        peng:{black:2,red:3},
        shao:{black:4,red:6},
        zou:{black:[6,8],red:[10,12]},
        shuangLongBaoZhu:28,
    }

    var AREA_CONFIG = {
        //永顺
        0:{
            hunCards:[101,102,103,104,105,106,107,108,109],
        }
    };

    var SCORE_CONFIG = {
        //0:16逢升 1:11逢升 2:大小胡
        3:{
            0:{
                huXiToScore:{15:1,16:2,21:3,26:4,31:5,36:6,41:7,46:8,51:9,56:10},
                shuangLongBaoZhuScore:10,
            },
            2:{
                huXiToScore:{15:1,32:10},
                shuangLongBaoZhuScore:10,
            }
        },
        4:{
            1:{
                huXiToScore:{10:1,11:2,16:3,21:4,26:5,31:6,36:7,41:8,46:9,51:10},
                shuangLongBaoZhuScore:10,
            },
            2:{
                huXiToScore:{10:1,24:2},
                shuangLongBaoZhuScore:2,
            }
        },
        2:{
            1:{
                huXiToScore:{10:1,11:2,16:3,21:4,26:5,31:6,36:7,41:8,46:9,51:10},
                shuangLongBaoZhuScore:10,
            },
            2:{
                huXiToScore:{10:1,24:2},
                shuangLongBaoZhuScore:2,
            }
        },
        suHuScore:10,
        zhuaZhuScore:8,
    }

    PaoHuZi96Poker.prototype.getZhuaZhuScore = function(tb){
        return SCORE_CONFIG.zhuaZhuScore;
    };

    PaoHuZi96Poker.prototype.randomCards = function(areaSelectMode) {
        //从A—9、J——K 96张 2副牌
        var cards = [
            101,102,103,104,105,106,107,108,109,110,111,112,//方块
            201,202,203,204,205,206,207,208,209,210,211,212,//梅花
            301,302,303,304,305,306,307,308,309,310,311,312,//红桃
            401,402,403,404,405,406,407,408,409,410,411,412, //黑桃
            101,102,103,104,105,106,107,108,109,110,111,112,//方块
            201,202,203,204,205,206,207,208,209,210,211,212,//梅花
            301,302,303,304,305,306,307,308,309,310,311,312,//红桃
            401,402,403,404,405,406,407,408,409,410,411,412 //黑桃
        ];

        shuffleArray(cards);
        return cards;
    };

    PaoHuZi96Poker.prototype.cardsCount = function(tb) {
        return 96;
    };

    PaoHuZi96Poker.prototype.value = function(card) {
        var value = card;
        if (value > 300){
            value -= 200;
        }
        return value;
    };

    PaoHuZi96Poker.prototype.sameValue = function(card1, card2) {
        return card1 == card2 || Math.abs(card1 - card2) == 200;
    };

    PaoHuZi96Poker.prototype.getHandCardCount = function(pl, card) {
        return this.getCardCount(pl.mjhand, card);
    };

    //支持二维数组
    PaoHuZi96Poker.prototype.getCardCount = function(cards, card) {
        var count = 0;
        for (var i = 0; i < cards.length; i++) {
            if (cards[i].length) {
                count += this.getCardCount(cards[i], card);
            } else if (this.sameValue(cards[i], card)) {
                count++;
            }
        }
        return count;
    };

    PaoHuZi96Poker.prototype.removeCards = function(cards, removes) {
        for (var i = 0; i < removes.length; i++) {
            var card = removes[i];
            if (cards.indexOf(card) >= 0) {
                cards.splice(cards.indexOf(card), 1);
            }
        }
        return cards;
    };

    PaoHuZi96Poker.prototype.getCards = function(cards, values) {
        cards = cards.slice();
        var result = [];
        for (var i = 0; i < values.length; i++) {
            var card = this.value(values[i]);
            if (cards.indexOf(card) >= 0) {
                cards.splice(cards.indexOf(card), 1);
                result.push(card);
            }else if (cards.indexOf(card + 200) >= 0){
                cards.splice(cards.indexOf(card + 200), 1);
                result.push(card + 200);
            }
        }
        return result;
    };

    PaoHuZi96Poker.prototype.includeCard = function(cards, card) {
        for (var i = 0; i < cards.length; i++) {
            if (this.sameValue(cards[i], card)) {
                return true;
            }
        }
        return false;
    };

    PaoHuZi96Poker.prototype.canPutCard = function(pl, card) {
        if (pl.mjhand.indexOf(card) < 0) {
            return false;
        }

        if (this.includeCard(pl.canNotPutCard, card)) {
            return false;
        }

        var groupIdx = this.getGroupIdx(card);
        var stats = {};
        for (var i = 0; i < 3; i++) {
            stats[groupIdx + i] = this.getCardCount(pl.mjhand, groupIdx + i);
        }

        for (var c in stats) {
            if (stats[c] >= 3) {
                stats[c] = 0;
            }
        }

        //一句话
        while (stats[groupIdx] > 0 && stats[groupIdx + 1] > 0 && stats[groupIdx + 2] > 0) {
            stats[groupIdx]--;
            stats[groupIdx + 1]--;
            stats[groupIdx + 2]--;
        }

        if (stats[this.value(card)] > 0) {
            return true;
        }
        return false;
    };

    PaoHuZi96Poker.prototype.getRowValue = function(row) {
        if (row.length == 2) { // 贴
            return this.value(row[0]) * 10 + 1;
        }

        if (this.value(row[0]) == this.value(row[1])) { // 坎
            return this.value(row[0]) * 10 + 2;
        }

        return this.value(row[0]) * 10 + 3;
    };

    //判断荤牌
    PaoHuZi96Poker.prototype.isHun = function(tb, card) {
        var hunCards = AREA_CONFIG[tb.tData.areaSelectMode.area].hunCards;
        return hunCards.indexOf(this.value(card)) >= 0;
    };

    PaoHuZi96Poker.prototype.isRed = function(card) {
        //return Math.floor(card / 100) % 2 == 1;
        //规则1.1修正: 红JQK算息同黑素牌
        return (card % 100 < 10) && (Math.floor(card / 100) % 2 == 1);
    };

    PaoHuZi96Poker.prototype.getGroupIdx = function(card) {
        var value = this.value(card);
        var groupIdx = Math.floor(value / 100) * 100 +  Math.floor((value % 100 - 1) / 3) * 3 + 1;
        return groupIdx;
    };

    PaoHuZi96Poker.prototype.getGroupCards = function(cards, card) {
        var groupCards = [];
        var groupIdx = this.getGroupIdx(card);
        for (var i = 0; i < cards.length; i++) {
            var value = this.value(cards[i]);
            if (value - groupIdx < 3 && value - groupIdx >= 0) {
                groupCards.push(cards[i]);
            }
        }
        return groupCards;
    };

    PaoHuZi96Poker.prototype.getGroupCountByCard = function(cards, card) {
        var groupIdx = this.getGroupIdx(card);
        var count = 0;
        for (var i = 0; i < cards.length; i++) {
            var value = this.value(cards[i]);
            if (value - groupIdx < 3 && value - groupIdx >= 0) {
                count++;
            }
        }
        return count;
    };

    //坎 吃 贴 目前按产品的意思是有优先级的 因为坎不能拆
    PaoHuZi96Poker.prototype.getAllHuMatrix = function(hand, card, qieCount, mjchi) {
        var matrix = [];
        var singleCard;  //手余单排凑桌面句为2贴
        qieCount = qieCount || 0;
        var hand = hand.slice();
        if (card > 0) {
            hand.push(card);
        }

        // hand.sort(function(a, b) {
        //     return this.value(a) - this.value(b);
        // }.bind(this));

        //获取唯一的单牌
        var self = this;
        var getSingleCard = function(value) {
            for (var i = 0; i < hand.length; i++) {
                if(self.sameValue(hand[i], value)) {
                    return hand[i];
                }
            }
        }

        var groupCards = {};
        var dict = {};
        for (var i = 0; i < hand.length; i++) {
            var c = hand[i];
            var idx = this.getGroupIdx(c);
            var value = this.value(c);
            if (!groupCards[idx]) {
                groupCards[idx] = {};
                groupCards[idx][idx] = [];
                groupCards[idx][idx + 1] = [];
                groupCards[idx][idx + 2] = [];
            }
            groupCards[idx][value].push(c);
        }

        for (k in groupCards) {
            var idx = Number(k);
            var dict = groupCards[k];
            for (var k in dict) {
                var c = Number(k);
                if (dict[c].length > 2) {
                    matrix.push(dict[c].slice(0, 3));
                    dict[c].splice(0, 3);
                }
            }

            while (dict[idx].length + dict[idx + 1].length + dict[idx + 2].length != 4 &&
                dict[idx].length > 0 && dict[idx + 1].length > 0 && dict[idx + 2].length > 0) {
                matrix.push([dict[idx][0], dict[idx + 1][0], dict[idx + 2][0]]);
                dict[idx].splice(0, 1);
                dict[idx + 1].splice(0, 1);
                dict[idx + 2].splice(0, 1);
            }

            if (dict[idx].length + dict[idx + 1].length + dict[idx + 2].length == 4 &&
                dict[idx].length < 3 && dict[idx + 1].length < 3 && dict[idx + 2].length < 3) {

                var qieMatrix = [];
                var qieArr = [[idx, idx+1], [idx, idx+2], [idx+1, idx+2]];
                for (var i = 0; i < qieArr.length; i++) {
                    var _qie = qieArr[i];
                    if (dict[_qie[0]].length > 0 && dict[_qie[1]].length > 0) {
                        var dict1 = this.clone(dict);
                        dict1[_qie[0]].splice(0, 1);
                        dict1[_qie[1]].splice(0, 1);
                        if (dict1[idx].length == 1 || dict1[idx + 1].length == 1 || dict1[idx + 2].length == 1) {
                            qieMatrix.push([dict[_qie[0]][0], dict[_qie[1]][0]]);
                            qieMatrix.push([].concat(dict1[idx]).concat(dict1[idx + 1]).concat(dict1[idx + 2]));
                            break;
                        }
                    }
                }

                if (qieMatrix.length == 2) {
                    matrix.push(qieMatrix[0]);
                    matrix.push(qieMatrix[1]);
                    dict[idx] = [];
                    dict[idx + 1] = [];
                    dict[idx + 2] = [];
                    qieCount += 2;
                }
            }

            if (dict[idx].length + dict[idx + 1].length + dict[idx + 2].length == 2 &&
                (dict[idx].length == 1 || dict[idx + 1].length == 1 || dict[idx + 2].length == 1)) {
                var row = [].concat(dict[idx]).concat(dict[idx + 1]).concat(dict[idx + 2]);
                matrix.push(row);
                dict[idx] = [];
                dict[idx + 1] = [];
                dict[idx + 2] = [];
                qieCount++;
            }

            //v1.1新规则.增加贴的组合 added by zzj 2019.7.26 start
            if (dict[idx].length + dict[idx + 1].length + dict[idx + 2].length == 1 && mjchi.length > 0) {
                //和桌面句牌凑贴口
                var single = dict[idx][0] || dict[idx + 1][0] || dict[idx + 2][0];
                var sIdx = this.getGroupIdx(single);
                for (var t = 0; t < mjchi.length; t++) {
                    var tIdx = this.getGroupIdx(mjchi[t].eatCards[0]); 
                    if (sIdx == tIdx) {
                        dict[idx] = [];
                        dict[idx + 1] = [];
                        dict[idx + 2] = [];
                        qieCount += 2;
                        singleCard = getSingleCard(single);
                        break;
                    }
                }
            }
            //end

            if (dict[idx].length + dict[idx + 1].length + dict[idx + 2].length != 0 || qieCount > 2) {
                return {matrix:[], single:singleCard};
            }
        }

        if (qieCount == 2) {
            return {matrix:[matrix], single:singleCard};
        }
        return {matrix:[], single:singleCard};
    }

    PaoHuZi96Poker.prototype.getLong = function(pl) {
        var hand = pl.mjhand.slice();
        var card = null;
        for (var i = 0; i < hand.length; i++) {
            if (this.getCardCount(hand, hand[i]) == 4) {
                card = hand[i];
                break;
            }
        }

        if (!card) {return null;}
        var idxGroup = this.getGroupIdx(card);
        var linkCards = [idxGroup, idxGroup + 1, idxGroup + 2];

        var ex = [];
        for (var i = 0; i < linkCards.length; ++i) {
            var c = linkCards[i];
            if (c != card && this.getCardCount(hand, c) < 3) {
                var exCard = this.getCards(hand, [c]);
                if (exCard.length > 0) {
                    ex.push(exCard[0]);
                }
            }
        }

        var gang0Pos = -1;
        for (var i = 0; i < pl.mjgang0.length; i++) {
            var gangInfo = pl.mjgang0[i];
            if (gangInfo.ex.length == 1) {
                if (this.getGroupIdx(gangInfo.gang[0]) == this.getGroupIdx(card)) {
                    ex = [];
                    gang0Pos = i;
                    break;
                }
            }
        }
        return {gang:this.getCards(hand, [card,card,card,card]),ex:ex, ziMo:true, gang0Pos:gang0Pos};
    };

    PaoHuZi96Poker.prototype.getZou = function(pl, card, isZiMo) {
        if (!card || card <= 0) {return;}

        var weiPos = -1;
        var tiePos = -1;
        var gang0Pos = -1;
        var hand = pl.mjhand.slice();

        var cards = this.getCards(hand, [card, card, card]);
        if (cards.length != 3) {
            for (var i = 0; i < pl.mjwei.length; i++) {
                var weiCards = pl.mjwei[i];
                if (weiCards.length > 0 && this.sameValue(weiCards[0], card)) {
                    cards = weiCards.slice();
                    weiPos = i;
                    break;
                }
            }
        }

        if (cards.length == 3) {
            var idxGroup = this.getGroupIdx(card);
            var linkCards = [idxGroup, idxGroup + 1, idxGroup + 2];
            
            var ex = [];

            for (var i = 0; i < pl.mjtie.length; i++) {
                var tieCards = pl.mjtie[i];
                if (tieCards.length > 0 && this.getGroupIdx(tieCards[0]) == this.getGroupIdx(card)) {
                    ex = [].concat(tieCards);
                    tiePos = i;
                    break;
                }
            }

            if (tiePos == -1) {
                for (var i = 0; i < linkCards.length; ++i) {
                var c = linkCards[i];
                if (c != card && this.getCardCount(hand, c) < 3) {
                        var exCard = this.getCards(hand, [c]);
                        if (exCard.length > 0) {
                            ex.push(exCard[0]);
                        }
                    }
                }
            }

            //11122贴3，手上还剩下1112再摸到1后，则1111直接下桌和桌面上23口组成开满招，手中剩下的2不带到桌面去。
            for (var i = 0; i < pl.mjgang0.length; i++) {
                var gangInfo = pl.mjgang0[i];
                if (gangInfo.ex.length == 1) {
                    if (this.getGroupIdx(gangInfo.gang[0]) == this.getGroupIdx(card)) {
                        ex = [];
                        gang0Pos = i;
                        break;
                    }
                }
            }
            cards.push(card);
            return {gang:cards, ex:ex, tiePos:tiePos, weiPos:weiPos, gang0Pos:gang0Pos, ziMo:!!isZiMo};
        }
        return;
    };

    //获取可以贴的牌
    PaoHuZi96Poker.prototype.getTie = function(pl, card) {
        if (this.getTableKou(pl) >= 2) {return;}
        //过贴组不能贴
        if (this.inSkipTieGroup(pl, card)) {
            return;
        }

        var groupIdx = this.getGroupIdx(card);
        var stats = {};
        for (var i = 0; i < 3; i++) {
            stats[groupIdx + i] = this.getCardCount(pl.mjhand, groupIdx + i);
            if (stats[groupIdx + i] >= 3) {
                stats[groupIdx + i] = 0;
            }
        }

        //存在一句话不能贴
        if (stats[groupIdx] > 0 && stats[groupIdx + 1] > 0 && stats[groupIdx + 2] > 0) {
            return;
        }

        //没有牌 不能贴
        if (stats[groupIdx] + stats[groupIdx + 1] + stats[groupIdx + 2] == 0) {
            return;
        }

        //口子成对不能贴
        var value = this.value(card);
        if (stats[groupIdx] + stats[groupIdx + 1] + stats[groupIdx + 2] == 2 * stats[value]) {
            return;
        }

        var tieCard = null;
        for (var c in stats) {
            c = Number(c);
            if (stats[c] > 0 && c != value) {
                tieCard = this.getCards(pl.mjhand, [c]);
                if (tieCard.length > 0) {
                    tieCard.push(card);
                    return tieCard;
                }
            }
        }
        return null;
    };

    //获取贴后是否有牌可打
    PaoHuZi96Poker.prototype.hasCardPutAfterTie = function(pl, card) {
        if(!pl || !pl.mjhand || pl.mjhand.indexOf(card) < 0) {
            return false;
        }

        var hand = pl.mjhand.slice();
        hand.splice(hand.indexOf(card), 1);

        for(var i = hand.length - 1; i >= 0; i--) {
            if(this.includeCard(pl.canNotPutCard, hand[i])) {
                hand.splice(i, 1);
            }
        }

        return hand.length > 0;
    };

    //获取桌面的口
    PaoHuZi96Poker.prototype.getTableKou = function(pl) {
        var kouCount = pl.mjtie.length;

        for (var i = 0; i < pl.mjgang0.length; i++) {
            var gangInfo = pl.mjgang0[i];
            if (gangInfo.ex.length == 1) {
                kouCount++;
            }
        }
        return kouCount;
    };

    //获取吃
    PaoHuZi96Poker.prototype.getChi = function(pl, card) {
        var groupIdx = this.getGroupIdx(card);
        
        var tiePos = -1;
        var gang0Pos = -1;
        for (var i = 0; i < pl.mjtie.length; i++) {
            var tieCards = pl.mjtie[i];
            if (tieCards.length > 0 && this.getGroupIdx(tieCards[0]) == this.getGroupIdx(card)) {
                if (!this.sameValue(card, tieCards[0]) && !this.sameValue(card, tieCards[1])) {
                    tiePos = i;
                    break;
                }
            }
        }

        if (tiePos == -1) {
            for (var i = 0; i < pl.mjgang0.length; i++) {
                var gangInfo = pl.mjgang0[i];
                if (gangInfo.ex.length == 1 && this.getGroupIdx(gangInfo.gang[0]) == this.getGroupIdx(card)
                    && !this.sameValue(card, gangInfo.gang[0]) && !this.sameValue(card, gangInfo.ex[0])) {
                    gang0Pos = i;
                    break;
                }
            }
        }

        if (tiePos >= 0 || gang0Pos >= 0) {
            return {eatCards:[card], tiePos:tiePos, gang0Pos:gang0Pos, auto:true};
        }   

        //过吃组不能吃
        if (this.inSkipChiGroup(pl, card)) {
            return;
        }

        var stats = {};
        for (var i = 0; i < 3; i++) {
            stats[groupIdx + i] = this.getCardCount(pl.mjhand, groupIdx + i);
        }

        //新增.单独一句话没有其他牌的时候不可吃牌
        if (stats[groupIdx] == 1 && stats[groupIdx + 1] == 1 && stats[groupIdx + 2] == 1) {
            return;
        }

        var value = this.value(card);
        stats[value]++;

        //不能吃
        if (stats[groupIdx] > 2 || stats[groupIdx + 1] > 2 || stats[groupIdx + 2] > 2) {
            return;
        }

        //不能吃
        if (stats[groupIdx] == 0 || stats[groupIdx + 1] == 0 || stats[groupIdx + 2] == 0) {
            return;
        }

        var chiCards = [groupIdx, groupIdx + 1, groupIdx + 2];

        chiCards.splice(chiCards.indexOf(value), 1);
        chiCards = this.getCards(pl.mjhand, chiCards);
        chiCards.push(card);

        //是否自动吃 2+2+1且手上已有此牌时才手动
        var num = stats[groupIdx] + stats[groupIdx + 1] + stats[groupIdx + 2];
        var manual = num == 5 && stats[value] > 1;
        return {eatCards:chiCards, auto:!manual};
    };

    PaoHuZi96Poker.prototype.getPlEx = function(tb, pl, card, cardType) {
        var plEx = {mjchi:[],mjgang0:[],mjgang1:[], huPos:{mjtie:-1,mjgang0:-1,mjwei:-1},plActive:{mjtie:[],mjgang0:[],mjwei:[]},card:card,cardType:cardType,hunCount:0, suCount:0};
        var allCards = pl.mjhand.slice();
        if (card > 0) {
            allCards.push(card);
        }

        var huPos = plEx.huPos;
        var plActive = plEx.plActive;
        for (var i = 0; i < pl.mjtie.length; i++) {
            plActive.mjtie.push(1);
            allCards.push.apply(allCards, pl.mjtie[i]);
        }

        for (var i = 0; i < pl.mjgang0.length; i++) {
            plActive.mjgang0.push(1);
            allCards.push.apply(allCards, pl.mjgang0[i].gang);
            allCards.push.apply(allCards, pl.mjgang0[i].ex);
        }

        //如果是勺的位置肯定会带一个吃或贴 不会单独跟
        for (var i = 0; i < pl.mjwei.length; i++) {
            plActive.mjwei.push(1);
            allCards.push.apply(allCards, pl.mjwei[i]);
        }

        for (var i = 0; i < pl.mjchi.length; i++) {
            var chi = pl.mjchi[i].eatCards;
            if(!chi) {
                continue;
            }
            allCards.push.apply(allCards, chi);
        }

        for (var i = 0; i < pl.mjgang1.length; i++) {
            allCards.push.apply(allCards, pl.mjgang1[i][0].gang);
            allCards.push.apply(allCards, pl.mjgang1[i][0].ex);
            allCards.push.apply(allCards, pl.mjgang1[i][1].gang);
            allCards.push.apply(allCards, pl.mjgang1[i][1].ex);
        }

        for (var i = 0; i < pl.mjpeng.length; i++) {
            allCards.push.apply(allCards, pl.mjpeng[i]);
        }

        for (var i = 0; i < allCards.length; i++) {
            if (this.isHun(tb, allCards[i])) {
                plEx.hunCount++;
            }else{
                plEx.suCount++;
            }
        }

        if (card <= 0) {
            return plEx;
        }

        var groupIdx = this.getGroupIdx(card);

        for (var i = 0; i < pl.mjtie.length; i++) {
            var tieCards = pl.mjtie[i];
            if (tieCards.length > 0 && this.getGroupIdx(tieCards[0]) == this.getGroupIdx(card)) {
                if (!this.sameValue(card, tieCards[0]) && !this.sameValue(card, tieCards[1])) {
                    huPos["mjtie"] = i;
                    break;
                }
            }
        }

        for (var i = 0; i < pl.mjgang0.length; i++) {
            var gangInfo = pl.mjgang0[i];
            if (gangInfo.ex.length == 1 && this.getGroupIdx(gangInfo.gang[0]) == this.getGroupIdx(card)
                && !this.sameValue(card, gangInfo.gang[0]) && !this.sameValue(card, gangInfo.ex[0])) {
                huPos["mjgang0"] = i;
                break;
            }
        }

        //如果是勺的位置肯定会带一个吃或贴 不会单独跟
        for (var i = 0; i < pl.mjwei.length; i++) {
            if (this.sameValue(card, pl.mjwei[i][0])) {
                huPos["mjwei"] = i;
                break;
            }
        }
        return plEx;
    };

    PaoHuZi96Poker.prototype.clone = function(obj) {
        var clone = function(obj){
            var o;  
            if (typeof obj == "object") {  
                if (obj === null) {  
                    o = null;  
                } else {  
                    if (obj instanceof Array) {  
                        o = [];  
                        for (var i = 0, len = obj.length; i < len; i++) {  
                            o.push(clone(obj[i]));  
                        }  
                    } else {  
                        o = {};  
                        for (var j in obj) {  
                            o[j] = clone(obj[j]);  
                        }  
                    }  
                }  
            } else {  
                o = obj;  
            }  
            return o; 
        }
        return clone(obj);
    };

    PaoHuZi96Poker.prototype.hasShuangLongBaoZhu = function(tb, pl, plEx){
        for (var i = 0; i < pl.mjgang1.length; i++) {
            if (this.isShuangLongBaoZhu(tb, pl.mjgang1[i])) {
                return true;
            }
        }

        if (plEx) {
            for (var i = 0; i < plEx.mjgang1.length; i++) {
                if (this.isShuangLongBaoZhu(tb, plEx.mjgang1[i])) {
                    return true;
                }
            }
        }
        return false;
    };

    PaoHuZi96Poker.prototype.isShuangLongBaoZhu = function(tb, mjgang1Item){
        var gangInfo1 = mjgang1Item[0];
        var gangInfo2 = mjgang1Item[1];
        //双龙抱住
        if (gangInfo1.ziMo && gangInfo2.ziMo && this.isHun(tb, gangInfo1.gang[0]) && this.isHun(tb, gangInfo2.gang[0])) {
            return true;
        }
        return false;
    };

    //获取胡的详细信息
    PaoHuZi96Poker.prototype.getHuInfo = function(tb, pl) {
        var card = tb.tData.currCard;
        var cardType = pl.uid == tb.tData.uids[tb.tData.curPlayer] ? 1 : 0;
        var tData = tb.tData;

        var bestHuInfo = {
            huCard:-1,
            huCardPos:-1,//胡牌位置
            hardHuXi:-1, //胡息
            score:0,
            matrix:[],
            handSort:[],
            hzdesc:[],  
        };

        var getHuInfoEx = function(tb, pl, card, cardType, plEx) {
            var qieCount = this.getTableKou(pl);
            //补充了一个贴口
            if (card <= 0 && plEx.card > 0) {
                qieCount--;
            }

            var matrixGroups = this.getAllHuMatrix(pl.mjhand, card, qieCount, pl.mjchi);
            var allHuMatrix = matrixGroups.matrix;
            for (var i = 0; i < allHuMatrix.length; i++) {
                var matrix = allHuMatrix[i];
                var huInfo = this.oneMatrixHuInfo(tb, pl, card, cardType, this.clone(plEx), matrix, matrixGroups.single);
                if (huInfo) {
                    huInfo.score = 0;

                    var scoreConfig = SCORE_CONFIG[tData.maxPlayer][tData.areaSelectMode.scoreType];
                    var scoreLevelKeys = Object.keys(scoreConfig.huXiToScore);
                    for (var j = scoreLevelKeys.length - 1; j >= 0; j--) {
                        var scoreLevel = Number(scoreLevelKeys[j]);
                        if (huInfo.hardHuXi >= scoreLevel) {
                            huInfo.score = scoreConfig.huXiToScore[scoreLevel];
                            break;
                        }
                    }

                    if (plEx.hunCount == 0 && SCORE_CONFIG.suHuScore > huInfo.score) {
                        huInfo.score = SCORE_CONFIG.suHuScore;
                    }
                    
                    if (tb.tData.areaSelectMode.isShuangLongBaoZhu && scoreConfig.shuangLongBaoZhuScore && scoreConfig.shuangLongBaoZhuScore > huInfo.score && this.hasShuangLongBaoZhu(tb, pl, plEx)) {
                        huInfo.score = scoreConfig.shuangLongBaoZhuScore;
                    }

                    //算分
                    if (huInfo.score > bestHuInfo.score) {
                        bestHuInfo = huInfo;
                    }
                }
            }
        }.bind(this);

        var plEx  = this.getPlEx(tb, pl, card, cardType);
        for (var k in plEx.huPos) {
            var pos = plEx.huPos[k];
            if (pos >= 0) {
                var plExCopy = this.clone(plEx);
                if (k == "mjtie") {
                    plExCopy.plActive["mjtie"][pos] = 0;
                    var eatCards = this.clone(pl.mjtie[pos]);
                    //把招填充好 勺+贴+胡的牌
                    if (plExCopy.huPos.mjwei >= 0) {
                        plExCopy.plActive["mjwei"][plExCopy.huPos.mjwei] = 0;
                        var gang = pl.mjwei[plExCopy.huPos.mjwei].slice();
                        gang.push(card);
                        plExCopy.mjgang0.push({gang:gang, ex:eatCards, ziMo:!!cardType});
                    }else{
                        eatCards.push(card);
                        plExCopy.mjchi.push({eatCards: eatCards});    
                    }
                }else if (k == "mjgang0") {
                    plExCopy.plActive["mjgang0"][pos] = 0;
                    var gangInfo = this.clone(pl.mjgang0[pos]);
                    
                    //把双龙填充好
                    if (plExCopy.huPos.mjwei >= 0) {
                        plExCopy.plActive["mjwei"][plExCopy.huPos.mjwei] = 0;
                        var gang = pl.mjwei[plExCopy.huPos.mjwei].slice();
                        gang.push(card);
                        plExCopy.mjgang1.push([gangInfo, {gang:gang, ex:[], ziMo:cardType == 1,isGangHand:false}]);
                    }else{
                        gangInfo.ex.push(card);    
                        plExCopy.mjgang0.push(gangInfo);
                    }
                    
                }else{
                    continue;
                }
                getHuInfoEx(tb,pl,0,cardType,plExCopy);
            }
        }

        getHuInfoEx(tb, pl, card, cardType,this.clone(plEx));

        if (bestHuInfo.hardHuXi >= 0) {  //素胡胡息数可能为0
            this.mergePlEx(tb, pl, bestHuInfo);
            this.handSort(tb, bestHuInfo, cardType);
            bestHuInfo.huCard = card;
            this.getHzdesc(tb, pl, bestHuInfo);
            if(bestHuInfo.single && this.sameValue(card, bestHuInfo.single)) {
                bestHuInfo.huCardPos = 200;  //表示刚好胡 最后摸到(或4人别人打)的单牌
            }
        }

        // console.log(JSON.stringify(bestHuInfo));
        // console.log("---------------------pl-----------------")
        // console.log(JSON.stringify(pl));
        return bestHuInfo;
    };

    PaoHuZi96Poker.prototype.getHzdesc = function(tb, pl, huInfo){
        var tData = tb.tData;
        huInfo.hzdesc = [];

        //素胡
        if (huInfo.plEx.hunCount == 0) {
            huInfo.hzdesc.push({name:"素胡", desc: ""});
        }else{
            if (tData.areaSelectMode.scoreType == 0 ||
                tData.areaSelectMode.scoreType == 1) {
                if (huInfo.hardHuXi == tb.tData.minHuxi) {
                    huInfo.hzdesc.push({name:"平胡", desc: ""});
                }else{
                    huInfo.hzdesc.push({name:"荤胡", desc: ""});
                }
            }else if (tData.areaSelectMode.scoreType == 2) {
                var scoreConfig = SCORE_CONFIG[tData.maxPlayer][tData.areaSelectMode.scoreType];
                if (huInfo.hardHuXi >= Object.keys(scoreConfig.huXiToScore)[1]) {
                    huInfo.hzdesc.push({name:"大胡", desc: ""});
                }else{
                    huInfo.hzdesc.push({name:"小胡", desc: ""});
                }
            }
        }

        huInfo.hzdesc.push({name:huInfo.hardHuXi + "胡", desc: ""});

        if (tData.areaSelectMode.isShuangLongBaoZhu && this.hasShuangLongBaoZhu(tb, pl, huInfo.plEx)) {
            huInfo.hzdesc.push({name:"双龙抱柱", desc: ""});
        }

        if (huInfo.plEx.cardType == 1) {
            huInfo.hzdesc.push({name:"自摸", desc: ""});
        }
    };
    PaoHuZi96Poker.prototype.handSort = function(tb, huInfo, cardType){
        var matrix = huInfo.matrix;
        var huCardPos = huInfo.huCardPos;
        var handSort = [];
        for (var i = 0; i < matrix.length; i++) {
            var row = matrix[i];
            if (this.sameValue(row[0],row[1])) {
                //碰
                if (huCardPos == i && cardType == 0) {
                    handSort.push({cards: row, name : "mjpeng", huxi:this.isRed(row[0]) ? HuXiDict.peng.red : HuXiDict.peng.black});
                }else{
                    handSort.push({cards: row, name : "mjwei", huxi:this.isRed(row[0]) ? HuXiDict.shao.red : HuXiDict.shao.black});
                }
            }else{
                var huxi = 0;
                for (var j = 0; j < row.length; j++) {
                    huxi += this.isHun(tb, row[j]) ? HuXiDict.dan.hun : HuXiDict.dan.su;
                }
                if (row.length == 2) {
                    handSort.push({cards: row, name : "mjtie", huxi:huxi});
                }else{
                    handSort.push({cards: row, name : "mjchi", huxi:huxi});
                }
            }
        }
        huInfo.handSort = handSort;
    };

    //把胡中吃的牌从plEx填充到pl
    PaoHuZi96Poker.prototype.mergePlEx = function(tb, pl, huInfo) {
        if (!huInfo.plEx) {return;}

        var plEx = huInfo.plEx;
        var huCardPos = -1;
        var tiePos = plEx.plActive.mjtie.indexOf(0);
        var weiPos = plEx.plActive.mjwei.indexOf(0);
        var gang0Pos = plEx.plActive.mjgang0.indexOf(0);

        var getSortPos = function(name, pos){
            for (var i = pl.mjsort.length - 1; i >= 0; i--) {
                if (pl.mjsort[i].name == name && pl.mjsort[i].pos == pos) {
                    return i;
                }
            }
            return -1;
        }

        if (plEx.mjgang0.length > 0) {
            var gangInfo = plEx.mjgang0[0];
            if (gang0Pos >= 0) {
                pl.mjgang0[gang0Pos] = gangInfo;
                huCardPos = getSortPos("mjgang0", gang0Pos);
            }else{
                var mjsortPosWei = -1;
                var mjsortPosTie = -1;

                if (weiPos >= 0) {
                    pl.mjwei.splice(weiPos, 1);
                    for (var i = pl.mjsort.length - 1; i >= 0; i--) {
                        if (pl.mjsort[i].name == "mjwei") {
                            if (pl.mjsort[i].pos == weiPos) {
                                mjsortPosWei = i;
                            } else if (pl.mjsort[i].pos > weiPos) {
                                pl.mjsort[i].pos--;
                            }
                        }
                    }
                }else{
                    this.removeCards(pl.mjhand, gangInfo.gang);
                }

                if (tiePos >= 0) {
                    pl.mjtie.splice(tiePos, 1);
                    for (var i = pl.mjsort.length - 1; i >= 0; i--) {
                        if (pl.mjsort[i].name == "mjtie") {
                            if (pl.mjsort[i].pos == tiePos) {
                                mjsortPosTie = i;
                            } else if (pl.mjsort[i].pos > tiePos) {
                                pl.mjsort[i].pos--;
                            }
                        }
                    }
                }else{
                    this.removeCards(pl.mjhand, gangInfo.ex);
                }
               
                var mjsortPos = -1;

                if (mjsortPosTie >= 0) {
                    mjsortPos = mjsortPosTie;
                }

                if (mjsortPosWei >= 0) {
                    mjsortPos = mjsortPosWei;
                }
                pl.mjgang0.push(gangInfo);
                pl.mjsort.splice(mjsortPos >= 0 ? mjsortPos : pl.mjsort.length, 1,{name: "mjgang0", pos: pl.mjgang0.length - 1});
               
                if (mjsortPosTie >= 0 && mjsortPos != mjsortPosTie) {
                    pl.mjsort.splice(mjsortPosTie, 1);
                }

                if (mjsortPosWei >= 0 && mjsortPos != mjsortPosWei) {
                    pl.mjsort.splice(mjsortPosWei, 1);
                }
                huCardPos = mjsortPos >= 0 ? mjsortPos : (pl.mjsort.length - 1);
            }
        }

        if (plEx.mjchi.length > 0 && tiePos >= 0) {
            pl.mjtie.splice(tiePos, 1);
            var mjsortPos = -1;
            for (var i = pl.mjsort.length - 1; i >= 0; i--) {
                if (pl.mjsort[i].name == "mjtie") {
                    if (pl.mjsort[i].pos == tiePos) {
                        mjsortPos = i;
                    } else if (pl.mjsort[i].pos > tiePos) {
                        pl.mjsort[i].pos--;
                    }
                }
            }
            
            pl.mjchi.push(plEx.mjchi[0]);
            pl.mjsort.splice(mjsortPos, 1, {name: "mjchi", pos: pl.mjchi.length - 1});
            huCardPos = mjsortPos;
        }

        if (plEx.mjgang1.length > 0 && gang0Pos >= 0) {
            var mjsortPosWei = -1;
            var mjsortPosGang0 = -1;

            if (weiPos >= 0) {
                pl.mjwei.splice(weiPos, 1);
                for (var i = pl.mjsort.length - 1; i >= 0; i--) {
                    if (pl.mjsort[i].name == "mjwei") {
                        if (pl.mjsort[i].pos == weiPos) {
                            mjsortPosWei = i;
                        } else if (pl.mjsort[i].pos > weiPos) {
                            pl.mjsort[i].pos--;
                        }
                    }
                }
            }else{
                this.removeCards(pl.mjhand, plEx.mjgang1[0][1].gang);
            }

            pl.mjgang0.splice(gang0Pos, 1);
            for (var i = pl.mjsort.length - 1; i >= 0; i--) {
                if (pl.mjsort[i].name == "mjgang0") {
                    if (pl.mjsort[i].pos == gang0Pos) {
                        mjsortPosGang0 = i;
                    } else if (pl.mjsort[i].pos > gang0Pos) {
                        pl.mjsort[i].pos--;
                    }
                }
            }
           
            pl.mjgang1.push(plEx.mjgang1[0]);
            pl.mjsort.splice(mjsortPosGang0, 1, {name: "mjgang1", pos: pl.mjgang1.length - 1});

            if(mjsortPosWei >= 0) {
                pl.mjsort.splice(mjsortPosWei, 1);
            }

            huCardPos = getSortPos("mjgang1", pl.mjgang1.length-1);
            //huCardPos = pl.mjgang1.length-1;
        }

        if (huCardPos != -1) {
            huInfo.huCardPos = 100 + huCardPos;
        }
    }

    //判断可胡 cardType:1自己摸出 0别人摸出
    PaoHuZi96Poker.prototype.canHu = function(tb, pl, card, cardType) {
        if (!pl.isCanHu)
            return false;
        var canHuEx = function(tb, pl, card, cardType, plEx) {
            var qieCount = this.getTableKou(pl);
            //补充了一个贴口
            if (card <= 0 && plEx.card > 0) {
                qieCount--;
            }

            var matrixGroups = this.getAllHuMatrix(pl.mjhand, card, qieCount, pl.mjchi);
            var allHuMatrix = matrixGroups.matrix;
            for (var i = 0; i < allHuMatrix.length; i++) {
                var matrix = allHuMatrix[i];
                var huInfo = this.oneMatrixHuInfo(tb, pl, card, cardType, this.clone(plEx), matrix, matrixGroups.singleCard);
                if (huInfo) {
                    return true;
                }
            }
            return false;
        }.bind(this);

        var plEx  = this.getPlEx(tb, pl, card, cardType);
        for (var k in plEx.huPos) {
            var pos = plEx.huPos[k];
            if (pos >= 0) {
                var plExCopy = this.clone(plEx);
                if (k == "mjtie") {
                    plExCopy.plActive["mjtie"][pos] = 0;
                    var eatCards = this.clone(pl.mjtie[pos]);
                    //把招填充好 勺+贴+胡的牌
                    if (plExCopy.huPos.mjwei >= 0) {
                        plExCopy.plActive["mjwei"][plExCopy.huPos.mjwei] = 0;
                        var gang = pl.mjwei[plExCopy.huPos.mjwei].slice();
                        gang.push(card);
                        plExCopy.mjgang0.push({gang:gang, ex:eatCards, ziMo:!!cardType});
                    }else{
                        eatCards.push(card);
                        plExCopy.mjchi.push({eatCards: eatCards});    
                    }
                }else if (k == "mjgang0") {
                    plExCopy.plActive["mjgang0"][pos] = 0;
                    var gangInfo = this.clone(pl.mjgang0[pos]);
                    
                    //把双龙填充好
                    if (plExCopy.huPos.mjwei >= 0) {
                        plExCopy.plActive["mjwei"][plExCopy.huPos.mjwei] = 0;
                        var gang = pl.mjwei[plExCopy.huPos.mjwei].slice();
                        gang.push(card);
                        plExCopy.mjgang1.push([gangInfo, {gang:gang, ex:[], ziMo:cardType == 1,isGangHand:false}]);
                    }else{
                        gangInfo.ex.push(card);    
                        plExCopy.mjgang0.push(gangInfo);
                    }
                }else{
                    continue;
                }
                if (canHuEx(tb,pl,0,cardType,plExCopy)) {
                    return true;
                }
            }
        }

        return canHuEx(tb, pl, card, cardType,this.clone(plEx));
    };

    PaoHuZi96Poker.prototype.oneMatrixHuInfo = function(tb, pl, card, cardType, plEx, matrix, single) {
        var huInfo = {
            huCardPos:-1,//胡牌位置
            hardHuXi:0, //胡息
            matrix:matrix,
            plEx:plEx,
            single,     
        };

        //把开招填充好1
        if (card > 0 && plEx.huPos.mjwei >= 0) {
            var mjweiInfo = pl.mjwei[plEx.huPos.mjwei];
            for (var i = 0; i < matrix.length ; i++) {
                var row = matrix[i];
                if (row.indexOf(card) >= 0) {
                    //把招填充好 勺+手牌中的贴或吃
                    row.splice(row.indexOf(card), 1);
                    var ex = row;
                    plEx.plActive["mjwei"][plEx.huPos.mjwei] = 0;
                    var gang = pl.mjwei[plEx.huPos.mjwei].slice();
                    gang.push(card);
                    plEx.mjgang0.push({gang:gang, ex:ex, ziMo:!!cardType});
                    matrix.splice(i ,1);
                    break;
                }
            }
        }

        if (card > 0) {
            var weiPos = -1;
            var tiePos = -1;

            for (var i = 0; i < matrix.length ; i++) {
                var row = matrix[i];
                if (this.includeCard(row, card)) {
                    if (this.sameValue(row[0],row[1])) {
                        weiPos = i;
                    }else{
                        tiePos = i; 
                    }
                    if (huInfo.huCardPos == -1) {
                        huInfo.huCardPos = i;
                    }
                }
            }
            //把开招填充好2 手牌中的贴或吃+手牌三张
            if (weiPos != -1 && tiePos != -1) {
                huInfo.huCardPos = -1;
                var gang = matrix[weiPos].slice();
                var ex = matrix[tiePos].slice();
                for (var i = 0; i < ex.length; i++) {
                    if (this.sameValue(ex[i], card)) {
                        gang.push(ex[i]);
                        ex.splice(i, 1);
                        break;
                    }
                }
                
                plEx.mjgang0.push({gang:gang, ex:ex, ziMo:!!cardType});

                if (weiPos > tiePos) {
                    matrix.splice(weiPos ,1);
                    matrix.splice(tiePos ,1);
                }else{
                    matrix.splice(tiePos ,1);
                    matrix.splice(weiPos ,1);
                }
            }
        }

        if (card == 0 && plEx.mjgang0.length > 0) {
            var weiPos = -1;
            for (var i = 0; i < matrix.length ; i++) {
                var row = matrix[i];
                if (this.includeCard(row, plEx.card)) {
                    if (this.sameValue(row[0],row[1])) {
                        weiPos = i;
                        break;
                    }
                }
            }

            //双龙
            if (weiPos >= 0) {
                var gangInfo1 = plEx.mjgang0[0];
                plEx.mjgang0 = [];
                var gangInfo2 = {gang:matrix[weiPos].concat([gangInfo1.ex[1]]), ex:[], ziMo:plEx.cardType == 1, isGangHand:false};
                gangInfo1.ex.pop();
                plEx.mjgang1.push([gangInfo1, gangInfo2]);
                matrix.splice(weiPos ,1);
            }
        }

        huInfo.hardHuXi = this.getMatrixHuXi(tb, matrix, huInfo.huCardPos, cardType);
        huInfo.hardHuXi += this.getTableHuXi(tb, pl, plEx, single);
        huInfo.single = single;

        //素胡
        var minHuxi = tb.tData.minHuxi;
        if (plEx.hunCount == 0) {
            minHuxi = 0;
        }

        if (huInfo.hardHuXi >= minHuxi) {
            return huInfo;
        }
        return;
    };

    PaoHuZi96Poker.prototype.getMatrixHuXi = function(tb, matrix, huCardPos, cardType) {
        var huxi = 0;
        for (var i = 0; i < matrix.length; i++) {
            var row = matrix[i];
            if (this.sameValue(row[0],row[1])) {
                //碰
                if (huCardPos == i && cardType == 0) {
                    huxi += this.isRed(row[0]) ? HuXiDict.peng.red : HuXiDict.peng.black;
                }else{
                    huxi += this.isRed(row[0]) ? HuXiDict.shao.red : HuXiDict.shao.black;
                }
            }else{
                for (var j = 0; j < row.length; j++) {
                    huxi += this.isHun(tb, row[j]) ? HuXiDict.dan.hun : HuXiDict.dan.su;
                }
            }
        }
        return huxi;
    };


    PaoHuZi96Poker.prototype.getTableHuXi = function(tb, pl, plEx, single) {
        var huxi = 0;
        var sIdx;
        if(single) {
            sIdx = this.getGroupIdx(single);
        }
        for (var i = 0; i < pl.mjtie.length; i++) {
            if (!plEx || plEx.plActive.mjtie[i] == 1) {
                var row = pl.mjtie[i];
                for (var j = 0; j < row.length; j++) {
                    huxi += this.isHun(tb, row[j]) ? HuXiDict.dan.hun : HuXiDict.dan.su;
                }
            }
        }

        var isCalSingle = false;
        for (var i = 0; i < pl.mjchi.length; i++) {
            var row = pl.mjchi[i].eatCards;
            var cIdx = this.getGroupIdx(row[0]);
            if(single && sIdx == cIdx && !isCalSingle) {
                huxi += 4 * (this.isHun(tb, single) ? HuXiDict.dan.hun : HuXiDict.dan.su);
                isCalSingle = true; //防止重复合并同组吃牌
                continue;
            }
            for (var j = 0; j < row.length; j++) {
                huxi += this.isHun(tb, row[j]) ? HuXiDict.dan.hun : HuXiDict.dan.su;
            }
        }

        for (var i = 0; i < pl.mjpeng.length; i++) {
            huxi += this.isRed(pl.mjpeng[i][0]) ? HuXiDict.peng.red : HuXiDict.peng.black;
        }

        for (var i = 0; i < pl.mjwei.length; i++) {
            if (!plEx || plEx.plActive.mjwei[i] == 1) {
                huxi += this.isRed(pl.mjwei[i][0]) ? HuXiDict.shao.red : HuXiDict.shao.black;
            }
        }

        for (var i = 0; i < pl.mjgang0.length; i++) {
            if (!plEx || plEx.plActive.mjgang0[i] == 1) {
                var gangInfo = pl.mjgang0[i];
                huxi += this.isRed(gangInfo.gang[0]) ? HuXiDict.zou.red[gangInfo.ziMo ? 1 : 0] : HuXiDict.zou.black[gangInfo.ziMo ? 1 : 0];
                var row = gangInfo.ex;
                for (var j = 0; j < row.length; j++) {
                    huxi += this.isHun(tb, row[j]) ? HuXiDict.dan.hun : HuXiDict.dan.su;
                }
            }
        }

        for (var i = 0; i < pl.mjgang1.length; i++) {
            //双龙抱住
            if (this.isShuangLongBaoZhu(tb, pl.mjgang1[i])) {
                huxi += HuXiDict.shuangLongBaoZhu;
            }else{
                var gangInfo = pl.mjgang1[i][0];
                huxi += this.isRed(gangInfo.gang[0]) ? HuXiDict.zou.red[gangInfo.ziMo ? 1 : 0] : HuXiDict.zou.black[gangInfo.ziMo ? 1 : 0];
                var row = gangInfo.ex;
                for (var j = 0; j < row.length; j++) {
                    huxi += this.isHun(tb, row[j]) ? HuXiDict.dan.hun : HuXiDict.dan.su;
                }

                var gangInfo = pl.mjgang1[i][1];
                huxi += this.isRed(gangInfo.gang[0]) ? HuXiDict.zou.red[gangInfo.ziMo ? 1 : 0] : HuXiDict.zou.black[gangInfo.ziMo ? 1 : 0];
                var row = gangInfo.ex;
                for (var j = 0; j < row.length; j++) {
                    huxi += this.isHun(tb, row[j]) ? HuXiDict.dan.hun : HuXiDict.dan.su;
                }
            }
        }

        if (plEx) {
            //此处的吃不用考虑变2贴的情况，因为没放在计算plEx中处理这种情况
            for (var i = 0; i < plEx.mjchi.length; i++) {
                var row = plEx.mjchi[i].eatCards;
                for (var j = 0; j < row.length; j++) {
                    huxi += this.isHun(tb, row[j]) ? HuXiDict.dan.hun : HuXiDict.dan.su;
                }
            }

            for (var i = 0; i < plEx.mjgang0.length; i++) {
                var gangInfo = plEx.mjgang0[i];
                huxi += this.isRed(gangInfo.gang[0]) ? HuXiDict.zou.red[gangInfo.ziMo ? 1 : 0] : HuXiDict.zou.black[gangInfo.ziMo ? 1 : 0];
                var row = gangInfo.ex;
                for (var j = 0; j < row.length; j++) {
                    huxi += this.isHun(tb, row[j]) ? HuXiDict.dan.hun : HuXiDict.dan.su;
                }
            }

            for (var i = 0; i < plEx.mjgang1.length; i++) {
                //双龙抱住
                if (this.isShuangLongBaoZhu(tb, plEx.mjgang1[i])) {
                    huxi += HuXiDict.shuangLongBaoZhu;
                }else{
                    var gangInfo = plEx.mjgang1[i][0];
                    huxi += this.isRed(gangInfo.gang[0]) ? HuXiDict.zou.red[gangInfo.ziMo ? 1 : 0] : HuXiDict.zou.black[gangInfo.ziMo ? 1 : 0];
                    var row = gangInfo.ex;
                    for (var j = 0; j < row.length; j++) {
                        huxi += this.isHun(tb, row[j]) ? HuXiDict.dan.hun : HuXiDict.dan.su;
                    }

                    var gangInfo = plEx.mjgang1[i][1];
                    huxi += this.isRed(gangInfo.gang[0]) ? HuXiDict.zou.red[gangInfo.ziMo ? 1 : 0] : HuXiDict.zou.black[gangInfo.ziMo ? 1 : 0];
                    var row = gangInfo.ex;
                    for (var j = 0; j < row.length; j++) {
                        huxi += this.isHun(tb, row[j]) ? HuXiDict.dan.hun : HuXiDict.dan.su;
                    }
                }
            }
        }
        return huxi;
    };

    //是否需要加入过贴组
    PaoHuZi96Poker.prototype.isSkipTieAfterPut = function(pl, card) {
        if(pl.mjhand.indexOf(card) < 0) {
            return;  //必须是从手里打出去的牌
        }
        var groupIdx = this.getGroupIdx(card);
        var stats = {};
        for (var i = 0; i < 3; i++) {
            stats[groupIdx + i] = this.getCardCount(pl.mjhand, groupIdx + i);
            if(stats[groupIdx + i] > 3) {
                stats[groupIdx + i] = 0;
            }
        }

        var num1 = stats[groupIdx];
        var num2 = stats[groupIdx + 1];
        var num3 = stats[groupIdx + 2];
        /*
            11223丢2 这种情况下暂时仍保留可贴 策划要求等反馈 7.10
            11123丢2、3 之后不能贴
            111223丢2、3 之后不能贴
            1112233丢2、3 之后不能贴
        */
        if(num1 == 3 || num2 == 3 || num3 == 3) {
            return num1 * num2 * num3 > 0;
        }

        if(num1 == 0) {
            return num2 * num3 > 0;
        }

        if(num2 == 0) {
            return num1 * num3 > 0;
        }

        if(num3 == 0) {
            return num1 * num2 > 0;
        }

        return false;
    }

    //是否处于过贴组
    PaoHuZi96Poker.prototype.inSkipTieGroup = function(pl, card) {
        var groupIdx = this.getGroupIdx(card);
        return pl.skipTieGroup.indexOf(groupIdx) >= 0;
    }

    //是否需要加入过吃组
    PaoHuZi96Poker.prototype.isSkipChiAfterPut = function(pl, card) {
        if(pl.mjhand.indexOf(card) < 0) {
            return;  //必须是从手里打出去的牌
        }
        var groupIdx = this.getGroupIdx(card);
        var stats = {};
        for (var i = 0; i < 3; i++) {
            stats[groupIdx + i] = this.getCardCount(pl.mjhand, groupIdx + i);
            if(stats[groupIdx + i] >= 3) {
                stats[groupIdx + i] = 0;
            }
        }

        var num1 = stats[groupIdx];
        var num2 = stats[groupIdx + 1];
        var num3 = stats[groupIdx + 2];

        /*
            1.成句情况下，丢散牌，该组牌不可再吃 (ex.12233丢3再来1或3都不可吃)
            2.后续待定
        */
        if (num1 > 0 && num2 > 0 && num3 > 0) {
            return true;
        }
    }

    //是否处于过吃组
    PaoHuZi96Poker.prototype.inSkipChiGroup = function(pl, card) {
        var groupIdx = this.getGroupIdx(card);
        return pl.skipChiGroup.indexOf(groupIdx) >= 0;
    }

    //-----------------前端新增接口start----------------
    //牌列
    var pointList = [
        [1,2,3],
        [4,5,6],
        [7,8,9],
        [10,11,12]
    ]

    var utils = function() {};

    // 牌点
    utils.prototype.point = function(card) {
        return card % 100;
    };

    // 花色
    utils.prototype.suit = function(card) {
        return Math.floor(card / 100);
    };

    var _ = new utils();

    PaoHuZi96Poker.prototype.getAllCardsTotal = function() {
        return 96;
    };

    /* 排序逻辑
        1.红1~9 + 黑1~9 + 红JQK + 黑JQK
        2.每列最多4个
        3.龙、坎、句、对、单张
    */
    //打牌用
    PaoHuZi96Poker.prototype.sortCard = function(hand) {
        if(!hand || hand.length <= 0) {
            return hand;
        }

        hand = hand.slice();

        var sortCards = function(a, b) {
            return a - b;
        }

        var sortByPoint = function(a, b) {
            if (_.point(a) == _.point(b)) {
                return a - b;
            }

            return _.point(a) - _.point(b);
        }
        
        var group = [];             //组: 红素-黑素-红荤-黑荤
        var row = [];               //列: 组内分列
        var matrix = [];            //最终矩阵

        //1.区分红黑荤素牌
        var redSu = [];
        var blackSu = [];
        var redHun = [];
        var blackHun = [];

        for (var i = 0; i < hand.length; i++) {
            var s = _.suit(hand[i]);
            if(s % 2 == 1) {
                if(_.point(hand[i]) < 10) {
                    redSu.push(hand[i]);
                }else {
                    redHun.push(hand[i]);
                }
            }else {
                if(_.point(hand[i]) < 10) {
                    blackSu.push(hand[i]);
                }else {
                    blackHun.push(hand[i]);
                }
            }
        }

        redSu.sort(sortByPoint);
        blackSu.sort(sortByPoint);
        redHun.sort(sortByPoint);
        blackHun.sort(sortByPoint);

        //2.分组    
        var splitToGroup = function(list) {
            var temp = [];
            var lastIdx = -1;

            var getRowIndex = function(card) {
                for(var i = 0; i < pointList.length; i++) {
                    if(pointList[i].indexOf(_.point(card)) >= 0) {
                        return i;
                    }
                }
                return 0;
            }

            for(var i = 0; i < list.length; i++) {
                var card = list[i];
                if(temp.length == 0) {
                    temp.push(card);
                    lastIdx = getRowIndex(card);
                    if(i == list.length - 1) {
                        group.push(temp);
                        temp = [];
                    }
                    continue;
                }
                var idx = getRowIndex(card);
                if(idx == lastIdx) {
                    temp.push(card);
                    if(i == list.length - 1) {
                        group.push(temp);
                    }
                }else {
                    group.push(temp);
                    temp = [];
                    temp.push(card);
                    if(i == list.length - 1) {
                        group.push(temp);
                    }
                }
                lastIdx = idx;
            }
        }

        splitToGroup(redSu);
        splitToGroup(blackSu);
        splitToGroup(redHun);
        splitToGroup(blackHun);
        
        //3.组内分列
        var delCard = function(list, card) {
            var idx = list.indexOf(card);
            if(idx >= 0) {
                list.splice(idx, 1);
            }
        }

        var parseGroupToRow = function(list, key) {
            key = key ? key : 'long';
            row = [];
            var isFind = false;

            var getJuIdxList = function(list, card) {
                var p = _.point(card);
                var idxList = [];
                var idx1 = -1;
                var idx2 = -1;
                for(var i = 0; i < list.length; i++) {
                    if(idx1 < 0 && _.point(list[i]) == p + 1) {
                        idx1 = i;
                    }
                    if(idx2 < 0 && _.point(list[i]) == p + 2) {
                        idx2 = i;
                    }
                    if(idx1 >= 0 && idx2 >= 0) {
                        idxList.push(idx1, idx2);
                        break;
                    }
                }

                return idxList;
            }

            for(var i = 0; i < list.length; i++) {
                var p = _.point(list[i]);
                if(key == 'long') {
                    isFind = (
                        list.length >= 4 && i < list.length - 3 &&
                        p == _.point(list[i+1]) &&
                        p == _.point(list[i+2]) &&
                        p == _.point(list[i+3])
                    )
                    if(isFind) {
                        row.push(list[i], list[i+1], list[i+2], list[i+3]);
                        for(var j = 0; j < 4; j++) {
                            delCard(list, row[j]);
                        }
                    }
                }else if(key == 'kan') {
                    isFind = (
                        list.length >= 3 && i < list.length - 2 &&
                        p == _.point(list[i+1]) &&
                        p == _.point(list[i+2])
                    )
                    if(isFind) {
                        row.push(list[i], list[i+1], list[i+2]);
                        for(var j = 0; j < 3; j++) {
                            delCard(list, row[j]);
                        }
                    }
                }else if(key == 'ju') {
                    var juIdxList = getJuIdxList(list, list[i]);
                    isFind = (
                        list.length >= 3 &&
                        juIdxList.length == 2
                    )
                    if(isFind) {
                        var pai1 = list[juIdxList[0]];
                        var pai2 = list[juIdxList[1]];
                        row.push(list[i], pai1, pai2);
                        delCard(list, list[i]);
                        delCard(list, pai1);
                        delCard(list, pai2);
                    }
                }   
                if(isFind)   
                    break;
            }
            if(isFind) {
                matrix.push(row);
                parseGroupToRow(list, key);
            }else {
                if(key == 'long') {
                    parseGroupToRow(list, 'kan');
                }else if(key == 'kan') {
                    parseGroupToRow(list, 'ju');
                }else {
                    if(list.length > 0) {
                        matrix.push(list);
                    }
                }
            }
        }

        for(var i = 0; i < group.length; i++) {
            parseGroupToRow(group[i]);
        }

        return matrix;
    };

    //删手牌重排序
    PaoHuZi96Poker.prototype.sortByUser = function(arr) {
        if (!MjClient.HandCardArr) {
            return [];
        }
        var cardArr = MjClient.HandCardArr;
        if (arr) {
            cardArr = arr;
        }

        var tmpArr = [];
        for (var i = 0; i < cardArr.length; i++) {
            for (var k = 0; k < cardArr[i].length; k++) {
                tmpArr.push(cardArr[i][k]);
            }
        }

        return this.sortCard(tmpArr);
    }

    //回放和小结算非自己使用
    PaoHuZi96Poker.prototype.sortCardEx = function(hand) {
        if(!hand || hand.length <= 0) {
            return hand;
        }

        hand = hand.slice();

        var sortCards = function(a, b) {
            return a - b;
        }

        var sortByPoint = function(a, b) {
            if (_.point(a) == _.point(b)) {
                return a - b;
            }

            return _.point(a) - _.point(b);
        }

        //1.红黑分组
        var red = [];
        var black = [];

        for(var i = 0; i < hand.length; i++) {
            if((_.suit(hand[i])) % 2 == 0) {
                black.push(hand[i]);
            }else {
                red.push(hand[i]);
            }
        }

        //2.红黑组内按点排序
        red.sort(sortByPoint);
        black.sort(sortByPoint);

        //3.组内按列分组,每列最多2个
        var matrix = [];
        var groupToMatrix = function(list) {
            var temp = [];
            for(var i = 0; i < list.length; i++) {
                if(temp.length < 2) {
                    temp.push(list[i]);
                }else {
                    matrix.push(temp);
                    temp = [];
                    temp.push(list[i]);
                }
                if(i == list.length - 1) {
                    matrix.push(temp);
                }
            }
        }
        groupToMatrix(red);
        if(red.length > 0 && (red.length % 2) == 1) {
            //从黑牌补一张
            if(black.length > 0) {
                matrix[matrix.length - 1].push(black[0]);
                black.splice(0, 1);
            }
        }
        groupToMatrix(black);

        return matrix;
    };

    //获取手牌总胡息
    PaoHuZi96Poker.prototype.getHuxi = function(pl) {
        //所有人只算桌面息!!!
        var huxiTable = 0;

        if (!pl)
            return huxiTable;

        return huxiTable;
    };

    //听牌
    PaoHuZi96Poker.prototype.getTingCards = function(tb, pl, putCard) {
        var tingCards = [];
        return tingCards;
    };

    PaoHuZi96Poker.prototype.getTingStats = function(tb, pl, putCard) {
        var tingStats = {};
        return tingStats;
    };

    PaoHuZi96Poker.prototype.hintPutCardsToTing = function() {
        var putList = [];
        return putList;
    };

    //单个门牌胡息计算
    PaoHuZi96Poker.prototype.getMenHuXi = function(name, cards, gangInfo) {
        if(!cards || cards.length == 0) {
            return 0;
        }

        var huxi = 0;
        var sData = MjClient.data.sData;
        if(name == 'mjtie' || name == 'mjchi') {
            for (var i = 0; i < cards.length; i++) {
                 huxi += this.isHun(sData, cards[i]) ? HuXiDict.dan.hun : HuXiDict.dan.su;
            }
        }else if(name == 'mjpeng') {
            huxi += this.isRed(cards[0]) ? HuXiDict.peng.red : HuXiDict.peng.black;
        }else if(name == 'mjwei') {
            huxi += this.isRed(cards[0]) ? HuXiDict.shao.red : HuXiDict.shao.black;
        }else if(name == 'mjgang0' && gangInfo) {
            huxi += this.isRed(gangInfo.gang[0]) ? HuXiDict.zou.red[gangInfo.ziMo ? 1 : 0] : HuXiDict.zou.black[gangInfo.ziMo ? 1 : 0];
            var row = gangInfo.ex;
            for (var j = 0; j < row.length; j++) {
                huxi += this.isHun(sData, row[j]) ? HuXiDict.dan.hun : HuXiDict.dan.su;
            }
        }else if(name == 'mjgang1' && gangInfo) {
            var gangInfo1 = gangInfo[0];
            var gangInfo2 = gangInfo[1];
            //双龙抱住
            if (gangInfo1.ziMo && gangInfo2.ziMo && this.isHun(sData, gangInfo1.gang[0]) && this.isHun(sData, gangInfo2.gang[0])) {
                huxi += HuXiDict.shuangLongBaoZhu;
            }else{
                var gangInfo = gangInfo1;
                huxi += this.isRed(gangInfo.gang[0]) ? HuXiDict.zou.red[gangInfo.ziMo ? 1 : 0] : HuXiDict.zou.black[gangInfo.ziMo ? 1 : 0];
                var row = gangInfo.ex;
                for (var j = 0; j < row.length; j++) {
                    huxi += this.isHun(sData, row[j]) ? HuXiDict.dan.hun : HuXiDict.dan.su;
                }

                var gangInfo = gangInfo2;
                huxi += this.isRed(gangInfo.gang[0]) ? HuXiDict.zou.red[gangInfo.ziMo ? 1 : 0] : HuXiDict.zou.black[gangInfo.ziMo ? 1 : 0];
                var row = gangInfo.ex;
                for (var j = 0; j < row.length; j++) {
                    huxi += this.isHun(sData, row[j]) ? HuXiDict.dan.hun : HuXiDict.dan.su;
                }
            }
        }

        return huxi;
    };

    //-----------------前端新增接口end----------------


    if (typeof(MjClient) != "undefined") {
        MjClient.majiang_96poker = new PaoHuZi96Poker();
    } 
})();