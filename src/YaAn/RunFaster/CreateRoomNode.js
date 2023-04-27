var CreateRoomNode_PaoDeKuaiYA = CreateRoomNode.extend({
    setKey: function () {
        this.localStorageKey.KEY_RUNFASTERYA_CARDNUMBER = "RUNFASTERYA_CARDNUMBER";      // 手牌数量
        this.localStorageKey.KEY_RUNFASTERYA_PLAYERNUMBER = "RUNFASTERYA_PLAYER_NUMBER";     // 玩家数量
        this.localStorageKey.KEY_RUNFASTERYA_DIFEN = "RUNFASTERYA_DIFEN";                   // 底分
        this.localStorageKey.KEY_RUNFASTERYA_XIAN_SHOU = "RUNFASTERYA_XIAO_SHOU";               // 先手
        this.localStorageKey.KEY_RUNFASTERYA_SHUFFLE_OPTION = "RUNFASTERYA_SHUFFLE_OPTION" // 切牌
        this.localStorageKey.KEY_RUNFASTERYA_MUST_PUT = "RUNFASTERYA_MUST_PUT";                 //能管必管
        this.localStorageKey.KEY_RUNFASTERYA_SHOWCARDNUMBER = "RUNFASTERYA_SHOW_CARD_NUMBER";        // 显示牌数
        this.localStorageKey.KEY_RUNFASTERYA_CAN_CHUNTIAN = "RUNFASTERYA_CAN_CHUNTIAN";        // 可春天
        this.localStorageKey.KEY_RUNFASTERYA_CAN_FANCHUN = "RUNFASTERYA_CAN_FANCHUN";        // 可反春
        this.localStorageKey.KEY_RUNFASTERYA_SUN_PASS = "RUNFASTERYA_SUN_PASS";        // 快速过牌
        this.localStorageKey.KEY_RUNFASTERYA_SANZHANG_FEIJI = "RUNFASTERYA_SANZHANG_FEIJI";        // 三张飞机少接
        this.localStorageKey.KEY_RUNFASTERYA_YIZHANG = "RUNFASTERYA_YIZHANG";        // 剩一张不输
        this.localStorageKey.KEY_RUNFASTERYA_CAN_ZHADAN = "RUNFASTERYA_CAN_ZHADAN";        // 带炸弹
        this.localStorageKey.KEY_RUNFASTERYA_AAAKKK = "RUNFASTERYA_AAAKKK";        // AAAKKK最大
        this.localStorageKey.KEY_RUNFASTERYA_ZHADANBUCHAI = "RUNFASTERYA_ZHADANBUCHAI";                // 炸弹不可拆
        this.localStorageKey.KEY_RUNFASTERYA_4DAI2 = "RUNFASTERYA_4DAI2";                   // 4带2
        this.localStorageKey.KEY_RUNFASTERYA_4DAI3 = "RUNFASTERYA_4DAI3";                   // 4带3
        this.localStorageKey.KEY_RUNFASTERYA_ZHA_DAN_FEN = "RUNFASTERYA_ZHA_DAN_FEN";         // 炸弹分
        this.localStorageKey.KEY_RUNFASTERYA_ZHA_NIAO = "RUNFASTERYA_ZHA_NIAO";      // 扎鸟
        this.localStorageKey.KEY_RUNFASTERYA_FANG_ZUO_BI = "RUNFASTERYA_FANG_ZUO_BI";             // 防作弊
        this.localStorageKey.KEY_RUNFASTERYA_ZIDONG_ZHUNBEI = "RUNFASTERYA_ZIDONG_ZHUNBEI";           // 自动准备

        this.setExtraKey({
            tuoGuan: "RUNFASTERYA_TUO_GUAN",          //托管
        });
    },
    initAll: function (IsFriendCard) {
        if (!IsFriendCard)
            this.setKey();
        this.bg_node = ccs.load("bg_RunFasterYaAn.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_paodekuai");
        this.bg_node.setPosition(-200, -20)
    },
    initPlayNode: function () {
        this._super();
        var _bg_Node = this.bg_node.getChildByName("view");
        if (!_bg_Node)
            _bg_Node = this.bg_node;

        var _playWay = _bg_Node.getChildByName("play_way");

        //牌张
        const pzs = _bg_Node.getChildByName('paizhang');
        if (pzs) {
            let nodeList = [];
            nodeList.push(pzs.getChildByName("btnRedioPZ16"));
            nodeList.push(pzs.getChildByName("btnRedioPZ15"));
            let cb = function (index) {
                _playWay.getChildByName('play_can3aZhaDan').getChildByName('text').setString((index === 0 ? 'AAA' : 'KKK') + '算最大炸弹');
                this.radioBoxSelectCB(index, nodeList[index], nodeList);
            }.bind(this)
            this._paizhang_radio = createRadioBoxForCheckBoxs(nodeList, cb);
            this.addListenerText(nodeList, this._paizhang_radio, cb);
            this.nodeListPaiZhang = nodeList;
        }

        //人数
        var nodeListA = [];
        nodeListA.push(_playWay.getChildByName("playerNumber_3"));
        nodeListA.push(_playWay.getChildByName("playerNumber_2"));
        var cb = function (index) {
            this.changePayForPlayerNum(index);
            this.radioBoxSelectCB(index, nodeListA[index], nodeListA);
            this.initBtnEnabled();
        }.bind(this)
        this._playNode_player_number_radio = createRadioBoxForCheckBoxs(nodeListA, cb);
        this.addListenerText(nodeListA, this._playNode_player_number_radio, cb);
        this.nodeListA = nodeListA;
        this.initPlayNumNode(nodeListA, [3, 2]);

        //底分
        this._zhuIdx = 1;
        this._ZhuNum = _bg_Node.getChildByName('difen').getChildByName("txt_fen");
        if (this._ZhuNum) {
            this._ZhuNum.setString(this._zhuIdx);
            this._Button_sub = _bg_Node.getChildByName('difen').getChildByName("btn_sub");
            this._Button_sub.addTouchEventListener(function (sender, type) {
                if (type == 2) {
                    if (this._zhuIdx == 1) {
                        this._zhuIdx = 20;
                    }
                    if (this._zhuIdx > 1) {
                        this._zhuIdx--;
                        this._ZhuNum.setString(this._zhuIdx);
                        this._Button_add.setTouchEnabled(true);
                        this._Button_add.setBright(true);
                        this.setRoomCardModeFree();
                        cc.log("----------------this._guidIdx = " + this._zhuIdx);
                    }
                }
            }, this);
            this._Button_add = _bg_Node.getChildByName('difen').getChildByName("btn_add");
            this._Button_add.addTouchEventListener(function (sender, type) {
                if (type == 2) {

                    if (this._zhuIdx == 20) {
                        this._zhuIdx = 0;
                    }
                    if (this._zhuIdx < 10) {
                        this._zhuIdx++;
                        this._ZhuNum.setString(this._zhuIdx);
                        this._Button_sub.setTouchEnabled(true);
                        this._Button_sub.setBright(true);
                        this.setRoomCardModeFree();
                    }
                }
            }, this);
        }

        //先手
        var nodeListC = [];
        for (let _i = 0; _i < 5; _i++) {
            nodeListC.push(_playWay.getChildByName("play_firstWin" + _i));
        }
        this._xianshou_radio = createRadioBoxForCheckBoxs(nodeListC, this.radioBoxSelectCB);
        this.addListenerText(nodeListC, this._xianshou_radio);
        this.nodeListC = nodeListC;

        // 切牌
        if (_playWay.getChildByName("shuffleSys")) {
            var nodeListShuffle = [];
            nodeListShuffle.push(_playWay.getChildByName("shuffleSys"));
            nodeListShuffle.push(_playWay.getChildByName("shufflePlayer"));
            this.shuffle_radio = createRadioBoxForCheckBoxs(nodeListShuffle, this.radioBoxSelectCB);
            this.addListenerText(nodeListShuffle, this.shuffle_radio);
            this.nodeListShuffle = nodeListShuffle;
        }

        //管牌
        if (_playWay.getChildByName("mustPut")) {
            var nodeListB = [];
            nodeListB.push(_playWay.getChildByName("mustPut"));
            nodeListB.push(_playWay.getChildByName("notMustPut"));
            this._mustPut_radio = createRadioBoxForCheckBoxs(nodeListB, this.radioBoxSelectCB);
            this.addListenerText(nodeListB, this._mustPut_radio);
            this.nodeListB = nodeListB;
        }

        //显示牌数
        this.xianshiPaiShu = _playWay.getChildByName("play_showCardNumber");
        this.addListenerText(this.xianshiPaiShu);
        this.xianshiPaiShu.addEventListener(this.clickCB, this.xianshiPaiShu);

        //可春天
        this.chuntian = _playWay.getChildByName("play_kechuntian");
        this.addListenerText(this.chuntian);
        this.chuntian.addEventListener(this.clickCB, this.chuntian);

        //可反春
        this.fanchun = _playWay.getChildByName("play_fanchun");
        this.addListenerText(this.fanchun);
        this.fanchun.addEventListener(this.clickCB, this.fanchun);

        //快速过牌
        this.kuaishuguopai = _playWay.getChildByName("play_ksguopai");
        this.addListenerText(this.kuaishuguopai);
        this.kuaishuguopai.addEventListener(this.clickCB, this.kuaishuguopai);

        //三张、飞机少带接完
        this.szFeiJiShaodai = _playWay.getChildByName("play_szfjsd");
        this.addListenerText(this.szFeiJiShaodai);
        this.szFeiJiShaodai.addEventListener(this.clickCB, this.szFeiJiShaodai);

        //一张不输分
        this.yizhangbushu = _playWay.getChildByName("play_yizhangbushu");
        this.addListenerText(this.yizhangbushu);
        this.yizhangbushu.addEventListener(this.clickCB, this.yizhangbushu);

        //带炸弹
        this.daizhadan = _playWay.getChildByName("play_daizhadan");
        this.addListenerText(this.daizhadan);
        this.daizhadan.addEventListener(this.clickCB.bind(this), this.daizhadan);

        //AAA KKK最大炸弹
        this.AAAKKK = _playWay.getChildByName("play_can3aZhaDan");
        this.addListenerText(this.AAAKKK);
        this.AAAKKK.addEventListener(this.clickCB, this.AAAKKK);

        //炸弹不可拆
        this.zdBuChai = _playWay.getChildByName("play_zdbucai");
        this.addListenerText(this.zdBuChai);
        this.zdBuChai.addEventListener(this.clickCB.bind(this), this.zdBuChai);

        //4带2
        this.can4dai2 = _playWay.getChildByName("play_can4dai2");
        this.addListenerText(this.can4dai2);
        this.can4dai2.addEventListener(this.clickCB, this.can4dai2);

        //4带3
        this.can4dai3 = _playWay.getChildByName("play_can4dai2_1");
        this.addListenerText(this.can4dai3);
        this.can4dai3.addEventListener(this.clickCB, this.can4dai3);

        //炸弹分
        if (_playWay.getChildByName("zhadanfen1")) {
            let nodeListB = [];
            nodeListB.push(_playWay.getChildByName("zhadanfen1"));
            nodeListB.push(_playWay.getChildByName("zhadanfen2"));
            this._zhadanfen_radio = createRadioBoxForCheckBoxs(nodeListB, this.radioBoxSelectCB);
            this.addListenerText(nodeListB, this._zhadanfen_radio);
            this.nodeListZhandanfen = nodeListB;
        }

        //扎鸟
        if (_playWay.getChildByName("zhaniao0")) {
            let nodeListB = [];
            nodeListB.push(_playWay.getChildByName("zhaniao0"));
            nodeListB.push(_playWay.getChildByName("zhaniao1"));
            nodeListB.push(_playWay.getChildByName("zhaniao2"));
            this._zhaNiao_radio = createRadioBoxForCheckBoxs(nodeListB, this.radioBoxSelectCB);
            this.addListenerText(nodeListB, this._zhadanfen_radio);
            this.nodeListZhaNiao = nodeListB;
        }

        //自动准备
        if (_playWay.getChildByName("zidongzhunbei")) {
            let nodeListB = [];
            nodeListB.push(_playWay.getChildByName("zidongzhunbei"));
            nodeListB.push(_playWay.getChildByName("zidongzhunbei1"));
            this._zhunbei_radio = createRadioBoxForCheckBoxs(nodeListB, this.radioBoxSelectCB);
            this.addListenerText(nodeListB, this._zhunbei_radio);
            this.nodeListZhunbei = nodeListB;
        }
        this.initExtraPlayNode(_playWay);
    },
    clickCB: function (sender, type) {
        this._super(sender, type);
        if (this.daizhadan && sender.name === this.daizhadan.name)
            this.initBoom();
        else if (this.zdBuChai && sender.name === this.zdBuChai.name)
            this.initBoom1();
    },
    setExtraPlayNodeCurrentSelect: function (isClub) {
        this._super(isClub);
        //初始化按钮状态
        this.initBtnEnabled();
        this.initBoom();
        this.initBoom1();
    },
    initBoom1: function () {
        let flg = this.zdBuChai.isSelected() && this.daizhadan.isSelected();

        this.can4dai2.setEnabled(!flg);
        text = this.can4dai2.getChildByName("text");
        this.selectedCB(text, this.can4dai2.isSelected() && !flg);

        this.can4dai3.setEnabled(!flg);
        text = this.can4dai3.getChildByName("text");
        this.selectedCB(text, this.can4dai3.isSelected() && !flg);
    },
    initBoom: function () {
        let flg1 = this.zdBuChai.isSelected(),
            flg = this.daizhadan.isSelected();
        this.AAAKKK.setEnabled(flg);
        var text = this.AAAKKK.getChildByName("text");
        this.selectedCB(text, this.AAAKKK.isSelected() && flg);

        this.zdBuChai.setEnabled(flg);
        text = this.zdBuChai.getChildByName("text");
        this.selectedCB(text, this.zdBuChai.isSelected() && flg);

        this.can4dai2.setEnabled(flg && !flg1);
        text = this.can4dai2.getChildByName("text");
        this.selectedCB(text, this.can4dai2.isSelected() && flg && !flg1);

        this.can4dai3.setEnabled(flg && !flg1);
        text = this.can4dai3.getChildByName("text");
        this.selectedCB(text, this.can4dai3.isSelected() && flg && !flg1);

        this._zhadanfen_radio._nodeList.map((n, indx) => {
            n.setEnabled(flg);
            n.getChildByName('text').setTextColor(this._zhadanfen_radio.getSelectIndex() == indx && flg ? MjClient.createRoomNode._selectColor : MjClient.createRoomNode._unSelectColor);
        });
        if (this._zhaNiao_radio.getSelectIndex() == 2 && !flg) {
            this._zhaNiao_radio.selectItem(0);
            this.radioBoxSelectCB(0, this.nodeListZhaNiao[0], this.nodeListZhaNiao);
        }
        this._zhaNiao_radio._nodeList[2].setEnabled(flg);
    },
    initBtnEnabled: function () {
        let index = this._playNode_player_number_radio.getSelectIndex(),
            flg = index == 0;
        if (flg) this._xianshou_radio.selectItem(0);
        else this._xianshou_radio.selectItem(3);
        this.radioBoxSelectCB(flg ? 0 : 3, this.nodeListC[flg ? 0 : 3], this.nodeListC);
        for (let _i = 0; _i < this._xianshou_radio._nodeList.length; _i++) {
            const item = this._xianshou_radio._nodeList[_i];
            item.setEnabled(flg ? _i <= 2 : _i > 2);
        }
        this.fanchun.setEnabled(!flg);
    },
    setPlayNodeCurrentSelect: function (isClub) {
        this._super();
        //张数
        var _current;
        if (isClub)
            _current = this.getNumberItem("HandCutRule", 16);
        else
            _current = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_RUNFASTERYA_CARDNUMBER, 16);
        var selectIndex = _current == 15 ? 1 : 0;
        this._paizhang_radio.selectItem(selectIndex)
        this.radioBoxSelectCB(selectIndex, this.nodeListPaiZhang[selectIndex], this.nodeListPaiZhang);

        //人数
        var _current;
        if (isClub)
            _current = this.getNumberItem("maxPlayer", 3);
        else
            _current = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_RUNFASTERYA_PLAYERNUMBER, 3);
        selectIndex = _current == 2 ? 1 : 0;
        this._playNode_player_number_radio.selectItem(selectIndex)
        this.radioBoxSelectCB(selectIndex, this.nodeListA[selectIndex], this.nodeListA);

        //管牌
        if (isClub)
            selectIndex = this.getBoolItem("mustPut", false) ? 0 : 1;
        else
            selectIndex = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_RUNFASTERYA_MUST_PUT, 1);
        this._mustPut_radio.selectItem(selectIndex)
        this.radioBoxSelectCB(selectIndex, this.nodeListB[selectIndex], this.nodeListB);

        //先手
        if (isClub)
            selectIndex = this.getNumberItem("mustPutHongTaoSan", 0);
        else
            selectIndex = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_RUNFASTERYA_XIAN_SHOU, 0);
        this._xianshou_radio.selectItem(selectIndex)
        this.radioBoxSelectCB(selectIndex, this.nodeListC[selectIndex], this.nodeListC);

        //切牌
        if (this.shuffle_radio) {
            var shuffle_radioItem
            if (isClub) {
                var option = this.getNumberItem("isPlayerShuffle", 0);
                shuffle_radioItem = option
            }
            else {
                var option = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_RUNFASTERYA_SHUFFLE_OPTION, 0);
                shuffle_radioItem = option;
            }
            this.shuffle_radio.selectItem(shuffle_radioItem)
            this.radioBoxSelectCB(shuffle_radioItem, this.nodeListShuffle[shuffle_radioItem], this.nodeListShuffle);
        }
        //显示牌数
        var isTrue;
        if (isClub)
            isTrue = this.getBoolItem("showCardNumber", true);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_RUNFASTERYA_SHOWCARDNUMBER, true);
        this.xianshiPaiShu.setSelected(isTrue);
        var text = this.xianshiPaiShu.getChildByName("text");
        this.selectedCB(text, isTrue);

        //可春天
        var isTrue;
        if (isClub)
            isTrue = this.getBoolItem("Spring", true);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_RUNFASTERYA_CAN_CHUNTIAN, true);
        this.chuntian.setSelected(isTrue);
        var text = this.chuntian.getChildByName("text");
        this.selectedCB(text, isTrue);

        //可反春
        var isTrue;
        if (isClub)
            isTrue = this.getBoolItem("ContrarySpring", true);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_RUNFASTERYA_CAN_FANCHUN, true);
        this.fanchun.setSelected(isTrue);
        var text = this.fanchun.getChildByName("text");
        this.selectedCB(text, isTrue);

        //快熟过牌
        var isTrue;
        if (isClub)
            isTrue = this.getBoolItem("FasterPass", true);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_RUNFASTERYA_SUN_PASS, true);
        this.kuaishuguopai.setSelected(isTrue);
        var text = this.kuaishuguopai.getChildByName("text");
        this.selectedCB(text, isTrue);

        //三张 飞机
        var isTrue;
        if (isClub)
            isTrue = this.getBoolItem("Is3CatchOver", true);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_RUNFASTERYA_SANZHANG_FEIJI, true);
        this.szFeiJiShaodai.setSelected(isTrue);
        var text = this.szFeiJiShaodai.getChildByName("text");
        this.selectedCB(text, isTrue);

        //剩一张不输分
        var isTrue;
        if (isClub)
            isTrue = this.getBoolItem("LeftOneLose", true);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_RUNFASTERYA_YIZHANG, true);
        this.yizhangbushu.setSelected(isTrue);
        var text = this.yizhangbushu.getChildByName("text");
        this.selectedCB(text, isTrue);

        //带炸弹
        var isTrue;
        if (isClub)
            isTrue = this.getBoolItem("DaiBoom", true);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_RUNFASTERYA_CAN_ZHADAN, true);
        this.daizhadan.setSelected(isTrue);
        var text = this.daizhadan.getChildByName("text");
        this.selectedCB(text, isTrue);

        //AAA KKK 
        var isTrue;
        if (isClub)
            isTrue = this.getBoolItem(this._paizhang_radio.selectIndex === 0 ? "OpenAAA" : 'OpenKKK', true);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_RUNFASTERYA_AAAKKK, true);
        this.AAAKKK.setSelected(isTrue);
        var text = this.AAAKKK.getChildByName("text");
        this.selectedCB(text, isTrue);

        //炸弹不可拆
        var isTrue;
        if (isClub)
            isTrue = this.getBoolItem('IsBombDec', true);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_RUNFASTERYA_ZHADANBUCHAI, true);
        this.zdBuChai.setSelected(isTrue);
        var text = this.zdBuChai.getChildByName("text");
        this.selectedCB(text, isTrue);

        //4带2
        var isTrue;
        if (isClub)
            isTrue = this.getBoolItem("can4dai2", true);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_RUNFASTERYA_4DAI2, true);
        this.can4dai2.setSelected(isTrue);
        var text = this.can4dai2.getChildByName("text");
        this.selectedCB(text, isTrue);

        //4带3
        var isTrue;
        if (isClub)
            isTrue = this.getBoolItem("can4dai3", true);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_RUNFASTERYA_4DAI3, true);
        this.can4dai3.setSelected(isTrue);
        var text = this.can4dai3.getChildByName("text");
        this.selectedCB(text, isTrue);

        //炸弹分
        if (isClub)
            selectIndex = this.getNumberItem("BombScore", 5 ? 0 : 1);
        else
            selectIndex = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_RUNFASTERYA_ZHA_DAN_FEN, 5 ? 0 : 1);
        this._zhadanfen_radio.selectItem(selectIndex)
        this.radioBoxSelectCB(selectIndex, this.nodeListZhandanfen[selectIndex], this.nodeListZhandanfen);

        //扎鸟
        if (isClub)
            selectIndex = this.getNumberItem("ZhaNiaoNum", 0);
        else
            selectIndex = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_RUNFASTERYA_ZHA_NIAO, 0);
        this._zhaNiao_radio.selectItem(selectIndex)
        this.radioBoxSelectCB(selectIndex, this.nodeListZhaNiao[selectIndex], this.nodeListZhaNiao);

        //扎鸟
        if (isClub)
            selectIndex = this.getBoolItem("AutoReady", true);
        else
            selectIndex = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_RUNFASTERYA_ZIDONG_ZHUNBEI, true);
        this._zhunbei_radio.selectItem(selectIndex)
        this.radioBoxSelectCB(selectIndex, this.nodeListZhunbei[selectIndex], this.nodeListZhunbei);

        if (isClub)
            this._zhuIdx = this.getNumberItem("difen", 1);
        else
            this._zhuIdx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_RUNFASTERYA_DIFEN, 1);
        if (this._ZhuNum)
            this._ZhuNum.setString(this._zhuIdx + "");

        this.setExtraPlayNodeCurrentSelect(isClub);
    },
    getSelectedPara: function () {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.PAO_DE_KUAI_YAAN;
        para.HandCutRule = this._paizhang_radio.getSelectIndex() == 0 ? 16 : 15;/** 牌数 */
        para.maxPlayer = this._playNode_player_number_radio.getSelectIndex() == 0 ? 3 : 2;//人数
        para.mustPutHongTaoSan = this._xianshou_radio.getSelectIndex();//先手
        para.isPlayerShuffle = this.shuffle_radio.getSelectIndex();//切牌
        para.mustPut = this._mustPut_radio.getSelectIndex() == 0;//管牌
        para.showCardNumber = this.xianshiPaiShu.isSelected();//显示牌数
        para.Spring = this.chuntian.isSelected();//可春天
        para.ContrarySpring = this.fanchun.isSelected();//可反春
        para.FasterPass = this.kuaishuguopai.isSelected();//快速过牌
        para.Is3OutOver = false;//三张 少带出完
        para.Is3CatchOver = this.szFeiJiShaodai.isSelected();//三张 少带接完
        para.IsAirOutOver = false;//飞机少带出完 
        para.IsAirCatchOver = this.szFeiJiShaodai.isSelected();//飞机少带接完 
        para.LeftOneLose = this.yizhangbushu.isSelected();//剩余一张不输
        para.Open_4_ZhangBomb = this.daizhadan.isSelected();//带炸弹
        para.OpenAAA = para.Open_4_ZhangBomb && para.HandCutRule === 16 && this.AAAKKK.isSelected();//AAAKKK最大
        para.OpenKKK = para.Open_4_ZhangBomb && para.HandCutRule === 15 && this.AAAKKK.isSelected();//AAAKKK最大
        para.IsBombDec = para.Open_4_ZhangBomb && !this.zdBuChai.isSelected();//炸弹不可拆
        para.can4dai2 = this.can4dai2.isSelected() && para.IsBombDec;     // 4带2
        para.can4dai3 = this.can4dai3.isSelected() && para.IsBombDec;     // 4带3
        para.BombScore = this._zhadanfen_radio.getSelectIndex() == 0 ? 5 : 10;//炸弹分
        para.IsRedheartBird = [0, 1, 3][this._zhadanfen_radio.getSelectIndex()];//扎鸟
        para.AutoReady = this._zhadanfen_radio.getSelectIndex() == 1;//自动准备

        if (this._nodeGPS) para.gps = this._nodeGPS.isSelected();

        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_RUNFASTERYA_PLAYERNUMBER, para.maxPlayer);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_RUNFASTERYA_MUST_PUT, this._mustPut_radio.getSelectIndex());
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_RUNFASTERYA_XIAN_SHOU, this._xianshou_radio.getSelectIndex());
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_RUNFASTERYA_4DAI2, para.can4dai2);
            if (this.shuffle_radio) {
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_RUNFASTERYA_SHUFFLE_OPTION, para.isPlayerShuffle);
            }
        }

        this.getExtraSelectedPara(para);

        cc.log("createara: " + JSON.stringify(para));
        return para;
    },
    initExtraPlayNode: function (_playWay) {
        //托管
        if (_playWay.getChildByName("tuoguan0")) {
            var tuoguanNodeList = [];
            tuoguanNodeList.push(_playWay.getChildByName("tuoguan0"));
            tuoguanNodeList.push(_playWay.getChildByName("tuoguan1"));
            tuoguanNodeList.push(_playWay.getChildByName("tuoguan2"));
            tuoguanNodeList.push(_playWay.getChildByName("tuoguan3"));

            var tuoguan4 = _playWay.getChildByName("tuoguan4");
            if (tuoguan4)
                tuoguanNodeList.push(tuoguan4);

            this.tuoguanNodeList = tuoguanNodeList;
            var playNode_player_tuoguan_radio = createRadioBoxForCheckBoxs(tuoguanNodeList, function (index) {
                this.radioBoxSelectCB(index, tuoguanNodeList[index], tuoguanNodeList);
                this.refreshTrustWays(index, false);
            }.bind(this));
            this.addListenerText(tuoguanNodeList, playNode_player_tuoguan_radio, function (index) {
                this.refreshTrustWays(index, false);
            }.bind(this));

            var btn_tuoguanTip = _playWay.getChildByName("btn_tuoguanTip");
            var image_tuoguanTip = _playWay.getChildByName("image_tuoguanTip");
            btn_tuoguanTip.addTouchEventListener(function (sender, type) {
                if (type == 2) {
                    image_tuoguanTip.setVisible(true);
                }
            }, btn_tuoguanTip);
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: false,
                status: null,
                onTouchBegan: function (touch, event) {
                    if (image_tuoguanTip.isVisible()) {
                        image_tuoguanTip.setVisible(false);
                        return true;
                    } else {
                        return false;
                    }
                },
            }, image_tuoguanTip);


            // 托管方式相关
            var trustWay_1 = _playWay.getChildByName("trustWay_1");
            if (trustWay_1) {
                var trustWayNodeList = [];
                trustWayNodeList.push(trustWay_1);
                trustWayNodeList.push(_playWay.getChildByName("trustWay_2"));
                trustWayNodeList.push(_playWay.getChildByName("trustWay_3"));

                this.trustWayNodeList = trustWayNodeList;
                this.trustWayRadio = createRadioBoxForCheckBoxs(trustWayNodeList, this.radioBoxSelectCB);
                this.addListenerText(trustWayNodeList, this.trustWayRadio);
            }
        }
    },
});

