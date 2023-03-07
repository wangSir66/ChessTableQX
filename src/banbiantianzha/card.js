var banBianTianZha = banBianTianZha || {};

banBianTianZha.CARD_TYPE = {
    noType: -1,     // 无牌型
    danZhang: 0,    // 单张
    duiZi: 1,       // 对子
    sanZhang: 2,    // 三张
    siDaiSan : 3,    //四带三
    shunZi: 4,      // 顺子
    lianDui: 5,     // 连对
    feiJi: 6,       // 飞机

    zaHuaWuShiK: 7, // 杂花5-10-k
    tongHuaWuShiK: 8,   // 同花5-10-k
    zhaDan: 9,      // 炸弹
    tongHuaShun: 10, //同花顺
    diZha : 11,     //地炸 4个以上的连队
    tianZha: 12,     //天炸  单张王
};

banBianTianZha.Card = daTongZi.Card.extend({
    ctor : function (info) {
        this._super(info);
    },
    _initUI : function () {
        this.front = true;
        this.lock = false;

        var path = "playing/cardPic2/";

        // 卡牌正面
        var box = new cc.Sprite(path + "baidi_puke.png");
        this.box = box;
        this.addChild(box);
        this.setContentSize(box.getContentSize());
        box.x = this.width / 2;
        box.y = this.height / 2;

        //花色类型
        var flowerTypeNode = new ccui.ImageView();
        box.addChild(flowerTypeNode);

        //牌的类型
        var cardTypeNode = new ccui.ImageView();
        box.addChild(cardTypeNode);

        if(this._info.type == 516){
            flowerTypeNode.setScale(0.8);
            flowerTypeNode.loadTexture(path + "xiaowang_hua.png");
            cardTypeNode.loadTexture(path + "joker_xiao.png");
            var nodeSize = box.getContentSize();
            cardTypeNode.setPosition(7 + cardTypeNode.getContentSize().width/2, nodeSize.height - 7 - cardTypeNode.getContentSize().height/2);
            flowerTypeNode.setPosition(nodeSize.width - 10 - flowerTypeNode.getContentSize().width/2, 10 + flowerTypeNode.getContentSize().height/2);
        }else if(this._info.type == 517){
            flowerTypeNode.setScale(0.8);
            flowerTypeNode.loadTexture(path + "dawang_hua.png");
            cardTypeNode.loadTexture(path + "joker_da.png");
            var nodeSize = box.getContentSize();
            cardTypeNode.setPosition(7 + cardTypeNode.getContentSize().width/2, nodeSize.height - 7 - cardTypeNode.getContentSize().height/2);
            flowerTypeNode.setPosition(nodeSize.width - 10 - flowerTypeNode.getContentSize().width/2, 10 + flowerTypeNode.getContentSize().height/2);
        }else{
            var cardType = this._info.type % 100;
            if(cardType > 13){
                cardType = cardType % 13;
            }
            var suitType = Math.floor(this._info.type / 100);

            var smallFlowerNode = new ccui.ImageView();
            smallFlowerNode.setScale(0.4);
            box.addChild(smallFlowerNode);
            smallFlowerNode.loadTexture(path + "flower_" + (suitType % 4) + ".png");

            flowerTypeNode.setScale(0.66);
            flowerTypeNode.loadTexture(path + "flower_" + (suitType % 4) + ".png");

            if(suitType == 2 || suitType == 4)
            {
                cardTypeNode.loadTexture(path + "hei_" + cardType + ".png");
            }
            else
            {
                cardTypeNode.loadTexture(path + "hong_" + cardType + ".png");
            }
            var nodeSize = box.getContentSize();
            cardTypeNode.setPosition(7 + cardTypeNode.getContentSize().width/2, nodeSize.height - 7 - cardTypeNode.getContentSize().height/2);
            flowerTypeNode.setPosition(nodeSize.width - 10 - flowerTypeNode.getContentSize().width*flowerTypeNode.getScaleX()/2, 10 + flowerTypeNode.getContentSize().height/2);
            smallFlowerNode.setPosition(cardTypeNode.getPositionX(), nodeSize.height - 80);
        }

        // 卡牌背面
        var backBox = new cc.Sprite("playing/cardPic/beimian_puke.png");
        backBox.setAnchorPoint(0.5,0.5);
        backBox.x = backBox.width / 2;
        backBox.y = backBox.height / 2;
        backBox.setVisible(false);
        this.backBox = backBox;
        this.addChild(backBox);

        var bg = new cc.Sprite("daTongZi/cards/redMask.png");
        bg.setAnchorPoint(0.5,0.5);
        bg.x = bg.width * 0.5;
        bg.y = bg.height * 0.5;
        this.addChild(bg);
        this._redBg = bg;
        this._redBg.visible = false;

        var bg = new cc.Sprite("daTongZi/cards/grayMask.png");
        bg.setAnchorPoint(0.5,0.5);
        bg.width = box.getContentSize().width;
        bg.height = box.getContentSize().height;
        bg.x = bg.width * 0.5;
        bg.y = bg.height * 0.5;
        this.addChild(bg);
        this._grayBg = bg;
        this._grayBg.visible = false;

        // this.setAnchorPoint(0.5,0.5);
    },
});