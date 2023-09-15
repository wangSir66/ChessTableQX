//雅安
CreateViewYaAn = cc.Layer.extend({
    _isFriendCard: false,
    _gameTypeList: [],
    _lastGameType: null,
    _gameBtnList: null,
    _back: null,
    _data: null,
    clickButton: function (target) {
        var oldType = this._lastGameType;
        var _oldBtn = this._gameBtnList.getChildByTag(oldType);
        if (_oldBtn) {
            _oldBtn.touchEnabled = true;
            _oldBtn.bright = true;
            _oldBtn.setTitleColor(cc.color("#C9EEFF"));
        }
        var oldRoomNode = this._back.getChildByTag(oldType);
        if (oldRoomNode) {
            oldRoomNode.visible = false;
        }

        var newType = target.getTag();
        var newBtn = this._gameBtnList.getChildByTag(newType);
        newBtn.touchEnabled = false;
        newBtn.bright = false;
        newBtn.setTitleColor(cc.color("#AD2500"));


        var newRoomNode = this._back.getChildByTag(newType);
        if (newRoomNode) {
            newRoomNode.visible = true;
        }
        else {
            newRoomNode = this.initCreateRoomNode(newType, this._data);
            if (newRoomNode) {
                newRoomNode.setTag(newType);
                newRoomNode.setName("room");
                newRoomNode.setPosition(440, 45.5);

                this._back.addChild(newRoomNode);
            }
            else {
                cc.log("error CreateView.clickButton: initCreateRoomNode fail, gameType=", newType)
            }
        }
        this._lastGameType = newType;
    },
    initCreateRoomNode: function (gameType, datas) {
        var node = null;
        var data = MjClient.deepClone(datas);
        data.gameType = gameType;
        cc.log("===========gameType===", gameType, JSON.stringify(data));
        switch (gameType) {
            case MjClient.GAME_TYPE.YA_AN_MAHJONG://雅安麻将
                node = new CreateRoomNode_yaan(this, data);
                break;
            case MjClient.GAME_TYPE.RED_20_POKER://红20
                node = new CreateRoomNode_red20(this, data);
                break;
            case MjClient.GAME_TYPE.XUE_ZHAN_MAHJONG://血战
            case MjClient.GAME_TYPE.XUE_ZHAN_3to2://血战
            case MjClient.GAME_TYPE.XUE_ZHAN_3to3://血战
            case MjClient.GAME_TYPE.XUE_ZHAN_2to2://血战
            case MjClient.GAME_TYPE.XUE_ZHAN_2to1://血战
                node = new CreateRoomNode_ynxuezhan(this, data);
                break;
            case MjClient.GAME_TYPE.PAO_DE_KUAI_YAAN: //跑得快
                node = new CreateRoomNode_PaoDeKuaiYA(this, data);
                break;
        }
        return node;
    },
    refreshGameListUI: function () {
        // 清理item
        this._gameBtnList.removeAllChildren();

        // 把所有右侧room隐藏
        var childrens = this._back.getChildren();
        for (var i = 0; i < childrens.length; i++) {
            if (childrens[i].getName() != "room")
                continue;

            childrens[i].visible = false;
        }

        // 创建左侧list
        var gameItem = this._gameBtnList.getParent().getChildByName("btn_cell");
        gameItem.visible = false;
        var gameList = this._gameTypeList;
        var lastGameType = this._lastGameType;
        for (var i = 0; i < gameList.length; i++) {
            var gameType = gameList[i];
            var newBtn = gameItem.clone();
            newBtn.getChildByName('xian_0').visible = i == 0;
            newBtn.visible = true;
            newBtn.setTitleColor(cc.color(gameType == this.lastGameType ? "#AD2500" : "#C9EEFF"));
            newBtn.setTitleText(GameCnName[gameType] || '未  知');
            newBtn.setTag(gameType);//根据类型设置item tag
            var that = this;
            newBtn.addClickEventListener(function (target) { that.clickButton(target); });
            this._gameBtnList.pushBackCustomItem(newBtn);

            newBtn.touchEnabled = gameType != lastGameType;
            newBtn.bright = gameType != lastGameType;
        }

        if (gameList.indexOf(lastGameType) > 5) {
            this._gameBtnList.jumpToBottom();
        }
        this.clickButton(this._gameBtnList.getChildByTag(lastGameType));
    },
    ctor: function (data) {
        this._super();
        this._data = data;
        this._isFriendCard = data.IsFriendCard;
        var isFriendCard = data.IsFriendCard;

        if (isFriendCard && MjClient.RuleParam && MjClient.RuleParam["rule" + this._data.ruleNumer] && MjClient.RuleParam["rule" + this._data.ruleNumer] != "delete")
            this._data.clubRule = MjClient.RuleParam["rule" + this._data.ruleNumer];
        //细分游戏类型
        MjClient.createui = this;

        // 获得游戏列表：
        var allG = getAllGameListArray()._gameTypeList;
        this._gameTypeList = [];
        allG.map(a => {
            this._gameTypeList.push(...a);
        })

        var lastGameType = util.localStorageEncrypt.getNumberItem("KEY_GAME_TYPE", -1);
        if (this._data && this._data.clubRule)
            lastGameType = this._data.clubRule.gameType;
        let lIndex = this._gameTypeList.indexOf(lastGameType);
        if (lIndex != -1) {
            this._lastGameType = lastGameType;
        }else this._lastGameType = this._gameTypeList[0];

        var jsonui = ccs.load(res.CreateHomeTotal_json);
        this.addChild(jsonui.node);

        if (MjClient.createRoomLayer) {
            MjClient.createRoomLayer.setVisible(false);
        }

        var _block = jsonui.node.getChildByName("block");
        setWgtLayout(_block, [1, 1], [0.5, 0.5], [0, 0], true);

        this._back = jsonui.node.getChildByName("back");
        setWgtLayout(this._back, [1, 1], [0.5, 0.5], [0, 0]);

        let leftImgDi = jsonui.node.getChildByName("Image_di");
        var Image_title = jsonui.node.getChildByName("Image_title");
        setWgtLayout(leftImgDi, [1, 1], [0, 0.5], [0, 0], false);
        setWgtLayout(Image_title, [0.2, 1], [0.6, 1], [0, 0], false);

        //关闭按钮
        var btnGoHome = leftImgDi.getChildByName("close");
        btnGoHome.addTouchEventListener(function (sender, Type) {
            switch (Type) {
                case ccui.Widget.TOUCH_ENDED:
                    if (isFriendCard)
                        MjClient.native.umengEvent4CountWithProperty("Qinyouquan_Shezhi_Tianjiawanfa_Close", { uid: SelfUid() });
                    else
                        MjClient.native.umengEvent4CountWithProperty("Zhujiemian_Chuangjianfangjian_Guanbi", { uid: SelfUid() });

                    if (MjClient.createRoomLayer) {
                        MjClient.createRoomLayer.setVisible(true);
                    }

                    postEvent("createRoomPanel_Close");
                    this.removeFromParent();
                    break;
                default:
                    break;
            }
        }, this);
        //游戏列表
        this._gameBtnList = leftImgDi.getChildByName("ListView_left");
        //江苏麻将去掉列表滚动条
        this._gameBtnList.setScrollBarEnabled(false);

        this.refreshGameListUI();

        return true;
    },
    onExit: function () {
        this._super();
        MjClient.createui = null;
    },
});
