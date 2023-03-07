var daTongZi = daTongZi || {};

daTongZi.CardStatus = {
    UNHOOD : 1, //翻开状态
    HOOD:2, //盖住状态
    GRAY:3,  //灰色不可用状态
    MARK:4, //标记状态
};

daTongZi.CARD_TYPE = {
    noType: -1,     // 无牌型
    danZhang: 0,    // 单张
    duiZi: 1,       // 对子
    lianDui: 2,     // 连对
    sanZhang: 3,    // 三张
    feiJi: 4,       // 飞机
    zhaDan: 5,      // 炸弹
    tongZi: 6,      // 筒子
    diZha: 7,       // 地炸
    xi: 8           // 喜
};

/**
 * 出牌信息
 */
daTongZi.ChuInfo = function () {
    /**
     * 出牌的位置
     * @type {number}
     */
    this.pos = 0;
    /**
     * 牌型
     * @type {number}
     */
    this.paixing = daTongZi.PaiXing.NO;

    /**
     * 牌列表
     * @type Array.<game.pdk.CardInfo>
     */
    this.cardList = [];
};

daTongZi.CardInfo = function () {
    /**
     * 牌值
     * @type {number}
     */
    this.type = 0;
};

daTongZi.Card = ccui.Widget.extend({
    /**
     * @type {game.pdk.CardInfo};
     */
    _info : null,   //牌信息
    _isCanChu : false,  //是否要出
    _grayBg : null, //灰色不可用状态
    _redBg : null,  //红色筒子状态
    isSpclType : false, //是否是特殊牌型
    lock: false,
    front: true,
    box: null,  //正面
    backBox: null,  //背面
    isCanRotate: true,
    status : 0, //状态
    isSelected: false,  //是否是选中状态
    isMark : false, //是否是标记状态
    row : 0,  //第几行
    rowGap : 85,   //行间距
    _cardPath : "daTongZi/cards/",
    ctor : function (info) {
        this._super();
        this._info = info;

        this._initUI();
    },

    _initUI : function () {
        this.front = true;
        this.lock = false;

        // 卡牌正面
        var box = new cc.Sprite(this._cardPath + this._info.type +".png");
        this.box = box;
        this.addChild(box);
        this.setContentSize(box.getContentSize());
        box.x = this.width / 2;
        box.y = this.height / 2;

        // 卡牌背面
        var backBox = new cc.Sprite(this._cardPath + "bg.png");
        backBox.setAnchorPoint(0.5,0.5);
        backBox.x = backBox.width / 2;
        backBox.y = backBox.height / 2;
        backBox.setVisible(false);
        this.backBox = backBox;
        this.addChild(backBox);

        var bg = new cc.Sprite(this._cardPath + "redMask.png");
        bg.setAnchorPoint(0.5,0.5);
        bg.x = bg.width * 0.5;
        bg.y = bg.height * 0.5;
        this.addChild(bg);
        this._redBg = bg;
        this._redBg.visible = false;

        var bg = new cc.Sprite(this._cardPath + "grayMask.png");
        bg.setAnchorPoint(0.5,0.5);
        bg.x = bg.width * 0.5;
        bg.y = bg.height * 0.5;
        this.addChild(bg);
        this._grayBg = bg;
        this._grayBg.visible = false;

        // this.setAnchorPoint(0.5,0.5);
    },

    setChangeType : function (type) {
        this._changeType = type;
    },

    getChangeType : function () {
        return this._changeType;
    },

    doChuPai : function () {
        if(!dal.room.isKing(this._type)){
            dal.room.sendChu(this._type);
        }else{
            ui.SystemMessage.show(LANG("desktop_chu_king_tips"));
        }
    },

    /**
     * 重置位置
     */
    resetPosition : function () {
        this.y = this.row * this.rowGap;
        this._isCanChu = false;
    },

    setType : function (type) {
        this._type = type;
    },

    //特殊牌型的牌
    isSpcl : function(flg, isDiZha){
        this.isSpclType = flg;
        this._redBg.visible = this.isSpclType && this.status != daTongZi.CardStatus.HOOD;
         var spFrame = new cc.SpriteFrame(this._cardPath + "redMask.png", cc.rect(0, 0,112,151));
         // var spFrame = "redMask.png";
        if(isDiZha){
            spFrame = new cc.SpriteFrame(this._cardPath + "orange.png", cc.rect(0, 0,112,151));
         // spFrame = "orange.png";
        }
        this._redBg.setSpriteFrame(spFrame);
    },

    checkShowSpcl : function(){
        this._redBg.visible = this.isSpclType && this.status != daTongZi.CardStatus.HOOD;
    },

    /**
     * 设置牌的状态
     * @param status
     */
    setStatus : function (status) {
        cc.log("setstatus:", status);
        this.status = status;
        switch (status) {
            case daTongZi.CardStatus.HOOD:
                this.backBox.visible = true;
                this._grayBg.visible = false;
                this.box.visible = false;
                this.front = false;
                break;
            case daTongZi.CardStatus.UNHOOD:
                this.box.visible = true;
                this.backBox.visible = false;
                this._grayBg.visible = false;
                this.front = true;
                break;
            case daTongZi.CardStatus.GRAY:
                this._grayBg.visible = true;
                this.box.visible = true;
                this.backBox.visible = false;
                this.front = true;
                break;
            case daTongZi.CardStatus.MARK:
                this._grayBg.visible = true;
                this.box.visible = true;
                this.backBox.visible = false;
                this.front = true;
                break;
        }

        // this.setContentSize(this._bg.getContentSize());

        if(this._info.isKing){
            this.setKing(true);
        }else{
            this.setKing(false);
        }
    },

    /**
     * 牌信息
     * @return {game.pdk.CardInfo}
     */
    getInfo : function () {
        return this._info;
    },

    /**
     * 出牌
     */
    doSend : function () {

    },

    /**
     * 盖牌
     */
    doHood : function () {

    },

    /**
     * 设置成王
     */
    setKing : function (flg) {

    },

    getCentrePos : function () {
        var p = this.convertToWorldSpace(cc.p(this._icon.x, this._icon.y));
        return p;
    },

    /**
     * 是否包含指定的点
     * @param p
     * @return {boolean}
     */
    isContainsP : function (p) {
        // var tx = this.x;
        // var ty = this.y;
        // var box = cc.rect(tx,ty,this.width, this.height);
        // if(cc.rectContainsPoint(box, p)){
        //     if(this.row > 0){
        //         if(p.y > (this.row * this.rowGap + (this.height - this.rowGap))){
        //             return true;
        //         }else{
        //             return false;
        //         }
        //     }
        //     return true;
        // }
        // return false;

        var tx = this.x - this.width * 0.5;
        var ty = this.y - this.height * 0.5;
        var box = cc.rect(tx,ty,this.width, this.height);
        if(cc.rectContainsPoint(box, p)){
            if(this.row > 0){
                if(p.y > (this.row * this.rowGap + (this.height * 0.5 - this.rowGap))){
                    return true;
                }else{
                    return false;
                }
            }
            return true;
        }
        return false;
    },

    setGaryAlpha : function(num){
        this._grayBg.setOpacity(num);
    },

    showFace : function(){
        this.box.setVisible(true);
        this.backBox.setVisible(false);
    },

    rotateAction: function (isFront,cb) {
        var self = this;
        if(self.front == isFront) return;

        if (cc.sys.isNative) {
            if (!self.lock) {
                self.lock = true;
                self.runAction(cc.sequence(
                    cc.orbitCamera(0.3, -1, 0, 180, -90, 0, 0),
                    cc.callFunc(function () {
                        if (self.front) {
                            self.front = false;
                            self.box.setVisible(self.front);
                            self.backBox.setVisible(!self.front);
                            self.setStatus(daTongZi.CardStatus.HOOD);
                        } else {
                            self.front = true;
                            self.box.setVisible(self.front);
                            self.backBox.setVisible(!self.front);
                            self.setStatus(daTongZi.CardStatus.UNHOOD);
                            self.checkShowSpcl();
                        }
                    }),
                    cc.orbitCamera(0.3, -1, 0, -90, -180 + 90, 0, 0),
                    cc.callFunc(function () {
                        self.lock = false;
                        if(isFront && !self.front){
                            self.box.setVisible(true);
                            self.backBox.setVisible(false);
                            self.setStatus(daTongZi.CardStatus.UNHOOD);
                            self.runAction(cc.orbitCamera(0.1, -1, 0, -90, -180 + 90, 0, 0));
                        }
                        if(cb){
                            cb();
                        }
                    })
                ));
            }

        } else {
            this.backBox.setFlippedX(true);
            if (!self.lock) {
                self.lock = true;
                if (self.front) {
                    self.front = false;
                    this._action(self.box, self.front);
                    this._action(self.backBox, !self.front);
                } else {
                    self.front = true;
                    this._action(self.box, self.front);
                    this._action(self.backBox, !self.front);
                }
            }
        }

    },

    _action:function (node, visible) {
        var self = this;
        var cb = cc.callFunc(function () {
            node.setVisible(visible);
        });
        var cb_1 = cc.callFunc(function () {
            self.lock = false;
        });
        var delayTime = cc.delayTime(0.25);
        var sequence = new cc.Sequence(delayTime.clone(), cb, delayTime.clone(), cb_1);
        var scaleX = node.scaleX == 1 ? -1 : 1;
        var scaleTo = cc.scaleTo(0.5, scaleX, 1);
        var spawn = cc.spawn(sequence, scaleTo);
        node.runAction(spawn);
    },
});