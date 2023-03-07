(function() {
    var majiang = {};
    var flowerArray = [111, 121, 131, 141, 151, 161, 171, 181];//花的列表，根据不同来设置

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

    //是否可以胡
    majiang.canHu = function(cards, cd)
    {

        if (is7Dui(cards, cd)) {
            var tData = MjClient.data.sData.tData;
            if (tData.areaSelectMode["isQiDui"]) {
                return true;
            }
            else
            {
                return false;
            }
        }
        return canHuLaizi(cards, cd);
    };

    //听牌函数，判断手牌能否听牌
    majiang.canTing = function (cds) {
        var tingSet = calTingSet(cds);
        for(var tingCard in tingSet) {
            var cd = Number(tingCard);
            // 七对和对对胡不能听牌
            if (is7Dui(cds, cd)) {
                return false;
            }
            if (isDuiDuiHu([], cds.concat(cd))) {
                return false;
            }
        }
        return Object.keys(tingSet).length == 1;
    };

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
        //听牌不变可以杠
        return true;
    };

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

    majiang.getAllCardsTotal = function()
    {
        var tData = MjClient.data.sData.tData;
        if(tData && !tData.areaSelectMode.isFenCard){
            return 120;
        }
        return 136;
    };

    majiang.setFlowerImg = function (node, pl)
    {

    };


    majiang.setJiaZhuNum = function (node, pl)
    {
        if(!pl) return;
        var icountNode = node.getChildByName("head").getChildByName("jiaZhu");
        if(pl.jiazhuNum) {
            icountNode.visible = true;
            icountNode.ignoreContentAdaptWithSize(true);
            icountNode.setString("下码 X2");
        }else{
            icountNode.setString("");
        }
    };

    // 是否处于游戏中状态
    majiang.getIsInTheGame = function(){
        var nowGameState = MjClient.data.sData.tData.tState;

        if(nowGameState == TableState.waitEat ||
            nowGameState == TableState.waitPut ||
            nowGameState == TableState.waitCard)
            return true;
        return false;
    };

    // 是否满足显示提示图标
    majiang.getIsShowTingTips = function(tingCards,mjhand,isHunCard){

        if(typeof(tingCards) == "number")
            return true;

        // 没有可听内容
        if(Object.keys(tingCards).length <= 0)
            return false;
        // 可以听但是没有可以胡的牌了

        var isShow = false
        for (var cd in tingCards) {
            var huNum = getHuCardNum(parseInt(cd));
            if(huNum != 0)
                isShow = true;
        }
        if(!isShow)
            return isShow;
        // 不是赖子，直接返回
        if(!isHunCard)
            return true;

        // 赖子再次校验
        // for (var i = 0; i < mjhand.length; i++) {
        //     // 必须剩余的牌全是赖子
        //     if(mjhand[i] != 71){
        //         return false;
        //     }
        // }
        return true;
    };

    //求出，听牌时，选择一张牌能胡的牌的张数 by sking
    majiang.getCheckTingHuCards = function (selectCard, mjhandCard) {
        var copyhand = mjhandCard.slice();
        if (selectCard) {
            var index = copyhand.indexOf(selectCard);//排除当前选择的一张牌
            copyhand.splice(index,1);
        }

        var tingSet = null;
        tingSet = calTingSet(copyhand, MjClient.data.sData.tData.hunCard);

        return tingSet;
    };


    //是否可以吃
    majiang.canChi = function(hand, cd)
    {
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
                    if(!majiang.isEqualHunCard(hand[i]) && !majiang.isEqualHunCard(cd))
                    {
                        num[dif + 2]++;
                    }
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

    if (typeof(MjClient) != "undefined")
    {
        MjClient.majiang_xuzhoupeixian = majiang;
    }
    else
    {
        module.exports = majiang;
    }
})();
