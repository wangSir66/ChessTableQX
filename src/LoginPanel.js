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
                cc.log("login  ------------sking " + rtn.result);
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
                        util.localStorageEncrypt.setStringItem("loginData", JSON.stringify(loginData));
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
                    MjClient.Scene.addChild(new mobilePhone_selectRole(rtn.data, LoginByPhoneChildren));
                }

                if (unblock) MjClient.unblock();

            }
        );
    }
    function startMobileLogin(mail, id, isLocalGuest) {
        MjClient.block();

        cc.log(" loginData id = " + id);
        cc.log(" loginData mail = " + mail);
        var loginData = mail;
        if (!loginData)//新用户
        {
            loginData = {};
        }

        loginData.id = id;
        loginData.appVersion = MjClient.native.GetVersionName();
        loginData.resVersion = MjClient.resVersion;
        loginData.app = { appid: AppEnv[MjClient.getAppType()], os: cc.sys.os };
        loginData.remoteIP = MjClient.remoteIP;
        loginData.area = { longitude: MjClient.native.GetLongitudePos(), latitude: MjClient.native.GetLatitudePos() };
        loginData.umid = MjClient.native.umengGetUMID();
        loginData.deviceModel = MjClient.native.getDeviceModel();
        cc.log("==== lms ----loginData ", JSON.stringify(loginData));

        if (isLocalGuest === false) {
            mobileLogin(loginData, isLocalGuest);
        }
        else {
            MjClient.ConnectServer(loginData.openid || loginData.mail, function () {
                mobileLogin(loginData, isLocalGuest);
            });
        }
    }
    function mobileLogin(loginData, isLocalGuest) {
        MjClient.gamenet.request("pkcon.handler.mobileLogin", loginData,
            function (rtn) {
                cc.log(" ===mobileLogin -----  " + rtn.result);
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
                        util.localStorageEncrypt.setStringItem("loginData", JSON.stringify(loginData));
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
                    MjClient.Scene.addChild(new mobilePhone_selectRole(rtn.data, LoginByPhoneChildren));
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
        loginInfo.headimgurl = '';
        loginInfo.isRegister = info.isRegister;
        startLogin(loginInfo);
    }


    function LoginByPhoneChildren(mobileNum, verifyCode, id) {
        var phoneCodeInfo = { mobileNum: mobileNum, verifyCode: verifyCode };
        startMobileLogin(phoneCodeInfo, id);
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
            loginData = JSON.parse(loginData);
            startLogin(loginData.mail, loginData.code);
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
        return;//屏蔽清楚登录缓存信息。
        var time = parseInt((currentTime - lastWXUserLoginTime) / 1000);
        if (time > 30 * 86400 /*&& !util.localStorageEncrypt.getBoolItem("isAgent", false)*/)//大于30天
        {
            util.localStorageEncrypt.removeItem("WX_USER_LOGIN");
            util.localStorageEncrypt.removeItem("XL_USER_LOGIN");
            util.localStorageEncrypt.removeItem("DL_USER_LOGIN");
            util.localStorageEncrypt.removeItem("MW_USER_LOGIN");
            util.localStorageEncrypt.removeItem("loginData");
        }
    }


    LoginView = cc.Layer.extend({
        ctor: function () {
            this._super();
            if (MjClient.isUseUIv3 && MjClient.isUseUIv3())
                var loginui = ccs.load("Login_3.0.json");
            else
                var loginui = ccs.load(res.Login_json);
            this.addChild(loginui.node);
            MjClient.loginui = this;

            /*
                changed by sking
             */
            var _back = loginui.node.getChildByName("back");
            setWgtLayout(_back, [1, 1], [0.5, 0.5], [0, 0], true);

            // 烟花粒子特效
            var yanHuaNode = _back.getChildByName("node_yanhua");
            var particle = new cc.ParticleSystem("Particle/yanhuaya.plist");
            particle.setPosition(yanHuaNode.getContentSize().width / 2, yanHuaNode.getContentSize().height / 2);
            particle.setTotalParticles(2);
            yanHuaNode.addChild(particle);

            //竹叶飘
            var starParticle1 = new cc.ParticleSystem("Particle/particle_texture.plist");
            starParticle1.setPosition(_back.getContentSize().width / 2, _back.getContentSize().height + 20);
            starParticle1.setScale(2);
            starParticle1.setTotalParticles(8);
            _back.addChild(starParticle1);

            var _h = isIPhoneX() ? 0.14 : 0.13;
            var _agree = _back.getChildByName("agree");
            this._agree = _agree;
            acceptNode = _agree;
            acceptNode.setVisible(false);
            _agree.setSelected(util.localStorageEncrypt.getBoolItem("_agree_user_protocol", false))
            setWgtLayout(_agree, [0.05, 0.05], [0, _h], [0, 0], true, true);

            var _legal = _agree.getChildByName("legal");
            var _privacy = _agree.getChildByName("privacy");
            this._legal = _legal;
            this._privacy = _privacy;

            var _logo = _back.getChildByName("load");
            _logo.visible = false;

            if (_privacy)
                _agree.x = (_back.width - _agree.scaleX * (_privacy.x + _privacy.scaleX * _privacy.width * (1 - _privacy.getAnchorPoint().x) - _agree.width)) / 2;
            else if (_legal)
                _agree.x = (_back.width - _agree.scaleX * (_legal.x + _legal.scaleX * _legal.width * (1 - _legal.getAnchorPoint().x) - _agree.width)) / 2;

            _legal.addTouchEventListener(function (sender, Type) {
                switch (Type) {
                    case ccui.Widget.TOUCH_ENDED:
                        var url = "www.baidu.com";
                        if (MjClient.updateCfg) {
                            url = MjClient.updateCfg.userProtocol;
                        }
                        MjClient.openWeb({ url: url, help: false });
                        break;
                    default:
                        break;
                }
            }, this);

            if (_privacy) {
                _privacy.addTouchEventListener(function (sender, Type) {
                    if (Type == ccui.Widget.TOUCH_ENDED) {
                        var url = "www.baidu.com";
                        if (MjClient.updateCfg) {
                            url = MjClient.updateCfg.privacyProtocol;
                        }
                        MjClient.openWeb({
                            url: url,
                            help: false
                        });
                    }
                }, this);
            }

            var _warnText = loginui.node.getChildByName("warn_text");
            setWgtLayout(_warnText, [_warnText.width / 1280, 0], [0.5, 0.002], [0, 0.5], true);
            _warnText.ignoreContentAdaptWithSize(true);
            var bg_mask = _back.getChildByName("bg_mask");
            if (bg_mask) {
                bg_mask.y = 0;
                bg_mask.setScaleY((_agree.y + _agree.height * 0.75) / bg_mask.height);
            }
            var _warnText_0 = _warnText.getChildByName("warn_text_0");
            if (_warnText_0) _warnText_0.ignoreContentAdaptWithSize(true);
            var _warnText_1 = _warnText.getChildByName("warn_text_1");
            if (_warnText_1) _warnText_1.ignoreContentAdaptWithSize(true);


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
                // loginBtns.push(_btnWeChat);
            }


            var _guestLogin = loginui.node.getChildByName("guestLogin");
            this._guestLogin = _guestLogin;
            if (_guestLogin) {
                _guestLogin.visible = false;
                if (MjClient.remoteCfg.guestLogin)
                    loginBtns.push(_guestLogin);
            }

            var y = 0.35;

            var sumWidth = 0;
            for (var i = 0; i < loginBtns.length; i++) {
                var btn = loginBtns[i];
                setWgtLayout(btn, [btn.width / 1280, btn.height / 720], [0.5, y], [0, 0]);
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
                        if (_privacy) {
                            MjClient.Scene.addChild(new LoginLegalDialog(function () {
                                func()
                            }));
                        }
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

            if (_guestLogin) {
                _guestLogin.onTouchBack = function () {
                    LoginByGuestAccount();
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
                if (MjClient.isUseUIv3 && MjClient.isUseUIv3()) {
                    setWgtLayout(_fixBtn, [_fixBtn.width / 1280, _fixBtn.height / 720], [0.054, 0.911], [0, 0]);
                }
                else {
                    setWgtLayout(_fixBtn, [0.13, 0.13], [0.9, 0.89], [0, 0]);
                }
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


            //register event xianliao login call back  注册函数 ，闲聊登录成功回调
            UIEventBind(this.jsBind, loginui.node, "XL_USER_LOGIN", function (para) {
                if (cc.isString(para)) {
                    para = JSON.parse(para);
                }

                if (para.openId) {
                    cc.loader.loadTxt(jsb.fileUtils.getWritablePath() + "nicknameXL.txt",
                        function (er, txt) {
                            if (txt) {
                                para.nickName = escape(txt);
                            }
                            util.localStorageEncrypt.setStringItem("XL_USER_LOGIN", JSON.stringify(para));
                            LoginByXianLiaoAccount(para);
                        });
                }
                else {
                    MjClient.showToastDelay("闲聊登录失败，请重试");
                }

            });

            //register event duoliao login call back  注册函数 ，多聊登录成功回调
            UIEventBind(this.jsBind, loginui.node, "DL_USER_LOGIN", function (para) {
                if (cc.isString(para)) {
                    para = JSON.parse(para);
                }

                if (para.openId) {
                    cc.loader.loadTxt(jsb.fileUtils.getWritablePath() + "nicknameDL.txt",
                        function (er, txt) {
                            if (txt) {
                                para.nickName = escape(txt);
                            }
                            util.localStorageEncrypt.setStringItem("DL_USER_LOGIN", JSON.stringify(para));
                            LoginByDuoLiaoAccount(para);
                        });
                }
                else {
                    MjClient.showToastDelay("多聊登录失败，请重试");
                }

            });

            //register event mowang login call back  注册函数 ，默往登录成功回调
            UIEventBind(this.jsBind, loginui.node, "MOWANG_USER_LOGIN", function (para) {
                if (cc.isString(para)) {
                    para = JSON.parse(para);
                }

                if (para.open_id) {
                    cc.loader.loadTxt(jsb.fileUtils.getWritablePath() + "nicknameMW.txt",
                        function (er, txt) {
                            if (txt) {
                                para.nick_name = escape(txt);
                            }
                            util.localStorageEncrypt.setStringItem("MW_USER_LOGIN", JSON.stringify(para));
                            LoginByMoWangAccount(para);
                        });
                }
                else {
                    MjClient.showToastDelay("默往登录失败，请重试");
                }
            });

            //register event     guest login call back  ，注册函数，游客登录成功回调
            UIEventBind(this.jsBind, loginui.node, "loginOK", function () {
                if (MjClient.webViewLayer != null) {
                    MjClient.webViewLayer.close();
                }

                cc.log("loginOK delete login layer ! --- by sking");
                if (MjClient.loginui) {
                    MjClient.loginui.removeFromParent(true);
                    delete MjClient.loginui;
                }
            });


            UIEventBind(this.jsBind, loginui.node, "autoLoginFailed", function () {
                if (acceptNode) {
                    acceptNode.setVisible(true);
                }
                if (_btnWeChat) {
                    _btnWeChat.visible = false //!MjClient.remoteCfg.guestLogin;
                }
                if (_guestLogin) {
                    _guestLogin.visible = MjClient.remoteCfg.guestLogin;
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
            setWgtLayout(_version, [0.14, 0.14], [0.9, 0.95], [0, 0]);
            var ver = "Ver:" + MjClient.native.GetVersionName() + "(" + MjClient.resVersion + ")";
            _version.setString(ver);
            _version.ignoreContentAdaptWithSize(true);
            _version.setTouchEnabled(true);
            var playTimeInDex = 0;
            var that = this;
            _version.addTouchEventListener(function (sender, type) {
                return;
                if (type == 2) {
                    playTimeInDex++;
                    if (playTimeInDex >= 10) {
                        cc.log("============== playTimeInDex ");
                        playTimeInDex = 0;
                        var _textFeildName = new cc.EditBox(cc.size(556, 45), new cc.Scale9Sprite("game_picture/xiaotanchuan_51.png"));
                        _textFeildName.setFontColor(cc.color(255, 255, 255));
                        _textFeildName.setMaxLength(100);
                        _textFeildName.setInputMode(cc.EDITBOX_INPUT_MODE_ANY);
                        _textFeildName.setPlaceHolder("点击输入ID");
                        //_textFeildName.setPosition(cc.winSize.width * 0.45, cc.winSize.height * 0.65);

                        setWgtLayout(_textFeildName, [0.3, 0.3], [0.45, 0.65], [0, 0]);
                        _back.getParent().addChild(_textFeildName);

                        var _textFeildCode = new cc.EditBox(cc.size(556, 45), new cc.Scale9Sprite("game_picture/xiaotanchuan_51.png"));
                        _textFeildCode.setFontColor(cc.color(255, 255, 255));
                        _textFeildCode.setMaxLength(100);
                        _textFeildCode.setInputMode(cc.EDITBOX_INPUT_MODE_ANY);
                        _textFeildCode.setPlaceHolder("点击输入code");
                        //_textFeildCode.setPosition(cc.winSize.width * 0.45, cc.winSize.height * 0.5);
                        setWgtLayout(_textFeildCode, [0.3, 0.3], [0.45, 0.5], [0, 0]);
                        _back.getParent().addChild(_textFeildCode);

                        var btn = new ccui.Button("game_picture/xiaotanchuan_48.png");
                        //btn.setPosition(cc.winSize.width * 0.85, cc.winSize.height * 0.575);
                        setWgtLayout(btn, [0.15, 0.15], [0.85, 0.575], [0, 0]);

                        btn.addTouchEventListener(function (sender, type) {
                            if (type == 2) {
                                var mail = _textFeildName.getString();
                                var code = _textFeildCode.getString();
                                startLogin(mail, code);
                            }
                        });
                        _back.getParent().addChild(btn);
                    }
                }
            }, this);

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