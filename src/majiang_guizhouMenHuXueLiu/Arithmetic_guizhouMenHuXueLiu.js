
(function() {
    var majiang = {};

    majiang.getAllCardsArray = function(){
        var cards = [
            1,  2,  3,  4,  5,  6,  7,  8,  9,
            21, 22, 23, 24, 25, 26, 27, 28, 29
        ];

        // 四人条万筒中
        if(MjClient.maxPlayer === 4){
            var tmp = [11, 12, 13, 14, 15, 16, 17, 18, 19, 71];
            cards = cards.concat(tmp);
        }
        return cards;
    };



    majiang.isCardFlower = function(){
        return false;
    };


    //是否是混子
    majiang.isEqualHunCard = function(card) {
        return card === 200;
    };


    majiang.isDefaultJi = function(cd) {
        var tData = MjClient.data.sData.tData;
        var iswuguji = tData.areaSelectMode["wuguji"];
        if(iswuguji && cd === 28) return true;
        if(cd === 1) return true;
        return false;
    };


    //是否可以胡
    majiang.canHu = function(cards, cd)
    {
        if (is7Dui(cards, cd)) {
            return true;
        }
        return canHuLaizi(cards, cd);
    };


    //听牌函数，判断手牌能否听牌
    majiang.canTing = function (cards) {
        var tingSet = this.calTingSet(cards);
        return Object.keys(tingSet).length > 0;
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
            if(num === 4 && (!isTing || majiang.canGangWhenTing(hand, cd)))
            {
                rtn.push(cd);
            }
        }
        return rtn;
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


    //是否可以明杠
    majiang.canGang0 = function(hand, cd, isTing)
    {
        if(majiang.isEqualHunCard(cd))//混牌不能杠
        {
            return false;
        }
        var num = 0;
        for (var i = 0; i < hand.length; i++) {
            if (hand[i] === cd) num++;
        }
        return num === 3 && (!isTing || majiang.canGangWhenTing(hand, cd));
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
            if(hand[i] === cd)
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
        return majiang.getAllCardsArray().length * 4;
    };

    majiang.isHunCard = function(){
        return false;
    };

    majiang.calTingSet = function(handCards, hunCard) {
        var allCards = majiang.getAllCardsArray();
        //求出所有听牌的合集，oSet已经听的牌
        if(cc.isUndefined(handCards)) return {};
        var tingSet = {};
        var cds = handCards.slice();
        if ((handCards.length + 1) % 3 === 0) {         // 14、11、8、5、2张牌
            cds = handCards.slice(0, -1);
        }
        for (var i = 0; i < allCards.length; i++) {
            if (this.canHu(cds, allCards[i], hunCard)) {
                var count = 0;
                for (var j = 0; j < cds.length; j++) {
                    if (Number(cds[j]) === Number(allCards[i])) {
                        count++;
                    }
                }
                if (hunCard || count < 4) {
                    tingSet[allCards[i]] = 1;
                }
            }
        }
        return tingSet;
    };




    if (typeof(MjClient) != "undefined")
    {
        MjClient.majiang_guizhouMenHuXueLiu = majiang;
    }
    else
    {
        module.exports = majiang;
    }
})();
