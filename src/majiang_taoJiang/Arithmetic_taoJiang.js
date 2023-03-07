
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

    // 向服务器发送吃牌
    majiang.MJChiToServer = function(pos)
    {
        if (MjClient.rePlayVideo != -1) return; // 回放时候不能请求
        cc.log("====================MJChiToServer=================pos=" + pos);
        
        var sData = MjClient.data.sData;
        var tData = sData.tData;
        var func = function(){
            MjClient.gamenet.request("pkroom.handler.tableMsg", {
                cmd: "MJChi",
                pos: pos,
                eatFlag: EatFlag()
            });
        }

        var haveWangOfChi = function(){
            var hunCard = MjClient.data.sData.tData.hunCard;
            var pos1 = 0;
            var pos2 = 0;
            if(pos == 0){
                pos1 = 2;
                pos2 = 1;
            }else if(pos == 1){
                pos1 = 1;
                pos2 = -1;
            }else{
                pos1 = -1;
                pos2 = -2;
            } 

            return MjClient.majiang.isHunCard(tData.lastPutCard + pos1, hunCard) || MjClient.majiang.isHunCard(tData.lastPutCard + pos2, hunCard);
        }

        if(haveWangOfChi()){
            MjClient.showMsg("你确认要用王牌吃?", func, function(){}, "1");
        }else{
            func();
        }
    }

    //向服务器发送碰牌
    majiang.MJPengToServer = function()
    {
        if (MjClient.rePlayVideo != -1) return; // 回放时候不能请求
        cc.log("====================MJpengToServer=================");

        var tData = MjClient.data.sData.tData;
        var pl = getUIPlayer(0);
        if(pl.mustHu){
            return MjClient.showToast("有胡必胡");
        }

        var func = function(){
            MjClient.gamenet.request("pkroom.handler.tableMsg", {
                cmd: "MJPeng",
                eatFlag: EatFlag()
            });
        }

        if(MjClient.majiang.isHunCard(tData.lastPutCard, MjClient.data.sData.tData.hunCard)){
            MjClient.showMsg("你确认要碰王牌?", func, function(){}, "1");
        }else{
            func();
        }
    }

    //向服务器发送杠牌
    majiang.MJGangToServer = function (cd)
    {
        if (MjClient.rePlayVideo != -1) return; // 回放时候不能请求
        cc.log("====================MJGangToServer=================:", cd);
        
        var func = function(){
            MjClient.gamenet.request("pkroom.handler.tableMsg", {
                cmd: "MJGang",
                card: cd,
                eatFlag: EatFlag()
            });
        }

        if(MjClient.majiang.isHunCard(cd, MjClient.data.sData.tData.hunCard)){
            MjClient.showMsg("你确认要杠王牌?", func, function(){}, "1");
        }else{
            func();
        }
    }

    //是否可以胡
    majiang.canHu = function(oCards, cd, gangCard, isTing)
    {
        var isNeed258 = true;

        var tData = MjClient.data.sData.tData;
        var pl = MjClient.data.sData.players[SelfUid()];

        var allCards = oCards.slice();
        if(cd){
            allCards.push(cd);
        }
        allCards = this.transformCards(allCards, tData.hunCard);
        
        var seachCards = allCards.slice();
        if(gangCard){
            seachCards.push(gangCard);
        }
        if(this.isJJHu(seachCards, pl.mjchi, pl.mjpeng, pl.mjgang0, pl.mjgang1)){
            return true;
        }

        // 是否是地胡
        if (this.showCardCount(allCards, tData.showCard) >= 3 && !isTing) {
            return true;
        }

        // 7对
        if (is7Dui(allCards)) {
            return true;
        }

        // 碰碰胡
        if (pl.mjchi && isDuiDuiHu(pl.mjchi, allCards)) {
            return true;
        }

        // 清一色不需要258
        if (this.isSameColor(seachCards, pl.mjchi, pl.mjpeng, pl.mjgang0, pl.mjgang1)) {
            isNeed258 = false;
        }

        return this.canHuLaizi(allCards, 0, isNeed258);
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

    // 获取翻牌的数量 用来判断地胡
    majiang.showCardCount = function (cards, showCard) {

        var showCardsCount = 0;
        cards.map(function (cd) {
            if (cd == showCard) {
                showCardsCount++;
            }
        });

        return showCardsCount;
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
    majiang.canTing = function (cds,hun) {
        return Object.keys(this.calTingSet(cds, hun, true)).length > 0;
    };

    majiang.canGangWhenTing = function(hand, card)
    {
        return true;
    };

    // 是否可以补杠和暗杠
    majiang.canGang1 = function(peng, hand, putCount)
    {
        var tData = MjClient.data.sData.tData;
        var sData = MjClient.data.sData;
        var pl = sData.players[SelfUid()+ ""];
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
            if(num == 4)
            {
                {
                    rtn.push(cd);
                }
            }
        }
        //找出可杠能听的
        var newRtn = [];
        for(var index = 0; index < rtn.length; index++)
        {
            if(this.canHuAfterGang(pl.mjhand, rtn[index], pl, tData))
            {
                newRtn.push(rtn[index]);
            }
        }
        return newRtn;
    };

    majiang.canHuAfterGang = function(oCards, gangCard, pl, tData){
        var cardArr = [].concat(oCards);
        for(var i = 0;i < cardArr.length;i++){
            if(cardArr[i] == gangCard){
                cardArr.splice(i, 1);
                i--;
            }
        }
        var canHu = this.canHu(cardArr, 200, gangCard, true);
        return canHu;
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
        for(var i = 0; i < hand.length; i++)
        {
            var currCard = hand[i];
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

    majiang.getAllCardsTotal = function (tData)
    {
        return 108;
    };

    majiang.setFlowerImg = function (node, pl)
    {

        var icountNode = node.getChildByName("head").getChildByName("huaCount");
        if(icountNode != null) {
            var icount = pl.mjflower.length;
            icountNode.visible = true;
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
        return cd == hun;
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
        if(mjhandCard === undefined){
            return {};
        }
        isReturn = isReturn || false;
        var cp = mjhandCard.slice();
        if(selectCard > 0)
        {
            var index = cp.indexOf(selectCard);  //排除当前选择的一张牌
            cp.splice(index, 1);
        }
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
        var isTing = true;
        for (var i = 0; i < allCardsArray.length; i++) {
            var cds = oCds.slice();
            if(allCardsArray[i])
                cds.push(allCardsArray[i]);
            if (this.canHu(oCds, allCardsArray[i], false, isTing)) {
                tingSet[allCardsArray[i]] = 1;
                if(isReturn){
                    return tingSet;
                }
            } 
        }
        return tingSet;
    };

    majiang.canHuLaizi = function(oCards, cd, isNeed258) {
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
        cards.sort(function(a, b) {
            return a - b;
        });
        // 依次删除一对牌做将，其余牌全部成扑则可胡
        for (var i = 0; i < cards.length; i++) {
            if (i > 0 && cards[i] == cards[i - 1]){
                continue; // 和上一次是同样的牌，略过不计算
            }
            var yu = cards[i] % 10;
            if (yu != 2 && yu != 5 && yu != 8 && isNeed258) {
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

    majiang.isHunCard = function(cd, hunCard){
        return cd == hunCard;
    };

    majiang.getCardTotalNum = function (tData) {
        return 108;
    };

    if (typeof(MjClient) != "undefined")
    {
        MjClient.majiang_taoJiang = majiang;
    }
    else
    {
        module.exports = majiang;
    }

    function test(){
        require("../commonFunc.js");
        MjClient = {
            data:{
                sData:{
                    players:{

                    },
                    tData:{

                    }
                }
            }
        };
        var peng = [1,2,3,4];
        var hand = [1,2];
        var putCount = 3;
        var result = majiang.canGang1(peng, hand, putCount);
        console.log(result);
    }
    // test();
})();
