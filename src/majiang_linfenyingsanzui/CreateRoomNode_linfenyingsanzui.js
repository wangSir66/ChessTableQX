/**
 * Created by Tom on 2018/3/29.
 */


var CreateRoomNode_linfenyingsanzui = CreateRoomNode.extend({
    setKey:function(){
        this.localStorageKey.KEY_linfenyingsanzui_difen           = "_LIN_FEN_YING_SAN_ZUI_DI_FEN";     //增分
        this.localStorageKey.KEY_linfenyingsanzui_count           = "_LIN_FEN_YING_SAN_ZUI_COUNT";      //人数
        this.localStorageKey.KEY_linfenyingsanzui_gps             = "_LIN_FEN_YING_SAN_ZUI_GPS";        //防作弊
        this.localStorageKey.KEY_linfenyingsanzui_angangkejian    = "_LIN_FEN_YING_SAN_ZUI_AN_GANG_KE_JIAN"; //暗杠可见
        this.localStorageKey.KEY_linfenyingsanzui_zhuangfen2      = "_LIN_FEN_YING_SAN_ZUI_ZHUANG_FEN_2"; //庄分2
        this.localStorageKey.KEY_linfenyingsanzui_gangsui         = "_LIN_FEN_YING_SAN_ZUI_GANG_SUI"; //杠随胡走
        this.localStorageKey.KEY_linfenyingsanzui_lunzhuang         = "_LIN_FEN_YING_SAN_ZUI_LUN_ZHUANG"; //轮庄
    },
    initAll:function(IsFriendCard)
    {
        if (!IsFriendCard)
            this.setKey();
        this.bg_node = ccs.load("bg_linfenyingsanzui.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_linfenyingsanzui");
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

        //防作弊
        this._playNode_gps = this.bg_node.getChildByName("play_gps");
        this.addListenerText(this._playNode_gps);
        this._playNode_gps.addEventListener(this.clickCB, this._playNode_gps);
        COMMON_UI.addHelpUI(this._playNode_gps);

        //暗杠可见
        this._playNode_angangkejian = _play.getChildByName("play_angangkejian");
        this.addListenerText(this._playNode_angangkejian);
        this._playNode_angangkejian.addEventListener(this.clickCB, this._playNode_angangkejian);

        //庄分2
        this._playNode_zhuangfen2 = _play.getChildByName("play_zhuangfen2");
        this.addListenerText(this._playNode_zhuangfen2);
        this._playNode_zhuangfen2.addEventListener(this.clickCB, this._playNode_zhuangfen2);

        //杠随胡走
        this._playNode_gangsui = _play.getChildByName("play_gangsui");
        this.addListenerText(this._playNode_gangsui);
        this._playNode_gangsui.addEventListener(this.clickCB, this._playNode_gangsui);

        //轮庄
        this._playNode_lunzhuang = _play.getChildByName("play_lunzhuang");
        this.addListenerText(this._playNode_lunzhuang);
        this._playNode_lunzhuang.addEventListener(this.clickCB, this._playNode_lunzhuang);

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
        else {
            _currentCount = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_linfenyingsanzui_count, 0);
        }
        this._playNode_player_count_radio.selectItem(_currentCount);
        this.radioBoxSelectCB(_currentCount, this._countlist[_currentCount], this._countlist);


        //防作弊
        var _gps;
        if(isClub)
            _gps = this.getBoolItem("gps", false);
        else
            _gps = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_linfenyingsanzui_gps, false);
        this._playNode_gps.setSelected(_gps);
        var text = this._playNode_gps.getChildByName("text");
        this.selectedCB(text, _gps);


        //暗杠可见
        var _angangkejian;
        if(isClub)
            _angangkejian = this.getBoolItem("angangkejian", true);
        else
            _angangkejian = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_linfenyingsanzui_angangkejian, true);
        this._playNode_angangkejian.setSelected(_angangkejian);
        var text = this._playNode_angangkejian.getChildByName("text");
        this.selectedCB(text, _angangkejian);


        //庄分2
        var _zhuangfen2;
        if(isClub)
            _zhuangfen2 = this.getBoolItem("zhuangfen2", true);
        else
            _zhuangfen2 = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_linfenyingsanzui_zhuangfen2, true);
        this._playNode_zhuangfen2.setSelected(_zhuangfen2);
        var text = this._playNode_zhuangfen2.getChildByName("text");
        this.selectedCB(text, _zhuangfen2);


        //杠随胡走
        var _gangsui;
        if(isClub)
            _gangsui = this.getBoolItem("gangsui", true);
        else
            _gangsui = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_linfenyingsanzui_gangsui, true);
        this._playNode_gangsui.setSelected(_gangsui);
        var text = this._playNode_gangsui.getChildByName("text");
        this.selectedCB(text, _gangsui);



        //轮庄
        var _lunzhuang;
        if(isClub)
            _lunzhuang = this.getBoolItem("lunzhuang", true);
        else
            _lunzhuang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_linfenyingsanzui_lunzhuang, true);
        this._playNode_lunzhuang.setSelected(_lunzhuang);
        var text = this._playNode_lunzhuang.getChildByName("text");
        this.selectedCB(text, _lunzhuang);




        //底分
        var _fenshu = [1,2,3,4,5,10,20,50];
        var _idx;
        if(isClub) {
            _idx = _fenshu.indexOf(this.getNumberItem("difen", 1));
        }
        else
            _idx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_linfenyingsanzui_difen, 0);
        this._zhuIdx = (_fenshu.length + _idx)%_fenshu.length;

        this._ZhuNum.setString(_fenshu[this._zhuIdx]);
        this.changePayForPlayerNum();
    },
    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.LIN_FEN_YING_SAN_ZUI;
        para.maxPlayer = 4;
        //para.flowerType = WithFlowerType.noFlower;
        para.difen = 1;
        para.convertible = false;//是否自由人数

        if(this._nodeGPS) para.gps = this._nodeGPS.isSelected();
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
        }
        else if (this._playNode_maxPlayer3.isSelected()) {
            para.maxPlayer = 4;
            para.convertible = true;
            _countIdx = 3;
        }

        //防作弊
        para.gps = this._playNode_gps.isSelected();

        //暗杠可见
        para.angangkejian = this._playNode_angangkejian.isSelected();

        //庄分2
        para.zhuangfen2 = this._playNode_zhuangfen2.isSelected();

        //杠随胡走
        para.gangsui = this._playNode_gangsui.isSelected();

        //轮庄
        para.lunzhuang = this._playNode_lunzhuang.isSelected();

        //底分
        para.difen = this._ZhuNum.getString();

        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_linfenyingsanzui_count, _countIdx);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_linfenyingsanzui_gps, para.gps);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_linfenyingsanzui_angangkejian, para.angangkejian);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_linfenyingsanzui_zhuangfen2, para.zhuangfen2);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_linfenyingsanzui_gangsui, para.gangsui);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_linfenyingsanzui_lunzhuang, para.lunzhuang);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_linfenyingsanzui_difen, Number(this._zhuIdx));
        }
        cc.log("yingsanzui  createara: " + JSON.stringify(para));
        return para;
    }
});