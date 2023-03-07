
var CreateRoomNode_xuzhoupeixian = CreateRoomNode.extend({
    initAll:function()
    {
        if (!this._isFriendCard) {
            this.localStorageKey.KEY_xuzhoupeixian_count   = "_XU_ZHOU_PEI_XIAN_COUNT";  //人数
            this.localStorageKey.KEY_xuzhoupeixian_hun     = "_XU_ZHOU_PEI_XIAN_HUN";    //混一色
            this.localStorageKey.KEY_xuzhoupeixian_pao     = "_XU_ZHOU_PEI_XIAN_PAO";    //一炮多响
            this.localStorageKey.KEY_xuzhoupeixian_qidui   = "_XU_ZHOU_PEI_XIAN_QIDUI";  //七对
            this.localStorageKey.KEY_xuzhoupeixian_xiama   = "_XU_ZHOU_PEI_XIAN_XIAMA";  //可下码
            this.localStorageKey.KEY_xuzhoupeixian_chi     = "_XU_ZHOU_PEI_XIAN_CHI";    //有花牌
            this.localStorageKey.KEY_xuzhoupeixian_feng    = "_XU_ZHOU_PEI_XIAN_FENG";   //有风牌
            this.localStorageKey.KEY_xuzhoupeixian_difen   = "_XU_ZHOU_PEI_XIAN_DIFEN";  //底分
            this.localStorageKey.KEY_xuzhoupeixian_tuoguan   = "_XU_ZHOU_PEI_XIAN_tuoguan";
        }

        this.bg_node = ccs.load("bg_xuzhoupeixian.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_xuzhoupeixian");
    },
    initPlayNode:function()
    {
        //this._super();
        var _bgxuzhoupeixianNode = this.bg_node;

        var _play = _bgxuzhoupeixianNode.getChildByName("play");
        var _difen = _bgxuzhoupeixianNode.getChildByName("difen").getChildByName("fenshu");

        //人数
        this._playNode_count_0 = _play.getChildByName("play_count0");   //4人
        this._playNode_count_1 = _play.getChildByName("play_count1");   //3人
        this._playNode_count_2 = _play.getChildByName("play_count2");   //2人

        var nodeListcount = [];
        nodeListcount.push(_play.getChildByName("play_count0"));
        nodeListcount.push(_play.getChildByName("play_count1"));
        nodeListcount.push(_play.getChildByName("play_count2"));
        this._playNode_count = createRadioBoxForCheckBoxs(nodeListcount, function(index){
            this.changePayForPlayerNum(index);
            this.radioBoxSelectCB(index, nodeListcount[index], nodeListcount);
        }.bind(this));
        this.addListenerText(nodeListcount, this._playNode_count, this.changePayForPlayerNum.bind(this));
        this._countlist = nodeListcount;
		this.initPlayNumNode(nodeListcount, [4, 3, 2]);


        //底分
        this._zhuIdx = 0;//数组的引索
        var _fenshu = [1,2,3];
        var _arrayLenth =  _fenshu.length;//数组长度
        this._zhuNum = _difen.getChildByName("txt_fen");
        this._zhuNum.setString(_fenshu[this._zhuIdx]);
        this._zhuNum.ignoreContentAdaptWithSize(true);
        this._Button_sub = _difen.getChildByName("btn_sub");
        this._Button_sub.addTouchEventListener(function(sender, type) {
            if (type == 2) {
                this._zhuIdx = (_arrayLenth + --this._zhuIdx)%_arrayLenth;
                this._zhuNum.setString(_fenshu[this._zhuIdx]);
                this.setRoomCardModeFree();
            }
        }, this);
        this._Button_add = _difen.getChildByName("btn_add");
        this._Button_add.addTouchEventListener(function(sender, type) {
            if (type == 2) {
                this._zhuIdx = (_arrayLenth + ++this._zhuIdx)%_arrayLenth;
                this._zhuNum.setString(_fenshu[this._zhuIdx]);
                this.setRoomCardModeFree();
            }
        }, this);


        //可混一色
        this._playNode_hun = _play.getChildByName("play_hun");
        this.addListenerText(this._playNode_hun);
        this._playNode_hun.addEventListener(this.clickCB, this._playNode_hun);

        //一炮多响
        this._playNode_pao = _play.getChildByName("play_pao");
        this.addListenerText(this._playNode_pao);
        this._playNode_pao.addEventListener(this.clickCB, this._playNode_pao);

        //七对
        this._playNode_qidui = _play.getChildByName("play_qidui");
        this.addListenerText(this._playNode_qidui);
        this._playNode_qidui.addEventListener(this.clickCB, this._playNode_qidui);

        //可下码
        this._playNode_xiama = _play.getChildByName("play_xiama");
        this.addListenerText(this._playNode_xiama);
        this._playNode_xiama.addEventListener(this.clickCB, this._playNode_xiama);

        //可吃牌
        this._playNode_chi = _play.getChildByName("play_chi");
        this.addListenerText(this._playNode_chi);
        this._playNode_chi.addEventListener(this.clickCB, this._playNode_chi);

        //有风牌
        this._playNode_feng = _play.getChildByName("play_feng");
        this.addListenerText(this._playNode_feng);
        this._playNode_feng.addEventListener(this.clickCB, this._playNode_feng);

        this._playNode_tuoguanType_0 = _play.getChildByName("tuoguan0");
        this._playNode_tuoguanType_1 = _play.getChildByName("tuoguan1");
        this._playNode_tuoguanType_2 = _play.getChildByName("tuoguan2");
        this._playNode_tuoguanType_3 = _play.getChildByName("tuoguan3");
        var tuoguanList = [];
        tuoguanList.push(_play.getChildByName("tuoguan0"));
        tuoguanList.push(_play.getChildByName("tuoguan1"));
        tuoguanList.push(_play.getChildByName("tuoguan2"));
        tuoguanList.push(_play.getChildByName("tuoguan3"));
        var self = this;
        this.tuoguanTypeList_radio = createRadioBoxForCheckBoxs(tuoguanList, function(index){
            //self.refreshZhuaNiao();
            self.radioBoxSelectCB(index,tuoguanList[index],tuoguanList);
        });
        this.addListenerText(tuoguanList,this.tuoguanTypeList_radio);
        this.tuoguanList = tuoguanList;

        var btn_tuoguanTip = _play.getChildByName("btn_tuoguanTip");
        var image_tuoguanTip = _play.getChildByName("image_tuoguanTip");
        var text = image_tuoguanTip.getChildByName("Text_10");
        text.setFlippedX(true);
        btn_tuoguanTip.addTouchEventListener(function(sender, type) {
            if (type == 2) {
                image_tuoguanTip.setVisible(true);
            }
        }, btn_tuoguanTip);
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            status: null,
            onTouchBegan: function(touch, event) {
                if (image_tuoguanTip.isVisible()) {
                    image_tuoguanTip.setVisible(false);
                    return true;
                } else {
                    return false;
                }
            },
        }, image_tuoguanTip);
    },
    initRoundNode:function()
    {
        this._super();
        // if (cc.sys.isObjectValid(this.payWayNodeArray[2]))
        // {
        //     this.payWayNodeArray[2].visible = true;
        //     this.payWayNodeArray[2].setEnabled(true);
        // }
    },
    setPlayNodeCurrentSelect:function(isClub)
    {
        this._super();
        //人数
        var _countValue;
        if (isClub)
            _countValue = [4, 3, 2].indexOf(this.getNumberItem("maxPlayer", 4));
        else
            _countValue = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_xuzhoupeixian_count, 0);
        this._playNode_count_0.setSelected(false);
        this._playNode_count_1.setSelected(false);
        this._playNode_count_2.setSelected(false);
        var list = [];
        list.push(this._playNode_count_0);
        list.push(this._playNode_count_1);
        list.push(this._playNode_count_2);
        var index = 0;
        switch (_countValue){
            case 0:
                this._playNode_count_0.setSelected(true);
                index = 0;
                break;
            case 1:
                this._playNode_count_1.setSelected(true);
                index = 1;
                break;
            case 2:
                this._playNode_count_2.setSelected(true);
                index = 2;
                break;
            default:
                this._playNode_count_0.setSelected(true);
                index = 0;
                break;
        }
        this.radioBoxSelectCB(index, list[index], list);


        //分数
        var _fenshu = [1,2,3];
        var _idx;
        if (isClub) {
            _idx = this.getNumberItem("difen", 1);
            _idx = _fenshu.indexOf( parseInt(_idx) );
        }else
            _idx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_xuzhoupeixian_difen, 0);
        this._zhuIdx = (_fenshu.length + _idx)%_fenshu.length;
        this._zhuNum.setString(_fenshu[this._zhuIdx]);


        var _chi;
        if (isClub)
            _chi = this.getBoolItem("canChi", true);
        else
            _chi = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_xuzhoupeixian_chi, false);
        this._playNode_chi.setSelected(_chi);
        var text = this._playNode_chi.getChildByName("text");
        this.selectedCB(text, _chi);



        var _hun;
        if (isClub)
            _hun = this.getBoolItem("isQingYiSe", true);
        else
            _hun = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_xuzhoupeixian_hun, false);
        this._playNode_hun.setSelected(_hun);
        var text = this._playNode_hun.getChildByName("text");
        this.selectedCB(text, _hun);



        var _pao;
        if (isClub)
            _pao = this.getBoolItem("duoHu", true);
        else
            _pao = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_xuzhoupeixian_pao, false);
        this._playNode_pao.setSelected(_pao);
        var text = this._playNode_pao.getChildByName("text");
        this.selectedCB(text, _pao);



        var _qidui;
        if (isClub)
            _qidui = this.getBoolItem("isQiDui", true);
        else
            _qidui = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_xuzhoupeixian_qidui, false);
        this._playNode_qidui.setSelected(_qidui);
        var text = this._playNode_qidui.getChildByName("text");
        this.selectedCB(text, _qidui);



        var _xiama;
        if (isClub)
            _xiama = this.getBoolItem("maizhuang", true);
        else
            _xiama = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_xuzhoupeixian_xiama, false);
        this._playNode_xiama.setSelected(_xiama);
        var text = this._playNode_xiama.getChildByName("text");
        this.selectedCB(text, _xiama);



        var _feng;
        if (isClub)
            _feng = this.getBoolItem("isFenCard", true);
        else
            _feng = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_xuzhoupeixian_feng, false);
        this._playNode_feng.setSelected(_feng);
        var text = this._playNode_feng.getChildByName("text");
        this.selectedCB(text, _feng);

        var _trustTime;
        if (isClub)
            _trustTime = [0, 60, 120, 180].indexOf(this.getNumberItem("trustTime", 0));
        else
            _trustTime = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_xuzhoupeixian_tuoguan, 0);
        this.tuoguanTypeList_radio.selectItem(_trustTime);
        this.radioBoxSelectCB(_trustTime,this.tuoguanList[_trustTime],this.tuoguanList);

    },
    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.XU_ZHOU_PEI_XIAN;
        para.maxPlayer = 4;
        para.canChi     = false;
        para.isQingYiSe = false;
        para.duoHu      = false;
        para.isQiDui    = false;
        para.maizhuang  = false;
        para.isFenCard  = false;
        para.difen      = 1;
        para.trustTime = 0;
        //if(this._nodeGPS) para.gps = this._nodeGPS.isSelected();

        //人数
        var _countIdx = 0;
        if (this._playNode_count_0.isSelected())
        {
            para.maxPlayer = 4;
            _countIdx = 0;
        }
        else if (this._playNode_count_1.isSelected())
        {
            para.maxPlayer = 3;
            _countIdx = 1;
        }
        else if (this._playNode_count_2.isSelected())
        {
            para.maxPlayer = 2;
            _countIdx = 2;
        }

        para.canChi = this._playNode_chi.isSelected();

        para.isQingYiSe = this._playNode_hun.isSelected();

        para.duoHu = this._playNode_pao.isSelected();

        para.isQiDui = this._playNode_qidui.isSelected();

        para.maizhuang = this._playNode_xiama.isSelected();

        para.isFenCard = this._playNode_feng.isSelected();

        para.difen = this._zhuNum.getString();

        var tuoguan = 0;
        if (this._playNode_tuoguanType_0.isSelected()) {
            para.trustTime = 0;
            tuoguan = 0;
        }
        else if (this._playNode_tuoguanType_1.isSelected()) {
            para.trustTime = 60;
            tuoguan = 1;
        }
        else if (this._playNode_tuoguanType_2.isSelected()) {
            para.trustTime = 120;
            tuoguan = 2;
        }
        else if (this._playNode_tuoguanType_3.isSelected()) {
            para.trustTime = 180;
            tuoguan = 3;
        }

        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_xuzhoupeixian_count, _countIdx);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_xuzhoupeixian_chi, para.canChi);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_xuzhoupeixian_hun, para.isQingYiSe);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_xuzhoupeixian_pao, para.duoHu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_xuzhoupeixian_qidui, para.isQiDui);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_xuzhoupeixian_xiama, para.maizhuang);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_xuzhoupeixian_feng, para.isFenCard);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_xuzhoupeixian_difen, Number(this._zhuIdx));
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_xuzhoupeixian_tuoguan, tuoguan);
        }
        cc.log("xuzhoupeixian createara: " + JSON.stringify(para));
        return para;
    },
});