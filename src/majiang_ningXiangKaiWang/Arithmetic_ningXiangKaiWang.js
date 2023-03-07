
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
    majiang.isEqualHunCard = function(card){
        return card == 200;
    };

    //是否可以胡
    majiang.canHu = function(oCards, cd, hun, gangCard)
    {
        var cards = [].concat(oCards);
        if(cd){
            cards.push(cd);
        }
        cards = this.transformCards(cards, hun);
        var searchCards = cards.slice();
        if(gangCard){
            searchCards.push(gangCard);
        }

        var tData = MjClient.data.sData.tData;
        var pl = MjClient.data.sData.players[SelfUid()+ ""];
        if(this.jiangjiangHu(searchCards, pl.mjgang1, pl.mjgang0, pl.mjpeng, pl.mjchi)){
            return true;
        }

        if(is7Dui(cards)){
            return true;
        }

        if(isDuiDuiHu(pl.mjchi, cards)){
            return true;
        }

        var isNeedJiang = true;
        if(this.isSameColor(searchCards, pl.mjchi, pl.mjpeng, pl.mjgang0, pl.mjgang1)){
            isNeedJiang = false;
        }
        return this.canHuLaizi(cards, 0, isNeedJiang);
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
    };

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
    };

    //听牌函数，判断手牌能否听牌
    majiang.canTing = function (cds) {
        return false;
    };

    majiang.canGangWhenTing = function(hand, card)
    {
        return true;
    };

    //是否可以暗杠或者补杠
    majiang.canGang1 = function(peng, hand, putCount){
        var tData = MjClient.data.sData.tData;
        var sData = MjClient.data.sData;
        var pl = sData.players[SelfUid()+ ""];
        var rtn = [];
        for(var i = 0; i < peng.length; i++)
        {
            if(hand.indexOf(peng[i]) >= 0 && this.canHuAfterGang(pl, peng[i], tData.hunCard, tData.showCard))
            {
                rtn.push(peng[i]);
            }else if(peng[i] == tData.showCard && this.canHuAfterGang(pl, 0, tData.hunCard, tData.showCard)){
                rtn.push(peng[i]);
            }
        }
        var cnum = {};
        for(var i = 0; i < hand.length; i++)
        {
            var cd = hand[i];
            if(this.isHunCard(cd, tData.hunCard))
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
            if(num == 4){
                if(this.canHuAfterGang(pl, cd, tData.hunCard, tData.showCard)){
                    rtn.push(cd);
                }
            }
        }
        return rtn;
    };

    //获得
    majiang.getMaxCountHunCard = function(oCards, hunCard){
        var card = hunCard;
        if(typeof(hunCard) == "object"){
            var typeArr = {};
            for(var i = 0;i < oCards.length;i++){
                var tc = oCards[i];
                if(this.isHunCard(tc, hunCard)){
                    typeArr[tc] = typeArr[tc] ? typeArr[tc] + 1 : 1;
                }
            }
            if(Object.keys(typeArr).length == 0){
                card = hunCard[0];
            }else{
                var count = 0;
                for(var key in typeArr){
                    if(typeArr[key] >= count){
                        count = typeArr[key];
                        card = parseInt(key);
                    }
                }
            }
        }
        return card;
    };

    majiang.canHuAfterGang = function(pl, gangCard, hun, showCard){
        var cardArr = [].concat(pl.mjhand);
        var mjhand = cardArr.slice();
        for(var i = 0;i < cardArr.length;i++){
            if(cardArr[i] == gangCard){
                cardArr.splice(i, 1);
                i--;
            }
        }
        var searchCard = this.getMaxCountHunCard(cardArr, hun);
        var canHu = this.canHu(cardArr, searchCard, hun, gangCard);
        if(canHu){
            return true;
        }
        return false;
    };

    majiang.getCardCount = function(cards, cd){
        var count = 0;
        for(var i = 0;i < cards.length;i++){
            if(cards[i] == cd){
                count++;
            }
        }
        return count;
    };

    majiang.isSiWang = function(oCards, hunCard){
        var arr = {};
        for(var i = 0;i < oCards.length;i++){
            var card = oCards[i];
            if(card == 200){
                var num = card % 10;
                arr[num] = arr[num] ? arr[num] + 1 : 1;
            }
        }
        for(var key in arr){
            if(arr[key] == 4){
                return true;
            }
        }
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

    majiang.canChi = function(hand, cd,hunCard)
    {   
        var num = [0, 0, 0, 0, 0];
        var rtn = []; 
        if(this.isHunCard(cd, hunCard)){
            return rtn;
        }
        for(var i = 0; i < hand.length; i++)
        {
            var currCard = hand[i];
            if(this.isHunCard(currCard, hunCard)){
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

    majiang.getAllCardsTotal = function (){
        var tData = MjClient.data.sData.tData;
        if(tData) {
            return 108 - tData.huangNum;
        }else{
            return 108;
        }
    };

    majiang.setFlowerImg = function (node, pl){
        var icountNode = node.getChildByName("head").getChildByName("huaCount");
        if(icountNode != null) {
            var icount = pl.mjflower.length;
            icountNode.visible = true;
            changeAtalsForLabel(icountNode,icount);
        }
    };

    majiang.setJiaZhuNum = function (node, pl){
        if(!pl || !node) return;
        var icountNode = node.getChildByName("head").getChildByName("jiaZhu");
        if (!icountNode)
            return;
        var tData = MjClient.data.sData.tData;
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
        tingSet = this.calTingSet(cp, hunCard, isReturn);
        return tingSet;
    };

    majiang.calTingSet  = function (oCds, hun, isReturn)
    {
        if(cc.isUndefined(oCds)){
            return {};
        }

        var tData = MjClient.data.sData.tData;
        var sData = MjClient.data.sData;
        var pl = sData.players[SelfUid()+ ""];
        var allCardsArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29];

        var tingSet = {};
        for (var i = 0; i < allCardsArray.length; i++) {
            var cds = oCds.slice();
            var card = allCardsArray[i];
            // cds.push(card);
            var canHu = this.canHu(cds, card, hun);
            if (canHu) {
                tingSet[card] = 1;
                if(isReturn){
                    return tingSet;
                }
            }         
        }
        return tingSet;
    };

    majiang.getHuInfo = function(pl, canHu){
        var huScore = 0, huDesc = [];
        var mingTangCount = 0;
        var tData = MjClient.data.sData.tData;
        if(!tData){
            return {huScore: huScore, huDesc: huDesc, mingTangCount: mingTangCount};
        }
        var cards = this.transformCards(pl.mjhand.slice(), tData.hunCard);
        var noWang = false;
        if(!pl.skipHu && pl.putCount == 0 && pl.mjhand.length >= 13 && this.isNoWangAndJiang(cards, tData.showCard, tData.hunCard)){
            mingTangCount++;
            noWang = true;
            huScore += 7;
            huDesc.push("无王无将+7");        
        }
        if(!pl.skipHu && pl.putCount == 0 && pl.mjhand.length >= 13 && this.queYiSe(cards, tData.showCard)){
            mingTangCount++;
            huScore += 7;
            huDesc.push("缺一色+7");        
        }

        var wangCount = this.getHunCount(pl.mjhand, tData.hunCard);
        if(!pl.skipHu && wangCount == 1 && pl.mjhand.length >= 13 && pl.putCount == 0 && this.yiZhiHua(cards, tData.showCard)){
            mingTangCount++;
            huScore += 7;
            huDesc.push("一枝花+7");        
        }
        if(pl.putCount == 0 && pl.mjhand.length == 14 && canHu && pl.uid == tData.uids[tData.zhuang]){
            mingTangCount++;
            huScore += 7;
            huDesc.push("天胡+7");
        }
        if(is7Dui(cards)){
            mingTangCount++;
            huScore += 7;
            huDesc.push("小七对+7");        
        }
        if(isDuiDuiHu(pl.mjchi, cards)){
            mingTangCount++;
            huScore += 7;
            huDesc.push("碰碰胡+7");        
        }

        var jiangjiangHu = false;
        if(tData.uids[tData.curPlayer] == pl.uid && this.jiangjiangHu(cards, pl.mjgang1, pl.mjgang0, pl.mjpeng, pl.mjchi)){
            jiangjiangHu = true;
            mingTangCount++;
            huScore += 7;
            huDesc.push("将将胡+7");        
        }
        if(canHu && this.isSameColor(cards, pl.mjchi, pl.mjpeng, pl.mjgang0, pl.mjgang1)){
            mingTangCount++;
            huScore += 7;
            huDesc.push("清一色+7");
        }
        var cardCount = this.getCardCount(pl.mjhand, tData.showCard);
        var heiTianHu = false;
        var siWang = false;
        if(cardCount == 3){
            heiTianHu = true;
            mingTangCount++;
            huScore += 7;
            huDesc.push("黑天胡+7");        
        }
        if(this.isSiWang(pl.mjhand, tData.hunCard)){
            siWang = true;
            mingTangCount++;
            huScore += 7;
            huDesc.push("四王+7");        
        }    
        if(wangCount == 0 && !noWang && canHu){
            mingTangCount++;
            huScore += 7;
            huDesc.push("无王+7");        
        }
        if(wangCount == 6 && pl.mjhand.length > 6 && canHu){
            mingTangCount++;
            huScore += 7;
            huDesc.push("六王+7");        
        }
        var sHu = canHu || heiTianHu || siWang || jiangjiangHu;
        if(pl.tingStatus == 1 && sHu){
            mingTangCount++;
            huScore += 7;
            huDesc.push("报听+7");        
        }
        return {huScore: huScore, huDesc: huDesc, mingTangCount: mingTangCount};
    };

    majiang.getHunCount = function(cards, hunCard){
        var count = 0;
        for(var i = 0;i < cards.length;i++){
            if(this.isHunCard(cards[i], hunCard)){
                count++;
            }
        }
        return count;
    };

    //无王无将
    majiang.isNoWangAndJiang = function(oCards, showCard, hunCard){
        for(var i = 0;i < oCards.length;i++){
            var card = oCards[i];
            if(card == showCard || card == 200 || card % 10 == 2 ||
                card % 10 == 5 || card % 10 == 8)
            {
                return false;
            }
        }
        return true;
    };

    //缺一色(缺少王的花色)
    majiang.queYiSe = function(oCards, showCard){
        for(var i = 0;i < oCards.length;i++){
            if(oCards[i] == 200){
                return false;
            }
            if(Math.floor(oCards[i] / 10) == Math.floor(showCard / 10)){
                return false;
            }
        }
        return true;
    };

    //一枝花
    majiang.yiZhiHua = function(oCards, showCard){
        var firstCard;
        for(var i = 0;i < oCards.length;i++){
            if(oCards[i] == 200){
                continue;
            }
            if(Math.floor(oCards[i] / 10) == Math.floor(showCard / 10)){
                return false;
            }
            if(!firstCard){
                firstCard = oCards[i];
            }
            if(Math.floor(oCards[i] / 10) != Math.floor(firstCard / 10)){
                return false;
            }
        }
        return true;
    };

    // 清一色
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
    };

    majiang.canHuLaizi = function(oCards, cd, isNeedJiang) {
        var tData = MjClient.data.sData.tData;
        var cards = [];
        var laizi = 0;
        for (var i = 0; i < oCards.length; i++) {
            if (this.isHunCard(oCards[i], tData.hunCard) || this.isEqualHunCard(oCards[i])) {
                laizi++;
            }
            else {
                cards.push(oCards[i]);
            }
        }
        if (this.isHunCard(cd, tData.hunCard)) {
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
        // 依次删除一对牌做将，其余牌全部成扑则可胡
        for (var i = 0; i < cards.length; i++) {
            if (i > 0 && cards[i] == cards[i - 1]){
                continue; // 和上一次是同样的牌，略过不计算
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

    majiang.jiangjiangHu = function (mjhand, mjgang1, mjgang0, mjpeng, mjchi) {
        var cards = [].concat(mjhand, mjgang1, mjgang0, mjpeng, mjchi);
        for(var i = 0;i < cards.length;i++){
            var card = cards[i];
            if(card != 200 && card % 10 != 2 && card % 10 != 5 && card % 10 != 8){
                return false;
            }
        }
        return true;
    };

    if (typeof(MjClient) != "undefined")
    {
        MjClient.majiang_ningXiangKaiWang = majiang;
    }
    else
    {
        module.exports = majiang;
    }

    // var doTest = function(){
    //     var cards = [4,5,5,5,6,9,9,13,14,18];
    //     var MjClient = {};
    //     MjClient.data = {};
    //     MjClient.data.sData = {};
    //     MjClient.data.sData.tData = {};
    //     MjClient.data.sData.tData.showCard = 6;
    //     MjClient.data.sData.tData.hunCard = [5,7];
    //     var tingSets = majiang.calTingSet(cards,MjClient.data.sData.tData.hunCard);
    //     console.log(JSON.stringify(tingSets));
    // };
    // doTest();
})();
