
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
        var pl = getUIPlayer(0);
        if (this.isHu8Zhang(pl, cards, cd) < 8){
            return false;
        }
        if (MjClient.data.sData.tData.areaSelectMode["qiDui"] && is7Dui(cards, cd)) {
            return true;
        }
        return canHuLaizi(cards, cd);
    }

    //听牌函数，判断手牌能否听牌
    majiang.canTing = function (cards) {
        // cc.log("=========== jcw =========== cards: " + JSON.stringify(cards));
        return this.canHu(cards, 200);
    }

    majiang.canGangWhenTing = function(hand, card)
    {
        return false;
    }

    // 某一花色张数大于等于8张【报过碰杠的牌】
    majiang.isHu8Zhang = function(pl, cards, cd)
    {
        var arr = [0,0,0];
        var mjhand = cards.slice();
        if (cd && cd == 200){
            arr = [1,1,1];
        }
        else if (cd) {
            mjhand.push(cd);
        }
        var cardList = [mjhand, pl.mjpeng, pl.mjgang0, pl.mjgang1];
        for(var i = 0; i < cardList.length; i++)
        {
            var cds = cardList[i];
            for (var j = 0; j < cds.length; j++) {
                if (cds[j] >= 1 && cds[j] <= 9) {
                    if (i > 1) arr[0] += 4;
                    else if (i == 1) arr[0] += 3;
                    else arr[0]++;
                }
                if (cds[j] >= 11 && cds[j] <= 19) {
                    if (i > 1) arr[1] += 4;
                    else if (i == 1) arr[1] += 3;
                    else arr[1]++;
                }
                if (cds[j] >= 21 && cds[j] <= 29) {
                    if (i > 1) arr[2] += 4;
                    else if (i == 1) arr[2] += 3;
                    else arr[2]++;
                }
            }
        }
        return Math.max(arr[0], arr[1], arr[2]);
    }

    //是否可以杠
    majiang.canGang1 = function(peng, hand, isTing)
    {
        var rtn = [];
        for(var i = 0; i < peng.length; i++)
        {
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
        return 108;
    };

    majiang.setFlowerImg = function (node, pl)
    {

        var icountNode = node.getChildByName("head").getChildByName("huaCount");
        if(icountNode != null) {
            var icount = pl.mjflower.length;
            icountNode.visible = true;
            //changeAtalsForLabel(icountNode,icount);
            icountNode.setString("花 x " + icount);
        }
    };

    majiang.setJiaZhuNum = function (node, pl)
    {

    };


    if (typeof(MjClient) != "undefined")
    {
        MjClient.majiang_datongguaisanjiao = majiang;
    }
    else
    {
        module.exports = majiang;
    }
})();
