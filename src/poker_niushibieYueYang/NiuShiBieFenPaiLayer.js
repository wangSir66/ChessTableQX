var __NiuShiBieFenPaiLayer = null;
var NiuShiBieFenPaiLayer = cc.Layer.extend({

    ctor:function () {
        this._super();

        var NiuShiBieFenPaiUI = ccs.load("NiuShiBieFenPaiLayer.json");
        this.addChild(NiuShiBieFenPaiUI.node);
        __NiuShiBieFenPaiLayer = this;
        var _block = NiuShiBieFenPaiUI.node.getChildByName("block");
        _block.setTouchEnabled(true);
        setWgtLayout(_block,[1,1],[0.5,0.5],[0,0],true);
        _block.addTouchEventListener(function(sender,Type){
            switch (Type)
            {
                case ccui.Widget.TOUCH_ENDED:
                    if(__NiuShiBieFenPaiLayer)
                    {
                        __NiuShiBieFenPaiLayer.removeFromParent(true);
                        __NiuShiBieFenPaiLayer = null;
                    }
                    break;
            }
        },this);
        this.back = NiuShiBieFenPaiUI.node.getChildByName("back");
        setWgtLayout(this.back, [this.back.width/1280, this.back.height/720], [0.5, 0.5], [0, 0]);
        this.scoreTxt = this.back.getChildByName("subScore");
        this.updataFenPai();

    },

    updataFenPai : function()
    {
        var tData = MjClient.data.sData.tData;
        var OutFenCard = tData.zhuafenlist.slice();
        var carPoint = [5,10,13];
        var cardScore = 0
        var maskColor = cc.color(255*0.5,255*0.5,255*0.5);
        for(var f=0; f < 4; f++)//花色
        {
            var stand = other = this.back.getChildByName("stand_"+f);
            var offX = stand.x;
            var upSize = stand.getSize();
            var upS = stand.scale;

            for(var c = 0; c < carPoint.length; c++)//5 10 k
            {
                for(var l = 0; l < 2; l++)//两张
                {
                    var cp = carPoint[c]*4-f;
                    var card = getNewCard_card(this.back, "stand_"+f, "fenpai", cp, 0);
                    card.visible = true;
                    card.enabled = false;
                    if ((c*2+l) != 0) {
                        offX += upSize.width * upS * 0.45;//调牌的距离的
                        card.x = offX;//调牌的距离的
                    }else {
                        card.x = offX + upSize.width * upS * 0.1;
                    }
                    var idx = OutFenCard.indexOf(cp)
                    if( idx >= 0) {
                        OutFenCard.splice(idx, 1);
                        //card.isGray = true;
                        card.setColor(maskColor);
                        var point = MjClient.majiang.calPoint(cp);
                        cardScore+=(point > 10 ? 10:point)
                    }
                }
            }
        }

        this.scoreTxt.setString(""+(200-cardScore));
    }
});