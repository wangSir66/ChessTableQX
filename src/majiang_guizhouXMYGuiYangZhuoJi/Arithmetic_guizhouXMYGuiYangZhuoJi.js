
(function() {
    var majiang = {};
    var allCardsArray = [
        1,  2,  3,  4,  5,  6,  7,  8,  9,
        11, 12, 13, 14, 15, 16, 17, 18, 19,
        21, 22, 23, 24, 25, 26, 27, 28, 29
    ];


    majiang.isCardFlower = function(card)
    {
        return false;
    };


    majiang.setFlower = function(flower)
    {

    };


    majiang.isEqualHunCard = function(card)
    {
        return card === 200;
    };


    majiang.canHu = function(cards, cd)
    {
        if (is7Dui(cards, cd)) {
            return true;
        }
        return canHuLaizi(cards, cd);
    };

    majiang.isHunCard = function()
    {
        return false;
    };


    majiang.gangWhenZimo = function (hand, rtn)
    {

    };

    //求出所有听牌的合集，oSet已经听的牌
    majiang.calTingSet = function(handCards, hun, pl)
    {
        if(cc.isUndefined(handCards)) return {};
        var tingSet = {};
        var cds = handCards.slice();
        if ((handCards.length + 1) % 3 === 0) {
            cds = handCards.slice(0, -1);
        }

        for(var k = 0; k < cds.length; k ++){
            if(MjClient.playui.isQueCard(cds[k], pl)){
                return {};
            }
        }

        for (var i = 0; i < allCardsArray.length; i++) {
            if (this.canHu(cds, allCardsArray[i], hun)) {
                var count = 0;
                for (var j = 0; j < cds.length; j++) {
                    if (Number(cds[j]) === Number(allCardsArray[i])) {
                        count++;
                    }
                }
                if (hun || count < 4) {
                    tingSet[allCardsArray[i]] = 1;
                }
            }
        }
        return tingSet;
    };


    majiang.calLack = function(cards) {
        var cardSet = [0, 0, 0];
        var lack = 0;
        for (var i = 0; i < cards.length; i++) {
            var color = Math.floor(cards[i] / 10);
            if (cards[i] > 0 && color < 3) {
                cardSet[color] = 1;
            }
        }
        for (var j = 0; j < cardSet.length; j++) {
            if (cardSet[j] === 0) {
                lack++;
            }
        }
        return lack;
    };


    majiang.canTing = function (cards) {
        var sData = MjClient.data.sData;
        var tData = sData.tData;
        var pl = getUIPlayer(0);
        if (tData.maxPlayer !== 4) {
            for (var i = 0; i < pl.mjhand.length; i++) {
                if (Math.floor(pl.mjhand[i] / 10) === pl.que[0]) {
                    return false;
                }
            }
        }
        var tingSet = this.calTingSet(cards);
        return Object.keys(tingSet).length > 0;
    };


    majiang.getCheckTingHuCards = function(selectCard, mjhandCard){
        var copyhand = mjhandCard.slice();
        if (selectCard) {
            var index = copyhand.indexOf(selectCard);
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
        return allCardsArray.length * 4;
    };

    majiang.isDefaultJi = function(cd)
    {
        var tData = MjClient.data.sData.tData;
        var  iswuguji = tData.areaSelectMode["wuguji"];
        if(iswuguji && cd === 28) return true;
        if(cd === 1 || cd === 71) return true;
        return false;
    };


    if (typeof(MjClient) != "undefined")
    {
        MjClient.majiang_guizhouXMYGuiYangZhuoJi = majiang;
    }
    else
    {
        module.exports = majiang;
    }
})();
