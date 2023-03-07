
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

    // 一条龙
    majiang.isYitiaolong = function(cards, cd)
    { //一条龙：同色一至九
        for (var i = 0; i <= 20; i += 10) {
            var numCount = 0;
            for (var j = 1; j <= 9; j++) {
                if (cards.indexOf(i + j) >= 0){
                    numCount++;
                }
            }
            if (numCount >= 9) {
                var cds = cards.slice();
                for (var j = 1; j <= 9; j++) {
                    cds.splice(cds.indexOf(i + j), 1);
                }
                return canHuLaizi(cds, cd);
            }
        }
        return false;
    }

    //是否可以胡
    majiang.canHu = function(cards, cd)
    {
        if(cd && cd < 30 && cd % 10 < 4){
            return false; //1,2,3点不能自摸平胡
        }

        if (is7Dui(cards, cd)) {
            return true;
        }
        if (this.isShisanyao(cards, cd)){
            return true;
        }
        if (this.isYitiaolong(cards, cd)){
            return true;
        }
        return canHuLaizi(cards, cd);
    }

    //听牌函数，判断手牌能否听牌
    majiang.canTing = function (cards, allCards) {

        // if (this.isShisanyao(cards, 200)) {
        //     return true;
        // }
        var tingSet = calTingSet(cards);
        return Object.keys(tingSet).length > 0;
    }

    majiang.canGangWhenTing = function(hand, card, hunCard,isMingGang)
    {
        var hangAfterGang = [];
        var newCard = null;
        if (!isMingGang) {
            newCard = hand[hand.length-1];
        }

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
        for(var tingCard in tingSet2) {
            if (!(tingCard in tingSet1)) {
                return false;
            }
        }
        if (newCard != null && hangAfterGang.indexOf(newCard) > -1) {
            return false; // 补杠新增牌了
        }
        return true;
    }

    //是否可以杠
    majiang.canGang1 = function(peng, hand, isTing)
    {
        var rtn = [];
        for(var i = 0; i < peng.length; i++)
        {
            if(hand.indexOf(peng[i]) >= 0 && (!isTing || majiang.canGangWhenTing(hand, peng[i], null, false)))
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
            if(num == 4 && (!isTing || majiang.canGangWhenTing(hand, cd, null, false)))
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
        return num == 3 && (!isTing || majiang.canGangWhenTing(hand, cd, null, true));
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
        MjClient.majiang_xiaoyikoudian = majiang;
    }
    else
    {
        module.exports = majiang;
    }
})();
