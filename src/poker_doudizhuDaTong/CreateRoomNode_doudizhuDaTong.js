setWxHead/**
 * Created by sking on 2017/7/21.
 */


var CreateRoomNode_doudizhuDaTong = CreateRoomNode.extend({
    setKey: function () {
        this.localStorageKey.KEY_DDZDT_playerNumber = "_DOU_DI_ZHU_DT_PLAYER_NUMBER";     //玩家数量
        this.localStorageKey.KEY_DDZDT_fengding = "_DOU_DI_ZHU_DT_FENG_DING";           //封顶 封顶
        this.localStorageKey.KEY_DDZDT_dizhu = "_DI_ZHU_DT_FENG_DING";           //底分
        this.localStorageKey.KEY_DDZDT_jiabei = "_DI_ZHU_DT_JIA_BEI";              //加倍
        this.localStorageKey.KEY_DDZDT_type = "_DOU_DI_ZHU_TYPE";           //类型
        this.localStorageKey.KEY_DDZDT_gps = "_DOU_DI_ZHU_DT_GPS"; //防作弊
        this.localStorageKey.KEY_DDZDT_shuangwangbijiao = "_DOU_DI_ZHU_DT_SHUANG_WANG_BIJIAO";                //双王必叫
        this.localStorageKey.KEY_DDZDT_sigeerbijiao = "_DOU_DI_ZHU_DT_SI_GE_ER_BIJIAO";                //四个二必叫
    },
    initAll: function (IsFriendCard) {
        if (!IsFriendCard)
            this.setKey();

        this.bg_node = ccs.load("bg_doudizhuDaTong.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_node");
        this.playScroll = this.bg_node.getChildByName("playScroll");
        this._scroll_round = this.playScroll.getChildByName("round");
    },
    initPlayNode: function () {
        if (MjClient.APP_TYPE.QXJSMJ == MjClient.getAppType()) {
            this._super();
        }

        var _bg_Node = this.playScroll;

        var _playWay = _bg_Node.getChildByName("play");
        this._playNode_fengding_0 = _playWay.getChildByName("play_fengding0");
        this._playNode_fengding_1 = _playWay.getChildByName("play_fengding1");
        this._playNode_fengding_2 = _playWay.getChildByName("play_fengding2");
        var nodeListfeng = [];
        nodeListfeng.push(this._playNode_fengding_0);
        nodeListfeng.push(this._playNode_fengding_1);
        nodeListfeng.push(this._playNode_fengding_2);
        this._playNode_feng_radio = createRadioBoxForCheckBoxs(nodeListfeng, this.radioBoxSelectCB);
        this.addListenerText(nodeListfeng, this._playNode_feng_radio);

        //加倍
        this._playNode_jiabei_0 = _playWay.getChildByName("play_jiabei0");
        this._playNode_jiabei_1 = _playWay.getChildByName("play_jiabei1");
        this._playNode_jiabei_2 = _playWay.getChildByName("play_jiabei2");
        var nodeListjiabei = [];
        nodeListjiabei.push(this._playNode_jiabei_0);
        nodeListjiabei.push(this._playNode_jiabei_1);
        nodeListjiabei.push(this._playNode_jiabei_2);
        this._playNode_jiabei_radio = createRadioBoxForCheckBoxs(nodeListjiabei, this.radioBoxSelectCB);
        this.addListenerText(nodeListjiabei, this._playNode_jiabei_radio);

        this._playNode_type_0 = _playWay.getChildByName("play_type");
        this._playNode_type_1 = _playWay.getChildByName("play_type1");
        var nodeListtype = [];
        nodeListtype.push(this._playNode_type_0);
        nodeListtype.push(this._playNode_type_1);
        this._playNode_type_radio = createRadioBoxForCheckBoxs(nodeListtype, function (index) {
            this.showPlayType(index);
            this.radioBoxSelectCB(index, nodeListtype[index], nodeListtype);
        }.bind(this));
        this.addListenerText(nodeListtype, this._playNode_type_radio, this.showPlayType.bind(this));
        this._playTypelist = nodeListtype;


        this._zhuIdx = 0;//数组的引索
        var _fenshu = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
        var _arrayLenth = _fenshu.length;//数组长度
        this._ZhuNum = _bg_Node.getChildByName("txt_fen");
        cc.log("11111ccccc::" + this._zhuIdx);
        cc.log("11111ccccc::" + _fenshu[this._zhuIdx]);
        this._ZhuNum.setString(_fenshu[this._zhuIdx]);
        this._Button_sub = _bg_Node.getChildByName("btn_sub");
        this._Button_sub.addTouchEventListener(function (sender, type) {
            if (type == 2) {
                this._zhuIdx = (_arrayLenth + --this._zhuIdx) % _arrayLenth;
                this._ZhuNum.setString(_fenshu[this._zhuIdx]);
                this.setRoomCardModeFree();
            }
        }, this);
        this._Button_add = _bg_Node.getChildByName("btn_add");
        this._Button_add.addTouchEventListener(function (sender, type) {
            if (type == 2) {
                this._zhuIdx = (_arrayLenth + ++this._zhuIdx) % _arrayLenth;
                this._ZhuNum.setString(_fenshu[this._zhuIdx]);
                this.setRoomCardModeFree();
            }
        }, this);


        //防作弊
        this._playNode_gps = this.bg_node.getChildByName("play_gps");
        this.addListenerText(this._playNode_gps);
        this._playNode_gps.addEventListener(this.clickCB, this._playNode_gps);
        COMMON_UI.addHelpUI(this._playNode_gps);

        this._playNode_bijiaoshuangwang = _playWay.getChildByName("play_bijiaoshuangwang");   //双王必叫
        this.addListenerText(this._playNode_bijiaoshuangwang);
        this._playNode_bijiaoshuangwang.addEventListener(this.clickCB, this._playNode_bijiaoshuangwang);

        this._playNode_bijiaosigeer = _playWay.getChildByName("play_bijiaosigeer");   //四个二必叫
        this.addListenerText(this._playNode_bijiaosigeer);
        this._playNode_bijiaosigeer.addEventListener(this.clickCB, this._playNode_bijiaosigeer);

        //人数
        this._playNode_maxPlayer0 = _playWay.getChildByName("play_count0");
        this._playNode_maxPlayer1 = _playWay.getChildByName("play_count1");
        var nodeCountList1 = [];
        nodeCountList1.push(this._playNode_maxPlayer0);
        nodeCountList1.push(this._playNode_maxPlayer1);
        this._playNode_player_count_radio = createRadioBoxForCheckBoxs(nodeCountList1, function (index) {
            this.changePayForPlayerNum(index);
            this.radioBoxSelectCB(index, nodeCountList1[index], nodeCountList1);
        }.bind(this));
        this.addListenerText(nodeCountList1, this._playNode_player_count_radio, this.changePayForPlayerNum.bind(this));
        this._countlist = nodeCountList1;

    },
    initRoundNode: function () {
        this._super();
        //打开大赢家付
        this.payWayNodeArray[2].visible = true;
        this.payWayNodeArray[2].setEnabled(true);
    },
    setPlayNodeCurrentSelect: function (isClub) {
        if (MjClient.APP_TYPE.QXJSMJ == MjClient.getAppType()) {
            this._super();
        }
        //设置上次创建房间时的默认选项
        var _fengDing;
        if (isClub)
            _fengDing = this.getNumberItem("zhafengding", 3);
        else
            _fengDing = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_DDZDT_fengding, 3);
        this._playNode_fengding_0.setSelected(false);
        this._playNode_fengding_1.setSelected(false);
        this._playNode_fengding_2.setSelected(false);

        var list = [];
        list.push(this._playNode_fengding_0);
        list.push(this._playNode_fengding_1);
        list.push(this._playNode_fengding_2);
        var index = 0;

        if (_fengDing == 3) {
            this._playNode_fengding_0.setSelected(true);
            index = 0;
        }
        else if (_fengDing == 4) {
            index = 1;
            this._playNode_fengding_1.setSelected(true);
        }
        else if (_fengDing == 5) {
            index = 2;
            this._playNode_fengding_2.setSelected(true);
        }
        this.radioBoxSelectCB(index, list[index], list);
        //加倍
        var _jiabei;
        _jiabei = isClub ? this.getNumberItem("jiabei", 1) : util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_DDZDT_jiabei, 1);
        this._playNode_jiabei_0.setSelected(false);
        this._playNode_jiabei_1.setSelected(false);
        this._playNode_jiabei_2.setSelected(false);
        var jiabeilist = [];
        jiabeilist.push(this._playNode_jiabei_0);
        jiabeilist.push(this._playNode_jiabei_1);
        jiabeilist.push(this._playNode_jiabei_2);
        var tmpindex = 0;
        if (_jiabei == 1) {
            tmpindex = 0;
            this._playNode_jiabei_0.setSelected(true);
        } else if (_jiabei == 2) {
            tmpindex = 1;
            this._playNode_jiabei_1.setSelected(true);
        } else if (_jiabei == 4) {
            tmpindex = 2;
            this._playNode_jiabei_2.setSelected(true);
        }
        this.radioBoxSelectCB(tmpindex, jiabeilist[tmpindex], jiabeilist);
        //游戏类型
        var _type;
        if (isClub) {
            _type = this.getStringItem("type", "jingdian");
            if (_type == "jingdian") _type = 1;
            else _type = 0;
        }
        else
            _type = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_DDZDT_type, 1);
        this._playNode_type_radio.selectItem(_type);
        this.radioBoxSelectCB(_type, this._playTypelist[_type], this._playTypelist);



        this.showPlayType(_type);
        var _difen = 1;
        var _fenshu = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
        cc.log("1111111111111111221111:::" + _difen);
        if (isClub) {
            _difen = _fenshu.indexOf(this.getNumberItem("difen", 1));
            cc.log("111122222111111111221:::" + _difen);
        }
        else {
            _difen = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_DDZDT_dizhu, 0);
            cc.log("33333333334:::" + _difen);
        }


        cc.log("11111111111111111111:::" + _difen);
        this._zhuIdx = (_fenshu.length + _difen) % _fenshu.length;
        cc.log("11111111111111111111:::" + this._zhuIdx);
        this._ZhuNum.setString(_fenshu[this._zhuIdx]);
        //防作弊
        var _gps;
        if (isClub)
            _gps = this.getBoolItem("gps", false);
        else
            _gps = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_DDZDT_gps, false);
        this._playNode_gps.setSelected(_gps);
        var text = this._playNode_gps.getChildByName("text");
        this.selectedCB(text, _gps);

        //双王必叫
        var _shuangwangbijiao;
        if (isClub)
            _shuangwangbijiao = this.getBoolItem("bijiaoShuangwang", true);
        else
            _shuangwangbijiao = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_DDZDT_shuangwangbijiao, true);
        this._playNode_bijiaoshuangwang.setSelected(_shuangwangbijiao);
        var text = this._playNode_bijiaoshuangwang.getChildByName("text");
        this.selectedCB(text, _shuangwangbijiao);

        //四个二必叫
        var _sigeerbijiao;
        if (isClub)
            _sigeerbijiao = this.getBoolItem("bijiaoSigeer", true);
        else
            _sigeerbijiao = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_DDZDT_sigeerbijiao, true);
        this._playNode_bijiaosigeer.setSelected(_sigeerbijiao);
        var text = this._playNode_bijiaosigeer.getChildByName("text");
        this.selectedCB(text, _sigeerbijiao);

        //人数
        var _countIdx;
        if (isClub) {
            var _count = this.getNumberItem("maxPlayer", 3);
            switch (_count) {
                case 2:
                    _countIdx = 1;
                    break;
                case 3:
                    _countIdx = 0;
                    break;
                default:
                    _countIdx = 0;
                    break;
            }
        } else {
            _countIdx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_DDZDT_playerNumber, 0);
        }
        this._playNode_player_count_radio.selectItem(_countIdx);
        this.radioBoxSelectCB(_countIdx, this._countlist[_countIdx], this._countlist);
    },
    getSelectedPara: function () {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.DOU_DI_ZHU_DA_TONG;
        para.maxPlayer = 3;
        para.zhafengding = 3;
        para.difen = 1;
        para.type = "jingdian";
        para.bijiaoShuangwang = false;
        para.bijiaoSigeer = false;
        para.jiabei = 1;
        if (this._nodeGPS) para.gps = this._nodeGPS.isSelected(); // add by sking for creat room need gps

        if (this._playNode_fengding_0.isSelected()) {
            para.zhafengding = 3;
        }
        else if (this._playNode_fengding_1.isSelected()) {
            para.zhafengding = 4;
        }
        else if (this._playNode_fengding_2.isSelected()) {
            para.zhafengding = 5;
        }

        ///////////
        var _type = 0;
        if (this._playNode_type_0.isSelected()) {
            _type = 0;
            para.type = "huanle";
        } else if (this._playNode_type_1.isSelected()) {
            _type = 1;
            para.type = "jingdian";
            para.bijiaoShuangwang = this._playNode_bijiaoshuangwang.isSelected();
            para.bijiaoSigeer = this._playNode_bijiaosigeer.isSelected();
        }
        //加倍
        if (para.type == "jingdian") {
            if (this._playNode_jiabei_0.isSelected()) {
                para.jiabei = 1;
            }
            else if (this._playNode_jiabei_1.isSelected()) {
                para.jiabei = 2;
            }
            else if (this._playNode_jiabei_2.isSelected()) {
                para.jiabei = 4;
            }
        } else {
            para.jiabei = 1;
        }

        para.difen = this._ZhuNum.getString();

        //人数
        var _countIdx = 0;
        if (this._playNode_maxPlayer0.isSelected()) {
            para.maxPlayer = 3;
            _countIdx = 0;
        } else if (this._playNode_maxPlayer1.isSelected()) {
            para.maxPlayer = 2;
            _countIdx = 1;
        }

        //防作弊
        para.gps = this._playNode_gps.isSelected();
        cc.log("setparam: " + this._zhuIdx);
        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_DDZDT_fengding, para.zhafengding);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_DDZDT_type, _type);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_DDZDT_shuangwangbijiao, para.bijiaoShuangwang);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_DDZDT_sigeerbijiao, para.bijiaoSigeer);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_DDZDT_dizhu, this._zhuIdx);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_DDZDT_gps, para.gps);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_DDZDT_playerNumber, _countIdx);
            if (para.type == "jingdian") //只有经典才有加倍
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_DDZDT_jiabei, para.jiabei);
            
        }
        cc.log("createara: " + JSON.stringify(para));
        return para;
    },
    showPlayType: function (index) {
        if (index == 0) {
            this._playNode_bijiaosigeer.setVisible(false);
            this._playNode_bijiaoshuangwang.setVisible(false);
            this._playNode_jiabei_0.setVisible(false);
            this._playNode_jiabei_1.setVisible(false);
            this._playNode_jiabei_2.setVisible(false);

        }
        else {
            this._playNode_bijiaosigeer.setVisible(true);
            this._playNode_bijiaoshuangwang.setVisible(true);
            this._playNode_jiabei_0.setVisible(true);
            this._playNode_jiabei_1.setVisible(true);
            this._playNode_jiabei_2.setVisible(true);
        }
    }
});