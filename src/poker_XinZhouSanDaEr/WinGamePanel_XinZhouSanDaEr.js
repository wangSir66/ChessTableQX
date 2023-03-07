
function SetJieSuanText_SanDaEr(node){
    var pl=getUIPlayer(0);
    node.setVisible(false);
    if(!pl)return;

    node.setVisible(true);
    var tData=MjClient.data.sData.tData;
    var uibind= {
        num_jiaofen: {
            _run: function () {
                this.ignoreContentAdaptWithSize(true);
            },
            _text: function () {
                var pre = "";
                if (tData.jiaoFen && tData.jiaoFen >= 0 ){
                    return pre + tData.jiaoFen;
                }else{
                    return "0";
                }
            },
        },
        num_defen: {
            _run: function () {
                this.ignoreContentAdaptWithSize(true);
            },
            _text: function () {
                var pre = "";
                if (tData.totalScore && tData.totalScore >= 0 ){
                    return pre + tData.totalScore;
                }else{
                    return "0";
                }
            },
        },
        isZhuangKouDi: {
            _run: function () {
                this.ignoreContentAdaptWithSize(true);
            },
            _text: function () {
                var pre = "";
                if (tData.isZhuangKouDi == 1){
                    return pre + "庄家扣底";
                }else if (tData.isZhuangKouDi == 0){
                    return pre + "x2闲家扣底"
                }
                else {
                    return ""
                }
            },
        },
        text_koudi: {
            _run: function () {
                this.ignoreContentAdaptWithSize(true);
                if (tData.isZhuangKouDi == 1 || tData.isZhuangKouDi == 0) {
                    this.visible = true;
                }
                else {
                    this.visible = false;
                }
            }
        },

    };
    BindUiAndLogic(node,uibind);
}

function SetResultNum_SanDaEr(node, off) {
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
var EndOneView_sanDaEr = cc.Layer.extend({
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
                    if (cards && cards.length == 4) {
                        for (var i = 0; i < 4; i++) {
                            setCardSprite_card(this.getChildByName("card_" + i), cards[i], true);
                        }
                    } else {
                        for (var i = 0; i < 4; i++) {
                            this.getChildByName("card_" + i).setVisible(false);
                        }
                    }
                }
            },
            result_down:{
                _run: function() {
                    SetResultNum_SanDaEr(this, 0);
                }
            },
            result_right:{
                _run: function() {
                    SetResultNum_SanDaEr(this, 1);
                }
            },
            result_top:{
                _run: function() {
                    SetResultNum_SanDaEr(this, 2);
                }
            },
            result_left:{
                _run: function() {
                    SetResultNum_SanDaEr(this, 3);
                }
            },
            result_fifth:{
                _run: function() {
                    SetResultNum_SanDaEr(this, 4);
                }
            },
            text_jiesuan: {
                _run: function() {
                    SetJieSuanText_SanDaEr(this);
                }
            },
        }
    },
    ctor: function() {
        this._super();
        MjClient.endoneui = this;

        var endoneui = ccs.load("endOne_XinZhouSanDaEr.json");
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
        var tData=MjClient.data.sData.tData;
        cc.log("tData.isZhuangKouDi tData.isZhuangKouDi :"+tData.isZhuangKouDi )
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