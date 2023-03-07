/**
 * 湘乡红中算法类
 */

(function () {

    var majiang = {};
    var flowerArray = [];//花的列表，根据不同来设置

    //是否是花
    majiang.isCardFlower = function (card) {
        return flowerArray.indexOf(card) >= 0;
    };

    //设置花，参数是[]，必须设置
    majiang.setFlower = function (flower) {
        flowerArray = flower || [];
    };

    //是否是混子
    majiang.isEqualHunCard = function (card) {
        return card == 200;
    };

    //是否可以胡
    majiang.canHu = function (oCards, cd, hun) {
        var cards = this.transformCards(oCards, hun);
        
        var tData = MjClient.data.sData.tData;
        if (tData.areaSelectMode["qidui"]) {
            if (is7Dui(cards, cd)) {
                return true;
            }
        }

        return canHuLaizi(cards, cd);
    };

    //听牌函数，判断手牌能否听牌
    majiang.canTing = function (cds) {
        return false;
    };

    //玩家杠后是否可以胡
    majiang.canHuAfterGang = function(oCards, gangCard, hun){
        var cardArr = [].concat(oCards);
        for(var i = 0;i < cardArr.length;i++){
            if(cardArr[i] == gangCard){
                cardArr.splice(i, 1);
                i--;
            }
        }

        return this.canHu(cardArr, 101, hun);
    };

    majiang.canGangWhenTing = function (hand, card) {
        return true;
    };

    majiang.gangWhenZimo = function (hand, rtn, hun) {

        for (var i = rtn.length - 1; i >= 0; i--) {
            var cards = [];
            for (var j = 0; j < hand.length; j++) {
                if (hand[j] != rtn[i]) {
                    cards.push(hand[j]);
                }
            }
            cards = this.transformCards(cards, hun);
            cards.sort(function (a, b) {
                return a - b;
            });

            for (var laizi = 0; this.isEqualHunCard(cards[cards.length - 1]); laizi++) {
                cards.pop();
            }
            if (laizi == 0 || !isPu(cards, laizi - 1)) { // 无红中、或者杠后非全听牌
                rtn.splice(i, 1);
            }
        }
    };

    //是否可以杠
    majiang.canGang1 = function (peng, hand, putCount) {

        var rtn = [];
        for (var i = 0; i < peng.length; i++) {
            if (hand[hand.length - 1] == peng[i]) {
                //手牌里的牌Push到rtn中
                rtn.push(peng[i]);
            }
        }
        var cnum = {};
        for (var i = 0; i < hand.length; i++) {
            var cd = hand[i];
            if (majiang.isEqualHunCard(cd)) {
                continue;
            }
            var num = cnum[cd];
            if (!num) {
                num = 0;
            }
            num++;
            cnum[cd] = num;
            if (num == 4 && cd != 71) {
                if (putCount <= peng.length || cd == hand[hand.length - 1]) {
                    rtn.push(cd);
                }
            }
        }
        return rtn;
    };

    //是否可以明杠
    majiang.canGang0 = function (hand, cd, isTing) {

        if (majiang.isEqualHunCard(cd))//混牌不能杠
        {
            return false;
        }
        var num = 0;
        for (var i = 0; i < hand.length; i++) {
            if (hand[i] == cd) num++;
        }
        return num == 3 && (!isTing || majiang.canGangWhenTing(hand, cd));
    };

    //是否可以碰
    majiang.canPeng = function (hand, cd) {

        var num = 0;
        if (majiang.isEqualHunCard(cd))//混牌不能碰
        {
            return false;
        }
        for (var i = 0; i < hand.length; i++) {
            if (hand[i] == cd) {
                num++;
            }
        }
        return num >= 2;
    };

    majiang.CardCount = function (pl) {

        var rtn = (pl.mjpeng.length + pl.mjgang0.length + pl.mjgang1.length) * 3 + pl.mjchi.length;
        if (pl.mjhand) {
            rtn += pl.mjhand.length;
        }
        return rtn;
    };

    majiang.getAllCardsTotal = function () {
        var tData = MjClient.data.sData.tData;
        if (tData.areaSelectMode["hongzhong8"]) {
            return 116;
        }
        return 112;
    };

    majiang.setFlowerImg = function (node, pl) {

        var icountNode = node.getChildByName("head").getChildByName("huaCount");
        if (icountNode != null) {
            var icount = pl.mjflower.length;
            icountNode.visible = true;
            cc.log("set flower ------ icount = " + icount);
            changeAtalsForLabel(icountNode, icount);
        }
    };

    majiang.setJiaZhuNum = function (node, pl) {

    };

    // 混子牌统一替换为200
    majiang.transformCards = function (oCards, hun) {

        if (!hun || hun == -1) {
            return oCards;
        }
        var cards = oCards.slice();
        for (var i = 0; i < cards.length; i++) {
            if (cards[i] == hun) {
                cards[i] = 200;
            }
        }
        return cards;
    };

    majiang.getCheckTingHuCards = function (selectCard, mjhandCard, isReturn) {
        if(selectCard == MjClient.data.sData.tData.hunCard){
            return {};
        }
        if(mjhandCard === undefined){
            return {};
        }
        isReturn = isReturn || false;
        var cp = mjhandCard.slice();
        var index = cp.indexOf(selectCard);  //排除当前选择的一张牌
        cp.splice(index, 1);
        var tingSet = null;
        tingSet = this.calTingSet(cp, MjClient.data.sData.tData.hunCard, isReturn);
        return tingSet;
    };

    majiang.calTingSet  = function (oCds, hun, isReturn)
    {
        var tData = MjClient.data.sData.tData;
        var allCardsArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29, 71];

        if(cc.isUndefined(oCds))
        {
            return {};
        }
        var tingSet = {};
        var cds = oCds.slice();
        if ((oCds.length + 1) % 3 == 0) { // 14、11、8、5、2张牌
            cds = oCds.slice(0, -1);
        }

        for (var i = 0; i < allCardsArray.length; i++) {
            if (this.canHu(cds, allCardsArray[i], hun)) {
                tingSet[allCardsArray[i]] = 1;
                if(isReturn){
                    return tingSet;
                }
            } 
        }
        return tingSet;
    };

    if (typeof(MjClient) != "undefined") {
        MjClient.majiang_XXHZ = majiang;
    }
    else {
        module.exports = majiang;
    }
})();
