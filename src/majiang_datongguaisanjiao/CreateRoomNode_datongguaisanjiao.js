/**
 * Created by maoyu on 2017/7/21.
 */

var CreateRoomNode_datongguaisanjiao = CreateRoomNode.extend({
    setKey:function(){
        this.localStorageKey.KEY_datongguaisanjiao_difen             = "_DA_TONG_GUAI_SAN_JIAO_DI_FEN";  //增分
        this.localStorageKey.KEY_datongguaisanjiao_maxPlayer         = "_DA_TONG_GUAI_SAN_JIAO_MAX_PLAYER"; //人数
        this.localStorageKey.KEY_datongguaisanjiao_qiDui             = "_DA_TONG_GUAI_SAN_JIAO_LIU_DUO"; //七对
        this.localStorageKey.KEY_datongguaisanjiao_guoHuZhiNengZiMo  = "_DA_TONG_GUAI_SAN_JIAO_SHI_SAN_YAO"; //过胡只能自摸
        this.localStorageKey.KEY_datongguaisanjiao_lunzhuang         = "_DA_TONG_GUAI_SAN_JIAO_LUN_ZHUANG"; //轮庄
        this.localStorageKey.KEY_datongguaisanjiao_fangZuoBi         = "_DA_TONG_GUAI_SAN_JIAO_FANG_ZUO_BI"; //防作弊
        this.localStorageKey.KEY_datongguaisanjiao_gps               = "_DA_TONG_GUAI_SAN_JIAO_GPS"; //gps防作弊
    },

    initAll:function(IsFriendCard)
    {
        if (!IsFriendCard)
            this.setKey();

        this.bg_node = ccs.load("bg_datongguaisanjiao.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_datongguaisanjiao");
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
        //this._super();
        var _bgdatongguaisanjiaoNode = this.playScroll;
        //花
        var _play = _bgdatongguaisanjiaoNode.getChildByName("play");

        //底分
        this._zhuIdx = 0;//数组的引索
        var _fenshu = [1,2,3,4,5,6,7,8,9,10];
        var _arrayLenth =  _fenshu.length;//数组长度
        this._ZhuNum = _bgdatongguaisanjiaoNode.getChildByName("txt_fen");
        this._ZhuNum.setString(_fenshu[this._zhuIdx]);
        this._Button_sub = _bgdatongguaisanjiaoNode.getChildByName("btn_sub");
        this._Button_sub.addTouchEventListener(function(sender, type) {
           if (type == 2) {
               this._zhuIdx = (_arrayLenth + --this._zhuIdx)%_arrayLenth;
               this._ZhuNum.setString(_fenshu[this._zhuIdx]);
               this.setRoomCardModeFree(_fenshu[this._zhuIdx]);
           }
        }, this);
        this._Button_add = _bgdatongguaisanjiaoNode.getChildByName("btn_add");
        this._Button_add.addTouchEventListener(function(sender, type) {
           if (type == 2) {
               this._zhuIdx = (_arrayLenth + ++this._zhuIdx)%_arrayLenth;
               this._ZhuNum.setString(_fenshu[this._zhuIdx]);
               this.setRoomCardModeFree(_fenshu[this._zhuIdx]);
           }
        }, this);


        //人数
        this._playNode_maxPlayer0 = _play.getChildByName("play_count0");
        // this._playNode_maxPlayer1 = _play.getChildByName("play_count1");
        // this._playNode_maxPlayer1.visible = false;
        var nodeCountList1 = [this._playNode_maxPlayer0/*, this._playNode_maxPlayer1*/];
        // nodeCountList1.push(this._playNode_maxPlayer0);
        // nodeCountList1.push(this._playNode_maxPlayer1);
        this._playNode_player_count_radio = createRadioBoxForCheckBoxs(nodeCountList1, function(index){
            this.changePayForPlayerNum(index);
            this.radioBoxSelectCB(index, nodeCountList1[index], nodeCountList1);
        }.bind(this));
        this.addListenerText(nodeCountList1, this._playNode_player_count_radio,this.changePayForPlayerNum.bind(this));
        this._countlist = nodeCountList1;

        this.initPlayNumNode(nodeCountList1, [4, 3, 2]);

        // 七对
        this._playNode_qiDui = _play.getChildByName("play_qiDui");
        this.addListenerText(this._playNode_qiDui);
        this._playNode_qiDui.addEventListener(this.clickCB, this._playNode_qiDui);

        //过胡只能自摸
        this._playNode_guoHuZhiNengZiMo = _play.getChildByName("play_guoHuZhiNengZiMo");
        this.addListenerText(this._playNode_guoHuZhiNengZiMo);
        this._playNode_guoHuZhiNengZiMo.addEventListener(this.clickCB, this._playNode_guoHuZhiNengZiMo);

        //轮庄
        this._playNode_lunzhuang = _play.getChildByName("play_lunzhuang");
        this.addListenerText(this._playNode_lunzhuang);
        this._playNode_lunzhuang.addEventListener(this.clickCB, this._playNode_lunzhuang);

        //防作弊
        this._playNode_fangZuoBi = _play.getChildByName("play_fangZuoBi");
        this.addListenerText(this._playNode_fangZuoBi);
        this._playNode_fangZuoBi.addEventListener(this.clickCB, this._playNode_fangZuoBi);

        //防作弊GPS
        this._playNode_gps = this.bg_node.getChildByName("play_gps");
        this.addListenerText(this._playNode_gps);
        this._playNode_gps.addEventListener(this.clickCB, this._playNode_gps);
        COMMON_UI.addHelpUI(this._playNode_gps);
    },

    setPlayNodeCurrentSelect: function(isClub) {
        //七对
        var _qiDui;
        if (isClub)
            _qiDui = this.getBoolItem("qiDui", false);
        else
            _qiDui = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_datongguaisanjiao_qiDui, false);
        this._playNode_qiDui.setSelected(_qiDui);
        var text = this._playNode_qiDui.getChildByName("text");
        this.selectedCB(text, _qiDui);

        //过胡
        var _guoHuZhiNengZiMo;
        if (isClub)
            _guoHuZhiNengZiMo = this.getBoolItem("guoHuZhiNengZiMo", false);
        else
            _guoHuZhiNengZiMo = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_datongguaisanjiao_guoHuZhiNengZiMo, false);
        this._playNode_guoHuZhiNengZiMo.setSelected(_guoHuZhiNengZiMo);
        var text = this._playNode_guoHuZhiNengZiMo.getChildByName("text");
        this.selectedCB(text, _guoHuZhiNengZiMo);

        //轮庄
        var _lunzhuang;
        if (isClub)
            _lunzhuang = this.getBoolItem("guoHuZhiNengZiMo", true);
        else
            _lunzhuang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_datongguaisanjiao_lunzhuang, true);
        this._playNode_lunzhuang.setSelected(_lunzhuang);
        var text = this._playNode_lunzhuang.getChildByName("text");
        this.selectedCB(text, _lunzhuang);


        //底分
        var _fenshu = [1,2,3,4,5,6,7,8,9,10];
        var _idx;
        if (isClub) {
            _idx = this.getNumberItem("difen", 1);
            _idx = _fenshu.indexOf( parseInt(_idx) );
        }else
            _idx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_datongguaisanjiao_difen, 0);
        this._zhuIdx = (_fenshu.length + _idx)%_fenshu.length;
        this._ZhuNum.setString(_fenshu[this._zhuIdx]);

        //防作弊
        var _fangZuoBi;
        if (isClub)
            _fangZuoBi = this.getBoolItem("fangZuoBi", true);
        else
            _fangZuoBi = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_datongguaisanjiao_fangZuoBi, true);
        this._playNode_fangZuoBi.setSelected(_fangZuoBi);
        var text = this._playNode_fangZuoBi.getChildByName("text");
        this.selectedCB(text, _fangZuoBi);

        //防作弊
        var _gps;
        if (isClub)
            _gps = this.getBoolItem("gps", false);
        else
            _gps = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_datongguaisanjiao_gps, false);
        this._playNode_gps.setSelected(_gps);
        var text = this._playNode_gps.getChildByName("text");
        this.selectedCB(text, _gps);

        //人数
        var _playnumIndex = 0;

        /*
        if (isClub)
            _playnumIndex = [3, 4].indexOf(this.getNumberItem("maxPlayer", 3));
        else
            _playnumIndex = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_datongguaisanjiao_maxPlayer, 0);

        if(_playnumIndex == 2 )
        {
            _playnumIndex =  util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_datongguaisanjiao_maxPlayer, 0) == 1 ? 1:0 ;
        }
        */
        this._playNode_player_count_radio.selectItem(_playnumIndex);
        this.radioBoxSelectCB(_playnumIndex, this._countlist[_playnumIndex], this._countlist);

        this.changePayForPlayerNum();
    },

    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.DA_TONG_GUAI_SAN_JIAO;
        para.maxPlayer = 3;
        para.qiDui = false;
        para.guoHuZhiNengZiMo = false;
        para.lunzhuang = false;
        para.difen = 1;

        //底分
        para.difen = this._ZhuNum.getString();

        //七对
        para.qiDui = this._playNode_qiDui.isSelected();

        //轮庄
        para.lunzhuang = this._playNode_lunzhuang.isSelected();

        //防作弊
        para.fangZuoBi = this._playNode_fangZuoBi.isSelected();

        //防作弊
        para.gps = this._playNode_gps.isSelected();

        //过胡只能自摸
        para.guoHuZhiNengZiMo = this._playNode_guoHuZhiNengZiMo.isSelected();

        //人数
        var _countIdx = 0;
        /*
        if (this._playNode_maxPlayer0.isSelected()) {
            para.maxPlayer = 3;
            _countIdx = 0;
        }
        else if (this._playNode_maxPlayer1.isSelected()) {
            para.maxPlayer = 4;
            _countIdx = 1;
        }
        */

        if (!this._isFriendCard) {
	    util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_datongguaisanjiao_difen, Number(this._zhuIdx));
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_datongguaisanjiao_qiDui, para.qiDui);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_datongguaisanjiao_guoHuZhiNengZiMo, para.guoHuZhiNengZiMo);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_datongguaisanjiao_lunzhuang, para.lunzhuang);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_datongguaisanjiao_fangZuoBi, para.fangZuoBi);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_datongguaisanjiao_maxPlayer, _countIdx);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_datongguaisanjiao_gps, para.gps);
        }

        return para;
    }
});