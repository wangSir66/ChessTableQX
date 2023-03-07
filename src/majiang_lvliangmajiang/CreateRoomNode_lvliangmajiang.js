/**
 * Created by miaodaizi on 2018/5/8.
 */


var CreateRoomNode_lvliangmajiang = CreateRoomNode.extend({
    setKey:function(){
        this.localStorageKey.KEY_lvliang_playType        = "_LV_LIANG_MA_JIANG_PLAY_TYPE";  //DUO
        this.localStorageKey.KEY_lvliang_difen      = "_LV_LIANG_MA_JIANG_DI_FEN";     //增分
        this.localStorageKey.KEY_lvliang_count      = "_LV_LIANG_MA_JIANG_COUNT"; //人数
        this.localStorageKey.KEY_lvliang_lunzhuang      = "_LV_LIANG_MA_JIANG_LUN_ZHUANG"; //轮庄
        this.localStorageKey.KEY_lvliang_gps      = "_LV_LIANG_MA_JIANG_GPS"; //防作弊
        this.localStorageKey.KEY_lvliang_bihu      = "_LV_LIANG_MA_JIANG_BI_HU"; //有胡必胡
        this.localStorageKey.KEY_lvliang_guohuzimo    = "_LV_LIANG_MA_JIANG_GUO_HU_ZIMO"; //有胡必胡
        this.localStorageKey.KEY_lvliang_qinglongdouble    = "_LV_LIANG_MA_JIANG_QING_LONG_DOUBLE"; //清一色一条龙
        // this.localStorageKey.KEY_lvliang_guozi              = "_LV_LIANG_MA_JIANG_GUOZI";              //锅子
        this.localStorageKey.KEY_lvliang_qidui              = "_LV_LIANG_MA_JIANG_QIDUI";             //七对
        this.localStorageKey.KEY_lvliang_minggangzimo              = "_LV_LIANG_MA_JIANG_MING_GANG_ZIMO";          //明杠自摸
        this.localStorageKey.KEY_lvliang_minggangzimo_shuanghaozi              = "_LV_LIANG_MA_JIANG_MING_GANG_ZIMO_SHUANG";          //明杠自摸双耗子
        this.localStorageKey.KEY_lvliang_zhuangfen              = "_LV_LIANG_MA_JIANG_ZHUANGFEN";              //庄分
        this.localStorageKey.KEY_lvliang_zimo12              = "_LV_LIANG_MA_JIANG_ZIMO12";              //1,2可自摸
    },
    initAll:function(IsFriendCard)
    {
        this.isClub=IsFriendCard;
        if (!IsFriendCard)
            this.setKey();
        this.bg_node = ccs.load("bg_lvliangmajiang.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_lvliangmajiang");
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

        //玩法playType
        this._playNode_playType0 = _play.getChildByName("play_7dui1tiaolong");
        this._playNode_playType1 = _play.getChildByName("play_zhuohaozi");
        this._playNode_playType2 = _play.getChildByName("play_shuanghaozi");
        var nodePlayTypeList1 = [];
        nodePlayTypeList1.push(this._playNode_playType0);
        nodePlayTypeList1.push(this._playNode_playType1);
        nodePlayTypeList1.push(this._playNode_playType2);
        this._playNode_PlayType_radio = createRadioBoxForCheckBoxs(nodePlayTypeList1, function(index){
            this.showPlayType(index);
            // this.changePayForPlayerNum(index);
            this.radioBoxSelectCB(index, nodePlayTypeList1[index], nodePlayTypeList1);
        }.bind(this));
        this.addListenerText(nodePlayTypeList1,this._playNode_PlayType_radio,this.showPlayType.bind(this));
        this._playTypelist = nodePlayTypeList1;

        // 轮庄
        this._playNode_lunzhuang = _play.getChildByName("play_lunzhuang");
        this.addListenerText(this._playNode_lunzhuang);
        this._playNode_lunzhuang.addEventListener(this.clickCB, this._playNode_lunzhuang);

        this._playNode_qidui = _play.getChildByName("play_qidui");
        this.addListenerText(this._playNode_qidui);
        this._playNode_qidui.addEventListener(this.clickCB, this._playNode_qidui);

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

        // 防作弊
        this._playNode_gps = this.bg_node.getChildByName("play_gps");
        this.addListenerText(this._playNode_gps);
        this._playNode_gps.addEventListener(this.clickCB, this._playNode_gps);
        COMMON_UI.addHelpUI(this._playNode_gps);


        // 有胡必胡
        this._playNode_biHu = _play.getChildByName("play_biHu");
        this.addListenerText(this._playNode_biHu);
        this._playNode_biHu.addEventListener(this.clickCB, this._playNode_biHu);

        this._playNode_guoHuZiMo = _play.getChildByName("play_guoHuZiMo");
        this.addListenerText(this._playNode_guoHuZiMo);
        this._playNode_guoHuZiMo.addEventListener(this.clickCB, this._playNode_guoHuZiMo);

        this._playNode_qingLongDouble = _play.getChildByName("play_qingLongDouble");
        this.addListenerText(this._playNode_qingLongDouble);
        this._playNode_qingLongDouble.addEventListener(this.clickCB, this._playNode_qingLongDouble);

        // this._playNode_guozi = _play.getChildByName("play_guozi");
        // this.addListenerText(this._playNode_guozi);
        // this._playNode_guozi.addEventListener(this.clickCB, this._playNode_guozi);

        this._playNode_mingGangZiMo = _play.getChildByName("play_mingGangZiMo");
        this.addListenerText(this._playNode_mingGangZiMo);
        this._playNode_mingGangZiMo.addEventListener(this.clickCB, this._playNode_mingGangZiMo);

        this._playNode_mingGangZiMo_shuang = _play.getChildByName("play_mingGangZiMo_shuang");
        this.addListenerText(this._playNode_mingGangZiMo_shuang);
        this._playNode_mingGangZiMo_shuang.addEventListener(this.clickCB, this._playNode_mingGangZiMo_shuang);

        //庄分
        this._playNode_zhuangfen = _play.getChildByName("play_zhuangfen");
        this.addListenerText(this._playNode_zhuangfen);
        this._playNode_zhuangfen.addEventListener(this.clickCB, this._playNode_zhuangfen);

        //庄分
        this._playNode_zimo12 = _play.getChildByName("play_zimo12");
        this.addListenerText(this._playNode_zimo12);
        this._playNode_zimo12.addEventListener(this.clickCB, this._playNode_zimo12);



    },
    setPlayNodeCurrentSelect: function(isClub) {

        // // //留朵 ,不留
        // var _duoIdx = 0;
        // var _duoCount = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_lvliang_duo, true);
        // if(!_duoCount)
        // {
        //     _duoIdx = 1
        // }
        // this._playNode_player_duo_radio.selectItem(_duoIdx);
        // this.radioBoxSelectCB(_duoIdx, this._Duolist[_duoIdx], this._Duolist);

        //人数
        var _currentCount;
        if (isClub) {
            if (this.getBoolItem("convertible", false))
                _currentCount = 3;
            else
                _currentCount = [4, 3, 2].indexOf(this.getNumberItem("maxPlayer", 4));
        }
        else
            _currentCount = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_lvliang_count, 0);
        cc.log("_currentCount renshu  == " + _currentCount)
        this._playNode_player_count_radio.selectItem(_currentCount);
        this.radioBoxSelectCB(_currentCount, this._countlist[_currentCount], this._countlist);

        var _playType;
        if (isClub)
            _playType = this.getNumberItem("playType", 0);
        else
            _playType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_lvliang_playType, 0);
        this._playNode_PlayType_radio.selectItem(_playType);
        this.radioBoxSelectCB(_playType, this._playTypelist[_playType], this._playTypelist);
        this.showPlayType(_playType);


        var _fenshu = [1,2,3,4,5,10,20,50,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9];
        var _idx;
        if (isClub) {
            _idx = this.getNumberItem("difen", 1);
            _idx = _fenshu.indexOf( parseInt(_idx) );
        }else
            _idx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_lvliang_difen, 0);
        this._zhuIdx = (_fenshu.length + _idx)%_fenshu.length;
        this._ZhuNum.setString(_fenshu[this._zhuIdx]);

        //防作弊
        var _gps;
        if (isClub)
            _gps = this.getBoolItem("gps", false);
        else
            _gps = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_lvliang_gps, false);
        this._playNode_gps.setSelected(_gps);
        var text = this._playNode_gps.getChildByName("text");
        this.selectedCB(text, _gps);

        // 必胡
        var _biHu;
        if (isClub)
            _biHu = this.getBoolItem("biHu", false);
        else
            _biHu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_lvliang_bihu, false);
        this._playNode_biHu.setSelected(_biHu);
             var text = this._playNode_biHu.getChildByName("text");
        this.selectedCB(text, _biHu);

        // 轮庄
        var _lunzhuang;
        if (isClub)
            _lunzhuang = this.getBoolItem("lunzhuang", true);
        else
            _lunzhuang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_lvliang_lunzhuang, true);
        this._playNode_lunzhuang.setSelected(_lunzhuang);
        var text = this._playNode_lunzhuang.getChildByName("text");
        this.selectedCB(text, _lunzhuang);

        var _qidui;
        if (isClub)
            _qidui = this.getBoolItem("qidui", false);
        else
            _qidui = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_lvliang_qidui, false);
        this._playNode_qidui.setSelected(_qidui);
        var text = this._playNode_qidui.getChildByName("text");
        this.selectedCB(text, _qidui);

            // 过胡自摸
        var _guoHuZiMo;
        if (isClub)
            _guoHuZiMo = this.getBoolItem("guoHuZiMo", true);
        else
            _guoHuZiMo = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_lvliang_guohuzimo, true);
        this._playNode_guoHuZiMo.setSelected(_guoHuZiMo);
        var text = this._playNode_guoHuZiMo.getChildByName("text");
        this.selectedCB(text, _guoHuZiMo);

        // 1,2可自摸
        var _zimo12;
        if (isClub)
            _zimo12 = this.getBoolItem("zimo12", false);
        else
            _zimo12 = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_lvliang_zimo12, false);
        this._playNode_zimo12.setSelected(_zimo12);
        var text = this._playNode_zimo12.getChildByName("text");
        this.selectedCB(text, _zimo12);

        // 清一色一条龙加番
        var _qingLongDouble;
        if (isClub)
            _qingLongDouble = this.getBoolItem("qingLongDouble", true);
        else
            _qingLongDouble = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_lvliang_qinglongdouble, true);
        this._playNode_qingLongDouble.setSelected(_qingLongDouble);
        var text = this._playNode_qingLongDouble.getChildByName("text");
        this.selectedCB(text, _qingLongDouble);

        //明杠杠开算自摸
        var _mingGangZiMo;
        if(isClub){
                _mingGangZiMo = this.getBoolItem("mingGangZiMo", true);
        }else {
                _mingGangZiMo = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_lvliang_minggangzimo, true);
        }
        this._playNode_mingGangZiMo.setSelected(_mingGangZiMo);
        var text = this._playNode_mingGangZiMo.getChildByName("text");
        this.selectedCB(text, _mingGangZiMo);

        var _mingGangZiMo_shuang;
        if(isClub){
            _mingGangZiMo_shuang = this.getBoolItem("mingGangZiMoShuang", false);
        }else {
            _mingGangZiMo_shuang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_lvliang_minggangzimo_shuanghaozi, false);
        }
        this._playNode_mingGangZiMo_shuang.setSelected(_mingGangZiMo_shuang);
        var text = this._playNode_mingGangZiMo_shuang.getChildByName("text");
        this.selectedCB(text, _mingGangZiMo_shuang);

        //锅子
        // var _guozi;
        // if(isClub){
        //     _guozi = this.getNumberItem("guozi", 0);
        // }else{
        //     _guozi = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_lvliang_guozi, 0);
        // }
        // this._playNode_guozi.setSelected(_guozi>0);
        // var text = this._playNode_guozi.getChildByName("text");
        // this.selectedCB(text,_guozi>0);

        var _zhuangfen;
        if(isClub){
            _zhuangfen = this.getBoolItem("jiaZhuangFen", true);
        }else {
            _zhuangfen = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_lvliang_minggangzimo_shuanghaozi, true);
        }
        this._playNode_zhuangfen.setSelected(_zhuangfen);
        var text = this._playNode_zhuangfen.getChildByName("text");
        this.selectedCB(text, _zhuangfen);

        this.changePayForPlayerNum();
    },
    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.LV_LIANG_MA_JIANG;
        para.maxPlayer = 4;
        //para.flowerType = WithFlowerType.noFlower;
        //para.liuduo = true;//2018.1.31修改为默认留垛
        para.difen = 1;
        para.playType = 0; // 0 经典，1 捉耗子，2双耗子
        para.lunzhuang = true;
        para.biHu = false; //经典玩法，有胡比胡
        para.guoHuZiMo = false;//带耗子的玩法，过胡只能自摸
        para.qingLongDouble = false;//带耗子的玩法，过胡只能自摸
        //para.gps = !!this._bGPS.isSelected();
        para.mingGangZiMo=false;
        para.mingGangZiMoShuang=false;
        para.jiaZhuangFen=false;
        para.zimo12 = false;
        para.convertible = false;//是否自由人数

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
        if (this._playNode_playType0.isSelected()) {
            para.playType = 0;
            //经典
            para.biHu = this._playNode_biHu.isSelected();
            para.qingLongDouble=this._playNode_qingLongDouble.isSelected();
            para.mingGangZiMo = this._playNode_mingGangZiMo.isSelected();
        }
        else if (this._playNode_playType1.isSelected()) {
            para.playType = 1;
            //捉耗子的玩法
            para.guoHuZiMo = this._playNode_guoHuZiMo.isSelected();
            para.mingGangZiMo = this._playNode_mingGangZiMo.isSelected();
            para.jiaZhuangFen=this._playNode_zhuangfen.isSelected();
        }
        else if (this._playNode_playType2.isSelected()) {
            para.playType = 2;
            //双耗子的玩法
            para.guoHuZiMo = this._playNode_guoHuZiMo.isSelected();
            para.mingGangZiMoShuang = this._playNode_mingGangZiMo_shuang.isSelected();
            para.jiaZhuangFen=this._playNode_zhuangfen.isSelected();
        }


        para.difen = this._ZhuNum.getString();

        // 轮庄
        para.lunzhuang = this._playNode_lunzhuang.isSelected();
        para.zimo12 = this._playNode_zimo12.isSelected();

        // if (this._playNode_guozi.isSelected()) {
        //     para.guozi = 100;
        // }
        // else {
        //     para.guozi = 0;
        // }
        // util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_jiexiukoudian_guozi , para.guozi);

        //防作弊
        para.gps = this._playNode_gps.isSelected();

        para.qidui = this._playNode_qidui.isSelected();
        if (!this._isFriendCard) {

            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_lvliang_count, _countIdx)
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_lvliang_minggangzimo, this._playNode_mingGangZiMo.isSelected());
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_lvliang_minggangzimo_shuanghaozi, this._playNode_mingGangZiMo_shuang.isSelected());
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_lvliang_playType, para.playType);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_lvliang_qinglongdouble, this._playNode_qingLongDouble.isSelected());
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_lvliang_bihu, this._playNode_biHu.isSelected());
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_lvliang_guohuzimo, this._playNode_guoHuZiMo.isSelected());
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_lvliang_zhuangfen, this._playNode_zhuangfen.isSelected());
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_lvliang_difen, Number(this._zhuIdx));
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_lvliang_lunzhuang,  para.lunzhuang);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_lvliang_gps,  para.gps);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_lvliang_qidui,  para.qidui);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_lvliang_zimo12,  para.zimo12);
        }
        cc.log("createara: " + JSON.stringify(para));
        return para;
    },
    showPlayType:function(select_number)
    {

        if (select_number == 1||select_number == 2)//选择耗子玩法时隐藏选项
        {
            this._playNode_qingLongDouble.setVisible(false);
            this._playNode_biHu.setVisible(false);
            this._playNode_guoHuZiMo.setVisible(true);
            this._playNode_qidui.setVisible(true);
            this._playNode_zhuangfen.setVisible(true);
        }
        else{
            this._playNode_qingLongDouble.setVisible(true);
            this._playNode_biHu.setVisible(true);
            this._playNode_guoHuZiMo.setVisible(false);
            this._playNode_qidui.setVisible(false);
            this._playNode_zhuangfen.setVisible(false);
        }
        if (select_number == 2)
        {
            this._playNode_mingGangZiMo.setVisible(false);
            this._playNode_mingGangZiMo_shuang.setVisible(true);
            this._playNode_zhuangfen.setVisible(true);
        }
        else
        {
            this._playNode_mingGangZiMo.setVisible(true);
            this._playNode_mingGangZiMo_shuang.setVisible(false);
        }
    }
});
