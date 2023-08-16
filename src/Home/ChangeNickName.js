var CREATEROOM_COLOR_1 = cc.color(237, 101, 1);
var CREATEROOM_COLOR_2 = cc.color(123, 78, 63);

var ChangeNickName = cc.Layer.extend({
    showHeadNum: null,
    ctor: function () {
        this._super();
        var userInfoLayerUi = ccs.load(res.ChangeNickName_json);
        this.addChild(userInfoLayerUi.node);

        var that = this;
        var _block = userInfoLayerUi.node.getChildByName("block");
        setWgtLayout(_block, [1, 1], [0.5, 0.5], [0, 0], true);

        var _back = userInfoLayerUi.node.getChildByName("back");
        setWgtLayout(_back, [0.5, 0.5], [0.5, 0.5], [0, 0]);

        COMMON_UI.popDialogAni(_back);

        //关闭 按钮
        var _btnClose = _back.getChildByName("close");
        _btnClose.addTouchEventListener(function (sender, Type) {
            switch (Type) {
                case ccui.Widget.TOUCH_ENDED:
                    MjClient.ChangeNickName.removeFromParent(true);
                    delete MjClient.ChangeNickName;
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
                    var nickname = this._nickname.getString();
                    if (nickname == '') {
                        MjClient.showToast("请输入昵称");
                        return;
                    }
                    MjClient.block();
                    MjClient.gamenet.request("pkplayer.handler.updateInfo", { nickname }, function (rtn) {
                        MjClient.unblock();
                        if (rtn.message) MjClient.showToast(rtn.message);
                        if (rtn.code == 0) {
                            MjClient.ChangeNickName.removeFromParent(true);
                            delete MjClient.ChangeNickName;
                            MjClient.data.pinfo.nickname = nickname;
                            postEvent('changeNickname', nickname);
                        }
                    });
                    break;
                default:
                    break;
            }
        }, this);
        this._node_info = _back.getChildByName("content");
        MjClient.ChangeNickName = this;
        //昵称
        var imageNickname = this._node_info.getChildByName("Image_nickname");
        this._nickname = new cc.EditBox(cc.size(imageNickname.width, imageNickname.height), new cc.Scale9Sprite());
        this._nickname.setFontColor(cc.color("#000000"));
        this._nickname.setPlaceholderFontSize(28);
        this._nickname.setPlaceholderFontColor(cc.color("#e4ecf0"));
        this._nickname.setMaxLength(20);
        this._nickname.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this._nickname.setPlaceHolder("请输入昵称");
        this._nickname.setPosition(imageNickname.getContentSize().width / 2, imageNickname.getContentSize().height / 2);
        imageNickname.addChild(this._nickname);
        return true;
    },
});


