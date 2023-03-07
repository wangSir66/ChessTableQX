/**
 * Created by maoyu on 2017/7/21.
 */

var CreateRoomNode_guizhouErDingGuai = CreateRoomNode.extend({
    setKey:function(){
        this.localStorageKey.KEY_guizhouErDingGuai_shangxiaji  = "_guizhouErDingGuai_SHANG_XIA_JI";   //上下鸡
        this.localStorageKey.KEY_guizhouErDingGuai_wuguji      = "_guizhouErDingGuai_WU_GU_JI";       // 乌骨鸡
        this.localStorageKey.KEY_guizhouErDingGuai_mantangji   = "_guizhouErDingGuai_MAN_TANG_JI";    // 满堂鸡
        this.localStorageKey.KEY_guizhouErDingGuai_difen       = "_guizhouErDingGuai_DI_FEN";         // 底分
        this.localStorageKey.KEY_guizhouErDingGuai_gps         = "_guizhouErDingGuai_GPS";            // 防作弊
        this.localStorageKey.KEY_guizhouErDingGuai_qgshaoji    = "_guizhouErDingGuai_QG_SHAO_JI";     // 抢杠烧鸡
        this.localStorageKey.KEY_guizhouErDingGuai_qgshaodou   = "_guizhouErDingGuai_QG_SHAO_DOU";    // 抢杠烧豆
        this.localStorageKey.KEY_guizhouErDingGuai_yuanque     = "_guizhouErDingGuai_YUAN_QUE";       // 原缺
        this.localStorageKey.KEY_guizhouErDingGuai_lianzhuang  = "_guizhouErDingGuai_LIAN_ZHUANG";    // 连庄
        this.localStorageKey.KEY_guizhouErDingGuai_tuoguan     = "_guizhouErDingGuai_TUOGUAN";        // 托管
    },
    initAll:function(IsFriendCard)
    {
        if (!IsFriendCard)
            this.setKey();

        this.bg_node = ccs.load("bg_guizhouSanDingGuai.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_node");
        this.playScroll = this.bg_node.getChildByName("playScroll");
        this._scroll_round = this.playScroll.getChildByName("round");
    },
    initRoundNode:function()
    {
        this._super();
        // 打开大赢家付
        this.payWayNodeArray[2].visible = true;
        this.payWayNodeArray[2].setEnabled(true);
        this.bg_node.setContentSize(cc.size(907.00,580.00));
        this.bg_node.setPosition(-240, -37);
    },
    initPlayNode:function()
    {
        var _play = this.playScroll.getChildByName("play");

        // 上下鸡
        this._playNode_shangxiaji = _play.getChildByName("play_shangxiaji");
        this.addListenerText(this._playNode_shangxiaji);
        this._playNode_shangxiaji.addEventListener(this.clickCB, this._playNode_shangxiaji);

        // 乌骨鸡
        this._playNode_wuguji = _play.getChildByName("play_wuguji");
        this.addListenerText(this._playNode_wuguji);
        this._playNode_wuguji.addEventListener(this.clickCB, this._playNode_wuguji);

        // 满堂鸡
        this._playNode_mantangji = _play.getChildByName("play_mantangji");
        this.addListenerText(this._playNode_mantangji);
        this._playNode_mantangji.addEventListener(this.clickCB, this._playNode_mantangji);

        // 抢杠烧鸡
        this._playNode_qianggangshaoji = _play.getChildByName("play_qianggangshaoji");
        this.addListenerText(this._playNode_qianggangshaoji);
        this._playNode_qianggangshaoji.addEventListener(this.clickCB, this._playNode_qianggangshaoji);

        // 抢杠烧豆
        this._playNode_qianggangshaodou = _play.getChildByName("play_qianggangshaodou");
        this.addListenerText(this._playNode_qianggangshaodou);
        this._playNode_qianggangshaodou.addEventListener(this.clickCB, this._playNode_qianggangshaodou);

        // 原缺
        this._playNode_yuanque = _play.getChildByName("play_yuanque");
        this.addListenerText(this._playNode_yuanque);
        this._playNode_yuanque.addEventListener(this.clickCB, this._playNode_yuanque);

        // 连庄
        this._playNode_lianzhuang = _play.getChildByName("play_lianzhuang");
        this.addListenerText(this._playNode_lianzhuang);
        this._playNode_lianzhuang.addEventListener(this.clickCB, this._playNode_lianzhuang);

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

        // 防作弊
        this._playNode_gps = this.bg_node.getChildByName("play_gps");
        this.addListenerText(this._playNode_gps);
        this._playNode_gps.addEventListener(this.clickCB, this._playNode_gps);
        COMMON_UI.addHelpUI(this._playNode_gps);
 
        // 托管
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

        // 添加托管提示按钮
        this.addTuoGuanHelpBtn(_play);
    },
    setPlayNodeCurrentSelect: function(isClub) {

        // 上下鸡
        var _shangxiaji;
        if (isClub)
            _shangxiaji = this.getBoolItem("yaobaiji", false);
        else
            _shangxiaji = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_guizhouErDingGuai_shangxiaji, true);
        this._playNode_shangxiaji.setSelected(_shangxiaji);
        var text = this._playNode_shangxiaji.getChildByName("text");
        this.selectedCB(text, _shangxiaji);

        // 乌骨鸡
        var _play_wuguji;
        if (isClub)
            _play_wuguji = this.getBoolItem("wuguji", false);
        else
            _play_wuguji = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_guizhouErDingGuai_wuguji, true);
        this._playNode_wuguji.setSelected(_play_wuguji);
        var text = this._playNode_wuguji.getChildByName("text");
        this.selectedCB(text, _play_wuguji);

        // 乌骨鸡
        var _play_wuguji;
        if (isClub)
            _play_wuguji = this.getBoolItem("wuguji", false);
        else
            _play_wuguji = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_guizhouErDingGuai_wuguji, true);
        this._playNode_wuguji.setSelected(_play_wuguji);
        var text = this._playNode_wuguji.getChildByName("text");
        this.selectedCB(text, _play_wuguji);

        // 满堂鸡
        var _mantangji;
        if (isClub)
            _mantangji = this.getBoolItem("mantangji", true);
        else
            _mantangji = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_guizhouErDingGuai_mantangji, true);
        this._playNode_mantangji.setSelected(_mantangji);
        var text = this._playNode_mantangji.getChildByName("text");
        this.selectedCB(text, _mantangji);

        // 抢杠烧鸡
        var _qianggangshaoji;
        if (isClub)
            _qianggangshaoji = this.getBoolItem("qianggangshaoji", true);
        else
            _qianggangshaoji = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_guizhouErDingGuai_qgshaoji, true);
        this._playNode_qianggangshaoji.setSelected(_qianggangshaoji);
        var text = this._playNode_qianggangshaoji.getChildByName("text");
        this.selectedCB(text, _qianggangshaoji);

        // 抢杠烧豆
        var _qianggangshaodou;
        if (isClub)
            _qianggangshaodou = this.getBoolItem("qianggangshaodou", true);
        else
            _qianggangshaodou = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_guizhouErDingGuai_qgshaodou, true);
        this._playNode_qianggangshaodou.setSelected(_qianggangshaodou);
        var text = this._playNode_qianggangshaodou.getChildByName("text");
        this.selectedCB(text, _qianggangshaodou);

        // 原缺
        var _yuanque;
        if (isClub)
            _yuanque = this.getBoolItem("yuanque", true);
        else
            _yuanque = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_guizhouErDingGuai_yuanque, true);
        this._playNode_yuanque.setSelected(_yuanque);
        var text = this._playNode_yuanque.getChildByName("text");
        this.selectedCB(text, _yuanque);

        // 连庄
        var _lianzhuang;
        if (isClub)
            _lianzhuang = this.getBoolItem("lianzhuang", false);
        else
            _lianzhuang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_guizhouErDingGuai_lianzhuang, false);
        this._playNode_lianzhuang.setSelected(_lianzhuang);
        var text = this._playNode_lianzhuang.getChildByName("text");
        this.selectedCB(text, _lianzhuang);

        // 底分(倍数)
        var _beiCount;
        if (isClub) {
            _beiCount = this.getNumberItem("beishu", 1);
        }
        else
            _beiCount = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_guizhouErDingGuai_difen, 1);
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


        // 防作弊
        var _gps;
        if (isClub)
            _gps = this.getBoolItem("gps", false);
        else
            _gps = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_guizhouErDingGuai_gps, false);
        this._playNode_gps.setSelected(_gps);
        var text = this._playNode_gps.getChildByName("text");
        this.selectedCB(text, _gps);

        // 托管
        var _trustTime;
        if (isClub)
            _trustTime = this.getNumberItem("trustTime", 0);
        else
            _trustTime = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_guizhouErDingGuai_tuoguan, 0);
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


    getSelectedPara:function()
    {
        var para = {};

        para.gameType = MjClient.GAME_TYPE.GUI_ZHOU_ER_DING_GUAI;
        para.maxPlayer = 2; // 人数固定三人
        // para.flowerType = WithFlowerType.noFlower;
        para.yaobaiji = true;
        para.beishu = 1;
        para.wuguji = false;
        para.mantangji = true;
        para.qianggangshaoji = true;
        para.qianggangshaodou = true;
        para.yuanque = true;
        para.lianzhuang = false;
        para.convertible = false; // 是否自由人数
        // para.gps = !!this._bGPS.isSelected();
        // if(this._nodeGPS) para.gps = this.._nodeGPSisSelected()
        
        // 上下鸡
        para.yaobaiji = this._playNode_shangxiaji.isSelected();

        // 乌骨鸡
        para.wuguji = this._playNode_wuguji.isSelected();

        // 满堂鸡
        para.mantangji = this._playNode_mantangji.isSelected();

        // 抢杠烧鸡
        para.qianggangshaoji = this._playNode_qianggangshaoji.isSelected();

        // 抢杠烧鸡
        para.qianggangshaodou = this._playNode_qianggangshaodou.isSelected();

        // 原缺
        para.yuanque = this._playNode_yuanque.isSelected();

        // 连庄
        para.lianzhuang = this._playNode_lianzhuang.isSelected();

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

        if (!this._isFriendCard) {
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_guizhouErDingGuai_shangxiaji,  para.yaobaiji);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_guizhouErDingGuai_wuguji,  para.wuguji);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_guizhouErDingGuai_mantangji,  para.mantangji);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_guizhouErDingGuai_qgshaoji,  para.qianggangshaoji);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_guizhouErDingGuai_qgshaodou,  para.qianggangshaodou);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_guizhouErDingGuai_yuanque,  para.yuanque);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_guizhouErDingGuai_lianzhuang,  para.lianzhuang);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_guizhouErDingGuai_difen, para.beishu);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_guizhouErDingGuai_tuoguan, para.trustTime);

        }
        cc.log("createara guizhou : " + JSON.stringify(para));
        return para;
    }
});