
var CreateRoomNode_guizhouGuiYangZhuoJi = CreateRoomNode.extend({
    setKey:function(){
        this.localStorageKey.KEY_guizhouGuiYangZhuoJi_fanpaiji     = "_guizhouGuiYangZhuoJi_FAN_PAI_JI";   //翻牌鸡（上鸡）
        this.localStorageKey.KEY_guizhouGuiYangZhuoJi_yaobaiji     = "_guizhouGuiYangZhuoJi_YAO_BAI_JI";   //摇摆鸡（上下鸡）
        this.localStorageKey.KEY_guizhouGuiYangZhuoJi_benji        = "_guizhouGuiYangZhuoJi_BEN_JI";       //本鸡
        this.localStorageKey.KEY_guizhouGuiYangZhuoJi_wuguji       = "_guizhouGuiYangZhuoJi_WU_GU_JI";     //乌骨鸡
        this.localStorageKey.KEY_guizhouGuiYangZhuoJi_xingqiji     = "_guizhouGuiYangZhuoJi_XING_QI_JI";   //星期鸡
        this.localStorageKey.KEY_guizhouGuiYangZhuoJi_fengchuiji   = "_guizhouGuiYangZhuoJi_FENG_CHUI_JI"; //风吹鸡
        this.localStorageKey.KEY_guizhouGuiYangZhuoJi_mantangji    = "_guizhouGuiYangZhuoJi_MAN_TANG_JI";  //满堂鸡
        this.localStorageKey.KEY_guizhouGuiYangZhuoJi_dilong       = "_guizhouGuiYangZhuoJi_DILONG";       //地龙
        this.localStorageKey.KEY_guizhouGuiYangZhuoJi_gumai        = "_guizhouGuiYangZhuoJi_GUMAI";        //估卖
        this.localStorageKey.KEY_guizhouGuiYangZhuoJi_zhuangType   = "_guizhouGuiYangZhuoJi_ZHUANG_TYPE";  //庄分类型
        this.localStorageKey.KEY_guizhouGuiYangZhuoJi_fanbei       = "_guizhouGuiYangZhuoJi_FAN_BEI";      //底分
        this.localStorageKey.KEY_guizhouGuiYangZhuoJi_gps          = "_guizhouGuiYangZhuoJi_GPS";          //防作弊
        this.localStorageKey.KEY_guizhouGuiYangZhuoJi_count        = "_guizhouGuiYangZhuoJi_COUNT";        //人数
        this.localStorageKey.KEY_guizhouGuiYangZhuoJi_dingque      = "_guizhouGuiYangZhuoJi_DINGQUE";      //定缺流程
        this.localStorageKey.KEY_guizhouGuiYangZhuoJi_tuoguan      = "_guizhouGuiYangZhuoJi_TUO_GUAN";     //托管
    },
    initAll:function(IsFriendCard) {

        if (!IsFriendCard) this.setKey();
        this.bg_node = ccs.load("bg_guizhouGuiYangZhuoJi.json").node;
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
    // 是否需要玩法AA付和自由人数互斥
    isNeedAAPayAndFreePlayerHuChi: function(){
        return false;
    },
    initPlayNode:function() {

        var _play = this.playScroll.getChildByName("play");

        // 人数
        this._playNode_maxPlayer0 = _play.getChildByName("play_count0");
        this._playNode_maxPlayer1 = _play.getChildByName("play_count1");
        this._playNode_maxPlayer2 = _play.getChildByName("play_count2");
        this._playNode_maxPlayer3 = _play.getChildByName("play_count3");
        this._playNode_maxPlayer4 = _play.getChildByName("play_count4");
        var nodeCountList = [this._playNode_maxPlayer0, this._playNode_maxPlayer1, this._playNode_maxPlayer2, this._playNode_maxPlayer3, this._playNode_maxPlayer4];
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
        this.initPlayNumNode(nodeCountList, [4, 3, 2, 3, 2]);

        //翻牌鸡, 摇摆鸡
        this._playNode_fanpaiji = _play.getChildByName("play_fanpaiji");
        this._playNode_yaobaiji = _play.getChildByName("play_yaobaiji");
        var jiRadioList = [this._playNode_fanpaiji, this._playNode_yaobaiji];
        var jiRadio = createRadioBoxForCheckBoxs(jiRadioList, function () {
            for (var i = 0 ; i < jiRadioList.length; i++){
                this.clickCB(jiRadioList[i], jiRadioList[i].isSelected() ? ccui.CheckBox.EVENT_SELECTED : ccui.CheckBox.EVENT_UNSELECTED);
            }
        }.bind(this));
        this.addListenerText(jiRadioList, jiRadio, function (index) {
            jiRadio.selectItem(index);
        });



        //本鸡
        this._playNode_benji = _play.getChildByName("play_benji");
        this.addListenerText(this._playNode_benji);
        this._playNode_benji.addEventListener(this.clickCB, this._playNode_benji);

        //星期鸡
        this._playNode_xingqiji = _play.getChildByName("play_xingqiji");
        this.addListenerText(this._playNode_xingqiji);
        this._playNode_xingqiji.addEventListener(this.clickCB, this._playNode_xingqiji);

        //乌骨鸡
        this._playNode_wuguji = _play.getChildByName("play_wuguji");
        this.addListenerText(this._playNode_wuguji);
        this._playNode_wuguji.addEventListener(this.clickCB, this._playNode_wuguji);

        //风吹鸡
        this._playNode_fengchuiji = _play.getChildByName("play_fengchuiji");
        this.addListenerText(this._playNode_fengchuiji);
        this._playNode_fengchuiji.addEventListener(this.clickCB, this._playNode_fengchuiji);

        //满堂鸡
        this._playNode_mantangji = _play.getChildByName("play_mantangji");
        this.addListenerText(this._playNode_mantangji);
        this._playNode_mantangji.addEventListener(this.clickCB, this._playNode_mantangji);

        //地龙
        this._playNode_dilong = _play.getChildByName("play_dilong");
        this.addListenerText(this._playNode_dilong);
        this._playNode_dilong.addEventListener(this.clickCB, this._playNode_dilong);

        //估卖
        this._playNode_gumai = _play.getChildByName("play_gumai");
        this.addListenerText(this._playNode_gumai);
        this._playNode_gumai.addEventListener(this.clickCB, this._playNode_gumai);


        // 倍数
        this._playNode_1bei = _play.getChildByName("play_1bei");
        this._playNode_fanbei = _play.getChildByName("play_fanbei");
        var nodeListFanBei = [];
        nodeListFanBei = [this._playNode_1bei, this._playNode_fanbei];
        this.fanbei_radio = createRadioBoxForCheckBoxs(nodeListFanBei, this.fanBeiRadioBoxSelectCallBack);
        var that = this;
        this.addListenerText(nodeListFanBei, this.fanbei_radio, function (index, sender) {
            that.fanBeiRadioBoxSelectCallBack(index, sender, nodeListFanBei);
        });
        this.nodeListFanBei = nodeListFanBei;
        var subButton = this._playNode_fanbei.getChildByName("btn_sub");
        var addButton = this._playNode_fanbei.getChildByName("btn_add");
        var scoreLabel = this._playNode_fanbei.getChildByName("score");
        subButton.addTouchEventListener(function(sender, type) {
            if(type === 2){
                var curScore = parseInt(scoreLabel.getString());
                curScore --;
                curScore = curScore < 2 ? 10 : curScore;
                scoreLabel.setString(curScore + "倍");
            }
        }, this);
        addButton.addTouchEventListener(function(sender, type) {
            if(type === 2){
                var curScore = parseInt(scoreLabel.getString());
                curScore ++;
                curScore = curScore > 10 ? 2 : curScore;
                scoreLabel.setString(curScore + "倍");
            }
        }, this);


        // 庄分类型
        this._playNode_zhuangType_0 = _play.getChildByName("play_zf_yikouer");
        this._playNode_zhuangType_1 = _play.getChildByName("play_zf_lianzhuang");
        this._playNode_zhuangType_2 = _play.getChildByName("play_zf_tongsan");
        var zhuangTypeNodeList = [this._playNode_zhuangType_0, this._playNode_zhuangType_1, this._playNode_zhuangType_2];
        this._playNode_player_zhuangType_radio = createRadioBoxForCheckBoxs(zhuangTypeNodeList, this.radioBoxSelectCB);
        this.addListenerText(zhuangTypeNodeList, this._playNode_player_zhuangType_radio);
        this.zhuangTypeNodeList = zhuangTypeNodeList;


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
        this._playNode_tuoguanType_4 = _play.getChildByName("play_tg_4");
        var tuoguanNodeList = [];
        tuoguanNodeList.push(this._playNode_tuoguanType_0);
        tuoguanNodeList.push(this._playNode_tuoguanType_1);
        tuoguanNodeList.push(this._playNode_tuoguanType_2);
        tuoguanNodeList.push(this._playNode_tuoguanType_3);
        tuoguanNodeList.push(this._playNode_tuoguanType_4);
        this._playNode_player_tuoguan_radio = createRadioBoxForCheckBoxs(tuoguanNodeList, this.radioBoxSelectCB);
        this.addListenerText(tuoguanNodeList, this._playNode_player_tuoguan_radio);
        this.tuoguanNodeList = tuoguanNodeList;

        //添加托管提示按钮
        this.addTuoGuanHelpBtn(_play);
    },
    setPlayNodeCurrentSelect: function(isClub) {

        // 翻牌鸡
        var _fanpaiji;
        if (isClub)
            _fanpaiji = this.getBoolItem("fanpaiji", true);
        else
            _fanpaiji = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_guizhouGuiYangZhuoJi_fanpaiji, true);
        this._playNode_fanpaiji.setSelected(_fanpaiji);
        var text = this._playNode_fanpaiji.getChildByName("text");
        this.selectedCB(text, _fanpaiji);


        // 摇摆鸡
        var _yaobaiji;
        if (isClub)
            _yaobaiji = this.getBoolItem("yaobaiji", false);
        else
            _yaobaiji = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_guizhouGuiYangZhuoJi_yaobaiji, false);
        this._playNode_yaobaiji.setSelected(_yaobaiji);
        var text = this._playNode_yaobaiji.getChildByName("text");
        this.selectedCB(text, _yaobaiji);


        // 本鸡
        var _benji;
        if (isClub)
            _benji = this.getBoolItem("benji", false);
        else
            _benji = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_guizhouGuiYangZhuoJi_benji, false);
        this._playNode_benji.setSelected(_benji);
        var text = this._playNode_benji.getChildByName("text");
        this.selectedCB(text, _benji);


        // 乌骨鸡
        var _wuguji;
        if (isClub)
            _wuguji = this.getBoolItem("wuguji", false);
        else
            _wuguji = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_guizhouGuiYangZhuoJi_wuguji, false);
        this._playNode_wuguji.setSelected(_wuguji);
        var text = this._playNode_wuguji.getChildByName("text");
        this.selectedCB(text, _wuguji);


        // 星期鸡
        var _xingqiji;
        if (isClub)
            _xingqiji = this.getBoolItem("xingqiji", false);
        else
            _xingqiji = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_guizhouGuiYangZhuoJi_xingqiji, false);
        this._playNode_xingqiji.setSelected(_xingqiji);
        var text = this._playNode_xingqiji.getChildByName("text");
        this.selectedCB(text, _xingqiji);


        // 风吹鸡
        var _fengchuiji;
        if (isClub)
            _fengchuiji = this.getBoolItem("fengchuiji", false);
        else
            _fengchuiji = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_guizhouGuiYangZhuoJi_fengchuiji, false);
        this._playNode_fengchuiji.setSelected(_fengchuiji);
        var text = this._playNode_fengchuiji.getChildByName("text");
        this.selectedCB(text, _fengchuiji);


        // 满堂鸡
        var _mantangji;
        if (isClub)
            _mantangji = this.getBoolItem("mantangji", false);
        else
            _mantangji = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_guizhouGuiYangZhuoJi_mantangji, false);
        this._playNode_mantangji.setSelected(_mantangji);
        var text = this._playNode_mantangji.getChildByName("text");
        this.selectedCB(text, _mantangji);


        // 地龙
        var _dilong;
        if (isClub)
            _dilong = this.getBoolItem("dilong", false);
        else
            _dilong = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_guizhouGuiYangZhuoJi_dilong, false);
        this._playNode_dilong.setSelected(_dilong);
        var text = this._playNode_dilong.getChildByName("text");
        this.selectedCB(text, _dilong);


        // 估卖
        var _gumai;
        if (isClub)
            _gumai = this.getBoolItem("gumai", false);
        else
            _gumai = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_guizhouGuiYangZhuoJi_gumai, false);
        this._playNode_gumai.setSelected(_gumai);
        var text = this._playNode_gumai.getChildByName("text");
        this.selectedCB(text, _gumai);



        // 庄分类型
        var zhuangIdx;
        if (isClub)
            zhuangIdx = this.getNumberItem("lianzhuangtype", 0);
        else
            zhuangIdx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_guizhouGuiYangZhuoJi_zhuangType, 0);
        this._playNode_player_zhuangType_radio.selectItem(zhuangIdx);
        this.radioBoxSelectCB(zhuangIdx, this.zhuangTypeNodeList[zhuangIdx], this.zhuangTypeNodeList);




        // 翻倍
        var beishu;
        if(isClub){
            beishu = this.getNumberItem("beishu", 1);
        }else{
            beishu = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_guizhouGuiYangZhuoJi_fanbei, 1);
        }
        var index = beishu === 1 ? 0 : 1;
        this.fanbei_radio.selectItem(index);
        beishu = beishu < 2 ? 2 : beishu;
        this._playNode_fanbei.getChildByName("score").setString(beishu + "倍");
        this.fanBeiRadioBoxSelectCallBack(index, this.nodeListFanBei[index], this.nodeListFanBei);


        //防作弊
        var _gps;
        if (isClub)
            _gps = this.getBoolItem("gps", false);
        else
            _gps = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_guizhouGuiYangZhuoJi_gps, false);
        this._playNode_gps.setSelected(_gps);
        var text = this._playNode_gps.getChildByName("text");
        this.selectedCB(text, _gps);


        //人数
        var _currentCount;
        if (isClub) {
            var _countIdx = 0;
            // 有三丁拐/两丁拐的特殊处理
            if (this.getBoolItem("dingque", false)) _countIdx = 3;
            _currentCount = _countIdx + [3, 2].indexOf(this.getNumberItem("maxPlayer", 0));
        }
        else
            _currentCount = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_guizhouGuiYangZhuoJi_count, 0);
        this._playNode_player_count_radio.selectItem(_currentCount);
        this.radioBoxSelectCB(_currentCount, this._countlist[_currentCount], this._countlist);


        //托管
        var _trustTime;
        if (isClub)
            _trustTime = this.getNumberItem("trustTime", 0);
        else
            _trustTime = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_guizhouGuiYangZhuoJi_tuoguan, 0);
        this._playNode_tuoguanType_0.setSelected(false);
        this._playNode_tuoguanType_1.setSelected(false);
        this._playNode_tuoguanType_2.setSelected(false);
        this._playNode_tuoguanType_3.setSelected(false);
        this._playNode_tuoguanType_4.setSelected(false);
        var index = 0;
        if (_trustTime === 0) {
            this._playNode_tuoguanType_0.setSelected(true);
            index = 0;
        } else if (_trustTime === 10) {
            this._playNode_tuoguanType_1.setSelected(true);
            index = 1;
        } else if (_trustTime === 60) {
            this._playNode_tuoguanType_2.setSelected(true);
            index = 2;
        } else if (_trustTime === 120) {
            this._playNode_tuoguanType_3.setSelected(true);
            index = 3;
        } else if (_trustTime === 180) {
            this._playNode_tuoguanType_4.setSelected(true);
            index = 4;
        }
        this.radioBoxSelectCB(index, this.tuoguanNodeList[index], this.tuoguanNodeList);


        this.changePayForPlayerNum();
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

    fanBeiRadioBoxSelectCallBack: function(index, sender, list){
        if(sender){
            var SColor = cc.color("#00713A");
            var UColor = cc.color("#954500");
            var len = list.length;
            for(var i = 0; i < len; i ++){
                var radioBox = list[i];
                var bSelected = (radioBox === sender && sender.isSelected());
                var txt = radioBox.getChildByName("text");
                txt.ignoreContentAdaptWithSize(true);
                txt.setTextColor(bSelected ? SColor : UColor);
                if(i === 1){
                    var buttonNames = ["btn_add", "btn_sub"];
                    for (var k = 0; k < buttonNames.length; k++) {
                        var button = radioBox.getChildByName(buttonNames[k]);
                        button.setTouchEnabled(bSelected);
                        button.setBright(bSelected);
                    }
                }
            }
        }
    },

    getSelectedPara:function() {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.GUI_ZHOU_GUI_YANG_ZHUO_JI;
        para.maxPlayer = 4;
        para.fanpaiji = true;
        para.yaobaiji = false;
        para.benji = false;
        para.wuguji = false;
        para.xingqiji = false;
        para.fengchuiji = false;
        para.mantangji = false;
        para.dilong = false;
        para.gumai = false;
        para.beishu = 1;
        para.lianzhuangtype = 0;

        // 0: 一扣二   1: 连庄  2：通三
        if(this._playNode_player_zhuangType_radio){
            para.lianzhuangtype = this._playNode_player_zhuangType_radio.getSelectIndex();
        }

        // 倍数
        var fanBeiIdx = this.fanbei_radio.getSelectIndex();
        if(fanBeiIdx === 0){
            para.beishu = 1;
        }else{
            para.beishu = parseInt(this._playNode_fanbei.getChildByName("score").getString());
        }

        /*
        // 托管
        if (this._playNode_tuoguanType_0.isSelected()) {
            para.trustTime = 0;
        } else if (this._playNode_tuoguanType_1.isSelected()) {
            para.trustTime = 10;
        } else if (this._playNode_tuoguanType_2.isSelected()) {
            para.trustTime = 60;
        } else if (this._playNode_tuoguanType_3.isSelected()) {
            para.trustTime = 120;
        } else if (this._playNode_tuoguanType_4.isSelected()) {
            para.trustTime = 180;
        }
        */
        para.trustTime = 0;

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
            para.maxPlayer = 3;
            para.dingque = true;
            _countIdx = 3;
        }
        else if (this._playNode_maxPlayer4.isSelected()) {
            para.maxPlayer = 2;
            para.dingque = true;
            _countIdx = 4;
        }


        para.fanpaiji = this._playNode_fanpaiji.isSelected();
        para.yaobaiji = this._playNode_yaobaiji.isSelected();
        para.benji = this._playNode_benji.isSelected();
        para.wuguji = this._playNode_wuguji.isSelected();
        para.xingqiji = this._playNode_xingqiji.isSelected();
        para.fengchuiji = this._playNode_fengchuiji.isSelected();
        para.mantangji = this._playNode_mantangji.isSelected();
        para.dilong = this._playNode_dilong.isSelected();
        para.gumai = this._playNode_gumai.isSelected();



        if (!this._isFriendCard) {
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_guizhouGuiYangZhuoJi_fanpaiji, para.fanpaiji);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_guizhouGuiYangZhuoJi_yaobaiji, para.yaobaiji);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_guizhouGuiYangZhuoJi_benji, para.benji);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_guizhouGuiYangZhuoJi_wuguji, para.wuguji);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_guizhouGuiYangZhuoJi_xingqiji, para.xingqiji);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_guizhouGuiYangZhuoJi_fengchuiji, para.fengchuiji);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_guizhouGuiYangZhuoJi_mantangji, para.mantangji);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_guizhouGuiYangZhuoJi_dilong, para.dilong);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_guizhouGuiYangZhuoJi_gumai, para.gumai);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_guizhouGuiYangZhuoJi_zhuangType, para.lianzhuangtype);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_guizhouGuiYangZhuoJi_count, _countIdx);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_guizhouGuiYangZhuoJi_tuoguan, para.trustTime);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_guizhouGuiYangZhuoJi_fanbei, para.beishu);
        }

        cc.log("createara guizhouGuiYangZhuoJi: " + JSON.stringify(para));
        return para;
    }
});