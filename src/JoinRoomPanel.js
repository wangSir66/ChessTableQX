function InputRoomNumber(n) {
    var change = true, str = MjClient.enterui._bindNum.getString();
    if (n >= 0 && str.length < 6) str += n;
    else if (n == -1 && str.length > 0) str = str.slice(0, -1);
    else if (n == -2 && str.length > 0) str = "";
    else change = false;
    if (change) MjClient.enterui._bindNum.setString(str);
}

var EnterRoomLayer = cc.Layer.extend({
    sprite: null,
    ctor: function () {
        this._super();

        // 如果是回放本页面不打开 
        if (MjClient.rePlayVideo >= 0 && MjClient.replayui &&
            (MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG ||
                MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType())) {
            MjClient.replayui.replayEnd();
            this.removeFromParent();
            return true; // 回放不显示加入房间界面
        }

        var enterui = ccs.load(res.Enter_json);
        this.addChild(enterui.node);
        MjClient.enterui = this;
        MjClient.entercode = [];

        /*
            changed by sking
        */
        var _block = enterui.node.getChildByName("block");
        setWgtLayout(_block, [1, 1], [0.5, 0.5], [0, 0], 2);

        var _back = enterui.node.getChildByName("back");
        setWgtLayout(_back, [0.8, 0.8], [0.5, 0.5], [0, 0]);

        var _btnClose = _back.getChildByName("close");
        _btnClose.addTouchEventListener(function (sender, Type) {
            switch (Type) {
                case ccui.Widget.TOUCH_ENDED:
                    MjClient.createRoomLayer = null;
                    this.removeFromParent();
                    var key = "Zhujiemian_Jiarufangjian_Close";
                    if (MjClient.getAppType() == MjClient.APP_TYPE.QXYZQP ||
                        MjClient.getAppType() == MjClient.APP_TYPE.QXLYQP ||
                        MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP ||
                        MjClient.getAppType() == MjClient.APP_TYPE.BDYZPHZ ||
                        MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ ||
                        MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG ||
                        MjClient.getAppType() == MjClient.APP_TYPE.QXXXGHZ) {
                        key = "WodefangjianGuanbiClick";
                    }
                    MjClient.native.umengEvent4CountWithProperty(key, { uid: SelfUid() });
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
                InputRoomNumber(itag);
            }
        }
        for (var i = 0; i <= 9; i++) {
            var _btnNum = _num.getChildByName("Button_" + i);
            _btnNum.setTag(i);
            _btnNum.addTouchEventListener(numBtnTouchEvent, this);
        }

        //清除所有
        var _clear = _num.getChildByName("clear");
        _clear.addTouchEventListener(function (sender, Type) {
            switch (Type) {
                case ccui.Widget.TOUCH_ENDED:
                    MjClient.native.umengEvent4CountWithProperty("Zhujiemian_Jiarufangjian_Qingkong", { uid: SelfUid() });
                    InputRoomNumber(-2);
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
                    if (str.length == 6) {
                        var tableid = Number(str);
                        MjClient.joinGame(tableid, function (rtn) {
                            if (rtn.result == 0) {
                                MjClient.native.umengEvent4CountWithProperty("Zhujiemian_Jiarufangjian_Shurufanghaochenggong", { uid: SelfUid() });
                                if (MjClient.enterui) MjClient.enterui.removeFromParent(true);
                            }
                            else {
                                InputRoomNumber(-2);
                            }
                        });
                    }
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
                    InputRoomNumber(-1);;
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
        this._bindNum.setPlaceHolder("   请输入房间号");
        this._bindNum.setPosition(imageNum.getContentSize().width / 2, imageNum.getContentSize().height / 2);
        imageNum.addChild(this._bindNum);

        popupAnm(_back);
        return true;
    },
    onExit: function () {
        this._super();
        MjClient.enterui = null;
        MjClient.createRoomLayer = null;
    },
});


var createRoomRecordLayer = cc.Layer.extend({
    ctor: function () {
        this._super();
        var UI = ccs.load("createRoomRecord.json");
        this.addChild(UI.node);
        var that = this;

        var _block = UI.node.getChildByName("block");
        setWgtLayout(_block, [1, 1], [0.5, 0.5], [0, 0], true);

        var _back = UI.node.getChildByName("back");
        if (MjClient.getAppType() == MjClient.APP_TYPE.HUBEIMJ || MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP) {
            setWgtLayout(_back, [1, 1], [0.5, 0.45], [0, 0]);
        } else if (MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ) {
            setWgtLayout(_back, [0.9, 0.9], [0.5, 0.4836], [0, 0]);
        }
        else {
            setWgtLayout(_back, [0.95, 0.95], [0.5, 0.5], [0, 0]);
        }

        var _close = _back.getChildByName("close");
        _close.addTouchEventListener(function (sender, type) {
            if (type == 2) {
                if (MjClient.createRoomLayer) {
                    MjClient.createRoomLayer.setVisible(true);
                }
                that.removeFromParent();
            }
        }, this);

        var nullTip_image = _back.getChildByName("nullTip_image");
        var nullTip_text = _back.getChildByName("nullTip_text");
        if (nullTip_image) {
            if (MjClient.getAppType() === MjClient.APP_TYPE.QXXXGHZ || MjClient.getAppType() === MjClient.APP_TYPE.QXHHZP) {
                nullTip_image.setTexture("game_picture/beidou.png");
            }
            nullTip_image.visible = false;
            nullTip_text.visible = false;
        }

        var _cellRecord = UI.node.getChildByName("item");
        _cellRecord.visible = false;

        var _listView = _back.getChildByName("list");
        _listView.removeAllItems();

        var that = this;

        function createOneCell(oneData, i) {
            var WinerId = oneData.winner;

            var _copy = _cellRecord.clone();
            _copy.visible = true;

            var tableID = _copy.getChildByName("tableid");
            tableID.ignoreContentAdaptWithSize(true);
            tableID.setString("房间ID:" + oneData.roomNum);

            var _num = _copy.getChildByName("num");
            _num.ignoreContentAdaptWithSize(true);
            _num.setString("" + (i + 1));

            var _time = _copy.getChildByName("time");
            var _timeStr = MjClient.dateFormat(new Date(parseInt(oneData.createTime)), 'yyyy-MM-dd hh:mm:ss');
            _time.ignoreContentAdaptWithSize(true);
            _time.setString(_timeStr);

            var _info = _copy.getChildByName("Text_1");
            _info.ignoreContentAdaptWithSize(true);
            var playString = "";
            switch (oneData.payWay) {
                case 0:
                    playString += "房主付";
                    break;
                case 1:
                    playString += "AA付";
                    break;
                case 2:
                    var content = "大赢家付";
                    if (MjClient.getAppType() == MjClient.APP_TYPE.QXYZQP ||
                        MjClient.getAppType() == MjClient.APP_TYPE.QXLYQP ||
                        MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP ||
                        MjClient.getAppType() == MjClient.APP_TYPE.BDYZPHZ ||
                        MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ ||
                        MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG ||
                        MjClient.getAppType() == MjClient.APP_TYPE.QXXXGHZ) {
                        content = "亲友圈付";
                    }
                    playString += content;
                    break;
            }
            _info.setString(oneData.roundNum + "局" + "," + playString);


            var _gameType = _copy.getChildByName("gameType");
            cc.log("oneData.gameType == " + oneData.gameType);
            _gameType.setString(GameCnName[oneData.gameType]);
            _gameType.ignoreContentAdaptWithSize(true);


            var _nameText = _copy.getChildByName("player0");
            _nameText.ignoreContentAdaptWithSize(true);


            if (oneData.players.length <= 0) {
                return _copy;
            }

            cc.log("==================nameText = " + JSON.stringify(oneData));
            function nameText(idx) {

                var _name = _copy.getChildByName("player" + idx);
                cc.log("==================nameText = " + idx);
                _name.getChildByName("tagIcon").visible = false;

                if (isJinZhongAPPType() ||
                    MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP ||
                    MjClient.getAppType() == MjClient.APP_TYPE.HUBEIMJ ||
                    MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ ||
                    MjClient.getAppType() == MjClient.APP_TYPE.AYGUIZHOUMJ ||
                    MjClient.getAppType() === MjClient.APP_TYPE.QXYZQP ||
                    MjClient.getAppType() === MjClient.APP_TYPE.BDYZPHZ ||
                    MjClient.getAppType() === MjClient.APP_TYPE.QXSYDTZ ||
                    MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG ||
                    MjClient.getAppType() === MjClient.APP_TYPE.QXLYQP
                ) {
                    var _uName = _name.getChildByName("Text_name");
                    _uName.ignoreContentAdaptWithSize(true);
                    var _uScore = _name.getChildByName("Text_score");
                    _uScore.ignoreContentAdaptWithSize(true);
                    _uName.setString(getNewName(unescape(oneData.players[idx].playerName), 8) + "");
                    if ((isJinZhongAPPType() ||
                        MjClient.getAppType() === MjClient.APP_TYPE.QXYZQP ||
                        MjClient.getAppType() === MjClient.APP_TYPE.BDYZPHZ ||
                        MjClient.getAppType() === MjClient.APP_TYPE.QXSYDTZ ||
                        MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG ||
                        MjClient.getAppType() === MjClient.APP_TYPE.QXLYQP) &&
                        Number(oneData.players[idx].score) <= 0) {
                        _uScore.setColor(cc.color(72, 132, 162));
                    }
                    else if ((
                        MjClient.getAppType() == MjClient.APP_TYPE.HUBEIMJ
                        || MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP
                        || MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ
                        || MjClient.getAppType() == MjClient.APP_TYPE.AYGUIZHOUMJ)
                        && Number(oneData.players[idx].score) <= 0) {
                        _uScore.setColor(cc.color("#443333"));
                    }
                    _uScore.setString(oneData.players[idx].score + "");
                    return "ID:" + oneData.players[idx].userId;
                }
                else {
                    if (oneData.players[idx].userId == WinerId) {
                        _name.getChildByName("tagIcon").visible = true;
                    }
                    cc.log("oneData.players[idx].userId = " + oneData.players[idx].userId);
                    cc.log("that.WinerId = " + that.WinerId);

                    return getNewName(unescape(oneData.players[idx].playerName), 8) + ":" + oneData.players[idx].score;
                }
            }


            var _nameText0 = _copy.getChildByName("player0");
            _nameText0.ignoreContentAdaptWithSize(true);
            _nameText0.setString(nameText(0));

            var _nameText1 = _copy.getChildByName("player1");
            _nameText1.ignoreContentAdaptWithSize(true);
            _nameText1.setString(nameText(1));

            var _nameText2 = _copy.getChildByName("player2");
            _nameText2.ignoreContentAdaptWithSize(true);
            if (oneData.players.length >= 3) {
                _nameText2.setString(nameText(2));
            }
            else {
                _nameText2.visible = false;
            }

            var _nameText3 = _copy.getChildByName("player3");
            _nameText3.ignoreContentAdaptWithSize(true);
            if (oneData.players.length >= 4) {
                _nameText3.setString(nameText(3));
            }
            else {
                _nameText3.visible = false;
            }

            var _nameText4 = _copy.getChildByName("player4");
            if (_nameText4) {
                _nameText4.ignoreContentAdaptWithSize(true);
                if (oneData.players.length >= 5) {
                    _nameText4.setString(nameText(4));
                }
                else {
                    _nameText4.visible = false;
                }
            }

            var line = _copy.getChildByName("line_shu3");
            if (line && oneData.players.length <= 2) {
                line.visible = false;
            }

            return _copy;
        }


        function initRoomRecordList(Data) {
            cc.log("initRoomRecordList = " + JSON.stringify(Data));

            for (var i = 0; i < Data.length; i++) {
                cc.log("Data[i] = " + JSON.stringify(Data[i]));
                if (Data[i].gameType != -1) {
                    _listView.pushBackCustomItem(createOneCell(Data[i], i));
                }
            }

            if (nullTip_image) {
                nullTip_image.visible = _listView.getItems().length == 0;
                nullTip_text.visible = _listView.getItems().length == 0;
            }
        }

        MjClient.block();
        MjClient.gamenet.request("pkplayer.handler.roomHistory", { index: 1, pageNum: 20 },
            function (rtn) {
                if (rtn.code == 0) {

                    initRoomRecordList(rtn.data.list);
                }
                else {
                    if (rtn.message) {
                        MjClient.showToast(rtn.message);
                    }
                    else {
                        MjClient.showToast("获取数据失败,请重新打开");
                    }

                }

                MjClient.unblock();
            }
        );

    }
});


var createRoomRecordLayer_v3 = cc.Layer.extend({
    ctor: function () {
        this._super();
        var UI = ccs.load("createRoomRecord_3.0.json");
        this.addChild(UI.node);
        var that = this;

        var _block = UI.node.getChildByName("block");
        setWgtLayout(_block, [1, 1], [0.5, 0.5], [0, 0], true);

        var _back = UI.node.getChildByName("back");
        if (MjClient.getAppType() == MjClient.APP_TYPE.HUBEIMJ || MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP) {
            setWgtLayout(_back, [0.95, 0.95], [0.5, 0.5], [0, 0]);
        } else if (MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ) {
            setWgtLayout(_back, [0.9, 0.9], [0.5, 0.4836], [0, 0]);
        }
        else {
            setWgtLayout(_back, [0.95, 0.95], [0.5, 0.5], [0, 0]);
        }

        var _close = _back.getChildByName("close");
        _close.addTouchEventListener(function (sender, type) {
            if (type == 2) {
                if (MjClient.createRoomLayer) {
                    MjClient.createRoomLayer.setVisible(true);
                }
                that.removeFromParent();
            }
        }, this);

        var nullTip_image = _back.getChildByName("nullTip_image");
        var nullTip_text = _back.getChildByName("nullTip_text");
        if (nullTip_image) {
            if (MjClient.getAppType() === MjClient.APP_TYPE.QXXXGHZ || MjClient.getAppType() === MjClient.APP_TYPE.QXHHZP) {
                nullTip_image.setTexture("game_picture/beidou.png");
            }
            nullTip_image.visible = false;
            nullTip_text.visible = false;
        }

        var _cellRecord = UI.node.getChildByName("item");
        _cellRecord.visible = false;

        var _listView = _back.getChildByName("list");
        _listView.removeAllItems();

        var that = this;

        function createOneCell(oneData, i) {
            var WinerId = oneData.winner;

            var _copy = _cellRecord.clone();
            _copy.visible = true;

            var tableID = _copy.getChildByName("tableid");
            tableID.ignoreContentAdaptWithSize(true);
            tableID.setString("房间ID:" + oneData.roomNum);

            var _num = _copy.getChildByName("num");
            _num.ignoreContentAdaptWithSize(true);
            _num.setString("" + (i + 1));

            var _time = _copy.getChildByName("time");
            var _timeStr = MjClient.dateFormat(new Date(parseInt(oneData.createTime)), 'yyyy-MM-dd hh:mm:ss');
            _time.ignoreContentAdaptWithSize(true);
            _time.setString(_timeStr);

            var _info = _copy.getChildByName("Text_1");
            _info.ignoreContentAdaptWithSize(true);
            var playString = "";
            switch (oneData.payWay) {
                case 0:
                    playString += "房主付";
                    break;
                case 1:
                    playString += "AA付";
                    break;
                case 2:
                    var content = "大赢家付";
                    if (MjClient.getAppType() == MjClient.APP_TYPE.QXYZQP ||
                        MjClient.getAppType() == MjClient.APP_TYPE.QXLYQP ||
                        MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP ||
                        MjClient.getAppType() == MjClient.APP_TYPE.BDYZPHZ ||
                        MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ ||
                        MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG ||
                        MjClient.getAppType() == MjClient.APP_TYPE.QXXXGHZ) {
                        content = "亲友圈付";
                    }
                    playString += content;
                    break;
            }
            _info.setString(oneData.roundNum + "局" + "," + playString);


            var _gameType = _copy.getChildByName("gameType");
            cc.log("oneData.gameType == " + oneData.gameType);
            _gameType.setString(GameCnName[oneData.gameType]);
            _gameType.ignoreContentAdaptWithSize(true);


            var _nameText = _copy.getChildByName("player0");
            _nameText.ignoreContentAdaptWithSize(true);


            if (oneData.players.length <= 0) {
                return _copy;
            }

            cc.log("==================nameText = " + JSON.stringify(oneData));
            function nameText(idx) {

                var _name = _copy.getChildByName("player" + idx);
                cc.log("==================nameText = " + idx);
                _name.getChildByName("tagIcon").visible = false;

                if (isJinZhongAPPType() ||
                    MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP ||
                    MjClient.getAppType() == MjClient.APP_TYPE.HUBEIMJ ||
                    MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ ||
                    MjClient.getAppType() == MjClient.APP_TYPE.AYGUIZHOUMJ ||
                    MjClient.getAppType() === MjClient.APP_TYPE.QXYZQP ||
                    MjClient.getAppType() === MjClient.APP_TYPE.BDYZPHZ ||
                    MjClient.getAppType() === MjClient.APP_TYPE.QXSYDTZ ||
                    MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG ||
                    MjClient.getAppType() === MjClient.APP_TYPE.QXLYQP
                ) {
                    var _uName = _name.getChildByName("Text_name");
                    _uName.ignoreContentAdaptWithSize(true);
                    var _uScore = _name.getChildByName("Text_score");
                    _uScore.ignoreContentAdaptWithSize(true);
                    _uName.setString(getNewName(unescape(oneData.players[idx].playerName), 8) + "");
                    if ((isJinZhongAPPType() ||
                        MjClient.getAppType() === MjClient.APP_TYPE.QXYZQP ||
                        MjClient.getAppType() === MjClient.APP_TYPE.BDYZPHZ ||
                        MjClient.getAppType() === MjClient.APP_TYPE.QXSYDTZ ||
                        MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG ||
                        MjClient.getAppType() === MjClient.APP_TYPE.QXLYQP) &&
                        Number(oneData.players[idx].score) <= 0) {
                        _uScore.setColor(cc.color(72, 132, 162));
                    }
                    else if ((MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP
                        || MjClient.getAppType() == MjClient.APP_TYPE.HUBEIMJ
                        || MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ
                        || MjClient.getAppType() == MjClient.APP_TYPE.AYGUIZHOUMJ)
                        && Number(oneData.players[idx].score) <= 0) {
                        _uScore.setColor(cc.color("#08460e"));
                    }
                    _uScore.setString(oneData.players[idx].score + "");
                    return "ID:" + oneData.players[idx].userId;
                }
                else {
                    if (oneData.players[idx].userId == WinerId) {
                        _name.getChildByName("tagIcon").visible = true;
                    }
                    cc.log("oneData.players[idx].userId = " + oneData.players[idx].userId);
                    cc.log("that.WinerId = " + that.WinerId);

                    return getNewName(unescape(oneData.players[idx].playerName), 8) + ":" + oneData.players[idx].score;
                }
            }


            var _nameText0 = _copy.getChildByName("player0");
            _nameText0.ignoreContentAdaptWithSize(true);
            _nameText0.setString(nameText(0));

            var _nameText1 = _copy.getChildByName("player1");
            _nameText1.ignoreContentAdaptWithSize(true);
            _nameText1.setString(nameText(1));

            var _nameText2 = _copy.getChildByName("player2");
            _nameText2.ignoreContentAdaptWithSize(true);
            if (oneData.players.length >= 3) {
                _nameText2.setString(nameText(2));
            }
            else {
                _nameText2.visible = false;
            }

            var _nameText3 = _copy.getChildByName("player3");
            _nameText3.ignoreContentAdaptWithSize(true);
            if (oneData.players.length >= 4) {
                _nameText3.setString(nameText(3));
            }
            else {
                _nameText3.visible = false;
            }

            var _nameText4 = _copy.getChildByName("player4");
            if (_nameText4) {
                _nameText4.ignoreContentAdaptWithSize(true);
                if (oneData.players.length >= 5) {
                    _nameText4.setString(nameText(4));
                }
                else {
                    _nameText4.visible = false;
                }
            }

            var line = _copy.getChildByName("line_shu3");
            if (line && oneData.players.length <= 2) {
                line.visible = false;
            }

            return _copy;
        }


        function initRoomRecordList(Data) {
            cc.log("initRoomRecordList = " + JSON.stringify(Data));

            for (var i = 0; i < Data.length; i++) {
                cc.log("Data[i] = " + JSON.stringify(Data[i]));
                if (Data[i].gameType != -1) {
                    _listView.pushBackCustomItem(createOneCell(Data[i], i));
                }
            }

            if (nullTip_image) {
                nullTip_image.visible = _listView.getItems().length == 0;
                nullTip_text.visible = _listView.getItems().length == 0;
            }
        }

        MjClient.block();
        MjClient.gamenet.request("pkplayer.handler.roomHistory", { index: 1, pageNum: 20 },
            function (rtn) {
                if (rtn.code == 0) {

                    initRoomRecordList(rtn.data.list);
                }
                else {
                    if (rtn.message) {
                        MjClient.showToast(rtn.message);
                    }
                    else {
                        MjClient.showToast("获取数据失败,请重新打开");
                    }

                }

                MjClient.unblock();
            }
        );

    }
});
