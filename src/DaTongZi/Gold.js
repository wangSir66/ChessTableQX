var daTongZi = daTongZi || {};

daTongZi.Gold = cc.Node.extend({

    ctor : function () {
        this._super();

        this._initUi();
    },

    _initUi : function(){
        var icon = new cc.Sprite("daTongZi/playing/jinBi.png");
        this.icon = icon;
        this.addChild(icon);
        this.setContentSize(icon.getContentSize());
        icon.x = this.width / 2;
        icon.y = this.height / 2;
        this.setAnchorPoint(0.5,0.5);
        this.setCascadeOpacityEnabled(true);
    },

    doMoveAction : function(tx, ty){
        var ac = cc.moveTo(0.5,cc.p(tx, ty));
        var ac1 = cc.fadeOut(0.3);
        // var spa = cc.spawn(ac, ac1);
        var deT = cc.delayTime(0.2);
        var seq = cc.sequence(ac, deT, ac1, cc.removeSelf());
        if(this && cc.sys.isObjectValid(this)){
            this.runAction(seq);
        }
    }
});