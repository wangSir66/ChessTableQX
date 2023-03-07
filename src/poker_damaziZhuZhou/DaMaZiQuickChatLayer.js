var __DaMaZiQuickChatLayer = null;
var DaMaZiQuickChatLayer = cc.Layer.extend({
    QuickItem:[
        "打一个的",
        "打对子",
        "打三个的",
        "打四个的",
        "打两连对",
        "打三连对",
        "你有板子冒罗？",
        "你要么子哟",
        "你不好打，我来！",
        "我打不起，你打咯",
        "你有几个鬼哦？",
        "我有",
        "我没有",
        "往里面上分，我铁上！",
    ],

    ctor:function (pos) {
        this._super();

        var quickchatui = ccs.load("chatquick_damaziLayer.json");
        this.addChild(quickchatui.node);

        __DaMaZiQuickChatLayer = this;
        var _block = quickchatui.node.getChildByName("block");
        _block.setTouchEnabled(true);
        setWgtLayout(_block,[1,1],[0.5,0.5],[0,0],true);
    
        _block.addTouchEventListener(function(sender,Type){
            switch (Type)
            {
                case ccui.Widget.TOUCH_ENDED:
                    if(__DaMaZiQuickChatLayer)
                    {
                        __DaMaZiQuickChatLayer.removeFromParent(true);
                        __DaMaZiQuickChatLayer = null;
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
                        num: num + (MjClient.gameType == MjClient.GAME_TYPE.YUE_YANG_NIU_SHI_BIE ? 20 : 10),
                    });

                    if(__DaMaZiQuickChatLayer)
                    {
                        __DaMaZiQuickChatLayer.removeFromParent(true);
                        __DaMaZiQuickChatLayer = null;
                    }
                },btn);
            }
        }
    },
});