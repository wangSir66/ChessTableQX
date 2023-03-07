
(function() {
    var majiang = {};

    //是否是花
    majiang.isCardFlower = function(card)
    {
        return false;
    }

    //设置花，参数是[]，必须设置
    majiang.setFlower = function(flower)
    {
    }

    //是否是混子
    majiang.isEqualHunCard = function(card)
    {
        if (!MjClient.data.sData.tData.areaSelectMode.youhongzhong)
            return card == 200;

        return card == 200 || card == 71;
    }
    majiang.isHunCard = function()
    {
        return false;
    }

    // 长沙麻将胡牌算法
    majiang.canHuLaizi = function(oCards, cd, isNeed258)
    {
        var cards = [];
        var laizi = 0;

        for (var i = 0; i < oCards.length; i++) {
            if (this.isEqualHunCard(oCards[i])) {
                laizi++;
            }
            else {
                cards.push(oCards[i]);
            }
        }

        if (this.isEqualHunCard(cd)) {
            laizi++;
        }
        else if (cd) {
            cards.push(cd);
        }

        if ((cards.length + laizi + 1) % 3 != 0) {
            return false;
        }

		// 全是红中也能胡
        if (cards.length == 0)
            return true;

        var lastPutCard = cards[cards.length - 1];

        cards.sort(function(a, b) {
            return a - b;
        })

        // 依次删除一对牌做将，其余牌全部成扑则可胡
        for (var i = 0; i < cards.length; i++) {
            // 和上一次是同样的牌，略过不计算
            if (i > 0 && cards[i] == cards[i - 1])
                continue;

            // 小胡，需2、5、8做将
            var yu = cards[i] % 10;
            if (yu != 2 && yu != 5 && yu != 8 && isNeed258)
                continue;

            if ((i + 1 < cards.length && cards[i] == cards[i + 1]) || laizi > 0) {

                var puCards = cards.slice();
                var puLaizi = laizi;
                puCards.splice(i, 1);
                if (puCards[i] == cards[i]) {
                    puCards.splice(i, 1);
                }
                else {
                    puLaizi--;
                }

                if (isPu(puCards, puLaizi))
                    return true;
            }
        }

        return false;
    }

    majiang.isJJHu = function(mjhand, mjchi, mjpeng, mjgang0, mjgang1)
    {
        var cardList = [mjhand, mjpeng, mjgang0, mjgang1, mjchi];
        for(var i = 0; i < cardList.length; i++)
        {
            var cds = cardList[i];
            for(var j = 0; j < cds.length; j++)
            {
                var cd = cds[j];
                if(this.isEqualHunCard(cd))
                {
                    continue;
                }

                var value = cd % 10;
                if( value != 2 && value != 5 && value != 8){
                    return false;
                }
            }
        }
        return true;
    }

    majiang.isSameColor = function(mjhand, mjchi, mjpeng, mjgang0, mjgang1)
    {
        var cardList = [mjhand, mjpeng, mjgang0, mjgang1, mjchi];
        var color = -1;
        for(var i = 0; i < cardList.length; i++)
        {
            var cds = cardList[i];
            for(var j = 0; j < cds.length; j++)
            {
                var cd = cds[j];
                if(this.isEqualHunCard(cd))
                {
                    continue;
                }

                if(color == -1)
                {
                    // 第一次找牌色,找到了就记录,以后按照这个处理
                    color = Math.floor(cd / 10);
                }
                else if(color != Math.floor(cd / 10))
                {
                    return false;
                }
            }
        }

        return true;
    }

    //是否可以胡
    majiang.canHu = function(oCards, cd)
    {
        var allCardsArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29];
        if (MjClient.data.sData.tData.areaSelectMode.youhongzhong)
            allCardsArray.push(71);
        if (allCardsArray.indexOf(cd) < 0 && cd != 200) {
            return false;
        }

        var allCards = oCards.slice();
        if (cd && cd > 0)
            allCards.push(cd);

        allCards = this.transformCards(allCards, 71);

        if (is7Dui(allCards))
            return true;

        var pl = getUIPlayer(0);

        if(this.isJJHu(allCards, pl.mjchi, pl.mjpeng, pl.mjgang0, pl.mjgang1)) {
            return true;
        }

        if (isDuiDuiHu(pl.mjchi, allCards))
            return true;

        var tData = MjClient.data.sData.tData;
        var isJiaJiangHu = tData.areaSelectMode.jiaJiangHu;
        var isNeed258 = !(isJiaJiangHu && pl.isTing); // 选了假将胡 且 开杠， 胡牌不用258
        // 门清非258 不要
        //cc.log("==== tData.areaSelectMode.menQing_no258 ",tData.areaSelectMode.menQing_no258,pl.mjhand,(pl.mjhand.length + pl.mjgang1.length * 3) >=13)
        if(tData.areaSelectMode.menQing_no258 && (pl.mjhand.length + pl.mjgang1.length * 3 >= 13)){
            isNeed258 = false;
        }

        // 清一色不需要258
        if( this.isSameColor(allCards, pl.mjchi, pl.mjpeng, pl.mjgang0, pl.mjgang1) )
            isNeed258 = false;
        // 全球人不需要258
        if (2 == allCards.length || 1 == allCards.length)
            isNeed258 = false;
        return this.canHuLaizi(oCards, cd, isNeed258);
    }

    majiang.canChi = function(hand, cd)
    {
        if (this.isEqualHunCard(cd)) //混牌不能吃
        {
            return [];
        }

        var num = [0, 0, 0, 0, 0];
        var rtn = [];

        for(var i = 0; i < hand.length; i++)
        {
            var currCard = hand[i];
            var ttCard = currCard;
            var ttCard1 = cd;
            var dif = ttCard - ttCard1;
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
    }

    //听牌函数，判断手牌能否听牌
    majiang.canTing = function (cds)
    {
        return this.canHu(cds, 200);
        //return true;
    }

    majiang.canGangWhenTing = function(hand, card)
    {
        var hangAfterGang = [];
        for(var i = 0; i < hand.length; i++)
        {
            if(card != hand[i])
            {
                hangAfterGang.push(hand[i]);
            }
        }
        //若听牌状态下，去掉所杠的牌不能再听则不能杠
        if (!majiang.canTing(hangAfterGang)) {
            return false;
        }
        //求出之前听的牌
        var tingSet1 = calTingSet(hand);
        //求出杠之后听的牌
        var tingSet2 = calTingSet(hangAfterGang);
        //对比前后听的牌
        if (Object.keys(tingSet1).length != Object.keys(tingSet2).length){
            return false;
        }
        for(var tingCard in tingSet1) {
            if (!(tingCard in tingSet2)) {
                return false;
            }
        }

        return true;
    }

    majiang.canKaiGang = function(hand, card, isZimo, peng, isAgainKaiGang)
    {
        cc.log("canKaiGang:hand=" + hand + " card=" + card + " isZimo=" + isZimo + " peng=" + peng + " isAgainKaiGang=" + isAgainKaiGang);
        var cards = hand.slice();
        var subNum = 3;
        if (isAgainKaiGang && peng && peng.indexOf(card) != -1)
            subNum = 0;
        else if (isZimo && peng && peng.indexOf(card) != -1)
            subNum = 1;
        else if (isZimo)
            subNum = 4;

        cc.log("subNum=" + subNum);
        for (var i = 0; i < subNum; i ++)
        {
            var index = cards.indexOf(card);
            if (index == -1)
                return false;
            else
                cards.splice(index, 1);
        }

        var isJiaJiangHu = MjClient.data.sData.tData.areaSelectMode.jiaJiangHu;
        var isNeed258 = !isJiaJiangHu; // 选了假将胡 且 开杠， 胡牌不用258 

        var pl = getUIPlayer(0);
        var _gang1 = false;
        if(pl.mjpeng.indexOf(card) >= 0){
            pl.mjgang0.push(card);
        }else{
            pl.mjgang1.push(card);
            _gang1 = true;
        }
        
        if (this.canHuLaizi(cards, 200, isNeed258)) {
            if(_gang1)
                pl.mjgang1.pop();
            else
                pl.mjgang0.pop();
            return true;
        }
        
        // cc.log("=== lms iii -- ")
        // cc.log(" ====== isNeed258 && menQing && menQing_no258 && !IsTurnToMe() ",isNeed258  , menQing_no258 , !IsTurnToMe())
        
        var ret = this.canHu2(cards, 200, card, isAgainKaiGang);
        if(_gang1)
            pl.mjgang1.pop();
        else
            pl.mjgang0.pop();
        
        return ret;
    }

    //是否可以胡 为开杠 而做的 开杠后能胡
    majiang.canHu2 = function(oCards, cd, card, isAgainKaiGang)
    {
        var allCardsArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29];
        if (MjClient.data.sData.tData.areaSelectMode.youhongzhong)
            allCardsArray.push(71);
        if (allCardsArray.indexOf(cd) < 0 && cd != 200) {
            return false;
        }

        var allCards = oCards.slice();
        if (cd && cd > 0)
            allCards.push(cd);

        allCards = this.transformCards(allCards, 71);

        if (is7Dui(allCards))
            return true;

        var pl = getUIPlayer(0);
        if(this.isJJHu(allCards, pl.mjchi, pl.mjpeng, pl.mjgang0, pl.mjgang1)) {
            return true;
        }
        if (isDuiDuiHu(pl.mjchi, allCards))
            return true;
        var tData = MjClient.data.sData.tData;
        var isJiaJiangHu = tData.areaSelectMode.jiaJiangHu;
        var isNeed258 = !(isJiaJiangHu && pl.isTing); // 选了假将胡 且 开杠， 胡牌不用258
        // 门清非258 不要
        //cc.log("==== tData.areaSelectMode.menQing_no258 ",tData.areaSelectMode.menQing_no258,pl.mjhand,(pl.mjhand.length + pl.mjgang1.length * 3) >=13)
        var num = 0;
        for (var i = 0; i < pl.mjhand.length; i++) {
            if (pl.mjhand[i] == card) num++;
        }
        // cc.log(" ==== pl.mjhand ",pl.mjhand)
        // cc.log(" ==== cd ",cd,num)

        // cc.log("==== lms --yyy  ",tData.areaSelectMode.menQing_no258 , (pl.mjhand.length + pl.mjgang1.length * 3 >= 13), num == 4)
        // cc.log(" ====== lms --- isNeed258 ",isNeed258,tData.areaSelectMode.menQing_no258 , (pl.mjhand.length + pl.mjgang1.length * 3 >= 13) , num == 4)
        // cc.log("===pl.mjhand ",pl.mjhand," pl.mjgang1 ",pl.mjgang1,"card, num",card, num, "MjClient.playui.isKaiGang ",MjClient.playui.isKaiGang);
        if(tData.areaSelectMode.menQing_no258 && (pl.mjhand.length + pl.mjgang1.length * 3 >= 13)){
            if(num == 3 && isAgainKaiGang)
                isNeed258 = false;
            else if(num == 4)
                isNeed258 = false;
        }
        // cc.log(" ====== lms --- isNeed258 aaaa ",isNeed258)
        // 清一色不需要258
        if( this.isSameColor(allCards, pl.mjchi, pl.mjpeng, pl.mjgang0, pl.mjgang1) )
            isNeed258 = false;
        // cc.log(" ====== lms --- isNeed258 ssss",isNeed258)
        // 全球人不需要258
        if (2 == allCards.length || 1 == allCards.length)
            isNeed258 = false;
        // cc.log(" ====== lms --- isNeed258 ddddd",isNeed258)

        // cc.log(" ====== lms --- ffff ",this.canHuLaizi(oCards, cd, isNeed258))
        return this.canHuLaizi(oCards, cd, isNeed258);
    }



    //是否可以杠
    majiang.canGang1 = function(peng, hand, isTing)
    {
        if (isTing) // 开杠过后，玩家不能对其他人打出的牌进行吃、碰、明杠操作，也不能再暗杠自己手里之前就有的四张牌，可以用自己摸到的牌补杠或者暗杠
        {
            var lastCard = hand[hand.length - 1];
            if (peng.indexOf(lastCard) >= 0 && majiang.canGangWhenTing(hand, lastCard))
                return [lastCard];

            var num = 1;
            for (var i = 0; i < hand.length - 1; i++)
            {
                if (hand[i] == lastCard)
                    num ++;
            }
            if (num == 4 && majiang.canGangWhenTing(hand, lastCard))
                return [lastCard];

            return [];
        }

        var rtn = [];
        for(var i = 0; i < peng.length; i++)
        {
            if(hand.indexOf(peng[i]) >= 0)
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
            if(num == 4 && !this.isEqualHunCard(cd)) //混牌不能杠
            {
                rtn.push(cd);
            }
        }

        return rtn;
    };

    //是否可以明杠
    majiang.canGang0 = function(hand, cd, isTing)
    {
        if (this.isEqualHunCard(cd))//混牌不能杠
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
        if (this.isEqualHunCard(cd))//混牌不能碰
        {
            return false;
        }

        var num = 0;
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
    //玩家杠后是否可以胡
    majiang.canHuAfterGang = function(oCards, gangCard, hun){
        var cardArr = [].concat(oCards);
        for(var i = 0;i < cardArr.length;i++){
            if(cardArr[i] === gangCard){
                cardArr.splice(i, 1);
                i--;
            }
        }
        return this.canHu(cardArr, 101, hun);
    };

    majiang.getAllCardsTotal = function ()
    {
        var tData = MjClient.data.sData.tData;
        var areaSelectMode = tData.areaSelectMode;
        if(tData.shuffleCardsNum)
            return tData.shuffleCardsNum;

        return 108;
    };

    majiang.setFlowerImg = function (node, pl)
    {
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
            icountNode.setAnchorPoint(cc.p(1, 0.5))
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


    majiang.calTingSet  = function (oCds, hun)
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

        cc.log("===========cds function majiang.calTingSet ======= " + JSON.stringify(cds));

        var allCardsArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29];
        if (MjClient.data.sData.tData.areaSelectMode.youhongzhong)
            allCardsArray.push(71);
        for (var i = 0; i < allCardsArray.length; i++) {
            if (MjClient.majiang.canHu(cds, allCardsArray[i], hun)) {
                tingSet[allCardsArray[i]] = 1;
            }
        }
        return tingSet;
    };


    //求出，听牌时，选择一张牌能胡的牌的张数 by sking
    majiang.getCheckTingHuCards = function (selectCard, mjhandCard) {
        var copyhand = mjhandCard.slice();
        if (selectCard) {
            var index = copyhand.indexOf(selectCard);//排除当前选择的一张牌
            if (index >= 0)
                copyhand.splice(index,1);
        }

        var tingSet = null;
        tingSet = this.calTingSet(copyhand, MjClient.data.sData.tData.hunCard);

        return tingSet;
    };

    // 向服务器发送吃牌
    majiang.MJChiToServer = function(pos, cd)
    {
        if (MjClient.rePlayVideo != -1) return; // 回放时候不能请求
        cc.log("====================MJChiToServer=================pos=" + pos);
        MjClient.playui.hideAllEat();
        MjClient.gamenet.request("pkroom.handler.tableMsg", {
            cmd: "MJChi",
            card: cd,
            pos: pos,
            eatFlag: this.EatFlag()
        });
    }

    majiang.MJHuToServer = function(cd)
    {
        if (MjClient.rePlayVideo != -1) return; // 回放时候不能请求
        cc.log("====================majiang.MJHuToServer=================");
        MjClient.playui.hideAllEat();
        MjClient.gamenet.request("pkroom.handler.tableMsg", {
            cmd: "MJHu",
            card: cd,
            eatFlag: this.EatFlag()
        });
    }

    majiang.MJPengToServer = function(cd)
    {
        if (MjClient.rePlayVideo != -1) return; // 回放时候不能请求
        cc.log("====================MJPengToServer=================");
        MjClient.playui.hideAllEat();
        MjClient.gamenet.request("pkroom.handler.tableMsg", {
            cmd: "MJPeng",
            card: cd,
            eatFlag: this.EatFlag()
        });
    }

    //向服务器发送杠牌
    majiang.MJGangToServer = function(cd, isKaiGang)
    {
        cc.log("cd=" + cd)

        if (MjClient.rePlayVideo != -1) return; // 回放时候不能请求
        cc.log("====================MJGangToServer=================");
        MjClient.playui.hideAllEat();
        MjClient.gamenet.request("pkroom.handler.tableMsg", {
            cmd: "MJGang",
            card: cd,
            isKaiGang: isKaiGang || false,
            eatFlag: this.EatFlag()
        });

        // 我可以开杠， 有两人可以胡， 我开杠后， 一人点胡牌， 我会再次显示选择按钮 wuyh fix
        // getUIPlayer(0).eatFlag = 0;
        // getUIPlayer(0).eatFlag2= 0;
    }

    majiang.MJPassConfirmToServer = function()
    {
        if (MjClient.rePlayVideo != -1) return; // 回放时候不能请求
        cc.log("====================MJPassConfirmToServer 11111 =================");
        MjClient.playui.hideAllEat();
        MjClient.gamenet.request("pkroom.handler.tableMsg", {
            cmd: "MJPass",
            eatFlag: this.EatFlag()
        });
    }

    majiang.EatFlag = function()
    {
        var pl = getUIPlayer(0);
        var ef = pl.eatFlag | pl.eatFlag2
        // 我可以开杠， 有两人可以胡， 我开杠后， 一人点胡牌， 我会再次显示选择按钮 wuyh fix
        pl.eatFlag = 0;
        pl.eatFlag2 = 0;
        return ef;
    }

    if (typeof(MjClient) != "undefined")
    {
        MjClient.majiang_changSha = majiang;
    }
    else
    {
        module.exports = majiang;
    };

})();
