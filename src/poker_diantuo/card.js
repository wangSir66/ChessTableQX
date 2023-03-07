var dianTuo = dianTuo || {};

dianTuo.CardStatus = {
    UNHOOD : 1, //翻开状态
    HOOD:2, //盖住状态
    GRAY:3,  //灰色不可用状态
    MARK:4, //标记状态
};

dianTuo.CARD_TYPE = {
    noType: -1,     // 无牌型
    danZhang: 0,    // 单张
    duiZi: 1,       // 对子
    sanZhang: 2,    // 三张
    shunZi: 3,      // 顺子
    lianDui: 4,     // 连对
    feiJi: 5,       // 飞机
    zaHuaWuShiK: 7, // 杂花5-10-k
    tongHuaWuShiK: 8,   // 同花5-10-k
    zhaDan: 9,      // 炸弹
};

/**
 * 出牌信息
 */
dianTuo.ChuInfo = function () {
    /**
     * 出牌的位置
     * @type {number}
     */
    this.pos = 0;
    /**
     * 牌型
     * @type {number}
     */
    this.paixing = dianTuo.PaiXing.NO;

    /**
     * 牌列表
     * @type Array.<game.pdk.CardInfo>
     */
    this.cardList = [];
};

dianTuo.CardInfo = function () {
    /**
     * 牌值
     * @type {number}
     */
    this.type = 0;
};

dianTuo.Card = daZhaDan.Card.extend({
    /**
     * @type {game.pdk.CardInfo};
     */
    // _cardPath : "playing/diantuo/cards/",
    ctor : function (info) {
        this._super();
        this._info = info;
 
    },

  
});