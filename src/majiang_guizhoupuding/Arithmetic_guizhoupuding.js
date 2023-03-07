
(function() {
    var majiang = {};
    var allCardsArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29, 71];
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
        return card === 200;
    }


    //是否可以胡
    majiang.canHu = function(cards, cd)
    {
        if (is7Dui(cards, cd)) {
            return true;
        }
        return canHuLaizi(cards, cd);
    }

    majiang.isHunCard = function()
    {
        return false;
    }


    majiang.gangWhenZimo = function (hand, rtn)
    {

    }

    //求出所有听牌的合集，oSet已经听的牌
    majiang.calTingSet = function(oCds, hun, pl)
    {

        if(cc.isUndefined(oCds))
        {
            return {};
        }


        //todo...  平胡必须要通行证，杠牌才能胡,可以自摸

        var tingSet = {};
        var cds = oCds.slice();
        if ((oCds.length + 1) % 3 == 0) { // 14、11、8、5、2张牌
            cds = oCds.slice(0, -1);
        }

        var _haveQue = false;
        for(var k = 0; k < cds.length ;k++)
        {
            var _cd = cds[k];
            if(MjClient.playui.isQueCard(_cd, pl)) //手里有缺的麻将
            {
                _haveQue = true;
                return {};
            }
        }

        for (var i = 0; i < allCardsArray.length; i++) {
            if (this.canHu(cds, allCardsArray[i], hun)) {
                if(this.isCardFlower && this.isCardFlower(allCardsArray[i])) continue; //听牌花牌要排除，东南西北，中发白有可能是花

                var count = 0;
                for (var j = 0; j < cds.length; j++) {
                    if (cds[j] == allCardsArray[i]) {
                        count++;
                    }
                }
                if (hun || count < 4) {
                    tingSet[allCardsArray[i]] = 1;
                }
            }
        }
        return tingSet;
    }

    /**
     * 求缺一门的
     * @param cards
     * @returns {number}
     */
    majiang.calLack = function(cards)
    {
        var cardSet = [0, 0, 0, 0]; //条，筒，万，红中
        var lack = 0;
        for (var i = 0; i < cards.length; i++) {
            var color = Math.floor(cards[i] / 10);
            if (cards[i] > 0 && color < 3) {
                cardSet[color] = 1;
            }
            else if(color == 7) //红中 71
            {
                cardSet[color] = 1;
            }
        }
        for (var i = 0; i < cardSet.length; i++) {
            if (cardSet[i] == 0) {
                lack++;
            }
        }
        return lack;
    }


    //听牌函数，判断手牌能否听牌
    majiang.canTing = function (cards, allCards) {
        var sData=MjClient.data.sData;
        var tData=sData.tData;

        var pl = getUIPlayer(0);
        if (tData.maxPlayer !== 4) {  // 2，3人的缺2门才可以胡牌

            for (var i = 0; i < cards.length; i++) {
                if (Math.floor(cards[i] / 10) === pl.que[0] || Math.floor(cards[i] / 10) === pl.que[1]) {
                    return false;
                }
            }
        }

        var tingSet = this.calTingSet(cards);
        cc.log("==========================tingSet = " + JSON.stringify(tingSet));
        return Object.keys(tingSet).length > 0;
    };


    majiang.getCheckTingHuCards = function(selectCard, mjhandCard){
        var copyhand = mjhandCard.slice();
        if (selectCard) {
            var index = copyhand.indexOf(selectCard);//排除当前选择的一张牌
            copyhand.splice(index,1);
        }
        var tingSet = this.calTingSet(copyhand, MjClient.data.sData.tData.hunCard);

        for (var card in tingSet) {
            var count = 0;
            for (var i = 0; i < mjhandCard.length; i++) {
                if (mjhandCard[i] === Number(card)) {
                    count ++;
                }
            }
            if (count === 4) {
                delete tingSet[card];
            }
        }
        return tingSet;
    };



    majiang.canGangWhenTing = function(hand, card)
    {
        return false;
    };

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
        return 112;
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


    majiang.isDefaultJi = function(cd)
    {
        var tData = MjClient.data.sData.tData;
        var  iswuguji = tData.areaSelectMode["wuguji"];
        if(iswuguji && cd == 28) return true;
        if(cd == 1 || cd == 71) return true;
        return false;
    }


    if (typeof(MjClient) != "undefined")
    {
        MjClient.majiang_guizhoupuding = majiang;
    }
    else
    {
        module.exports = majiang;
    }
})();
