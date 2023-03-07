
(function() {
    var majiang = {};
    var flowerArray = [11,19];//花的列表，根据不同来设置
    var allCardsArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29];

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
        if (MjClient.data.sData.tData.areaSelectMode["mantianfei"]) 
        {
            return card == 19;
        }
        return card == 200;
    }

    //是否可以胡
    majiang.canHu = function(oCards, cd, hun)
    {
        var allcards = allCardsArray.slice();
        if (!MjClient.data.sData.tData.areaSelectMode["mantianfei"]) 
        {
            var i = allcards.indexOf(19);
            allcards.splice(i,1); // 无满天飞选项 ，虾牌不可胡
        }
        if (cd == 19 && MjClient.data.sData.tData.areaSelectMode["mantianfei"]) 
        {
            cd = 200;
        }
        if (allcards.indexOf(cd) < 0 && cd != 200) {
            return false;
        }
        var cards = this.transformCards(oCards, hun);
        if (MjClient.data.sData.tData.areaSelectMode["qidui"] && is7Dui(cards, cd)) {
            return true;
        }
        return canHuLaizi(cards, cd);
    }

    //听牌函数，判断手牌能否听牌
    majiang.canTing = function (cds, hun) {
        if (!MjClient.data.sData.tData.areaSelectMode["mantianfei"]) 
        {
            for (var i in cds) {
                if (cds[i] == 19 || cds [i] == 11) 
                {
                    return false;
                }
            }
        }
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
    majiang.canGang1 = function(peng, hand, putCount)
    {
        var rtn = [];
        cc.log(" hand --------------",hand);
        for(var i = 0; i < peng.length; i++)
        {
            if(hand.indexOf(peng[i]) >= 0)
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
            var num = cnum[cd];
            if(!num)
            {
                num = 0;
            }
            num++;
            cnum[cd] = num;
            if(num == 4)
            {
                if(!majiang.isEqualHunCard(cd))//虾牌不可杠
                {
                    rtn.push(cd);
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
        if(MjClient.data.sData.tData.shuffleCardsNum)
            return MjClient.data.sData.tData.shuffleCardsNum;
        if (MjClient.data.sData.tData.areaSelectMode["mantianfei"]) 
        {
            return 76;
        }
        return 80;
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
        MjClient.majiang_MJ_ZHUO_XIA_ZI = majiang;
    }
    else
    {
        module.exports = majiang;
    }
})();
