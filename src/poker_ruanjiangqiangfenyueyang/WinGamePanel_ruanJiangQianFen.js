

function SetEndOneUserUI_ruanJiangQianFenYueYang(node, off) {
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var pl = MjClient.getPlayerByIndex(off);
    node.setVisible(false);
    if (!pl) return;
    node.setVisible(true);
    node = node.getChildByName("head");

    var name = node.getChildByName("name");
    name.ignoreContentAdaptWithSize(true);

    var uibind = {
        head: {
            name: {
                _run:function()
                {
                    this.ignoreContentAdaptWithSize(true);
                    this.setFontName("Arial");
                    this.setFontSize(this.getFontSize());
                },
                _text: function () {
                    var _nameStr = unescape(pl.info.nickname ) + "";
                    return getNewName(_nameStr);
                }
            },
            id: {
                _run:function()
                {
                    this.ignoreContentAdaptWithSize(true);
                },
                _text: function () {
                    return "ID:" + pl.info.uid.toString();
                }
            },
        },
        txt_jiangli: {
            _run:function()
            {
                this.ignoreContentAdaptWithSize(true);
                var uid = pl.info.uid;
                var jiangFenData = MjClient.endInfo.jiangFenData;
                var jiangFen = jiangFenData[uid];
                this.setString("/" + jiangFen);
                if(jiangFen < 0) {
                    this.setProperty("/" + jiangFen, "gameOver/pjjs_29.png", 40, 58, ".");
                }
            }
        },
        txt_jifen: {
            _run:function()
            {
                this.ignoreContentAdaptWithSize(true);
                var uid = pl.info.uid;
                var zhuaFenData = MjClient.endInfo.zhuaFenData;
                var zhuaFen = zhuaFenData[uid];
                this.setString("/" + zhuaFen);
                if(zhuaFen < 0) {
                    this.setProperty("/" + zhuaFen, "gameOver/pjjs_29.png", 40, 58, ".");
                }
            }
        },
        txt_xifen: {
            _run:function()
            {
                this.ignoreContentAdaptWithSize(true);
                var uid = pl.info.uid;
                var xiFenData = MjClient.endInfo.xiFenData;
                var xiFen = xiFenData[uid];
                this.setString("/" + xiFen);
                if(xiFen < 0) {
                    this.setProperty("/" + xiFen, "gameOver/pjjs_29.png", 40, 58, ".");
                }
            }
        },
        txt_leijifen: {
            _run:function()
            {
                this.ignoreContentAdaptWithSize(true);
                var uid = pl.info.uid;
                var totalFenData = MjClient.endInfo.totalFenData[uid];
                this.setString("/" + totalFenData);
                if(totalFenData < 0) {
                    this.setProperty("/" + totalFenData, "gameOver/pjjs_29.png", 40, 58, ".");
                }
            }
        },
        txt_leijixi: {
            _run:function()
            {
                this.ignoreContentAdaptWithSize(true);
                var uid = pl.info.uid;
                var totalXiFenData = MjClient.endInfo.totalXiFenData;
                var totalXiFen = totalXiFenData[uid];
                this.setString("/" + totalXiFen);
                if(totalXiFen < 0) {
                    this.setProperty("/" + totalXiFen, "gameOver/pjjs_29.png", 40, 58, ".");
                }
            }
        },
        img_rank:{
            _run: function () {
                this.ignoreContentAdaptWithSize(true)
                var uid = pl.info.uid;
                var tourList = MjClient.endInfo.tourList;
                this.visible = tourList.length != 0;
                var rank = tourList.indexOf(uid);
                rank += 1;
                this.loadTexture("playing/ruanjiangqianfen/Ui_you"+rank+".png");
            }
        }
    }
    BindUiAndLogic(node.parent, uibind);
    CircularCuttingHeadImg(uibind.head._node, pl);
}

function CardLayoutRestore(node) {
    var tData = MjClient.data.sData.tData;
    var tourList = tData.tourList;
    var uid = tourList[tourList.length -1];
    var sData = MjClient.data.sData;
    var pls = sData.players;
    var pl = pls[uid];
    if(!pl) { return ;}
    var arry = [];
    //添加手牌
    for (var i = 0; i < pl.mjhand.length; i++) {
        arry.push(getNewCard_card(node, "stand", "mjhand", pl.mjhand[i], 0));
    }

    for (var i = 0; i < arry.length; i++) {
        arry[i].visible = true;
        arry[i].enabled = false;
        arry[i].setScale(arry[i].getScale() * 0.65);
    }
    var stand = node.getChildByName("stand");
    var standX = stand.x;
    var standY = stand.y;
    var startX = standX;
    for(var i = 0;i < arry.length;i++) {
        var ci = arry[i];
        ci.x = startX;
        ci.y = standY;
        startX += 20;
    }
};


var EndOneView_ruanJiangQianFenYueYang = cc.Layer.extend({
    jsBind: {
        block: {
            _layout: [[1, 1], [0.5, 0.5], [0, 0], true]
        },
        back: {
            _run:function()
            {
                if(isIPhoneX())
                    setWgtLayout(this, [0.85,0.85],[0.5,0.5],[0,0], false);
                else
                    setWgtLayout(this, [1,1],[0.5,0.5],[0,0], false);
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
                _run: function () {
                    if (MjClient.remoteCfg.guestLogin) {
                        setWgtLayout(this, [0.15, 0.15], [0.5, 0.085], [0, 0], false, true);
                    }
                },
                _click: function (btn, eT) {
                    postEvent("clearCardUI");
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
            delText:
                {
                    _run: function() {
                        if (MjClient.isDismiss) {
                            var sData = MjClient.data.sData;
                            var tData = sData.tData;
                            var id = tData.firstDel;
                            var pl = sData.players[id];
                            var delStr = "";
                            if (pl) {
                                var name = unescape(pl.info.nickname );
                                delStr = name + pl.mjdesc[0];
                            } else { // 会长或管理员解散房间时 pl 会为 null
                                pl = getUIPlayer(0);
                                if (pl)
                                    delStr = pl.mjdesc[0];
                            }
                            this.setString(delStr);
                        } else {
                            this.setString("");
                        }
                    }
                },
            info:
                {
                    _visible: true,
                    _run: function(){
                        if(MjClient.APP_TYPE.QXYYQP !== MjClient.getAppType()&& MjClient.getAppType() != MjClient.APP_TYPE.YLHUNANMJ) return;
                    },
                    _text: function () {
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;
                        var text = "";
                        text = GameCnName[MjClient.gameType] + tData.maxPlayer + "人";
                        return text;
                    }
                },
            dir:
            {
                _visible: true,
                _run:function()
                {
                    this.ignoreContentAdaptWithSize(true);
                },
                _text: function () {
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    var text = "";
                    var _roundText = "";
                    _roundText = getPlaySelectPara(MjClient.gameType,tData.areaSelectMode);
                    if (_roundText.charAt(_roundText.length - 1) == ",") {
                        _roundText = _roundText.substring(0, _roundText.length - 1);
                    }
                    _roundText = _roundText.replace("房主付,","");
                    var index = _roundText.lastIndexOf(",");
                    _roundText = _roundText.substr(0, index) + "\n排名:" + _roundText.substr(index+1,_roundText.length -1);
                    text += ("房间号:" + tData.tableid);
                    text += ("\n" +_roundText);

                    return text;
                }
            },
            bar:{
                _run:function() {
                    if (MjClient.isDismiss)
                    {
                        this.loadTexture("gameOver/jiesan_qf.png");
                    }
                }
            },
            oneScore_title: {
                _run:function(){
                    this.ignoreContentAdaptWithSize(true);
                },
            },
            allScore_title: {
                _run:function(){
                    this.ignoreContentAdaptWithSize(true);
                },
            },
            head0: {
                _run: function () { SetEndOneUserUI_ruanJiangQianFenYueYang(this, 0); },

            }
    		, head1: {
    		    _run: function () { SetEndOneUserUI_ruanJiangQianFenYueYang(this, 1); }
    		}

    		, head2: {
    		    _run: function () { SetEndOneUserUI_ruanJiangQianFenYueYang(this, 2); },
    		    _visible: function() {
    		        return MjClient.MaxPlayerNum >= 3
                }
    		}
            , head3: {
                _run: function () { SetEndOneUserUI_ruanJiangQianFenYueYang(this, 3); },
                _visible:function() {
                    return MjClient.MaxPlayerNum == 4
                }
            },
            img_yupai:{
                _visible:function() {
                    return MjClient.MaxPlayerNum != 4
                },
                _run:function() {
                    if(MjClient.MaxPlayerNum == 2) {
                        this.loadTexture("playing/ruanjiangqianfen/yupai2.png");
                    } else {
                        this.loadTexture("playing/ruanjiangqianfen/yupai.png");
                    }
                }
            },
            Node_1:{
                stand:{
                    _visible:function() {
                        return false;
                    }
                },
                _run: function () {
                    CardLayoutRestore(this);
                },
                _visible:function() {
                    return MjClient.MaxPlayerNum != 4
                }
            }

        }
    },
    ctor: function (endInfo) {
        this._super();
        var endoneui = ccs.load("endOne_ruanJiangQianFen.json");
        MjClient.endoneui = this;
        MjClient.endInfo = endInfo;
        BindUiAndLogic(endoneui.node, this.jsBind);
        this.addChild(endoneui.node);

        var _dir = endoneui.node.getChildByName("back").getChildByName("dir");
        _dir.ignoreContentAdaptWithSize(true);
        //时间
        var _back = endoneui.node.getChildByName("back");
        var _time = _back.getChildByName("time");
        _time.visible = true;
        _time.setString(MjClient.roundEndTime);

        return true;
    }
});