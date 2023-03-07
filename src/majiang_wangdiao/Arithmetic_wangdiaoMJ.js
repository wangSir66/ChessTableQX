
(function() {
    var allCardsArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29, 71];
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
        return card == 71;
    };
    
    majiang.hunCount = function(oCards,hun){
        var count = 0;
        for(var index in oCards){
            if(oCards[index] == hun){
                count++;
            }
        }
        return count;
    };
    majiang.isHunCard = function(card,hunCard){
        return card == 71;
    };




    majiang.isWangDiao = function(oCards, card, hun){
        if(this.hunCount(oCards,hun) < 1){
            return false;
        }
        var cardArr = oCards.slice();
        if(!card){
            cardArr.pop();
        }
        cardArr.splice(cardArr.indexOf(hun),1);
        cardArr.push(101);
        cardArr.push(101);
        return this.canHu(cardArr,0,hun);
    };

    majiang.isWangChuan = function(oCards, card, hun){
        if(this.hunCount(oCards,hun) < 2){ 
            return false;
        }
        var cardArr = oCards.slice();
        if(!card){
            cardArr.pop();
        }
        cardArr.splice(cardArr.indexOf(hun),1);
        cardArr.splice(cardArr.indexOf(hun),1);
        cardArr.push(101);
        cardArr.push(101);
        cardArr.push(101);
        return this.canHu(cardArr,0,hun);
    };
    
    //是否可以胡
    majiang.canHu = function(oCards, cd, hun){
        var cardArr = oCards.slice();
        if(cd){
            cardArr.push(cd);
        }
        var cards = this.transformCards(cardArr, hun);
        if(canHuLaizi(cards)){
            return true;
        }
        var isQiDui = MjClient.data.sData.tData.areaSelectMode.qidui;
        return isQiDui && is7Dui(cards);
    };

    // 是否播放两片动画
    majiang.getIsRunLiangPian = function(ed,playID){
        var isLiangpian = ed.tData.areaSelectMode.isLiangPian
        if(!isLiangpian)
            return false; 
        if(playID != ed.tData.winner)
            return false;

        var winID = ed.tData.uids[ed.tData.winner];
        var cardS = ed.players[winID].mjhand;   
        return !(cardS.indexOf(71) >= 0);
    };

    //求出所有听牌的合集，oSet已经听的牌
    majiang.calTingSet = function(oCds, hunCard)
    {
        var tingSet = {};
        var cds = oCds.slice();
        if ((oCds.length + 1) % 3 == 0) { // 14、11、8、5、2张牌
            cds = oCds.slice(0, -1);
        }
        for (var i = 0; i < allCardsArray.length; i++) {
            if (this.canHu(cds, allCardsArray[i], hunCard)) {
                tingSet[allCardsArray[i]] = 1;
            }
        }
        return tingSet;
    };

    //听牌函数，判断14张牌能否听牌
    majiang.canTing = function (cds,hunCard) {
        var canHu = this.canHu(cds,0,hunCard);
        var tingSet = this.calTingSet(cds,hunCard);
        return Object.keys(tingSet).length>0;
    };

    majiang.canChi = function(hand, cd,hunCard)
    {   
        //将白板转为配子牌
        var num = [0, 0, 0, 0, 0];
        var rtn = [];
        return rtn;
        if(cd == hunCard){
            return rtn;
        }
        for(var i = 0; i < hand.length; i++)
        {
            var currCard = hand[i];
            // if(currCard ==hunCard){
            //     continue;
            // }
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
    // 是否处于游戏中状态
    majiang.getIsInTheGame = function(){
        var nowGameState = MjClient.data.sData.tData.tState;
     
        if(nowGameState == TableState.waitEat || 
            nowGameState == TableState.waitPut || 
            nowGameState == TableState.waitCard)
            return true;
        return false; 
    };

    // 是否满足显示提示图标
    majiang.getIsShowTingTips = function(tingCards,mjhand,isHunCard){

        // 王闯王钓
        if(typeof(tingCards) == "number")
            return true;

        // 没有可听内容
        if(Object.keys(tingCards).length <= 0) 
            return false; 
         // 可以听但是没有可以胡的牌了

        var isShow = false 
        for (var cd in tingCards) {  
             var huNum = getHuCardNum(parseInt(cd)); 
             if(huNum != 0)
                isShow = true;
        }  
        if(!isShow)
            return isShow;
        // 不是赖子，直接返回
        if(!isHunCard)
            return true;

        // 赖子再次校验 
        for (var i = 0; i < mjhand.length; i++) { 
            // 必须剩余的牌全是赖子
            if(mjhand[i] != 71){
                return false;
            } 
        }
        return true; 
    };

    // 获取码牌的番数
    majiang.getMaPaiNum = function(cards,tData){
        var mapaiNum = 0; 
        for (var i = 0; i < cards.length; i++) { 
            if(cards[i] > 30 && cards[i] != tData.hunCard)
                continue;

            var dataNum = cards[i] % 10;

            if(tData.areaSelectMode.maPai == 0){ // 数字码
                // 1-9 71  
                mapaiNum += cards[i] == tData.hunCard ? 10 : dataNum;  
            }else{
                // 1 5 9 71 
                if( [1, 5, 9].indexOf(dataNum) >= 0 || cards[i] == tData.hunCard){
                    mapaiNum++;  
                }
            }
        }
        return mapaiNum;
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
        var tingSet1 = this.calTingSet(hand, MjClient.data.sData.tData.hunCard);
        //求出杠之后听的牌  
        var tingSet2 = this.calTingSet(hangAfterGang, MjClient.data.sData.tData.hunCard);
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
        var tData = MjClient.data.sData.tData;
        var wuTong = tData.areaSelectMode.wuTong && tData.maxPlayer == 2;
        if (wuTong) {
            return 112 - 36;
        }
        return 112;
    };

    majiang.setFlowerImg = function (node, pl)
    {
        
    };

    majiang.setJiaZhuNum = function (node, pl)
    {
        //永州麻将没有下嘴
        return;
    };
    //求出，听牌时，选择一张牌能胡的牌的张数 by sking
    majiang.getCheckTingHuCards = function (selectCard, mjhandCard, isReturn) {
        if(!mjhandCard || mjhandCard.length == 0){
            return {};
        }
        if(mjhandCard.length % 3 != 2){
            return {};
        }
        var copyhand = mjhandCard.slice();
        var index = copyhand.indexOf(selectCard);//排除当前选择的一张牌
        copyhand.splice(index,1);
        
        // majiang.isWangDiao = function(oCards, card, hun)
        // 判断是否王闯王钓
        var isWang = false;
        if(this.isWangChuan(copyhand,selectCard,MjClient.data.sData.tData.hunCard)){
            isWang = true;
        }
        if(this.isWangDiao(copyhand,selectCard,MjClient.data.sData.tData.hunCard)){
            isWang = true;
        }
        if(isWang){
            var tingArr = {};
            for (var i = 0; i < allCardsArray.length; i++) {
                tingArr[allCardsArray[i]] = 1;
            }
            return tingArr;
        }
        var tingSet = this.calTingSet(copyhand, MjClient.data.sData.tData.hunCard);

        return tingSet;
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
        MjClient.majiang_WDMaJiang = majiang;
        DoTest();
    }
    else
    {
        module.exports = majiang;
    }
})();
