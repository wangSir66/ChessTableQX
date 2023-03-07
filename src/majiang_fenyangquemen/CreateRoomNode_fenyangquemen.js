/**
 */


var CreateRoomNode_fenyangquemen = CreateRoomNode.extend({
    setKey:function(){
        this.localStorageKey.KEY_fenyangquemen_difen      = "_FEN_YANG_QUE_MEN_DI_FEN";     //增分
        this.localStorageKey.KEY_fenyangquemen_count      = "_FEN_YANG_QUE_MEN_COUNT"; //人数
        this.localStorageKey.KEY_fenyangquemen_gps      = "_FEN_YANG_QUE_MEN_GPS"; //防作弊
        this.localStorageKey.KEY_fenyangquemen_13yao      = "_FEN_YANG_QUE_MEN_13_yao"; //13yao
        this.localStorageKey.KEY_fenyangquemen_baoting      = "_FEN_YANG_QUE_MEN_BAO_TING"; //游戏类型
        this.localStorageKey.KEY_fenyangquemen_sanhuafeigang     = "_FEN_YANG_QUE_MEN_SAN_HUA_FEI_GANG"; 
        this.localStorageKey.KEY_fenyangquemen_lunzhuang     = "_FEN_YANG_QUE_MEN_LUN_ZHUANG"; 
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
            _currentCount = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_fenyangquemen_count, 0);
        this._playNode_player_count_radio.selectItem(_currentCount);
        this.radioBoxSelectCB(_currentCount, this._countlist[_currentCount], this._countlist);


        //底分
        var _fenshu = [1,2,3,4,5,10,20,50];
        var _idx;
        if (isClub) {
            _idx = this.getNumberItem("difen", 1);
            _idx = _fenshu.indexOf( parseInt(_idx) );
        }else
            _idx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_fenyangquemen_difen, 0);
        this._zhuIdx = (_fenshu.length + _idx)%_fenshu.length;
        this._ZhuNum.setString(_fenshu[this._zhuIdx]);

        //防作弊
        var _gps;
        if (isClub)
            _gps = this.getBoolItem("gps", false);
        else
            _gps = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_fenyangquemen_gps, false);
        this._playNode_gps.setSelected(_gps);
        var text = this._playNode_gps.getChildByName("text");
        this.selectedCB(text, _gps);

        // 13yao
        var _13yao;
        if (isClub)
            _13yao = this.getBoolItem("shisanyao", true);
        else
            _13yao = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_fenyangquemen_13yao, true);
        this._playNode_13yao.setSelected(_13yao);
        var text = this._playNode_13yao.getChildByName("text");
        this.selectedCB(text, _13yao);

        //玩法
        var _baoting;
        if (isClub) {
            _baoting = this.getNumberItem("baoting", 0);
        }
        else
            _baoting = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_fenyangquemen_baoting, 0);
        this._playNode_play_type_radio.selectItem(_baoting);
        this.radioBoxSelectCB(_baoting, this._gameTypelist[_baoting], this._gameTypelist);
        this.showPlayType(_baoting);

        //轮庄
        var _lunzhuang;
        if (isClub) {
            _lunzhuang = this.getBoolItem("lunzhuang", true);
        }
        else
            _lunzhuang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_fenyangquemen_lunzhuang, true);
        this._playNode_lunzhuang.setSelected(_lunzhuang);
        var text = this._playNode_lunzhuang.getChildByName("text");
        this.selectedCB(text, _lunzhuang);



        //
        var _sanhuafeigang;
        if (isClub)
            _sanhuafeigang = this.getBoolItem("sanhuafeigang", false);
        else
            _sanhuafeigang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_fenyangquemen_sanhuafeigang,false);
        this._playNode_sanhuafeigang.setSelected(_sanhuafeigang);
        var text = this._playNode_sanhuafeigang.getChildByName("text");
        this.selectedCB(text, _sanhuafeigang);


        this.changePayForPlayerNum();
    },
    initAll:function(IsFriendCard)
    {
        if (!IsFriendCard)
            this.setKey();

        this.bg_node = ccs.load("bg_fenyangquemen.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_fenyangquemen");
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

        //防作弊
        this._playNode_gps = this.bg_node.getChildByName("play_gps");
        this.addListenerText(this._playNode_gps);
        this._playNode_gps.addEventListener(this.clickCB, this._playNode_gps);
        COMMON_UI.addHelpUI(this._playNode_gps);

        //13yao
        this._playNode_13yao = _play.getChildByName("play_shisanyao");
        this.addListenerText(this._playNode_13yao);
        this._playNode_13yao.addEventListener(this.clickCB, this._playNode_13yao);

        //轮庄
        this._playNode_lunzhuang = _play.getChildByName("play_lunzhuang");
        this.addListenerText(this._playNode_lunzhuang);
        this._playNode_lunzhuang.addEventListener(this.clickCB, this._playNode_lunzhuang);

        //
        this._playNode_sanhuafeigang = _play.getChildByName("play_sanhuafeigang");
        this.addListenerText(this._playNode_sanhuafeigang);
        this._playNode_sanhuafeigang.addEventListener(this.clickCB, this._playNode_sanhuafeigang);

        //玩法
        this._playNode_gameType0 = _play.getChildByName("play_type0");
        this._playNode_gameType1 = _play.getChildByName("play_type1");
        //this._playNode_gameType1.setVisible(false);//暂时屏蔽半摸玩法
        var nodeGameTypeList1 = [];
        nodeGameTypeList1.push(_play.getChildByName("play_type0"));
        nodeGameTypeList1.push(_play.getChildByName("play_type1"));
        this._playNode_play_type_radio = createRadioBoxForCheckBoxs(nodeGameTypeList1, function(index) {
            this.showPlayType(index);
            this.radioBoxSelectCB(index, nodeGameTypeList1[index], nodeGameTypeList1)
        }.bind(this));
        this.addListenerText(nodeGameTypeList1, this._playNode_play_type_radio, this.showPlayType.bind(this));
        this._gameTypelist = nodeGameTypeList1;

    },
    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.FEN_YANG_QUE_MEN;
        para.maxPlayer = 4;
        //para.flowerType = WithFlowerType.noFlower;
        para.difen = 1;
        para.shisanyao = false;
        para.sanhuafeigang = false;
        para.baoTing = true;
        para.lunzhuang = false;
        para.convertible = false;//是否自由人数
        //para.gps = !!this._bGPS.isSelected();
        // if(this._nodeGPS) para.gps = this.._nodeGPSisSelected()

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

        //玩法
        var _gameTypeIdx = 0;
        if (this._playNode_gameType0.isSelected()) {
            para.baoTing = true;
            _gameTypeIdx = 0;
        }
        else if (this._playNode_gameType1.isSelected()) {
            para.baoTing = false;
            _gameTypeIdx = 1;
        }


        //底分默认1
        para.difen = this._ZhuNum.getString();

        //防作弊
        para.gps = this._playNode_gps.isSelected();

        // 13yao
        para.shisanyao = this._playNode_13yao.isSelected();

        // 轮庄
        para.lunzhuang = this._playNode_lunzhuang.isSelected();

        // 
        para.sanhuafeigang = this._playNode_sanhuafeigang.isSelected();

        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_fenyangquemen_count, _countIdx)
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_fenyangquemen_baoting, _gameTypeIdx);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_fenyangquemen_difen, Number(this._zhuIdx));
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_fenyangquemen_gps,  para.gps);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_fenyangquemen_13yao,  para.shisanyao);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_fenyangquemen_sanhuafeigang,  para.sanhuafeigang);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_fenyangquemen_lunzhuang,  para.lunzhuang);
        }
        cc.log("createara: " + JSON.stringify(para));
        return para;
    },
    showPlayType:function (index)
    {
        //创建房间提示语，0传统模式，1财神选项
        //this._playNode_longpaihu.visible = false;
        if (index == 0)//选择灵石半摸时显示
        {
            //this._playNode_longpaihu.visible = true;
        }
    }
});