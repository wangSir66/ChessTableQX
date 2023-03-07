/**
 * Created by Tom on 2019/01/03.
 */

var CreateRoomNode_jiShanNiuYeZi = CreateRoomNode.extend({
    setKey:function(){
        this.localStorageKey.KEY_jishanniuyezi_difen             = "_JI_SHAN_NIU_YE_ZI_DI_FEN"; //底分
        this.localStorageKey.KEY_jishanniuyezi_maxPlayer         = "_JI_SHAN_NIU_YE_ZI_MAX_PLAYER"; //人数
        this.localStorageKey.KEY_jishanniuyezi_daiFeng           = "_JI_SHAN_NIU_YE_ZI_DAI_FENG"; //带风
        this.localStorageKey.KEY_jishanniuyezi_lunzhuang         = "_JI_SHAN_NIU_YE_ZI_LUN_ZHUANG"; //底分
        this.localStorageKey.KEY_jishanniuyezi_zhiKeZiMoHu       = "_JI_SHAN_NIU_YE_ZI_ZHI_KE_ZI_MO_HU"; //只可自摸胡
        this.localStorageKey.KEY_jishanniuyezi_liuPai            = "_JI_SHAN_NIU_YE_ZI_LIU_PAI"; //留牌
        this.localStorageKey.KEY_jishanniuyezi_tingPaiBuKou      = "_JI_SHAN_NIU_YE_ZI_TING_PAI_BU_KOU"; //听牌不扣
        this.localStorageKey.KEY_jishanniuyezi_gps               = "_JI_SHAN_NIU_YE_ZI_GPS"; //gps防作弊
    },

    initAll:function(IsFriendCard)
    {
        if (!IsFriendCard)
            this.setKey();

        this.bg_node = ccs.load("bg_jishanniuyezi.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_jishanniuyezi");
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

        //底分
        this._zhuIdx = 0;//数组的引索
        var _fenshu = [1,2,3,4,5,6,7,8,9,10];
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
        }.bind(this), 0);
        this.addListenerText(nodeCountList1, this._playNode_player_count_radio, this.changePayForPlayerNum.bind(this));
        this._countlist = nodeCountList1;
        this.initPlayNumNode(nodeCountList1, [4, 3, 2, 4]);


        //留牌
        this._playNode_liupai0 = _play.getChildByName("play_liuPai0");    //不留
        this._playNode_liupai1 = _play.getChildByName("play_liuPai1");    //杠留一张
        this._playNode_liupai2 = _play.getChildByName("play_liuPai2");    //杠留两张
        var nodeLiuPaiList = [this._playNode_liupai0, this._playNode_liupai1, this._playNode_liupai2];
        this._playNode_player_liupai_radio = createRadioBoxForCheckBoxs(nodeLiuPaiList, function(index){
            this.changePayForPlayerNum(index);
            this.radioBoxSelectCB(index, nodeLiuPaiList[index], nodeLiuPaiList);
        }.bind(this), 0);
        this.addListenerText(nodeLiuPaiList, this._playNode_player_liupai_radio, this.changePayForPlayerNum.bind(this));
        this._nodeLiuPaiList = nodeLiuPaiList;

        //带风
        this._playNode_daiFeng = _play.getChildByName("play_daiFeng");
        this.addListenerText(this._playNode_daiFeng);
        this._playNode_daiFeng.addEventListener(this.clickCB, this._playNode_daiFeng);

        //轮庄
        this._playNode_lunzhuang = _play.getChildByName("play_lunzhuang");
        this.addListenerText(this._playNode_lunzhuang);
        this._playNode_lunzhuang.addEventListener(this.clickCB, this._playNode_lunzhuang);

        //只能自摸胡
        this._playNode_zhiKeZiMoHu = _play.getChildByName("play_zhiKeZiMoHu");
        this.addListenerText(this._playNode_zhiKeZiMoHu);
        this._playNode_zhiKeZiMoHu.addEventListener(this.clickCB, this._playNode_zhiKeZiMoHu);

        //听牌不扣
        this._playNode_tingPaiBuKou = _play.getChildByName("play_tingPaiBuKou");
        this.addListenerText(this._playNode_tingPaiBuKou);
        this._playNode_tingPaiBuKou.addEventListener(this.clickCB, this._playNode_tingPaiBuKou);

        //防作弊GPS
        this._playNode_gps = this.bg_node.getChildByName("play_gps");
        this.addListenerText(this._playNode_gps);
        this._playNode_gps.addEventListener(this.clickCB, this._playNode_gps);
        COMMON_UI.addHelpUI(this._playNode_gps);
    },

    setPlayNodeCurrentSelect: function(isClub) {
        //带风
        var _daiFeng;
        if (isClub)
            _daiFeng = this.getBoolItem("daiFeng", false);
        else
            _daiFeng = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_jishanniuyezi_daiFeng, false);
        this._playNode_daiFeng.setSelected(_daiFeng);
        var text = this._playNode_daiFeng.getChildByName("text");
        this.selectedCB(text, _daiFeng);

        //轮庄
        var _lunzhuang;
        if (isClub)
            _lunzhuang = this.getBoolItem("lunzhuang", false);
        else
            _lunzhuang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_jishanniuyezi_lunzhuang, false);
        this._playNode_lunzhuang.setSelected(_lunzhuang);
        var text = this._playNode_lunzhuang.getChildByName("text");
        this.selectedCB(text, _lunzhuang);

        //只能自摸胡
        var _zhiKeZiMoHu;
        if (isClub)
            _zhiKeZiMoHu = this.getBoolItem("zhiKeZiMoHu", false);
        else
            _zhiKeZiMoHu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_jishanniuyezi_zhiKeZiMoHu, false);
        this._playNode_zhiKeZiMoHu.setSelected(_zhiKeZiMoHu);
        var text = this._playNode_zhiKeZiMoHu.getChildByName("text");
        this.selectedCB(text, _zhiKeZiMoHu);

        //底分
        var _fenshu = [1,2,3,4,5,6,7,8,9,10];
        var _idx;
        if (isClub) {
            _idx = this.getNumberItem("difen", 1);
            _idx = _fenshu.indexOf( parseInt(_idx) );
        }else
            _idx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_jishanniuyezi_difen, 0);
        this._zhuIdx = (_fenshu.length + _idx)%_fenshu.length;
        this._ZhuNum.setString(_fenshu[this._zhuIdx]);


        //防作弊
        var _gps;
        if (isClub)
            _gps = this.getBoolItem("gps", false);
        else
            _gps = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_jishanniuyezi_gps, false);
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
            _currentCount = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_jishanniuyezi_maxPlayer, 0);
        this._playNode_player_count_radio.selectItem(_currentCount);
        this.radioBoxSelectCB(_currentCount, this._countlist[_currentCount], this._countlist);


        //留牌
        var _liuPaiType;
        if (isClub)
            _liuPaiType = this.getNumberItem("liuPaiType", 0);
        else
            _liuPaiType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_jishanniuyezi_liuPai, 0);
        this._playNode_player_liupai_radio.selectItem(_liuPaiType);
        this.radioBoxSelectCB(_liuPaiType, this._nodeLiuPaiList[_liuPaiType], this._nodeLiuPaiList);


        //听牌不扣
        var _tingPaiBuKou;
        if (isClub)
            _tingPaiBuKou = this.getBoolItem("tingPaiBuKou", false);
        else
            _tingPaiBuKou = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_jishanniuyezi_tingPaiBuKou, false);
        this._playNode_tingPaiBuKou.setSelected(_tingPaiBuKou);
        var text = this._playNode_tingPaiBuKou.getChildByName("text");
        this.selectedCB(text, _tingPaiBuKou);

        this.changePayForPlayerNum();
    },

    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.JI_SHAN_NIU_YE_ZI;
        para.maxPlayer = 4;
        para.zhiKeZiMoHu = false;
        para.daiFeng = false;
        para.difen = 1;
        para.convertible = false;//是否自由人数

        para.difen = this._ZhuNum.getString();
        para.gps = this._playNode_gps.isSelected();
        para.zhiKeZiMoHu = this._playNode_zhiKeZiMoHu.isSelected();
        para.daiFeng = this._playNode_daiFeng.isSelected();
        para.lunzhuang = this._playNode_lunzhuang.isSelected();
        para.tingPaiBuKou = this._playNode_tingPaiBuKou.isSelected();//听牌不扣


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


        //留牌 0:不留牌   1:杠留一张   2:杠留两张
        if (this._playNode_liupai0.isSelected()) {
            para.liuPaiType = 0;
        }
        else if (this._playNode_liupai1.isSelected()) {
            para.liuPaiType = 1;
        }
        else if (this._playNode_liupai2.isSelected()) {
            para.liuPaiType = 2;
        }

        if (!this._isFriendCard) {
	        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_jishanniuyezi_difen, Number(this._zhuIdx));
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_jishanniuyezi_gps, para.gps);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_jishanniuyezi_zhiKeZiMoHu, para.zhiKeZiMoHu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_jishanniuyezi_daiFeng, para.daiFeng);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_jishanniuyezi_lunzhuang, para.lunzhuang);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_jishanniuyezi_maxPlayer, _countIdx);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_jishanniuyezi_liuPai, para.liuPaiType);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_jishanniuyezi_tingPaiBuKou, para.tingPaiBuKou);
        }

        cc.log("NiuYeZi createara: " + JSON.stringify(para));

        return para;
    }
});