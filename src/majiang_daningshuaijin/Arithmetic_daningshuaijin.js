
(function() {
    var majiang = {};
    var flowerArray = [111, 121, 131, 141, 151, 161, 171, 181];//花的列表，根据不同来设置
    var allCards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29, 31, 41, 51, 61, 71, 81, 91];
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
        return card == 200 || card == MjClient.data.sData.tData.hunCard;
    }
    //是否可以胡  useHun(赖子牌是否生效)
    majiang.canHu = function(oCards, cd, hun, useHun)
    {
        var cards;
        if (useHun){
            cards = this.transformCards(oCards, hun);
        }
        else{
            cards = oCards;
        }
        if (is7Dui(cards, cd)) {
            return true;
        }
        if(this.isShisanyao(cards,cd)){
            return true;
        }
        return canHuLaizi(cards, cd);
    };
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
    };
    // 十三幺
    majiang.isShisanyao = function(oCards, cd) {
        var yao13 = {1:0, 9:0, 11:0, 19:0, 21:0, 29:0, 31:0, 41:0, 51:0, 61:0, 71:0, 81:0, 91:0};
        var cards = oCards.slice();
        if (cd && cd > 0) {
            cards.push(cd);
        }
        var hunNum = 0;
        for (var i = 0; i < cards.length; i++) {
            if (cards[i] in yao13) {
                yao13[cards[i]]++;
            } else if (cards[i] == 200) {
                hunNum++;
            } else {
                return false;
            }
        }
        var count0 = 0;
        var hasTwoCount = 0;
        for (var card in yao13) {
            if (yao13[card] === 0) {
                count0++;
            }

            if (yao13[card] == 2) {
                hasTwoCount++
            }
            if (yao13[card] > 2 || hasTwoCount > 1) {
                return false;
            }
        }
        count0 += (1 - hasTwoCount);
        return count0 === 0 || count0 === hunNum;


    };



    //求出，听牌时，选择一张牌能胡的牌的张数 by wucc  useHun(赖子牌是否生效)
    majiang.getCheckTingHuCards = function(selectCard,mjhandCard,useHun) {
        var copyhand = mjhandCard.slice();
        if (selectCard) {
            var index = copyhand.indexOf(selectCard);//排除当前选择的一张牌
            copyhand.splice(index,1);
        }

        var tingSet = null;
        tingSet = this.calTingSet(copyhand, MjClient.data.sData.tData.hunCard, useHun);
        for (var card in tingSet) {
            var count = 0;
            for (var i = 0; i < mjhandCard.length; i++) {
                if (mjhandCard[i] == card) {
                    count++;
                }
            }
            if (count == 4) {
                delete tingSet[card];
            }
        }
        return tingSet;
    };

    //求出所有听牌的合集，oSet已经听的牌 calTingSet
    majiang.calTingSet = function(oCds, hun, useHun)
    {
        if(cc.isUndefined(oCds))
        {
            return {};
        }
        var tingSet = {};
        var cds = oCds.slice();
        if ((oCds.length + 1) % 3 == 0) { // 14、11、8、5、2张牌
            cds = oCds.slice(0, -1);
        }

        cc.log("===========cds function calTingSet ======= " + JSON.stringify(cds));

        for (var i = 0; i < allCardsArray.length; i++) {
            if (this.canHu(cds, allCardsArray[i], hun, useHun)) {
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
    };

    majiang.getTingCardSetByPlayer = function (pl) {
        if (typeof(pl) == "undefined" || typeof(pl.mjhand)  == "undefined") return {};
        var tData = MjClient.data.sData.tData;
        return this.calTingSet(pl.mjhand, tData.hunCard, pl.rate > 0)
    };

    majiang.quantingpai = function(oCards, hun, deleteCard) // tData.hunCard
    {
        var cards = this.transformCards(oCards, hun, deleteCard);
        for (var i = 0; i < allCards.length; i++) {
            if (allCards[i] == hun) {
                continue;
            }
            if (!this.canHu(cards, allCards[i], hun)) {
                return false;
            }
        }
        return true;
    };

    // 混子牌统一替换为200
    majiang.transformCards = function(oCards, hun, deleteCard)
    {
        var cards = [];
        for (var i = 0; i < oCards.length; i++) {
            if (oCards[i] === deleteCard) {
                continue;
            }
            if (oCards[i] == hun) {
                cards.push(200);
            }
            else {
                cards.push(oCards[i]);
            }
        }
        return cards;
    }

    //听牌函数，判断手牌能否听牌
    majiang.canTing = function (cards, allCards, shisanyao) {
        return false;
    }

    majiang.canGangWhenTing = function(mjhand, card, param)
    {
        var hangAfterGang = [];
        var newCard = null;
        if (!param.isMingGang) {
            newCard = mjhand[mjhand.length-1];
        }

        for(var i = 0; i < mjhand.length; i++) {
            if(card != mjhand[i]) {
                hangAfterGang.push(mjhand[i]);
            }
        }
        //若听牌状态下，去掉所杠的牌不能再听则不能杠
        if (!this.canTingByShuaijin(hangAfterGang, param.hasShuiJin, param.tData)) {
            return false;
        }
        //求出之前听的牌
        var tingSet1 = this.calTingSet(mjhand, null, param.tData.hunCard);
        //求出杠之后听的牌
        var tingSet2 = this.calTingSet(hangAfterGang, null, param.tData.hunCard);
        //对比前后听的牌
        for(var tingCard in tingSet2) {
            if (!(tingCard in tingSet1)) {
                return false;
            }
        }
        if (newCard != null && hangAfterGang.indexOf(newCard) > -1) {
            return false; // 补杠新增牌了
        }
        //听牌不变可以杠
        return true;
    }

    //是否可以杠
    majiang.canGang1 = function(peng, hand, isTing, hasShuiJin)
    {
        var rtn = [];
        var param = {isMingGang:false, hasShuiJin:hasShuiJin, tData:MjClient.data.sData.tData};
        for(var i = 0; i < peng.length; i++) {
            if(hand.indexOf(peng[i]) >= 0 && (!isTing || this.canGangWhenTing(hand, peng[i], param))) {
                //手牌里的牌Push到rtn中
                rtn.push(peng[i]);
            }
        }
        var cnum = {};
        for(var i = 0; i < hand.length; i++) {
            var cd = hand[i];
            if(this.isEqualHunCard(cd)) {
                continue;
            }
            var num = cnum[cd];
            if(!num) {
                num = 0;
            }
            num++;
            cnum[cd] = num;

            if(num == 4 && (!isTing || this.canGangWhenTing(hand, cd, param))) {
                rtn.push(cd);
            }
        }
        return rtn;
    };

    //是否可以明杠
    majiang.canGang0 = function(hand, cd, isTing, hasShuiJin)
    {
        if(this.isEqualHunCard(card)) { //混牌不能杠
            return false;
        }

        var num = 0;
        for(var i = 0; i < mjhand.length; i++) {
            if(mjhand[i] == card)
            {
                num++;
            }
        }
        var param = {isMingGang:true, hasShuiJin:hasShuiJin, tData:MjClient.data.sData.tData};
        return num == 3 && (!isTing || this.canGangWhenTing(mjhand, card, param));

    };

    // 乡宁摔金没有听
    majiang.canTingByShuaijin = function(oCards, hasShuiJin, tData) {
        var cards = oCards.slice();
        if (!hasShuiJin && this.isHasJinCards(cards, tData.hunCard)) {
            return false; // 没有摔过金 且 手上有金牌
        }
        if (hasShuiJin) { // 只有摔金，金牌才能变成万能
            cards = this.transformCards(cards, tData.hunCard);
        }
        return this.canHu(cards, 200);
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

    majiang.isHasJinCards = function (cards, jinCard) {
        if(!cards || typeof cards == 'undefined') { return false; }
        return cards.indexOf(jinCard) != -1;
    };
    majiang.CalHunCardNum=function(cards,jinCard)
    {
        var num=0;
        for (var i=0;i<cards.length;i++){
            if(cards[i]==jinCard)
            {
                num++;
            }
        }
        return num;
    }
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
        MjClient.majiang_daningshuaijin = majiang;
    }
    else
    {
        module.exports = majiang;
    }
})();
