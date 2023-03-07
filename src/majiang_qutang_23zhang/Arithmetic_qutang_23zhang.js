
(function() {
    var majiang = {};
    var flowerArray = [111, 121, 131, 141]; //花的列表，根据不同来设置

    //是否是花
    majiang.isCardFlower = function(card)
    {
        return flowerArray.indexOf(card) >= 0;
    };

    // 统计[前十张]牌有几个花牌
    majiang.countFlowerForMe = function(mjhand, is10){
        if(mjhand === undefined) return 0;
        var hands = mjhand.slice();
        if(is10) hands = hands.slice(0, 10);
        var count = 0;
        for(var i = 0; i < hands.length; i ++){
            if(majiang.isCardFlower(hands[i])){
                count ++;
            }
        }
        return count;
    };

    //设置花，参数是[]，必须设置
    majiang.setFlower = function(flower)
    {
        flowerArray = flower || [];
    };

    //是否是混子
    majiang.isEqualHunCard = function(card)
    {
        return card === 200;
    };

    majiang.delWenQian = function(oCards)
    {
        var cards = oCards.slice();
        var recurrenceFun = function(cards){
            if(cards.indexOf(21) > -1 && cards.indexOf(22) > -1 && cards.indexOf(23) > -1){
                cards.splice(cards.indexOf(21), 1);
                cards.splice(cards.indexOf(22), 1);
                cards.splice(cards.indexOf(23), 1);
                recurrenceFun(cards);
            }
            return cards;
        };
        return recurrenceFun(cards);
    };


    // 判断是否是大张
    majiang.isDaZhang = function(card)
    {
        var daZhang = [1, 9, 11, 19, 21, 29, 31, 41, 51, 61];
        if (daZhang.indexOf(card) >= 0) {
            return true;
        }
        return false;
    };

    majiang.canGangWhenTing = function(hand, card)
    {
        var hangAfterGang = [];
        for(var i = 0; i < hand.length; i++)
        {
            if(card !== hand[i])
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
        if (Object.keys(tingSet1).length !== Object.keys(tingSet2).length){
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

    //是否可以胡
    majiang.canHu = function(cds, cd) {
        var handCards = cds.slice();
        var pl = getUIPlayer_changpai(0);
        var pengGangNum = pl.mjpeng.length + pl.mjgang0.length + pl.mjgang1.length;
        if(pengGangNum > 4) {          // 有权利报全荤
            if(cd) handCards.push(cd);
            handCards = this.delWenQian(handCards);
            if(!pl.isQuanHun) {        // 有权利，未报全荤，不能胡全荤的牌
                if(isDuiDuiHu(pl.mjchi, handCards)){
                    return false;
                }else{
                    return canHuLaizi(cds, cd);
                }
            }else{                      // 有权利，报全荤，只胡全荤的牌
                if(isDuiDuiHu(pl.mjchi, handCards)){
                    return true;
                }
            }
        }else{
            return canHuLaizi(handCards, cd);
        }
    };

    //听牌函数，判断手牌能否听牌
    majiang.canTing = function (cds) {
        return this.canHu(cds, 200);
    };

    //是否可以杠
    majiang.canGang1 = function(peng, hand, isTing, putCount, jiang)
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
            if(num == 4 && (!isTing || majiang.canGangWhenTing(hand, cd)))
            {
                rtn.push(cd);
            }
            else if (putCount == 0 && num == 3 && cd == jiang) { // 龙
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
            if (hand[i] === cd) num++;
        }
        return num === 3 && (!isTing || majiang.canGangWhenTing(hand, cd));
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
            if(hand[i] === cd)
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
        return 128;
    };

    majiang.setFlowerImg = function (node, pl)
    {

    };

    majiang.setJiaZhuNum = function (node, pl)
    {

    };


    if (typeof(MjClient) != "undefined")
    {
        MjClient.majiang_qutang_23zhang = majiang;
    }
    else
    {
        module.exports = majiang;
    }
})();
