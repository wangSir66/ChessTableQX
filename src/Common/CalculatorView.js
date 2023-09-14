// 输入数据
var Common_CalculatorView = cc.Layer.extend({
    ctor: function (inputType, placeTxt, sendData, callFunc) {
        this._super();
        this.inputType = inputType || 0;//0输入 1加 2减
        this.placeTxt = placeTxt;//提示文字
        this.callBack = callFunc;
        this.sendData = sendData;
        var node = ccs.load(res.Calculator_json).node;
        this.addChild(node);

        var _block = node.getChildByName("block");
        setWgtLayout(_block, [1, 1], [0.5, 0.5], [0, 0], 2);

        var _back = node.getChildByName("back");
        setWgtLayout(_back, [0.8, 0.8], [0.5, 0.5], [0, 0]);

        var _btnClose = _back.getChildByName("close");
        _btnClose.addTouchEventListener(function (sender, Type) {
            switch (Type) {
                case ccui.Widget.TOUCH_ENDED:
                    this.removeFromParent();
                    break;
                default:
                    break;
            }
        }, this);

        //数字按键
        var _num = _back.getChildByName("num");
        function numBtnTouchEvent(sender, Type) {
            if (Type == ccui.Widget.TOUCH_ENDED) {
                var itag = sender.getTag();
                this.InputRoomNumber(itag);
            }
        }
        for (var i = 0; i <= 9; i++) {
            var _btnNum = _num.getChildByName("Button_" + i);
            _btnNum.setTag(i);
            _btnNum.addTouchEventListener(numBtnTouchEvent, this);
        }

        //点
        var _clear = _num.getChildByName("clear");
        _clear.addTouchEventListener(function (sender, Type) {
            switch (Type) {
                case ccui.Widget.TOUCH_ENDED:
                    this.InputRoomNumber('.');
                    break;
                default:
                    break;
            }
        }, this);

        //确定
        var btnsure = _num.getChildByName("btnsure");
        btnsure.addTouchEventListener(function (sender, Type) {
            switch (Type) {
                case ccui.Widget.TOUCH_ENDED:
                    let str = this._bindNum.getString();
                    if (this.inputType == 2) str = '-' + str;
                    if (this.callBack) this.callBack(str, this.sendData);
                    this.removeFromParent();
                    break;
                default:
                    break;
            }
        }, this);

        //删除
        var topN = _back.getChildByName('top');
        var _del = topN.getChildByName("del");
        _del.addTouchEventListener(function (sender, Type) {
            switch (Type) {
                case ccui.Widget.TOUCH_ENDED:
                    MjClient.native.umengEvent4CountWithProperty("Zhujiemian_Jiarufangjian_Shanchu", { uid: SelfUid() });
                    this.InputRoomNumber(-1);;
                    break;
                default:
                    break;
            }
        }, this);
        //手机号码输入框
        var imageNum = topN.getChildByName("num_bg");
        this._bindNum = new cc.EditBox(cc.size(imageNum.width - 10, imageNum.height - 5), new cc.Scale9Sprite());
        this._bindNum.setFontColor(cc.color("#1c1c1c"));
        this._bindNum.setPlaceholderFontSize(26);
        this._bindNum.setPlaceholderFontColor(cc.color("#e4ecf0"));
        this._bindNum.setMaxLength(6);
        this._bindNum.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);
        this._bindNum.setPlaceHolder("   " + (this.placeTxt || '请输入'));
        this._bindNum.setPosition(imageNum.getContentSize().width / 2, imageNum.getContentSize().height / 2);
        this._bindNum.setEnabled(false);
        imageNum.addChild(this._bindNum);
    },
    InputRoomNumber: function (n) {
        var change = true, str = this._bindNum.getString();
        if (n == '.' && (str.length == 0 || str.indexOf('.') != -1)) {
            MjClient.showToast("输入错误！");
            return;
        }
        if (n >= 0 || n == '.') str += n;
        else if (n == -1 && str.length > 0) str = str.slice(0, -1);
        else if (n == -2 && str.length > 0) str = "";
        else change = false;
        if (change) this._bindNum.setString(str);
    },
    onExit: function () {
        this._super();
    },
});