
(function() {
    var majiang = {};
    var flowerArray = [111, 121, 131, 141, 151, 161, 171, 181];//花的列表，根据不同来设置
    var allCards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29, 31, 41, 51, 61, 71, 81, 91];
    var allCards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29, 31, 41, 51, 61, 71, 81, 91];
    //是否是花
    majiang.isCardFlower = function(card, tData)
    {
        tData = tData || MjClient.data.sData.tData;
        if (tData && tData.hunCard.indexOf(card) >= 0) {
            return false;
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

    majiang.quantingpai = function(oCards, tData, deleteCard) // tData.hunCard
    {
        cc.log("=======================quantingpai oCards = " + oCards);
        var cards = this.transformCards(oCards, tData.hunCard, deleteCard);
        for (var i = 0; i < allCards.length; i++) {
            if (tData.hunCard.indexOf(allCards[i]) >= 0) {
                continue;
            }
            if (!this.canHu(cards, allCards[i], tData)) {
                return false;
            }
        }
        return true;
    }

    // 混子牌统一替换为200
    majiang.transformCards = function(oCards, hun, deleteCard)
    {
        var cards = [];
        for (var i = 0; i < oCards.length; i++) {
            if (oCards[i] === deleteCard) {
                continue;
            }
            if (hun.indexOf(oCards[i]) >= 0) {
                cards.push(200);
            }
            else {
                cards.push(oCards[i]);
            }
        }
        return cards;
    }

    //是否可以胡
    majiang.canHu = function(oCards, cd)
    {
        var tData = MjClient.data.sData.tData;
        //cc.log("=======================canHu oCards = " + oCards);
        var cards = this.transformCards(oCards, tData.hunCard);
        if (tData.areaSelectMode["qidui"] && is7Dui(cards, cd)) {
            return true;
        }
        return canHuLaizi(cards, cd);
    }

    majiang.canTing = function (cds)
    {
        var tingSet = calTingSet(cds);
        var tData = MjClient.data.sData.tData;
        for(var tingCard in tingSet)
        {
            var cd = Number(tingCard);
            if (tData.areaSelectMode["qidui"] && is7Dui(cds, cd)) {
                return true;
            }
        }
        return Object.keys(tingSet).length > 0;
    }

    majiang.canGangWhenTing = function(hand, card)
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
        if (!majiang.canTing(hangAfterGang)) {
            return false;
        }
        //求出之前听的牌
        var tingSet1 = calTingSet(hand);
        //求出杠之后听的牌
        var tingSet2 = calTingSet(hangAfterGang);
        //对比前后听的牌
        if (Object.keys(tingSet1).length != Object.keys(tingSet2).length){
            return false;
        }
        for(var tingCard in tingSet1) {
            if (!(tingCard in tingSet2)) {
                return false;
            }
        }
        //听牌不变可以杠
        return true;
    }

    //是否可以杠
    majiang.canGang1 = function(peng, hand, isTing, tData)
    {
        var rtn = [];
        for(var i = 0; i < peng.length; i++)
        {
            if(hand.indexOf(peng[i]) >= 0 && (!isTing || majiang.canGangWhenTing(hand, peng[i])))
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
            if(num == 4 && (!isTing || majiang.canGangWhenTing(hand, cd)) && tData.hunCard.indexOf(cd) < 0)
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
        return 144;
    };

    majiang.setFlowerImg = function (node, pl)
    {
        var tData = MjClient.data.sData.tData;
        var icountNode = node.getChildByName("head").getChildByName("huaCount");
        var huaX = node.getChildByName("head").getChildByName("huaX");
        var huaIcon = node.getChildByName("head").getChildByName("huaIcon");
        if(icountNode != null && pl && pl.mjflower) {
            var icount = pl.mjflower.length;
            if(tData.tState !== TableState.waitJiazhu)
            {
                icountNode.visible = true;
                huaIcon.visible = true;
                huaX.visible = true;
            }
            cc.log("set flower ------ icount = " + icount);
            changeAtalsForLabel(icountNode,icount);
        }
        else
        {
            node.getChildByName("head").visible = false;
        }
    };

    majiang.setMaiZhuangIcon = function (node, pl)
    {
        var icountNode = node.getChildByName("head").getChildByName("maizhuangicon");
        icountNode.visible = false;
        if(pl && pl.jiazhuNum > 0)
        {
            icountNode.visible = true;
        }
    };

    majiang.setJiaZhuNum = function (node, pl)
    {

    };


    //是否可以吃
    majiang.canChi = function(hand, cd)
    {
        var num = [0, 0, 0, 0, 0];
        var rtn = [];
        for(var i = 0; i < hand.length; i++)
        {
            var dif = hand[i] - cd;
            switch (dif)
            {
                case -2:
                case -1:
                case 1:
                case 2:
                    if(!majiang.isEqualHunCard(hand[i]) && !majiang.isEqualHunCard(cd))
                    {
                        num[dif + 2]++;
                    }
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


    //求出，听牌时，选择一张牌能胡的牌的张数 by sking
    majiang.getCheckTingHuCards = function(selectCard,mjhandCard) {
        var copyhand = mjhandCard.slice();
        if (selectCard) {
            var index = copyhand.indexOf(selectCard);//排除当前选择的一张牌
            copyhand.splice(index,1);
        }

        var tingSet = null;
        tingSet = calTingSet(copyhand, MjClient.data.sData.tData);
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

    if (typeof(MjClient) != "undefined")
    {
        MjClient.majiang_haianbaida = majiang;
    }
    else
    {
        module.exports = majiang;
    }
})();
