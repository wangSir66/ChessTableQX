
function SetJieSuanText_DaQi(node){
    var pl=getUIPlayer(0);
    node.setVisible(false);
    if(!pl)return;

    node.setVisible(true);
    var tData=MjClient.data.sData.tData;
    var uibind= {
        num_zongzhuafen: {
            _run: function () {
                this.ignoreContentAdaptWithSize(true);
            },
            _text: function () {
                var pre = "";
                if (tData.dqDesc.totalZhuaScore && tData.dqDesc.totalZhuaScore >= 0 ){
                    return pre + tData.dqDesc.totalZhuaScore;
                }else{
                    return "0";
                }
            },
        },
        num_zongkoufen: {
            _run: function () {
                this.ignoreContentAdaptWithSize(true);
            },
            _text: function () {
                var pre = "";
                if (tData.dqDesc.kouDiScore && tData.dqDesc.kouDiScore >= 0 ){
                    return pre + tData.dqDesc.kouDiScore;
                }else{
                    return "0";
                }
            },
        },
        num_difenbeishu: {
            _run: function () {
                this.ignoreContentAdaptWithSize(true);
            },
            _text: function () {
                var pre = "";
                if (tData.dqDesc.difen && tData.dqDesc.difen >= 0 ){
                    return pre + tData.dqDesc.difen;
                }else{
                    return "0";
                }
            },
        },
        num_zongdefen: {
            _run: function () {
                this.ignoreContentAdaptWithSize(true);
            },
            _text: function () {
                var pre = "";
                if (tData.dqDesc.totalScore && tData.dqDesc.totalScore >= 0 ){
                    return pre + tData.dqDesc.totalScore;
                }else{
                    return "0";
                }
            },
        },
        num_zongkouji: {
            _run: function () {
                this.ignoreContentAdaptWithSize(true);
            },
            _text: function () {
                var pre = "";
                if (tData.dqDesc.addKouDiJi && tData.dqDesc.addKouDiJi >= 0 ){
                    return pre + tData.dqDesc.addKouDiJi;
                }else{
                    return "";
                }
            },
        },
        text_zongkouji: {
            _run: function () {
                this.ignoreContentAdaptWithSize(true);
            },
            _text: function () {
                if (tData.dqDesc.addKouDiJi && tData.dqDesc.addKouDiJi >= 0 ){
                    return "抠底级数：";
                }else{
                    return "";
                }
            },
        },
    };
    BindUiAndLogic(node,uibind);
}

function SetResultNum_DaQi(node, off) {
    var pl=getUIPlayer(off);
    node.setVisible(false);
    if(!pl)return;

    node.setVisible(true);
    var uibind= {
        cutnum: {
            _run: function () {
                this.ignoreContentAdaptWithSize(true);
            },
            _text: function () {
                var pre = "";
                if (pl.winone >= 0){
                    return pre;
                }else{
                    return pre + pl.winone;
                }
            },
        },
        addnum: {
            _run: function () {
                this.ignoreContentAdaptWithSize(true);
            },
            _text: function () {
                var pre = "";
                if (pl.winone < 0){
                    return pre;
                }else{
                    return pre + "+" + pl.winone;
                }
            },
        },
    };
    BindUiAndLogic(node,uibind);
}
var EndOneView_daQi = cc.Layer.extend({
    jsBind: {
        block: {
            _layout: [
                [1, 1],
                [0.5, 0.5],
                [0, 0], true
            ]
        },
        back: {
            _layout: [
                [1, 1],
                [0.5, 0.5],
                [0, 0]
            ],
            wintitle: {
                _visible: function() {
                    var pl = getUIPlayer(0);
                    if (pl) {
                        //playEffect("win");
                        return pl.winone >= 1;
                    }
                    return false;
                }
            },
            losetitle: {
                _visible: function() {
                    var pl = getUIPlayer(0);
                    if (pl) {
                        //playEffect("lose");
                        return pl.winone < 0;
                    }
                    return false;
                }
            },
            jiesan: {
                _visible: function() {
                    var pl = getUIPlayer(0);

                    if(pl && MjClient.isDismiss){
                        return true;
                    }else{
                        return false;
                    }
                },
                _run: function() {
                    if (MjClient.isDismiss) {
                        //this.loadTexture("gameOver_daQi/jiesan.png");
                    }
                }
            },
            shareBtn: {
                _click:function(btn,eT){
                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Xiaojiesuanjiemian_Fenxiang", {uid:SelfUid()});

                    MjClient.shareMultiPlatform(MjClient.systemConfig.sharePlatforms, function()
                    {
                        postEvent("capture_screen");
                        MjClient.endoneui.capture_screen = true;
                        btn.setTouchEnabled(false);
                    });
                }
                ,_event:{
                    captureScreen_OK: function () {
                        if (MjClient.endoneui.capture_screen != true)
                            return;
                        MjClient.endoneui.capture_screen = false;
                        var writePath = jsb.fileUtils.getWritablePath();
                        var textrueName = "wxcapture_screen.png";
                        var savepath = writePath+textrueName;
                        MjClient.shareImageToSelectedPlatform(savepath);
                        this.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(function()
                        {
                            this.setTouchEnabled(true);
                        }.bind(this))));
                    }
                }
            },
            readyBtn: {
                _click: function (btn, eT) {

                    postEvent("clearCardUI");

                    var sData=MjClient.data.sData;
                    var tData=sData.tData;
                    if (sData.tData.roundNum <= 0) 
                    {
                        MjClient.endoneui.getParent().addChild(new GameOverLayer_doudizhu(),500);
                    }

                    MjClient.endoneui.removeFromParent(true);
                    MjClient.endoneui = null;
                    if (MjClient.rePlayVideo >= 0 && MjClient.replayui) {
                        MjClient.replayui.replayEnd();
                    }
                    else {
                        PKPassConfirmToServer_card();
                    }
                }
            },
            image_player_zhuang: {
                _run: function() {
                    //SetEndOneUserUI_daQi(this, MjClient.endoneui.offs[0]);
                    var tData = MjClient.data.sData.tData;
                    var cards = tData.diPaiArr;
                    if (cards && cards.length == 8) {
                        for (var i = 0; i < 8; i++) {
                            setCardSprite_card(this.getChildByName("card_" + i), cards[i], true);
                        }
                    } else {
                        for (var i = 0; i < 8; i++) {
                            this.getChildByName("card_" + i).setVisible(false);
                        }
                    }
                }
            },
            result_down:{
                _run: function() {
                    SetResultNum_DaQi(this, 0);
                }
            },
            result_right:{
                _run: function() {
                    SetResultNum_DaQi(this, 1);
                }
            },
            result_top:{
                _run: function() {
                    SetResultNum_DaQi(this, 2);
                }
            },
            result_left:{
                _run: function() {
                    SetResultNum_DaQi(this, 3);
                }
            },
            result_fifth:{
                _run: function() {
                    SetResultNum_DaQi(this, 4);
                }
            },
            text_jiesuan: {
                _run: function() {
                    SetJieSuanText_DaQi(this);
                }  
            },
        }
    },
    ctor: function() {
        this._super();
        MjClient.endoneui = this;

        var endoneui = ccs.load("endOne_daQi.json");

        // var offs = [];
        // var tData = MjClient.data.sData.tData;
        // for (var i = 0; i < MjClient.MaxPlayerNum; i++)
        // {
        //     var pl = getUIPlayer(i);
        //     if (pl.info.uid == tData.uids[tData.zhuang])
        //         offs.unshift(i);
        //     else
        //         offs.push(i);
        // }
        // MjClient.endoneui.offs = offs;

        BindUiAndLogic(endoneui.node, this.jsBind);
        this.addChild(endoneui.node);
        var _back = endoneui.node.getChildByName("back");
        setWgtLayout(_back, [1, 1], [0.5, 0.5], [0, 0], true);
        if(isIPhoneX())
        {
            setWgtLayout(_back, [0.85, 0.85], [0.5, 0.5], [0, 0], true);
        }
        //时间
        var _back = endoneui.node.getChildByName("back");
        var _time = _back.getChildByName("time");
        _time.visible = true;
        _time.setString(MjClient.roundEndTime);

        //房间描述
        var _roomInfo = _back.getChildByName('roomInfo');
        _roomInfo.visible = true;
        _roomInfo.setString(MjClient.playui.getGameInfoString("roundInfo"));
        return true;
    }
});