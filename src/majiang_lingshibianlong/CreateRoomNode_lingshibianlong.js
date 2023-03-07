/**
 * Created by maoyu on 2017/7/21.
 */


var CreateRoomNode_lingshibianlong = CreateRoomNode.extend({
    setKey:function(){
        this.localStorageKey.KEY_lingshibianlong_difen                  = "_LING_SHI_BIAN_LONG_DI_FEN";             //增分
        this.localStorageKey.KEY_lingshibianlong_count                  = "_LING_SHI_BIAN_LONG_COUNT";              //人数
        this.localStorageKey.KEY_lingshibianlong_gameType               = "_LING_SHI_BIAN_LONG_GAME_TYPE";          //玩法
        this.localStorageKey.KEY_lingshibianlong_liuduo                 = "_LING_SHI_BIAN_LONG_LIU_DUO";            //留垛
        this.localStorageKey.KEY_lingshibianlong_lunzhuang              = "_LING_SHI_BIAN_LONG_LUN_ZHUANG";         //轮庄
        this.localStorageKey.KEY_lingshibianlong_gps                    = "_LING_SHI_BIAN_LONG_GPS";                //防作弊
        this.localStorageKey.KEY_lingshibianlong_13yao                  = "_LING_SHI_BIAN_LONG_13_yao";             //13yao
        this.localStorageKey.KEY_lingshibianlong_dianpaobaogang         = "_LING_SHI_BIAN_LONG_dianpaobaogang";     //点炮包杠
        this.localStorageKey.KEY_lingshibianlong_7dui                   = "_LING_SHI_BIAN_LONG_7DUI";               //七对
        this.localStorageKey.KEY_lingshibianlong_longpaihu              = "_LING_SHI_BIAN_LONG_LONG_PAI_HU";        //过胡只能胡龙牌
    },
    initAll:function(IsFriendCard)
    {
        if (!IsFriendCard)
            this.setKey();

        this.bg_node = ccs.load("bg_lingshibianlong.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_lingshibianlong");
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

        //创建房间提示语，0为灵石编龙，1为灵石半摸
        var _btnCreateRoom = this.bg_node.getChildByName("btn_create_diamond");
        //this._textTip0 = _btnCreateRoom.getChildByName("text_tip_0");
        this._textTip1 = _btnCreateRoom.getChildByName("text_tip_1");


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


        // //留朵
        this._playNode_liuduo = _play.getChildByName("play_liuduo");
        this.addListenerText(this._playNode_liuduo);
        this._playNode_liuduo.addEventListener(this.clickCB, this._playNode_liuduo);

        // 轮庄
        this._playNode_lunzhuang = _play.getChildByName("play_lunzhuang");
        this.addListenerText(this._playNode_lunzhuang);
        this._playNode_lunzhuang.addEventListener(this.clickCB, this._playNode_lunzhuang);

        // //防作弊
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

        // 7对
        this._playNode_7dui = _play.getChildByName("play_7dui");
        this.addListenerText(this._playNode_7dui);
        this._playNode_7dui.addEventListener(this.clickCB, this._playNode_7dui);

        //非龙牌过胡只能胡龙牌
        this._playNode_longpaihu = _play.getChildByName("play_longpaihu");
        this.addListenerText(this._playNode_longpaihu);
        this._playNode_longpaihu.addEventListener(this.clickCB, this._playNode_longpaihu);
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
            _currentCount = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_lingshibianlong_count, 0);
        cc.log("_currentCount renshu  == " + _currentCount)
        this._playNode_player_count_radio.selectItem(_currentCount);
        this.radioBoxSelectCB(_currentCount, this._countlist[_currentCount], this._countlist);

        var _fenshu = [1,2,3,4,5,10,20,50,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9];
        var _idx;
        if (isClub) {
            _idx = this.getNumberItem("difen", 1);
            _idx = _fenshu.indexOf( parseInt(_idx) );
        }else
            _idx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_lingshibianlong_difen, 0);
        this._zhuIdx = (_fenshu.length + _idx)%_fenshu.length;
        this._ZhuNum.setString(_fenshu[this._zhuIdx]);


        //玩法
        var _currentGameType;
        if (isClub) {
            _currentGameType = this.getNumberItem("gameType", 0);
            if (_currentGameType == MjClient.GAME_TYPE.LING_SHI_BAN_MO) _currentGameType = 1;
            else _currentGameType = 0;
        }
        else
            _currentGameType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_lingshibianlong_gameType, 0);
        cc.log("_currentGameType== " + _currentGameType)
        this._playNode_play_type_radio.selectItem(_currentGameType);
        this.radioBoxSelectCB(_currentGameType, this._gameTypelist[_currentGameType], this._gameTypelist);
        this.showPlayType(_currentGameType);

        //留朵
        var _liuduo;
        if (isClub)
            _liuduo = this.getBoolItem("liuduo", true);
        else
            _liuduo = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_lingshibianlong_liuduo, true);
        this._playNode_liuduo.setSelected(_liuduo);
        var text = this._playNode_liuduo.getChildByName("text");
        this.selectedCB(text, _liuduo);

        //轮庄
        var _lunzhuang;
        if (isClub)
            _lunzhuang = this.getBoolItem("lunzhuang", true);
        else
            _lunzhuang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_lingshibianlong_lunzhuang, true);
        this._playNode_lunzhuang.setSelected(_lunzhuang);
        var text = this._playNode_lunzhuang.getChildByName("text");
        this.selectedCB(text, _lunzhuang);

        // // //防作弊
        var _gps;
        if (isClub)
            _gps = this.getBoolItem("gps", false);
        else
            _gps = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_lingshibianlong_gps, false);
        this._playNode_gps.setSelected(_gps);
        var text = this._playNode_gps.getChildByName("text");
        this.selectedCB(text, _gps);

        // 13yao
        var _13yao;
        if (isClub)
            _13yao = this.getBoolItem("shisanyao", true);
        else
            _13yao = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_lingshibianlong_13yao, true);
        this._playNode_13yao.setSelected(_13yao);
        var text = this._playNode_13yao.getChildByName("text");
        this.selectedCB(text, _13yao);

        //点炮包杠
        var _dianpaobaogang;
        if (isClub)
            _dianpaobaogang = this.getBoolItem("baogang", true);
        else
            _dianpaobaogang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_lingshibianlong_dianpaobaogang, true);
        this._playNode_baogang.setSelected(_dianpaobaogang);
        var text = this._playNode_baogang.getChildByName("text");
        this.selectedCB(text, _dianpaobaogang);

        // 7dui
        var _7dui;
        if (isClub)
            _7dui = this.getBoolItem("qidui", false);
        else
            _7dui = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_lingshibianlong_7dui, false);
        this._playNode_7dui.setSelected(_7dui);
        var text = this._playNode_7dui.getChildByName("text");
        this.selectedCB(text, _7dui);

        //过胡只能胡龙牌
        var _longpaihu;
        if (isClub)
            _longpaihu = this.getBoolItem("guohuzhinenglongpai", false);
        else
            _longpaihu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_lingshibianlong_longpaihu, false);
        this._playNode_longpaihu.setSelected(_longpaihu);
        var text = this._playNode_longpaihu.getChildByName("text");
        this.selectedCB(text, _longpaihu);



        this.changePayForPlayerNum();
    },
    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.LING_SHI_BIAN_LONG;
        para.maxPlayer = 4;
        //para.flowerType = WithFlowerType.noFlower;
        para.liuduo = true;
        para.difen = 1;
        para.lunzhuang = true;
        para.shisanyao = true;
        para.baogang = true;
        para.qidui = true;
        para.guohuzhinenglongpai = false;
        para.convertible = false;//是否自由人数
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

        para.difen = this._ZhuNum.getString();


        //玩法
        var _gameTypeIdx = 0;
        if (this._playNode_gameType0.isSelected()) {
            para.gameType = MjClient.GAME_TYPE.LING_SHI_BIAN_LONG;
            _gameTypeIdx = 0;
            // 13yao
            para.shisanyao = this._playNode_13yao.isSelected();
            // 过胡只能胡龙牌
            para.guohuzhinenglongpai = this._playNode_longpaihu.isSelected();
            if (!this._isFriendCard) {
                util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_lingshibianlong_13yao,  para.shisanyao);
                util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_lingshibianlong_longpaihu,  para.guohuzhinenglongpai);
            }
        }
        else if (this._playNode_gameType1.isSelected()) {
            para.gameType = MjClient.GAME_TYPE.LING_SHI_BAN_MO;
            _gameTypeIdx = 1;

            //7对
            para.qidui = this._playNode_7dui.isSelected();
            if (!this._isFriendCard) {
                util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_lingshibianlong_7dui,  para.qidui);
            }
        }


        // //留duo
        para.liuduo = this._playNode_liuduo.isSelected();

        // 轮庄
        para.lunzhuang = this._playNode_lunzhuang.isSelected();

        // 防作弊
        para.gps = this._playNode_gps.isSelected();


        //var _currentGameType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_lingshibianlong_gameType, 0);
        // 点炮包杠
        if(_gameTypeIdx != 1)
        {
            para.baogang = this._playNode_baogang.isSelected();
            if (!this._isFriendCard) {
                util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_lingshibianlong_dianpaobaogang,  para.baogang);
            }
        }

        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_lingshibianlong_count, _countIdx);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_lingshibianlong_difen, Number(this._zhuIdx));
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_lingshibianlong_gameType, _gameTypeIdx);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_lingshibianlong_liuduo,  para.liuduo);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_lingshibianlong_lunzhuang,  para.lunzhuang);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_lingshibianlong_gps,  para.gps);

        }

        cc.log("createara: " + JSON.stringify(para));
        return para;
    },
    showPlayType:function (index)
    {
        //创建房间提示语，0为灵石编龙，1为灵石半摸
        //this._textTip0.setVisible(true);
        this._playNode_13yao.setVisible(true);
        this._playNode_baogang.setVisible(true);
        this._playNode_longpaihu.setVisible(true);
        this._textTip1.setVisible(false);
        this._playNode_7dui.setVisible(false);
        if (index == 1)//选择灵石半摸时显示
        {
            //this._textTip0.setVisible(false);
            this._playNode_13yao.setVisible(false);
            this._playNode_baogang.setVisible(false);

            this._playNode_longpaihu.setVisible(false);
            this._playNode_longpaihu.setSelected(false);
            this.selectedCB(this._playNode_longpaihu.getChildByName("text"), false);

            this._textTip1.setVisible(true);
            this._playNode_7dui.setVisible(true);
            this._playNode_7dui.setPosition(this._playNode_baogang.getPosition());
        }

        // 貌似可以简化一下
        /*
        this._playNode_13yao.setVisible(index != 1);
        this._playNode_baogang.setVisible(index != 1);
        
        this._playNode_longpaihu.setVisible(index != 1);
        this._playNode_longpaihu.setSelected(index != 1);
        this.selectedCB(this._playNode_longpaihu.getChildByName("text"), index != 1);

        this._textTip1.setVisible(index == 1);
        this._playNode_7dui.setVisible(index == 1);
        this._playNode_7dui.setPosition(index == 1 ? this._playNode_baogang.getPosition() : this._playNode_7dui.getPosition());
        */

    }
});