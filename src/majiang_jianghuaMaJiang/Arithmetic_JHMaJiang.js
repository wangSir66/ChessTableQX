
(function() {
    var allCardsArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29, 31, 41, 51, 61, 71, 81, 91];
    var majiang = {};
    var flowerArray = [];//花的列表，根据不同来设置
    var hunCard = -1;//混子列表

    //是否是花
    majiang.isCardFlower = function(card)
    {
        return false;
    };

    //设置花，参数是[]，必须设置
    majiang.setFlower = function(flower)
    {
        flowerArray = flower;
    };

    //设置混，参数是[]，必须设置
    majiang.setHun = function(hun)
    {
        hunCard = hun;
    };

    //是否是混子
    majiang.isEqualHunCard = function(card)
    {
        return card == 200;
    };

    //是否是混子
    majiang.isHunCard = function(cd, hunCard){
        if(typeof(hunCard) == "number" && cd == hunCard){
            return true;
        }
        if(typeof(hunCard) == "object" && hunCard.indexOf(cd) >= 0){
            return true;
        }
        return false;
    };
    
    //胡牌判断，基础胡牌逻辑
    majiang.canHu = function(oCards, card, hun)
    {   
        var cardArr = oCards.slice();
        var cardTag1 = card;
        var cardTag2 = card;

        if (MjClient.getAppType() === MjClient.APP_TYPE.QXSYDTZ) {
            if(card == hun){
                cardTag1 = 200;
                cardTag2 = 200;
            }

            if(card == 71){
                cardTag1 = hun;
                cardTag2 = hun;
            }
        } else {
            if(card == hun){
                return false;
            }
            if(card){
                cardArr.push(card);
            }
            cardTag1 = 0;
        }

        cardArr = this.transformCards(cardArr,hun);
        var commArr = this.transformWhite(cardArr.slice(), hun);
        //普通胡法
        if(canHuLaizi(commArr, cardTag2)){
            return true;
        }
        //13乱
        if(this.isShiSanPao(oCards,hun) != 0){
            return true;
        }
        //七对
        if(is7Dui(commArr, cardTag1)){
            return true;
        }

        return false;
    };

    //听牌函数，判断14张牌能否听牌
    majiang.canTing = function (cds,hunCard) {
        // var canHu = this.canHu(cds,0,hunCard);

        var pl = getUIPlayer(0);
        if(pl && pl.mjput.length == 0){
            //只能天听
            var tingSet = calTingSet(cds,hunCard);
            return Object.keys(tingSet).length>0;
        }
        return false;
    };

    majiang.calTingSet  = function (oCds, hun, isReturn)
    {
        if (MjClient.getAppType() != MjClient.APP_TYPE.QXSYDTZ) {
            return;
        }
        
        var tData = MjClient.data.sData.tData;
        if(cc.isUndefined(oCds))
        {
            return {};
        }
        var tingSet = {};
        var cds = oCds.slice();
        if ((oCds.length + 1) % 3 == 0) { // 14、11、8、5、2张牌
            cds = oCds.slice(0, -1);
        }

        for (var i = 0; i < allCardsArray.length; i++) {
            if (this.canHu(cds, allCardsArray[i], hun)) {
                tingSet[allCardsArray[i]] = 1;
                if(isReturn){
                    return tingSet;
                }
            } 
        }
        return tingSet;
    };

    majiang.canChi = function(hand, cd,hunCard)
    {
        //将白板转为配子牌
        var num = [0, 0, 0, 0, 0];
        var rtn = [];
        if(cd == hunCard){
            return rtn;
        }
        for(var i = 0; i < hand.length; i++)
        {
            var currCard = hand[i];
            if(currCard ==hunCard){
                continue;
            }
            var ttCard = currCard;
            if(currCard == 71){
                ttCard = hunCard;
            }

            var ttCard1 = cd;
            if(ttCard1 == 71){
                ttCard1 = hunCard;
            }
            var dif = ttCard - ttCard1;
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
        if (!majiang.canTing(hangAfterGang, MjClient.data.sData.tData.hunCard)) {
            return false;
        }
        //求出之前听的牌
        var tingSet1 = calTingSet(hand, MjClient.data.sData.tData.hunCard);
        //求出杠之后听的牌  
        var tingSet2 = calTingSet(hangAfterGang, MjClient.data.sData.tData.hunCard);
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
    };

    //是否可以杠
    majiang.canGang1 = function(peng, hand, isTing,hunCard)
    {   
        var rtn = [];
        var lastCard = hand[hand.length-1];
        // if(lastCard == hunCard){
        //     return rtn;
        // }
        for(var i = 0; i < peng.length; i++)
        {
            //过杠不能杠
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
            if(cd == hunCard)
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
        return 136;
    };

    majiang.setFlowerImg = function (node, pl)
    {
        
    };

    majiang.setJiaZhuNum = function (node, pl)
    {
        //永州麻将没有下嘴
        return;

        if(!pl){
            return;
        }
        var icountNode = node.getChildByName("head").getChildByName("jiaZhu");
        var icount = pl.jiazhuNum;
        if(icountNode != null) {
            icountNode.visible = true;
            icountNode.ignoreContentAdaptWithSize(true);
            if (icount > 0)
            {
                icountNode.setString("下" + icount + "嘴");
            }
            else
            {
                icountNode.setString("不下嘴");
            }
        }
    };

    majiang.transformWhite = function(cards,hunCard){
        for(var i=0,length=cards.length;i<length;i++){
            if(cards[i] == 71){
                cards[i] = hunCard;
            }
        }
        return cards;
    };

    //十三炮，徐州玩法
    majiang.isShiSanPao = function(cards,hunCard)
    {
        var so13Type = 0;//1:13烂 2：七风到位
        if(cards.length != 14){
            return so13Type;
        }

        var cardArr = cards.slice();
        var fengCount = 0;
        var cardDirt = {};
        var p131 = [31, 41, 51, 61, 71, 81, 91];
        for(var length = cardArr.length, i = length-1; i >= 0; i--){
            var cd = cardArr[i];
            if(cd >= 31 && cd <= 91){
                fengCount++;
                cardArr.splice(i,1);
            }
            if(!cardDirt[cd]){
                cardDirt[cd] = 1;
            }else{
                cardDirt[cd]++;
            }    
        }

        if(fengCount < 5){
            return so13Type;
        }
        
        //除了红中，红中可以2个以下，要两两不相同
        for(var cd in cardDirt){
            if(cardDirt[cd] > 1){
                return so13Type;
            }
        }
        
        cardArr.sort(function(a,  b){
            return a - b;
        });
        
        for(var k = 1; k < cardArr.length; k++){
            var lastCard = cardArr[k - 1];
            var currCard = cardArr[k];
            if(Math.floor(currCard/10) == Math.floor(lastCard/10)){
                if(currCard - lastCard < 3){
                    return so13Type;
                }
            }
        }

        if(p131.length == 0){
            so13Type = 2;
        }else{
            so13Type = 1;
        }
        return so13Type;
    };

    // 混子牌统一替换为200
    majiang.transformCards = function(oCards, hun) {
        if (!hun || hun == -1) {
            return oCards;
        }
        var cards = oCards.slice();
        for (var i = 0; i < cards.length; i++) {
            if (cards[i] == hun) {
                cards[i] = 200; 
            }
        }
        return cards;
    }

    //癞子的上一张牌(这里也叫上滚)
    majiang.getShanGunCard = function(hunCard) 
    {
        var ret = hunCard;

        //条万筒
        if (hunCard < 30)
        {
            if (hunCard % 10 == 1)
                ret = hunCard + 8;
            else
                ret = hunCard - 1;
        }else if(hunCard > 30 && hunCard <= 61){
            if(hunCard == 31){
                ret = 61;
            }else{
                ret = hunCard - 10;
            }
        }else if(hunCard > 61){
            if(hunCard == 71){
                ret = 91;
            }else{
                ret = hunCard - 10;
            }
        }

        return ret;
    };

    DoTest = function()
    {
        // var beginTime = +new Date;
        // var cards = [
        //     1, 2, 3, 4, 5, 6, 7, 8, 9,
        //     1, 2, 3, 4, 5, 6, 7, 8, 9,
        //     1, 2, 3, 4, 5, 6, 7, 8, 9,
        //     1, 2, 3, 4, 5, 6, 7, 8, 9,
        //     11, 12, 13, 14, 15, 16, 17, 18, 19,
        //     11, 12, 13, 14, 15, 16, 17, 18, 19,
        //     11, 12, 13, 14, 15, 16, 17, 18, 19,
        //     11, 12, 13, 14, 15, 16, 17, 18, 19,
        //     21, 22, 23, 24, 25, 26, 27, 28, 29,
        //     21, 22, 23, 24, 25, 26, 27, 28, 29,
        //     21, 22, 23, 24, 25, 26, 27, 28, 29,
        //     21, 22, 23, 24, 25, 26, 27, 28, 29,
        //     31, 41, 51, 61, 71, 81, 91,
        //     31, 41, 51, 61, 71, 81, 91,
        //     31, 41, 51, 61, 71, 81, 91,
        //     31, 41, 51, 61, 71, 81, 91
        // ];
        // for (var i = 0; i < 100000; i++) {
        //     cards.sort(function (a, b) {
        //         return .5 - Math.random();
        //     });
        //     var laizi = cards[cards.length - 1];
        //     // var hands = majiang.transformCards(cards.slice(0, 14), laizi);
        //     var hands = cards.slice(0, 14);
        //     // var _canHuHunResult = majiang._canHuHun(hands);
        //     var _canHuHunResult = MjClient.majiang_shuyang._canHuNoHun(false, hands) > 0;
        //     var canHuLaiziResult = canHuLaizi(hands);
        //     if (_canHuHunResult != canHuLaiziResult) {
        //         hands.sort(function(a,b){return a-b;});
        //         cc.log(hands, '_canHuHunResult=', _canHuHunResult, '   canHuLaiziResult=', canHuLaiziResult)
        //     }
        // }
        // // var canHuLaiziResult = majiang.canHuLaizi([4,5,6,7,8,9,11,11,14,15,16,21,71,200]);
        // // cc.log("结果",canHuLaiziResult);
        // cc.log("测试时间 = " + (new Date - beginTime));
    }

    if (typeof(MjClient) != "undefined")
    {
        MjClient.majiang_JHMaJiang = majiang;
        DoTest();
    }
    else
    {
        module.exports = majiang;
    }
})();
