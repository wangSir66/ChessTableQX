
var CreateRoomNode_guizhouAnShun = CreateRoomNode.extend({
    setKey:function(){
        this.localStorageKey.KEY_guizhouAnShun_yaobaiji     = "_guizhouAnShun_YAO_BAI_JI";   //摇摆鸡
        this.localStorageKey.KEY_guizhouAnShun_mantangji    = "_guizhouAnShun_MAN_TANG_JI";  //满堂鸡
        this.localStorageKey.KEY_guizhouAnShun_benji        = "_guizhouAnShun_BEN_JI";       //本鸡
        this.localStorageKey.KEY_guizhouAnShun_wuguji       = "_guizhouAnShun_WU_GU_JI";     //乌骨鸡
        this.localStorageKey.KEY_guizhouAnShun_qgshaoji     = "_guizhouAnShun_QG_SHAO_JI";   //抢杠烧鸡
        this.localStorageKey.KEY_guizhouAnShun_qgshaodou    = "_guizhouAnShun_QG_SHAO_DOU";  //抢杠烧豆
        this.localStorageKey.KEY_guizhouAnShun_xingqiji     = "_guizhouAnShun_XING_QI_JI";   //星期鸡
        this.localStorageKey.KEY_guizhouAnShun_lianzhuang   = "_guizhouAnShun_LIAN_ZHUANG";  //连庄
        this.localStorageKey.KEY_guizhouAnShun_zhipaixing   = "_guizhouAnShun_ZHI_PAI_XING"; //只牌型分
        this.localStorageKey.KEY_guizhouAnShun_difen        = "_guizhouAnShun_DI_FEN";       //底分
        this.localStorageKey.KEY_guizhouAnShun_gps          = "_guizhouAnShun_GPS";          //防作弊
        this.localStorageKey.KEY_guizhouAnShun_count        = "_guizhouAnShun_COUNT";        //人数
        this.localStorageKey.KEY_guizhouAnShun_tuoguan      = "_guizhouAnShun_TUOGUAN";      //托管
    },
    initAll:function(IsFriendCard) {

        if (!IsFriendCard) this.setKey();
        this.bg_node = ccs.load("bg_guizhouAnShun.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_node");
        this.playScroll = this.bg_node.getChildByName("playScroll");
        this._scroll_round = this.playScroll.getChildByName("round");
    },
    initRoundNode:function() {
        this._super();
        //打开大赢家付
        this.payWayNodeArray[2].visible = true;
        this.payWayNodeArray[2].setEnabled(true);
        this.bg_node.setContentSize(cc.size(907.00,580.00));
        this.bg_node.setPosition(-240, -37);
    },
    initPlayNode:function() {

        var _play = this.playScroll.getChildByName("play");

        //人数
        this._playNode_maxPlayer0 = _play.getChildByName("play_count0");
        this._playNode_maxPlayer1 = _play.getChildByName("play_count1");
        this._playNode_maxPlayer2 = _play.getChildByName("play_count2");
        this._playNode_maxPlayer3 = _play.getChildByName("play_count3");
        var nodeCountList = [];
        nodeCountList.push(this._playNode_maxPlayer0);
        nodeCountList.push(this._playNode_maxPlayer1);
        nodeCountList.push(this._playNode_maxPlayer2);
        nodeCountList.push(this._playNode_maxPlayer3);
        this._playNode_player_count_radio = createRadioBoxForCheckBoxs(nodeCountList, function(index){
            this.changePayForPlayerNum(index);
            this.radioBoxSelectCB(index, nodeCountList[index], nodeCountList);
            this.addSpecialProcess();
        }.bind(this));
        this.addListenerText(nodeCountList, this._playNode_player_count_radio, function () {
            this.changePayForPlayerNum();
            this.addSpecialProcess();
        }.bind(this));
        this._countlist = nodeCountList;
        this.initPlayNumNode(nodeCountList, [4, 3, 2, 4]);

        //摇摆鸡
        this._playNode_yaobaiji = _play.getChildByName("play_yaobaiji");
        this.addListenerText(this._playNode_yaobaiji);
        this._playNode_yaobaiji.addEventListener(this.clickCB, this._playNode_yaobaiji);

        //满堂鸡
        this._playNode_mantangji = _play.getChildByName("play_mantangji");
        this.addListenerText(this._playNode_mantangji);
        this._playNode_mantangji.addEventListener(this.clickCB, this._playNode_mantangji);

        //本鸡
        this._playNode_benji = _play.getChildByName("play_benji");
        this.addListenerText(this._playNode_benji);
        this._playNode_benji.addEventListener(this.clickCB, this._playNode_benji);

        //乌骨鸡
        this._playNode_wuguji = _play.getChildByName("play_wuguji");
        this.addListenerText(this._playNode_wuguji);
        this._playNode_wuguji.addEventListener(this.clickCB, this._playNode_wuguji);

        //抢杠烧鸡
        this._playNode_qianggangshaoji = _play.getChildByName("play_qianggangshaoji");
        this.addListenerText(this._playNode_qianggangshaoji);
        this._playNode_qianggangshaoji.addEventListener(this.clickCB, this._playNode_qianggangshaoji);

        //抢杠烧豆
        this._playNode_qianggangshaodou = _play.getChildByName("play_qianggangshaodou");
        this.addListenerText(this._playNode_qianggangshaodou);
        this._playNode_qianggangshaodou.addEventListener(this.clickCB, this._playNode_qianggangshaodou);

        //星期鸡
        this._playNode_xingqiji = _play.getChildByName("play_xingqiji");
        this.addListenerText(this._playNode_xingqiji);
        this._playNode_xingqiji.addEventListener(this.clickCB, this._playNode_xingqiji);

        //连庄
        this._playNode_lianzhuang = _play.getChildByName("play_lianzhuang");
        this.addListenerText(this._playNode_lianzhuang);
        this._playNode_lianzhuang.addEventListener(this.clickCB, this._playNode_lianzhuang);

        //只牌型分翻倍
        this._playNode_paixingfenfanbei = _play.getChildByName("play_paixingfanbei");
        this.addListenerText(this._playNode_paixingfenfanbei);
        this._playNode_paixingfenfanbei.addEventListener(this.clickCB, this._playNode_paixingfenfanbei);

        // 底分
        this._playNode_bei0 = _play.getChildByName("play_bei0");
        this._playNode_bei1 = _play.getChildByName("play_bei1");
        var nodeBeiList = [];
        nodeBeiList.push(this._playNode_bei0);
        nodeBeiList.push(this._playNode_bei1);
        this._playNode_bei_radio = createRadioBoxForCheckBoxs(nodeBeiList, function(index){
            this.radioBoxSelectCB(index, nodeBeiList[index], nodeBeiList);
            this.setJiaBeiAction();

        }.bind(this));
        this.addListenerText(nodeBeiList, this._playNode_bei_radio, this.setJiaBeiAction.bind(this));
        this._beilist = nodeBeiList;

        // 倍数
        var beiIdx = 0;//数组的引索
        var beiArr = [2, 3, 4, 5, 6, 7, 8, 9, 10];
        var _arrayLenth =  beiArr.length;//数组长度
        var beiNumNode = _play.getChildByName("play_beiNum");
        this._ZhuNum = beiNumNode.getChildByName("txt_fen");
        this._ZhuNum.setString(beiArr[beiIdx] + "倍");
        this._Button_sub = beiNumNode.getChildByName("btn_sub");
        this._Button_sub.addTouchEventListener(function(sender, type) {
            if (type == 2) {
                beiIdx = beiArr.indexOf(parseInt(this._ZhuNum.getString()));
                beiIdx = (_arrayLenth + --beiIdx)%_arrayLenth;
                this._ZhuNum.setString(beiArr[beiIdx] + "倍");
                this.setRoomCardModeFree(beiArr[beiIdx]);
            }
        }, this);
        this._Button_add = beiNumNode.getChildByName("btn_add");
        this._Button_add.addTouchEventListener(function(sender, type) {
            if (type == 2) {
                beiIdx = beiArr.indexOf(parseInt(this._ZhuNum.getString()));
                beiIdx = (_arrayLenth + ++beiIdx)%_arrayLenth;
                this._ZhuNum.setString(beiArr[beiIdx] + "倍");
                this.setRoomCardModeFree(beiArr[beiIdx]);
            }
        }, this);

        //防作弊
        this._playNode_gps = this.bg_node.getChildByName("play_gps");
        this.addListenerText(this._playNode_gps);
        this._playNode_gps.addEventListener(this.clickCB, this._playNode_gps);
        COMMON_UI.addHelpUI(this._playNode_gps);

        //托管
        this._playNode_tuoguanType_0 = _play.getChildByName("play_tg_0");
        this._playNode_tuoguanType_1 = _play.getChildByName("play_tg_1");
        this._playNode_tuoguanType_2 = _play.getChildByName("play_tg_2");
        this._playNode_tuoguanType_3 = _play.getChildByName("play_tg_3");
        var tuoguanNodeList = [];
        tuoguanNodeList.push(this._playNode_tuoguanType_0);
        tuoguanNodeList.push(this._playNode_tuoguanType_1);
        tuoguanNodeList.push(this._playNode_tuoguanType_2);
        tuoguanNodeList.push(this._playNode_tuoguanType_3);
        this._playNode_player_tuoguan_radio = createRadioBoxForCheckBoxs(tuoguanNodeList, this.radioBoxSelectCB);
        this.addListenerText(tuoguanNodeList, this._playNode_player_tuoguan_radio);
        this.tuoguanNodeList = tuoguanNodeList;

        //添加托管提示按钮
        this.addTuoGuanHelpBtn(_play);

    },
    setPlayNodeCurrentSelect: function(isClub) {

        // 摇摆鸡
        var _yaobaiji;
        if (isClub)
            _yaobaiji = this.getBoolItem("yaobaiji", false);
        else
            _yaobaiji = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_guizhouAnShun_yaobaiji, true);
        this._playNode_yaobaiji.setSelected(_yaobaiji);
        var text = this._playNode_yaobaiji.getChildByName("text");
        this.selectedCB(text, _yaobaiji);


        // 满堂鸡
        var _mantangji;
        if (isClub)
            _mantangji = this.getBoolItem("mantangji", false);
        else
            _mantangji = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_guizhouAnShun_mantangji, true);
        this._playNode_mantangji.setSelected(_mantangji);
        var text = this._playNode_mantangji.getChildByName("text");
        this.selectedCB(text, _mantangji);


        // 本鸡
        var _benji;
        if (isClub)
            _benji = this.getBoolItem("benji", false);
        else
            _benji = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_guizhouAnShun_benji, true);
        this._playNode_benji.setSelected(_benji);
        var text = this._playNode_benji.getChildByName("text");
        this.selectedCB(text, _benji);


        // 乌骨鸡
        var _wuguji;
        if (isClub)
            _wuguji = this.getBoolItem("wuguji", false);
        else
            _wuguji = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_guizhouAnShun_wuguji, true);
        this._playNode_wuguji.setSelected(_wuguji);
        var text = this._playNode_wuguji.getChildByName("text");
        this.selectedCB(text, _wuguji);


        // 抢杠烧鸡
        var _qianggangshaoji;
        if (isClub)
            _qianggangshaoji = this.getBoolItem("qianggangshaoji", false);
        else
            _qianggangshaoji = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_guizhouAnShun_qgshaoji, true);
        this._playNode_qianggangshaoji.setSelected(_qianggangshaoji);
        var text = this._playNode_qianggangshaoji.getChildByName("text");
        this.selectedCB(text, _qianggangshaoji);


        // 抢杠烧豆
        var _qianggangshaodou;
        if (isClub)
            _qianggangshaodou = this.getBoolItem("qianggangshaodou", false);
        else
            _qianggangshaodou = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_guizhouAnShun_qgshaodou, true);
        this._playNode_qianggangshaodou.setSelected(_qianggangshaodou);
        var text = this._playNode_qianggangshaodou.getChildByName("text");
        this.selectedCB(text, _qianggangshaodou);


        // 连庄
        var _lianzhuang;
        if (isClub)
            _lianzhuang = this.getBoolItem("lianzhuang", false);
        else
            _lianzhuang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_guizhouAnShun_lianzhuang, false);
        this._playNode_lianzhuang.setSelected(_lianzhuang);
        var text = this._playNode_lianzhuang.getChildByName("text");
        this.selectedCB(text, _lianzhuang);


        // 星期鸡
        var _xingqiji;
        if (isClub)
            _xingqiji = this.getBoolItem("xingqiji", false);
        else
            _xingqiji = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_guizhouAnShun_xingqiji, false);
        this._playNode_xingqiji.setSelected(_xingqiji);
        var text = this._playNode_xingqiji.getChildByName("text");
        this.selectedCB(text, _xingqiji);


        // 只牌型分翻倍
        var _zhipaixingfenfanbei;
        if (isClub)
            _zhipaixingfenfanbei = this.getBoolItem("paiXinScoreOnly", false);
        else
            _zhipaixingfenfanbei = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_guizhouAnShun_zhipaixing, false);
        this._playNode_paixingfenfanbei.setSelected(_zhipaixingfenfanbei);
        var text = this._playNode_paixingfenfanbei.getChildByName("text");
        this.selectedCB(text, _zhipaixingfenfanbei);



        //人数
        var _currentCount;
        if (isClub) {
            if (this.getBoolItem("convertible", false))
                _currentCount = 3;
            else
                _currentCount = [4, 3, 2].indexOf(this.getNumberItem("maxPlayer", 4));
        }
        else
            _currentCount = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_guizhouAnShun_count, 0);
        this._playNode_player_count_radio.selectItem(_currentCount);
        this.radioBoxSelectCB(_currentCount, this._countlist[_currentCount], this._countlist);
        

        // 底分(倍数)
        var _beiCount;
        if (isClub) {
            _beiCount = this.getNumberItem("beishu", 1);
        }
        else
            _beiCount = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_guizhouAnShun_difen, 1);
        var _radioIdx = _beiCount == 1 ? 0 : 1;
        this._playNode_bei_radio.selectItem(_radioIdx);
        this.radioBoxSelectCB(_radioIdx, this._beilist[_radioIdx], this._beilist);
        if (_beiCount > 1) {
            // 倍数
            this._ZhuNum.setString(_beiCount + "倍");
        }
        else {
            this._ZhuNum.setString("2倍");
        }
        this.setJiaBeiAction();


        //防作弊
        var _gps;
        if (isClub)
            _gps = this.getBoolItem("gps", false);
        else
            _gps = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_guizhouAnShun_gps, false);
        this._playNode_gps.setSelected(_gps);
        var text = this._playNode_gps.getChildByName("text");
        this.selectedCB(text, _gps);


        //托管
        var _trustTime;
        if (isClub)
            _trustTime = this.getNumberItem("trustTime", 0);
        else
            _trustTime = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_guizhouAnShun_tuoguan, 0);
        this._playNode_tuoguanType_0.setSelected(false);
        this._playNode_tuoguanType_1.setSelected(false);
        this._playNode_tuoguanType_2.setSelected(false);
        this._playNode_tuoguanType_3.setSelected(false);
        var index = 0;
        if (_trustTime === 0) {
            this._playNode_tuoguanType_0.setSelected(true);
            index = 0;
        } else if (_trustTime === 60) {
            this._playNode_tuoguanType_1.setSelected(true);
            index = 1;
        } else if (_trustTime === 120) {
            this._playNode_tuoguanType_2.setSelected(true);
            index = 2;
        } else if (_trustTime === 180) {
            this._playNode_tuoguanType_3.setSelected(true);
            index = 3;
        }
        this.radioBoxSelectCB(index, this.tuoguanNodeList[index], this.tuoguanNodeList);


        this.changePayForPlayerNum();
    },

    // 加倍状态
    setJiaBeiAction: function () {
        var sBool = !this._playNode_bei0.isSelected();
        this._Button_sub.setEnabled(sBool);
        this._Button_add.setEnabled(sBool);
        this._playNode_paixingfenfanbei.setVisible(sBool);
    },
    addTuoGuanHelpBtn: function(playNode){

        var btn_tuoguanTip = playNode.getChildByName("btn_tg_tip");
        var image_tuoguanTip = playNode.getChildByName("img_tip_di");
        var text_tuoguanTip = image_tuoguanTip.getChildByName("text");
        text_tuoguanTip.ignoreContentAdaptWithSize(true);
        btn_tuoguanTip.addTouchEventListener(function(sender, type) {
            if (type === 2) {
                image_tuoguanTip.setVisible(true);
            }
        }, btn_tuoguanTip);
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            status: null,
            onTouchBegan: function() {
                if (image_tuoguanTip.isVisible()) {
                    image_tuoguanTip.setVisible(false);
                    return true;
                } else {
                    return false;
                }
            },
        }, image_tuoguanTip);
    },

    getSelectedPara:function() {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.GUI_ZHOU_AN_SHUN_MJ;
        para.maxPlayer = 4;
        para.yaobaiji = true;
        para.mantangji = true;
        para.benji = true;
        para.wuguji = true;
        para.qianggangshaoji = true;
        para.qianggangshaodou = true;
        para.lianzhuang = false;
        para.xingqiji = false;
        para.paiXinScoreOnly = false;
        para.beishu = 1;
        para.convertible = false;             //是否自由人数

        //人数
        var _countIdx = 0;
        if (this._playNode_maxPlayer0.isSelected()) {
            para.maxPlayer = 4;
            _countIdx = 0;
        }
        else if (this._playNode_maxPlayer1.isSelected()) {
            para.maxPlayer = 3;
            _countIdx = 1;
        }
        else if (this._playNode_maxPlayer2.isSelected()) {
            para.maxPlayer = 2;
            _countIdx = 2;
        }
        else if (this._playNode_maxPlayer3.isSelected()) {
            para.maxPlayer = 4;
            para.convertible = true;
            _countIdx = 3;
        }

        // 倍数
        var _beiCount = 1;
        if (this._playNode_bei0.isSelected()) {
            _beiCount = 1;
        }
        else if (this._playNode_bei1.isSelected()) {
            _beiCount = parseInt(this._ZhuNum.getString());
        }
        para.beishu = _beiCount;


        // 托管
        if (this._playNode_tuoguanType_0.isSelected()) {
            para.trustTime = 0;
        } else if (this._playNode_tuoguanType_1.isSelected()) {
            para.trustTime = 60;
        } else if (this._playNode_tuoguanType_2.isSelected()) {
            para.trustTime = 120;
        } else if (this._playNode_tuoguanType_3.isSelected()) {
            para.trustTime = 180;
        }


        para.yaobaiji = this._playNode_yaobaiji.isSelected();
        para.mantangji = this._playNode_mantangji.isSelected();
        para.benji = this._playNode_benji.isSelected();
        para.wuguji = this._playNode_wuguji.isSelected();
        para.qianggangshaoji = this._playNode_qianggangshaoji.isSelected();
        para.qianggangshaodou = this._playNode_qianggangshaodou.isSelected();
        para.lianzhuang = this._playNode_lianzhuang.isSelected();
        para.xingqiji = this._playNode_xingqiji.isSelected();
        if(this._playNode_bei1.isSelected()) {
            para.paiXinScoreOnly = this._playNode_paixingfenfanbei.isSelected();
        }



        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_guizhouAnShun_count, _countIdx);

            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_guizhouAnShun_yaobaiji,  para.yaobaiji);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_guizhouAnShun_mantangji,  para.mantangji);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_guizhouAnShun_benji,  para.benji);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_guizhouAnShun_wuguji,  para.wuguji);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_guizhouAnShun_qgshaoji,  para.qianggangshaoji);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_guizhouAnShun_qgshaodou,  para.qianggangshaodou);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_guizhouAnShun_lianzhuang,  para.lianzhuang);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_guizhouAnShun_xingqiji,  para.xingqiji);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_guizhouAnShun_zhipaixing, para.paiXinScoreOnly);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_guizhouAnShun_tuoguan, para.trustTime);

            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_guizhouAnShun_difen, para.beishu);

        }


        cc.log("createara guizhouAnShun: " + JSON.stringify(para));
        return para;
    }
});