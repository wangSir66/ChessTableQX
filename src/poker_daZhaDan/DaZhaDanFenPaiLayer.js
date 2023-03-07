
var DaZhaDanFenPaiLayer = cc.Layer.extend({
    cardList : null,
    ctor:function () {
        this._super();
        this.cardList = [];

        var fenPaiUI = ccs.load("NiuShiBieFenPaiLayer.json");
        this.addChild(fenPaiUI.node);
        __DaZhaDanFenPaiLayer = this;
        var _block = fenPaiUI.node.getChildByName("block");
        _block.setTouchEnabled(true);
        setWgtLayout(_block,[1,1],[0.5,0.5],[0,0],true);
        _block.addTouchEventListener(function(sender,Type){
            switch (Type)
            {
                case ccui.Widget.TOUCH_ENDED:
                    if(this)
                    {
                        this.removeFromParent(true);
                    }
                    break;
            }
        },this);
        this.back = fenPaiUI.node.getChildByName("back");
        setWgtLayout(this.back, [this.back.width/1280, this.back.height/720], [0.5, 0.5], [0, 0]);
        this.scoreTxt = this.back.getChildByName("subScore");
        this.initFenPai();
        this.updataFenPai();

    },

    initFenPai : function(){
        var fang = [105,105,110,110,113,113];
        var mei = [205,205,210,210,213,213];
        var hong = [305,305,310,310,313,313];
        var hei = [405,405,410,410,413,413];
        var self = this;
        var addCards = function(arr,p){
            var listNode = new daZhaDan.LayoutNode();
            var len = arr.length;
            for(var i = 0; i < len; i++){
                var card = new daZhaDan.Card({type:arr[i]});
                self.cardList.push(card);
                listNode.addChild(card);
            }
            listNode.doLayoutOneLine(-60);
            listNode.setScale(0.8);
            listNode.x = p.x;
            listNode.y = p.y;
            self.back.addChild(listNode);
        }
        addCards(fang, cc.p(60, 190));
        addCards(mei, cc.p(390, 190));
        addCards(hong, cc.p(60, 40));
        addCards(hei, cc.p(390, 40));
    },

    grayCard : function(type){
       var len = this.cardList.length;
        for(var i = 0; i < len; i++){
            var card = this.cardList[i];
            if(card._info.type == type && card.status != daZhaDan.CardStatus.GRAY){
                card.setStatus(daZhaDan.CardStatus.GRAY);
                break;
            }
        } 
    },

    updataFenPai : function()
    {
        this.scoreTxt.setString(200);
        var tData = MjClient.data.sData.tData;
        var list = tData.scoreCards;
        if(list){
            var len = list.length;
            var score = 0;
            for(var i = 0; i < len; i++){
                this.grayCard(list[i]);
                score += MjClient.majiang.getCardScore(list[i]);
            }
            this.scoreTxt.setString(""+(200 - score));
        }
    }
});