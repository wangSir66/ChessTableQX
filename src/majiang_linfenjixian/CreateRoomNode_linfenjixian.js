/**
 * Created by Tom on 2018/4/8.
 */


var CreateRoomNode_linfenjixian = CreateRoomNode.extend({
    setKey:function(){
        this.localStorageKey.KEY_linfenjixian_difen           = "_LIN_FEN_JI_XIAN_DI_FEN";     //增分
        this.localStorageKey.KEY_linfenjixian_count           = "_LIN_FEN_JI_XIAN_COUNT";      //人数
        this.localStorageKey.KEY_linfenjixian_gps             = "_LIN_FEN_JI_XIAN_GPS";        //防作弊
        this.localStorageKey.KEY_linfenjixian_jiazhang        = "_LIN_FEN_JI_XIAN_JIA_ZHANG";   //1928夹张
        this.localStorageKey.KEY_linfenjixian_sanmen          = "_LIN_FEN_JI_XIAN_SAN_MEN";    //三门要公
        this.localStorageKey.KEY_linfenjixian_special         = "_LIN_FEN_JI_XIAN_SPECIAL";    //119/228/199/288夹
        this.localStorageKey.KEY_linfenjixian_gangsui         = "_LIN_FEN_JI_XIAN_GANG_SUI";   //杠随胡走
    },
    initAll:function(IsFriendCard)
    {
        if (!IsFriendCard)
            this.setKey();
        this.bg_node = ccs.load("bg_linfenjixian.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_linfenjixian");
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

        //防作弊
        this._playNode_gps = this.bg_node.getChildByName("play_gps");
        this.addListenerText(this._playNode_gps);
        this._playNode_gps.addEventListener(this.clickCB, this._playNode_gps);
        COMMON_UI.addHelpUI(this._playNode_gps);

        //玩法1928夹张
        this._playNode_jiazhang = _play.getChildByName("play_jiazhang");
        var nodePlayTypeList = [];
        nodePlayTypeList.push(this._playNode_jiazhang);
        this._playNode_PlayType_radio = createRadioBoxForCheckBoxs(nodePlayTypeList, function(index){
            this.radioBoxSelectCB(index, this._playNode_PlayType_radio, nodePlayTypeList);
        }.bind(this));
        this.gameList = nodePlayTypeList;


        //三门要公
        this._playNode_sanmen = _play.getChildByName("play_sanmen");
        this.addListenerText(this._playNode_sanmen);
        this._playNode_sanmen.addEventListener(this.clickCB, this._playNode_sanmen);

        //119/228/199/288夹
        this._playNode_special = _play.getChildByName("play_special");
        this.addListenerText(this._playNode_special);
        this._playNode_special.addEventListener(this.clickCB, this._playNode_special);

        //杠随胡走
        this._playNode_gangsui = _play.getChildByName("play_gangsui");
        this.addListenerText(this._playNode_gangsui);
        this._playNode_gangsui.addEventListener(this.clickCB, this._playNode_gangsui);

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


        //人数
        this._playNode_maxPlayer0 = _play.getChildByName("play_count0");
        this._playNode_maxPlayer1 = _play.getChildByName("play_count1");
        this._playNode_maxPlayer2 = _play.getChildByName("play_count2");
        this._playNode_maxPlayer3 = _play.getChildByName("play_count3");
        var nodeCountList = [];
        nodeCountList.push(_play.getChildByName("play_count0"));
        nodeCountList.push(_play.getChildByName("play_count1"));
        nodeCountList.push(_play.getChildByName("play_count2"));
        nodeCountList.push(_play.getChildByName("play_count3"));
        this._playNode_player_count_radio = createRadioBoxForCheckBoxs(nodeCountList, function(index){
            this.changePayForPlayerNum(index);
            this.radioBoxSelectCB(index, nodeCountList[index], nodeCountList);
        }.bind(this));
        this.addListenerText(nodeCountList, this._playNode_player_count_radio,this.changePayForPlayerNum.bind(this));
        this._countlist = nodeCountList;
        this.initPlayNumNode(nodeCountList, [4, 3, 2, 4]);
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
            _currentCount = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_linfenjixian_count, 0);
        this._playNode_player_count_radio.selectItem(_currentCount);
        this.radioBoxSelectCB(_currentCount, this._countlist[_currentCount], this._countlist);


        //防作弊
        var _gps;
        if(isClub)
            _gps = this.getBoolItem("gps", false);
        else
            _gps = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_linfenjixian_gps, false);
        this._playNode_gps.setSelected(_gps);
        var text = this._playNode_gps.getChildByName("text");
        this.selectedCB(text, _gps);


        //1928夹张
        var _jiazhang;
        if(isClub)
            _jiazhang = this.getBoolItem("jiazhang", true);
        else
            _jiazhang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_linfenjixian_jiazhang, true);
        this._playNode_jiazhang.setSelected(_jiazhang);
        var text = this._playNode_jiazhang.getChildByName("text");
        this.selectedCB(text, _jiazhang);


        //三门要公
        var _sanmen;
        if(isClub)
            _sanmen = this.getBoolItem("sanmen", true);
        else
            _sanmen = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_linfenjixian_sanmen, true);
        this._playNode_sanmen.setSelected(_sanmen);
        var text = this._playNode_sanmen.getChildByName("text");
        this.selectedCB(text, _sanmen);


        //119/228/199/288夹
        var _special;
        if(isClub)
            _special = this.getBoolItem("special", true);
        else
            _special = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_linfenjixian_special, true);
        this._playNode_special.setSelected(_special);
        var text = this._playNode_special.getChildByName("text");
        this.selectedCB(text, _special);


        //杠随胡走
        var _gangsui;
        if(isClub)
            _gangsui = this.getBoolItem("gangsui", true);
        else
            _gangsui = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_linfenjixian_gangsui, true);
        this._playNode_gangsui.setSelected(_gangsui);
        var text = this._playNode_gangsui.getChildByName("text");
        this.selectedCB(text, _gangsui);


        //底分
        var _idx;
        var _fenshu = [1,2,3,4,5,10,20,50];
        if(isClub)
            _idx = _fenshu.indexOf(this.getNumberItem("difen", 1));
        else
            _idx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_linfenjixian_difen, 0);
        this._zhuIdx = (_fenshu.length + _idx)%_fenshu.length;

        this._ZhuNum.setString(_fenshu[this._zhuIdx]);
        this.changePayForPlayerNum();
    },
    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.JI_XIAN_1928_JIA_ZHANG;
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

        //1928夹张
        para.jiazhang = this._playNode_jiazhang.isSelected();

        //三门要公
        para.sanmen = this._playNode_sanmen.isSelected();

        //119/228/199/288夹
        para.special = this._playNode_special.isSelected();

        //杠随胡走
        para.gangsui = this._playNode_gangsui.isSelected();

        //底分默认1
        para.difen = this._ZhuNum.getString();

        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_linfenjixian_count, _countIdx);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_linfenjixian_gps, para.gps);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_linfenjixian_jiazhang, para.jiazhang);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_linfenjixian_sanmen, para.sanmen);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_linfenjixian_special, para.special);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_linfenjixian_gangsui, para.gangsui);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_linfenjixian_difen, Number(this._zhuIdx));
        }
        cc.log("LinFen_Ji_Xian_createara: " + JSON.stringify(para));
        return para;
    }
});