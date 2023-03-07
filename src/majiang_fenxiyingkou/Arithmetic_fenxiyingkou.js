
(function() {
    var majiang = {};
    var flowerArray = [111, 121, 131, 141, 151, 161, 171, 181];//花的列表，根据不同来设置
    var hongFengNum=0;
    var heiFengNum=0;
    var huHua=false;
    var hastrue = 0;
    var tingCardHuHua=0;

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
        if (cd && cd !== 200) {
            cards.push(cd);
        }
        for (var i = 0; i < cards.length; i++) {
            if (cards[i] in yao13) {
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
        return count0 === 0 || count0 === 1 && cd === 200;
    }
    //红风
    majiang.hongFeng=function (cards) {
        // var cardArr = this.findJiang(cards);

        var cardArr=this.deleteJiang(cards);
        for(var j=0;j<cardArr.length;j++)
        {
            var arr = [0,0,0];
            for (var i = 0; i < cardArr[j].length; i++) {
                if (cardArr[j][i] == 71) {
                    arr[0]++;
                }
                if (cardArr[j][i] == 81) {
                    arr[1]++;
                }
                if (cardArr[j][i] == 91) {
                    arr[2]++;
                }
            }
            var counthongFeng=Math.min(Math.min(arr[0], arr[1]), arr[2]);
            if(counthongFeng>0) return counthongFeng

        }
        return 0

    }
//求坎
    majiang.calKan = function(oCards)
    {
        var cards=oCards.slice();
        cards.sort(function(a,b){return a-b;})
        var kanCount=0;
        var hua= MjClient.data.sData.tData.hunCard;
        for (var i=0;i<cards.length;i++)
        {
            if(i>0&&cards[i]==cards[i-1])
            {
                continue;
            }
            if (cards[i]==cards[i+2])
            {
                var tCards=cards.slice();
                tCards.splice(i,3);
                if(this.canHu(tCards,hua))
                {
                    kanCount++;
                }
            }
        }
        return kanCount;
    }
    majiang.calKanCanHuHua = function(oCards)
    {
        var cards=oCards.slice();
        cards.sort(function(a,b){return a-b;})
        var hua= MjClient.data.sData.tData.hunCard;
        var tingSet=[];
        for (var i=0;i<cards.length;i++)
        {
            if(i>0&&cards[i]==cards[i-1])
            {
                continue;
            }
            if (cards[i]==cards[i+2])
            {
                var tCards=cards.slice();
                tCards.splice(i,3);
                tCards.push(hua)
                if(this.canHu(tCards))
                {
                     tingSet.push(cards[i]);
                }
            }
        }
        return tingSet;
    }
    majiang.findJiang=function (cds) {
        var cardsArr=[];
        var n=0;
        var cards=cds.slice().sort(function(a,b)
        {
            return a-b;
        });
        for (var i=0;i<cards.length-1;i++)
        {
            if(i>0&&cards[i]==cards[i-1]){
                continue;
            }
            if(cards[i]==cards[i+1]){
                var puCards=cards.slice();
                puCards.splice(i,2);
                if(this.isPu(puCards,1))
                {
                    cardsArr[n]=cards[i];
                    n++;
                }
            }
        }

        return cardsArr||0;
    }
    majiang.deleteJiang=function (cards) {
        var jiangCard=this.findJiang(cards);
        var cardArr=new Array;
        for(var j=0;j<jiangCard.length;j++)
        {
            cardArr[j]=cards.slice();
            for(var i=0;i<2;i++)
            {
                var deletePos=cardArr[j].indexOf(jiangCard[j]);
                if (deletePos>=0) cardArr[j].splice(deletePos,1);
            }
        }

        return cardArr;
    }
    majiang.heiFengJiang=function (cards){
        var arr = [];
        var cardArr = cards.slice();
        for (var i = 0; i < cardArr.length; i++) {
            if (cardArr[i] >= 31 && cardArr[i] <= 61) {
                arr.push(cardArr[i]);
            }
        }
        arr.sort(function(a, b) {
            return a - b;
        });
        var countSanFeng = 0;
        function countColor(cArr){
            if (cArr.length == 0) {
                return true;
            }
            // 若第一张是风牌的一张（东南西北），则判断是否存在"三风
            var sanTypeCard = cArr[0];
            var fengArr = [];    // 风牌种类数组（东南西北）
            for (var i = 0; i < 4; i++) {
                if ((sanTypeCard+i*10) <= 61 && cArr.indexOf(sanTypeCard+i*10) >= 0) {
                    if ((sanTypeCard+i*10) != sanTypeCard) fengArr.push((sanTypeCard+i*10));
                }
            }
            if (fengArr != [] && fengArr.length > 0) {
                if (fengArr.length <= 1) {
                    fengArr.push(0);
                }

                for (var i = 0; i < fengArr.length; i++) {
                    for (var j = i + 1; j < fengArr.length; j++) {
                        var puCards = cArr.slice();
                        var deletePos1 = puCards.indexOf(sanTypeCard);
                        if (deletePos1 >= 0) puCards.splice(deletePos1, 1);
                        var deletePos2 = puCards.indexOf(fengArr[i]);
                        if (deletePos2 >= 0) puCards.splice(deletePos2, 1);
                        var deletePos3 = puCards.indexOf(fengArr[j]);
                        if (deletePos3 >= 0) puCards.splice(deletePos3, 1);
                        if (countColor(puCards)) {
                            countSanFeng++;
                            return true;
                        }
                    }
                }
            }
            // 若第一张是刻子中的一张
            var keziCount = 1;
            var keziCard = cArr[0];
            if (cArr[1] == keziCard) {
                keziCount++;
            }
            if (cArr[2] == keziCard) {
                keziCount++;
            }
            if (keziCount == 3) {
                var puCards = cArr.slice();
                for (var i = 0; i < 3; i++) {
                    var deletePos = puCards.indexOf(keziCard);
                    if (deletePos >= 0) {
                        puCards.splice(deletePos, 1);
                    }
                }
                if (countColor(puCards)) {
                    return true;
                }
            }
            countSanFeng = 0;
            return false;
        }
        countColor(arr);
        return countSanFeng;
    }
    majiang.countFengNum = function(cards)
    {
        var cardArr=this.deleteJiang(cards);
        var arr=[];
        for(var j=0;j<cardArr.length;j++)
        {
            var num =this.heiFengJiang(cardArr[j]);
            arr.push(num);
        }
        arr.sort();
        return arr[arr.length-1];
    }
    majiang.canHuHua=function (oCds) {
        var cards=oCds;
        var hua= MjClient.data.sData.tData.hunCard;
        var pl = MjClient.data.sData.players[SelfUid() + ""];
        for (var i=0;i<cards.length;i++)
        {
            var handcards=cards.slice();
            handcards.sort(function (a,b) {return a-b;});
            if (handcards[i]==handcards[i+3])
            {
                handcards.splice(i,4);
                handcards.push(hua);
                if(this.canHu(handcards,200))
                {
                    return true;
                }
            }
            for(var j=0;j<pl.mjpeng.length;j++)
            {
                if (handcards[i]==pl.mjpeng[j])
                {
                    handcards.splice(i,1);
                    handcards.push(hua);
                    if(this.canHu(handcards,200))
                    {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    majiang.calTingSet=function(oCds, hun)
    {
        var allCardsArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29, 31, 41, 51, 61, 71, 81, 91];
        var hua= MjClient.data.sData.tData.hunCard;
        var pl = MjClient.data.sData.players[SelfUid() + ""];
        if(cc.isUndefined(oCds))
        {
            return {};
        }
        var tingSet = {};
        var cds = oCds.slice();
        if ((oCds.length + 1) % 3 == 0) { // 14、11、8、5、2张牌
            cds = oCds.slice(0, -1);
        }
        for (var i = 0; i < allCardsArray.length; i++) {
            if (this.canHu(cds, allCardsArray[i])) {
                var count = 0;
                for (var j = 0; j < cds.length; j++) {
                    if (cds[j] == allCardsArray[i]) {
                        count++;
                    }
                }
                if (hun || count < 4) {
                    tingSet[allCardsArray[i]] = 1;
                }
            }
        }
        var tingSetDaiFeng={};
        if(MjClient.data.sData.tData.areaSelectMode["isDaiFeng"])
        {
            if((this.canHu(cds, 200)&&(this.hongFeng(cds) > 0 ||this.countFengNum(cds) > 0||hongFengNum>0))
                ||this.canHuHua(cds)
                ||is7Dui(cds,200)
                ||this.calKanCanHuHua(cds)){
                var hCards={};
                var dCards={};
                var count = 0;
                var cards=cds.slice();
                if(this.quHongFeng(cds)) hCards = this.quHongFeng(cds);
                if(this.quHeiFeng(cds)) dCards = this.quHeiFeng(cds);
                for (var i in tingSet ) {
                    for(var j=0;j<dCards.length;j++)
                    {
                        if (this.canHuLaizi(dCards[j], Number(i)) || this.canHuLaizi(hCards, Number(i))) {
                            tingSetDaiFeng[i]=1;
                        }
                    }
                    if (this.canHuLaizi1(cds, Number(i))){
                        tingSetDaiFeng[i]=1;
                    }
                }
                for (var i = 0; i < allCardsArray.length; i++) {
                    if (is7Dui(cds, allCardsArray[i])) {
                        for (var j = 0; j < cds.length; j++) {
                            if (cds[j] == allCardsArray[i]) {
                                count++;
                            }
                        }
                        if ( count < 4) {

                            tingSetDaiFeng[allCardsArray[i]] = 1;
                        }
                    }
                }
                if(this.calKanCanHuHua(cards))
                {
                    var list=this.calKanCanHuHua(cards)
                    for(var i=0;i<list.length;i++)
                    {
                        tingSetDaiFeng[list[i]] = 1;
                    }
                }

            }
            else
            {
                tingSetDaiFeng= tingSet;
            }
            for (var i=0;i<cds.length;i++)
            {
                var handcards=cds.slice();
                handcards.sort(function (a,b) {return a-b;});
                if (handcards[i]==handcards[i+3])
                {
                    handcards.splice(i,4);
                    handcards.push(hua);
                    for (var j = 0; j < allCardsArray.length; j++) {
                        if (this.canHu(handcards, allCardsArray[j])) {
                            var count = 0;
                            for (var k = 0; k < handcards.length; k++) {
                                if (handcards[k] == allCardsArray[j]) {
                                    count++;
                                }
                            }
                            if (hun || count < 4) {
                                tingSetDaiFeng[allCardsArray[j]] = 1;
                            }
                        }
                    }
                }
            }
            for (var i=0;i<cds.length;i++) {
                var handcard2=cds.slice();
                handcard2.sort(function (a,b) {return a-b;});
                for (var j = 0; j < pl.mjpeng.length; j++) {
                    if (handcard2[i] == pl.mjpeng[j]) {
                        handcard2.splice(i, 1);
                        handcard2.push(hua);
                        for (var k = 0; k < allCardsArray.length; k++) {
                            if (this.canHu(handcard2, allCardsArray[k])) {
                                tingSetDaiFeng[allCardsArray[k]] = 1;
                            }
                        }
                    }
                }
            }
            if(this.canHu(cds,hua))
            {
                if(pl.mjpeng.length>0||this.calKan(cds)>0&&(heiFengNum == 0 && hongFengNum == 0))
                {
                    for (var k = 0; k < pl.mjpeng.length; k++) {
                            tingSetDaiFeng[pl.mjpeng[k]] = 1;
                    }
                }
            }
            return tingSetDaiFeng;
        }
        else
        {

            if (this.canHu(cds, hua)&&(pl.mjpeng.length > 0 || this.calKan(cds) > 0)) {
                for (var j = 0; j < cds.length; j++) {
                    if (cds[j] == allCardsArray[i]) {
                        count++;
                    }
                }
                if ( count < 4) {
                    tingSet[hua] = 1;
                }
            }
            for (var i = 0; i < allCardsArray.length; i++) {
                if (is7Dui(cds, allCardsArray[i])) {
                    for (var j = 0; j < cds.length; j++) {
                        if (cds[j] == allCardsArray[i]) {
                            count++;
                        }
                    }
                    if ( count < 4) {
                        tingSet[allCardsArray[i]] = 1;
                    }
                }
            }
            for (var i=0;i<cds.length;i++)
            {
                var handcards=cds.slice();
                handcards.sort(function (a,b) {return a-b;});
                if (handcards[i]==handcards[i+3])
                {
                    handcards.splice(i,4);
                    handcards.push(hua);
                    for (var j = 0; j < allCardsArray.length; j++) {
                        if (this.canHu(handcards, allCardsArray[j])) {
                            var count = 0;
                            for (var k = 0; k < handcards.length; k++) {
                                if (handcards[k] == allCardsArray[j]) {
                                    count++;
                                }
                            }
                            if (hun || count < 4) {
                                tingSet[allCardsArray[j]] = 1;
                            }
                        }
                    }
                }
            }
            for (var i=0;i<cds.length;i++)
            {
                var handcard2=cds.slice();
                handcard2.sort(function (a,b) {return a-b;});
                for (var j = 0; j < pl.mjpeng.length; j++) {

                    if (handcard2[i] == pl.mjpeng[j]) {
                        handcard2.splice(i, 1);
                        handcard2.push(hua);
                        for (var k = 0; k < allCardsArray.length; k++) {
                            if (this.canHu(handcard2, allCardsArray[k])) {
                                tingSet[allCardsArray[k]] = 1;
                            }
                        }
                    }
                }
            }
            if(this.canHu(cds,hua))
            {
                if(pl.mjpeng.length>0||this.calKan(cds)>0&&(heiFengNum == 0 && hongFengNum == 0))
                {
                    for (var k = 0; k < pl.mjpeng.length; k++) {
                        tingSet[pl.mjpeng[k]] = 1;
                    }
                }
            }
            if(this.calKanCanHuHua(cds))
            {
                var list=this.calKanCanHuHua(cds)
                for(var i=0;i<list.length;i++)
                {
                    tingSet[list[i]] = 1;
                }
            }
            return tingSet;
        }


    }
    majiang.getCheckTingHuCards=function(selectCard,mjhandCard) {
        var copyhand = mjhandCard.slice();
        if (selectCard) {
            var index = copyhand.indexOf(selectCard);//排除当前选择的一张牌
            copyhand.splice(index,1);
        }

        var tingSet = null;
        tingSet = this.calTingSet(copyhand, MjClient.data.sData.tData.hunCard);

        for (var card in tingSet) {
            var count = 0;
            for (var i = 0; i < mjhandCard.length; i++) {
                if (mjhandCard[i] == card) {
                    count++;
                }
            }
            if (count == 4) {
                delete tingSet[card];
            }
        }
        return tingSet;
    }
    //是否可以胡
    majiang.canHu = function(cards, cd,hua)
    {
        if(hua)
        {
            cards.push(hua)
        }
        if(is7Dui(cards,cd))
        {
            return true;
        }
        return this.canHuLaizi(cards, cd);


    }
    majiang.canHuLaizi=function(oCards, cd) {
        if(!oCards) return false;
        var cards = [];
        var laizi = 0;

        for (var i = 0; i < oCards.length; i++) {
            if (oCards[i] == 200) {
                laizi++;
            }
            else {
                cards.push(oCards[i]);
            }
        }
        if (cd == 200) {
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
        })
        // 依次删除一对牌做将，其余牌全部成扑则可胡
        for (var i = 0; i < cards.length; i++) {
            if (i > 0 && cards[i] == cards[i - 1]){
                continue; // 和上一次是同样的牌，略过不计算
            }
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
                if (this.isPu(puCards, puLaizi)) {
                    return true;
                }
            }
        }
        if (laizi >= 2 && this.isPu(cards, laizi - 2)) {
            return true;
        }
        return false;
    }

    majiang.canHuLaizi1=function(oCards, cd) {
        if(!oCards) return false;
        var cards = [];
        var laizi = 0;

        for (var i = 0; i < oCards.length; i++) {
            if (oCards[i] == 200) {
                laizi++;
            }
            else {
                cards.push(oCards[i]);
            }
        }
        if (cd == 200) {
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
        })

        // 依次删除一对牌做将，其余牌全部成扑则可胡
        for (var i = 0; i < cards.length; i++) {
            if (i > 0 && cards[i] == cards[i - 1]){
                continue; // 和上一次是同样的牌，略过不计算
            }
            if ((i + 1 < cards.length && cards[i] == cards[i + 1]) || laizi > 0) {
                var puCards = cards.slice();
                var puLaizi = laizi;
                var a = puCards.splice(i, 1);
                if (puCards[i] == cards[i]) {
                    puCards.splice(i, 1);
                }
                else {
                    puLaizi--;
                }
                if (this.isPu(puCards, puLaizi)) {
                    if( hongFengNum>0||heiFengNum>0) {
                        return true;
                    }
                }
            }
        }
        if (laizi >= 2 && this.isPu(cards, laizi - 2)) {
            if( hongFengNum>0||heiFengNum>0) {
                return true;
            }
        }
        return false;
    }

    majiang.isPu=function(cards, laizi){
        if (cards.length == 0) {
            return true;
        }
        // 若第一张是风牌的一张（东南西北中发白），则判断是否存在"三风"或者"三元"
        var sanTypeCount = 0;
        var sanTypeCard = cards[0];
        var sanTypeCardInt = Math.floor(sanTypeCard / 10);
        hongFengNum=0;
        heiFengNum=0;
        if (sanTypeCardInt > 2 && sanTypeCardInt < 7) {// 三风
            var fengArr = [];    // 风牌种类数组（东南西北）
            for (var i = 0; i < 4; i++) {
                if ((sanTypeCard+i*10) <= 61 && cards.indexOf(sanTypeCard+i*10) >= 0) {
                    if ((sanTypeCard+i*10) != sanTypeCard) fengArr.push((sanTypeCard+i*10));
                }
            }
            if ((fengArr != [] && fengArr.length > 1) || fengArr.length + laizi > 1) {
                if (fengArr.length <= 1) {
                    fengArr.push(0);
                }
                for (var i = 0; i < fengArr.length - 1; i++) {
                    for (var j = i + 1; j < fengArr.length; j++) {
                        var puCards = cards.slice();
                        var puLaizi = laizi;
                        var deletePos1 = puCards.indexOf(sanTypeCard);
                        if (deletePos1 >= 0) puCards.splice(deletePos1, 1);
                        else puLaizi--;
                        var deletePos2 = puCards.indexOf(fengArr[i]);
                        if (deletePos2 >= 0) puCards.splice(deletePos2, 1);
                        else puLaizi--;
                        var deletePos3 = puCards.indexOf(fengArr[j]);
                        if (deletePos3 >= 0) puCards.splice(deletePos3, 1);
                        else puLaizi--;
                        if (this.isPu(puCards, puLaizi)){
                            heiFengNum++;
                            //cc.log("$$$$杠牌监测qqqqqqheiFengNum"+heiFengNum);
                            return true;
                        }
                    }
                }
            }
        }
        else if (sanTypeCardInt > 6 && sanTypeCardInt < 10) {// 三元
            for (var i = 0; i < 3; i++) {
                if (cards.indexOf(sanTypeCard+i*10) >= 0) sanTypeCount++;
            }
            if (sanTypeCount == 3 || sanTypeCount + laizi >= 3) {
                var puCards = cards.slice();
                var puLaizi = laizi;
                for (var i = 0; i < 3; i++) {
                    var deletePos = puCards.indexOf(sanTypeCard + i * 10);
                    if (deletePos >= 0) puCards.splice(deletePos, 1);
                    else puLaizi--;
                }
                if (this.isPu(puCards, puLaizi)) {
                    hongFengNum++;
                    //cc.log("$$$$杠牌监测qqqqqqhongFengNum"+hongFengNum);
                    return true;
                }
            }
        }


        // 若第一张是顺子中的一张
        for (var first = cards[0] - 2; first <= cards[0]; first++) {
            if(first % 10 > 7 || (laizi == 0 && first < cards[0])) {
                continue;
            }
            var shunCount = 0;
            for (var i = 0; i < 3; i++) {
                if (cards.indexOf(first + i) >= 0) {
                    shunCount++;
                }
            }
            if (shunCount == 3 || shunCount + laizi >= 3) {
                var puCards = cards.slice();
                var puLaizi = laizi;
                for (var i = 0; i < 3; i++) {
                    var deletePos = puCards.indexOf(first + i);
                    if (deletePos >= 0) {
                        puCards.splice(deletePos, 1);
                    }
                    else {
                        puLaizi--;
                    }
                }
                if (this.isPu(puCards, puLaizi)) {

                    return true;
                }
            }
        }
        // 若第一张是刻子中的一张
        var keziCount = 1;
        var keziCard = cards[0];
        if (cards[1] == keziCard) {
            keziCount++;
        }
        if (cards[2] == keziCard) {
            keziCount++;
        }
        if (keziCount == 3 || keziCount + laizi >= 3) {
            var puCards = cards.slice();
            var puLaizi = laizi;
            for (var i = 0; i < 3; i++) {
                var deletePos = puCards.indexOf(keziCard);
                if (deletePos >= 0) {
                    puCards.splice(deletePos, 1);
                }
                else {
                    puLaizi--;
                }
            }
            if (this.isPu(puCards, puLaizi)) {
                return true;
            }
        }


        return false;
    }
    majiang.quHeiFeng=function (cards) {
        var dCards=cards.slice();
        dCards.sort();
        var arr=[0,0,0,0];
        var k=0;
        var m=0;
        var n=0;
        var j=0;
        for (var i=0;i<dCards.length;i++)
        {
            if(dCards[i]==31)
            {
                arr[0]++;
                k=i;
            }
            if(dCards[i] == 41){
                arr[1]++;
                m = i;
            }
            if(dCards[i] == 51){
                arr[2]++;
                n = i;
            }
            if(dCards[i] == 61){
                arr[3]++;
                j = i;
            }
        }
        var firstKind=dCards.slice();
        var secondKind=dCards.slice();
        var thridKind=dCards.slice();
        var allKind=[];
        if(arr[0] > 0 && arr[1] > 0 && arr[2] > 0){
            firstKind.splice(k, 1);
            firstKind.splice(m-1, 1);
            firstKind.splice(n-2, 1);
            allKind.push(firstKind)
        }
        else if(arr[0]>0&&arr[1]>0&&arr[3]>0)
        {
            secondKind.splice(k,1);
            secondKind.splice(m-1,1);
            secondKind.splice(j-2,1);
            allKind.push(secondKind)
        }
        else if(arr[1]>0&&arr[2]>0&&arr[3]>0)
        {
            thridKind.splice(m,1);
            thridKind.splice(n-1,1);
            thridKind.splice(j-2,1);
            allKind.push(thridKind)
        }

/*        if(arr[0]>0&&arr[1]>0&&arr[3]>0)
        {
            secondKind.splice(k,1);
            secondKind.splice(n-1,1);
            secondKind.splice(j-2,1);
            allKind.push(secondKind)
        }*/

        return allKind;
    }
    majiang.quHongFeng = function(cards)
    {
        var hCards = cards.slice();
        hCards.sort();
        var arr = [0,0,0];
        var k = 0;
        var m = 0;
        var n = 0;
        for(var i = 0;i < hCards.length; i++){
            if(hCards[i] == 71){
                arr[0]++;
                k = i;
            }
            if(hCards[i] == 81){
                arr[1]++;
                m = i;
            }
            if(hCards[i] == 91){
                arr[2]++;
                n = i;
            }
        }
        if(arr[0] > 0 && arr[1] > 0 && arr[2] > 0){
            hCards.splice(k, 1);
            hCards.splice(m-1, 1);
            hCards.splice(n-2, 1);
        }
        else {
            hCards=null;
        }
        return hCards;
    }


    //听牌函数，判断手牌能否听牌、
    majiang.canTing = function (cards,cd) {
        var hua= MjClient.data.sData.tData.hunCard;
        var pl = MjClient.data.sData.players[SelfUid() + ""];


        for (var i=0;i<cards.length;i++)
        {
            var handcards=cards.slice();
            handcards.sort(function (a,b) {return a-b;});
            if (handcards[i]==handcards[i+3])
            {
                handcards.splice(i,4);
                handcards.push(hua);
                if(this.canHu(handcards,200))
                {
                    return true;
                }
            }
            for(var j=0;j<pl.mjpeng.length;j++)
            {
                var handcards2=cards.slice();
                handcards2.sort(function (a,b) {return a-b;});
                if (handcards2[i]==pl.mjpeng[j])
                {
                    handcards2.splice(i,1);
                    handcards2.push(hua);
                    if(this.canHu(handcards2,200))
                    {
                        return true;
                    }
                }
            }
        }

        if (MjClient.data.sData.tData.areaSelectMode["isDaiFeng"])
        {
            if(is7Dui(cards,200))
            {
                return true;
            }
            if(this.canHu(cards,hua))
            {
                if(pl.mjpeng.length>0||this.calKan(cards)>0&&(heiFengNum == 0 && hongFengNum == 0))
                {
                    cc.log("无风胡");
                    return true;
                }
            }
            if(this.canHu(cards, 200)){
                if(this.hongFeng(cards) > 0 || this.countFengNum(cards) > 0){
                    if(this.quHongFeng(cards)) var hCards = this.quHongFeng(cards);
                    if(this.quHeiFeng(cards)) var dCards = this.quHeiFeng(cards);
                    if (this.canHuLaizi(hCards, 200) || this.canHuLaizi(dCards[0], 200)) {
                        cc.log("黑风胡",this.canHuLaizi(dCards[0], 200));
                        cc.log("红风胡",this.canHuLaizi(hCards, 200));
                        return true;
                    }
                }
            }
            if(this.canHuLaizi1(cards, 200) || is7Dui(cards,200)){
                return true;
            }
            return false;
        }

        return this.canHu(cards,200);
    }

    majiang.canGangWhenTing = function(hand, card,hasTure)
    {
        // var allCardsArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29, 31, 41, 51, 61, 71, 81, 91];
        var hangAfterGang = [];
        huHua = hasTure > 0 ? true:false;
        // var tData = MjClient.data.sData.tData;
        // if (tData.cardNext >= 136)
        // {
        //     return false;
        // }//最后一张牌不可杠

        for(var i = 0; i < hand.length; i++) {
            if(card != hand[i]) {
                hangAfterGang.push(hand[i]);
            }
        }
        var hua= MjClient.data.sData.tData.hunCard;
        if(this.canHu(hangAfterGang,hua))//听状态下，杠胡花牌不用判断听口直接true
        {
            huHua=true;
            tingCardHuHua=card;
            return true;
        }
        // if(huHua==true)
        // {
        //     return false;
        // }
        var pl = MjClient.data.sData.players[SelfUid() + ""];
        for (var i=0;i<hangAfterGang.length;i++)//双暗杠或者一个暗杠一个补杠情况
        {
            var handcards=hangAfterGang.slice();
            handcards.sort(function (a,b) {return a-b;});
            var handcards1=hangAfterGang.slice();
            handcards1.sort(function (a,b) {return a-b;});
            if (handcards[i]==handcards[i+3])
            {
                handcards.splice(i,4);
                handcards.push(hua);
                if(this.canHu(handcards,200))
                {
                    // var tingSet2 = [];
                    var tingSet1 = this.calTingSet(hand);
                    //双暗杠，不能改变听口
                    // for (var k = 0; k < allCardsArray.length; k++) {
                    //     if (this.canHu(handcards, allCardsArray[k])) {
                    //         tingSet2[allCardsArray[k]] = 1;
                    //     }
                    // }
                    var tingSet2 = this.calTingSet(hangAfterGang);
                    for(var tingCard in tingSet2) {
                        if (!(tingCard in tingSet1)) {
                            return false;
                        }
                    }

                    return true;
                }
            }
            for(var j=0;j<pl.mjpeng.length;j++)
            {
                if (handcards1[i]==pl.mjpeng[j])
                {
                    handcards1.splice(i,1);
                    handcards1.push(hua);
                    if(this.canHu(handcards1,200))
                    {
                        // var tingSet2 = [];
                        var tingSet1 = this.calTingSet(hand);
                        //一个暗杠一个补杠，不能改变听口
                        // for (var n = 0; n < allCardsArray.length; n++) {
                        //     if (this.canHu(handcards1, allCardsArray[n])) {
                        //         tingSet2[allCardsArray[n]] = 1;
                        //     }
                        // }
                        var tingSet2 = this.calTingSet(hangAfterGang);

                        for(var tingCard in tingSet2) {
                            if (!(tingCard in tingSet1)) {
                                return false;
                            }
                        }
                        return true;
                    }
                }
            }
        }
        if(MjClient.data.sData.tData.areaSelectMode["isDaiFeng"])//带风胡听状态下的可杠限制
        {
            if(this.hongFeng(hangAfterGang)==0 &&this.countFengNum(hangAfterGang)==0 &&!this.canHu(hangAfterGang,hua))//没有黑风没有红风且不能杠胡花牌直接false
            {
                if(this.canTing(hangAfterGang,200)){
                   if(heiFengNum == 0 && hongFengNum == 0){
                        return false;
                    }
                }
            }
            if(this.hongFeng(hangAfterGang)>0 ||this.countFengNum(hangAfterGang)>0)//有红风或者黑风下杠后不能胡直接false
            {
                if (!this.canHu(hangAfterGang,200))
                {
                    return false;
                }
            }
        }
        else {
            if(!this.canTing(hangAfterGang))
            {
                return false;
            }
        }
        if (!this.canTing(hangAfterGang, 200)) {
            return false;
        }
        //求出之前听的牌
        var tingSet1 = this.calTingSet(hand);
        //求出杠之后听的牌
        var tingSet2 = this.calTingSet(hangAfterGang);
        //对比前后听的牌
        for(var tingCard in tingSet2) {
            if (!(tingCard in tingSet1)) {
                return false;
            }
        }

        //听牌不变可以杠
        cc.log(" 可以杠");
        return true;
    }
    majiang.isHuHua = function()
    {
        return huHua;
    }
    majiang.updateHuHua=function () {
        hastrue=0;
        tingCardHuHua=0;
        huHua=false;
    }
    //是否可以杠
    majiang.canGang1 = function(peng, hand, isTing)
    {
        var rtn = [];
        // hand.sort(function (a,b) {return a-b;});
        for(var i = 0; i < peng.length; i++)
        {

            if(hand.indexOf(peng[i]) >= 0 )
            {
                if(huHua==true)
                {
                    hastrue=999;
                    huHua=false;
                }
                else {
                    huHua=false;
                }
                /*if(hand[hand.length - 1] == peng[i] && (!isTing || majiang.canGangWhenTing(hand, peng[i],hastrue)))*/
                if( (!isTing || majiang.canGangWhenTing(hand, peng[i],hastrue)))
                {
                    //手牌里的牌Push到rtn中
                    if(tingCardHuHua!=0)
                    {
                        rtn=[];
                        rtn.push(tingCardHuHua)
                    }
                    else {
                        rtn.push(peng[i]);
                    }

                }

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
            if(num == 4 )
            {
                if(huHua==true)
                {
                    hastrue=999;
                    huHua=false;
                }
                else {
                    huHua=false;
                }
                if(!isTing || majiang.canGangWhenTing(hand, cd,hastrue))
                {
                    if(tingCardHuHua!=0)
                    {
                        rtn=[];
                        rtn.push(tingCardHuHua)
                    }
                    else {
                        rtn.push(cd);
                    }
                }
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
        MjClient.majiang_fenxiyingkou = majiang;
    }
    else
    {
        module.exports = majiang;
    }

})();
