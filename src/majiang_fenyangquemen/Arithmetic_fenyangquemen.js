
(function() {
    var majiang = {};
    var flowerArray = [111, 121, 131, 141, 151, 161, 171, 181];//花的列表，根据不同来设置

    //是否是花
    majiang.isCardFlower = function(card)
    {
        return flowerArray.indexOf(card) >= 0;
    }

    //设置花，参数是[]，必须设置
    majiang.setFlower = function(flower)
    {
        flowerArray = flower || [];
    }

    //是否是混子
    majiang.isEqualHunCard = function(card)
    {
        return card == 200;
    }

    // 十三幺
    majiang.isShisanyao = function(oCards, cd) {
        var yao13 = {1:0, 9:0, 11:0, 19:0, 21:0, 29:0, 31:0, 41:0, 51:0, 61:0, 71:0, 81:0, 91:0};
        var cards = oCards.slice();
        if (cd && cd !== 200) {
            cards.push(cd);
        }
        for (var i = 0; i < cards.length; i++) {
            if (cards[i] in yao13) {
                yao13[cards[i]]++;
            }
            else {
                return false;
            }
        }
        var count0 = 0;
        for (var card in yao13) {
            if (yao13[card] > 2) {
                return false;
            }
            if (yao13[card] === 0) {
                count0++;
            }
        }
        return count0 === 0 || count0 === 1 && cd === 200;
    }

    //碰杠花色
    majiang.pengGangLack = function(peng, gang1, gang2) {
        var cardSet = [0, 0, 0];
        var lack = 0;
        for (var i = 0; i < peng.length; i++) {
            var color = Math.floor(peng[i] / 10);
            if (peng[i] > 0 && color < 3) {
                cardSet[color] = 1;
            }
        }
        for (var i = 0; i < gang1.length; i++) {
            var color = Math.floor(gang1[i] / 10);
            if (gang1[i] > 0 && color < 3) {
                cardSet[color] = 1;
            }
        }
        for (var i = 0; i < gang2.length; i++) {
            var color = Math.floor(gang2[i] / 10);
            if (gang2[i] > 0 && color < 3) {
                cardSet[color] = 1;
            }
        }
        for (var i = 0; i < 3; i++) {
            if (cardSet[i] == 0) {
                lack++;
            }
        }
        return lack;
    };

    //求缺门
    majiang.calLack = function(cards, hun) {
        var cardSet = [0, 0, 0];
        var lack = 0;
        for (var i = 0; i < cards.length; i++) {
            if (cards[i] == hun) {
                continue;
            }
            var color = Math.floor(cards[i] / 10);
            if (cards[i] > 0 && color < 3) {
                cardSet[color] = 1;
            }
        }
        for (var i = 0; i < 3; i++) {
            if (cardSet[i] == 0) {
                lack++;
            }
        }
        return lack;
    };

    // majiang.daque = function(cards, cd, allCards) {
    //     var oCards = cards.slice();
    //     if(canHuLaizi(oCards,cd) || 
    //         is7Dui(oCards, cd) || 
    //         this.isYitiaolong(oCards) || 
    //         (MjClient.data.sData && MjClient.data.sData.tData.areaSelectMode["shisanyao"] && this.isShisanyao(oCards, cd))){
    //         if(this.calLack(allCards) >= 2){
    //             return true;
    //         }
    //     }
    //     return false;
    // }
    majiang.isYitiaolong = function(cards, allCards)
    { 
        //一条龙：同色一至九
        for (var i = 0; i <= 20; i += 10)
        {
            var numCount = 0;
            for (var j = 1; j <= 9; j++) 
            {
                if (cards.indexOf(i + j) >= 0){
                    numCount++;
                }
            }
            if (numCount >= 9) {
                var cds = cards.slice();
                for (var j = 1; j <= 9; j++) {
                       cds.splice(cds.indexOf(i + j), 1);
                }
                cc.log("isYitiaolong      ",allCards);
                return this.canHu(cds, null, allCards);
            }
        }
        return false;
    }
    //是否可以胡
    majiang.canHu = function(cards, cd, allCards)
    {   

        if (MjClient.data.sData && MjClient.data.sData.tData.areaSelectMode["shisanyao"] && this.isShisanyao(cards, cd)) {
            return true;
        }  

        var lacknum = this.calLack(allCards);
        if (lacknum < 1) 
        {
            return false;
        }

        if (is7Dui(cards, cd)) {
            return true;
        }

        if(this.isYitiaolong(cards, allCards)){
            return true;
        }

        // if(this.daque(cards, cd, allCards)){
        //     return true;
        // }


        return canHuLaizi(cards, cd);
    }

    majiang.calTingSet = function (oCds, pl, allCards) 
    { 
        var allCardsArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29, 31, 41, 51, 61, 71, 81, 91];
        if(cc.isUndefined(oCds))
        {
            return {};
        }
        var tingSet = {};
        var cds = oCds.slice();
        if ((oCds.length + 1) % 3 == 0) { // 14、11、8、5、2张牌
            cds = oCds.slice(0, -1);
        }
        var isAllCards;
        if(pl){
            isAllCards = cds.concat(pl.mjpeng).concat(pl.mjgang1).concat(pl.mjgang0);
        }
        else{
            isAllCards = allCards;
        }
        for (var i = 0; i < allCardsArray.length; i++) {
            if (this.canHu(cds, allCardsArray[i],isAllCards)) {

                var count = 0;
                for (var j = 0; j < cds.length; j++) {
                    if (cds[j] == allCardsArray[i]) {
                        count++;
                    }
                }
                if (count < 4) {
                    tingSet[allCardsArray[i]] = 1;
                }
            }
        }
        return tingSet;
    }

    majiang.getCheckTingHuCards = function(selectCard,mjhandCard,pl)
    {
        var copyhand = mjhandCard.slice();
        if (selectCard) {
            var index = copyhand.indexOf(selectCard);//排除当前选择的一张牌
            copyhand.splice(index,1);
        }
        var tingSet = null;
        tingSet = this.calTingSet(copyhand, pl);
        for (var card in tingSet) {
            var count = 0;
            for (var i = 0; i < mjhandCard.length; i++) {
                if (mjhandCard[i] == card) {
                    count++;
                }
            }
            if (count == 4) {
                delete tingSet[card];
            }
        }
        return tingSet;
    }

    //听牌函数，判断手牌能否听牌
    majiang.canTing = function (cards) {

        var tData = MjClient.data.sData.tData;
        var pl = getUIPlayer(0);
        if(!pl) return false;
        var allCards = cards.concat(pl.mjpeng).concat(pl.mjgang1).concat(pl.mjgang0);
        var shisanyao = tData.areaSelectMode["shisanyao"];


        if (tData.areaSelectMode["baoTing"] == false) 
        {
            return false;
        }
        if (shisanyao && this.isShisanyao(cards, 200)) {
            cc.log("13幺");
            return true;
        }
        var lacknum = this.calLack(allCards);
        if (lacknum < 1) 
        {
            return false;
        }

        var tingSet = this.calTingSet(cards,pl);
        return Object.keys(tingSet).length > 0;
    }

    majiang.canGangWhenTing = function(hand, card, allCards)
    {
        var hangAfterGang = [];
        for(var i = 0; i < hand.length; i++)
        {
            if(card != hand[i])
            {
                hangAfterGang.push(hand[i]);
            }
        }
        //若听牌状态下，去掉所杠的牌不能再听则不能杠
        if (!this.canTing(hangAfterGang)) {
            return false;
        }
        //求出之前听的牌
        var tingSet1 = this.calTingSet(hand, null, allCards);
        //求出杠之后听的牌
        var tingSet2 = this.calTingSet(hangAfterGang, null, allCards);
        //对比前后听的牌
        // if (Object.keys(tingSet1).length != Object.keys(tingSet2).length){
        //     return false;
        // }
        for(var tingCard in tingSet2) {
            if (!(tingCard in tingSet1)) {
                return false;
            }
        }
        //听牌不变可以杠
        return true;
    }

    //是否可以杠
    majiang.canGang1 = function(peng, hand, isTing)
    {   
        var pl = getUIPlayer(0);
        if(!pl) return false;
        var allCards = hand.concat(pl.mjpeng).concat(pl.mjgang1).concat(pl.mjgang0);
        var rtn = [];
        for(var i = 0; i < peng.length; i++)
        {
            if(hand.indexOf(peng[i]) >= 0 && (!isTing || majiang.canGangWhenTing(hand, peng[i], allCards)))
            {
                //手牌里的牌Push到rtn中
                rtn.push(peng[i]);
            }
        }
        var cnum = {};
        for(var i = 0; i < hand.length; i++)
        {
            var cd = hand[i];
            if(majiang.isEqualHunCard(cd))
            {
                continue;
            }
            var num = cnum[cd];
            if(!num)
            {
                num = 0;
            }
            num++;
            cnum[cd] = num;
            if(num == 4 && (!isTing || majiang.canGangWhenTing(hand, cd, allCards)))
            {
                rtn.push(cd);
            }
        }
        return rtn;
    };

    //是否可以明杠
    majiang.canGang0 = function(hand, cd, isTing)
    {
        if(majiang.isEqualHunCard(cd))//混牌不能杠
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
    majiang.canPeng = function(hand, cd)
    {
        var num = 0;
        if(majiang.isEqualHunCard(cd))//混牌不能碰
        {
            return false;
        }
        for(var i = 0; i < hand.length; i++)
        {
            if(hand[i] == cd)
            {
                num++;
            }
        }

        return num >= 2;
    };

    majiang.CardCount = function (pl)
    {
        var rtn = (pl.mjpeng.length + pl.mjgang0.length + pl.mjgang1.length) * 3 + pl.mjchi.length;
        if(pl.mjhand)
        {
            rtn += pl.mjhand.length;
        }
        return rtn;
    };

    majiang.getAllCardsTotal = function ()
    {
        return 136;
    };

    majiang.setFlowerImg = function (node, pl)
    {

        var icountNode = node.getChildByName("head").getChildByName("huaCount");
        if(icountNode != null) {
            var icount = pl.mjflower.length;
            icountNode.visible = true;
            cc.log("set flower ------ icount = " + icount);
            //changeAtalsForLabel(icountNode,icount);
            icountNode.setString("花 x " + icount);
        }
    };

    majiang.setJiaZhuNum = function (node, pl)
    {

    };


    if (typeof(MjClient) != "undefined")
    {
        MjClient.majiang_fenyangquemen = majiang;
    }
    else
    {
        module.exports = majiang;
    }
})();
