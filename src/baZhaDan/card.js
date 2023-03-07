var baZhaDan = baZhaDan || {};

baZhaDan.CARD_TYPE = {
    noType: -1,     // 无牌型
    danZhang: 0,    // 单张
    duiZi: 1,       // 对子
    sanZhang: 2,    // 三张
    shunZi: 3,      // 顺子
    lianDui: 4,     // 连对
    feiJi: 5,       // 飞机
    danWang: 6,        // 单王
    zaHuaWuShiK: 7, // 杂花5-10-k
    tongHuaWuShiK: 8,   // 同花5-10-k
    zhaDan: 9,      // 炸弹
};

baZhaDan.Card = daTongZi.Card.extend({
    _cardPath : "baZhaDan/cards/",
    ctor : function (info) {
        this._super(info);
        this.setCascadeOpacityEnabled(true);

        this.rowGap = 50;
    },
});