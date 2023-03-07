/**
 * Created by miaodaizi on 2018/5/8.
 */


var CreateRoomNode_zhuohaozi = CreateRoomNode.extend({
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
            _currentCount = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_zhuohaozi_count, 0);
        this._playNode_player_count_radio.selectItem(_currentCount);
        this.radioBoxSelectCB(_currentCount, this._countlist[_currentCount], this._countlist);

        var _playType;
        if (isClub)
            _playType = this.getNumberItem("playType", 1);
        else
            _playType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_zhuohaozi_playType, 1);
        _playType -= 1;
        this._playNode_PlayType_radio.selectItem(_playType);
        this.radioBoxSelectCB(_playType, this._playTypelist[_playType], this._playTypelist);

        var _haoziType;
        if (isClub)
            _haoziType = this.getNumberItem("fenghaozi", 0);
        else
            _haoziType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_zhuohaozi_haoziType, 0);
        this._playNode_HaoZiType_radio.selectItem(_haoziType);
        this.radioBoxSelectCB(_haoziType, this._haoziTypelist[_haoziType], this._haoziTypelist);

        var _fenType;
        if (isClub){
            _fenType = this.getNumberItem("haoZiAnGangScore", 0);
            _fenType = [100,50].indexOf(_fenType);
        } else
        _fenType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_zhuohaozi_fenType, 0);
        this._playNode_FenType_radio.selectItem(_fenType);
        this.radioBoxSelectCB(_fenType, this._fenTypelist[_fenType], this._fenTypelist);

        var _zimoType;
        if (isClub)
            _zimoType = this.getNumberItem("haoZiDiaoJiangZiMo", 1);
        else
            _zimoType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_zhuohaozi_zimoType, 1);
        _zimoType -= 1;
        this._playNode_ZiMoType_radio.selectItem(_zimoType);
        this.radioBoxSelectCB(_zimoType, this._ZiMoTypelist[_zimoType], this._ZiMoTypelist);

        var _fenshu = [1,2,3,4,5,10,20,50,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9];
        var _idx;
        if (isClub) {
            _idx = this.getNumberItem("difen", 1);
            _idx = _fenshu.indexOf( parseInt(_idx) );
        }else
            _idx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_zhuohaozi_difen, 0);
        this._zhuIdx = (_fenshu.length + _idx)%_fenshu.length;
        this._ZhuNum.setString(_fenshu[this._zhuIdx]);

        //防作弊
        var _gps;
        if (isClub)
            _gps = this.getBoolItem("gps", false);
        else
            _gps = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_zhuohaozi_gps, false);
        this._playNode_gps.setSelected(_gps);
        var text = this._playNode_gps.getChildByName("text");
        this.selectedCB(text, _gps);

        var _zhuangfen;
        if(isClub){
            _zhuangfen = this.getBoolItem("jiaZhuangFen", true);
        }else {
            _zhuangfen = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_zhuohaozi_zhuangfen, true);
        }
        this._playNode_zhuangfen.setSelected(_zhuangfen);
        var text = this._playNode_zhuangfen.getChildByName("text");
        this.selectedCB(text, _zhuangfen);

        this.changePayForPlayerNum();
    },
    setKey:function(){
        this.localStorageKey.KEY_zhuohaozi_playType        = "_LV_ZHUO_HAO_ZI_PLAY_TYPE";  //DUO
        this.localStorageKey.KEY_zhuohaozi_difen      = "_LV_ZHUO_HAO_ZI_DI_FEN";     //增分
        this.localStorageKey.KEY_zhuohaozi_count      = "_LV_ZHUO_HAO_ZI_COUNT"; //人数
        this.localStorageKey.KEY_zhuohaozi_gps      = "_LV_ZHUO_HAO_ZI_GPS"; //防作弊
        this.localStorageKey.KEY_zhuohaozi_zhuangfen              = "_LV_ZHUO_HAO_ZI_ZHUANGFEN";              //庄分
        this.localStorageKey.KEY_zhuohaozi_haoziType        = "_LV_ZHUO_HAO_ZI_HAOZI_TYPE";
        this.localStorageKey.KEY_zhuohaozi_fenType        = "_LV_ZHUO_HAO_ZI_FEN_TYPE";
        this.localStorageKey.KEY_zhuohaozi_zimoType        = "_LV_ZHUO_HAO_ZI_ZIMO_TYPE";
    },
    initAll:function(IsFriendCard)
    {
        this.isClub = IsFriendCard;
        if (!IsFriendCard)
            this.setKey();
        this.bg_node = ccs.load("bg_zhuohaozi.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_zhuohaozi");
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
        this._playNode_playType1 = _play.getChildByName("play_zhuohaozi");
        this._playNode_playType2 = _play.getChildByName("play_shuanghaozi");
        var nodePlayTypeList1 = [];
        nodePlayTypeList1.push(this._playNode_playType1);
        nodePlayTypeList1.push(this._playNode_playType2);
        this._playNode_PlayType_radio = createRadioBoxForCheckBoxs(nodePlayTypeList1, function(index){
            this.radioBoxSelectCB(index, nodePlayTypeList1[index], nodePlayTypeList1);
        }.bind(this));
        this.addListenerText(nodePlayTypeList1,this._playNode_PlayType_radio,function () {});
        this._playTypelist = nodePlayTypeList1;

        //
        this._playNode_haoziType1 = _play.getChildByName("play_sjhaozi");
        this._playNode_haoziType2 = _play.getChildByName("play_fenghaozi");
        var nodeHaoZiTypeList1 = [];
        nodeHaoZiTypeList1.push(this._playNode_haoziType1);
        nodeHaoZiTypeList1.push(this._playNode_haoziType2);
        this._playNode_HaoZiType_radio = createRadioBoxForCheckBoxs(nodeHaoZiTypeList1, function(index){
            this.radioBoxSelectCB(index, nodeHaoZiTypeList1[index], nodeHaoZiTypeList1);
        }.bind(this));
        this.addListenerText(nodeHaoZiTypeList1,this._playNode_HaoZiType_radio,function () {});
        this._haoziTypelist = nodeHaoZiTypeList1;

        //
        this._playNode_FenType1 = _play.getChildByName("play_angang100");
        this._playNode_FenType2 = _play.getChildByName("play_angang50");
        var nodeFenTypeList1 = [];
        nodeFenTypeList1.push(this._playNode_FenType1);
        nodeFenTypeList1.push(this._playNode_FenType2);
        this._playNode_FenType_radio = createRadioBoxForCheckBoxs(nodeFenTypeList1, function(index){
            this.radioBoxSelectCB(index, nodeFenTypeList1[index], nodeFenTypeList1);
        }.bind(this));
        this.addListenerText(nodeFenTypeList1,this._playNode_FenType_radio,function () {});
        this._fenTypelist = nodeFenTypeList1;

        //
        this._playNode_ZiMoType1 = _play.getChildByName("play_zimoAll");
        this._playNode_ZiMoType2 = _play.getChildByName("play_zimo12");
        var nodeZiMoTypeList1 = [];
        nodeZiMoTypeList1.push(this._playNode_ZiMoType1);
        nodeZiMoTypeList1.push(this._playNode_ZiMoType2);
        this._playNode_ZiMoType_radio = createRadioBoxForCheckBoxs(nodeZiMoTypeList1, function(index){
            this.radioBoxSelectCB(index, nodeZiMoTypeList1[index], nodeZiMoTypeList1);
        }.bind(this));
        this.addListenerText(nodeZiMoTypeList1,this._playNode_ZiMoType_radio,function () {});
        this._ZiMoTypelist = nodeZiMoTypeList1;

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

        //庄分
        this._playNode_zhuangfen = _play.getChildByName("play_daizhuang");
        this.addListenerText(this._playNode_zhuangfen);
        this._playNode_zhuangfen.addEventListener(this.clickCB, this._playNode_zhuangfen);
    },
    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.ZHUO_HAO_ZI;
        para.maxPlayer = 4;
        para.difen = 1;
        para.playType = 1; // 0 经典，1 捉耗子，2双耗子
        para.lunzhuang = false;
        para.biHu = false; //经典玩法，有胡比胡
        para.guoHuZiMo = true;//带耗子的玩法，过胡只能自摸
        para.qingLongDouble = false;//带耗子的玩法，过胡只能自摸
        //para.gps = !!this._bGPS.isSelected();
        para.mingGangZiMo=true;
        para.mingGangZiMoShuang=true;
        para.jiaZhuangFen=true;
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
        if (this._playNode_playType1.isSelected()) {
            para.playType = 1;
            //捉耗子的玩法
        }
        else if (this._playNode_playType2.isSelected()) {
            para.playType = 2;
            //双耗子的玩法
        }
        //
        if (this._playNode_haoziType1.isSelected()) {
            para.fenghaozi = 0;
        }
        else if (this._playNode_haoziType2.isSelected()) {
            para.fenghaozi = 1;
        }
        //
        var fen_index = 0;
        if (this._playNode_FenType1.isSelected()) {
            fen_index = 0;
            para.haoZiAnGangScore = 100;
        }
        else if (this._playNode_FenType2.isSelected()) {
            fen_index = 1;
            para.haoZiAnGangScore = 50;
        }
        //玩法
        if (this._playNode_ZiMoType1.isSelected()) {
            para.haoZiDiaoJiangZiMo = 1;
            //捉耗子的玩法
        }
        else if (this._playNode_ZiMoType2.isSelected()) {
            para.haoZiDiaoJiangZiMo = 2;
            //双耗子的玩法
        }
        para.difen = this._ZhuNum.getString();
        //防作弊
        para.gps = this._playNode_gps.isSelected();
        para.qidui = true;
        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_zhuohaozi_count, _countIdx)
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_zhuohaozi_playType, para.playType);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_zhuohaozi_zhuangfen, this._playNode_zhuangfen.isSelected());
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_zhuohaozi_difen, Number(this._zhuIdx));
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_zhuohaozi_gps,  para.gps);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_zhuohaozi_haoziType, para.fenghaozi);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_zhuohaozi_fenType, fen_index);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_zhuohaozi_zimoType, para.haoZiDiaoJiangZiMo);
        }
        cc.log("createara: " + JSON.stringify(para));
        return para;
    }
});
