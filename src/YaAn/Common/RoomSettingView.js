var RoomSettingView = cc.Layer.extend({
    jsBind: {
        _event: {
            roundEnd: function () {
                if (cc.sys.isObjectValid(MjClient.setui)) {
                    MjClient.setui.removeFromParent(true);
                    delete MjClient.setui;
                }
            },
        },
        block: {
            _layout: [[1, 1], [0.5, 0.5], [0, 0], true]
        },
        back:
        {

            _run: function () {
                setWgtLayout(this, [0.7, 0.7], [0.5, 0.5], [0, 0]);
            },
            close: {
                _click: function () {
                    if (MjClient.playui || MjClient.goldMatchingui) {
                        MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Shezhi_Close", { uid: SelfUid() });
                    }
                    else
                        MjClient.native.umengEvent4CountWithProperty("Zhujiemian_Shezhi_Close", { uid: SelfUid() });
                    if (MjClient.setui) {
                        MjClient.setui.removeFromParent(true);
                        MjClient.setui = null;
                    }
                }
            },
            delBtn: {
                _click: function () {
                    if (!IsRoomCreator() &&
                        (MjClient.data.sData.tData.tState == TableState.waitJoin || MjClient.data.sData.tData.tState == TableState.waitReady)) {
                        MjClient.showMsg("确定要退出房间吗？",
                            function () {
                                MjClient.leaveGame();
                                if (MjClient.setui) {
                                    MjClient.setui.removeFromParent(true);
                                    MjClient.setui = null;
                                }
                            },
                            function () { });
                    }
                    else {
                        MjClient.showMsg("是否解散房间？", function () {
                            MjClient.delRoom(true);
                            if (MjClient.setui) {
                                MjClient.setui.removeFromParent(true);
                                MjClient.setui = null;
                            }
                            MjClient.delRoomTime = new Date().getTime();//记录点击申请解散房间按钮的时间
                        }, function () { }, 1);
                    }
                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Shezhi_Jiesanfangjian", { uid: SelfUid() });
                }
            },
            btn_openPosition: {
                _visible: false,
                _click: function () {
                    MjClient.native.openSystemSetting();
                }
            },
            btn_openImpower: {
                _visible: false,
                _click: function () {
                    MjClient.native.openSelfAppSetting();
                }
            },
            Text_ver:
            {
                _visible: true,
                _run: function () {
                    this.ignoreContentAdaptWithSize(true);

                    if ((MjClient.APP_TYPE.QXYYQP == MjClient.getAppType() || MjClient.getAppType() == MjClient.APP_TYPE.HUBEIMJ || MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ) &&
                        MjClient.gameType != MjClient.GAME_TYPE.YUE_YANG_NIU_SHI_BIE && MjClient.gameType != MjClient.GAME_TYPE.DA_YE_510K &&
                        MjClient.gameType != MjClient.GAME_TYPE.QI_CHUN_DA_GONG && MjClient.gameType != MjClient.GAME_TYPE.QIAN_JIANG_QIAN_FEN &&
                        MjClient.gameType != MjClient.GAME_TYPE.ZHU_ZHOU_DA_MA_ZI && MjClient.gameType != MjClient.GAME_TYPE.CHONG_YANG_DA_GUN &&
                        MjClient.gameType != MjClient.GAME_TYPE.DA_YE_DA_GONG && MjClient.gameType != MjClient.GAME_TYPE.TONG_SHAN_DA_GONG)
                        this.visible = false;

                    if (MjClient.isShenhe == true) {
                        this.setVisible(false);
                    }
                    this.setPositionY(this.getPositionY() + (this.getContentSize().height * 1.6));
                    //  一键修复按钮
                    var _fixBtn = new ccui.Button();
                    _fixBtn.loadTextureNormal("game_picture/yijianxiufu.png");
                    _fixBtn.loadTexturePressed("game_picture/yijianxiufu_p.png");
                    _fixBtn.addTouchEventListener(function (sender, Type) {
                        switch (Type) {
                            case ccui.Widget.TOUCH_ENDED:
                                removeUpdataDirectory();
                                if (MjClient.playui || MjClient.goldMatchingui) {
                                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Shezhi_Yijianxiufu", { uid: SelfUid() });
                                } else {
                                    MjClient.native.umengEvent4CountWithProperty("Zhujiemian_Shezhi_Yijianxiufu", { uid: SelfUid() });
                                }
                                break;
                            default:
                                break;
                        }
                    });
                    _fixBtn.setPosition(this.getContentSize().width * 0.4, -this.getContentSize().height * 2 / 3);
                    _fixBtn.setScale(0.7);
                    this.addChild(_fixBtn);
                },
                _text: function () {
                    return "Ver:" + MjClient.native.GetVersionName() + "(" + MjClient.resVersion + ")";
                }
            },
            Slider_effect: {
                _run: function () { this.setPercent(getEffectsVolume() * 100); },
                _slider: function (sdr, tp) {
                    if (MjClient.playui || MjClient.goldMatchingui)
                        ;
                    else
                        MjClient.native.umengEvent4CountWithProperty("Zhujiemian_Shezhi_Yinxiao_Yinxiaohuadongtiao", { uid: SelfUid() });
                    const num = this.getPercent() / 100;
                    setEffectsVolume(num);
                    MjClient.setui.noEffect.setSelected(false);
                    MjClient.setui.noEffect.getChildByName("Image_left").setVisible(false);
                    MjClient.setui.noEffect.getChildByName("Image_right").setVisible(true);
                }
            },
            Slider_music: {
                _run: function () { this.setPercent(setMusicVolume(-1) * 100); },
                _slider: function (sdr, tp) {
                    if (MjClient.playui || MjClient.goldMatchingui)
                        ;
                    else
                        MjClient.native.umengEvent4CountWithProperty("Zhujiemian_Shezhi_Yinxiao_Yinxiaohuadongtiao", { uid: SelfUid() });
                    setMusicVolume(this.getPercent() / 100);
                    MjClient.setui.noMusic.setSelected(false);
                    MjClient.setui.noMusic.getChildByName("Image_left").setVisible(false);
                    MjClient.setui.noMusic.getChildByName("Image_right").setVisible(true);
                }
            },
        }


    },
    ctor: function () {
        this._super();

        var jsonFile = "setting_yaan.json";
        var setui = ccs.load(jsonFile);
        BindUiAndLogic(setui.node, this.jsBind);
        this.addChild(setui.node);
        this.spNode = setui.node
        var _back = setui.node.getChildByName("back");
        this.noEffect = _back.getChildByName("noEffect");
        this.noMusic = _back.getChildByName("noMusic");
        this.Slider_effect = _back.getChildByName("Slider_effect");
        this.Slider_music = _back.getChildByName("Slider_music");

        this.noEffect.setSelected(util.localStorageEncrypt.getNumberItem("oldEffectVolume", -1) != -1);
        this.noMusic.setSelected(util.localStorageEncrypt.getNumberItem("oldMusicVolume", -1) != -1);

        this.noEffect.addEventListener(function (sender, type) {
            if (MjClient.playui || MjClient.goldMatchingui)
                ;
            else
                MjClient.native.umengEvent4CountWithProperty("Zhujiemian_Shezhi_Yinxiao_Yinxiaokaiguan", { uid: SelfUid() });
            switch (type) {
                case ccui.CheckBox.EVENT_SELECTED:
                    util.localStorageEncrypt.setNumberItem("oldEffectVolume", this.Slider_effect.getPercent() / 100);
                    this.noEffect.setSelected(true);
                    this.Slider_effect.setPercent(0);
                    setEffectsVolume(0);
                    this.noEffect.getChildByName("Image_left").setVisible(true);
                    this.noEffect.getChildByName("Image_right").setVisible(false);
                    break;
                case ccui.CheckBox.EVENT_UNSELECTED:
                    this.noEffect.setSelected(false);
                    var v = util.localStorageEncrypt.getNumberItem("oldEffectVolume", 0);
                    this.Slider_effect.setPercent(v * 100);
                    setEffectsVolume(v);
                    util.localStorageEncrypt.setNumberItem("oldEffectVolume", -1);
                    this.noEffect.getChildByName("Image_left").setVisible(false);
                    this.noEffect.getChildByName("Image_right").setVisible(true);
                    break;
            }
        }, this);

        this.noMusic.addEventListener(function (sender, type) {
            if (MjClient.playui || MjClient.goldMatchingui)
                ;
            else
                MjClient.native.umengEvent4CountWithProperty("Zhujiemian_Shezhi_Yinyue_Yinyuekaiguan", { uid: SelfUid() });
            switch (type) {
                case ccui.CheckBox.EVENT_SELECTED:
                    util.localStorageEncrypt.setNumberItem("oldMusicVolume", this.Slider_music.getPercent() / 100);
                    this.noMusic.setSelected(true);
                    this.Slider_music.setPercent(0);
                    setMusicVolume(0);
                    this.noMusic.getChildByName("Image_left").setVisible(true);
                    this.noMusic.getChildByName("Image_right").setVisible(false);
                    break;
                case ccui.CheckBox.EVENT_UNSELECTED:
                    this.noMusic.setSelected(false);
                    var v = util.localStorageEncrypt.getNumberItem("oldMusicVolume", 0);
                    this.Slider_music.setPercent(v * 100);
                    setMusicVolume(v);
                    util.localStorageEncrypt.setNumberItem("oldMusicVolume", -1);
                    this.noMusic.getChildByName("Image_left").setVisible(false);
                    this.noMusic.getChildByName("Image_right").setVisible(true);
                    break;
            }
        }, this);

        MjClient.setui = this;
        return true;
    },
});