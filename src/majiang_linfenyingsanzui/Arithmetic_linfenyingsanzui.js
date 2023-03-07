
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
    

    //是否可以胡
    majiang.canHu = function(cards, cd)
    {
        if (is7Dui(cards, cd)) {
            return true;
        }
        return this.yingSanZuiCanHuLaizi(cards, cd);
    }

    //是否可以胡
    majiang.yingSanZuiCanHu = function(cards, allCards, cd, pl)
    {
        if (is7Dui(cards, cd)){
            return true;
        }
        if (this.yingSanZuiCanHuLaizi(cards, cd)) {
            cc.log("++++++++++============ yingSanZuiCanHuLaizi ============++++++++++ cards :" + JSON.stringify(cards));
            var ZuiScore = 0;
            if (cd == 200) {
                var tingSet = Object.keys(this.calTingSet(cards));
                for (var i = 0; i < tingSet.length; i++) {
                    ZuiScore = this.countZuiScore(cards, allCards, Number(tingSet[i]), pl);
                    if (ZuiScore >= 3) {
                        cc.log("++++++++++============ 听牌成功 ============++++++++++");
                        cc.log("++++++++++============ 听牌成功 ============++++++++++");
                        return true;
                    }
                }
            } else {
                ZuiScore = this.countZuiScore(cards, allCards, cd, pl);
                if (ZuiScore >= 3) {
                    cc.log("++++++++++============ 胡牌成功 ============++++++++++");
                    cc.log("++++++++++============ 胡牌成功 ============++++++++++");
                    return true;
                }
            }
        }
        return false;
    }

    //听牌函数，判断手牌能否听牌
    majiang.canTing = function (cards, allCards, pl) {
        return this.yingSanZuiCanHu(cards, allCards, 200, pl);
    }


   //是否可胡赖子
    majiang.yingSanZuiCanHuLaizi = function(oCards, cd) {
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
                if (this.yingSanZuiIsPu(puCards, puLaizi)) {
                    return true;
                }
            }
        }
        if (laizi >= 2 && this.yingSanZuiIsPu(cards, laizi - 2)) {
            return true;
        }
        return false;
    };

    // 若第一张是风牌的一张（东南西北中发白），则判断是否存在"三风"或者"三元"
    majiang.yingSanZuiIsPu = function(cards, laizi)
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
                if (this.yingSanZuiIsPu(puCards, puLaizi)) {
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
            if (this.yingSanZuiIsPu(puCards, puLaizi)) {
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
                        if (this.yingSanZuiIsPu(_puCards, _puLaizi)) return true;
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
                if (this.yingSanZuiIsPu(puCards, puLaizi)) return true;
            }
        }

        return false;
    };

    majiang.canGangWhenTing = function(hand, card, allCards, pl, type)
    {
        var hangAfterGang = [];
        for(var i = 0; i < hand.length; i++) {
            if(card != hand[i]) {
                hangAfterGang.push(hand[i]);
            }
        }
        //若听牌状态下，去掉所杠的牌不能再听则不能杠
        type = type || "mingGang";
        if (type == "mingGang") {
            pl.mjgang0.push(card);
        }
        if (!majiang.yingSanZuiCanHu(hangAfterGang, allCards, 200, pl)) {
            if (type == "mingGang") {
                pl.mjgang0.pop();
            }
            return false;
        }
        if (type == "mingGang") {
            pl.mjgang0.pop();
        }
        //求出之前听的牌
        var tingSet1 = this.calTingSet_curr(hand, null, allCards, pl);
        //求出杠之后听的牌
        var tingSet2 = this.calTingSet_curr(hangAfterGang, null, allCards, pl);
        if(Object.keys(tingSet2).length == 0){
            return false;
        }
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
    majiang.canGang1 = function(peng, hand, isTing, allCards, pl)
    {
        var rtn = [];
        for(var i = 0; i < peng.length; i++) {
            if(hand.indexOf(peng[i]) >= 0 && (!isTing || majiang.canGangWhenTing(hand, peng[i], allCards, pl))) {
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
            if(num == 4 && (!isTing || majiang.canGangWhenTing(hand, cd, allCards, pl, "anGang"))) {
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

    // 一条龙
    majiang.isYitiaolong = function(cards)
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
                return this.canHu(cds);
            }
        }
        return false;
    }

    // 求出所有听牌的合集，oSet已经听的牌
    majiang.calTingSet = function(oCds, oSet) {
        //先求出所有可能听的牌 set(手牌，顺一位的牌)
        var allSet = {};
        var tingSet = oSet || {};
        var cds = oCds.slice();
        if ((oCds.length + 1) % 3 == 0) { // 14、11、8、5、2张牌
            cds = oCds.slice(0, -1);
        }
        var counts = {};
        for (var i = 0; i < cds.length; i++) {
            var card = cds[i];
            allSet[card] = 1;
            if (!counts[card]) {
                counts[card] = 0;
            }
            counts[card]++;
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
            if (counts[tingCard] && counts[tingCard] >= 4) {
                continue;
            }
            if (this.canHu(cds, Number(tingCard))) {
                tingSet[tingCard] = 1;
            }
        }
        return tingSet;
    };

    // 求出所有听牌的合集，oSet已经听的牌
    majiang.calTingSet_curr = function(oCds, oSet, allCards, pl) {
        //先求出所有可能听的牌 set(手牌，顺一位的牌)
        var allSet = {};
        var tingSet = oSet || {};
        var cds = oCds.slice();
        if ((oCds.length + 1) % 3 == 0) { // 14、11、8、5、2张牌
            cds = oCds.slice(0, -1);
        }
        var counts = {};
        for (var i = 0; i < cds.length; i++) {
            var card = cds[i];
            allSet[card] = 1;
            if (!counts[card]) {
                counts[card] = 0;
            }
            counts[card]++;
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
            if (counts[tingCard] && counts[tingCard] >= 4) {
                continue;
            }
            if (this.yingSanZuiCanHu(cds, allCards, Number(tingCard), pl)) {
                tingSet[tingCard] = 1;
            }
        }
        return tingSet;
    };


    //孤将
    majiang.isGuJiang = function(cards, jiangCard, pl)
    {
        // 去除将牌
        var cardArr = cards.slice();
        for (var i = 0; i < 2; i++) {
            var deletePos = cardArr.indexOf(jiangCard);
            if (deletePos >= 0) cardArr.splice(deletePos, 1);
        }
        var color = Math.floor(jiangCard / 10);
        if (color < 3) {
            if (jiangCard != 0) {
                // 除去将牌的手牌加上吃碰杠
                cardArr = cardArr.concat(pl.mjchi).concat(pl.mjpeng).concat(pl.mjgang0).concat(pl.mjgang1);
                for (var i = 0; i < cardArr.length; i++) {
                    if (color == Math.floor(cardArr[i] / 10)) {
                        return false;
                    }
                }
            }
        }
        else return false;
        return true;
    }

    // 计算三风个数
    majiang.countFengNum = function(cards, jiangCard) {
        // 去除将牌
        var cardArr = cards.slice();
        for (var i = 0; i < 2; i++) {
            var deletePos = cardArr.indexOf(jiangCard);
            if (deletePos >= 0) cardArr.splice(deletePos, 1);
        }
        var arr = [];
        for (var i = 0; i < cardArr.length; i++) {
            if (cardArr[i] >= 31 && cardArr[i] <= 61) {
                arr.push(cardArr[i]);
            }
        }
        arr.sort();
        var countSanFeng = 0;
        function countColor(cArr){
            if (cArr.length == 0) {
                return true;
            }

            // 若第一张是风牌的一张（东南西北），则判断是否存在"三风
            var sanTypeCard = cArr[0];
            var fengArr = [];    // 风牌种类数组（东南西北）
            for (var i = 0; i < 4; i++) {
                if ((sanTypeCard+i*10) <= 61 && cArr.indexOf(sanTypeCard+i*10) >= 0) {
                    if ((sanTypeCard+i*10) != sanTypeCard) fengArr.push((sanTypeCard+i*10));
                }
            }
            if (fengArr != [] && fengArr.length > 1) {
                for (var i = 0; i < fengArr.length - 1; i++) {
                    for (var j = i + 1; j < fengArr.length; j++) {
                        var puCards = cArr.slice();
                        var deletePos1 = puCards.indexOf(sanTypeCard);
                        if (deletePos1 >= 0) puCards.splice(deletePos1, 1);
                        var deletePos2 = puCards.indexOf(fengArr[i]);
                        if (deletePos2 >= 0) puCards.splice(deletePos2, 1);
                        var deletePos3 = puCards.indexOf(fengArr[j]);
                        if (deletePos3 >= 0) puCards.splice(deletePos3, 1);
                        if (countColor(puCards)) {
                            countSanFeng++;
                            return true;
                        }
                        else  countSanFeng = 0;
                    }
                }
            }
            // 若第一张是刻子中的一张
            var keziCount = 1;
            var keziCard = cArr[0];
            if (cArr[1] == keziCard) {
                keziCount++;
            }
            if (cArr[2] == keziCard) {
                keziCount++;
            }
            if (keziCount == 3) {
                var puCards = cArr.slice();
                for (var i = 0; i < 3; i++) {
                    var deletePos = puCards.indexOf(keziCard);
                    if (deletePos >= 0) {
                        puCards.splice(deletePos, 1);
                    }
                }
                if (countColor(puCards)) {
                    return true;
                }
            }
            return false;
        }
        if (JSON.stringify(arr) == JSON.stringify([31,31,41,41,51,51,61,61,61])) {
            countSanFeng = 3;
        }
        else if (JSON.stringify(arr) == JSON.stringify([31,31,31,41,41,41,51,51,51,61,61,61])) {
            countSanFeng = 4;
        }
        else {
            countColor(arr);
        }
        if (countSanFeng == 3) { // 存在三幅三风，且最后摸的牌为风牌，则必为自摸三风
            if (arr.indexOf(cards[cards.length-1]) >= 0) {
                return 13;
            }
        }
        return countSanFeng;
    }

    // 计算三元个数
    majiang.countYuanNum = function(cards, jiangCard) {
        // 去除将牌
        var cardArr = cards.slice();
        for (var i = 0; i < 2; i++) {
            var deletePos = cardArr.indexOf(jiangCard);
            if (deletePos >= 0) cardArr.splice(deletePos, 1);
        }
        // 计算中发白的个数，最少的个数就是三元个数
        var arr = [0,0,0];
        for (var i = 0; i < cardArr.length; i++) {
            if (cardArr[i] == 71) {
                arr[0]++;
            }
            if (cardArr[i] == 81) {
                arr[1]++;
            }
            if (cardArr[i] == 91) {
                arr[2]++;
            }
        }
        return Math.min(Math.min(arr[0], arr[1]), arr[2]);
    }

    // 坎张
    majiang.isKanzhang = function(oCards)
    {
        var cards = oCards.slice();
        var cd = cards.pop();
        if (cd < 30 && cards.indexOf(cd + 1) >= 0 && cards.indexOf(cd - 1) >= 0) {
            cards.splice(cards.indexOf(cd + 1), 1);
            cards.splice(cards.indexOf(cd - 1), 1);
            if (this.canHu(cards)) {
                return true;
            }
        }
        return false;
    };
    // 边张
    majiang.isBianzhang = function(oCards)
    {
        var cards = oCards.slice();
        var cd = cards.pop();
        if (cd % 10 == 3 && cards.indexOf(cd - 2) >= 0 && cards.indexOf(cd - 1) >= 0) {
            cards.splice(cards.indexOf(cd - 2), 1);
            cards.splice(cards.indexOf(cd - 1), 1);
            if (this.canHu(cards)) {
                return true;
            }
        }
        if (cd % 10 == 7 && cards.indexOf(cd + 2) >= 0 && cards.indexOf(cd + 1) >= 0) {
            cards.splice(cards.indexOf(cd + 2), 1);
            cards.splice(cards.indexOf(cd + 1), 1);
            if (this.canHu(cards)) {
                return true;
            }
        }
        return false;
    };
    // 吊张
    majiang.isDiaozhang = function(oCards)
    {
        var cards = oCards.slice();
        var cd = cards.pop();
        if (cards.indexOf(cd) >= 0) {
            var oCds = cards.splice(cards.indexOf(cd), 1); // oCds:被删除的牌的数组
            cards.sort();
            if (this.yingSanZuiIsPu(cards, 0) && Object.keys(this.calTingSet(oCds.concat(cards))).length == 1) {
                return true;
            }
        }
        return false;
    };

    majiang.countZuiScore = function(cards, allCards, cd, pl){
        var cardsArr = cards.slice();
        if (cd) {
            cardsArr.push(cd);
        }
        else if (cd == 0) {
            cd = cardsArr.slice(cardsArr.length - 1, cardsArr.length);
        }
        var ZuiScore = 0;
        // 门清
        /*
        if (pl.mjpeng.length == 0 && pl.mjgang0.length == 0) {
            ZuiScore++;
            cc.log("ZuiScore============ 门清 ============"+ZuiScore);
        }
        */

        // 缺1门
        if (this.calLack(allCards) == 1) {
            ZuiScore += 1;
            cc.log("ZuiScore============ 缺1门 ============"+ZuiScore);
        }
        // 缺2门, 缺3门
        if (this.calLack(allCards) >= 2) {
            ZuiScore += 3;
            cc.log("ZuiScore============ 缺2,3门 ============"+ZuiScore);
        }
        var jiangCard = this.findJiang(cardsArr);
        // 孤将
        if (this.isGuJiang(cardsArr, jiangCard, pl)) {
            ZuiScore++;
            cc.log("ZuiScore============ 孤将 ============"+ZuiScore);
        }
        // 三风
        var sanFengNum = this.countFengNum(cardsArr, jiangCard);
        if (sanFengNum == 1) {
            ZuiScore += 1;
            cc.log("ZuiScore============ 三风1 ============"+ZuiScore);
        } else if (sanFengNum == 2) {
            ZuiScore += 3;
            cc.log("ZuiScore============ 三风2 ============"+ZuiScore);
        } else if (sanFengNum == 3) {
            ZuiScore += 7;
            cc.log("ZuiScore============ 三风3 ============"+ZuiScore);
        } else if (sanFengNum == 13) {
            ZuiScore += 10;
            cc.log("ZuiScore========== 自摸三风3 ============"+ZuiScore);
        }  else if (sanFengNum == 4) {
            ZuiScore += 50;
            cc.log("ZuiScore============ 三风4 ============"+ZuiScore);
        }
        // 三元
        var sanYuanNum = this.countYuanNum(cardsArr, jiangCard);
        if (cd >= 71 && cd <= 91) { // 自摸三元
            if (sanYuanNum == 1) {
                ZuiScore += 2;
                cc.log("ZuiScore============ 自摸三元1 ============"+ZuiScore);
            } else if (sanYuanNum == 2) {
                ZuiScore += 10;
                cc.log("ZuiScore============ 自摸三元2 ============"+ZuiScore);
            } else if (sanYuanNum == 3) {
                ZuiScore += 50;
                cc.log("ZuiScore============ 自摸三元3 ============"+ZuiScore);
            }
        }
        else {
            if (sanYuanNum == 1) {
                ZuiScore += 1;
                cc.log("ZuiScore============ 三元1 ============"+ZuiScore);
            } else if (sanYuanNum == 2) {
                ZuiScore += 7;
                cc.log("ZuiScore============ 三元2 ============"+ZuiScore);
            } else if (sanYuanNum == 3) {
                ZuiScore += 20;
                cc.log("ZuiScore============ 三元3 ============"+ZuiScore);
            }
        }
        if (sanYuanNum == 4){
            ZuiScore += 50;
            cc.log("ZuiScore============ 三元4 ============"+ZuiScore);
        }

        // 一张赢
        // if (tingSetLen == 0) {
        //     var tingArr = Object.keys(this.calTingSet(cards));
        //     if (tingArr.length === 1 && (sanYuanNum == 0 || !(tingArr[0] >= 71 && tingArr[0] <= 91))) {
        //         ZuiScore++;
        //         cc.log("ZuiScore============ 一张赢 ============"+ZuiScore);
        //     }
        // }
        // else if (tingSetLen == 1) {
        //     if (sanYuanNum == 0 || !(cd >= 71 && cd <= 91)) {
        //         ZuiScore++;
        //         cc.log("ZuiScore============ 一张赢 ============"+ZuiScore);
        //     }
        // }
        if ((cd >= 1 && cd <= 29) && (Object.keys(this.calTingSet(cards)).length === 1) && ( this.isKanzhang(cardsArr) || this.isBianzhang(cardsArr) || this.isDiaozhang(cardsArr) )) {
            ZuiScore++;
            cc.log("ZuiScore============ 一张赢 ============"+ZuiScore);
        }

        cc.log("cards======================== 手牌 ========================"+cards);
        cc.log("allCards======================== 所有牌 ========================"+allCards);
        cc.log("cardsArr======================== 手牌+ ========================"+cardsArr);
        cc.log("jiangCard======================== 将牌 ========================"+jiangCard);
        return ZuiScore;
    }

    // 找出胡牌时候的将牌
    majiang.findJiang = function(cds)
    {
        var cards = cds.slice().sort(function(a, b) {
            return a - b;
        });
        // 依次删除一对牌做将，其余牌全部成扑则可胡
        var fengArrs = [];
        for (var i = 0; i < cards.length - 1; i++) {
            if (i > 0 && cards[i] == cards[i - 1]){
                continue; // 和上一次是同样的牌，略过不计算
            }
            if (cards[i] == cards[i + 1]) {
                var puCards = cards.slice();
                puCards.splice(i, 2);
                if (this.yingSanZuiIsPu(puCards, 0)) {
                    if (cards[i] >= 31 && cards[i] <= 61) {
                        fengArrs.push([cards[i], this.countFengNum(cards, cards[i])]);
                    }
                    else {
                        return cards[i];
                    }
                }
            }
        }

        if (fengArrs.length > 1) {
            var max = fengArrs[0];
            for (var i = 1; i < fengArrs.length; i++) {
                if (max[1] < fengArrs[i][1]) max = fengArrs[i];
            }
            return max[0];
        }
        else if (fengArrs.length == 1) {
            return fengArrs[0][0];
        }

        return 0;
    }

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
        MjClient.majiang_linfenyingsanzui = majiang;
    }
    else
    {
        module.exports = majiang;
    }

})();
