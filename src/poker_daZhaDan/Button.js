/**********************************************
 * 自定义按钮
 **********************************************/

var ui = ui || {};

ui.Button = ccui.Button.extend({
    _callback: null,        // 按钮回调
    _target: null,          // 按钮回调对象
    _isTouch: null,
    _isDelay : false,    //是否在延迟中
    _delayTime : 0,   //延迟时间

    /**
     *
     * @param {String} normalImage
     * @param {String} [selectedImage=""]
     * @param {String} [disableImage=""]
     *
     * @example
     * // example
     * var uiButton = new ui.Button("imgSrc");
     */
    ctor: function (normalImg, selectedImage, disableImage, type) {
        this._isTouch = true;
        selectedImage = selectedImage || "";
        disableImage = disableImage || "";
        if (!!normalImg && type == undefined) {
            this._super(normalImg, selectedImage, disableImage, ccui.Widget.PLIST_TEXTURE);
        } else {
            this._super(normalImg, selectedImage, disableImage, type);
        }
        this._soundIndex = 1;
        this.addTouchEventListener(this._handleClickEvent, this);

        // this.setTitleFontName("");
    },

    addClickEvent: function (callback, target) {
        this._callback = callback;
        this._target = target;
    },

    _handleClickEvent: function (sender, eventType) {
        if (this._isTouch) {
            if (eventType == ccui.Widget.TOUCH_BEGAN) {
                // if(this._soundIndex > 0)
                    // Sound.playEffect(this._soundIndex);
            }

            if (eventType == ccui.Widget.TOUCH_ENDED) {
                if(this._isDelay){
                    return;
                }else{
                    this._isDelay = true;
                    if(this._delayTime != 0 ){
                        this.scheduleOnce(function () {
                            this._isDelay = false;
                        },this._delayTime);
                    }else{
                        this._isDelay = false;
                    }
                }

                if (cc.isFunction(this._callback) && !!this._target) {
                    this._callback.apply(this._target, [sender, eventType]);
                }
            }
        }
    },
    setClickEffect : function(index){
        this._soundIndex =  index;
    },

    /**
     * 设置点击间隔时间 单位秒 0 表示没有间隔
     * @param secend 秒
     */
    setDelayTime : function (second) {
        this._delayTime = second;
    },

    setIsTouchEnable: function (isTouch) {
        this._isTouch = isTouch;
    },

    /**
     * 设置按钮指定样式的文本
     * @param text 文本
     * @param styleNo 样式
     * @param [fontSize] 字体大小
     * @param [enableOutline] 使用描边
     * @returns {ccui.Text}
     */
    setBtnTitleText: function (text, styleNo, fontSize, enableOutline, lineColor) {
        this.setTitleText(text);
        var obj = ui.helper.getFontObj(styleNo);
        this.setTitleColor(obj.color);
        this.setTitleFontSize(fontSize ? fontSize : obj.fontSize);
        if (enableOutline) {
            var outlineColor = lineColor || cc.color(28, 6, 6);
            this.getTitleRenderer().enableStroke(outlineColor, 2);
        }
    },

    /**
     * 设置换行
     * @param {cc.Size|Number} dim dimensions or width of dimensions
     * @param {Number} [height] height of dimensions
     */
    setDimensions: function (dim, height) {
        var width;
        if (height === undefined) {
            width = dim.width;
            height = dim.height;
        } else{
            width = dim;
        }

        var text = this.getTitleRenderer();
        text.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        text.setDimensions(width,height);
    },

    setScale9Size: function (size, height) {
        var w = height === undefined ? size.width : size;
        var h = height === undefined ? size.height : height;
        var tmpSize = this.getContentSize();
        //this.setCapInsets(cc.rect(tmpSize.width*0.5-2, 0, 2, tmpSize.height));
        this.setCapInsets(cc.rect(tmpSize.width * 0.5 - 2, tmpSize.height * 0.5 + 1, 2, 2));
        this.setScale9Enabled(true);
        this.setContentSize(w, h);
    },
    _redNumTxt: null,
    _redPoint: null,
    setRedPointNum: function (num, offX, offY) {
        var isVis = num > 0 ? true : false;
        offX = offX || 0;
        offY = offY || 0;
        if (isVis && !this._redNumTxt) {
            var newMail = new ccui.ImageView("ui/mainInterface/48.png", ccui.Widget.PLIST_TEXTURE);
            newMail.setPosition(this.width + offX, this.height + offX);
            this.addChild(newMail, 20);
            var newMailText = new ui.helper.createText(num, 3, 14, false);
            newMailText.setPosition(newMail.x, newMail.y);
            this.addChild(newMailText, 20);
            this._redPoint = newMail;
            this._redNumTxt = newMailText;
        }
        this._redPoint && this._redPoint.setVisible(isVis);
        this._redNumTxt && this._redNumTxt.setString(num);
        this._redNumTxt && this._redNumTxt.setVisible(isVis);
    }

});

ui.AreaButton = ccui.Widget.extend({

    _touchSp: null,
    _normalImg: null,
    _selectedImage: null,
    _type: null,
    /**
     * 可设置点击区域按钮
     * @param ｛String｝normalImg
     * @param {String} [selectedImage]
     */
    ctor: function (normalImg, selectedImage) {
        this._super();

        this._normalImg = normalImg;
        this._selectedImage = selectedImage === undefined ? normalImg : selectedImage;

        var sp = new cc.Sprite(this._normalImg);
        sp.setAnchorPoint(0.5, 0.5);
        sp.x = sp.width * 0.5;
        sp.y = sp.height * 0.5;
        this.addChild(sp);
        this._touchSp = sp;
        this.setContentSize(sp.getContentSize());

        this.setTouchEnabled(true);
        this.addTouchEventListener(this._touchHandler, this);
    },

    setTouchArea: function (width, height) {
        this.setContentSize(width, height);
        this._touchSp.x = this.width * 0.5;
        this._touchSp.y = this.height * 0.5;
    },

    _touchHandler: function (sender, type) {
        if (type === ccui.Widget.TOUCH_BEGAN) {
            // Sound.playEffect(1);
            var str = this._selectedImage;
            if (this._selectedImage.charAt(0) == "#") {
                str = this._selectedImage.slice(1);
            }
            this._touchSp.setSpriteFrame(str);
        } else if (type === ccui.Widget.TOUCH_ENDED) {
            var str = this._normalImg;
            if (this._normalImg.charAt(0) == "#") {
                str = this._normalImg.slice(1);
            }
            this._touchSp.setSpriteFrame(str);
            if (this._callback) {
                this._callback.apply(this._target, [sender]);
            }
        }
    },

    addClickEvent: function (callback, target) {
        this._callback = callback;
        this._target = target;
    }
});