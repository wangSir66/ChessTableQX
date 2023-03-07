
(function() {
    var majiang = {};
    var flowerArray = [31, 41, 51, 61, 81, 91];//花的列表，根据不同来设置

    //是否是花
    majiang.isCardFlower = function(card)
    {   
        var tData = MjClient.data.sData.tData;
        if (tData.areaSelectMode.queYiMen && tData.maxPlayer == 2) {
            flowerArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 31, 41, 51, 61, 81, 91];
        } else {
            flowerArray = [31, 41, 51, 61, 81, 91];
        }
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

    majiang.canChi = function(hand, cd,hunCard)
    {
        //将白板转为配子牌
        var num = [0, 0, 0, 0, 0];
        var rtn = [];
        if(cd == hunCard){
            return rtn;
        }
        for(var i = 0; i < hand.length; i++)
        {
            var currCard = hand[i];
            if(currCard == hunCard){
                continue;
            }
            var dif = currCard - cd;
            switch (dif)
            {
                case -2:
                case -1:
                case 1:
                case 2:
                    num[dif + 2]++;
                    break;
            }
        }
        if(num[3] > 0 && num[4] > 0)
        {
            rtn.push(0);
        }
        if(num[1] > 0 && num[3] > 0)
        {
            rtn.push(1);
        }
        if(num[0] > 0 && num[1] > 0)
        {
            rtn.push(2);
        }
        return rtn;
    };

    //是否可以胡
    majiang.canHu = function(oCards, cd, hun)
    {
        var tData = MjClient.data.sData.tData;
        var cards = this.transformCards(oCards, hun);
        cd = tData.areaSelectMode["hongzhong"] > 0 && cd == 71 ? 200 : cd;
        if (tData.areaSelectMode["qidui"]) {
            if (is7Dui(cards, cd)) {
                return true;
            }
        }
        return this.canHuLaizi(cards, cd);
    }
    majiang.canHuLaizi = function (oCards, cd)
    {
        var cards = [];
        var laizi = 0;

        for (var i = 0; i < oCards.length; i++) {
            if (oCards[i] == 200) {
                laizi++;
            }
            else {
                cards.push(oCards[i]);
            }
        }
        if (cd == 200) {
            laizi++;
        }
        else if (cd) {
            cards.push(cd);
        }
        if ((cards.length + laizi + 1) % 3 != 0) {
            return false;
        }
        cards.sort(function(a, b) {
            return a - b;
        })

        //单吊癞子时算听牌计算量太大会导致卡顿
        if ((MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP || MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ)&& !MjClient.data.sData.tData.areaSelectMode["zuoJiang258"] && laizi >= 1) {
            var cardsCopy = cards.slice();
            cardsCopy.splice(cardsCopy.indexOf(cd), 1);
            if (isPu(cardsCopy, laizi - 1)) {
                return true;
            }
        }

        // 依次删除一对牌做将，其余牌全部成扑则可胡
        for (var i = 0; i < cards.length; i++) {
            if (i > 0 && cards[i] == cards[i - 1]){
                continue; // 和上一次是同样的牌，略过不计算
            }
            var card258 = cards[i] % 10;
            if (card258 != 2 && card258 != 5 && card258 != 8 && MjClient.data.sData.tData.areaSelectMode["zuoJiang258"])
                continue;
            if ((i + 1 < cards.length && cards[i] == cards[i + 1]) || laizi > 0) {
                var puCards = cards.slice();
                var puLaizi = laizi;
                puCards.splice(i, 1);
                if (puCards[i] == cards[i]) {
                    puCards.splice(i, 1);
                }
                else {
                    puLaizi--;
                }
                if (isPu(puCards, puLaizi)) {
                    return true;
                }
            }
        }
        if (laizi >= 2 && isPu(cards, laizi - 2)) {
            return true;
        }
        return false;
    }
    //听牌函数，判断手牌能否听牌
    majiang.canTing = function (cds,hun) {
        return this.canHu(cds, 200, hun);
    }

    majiang.canGangWhenTing = function(hand, card)
    {
        return true;
    }

    //是否可以杠
    majiang.canGang1 = function(peng, hand, putCount)
    {
        var rtn = [];
        for(var i = 0; i < peng.length; i++)
        {
            // if (hand.indexOf(peng[i]) >= 0)
            if(hand[hand.length - 1] == peng[i])
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
            if(num == 4 && cd != 71)
            {
                // if (putCount <= peng.length || cd == hand[hand.length - 1])
                // {
                //     rtn.push(cd);
                // }
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
        var sData = MjClient.data.sData;
        var tData = sData.tData;
        if(tData)
        {
            if(tData.areaSelectMode.queYiMen && tData.maxPlayer == 2){
                return 72 + tData.areaSelectMode["hongzhong"];
            }

            return 108 + tData.areaSelectMode["hongzhong"];
        }
        else
            return 108;
    };

    majiang.getAllCardsTypeTotal = function ()
    {
        var sData = MjClient.data.sData;
        var tData = sData.tData;
        if(tData)
        {
            var hongzhongNum = tData.areaSelectMode["hongzhong"] > 0 ? 1 : 0;
            if(tData.areaSelectMode.queYiMen && tData.maxPlayer == 2){
                return 18 + hongzhongNum;
            }

            return 27 + hongzhongNum;
        }
        else
            return 27;
    };

    majiang.setFlowerImg = function (node, pl)
    {

        var icountNode = node.getChildByName("head").getChildByName("huaCount");
        if(icountNode != null) {
            var icount = pl.mjflower.length;
            icountNode.visible = true;
            cc.log("set flower ------ icount = " + icount);
            changeAtalsForLabel(icountNode,icount);
        }
    };

    majiang.setJiaZhuNum = function (node, pl)
    {

    };

    // 混子牌统一替换为200
    majiang.transformCards = function(oCards, hun) {
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

    majiang.calTingSet = function(oCds, hun){
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
            if (MjClient.majiang.canHu(cds, allCardsArray[i], hun)) {

                if(MjClient.majiang.isCardFlower && MjClient.majiang.isCardFlower(allCardsArray[i])) continue; //听牌花牌要排除，东南西北，中发白有可能是花

                var count = 0;
                for (var j = 0; j < cds.length; j++) {
                    if (cds[j] == allCardsArray[i]) {
                        count++;
                    }
                }
                if (hun || count < 4) {
                    tingSet[allCardsArray[i]] = 1;
                }
            }
        }
        return tingSet;
    };

    majiang.isHunCard = function(cd, hun){
        if(cc.isNumber(hun) && cd == hun){
            return true;
        }
        if(cc.isArray(hun) && hun.indexOf(cd) >= 0){
            return true;
        }
        return false;
    };


    if (typeof(MjClient) != "undefined")
    {
        MjClient.majiang_TYZZ = majiang;
    }
    else
    {
        module.exports = majiang;
    }
})();
