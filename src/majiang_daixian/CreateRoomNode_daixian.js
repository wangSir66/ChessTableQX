/**
 * Created by maoyu on 2017/7/21.
 */


var CreateRoomNode_daixian = CreateRoomNode.extend({
    setKey:function(){
        this.localStorageKey.KEY_daixianmajiang_playType        = "_DAI_XIAN_MA_JIANG_PLAY_TYPE";  //DUO
        this.localStorageKey.KEY_daixianmajiang_difen      = "_DAI_XIAN_MA_JIANG_DI_FEN";     //增分
        this.localStorageKey.KEY_daixianmajiang_count      = "_DAI_XIAN_MA_JIANG_COUNT"; //人数
        this.localStorageKey.KEY_daixianmajiang_lunzhuang      = "_DAI_XIAN_MA_JIANG_LUN_ZHUANG"; //轮庄
        this.localStorageKey.KEY_daixianmajiang_gps      = "_DAI_XIAN_MA_JIANG_GPS"; //防作弊
        this.localStorageKey.KEY_daixianmajiang_bihu      = "_DAI_XIAN_MA_JIANG_HU"; //有胡必胡
        this.localStorageKey.KEY_daixianmajiang_jiacheng      = "_DAI_XIAN_MA_JIANG_JIA_CHENG"; //玩法
        this.localStorageKey.KEY_daixianmajiang_dianpaobaogang      = "_DAI_XIAN_MA_JIANG_DIAN_PAO_BAO_GANG"; //点炮包杠
        this.localStorageKey.KEY_daixianmajiang_pinghu      = "_DAI_XIAN_MA_JIANG_PING_HU"; //
        this.localStorageKey.KEY_daixianmajiang_dankou      = "_DAI_XIAN_MA_JIANG_DAN_KOU"; //
    },
    initAll:function(IsFriendCard)
    {
        if (!IsFriendCard)
            this.setKey();

        this.bg_node = ccs.load("bg_daixian.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_daixian");
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
        this._playNode_playType0 = _play.getChildByName("play_34zimo");
        this._playNode_playType1 = _play.getChildByName("play_345zimo");
        var nodePlayTypeList1 = [];
        nodePlayTypeList1.push(this._playNode_playType0);
        nodePlayTypeList1.push(this._playNode_playType1);
        this._playNode_PlayType_radio = createRadioBoxForCheckBoxs(nodePlayTypeList1, function(index){
            this.changePayForPlayerNum(index);
            this.radioBoxSelectCB(index, nodePlayTypeList1[index], nodePlayTypeList1);
        }.bind(this));
        this.addListenerText(nodePlayTypeList1, this._playNode_PlayType_radio,this.changePayForPlayerNum.bind(this));
        this._playTypelist = nodePlayTypeList1;

        //加成
        this._playNode_jiacheng0 = _play.getChildByName("play_dahufanfan");
        this._playNode_jiacheng1 = _play.getChildByName("play_dahu10");
        this._playNode_jiacheng2 = _play.getChildByName("play_dahu20");
        var nodeJiachengList1 = [];
        nodeJiachengList1.push(this._playNode_jiacheng0);
        nodeJiachengList1.push(this._playNode_jiacheng1);
        nodeJiachengList1.push(this._playNode_jiacheng2);
        this._playNode_Jiacheng_radio = createRadioBoxForCheckBoxs(nodeJiachengList1, function(index){
            this.changePayForPlayerNum(index);
            this.radioBoxSelectCB(index, nodeJiachengList1[index], nodeJiachengList1);
        }.bind(this));
        this.addListenerText(nodeJiachengList1, this._playNode_Jiacheng_radio,this.changePayForPlayerNum.bind(this));
        this._Jiachenglist = nodeJiachengList1;


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

        // 有胡必胡
        this._playNode_biHu = _play.getChildByName("play_biHu");
        this.addListenerText(this._playNode_biHu);
        this._playNode_biHu.addEventListener(this.clickCB, this._playNode_biHu);

        // 平胡
        this._playNode_pinghu = _play.getChildByName("play_pinghu1");
        this.addListenerText(this._playNode_pinghu);
        this._playNode_pinghu.addEventListener(this.clickCB, this._playNode_pinghu);

        // 单口
        this._playNode_dankou = _play.getChildByName("play_dankou1");
        this.addListenerText(this._playNode_dankou);
        this._playNode_dankou.addEventListener(this.clickCB, this._playNode_dankou);

        var that = this;
        this._playNode_pinghu.schedule(function() {
            if(that._playNode_pinghu.isSelected())
            {
                that._playNode_dankou.visible = true;
            }
            else
            {
                that._playNode_dankou.visible = false;
            }
        })

        // 点炮
        this._playNode_dianpaobaogang = _play.getChildByName("play_dianpaobaogang");
        this.addListenerText(this._playNode_dianpaobaogang);
        this._playNode_dianpaobaogang.addEventListener(this.clickCB, this._playNode_dianpaobaogang);


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
            _currentCount = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_daixianmajiang_count, 0);
        cc.log("_currentCount renshu  == " + _currentCount)
        this._playNode_player_count_radio.selectItem(_currentCount);
        this.radioBoxSelectCB(_currentCount, this._countlist[_currentCount], this._countlist);

        var _playType;
        if (isClub)
            _playType = this.getNumberItem("playType", 0);
        else
            _playType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_daixianmajiang_playType, 0);
        this._playNode_PlayType_radio.selectItem(_playType);
        this.radioBoxSelectCB(_playType, this._playTypelist[_playType], this._playTypelist);

        var _Jiacheng;
        if (isClub)
            _Jiacheng = this.getNumberItem("jiacheng", 2);
        else
            _Jiacheng = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_daixianmajiang_jiacheng, 2);
        this._playNode_Jiacheng_radio.selectItem(_Jiacheng);
        this.radioBoxSelectCB(_Jiacheng, this._Jiachenglist[_Jiacheng], this._Jiachenglist);


        // 轮庄
        var _lunzhuang;
        if (isClub)
            _lunzhuang = this.getBoolItem("lunzhuang", true);
        else
            _lunzhuang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_daixianmajiang_lunzhuang, true);
        this._playNode_lunzhuang.setSelected(_lunzhuang);
        var text = this._playNode_lunzhuang.getChildByName("text");
        this.selectedCB(text, _lunzhuang);

        var _fenshu = [1,2,3,4,5,10,20,50,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9];
        var _idx;
        if (isClub) {
            _idx = this.getNumberItem("difen", 1);
            _idx = _fenshu.indexOf( parseInt(_idx) );
        }else
            _idx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_daixianmajiang_difen, 0);
        this._zhuIdx = (_fenshu.length + _idx)%_fenshu.length;
        this._ZhuNum.setString(_fenshu[this._zhuIdx]);

        //防作弊
        var _gps;
        if (isClub)
            _gps = this.getBoolItem("gps", false);
        else
            _gps = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_daixianmajiang_gps, false);
        this._playNode_gps.setSelected(_gps);
        var text = this._playNode_gps.getChildByName("text");
        this.selectedCB(text, _gps);


        // 必胡
        var _biHu;
        if (isClub)
            _biHu = this.getBoolItem("biHu", false);
        else
            _biHu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_daixianmajiang_bihu, false);
        this._playNode_biHu.setSelected(_biHu);
        var text = this._playNode_biHu.getChildByName("text");
        this.selectedCB(text, _biHu);

        // 点炮
        var _dianpao;
        if (isClub)
            _dianpao = this.getBoolItem("dianpaobaogang", false);
        else
            _dianpao = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_daixianmajiang_dianpaobaogang, false);
        this._playNode_dianpaobaogang.setSelected(_dianpao);
        var text = this._playNode_dianpaobaogang.getChildByName("text");
        this.selectedCB(text, _dianpao);

        // 点炮
        var _pinghu;
        if (isClub)
            _pinghu = this.getBoolItem("pinghu", false);
        else
            _pinghu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_daixianmajiang_pinghu, false);
        this._playNode_pinghu.setSelected(_pinghu);
        var text = this._playNode_pinghu.getChildByName("text");
        this.selectedCB(text, _pinghu);

        // 点炮
        var _dankou;
        if (isClub)
            _dankou = this.getBoolItem("dankou", true);
        else
            _dankou = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_daixianmajiang_dankou, true);
        this._playNode_dankou.setSelected(_dankou);
        var text = this._playNode_dankou.getChildByName("text");
        this.selectedCB(text, _dankou);

        // 点炮
        var _dianpao;
        if (isClub)
            _dianpao = this.getBoolItem("dianpaobaogang", false);
        else
            _dianpao = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_daixianmajiang_dianpaobaogang, false);
        this._playNode_dianpaobaogang.setSelected(_dianpao);
        var text = this._playNode_dianpaobaogang.getChildByName("text");
        this.selectedCB(text, _dianpao);


    },
    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.DAI_XIAN_MA_JIANG;
        para.maxPlayer = 4;
        //para.flowerType = WithFlowerType.noFlower;
        //para.liuduo = true;//2018.1.31修改为默认留垛
        para.difen = 1;
        para.wanfa = 0; // 0 34自摸，1 345自摸
        para.lunzhuang = true;
        para.biHu = false; //经典玩法，有胡比胡
        para.jiacheng = 0;// 0 大胡翻番 ， 1 大胡加10 ， 2 大胡加20
        para.dianpaobaogang = false;
        para.convertible = false;//是否自由人数
        //para.gps = !!this._bGPS.isSelected();
        para.pinghu = false;
        para.dankou = true;

        var dankousign = true;
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
            para.wanfa = 0;
        }
        else if (this._playNode_playType1.isSelected()) {
            para.wanfa = 1;
        }

        para.biHu = this._playNode_biHu.isSelected();

        para.dianpaobaogang = this._playNode_dianpaobaogang.isSelected();

        para.pinghu = this._playNode_pinghu.isSelected();
        para.dankou = dankousign = this._playNode_dankou.isSelected();

        if (para.pinghu == false) 
        {
            para.dankou = false;
        }

        //加成
        if (this._playNode_jiacheng0.isSelected()) {
            para.jiacheng = 0;
        }
        else if (this._playNode_jiacheng1.isSelected()) {
            para.jiacheng = 1;
        }
        else if (this._playNode_jiacheng2.isSelected()) {
            para.jiacheng = 2;
        }
        para.difen = this._ZhuNum.getString();
        // 轮庄
        para.lunzhuang = this._playNode_lunzhuang.isSelected();
        //防作弊
        para.gps = this._playNode_gps.isSelected();

        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_daixianmajiang_count, _countIdx)
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_daixianmajiang_playType, para.wanfa);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_daixianmajiang_bihu, para.biHu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_daixianmajiang_dianpaobaogang, para.dianpaobaogang);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_daixianmajiang_playType, para.jiacheng);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_daixianmajiang_difen, Number(this._zhuIdx));
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_daixianmajiang_lunzhuang,  para.lunzhuang);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_daixianmajiang_gps,  para.gps);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_daixianmajiang_pinghu,  para.pinghu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_daixianmajiang_dankou,  dankousign);
        }

        cc.log("createara: " + JSON.stringify(para));
        return para;
    }
});