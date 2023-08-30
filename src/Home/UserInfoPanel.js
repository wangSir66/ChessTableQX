var CREATEROOM_COLOR_1 = cc.color(237, 101, 1);
var CREATEROOM_COLOR_2 = cc.color(123, 78, 63);

//主界面头像调用 新版~~~
var PlayerInfoBindView1 = cc.Layer.extend({
    pinfo: null,
    jsBind: {
        back: {
            node_info: {
                headImg: {
                    _event: {
                        loadWxHead: function (d) {
                            if (d.uid == MjClient.userInfoLayerUi.pinfo.uid) {
                                var sp = this.getChildByName('headsp');
                                if (sp) {
                                    sp.initWithSpriteFrame(d.img);
                                } else {
                                    sp = new cc.Sprite(d.img);
                                    sp.name = "headsp";
                                    this.addChild(sp);
                                }
                                var _pos = {
                                    "x": this.getContentSize().width / 2,
                                    "y": this.getContentSize().height / 2
                                };
                                sp.setPosition(_pos);
                                sp.setScaleX((this.getContentSize().width - 11) / sp.getContentSize().width);
                                sp.setScaleY((this.getContentSize().height - 13) / sp.getContentSize().height);
                            }
                        }
                    }
                },
            }

        }
    },
    ctor: function (pinfo, canEditSignature, showMoney) {
        this._super();
        this.pinfo = pinfo;
        var userInfoLayerUi = ccs.load(res.UserInfo_json);
        BindUiAndLogic(userInfoLayerUi.node, this.jsBind);
        this.addChild(userInfoLayerUi.node);
        MjClient.userInfoLayerUi = this;

        var that = this;
        var _block = userInfoLayerUi.node.getChildByName("block");
        setWgtLayout(_block, [1, 1], [0.5, 0.5], [0, 0], true);

        var _back = userInfoLayerUi.node.getChildByName("back");
        setWgtLayout(_back, [0.8, 0.8], [0.5, 0.5], [0, 0]);

        COMMON_UI.popDialogAni(_back);

        //关闭 按钮
        var _btnClose = _back.getChildByName("close");
        _btnClose.addTouchEventListener(function (sender, Type) {
            switch (Type) {
                case ccui.Widget.TOUCH_ENDED:
                    that.removeFromParent(true);
                    delete MjClient.userInfoLayerUi;
                    break;
                default:
                    break;
            }
        }, this);
        this._node_info = _back.getChildByName("node_info");

        this.init_info(pinfo, canEditSignature, showMoney);

        return true;
    },
    init_info: function (pinfo, canEditSignature, showMoney) {
        var _node_info = this._node_info;
        //姓名
        var _name = _node_info.getChildByName("name");
        var _nameStr = '昵称:' + unescape(pinfo.nickname);
        _name.setString(getNewName(_nameStr, 12));
        _name.ignoreContentAdaptWithSize(true);
        UIEventBind(null, _name, "changeNickname", function (str) {
            _nameStr = '昵称:' + unescape(str);
            _name.setString(getNewName(_nameStr, 12));
            _name.ignoreContentAdaptWithSize(true);
        });
        //头像
        MjClient.loadWxHead(pinfo.uid, pinfo.headimgurl);
        //账号
        var account = _node_info.getChildByName("account");
        account.setString("账号:" + pinfo.openid.split('_')[0]);
        account.ignoreContentAdaptWithSize(true);
        //ID
        var _ID = _node_info.getChildByName("ID");
        _ID.setString("ID:" + pinfo.uid);
        _ID.ignoreContentAdaptWithSize(true);

        //IP
        var _IP = _node_info.getChildByName("IP");
        _IP.ignoreContentAdaptWithSize(true);
        if (MjClient.remoteCfg.guestLogin) {
            var addressInfo = "地址:";
            var addressVec = JSON.parse(MjClient.native.GetAddress());
            for (var i = 1; i < addressVec.length - 1; i++) {
                addressInfo += addressVec[i];
            }
            _IP.setString(addressInfo);
        }
        else {
            var ipInfo = "";
            if (pinfo.remoteIP) {
                ipInfo = "IP:" + pinfo.remoteIP;
            }
            _IP.setString(ipInfo);
        }

        var _signature = _node_info.getChildByName("signature"),
            _sigStr = (pinfo.signature ? unescape(pinfo.signature) : '主人很懒，还没有签名！');
        let jsjf = _node_info.getChildByName('textFeildName');
        if (jsjf) jsjf.removeFromParent(true);
        canEditSignature = false;
        if (pinfo.uid == SelfUid() && canEditSignature) {
            _signature.visible = false;
            this._textFeildName = new cc.EditBox(cc.size(_signature.width, _signature.height), new cc.Scale9Sprite());
            this._textFeildName.setFontColor(cc.color('#935C23'));
            this._textFeildName.setMaxLength(17 * 3);
            this._textFeildName.setFontSize(20);
            this._textFeildName.setInputFlag(cc.EDITBOX_INPUT_FLAG_INITIAL_CAPS_ALL_CHARACTERS);
            this._textFeildName.setInputMode(cc.EDITBOX_INPUT_MODE_ANY);
            this._textFeildName.setReturnType(cc.KEYBOARD_RETURNTYPE_DONE);
            this._textFeildName.setPlaceHolder("点击输入个性签名");
            this._textFeildName.setPlaceholderFontSize(20);
            this._textFeildName.setPosition(_signature.x, _signature.y);
            _node_info.addChild(this._textFeildName);
            this._textFeildName.name = 'textFeildName';
            this._textFeildName.setString(_sigStr);
            this._textFeildName.setDelegate(this);
        } else {
            _signature.setString(_sigStr);
            _signature.visible = true;
        }

        //修改昵称
        var btn_xgnc = _node_info.getChildByName("btn_changnick");
        btn_xgnc.addTouchEventListener(function (sender, Type) {
            if (Type == ccui.Widget.TOUCH_ENDED) {
                MjClient.Scene.addChild(new ChangeNickName());
            }
        }, this);
        btn_xgnc.visible = true;

        //修改密码
        var btn_xgmm = _node_info.getChildByName("btn_changpwd");
        btn_xgmm.addTouchEventListener(function (sender, Type) {
            if (Type == ccui.Widget.TOUCH_ENDED) {
                MjClient.Scene.addChild(new ChangePWD());
            }
        }, this);
        btn_xgmm.visible = true;

        //换头像
        var btn_htxk = _node_info.getChildByName("btn_changhead");
        btn_htxk.addTouchEventListener(function (sender, Type) {
            if (Type == ccui.Widget.TOUCH_ENDED) {
                MjClient.Scene.addChild(new ChangeHeadView());
            }
        }, this);
        btn_htxk.visible = true;

        //实名认证
        var btnRenzheng = _node_info.getChildByName('btn_changsmrz');
        btnRenzheng.addTouchEventListener(function (sender, type) {
            if (type == 2) {
                MjClient.Scene.addChild(new shiMingRenZhengLayer());
            }
        });

        //道具开关
        var _props = util.localStorageEncrypt.getBoolItem("_InteractiveProps", true);
        var _nodeProps = _node_info.getChildByName("checkBox_tools");
        var _propsText = _nodeProps.getChildByName("Text_1");
        _nodeProps.setSelected(_props);
        selectedCB(_propsText, _props);
        _propsText.addTouchEventListener(function (sender, type) {
            if (type == 2) {
                _nodeProps.setSelected(!_nodeProps.isSelected())
                selectedCB(_propsText, _nodeProps.isSelected());
                util.localStorageEncrypt.setBoolItem("_InteractiveProps", _nodeProps.isSelected());

            }
        });
        _nodeProps.addEventListener(function (sender, type) {
            switch (type) {
                case ccui.CheckBox.EVENT_SELECTED:
                    selectedCB(_propsText, true);
                    util.localStorageEncrypt.setBoolItem("_InteractiveProps", true);
                    var key = "Zhujiemian_Selfinformation_Touxiang_Shiyonghudongdaoju_Xuanzhong";
                    if (MjClient.getAppType() == MjClient.APP_TYPE.QXYZQP ||
                        MjClient.getAppType() == MjClient.APP_TYPE.QXLYQP ||
                        MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP ||
                        MjClient.getAppType() == MjClient.APP_TYPE.BDYZPHZ ||
                        MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG ||
                        MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ ||
                        MjClient.getAppType() == MjClient.APP_TYPE.QXXXGHZ) {
                        key = "Zhujiemian_Gerenzhuye_Hudongdaoju";
                    }
                    MjClient.native.umengEvent4CountWithProperty(key, { uid: SelfUid(), open: 1 });
                    break;
                case ccui.CheckBox.EVENT_UNSELECTED:
                    selectedCB(_propsText, false);
                    util.localStorageEncrypt.setBoolItem("_InteractiveProps", false);
                    var key = "Zhujiemian_Selfinformation_Touxiang_Shiyonghudongdaoju_Quxiaoxuanzhong";
                    if (MjClient.getAppType() == MjClient.APP_TYPE.QXYZQP ||
                        MjClient.getAppType() == MjClient.APP_TYPE.QXLYQP ||
                        MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP ||
                        MjClient.getAppType() == MjClient.APP_TYPE.BDYZPHZ ||
                        MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG ||
                        MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ ||
                        MjClient.getAppType() == MjClient.APP_TYPE.QXXXGHZ) {
                        key = "Zhujiemian_Gerenzhuye_Hudongdaoju";
                    }
                    MjClient.native.umengEvent4CountWithProperty(key, { uid: SelfUid(), open: 0 });
                    break;
            }
        }, _nodeProps);

        function selectedCB(text, isSelected) {
            if (isSelected) {
                text.setTextColor(CREATEROOM_COLOR_1);
            } else {
                text.setTextColor(CREATEROOM_COLOR_2);
            }
        }

        //获得元宝数量
        var _money = _node_info.getChildByName("money");
        if (_money) {
            var _num = _money.getChildByName("num");
            _num.setString(pinfo.money);
            _num.ignoreContentAdaptWithSize(true);
            _money.addTouchEventListener(function (sender, Type) {
                if (Type == ccui.Widget.TOUCH_ENDED) {
                    MjClient.Scene.addChild(enter_store(0));
                }
            }, this);
        }

        var bindWeixin = _node_info.getChildByName("bindWeixin");
        if (bindWeixin) {
            var btnBindWeixin = bindWeixin.getChildByName("btn_bindWeixin");
            var imgBindedWeixin = bindWeixin.getChildByName("img_bindedWeixin");
            // var text_Code = bindWeixin.getChildByName("Image_Code").getChildByName("Text_1");
            var pinfo = MjClient.data.pinfo;
            if (pinfo.openid && pinfo.openid.indexOf("openid") == -1) {
                imgBindedWeixin.setVisible(true);
                btnBindWeixin.setVisible(false);
                // text_Code.ignoreContentAdaptWithSize(true);
                // text_Code.setString(getNewName(pinfo.xianliaoid, 11));
                bindWeixin.getChildByName("Image_Code").visible = false;
            } else {
                imgBindedWeixin.setVisible(false);
                btnBindWeixin.setVisible(true);
            }
            btnBindWeixin.addTouchEventListener(function (sender, type) {
                if (type == 2) {
                    MjClient.native.umengEvent4CountWithProperty("Zhujiemian_Selfinformation_Touxiang_Bangdingweixin", { uid: SelfUid() });
                    MjClient.native.wxLogin("userInfo");
                }
            }, this);
            //register event weChat login call back  注册函数 ，微信登录成功回调
            UIEventBind(null, bindWeixin, "WX_USER_LOGIN", function (para) {
                if (cc.isString(para)) {
                    para = JSON.parse(para);
                }

                if (para.openid) {
                    that.removeFromParent();
                    cc.loader.loadTxt(jsb.fileUtils.getWritablePath() + "nickname.txt",
                        function (er, txt) {
                            if (txt) {
                                para.nickname = escape(txt);
                            }
                            LoginByWeChatAccountUser(para);
                        });
                }
                else {
                    MjClient.showToastDelay("绑定微信失败，请重试");

                }

            });
            // UIEventBind(null, bindWeixin, "WX_USER_LOGIN", function(para) {
            //     if (cc.isString(para))
            //     {
            //         para = JSON.parse(para);
            //     }
            //
            //     if(para.openId)
            //     {
            //         that.removeFromParent();
            //         MjClient.block();
            //         MjClient.gamenet.request("pkplayer.handler.bindWeChat",{xianliaoid:para.openId},function(rtn){
            //             MjClient.unblock();
            //             if(rtn.code==0) {
            //                 MjClient.showToast(rtn.message);
            //             } else {
            //                 if (!cc.isUndefined(rtn.message))
            //                     MjClient.showToast(rtn.message);
            //             }
            //         });
            //     }
            //     else
            //     {
            //         MjClient.showToastDelay("微信绑定失败，请重试");
            //     }
            // });
        }
    },

    editBoxReturn: function (editBox) {
        MjClient.block();
        MjClient.gamenet.request("pkplayer.handler.updateSignature", { signature: escape(editBox.getString()) }, function (rtn) {
            if (rtn.code == 0) {
                MjClient.showToast("更新个性签名成功");
            }
            else {
                if (rtn.message)
                    MjClient.showToast(rtn.message);
                else
                    MjClient.showToast("更新个性签名失败");
            }
            MjClient.unblock();
        });
    }
});

function LoginByWeChatAccountUser(wxInfo) {
    wxInfo.lType = "wx";
    wxInfo.sign = util.md5.hex_md5(wxInfo.unionid + "JTCF@8888");
    startLoginUser(wxInfo);
}

function startLoginUser(mail, code, isLocalGuest) {
    MjClient.block();
    /*
     for test by sking
     */
    if ((cc.sys.OS_WINDOWS == cc.sys.os && !MjClient.remoteCfg.guestLogin) || TestConfig.isDebug) {
        mail = TestConfig.mail;
        code = TestConfig.code;
        //mail = 1509844;
        //code = "7XtIEe9FkwKM";
    }


    cc.log(" loginData code = " + code);
    cc.log(" loginData mail = " + mail);
    var loginData = code ? { mail: mail, code: code } : mail;
    if (!loginData)//新用户
    {
        loginData = {};
    }


    loginData.appVersion = MjClient.native.GetVersionName();
    loginData.resVersion = MjClient.resVersion;
    loginData.app = { appid: AppEnv[MjClient.getAppType()], os: cc.sys.os };
    loginData.remoteIP = MjClient.remoteIP;
    loginData.area = { longitude: MjClient.native.GetLongitudePos(), latitude: MjClient.native.GetLatitudePos() };
    loginData.umid = MjClient.native.umengGetUMID();
    loginData.deviceModel = MjClient.native.getDeviceModel();

    if (isLocalGuest === false) {
        doLoginUser(loginData, isLocalGuest);
    }
    else {
        MjClient.ConnectServer(loginData.openid || loginData.mail, function () {
            doLoginUser(loginData, isLocalGuest);
        });
    }
}

function doLoginUser(loginData, isLocalGuest) {
    MjClient.gamenet.request("pkplayer.handler.bindWeChat", loginData,
        function (rtn) {
            MjClient.unblock();
            if (rtn.message)
                MjClient.showToast(rtn.message);
            else if (rtn.code == 0) {
                MjClient.showToast("绑定微信成功");
            } else {
                MjClient.showToast("绑定微信失败，请重试");
            }

            if (rtn.code == 0) {
                util.localStorageEncrypt.setStringItem("WX_USER_LOGIN", JSON.stringify(loginData));
                util.localStorageEncrypt.setNumberItem("WX_USER_LOGIN_TIME", (new Date().getTime()));
            }
            postEvent("WX_BIND_RESULT", rtn.code == 0);
        }
    );
}

var PlayerInfoBindView = null;
var Switch_userInfo = function () {
    PlayerInfoBindView = PlayerInfoBindView1;
}

Switch_userInfo();


