/**
 * Created by Tom on 2018/4/29.
 */


var CreateRoomNode_linfenyimenzi = CreateRoomNode.extend({
    setKey:function(){
        this.localStorageKey.KEY_linfenyimenzi_difen           = "_LIN_FEN_YI_MEN_ZI_DI_FEN";     //增分
        this.localStorageKey.KEY_linfenyimenzi_count           = "_LIN_FEN_YI_MEN_ZI_COUNT";      //人数
        this.localStorageKey.KEY_linfenyimenzi_gps             = "_LIN_FEN_YI_MEN_ZI_GPS";        //防作弊
        this.localStorageKey.KEY_linfenyimenzi_shuye           = "_LIN_FEN_YI_MEN_ZI_SHU_YE"; //暗杠可见
        this.localStorageKey.KEY_linfenyimenzi_zhuangfen1      = "_LIN_FEN_YI_MEN_ZI_ZHUANG_FEN_1"; //庄分2
        this.localStorageKey.KEY_linfenyimenzi_gangsui         = "_LIN_FEN_YI_MEN_ZI_GANG_SUI"; //杠随胡走
        this.localStorageKey.KEY_linfenyimenzi_lunzhuang       = "_LIN_FEN_YI_MEN_ZI_LUN_ZHUANG"; //轮庄
    },
    initAll:function(IsFriendCard)
    {
        if (!IsFriendCard)
            this.setKey();
        this.bg_node = ccs.load("bg_linfenyimenzi.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_linfenyimenzi");
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
        this.initPlayNumNode(nodeCountList1, [4, 3, 2,4]);

        //防作弊
        this._playNode_gps = this.bg_node.getChildByName("play_gps");
        this.addListenerText(this._playNode_gps);
        this._playNode_gps.addEventListener(this.clickCB, this._playNode_gps);
        COMMON_UI.addHelpUI(this._playNode_gps);
        //数页
        this._playNode_shuye = _play.getChildByName("play_shuye");
        this.addListenerText(this._playNode_shuye);
        this._playNode_shuye.addEventListener(this.clickCB, this._playNode_shuye);

        //庄分1
        this._playNode_zhuangfen1 = _play.getChildByName("play_zhuangfen1");
        this.addListenerText(this._playNode_zhuangfen1);
        this._playNode_zhuangfen1.addEventListener(this.clickCB, this._playNode_zhuangfen1);

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

    },
    setPlayNodeCurrentSelect: function(isClub) {

        //人数
        var _countIdx;
        if(isClub){
            if (this.getBoolItem("convertible", false))
                _countIdx = 3;
            else
                _countIdx = [4, 3, 2].indexOf(this.getNumberItem("maxPlayer", 4));
        }else{
            _countIdx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_linfenyimenzi_count, 0);
        }
        this._playNode_player_count_radio.selectItem(_countIdx);
        this.radioBoxSelectCB(_countIdx, this._countlist[_countIdx], this._countlist);

        //防作弊
        var _gps;
        if(isClub)
            _gps = this.getBoolItem("gps", false);
        else
            _gps = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_linfenyimenzi_gps, false);
        this._playNode_gps.setSelected(_gps);
        var text = this._playNode_gps.getChildByName("text");
        this.selectedCB(text, _gps);


        //数页
        var _shuye;
        if(isClub)
            _shuye = this.getBoolItem("shuye", false);
        else
            _shuye = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_linfenyimenzi_shuye, false);
        this._playNode_shuye.setSelected(_shuye);
        var text = this._playNode_shuye.getChildByName("text");
        this.selectedCB(text, _shuye);


        //庄分1
        var _zhuangfen1;
        if(isClub)
            _zhuangfen1 = this.getBoolItem("zhuangfen1", false);
        else
            _zhuangfen1 = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_linfenyimenzi_zhuangfen1, false);
        this._playNode_zhuangfen1.setSelected(_zhuangfen1);
        var text = this._playNode_zhuangfen1.getChildByName("text");
        this.selectedCB(text, _zhuangfen1);


        //杠随胡走
        var _gangsui;
        if(isClub)
            _gangsui = this.getBoolItem("gangsui", true);
        else
            _gangsui = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_linfenyimenzi_gangsui, true);
        this._playNode_gangsui.setSelected(_gangsui);
        var text = this._playNode_gangsui.getChildByName("text");
        this.selectedCB(text, _gangsui);


        //轮庄
        var _lunzhuang;
        if(isClub)
            _lunzhuang = this.getBoolItem("lunzhuang", true);
        else
            _lunzhuang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_linfenyimenzi_lunzhuang, true);
        this._playNode_lunzhuang.setSelected(_lunzhuang);
        var text = this._playNode_lunzhuang.getChildByName("text");
        this.selectedCB(text, _lunzhuang);


        //底分
        var _idx;
        var _fenshu = [1,2,3,4,5,10,20,50,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9];
        if(isClub)
            _idx = _fenshu.indexOf(this.getNumberItem("difen", 1));
        else
            _idx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_linfenyimenzi_difen, 0);
        this._zhuIdx = (_fenshu.length + _idx)%_fenshu.length;
        this._ZhuNum.setString(_fenshu[this._zhuIdx]);
        this.changePayForPlayerNum();
    },
    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.LIN_FEN_YI_MEN_ZI;
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

        //数页
        para.shuye = this._playNode_shuye.isSelected();

        //庄分1
        para.zhuangfen1 = this._playNode_zhuangfen1.isSelected();

        //杠随胡走
        para.gangsui = this._playNode_gangsui.isSelected();

        //轮庄
        para.lunzhuang = this._playNode_lunzhuang.isSelected();

        //底分默认1
        para.difen = this._ZhuNum.getString();

        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_linfenyimenzi_count, _countIdx);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_linfenyimenzi_gps, para.gps);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_linfenyimenzi_shuye, para.shuye);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_linfenyimenzi_zhuangfen1, para.zhuangfen1);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_linfenyimenzi_gangsui, para.gangsui);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_linfenyimenzi_lunzhuang, para.lunzhuang);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_linfenyimenzi_difen, Number(this._zhuIdx));
        }
        cc.log("linfenyimenzi createara: " + JSON.stringify(para));
        return para;
    }
});