//选项选中时的颜色处理  统一处理
const BTNCOLOR1 = cc.color('#D96334');//选中
const BTNCOLOR2 = cc.color('#8E8178');//禁用
const BTNCOLOR3 = cc.color("#602E1A");//未选中
const KEYCURRGAMERULE = 'KEY_CURR_GAME_RULE';//缓存游戏规则

var CreateRoomNodeYaAn = cc.Node.extend({
    bg_node: null,
    _view: null,
    _data: null,
    _btnItems: [],
    payWayNodeArray: [],
    roundNodeArray: [],
    RedioGroup: {},
    ctor: function (layer, data) {
        this._super();
        this.parentLayer = layer;
        this._data = data;
        this._isFriendCard = data.IsFriendCard;
        this._isRoomCardMode = data.clubType;
        this._isMatchMode = data.isMatch;
        this._textInput = null;
        this._nodeGPS = null;
        this._costName = '黄金';
        this.localStorageKey = {};
        this.localStorageKey.KEY_RondType = "_ROUND_TYPE"; //局数选定
        this.localStorageKey.KEY_PayWay = "_PAY_WAY"; //付房卡的方式
        this.localStorageKey.KEY_GPS = "_GPS";
        this._clubIsCreateRoom = false;  //俱乐部自主创建房间

        MjClient.createRoomNode = this;
        MjClient._customValue = {};

        this._selectColor = BTNCOLOR1;
        this._unSelectColor = BTNCOLOR3;

        if (this._isFriendCard) this.clubRule = {};
        cc.log("++++++++++ this.clubRule ++++++++" + JSON.stringify(this.clubRule) + "\n" + JSON.stringify(this._data));
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PayWay, 0);
        this.rangeScore = [1, 20];
        this.trustTimes = [0, 30, 60, 90];
        //创建界面
        this.initAll(this._isFriendCard);
        //初始化
        this.initAllBtns();
        this.modifyDiFenText();
        this.initPlayNode();
        this.initEnd();
        this.setPlayNodeCurrentSelect(this._isFriendCard);
    },
    //初始化结束需要做的事情
    initEnd: function () {
        if (this._isFriendCard && cc.sys.isObjectValid(this.payWayNodeArray[0])) {
            var _text = this.payWayNodeArray[0].getChildByName("text");
            _text.setString("群主付");
        }
        if (this.RedioGroup['renshu']) {
            const pNums = Object.keys(this.getGamePriceConfig()), list = this.RedioGroup['renshu']._nodeList;
            for (let _i = 0; _i < list.length; _i++) {
                const n = list[_i];
                if (pNums[_i]) {
                    n.getChildByName('text').setString(pNums[_i] + ' 人');
                    n.visible = true;
                } else n.visible = false;
            }
        }
    },
    /**设置当前选中状态 */
    setPlayNodeCurrentSelect: function (isFriendCard) {
    },
    InitCurrentSelect: function (key_nameR, key_nameC) {
        const cacheRule = JSON.parse(util.localStorageEncrypt.getStringItem(KEYCURRGAMERULE + this._data.gameType, '{}')),
            isClub = this._isFriendCard;
        let len = Object.keys(key_nameR);
        for (let _i = 0; _i < len.length; _i++) {
            let key = len[_i], val = key_nameR[key];
            let _current, selectIndex, currObj;
            if (isClub) {
                if (typeof val[1] === 'number')
                    _current = this.getNumberItem(val[0], val[1]);
                else if (typeof val[1] === 'boolean')
                    _current = this.getBoolItem(val[0], val[1]);
            }
            else
                _current = cacheRule[val[0]] != undefined ? cacheRule[val[0]] : val[1];
            selectIndex = val[2].indexOf(_current);
            if (val[0] == 'EnableTTF') cc.log('-----ssss--', cacheRule[val[0]], selectIndex, _current)
            currObj = this.RedioGroup[key];
            currObj.selectItem(selectIndex);
            this.radioBoxSelectCB(selectIndex, currObj._nodeList[selectIndex], currObj._nodeList);
        }
        len = Object.keys(key_nameC);
        for (let _i = 0; _i < len.length; _i++) {
            let key1 = len[_i], val = key_nameC[key1];
            let isTrue;
            if (isClub)
                isTrue = this.getBoolItem(val[0], val[1]);
            else
                isTrue = cacheRule[val[0]] != undefined ? cacheRule[val[0]] : val[1];
            let btnNode = this._btnItems.find(b => b.name == key1);
            if (btnNode) {
                btnNode.setSelected(isTrue);
                var text = btnNode.getChildByName("text");
                this.selectedCB(text, isTrue);
            }
        }
        this.setExtraPlayNodeCurrentSelect(isClub);
    },
    selectedCB: function (text, isSelected) {
        if (isSelected) {
            text.setTextColor(this._selectColor);
        } else {
            text.setTextColor(this._unSelectColor);
        }

    },
    radioBoxSelectCB: function (index, sender, list) {
        if (sender) {
            var selectColor = this._selectColor;
            var unSelectColor = this._unSelectColor;
            cc.log('--------radioBoxSelectCB-----', 1)
            var txt = sender.getChildByName("text");
            txt.ignoreContentAdaptWithSize(true);
            txt.setTextColor(selectColor);
            var len = list.length;
            for (var i = 0; i < len; i++) {
                var radioBox = list[i];

                if (radioBox !== sender || sender.isSelected() == false) {
                    cc.log('--------radioBoxSelectCB-----', 2)
                    txt = radioBox.getChildByName("text");
                    txt.ignoreContentAdaptWithSize(true);
                    txt.setTextColor(unSelectColor);
                }
            }
        }
    },
    getItem: function (key, defaultValue) {
        if (typeof (defaultValue) == "undefined")
            defaultValue = 0;
        return this.clubRule && key && typeof (this.clubRule[key]) != "undefined" ? this.clubRule[key] : defaultValue;
    },
    getNumberItem: function (key, defaultValue) {
        var ret = this.getItem(key, defaultValue);
        ret = Number(ret);
        if (!cc.isNumber(ret))
            ret = 0;
        return ret;
    },
    getBoolItem: function (key, defaultValue) {
        var ret = this.getItem(key, defaultValue);
        return ret ? true : false;
    },
    getStringItem: function (key, defaultValue) {
        return this.getItem(key, defaultValue) + "";
    },
    /**设置底分 */
    modifyDiFenText: function () {
        if (!this._view) return;
        //底分加減（1-20）
        let df = this._view.getChildByName('difen');
        if (df) {
            let baseScoreT = this.difen = df.getChildByName('BaseScore');
            baseScoreT.setString(1);
            this._btnItems.push(df.getChildByName('BtnPlusBaseScore'))
            df.getChildByName('BtnPlusBaseScore').addTouchEventListener((sender, Type) => {
                switch (Type) {
                    case ccui.Widget.TOUCH_ENDED:
                        let num = Number(baseScoreT.getString());
                        cc.log('---------baseScoreT.getString()------', baseScoreT.getString())
                        if (num >= this.rangeScore[1]) {
                            baseScoreT.setString(this.rangeScore[0]);
                        } else {
                            baseScoreT.setString(num + 1);
                        }
                        break;
                    default:
                        break;
                }
            }, this);
            this._btnItems.push(df.getChildByName('BtnMinusBaseScore'))
            df.getChildByName('BtnMinusBaseScore').addTouchEventListener((sender, Type) => {
                switch (Type) {
                    case ccui.Widget.TOUCH_ENDED:
                        let num = Number(baseScoreT.getString());
                        if (num === this.rangeScore[0]) {
                            baseScoreT.setString(this.rangeScore[1]);
                        } else {
                            baseScoreT.setString(num - 1);
                        }
                        break;
                    default:
                        break;
                }
            }, this);
        }
    },

    /**所有的按钮*/
    initAllBtns: function () {
        if (!this._view) return;
        this.payWayNodeArray = [];
        this.roundNodeArray = [];
        this._btnItems = [];
        this.RedioGroup = {};
        this.tuoguanNodeList = [];
        for (let _i = 0; _i < this._view.children.length; _i++) {
            const row = this._view.children[_i];
            let btns = [];
            for (let _j = 0; _j < row.children.length; _j++) {
                const col = row.children[_j];
                if (col.name.indexOf('btnRadio') > -1 || col.name.indexOf('btnCheck') > -1) {
                    this._btnItems.push(col);
                    if (row.name === 'tuoguan') this.tuoguanNodeList.push(col);
                    if (col.name.indexOf('btnRadio') > -1) {
                        btns.push(col);
                        if (col.name == 'btnRadio29' || col.name == 'btnRadio30' || col.name == 'btnRadio31') {
                            this.payWayNodeArray.push(col);
                        } else if (col.name == 'btnRadio0' || col.name == 'btnRadio1' || col.name == 'btnRadio2') {
                            col.getChildByName('text_0').setString('');
                            this.roundNodeArray.push(col)
                        }
                    }
                    else {
                        col.addEventListener(this.callSelectBack.bind(this), col);
                        this.addListenerText(col, null, this.callSelectBack.bind(this));
                    }
                }
            }
            if (btns.length > 0) {
                const _radio = createRadioBoxForCheckBoxs(btns, this.callSelectBack.bind(this), 0);
                this.RedioGroup[row.name] = _radio;
                this.addListenerText(btns, _radio, this.callSelectBack.bind(this));
            }
        }
        //创建房间
        var _btn_create = this.bg_node.getChildByName("btn_create");
        if (!_btn_create) {
            _btn_create = this.bg_node.getParent().getChildByName("btn_create");
        }
        if (_btn_create) {
            _btn_create.visible = true;
            if (MjClient.remoteCfg.hideMoney) {
                _btn_create.visible = true;
                _btn_create.setEnabled(true);
            }

            _btn_create.addTouchEventListener(function (sender, Type) {
                switch (Type) {
                    case ccui.Widget.TOUCH_ENDED:
                        if (this._isFriendCard) {
                            MjClient.native.umengEvent4CountWithProperty("Qinyouquan_Chuangjianfangjian_wanfapeizhijiemian", { uid: SelfUid() });
                            this.clubCreateRoom();
                        }
                        else {
                            if (MjClient.createRoomLayer) {
                                MjClient.createRoomLayer.setVisible(true);
                            }
                            this.createRoom();
                            MjClient.native.umengEvent4CountWithProperty("Zhujiemian_Chuangjianfangjian_Chuangjianfangjian", { uid: SelfUid() });
                        }
                        break;
                    default:
                        break;
                }
            }, this);
        }
        //创建房间 diamond
        var _btn_create_diamond = this.bg_node.getChildByName("btn_create_diamond");
        // 岳阳选项内容滑动，加在view下，创建房间，保存规则在上一层
        if (!_btn_create_diamond) {
            _btn_create_diamond = this.bg_node.getParent().getChildByName("btn_create_diamond");
        }
        if (_btn_create_diamond)
            _btn_create_diamond.addTouchEventListener(function (sender, Type) {
                switch (Type) {
                    case ccui.Widget.TOUCH_ENDED:
                        if (this._isFriendCard) {
                            MjClient.native.umengEvent4CountWithProperty("Qinyouquan_Chuangjianfangjian_wanfapeizhijiemian", { uid: SelfUid() });
                            this.clubCreateRoom();
                        }
                        else {
                            this.createRoom();
                            if (MjClient.createRoomLayer) {
                                MjClient.createRoomLayer.setVisible(true);
                            }
                            MjClient.native.umengEvent4CountWithProperty("Zhujiemian_Chuangjianfangjian_Chuangjianfangjian", { uid: SelfUid() });
                        }
                        break;
                    default:
                        break;
                }
            }, this);

        // btn_ruleretain
        var _btn_rule = this.bg_node.getChildByName("btn_ruleretain");
        // 岳阳选项内容滑动，加在view下，创建房间，保存规则在上一层
        if (!_btn_rule) {
            _btn_rule = this.bg_node.getParent().getChildByName("btn_ruleretain");
        }

        if (_btn_rule) {
            _btn_rule.setVisible(false)
            var _TextBg = _btn_rule.getChildByName("Text_Name");
            if (_TextBg)
                _TextBg.setVisible(false);

            var _btn_del = _btn_rule.getChildByName("btn_delete");
            if (_btn_del) {
                _btn_del.addTouchEventListener(function (sender, Type) {
                    switch (Type) {
                        case ccui.Widget.TOUCH_ENDED:
                            MjClient.native.umengEvent4CountWithProperty("Qinyouquan_Shezhi_Tianjiawanfa_Shanchuguize", { uid: SelfUid() });
                            this.deleteRule();
                            break;
                        default:
                            break;
                    }
                }, this);
            }

            var text = _btn_rule.getChildByName("Text");
            if (text)
                text.setVisible(false);

            _btn_rule.addTouchEventListener(function (sender, Type) {
                switch (Type) {
                    case ccui.Widget.TOUCH_ENDED:
                        MjClient.native.umengEvent4CountWithProperty("Qinyouquan_Shezhi_Tianjiawanfa_Baocunguize", { uid: SelfUid() });
                        this.showInputRuleNameDialog();
                        break;
                    default:
                        break;
                }
            }, this);
            if (this._isFriendCard && this._clubIsCreateRoom == false) {
                if (_btn_create) _btn_create.setVisible(false);
                _btn_create_diamond.setVisible(false);
                _btn_rule.setVisible(true);
                if (this._nodeGPS && this._nodeGPS.visible == true) {
                    _btn_rule.x = this._nodeGPS.x + 650;
                    _btn_rule.y = this._nodeGPS.y;
                    if (MjClient.getAppType() == MjClient.APP_TYPE.QXJSMJ || MjClient.getAppType() == MjClient.APP_TYPE.QXXZMJ || MjClient.getAppType() == MjClient.APP_TYPE.QXHAMJ) {
                        _btn_rule.x = this._nodeGPS.x + 600;
                    }
                    else if (MjClient.getAppType() == MjClient.APP_TYPE.QXNTQP) {
                        _btn_rule.x = this._nodeGPS.x + 575;
                    }
                    else if (this._data.gameType == MjClient.GAME_TYPE.YUE_YANG_FU_LU_SHOU) {
                        _btn_rule.x = this._nodeGPS.x + 575;
                    }
                    else if (this._data.gameType == MjClient.GAME_TYPE.FU_LU_SHOU_ER_SHI_ZHANG) {
                        _btn_rule.x = this._nodeGPS.x + 525;
                        _btn_rule.y = this._nodeGPS.y + 40;
                    }
                }
            } else if (MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP) {
                if (_btn_create) {
                    _btn_create.visible = MjClient.remoteCfg.hideMoney;
                    _btn_create.setEnabled(MjClient.remoteCfg.hideMoney);
                }
                _btn_create_diamond.visible = !MjClient.remoteCfg.hideMoney;
                _btn_create_diamond.setEnabled(!MjClient.remoteCfg.hideMoney);
            }
        }
    },

    callSelectBack: function (indx, item, list) {
        const isNum = parseInt(indx)
        if (isNum >= 0 && item) {
            indx = Number(indx);
            let p = item.getParent();
            if (p) {
                const currObj = this.RedioGroup[p.name];
                if (p.name == 'renshu') this.changePayForPlayerNum(indx);
                this.radioBoxSelectCB(indx, currObj._nodeList[indx], currObj._nodeList);
            }
        } else if (indx != null && indx != undefined) {
            var text = indx.getChildByName("text");
            this.selectedCB(text, indx.isSelected());
        } else if (!indx && item) {
            item = this._btnItems.find(b => b.name == item);
            if (item) {
                var text = item.getChildByName("text");
                this.selectedCB(text, item.isSelected());
            }
        }
    },

    //gps
    initPlayNode: function () {
        //add by sking for create room need GPS
        var _selectCol = CREATEROOM_COLOR_1;
        var _UnSelectCol = CREATEROOM_COLOR_3;
        this._nodeGPS = new ccui.CheckBox("createNewPng/daTC1_19.png", "createNewPng/daTC1_20.png");
        this._nodeGPS.setPosition(cc.p(50, 20));
        this.bg_node.addChild(this._nodeGPS, 100);
        if (MjClient.getAppType() == MjClient.APP_TYPE.QXJSMJ || MjClient.getAppType() == MjClient.APP_TYPE.QXXZMJ || MjClient.getAppType() == MjClient.APP_TYPE.QXHAMJ) {
            this._nodeGPS.setPosition(cc.p(50, 50));
        }
        if (MjClient.getAppType() === MjClient.APP_TYPE.QXNTQP) {
            this._nodeGPS.setPosition(cc.p(108, 50));
        }
        if (this._data && this._data.gameType == MjClient.GAME_TYPE.YUE_YANG_FU_LU_SHOU) {
            //this._nodeGPS.setPosition(cc.p(108, 20));
            this._nodeGPS.setVisible(false);
        }
        if (this._data && this._data.gameType == MjClient.GAME_TYPE.FU_LU_SHOU_ER_SHI_ZHANG) {
            //this._nodeGPS.setPosition(cc.p(160, 20));
            this._nodeGPS.setVisible(false);
        }

        var _fangText = new ccui.Text();
        if (MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP || MjClient.getAppType() === MjClient.APP_TYPE.HUBEIMJ || MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ) {//岳阳同一使用方正兰亭
            _fangText.setFontName("fonts/lanting.TTF");
        }
        _fangText.setName("text");
        _fangText.setFontSize(30);
        _fangText.setColor(_UnSelectCol);
        //_fangText.setFontName(MjClient.fzcyfont);
        if (MjClient.APP_TYPE.QXJSMJ == MjClient.getAppType() || MjClient.getAppType() == MjClient.APP_TYPE.QXXZMJ || MjClient.getAppType() == MjClient.APP_TYPE.QXHAMJ || MjClient.APP_TYPE.QXNTQP == MjClient.getAppType()) _fangText.setFontSize(28);
        _fangText.setPosition(cc.p(this._nodeGPS.getContentSize().width * 2.5, this._nodeGPS.getContentSize().height / 2));
        _fangText.setString("GPS");
        _fangText.setTouchEnabled(true);
        this._nodeGPS.addChild(_fangText);
        var that = this;
        _fangText.addTouchEventListener(function (sender, type) {
            if (type == 2) {
                that._nodeGPS.setSelected(!that._nodeGPS.isSelected())
                if (that._nodeGPS.isSelected()) {
                    _fangText.setColor(_selectCol);
                } else {
                    _fangText.setColor(_UnSelectCol);
                }

                util.localStorageEncrypt.setBoolItem(that.localStorageKey.KEY_GPS, that._nodeGPS.isSelected());
            }
        });
        this._nodeGPS.addEventListener(function (sender, type) {
            switch (type) {
                case ccui.CheckBox.EVENT_SELECTED:
                    cc.log("-------------------选择");
                    util.localStorageEncrypt.setBoolItem(that.localStorageKey.KEY_GPS, true);
                    _fangText.setColor(_selectCol);
                    break;
                case ccui.CheckBox.EVENT_UNSELECTED:
                    _fangText.setColor(_UnSelectCol);
                    util.localStorageEncrypt.setBoolItem(that.localStorageKey.KEY_GPS, false);
                    cc.log("-------------------不选择");
                    break;
            }
        }, this._nodeGPS);

        //GPS帮助的问号
        var _helpNode = new ccui.ImageView("createNewPng/tip.png");
        var _helpImage = new ccui.ImageView("createNewPng/tip_di.png");
        var _helpText = new ccui.Text();
        _helpText.setFontName("fonts/lanting.TTF");
        _helpText.setPosition(201.50, 49.80);
        _helpText.setColor(_selectCol);
        _helpText.setFontSize(22);
        _helpText.setString("必须开启软件定位权限,才能进入房间");
        _helpText.setFontName(MjClient.fzcyfont);
        _helpImage.addChild(_helpText);
        _helpImage.setVisible(false);
        _helpImage.setPosition(-120, 86.80);
        _helpNode.setScale(0.8);
        _helpNode.addChild(_helpImage);
        this._nodeGPS.addChild(_helpNode);
        _helpNode.setTouchEnabled(true);
        _helpNode.setPosition(this._nodeGPS.getContentSize().width * 4.6, this._nodeGPS.getContentSize().height / 2);
        _helpNode.addTouchEventListener(function (sender, type) {
            if (type == 2) {
                _helpImage.setVisible(true);
            }
        }, _helpNode);
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            status: null,
            onTouchBegan: function (touch, event) {
                if (_helpImage.isVisible()) {
                    _helpImage.setVisible(false);
                    return true;
                } else {
                    return false;
                }
            },
        }, _helpImage);


    },

    getBtnByName: function (str) {
        for (let _i = 0; _i < this._btnItems.length; _i++) {
            const btn = this._btnItems[_i];
            if (cc.sys.isObjectValid(btn) && btn.name == str) return btn;
        }
        return null;
    },
    getCheckboxSelectedByName: function (str) {
        for (let _i = 0; _i < this._btnItems.length; _i++) {
            const btn = this._btnItems[_i];
            if (cc.sys.isObjectValid(btn) && btn.name == str) return btn.isSelected();
        }
        return false;
    },

    getRedioSelectByName: function (str) {
        if (!this._view) return 0;
        let childs = this._view.getChildByName(str).children.filter(n => n.name.indexOf('btnRadio') > -1 || n.name.indexOf('btnCheck') > -1);
        for (let _i = 0; _i < childs.length; _i++) {
            const btn = childs[_i];
            if (cc.sys.isObjectValid(btn) && btn.isSelected()) return _i;
        }
        return 0;
    },

    initAll: function () {

    },
    setRoomCardFreeFeeVisible: function (visible) {
        if (this._roomCardDifenMianKou) {
            this._roomCardDifenMianKou.visible = visible;
            if (this.onClickFangkaFree) {
                this.onClickFangkaFree();
            }
        }
    },
    getNodePlayAndRound: function () {
        var playPanel = this._scroll_play || this.bg_node.getChildByName("play")
        if (playPanel == undefined) {
            if (this.bg_node.getChildByName("view") && this.bg_node.getChildByName("view").getChildByName("play"))
                playPanel = this.bg_node.getChildByName("view").getChildByName("play");
            else if (this.bg_node.getChildByName("view") && this.bg_node.getChildByName("view").getChildByName("play_way"))
                playPanel = this.bg_node.getChildByName("view").getChildByName("play_way");
            else if (this.bg_node.getChildByName("play_way"))
                playPanel = this.bg_node.getChildByName("play_way");
            else if (this.bg_node.getChildByName("playScroll") && this.bg_node.getChildByName("playScroll").getChildByName("play"))
                playPanel = this.bg_node.getChildByName("playScroll").getChildByName("play");
        }

        var roundPanel = this._scroll_round || this.bg_node.getChildByName("round")
        if (roundPanel == undefined) {
            if (this.bg_node.getChildByName("view") && this.bg_node.getChildByName("view").getChildByName("round"))
                roundPanel = this.bg_node.getChildByName("view").getChildByName("round");
        }

        var node = {};
        node.playPanel = playPanel;
        node.roundPanel = roundPanel;
        return node;
    },
    showInputRuleNameDialog: function () {
        var dialog = ccs.load("friendcard_inputRuleNameDialog.json").node;
        setWgtLayout(dialog, [1, 1], [0, 0], [0, 0], true);

        var text_tip = dialog.getChildByName("Image_bg").getChildByName("Text_tip");
        text_tip.ignoreContentAdaptWithSize(true);
        var image = dialog.getChildByName("Image_bg").getChildByName("Image");
        var textInput = new cc.EditBox(image.getContentSize(), new cc.Scale9Sprite("friendCards/int_playwords.png"));
        textInput.setFontColor(cc.color(0x40, 0x40, 0x40));
        textInput.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);
        textInput.setReturnType(cc.KEYBOARD_RETURNTYPE_DONE);
        textInput.setPlaceHolder("填写编号");

        if (isJinZhongAPPType()) {
            textInput.setFontSize(38);
        }

        textInput.setPosition(image.getContentSize().width / 2, image.getContentSize().height / 2);
        image.addChild(textInput);

        if (this._data) {
            if (this._data.ruleName) {
                var splitRuleName = FriendCard_Common.splitClubRuleName(unescape(this._data.ruleName))
                textInput.setString(splitRuleName[0]);
            }
            //textInput.setString(GameCnName[this._data.gameType]);
        }
        this._textInput = textInput;

        var finishBtn = dialog.getChildByName("Image_bg").getChildByName("Button_finish");
        finishBtn.addTouchEventListener(function (sender, Type) {
            switch (Type) {
                case ccui.Widget.TOUCH_ENDED:
                    var rule = FriendCard_Common.strReplace(textInput.getString());
                    if (rule && !FriendCard_Common.isNumber(rule)) {
                        MjClient.showToast("请填写0-4位的阿拉伯数字");
                        return;
                    }
                    if (rule && rule.length > 4)
                        MjClient.showToast("最多输入4位玩法编号");
                    else
                        this.retainRule();
                    break;
                default:
                    break;
            }
        }, this);

        dialog.getChildByName("Image_bg").getChildByName("close").visible = false;
        MjClient.createui.addChild(dialog);
    },
    getSelectPlayNum: function () {
        let indx = this.RedioGroup['renshu'] ? this.RedioGroup['renshu'].getSelectIndex() : 0,
            pConfig = this.getGamePriceConfig();
        return Number(Object.keys(pConfig)[indx]) || 2;
    },
    addListenerText: function (node, radio, callback) {//callback 是回调函数
        if (node && radio) {
            //cc.log(">>>>>>>>>>>>>>", JSON.stringify(node), JSON.stringify(radio), callback);
            for (var i = 0; i < node.length; i++) {
                node[i].getChildByName("text").ignoreContentAdaptWithSize(true);
                if (this._clubIsCreateRoom && this.grayButtonNameStr.indexOf(node[i].name) != -1) {
                    //俱乐部自主创房需要置灰的按钮,不添加事件
                } else {
                    cc.eventManager.addListener(this.setTextClick(node, i, radio, callback), node[i].getChildByName("text"));
                }
            }
        } else if (this._clubIsCreateRoom && this.grayButtonNameStr.indexOf(node.name) != -1) {
            node.getChildByName("text").ignoreContentAdaptWithSize(true);
        } else if (callback) {
            node.getChildByName("text").ignoreContentAdaptWithSize(true);
            cc.eventManager.addListener(this.setTextClick(null, null, null, callback), node.getChildByName("text"));
        } else {
            node.getChildByName("text").ignoreContentAdaptWithSize(true);
            cc.eventManager.addListener(this.setTextClick(), node.getChildByName("text"));
        }
    },
    changePayForPlayerNum: function (select_number) {
        if (select_number != null) {
            MjClient.MaxPlayerNum = 4 - select_number;
        }
        this.setDiaNumData(this.bg_node);
    },
    //创建房间 点击范围扩大 使得文字也能点击
    setTextClick: function (listnode, number, radio, callback) {
        var that = this;
        var _callback = callback || function () { };
        var selectColor = this._selectColor;
        var unSelectColor = this._unSelectColor;

        return cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan: function (touch, event) {
                if (radio) radio.childIsMove = false;
                var target = event.getCurrentTarget();
                var parent = target;
                for (; parent; parent = parent.parent) {
                    if (!parent.visible)
                        return false;
                }

                var pos = target.getParent().convertTouchToNodeSpace(touch); // 世界坐标转换 (子节点相对于父节点的位置)

                // 如果触碰起始地点在本区域中
                var box = target.getBoundingBox();
                box.width += 10;
                box.height += 10;
                box.x -= 10;
                box.y -= 10;
                if (!cc.rectContainsPoint(box, pos)) {
                    return false;
                }
                return true;
            },
            onTouchMoved: function (touch, event) {
                if (radio) radio.childIsMove = true;
            },
            onTouchEnded: function (touch, event) {
                if (radio && radio.childIsMove) return;   // 如果复选框的子节点（文字或者图片）被滑动，则阻止事件触发
                var target = event.getCurrentTarget();
                if (!target.parent.isEnabled()) return;
                var pos = target.getParent().convertTouchToNodeSpace(touch); // 世界坐标转换 (子节点相对于父节点的位置)
                if (listnode) {
                    for (var i = 0; i < listnode.length; i++) {
                        if (i == number) {
                            listnode[i].setSelected(true);
                            var txt = listnode[i].getChildByName("text");
                            txt.setTextColor(selectColor);
                            txt.ignoreContentAdaptWithSize(true);
                            radio.selectItem(i);
                        } else {
                            listnode[i].setSelected(false);
                            var txt = listnode[i].getChildByName("text");
                            txt.setTextColor(unSelectColor);
                            txt.ignoreContentAdaptWithSize(true);
                        }
                    }
                    //this._playNode_round_radio  this._playNode_payway_radio
                    if ((radio == that.RedioGroup['jushu']) || (radio == that.RedioGroup['zhifufangshi'])) {
                        cc.log(" ====== that.bg_node,", that.bg_node)
                        that.setDiaNumData(that.bg_node);
                    }


                } else {
                    // 如果触碰起始地点在本区域中
                    if (!cc.rectContainsPoint(target.getBoundingBox(), pos))
                        return;

                    target.parent.setSelected(!target.parent.isSelected());

                    var txt = target.parent.getChildByName("text");
                    txt.ignoreContentAdaptWithSize(true);
                    if (txt && target.parent.isSelected()) {
                        txt.setTextColor(selectColor);
                    } else {
                        txt.setTextColor(unSelectColor);
                    }
                }

                _callback(number, target.parent);

            }
        });
    },
    resetBtnCreateDiamond: function (btn, costMoney, diamondNumNode) {
        //俱乐部玩家自主创房 并且是房卡模式时 不显示元宝消耗
        if (this._isRoomCardMode && this._clubIsCreateRoom) {
            btn.loadTextureNormal("createNewPng/btn_create_n.png");
            btn.loadTexturePressed("createNewPng/btn_create_s.png");
            btn.setAnchorPoint(1, 0.5)
            var oldWidth = btn.width;
            btn.width = 199
            btn.x = btn.getParent().width * 0.95;
            if (diamondNumNode) diamondNumNode.visible = false;
            return;
        }

        if (this.isUseUIV3)
            return;

        if (costMoney == 0) {
            btn.loadTextureNormal("createNewPng/btn_create_n_diamond_free.png");
        } else {
            btn.loadTextureNormal("createNewPng/btn_create_n_diamond.png");
        }
    },
    selectPay: function (roundNumObj, str_type, str_pay) {
        for (var i = 0; i < this.roundNodeArray.length; i++) {
            var roundNode = this.roundNodeArray[i];
            if (cc.sys.isObjectValid(roundNode)) {
                if (!roundNumObj[i] || !str_pay || (str_pay[i] && str_pay[i] < 0)) {
                    roundNode.visible = false;

                    cc.log('warn 局数按钮隐藏 selectPay no roundNumObj', roundNumObj, i, str_pay)
                    continue;
                }

                var text = roundNode.getChildByName("text");
                var text_0 = roundNode.getChildByName("text_0");
                if (text_0) {
                    if (roundNumObj[i] == 9999) {
                        text.setString("100锅");
                        text_0.setString("(" + str_pay[i] + this._costName + ")");
                    }
                    else {
                        text.setString(roundNumObj[i] + "局");
                        text_0.setString("(" + str_pay[i] + this._costName + ")");
                    }
                    if (roundNumObj[i].indexOf("quan") >= 0) {
                        text.setString(roundNumObj[i]);
                        text.setString(text.getString().replace("quan", "圈"));
                    }
                    if (this._isRoomCardMode) {
                        text_0.visible = false;
                    }
                }
                else {
                    if (this._isRoomCardMode) {
                        text.setString(roundNumObj[i] + "局");
                    } else {
                        text.setString(roundNumObj[i] + "局(" + str_pay[i] + this._costName + ")");
                    }
                    if (roundNumObj[i].indexOf("quan") >= 0) {
                        if (this._isRoomCardMode) {
                            text.setString(roundNumObj[i] + "");
                        } else {
                            text.setString(roundNumObj[i] + "(" + str_pay[i] + this._costName + ")");
                        }
                        text.setString(text.getString().replace("quan", "圈"));
                    }
                }
            }
        }
    },
    setDiaNumData: function (gameNode) {
        var pPriceCfg = this.getPriceCfg();
        if (!pPriceCfg) return false;
        var roundNumObj = this.getRoundNumObj();

        var totalPayWayArray = [];
        for (var i = 0; i < this.payWayNodeArray.length; i++) {
            var payWayArr = [];
            for (var j in roundNumObj) {
                var __roundNum = roundNumObj[j];
                var __payWay = pPriceCfg[__roundNum];
                if (__payWay[i] || __payWay[i] == 0) payWayArr.push(__payWay[i]);
            }
            if (payWayArr.length > 0)
                totalPayWayArray.push(payWayArr);
        }


        var _btn_create_diamond = gameNode.getChildByName("btn_create_diamond");
        if (!_btn_create_diamond) {
            // 岳阳选项内容滑动，加在view下，创建房间，保存规则在上一层
            _btn_create_diamond = this.bg_node.getParent().getChildByName("btn_create_diamond");
        }
        var _roundNode = this._scroll_round || gameNode.getChildByName("round");
        var _diamondNumNode = _btn_create_diamond.getChildByName("dia_num");


        for (var i = 0; i < this.roundNodeArray.length; i++) {
            var roundNode = this.roundNodeArray[i];
            if (cc.sys.isObjectValid(roundNode)) {
                var text = roundNode.getChildByName("text");
                text && text.ignoreContentAdaptWithSize(true);
                var text_0 = roundNode.getChildByName("text_0");
                text_0 && text_0.ignoreContentAdaptWithSize(true);
            }
        }
        cc.log("===========================:" + totalPayWayArray)
        for (var i = 0; i < this.payWayNodeArray.length; i++) {
            var payWayNode = this.payWayNodeArray[i];
            if (cc.sys.isObjectValid(payWayNode) && payWayNode.isSelected()) {
                this.selectPay(roundNumObj, this._data.gameType, totalPayWayArray[i]);

            } else if (cc.sys.isObjectValid(payWayNode) && !totalPayWayArray[i]) {
                payWayNode.visible = false;
                cc.log('warn 房费按钮隐藏 setDiaNumData no payWay', totalPayWayArray, i);
            }
        }

        for (var i = 0; i < this.roundNodeArray.length; i++) {
            var roundNode = this.roundNodeArray[i];
            if (cc.sys.isObjectValid(roundNode) && roundNode.isSelected()) {
                this.selectRound(totalPayWayArray, i, _diamondNumNode, _btn_create_diamond);
            }
        }

    },
    selectRound: function (totalPayWayArray, index, diamondNumNode, btn_create_diamond) {
        var roundNumObj = this.getRoundNumObj();
        var roundOneIndex = -1;
        if (roundNumObj) {
            roundOneIndex = roundNumObj.indexOf("1");
        }
        this.setRoomCardFreeFeeVisible(roundOneIndex != index);
        if (this.setRoomCardPayModeFen && this.roomCardPayMode_radio) {
            //更新房费
            this.setRoomCardPayModeFen(this.roomCardPayMode_radio.getSelectIndex());
        }
        if (this.setPayNodeIsShow && this.setPayNodeIsShow) {
            //更新加收是否可见
            this.setPayNodeIsShow(this.roomCardPayMode_radio.getSelectIndex());
        }
        for (var i = 0; i < this.payWayNodeArray.length; i++) {
            var node = this.payWayNodeArray[i];
            if (cc.sys.isObjectValid(node) && node.isSelected() && totalPayWayArray[i]) {
                diamondNumNode.ignoreContentAdaptWithSize(true);
                diamondNumNode.setString("" + totalPayWayArray[i][index]);

                this.resetBtnCreateDiamond(btn_create_diamond, totalPayWayArray[i][index], diamondNumNode);
            }
            if (!totalPayWayArray[i]) {
                cc.log('warn selectRound no pay way ', JSON.stringify(totalPayWayArray), i)
            }
        }
    },
    clubCreateRoom: function () {
        var clubId = this._data.clubId;
        var ruleId = this._data.ruleId;
        var para = this.getSelectedPara();
        var that = this;
        MjClient.block();
        cc.log("clubCreateRoom sendInfo", JSON.stringify(para))
        MjClient.gamenet.request("pkclub.handler.createCustomRoom", {
            clubId: clubId,
            ruleId: ruleId,
            rule: para,
            area: { longitude: MjClient.native.GetLongitudePos(), latitude: MjClient.native.GetLatitudePos() },
        }, function (rtn) {
            MjClient.unblock();
            if (rtn.code == 0) {
                if (that.parentLayer)
                    that.parentLayer.removeFromParent();
                MjClient.joinGame(rtn.data, null, false, para.gameType);
            } else {
                FriendCard_Common.serverFailToast(rtn);
            }
            MjClient.unblock();
        });
    },
    createRoom: function () {
        var para = this.getSelectedPara();
        util.localStorageEncrypt.setNumberItem("KEY_GAME_TYPE", para.gameType);
        this.saveSelectedRoundNum();
        MjClient.createRoom(para, this.getSelectedRoundNum(), this.getSelectedPayWay());
        if (this.parentLayer)
            this.parentLayer.removeFromParent();
    },
    retainRule: function () {//俱乐部保存规则
        var para = this.getSelectedPara();
        var selectNumber = this._data.ruleNumer;
        util.localStorageEncrypt.setNumberItem("KEY_GAME_TYPE", para.gameType);

        if (this._textInput && this._textInput.getString() != "") {
            var _txt = FriendCard_Common.strReplace(this._textInput.getString());
            _txt = "(" + _txt + ")" + GameCnName[this._data.gameType];
            para.ruleName = escape(_txt);
        } else {
            para.ruleName = escape(GameCnName[this._data.gameType]);
        }
        if (this._isMatchMode) {
            para.isMatchLimit = this._matchModeLimitScoreRadio.getSelectIndex();
            para.matchLimitScore = this._matchModeLimitScoreEdt.value;

            if (FriendCard_Common.isOpenMatchDissolveLimit(this._data.gameType)) {
                para.isMatchDissolveLimit = this._matchModeEndGameScoreRadio.getSelectIndex();
                para.matchDissolveLimitScore = this._matchModeEndGameScoreEdt.value;
                if (FriendCard_Common.isOpenMatchScoreNeedEnough(this._data.gameType)) {
                    para.scoreNeedEnough = (this._checkBox_not_zone_score.visible && this._checkBox_not_zone_score.isSelected()) ? 1 : 0;
                } else {
                    para.scoreNeedEnough = 0;
                }
            }
        }

        para.round = this.getSelectedRoundNum();

        if (this._isRoomCardMode) {
            para.fangkaSource = this.roomCardPayMode_radio.getSelectIndex() + 1;
            para.fangkaCount = this._roomCardPayModeFen.value;
            if (this.difenMianKou.isSelected() && this.difenMianKou.visible) {
                para.fangkaFree = this.difenMianKou.value;
                para.isMianKouJiaShi = this.difenMianKou.mianKouJiaShi.isSelected();
            } else {
                para.fangkaFree = 0
                para.isMianKouJiaShi = false;
            }


            if (this.roomCardPayMode_radio.getSelectIndex() == 2) {//选中AA
                para.fangkaExtra = (this._roomCardAAPayNode.isVisible() && this.winnerAdded.isSelected()) ? this.winnerAdded.value : 0;
            } else {//没选中AA
                para.fangkaExtra = this.winnerPayNodes_radio.getSelectIndex();
            }
        } else {
            para.payWay = this.getSelectedPayWay();
        }

        //桌子皮肤
        var tableBoardCfg;
        if (MjClient.RuleParam["rule" + selectNumber]) {
            tableBoardCfg = MjClient.RuleParam["rule" + selectNumber].tableBoardCfg;
        }
        else {
            tableBoardCfg = 0;
        }
        para.tableBoardCfg = tableBoardCfg ? tableBoardCfg : 0;

        //晋中防作弊
        if (isJinZhongAPPType()) {
            if (this.customInfo) {
                para.customInfo = this.customInfo.isSelected(); //玩法是否可以玩家自主创房
            }
            if (this._playNode_gps) {
                para.isFangzuobi = this._playNode_gps.isSelected();
            }
            else {
                var temp_play = this.getNodePlayAndRound().playPanel;
                if (temp_play && temp_play.getChildByName("play_gps"))
                    para.isFangzuobi = temp_play.getChildByName("play_gps").isSelected();
                else if (this.bg_node.getChildByName("play_way") && this.bg_node.getChildByName("play_way").getChildByName("play_gps"))
                    para.isFangzuobi = this.bg_node.getChildByName("play_way").getChildByName("play_gps").isSelected();
                else
                    para.isFangzuobi = false;
            }


        }
        para.isFriendCard = true; // 把牌友圈信息标识带进去
        MjClient.RuleParam["rule" + selectNumber] = para;
        MjClient.gameType = para.gameType;
        cc.log(" ====== 选择的玩法是 ： ", selectNumber, JSON.stringify(para))
        // postEvent("retainRule"); 这个会和下面的高防冲突
        if (MjClient.FriendCard_infoUI) {
            if (MjClient.FriendCard_infoUI._data) {
                MjClient.FriendCard_infoUI.onAchieve(selectNumber); // selectNumber 参数 区分是保存并提交
            } else {
                if (MjClient.FriendCard_infoUI.updateWanfa) {
                    MjClient.FriendCard_infoUI.updateWanfa();
                }
            }
        }

        if (MjClient.FriendCard_ruleLayer) {
            MjClient.FriendCard_ruleLayer.reqChange(selectNumber)
        }
        if (MjClient.FriendCard_Match_ruleLayer) {
            MjClient.FriendCard_Match_ruleLayer.reqChange(selectNumber)
        }

        if (this.parentLayer)
            this.parentLayer.removeFromParent();
    },
    deleteRule: function () {
        var selectNumber = this._data.ruleNumer;
        MjClient.RuleParam["rule" + selectNumber] = "delete";
        if (MjClient.FriendCard_infoUI) {
            if (MjClient.FriendCard_infoUI._data) {
                MjClient.FriendCard_infoUI.onAchieve(selectNumber); // selectNumber 参数 区分是保存并提交
            } else {
                if (MjClient.FriendCard_infoUI.updateWanfa) {
                    MjClient.FriendCard_infoUI.updateWanfa();
                }
            }
        }
        if (MjClient.FriendCard_ruleLayer) {
            MjClient.FriendCard_ruleLayer.reqChange(selectNumber)
        }
        if (MjClient.FriendCard_Match_ruleLayer) {
            MjClient.FriendCard_Match_ruleLayer.reqChange(selectNumber)
        }
        if (this.parentLayer)
            this.parentLayer.removeFromParent();
    },
    getSelectedPara: function () {

    },
    getSelectedRoundNum: function () {
        //局数
        var roundNumObj = this.getRoundNumObj();
        var roundNum = roundNumObj[0];

        for (var i = 0; i < this.roundNodeArray.length; i++) {
            var roundNode = this.roundNodeArray[i];
            if (cc.sys.isObjectValid(roundNode) && roundNode.isSelected()) {
                roundNum = roundNumObj[i];
                break;
            }
        }
        return roundNum;
    },

    saveSelectedRoundNum: function () {
        //局数
        for (var i = 0; i < this.roundNodeArray.length; i++) {
            var roundNode = this.roundNodeArray[i];
            if (cc.sys.isObjectValid(roundNode) && roundNode.isSelected()) {
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_RondType, i + 1);
                break;
            }
        }
    },

    getSelectedPayWay: function () {
        //付房卡的方式
        var payWay = 0;
        for (var i = 0; i < this.payWayNodeArray.length; i++) {
            var payWayNode = this.payWayNodeArray[i];
            if (cc.sys.isObjectValid(payWayNode) && payWayNode.isSelected()) {
                payWay = i;
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PayWay, payWay);
            }
        }

        return payWay;
    },

    getPriceCfg: function () {
        var pGameType = this._data.gameType;
        var pMaxPlayer = this.getSelectPlayNum();//this.getSelectedPara().maxPlayer;
        var pPriceCfg = MjClient.data.gamePrice;
        if (!pPriceCfg[pGameType] || !pPriceCfg[pGameType][pMaxPlayer]) {
            var tipStr = '';
            if (!pPriceCfg[pGameType]) tipStr = '服务器没有' + pGameType + '的价格配置';
            if (pPriceCfg[pGameType]) tipStr = '服务器没有' + pGameType + '的' + pMaxPlayer + '人价格配置'
            var gamePriceCfg = JSON.stringify(pPriceCfg[pGameType] || {});
            tipStr += '\n' + gamePriceCfg;
            MjClient.showMsg(tipStr)
            return false;
        } else {
            return pPriceCfg[pGameType][pMaxPlayer];
        }
    },
    getRoundNumObj: function () {
        var maxPlayer = this.getSelectPlayNum();
        var gamePriceCfg = this.getGamePriceConfig()[maxPlayer];
        if (!gamePriceCfg) return {}
        var roundNumObj = Object.keys(gamePriceCfg).sort(function (a, b) { return a - b });
        return roundNumObj;
    },

    getGamePriceConfig: function () {
        var gameType = this._data.gameType;
        var gamePriceCfg = MjClient.data.gamePrice[gameType];
        return gamePriceCfg || {};
    },

    getExtraSelectedPara: function (para) {
        //底分
        para.difen = parseFloat(this.difen.getString());
        // 托管
        para.trustTime = this.trustTimes ? this.trustTimes[this.RedioGroup['tuoguan'] ? this.RedioGroup['tuoguan'].getSelectIndex() : 0] : 0;
        if (this.fanbei_radio) {
            var labelString = this.nodeListFanBei[1].getChildByName("score").getString();

            if (labelString == "不限分")
                para.fanBeiScore = 10000;
            else
                para.fanBeiScore = parseInt(labelString);
            para.fanBei = this.fanbei_radio.getSelectIndex();
        }


        //积分底分
        if (this.jieSuanDiFen) {
            para.jieSuanDiFen = this.difenAry[this.difenIndex];
        }

        // 封顶
        if (this.fengding_radio) {
            para.fengDing = this.fengding_radio.getSelectIndex();
        }

        //托管方式
        if (this.trustWayRadio) {
            para.isTrustWhole = false;
            para.trustWay = 0;
            for (var i = 0; i < this.trustWayNodeList.length; i++) {
                if (this.trustWayNodeList[i].isSelected()) {
                    para.trustWay = i;
                    para.isTrustWhole = true;
                    break;
                }
            }
        }
    },
    setExtraPlayNodeCurrentSelect: function (isClub) {
        if (this.fanbei_radio) {
            // 大结算翻倍
            var fanBeiOption;
            var fanBeiScore;
            if (isClub) {
                fanBeiScore = this.getNumberItem("fanBeiScore", 10);
                fanBeiOption = this.getNumberItem("fanBei", 0);
            }
            else {
                fanBeiOption = util.localStorageEncrypt.getNumberItem(this.localStorageKey.fanBei, 0);
                fanBeiScore = util.localStorageEncrypt.getNumberItem(this.localStorageKey.fanBeiScore, 10);
            }

            this.fanbei_radio.selectItem(fanBeiOption)
            this.nodeListFanBei[1].getChildByName("score").setString(fanBeiScore <= 100 ? fanBeiScore + "分" : "不限分");
            this.fanBeiRadioBoxSelectCB(fanBeiOption, this.nodeListFanBei[fanBeiOption], this.nodeListFanBei);
        }

        //托管
        if (this.tuoguanNodeList && this.tuoguanNodeList.length) {
            var trustTime;
            if (isClub)
                trustTime = this.getNumberItem("trustTime", 0);
            else
                trustTime = util.localStorageEncrypt.getNumberItem(this.localStorageKey.tuoGuan, 0);

            var trustTimes = this.trustTimes;
            var index = 0;
            for (var i = 0; i < this.tuoguanNodeList.length; i++) {
                var bSelected = trustTime == trustTimes[i];
                this.tuoguanNodeList[i].setSelected(bSelected);

                if (bSelected)
                    index = i;
            }
            this.radioBoxSelectCB(index, this.tuoguanNodeList[index], this.tuoguanNodeList);

            // this.refreshTrustWays(index, true);
        }

        //积分底分
        if (this.jieSuanDiFen) {
            var diFen;
            if (isClub) {
                diFen = this.getNumberItem("jieSuanDiFen", 1);
            } else {
                diFen = util.localStorageEncrypt.getNumberItem(this.localStorageKey.jieSuanDiFen, 1);
            }
            this.difenIndex = this.difenAry.indexOf(diFen);
            if (this.difenIndex < 0) this.difenIndex = 1;
            var text_diFen = this.jieSuanDiFen.getChildByName("text_diFen");
            text_diFen.setString(this.difenAry[this.difenIndex] + "");

        }

        // 封顶
        if (this.fengding_radio) {
            var option = null;
            if (isClub)
                option = this.getNumberItem("fengDing", 0);
            else
                option = util.localStorageEncrypt.getNumberItem(this.localStorageKey.fengDing, 0);

            this.fengding_radio.selectItem(option)
            this.radioBoxSelectCB(option, this.nodeListFengDing[option], this.nodeListFengDing);
        }

        if (this._nodeGPS) {
            var _bTempGPS;
            if (isClub)
                _bTempGPS = this.getBoolItem("gps", false);
            else
                _bTempGPS = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_GPS, false);
            this._nodeGPS.setSelected(_bTempGPS);
            if (this._nodeGPS.isSelected()) {
                this._nodeGPS.getChildByName("text").setColor(this._selectColor);
            } else {
                this._nodeGPS.getChildByName("text").setColor(this._unSelectColor);
            }
        }

        let roundNumObj = this.getRoundNumObj(),
            pNums = Object.keys(this.getGamePriceConfig()).map(a => Number(a)),
            cacheRule = JSON.parse(util.localStorageEncrypt.getStringItem(KEYCURRGAMERULE + this._data.gameType, '{}'));
        const key_nameR = {
            'jushu': ['round', Number(roundNumObj[0]), roundNumObj],
            'zhifufangshi': ['payWay', 0, [0, 1, 2]],
            'renshu': ['maxPlayer', Number(pNums[0]), pNums],
        }
        let len = Object.keys(key_nameR);
        for (let _i = 0; _i < len.length; _i++) {
            let key = len[_i], val = key_nameR[key];
            let _current, selectIndex, currObj;
            if (isClub) {
                if (typeof val[1] === 'number')
                    _current = this.getNumberItem(val[0], val[1]);
                else if (typeof val[1] === 'boolean')
                    _current = this.getBoolItem(val[0], val[1]);
            }
            else
                _current = cacheRule[val[0]] || val[1];
            selectIndex = val[2].indexOf(_current);
            currObj = this.RedioGroup[key];
            if (currObj) {
                currObj.selectItem(selectIndex);
                this.radioBoxSelectCB(selectIndex, currObj._nodeList[selectIndex], currObj._nodeList);
                if (key === 'renshu') this.changePayForPlayerNum(selectIndex);
            }
        }
    },
});