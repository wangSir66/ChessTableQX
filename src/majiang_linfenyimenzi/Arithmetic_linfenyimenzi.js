
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

    //听牌函数，判断手牌能否听牌
    majiang.canTing = function (cards, allCards) {
        if (this.yiMenZiCanHu(cards, allCards, 200)) {
            var tingSet = calTingSet(cards);
            return Object.keys(tingSet).length > 0;
        }
        return false;
    }


    //是否可以胡
    majiang.canHu = function(cards, cd)
    {
        if (is7Dui(cards, cd)) {
            return true;
        }
        return this.yiMenZiCanHuLaizi(cards, cd);
    }

    //是否可以胡
    majiang.yiMenZiCanHu = function(cards, allCards, cd)
    {
        if(this.calLack(allCards) >= 2)
        {
            if(is7Dui(cards, cd) || this.yiMenZiCanHuLaizi(cards, cd))
            {
                return true;
            }
        }

        return false;
    };

    //是否可胡赖子
     majiang.yiMenZiCanHuLaizi = function(oCards, cd) {
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
        // 依次删除一对牌做将，其余牌全部成扑则可胡
        for (var i = 0; i < cards.length; i++) {
            if (i > 0 && cards[i] == cards[i - 1]){
                continue; // 和上一次是同样的牌，略过不计算
            }
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
                if (this.yiMenZiIsPu(puCards, puLaizi)) {
                    return true;
                }
            }
        }
        if (laizi >= 2 && this.yiMenZiIsPu(cards, laizi - 2)) {
            return true;
        }
        return false;
    };

    // 若第一张是风牌的一张（东南西北中发白），则判断是否存在"三风"或者"三元"
    majiang.yiMenZiIsPu = function(cards, laizi)
    {
        if (cards.length == 0) {
            return true;
        }
        // 若第一张是顺子中的一张 (理论上需判断下是条万筒)
        for (var first = cards[0] - 2; first <= cards[0]; first++) {
            if (first % 10 > 7 || (laizi == 0 && first < cards[0])) {
                continue;
            }
            var shunCount = 0;
            for (var i = 0; i < 3; i++) {
                if (cards.indexOf(first + i) >= 0) {
                    shunCount++;
                }
            }
            if (shunCount == 3 || shunCount + laizi >= 3) {
                var puCards = cards.slice();
                var puLaizi = laizi;
                for (var i = 0; i < 3; i++) {
                    var deletePos = puCards.indexOf(first + i);
                    if (deletePos >= 0) {
                        puCards.splice(deletePos, 1);
                    }
                    else {
                        puLaizi--;
                    }
                }
                if (this.yiMenZiIsPu(puCards, puLaizi)) {
                    return true;
                }
            }
        }

        // 若第一张是刻子中的一张
        var keziCount = 1;
        var keziCard = cards[0];
        if (cards[1] == keziCard) {
            keziCount++;
        }
        if (cards[2] == keziCard) {
            keziCount++;
        }
        if (keziCount == 3 || keziCount + laizi >= 3) {
            var puCards = cards.slice();
            var puLaizi = laizi;
            for (var i = 0; i < 3; i++) {
                var deletePos = puCards.indexOf(keziCard);
                if (deletePos >= 0) {
                    puCards.splice(deletePos, 1);
                }
                else {
                    puLaizi--;
                }
            }
            if (this.yiMenZiIsPu(puCards, puLaizi)) {
                return true;
            }
        }

        // 若第一张是风牌的一张（东南西北中发白），则判断是否存在"三风"或者"三元"
        var sanTypeCount = 0;
        var sanTypeCard = cards[0];
        var sanTypeCardInt = Math.floor(sanTypeCard / 10);
        if (sanTypeCardInt > 2 && sanTypeCardInt < 7) {// 三风
            var fengArr = [];    // 风牌种类数组（东南西北）
            for (var i = 0; i < 4; i++) {
                if ((sanTypeCard+i*10) <= 61 && cards.indexOf(sanTypeCard+i*10) >= 0) {
                    if ((sanTypeCard+i*10) != sanTypeCard) fengArr.push((sanTypeCard+i*10));
                }
            }
            if ((fengArr != [] && fengArr.length > 1) || fengArr.length + laizi > 1) {
                var puLaizi = laizi;
                if (fengArr.length <= 1) {
                    fengArr.push(0);
                }
                for (var i = 0; i < fengArr.length - 1; i++) {
                    for (var j = i + 1; j < fengArr.length; j++) {
                        var _puCards = cards.slice();
                        var _puLaizi = puLaizi;
                        var deletePos1 = _puCards.indexOf(sanTypeCard);
                        if (deletePos1 >= 0) _puCards.splice(deletePos1, 1);
                        else _puLaizi--;
                        var deletePos2 = _puCards.indexOf(fengArr[i]);
                        if (deletePos2 >= 0) _puCards.splice(deletePos2, 1);
                        else _puLaizi--;
                        var deletePos3 = _puCards.indexOf(fengArr[j]);
                        if (deletePos3 >= 0) _puCards.splice(deletePos3, 1);
                        else _puLaizi--;
                        if (this.yiMenZiIsPu(_puCards, _puLaizi)) return true;
                    }
                }
            }
        }
        else if (sanTypeCardInt > 6 && sanTypeCardInt < 10) {// 三元
            for (var i = 0; i < 3; i++) {
                if (cards.indexOf(sanTypeCard+i*10) >= 0) sanTypeCount++;
            }
            if (sanTypeCount == 3 || sanTypeCount + laizi >= 3) {
                var puCards = cards.slice();
                var puLaizi = laizi;
                for (var i = 0; i < 3; i++) {
                    var deletePos = puCards.indexOf(sanTypeCard + i * 10);
                    if (deletePos >= 0) puCards.splice(deletePos, 1);
                    else puLaizi--;
                }
                if (this.yiMenZiIsPu(puCards, puLaizi)) return true;
            }
        }

        return false;
    };

    majiang.canGangWhenTing = function(hand, card, allCards)
    {
        var hangAfterGang = [];
        for(var i = 0; i < hand.length; i++) {
            if(card != hand[i]) {
                hangAfterGang.push(hand[i]);
            }
        }
        //若听牌状态下，去掉所杠的牌不能再听则不能杠
        if (!majiang.yiMenZiCanHu(hangAfterGang, allCards, 200)) {
            return false;
        }
        //求出之前听的牌
        var tingSet1 = this.calTingSet(hand);
        //求出杠之后听的牌
        var tingSet2 = this.calTingSet(hangAfterGang);
        //对比前后听的牌
        for(var tingCard in tingSet2) {
            if (!(tingCard in tingSet1)) {
                return false;
            }
        }
        //听牌不变可以杠

        //beforeGang杠前去掉可杠的牌剩下的牌
        var beforeGang = [];
        var mjhand = hand.slice(0, -1);
        for(var i = 0; i < mjhand.length; i++)
        {
            if(card !== mjhand[i])
            {
                beforeGang.push(mjhand[i]);
            }
        }

        if(hangAfterGang.length !== beforeGang.length)
        {
            return false;
        }
        hangAfterGang.sort();
        beforeGang.sort();
        for(var i = 0; i < hangAfterGang.length; i++)
        {
            if(hangAfterGang[i] !== beforeGang[i])
            {
                return false;
            }
        }
        return true;
    };


    //是否可以杠
    majiang.canGang1 = function(peng, hand, isTing, allCards)
    {
        var rtn = [];
        for(var i = 0; i < peng.length; i++) {
            if(hand.indexOf(peng[i]) >= 0 && (!isTing || majiang.canGangWhenTing(hand, peng[i], allCards))) {
                //手牌里的牌Push到rtn中
                rtn.push(peng[i]);
            }
        }
        var cnum = {};
        for(var i = 0; i < hand.length; i++) {
            var cd = hand[i];
            if(majiang.isEqualHunCard(cd)) {
                continue;
            }
            var num = cnum[cd];
            if(!num) {
                num = 0;
            }
            num++;
            cnum[cd] = num;
            if(num == 4 && (!isTing || majiang.canGangWhenTing(hand, cd, allCards))) {
                rtn.push(cd);
            }
        }
        return rtn;
    };

    //是否可以明杠
    majiang.canGang0 = function(hand, cd, isTing, allCards)
    {
        if(majiang.isEqualHunCard(cd)){//混牌不能杠
            return false;
        }
        var num = 0;
        for (var i = 0; i < hand.length; i++) {
            if (hand[i] == cd) num++;
        }
        return num == 3 && (!isTing || majiang.canGangWhenTing(hand, cd, allCards));
    };

    //是否可以碰
    majiang.canPeng = function(hand, cd)
    {
        var num = 0;
        if(majiang.isEqualHunCard(cd)){//混牌不能碰
            return false;
        }
        for(var i = 0; i < hand.length; i++) {
            if(hand[i] == cd) {
                num++;
            }
        }
        return num >= 2;
    };

    majiang.CardCount = function (pl)
    {
        var rtn = (pl.mjpeng.length + pl.mjgang0.length + pl.mjgang1.length) * 3 + pl.mjchi.length;
        if(pl.mjhand) {
            rtn += pl.mjhand.length;
        }
        return rtn;
    };

    majiang.getAllCardsTotal = function ()
    {
        return 136;
    };

    // 求出所有听牌的合集，oSet已经听的牌
    majiang.calTingSet = function(oCds, oSet) {
        //先求出所有可能听的牌 set(手牌，顺一位的牌)
        var allSet = {};
        var tingSet = oSet || {};
        var cds = oCds.slice();
        if ((oCds.length + 1) % 3 == 0) { // 14、11、8、5、2张牌
            cds = oCds.slice(0, -1);
        }
        for (var i = 0; i < cds.length; i++) {
            var card = cds[i];
            allSet[card] = 1;
            if (card < 29) {
                if ((card + 1) % 10 > 0)  {
                    allSet[card + 1] = 1;
                }
                if ((card - 1) % 10 > 0)  {
                    allSet[card - 1] = 1;
                }
            }
            else if (card >= 31 && card <= 61) {
                allSet[31] = 1;
                allSet[41] = 1;
                allSet[51] = 1;
                allSet[61] = 1;
            }
            else if (card >= 71 && card <= 91) {
                allSet[71] = 1;
                allSet[81] = 1;
                allSet[91] = 1;
            }
        }
        //求出能听多少牌
        for(var tingCard in allSet) {
            var count = 0;
            for (var j = 0; j < cds.length; j++) {
                if (cds[j] == tingCard) {
                    count++;
                }
            }
            if (count < 4 && this.canHu(cds, Number(tingCard))) {
                tingSet[tingCard] = 1;
            }
        }
        return tingSet;
    };


    //求缺一门
    majiang.calLack = function(cards) {
        var cardSet = [0, 0, 0];
        var lack = 0;
        for (var i = 0; i < cards.length; i++) {
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

    majiang.setJiaZhuNum = function (node, pl)
    {

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

    if (typeof(MjClient) != "undefined")
    {
        MjClient.majiang_linfenyimenzi = majiang;
    }
    else
    {
        module.exports = majiang;
    }
})();
