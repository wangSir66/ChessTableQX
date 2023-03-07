var __QuickChatLayer = null;
var NiuShiBieQuickChatLayer = cc.Layer.extend({
    QuickItem:[
        "打一个的",
        "打对子",
        "打三个的",
        "打顺子",
        "打两连对",
        "打三连对",
        "炸死他",
        "你要么子哦",
        "你不好打，我来！",
        "我打不起，你打咯",
        "你有几个鬼哦",
        "我有",
        "我没有",
        "往里面上分，我铁上",
    ],

    ctor:function (pos) {
        this._super();

        var quickchatui = ccs.load("chatquick_niushibieLayer.json");
        this.addChild(quickchatui.node);

        __QuickChatLayer = this;
        var _block = quickchatui.node.getChildByName("block");
        _block.setTouchEnabled(true);
        setWgtLayout(_block,[1,1],[0.5,0.5],[0,0],true);
    
        _block.addTouchEventListener(function(sender,Type){
            switch (Type)
            {
                case ccui.Widget.TOUCH_ENDED:
                    if(__QuickChatLayer)
                    {
                        __QuickChatLayer.removeFromParent(true);
                        __QuickChatLayer = null;
                    }
                    break;
                default :
                    break;
            }
        },this);


        var BG = quickchatui.node.getChildByName("BG");
        setWgtLayout(BG, [BG.width/1280, BG.height/720], [0.90, 0.1], [0, 0]);
        var self= this;
        for (var i = 0; i < 14; i++)
        {
            var btn = BG.getChildByName("Button_"+i);
            if (btn)
            {
                btn.setUserData(i);
                btn.addTouchEventListener(function(sender,eT)
                { 
                    if(eT!=2) return;
                    var num = sender.getUserData();
                    MjClient.gamenet.request("pkroom.handler.tableMsg", {
                        cmd: "MJChat",
                        uid: SelfUid(),
                        type: 1,
                        msg: {text:self.QuickItem[num], voiceType:getCurrentVoiceType()},
                        num: num+20
                    });

                    if(__QuickChatLayer)
                    {
                        __QuickChatLayer.removeFromParent(true);
                        __QuickChatLayer = null;
                    }
                },btn);
            }
        }
    },
});