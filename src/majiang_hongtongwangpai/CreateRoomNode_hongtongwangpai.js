/**
 * Created by maoyu on 2017/7/21.
 */


var CreateRoomNode_hongtongwangpai = CreateRoomNode.extend({
    setKey:function(){
        this.localStorageKey.KEY_hongtongwangpai_wanfa        = "_HONG_TONG_WANG_PAI_WAN_FA";//玩法
        this.localStorageKey.KEY_hongtongwangpai_difen      = "_HONG_TONG_WANG_PAI_DI_FEN";     //增分
        this.localStorageKey.KEY_hongtongwangpai_count      = "_HONG_TONG_WANG_PAI_COUNT"; //人数
        this.localStorageKey.KEY_hongtongwangpai_lunzhuang      = "_HONG_TONG_WANG_PAI_LUN_ZHUANG"; //轮庄
        this.localStorageKey.KEY_hongtongwangpai_liuduo      = "_HONG_TONG_WANG_PAI_LIU_DUO"; //留垛
        this.localStorageKey.KEY_hongtongwangpai_mianpeng      = "_HONG_TONG_WANG_PAI_MIAN_PENG"; //轮庄
        this.localStorageKey.KEY_hongtongwangpai_gangsuihu      = "CF_HONG_TONG_WANG_PAI_GANG_SUI_HU"; //轮庄
        this.localStorageKey.KEY_hongtongwangpai_gps      = "_HONG_TONG_WANG_PAI_GANG_GPS"; //轮庄
        this.localStorageKey.KEY_hongtongwangpai_daiwangqingyise      = "_HONG_TONG_WANG_PAI_GANG_DWQYS"; //轮庄
    },
    initAll:function(IsFriendCard)
    {
        if (!IsFriendCard)
            this.setKey();

        this.bg_node = ccs.load("bg_hongtongwangpai.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_hongtongwangpai");
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
        this._playNode_playType0 = _play.getChildByName("play_sepai");
        this._playNode_playType1 = _play.getChildByName("play_pinghu");
        this._playNode_playType2 = _play.getChildByName("play_dajiangwangheifengbao");
        this._playNode_playType3 = _play.getChildByName("play_duiwangdajiangbao");
        var nodePlayTypeList1 = [];
        nodePlayTypeList1.push(this._playNode_playType0);
        nodePlayTypeList1.push(this._playNode_playType1);
        nodePlayTypeList1.push(this._playNode_playType2);
        nodePlayTypeList1.push(this._playNode_playType3);
        this._playNode_PlayType_radio = createRadioBoxForCheckBoxs(nodePlayTypeList1, function(index){
            this.changePayForPlayerNum(index);
            this.radioBoxSelectCB(index, nodePlayTypeList1[index], nodePlayTypeList1);
        }.bind(this));
        this.addListenerText(nodePlayTypeList1, this._playNode_PlayType_radio,this.changePayForPlayerNum.bind(this));
        this._playTypelist = nodePlayTypeList1;


        // 轮庄
        this._playNode_lunzhuang = _play.getChildByName("play_lunzhuang");
        this.addListenerText(this._playNode_lunzhuang);
        this._playNode_lunzhuang.addEventListener(this.clickCB, this._playNode_lunzhuang);

                // 留垛
        this._playNode_liuduo = _play.getChildByName("play_liuduo");
        this.addListenerText(this._playNode_liuduo);
        this._playNode_liuduo.addEventListener(this.clickCB, this._playNode_liuduo);

        // 留垛
        this._playNode_daiwangqingyise = _play.getChildByName("play_daiwangqingyise");
        this.addListenerText(this._playNode_daiwangqingyise);
        this._playNode_daiwangqingyise.addEventListener(this.clickCB, this._playNode_daiwangqingyise);

                // 杠随胡
        this._playNode_gangsuihu = _play.getChildByName("play_gangsuihu");
        this.addListenerText(this._playNode_gangsuihu);
        this._playNode_gangsuihu.addEventListener(this.clickCB, this._playNode_gangsuihu);

                // 免碰
        this._playNode_mianpeng = _play.getChildByName("play_mianpeng");
        this.addListenerText(this._playNode_mianpeng);
        this._playNode_mianpeng.addEventListener(this.clickCB, this._playNode_mianpeng);

        //底分
        this._zhuIdx = 0;//数组的引索
        var _fenshu = [1,2,3,4,5,6,7,8,9,10,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9];
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

    },
    setPlayNodeCurrentSelect: function(isClub) {

        // // //留朵 ,不留
        // var _duoIdx = 0;
        // var _duoCount = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_koudian_duo, true);
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
            _currentCount = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_hongtongwangpai_count, 0);
        cc.log("_currentCount renshu  == " + _currentCount)
        this._playNode_player_count_radio.selectItem(_currentCount);
        this.radioBoxSelectCB(_currentCount, this._countlist[_currentCount], this._countlist);


        var _wanfa;
        if (isClub)
            _wanfa = this.getStringItem("wanfa", "sepai");
        else
            _wanfa = util.localStorageEncrypt.getStringItem(this.localStorageKey.KEY_hongtongwangpai_wanfa, "sepai");
        var wanftype = 0;
        if (_wanfa == "sepai") 
        {
            wanftype = 0;
        }
        else if (_wanfa == "pinghu") 
        {
            wanftype = 1;
        }
        else if (_wanfa == "dajiangwangheifengbao") 
        {
            wanftype = 2;
        }
        else if (_wanfa == "duiwangdajiangbao") 
        {
            wanftype = 3;
        }
        this._playNode_PlayType_radio.selectItem(wanftype);
        this.radioBoxSelectCB(wanftype, this._playTypelist[wanftype], this._playTypelist);

        // 轮庄
        var _lunzhuang; 
        if (isClub)
            _lunzhuang = this.getBoolItem("lunzhuang", false);
        else
            _lunzhuang= util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_hongtongwangpai_lunzhuang, false);
        this._playNode_lunzhuang.setSelected(_lunzhuang);
        var text = this._playNode_lunzhuang.getChildByName("text");
        this.selectedCB(text, _lunzhuang);

        //留垛
        var _liuduo;
        if (isClub)
            _liuduo= this.getBoolItem("liuduo", false);
        else
            _liuduo=util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_hongtongwangpai_liuduo, true);
        this._playNode_liuduo.setSelected(_liuduo);
        var text = this._playNode_liuduo.getChildByName("text");
        this.selectedCB(text,_liuduo);

        //杠随胡走
        var _gangsuihu;
        if (isClub)
            _gangsuihu= this.getBoolItem("gangsuihu",false);
        else
            _gangsuihu=util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_hongtongwangpai_gangsuihu,false);
        this._playNode_gangsuihu.setSelected(_gangsuihu);
        var text=this._playNode_gangsuihu.getChildByName("text");
        this.selectedCB(text,_gangsuihu);

        //杠随胡走
        var _daiwangqingyise;
        if (isClub)
            _daiwangqingyise= this.getBoolItem("daiwangqingyise",false);
        else
            _daiwangqingyise=util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_hongtongwangpai_daiwangqingyise,false);
        this._playNode_daiwangqingyise.setSelected(_daiwangqingyise);
        var text=this._playNode_daiwangqingyise.getChildByName("text");
        this.selectedCB(text,_daiwangqingyise);

        //免碰
        var _mianpeng;
        if (isClub)
            _mianpeng= this.getBoolItem("mianpeng",false);
        else
            _mianpeng=util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_hongtongwangpai_mianpeng,false);
        this._playNode_mianpeng.setSelected(_mianpeng);
        var text = this._playNode_mianpeng.getChildByName("text");
        this.selectedCB(text,_mianpeng);

        var _fenshu = [1,2,3,4,5,6,7,8,9,10,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9];
        var _idx;
        if (isClub)
            _idx = _fenshu.indexOf(this.getNumberItem("difen", 1));
        else
            _idx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_hongtongwangpai_difen, 0);
        this._zhuIdx = (_fenshu.length + _idx)%_fenshu.length;
        this._ZhuNum.setString(_fenshu[this._zhuIdx]);

        //防作弊
        var _gps;
        if (isClub)
            _gps = this.getBoolItem("gps",false);
        else
            _gps = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_hongtongwangpai_gps, false);
        this._playNode_gps.setSelected(_gps);
        var text = this._playNode_gps.getChildByName("text");
        this.selectedCB(text, _gps);

        this.changePayForPlayerNum();
    },
    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.HONG_TONG_WANG_PAI;
        para.maxPlayer = 4;
        //para.flowerType = WithFlowerType.noFlower;
        //para.liuduo = true;//2018.1.31修改为默认留垛
        para.difen = 1;
        para.wanfa = "sepai"; // 0 经典，1 不带风，2 带耗子
        para.lunzhuang = false;
        para.liuduo = false;
        para.mianpeng = false;
        para.gangsuihu = false;
        para.daiwangqingyise = false;
        para.convertible = false;//是否自由人数

        if(this._nodeGPS) para.gps = this._nodeGPS.isSelected();
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

        //玩法
        if (this._playNode_playType0.isSelected()) {
            para.wanfa = "sepai";
        }
        else if (this._playNode_playType1.isSelected()) {
            para.wanfa = "pinghu";
        }
        else if (this._playNode_playType2.isSelected()) {
            para.wanfa = "dajiangwangheifengbao";
        }
        else if (this._playNode_playType3.isSelected()) {
            para.wanfa = "duiwangdajiangbao";
        }

        para.difen = Number(this._ZhuNum.getString());

        // 轮庄
        para.lunzhuang = this._playNode_lunzhuang.isSelected();

        para.liuduo = this._playNode_liuduo.isSelected();

        para.gangsuihu = this._playNode_gangsuihu.isSelected();

        para.mianpeng = this._playNode_mianpeng.isSelected();

        para.daiwangqingyise = this._playNode_daiwangqingyise.isSelected();

          //防作弊
        para.gps = this._playNode_gps.isSelected();
        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_hongtongwangpai_count, _countIdx)
            util.localStorageEncrypt.setStringItem(this.localStorageKey.KEY_hongtongwangpai_wanfa, para.wanfa);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_hongtongwangpai_difen, Number(this._zhuIdx));
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_hongtongwangpai_lunzhuang,  para.lunzhuang);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_hongtongwangpai_liuduo,  para.liuduo);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_hongtongwangpai_gangsuihu,  para.gangsuihu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_hongtongwangpai_mianpeng,  para.mianpeng);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_hongtongwangpai_gps, para.gps);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_hongtongwangpai_daiwangqingyise, para.daiwangqingyise);
        }
        cc.log("createara: " + JSON.stringify(para));
        return para;
    }
});