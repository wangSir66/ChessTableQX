/**
 * Created by maoyu on 2017/7/21.
 */


var CreateRoomNode_pingyaokoudian = CreateRoomNode.extend({
    setKey:function(){
        this.localStorageKey.KEY_pingyaokoudian_guozi        = "_PING_YAO_KOU_DIAN_GUO_ZI"; //100锅子
        this.localStorageKey.KEY_pingyaokoudian_haozi        = "_PING_YAO_KOU_DIAN_HAO_ZI";  //带耗子
        this.localStorageKey.KEY_pingyaokoudian_difen      = "_PING_YAO_KOU_DIAN_DI_FEN";     //增分
        this.localStorageKey.KEY_pingyaokoudian_gameType      = "_PING_YAO_KOU_DIAN_GAME_TYPE"; //玩法
        this.localStorageKey.KEY_pingyaokoudian_count      = "_PING_YAO_KOU_DIAN_COUNT"; //人数
        this.localStorageKey.KEY_pingyaokoudian_liuduo      = "_PING_YAO_KOU_DIAN_LIU_DUO"; //留垛
        this.localStorageKey.KEY_pingyaokoudian_lunzhuang      = "_PING_YAO_KOU_DIAN_LUN_ZHUANG"; //轮庄
        this.localStorageKey.KEY_pingyaokoudian_gps      = "_PING_YAO_KOU_DIAN_GPS"; //防作弊
        this.localStorageKey.KEY_pingyaokoudian_13yao      = "_PING_YAO_KOU_DIAN_13_yao"; //13yao
        this.localStorageKey.KEY_pingyaokoudian_dianpaobaogang      = "_PING_YAO_KOU_DIAN_dianpaobaogang"; //点炮包杠
    },
    initAll:function(IsFriendCard)
    {
        if (!IsFriendCard)
            this.setKey();

        this.bg_node = ccs.load("bg_pingyaokoudian.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_pingyaokoudian");
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

        //创建房间提示语，0为平遥麻将，1为平遥扣点
        var _btnCreateRoom = this.bg_node.getChildByName("btn_create_diamond");
        this._textTip0 = _btnCreateRoom.getChildByName("text_tip_0");
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

        this._play_guozi = _play.getChildByName("play_guozi");
        this.addListenerText(this._play_guozi);
        this._play_guozi.addEventListener(this.clickCB, this._play_guozi);

        this._play_haozi = _play.getChildByName("play_haozi");
        this.addListenerText(this._play_haozi);
        this._play_haozi.addEventListener(this.clickCB, this._play_haozi);

        // //留朵
        this._playNode_liuduo = _play.getChildByName("play_liuduo");
        this.addListenerText(this._playNode_liuduo);
        this._playNode_liuduo.addEventListener(this.clickCB, this._playNode_liuduo);

        // 轮庄
        this._playNode_lunzhuang = _play.getChildByName("play_lunzhuang");
        this.addListenerText(this._playNode_lunzhuang);
        this._playNode_lunzhuang.addEventListener(this.clickCB, this._playNode_lunzhuang);

        //玩法
        this._playNode_gameType0 = _play.getChildByName("play_type0");
        this._playNode_gameType1 = _play.getChildByName("play_type1");
        //this._playNode_gameType1.setVisible(false);//屏蔽平遥扣点
        var nodeGameTypeList1 = [];
        nodeGameTypeList1.push(_play.getChildByName("play_type0"));
        nodeGameTypeList1.push(_play.getChildByName("play_type1"));
        this._playNode_game_type_radio = createRadioBoxForCheckBoxs(nodeGameTypeList1, function(index){
            this.showPlayType(index);
            this.radioBoxSelectCB(index, nodeGameTypeList1[index], nodeGameTypeList1);
        }.bind(this));
        this.addListenerText(nodeGameTypeList1, this._playNode_game_type_radio, this.showPlayType.bind(this));
        this._gameTypelist = nodeGameTypeList1;

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
            _currentCount = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_pingyaokoudian_count, 0);
        cc.log("_currentCount renshu  == " + _currentCount)
        this._playNode_player_count_radio.selectItem(_currentCount);
        this.radioBoxSelectCB(_currentCount, this._countlist[_currentCount], this._countlist);


        var _guozi;
        if (isClub) {
            _guozi = this.getNumberItem("guozi", 0);
        }else
            _guozi = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_pingyaokoudian_guozi, 0);
        this._play_guozi.setSelected(_guozi>0);
        var text = this._play_guozi.getChildByName("text");
        this.selectedCB(text,_guozi>0);

        var _haozi;
        if (isClub) {
            _haozi = this.getBoolItem("haozi", false);
        }else
            _haozi = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_pingyaokoudian_haozi, false);
        this._play_haozi.setSelected(_haozi);
        var text = this._play_haozi.getChildByName("text");
        this.selectedCB(text,_haozi);

        //留朵
        var _liuduo;
        if (isClub) {
            _liuduo = this.getBoolItem("liuduo", true);
        }else
            _liuduo = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_pingyaokoudian_liuduo, true);
        this._playNode_liuduo.setSelected(_liuduo);
        var text = this._playNode_liuduo.getChildByName("text");
        this.selectedCB(text, _liuduo);

        //轮庄
        var _lunzhuang;
        if (isClub) {
            _lunzhuang = this.getBoolItem("lunzhuang", true);
        }else
            _lunzhuang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_pingyaokoudian_lunzhuang, true);
        this._playNode_lunzhuang.setSelected(_lunzhuang);
        var text = this._playNode_lunzhuang.getChildByName("text");
        this.selectedCB(text, _lunzhuang);


        //玩法
        var _gameType;
        if (isClub) {
            _gameType = this.getNumberItem("gameType", 1);
            if (_gameType == MjClient.GAME_TYPE.PING_YAO_MA_JIANG) _gameType = 0;
            else _gameType = 1;
        }
        else
            _gameType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_pingyaokoudian_gameType, 0);
        this._playNode_game_type_radio.selectItem(_gameType);
        this.radioBoxSelectCB(_gameType, this._gameTypelist[_gameType], this._gameTypelist);
        this.showPlayType(_gameType);


        var _fenshu = [1,2,3,4,5,10,20,50];
        var _idx;
        if (isClub) {
            _idx = this.getNumberItem("difen", 1);
            _idx = _fenshu.indexOf( parseInt(_idx) );
        }else
            _idx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_pingyaokoudian_difen, 0);
        this._zhuIdx = (_fenshu.length + _idx)%_fenshu.length;
        this._ZhuNum.setString(_fenshu[this._zhuIdx]);

        //防作弊
        var _gps;
        if (isClub) {
            _gps = this.getBoolItem("gps", false);
        }else
            _gps = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_pingyaokoudian_gps, false);
        this._playNode_gps.setSelected(_gps);
        var text = this._playNode_gps.getChildByName("text");
        this.selectedCB(text, _gps);

        // 13yao
        var _13yao;
        if (isClub) {
            _13yao = this.getBoolItem("shisanyao", true);
        }else
            _13yao = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_pingyaokoudian_13yao, true);
        this._playNode_13yao.setSelected(_13yao);
        var text = this._playNode_13yao.getChildByName("text");
        this.selectedCB(text, _13yao);

        //点炮包杠
        var _dianpaobaogang;
        if (isClub) {
            _dianpaobaogang = this.getBoolItem("baogang", false);
        }else
            _dianpaobaogang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_pingyaokoudian_dianpaobaogang, false);
        this._playNode_baogang.setSelected(_dianpaobaogang);
        var text = this._playNode_baogang.getChildByName("text");
        this.selectedCB(text, _dianpaobaogang);

        this.changePayForPlayerNum();
    },
    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.PING_YAO_KOU_DIAN;
        para.maxPlayer = 4;
        para.difen = 1;
        para.lunzhuang = true;
        para.shisanyao = true;
        para.baogang = true;
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
            para.gameType = MjClient.GAME_TYPE.PING_YAO_MA_JIANG;
            _gameTypeIdx = 0;
        }
        else if (this._playNode_gameType1.isSelected()) {
            para.gameType = MjClient.GAME_TYPE.PING_YAO_KOU_DIAN;
            _gameTypeIdx = 1;
        }



        if (para.gameType == MjClient.GAME_TYPE.PING_YAO_MA_JIANG)
        {
            //para.flowerType = WithFlowerType.noFlower;
        }
        else if (para.gameType == MjClient.GAME_TYPE.PING_YAO_KOU_DIAN)
        {
            if (this._play_guozi.isSelected())
            {
                para.guozi = 100;
            }
            else
            {
                para.guozi = 0;
            }

            para.haozi = this._play_haozi.isSelected();

            if (!this._isFriendCard) {
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_pingyaokoudian_guozi, para.guozi);
                util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_pingyaokoudian_haozi, para.haozi);
            }
        }


        // //留duo
        para.liuduo = this._playNode_liuduo.isSelected();

        // 轮庄
        para.lunzhuang = this._playNode_lunzhuang.isSelected();

        //防作弊
        para.gps = this._playNode_gps.isSelected();


        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_pingyaokoudian_count, _countIdx);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_pingyaokoudian_difen, Number(this._zhuIdx));
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_pingyaokoudian_gameType, _gameTypeIdx);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_pingyaokoudian_liuduo,  para.liuduo);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_pingyaokoudian_lunzhuang,  para.lunzhuang);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_pingyaokoudian_gps,  para.gps);
        }

        var _gameType = _gameTypeIdx;
        if(_gameType != 1) //平遥麻将才有十三幺 和 点炮包杠
        {
            // 13yao
            para.shisanyao = this._playNode_13yao.isSelected();

            // 点炮包杠
            para.baogang = this._playNode_baogang.isSelected();

            if (!this._isFriendCard) {
                util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_pingyaokoudian_13yao,  para.shisanyao);
                util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_pingyaokoudian_dianpaobaogang,  para.baogang);

            }
        }
        cc.log("createara: " + JSON.stringify(para));
        return para;
    },
    showPlayType:function(select_number)
    {
        //创建房间提示语，0为平遥麻将，1为平遥扣点
        this._play_guozi.setVisible(false);
        this._play_haozi.setVisible(false);
        this._textTip0.setVisible(false);
        this._textTip1.setVisible(false);
        this._playNode_13yao.setVisible(false);
        this._playNode_baogang.setVisible(false);
        if (select_number == 1)//选择平遥扣点时显示两个选项
        {
            this._play_guozi.setVisible(true);
            this._play_haozi.setVisible(true);
            this._textTip0.setVisible(false);
            this._textTip1.setVisible(true);
        }else
        {
            this._playNode_baogang.setVisible(true);//平遥有点炮包杠
            this._playNode_13yao.setVisible(true);//平遥麻将有十三幺的选项
            this._playNode_13yao.setPosition(this._play_haozi.getPosition());
        }
    },
});