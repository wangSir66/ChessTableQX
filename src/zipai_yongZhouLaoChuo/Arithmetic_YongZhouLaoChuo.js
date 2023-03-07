// 打炸弹算法
(function() {

    function ZhouLaoChuo() {
        this.cardType = {
            san : -1,
            dan : 0,
            dui : 1,
            daMian : 2,
            xiaoMian : 3,
            canHe : 4,
            kan : 5,
            long : 6,
            shun : 7,
        }
    }
    // 洗牌
    ZhouLaoChuo.prototype.randomCards = function(areaSelectMode) {
        var cards = [
            /*1, */2, 3, 4, 5, 6, 7, 8, 9, 10,
            /*1, */2, 3, 4, 5, 6, 7, 8, 9, 10,
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
            21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
            21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
            21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
            21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
        ];

        if(areaSelectMode.maxPlayer == 4){
            cards.push(1, 1);
        }
        shuffleArray(cards);
        return cards;
    };

    ZhouLaoChuo.prototype.isBaseChuo = function(card) {
       return card == 1 || card == 21;
    };

    ZhouLaoChuo.prototype.getInitChuoCards = function(pl) {
        var initChuoCards = [];
        for(var i = pl.mjhand.length - 1; i >= 0; i--){
            if(this.isBaseChuo(pl.mjhand[i])){
                initChuoCards.push(pl.mjhand[i]);
                pl.mjhand.splice(i, 1);
            }
        }
        pl.chuoCards.push(initChuoCards);
        return pl.chuoCards;
    };

    ZhouLaoChuo.prototype.getCardsType = function(cards, areaSelectMode) {
        cards.sort((a, b)=>{
            return a - b;
        });
        var dict = {};
        var mostKey = null;
        var subCount = 0;
        for(var i = 0; i < cards.length; i++){
            var card = cards[i];
            dict[card] = dict[card] ? dict[card] + 1 : 1;
            if(dict[card] == 1){
                subCount++;
            }
            if(!mostKey || dict[card] > dict[mostKey]){
                mostKey = card;
            }
        }
        var value = Number(mostKey);
        var info = {type : this.cardType.san, first : value, extraCount : 0};
        if(subCount == 1){
            switch(dict[mostKey]){
                case 1:
                    info.type = this.cardType.dan;
                    break;
                case 2 :
                    info.type = this.cardType.dui;
                    break;
                case 3 :
                    info.type = this.cardType.kan;
                    break;
                case 4 :
                    info.type = this.cardType.long;
                    break;
                default:
                    break;
            }
        }else if(subCount == 2){
            switch(dict[mostKey]){
                case 2 :
                    if(dict[value - 20] == 1){
                        info.type = this.cardType.daMian;
                        info.extraCount = dict[value - 20];
                    }else  if(dict[value + 20] == 1){
                        info.type = this.cardType.xiaoMian;
                        info.extraCount = dict[value + 20];
                    }else if(dict[value - 20] == 2 || dict[value + 20] == 2){
                        info.type = this.cardType.canHe;
                        info.extraCount = dict[value - 20] || dict[value + 20];
                    }
                    break;
                case 3 :
                    if(dict[value - 20] > 0 || dict[value + 20] > 0){
                        info.type = this.cardType.kan;
                        info.extraCount = dict[value - 20] || dict[value + 20];
                    }
                    break;
                case 4 :
                    if(dict[value - 20] > 0 || dict[value + 20] > 0){
                        info.type = this.cardType.long;
                        info.extraCount = dict[value - 20] || dict[value + 20];
                    }
                    break;
                default:
                    break;
            }
        }else if(subCount == 3){
            if(dict[mostKey] == 1 && dict[value + 1] == 1 && dict[value + 2] == 1){
                info.type = this.cardType.shun;
            }
        }
        return info;
    };

    ZhouLaoChuo.prototype.canBeat = function(hand, putCard, areaSelectMode) {
        var putCardType = this.getCardsType(putCard, areaSelectMode);
        if(putCardType.type == this.cardType.san){
            return false;
        }
        var hand = hand.slice();
        hand.sort((a, b)=>{
            return a - b;
        });
        var dict = {};
        for(var i = 0; i < hand.length; i++){
            var card = hand[i];
            dict[card] = dict[card] ? dict[card] + 1 : 1;
        }

        var pHash = [
            [],//单
            [],//对
            [],//大面
            [],//小面
            [],//餐盒
            [],//坎
            [],//龙
            [],//顺
        ];
        for(var k in dict){
            var value = Number(k);
            if(dict[k] >= 1){
                pHash[0].push(value);
            }
            if(dict[k] >= 2){
                pHash[1].push(value);
            }
            if(dict[k] >= 2 && dict[value - 20] >= 1){
                pHash[2].push(value);
            }
            if(dict[k] >= 2 && dict[value + 20] >= 1){
                pHash[3].push(value);
            }
            if(dict[k] >= 2 && (dict[value - 20] >= 2 || dict[value + 20] >= 2)){
                pHash[4].push(value);
            }
            if(dict[k] >= 3){
                pHash[5].push(value);
            }
            if(dict[k] >= 4){
                pHash[6].push(value);
            }
            if(dict[k] >= 1 && dict[value + 1] >= 1 && dict[value + 1] >= 1){
                pHash[7].push(value);
            }
        }
        var pList = pHash[putCardType.type];
        for(var i = 0; i < pList.length; i++){
            var value = pList[i];
            switch(putCardType.type){
                case this.cardType.dan:
                case this.cardType.dui:
                case this.cardType.daMian:
                case this.cardType.xiaoMian:
                case this.cardType.canHe:
                case this.cardType.shun:
                    if(Math.ceil(value / 20) == Math.ceil(putCardType.first / 20) && value > putCardType.first){
                        return true;
                    }
                    break;
                case this.cardType.kan:
                case this.cardType.long:
                    if(Math.ceil(value / 20) == Math.ceil(putCardType.first / 20) && value > putCardType.first
                        && (putCardType.extraCount == 0 || dict[value - 20] >= putCardType.extraCount || dict[value + 20] >= putCardType.extraCount)){
                        return true;
                    }
                    break;
                default:
                    break;
            }
        }
        return false;
    };

    ZhouLaoChuo.prototype.isBigger = function(cards, putCard, areaSelectMode) {
        var cardType = this.getCardsType(cards, areaSelectMode);
        var putCardType = this.getCardsType(putCard, areaSelectMode);
        if(cardType.type == this.cardType.san || putCardType.type == this.cardType.san){
            return false;
        }
        if(cardType.type == putCardType.type && Math.floor(cardType.first / 20) ==  Math.floor(putCardType.first / 20) && cardType.extraCount ==  putCardType.extraCount
        && cardType.first > putCardType.first){
            return true;
        }
        return false;
    };

    ZhouLaoChuo.prototype.getStartTipCards = function (dict) {
        var cards = [];
        for(var k in dict){
            var value = Number(k);
            if(dict[k] == 1){
                for(var i = 0; i < dict[k]; i++){
                    cards.push(value);
                }
                if(dict[value + 20] >= 2){
                    for(var i = 0; i < dict[value + 20]; i++){
                        cards.push(value + 20);
                    }
                }else if(dict[value + 1] == 1 && dict[value + 2] == 1){
                    cards.push(value + 1);
                    cards.push(value + 2);
                }
            }else {
                for(var i = 0; i < dict[k]; i++){
                    cards.push(value);
                }
                for(var i = 0; i < dict[value + 20]; i++){
                    cards.push(value + 20);
                }

            }
            break;
        }
        return cards;
    };

    ZhouLaoChuo.prototype.getTipCards = function(pl, putCard, areaSelectMode) {
        var hand = pl.mjhand.slice();
        hand.sort((a, b)=>{
            return a - b;
        });
        var dict = {};
        for(var i = 0; i < hand.length; i++){
            var card = hand[i];
            dict[card] = dict[card] ? dict[card] + 1 : 1;
        }
        if(!putCard){
            return this.getStartTipCards(dict);
        }
        var putCardType = this.getCardsType(putCard, areaSelectMode);
        if(putCardType.type == this.cardType.san){
            return [];
        }
        var pDictSrc = JSON.parse(JSON.stringify(dict));
        //去龙
        for(var k in pDictSrc){
            if(pDictSrc[k] >= 4){
                delete pDictSrc[k];
            }
        }
        var pDictNoLong = JSON.parse(JSON.stringify(pDictSrc));

        //去坎
        for(var k in pDictSrc){
            if(pDictSrc[k] >= 3){
                delete pDictSrc[k];
            }
        }
        var pDictNoKan = JSON.parse(JSON.stringify(pDictSrc));

        //去餐盒
        for(var k in pDictSrc){
            var value = Number(k);
            if(pDictSrc[k] >= 2 && (pDictSrc[value - 20] >= 2 || pDictSrc[value + 20] >= 2)){
                delete pDictSrc[k];
                delete pDictSrc[value - 20];
                delete pDictSrc[value + 20];
            }
        }
        var pDictNoCanHe = JSON.parse(JSON.stringify(pDictSrc));

        //去面
        for(var k in pDictSrc){
            var value = Number(k);
            if(pDictSrc[k] >= 2 && (pDictSrc[value - 20] >= 1 || pDictSrc[value + 20] >= 1)){
                delete pDictSrc[k];
                delete pDictSrc[value - 20];
                delete pDictSrc[value + 20];
            }
        }
        var pDictNoMian = JSON.parse(JSON.stringify(pDictSrc));

        //去对
        for(var k in pDictSrc){
            if(pDictSrc[k] >= 2 ){
                delete pDictSrc[k];
            }
        }
        var pDictNoDui = JSON.parse(JSON.stringify(pDictSrc));

        var pHash = [
            [],//单
            [],//对
            [],//大面
            [],//小面
            [],//餐盒
            [],//坎
            [],//龙
            [],//顺
        ];
        getAllTypeList = function (dict) {
            for(var k in dict){
                var value = Number(k);
                if(pHash[0].indexOf(value) == -1 && dict[k] >= 1){
                    pHash[0].push(value);
                }
                if(pHash[1].indexOf(value) == -1 && dict[k] >= 2){
                    pHash[1].push(value);
                }
                if(pHash[2].indexOf(value) == -1 && dict[k] >= 2 && dict[value - 20] >= 1){
                    pHash[2].push(value);
                }
                if(pHash[3].indexOf(value) == -1 && dict[k] >= 2 && dict[value + 20] >= 1){
                    pHash[3].push(value);
                }
                if(pHash[4].indexOf(value) == -1 && dict[k] >= 2 && (dict[value - 20] >= 2 || dict[value + 20] >= 2)){
                    pHash[4].push(value);
                }
                if(pHash[5].indexOf(value) == -1 && dict[k] >= 3){
                    pHash[5].push(value);
                }
                if(pHash[6].indexOf(value) == -1 && dict[k] >= 4){
                    pHash[6].push(value);
                }
                if(pHash[7].indexOf(value) == -1 && dict[k] >= 1 && dict[value + 1] >= 1 && dict[value + 2] >= 1){
                    pHash[7].push(value);
                }
            }
        }
        getAllTypeList(pDictNoDui);
        getAllTypeList(pDictNoMian);
        getAllTypeList(pDictNoCanHe);
        getAllTypeList(pDictNoKan);
        getAllTypeList(pDictNoLong);
        getAllTypeList(dict);

        var cards = [];
        var pList = pHash[putCardType.type];
        for(var i = 0; i < pList.length; i++){
            var value = pList[i];
            switch(putCardType.type){
                case this.cardType.dan:
                    if(Math.ceil(value / 20) == Math.ceil(putCardType.first / 20) && value > putCardType.first){
                        cards.push(value);
                    }
                    break;
                case this.cardType.dui:
                    if(Math.ceil(value / 20) == Math.ceil(putCardType.first / 20) && value > putCardType.first){
                        cards.push(value, value);
                    }
                    break;
                case this.cardType.daMian:
                    if(Math.ceil(value / 20) == Math.ceil(putCardType.first / 20) && value > putCardType.first){
                        cards.push(value, value, value - 20);
                    }
                    break;
                case this.cardType.xiaoMian:
                    if(Math.ceil(value / 20) == Math.ceil(putCardType.first / 20) && value > putCardType.first){
                        cards.push(value, value, value + 20);
                    }
                    break;
                case this.cardType.canHe:
                    if(Math.ceil(value / 20) == Math.ceil(putCardType.first / 20) && value > putCardType.first){
                        var cardValue = value % 20;
                        cards.push(cardValue, cardValue, cardValue + 20, cardValue + 20);
                    }
                    break;
                case this.cardType.shun:
                    if(Math.ceil(value / 20) == Math.ceil(putCardType.first / 20) && value > putCardType.first){
                        cards.push(value, value + 1, value + 2);
                    }
                    break;
                case this.cardType.kan:
                    if(Math.ceil(value / 20) == Math.ceil(putCardType.first / 20) && value > putCardType.first
                        && (putCardType.extraCount == 0 || dict[value - 20] >= putCardType.extraCount || dict[value + 20] >= putCardType.extraCount)){
                        cards.push(value, value, value);
                        for(var j = 0; j < putCardType.extraCount; j++){
                            if(value > 20){
                                cards.push(value - 20);
                            }else{
                                cards.push(value + 20);
                            }
                        }
                    }
                    break;
                case this.cardType.long:
                    if(Math.ceil(value / 20) == Math.ceil(putCardType.first / 20) && value > putCardType.first
                        && (putCardType.extraCount == 0 || dict[value - 20] >= putCardType.extraCount || dict[value + 20] >= putCardType.extraCount)){
                        cards.push(value, value, value, value);
                        for(var j = 0; j < putCardType.extraCount; j++){
                            if(value > 20){
                                cards.push(value - 20);
                            }else{
                                cards.push(value + 20);
                            }
                        }
                    }
                    break;
                default:
                    break;
            }
            if(cards.length > 0){
                break;
            }
        }
        return cards;
    };

    ZhouLaoChuo.prototype.canHu = function(tb, pl) {
        return this.getTableChuoCount(tb, pl) > tb.tData.minChuo;
    };

    ZhouLaoChuo.prototype.blackRedNum = function(pl) {
        var rtn = [0, 0, 0, 0];//0固定1黑2（27红）3（10红）
        var cards = [].slice();
        for(var i = 0; i < pl.chuoCards.length; i++){
            cards = cards.concat(pl.chuoCards[i]);
        }
        for (var i = 0; i < cards.length; i++) {
            if(this.isBaseChuo(cards[i])){
                rtn[0]++;
            }else if(cards[i] % 20 == 2 || cards[i] % 20 == 7){
                rtn[2]++;
            }else if(cards[i] % 20 == 10){
                rtn[3]++;
            }else{
                rtn[1]++;
            }
        }
        return rtn;
    };

    ZhouLaoChuo.prototype.getHuInfo = function(tb, pl) {
        var tData =  tb.tData;
        var areaSelectMode = tData.areaSelectMode;
        var chuoCount = this.getTableChuoCount(tb, pl);
        var blackRedNum = this.blackRedNum(pl);
        var hzdesc = {};
        var score = 0;
        var hongScore = 0;
        var baseScore = areaSelectMode.isQiHuErFen ? 2 : 1;
        if(areaSelectMode.chuoType == 0){
            baseScore += (chuoCount - tData.minChuo);

            if(areaSelectMode.isFanChuo){
                var minFanChuo = areaSelectMode.maxPlayer == 4 ? 15 : 18;
                if(chuoCount > minFanChuo){
                    baseScore = 14 + (chuoCount - minFanChuo) * 2;
                    hzdesc.fanChuo = true;
                }
            }
        }
        score = baseScore;
        if(areaSelectMode.isJianHongJiaFen){
            hongScore = blackRedNum[2] + blackRedNum[3] * 2;
            score += hongScore;
        }
        if(blackRedNum[2] + blackRedNum[3] == 0){//黑戳
            var rate = 2 * (hzdesc.fanChuo ? 2 : 1);
            score = chuoCount * rate;
            hzdesc.heiChuo = "x" + rate;
        } else if(blackRedNum[1] == 0){//红戳
            var rate = (areaSelectMode.isHongChuoSiFan ? 4 : 3) * (hzdesc.fanChuo ? 2 : 1);
            score = chuoCount * rate;
            hzdesc.hongChuo = "x" + rate;
        }
        return {hzdesc : hzdesc, chuoCount : chuoCount, baseScore : baseScore, hongScore : hongScore, score : score}
    };

    ZhouLaoChuo.prototype.getTableChuoCount = function(tb, pl) {
        var chuoCount = 0;
        for(var i = 0; i < pl.chuoCards.length; i++){
            chuoCount += pl.chuoCards[i].length;
        }
        return chuoCount;
    };

    ZhouLaoChuo.prototype.checkPut = function(hand, cards) {
        if (cards && typeof(cards) != 'undefined' && cards.length == 0) {
            return null;
        }

        if(!hand){
            cc.log("hhh")
        }

        var hands = hand.slice();
        for (var i = 0; i < cards.length; i++) {
            var p = hands.indexOf(cards[i]);
            if (p >= 0) {
                hands.splice(p, 1);
            } else {
                return null; // 手里没有这些牌
            }
        }
        return hands;
    };

    ZhouLaoChuo.prototype.sortCards = function(list){

        if(typeof(list) == "undefined"){
            return;
        }
        
        list.sort(function(a, b){
            return a-b;
        });

        for(let i = list.length - 1 ; i >= 0; i--){
            if(list[i] == 1 || list[i] == 21){
                list.splice(i, 1);
            }
        }

        var retArr = [];

        var countRet = {};
        function formatHandCard(list){
            var ret = {};
            for(var i = 0; i < list.length; i++){
                var item = list[i];
                var p = item > 20 ? (item%20) : item;
                if(ret[p]){
                    ret[p].push(item);
                }else{
                    ret[p] = [item];
                }

                if(countRet[item]){
                    countRet[item]++;
                }else{
                    countRet[item] = 1;
                }
            }

            return ret;
        }
        var obj = formatHandCard(list);

        for(var k in obj){
            if( obj[k] && obj[k].length > 1 ){
                let _big = Number(k) + 20;
                if( countRet[k] && countRet[k] > 0 &&  
                    countRet[_big] && countRet[_big] > 0){
                    if(countRet[k] > countRet[_big]){
                        obj[k].sort(function(a, b){
                            return a-b;
                        })
                    }else if(countRet[k] <= countRet[_big]){
                        obj[k].sort(function(a, b){
                            return b-a;
                        })
                    }
                }

            } 

            retArr = retArr.concat(obj[k]);
        }

        list = retArr;

        return {fir: retArr,  sec:obj};
    }

    // if (typeof(MjClient) != "undefined") {
    //     MjClient.majiang_ZhouLaoChuo = new ZhouLaoChuo();
    // } else {
    //     module.exports = ZhouLaoChuo;
    // }

    if (typeof(MjClient) != "undefined") {
        MjClient.majiang_YongZhouLaoChuo = new ZhouLaoChuo();
    } else {
        module.exports = YongZhouLaoChuo;
    }

    function test() {
        var a = new ZhouLaoChuo();
        var pl = {};
        pl.mjhand = [2, 2, 2, 2, 3, 3, 3, 4, 5, 5, 25, 25, 25, 6, 26, 26, 23, 23];
        pl.chuoCards = [[1, 21], [3, 4, 5], [4, 4, 4, 24, 24, 24, 24], [28, 28, 8], [9, 9, 29, 29]];
        var tb = {tData : {}};
        tb.tData.minChuo = 15;
        tb.tData.maxPlayer = 2;
        tb.tData.areaSelectMode = {
            chuoType : 0,
            chuoNum : 0,
            isJianHongJiaFen : true,
            isQiHuErFen: true,
            isHongChuoSiFan : true,
            isFanChuo : true,
        }
        //console.log(a.getInitChuoCards(pl));
        //console.log(a.getTableChuoCount(tb, pl));
        //console.log(a.canHu(tb, pl));
        //console.log(a.getCardsType([5, 5, 5, 5, 25, 25]));
        //console.log(a.canBeat(pl.mjhand, [24, 24, 4]));
        //console.log(a.isBigger( [24, 24, 4, 4, ], [5, 5, 25, 25]));
        //console.log(a.getTipCards(pl,  [1, 1, 1]));
        //console.log(a.getTipCards(pl));
        //console.log(a.getHuInfo(tb,pl));
    }
     //test();
}());
