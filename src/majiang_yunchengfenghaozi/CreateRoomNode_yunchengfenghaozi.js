/**
 * Created by Tom on 2019/01/02.
 */


var CreateRoomNode_yunChengFengHaoZi = CreateRoomNode.extend({
    setKey:function(){
        this.localStorageKey.KEY_yunchengfenghaozi_difen      = "_YUN_CHENG_FENG_HAO_ZI_DI_FEN";     //底分
        this.localStorageKey.KEY_yunchengfenghaozi_count      = "_YUN_CHENG_FENG_HAO_ZI_COUNT";      //人数
        this.localStorageKey.KEY_yunchengfenghaozi_lunzhuang  = "_YUN_CHENG_FENG_HAO_ZI_LUN_ZHUANG"; //轮庄
        this.localStorageKey.KEY_yunchengfenghaozi_gps        = "_YUN_CHENG_FENG_HAO_ZI_GPS";        //防作弊
        this.localStorageKey.KEY_yunchengfenghaozi_zimo       = "_YUN_CHENG_FENG_HAO_ZI_ZI_MO";      //过胡只能自摸
        this.localStorageKey.KEY_yunchengfenghaozi_baogang    = "_YUN_CHENG_FENG_HAO_ZI_BAO_GANG";   //点炮包杠
    },
    initAll:function(IsFriendCard)
    {
        if (!IsFriendCard)
            this.setKey();

        this.bg_node = ccs.load("bg_yunchengfenghaozi.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_yunchengfenghaozi");
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


        //人数
        this._playNode_maxPlayer0 = _play.getChildByName("play_count0");
        this._playNode_maxPlayer1 = _play.getChildByName("play_count1");
        this._playNode_maxPlayer2 = _play.getChildByName("play_count2");
        this._playNode_maxPlayer3 = _play.getChildByName("play_count3");
        var nodeCountList1 = [];
        nodeCountList1.push(_play.getChildByName("play_count0"));
        nodeCountList1.push(_play.getChildByName("play_count1"));
        nodeCountList1.push(_play.getChildByName("play_count2"));
        nodeCountList1.push(_play.getChildByName("play_count3"));        this._playNode_player_count_radio = createRadioBoxForCheckBoxs(nodeCountList1, function(index){
            this.changePayForPlayerNum(index);
            this.radioBoxSelectCB(index, nodeCountList1[index], nodeCountList1);
        }.bind(this));
        this.addListenerText(nodeCountList1, this._playNode_player_count_radio, this.changePayForPlayerNum.bind(this));
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
            if (type === 2) {
                this._zhuIdx = (_arrayLenth + --this._zhuIdx)%_arrayLenth;
                this._ZhuNum.setString(_fenshu[this._zhuIdx]);
                this.setRoomCardModeFree();
            }
        }, this);
        this._Button_add = this.playScroll.getChildByName("btn_add");
        this._Button_add.addTouchEventListener(function(sender, type) {
            if (type === 2) {
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

        // 过胡只能自摸
        this._playNode_zimo = _play.getChildByName("play_zimo");
        this.addListenerText(this._playNode_zimo);
        this._playNode_zimo.addEventListener(this.clickCB, this._playNode_zimo);

        // 点炮包杠
        this._playNode_baogang = _play.getChildByName("play_baogang");
        this.addListenerText(this._playNode_baogang);
        this._playNode_baogang.addEventListener(this.clickCB, this._playNode_baogang);


        // 轮庄
        this._playNode_lunzhuang = _play.getChildByName("play_lunzhuang");
        this.addListenerText(this._playNode_lunzhuang);
        this._playNode_lunzhuang.addEventListener(this.clickCB, this._playNode_lunzhuang);

    },
    setPlayNodeCurrentSelect: function(isClub) {

        var _fenshu = [1,2,3,4,5,10,20,50,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9];
        var _idx;
        if (isClub) {
            _idx = this.getNumberItem("difen", 1);
            _idx = _fenshu.indexOf( parseInt(_idx) );
        }else
            _idx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_yunchengfenghaozi_difen, 0);
        this._zhuIdx = (_fenshu.length + _idx)%_fenshu.length;
        this._ZhuNum.setString(_fenshu[this._zhuIdx]);

        // 防作弊
        var _gps;
        if (isClub)
            _gps = this.getBoolItem("gps", false);
        else
            _gps = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_yunchengfenghaozi_gps, false);
        this._playNode_gps.setSelected(_gps);
        var text = this._playNode_gps.getChildByName("text");
        this.selectedCB(text, _gps);

        //人数
        var _currentCount;
        if (isClub) {
            if (this.getBoolItem("convertible", false))
                _currentCount = 3;
            else
                _currentCount = [4, 3, 2].indexOf(this.getNumberItem("maxPlayer", 4));
        }
        else
            _currentCount = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_yunchengfenghaozi_count, 0);
        this._playNode_player_count_radio.selectItem(_currentCount);
        this.radioBoxSelectCB(_currentCount, this._countlist[_currentCount], this._countlist);

        //轮庄
        var _lunzhuang;
        if (isClub)
            _lunzhuang = this.getBoolItem("lunzhuang", true);
        else
            _lunzhuang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_yunchengfenghaozi_lunzhuang, true);
        this._playNode_lunzhuang.setSelected(_lunzhuang);
        var text = this._playNode_lunzhuang.getChildByName("text");
        this.selectedCB(text, _lunzhuang);


        // 点炮包杠
        var _baogang;
        if (isClub)
            _baogang = this.getBoolItem("baogang", false);
        else
            _baogang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_yunchengfenghaozi_baogang, false);
        this._playNode_baogang.setSelected(_baogang);
        var text = this._playNode_baogang.getChildByName("text");
        this.selectedCB(text, _baogang);


        // 过胡只能自摸
        var _zimo;
        if (isClub)
            _zimo = this.getBoolItem("guoHuZiMo", false);
        else
            _zimo = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_yunchengfenghaozi_zimo, false);
        this._playNode_zimo.setSelected(_zimo);
        var text = this._playNode_zimo.getChildByName("text");
        this.selectedCB(text, _zimo);

        this.changePayForPlayerNum();
    },
    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.YUN_CHENG_FENG_HAO_ZI;
        para.maxPlayer = 4;
        para.difen = 1;
        para.lunzhuang = true;
        para.guoHuZiMo = false;      //过胡只能自摸
        para.baogang = false;   //点炮包杠
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

        para.difen = this._ZhuNum.getString();
        para.lunzhuang = this._playNode_lunzhuang.isSelected();
        para.baogang = this._playNode_baogang.isSelected();
        para.guoHuZiMo = this._playNode_zimo.isSelected();
        para.gps = this._playNode_gps.isSelected();

        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_yunchengfenghaozi_count, _countIdx);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_yunchengfenghaozi_difen, Number(this._zhuIdx));
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_yunchengfenghaozi_lunzhuang,  para.lunzhuang);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_yunchengfenghaozi_baogang,  para.baogang);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_yunchengfenghaozi_zimo,  para.guoHuZiMo);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_yunchengfenghaozi_gps,  para.gps);
        }
        cc.log("yunchengfenghaozi  createara: " + JSON.stringify(para));
        return para;
    }
});