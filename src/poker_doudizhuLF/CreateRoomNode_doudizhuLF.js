/**
 * Created by sking on 2017/7/21.
 */


var CreateRoomNode_doudizhuLF = CreateRoomNode.extend({
    setKey: function () {
        this.localStorageKey.KEY_linfendoudizhu_playerNumber = "_DOU_DI_ZHU_LIN_FEN_PLAYER_NUMBER";       //玩家数量
        this.localStorageKey.KEY_linfendoudizhu_fengding = "_DOU_DI_ZHU_LIN_FEN_FENG_DING";           //封顶
        this.localStorageKey.KEY_linfendoudizhu_difen = "_DOU_DI_ZHU_LIN_FEN_DI_FEN";              //底分
        this.localStorageKey.KEY_linfendoudizhu_suanfen = "_DOU_DI_ZHU_LIN_FEN_SUAN_FEN";            //算分类型
        this.localStorageKey.KEY_linfendoudizhu_gps = "_DOU_DI_ZHU_LIN_FEN_GPS";                 //防作弊
        this.localStorageKey.KEY_linfendoudizhu_daiti = "_DOU_DI_ZHU_LIN_FEN_DAI_TI";              //玩法：带踢
        this.localStorageKey.KEY_linfendoudizhu_sidaisi = "_DOU_DI_ZHU_LIN_FEN_SI_DAI_SI";           //玩法：四带两对
        this.localStorageKey.KEY_linfendoudizhu_threesandoubleboom = "_DOU_DI_ZHU_LIN_FEN_THREE_SAN_DOUBLE_BOOM";//玩法：三个3算两炸
        this.localStorageKey.KEY_linfendoudizhu_shuangliandui = "_DOU_DI_ZHU_LIN_FEN_SHUANG_LIAN_DUI";    //玩法：双连对
        this.localStorageKey.KEY_linfendoudizhu_ti_byOrder = "_DOU_DI_ZHU_LIN_FEN_TI_BYORDER";
        this.localStorageKey.KEY_linfendoudizhu_ti_countScore = "_DOU_DI_ZHU_LIN_FEN_TI_COUNTSCORE";
    },
    initAll: function (IsFriendCard) {
        if (!IsFriendCard)
            this.setKey();

        this.bg_node = ccs.load("bg_doudizhuLF.json").node;
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
        this._playNode_fengding_3 = _playWay.getChildByName("play_fengding3");
        this._playNode_fengding_4 = _playWay.getChildByName("play_fengding4");
        var nodeListfeng = [];
        nodeListfeng.push(this._playNode_fengding_0);
        nodeListfeng.push(this._playNode_fengding_1);
        nodeListfeng.push(this._playNode_fengding_2);
        nodeListfeng.push(this._playNode_fengding_3);
        nodeListfeng.push(this._playNode_fengding_4);

        var setCountScoreNode = function(index){
            if(index == 4){
                setItemNode(this._playNode_countScore, 1, true);
                this._playNode_countScore.setVisible(false);
            }else{
                this._playNode_countScore.setVisible(this._playNode_daiti.isSelected());
            }
        }.bind(this);

        this._playNode_feng_radio = createRadioBoxForCheckBoxs(nodeListfeng, function(index){
            setCountScoreNode(index);
            this.radioBoxSelectCB(index, nodeListfeng[index], nodeListfeng);
        }.bind(this));
        this.addListenerText(nodeListfeng, this._playNode_feng_radio, setCountScoreNode);
        this._fenglist = nodeListfeng;
        //算分
        this._score_type_0 = _playWay.getChildByName("score_type");
        this._score_type_1 = _playWay.getChildByName("score_type1");
        var nodeListtype = [];
        nodeListtype.push(this._score_type_0);
        nodeListtype.push(this._score_type_1);
        this._score_tpye_radio = createRadioBoxForCheckBoxs(nodeListtype, this.radioBoxSelectCB);
        this.addListenerText(nodeListtype, this._score_tpye_radio);
        this._scoretypelist = nodeListtype;

        //人数
        this._playNode_maxPlayer0 = _playWay.getChildByName("play_count0");
        this._playNode_maxPlayer1 = _playWay.getChildByName("play_count1");
        this._playNode_maxPlayer2 = _playWay.getChildByName("play_count2");
        var nodeCountList1 = [];
        nodeCountList1.push(this._playNode_maxPlayer0);
        nodeCountList1.push(this._playNode_maxPlayer1);
        nodeCountList1.push(this._playNode_maxPlayer2);
        this._playNode_player_count_radio = createRadioBoxForCheckBoxs(nodeCountList1, function (index) {
            this.changePayForPlayerNum(index);
            this.radioBoxSelectCB(index, nodeCountList1[index], nodeCountList1);
        }.bind(this));
        this.addListenerText(nodeCountList1, this._playNode_player_count_radio, this.changePayForPlayerNum.bind(this));
        this._countlist = nodeCountList1;

        //底分
        this._zhuIdx = 0;//数组的引索
        var _fenshu = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
        var _arrayLenth = _fenshu.length;//数组长度
        this._ZhuNum = _bg_Node.getChildByName("txt_fen");
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

        var selectColor = CREATEROOM_COLOR_1;
        var unSelectColor = CREATEROOM_COLOR_3;

        var setItemNode = function(node, type, bForceUnChecked){
            var bChecked = (type == ccui.CheckBox.EVENT_SELECTED);
            
            if(bForceUnChecked){
                bChecked = false;
            }
            node.setSelected(bChecked);

            switch (type) {
                case ccui.CheckBox.EVENT_SELECTED:
                case ccui.CheckBox.EVENT_UNSELECTED:
                    var txt = node.getChildByName("text");
                    if (node.isSelected()) {
                        txt.setTextColor(selectColor);
                    } else {
                        txt.setTextColor(unSelectColor);
                    }
                    break;
            }
        }.bind(this);

        var onClickCallBackOfNode_daiti = function(type){
            switch (type) {
                case ccui.CheckBox.EVENT_SELECTED:
                case ccui.CheckBox.EVENT_UNSELECTED:
                    var txt = this._playNode_daiti.getChildByName("text");
                    if (this._playNode_daiti.isSelected()) {
                        txt.setTextColor(selectColor);
                    } else {
                        txt.setTextColor(unSelectColor);
                    }
                    break;
            }

            setItemNode(this._playNode_countScore, type, true);
            setItemNode(this._playNode_ti_byOrder, type, true);
            this._playNode_ti_byOrder.setVisible(type == ccui.CheckBox.EVENT_SELECTED ? true : false);
            this._playNode_countScore.setVisible((type == ccui.CheckBox.EVENT_SELECTED ? true : false) && 
                this._playNode_feng_radio.getSelectItem() != this._playNode_fengding_4);
        }.bind(this);

        //带踢
        this._playNode_daiti = _playWay.getChildByName("play_daiti");
        this.addListenerText(this._playNode_daiti, null, function(selectedNum,sender){
            onClickCallBackOfNode_daiti(sender.isSelected() ? 0:1);
        }.bind(this));
        this._playNode_daiti.addEventListener(function (sender, type) {
            onClickCallBackOfNode_daiti(type);
             
        }, this);

        //踢按顺序
        this._playNode_ti_byOrder = _playWay.getChildByName("play_daiti_byOrder");
        this.addListenerText(this._playNode_ti_byOrder);
        this._playNode_ti_byOrder.addEventListener(function (sender, type) {
            setItemNode(this._playNode_ti_byOrder, type);
        }, this);


        //踢计分
        this._playNode_countScore = _playWay.getChildByName("play_daiti_countScore");
        this.addListenerText(this._playNode_countScore);
        this._playNode_countScore.addEventListener(this.clickCB, this._playNode_countScore);
        

        //四带两对
        this._playNode_sidaisi = _playWay.getChildByName("play_sidaisi");
        this.addListenerText(this._playNode_sidaisi);
        this._playNode_sidaisi.addEventListener(this.clickCB, this._playNode_sidaisi);

        //三个3算两炸
        this._playNode_threeSanDoubleBoom = _playWay.getChildByName("play_threeSandoubleBoom");
        this.addListenerText(this._playNode_threeSanDoubleBoom);
        this._playNode_threeSanDoubleBoom.addEventListener(this.clickCB, this._playNode_threeSanDoubleBoom);

        //双连对
        this._playNode_shuangliandui = _playWay.getChildByName("play_shuangliandui");
        this.addListenerText(this._playNode_shuangliandui);
        this._playNode_shuangliandui.addEventListener(this.clickCB, this._playNode_shuangliandui);
        this._playNode_shuangliandui.visible = this.getNumberItem("maxPlayer", 4) == 4;
    },
    initRoundNode: function () {
        this._super();
        //打开大赢家付
        this.payWayNodeArray[2].visible = true;
        this.payWayNodeArray[2].setEnabled(true);
    },
    setPlayNodeCurrentSelect: function (isclub) {
        if (MjClient.APP_TYPE.QXJSMJ == MjClient.getAppType()) {
            this._super();
        }

        //人数
        var _countIdx;
        if (isclub) {
            var _count = this.getNumberItem("maxPlayer", 4);
            switch (_count) {
                case 2:
                    _countIdx = 2;
                    break;
                case 3:
                    _countIdx = 1;
                    break;
                case 4:
                    _countIdx = 0;
                    break;
                default:
                    _countIdx = 0;
                    break;
            }
        } else {
            _countIdx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_linfendoudizhu_playerNumber, 0);
        }
        this._playNode_player_count_radio.selectItem(_countIdx);
        this.radioBoxSelectCB(_countIdx, this._countlist[_countIdx], this._countlist);
        //封顶
        var _currentfengidx;
        if (isclub) {
            var _count = this.getNumberItem("zhafengding", 4);
            switch (_count) {
                case 3:
                    _currentfengidx = 0;
                    break;
                case 4:
                    _currentfengidx = 1;
                    break;
                case 5:
                    _currentfengidx = 2;
                    break;
                case 6:
                    _currentfengidx = 3;
                    break;
                case 0:
                    _currentfengidx = 4;
                    break;
                default:
                    _currentfengidx = 1;
                    break;
            }
        } else {
            _currentfengidx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_linfendoudizhu_fengding, 1)
        }
        this._playNode_feng_radio.selectItem(_currentfengidx);
        this.radioBoxSelectCB(_currentfengidx, this._fenglist[_currentfengidx], this._fenglist);
        //算分
        var _currentindex;
        if (isclub) {
            var type = this.getNumberItem("scoreType", 0);
            if (type == 0) {
                _currentindex = 0;
            } else {
                _currentindex = 1;
            }
        } else {
            _currentindex = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_linfendoudizhu_suanfen, 0);
        }
        this._score_tpye_radio.selectItem(_currentindex);
        this.radioBoxSelectCB(_currentindex, this._scoretypelist[_currentindex], this._scoretypelist);
        //低分
        var _difen;
        var _fenshu = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
        if (isclub) {
            _difen = _fenshu.indexOf(this.getNumberItem("difen", 1));
        } else
            _difen = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_linfendoudizhu_difen, 0);
        this._zhuIdx = (_fenshu.length + _difen) % _fenshu.length;
        this._ZhuNum.setString(_fenshu[this._zhuIdx]);
        //防作弊
        var _gps;
        if (isclub) {
            _gps = this.getBoolItem("gps", false);
        } else {
            _gps = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_linfendoudizhu_gps, false);
        }
        this._playNode_gps.setSelected(_gps);
        var text = this._playNode_gps.getChildByName("text");
        this.selectedCB(text, _gps);
        //带踢
        var _daiti;
        if (isclub) {
            _daiti = this.getBoolItem("daiti", true);
        } else {
            _daiti = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_linfendoudizhu_daiti, true);
        }
        this._playNode_daiti.setSelected(_daiti);
        var text = this._playNode_daiti.getChildByName("text");
        this.selectedCB(text, _daiti);

        //
        var _ti_byOrder;
        if (isclub) {
            _ti_byOrder = this.getBoolItem("ti_byOrder", false);
        } else {
            _ti_byOrder = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_linfendoudizhu_ti_byOrder, false);
        }
        this._playNode_ti_byOrder.setSelected(_ti_byOrder);
        var text = this._playNode_ti_byOrder.getChildByName("text");
        this.selectedCB(text, _ti_byOrder);

        if(!_daiti){
           this._playNode_ti_byOrder.setVisible(false); 
           this._playNode_countScore.setVisible(false);
        }

        if(_currentfengidx == 4){
            this._playNode_countScore.setVisible(false);
        }

        var _ti_countScore;
        if (isclub) {
            _ti_countScore = this.getBoolItem("ti_countScore", false);
        } else {
            _ti_countScore = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_linfendoudizhu_ti_countScore, false);
        }
        
        if(!this._playNode_countScore.isVisible()){
            _ti_countScore = false;
        }
        this._playNode_countScore.setSelected(_ti_countScore);
        var text = this._playNode_countScore.getChildByName("text");
        this.selectedCB(text, _ti_countScore);
        
        //
        //四带两对
        var _sidaisi;
        if (isclub) {
            _sidaisi = this.getBoolItem("sidaisi", true);
        } else {
            _sidaisi = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_linfendoudizhu_sidaisi, true);
        }
        this._playNode_sidaisi.setSelected(_sidaisi);
        var text = this._playNode_sidaisi.getChildByName("text");
        this.selectedCB(text, _sidaisi);

        //三个3算两炸
        var _threeSanDoubleBoom;
        if (isclub) {
            _threeSanDoubleBoom = this.getBoolItem("zhaDanSanGeSan", false);
        } else {
            _threeSanDoubleBoom = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_linfendoudizhu_threesandoubleboom, false);
        }
        this._playNode_threeSanDoubleBoom.setSelected(_threeSanDoubleBoom);
        var text = this._playNode_threeSanDoubleBoom.getChildByName("text");
        this.selectedCB(text, _threeSanDoubleBoom);

        //双连对
        var _shuangliandui;
        if (isclub) {
            _shuangliandui = this.getBoolItem("shuangliandui", false);
        } else {
            _shuangliandui = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_linfendoudizhu_shuangliandui, false);
        }
        this._playNode_shuangliandui.setSelected(_shuangliandui);
        var text = this._playNode_shuangliandui.getChildByName("text");
        this.selectedCB(text, _shuangliandui);
        this._playNode_shuangliandui.visible = this.getNumberItem("maxPlayer", 4) == 4;
    },
    getSelectedPara: function () {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.DOU_DI_ZHU_LIN_FEN;
        //炸弹封顶
        var _fengIdx = 0;
        if (this._playNode_fengding_0.isSelected()) {
            para.zhafengding = 3;
            _fengIdx = 0;
        } else if (this._playNode_fengding_1.isSelected()) {
            para.zhafengding = 4;
            _fengIdx = 1;
        } else if (this._playNode_fengding_2.isSelected()) {
            para.zhafengding = 5;
            _fengIdx = 2;
        } else if (this._playNode_fengding_3.isSelected()) {
            para.zhafengding = 6;
            _fengIdx = 3;
        }else if (this._playNode_fengding_4.isSelected()) {
            para.zhafengding = 0;
            _fengIdx = 4;
        }

        //人数
        var _countIdx = 0;
        if (this._playNode_maxPlayer0.isSelected()) {
            para.maxPlayer = 4;
            _countIdx = 0;
        } else if (this._playNode_maxPlayer1.isSelected()) {
            para.maxPlayer = 3;
            _countIdx = 1;
        } else if (this._playNode_maxPlayer2.isSelected()) {
            para.maxPlayer = 2;
            _countIdx = 2;
        }

        var typeIdx = 0;
        if (this._score_type_0.isSelected()) {
            para.scoreType = 0;
            typeIdx = 0;
        } else if (this._score_type_1.isSelected()) {
            para.scoreType = 1;
            typeIdx = 1;
        }

        // para.difen = parseInt(this._ZhuNum.getString());
        para.difen = this._ZhuNum.getString();

        //防作弊
        para.gps = this._playNode_gps.isSelected();

        //带踢
        para.daiti = this._playNode_daiti.isSelected();

        para.ti_byOrder = this._playNode_ti_byOrder.isSelected();

        para.ti_countScore = this._playNode_countScore.isSelected();

        //四带两对
        para.sidaisi = this._playNode_sidaisi.isSelected();

        //三个三算两炸
        para.zhaDanSanGeSan = this._playNode_threeSanDoubleBoom.isSelected();

        //双连对
        para.shuangliandui = this._playNode_shuangliandui.isSelected()&&para.maxPlayer == 4;
        this._playNode_shuangliandui.visible = para.maxPlayer == 4;
        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_linfendoudizhu_fengding, _fengIdx);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_linfendoudizhu_playerNumber, _countIdx);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_linfendoudizhu_suanfen, typeIdx);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_linfendoudizhu_difen, this._zhuIdx);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_linfendoudizhu_gps, para.gps);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_linfendoudizhu_daiti, para.daiti);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_linfendoudizhu_sidaisi, para.sidaisi);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_linfendoudizhu_threesandoubleboom, para.zhaDanSanGeSan);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_linfendoudizhu_shuangliandui, para.shuangliandui);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_linfendoudizhu_ti_byOrder, para.ti_byOrder); 
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_linfendoudizhu_ti_countScore, para.ti_countScore); 
        }
        cc.log("createara: " + JSON.stringify(para));
        return para;
    }
});