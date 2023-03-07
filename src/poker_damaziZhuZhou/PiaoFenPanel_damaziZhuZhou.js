
var PiaoFenView_damaziZhuZhou = cc.Layer.extend({
    jsBind: {
        block: {
            _layout: [[1, 1], [0.5, 0.5], [0, 0], true]
        }
    },
    ctor: function (score,gotOff) {
        this._super();

        var piaofenui = ccs.load("baoxi_Piaofen.json");
        BindUiAndLogic(piaofenui.node, this.jsBind);
        this.addChild(piaofenui.node);
        // setWgtLayout(down, [0.13, 0.13], [0, 0], [0.6, 0.3], false, false);
        // setWgtLayout(top, [0.13, 0.13], [0.5, 1], [0, -0.6], false, false);
        // setWgtLayout(right, [0.13, 0.13], [1, 0.5], [-0.6, 0.4], false, false);
        // if (isIPhoneX()) {
        //     setWgtLayout(left, [0.13, 0.13], [0.05, 0.5], [0.6, 0.4], false, false);
        // }else{
        //     setWgtLayout(left, [0.13, 0.13], [0, 0.5], [0.6, 0.4], false, false);
        // }
        var wgtlayout = [
            [[0.08, 0],[0.6, 0.3]],
            [[0.98, 0.5],[-0.6, 0.4]],
            [[0.4, 0.8],[0, -0.6]],
            [[0.05, 0.5],[0.7, 0.4]],
        ];

        var nodemask = piaofenui.node.getChildByName("nodemask");
        for (var uioff = 0; uioff < 4; uioff++)
        {
            var scoreChanged = 0;
            if (uioff == gotOff)
                scoreChanged = score;
            else
                scoreChanged = - score / (MjClient.MaxPlayerNum - 1);

            var winnum1 = nodemask.getChildByName("winNum"+ (uioff+1) +"_1");
            var winnum2 = nodemask.getChildByName("winNum"+ (uioff+1) +"_2");
            setWgtLayout(winnum1, [winnum1.width/1280, winnum1.height/720], wgtlayout[uioff][0], wgtlayout[uioff][1], false, false);
            setWgtLayout(winnum2, [winnum1.width/1280, winnum1.height/720], wgtlayout[uioff][0], wgtlayout[uioff][1], false, false);
            winnum1.ignoreContentAdaptWithSize (true);
            winnum2.ignoreContentAdaptWithSize (true);
            winnum1.visible = scoreChanged >= 0;
            winnum2.visible = scoreChanged < 0;
            winnum1.setString(""+scoreChanged);
            winnum2.setString(""+scoreChanged);
            winnum1.runAction(cc.moveBy(0.5, cc.p(0,50)));
            winnum2.runAction(cc.moveBy(0.5, cc.p(0,50)));   
        }

        this.runAction(cc.Sequence.create(cc.delayTime(0.6), cc.callFunc(function() {
            this.removeFromParent();
        }.bind(this))));
    }
}); 