
(function() {
    var majiang = {};
    majiang.wanfa1928 = [true, false, true];
    var flowerArray = [111, 121, 131, 141, 151, 161, 171, 181];//花的列表，根据不同来设置

    //是否是花
    majiang.isCardFlower = function(card)
    {
        return flowerArray.indexOf(card) >= 0;
    };

    //设置花，参数是[]，必须设置
    majiang.setFlower = function(flower)
    {
        flowerArray = flower || [];
    };

    //是否是混子
    majiang.isEqualHunCard = function(card)
    {
        return card == 200;
    };


    //是否可以胡
    majiang.canHu = function(cards, cd)
    {
        var tData = MjClient.data.sData.tData;
        var sanmen = tData.areaSelectMode["sanmen"];
        var jiazhang = tData.areaSelectMode["jiazhang"];
        var special = tData.areaSelectMode["special"];
        majiang.wanfa1928 = [sanmen,jiazhang,special];
        var pl = getUIPlayer(0);
        var allCards = cards.concat(pl.mjgang0).concat(pl.mjgang1).concat(pl.mjpeng).concat([cd]);

        if (is7Dui(cards, cd) || this.isSameColor(allCards) || this.isAllFeng(allCards)){
            return true;
        }

        if (this.canHuLaizi(cards, cd))
        {
            var lack = calLack(allCards);
            if(lack > 0)
            {
                return true;
            }
            else if(lack === 0 && majiang.wanfa1928[0] && this.isSanMenYaoGong(cards, cd))
            {
                return true;
            }
        }
        return false;
    };

    //听牌函数，判断手牌能否听牌
    majiang.canTing = function (cards) {
        return this.canHu(cards, 200);
    };


    //是否可胡赖子
    majiang.canHuLaizi = function(oCards, cd) {
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
                if (this.jiXianIsPu(puCards, puLaizi)) {
                    return true;
                }
            }
        }
        if (laizi >= 2 && this.jiXianIsPu(cards, laizi - 2)) {
            return true;
        }
        return false;
    };

    // 若第一张是风牌的一张（东南西北中发白），则判断是否存在"三风"或者"三元"
    majiang.jiXianIsPu = function(cards, laizi)
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
                if (this.jiXianIsPu(puCards, puLaizi)) {
                    return true;
                }
            }
        }


        // 若第一张为夹张
        if (majiang.wanfa1928[1] || majiang.wanfa1928[2]) {
            if (cards[0] >= 1 && cards[0] <= 29) {
                var color = Math.floor(cards[0]/10);
                var arr = [[1,9],[2,8],[3,7]]; // 夹张范围1-9、2-8、3-7
                var jiaType = [[1,9],[2,8]]; // 夹类型
                // t=1:1-9 t=2:2-8
                for (var t = 1; t < 3; t++) {
                    // 获取夹张范围
                    var arrFW = [];
                    if (jiaType[t-1][0] == 1) {
                        if (majiang.wanfa1928[2]) arrFW = arr[0];
                        else arrFW = arr[1];
                    }
                    else if (jiaType[t-1][0] == 2) {
                        if (majiang.wanfa1928[2]) arrFW = arr[1];
                        else arrFW = arr[2];
                    }
                    if (cards[0] % 10 == jiaType[t-1][0] || laizi > 0) {
                        var puCards = cards.slice();
                        var puLaizi = laizi;
                        // 除去1/9或2/8
                        for (var i = jiaType[t-1][0]; i <= jiaType[t-1][1]; i += jiaType[t-1][1] - jiaType[t-1][0]) {
                            var deletePos = puCards.indexOf(color * 10 + i);
                            if (deletePos >= 0) {
                                puCards.splice(deletePos, 1);
                            }
                            else {
                                puLaizi--;
                            }
                        }
                        if (puLaizi >= 0) {
                            // 除去夹的那张牌
                            var jiangeN = 1;
                            if (!majiang.wanfa1928[1]) { // 只夹119、199、228、288
                                jiangeN = arrFW[1] - arrFW[0];
                            }
                            for (var i = arrFW[0]; i <= arrFW[1]; i += jiangeN) {
                                var _puCards = puCards.slice();
                                var _puLaizi = puLaizi;
                                var deletePos = _puCards.indexOf(color * 10 + i);
                                if (deletePos >= 0) {
                                    _puCards.splice(deletePos, 1);
                                    if (_puLaizi >= 0 && this.jiXianIsPu(_puCards, _puLaizi)) {
                                        return true;
                                    }
                                }
                                else if (i == arrFW[1]) {
                                    _puLaizi--;
                                    if (_puLaizi >= 0 && this.jiXianIsPu(_puCards, _puLaizi)) {
                                        return true;
                                    }
                                }
                            }
                        }
                    }
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
            if (this.jiXianIsPu(puCards, puLaizi)) {
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
                        if (this.jiXianIsPu(_puCards, _puLaizi)) return true;
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
                if (this.jiXianIsPu(puCards, puLaizi)) return true;
            }
        }

        return false;
    };

    majiang.canGangWhenTing = function(hand, card)
    {
        var hangAfterGang = [];
        for(var i = 0; i < hand.length; i++) {
            if(card != hand[i]) {
                hangAfterGang.push(hand[i]);
            }
        }
        //若听牌状态下，去掉所杠的牌不能再听则不能杠
        if (!majiang.canHu(hangAfterGang, 200)) {
            return false;
        }
        //求出之前听的牌
        var tingSet1 = calTingSet(hand);
        //求出杠之后听的牌
        var tingSet2 = calTingSet(hangAfterGang);
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
        return true;
    };


    //是否可以杠
    majiang.canGang1 = function(peng, hand, isTing)
    {
        var rtn = [];
        for(var i = 0; i < peng.length; i++) {
            if(hand.indexOf(peng[i]) >= 0 && (!isTing || majiang.canGangWhenTing(hand, peng[i]))) {
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
            if(num == 4 && (!isTing || majiang.canGangWhenTing(hand, cd))) {
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

    majiang.isSameColor = function(cards)
    {
        var color = -1;
        for(var i = 0; i < cards.length; i++)
        {
            var cd = cards[i];
            if(this.isEqualHunCard(cd))
            {
                continue;
            }

            if(color == -1)
            {
                // 第一次找牌色,找到了就记录,以后按照这个处理
                color = Math.floor(cd / 10);
            }
            else if(color != Math.floor(cd / 10))
            {
                return false;

            }
        }
        return true;
    };


    majiang.isAllFeng = function(cards) {
        var fengCards = [31, 41, 51, 61, 71, 81, 91];

        for (var i = 0; i < cards.length; i++) {
            if (fengCards.indexOf(cards[i]) < 0) {
                return false;
            }
        }
        return true;
    };


    // 中心5
    /*
    majiang.isCenter5 = function(cards)
    {
        var cardArr = cards.slice();
        cardArr.sort();
        for (var i = 0; i < cardArr.length; i++) {
            var puCards = cardArr.slice();
            // 判断是否存在4/14/24
            if (i + 2 < puCards.length && puCards[i]%10 == 4) {
                for (var j = 0; j < 3; j++) {
                    var pos = puCards.indexOf(cardArr[i]+j);
                    if (pos >= 0) {
                        puCards.splice(pos, 1);
                    }
                }
                if(this.canHuLaizi(puCards)){
                    return true;
                }
            }
        }
        return false;
    };
    */
    majiang.isCenter5 = function(cards)
    {
        var cardArr = cards.slice();
        cardArr.sort();
        for (var i = 0; i < cardArr.length; i++) {
            // 判断是否存在4/14/24
            var cd = cardArr[i];
            if (cd % 10 == 4 && i + 2 < cardArr.length) {
                var num = 1;
                for (var j = 1; j < 3; j++) {
                    if (cardArr.indexOf(cd + j) >= 0) {
                        num++;
                    }
                }
                if(num == 3){
                    return true;
                }
            }
        }
        return false;
    };

    // 计算夹张个数
    majiang.countJiaZhang = function(cards)
    {
        // 去除将牌
        var cardArr = this.deleteJiang(cards);
        var arr = [];
        for (var i = 0; i < cardArr.length; i++) {
            if (cardArr[i] >= 1 && cardArr[i] <= 29) {
                arr.push(cardArr[i]);
            }
        }
        arr.sort(function(a, b) {
            return a - b;
        });
        var countJZ = 0;
        function countJiaZhangF(cArr){
            if (cArr.length == 0) {
                return true;
            }
            // 若第一张为夹张
            if (majiang.wanfa1928[1] || majiang.wanfa1928[2]) {
                var color = Math.floor(cArr[0]/10);
                var arr = [[1,9],[2,8],[3,7]]; // 夹张范围1-9、2-8、3-7
                var jiaType = [[1,9],[2,8]]; // 夹类型
                // t=1:1-9 t=2:2-8
                for (var t = 1; t < 3; t++) {
                    // 获取夹张范围
                    var arrFW = [];
                    if (jiaType[t-1][0] == 1) {
                        if (majiang.wanfa1928[2]) arrFW = arr[0];
                        else arrFW = arr[1];
                    }
                    else if (jiaType[t-1][0] == 2) {
                        if (majiang.wanfa1928[2]) arrFW = arr[1];
                        else arrFW = arr[2];
                    }
                    if (cArr[0] % 10 == jiaType[t-1][0]
                        && cArr.indexOf(color * 10 + jiaType[t-1][1]) >= 0) {
                        var puCards = cArr.slice();
                        // 除去1/9或2/8
                        for (var i = jiaType[t-1][0]; i <= jiaType[t-1][1]; i += jiaType[t-1][1] - jiaType[t-1][0]) {
                            var deletePos = puCards.indexOf(color * 10 + i);
                            if (deletePos >= 0) puCards.splice(deletePos, 1);
                        }
                        // 除去夹的那张牌
                        var jiangeN = 1;
                        if (!majiang.wanfa1928[1]) { // 只夹119、199、228、288
                            jiangeN = arrFW[1] - arrFW[0];
                        }
                        // 分1-2、3-8/9两个循环，为了尽可能多的匹配夹张个数（127899、117899）
                        for (var i = arrFW[0]; i <= arrFW[1]; i += jiangeN) {
                            if (i > 2) {
                                var _puCards = puCards.slice();
                                var deletePos = _puCards.indexOf(color * 10 + i);
                                if (deletePos >= 0) {
                                    _puCards.splice(deletePos, 1);
                                    if (countJiaZhangF(_puCards)) {
                                        countJZ++;
                                        return true;
                                    }
                                    else countJZ = 0;
                                }
                            }
                        }
                        for (var i = 1; i < 3; i++) {
                            var _puCards = puCards.slice();
                            var deletePos = _puCards.indexOf(color * 10 + i);
                            if (deletePos >= 0) {
                                _puCards.splice(deletePos, 1);
                                if (countJiaZhangF(_puCards)) {
                                    countJZ++;
                                    return true;
                                }
                                else countJZ = 0;
                            }
                        }
                    }
                }
            }
            // 若第一张是顺子中的一张 (理论上需判断下是条万筒)
            for (var first = cArr[0] - 2; first <= cArr[0]; first++) {
                if(first % 10 > 7 || first < cArr[0]) {
                    continue;
                }
                var shunCount = 0;
                for (var i = 0; i < 3; i++) {
                    if (cArr.indexOf(first + i) >= 0) {
                        shunCount++;
                    }
                }
                if (shunCount == 3) {
                    var puCards = cArr.slice();
                    for (var i = 0; i < 3; i++) {
                        var deletePos = puCards.indexOf(first + i);
                        if (deletePos >= 0) puCards.splice(deletePos, 1);
                    }
                    if (countJiaZhangF(puCards)) {
                        return true;
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
                    if (deletePos >= 0) puCards.splice(deletePos, 1);
                }
                if (countJiaZhangF(puCards)) {
                    return true;
                }
            }
            return false;
        }
        countJiaZhangF(arr);
        return countJZ;
    };

    majiang.deleteJiang=function (cards) {
        var jiangCard=this.findJiang(cards);
        var cardArr=new Array;
        for(var j=0;j<jiangCard.length;j++)
        {
            cardArr[j]=cards.slice();
            for(var i=0;i<2;i++)
            {
                var deletePos=cardArr[j].indexOf(jiangCard[j]);
                if (deletePos>=0) cardArr[j].splice(deletePos,1);
            }
        }

        return cardArr;
    }


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
                if (this.jiXianIsPu(puCards, 0)) {
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

    // 计算三风个数
    majiang.countFengNum = function(cards)
    {
        // 去除将牌
        var cardArr = this.deleteJiang(cards);
        var arr = [];
        for (var i = 0; i < cardArr.length; i++) {
            if (cardArr[i] >= 31 && cardArr[i] <= 61) {
                arr.push(cardArr[i]);
            }
        }
        arr.sort(function(a, b) {
            return a - b;
        });
        var countSanFeng = 0;
        function countColor(cArr){
            if (cArr.length == 0) {
                return true;
            }
            // 若第一张是风牌的一张（东南西北），则判断是否存在"三风
            var sanTypeCount = 0;
            var sanTypeCard = cArr[0];
            var sanTypeCardInt = Math.floor(sanTypeCard / 10);
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
                        else countSanFeng = 0;
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
        return countSanFeng;
    };

    // 计算三元个数
    majiang.countYuanNum = function(cards)
    {
        // 去除将牌
        var cardArr = this.deleteJiang(cards);
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
    };

    // 三门要公胡牌条件
    majiang.isSanMenYaoGong = function(cards, cd)
    {
        var cardsArr = cards.slice();
        if (cd) {
            cardsArr.push(cd);
        }
        // 中心5
        if (this.isCenter5(cardsArr)) {
            cc.log("===================== 中心5 =====================");
            return true;
        }
        // 三风
        if (this.countFengNum(cardsArr) > 0) {
            cc.log("===================== 三风 =====================");
            return true;
        }
        // 三元
        if (this.countYuanNum(cardsArr) > 0) {
            cc.log("===================== 三元 =====================");
            return true;
        }
        // 夹张
        if (this.countJiaZhang(cardsArr) > 0) {
            cc.log("===================== 夹张 =====================");
            return true;
        }
        // // 一张赢
        // if (Object.keys(calTingSet(cardsArr)).length === 1) {
        //     cc.log("===================== 一张赢 =====================");
        //     return true;
        // }
        return false;
    };


    if (typeof(MjClient) != "undefined")
    {
        MjClient.majiang_linfenjixian = majiang;
    }
    else
    {
        module.exports = majiang;
    }

})();
