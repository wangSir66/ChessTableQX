
(function() {
    var majiang = {};
    // 废牌：东南西北中发白
    var feiCards = [31, 41, 51, 61, 71, 81, 91];
    var allCards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29];
    //是否是花
    majiang.isCardFlower = function(card) {
        return false;
    };

    //设置花，参数是[]，必须设置
    majiang.setFlower = function(flower) {

    };

    //是否是混子
    majiang.isEqualHunCard = function(card) {
        return card === 200;
    };

    //是否是废牌(东南西北中发白)
    majiang.isFeiPai = function(Cards) {
        var pl = getUIPlayer(0);
        if(!pl) return;
        var mjhandCards = pl.mjhand.concat(pl.mjpeng).concat(pl.mjgang0).concat(pl.mjgang1);
        var cards = Cards ? Cards : mjhandCards;
        for (var i = 0; i < cards.length; i++) {
            if(feiCards.indexOf(cards[i]) > -1){
                return true;
            }
        }
        return false;
    };



    // 计算手牌中万条筒张数最多的牌的张数【包括碰杠的牌】
    majiang.isHu8Zhang = function(pl, cards) {
        var mjhand = cards ? cards : pl.mjhand.slice();
        var cardList = [mjhand, pl.mjpeng, pl.mjgang0, pl.mjgang1];
        var arr = [0, 0, 0];
        for(var i = 0; i < cardList.length; i++) {
            var cds = cardList[i];
            for (var j = 0; j < cds.length; j++) {
                if (cds[j] >= 1 && cds[j] <= 9) {
                    if (i > 1) arr[0] += 4;
                    else if (i === 1) arr[0] += 3;
                    else arr[0]++;
                }
                if (cds[j] >= 11 && cds[j] <= 19) {
                    if (i > 1) arr[1] += 4;
                    else if (i === 1) arr[1] += 3;
                    else arr[1]++;
                }
                if (cds[j] >= 21 && cds[j] <= 29) {
                    if (i > 1) arr[2] += 4;
                    else if (i === 1) arr[2] += 3;
                    else arr[2]++;
                }
            }
        }

        var max = Math.max(arr[0], arr[1], arr[2]);
        var colors = [];
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === max) colors.push(i);
        }
        return {color: colors, max: max};
    };

    //是否可以胡
    majiang.canHu = function(cards, cd) {
        return canHuLaizi(cards, cd);
    };

    //听牌函数，判断手牌能否听牌
    majiang.canTing = function (cards, pl) {
        var isFeiCard = this.isFeiPai(cards);
        var isColorNums = this.isHu8Zhang(pl, cards);
        if (!isFeiCard) {
            for (var i = 0; i < allCards.length; i++) {
                // 必须满足胡牌后同一色最大张数有8张
                if (isColorNums.max > 7 || (isColorNums.max === 7 && isColorNums.color.indexOf(Math.floor(allCards[i]/10)) > -1)){
                    if (this.canHu(cards, allCards[i])) return true;
                }
            }
        }
        return false;
    };


    majiang.calTingSet = function(mjhand){
        var pl = getUIPlayer(0);
        if(!pl || !mjhand) return {};
        var isFeiCard = this.isFeiPai();
        var isColorNums = this.isHu8Zhang(pl);
        var tingSet = {};
        var hand = mjhand.slice();
        if ((mjhand.length + 1) % 3 === 0) {
            hand = mjhand.slice(0, -1);
        }
        if(!isFeiCard){
            for (var i = 0; i < allCards.length; i++) {
                if (isColorNums.max > 7 || (isColorNums.max === 7 && isColorNums.color.indexOf(Math.floor(allCards[i]/10)) > -1)) {
                    if (this.canHu(hand, allCards[i])) {
                        var count = 0;
                        for (var j = 0; j < hand.length; j++) {
                            if (hand[j] === allCards[i]) {
                                count++;
                            }
                        }
                        if (count < 4) {
                            tingSet[allCards[i]] = 1;
                        }
                    }
                }
            }
        }
        return tingSet;
    };

    majiang.canGangWhenTing = function(hand, card, pl) {
        var hangAfterGang = [];
        for(var i = 0; i < hand.length; i++)
        {
            if(card != hand[i])
            {
                hangAfterGang.push(hand[i]);
            }
        }

        //若听牌状态下，去掉所杠的牌不能再听则不能杠
        if (!majiang.canTing(hangAfterGang, pl)) {
            return false;
        }
       
        // 报听后可以杠，可以改变听口，可以减少听口，不可以没有听口
        return true;
    };


    //是否可以暗杠
    majiang.canGang1 = function(peng, hand, isTing, pl) {

        var rtn = [];
        for(var i = 0; i < peng.length; i++) {
            if(hand.indexOf(peng[i]) >= 0 && (!isTing || majiang.canGangWhenTing(hand, peng[i], pl))) {
                rtn.push(peng[i]);
            }
        }

        var cnum = {};
        for(var i = 0; i < hand.length; i++) {
            var cd = hand[i];
            var num = cnum[cd];
            if(this.isEqualHunCard(cd) || feiCards.indexOf(cd) > -1) continue;   //  混牌和废牌不能杠
            if(!num) {
                num = 0;
            }
            num++;
            cnum[cd] = num;
            if(num === 4 && (!isTing || majiang.canGangWhenTing(hand, cd, pl))) {
                rtn.push(cd);
            }
        }
        return rtn;
    };

    //是否可以明杠
    majiang.canGang0 = function(hand, cd) {
        if(this.isEqualHunCard(cd) || feiCards.indexOf(cd) > -1) return false;   //  混牌和废牌不能杠
        var num = 0;
        for (var i = 0; i < hand.length; i++) {
            if (hand[i] === cd) num++;
        }
        return num === 3;
    };

    //是否可以碰
    majiang.canPeng = function(hand, cd) {
        if(this.isEqualHunCard(cd) || feiCards.indexOf(cd) > -1) return false;   //  混牌和废牌不能碰
        var num = 0;
        for(var i = 0; i < hand.length; i++) {
            if(hand[i] === cd) num++;
        }
        return num >= 2;
    };

    majiang.CardCount = function (pl) {
        var rtn = (pl.mjpeng.length + pl.mjgang0.length + pl.mjgang1.length) * 3 + pl.mjchi.length;
        if(pl.mjhand) {
            rtn += pl.mjhand.length;
        }
        return rtn;
    };

    majiang.getAllCardsTotal = function () {
        var sData = MjClient.data.sData;
        var tData = sData.tData;
        if(tData.areaSelectMode['daiFeng']) {
            return 136;
        }
        return 108;
    };

    majiang.setFlowerImg = function (node, pl) {

    };

    majiang.setJiaZhuNum = function (node, pl) {

    };


    if (typeof(MjClient) != "undefined") {
        MjClient.majiang_jishanniuyezi = majiang;
    } else {
        module.exports = majiang;
    }
})();
