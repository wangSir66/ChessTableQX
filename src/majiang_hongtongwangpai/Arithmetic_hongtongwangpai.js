
(function() {
    var majiang = {};
    var flowerArray = [111, 121, 131, 141, 151, 161, 171, 181];//花的列表，根据不同来设置
    var allCards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29, 31, 41, 51, 61, 71, 81, 91];

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

    var fengs = majiang.fengs = new Set([31, 41, 51, 61]);
    var jians = majiang.jians = new Set([71, 81, 91]);
    var fengsGroup = [[31,41,51], [31,41,61], [31,51,61], [41,51,61]];
    // 判断一副牌是否成扑 cards需要按数字排序
    var isPu2 = function(cards, laizi, hun){
        if (cards.length == 0) {
            return true;
        }
        // 若第一张是顺子中的一张 (理论上需判断下是条万筒)
        for (var first = cards[0] - 2; first <= cards[0]; first++) {
            if(first % 10 > 7 || (laizi == 0 && first < cards[0])) {
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
                if (isPu2(puCards, puLaizi, hun)) {
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
            if (isPu2(puCards, puLaizi, hun)) {
                return true;
            }
        }
        // 风顺子、王牌不能变换
        if (fengs.has(cards[0])) {
            for (var i = 0; i < fengsGroup.length; i++) {
                if (fengsGroup[i].indexOf(cards[0]) >= 0) {
                    var fengCount = 0;
                    for (var j = 0; j < fengsGroup[i].length; j++) {
                        if (cards.indexOf(fengsGroup[i][j]) >= 0) {
                            fengCount++;
                        }
                    }
                    if (laizi > 0 && fengsGroup[i].indexOf(hun) >= 0) {
                        fengCount++;
                    }
                    if (fengCount == fengsGroup[i].length) {
                        var puCards = cards.slice();
                        var puLaizi = laizi;
                        for (var j = 0; j < fengsGroup[i].length; j++) {
                            var deletePos = puCards.indexOf(fengsGroup[i][j]);
                            if (deletePos >= 0) {
                               puCards.splice(deletePos, 1);
                            }
                            else {
                               puLaizi--;
                            }
                        }
                        if (isPu2(puCards, puLaizi, hun)) {
                            return true;
                        }
                    }
                }
            }
        }
        if (jians.has(cards[0])) {
            var jianCount = 0;
            for (var need of jians) {
                if (cards.indexOf(need) >= 0) {
                    jianCount++;
                }
            }
            if (laizi > 0 && jians.has(hun)) {
                jianCount++;
            }
            if (jianCount == jians.size) {
                var puCards = cards.slice();
                var puLaizi = laizi;
                for (var need of jians) {
                    var deletePos = puCards.indexOf(need);
                    if (deletePos >= 0) {
                       puCards.splice(deletePos, 1);
                    }
                    else {
                       puLaizi--;
                    }
                }
                if (isPu2(puCards, puLaizi, hun)) {
                    return true;
                }
            }
        }
        return false;
    }
    majiang.isPu = isPu2;

    // 通用麻将胡牌算法
    majiang.canHuLaizi = function(oCards, cd, hun) {
        var cards = [];
        var laizi = 0;
        for (var i = 0; i < oCards.length; i++) {
            if (oCards[i] == hun) {
                laizi++;
            }
            else {
                cards.push(oCards[i]);
            }
        }
        if (cd) {
            if (cd == hun) {
                laizi++;
            }
            else {
                cards.push(cd);
            }
        }
        if ((cards.length + laizi + 1) % 3 != 0) {
            return false;
        }
        cards.sort(function(a, b) {
            return a - b;
        })
        // cc.log("==================",cards, laizi);
        // 依次删除一对牌做将，其余牌全部成扑则可胡
        for (var i = 0; i < cards.length; i++) {
            if (i > 0 && cards[i] == cards[i - 1]){
                continue; // 和上一次是同样的牌，略过不计算
            }
            if (cards[i] === cards[i + 1]) {
                var puCards = cards.slice();
                puCards.splice(i, 2);
                if (this.isPu(puCards, laizi, hun)) {
                    return true;
                }
            }
            if (laizi > 0) {
                var puCards = cards.slice();
                puCards.splice(i, 1);
                if (this.isPu(puCards, laizi - 1, hun)) {
                    return true;
                }
            }
        }
        if (laizi >= 2 && this.isPu(cards, laizi - 2, hun)) {
            return true;
        }
        return false;
    }

    //是否可以胡
    majiang.canHu = function(cards, cd, pl, tData)
    {
        var hun = this.getHunCard(pl, tData, cards.concat([cd]));
        var wanfa = tData.areaSelectMode["wanfa"];
        if (pl.yingkou && pl.yingkou != -1 && pl.yingkou != (cd || cards[cards.length - 1])) {
            return false;
        }
        // 缺一门缺二门检查
        var allCard = cards.concat(pl.mjpeng).concat(pl.mjgang1).concat(pl.mjgang0).concat([cd]);
        var lack = calLack(allCard, hun);
        if (wanfa == "pinghu") {
            if (lack == 0) {
                return false;
            }
        }
        else if (lack <= 1) {
            return false;
        }
        if (is7Dui(cards, cd)) {
            return true;
        }
        if (this.canHuLaizi(cards, cd, hun)) {
            if (wanfa == "pinghu") {
                if (pl.mjgang0.length + pl.mjgang1.length > 0) {
                    return true;
                }
                if (lack >= 2) {
                    return true;
                }
                var cs = pl.mjhand.slice();
                if (cd) {
                    cs.push(cd);
                }
                var fengCount = 0;
                for (var k of fengs) {
                    if (cs.indexOf(k) >= 0) {
                        fengCount++;
                    }
                }
                if (fengCount >= 3) {
                    return true;
                }
                var jianCount = 0;
                for (var k of jians) {
                    if (cs.indexOf(k) >= 0) {
                        jianCount++;
                    }
                }
                if (jianCount >= 3) {
                    return true;
                }
                if (this.isYitiaolong(cards, hun)) {
                    return true;
                }
                var puCards = [];
                var laizi = 0;
                for (var i = 0; i < cards.length; i++) {
                    if (cards[i] == hun) {
                        laizi++;
                    }
                    else {
                        puCards.push(cards[i]);
                    }
                }
                if (puCards.length % 3 == 1) {
                    puCards.pop();
                }
                puCards.sort(function(a, b) {
                    return a - b;
                })
                // 吊王
                if (laizi > 0 && puCards.length % 3 == 0 && this.isPu(puCards, laizi - 1, hun)) {
                    return true;
                }
            }
            else {
                return true;
            } 
        }
        return false;
    }

    //判断手牌能否听牌
    majiang.canTing = function (cds, pl, tData)
    {
        for (var i = 0; i < allCards.length; i++) {
            if (this.canHu(cds, allCards[i], pl, tData)) {
                return true;
            }
        }
        return false;
    }

    majiang.canGangWhenTing = function(mjhand, card, pl, tData)
    {
        var hangAfterGang = [];
        for(var i = 0; i < mjhand.length; i++)
        {
            if(card != mjhand[i])
            {
                hangAfterGang.push(mjhand[i]);
            }
        }
        if (pl.yingkou && pl.yingkou != -1 && jians.has(card)) {
            return false; // 硬扣时候不能杠中发白
        }
        //若听牌状态下，去掉所杠的牌不能再听则不能杠
        if (!this.canTing(hangAfterGang, pl, tData)) {
            return false;
        }
        //求出之前听的牌
        pl.mjgang0.push(card);
        var tingSet1 = this.calTingSet(mjhand, null, pl, tData);
        //求出杠之后听的牌
        var tingSet2 = this.calTingSet(hangAfterGang, null, pl, tData);
        pl.mjgang0.pop();
        //对比前后听的牌
        for(var tingCard in tingSet2) {
            if (!(tingCard in tingSet1)) {
                return false;
            }
        }
        //听牌不变可以杠
        return true;
    }

    majiang.calTingSet = function(oCds, oSet, pl, tData)
    {
        var tData = MjClient.data.sData.tData;
        var pl = getUIPlayer(0);
        var tingSet = oSet || {};
        var cds = oCds.slice();
        if ((oCds.length + 1) % 3 == 0) { // 14、11、8、5、2张牌
            cds = oCds.slice(0, -1);
        }
        // cc.log("cds == ",cds, allCards)
        for (var i = 0; i < allCards.length; i++) {
            // cc.log("allCards[i]",allCards[i])
            if (this.canHu(cds, allCards[i], pl, tData)) {
                tingSet[allCards[i]] = 1;
            }
        }
        return tingSet;
    };

    majiang.quantingpai = function(cards, pl, tData)
    {
        var tingSet = this.calTingSet(cards, null, pl, tData);
        return Object.keys(tingSet).length > 15;
    }

    //是否可以杠
    majiang.canGang1 = function(peng, hand, isTing, pl, tData)
    {
        var hun = this.getHunCard(pl, tData, pl.mjhand);
        var wanfa = tData.areaSelectMode["wanfa"];
        var rtn = [];
        for(var i = 0; i < peng.length; i++)
        {
            if (hand.indexOf(peng[i]) >= 0 && (!isTing || majiang.canGangWhenTing(hand, peng[i], pl, tData)))
            // if (hand.indexOf(peng[i]) >= 0 && !isTing)
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
            var lack = calLack([cd].concat(pl.mjpeng).concat(pl.mjgang0).concat(pl.mjgang1));
            if (wanfa == "pinghu" && lack > 0 || wanfa != "pinghu" && lack > 1) {
                if(num == 4 && (!isTing || majiang.canGangWhenTing(hand, cd, pl, tData)))
                {
                    rtn.push(cd);
                }
            }
        }
        return rtn;
    };

    majiang.getHunCard = function(pl, tData, cards) {
        if (tData.areaSelectMode["wanfa"] == "dajiangwangheifengbao") {
            // 中发白最多的牌
            var counts = {71:0, 81:0, 91:0};
            for (var i = 0; i < cards.length; i++) {
                if (cards[i] in counts) {
                    counts[cards[i]]++;
                }
            }
            var hunCard = -1;
            var maxCount = 0;
            for (var k in counts) {
                if (maxCount < counts[k]) {
                    maxCount = counts[k];
                    hunCard = parseInt(k);
                }
            }
            return hunCard;
        }
        else if (tData.areaSelectMode["wanfa"] == "duiwangdajiangbao") {
            return pl.hunCard;
        }
        else {
            return tData.hunCard;
        }
    }

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

    majiang.getYingkouData = function(pl, tData) 
    {
        var res = {};
        var hun = this.getHunCard(pl, tData, pl.mjhand);
        for (var i = 0; i < pl.mjhand.length; i++) {
            if (pl.mjhand[i] === pl.mjhand[i - 1]) {
                continue;
            }
            if (tData.areaSelectMode["wanfa"] == "dajiangwangheifengbao" && !this.fengs.has(pl.mjhand[i])
             || tData.areaSelectMode["wanfa"] == "duiwangdajiangbao" && !this.jians.has(pl.mjhand[i])) {
                // 特定玩法必须打相应的牌
                continue;
            }
            // cc.log(pl.mjhand[i]+ "   aaa " + i);
            var cardsAfterPut = pl.mjhand.slice();
            cardsAfterPut.splice(i,1); //依次去掉某张牌看能不能听
            var counts = {71:0, 81:0, 91:0};
            for (var j = 0; j < cardsAfterPut.length; j++) {
                if (cardsAfterPut[j] in counts) {
                    counts[cardsAfterPut[j]]++;
                }
            }
            // cc.log(JSON.stringify(counts));
            for (var k of jians) {
                var needCal = true;
                for (var kk of jians) {
                    if (kk != k && counts[kk] == 0) {
                        needCal = false;
                    }
                }
                if (needCal) {
                    var newCards = cardsAfterPut.slice();
                    for (var kk of jians) {
                        if (kk != k) {
                            newCards.splice(newCards.indexOf(kk), 1);
                        }
                    }
                    if (tData.areaSelectMode["wanfa"] == "dajiangwangheifengbao") {
                        var counts2 = {71:0, 81:0, 91:0};
                        for (var j = 0; j < newCards.length; j++) {
                            if (newCards[j] in counts2) {
                                counts2[newCards[j]]++;
                            }
                        }
                        for (var j in counts2) {
                            if (counts2[j] > counts2[hun]) {
                                hun = parseInt(j);
                            }
                        }
                        // cc.log("counts====7777777===>",JSON.stringify(counts2) , hun)
                    }
                    // cc.log(">>>???? ", newCards, k);
                    if (this.canHu(newCards, 0, pl, tData)) {
                        if (!res[k]) {
                            res[k] = [];
                        }
                        if (res[k].indexOf(pl.mjhand[i]) == -1) {
                            res[k].push(pl.mjhand[i]);
                        }
                    }
                }
            }
        }
        // cc.log("硬扣数据", JSON.stringify(res));
        return res;
    };

    majiang.isYitiaolong = function(cards, hun)
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
                return this.canHuLaizi(cds, 0, hun);
            }
        }
        return false;
    }

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
        MjClient.majiang_hongtongwangpai = majiang;
    }
    else
    {
        module.exports = majiang;
    }
})();
