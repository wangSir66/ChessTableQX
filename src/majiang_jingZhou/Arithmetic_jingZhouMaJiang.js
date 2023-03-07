
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
    };

    //对对胡(飘胡)
    majiang.isDuiDuiHu = function(tData, mjchi, mjhand) {
        if (!tData.areaSelectMode.pengPengHu) {
            return false;
        }

        //有吃牌
        if (mjchi.length > 0) {
            return false;
        }

        var laiziNums = 0;
        var cds = mjhand.slice();

        var count1 = 0;
        var count2 = 0;
        var count3 = 0;
        var count4 = 0;

        //计算各牌的数量
        var PAI = {};
        var tempCD = 0;
        for(var i = 0; i < cds.length; i++)
        {
            tempCD = cds[i];
            if(this.isEqualHunCard(tempCD))
            {
                laiziNums++;
                continue;
            }

            if(PAI[tempCD])
            {
                PAI[tempCD]++;
            }
            else
            {
                PAI[tempCD] = 1;
            }
        }

        var tempCount = 0;
        for(var i in PAI)
        {
            tempCount = PAI[i];
            if(tempCount == 1) count1++;
            else if(tempCount == 2) count2++;
            else if(tempCount == 3) count3++;
            else if(tempCount == 4) count4++;
        }

        var needNums = count1 * 2 + count2 + count4 * 2 - 1;
        if(needNums <= laiziNums)
        {
            return true;
        }

        return false;
    }

    //无将胡
    majiang.wuJiangHu = function(tData, pl, mjhand){
        if (!tData.areaSelectMode.wuJiangHu) {
            return false;
        }
    
        if (MjClient.playui.getSelfUid() != tData.uids[tData.curPlayer] || pl.putCount != 0 || mjhand.length != 14) {
            return false;
        }
    
        if (pl.mjgang1.length != 0 || pl.mjgang0.length != 0 || pl.mjpeng.length != 0 || pl.mjchi.length != 0) {
            return false;
        }
    
        for (var i = 0; i < mjhand.length; i++) {
            var card = mjhand[i];
            if (this.isEqualHunCard(card)) {
                continue;
            }
    
            if (card % 10 == 2 || card % 10 == 5 || card % 10 == 8) {
                return false;
            }
        }
    
        return true;
    };

    //缺一色
    majiang.queYiSe = function(tData, pl, mjhand){
        if (!tData.areaSelectMode.queYiSe) {
            return false;
        }
    
        if (pl.uid != tData.uids[tData.curPlayer] || pl.putCount != 0 || mjhand.length != 14) {
            return false;
        }
    
        if (pl.mjgang1.length != 0 || pl.mjgang0.length != 0 || pl.mjpeng.length != 0 || pl.mjchi.length != 0) {
            return false;
        }
    
        var typeArr = [];
        for(var i = 0;i < mjhand.length;i++){
            var card = mjhand[i];
            if (this.isEqualHunCard(card)) {
                continue;
            }
            
            typeArr[Math.floor(card / 10)] = 1;
        }
    
        return typeArr.length < 3;
    }; 

    //是否可以胡
    majiang.canHu = function(oCards, cd, hun)
    {
        var tData = MjClient.data.sData.tData;
        var pl = MjClient.data.sData.players[MjClient.playui.getSelfUid()];
        var cards = [].concat(oCards);
        if (cd) {
            cards.push(cd);
        }

        if (this.wuJiangHu(tData, pl, cards)) {
            return true;
        }

        if (this.queYiSe(tData, pl, cards)) {
            return true;
        }

        if(this.isDuiDuiHu(tData, pl.mjchi, cards)){
            return true;
        }

        if(this.jiangjiangHu(tData, cards, pl.mjgang1, pl.mjgang0, pl.mjpeng, pl.mjchi)){
            return true;
        }

        if(tData.areaSelectMode.xiaoQiDui && is7Dui(cards)){
            return true;
        }

        var isNeedJiang = true;
        if(this.isSameColor(cards, pl.mjchi, pl.mjpeng, pl.mjgang0, pl.mjgang1)){
            isNeedJiang = false;
        }
        
        return this.canHuLaizi(cards, 0, isNeedJiang);
    };

    majiang.isSameColor = function(mjhand, mjchi, mjpeng, mjgang0, mjgang1){
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

    majiang.canHuLaizi = function(oCards, cd, isNeedJiang){
        var cards = [];
        var laizi = 0;
        isNeedJiang = isNeedJiang === undefined ? false : isNeedJiang;
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
        cards.sort(function(a, b) {
            return a - b;
        });
        // 依次删除一对牌做将,其余牌全部成扑则可胡
        for (var i = 0; i < cards.length; i++) {
            if (i > 0 && cards[i] == cards[i - 1]){
                continue; // 和上一次是同样的牌,略过不计算
            }
                if(isNeedJiang && cards[i] % 10 != 2 && cards[i] % 10 != 5 && cards[i] % 10 != 8) {
                    continue;
                }
                if ((i + 1 < cards.length && cards[i] == cards[i + 1]) || laizi > 0) {
                    var puCards = cards.slice();
                    var puLaizi = laizi;
                        puCards.splice(i, 1);
                    if (puCards[i] == cards[i] ) {
                        puCards.splice(i, 1);
                    }
                    else {
                        puLaizi--;
                    }
                    if (isPu(puCards, puLaizi)) {
                        return true;
                    }
                }
            }

        if (laizi >= 2 && isPu(cards, laizi - 2)) {
            return true;
        }
        return false;
    };

    majiang.jiangjiangHu = function (tData, mjhand, mjgang1, mjgang0, mjpeng, mjchi) {
        if (!tData.areaSelectMode.jiangJiangHu) {
            return false;
        }
    
        var cards = [].concat(mjhand, mjgang1, mjgang0, mjpeng, mjchi);
        for(var i = 0;i < cards.length;i++){
            var card = cards[i];
            if(card != 200 && card % 10 != 2 && card % 10 != 5 && card % 10 != 8){
                return false;
            }
        }
        return true;
    }

    //听牌函数，判断手牌能否听牌
    majiang.canTing = function (cds) {
        var sData = MjClient.data.sData;
        var tData = sData.tData;
        var pl = sData.players[MjClient.playui.getSelfUid()];
        return this.canHu(tData, pl, cards, 200);
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

        var isKaiGang = tData.touingUid != null && tData.touingUid == SelfUid() && tData.gangAddCard && tData.gangAddCard.length != 0;

        for(var i = 0; i < peng.length; i++)
        {
            if(hand[hand.length - 1] == peng[i] && !isKaiGang)
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
        if(isbool || ( pl.touziCount > 0)){
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
        return 108 - netData.areaSelectMode.chouPai;
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

    majiang.calTingSet  = function (oCds, hun, isReturn)
    {
        if(cc.isUndefined(oCds))
        {
            return {};
        }

        var tData = MjClient.data.sData.tData;

        var allCardsArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29];
    

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
        MjClient.majiang_jingZhouMaJiang = majiang;
    }
    else
    {
        module.exports = majiang;
    }

})();
