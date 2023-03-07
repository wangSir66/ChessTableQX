
var daTongZi = daTongZi || {};

daTongZi.JiPaiQiNode = cc.Layer.extend({

    _uiParent : null,
    ctor:function () {
        this._super();
        var uiNode = ccs.load("jiPaiQi.json");
        this.addChild(uiNode.node);
        this.uiNode = uiNode.node;

        var _back = uiNode.node.getChildByName("back");
        setWgtLayout(_back,[1,1],[0.5,0.5],[0,0]);
        this._uiParent = _back;
        
        var returnBtn =  _back.getChildByName("returnBtn");
        var self = this;
        returnBtn.addTouchEventListener(function(sender,Type){
            switch (Type)
            {
                case ccui.Widget.TOUCH_ENDED:
                    this.removeFromParent();
                    break;
                default :
                    break;
            }
        },this);   
        
        this.initLeftCards();
        this.initUsers();

        return true;
    },

    initUsers : function(){
        var players = MjClient.data.sData.players;
        var copyNode = this.uiNode.getChildByName("back").getChildByName("item");
        var index = 0;
        for(var m in players){
            var pl = players[m];
            var item = copyNode;
            if(index > 0){
                item = copyNode.clone();
                copyNode.getParent().addChild(item);
            }
            item.x = copyNode.x;
            item.y = copyNode.y - (item.height + 8) * index;
            addWxHeadToEndUI_daTongZi(item.getChildByName("head"), pl);

            var name = item.getChildByName("name");
            name.setString(unescape(pl.info.nickname));
            name.setFontName("Arial");
            name.setFontSize(name.getFontSize());

            var listNode = new daTongZi.LayoutNode();
            var cardNode = item.getChildByName("cardNode");
            var mjput = pl.mjput;
            for(var i = 0; i < mjput.length; i++){
                var arr = [];
                var cards = mjput[i];
                for(var j = 0; j < cards.length; j++){
                    arr.push({type:cards[j]});
                }
                var node = this.getCardsList(arr);
                var scale = cardNode.height/node.height;
                node.setScale(scale);
                listNode.addChild(node);
            }
            listNode.doLayoutOneLine(-60);
            var scale = Math.min(cardNode.width/listNode.width, cardNode.height/listNode.height);
            listNode.setScale(scale);
            cardNode.addChild(listNode);

            index += 1;
        }
    },

    //牌列表
    getCardsList : function (cards){
        var cardsNode = new daTongZi.LayoutNode();
        for(var i = 0; i < cards.length; i++){
            var card = new daTongZi.Card(cards[i]);
            cardsNode.addChild(card);
        }
        cardsNode.doLayoutGrid(1,cards.length,-60,-60);
        cardsNode.setAnchorPoint(0,0);
        return cardsNode;
    },

    initLeftCards : function(){
        var deckNum = MjClient.data.sData.tData.deckNum ? MjClient.data.sData.tData.deckNum : 4;
        var pl = MjClient.data.sData.players[MjClient.data.pinfo.uid];
        var stats = MjClient.majiang.statsLeftCards(MjClient.data.sData, pl.mjhand);

        for(var i = 0; i < stats.length; i++){
            var obj = stats[i];
            this._showCardLeftInfo(obj.card, obj.num, i);
        }

    },

    xGap : 6.8,
    tx : 13,
    _showCardLeftInfo : function(card, count, i){
        var copyItem = this._uiParent.getChildByName("cardsNode").getChildByName("item");
        var info = this._getCardInfo(card);
        var point = info.point;
        var suit = info.suit;
        var item = copyItem;
        if(i > 0){
            item = copyItem.clone();
            copyItem.getParent().addChild(item);
        }
        item.x = this.tx;
        item.y = copyItem.y;
        this.tx += item.width + this.xGap;

        var suitSrc = "daTongZi/jipaiqi/type_" + suit + ".png";
        item.loadTexture(suitSrc);
        var typeTxt = item.getChildByName("typeTxt");
        typeTxt.ignoreContentAdaptWithSize(true);
        typeTxt.setString(point);

        var countTxt = item.getChildByName("countTxt");
        countTxt.ignoreContentAdaptWithSize(true);
        countTxt.setString(count);
    },

    _getCardInfo : function(card){
        var p = card % 100;
        var suit = Math.floor(card / 100);
        var obj = {};
        switch(p){
            case 11 :
                p = "J";
                break;
            case 12 :
                p = "Q";
                break;
            case 13 :
                p = "K";
                break;
            case 14 :
                p = "A";
                break;
            case 15 :
                p = "2";
                break;
            case 20 :
            case 16 :
                p = "王";
                suit = "20";
                break;
            case 30 :
            case 17 :
                p = "王";
                suit = "30";
                break;
        }
        return {point : p, suit : suit};
    }
});


