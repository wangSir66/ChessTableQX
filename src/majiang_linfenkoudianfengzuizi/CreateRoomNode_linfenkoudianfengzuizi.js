/**
 * Created by maoyu on 2017/7/21.
 */


var CreateRoomNode_linfenkoudianfengzuizi = CreateRoomNode.extend({
    setKey:function(){
        this.localStorageKey.KEY_linfenkoudianfengzuizi_playType     = "_KOU_DIAN_PLAY_TYPE";
        this.localStorageKey.KEY_linfenkoudianfengzuizi_difen        = "_KOU_DIAN_DI_FEN";     //增分
        this.localStorageKey.KEY_linfenkoudianfengzuizi_count        = "_KOU_DIAN_COUNT"; //人数
        this.localStorageKey.KEY_linfenkoudianfengzuizi_lunzhuang    = "_KOU_DIAN_LUN_ZHUANG"; //轮庄
        this.localStorageKey.KEY_linfenkoudianfengzuizi_gps          = "_KOU_DIAN_GPS"; //防作弊
        this.localStorageKey.KEY_linfenkoudianfengzuizi_gangsui      = "_KOU_DIAN_GANG_SUI"; //有胡必胡
        this.localStorageKey.KEY_linfenkoudianfengzuizi_dianpao      = "_KOU_DIAN_DIAN_PAO"; //点炮包杠
        this.localStorageKey.KEY_linfenkoudianfengzuizi_bihu         = "_KOU_DIAN_BI_HU"; //有胡必胡

    },
    initAll:function(IsFriendCard)
    {
        if (!IsFriendCard)
            this.setKey();

        this.bg_node = ccs.load("bg_linfenkoudianfengzuizi.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_linfenkoudianfengzuizi");
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
        this._playNode_playType0 = _play.getChildByName("play_changgui");
        this._playNode_playType1 = _play.getChildByName("play_fenghaozi");
        this._playNode_playType2 = _play.getChildByName("play_suijihaozi");
        var nodePlayTypeList1 = [];
        nodePlayTypeList1.push(this._playNode_playType0);
        nodePlayTypeList1.push(this._playNode_playType1);
        nodePlayTypeList1.push(this._playNode_playType2);
        this._playNode_PlayType_radio = createRadioBoxForCheckBoxs(nodePlayTypeList1, function(index){
            this.changePayForPlayerNum(index);
            this.radioBoxSelectCB(index, nodePlayTypeList1[index], nodePlayTypeList1);
        }.bind(this));
        this.addListenerText(nodePlayTypeList1, this._playNode_PlayType_radio,this.changePayForPlayerNum.bind(this));
        this._playTypelist = nodePlayTypeList1;

        //底分
        this._zhuIdx = 0;//数组的引索
        var _fenshu = [1,2,3,4,5,10,20,50];
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

        // 防作弊
        this._playNode_gps = this.bg_node.getChildByName("play_gps");
        this.addListenerText(this._playNode_gps);
        this._playNode_gps.addEventListener(this.clickCB, this._playNode_gps);
        COMMON_UI.addHelpUI(this._playNode_gps);

        // 杠随胡走
        this._playNode_gangsui = _play.getChildByName("play_gangsui");
        this.addListenerText(this._playNode_gangsui);
        this._playNode_gangsui.addEventListener(this.clickCB, this._playNode_gangsui);

        // 点炮包杠
        this._playNode_dianpao = _play.getChildByName("play_dianpao");
        this.addListenerText(this._playNode_dianpao);
        this._playNode_dianpao.addEventListener(this.clickCB, this._playNode_dianpao);

        // 有胡必胡
        this._playNode_bihu = _play.getChildByName("play_bihu");
        this.addListenerText(this._playNode_bihu);
        this._playNode_bihu.addEventListener(this.clickCB, this._playNode_bihu);


    },
    setPlayNodeCurrentSelect: function(isClub) {

        //人数
        var _currentCount;
        if (isClub) {
            if (this.getBoolItem("convertible", false))
                _currentCount = 3;
            else
                _currentCount = [4, 3, 2].indexOf(this.getNumberItem("maxPlayer", 4));
        }
        else
            _currentCount = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_linfenkoudianfengzuizi_count, 0);
        this._playNode_player_count_radio.selectItem(_currentCount);
        this.radioBoxSelectCB(_currentCount, this._countlist[_currentCount], this._countlist);

        //玩法
        var _playType;
        var _idx = 0;
        if(isClub)
            _playType = this.getNumberItem("playType", 0);
        else
            _playType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_linfenkoudianfengzuizi_playType, 0);
        if(_playType === 2)
        {
            _idx = 1;
        }
        else if(_playType === 3)
        {
            _idx = 2;
        }
        this._playNode_PlayType_radio.selectItem(_idx);
        this.radioBoxSelectCB(_playType, this._playTypelist[_idx], this._playTypelist);

        //分数
        var _fenshu = [1,2,3,4,5,10,20,50];
        var _idx;
        if (isClub) {
            _idx = this.getNumberItem("difen", 1);
            _idx = _fenshu.indexOf( parseInt(_idx) );
        }else
            _idx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_linfenkoudianfengzuizi_difen, 0);
        this._zhuIdx = (_fenshu.length + _idx)%_fenshu.length;
        this._ZhuNum.setString(_fenshu[this._zhuIdx]);

        //防作弊
        var _gps;
        if(isClub)
            _gps = this.getBoolItem("gps", false);
        else
            _gps = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_linfenkoudianfengzuizi_gps, false);
        this._playNode_gps.setSelected(_gps);
        var text = this._playNode_gps.getChildByName("text");
        this.selectedCB(text, _gps);

        //杠随胡走
        var _gangsui;
        if(isClub)
            _gangsui = this.getBoolItem("gangsui", false);
        else
            _gangsui = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_linfenkoudianfengzuizi_gangsui, false);
        this._playNode_gangsui.setSelected(_gangsui);
        var text = this._playNode_gangsui.getChildByName("text");
        this.selectedCB(text, _gangsui);

        //点炮包杠
        var _dianpao;
        if(isClub)
            _dianpao = this.getBoolItem("dianpao", false);
        else
            _dianpao = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_linfenkoudianfengzuizi_dianpao, false);
        this._playNode_dianpao.setSelected(_dianpao);
        var text = this._playNode_dianpao.getChildByName("text");
        this.selectedCB(text, _dianpao);

        //有胡必胡
        var _bihu;
        if(isClub)
            _bihu = this.getBoolItem("bihu", false);
        else
            _bihu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_linfenkoudianfengzuizi_bihu, false);
        this._playNode_bihu.setSelected(_bihu);
        var text = this._playNode_bihu.getChildByName("text");
        this.selectedCB(text, _bihu);

        this.changePayForPlayerNum();
    },
    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.LIN_FEN_KOU_DIAN_FENG_ZUI_ZI;
        para.maxPlayer = 4;
        para.difen = 1;
        if(this._nodeGPS) para.gps = this._nodeGPS.isSelected();
        para.playType = 0; // 0 经典，1 风耗子，2 随机耗子
        para.convertible = false;//是否自由人数
        //para.flowerType = WithFlowerType.noFlower;
        //para.lunzhuang = true;


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

        //玩法 0 经典，2 风耗子，3 随机耗子
        if (this._playNode_playType0.isSelected()) {
            para.playType = 0;
            //经典玩法
        }
        else if (this._playNode_playType1.isSelected()) {
            para.playType = 2;
            //风耗子
        }
        else if (this._playNode_playType2.isSelected()) {
            para.playType = 3;
            //随机耗子
        }

        para.difen = this._ZhuNum.getString();

        //杠随胡走
        para.gangsui = this._playNode_gangsui.isSelected();

        //点炮包杠
        para.dianpao = this._playNode_dianpao.isSelected();

        //有胡必胡
        para.bihu = this._playNode_bihu.isSelected();

        //防作弊
        para.gps = this._playNode_gps.isSelected();
        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_linfenkoudianfengzuizi_count, _countIdx);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_linfenkoudianfengzuizi_playType, para.playType);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_linfenkoudianfengzuizi_difen, Number(this._zhuIdx));
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_linfenkoudianfengzuizi_gangsui,  para.gangsui);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_linfenkoudianfengzuizi_dianpao,  para.dianpao);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_linfenkoudianfengzuizi_bihu,  para.bihu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_linfenkoudianfengzuizi_gps,  para.gps);
        }
        cc.log("yingkoufengzuizi createara: " + JSON.stringify(para));
        return para;
    }
});