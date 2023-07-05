/**
 * Created by WuXiaoDong on 2019/8/2.
 */

var mobilePhoneRegisterLayer = cc.Layer.extend({
    _type: 0,
    ctor: function (callback) {
        this._super();
        var UI = ccs.load("registerPhoneNumLayer.json");
        this._rootUI = UI.node;
        this.addChild(this._rootUI);
        var self = this;

        var _block = UI.node.getChildByName("block");
        setWgtLayout(_block, [1, 1], [0.5, 0.5], [0, 0], true);

        var _back = UI.node.getChildByName("back");
        setWgtLayout(_back, [0.7, 0.85], [0.5, 0.5], [0, 0]);

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

        //手机号码输入框
        var imagePhoneNum = this._phoneLoginPanel.getChildByName("Image_phoneNum");
        this._bindPhoneNum = new cc.EditBox(cc.size(imagePhoneNum.width, imagePhoneNum.height), new cc.Scale9Sprite("store/into_number.png"));

        this._bindPhoneNum.setFontColor(cc.color("#ffe28c"));
        this._bindPhoneNum.setPlaceholderFontSize(28);
        this._bindPhoneNum.setPlaceholderFontColor(cc.color("#e4ecf0"));
        this._bindPhoneNum.setMaxLength(11);
        this._bindPhoneNum.setInputMode(cc.EDITBOX_INPUT_MODE_ANY);
        this._bindPhoneNum.setPlaceHolder("请输入账号（字母+数字）");
        this._bindPhoneNum.setPosition(imagePhoneNum.getContentSize().width / 2, imagePhoneNum.getContentSize().height / 2);
        imagePhoneNum.addChild(this._bindPhoneNum);

        //密码
        var imageSecurityCode = this._phoneLoginPanel.getChildByName("Image_securityCode");
        this._hintNum = new cc.EditBox(cc.size(imageSecurityCode.width, imageSecurityCode.height), new cc.Scale9Sprite("store/into_number.png"));

        this._hintNum.setFontColor(cc.color("#ffe28c"));
        this._hintNum.setPlaceholderFontSize(28);
        this._hintNum.setPlaceholderFontColor(cc.color("#e4ecf0"));
        this._hintNum.setMaxLength(20);
        this._hintNum.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);
        this._hintNum.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this._hintNum.setPlaceHolder("请输密码");
        this._hintNum.setPosition(imageSecurityCode.getContentSize().width / 2, imageSecurityCode.getContentSize().height / 2);
        imageSecurityCode.addChild(this._hintNum);

        //昵称
        var imageNickname = this._phoneLoginPanel.getChildByName("Image_nickname");
        this._nickname = new cc.EditBox(cc.size(imageNickname.width, imageNickname.height), new cc.Scale9Sprite("store/into_number.png"));

        this._nickname.setFontColor(cc.color("#ffe28c"));
        this._nickname.setPlaceholderFontSize(28);
        this._nickname.setPlaceholderFontColor(cc.color("#e4ecf0"));
        this._nickname.setMaxLength(20);
        this._nickname.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this._nickname.setPlaceHolder("请输入昵称");
        this._nickname.setPosition(imageNickname.getContentSize().width / 2, imageNickname.getContentSize().height / 2);
        imageNickname.addChild(this._nickname);

        //性别
        this.checkBox_nan = this._phoneLoginPanel.getChildByName("CheckBox_nan");
        this.checkBox_nv = this._phoneLoginPanel.getChildByName("CheckBox_nv");
        this.sex = 1;
        this.checkBox_nan.addTouchEventListener(function (sender, type) {
            if (type == 2) {
                self.sex = 1;
                self.checkBox_nv.setSelected(false);
            }
        }, this);
        this.checkBox_nv.addTouchEventListener(function (sender, type) {
            if (type == 2) {
                self.sex = 2;
                self.checkBox_nan.setSelected(false);
            }
        }, this);

        var btnRegister = this._phoneLoginPanel.getChildByName("btn_register");
        btnRegister.addTouchEventListener(function (sender, type) {
            if (type == 2) {
                var mobileNum = self._bindPhoneNum.getString();
                if (mobileNum.length < 6) {
                    MjClient.showToast("账号长度6位以上");
                    return;
                }
                var regEn = /^[a-zA-Z][a-zA-Z0-9]*$/g;
                if (!regEn.test(mobileNum)) {//不可以有特殊字符
                    MjClient.showToast('账号必须字母+数字组成');
                    return;
                }

                var verifyCode = self._hintNum.getString();
                if (verifyCode == '') {
                    MjClient.showToast("请输入密码");
                    return;
                }


                if (verifyCode.length < 6) {
                    MjClient.showToast("密码长度必须在6~20位之间");
                    return;
                }
                var nickname = self._nickname.getString();
                if (nickname == '') {
                    MjClient.showToast("请输入昵称");
                    return;
                }

                MjClient.mobileNum = mobileNum;
                MjClient.verifyCode = verifyCode;

                var info = {
                    mobileNum: mobileNum,
                    verifyCode: verifyCode,
                    nickname: nickname,
                    sex: self.sex,
                    isRegister: 1,
                }

                if (callback) callback(info);
            }
        }, this);

        return true;
    },
});