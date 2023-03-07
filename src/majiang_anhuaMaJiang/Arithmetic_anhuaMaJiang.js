
(function() {
    var majiang = {};
    var flowerArray = [];//花的列表，根据不同来设置

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
    majiang.canHu = function(oCards, cd, hun, jiangType)
    {
        var cards = [].concat(oCards);
        if(cd)
            cards.push(cd);
        if(typeof hun == 'number' || Object.prototype.toString.call(hun) == '[object Number]'){
            cards = this.transformCards(cards, hun);
        }else if(Array.isArray(hun) ||
            (typeof hun === 'object' && Object.prototype.toString.call(hun) === '[object Array]'))
        {
            for(var i = 0; i < hun.length;i++){
                cards = this.transformCards(cards, hun[i]);
            }
        }
        if(this.canHuLaizi(cards, 0, jiangType))
            return true;

        if(is7Dui(cards, 0))
            return  true;
        return false;
    }

    //听牌函数，判断手牌能否听牌
    majiang.canTing = function (cds) {
        return false;
    }

    majiang.canGangWhenTing = function(hand, card)
    {
        return true;
    }

    majiang.gangWhenZimo = function(hand, rtn, hun)
    {
        for (var i = rtn.length - 1; i >= 0; i--) {
            var cards = [];
            for (var j = 0; j < hand.length; j++) {
                if (hand[j] != rtn[i]) {
                    cards.push(hand[j]);
                }
            }
            cards = this.transformCards(cards, hun);
            cards.sort(function(a,b) {
                return a-b;
            })
            for (var laizi = 0; this.isEqualHunCard(cards[cards.length - 1]); laizi++) {
                cards.pop();
            }
            if (laizi == 0 || !isPu(cards, laizi - 1)) { // 无红中、或者杠后非全听牌
                rtn.splice(i, 1);
            }
        }
    }

    //是否可以杠
    majiang.canGang1 = function(peng, hand, putCount)
    {
        var tData = MjClient.data.sData.tData;
        var sData = MjClient.data.sData;
        var pl = sData.players[SelfUid()+ ""];
        var rtn = [];
        for(var i = 0; i < peng.length; i++)
        {
            if(hand.indexOf(peng[i]) >= 0)
            // if(hand[hand.length - 1] == peng[i] )
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
            if(num == 4 && !majiang.isHunCard(cd, tData.hunCard))
            {
                // if (putCount <= peng.length || cd == hand[hand.length - 1])
                {
                    rtn.push(cd);
                }
            }
        }
        //找出可杠能听的
        {
            var newhand = [].concat(hand);
            var newRtn = [];
            for(var index = 0; index < rtn.length; index++)
            {
                if(this.tingAfterTuozi(rtn[index], newhand))
                {
                    newRtn.push(rtn[index]);
                }
            }
        }
        var totalCardLen = this.getCardTotalNum(tData);
        if(totalCardLen - tData.cardNext >= 4)
            return newRtn;
        else
            return [];
    };

    majiang.canHuTing = function (cards, hun, isJiangType) {

        var allCardsArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29];
        var sData = MjClient.data.sData;
        var tData = sData.tData;
        var pl = sData.players[SelfUid()+ ""];
        for (var i = 0; i < allCardsArray.length; i++)

        {
            var arrCard = [].concat(cards);
            if(allCardsArray[i])
                arrCard.push(allCardsArray[i]);
            var checkJiangType = false;
            if(isJiangType &&  this.isSameColor(arrCard, pl.mjchi, pl.mjpeng, pl.mjgang0, pl.mjgang1, tData.hunCard))
                checkJiangType = true;
            if (this.canHu(cards, allCardsArray[i], hun, checkJiangType))
            {
                return true;
            }
        }
        return false;
    }

    majiang.tingAfterTuozi = function (card, cardArr) {
        var hangAfterGang = [];
        var sData = MjClient.data.sData;
        var tData = sData.tData;
        var pl = sData.players[SelfUid()+ ""];
        for(var i = 0; i < cardArr.length; i++)
        {
            if(card != cardArr[i])
            {
                hangAfterGang.push(cardArr[i]);
            }
        }
        //若听牌状态下，去掉所杠的牌不能再听则不能杠
        var isJiangType = this.isSameColor(cardArr, pl.mjchi, pl.mjpeng, pl.mjgang0, pl.mjgang1, tData.hunCard);
        if (this.canHuTing(hangAfterGang, tData.hunCard, isJiangType))
            return true;
        else
            return false;
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

    majiang.canChi = function(hand, cd,hunCard)
    {   
        var num = [0, 0, 0, 0, 0];
        var rtn = []; 
        if(this.isHunCard(cd, hunCard)){
            return rtn;
        }
        for(var i = 0; i < hand.length; i++)
        {
            var currCard = hand[i];
            var dif = currCard - cd;

            if(this.isHunCard(currCard, hunCard)){
                dif = 0;
            }

            switch (dif)
            {
                case -2:
                case -1:
                case 1:
                case 2:
                    num[dif + 2]++;
                    break;
            }
        }
        if(num[3] > 0 && num[4] > 0)
        {
            rtn.push(0);
        }
        if(num[1] > 0 && num[3] > 0)
        {
            rtn.push(1);
        }
        if(num[0] > 0 && num[1] > 0)
        {
            rtn.push(2);
        }
        return rtn;
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

    //向服务器发送骰子
    majiang.MJTouZiToServer = function(cd)
    {
        if (MjClient.rePlayVideo != -1) return; // 回放时候不能请求
        cc.log("====================MJTouZiToServer=================");
        MjClient.gamenet.request("pkroom.handler.tableMsg", {
            cmd: "MJGang",
            card: cd,
            isTouZi: true,
            eatFlag: EatFlag()
        });
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

    majiang.getAllCardsTotal = function (tData)
    {
        return 108;
    };

    majiang.setFlowerImg = function (node, pl)
    {

        var icountNode = node.getChildByName("head").getChildByName("huaCount");
        if(icountNode != null) {
            var icount = pl.mjflower.length;
            icountNode.visible = true;
            cc.log("set flower ------ icount = " + icount);
            changeAtalsForLabel(icountNode,icount);
        }
    };

    majiang.setJiaZhuNum = function (node, pl)
    {
        if(!pl || !node) return;
        var icountNode = node.getChildByName("head").getChildByName("jiaZhu");
        if (!icountNode)
            return;
        var tData = MjClient.data.sData.tData;
        cc.log("===========飘分 = " + pl.jiazhuNum);
        if(pl.jiazhuNum > 0) {
            icountNode.visible = true;
            icountNode.ignoreContentAdaptWithSize(true);
            icountNode.setAnchorPoint(cc.p(1, 0.5))
            icountNode.setString("飘" + pl.jiazhuNum + "分");  
        }else{
            icountNode.setString("");
        }
    };

    majiang.isHunCard = function(cd, hun){
        if(cc.isNumber(hun) && cd == hun){
            return true;
        }
        if(cc.isArray(hun) && hun.indexOf(cd) >= 0){
            return true;
        }
        return false;
    };

    // 混子牌统一替换为200
    majiang.transformCards = function(oCards, hun) {
        if (!hun || hun == -1) {
            return oCards;
        }
        var cards = oCards.slice();
        for (var i = 0; i < cards.length; i++) {
            if (this.isHunCard(cards[i], hun)) {
                cards[i] = 200; 
            }
        }
        return cards;
    };

    majiang.getCheckTingHuCards = function (selectCard, mjhandCard, isReturn) {
        var hunCard = MjClient.data.sData.tData.hunCard;
        if(this.isHunCard(selectCard, hunCard)){
            return {};
        }
        if(mjhandCard === undefined){
            return {};
        }
        isReturn = isReturn || false;
        var cp = mjhandCard.slice();
        var index = cp.indexOf(selectCard);  //排除当前选择的一张牌
        cp.splice(index, 1);
        var tingSet = null;
        tingSet = this.calTingSet(cp, MjClient.data.sData.tData.hunCard, isReturn);
        return tingSet;
    };

    majiang.calTingSet  = function (oCds, hun, isReturn)
    {
        if(cc.isUndefined(oCds))
        {
            return {};
        }

        var tData = MjClient.data.sData;
        var sData = MjClient.data.sData;
        var pl = sData.players[SelfUid()+ ""];
        var allCardsArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29];

        var tingSet = {};
        var cds = oCds.slice();
        if ((oCds.length + 1) % 3 == 0) { // 14、11、8、5、2张牌
            cds = oCds.slice(0, -1);
        }

        for (var i = 0; i < allCardsArray.length; i++) {
            var isqingyise = false;
            var cardPoor = [].concat(cds);
            if(allCardsArray[i])
                cardPoor.push(allCardsArray[i]);
            if(this.isSameColor(cardPoor, pl.mjchi, pl.mjpeng, pl.mjgang0, pl.mjgang1, hun))
                isqingyise = true;
            if (this.canHu(cds, allCardsArray[i], hun, isqingyise)) {
                tingSet[allCardsArray[i]] = 1;
                if(isReturn){
                    return tingSet;
                }
            } 
        }
        return tingSet;
    };

    majiang.canHuLaizi = function(oCards, cd, jiangType) {
        var cards = [];
        var laizi = 0;
        for (var i = 0; i < oCards.length; i++) {
            if (this.isEqualHunCard(oCards[i])) {
                laizi++;
            }
            else {
                cards.push(oCards[i]);
            }
        }
        if (this.isEqualHunCard(cd)) {
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
            if(!jiangType && (cards[i] % 10 != 2 && cards[i] % 10 != 5 && cards[i] % 10 != 8)) { //非清一色为false
                continue;
            }
            if ((i + 1 < cards.length && cards[i] == cards[i + 1]) || laizi > 0) {
                var puCards = cards.slice();
                var puLaizi = laizi;
                puCards.splice(i, 1);
                if (puCards[i] == cards[i] ) {
                    puCards.splice(i, 1);
                }
                else {
                    puLaizi--;
                }
                // logger.debug("=====canHuLaizi=====puCards:"+ puCards);
                if (this.isPu(puCards, puLaizi)) {
                    return true;
                }
            }
        }

        if (laizi >= 2 && this.isPu(cards, laizi - 2)) {
            return true;
        }
        return false;
    }

// 判断一副牌是否成扑 cards需要按数字排序
    majiang.isPu = function(cards, laizi){
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
                if (isPu(puCards, puLaizi)) {
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
            if (isPu(puCards, puLaizi)) {
                return true;
            }
        }
        return false;
    }

    // 清一色
    majiang.isSameColor = function(mjhand, mjchi, mjpeng, mjgang0, mjgang1, hunCard)
    {
        var cardList = [mjhand, mjpeng, mjgang0, mjgang1, mjchi];
        var color = -1;
        for(var i = 0; i < cardList.length; i++)
        {
            var cds = cardList[i];
            for(var j = 0; j < cds.length; j++)
            {
                var cd = cds[j];
                if(this.isHunCard(cd, hunCard) || cd == 200)
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
        }

        return true;
    }

    majiang.isHunCard = function(cd, hunCard){
        if(typeof(hunCard) == "number" && cd == hunCard){
            return true;
        }
        if(typeof(hunCard) == "object" && hunCard.indexOf(cd) >= 0){
            return true;
        }
        return false;
    };

    majiang.getCardTotalNum = function (tData) {
        return 108;
    }

    if (typeof(MjClient) != "undefined")
    {
        MjClient.majiang_anhuaMaJiang = majiang;
    }
    else
    {
        module.exports = majiang;
    }
})();
