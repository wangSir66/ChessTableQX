
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

    // 十三幺
    majiang.isShisanyao = function(oCards, cd) {
        var yao13 = {1:0, 9:0, 11:0, 19:0, 21:0, 29:0, 31:0, 41:0, 51:0, 61:0, 71:0, 81:0, 91:0};
        var cards = oCards.slice();
        if (cd && cd !== 200) {
            cards.push(cd);
        }
        for (var i = 0; i < cards.length; i++) {
            if (cards[i] in yao13) {
                yao13[cards[i]]++;
            }
            else {
                return false;
            }
        }
        var count0 = 0;
        for (var card in yao13) {
            if (yao13[card] > 2) {
                return false;
            }
            if (yao13[card] === 0) {
                count0++;
            }
        }
        return count0 === 0 || count0 === 1 && cd === 200;
    }

    // 是否是 东西南北中发
    majiang.isFeng = function(card)
    {
        if(this.isCardFlower(card) == false)
        {
            if(card >= 31 && card <= 91)
            {
                return true;
            }
        }

        return false;
    }
    majiang.isHunColor = function(mjhand, mjchi, mjpeng, mjgang0, mjgang1)
    {
        var cardList = [mjhand, mjpeng, mjgang0, mjgang1, mjchi];
        var color = -1;
        var isFeng = false;

        for(var i = 0; i < cardList.length; i++)
        {
            var cds = cardList[i];
            for(var j = 0; j < cds.length; j++)
            {
                var cd = cds[j];
                if(this.isFeng(cd))
                {
                    cc.log("===========feng=============");
                    isFeng = true;
                    continue;
                }

                if(this.isEqualHunCard(cd))
                {
                    continue;
                }

                if(color == -1)
                {
                    color = Math.floor(cd / 10);
                }
                else if(color != Math.floor(cd / 10))
                {
                    return false;
                }
            }
        }

        return isFeng;
    }


    //是否可以胡
    majiang.canHu = function(cards, cd)
    {
        // if (this.isShisanyao(cards, cd)) {
        //     return true;
        // }
        if (is7Dui(cards, cd)) {
            return true;
        }
        return canHuLaizi(cards, cd);
    }

    //求缺一门
    majiang.calLack = function(cards, hun) {
        var cardSet = [0, 0, 0];
        var lack = 0;
        for (var i = 0; i < cards.length; i++) {
            if (cards[i] == hun) {
                continue;
            }
            var color = Math.floor(cards[i] / 10);
            if (cards[i] > 0 && color < 3) {
                cardSet[color] = 1;
            }
        }
        for (var i = 0; i < 3; i++) {
            if (cardSet[i] == 0) {
                lack++;
            }
        }
        return lack;
    };

    //听牌函数，判断手牌能否听牌
    majiang.canTing = function (cards, allCards,pl,isGuaiSanJiao) {
        // if (this.isShisanyao(cards, 200)) {
        //     return true;
        // }
        var cardSet = [0, 0, 0];
        var lack = 0;
        for (var i = 0; i < allCards.length; i++) {
            var color = Math.floor(allCards[i] / 10);
            if (allCards[i] > 0 && color < 3) {
                cardSet[color] = 1;
            }
        }
        for (var i = 0; i < 3; i++) {
            if (cardSet[i] == 0) {
                lack++;
            }
        }

        if(isGuaiSanJiao)
        {
            if (lack === 0) {
                return false;
            }
        }



        //混一色不能听牌,?????
        // if(this.isHunColor(pl.mjhand, pl.mjchi, pl.mjpeng, pl.mjgang0, pl.mjgang1))
        // {
        //     return false;
        // }


        var tingSet = calTingSet(cards);

        cc.log("-----------------听牌-------------------tingSet = " + JSON.stringify(tingSet));
        return Object.keys(tingSet).length > 0;
    }

    majiang.canGangWhenTing = function(hand, card)
    {
        return false;
    }

    //是否可以杠
    majiang.canGang1 = function(peng, hand, isTing,fourCards)
    {
        var rtn = [];
        if(isTing) return rtn;
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

        // 判断杠牌后是否影响听牌
        for(var k = rtn.length -1;k >= 0 ;k--) {
            var _copyfourCards = fourCards.slice(); //剔除那四张牌
            var _cardValue = rtn[k];
            for (var m = _copyfourCards.length -1; m >= 0; m--) {
                if (_copyfourCards.indexOf(_cardValue) >= 0) {
                    _copyfourCards.splice(_copyfourCards.indexOf(_cardValue), 1);
                }
            }
            if (_copyfourCards.length == 0)
            {
                rtn.splice(k,1);
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
        MjClient.majiang_jinzhonglisi = majiang;
    }
    else
    {
        module.exports = majiang;
    }
})();
