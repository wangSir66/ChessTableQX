(function () {


    function startLogin(mail, code, isLocalGuest) {
        MjClient.block();

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
            doLogin(loginData, isLocalGuest);
        }
        else {
            MjClient.ConnectServer(loginData.openid || loginData.mail, function () {
                doLogin(loginData, isLocalGuest);
            });
        }
    }

    function doLogin(loginData, isLocalGuest) {
        MjClient.gamenet.request("pkcon.handler.doLogin", loginData,
            function (rtn) {
                cc.log("login  ------------sking " + JSON.stringify(rtn.pinfo));
                var unblock = true;
                if (cc.isUndefined(rtn.result)) {
                    if (isLocalGuest) {
                        unblock = false;
                        getGuestData();
                    }
                    else {
                        MjClient.showMsg("登录失败");
                        postEvent("autoLoginFailed");
                    }
                }
                else if (rtn.result == 0) {
                    try {
                        if (rtn.pinfo.uid) loginData.mail = rtn.pinfo.uid;
                        if (rtn.pinfo.loginCode) loginData.code = rtn.pinfo.loginCode;
                        if (rtn.pinfo.openid) {
                            let ar = rtn.pinfo.openid.split('_')
                            loginData.mobileNum = ar[0];
                            loginData.verifyCode = ar[1];
                        }
                        util.localStorageEncrypt.setStringItem("loginData", JSON.stringify(loginData));
                        util.localStorageEncrypt.setBoolItem("loginData_auto", true);
                    }
                    catch (e) { }
                    MjClient.getSystemConfig(function () {
                        postEvent("loginOK", rtn);
                    }, function () {
                        postEvent("autoLoginFailed");
                    });
                }
                else if (rtn.result == 1001) {
                    if (rtn.message) {
                        MjClient.showMsg(rtn.message);
                    }
                    else {
                        MjClient.showMsg("账号被封，请联系客服");
                    }
                    postEvent("autoLoginFailed");
                }
                else if (rtn.result == 1002) {
                    MjClient.Scene.addChild(new mobilePhoneRegisterLayer(rtn.data));
                } else if (rtn.result == 1003) {
                    MjClient.showToast(rtn.message);
                    // MjClient.Scene.addChild(new mobilePhone_selectRole(rtn.data, LoginByPhoneChildren));
                }

                if (unblock) MjClient.unblock();

            }
        );
    }

    function getGuestData() {
        MjClient.gamenet.request("pkcon.handler.reqGuestID", { app: "zjh" }, function (rtn) {
            if (rtn.result == 0) {
                util.localStorageEncrypt.setStringItem("guestData", JSON.stringify(rtn));
                startLogin(rtn.mail, rtn.code, false);//getGuest
            }
        });
    }
    function LoginByGuestAccount() {
        var guest = util.localStorageEncrypt.getStringItem('guestData');

        if (guest.length > 0) {
            guest = JSON.parse(guest);
            if (guest.mail && guest.code) {
                startLogin(guest.mail, guest.code, true);//guest login
            }
            else {
                startLogin(null, null, true);//guest login
            }
        }
        else {
            startLogin(null, null, true);//guest login
        }
    }
    function LoginByWeChatAccount(wxInfo) {
        wxInfo.lType = "wx";
        wxInfo.sign = util.md5.hex_md5(wxInfo.unionid + "JTCF@8888");
        startLogin(wxInfo);
    }

    function LoginByPhone_0(info) {
        var loginInfo = {};
        loginInfo.mobileNum = info.mobileNum;
        loginInfo.verifyCode = info.verifyCode;
        loginInfo.nickname = info.nickname;
        loginInfo.sex = info.sex;
        loginInfo.headimgurl = info.headimgurl;
        loginInfo.isRegister = info.isRegister;
        startLogin(loginInfo);
    }

    function LoginByXianLiaoAccount(xlInfo) {
        var loginInfo = {};
        loginInfo.lType = "xl";
        loginInfo.xianliaoid = xlInfo.openId;
        loginInfo.nickname = xlInfo.nickName;
        loginInfo.sex = xlInfo.gender;
        loginInfo.headimgurl = xlInfo.smallAvatar;
        startLogin(loginInfo);
    }

    function LoginByDuoLiaoAccount(dlInfo) {
        var loginInfo = {};
        loginInfo.lType = "dl";
        loginInfo.duoliaoid = dlInfo.openId;
        loginInfo.nickname = dlInfo.nickName;
        loginInfo.sex = dlInfo.gender;
        loginInfo.headimgurl = dlInfo.originalAvatar;
        loginInfo.code = dlInfo.code;   // 多聊给的，暂时用不上
        startLogin(loginInfo);
    }

    function LoginByMoWangAccount(mwInfo) {
        var loginInfo = {};
        loginInfo.lType = "mw";
        loginInfo.mowangid = mwInfo.open_id;
        loginInfo.nickname = mwInfo.nick_name;
        loginInfo.sex = mwInfo.gender;
        loginInfo.headimgurl = mwInfo.user_icon;
        startLogin(loginInfo);
    }


    MjClient.autoLogin = function () {
        cc.log("MjClient.autoLogin");
        if (!util.localStorageEncrypt.getBoolItem("_agree_user_protocol", false)) {
            MjClient.showToast("请先阅读并同意用户协议");
            setTimeout(function () {
                postEvent("autoLoginFailed");
            });
            return;
        }

        var WX_USER_LOGIN = util.localStorageEncrypt.getStringItem("WX_USER_LOGIN");
        var XL_USER_LOGIN = util.localStorageEncrypt.getStringItem("XL_USER_LOGIN");
        var DL_USER_LOGIN = util.localStorageEncrypt.getStringItem("DL_USER_LOGIN");
        var MW_USER_LOGIN = util.localStorageEncrypt.getStringItem("MW_USER_LOGIN");

        var loginData = util.localStorageEncrypt.getStringItem("loginData");
        if (WX_USER_LOGIN.length > 0) {
            WX_USER_LOGIN = JSON.parse(WX_USER_LOGIN);
            LoginByWeChatAccount(WX_USER_LOGIN);
        }
        else if (XL_USER_LOGIN.length > 0) {
            XL_USER_LOGIN = JSON.parse(XL_USER_LOGIN);
            LoginByXianLiaoAccount(XL_USER_LOGIN);
        }
        else if (DL_USER_LOGIN.length > 0) {
            DL_USER_LOGIN = JSON.parse(DL_USER_LOGIN);
            LoginByDuoLiaoAccount(DL_USER_LOGIN);
        }
        else if (MW_USER_LOGIN.length > 0) {
            MW_USER_LOGIN = JSON.parse(MW_USER_LOGIN);
            LoginByMoWangAccount(MW_USER_LOGIN);
        }
        else if (loginData.length > 0) {
            var auto = util.localStorageEncrypt.getBoolItem("loginData_auto");
            loginData = JSON.parse(loginData);
            if (auto) startLogin(loginData.mail, loginData.code);
            else
                setTimeout(function () {
                    postEvent("autoLoginFailed");
                });
        }
        else {
            setTimeout(function () {
                postEvent("autoLoginFailed");
            });
        }
    };

    var acceptNode;
    //清除缓存，重新授权登录
    function clearLoginDataCache() {
        var currentTime = new Date().getTime();
        var lastWXUserLoginTime = util.localStorageEncrypt.getNumberItem("WX_USER_LOGIN_TIME", currentTime);
        if (currentTime == lastWXUserLoginTime && !MjClient.remoteCfg.guestLogin && cc.sys.OS_WINDOWS != cc.sys.os) {
            util.localStorageEncrypt.setNumberItem("WX_USER_LOGIN_TIME", currentTime);
        }
    }


    LoginView = cc.Layer.extend({
        ctor: function () {
            this._super();
            var that = this;
            var loginui = ccs.load(res.Login_json);
            this.addChild(loginui.node);
            MjClient.loginui = this;

            /*
                changed by sking
             */
            var _back = loginui.node.getChildByName("back");
            setWgtLayout(_back, [1, 1], [0.5, 0.5], [0, 0], true);

            //竹叶飘
            var starParticle1 = new cc.ParticleSystem("A_Login/particle_texture.plist");
            starParticle1.setPosition(_back.getContentSize().width / 2, _back.getContentSize().height + 20);
            starParticle1.setScale(2);
            starParticle1.setTotalParticles(8);
            _back.addChild(starParticle1);

            var _agree = _back.getChildByName("agree");
            this._agree = _agree;
            acceptNode = _agree;
            acceptNode.setVisible(false);
            _agree.setSelected(util.localStorageEncrypt.getBoolItem("_agree_user_protocol", false))
            setWgtLayout(_agree, [0.08, 0.08], [0.4, 0.11], [0, 0], false, true);

            var logo = _back.getChildByName("load");
            setWgtLayout(logo, [0.2, 0.2], [0, 1], [0, 0], false, true);
            //扫光
            if (logo) {
                var clipper = new cc.ClippingNode();
                var spCache = cc.spriteFrameCache;
                var sten = cc.Sprite(spCache.getSpriteFrame('A_Login/Main/logo.png'));
                var clipper = new cc.ClippingNode();
                var stenSize = logo.getContentSize();
                sten.width = logo.width;
                sten.height = logo.height;
                sten.setPosition(logo.width / 2, logo.height / 2);
                clipper.setContentSize(stenSize);
                clipper.setStencil(sten);
                clipper.setAlphaThreshold(0.5);
                logo.addChild(clipper);
                var sprite1 = new cc.Sprite(spCache.getSpriteFrame('A_Login/Main/saog3.png'));
                sprite1.setBlendFunc(cc.ONE,cc.ONE);
                sprite1.setOpacity(255);
                sprite1.setScale(1.5);
                clipper.addChild(sprite1, 1);
                var repeatAction = cc.repeatForever(cc.sequence(
                    cc.moveTo(0.0, cc.p(-logo.width / 2, logo.height / 2)),
                    cc.moveTo(3, cc.p(logo.width + logo.width, logo.height / 2)),
                    cc.delayTime(0.5)));
                sprite1.runAction(repeatAction); //进行向右移动的重复动作
                var sprite2 = new cc.Sprite(spCache.getSpriteFrame('A_Login/Main/saog3.png'));
                sprite2.setBlendFunc(cc.ONE,cc.ONE);
                sprite2.setOpacity(255);
                sprite2.setScale(1.5);
                clipper.addChild(sprite2, 1);
                var repeatAction2 = cc.repeatForever(cc.sequence(
                    cc.moveTo(0.0, cc.p(logo.width + logo.width / 2, logo.height / 2)),
                    cc.moveTo(3, cc.p(-logo.width, logo.height / 2)),
                    cc.delayTime(0.5)));
                sprite2.runAction(repeatAction2); //进行向右移动的重复动作
            }

            var _legal = _agree.getChildByName("legal");
            this._legal = _legal;

            if (_legal) {
                _agree.x = (_back.width - _agree.scaleX * (_legal.x + _legal.scaleX * _legal.width * (1 - _legal.getAnchorPoint().x) - _agree.width)) / 2;
                _legal.addTouchEventListener(function (sender, Type) {
                    switch (Type) {
                        case ccui.Widget.TOUCH_ENDED:
                            this.addChild(new DlgagreementViewLayer());
                            break;
                        default:
                            break;
                    }
                }, this);
            }

            var bg_mask = _back.getChildByName("bg_mask");
            setWgtLayout(bg_mask, [1, 1], [0.5, 0], [0, 0], false, true);


            var loginBtns = [];

            //手机号登陆
            var _btnPhone = loginui.node.getChildByName("phoneLogin");
            this._btnPhone = _btnPhone;
            if (_btnPhone) {
                _btnPhone.setVisible(false);
                if (MjClient.remoteCfg.phoneLogin)
                    loginBtns.push(_btnPhone);
            }

            //weChat login  微信登录
            var _btnWeChat = loginui.node.getChildByName("wechatLogin");
            this._btnWeChat = _btnWeChat;
            if (_btnWeChat) {
                _btnWeChat.setVisible(false);
                loginBtns.push(_btnWeChat);
            }

            var y = 0.22;

            var sumWidth = 0;
            for (var i = 0; i < loginBtns.length; i++) {
                var btn = loginBtns[i];
                setWgtLayout(btn, [0.18, 0.18], [0.5, y], [0, 0]);
                sumWidth += btn.width * btn.getScaleX();
            }

            var space = 0;
            if (loginBtns.length > 1) {
                if (MjClient.size.width * 0.8 > sumWidth) {
                    space = (MjClient.size.width * 0.8 - sumWidth) / (loginBtns.length - 1);
                    if (space > MjClient.size.width * 0.08)
                        space = MjClient.size.width * 0.08;
                }
                else {
                    space = MjClient.size.width * 0.02;
                }
                sumWidth += space * (loginBtns.length - 1);
            }

            var x = (MjClient.size.width - sumWidth) / 2;
            for (var i = 0; i < loginBtns.length; i++) {
                var btn = loginBtns[i];
                btn.x = x + (btn.width * btn.getScaleX()) / 2;
                x += btn.width * btn.getScaleX() + space;

                btn.addTouchEventListener(function (sender, Type) {
                    if (Type != ccui.Widget.TOUCH_ENDED)
                        return;

                    function func() {
                        util.localStorageEncrypt.setBoolItem("_agree_user_protocol", true);
                        sender.onTouchBack();
                    }

                    if (acceptNode.isSelected()) {
                        func();
                    } else {
                        MjClient.showToast("请先阅读并同意用户协议");
                    }
                }, this);
            }

            if (_btnWeChat) {
                _btnWeChat.onTouchBack = function () {
                    var WX_USER_LOGIN = util.localStorageEncrypt.getStringItem("WX_USER_LOGIN");
                    if (WX_USER_LOGIN.length > 0) {
                        MjClient.autoLogin();
                    } else if (MjClient.native) {
                        MjClient.native.wxLogin();
                    } else {
                        LoginByGuestAccount();
                    }
                }
            }


            if (_btnPhone) {
                _btnPhone.onTouchBack = function () {
                    MjClient.ConnectServer("", function () {
                        that.addChild(new mobilePhoneLoginLayer(LoginByPhone_0));
                    });
                }
            }



            //  一键修复按钮
            var _fixBtn = loginui.node.getChildByName("xiufuBtn");
            this._fixBtn = _fixBtn
            if (_fixBtn) {
                setWgtLayout(_fixBtn, [0.1, 0.1], [0.95, 0.92], [0, 0]);
                _fixBtn.addTouchEventListener(function (sender, Type) {
                    switch (Type) {
                        case ccui.Widget.TOUCH_ENDED:
                            let tm = new Date().getTime() - 120 * 1000;
                            if (tm > gameStartTime) {
                                _fixBtn.setTouchEnabled(false);
                                removeUpdataDirectory();
                            }
                            break;
                        default:
                            break;
                    }
                }, this);
            }

            //register event weChat login call back  注册函数 ，微信登录成功回调
            UIEventBind(this.jsBind, loginui.node, "WX_USER_LOGIN", function (para) {
                if (cc.isString(para)) {
                    para = JSON.parse(para);
                }

                if (para.openid) {
                    cc.loader.loadTxt(jsb.fileUtils.getWritablePath() + "nickname.txt",
                        function (er, txt) {
                            if (txt) {
                                para.nickname = escape(txt);
                            }
                            util.localStorageEncrypt.setStringItem("WX_USER_LOGIN", JSON.stringify(para));
                            util.localStorageEncrypt.setNumberItem("WX_USER_LOGIN_TIME", (new Date().getTime()));
                            LoginByWeChatAccount(para);
                        });
                }
                else {
                    MjClient.showToastDelay("微信登录失败，请重试");

                }

            });

            //register event     guest login call back  ，注册函数，游客登录成功回调
            UIEventBind(this.jsBind, loginui.node, "loginOK", function () {
                if (MjClient.webViewLayer != null) {
                    MjClient.webViewLayer.close();
                }

                if (MjClient.loginui) {
                    MjClient.loginui.removeFromParent(true);
                    delete MjClient.loginui;
                    cc.loader.releaseAll()
                    cc.log("loginOK delete login layer ! --- by sking");
                }
            });


            UIEventBind(this.jsBind, loginui.node, "autoLoginFailed", function () {
                if (acceptNode) {
                    acceptNode.setVisible(true);
                }
                if (_btnWeChat) {
                    _btnWeChat.visible = !MjClient.remoteCfg.guestLogin;
                }
                if (_btnPhone) {
                    _btnPhone.setVisible(!!MjClient.remoteCfg.phoneLogin);
                }
            });

            //version info，版本信息
            var _version = loginui.node.getChildByName("version");
            if (MjClient.isShenhe == true) {
                _version.setVisible(false);
            }
            setWgtLayout(_version, [0.14, 0.14], [0.98, 0.08], [0, 0]);
            var ver = "Ver:" + MjClient.native.GetVersionName() + "(" + MjClient.resVersion + ")";
            _version.setString(ver);
            _version.ignoreContentAdaptWithSize(true);
            _version.setTouchEnabled(true);

            clearLoginDataCache();
            MjClient.autoLogin();
            return true;
        },
        onEnter: function () {
            this._super();
        }
    });

    createLoginView = function () {
        return new LoginView();
    }
})();