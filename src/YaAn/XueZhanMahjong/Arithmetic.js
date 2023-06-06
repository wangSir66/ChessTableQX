
(function () {
    ///////////////////////连云港的十三幺牌型（传说中的大乱）/////////////////////////
    var p133 = [
        [1, 4, 7], [2, 5, 8], [3, 6, 9],
        [11, 14, 17], [12, 15, 18], [13, 16, 19],
        [21, 24, 27], [22, 25, 28], [23, 26, 29]
    ];
    var p131 = [31, 41, 51, 61, 71, 81, 91, 200];
    ///////////////////////////////////////////////////////////////////////////
    var majiang = {};

    majiang.handCount = 13;

    majiang.initAreaSelectMode = function (areaSelectMode) {
        //牌张
        let formIng = areaSelectMode.Forming;
        if (!formIng) formIng = 13;
        this.handCount = formIng;
    }
    /**
     * 标准十三幺牌型（连云港的十三幺不是这样的）
     * 　1饼、9饼、1索、9索、1万、9万、东、南、西、北、中、发、白十三种牌统称幺九牌。
     * 	 这十三种牌某一种有两枚，而另十二种各一枚，共计十四枚，即构成十三幺。
     */
    var flowerArray = [];//花的列表，根据不同来设置


    //是否是花
    majiang.isCardFlower = function (card) {
        if (flowerArray.length == 0)
            return false;
        var flowerIndex = flowerArray.indexOf(card);
        if (flowerIndex >= 0) {
            return true;
        }

        return false;
    }


    //设置花，参数是[]，必须设置
    majiang.setFlower = function (flower) {
        flowerArray = flower;
    }


    //是否是混子
    majiang.isEqualHunCard = function (card) {
        return card == 200;
    }

    //是否有花8版
    majiang.isFlower8 = function (card) {
        switch (card) {
            case 111:
            case 121:
            case 131:
            case 141:
            case 151:
            case 161:
            case 171:
            case 181:
                return true;
        }
        return false;
    };
    //是否有花20版
    majiang.isFlower20 = function (card) {
        switch (card) {
            case 71:
            case 81:
            case 91:
            case 111:
            case 121:
            case 131:
            case 141:
            case 151:
            case 161:
            case 171:
            case 181:
                return true;
        }
        return false;
    };


    //胡牌判断，基础胡牌逻辑
    majiang.canHu = function (cards, cd) {
        if (is7Dui(cards, cd)) {
            return true;
        }
        if (this.isShiSanPao(cards, cd)) {
            return true;
        }
        return canHuLaizi(cards, cd);
    }

    //听牌函数，判断手牌能否听牌
    majiang.canTing = function (cards) {
        return this.canHu(cards, 200);
    }

    //去掉重复的牌
    majiang.ruleOutByArr = function (cds) {
        var dict = {};
        var arr = [];
        for (var i = 0; i < cds.length; i++) {
            if (!dict[cds[i]]) {
                dict[cds[i]] = "";
            }
        }

        var objDict = Object.keys(dict);
        for (var i = 0; i < objDict.length; i++) {
            arr.push(parseInt(objDict[i]));
        }

        return arr;
    }



    majiang.canGangWhenTing = function (hand, card) {
        var hangAfterGang = [];
        for (var i = 0; i < hand.length; i++) {
            if (card != hand[i]) {
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
        if (Object.keys(tingSet1).length != Object.keys(tingSet2).length) {
            return false;
        }
        for (var tingCard in tingSet1) {
            if (!(tingCard in tingSet2)) {
                return false;
            }
        }
        //听牌不变可以杠
        return true;
    }

    //是否可以杠
    majiang.canGang1 = function (peng, hand, isTing) {
        var rtn = [];
        for (var i = 0; i < peng.length; i++) {
            //过杠不能杠
            if (hand.indexOf(peng[i]) >= 0 && (!isTing || majiang.canGangWhenTing(hand, peng[i]))) {
                //手牌里的牌Push到rtn中
                rtn.push(peng[i]);
            }
        }

        var cnum = {};
        for (var i = 0; i < hand.length; i++) {
            var cd = hand[i];
            if (majiang.isEqualHunCard(cd)) {
                continue;
            }

            var num = cnum[cd];
            if (!num) {
                num = 0;
            }

            num++;
            cnum[cd] = num;
            if (num == 4 && (!isTing || majiang.canGangWhenTing(hand, cd))) {
                rtn.push(cd);
            }
        }

        return rtn;
    };



    //是否可以明杠
    majiang.canGang0 = function (hand, cd, isTing) {
        if (majiang.isEqualHunCard(cd))//混牌不能杠
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
    majiang.canPeng = function (hand, cd) {
        var num = 0;
        if (majiang.isEqualHunCard(cd))//混牌不能碰
        {
            return false;
        }

        for (var i = 0; i < hand.length; i++) {
            if (hand[i] == cd) {
                num++;
            }
        }

        return num >= 2;
    };



    //是否可以吃
    majiang.canChi = function (hand, cd) {
        var num = [0, 0, 0, 0, 0];
        var rtn = [];
        for (var i = 0; i < hand.length; i++) {
            var dif = hand[i] - cd;
            switch (dif) {
                case -2:
                case -1:
                case 1:
                case 2:
                    if (!majiang.isEqualHunCard(hand[i]) && !majiang.isEqualHunCard(cd)) {
                        num[dif + 2]++;
                    }
                    break;
            }
        }

        if (num[3] > 0 && num[4] > 0) {
            rtn.push(0);
        }

        if (num[1] > 0 && num[3] > 0) {
            rtn.push(1);
        }

        if (num[0] > 0 && num[1] > 0) {
            rtn.push(2);
        }

        return rtn;
    };



    majiang.CardCount = function (pl) {
        var rtn = (pl.mjpeng.length + pl.mjgang0.length + pl.mjgang1.length) * 3 + pl.mjchi.length;
        if (pl.mjhand) {
            rtn += pl.mjhand.length;
        }

        return rtn;
    };

    majiang.getAllCardsTotal = function () {
        var tData = MjClient.data.sData.tData;
        var wuWanFeng = tData.areaSelectMode.wuWanFeng;
        if (wuWanFeng) //无风万字
        {
            return 72;
        } else {
            return 136;
        }
    };

    majiang.setFlowerImg = function (node, pl) {

    };
    majiang.setJiaZhuNum = function (node, pl) {

    };



    //十三炮，连云港玩法
    majiang.isShiSanPao = function (cds, cd) {
        // cc.log("=====MajiangLYG=====isShiSanPao----cds=" + cds);
        var tmp = cds.slice();

        if (cd) {
            tmp.push(cd);
        }

        tmp.sort(function (a, b) {
            return a - b;
        });

        tmp = this.ruleOutByArr(tmp);

        if (tmp.length != 14) {
            // cc.log("=====MajiangLYG=====isShiSanPao----return tmp.length != 14--" + tmp);
            return false;
        }
        // cc.log("---isShiSanPao----11111--");
        var f3cards = [];
        var f1cards = [];
        // cc.log("=====MajiangLYG=====isShiSanPao----555555--");
        for (var k = 0; k < tmp.length; k++) {
            var card = tmp[k];
            //this.GLog("---isShiSanPao----444444--");
            for (var i = 0; i < p133.length; i++) {
                // this.GLog("---isShiSanPao----22222--");
                var chil = p133[i];
                if (chil.indexOf(card) >= 0) f3cards.push(chil);
            }
            // this.GLog("---isShiSanPao----3333--");
            if (p131.indexOf(card) >= 0) f1cards.push(card);
        }

        // this.GLog("---isShiSanPao----return tf1cards.length != 5 || f3cards.length < 9--");
        if (f1cards.length < 5) return false;//风牌是可以为6张或者7张的

        //判断条万筒三门齐
        var hTiao = 0;
        var hTong = 0;
        var hWan = 0;
        for (var k = 0; k < f3cards.length; k++) {
            var fit = f3cards[k][0];
            // this.GLog("==MajiangLYG==isShiSanPao==fit:" + fit);
            if (fit >= 1 && fit <= 9) {
                if (hTiao != fit % 10 && hTiao > 0) return false;
                hTiao = fit % 10;
            }
            else if (fit >= 11 && fit <= 19) {
                if (hWan != fit % 10 && hWan > 0) return false;
                hWan = fit % 10;
            }
            else if (fit >= 21 && fit <= 29) {
                if (hTong != fit % 10 && hTong > 0) return false;
                hTong = fit % 10;
            }
        }

        cc.log("=====MajiangLYG=====isShiSanPao=====hTiao || hWan || hTong--" + hTiao + hWan + hTong);
        if (!hTiao || !hWan || !hTong) {
            if (f1cards.length < 8) { // 修复七字牌缺一门不提示听牌
                return false;
            }
        }
        if (hTiao == hWan || hWan == hTong || hTong == hTiao) return false;
        cc.log("=====MajiangLYG=====isShiSanPao=====last--");
        return true;

    }
    if (typeof (MjClient) != "undefined") {
        MjClient.majiang_ynxuezhan = majiang;
    }
    else {
        module.exports = majiang;
        //DoTest();
    }
})();
