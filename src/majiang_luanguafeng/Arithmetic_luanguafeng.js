
(function() {
    var majiang = {};
    var flowerArray = [31, 41, 51, 61, 71, 81, 91];//花的列表，根据不同来设置
    var allCards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29, 31, 41, 51, 61, 71, 81, 91];

    //是否是花
    majiang.isCardFlower = function(card)
    {
        var tData = MjClient.data.sData.tData;
        var newflower = flowerArray.slice();
        newflower.splice(newflower.indexOf(tData.hunCard),1);
        return newflower.indexOf(card) >= 0;
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
    majiang.canHu = function(oCards, cd, tData)
    {   
        var sData = MjClient.data.sData;
        var pData = sData.tData;
        var cards = this.transformCards(oCards, pData.hunCard);
        if (pData.areaSelectMode["qidui"] && is7Dui(cards, cd)) {
            return true;
        }
        return canHuLaizi(cards, cd);
    }

    majiang.quantingpai = function(oCards, hunCard,tData)
    {
        var cards = this.transformCards(oCards, hunCard);
        var tingSet = this.calTingSet(cards, null,tData);
        return Object.keys(tingSet).length > 15;
    }

    //听牌函数，判断手牌能否听牌
    majiang.canTing = function (cards,tData) {

        return this.canHu(cards, 200, tData);
    }

    majiang.calTingSet = function(oCds, oSet, tData)
    {
        if (!oCds) 
        {
            return [];
        }
        var tingSet = oSet || {};
        var cds = oCds.slice();
        if ((oCds.length + 1) % 3 == 0) { // 14、11、8、5、2张牌
            cds = oCds.slice(0, -1);
        }
        for (var i = 0; i < allCards.length; i++) {
            if (this.canHu(cds, allCards[i], tData)) {
                tingSet[allCards[i]] = 1;
            }
        }
        return tingSet;
    };
    majiang.getCheckTingHuCards = function(selectCard,mjhandCard,tData) {
        var copyhand = mjhandCard.slice();
        if (selectCard) {
            var index = copyhand.indexOf(selectCard);//排除当前选择的一张牌
            copyhand.splice(index,1);
        }
        var tingSet = null;
        tingSet = this.calTingSet(copyhand,null,tData);
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
    };
    majiang.canchangecolor = function(cd,cards,pl)
    {
        var tData = MjClient.data.sData.tData;
        //除去风癞子
        var fengcards = [31,41,51,61,71,81,91];
        var hunfeng = fengcards.indexOf(tData.hunCard);
        if (hunfeng >= 0) 
        {
            fengcards.splice(hunfeng,1);
        }
        //剩余风牌数
        var FengCounts = 0;
        if (cards && MjClient.rePlayVideo == -1) 
        {        
            for (var i = 0; i < cards.length; i++) 
            {
                if (fengcards.indexOf(cards[i]) >= 0) 
                {
                   FengCounts += 1;
                }
            }
        }
        //不是风牌
        if (fengcards.indexOf(cd) >= 0)
        {
            return false;
        }
        else
        {
            //手牌中没有风牌
            if (FengCounts == 0) 
            {
                return false;
            }
            else
            {
                //只有风对子
                if (pl.fengdui && pl.fengdui != -1 && FengCounts == 2) 
                {
                    return false;
                }
/*                else if((!pl.fengdui || pl.fengdui)&& FengCounts == 0)
                {
                    return false;
                }*/
            }

        }
        return true;

    }
    majiang.canGangWhenTing = function(mjhand, card, tData)
    {
        var hangAfterGang = [];
        for(var i = 0; i < mjhand.length; i++)
        {
            if(card != mjhand[i])
            {
                hangAfterGang.push(mjhand[i]);
            }
        }
        //若听牌状态下，去掉所杠的牌不能再听则不能杠
        if (!this.canTing(hangAfterGang, tData)) {
            return false;
        }
        //求出之前听的牌
        var tingSet1 = this.calTingSet(mjhand, null, tData);
        //求出杠之后听的牌
        var tingSet2 = this.calTingSet(hangAfterGang, null, tData);
        //对比前后听的牌
        for(var tingCard in tingSet2) {
            if (!(tingCard in tingSet1)) {
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
            if(hand[hand.length - 1] == peng[i] && (!isTing || this.canGangWhenTing(hand, peng[i], tData)))
            {
                //手牌里的牌Push到rtn中
                rtn.push(peng[i]);
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
            if(num == 4 && (!isTing || this.canGangWhenTing(hand, cd, tData)))
            {
                rtn.push(cd);
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
            icountNode.visible = true;
            cc.log("set flower ------ icount = " + icount);
            //changeAtalsForLabel(icountNode,icount);
            icountNode.setString("花 x " + icount);
        }
    };

    majiang.setJiaZhuNum = function (node, pl)
    {

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
        MjClient.majiang_luanguafeng = majiang;
    }
    else
    {
        module.exports = majiang;
    }
})();
