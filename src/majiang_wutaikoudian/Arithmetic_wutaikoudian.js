
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
    majiang.canHu = function(oCards, cd, hunCard)
    {
        if (cd && cd < 30 && cd % 10 < 3) {
            return false; // 1.2点自摸平湖都不行
        }
        var tData = MjClient.data.sData.tData;
        var cards = this.transformCards(oCards, hunCard);
        if (tData.areaSelectMode["shisanyao"] && tData.areaSelectMode["playType"] == 0) {
            if (this.isShisanyao(cards, cd)) {
                return true;
            }
        }
        if (is7Dui(cards, cd)) {
            return true;
        }
        return canHuLaizi(cards, cd);
    }

    majiang.quantingpai = function(oCards, hunCard)
    {
        var cards = this.transformCards(oCards, hunCard);
        var tingSet = calTingSet(cards, hunCard);
        return Object.keys(tingSet).length > 15;
    }

    //听牌函数，判断手牌能否听牌
    majiang.canTing = function (cards, allCards, hunCard) {
        var tingSet = calTingSet(cards, hunCard);
        for (var card in tingSet) {
            card = parseInt(card);
            if (card > 30 || card % 10 >= 6) {
                return true;
            }
        }
        return false;
    }

    majiang.canGangWhenTing = function(hand, card, hun)
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
        if (!majiang.canTing(hangAfterGang, null, hun)) {
            return false;
        }
        //求出之前听的牌
        var tingSet1 = calTingSet(hand, hun);
        //求出杠之后听的牌
        var tingSet2 = calTingSet(hangAfterGang, hun);
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
    majiang.canGang1 = function(peng, hand, isTing, hun)
    {
        var rtn = [];
        for(var i = 0; i < peng.length; i++)
        {
            if(hand[hand.length - 1] == peng[i] && (!isTing || majiang.canGangWhenTing(hand, peng[i], hun)))
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
            if(num == 4 && (!isTing || majiang.canGangWhenTing(hand, cd, hun)))
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
        if (tData.areaSelectMode["playType"] == 1) {
            return 108;
        }
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
        MjClient.majiang_wutaikoudian = majiang;
    }
    else
    {
        module.exports = majiang;
    }
})();
