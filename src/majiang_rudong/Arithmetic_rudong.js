
(function() {
    var majiang = {};
    var flowerArray = [111, 121, 131, 141, 151];//花的列表，根据不同来设置

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

    //是否可以胡
    majiang.canHu = function(cards, cd)
    {
        return canHuLaizi(cards, cd);
    }

    //听牌函数，判断手牌能否听牌
    majiang.canTing = function (cds) {
        var tingSet = calTingSet(cds);
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
    majiang.canGang1 = function(peng, hand, isTing, putCount, jiang, jiang2, long)
    {
        cc.log(">>>>>>>>>>>>>>jjjjjjjjjjj"+JSON.stringify(long)+jiang +"  "+jiang2)
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
            if (!long || long.indexOf(cd) == -1) {
                if(num == 4 && (!isTing || majiang.canGangWhenTing(hand, cd)))
                {
                    rtn.push(cd);
                }
                else if (num == 3 && !isTing && (cd == jiang || cd == jiang2)) { // 龙
                    rtn.push(cd);
                }
                else if (num == 2 && (cd == jiang && cd == jiang2) && long) { // 起手两张的龙
                    rtn.push(cd);
                }
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
        var rtn = (pl.mjpeng.length  + pl.mjgang0.length + pl.mjgang1.length) * 3 + pl.mjchi.length;
        if(pl.mjhand)
        {
            rtn += pl.mjhand.length;
        }
        return rtn;
    };

    majiang.getAllCardsTotal = function ()
    {
        if (MjClient.data.sData.tData.areaSelectMode["daixi"]) {
            return 125;
        }
        return 120;
    };

    majiang.setFlowerImg = function (node, pl)
    {

        // var icountNode = node.getChildByName("head").getChildByName("huaCount");
        // if(icountNode != null) {
        //     var icount = pl.mjflower.length;
        //     icountNode.visible = true;
        //     cc.log("set flower ------ icount = " + icount);
        //     changeAtalsForLabel(icountNode,icount);
        // }
    };

    majiang.setMaiZhuangIcon = function (node, pl)
    {
        var icountNode = node.getChildByName("head").getChildByName("maizhuangicon");
        icountNode.visible = false;
        if(pl.jiazhuNum > 0)
        {
            icountNode.visible = true;
        }
    };


    var laojiangPoint = {71: 2, 81: 1, 91:0, 9:0};
    var TYPE_INDEX = {
        peng: 0,
        anke: 1,
        minggang: 2,
        angang: 3,
        long: 4,
    }
    majiang.calCardBaseScore = function(tData, card, type) {
        if (tData.hunCard2 in laojiangPoint) { // 翻两个大将
            if (card == tData.hunCard || card == tData.hunCard2) {
                return [32, 96, 0, 96, 128][type];
            }
            if (card in laojiangPoint) {
                return [16, 32, 64, 96, 128][type];
            }
        }
        else if (tData.hunCard in laojiangPoint) { // 翻一个大将、一个普通牌
            if (card == tData.hunCard) {
                return [16, 48, 0, 48, 64][type];
            }
            if (card == tData.hunCard2) {
                return [8, 24, 0, 24, 32][type];
            }
            if (card in laojiangPoint) {
                return [8, 16, 32, 48, 64][type];
            }
            if (card % 10 == tData.hunCard2 % 10) {
                return [4, 8, 16, 24, 32][type];
            }
        }
        else if (tData.hunCard == tData.hunCard2) { // 翻在同一张普通牌上
            if (card == tData.hunCard) {
                return [0, 0, 0, 0, 64][type];
            }
            if (card in laojiangPoint) {
                return [4, 8, 16, 24, 32][type];
            }
            if (card % 10 == tData.hunCard % 10) {
                return [8, 16, 32, 48, 64][type];
            }
        }
        else if (tData.hunCard % 10 == tData.hunCard2 % 10 && tData.hunCard < 30 && tData.hunCard2 < 30) { // 翻将在不同的普通牌上、但是点数一样
            if (card == tData.hunCard || card == tData.hunCard2) {
                return [16, 48, 0, 48, 64][type];
            }
            if (card in laojiangPoint) {
                return [4, 8, 16, 24, 32][type];
            }
            if (card % 10 == tData.hunCard % 10) {
                return [8, 16, 32, 48, 64][type];
            }
        }
        else { // 翻将在不同的普通牌上
            if (card == tData.hunCard || card == tData.hunCard2) {
                return [8, 24, 0, 24, 32][type];
            }
            if (card in laojiangPoint) {
                return [4, 8, 16, 24, 32][type];
            }
            if (card % 10 == tData.hunCard % 10 && tData.hunCard < 30 || card % 10 == tData.hunCard2 % 10 && tData.hunCard2 < 30) {
                return [4, 8, 16, 24, 32][type];
            }
        }
        return [2, 4, 8, 12, 16][type];
    }
    // 牌面分 碰X1明杠X4暗杠X6龙X8
    majiang.calOutScore = function(tData, pl) {
        //cc.log("majiang.calOutScore>>>>>");
        cc.log(JSON.stringify(pl.mjpeng));
        cc.log(JSON.stringify(pl.mjgang0));
        cc.log(JSON.stringify(pl.mjgang1));
        cc.log(JSON.stringify(pl.long));
        var score = 0;
        for (var i = 0; i < pl.mjpeng.length; i++) {
            score += this.calCardBaseScore(tData, pl.mjpeng[i], TYPE_INDEX.peng);
        }
        for (var i = 0; i < pl.mjgang0.length; i++) {
            if (pl.long.indexOf(pl.mjgang0[i]) == -1) {
                score += this.calCardBaseScore(tData, pl.mjgang0[i], TYPE_INDEX.minggang);
            }
        }
        for (var i = 0; i < pl.mjgang1.length; i++) {
            if (pl.long.indexOf(pl.mjgang1[i]) == -1) {
                score += this.calCardBaseScore(tData, pl.mjgang1[i], TYPE_INDEX.angang);
            }
        }
        for (var i = 0; i < pl.long.length; i++) {
            score += this.calCardBaseScore(tData, pl.long[i], TYPE_INDEX.long);
        }
        return score;
    }


    if (typeof(MjClient) != "undefined")
    {
        MjClient.majiang_rudong = majiang;
    }
    else
    {
        module.exports = majiang;
    }
})();
