var yzLaoChuo = yzLaoChuo || {};

yzLaoChuo.CARD_TYPE = {
    noType: -1,     // 无牌型
    dan: 0,    // 单张
    dui: 1,       // 对子
    daMian: 2,    // 
    xiaoMian: 3,      // 
    canHe: 4,     // 
    kan: 5,       // 
    long: 6,        // 
    shun: 7, // 
};

yzLaoChuo.Card = daTongZi.Card.extend({
    _cardPath : "playing/paohuzi/",
    ctor : function (info) {
        this._super(info);
        this.setCascadeOpacityEnabled(true);

        this.rowGap = 92;
    },

    _initUI : function () {
        this.front = true;
        this.lock = false;

        // 卡牌正面
        var box = new cc.Sprite(this._cardPath + this._info.name + this._info.type +  ".png");
        this.box = box;
        this.addChild(box);
        this.setContentSize(box.getContentSize());
        box.x = this.width / 2;
        box.y = this.height / 2;

        // 卡牌背面
        var backBox = new cc.Sprite(this._cardPath + "HandBG.png");
        backBox.setAnchorPoint(0.5,0.5);
        backBox.x = backBox.width / 2;
        backBox.y = backBox.height / 2;
        backBox.setVisible(false);
        this.backBox = backBox;
        this.addChild(backBox);

        var bg = new cc.Sprite(this._cardPath + "HandBG.png");
        bg.setAnchorPoint(0.5,0.5);
        bg.x = bg.width * 0.5;
        bg.y = bg.height * 0.5;
        this.addChild(bg);
        this._redBg = bg;
        this._redBg.visible = false;

        var bg = new cc.Sprite(this._cardPath + "grayMask.png");
        bg.setContentSize(box.getContentSize());
        bg.setAnchorPoint(0.5,0.5);
        bg.x = bg.width * 0.5;
        bg.y = bg.height * 0.5;
        this.addChild(bg);
        this._grayBg = bg;
        this._grayBg.visible = false;

        var big = new cc.Sprite(this._cardPath + "da.png");
        big.setAnchorPoint(0,1);
        big.x = 0;
        big.y = box.getContentSize().height;
        this.addChild(big);
        this._bigBg = big;
        this._bigBg.visible =  this._info.showBigIcon ? true : false;
    },
});