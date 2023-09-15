/**
 * Created by Administrator on 2018/6/20.
 */

var mobilePhoneLoginLayer = cc.Layer.extend({
    ctor: function (callback) {
        this._super();

        var UI = ccs.load(res.MobilePhoneLogin_json);
        var self = this;

        var _block = UI.node.getChildByName("block");
        setWgtLayout(_block, [1, 1], [0.5, 0.5], [0, 0], true);

        var _back = UI.node.getChildByName("back");
        setWgtLayout(_back, [0.7, 0.7], [0.5, 0.5], [0, 0]);

        //关闭按钮
        var _close = _back.getChildByName("close");
        _close.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                self.removeFromParent();
                if (this._closeCallback) {
                    this._closeCallback();
                }
            }
        }, this);

        this._phoneLoginPanel = _back.getChildByName("Node_phoneLogin");

        var self = this;

        var loginData = util.localStorageEncrypt.getStringItem("loginData") || '';

        //手机号码输入框
        var imagePhoneNum = this._phoneLoginPanel.getChildByName("Image_phoneNum");
        this._bindPhoneNum0 = new cc.EditBox(cc.size(imagePhoneNum.width, imagePhoneNum.height), new cc.Scale9Sprite());
        this._bindPhoneNum0.setFontColor(cc.color("#000000"));
        this._bindPhoneNum0.setPlaceholderFontSize(28);
        this._bindPhoneNum0.setPlaceholderFontColor(cc.color("#e4ecf0"));
        this._bindPhoneNum0.setMaxLength(11);
        // this._bindPhoneNum0.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);
        this._bindPhoneNum0.setPlaceHolder("请输入账号");
        this._bindPhoneNum0.setPosition(imagePhoneNum.getContentSize().width / 2, imagePhoneNum.getContentSize().height / 2);
        imagePhoneNum.addChild(this._bindPhoneNum0);

        //验证码
        var imageSecurityCode = this._phoneLoginPanel.getChildByName("Image_securityCode");
        this._hintNum0 = new cc.EditBox(cc.size(imageSecurityCode.width, imageSecurityCode.height), new cc.Scale9Sprite());
        this._hintNum0.setFontColor(cc.color("#000000"));
        this._hintNum0.setPlaceholderFontSize(28);
        this._hintNum0.setPlaceholderFontColor(cc.color("#e4ecf0"));
        this._hintNum0.setMaxLength(20);
        this._hintNum0.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);
        // this._hintNum0.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);
        this._hintNum0.setPlaceHolder("请输入密码");
        this._hintNum0.setPosition(imageSecurityCode.getContentSize().width / 2, imageSecurityCode.getContentSize().height / 2);
        imageSecurityCode.addChild(this._hintNum0);


        if (loginData.length > 0) {
            loginData = JSON.parse(loginData);
            if (loginData.mobileNum) {
                this._bindPhoneNum0.setString('' + loginData.mobileNum);
                this._hintNum0.setString('' + loginData.verifyCode);
            }
        }

        var btnSureBind = this._phoneLoginPanel.getChildByName("btn_sureBind");
        btnSureBind.addTouchEventListener(function (sender, type) {
            if (type == 2) {
                var mobileNum = self._bindPhoneNum0.getString();
                if (mobileNum.length < 6) {
                    MjClient.showToast("账号长度6位以上");
                    return;
                }
                var regEn = /^[a-zA-Z][a-zA-Z0-9]*$/g;
                if (!regEn.test(mobileNum)) {//不可以有特殊字符
                    MjClient.showToast('格式错误（字母+数字）');
                    return;
                }

                var verifyCode = self._hintNum0.getString();
                if (verifyCode.length < 6 || verifyCode.length > 20) {
                    MjClient.showToast("请输入正确的密码(6-20位)");
                    return;
                }

                MjClient.mobileNum = mobileNum;
                MjClient.verifyCode = verifyCode;

                var info = {
                    mobileNum: mobileNum,
                    verifyCode: verifyCode,
                    isRegister: 0,
                }

                if (callback) callback(info);
            }
        }, this);


        var btnRegister = this._phoneLoginPanel.getChildByName("btn_register");
        btnRegister.addTouchEventListener(function (sender, type) {
            if (type == 2) {
                self.addChild(new mobilePhoneRegisterLayer(callback));
            }
        }, this);

        COMMON_UI.popDialogAni(_back);
        this.addChild(UI.node);
        return true;
    },

    scheduleUpdateBtn: function () {
        // cc.log("wxd++++++schedule");
        if (this._leftTime > 0) {
            this._btnSend.getTitleRenderer().setString(this._leftTime + "s")
            this._btnSend.getTitleRenderer().setPosition(this._btnSend.width / 2, -this._btnSend.height / 4)
        } else {
            this.unschedule(this.scheduleUpdateBtn);
            this._btnSend.getTitleRenderer().setString("");
            this._btnSend.setBright(true);
            this._btnSend.setTouchEnabled(true);
        }
        this._leftTime--;
    }
});
