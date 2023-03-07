
(function() {
    var majiang = {};
    var flowerArray = [];//花的列表，根据不同来设置

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

    majiang.setFlowerImg = function (node, pl)
    {

    };

    majiang.setJiaZhuNum = function(node, pl){

    };

    majiang.isShiSanYao = function(oCards,cd){
        var cardArr = oCards.slice(); 
        if(cd){
            cardArr.push(cd);
        }  

        var factCount = 0;
        var yao13 = {1:0, 9:0, 11:0, 19:0, 21:0, 29:0, 31:0, 41:0, 51:0, 61:0, 71:0, 81:0, 91:0};
        for (var i = 0; i < cardArr.length; i++) {
            if (cardArr[i] in yao13){
                yao13[cardArr[i]]++;
                if(yao13[cardArr[i]] == 1){
                    factCount ++;
                }
            }else{
                return false;
            } 
        } 
        if(factCount !=  Object.keys(yao13).length){
            return false;
        }
        return true; 
    };

    //是否可以胡
    majiang.canHu = function(oCards, cd, hun)
    {
        var cardArr = oCards.slice();
        if(cd){
            cardArr.push(cd);
        }
        //普通胡法
        if(canHuLaizi(cardArr)) { 
            return true; 
        }
        //普通胡法
        if(is7Dui(cardArr)) { 
            return true; 
        }
        //13幺
        if(this.isShiSanYao(cardArr)){
            return true;
        }
        return false;
    };

    majiang.canGangWhenTing = function(hand, card)
    {
        return true;
    };

    majiang.getNiaoIsShow = function(niao,maxPlayer){
        // 点炮方中鸟
        if((niao < 30 && niao %10 == 1 || niao % 10 == 5 || niao % 10 == 9) || (niao == 31 || niao ==71) )
            return 0;
        // 下家中鸟
        if((niao < 30 && niao %10 == 2 || niao % 10 == 6 ) || (niao == 41 || niao == 81))
            return 1;
        // 对家中鸟
        if((niao < 30 && niao %10 == 3 || niao % 10 == 7 ) || (niao == 51 || niao == 91))
            return 2;
        // 上家中鸟
        if( (niao < 30 && niao %10 == 4 || niao % 10 == 8 ) || niao == 61)
            return 3;  
        // 无中鸟人
        return -1; 
    };

     //是否可以杠
    majiang.canGang1 = function(peng, hand, isTing,hunCard,skipGang)
    {   
        var rtn = [];
        var lastCard = hand[hand.length-1];
        var sData = MjClient.data.sData;
        var tData = sData.tData;  
        if(this.getAllCardsTotal(tData) - tData.cardNext <= 0){
            return rtn;
        }

        var pl = getUIPlayer(0); 
        for(var i = 0; i < peng.length; i++)
        {
            if(hand.indexOf(peng[i]) >= 0)
                rtn.push(peng[i]);
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
        if(tData.areaSelectMode.isDaiFeng){
            return 136;
        }
        return 108; 
    };

    //求出，听牌时，选择一张牌能胡的牌的张数 by sking
    majiang.getCheckTingHuCards = function (selectCard, mjhandCard, isReturn) {
        isReturn = isReturn || false;
        var copyhand = mjhandCard.slice();
        var index = copyhand.indexOf(selectCard);//排除当前选择的一张牌
        copyhand.splice(index,1);
        return this.calTingSet(copyhand, MjClient.data.sData.tData.hunCard, isReturn);
    };

    majiang.calTingSet  = function (oCds, hun, isReturn)
    {
        var isDaihongzhong = MjClient.data.sData.tData.areaSelectMode.isDaiFeng;
        var allCardsArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29];
        if(isDaihongzhong){
            allCardsArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29,31,41,51,61,71,81,91];
        }

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
        var num = [0, 0, 0, 0, 0];
        var rtn = []; 
        if(cd == hunCard){
            return rtn;
        }
        for(var i = 0; i < hand.length; i++)
        {
            var currCard = hand[i];
            var dif = currCard - cd;
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

    majiang.isHunCard = function(cd, hun){
        if(cc.isNumber(hun) && cd == hun){
            return true;
        }
        if(cc.isArray(hun) && hun.indexOf(cd) >= 0){
            return true;
        }
        return false;
    };

    if (typeof(MjClient) != "undefined")
    {
        MjClient.majiang_XinNingMJ = majiang;
    }
    else
    {
        module.exports = majiang;
    }
})();
