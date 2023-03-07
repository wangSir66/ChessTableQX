
(function() {
    var majiang = {};
    var flowerArray = [111, 121, 131, 141, 151, 161, 171, 181];//花的列表，根据不同来设置
    var allCardsArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29, 31, 41, 51, 61, 71, 81, 91];

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

    // 混子牌统一替换为200
    majiang.transformCards = function(oCards, hunCard) 
    {

        if(cc.isNumber(hunCard))
        {
            hunCard = new Set([hunCard]);
        }
        else if (cc.isArray(hunCard))
        {
            hunCard = new Set(hunCard);
        }

        var cards = [];
        for (var i = 0; i < oCards.length; i++) {
            if (hunCard && hunCard.has(oCards[i])) {
                cards.push(200); 
            }
            else {
                cards.push(oCards[i]); 
            }
        }
        return cards;
    }

    //是否可以胡
    majiang.canHu = function(cards, cd, fgang)
    {
        if (cd) {
            if (cd < 30 && cd % 10 < 6) {
                return false;
            }
        }
        else {
            var last = cards[cards.length - 1];
            if (last < 30 && last % 10 < 3) {
                return false;
            }
        }
        if (fgang && fgang.length > 0) {
            cards = cards.slice();
            if (cd) {
                cards.push(cd);
            }
            var hasZfb = false;
            if(cards.indexOf(71) >= 0 && cards.indexOf(81) >= 0 && cards.indexOf(91) >= 0) {
                hasZfb = true;
                cards.splice(cards.indexOf(71), 1);
                cards.splice(cards.indexOf(81), 1);
                cards.splice(cards.indexOf(91), 1);
            }
            return hasZfb && canHuLaizi(cards);
        }
        if (is7Dui(cards, cd)) {
            return true;
        }
        return canHuLaizi(cards, cd);
    }   

    majiang.quantingpai = function(oCards, hunCard,fgang)
    {
        var cards = this.transformCards(oCards, hunCard);
        var tingSet = this.calTingSet(cards, hunCard,fgang);
        return Object.keys(tingSet).length > 15;
    }

    //听牌函数，判断手牌能否听牌
    majiang.canTing = function (cards, allCards, hunCard,fgang) {
        return Object.keys(this.calTingSet(cards, null, fgang)).length > 0;
    }
    majiang.calTingSet = function(oCds, oSet, fgang)
    {
        var tingSet = oSet || {};
        var cds = oCds.slice();
        if ((oCds.length + 1) % 3 == 0) { // 14、11、8、5、2张牌
            cds = oCds.slice(0, -1);
        }
        for (var i = 0; i < allCardsArray.length; i++) {
            cds.push(allCardsArray[i]);
            if (this.canHu(cds, 0, fgang)) {
                tingSet[allCardsArray[i]] = 1;
            }
            cds.pop();
        }
        
        return tingSet;
    };

    majiang.getCheckTingHuCards = function(selectCard,mjhandCard,fgang) {
        var copyhand = mjhandCard.slice();
        if (selectCard) {
            var index = copyhand.indexOf(selectCard);//排除当前选择的一张牌
            copyhand.splice(index,1);
        }
        var tingSet = null;
        tingSet = this.calTingSet(copyhand,null,fgang);
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
        cc.log("tingSet     ",JSON.stringify(tingSet));
        return tingSet;
    }

    majiang.canGangWhenTing = function(hand, card, hun, fgang, isFenggang)
    {
        var hangAfterGang = [];
        if (isFenggang) {
            hangAfterGang = hand.slice();
            hangAfterGang.splice(hangAfterGang.indexOf(31), 1);
            hangAfterGang.splice(hangAfterGang.indexOf(41), 1);
            hangAfterGang.splice(hangAfterGang.indexOf(51), 1);
            hangAfterGang.splice(hangAfterGang.indexOf(61), 1);
        }
        else {
            for(var i = 0; i < hand.length; i++)
            {
                if(card != hand[i])
                {
                    hangAfterGang.push(hand[i]);
                }
            }
        }
        //若听牌状态下，去掉所杠的牌不能再听则不能杠
        if (!majiang.canTing(hangAfterGang, null, hun,fgang)) {
            return false;
        }
        //求出之前听的牌
        var tingSet1 = this.calTingSet(hand, null,fgang);
        //求出杠之后听的牌
        var tingSet2 = this.calTingSet(hangAfterGang, null,fgang);
        //对比前后听的牌
        for(var tingCard in tingSet2) {
            if (!(tingCard in tingSet1)) {
                return false;
            }
        }
        //听牌不变可以杠
        return true;
    }

    var fengcards = [31,41,51,61,71,81,91];
    //是否可以杠
    majiang.canGang1 = function(peng, hand, isTing, hun, fgang, gangs)
    {
        var tData = MjClient.data.sData.tData;
        if (MjClient.majiang.getAllCardsTotal() - tData.cardNext < 13) 
        {
            return false;
        }

        var rtn = [];
        for(var i = 0; i < peng.length; i++)
        {
            if(hand.indexOf(peng[i]) >= 0 && (!isTing || this.canGangWhenTing(hand, peng[i], hun,fgang)))
            {
                //手牌里的牌Push到rtn中
                if (fengcards.indexOf(peng[i]) == -1 || fgang.length == 0) 
                {
                    rtn.push(peng[i]);
                }
            }
        }
        var cnum = {};
        for(var i = 0; i < hand.length; i++)
        {
            var cd = hand[i];
            var num = cnum[cd];
            if(!num)
            {
                num = 0;
            }
            num++;
            cnum[cd] = num;
            if(num == 4 && (!isTing || this.canGangWhenTing(hand, cd, hun,fgang)))
            {
                if (fengcards.indexOf(cd) == -1 || fgang.length == 0) 
                {
                    rtn.push(cd);
                }
            }
        }
        if (gangs) {
            for (var i = 0; i < gangs.length; i++) {
                if (fengcards.indexOf(gangs[i]) >= 0) {
                    return rtn;
                }
            }
        }
        var tData = MjClient.data.sData.tData;
        if (tData.areaSelectMode["daifeng"] && fgang.length == 0) 
        {
            cc.log(" 手牌里有东南西北",this.hasDnxb(hand),hand);
            if (this.hasDnxb(hand) && (!isTing || this.canGangWhenTing(hand, cd, hun, fgang, true))) 
            {
                if (this.isDnxb(hand[hand.length - 1]))
                {
                    MjClient.fgang = hand[hand.length - 1];
                }
                else
                {
                     MjClient.fgang = dnxb[0];
                }
                
                rtn.push(dnxb);
            }
        }

        return rtn;
    };
    majiang.getGang0 = function(oCards,card)
    {
        cc.log("card",card);
        var rtn = [];
        var num = 0;
        for(var i = 0; i < oCards.length; i++)
        {
            var cd = oCards[i];
            if (cd == card) 
            {
                num ++;
            }
        }
        MjClient.fgang = -1;
        cc.log("num    ",num);
        if (num == 3) 
        {
            rtn.push(card);
        }

        var tData = MjClient.data.sData.tData;
        if (tData.areaSelectMode["daifeng"]) 
        {      
            cc.log("是东南西北  ",this.isDnxb(card)," 手牌里有东南西北",this.hasDnxb(oCards,card));
            if (this.isDnxb(card) && this.hasDnxb(oCards,card)) 
            {
                MjClient.fgang = card;
                rtn.push(dnxb);
            }
        }

        return rtn; 
    };

    majiang.CardCount = function (pl)
    {
        var rtn = (pl.mjpeng.length + pl.mjgang0.length + pl.mjgang1.length) * 3 + pl.mjchi.length;
        if(pl.mjhand)
        {
            rtn += pl.mjhand.length;
        }
        if (pl.fgang) 
        {
            rtn += pl.fgang.length * 3; 
        }
        return rtn;
    };

    majiang.getAllCardsTotal = function ()
    {
        var tData = MjClient.data.sData.tData;
        return tData.shuffleCardsNum || 136;
    };

    majiang.setFlowerImg = function (node, pl)
    {

        var icountNode = node.getChildByName("head").getChildByName("huaCount");
        if(icountNode != null) {
            var icount = pl.mjflower.length;
            icountNode.visible = false;
            cc.log("set flower ------ icount = " + icount);
            //changeAtalsForLabel(icountNode,icount);
            icountNode.setString("花 x " + icount);
        }
    };

    majiang.setJiaZhuNum = function (node, pl)
    {

    };
    var dnxb = [31, 41, 51, 61];
    majiang.isDnxb = function(card)
    {
        return dnxb.indexOf(card) >= 0;
    };

    majiang.hasDnxb = function(cards, except)
    {
        for (var i = 0; i < dnxb.length; i++) {
            if (dnxb[i] == except) {
                continue;
            }
            if (cards.indexOf(dnxb[i]) == -1) {
                cc.log("dnxb[i]  ",dnxb[i]," cards",cards)
                return false;
            }
        }
        return true;
    };

    majiang.delDnxb = function(cards, except)
    {
        for (var i = 0; i < dnxb.length; i++) {
            if (dnxb[i] == except) {
                continue;
            }
            cards.splice(cards.indexOf(dnxb[i]), 1);
        }
    };
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


    if (typeof(MjClient) != "undefined")
    {
        MjClient.majiang_jingle = majiang;
    }
    else
    {
        module.exports = majiang;
    }
})();
