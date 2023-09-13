var CREATEROOM_COLOR_1 = cc.color(237, 101, 1);
var CREATEROOM_COLOR_2 = cc.color(123, 78, 63);

var ChangeHeadView = cc.Layer.extend({
    showHeadNum: null,
    ctor: function () {
        this._super();
        var userInfoLayerUi = ccs.load(res.ChangeHead_json);
        this.addChild(userInfoLayerUi.node);
        var _block = userInfoLayerUi.node.getChildByName("block");
        setWgtLayout(_block, [1, 1], [0.5, 0.5], [0, 0], true);

        var _back = userInfoLayerUi.node.getChildByName("back");
        setWgtLayout(_back, [0.7, 0.7], [0.5, 0.5], [0, 0]);

        COMMON_UI.popDialogAni(_back);

        //关闭 按钮
        var _btnClose = _back.getChildByName("close");
        _btnClose.addTouchEventListener(function (sender, Type) {
            switch (Type) {
                case ccui.Widget.TOUCH_ENDED:
                    MjClient.changeHeadView.removeFromParent(true);
                    delete MjClient.changeHeadView;
                    break;
                default:
                    break;
            }
        }, this);
        //换一批 按钮
        var _btnOther = _back.getChildByName("getother");
        _btnOther.addTouchEventListener(function (sender, Type) {
            switch (Type) {
                case ccui.Widget.TOUCH_ENDED:
                    this.init_info();
                    break;
                default:
                    break;
            }
        }, this);
        //关闭 按钮
        var _btnSure = _back.getChildByName("btn_sure");
        _btnSure.addTouchEventListener(function (sender, Type) {
            switch (Type) {
                case ccui.Widget.TOUCH_ENDED:
                    if (!this.currSeletPng) return;
                    MjClient.block();
                    MjClient.gamenet.request("pkplayer.handler.updateInfo", {
                        headurl: this.currSeletPng.headurl
                    }, function (rtn) {
                        MjClient.unblock();
                        if (rtn.message) MjClient.showToast(rtn.message);
                        if (rtn.code == 0) {
                            MjClient.changeHeadView.removeFromParent(true);
                            delete MjClient.changeHeadView;
                            MjClient.data.pinfo.headimgurl = rtn.headimgurl;
                            MjClient.loadWxHead(SelfUid(), rtn.headimgurl);
                        }
                    });
                    break;
                default:
                    break;
            }
        }, this);
        this._node_info = _back.getChildByName("content");
        this.showHeadNum = [];
        this.frameItem = [];
        this.init_info();
        MjClient.changeHeadView = this;
        this.currSeletPng = null;
        return true;
    },
    getRandNum: function () {
        let arr = [];
        while (arr.length < 21) {
            let num = util.getRandom(100, 500);
            if (this.showHeadNum.indexOf(num) < 0) {
                arr.push(num);
                this.showHeadNum.push(num);
            }
            if (this.showHeadNum.length == 400) {
                this.showHeadNum = [];
                break;
            }
        }
        return arr;
    },
    init_info: function () {
        let arr = this.getRandNum(),
            constW = 87,
            w = this._node_info.width,
            cNum = Math.floor(w / constW),
            h = this._node_info.height,
            yNum = Math.floor(h / constW);
        var prefix = "A_Common/HeadImgs/head_";
        var fc = cc.spriteFrameCache,
            spacex = (w - (cNum * constW)) / (cNum + 1),
            spacey = (h - (yNum * constW)) / (yNum + 1);
        for (var i = 0; i < arr.length; i++) {
            var name = prefix + arr[i] + ".jpg";
            var f = fc.getSpriteFrame(name),
                item = this.frameItem[i];
            if (f) {
                cc.log(name)
                if (item) {
                    item.initWithSpriteFrame(f);
                    item.headurl = name;
                } else {
                    let _sprite = cc.Sprite();
                    _sprite.initWithSpriteFrame(f);
                    _sprite.setPosition(43.5 + (i % cNum) * (constW + spacex) + spacex, h - 43.5 - Math.floor((i / cNum)) * (constW + spacey) - spacey)
                    _sprite.setScale(this._node_info.getScale());
                    this._node_info.addChild(_sprite);
                    this.frameItem.push(_sprite);
                    cc.eventManager.addListener(cc.EventListener.create(this.touchListener_Sprite_touxiang_pic(_sprite)), _sprite);
                    _sprite.headurl = name;
                }
            }
        }
    },
    isTouchMe: function (target, touch, event, rect) {
        var locationInNode = target.convertToNodeSpace(touch.getLocation());
        var s = target.getContentSize();
        var rect = rect || cc.rect(0, 0, s.width, s.height);
        if (cc.rectContainsPoint(rect, locationInNode)) {
            return true;
        }
        return false;
    },
    touchListener_Sprite_touxiang_pic: function (_sprite) {
        return {
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                if (this.isTouchMe(_sprite, touch, event)) {
                    var target = event.getCurrentTarget()
                    target.setColor(cc.color(100, 100, 100))
                    if (reallyPlayEffect)
                        reallyPlayEffect("sound/button_click.mp3", false);
                    else
                        cc.audioEngine.playEffect("sound/button_click.mp3", false);

                    return true;//必须 return true
                } else return false
            }.bind(this),
            onTouchMoved: function (touch, event) {         // 触摸移动时触发
                // 获取事件所绑定的 target,这个target 就是down
            },
            onTouchEnded: function (touch, event) {
                if (this.currSeletPng) this.currSeletPng.setColor(cc.color(255, 255, 255));
                this.currSeletPng = event.getCurrentTarget();
            }.bind(this)
        }
    }
});