//11张跑得快算法类
(function() {
function PaoDeKuai11() {
    PaodekuaiBase.apply(this,arguments);

    this.handCount = 11;
    delete this.CARDTPYE.sange3;
    delete this.CARDTPYE.sangeA;
    delete this.cardCfg.jokerRed;
    delete this.cardCfg.jokerBlack;
    this.cardCfg.firstOutCard = this.cardCfg.ht[6];
    this.PDK_MINPOINT = 6;
}
PaoDeKuai11.prototype = Object.create(PaodekuaiBase.prototype);
PaoDeKuai11.prototype.constructor = PaoDeKuai11;

// 1 - 52  方块A:1 梅花A:2 红心A:3 黑桃A:4 -- 黑桃王:52
// 11张
PaoDeKuai11.prototype.randomCards = function(areaSelectMode, tData) {
    // 首出规则  
    // 1 :3人玩法有黑桃3首出,必须出6    
    // 2：3人玩法有黑桃3首出,可以不出6   
    // 3：2人玩法有黑桃3首出,必须出6  
    // 4 :2人玩法，随机先手，可以不出6
    var firstPutRuleNum = tData.areaSelectMode.firstPutRule;

    var cards = [];
    var allHandCardNum = this.handCount * tData.maxPlayer;
    // 没有大小王的 52 张牌
    for (var i = 1; i <= 52; i++) {

    // 去掉 方块2 梅花2 红心2
        if (i == this.cardCfg.fk[2] || i == this.cardCfg.mh[2] || i == this.cardCfg.hx[2])
            continue;

        // 去掉 黑桃A 方块A 梅花A
        if (i == this.cardCfg.ht[1] || i == this.cardCfg.fk[1] || i == this.cardCfg.mh[1])
            continue;
        // 去掉 黑桃K
        if (i == this.cardCfg.ht[13])
            continue;
        // 去掉 3、4、5
        var point = this.calPoint(i);
        if (point >= 3 && point <= 5)
            continue;
        cards.push(i);
    }

    // 黑桃3 必须发到手上
    if(4 != firstPutRuleNum) {
        // 黑桃6先去掉, 确定人数后再放进牌堆， 保证黑桃6发到玩家手上, 拿黑桃6的先出
        cards.splice( cards.indexOf(this.cardCfg.firstOutCard), 1 );
        // 洗牌
        // cards.sort(function (a, b) {
        //     return .5 - Math.random();
        // });
        cards = shuffleArray(cards);

        // 2人玩法 记录没 发出去的牌
        tData.otherCards = cards.slice(allHandCardNum - 1, cards.length);
        tData.otherCards.sort(this.cardValueCmp.bind(this))
        // 取得对应人数的牌数 - 1
        cards = cards.slice(0, allHandCardNum - 1);
        // 黑桃6放进洗牌堆
        cards.push(this.cardCfg.firstOutCard);
        // 洗牌
        // cards.sort(function (a, b) {
        //     return .5 - Math.random();
        // });
        cards = shuffleArray(cards);

    // 黑桃3 可以不发到手上
    } else {
        // 洗牌
        cards = shuffleArray(cards);
        // cards.sort(function (a, b) {
        //     return .5 - Math.random();
        // });
        // 2人玩法 记录没 发出去的牌
        tData.otherCards = cards.slice(allHandCardNum, cards.length);
        tData.otherCards.sort(this.cardValueCmp.bind(this))

        // 取得对应人数的牌数 - 1
        cards = cards.slice(0, allHandCardNum);
    }

    if (areaSelectMode.havezhadan == false )
        this.noZhadan(cards, tData.maxPlayer, this.handCount)
    
    return cards;
};

PaodekuaiBase.prototype.deleteChaiZhanDanArr = function(oHands, rets, areaSelectMode){
    if(!rets || !oHands || !areaSelectMode || !areaSelectMode.zhaDanBuChai ){return;}

    for(var i = rets.length - 1; i >= 0; i--){
        if ( this.isChaiZhaDan(oHands, rets[i], areaSelectMode) ){
            //cc.log("------delete card----- = "+ JSON.stringify(rets[i]));
            rets.splice(i, 1);
        }
    }
};

if(typeof(module)!="undefined" && module.exports)    
    module.exports = PaoDeKuai11;

if(typeof(MjClient)!="undefined")
    MjClient.majiang_Paodekuai11 = new PaoDeKuai11();

})();