/**
 * Created by maoyu on 2017/7/21.
 */


var CreateRoomNode_shouyangqueka = CreateRoomNode.extend({
    setKey:function(){
        this.localStorageKey.KEY_shouyangqueka_duo        = "_SHOU_YANG_QUE_KA_DUO";  //DUO
        this.localStorageKey.KEY_shouyangqueka_difen      = "_SHOU_YANG_QUE_KA_DI_FEN";     //增分
        this.localStorageKey.KEY_shouyangqueka_count      = "_SHOU_YANG_QUE_KA_COUNT"; //人数
        this.localStorageKey.KEY_shouyangqueka_liuduo      = "_SHOU_YANG_QUE_KA_LIU_DUO"; //留垛
        this.localStorageKey.KEY_shouyangqueka_lunzhuang      = "_SHOU_YANG_QUE_KA_LUN_ZHUANG"; //轮庄
        this.localStorageKey.KEY_shouyangqueka_gps      = "_SHOU_YANG_QUE_KA_GPS"; //f防作弊
        this.localStorageKey.KEY_shouyangqueka_gameType          = "_SHOU_YANG_QUE_KA_GAME_TYPE";     //玩法
        this.localStorageKey.KEY_shouyangqueka_dianpaobaogang      = "_SHOU_YANG_QUE_KA_dianpaobaogang"; //点炮
    },
    initAll:function(IsFriendCard)
    {
        if (!IsFriendCard)
            this.setKey();

        this.bg_node = ccs.load("bg_shouyangqueka.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_shouyangqueka");
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


         //玩法
        this._playNode_gameType0 = _play.getChildByName("play_type_0");
        //this._playNode_gameType1 = _play.getChildByName("play_type1");
        //this._playNode_gameType1.setVisible(false);//暂时屏蔽半摸玩法
        var nodeGameTypeList1 = [];
        nodeGameTypeList1.push(_play.getChildByName("play_type_0"));
        //nodeGameTypeList1.push(_play.getChildByName("play_type1"));
        this._playNode_play_type_radio = createRadioBoxForCheckBoxs(nodeGameTypeList1, function(index) {
            this.showPlayType(index);
            this.radioBoxSelectCB(index, nodeGameTypeList1[index], nodeGameTypeList1)
        }.bind(this));
        this.addListenerText(nodeGameTypeList1, this._playNode_play_type_radio, this.showPlayType.bind(this));
        this._gameTypelist = nodeGameTypeList1;


        // //留朵
        this._playNode_liuduo = _play.getChildByName("play_liuduo");
        this.addListenerText(this._playNode_liuduo);
        this._playNode_liuduo.addEventListener(this.clickCB, this._playNode_liuduo);

         // //轮庄
        this._playNode_lunzhuang = _play.getChildByName("play_lunzhuang");
        this.addListenerText(this._playNode_lunzhuang);
        this._playNode_lunzhuang.addEventListener(this.clickCB, this._playNode_lunzhuang);

          // //防作弊
        this._playNode_gps = this.bg_node.getChildByName("play_gps");
        this.addListenerText(this._playNode_gps);
        this._playNode_gps.addEventListener(this.clickCB, this._playNode_gps);
        COMMON_UI.addHelpUI(this._playNode_gps);

        //底分
        this._zhuIdx = 0;//数组的引索
        var _fenshu = [1,2,3,4,5,6,7,8,9,10];
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

        //点炮包杠
        this._playNode_baogang = _play.getChildByName("play_baogang");
        this.addListenerText(this._playNode_baogang);
        this._playNode_baogang.addEventListener(this.clickCB, this._playNode_baogang);

    },
    setPlayNodeCurrentSelect: function(isClub) {

        //玩法
        var _gameType;
        if (isClub)
            _gameType = this.getNumberItem("gameType", 0);
        else
            _gameType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_shouyangqueka_gameType, 0);
        this._playNode_play_type_radio.selectItem(_gameType);
        this.radioBoxSelectCB(_gameType, this._gameTypelist[_gameType], this._gameTypelist);
        this.showPlayType(_gameType);

        // 留朵
        var _liuduo;
        if (isClub)
            _liuduo = this.getBoolItem("liuduo", true);
        else
            _liuduo = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_shouyangqueka_liuduo, true);
        this._playNode_liuduo.setSelected(_liuduo);
        var text = this._playNode_liuduo.getChildByName("text");
        this.selectedCB(text, _liuduo);

        // 轮庄
        var _lunzhuang;
        if (isClub)
            _lunzhuang = this.getBoolItem("lunzhuang", true);
        else
            _lunzhuang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_shouyangqueka_lunzhuang, true);
        this._playNode_lunzhuang.setSelected(_lunzhuang);
        var text = this._playNode_lunzhuang.getChildByName("text");
        this.selectedCB(text, _lunzhuang);

        // 人数
        var _currentCount;
        if (isClub) {
            if (this.getBoolItem("convertible", false))
                _currentCount = 3;
            else
                _currentCount = [4, 3, 2].indexOf(this.getNumberItem("maxPlayer", 4));
        }
        else
            _currentCount = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_shouyangqueka_count, 0);
        cc.log("_currentCount renshu  == " + _currentCount)
        this._playNode_player_count_radio.selectItem(_currentCount);
        this.radioBoxSelectCB(_currentCount, this._countlist[_currentCount], this._countlist);


        // 底分
        var _fenshu = [1,2,3,4,5,6,7,8,9,10];
        var _idx;
        if (isClub) {
            _idx = this.getNumberItem("difen", 1);
            _idx = _fenshu.indexOf( parseInt(_idx) );
        }else
            _idx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_shouyangqueka_difen, 0);
        this._zhuIdx = (_fenshu.length + _idx)%_fenshu.length;
        this._ZhuNum.setString(_fenshu[this._zhuIdx]);

        // 防作弊
        var _gps;
        if (isClub)
            _gps = this.getBoolItem("gps", false);
        else
            _gps = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_shouyangqueka_gps, false);
        this._playNode_gps.setSelected(_gps);
        var text = this._playNode_gps.getChildByName("text");
        this.selectedCB(text, _gps);

        // 点炮包杠
        var _dianpaobaogang;
        if (isClub)
            _dianpaobaogang = this.getBoolItem("baogang", false);
        else
            _dianpaobaogang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_shouyangqueka_dianpaobaogang, false);
        this._playNode_baogang.setSelected(_dianpaobaogang);
        var text = this._playNode_baogang.getChildByName("text");
        this.selectedCB(text, _dianpaobaogang);
        this.changePayForPlayerNum();
    },
    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.SHOU_YANG_QUE_KA;
        para.maxPlayer = 4;
        //para.flowerType = WithFlowerType.noFlower;
        para.liuduo = true;
        para.difen = 1;
        para.lunzhuang=true;
        para.baogang = true;
        para.convertible = false;//是否自由人数
        if(this._nodeGPS) para.gps = this._nodeGPS.isSelected(); // add by sking for creat room need gps


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
        var _gameTypeIdx =0;
        if (this._playNode_gameType0.isSelected()) {
            para.gameType = MjClient.GAME_TYPE.SHOU_YANG_QUE_KA;
            _gameTypeIdx = 0;
        }
/*        else if (this._playNode_gameType1.isSelected()) {
            para.gameType = MjClient.GAME_TYPE.SHOU_YANG_QUE_KA;
            _gameTypeIdx = 1;
        }*/


        // //留duo
        para.liuduo = this._playNode_liuduo.isSelected();


        // //轮庄
        para.lunzhuang = this._playNode_lunzhuang.isSelected();

        // //防作弊
        para.gps = this._playNode_gps.isSelected();

        //底分默认1
        para.difen = this._ZhuNum.getString();

        // 点炮包杠
        para.baogang = this._playNode_baogang.isSelected();

        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_shouyangqueka_count, _countIdx)
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_shouyangqueka_gameType, _gameTypeIdx);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_shouyangqueka_liuduo,  para.liuduo);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_shouyangqueka_lunzhuang,  para.lunzhuang);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_shouyangqueka_gps,  para.gps);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_shouyangqueka_difen, Number(this._zhuIdx));
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_shouyangqueka_dianpaobaogang,  para.baogang);
        }
        cc.log("createara: " + JSON.stringify(para));
        return para;
    },
    showPlayType:function (index)
    {
/*        //创建房间提示语，0为灵石编龙，1为灵石半摸
        this._textTip0.setVisible(true);
        this._textTip1.setVisible(false);
        if (index == 1)//选择灵石半摸时显示
        {
            this._textTip0.setVisible(false);
            this._textTip1.setVisible(true);
        }*/

    }
});