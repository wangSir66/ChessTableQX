var aniPathCfg = 
[
    {
        _png1 : "playing/niushibie/RoundEndAni/woshul/woshulmaa0.png",
        _plist1 : "playing/niushibie/RoundEndAni/woshul/woshulmaa0.plist",
        _exjson1 : "playing/niushibie/RoundEndAni/woshul/woshulmaa.ExportJson",
        _anim1 : "woshulmaa",
        _png2 : "playing/niushibie/RoundEndAni/xuanzhuan/xuanzhuang0.png",
        _plist2 : "playing/niushibie/RoundEndAni/xuanzhuan/xuanzhuang0.plist",
        _exjson2 : "playing/niushibie/RoundEndAni/xuanzhuan/xuanzhuang.ExportJson",
        _anim2 : "xuanzhuang"
    },
    {
        _png1 : "playing/niushibie/RoundEndAni/woshul/woshulmaa0.png",
        _plist1 : "playing/niushibie/RoundEndAni/woshul/woshulmaa0.plist",
        _exjson1 : "playing/niushibie/RoundEndAni/woshul/woshulmaa.ExportJson",
        _anim1 : "woshulmaa",
        _png2 : "playing/niushibie/RoundEndAni/xuanzhuan/xuanzhuang0.png",
        _plist2 : "playing/niushibie/RoundEndAni/xuanzhuan/xuanzhuang0.plist",
        _exjson2 : "playing/niushibie/RoundEndAni/xuanzhuan/xuanzhuang.ExportJson",
        _anim2 : "xuanzhuang"
    },
    {
        _png1 : "playing/niushibie/RoundEndAni/woyingl/woyingl0.png",
        _plist1 : "playing/niushibie/RoundEndAni/woyingl/woyingl0.plist",
        _exjson1 : "playing/niushibie/RoundEndAni/woyingl/woyingl.ExportJson",
        _anim1 : "woyingl",
        _png2 : "playing/niushibie/RoundEndAni/woyingl/woyingl30.png",
        _plist2 : "playing/niushibie/RoundEndAni/woyingl/woyingl30.plist",
        _exjson2 : "playing/niushibie/RoundEndAni/woyingl/woyingl3.ExportJson",
        _anim2 : "woyingl3"
    },
    {
        _png1 : "playing/niushibie/RoundEndAni/woyingl/woyingl20.png",
        _plist1 : "playing/niushibie/RoundEndAni/woyingl/woyingl20.plist",
        _exjson1 : "playing/niushibie/RoundEndAni/woyingl/woyingl2.ExportJson",
        _anim1 : "woyingl2",
    }
];

function SetEndOneUserUI_NiuShiBieYueYang(node, off) {
    var sData = MjClient.data.sData;
    var tData = sData.tData;

    var selfindex = getPlayerIndex(0);
    off = MjClient.data.sData.tData.fieldId? (selfindex + off ): off;//金币场要求头像，第一个是自己，然后按出牌顺序排列
    off = off % 3;//MjClient.MaxPlayerNum;
    var pl = MjClient.getPlayerByIndex(off);

    node.setVisible(false);
    if (!pl) {
        // 二人玩时，显示剩余的底牌
        if(tData.otherCards) {
            node.setVisible(true);
            for(var i in node.children) {
                var child = node.children[i];
                child.setVisible(false);
            }

            //添加手牌
            var stand_other = node.getChildByName("stand_other");
            
            node.getChildByName("stand_other_desc").setVisible(true);
            node.getChildByName("stand_other_desc").ignoreContentAdaptWithSize(true);
            stand_other.setVisible(false)

            var stand = stand_other//head.getChildByName("stand");
            var offX = stand.x;
            var upSize = stand.getSize();
            var upS = stand.scale;


            var otrCards = MjClient.majiang.sortHandCards(tData.otherCards, 0);
            for (var i = 0; i < otrCards.length; i++) {
                var card = getNewCard_card(node, "stand_other", "mjhand", otrCards[i], 0);
                card.visible = true;
                card.enabled = false;
                card.setScale(0.48);
                if (i != 0) {
                    offX += upSize.width * upS * 0.4;//调牌的距离的
                    card.x = offX;//调牌的距离的
                }else {
                    card.x = offX + upSize.width * upS * 0.1;
                }

            }

        }
        return;
    }
    node.setVisible(true);
    setUserOfflineWinGamePanel(node,pl);
    node = node.getChildByName("head");

    // var zhuangNode = node.getChildByName("zhuang");
    // var tempZhuang = (typeof MjClient.preZhuang != 'undefined') ? MjClient.preZhuang : tData.zhuang;
    // zhuangNode.setVisible(tData.uids[tempZhuang] == pl.info.uid);
    // zhuangNode.zIndex=10;

    //add by sking
    var name = node.getChildByName("name");
    name.ignoreContentAdaptWithSize(true);
}




var EndOneView_NiuShiBieYueYang = cc.Layer.extend({
    jsBind: {
        block: {
            _layout: [[1, 1], [0.5, 0.5], [0, 0], true]
        },
        back: {
            _layout: [[1, 1], [0.5, 0.5], [0, 0]], 
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
                    // var sData = MjClient.data.sData;
                    // var tData = sData.tData;
                    // return !MjClient.remoteCfg.guestLogin && !tData.matchId;
                }
            },
            ready: {
                _run: function () {
                    if (MjClient.remoteCfg.guestLogin) {
                        setWgtLayout(this, [0.15, 0.15], [0.5, 0.085], [0, 0], false, true);
                    }
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    if (tData.matchId) {
                        this.setVisible(false);
                    }
                },
                _click: function (btn, eT) {
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    if(!tData.fieldId && sData.tData.roundNum <= 0) {
                        if (MjClient.gameType == MjClient.GAME_TYPE.YUE_YANG_NIU_SHI_BIE)
                            MjClient.endoneui.getParent().addChild(new GameOverLayer_niushibie(),500);
                        else
                            MjClient.endoneui.getParent().addChild(new GameOverLayer_damazi(),500);
                    }
                    if(!tData.fieldId){
                        postEvent("clearCardUI");
                        MjClient.endoneui.removeFromParent(true);
                        MjClient.endoneui = null;    
                    }
                    if (MjClient.rePlayVideo >= 0 && MjClient.replayui) {
                        MjClient.replayui.replayEnd();
                    }
                    else {
                        if (tData.fieldId){
                            leaveGameClearUI();
                            MjClient.Scene.addChild(new goldMatchingLayer({matching:false,gameType:tData.gameType}));
                            MjClient.goldfieldEnter(tData.fieldId,tData.gameType);
                            return;
                        }else{
                            PKPassConfirmToServer_card();
                        }
                    }
                    if (MjClient.arrowbkNode && cc.sys.isObjectValid( MjClient.arrowbkNode )) {
                        MjClient.arrowbkNode.setVisible(false);
                    }

                    // MjClient.endoneui.removeFromParent(true);
                    // MjClient.endoneui = null;
                }
            },

        }
    },
    ctor: function () {
        this._super();
        MjClient.endoneui = this;

        var endoneui = ccs.load(res.EndOne_NiuShiBieYueYang_json);
        BindUiAndLogic(endoneui.node, this.jsBind);
        this.addChild(endoneui.node);
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

        var nodemask = endoneui.node.getChildByName("nodemask");
        for (var uioff = 0; uioff < 4; uioff++)
        {
            var pl = getUIPlayer(uioff)? getUIPlayer(uioff):{};
            pl.winone = pl.winone? pl.winone:0;

            var winnum1 = nodemask.getChildByName("winNum"+ (uioff+1) +"_1");
            var winnum2 = nodemask.getChildByName("winNum"+ (uioff+1) +"_2");
            setWgtLayout(winnum1, [winnum1.width/1280, winnum1.height/720], wgtlayout[uioff][0], wgtlayout[uioff][1], false, false);
            setWgtLayout(winnum2, [winnum1.width/1280, winnum1.height/720], wgtlayout[uioff][0], wgtlayout[uioff][1], false, false);
            winnum1.ignoreContentAdaptWithSize (true);
            winnum2.ignoreContentAdaptWithSize (true);
            winnum1.visible = pl.winone >= 0;
            winnum2.visible = pl.winone < 0;
            winnum1.setString(""+pl.winone);
            winnum2.setString(""+pl.winone);
            winnum1.runAction(cc.moveBy(0.5, cc.p(0,50)));
            winnum2.runAction(cc.moveBy(0.5, cc.p(0,50)));   
        }

        //播放输赢动画。
        var pself = getUIPlayer(0);
        var aniIdex = 0;
        if(pself.winone > 0)aniIdex = 2;
        else if (pself.winone < 0)aniIdex = 1;
        // aniIdex = 1;
        var anicfg  = aniPathCfg[aniIdex];

        ccs.armatureDataManager.addArmatureFileInfo(anicfg._png1, anicfg._plist1, anicfg._exjson1);
        var _armature = new ccs.Armature(anicfg._anim1);
        _armature.setPosition(cc.winSize.width/2, cc.winSize.height/2+10);
        _armature.setScale(MjClient.size.width/1280);
        _armature.getAnimation().playWithIndex(aniIdex == 0? 1:0, -1, 0);

        ccs.armatureDataManager.addArmatureFileInfo(anicfg._png2, anicfg._plist2, anicfg._exjson2);
        var armature1 = new ccs.Armature(anicfg._anim2);
        armature1.setPosition(cc.winSize.width/2, cc.winSize.height/2+10);
        armature1.setScale(MjClient.size.width/1280);
        armature1.visible =false;
        armature1.getAnimation().playWithIndex(0, -1, 1);
        
        this.addChild(armature1,8888);
        this.addChild(_armature,9999);
        _armature.runAction( cc.sequence( cc.delayTime(0.5),cc.callFunc(function()
        {
            armature1.visible = true;
        })));

        //如果是赢的话，会复些
        if (aniIdex == 2)
        {
            _armature.getAnimation().setMovementEventCallFunc(function(armature, movementType, movementID){
                if(movementType == ccs.MovementEventType.complete)
                {
                    anicfg = aniPathCfg[3];
                    armature.removeFromParent();
                    ccs.armatureDataManager.addArmatureFileInfo(anicfg._png1, anicfg._plist1, anicfg._exjson1);
                    var _armature1 = new ccs.Armature(anicfg._anim1);
                    _armature1.setPosition(cc.winSize.width/2, cc.winSize.height/2+10);
                    _armature1.setScale(MjClient.size.width/1280);
                    _armature1.getAnimation().playWithIndex(0, -1, 1);
                    this.addChild(_armature1,9999);
                }
            }, this);
        }

        return true;
    }
}); 