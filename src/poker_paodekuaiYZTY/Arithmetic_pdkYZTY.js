//跑得快算法类，//永州，邵阳，湘乡，耒阳，衡阳的跑得快公用
(function() {
function PaoDeKuaiYZTY() {
    PaodekuaiBase.apply(this,arguments)


}

PaoDeKuaiYZTY.prototype = Object.create(PaodekuaiBase.prototype);
PaoDeKuaiYZTY.prototype.constructor = PaoDeKuaiYZTY

/** 
 * 用laizi张癞子去拼出type牌型的牌
 * @param {array} hands 按点数按好序的牌
 * @param {number} laizi 所使用的癞子数
 * @param {this.CARDTPYE} type 要拼出的牌型
 * @param {array} lastCards 最后一手牌
 * @param {array} 拼好的 
 */
PaoDeKuaiYZTY.prototype.findCardByType = function(hands, laizi, type, lastCards, buChaiTypes, areaSelectMode) {
    var rets = [];
    var laizis = [];
    var cardNum = typeof(lastCards)!='undefined' && lastCards ? lastCards.length : null;
    var cardCount = this.PDK_CARDCOUNT[type];

    if (cardNum && (type == this.CARDTPYE.liandui || type == this.CARDTPYE.shunzi))
        cardCount = cardNum;

    if (laizi > cardCount || laizi + hands.length < cardCount) {
        // 如果是用所有手牌压 飞机 或 三带二 , 牌数少于被压的牌
        if(type != this.CARDTPYE.feiji && type != this.CARDTPYE.sandaier)
            return rets;
    }

    for (var i = 0; i < laizi; i++) {
        laizis.push(this.laiziCard);
    }

    if (type == this.CARDTPYE.feiji && hands.length >= cardCount) {
        var handFeiji = this.getSanShunAndSanPai(hands);
        var handCardSanZhangNum = handFeiji[0].length/3;
        var handCardSanPaiNum = handFeiji[1].length;

        if (handCardSanZhangNum >= 2)
        {
            if (lastCards && lastCards != -1 && lastCards.length > 0)
            {
                var feijiInfo = this.formatFeiJiType(lastCards,areaSelectMode);
        
                var lastCardSanZhangNum = feijiInfo.sanZhangCards.length/3;
                var lastCardSanPaiNum = feijiInfo.sanPaiCards.length;

                if(handCardSanZhangNum >= lastCardSanZhangNum){
                    var sanShun = [];
                    var sanpai = [];
                    for(var i=0; i<handCardSanZhangNum; i++){
                        var startSanIndex = i*3;
                        var lastSanIndex = i*3+lastCardSanZhangNum*3;
                        sanShun = handFeiji[0].slice(startSanIndex, lastSanIndex)
                        if(sanShun.length != feijiInfo.sanZhangCards.length) continue;
                        var feiJiValue_a = this.formatFeiJiType(handFeiji[0],areaSelectMode).value;
                        var feiJiValue_b = feijiInfo.value;
                        if(feiJiValue_a < feiJiValue_b) continue;
                        sanpai = handFeiji[0].slice(0, startSanIndex);
                        sanpai = sanpai.concat(handFeiji[0].slice(lastSanIndex, handFeiji[1].length-lastSanIndex));
                        sanpai = sanpai.concat(handFeiji[1]);
                        var allSanPaiZhuHe = [];
                        if (this.useNewTip) {
                            allSanPaiZhuHe = this.findDaiPai(sanpai, this.CARDTPYE.feiji, lastCardSanPaiNum, false, buChaiTypes);
                        } else {
                            for(var j=0; j < sanpai.length && sanpai.length >= j+lastCardSanPaiNum; j++) {  // 依次散牌组合
                                var cards = sanpai.slice(j, j+lastCardSanPaiNum);
                                allSanPaiZhuHe.push(cards);
                            }
                        }
                        if (allSanPaiZhuHe.length > 0) {
                            for(var j in allSanPaiZhuHe){
                                var ret = sanShun.concat( allSanPaiZhuHe[j] );
                                if(this.isFeiJi(ret,areaSelectMode) != 0){
                                    rets.push(ret);
                                }
                            }
                        }
                        else // 如果飞机是最后一手， 可以打出
                        {
                            var ret = sanShun.concat(sanpai)
                            rets.push(ret);
                        }
                    }
                }
            }
            else
            {
                // 先手

                // var lastCardSanZhangNum = 0;
                // var lastCardSanPaiNum = 0;
                // for(var k = handCardSanZhangNum; k >= 2; k--)
                // {
                //     lastCardSanZhangNum = k;

                //     for(var m = lastCardSanZhangNum; m >= 0; m--)
                //     {
                //         lastCardSanPaiNum = Math.min(handCardSanPaiNum,m*2);

                //         if(handCardSanZhangNum >= lastCardSanZhangNum)
                //         {
                //             var sanShun = [];
                //             var sanpai = [];

                //             for(var i=0; i<handCardSanZhangNum; i++)
                //             {
                //                 var startSanIndex = i*3;
                //                 var lastSanIndex = i*3+lastCardSanZhangNum*3;

                //                 sanShun = handFeiji[0].slice(startSanIndex, lastSanIndex)
                //                 sanpai = handFeiji[0].slice(0, startSanIndex);
                //                 sanpai = sanpai.concat(handFeiji[0].slice(lastSanIndex, handFeiji[1].length-lastSanIndex));
                //                 sanpai = sanpai.concat(handFeiji[1]);

                //                 var allSanPaiZhuHe = [];

                //                 if (this.useNewTip) 
                //                 {
                //                     allSanPaiZhuHe = this.findDaiPai(sanpai, this.CARDTPYE.feiji, lastCardSanPaiNum, false, buChaiTypes);
                //                 } 
                //                 else 
                //                 {
                //                     for(var j=0; j < sanpai.length && sanpai.length >= j+lastCardSanPaiNum; j++) 
                //                     {  
                //                         // 依次散牌组合
                //                         var cards = sanpai.slice(j, j+lastCardSanPaiNum);
                //                         allSanPaiZhuHe.push(cards);
                //                     }
                //                 }

                //                 if (allSanPaiZhuHe.length > 0) 
                //                 {
                //                     for(var j in allSanPaiZhuHe)
                //                     {
                //                         var ret = sanShun.concat( allSanPaiZhuHe[j] );

                //                         ret.sort(this.cardValueCmp.bind(this));

                //                         if(this.isFeiJi(ret,areaSelectMode) != 0)
                //                         {
                //                             rets.push(ret);
                //                         }
                //                     }
                //                 }
                //                 else // 如果飞机是最后一手， 可以打出
                //                 {
                //                     var ret = sanShun.concat(sanpai)
                //                     rets.push(ret);
                //                 }
                //             }
                //         }
                //     }
                // }
            }
        }

    }else if (type == this.CARDTPYE.sangeA) {
        if (laizi == 0)
        {
            var find = this.findNSameCard(hands, this.PDK_APOINT, 3);
            if (find)
                rets.push(find);
        }
    }
    else if (type == this.CARDTPYE.sange3) {
        if (laizi == 0)
        {
            var newHands = this.delPoint(hands, [this.cardCfg.ht[3]]);
            var find = this.findNSameCard(newHands, this.PDK_MINPOINT, 3);
            if (find)   rets.push(find);
        }
    }
    else if (type == this.CARDTPYE.sizha  || type == this.CARDTPYE.duizi || type == this.CARDTPYE.sanzhang) { 
        for (var i = this.PDK_MINPOINT; i <= this.PDK_MAXPOINT; i++) {
            var find = this.findNSameCard(hands, i, cardCount - laizi);
            if (find) {
                rets.push(laizis.concat(find));
            }
        }
    }
    else if (type == this.CARDTPYE.liandui) {
        for (var i = this.PDK_MINPOINT; i <= this.PDK_APOINT - cardCount/2 + 1; i++) // 连对首张
        {
            var ldCount = 0;
            var ret = laizis.slice();
            for (var j = 0; j < cardCount/2; j++) 
            {
                var p = i + j;
                for (var k = 0; k < hands.length - 1; k++) 
                {
                    var point1 = this.calPoint(hands[k]);
                    var point2 = this.calPoint(hands[k + 1]);
                    if (point1 != p || point2 != p)
                        continue;

                    ldCount += 2;
                    ret.push(hands[k]);
                    ret.push(hands[k + 1]);
                    break;
                }
            }
            if (ldCount + laizi == cardCount) {
                rets.push(ret);
            }
        }
    }
    else if (type == this.CARDTPYE.sandaier) {
        for (var aLaizi = 0; aLaizi <= laizi; aLaizi++) 
        {
            for (var i = this.PDK_MINPOINT; i <= this.PDK_MAXPOINT; i++) 
            {
                var temp1 = this.findNSameCard(hands, i, 3 - aLaizi);
                if (!temp1)
                    continue;

                if(1 - (laizi - aLaizi) <= 0) 
                {
                    rets.push(laizis.concat(temp1));
                    continue;
                }

                var newHands = this.delPoint(hands, [i]);
                
                if (this.useNewTip) {
                    var findCards = this.findDaiPai(newHands, type, 2, false, buChaiTypes);
                    for (var j in findCards) {
                        var ret = laizis.concat(temp1);
                        ret = ret.concat(findCards[j]);
                        if (!this.indexOfCards(rets, ret)) 
                            rets.push(ret);
                    }
                }
                else {
                    for(var j=1; j < newHands.length; j++)
                    {
                        var ret = laizis.concat(temp1);
                        ret.push(newHands[j-1]);
                        ret.push(newHands[j]);
                        if( !this.indexOfCards(rets, ret) ) 
                            rets.push(ret); 
                    }
                }

                // 如果是有3张， 但手牌数量不够组成3带二，可以用3带1 或 3张打
                if(rets.length == 0) {
                    rets.push(hands);
                }

            }
        }
    }
    else if (type == this.CARDTPYE.sandaiyi) {
        for (var aLaizi = 0; aLaizi <= laizi; aLaizi++) 
        {
            for (var i = this.PDK_MINPOINT; i <= this.PDK_MAXPOINT; i++) 
            {
                var temp1 = this.findNSameCard(hands, i, 3 - aLaizi);
                if (!temp1)
                    continue;

                if(1 - (laizi - aLaizi) <= 0) 
                {
                    rets.push(laizis.concat(temp1));
                    continue;
                }

                var newHands = this.delPoint(hands, [i]);
                if (this.useNewTip) {
                    var findCards = this.findDaiPai(newHands, type, 1, false, buChaiTypes);
                    for (var j in findCards) {
                        var ret = laizis.concat(temp1);
                        ret = ret.concat(findCards[j]);
                        rets.push(ret);
                    }
                }
                else {
                    for(var j=0; j < newHands.length; j++)
                    {
                        var ret = laizis.concat(temp1);
                        ret.push(newHands[j]);
                        rets.push(ret); 
                    }
                }

                // 如果是有3张， 但手牌数量不够组成3带一，可以3张打
                if(rets.length == 0) {
                    rets.push(hands);
                }

            }
        }
    }
    else if (type == this.CARDTPYE.shunzi) {
        for (var i = this.PDK_MINPOINT; i <= this.PDK_APOINT - cardCount + 1; i++) { // 顺子首张
            var shun = laizis.slice();

            for (var j = 0; j < cardCount; j++) {
                var p = i + j;
                var find = this.findNSameCard(hands, p, 1);
                if( (p-1)==this.PDK_KPOINT )  // 如果上张牌是K ,需要考虑计算A
                    find = this.findNSameCard(hands, this.PDK_APOINT, 1);

                if (find)
                    shun = shun.concat(find);
            }
            if (shun.length == cardCount)
                rets.push(shun);
        }
    }
    else if (type == this.CARDTPYE.danpai) {
        if (laizis.length == 1) {
            rets.push(laizis.slice());
        }
        else {
            var handsCopy = hands.slice();
            handsCopy.sort(this.cardValueCmp.bind(this));

            for (var i = this.PDK_MINPOINT; i <= this.PDK_MAXPOINT; i++) 
            {
                // cc.log("findCardByType hands " + hands + " i = " + i);

                // 效率太低，废弃
                // var find = this.findNSameCard(hands, i, 1);
                // if (find)
                //     rets.push(find);

                for (var j = 0; j < handsCopy.length; j++) {
                    if (this.calPoint(handsCopy[j]) == i) {
                        rets.push([handsCopy[j]]);
                        break;
                    }
                }
            }
        }
    }
    else if (type == this.CARDTPYE.sidaier){
        for (var i = this.PDK_MINPOINT; i <= this.PDK_MAXPOINT; i++)
        {
            var find = this.findNSameCard(hands, i, 4);
            if(!find)
                continue;

            var newHands = this.delPoint(hands, [i]);
            if (this.useNewTip) {
                var findCards = this.findDaiPai(newHands, type, 2, false, buChaiTypes);
                for (var j in findCards) {
                    var ret = laizis.concat(find);
                    ret = ret.concat(findCards[j]);
                    rets.push(ret);
                }
            } else {
                for(var j=1; j < newHands.length; j++)
                {
                    var ret = laizis.concat(find);
                    ret.push(newHands[j-1]);
                    ret.push(newHands[j]);
                    rets.push(ret); 
                }
            }
        }
    }
    else if (type == this.CARDTPYE.sidaisan){
        for (var i = this.PDK_MINPOINT; i <= this.PDK_MAXPOINT; i++)
        {
            var find = this.findNSameCard(hands, i, 4);
            if(!find)
                continue;

            var newHands = this.delPoint(hands, [i]);
            if (this.useNewTip) {
                var findCards = this.findDaiPai(newHands, type, 3, false, buChaiTypes);
                for (var j in findCards) {
                    var ret = laizis.concat(find);
                    ret = ret.concat(findCards[j]);
                    rets.push(ret);
                }
            } else {
                for(var j=2; j < newHands.length; j++)
                {
                    var ret = laizis.concat(find);
                    ret.push(newHands[j-1]);
                    ret.push(newHands[j-2]);
                    ret.push(newHands[j]);
                    rets.push(ret); 
                }
            }
        }
    }

    // 如果是最后一手牌， 可以接张数不一样类型相同的牌
    // 适用于 飞机牌型 和 三张牌型
    // 例如 3带2 可用 3带1 或 3张接
    if(cardNum >= hands.length && rets.length == 0) {
        rets.push(hands);
    }

    return rets;
};

if(typeof(module)!="undefined" && module.exports)    
    module.exports = PaoDeKuaiYZTY;

if(typeof(MjClient)!="undefined")
    MjClient.majiang_PaoDeKuaiYZTY = new PaoDeKuaiYZTY();

})();