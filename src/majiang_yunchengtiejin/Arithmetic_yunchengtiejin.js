
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

    // 混子牌统一替换为200
    majiang.transformCards = function(oCards, hunCard) 
    {

        if(cc.isNumber(hunCard))
        {
            hunCard = new Set([hunCard]);
        }
        else if (cc.isArray(hunCard))
        {
            hunCard = new Set(hunCard);
        }

        var cards = [];
        for (var i = 0; i < oCards.length; i++) {
            if (hunCard && hunCard.has(oCards[i])) {
                cards.push(200); 
            }
            else {
                cards.push(oCards[i]); 
            }
        }
        return cards;
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
        var tData = MjClient.data.sData.tData;
        if (tData.areaSelectMode["playType"] == 1) {
            return 108;
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
        MjClient.majiang_yunchengtiejin = majiang;
    }
    else
    {
        module.exports = majiang;
    }
})();
