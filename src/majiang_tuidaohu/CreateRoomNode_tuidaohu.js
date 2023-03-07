/**
 * Created by maoyu on 2017/7/21.
 */


var CreateRoomNode_tuidaohu = CreateRoomNode.extend({
    setKey:function(){
        this.localStorageKey.KEY_tuidaohu_huType              = "_TUI_DAO_HU_HU_TYPE";
        this.localStorageKey.KEY_tuidaohu_baoting             = "_TUI_DAO_HU_BAO_TING";     //报听
        this.localStorageKey.KEY_tuidaohu_daifeng             = "_TUI_DAO_HU_DAI_FENG";     //报听
        this.localStorageKey.KEY_tuidaohu_zimohu              = "_TUI_DAO_HU_ZI_MO_HU";     //报听
        this.localStorageKey.KEY_tuidaohu_difen               = "_TUI_DAO_HU_DI_FEN";     //增分
        this.localStorageKey.KEY_tuidaohu_count               = "_TUI_DAO_HU_COUNT"; //人数
        this.localStorageKey.KEY_tuidaohu_duohu               = "_TUI_DAO_HU_DUO_HU"; //一炮多响
        this.localStorageKey.KEY_tuidaohu_lunzhuang           = "_TUI_DAO_HU_LUN_ZHUANG"; //轮庄
        this.localStorageKey.KEY_tuidaohu_gps                 = "_TUI_DAO_HU_GPS"; //防作弊
        this.localStorageKey.KEY_tuidaohu_gangsuihuzou        = "_TUI_DAO_HU_GANG_SUI_HU_ZOU";
        this.localStorageKey.KEY_tuidaohu_queyimen            = "_TUI_DAO_HU_QUE_YI_MEN";
        this.localStorageKey.KEY_tuidaohu_bihu                = "_TUI_DAO_HU_BI_HU";
        this.localStorageKey.KEY_tuidaohu_jiafan              = "_TUI_DAO_HU_JIA_FAN";   // 一张赢加番
    },
    initAll:function(IsFriendCard)
    {
        if (!IsFriendCard)
            this.setKey();

        this.bg_node = ccs.load("bg_tuidaohu.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_tuidaohu");
        this.playScroll = this.bg_node.getChildByName("playScroll");
        this._scroll_round = this.playScroll.getChildByName("round");
    },
    initRoundNode:function()
    {
        this._super();
        //打开大赢家付
        this.payWayNodeArray[2].visible = true;
        this.payWayNodeArray[2].setEnabled(true);
    },
    initPlayNode:function()
    {
        //花
        var _play = this.playScroll.getChildByName("play");


         //人数
         this._playNode_maxPlayer0 = _play.getChildByName("play_count0");
         this._playNode_maxPlayer1 = _play.getChildByName("play_count1");
         this._playNode_maxPlayer2 = _play.getChildByName("play_count2");
        this._playNode_maxPlayer3 = _play.getChildByName("play_count3");
         var nodeCountList1 = [];
         nodeCountList1.push(_play.getChildByName("play_count0"));
         nodeCountList1.push(_play.getChildByName("play_count1"));
         nodeCountList1.push(_play.getChildByName("play_count2"));
        nodeCountList1.push(_play.getChildByName("play_count3"));
         this._playNode_player_count_radio = createRadioBoxForCheckBoxs(nodeCountList1, function(index){
             this.changePayForPlayerNum(index);
             this.radioBoxSelectCB(index, nodeCountList1[index], nodeCountList1);
         }.bind(this));
         this.addListenerText(nodeCountList1, this._playNode_player_count_radio,this.changePayForPlayerNum.bind(this));
         this._countlist = nodeCountList1;
		this.initPlayNumNode(nodeCountList1, [4, 3, 2, 4]);

        //玩法playType
        this._playNode_huType0 = _play.getChildByName("play_dahu");
        this._playNode_huType1 = _play.getChildByName("play_xiaohu");
        var nodePlayTypeList1 = [];
        nodePlayTypeList1.push(this._playNode_huType0);
        nodePlayTypeList1.push(this._playNode_huType1);
        this._playNode_huType_radio = createRadioBoxForCheckBoxs(nodePlayTypeList1, function(index){
            this.changePayForPlayerNum(index);
            this.radioBoxSelectCB(index, nodePlayTypeList1[index], nodePlayTypeList1);
        }.bind(this));
        this.addListenerText(nodePlayTypeList1, this._playNode_huType_radio,this.changePayForPlayerNum.bind(this));
        this._playHuTypelist = nodePlayTypeList1;




        //底分
        this._zhuIdx = 0;//数组的引索
        var _fenshu = [1,2,3,4,5,10,20,50,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9];
        var _arrayLenth =  _fenshu.length;//数组长度
        this._ZhuNum = this.playScroll.getChildByName("txt_fen");
        this._ZhuNum.setString(_fenshu[this._zhuIdx]);
        this._Button_sub = this.playScroll.getChildByName("btn_sub");
        this._Button_sub.addTouchEventListener(function(sender, type) {
            if (type == 2) {
                this._zhuIdx = (_arrayLenth + --this._zhuIdx)%_arrayLenth;
                this._ZhuNum.setString(_fenshu[this._zhuIdx]);
                this.setRoomCardModeFree();
            }
        }, this);
        this._Button_add = this.playScroll.getChildByName("btn_add");
        this._Button_add.addTouchEventListener(function(sender, type) {
            if (type == 2) {
                this._zhuIdx = (_arrayLenth + ++this._zhuIdx)%_arrayLenth;
                this._ZhuNum.setString(_fenshu[this._zhuIdx]);
                this.setRoomCardModeFree();
            }
        }, this);



        this._playNode_baoting = _play.getChildByName("play_baoting");
        this.addListenerText(this._playNode_baoting);
        this._playNode_baoting.addEventListener(this.clickCB, this._playNode_baoting);


        // 一张赢加番
        this._playNode_jiafan = _play.getChildByName("play_jiafan");
        this.addListenerText(this._playNode_jiafan);
        this._playNode_jiafan.addEventListener(this.clickCB, this._playNode_jiafan);


        this._playNode_daifeng = _play.getChildByName("play_daifeng");
        this.addListenerText(this._playNode_daifeng);
        this._playNode_daifeng.addEventListener(this.clickCB, this._playNode_daifeng);


        this._playNode_zimohu = _play.getChildByName("play_zimohu");
        this.addListenerText(this._playNode_zimohu);
        this._playNode_zimohu.addEventListener(this.clickCB, this._playNode_zimohu);

        this._playNode_gangsuihuzou = _play.getChildByName("play_gangsuihuzou");
        this.addListenerText(this._playNode_gangsuihuzou);
        this._playNode_gangsuihuzou.addEventListener(this.clickCB, this._playNode_gangsuihuzou);


        this._playNode_duohu = _play.getChildByName("play_duohu");
        this.addListenerText(this._playNode_duohu);
        this._playNode_duohu.addEventListener(this.clickCB, this._playNode_duohu);


        this._playNode_lunzhuang = _play.getChildByName("play_lunzhuang");
        this.addListenerText(this._playNode_lunzhuang);
        this._playNode_lunzhuang.addEventListener(this.clickCB, this._playNode_lunzhuang);

        this._playNode_queyimen = _play.getChildByName("play_queyimen");
        this.addListenerText(this._playNode_queyimen);
        this._playNode_queyimen.addEventListener(this.clickCB, this._playNode_queyimen);

        this._playNode_bihu = _play.getChildByName("play_bihu");
        this.addListenerText(this._playNode_bihu);
        this._playNode_bihu.addEventListener(this.clickCB, this._playNode_bihu);

        var that = this;
        this._playNode_baoting.schedule(function() {
            that._playNode_bihu.visible = that._playNode_baoting.isSelected();
        });


        //防作弊
        this._playNode_gps = this.bg_node.getChildByName("play_gps");
        this.addListenerText(this._playNode_gps);
        this._playNode_gps.addEventListener(this.clickCB, this._playNode_gps);
        COMMON_UI.addHelpUI(this._playNode_gps);
    },
    setPlayNodeCurrentSelect: function(isClub) {

        var _huType;
        if (isClub) {
            _huType = this.getNumberItem("dahu", false);
            if (_huType) _huType = 0;
            else _huType = 1;
        }
        else
            _huType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_tuidaohu_huType, 0);
        this._playNode_huType0.setSelected(false);
        this._playNode_huType1.setSelected(false);
        var list = [];
        list.push(this._playNode_huType0);
        list.push(this._playNode_huType1);
        var index = 0;
        if (_huType == 0) {
            this._playNode_huType0.setSelected(true);
        }else {
            this._playNode_huType1.setSelected(true);
        }
        this.radioBoxSelectCB(index, list[index], list);


        var _baoting;
        if (isClub)
            _baoting = this.getBoolItem("baoting", false);
        else
            _baoting = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_tuidaohu_baoting, false);
        this._playNode_baoting.setSelected(_baoting);
        var text = this._playNode_baoting.getChildByName("text");
        this.selectedCB(text, _baoting);

        var _daifeng;
        if (isClub)
            _daifeng = this.getBoolItem("daifeng", false);
        else
            _daifeng = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_tuidaohu_daifeng, false);
        this._playNode_daifeng.setSelected(_daifeng);
        var text = this._playNode_daifeng.getChildByName("text");
        this.selectedCB(text, _daifeng);

        var _zimohu;
        if (isClub)
            _zimohu = this.getBoolItem("mustzimo", false);
        else
            _zimohu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_tuidaohu_zimohu, false);
        this._playNode_zimohu.setSelected(_zimohu);
        var text = this._playNode_zimohu.getChildByName("text");
        this.selectedCB(text, _zimohu);

        var _jiafan;
        if (isClub)
            _jiafan = this.getBoolItem("yizhangying", false);
        else
            _jiafan = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_tuidaohu_jiafan, false);
        this._playNode_jiafan.setSelected(_jiafan);
        var text = this._playNode_jiafan.getChildByName("text");
        this.selectedCB(text, _jiafan);

        var _duohu;
        if (isClub)
            _duohu = this.getBoolItem("duoHu", true);
        else
            _duohu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_tuidaohu_duohu, true);
        this._playNode_duohu.setSelected(_duohu);
        var text = this._playNode_duohu.getChildByName("text");
        this.selectedCB(text, _duohu);

        var _lunzhuang;
        if (isClub)
            _lunzhuang = this.getBoolItem("lunzhuang", true);
        else
            _lunzhuang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_tuidaohu_lunzhuang, true);
        this._playNode_lunzhuang.setSelected(_lunzhuang);
        var text = this._playNode_lunzhuang.getChildByName("text");
        this.selectedCB(text, _lunzhuang);

        var _gangsuihuzou;
        if (isClub)
            _gangsuihuzou = this.getBoolItem("gangsuihuzou", true);
        else
            _gangsuihuzou = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_tuidaohu_gangsuihuzou, true);
        this._playNode_gangsuihuzou.setSelected(_gangsuihuzou);
        var text = this._playNode_gangsuihuzou.getChildByName("text");
        this.selectedCB(text, _gangsuihuzou);

        var _queyimen;
        if (isClub)
            _queyimen = this.getBoolItem("queyimen", false);
        else
            _queyimen = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_tuidaohu_queyimen, false);
        this._playNode_queyimen.setSelected(_queyimen);
        var text = this._playNode_queyimen.getChildByName("text");
        this.selectedCB(text, _queyimen);

        var _bihu;
        if (isClub)
            _bihu = this.getBoolItem("youhubihu", false);
        else
            _bihu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_tuidaohu_bihu, false);
        this._playNode_bihu.setSelected(_bihu);
        var text = this._playNode_bihu.getChildByName("text");
        this.selectedCB(text, _bihu);


        //人数
        var _currentCount;
        if (isClub) {
            if (this.getBoolItem("convertible", false))
                _currentCount = 3;
            else
                _currentCount = [4, 3, 2].indexOf(this.getNumberItem("maxPlayer", 4));
        }
        else
            _currentCount = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_tuidaohu_count, 0);
        cc.log("_currentCount renshu  == " + _currentCount)
        this._playNode_player_count_radio.selectItem(_currentCount);
        this.radioBoxSelectCB(_currentCount, this._countlist[_currentCount], this._countlist);

        var _fenshu = [1,2,3,4,5,10,20,50,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9];
        var _idx;
        if (isClub) {
            _idx = this.getNumberItem("difen", 1);
            _idx = _fenshu.indexOf( parseInt(_idx) );
        }else
            _idx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_tuidaohu_difen, 0);
        this._zhuIdx = (_fenshu.length + _idx)%_fenshu.length;
        this._ZhuNum.setString(_fenshu[this._zhuIdx]);

        //防作弊
        var _gps;
        if (isClub)
            _gps = this.getBoolItem("gps", 0);
        else
            _gps = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_tuidaohu_gps, false);
        this._playNode_gps.setSelected(_gps);
        var text = this._playNode_gps.getChildByName("text");
        this.selectedCB(text, _gps);

        this.changePayForPlayerNum();
    },
    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.JIN_ZHONG_TUI_DAO_HU;
        para.maxPlayer = 4;
        //para.flowerType = WithFlowerType.noFlower;
        //para.liuduo = true;//2018.1.31修改为默认留垛
        para.dahu = true;
        para.baoting = true;
        para.daifeng = true;
        para.mustzimo = true;
        para.difen = 1;
        para.duoHu = true;
        para.lunzhuang = true;
        para.gangsuihuzou = true;
        para.queyimen = false;
        para.youhubihu = false;
        para.yizhangying = false;
        para.convertible = false;//是否自由人数
        //para.playType = 0; // 0 经典，1 不带风，2 带耗子
        //para.gps = !!this._bGPS.isSelected();

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
        } else if (this._playNode_maxPlayer3.isSelected()) {
            para.maxPlayer = 4;
            para.convertible = true;
            _countIdx = 3;
        }



        var hutype =  0;
        if(this._playNode_huType0.isSelected())
        {
            para.dahu = true;
            hutype = 0;
        }
        else{
            para.dahu = false;
            hutype = 1;
        }


        para.baoting = this._playNode_baoting.isSelected();

        para.daifeng = this._playNode_daifeng.isSelected();

        para.mustzimo = this._playNode_zimohu.isSelected();

        para.duoHu = this._playNode_duohu.isSelected();

        para.lunzhuang = this._playNode_lunzhuang.isSelected();


        para.difen = this._ZhuNum.getString();

        para.gangsuihuzou = this._playNode_gangsuihuzou.isSelected();

        para.queyimen = this._playNode_queyimen.isSelected();

        para.youhubihu = this._playNode_bihu.isSelected();

        para.yizhangying = this._playNode_jiafan.isSelected();

        //防作弊
        para.gps = this._playNode_gps.isSelected();

        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_tuidaohu_count, _countIdx);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_tuidaohu_huType, hutype);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_tuidaohu_baoting,  para.baoting);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_tuidaohu_daifeng,  para.daifeng);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_tuidaohu_zimohu,  para.mustzimo);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_tuidaohu_duohu,  para.duoHu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_tuidaohu_lunzhuang,  para.lunzhuang);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_tuidaohu_difen, Number(this._zhuIdx));
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_tuidaohu_gangsuihuzou,  para.gangsuihuzou);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_tuidaohu_queyimen,  para.queyimen);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_tuidaohu_bihu,  para.youhubihu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_tuidaohu_gps,  para.gps);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_tuidaohu_jiafan,  para.yizhangying);
        }

        cc.log("createara: " + JSON.stringify(para));
        return para;
    }
});