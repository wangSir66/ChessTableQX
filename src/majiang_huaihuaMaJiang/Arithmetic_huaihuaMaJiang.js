
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

    //是否可以胡
    majiang.canHu = function(oCards, cd, hun)
    {
        var newArr = [].concat(oCards);
        if(cd)
            newArr.push(cd);

        var cards = this.transformCards(newArr, hun);
        
        var tData = MjClient.data.sData.tData;
        var sData = MjClient.data.sData;
        var pl = sData.players[SelfUid() + ""];
        if (is7Dui(cards, 0)) {
            return true;
        }
        if(this.isJiangJiangHu(cards, 0))
            return true;

        return canHuLaizi(cards, 0);
    }
    majiang.isJiangJiangHu = function (cardArr, card) {
        var sData = MjClient.data.sData;
        var pl = sData.players[SelfUid() + ""];
        if(pl.mjchi.length > 0)
            return false;
        var arr1 = cardArr.concat(pl.mjpeng);
        var arr2 = arr1.concat(pl.mjgang1);
        var arrCard = arr2.concat(pl.mjgang0);
        if(card > 0)
            arrCard.push(card);
        var cardTable = {};
        for (var i = 0; i < arrCard.length; i++) {
            cardTable[arrCard[i]] = cardTable[arrCard[i]] || 0;
            cardTable[arrCard[i]]++;
        }
        for(var index in cardTable)
        {
            if(index == 200)
                continue;
            if(index % 10 == 2 || index % 10 == 5 || index % 10 == 8)
            {
                // return  true;
            }
            else
                return false;
        }
        return true;
    }

    //听牌函数，判断手牌能否听牌
    majiang.canTing = function (cds) {
        return false;
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
    majiang.canGang1 = function(peng, hand, putCount, isbool)
    {
        var sData = MjClient.data.sData;
        var tData = sData.tData;
        var pl = sData.players[SelfUid()+ ""];
        var rtn = [];
        if(sData.tData.touingUid != null && sData.tData.touingUid == SelfUid() && !tData.areaSelectMode.touhougang) {
            return rtn;
        }

        var isKaiGang = tData.areaSelectMode.touhougang && tData.touingUid != null && tData.touingUid == SelfUid() && tData.gangAddCard && tData.gangAddCard.length != 0;

        for(var i = 0; i < peng.length; i++)
        {
            if(hand[hand.length - 1] == peng[i] && pl.skipGang.indexOf(hand[hand.length - 1]) < 0 && !isKaiGang)
            {
                //手牌里的牌Push到rtn中
                rtn.push(peng[i]);
            }

            if (isKaiGang && tData.gangAddCard[0] == peng[i] && !majiang.isHunCard(tData.gangAddCard[0], tData.hunCard)) {
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
            if(num == 4 && !majiang.isHunCard(cd, tData.hunCard) && !isKaiGang){
                rtn.push(cd);
            }

            if (isKaiGang && num == 3 && tData.gangAddCard[0] == cd &&
                !majiang.isHunCard(tData.gangAddCard[0], tData.hunCard)) {
                //手牌里的牌Push到rtn中
                rtn.push(cd);
            }
        }
        //找出可杠能听的
        if(isbool || (tData.areaSelectMode.touhougang && pl.touziCount > 0)){
            var newRtn = [];
            for(var index = 0; index < rtn.length; ++index){
                if(this.tingAfterTuozi(rtn[index], hand)){
                    newRtn.push(rtn[index]);
                }
            }
            rtn = [].concat(newRtn);
        }
        return rtn;
    };

    majiang.canHuTing = function (cards, hun) {

        var tData = MjClient.data.sData.tData;
        var allCardsArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29];
        if(tData.areaSelectMode.sihongzhong)
            allCardsArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29, 71];
        for (var i = 0; i < allCardsArray.length; i++)
        {
            if (this.canHu(cards, allCardsArray[i], hun))
            {
                return true;
            }
        }
        return false;
    }

    majiang.tingAfterTuozi = function (card, cardArr) {
        var hangAfterGang = [];
        for(var i = 0; i < cardArr.length; i++)
        {
            if(card != cardArr[i])
            {
                hangAfterGang.push(cardArr[i]);
            }
        }
        //若听牌状态下，去掉所杠的牌不能再听则不能杠
        if (this.canHuTing(hangAfterGang, 71))
            return true;
        else
            return false;
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

    //向服务器发送骰子
    majiang.MJTouZiToServer = function(cd)
    {
        if (MjClient.rePlayVideo != -1) return; // 回放时候不能请求
        cc.log("====================MJTouZiToServer=================");
        MjClient.gamenet.request("pkroom.handler.tableMsg", {
            cmd: "MJGang",
            card: cd,
            isTouZi: true,
            eatFlag: EatFlag()
        });
    }

    //向服务器发送听牌操作
    majiang.MJTingToServer = function(uid, isTing)
    {
        if (MjClient.rePlayVideo != -1) return; // 回放时候不能请求
        cc.log("====================MJTingToServer=================");
        MjClient.gamenet.request("pkroom.handler.tableMsg", {
            cmd: "MJBaoTing",
            pl: uid,
            isting: isTing
        });
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
        var netData = MjClient.data.sData.tData;
        if(netData.areaSelectMode.sihongzhong)
            return 112;
        else
            return 108;
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
        if(!pl || !node) return;
        var icountNode = node.getChildByName("head").getChildByName("jiaZhu");
        if (!icountNode)
            return;
        var tData = MjClient.data.sData.tData;
        cc.log("===========飘分 = " + pl.jiazhuNum);
        if(pl.jiazhuNum > 0) {
            icountNode.visible = true;
            icountNode.ignoreContentAdaptWithSize(true);
            icountNode.setAnchorPoint(cc.p(1, 0.5))
            icountNode.setString("飘" + pl.jiazhuNum + "分");  
        }else{
            icountNode.setString("");
        }
    };

    majiang.isHunCard = function(cd, hun){
        if(cc.isNumber(hun) && cd == hun){
            return true;
        }
        if(cc.isArray(hun) && hun.indexOf(cd) >= 0){
            return true;
        }
        return false;
    };

    // 混子牌统一替换为200
    majiang.transformCards = function(oCards, hun) {
        if (!hun || hun == -1) {
            return oCards;
        }
        var cards = oCards.slice();
        for (var i = 0; i < cards.length; i++) {
            if (this.isHunCard(cards[i], hun)) {
                cards[i] = 200; 
            }
        }
        return cards;
    };

    majiang.getCheckTingHuCards = function (selectCard, mjhandCard, isReturn) {
        var hunCard = MjClient.data.sData.tData.hunCard;
        if(this.isHunCard(selectCard, hunCard)){
            return {};
        }
        if(mjhandCard === undefined){
            return {};
        }
        isReturn = isReturn || false;
        var cp = mjhandCard.slice();
        var index = cp.indexOf(selectCard);  //排除当前选择的一张牌
        cp.splice(index, 1);
        var tingSet = null;
        tingSet = this.calTingSet(cp, MjClient.data.sData.tData.hunCard, isReturn);
        return tingSet;
    };

    majiang.calTingSet  = function (oCds, hun, isReturn)
    {
        if(cc.isUndefined(oCds))
        {
            return {};
        }

        var tData = MjClient.data.sData.tData;

        var allCardsArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29];
        if(tData.areaSelectMode.sihongzhong)
            allCardsArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29, 71];

        var tingSet = {};
        var cds = oCds.slice();
        if ((oCds.length + 1) % 3 == 0) { // 14、11、8、5、2张牌
            cds = oCds.slice(0, -1);
        }

        for (var i = 0; i < allCardsArray.length; i++) {
            if (this.canHu(cds, allCardsArray[i], hun)) {
                tingSet[allCardsArray[i]] = 1;
                if(isReturn){
                    return tingSet;
                }
            } 
        }
        return tingSet;
    };

    if (typeof(MjClient) != "undefined")
    {
        MjClient.majiang_huaihuaMaJiang = majiang;
    }
    else
    {
        module.exports = majiang;
    }

})();
