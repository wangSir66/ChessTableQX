
(function() {
    var majiang = {};
    var flowerArray = [];//花的列表，根据不同来设置
    var allCardsArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29];

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
    majiang.canHu = function(oCards, cd, hun)
    {
        var cards = oCards.slice();
        if (allCardsArray.indexOf(cd) < 0 && cd != 200) {
            return false;
        }
        var laiType = MjClient.data.sData.tData.areaSelectMode["laiType"];
        if (laiType > 0) { // 只有一赖到底和两赖可胡才能变成万能
            cards = this.transformCards(oCards, hun);
        }

        var hunnum = 0;
        for(var i = 0; i < oCards.length; i++)
        {
            if(oCards[i] == hun)
            {
                hunnum++;
            }
        }
        if(hunnum > laiType && laiType > 0){
            return false;
        }
        if(laiType == 0 && hunnum >1){
            return false;
        }
        // if (MjClient.data.sData.tData.areaSelectMode["qidui"] && is7Dui(cards, cd)) {
        //     return true;
        // }
        return canHuLaizi(cards, cd);
    }

    // majiang.canHuDiaoYu = function(){
    //     var cardsDiaoYu = oCards.slice(0, -1);
    //     cardsDiaoYu = this.transformCards(cardsDiaoYu, hun);
    //     var tingSet = Object.keys(calTingSet(cardsDiaoYu));
    //     if(tingSet.length == 27){
    //         //见牌胡
    //         return diaoYu ? true: false;
    //     }
    // }

    //听牌函数，判断手牌能否听牌
    majiang.canTing = function (cds, hun) {
        return this.canHu(cds, 200, hun);
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
    majiang.canGang1 = function(peng, hand, putCount, skipGang)
    {
        var rtn = [];
        for(var i = 0; i < peng.length; i++)
        {
            if(hand.indexOf(peng[i]) >= 0 && skipGang.indexOf(peng[i]) == -1)
            // if(hand[hand.length - 1] == peng[i])
            {
                //手牌里的牌Push到rtn中
                rtn.push(peng[i]);
            }
        }
        var cnum = {};
        for(var i = 0; i < hand.length; i++)
        {
            var cd = hand[i];
            if(cd == MjClient.data.sData.tData.hunCard) continue;
            var num = cnum[cd];
            if(!num)
            {
                num = 0;
            }
            num++;
            cnum[cd] = num;
            if(num == 4)
            {
                // if (putCount === 0 || cd == hand[hand.length - 1]) 
                {
                    rtn.push(cd);
                }
            }
        }
        // 朝天牌
        var chaoTianCard = MjClient.data.sData.tData.chaoTianCard;
        var chaoTianCardNum = 0;
        for(var i = 0; i < hand.length; i++)
        {
            if(chaoTianCard == hand[i])
            {

                chaoTianCardNum ++;
            }
            if(chaoTianCardNum == 3)
            {
                {
                    rtn.push(chaoTianCard);
                    return rtn;
                }
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
        var cardNum = 107 ;
        if(tData.areaSelectMode.queYiMen && (tData.maxPlayer == 2 || tData.maxPlayer == 3))
        {
            cardNum = 71;
        }
        return cardNum;
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
        if(!pl) return;
        var icountNode = node.getChildByName("head").getChildByName("jiaZhu");
        var tData = MjClient.data.sData.tData;
        cc.log("===========飘分 = " + pl.jiazhuNum);
        if(pl.jiazhuNum > 0) {
            icountNode.visible = true;
            icountNode.ignoreContentAdaptWithSize(true);
            if (tData.areaSelectMode.piaoniao)
                icountNode.setString("鸟+" + pl.jiazhuNum); 
            else
                icountNode.setString("飘" + pl.jiazhuNum + "分");  
        }else{
            icountNode.setString("");
        }
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
        MjClient.majiang_yiJiaoLaiYou = majiang;
    }
    else
    {
        module.exports = majiang;
    }
})();
