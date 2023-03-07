/**
 * Created by maoyu on 2017/7/21.
 */


var CreateRoomNode_jinzhong = CreateRoomNode.extend({
    setKey:function(){
        this.localStorageKey.KEY_jinzhong_duo               = "_JIN_ZHONG_DUO";                 //DUO
        this.localStorageKey.KEY_jinzhong_difen             = "_JIN_ZHONG_DI_FEN";              //增分
        this.localStorageKey.KEY_jinzhong_count             = "_JIN_ZHONG_COUNT";               //人数
        this.localStorageKey.KEY_jinzhong_liuduo            = "_JIN_ZHONG_LIU_DUO";             //留垛
        this.localStorageKey.KEY_jinzhong_lunzhuang         = "_JIN_ZHONG_LUN_ZHUANG";          //轮庄
        this.localStorageKey.KEY_jinzhong_gps               = "_JIN_ZHONG_GPS";                 //防作弊
        this.localStorageKey.KEY_jinzhong_13yao             = "_JIN_ZHONG_13_yao";              //13yao
        this.localStorageKey.KEY_jinzhong_dianpaobaogang    = "_JIN_ZHONG_dianpaobaogang";      //点炮包杠
        this.localStorageKey.KEY_jinzhong_gameType          = "_JIN_ZHONG_gameType";            //游戏类型
        this.localStorageKey.KEY_jinzhong_longpaihu         = "_JIN_ZHONG_LONG_PAI_HU";         //过胡只能胡龙牌
        this.localStorageKey.KEY_jinzhong_passhudapai       = "_JIN_ZHONG_PASS_HU_DA_PAI";      //过胡胡大牌
        this.localStorageKey.KEY_jinzhong_autohu            = "_JIN_ZHONG_AUTO_HU";             //叫听自动胡
        this.localStorageKey.KEY_jinzhong_68                = "_JIN_ZHONG_68";
    },
    setPlayNodeCurrentSelect: function(isClub) {

        // 留朵
        var _liuduo;
        if (isClub)
            _liuduo = this.getBoolItem("liuduo", false);
        else
            _liuduo = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_jinzhong_liuduo, true);
        this._playNode_liuduo.setSelected(_liuduo);
        var text = this._playNode_liuduo.getChildByName("text");
        this.selectedCB(text, _liuduo);


        //68张
        var _is68;
        if (isClub)
            _is68 = this.getBoolItem("is68", false);
        else
            _is68 = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_jinzhong_68,false);

        var isShow = _is68 && !_liuduo;
        this._playNode_68.setSelected(isShow);
        var text = this._playNode_68.getChildByName("text");
        this.selectedCB(text, isShow);


        // 轮庄
        var _lunzhuang;
        if (isClub)
            _lunzhuang = this.getBoolItem("lunzhuang", false);
        else
            _lunzhuang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_jinzhong_lunzhuang, true);
        this._playNode_lunzhuang.setSelected(_lunzhuang);
        var text = this._playNode_lunzhuang.getChildByName("text");
        this.selectedCB(text, _lunzhuang);


        //人数
        var _currentCount;
        if (isClub) {
            if (this.getBoolItem("convertible", false))
                _currentCount = 3;
            else
                _currentCount = [4, 3, 2].indexOf(this.getNumberItem("maxPlayer", 4));
        }
        else
            _currentCount = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_jinzhong_count, 0);
        this._playNode_player_count_radio.selectItem(_currentCount);
        this.radioBoxSelectCB(_currentCount, this._countlist[_currentCount], this._countlist);

        if(_currentCount == 2)
            this._playNode_68.visible = true;
        else
            this._playNode_68.visible = false;



        //底分
        var _fenshu = [1,2,3,4,5,10,20,50,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9];
        var _idx;
        if (isClub) {
            _idx = this.getNumberItem("difen", 1);
            _idx = _fenshu.indexOf( parseInt(_idx) );
        }else
            _idx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_jinzhong_difen, 0);
        this._zhuIdx = (_fenshu.length + _idx)%_fenshu.length;
        this._ZhuNum.setString(_fenshu[this._zhuIdx]);

        //防作弊
        var _gps;
        if (isClub)
            _gps = this.getBoolItem("gps", false);
        else
            _gps = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_jinzhong_gps, false);
        this._playNode_gps.setSelected(_gps);
        var text = this._playNode_gps.getChildByName("text");
        this.selectedCB(text, _gps);

        // 13yao
        var _13yao;
        if (isClub)
            _13yao = this.getBoolItem("shisanyao", false);
        else
            _13yao = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_jinzhong_13yao, true);
        this._playNode_13yao.setSelected(_13yao);
        var text = this._playNode_13yao.getChildByName("text");
        this.selectedCB(text, _13yao);

        //点炮包杠
        var _dianpaobaogang;
        if (isClub)
            _dianpaobaogang = this.getBoolItem("baogang", false);
        else
            _dianpaobaogang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_jinzhong_dianpaobaogang, true);
        this._playNode_baogang.setSelected(_dianpaobaogang);
        var text = this._playNode_baogang.getChildByName("text");
        this.selectedCB(text, _dianpaobaogang);

        //玩法
        var _currentGameType;
        if (isClub) {
            _currentGameType = this.getNumberItem("gameType", 0);
            if (_currentGameType == MjClient.GAME_TYPE.JIN_ZHONG_CAI_SHEN) _currentGameType = 1;
            else _currentGameType = 0;
        }
        else
            _currentGameType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_jinzhong_gameType, 0);
        cc.log("_currentGameType== " + _currentGameType);
        this._playNode_play_type_radio.selectItem(_currentGameType);
        this.radioBoxSelectCB(_currentGameType, this._gameTypelist[_currentGameType], this._gameTypelist);
        this.showPlayType(_currentGameType);


        //过胡只能胡龙牌
        var _longpaihu;
        if (isClub)
            _longpaihu = this.getBoolItem("guohuzhinenglongpai", false);
        else
            _longpaihu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_jinzhong_longpaihu, false);
        this._playNode_longpaihu.setSelected(_longpaihu);
        var text = this._playNode_longpaihu.getChildByName("text");
        this.selectedCB(text, _longpaihu);

        //过胡胡大牌
        var _passhudapai;
        if (isClub)
            _passhudapai = this.getBoolItem("passhudapai", false);
        else
            _passhudapai = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_jinzhong_passhudapai, false);
        this._playNode_passhudapai.setSelected(_passhudapai);
        var text = this._playNode_passhudapai.getChildByName("text");
        this.selectedCB(text, _passhudapai);

        // 记录当前选择的过胡类型
        this.passHuType = null;
        if (this._playNode_longpaihu.isSelected()) {
            this.passHuType = this._playNode_longpaihu;
        }
        else if (this._playNode_passhudapai.isSelected()) {
            this.passHuType = this._playNode_passhudapai;
        }


        //叫听自动胡
        var _autoHu;
        if (isClub)
            _autoHu = this.getBoolItem("calltingautohu", false);
        else
            _autoHu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_jinzhong_autohu, false);
        this._playNode_autohu.setSelected(_autoHu);
        var text = this._playNode_autohu.getChildByName("text");
        this.selectedCB(text, _autoHu);


        this.changePayForPlayerNum(_currentCount);
    },
    initAll:function(IsFriendCard)
    {
        if (!IsFriendCard)
            this.setKey();

        this.bg_node = ccs.load("bg_jinzhong.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_jinzhong");
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
        var that = this;

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



        // 轮庄
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

        //防作弊
        this._playNode_gps = this.bg_node.getChildByName("play_gps");
        this.addListenerText(this._playNode_gps);
        this._playNode_gps.addEventListener(this.clickCB, this._playNode_gps);
        COMMON_UI.addHelpUI(this._playNode_gps);

        //13yao
        this._playNode_13yao = _play.getChildByName("play_13yao");
        this.addListenerText(this._playNode_13yao);
        this._playNode_13yao.addEventListener(this.clickCB, this._playNode_13yao);

        //点炮包杠
        this._playNode_baogang = _play.getChildByName("play_baogang");
        this.addListenerText(this._playNode_baogang);
        this._playNode_baogang.addEventListener(this.clickCB, this._playNode_baogang);

        //非龙牌过胡只能胡龙牌
        this._playNode_longpaihu = _play.getChildByName("play_longpaihu");
        //过胡胡大牌
        this._playNode_passhudapai = _play.getChildByName("play_passhudapai");
        var nodePassHuTypeList = [this._playNode_longpaihu, this._playNode_passhudapai];
        this._playNode_pass_hu_type_radio = createRadioBoxForCheckBoxs(nodePassHuTypeList, function(index) {
            this.showPassHuType(index);
            this.radioBoxSelectCB(index, nodePassHuTypeList[index], nodePassHuTypeList)
        }.bind(this));
        this.addListenerText(nodePassHuTypeList, this._playNode_pass_hu_type_radio, this.showPassHuType.bind(this));
        this._gamePassHuTypelist = nodePassHuTypeList;

        //叫听自动胡
        this._playNode_autohu = _play.getChildByName("play_autohu");
        function setNoPassHuDaPaiNode() {
            if (that.passHuType && that.passHuType == that._playNode_passhudapai) {
                that.passHuType = null;
            }
            that._playNode_passhudapai.setSelected(false);
            that.selectedCB(that._playNode_passhudapai.getChildByName("text"), false);
        }
        this.addListenerText(this._playNode_autohu, null, function(sender, type){
            setNoPassHuDaPaiNode();
        });
        this._playNode_autohu.addEventListener(function(sender,type){
            that.clickCB(sender,type);
            setNoPassHuDaPaiNode();
        }, this._playNode_autohu);


        //留朵
        function setLiuDuo(isSelected)
        {
            //如果选择2人 或者自由renshu
            if (that._playNode_maxPlayer2.isSelected() || that._playNode_maxPlayer3.isSelected()) {
                if(isSelected)
                {
                    that._playNode_68.setSelected(!isSelected);
                    that._playNode_68.getChildByName("text").setTextColor(CREATEROOM_COLOR_3);
                    that._playNode_liuduo.setSelected(isSelected);
                }
            }
        }
        this._playNode_liuduo = _play.getChildByName("play_liuduo");
        this.addListenerText(this._playNode_liuduo,null,function(sender,type){
            setLiuDuo(that._playNode_liuduo.isSelected());
        });
        this._playNode_liuduo.addEventListener(function(sender,type){
            setLiuDuo(that._playNode_liuduo.isSelected());
            that.clickCB(sender,type);
        }, this._playNode_liuduo);



        function set68(isSelected)
        {
            //如果选择2人 或者自由renshu
            if (that._playNode_maxPlayer2.isSelected() || that._playNode_maxPlayer3.isSelected()) {
                if(isSelected)
                {
                    that._playNode_68.setSelected(isSelected);
                    that._playNode_liuduo.setSelected(!isSelected);
                    that._playNode_liuduo.getChildByName("text").setTextColor(CREATEROOM_COLOR_3);
                }
            }
        }

        //68
        this._playNode_68 = _play.getChildByName("play_68");
        this.addListenerText(this._playNode_68,null,function(sender,type){
            set68(that._playNode_68.isSelected());
        });
        this._playNode_68.addEventListener(function(sender,type){
            that.clickCB(sender,type);
            set68(that._playNode_68.isSelected());
        }, this._playNode_68);



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
    changePayForPlayerNum:function(select_number)
    {
        if (select_number != null) {
            MjClient.MaxPlayerNum = 4 - select_number;
        }
        cc.log("create select_numberselect_numberselect_number sking -- by sking");
        if(select_number == 2 || select_number == 3)
            this._playNode_68.visible = true;
        else
            this._playNode_68.visible = false;
        this.setDiaNumData(this.bg_node);
    },
    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.JIN_ZHONG_MJ;
        para.maxPlayer = 4;
        //para.flowerType = WithFlowerType.noFlower;
        para.liuduo = true;
        para.difen = 1;
        para.lunzhuang = true;
        para.shisanyao = true;
        para.baogang = true;
        para.guohuzhinenglongpai = false;
        para.passhudapai = false;
        para.convertible = false;//是否自由人数
        para.is68 = false;//去否随机取68张
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
            para.gameType = MjClient.GAME_TYPE.JIN_ZHONG_MJ;
            _gameTypeIdx = 0;
        }
        else if (this._playNode_gameType1.isSelected()) {
            para.gameType = MjClient.GAME_TYPE.JIN_ZHONG_CAI_SHEN;
            _gameTypeIdx = 1;
        }



        // //留duo
        para.liuduo = this._playNode_liuduo.isSelected();

        // 轮庄
        para.lunzhuang = this._playNode_lunzhuang.isSelected();

        //底分默认1
        para.difen = this._ZhuNum.getString();

        //防作弊
        para.gps = this._playNode_gps.isSelected();

        // 13yao
        para.shisanyao = this._playNode_13yao.isSelected();

        // 点炮包杠
        para.baogang = this._playNode_baogang.isSelected();

        // 过胡只能胡龙牌
        para.guohuzhinenglongpai = this._playNode_longpaihu.isSelected();

        // 过胡胡大牌
        para.passhudapai = this._playNode_passhudapai.isSelected();

        // 叫听自动胡
        para.calltingautohu = this._playNode_autohu.isSelected();

        // 68
        para.is68 = this._playNode_68.visible && this._playNode_68.isSelected();


        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_jinzhong_count, _countIdx)
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_jinzhong_gameType, _gameTypeIdx);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_jinzhong_liuduo,  para.liuduo);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_jinzhong_lunzhuang,  para.lunzhuang);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_jinzhong_difen, Number(this._zhuIdx));
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_jinzhong_gps,  para.gps);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_jinzhong_13yao,  para.shisanyao);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_jinzhong_dianpaobaogang,  para.baogang);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_jinzhong_longpaihu,  para.guohuzhinenglongpai);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_jinzhong_passhudapai,  para.passhudapai);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_jinzhong_autohu,  para.calltingautohu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_jinzhong_68,  para.is68);
        }
        cc.log("createara: " + JSON.stringify(para));
        return para;
    },
    showPlayType: function (index)
    {
        //创建房间提示语，0传统模式，1财神选项
        //this._playNode_longpaihu.visible = false;
        if (index == 0)//选择灵石半摸时显示
        {
            //this._playNode_longpaihu.visible = true;
        }
    },
    showPassHuType: function (index)
    {
        var node = this._gamePassHuTypelist[index];
        if (this.passHuType != null && node == this.passHuType) {
            node.setSelected(false);
            this.selectedCB(node.getChildByName("text"), false);
            this.passHuType = null;
        }
        else {
            this.passHuType = node;
        }
        // 过胡胡大牌与叫听自动胡互斥
        if (index == 1) {
            this._playNode_autohu.setSelected(false);
            this.selectedCB(this._playNode_autohu.getChildByName("text"), false);
        }
    }
});