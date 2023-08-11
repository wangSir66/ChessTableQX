var DlgagreementViewLayer = cc.Layer.extend({
    ctor: function () {
        this._super();
        var web = ccs.load("A_Dlgagreement.json");
        this.addChild(web.node);
        var block = web.node.getChildByName("block");
        var bkNode = web.node.getChildByName("back");
        setWgtLayout(block, [1, 1], [0.5, 0.5], [0, 0], 2);
        setWgtLayout(bkNode, [0.7, 0.7], [0.5, 0.5], [0, 0]);
        if (ccui.WebView) {
            this.webView = new ccui.WebView();
            this.webView.name = "webView";
            this.webView.setScalesPageToFit(true);
            this.webView.setEventListener(ccui.WebView.EventType.LOADED, function () {
                this.webView.visible = true;
                bkNode.getChildByName('content').getChildByName('loading').visible = false;
            }.bind(this));
            this.webView.visible = false;
        }
        
        if (this.webView) {
            var cSize = bkNode.getChildByName('content');
            this.webView.setContentSize(cSize.width * 0.77 * bkNode.scaleX, cSize.height * 0.85 * bkNode.scaleY);
            this.webView.setPosition(bkNode.x * 1.136, bkNode.y * 0.97);
            this.addChild(this.webView);
            this.webView.loadURL(MjClient.updateCfg.userProtocol);
        }
        //关闭按钮
        var _close = bkNode.getChildByName("close");
        _close.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                this.removeFromParent(true);
            }
        }, this);
        UIManager.popupAnm(bkNode);
        return true;
    },
});