

function SetEndOneUserUI_GanDengYan(node, off) {
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var pl = MjClient.getPlayerByIndex(off);
    node.setVisible(false);
    if (!pl) return;

    node.setVisible(true);

    var uibind = {
        name: {
            _run:function()
            {
                this.ignoreContentAdaptWithSize(true);
            },
            _text: function () {
                return getNewName(unescape(pl.info.nickname ) + "");
            }
        }, 
        cards_remaining : {
            _run: function() {
                this.ignoreContentAdaptWithSize(true);
            },
            _text: function() {
                return pl.mjhand.length + "";
            }
        }, 
        zhadan_count: {
            _run: function () {
                this.ignoreContentAdaptWithSize(true);
            },
            _text: function () {
                return pl.zhaDanCount + "";
            },  
        },
        score: {
            _run: function () {
                this.ignoreContentAdaptWithSize(true);
            },
            _text: function () {
                var pre = "";
                if (pl.winone > 0) 
                    pre = "+";
                return pre + pl.winone;
            }
        },
        head_bg: {
            _run:function()
            {
                var pl = getUIPlayer(0);
                if (pl && pl.winone < 0) {
                    this.loadTexture("playing/ganDengYan/player_lose.png");
                }
            }
        },
        guan_men: {
            _run:function()
            {
                if (MjClient.isDismiss)
                    this.visible = false;
                else
                    this.visible = (pl.info.uid == tData.uids[tData.zhuang] ? pl.outCardCount <= 1 : pl.outCardCount < 1);
            }
        }
    }

    BindUiAndLogic(node, uibind);
}

var EndOneView_GanDengYan = cc.Layer.extend({
    jsBind: {
        block: {
            _layout: [[1, 1], [0.5, 0.5], [0, 0], true]
        },
        back: {
            _run: function () {
                var pl = getUIPlayer(0);
                if (pl && pl.winone < 0) {
                    this.loadTexture("playing/ganDengYan/lose_back.png");
                }

                if (isIPhoneX()) {
                    // 超框处理
                    setWgtLayout(this, [0.9 * this.width / 1280, 0.9 * this.height / 720], [0.5, 0.5], [0, 0]);
                } else {
                    setWgtLayout(this, [this.width / 1280, this.height / 720], [0.5, 0.5], [0, 0]);
                }
            },
            wintitle:
    		{
    		    _visible: function () {
    		        var pl = getUIPlayer(0);
    		        if (pl) {
    		            //playEffect("win");
    		            return pl.winone >= 1;
    		        }
    		        return false;
    		    }
    		}, losetitle:
    		{
    		    _visible: function () {
    		        var pl = getUIPlayer(0);
    		        if (pl) {
    		            //playEffect("lose");
    		            return pl.winone < 0;
    		        }
    		        return false;
    		    }
    		},
            dismisstitle:
            {
                _visible: function () {
                    return MjClient.isDismiss;
                }
            },
            share: {
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
                ,_visible: function () {
                    return !MjClient.remoteCfg.guestLogin;
                }
            },
            ready: {
                // _run: function () {
                //     if (MjClient.remoteCfg.guestLogin) {
                //         setWgtLayout(this, [0.15, 0.15], [0.5, 0.085], [0, 0], false, true);
                //     }
                // },
                _click: function (btn, eT) {
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    if (sData.tData.roundNum <= 0) 
                        MjClient.endoneui.getParent().addChild(new GameOverLayer_ganDengYan(),500);

                    postEvent("clearCardUI");
                    MjClient.endoneui.removeFromParent(true);
                    MjClient.endoneui = null;
                   
                    if (MjClient.rePlayVideo >= 0 && MjClient.replayui) {
                        MjClient.replayui.replayEnd();
                    }
                    else {
                        PKPassConfirmToServer_card();
                    }
                    if (MjClient.arrowbkNode && cc.sys.isObjectValid( MjClient.arrowbkNode )) {
                        MjClient.arrowbkNode.setVisible(false);
                    }

                    //reInitarrCardVisible();
                }
            },
            player0: {
                _run: function () { SetEndOneUserUI_GanDengYan(this, 0); },
            }
    		, player1: {
    		    _run: function () { SetEndOneUserUI_GanDengYan(this, 1); }
    		}
    		, player2: {
    		    _run: function () { SetEndOneUserUI_GanDengYan(this, 2); }
    		}
            , player3: {
                _run: function () { SetEndOneUserUI_GanDengYan(this, 3); }
            }
            , player4: {
                _run: function () { SetEndOneUserUI_GanDengYan(this, 4); }
            }
        }
    },
    ctor: function () {
        this._super();
        MjClient.endoneui = this;

        var endoneui = ccs.load("endOne_GanDengYan.json");
        BindUiAndLogic(endoneui.node, this.jsBind);
        this.addChild(endoneui.node);

        return true;
    }
});