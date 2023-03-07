
(function() {
    var majiang = {};
    var allCardsArray = [
         1,  2,  3,  4,  5,  6,  7,  8,  9,
        11, 12, 13, 14, 15, 16, 17, 18, 19,
        21, 22, 23, 24, 25, 26, 27, 28, 29,
        31, 32, 33
    ];

    //是否可以胡
    majiang.canHu = function(oCards, cd, hun) {
        if (cd === hun) {
            cd = 200;
        }

        if (allCardsArray.indexOf(cd) < 0 && cd !== 200) {
            return false;
        }

        var cards = this.transformCards(oCards, hun);

        return canHuLaizi(cards, cd);
    };

    majiang.isEqualHunCard = function(cd){
        return cd === 200;
    };

    //是否可以吃
    majiang.canChi = function(hand, cd) {
        var num = [0, 0, 0, 0, 0];
        var rtn = [];
        for(var i = 0; i < hand.length; i++)
        {
            var dif = hand[i] - cd;
            switch (dif)
            {
                case -2:
                case -1:
                case 1:
                case 2:
                    if(!majiang.isEqualHunCard(hand[i]) && !majiang.isEqualHunCard(cd)) {
                        num[dif + 2]++;
                    }
                    break;
            }
        }

        if(num[3] > 0 && num[4] > 0) {
            rtn.push(0);
        }

        if(num[1] > 0 && num[3] > 0) {
            rtn.push(1);
        }

        if(num[0] > 0 && num[1] > 0) {
            rtn.push(2);
        }

        return rtn;
    };



    //听牌函数，判断手牌能否听牌
    majiang.canTing = function (cds) {
        return this.canHu(cds, 200);
    };

    majiang.isCardFlower = function(cd)
    {
        return false;
    };

    //是否可以碰
    majiang.canPeng = function(hand, cd) {
        var num = 0;
        if(majiang.isEqualHunCard(cd))   //混牌不能碰
        {
            return false;
        }

        for(var i = 0; i < hand.length; i++) {
            if(hand[i] === cd) {
                num++;
            }
        }
        return num >= 2;
    };

    majiang.CardCount = function (pl) {
        var rtn = pl.mjpeng.length * 3 + pl.mjchi.length;
        if(pl.mjhand) {
            rtn += pl.mjhand.length;
        }
        return rtn;
    };

    majiang.getAllCardsTotal = function () {
        var tData = MjClient.data.sData.tData;
        if (tData.areaSelectMode["hua"]) {
            return 120;
        } 
        return 108;
    };


    // 混子牌统一替换为200
    majiang.transformCards = function(oCards, hun) {
        if (!hun || hun === -1) {
            return oCards;
        }
        var cards = oCards.slice();
        for (var i = 0; i < cards.length; i++) {
            if (cards[i] === hun) {
                cards[i] = 200; 
            }
        }
        return cards;
    };


    majiang.getCheckTingHuCards = function(selectCard, handCard){
        var copyhand = handCard.slice();
        var index = copyhand.indexOf(selectCard);//排除当前选择的一张牌
        copyhand.splice(index,1);
        return this.calTingSet(copyhand);
    };


    majiang.calTingSet = function (handCards, hunCard) {
        //求出所有听牌的合集，oSet已经听的牌
        if(cc.isUndefined(handCards)) return {};
        var tingSet = {};
        var cds = handCards.slice();
        if ((handCards.length + 1) % 3 === 0) {         // 14、11、8、5、2张牌
            cds = handCards.slice(0, -1);
        }
        for (var i = 0; i < allCardsArray.length; i++) {
            if (this.canHu(cds, allCardsArray[i], hunCard)) {
                var count = 0;
                for (var j = 0; j < cds.length; j++) {
                    if (Number(cds[j]) === Number(allCardsArray[i])) {
                        count++;
                    }
                }
                if (hunCard || count < 4) {
                    tingSet[allCardsArray[i]] = 1;
                }
            }
        }
        return tingSet;
    };


    if (typeof(MjClient) != "undefined") {
        MjClient.majiang_shuPuLaoPai = majiang;
    } else {
        module.exports = majiang;
    }
})();
