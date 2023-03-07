
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

     // 是否处于游戏中状态
    majiang.getIsInTheGame = function(){
        var nowGameState = MjClient.data.sData.tData.tState;  
        return nowGameState == TableState.waitPut; 
    };
    
    majiang.isHunCard = function(){
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
    }

    // 清一色
    majiang.isSameColor = function(mjhand, mjchi, mjpeng, mjgang0, mjgang1)
    {
        var cardList = [mjhand, mjpeng, mjgang0, mjgang1, mjchi];
        var color = -1;
        for(var i = 0; i < cardList.length; i++)
        {
            var cds = cardList[i];
            for(var j = 0; j < cds.length; j++)
            {
                var cd = cds[j];
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
        } 
        return true;
    }
    majiang.getNiaoIsShow = function(niao,maxPlayer){
         // 抓的鸟谁可以加分（鸟，点炮者）
      
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


    // 获取码牌的番数
    majiang.getMaPaiNum = function(cards,tData){
        var mapaiNum = 0; 
        for (var i = 0; i < cards.length; i++) { 
            if(cards[i] > 30 && cards[i] != tData.hunCard)
                continue;

            var dataNum = cards[i] % 10; 
            // 1 5 9 71 
            if( [1, 5, 9].indexOf(dataNum) >= 0 ){
                mapaiNum++;   
            }
            
        }
        return mapaiNum;
    };
    majiang.isShiSanYao = function(oCards,cd){
    
        var cardArr = oCards.slice(); 
        if(cd){
            cardArr.push(cd);
            cd = 0;
            cardArr = this.transformCards(cardArr,null);
        }  

        var yao13 = {1:0, 9:0, 11:0, 19:0, 21:0, 29:0, 31:0, 41:0, 51:0, 61:0, 71:0, 81:0, 91:0};
        var cards = cardArr; 
        for (var i = 0; i < cards.length; i++) {
            if (cards[i] in yao13) 
                yao13[cards[i]]++; 
            else  
                return false; 
        } 
        var count = 0;
        for (var index in yao13) {
            if(yao13[index] > 2){
                return false;
            }else if(yao13[index] === 2 && count < 1){ // 只能有一对将
                count++;
            }else if(yao13[index] === 1){ 
            }else{
                return false;
            }
        }
        return true; 
    };



    //是否可以胡
    majiang.canHu = function(oCards, cd, hun)
    {
        var pl = getUIPlayer(0);
        var tData = MjClient.data.sData.tData;
        var cards = this.transformCards(oCards, hun); 
        // return canHuLaizi(cards, cd); 
        if(tData.areaSelectMode.isQingYiSeChi && pl.mjchi.length > 0){  
            var isColor = this.isSameColor(cards.slice(), pl.mjchi, pl.mjpeng, pl.mjgang0, pl.mjgang1);  
            if(isColor){
                // 平湖 
                if(canHuLaizi(cards.slice(), cd))  
                    return true;  
                // 大对碰
                if(isDuiDuiHu(pl.mjchi,cards))
                    return true;
                // 七巧对
                if(is7Dui(cards, cd)){
                    return true;
                }
            }
            return false; 
        }else if(this.isShiSanYao(cards.slice(), cd)){ 
            return true;
        }else if(is7Dui(cards, cd)){  
            return true;
        } else if(isDuiDuiHu(pl.mjchi,cards)){
            return true;
        }
        else{
            return canHuLaizi(cards.slice(), cd); 
        }
        

    // console.log(cardArr);
    //红中转癞子
    // var commArr = this.transformWhite(cardArr.slice(), null);
    //普通胡法
    // if(this.canHuLaizi(cardArr.slice(), null)) { 
    //     return true; 
    // }
    // // 风一色 
    // if(this.windOneColor(cardArr,pl.mjchi)) { 
    //     return true;  
    // }
    // // // 清一色
    // // if(this.isSameColor(pl.mjhand, pl.mjchi, pl.mjpeng, pl.mjgang0, pl.mjgang1)){
    // //     return true; 
    // // }
    // // 龙七对
    // if(this.islong7Dui(cardArr))
    //     return true;  

    // // 大对碰
    // if(this.isDuiDuiHu(pl.mjchi,cardArr))
    //     return true;
    // // //门清
    // // if(pl.mjchi.length == 0 && pl.mjpeng.length == 0 && pl.mjgang0.length == 0 )
    // //     return true;  
    // //13幺
    // if(this.isShiSanYao(cardArr))
    //     return true; 
    // //七对
    // if(this.is7Dui(cardArr, 0, this.hunCard) != 0){
    //     return true;
    // }


    }

    //听牌函数，判断手牌能否听牌
    majiang.canTing = function (cds) {
        return false;
    }

    majiang.canGangWhenTing = function(hand, card)
    {
        return true;
    }

     //是否可以杠
    majiang.canGang1 = function(peng, hand, isTing,hunCard,skipGang)
    {   
        var rtn = [];
        var lastCard = hand[hand.length-1];
        // 清一色可吃，吃过以后不允许杠不同花色的牌
        // cc.log("majiang.canGang1 = " + peng);
        // var checkPen = true;
        // for (var index in peng) {
        //     var canEat = this.canChiPengCard(peng[index]); 
        //     if(canEat[0] == 2 && !canEat[1] ){
        //         cc.log("不让 canGang1");
        //         return rtn;
        //     }   
        //     checkPen = false;
        // }
        // if(checkPen){
        //     var canEat = this.canChiPengCard(lastCard); 
        //     if(canEat[0] == 2 && !canEat[1] ){
        //         cc.log("不让 canGang1");
        //         return rtn;
        //     } 
        // }
  
        // if(lastCard == hunCard){
        //     return rtn;
        // }
        var sData = MjClient.data.sData;
        var tData = sData.tData;  
        // if (tData) return MjClient.majiang.getAllCardsTotal(tData) - tData.cardNext;
        if( tData.cardNext >= MjClient.majiang.getAllCardsTotal(tData))
            return rtn; // 最后一张牌不让杠


        var pl = getUIPlayer(0); 
        for(var i = 0; i < peng.length; i++)
        {
         
            if(hand.indexOf(peng[i]) >= 0) // 牌量大于1 才能杠
                rtn.push(peng[i]);

            // //过杠不能杠
            // if(hand.indexOf(peng[i]) >= 0 && skipGang.indexOf(peng[i]) < 0 && pl.mjState === TableState.waitPut  )
            // {
                //手牌里的牌Push到rtn中
                // rtn.push(peng[i]);
            // }
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
 
    majiang.canChiPengCard = function(card){
    // 1/ 所有牌可以吃 2 / 可吃碰杠同花色 3/可碰杠不可吃， 
        var tData = MjClient.data.sData.tData;
        var pl = getUIPlayer(0); 
         
        if(tData.areaSelectMode.isCanChi){
            return [1,true];
        }else if(tData.areaSelectMode.isQingYiSeChi){
            // 清一色吃牌类型必须一致（第一位数相同） 
            var floorNum = {}; // 花色数量
            var checkName = ["mjchi","mjpeng","mjgang0","mjgang1"];   
            // 先判断花色是不是多个
            for (var index in checkName) {
                var data = pl[checkName[index]];
                for (var i = 0; i < data.length; i++) {
                    floorNum[  Math.floor(data[i] * 0.1) ] = Math.floor(data[i] * 0.1); // 记录花色
                }
            } 

            var jsonLen = 0;
            for (var index in floorNum) {
                jsonLen++;
            } 
            //判断花色是不是对等
            function checkEqual(){
                var index = Math.floor(card* 0.1);  
                cc.log("card = " + card + " Math.floor(card* 0.1) =  " + Math.floor(card* 0.1)); 
                cc.log(floorNum[index]);
                if( cc.isUndefined(floorNum[index]) )
                    return false;
                return true;  // 同花色
            }  
            // 所有牌可以吃碰杠
            if(jsonLen === 0){
                return [1,true];
            }  
            // 只要吃过，就只能同花色
            if(pl.mjchi.length > 0){ 
                return [2,checkEqual()];
            }    
            // 可以碰杠不同花色，但是不可以吃不同花色
            // 可以碰杠，不可以吃非同花色 
            if(jsonLen === 1 && pl.mjchi.length == 0){
                return [4,checkEqual()]; 
            } 
            //可碰杠不可吃
            if(jsonLen > 1){
                return [3,true];
            } 
        }
        return [3,true];  
    };

    //是否可以明杠
    majiang.canGang0 = function(hand, cd, isTing)
    {

        cc.log("majiang.canGang0");
        // 清一色可吃，吃过以后不允许杠不同花色的牌
        var canEat = this.canChiPengCard(cd); 
        if(canEat[0] == 2 && !canEat[1] ){
            cc.log("不让 canGang0");
            return false;
        } 
        var sData = MjClient.data.sData;
        var tData = sData.tData;  
        // if (tData) return MjClient.majiang.getAllCardsTotal(tData) - tData.cardNext;
        if( tData.cardNext >= MjClient.majiang.getAllCardsTotal(tData))
            return false; // 最后一张牌不让杠

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
        if(tData.areaSelectMode.isDaiFeng){
            return 136;
        }
        return 108; 
    };

    majiang.setFlowerImg = function (node, pl)
    {

        var icountNode = node.getChildByName("head").getChildByName("huaCount");
        if(icountNode != null) {
            var icount = pl.mjflower.length;
            icountNode.visible = true; 
            changeAtalsForLabel(icountNode,icount);
        }
    };

    majiang.setJiaZhuNum = function (node, pl)
    {

    };
    //求出，听牌时，选择一张牌能胡的牌的张数 by sking
    majiang.getCheckTingHuCards = function (selectCard, mjhandCard) {
        var copyhand = mjhandCard.slice();
        var index = copyhand.indexOf(selectCard);//排除当前选择的一张牌
        copyhand.splice(index,1);

        
        var tingSet = null;
        tingSet = MjClient.majiang.calTingSet(copyhand, MjClient.data.sData.tData.hunCard);

        return tingSet;
    };

    majiang.calTingSet  = function (oCds, hun)
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
            if (MjClient.majiang.canHu(cds, allCardsArray[i], hun)) {
                tingSet[allCardsArray[i]] = 1;
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
    };


    if (typeof(MjClient) != "undefined")
    {
        MjClient.majiang_SYMJ = majiang;
    }
    else
    {
        module.exports = majiang;
    }
})();
