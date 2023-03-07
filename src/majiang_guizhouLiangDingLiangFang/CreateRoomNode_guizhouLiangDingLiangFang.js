
var CreateRoomNode_guizhouLiangDingLiangFang = CreateRoomNode.extend({
    setKey:function(){
        this.localStorageKey.KEY_guizhouLiangDing_shangxiaji    = "_guizhouLiangDing_SHANG_XIA_JI";   //上下鸡
        this.localStorageKey.KEY_guizhouLiangDing_mantangji     = "_guizhouLiangDing_MAN_TANG_JI";  //满堂鸡
        this.localStorageKey.KEY_guizhouLiangDing_baoji         = "_guizhouLiangDing_BAO_JI";       //包鸡
        this.localStorageKey.KEY_guizhouLiangDing_wuguji        = "_guizhouLiangDing_WU_GU_JI";     //乌骨鸡
        this.localStorageKey.KEY_guizhouLiangDing_qgshaoji      = "_guizhouLiangDing_QG_SHAO_JI";   //抢杠烧鸡
        this.localStorageKey.KEY_guizhouLiangDing_qgshaodou     = "_guizhouLiangDing_QG_SHAO_DOU";  //抢杠烧豆
        this.localStorageKey.KEY_guizhouLiangDing_xingqiji      = "_guizhouLiangDing_XING_QI_JI";   //星期鸡
        this.localStorageKey.KEY_guizhouLiangDing_lianzhuang    = "_guizhouLiangDing_LIAN_ZHUANG";  //连庄
        this.localStorageKey.KEY_guizhouLiangDing_repaopeifen   = "_guizhouLiangDing_RE_PAO_PEI_FEN"; //热炮赔分
        this.localStorageKey.KEY_guizhouLiangDing_zimotype      = "_guizhouLiangDing_ZM_TYPE"; //自摸type
        this.localStorageKey.KEY_guizhouLiangDing_qianggangtype = "_guizhouLiangDing_QG_TYPE"; //抢杠type
        this.localStorageKey.KEY_guizhouLiangDing_difen         = "_guizhouLiangDing_DI_FEN";       //底分
        this.localStorageKey.KEY_guizhouLiangDing_gps           = "_guizhouLiangDing_GPS";          //防作弊
        this.localStorageKey.KEY_guizhouLiangDing_count         = "_guizhouLiangDing_COUNT";        //人数
        this.localStorageKey.KEY_guizhouLiangDing_tuoguan       = "_guizhouLiangDing_TUO_GUAN";      //托管
        this.localStorageKey.KEY_guizhouLiangDing_zhipaixing    = "_guizhouLiangDing_ZHI_PAI_XING";  //只牌型分
        this.localStorageKey.KEY_guizhouLiangDing_benji    = "_guizhouLiangDing_BEN_JI";  //本鸡
    },
    initAll:function(IsFriendCard) {

        if (!IsFriendCard) this.setKey();
        this.bg_node = ccs.load("bg_guizhouLiangDingLiangFang.json").node;
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

        //上下鸡
        this._playNode_shangxiaji = _play.getChildByName("play_shangxiaji");
        this.addListenerText(this._playNode_shangxiaji);
        this._playNode_shangxiaji.addEventListener(this.clickCB, this._playNode_shangxiaji);

        //满堂鸡
        this._playNode_mantangji = _play.getChildByName("play_mantangji");
        this.addListenerText(this._playNode_mantangji);
        this._playNode_mantangji.addEventListener(this.clickCB, this._playNode_mantangji);

        //包鸡
        this._playNode_baoji = _play.getChildByName("play_baoji");
        this.addListenerText(this._playNode_baoji);
        this._playNode_baoji.addEventListener(this.clickCB, this._playNode_baoji);

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

        //热炮赔分
        this._playNode_repaopeifen = _play.getChildByName("play_repaopeifen");
        this.addListenerText(this._playNode_repaopeifen);
        this._playNode_repaopeifen.addEventListener(this.clickCB, this._playNode_repaopeifen);

        //连庄
        this._playNode_lianzhuang = _play.getChildByName("play_lianzhuang");
        this.addListenerText(this._playNode_lianzhuang);
        this._playNode_lianzhuang.addEventListener(this.clickCB, this._playNode_lianzhuang);

        //只牌型分翻倍
        this._playNode_paixingfenfanbei = _play.getChildByName("play_paixingfanbei");
        this.addListenerText(this._playNode_paixingfenfanbei);
        this._playNode_paixingfenfanbei.addEventListener(this.clickCB, this._playNode_paixingfenfanbei);

        //抢杠
        this._playNode_qianggang0 = _play.getChildByName("play_qg_peifen");
        this._playNode_qianggang1 = _play.getChildByName("play_qg_suanzimo");
        var nodeQiangGangList = [this._playNode_qianggang0, this._playNode_qianggang1];
        this._playNode_qianggang_radio = createRadioBoxForCheckBoxs(nodeQiangGangList, function(index){
            this.radioBoxSelectCB(index, nodeQiangGangList[index], nodeQiangGangList);
        }.bind(this));
        this.addListenerText(nodeQiangGangList, this._playNode_qianggang_radio);
        this._qiangganglist = nodeQiangGangList;


        //自摸
        this._playNode_zimo0 = _play.getChildByName("play_zm_fanbei");
        this._playNode_zimo1 = _play.getChildByName("play_zm_jiayifen");
        var nodeZiMoList = [this._playNode_zimo0, this._playNode_zimo1];
        this._playNode_zimo_radio = createRadioBoxForCheckBoxs(nodeZiMoList, function(index){
            this.radioBoxSelectCB(index, nodeZiMoList[index], nodeZiMoList);
        }.bind(this));
        this.addListenerText(nodeZiMoList, this._playNode_zimo_radio);
        this._zimolist = nodeZiMoList;


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


        //本鸡
        this._playNode_benji = _play.getChildByName("play_benji");
        this.addListenerText(this._playNode_benji);
        this._playNode_benji.addEventListener(this.clickCB, this._playNode_benji);

        //添加托管提示按钮
        this.addTuoGuanHelpBtn(_play);
    },
    setPlayNodeCurrentSelect: function(isClub) {

        // 上下鸡
        var _shangxiaji;
        if (isClub)
            _shangxiaji = this.getBoolItem("yaobaiji", false);
        else
            _shangxiaji = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_guizhouLiangDing_shangxiaji, true);
        this._playNode_shangxiaji.setSelected(_shangxiaji);
        var text = this._playNode_shangxiaji.getChildByName("text");
        this.selectedCB(text, _shangxiaji);


        // 满堂鸡
        var _mantangji;
        if (isClub)
            _mantangji = this.getBoolItem("mantangji", false);
        else
            _mantangji = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_guizhouLiangDing_mantangji, true);
        this._playNode_mantangji.setSelected(_mantangji);
        var text = this._playNode_mantangji.getChildByName("text");
        this.selectedCB(text, _mantangji);


        // 包鸡
        var _baoji;
        if (isClub)
            _baoji = this.getBoolItem("baoji", false);
        else
            _baoji = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_guizhouLiangDing_baoji, false);
        this._playNode_baoji.setSelected(_baoji);
        var text = this._playNode_baoji.getChildByName("text");
        this.selectedCB(text, _baoji);


        // 乌骨鸡
        var _wuguji;
        if (isClub)
            _wuguji = this.getBoolItem("wuguji", false);
        else
            _wuguji = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_guizhouLiangDing_wuguji, false);
        this._playNode_wuguji.setSelected(_wuguji);
        var text = this._playNode_wuguji.getChildByName("text");
        this.selectedCB(text, _wuguji);


        // 抢杠烧鸡
        var _qianggangshaoji;
        if (isClub)
            _qianggangshaoji = this.getBoolItem("qianggangshaoji", false);
        else
            _qianggangshaoji = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_guizhouLiangDing_qgshaoji, true);
        this._playNode_qianggangshaoji.setSelected(_qianggangshaoji);
        var text = this._playNode_qianggangshaoji.getChildByName("text");
        this.selectedCB(text, _qianggangshaoji);


        // 抢杠烧豆
        var _qianggangshaodou;
        if (isClub)
            _qianggangshaodou = this.getBoolItem("qianggangshaodou", false);
        else
            _qianggangshaodou = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_guizhouLiangDing_qgshaodou, true);
        this._playNode_qianggangshaodou.setSelected(_qianggangshaodou);
        var text = this._playNode_qianggangshaodou.getChildByName("text");
        this.selectedCB(text, _qianggangshaodou);


        // 连庄
        var _lianzhuang;
        if (isClub)
            _lianzhuang = this.getBoolItem("lianzhuang", false);
        else
            _lianzhuang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_guizhouLiangDing_lianzhuang, false);
        this._playNode_lianzhuang.setSelected(_lianzhuang);
        var text = this._playNode_lianzhuang.getChildByName("text");
        this.selectedCB(text, _lianzhuang);


        // 热炮赔分
        var _repaopeifen;
        if (isClub)
            _repaopeifen = this.getBoolItem("repaopeifen", false);
        else
            _repaopeifen = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_guizhouLiangDing_repaopeifen, true);
        this._playNode_repaopeifen.setSelected(_repaopeifen);
        var text = this._playNode_repaopeifen.getChildByName("text");
        this.selectedCB(text, _repaopeifen);


        // 星期鸡
        var _xingqiji;
        if (isClub)
            _xingqiji = this.getBoolItem("xingqiji", false);
        else
            _xingqiji = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_guizhouLiangDing_xingqiji, false);
        this._playNode_xingqiji.setSelected(_xingqiji);
        var text = this._playNode_xingqiji.getChildByName("text");
        this.selectedCB(text, _xingqiji);


        // 底分(倍数)
        var _beiCount;
        if (isClub) {
            _beiCount = this.getNumberItem("beishu", 1);
        }
        else
            _beiCount = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_guizhouLiangDing_difen, 1);
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

        //自摸type   0:自摸翻倍   1:自摸加一分
        var _zimoType;
        if (isClub)
            _zimoType = this.getNumberItem("zimosuanfen", 0);
        else
            _zimoType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_guizhouLiangDing_zimotype, 0);
        this._playNode_zimo_radio.selectItem(_zimoType);
        this.radioBoxSelectCB(_zimoType, this._zimolist[_zimoType], this._zimolist);

        //抢杠type   0:抢杠赔分   1:抢杠算自摸
        var _qgType;
        if (isClub)
            _qgType = this.getNumberItem("qianggangsuanfen", 0);
        else
            _qgType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_guizhouLiangDing_qianggangtype, 0);
        this._playNode_qianggang_radio.selectItem(_qgType);
        this.radioBoxSelectCB(_qgType, this._qiangganglist[_qgType], this._qiangganglist);


        //防作弊
        var _gps;
        if (isClub)
            _gps = this.getBoolItem("gps", false);
        else
            _gps = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_guizhouLiangDing_gps, false);
        this._playNode_gps.setSelected(_gps);
        var text = this._playNode_gps.getChildByName("text");
        this.selectedCB(text, _gps);


        // 只牌型分翻倍
        var _zhipaixingfenfanbei;
        if (isClub)
            _zhipaixingfenfanbei = this.getBoolItem("paiXinScoreOnly", false);
        else
            _zhipaixingfenfanbei = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_guizhouLiangDing_zhipaixing, false);
        this._playNode_paixingfenfanbei.setSelected(_zhipaixingfenfanbei);
        var text = this._playNode_paixingfenfanbei.getChildByName("text");
        this.selectedCB(text, _zhipaixingfenfanbei);


        //托管
        var _trustTime;
        if (isClub)
            _trustTime = this.getNumberItem("trustTime", 0);
        else
            _trustTime = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_guizhouLiangDing_tuoguan, 0);
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


        // 本鸡
        var _benji;
        if (isClub)
            _benji = this.getBoolItem("benji", false);
        else
            _benji = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_guizhouLiangDing_benji, false);
        this._playNode_benji.setSelected(_benji);
        var text = this._playNode_benji.getChildByName("text");
        this.selectedCB(text, _benji);


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
        para.gameType = MjClient.GAME_TYPE.GUI_ZHOU_LIANG_DING_LIANG_FANG;
        para.maxPlayer = 2;
        para.yaobaiji = true;
        para.mantangji = true;
        para.baoji = true;
        para.wuguji = true;
        para.repaopeifen = false;
        para.qianggangshaoji = true;
        para.qianggangshaodou = true;
        para.lianzhuang = false;
        para.xingqiji = false;
        para.beishu = 1;
        para.convertible = false;             //是否自由人数
        para.paiXinScoreOnly = false;
        para.benji = false; //本鸡
        // 倍数
        var _beiCount = 1;
        if (this._playNode_bei0.isSelected()) {
            _beiCount = 1;
        }
        else if (this._playNode_bei1.isSelected()) {
            _beiCount = parseInt(this._ZhuNum.getString());
        }
        para.beishu = _beiCount;


        var _zimoType = 0;
        if(this._playNode_zimo0.isSelected()){
            _zimoType = 0;
        }else if(this._playNode_zimo1.isSelected()){
            _zimoType = 1;
        }
        para.zimosuanfen = _zimoType;


        var _qgType = 0;
        if(this._playNode_qianggang0.isSelected()){
            _qgType = 0;
        }else if(this._playNode_qianggang1.isSelected()){
            _qgType = 1;
        }
        para.qianggangsuanfen = _qgType;

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

        para.benji = this._playNode_benji.isSelected();
        para.yaobaiji = this._playNode_shangxiaji.isSelected();
        para.mantangji = this._playNode_mantangji.isSelected();
        para.baoji = this._playNode_baoji.isSelected();
        para.wuguji = this._playNode_wuguji.isSelected();
        para.qianggangshaoji = this._playNode_qianggangshaoji.isSelected();
        para.qianggangshaodou = this._playNode_qianggangshaodou.isSelected();
        para.lianzhuang = this._playNode_lianzhuang.isSelected();
        para.xingqiji = this._playNode_xingqiji.isSelected();
        para.repaopeifen = this._playNode_repaopeifen.isSelected();
        if(this._playNode_bei1.isSelected()){
            para.paiXinScoreOnly = this._playNode_paixingfenfanbei.isSelected();
        }



        if (!this._isFriendCard) {
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_guizhouLiangDing_shangxiaji,  para.yaobaiji);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_guizhouLiangDing_mantangji,  para.mantangji);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_guizhouLiangDing_baoji,  para.baoji);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_guizhouLiangDing_wuguji,  para.wuguji);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_guizhouLiangDing_qgshaoji,  para.qianggangshaoji);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_guizhouLiangDing_qgshaodou,  para.qianggangshaodou);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_guizhouLiangDing_lianzhuang,  para.lianzhuang);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_guizhouLiangDing_xingqiji,  para.xingqiji);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_guizhouLiangDing_zhipaixing, para.paiXinScoreOnly);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_guizhouLiangDing_tuoguan, para.trustTime);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_guizhouLiangDing_benji,  para.benji);

            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_guizhouLiangDing_zimotype, Number(_zimoType));
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_guizhouLiangDing_qianggangtype, Number(_qgType));
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_guizhouLiangDing_difen, para.beishu);

        }


        cc.log("createara guizhouLiangDing: " + JSON.stringify(para));
        return para;
    }
});