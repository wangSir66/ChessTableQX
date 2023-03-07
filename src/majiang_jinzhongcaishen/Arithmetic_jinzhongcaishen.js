
(function() {
    var majiang = {};
    var flowerArray = [111, 121, 131, 141, 151, 161, 171, 181];//花的列表，根据不同来设置

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

    // 十三幺
    majiang.isShisanyao = function(oCards, cd) {
        var yao13 = {1:0, 9:0, 11:0, 19:0, 21:0, 29:0, 31:0, 41:0, 51:0, 61:0, 71:0, 81:0, 91:0};
        var cards = oCards.slice();
        if (cd) {
            cards.push(cd);
        }
        var laiziCount = 0;
        for (var i = 0; i < cards.length; i++) {
            if (cards[i] == 200 || cards[i] == 81) {
                laiziCount++;
            }
            else if (cards[i] in yao13) {
                yao13[cards[i]]++;
            }
            else {
                return false;
            }
        }
        var count0 = 0;
        for (var card in yao13) {
            if (yao13[card] > 2) {
                return false;
            }
            if (yao13[card] === 0) {
                count0++;
            }
        }
        return laiziCount >= count0;
    }

    //是否可以胡
    majiang.canHu = function(oCards, cd)
    {
        var cards = oCards.slice();
        for (var i = 0; i < cards.length; i++) {
            if (cards[i] == 81) {
                cards[i] = 200;
            }
        }
        if (this.isShisanyao(cards, cd)) {
            return true;
        }
        var check = function() {
            var cds = cards.slice();
            var last = cd || cds.pop();
            if (last > 30) {
                return true;
            }
            var colorSet = new Set();
            for (var i = 0; i < cds.length; i++) {
                if (cds[i] < 30) {
                    colorSet.add(Math.floor(cds[i] / 10));
                }
            }
            var pl = getUIPlayer(0);
            if (pl && pl.mjpeng) {
                var otherCards = pl.mjpeng.concat(pl.mjgang0).concat(pl.mjgang1);
                for (var i = 0; i < otherCards.length; i++) {
                    colorSet.add(Math.floor(otherCards[i] / 10));
                }
            }
            if (colorSet.size <= 1) {
                return true;
            }
            return colorSet.has(Math.floor(last / 10));
        }
        if (!check()) {
            return false;
        } 
        if (is7Dui(cards, cd)) {
            return true;
        }
        return canHuLaizi(cards, cd);
    }


    majiang.canAutoHu = function(cards) {
        if (cards.length % 3 == 2) { // 14、11、8、5、2张牌
            cards = cards.slice(0, -1);
        }
        for (var i = 0; i <= 20; i += 10) {
            var numCount = 0;
            for (var j = 1; j <= 9; j++) {
                if (cards.indexOf(i + j) >= 0){
                    numCount++;
                }
            }
            if (numCount >= 8) {
                for (var j = 1; j <= 9; j++) {
                    if (this.isYitiaolong(cards.concat([i + j]))) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    majiang.isYitiaolong = function(cards) { //一条龙：同色一至九
        for (var i = 0; i <= 20; i += 10) {
            var numCount = 0;
            for (var j = 1; j <= 9; j++) {
                if (cards.indexOf(i + j) >= 0){
                    numCount++;
                }
            }
            if (numCount >= 9) {
                var cds = cards.slice();
                for (var j = 1; j <= 9; j++) {
                    cds.splice(cds.indexOf(i + j), 1);
                }
                return this.canHu(cds);
            }
        }
        return false;
    }


    //听牌函数，判断手牌能否听牌
    majiang.canTing = function (cards, allCards, shisanyao) {
        if (shisanyao && this.isShisanyao(cards, 200)) {
            return true;
        }
        var cardSet = [0, 0, 0];
        var lack = 0;
        for (var i = 0; i < allCards.length; i++) {
            var color = Math.floor(allCards[i] / 10);
            if (allCards[i] > 0 && color < 3) {
                cardSet[color] = 1;
            }
        }
        for (var i = 0; i < 3; i++) {
            if (cardSet[i] == 0) {
                lack++;
            }
        }
        if (lack === 0) {
            return false;
        }
        // cc.log("没有杠按钮啊？？？？？ ", cards)
        return this.canHu(cards, 200);
    }

    majiang.canGangWhenTing = function(hand, card)
    {
        return false;
    }

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
        if(MjClient.data.sData.tData.areaSelectMode["is68"] && MjClient.data.sData.tData.uids.length == 2)
        {
            return (136 - 68);
        }
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
        MjClient.majiang_jinzhongcaishen = majiang;
    }
    else
    {
        module.exports = majiang;
    }
})();
