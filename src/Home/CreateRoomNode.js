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
        this._costName = '元宝';
        this.localStorageKey = {};
        this.localStorageKey.KEY_RondType = "_ROUND_TYPE"; //局数选定
        this.localStorageKey.KEY_PayWay = "_PAY_WAY"; //付房卡的方式
        this.localStorageKey.KEY_GPS = "_GPS";
        this._clubIsCreateRoom = false;  //俱乐部自主创建房间

        MjClient.createRoomNode = this;
        MjClient._customValue = {};

        this._selectColor = BTNCOLOR1;
        this._unSelectColor = BTNCOLOR3;

        if (this._isFriendCard) {
            if (this._data.clubRule)
                this.clubRule = this._data.clubRule;
            else
                this.clubRule = {};

        }
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
        this.changeUiForClubMode();
        this._view.setScrollBarEnabled(false);
    },
    //初始化结束需要做的事情
    initEnd: function () {
        if (this._isFriendCard && cc.sys.isObjectValid(this.payWayNodeArray[0])) {
            var _text = this.payWayNodeArray[0].getChildByName("text");
            _text.setString("圈主付");
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
            var txt = sender.getChildByName("text");
            txt.ignoreContentAdaptWithSize(true);
            txt.setTextColor(selectColor);
            var len = list.length;
            for (var i = 0; i < len; i++) {
                var radioBox = list[i];

                if (radioBox !== sender || sender.isSelected() == false) {
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
            if (row.name == 'fuwufei') {
                this.initFuwuFeiNode(row);
                continue;
            }
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
                if (p.name === 'fuwufei') {
                    let txt = null;
                    if (item.name == 'btnRadiotf1' || item.name == 'btnRadiotf2') {
                        txt = 'tongfenpay';
                    } else txt = 'fuwufeipay';
                    if (txt) {
                        let currObj = this.RedioGroup[txt];
                        if (currObj) this.radioBoxSelectCB(indx, currObj._nodeList[indx], currObj._nodeList);
                        this.setFuwufeiNode();
                    }
                } else {
                    let currObj = this.RedioGroup[p.name];
                    if (p.name == 'renshu') this.changePayForPlayerNum(indx);
                    else if (p.name == 'zhifufangshi') this.setDiaNumData(this.bg_node);
                    if (currObj) this.radioBoxSelectCB(indx, currObj._nodeList[indx], currObj._nodeList);
                }
            }
        } else if (indx != null && indx != undefined) {
            var text = indx.getChildByName("text");
            this.selectedCB(text, indx.isSelected());
            if (indx.name == 'btnCheckdfmc') this.initDFMKbTNS();
            if (indx.name == 'btnCheckdfjs') this.initDFjsbTNS();
        } else if (!indx && item) {
            item = this._btnItems.find(b => b.name == item);
            if (item) {
                var text = item.getChildByName("text");
                this.selectedCB(text, item.isSelected());
            }
            this.initDFMKbTNS();
            this.initDFjsbTNS();
        }
    },
    initFuWuFeiNodeFC: function (indx = 0, isAdd = true) {
        if (this._view) {
            const n = this._view.getChildByName('fuwufei'), fg = n ? n.visible : false;
            if (fg) {
                let dy = 60 * (isAdd ? 1 : -1) + 240 * indx;
                //修正scrollView的滑动区域
                this._view.setInnerContainerSize(cc.size(this._view.getInnerContainerSize().width, this._view.getInnerContainerSize().height + dy));
                for (let _i = 0; _i < this._view.children.length; _i++) {
                    const item = this._view.children[_i];
                    item.y += dy;
                    if (item.name === 'fuwufei') {
                        break;
                    }
                }
            }
        }
    },

    initDFMKbTNS: function () {
        return
        if (this._data.clubType != 0) return;
        const checked = this.getCheckboxSelectedByName('btnCheckdfmc'),
            addb = this.getBtnByName('Btnadd1'),
            muins = this.getBtnByName('Btnmiuns1');
        addb.setEnabled(checked);
        muins.setEnabled(checked);
        this.dfmk.setEnabled(checked);
    },

    initDFjsbTNS: function () {
        if (this._data.clubType != 0) return;
        const checked = this.getCheckboxSelectedByName('btnCheckdfjs'),
            addb = this.getBtnByName('Btnadd2'),
            muins = this.getBtnByName('Btnmiuns2');
        addb.setEnabled(checked);
        muins.setEnabled(checked);
        this.dfjs.setEnabled(checked);
    },

    setFuwufeiNode: function () {
        if (this._data.clubType != 0) return;
        let currObj = this.RedioGroup['fuwufeipay'];
        let currObj1 = this.RedioGroup['tongfenpay'];
        let isTrue = currObj.getSelectIndex() != 1;
        currObj1._nodeList.map(n => {
            n.setEnabled(isTrue);
            let text = n.getChildByName("text");
            this.selectedCB(text, n.isSelected() && isTrue);
        })
    },

    initFuwuFeiNode: function (row) {
        row.visible = this._data.clubType === 0;
        if (row.visible) {
            this.qujianItems = [];
            //区间item
            this.qujianItem = row.getChildByName('qujian').getChildByName('qujian0');
            this.qujianItems.push(this.qujianItem);
            this.initQuJianItem();
            this.initFuWuFeiNodeFC(1);
            //大赢家 所有赢家
            let btns = [row.getChildByName('btnRadiogf'), row.getChildByName('btnRadiodf')];
            let _radio = createRadioBoxForCheckBoxs(btns, this.callSelectBack.bind(this), 0);
            this.RedioGroup['fuwufeipay'] = _radio;
            this.addListenerText(btns, _radio, this.callSelectBack.bind(this));
            //同分
            btns = [row.getChildByName('btnRadiotf1'), row.getChildByName('btnRadiotf2')];
            _radio = createRadioBoxForCheckBoxs(btns, this.callSelectBack.bind(this), 0);
            this.RedioGroup['tongfenpay'] = _radio;
            this.addListenerText(btns, _radio, this.callSelectBack.bind(this));
            //低分解散
            col = row.getChildByName('btnCheckdfjs');
            this._btnItems.push(col);
            col.addEventListener(this.callSelectBack.bind(this), col);
            this.addListenerText(col, null, this.callSelectBack.bind(this));
            //底分加減（1-20）
            let Btnadd = row.getChildByName('qujian').getChildByName('Btnadd');
            if (Btnadd) {
                Btnadd.addTouchEventListener((sender, Type) => {
                    switch (Type) {
                        case ccui.Widget.TOUCH_ENDED:
                            this.qujianItems.push(this.qujianItem.clone());
                            this.initQuJianItem();
                            this.initFuWuFeiNodeFC();
                            break;
                        default:
                            break;
                    }
                }, this);
            }
            let panel = row.getChildByName('Panel2');
            if (panel) {
                var _textFeildName0 = new cc.EditBox(cc.size(60, 45), new cc.Scale9Sprite());
                _textFeildName0.setFontColor(cc.color(255, 255, 255));
                _textFeildName0.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);
                _textFeildName0.setPlaceHolder("");
                _textFeildName0.setFontSize(20);
                _textFeildName0.setPosition(panel.getContentSize().width / 2, panel.getContentSize().height / 2);
                panel.addChild(_textFeildName0);
                let baseScoreT = this.dfjs = _textFeildName0;
                baseScoreT.setString(1);
                this._btnItems.push(row.getChildByName('Btnadd2'))
                row.getChildByName('Btnadd2').addTouchEventListener((sender, Type) => {
                    switch (Type) {
                        case ccui.Widget.TOUCH_ENDED:
                            let num = Number(baseScoreT.getString());
                            baseScoreT.setString(num + 1);
                            break;
                        default:
                            break;
                    }
                }, this);
                this._btnItems.push(row.getChildByName('Btnmiuns2'))
                row.getChildByName('Btnmiuns2').addTouchEventListener((sender, Type) => {
                    switch (Type) {
                        case ccui.Widget.TOUCH_ENDED:
                            let num = Number(baseScoreT.getString());
                            if (num === 0) {
                                baseScoreT.setString(0);
                            } else {
                                baseScoreT.setString(num - 1);
                            }
                            break;
                        default:
                            break;
                    }
                }, this);
            }
            let df = row.getChildByName('difen');
            if (df) {
                var pn = df.getChildByName('Panel_3'),
                    _textFeildName0 = new cc.EditBox(cc.size(60, 45), new cc.Scale9Sprite());
                _textFeildName0.setFontColor(cc.color(255, 255, 255));
                _textFeildName0.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);
                _textFeildName0.setPlaceHolder("");
                _textFeildName0.setFontSize(20);
                _textFeildName0.setPosition(pn.getContentSize().width / 2, pn.getContentSize().height / 2);
                pn.addChild(_textFeildName0);
                this.rcdf = _textFeildName0;
                this.rcdf.setString(1);
                this._btnItems.push(df.getChildByName('BtnPlusrc2'))
                df.getChildByName('BtnPlusrc2').addTouchEventListener((sender, Type) => {
                    switch (Type) {
                        case ccui.Widget.TOUCH_ENDED:
                            let num = Number(this.rcdf.getString());
                            this.rcdf.setString(num + 1);
                            break;
                        default:
                            break;
                    }
                }, this);
                this._btnItems.push(df.getChildByName('BtnMinusrc1'))
                df.getChildByName('BtnMinusrc1').addTouchEventListener((sender, Type) => {
                    switch (Type) {
                        case ccui.Widget.TOUCH_ENDED:
                            let num = Number(this.rcdf.getString());
                            if (num <= 0) {
                                this.rcdf.setString(0);
                            } else {
                                this.rcdf.setString(num - 1);
                            }
                            break;
                        default:
                            break;
                    }
                }, this);
            }
        }
    },
    //初始化区间
    initQuJianItem: function (msg = { min: 1, max: 50, score: 10 }) {
        if (!this.qujianItems) return;
        const len = this.qujianItems.length - 1, item = this.qujianItems[len];
        if (item) {
            const fun = (image, data, indx) => {
                var s = image.getContentSize(), off = cc.size(s.width - (indx == 2 ? 80 : 10), s.height - 5)
                var textInput = new cc.EditBox(off, new cc.Scale9Sprite());
                textInput.setFontColor(cc.color(255, 255, 255));
                textInput.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);
                textInput.setReturnType(cc.KEYBOARD_RETURNTYPE_DONE);
                textInput.setPosition(s.width / 2, s.height / 2);
                image.addChild(textInput);
                textInput.name = 'txt';
                textInput.setString(data);
                return textInput;
            };
            let baseScoreT = null;
            item.getParent() || this.qujianItem.getParent().addChild(item);
            item.setPositionY(30 - 60 * len);
            for (let _i = 0; _i < 3; _i++) {
                const txt = item['txt' + _i] ? item['txt' + _i] : fun(item.getChildByName('Panel' + _i), msg[{ 0: 'min', 1: 'max', 2: 'score' }[_i]], _i);
                _i == 2 && (baseScoreT = txt);
                item['txt' + _i] = txt;
                txt.setString(msg[{ 0: 'min', 1: 'max', 2: 'score' }[_i]])
            }
            if (baseScoreT) {
                let btn = item.getChildByName('Btnadd');
                if (btn) {
                    this._btnItems.push(btn)
                    btn.addTouchEventListener((sender, Type) => {
                        switch (Type) {
                            case ccui.Widget.TOUCH_ENDED:
                                let num = Number(baseScoreT.getString());
                                baseScoreT.setString(num + 1);
                                break;
                            default:
                                break;
                        }
                    }, this);
                }
                btn = item.getChildByName('Btnmiuns');
                if (btn) {
                    this._btnItems.push(btn)
                    btn.addTouchEventListener((sender, Type) => {
                        switch (Type) {
                            case ccui.Widget.TOUCH_ENDED:
                                let num = Number(baseScoreT.getString());
                                if (num <= 0) {
                                    baseScoreT.setString(0);
                                } else {
                                    baseScoreT.setString(num - 1);
                                }
                                break;
                            default:
                                break;
                        }
                    }, this);
                }
            }

            let BtnJian = item.getChildByName('Btnjian');
            if (BtnJian) {
                BtnJian.visible = len != 0;
                BtnJian._indx = len;
                BtnJian.addTouchEventListener((sender, Type) => {
                    switch (Type) {
                        case ccui.Widget.TOUCH_ENDED:
                            if (sender._indx >= 0) {
                                let delItem = this.qujianItems.splice(sender._indx, 1)[0];
                                let posArr = [];
                                for (let _i = 0; _i < this.qujianItems.length; _i++) {
                                    const hItem = this.qujianItems[_i], btnItem = hItem.getChildByName('Btnjian');
                                    btnItem.visible = _i != 0;
                                    btnItem._indx = _i;
                                    posArr.push(hItem.getPosition());
                                    if (_i < sender._indx) continue;
                                    else if (_i == sender._indx) hItem.setPosition(delItem.getPosition());
                                    else hItem.setPosition(posArr[_i - 1]);
                                }
                                delItem.removeFromParent(true);
                                this.initFuWuFeiNodeFC(0, false);
                            }
                            break;
                        default:
                            break;
                    }
                }, this);
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
        _helpNode.setPosition(this._nodeGPS.getContentSize().width * 3.8, this._nodeGPS.getContentSize().height / 2);
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
        cc.log('-------getRedioSelectByName--------', str)
        if (!this._view || !str) return 0;
        let childs = this._view.getChildByName(str).children.filter(n => {
            if (n && n.name) return n.name.indexOf('btnRadio') > -1 || n.name.indexOf('btnCheck') > -1;
            else return false;
        });
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
        // textInput.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);
        textInput.setReturnType(cc.KEYBOARD_RETURNTYPE_DONE);
        textInput.setPlaceHolder("填写别名");

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
                    // if (rule && !FriendCard_Common.isNumber(rule)) {
                    //     MjClient.showToast("请填写0-4位的阿拉伯数字");
                    //     return;
                    // }
                    if (!rule || rule.length == 0)
                        MjClient.showToast("玩法别名不能为空");
                    else
                        this.retainRule();
                    break;
                default:
                    break;
            }
        }, this);
        const close = dialog.getChildByName("Image_bg").getChildByName("close");
        if (close) {
            close.visible = true;
            close.addTouchEventListener(function (sender, Type) {
                switch (Type) {
                    case ccui.Widget.TOUCH_ENDED:
                        dialog.removeFromParent(true);
                        break;
                    default:
                        break;
                }
            }, this);
        }

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

        if (this._data.clubType === 0) {
            para.isDissolveLimit = this.getCheckboxSelectedByName('btnCheckdfjs');
            para.dissolveLimitScore = Number(this.dfjs.getString());
            para.serverCharge = this.RedioGroup['fuwufeipay'].getSelectIndex();
            let counts = [];
            for (let _i = 0; _i < this.qujianItems.length; _i++) {
                const item = this.qujianItems[_i];
                counts.push({
                    min: Number(item.txt0.getString()),
                    max: Number(item.txt1.getString()),
                    score: Number(item.txt2.getString()),
                })
            }
            para.serverCount = counts;
            para.serverFreeScore = 0;//this.getCheckboxSelectedByName('btnCheckdfmc') ? Number(this.dfmk.getString()) : 0;
            para.serverExtra = para.serverCharge === 2 ? 0 : this.RedioGroup['tongfenpay'].getSelectIndex() + 1;
            para.enterScore = Number(this.rcdf.getString());
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
        cc.log('------------sdwadw---------', this.RedioGroup['tuoguan'].getSelectIndex())
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
            'tuoguan': ['trustTime', 0, this.trustTimes || [0, 30, 60, 90]],
            'fuwufeipay': ['serverCharge', 0, [0, 1]],
            'tongfenpay': ['serverExtra', 1, [1, 2]],
        }
        //底分
        let num = 1;
        if (isClub)
            num = this.getNumberItem('difen', 1);
        else
            num = cacheRule['difen'] != undefined ? cacheRule['difen'] : 1;
        if (this.difen) this.difen.setString(num);

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
            currObj = this.RedioGroup[key];
            if (currObj) {
                currObj.selectItem(selectIndex);
                this.radioBoxSelectCB(selectIndex, currObj._nodeList[selectIndex], currObj._nodeList);
                if (key === 'renshu') this.changePayForPlayerNum(selectIndex);
            }
        }
        if (this._data.clubType === 0) {
            let isTrue;
            if (isClub)
                isTrue = this.getBoolItem('isDissolveLimit', false);
            else
                isTrue = cacheRule['isDissolveLimit'] != undefined ? cacheRule['isDissolveLimit'] : false;
            let btnNode = this._btnItems.find(b => b.name == 'btnCheckdfjs');
            if (btnNode) {
                btnNode.setSelected(isTrue);
                var text = btnNode.getChildByName("text");
                this.selectedCB(text, isTrue);
            }
            let num = 1;
            if (isClub)
                num = this.getNumberItem('dissolveLimitScore', 1);
            else
                isTrue = cacheRule['dissolveLimitScore'] != undefined ? cacheRule['dissolveLimitScore'] : 1;
            if (this.dfjs) this.dfjs.setString(num);
            if (isClub)
                num = this.getNumberItem('enterScore', 1);
            else
                isTrue = cacheRule['enterScore'] != undefined ? cacheRule['enterScore'] : 1;
            if (this.rcdf) this.rcdf.setString(num);
            let counts = [];
            if (isClub)
                counts = this.clubRule['serverCount'] || [{ min: 1, max: 50, score: 10 }];
            else
                counts = cacheRule['serverCount'] != undefined ? cacheRule['serverCount'] : [{ min: 1, max: 50, score: 10 }];
            for (let _i = 0; _i < counts.length; _i++) {
                const cnt = counts[_i];
                _i == 0 || this.qujianItems.push(this.qujianItem.clone());
                this.initQuJianItem(cnt);
                _i == 0 || this.initFuWuFeiNodeFC();
            }
        }
        this.setFuwufeiNode();
        this.initDFMKbTNS();
        this.initDFjsbTNS();
    },
    //----------------------------亲友圈相关-------------------------------------------------------------
    changeUiForClubMode: function () {
        var parentNode = this._view;
        //房卡模式,有房费的保留位置，没有的放在人数下面，没有人数放在局数下面  item hegith 63
        this.getTextNodeByValue = function (node, value, notValues) {
            var childrens = node.getChildren();
            if (childrens) {
                for (var i in childrens) {
                    if (childrens[i].getChildren() && childrens[i].getChildren().length > 0) {
                        var fenShuNode = this.getTextNodeByValue(childrens[i], value, notValues);
                        if (fenShuNode) {
                            return fenShuNode;
                        }
                    } else {
                        var type_name = childrens[i].getDescription();
                        if (type_name == "Label") {
                            var text = childrens[i].getString().replace(/\s+/g, "");
                            //cc.log("getTextNodeByValue ",text);
                            if (text.indexOf(value) != -1) {
                                if (notValues) {
                                    var hasFind = false;
                                    for (var j = 0; j < notValues.length; j++) {
                                        if (text.indexOf(notValues[j]) != -1) {
                                            hasFind = true;
                                        }
                                    }
                                    if (!hasFind) {
                                        return childrens[i];
                                    }
                                } else {
                                    return childrens[i];
                                }
                            }

                        }
                    }
                }
            }
            var type_name = node.getDescription();
            if (type_name == "Label" && node.getString().replace(/\s+/g, "").indexOf(value) != -1) {
                return node;
            }
        };

        this.changeItemY = function (node, topNodePos, dy, offset) {//offset偏差
            if (!node) {
                cc.log("changeItemY node is null");
                return;
            } else {

            }
            if (typeof (offset) == 'undefined') {
                offset = 15;
            }
            var childrens = node.getChildren();
            if (childrens) {
                for (var i in childrens) {
                    if (childrens[i].name == "play" || childrens[i].name == "round") {
                        continue;
                    }
                    if (childrens[i].name == "play_way" && this._cardRoomOptNode == node) {
                        continue;
                    }
                    if (childrens[i].name == "title" && childrens[i].getChildren() && childrens[i].getChildren().length > 0) {
                        continue;
                    }

                    if (this._cardRoomOptNode == node && childrens[i].name == "difen" && childrens[i].getChildren() && childrens[i].getChildren().length > 0) {
                        continue;
                    }
                    if (childrens[i].name == "roomCardPayModeTipText") {
                        continue;
                    }
                    if (this._cardRoomOptNode == node) {
                        if (childrens[i].name == "btn_create" || childrens[i].name == "btn_ruleretain" || childrens[i].name == "btn_create_diamond"
                            || childrens[i].name == "Image_3" || childrens[i].name == "btn_add" || childrens[i].name == "txt_fen" || childrens[i].name == "btn_sub"
                        ) {
                            continue;
                        }
                    }
                    if (childrens[i].name && (childrens[i].name.indexOf("keep_position") != -1)) {
                        continue;
                    }
                    var nodePos = childrens[i].getParent().convertToWorldSpace(childrens[i].getPosition());
                    if (topNodePos) {
                        if (this._ziYouRenNode && this._ziYouRenNode.getParent() == childrens[i]) {
                            continue;
                        }
                        if (this._realTimeVoiceNode && this._realTimeVoiceNode.getParent() == childrens[i]) {
                            if (topNodePos.y - nodePos.y > offset + dy) {
                                childrens[i].setPositionY(childrens[i].getPosition().y - dy);
                            }
                            continue;
                        }
                        if (topNodePos.y - nodePos.y > offset) {
                            childrens[i].setPositionY(childrens[i].getPosition().y - dy);
                        }
                    } else {
                        childrens[i].setPositionY(childrens[i].getPosition().y - dy);
                    }

                }
            }
        };

        this.findNodeByNameKey = function (node, keyValue, func) {
            var childrens = node.getChildren();
            if (childrens) {
                for (var i in childrens) {
                    if (childrens[i].name && childrens[i].name.indexOf(keyValue) != -1) {
                        if (func) {
                            func(childrens[i])
                        }
                    } else {
                        if (childrens[i].getChildren() && childrens[i].getChildren().length > 0) {
                            this.findNodeByNameKey(childrens[i], keyValue, func);
                        }
                    }
                }
            }
        }

        this.getListTextNodeByValue = function (node, value, callFunc, list) {
            var childrens = node.getChildren();

            if (childrens) {
                for (var i in childrens) {
                    if (childrens[i].getChildren() && childrens[i].getChildren().length > 0) {
                        var fenShuNode = this.getListTextNodeByValue(childrens[i], value, callFunc, list);
                        if (fenShuNode) {
                            //fenShuNode.visible = false
                            list.push(fenShuNode);
                        }
                    } else {
                        var type_name = childrens[i].getDescription();
                        if (type_name == "Label") {
                            var text = childrens[i].getString().replace(/\s+/g, "");
                            if (text.indexOf(value) != -1) {
                                //childrens[i].visible = false;
                                list.push(childrens[i]);
                            }

                        }
                    }
                }
            }
            var type_name = node.getDescription();
            if (type_name == "Label" && node.getString().replace(/\s+/g, "").indexOf(value) != -1) {
                list.push(node);
                //node.visible = false;
            }
            callFunc(list);
        };

        this.changeUiForMatchMode(parentNode);
        this.changeUiForRoomCardMode(parentNode);
    },
    //亲友圈比赛插入节点
    changeUiForMatchMode: function (parentNode) {
        if (!this._isMatchMode) {
            return;
        }
        var that = this;
        var dy = 64;
        var matchModeNodeMoreHeight = 0;//拓展的时候高度在这里增加
        if (FriendCard_Common.isOpenMatchDissolveLimit(this._data.gameType)) {
            matchModeNodeMoreHeight += 64;
        }
        if (FriendCard_Common.isOpenMatchScoreNeedEnough(this._data.gameType)) {
            matchModeNodeMoreHeight += 64;
        }
        this._matchModeNode = parentNode.getChildByName("matchModeNode");//一些难兼容的玩法，直接在创建房间ui加入节点
        if (!this._matchModeNode) {
            if (parentNode.setInnerContainerSize) {//增加scrollview的高度
                //修正scrollView的滑动区域增加插入ui的高度
                parentNode.setInnerContainerSize(cc.size(parentNode.getInnerContainerSize().width, parentNode.getInnerContainerSize().height + dy + matchModeNodeMoreHeight));
                //添加房卡模式选项node
                var matchModeNode = ccs.load("CreateRoomMatchMode.json").node;
                //matchModeNode.zIndex = -1;
                matchModeNode.setPosition(cc.p(0, parentNode.getInnerContainerSize().height - dy / 2))
                this._matchModeNode = matchModeNode;
                //顶部插入点
                parentNode.addChild(matchModeNode)
            } else {
                MjClient.showToast("此玩法未兼容比赛场!!!")
            }

        }
        if (this._matchModeNode) {

            //以下是比赛模式节点
            this._matchModeNode.visible = true;
            this._matchModeNode = this._matchModeNode.getChildByName("matchMode");
            this._matchModeNode.config = {
                limitMin: -2000,
                limitMax: 10000,
                dValue: 1,
                defaultValue: 100,
                defaultOpenIndex: 0
            }

            //比赛场进入房间规则start
            this._matchModeLimitScore = this._matchModeNode.getChildByName("txt_fen");//不需要text了，改成可editbox
            this._matchModeLimitScore.ignoreContentAdaptWithSize(true);
            var image_fen_bg = this._matchModeNode.getChildByName("Image_3");
            var edtContentSize = image_fen_bg.getContentSize();
            var edt_input = new cc.EditBox(edtContentSize, new cc.Scale9Sprite());
            this._matchModeLimitScoreEdt = edt_input;
            edt_input.setFontColor(this._matchModeLimitScore.getTextColor());
            edt_input.setPlaceholderFontColor(cc.color(0xFF, 0xFF, 0xFF));
            edt_input.setMaxLength(10);
            edt_input.setFontSize(this._matchModeLimitScore.getFontSize());
            edt_input.setInputFlag(cc.EDITBOX_INPUT_FLAG_INITIAL_CAPS_ALL_CHARACTERS);
            edt_input.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
            edt_input.setReturnType(cc.KEYBOARD_RETURNTYPE_DONE);
            edt_input.setPlaceHolder("");
            edt_input.setPlaceholderFontSize(this._matchModeLimitScore.getFontSize());
            edt_input.setPosition(edtContentSize.width / 2, edtContentSize.height / 2);

            edt_input.editBoxEditingDidEnd = function (editBox) {
                var str = editBox.getString();
                while (str != "0" && str.indexOf("0") == 0) {
                    //避免parseInt转化八进制或十六进制
                    str = str.substring(1, str.length);
                }
                var input = parseInt(str);
                if (editBox.getString().length == 0 || input == null || isNaN(input)) {
                    input = that._matchModeNode.config.defaultValue
                } else if (input > that._matchModeNode.config.limitMax) {
                    input = that._matchModeNode.config.limitMax
                } else if (input < that._matchModeNode.config.limitMin) {
                    input = that._matchModeNode.config.limitMin
                }
                that._matchModeLimitScoreEdt.value = parseInt(input);
                that.setMatchModeLimitScore();
            };

            edt_input.setDelegate(edt_input);
            image_fen_bg.addChild(edt_input);
            this._matchModeLimitScore.visible = false;


            this._matchModeLimitScoreNodes = [];
            this._matchModeLimitScoreNodes.push(this._matchModeNode.getChildByName("match_no_limit"));
            this._matchModeLimitScoreNodes.push(this._matchModeNode.getChildByName("match_limit"));

            this._matchModeLimitScoreRadio = createRadioBoxForCheckBoxs(this._matchModeLimitScoreNodes, function (index) {
                this.radioBoxSelectCB(index, this._matchModeLimitScoreNodes[index], this._matchModeLimitScoreNodes);
            }.bind(this));
            this.addListenerText(this._matchModeLimitScoreNodes, this._matchModeLimitScoreRadio, function (index) {

            }.bind(this));

            this._matchModeLimitScoreSub = this._matchModeNode.getChildByName("btn_sub");
            this._matchModeLimitScoreSub.addTouchEventListener(function (sender, type) {
                if (type == 2) {
                    this.setMatchModeLimitScore("sub");
                }
            }, this);
            this._matchModeLimitScoreAdd = this._matchModeNode.getChildByName("btn_add");
            this._matchModeLimitScoreAdd.addTouchEventListener(function (sender, type) {
                if (type == 2) {
                    this.setMatchModeLimitScore("add");
                }
            }, this);

            this.setMatchModeLimitScore = function (action) {
                if (action == "sub") {
                    this._matchModeLimitScoreEdt.value -= this._matchModeNode.config.dValue;
                } else if (action == "add") {
                    this._matchModeLimitScoreEdt.value += this._matchModeNode.config.dValue;
                }
                if (this._matchModeLimitScoreEdt.value < this._matchModeNode.config.limitMin) {
                    this._matchModeLimitScoreEdt.value = this._matchModeNode.config.limitMax;
                }
                if (this._matchModeLimitScoreEdt.value > this._matchModeNode.config.limitMax) {
                    this._matchModeLimitScoreEdt.value = this._matchModeNode.config.limitMin;
                }
                this._matchModeLimitScoreEdt.setString("" + this._matchModeLimitScoreEdt.value);
            }
            var currentSelect = this.getNumberItem("isMatchLimit", this._matchModeNode.config.defaultOpenIndex);
            this._matchModeLimitScoreEdt.value = this.getNumberItem("matchLimitScore", this._matchModeNode.config.defaultValue);
            this._matchModeLimitScoreRadio.selectItem(currentSelect);
            this.setMatchModeLimitScore();
            //比赛场进入房间规则end


            //比赛场解散房间start
            var endGameNode = this._matchModeNode.getChildByName("endRoomConfigNode");
            if (FriendCard_Common.isOpenMatchDissolveLimit(this._data.gameType)) {
                endGameNode.config = {
                    limitMin: 0,
                    limitMax: 10000,
                    dValue: 1,
                    defaultValue: 100,
                    defaultOpenIndex: 0,
                    defaultScoreNeedEnough: 0,
                }
                var textEndGameScore = endGameNode.getChildByName("txt_fen");//不需要text了，改成可editbox
                textEndGameScore.ignoreContentAdaptWithSize(true);
                var image_fen_bg = endGameNode.getChildByName("Image_3");
                var edtContentSize = image_fen_bg.getContentSize();
                var edt_input_endGame = new cc.EditBox(edtContentSize, new cc.Scale9Sprite());
                this._matchModeEndGameScoreEdt = edt_input_endGame;
                edt_input_endGame.setFontColor(textEndGameScore.getTextColor());
                edt_input_endGame.setPlaceholderFontColor(cc.color(0xFF, 0xFF, 0xFF));
                edt_input_endGame.setMaxLength(10);
                edt_input_endGame.setFontSize(textEndGameScore.getFontSize());
                edt_input_endGame.setInputFlag(cc.EDITBOX_INPUT_FLAG_INITIAL_CAPS_ALL_CHARACTERS);
                edt_input_endGame.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
                edt_input_endGame.setReturnType(cc.KEYBOARD_RETURNTYPE_DONE);
                edt_input_endGame.setPlaceHolder("");
                edt_input_endGame.setPlaceholderFontSize(textEndGameScore.getFontSize());
                edt_input_endGame.setPosition(edtContentSize.width / 2, edtContentSize.height / 2);

                edt_input_endGame.editBoxEditingDidEnd = function (editBox) {
                    var str = editBox.getString();
                    while (str != "0" && str.indexOf("0") == 0) {
                        //避免parseInt转化八进制或十六进制
                        str = str.substring(1, str.length);
                    }
                    var input = parseInt(str);
                    if (editBox.getString().length == 0 || input == null || isNaN(input)) {
                        input = endGameNode.config.defaultValue
                    } else if (input > endGameNode.config.limitMax) {
                        input = endGameNode.config.limitMax
                    } else if (input < endGameNode.config.limitMin) {
                        input = endGameNode.config.limitMin
                    }
                    that._matchModeEndGameScoreEdt.value = parseInt(input);
                    that.setMatchModeEndGameScore();
                };

                edt_input_endGame.setDelegate(edt_input_endGame);
                image_fen_bg.addChild(edt_input_endGame);
                textEndGameScore.visible = false;

                this._checkBox_not_zone_score = endGameNode.getChildByName("checkBox_not_zone_score");
                if (!FriendCard_Common.isOpenMatchScoreNeedEnough(this._data.gameType)) {
                    this._checkBox_not_zone_score.visible = false;
                }
                this.addListenerText(this._checkBox_not_zone_score);
                this._checkBox_not_zone_score.addEventListener(this.clickCB, this._checkBox_not_zone_score);

                var scoreNeedEnough = this.getNumberItem("scoreNeedEnough", endGameNode.config.defaultScoreNeedEnough);
                this._checkBox_not_zone_score.setSelected(scoreNeedEnough);
                var text = this._checkBox_not_zone_score.getChildByName("text");
                this.selectedCB(text, scoreNeedEnough);

                this._matchModeEndGameScoreNodes = [];
                this._matchModeEndGameScoreNodes.push(endGameNode.getChildByName("match_no_limit"));
                this._matchModeEndGameScoreNodes.push(endGameNode.getChildByName("match_limit"));

                this._matchModeEndGameScoreRadio = createRadioBoxForCheckBoxs(this._matchModeEndGameScoreNodes, function (index) {
                    this._checkBox_not_zone_score.visible = (index == 1 && FriendCard_Common.isOpenMatchScoreNeedEnough(this._data.gameType))
                    this.radioBoxSelectCB(index, this._matchModeEndGameScoreNodes[index], this._matchModeEndGameScoreNodes);
                }.bind(this));
                this.addListenerText(this._matchModeEndGameScoreNodes, this._matchModeEndGameScoreRadio, function (index) {
                    this._checkBox_not_zone_score.visible = (index == 1 && FriendCard_Common.isOpenMatchScoreNeedEnough(this._data.gameType))
                }.bind(this));

                this._matchModeEndGameScoreSub = endGameNode.getChildByName("btn_sub");
                this._matchModeEndGameScoreSub.addTouchEventListener(function (sender, type) {
                    if (type == 2) {
                        this.setMatchModeEndGameScore("sub");
                    }
                }, this);
                this._matchModeEndGameScoreAdd = endGameNode.getChildByName("btn_add");
                this._matchModeEndGameScoreAdd.addTouchEventListener(function (sender, type) {
                    if (type == 2) {
                        this.setMatchModeEndGameScore("add");
                    }
                }, this);

                this.setMatchModeEndGameScore = function (action) {
                    if (action == "sub") {
                        this._matchModeEndGameScoreEdt.value -= endGameNode.config.dValue;
                    } else if (action == "add") {
                        this._matchModeEndGameScoreEdt.value += endGameNode.config.dValue;
                    }
                    if (this._matchModeEndGameScoreEdt.value < endGameNode.config.limitMin) {
                        this._matchModeEndGameScoreEdt.value = endGameNode.config.limitMax;
                    }
                    if (this._matchModeEndGameScoreEdt.value > endGameNode.config.limitMax) {
                        this._matchModeEndGameScoreEdt.value = endGameNode.config.limitMin;
                    }
                    this._matchModeEndGameScoreEdt.setString("" + this._matchModeEndGameScoreEdt.value);
                }
                var currentSelect = this.getNumberItem("isMatchDissolveLimit", endGameNode.config.defaultOpenIndex);
                this._matchModeEndGameScoreEdt.value = this.getNumberItem("matchDissolveLimitScore", endGameNode.config.defaultValue);
                this._matchModeEndGameScoreRadio.selectItem(currentSelect);
                this._checkBox_not_zone_score.visible = (currentSelect == 1 && FriendCard_Common.isOpenMatchScoreNeedEnough(this._data.gameType))
                this.setMatchModeEndGameScore();


                //积分不为负提示

                var btn_Tip = this._checkBox_not_zone_score.getChildByName("btn_Tip");
                var image_Tip = this._checkBox_not_zone_score.getChildByName("image_Tip");
                image_Tip.visible = false;
                btn_Tip.addTouchEventListener(function (sender, type) {
                    if (type == 2) {
                        image_Tip.visible = true;
                    }
                })
                cc.eventManager.addListener({
                    event: cc.EventListener.TOUCH_ONE_BY_ONE,
                    swallowTouches: false,
                    status: null,
                    onTouchBegan: function (touch, event) {
                        if (image_Tip.isVisible()) {
                            image_Tip.setVisible(false);
                            return true;
                        } else {
                            return false;
                        }
                    },
                }, image_Tip);
            } else {
                if (endGameNode) {
                    endGameNode.visible = false;
                }
            }
            //比赛场解散房间end

        }
    },
    //亲友圈钻石插入节点
    changeUiForRoomCardMode: function (parentNode) {//亲友圈钻石模式
        if (!this._isRoomCardMode) {
            return;
        }
        var that = this;
        cc.log("begin changeUiForRoomCardMode");

        cc.log("parentNode name ", parentNode.name);
        this._cardRoomOptNode = parentNode;


        var dy = 64;
        var roomCardModeNodeMoreHeight = (FriendCard_Common.isOpenMiankoujiashi(this._data.gameType) && !FriendCard_Common.isOpenForceMiankoujiashi()) ? 150 : 100;
        this._roomCardModeNode = parentNode.getChildByName("roomCardModeNode");//一些难兼容的玩法，直接在创建房间ui加入节点
        if (!this._roomCardModeNode) {
            //寻找插入点

            var selectNode = this.getTextNodeByValue(parentNode, "支付：");
            if (!selectNode) {
                selectNode = this.getTextNodeByValue(parentNode, "支付:");
            }
            if (!selectNode) {
                selectNode = this.getTextNodeByValue(parentNode, "房费：");
            }
            if (!selectNode) {
                selectNode = this.getTextNodeByValue(parentNode, "房费:");
            }
            if (!selectNode) {
                selectNode = this.getTextNodeByValue(parentNode, "元宝:");
            }
            if (!selectNode) {
                selectNode = this.getTextNodeByValue(parentNode, "元宝：");
            }
            if (!selectNode) {
                selectNode = this.getTextNodeByValue(parentNode, "付费:");
            }
            if (!selectNode) {
                selectNode = this.getTextNodeByValue(parentNode, "付费：");
            }

            //隐藏包含"元宝"的节点 刘雨楠 
            this.getListTextNodeByValue(parentNode, "元宝", function (nodeList) {
                for (var i = 0; i < nodeList.length; i++) {
                    //后面会通过判定selectNode是否隐藏做其他逻辑 所以这时候不做隐藏
                    if (nodeList[i] != selectNode) {
                        nodeList[i].visible = false;
                    }
                }
            }, [])

            if (selectNode) {
                if (!selectNode.visible) {
                    selectNode = null;
                }
            }
            if (selectNode) {
                var localPos = selectNode.getPosition();
                var selectNodePos = selectNode.getParent().convertToWorldSpace(localPos);
                selectNode.visible = false;
                //cc.log("房费pos ",JSON.stringify(selectNodePos));
                this.findNodeByNameKey(parentNode, "payWay_", function (node) {
                    //cc.log("payWay_ find");
                    node.visible = false;
                });
                if (parseInt(selectNodePos.y) > 720 || parseInt(selectNodePos.y) < 0) {
                    selectNode = null;
                } else {
                    dy = 0;
                }
            }
            var notValues = [];
            notValues.push("自由人数");
            if (!selectNode) {
                cc.log("find 人数");
                selectNode = this.getTextNodeByValue(parentNode, "人数", notValues);
                if (selectNode && !selectNode.visible) {
                    cc.log("人数 node not visible");
                    selectNode = null;
                }
                if (selectNode) {
                    this._ziYouRenNode = this.getTextNodeByValue(parentNode, "自由人数");
                } else {
                    this._ziYouRenNode = null;
                }
            }
            if (!selectNode) {
                cc.log("find 局数");
                selectNode = this.getTextNodeByValue(parentNode, "局数");
                if (selectNode && !selectNode.visible) {
                    cc.log("局数 node not visible");
                    selectNode = null;
                }
            }
            if (selectNode) {
                var roomCardModeNodePos = selectNode.getPosition();
                var selectNodePos = selectNode.getParent().convertToWorldSpace(selectNode.getPosition());
                //修正选中item的y下标 start

                var fixYNode = [];
                fixYNode.push(this._ziYouRenNode)
                var _realTimeVoiceNode = this.getTextNodeByValue(parentNode, "实时语音");
                fixYNode.push(_realTimeVoiceNode)
                this.findNodeByNameKey(parentNode, "round_4", function (node) {
                    fixYNode.push(node);
                });
                for (var i = 0; i < fixYNode.length; i++) {
                    if (fixYNode[i]) {
                        var pos0 = fixYNode[i].getParent().convertToWorldSpace(fixYNode[i].getPosition());
                        var difY = selectNodePos.y - pos0.y
                        if (difY > 10) {
                            if (pos0.y < selectNodePos.y) {
                                selectNodePos.y = pos0.y;
                                var pos1 = selectNode.getParent().convertToWorldSpace(selectNode.getPosition());
                                if (pos0.y < pos1.y) {
                                    roomCardModeNodePos.y = selectNode.getPosition().y + (pos0.y - pos1.y);
                                }
                            }
                        }
                    }
                }//修正选中item的y下标 end

                //插入点下面的节点下移
                this.changeItemY(parentNode.getChildByName("play"), selectNodePos, dy + roomCardModeNodeMoreHeight);
                if (that._data.gameType == MjClient.GAME_TYPE.ML_HONGZHONG
                    || that._data.gameType == MjClient.GAME_TYPE.ML_HONGZHONG_ZERO) {
                    this.changeItemY(parentNode.getChildByName("play").getChildByName("quanZhong1Niao"), selectNodePos, dy + roomCardModeNodeMoreHeight);
                    this.changeItemY(parentNode.getChildByName("play").getChildByName("zhongNiao159"), selectNodePos, dy + roomCardModeNodeMoreHeight);
                }
                this.changeItemY(parentNode.getChildByName("play_way"), selectNodePos, dy + roomCardModeNodeMoreHeight);
                this.changeItemY(parentNode.getChildByName("round"), selectNodePos, dy + roomCardModeNodeMoreHeight);
                this.changeItemY(parentNode.getChildByName("title"), selectNodePos, dy + roomCardModeNodeMoreHeight);
                this.changeItemY(parentNode.getChildByName("difen"), selectNodePos, dy + roomCardModeNodeMoreHeight);
                this.changeItemY(parentNode, selectNodePos, dy + roomCardModeNodeMoreHeight);

                //添加房卡模式选项node
                var roomCardModeNode = ccs.load("CreateRoomCardMode.json").node;
                if (MjClient.getAppType() == MjClient.APP_TYPE.TXJINZHONGMJ || MjClient.getAppType() == MjClient.APP_TYPE.AYGUIZHOUMJ || MjClient.getAppType() == MjClient.APP_TYPE.DQSHANXIMJ) {
                    roomCardModeNodePos.y = roomCardModeNodePos.y - dy - 20;
                } else {
                    roomCardModeNodePos.y = roomCardModeNodePos.y - dy - 10;
                }
                if (selectNode.getAnchorPoint().x == 1)
                    roomCardModeNode.setPosition(roomCardModeNodePos.x - selectNode.width, roomCardModeNodePos.y);
                else if (selectNode.getAnchorPoint().x == 0.5)
                    roomCardModeNode.setPosition(roomCardModeNodePos.x - selectNode.width / 2, roomCardModeNodePos.y);
                else
                    roomCardModeNode.setPosition(roomCardModeNodePos);

                roomCardModeNode.setAnchorPoint(selectNode.getAnchorPoint())
                selectNode.getParent().addChild(roomCardModeNode);
                this._roomCardModeNode = roomCardModeNode;

            } else {
                cc.log("selectNode null");
            }
        }
        if (this._roomCardModeNode) {
            if (this.getNodePlayAndRound().roundPanel && cc.sys.isObjectValid(this.getNodePlayAndRound().roundPanel)) {
                this.getNodePlayAndRound().roundPanel.zIndex = 100
            }
            if (parentNode.setInnerContainerSize) {//增加scrollview的高度
                if (MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP || MjClient.getAppType() === MjClient.APP_TYPE.HUBEIMJ) {
                    //减少高度,留白下面增加文字(岳阳原高度485左右)
                    var preHeight = parentNode.height;
                    parentNode.height = 465;
                    var parentNodeDy = preHeight - parentNode.height;
                    if (parentNodeDy > 0) {
                        parentNode.y += parentNodeDy * (1 - parentNode.getAnchorPoint().y);
                    }
                } else if (MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ) {
                    //减少高度,留白下面增加文字(永利原高度450)
                    var preHeight = parentNode.height;
                    parentNode.height = 430;
                    var parentNodeDy = preHeight - parentNode.height;
                    if (parentNodeDy > 0) {
                        parentNode.y += parentNodeDy * (1 - parentNode.getAnchorPoint().y);
                    }
                }
                //修正scrollView的滑动区域
                parentNode.setInnerContainerSize(cc.size(parentNode.getInnerContainerSize().width, parentNode.getInnerContainerSize().height + dy + roomCardModeNodeMoreHeight));
                this.changeItemY(parentNode.getChildByName("play"), null, -(dy + roomCardModeNodeMoreHeight));

                if (that._data.gameType == MjClient.GAME_TYPE.ML_HONGZHONG
                    || that._data.gameType == MjClient.GAME_TYPE.ML_HONGZHONG_ZERO) {
                    this.changeItemY(parentNode.getChildByName("play").getChildByName("quanZhong1Niao"), null, -(dy + roomCardModeNodeMoreHeight));
                    this.changeItemY(parentNode.getChildByName("play").getChildByName("zhongNiao159"), null, -(dy + roomCardModeNodeMoreHeight));
                }

                this.changeItemY(parentNode.getChildByName("play_way"), null, -(dy + roomCardModeNodeMoreHeight));
                this.changeItemY(parentNode.getChildByName("round"), null, -(dy + roomCardModeNodeMoreHeight));
                this.changeItemY(parentNode.getChildByName("title"), null, -(dy + roomCardModeNodeMoreHeight));
                this.changeItemY(parentNode.getChildByName("difen"), null, -(dy + roomCardModeNodeMoreHeight));
                this.changeItemY(parentNode, null, -(dy + roomCardModeNodeMoreHeight));
            }
            //以下是房卡模式节点
            this._roomCardModeNode.visible = true;
            this._roomCardPayModeNode = this._roomCardModeNode.getChildByName("roomCardMode");
            this._roomCardPayModeFen = this._roomCardPayModeNode.getChildByName("txt_fen");
            this._roomCardPayModeFen.ignoreContentAdaptWithSize(true);


            var currentSelect = this.getNumberItem("fangkaSource", 1) - 1;
            this._roomCardPayModeFen.minValue = currentSelect > 1 ? 10 : 20;
            this._roomCardPayModeFen.value = this.getNumberItem("fangkaCount", 1);
            this._roomCardPayModeFen.valueArr = FriendCard_Common.getFangkaPayArr(currentSelect + 1, this.getSelectedRoundNum() == 1);

            this._roomCardPayModeFen.valueIndex = FriendCard_Common.getArrLimit(this._roomCardPayModeFen.valueArr, this._roomCardPayModeFen.value).index;
            this._roomCardPayModeFen.value = this._roomCardPayModeFen.valueArr[this._roomCardPayModeFen.valueIndex];
            //邵阳剥皮自由人数AA付单独处理
            this.AAPayAndSYBP = function (index) {
                //邵阳剥皮自由人数AA付单独处理
                if (index == 2 && (this._data.gameType == MjClient.GAME_TYPE.SHAO_YANG_BO_PI)) {
                    this.maxPlayerList_radio.selectItem(1);
                    this.bg_node.getChildByName("play").getChildByName("maxPlayer_0").visible = false;
                } else if (this._data.gameType == MjClient.GAME_TYPE.SHAO_YANG_BO_PI) {
                    this.bg_node.getChildByName("play").getChildByName("maxPlayer_0").visible = true;
                }
                //邵阳字牌自由人数AA付单独处理
                if (index == 2 && (this._data.gameType == MjClient.GAME_TYPE.SHAO_YANG_ZI_PAI)) {
                    this.maxPlayerList_radio.selectItem(1);
                    this.bg_node.getChildByName("play").getChildByName("maxPlayer1").visible = false;
                } else if (this._data.gameType == MjClient.GAME_TYPE.SHAO_YANG_ZI_PAI) {
                    this.bg_node.getChildByName("play").getChildByName("maxPlayer1").visible = true;
                }
            }
            var roomCardPayModeNodes = [];
            roomCardPayModeNodes.push(this._roomCardPayModeNode.getChildByName("club_payWay_1"));
            roomCardPayModeNodes.push(this._roomCardPayModeNode.getChildByName("club_payWay_2"));
            roomCardPayModeNodes.push(this._roomCardPayModeNode.getChildByName("club_payWay_3"));
            if ((this._data && this._data.isLM) || FriendCard_Common.getClubisLM()) {//联盟房卡模式不需要输家付
                var club_payWay_2 = this._roomCardPayModeNode.getChildByName("club_payWay_2")
                club_payWay_2.visible = false;
                this._roomCardPayModeNode.getChildByName("club_payWay_3").setPosition(club_payWay_2.getPosition())
            }
            this.roomCardPayMode_radio = createRadioBoxForCheckBoxs(roomCardPayModeNodes, function (index) {
                cc.log("index--", index);
                this.radioBoxSelectCB(index, this.roomCardPayModeNodes[index], this.roomCardPayModeNodes);
                this.setRoomCardPayModeFen(index);
                this.setPayNodeIsShow(index);
                this.AAPayAndSYBP(index);
            }.bind(this));
            this.addListenerText(roomCardPayModeNodes, this.roomCardPayMode_radio, function (index) {
                this.setRoomCardPayModeFen(index);
                this.setPayNodeIsShow(index);
                this.AAPayAndSYBP(index);
            }.bind(this));
            this.roomCardPayModeNodes = roomCardPayModeNodes;
            this.roomCardPayMode_radio.selectItem(currentSelect);
            this.radioBoxSelectCB(currentSelect, this.roomCardPayModeNodes[currentSelect], this.roomCardPayModeNodes);
            this.setRoomCardPayModeFen = function (index) {
                this._roomCardPayModeFen.valueArr = FriendCard_Common.getFangkaPayArr(Number(index) + 1, this.getSelectedRoundNum() == 1);

                if (!this._roomCardPayModeFen.valueArr[this._roomCardPayModeFen.valueIndex]) {
                    this._roomCardPayModeFen.valueIndex = this._roomCardPayModeFen.valueArr.length - 1;
                }
                var value = this._roomCardPayModeFen.valueArr[this._roomCardPayModeFen.valueIndex];

                this._roomCardPayModeFen.value = value;
                this._roomCardPayModeFen.setString(value + "钻石");
                this.setLevelText();
            }
            this._roomCardPayModeSub = this._roomCardPayModeNode.getChildByName("btn_sub");
            this._roomCardPayModeSub.addTouchEventListener(function (sender, type) {
                if (type == 2) {
                    this._roomCardPayModeFen.valueIndex--;
                    this._roomCardPayModeFen.valueIndex = this._roomCardPayModeFen.valueIndex < 0 ? this._roomCardPayModeFen.valueArr.length - 1 : this._roomCardPayModeFen.valueIndex;
                    this.setRoomCardPayModeFen(this.roomCardPayMode_radio.getSelectIndex());
                }
            }, this);
            this._roomCardPayModeAdd = this._roomCardPayModeNode.getChildByName("btn_add");
            this._roomCardPayModeAdd.addTouchEventListener(function (sender, type) {
                if (type == 2) {
                    this._roomCardPayModeFen.valueIndex++;
                    this._roomCardPayModeFen.valueIndex = this._roomCardPayModeFen.valueIndex > this._roomCardPayModeFen.valueArr.length - 1 ? 0 : this._roomCardPayModeFen.valueIndex;
                    this.setRoomCardPayModeFen(this.roomCardPayMode_radio.getSelectIndex());
                }
            }, this);

            this._roomCardModeTisNode = parentNode.getChildByName("roomCardPayModeTipText");
            if (!this._roomCardModeTisNode) {
                //增加文字提示
                this.findNodeByNameKey(this.bg_node.getParent(), "btn_delete", function (node) {
                    cc.log("find out btn_delete");
                    var tipText = new ccui.Text();
                    if (MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP || MjClient.getAppType() === MjClient.APP_TYPE.HUBEIMJ || MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ) {//岳阳同一使用方正兰亭
                        tipText.setFontName("fonts/lanting.TTF");
                    }
                    tipText.setName("roomCardPayModeTipText");
                    tipText.setFontSize(28);
                    tipText.setAnchorPoint(cc.p(0, 0.5));
                    tipText.setPosition(cc.p(node.x - node.width / 2, node.y + node.height / 2 + 20));
                    node.getParent().addChild(tipText);
                    this._roomCardModeTisNode = tipText;
                }.bind(this))
            }
            this._roomCardModeTisNode.visible = this.roomCardPayMode_radio.getSelectIndex() == 2 ? false : true;
            this._roomCardModeTisNode.ignoreContentAdaptWithSize(true);
            this._roomCardModeTisNode.setColor(CREATEROOM_COLOR_1);
            this._roomCardModeTisNode.setString("该玩法不足10分不扣钻石");
            this._roomCardModeTisNode.visible = false;

            //fangkaFree
            this.onClickFangkaFree = function () {
                var selectColor = MjClient.createRoomNode._selectColor;
                var unSelectColor = MjClient.createRoomNode._unSelectColor;

                mianKouJiaShi.visible = difenMianKou.visible && difenMianKou.isSelected() && FriendCard_Common.isOpenMiankoujiashi(this._data.gameType) && !FriendCard_Common.isOpenForceMiankoujiashi();
                difenBtn_sub.setEnabled(difenMianKou.isSelected());
                difenBtn_add.setEnabled(difenMianKou.isSelected());
                difenMianKou.getChildByName("text").setTextColor(difenMianKou.isSelected() ? selectColor : unSelectColor);
            }
            this.setFangkaFree = function (value) {
                if (this.difenMianKouConfig.mustMultiple && this.difenMianKouConfig.anIncrease >= 1) {
                    var remainder = (value % this.difenMianKouConfig.anIncrease);
                    if (remainder != 0) {
                        value = parseInt(value / this.difenMianKouConfig.anIncrease) * this.difenMianKouConfig.anIncrease;
                    }
                }
                if (value < this.difenMianKouConfig.min) {
                    difenMianKou.value = this.difenMianKouConfig.max;
                } else if (value > this.difenMianKouConfig.max) {
                    difenMianKou.value = this.difenMianKouConfig.min;
                } else {
                    difenMianKou.value = value;
                }

                difenTxt_fen.setString("低于" + difenMianKou.value + "分");
            }
            var difenMianKou = this._roomCardPayModeNode.getChildByName("difenMianKou");
            this._roomCardDifenMianKou = difenMianKou;
            difenMianKou.addEventListener(function (sender, type) {
                switch (type) {
                    case ccui.CheckBox.EVENT_SELECTED:
                    case ccui.CheckBox.EVENT_UNSELECTED:
                        this.onClickFangkaFree();
                        break;
                }
            }, this);
            difenMianKou.getChildByName("text").addTouchEventListener(function (sender, type) {
                if (type == 2) {
                    difenMianKou.setSelected(!difenMianKou.isSelected())
                    this.onClickFangkaFree();
                }
            }, this);
            var mianKouJiaShi = difenMianKou.getChildByName("mianKouJiaShi");
            mianKouJiaShi.getChildByName("text").setTouchEnabled(false)
            difenMianKou.mianKouJiaShi = mianKouJiaShi;
            this.setRoomCardModeFree();
            difenMianKou.setSelected(true);
            mianKouJiaShi.setSelected(this.getNumberItem("isMianKouJiaShi", false))
            mianKouJiaShi.getChildByName("text").setString("免扣加时（最多2局）")
            this.addListenerText(mianKouJiaShi);
            //贵州 联盟中玩法默认勾选免扣加时
            if ((this._data && this._data.isLM || FriendCard_Common.getClubisLM()) && MjClient.getAppType() == MjClient.APP_TYPE.AYGUIZHOUMJ) {
                mianKouJiaShi.setSelected(this.getNumberItem("isMianKouJiaShi", true));
            }
            if (FriendCard_Common.isOpenForceMiankoujiashi()) {
                mianKouJiaShi.setSelected(true);
            }

            difenMianKou.value = this.getNumberItem("fangkaFree", 0); //默认值
            if (!difenMianKou.value) {
                difenMianKou.value = this.difenMianKouConfig.default;
                difenMianKou.setSelected(false);
            }
            this.difenMianKou = difenMianKou;

            var difenBtn_add = difenMianKou.getChildByName("difenBtn_add");
            difenBtn_add.addTouchEventListener(function (sender, type) {
                if (type == 2) {
                    if (this.difenMianKouConfig.valueList) {
                        var index = this.difenMianKouConfig.valueList.indexOf(Number(difenMianKou.value));
                        var indexNext = (index + 1 + this.difenMianKouConfig.valueList.length) % this.difenMianKouConfig.valueList.length;
                        var value = this.difenMianKouConfig.valueList[indexNext];
                    } else {
                        var value = difenMianKou.value + this.difenMianKouConfig.anIncrease;
                    }
                    this.setFangkaFree(value);
                }
            }, this);

            var difenBtn_sub = difenMianKou.getChildByName("difenBtn_sub");
            difenBtn_sub.addTouchEventListener(function (sender, type) {
                if (type == 2) {
                    if (this.difenMianKouConfig.valueList) {
                        var index = this.difenMianKouConfig.valueList.indexOf(Number(difenMianKou.value));
                        var indexNext = (index - 1 + this.difenMianKouConfig.valueList.length) % this.difenMianKouConfig.valueList.length;
                        var value = this.difenMianKouConfig.valueList[indexNext];
                    } else {
                        var value = difenMianKou.value - this.difenMianKouConfig.anIncrease;
                    }
                    this.setFangkaFree(value);
                }
            }, this);

            var difenTxt_fen = difenMianKou.getChildByName("difenTxt_fen");
            difenTxt_fen.ignoreContentAdaptWithSize(true);

            //winnerPayNode
            this.onClickWinnerAdded = function () {
                var selectColor = MjClient.createRoomNode._selectColor;
                var unSelectColor = MjClient.createRoomNode._unSelectColor;
                addedBtn_sub.setEnabled(winnerAdded.isSelected())
                addedBtn_add.setEnabled(winnerAdded.isSelected())
                winnerAdded.getChildByName("text").setTextColor(winnerAdded.isSelected() ? selectColor : unSelectColor);
                this.setLevelText();
            }
            this.setWinnerAdded = function (value) {
                if (value < winnerAdded.minValue) {
                    winnerAdded.value = winnerAdded.minValue;
                } else if (value > winnerAdded.maxValue) {
                    winnerAdded.value = winnerAdded.minValue;
                } else {
                    winnerAdded.value = value;
                }
                text_added.setString(winnerAdded.value + "钻石");
                this.setLevelText();
            }
            this.setPayNodeIsShow = function (index) {
                winnerPayNode.visible = (index == 0 || index == 1);
                //_AAPayNode.visible = (index == 2 && (this.getSelectedRoundNum() != 1));
                _AAPayNode.visible = false;//【风控】【亲友圈&联盟】房卡模式，AA支付模式下，最高分加收功能去除
                this.setLevelText();
            }
            var winnerPayNode = this._roomCardPayModeNode.getChildByName("winnerPayNode");
            var winnerPayNodes = [];
            winnerPayNodes.push(winnerPayNode.getChildByName("winner_1"));
            winnerPayNodes.push(winnerPayNode.getChildByName("winner_2"));
            this.winnerPayNodes_radio = createRadioBoxForCheckBoxs(winnerPayNodes, function (index) {
                //cc.log("index--",index);
                this.radioBoxSelectCB(index, winnerPayNodes[index], winnerPayNodes);
            }.bind(this));
            this.addListenerText(winnerPayNodes, this.winnerPayNodes_radio, function (index) { }.bind(this));
            this.radioBoxSelectCB(0, winnerPayNodes[0], winnerPayNodes);
            this.winnerPayNodes_radio.selectItem(this.getNumberItem("fangkaExtra", 0) > 1 ? 0 : this.getNumberItem("fangkaExtra", 0));
            var _AAPayNode = this._roomCardPayModeNode.getChildByName("AAPayNode");
            this._roomCardAAPayNode = _AAPayNode;
            var winnerAdded = _AAPayNode.getChildByName("winnerAdded");
            var addedBtn_sub = _AAPayNode.getChildByName("addedBtn_sub");
            var addedBtn_add = _AAPayNode.getChildByName("addedBtn_add");
            var text_added = _AAPayNode.getChildByName("text_added");
            text_added.ignoreContentAdaptWithSize(true)
            winnerAdded.minValue = 10;
            winnerAdded.maxValue = 999999;
            winnerAdded.value = this.getNumberItem("fangkaExtra", 0);
            winnerAdded.setSelected(true);
            if (winnerAdded.value < 10 || this.roomCardPayMode_radio.getSelectIndex() != 2) {
                winnerAdded.value = 10
                winnerAdded.setSelected(false);
            }

            this.winnerAdded = winnerAdded;
            winnerAdded.addEventListener(function (sender, type) {
                switch (type) {
                    case ccui.CheckBox.EVENT_SELECTED:
                    case ccui.CheckBox.EVENT_UNSELECTED:
                        this.onClickWinnerAdded();
                        break;
                }
            }, this);
            winnerAdded.getChildByName("text").addTouchEventListener(function (sender, type) {
                if (type == 2) {
                    winnerAdded.setSelected(!winnerAdded.isSelected())
                    this.onClickWinnerAdded();
                }
            }, this);
            addedBtn_sub.addTouchEventListener(function (sender, type) {
                if (type == 2) {
                    var value = winnerAdded.value - 1;
                    this.setWinnerAdded(value);
                }
            }, this);
            addedBtn_add.addTouchEventListener(function (sender, type) {
                if (type == 2) {
                    var value = winnerAdded.value + 1;
                    this.setWinnerAdded(value);
                }
            }, this);

            var levelImage = this._roomCardPayModeNode.getChildByName("Image_level");
            this.setLevelText = function () {
                if (!levelImage) return;
                var levelStrs = FriendCard_Common.fangkaPayConfig.levelStrs; //["普通", "高级", "皇冠","尊贵"];
                var fangkaCount = this._roomCardPayModeFen.value;
                var fangkaSource = this.roomCardPayMode_radio.getSelectIndex() + 1;
                var maxPlayer = this.getSelectPlayNum();
                if (typeof (maxPlayer) == typeof ([]))
                    maxPlayer = maxPlayer[0];
                var fangkaExtra = (this._roomCardAAPayNode.isVisible() && this.winnerAdded.isSelected()) ? this.winnerAdded.value : 0;
                var index = FriendCard_Common.getFangkaLevel(fangkaCount, fangkaSource, fangkaExtra, maxPlayer, this.getSelectedRoundNum() == 1).index;
                if (levelStrs[index]) {
                    if (levelText.getString() != levelStrs[index] + "房间") {
                        levelText.setString(levelStrs[index] + "房间");
                        levelImage.loadTexture("fangKa/level/level" + ([0, 1, 6, 7][index] || 0) + ".png");
                    }
                }
            }
            if (levelImage) {
                var levelText = levelImage.getChildByName("text");
                levelText.setTextColor(this._selectColor);
                levelText.setFontName("fonts/lanting.TTF");

                levelText.addTouchEventListener(function (sender, type) {
                    if (type == 2) {
                        this.showFangkaRoomLevelInfo();
                    }
                }, this)
            }

            //默认
            this.setRoomCardPayModeFen(this.roomCardPayMode_radio.getSelectIndex());
            this.setWinnerAdded(winnerAdded.value)
            this.setPayNodeIsShow(currentSelect);
            this.setFangkaFree(difenMianKou.value);
            this.onClickFangkaFree();
            this.onClickWinnerAdded();
        }
    },

    showFangkaRoomLevelInfo: function () {
        var infoDialog = ccs.load("fangkaRoomLevelInfo.json").node;
        var bgImage = infoDialog.getChildByName("Image_bg");
        var contentText = bgImage.getChildByName("Text_content");
        var closeBtn = bgImage.getChildByName("close");


        var cfg = FriendCard_Common.fangkaPayConfig;
        var str = "";
        for (var i = 0; i < cfg.infoStrs.length; i++) {
            str += cfg.infoStrs[i] + "\n\n";
        }

        contentText.setString(str);
        contentText.setFontSize(22);
        closeBtn.addTouchEventListener(function (sender, type) {
            if (type == 2) {
                infoDialog.removeFromParent();
            }
        }, this);

        infoDialog.setPosition(MjClient.createui.width / 2, MjClient.createui.height / 2);
        setWgtLayout(infoDialog.getChildByName("Image_di"), [1, 1], [0, 0], [0, 0], true);
        setWgtLayout(bgImage, [bgImage.width / 1280, bgImage.height / 720], [0, 0], [0, 0]);
        MjClient.createui.addChild(infoDialog, 999);
    },
    setRoomCardModeFree: function (difen) {
        if (this._roomCardModeNode) {
            if (difen || difen == 0) {
                this.difenMianKouConfig = FriendCard_Common.getFangkaFreeConfig(this._data.gameType, difen);
            } else {
                if (this.jieSuanDiFen) {
                    this.difenMianKouConfig = FriendCard_Common.getFangkaFreeConfig(this._data.gameType, (this.difenIndex || this.difenIndex == 0) ? this.difenAry[this.difenIndex] : null);
                } else {
                    if (this.difenAry && (this.difenIndex || this.difenIndex == 0)) {
                        this.difenMianKouConfig = FriendCard_Common.getFangkaFreeConfig(this._data.gameType, this.difenAry[this.difenIndex]);
                    } else {
                        difen = (this._ZhuNum ? Number(this._ZhuNum.getString()) : ((this._zhuIdx || this._zhuIdx == 0) ? this._zhuIdx : null));
                        if (isNaN(difen)) {
                            difen = null;
                        }
                        this.difenMianKouConfig = FriendCard_Common.getFangkaFreeConfig(this._data.gameType, difen);
                    }

                }
            }

        }

    },
});