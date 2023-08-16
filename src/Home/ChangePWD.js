var CREATEROOM_COLOR_1 = cc.color(237, 101, 1);
var CREATEROOM_COLOR_2 = cc.color(123, 78, 63);

var ChangePWD = cc.Layer.extend({
    ctor: function () {
        this._super();
        var userInfoLayerUi = ccs.load(res.ChangePWD_json);
        this.addChild(userInfoLayerUi.node);
        var _block = userInfoLayerUi.node.getChildByName("block");
        setWgtLayout(_block, [1, 1], [0.5, 0.5], [0, 0], true);

        var _back = userInfoLayerUi.node.getChildByName("back");
        setWgtLayout(_back, [0.6, 0.6], [0.5, 0.5], [0, 0]);

        COMMON_UI.popDialogAni(_back);


        var loginData = util.localStorageEncrypt.getStringItem("loginData") || '';

        //关闭 按钮
        var _btnClose = _back.getChildByName("close");
        _btnClose.addTouchEventListener(function (sender, Type) {
            switch (Type) {
                case ccui.Widget.TOUCH_ENDED:
                    MjClient.ChangePWD.removeFromParent(true);
                    delete MjClient.ChangePWD;
                    break;
                default:
                    break;
            }
        }, this);
        //确认 按钮
        var _btnSure = _back.getChildByName("btn_sure");
        _btnSure.addTouchEventListener(function (sender, Type) {
            switch (Type) {
                case ccui.Widget.TOUCH_ENDED:
                    var _oldPwd = this._oldPwd.getString();
                    var _newPwd = this._newPwd.getString();
                    var _newPwd1 = this._newPwd1.getString();
                    if (_oldPwd == '' || _newPwd == '' || _newPwd1 == '') {
                        MjClient.showToast(_oldPwd == '' ? "旧" : (_newPwd == '' ? '新' : '确认') + "密码不能为空");
                        return;
                    }

                    if (loginData.length > 0) {
                        loginData = JSON.parse(loginData);
                        if (loginData.verifyCode && loginData.verifyCode != _oldPwd) {
                            MjClient.showToast('旧密码不正确');
                            return;
                        }
                    }

                    if (_newPwd1.length < 6 || _newPwd1.length > 20) {
                        MjClient.showToast("新密码长度必须在6~20位之间");
                        return;
                    }

                    if (_newPwd1 !== _newPwd) {
                        MjClient.showToast("两次输入密码不一致");
                        return;
                    }

                    MjClient.block();
                    MjClient.gamenet.request("pkplayer.handler.updateInfo", { newPassword: _newPwd }, function (rtn) {
                        MjClient.unblock();
                        if (rtn.message) MjClient.showToast(rtn.message + ', 请重新登录');
                        if (rtn.code == 0) {
                            MjClient.ChangePWD.removeFromParent(true);
                            delete MjClient.ChangePWD;
                            setTimeout(() => {
                                MjClient.logout();
                                if (MjClient.userInfoLayerUi) {
                                    MjClient.userInfoLayerUi.removeFromParent(true);
                                    delete MjClient.userInfoLayerUi;
                                }
                                if (MjClient.homeSetUi) {
                                    MjClient.homeSetUi.removeFromParent(true);
                                    delete MjClient.homeSetUi;
                                }
                            }, 1000);
                        }
                    });
                    break;
                default:
                    break;
            }
        }, this);
        this._node_info = _back.getChildByName("content");
        MjClient.ChangePWD = this;
        //旧密码
        var image = this._node_info.getChildByName("Image_pwd");
        this._oldPwd = this.getEditItem(image, '请输入旧密码');
        //新密码
        image = this._node_info.getChildByName("Image_pwd_0");
        this._newPwd = this.getEditItem(image, '请输入新密码');
        //确认密码
        image = this._node_info.getChildByName("Image_pwd_1");
        this._newPwd1 = this.getEditItem(image, '确认新密码');
        return true;
    },
    getEditItem: function (node, place = '') {
        let edit = new cc.EditBox(cc.size(node.width, node.height), new cc.Scale9Sprite());
        edit.setFontColor(cc.color("#000000"));
        edit.setPlaceholderFontSize(28);
        edit.setPlaceholderFontColor(cc.color("#e4ecf0"));
        edit.setMaxLength(20);
        edit.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);
        edit.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        edit.setPlaceHolder(place);
        edit.setPosition(node.getContentSize().width / 2, node.getContentSize().height / 2);
        node.addChild(edit);
        return edit;
    }
});


