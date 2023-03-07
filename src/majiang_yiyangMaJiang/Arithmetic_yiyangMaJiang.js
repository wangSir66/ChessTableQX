
(function() {
    var majiang = {};
    var flowerArray = [];//花的列表，根据不同来设置

    //是否是花
    majiang.isCardFlower = function(card)
    {
        return flowerArray.indexOf(card) >= 0;
    };

    //设置花，参数是[]，必须设置
    majiang.setFlower = function(flower)
    {
        flowerArray = flower || [];
    };

    //是否是混子
    majiang.isEqualHunCard = function(card)
    {
        return card == 200;
    };

    majiang.isHunCard = function(card, hunCard){
        return card == hunCard;
    };

    //玩家杠后是否可以胡
    majiang.canHuAfterGang = function(oCards, gangCard, hun){
        var cardArr = [].concat(oCards);
        for(var i = 0;i < cardArr.length;i++){
            if(cardArr[i] == gangCard){
                cardArr.splice(i, 1);
                i--;
            }
        }

        return this.canHu(cardArr, 101, hun);
    };

    majiang.canChi = function(hand, cd,hunCard)
    {
        //将白板转为配子牌
        var num = [0, 0, 0, 0, 0];
        var rtn = [];
        if(cd == hunCard){
            return rtn;
        }
        for(var i = 0; i < hand.length; i++)
        {
            var currCard = hand[i];
            if(currCard == hunCard){
                continue;
            }
            var dif = currCard - cd;
            switch (dif)
            {
                case -2:
                case -1:
                case 1:
                case 2:
                    num[dif + 2]++;
                    break;
            }
        }
        if(num[3] > 0 && num[4] > 0)
        {
            rtn.push(0);
        }
        if(num[1] > 0 && num[3] > 0)
        {
            rtn.push(1);
        }
        if(num[0] > 0 && num[1] > 0)
        {
            rtn.push(2);
        }
        return rtn;
    };

    // 将将胡 全是2，5，8
    majiang.isJJHu = function (mjhand, mjchi, mjpeng, mjgang0, mjgang1) {
        var cardList = [mjhand, mjpeng, mjgang0, mjgang1, mjchi];
        for (var i = 0; i < cardList.length; i++) {
            var cds = cardList[i];
            for (var j = 0; j < cds.length; j++) {
                var cd = cds[j];
                if (this.isEqualHunCard(cd)) {
                    continue;
                }

                var value = cd % 10;
                if (value != 2 && value != 5 && value != 8) {
                    return false;
                }
            }
        }
        return true;
    };

    //是否可以胡
    majiang.canHu = function(oCards, cd, hun)
    {
        var cards = oCards.slice();
        if (cd) {
            cards.push(cd);
        }

        cards = this.transformCards(cards, hun);
        var tData = MjClient.data.sData.tData;
        var pl = MjClient.data.sData.players[SelfUid()];

        if(this.isJJHu(cards, pl.mjchi, pl.mjpeng, pl.mjgang0, pl.mjgang1)){
            return true;
        }

        if (is7Dui(cards)) {
            return true;
        }
        
        return canHuLaizi(cards);
    };

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
    }

    //处理听
    majiang.HandleMJTing = function(node,msg,off)
    {
        var sData=MjClient.data.sData;
        var tData=sData.tData;
        var selfIndex=getPlayerIndex(off);
        if( tData.uids[selfIndex]!=msg.uid || msg.tingStatus!=1) return;
        var pl = getUIPlayer(off);
        if(pl)
        {
            cc.log("播放听动画");
            /*
                显示听的标志，add by sking
             */

            ShowEatActionAnim(node,ActionType.TING,off);
            var tingIcon = node.getChildByName("head").getChildByName("tingIcon");
            var _cardIcon = node.getChildByName("head").getChildByName("tingCard");
            if(_cardIcon){
                _cardIcon.visible = false;
            }
            if(tingIcon){
                tingIcon.visible = true;
            }
        }
    }

    //听牌函数，判断手牌能否听牌
    majiang.canTing = function (cds,hun) {
        return this.canHu(cds, 200, hun);
    }

    majiang.canGangWhenTing = function(mjhand, card)
    {
        var hangAfterGang = [];
        for (var i = 0; i < mjhand.length; i++) {
            if (card != mjhand[i]) {
                hangAfterGang.push(mjhand[i]);
            }
        }
        //若听牌状态下，去掉所杠的牌不能再听则不能杠
        if (!this.canTing(hangAfterGang, MjClient.data.sData.tData.hunCard)) {
            return false;
        }

        //求出之前听的牌 手牌要去掉最后一张补上来的牌
        var cards = mjhand.slice(0, mjhand.length - 1);
        var tingSet1 = this.calTingSet(cards, MjClient.data.sData.tData.hunCard, true);
        //求出杠之后听的牌
        var tingSet2 = this.calTingSet(hangAfterGang, MjClient.data.sData.tData.hunCard, true);
 
        return (Object.keys(tingSet2).length <= Object.keys(tingSet1).length);
    
        //对比前后听的牌
        // if (Object.keys(tingSet1).length > Object.keys(tingSet2).length) {
        //     return false;
        // }
        // for (var tingCard in tingSet1) {
        //     if (!(tingCard in tingSet2)) {
        //         return false;
        //     }
        // }
        //听牌不变可以杠  -- 在益阳麻将里没有这个规则，只能小于等于
        // return true;
    }

    //是否可以杠
    majiang.canGang1 = function(peng, hand, putCount)
    {
        var rtn = [];

        var pl = MjClient.data.sData.players[SelfUid()];

        // 最后一张牌不能杠
        if (this.getAllCardsTotal() - MjClient.data.sData.tData.cardNext == 0) {
            return rtn;
        }

        for(var i = 0; i < peng.length; i++)
        {
            // 听的状态没有选报听暗杠才能补杠
            if(pl.isNew && hand[hand.length - 1] == peng[i] && (!pl.isTing || !MjClient.data.sData.tData.areaSelectMode.baotingAG))
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
            if(num == 4 && cd != 71 && (pl.tingStatus != 1 || (pl.tingStatus == 1 && majiang.canGangWhenTing(hand, cd))))
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
        var tData = MjClient.data.sData.tData;
        return 108 - tData.areaSelectMode.maiPaiCount;
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

     majiang.getCheckTingHuCards = function (selectCard, mjhandCard, isReturn) {
        var hunCard = MjClient.data.sData.tData.hunCard;
        // if(this.isHunCard(selectCard, hunCard)){
        //     return {};
        // }
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

        var tData = MjClient.data.sData;
        var sData = MjClient.data.sData;
        var pl = sData.players[SelfUid()+ ""];
        var allCardsArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29];
        var tingSet = {};
        for (var i = 0; i < allCardsArray.length; i++) {
            var cds = oCds.slice();
            if(allCardsArray[i])
                cds.push(allCardsArray[i]);
            if (this.canHu(oCds, allCardsArray[i])) {
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
        MjClient.majiang_yiyangMJ = majiang;
    }
    else
    {
        module.exports = majiang;
    }
})();
