
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
        var cards = [];
        for (var i = 0; i < oCards.length; i++) {
            if (oCards[i] == hunCard) {
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
        var cards = this.transformCards(oCards, hunCard);
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


    if (typeof(MjClient) != "undefined")
    {
        MjClient.majiang_lvliangkoudian = majiang;
    }
    else
    {
        module.exports = majiang;
    }
})();
