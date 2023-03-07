/**
 * Created by Tom on 2018/5/18.
 */


var CreateRoomNode_fanshixiayu = CreateRoomNode.extend({
    setKey:function(){
        this.localStorageKey.KEY_fanshixiayu_count          = "_FAN_SHI_XIA_YU_COUNT";          //人数
        this.localStorageKey.KEY_fanshixiayu_difen          = "_FAN_SHI_XIA_YU_DI_FEN";         //底分
        this.localStorageKey.KEY_fanshixiayu_gps            = "_FAN_SHI_XIA_YU_GPS";            //防作弊
        this.localStorageKey.KEY_fanshixiayu_type           = "_FAN_SHI_XIA_YU_TYPE";          //游戏类型
        this.localStorageKey.KEY_fanshixiayu_lunzhuang      = "_FAN_SHI_XIA_YU_LUN_ZHUANG";     //轮庄
        this.localStorageKey.KEY_fanshixiayu_dianpao        = "_FAN_SHI_XIA_YU_DIAN_PAO";       //点炮包杠
        this.localStorageKey.KEY_fanshixiayu_huangzhuang    = "_FAN_SHI_XIA_YU_HUANG_ZHUANG";   //荒庄不荒杠
        this.localStorageKey.KEY_fanshixiayu_zhuangjia      = "_FAN_SHI_XIA_YU_ZHUANG_JIA";     //庄家加一分
        this.localStorageKey.KEY_fanshixiayu_tiandihu       = "_FAN_SHI_XIA_YU_TIAN_DI_HU";     //天地胡
        this.localStorageKey.KEY_fanshixiayu_dasixi         = "_FAN_SHI_XIA_YU_DA_SI_XI";     //大四喜
    },
    initAll:function(IsFriendCard)
    {
        if (!IsFriendCard)
            this.setKey();

        this.bg_node = ccs.load("bg_fanshixiayu.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_fanshixiayu");
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

        // 人数
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



        // 底分
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
                this.setRoomCardModeFree(_fenshu[this._zhuIdx]);
            }
        }, this);
        this._Button_add = this.playScroll.getChildByName("btn_add");
        this._Button_add.addTouchEventListener(function(sender, type) {
            if (type == 2) {
                this._zhuIdx = (_arrayLenth + ++this._zhuIdx)%_arrayLenth;
                this._ZhuNum.setString(_fenshu[this._zhuIdx]);
                this.setRoomCardModeFree(_fenshu[this._zhuIdx]);
            }
        }, this);



        // 防作弊
        this._playNode_gps = this.bg_node.getChildByName("play_gps");
        this.addListenerText(this._playNode_gps);
        this._playNode_gps.addEventListener(this.clickCB, this._playNode_gps);
        COMMON_UI.addHelpUI(this._playNode_gps);


        // 玩法   0:大胡   1:小胡
        this._playNode_gameType0 = _play.getChildByName("play_type0");
        this._playNode_gameType1 = _play.getChildByName("play_type1");
        var nodeGameTypeList = [];
        nodeGameTypeList.push(_play.getChildByName("play_type0"));
        nodeGameTypeList.push(_play.getChildByName("play_type1"));
        // this._playNode_play_type_radio = createRadioBoxForCheckBoxs(nodeGameTypeList, this.radioBoxSelectCB);
        this._playNode_play_type_radio = createRadioBoxForCheckBoxs(nodeGameTypeList, function(index) {
            this.showPlayType(index);
            this.radioBoxSelectCB(index, nodeGameTypeList[index], nodeGameTypeList)
        }.bind(this));
        this.addListenerText(nodeGameTypeList, this._playNode_play_type_radio, this.showPlayType.bind(this));
        this._gameTypelist = nodeGameTypeList;



        // 轮庄
        this._playNode_lunzhuang = _play.getChildByName("play_lunzhuang");
        this.addListenerText(this._playNode_lunzhuang);
        this._playNode_lunzhuang.addEventListener(this.clickCB, this._playNode_lunzhuang);



        // 点炮包胡
        this._playNode_dianpao = _play.getChildByName("play_dianpao");
        this.addListenerText(this._playNode_dianpao);
        this._playNode_dianpao.addEventListener(this.clickCB, this._playNode_dianpao);



        // 荒庄不荒杠
        this._playNode_huangzhuang = _play.getChildByName("play_huangzhuang");
        this.addListenerText(this._playNode_huangzhuang);
        this._playNode_huangzhuang.addEventListener(this.clickCB, this._playNode_huangzhuang);



        // 庄家加一分
        this._playNode_zhuangjia = _play.getChildByName("play_zhuangjia");
        this.addListenerText(this._playNode_zhuangjia);
        this._playNode_zhuangjia.addEventListener(this.clickCB, this._playNode_zhuangjia);



        // 天地胡
        this._playNode_tiandihu = _play.getChildByName("play_tiandihu");
        this.addListenerText(this._playNode_tiandihu);
        this._playNode_tiandihu.addEventListener(this.clickCB, this._playNode_tiandihu);



        // 大四喜
        this._playNode_dasixi = _play.getChildByName("play_dasixi");
        this.addListenerText(this._playNode_dasixi);
        this._playNode_dasixi.addEventListener(this.clickCB, this._playNode_dasixi);

    },
    setPlayNodeCurrentSelect: function(isClub) {

        // 人数
        var _currentCount;
        if (isClub) {
            if (this.getBoolItem("convertible", false))
                _currentCount = 3;
            else
                _currentCount = [4, 3, 2].indexOf(this.getNumberItem("maxPlayer", 4));
        }
        else
            _currentCount = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_fanshixiayu_count, 0);
        this._playNode_player_count_radio.selectItem(_currentCount);
        this.radioBoxSelectCB(_currentCount, this._countlist[_currentCount], this._countlist);



        // 底分
        var _fenshu = [1,2,3,4,5,10,20,50,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9];
        var _idx;
        if (isClub) {
            _idx = this.getNumberItem("difen", 1);
            _idx = _fenshu.indexOf(parseInt(_idx));
        }else
            _idx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_fanshixiayu_difen, 0);
        this._zhuIdx = (_fenshu.length + _idx)%_fenshu.length;
        this._ZhuNum.setString(_fenshu[this._zhuIdx]);



        // 防作弊
        var _gps;
        if (isClub)
            _gps = this.getBoolItem("gps", false);
        else
            _gps = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_fanshixiayu_gps, false);
        this._playNode_gps.setSelected(_gps);
        var text = this._playNode_gps.getChildByName("text");
        this.selectedCB(text, _gps);



        //玩法   0：大胡   1：小胡
        var _currentGameType;
        if (isClub) {
            _currentGameType = this.getNumberItem("type", 0);
        }
        else
            _currentGameType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_fanshixiayu_type, 0);
        this._playNode_play_type_radio.selectItem(_currentGameType);
        this.radioBoxSelectCB(_currentGameType, this._gameTypelist[_currentGameType], this._gameTypelist);
        this.showPlayType(_currentGameType);



        // 轮庄
        var _lunzhuang;
        if (isClub)
            _lunzhuang = this.getBoolItem("lunzhuang", false);
        else
            _lunzhuang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_fanshixiayu_lunzhuang, false);
        this._playNode_lunzhuang.setSelected(_lunzhuang);
        var text = this._playNode_lunzhuang.getChildByName("text");
        this.selectedCB(text, _lunzhuang);



        // 点炮包胡
        var _dianpao;
        if (isClub)
            _dianpao = this.getBoolItem("dianpao", false);
        else
            _dianpao = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_fanshixiayu_dianpao, false);
        this._playNode_dianpao.setSelected(_dianpao);
        var text = this._playNode_dianpao.getChildByName("text");
        this.selectedCB(text, _dianpao);



        // 荒庄不荒杠
        var _huangzhuang;
        if (isClub)
            _huangzhuang = this.getBoolItem("huangzhuang", false);
        else
            _huangzhuang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_fanshixiayu_huangzhuang, false);
        this._playNode_huangzhuang.setSelected(_huangzhuang);
        var text = this._playNode_huangzhuang.getChildByName("text");
        this.selectedCB(text, _huangzhuang);



        // 庄家加1分
        var _zhuangjia;
        if (isClub)
            _zhuangjia = this.getBoolItem("zhuangjiajia1", false);
        else
            _zhuangjia = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_fanshixiayu_zhuangjia, false);
        this._playNode_zhuangjia.setSelected(_zhuangjia);
        var text = this._playNode_zhuangjia.getChildByName("text");
        this.selectedCB(text, _zhuangjia);



        // 天地胡
        var _tiandihu;
        if (isClub)
            _tiandihu = this.getBoolItem("isTiandihu", true);
        else
            _tiandihu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_fanshixiayu_tiandihu, true);
        this._playNode_tiandihu.setSelected(_tiandihu);
        var text = this._playNode_tiandihu.getChildByName("text");
        this.selectedCB(text, _tiandihu);



        // 大四喜
        var _dasixi;
        if (isClub)
            _dasixi = this.getBoolItem("isDasixi", true);
        else
            _dasixi = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_fanshixiayu_dasixi, true);
        this._playNode_dasixi.setSelected(_dasixi);
        var text = this._playNode_dasixi.getChildByName("text");
        this.selectedCB(text, _dasixi);


        this.changePayForPlayerNum();
    },
    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.FAN_SHI_XIA_YU;
        para.maxPlayer = 4;
        para.difen = 1;
        para.type = 0;
        para.lunzhuang = false;
        para.dianpao = false;
        para.huangzhuang = false;
        para.zhuangjiajia1 = false;
        para.convertible = false;//是否自由人数

        // 人数
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


        // 玩法
        var _gameTypeIdx = 0;
        if (this._playNode_gameType0.isSelected()) {
            _gameTypeIdx = 0;
            // 大四喜
            para.isDasixi = this._playNode_dasixi.isSelected();
            if (!this._isFriendCard) {
                util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_fanshixiayu_dasixi, para.isDasixi);
            }
        }
        else if (this._playNode_gameType1.isSelected()) {
            // 大四喜
            para.isDasixi = false;
            _gameTypeIdx = 1;
        }
        para.type = _gameTypeIdx;

        // 底分默认1
        para.difen = this._ZhuNum.getString();


        // 点炮包胡
        para.dianpao = this._playNode_dianpao.isSelected();


        // 荒庄不荒杠
        para.huangzhuang = this._playNode_huangzhuang.isSelected();


        // 防作弊
        para.gps = this._playNode_gps.isSelected();


        // 庄家加1分
        para.zhuangjiajia1 = this._playNode_zhuangjia.isSelected();


        // 天地胡
        para.isTiandihu = this._playNode_tiandihu.isSelected();


        // 轮庄
        para.lunzhuang = this._playNode_lunzhuang.isSelected();

        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_fanshixiayu_count, _countIdx);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_fanshixiayu_type, para.type);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_fanshixiayu_difen, Number(this._zhuIdx));
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_fanshixiayu_dianpao, para.dianpao);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_fanshixiayu_huangzhuang, para.huangzhuang);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_fanshixiayu_gps, para.gps);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_fanshixiayu_zhuangjia, para.zhuangjiajia1);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_fanshixiayu_tiandihu, para.isTiandihu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_fanshixiayu_lunzhuang, para.lunzhuang);
        }
        cc.log("FanShiXiaYu  createara: " + JSON.stringify(para));
        return para;
    },
    showPlayType:function (index)
    {
        // 玩法   0:大胡   1:小胡
        this._playNode_dasixi.setVisible(true);
        if (index == 1)//选择小胡时显示
        {
            this._playNode_dasixi.setVisible(false);
        }

    }
});