//雅安
CreateViewYaAn = cc.Layer.extend({
    _isFriendCard: false,
    _gameTypeList: [[], []],
    _lastGameType: [-1, -1],
    _curTabIndex: 0,
    _gameBtnList: null,
    _back: null,
    _data: null,
    clickButton: function (target) {
        cc.log("clickButton:", target);

        var oldType = this._lastGameType[this._curTabIndex];
        var _oldBtn = this._gameBtnList.getChildByTag(oldType);
        if (_oldBtn) {
            _oldBtn.touchEnabled = true;
            _oldBtn.bright = true;
        }
        var oldRoomNode = this._back.getChildByTag(oldType);
        if (oldRoomNode) {
            oldRoomNode.visible = false;
        }

        var newType = target.getTag();
        var newBtn = this._gameBtnList.getChildByTag(newType);
        newBtn.touchEnabled = false;
        newBtn.bright = false;


        var newRoomNode = this._back.getChildByTag(newType);
        cc.log(" ==== newRoomNode  11111 ", newRoomNode)
        if (newRoomNode) {
            newRoomNode.visible = true;
        }
        else {
            newRoomNode = this.initCreateRoomNode(newType, this._data);
            cc.log("==== newRoomNode 22222ssss ", newRoomNode);
            if (newRoomNode) {
                newRoomNode.setTag(newType);
                newRoomNode.setName("room");
                newRoomNode.setPosition(440, 45.5);
                if (MjClient.getAppType() == MjClient.APP_TYPE.TXLINFENMJ) {//临汾需要偏移
                    newRoomNode.setPosition(540, 45.5);
                }

                this._back.addChild(newRoomNode);
            }
            else {
                cc.log("error CreateView.clickButton: initCreateRoomNode fail, gameType=", newType)
            }
        }

        this._lastGameType[this._curTabIndex] = newType;
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
        }
        return node;
    },
    loadItemTexture: function (item, index) {
        var textureNormal, texturePress;
        var preStr = GameButton[index];
        textureNormal = preStr + "_n.png";
        texturePress = preStr + "_s.png";
        item.loadTextures(textureNormal, texturePress, texturePress);
    },
    refreshGameListUI: function () {
        cc.log("refreshGameListUI: curTabIndex=" + this._curTabIndex + " lastGameType=" + this._lastGameType[this._curTabIndex]);

        if (this._gameTypeList[this._curTabIndex].indexOf(this._lastGameType[this._curTabIndex]) == -1)
            this._lastGameType[this._curTabIndex] = this._gameTypeList[this._curTabIndex][0];

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
        var gameItem = this._gameBtnList.getParent().getChildByName("item");
        gameItem.visible = false;
        var gameList = this._gameTypeList[this._curTabIndex];
        var lastGameType = this._lastGameType[this._curTabIndex];
        cc.log("加载玩法按钮   ~~~  gameList ", JSON.stringify(gameList));
        for (var i = 0; i < gameList.length; i++) {

            var gameType = gameList[i];
            var newBtn = gameItem.clone();
            newBtn.visible = true;
            this.loadItemTexture(newBtn, gameType);
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
        //isFriendCard,data.isShowTitleCreate,data.typeList
        this._super();
        this._data = data;
        this._isFriendCard = data.IsFriendCard;
        var isFriendCard = data.IsFriendCard;

        if (isFriendCard && MjClient.RuleParam && MjClient.RuleParam["rule" + this._data.ruleNumer] && MjClient.RuleParam["rule" + this._data.ruleNumer] != "delete")
            this._data.clubRule = MjClient.RuleParam["rule" + this._data.ruleNumer];

        //细分游戏类型时要显示标题
        var isShowTitleCreate = data.isShowTitleCreate;
        //细分游戏类型
        var typeList = data.typeList;
        MjClient.createui = this;

        // 获得游戏列表：
        this._gameTypeList = getAllGameListArray()._gameTypeList;

        var lastGameType = util.localStorageEncrypt.getNumberItem("KEY_GAME_TYPE", -1);
        if (this._data && this._data.clubRule)
            lastGameType = this._data.clubRule.gameType;

        if (this._gameTypeList[1].indexOf(lastGameType) != -1) {
            this._curTabIndex = 1;
            this._lastGameType[1] = lastGameType;
            this._lastGameType[0] = -1;
        }
        else {
            this._curTabIndex = 0;
            this._lastGameType[1] = -1;
            if (this._gameTypeList[0].indexOf(lastGameType) != -1)
                this._lastGameType[0] = lastGameType;
            else
                this._lastGameType[0] = this._gameTypeList[0][0];
        }

        var jsonui = ccs.load(res.Create_json);
        //BindUiAndLogic(jsonui.node, this.jsBind);
        this.addChild(jsonui.node);

        if (MjClient.createRoomLayer) {
            MjClient.createRoomLayer.setVisible(false);
        }

        var _block = jsonui.node.getChildByName("block");
        setWgtLayout(_block, [1, 1], [0.5, 0.5], [0, 0], 2);

        this._back = jsonui.node.getChildByName("back");
        setWgtLayout(this._back, [0.95, 0.95], [0.54, 0.5], [-0.035, 0]);
        if (isJinZhongAPPType() ||
            MjClient.APP_TYPE.QXYYQP == MjClient.getAppType() ||
            MjClient.APP_TYPE.QXNTQP == MjClient.getAppType() ||
            MjClient.getAppType() === MjClient.APP_TYPE.HUBEIMJ ||
            MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ)
            setWgtLayout(this._back, [1, 1], [0.5, 0.5], [0, 0]);

        var _item = this._back.getChildByName("item");
        if (_item) _item.visible = false;


        var titleImg = this._back.getChildByName("titleCreate");
        var titleImg_2 = this._back.getChildByName("titleCreate_2");

        var switchTab = null;
        var node_friendCard = this._back.getChildByName("node_friendCard");
        if (this._gameTypeList[0].length == 0 || this._gameTypeList[1].length == 0 || !node_friendCard) {
            if (node_friendCard)
                node_friendCard.visible = false;

            if (titleImg)
                titleImg.visible = !isFriendCard;

            if (titleImg_2)
                titleImg_2.visible = isFriendCard;
        }
        else if (node_friendCard) {
            node_friendCard.visible = true;
            if (titleImg)
                titleImg.visible = false;
            if (titleImg_2)
                titleImg_2.visible = false;

            var btn_mj = node_friendCard.getChildByName("btn_mj");
            var btn_poke = node_friendCard.getChildByName("btn_poke");
            var title_1 = btn_mj.getTitleRenderer();
            var title_2 = btn_poke.getTitleRenderer();
            var posY = title_1.getPositionY() + 3;
            title_1.setPositionY(posY);
            title_2.setPositionY(posY);
            var that = this;
            var switchTab = function (tabIndex) {
                cc.log("switchTab: tabIndex=" + tabIndex);
                btn_mj.enabled = tabIndex != 0;
                btn_poke.enabled = tabIndex != 1;
                btn_mj.setTitleColor(tabIndex != 0 ? cc.color(116, 60, 19) : cc.color(255, 255, 255));
                btn_poke.setTitleColor(tabIndex != 1 ? cc.color(116, 60, 19) : cc.color(255, 255, 255));

                that._curTabIndex = tabIndex;
                if (isShowTitleCreate) {
                    //特殊判断，在细分的创建界面
                    that._curTabIndex = 0;

                }

                that.refreshGameListUI();
            };

            btn_mj.addTouchEventListener(function (sender, Type) {
                switch (Type) {
                    case ccui.Widget.TOUCH_ENDED:
                        switchTab(0)
                        break;
                    default:
                        break;
                }
            }, this);

            btn_poke.addTouchEventListener(function (sender, Type) {
                switch (Type) {
                    case ccui.Widget.TOUCH_ENDED:
                        switchTab(1);
                        break;
                    default:
                        break;
                }
            }, this);
        }


        //细分的创建房间界面
        if (isShowTitleCreate) {
            if (titleImg) {
                titleImg.visible = true;
            }
            if (titleImg_2) {
                titleImg_2.visible = false;
            }
            if (node_friendCard) {
                node_friendCard.visible = false;
            }
            if (typeList) {
                // compare to server config ,if only have config, show
                var t = []
                if (MjClient.gameListConfig.majiangList.length > 0) {
                    for (var i = 0; i < typeList.length; i++) {
                        var index = MjClient.gameListConfig.majiangList.indexOf(typeList[i])
                        if (index > -1) {
                            t.push(typeList[i])
                        }
                    }
                }
                this._gameTypeList[0] = t;
                // this._gameTypeList[0] = typeList;
                this._gameTypeList[1] = [];
            }

        }

        //关闭按钮
        var btnGoHome = this._back.getChildByName("goHome");
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
        this._gameBtnList = this._back.getChildByName("gameList");
        //江苏麻将去掉列表滚动条
        if (MjClient.getAppType() == MjClient.APP_TYPE.QXJSMJ
            || MjClient.getAppType() == MjClient.APP_TYPE.QXXZMJ
            || MjClient.getAppType() == MjClient.APP_TYPE.QXHAMJ
            || MjClient.getAppType() == MjClient.APP_TYPE.QXNTQP
        ) this._gameBtnList.setScrollBarEnabled(false);


        if (switchTab)
            switchTab(this._curTabIndex);
        else
            this.refreshGameListUI();

        return true;
    },
    onExit: function () {
        this._super();
        MjClient.createui = null;
    },
});
